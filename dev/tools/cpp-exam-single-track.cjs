/* 喵站 · C++ 考卷单轨改造器（第十轮 T-24）
 *
 * 干什么：按 tools/cpp/exam-mode.json 把每一场卷改成「只有一种形状」，并盖上 mode 章。
 *   quiz（笔试卷）：删掉 code 题；若某条源稿任务只有这道 code 题对着（删了就断覆盖），
 *                  把它原地降级成 blank 填空（acceptRegex 原样留着，判分口径一个字都不变）；
 *                  多正则/多行的那种没法降级 → 本场跳过，报告里点名，等人工写题。
 *   code（代码卷）：删掉非 code 题，只留编辑器题；题数不够 3 道的跳过，等人工补题。
 *   两轨都要：删完把分数按最大余数法补平回 100（D-13），题号重排 q1…qN，selftest 的键跟着改。
 *
 * 为什么改结构走对象层：这些分部文件里除了头部注释没有行内注释，读成对象再序列化回去
 * 最不容易坏（任务书 §11.8 那条「字符串切片补丁把中间整段复制了一遍」的坑就在这儿）。
 *
 * 跑法：
 *   node dev/tools/cpp-exam-single-track.cjs --dry          只看报告不写文件（默认）
 *   node dev/tools/cpp-exam-single-track.cjs --check        打印器无损自检（不写产物）
 *   node dev/tools/cpp-exam-single-track.cjs --write         真改文件
 *   node dev/tools/cpp-exam-single-track.cjs --write --only c01,c02 --course cpp
 *   node dev/tools/cpp-exam-single-track.cjs --authored tools/cpp/authored --verify
 *                                                            先吃人工题（见下），再改单轨，
 *                                                            然后把结果丢进临时目录过真闸，一个字都不落盘
 *
 * 人工题（--authored 目录里的 <cid>.json）—— 机器摊不出题的那几十场由这里补：
 *   { "cid": "c29", "note": "为什么要人工",
 *     "add":  [ { "temp": "a1", "q": {…题对象，别写 id…},
 *                 "selftest": { "ref": "参考解", "wrong": "必定判错的解", "loose": "空格写歪也该对的解" } } ],
 *     "drop": [ "q4" ],
 *     "retag":[ { "id": "q8", "coversTask": 2 } ] }
 *   add 先进场（临时题号 a1…，三档自测跟着补键），drop 再退场，retag 把任务对账挪到别的题上，
 *   最后才走单轨改造与分数摊平、题号重排。
 *   代码卷的 add 必须是 code 题；笔试卷的 add 不许是 code 题（改造器照 mode 删，写了等于白写）。
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const DEV = path.resolve(__dirname, "..");
const DATA = path.join(DEV, "frontend", "assets", "data");
const argv = process.argv.slice(2);
const WRITE = argv.includes("--write");
const ONLY = argv.includes("--only") ? argv[argv.indexOf("--only") + 1].split(",").map(s => s.trim()) : null;
const COURSE = argv.includes("--course") ? argv[argv.indexOf("--course") + 1] : null;
const AUTH_DIR = argv.includes("--authored") ? path.resolve(argv[argv.indexOf("--authored") + 1]) : null;
const VERIFY = argv.includes("--verify");
const MODE = {};
JSON.parse(fs.readFileSync(path.join(__dirname, "cpp", "exam-mode.json"), "utf8"))
  .papers.forEach(p => { MODE[p.cid] = p.mode; });

/* ---------- 载入与写出 ---------- */
function loadPart(file) {
  const ctx = { window: {}, console: { log: () => { }, error: () => { }, warn: () => { } } };
  ctx.self = ctx.window; ctx.globalThis = ctx.window;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(file, "utf8"), ctx, { filename: path.basename(file), timeout: 20000 });
  const key = Object.keys(ctx.window).find(k => /^MIAO_CPP(M)?_EXAM_P\d+$/.test(k));
  if (!key) throw new Error(path.basename(file) + " 里没找到 MIAO_CPP*_EXAM_PNN");
  return { key, papers: ctx.window[key].papers };
}
/* 头部注释（第一段 /* … *\/）原样保留，其余按固定排版重新序列化 */
function headerOf(text) {
  const m = text.match(/^[\s\S]*?\*\//);
  return m ? m[0] + "\n" : "";
}
function emit(key, papers, header) {
  const L = [];
  L.push(header.trimEnd());
  L.push("window." + key + " = {");
  L.push("  papers: [");
  papers.forEach(p => L.push(paperSrc(p).join("\n")));
  L.push("  ]");
  L.push("};");
  return L.join("\n") + "\n";
}
const q = v => JSON.stringify(v);
/* 对象键：不是标识符的（勾线题的配对键是整句话）必须引号包起来，裸写出来的产物跑不起来 */
function keySrc(k) {
  if (/^[A-Za-z_$][\w$]*$/.test(k) && RESERVED.indexOf(k) < 0) return k;
  return JSON.stringify(k);
}
const RESERVED = ["if", "else", "for", "while", "new", "class", "function", "return", "in", "do", "var", "typeof", "default", "case", "switch", "delete", "void", "null", "true", "false", "this", "catch", "throw", "try", "const", "let", "enum", "export", "extends", "import", "super", "yield", "async", "await", "break", "continue", "debugger", "finally", "instanceof", "static", "with"];
function objSrc(o, indent) {
  const keys = Object.keys(o).filter(k => o[k] !== undefined);
  const parts = keys.map(k => keySrc(k) + ": " + valSrc(o[k], indent));
  return "{" + parts.join(", ") + "}";
}
function valSrc(v, indent) {
  if (v === null || v === undefined) return "null";
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (typeof v === "string") return q(v);
  if (Array.isArray(v)) {
    if (v.every(x => ["number", "boolean", "string"].indexOf(typeof x) >= 0)) return "[" + v.map(x => valSrc(x, indent)).join(", ") + "]";
    const inner = v.map(x => " ".repeat(indent + 2) + objSrc(x, indent + 2)).join(",\n");
    return "[\n" + inner + "]";
  }
  if (typeof v === "object") {
    const keys = Object.keys(v).filter(k => v[k] !== undefined);
    const oneline = "{" + keys.map(k => keySrc(k) + ": " + valSrc(v[k], indent)).join(", ") + "}";
    return oneline;
  }
  return String(v);
}
/* 一场卷的源码：字段顺序固定，questions 一题一行（长数组自己换行），selftest 一行一组 */
function paperSrc(p) {
  const order = ["cid", "kind", "mode", "authored", "pass", "title", "task", "hint"];
  const head = order.filter(k => p[k] !== undefined).map(k => k + ": " + valSrc(p[k], 4));
  const L = [];
  L.push("    {");
  L.push("      " + head.join(", ") + ",");
  L.push("      questions: [");
  (p.questions || []).forEach((qq, i) => {
    const qOrder = ["id", "type", "score", "coversTask", "stem", "code", "options", "answer", "answers",
      "accept", "acceptRegex", "sample", "acceptLines", "steps", "left", "right", "matchAny", "why"];
    const keys = qOrder.filter(k => qq[k] !== undefined).concat(Object.keys(qq).filter(k => qOrder.indexOf(k) < 0));
    const body = keys.map(k => k + ": " + valSrc(qq[k], 8)).join(", ");
    L.push("        { " + body + " }" + (i < p.questions.length - 1 ? "," : ""));
  });
  L.push("      ],");
  L.push("      selftest: {");
  const st = p.selftest || {};
  ["refs", "wrongs", "loose"].forEach((k, i, arr) => {
    if (!st[k]) return;
    const rows = st[k].map(a => " ".repeat(10) + objSrc(a, 10)).join(",\n");
    L.push("        " + k + ": [\n" + rows + "]" + (i < arr.length - 1 && st[arr[i + 1]] ? "," : ""));
  });
  L.push("      }");
  L.push("    },");
  return L;
}

/* ---------- 分数补平：整数、每题 ≥5 分、和正好 100，且任务题合计 ≥50（D-58） ----------
   上一版按「全体比例」摊分：删掉一道盖任务的大题之后，剩下任务题摊到的分被非任务题稀释，
   52 场因此掉到 50 分以下。改成两组分摊 —— 任务题这一组先保底 50 分，组内仍按原权重比例。 */
function alloc(scores, total) {
  const n = scores.length;
  if (!n) return [];
  const norm = scores.map(x => (x > 0 ? x : 1));
  const R = norm.reduce((a, b) => a + b, 0);
  const raw = norm.map(x => x * total / R);
  const base = raw.map(x => Math.max(5, Math.floor(x)));
  let sum = base.reduce((a, b) => a + b, 0);
  const order = raw.map((x, i) => ({ i, frac: x - Math.floor(x) })).sort((a, b) => b.frac - a.frac);
  let guard = 0;
  while (sum < total && guard++ < 400) { base[order[sum % n].i]++; sum++; }
  while (sum > total && guard++ < 800) {
    const big = base.map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v)[0];
    if (big.v <= 5) break;
    base[big.i]--; sum--;
  }
  return base;
}
function taskShare(qs) {
  return qs.filter(q => q.coversTask != null).reduce((a, q) => a + (Number(q.score) || 0), 0);
}
/* 返回补平后任务题的合计分 —— 调用方拿它决定「这一场是不是摊不出 50 分，得人工加任务题」 */
function reweight(qs) {
  const S = qs.reduce((a, x) => a + (Number(x.score) || 0), 0);
  if (!S) return taskShare(qs);
  const isTask = q => q.coversTask != null;
  const tIdx = [], nIdx = [];
  qs.forEach((x, i) => (isTask(x) ? tIdx : nIdx).push(i));
  if (tIdx.length) {
    const raw = qs.map(x => (Number(x.score) || 0) * 100 / S);
    const propTask = Math.round(tIdx.reduce((a, i) => a + raw[i], 0));
    const taskTarget = Math.min(Math.max(50, propTask), 100 - 5 * nIdx.length);
    alloc(tIdx.map(i => raw[i]), taskTarget).forEach((v, k) => { qs[tIdx[k]].score = v; });
    alloc(nIdx.map(i => raw[i]), 100 - taskTarget).forEach((v, k) => { qs[nIdx[k]].score = v; });
  } else {
    alloc(qs.map(x => Number(x.score) || 0), 100).forEach((v, i) => { qs[i].score = v; });
  }
  return taskShare(qs);
}
/* 题号重排：q1…qN，selftest 三档的键跟着换（老键名与新键名同序对齐） */
function renumber(p) {
  const map = {};
  (p.questions || []).forEach((x, i) => { map[x.id] = "q" + (i + 1); x.id = "q" + (i + 1); });
  const st = p.selftest || {};
  ["refs", "wrongs", "loose"].forEach(k => {
    if (!Array.isArray(st[k])) return;
    st[k] = st[k].map(ans => {
      const out = {};
      Object.keys(ans).forEach(old => { if (map[old]) out[map[old]] = ans[old]; });
      return out;
    });
  });
  return p;
}

/* 给代码题（和降级成填空的代码题）补一条 sample：复盘里给读者看的是这行参考写法，不是裸正则 */
function fillSample(p) {
  const ref = (p.selftest && p.selftest.refs && p.selftest.refs[0]) || {};
  (p.questions || []).forEach(x => {
    if ((x.type === "code" || x.type === "blank") && !x.sample && typeof ref[x.id] === "string" && /[{}();=]/.test(ref[x.id])) {
      x.sample = ref[x.id];
    }
  });
  return p;
}

/* 题稿指纹：同一份 <cid>.json 只许被吃一次。改造是就地重写产物（题号会重排、题会被删），
   第二次再套同一份人工题就会咬到自己 —— c29 就是这么把已经降级好的填空当旧 code 题删掉的。 */
function hashSrc(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, "0");
}

/* ---------- 人工题：先摊进来，再走改造 ----------
 * --authored <目录> 里每场一份 <cid>.json：
 *   { "cid": "c29", "note": "为什么要人工",
 *     "add":  [ { "temp": "a1", "q": {…题对象…}, "selftest": { "ref": "…", "wrong": "…", "loose": "…" } } ],
 *     "drop": [ "q4" ] }
 * temp 是临时题号：新题先进场（三档自测各补一个键），改造末尾 renumber 统一换成 q1…qN，
 * 所以人工题里不许自己写 id，也不需要预知最终题号。 */
function applyAuthored(p, report) {
  if (!AUTH_DIR) return 0;
  const file = path.join(AUTH_DIR, p.cid + ".json");
  if (!fs.existsSync(file)) return 0;
  const raw = fs.readFileSync(file, "utf8");
  const sum = hashSrc(raw);
  if (p.authored === sum) return 0;                                  /* 这份题稿已经吃进这一场了 */
  if (p.authored) {
    report.push(p.cid + "：题稿换过版本（卷上盖的是 " + p.authored + "，文件是 " + sum +
      "）—— 这一场已按旧题稿改造落盘，要重做先从 git 取回未改造的那一场再跑");
    return 0;
  }
  const doc = JSON.parse(raw);
  const want = MODE[p.cid];
  let n = 0;
  (doc.add || []).forEach((item, i) => {
    const temp = item.temp || ("a" + (i + 1));
    if (!item.q || !item.q.type) { report.push(p.cid + "：人工题 " + temp + " 没有 q 或没有 type"); return; }
    if (!(Number(item.q.score) > 0)) report.push(p.cid + "：人工题 " + temp + " 没给 score —— 摊分时它会按最小权重挤进去，题目分值该由出题人定");
    if (String(item.q.id || temp) !== temp) { report.push(p.cid + "：人工题 " + temp + " 的 id 得跟 temp 一致（renumber 靠这个对齐自测键）"); }
    if (want === "code" && item.q.type !== "code") report.push(p.cid + "：人工题 " + temp + " 是 " + item.q.type + "，这一轨是代码卷，改造时会被删掉");
    if (want === "quiz" && item.q.type === "code") report.push(p.cid + "：人工题 " + temp + " 是 code，这一轨是笔试卷，改造时会被删掉");
    const st = item.selftest || {};
    ["ref", "wrong", "loose"].forEach(k => { if (st[k] === undefined) report.push(p.cid + "：人工题 " + temp + " 的 selftest 缺 " + k); });
    p.questions = p.questions || [];
    if (p.questions.some(x => x.id === temp)) { report.push(p.cid + "：临时题号 " + temp + " 与卷里已有题号撞了"); return; }
    p.questions.push(Object.assign({}, item.q, { id: temp }));
    const rows = p.selftest = p.selftest || {};
    [["refs", "ref"], ["wrongs", "wrong"], ["loose", "loose"]].forEach(([arr, key]) => {
      if (!Array.isArray(rows[arr])) rows[arr] = [];
      if (!rows[arr].length) rows[arr] = [{}];
      rows[arr].forEach(row => { if (row && st[key] !== undefined) row[temp] = st[key]; });
    });
    n++;
  });
  (doc.drop || []).forEach(id => {
    const at = (p.questions || []).findIndex(x => x.id === id);
    if (at < 0) { report.push(p.cid + "：要删的 " + id + " 不在卷里（题号是不是已经重排过了？）"); return; }
    p.questions.splice(at, 1);
    ["refs", "wrongs", "loose"].forEach(k => ((p.selftest || {})[k] || []).forEach(row => { if (row) delete row[id]; }));
    n++;
  });
  /* retag：把一条任务的对账从「被删掉的那道题」挪到「本来就在考这件事的那道题」上。
     机器看不出「这道 output 题其实在验那条写代码的任务」，所以这一步必须人来点。 */
  (doc.retag || []).forEach(r => {
    const target = (p.questions || []).find(x => x.id === r.id);
    if (!target) { report.push(p.cid + "：retag 指的 " + r.id + " 不在卷里"); return; }
    if (r.coversTask == null) delete target.coversTask;   /* 清空：这题不再声称盖哪条任务 */
    else target.coversTask = r.coversTask;
    n++;
  });
  return n ? sum : "";
}

/* ---------- 判定与改造 ---------- */
function tasksOf(q) { return [].concat(q.coversTask == null ? [] : q.coversTask).map(Number); }
function convertQuiz(p, report) {
  fillSample(p);
  const qs = p.questions || [];
  const codes = qs.filter(x => x.type === "code");
  if (!codes.length && !p.__auth) {
    p.mode = MODE[p.cid];
    if (!qs.some(x => x.type === "blank" || x.type === "match"))
      report.push(p.cid + "：笔试卷一道填空/勾线都没有（闸要 ≥1）—— 等人工出题");
    return "clean";
  }
  const kept = qs.filter(x => x.type !== "code");
  const coveredByKept = new Set();
  kept.forEach(x => tasksOf(x).forEach(t => coveredByKept.add(t)));
  const demoted = [], stuck = [];
  for (const c of codes) {
    const need = tasksOf(c).filter(t => !coveredByKept.has(t));
    const pats = [].concat(c.acceptRegex || []);
    if (!need.length) continue;                      /* 任务还有人盖 → 直接删 */
    if (pats.length === 1) { c.type = "blank"; demoted.push(c.id); need.forEach(t => coveredByKept.add(t)); }
    else stuck.push(c.id + "（" + pats.length + " 条正则，任务 " + need.join("/") + " 只有它盖着）");
  }
  if (stuck.length) {
    report.push(p.cid + "：降级不了的写作题 " + stuck.join("、") + " —— 人工出题或 retag，一次全列出，别补一个冒一个");
    return "skip";
  }
  const keptFinal = qs.filter(x => demoted.indexOf(x.id) >= 0 || x.type !== "code");
  if (keptFinal.length < 6) { report.push(p.cid + "：删掉代码题只剩 " + keptFinal.length + " 题，不足 6 题 —— 等人工补题"); return "skip"; }
  p.questions = keptFinal;
  const share = reweight(p.questions);
  if (share < 50) { report.push(p.cid + "：摊平后任务题只有 " + share + " 分，不足 50 —— 等人工补一道任务题"); return "skip"; }
  if (!p.questions.some(x => x.type === "blank" || x.type === "match"))
    report.push(p.cid + "：改完一道填空/勾线都没有（闸要 ≥1）—— 等人工出题");
  renumber(p);
  p.mode = MODE[p.cid];
  if (p.__auth) p.authored = p.__auth;
  return demoted.length ? "demoted" : "trimmed";
}
function convertCode(p, report) {
  fillSample(p);
  const qs = p.questions || [];
  const codes = qs.filter(x => x.type === "code");
  const non = qs.filter(x => x.type !== "code");
  if (!non.length && codes.length >= 3 && !p.__auth) { p.mode = MODE[p.cid]; return "clean"; }
  if (codes.length < 3) { report.push(p.cid + "：只有 " + codes.length + " 道 code 题，代码卷至少 3 道 —— 等人工补题"); return "skip"; }
  const coveredByCode = new Set();
  codes.forEach(x => tasksOf(x).forEach(t => coveredByCode.add(t)));
  const orphan = {};
  non.forEach(n => tasksOf(n).forEach(t => { if (!coveredByCode.has(t)) (orphan[t] = orphan[t] || []).push(n.type + " " + n.id); }));
  if (Object.keys(orphan).length) {
    report.push(p.cid + "：任务 " + Object.keys(orphan).map(t => t + "（只有 " + orphan[t].join("、") + " 盖着）").join("、") +
      " —— 代码卷得为这些任务各补一道 code 题");
    return "skip";
  }
  p.questions = codes;
  const share = reweight(p.questions);
  if (share < 50) { report.push(p.cid + "：删完任务题只有 " + share + " 分，不足 50 —— 等人工补任务题"); return "skip"; }
  renumber(p);
  p.mode = MODE[p.cid];
  if (p.__auth) p.authored = p.__auth;
  return "trimmed";
}

/* ---------- 分部清单 ---------- */
const jobs = [];
[["cpp", "cpp-exam"], ["cppm", "cppm-exam"]].forEach(([course, dir]) => {
  if (COURSE && COURSE !== course) return;
  const d = path.join(DATA, dir);
  fs.readdirSync(d).filter(f => /^p\d+\.js$/.test(f)).sort().forEach(f => jobs.push({ course, file: path.join(d, f) }));
});


/* ---------- 主流程：按分部文件走，一文件一次落盘 ---------- */

/* --check：打印器自检。把原文件读成对象 → 重新序列化 → 再读回来 → 逐字段比对。
   先验后写：这一步不红就不许 --write（序列化器丢一个键就是丢一整道题）。 */
function canon(v) {
  if (Array.isArray(v)) return v.map(canon);
  if (v && typeof v === "object") return Object.keys(v).sort().reduce((a, k) => { a[k] = canon(v[k]); return a; }, {});
  return v;
}
if (argv.includes("--check")) {
  let files = 0, papersN = 0, diffs = 0;
  jobs.forEach(({ file }) => {
    const { key, papers } = loadPart(file);
    const src = emit(key, papers, headerOf(fs.readFileSync(file, "utf8")));
    const tmp = path.join(require("os").tmpdir(), "roundtrip-" + path.basename(file));
    fs.writeFileSync(tmp, src, "utf8");
    const back = loadPart(tmp).papers;
    files++;
    if (back.length !== papers.length) { console.log("  ✘ " + path.basename(file) + " 场次变了 " + papers.length + "→" + back.length); diffs++; }
    papers.forEach((p, i) => {
      papersN++;
      const a = JSON.stringify(canon(p)), b = JSON.stringify(canon(back[i] || {}));
      if (a !== b) {
        diffs++;
        const pa = JSON.parse(a), pb = JSON.parse(b);
        const badKey = Object.keys(pa).find(k => JSON.stringify(canon(pa[k])) !== JSON.stringify(canon(pb[k])));
        console.log("  ✘ " + path.basename(file) + " " + p.cid + " 字段 " + badKey + " 走了一趟变了");
        console.log("     原: " + String(JSON.stringify(pa[badKey])).slice(0, 150));
        console.log("     回: " + String(JSON.stringify(pb[badKey])).slice(0, 150));
      }
    });
    fs.unlinkSync(tmp);
  });
  console.log("[roundtrip] 文件 " + files + " · 场 " + papersN + " · 差异 " + diffs + (diffs ? " —— 打印器不许用" : " —— 打印器无损 ✔"));
  process.exit(diffs ? 1 : 0);
}


const tally = {};
const drafts = [];      /* --verify 用：改完的整份分部，等着写进临时目录过闸 */
jobs.forEach(({ course, file }) => {
  const text = fs.readFileSync(file, "utf8");
  const header = headerOf(text);
  const { key, papers } = loadPart(file);
  const report = [];
  const before = papers.map(p => JSON.stringify(p));
  papers.forEach(p => {
    if (ONLY && ONLY.indexOf(p.cid) < 0) return;
    const want = MODE[p.cid];
    if (!want) { report.push(p.cid + "：分配表里没有这场"); return; }
    if (p.mode && p.mode !== want) { report.push(p.cid + "：卷里已写 mode=" + p.mode + " 与表不符，先别动"); return; }
    const sum = applyAuthored(p, report);
    if (sum) p.__auth = sum;
    const r = want === "code" ? convertCode(p, report) : convertQuiz(p, report);
    delete p.__auth;
    tally[r] = (tally[r] || 0) + 1;
  });
  const after = papers.map(p => JSON.stringify(p));
  let changed = 0;
  before.forEach((b, i) => { if (b !== after[i]) changed++; });
  if (report.length) {
    console.log("〔" + course + "-exam/" + path.basename(file) + "〕要人工处理：");
    report.forEach(r => console.log("   · " + r));
  }
  if (changed) drafts.push({ file, course, key, papers, header, changed });
  if (changed && WRITE && !VERIFY) {
    fs.writeFileSync(file, emit(key, papers, header), "utf8");
    console.log("   写了 " + path.basename(file) + "（改 " + changed + " 场）");
  } else if (changed && !VERIFY) {
    console.log("   （试运行：" + path.basename(file) + " 会改 " + changed + " 场）");
  }
});
console.log("[single-track] " + Object.entries(tally).map(([k, v]) => k + " " + v).join(" · "));

/* ---------- --verify：把改完的整份分部落到临时目录，请真闸过一遍，一个字不写回产物 ----------
   人工题的验收必须以闸的口径为准；自己数题数、自己判分数都会骗人（任务书 §18.6 那一串教训）。 */
if (VERIFY) {
  const os = require("os");
  const cp = require("child_process");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "cpp-exam-verify-"));
  drafts.forEach(d => fs.writeFileSync(path.join(dir, d.course + "-" + path.basename(d.file)), emit(d.key, d.papers, d.header), "utf8"));
  console.log("[verify] 草稿 " + drafts.length + " 份落 " + dir + "，请闸判：");
  const gate = path.join(__dirname, "cpp-exam-check.cjs");
  const args = [gate, "--from", dir].concat(argv.includes("--all") ? ["--all"] : []);
  if (ONLY) args.push("--only", ONLY.join(","));
  const r = cp.spawnSync(process.execPath, args, { stdio: "inherit" });
  drafts.forEach(d => fs.unlinkSync(path.join(dir, d.course + "-" + path.basename(d.file))));
  fs.rmdirSync(dir);
  console.log(r.status === 0 ? "[verify] 闸绿 ✔ 可以 --write" : "[verify] 闸红：按上面每一条改人工题，别改闸");
  process.exit(r.status || 0);
}
console.log(WRITE ? "已落盘" : "未落盘（加 --write 才动文件）");
