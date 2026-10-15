/* 本轮勘查：C++ 两门课考试现状 vs Python 考场形状。跑法：node dev/tools/_scratch/cpp-vs-py-shape.cjs */
const fs = require("fs"), path = require("path"), vm = require("vm");
const DATA = path.resolve(__dirname, "..", "..", "frontend", "assets", "data");

function loadParts(dir, re) {
  const ctx = { window: {}, console: { log: () => { }, error: () => { }, warn: () => { } } };
  ctx.self = ctx.window; ctx.globalThis = ctx.window; vm.createContext(ctx);
  fs.readdirSync(dir).filter(f => /^p\d+\.js$/.test(f)).sort().forEach(f => {
    try { vm.runInContext(fs.readFileSync(path.join(dir, f), "utf8"), ctx, { filename: f, timeout: 20000 }) }
    catch (e) { console.log("BROKEN", f, e.message) }
  });
  const out = [];
  Object.keys(ctx.window).filter(k => re.test(k)).sort()
    .forEach(k => (((ctx.window[k] || {}).papers) || []).forEach(p => out.push(p)));
  return out;
}

const syll = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "cpp", "syllabus.json"), "utf8"));
const byCid = {};
syll.lessons.forEach(l => {
  const cid = (l.n <= 81 ? "c" : "m") + String(l.n).padStart(2, "0");
  byCid[cid] = l;
});

["cpp-exam", "cppm-exam"].forEach(name => {
  const ps = loadParts(path.join(DATA, name), /^MIAO_CPP(M)?_EXAM_P\d+$/);
  const tally = {}, modes = {};
  const typeBy = { code: 0, choice: 0, multi: 0, blank: 0, output: 0, order: 0, match: 0 };
  let qTotal = 0;
  ps.forEach(p => {
    modes[p.mode] = (modes[p.mode] || 0) + 1;
    const qs = p.questions || []; qTotal += qs.length;
    qs.forEach(q => { typeBy[q.type] = (typeBy[q.type] || 0) + 1; });
    const l = byCid[p.cid];
    const tc = l ? l.taskCount : -1;
    tally[tc] = (tally[tc] || 0) + 1;
    if (p.mode === "quiz") {
      const hasCodeInStem = qs.filter(q => /;|\bstd::|#include|\bint\b/.test(q.stem || "")).length;
      p._quizWithCode = hasCodeInStem;
    }
  });
  console.log("=== " + name + "：" + ps.length + " 场 · 题 " + qTotal + " 道");
  console.log("   mode: " + JSON.stringify(modes));
  console.log("   题型: " + JSON.stringify(typeBy));
  console.log("   源稿任务数分布(按 cid 对账，-1=源稿没这门课): " + JSON.stringify(tally));
  const quiz = ps.filter(p => p.mode === "quiz");
  const qwc = quiz.map(p => p._quizWithCode);
  console.log("   quiz 卷里「题面含代码形状」的题数/场：均值 " +
    (qwc.reduce((a, b) => a + b, 0) / (quiz.length || 1)).toFixed(1) + "，最少 " + Math.min(...qwc) + "，最多 " + Math.max(...qwc));
  const c = ps.filter(p => p.mode === "code");
  console.log("   code 卷每题数: " + JSON.stringify(c.map(p => (p.questions || []).length).reduce((a, n) => { a[n] = (a[n] || 0) + 1; return a }, {})));
});

/* Python 那门：一场卷的形状 */
const py = (() => {
  const ctx = { window: {}, console: { log: () => { }, error: () => { }, warn: () => { } }, localStorage: { getItem: () => null, setItem: () => { } } };
  ctx.self = ctx.window; ctx.globalThis = ctx.window; vm.createContext(ctx);
  fs.readdirSync(DATA).filter(f => /^(py-exam-data|py-exam-parts\.js)$/.test(f)).forEach(f => {
    const p = path.join(DATA, f); if (fs.existsSync(p)) vm.runInContext(fs.readFileSync(p, "utf8"), ctx, { filename: f, timeout: 30000 });
  });
  const dir = path.join(DATA, "exam-parts");
  fs.readdirSync(dir).forEach(f => vm.runInContext(fs.readFileSync(path.join(dir, f), "utf8"), ctx, { filename: f, timeout: 30000 }));
  return ctx;
})();
let pyKeys = Object.keys(py.window).filter(k => /EXAM|exam/i.test(k));
console.log("\n=== Python 侧 window 上的键: " + JSON.stringify(pyKeys));
const pyExams = (py.window.MIAO_PY_EXAM && py.window.MIAO_PY_EXAM.exams) || py.window.MIAO_PY_EXAMS ||
(py.window.MIAO_PY_EXAM_DATA && py.window.MIAO_PY_EXAM_DATA.exams) || null;
if (pyExams) {
  const arr = Array.isArray(pyExams) ? pyExams : Object.values(pyExams);
  console.log("   场数 " + arr.length + " · checks 条数分布 " + JSON.stringify(arr.map(e => (e.checks || []).length).reduce((a, n) => { a[n] = (a[n] || 0) + 1; return a }, {})));
  console.log("   字段并集: " + JSON.stringify([...new Set(arr.flatMap(e => Object.keys(e)))]));
}
