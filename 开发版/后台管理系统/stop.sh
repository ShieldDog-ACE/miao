#!/usr/bin/env bash
# 喵站停止脚本：关掉前台(8787)与后台管理系统(8788)
# 用法：bash stop.sh
set -u

PORTS="${MIAO_PORTS:-8787 8788}"
KILLED=0

for P in $PORTS; do
  # 方式1：ss 找监听该端口的 pid
  PIDS=$(ss -ltnp 2>/dev/null | awk -v pat=":${P}\$" '$4 ~ pat' | grep -o 'pid=[0-9]*' | cut -d= -f2 | sort -u)
  # 方式2：lsof
  if [ -z "$PIDS" ] && command -v lsof >/dev/null 2>&1; then
    PIDS=$(lsof -ti tcp:"$P" 2>/dev/null || true)
  fi
  # 方式3：fuser
  if [ -z "$PIDS" ] && command -v fuser >/dev/null 2>&1; then
    PIDS=$(fuser -n tcp "$P" 2>/dev/null | tr -s ' ' '\n' | grep -E '^[0-9]+$' || true)
  fi
  for pid in $PIDS; do
    if kill -9 "$pid" 2>/dev/null; then
      echo "已关闭端口 $P 上的进程 (PID $pid)"
      KILLED=$((KILLED+1))
    fi
  done
done

# 兜底：按脚本名杀（匹配本目录下的 index.js / admin.js）
HERE="$(cd "$(dirname "$0")" && pwd)"
for script in index.js admin.js; do
  MATCH=$(ps -eo pid,cmd 2>/dev/null | grep -F "$HERE/$script" | grep -v grep | awk '{print $1}' || true)
  for pid in $MATCH; do
    if kill -9 "$pid" 2>/dev/null; then
      echo "已关闭进程 (PID $pid) → $script"
      KILLED=$((KILLED+1))
    fi
  done
done

sleep 0.5
if [ "$KILLED" -eq 0 ]; then
  echo "没有找到正在运行的喵站后端（端口 $PORTS 均无监听）"
else
  echo "✔ 共关闭 $KILLED 个进程"
fi
