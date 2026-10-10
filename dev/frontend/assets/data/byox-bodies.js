/* 喵站 · build-your-own-x 正文挂载层
 *
 * 为什么要有这一份：byox-data.js 是 dev/tools/byox-gen.js 产的骨架（30 门 / 359 章，每章只有两个占位块），
 * 正文要一章一章填。让多门任务同时改 byox-data.js 一定会互相覆盖，所以改成：
 *   每章一个文件 assets/data/byox/<类目>-c<NN>.js，只往 window.MIAO_BYOX_BODY 登记自己的块；
 *   这一份在 byox-data.js 之后、assets/js/data.js 之前加载，把有正文的章**整章换掉**占位块，没填的继续显示占位。
 * 好处：填一章，站上一章立刻有真内容；谁也没填的章不会假装完成。
 *
 * 授权口径（和微软那几门不一样）：build-your-own-x 本质是一份链接清单，359 条全指向别人的博客、视频、仓库。
 * 那些是第三方版权物，一个字都不搬。站内每章写的是**原创中文导读**：这一篇要你把什么东西从零造出来、
 * 拆开有哪几个部件、做的顺序、常见坑、任务清单，链接指回原文。
 *
 * 出处块：就是 byox-data.js 里那章现有的占位 tip（原文标题、语言、链接都在里面）。
 * 整章替换时强制保留它 —— 正文文件漏写出处也不许让「回源阅读的链接」消失；
 * 只有当正文第一块自己写明出处（含 原文链接 / 译自 / MIT）时，才允许把占位块换成正文的。
 */
(function (root) {
  "use strict";
  var BODY = root.MIAO_BYOX_BODY || {};
  var packs = root.MIAO_BYOX || [];
  var hit = 0, miss = [];
  packs.forEach(function (p) {
    (p.tutorial.chapters || []).forEach(function (c) {
      var b = BODY[c.id];
      if (!b || !b.length) { miss.push(c.id); return; }
      /* 整章替换，但强制保留出处块 */
      var src = c.blocks[0];
      /* 出处块开头那句「本篇待写：」在已填正文的章节里是废话 —— 换个说法，
         原文标题 / 语言 / 链接全部原样保留（挂载只动这一个前缀） */
      if (src && src.text) src = Object.assign({}, src, { text: src.text.replace("本篇待写：", "原文指路（本站导读见下）：") });
      c.blocks = (b[0] && /原文链接|译自|MIT/.test(JSON.stringify(b[0]))) ? b.slice() : [src].concat(b);
      hit++;
    });
  });
  root.MIAO_BYOX_FILLED = { filled: hit, pending: miss.length, total: hit + miss.length };
  if (typeof console !== "undefined" && root.document === undefined) {
    console.log("[BYOX 正文] 已填 " + hit + " / " + (hit + miss.length) + " 章，待填 " + miss.length + " 章");
  }
})(typeof window !== "undefined" ? window : globalThis);
