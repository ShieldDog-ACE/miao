/* 喵站 · C 掌握（cptr）数据装配层
 *
 * 正文拆在 data/cptr/q1.js、q2.js 里，各导出 window.MIAO_CPTR_Qn = { chapters: [...] }。
 * 这一份按章 id 拼成整门课；章 id 不在 ORDER（q01–q24）里当场报错。
 *
 * 分层加载：数据层每拉进一份分部就再拼一次，所以装配收进 assemble()，
 * 并挂成 window.MIAO_CPTR_ASSEMBLE（site.js 的 assemble 字段指它）。
 */
(function (root) {
  "use strict";

  var ORDER = [];
  for (var i = 1; i <= 24; i++) ORDER.push("q" + (i < 10 ? "0" + i : String(i)));

  var META = {
    id: "cptr",
    title: "C 掌握",
    intro: "在 C 入门之后，把指针、内存、结构体、文件和 Makefile 讲透；每课都有能编译的代码和一张内存图。",
    cat: "c",
    diff: "掌握",
    tags: ["C", "指针", "内存", "掌握"],
    author: "喵站官方",
    cover: "/assets/img/covers/cptr.svg",
    updated: "2026-11-11"
  };

  function assemble() {
    var PART_NAMES = Object.keys(root).filter(function (k) { return /^MIAO_CPTR_Q\d+$/.test(k); })
      .sort(function (a, b) { return parseInt(a.match(/(\d+)$/)[1], 10) - parseInt(b.match(/(\d+)$/)[1], 10); });

    var fresh = {};
    PART_NAMES.forEach(function (name) {
      var pack = root[name];
      if (!pack || !pack.chapters) return;
      pack.chapters.forEach(function (c) {
        if (!c || !c.id) { console.error("[装配 cptr] " + name + " 里有一章没有 id"); return; }
        if (fresh[c.id]) console.error("[装配 cptr] 章 id 重复：" + c.id + "（" + name + "）");
        if (ORDER.indexOf(c.id) < 0) console.error("[装配 cptr] " + name + " 里的 " + c.id + " 不在 ORDER（q01–q24）里");
        fresh[c.id] = c;
      });
    });

    var chapters = [], missing = [];
    ORDER.forEach(function (id) {
      if (fresh[id]) chapters.push(fresh[id]);
      else missing.push(id);
    });
    if (missing.length && !root.MIAO_PARTIAL) console.error("[装配 cptr] 缺章：" + missing.join(", "));
    if (typeof console !== "undefined" && root.document === undefined) {
      console.log("[装配] C 进阶 " + chapters.length + "/" + ORDER.length + " 章就位");
    }

    root.MIAO_CPTR = { tutorial: {
      id: META.id, title: META.title, intro: META.intro, cat: META.cat, diff: META.diff,
      tags: META.tags, author: META.author, cover: META.cover, updated: META.updated,
      chapters: chapters
    } };
    return chapters;
  }

  root.MIAO_CPTR_ASSEMBLE = assemble;
  assemble();
})(typeof window !== "undefined" ? window : globalThis);
