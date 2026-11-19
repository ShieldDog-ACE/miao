/* 喵站 · C# 精通（csharpx）数据装配层
 *
 * 正文拆在 data/csharpx/p1.js、p2.js 里，各导出 window.MIAO_CSHARPX_Pn = { chapters: [...] }。
 * 这一份按章 id 拼成整门课；章 id 不在 ORDER（csx01–csx12）里当场报错。
 *
 * 分层加载：数据层每拉进一份分部就再拼一次，所以装配收进 assemble()，
 * 并挂成 window.MIAO_CSHARPX_ASSEMBLE（site.js 的 assemble 字段指它）。
 */
(function (root) {
  "use strict";

  var ORDER = ["csx01","csx02","csx03","csx04","csx05","csx06","csx07","csx08","csx09","csx10","csx11","csx12"];

  var META = {
    id: "csharpx",
    title: "C# 精通",
    intro: "接 C# 掌握，深入 .NET 运行时、GC、ASP.NET Core、EF Core、Unity 与桌面；最后一课讲 .NET 后端、游戏、工业上位机几条就业路线。",
    cat: "c#",
    diff: "精通",
    tags: ["C#","精通",".NET","后端"],
    author: "喵站官方",
    cover: "/assets/img/covers/csharpx.svg",
    updated: "2026-11-11"
  };

  function assemble() {
    var PART_NAMES = Object.keys(root).filter(function (k) { return /^MIAO_CSHARPX_P\d+$/.test(k); })
      .sort(function (a, b) { return parseInt(a.match(/(\d+)$/)[1], 10) - parseInt(b.match(/(\d+)$/)[1], 10); });

    var fresh = {};
    PART_NAMES.forEach(function (name) {
      var pack = root[name];
      if (!pack || !pack.chapters) return;
      pack.chapters.forEach(function (c) {
        if (!c || !c.id) { console.error("[装配 csharpx] " + name + " 里有一章没有 id"); return; }
        if (fresh[c.id]) console.error("[装配 csharpx] 章 id 重复：" + c.id + "（" + name + "）");
        if (ORDER.indexOf(c.id) < 0) console.error("[装配 csharpx] " + name + " 里的 " + c.id + " 不在 ORDER（csx01–csx12）里");
        fresh[c.id] = c;
      });
    });

    var chapters = [], missing = [];
    ORDER.forEach(function (cid) {
      if (fresh[cid]) chapters.push(fresh[cid]);
      else missing.push(cid);
    });
    if (missing.length && !root.MIAO_PARTIAL) console.error("[装配 csharpx] 缺章：" + missing.join(", "));
    if (typeof console !== "undefined" && root.document === undefined) {
      console.log("[装配] C# 精通 " + chapters.length + "/" + ORDER.length + " 章就位");
    }

    root.MIAO_CSHARPX = { tutorial: {
      id: META.id, title: META.title, intro: META.intro, cat: META.cat, diff: META.diff,
      tags: META.tags, author: META.author, cover: META.cover, updated: META.updated,
      chapters: chapters
    } };
    return chapters;
  }

  root.MIAO_CSHARPX_ASSEMBLE = assemble;
  assemble();
})(typeof window !== "undefined" ? window : globalThis);
