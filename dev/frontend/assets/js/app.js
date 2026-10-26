/* 喵站 V1.2 · Hash 路由 + 视图 + 主题 + 本地状态
   V1.3 变更：整站去后端 —— 正文与题库改成 assets/data/ 下的静态文件（数据层 data.js），
   账号体系（登录 / 注册 / 好友 / 关注 / 申请老师 / 创作中心）整体删除，
   收藏、学习进度、考试成绩一律存本机 localStorage；「成为老师」挪到页脚，点开是邮箱。 */
(function () {
  "use strict";

  /* 教程正文与题库都在 assets/data/ 下，由 data.js 组装成 MIAO_DATA 与本地版 MIAO_API。
     代价写清楚：静态文件整包可下载，正文不再靠后端按窗下发；
     换来的是零依赖、离线可用、任何静态托管都能上。 */
  var DATA = window.MIAO_DATA || { categories: {}, tutorials: [] };
  var TUTS = DATA.tutorials || [];
  var API = window.MIAO_API;
  function examUi() { return window.MIAO_EXAM_UI || null; }   /* 考场界面脚本是进考场才注入的，每次现取 */

  /* 分类：层级对象 { 大类: [小类] } → 拍平成小类列表（供 chips/下拉/默认值） */
  function catList() {
    if (Array.isArray(DATA.categories)) return DATA.categories;
    var out = [];
    for (var k in DATA.categories) out = out.concat(DATA.categories[k] || []);
    return out;
  }

  /* ---------------- 本地数据对接层 ----------------
     方法名与以前对着后端那份保持一致（视图不用改），但没有任何网络请求：
     读数据走 data.js 的本地路由，收藏 / 进度 / 成绩走 localStorage。 */
  var BE = {
    ready: false,
    error: null,
    detail: null,
    loadMeta: function () {
      return API.get("/api/meta").then(function (d) {
        if (d.categories) DATA.categories = d.categories;
        /* 字母 / 音标 / 单词卡的数据不在首屏：点开那门课之后渲染时现从 window 上取（enPack） */
        return d;
      });
    },
    loadTutorials: function () {
      return API.get("/api/tutorials?size=50").then(function (d) {
        DATA.tutorials = d.items || [];
        TUTS = DATA.tutorials;
        return TUTS;
      });
    },
    /* 详情：目录 + 哪些章节排了考 + 本机考过哪些 */
    ensureTutorial: function (id) {
      return API.get("/api/tutorials/" + encodeURIComponent(id)).then(function (d) {
        var t = d.tutorial, i = -1;
        for (var k = 0; k < TUTS.length; k++) if (TUTS[k].id === t.id) i = k;
        t.locked = false;
        t.faved = !!d.faved;
        t.progress = d.progress || [];
        t.examIds = d.examIds || [];
        t.examPassed = d.examPassed || [];
        t.examResults = d.examScores || {};
        /* 考过的章节直接落到完成标记里：有考试的课，「考过」才是「学完」 */
        if (t.examPassed.length) {
          var arr = state.progress[t.id] || (state.progress[t.id] = []);
          t.examPassed.forEach(function (cid) { if (arr.indexOf(cid) < 0) arr.push(cid); });
          save();
        }
        if (i >= 0) TUTS[i] = Object.assign({}, TUTS[i], t); else TUTS.push(t);
        BE.detail = t;
        return t;
      });
    },
    find: function (id) {
      for (var i = 0; i < TUTS.length; i++) if (TUTS[i].id === id) return TUTS[i];
      return null;
    },
    /* 章节正文：本地数据一次给完整一章（没有网络往返，不必再按字数切窗） */
    chapterWin: {},
    loadChapter: function (id, cid) {
      return API.get("/api/tutorials/" + encodeURIComponent(id) + "/chapters/" + encodeURIComponent(cid))
        .then(function (d) {
          var t = BE.find(id);
          if (!t) { t = { id: id, title: d.title, chapters: [] }; TUTS.push(t); }
          if (!t.chapters) t.chapters = [];
          var found = false;
          for (var i = 0; i < t.chapters.length; i++) {
            if (t.chapters[i].id === d.chapter.id) { t.chapters[i] = d.chapter; found = true; }
          }
          if (!found) t.chapters.push(d.chapter);
          BE.chapterWin[id + ":" + cid] = d.window || null;
          return d.chapter;
        });
    },
    boot: function () {
      return BE.loadMeta()
        .then(function () { return BE.loadTutorials(); })
        .then(function () { BE.ready = true; })
        .catch(function (e) {
          BE.error = e;
          console.error("[本地数据没加载上]", e);
        });
    }
  };
  window.MIAO_BE = BE;

  /* ---------------- 状态 ---------------- */
  var store = {
    get: function (k, dft) {
      try { var v = localStorage.getItem("miao_" + k); return v === null ? dft : JSON.parse(v); }
      catch (e) { return dft; }
    },
    set: function (k, v) {
      try { localStorage.setItem("miao_" + k, JSON.stringify(v)); }
      catch (e) { console.warn("本地存储写入失败（可能超出配额）", k, e); }
    }
  };

  /* 只剩阅读体验与本机学习数据四样：换设备或清缓存会丢，这是不要后端的代价 */
  var state = {
    theme: store.get("theme", "auto"),           // light | dark | pink | auto
    progress: store.get("progress", {}),         // {tid: [cid]} 学完哪些课
    favs: store.get("favs", []),                 // [tid] 本机收藏（与 data.js 同一个键）
    fs: store.get("fs", 15)                      // 阅读字号
  };

  function save() {
    store.set("theme", state.theme);
    store.set("progress", state.progress); store.set("favs", state.favs);
    store.set("fs", state.fs);
  }

  /* ---------------- 工具 ---------------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------------- 正文行内标记 ----------------
     教程正文是纯文本（先 esc 再拼 HTML），这里只认三种写法：
       **重点**      → 加下划线（横杠在字的下面）
       网址          → 蓝色可点击，新窗口打开
       第 N 课       → 蓝色可点击，跳到本教程那一章（章号来自课程目录，认不出或同号多章就保持原样）
     渲染前先 setInlineRefs() 告诉它当前教程和章号表。 */
  var INLINE = { tutId: "", byNo: {} };
  function setInlineRefs(tutId, chapters) {
    var byNo = {};
    (chapters || []).forEach(function (c) {
      var m = /^第\s*(\d{1,2})\s*课/.exec(c.title || "");
      if (!m) return;
      var no = m[1];
      if (byNo[no] && byNo[no] !== c.id) byNo[no] = "";      // 三节「第 0 课」这种同号多章，不猜
      else byNo[no] = c.id;
    });
    INLINE = { tutId: tutId || "", byNo: byNo };
  }
  var INLINE_RE = new RegExp([
    "(\\*\\*[^*\\n]+\\*\\*)",                                       // 1 重点
    "((?:https?://|www\\.)[^\\s<>（），。；！？]+" +
      "|(?:[a-z][a-z0-9-]*\\.)+(?:org|com|cn|net|io|dev|edu)(?:/[^\\s<>（），。；]*)?)",   // 2 网址
    "(第\\s*(\\d{1,2})\\s*课)"                                       // 3 整段 / 4 课号
  ].join("|"), "g");
  function inlineHtml(text) {
    return esc(text).replace(INLINE_RE, function (all, em, url, ref, no) {
      if (em) return '<span class="em">' + em.slice(2, -2) + "</span>";
      if (url) {
        var href = /^https?:\/\//.test(url) ? url : "https://" + url;
        return '<a class="art-link" href="' + href + '" target="_blank" rel="noopener noreferrer">' + url + "</a>";
      }
      var id = INLINE.byNo[no];
      if (!id) return all;
      return '<a class="art-link" href="#/read/' + encodeURIComponent(INLINE.tutId) + "/" + encodeURIComponent(id) + '">' + all + "</a>";
    });
  }
  /* 开源平台式计数：1.2k / 12.8k / 1.3M */
  function fmtStat(n) {
    n = Number(n) || 0;
    if (n < 1000) return String(n);
    if (n < 1000000) {
      var k = (n / 1000).toFixed(1);
      return (k.slice(-2) === ".0" ? k.slice(0, -2) : k) + "k";
    }
    var m = (n / 1000000).toFixed(1);
    return (m.slice(-2) === ".0" ? m.slice(0, -2) : m) + "M";
  }
  /* 星标计数徽章（开源平台风格）：★ 1.2k */
  function starBadge(n, on, title) {
    return '<span class="star-badge' + (on ? " on" : "") + '"' + (title ? ' title="' + esc(title) + '"' : "") +
      '><i class="star-ico">★</i>' + fmtStat(n) + "</span>";
  }
  /* 站内资源地址：数据文件一律写 /assets/...，双击直开（file://）时要去掉开头的 / */
  function url(p) { return window.MIAO_URL ? window.MIAO_URL(p) : p; }
  function tut(id) { for (var i = 0; i < TUTS.length; i++) if (TUTS[i].id === id) return TUTS[i]; return null; }
  function chap(t, cid) { for (var i = 0; i < t.chapters.length; i++) if (t.chapters[i].id === cid) return t.chapters[i]; return null; }
  function doneSet(tid) { return state.progress[tid] || []; }
  function isDone(tid, cid) { return doneSet(tid).indexOf(cid) >= 0; }
  function tutProgress(t) { return t.chapters.length ? Math.round(doneSet(t.id).length / t.chapters.length * 100) : 0; }
  /* 卡片上那句「人在学」换成真在本机发生的事：学了几章 / 收藏没收藏 */
  function localNote(t) {
    var n = (state.progress[t.id] || []).length;
    if (!n) return "还没开始";
    var all = (t.chapters || []).length || t.chaps || 0;
    return all ? "本机已学 " + n + "/" + all + " 章" : "本机已学 " + n + " 章";
  }

  /* 账号体系（登录 / 注册 / 用户资料 / 关注与好友 / 创作中心）已随后端整体删除，此处不留占位 */

  /* ---------------- 元信息行（卡片 · 教程页顶 · 右侧信息卡共用） ----------------
     以前「入门」这个标签在三处长三种样子（卡片与教程页是 .badge 胶囊，而 .badge 又被
     考场面板的计数块占着，右侧信息卡干脆是纯文本），而且卡片那一行既不能缩
     也不会省略：实测要塞 261~350px，格子只有 221px，flex 就把文字压成上下两三行。
     现在一行摆平、从左到右：难度徽章与「共 N 章」永远不缩，作者先缩、进度次之，缩不下的
     出省略号。 */
  function diffBadge(t) { return '<span class="diff">' + esc(t.diff || "未标难度") + "</span>"; }
  function metaSep() { return '<span class="m-sep">·</span>'; }
  /* opts.author=false 的场合（首页卡片）不摆作者：格子最窄只有 221px，而
     「Microsoft 原文 · 喵站译」独占 213px —— 省略到底就剩「Mi…」，摆一个读不出
     东西的位置不如不摆。作者全名在教程页顶的元信息行与右侧信息卡都有。 */
  function tutMeta(t, opts) {
    opts = opts || {};
    var n = (t.chapters || []).length || t.chaps || 0;
    var bits = ['<span class="m-item m-fix">共 ' + n + " 章</span>", '<span class="m-item">' + esc(localNote(t)) + "</span>"];
    if (opts.author) bits.push('<span class="m-item" title="' + esc(t.author) + '">' + esc(t.author) + "</span>");
    if (opts.tail) bits.push(opts.tail);
    return '<div class="t-meta">' + diffBadge(t) + bits.join(metaSep()) + "</div>";
  }

  function toast(msg) {
    var box = $("#toast");
    var el = document.createElement("div");
    el.className = "toast-item"; el.textContent = msg;
    box.appendChild(el);
    setTimeout(function () { el.style.opacity = "0"; el.style.transition = "opacity .4s"; }, 1800);
    setTimeout(function () { el.remove(); }, 2300);
  }

  /* 直接前往登录页（带回跳地址） */


  /* 登录引导弹层（游客受限动作） */


  /* 编辑资料弹层：头像（上传 / 预设底色）+ 昵称 + 个人描述 */


  /* ---------------- 主题 ---------------- */
  /* matchMedia 缺失时（老浏览器 / 测试环境）降级为浅色，避免整站初始化中断 */
  var mq = (typeof window.matchMedia === "function") ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  /* 手改 localStorage 塞进一个不存在的主题名时，data-theme 会变成谁都不匹配的串，
     页面静默退回 :root 且开关上看不出问题 —— 所以这里认表，不认就直接当 auto。 */
  var THEME_OK = { light: 1, dark: 1, pink: 1, auto: 1 };

  function applyTheme() {
    var t = THEME_OK[state.theme] ? state.theme : "auto";
    if (t === "auto") {
      t = (mq && mq.matches) ? "dark" : "light";
    }
    document.documentElement.setAttribute("data-theme", t);
    document.documentElement.style.setProperty("--fs-base", state.fs + "px");
    $all("#segInMenu button").forEach(function (b) { b.classList.toggle("on", b.dataset.t === state.theme); });
    $all("#segFs button").forEach(function (b) { b.classList.toggle("on", Number(b.dataset.fs) === state.fs); });
    $all(".theme-card").forEach(function (c) { c.classList.toggle("on", c.dataset.t === state.theme); });
  }
  function setTheme(t) { state.theme = t; save(); applyTheme(); }
  if (mq && mq.addEventListener) mq.addEventListener("change", function () {
    if (state.theme === "auto") applyTheme();
  });

  /* ---------------- 导航栏 ---------------- */
  var GEAR_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>';



  /* 导航栏里「首页」右边那四个入口（视频 / 考试 / 幻灯片 / 公式化学习）的点击：
     这一版只挂入口、不建页面 —— 点了给一句到位的提示，不留死链，也不假装有内容。
     以后内容页做好，把它们在 index.html 里换成真路由即可，样式不用动。 */
  function bindNavSoon() {
    $all(".nav-links .nav-soon").forEach(function (a) {
      a.onclick = function (e) {
        e.preventDefault();
        toast(a.dataset.soon + "：功能筹备中，上线后会第一时间放到这里喵~");
      };
    });
  }

  function renderNavRight() {
    $("#navRight").innerHTML =
      '<div class="drop-wrap">' +
      '<button class="icon-btn" id="gearBtn" title="设置" aria-label="设置">' + GEAR_SVG + "</button>" +
      '<div class="dropdown hidden" id="gearMenu">' +
      /* 设置里先分「通用设置」一组：公告挪进这里 —— 以前它跟主题/字号并列摆在最外面，
         读者会以为公告是外观设置的一部分。 */
      '<div class="dd-title">通用设置</div>' +
      '<a class="dd-item" id="annItem">公告</a>' +
      '<div class="dd-sep"></div>' +
      '<div class="dd-title">外观主题</div>' +
      '<div class="seg" id="segInMenu">' +
      '<button data-t="light" title="苹果 / DeepSeek 那套中性灰阶 + 蓝">浅色</button>' +
      '<button data-t="dark" title="VS Code / Trae 那套灰阶 + 蓝">深色</button>' +
      '<button data-t="pink" title="站点原本的粉色">粉色</button>' +
      '<button data-t="auto" title="按系统的明暗偏好走，只会是浅色或深色">跟随</button>' +
      "</div>" +
      '<div class="dd-title">正文字号</div>' +
      '<div class="seg" id="segFs">' +
      '<button data-fs="14">小</button><button data-fs="15">标准</button><button data-fs="17">大</button>' +
      "</div>" +
      '<div class="dd-sep"></div>' +
      '<div class="dd-title muted">收藏、学习进度与考试成绩只存在这台设备的浏览器里</div>' +
      "</div></div>";
    bindDrops();
    applyTheme();
  }

  function bindDrops() {
    var gm = $("#gearMenu"), gb = $("#gearBtn");
    if (gb) gb.onclick = function (e) { e.stopPropagation(); gm.classList.toggle("hidden"); };
    $all("#segInMenu button").forEach(function (b) {
      b.onclick = function () { setTheme(b.dataset.t); toast("主题：" + b.textContent); };
    });
    $all("#segFs button").forEach(function (b) {
      b.onclick = function () {
        state.fs = Number(b.dataset.fs); save(); applyTheme();
        toast("正文字号：" + b.textContent);
      };
    });
    var ann = $("#annItem");
    if (ann) ann.onclick = function (e) {
      e.stopPropagation();
      $all(".dropdown").forEach(function (d2) { d2.classList.add("hidden"); });
      API.get("/api/announcements").then(function (d) {
        var items = (d.items || []).map(function (a) {
          return '<div class="set-card" style="margin:0 0 12px"><b>' + esc(a.title) + "</b>" +
            (a.created_at ? '<div class="muted small">' + new Date(a.created_at).toLocaleString() + "</div>" : "") +
            '<div style="margin-top:6px">' + esc(a.body) + "</div></div>";
        }).join("") || '<div class="empty">暂无公告</div>';
        var mask = document.createElement("div");
        mask.className = "mask";
        mask.innerHTML = '<div class="modal card" style="width:460px;text-align:left"><h3>站内公告</h3>' + items +
          '<div style="display:flex;justify-content:flex-end;margin-top:10px"><button class="btn btn-primary btn-sm" id="annClose">知道了</button></div></div>';
        document.body.appendChild(mask);
        $("#annClose", mask).onclick = function () { mask.remove(); };
        mask.onclick = function (ev) { if (ev.target === mask) mask.remove(); };
      }).catch(function (e) { toast(e.message || "公告加载失败"); });
    };
  }
  /* 页脚「成为老师」：没有账号与后台了，投稿与纠错直接留一个邮箱 */
  function openTeacher() {
    var c = (API._local && API._local.site && API._local.site.contact) || {};
    var mail = c.email || "m15781851831@163.com";
    var pop = $("#teacherPop");
    pop.className = "mask";
    pop.innerHTML =
      '<div class="modal card sponsor-pop" onclick="event.stopPropagation()">' +
      "<h3>成为老师 · 投稿与纠错</h3>" +
      '<p class="sub">喵站不用注册、也没有后台管理：想投稿教程、纠错或提建议，直接写信给我。</p>' +
      '<div class="mail-line"><b id="teacherMail">' + esc(mail) + "</b>" +
      '<button class="btn btn-ghost btn-sm copy-btn" type="button" data-code="' + esc(mail) + '">复制</button>' +
      '<a class="btn btn-primary btn-sm" href="mailto:' + esc(mail) + '">发邮件</a></div>' +
      '<p class="muted small">投稿最好带：这一课讲什么、能跑的示例、常见坑、课后任务</p>' +
      '<button class="btn btn-ghost btn-sm" id="tpClose" type="button">关闭</button></div>';
    $("#tpClose", pop).onclick = function () { pop.className = "hidden"; pop.innerHTML = ""; };
    pop.onclick = function (e) { if (e.target === pop) { pop.className = "hidden"; pop.innerHTML = ""; } };
    bindCopy();
  }

  /* 赞助弹层：二维码图只有在点击「赞助」时才加载（懒加载，平时不占请求） */
  function openSponsor() {
    var pop = $("#sponsorPop");
    pop.className = "mask";
    pop.innerHTML =
      '<div class="modal card sponsor-pop" onclick="event.stopPropagation()">' +
      "<h3>赞助喵站</h3>" +
      '<p class="sub">所有内容永久免费。觉得有帮助的话，可以扫码请我喝杯奶茶喵～</p>' +
      '<div class="sponsor-qr" id="sponsorQr"><img src="assets/img/donate-qr.png" alt="微信收款码"></div>' +
      '<p class="muted small">微信扫码 · 金额随意 · 感谢每一杯奶茶</p>' +
      '<button class="btn btn-ghost btn-sm" id="spClose">关闭</button></div>';
    /* 懒加载：img 是在用户点击「赞助」后才被创建的，平时页面不包含这张图，零请求 */
    $("#spClose", pop).onclick = function () { pop.className = "hidden"; pop.innerHTML = ""; };
    pop.onclick = function (e) { if (e.target === pop) { pop.className = "hidden"; pop.innerHTML = ""; } };
  }

  document.addEventListener("click", function (e) {
    $all(".dropdown").forEach(function (d) { d.classList.add("hidden"); });
    var sp = e.target && e.target.closest ? e.target.closest("#sponsorBtn") : null;
    if (sp) { e.preventDefault(); openSponsor(); return; }
    var tb = e.target && e.target.closest ? e.target.closest("#teacherBtn") : null;
    if (tb) { e.preventDefault(); openTeacher(); return; }
    var eye = e.target && e.target.closest ? e.target.closest("[data-eye]") : null;
    if (eye) {
      e.preventDefault(); e.stopPropagation();
      var tt = tut(eye.dataset.eye);
      if (tt) openImagePreview(tt);
      return;
    }

  });

  /* ---------------- 通用组件 ---------------- */
  function coverCls(t) { return "cover cg-" + t.id; }

  /* 三处展示图：thumb=我的作品缩略图 / card=首页卡片图 / hero=教程页完整图
     取值链：对应字段 → cover → 首字母色块 */
  function coverSrc(t, kind) {
    if (kind === "thumb") return t.thumb || t.cover || "";
    if (kind === "hero") return t.hero || t.cover || "";
    return t.cover || "";
  }
  function coverHtml(t, kind) {
    var src = coverSrc(t, kind || "card");
    var cls = coverCls(t) + (kind === "thumb" ? " cv-thumb" : "");
    if (src) {
      return '<div class="' + cls + ' has-img"><img class="cover-img" src="' + esc(url(src)) + '" alt="' + esc(t.title) + ' 展示图" loading="lazy"></div>';
    }
    return '<div class="' + cls + '">' + esc(t.title.slice(0, 2).toUpperCase()) + "</div>";
  }

  function tutCard(t) {
    var href = "#/tutorial/" + t.id;
    return '<div class="t-card card">' +
      '<a class="t-open" href="' + href + '" aria-label="打开教程 ' + esc(t.title) + '"></a>' +
      coverHtml(t, "card") +
      '<div class="t-body"><h3><a class="t-title" href="' + href + '">' + esc(t.title) + "</a></h3>" +
      '<p class="intro">' + esc(t.intro) + "</p>" +
      tutMeta(t, state.favs.indexOf(t.id) >= 0
        ? { tail: '<span class="star-badge on" title="已收藏在本机"><i class="star-ico">★</i>已收藏</span>' } : null) +
      "</div></div>";
  }

  /* 首页：完整图缩放预览（保留原卡片展示图，额外提供缩放查看完整图） */
  function openImagePreview(t) {
    var src = coverSrc(t, "hero");
    if (!src) { toast("该教程尚未上传完整图"); return; }
    var mask = document.createElement("div");
    mask.className = "mask img-mask";
    mask.innerHTML =
      '<div class="img-view">' +
      '<div class="img-stage"><img src="' + esc(url(src)) + '" alt="' + esc(t.title) + ' 完整图"></div>' +
      '<div class="img-bar"><span>' + esc(t.title) + " · 完整图（缩放预览）</span>" +
      '<span class="img-ops"><button class="btn btn-ghost btn-sm" id="ivZoom">放大</button>' +
      '<button class="btn btn-primary btn-sm" id="ivClose">关闭</button></span></div>' +
      "</div>";
    document.body.appendChild(mask);
    var zoomed = false;
    $("#ivZoom", mask).onclick = function () {
      zoomed = !zoomed;
      var im = $("img", mask);
      im.style.transform = zoomed ? "scale(1.6)" : "scale(1)";
      this.textContent = zoomed ? "还原" : "放大";
    };
    $("#ivClose", mask).onclick = function () { mask.remove(); };
    mask.onclick = function (e) { if (e.target === mask) mask.remove(); };
  }

  /* 提示框配色：正文 tip 块写 {"t":"tip","color":"green"} 即可换色，不写就跟随主题粉。
     这里只留合法值清单 —— 创作中心那个带色点的选择盘已随后端删除，色点类名一并清掉了。 */
  var TIP_COLORS = ["", "green", "blue", "amber", "gray"];
  function tipColorOf(b) {
    for (var i = 0; i < TIP_COLORS.length; i++) if (TIP_COLORS[i] === b.color) return b.color;
    return "";
  }
  function tipCls(b) { var c = tipColorOf(b); return c ? " tipc-" + c : ""; }

  /* ---------------- 阅读页代码高光（rd-*） ----------------
     考场 IDE 有一把高光尺，阅读页的 code 块以前是纯文本。这里补一把小尺：
     在「原始文本」上扫描、按段 esc() 后包 span —— 绝不在已转义的字符串上动正则，
     也不试图理解语义，认不出的字符原样吐。C++ / shell 两把尺，别的语言照旧纯文本。 */
  var CPP_KW = {};
  ("alignas alignof and asm auto bool break case catch char char8_t char16_t char32_t class co_await co_yield " +
   "compl concept const consteval constexpr constinit const_cast continue co_return decltype default delete do " +
   "double dynamic_cast else enum explicit export extern false float for friend goto if inline int long mutable " +
   "namespace new noexcept not nullptr operator or private protected public register reinterpret_cast requires " +
   "return short signed sizeof static static_assert static_cast struct switch template this thread_local throw " +
   "true try typedef typeid typename union unsigned using virtual void volatile wchar_t while xor").split(" ").forEach(function (w) { CPP_KW[w] = 1; });
  var CPP_TYPES = {};
  ("size_t ssize_t int8_t int16_t int32_t int64_t uint8_t uint16_t uint32_t uint64_t string_view ostream istream").split(" ").forEach(function (w) { CPP_TYPES[w] = 1; });
  var SH_KW = {};
  ("if then else elif fi for while until do done case esac in function return exit local export readonly").split(" ").forEach(function (w) { SH_KW[w] = 1; });

  function hlSpan(cls, text) { return cls ? '<span class="' + cls + '">' + esc(text) + "</span>" : esc(text); }

  function hlCpp(code) {
    var out = "", i = 0, n = code.length;
    function nameAt(p) {
      var m = /^[A-Za-z_]\w*/.exec(code.slice(p));
      return m ? m[0] : "";
    }
    while (i < n) {
      var c = code[i];
      /* 行注释 / 块注释 */
      if (c === "/" && code[i + 1] === "/") { var e1 = code.indexOf("\n", i); if (e1 < 0) e1 = n; out += hlSpan("rd-com", code.slice(i, e1)); i = e1; continue; }
      if (c === "/" && code[i + 1] === "*") { var e2 = code.indexOf("*/", i + 2); e2 = e2 < 0 ? n : e2 + 2; out += hlSpan("rd-com", code.slice(i, e2)); i = e2; continue; }
      /* 预处理：行首（可有空白）的 # 整段吃到行尾 */
      if (c === "#") {
        var ls = code.lastIndexOf("\n", i - 1) + 1;
        if (/^\s*$/.test(code.slice(ls, i))) { var e3 = code.indexOf("\n", i); if (e3 < 0) e3 = n; out += hlSpan("rd-pre", code.slice(i, e3)); i = e3; continue; }
      }
      /* 字符串 / 字符字面量（含转义；原始串 R"( )" 按普通串处理，界符内的 " 会截断 —— 课文代码不这么写） */
      if (c === '"' || c === "'") {
        var j = i + 1;
        while (j < n && code[j] !== c && code[j] !== "\n") { if (code[j] === "\\") j++; j++; }
        if (j < n && code[j] === c) { out += hlSpan("rd-str", code.slice(i, j + 1)); i = j + 1; continue; }
      }
      /* 数字（含 1.5f、0x1F、1e-3） */
      if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(code[i + 1] || ""))) {
        var m1 = /^(?:0[xX][0-9a-fA-F']+|\d[\d']*(?:\.[\d']*)?(?:[eE][+-]?\d+)?[uUlLfF]*)/.exec(code.slice(i));
        if (m1 && m1[0]) { out += hlSpan("rd-num", m1[0]); i += m1[0].length; continue; }
      }
      /* 名字：关键字 / 类型 / 命名空间与类（后面跟 ::）/ 函数调用（后面跟 (） */
      var nm = nameAt(i);
      if (nm) {
        var after = i + nm.length;
        var rest = code.slice(after);
        if (CPP_KW[nm]) out += hlSpan("rd-kw", nm);
        else if (/^\s*::/.test(rest) || CPP_TYPES[nm]) out += hlSpan("rd-cls", nm);
        else if (/^\s*\(/.test(rest)) out += hlSpan("rd-fn", nm);
        else out += esc(nm);
        i = after; continue;
      }
      out += esc(c); i++;
    }
    return out;
  }

  function hlShell(code) {
    return code.split("\n").map(function (line) {
      var out = "", i = 0, n = line.length;
      while (i < n) {
        var c = line[i];
        if (c === "#") { out += hlSpan("rd-com", line.slice(i)); break; }
        if (c === '"' || c === "'") {
          var j = i + 1;
          while (j < n && line[j] !== c) { if (c === '"' && line[j] === "\\") j++; j++; }
          if (j < n) { out += hlSpan("rd-str", line.slice(i, j + 1)); i = j + 1; continue; }
        }
        var m = /^[A-Za-z_][\w.-]*/.exec(line.slice(i));
        if (m) {
          var w = m[0];
          if (SH_KW[w]) out += hlSpan("rd-kw", w);
          else if (i === 0 || /^\s/.test(line[i - 1] || " ")) out += hlSpan("rd-fn", w);
          else out += esc(w);
          i += w.length; continue;
        }
        out += esc(c); i++;
      }
      return out;
    }).join("\n");
  }

  /* ---------------- C 族语言共用一把刷子（Python / JavaScript 都走它） ----------------
   * 只认四类东西：注释、字符串、数字、名字（关键字 / 类型 / 调用）。
   * 剥掉 <span> 之后必须和原文逐字相等 —— 高光是往原文上叠色，不是重写。
   * cfg: {line, block, triple, prefixes, tpl, kw, ty, bi} */
  function hlCish(code, cfg) {
    var out = "", i = 0, n = code.length, lastWord = "";
    function put(cls, t) { out += hlSpan(cls, t); }
    function strEnd(from) {
      /* 返回字符串字面量的结束下标（认不到就回 -1，宁可不上色也别染错一片） */
      var p = from, pre = 0;
      if (cfg.prefixes) { while (p < n && cfg.prefixes.indexOf(code[p]) >= 0 && pre < 3) { p++; pre++; } }
      var q = code[p];
      if (q !== '"' && q !== "'" && !(q === "`" && cfg.tpl)) return -1;
      var triple = cfg.triple && code[p + 1] === q && code[p + 2] === q;
      var close = triple ? q + q + q : q, j = p + close.length;
      while (j < n) {
        if (code[j] === "\\") { j += 2; continue; }
        if (code.substr(j, close.length) === close) return j + close.length;
        if (code[j] === "\n" && !triple) return -1;
        j++;
      }
      return triple ? n : -1;                       /* 三引号没关上：吃到结尾，至少不断行 */
    }
    while (i < n) {
      var c = code[i];
      if (cfg.line === "#" && c === "#") { var e1 = code.indexOf("\n", i); if (e1 < 0) e1 = n; put("rd-com", code.slice(i, e1)); i = e1; continue; }
      if (cfg.line === "//" && c === "/" && code[i + 1] === "/") { var e2 = code.indexOf("\n", i); if (e2 < 0) e2 = n; put("rd-com", code.slice(i, e2)); i = e2; continue; }
      if (cfg.block && c === "/" && code[i + 1] === "*") { var e3 = code.indexOf("*/", i + 2); e3 = e3 < 0 ? n : e3 + 2; put("rd-com", code.slice(i, e3)); i = e3; continue; }
      var se = strEnd(i);
      if (se > i) {
        var raw = code.slice(i, se);
        var fpre = /^([rRbBuUfF]*)(['"`]{1,3})/.exec(raw);
        var isF = cfg.prefixes && /[fF]/.test(fpre[1]);        /* 只看引号前的真前缀，'f{x}' 这种普通串不算 */
        var isTpl = cfg.tpl && raw.indexOf("${") >= 0;
        if (!isF && !isTpl) { put("rd-str", raw); i = se; continue; }
        var b0 = fpre[0].length, b1 = se - fpre[2].length;
        put("rd-str", raw.slice(0, b0));
        var seg = b0, p = b0;
        while (p < b1) {
          if (raw[p] === "\\") { p += 2; continue; }
          if (raw[p] !== "{" && raw[p] !== "$") { p++; continue; }
          var q = p, dep = 0;
          if (raw[p] === "$" && raw[p + 1] === "{") q = p + 1; else if (raw[p] === "{") q = p + 1; else { p++; continue; }
          dep = 1; q++;
          while (q < b1 && dep > 0) { if (raw[q] === "\\") { q += 2; continue; } if (raw[q] === "{") dep++; else if (raw[q] === "}") dep--; q++; }
          put("rd-str", raw.slice(seg, p));
          put("rd-pre", raw.slice(p, Math.min(q, b1)));        /* {expr} / ${expr} 整段单独一个色 */
          p = seg = Math.min(q, b1);
        }
        put("rd-str", raw.slice(seg, b1));
        put("rd-str", raw.slice(b1));
        i = se; continue;
      }
      if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(code[i + 1] || ""))) {
        var mn = /^(?:0[xXbBoO][0-9a-fA-F_']+|(?:\d[\d_]*\.(?:[\d_]*)?|\.\d[\d_]*|\d[\d_]*)(?:[eE][+-]?\d+)?[jJlLfF]?)/.exec(code.slice(i));
        if (mn && mn[0]) { put("rd-num", mn[0]); i += mn[0].length; continue; }
      }
      if (cfg.triple && c === "@" && /^\s*@[\w.]/.test(code.slice(Math.max(0, code.lastIndexOf("\n", i - 1) + 1), i + 40))) {
        var md = /@[\w.\u0080-\uffff]+/.exec(code.slice(i));
        if (md) { put("rd-fn", md[0]); i += md[0].length; continue; }
      }
      var nm = /^[^\W\d][\w\u0080-\uffff]*/.exec(code.slice(i));
      if (nm) {
        var w = nm[0], rest = code.slice(i + w.length), cls = null;
        if (cfg.ty && cfg.ty[w]) cls = "rd-cls";
        else if (cfg.kw && cfg.kw[w]) cls = "rd-kw";
        else if (cfg.bi && cfg.bi[w]) cls = "rd-cls";          /* 语言自带的东西统一走类型色 */
        else if (lastWord === "def" || lastWord === "class" || lastWord === "function") cls = "rd-fn";
        else if (/^\s*\(/.test(rest)) cls = "rd-fn";
        i += w.length; lastWord = (cfg.kw && cfg.kw[w]) || (cfg.ty && cfg.ty[w]) ? w : "";
        put(cls, w);
        continue;
      }
      out += esc(c); i++;                            /* 兜底：原样吐，绝不吞字符 */
    }
    return out;
  }

  var PY_KW = {}, PY_TY = {}, PY_BI = {};
  ("and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield match case").split(" ").forEach(function (w) { PY_KW[w] = 1; });
  ("True False None self cls").split(" ").forEach(function (w) { PY_TY[w] = 1; });
  ("print len range input int str float bool list tuple dict set type isinstance issubclass sum max min abs round sorted reversed open enumerate zip repr any all map filter next iter frozenset bytes bytearray id hash chr ord divmod pow format super getattr setattr hasattr callable vars dir eval").split(" ").forEach(function (w) { PY_BI[w] = 1; });

  function hlPy(code) {
    return hlCish(code, { line: "#", block: false, triple: true, prefixes: "rRbBuUfF", kw: PY_KW, ty: PY_TY, bi: PY_BI });
  }

  var JS_KW = {}, JS_TY = {}, JS_BI = {};
  ("break case catch class const continue debugger default delete do else export extends finally for function if import in instanceof let new return super switch this throw try typeof var void while with yield async await of static get set").split(" ").forEach(function (w) { JS_KW[w] = 1; });
  ("true false null undefined NaN Infinity this super").split(" ").forEach(function (w) { JS_TY[w] = 1; });
  ("console document window Math JSON Object Array String Number Promise Date fetch alert setTimeout setInterval require module exports process localStorage").split(" ").forEach(function (w) { JS_BI[w] = 1; });

  function hlJs(code) {
    return hlCish(code, { line: "//", block: true, tpl: true, kw: JS_KW, ty: JS_TY, bi: JS_BI });
  }

  /* ---------------- HTML：标签名 / 属性名 / 属性值 / 注释 / DOCTYPE ---------------- */
  function hlHtml(code) {
    var out = "", i = 0, n = code.length;
    while (i < n) {
      var lt = code.indexOf("<", i);
      if (lt < 0) { out += esc(code.slice(i)); break; }
      out += esc(code.slice(i, lt));
      if (code.substr(lt, 4) === "<!--") {                        /* 注释吃到 --> */
        var e = code.indexOf("-->", lt + 4); e = e < 0 ? n : e + 3;
        out += hlSpan("rd-com", code.slice(lt, e)); i = e; continue;
      }
      var gt = code.indexOf(">", lt); if (gt < 0) gt = n;
      var tag = code.slice(lt, gt + 1);
      var head = /^<(\/?)(!?\w[\w-]*)/.exec(tag);
      if (!head) { out += esc(tag); i = gt + 1; continue; }
      out += esc(head[1] === "!" ? tag.slice(0, 2) : head[1] ? "</" : "<");
      out += hlSpan(/^![A-Za-z]/.test(tag) ? "rd-pre" : "rd-tag", head[2]);
      var p = (head[1] === "!" ? 2 : head[1] ? 2 : 1) + head[2].length;
      while (p < tag.length) {
        var ch = tag[p];
        if (ch === '"' || ch === "'") {                            /* 属性值整串 */
          var q = tag.indexOf(ch, p + 1); q = q < 0 ? tag.length : q + 1;
          out += hlSpan("rd-str", tag.slice(p, q)); p = q; continue;
        }
        var an = /^[A-Za-z_:@.\-][\w:.\-@]*/.exec(tag.slice(p));
        if (an) { out += hlSpan("rd-atr", an[0]); p += an[0].length; continue; }
        out += esc(ch); p++;
      }
      i = gt + 1;
    }
    return out;
  }

  /* ---------------- CSS：at 规则 / 选择器 / 属性名 / 值里的数字串与函数 ---------------- */
  function hlCss(code) {
    return code.split("\n").map(function (line) {
      if (/^\s*(\/\*|\*)/.test(line)) return hlSpan("rd-com", line);
      var at = /^(\s*)(@[\w-]+)(.*)$/.exec(line);
      if (at) return esc(at[1]) + hlSpan("rd-pre", at[2]) + hlCssValue(at[3]);
      var m = /^(\s*)([^:{}]*?)(\s*)([:{}])(.*)$/.exec(line);
      if (!m) return hlCssValue(line);
      var head = m[2] + m[3], isProp = m[4] === ":";
      var headHtml = isProp ? hlCssSelector(head, true) : hlCssSelector(head, false);
      return esc(m[1]) + headHtml + esc(m[4]) + (isProp ? hlCssValue(m[5]) : esc(m[5]));
    }).join("\n");
  }
  /* 选择器（.类 #id :伪类 标签）与属性名共用一把行内刷子；属性名整段走 rd-atr */
  function hlCssSelector(s, asProp) {
    if (asProp) { var t = s.replace(/\s+$/, ""); return (t ? hlSpan("rd-atr", t) : "") + esc(s.slice(t.length)); }
    var out = "", i = 0, n = s.length;
    while (i < n) {
      var m = /^([.#][\w-]+|::?[\w-]+|[\w-]+|[*>+,~])/.exec(s.slice(i));
      if (!m) { out += esc(s[i]); i++; continue; }
      var t = m[0];
      if (/^[.#]/.test(t)) out += hlSpan("rd-cls", t);
      else if (/^:/.test(t)) out += hlSpan("rd-kw", t);
      else if (/^[*>+,~]$/.test(t)) out += esc(t);
      else out += hlSpan("rd-tag", t);
      i += t.length;
    }
    return out;
  }
  function hlCssValue(s) {
    var out = "", i = 0, n = s.length;
    while (i < n) {
      var m = /^('[^']*'|"[^"]*"|#[0-9a-fA-F]{3,8}|-?(?:\d+\.\d*|\.\d+|\d+)(?:px|rem|em|%|vh|vw|s|ms|deg|fr|ch)?|[A-Za-z_-][\w-]*)/.exec(s.slice(i));
      if (!m) { out += esc(s[i]); i++; continue; }
      var t = m[0];
      if (/^['"]/.test(t)) out += hlSpan("rd-str", t);
      else if (/^#[0-9a-fA-F]/.test(t) || /^-?[\d.]/.test(t)) out += hlSpan("rd-num", t);
      else if (/^(var|calc|rgb|rgba|hsl|hsla|url|translate|translateX|translateY|translate3d|scale|rotate|linear-gradient|radial-gradient|clamp|min|max|attr|!important)$/.test(t)) out += hlSpan("rd-fn", t);
      else out += esc(t);
      i += t.length;
    }
    return out;
  }

  /* ---------------- JSON：键 / 串 / 数字 / true·false·null ---------------- */
  function hlJson(code) {
    var out = "", i = 0, n = code.length;
    while (i < n) {
      var c = code[i];
      if (c === '"') {
        var j = i + 1;
        while (j < n && code[j] !== '"') { if (code[j] === "\\") j++; j++; }
        var raw = code.slice(i, Math.min(j + 1, n));
        var isKey = /^\s*:/.test(code.slice(j + 1));
        out += hlSpan(isKey ? "rd-atr" : "rd-str", raw);
        i = j + 1; continue;
      }
      if (/[0-9-]/.test(c)) {
        var mn = /^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(code.slice(i));
        if (mn) { out += hlSpan("rd-num", mn[0]); i += mn[0].length; continue; }
      }
      var w = /^[a-z]+/.exec(code.slice(i));
      if (w && /^(true|false|null)$/.test(w[0])) { out += hlSpan("rd-pre", w[0]); i += w[0].length; continue; }
      out += esc(c); i++;
    }
    return out;
  }

  /* ---------------- YAML / INI：按行认「键: 值」与注释 ---------------- */
  function hlYaml(code) {
    return code.split("\n").map(function (line) {
      var m = /^(\s*(?:-\s+)?)([\w.@-]+)(\s*:)(.*)$/.exec(line);
      if (m) return esc(m[1]) + hlSpan("rd-atr", m[2]) + esc(m[3]) + hlYamlValue(m[4]);
      var c = /^(\s*)(#.*)$/.exec(line);
      if (c) return esc(c[1]) + hlSpan("rd-com", c[2]);
      return hlYamlValue(line);
    }).join("\n");
  }
  function hlYamlValue(s) {
    var cm = s.indexOf(" #");
    var body = cm < 0 ? s : s.slice(0, cm), tail = cm < 0 ? "" : hlSpan("rd-com", s.slice(cm));
    return body.replace(/('[^']*'|"[^"]*"|-?\d+(?:\.\d+)?|true|false|null|[\w][\w.-]*)/g, function (t) {
      if (/^['"]/.test(t)) return hlSpan("rd-str", t);
      if (/^-?\d/.test(t)) return hlSpan("rd-num", t);
      if (/^(true|false|null)$/.test(t)) return hlSpan("rd-pre", t);
      return esc(t);
    }) + tail;
  }
  function hlIni(code) {
    return code.split("\n").map(function (line) {
      var s = line.replace(/^\s+/, ""), lead = line.slice(0, line.length - s.length);
      if (/^;|^#/.test(s)) return esc(lead) + hlSpan("rd-com", s);
      var sec = /^\[([^\]]*)\](.*)$/.exec(s);
      if (sec) return esc(lead) + hlSpan("rd-cls", "[" + sec[1] + "]") + esc(sec[2]);
      var kv = /^([^=]+)(=)(.*)$/.exec(s);
      if (kv) return esc(lead) + hlSpan("rd-atr", kv[1]) + esc(kv[2]) + hlYamlValue(kv[3]);
      return esc(line);
    }).join("\n");
  }

  /* ---------------- text：这 27 块里全是 REPL 会话和终端记录，不是随便的说明文字
     `>>>` / `...` 开头 → 后面按 Python 染；`$` 开头 → 按 shell 染；其余原样 ---------------- */
  function hlText(code) {
    return code.split("\n").map(function (line) {
      var py = /^(\s*)(>>>|\.\.\.)(\s?)(.*)$/.exec(line);
      if (py) return esc(py[1]) + hlSpan("rd-kw", py[2] + py[3]) + hlPy(py[4]);
      var sh = /^(\s*)(\$|%|\(.*?\)\s*\$)\s(.*)$/.exec(line);
      if (sh) return esc(sh[1]) + hlSpan("rd-kw", sh[2]) + " " + hlShell(sh[3]);
      var out = /^(\s*)(Out\[\d+\]:|>>>)\s(.*)$/.exec(line);
      if (out) return esc(out[1]) + hlSpan("rd-pre", out[2]) + " " + hlPy(out[3]);
      return esc(line);
    }).join("\n");
  }

  function hlCode(code, lang) {
    var l = String(lang || "").toLowerCase();
    if (l === "c++" || l === "cpp" || l === "c" || l === "java" || l === "csharp" || l === "cs" || l === "asm") return hlCpp(String(code || ""));
    if (l === "shell" || l === "sh" || l === "bash" || l === "powershell" || l === "ps1") return hlShell(String(code || ""));
    if (l === "python" || l === "py") return hlPy(String(code || ""));
    if (l === "javascript" || l === "js" || l === "typescript" || l === "ts") return hlJs(String(code || ""));
    if (l === "html" || l === "xml" || l === "vue") return hlHtml(String(code || ""));
    if (l === "css" || l === "scss" || l === "less") return hlCss(String(code || ""));
    if (l === "json") return hlJson(String(code || ""));
    if (l === "yaml" || l === "yml") return hlYaml(String(code || ""));
    if (l === "ini" || l === "toml" || l === "cfg") return hlIni(String(code || ""));
    if (l === "text" || l === "txt" || l === "console") return hlText(String(code || ""));
    return esc(code);
  }




  function blockHtml(b, i) {
    if (b.t === "p") return "<p>" + inlineHtml(b.text) + "</p>";
    if (b.t === "h2") return '<h2 id="h2-' + i + '">' + esc(b.text) + "</h2>";
    if (b.t === "tip") return '<div class="tip-box' + tipCls(b) + '">' + inlineHtml(b.text) + "</div>";
    if (b.t === "ul") return "<ul>" + b.items.map(function (x) { return "<li>" + inlineHtml(x) + "</li>"; }).join("") + "</ul>";
    if (b.t === "code") {
      return '<div class="code-block"><div class="code-head"><span class="lang">' + esc(b.lang) + "</span>" +
        '<button class="copy-btn" data-code="' + esc(b.code) + '">复制</button></div>' +
        "<pre><code>" + hlCode(b.code, b.lang) + "</code></pre></div>";
    }
    if (b.t === "svg") {
      /* 图形化演示：正文里直接写内联 SVG（只允许 svg/g/rect/circle/path/text/line/tspan/defs/marker/
         linearGradient/stop/ellipse/polygon/polyline/title 这些静态标签，脚本与事件属性一律剥掉） */
      var raw = String(b.code || "");
      raw = raw.replace(/<\s*(script|iframe|object|embed|animate|set)\b[\s\S]*?(?:<\/\s*\1\s*>|[\/]?\s*>)/gi, "")
               .replace(/\s(on\w+|href|xlink:href|src)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
               .replace(/\sstyle\s*=\s*"[^"]*url\s*\([^"]*\)[^"]*"/gi, "");
      return '<figure class="art-svg">' + raw +
        (b.caption ? '<figcaption class="cap">' + esc(b.caption) + "</figcaption>" : "") + "</figure>";
    }
    if (b.t === "img") {
      return '<figure class="art-img"><img src="' + esc(url(b.src)) + '" alt="' + esc(b.alt || "") + '" loading="lazy">' +
        (b.caption ? '<figcaption class="cap">' + esc(b.caption) + "</figcaption>" : "") +
        "</figure>";
    }
    if (b.t === "audio") {
      var auSrc = url(b.src) || demoWavSrc();
      return '<div class="art-audio" data-audio>' +
        '<button class="au-btn" type="button" aria-label="播放或停止音频" title="播放 / 停止">' + SPEAKER_SVG + "</button>" +
        '<div class="au-body">' +
        '<div class="au-title">' + esc(b.title || "音频导读") + "</div>" +
        (b.note ? '<div class="muted small au-note">' + esc(b.note) + "</div>" : "") +
        '<div class="au-bar hidden"><div class="au-fill"></div><span class="au-knob"></span></div>' +
        "</div>" +
        '<span class="au-time muted small">0:00 / 0:00</span>' +
        '<audio preload="metadata" src="' + esc(auSrc) + '"></audio>' +
        "</div>";
    }
    /* 英语学习卡片块：kind = "let"（26 字母）| "ph"（48 音标，可选 grp 指定分组）
       正文只写 {"t":"en","kind":"ph","grp":"长元音"} 即可；
       卡片数据取自 assets/data/en-data.js（经本地数据层的 meta），前端不留副本。 */
    if (b.t === "en") return enBlockHtml(b);
    return "";
  }

  /* ---------------- 英语学习卡片（正文内嵌，非独立页面） ----------------
     字母与音标在 assets/data/en-data.js（英语发音入门那门课的正文包）里，200 词在 enwords-data.js 里。
     按需加载之后这两份都在「点开那门课」时才进 window，所以渲染时现取，不缓存副本。 */
  function enPack() { return window.MIAO_EN || { letters: [], phonemes: [], groups: [] }; }
  function enPlayBtn(a, label, say) {
    return '<button class="en-play" type="button" data-en-src="' + esc(a || "") + '" data-say="' + esc(say || "") + '" ' +
      'aria-label="播放' + esc(label) + '读音"><span class="en-ico">▶</span><span class="en-tx">读音</span></button>';
  }
  function enCardHtml(x, kind) {
    if (kind === "let") {
      return '<div class="en-card" data-en-k="' + esc(x.l) + '">' +
        '<div class="en-glyph">' + esc(x.l) + "</div>" +
        '<div class="en-meta"><div class="en-ipa">' + esc(x.ipa) + "</div>" +
        '<div class="en-cn">' + esc(x.cn) + "</div></div>" +
        enPlayBtn(x.a, x.l, x.l) + "</div>";
    }
    return '<div class="en-card en-card-ph" data-en-k="' + esc(x.ph) + '">' +
      '<div class="en-glyph en-ipa-lg">' + esc(x.ph) + "</div>" +
      '<div class="en-meta"><div class="en-cn">' + esc(x.cn) +
      (x.w ? ' <span class="en-w">' + esc(x.w) + "</span>" : "") + "</div>" +
      (x.tip ? '<div class="en-tip">' + esc(x.tip) + "</div>" : "") + "</div>" +
      enPlayBtn(x.a, x.ph, x.w || "") + "</div>";
  }
  function enBlockHtml(b) {
    var kind = b.kind || "ph", out = "";
    if (kind === "sent") {
      var sents = b.items || [];
      if (!sents.length) return '<div class="en-none">这一课的句子数据没跟着正文一起加载</div>';
      return '<div class="en-sents">' + sents.map(function (x) {
        return '<div class="en-sent">' +
          '<div class="en-sent-top">' + enPlayBtn(x.sa, x.ph || x.w, x.phsay || x.ph || x.w) +
          '<span class="en-sent-en">' + esc(x.ph) + "</span></div>" +
          '<div class="en-sent-cn">' + esc(x.phcn || "") + "</div></div>";
      }).join("") + "</div>";
    }
    if (kind === "word") {
      var items = b.items || [];
      if (!items.length) return '<div class="en-none">这一课的单词数据没跟着正文一起加载</div>';
      return '<div class="en-grid en-grid-word">' + items.map(function (x) { return wordCardHtml(x); }).join("") + "</div>";
    }
    var pack = enPack();
    if (kind === "let") {
      var ls = pack.letters || [];
      if (!ls.length) return '<div class="en-none">字母数据未加载</div>';
      return '<div class="en-grid">' + ls.map(function (x) { return enCardHtml(x, "let"); }).join("") + "</div>";
    }
    if (kind === "ph") {
      var ps = pack.phonemes || [];
      if (!ps.length) return '<div class="en-none">音标数据未加载</div>';
      var grp = b.grp || "";
      var items2 = grp ? ps.filter(function (x) { return x.grp === grp; }) : ps;
      if (grp) {
        out += '<div class="en-group"><span class="en-gname">' + esc(grp) +
          '</span><span class="en-gcnt">' + items2.length + ' 个</span></div>';
      }
      out += '<div class="en-grid">' + items2.map(function (x) { return enCardHtml(x, "ph"); }).join("") + "</div>";
      return out;
    }
    return "";
  }

  /* 单词卡：一行摆「单词 + 词性 + 播放键」，下面三行是音标 / 中文 / 常用短语。
     横着摆会被 watermelon 这种长词挤断音标，竖着摆多少词都装得下。 */
  function wordCardHtml(x) {
    return '<div class="en-card en-card-word" data-en-k="' + esc(x.w) + '">' +
      '<div class="en-word-top">' +
      '<span class="en-word-glyph">' + esc(x.w) + "</span>" +
      (x.pos ? '<span class="en-word-pos">' + esc(x.pos) + "</span>" : "") +
      '<span class="en-word-play">' + enPlayBtn(x.a, x.w, x.say || x.w) + "</span>" +
      "</div>" +
      '<div class="en-ipa">' + esc(x.ipa) + "</div>" +
      '<div class="en-cn">' + esc(x.cn) + "</div>" +
      (x.ph ? '<div class="en-w">' + esc(x.ph) + "</div>" : "") +
      (x.phcn ? '<div class="en-phcn">' + esc(x.phcn) + "</div>" : "") +
      "</div>";
  }

  /* 正文内英语卡片的播放：单例，同一时刻只播一个；离开页面时停掉 */
  var enCur = null;
  function enStop() {
    if (enCur) { enCur.pause(); enCur = null; }
    try { if (root.speechSynthesis) root.speechSynthesis.cancel(); } catch (e) { /* 老浏览器没有就跳过 */ }
    $all(".en-play.playing").forEach(function (b) { b.classList.remove("playing"); });
  }
  /* 站点里没有对应 mp3 时（比如音频还没生成）用浏览器自带的英语发音兜底 */
  function enSpeak(say, btn) {
    if (!say || !root.speechSynthesis || !root.SpeechSynthesisUtterance) {
      if (btn) btn.classList.remove("playing");
      return;
    }
    btn.classList.add("playing");
    var u = new root.SpeechSynthesisUtterance(say);
    u.lang = "en-US"; u.rate = 0.85;
    u.onend = function () { btn.classList.remove("playing"); };
    u.onerror = function () { btn.classList.remove("playing"); };
    try { root.speechSynthesis.speak(u); } catch (e) { btn.classList.remove("playing"); }
  }
  function enPlay(src, btn) {
    var say = btn.getAttribute("data-say") || "";
    if (!src) { enSpeak(say, btn); return; }
    if (enCur && enCur.dataset.src === src) { enStop(); return; }
    enStop();
    var a = new Audio(url(src));
    a.dataset.src = src;
    enCur = a;
    btn.classList.add("playing");
    a.onended = function () { btn.classList.remove("playing"); };
    a.onerror = function () { btn.classList.remove("playing"); enSpeak(say, btn); };
    a.play().catch(function () {
      btn.classList.remove("playing");
      toast("浏览器拦截了自动播放，请再点一次");
    });
  }
  function bindEnCards() {
    $all(".en-play").forEach(function (b) {
      b.onclick = function () { enPlay(b.getAttribute("data-en-src"), b); };
    });
  }

  function bindCopy() {
    $all(".copy-btn").forEach(function (btn) {
      btn.onclick = function () {
        var code = btn.getAttribute("data-code");
        function ok() { btn.textContent = "已复制"; setTimeout(function () { btn.textContent = "复制"; }, 1400); }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code).then(ok, function () { fallback(); });
        } else fallback();
        function fallback() {
          var ta = document.createElement("textarea");
          ta.value = code; document.body.appendChild(ta); ta.select();
          try { document.execCommand("copy"); ok(); } catch (e) { toast("复制失败，请手动选择"); }
          ta.remove();
        }
      };
    });
  }

  /* ---------------- 音频播放器：小喇叭 + 可拖拽进度条 ---------------- */
  var SPEAKER_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5z"></path><path class="wv w1" d="M15.5 8.5a5 5 0 0 1 0 7"></path><path class="wv w2" d="M18.5 5.5a9 9 0 0 1 0 13"></path></svg>';

  /* 演示音频：运行时合成 4 秒 WAV，保证播放器开箱可播 */
  var DEMO_WAV = null;
  function demoWavSrc() {
    if (DEMO_WAV) return DEMO_WAV;
    var rate = 8000, secs = 4, n = rate * secs;
    var buf = new ArrayBuffer(44 + n), v = new DataView(buf);
    function str(o, s) { for (var k = 0; k < s.length; k++) v.setUint8(o + k, s.charCodeAt(k)); }
    str(0, "RIFF"); v.setUint32(4, 36 + n, true); str(8, "WAVE");
    str(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true);
    str(36, "data"); v.setUint32(40, n, true);
    for (var i = 0; i < n; i++) {
      var t = i / rate;
      var env = Math.min(1, t * 4) * Math.max(0, 1 - t / secs);
      var s = Math.sin(2 * Math.PI * 440 * t) * 0.35 + Math.sin(2 * Math.PI * 660 * t) * 0.15;
      v.setUint8(44 + i, 128 + Math.round(s * env * 120));
    }
    var bytes = new Uint8Array(buf), bin = "";
    for (var j = 0; j < bytes.length; j++) bin += String.fromCharCode(bytes[j]);
    DEMO_WAV = "data:audio/wav;base64," + btoa(bin);
    return DEMO_WAV;
  }

  function fmtTime(s) {
    s = Math.max(0, Math.floor(s || 0));
    return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2);
  }

  /* play() 在部分环境返回 undefined，统一安全调用 */
  function safePlay(au, onFail) {
    try {
      var p = au.play();
      if (p && typeof p.catch === "function") p.catch(function () { if (onFail) onFail(); });
    } catch (e) { if (onFail) onFail(); }
  }

  /* 绑定阅读页所有音频块：点击喇叭播放/停止，拖动进度条选时间 */
  function bindAudio() {
    $all("[data-audio]").forEach(function (wrap) {
      if (wrap.dataset.bound) return;
      wrap.dataset.bound = "1";
      var au = $("audio", wrap), btn = $(".au-btn", wrap), bar = $(".au-bar", wrap);
      var fill = $(".au-fill", wrap), knob = $(".au-knob", wrap), time = $(".au-time", wrap);
      var dragging = false;
      function upd() {
        var d = au.duration || 0, c = au.currentTime || 0, p = d ? (c / d * 100) : 0;
        fill.style.width = p + "%";
        if (knob) knob.style.left = p + "%";
        time.textContent = fmtTime(c) + " / " + fmtTime(d);
      }
      function stop() {
        au.pause(); au.currentTime = 0;
        wrap.classList.remove("playing"); bar.classList.add("hidden");
        upd();
      }
      btn.onclick = function () {
        if (!au.paused) { stop(); return; }          // 未播完再次点击 → 停止
        bar.classList.remove("hidden");
        wrap.classList.add("playing");
        safePlay(au, function () { toast("音频加载失败"); stop(); });
      };
      au.addEventListener("timeupdate", function () { if (!dragging) upd(); });
      au.addEventListener("loadedmetadata", upd);
      au.addEventListener("ended", function () { stop(); });
      function seekTo(e) {
        var r = bar.getBoundingClientRect();
        var x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
        var p = Math.min(1, Math.max(0, x / r.width));
        if (au.duration) { au.currentTime = p * au.duration; }
        fill.style.width = p * 100 + "%";
        if (knob) knob.style.left = p * 100 + "%";
        time.textContent = fmtTime(p * (au.duration || 0)) + " / " + fmtTime(au.duration || 0);
      }
      function onMove(e) { if (dragging) { seekTo(e); e.preventDefault(); } }
      function onUp() {
        if (!dragging) return;
        dragging = false; bar.classList.remove("dragging");
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        document.removeEventListener("touchmove", onMove);
        document.removeEventListener("touchend", onUp);
      }
      function onDown(e) {
        dragging = true; bar.classList.add("dragging");
        bar.classList.remove("hidden");
        if (au.paused) { wrap.classList.add("playing"); safePlay(au); }
        seekTo(e); e.preventDefault();
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
        document.addEventListener("touchmove", onMove, { passive: false });
        document.addEventListener("touchend", onUp);
      }
      bar.addEventListener("mousedown", onDown);
      bar.addEventListener("touchstart", onDown, { passive: false });
      au.addEventListener("durationchange", upd);
      upd();
    });
  }

  /* ---------------- 视图 ---------------- */
  var app;

  /* 首页就是分类页：不再单独做一个只有卡片的落地页 */
  function vCategory(params) {
    var curCat = params.cat || "";
    var curDiff = params.diff || "";
    var sort = params.sort || "hot";
    var list = TUTS.filter(function (t) {
      return (!curCat || t.cat === curCat) && (!curDiff || t.diff === curDiff);
    });
    list.sort(function (a, b) {
      if (sort === "new") return a.updated < b.updated ? 1 : -1;
      return (b.chaps || 0) - (a.chaps || 0);
    });
    function chipLink(label, key, val) {
      var p = { cat: curCat, diff: curDiff, sort: sort };
      p[key] = val;
      var qs = Object.keys(p).filter(function (k) { return p[k]; })
        .map(function (k) { return k + "=" + encodeURIComponent(p[k]); }).join("&");
      var on = (key === "cat" ? curCat : curDiff) === val;
      return '<a class="chip' + (on ? " on" : "") + '" href="#/category' + (qs ? "?" + qs : "") + '">' + label + "</a>";
    }
    /* 分类按「大类 → 小类」分组展示；「全部」清空分类；右侧按钮可收起/展开 */
    var catBody = Array.isArray(DATA.categories)
      ? catList().map(function (c) { return chipLink(c, "cat", c); }).join("")
      : Object.keys(DATA.categories).map(function (big) {
          var subs = DATA.categories[big] || [];
          if (!subs.length) return chipLink(big, "cat", big);
          return '<div class="cat-row"><span class="cat-big">' + esc(big) + "</span>" +
            subs.map(function (c) { return chipLink(c, "cat", c); }).join("") + "</div>";
        }).join("");
    var catOpen = store.get("catOpen", true);
    var catChips = '<div class="cat-group">' +
      '<div class="cat-head">' + chipLink("全部", "cat", "") +
      '<span class="cat-toggle" id="catToggle" role="button" tabindex="0" aria-expanded="' + (catOpen ? "true" : "false") + '">' +
      (catOpen ? "收起分类" : "展开分类") + "</span></div>" +
      '<div class="cat-body' + (catOpen ? "" : " hidden") + '" id="catBody">' + catBody + "</div></div>";
    var diffChips = chipLink("全部难度", "diff", "") + ["入门", "掌握", "精通"].map(function (d) { return chipLink(d, "diff", d); }).join("");
    app.innerHTML =
      '<div class="container">' +
      '<h1 class="page-title">首页</h1>' +
      '<div class="filter-bar">' + catChips + "</div>" +
      '<div class="filter-bar" style="margin-top:-6px">' + diffChips +
      '<span class="spacer"></span>' +
      '<select class="input" id="sortSel" style="width:130px">' +
      '<option value="hot"' + (sort === "hot" ? " selected" : "") + ">按热度</option>" +
      '<option value="new"' + (sort === "new" ? " selected" : "") + ">按最新</option>" +
      "</select></div>" +
      (list.length ? '<div class="grid">' + list.map(tutCard).join("") + "</div>"
        : '<div class="empty">该分类下暂无教程</div>') +
      "</div>";
    var catTg = $("#catToggle");
    if (catTg) catTg.onclick = function () {
      var body = $("#catBody");
      var nowOpen = body.classList.toggle("hidden") === false;
      catTg.textContent = nowOpen ? "收起分类" : "展开分类";
      catTg.setAttribute("aria-expanded", nowOpen ? "true" : "false");
      store.set("catOpen", nowOpen);
    };
    $("#sortSel").onchange = function (e) {
      var qs = "?sort=" + e.target.value + (curCat ? "&cat=" + encodeURIComponent(curCat) : "") + (curDiff ? "&diff=" + encodeURIComponent(curDiff) : "");
      location.hash = "#/category" + qs;
    };
  }

  function vTutorial(params) {
    var t = tut(params.id);
    if (!t) { v404(); return; }
    var done = doneSet(t.id);
    var chapters0 = t.chapters || [];
    var nextC = chapters0.filter(function (c) { return done.indexOf(c.id) < 0; })[0] || chapters0[0];
    var started = done.length > 0;
    var pct = chapters0.length ? tutProgress(t) : 0;
    var fav = t.faved === true;
    var passedN = (t.examPassed || []).length, examN = (t.examIds || []).length;
    var chapters = t.chapters || [];
    var chapsN = chapters.length || t.chaps || 0;
    var chapItems = chapters.length ? chapters.map(function (c, i) {
      return '<a class="chap-item' + (isDone(t.id, c.id) ? " done" : "") + '" href="#/read/' + t.id + "/" + c.id + '">' +
        '<span class="idx">' + (isDone(t.id, c.id) ? "✓" : i + 1) + "</span>" +
        '<span class="tt">' + esc(c.title) + "</span></a>";
    }).join("") : '<div class="muted small" style="padding:12px 14px 16px">暂无章节</div>';
    app.innerHTML =
      '<div class="container">' +
      '<div class="crumb"><a href="#/">首页</a> / <a href="#/category?cat=' + encodeURIComponent(t.cat) + '">' + esc(t.cat) + "</a> / " + esc(t.title) + "</div>" +
      '<div class="tut-hero card">' +
      '<div class="cover-wrap">' + coverHtml(t, "hero") +
      (coverSrc(t, "hero")
        ? '<button class="card-eye" type="button" data-eye="' + t.id + '" title="缩放查看完整图">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"></path><circle cx="12" cy="12" r="3"></circle></svg>完整图</button>'
        : "") + "</div>" +
      '<div class="info"><h1>' + esc(t.title) + "</h1>" +
      tutMeta(t, { author: true }) +
      '<div class="tags">' + t.tags.map(function (x) { return '<span class="chip">' + esc(x) + "</span>"; }).join("") + "</div>" +
      '<p class="intro">' + esc(t.intro) + "</p>" +
      '<div class="ops">' + (nextC
        ? '<a class="btn btn-primary" href="#/read/' + t.id + "/" + nextC.id + '">' + (started ? "继续学习 · 已学 " + pct + "%" : "开始学习") + "</a>"
        : '<a class="btn btn-primary" href="#/' + t.id + '">开始学习</a>') +
      '<button class="btn star-btn ' + (fav ? "on" : "ghost") + '" id="favBtn" title="' + (fav ? "已收藏在本机，点击取消" : "收藏这门教程（只存本机）") + '">' +
      '<i class="star-ico">' + (fav ? "★" : "☆") + "</i>" + (fav ? "已收藏" : "收藏") + "</button></div>" +
      "</div></div>" +
      '<div class="tut-cols">' +
      '<div class="chap-list card"><div style="padding:10px 14px 4px;font-weight:700">章节目录 · 共 ' + chapsN + " 章</div>" + chapItems + "</div>" +
      '<div class="side-card card">' +
      '<h3>作者 · 课程信息</h3>' +
      '<div class="author-row"><div class="author-main"><div class="author-name">' + esc(t.author) + "</div>" +
      '<div class="muted small">喵站官方整理，内容永久免费</div></div></div>' +
      '<div class="side-sep"></div>' +
      '<div class="kv"><span>章节数</span><span>' + chapsN + "</span></div>" +
      '<div class="kv"><span>本机已学</span><span>' + done.length + " / " + chapsN + "</span></div>" +
      (examN ? '<div class="kv"><span>课末考试</span><span>' + passedN + " / " + examN + " 课已通过</span></div>" : "") +
      '<div class="kv"><span>难度</span><span class="kv-diff">' + diffBadge(t) + "</span></div>" +
      '<div class="kv"><span>最近更新</span><span>' + esc(t.updated) + "</span></div>" +
      "</div></div></div>";

    $("#favBtn").onclick = function () {
      var turnOn = t.faved !== true;
      (turnOn ? API.post("/api/tutorials/" + t.id + "/fav") : API.del("/api/tutorials/" + t.id + "/fav"))
        .then(function (d) {
          t.faved = d.faved;
          var i = state.favs.indexOf(t.id);
          if (d.faved && i < 0) state.favs.push(t.id);
          if (!d.faved && i >= 0) state.favs.splice(i, 1);
          save();
          vTutorial(params);
          toast(d.faved ? "已收藏到本机" : "已取消收藏");
        })
        .catch(function (e) { toast(e.message || "操作失败"); });
    };
  }

  /* 阅读页滚动记忆：侧栏目录的滚动位置跨渲染保留；同章重渲染（完成/加载更多）不跳窗口 */
  var readMem = { tid: "", key: "", treeTop: 0 };

  function vRead(params) {
    var t = tut(params.id);
    if (!t) { v404(); return; }
    if (!t.chapters || !t.chapters.length) {
      app.innerHTML = '<div class="auth-wrap"><div class="auth-card card"><h1>暂无内容</h1>' +
        '<p class="sub">这一章还没有正文内容。</p>' +
        '<a class="skip-link" href="#/tutorial/' + esc(t.id) + '">返回教程详情 →</a></div></div>';
      return;
    }
    var c = chap(t, params.cid) || t.chapters[0];
    if (!c.blocks) c.blocks = [];          // 章节正文加载失败时只有 {id,title} 桩，兜底空数组防崩溃
    setInlineRefs(t.id, t.chapters);       // 正文里的「第 N 课」要靠章号表才知道跳哪
    var idx = t.chapters.indexOf(c);
    var prev = t.chapters[idx - 1], next = t.chapters[idx + 1];
    var done = isDone(t.id, c.id);
    var win = BE.chapterWin[t.id + ":" + c.id] || null;

    /* 渲染前记下侧栏目录滚动位置与窗口位置，渲染后恢复 */
    var prevTree = $(".read-tree");
    if (prevTree) readMem.treeTop = prevTree.scrollTop;
    var viewKey = t.id + ":" + c.id;
    var sameChap = readMem.key === viewKey;
    var winY = window.scrollY;

    var tree = t.chapters.map(function (x) {
      return '<a class="rt-item' + (x.id === c.id ? " on" : "") + (isDone(t.id, x.id) ? " done" : "") + '" href="#/read/' + t.id + "/" + x.id + '">' +
        '<span class="dot"></span><span>' + esc(x.title) + "</span></a>";
    }).join("");

    var outline = [];
    c.blocks.forEach(function (b, i) { if (b.t === "h2") outline.push('<a data-h="h2-' + i + '">' + esc(b.text) + "</a>"); });

    var moreHtml = (win && win.hasMore)
      ? '<div style="text-align:center;padding:18px"><button class="btn btn-soft" id="loadMore">继续加载（已读约 ' + fmtStat(win.nextOffset) + " / 共 " + fmtStat(win.totalChars) + " 字）</button></div>"
      : "";
    var hasExam = (t.examIds || []).indexOf(c.id) >= 0;
    var myExam = (t.examResults || {})[c.id];
    /* 卷型不同，那句提示要换：Python 是写代码，字母音标卷与单词卷都是答题 */
    var examWhat = t.engine === "en"
      ? "25 道题：选择、听音选字母、听音写字母、字母配对，答不了随时从左上角退出。"
      : t.engine === "enword"
        ? (c.id === "ew-l22" ? "20 道题，范围是前 21 课的全部词：选择、听音选词、默写、连线。"
                             : "14 道题，只考本课的词：选择、听音选词、补全单词、中译英默写、连线。")
        : "题目是一小段代码任务，答不了随时从左上角退出。";
    var opsHtml = hasExam
      ? '<div class="art-ops">' +
        (done
          ? '<span class="exam-entry done">✓ 这一课已考过' + (myExam && myExam.best ? "（最高 " + myExam.best + " 分）" : "") + "</span>" +
            '<a class="btn btn-soft" href="#/exam/' + t.id + "/" + c.id + '">再考一次</a>' +
            '<span class="exam-note">成绩只存你考过这件事，重考不扣分，取最高分。</span>'
          : '<a class="exam-entry" href="#/exam/' + t.id + "/" + c.id + '">进入考试 →</a>' +
            '<span class="exam-note">这一课要考过才算完成。' + examWhat + "</span>") +
        "</div>"
      : '<div class="art-ops">' +
        '<button class="btn ' + (done ? "soft" : "primary") + '" id="doneBtn">' + (done ? "✓ 已完成（点击取消）" : "完成！") + "</button>" +
        "</div>";

    app.innerHTML =
      '<div class="read-wrap"><div class="read-grid">' +
      '<aside class="read-tree card"><div class="rt-title">' + esc(t.title) + "</div>" + tree + "</aside>" +
      '<article class="article">' +
      "<h1>" + esc(c.title) + "</h1>" +
      '<div class="art-meta">' + esc(t.title) + " · 第 " + (idx + 1) + "/" + t.chapters.length + " 章 · " + esc(t.author) + "</div>" +
      c.blocks.map(blockHtml).join("") +
      opsHtml +
      '<div class="pn-nav">' +
      (prev
        ? '<a class="pn-item card" href="#/read/' + t.id + "/" + prev.id + '"><div class="lb">← 上一篇</div><div class="tt">' + esc(prev.title) + "</div></a>"
        : '<div class="pn-item card off"><div class="lb">← 上一篇</div><div class="tt">没有了</div></div>') +
      (next
        ? '<a class="pn-item card next" href="#/read/' + t.id + "/" + next.id + '"><div class="lb">下一篇 →</div><div class="tt">' + esc(next.title) + "</div></a>"
        : '<a class="pn-item card next" href="#/tutorial/' + t.id + '"><div class="lb">下一篇 →</div><div class="tt">返回教程目录</div></a>') +
      "</div></article>" +
      '<aside class="read-side">' +
      '<div class="outline card"><h4>本篇大纲</h4>' + (outline.join("") || '<span class="muted small">无小节</span>') + "</div>" +
      "</aside>" +
      "</div></div>";

    if (sameChap) window.scrollTo(0, winY); else window.scrollTo(0, 0);
    var treeEl = $(".read-tree");
    if (treeEl) {
      /* CSS scroll-behavior:smooth 会让 scrollTop 赋值变异步动画,必须用 instant 瞬时定位 */
      var setTree = function (top) {
        if (treeEl.scrollTo) treeEl.scrollTo({ top: top, behavior: "instant" });
        else treeEl.scrollTop = top;
      };
      if (readMem.tid === t.id) setTree(readMem.treeTop);
      /* 当前章节项若不在侧栏可视区内,把它滚到居中可见 */
      var onItem = $(".rt-item.on", treeEl);
      if (onItem) {
        var tb = treeEl.getBoundingClientRect(), ib = onItem.getBoundingClientRect();
        if (ib.top < tb.top || ib.bottom > tb.bottom) {
          setTree(treeEl.scrollTop + (ib.top - tb.top) - (treeEl.clientHeight - ib.height) / 2);
        }
      }
      readMem.treeTop = treeEl.scrollTop;
    }
    readMem.tid = t.id; readMem.key = viewKey;
    bindCopy();
    bindAudio();
    bindEnCards();
    var moreBtn = $("#loadMore");
    if (moreBtn) moreBtn.onclick = function () {
      var y = window.scrollY;
      BE.loadChapter(t.id, c.id, win.nextOffset).then(function () {
        vRead(params);
        window.scrollTo(0, y);
      }).catch(function (e) { toast(e.message || "加载失败"); });
    };
    $all(".outline a").forEach(function (a) {
      a.onclick = function () {
        var el = document.getElementById(a.dataset.h);
        if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "start" });
      };
    });
    var db = $("#doneBtn");
    if (db) db.onclick = function () {
      var arr = state.progress[t.id] || (state.progress[t.id] = []);
      var i = arr.indexOf(c.id);
      if (i >= 0) { arr.splice(i, 1); toast("已取消完成标记"); }
      else {
        arr.push(c.id);
        if (t.chapters.every(function (x) { return arr.indexOf(x.id) >= 0; })) toast("恭喜！已学完整本「" + t.title + "」");
        else toast("本章已完成，进度记在本机");
      }
      save(); vRead(params);
    };
  }

  function vSearch(params) {
    var q = (params.q || "").trim();
    var tab = params.tab || "tutorial";
    var ql = q.toLowerCase();
    var rTut = q ? TUTS.filter(function (t) {
      /* keywords 是目录里带来的这批课「教了哪些词」（英语入门那 200 个词就在里面），
         不加载正文也能搜到 apple、tomato —— 只有正文级的全文搜索才需要把那门课拉下来 */
      return (t.title + t.intro + t.tags.join("") + " " + (t.keywords || []).join(" ")).toLowerCase().indexOf(ql) >= 0;
    }) : [];
    var rChap = [];
    if (q) TUTS.forEach(function (t) {
      /* 按需加载之后正文不在首屏，章节这一档只比标题；点进那门课之后正文才在本地 */
      (t.chapters || []).forEach(function (c) {
        if ((c.title || "").toLowerCase().indexOf(ql) >= 0) rChap.push({ t: t, c: c });
      });
    });
    var rAuth = [];
    if (q) TUTS.forEach(function (t) {
      if (t.author.toLowerCase().indexOf(ql) >= 0 && rAuth.indexOf(t.author) < 0) rAuth.push(t.author);
    });
    function hi(s) { return q ? esc(s).replace(new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi"), "<mark>$1</mark>") : esc(s); }
    function cnt(n) { return '<span class="muted small"> ' + n + "</span>"; }

    var body = "";
    if (!q) body = '<div class="empty">输入关键词，搜索教程、章节或作者</div>';
    else if (tab === "tutorial") body = rTut.length ? rTut.map(function (t) {
      return '<a class="s-item card" href="#/tutorial/' + t.id + '"><h4>' + hi(t.title) + "</h4><p>" + hi(t.intro.slice(0, 60)) + "…</p>" +
        tutMeta(t, { author: true }) + "</a>";
    }).join("") : '<div class="empty">没有找到相关教程，试试其他关键词</div>';
    else if (tab === "chapter") body = rChap.length ? rChap.map(function (r) {
      return '<a class="s-item card" href="#/read/' + r.t.id + "/" + r.c.id + '"><h4>' + hi(r.c.title) + "</h4><p>" + hi(r.t.title) + " · " + esc(r.t.author) + "</p></a>";
    }).join("") : '<div class="empty">没有找到相关章节</div>';
    else body = rAuth.length ? rAuth.map(function (a) {
      var ts = TUTS.filter(function (t) { return t.author === a; });
      return '<div class="s-item card"><h4>' + hi(a) + '</h4><p>发布教程 ' + ts.length + " 门：" + ts.map(function (t) { return '<a href="#/tutorial/' + t.id + '">' + esc(t.title) + "</a>"; }).join("、") + "</p></div>";
    }).join("") : '<div class="empty">没有找到相关作者</div>';

    app.innerHTML =
      '<div class="container search-wrap">' +
      '<h1 class="page-title">搜索' + (q ? "：“" + esc(q) + "”" : "") + "</h1>" +
      '<div class="search-tabs">' +
      '<a class="chip' + (tab === "tutorial" ? " on" : "") + '" href="#/search?q=' + encodeURIComponent(q) + '&tab=tutorial">教程' + (q ? cnt(rTut.length) : "") + "</a>" +
      '<a class="chip' + (tab === "chapter" ? " on" : "") + '" href="#/search?q=' + encodeURIComponent(q) + '&tab=chapter">章节' + (q ? cnt(rChap.length) : "") + "</a>" +
      '<a class="chip' + (tab === "author" ? " on" : "") + '" href="#/search?q=' + encodeURIComponent(q) + '&tab=author">作者' + (q ? cnt(rAuth.length) : "") + "</a>" +
      "</div>" +
      (q ? '<div class="muted small search-scope">搜索范围：课程名、章节标题与课程带的词表。正文是点开那门课才下载到本地的，不为一次搜索把全站拉下来。</div>' : "") +
      body + "</div>";
    var ns = $("#navSearch"); if (ns) ns.value = q;
  }

  /* 数据没加载上：纯静态站只可能是 assets/data/ 那几份文件没到位 */
  function beOffline() {
    app.innerHTML = '<div class="auth-wrap"><div class="auth-card card">' +
      "<h1>页面打不开：教程数据没加载上</h1>" +
      '<p class="sub">本站是纯静态站，正文与题库都在 <code>assets/data/</code> 下面。' +
      '请确认这些文件都在、并且页面是通过 HTTP 地址打开的（直接双击 html 用 file:// 打开可能被浏览器拦下）。</p>' +
      '<div class="api-ops" style="justify-content:center">' +
      '<button class="btn btn-primary btn-sm" id="beRetry">重新连接</button></div>' +
      '<p class="muted small">' + esc((BE.error && BE.error.message) || "") + "</p></div></div>";
    var b = $("#beRetry");
    if (b) b.onclick = function () { BE.error = null; BE.ready = false; router(); };
  }

  function v404() {
    app.innerHTML = '<div class="container"><div class="empty" style="padding:90px 0">' +
      '<div style="font-size:3rem;font-weight:800;color:var(--accent)">404</div>' +
      "<p>页面走丢了，回首页继续学习喵~</p>" +
      '<a class="btn btn-primary" href="#/" style="margin-top:14px">回首页</a></div></div>';
  }

  /* ---------------- 路由 ---------------- */
  function parseHash() {
    var h = location.hash.replace(/^#/, "") || "/";
    var qIdx = h.indexOf("?");
    var path = qIdx >= 0 ? h.slice(0, qIdx) : h;
    var params = {};
    if (qIdx >= 0) h.slice(qIdx + 1).split("&").forEach(function (kv) {
      var p = kv.split("="); if (p[0]) params[p[0]] = decodeURIComponent(p[1] || "");
    });
    var seg = path.split("/").filter(Boolean);
    return { seg: seg, params: params };
  }

  async function router() {
    var r = parseHash(), s = r.seg;
    /* 读者一动（换页、进考场、回首页），正在跑的预取立刻让路 —— 补齐别的分片永远不是当前的事 */
    if (API.stopPrefetch) API.stopPrefetch();
    /* 考场是整屏界面：站点导航条与页脚让位（否则 sticky 的导航条会盖住标题栏的运行/交卷） */
    document.body.classList.toggle("exam-mode", s[0] === "exam");
    if (!BE.ready && !BE.error) await BE.boot();
    if (BE.error && s[0] !== "login") return beOffline();
    /* 正文与考场脚本都是点开才拉的：先给一句到位的等待提示，别让人对着不动的旧页面猜 */
    var wantId = s[1];
    var needFetch = (s[0] === "tutorial" || s[0] === "read" || s[0] === "exam") &&
      wantId && !API.bodyReady(wantId, s[2] || "");
    if (needFetch) {
      app.innerHTML = '<div class="container"><div class="empty">' +
        (s[0] === "tutorial" ? "正在取这本教程的目录…" : "正在取这一课的正文…") + "</div></div>";
    }
    try {
      if (s[0] === "tutorial" && s[1]) {
        await BE.ensureTutorial(s[1]);
      } else if (s[0] === "read" && s[1] && s[2]) {
        await BE.ensureTutorial(s[1]);
        try { await BE.loadChapter(s[1], s[2]); }       // 游客也可读；这一条只拉骨架 + 这一章的分片
        catch (e) { toast(e.message || "本章加载失败"); }
      } else if (s[0] === "exam" && s[1] && s[2]) {
        await BE.ensureTutorial(s[1]);                  // 考试要考哪一课，得先有章节目录
        await API.get("/api/exams/" + encodeURIComponent(s[1]) + "/" + encodeURIComponent(s[2]));
      }                                                       // 题包与考场界面（Python 还带沙箱）都在这一条里拉
    } catch (e) {
      toast((e && e.message) || "加载失败");
    }
    if (s.length === 0) vCategory(r.params);
    else if (s[0] === "category") vCategory(r.params);
    else if (s[0] === "tutorial" && s[1]) vTutorial({ id: s[1] });
    else if (s[0] === "read" && s[1] && s[2]) {
        vRead({ id: s[1], cid: s[2] });
        /* 这一章已经落在页面上了：人若没别的事，空了再把这本教程其余的分片补齐 */
        if (API.prefetchCourse) API.prefetchCourse(s[1], s[2]);
      }
    else if (s[0] === "exam" && s[1] && s[2]) {
      var UI = examUi();                            /* 考场脚本此刻才在 window 上 */
      if (!UI) { v404(); return; }
      UI.onPassed = markExamPassed;
      UI.vExam(app, { id: s[1], cid: s[2] });
      return;                                      /* 考试是整屏界面，不再滚回页首 */
    }
    else if (s[0] === "search") vSearch(r.params);
    else v404();
    window.scrollTo(0, 0);
  }

  /* ---------------- 启动 ---------------- */
  /* 考试通过后：打完成标记 + 把成绩记进本地与云端（游客只记本地） */
  function markExamPassed(tid, cid, res) {
    var arr = state.progress[tid] || (state.progress[tid] = []);
    if (arr.indexOf(cid) < 0) arr.push(cid);
    var t = tut(tid);
    if (t) {
      t.examPassed = (t.examPassed || []).concat([cid]);
      t.examResults = t.examResults || {};
      t.examResults[cid] = { best: res.score };
      if (t.chapters && t.chapters.every(function (x) { return state.progress[tid].indexOf(x.id) >= 0; })) {
        toast("恭喜！已学完整本「" + t.title + "」");
      } else toast("考试通过：" + res.score + " 分，这一课已标记完成");
    }
    save();
    /* 成绩落在本机（localStorage）；换设备或清缓存会丢，这是纯静态站的代价 */
    API.post("/api/exams/" + encodeURIComponent(tid) + "/" + encodeURIComponent(cid) + "/result",
      { score: res.score, passed: !!res.passed })
      .catch(function (e) { toast(e.message || "成绩没记上，回课文再交一次卷"); });
  }

  function init() {
    app = $("#app");
    window.MIAO_NAV = function (h) { location.hash = h; };
    /* 考场界面（exam-ui.js）是进考场才注入的，onPassed 在路由里每次现挂 */
    renderNavRight();
    bindNavSoon();
    applyTheme();
    var ns = $("#navSearch");
    ns.onkeydown = function (e) {
      if (e.key === "Enter") location.hash = "#/search?q=" + encodeURIComponent(ns.value.trim());
    };
    window.addEventListener("hashchange", router);
    router();
  }
  window.MIAO_HL = (function () {          /* 自测用：正文高光不碰 DOM，喂一段代码就能验「剥掉 span 必须逐字等于原文」 */
    return { code: hlCode, py: hlPy, js: hlJs, html: hlHtml, css: hlCss, json: hlJson,
      yaml: hlYaml, ini: hlIni, text: hlText, shell: hlShell, cpp: hlCpp,
      /* 考场编辑器（code-editor.js）的 C++ 那把尺与共用的补全表读这两份词表 —— 关键字表只许这一处有 */
      cppKw: CPP_KW, cppTy: CPP_TYPES };
  })();
  document.addEventListener("DOMContentLoaded", init);
})();
