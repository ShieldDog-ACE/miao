#!/usr/bin/env bash
# 喵站日更 · 把本机 GGUF 注册进 Ollama（可重复跑，不联网）
#
# 为什么要有这一份：模型权重在 ~/AI/ 下，Ollama 只认它自己库里的清单。
# 注册 = 把 GGUF 登记成 ollama 模型（权重已经在本机，ollama 只做硬链接/校验，不下载）。
#
# 用法：
#   bash dev/tools/daily/register.sh              # 注册 qwen3.8-27b 与 glm-4.6v-flash
#   bash dev/tools/daily/register.sh qwen         # 只注册一个
#   MIAO_AI_ROOT=~/AI bash dev/tools/daily/register.sh   # 换权重根目录（默认 ~/AI）
#
# 注册完跑 `node dev/tools/daily/probe.mjs` 复核；卸载用 `ollama rm <名字>`。
set -euo pipefail

AI_ROOT="${MIAO_AI_ROOT:-$HOME/AI}"
OLLAMA_BIN="${OLLAMA_BIN:-ollama}"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

register() {
  local name="$1" gguf="$2" mmproj="${3:-}" ctx="${4:-32768}" temp="${5:-0.3}"
  if [ ! -f "$gguf" ]; then echo "✘ $name：找不到权重 $gguf"; return 1; fi
  {
    echo "FROM $gguf"
    [ -n "$mmproj" ] && [ -f "$mmproj" ] && echo "FROM $mmproj"
    echo "PARAMETER num_ctx $ctx"
    echo "PARAMETER temperature $temp"
  } > "$TMP/Modelfile.$name"
  echo "→ 注册 $name（$(du -h "$gguf" | cut -f1)）"
  "$OLLAMA_BIN" create "$name" -f "$TMP/Modelfile.$name" 2>&1 | tail -1
}

want="${1:-all}"
case "$want" in
  all|qwen)
    register "qwen3.8-27b" "$AI_ROOT/qwen3.8-27b/models/Qwen3.8-27B-UD-Q4_K_M.gguf" \
      "$AI_ROOT/qwen3.8-27b/models/mmproj-F16.gguf" 32768 0.4 ;;
esac
case "$want" in
  all|glm)
    register "glm-4.6v-flash" "$AI_ROOT/glm-4.6v-flash/models/GLM-4.6V-Flash-Q4_K_M.gguf" \
      "$AI_ROOT/glm-4.6v-flash/models/mmproj-F16.gguf" 131072 0.3 ;;
esac

echo "→ 现有模型："
"$OLLAMA_BIN" list
