#!/usr/bin/env bash
# 按监听端口精确杀掉测试后端（不用 pkill -f，避免误伤/漏杀）
for P in 8791 8792 8793 8794 8795 8796 8797 8798 8799; do
  PIDS=$(ss -ltnp 2>/dev/null | awk -v pat=":$P\$" '$4 ~ pat' | grep -o 'pid=[0-9]*' | cut -d= -f2 | sort -u)
  for pid in $PIDS; do kill -9 "$pid" 2>/dev/null; done
done
sleep 0.5
