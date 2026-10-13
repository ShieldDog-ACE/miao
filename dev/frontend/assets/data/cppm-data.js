/* 喵站 · C++ 掌握 数据装配层（第九轮，T-22）
 *
 * 与 cpp-data.js 同构：占位在 data/cppm/legacy.js（m82…m213，课号沿用源稿 82–213），
 * 真正文在 data/cppm/p01.js…（window.MIAO_CPPM_P01…）。
 * 课号不重排：第 82 课就是源稿的 82 号文件，这样两门课的正文可以互相指「第 N 课」而不歧义。
 */
(function (root) {
  "use strict";

  var ORDER = [];
  for (var i = 82; i <= 213; i++) ORDER.push("m" + i);

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
  if (missing.length) console.error("[装配 c++] 这些章连占位都没有：" + missing.join(", "));
  if (typeof console !== "undefined" && console.log) {
    console.log("[装配] C++ 掌握 " + chapters.length + "/" + ORDER.length + " 章就位 · 真正文 " + fromReal + " · 占位 " + fromPlaceholder);
  }

  var meta = {
    id: "C++",
    title: "C++ 掌握",
    intro: "接「C++ 入门」往深里走：标准库容器与算法、类与 RAII、模板与泛型、数据结构与算法实战，共 132 课。每一课考过才算学完。",
    cat: "C++", diff: "掌握",
    tags: ["c++", "标准库", "数据结构", "每课有考试"],
    author: "喵站官方", cover: "/assets/img/covers/cppm.svg",
    updated: "2026-10-10"
  };

  root.MIAO_CPPM = { tutorial: {
    id: meta.id, title: meta.title, intro: meta.intro, cat: meta.cat, diff: meta.diff,
    tags: meta.tags, author: meta.author, cover: meta.cover, updated: meta.updated,
    chapters: chapters
  } };
})(typeof window !== "undefined" ? window : globalThis);
