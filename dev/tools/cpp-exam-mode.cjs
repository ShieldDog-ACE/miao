/* 喵站 · C++ 考卷模式分配器（第十轮 T-24）
 *
 * 干什么：逐课判这一课的考试走哪一轨，落成机器可查的 tools/cpp/exam-mode.json。
 *   code = 这一卷只有代码编辑器题（type:"code"），读者交的是代码；
 *   quiz = 这一卷只有笔试客观题（choice/multi/blank/output/order/match），不许出现编辑器。
 *
 * 判据（照他定的口径「按课文任务性质逐课定」），一句话：
 *   源稿的【任务】里出现「看/观察/亲眼看/预测/心算/为什么/数一数/哪些/报什么错/想想/说说」
 *   这类只能靠嘴答的观测眼 —— 这一课锁 quiz；一条都没有，说明每条任务的交付物都是代码，走 code。
 *   为什么这么切：浏览器跑不动 C++，代码卷只能按关键字正则验收「你写出来的那几行」，
 *   而「运行看输出多了什么」这种任务在卷子上只能写成问答，硬塞进代码卷就是把观测题伪装成写作题。
 *   括号里的提示语（提示：… / 想一想…）不当证据 —— 那写的是提示不是任务本身。
 *   正则只看动词、读不出整句语气的，走 OVERRIDE 人工覆写，理由逐条写在表里。
 *
 * 跑法：node dev/tools/cpp-exam-mode.cjs           重算并写表（有 exam 卷的课才进表）
 *       node dev/tools/cpp-exam-mode.cjs --report  只打印判定结果与理由，不写文件
 */
const fs = require("fs");
const path = require("path");


const DEV = path.resolve(__dirname, "..");

const SYL = JSON.parse(fs.readFileSync(path.join(__dirname, "cpp", "syllabus.json"), "utf8"));
const OUT = path.join(__dirname, "cpp", "exam-mode.json");

/* 观测眼：这条任务的交付物是一句「你看到了什么」，而浏览器里跑不动 C++ —— 代码卷没法验收，
   命中一处就把整课钉在 quiz（判据是源稿任务原文，不是题目原文） */
const EYE = [
  ["看/观察", /看|观察|亲眼|眼前/],
  ["预测/心算", /预测|心算|算算|口算|在纸上|猜猜/],
  ["为什么/对比", /为什么|原因|解释|说明|体会|明白|区别|差别|不同|对比|哪个更/],
  ["查/是不是", /查一查|查不到|找找|有没有|是不是|哪些|哪个|什么叫/],
  ["数数", /数一?数|数出来|几个|几次|多少/],
  ["报错长什么样", /报什么错|报的|警告|后果|变成什么|会怎样|什么样/],
  ["想想/说说", /想想|想一想|先想|说说|列出|回忆|讲讲|思考|琢磨|体会|混个脸熟/],
  ["问句/结论", /[？?]|什么|啥|多少|吗|是否|怎么办|怎样|是不是|对不对/],
  ["跑一遍核对", /确认|验证|对照|核对|手工|试试|分别跑/]
];
/* 产出动词：只用来在报告里提示，不作为判据 —— 一句话口径是「任务里有观测眼就 quiz，没有就 code」，
   因为浏览器里跑不动 C++，凡是不用看/猜/解释的任务，交付物必然是一段能正则验收的代码 */
const WRITE = /写|建|声明|定义|实现|补|加|改|换|打印|输出|造|填|装|绑|让|用|挪|包成|接|算|排/;

function stripHints(s) {
  return String(s).replace(/（[^）]*）/g, "").replace(/\([^)]*\)/g, "");
}

/* 人工覆写：正则只看动词，这几条要读整句才判得准 —— 每条都写清为什么。
   键是 cid，值是 mode。这些条目在 --report 里带 manual 标，表里也带。 */
const OVERRIDE = {
  c24: { mode: "quiz", why: "任务 1 的交付物是「先猜结果」，猜完再运行 —— 浏览器里没有编译器，这一半只能靠嘴答" },
  m120: { mode: "quiz", why: "任务问「文件还会被关吗」，是个是/否判断，写代码写不出这个结论" },
  m133: { mode: "quiz", why: "「重做一遍实验」要看复制/移动之后原串变成什么，观测题" },
  m166: { mode: "quiz", why: "「用四角公式算…对照 1+2+3=6」算的是数不是代码" },
  m182: { mode: "quiz", why: "「谁移动最多」问的是插入时搬家次数，结论型" },
  m103: { mode: "quiz", why: "任务 1「算出 {1,2,3,4} 合并的总代价」交的是一个数，不是代码" },
  m207: { mode: "quiz", why: "「再 unite(0,1) 一次，函数返回 true 还是 false」交的是二选一，代码卷没法定这条" },
  m208: { mode: "quiz", why: "「给 rels 加上 {4,5}，输出变成几」—— 加边是代码，但题眼在「变成几」" }
};
function classify(tasks) {
  const eyeHits = [];
  const noWrite = [];
  tasks.forEach((raw, i) => {
    const t = stripHints(raw);           /* 括号里是提示语，不拿它当证据 */
    EYE.forEach(([name, re]) => { if (re.test(t)) eyeHits.push((i + 1) + ":" + name); });
    if (!WRITE.test(t)) noWrite.push(i + 1);
  });
  const mode = eyeHits.length === 0 ? "code" : "quiz";
  return { mode, reason: { eye: eyeHits, noWrite } };
}

/* 表覆盖源稿全部 213 课（不只已有考卷的）：正文写完后新排的卷子一落地就有 mode 可对账 */
function cidOf(n) { return (n <= 81 ? "c" : "m") + String(n).padStart(2, "0"); }

const rows = [];
SYL.lessons.filter(l => l.n >= 1).forEach(l => {
  const cid = cidOf(l.n);
  const c = classify(l.tasks);
  const ov = OVERRIDE[cid];
  rows.push({
    cid, course: l.n <= 81 ? "cpp" : "cppm", n: l.n, title: l.title, tasks: l.tasks,
    mode: ov ? ov.mode : c.mode, manual: ov ? ov.why : "", reason: c.reason
  });
});

const codeN = rows.filter(r => r.mode === "code").length;
console.log("[exam-mode] 判完 " + rows.length + " 课：code " + codeN + " 课 · quiz " + (rows.length - codeN) + " 课");
if (process.argv.includes("--report")) {
  rows.filter(r => r.mode === "code").forEach(r => console.log("  code " + r.cid + " 第" + r.n + "课 " + r.title.slice(0, 26) +
    (r.manual ? " ｜人工覆写:" + r.manual : "")));
  console.log("  ---- 以下是最接近 code 的 quiz 课（只被一条理由挡住的），翻不翻都看得清 ----");
  rows.filter(r => r.mode === "quiz" && r.reason.eye.length <= 1)
    .slice(0, 40).forEach(r => console.log("  quiz " + r.cid + " 第" + r.n + "课 " + r.title.slice(0, 22) +
      " ｜" + (r.reason.eye.join(",") || "没写代码抓手:" + r.reason.noWrite.join(",")) +
      " || 任务:" + r.tasks.join(" ‖ ").slice(0, 70)));
} else {
  const json = {
    generated: new Date().toISOString().slice(0, 10),
    note: "C++ 考卷单轨制分配表：mode=code 只许 code 题（每题一枚编辑器）；mode=quiz 禁 code 题，" +
      "走 choice/multi/blank/output/order/match。判据与人工覆写理由见 dev/tools/cpp-exam-mode.cjs。",
    papers: rows.map(r => ({ cid: r.cid, mode: r.mode, ...(r.manual ? { manual: r.manual } : {}) }))
  };
  fs.writeFileSync(OUT, JSON.stringify(json, null, 2) + "\n", "utf8");
  console.log("[exam-mode] 写 " + OUT + "（" + rows.length + " 条）");
  console.log("  code 课清单：" + rows.filter(r => r.mode === "code").map(r => r.cid).join(" "));
}
