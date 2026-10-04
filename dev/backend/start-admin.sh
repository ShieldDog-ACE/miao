#!/usr/bin/env bash
# 喵站后台管理系统启动脚本：自动选用支持 node:sqlite 的 Node（>= 22.5）
set -e
cd "$(dirname "$0")"
. ./pick-node.sh
node_or_die || exit 1
export NODE_NO_WARNINGS=1
exec "$NODE" admin.js
