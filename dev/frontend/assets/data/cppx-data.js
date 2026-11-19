/* 喵站 · C++ 精通（cppx）数据装配层
 *
 * 正文拆在 data/cppx/p1.js、p2.js 里，各导出 window.MIAO_CPPX_Pn = { chapters: [...] }。
 * 这一份按章 id 拼成整门课；章 id 不在 ORDER（cpx01–cpx12）里当场报错。
 *
 * 分层加载：数据层每拉进一份分部就再拼一次，所以装配收进 assemble()，
 * 并挂成 window.MIAO_CPPX_ASSEMBLE（site.js 的 assemble 字段指它）。
 */
(function (root) {
  "use strict";

  var ORDER = ["cpx01","cpx02","cpx03","cpx04","cpx05","cpx06","cpx07","cpx08","cpx09","cpx10","cpx11","cpx12"];

  var META = {
    id: "cppx",
    title: "C++ 精通",
    intro: "接 C++ 掌握，把对象模型、移动语义、模板、并发、网络、性能与工程化走完；最后一课讲游戏引擎、音视频、量化、基础软件几条就业路线。",
    cat: "C++",
    diff: "精通",
    tags: ["C++","精通","高性能","系统"],
    author: "喵站官方",
    cover: "/assets/img/covers/cppx.svg",
    updated: "2026-11-11"
  };

  function assemble() {
    var PART_NAMES = Object.keys(root).filter(function (k) { return /^MIAO_CPPX_P\d+$/.test(k); })
      .sort(function (a, b) { return parseInt(a.match(/(\d+)$/)[1], 10) - parseInt(b.match(/(\d+)$/)[1], 10); });

    var fresh = {};
    PART_NAMES.forEach(function (name) {
      var pack = root[name];
      if (!pack || !pack.chapters) return;
      pack.chapters.forEach(function (c) {
        if (!c || !c.id) { console.error("[装配 cppx] " + name + " 里有一章没有 id"); return; }
        if (fresh[c.id]) console.error("[装配 cppx] 章 id 重复：" + c.id + "（" + name + "）");
        if (ORDER.indexOf(c.id) < 0) console.error("[装配 cppx] " + name + " 里的 " + c.id + " 不在 ORDER（cpx01–cpx12）里");
        fresh[c.id] = c;
      });
    });

    var chapters = [], missing = [];
    ORDER.forEach(function (cid) {
      if (fresh[cid]) chapters.push(fresh[cid]);
      else missing.push(cid);
    });
    if (missing.length && !root.MIAO_PARTIAL) console.error("[装配 cppx] 缺章：" + missing.join(", "));
    if (typeof console !== "undefined" && root.document === undefined) {
      console.log("[装配] C++ 精通 " + chapters.length + "/" + ORDER.length + " 章就位");
    }

    root.MIAO_CPPX = { tutorial: {
      id: META.id, title: META.title, intro: META.intro, cat: META.cat, diff: META.diff,
      tags: META.tags, author: META.author, cover: META.cover, updated: META.updated,
      chapters: chapters
    } };
    return chapters;
  }

  root.MIAO_CPPX_ASSEMBLE = assemble;
  assemble();
})(typeof window !== "undefined" ? window : globalThis);
