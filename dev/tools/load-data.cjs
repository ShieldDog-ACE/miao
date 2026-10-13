/* 喵站 · 数据加载器（测试与工具专用，和 index.html 的引入顺序完全一致）
 *
 * 为什么要有这一份：py-data.js 从第四轮起是「装配层」，它本身不含正文，
 * 正文在 data/py/p1…p9.js 里（旧稿兜底那份 py/legacy.js 第十轮删了：48 章已全部由分部覆盖）。
 * 谁想拿到 window.MIAO_PY，就必须按浏览器一样的顺序把这些份都跑一遍。
 * py-oracle.js / engine-test.js / lesson-audit.cjs 三处共用这一份，避免三个加载器各跑各的。
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const DEV = path.resolve(__dirname, "..");
const DATA = path.join(DEV, "frontend", "assets", "data");

function pyFiles() {
  const files = [path.join(DATA, "site.js")];
  /* 分部文件按名字排序扫进来（p1、p10、p2… 字典序不影响正确性：每份只管自己的章 id） */
  fs.readdirSync(path.join(DATA, "py")).filter(function (f) { return /^p\d+\.js$/.test(f); }).sort(function (a, b) {
    return parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10);
  }).forEach(function (f) { files.push(path.join(DATA, "py", f)); });
  files.push(path.join(DATA, "py-data.js"));
  return files;
}

/** 跑完 Python 那几份文件，返回 { chapters, migration, ctx } */
function loadPy(extra) {
  /* 数据文件里的 console.log 一律改道 stderr：不然 --json 的输出会被「[装配] …」那行污染，
     管道下游 JSON.parse 直接炸（踩过一次） */
  const ctx = { window: {}, require: require, setTimeout: setTimeout,
    console: { log: function () { console.error.apply(console, arguments); },
               error: function () { console.error.apply(console, arguments); },
               warn: function () { console.error.apply(console, arguments); } } };
  ctx.self = ctx.window;
  ctx.globalThis = ctx.window;
  vm.createContext(ctx);
  pyFiles().concat(extra || []).forEach(function (f) {
    vm.runInContext(fs.readFileSync(f, "utf8"), ctx, { timeout: 20000, filename: f });
  });
  const tut = ctx.window.MIAO_PY && ctx.window.MIAO_PY.tutorial;
  if (!tut) throw new Error("装配后没有 window.MIAO_PY.tutorial");
  return {
    chapters: tut.chapters,
    tutorial: tut,
    migration: ctx.window.MIAO_PY_MIGRATION,
    newIds: pyNewIds(ctx),
    ctx: ctx
  };
}

/** 新稿（分部文件）覆盖了哪几章 —— 审计只该拿这些章说事，旧稿兜底的章不算 */
function pyNewIds(ctx) {
  const ids = [];
  const parts = fs.readdirSync(path.join(DATA, "py")).filter(function (f) { return /^p\d+\.js$/.test(f); });
  for (const name of parts) {
    const p = path.join(DATA, "py", name);
    const one = { window: {}, console: { error() {} } };
    one.self = one.window;
    vm.createContext(one);
    vm.runInContext(fs.readFileSync(p, "utf8"), one, { timeout: 20000, filename: p });
    /* 不猜全局名：把这份文件跑完后，扫它自己 window 上的 MIAO_PY_Pn */
    Object.keys(one.window).forEach(function (k) {
      if (!/^MIAO_PY_P\d+$/.test(k)) return;
      const pack = one.window[k];
      if (pack && pack.chapters) pack.chapters.forEach(function (c) { ids.push(c.id); });
    });
  }
  return ids;
}

module.exports = { loadPy: loadPy, pyFiles: pyFiles, DATA: DATA, DEV: DEV };
