/* 喵站 · 笔试判分引擎自测（exam-paper.js，T-10）
 *
 * 对应三条硬需求各跑一遍，一种题型都不许漏：
 *   正解必过（≥60）      → 「参考写法一定能通过」
 *   典型错解必挂（<60）  → 「没达到目标不能蒙混」
 *   宽松写法必过         → 「不能因为多打一个空格、大小写不同、全角空格就不判对」（D-4/D-15）
 * 再加一整卷：全对 = 100、空卷 = 0、权重和不是 100 的卷子必须被当成错误抓出来（D-13），
 * 以及复盘字段齐不齐（错了不知道为什么错，考试就只是打分不是教学）。
 *
 * 跑法：node dev/tests/paper-test.js
 * 退出码：0 = 全过；1 = 有 FAIL（不跑全量回归，全量回归是 dev/tests/run.sh）
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const DEV = path.resolve(__dirname, "..");
const PAPER_JS = path.join(DEV, "frontend", "assets", "js", "exam-paper.js");
const PAPER = require(PAPER_JS);

/* ---------------- 迷你断言台：一行一条，可读优先 ---------------- */
let pass = 0, fail = 0;
const failes = [];
function ok(desc, cond, detail) {
  if (cond) { pass++; console.log("  PASS  " + desc); }
  else { fail++; failes.push(desc + (detail ? " —— " + detail : "")); console.log("  FAIL  " + desc + (detail ? " —— " + detail : "")); }
}
function group(name) { console.log("\n【" + name + "】"); }

/* 单题成卷（该题 100 分）：题级阈值直接等于分数，读得懂 */
function one(q, ans) {
  return PAPER.gradePaper({
    cid: "one-" + q.type, kind: "paper", pass: 60,
    questions: [Object.assign({ id: "q1", stem: "单题卷" }, q)],
    explain: [{ id: "q1", why: "这条题的 why 文案" }]
  }, { q1: ans });
}
const pts = (r) => r.score;
const it = (r) => r.items[0];

/* ================= 1. 单选 choice ================= */
group("1 单选 choice（正解/错解/宽松）");
const CHOICE = {
  type: "choice", stem: "HTTP 请求的第一行叫什么？",
  options: ["请求行", "状态行", "头部字段", "正文"], answer: 0, score: 100
};
ok("choice 正解（索引 0）= 100", pts(one(CHOICE, 0)) === 100, "实得 " + pts(one(CHOICE, 0)));
ok("choice 正解（直接写选项文本）≥ 60", pts(one(CHOICE, "请求行")) === 100, "实得 " + pts(one(CHOICE, "请求行")));
ok("choice 错解（索引 1）= 0 < 60", pts(one(CHOICE, 1)) === 0, "实得 " + pts(one(CHOICE, 1)));
ok("choice 错解（写了别的选项文本）< 60", pts(one(CHOICE, "头部字段")) === 0, "实得 " + pts(one(CHOICE, "头部字段")));
ok("choice 宽松（首尾空格 + 全角空格）必过", pts(one(CHOICE, "  请求行\u3000")) === 100, "实得 " + pts(one(CHOICE, "  请求行\u3000")));
ok("choice 没作答 = 0 且标成 skipped", pts(one(CHOICE, undefined)) === 0 && it(one(CHOICE, undefined)).skipped === true);
ok("choice 复盘字段齐（你答了什么/正确答案/why）",
  (() => { const r = it(one(CHOICE, 2)); return r.yourAnswer.indexOf("头部字段") >= 0 && r.rightAnswer === "请求行" && r.why === "这条题的 why 文案"; })(),
  JSON.stringify(it(one(CHOICE, 2))));
ok("choice 越界答卷不乱给分", pts(one(CHOICE, 9)) === 0, "实得 " + pts(one(CHOICE, 9)));
ok("choice 没列 options、答案直接写文本也能判",
  pts(one({ type: "choice", stem: "第一行叫什么？", answer: "请求行", score: 100 }, "请求行")) === 100,
  "实得 " + pts(one({ type: "choice", stem: "第一行叫什么？", answer: "请求行", score: 100 }, "请求行")));

/* ================= 2. 多选 multi ================= */
group("2 多选 multi（全对/漏选一半/错选 0/宽松）");
const MULTI = {
  type: "multi", stem: "下面哪些属于 URL 的组成部分？",
  options: ["协议", "端口", "用户 agent 库", "路径"], answers: [0, 1, 3], score: 100
};
ok("multi 全对 = 100", pts(one(MULTI, [0, 1, 3])) === 100, "实得 " + pts(one(MULTI, [0, 1, 3])));
ok("multi 漏选给一半 = 50（标半对）",
  pts(one(MULTI, [0, 1])) === 50 && it(one(MULTI, [0, 1])).mark === "half",
  "实得 " + pts(one(MULTI, [0, 1])) + "/" + it(one(MULTI, [0, 1])).mark);
ok("multi 漏选只勾一个也给一半", pts(one(MULTI, [3])) === 50, "实得 " + pts(one(MULTI, [3])));
ok("multi 错选任一项 = 0（漏选不算豁免）", pts(one(MULTI, [0, 1, 2, 3])) === 0, "实得 " + pts(one(MULTI, [0, 1, 2, 3])));
ok("multi 只勾错项 = 0 < 60", pts(one(MULTI, [2])) === 0, "实得 " + pts(one(MULTI, [2])));
ok("multi 错选要说清勾错了哪个", it(one(MULTI, [0, 2])).saw.indexOf("用户 agent 库") >= 0, it(one(MULTI, [0, 2])).saw);
ok("multi 宽松（写选项文本 + 多余空格）= 100", pts(one(MULTI, ["协议", "  端口 ", "路径"])) === 100, "实得 " + pts(one(MULTI, ["协议", "  端口 ", "路径"])));
ok("multi 宽松（全角逗号串「0，1，3」）= 100", pts(one(MULTI, "0，1，3")) === 100, "实得 " + pts(one(MULTI, "0，1，3")));
ok("multi 没作答 = 0", pts(one(MULTI, [])) === 0, "实得 " + pts(one(MULTI, [])));
ok("multi 勾选表形式（{0:true,1:true,3:true}）= 100",
  pts(one(MULTI, { 0: true, 1: true, 3: true })) === 100, "实得 " + pts(one(MULTI, { 0: true, 1: true, 3: true })));

/* ================= 3. 填空 blank ================= */
group("3 填空 blank（accept 多答案 + 一律宽松比对）");
const BLANK = {
  type: "blank", stem: "GET 与 POST 的关键差别：____ 会把数据放进请求体。",
  accept: ["POST", "post"], score: 100
};
ok("blank 正解 POST = 100", pts(one(BLANK, "POST")) === 100, "实得 " + pts(one(BLANK, "POST")));
ok("blank 多答案里第二条也算对（post）", pts(one(BLANK, "post")) === 100, "实得 " + pts(one(BLANK, "post")));
ok("blank 大小写混写 PoSt 必过", pts(one(BLANK, "PoSt")) === 100, "实得 " + pts(one(BLANK, "PoSt")));
ok("blank 前后多打空格必过", pts(one(BLANK, "   post   ")) === 100, "实得 " + pts(one(BLANK, "   post   ")));
ok("blank 全角空格与全角字母必过", pts(one(BLANK, "\u3000ＰＯＳＴ\u3000")) === 100, "实得 " + pts(one(BLANK, "\u3000ＰＯＳＴ\u3000")));
ok("blank 加了引号和句号必过", pts(one(BLANK, "“POST”。")) === 100, "实得 " + pts(one(BLANK, "“POST”。")));
ok("blank 反引号包起来（当成代码写）必过", pts(one(BLANK, "`Post`")) === 100, "实得 " + pts(one(BLANK, "`Post`")));
ok("blank 典型错解 GET = 0 < 60", pts(one(BLANK, "GET")) === 0, "实得 " + pts(one(BLANK, "GET")));
ok("blank 答非所问 = 0", pts(one(BLANK, "请求体")) === 0, "实得 " + pts(one(BLANK, "请求体")));
ok("blank 没作答 = 0", pts(one(BLANK, "")) === 0, "实得 " + pts(one(BLANK, "")));
ok("blank 复盘里能看到可接受答案全集",
  it(one(BLANK, "GET")).rightAnswer === "POST / post", it(one(BLANK, "GET")).rightAnswer);
ok("blank 只给 acceptRegex 时也能判，且考卷不算写坏（复盘显示的是正则）",
  (() => {
    const r = one({ type: "blank", acceptRegex: ["^(POST|post)$"], score: 100 }, "post");
    return r.score === 100 && r.valid === true && it(one({ type: "blank", acceptRegex: ["^(POST|post)$"], score: 100 }, "GET")).rightAnswer.indexOf("符合") === 0;
  })(),
  it(one({ type: "blank", acceptRegex: ["^(POST|post)$"], score: 100 }, "GET")).rightAnswer);

/* ================= 4. 补代码 code ================= */
group("4 补代码 code（只按 acceptRegex 找关键字，绝不逐字符比形状）");
const CODE = {
  type: "code", stem: "补全这行：把端口交给操作系统随机分配：listen(____, …)",
  acceptRegex: ["\\b0\\b"], score: 100
};
ok("code 正解 = 100", pts(one(CODE, "listen(0, 1024)")) === 100, "实得 " + pts(one(CODE, "listen(0, 1024)")));
ok("code 空格/逗号位置写歪必过", pts(one(CODE, "listen(  0 ,  1024 )")) === 100, "实得 " + pts(one(CODE, "listen(  0 ,  1024 )")));
ok("code 缩进换行完全不同必过（不比形状）",
  pts(one(CODE, "\n\t\tif (1) {\n\t\t\tlisten(\n\t\t\t\t0,\n\t\t\t\tSOMAXCONN);\n\t\t}\n")) === 100,
  "实得 " + pts(one(CODE, "\n\t\tif (1) {\n\t\t\tlisten(\n\t\t\t\t0,\n\t\t\t\tSOMAXCONN);\n\t\t}\n")));
ok("code post 写成 POST 必过（正则默认大小写不敏感）",
  pts(one({ type: "code", acceptRegex: ["post"], score: 100 }, "send(request.method == 'POST')")) === 100);
ok("code 关键字换成大写 SOL_SOCKET 也命中（同一正则 i 标志）",
  pts(one({ type: "code", acceptRegex: ["somaxconn"], score: 100 }, "listen(0, SOMAXCONN)")) === 100);
ok("code 典型错解（写死 8080）= 0 < 60", pts(one(CODE, "listen(8080, 1024)")) === 0, "实得 " + pts(one(CODE, "listen(8080, 1024)")));
ok("code 空的补上（只写了括号）= 0", pts(one(CODE, "listen(, 1024)")) === 0, "实得 " + pts(one(CODE, "listen(, 1024)")));
ok("code 多条关键字缺一块 = 0，且说清缺哪块",
  (() => { const r = it(one({ type: "code", acceptRegex: ["listen\\s*\\(", "SOMAXCONN"], score: 100 }, "listen(0, 1024)")); return r.pts === 0 && r.mark === "no" && r.saw.indexOf("SOMAXCONN") >= 0; })(),
  it(one({ type: "code", acceptRegex: ["listen\\s*\\(", "SOMAXCONN"], score: 100 }, "listen(0, 1024)")).saw);
ok("code matchAny 写法：命中任一条即对",
  pts(one({ type: "code", matchAny: true, acceptRegex: ["\\b0\\b", "SO_REUSEADDR"], score: 100 }, "listen(0, 1024)")) === 100);
ok("code 非法正则不许静默判错，要报出来",
  it(one({ type: "code", acceptRegex: ["(["], score: 100 }, "x")).saw.indexOf("不合法的正则") >= 0,
  it(one({ type: "code", acceptRegex: ["(["], score: 100 }, "x")).saw);
ok("code 没作答 = 0", pts(one(CODE, undefined)) === 0);
/* 复盘不许把裸正则当「正确答案」甩给读者：题目带 sample 时改用具体参考写法 */
const CODE_SAMPLE = Object.assign({}, CODE, { sample: 'std::println("你好");' });
ok("code 带 sample：复盘的「正确答案」给参考写法，不给正则",
  it(one(CODE_SAMPLE, "listen(8080)")).rightAnswer === "参考写法：std::println(\"你好\");",
  it(one(CODE_SAMPLE, "listen(8080)")).rightAnswer);
ok("code 带 sample：判错那句话也指着参考写法",
  it(one(CODE_SAMPLE, "listen(8080)")).saw.indexOf("参考写法：std::println") >= 0, it(one(CODE_SAMPLE, "listen(8080)")).saw);
ok("code 没带 sample：仍按正则说明（老卷子一条都不许被改坏）",
  it(one(CODE, "listen(8080)")).rightAnswer.indexOf("0") >= 0);
ok("blank 只给正则时也优先展示 sample",
  it(one({ type: "blank", acceptRegex: ["println"], sample: 'std::println("x");', score: 100 }, "x")).rightAnswer.indexOf("参考写法") === 0);

/* ================= 5. 读代码写输出 output ================= */
group("5 读代码写输出 output（逐行宽松比对，行数不足按命中比例给）");
const OUTPUT = {
  type: "output", stem: "这段代码打印什么？",
  code: "a = [1, 2, 3]\nprint(len(a))\nprint(a[1] + a[2])",
  acceptLines: ["3", "5"], score: 100
};
ok("output 全对 = 100", pts(one(OUTPUT, "3\n5")) === 100, "实得 " + pts(one(OUTPUT, "3\n5")));
ok("output 每行前多打空格必过", pts(one(OUTPUT, "   3\n    5")) === 100, "实得 " + pts(one(OUTPUT, "   3\n    5")));
ok("output 中间空行 + 尾部多按回车必过",
  pts(one(OUTPUT, "3\n\n5\n\n\n")) === 100, "实得 " + pts(one(OUTPUT, "3\n\n5\n\n\n")));
ok("output 全角数字必过", pts(one(OUTPUT, "３\n５")) === 100, "实得 " + pts(one(OUTPUT, "３\n５")));
ok("output 大小写宽松（文本行）必过",
  pts(one({ type: "output", acceptLines: ["GET / HTTP/1.1"], score: 100 }, "get   / http/1.1")) === 100);
ok("output 只写第一行 = 命中比例 50（半对）",
  pts(one(OUTPUT, "3")) === 50 && it(one(OUTPUT, "3")).mark === "half", "实得 " + pts(one(OUTPUT, "3")));
ok("output 典型错解 = 0 < 60", pts(one(OUTPUT, "6\n3")) === 0, "实得 " + pts(one(OUTPUT, "6\n3")));
ok("output 对一半错一半 = 50", pts(one(OUTPUT, "3\n9")) === 50, "实得 " + pts(one(OUTPUT, "3\n9")));
ok("output 多写一行要扣分（不能靠多写蒙分）",
  (() => { const r = it(one(OUTPUT, "3\n5\n7")); return r.pts === 67 && r.mark === "half" && r.saw.indexOf("第 3 行多写了") >= 0; })(),
  "实得 " + pts(one(OUTPUT, "3\n5\n7")) + "｜" + it(one(OUTPUT, "3\n5\n7")).saw);
ok("output 缺行要说清第几行缺了", it(one(OUTPUT, "3")).saw.indexOf("第 2 行缺了") >= 0, it(one(OUTPUT, "3")).saw);
ok("output 没作答 = 0", pts(one(OUTPUT, "")) === 0);

/* ================= 6. 步骤排序 order ================= */
group("6 步骤排序 order（全对才给分，但复盘并排给两条顺序）");
const ORDER = {
  type: "order", stem: "把服务端收第一个请求的步骤排好：",
  steps: ["建 socket", "bind 端口", "listen 挂队列", "accept 拿连接", "read 读字节", "parse 请求行"],
  answer: [0, 1, 2, 3, 4, 5], score: 100
};
ok("order 全对 = 100", pts(one(ORDER, [0, 1, 2, 3, 4, 5])) === 100, "实得 " + pts(one(ORDER, [0, 1, 2, 3, 4, 5])));
ok("order 写步骤文本全对也过",
  pts(one(ORDER, ["建 socket", "bind 端口", "listen 挂队列", "accept 拿连接", "read 读字节", "parse 请求行"])) === 100);
ok("order 索引串写法（\"0,1,2,3,4,5\"）必过", pts(one(ORDER, "0,1,2,3,4,5")) === 100, "实得 " + pts(one(ORDER, "0,1,2,3,4,5")));
ok("order 错一位就 0 分（没有差不多）", pts(one(ORDER, [0, 2, 1, 3, 4, 5])) === 0, "实得 " + pts(one(ORDER, [0, 2, 1, 3, 4, 5])));
ok("order 完全乱序 = 0 < 60", pts(one(ORDER, [5, 4, 3, 2, 1, 0])) === 0, "实得 " + pts(one(ORDER, [5, 4, 3, 2, 1, 0])));
ok("order 复盘带「你的顺序 vs 正确顺序」两条 + 错在第几步",
  (() => { const r = it(one(ORDER, [0, 2, 1, 3, 4, 5])); return r.order && r.order.yours.length === 6 && r.order.right[1] === "bind 端口" && r.order.wrongAt.join() === "2,3"; })(),
  JSON.stringify(it(one(ORDER, [0, 2, 1, 3, 4, 5])).order));
ok("order 少排一步 = 0（不算全对）", pts(one(ORDER, [0, 1, 2, 3, 4])) === 0, "实得 " + pts(one(ORDER, [0, 1, 2, 3, 4])));
ok("order 没作答 = 0", pts(one(ORDER, undefined)) === 0);

/* ================= 7. 勾线配对 match ================= */
group("7 勾线配对 match（按连对的对数给分，标签与索引两种写法都认）");
const MATCH = {
  type: "match", stem: "把左边的头文件和右边它管的事连起来：",
  left: ["<print>", "<vector>", "<memory>", "<string>"],
  right: ["动态数组", "智能指针", "标准输出", "字符串"],
  answer: { "<print>": "标准输出", "<vector>": "动态数组", "<memory>": "智能指针", "<string>": "字符串" },
  score: 100
};
const MATCH_PERFECT = { "<print>": "标准输出", "<vector>": "动态数组", "<memory>": "智能指针", "<string>": "字符串" };
ok("match 全连对 = 100", pts(one(MATCH, MATCH_PERFECT)) === 100, "实得 " + pts(one(MATCH, MATCH_PERFECT)));
ok("match 对 3 漏 1 = 按比例给 75", pts(one(MATCH, { "<print>": "标准输出", "<vector>": "动态数组", "<memory>": "智能指针" })) === 75,
  "实得 " + pts(one(MATCH, { "<print>": "标准输出", "<vector>": "动态数组", "<memory>": "智能指针" })));
ok("match 半对记 half（复盘要能看出是半对不是全错）",
  it(one(MATCH, { "<print>": "标准输出", "<vector>": "动态数组", "<memory>": "智能指针" })).mark === "half");
ok("match 全连错 = 0", pts(one(MATCH, { "<print>": "动态数组", "<vector>": "智能指针", "<memory>": "标准输出", "<string>": "动态数组" })) === 0);
ok("match 用索引写答卷（{0:2,1:0,2:1,3:3}）同样满分", pts(one(MATCH, { 0: 2, 1: 0, 2: 1, 3: 3 })) === 100,
  "实得 " + pts(one(MATCH, { 0: 2, 1: 0, 2: 1, 3: 3 })));
ok("match 宽松比对：多余空格、全角、结尾句号都不该判错",
  pts(one(MATCH, { "  <print>\u3000": "标准输出。", "<vector>": "动态数组", "<memory>": "智能指针", "<string>": "字符串" })) === 100,
  "实得 " + pts(one(MATCH, { "  <print>\u3000": "标准输出。", "<vector>": "动态数组", "<memory>": "智能指针", "<string>": "字符串" })));
ok("match 左边写了不存在的项：那点分拿不到，复盘点名",
  (() => { const r = one(MATCH, { "<array>": "字符串", "<vector>": "动态数组", "<memory>": "智能指针", "<string>": "字符串" }); return r.score === 75 && it(r).saw.indexOf("不是左边的项") >= 0; })(),
  JSON.stringify(it(one(MATCH, { "<array>": "字符串", "<vector>": "动态数组", "<memory>": "智能指针", "<string>": "字符串" })).saw));
ok("match 没作答 = 0", pts(one(MATCH, {})) === 0 && pts(one(MATCH, undefined)) === 0);
ok("match 复盘说清每一对该怎么连",
  it(one(MATCH, { "<print>": "动态数组", "<vector>": "动态数组", "<memory>": "智能指针", "<string>": "字符串" })).rightAnswer.indexOf("<print> → 标准输出") >= 0,
  it(one(MATCH, { "<print>": "动态数组" })).rightAnswer);
/* 契约：两边不足 2 项、answer 落不到项里、标签撞车，都得当场报错 */
ok("match 两边项数不足 2 要报错",
  PAPER.validatePaper({ questions: [{ id: "q1", type: "match", stem: "连", left: ["a"], right: ["b"], answer: { a: "b" }, score: 100 }] })
    .some((e) => e.indexOf("不足 2 个项") >= 0));
ok("match 的 answer 写了 left/right 里没有的项要报错",
  PAPER.validatePaper({
    questions: [{
      id: "q1", type: "match", stem: "连", left: ["a", "b"], right: ["c", "d"],
      answer: { a: "c", b: "z" }, score: 100
    }]
  }).some((e) => e.indexOf("认得出来") >= 0));
ok("match 同一栏里标签重复要报错（两个一样的按钮点哪个都算对，题就废了）",
  PAPER.validatePaper({
    questions: [{
      id: "q1", type: "match", stem: "连", left: ["向量", "向量 "], right: ["动态数组", "智能指针"],
      answer: { "向量": "动态数组", "向量 ": "智能指针" }, score: 100
    }]
  }).some((e) => e.indexOf("重复项") >= 0));

/* ================= 8. 一整卷 ================= */
group("8 一整卷（Web Server 第 1 篇 · 六种题型，权重和正好 100）");
const FULL = {
  cid: "byox-ws-01", kind: "paper", title: "Web Server 第 1 篇考试 · 从 socket 到请求行", pass: 60,
  questions: [
    { id: "q1", type: "choice", stem: "HTTP 请求的第一行叫什么？", options: ["请求行", "状态行", "头部字段", "正文"], answer: 0, score: 10 },
    { id: "q2", type: "multi", stem: "下面哪些属于 URL 的组成部分？", options: ["协议", "端口", "用户 agent 库", "路径"], answers: [0, 1, 3], score: 15 },
    { id: "q3", type: "blank", stem: "GET 与 POST 的关键差别：____ 会把数据放进请求体。", accept: ["POST", "post"], score: 15 },
    { id: "q4", type: "code", stem: "补全这行：把端口交给操作系统随机分配：listen(____, …)", acceptRegex: ["\\b0\\b"], score: 20 },
    { id: "q5", type: "output", stem: "这段代码打印什么？", code: "a = [1, 2, 3]\nprint(len(a))\nprint(a[1] + a[2])", acceptLines: ["3", "5"], score: 20 },
    { id: "q6", type: "order", stem: "把服务端收第一个请求的步骤排好：",
      steps: ["建 socket", "bind 端口", "listen 挂队列", "accept 拿连接", "read 读字节", "parse 请求行"], answer: [0, 1, 2, 3, 4, 5], score: 20 }
  ],
  explain: [
    { id: "q1", why: "请求行 = 方法 + 路径 + 版本，所以第一行永远先看它" },
    { id: "q2", why: "URL = 协议 + 主机 + 端口 + 路径 + 查询串；user agent 是头部字段，不在 URL 里" },
    { id: "q3", why: "POST 把数据放进请求体，GET 放在查询串" },
    { id: "q4", why: "端口填 0 = 让操作系统随机分配一个空闲端口" },
    { id: "q5", why: "len(a) 是 3；a[1] + a[2] = 2 + 3 = 5" },
    { id: "q6", why: "先有 socket 才能 bind，bind 完 listen，来连接才 accept，然后才 read/parse" }
  ]
};
const PERFECT = { q1: 0, q2: [0, 1, 3], q3: "POST", q4: "listen(0, 1024)", q5: "3\n5", q6: [0, 1, 2, 3, 4, 5] };
const LOOSE = {
  q1: "  请求行\u3000", q2: "0，1，3", q3: "“post”。",
  q4: "\n\tlisten(\n\t\t0,\n\t\t1024);\n", q5: "  3 \n\n 5\n\n", q6: "0,1,2,3,4,5"
};
const EMPTY = {};

const rFull = PAPER.gradePaper(FULL, PERFECT);
const rLoose = PAPER.gradePaper(FULL, LOOSE);
const rEmpty = PAPER.gradePaper(FULL, EMPTY);
const rArray = PAPER.gradePaper(FULL, [0, [0, 1, 3], "post", "listen(0,1024)", "3\n5", [0, 1, 2, 3, 4, 5]]);

ok("整卷权重和 = 100（weightOk 且没有错误信息）",
  rFull.weightSum === 100 && rFull.weightOk === true && rFull.errors.length === 0,
  "weightSum=" + rFull.weightSum + " errors=" + JSON.stringify(rFull.errors));
ok("整卷全对 = 100 且 passed", rFull.score === 100 && rFull.passed === true, "实得 " + rFull.score);
ok("整卷宽松写法（空格/全角/引号/换行缩进）仍 = 100", rLoose.score === 100 && rLoose.passed === true,
  "实得 " + rLoose.score + "｜" + rLoose.reviews.map((x) => x.id + ":" + x.pts).join(" "));
ok("整卷空卷 = 0 且没及格", rEmpty.score === 0 && rEmpty.passed === false && rEmpty.counts.no === 6,
  "实得 " + rEmpty.score + " counts=" + JSON.stringify(rEmpty.counts));
ok("答卷用数组形式（按题号排）与对象形式同分", rArray.score === 100, "实得 " + rArray.score);
ok("整卷全错 = 0", PAPER.gradePaper(FULL, {
  q1: 1, q2: [2], q3: "GET", q4: "listen(8080, 1024)", q5: "6\n3", q6: [5, 4, 3, 2, 1, 0]
}).score === 0);
/* 60 分线要算得准：漏掉「多选+排序」两题共 35 分 → 65 过；再漏掉填空 → 50 挂 */
ok("及格线数学：对 4 题得 60 分正好过线",
  (() => { const r = PAPER.gradePaper(FULL, { q1: 0, q2: [0, 1, 3], q3: "POST", q4: "listen(0, 1024)" }); return r.score === 60 && r.passed === true; })(),
  "实得 " + PAPER.gradePaper(FULL, { q1: 0, q2: [0, 1, 3], q3: "POST", q4: "listen(0, 1024)" }).score);
ok("及格线数学：再漏一题就掉到 45 分（挂）",
  (() => { const r = PAPER.gradePaper(FULL, { q1: 0, q2: [0, 1, 3], q4: "listen(0, 1024)" }); return r.score === 45 && r.passed === false; })(),
  "实得 " + PAPER.gradePaper(FULL, { q1: 0, q2: [0, 1, 3], q4: "listen(0, 1024)" }).score);
ok("半吊子卷（漏选+缺一行）按口径 = 48 分挂住",
  (() => {
    const r = PAPER.gradePaper(FULL, { q1: 0, q2: [0, 1], q3: "GET", q4: "listen(0, 1024)", q5: "3", q6: [0, 2, 1, 3, 4, 5] });
    return r.score === 48 && r.passed === false;
  })(),
  "实得 " + PAPER.gradePaper(FULL, { q1: 0, q2: [0, 1], q3: "GET", q4: "listen(0, 1024)", q5: "3", q6: [0, 2, 1, 3, 4, 5] }).score);
ok("每题复盘都对得上号：6 题各带 why 文案",
  rFull.reviews.length === 6 && rFull.reviews.every((x, i) => x.id === "q" + (i + 1) && x.why && x.why.length > 5),
  JSON.stringify(rFull.reviews.map((x) => x.id + "/" + x.why.slice(0, 6))));
ok("mark 三态齐全（对/半对/错）",
  (() => {
    const r = PAPER.gradePaper(FULL, { q1: 0, q2: [0, 1], q3: "GET" });
    return r.counts.ok === 1 && r.counts.half === 1 && r.counts.no === 4;
  })(),
  JSON.stringify(PAPER.gradePaper(FULL, { q1: 0, q2: [0, 1], q3: "GET" }).counts));
ok("返回值能直接渲染：items/reviews/checks 是同一份，字段 ok/label/weight/saw 都在",
  rFull.items === rFull.reviews && rFull.items === rFull.checks &&
  rFull.items.every((c) => typeof c.ok === "boolean" && c.label && typeof c.weight === "number" && c.saw));
ok("已答题数/总题数报得出来", rEmpty.answered === 0 && rFull.answered === 6 && rFull.total === 6);

/* ---------- 权重和不是 100 必须被抓出来（别静默） ---------- */
group("9 考卷契约自检（不平的权重、坏题型、缺答案都要报出来）");
const BROKEN = JSON.parse(JSON.stringify(FULL));
BROKEN.questions[3].score = 17;              /* q4 从 20 改成 17，合计掉到 97 */
const rBroken = PAPER.gradePaper(BROKEN, PERFECT);
ok("权重和 97 被当成一条错误信息暴露",
  rBroken.valid === false && rBroken.errors.length === 1 && rBroken.errors[0].indexOf("97") >= 0,
  JSON.stringify(rBroken.errors));
ok("权重和 97 时总分照实报 97（不偷偷归一化成 100）", rBroken.score === 97 && rBroken.weightSum === 97, "实得 " + rBroken.score);
ok("权重不平这张卷判「没通过」（数据写坏了不该让人及格）",
  rBroken.passed === false && rBroken.passLine === 60);
ok("权重和超过 100 同样被抓", (() => { const b = JSON.parse(JSON.stringify(FULL)); b.questions[0].score = 20; const r = PAPER.gradePaper(b, PERFECT); return r.valid === false && r.errors[0].indexOf("110") >= 0; })(),
  JSON.stringify((() => { const b = JSON.parse(JSON.stringify(FULL)); b.questions[0].score = 20; return PAPER.gradePaper(b, PERFECT).errors; })()));

const rKind = PAPER.gradePaper({ questions: [{ id: "q1", type: "essay", stem: "论述", answer: "x", score: 100 }] }, { q1: "x" });
ok("判分器不认识的题型要报错，不是静默 0 分",
  rKind.errors.length === 1 && rKind.errors[0].indexOf("essay") >= 0 && rKind.items[0].saw.indexOf("不在笔试引擎支持的范围") >= 0,
  JSON.stringify(rKind.errors));
const rMiss = PAPER.gradePaper({ questions: [{ id: "q1", type: "blank", stem: "填一个", score: 100 }] }, { q1: "x" });
ok("缺正确答案的题要报错（blank 没 accept）", rMiss.errors[0].indexOf("accept") >= 0, JSON.stringify(rMiss.errors));
const rDup = PAPER.gradePaper({
  questions: [
    { id: "q1", type: "choice", stem: "a", options: ["a", "b"], answer: 0, score: 50 },
    { id: "q1", type: "choice", stem: "b", options: ["a", "b"], answer: 1, score: 50 }
  ]
}, { });
ok("题目 id 重复要被抓出来（explain 会对不上号）", rDup.errors.some((e) => e.indexOf("重复") >= 0), JSON.stringify(rDup.errors));
const rNoQ = PAPER.validatePaper({ cid: "x", questions: [] });
ok("空卷（一道题都没有）要报错", rNoQ.length >= 1, JSON.stringify(rNoQ));
ok("validatePaper 对正常卷子返回空数组", PAPER.validatePaper(FULL).length === 0, JSON.stringify(PAPER.validatePaper(FULL)));
const rNoAns = PAPER.gradePaper(FULL, undefined);
ok("answers 整个没传也不炸，按空卷处理", rNoAns.score === 0 && rNoAns.total === 6);

/* ---------- 双环境可用（这站没有打包器） ---------- */
group("10 双环境：Node 的 require 与浏览器/沙箱的 window.MIAO_PAPER");
ok("require() 拿到的对象里有 gradePaper 函数", typeof PAPER.gradePaper === "function");
ok("引擎报得出七种题型", PAPER.KINDS.join("/") === "choice/multi/blank/code/output/order/match", PAPER.KINDS.join("/"));
ok("判分器零 DOM：源码里不碰 document/window 之外的东西",
  !/\bdocument\.|getElementById|querySelector/.test(fs.readFileSync(PAPER_JS, "utf8")));
ok("判分器不执行任何代码：不出现 eval/new Function/沙箱 run",
  !/\beval\(|new Function\(|runInContext|child_process/.test(fs.readFileSync(PAPER_JS, "utf8")));
(function umdInVm() {
  let W = null, err = "";
  try {
    const ctx = vm.createContext({ window: {}, console });
    vm.runInContext(fs.readFileSync(PAPER_JS, "utf8"), ctx, { timeout: 8000 });
    W = ctx.window.MIAO_PAPER;
    if (W && typeof W.gradePaper === "function") {
      const r = W.gradePaper(FULL, PERFECT);
      err = r.score === 100 ? "" : "vm 里判分结果 " + r.score;
    } else err = "window.MIAO_PAPER 没挂上";
  } catch (e) { err = e.message; }
  ok("浏览器路径可用：window.MIAO_PAPER.gradePaper 全对卷 = 100", err === "" && !!W, err);
})();

/* ---------------- 汇总 ---------------- */
console.log("\n整卷一览（满分口径 100 / 及格线 " + FULL.pass + "）");
[["全对", rFull], ["宽松写法", rLoose], ["空卷", rEmpty], ["权重写坏(97)", rBroken]].forEach(([name, r]) => {
  console.log("  " + name.padEnd(14, " ") + " 得分 " + String(r.score).padStart(3) +
    " · 对 " + r.counts.ok + " 半对 " + r.counts.half + " 错 " + r.counts.no +
    " · passed=" + r.passed + " · valid=" + r.valid +
    (r.errors.length ? " · 报错：" + r.errors[0] : ""));
});


/* ---------- 单编辑器卷（mode:"ide"）：一块 buffer 进来了，逐条判定怎么算 ----------
   这三条是这一轮形状change的核心承诺：题面不参与匹配、注释不算写过、骨架不算做完题。 */
(function ideTests() {
  const IDE = {
    cid: "x01", kind: "paper", mode: "ide", pass: 60, title: "第 1 课", file: "main.cpp",
    starter: "#include <print>\nint main() {\n\n}\n",
    questions: [
      { id: "q1", type: "code", score: 30, coversTask: 1, stem: "写一行 println",
        acceptRegex: ["println\\s*\\(\\s*\"你好\""], sample: 'std::println("你好");', why: "句式" },
      { id: "q2", type: "code", score: 30, coversTask: 1, stem: "把 print 头搬进来",
        acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>"], sample: "#include <print>", why: "搬运" },
      { id: "q3", type: "code", score: 40, coversTask: 2, stem: "写出编译命令",
        acceptRegex: ["g\\+\\+.*-o\\s*\\w+"], sample: "g++ -std=c++23 main.cpp -o main", why: "命令", acceptOn: "buffer" }
    ],
    selftest: {}
  };
  const full = "# 条件1：写一行 println\n//\n#include <print>\nint main(){ std::println(\"你好\"); }\n// g++ -std=c++23 main.cpp -o main\n";
  ok("单编辑器：整份写全判 100 并通过", PAPER.gradeIde(IDE, full).score === 100 && PAPER.gradeIde(IDE, full).passed);
  ok("单编辑器：把条件原文抄进注释一分不得",
    PAPER.gradeIde(IDE, "// 条件1：println(\"你好\")\n// 条件3：g++ -std=c++23 main.cpp -o main\n").score === 0);
  ok("单编辑器：题面那几行注释不参与匹配（只留题面 = 0 分）",
    PAPER.gradeIde(IDE, "// 第 1 课\n// 条件1：写一行 println（30 分）\n//\n").score === 0);
  ok("单编辑器：预置骨架单独交卷过不了线", PAPER.ideStarterFails(IDE).failed);
  ok("单编辑器：整块题面被删掉后，整份文件都算代码",
    PAPER.gradeIde(IDE, '#include <print>\nint main(){ std::println("你好"); }\n// g++ -std=c++23 main.cpp -o main').score === 100);
  ok("单编辑器：shell 命令写在代码段里也算（acceptOn:buffer 吃读者那一段含注释）",
    PAPER.gradeIde(IDE, '#include <print>\nint main(){ std::println("你好"); }\n').score === 60);
  const strings = PAPER.stripComments('std::println("http://a; b"); // 尾巴\nint x = 1; /* 块 */\n');
  ok("剥注释：字符串里的 // 与分号不许当注释",
    /http:\/\/a; b/.test(strings) && !/尾巴/.test(strings) && !/块/.test(strings));
  ok("剥注释：行结构一字不动（行数一样，报错跳行才不会错位）",
    strings.split("\n").length === 'std::println("http://a; b"); // 尾巴\nint x = 1; /* 块 */\n'.split("\n").length);
  ok("契约：混进选择型条件被判坏",
    PAPER.validateIde(Object.assign({}, IDE, { questions: IDE.questions.concat([{ id: "q9", type: "choice", score: 0, stem: "x", answer: 0 }]) })).some(e => /不是 code 的条件/.test(e)));
  ok("契约：条件少于 3 条被判坏",
    PAPER.validateIde(Object.assign({}, IDE, { questions: IDE.questions.slice(0, 2) })).some(e => /3–6 条/.test(e)));
  ok("契约：条件不给 sample 被判坏",
    PAPER.validateIde(Object.assign({}, IDE, { questions: IDE.questions.map((q, i) => i === 0 ? Object.assign({}, q, { sample: "" }) : q) })).some(e => /没给 sample/.test(e)));
  ok("契约：权重不平 100 被判坏",
    PAPER.validateIde(Object.assign({}, IDE, { questions: IDE.questions.map(q => Object.assign({}, q, { score: 20 })) })).some(e => /正好 100/.test(e)));
})();

console.log("\n笔试引擎自测：" + PAPER.KINDS.length + " 种题型 · " + (pass + fail) + " 条用例 · PASS " + pass + " · FAIL " + fail);
if (failes.length) {
  console.log("\n失败明细：");
  failes.forEach((m, i) => console.log("  " + (i + 1) + ") " + m));
}
console.log(fail === 0 ? "笔试引擎自测全部通过 ✔" : "笔试引擎有 " + fail + " 条没通过 ✘");
process.exit(fail === 0 ? 0 : 1);
