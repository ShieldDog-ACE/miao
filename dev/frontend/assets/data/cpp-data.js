/* 喵站 · C++ 入门 数据装配层（第九轮，T-22）
 *
 * 结构照 python 那套（任务书 §11.6.3）：
 *   - 真正文：data/cpp/p00.js… 每份 ≤5 课，各导出 window.MIAO_CPP_P00… = { chapters: [...] }；
 *   - 这里按章 id 拼成整门课；章 id 必须在 ORDER（s01–s03 + c01…c81）里，乱 id 当场报错。
 *   - 占位稿 data/cpp/legacy.js 本轮删了：实测 84 章已全部由分部覆盖，它一章都不剩。
 *     装配层照旧认 window.MIAO_CPP_LEGACY，以后要挂回占位不用改这里。
 *
 * 分层加载这一轮改成「可反复调用」：数据层每拉进一份分部都要再拼一次，所以装配收进
 * assemble()，并挂成 window.MIAO_CPP_ASSEMBLE（site.js 的 assemble 字段指它）。
 * 拉一半时数据层置 window.MIAO_PARTIAL，缺章那条报错等拉齐之后再喊，免得读者对着满屏红字。
 *
 * 课号 = 源稿文件号（c01 对应 学习资料/C++入门/1_….cpp），正文里的「第 N 课」都按源稿课号算，
 * cpp-audit 的前向引用闸也按这个口径查。最前面三节 s01–s03 是「第 0 课」准备课（装编译器、
 * 选编辑器、读报错），不占源稿课号、也不排考试 —— 照 Python 那门课的第 0 课口径来。
 */
(function (root) {
  "use strict";

  var ORDER = ["s01", "s02", "s03"];
  for (var i = 1; i <= 81; i++) ORDER.push("c" + (i < 10 ? "0" + i : String(i)));

  var META = {
    id: "C++",
    title: "C++ 入门",
    intro: "从第一行 main() 走到能独立写出几百行的小程序：现代 C++（C++23）的 81 节必修课。每一课都从他的源稿出发，讲机制、带演示、有常见坑；课末考试过关这一课才算学完。",
    cat: "C++", diff: "入门",
    tags: ["c++", "零基础", "每课有考试"],
    author: "喵站官方", cover: "/assets/img/covers/cpp.svg",
    updated: "2026-10-10"
  };

  function assemble() {
    var PART_NAMES = Object.keys(root).filter(function (k) { return /^MIAO_CPP_P\d+$/.test(k); })
      .sort(function (a, b) { return parseInt(a.slice(10), 10) - parseInt(b.slice(10), 10); });

    var LEGACY = (root.MIAO_CPP_LEGACY || { chapters: [] }).chapters || [];
    var legacyById = {};
    LEGACY.forEach(function (c) { if (c && c.id) legacyById[c.id] = c; });

    var fresh = {};
    PART_NAMES.forEach(function (name) {
      var pack = root[name];
      if (!pack || !pack.chapters) return;
      pack.chapters.forEach(function (c) {
        if (!c || !c.id) { console.error("[装配 cpp] " + name + " 里有一章没有 id"); return; }
        if (fresh[c.id]) console.error("[装配 cpp] 章 id 重复：" + c.id + "（" + name + "）—— 同一章只许出现在一个分部里");
        if (ORDER.indexOf(c.id) < 0) console.error("[装配 cpp] " + name + " 里的 " + c.id + " 不在 ORDER（c01–c81）里");
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
    if (missing.length && !root.MIAO_PARTIAL) console.error("[装配 cpp] 这些章连占位都没有：" + missing.join(", "));
    if (typeof console !== "undefined" && root.document === undefined) {
      console.log("[装配] C++ 入门 " + chapters.length + "/" + ORDER.length + " 章就位 · 真正文 " + fromReal + " · 占位 " + fromPlaceholder);
    }

    root.MIAO_CPP = { tutorial: {
      id: META.id, title: META.title, intro: META.intro, cat: META.cat, diff: META.diff,
      tags: META.tags, author: META.author, cover: META.cover, updated: META.updated,
      chapters: chapters
    } };
    return chapters;
  }

  root.MIAO_CPP_ASSEMBLE = assemble;
  assemble();
})(typeof window !== "undefined" ? window : globalThis);
