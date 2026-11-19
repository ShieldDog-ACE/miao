/* 喵站 · Python 精通（pythonx）数据装配层
 *
 * 正文拆在 data/pythonx/p1.js、p2.js 里，各导出 window.MIAO_PYTHONX_Pn = { chapters: [...] }。
 * 这一份按章 id 拼成整门课；章 id 不在 ORDER（px01–px12）里当场报错。
 *
 * 分层加载：数据层每拉进一份分部就再拼一次，所以装配收进 assemble()，
 * 并挂成 window.MIAO_PYTHONX_ASSEMBLE（site.js 的 assemble 字段指它）。
 */
(function (root) {
  "use strict";

  var ORDER = ["px01","px02","px03","px04","px05","px06","px07","px08","px09","px10","px11","px12"];

  var META = {
    id: "pythonx",
    title: "Python 精通",
    intro: "接 Python 掌握，把脚本写成能上线的工程：类型、测试、异步、FastAPI、数据库，再走到 RAG 与 Agent；最后一课把大模型应用、数据、后端几条就业路线拆开讲。",
    cat: "python",
    diff: "精通",
    tags: ["Python","精通","工程化","大模型"],
    author: "喵站官方",
    cover: "/assets/img/covers/pythonx.svg",
    updated: "2026-11-11"
  };

  function assemble() {
    var PART_NAMES = Object.keys(root).filter(function (k) { return /^MIAO_PYTHONX_P\d+$/.test(k); })
      .sort(function (a, b) { return parseInt(a.match(/(\d+)$/)[1], 10) - parseInt(b.match(/(\d+)$/)[1], 10); });

    var fresh = {};
    PART_NAMES.forEach(function (name) {
      var pack = root[name];
      if (!pack || !pack.chapters) return;
      pack.chapters.forEach(function (c) {
        if (!c || !c.id) { console.error("[装配 pythonx] " + name + " 里有一章没有 id"); return; }
        if (fresh[c.id]) console.error("[装配 pythonx] 章 id 重复：" + c.id + "（" + name + "）");
        if (ORDER.indexOf(c.id) < 0) console.error("[装配 pythonx] " + name + " 里的 " + c.id + " 不在 ORDER（px01–px12）里");
        fresh[c.id] = c;
      });
    });

    var chapters = [], missing = [];
    ORDER.forEach(function (cid) {
      if (fresh[cid]) chapters.push(fresh[cid]);
      else missing.push(cid);
    });
    if (missing.length && !root.MIAO_PARTIAL) console.error("[装配 pythonx] 缺章：" + missing.join(", "));
    if (typeof console !== "undefined" && root.document === undefined) {
      console.log("[装配] Python 精通 " + chapters.length + "/" + ORDER.length + " 章就位");
    }

    root.MIAO_PYTHONX = { tutorial: {
      id: META.id, title: META.title, intro: META.intro, cat: META.cat, diff: META.diff,
      tags: META.tags, author: META.author, cover: META.cover, updated: META.updated,
      chapters: chapters
    } };
    return chapters;
  }

  root.MIAO_PYTHONX_ASSEMBLE = assemble;
  assemble();
})(typeof window !== "undefined" ? window : globalThis);
