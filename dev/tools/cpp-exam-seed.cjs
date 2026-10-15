/* 喵站 · C++ 考卷出题底稿打印器（第十九轮 T-37）
 *
 * 干什么：把「人工补题需要看到的全部事实」一次打出来，省得出题的人去翻 51 份分部文件：
 *   1. 这一课走哪一轨、闸判它缺什么（跑一遍改造器拿到的同一份报告，不是另一套口径）；
 *   2. 源稿的【任务】逐条编号（coversTask 就是对这里的编号，D-57）；
 *   3. 正文的本课目标 / 各节标题 / 全部演示代码 / 任务栏原文（题干里只许出现这些教过的写法）；
 *   4. 这一场现有的题（题号 / 题型 / 分值 / 盖第几条任务 / 题干 / 判分键 / 为什么）与三档自测参考解。
 *
 * 跑法：
 *   node dev/tools/cpp-exam-seed.cjs c01 c16          打某几场的底稿
 *   node dev/tools/cpp-exam-seed.cjs --todo           列出还需要人工题的全部场次
 *   node dev/tools/cpp-exam-seed.cjs --todo --course cpp
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const cp = require("child_process");

const DEV = path.resolve(__dirname, "..");
const DATA = path.join(DEV, "frontend", "assets", "data");
const SYL = JSON.parse(fs.readFileSync(path.join(__dirname, "cpp", "syllabus.json"), "utf8"));
const BY_N = {};
SYL.lessons.forEach(l => { BY_N[l.n] = l; });
const MODE = {};
JSON.parse(fs.readFileSync(path.join(__dirname, "cpp", "exam-mode.json"), "utf8")).papers.forEach(p => { MODE[p.cid] = p.mode; });

/* 人工题目录：底稿必须「带着已落盘的人工题」去问改造器，否则 --todo 会把已经补好的场次再列一遍 */
/* --ide：底稿改成「单编辑器」那一套（第二十轮）—— 报告问的是 cpp-exam-ide.cjs，题稿目录换成 cpp/ide */
const IDE = process.argv.slice(2).includes("--ide");
const TOOL = IDE ? "cpp-exam-ide.cjs" : "cpp-exam-single-track.cjs";
const AUTH = path.join(__dirname, "cpp", IDE ? "ide" : "authored");
const AUTHARGS = fs.existsSync(AUTH) ? ["--authored", AUTH] : [];
const argv = process.argv.slice(2);
const COURSE = argv.includes("--course") ? argv[argv.indexOf("--course") + 1] : null;
const cids = argv.filter(a => /^[cm]\d+$/.test(a));

function noOf(cid) { return Number(String(cid).replace(/\D/g, "")); }
function courseOf(cid) { return noOf(cid) <= 81 ? "cpp" : "cppm"; }

/* ---------- 正文：按课号找到那一章，打出底稿需要的几栏 ---------- */
function chapterOf(cid) {
  const course = courseOf(cid);
  const dir = path.join(DATA, course);
  const ctx = { window: {}, console: { log: () => { }, error: () => { }, warn: () => { } } };
  ctx.self = ctx.window; ctx.globalThis = ctx.window; ctx.document = { createElement: () => ({}) };
  vm.createContext(ctx);
  let hit = null;
  fs.readdirSync(dir).filter(f => /^p\d+\.js$/.test(f)).sort().forEach(f => {
    try {
      vm.runInContext(fs.readFileSync(path.join(dir, f), "utf8"), ctx, { filename: f, timeout: 20000 });
      Object.keys(ctx.window).filter(k => /^MIAO_CPP(M)?_P\d+$/.test(k)).forEach(k => {
        ((ctx.window[k] || {}).chapters || []).forEach(c => { if (c.id === cid) hit = c; });
      });
    } catch (e) { /* 正在被写的分部不归这里管，cpp-audit 那条负责 */ }
  });
  return hit;
}

/* ---------- 考卷：改造器同一份载卷口径 ---------- */
function paperOf(cid) {
  const course = courseOf(cid);
  const dir = path.join(DATA, course + "-exam");
  const ctx = { window: {}, console: { log: () => { }, error: () => { }, warn: () => { } } };
  ctx.self = ctx.window; ctx.globalThis = ctx.window;
  vm.createContext(ctx);
  let hit = null, file = "";
  /* 一份文件一个干净上下文：窗口里留着上一份的包名，会把出处文件认错 */
  fs.readdirSync(dir).filter(f => /^p\d+\.js$/.test(f)).sort().forEach(f => {
    const one = { window: {}, console: { log: () => { }, error: () => { }, warn: () => { } } };
    one.self = one.window; one.globalThis = one.window;
    vm.createContext(one);
    vm.runInContext(fs.readFileSync(path.join(dir, f), "utf8"), one, { filename: f, timeout: 20000 });
    Object.keys(one.window).filter(k => /^MIAO_CPP(M)?_EXAM_P\d+$/.test(k)).forEach(k => {
      ((one.window[k] || {}).papers || []).forEach(p => { if (p.cid === cid) { hit = p; file = f; } });
    });
  });
  return { paper: hit, file };
}

function dump(cid) {
  const lesson = BY_N[noOf(cid)];
  const { paper, file } = paperOf(cid);
  const L = [];
  L.push("═".repeat(78));
  L.push("【" + cid + "】" + (lesson ? lesson.title : "（源稿课表里没有这一课）") + "　形状：" + (IDE ? "要改成单编辑器" : (MODE[cid] || "未分配")) +
    "　考卷文件：" + courseOf(cid) + "-exam/" + file);
  if (!lesson) { console.log(L.join("\n")); return; }
  L.push("");
  L.push("〔源稿任务〕（coversTask 就是下面的编号，一条都不许漏 —— D-57）");
  lesson.tasks.forEach((t, i) => L.push("  " + (i + 1) + ". " + t));

  const rep = pendingReport(cid);
  if (rep) {
    L.push("");
    L.push("〔闸判它还缺〕" + rep);
  }

  const ch = chapterOf(cid);
  if (ch) {
    L.push("");
    L.push("〔正文里教过的东西〕题干与参考解只许用这里出现过的写法（构造首现闸也按这条）");
    ch.blocks.forEach(b => {
      if (b.t === "tip" && /本课目标/.test(String(b.text || ""))) L.push("  目标：" + String(b.text).replace(/^本课目标：/, ""));
      if (b.t === "h2") L.push("  ── " + b.text);
      if (b.t === "code") String(b.code || b.text || "").split("\n").forEach(s => L.push("      " + s));
    });
  } else {
    L.push("");
    L.push("〔正文〕这份底稿里没找到 " + cid + " 的章（正文还没落盘），出题只依据上面的任务栏。");
  }

  if (paper) {
    L.push("");
    L.push("〔这一场现有的 " + (paper.questions || []).length + " 道题〕");
    (paper.questions || []).forEach(q => {
      L.push("  " + q.id + " · " + q.type + " · " + q.score + " 分 · 盖任务 " +
        (q.coversTask == null ? "—" : JSON.stringify(q.coversTask)));
      L.push("     题干：" + String(q.stem || "").replace(/\n/g, " ⏎ "));
      if (q.options) L.push("     选项：" + q.options.join(" ｜ "));
      if (q.steps) L.push("     步骤：" + q.steps.join(" → "));
      if (q.left) L.push("     左边：" + q.left.join(" ｜ "));
      if (q.right) L.push("     右边：" + q.right.join(" ｜ "));
      if (q.acceptRegex) L.push("     判分正则：" + JSON.stringify(q.acceptRegex));
      if (q.accept) L.push("     可接受答案：" + JSON.stringify(q.accept));
      if (q.acceptLines) L.push("     逐行答案：" + JSON.stringify(q.acceptLines));
      if (q.answer !== undefined && q.type !== "match") L.push("     答案：" + JSON.stringify(q.answer));
      if (q.type === "match") L.push("     配对：" + JSON.stringify(q.answer));
      if (q.sample) L.push("     参考写法：" + String(q.sample).replace(/\n/g, " ⏎ "));
      L.push("     为什么：" + String(q.why || "").replace(/\n/g, " ⏎ "));
    });
    const st = paper.selftest || {};
    if (st.refs) L.push("  自测参考解：" + JSON.stringify(st.refs[0]));
    if (st.wrongs) L.push("  自测错解　：" + JSON.stringify(st.wrongs[0]));
    if (st.loose) L.push("  自测宽松解：" + JSON.stringify(st.loose[0]));
  } else {
    L.push("");
    L.push("〔考卷〕这一课还没有卷子。");
  }
  console.log(L.join("\n"));
}

/* 改造器对这一场的判断（同一份代码、同一份口径，别再数一遍题数） */
function pendingReport(cid) {
  const out = cp.execFileSync(process.execPath,
    [path.join(__dirname, TOOL), "--dry", "--only", cid].concat(AUTHARGS),
    { encoding: "utf8" });
  return out.split("\n").filter(l => l.includes("· " + cid + "："))
    .map(l => l.replace(/^.*?·\s*/, "")).join("　");
}

if (argv.includes("--todo")) {
  const out = cp.execFileSync(process.execPath,
    [path.join(__dirname, TOOL), "--dry"].concat(AUTHARGS).concat(COURSE ? ["--course", COURSE] : []),
    { encoding: "utf8" });
  const rows = out.split("\n").filter(l => /^\s+·\s/.test(l));
  console.log("〔要人工出题的场次〕共 " + rows.length + " 条报告（一场可能不止一条）");
  rows.forEach(l => console.log(l.trim()));
  const byCid = {};
  rows.forEach(l => { const cid = (l.match(/[cm]\d+/) || [])[0]; if (cid) (byCid[cid] = byCid[cid] || []).push(l.replace(/^.*·\s*[cm]\d+：/, "")); });
  console.log("");
  console.log("〔按场次归并〕" + Object.keys(byCid).length + " 场需要人工题：");
  Object.keys(byCid).sort().forEach(cid => {
    const p = paperOf(cid);
    console.log("  " + cid + " [" + (MODE[cid] || "?") + " 轨 · " + ((p.paper && p.paper.questions || []).length) + " 题 · 在 " +
      courseOf(cid) + "-exam/" + p.file + "]　" + byCid[cid].join("；"));
  });
  process.exit(0);
}
if (!cids.length) { console.error("用法：node dev/tools/cpp-exam-seed.cjs c01 c16 …　或 --todo"); process.exit(1); }
cids.forEach(dump);
