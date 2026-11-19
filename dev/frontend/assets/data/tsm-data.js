/* 喵站 · TypeScript 掌握（tsm）数据装配层
 *
 * 正文拆在 data/tsm/p1.js、p2.js 里，各导出 window.MIAO_TSM_Pn = { chapters: [...] }。
 * 这一份按章 id 拼成整门课；章 id 不在 ORDER（tsm01–tsm12）里当场报错。
 *
 * 分层加载：数据层每拉进一份分部就再拼一次，所以装配收进 assemble()，
 * 并挂成 window.MIAO_TSM_ASSEMBLE（site.js 的 assemble 字段指它）。
 */
(function (root) {
  "use strict";

  var ORDER = ["tsm01","tsm02","tsm03","tsm04","tsm05","tsm06","tsm07","tsm08","tsm09","tsm10","tsm11","tsm12"];

  var META = {
    id: "tsm",
    title: "TypeScript 掌握",
    intro: "接 TypeScript 入门，把联合类型、泛型、收窄、工具类型、声明文件和严格模式走完；最后一课写一个类型安全的 API 客户端。",
    cat: "ts",
    diff: "掌握",
    tags: ["TypeScript","掌握","类型系统","工程"],
    author: "喵站官方",
    cover: "/assets/img/covers/tsm.svg",
    updated: "2026-11-11"
  };

  function assemble() {
    var PART_NAMES = Object.keys(root).filter(function (k) { return /^MIAO_TSM_P\d+$/.test(k); })
      .sort(function (a, b) { return parseInt(a.match(/(\d+)$/)[1], 10) - parseInt(b.match(/(\d+)$/)[1], 10); });

    var fresh = {};
    PART_NAMES.forEach(function (name) {
      var pack = root[name];
      if (!pack || !pack.chapters) return;
      pack.chapters.forEach(function (c) {
        if (!c || !c.id) { console.error("[装配 tsm] " + name + " 里有一章没有 id"); return; }
        if (fresh[c.id]) console.error("[装配 tsm] 章 id 重复：" + c.id + "（" + name + "）");
        if (ORDER.indexOf(c.id) < 0) console.error("[装配 tsm] " + name + " 里的 " + c.id + " 不在 ORDER（tsm01–tsm12）里");
        fresh[c.id] = c;
      });
    });

    var chapters = [], missing = [];
    ORDER.forEach(function (cid) {
      if (fresh[cid]) chapters.push(fresh[cid]);
      else missing.push(cid);
    });
    if (missing.length && !root.MIAO_PARTIAL) console.error("[装配 tsm] 缺章：" + missing.join(", "));
    if (typeof console !== "undefined" && root.document === undefined) {
      console.log("[装配] TypeScript 掌握 " + chapters.length + "/" + ORDER.length + " 章就位");
    }

    root.MIAO_TSM = { tutorial: {
      id: META.id, title: META.title, intro: META.intro, cat: META.cat, diff: META.diff,
      tags: META.tags, author: META.author, cover: META.cover, updated: META.updated,
      chapters: chapters
    } };
    return chapters;
  }

  root.MIAO_TSM_ASSEMBLE = assemble;
  assemble();
})(typeof window !== "undefined" ? window : globalThis);
