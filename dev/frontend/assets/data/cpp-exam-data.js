/* 喵站 · C++ 入门 考卷装配层（第九轮，T-22）
 *
 * 题包在 data/cpp-exam/p01.js… 每份 ≤5 场，各导出 window.MIAO_CPP_EXAM_P01… = { papers: [...] }；
 * 这里合成 window.MIAO_CPP_EXAM = { pass: 60, papers: [...] }，data.js 的 collectPapers 按 cid 取卷。
 * 一场卷的形状见任务书 §11.6.4（kind:"paper"，六种题型，各题 score 相加必须正好 100）。
 */
(function (root) {
  "use strict";
  var PART_NAMES = Object.keys(root).filter(function (k) { return /^MIAO_CPP_EXAM_P\d+$/.test(k); })
    .sort(function (a, b) { return parseInt(a.slice(15), 10) - parseInt(b.slice(15), 10); });
  var papers = [], seen = {};
  PART_NAMES.forEach(function (name) {
    var pack = root[name];
    if (!pack || !pack.papers) return;
    pack.papers.forEach(function (e) {
      if (!e || !e.cid) { console.error("[考卷装配 cpp] " + name + " 里有一场没有 cid"); return; }
      if (seen[e.cid]) console.error("[考卷装配 cpp] 场次重复：" + e.cid);
      seen[e.cid] = 1;
      papers.push(e);
    });
  });
  console.log("[装配] C++ 入门考卷 " + papers.length + " 场（" + PART_NAMES.join(", ") || "无分部" + "）");
  root.MIAO_CPP_EXAM = { pass: 60, papers: papers };
})(typeof window !== "undefined" ? window : globalThis);
