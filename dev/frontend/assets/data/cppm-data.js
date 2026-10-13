/* 喵站 · C++ 掌握 数据装配层（第九轮，T-22）
 *
 * 与 cpp-data.js 同构：真正文在 data/cppm/p01.js…（window.MIAO_CPPM_P01…）；
 * 占位在 data/cppm/legacy.js（m82…m213，课号沿用源稿 82–213）—— 这门课还有 26 章
 * 只有占位（任务书 §17.4 欠的账），所以这份占位稿还活着，分层加载把它当成
 * 「那 26 章的分片」来拉，不必为一章占位把 67 KB 摊给所有人。
 * 课号不重排：第 82 课就是源稿的 82 号文件，这样两门课的正文可以互相指「第 N 课」而不歧义。
 *
 * 分层加载这一轮改成「可反复调用」：数据层每拉进一份分部都要再拼一次，所以装配收进
 * assemble()，并挂成 window.MIAO_CPPM_ASSEMBLE（site.js 的 assemble 字段指它）。
 * 拉一半时数据层置 window.MIAO_PARTIAL，缺章那条报错等拉齐之后再喊。
 */
(function (root) {
  "use strict";

  var ORDER = [];
  for (var i = 82; i <= 213; i++) ORDER.push("m" + i);

  var META = {
    id: "C++",
    title: "C++ 掌握",
    intro: "接「C++ 入门」往深里走：标准库容器与算法、类与 RAII、模板与泛型、数据结构与算法实战，共 132 课。每一课考过才算学完。",
    cat: "C++", diff: "掌握",
    tags: ["c++", "标准库", "数据结构", "每课有考试"],
    author: "喵站官方", cover: "/assets/img/covers/cppm.svg",
    updated: "2026-10-10"
  };

  function assemble() {
    var PART_NAMES = Object.keys(root).filter(function (k) { return /^MIAO_CPPM_P\d+$/.test(k); })
      .sort(function (a, b) { return parseInt(a.slice(11), 10) - parseInt(b.slice(11), 10); });

    var LEGACY = (root.MIAO_CPPM_LEGACY || { chapters: [] }).chapters || [];
    var legacyById = {};
    LEGACY.forEach(function (c) { if (c && c.id) legacyById[c.id] = c; });

    var fresh = {};
    PART_NAMES.forEach(function (name) {
      var pack = root[name];
      if (!pack || !pack.chapters) return;
      pack.chapters.forEach(function (c) {
        if (!c || !c.id) { console.error("[装配 cppm] " + name + " 里有一章没有 id"); return; }
        if (fresh[c.id]) console.error("[装配 cppm] 章 id 重复：" + c.id + "（" + name + "）");
        if (ORDER.indexOf(c.id) < 0) console.error("[装配 cppm] " + name + " 里的 " + c.id + " 不在 ORDER（m82–m213）里");
        fresh[c.id] = c;
      });
    });

    var chapters = [], fromReal = 0, fromPlaceholder = 0, missing = [];
    ORDER.forEach(function (id) {
      var c = fresh[id] || legacyById[id];
      if (!c) { missing.push(id); return; }
      if (fresh[id]) fromReal++; else fromPlaceholder++;
      chapters.push(c);
    });
    if (missing.length && !root.MIAO_PARTIAL) console.error("[装配 c++] 这些章连占位都没有：" + missing.join(", "));
    if (typeof console !== "undefined" && root.document === undefined) {
      console.log("[装配] C++ 掌握 " + chapters.length + "/" + ORDER.length + " 章就位 · 真正文 " + fromReal + " · 占位 " + fromPlaceholder);
    }

    root.MIAO_CPPM = { tutorial: {
      id: META.id, title: META.title, intro: META.intro, cat: META.cat, diff: META.diff,
      tags: META.tags, author: META.author, cover: META.cover, updated: META.updated,
      chapters: chapters
    } };
    return chapters;
  }

  root.MIAO_CPPM_ASSEMBLE = assemble;
  assemble();
})(typeof window !== "undefined" ? window : globalThis);
