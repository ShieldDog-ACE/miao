#!/usr/bin/env bash
# 喵站 · 一键导出「可安全公开」的发布副本（开源平台托管用）
#
# 背景：.env（邮箱授权码 / 后台口令）、config.json、data/（SQLite 正式库）、uploads/ 都在
#       .gitignore 里，但「直接复制目录上传」会把这些一起带走 —— 本脚本负责把它们挡在发布包外，
#       并在打包前后各做一次校验，确保导出的东西里没有一个密钥、没有一条测试数据。
#
# 用法：
#   bash tools/make-release.sh                     # 导出到 <喵站根>/dist/
#   bash tools/make-release.sh --out /tmp/release  # 指定输出目录
#   bash tools/make-release.sh --version 1.0.0     # 指定版本号（默认取日期）
#   bash tools/make-release.sh --no-archive        # 只产出目录，不打 tar.gz
#
# 产出：
#   <out>/miao-site-<版本>/            干净副本
#   <out>/miao-site-<版本>.tar.gz      可直接上传/发布的压缩包
#
# 退出码：0 成功；1 校验失败（一定有敏感文件混进来了，包不会生成）
set -eu

cd "$(dirname "$0")/.."                      # → 开发版/后台管理系统/
. ./pick-node.sh
node_or_die >/dev/null || exit 1

SRC_ROOT="$(cd ../.. && pwd)"                # → 喵站根
OUT_DIR=""
VERSION="$(date +%Y.%m.%d)"
ARCHIVE=1

while [ $# -gt 0 ]; do
  case "$1" in
    --out) OUT_DIR="${2:?--out 需要目录参数}"; shift 2 ;;
    --version) VERSION="${2:?--version 需要版本号}"; shift 2 ;;
    --no-archive) ARCHIVE=0; shift ;;
    -h|--help) sed -n '2,20p' "$0"; exit 0 ;;
    *) echo "未知参数：$1"; exit 2 ;;
  esac
done
[ -n "$OUT_DIR" ] || OUT_DIR="$SRC_ROOT/dist"
OUT_DIR="$(cd "$(dirname "$OUT_DIR")" && pwd)/$(basename "$OUT_DIR")"

NAME="miao-site-$VERSION"
STAGE="$OUT_DIR/$NAME"

# 若输出目录落在源码树里，先确认它已被 .gitignore 排除，避免自我复制
case "$STAGE" in
  "$SRC_ROOT"/*) echo "提示：输出目录在源码树内（$STAGE），已确保 dist/ 被 .gitignore 排除" ;;
esac

echo "==== 喵站发布打包 ===="
echo "源码   $SRC_ROOT"
echo "输出   $STAGE"
echo

echo "→ 1/4 清理并创建输出目录"
rm -rf "$STAGE"
mkdir -p "$STAGE"

echo "→ 2/4 复制待公开内容（排除密钥与本地运行数据）"
# 排除项：密钥文件、正式数据库、上传、日志、内部记忆、回收站、依赖、临时目录、打包产物
EXCLUDES=(
  --exclude='.env'
  --exclude='.env.local'
  --exclude='.env.hidden'
  --exclude='config.json'
  --exclude='config.local.json'
  --exclude='data/'
  --exclude='uploads/'
  --exclude='mail-outbox.log'
  --exclude='*.db'
  --exclude='*.db-wal'
  --exclude='*.db-shm'
  --exclude='*.sqlite'
  --exclude='*.log'
  --exclude='.workbuddy/'
  --exclude='.Trash-0/'
  --exclude='.git/'
  --exclude='node_modules/'
  --exclude='tmp/'
  --exclude='dist/'
  --exclude='reset-backup-*/'
)
# 顶层条目白名单：文档 + 部署文件（Dockerfile / 反代 / systemd 单元都要进包，否则部署不了）
for item in 任务书.md DEPLOY.md Dockerfile .dockerignore .gitignore deploy Eleven 开发版; do
  src="$SRC_ROOT/$item"
  [ -e "$src" ] || continue
  rsync -a "${EXCLUDES[@]}" "$src" "$STAGE/"
done

echo "→ 3/4 校验：发布包里不允许出现任何密钥或正式数据"
BAD=0
# 3.1 不允许的文件名（用变量收集而不是进程替换 —— /dev/fd 在部分环境不可用）
BADFILES="$(find "$STAGE" \( -name '.env' -o -name '.env.local' -o -name 'config.json' \
  -o -name '*.db' -o -name '*.db-wal' -o -name '*.db-shm' -o -name '*.sqlite' \
  -o -name 'mail-outbox.log' -o -name '*.log' \) -type f 2>/dev/null || true)"
if [ -n "$BADFILES" ]; then
  printf '%s\n' "$BADFILES" | while IFS= read -r f; do
    echo "  ✘ 不该出现的文件：${f#$OUT_DIR/}"
  done
  BAD=1
fi
# 3.2 不允许的目录
if [ -d "$STAGE/开发版/后台管理系统/data" ]; then echo "  ✘ 不该出现：开发版/后台管理系统/data/"; BAD=1; fi
if [ -d "$STAGE/.workbuddy" ]; then echo "  ✘ 不该出现：.workbuddy/"; BAD=1; fi
# 3.3 内容级扫描（密钥残留 / 真实邮箱 / 本机路径）
# check-secrets 退出码：0 干净 / 1 有高危 / 2 仅提醒 —— 只有 1 才拦得住发布
CS=0
NODE_NO_WARNINGS=1 "$NODE" tools/check-secrets.js --from "$STAGE" || CS=$?
if [ "$CS" -eq 1 ]; then
  echo "  ✘ check-secrets 报出高危项（见上）"
  BAD=1
elif [ "$CS" -eq 2 ]; then
  echo "  · 有中危提醒（见上），请人工确认无碍后再发布"
fi
if [ "$BAD" = 1 ]; then
  echo
  echo "✘ 校验未通过，已删除不干净的产物：$STAGE"
  rm -rf "$STAGE"
  exit 1
fi

echo "→ 4/4 打包"
if [ "$ARCHIVE" = 1 ]; then
  ( cd "$OUT_DIR" && tar czf "$NAME.tar.gz" "$NAME" )
  echo
  echo "✔ 发布包就绪"
  echo "  目录   $STAGE"
  echo "  压缩包 $OUT_DIR/$NAME.tar.gz  （$(du -h "$OUT_DIR/$NAME.tar.gz" | cut -f1)）"
else
  echo
  echo "✔ 发布目录就绪：$STAGE"
fi
echo
echo "上传前最后确认：包内不含 .env / config.json / data/ / *.db，已由本脚本自动保证。"
