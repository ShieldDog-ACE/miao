/* 首屏主题预置：在样式表生效前就把主题、风格与字号定好，
   否则深色用户会先看到一帧白底再跳到深色（闪烁）。
   判定规则与 app.js 的 applyTheme 保持一致：
     data-theme = light | dark | pink | auto（auto 解析成 light / dark）
     data-style = miao | mac（miao 是原版，mac 是苹果风）
   pink 只作旧数据兼容：齿轮里只有浅色 / 深色 / 跟随三档。
   必须作为独立文件加载：站点 CSP 是 script-src 'self'，内联脚本会被拦。 */
(function () {
  try {
    var t = JSON.parse(localStorage.getItem("miao_theme") || '"auto"');
    if (t !== "light" && t !== "dark" && t !== "pink") {
      t = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
    }
    document.documentElement.setAttribute("data-theme", t);

    var st = JSON.parse(localStorage.getItem("miao_style") || '"miao"');
    if (st !== "miao" && st !== "mac") st = "miao";
    document.documentElement.setAttribute("data-style", st);

    var fs = Number(JSON.parse(localStorage.getItem("miao_fs") || "18"));
    if (!isFinite(fs)) fs = 18;
    fs = Math.min(28, Math.max(14, Math.round(fs)));
    document.documentElement.style.setProperty("--fs-base", fs + "px");
  } catch (e) { /* 本地存储不可用时保持默认浅色，不阻断页面 */ }
})();
