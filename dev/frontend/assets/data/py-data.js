/* 喵站 · Python 教程数据装配层（第四轮改造后的「唯一来源」）
 *
 * 为什么不是一整个大文件：48 章正文要推翻重做（任务书 T-11），一次改完风险太大，
 * 所以正文拆成 data/py/p1…p7.js 七个分部，各导出 window.MIAO_PY_Pn = { chapters: [...] }，
 * 这里按章 id 用**新稿顶掉旧稿**；新稿还没写到的章，自动退回 data/py/legacy.js 里的旧章。
 * 好处是站点在任何一步都是完整的 48 章，不会出现「重做到一半、站内少一半课」。
 *
 * 分部覆盖范围（与任务书 §11.6.3 一致）：
 *   p1  s01–s03 + l01–l06      p4  l21–l27
 *   p2  l07–l13                p5  l28–l34
 *   p3  l14–l20                p6  l35–l41
 *   p7  l42–l45
 * 装配层是扫目录拿 p*.js 的（tools/load-data.cjs），加一个批次 = 加一个文件，不用改代码。
 *
 * 三条机器闸（node dev/tools/lesson-audit.cjs）由分部文件负责满足：
 *   A 梗清零  B 交叉引用只许往回指且课号必须真实存在  C 代码块里不许出现还没教的构造
 *
 * 加/删一章要同时动 ORDER —— 故意这么设计：分部里出现 ORDER 没有的 id 会当场报错，
 * 免得 id 打错导致那一章静默消失。
 */
(function (root) {
  "use strict";

  var ORDER = ["s01", "s02", "s03"];
  for (var i = 1; i <= 45; i++) ORDER.push("l" + (i < 10 ? "0" + i : i));

  /* 分部文件不写死名单：index.html 引了哪几份，就扫哪几份（加批次只改 index.html，不动这里）。
     上一版写死 P1…P7，结果 p8/p9 的 9 章静默退回旧稿，装配层还报「48 章就位」—— 这种
     「不报错的漏合」比报错危险得多，所以现在扫完顺手把名单打出来给人看。 */
  var PART_NAMES = Object.keys(root).filter(function (k) { return /^MIAO_PY_P\d+$/.test(k); })
    .sort(function (a, b) { return parseInt(a.slice(9), 10) - parseInt(b.slice(9), 10); });

  var LEGACY = (root.MIAO_PY_LEGACY && root.MIAO_PY_LEGACY.tutorial) || { chapters: [] };
  var legacyById = {};
  (LEGACY.chapters || []).forEach(function (c) { legacyById[c.id] = c; });

  /* 新稿按 id 收进表；同一个 id 出现在两个分部里算写坏了，直接报错而不是「后者覆盖前者」 */
  var fresh = {};
  PART_NAMES.forEach(function (name) {
    var pack = root[name];
    if (!pack || !pack.chapters) return;
    pack.chapters.forEach(function (c) {
      if (!c || !c.id) { console.error("[装配] " + name + " 里有一章没有 id"); return; }
      if (fresh[c.id]) console.error("[装配] 章 id 重复：" + c.id + "（" + name + "）—— 同一章只许出现在一个分部里");
      if (ORDER.indexOf(c.id) < 0) console.error("[装配] " + name + " 里的 " + c.id + " 不在 ORDER 里，这门教程没这个位置，章节不会显示");
      fresh[c.id] = c;
    });
  });

  var chapters = [];
  var fromNew = 0, fromLegacy = 0, missing = [];
  ORDER.forEach(function (id) {
    var c = fresh[id] || legacyById[id];
    if (!c) { missing.push(id); return; }
    if (fresh[id]) fromNew++; else fromLegacy++;
    chapters.push(c);
  });
  if (missing.length) console.error("[装配] 这些章新稿旧稿都没有：" + missing.join(", "));

  var meta = {
    id: "python",
    title: LEGACY.title || "Python 入门",
    intro: LEGACY.intro || "从零学完 Python 基础：每课讲原理、给能跑的演示、列常见坑、留课后任务。",
    cat: "python",
    diff: "入门",
    tags: ["python", "零基础", "入门"],
    author: "喵站官方",
    cover: "/assets/img/covers/python.svg"
  };
  /* 元信息以旧版为准（作者、封面那些单独改过），但 intro 一旦新稿提供了就用新的 */
  if (fresh.__meta__) { /* 分部若挂 __meta__ 也不认：元信息只在这一处维护 */ }

  root.MIAO_PY = { tutorial: {
    id: meta.id, title: meta.title, intro: meta.intro, cat: meta.cat, diff: meta.diff,
    tags: meta.tags, author: meta.author, cover: meta.cover, chapters: chapters
  } };

  /* 迁移进度：这条是给人看的，控制台里能一眼数出「48 章里重做了几章」 */
  root.MIAO_PY_MIGRATION = { total: ORDER.length, rewritten: fromNew, legacy: fromLegacy, missing: missing };
  if (typeof console !== "undefined" && root !== undefined && root.document === undefined) {
    console.log("[装配] Python " + chapters.length + "/" + ORDER.length + " 章就位 · 新稿 " + fromNew + " · 旧稿回退 " + fromLegacy + " · 分部 " + PART_NAMES.join(","));
  }
})(typeof window !== "undefined" ? window : globalThis);
