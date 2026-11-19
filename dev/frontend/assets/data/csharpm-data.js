/* 喵站 · C# 掌握（csharpm）数据装配层
 *
 * 正文拆在 data/csharpm/p1.js、p2.js 里，各导出 window.MIAO_CSHARPM_Pn = { chapters: [...] }。
 * 这一份按章 id 拼成整门课；章 id 不在 ORDER（csm01–csm12）里当场报错。
 *
 * 分层加载：数据层每拉进一份分部就再拼一次，所以装配收进 assemble()，
 * 并挂成 window.MIAO_CSHARPM_ASSEMBLE（site.js 的 assemble 字段指它）。
 */
(function (root) {
  "use strict";

  var ORDER = ["csm01","csm02","csm03","csm04","csm05","csm06","csm07","csm08","csm09","csm10","csm11","csm12"];

  var META = {
    id: "csharpm",
    title: "C# 掌握",
    intro: "接 C# 入门，把泛型、集合、LINQ、委托、异步、文件和 EF Core 走完；最后一课做一个控制台任务清单。",
    cat: "c#",
    diff: "掌握",
    tags: ["C#","掌握",".NET","工程"],
    author: "喵站官方",
    cover: "/assets/img/covers/csharpm.svg",
    updated: "2026-11-11"
  };

  function assemble() {
    var PART_NAMES = Object.keys(root).filter(function (k) { return /^MIAO_CSHARPM_P\d+$/.test(k); })
      .sort(function (a, b) { return parseInt(a.match(/(\d+)$/)[1], 10) - parseInt(b.match(/(\d+)$/)[1], 10); });

    var fresh = {};
    PART_NAMES.forEach(function (name) {
      var pack = root[name];
      if (!pack || !pack.chapters) return;
      pack.chapters.forEach(function (c) {
        if (!c || !c.id) { console.error("[装配 csharpm] " + name + " 里有一章没有 id"); return; }
        if (fresh[c.id]) console.error("[装配 csharpm] 章 id 重复：" + c.id + "（" + name + "）");
        if (ORDER.indexOf(c.id) < 0) console.error("[装配 csharpm] " + name + " 里的 " + c.id + " 不在 ORDER（csm01–csm12）里");
        fresh[c.id] = c;
      });
    });

    var chapters = [], missing = [];
    ORDER.forEach(function (cid) {
      if (fresh[cid]) chapters.push(fresh[cid]);
      else missing.push(cid);
    });
    if (missing.length && !root.MIAO_PARTIAL) console.error("[装配 csharpm] 缺章：" + missing.join(", "));
    if (typeof console !== "undefined" && root.document === undefined) {
      console.log("[装配] C# 掌握 " + chapters.length + "/" + ORDER.length + " 章就位");
    }

    root.MIAO_CSHARPM = { tutorial: {
      id: META.id, title: META.title, intro: META.intro, cat: META.cat, diff: META.diff,
      tags: META.tags, author: META.author, cover: META.cover, updated: META.updated,
      chapters: chapters
    } };
    return chapters;
  }

  root.MIAO_CSHARPM_ASSEMBLE = assemble;
  assemble();
})(typeof window !== "undefined" ? window : globalThis);
