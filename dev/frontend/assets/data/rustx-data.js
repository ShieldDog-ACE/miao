/* 喵站 · Rust 精通（rustx）数据装配层
 *
 * 正文拆在 data/rustx/p1.js、p2.js 里，各导出 window.MIAO_RUSTX_Pn = { chapters: [...] }。
 * 这一份按章 id 拼成整门课；章 id 不在 ORDER（rux01–rux12）里当场报错。
 *
 * 分层加载：数据层每拉进一份分部就再拼一次，所以装配收进 assemble()，
 * 并挂成 window.MIAO_RUSTX_ASSEMBLE（site.js 的 assemble 字段指它）。
 */
(function (root) {
  "use strict";

  var ORDER = ["rux01","rux02","rux03","rux04","rux05","rux06","rux07","rux08","rux09","rux10","rux11","rux12"];

  var META = {
    id: "rustx",
    title: "Rust 精通",
    intro: "接 Rust 掌握，深入 trait 对象、async、网络服务、宏、FFI 与性能；最后一课讲系统、网络、WebAssembly、嵌入式几条就业路线。",
    cat: "Rust",
    diff: "精通",
    tags: ["Rust","精通","系统编程","网络"],
    author: "喵站官方",
    cover: "/assets/img/covers/rustx.svg",
    updated: "2026-11-11"
  };

  function assemble() {
    var PART_NAMES = Object.keys(root).filter(function (k) { return /^MIAO_RUSTX_P\d+$/.test(k); })
      .sort(function (a, b) { return parseInt(a.match(/(\d+)$/)[1], 10) - parseInt(b.match(/(\d+)$/)[1], 10); });

    var fresh = {};
    PART_NAMES.forEach(function (name) {
      var pack = root[name];
      if (!pack || !pack.chapters) return;
      pack.chapters.forEach(function (c) {
        if (!c || !c.id) { console.error("[装配 rustx] " + name + " 里有一章没有 id"); return; }
        if (fresh[c.id]) console.error("[装配 rustx] 章 id 重复：" + c.id + "（" + name + "）");
        if (ORDER.indexOf(c.id) < 0) console.error("[装配 rustx] " + name + " 里的 " + c.id + " 不在 ORDER（rux01–rux12）里");
        fresh[c.id] = c;
      });
    });

    var chapters = [], missing = [];
    ORDER.forEach(function (cid) {
      if (fresh[cid]) chapters.push(fresh[cid]);
      else missing.push(cid);
    });
    if (missing.length && !root.MIAO_PARTIAL) console.error("[装配 rustx] 缺章：" + missing.join(", "));
    if (typeof console !== "undefined" && root.document === undefined) {
      console.log("[装配] Rust 精通 " + chapters.length + "/" + ORDER.length + " 章就位");
    }

    root.MIAO_RUSTX = { tutorial: {
      id: META.id, title: META.title, intro: META.intro, cat: META.cat, diff: META.diff,
      tags: META.tags, author: META.author, cover: META.cover, updated: META.updated,
      chapters: chapters
    } };
    return chapters;
  }

  root.MIAO_RUSTX_ASSEMBLE = assemble;
  assemble();
})(typeof window !== "undefined" ? window : globalThis);
