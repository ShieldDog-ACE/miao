/* 喵站 · Go 精通（gox）数据装配层
 *
 * 正文拆在 data/gox/p1.js、p2.js 里，各导出 window.MIAO_GOX_Pn = { chapters: [...] }。
 * 这一份按章 id 拼成整门课；章 id 不在 ORDER（gox01–gox12）里当场报错。
 *
 * 分层加载：数据层每拉进一份分部就再拼一次，所以装配收进 assemble()，
 * 并挂成 window.MIAO_GOX_ASSEMBLE（site.js 的 assemble 字段指它）。
 */
(function (root) {
  "use strict";

  var ORDER = ["gox01","gox02","gox03","gox04","gox05","gox06","gox07","gox08","gox09","gox10","gox11","gox12"];

  var META = {
    id: "gox",
    title: "Go 精通",
    intro: "接 Go 掌握，深入调度器、并发模式、gRPC、微服务与云原生；最后一课讲后端、DevOps、网关、区块链几条就业路线。",
    cat: "Go",
    diff: "精通",
    tags: ["Go","精通","云原生","高并发"],
    author: "喵站官方",
    cover: "/assets/img/covers/gox.svg",
    updated: "2026-11-11"
  };

  function assemble() {
    var PART_NAMES = Object.keys(root).filter(function (k) { return /^MIAO_GOX_P\d+$/.test(k); })
      .sort(function (a, b) { return parseInt(a.match(/(\d+)$/)[1], 10) - parseInt(b.match(/(\d+)$/)[1], 10); });

    var fresh = {};
    PART_NAMES.forEach(function (name) {
      var pack = root[name];
      if (!pack || !pack.chapters) return;
      pack.chapters.forEach(function (c) {
        if (!c || !c.id) { console.error("[装配 gox] " + name + " 里有一章没有 id"); return; }
        if (fresh[c.id]) console.error("[装配 gox] 章 id 重复：" + c.id + "（" + name + "）");
        if (ORDER.indexOf(c.id) < 0) console.error("[装配 gox] " + name + " 里的 " + c.id + " 不在 ORDER（gox01–gox12）里");
        fresh[c.id] = c;
      });
    });

    var chapters = [], missing = [];
    ORDER.forEach(function (cid) {
      if (fresh[cid]) chapters.push(fresh[cid]);
      else missing.push(cid);
    });
    if (missing.length && !root.MIAO_PARTIAL) console.error("[装配 gox] 缺章：" + missing.join(", "));
    if (typeof console !== "undefined" && root.document === undefined) {
      console.log("[装配] Go 精通 " + chapters.length + "/" + ORDER.length + " 章就位");
    }

    root.MIAO_GOX = { tutorial: {
      id: META.id, title: META.title, intro: META.intro, cat: META.cat, diff: META.diff,
      tags: META.tags, author: META.author, cover: META.cover, updated: META.updated,
      chapters: chapters
    } };
    return chapters;
  }

  root.MIAO_GOX_ASSEMBLE = assemble;
  assemble();
})(typeof window !== "undefined" ? window : globalThis);
