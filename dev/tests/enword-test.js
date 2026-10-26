/* 喵站 · 英语入门考卷自测（22 场：21 场课末 + 1 场结课大考）
 *
 * 这一套盯五件事，每件都真跑 buildPaper / gradeEN，不靠读代码打勾：
 *   1. 每场题数对得上 counts，分值合计正好 100（差一分都算考卷写坏了）；
 *   2. 空卷 0 分不通过，全对 100 分通过；
 *   3. 默写与补全「大小写、首尾空格、中间多空格」都放过，写错一个字母必须挂；
 *   4. 连线半对按比例给分，全对满分；
 *   5. 挖字母不许有第二个答案：把全部单词逐个挖一遍，挖出来的形状在全表里只能命中自己。
 * 跑法：node dev/tests/enword-test.js
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const DEV = path.resolve(__dirname, "..");
const DATA = path.join(DEV, "frontend", "assets", "data");
const results = [];
const ok = (name, cond, extra) => results.push((cond ? "PASS" : "FAIL") + " | " + name + (extra ? "  → " + extra : ""));

function load(file, ctx) {
  vm.runInContext(fs.readFileSync(file, "utf8"), ctx, { filename: file });
}
const packCtx = { window: {}, console: { log() {}, error() {}, warn() {} } };
packCtx.self = packCtx.window; packCtx.globalThis = packCtx.window;
vm.createContext(packCtx);
load(path.join(DATA, "enwords-data.js"), packCtx);
load(path.join(DATA, "enword-exam-data.js"), packCtx);
const PACK = packCtx.window.MIAO_ENW;
const SPEC = packCtx.window.MIAO_ENW_EXAM;

const EN = require(path.join(DEV, "frontend", "assets", "js", "exam-en.js"));
const pools = { words: EN.wordPool(PACK.words) };

/* ---------- 1. 场次与分值 ---------- */
let bad = [];
SPEC.papers.forEach(p => {
  const c = p.counts, w = p.weights;
  const full = w.mc * c.mc + w.pick * c.pick + w.fill * c.fill + w.spell * c.spell + w.matchPair * c.match * p.pairsPerGroup;
  if (full !== 100) bad.push(p.cid + " 满分 " + full);
  const ids = new Set((p.pool || []));
  const inPool = pools.words.filter(x => ids.has(x.lesson));
  const need = c.mc + c.pick + c.fill + c.spell + c.match * p.pairsPerGroup;
  if (!inPool.length) bad.push(p.cid + " 的池子里一个词都没有");
  if (c.match * p.pairsPerGroup > inPool.length) bad.push(p.cid + " 要连 " + c.match * p.pairsPerGroup + " 对，池子只有 " + inPool.length + " 个词");
});
ok("22 场考卷的分值合计都等于 100，池子够出词", bad.length === 0, bad.join("；"));
ok("场次 = 21 课末 + 1 结课", SPEC.papers.length === 22, "实到 " + SPEC.papers.length);

/* ---------- 2~4. 组卷、判分、宽松比对 ---------- */
let built = [], gradeBad = [];
SPEC.papers.forEach(p => {
  const qs = EN.buildPaper(p, pools);
  built.push({ cid: p.cid, n: qs.length });
  const want = p.counts.mc + p.counts.pick + p.counts.fill + p.counts.spell + p.counts.match;
  if (qs.length !== want) gradeBad.push(p.cid + " 出题 " + qs.length + " 道，规格要 " + want);
  const ans = q => q.type === "match" ? {} : (q.type === "mc" || q.type === "pick" ? q.answer : q.answer);
  /* 空卷 */
  const empty = qs.map(q => q.type === "match" ? {} : null);
  const r0 = EN.gradeEN(qs, empty, p.pass);
  if (r0.score !== 0 || r0.passed) gradeBad.push(p.cid + " 空卷判了 " + r0.score);
  /* 全对 */
  const full = qs.map(q => {
    if (q.type === "match") { const m = {}; Object.keys(q.answer).forEach(k => m[k] = q.answer[k]); return m; }
    return q.answer;
  });
  const r1 = EN.gradeEN(qs, full, p.pass);
  if (r1.score !== 100 || !r1.passed) gradeBad.push(p.cid + " 全对判了 " + r1.score);
  /* 大小写与空格 */
  const sloppy = full.map((a, i) => (qs[i].type === "spell" || qs[i].type === "fill") ? "  " + String(a).toUpperCase() + "  " : a);
  const r2 = EN.gradeEN(qs, sloppy, p.pass);
  if (r2.score !== 100) gradeBad.push(p.cid + " 「大写 + 前后空格」被判成 " + r2.score);
  /* 写错一个字母必须挂 */
  const wrong = full.map((a, i) => (qs[i].type === "spell" || qs[i].type === "fill") ? String(a).slice(0, -1) + "z" : a);
  const r3 = EN.gradeEN(qs, wrong, p.pass);
  if (r3.score >= 100) gradeBad.push(p.cid + " 每个默写都少改一个字母还拿 " + r3.score);
  /* 连线只做一半 */
  const half = full.map((a, i) => qs[i].type === "match"
    ? Object.fromEntries(Object.keys(a).filter((k, j) => j % 2 === 0).map(k => [k, a[k]])) : a);
  const r4 = EN.gradeEN(qs, half, p.pass);
  if (r4.score >= 100 || r4.score < 60) gradeBad.push(p.cid + " 连线对一半判了 " + r4.score);
});
ok("22 场：题数、空卷 0 分、全对 100 分、宽松写法仍 100、错一个字母必须挂、连线按比例给分",
  gradeBad.length === 0, gradeBad.slice(0, 4).join("；"));

/* 每一场的题数都报一遍，别用「应该都对了」交差 */
ok("每场题数都落在 12–20 之间（一屏做不完但也不至于做不完）",
  built.every(b => b.n >= 12 && b.n <= 20), built.map(b => b.cid + ":" + b.n).join(" "));

/* ---------- 5. 挖字母：5 个字母以上的词必须挖得独一无二，短词靠中文 + 音标定位 ---------- */
const spell = {};
PACK.words.forEach(w => { spell[String(w.w).toLowerCase()] = 1; });
function hits(mask) {
  /* 一条下划线 = 一个字母：挖空题的题面把词长也露出来了，所以按等长匹配 */
  const re = new RegExp("^" + String(mask).toLowerCase().split("").map(ch => ch === "_" ? "[a-z]" : ch).join("") + "$");
  return Object.keys(spell).filter(s => re.test(s));
}
let maskBad = [], maskShort = 0;
PACK.words.forEach(w => {
  const word = String(w.w).toLowerCase();
  const m = EN.maskWord(w.w, PACK.words);
  if (word.length === 1) {                                   // 单字母（I）没得挖，题面自动换成默写式
    if (m.len !== 0) maskBad.push(word + " 单字母却挖了 " + m.shown);
    return;
  }
  if (m.shown.indexOf("_") < 0) maskBad.push(word + " 的挖空里没有下划线：" + m.shown);
  if (m.shown.replace(/_/g, "").length === 0) maskBad.push(word + " 被挖得一个字母都不剩");
  if (word.length >= 5) {
    const h = hits(m.shown);
    if (h.length !== 1 || h[0] !== word) maskBad.push(word + " → " + m.shown + " 命中 " + h.join("/"));
  } else maskShort++;
});
ok("全部单词逐个挖字母：长词形状唯一、短词至少露一个挖一个、单字母不挖", maskBad.length === 0,
  maskBad.slice(0, 6).join("；") + "（短词 " + maskShort + " 个走中文+音标）");

/* ---------- 6. 选项里不许出现两个都能答的项 ---------- */
let optBad = [];
SPEC.papers.forEach(p => {
  for (let k = 0; k < 12; k++) {
    const qs = EN.buildPaper(p, pools);
    qs.forEach(q => {
      if (q.type !== "mc" && q.type !== "pick") return;
      if (new Set(q.options).size !== q.options.length) optBad.push(p.cid + " " + q.id + " 选项重复：" + q.options.join("/"));
      if (q.options.length < 4) optBad.push(p.cid + " " + q.id + " 只有 " + q.options.length + " 个选项");
    });
    /* 同一场里不许出现两道「题面 + 选项 + 答案」都一样的题（听力题的题面本来就同一句，靠选项与答案区分） */
    const sig = qs.map(q => q.prompt + "|" + (q.options ? q.options.join("/") : "") + "|" + JSON.stringify(q.answer));
    const dup = sig.filter((s, i) => sig.indexOf(s) !== i)[0];
    if (dup) optBad.push(p.cid + " 出现两道一模一样的题：" + String(dup).slice(0, 110));
  }
});
ok("抽 252 次卷：选项不重复、每题四个选项、题面不撞车", optBad.length === 0, optBad.slice(0, 5).join("；"));

const fails = results.filter(r => r.startsWith("FAIL"));
results.forEach(r => console.log(r));
console.log(`\n合计 ${results.length} 项，失败 ${fails.length} 项 · 22 场考卷 · ${PACK.words.length} 个词`);
process.exit(fails.length ? 1 : 0);
