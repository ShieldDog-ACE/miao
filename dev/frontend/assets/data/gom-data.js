/* 喵站 · Go 掌握（gom）数据装配层
 *
 * 正文拆在 data/gom/p1.js、p2.js 里，各导出 window.MIAO_GOM_Pn = { chapters: [...] }。
 * 这一份按章 id 拼成整门课；章 id 不在 ORDER（gom01–gom12）里当场报错。
 *
 * 分层加载：数据层每拉进一份分部就再拼一次，所以装配收进 assemble()，
 * 并挂成 window.MIAO_GOM_ASSEMBLE（site.js 的 assemble 字段指它）。
 */
(function (root) {
  "use strict";

  var ORDER = ["gom01","gom02","gom03","gom04","gom05","gom06","gom07","gom08","gom09","gom10","gom11","gom12"];

  var META = {
    id: "gom",
    title: "Go 掌握",
    intro: "接 Go 入门，把结构体、接口、错误、切片、goroutine、channel、context 和 HTTP 走完；最后一课写一个短链服务。",
    cat: "Go",
    diff: "掌握",
    tags: ["Go","掌握","并发","服务"],
    author: "喵站官方",
    cover: "/assets/img/covers/gom.svg",
    updated: "2026-11-11"
  };

  function assemble() {
    var PART_NAMES = Object.keys(root).filter(function (k) { return /^MIAO_GOM_P\d+$/.test(k); })
      .sort(function (a, b) { return parseInt(a.match(/(\d+)$/)[1], 10) - parseInt(b.match(/(\d+)$/)[1], 10); });

    var fresh = {};
    PART_NAMES.forEach(function (name) {
      var pack = root[name];
      if (!pack || !pack.chapters) return;
      pack.chapters.forEach(function (c) {
        if (!c || !c.id) { console.error("[装配 gom] " + name + " 里有一章没有 id"); return; }
        if (fresh[c.id]) console.error("[装配 gom] 章 id 重复：" + c.id + "（" + name + "）");
        if (ORDER.indexOf(c.id) < 0) console.error("[装配 gom] " + name + " 里的 " + c.id + " 不在 ORDER（gom01–gom12）里");
        fresh[c.id] = c;
      });
    });

    var chapters = [], missing = [];
    ORDER.forEach(function (cid) {
      if (fresh[cid]) chapters.push(fresh[cid]);
      else missing.push(cid);
    });
    if (missing.length && !root.MIAO_PARTIAL) console.error("[装配 gom] 缺章：" + missing.join(", "));
    if (typeof console !== "undefined" && root.document === undefined) {
      console.log("[装配] Go 掌握 " + chapters.length + "/" + ORDER.length + " 章就位");
    }

    root.MIAO_GOM = { tutorial: {
      id: META.id, title: META.title, intro: META.intro, cat: META.cat, diff: META.diff,
      tags: META.tags, author: META.author, cover: META.cover, updated: META.updated,
      chapters: chapters
    } };
    return chapters;
  }

  root.MIAO_GOM_ASSEMBLE = assemble;
  assemble();
})(typeof window !== "undefined" ? window : globalThis);
