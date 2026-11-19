/* 喵站 · Rust 掌握（rustm）数据装配层
 *
 * 正文拆在 data/rustm/p1.js、p2.js 里，各导出 window.MIAO_RUSTM_Pn = { chapters: [...] }。
 * 这一份按章 id 拼成整门课；章 id 不在 ORDER（rum01–rum12）里当场报错。
 *
 * 分层加载：数据层每拉进一份分部就再拼一次，所以装配收进 assemble()，
 * 并挂成 window.MIAO_RUSTM_ASSEMBLE（site.js 的 assemble 字段指它）。
 */
(function (root) {
  "use strict";

  var ORDER = ["rum01","rum02","rum03","rum04","rum05","rum06","rum07","rum08","rum09","rum10","rum11","rum12"];

  var META = {
    id: "rustm",
    title: "Rust 掌握",
    intro: "接 Rust 入门，把所有权、生命周期、trait、错误处理、智能指针、并发和 Cargo 走完；最后一课写一个命令行工具。",
    cat: "Rust",
    diff: "掌握",
    tags: ["Rust","掌握","所有权","工程"],
    author: "喵站官方",
    cover: "/assets/img/covers/rustm.svg",
    updated: "2026-11-11"
  };

  function assemble() {
    var PART_NAMES = Object.keys(root).filter(function (k) { return /^MIAO_RUSTM_P\d+$/.test(k); })
      .sort(function (a, b) { return parseInt(a.match(/(\d+)$/)[1], 10) - parseInt(b.match(/(\d+)$/)[1], 10); });

    var fresh = {};
    PART_NAMES.forEach(function (name) {
      var pack = root[name];
      if (!pack || !pack.chapters) return;
      pack.chapters.forEach(function (c) {
        if (!c || !c.id) { console.error("[装配 rustm] " + name + " 里有一章没有 id"); return; }
        if (fresh[c.id]) console.error("[装配 rustm] 章 id 重复：" + c.id + "（" + name + "）");
        if (ORDER.indexOf(c.id) < 0) console.error("[装配 rustm] " + name + " 里的 " + c.id + " 不在 ORDER（rum01–rum12）里");
        fresh[c.id] = c;
      });
    });

    var chapters = [], missing = [];
    ORDER.forEach(function (cid) {
      if (fresh[cid]) chapters.push(fresh[cid]);
      else missing.push(cid);
    });
    if (missing.length && !root.MIAO_PARTIAL) console.error("[装配 rustm] 缺章：" + missing.join(", "));
    if (typeof console !== "undefined" && root.document === undefined) {
      console.log("[装配] Rust 掌握 " + chapters.length + "/" + ORDER.length + " 章就位");
    }

    root.MIAO_RUSTM = { tutorial: {
      id: META.id, title: META.title, intro: META.intro, cat: META.cat, diff: META.diff,
      tags: META.tags, author: META.author, cover: META.cover, updated: META.updated,
      chapters: chapters
    } };
    return chapters;
  }

  root.MIAO_RUSTM_ASSEMBLE = assemble;
  assemble();
})(typeof window !== "undefined" ? window : globalThis);
