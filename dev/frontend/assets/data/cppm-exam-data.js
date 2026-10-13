/* 喵站 · C++ 掌握 考卷装配层（第九轮，T-22）
 *
 * 题包在 data/cppm-exam/p01.js…（window.MIAO_CPPM_EXAM_P01…），这里合成 MIAO_CPPM_EXAM。
 * 场次 cid 与章 id 同名（m82…m213）。
 */
(function (root) {
  "use strict";
  var PART_NAMES = Object.keys(root).filter(function (k) { return /^MIAO_CPPM_EXAM_P\d+$/.test(k); })
    .sort(function (a, b) { return parseInt(a.slice(16), 10) - parseInt(b.slice(16), 10); });
  var papers = [], seen = {};
  PART_NAMES.forEach(function (name) {
    var pack = root[name];
    if (!pack || !pack.papers) return;
    pack.papers.forEach(function (e) {
      if (!e || !e.cid) { console.error("[考卷装配 cppm] " + name + " 里有一场没有 cid"); return; }
      if (seen[e.cid]) console.error("[考卷装配 cppm] 场次重复：" + e.cid);
      seen[e.cid] = 1;
      papers.push(e);
    });
  });
  console.log("[装配] C++ 掌握考卷 " + papers.length + " 场（" + PART_NAMES.join(", ") || "无分部" + "）");
  root.MIAO_CPPM_EXAM = { pass: 60, papers: papers };
})(typeof window !== "undefined" ? window : globalThis);
