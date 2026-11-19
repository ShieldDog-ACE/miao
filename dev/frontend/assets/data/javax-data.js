/* 喵站 · Java 精通（javax）数据装配层
 *
 * 正文拆在 data/javax/p1.js、p2.js 里，各导出 window.MIAO_JAVAX_Pn = { chapters: [...] }。
 * 这一份按章 id 拼成整门课；章 id 不在 ORDER（jx01–jx12）里当场报错。
 *
 * 分层加载：数据层每拉进一份分部就再拼一次，所以装配收进 assemble()，
 * 并挂成 window.MIAO_JAVAX_ASSEMBLE（site.js 的 assemble 字段指它）。
 */
(function (root) {
  "use strict";

  var ORDER = ["jx01","jx02","jx03","jx04","jx05","jx06","jx07","jx08","jx09","jx10","jx11","jx12"];

  var META = {
    id: "javax",
    title: "Java 精通",
    intro: "接 Java 掌握，深入 JVM、并发、Spring Boot、缓存、消息队列与微服务；最后一课讲企业后端、大数据、Android 几条就业路线。",
    cat: "java",
    diff: "精通",
    tags: ["Java","精通","JVM","后端"],
    author: "喵站官方",
    cover: "/assets/img/covers/javax.svg",
    updated: "2026-11-11"
  };

  function assemble() {
    var PART_NAMES = Object.keys(root).filter(function (k) { return /^MIAO_JAVAX_P\d+$/.test(k); })
      .sort(function (a, b) { return parseInt(a.match(/(\d+)$/)[1], 10) - parseInt(b.match(/(\d+)$/)[1], 10); });

    var fresh = {};
    PART_NAMES.forEach(function (name) {
      var pack = root[name];
      if (!pack || !pack.chapters) return;
      pack.chapters.forEach(function (c) {
        if (!c || !c.id) { console.error("[装配 javax] " + name + " 里有一章没有 id"); return; }
        if (fresh[c.id]) console.error("[装配 javax] 章 id 重复：" + c.id + "（" + name + "）");
        if (ORDER.indexOf(c.id) < 0) console.error("[装配 javax] " + name + " 里的 " + c.id + " 不在 ORDER（jx01–jx12）里");
        fresh[c.id] = c;
      });
    });

    var chapters = [], missing = [];
    ORDER.forEach(function (cid) {
      if (fresh[cid]) chapters.push(fresh[cid]);
      else missing.push(cid);
    });
    if (missing.length && !root.MIAO_PARTIAL) console.error("[装配 javax] 缺章：" + missing.join(", "));
    if (typeof console !== "undefined" && root.document === undefined) {
      console.log("[装配] Java 精通 " + chapters.length + "/" + ORDER.length + " 章就位");
    }

    root.MIAO_JAVAX = { tutorial: {
      id: META.id, title: META.title, intro: META.intro, cat: META.cat, diff: META.diff,
      tags: META.tags, author: META.author, cover: META.cover, updated: META.updated,
      chapters: chapters
    } };
    return chapters;
  }

  root.MIAO_JAVAX_ASSEMBLE = assemble;
  assemble();
})(typeof window !== "undefined" ? window : globalThis);
