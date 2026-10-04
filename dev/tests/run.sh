#!/usr/bin/env bash
# 喵站 · 全量测试：后端接口 + 前后端同源 UI + 后台管理（每个测试自起自停后端）
# 测试一律使用独立临时库并强制 MIAO_NO_MAIL=1，不会碰到正式 data/，也不会真发信
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
SRV="$HERE/../backend"
. "$SRV/pick-node.sh"
node_or_die >/dev/null || exit 1
export NODE_NO_WARNINGS=1
# UI 测试需要 jsdom：装在别处时用 .env 的 NODE_PATH 指过去
EC=0
echo "===== 后端接口测试 ====="
"$NODE" "$HERE/api-test.js" || EC=1
echo
echo "===== 前后端同源 UI E2E ====="
"$NODE" "$HERE/ui-e2e.js" || EC=1
echo
echo "===== 后台管理系统 E2E ====="
"$NODE" "$HERE/admin-test.js" || EC=1
echo
[ "$EC" -eq 0 ] && echo "全部通过 ✔" || echo "存在失败 ✘"
exit $EC
