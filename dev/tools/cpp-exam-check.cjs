/* 喵站 · C++ 考卷自检闸（第九轮 T-21 · 第十轮 T-24 改单轨）
 *
 * 判什么（任务书 D-57/D-58/D-62，任何一条不过退出码 1）：
 *   1. 契约：exam-paper.js 的 validatePaper —— 题型合法、题有 id、权重和正好 100；
 *   2. 任务全覆盖：源稿每一条【任务】都有题带 coversTask 对着它（按 syllabus.json 逐条对账）；
 *   3. 单轨：每场卷只能是一种形状，且必须与 exam-mode.json 的分配一致
 *        mode=code → 全部是 code 题（一题一枚编辑器），3–6 题，每题都得给 acceptRegex；
 *        mode=quiz → 一道 code 题都不许有，6–10 题，≥2 choice + ≥1 output + ≥1 blank/match；
 *   4. 自测：selftest.refs 每题参考解判 ≥ 通过线（且必须 = 100，满分卷才算参考解写全了）、
 *      wrongs 判 < 通过线、loose 判 ≥ 通过线；
 *   5. 读者可见字段（task/hint/stem/options/steps/left/right/acceptLines/why）不许有梗、反引号、
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
/* 单轨分配表：判「这一课该走哪一轨」的唯一出处，重算命令见 cpp-exam-mode.cjs 头部 */
const MODE_TABLE = {};
JSON.parse(fs.readFileSync(path.join(__dirname, "cpp", "exam-mode.json"), "utf8")).papers.forEach(p => {
  MODE_TABLE[p.cid] = p.mode;
});
const PAPER = require(path.join(DEV, "frontend", "assets", "js", "exam-paper.js"));

const BY_N = {};
SYL.lessons.forEach(l => { BY_N[l.n] = l; });
function lessonNo(cid) { return Number(String(cid).replace(/\D/g, "")); }
function courseOf(cid) { return lessonNo(cid) <= 81 ? "cpp" : "cppm"; }

const argv = process.argv.slice(2);
const onlyArg = argv.includes("--only") ? argv[argv.indexOf("--only") + 1].split(",").map(s => s.trim()) : null;
const FIXTURE = argv.includes("--fixture");        /* 自检模式：扫坏样本，期望它一定红 */
/* --from <目录>：扫目录里的 pNN.js 草稿卷（改造器 --verify 用它把还没落盘的卷子拿来过闸） */
const FROM = argv.includes("--from") ? path.resolve(argv[argv.indexOf("--from") + 1]) : null;

/* ---------- 载卷：正常模式扫两门课的题包；--fixture 扫坏样本；--from 扫草稿目录 ---------- */
function loadPapers() {
  const out = [];
  const jobs = FROM ? [{ dir: FROM, course: "draft" }]
    : FIXTURE
      ? [{ dir: path.join(__dirname, "cpp-gate-fixtures", "exam"), course: "fixture" }]
      : [{ dir: path.join(DATA, "cpp-exam"), course: "cpp" }, { dir: path.join(DATA, "cppm-exam"), course: "cppm" }];
  jobs.forEach(({ dir, course }) => {
    if (!fs.existsSync(dir)) return;
    const ctx = { window: {}, console: { log: () => { }, error: () => { }, warn: () => { } } };
    ctx.self = ctx.window; ctx.globalThis = ctx.window;
    vm.createContext(ctx);
    fs.readdirSync(dir).filter(f => /^[\w-]+\.js$/.test(f)).sort().forEach(f => {
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

/* 读者能看见的字段：受闸；selftest 只喂判分器，不受闸。
   单编辑器卷（mode:"ide"）多出两块读者可见文本 —— notes（旧题的知识点原话就躺在题面注释里）
   与 starter（编辑器预置的那副骨架），还有判错时复盘里给读者看的 sample：一样要过这四条。 */
function visibleTexts(paper) {
  const out = [];
  out.push(["task", String(paper.task || "")]);
  out.push(["hint", String(paper.hint || "")]);
  out.push(["title", String(paper.title || "")]);
  if (paper.starter !== undefined) out.push(["starter", String(paper.starter || "")]);
  (paper.notes || []).forEach((n, i) => out.push(["note" + i, String(n)]));
  (paper.questions || []).forEach(q => {
    out.push(["stem:" + q.id, String(q.stem || "")]);
    out.push(["why:" + q.id, String(q.why || "")]);
    out.push(["code:" + q.id, String(q.code || "")]);
    if (q.sample !== undefined) out.push(["sample:" + q.id, String(q.sample || "")]);
    (q.options || []).forEach((o, i) => out.push(["opt:" + q.id + i, String(o)]));
    (q.steps || []).forEach((s, i) => out.push(["step:" + q.id + i, String(s)]));
    (q.acceptLines || []).forEach((s, i) => out.push(["line:" + q.id + i, String(s)]));
    (q.accept || []).forEach((s, i) => out.push(["accept:" + q.id + i, String(s)]));
    if (q.type === "match") {
      (q.left || []).forEach((s, i) => out.push(["left:" + q.id + i, String(s)]));
      (q.right || []).forEach((s, i) => out.push(["right:" + q.id + i, String(s)]));
      Object.keys(q.answer || {}).forEach(k => {
        out.push(["mlink:" + q.id, String(k) + " → " + String(q.answer[k])]);
      });
    }
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
  const contract = paper.mode === "ide" ? PAPER.validateIde(paper) : PAPER.validatePaper(paper);
  contract.forEach(e => errors.push("〔" + cid + "〕契约：" + e));
  if (paper.kind !== "paper") errors.push("〔" + cid + "〕kind 必须是 \"paper\"，现在是 " + JSON.stringify(paper.kind));
  if (!FIXTURE && String(cid).slice(0, 1) !== (no <= 81 ? "c" : "m")) errors.push("〔" + cid + "〕cid 前缀与课号归属不符");

  const qs = paper.questions || [];
  /* 2. 任务全覆盖 */
  const covered = new Set();
  qs.forEach(q => {
    if (q.coversTask == null) return;
    [].concat(q.coversTask).forEach(t => {
      const n = Number(t);
      /* 越界编号必须点名：它会把「任务题 ≥50 分」这条悄悄撑起来，而源稿根本没那条任务 */
      if (!(n >= 1) || n > lesson.tasks.length) {
        errors.push("〔" + cid + "〕任务对账：" + q.id + " 写着盖第 " + t + " 条任务，源稿这一课只有 " +
          lesson.tasks.length + " 条 —— 越界的 coversTask 是旧稿残留或凭空编号，它会虚增任务题分数（清掉后这场的任务题分要重看）");
        return;
      }
      covered.add(n);
    });
  });
  /* 任务题总分：带 coversTask 的题相加（一条题盖多条任务时分只算一次） */
  const taskQScore = qs.filter(q => q.coversTask != null).reduce((a, q) => a + (Number(q.score) || 0), 0);
  lesson.tasks.forEach((t, i) => {
    if (!covered.has(i + 1)) errors.push("〔" + cid + "〕任务对账：源稿第 " + (i + 1) + " 条任务「" + t.slice(0, 28) + "…」没有任何题的 coversTask 对着它（D-57）");
  });

  /* 3. 形状（D-88：2026-10-15 起一屏到底 —— 每一场都是「一块编辑器 + 逐条判定」）
        迁移途中两种形状并存：还没换掉的笔试卷沿用上一版 D-78 的分配表与旧红线；
        换好的单编辑器卷走下面这一套。全部换完就把分配表与笔试那套一起删掉。 */
  const want = MODE_TABLE[cid];
  const isIde = paper.mode === "ide";
  if (!want && !isIde) errors.push("〔" + cid + "〕单轨：分配表里没有这一课（跑 node dev/tools/cpp-exam-mode.cjs 重算表）");
  if (!isIde && want && paper.mode !== want) errors.push("〔" + cid + "〕单轨：卷里写的 mode 是 " + JSON.stringify(paper.mode) +
    "，分配表判的是 " + JSON.stringify(want) + "（改卷还是改表？改表要写清为什么）");

  const nCode = qs.filter(q => q.type === "code").length;
  const nChoice = qs.filter(q => q.type === "choice").length;
  const nOutput = qs.filter(q => q.type === "output").length;
  const nFill = qs.filter(q => q.type === "blank" || q.type === "match").length;
  if (isIde) {
    /* 单编辑器卷：条件数 3–6、条条是 code、条条给 acceptRegex 与 sample、starter 不许替读者做完 */
    if (nCode !== qs.length) errors.push("〔" + cid + "〕单编辑器：混进 " + (qs.length - nCode) +
      " 条不是 code 的条件（" + [...new Set(qs.filter(q => q.type !== "code").map(q => q.type))].join("/") + "）—— 一块编辑器判不了选择型题");
    if (qs.length < 3 || qs.length > 6) errors.push("〔" + cid + "〕单编辑器：" + qs.length + " 条条件，要求 3–6 条");
    qs.forEach(q => {
      if (![].concat(q.acceptRegex || []).length) errors.push("〔" + cid + "〕单编辑器：条件 " + q.id + " 没给 acceptRegex —— 这块编辑器只有「找关键写法」一条判分路");
      if (!q.sample) errors.push("〔" + cid + "〕单编辑器：条件 " + q.id + " 没给 sample —— 判错了复盘要给读者看参考写法，不许甩裸正则");
    });
    if (paper.file && !/\.(cpp|cc|h)$/.test(String(paper.file))) errors.push("〔" + cid + "〕单编辑器：file 是 " + paper.file + "，C++ 的源文件名得分");
    const sf = PAPER.ideStarterFails(paper);
    if (!sf.failed) errors.push("〔" + cid + "〕单编辑器：预置骨架 starter 单独交卷判 " + sf.score + " 分 —— 骨架不许替读者做完任何一条条件");
    const badAcceptOn = qs.filter(q => q.acceptOn != null && q.acceptOn !== "code" && q.acceptOn !== "buffer");
    if (badAcceptOn.length) errors.push("〔" + cid + "〕单编辑器：" + badAcceptOn.map(q => q.id).join("、") + " 的 acceptOn 只认 code / buffer");
  } else if (want === "code") {
    if (qs.length - nCode > 0) errors.push("〔" + cid + "〕单轨：这一课是代码卷，却混进 " + (qs.length - nCode) +
      " 道非代码题（" + [...new Set(qs.filter(q => q.type !== "code").map(q => q.type))].join("/") + "）—— 代码卷就只留编辑器");
    if (qs.length < 3 || qs.length > 6) errors.push("〔" + cid + "〕单轨：代码卷 " + qs.length + " 道题，要求 3–6 道（D-62）");
    qs.filter(q => q.type === "code").forEach(q => {
      if (![].concat(q.acceptRegex || []).length) errors.push("〔" + cid + "〕单轨：代码题 " + q.id + " 没给 acceptRegex —— 只写字面 accept 会把等价写法判错");
    });
  } else if (want === "quiz") {
    if (nCode > 0) errors.push("〔" + cid + "〕单轨：这一课是笔试卷，却还有 " + nCode + " 道 code 题（笔试卷不许出现编辑器）");
    if (qs.length < 6 || qs.length > 10) errors.push("〔" + cid + "〕单轨：笔试卷 " + qs.length + " 题，要求 6–10 题（D-62）");
    if (nChoice < 2) errors.push("〔" + cid + "〕单轨：choice 只有 " + nChoice + " 道，笔试卷要求 ≥2");
    if (nOutput < 1) errors.push("〔" + cid + "〕单轨：没有 output 题（读代码写输出），笔试卷要求 ≥1");
    if (nFill < 1) errors.push("〔" + cid + "〕单轨：一道填空/勾线都没有，笔试卷要求 ≥1（他点名的「词语填空、勾线题这种」）");
  }
  qs.filter(q => q.type === "match").forEach(q => {
    /* 勾线题的两条形制：少于 3 对就是送分；「第 i 项连第 i 项」整卷对齐等于把答案写在题面上 */
    const left = [].concat(q.left || q.items || []);
    const right = [].concat(q.right || q.options || []);
    const ans = q.answer || {};
    const keys = Object.keys(ans);
    if (keys.length < 3) errors.push("〔" + cid + "〕勾线：" + q.id + " 只有 " + keys.length + " 对，要求 ≥3 对");
    if (left.length < 3 || right.length < 3) errors.push("〔" + cid + "〕勾线：" + q.id + " 两边项数不足 3（左 " + left.length + " / 右 " + right.length + "）");
    const aligned = keys.length >= 3 && keys.every((k, i) => left.indexOf(String(k)) === i && right.indexOf(String(ans[k])) === i);
    if (aligned) errors.push("〔" + cid + "〕勾线：" + q.id + " 每对都是「左边第 i 项 → 右边第 i 项」，不用想就能连完 —— 把右边顺序打乱");
  });
  if (taskQScore < 50) errors.push("〔" + cid + "〕结构：任务题合计 " + taskQScore + " 分，要求 ≥50（考的就是本课任务）");

  /* 4. 自测 */
  const st = paper.selftest || {};
  const passLine = paper.pass == null ? 60 : paper.pass;
  const run = (ans, label) => {
    try { return isIde ? PAPER.gradeIde(paper, String(ans == null ? "" : ans)) : PAPER.gradePaper(paper, ans); }
    catch (e) { errors.push("〔" + cid + "〕自测 " + label + "：判分器报错 " + e.message); return null; }
  };
  if (!st.refs || !st.refs.length) errors.push("〔" + cid + "〕自测：没有 refs（参考解），这道卷没自测过");
  if (isIde && st.refs.some(s => typeof s !== "string")) errors.push("〔" + cid + "〕自测：单编辑器卷的三档必须是「整份代码」的字符串，不是按题号给的答案表");
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

  rows.push({ cid, no, mode: isIde ? "ide" : want, track: isIde ? "ok" : (paper.mode === want ? "ok" : "bad"), qs: qs.length, taskQScore,
    covered: covered.size, of: lesson.tasks.length, passLine });
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
            /* 占位章不算「写了」。上一版只认「正文还在写」那一句，结果 m172/m191/m195 三种占位
               （本课目标写「占位」、块里是 TODO-PRIN / TODO-CODE1 / PH4、整节只有小标题）全被当成写完了，
               闸反过来逼考卷去考一篇没有内容的正文 —— 现在四种形状一起认，另外加一条兜底：
               一章连一段代码演示都没有，就不算写完。 */
            const texts = (c.blocks || []).map(b => String((b && (b.text || b.code || b.html)) || ""));
            const isPlaceholder = texts.some(t => /正文还在写|占位|TODO-[A-Z]|PH\d+/.test(t)) ||
              !(c.blocks || []).some(b => b && b.t === "code");
            /* 第 0 课三节准备课（s01–s03）按口径不排考试，沿用 python 那门课 D-9 的处理 */
            if (!isPlaceholder && !/^s\d/.test(String(c.id || ""))) set.add(c.id);
          });
        });
      } catch (e) { /* 正在被写的分部：这里不报语法错，cpp-audit 那条负责 */ }
    });
  });
  return set;
}
const bodies = (FIXTURE || FROM) ? new Set() : bodyCids();   /* 草稿目录过闸时别把「别人还没写的章」算成本批的红 */
const scoped = onlyArg && !FIXTURE ? new Set(onlyArg) : null;   /* --only 只该查这几场，别把别人的缺卷也算进来 */
const have = new Set(rows.map(r => r.cid));
const noPaper = [...bodies].filter(cid => !have.has(cid) && (!scoped || scoped.has(cid))).sort();
noPaper.forEach(cid => errors.push("〔" + cid + "〕正文已经写完，但这一课还没有考卷（需求：每一课都考，考过才算完成）"));

const gotCpp = rows.filter(r => r.no <= 81).length;
if (FIXTURE) console.log("[cpp-exam-check] 自检模式：扫的是 tools/cpp-gate-fixtures/exam 的坏样本");
if (FROM) console.log("[cpp-exam-check] 草稿模式：扫的是 " + FROM);
const gotCppm = rows.filter(r => r.no > 81).length;
console.log("[cpp-exam-check] 本场检查 " + rows.length + " 场 · 错误 " + errors.length);
rows.slice(0, 10).forEach(r => console.log("  · " + r.cid + " 题 " + r.qs + " · 任务题 " + r.taskQScore + " 分 · 盖住任务 " + r.covered + "/" + r.of));
const errCap = argv.includes("--all") ? errors.length : 60;
errors.slice(0, errCap).forEach(e => console.log("  ✘ " + e));
if (errors.length > errCap) console.log("  …还有 " + (errors.length - errCap) + " 条（加 --all 全打）");
const done = rows.filter(r => r.track === "ok");
console.log("[cpp-exam-check] 进度：入门 " + gotCpp + "/81 场 · 掌握 " + gotCppm + "/132 场 · 已写正文 " + bodies.size + " 章");
console.log("[cpp-exam-check] 形状：单编辑器 " + done.filter(r => r.mode === "ide").length +
  " 场 · 还在旧轨 " + done.filter(r => r.mode !== "ide").length + " 场（代码卷 " + done.filter(r => r.mode === "code").length +
  " · 笔试卷 " + done.filter(r => r.mode === "quiz").length + "）· 形状不对 " + (rows.length - done.length) + " 场");
process.exit(errors.length ? 1 : 0);
