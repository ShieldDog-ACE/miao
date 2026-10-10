#!/usr/bin/env bash
# 喵站 · 全量测试（纯静态站，无后端）
#   1) 静态站 UI E2E —— 自起一台只发文件的静态服务器，jsdom 里走一遍读者路径
#   2) 沙箱对拍     —— 教程正文 433 段代码逐段与本机 CPython 比 stdout（需要 python3）
#   3) 考卷自测     —— 45 场 Python 考试 + 3 章英语卷的参考解/合法写法/宽松写法/错解
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
echo "===== 正文三条闸（梗 / 交叉引用 / 构造首现，只查已重做的新稿） ====="
node "$HERE/../tools/lesson-audit.cjs" || EC=1
echo
echo "===== 考题三条闸（读者可见字段同样不许提前接触） ====="
node "$HERE/../tools/exam-audit.cjs" || EC=1
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
echo "===== 英语入门考卷自测（21 场 · 200 词） ====="
node "$HERE/enword-test.js" || EC=1
echo
[ "$EC" -eq 0 ] && echo "全部通过 ✔" || echo "存在失败 ✘"
exit $EC
