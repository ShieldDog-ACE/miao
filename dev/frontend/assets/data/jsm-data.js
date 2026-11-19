/* 喵站 · JavaScript 掌握（jsm）数据装配层
 *
 * 正文拆在 data/jsm/p1.js、p2.js 里，各导出 window.MIAO_JSM_Pn = { chapters: [...] }。
 * 这一份按章 id 拼成整门课；章 id 不在 ORDER（jsm01–jsm12）里当场报错。
 *
 * 分层加载：数据层每拉进一份分部就再拼一次，所以装配收进 assemble()，
 * 并挂成 window.MIAO_JSM_ASSEMBLE（site.js 的 assemble 字段指它）。
 */
(function (root) {
  "use strict";

  var ORDER = ["jsm01","jsm02","jsm03","jsm04","jsm05","jsm06","jsm07","jsm08","jsm09","jsm10","jsm11","jsm12"];

  var META = {
    id: "jsm",
    title: "JavaScript 掌握",
    intro: "接 JavaScript 入门，把闭包、原型、异步、事件循环、DOM、网络和工程化补全；最后一课做一个能上线的待办应用。",
    cat: "js",
    diff: "掌握",
    tags: ["JavaScript","掌握","异步","前端"],
    author: "喵站官方",
    cover: "/assets/img/covers/jsm.svg",
    updated: "2026-11-11"
  };

  function assemble() {
    var PART_NAMES = Object.keys(root).filter(function (k) { return /^MIAO_JSM_P\d+$/.test(k); })
      .sort(function (a, b) { return parseInt(a.match(/(\d+)$/)[1], 10) - parseInt(b.match(/(\d+)$/)[1], 10); });

    var fresh = {};
    PART_NAMES.forEach(function (name) {
      var pack = root[name];
      if (!pack || !pack.chapters) return;
      pack.chapters.forEach(function (c) {
        if (!c || !c.id) { console.error("[装配 jsm] " + name + " 里有一章没有 id"); return; }
        if (fresh[c.id]) console.error("[装配 jsm] 章 id 重复：" + c.id + "（" + name + "）");
        if (ORDER.indexOf(c.id) < 0) console.error("[装配 jsm] " + name + " 里的 " + c.id + " 不在 ORDER（jsm01–jsm12）里");
        fresh[c.id] = c;
      });
    });

    var chapters = [], missing = [];
    ORDER.forEach(function (cid) {
      if (fresh[cid]) chapters.push(fresh[cid]);
      else missing.push(cid);
    });
    if (missing.length && !root.MIAO_PARTIAL) console.error("[装配 jsm] 缺章：" + missing.join(", "));
    if (typeof console !== "undefined" && root.document === undefined) {
      console.log("[装配] JavaScript 掌握 " + chapters.length + "/" + ORDER.length + " 章就位");
    }

    root.MIAO_JSM = { tutorial: {
      id: META.id, title: META.title, intro: META.intro, cat: META.cat, diff: META.diff,
      tags: META.tags, author: META.author, cover: META.cover, updated: META.updated,
      chapters: chapters
    } };
    return chapters;
  }

  root.MIAO_JSM_ASSEMBLE = assemble;
  assemble();
})(typeof window !== "undefined" ? window : globalThis);
