#!/usr/bin/env bash
# 喵站 · 重置数据：删掉 SQLite 库并重新导入 seed-data.js 的最新正文
# 用途：教程正文存在 SQLite 里，只改 seed-data.js 不会影响已入库内容 —— 需要重置才生效；
#       也可用于清空测试账号/测试浏览记录，得到一个干净的初始站。
# 用法：bash reset-data.sh [--yes] [--uploads]
#   --yes      跳过确认
#   --uploads  连同 uploads/ 里上传的图片一起清空（默认保留）
# 注意：.env / config.json 不受影响。
set -eu
cd "$(dirname "$0")"
. ./pick-node.sh

DATA_DIR="${MIAO_DATA_DIR:-$PWD/data}"
TS="$(date +%Y%m%d-%H%M%S)"
BACKUP="$DATA_DIR/reset-backup-$TS"
DELETE_UPLOADS=0
ASSUME_YES=0
for arg in "$@"; do
  case "$arg" in
    --yes) ASSUME_YES=1 ;;
    --uploads) DELETE_UPLOADS=1 ;;
    *) echo "未知参数：$arg"; exit 2 ;;
  esac
done

echo "将删除 $DATA_DIR 下的 miao.db*（含全部用户、会话、作品、浏览记录、封禁）"
if [ "$DELETE_UPLOADS" = 1 ]; then echo "并清空 uploads/ 内已上传图片"; fi
echo "现有数据会先备份到 $BACKUP"
if [ "$ASSUME_YES" != 1 ]; then
  printf "确认执行？输入 yes 继续："; read -r REPLY
  [ "$REPLY" = "yes" ] || { echo "已取消"; exit 1; }
fi

echo "→ 停止服务"
bash stop.sh || true

node_or_die >/dev/null || exit 1

if [ -d "$BACKUP" ]; then echo "备份目录已存在，中止：$BACKUP"; exit 1; fi
mkdir -p "$BACKUP"
shopt -s nullglob
for f in "$DATA_DIR"/miao.db "$DATA_DIR"/miao.db-wal "$DATA_DIR"/miao.db-shm "$DATA_DIR"/mail-outbox.log; do
  if [ -e "$f" ]; then cp -a "$f" "$BACKUP/"; fi
done
shopt -u nullglob
rm -f "$DATA_DIR"/miao.db "$DATA_DIR"/miao.db-wal "$DATA_DIR"/miao.db-shm "$DATA_DIR"/mail-outbox.log
echo "→ 旧库已移入备份：$BACKUP"

if [ "$DELETE_UPLOADS" = 1 ]; then
  shopt -s nullglob
  for f in "$DATA_DIR"/uploads/* "$PWD"/uploads/*; do
    if [ -f "$f" ]; then cp -a "$f" "$BACKUP/"; rm -f "$f"; fi
  done
  shopt -u nullglob
  echo "→ 已清空上传目录（原文件在备份目录）"
fi

echo "→ 重新导入 seed-data.js"
NODE_NO_WARNINGS=1 "$NODE" -e '
const dbm = require("./db");
const seeded = dbm.seedIfEmpty();
dbm.db.exec("PRAGMA wal_checkpoint(TRUNCATE)");
const c = (s) => dbm.get(s).c;
console.log("[reset] 演示教程 " + (seeded ? "已导入" : "未导入（seedDemo=false 或无种子源）"));
console.log("[reset] 当前库：教程 " + c("SELECT COUNT(*) c FROM tutorials") +
  " 篇 / 用户 " + c("SELECT COUNT(*) c FROM users") +
  " 个 / 作品 " + c("SELECT COUNT(*) c FROM works") +
  " 篇 / 会话 " + c("SELECT COUNT(*) c FROM sessions") +
  " 条 / 封禁 " + c("SELECT COUNT(*) c FROM bans"));
dbm.db.close();
'

echo "✔ 重置完成。接着运行 node tools/sync-seed.js 同步前端兜底副本，然后 bash start.sh 启动。"
