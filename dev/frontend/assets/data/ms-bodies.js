/* 喵站 · 微软 MIT 课程正文挂载层
 *
 * 为什么要有这一份：ms-data.js 是生成器产的骨架（每课两个占位块），正文要一课一课填。
 * 让多个任务同时改 ms-data.js 一定会互相覆盖，所以改成：
 *   每课一个文件 assets/data/ms/<课程>-c<NN>.js，只往 window.MIAO_MS_BODY 上登记自己的块；
 *   这一份在 ms-data.js 之后加载，把有正文的课**整章换掉**占位块，没填的继续显示占位。
 * 好处：填一课，站上一课立刻有真内容；谁也没填的课不会假装完成。
 *
 * 正文文件必须保留的授权信息：每章第一块要写明译自哪个仓库哪个目录、Microsoft、MIT、原文地址。
 */
(function (root) {
  "use strict";
  /* 改成「可调用的装配函数」：按需加载之后，读者可能先点开 genai 再点开 ml，
     而脚本只会执行一次，所以每拉进一批逐课正文都要能再调一次这一步。
     已顶过的章打 __mounted 标记，第二次进来直接跳过，不会把出处块叠两遍。 */
  function mount() {
    var BODY = root.MIAO_MS_BODY || {};
    var packs = root.MIAO_MS || [];
    var hit = 0, pending = 0;
    packs.forEach(function (p) {
      (p.tutorial.chapters || []).forEach(function (c) {
        if (c.__mounted) { hit++; return; }
        var b = BODY[c.id];
        if (!b || !b.length) { pending++; return; }
        /* 整章替换，但强制保留出处块：正文文件漏写出处也不让 MIT 署名消失 */
        var src = c.blocks[0];
        c.blocks = (b[0] && /MIT|译自/.test(JSON.stringify(b[0]))) ? b.slice() : [src].concat(b);
        c.__mounted = true;
        hit++;
      });
    });
    root.MIAO_MS_FILLED = { filled: hit, pending: pending, total: hit + pending };
    return root.MIAO_MS_FILLED;
  }
  root.MIAO_MS_MOUNT = mount;
  mount();
  if (typeof console !== "undefined" && root.document === undefined) {
    console.log("[微软课程正文] 已填 " + root.MIAO_MS_FILLED.filled + " / " + root.MIAO_MS_FILLED.total +
      " 课，待填 " + root.MIAO_MS_FILLED.pending + " 课");
  }
})(typeof window !== "undefined" ? window : globalThis);
