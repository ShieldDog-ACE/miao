/* 喵站 · C++ 考卷自检闸（第九轮 T-21）
 *
 * 判什么（任务书 D-57/D-58，任何一条不过退出码 1）：
 *   1. 契约：exam-paper.js 的 validatePaper —— 题型合法、题有 id、权重和正好 100；
 *   2. 任务全覆盖：源稿每一条【任务】都有题带 coversTask 对着它（按 syllabus.json 逐条对账）；
 *   3. 结构：至少 2 道 choice、1 道 output；任务题（带 coversTask）合计 ≥50 分；6–10 题；
 *   4. 自测：selftest.refs 每题参考解判 ≥ 通过线（且必须 = 100，满分卷才算参考解写全了）、
 *      wrongs 判 < 通过线、loose 判 ≥ 通过线；
 *   5. 读者可见字段（task/hint/stem/options/steps/acceptLines/why）不许有梗、反引号、
 *      前向引用（「第 N 课」N > 本课号）或站内不存在的课号；题干代码同样受构造首现闸管。
 *
 * 跑法：
 *   node dev/tools/cpp-exam-check.cjs                查两门课已落盘的全部考卷
 *   node dev/tools/cpp-exam-check.cjs --only c01,c05 只查某几场
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const DEV = path.resolve(__dirname, "..");
const DATA = path.join(DEV, "frontend", "assets", "data");
const SYL = JSON.parse(fs.readFileSync(path.join(__dirname, "cpp", "syllabus.json"), "utf8"));
const PAPER = require(path.join(DEV, "frontend", "assets", "js", "exam-paper.js"));

const BY_N = {};
SYL.lessons.forEach(l => { BY_N[l.n] = l; });
function lessonNo(cid) { return Number(String(cid).replace(/\D/g, "")); }
function courseOf(cid) { return lessonNo(cid) <= 81 ? "cpp" : "cppm"; }

const argv = process.argv.slice(2);
const onlyArg = argv.includes("--only") ? argv[argv.indexOf("--only") + 1].split(",").map(s => s.trim()) : null;
const FIXTURE = argv.includes("--fixture");        /* 自检模式：扫坏样本，期望它一定红 */
const EXAM_DIR = FIXTURE ? path.join(__dirname, "cpp-gate-fixtures", "exam") : path.join(DATA, "cpp-exam");

/* ---------- 载卷：正常模式扫两门课的题包；--fixture 模式扫坏样本（期望它一定红） ---------- */
function loadPapers() {
  const out = [];
  const jobs = FIXTURE
    ? [{ dir: path.join(__dirname, "cpp-gate-fixtures", "exam"), course: "fixture" }]
    : [{ dir: path.join(DATA, "cpp-exam"), course: "cpp" }, { dir: path.join(DATA, "cppm-exam"), course: "cppm" }];
  jobs.forEach(({ dir, course }) => {
    if (!fs.existsSync(dir)) return;
    const ctx = { window: {}, console: { log: () => { }, error: () => { }, warn: () => { } } };
    ctx.self = ctx.window; ctx.globalThis = ctx.window;
    vm.createContext(ctx);
    fs.readdirSync(dir).filter(f => /^p\d+\.js$/.test(f)).sort().forEach(f => {
      try { vm.runInContext(fs.readFileSync(path.join(dir, f), "utf8"), ctx, { filename: f, timeout: 20000 }); }
      catch (e) { out.push({ file: course + "-exam/" + f, broken: "分部跑不起来：" + e.message }); }
    });
    Object.keys(ctx.window).filter(k => /^MIAO_CPP(M)?_EXAM_P\d+$/.test(k)).forEach(k => {
      ((ctx.window[k] || {}).papers || []).forEach(p => out.push({ file: course + "-exam（" + k + "）", paper: p, course }));
    });
  });
  return out;
}

/* ---------- 正文侧同款的梗表与前向引用检查 ---------- */
const MEME = [["椰子蛋", /椰子蛋/], ["句尾喵", /喵[。！!]?\s*$/]];
const TEACH_FOR_STEM = [
  ["lambda", /\[[^\]\n]{0,20}\]\s*\(/, 56],
  ["智能指针", /\b(unique_ptr|shared_ptr|make_unique|make_shared)\b/, 78],
  ["模板", /\btemplate\s*</, 84],   /* 与 cpp-audit 的 TEACH_AT 一致：第 84 课 formatter 特化就要用 */
  ["异常", /\b(try|throw|catch)\b/, 176],
  ["线程", /\b(thread|async|future|mutex)\b/, 200],
  ["cout 旧流", /std::cout/, 999]
];

/* 读者能看见的字段：受闸；selftest 只喂判分器，不受闸 */
function visibleTexts(paper) {
  const out = [];
  out.push(["task", String(paper.task || "")]);
  out.push(["hint", String(paper.hint || "")]);
  out.push(["title", String(paper.title || "")]);
  (paper.questions || []).forEach(q => {
    out.push(["stem:" + q.id, String(q.stem || "")]);
    out.push(["why:" + q.id, String(q.why || "")]);
    out.push(["code:" + q.id, String(q.code || "")]);
    (q.options || []).forEach((o, i) => out.push(["opt:" + q.id + i, String(o)]));
    (q.steps || []).forEach((s, i) => out.push(["step:" + q.id + i, String(s)]));
    (q.acceptLines || []).forEach((s, i) => out.push(["line:" + q.id + i, String(s)]));
    (q.accept || []).forEach((s, i) => out.push(["accept:" + q.id + i, String(s)]));
  });
  return out;
}

const loaded = loadPapers();
const rows = [];
const errors = [];
const seenCid = {};

loaded.forEach(item => {
  if (item.broken) { errors.push("〔" + item.file + "〕" + item.broken); return; }
  const paper = item.paper;
  const cid = paper.cid;
  if (onlyArg && onlyArg.indexOf(cid) < 0) return;
  const no = lessonNo(cid);
  const lesson = BY_N[no];
  if (!lesson) { errors.push("〔" + cid + "〕源稿课表里没有第 " + no + " 课"); return; }
  if (seenCid[cid]) errors.push("〔" + cid + "〕场次重复");
  seenCid[cid] = 1;

  const where = courseOf(cid) + " 第 " + no + " 课卷";

  /* 1. 契约 */
  const contract = PAPER.validatePaper(paper);
  contract.forEach(e => errors.push("〔" + cid + "〕契约：" + e));
  if (paper.kind !== "paper") errors.push("〔" + cid + "〕kind 必须是 \"paper\"，现在是 " + JSON.stringify(paper.kind));
  if (!FIXTURE && String(cid).slice(0, 1) !== (no <= 81 ? "c" : "m")) errors.push("〔" + cid + "〕cid 前缀与课号归属不符");

  const qs = paper.questions || [];
  /* 2. 任务全覆盖 */
  const covered = new Set();
  qs.forEach(q => {
    if (q.coversTask == null) return;
    [].concat(q.coversTask).forEach(t => covered.add(Number(t)));
  });
  /* 任务题总分：带 coversTask 的题相加（一条题盖多条任务时分只算一次） */
  const taskQScore = qs.filter(q => q.coversTask != null).reduce((a, q) => a + (Number(q.score) || 0), 0);
  lesson.tasks.forEach((t, i) => {
    if (!covered.has(i + 1)) errors.push("〔" + cid + "〕任务对账：源稿第 " + (i + 1) + " 条任务「" + t.slice(0, 28) + "…」没有任何题的 coversTask 对着它（D-57）");
  });

  /* 3. 结构 */
  const nChoice = qs.filter(q => q.type === "choice").length;
  const nOutput = qs.filter(q => q.type === "output").length;
  if (qs.length < 6 || qs.length > 10) errors.push("〔" + cid + "〕结构：题目 " + qs.length + " 道，要求 6–10 道（D-58）");
  if (nChoice < 2) errors.push("〔" + cid + "〕结构：choice 只有 " + nChoice + " 道，要求 ≥2");
  if (nOutput < 1) errors.push("〔" + cid + "〕结构：没有 output 题（读代码写输出），要求 ≥1");
  if (taskQScore < 50) errors.push("〔" + cid + "〕结构：任务题合计 " + taskQScore + " 分，要求 ≥50（考的就是本课任务）");

  /* 4. 自测 */
  const st = paper.selftest || {};
  const passLine = paper.pass == null ? 60 : paper.pass;
  const run = (ans, label) => {
    try { return PAPER.gradePaper(paper, ans); }
    catch (e) { errors.push("〔" + cid + "〕自测 " + label + "：判分器报错 " + e.message); return null; }
  };
  if (!st.refs || !st.refs.length) errors.push("〔" + cid + "〕自测：没有 refs（参考解），这道卷没自测过");
  (st.refs || []).forEach((a, i) => {
    const r = run(a, "refs" + i);
    if (!r) return;
    if (r.score < passLine) errors.push("〔" + cid + "〕自测：参考解 refs" + i + " 只判 " + r.score + " 分，过不了线 " + passLine);
    else if (r.score !== 100) errors.push("〔" + cid + "〕自测：参考解 refs" + i + " 判 " + r.score + " 分 —— 参考解就该是满分，差的分说明题面写得让别人没法答对（哪题看 saw）");
  });
  (st.wrongs || []).forEach((a, i) => {
    const r = run(a, "wrongs" + i);
    if (!r) return;
    if (r.score >= passLine) errors.push("〔" + cid + "〕自测：错解 wrongs" + i + " 竟然判过了（" + r.score + " 分）—— 按 D-13 砍项或重排权重");
  });
  (st.loose || []).forEach((a, i) => {
    const r = run(a, "loose" + i);
    if (!r) return;
    if (r.score < passLine) errors.push("〔" + cid + "〕自测：宽松写法 loose" + i + " 被判 " + r.score + " 分（需求 6：多个空格/大小写不该判错）");
  });

  /* 5. 读者可见字段 */
  visibleTexts(paper).forEach(([field, text]) => {
    MEME.forEach(([name, re]) => { if (re.test(text)) errors.push("〔" + cid + "〕梗：" + field + " 里有「" + name + "」"); });
    if (/`/.test(text)) errors.push("〔" + cid + "〕反引号：" + field + "（会把分部文件的字符串切坏）");
    const rr = /第\s*(\d+)\s*课/g; let m;
    while ((m = rr.exec(text))) {
      const n = Number(m[1]);
      if (!BY_N[n]) errors.push("〔" + cid + "〕交叉引用：" + field + " 指向站内不存在的第 " + n + " 课");
      else if (n > no) errors.push("〔" + cid + "〕前向引用：" + field + " 里写了第 " + n + " 课（本课才第 " + no + " 课）");
    }
    TEACH_FOR_STEM.forEach(([name, re, at]) => {
      if (at > no && re.test(text)) errors.push("〔" + cid + "〕提前接触：" + field + " 出现「" + name + "」，它第 " + at + " 课才教");
    });
  });

  rows.push({ cid, no, qs: qs.length, taskQScore, covered: covered.size, of: lesson.tasks.length, passLine });
});

/* 汇总：正文写了、考卷没跟上的章必须点名（「每课都有一场考」是需求，不是愿望） */
function bodyCids() {
  const set = new Set();
  ["cpp", "cppm"].forEach(course => {
    const dir = path.join(DATA, course);
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).filter(f => /^p\d+\.js$/.test(f)).sort().forEach(f => {
      const ctx = { window: {}, console: { log: () => { }, error: () => { }, warn: () => { } } };
      ctx.self = ctx.window; ctx.globalThis = ctx.window; ctx.document = { createElement: () => ({}) };
      vm.createContext(ctx);
      try {
        vm.runInContext(fs.readFileSync(path.join(dir, f), "utf8"), ctx, { filename: f, timeout: 20000 });
        Object.keys(ctx.window).filter(k => /^MIAO_CPP(M)?_P\d+$/.test(k)).forEach(k => {
          ((ctx.window[k] || {}).chapters || []).forEach(c => {
            /* 占位章不算「写了」：装配层的占位块里有那句「正文还在写」 */
            const isPlaceholder = (c.blocks || []).some(b => b && /正文还在写/.test(String(b.text || "")));
            /* 第 0 课三节准备课（s01–s03）按口径不排考试，沿用 python 那门课 D-9 的处理 */
            if (!isPlaceholder && !/^s\d/.test(String(c.id || ""))) set.add(c.id);
          });
        });
      } catch (e) { /* 正在被写的分部：这里不报语法错，cpp-audit 那条负责 */ }
    });
  });
  return set;
}
const bodies = FIXTURE ? new Set() : bodyCids();
const scoped = onlyArg && !FIXTURE ? new Set(onlyArg) : null;   /* --only 只该查这几场，别把别人的缺卷也算进来 */
const have = new Set(rows.map(r => r.cid));
const noPaper = [...bodies].filter(cid => !have.has(cid) && (!scoped || scoped.has(cid))).sort();
noPaper.forEach(cid => errors.push("〔" + cid + "〕正文已经写完，但这一课还没有考卷（需求：每一课都考，考过才算完成）"));

const gotCpp = rows.filter(r => r.no <= 81).length;
if (FIXTURE) console.log("[cpp-exam-check] 自检模式：扫的是 tools/cpp-gate-fixtures/exam 的坏样本");
const gotCppm = rows.filter(r => r.no > 81).length;
console.log("[cpp-exam-check] 本场检查 " + rows.length + " 场 · 错误 " + errors.length);
rows.slice(0, 10).forEach(r => console.log("  · " + r.cid + " 题 " + r.qs + " · 任务题 " + r.taskQScore + " 分 · 盖住任务 " + r.covered + "/" + r.of));
errors.slice(0, 60).forEach(e => console.log("  ✘ " + e));
if (errors.length > 60) console.log("  …还有 " + (errors.length - 60) + " 条");
console.log("[cpp-exam-check] 进度：入门 " + gotCpp + "/81 场 · 掌握 " + gotCppm + "/132 场 · 已写正文 " + bodies.size + " 章");
process.exit(errors.length ? 1 : 0);
