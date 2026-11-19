/* 喵站 · 汇编掌握（asmm）数据装配层
 *
 * 正文拆在 data/asmm/p1.js、p2.js 里，各导出 window.MIAO_ASMM_Pn = { chapters: [...] }。
 * 这一份按章 id 拼成整门课；章 id 不在 ORDER（amm01–amm12）里当场报错。
 *
 * 分层加载：数据层每拉进一份分部就再拼一次，所以装配收进 assemble()，
 * 并挂成 window.MIAO_ASMM_ASSEMBLE（site.js 的 assemble 字段指它）。
 */
(function (root) {
  "use strict";

  var ORDER = ["amm01","amm02","amm03","amm04","amm05","amm06","amm07","amm08","amm09","amm10","amm11","amm12"];

  var META = {
    id: "asmm",
    title: "汇编掌握",
    intro: "接汇编入门，把寻址、位运算、调用约定、栈帧、系统调用、链接与反汇编走完；最后一课写一个汇编命令行工具。",
    cat: "汇编",
    diff: "掌握",
    tags: ["汇编","掌握","x86-64","底层"],
    author: "喵站官方",
    cover: "/assets/img/covers/asmm.svg",
    updated: "2026-11-11"
  };

  function assemble() {
    var PART_NAMES = Object.keys(root).filter(function (k) { return /^MIAO_ASMM_P\d+$/.test(k); })
      .sort(function (a, b) { return parseInt(a.match(/(\d+)$/)[1], 10) - parseInt(b.match(/(\d+)$/)[1], 10); });

    var fresh = {};
    PART_NAMES.forEach(function (name) {
      var pack = root[name];
      if (!pack || !pack.chapters) return;
      pack.chapters.forEach(function (c) {
        if (!c || !c.id) { console.error("[装配 asmm] " + name + " 里有一章没有 id"); return; }
        if (fresh[c.id]) console.error("[装配 asmm] 章 id 重复：" + c.id + "（" + name + "）");
        if (ORDER.indexOf(c.id) < 0) console.error("[装配 asmm] " + name + " 里的 " + c.id + " 不在 ORDER（amm01–amm12）里");
        fresh[c.id] = c;
      });
    });

    var chapters = [], missing = [];
    ORDER.forEach(function (cid) {
      if (fresh[cid]) chapters.push(fresh[cid]);
      else missing.push(cid);
    });
    if (missing.length && !root.MIAO_PARTIAL) console.error("[装配 asmm] 缺章：" + missing.join(", "));
    if (typeof console !== "undefined" && root.document === undefined) {
      console.log("[装配] 汇编掌握 " + chapters.length + "/" + ORDER.length + " 章就位");
    }

    root.MIAO_ASMM = { tutorial: {
      id: META.id, title: META.title, intro: META.intro, cat: META.cat, diff: META.diff,
      tags: META.tags, author: META.author, cover: META.cover, updated: META.updated,
      chapters: chapters
    } };
    return chapters;
  }

  root.MIAO_ASMM_ASSEMBLE = assemble;
  assemble();
})(typeof window !== "undefined" ? window : globalThis);
