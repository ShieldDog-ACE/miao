/* 喵站 · 视频界面（点导航「视频」才注入这一份，首屏不含）
 *
 * 这一版就三件事：简介、合集、介绍。界面按他给的那两张截图裁出来的最小集：
 *   左上角那块最大的屏 = 播放器，水印在屏内左上；下面接标题、简介（带相关分类）、介绍；
 *   右边一栏只剩合集（第几条 / 共几条 + 每条的时长），当前这条高亮；
 *   每条视频右下角只有那三个点，点开就两项：下载至本地、收藏。
 * 刻意没有的：广告、弹幕、关注、点赞投币收藏数、UP 主信息卡、评论区。
 *   站内没有账号也没有后台，那些计数位取不到数 —— 摆上去就是假数据，不如不摆。
 *
 * 数据在 assets/data/videos.js（window.MIAO_VIDEOS），素材在 assets/video/ 下面。
 * 收藏落本机 localStorage（键 miao_video_favs，总表在 data.js），换设备会丢，这是纯静态站的代价。
 */
(function (root) {
  "use strict";

  var API = root.MIAO_API;
  var DOC = root.document;

  /* ---------------- 小工具 ---------------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function url(p) { return root.MIAO_URL ? root.MIAO_URL(p) : p; }
  function toast(m) { if (root.MIAO_TOAST) root.MIAO_TOAST(m); }
  function isFile() { return String(root.location.protocol) === "file:"; }
  /* file:// 下「下载至本地」要给人这素材在本机的真实路径。
     这一串从当前页面地址现算（素材就在站内 assets/video/ 下），不写死在数据里 ——
     写死了，别人换个地方克隆下来就给错路径。 */
  function localPath(v) {
    try {
      return decodeURIComponent(new URL(url(v.src), root.location.href).pathname);
    } catch (e) { return url(v.src); }
  }

  /* 时长：数据里存的是从 mp4 的 mvhd 读出来的秒数（带小数），这里只负责摆成人看的样 */
  function fmtDur(sec) {
    var s = Math.max(0, Math.round(Number(sec) || 0));
    var m = Math.floor(s / 60);
    return (m < 10 ? "0" : "") + m + ":" + (s % 60 < 10 ? "0" : "") + (s % 60);
  }
  function fmtSize(b) {
    b = Number(b) || 0;
    return b >= 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB";
  }

  /* ---------------- 数据摊平 ---------------- */
  var COLS = [], BY_ID = {}, ORDER = [];
  function mount(raw) {
    COLS = (raw && raw.collections) || [];
    BY_ID = {}; ORDER = [];
    COLS.forEach(function (c) {
      (c.videos || []).forEach(function (v) {
        v.col = c;                                   /* 每条都记住自己属于哪个合集：卡片与右栏都要用 */
        /* 分类与首页共享同一张表：条目没写就跟着合集走。值必须是 site.js categories 里的小类，
           这不是洁癖 —— 分类词一自造，首页那一栏就筛不到它。 */
        v.cats = (v.cats && v.cats.length) ? v.cats : (c.cats || []);
        BY_ID[v.id] = v; ORDER.push(v);
      });
    });
    ORDER.sort(function (a, b) { return (a.no || 0) - (b.no || 0); });
    return { cols: COLS, byId: BY_ID, all: ORDER };
  }

  /* 首页那张分类表（大类 → 小类）：视频这一栏照它摆，不另起一套词 */
  function catTree() {
    var s = root.MIAO_SITE || {};
    return s.categories || {};
  }
  function catHas(c) {
    var t = catTree();
    for (var k in t) if ((t[k] || []).indexOf(c) >= 0) return true;
    return false;
  }

  /* ---------------- 收藏（本机） ---------------- */
  function favIds() { return (API && API.videoFavs) ? API.videoFavs() : []; }
  function isFav(id) { return favIds().indexOf(id) >= 0; }
  function toggleFav(id) {
    var list = favIds(), on = list.indexOf(id) >= 0;
    if (on) list = list.filter(function (x) { return x !== id; });
    else list.push(id);
    if (API && API.setVideoFavs) API.setVideoFavs(list);
    toast(on ? "已取消收藏" : "已收藏到这台设备：「" + (BY_ID[id] ? BY_ID[id].name : id) + "」");
    return !on;
  }

  /* ---------------- 下载至本地 ---------------- */
  var DLMODAL = null;
  function download(v) {
    if (isFile()) { localPathModal(v); return; }
    var a = DOC.createElement("a");
    a.href = url(v.src);
    a.download = v.id + ".mp4";
    DOC.body.appendChild(a); a.click(); a.remove();
    toast("浏览器正在下载：" + v.name + "（" + fmtSize(v.size) + "）");
  }
  /* file:// 这条路：浏览器不许把本地文件另存为，硬点一下只会白忙。
     所以这里不装作在下载，把素材在这台机器上的真实路径摊开来给人复制走。 */
  function localPathModal(v) {
    closeMenu();
    if (DLMODAL) { DLMODAL.remove(); DLMODAL = null; }
    var mask = DOC.createElement("div");
    mask.className = "mask";
    mask.innerHTML =
      '<div class="modal card v-path-pop">' +
      "<h3>这条视频本来就在本机</h3>" +
      '<p class="sub">页面是用 file:// 直接打开的，浏览器不能把本地文件另存为。' +
      '素材在工程目录里，路径在下面，复制过去就能直接打开。</p>' +
      '<code class="v-path" id="vPathText">' + esc(localPath(v)) + "</code>" +
      '<div class="v-path-ops">' +
      '<button class="btn btn-ghost btn-sm" id="vPathCopy" type="button">复制路径</button>' +
      '<button class="btn btn-primary btn-sm" id="vPathClose" type="button">知道了</button>' +
      "</div></div>";
    DOC.body.appendChild(mask);
    DLMODAL = mask;
    function close() { mask.remove(); if (DLMODAL === mask) DLMODAL = null; }
    $("#vPathClose", mask).onclick = close;
    $("#vPathCopy", mask).onclick = function () {
      copyText(localPath(v), this, function (ok) { toast(ok ? "路径已复制到剪贴板" : "复制没成功，路径在上面，手动选中复制"); });
    };
    mask.onclick = function (e) { if (e.target === mask) close(); };
  }
  function copyText(t, btn, done) {
    function fb() {
      var ta = DOC.createElement("textarea");
      ta.value = t; ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:-999px;opacity:0";
      DOC.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = DOC.execCommand("copy"); } catch (e) { ok = false; }
      ta.remove(); done(!!ok);
    }
    if (root.navigator && root.navigator.clipboard && root.navigator.clipboard.writeText) {
      root.navigator.clipboard.writeText(t).then(function () { done(true); }, fb);
    } else fb();
    if (btn) { btn.textContent = "已复制"; setTimeout(function () { btn.textContent = "复制路径"; }, 1400); }
  }

  function $(s, r) { return (r || DOC).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || DOC).querySelectorAll(s)); }

  /* ---------------- 那三个点 ---------------- */
  var MENU = null, MENU_OWNER = null;
  var DOTS = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.9"></circle>' +
    '<circle cx="12" cy="12" r="1.9"></circle><circle cx="19" cy="12" r="1.9"></circle></svg>';

  function closeMenu() {
    if (MENU) { MENU.remove(); MENU = null; }
    if (MENU_OWNER) { MENU_OWNER.classList.remove("on"); MENU_OWNER = null; }
  }
  function openMenu(btn, v) {
    var reopen = MENU_OWNER === btn;
    closeMenu();
    if (reopen) return;
    if (!v) return;
    var on = isFav(v.id);
    var box = DOC.createElement("div");
    box.className = "v-menu";
    box.innerHTML =
      '<button class="v-menu-item" type="button" data-act="fav">' + (on ? "已收藏 · 取消收藏" : "收藏") + "</button>" +
      '<button class="v-menu-item" type="button" data-act="dl">下载至本地</button>';
    DOC.body.appendChild(box);
    var r = btn.getBoundingClientRect();
    /* 菜单往左上贴：按钮在卡片右下角，往下长会顶出屏幕 */
    var top = r.bottom + root.scrollY + 4;
    var left = r.right + root.scrollX - box.offsetWidth;
    if (r.bottom + box.offsetHeight > root.innerHeight && top - box.offsetHeight - r.height - 8 > root.scrollY) {
      top = r.top + root.scrollY - box.offsetHeight - 4;
    }
    if (left < root.scrollX + 8) left = root.scrollX + 8;
    box.style.top = top + "px"; box.style.left = left + "px";
    btn.classList.add("on"); MENU_OWNER = btn; MENU = box;
    $all(".v-menu-item", box).forEach(function (it) {
      it.onclick = function (e) {
        e.stopPropagation(); closeMenu();
        if (it.dataset.act === "fav") {
          toggleFav(v.id);
          /* 列表页没有正在播的东西，整屏重画最省事 —— 「收藏 N」那个数跟着一起变；
             播放页不能重画，那会把正在播的那一条打断，只就地改标记。 */
          if (LAST.view === "list") vList(LAST.el, LAST.params);
          else syncFavState(v.id);
        } else download(v);
      };
    });
  }
  /* 收藏状态变了：页面上所有指向这条视频的标记都要跟着改，不能只改菜单里那一行字 */
  function syncFavState(id) {
    $all('[data-fav="' + id + '"]').forEach(function (el) {
      el.classList.toggle("faved", isFav(id));
    });
  }

  /* 当前停在哪一屏：收藏完要不要重画，看的就是这个（列表重画，播放页不重画） */
  var LAST = { view: "", el: null, params: null };

  DOC.addEventListener("click", function (e) {
    if (MENU && MENU_OWNER && !MENU.contains(e.target) && e.target !== MENU_OWNER) closeMenu();
  });
  root.addEventListener("scroll", closeMenu, true);
  root.addEventListener("resize", closeMenu);
  DOC.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeMenu(); if (DLMODAL) { DLMODAL.remove(); DLMODAL = null; } }
  });
  /* 换页（含键盘回车触发的跳转）：菜单与说明弹层都贴在 body 上，不跟着路由收掉就会盖住新页面 */
  root.addEventListener("hashchange", function () {
    closeMenu();
    if (DLMODAL) { DLMODAL.remove(); DLMODAL = null; }
  });

  /* ---------------- 封面：有 PNG 用 PNG，没 PNG 就拿这条视频的首帧顶上去 ---------------- */
  function coverHtml(v) {
    if (v.cover) {
      return '<img class="v-cover-img" src="' + esc(url(v.cover)) + '" alt="' + esc(v.name) + ' 的封面" loading="lazy">';
    }
    /* 没登记封面的那一条：尺寸与裁切都跟着 .v-cover-img 那一条规则走，这里只换个元素 */
    return '<video class="v-cover-img" src="' + esc(url(v.src)) + '" preload="metadata" muted playsinline tabindex="-1" aria-hidden="true"></video>';
  }

  function cardHtml(v, big) {
    var href = "#/video/" + encodeURIComponent(v.id);
    /* 不再挂 .card：那块面板底 + 描边 + 圆角就是他说的「灰色的圆角方框」。
       封面自己带圆角，文字直接落在页面底色上，跟那两张参考图一样。 */
    return '<article class="v-card' + (big ? " v-big" : "") + (isFav(v.id) ? " faved" : "") + '" data-fav="' + esc(v.id) + '">' +
      '<a class="v-cover" href="' + href + '">' + coverHtml(v) + "</a>" +
      /* 简介与题目互换了位置，字号与颜色也跟着换过去：
         第一行是简介（大、主文本色），第二行是题目 + 时长（小、次级色），三个点提到这一行的右端。
         发布时间不再摆在列表卡上（播放页那条元信息里还有）。 */
      '<div class="v-body">' +
      '<p class="v-brief">' + esc(v.brief) + "</p>" +
      '<div class="v-foot">' +
      '<a class="v-name" href="' + href + '">' + esc(v.name) + "</a>" +
      '<span class="v-sub">' + fmtDur(v.dur) + "</span>" +
      '<span class="v-faved-tag">已收藏</span>' +
      '<button class="v-more" type="button" aria-label="更多操作">' + DOTS + "</button>" +
      "</div></div></article>";
  }

  /* ---------------- 列表页：#/video ----------------
     这一栏与首页一模一样：.filter-bar / .cat-group / .cat-head（全部 + 收起分类）/ .cat-body
     （.cat-row 用大类当行标题、小类当 chip）。分类表共享 site.js 那一张，点一下定、再点取消。
     收藏不在这排 —— 它是每条右下角那三个点里的动作，不是一种筛法。
     页面标题、网格与卡片是视频自己的一套类，不跟首页共用。 */
  function vList(el, params) {
    params = params || {};
    var cat = params.cat || "";
    LAST.view = "list"; LAST.el = el; LAST.params = params;
    var catOpen = true;
    try { catOpen = JSON.parse(localStorage.getItem("miao_catOpen") || "true") !== false; } catch (e) { catOpen = true; }
    var list = ORDER.filter(function (v) {
      return !cat || v.cats.indexOf(cat) >= 0;
    });
    /* 筛法全走链接：能前进后退、能右键新开；点亮着的那个分类就是取消它 */
    function href2(c2) {
      return "#/video" + (c2 ? "?cat=" + encodeURIComponent(c2) : "");
    }
    /* 「全部」右边不显示数量 —— 首页那颗也只写「全部」，这一排两样才对得上（2026-11-06 他让删的） */
    var head = '<a class="chip on" href="' + href2(cat) + '">全部</a>' +
      '<span class="cat-toggle" id="vCatToggle" role="button" tabindex="0" aria-expanded="' + (catOpen ? "true" : "false") + '">' +
      (catOpen ? "收起分类" : "展开分类") + "</span>";

    var tree = catTree();
    var rows = Object.keys(tree).map(function (big) {
      return '<div class="cat-row"><span class="cat-big">' + esc(big) + "</span>" +
        (tree[big] || []).map(function (c) {
          var on = c === cat;
          return '<a class="chip' + (on ? " on" : "") + '" href="' + href2(on ? "" : c) + '">' + esc(c) + "</a>";
        }).join("") + "</div>";
    }).join("");

    el.innerHTML =
      '<div class="container video-page">' +
      '<h1 class="v-page-title">视频</h1>' +
      '<div class="filter-bar"><div class="cat-group">' +
      '<div class="cat-head">' + head + "</div>" +
      '<div class="cat-body' + (catOpen ? "" : " hidden") + '" id="vCatBody">' + rows + "</div>" +
      "</div></div>" +
      /* 布局回到上一版：第一条占大格（3 列 × 2 行），其余一格一张 */
      (list.length ? '<div class="v-grid">' + list.map(function (v, i) { return cardHtml(v, i === 0); }).join("") + "</div>"
        : '<div class="empty">这个分类下还没有登记成片。</div>') +
      "</div>";

    /* 收起 / 展开：与首页共用同一个开关（miao_catOpen），一处收起两处都收起 */
    var tg = $("#vCatToggle", el);
    if (tg) tg.onclick = function () {
      var bodyEl = $("#vCatBody", el);
      var nowOpen = bodyEl.classList.toggle("hidden") === false;
      tg.textContent = nowOpen ? "收起分类" : "展开分类";
      tg.setAttribute("aria-expanded", nowOpen ? "true" : "false");
      try { localStorage.setItem("miao_catOpen", JSON.stringify(nowOpen)); } catch (e) { /* 存不下就算了 */ }
    };

    $all(".v-card", el).forEach(function (card) {
      var v = BY_ID[card.dataset.fav];
      $(".v-more", card).onclick = function (e) { e.preventDefault(); e.stopPropagation(); openMenu(this, v); };
    });
  }

  /* ---------------- 播放页：#/video/<id> ---------------- */
  function vWatch(el, id) {
    var v = BY_ID[id];
    if (!v) {
      el.innerHTML = '<div class="container"><div class="empty" style="padding:80px 0">' +
        "没有这条视频：" + esc(id) + '<div style="margin-top:14px"><a class="btn btn-primary btn-sm" href="#/video">回视频列表</a></div></div></div>';
      return;
    }
    var c = v.col;
    LAST.view = "watch"; LAST.el = el; LAST.params = { id: id };
    var eps = (c.videos || []).slice().sort(function (a, b) { return (a.no || 0) - (b.no || 0); });
    var idx = eps.indexOf(v);
    var src = url(v.src);
    /* 播放器一进来不能是一块纯黑：拿 media fragment 让浏览器解到第 1 秒那一帧当定格画面。
       代价是这条 URL 带了个 #t=1 —— 下载与合集用的还是 v.src 原串，不受影响。 */
    var srcAt = src + "#t=1";
    /* 元信息一行只摆取得到数的东西：日期、时长、分辨率、文件大小。
       播放量 / 点赞 / 投币那种站内根本没有对应存储，摆上去就是假数据。 */
    var metaBits = [esc(v.date || ""), fmtDur(v.dur),
      (v.w && v.h ? v.w + "×" + v.h : ""), fmtSize(v.size)].filter(Boolean)
      .join('<span class="m-sep">·</span>');

    var epHtml = eps.map(function (x, i) {
      var cur = x.id === v.id;
      return '<li class="v-ep' + (cur ? " on" : "") + (isFav(x.id) ? " faved" : "") + '" data-fav="' + esc(x.id) + '">' +
        '<a href="#/video/' + encodeURIComponent(x.id) + '">' +
        '<span class="v-ep-no">' + (cur ? '<i class="v-play-bar"></i>' : String(i + 1).padStart(2, "0")) + "</span>" +
        '<span class="v-ep-nm">' + esc(x.name) + "</span>" +
        '<span class="v-ep-du">' + fmtDur(x.dur) + "</span></a>" +
        '<button class="v-more" type="button" aria-label="更多操作">' + DOTS + "</button></li>";
    }).join("");

    /* 相关分类就是共享那张表里的小类（条目没写就跟着合集走），点它回列表页按这个分类筛。
       不在表里的词一律不摆 —— 自造分类首页筛不到，摆出来就是个假标签。 */
    var catList2 = (v.cats || []).filter(catHas);

    el.innerHTML =
      '<div class="container video-page watch">' +
      '<div class="v-layout">' +
      '<div class="v-main">' +
      /* 屏的头上只留标题 → 元信息 → 简介，字都给大了；介绍与相关分类挪到屏下面（他这一轮点的两条）。
         这几段照样不起小标题、不画分隔线。 */
      '<div class="v-title-row"><h1>' + esc(v.name) + "</h1>" +
      '<button class="v-more v-title-more" type="button" aria-label="更多操作">' + DOTS + "</button></div>" +
      '<div class="v-meta">' + metaBits + "</div>" +
      '<div class="v-desc"><p>' + esc(v.brief) + "</p></div>" +

      /* 左上角那块最大的屏：格子比例由素材自己的 w/h 算（这条是 1920×1080 就是 16:9），
         不写死 16:9，也不拿 3×4 的封面当 poster 顶进去 —— 那样两边会多出两条黑边，看着就是「比例不对」。
         封面只管列表那张卡，播放器这里让它自己出首帧。 */
      '<div class="v-player">' +
      '<video id="vPlayer" src="' + esc(srcAt) + '" controls playsinline preload="metadata"' +
      (v.w && v.h ? ' style="aspect-ratio:' + v.w + "/" + v.h + '"' : "") + "></video>" +
      '<div class="v-mark" aria-hidden="true">' +
      '<svg viewBox="0 0 32 32" width="20" height="20"><circle cx="16" cy="16" r="15" fill="#e75490"></circle>' +
      '<text x="16" y="21" font-size="13" text-anchor="middle" fill="#fff" font-family="sans-serif" font-weight="bold">喵</text></svg>' +
      "<b>喵站</b><span>MIAO&nbsp;DEV</span></div>" +
      "</div>" +

      '<div class="v-after">' +
      "<p>" + esc(c.brief) + "</p>" +
      (c.desc ? "<p>" + esc(c.desc) + "</p>" : "") +
      '<div class="v-tags">' + catList2.map(function (t) {
        return '<a class="v-tag" href="#/video?cat=' + encodeURIComponent(t) + '">' + esc(t) + "</a>";
      }).join("") + "</div></div>" +
      "</div>" +

      /* 右边这一栏只剩合集：广告、弹幕列表、UP 主信息与关注都不在这里。
         合集那两句话上面已经写过了，这里不再重复一遍。 */
      '<aside class="v-side"><div class="card v-col-box">' +
      '<div class="v-col-head"><b>' + esc(c.title) + "</b>" +
      '<span class="v-col-count">' + (idx + 1) + " / " + eps.length + "</span></div>" +
      '<ol class="v-eps">' + epHtml + "</ol>" +
      "</div></aside>" +
      "</div></div>";

    var more = $(".v-title-more", el);
    more.onclick = function (e) { e.preventDefault(); e.stopPropagation(); openMenu(this, v); };
    $all(".v-ep", el).forEach(function (li) {
      var x = BY_ID[li.dataset.fav];
      $(".v-more", li).onclick = function (e) { e.preventDefault(); e.stopPropagation(); openMenu(this, x); };
    });
    /* 换集：整屏重画，播放器跟着换 src；旧的那条继续播会串声，所以先停 */
    var p = $("#vPlayer", el);
    if (p) p.addEventListener("error", function () {
      toast("这条视频没加载上：检查 assets/video/ 下面的素材还在不在");
    });
  }

  root.MIAO_VIDEO_UI = {
    vList: vList, vWatch: vWatch,
    mount: mount,
    /* 自测口子：三个点菜单的开关状态，测试里用它确认「点了没反应」这种死件没回来 */
    _menu: function () { return !!MENU; }
  };
})(typeof window !== "undefined" ? window : globalThis);
