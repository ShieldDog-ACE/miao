/* 喵站 · C 精通（cx）数据装配层
 *
 * 正文拆在 data/cx/p1.js、p2.js 里，各导出 window.MIAO_CX_Pn = { chapters: [...] }。
 * 这一份按章 id 拼成整门课；章 id 不在 ORDER（cex01–cex12）里当场报错。
 *
 * 分层加载：数据层每拉进一份分部就再拼一次，所以装配收进 assemble()，
 * 并挂成 window.MIAO_CX_ASSEMBLE（site.js 的 assemble 字段指它）。
 */
(function (root) {
  "use strict";

  var ORDER = ["cex01","cex02","cex03","cex04","cex05","cex06","cex07","cex08","cex09","cex10","cex11","cex12"];

  var META = {
    id: "cx",
    title: "C 精通",
    intro: "接 C 掌握，把内存布局、系统调用、进程线程、网络、构建与调试走完；最后一课讲操作系统、嵌入式、协议栈、安全几条就业路线。",
    cat: "c",
    diff: "精通",
    tags: ["C","精通","系统编程","底层"],
    author: "喵站官方",
    cover: "/assets/img/covers/cx.svg",
    updated: "2026-11-11"
  };

  function assemble() {
    var PART_NAMES = Object.keys(root).filter(function (k) { return /^MIAO_CX_P\d+$/.test(k); })
      .sort(function (a, b) { return parseInt(a.match(/(\d+)$/)[1], 10) - parseInt(b.match(/(\d+)$/)[1], 10); });

    var fresh = {};
    PART_NAMES.forEach(function (name) {
      var pack = root[name];
      if (!pack || !pack.chapters) return;
      pack.chapters.forEach(function (c) {
        if (!c || !c.id) { console.error("[装配 cx] " + name + " 里有一章没有 id"); return; }
        if (fresh[c.id]) console.error("[装配 cx] 章 id 重复：" + c.id + "（" + name + "）");
        if (ORDER.indexOf(c.id) < 0) console.error("[装配 cx] " + name + " 里的 " + c.id + " 不在 ORDER（cex01–cex12）里");
        fresh[c.id] = c;
      });
    });

    var chapters = [], missing = [];
    ORDER.forEach(function (cid) {
      if (fresh[cid]) chapters.push(fresh[cid]);
      else missing.push(cid);
    });
    if (missing.length && !root.MIAO_PARTIAL) console.error("[装配 cx] 缺章：" + missing.join(", "));
    if (typeof console !== "undefined" && root.document === undefined) {
      console.log("[装配] C 精通 " + chapters.length + "/" + ORDER.length + " 章就位");
    }

    root.MIAO_CX = { tutorial: {
      id: META.id, title: META.title, intro: META.intro, cat: META.cat, diff: META.diff,
      tags: META.tags, author: META.author, cover: META.cover, updated: META.updated,
      chapters: chapters
    } };
    return chapters;
  }

  root.MIAO_CX_ASSEMBLE = assemble;
  assemble();
})(typeof window !== "undefined" ? window : globalThis);
