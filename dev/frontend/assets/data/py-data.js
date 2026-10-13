/* 喵站 · Python 教程数据装配层（第四轮改造后的「唯一来源」）
 *
 * 为什么不是一整个大文件：48 章正文拆在 data/py/p1…p9.js 里，各导出
 * window.MIAO_PY_Pn = { chapters: [...] }，这一份按章 id 把它们拼成一门完整的课。
 * 旧稿 data/py/legacy.js 本是「新稿没写到就退回旧章」的兜底，本轮实测 48 章已全部
 * 由分部覆盖（仍靠它的 0 章），540 KB 死稿于是删掉；这里照旧认 window.MIAO_PY_LEGACY，
 * 以后要临时挂回旧稿兜底不用改这份文件。
 *
 * 分部覆盖范围（与任务书 §11.6.3 一致）：
 *   p1  s01–s03 + l01–l06      p6  l35–l41
 *   p2  l07–l13                p7  l42–l45
 *   p3  l14–l20                p8  l?? 补写批次
 *   p4  l21–l27                p9  l?? 补写批次
 *   p5  l28–l34
 * 装配层不写死名单：扫 window 上现有的 MIAO_PY_P* —— 加一个批次 = 加一个文件。
 *
 * 分层加载这一轮改成「可反复调用」：数据层每拉进一份分部都要再拼一次，所以装配收进
 * assemble()，并挂成 window.MIAO_PY_ASSEMBLE（site.js 的 assemble 字段指它）。
 * 章没拉齐时浏览器不该为「这一章还没拉」刷控制台 —— 数据层拉一半时置 window.MIAO_PARTIAL，
 * 这一格改由数据层拉齐之后再喊；工具与测试不设这个标志，照旧当场红（它们读的就是全量）。
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

  /* 元信息只在这一处维护（title/intro 原先借旧稿，随 legacy 一起搬进来了） */
  var META = {
    id: "python",
    title: "Python 入门",
    intro: "45 课从零学完 Python 基础：每课都讲原理、给能跑的演示、列常见坑、留课后任务。附三节准备课讲清解释器与装环境，正文全部可直接运行验证。",
    cat: "python",
    diff: "入门",
    tags: ["python", "零基础", "入门"],
    author: "喵站官方",
    cover: "/assets/img/covers/python.svg"
  };

  function assemble() {
    /* 分部名单现扫：页面上引了哪几份就拼哪几份（加批次只改 site.js，不动这里）。
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
    if (missing.length && !root.MIAO_PARTIAL) console.error("[装配] 这些章新稿旧稿都没有：" + missing.join(", "));

    root.MIAO_PY = { tutorial: {
      id: META.id, title: META.title, intro: META.intro, cat: META.cat, diff: META.diff,
      tags: META.tags, author: META.author, cover: META.cover, chapters: chapters
    } };

    /* 迁移进度：这条是给人看的，控制台里能一眼数出「48 章里重做了几章」 */
    root.MIAO_PY_MIGRATION = { total: ORDER.length, rewritten: fromNew, legacy: fromLegacy, missing: missing };
    if (typeof console !== "undefined" && root.document === undefined) {
      console.log("[装配] Python " + chapters.length + "/" + ORDER.length + " 章就位 · 新稿 " + fromNew +
        " · 旧稿回退 " + fromLegacy + " · 分部 " + PART_NAMES.join(","));
    }
    return chapters;
  }

  root.MIAO_PY_ASSEMBLE = assemble;
  assemble();
})(typeof window !== "undefined" ? window : globalThis);
