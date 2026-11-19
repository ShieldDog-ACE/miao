/* 喵站 · JavaScript 精通（jsx）数据装配层
 *
 * 正文拆在 data/jsx/p1.js、p2.js 里，各导出 window.MIAO_JSX_Pn = { chapters: [...] }。
 * 这一份按章 id 拼成整门课；章 id 不在 ORDER（jsx01–jsx12）里当场报错。
 *
 * 分层加载：数据层每拉进一份分部就再拼一次，所以装配收进 assemble()，
 * 并挂成 window.MIAO_JSX_ASSEMBLE（site.js 的 assemble 字段指它）。
 */
(function (root) {
  "use strict";

  var ORDER = ["jsx01","jsx02","jsx03","jsx04","jsx05","jsx06","jsx07","jsx08","jsx09","jsx10","jsx11","jsx12"];

  var META = {
    id: "jsx",
    title: "JavaScript 精通",
    intro: "接 JavaScript 掌握，深入运行时、渲染、Node、全栈与性能；最后一课讲前端、Node 后端、桌面、可视化几条就业路线。",
    cat: "js",
    diff: "精通",
    tags: ["JavaScript","精通","全栈","运行时"],
    author: "喵站官方",
    cover: "/assets/img/covers/jsx.svg",
    updated: "2026-11-11"
  };

  function assemble() {
    var PART_NAMES = Object.keys(root).filter(function (k) { return /^MIAO_JSX_P\d+$/.test(k); })
      .sort(function (a, b) { return parseInt(a.match(/(\d+)$/)[1], 10) - parseInt(b.match(/(\d+)$/)[1], 10); });

    var fresh = {};
    PART_NAMES.forEach(function (name) {
      var pack = root[name];
      if (!pack || !pack.chapters) return;
      pack.chapters.forEach(function (c) {
        if (!c || !c.id) { console.error("[装配 jsx] " + name + " 里有一章没有 id"); return; }
        if (fresh[c.id]) console.error("[装配 jsx] 章 id 重复：" + c.id + "（" + name + "）");
        if (ORDER.indexOf(c.id) < 0) console.error("[装配 jsx] " + name + " 里的 " + c.id + " 不在 ORDER（jsx01–jsx12）里");
        fresh[c.id] = c;
      });
    });

    var chapters = [], missing = [];
    ORDER.forEach(function (cid) {
      if (fresh[cid]) chapters.push(fresh[cid]);
      else missing.push(cid);
    });
    if (missing.length && !root.MIAO_PARTIAL) console.error("[装配 jsx] 缺章：" + missing.join(", "));
    if (typeof console !== "undefined" && root.document === undefined) {
      console.log("[装配] JavaScript 精通 " + chapters.length + "/" + ORDER.length + " 章就位");
    }

    root.MIAO_JSX = { tutorial: {
      id: META.id, title: META.title, intro: META.intro, cat: META.cat, diff: META.diff,
      tags: META.tags, author: META.author, cover: META.cover, updated: META.updated,
      chapters: chapters
    } };
    return chapters;
  }

  root.MIAO_JSX_ASSEMBLE = assemble;
  assemble();
})(typeof window !== "undefined" ? window : globalThis);
