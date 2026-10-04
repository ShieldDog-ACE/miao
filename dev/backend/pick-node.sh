#!/usr/bin/env bash
# 喵站 · Node 选择器（被 start.sh / start-admin.sh / reset-data.sh / tests 复用）
# 目标：选出一个支持内置 node:sqlite 的 Node（>= 22.5），导出变量 NODE
# 顺序：MIAO_NODE_BIN > PATH 上的 node > 常见版本管理器目录
# 本机路径请写在 .env（已 gitignore），不要写死在本文件里。

# 变量名带前缀，避免 source 之后覆盖调用方脚本自己的 HERE
PICK_NODE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 逐行解析 .env（KEY=VALUE），不 exec/sourcing —— 值里可以带空格、< > 等符号也不会被当命令执行
load_env_file() {
  local f="$1" line key val
  [ -f "$f" ] || return 0
  while IFS= read -r line || [ -n "$line" ]; do
    case "$line" in ''|'#'*) continue ;; esac
    key="${line%%=*}"; val="${line#*=}"
    [ "$key" = "$line" ] && continue
    case "$key" in ''|*[!A-Za-z0-9_]*) continue ;; esac
    val="${val#"${val%%[![:space:]]*}"}"; val="${val%"${val##*[![:space:]]}"}"
    case "$val" in
      ?\"*\") val="${val:1:${#val}-2}" ;;
      ?\'*\') val="${val:1:${#val}-2}" ;;
    esac
    if [ -z "${!key-}" ]; then export "$key=$val"; fi
  done < "$f"
}
load_env_file "$PICK_NODE_DIR/.env"

pick_node() {
  local cand
  for cand in "$MIAO_NODE_BIN" "$(command -v node 2>/dev/null || true)" \
    /usr/local/bin/node "$HOME/.nvm/versions/node"/*/bin/node \
    "$HOME/.local/share/mise/installs/node"/*/bin \
    "$HOME/.proto/bin/node" /opt/homebrew/opt/node/bin/node; do
    [ -n "$cand" ] || continue
    [ -x "$cand" ] || continue
    if "$cand" -e "require('node:sqlite')" >/dev/null 2>&1; then
      NODE="$cand"
      return 0
    fi
  done
  NODE=""
  return 1
}

node_or_die() {
  if pick_node; then
    echo "使用 Node: $("$NODE" -v)  ($NODE)"
    return 0
  fi
  echo "✘ 找不到支持 node:sqlite 的 Node（需要 >= 22.5，推荐 22 LTS / 24）。"
  echo "  当前系统 node: $(command -v node >/dev/null 2>&1 && node -v || echo '无')"
  echo "  请在 $PICK_NODE_DIR/.env 里指定：MIAO_NODE_BIN=/绝对路径/node"
  echo "  或直接运行：MIAO_NODE_BIN=/绝对路径/node bash $(basename "${BASH_SOURCE[1]:-start.sh}")"
  return 1
}
