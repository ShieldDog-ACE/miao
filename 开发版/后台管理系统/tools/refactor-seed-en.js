/* 让 seed-data.js 里的 english 教程变成对 en-data.js 的引用（最小侵入）
 *
 * 目标：把 seed 中「写死的 english 教程对象」整段替换成一行
 *      `window.MIAO_EN.tutorial`，python 等其他内容一字不动。
 *
 * 为什么不能「解析后重新序列化整个 tutorials 数组」：
 *   seed 里的对象是 JS 字面量而非严格 JSON（数组尾逗号、单引号容忍等），
 *   JSON.stringify 虽能输出合法 JSON，但会把 python 等其他条目也重排一遍；
 *   而重新解析又可能因尾逗号直接报错。整段重写风险太高 —— 曾把 seed 写坏过。
 *
 * 做法：只做一次「行区间替换」
 *   1) 找到 english 教程对象所在的行区间（从其注释/首行到对象闭合）
 *   2) 用 window.MIAO_EN.tutorial 这一行替换
 *   3) 写回前自检：新文本仍能 vm 求值、tutorials 数量不变、
 *      english 仍解析出 3 章、python 章节数不变
 *
 * 幂等。用法：node tools/refactor-seed-en.js
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const DIR = path.join(__dirname, "..");
const SEED = path.join(DIR, "seed-data.js");
const EN = path.join(DIR, "en-data.js");
const ID = "english";

/** 读入并求值 seed（含 en-data），返回 { text, tutorials } */
function evalSeed(extra) {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(EN, "utf8"), ctx, { timeout: 5000 });
  vm.runInContext(extra != null ? extra : fs.readFileSync(SEED, "utf8"), ctx, { timeout: 5000 });
  return ctx.window.MIAO_DATA.tutorials;
}

/**
 * 定位 english 教程对象在行数组中的区间 [from, to]（0-based, 含两端）
 * 策略：找 `"id": "english"` 所在行，往上找该对象起始的 `{`，
 *      再逐字符配平（含字符串/转义/注释）到对象闭合的 `}`。
 *      这个对象的层级很浅（tutorials 数组的直接元素），配平可靠。
 */
function findEnglishRange(lines) {
  const idIdx = lines.findIndex((l) => l.indexOf('"id": "' + ID + '"') >= 0);
  if (idIdx < 0) return null;

  // 往回找最近的行首为 "{"（或 "  {"）的行
  let start = -1;
  for (let i = idIdx; i >= 0; i--) {
    if (/^\s*\{\s*$/.test(lines[i])) { start = i; break; }
  }
  if (start < 0) return null;

  // 从 start 做逐字符配平到对象闭合
  let depth = 0, inStr = false, inS = false, inL = false, esc = false;
  for (let i = start; i < lines.length; i++) {
    const line = lines[i];
    for (let k = 0; k < line.length; k++) {
      const c = line[k], n = line[k + 1];
      if (inL) { if (c === "\n") inL = false; continue; }
      if (inS) { if (c === "*" && n === "/") { inS = false; k++; } continue; }
      if (inStr) {
        if (esc) esc = false;
        else if (c === "\\") esc = true;
        else if (c === '"') inStr = false;
        continue;
      }
      if (c === "/" && n === "/") { inL = true; break; }
      if (c === "/" && n === "*") { inS = true; k++; continue; }
      if (c === '"') { inStr = true; continue; }
      if (c === "{" || c === "[") depth++;
      else if (c === "}" || c === "]") {
        depth--;
        if (depth === 0) return { from: start, to: i };
      }
    }
  }
  return null;
}

const text = fs.readFileSync(SEED, "utf8");
const lines = text.split("\n");
const tutorials = evalSeed();
const enCount = tutorials.filter((t) => t && t.id === ID).length;
const pyChapters = (tutorials.find((t) => t && t.id === "python") || { chapters: [] }).chapters.length;

if (enCount > 1) {
  console.error("seed 中 english 出现 " + enCount + " 次，请先清理，已放弃");
  process.exit(1);
}

/* 已经引用化过：seed 里只有 window.MIAO_EN.tutorial 而无写死副本，直接结束。
   （findEnglishRange 找的是 `"id": "english"` 字面量；引用化之后它不存在，
     若不提前返回会误判为「尚未插入」而再追加一条。） */
const alreadyRef = lines.some((l) => /^\s*window\.MIAO_EN\.tutorial\s*,?\s*$/.test(l));
if (alreadyRef && enCount === 1 && !findEnglishRange(lines)) {
  console.log("english 已是 window.MIAO_EN.tutorial 引用，无需改动");
  console.log("文件：" + SEED + "（" + fs.statSync(SEED).size + " B / " + lines.length + " 行）");
  process.exit(0);
}

const range = findEnglishRange(lines);
const REF = [
  "  /* 英语发音 · 26 字母 + 48 音标：数据与正文全部来自 en-data.js（唯一来源） */",
  "  window.MIAO_EN.tutorial"
];

let out;
let mode;
if (!range) {
  /* seed 中还没有 english：把它作为引用追加到 tutorials 数组末尾。
     插入点不能靠静态特征猜 —— 这个文件里 chapters / blocks / tutorials 层层都是
     "]" 换行 "}"，光看形状无法区分（曾把 english 插进 python 的 chapters 里）。
     改为「试插 + 求值验证」：从尾部往上枚举每个 "]" 作为候选插入点，
     逐个生成新文本并 vm 求值，第一个让 tutorials 恰好多出一条、
     且 english 解析出 3 章、python 章节数不变的位置即为正确插入点。 */
  mode = "insert";
  const REF_T = ["  /* 英语发音 · 26 字母 + 48 音标：数据与正文全部来自 en-data.js（唯一来源） */",
                 "  window.MIAO_EN.tutorial"];
  let picked = -1, tried = [];
  for (let i = lines.length - 1; i > 1 && picked < 0; i--) {
    if (!/^\s*\]/.test(lines[i])) continue;
    const l2 = lines.slice();
    let lastIdx = i - 1;
    while (lastIdx >= 0 && l2[lastIdx].trim() === "") lastIdx--;
    if (!/,\s*$/.test(l2[lastIdx])) l2[lastIdx] = l2[lastIdx] + ",";
    const cand = l2.slice(0, i).concat(REF_T, l2.slice(i)).join("\n");
    tried.push(i + 1);
    let t = null;
    try { t = evalSeed(cand); } catch (e) { continue; }
    const en = t.find((x) => x && x.id === ID);
    const py = t.find((x) => x && x.id === "python");
    if (t.length === tutorials.length + 1 && en && en.chapters.length === 3 &&
        py && py.chapters.length === pyChapters) {
      picked = i;
      out = cand;
    }
  }
  if (picked < 0) {
    console.error("未能自动定位 tutorials 收尾行（试过行号 " + tried.slice(0, 12).join(",") + "…），已放弃");
    process.exit(1);
  }
} else {
  mode = enCount === 1 ? "refactor" : "noop";
  let from = range.from;
  if (from > 0 && /\/\*/.test(lines[from - 1]) && /英语/.test(lines[from - 1])) from -= 1;
  out = lines.slice(0, from).concat(REF, lines.slice(range.to + 1)).join("\n");
}

/* 写回前自检 */
{
  let t;
  try { t = evalSeed(out); }
  catch (e) { console.error("自检失败：新文本无法求值 —— " + e.message + "，已放弃"); process.exit(1); }
  const n = t.filter((x) => x && x.id === ID).length;
  const en = t.find((x) => x && x.id === ID);
  const py = t.find((x) => x && x.id === "python");
  if (n !== 1 || !en || en.chapters.length !== 3) {
    console.error("自检失败：english " + n + " 条 / 章节 " + (en ? en.chapters.length : "-") + "，已放弃");
    process.exit(1);
  }
  if (!py || py.chapters.length !== pyChapters) {
    console.error("自检失败：python 章节数 " + (py ? py.chapters.length : "-") + " ≠ " + pyChapters + "，已放弃");
    process.exit(1);
  }
  /* 期望条目数：insert 模式比原来多一条（新增 english），refactor/noop 不变 */
  const expect = mode === "insert" ? tutorials.length + 1 : tutorials.length;
  if (t.length !== expect) {
    console.error("自检失败：tutorials 数量 " + t.length + " ≠ 期望 " + expect + "，已放弃");
    process.exit(1);
  }
}

fs.writeFileSync(SEED, out, "utf8");
const desc = mode === "insert" ? "已插入并引用化 english 教程"
  : mode === "refactor" ? "已引用化 english 教程（写死副本→引用）"
  : "english 已是引用，无需改动";
console.log(desc);
console.log("文件：" + SEED + "（" + fs.statSync(SEED).size + " B / " + out.split("\n").length + " 行）");
