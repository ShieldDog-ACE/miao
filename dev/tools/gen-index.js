/* 喵站 · 目录生成器：site.js + 各门课的数据文件 → assets/data/index.js
 *
 * 站点改成按需加载之后，首屏只吃两份小文件：site.js（登记清单）与 index.js（目录）。
 * 目录里放的是「够摆首页和章节目录」的那点信息 —— 每门课的元信息、每章的 id 与标题、
 * 哪些章排了考、以及点开这门课要按什么顺序注入哪些脚本。正文一块都不在里面。
 *
 * glob 在这里展开成具体文件名（浏览器不会 glob），所以：
 *   加了正文分片 / 加了新一课 → 重跑这一条就行：node dev/tools/gen-index.js
 *
 * 它会当场验四件事，任何一件不过就不写文件：
 *   1. 每个 glob 至少命中一个文件，每个点名的文件真的在磁盘上；
 *   2. 每门课登记的包名，把它的文件跑完之后真的在 window 上，且 tutorial.id 对得上；
 *   3. examIds 里的章必须真是这门课的章；
 *   4. 磁盘上有没有「没被任何一门课登记」的正文文件（上一轮就是这么漏掉 76 份正文的）。
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const DEV = path.resolve(__dirname, "..");
const FRONT = path.join(DEV, "frontend");
const DATA = path.join(FRONT, "assets", "data");
const OUT = path.join(DATA, "index.js");
const errors = [];
const say = m => console.log(m);

const siteCtx = { window: {}, console: { log: () => {}, error: console.error, warn: console.warn } };
siteCtx.self = siteCtx.window; siteCtx.globalThis = siteCtx.window;
vm.createContext(siteCtx);
vm.runInContext(fs.readFileSync(path.join(DATA, "site.js"), "utf8"), siteCtx, { filename: "site.js" });
const SITE = siteCtx.window.MIAO_SITE;
if (!SITE || !Array.isArray(SITE.tutorials)) { console.error("[目录] site.js 里没有 MIAO_SITE.tutorials"); process.exit(1); }

/** site.js 里的 files 清单 → 展开 glob → 校验每个文件在磁盘上 */
function expand(list, where) {
  const out = [];
  (list || []).forEach(item => {
    if (typeof item === "string") {
      const p = path.join(FRONT, item);
      if (!fs.existsSync(p)) { errors.push(where + " 点名的文件不在磁盘上：" + item); return; }
      out.push(item);
      return;
    }
    const dir = path.join(FRONT, path.dirname(item.glob));
    GLOB_DIRS.add(path.dirname(item.glob).replace(/\\/g, "/"));
    const base = path.basename(item.glob).replace(/\*/g, ".*");
    if (!fs.existsSync(dir)) { errors.push(where + " 的 glob 目录不存在：" + path.dirname(item.glob)); return; }
    const hit = fs.readdirSync(dir).filter(f => new RegExp("^" + base + "$").test(f))
      .sort((a, b) => (parseInt(a.replace(/\D/g, ""), 10) || 0) - (parseInt(b.replace(/\D/g, ""), 10) || 0) || a.localeCompare(b))
      .map(f => path.join(path.dirname(item.glob), f).replace(/\\/g, "/"));
    if (!hit.length) { errors.push(where + " 的 glob 一个文件都没命中：" + item.glob); return; }
    out.push(...hit);
  });
  return out;
}

/** 把一门课的文件跑进一个干净的 vm，拿到它的包与章节 */
function readPack(reg, files) {
  const c = { window: {}, console: { log: () => {}, error: () => {}, warn: () => {} } };
  c.self = c.window; c.globalThis = c.window;
  c.document = { createElement: () => ({}) };
  vm.createContext(c);
  for (const f of files) {
    vm.runInContext(fs.readFileSync(path.join(FRONT, f), "utf8"), c, { timeout: 30000, filename: f });
  }
  const pack = c.window[reg.source];
  return { pack, win: c.window };
}

/** 各门课的考卷 cid 都从这个形状里取（和 data.js 的 collectPapers 同一套读法） */
function examIds(id, win) {
  if (id === "python") {
    const out = Object.keys((win.MIAO_PY_EXAM || { exams: {} }).exams || {});
    (win.MIAO_PY_EXAM_PARTS || []).forEach(e => { if (e && e.cid) out.push(e.cid); });
    return Array.from(new Set(out)).sort();
  }
  if (id === "english") return ((win.MIAO_EN_EXAM || {}).exams || []).map(e => e.cid);
  if (id === "enwords") return ((win.MIAO_ENW_EXAM || {}).papers || []).map(e => e.cid);
  return [];
}

const seenFiles = new Set(["site.js", "index.js"]);
const GLOB_DIRS = new Set();
const tutorials = SITE.tutorials.map(reg => {
  const where = "教程 " + reg.id + " 的 files";
  const files = expand(reg.files, where);
  const examFiles = expand(reg.examFiles, "教程 " + reg.id + " 的 examFiles");
  files.concat(examFiles).forEach(f => seenFiles.add(f));
  let pack = null, win = {};
  try {
    const r = readPack(reg, files.concat(examFiles));
    pack = r.pack; win = r.win;
  } catch (e) {
    errors.push("教程 " + reg.id + " 的正文文件跑不起来：" + e.message);
    return null;
  }
  if (!pack || !pack.tutorial) {
    errors.push("教程 " + reg.id + " 登记了包名 " + reg.source + "，跑完它的文件后 window 上没有这个包");
    return null;
  }
  const t = pack.tutorial;
  if (t.id !== reg.id) {
    errors.push("教程 " + reg.id + " 的包里 tutorial.id 是 " + t.id + "，对不上");
    return null;
  }
  if (!t.chapters || !t.chapters.length) { errors.push("教程 " + reg.id + " 一章都没有"); return null; }
  const chaps = t.chapters.map(c => ({ id: c.id, title: c.title }));
  const ids = chaps.map(c => c.id);
  const eids = examIds(reg.id, win).filter(cid => ids.indexOf(cid) >= 0);
  /* 单词类课程把「教了哪些词」带进目录：正文不加载也能搜到 apple、tomato 这种词 */
  const keywords = (t.keywords && t.keywords.length ? t.keywords
    : (pack.words || []).map(w => w.w)).slice(0, 400);
  const bytes = files.reduce((n, f) => n + fs.statSync(path.join(FRONT, f)).size, 0);
  const examBytes = examFiles.reduce((n, f) => n + fs.statSync(path.join(FRONT, f)).size, 0);
  return {
    id: reg.id, source: reg.source, engine: reg.engine || "", mount: reg.mount || "",
    title: t.title, intro: t.intro, cat: t.cat, diff: t.diff, tags: t.tags || [],
    author: t.author, cover: t.cover || "", thumb: t.thumb || "", hero: t.hero || "",
    updated: reg.updated || t.updated || "",
    chaps: chaps.length, chapters: chaps, examIds: eids, keywords,
    files, examFiles,
    bytes, examBytes
  };
}).filter(Boolean);

/* 磁盘上有没有没被登记的正文文件 —— 只查「有课程用 glob 指过去的那个目录」。
   上一轮 76 份微软正文写好了却没进加载清单，就是这么漏的。
   完全没人指的目录（比如暂时摘下的 BYOX）只报数量，不当错误：那是有意停用的车位。 */
const globDirs = new Set(GLOB_DIRS);
const parked = [];
fs.readdirSync(DATA).filter(f => fs.statSync(path.join(DATA, f)).isDirectory()).forEach(d => {
  const dir = path.join(DATA, d);
  const rel = "assets/data/" + d;
  const js = fs.readdirSync(dir).filter(f => f.endsWith(".js"));
  if (!js.length) return;
  if (!globDirs.has(rel)) { parked.push(rel + "/（" + js.length + " 份，无人登记）"); return; }
  js.forEach(f => {
    const file = rel + "/" + f;
    if (!seenFiles.has(file)) errors.push("正文文件没被任何一门课登记（点开这门课也拉不到它）：" + file);
  });
});

if (errors.length) {
  console.error("!! 目录生成失败，index.js 没动：\n  - " + errors.join("\n  - "));
  process.exit(1);
}

const head = `/* 喵站 · 站点目录（首屏唯一要读的教程数据）· 由 dev/tools/gen-index.js 生成，别手改
 *
 * 这里只有：每门课的元信息、每章的 id 与标题、哪些章排了考、点开这门课要注入哪些脚本。
 * 正文一块都不在 —— 所以改任何一课的正文，都要重跑生成器，标题与章数才会同步到这里。
 * 生成时间：${new Date().toISOString().slice(0, 16).replace("T", " ")}
 */\n`;
const payload = tutorials.map(t => Object.assign({}, t, { files: t.files, examFiles: t.examFiles }));
fs.writeFileSync(OUT, head + "window.MIAO_INDEX = " + JSON.stringify({ tutorials: payload }, null, 1) + ";\n");

const kb = n => (n / 1024).toFixed(0) + " KB";
say("[目录] 已写出 " + path.relative(DEV, OUT) + "（" + kb(fs.statSync(OUT).size) + "）");
say("  首屏要拉的：index.html + style.css + site.js + index.js + data.js + app.js + theme-boot.js");
say("  点开门课才拉的正文 / 进考场才拉的题包：");
tutorials.forEach(t => say(`    ${t.id.padEnd(9)} ${String(t.chaps).padStart(3)} 章 · 考卷 ${String(t.examIds.length).padStart(3)} 场 · 正文 ${kb(t.bytes).padStart(8)} · 题库 ${kb(t.examBytes)}`));
if (parked.length) say("  暂时无人在目录里的正文（不参与加载，等填好正文再在 site.js 登记）：" + parked.join("、"));
