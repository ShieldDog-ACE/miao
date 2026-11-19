/* 喵站 · Python 掌握（pyds）数据装配层
 *
 * 正文拆在 data/pyds/p1.js、p2.js 里，各导出 window.MIAO_PYDS_Pn = { chapters: [...] }。
 * 这一份按章 id 拼成整门课；章 id 不在 ORDER（p01–p24）里当场报错。
 *
 * 分层加载：数据层每拉进一份分部就再拼一次，所以装配收进 assemble()，
 * 并挂成 window.MIAO_PYDS_ASSEMBLE（site.js 的 assemble 字段指它）。
 */
(function (root) {
  "use strict";

  var ORDER = [];
  for (var i = 1; i <= 24; i++) ORDER.push("p" + (i < 10 ? "0" + i : String(i)));

  var META = {
    id: "pyds",
    title: "Python 掌握",
    intro: "在 Python 入门之后，把数据结构与算法自己写一遍：动态数组、链表、栈、队列、哈希表、树、堆、图；每课都有复杂度账本和能跑的例子，最后做一个小项目。",
    cat: "python",
    diff: "掌握",
    tags: ["Python", "数据结构", "算法", "掌握"],
    author: "喵站官方",
    cover: "/assets/img/covers/pyds.svg",
    updated: "2026-11-11"
  };

  function assemble() {
    var PART_NAMES = Object.keys(root).filter(function (k) { return /^MIAO_PYDS_P\d+$/.test(k); })
      .sort(function (a, b) { return parseInt(a.match(/(\d+)$/)[1], 10) - parseInt(b.match(/(\d+)$/)[1], 10); });

    var fresh = {};
    PART_NAMES.forEach(function (name) {
      var pack = root[name];
      if (!pack || !pack.chapters) return;
      pack.chapters.forEach(function (c) {
        if (!c || !c.id) { console.error("[装配 pyds] " + name + " 里有一章没有 id"); return; }
        if (fresh[c.id]) console.error("[装配 pyds] 章 id 重复：" + c.id + "（" + name + "）");
        if (ORDER.indexOf(c.id) < 0) console.error("[装配 pyds] " + name + " 里的 " + c.id + " 不在 ORDER（p01–p24）里");
        fresh[c.id] = c;
      });
    });

    var chapters = [], missing = [];
    ORDER.forEach(function (id) {
      if (fresh[id]) chapters.push(fresh[id]);
      else missing.push(id);
    });
    if (missing.length && !root.MIAO_PARTIAL) console.error("[装配 pyds] 缺章：" + missing.join(", "));
    if (typeof console !== "undefined" && root.document === undefined) {
      console.log("[装配] Python 数据结构 " + chapters.length + "/" + ORDER.length + " 章就位");
    }

    root.MIAO_PYDS = { tutorial: {
      id: META.id, title: META.title, intro: META.intro, cat: META.cat, diff: META.diff,
      tags: META.tags, author: META.author, cover: META.cover, updated: META.updated,
      chapters: chapters
    } };
    return chapters;
  }

  root.MIAO_PYDS_ASSEMBLE = assemble;
  assemble();
})(typeof window !== "undefined" ? window : globalThis);
