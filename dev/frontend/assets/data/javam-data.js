/* 喵站 · Java 掌握（javam）数据装配层
 *
 * 正文拆在 data/javam/p1.js、p2.js 里，各导出 window.MIAO_JAVAM_Pn = { chapters: [...] }。
 * 这一份按章 id 拼成整门课；章 id 不在 ORDER（jm01–jm12）里当场报错。
 *
 * 分层加载：数据层每拉进一份分部就再拼一次，所以装配收进 assemble()，
 * 并挂成 window.MIAO_JAVAM_ASSEMBLE（site.js 的 assemble 字段指它）。
 */
(function (root) {
  "use strict";

  var ORDER = ["jm01","jm02","jm03","jm04","jm05","jm06","jm07","jm08","jm09","jm10","jm11","jm12"];

  var META = {
    id: "javam",
    title: "Java 掌握",
    intro: "接 Java 入门，把面向对象、集合、泛型、异常、IO、多线程和 Maven 走完；最后一课做一个能运行的命令行图书柜项目。",
    cat: "java",
    diff: "掌握",
    tags: ["Java","掌握","面向对象","工程"],
    author: "喵站官方",
    cover: "/assets/img/covers/javam.svg",
    updated: "2026-11-11"
  };

  function assemble() {
    var PART_NAMES = Object.keys(root).filter(function (k) { return /^MIAO_JAVAM_P\d+$/.test(k); })
      .sort(function (a, b) { return parseInt(a.match(/(\d+)$/)[1], 10) - parseInt(b.match(/(\d+)$/)[1], 10); });

    var fresh = {};
    PART_NAMES.forEach(function (name) {
      var pack = root[name];
      if (!pack || !pack.chapters) return;
      pack.chapters.forEach(function (c) {
        if (!c || !c.id) { console.error("[装配 javam] " + name + " 里有一章没有 id"); return; }
        if (fresh[c.id]) console.error("[装配 javam] 章 id 重复：" + c.id + "（" + name + "）");
        if (ORDER.indexOf(c.id) < 0) console.error("[装配 javam] " + name + " 里的 " + c.id + " 不在 ORDER（jm01–jm12）里");
        fresh[c.id] = c;
      });
    });

    var chapters = [], missing = [];
    ORDER.forEach(function (cid) {
      if (fresh[cid]) chapters.push(fresh[cid]);
      else missing.push(cid);
    });
    if (missing.length && !root.MIAO_PARTIAL) console.error("[装配 javam] 缺章：" + missing.join(", "));
    if (typeof console !== "undefined" && root.document === undefined) {
      console.log("[装配] Java 掌握 " + chapters.length + "/" + ORDER.length + " 章就位");
    }

    root.MIAO_JAVAM = { tutorial: {
      id: META.id, title: META.title, intro: META.intro, cat: META.cat, diff: META.diff,
      tags: META.tags, author: META.author, cover: META.cover, updated: META.updated,
      chapters: chapters
    } };
    return chapters;
  }

  root.MIAO_JAVAM_ASSEMBLE = assemble;
  assemble();
})(typeof window !== "undefined" ? window : globalThis);
