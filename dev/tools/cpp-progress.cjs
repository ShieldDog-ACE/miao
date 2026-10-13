/* 喵站 · C++ 双课进度盘点（第九轮）
 *
 * 为什么单独立一个脚本：我连着两次拿一次性 node -e 数进度，第二次把考卷目录漏扫了，
 * 当场报出「缺考卷 213」这种假红灯（任务书 §12.6 的老教训：自己的检查也会造假）。
 * 数进度必须有一份可复跑的脚本，不能每次现写。
 *
 * 跑法：node dev/tools/cpp-progress.cjs
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const DEV = path.resolve(__dirname, "..");
const DATA = path.join(DEV, "frontend", "assets", "data");

function runFile(file) {
  const ctx = { window: {}, console: { log: () => { }, error: () => { }, warn: () => { } } };
  ctx.self = ctx.window; ctx.globalThis = ctx.window; ctx.document = { createElement: () => ({}) };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(file, "utf8"), ctx, { filename: path.basename(file), timeout: 20000 });
  return ctx.window;
}
function eachPack(dir, re, cb) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).filter(f => /^p\d+\.js$/.test(f)).sort().forEach(f => {
    let win;
    try { win = runFile(path.join(dir, f)); }
    catch (e) { console.log(`  ( ${path.basename(dir)}/${f} 正在被写，本轮跳过：${e.message} )`); return; }
    Object.keys(win).filter(k => re.test(k)).forEach(k => cb(win[k] || {}));
  });
}

const chapters = new Set(), papers = new Set(), svgs = new Set(), sizes = [];
function eatChapter(c) {
  if (!c || !c.id) return;
  const placeholder = (c.blocks || []).some(b => b && /正文还在写/.test(String(b.text || "")));
  if (placeholder) return;                 // 占位骨架不算「写了」
  chapters.add(c.id);
  if ((c.blocks || []).some(b => b && b.t === "svg")) svgs.add(c.id);
  const text = String(c.title || "") + (c.blocks || []).map(b =>
    (b.t === "p" || b.t === "tip" || b.t === "h2") ? String(b.text || "") :
    (b.t === "ul" ? (b.items || []).join("") : "")).join("");
  sizes.push(text.replace(/\s/g, "").length);
}
eachPack(path.join(DATA, "cpp"), /^MIAO_CPP_P\d+$/, p => (p.chapters || []).forEach(eatChapter));
eachPack(path.join(DATA, "cppm"), /^MIAO_CPPM_P\d+$/, p => (p.chapters || []).forEach(eatChapter));
eachPack(path.join(DATA, "cpp-exam"), /^MIAO_CPP_EXAM_P\d+$/, p => (p.papers || []).forEach(x => x && x.cid && papers.add(x.cid)));
eachPack(path.join(DATA, "cppm-exam"), /^MIAO_CPPM_EXAM_P\d+$/, p => (p.papers || []).forEach(x => x && x.cid && papers.add(x.cid)));

const idOf = n => n <= 81 ? "c" + String(n).padStart(2, "0") : "m" + n;
const missC = [], missP = [];
for (let n = 1; n <= 213; n++) {
  const id = idOf(n);
  if (!chapters.has(id)) missC.push(n);
  if (!papers.has(id)) missP.push(n);
}
const inEntry = n => n <= 81;
const prep = ["s01", "s02", "s03"].filter(id => chapters.has(id)).length;
const avg = sizes.length ? Math.round(sizes.reduce((a, b) => a + b, 0) / sizes.length) : 0;

function ranges(a) {
  if (!a.length) return "无";
  const out = []; let st = a[0], pv = a[0];
  for (const x of a.slice(1)) { if (x === pv + 1) { pv = x; continue; } out.push(st === pv ? String(st) : st + "-" + pv); st = x; pv = x; }
  out.push(st === pv ? String(st) : st + "-" + pv);
  return out.join(", ");
}

console.log("[进度] C++ 入门：正课真正文 " + (81 - missC.filter(inEntry).length) + "/81 · 准备课 " + prep + "/3 · 考卷 " + (81 - missP.filter(inEntry).length) + "/81");
console.log("       C++ 掌握：正文 " + (132 - missC.filter(n => !inEntry(n)).length) + "/132 · 考卷 " + (132 - missP.filter(n => !inEntry(n)).length) + "/132");
console.log("       已写正文 " + chapters.size + " 章 · 均字数 " + avg + " · 带机制图 " + svgs.size + " 章");
console.log("       缺正文（按源稿课号）：" + ranges(missC));
console.log("       缺考卷（按源稿课号）：" + ranges(missP));
