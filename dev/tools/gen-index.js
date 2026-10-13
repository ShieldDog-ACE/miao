/* 喵站 · 目录生成器：site.js + 各门课的数据文件 → assets/data/index.js
 *
 * 站点是按需加载的，首屏只吃两份小文件：site.js（登记清单）与 index.js（目录）。
 * 目录里放的是「够摆首页和章节目录、并且知道每一章的正文在哪个文件里」的那点信息 ——
 * 每门课的元信息、每章的 id 与标题、哪些章排了考、点开这一章要注入哪一份脚本。
 * 正文一块都不在里面。
 *
 * glob 在这里展开成具体文件名（浏览器不会 glob），所以：
 *   加了正文分片 / 加了新一课 → 重跑这一条就行：node dev/tools/gen-index.js
 *
 * 分层加载（第十轮）新增的那一格里，「这一章的正文在哪个文件」不是猜的，是**单独把每份
 * 文件跑进干净 vm、看它自己登记了哪些章 id**，再按 site.js 的加载顺序「后写的顶掉先写的」
 * 算出来的赢家 —— 和装配层的语义一模一样，所以占位稿会自动退成「只在那几章还没写完时才拉」。
 *
 * 它会当场验这些事，任何一件不过就不写文件：
 *   1. 每个 glob 至少命中一个文件，每个点名的文件真的在磁盘上；
 *   2. 每门课登记的包名，把它的文件跑完之后真的在 window 上，且 tutorial.id 对得上；
 *   3. 装配层（*-data.js / ms-bodies.js）打的每一条 console.error 都算构建失败 —— 以前是吞掉的；
 *   4. 只拉 boot 也能拿到包，且 boot 之后装配函数真的可反复调用（分层加载的前提）；
 *   5. 每一章都有出处文件；每一份正文分片都至少顶着一章（没人顶的分片永远拉不到，是死稿）；
 *   6. examIds 里的章必须真是这门课的章；
 *   7. 磁盘上有没有「没被任何一门课登记」的正文文件（上一轮就是这么漏掉 76 份正文的）。
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

/** 造一个干净的 vm：数据文件里的 console.error 一律收集起来，不再吞掉 */
function freshVm(bucket) {
  const c = { window: {}, console: { log: () => {}, warn: () => {}, error: (...a) => bucket.push(a.join(" ")) } };
  c.self = c.window; c.globalThis = c.window;
  c.document = { createElement: () => ({}) };
  vm.createContext(c);
  return c;
}

/** 把一门课的文件跑进一个干净的 vm，拿到它的包与章节 */
function readPack(reg, files, bucket) {
  const c = freshVm(bucket);
  for (const f of files) {
    vm.runInContext(fs.readFileSync(path.join(FRONT, f), "utf8"), c, { timeout: 30000, filename: f });
  }
  const pack = c.window[reg.source];
  return { pack, win: c.window };
}

/** 单独跑一份文件，问它「你自己登记了哪几章」 —— 章 id 的出处只认这个，不猜文件名也不猜全局名。
 *  三种写法都认：{chapters:[...]}（py/cpp/cppm 的分部与占位稿）、{tutorial:{chapters:[...]}}（整包）、
 *  MIAO_MS_BODY[章 id]（微软那几门的逐课正文）。 */
function definedIds(file, bucket) {
  const c = freshVm(bucket);
  c.window.MIAO_PARTIAL = true;      // 装配层在「只跑这一份」的场合不该为缺章刷红，这里只要它登记的 id
  try {
    vm.runInContext(fs.readFileSync(path.join(FRONT, file), "utf8"), c, { timeout: 30000, filename: file });
  } catch (e) {
    bucket.push("这份正文跑不起来：" + file + " —— " + e.message);
    return [];
  }
  const ids = new Set();
  Object.keys(c.window).forEach(k => {
    if (k === "MIAO_PARTIAL") return;
    const v = c.window[k];
    if (!v || typeof v !== "object") return;
    if (Array.isArray(v.chapters)) v.chapters.forEach(ch => ch && ch.id && ids.add(ch.id));
    if (v.tutorial && Array.isArray(v.tutorial.chapters)) v.tutorial.chapters.forEach(ch => ch && ch.id && ids.add(ch.id));
  });
  const body = c.window.MIAO_MS_BODY;
  if (body && typeof body === "object") Object.keys(body).forEach(id => ids.add(id));
  return Array.from(ids);
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
  if (id === "cpp" || id === "cppm") {
    const ce = win[id === "cpp" ? "MIAO_CPP_EXAM" : "MIAO_CPPM_EXAM"] || {};
    return (ce.papers || []).map(e => e.cid);
  }
  return [];
}

const seenFiles = new Set(["site.js", "index.js"]);
const GLOB_DIRS = new Set();
const tutorials = SITE.tutorials.map(reg => {
  const where = "教程 " + reg.id + " 的 files";
  const files = expand(reg.files, where);
  const examFiles = expand(reg.examFiles, "教程 " + reg.id + " 的 examFiles");
  files.concat(examFiles).forEach(f => seenFiles.add(f));
  const boot = reg.boot && reg.boot.length ? expand(reg.boot, "教程 " + reg.id + " 的 boot") : files.slice();
  boot.forEach(f => { if (files.indexOf(f) < 0) errors.push("教程 " + reg.id + " 的 boot 里这份不在 files 里：" + f); });
  const asmName = reg.assemble || reg.mount || "";
  const noisy = [];                 // 装配层自己喊的每一句 console.error
  let pack = null, win = {};
  try {
    const r = readPack(reg, files.concat(examFiles), noisy);
    pack = r.pack; win = r.win;
  } catch (e) {
    errors.push("教程 " + reg.id + " 的正文文件跑不起来：" + e.message);
    return null;
  }
  if (noisy.length) errors.push("教程 " + reg.id + " 的装配层报错：" + noisy.join(" ｜ "));
  if (!pack || !pack.tutorial) {
    errors.push("教程 " + reg.id + " 登记了包名 " + reg.source + "，跑完它的文件后 window 上没有这个包");
    return null;
  }
  const t = pack.tutorial;
  /* 包内自报 id 只对「多门课共用一份装配器」的课（微软那四门走 MIAO_MS_MOUNT）对账。
     一课一包的课，包名 source 就是唯一身份：串包会先在上一条「window 上没有这个包」红掉，
     而包里的 id 写的是给人看的分类口径（C++ 两门都写 "C++"），不该拿它 veto 整门课。
     别指望拿章号唯一性兜串包 —— python 与 cpp 的 s01~s03 本来就重号。 */
  if (reg.mount && t.id !== reg.id) {
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

  /* ---------- 分层加载那张「章 → 分片」的表 ---------- */
  const bodyOnly = files.filter(f => boot.indexOf(f) < 0);
  const owner = {};                     // 章 id → 顶它的那一份（后写的赢，与装配层同语义）
  const ownedBy = {};                   // 文件 → 它顶着的章 id（按章序排）
  const idsFor = {};
  bodyOnly.forEach(f => { idsFor[f] = definedIds(f, noisy); });
  const bootIds = new Set();
  boot.forEach(f => definedIds(f, noisy).forEach(x => bootIds.add(x)));
  if (noisy.length) { errors.push("教程 " + reg.id + " 的分片跑出不通：" + noisy.join(" ｜ ")); noisy.length = 0; }
  bodyOnly.forEach(f => (idsFor[f] || []).forEach(cid => {
    if (ids.indexOf(cid) < 0) { errors.push("教程 " + reg.id + " 的分片 " + f + " 顶了一章不在目录里的 " + cid); return; }
    owner[cid] = f;
  }));
  ids.forEach(cid => {
    const f = owner[cid];
    if (!f) return;                       // 这一章由 boot 里的骨架/占位供着，不用额外拉
    (ownedBy[f] = ownedBy[f] || []).push(cid);
  });
  chaps.forEach(c => {
    if (!owner[c.id] && !bootIds.has(c.id)) errors.push("教程 " + reg.id + " 的这一章没有出处文件，点开它拉不到正文：" + c.id);
  });
  bodyOnly.forEach(f => {
    if (!ownedBy[f]) errors.push("教程 " + reg.id + " 的这份正文没有主人（它的章全被顶掉或 id 对不上，分层加载永远拉不到它）：" + f);
  });
  /* 拆了片的课必须有可反复调用的装配函数，否则拉进一片之后整门课拼不回来 */
  if (bodyOnly.length) {
    const c = freshVm(noisy);
    c.window.MIAO_PARTIAL = true;
    try {
      boot.forEach(f => vm.runInContext(fs.readFileSync(path.join(FRONT, f), "utf8"), c, { timeout: 30000, filename: f }));
    } catch (e) { errors.push("教程 " + reg.id + " 只拉 boot 跑不起来：" + e.message); }
    if (!c.window[reg.source] || !c.window[reg.source].tutorial) {
      errors.push("教程 " + reg.id + " 只拉 boot（" + boot.join(", ") + "）拿不到包 " + reg.source);
    } else if (typeof c.window[asmName] !== "function") {
      errors.push("教程 " + reg.id + " 拆了片但装配函数 " + (asmName || "(没登记)") + " 在 boot 之后不可调用");
    }
    if (noisy.length) { errors.push("教程 " + reg.id + " 的 boot 阶段报错：" + noisy.join(" ｜ ")); noisy.length = 0; }
  }
  const chunks = Object.keys(ownedBy).sort().reduce((o, f) => (o[f] = ownedBy[f], o), {});

  const bytes = files.reduce((n, f) => n + fs.statSync(path.join(FRONT, f)).size, 0);
  const examBytes = examFiles.reduce((n, f) => n + fs.statSync(path.join(FRONT, f)).size, 0);
  const bootBytes = boot.reduce((n, f) => n + fs.statSync(path.join(FRONT, f)).size, 0);
  const chunkBytes = Object.keys(chunks).reduce((m, f) => Math.max(m, fs.statSync(path.join(FRONT, f)).size), 0);
  return {
    id: reg.id, source: reg.source, engine: reg.engine || "", mount: reg.mount || "",
    assemble: reg.assemble || "",
    title: t.title, intro: t.intro, cat: t.cat, diff: t.diff, tags: t.tags || [],
    author: t.author, cover: t.cover || "", thumb: t.thumb || "", hero: t.hero || "",
    updated: reg.updated || t.updated || "",
    chaps: chaps.length, chapters: chaps, examIds: eids, keywords,
    boot, chunks,
    examFiles,
    bytes, examBytes, bootBytes, chunkBytes
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
 * 这里只有：每门课的元信息、每章的 id 与标题、哪些章排了考、
 * 以及分层加载要的两张表 —— boot（点开这门课任何一章都必拉的骨架）与
 * chunks（每一章的正文落在哪个文件，由「后写的顶掉先写的」算出来的赢家）。
 * 正文一块都不在 —— 所以改任何一课的正文，都要重跑生成器，标题、章数与这张映射才会同步。
 * 生成时间：${new Date().toISOString().slice(0, 16).replace("T", " ")}
 */\n`;
const payload = tutorials.map(t => {
  const o = Object.assign({}, t);
  delete o.bytes; delete o.examBytes; delete o.bootBytes; delete o.chunkBytes;   // 这四个只给下面的报表用，不进产物
  return o;
});
fs.writeFileSync(OUT, head + "window.MIAO_INDEX = " + JSON.stringify({ tutorials: payload }, null, 1) + ";\n");

const kb = n => (n / 1024).toFixed(0) + " KB";
say("[目录] 已写出 " + path.relative(DEV, OUT) + "（" + kb(fs.statSync(OUT).size) + "）");
say("  首屏要拉的：index.html + style.css + site.js + index.js + data.js + app.js + theme-boot.js");
say("  分层加载：点开一章只拉 boot + 那一章的分片，其余分片空了才预取");
tutorials.forEach(t => {
  const n = Object.keys(t.chunks || {}).length;
  say(`    ${t.id.padEnd(9)} ${String(t.chaps).padStart(3)} 章 · 骨架 ${kb(t.bootBytes).padStart(7)}` +
    (n ? ` + 单章分片 ≤ ${kb(t.chunkBytes).padStart(6)}（共 ${n} 片）` : ` （未拆片，整份就是骨架）`) +
    ` · 整门课 ${kb(t.bytes).padStart(8)} · 考卷 ${String(t.examIds.length).padStart(3)} 场 ${kb(t.examBytes)}`);
});
if (parked.length) say("  暂时无人在目录里的正文（不参与加载，等填好正文再在 site.js 登记）：" + parked.join("、"));
