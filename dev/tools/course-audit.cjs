#!/usr/bin/env node
/* 喵站 · 单文件课程审计闸（补全分类教程 2026-10-27）
 *
 * 站内原有的 lesson-audit.cjs 只查 Python，且绑定 py 的构造表。新区补的 13 门课是
 * 「一门课一份单文件」，用这把尺统一查结构，避免每门课各写一套临时代码：
 *
 *   A 结构   —— 章数对得上、块类型合法、每章 ≥1 个 svg、任务 ≥3 条
 *   B 篇幅   —— 每章 ≤25 块、正文 ≤1800 字（只算 p/h2/tip/ul）
 *   C 禁词   —— 椰子蛋 / 管理 / 反引号 / ${ / 句尾喵
 *   D 引用   —— 「第 N 课」只能往回指，N 必须 ≤ 本课课号
 *   E 图形   —— svg 以 <svg 开头、viewBox 是 0 0 640 …、不含脚本/事件/href/src/animate
 *   F 高光   —— code 的 lang 必须命中 app.js 的分发表（与 hl-test.js 的 DISPATCH 同源）
 *
 * 跑法：node dev/tools/course-audit.cjs dev/frontend/assets/data/go-data.js […]
 *       node dev/tools/course-audit.cjs --all-new     # 本批 13 门，文件不在就跳过并报缺
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const DEV = path.resolve(__dirname, "..");
const DATA = path.join(DEV, "frontend", "assets", "data");
const NEW_IDS = ["java", "ts", "c", "csharp", "asm", "rust", "go", "github", "linux", "ide", "math", "embedded", "algorithms"];
const LANGS = new Set(["c++", "cpp", "c", "java", "csharp", "cs", "asm", "rust", "go", "shell", "sh", "bash",
  "powershell", "ps1", "python", "py", "javascript", "js", "typescript", "ts", "html", "xml", "vue",
  "css", "scss", "less", "json", "yaml", "yml", "ini", "toml", "cfg", "text", "txt", "console"]);
const BAN = ["椰子蛋", "管理"];
const BLOCK_TYPES = new Set(["p", "h2", "tip", "ul", "code", "svg", "img"]);

function lessonNo(id) {
  const m = String(id).match(/(\d+)$/);
  return m ? parseInt(m[1], 10) : NaN;
}

function load(file) {
  const src = fs.readFileSync(file, "utf8");
  const win = {};
  const c = { window: win, console: { log: () => {}, warn: () => {}, error: () => {} } };
  c.self = win; c.globalThis = win;
  vm.createContext(c);
  vm.runInContext(src, c, { timeout: 20000, filename: file });
  const keys = Object.keys(win).filter(k => win[k] && win[k].tutorial && Array.isArray(win[k].tutorial.chapters));
  if (!keys.length) throw new Error("没有找到 window.MIAO_*.tutorial.chapters");
  return { key: keys[0], tutorial: win[keys[0]].tutorial };
}

function stringsOf(o, out) {
  if (typeof o === "string") out.push(o);
  else if (Array.isArray(o)) o.forEach(x => stringsOf(x, out));
  else if (o && typeof o === "object") Object.keys(o).forEach(k => stringsOf(o[k], out));
  return out;
}

function audit(file) {
  const { tutorial } = load(file);
  const chaps = tutorial.chapters;
  const v = [];
  let totalProse = 0, totalBlocks = 0, totalSvg = 0;
  chaps.forEach(c => {
    const no = lessonNo(c.id);
    const prose = c.blocks.filter(b => b.t === "p" || b.t === "h2" || b.t === "tip" || b.t === "ul")
      .map(b => (b.text || "") + ((b.items || []).join(" "))).join(" ");
    const code = c.blocks.filter(b => b.t === "code");
    const svgs = c.blocks.filter(b => b.t === "svg");
    totalProse += prose.length; totalBlocks += c.blocks.length; totalSvg += svgs.length;
    if (c.blocks.length > 25) v.push(`${c.id} 块数 ${c.blocks.length} > 25`);
    if (prose.length > 1800) v.push(`${c.id} 正文 ${prose.length} 字 > 1800`);
    if (!svgs.length) v.push(`${c.id} 没有 svg`);
    if (!Number.isFinite(no) || no < 1 || no > chaps.length) v.push(`${c.id} 课号解析不出来`);

    const ti = c.blocks.findIndex(b => b.t === "h2" && String(b.text || "").trim() === "任务");
    const task = ti >= 0 ? c.blocks.slice(ti + 1).find(b => b.t === "ul") : null;
    if (!task || !task.items || task.items.length < 3) v.push(`${c.id} 任务少于 3 条`);

    c.blocks.forEach((b, i) => {
      if (!BLOCK_TYPES.has(b.t)) v.push(`${c.id}#${i} 非法块类型 ${b.t}`);
      if (b.t === "code") {
        const lang = String(b.lang || "").toLowerCase();
        if (!LANGS.has(lang)) v.push(`${c.id}#${i} 代码 lang=${JSON.stringify(b.lang)} 不在分发表`);
        if (!b.code) v.push(`${c.id}#${i} code 为空`);
        const lines = String(b.code || "").split("\n");
        const maxLines = lang === "asm" ? 20 : 14;
        if (lines.length > maxLines) v.push(`${c.id}#${i} 代码 ${lines.length} 行 > ${maxLines}`);
      }
      if (b.t === "svg") {
        const s = String(b.code || "").trim();
        if (!s.startsWith("<svg")) v.push(`${c.id}#${i} svg 不以 <svg 开头`);
        if (!/viewBox="0 0 640 (\d+)"/.test(s)) v.push(`${c.id}#${i} svg viewBox 不是 0 0 640`);
        if (/<script|<animate|\son\w+\s*=|href\s*=|src\s*=/i.test(s)) v.push(`${c.id}#${i} svg 含脚本/事件/外链`);
      }
    });

    const all = stringsOf(c.blocks, []).join("\n");
    for (const w of BAN) {
      const n = all.split(w).length - 1;
      if (n) v.push(`${c.id} 禁词「${w}」×${n}`);
    }
    if (all.includes("`")) v.push(`${c.id} 内容含反引号`);
    if (all.includes("${")) v.push(`${c.id} 内容含 \${`);
    if (/喵\s*[。！？!?]?\s*$/m.test(prose)) v.push(`${c.id} 正文出现句尾「喵」`);
    for (const m of all.matchAll(/第\s*(\d+)\s*课/g)) {
      const ref = +m[1];
      if (ref > no) v.push(`${c.id} 往后指第 ${ref} 课`);
    }
  });
  return { file, id: tutorial.id, title: tutorial.title, cat: tutorial.cat, chaps: chaps.length,
    prose: totalProse, blocks: totalBlocks, svg: totalSvg, violations: v };
}

const argv = process.argv.slice(2);
const allNew = argv.includes("--all-new");
let files;
if (allNew) {
  files = NEW_IDS.map(id => path.join(DATA, id + "-data.js"));
} else {
  files = argv.filter(a => !a.startsWith("--")).map(a => path.resolve(a));
}
if (!files.length) { console.log("用法：node dev/tools/course-audit.cjs <课程数据文件…> | --all-new"); process.exit(2); }

let bad = 0, checked = 0, missing = 0;
for (const f of files) {
  if (!fs.existsSync(f)) { missing++; if (allNew) bad++; console.log("· 缺文件（还没落盘）：" + path.relative(DEV, f)); continue; }
  checked++;
  let r;
  try { r = audit(f); } catch (e) {
    bad++; console.log(`✘ ${path.relative(DEV, f)} 跑不起来：${e.message}`); continue;
  }
  if (allNew && r.chaps !== 12) r.violations.push(`章数 ${r.chaps} != 12`);
  const ok = r.violations.length === 0;
  if (!ok) bad++;
  console.log(`${ok ? "✔" : "✘"} ${String(r.id).padEnd(11)} ${String(r.title).padEnd(16)} ${r.chaps} 章 · 正文 ${r.prose} 字 · 块 ${r.blocks} · 图 ${r.svg}${ok ? "" : " · 违规 " + r.violations.length}`);
  r.violations.slice(0, 12).forEach(x => console.log("    - " + x));
}
console.log(`\n检查 ${checked} 门 · 红灯 ${bad} 门 · 缺文件 ${missing} 门`);
process.exit(bad ? 1 : 0);
