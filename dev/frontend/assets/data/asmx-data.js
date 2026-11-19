/* 喵站 · 汇编精通（asmx）数据装配层
 *
 * 正文拆在 data/asmx/p1.js、p2.js 里，各导出 window.MIAO_ASMX_Pn = { chapters: [...] }。
 * 这一份按章 id 拼成整门课；章 id 不在 ORDER（amx01–amx12）里当场报错。
 *
 * 分层加载：数据层每拉进一份分部就再拼一次，所以装配收进 assemble()，
 * 并挂成 window.MIAO_ASMX_ASSEMBLE（site.js 的 assemble 字段指它）。
 */
(function (root) {
  "use strict";

  var ORDER = ["amx01","amx02","amx03","amx04","amx05","amx06","amx07","amx08","amx09","amx10","amx11","amx12"];

  var META = {
    id: "asmx",
    title: "汇编精通",
    intro: "接汇编掌握，深入 SIMD、缓存、性能剖析、逆向与安全；最后一课讲逆向、性能工程、嵌入式底层、编译器几条就业路线。",
    cat: "汇编",
    diff: "精通",
    tags: ["汇编","精通","SIMD","逆向"],
    author: "喵站官方",
    cover: "/assets/img/covers/asmx.svg",
    updated: "2026-11-11"
  };

  function assemble() {
    var PART_NAMES = Object.keys(root).filter(function (k) { return /^MIAO_ASMX_P\d+$/.test(k); })
      .sort(function (a, b) { return parseInt(a.match(/(\d+)$/)[1], 10) - parseInt(b.match(/(\d+)$/)[1], 10); });

    var fresh = {};
    PART_NAMES.forEach(function (name) {
      var pack = root[name];
      if (!pack || !pack.chapters) return;
      pack.chapters.forEach(function (c) {
        if (!c || !c.id) { console.error("[装配 asmx] " + name + " 里有一章没有 id"); return; }
        if (fresh[c.id]) console.error("[装配 asmx] 章 id 重复：" + c.id + "（" + name + "）");
        if (ORDER.indexOf(c.id) < 0) console.error("[装配 asmx] " + name + " 里的 " + c.id + " 不在 ORDER（amx01–amx12）里");
        fresh[c.id] = c;
      });
    });

    var chapters = [], missing = [];
    ORDER.forEach(function (cid) {
      if (fresh[cid]) chapters.push(fresh[cid]);
      else missing.push(cid);
    });
    if (missing.length && !root.MIAO_PARTIAL) console.error("[装配 asmx] 缺章：" + missing.join(", "));
    if (typeof console !== "undefined" && root.document === undefined) {
      console.log("[装配] 汇编精通 " + chapters.length + "/" + ORDER.length + " 章就位");
    }

    root.MIAO_ASMX = { tutorial: {
      id: META.id, title: META.title, intro: META.intro, cat: META.cat, diff: META.diff,
      tags: META.tags, author: META.author, cover: META.cover, updated: META.updated,
      chapters: chapters
    } };
    return chapters;
  }

  root.MIAO_ASMX_ASSEMBLE = assemble;
  assemble();
})(typeof window !== "undefined" ? window : globalThis);
