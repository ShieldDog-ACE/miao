/* 首屏主题预置：在样式表生效前就把主题与字号定好，
   否则深色用户会先看到一帧白底再跳到深色（闪烁）。
   判定规则与 app.js 的 applyTheme 保持一致：light | dark | auto。
   必须作为独立文件加载：站点 CSP 是 script-src 'self'，内联脚本会被拦。 */
(function () {
  try {
    var t = JSON.parse(localStorage.getItem("miao_theme") || '"auto"');
    if (t !== "light" && t !== "dark") {
      t = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
    }
    document.documentElement.setAttribute("data-theme", t);
    var fs = JSON.parse(localStorage.getItem("miao_fs") || "15");
    if (fs) document.documentElement.style.setProperty("--fs-base", fs + "px");
  } catch (e) { /* 本地存储不可用时保持默认浅色，不阻断页面 */ }
})();
