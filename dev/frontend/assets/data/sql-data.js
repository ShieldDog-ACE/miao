/* 喵站 · 数据库与 SQL 入门（sql）数据装配层
 *
 * 正文拆在 data/sql/d1.js、d2.js 里，各导出 window.MIAO_SQL_Dn = { chapters: [...] }。
 * 这一份按章 id 拼成整门课；章 id 不在 ORDER（d01–d24）里当场报错。
 *
 * 分层加载：数据层每拉进一份分部就再拼一次，所以装配收进 assemble()，
 * 并挂成 window.MIAO_SQL_ASSEMBLE（site.js 的 assemble 字段指它）。
 */
(function (root) {
  "use strict";

  var ORDER = [];
  for (var i = 1; i <= 24; i++) ORDER.push("d" + (i < 10 ? "0" + i : String(i)));

  var META = {
    id: "sql",
    title: "数据库与 SQL 入门",
    intro: "从一条 SELECT 走到一个能用的博客库：表、查询、连接、聚合、索引、事务都在 SQLite 上真跑，最后用 Python 读写它。",
    cat: "计算机基础",
    diff: "入门",
    tags: ["数据库", "SQL", "SQLite", "后端"],
    author: "喵站官方",
    cover: "/assets/img/covers/sql.svg",
    updated: "2026-11-11"
  };

  function assemble() {
    var PART_NAMES = Object.keys(root).filter(function (k) { return /^MIAO_SQL_D\d+$/.test(k); })
      .sort(function (a, b) { return parseInt(a.match(/(\d+)$/)[1], 10) - parseInt(b.match(/(\d+)$/)[1], 10); });

    var fresh = {};
    PART_NAMES.forEach(function (name) {
      var pack = root[name];
      if (!pack || !pack.chapters) return;
      pack.chapters.forEach(function (c) {
        if (!c || !c.id) { console.error("[装配 sql] " + name + " 里有一章没有 id"); return; }
        if (fresh[c.id]) console.error("[装配 sql] 章 id 重复：" + c.id + "（" + name + "）");
        if (ORDER.indexOf(c.id) < 0) console.error("[装配 sql] " + name + " 里的 " + c.id + " 不在 ORDER（d01–d24）里");
        fresh[c.id] = c;
      });
    });

    var chapters = [], missing = [];
    ORDER.forEach(function (id) {
      if (fresh[id]) chapters.push(fresh[id]);
      else missing.push(id);
    });
    if (missing.length && !root.MIAO_PARTIAL) console.error("[装配 sql] 缺章：" + missing.join(", "));
    if (typeof console !== "undefined" && root.document === undefined) {
      console.log("[装配] 数据库与 SQL " + chapters.length + "/" + ORDER.length + " 章就位");
    }

    root.MIAO_SQL = { tutorial: {
      id: META.id, title: META.title, intro: META.intro, cat: META.cat, diff: META.diff,
      tags: META.tags, author: META.author, cover: META.cover, updated: META.updated,
      chapters: chapters
    } };
    return chapters;
  }

  root.MIAO_SQL_ASSEMBLE = assemble;
  assemble();
})(typeof window !== "undefined" ? window : globalThis);
