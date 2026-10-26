#!/usr/bin/env bash
# 喵站 · 全量测试（纯静态站，无后端）
#   1) 静态站 UI E2E —— 自起一台只发文件的静态服务器，jsdom 里走一遍读者路径
#   2) 主题闸门     —— 浅/深/粉三套令牌是否齐、36 组字底对比度、:root 外硬编码色
#   3) 封面闸门     —— 9 张挂站封面的标志居中、安全区、对比度（covers.js --check）
#   4) 类名覆盖闸门 —— JS 发出去的语法/终端类，CSS 里必须真有规则（漏一个就静默掉色）
#   4b) C++ 三把闸 + 双课 E2E —— 正文四条闸、考卷「源稿任务全覆盖」对账、笔试考场走通
#   4c) 编辑器控件   —— 两把尺无损 round-trip、四层对齐、成对闭合/缩进/补全（code-editor.js）
#   5) 沙箱对拍     —— 教程正文 433 段代码逐段与本机 CPython 比 stdout（需要 python3）
#   6) 考卷自测     —— 45 场 Python 考试 + 3 章英语卷的参考解/合法写法/宽松写法/错解
# 跑法：bash dev/tests/run.sh
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
export NODE_NO_WARNINGS=1

# UI E2E 要 jsdom（装在 dev/tests/node_modules，或环境里用 NODE_PATH 指过去）
# jsdom 就装在 dev/tests/node_modules 里，所以要站在 tests 目录上找它
if ! (cd "$HERE" && node -e "require.resolve('jsdom')" >/dev/null 2>&1); then
  echo "缺 jsdom：UI E2E 跑不了。装一份（npm i -D jsdom）或 export NODE_PATH=<装它的 node_modules>"
  exit 1
fi

EC=0
# 端口别再写死：上一轮留下的残留 server 会把固定端口占住，让 UI E2E 报 EADDRINUSE 假失败（任务书 D-37）
if [ -z "${MIAO_TEST_PORT:-}" ]; then
  MIAO_TEST_PORT=$(node -e "const n=require('net');const s=n.createServer();s.listen(0,'127.0.0.1',()=>{console.log(s.address().port);s.close();});")
  export MIAO_TEST_PORT
fi
echo "（本次 UI E2E 用端口 ${MIAO_TEST_PORT}）"
echo "===== 静态站 UI E2E ====="
node "$HERE/ui-e2e.js" || EC=1
echo
echo "===== 三套配色闸门（令牌完备性 / 字底对比度 / :root 外硬编码色） ====="
node "$HERE/../tools/theme-check.js" || EC=1
echo
echo "===== 封面闸门（标志居中 / 安全区 / 对比度 —— 产物只由 covers.js 拥有） ====="
node "$HERE/../tools/covers.js" --check || EC=1
echo
echo "===== 类名覆盖闸门（JS 发出的每个 tk-/term-/tb-/en- 类，CSS 里都得有规则） ====="
node "$HERE/../tools/class-coverage.js" || EC=1
echo
echo "===== 日更工具语法（本地模型三件套；只查语法，不连模型、不联网） ====="
for f in dev/tools/daily/llm.mjs dev/tools/daily/probe.mjs dev/tools/daily/draft.mjs; do
  node --check "$f" || EC=1
done
echo "语法 3/3 通过"
echo
echo "===== 正文高光自测（全部 t:code 块过高光必须无损，陌生 lang / 全灰也要红） ====="
node "$HERE/hl-test.js" || EC=1
echo
echo "===== 代码编辑器控件自测（两把尺无损 / 四层对齐 / 成对闭合 / 缩进 / 补全） ====="
node "$HERE/editor-test.js" || EC=1
echo
echo "===== 模拟编译自测（该报的必须报、不许误报的一条都不报） ====="
node "$HERE/cpp-compile-test.js" || EC=1
echo
echo "===== C++ 子集模拟器对拍（27 例 vs 本机 g++ 的 stdout） ====="
node "$HERE/cpp-sim-test.js" || EC=1
echo
echo "===== 正文三条闸（梗 / 交叉引用 / 构造首现，只查已重做的新稿） ====="
node "$HERE/../tools/lesson-audit.cjs" || EC=1
echo
echo "===== 考题三条闸（读者可见字段同样不许提前接触） ====="
node "$HERE/../tools/exam-audit.cjs" || EC=1
echo
echo "===== 闸的自检：C++ 两把尺对「故意写坏的样本」必须红 ====="
BAD=0
if node "$HERE/../tools/cpp-audit.cjs" --part dev/tools/cpp-gate-fixtures/bad-part.js >/dev/null 2>&1; then
  echo "  ✘ cpp-audit 对坏样本返回了 0 —— 这把尺已经变成哑巴（正则被改松了？）"; BAD=1
fi
if node "$HERE/../tools/cpp-exam-check.cjs" --fixture >/dev/null 2>&1; then
  echo "  ✘ cpp-exam-check 对坏样本返回了 0 —— 权重/任务对账/自测/单轨这几项没在判"; BAD=1
fi
# 单轨与勾线的六条新红线，坏样本必须逐条被点名（少点一条就是那把尺写歪了）
FXOUT=$(node "$HERE/../tools/cpp-exam-check.cjs" --fixture 2>&1)
for K in "混进 1 道非代码题" "代码卷 2 道题" "没给 acceptRegex" "不许出现编辑器" "一道填空/勾线都没有" "每对都是「左边第 i 项" "分配表判的是"; do
  echo "$FXOUT" | grep -qF "$K" || { echo "  ✘ 单轨闸没点名这条坏样本：$K"; BAD=1; }
done
if node "$HERE/../tools/cpp-audit.cjs" --part dev/tools/cpp-gate-fixtures/bad-part.js 2>/dev/null | grep -c "✘" | grep -qv "^0$"; then :; else echo "  ✘ cpp-audit 红了但没点名任何一条"; BAD=1; fi
[ "$BAD" -eq 0 ] && echo "  ✔ 两把尺都会红，且逐条点名"
[ "$BAD" -ne 0 ] && EC=1
echo
echo "===== 构造首现表的课号线自检（表 vs 源稿第一手事实） ====="
node "$HERE/../tools/cpp-teach-audit.cjs" --strict || EC=1
echo
echo "===== C++ 正文四条闸（梗 / 反引号 / 前向引用 / 构造首现） ====="
node "$HERE/../tools/cpp-audit.cjs" || EC=1
echo
echo "===== C++ 考卷闸（契约 / 源稿任务全覆盖对账 / 结构 / 参考解错解自测） ====="
node "$HERE/../tools/cpp-exam-check.cjs" || EC=1
echo
echo "===== C++ 双课 E2E（笔试考场六种题型 / 代码高光 / 按需加载） ====="
node "$HERE/cpp-e2e.js" || EC=1
echo
echo "===== 笔试引擎自测 ====="
node "$HERE/paper-test.js" || EC=1
echo
echo "===== 沙箱对拍（433 段正文代码 vs 本机 CPython） ====="
node "$HERE/engine-test.js" || EC=1
echo
echo "===== 考卷自测（45 场 Python + 3 章英语） ====="
node "$HERE/exam-test.js" || EC=1
echo
echo "===== 英语入门考卷自测（22 场 · 257 词） ====="
node "$HERE/enword-test.js" || EC=1
echo
[ "$EC" -eq 0 ] && echo "全部通过 ✔" || echo "存在失败 ✘"
exit $EC
