/* 喵站 · C++ 考卷改单编辑器（第二十轮）
 *
 * 干什么：把两场形状合成一屏 —— 一场卷 = 一块编辑器 + 逐条判定（mode:"ide"），
 *        和 Python 考场同一件外壳（exam-ui.js 的 ide()）。
 *   · mode=code 的 48 场：机器改。原 code 题原样留下当「条件」，acceptRegex 一条不动；
 *     selftest 从「按题号给答案」摊成「整份代码」—— 参考答案 = 各题 sample 拼出来的那份程序。
 *     判分目标是编译命令、报错抄录这类「不在程序本体里」的条件，自动打上 acceptOn:"buffer"。
 *   · mode=quiz 的 135 场：机器摊不出来（选择题没有可判的代码写法），必须有人按源稿【任务】
 *     重写条件。题稿放 dev/tools/cpp/ide/<cid>.json，形状见下面 --authored 那段与
 *     dev/tools/cpp-单编辑器出题规矩.md。
 *
 * 产物只由本文件写出（任务书 D-82）：人不手改 51 份大文件。
 *
 * 跑法：
 *   node dev/tools/cpp-exam-ide.cjs --dry                 只看报告（默认）
 *   node dev/tools/cpp-exam-ide.cjs --check               打印器无损自检：ide 卷吃进来再吐出去必须一字不差
 *   node dev/tools/cpp-exam-ide.cjs --write                真改文件（机器摊得平的那批）
 *   node dev/tools/cpp-exam-ide.cjs --write --only c01,c02
 *   node dev/tools/cpp-exam-ide.cjs --authored dev/tools/cpp/ide --verify --only c02,c03
 *                                                          先吃题稿，再把结果丢进临时目录过真闸，一个字不落盘
 *   node dev/tools/cpp-exam-ide.cjs --todo                 还差题稿的场次与卡点
 *
 * 题稿（--authored 目录里的 <cid>.json，一场一份）：
 *   { "cid": "c02", "note": "为什么这么出（主控看）",
 *     "starter": "可选：给一副不给答案的骨架，闸会验它单独交卷过不了线",
 *     "checks": [ { "stem": "条件一句话（读者在题面注释里看到）",
 *                   "acceptRegex": ["正则"], "sample": "这一条的参考写法",
 *                   "why": "复盘里那句解释", "coversTask": 1, "score": 25,
 *                   "acceptOn": "code" | "buffer" } ],
 *     "notes": [ "旧题里的知识点原话，留在题面注释里给读者看，不判分" ],
 *     "selftest": { "refs": ["整份满分代码"], "wrongs": ["整份典型错代码"], "loose": ["换空格换变量名也要过"] } }
 *   selftest 三档都可以不给：refs 由 checks 的 sample 拼出来；不给 wrongs 就用「少写最后一条」的那份；
 *   不给 loose 就把 refs 的缩进与行内空格改一遍当宽松版 —— 但**必须真的和 refs 不一样**，
 *   一模一样等于自测走过场，当场红。
 */
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");

const DEV = path.resolve(__dirname, "..");
const DATA = path.join(DEV, "frontend", "assets", "data");
const PRINT = require(path.join(__dirname, "cpp-exam-print.cjs"));
const PAPER = require(path.join(DEV, "frontend", "assets", "js", "exam-paper.js"));
const SYL = JSON.parse(fs.readFileSync(path.join(__dirname, "cpp", "syllabus.json"), "utf8"));
const BY_N = {};
SYL.lessons.forEach(l => { BY_N[l.n] = l; });
const lessonNo = cid => Number(String(cid).replace(/\D/g, ""));
const courseOf = cid => (lessonNo(cid) <= 81 ? "cpp" : "cppm");

const argv = process.argv.slice(2);
const WRITE = argv.includes("--write");
const CHECK = argv.includes("--check");
const VERIFY = argv.includes("--verify");
const TODO = argv.includes("--todo");
const ONLY = argv.includes("--only") ? argv[argv.indexOf("--only") + 1].split(",").map(s => s.trim()) : null;
const AUTH = argv.includes("--authored") ? path.resolve(argv[argv.indexOf("--authored") + 1]) : null;

/* ---------- 哪些条件判的不是程序本体 ----------
   「写一行编译命令」「把报错第一行抄成注释」这类：正则找的是 shell 命令或注释文字，
   代码段（剥完注释那部分）里根本不该出现它，所以只能在整份 buffer 上匹配。 */
const RE_COMMAND = /g\+\+|gcc|clang|-std=|-o\\s|\.\/main/;
function guessAcceptOn(q) {
  if (q.acceptOn) return q.acceptOn;
  const pats = [].concat(q.acceptRegex || []).map(p => (p && p.pattern) || String(p));
  const hay = pats.join(" ") + " " + String(q.sample || "") + " " + String(q.stem || "");
  return RE_COMMAND.test(hay) || /^\s*\/\//.test(String(q.sample || "")) ? "buffer" : "code";
}

/* buffer 类条件（写编译命令、抄报错）的那一行不是程序本体：拼进整份文件时写成注释 */
function commentize(raw, acceptOn) {
  if (raw === "" || acceptOn !== "buffer" || /^\s*\/\//.test(raw)) return raw;
  return "// " + raw;
}

/* 给一份整段代码补「用了却没搬」的头：机器拼的要补，人写的题稿也会漏
   （实测 m95 用了 std::views 却没 #include <ranges>）。只补头、不动正文，判分口径一个字都不变。 */
const HEAD_NEED = [[/std::(println|print|format)\b/, "print"], [/\bstd::vector\b/, "vector"],
  [/\bstd::(map|set|unordered_map|unordered_set)\b/, "map"],
  [/std::(sort|find|count_if|for_each|transform|min_element|max_element|reverse)\b/, "algorithm"],
  [/std::accumulate\b/, "numeric"], [/\bstd::(to_string|stoi|stof|string)\b/, "string"],
  [/std::(sqrt|pow|abs|fabs)\b/, "cmath"], [/\bstd::(cin|cout)\b/, "iostream"],
  [/\bstd::(make_unique|make_shared|unique_ptr|shared_ptr)\b/, "memory"],
  [/\bstd::(pair|make_pair|swap)\b/, "utility"], [/\bstd::string_view\b/, "string_view"],
  [/\bstd::(optional|nullopt)\b/, "optional"], [/\bstd::(views|ranges)\b/, "ranges"]];
function fillHeads(src) {
  const out = String(src == null ? "" : src);
  const adds = [];
  HEAD_NEED.forEach(function (row) {
    if (!row[0].test(out)) return;
    if (!new RegExp("#\\s*include\\s*<\\s*" + row[1] + "\\s*>").test(out)) adds.push("#include <" + row[1] + ">");
  });
  if (!adds.length) return out;
  const ls = out.split("\n");
  let at = 0;
  while (at < ls.length && (/^\s*#/.test(ls[at]) || /^\s*$/.test(ls[at]))) at++;
  return ls.slice(0, at).concat(adds, ls.slice(at)).join("\n");
}

/* ---------- 把「每题一行 sample」拼成一份程序 ----------
   拼的顺序按 C++ 的真形状走：预处理在最上，main 那一行之后是语句体，收尾补一个 }，
   注释（编译命令、报错抄录）落在文件尾。拼出来不需要真能编译 —— 单编辑器卷判的是
   「这些关键写法在不在这一份文件里」，而读者看到的参考复盘就是一行一条写法。 */
function assembleProgram(lines) {
  /* 一条 sample 可能本身就是好几行（函数头 + 函数体）：整块分类，别把它的行拆开重排。
     分类只看这一块的第一行：预处理 → 顶上，注释 → 尾上，带 main → 入口，其它 → 语句体。 */
  const heads = [], mains = [], body = [], tail = [];
  (Array.isArray(lines) ? lines : [lines]).forEach(raw => {
    const text = String(raw == null ? "" : raw).replace(/\s+$/, "");
    if (text.trim() === "") return;
    const t = (text.split("\n").find(l => l.trim() !== "") || "").trim();
    if (/^#/.test(t)) heads.push(text);
    else if (/^\/\//.test(t)) tail.push(text);
    else if (/\bmain\s*\(/.test(t)) mains.push(text);
    else body.push(text);
  });
  /* 没有 main 的那些（上一版代码卷每条只要求「写一行」）把语句包进一个 main，
     「编译」那颗按钮对着散语句只会报「没有入口」。函数定义那种自带花括号的留在外层。 */
  let decls = [], stmts = [], wrapped = false;
  if (!mains.length && body.length) {
    decls = []; stmts = [];
    body.forEach(t => {
      const isDef = /^[A-Za-z_][\w:<>,\s*&]*\s+[\w:*&]+\s*\([^;]*\)\s*(const)?\s*\{/.test(t.split("\n")[0].trim());
      (isDef ? decls : stmts).push(t);
    });
    if (stmts.length) { mains.push("int main() {"); wrapped = true; }
  }
  const closedDecls = [];
  decls.forEach(t => {
    closedDecls.push(t);
    const d = (t.match(/{/g) || []).length - (t.match(/}/g) || []).length;
    if (d > 0) closedDecls.push("}".repeat(d));
  });
  const inner = wrapped ? stmts : (mains.length ? body : []);
  const out = heads.slice();
  fillHeadsIn(out.concat(closedDecls, mains, inner, tail).join("\n"), out);
  out.push.apply(out, closedDecls);
  if (mains.length) {
    mains.forEach(m => out.push(m));
    inner.forEach(x => out.push(String(x).split("\n").map(l => (l.trim() ? "    " + l.trim() : "")).join("\n")));
    const head = (mains[mains.length - 1] || "").split("\n").filter(l => l.trim()).pop() || "";
    if (/[{]\s*$/.test(head.trim())) {
      if (wrapped) out.push("    return 0;");
      out.push("}");
    }
  } else {
    body.forEach(x => out.push(x));
  }
  tail.forEach(t => out.push(t));
  /* 整份拼完还差几个右花括号（某条 sample 只截了半句），末尾补齐：宁给一份形状对的清单，不交一份括号对不上号的「参考程序」 */
  const joined = out.join("\n");
  const miss = (joined.match(/{/g) || []).length - (joined.match(/}/g) || []).length;
  if (miss > 0) for (let k = 0; k < miss; k++) out.push("}");
  return out.join("\n") + "\n";
}
function fillHeadsIn(haystack, heads) {
  HEAD_NEED.forEach(function (row) {
    if (!row[0].test(haystack)) return;
    if (!new RegExp("#\\s*include\\s*<\\s*" + row[1] + "\\s*>").test(haystack)) heads.push("#include <" + row[1] + ">");
  });
}
/* 老卷的 selftest 按题号给答案（{q1:…, q2:…}），新卷按整份 buffer 给：摊平成一份程序。 */
function flattenAnswers(p, arr) {
  return (arr || []).map(a => (typeof a === "string" ? a : assembleProgram(p.questions.map(q => (a && a[q.id] != null ? String(a[q.id]) : "")))));
}
/* 逐题错答各自成一份：每条错答单独交卷，只许判在线下 */
function flattenEachWrong(p, a) {
  if (!a || typeof a !== "object") return [];
  if (typeof a === "string") return [a];
  return p.questions.map(q => (a[q.id] == null ? "" : String(a[q.id]))).filter(s => s.trim() !== "");
}
/* 单场改造 */
function toIde(p, why) {
  const out = {
    cid: p.cid, kind: "paper", mode: "ide", authored: p.authored, file: "main.cpp",
    pass: p.pass == null ? 60 : p.pass, title: p.title, task: p.task, hint: p.hint,
    notes: p.notes || [], starter: p.starter == null ? "" : p.starter,
    questions: (p.questions || []).map(q => ({
      id: q.id, type: q.type, score: q.score, coversTask: q.coversTask, stem: q.stem,
      acceptRegex: q.acceptRegex, acceptOn: guessAcceptOn(q), sample: q.sample, why: q.why,
      matchAny: q.matchAny
    })),
    selftest: {}
  };
  /* buffer 类条件的 sample（编译命令、观察抄录）不是程序本体，摊进整份参考程序时写成注释行 ——
     否则拼出来的「参考解」本身就是一段非法 C++，编译与运行那两颗按钮一按就露馅。 */
  const samples = out.questions.map(q => commentize(String(q.sample == null ? "" : q.sample), q.acceptOn));
  const st = p.selftest || {};
  /* 老卷按题号给答案（{q1:…, q2:…}），新卷按整份文件给：摊平时每一条都要按自己的 acceptOn
     决定落在代码段还是注释里 —— 编译命令那一行被当代码拼进参考程序，「运行」一按就报错，那是自找的红。 */
  const asRows = arr => out.questions.map(q => {
    const raw = arr && arr[q.id] != null ? String(arr[q.id]) : "";
    return raw === "" ? "" : commentize(raw, q.acceptOn);
  });
  /* refs：题稿自己给了整份字符串就用它，老卷那种按题号给的答案表拿各条 sample 拼出来 */
  out.selftest.refs = (st.refs || []).length && typeof st.refs[0] === "string"
    ? st.refs.slice() : [assembleProgram(samples)];
  /* wrongs：一块编辑器里，「把上一轮的逐题错答拼成一份文件」是无效自测 —— A 题的错答里常常正好
     带着 B 题要的关键写法（实测 c79：q1 的错答写了 return x * x; 就把 q2 的正则喂饱了）。
     所以摊成：① 空卷；② 每条各写各的典型错答、别的一条都不写。
     每一份都必须判在线下，判过了就点名 —— 那是权重太斜或正则太松，得人来收。 */
  out.selftest.wrongs = [""].concat((st.wrongs || []).length ? asRows(st.wrongs[0]).filter(x => x !== "") : []);
  /* loose：老卷给过宽松写法就沿用（同一套注释/代码口径），没有就下面机械造一版缩进空格变体 */
  out.selftest.loose = (st.loose || []).length && typeof st.loose[0] === "string" ? st.loose.slice()
    : (st.loose || []).length ? [assembleProgram(asRows(st.loose[0]))] : [];
  if (!out.selftest.loose.length || out.selftest.loose.join("") === out.selftest.refs.join(""))
    out.selftest.loose = [looseVariant(out.selftest.refs[0])];
  out._why = why || "";
  return out;
}
/* 题稿（人写的条件）也走同一条 toIde：先把 checks 摊成 questions，再让机器补 selftest */
function fromDraft(d, old) {
  const qs = (d.checks || []).map((c, i) => ({
    id: "q" + (i + 1), type: "code", score: c.score, coversTask: c.coversTask, stem: c.stem,
    acceptRegex: c.acceptRegex, acceptOn: c.acceptOn, sample: c.sample, why: c.why, matchAny: c.matchAny
  }));
  const p = Object.assign({}, old, {
    mode: "ide", questions: qs, notes: d.notes || [], starter: d.starter == null ? "" : d.starter,
    selftest: { refs: (d.selftest || {}).refs, wrongs: (d.selftest || {}).wrongs, loose: (d.selftest || {}).loose }
  });
  const out = toIde(p, "题稿");
  /* 题稿明确给了三档就用题稿的，别拿机器拼的那份盖掉人写的 */
  ["refs", "wrongs", "loose"].forEach(k => {
    if ((d.selftest || {})[k] && (d.selftest || {})[k].length) out.selftest[k] = d.selftest[k].map(String);
  });
  return out;
}

/* ---------- 机器判据：改完当场把这场跑一遍判分器，不等闸 ---------- */
function selfCheck(p) {
  const bad = [];
  /* 三档里 refs 是「读者通过后才看得见的参考程序」，缺头就补头；wrongs / loose 不动 */
  if (p.selftest && p.selftest.refs) p.selftest.refs = p.selftest.refs.map(fillHeads);
  const errs = PAPER.validateIde(p);
  errs.forEach(e => bad.push("契约：" + e));
  const lesson = BY_N[lessonNo(p.cid)];
  const covered = new Set();
  p.questions.forEach(q => {
    if (q.coversTask == null) return;
    [].concat(q.coversTask).forEach(t => {
      const n = Number(t);
      if (!(n >= 1) || !lesson || n > lesson.tasks.length) bad.push("任务对账：" + q.id + " 声称盖第 " + t + " 条，源稿只有 " + ((lesson && lesson.tasks.length) || 0) + " 条");
      else covered.add(n);
    });
  });
  if (lesson) lesson.tasks.forEach((t, i) => { if (!covered.has(i + 1)) bad.push("任务对账：第 " + (i + 1) + " 条「" + String(t).slice(0, 24) + "…」没条件盖住"); });
  const taskScore = p.questions.filter(q => q.coversTask != null).reduce((a, q) => a + (Number(q.score) || 0), 0);
  if (taskScore < 50) bad.push("结构：任务条件合计 " + taskScore + " 分，要求 ≥50");
  const pass = p.pass == null ? 60 : p.pass;
  const run = (src, label, want) => {
    let r;
    try { r = PAPER.gradeIde(p, src); } catch (e) { bad.push("自测 " + label + " 判分器报错：" + e.message); return; }
    if (want === 100 && r.score !== 100) bad.push("自测：" + label + " 判 " + r.score + "（参考写法就该满分，差的那几条见下）" +
      " → " + r.checks.filter(c => !c.ok).map(c => c.id + "「" + String(c.stem).slice(0, 18) + "」").join("、"));
    if (want === "pass" && r.score < pass) bad.push("自测：" + label + " 判 " + r.score + "，过不了线 " + pass);
    if (want === "fail" && r.score >= pass) bad.push("自测：" + label + " 竟然判 " + r.score + " 过了线 —— 这份不算错解");
    if (want === "same") bad.push("自测：那一档和 refs 一字不差，等于没自测");
  };
  (p.selftest.refs || []).forEach((s, i) => run(s, "refs" + i, 100));
  (p.selftest.wrongs || []).forEach((s, i) => run(s, "wrongs" + i, "fail"));
  (p.selftest.loose || []).forEach((s, i) => {
    if (String(s) === String((p.selftest.refs || [])[0])) run(s, "loose" + i, "same");
    else run(s, "loose" + i, "pass");
  });
  if (!String(p.selftest.refs[0] || "").trim()) bad.push("自测：refs 是空的");
  const sf = PAPER.ideStarterFails(p);
  if (!sf.failed) bad.push("starter 单独交卷判 " + sf.score + " 分 —— 骨架不许替读者做完任何一条条件（过不了这条就别预置代码）");
  return bad;
}

/* ---------- 题稿里没有现成卷子可挂的那种（m171/172/191/195：正文写完了但没排考） ----------
   整场从题稿 + 源稿课表现场搭出来，插进这一课所属的那一分部（按已有场次的课号区间找，
   别图省事全塞最后一份 —— 分部是按课号切的，分层加载与闸都按这个前提读）。 */
function buildFromDraft(d) {
  const lesson = BY_N[lessonNo(d.cid)];
  if (!lesson) { console.log("题稿 " + d.cid + " 对不上源稿课表，跳过"); return null; }
  const p = {
    cid: d.cid, kind: "paper", mode: "ide", file: "main.cpp", pass: d.pass || 60,
    title: d.title || ("第 " + lessonNo(d.cid) + " 课考试 · " + String(lesson.title).split("（")[0]),
    task: d.task || ("任务题目：" + lesson.req), hint: d.hint || "",
    starter: d.starter == null ? "" : d.starter, notes: d.notes || [],
    questions: (d.checks || []).map((c, i) => ({
      id: "q" + (i + 1), type: "code", score: c.score, coversTask: c.coversTask, stem: c.stem,
      acceptRegex: c.acceptRegex, acceptOn: c.acceptOn, sample: c.sample, why: c.why, matchAny: c.matchAny
    })),
    selftest: { refs: (d.selftest || {}).refs, wrongs: (d.selftest || {}).wrongs, loose: (d.selftest || {}).loose }
  };
  const out = toIde(p, "新排考");
  ["refs", "wrongs", "loose"].forEach(k => {
    if ((d.selftest || {})[k] && (d.selftest || {})[k].length) out.selftest[k] = d.selftest[k].map(String);
  });
  return out;
}

/* ---------- 主流程 ---------- */
const files = [];
["cpp-exam", "cppm-exam"].forEach(dir => {
  const d = path.join(DATA, dir);
  fs.readdirSync(d).filter(f => /^p\d+\.js$/.test(f)).sort().forEach(f => files.push(path.join(d, f)));
});
const drafts = {};
if (AUTH && fs.existsSync(AUTH)) {
  fs.readdirSync(AUTH).filter(f => /\.json$/.test(f)).forEach(f => {
    try { const d = JSON.parse(fs.readFileSync(path.join(AUTH, f), "utf8")); if (d.cid) drafts[d.cid] = d; }
    catch (e) { console.log("题稿读不了：" + f + " —— " + e.message); }
  });
}

let converted = 0, waiting = 0, fresh = 0;
const report = [];
/* --verify 的临时目录：草稿文件名带课程前缀，别再犯上一轮「两份同名分部互相盖掉」那个错 */
const VERIFY_DIR = VERIFY ? fs.mkdtempSync(path.join(os.tmpdir(), "cpp-ide-verify-")) : null;

/* 先把 51 份分部全读进内存：新排的那几场要知道该插进哪一份（分部是按课号切的） */
const parts = files.map(file => ({ file, part: PRINT.loadPart(file) }));
const existing = new Set();
parts.forEach(({ part }) => part.papers.forEach(p => existing.add(p.cid)));

/* 有题稿、却没现成卷子的课号 = 正文写完了但没排考的那几场 */
const orphanDrafts = Object.keys(drafts).filter(cid => !existing.has(cid) && (!ONLY || ONLY.indexOf(cid) >= 0));
orphanDrafts.forEach(cid => {
  const built = buildFromDraft(drafts[cid]);
  if (!built) return;
  const bad = selfCheck(built);
  report.push([cid, "新排考（" + built.questions.length + " 条条件）" + (bad.length ? " → 红：" + bad.join(" / ") : " ✔")]);
  if (bad.length) return;
  const no = lessonNo(cid), course = courseOf(cid);
  const home = parts.filter(x => courseOf(x.part.papers[0] ? x.part.papers[0].cid : cid) === course)
    .sort((a, b) => {
      const span = x => { const ns = x.part.papers.map(p => lessonNo(p.cid)); return Math.abs((ns[0] + ns[ns.length - 1]) / 2 - no); };
      return span(a) - span(b);
    })[0];
  if (!home) { report.push([cid, "找不到该插进哪一份分部（这一门课一份题包都没有）"]); return; }
  home.part.papers.push(built);
  home.part.papers.sort((a, b) => lessonNo(a.cid) - lessonNo(b.cid));
  fresh++;
});

parts.forEach(({ file, part }) => {
  const papers = part.papers.map(p => {
    if (ONLY && ONLY.indexOf(p.cid) < 0) return p;
    if (p.mode === "ide") { report.push([p.cid, "已经是单编辑器卷，原样留着"]); return p; }
    if (drafts[p.cid]) {
      const out = fromDraft(drafts[p.cid], p);
      const bad = selfCheck(out);
      report.push([p.cid, (p.mode === "code" ? "代码卷摊平" : "笔试卷换题稿") + "（" + out.questions.length + " 条条件）" + (bad.length ? " → 红：" + bad.join(" / ") : " ✔")]);
      converted++;
      return bad.length ? p : out;
    }
    if (p.mode === "code") {
      const out = toIde(p, "机器");
      const bad = selfCheck(out);
      report.push([p.cid, "代码卷摊平（" + out.questions.length + " 条条件）" + (bad.length ? " → 红：" + bad.join(" / ") : " ✔")]);
      converted++;
      return bad.length ? p : out;
    }
    waiting++;
    report.push([p.cid, "还是笔试卷：等 dev/tools/cpp/ide/" + p.cid + ".json 题稿"]);
    return p;
  });
  const src = PRINT.emit(part.key, papers, part.header);
  if (WRITE) fs.writeFileSync(file, src);
  if (VERIFY) fs.writeFileSync(path.join(VERIFY_DIR, courseOf(papers[0].cid) + "__" + path.basename(file)), src);
});

console.log(report.map(r => "  · " + r[0] + " · " + r[1]).join("\n"));
console.log("[cpp-exam-ide] 改了 " + converted + " 场 · 新排 " + fresh + " 场 · 还等题稿 " + waiting + " 场" +
  (ONLY ? "（--only " + ONLY.length + " 场）" : "") + (WRITE ? " · 已落盘" : " · 没写文件"));
if (VERIFY) {
  const out = execFileSync(process.execPath, [path.join(__dirname, "cpp-exam-check.cjs"), "--from", VERIFY_DIR], { encoding: "utf8" });
  console.log(out.trimEnd());
  fs.rmSync(VERIFY_DIR, { recursive: true, force: true });
}
if (TODO) {
  console.log("[todo] 还等题稿的场次：" + report.filter(r => /等 .*题稿/.test(r[1])).map(r => r[0]).join(" "));
}
