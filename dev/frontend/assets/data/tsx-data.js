/* 喵站 · TypeScript 精通（tsx）数据装配层
 *
 * 正文拆在 data/tsx/p1.js、p2.js 里，各导出 window.MIAO_TSX_Pn = { chapters: [...] }。
 * 这一份按章 id 拼成整门课；章 id 不在 ORDER（tsx01–tsx12）里当场报错。
 *
 * 分层加载：数据层每拉进一份分部就再拼一次，所以装配收进 assemble()，
 * 并挂成 window.MIAO_TSX_ASSEMBLE（site.js 的 assemble 字段指它）。
 */
(function (root) {
  "use strict";

  var ORDER = ["tsx01","tsx02","tsx03","tsx04","tsx05","tsx06","tsx07","tsx08","tsx09","tsx10","tsx11","tsx12"];

  var META = {
    id: "tsx",
    title: "TypeScript 精通",
    intro: "接 TypeScript 掌握，深入类型工程、框架类型、Node 全栈与 Agent 工具调用；最后一课讲 AI Agent、前端架构、全栈几条就业路线。",
    cat: "ts",
    diff: "精通",
    tags: ["TypeScript","精通","Agent","类型工程"],
    author: "喵站官方",
    cover: "/assets/img/covers/tsx.svg",
    updated: "2026-11-11"
  };

  function assemble() {
    var PART_NAMES = Object.keys(root).filter(function (k) { return /^MIAO_TSX_P\d+$/.test(k); })
      .sort(function (a, b) { return parseInt(a.match(/(\d+)$/)[1], 10) - parseInt(b.match(/(\d+)$/)[1], 10); });

    var fresh = {};
    PART_NAMES.forEach(function (name) {
      var pack = root[name];
      if (!pack || !pack.chapters) return;
      pack.chapters.forEach(function (c) {
        if (!c || !c.id) { console.error("[装配 tsx] " + name + " 里有一章没有 id"); return; }
        if (fresh[c.id]) console.error("[装配 tsx] 章 id 重复：" + c.id + "（" + name + "）");
        if (ORDER.indexOf(c.id) < 0) console.error("[装配 tsx] " + name + " 里的 " + c.id + " 不在 ORDER（tsx01–tsx12）里");
        fresh[c.id] = c;
      });
    });

    var chapters = [], missing = [];
    ORDER.forEach(function (cid) {
      if (fresh[cid]) chapters.push(fresh[cid]);
      else missing.push(cid);
    });
    if (missing.length && !root.MIAO_PARTIAL) console.error("[装配 tsx] 缺章：" + missing.join(", "));
    if (typeof console !== "undefined" && root.document === undefined) {
      console.log("[装配] TypeScript 精通 " + chapters.length + "/" + ORDER.length + " 章就位");
    }

    root.MIAO_TSX = { tutorial: {
      id: META.id, title: META.title, intro: META.intro, cat: META.cat, diff: META.diff,
      tags: META.tags, author: META.author, cover: META.cover, updated: META.updated,
      chapters: chapters
    } };
    return chapters;
  }

  root.MIAO_TSX_ASSEMBLE = assemble;
  assemble();
})(typeof window !== "undefined" ? window : globalThis);
