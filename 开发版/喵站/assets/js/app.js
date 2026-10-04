/* 喵站 V1.2 · Hash 路由 + 视图 + 主题 + 本地状态
   V1.2 变更：img/audio 内容块 · 关注粉丝系统 · 编辑资料入口 ·
   我的作品 Tab（计数+最左） · 用户描述默认值 · 后台双击打开文档 */
(function () {
  "use strict";

  /* 教程正文只来自后端：/api/meta 下发分类、/api/tutorials 下发目录、
     章节接口按窗口下发正文。前端不再内置任何种子副本，
     否则静态文件可被直接下载，防爬与分层加载会形同虚设。 */
  var DATA = window.MIAO_DATA || { categories: {}, tutorials: [] };
  var TUTS = DATA.tutorials || [];
  var API = window.MIAO_API;

  /* 分类：层级对象 { 大类: [小类] } → 拍平成小类列表（供 chips/下拉/默认值） */
  function catList() {
    if (Array.isArray(DATA.categories)) return DATA.categories;
    var out = [];
    for (var k in DATA.categories) out = out.concat(DATA.categories[k] || []);
    return out;
  }

  /* ---------------- 后端对接层 ----------------
     - 所有数据来自后端 /api（不再使用本地假数据）
     - 会话由 HttpOnly Cookie 维持；写操作由 api.js 自动签名
     - 后端不可用时给出明确提示，而不是退回假数据 */
  var BE = {
    ready: false,
    error: null,
    relations: {},        // 用户名 → { followed, followsMe, friend }
    userProfile: null,    // 当前查看的用户主页数据
    friends: null,        // 好友页数据
    works: null,          // 我的作品
    detail: null,
    loadUser: function (name) {
      return API.get("/api/users/" + encodeURIComponent(name)).then(function (d) {
        BE.userProfile = d;
        BE.relations[name] = d.relation;
        return d;
      });
    },
    loadFriends: function () {
      return API.get("/api/friends").then(function (d) { BE.friends = d; return d; });
    },
    loadWorks: function () {
      return API.get("/api/my/works").then(function (d) { BE.works = d; return d; });
    },
    loadMeta: function () {
      return API.get("/api/meta").then(function (d) {
        if (d.categories) DATA.categories = d.categories;
        /* 英语模块数据（26 字母 / 48 音标）由后端 en-data.js 经 /api/meta 下发，
           前端不保留副本 —— 与「正文只来自后端」保持一致 */
        if (d.en) { EN.letters = d.en.letters || []; EN.phonemes = d.en.phonemes || []; EN.groups = d.en.groups || []; }
        BE.mailReady = !!d.mailReady;
        return d;
      });
    },
    loadMe: function () {
      return API.get("/api/me").then(function (d) {
        if (d.user) {
          state.user = { id: d.user.id, name: d.user.name, email: d.user.email, desc: d.user.descr, role: d.user.role, color: (state.user && state.user.color) || 0, avatarImg: d.user.avatar || (state.user && state.user.avatarImg) || null };
          state.teacher = !!d.user.teacher;
          state.applied = !!d.user.applied;
        } else {
          state.user = null; state.teacher = false; state.applied = false;
        }
        state.counts = d.counts || null;
        renderNavRight();
        return state.user;
      });
    },
    loadFavs: function () {
      return API.get("/api/my/favs").then(function (d) { BE.favs = d; return d; });
    },
    logout: function () {
      return API.post("/api/auth/logout").catch(function () { }).then(function () {
        state.user = null; state.teacher = false; state.counts = null;
        renderNavRight();
      });
    },
    loadTutorials: function () {
      return API.get("/api/tutorials?size=50").then(function (d) {
        DATA.tutorials = d.items || [];
        TUTS = DATA.tutorials;
        return TUTS;
      });
    },
    /* 详情（含正文，仅登录后下发），结果并入本地缓存，视图仍同步读取 */
    ensureTutorial: function (id) {
      return API.get("/api/tutorials/" + encodeURIComponent(id)).then(function (d) {
        var t = d.tutorial, i = -1;
        for (var k = 0; k < TUTS.length; k++) if (TUTS[k].id === t.id) i = k;
        t.locked = !!d.locked;
        t.faved = !!d.faved;
        t.relation = d.relation || null;
        t.progress = d.progress || [];
        if (i >= 0) TUTS[i] = Object.assign({}, TUTS[i], t); else TUTS.push(t);
        BE.detail = t;
        return t;
      });
    },
    find: function (id) {
      for (var i = 0; i < TUTS.length; i++) if (TUTS[i].id === id) return TUTS[i];
      return null;
    },
    /* 章节正文：分层加载（每次约 2000 字），offset 之前的内容保留在本地缓存 */
    chapterWin: {},
    loadChapter: function (id, cid, offset) {
      var off = Math.max(0, Number(offset) || 0);
      return API.get("/api/tutorials/" + encodeURIComponent(id) + "/chapters/" + encodeURIComponent(cid) +
          "?offset=" + off)
        .then(function (d) {
          var t = BE.find(id);
          if (!t) { t = { id: id, title: d.title, chapters: [] }; TUTS.push(t); }
          if (!t.chapters) t.chapters = [];
          var found = false;
          for (var i = 0; i < t.chapters.length; i++) {
            if (t.chapters[i].id === d.chapter.id) {
              if (off > 0 && t.chapters[i].blocks) t.chapters[i].blocks = t.chapters[i].blocks.concat(d.chapter.blocks);
              else t.chapters[i] = d.chapter;
              found = true;
            }
          }
          if (!found) t.chapters.push(d.chapter);
          BE.chapterWin[id + ":" + cid] = d.window || null;
          return d.chapter;
        });
    },
    boot: function () {
      return BE.loadMeta()
        .then(function () { return BE.loadMe(); })
        .then(function () { return BE.loadTutorials(); })
        .then(function () { BE.ready = true; })
        .catch(function (e) {
          BE.error = e;
          console.error("[后端连接失败]", e);
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

  var state = {
    theme: store.get("theme", "auto"),           // light | dark | auto
    user: store.get("user", null),               // {name, email, desc, color, avatarImg}
    progress: store.get("progress", {}),         // {tid: [cid]}
    favs: store.get("favs", []),                 // [tid]
    applied: store.get("applied", false),        // 老师申请已提交
    fs: store.get("fs", 15),
    follows: store.get("follows", []),           // 关注的作者 [name]
    teacher: store.get("teacher", false),        // 已成为老师（审核通过）
    draft: store.get("draft", null),             // 创作中心草稿
    editorMode: store.get("editorMode", "gui"),  // gui | code
    codeZoom: store.get("codeZoom", 100),        // 代码编辑器缩放（%）
    codeHeight: store.get("codeHeight", 420),    // 代码编辑器高度（px，可拖拽调整）
    codeWidth: store.get("codeWidth", 100),      // 代码编辑器宽度（%，可拖拽调整）
    codePos: store.get("codePos", null),         // 编辑器窗口拖动位置
    files: store.get("files", null),             // 代码编辑器虚拟文件（文件管理器）
    activeFile: store.get("activeFile", "tutorial.json"),
    friends: store.get("friends", []) || [],     // 兼容旧本地缓存的兜底
    friendReqs: store.get("friendReqs", []) || []
  };
  if (!state.files) state.files = [{ name: "tutorial.json", text: "" }];

  function save() {
    store.set("theme", state.theme); store.set("user", state.user);
    store.set("progress", state.progress); store.set("favs", state.favs);
    store.set("applied", state.applied);
    store.set("fs", state.fs); store.set("follows", state.follows);
    store.set("teacher", state.teacher);
    store.set("draft", state.draft); store.set("editorMode", state.editorMode);
    store.set("codeZoom", state.codeZoom);
    store.set("codeHeight", state.codeHeight);
    store.set("codeWidth", state.codeWidth);
    store.set("codePos", state.codePos); store.set("files", state.files);
    store.set("activeFile", state.activeFile);
    store.set("friends", state.friends); store.set("friendReqs", state.friendReqs);
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
  function fmtNum(n) { return n >= 10000 ? (n / 10000).toFixed(1) + " 万" : String(n); }
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
  function tut(id) { for (var i = 0; i < TUTS.length; i++) if (TUTS[i].id === id) return TUTS[i]; return null; }
  function chap(t, cid) { for (var i = 0; i < t.chapters.length; i++) if (t.chapters[i].id === cid) return t.chapters[i]; return null; }
  function doneSet(tid) { return state.progress[tid] || []; }
  function isDone(tid, cid) { return doneSet(tid).indexOf(cid) >= 0; }
  function tutProgress(t) { return t.chapters.length ? Math.round(doneSet(t.id).length / t.chapters.length * 100) : 0; }

  /* 用户资料：一律以后端真实数据为准，无本地模拟 */
  function avCls(name) { var n = 0; for (var i = 0; i < String(name).length; i++) n += String(name).charCodeAt(i); return "avc" + (n % 6); }
  function tutFavs(t) { return t.favs != null ? t.favs : Math.round((t.students || 0) * 0.07); }
  /* 关系一律以后端返回为准（BE.relations 由 /api/users/:name、/api/follow 等填充） */
  function isFriend(name) {
    var r = BE.relations[name];
    return r ? !!r.friend : (state.friends || []).indexOf(name) >= 0;
  }
  function isFollowed(name) {
    var r = BE.relations[name];
    return r ? !!r.followed : (state.follows || []).indexOf(name) >= 0;
  }
  function followsMeOf(name) {
    var r = BE.relations[name];
    return r ? !!r.followsMe : false;
  }
  /* 关注 / 取关 / 加好友 / 移除好友：全部走后端，好友＝互关由后端保证 */
  function doFollow(name) {
    return API.post("/api/follow", { name: name }).then(function (d) { BE.relations[name] = d.relation; return d; });
  }
  function doUnfollow(name) {
    return API.post("/api/unfollow", { name: name }).then(function (d) { BE.relations[name] = d.relation; return d; });
  }
  function doRemoveFriend(name) {
    return API.post("/api/friends/remove", { name: name }).then(function (d) { BE.relations[name] = d.relation; return d; });
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
  function goLogin(actionDesc) {
    if (location.hash === "#/login") { vLogin(actionDesc); return; }
    sessionStorage.setItem("miao_ret", location.hash);
    location.hash = "#/login";
  }

  /* 登录引导弹层（游客受限动作） */
  function needLogin(actionDesc) {
    if (state.user) return false;
    var mask = document.createElement("div");
    mask.className = "mask";
    mask.innerHTML =
      '<div class="modal card">' +
      "<h3>登录后继续</h3>" +
      "<p>" + esc(actionDesc) + "需要登录账号，数据将云端同步。<br>游客也可以继续自由浏览全部教程。</p>" +
      '<div class="row">' +
      '<button class="btn btn-primary" id="mGo">去登录</button>' +
      '<button class="btn btn-ghost" id="mSkip">暂不登录</button>' +
      "</div></div>";
    document.body.appendChild(mask);
    $("#mGo", mask).onclick = function () { sessionStorage.setItem("miao_ret", location.hash); location.hash = "#/login"; mask.remove(); };
    $("#mSkip", mask).onclick = function () { mask.remove(); toast("好的，继续游客浏览"); };
    mask.onclick = function (e) { if (e.target === mask) mask.remove(); };
    return true;
  }

  /* 编辑资料弹层：头像（上传 / 预设底色）+ 昵称 + 个人描述 */
  function editProfile() {
    if (!state.user) return;
    var u = state.user;
    var tmpColor = u.color || 0;
    var tmpImg = u.avatarImg || null;
    var mask = document.createElement("div");
    mask.className = "mask";
    function previewHtml() {
      if (tmpImg) return '<span class="avatar" style="width:56px;height:56px;background-image:url(' + tmpImg + ');background-size:cover;background-position:center"></span>';
      return '<span class="avatar avc' + tmpColor + '" style="width:56px;height:56px;font-size:1.3rem">' + esc((u.name || "?").slice(0, 1).toUpperCase()) + "</span>";
    }
    var dots = "";
    for (var i = 0; i < 6; i++) dots += '<span class="color-dot avc' + i + '" data-i="' + i + '"></span>';
    mask.innerHTML =
      '<div class="modal card" style="width:400px;text-align:left">' +
      "<h3>编辑资料</h3>" +
      '<div style="display:flex;gap:16px;align-items:center;margin:16px 0">' +
      '<span id="epPv">' + previewHtml() + "</span>" +
      "<div>" +
      '<button class="btn btn-ghost btn-sm" id="epUp">上传头像</button>' +
      '<input type="file" id="epFile" accept="image/*" class="hidden">' +
      '<div class="muted small" style="margin:9px 0 5px">或选头像底色：</div>' +
      '<div style="display:flex;gap:8px" id="epDots">' + dots + "</div>" +
      "</div></div>" +
      '<div class="form-row"><label>昵称</label><input class="input" id="epName" value="' + esc(u.name) + '" maxlength="16"></div>' +
      '<div class="form-row"><label>个人描述</label><textarea class="input" id="epDesc" rows="2" placeholder="不填写默认为：这是个慵懒猫娘喵~">' + esc(u.desc || "") + "</textarea></div>" +
      '<div style="display:flex;gap:10px;justify-content:flex-end;margin-top:6px">' +
      '<button class="btn btn-ghost" id="epCancel">取消</button>' +
      '<button class="btn btn-primary" id="epSave">保存</button>' +
      "</div></div>";
    document.body.appendChild(mask);
    function refreshPv() {
      $("#epPv", mask).innerHTML = previewHtml();
      $all("#epDots .color-dot", mask).forEach(function (d) {
        d.classList.toggle("on", !tmpImg && parseInt(d.dataset.i, 10) === tmpColor);
      });
    }
    refreshPv();
    $("#epUp", mask).onclick = function () { $("#epFile", mask).click(); };
    $("#epFile", mask).onchange = function (e) {
      var f = e.target.files[0];
      if (!f) return;
      if (f.size > 800 * 1024) { toast("图片请小于 800KB"); return; }
      var rd = new FileReader();
      rd.onload = function () { tmpImg = rd.result; refreshPv(); };
      rd.readAsDataURL(f);
    };
    $all("#epDots .color-dot", mask).forEach(function (d) {
      d.onclick = function () { tmpColor = parseInt(d.dataset.i, 10); tmpImg = null; refreshPv(); };
    });
    $("#epCancel", mask).onclick = function () { mask.remove(); };
    mask.onclick = function (e) { if (e.target === mask) mask.remove(); };
    $("#epSave", mask).onclick = function () {
      var nm = $("#epName", mask).value.trim();
      if (!nm) { toast("昵称不能为空"); return; }
      var desc = $("#epDesc", mask).value.trim() || "这是个慵懒猫娘喵~";
      var payload = { name: nm, descr: desc };
      var go = function () {
        API.post("/api/me/profile", payload)
          .then(function (d) {
            state.user = { name: d.user.name, email: d.user.email, desc: d.user.descr, role: d.user.role, color: tmpColor, avatarImg: (payload.avatar ? payload.avatar : state.user.avatarImg) };
            save(); renderNavRight(); router(); mask.remove(); toast("资料已更新");
          })
          .catch(function (e) { toast(e.message || "保存失败"); });
      };
      if (tmpImg && tmpImg.indexOf("data:image/") === 0) {
        API.post("/api/upload", { dataUrl: tmpImg })
          .then(function (u) { payload.avatar = u.url; go(); })
          .catch(function (e) { toast(e.message || "头像上传失败"); });
      } else go();
    };
  }

  /* ---------------- 主题 ---------------- */
  /* matchMedia 缺失时（老浏览器 / 测试环境）降级为浅色，避免整站初始化中断 */
  var mq = (typeof window.matchMedia === "function") ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function applyTheme() {
    var t = state.theme;
    if (t === "auto") {
      t = (mq && mq.matches) ? "dark" : "light";
    }
    document.documentElement.setAttribute("data-theme", t);
    document.documentElement.style.setProperty("--fs-base", state.fs + "px");
    $all(".seg button").forEach(function (b) { b.classList.toggle("on", b.dataset.t === state.theme); });
    $all(".theme-card").forEach(function (c) { c.classList.toggle("on", c.dataset.t === state.theme); });
  }
  function setTheme(t) { state.theme = t; save(); applyTheme(); }
  if (mq && mq.addEventListener) mq.addEventListener("change", function () {
    if (state.theme === "auto") applyTheme();
  });

  /* ---------------- 导航栏 ---------------- */
  var GEAR_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>';

  function navAvatarBtn() {
    var u = state.user;
    if (u.avatarImg) {
      return '<button class="avatar" id="avBtn" title="个人中心" style="background-image:url(' + u.avatarImg + ');background-size:cover;background-position:center"></button>';
    }
    return '<button class="avatar ' + (u.color != null ? "avc" + u.color : "") + '" id="avBtn" title="个人中心">' + esc(u.name.slice(0, 1).toUpperCase()) + "</button>";
  }

  function renderNavRight() {
    var box = $("#navRight");
    var html =
      '<div class="drop-wrap">' +
      '<button class="icon-btn" id="gearBtn" title="设置" aria-label="设置">' + GEAR_SVG + "</button>" +
      '<div class="dropdown hidden" id="gearMenu">' +
      '<a class="dd-item" id="annItem">公告</a>' +
      '<div class="dd-title">外观主题</div>' +
      '<div class="seg" id="segInMenu">' +
      '<button data-t="light">浅色</button><button data-t="dark">深色</button><button data-t="auto">跟随系统</button>' +
      "</div>" +
      '<div class="dd-sep"></div>' +
      '<a class="dd-item" href="#/settings">全部设置</a>' +
      "</div></div>";

    if (state.user) {
      html +=
        '<div class="drop-wrap">' +
        navAvatarBtn() +
        '<div class="dropdown hidden" id="avMenu">' +
        '<div class="dd-title">' + esc(state.user.name) + " · " + esc(state.user.email) + "</div>" +
        '<a class="dd-item" href="#/me">个人中心</a>' +
        '<a class="dd-item" href="#/me">我的学习</a>' +
        '<a class="dd-item" href="#/friends">好友</a>' +
        (state.applied || state.teacher ? "" : '<a class="dd-item" href="#/apply">申请成为老师</a>') +
        '<a class="dd-item" href="#/settings">设置</a>' +
        '<div class="dd-sep"></div>' +
        '<button class="dd-item" id="btnLogout">退出登录</button>' +
        "</div></div>";
    } else {
      html += '<a class="btn btn-primary btn-sm" href="#/login" style="border-radius:999px">登录 / 注册</a>';
    }
    box.innerHTML = html;
    bindDrops();
    applyTheme();
  }

  function bindDrops() {
    var gm = $("#gearMenu"), am = $("#avMenu");
    var gb = $("#gearBtn"), ab = $("#avBtn");
    if (gb) gb.onclick = function (e) { e.stopPropagation(); if (am) am.classList.add("hidden"); gm.classList.toggle("hidden"); };
    if (ab) ab.onclick = function (e) { e.stopPropagation(); if (gm) gm.classList.add("hidden"); am.classList.toggle("hidden"); };
    $all("#segInMenu button").forEach(function (b) {
      b.onclick = function () { setTheme(b.dataset.t); toast("已切换主题"); };
    });
    var ann = $("#annItem");
    if (ann) ann.onclick = function (e) {
      e.stopPropagation();
      $all(".dropdown").forEach(function (d2) { d2.classList.add("hidden"); });
      API.get("/api/announcements").then(function (d) {
        var items = (d.items || []).map(function (a) {
          return '<div class="set-card" style="margin:0 0 12px"><b>' + esc(a.title) + "</b>" +
            '<div class="muted small">' + new Date(a.created_at).toLocaleString() + "</div>" +
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
    var lo = $("#btnLogout");
    if (lo) lo.onclick = function () {
      BE.logout().then(function () { router(); toast("已退出登录"); });
    };
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
    var eye = e.target && e.target.closest ? e.target.closest("[data-eye]") : null;
    if (eye) {
      e.preventDefault(); e.stopPropagation();
      var tt = tut(eye.dataset.eye);
      if (tt) openImagePreview(tt);
      return;
    }
    var usr = e.target && e.target.closest ? e.target.closest("[data-user]") : null;
    if (usr) {
      e.preventDefault(); e.stopPropagation();
      location.hash = "#/user/" + encodeURIComponent(usr.dataset.user);
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
      return '<div class="' + cls + ' has-img"><img class="cover-img" src="' + esc(src) + '" alt="' + esc(t.title) + ' 展示图" loading="lazy"></div>';
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
      '<div class="t-meta"><span class="t-author" data-user="' + esc(t.author) + '" title="查看 TA 的主页">' + esc(t.author) + "</span><span>·</span><span>" + fmtNum(t.students) + " 人在学</span>" +
      starBadge(tutFavs(t), false, "收藏人数") +
      '<span class="badge">' + esc(t.diff) + "</span></div>" +
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
      '<div class="img-stage"><img src="' + esc(src) + '" alt="' + esc(t.title) + ' 完整图"></div>' +
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

  function blockHtml(b, i) {
    if (b.t === "p") return "<p>" + inlineHtml(b.text) + "</p>";
    if (b.t === "h2") return '<h2 id="h2-' + i + '">' + esc(b.text) + "</h2>";
    if (b.t === "tip") return '<div class="tip-box' + tipCls(b) + '">' + inlineHtml(b.text) + "</div>";
    if (b.t === "ul") return "<ul>" + b.items.map(function (x) { return "<li>" + inlineHtml(x) + "</li>"; }).join("") + "</ul>";
    if (b.t === "code") {
      return '<div class="code-block"><div class="code-head"><span class="lang">' + esc(b.lang) + "</span>" +
        '<button class="copy-btn" data-code="' + esc(b.code) + '">复制</button></div>' +
        "<pre><code>" + esc(b.code) + "</code></pre></div>";
    }
    if (b.t === "img") {
      return '<figure class="art-img"><img src="' + esc(b.src) + '" alt="' + esc(b.alt || "") + '" loading="lazy">' +
        (b.caption ? '<figcaption class="cap">' + esc(b.caption) + "</figcaption>" : "") +
        "</figure>";
    }
    if (b.t === "audio") {
      var auSrc = b.src || demoWavSrc();
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
       卡片数据由 /api/meta 的 en 字段下发（后端 en-data.js），前端不留副本。 */
    if (b.t === "en") return enBlockHtml(b);
    return "";
  }

  /* ---------------- 英语学习卡片（正文内嵌，非独立页面） ----------------
     数据源：后端 /api/meta 的 en 字段（后端 en-data.js）→ BE.loadMeta() 填充。
     前端不存副本，仅在内存里保留当前会话的副本。 */
  var EN = { letters: [], phonemes: [], groups: [] };
  function enPlayBtn(a, label) {
    return '<button class="en-play" type="button" data-en-src="' + esc(a) + '" ' +
      'aria-label="播放' + esc(label) + '读音"><span class="en-ico">▶</span><span class="en-tx">读音</span></button>';
  }
  function enCardHtml(x, kind) {
    if (kind === "let") {
      return '<div class="en-card" data-en-k="' + esc(x.l) + '">' +
        '<div class="en-glyph">' + esc(x.l) + "</div>" +
        '<div class="en-meta"><div class="en-ipa">' + esc(x.ipa) + "</div>" +
        '<div class="en-cn">' + esc(x.cn) + "</div></div>" +
        enPlayBtn(x.a, x.l) + "</div>";
    }
    return '<div class="en-card en-card-ph" data-en-k="' + esc(x.ph) + '">' +
      '<div class="en-glyph en-ipa-lg">' + esc(x.ph) + "</div>" +
      '<div class="en-meta"><div class="en-cn">' + esc(x.cn) +
      (x.w ? ' <span class="en-w">' + esc(x.w) + "</span>" : "") + "</div>" +
      (x.tip ? '<div class="en-tip">' + esc(x.tip) + "</div>" : "") + "</div>" +
      enPlayBtn(x.a, x.ph) + "</div>";
  }
  function enBlockHtml(b) {
    var kind = b.kind || "ph", out = "";
    if (kind === "let") {
      var ls = EN.letters;
      if (!ls.length) return '<div class="en-none">字母数据未加载</div>';
      out = '<div class="en-grid">' + ls.map(function (x) { return enCardHtml(x, "let"); }).join("") + "</div>";
      return out;
    }
    if (kind === "ph") {
      var ps = EN.phonemes;
      if (!ps.length) return '<div class="en-none">音标数据未加载</div>';
      var grp = b.grp || "";
      var items = grp ? ps.filter(function (x) { return x.grp === grp; }) : ps;
      if (grp) {
        out += '<div class="en-group"><span class="en-gname">' + esc(grp) +
          '</span><span class="en-gcnt">' + items.length + ' 个</span></div>';
      }
      out += '<div class="en-grid">' + items.map(function (x) { return enCardHtml(x, "ph"); }).join("") + "</div>";
      return out;
    }
    return "";
  }

  /* 正文内英语卡片的播放：单例，同一时刻只播一个；离开页面时停掉 */
  var enCur = null;
  function enStop() {
    if (enCur) { enCur.pause(); enCur = null; }
    $all(".en-play.playing").forEach(function (b) { b.classList.remove("playing"); });
  }
  function enPlay(src, btn) {
    if (enCur && enCur.dataset.src === src) { enStop(); return; }
    enStop();
    var a = new Audio(src);
    a.dataset.src = src;
    enCur = a;
    btn.classList.add("playing");
    a.onended = function () { btn.classList.remove("playing"); };
    a.onerror = function () { btn.classList.remove("playing"); toast("音频加载失败：" + src); };
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
      return b.students - a.students;
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
    var rel = t.relation || {};
    var followed = isFollowed(t.author), friended = isFriend(t.author), authorFollowsMe = followsMeOf(t.author) || !!rel.followsMe;
    var followTxt = friended ? "已互关" : followed ? "取关" : authorFollowsMe ? "回关" : "＋ 关注";
    var followTip = friended ? "已互关，点击取消" : followed ? "点击取关" : authorFollowsMe ? "对方已关注你，点击回关" : "关注 TA";
    var favCount = t.favs != null ? t.favs : (tutFavs(t) + (fav ? 1 : 0));
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
      '<div class="tags"><span class="badge">' + esc(t.diff) + '</span>' + t.tags.map(function (x) { return '<span class="chip">' + esc(x) + "</span>"; }).join("") + "</div>" +
      '<p class="intro">' + esc(t.intro) + "</p>" +
      '<div class="ops">' + (nextC
        ? '<a class="btn btn-primary" href="#/read/' + t.id + "/" + nextC.id + '">' + (started ? "继续学习 · 已学 " + pct + "%" : "开始学习") + "</a>"
        : '<a class="btn btn-primary" href="#/login">登录后开始学习</a>') +
      '<button class="btn star-btn ' + (fav ? "on" : "ghost") + '" id="favBtn" title="' + (fav ? "已收藏，点击取消" : "收藏这门教程") + '">' +
      '<i class="star-ico">' + (fav ? "★" : "☆") + "</i>收藏<b>" + fmtStat(favCount) + "</b></button></div>" +
      "</div></div>" +
      '<div class="tut-cols">' +
      '<div class="chap-list card"><div style="padding:10px 14px 4px;font-weight:700">章节目录 · 共 ' + chapsN + " 章</div>" + chapItems + "</div>" +
      '<div class="side-card card">' +
      '<h3>作者 · 课程信息</h3>' +
      '<div class="author-row">' +
      '<span class="avatar ' + avCls(t.author) + '">' + esc(t.author.slice(0, 1)) + "</span>" +
      '<div style="flex:1;min-width:0"><div style="font-weight:600"><span class="t-author" data-user="' + esc(t.author) + '" title="查看 TA 的主页">' + esc(t.author) + "</span></div></div>" +
      '<button class="btn ' + (friended || followed ? "ghost" : "primary") + ' btn-sm" id="followBtn" style="flex-shrink:0"' +
      ' title="' + esc(followTip) + '">' + esc(followTxt) + "</button>" +
      "</div>" +
      '<div style="border-top:1px solid var(--border);margin:14px 0 12px"></div>' +
      '<div class="kv"><span>学习人数</span><span>' + fmtNum(t.students) + "</span></div>" +
      '<div class="kv"><span>收藏人数</span><span>' + fmtStat(favCount) + "</span></div>" +
      '<div class="kv"><span>章节数</span><span>' + chapsN + "</span></div>" +
      '<div class="kv"><span>难度</span><span>' + esc(t.diff) + "</span></div>" +
      '<div class="kv"><span>最近更新</span><span>' + esc(t.updated) + "</span></div>" +
      "</div></div></div>";

    $("#favBtn").onclick = function () {
      if (needLogin("收藏教程")) return;
      var turnOn = t.faved !== true;
      (turnOn ? API.post("/api/tutorials/" + t.id + "/fav") : API.del("/api/tutorials/" + t.id + "/fav"))
        .then(function (d) {
          t.faved = d.faved; t.favs = d.favs;
          vTutorial(params);
          toast(d.faved ? "已加入收藏" : "已取消收藏");
        })
        .catch(function (e) { toast(e.message || "操作失败"); });
    };
    $("#followBtn").onclick = function () {
      if (needLogin("关注作者")) return;
      var done2 = function (msg) {
        renderNavRight(); vTutorial(params);
        if (msg) toast(msg);
      };
      if (friended) {
        doRemoveFriend(t.author).then(function () { done2("已取消互关（同时移出好友）"); })
          .catch(function (e) { toast(e.message || "操作失败"); });
        return;
      }
      if (followed) {
        doUnfollow(t.author).then(function () { done2("已取消关注 " + t.author); })
          .catch(function (e) { toast(e.message || "操作失败"); });
        return;
      }
      doFollow(t.author).then(function (d) {
        if (d && d.relation && d.relation.friend) done2("已回关 " + t.author + " → 你们互相关注，成为好友");
        else done2("已关注 " + t.author + "，有更新会提醒你");
      }).catch(function (e) { toast(e.message || "操作失败"); });
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
    app.innerHTML =
      '<div class="read-wrap"><div class="read-grid">' +
      '<aside class="read-tree card"><div class="rt-title">' + esc(t.title) + "</div>" + tree + "</aside>" +
      '<article class="article">' +
      "<h1>" + esc(c.title) + "</h1>" +
      '<div class="art-meta">' + esc(t.title) + " · 第 " + (idx + 1) + "/" + t.chapters.length + " 章 · " + esc(t.author) + "</div>" +
      c.blocks.map(blockHtml).join("") +
      '<div class="art-ops">' +
      '<button class="btn ' + (done ? "soft" : "primary") + '" id="doneBtn">' + (done ? "✓ 已完成（点击取消）" : "完成！") + "</button>" +
      "</div>" +
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
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      };
    });
    $("#doneBtn").onclick = function () {
      var arr = state.progress[t.id] || (state.progress[t.id] = []);
      var i = arr.indexOf(c.id);
      if (i >= 0) { arr.splice(i, 1); toast("已取消完成标记"); }
      else {
        arr.push(c.id);
        if (!state.user) toast("已记录（游客模式，存于本地）");
        else if (t.chapters.every(function (x) { return arr.indexOf(x.id) >= 0; })) toast("恭喜！已学完整本「" + t.title + "」");
        else toast("本章已完成，进度已同步");
      }
      save(); vRead(params);
    };
  }

  function vSearch(params) {
    var q = (params.q || "").trim();
    var tab = params.tab || "tutorial";
    var ql = q.toLowerCase();
    var rTut = q ? TUTS.filter(function (t) { return (t.title + t.intro + t.tags.join("")).toLowerCase().indexOf(ql) >= 0; }) : [];
    var rChap = [];
    if (q) TUTS.forEach(function (t) {
      (t.chapters || []).forEach(function (c) {
        if ((c.title + " " + (c.blocks || []).map(function (b) { return b.text || b.code || (b.items || []).join(" "); }).join(" ")).toLowerCase().indexOf(ql) >= 0)
          rChap.push({ t: t, c: c });
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
        '<div class="t-meta">' + esc(t.author) + " · " + fmtNum(t.students) + ' 人在学</div></a>';
    }).join("") : '<div class="empty">没有找到相关教程，试试其他关键词</div>';
    else if (tab === "chapter") body = rChap.length ? rChap.map(function (r) {
      return '<a class="s-item card" href="#/read/' + r.t.id + "/" + r.c.id + '"><h4>' + hi(r.c.title) + "</h4><p>" + hi(r.t.title) + " · " + esc(r.t.author) + "</p></a>";
    }).join("") : '<div class="empty">没有找到相关章节</div>';
    else body = rAuth.length ? rAuth.map(function (a) {
      var ts = TUTS.filter(function (t) { return t.author === a; });
      return '<div class="s-item card"><h4>' + hi(a) + '</h4><p>发布教程 ' + ts.length + " 门：" + ts.map(function (t) { return '<a href="#/tutorial/' + t.id + '" style="color:var(--accent)">' + esc(t.title) + "</a>"; }).join("、") + "</p></div>";
    }).join("") : '<div class="empty">没有找到相关作者</div>';

    app.innerHTML =
      '<div class="container" style="max-width:820px">' +
      '<h1 class="page-title">搜索' + (q ? "：“" + esc(q) + "”" : "") + "</h1>" +
      '<div class="search-tabs">' +
      '<a class="chip' + (tab === "tutorial" ? " on" : "") + '" href="#/search?q=' + encodeURIComponent(q) + '&tab=tutorial">教程' + (q ? cnt(rTut.length) : "") + "</a>" +
      '<a class="chip' + (tab === "chapter" ? " on" : "") + '" href="#/search?q=' + encodeURIComponent(q) + '&tab=chapter">章节' + (q ? cnt(rChap.length) : "") + "</a>" +
      '<a class="chip' + (tab === "author" ? " on" : "") + '" href="#/search?q=' + encodeURIComponent(q) + '&tab=author">作者' + (q ? cnt(rAuth.length) : "") + "</a>" +
      "</div>" + body + "</div>";
    var ns = $("#navSearch"); if (ns) ns.value = q;
  }

  /* 登录：邮箱验证码（后端发信；未配置 SMTP 时验证码打到后端控制台） */
  /* 登录：两种方式——邮箱验证码 / 用户名+密码（密码 SHA-256+盐 存后端） */
  function vLogin(prompt) {
    app.innerHTML =
      '<div class="auth-wrap"><div class="auth-card card">' +
      "<h1>欢迎来到喵站</h1>" +
      '<p class="sub">' + esc(prompt || "登录后同步学习进度、收藏与好友") + "</p>" +
      '<div class="auth-tabs"><span class="pill" id="authPill"></span>' +
      '<button id="tabCode" class="on">验证码登录</button><button id="tabPw">密码登录</button></div>' +
      /* 验证码面板 */
      '<div id="paneCode" class="auth-pane">' +
      '<div class="form-row"><label>邮箱</label><input class="input" id="lEmail" type="email" placeholder="you@example.com" autocomplete="email"></div>' +
      '<div class="form-row"><label>邮箱验证码</label><div class="code-row">' +
      '<input class="input" id="lCode" placeholder="6 位验证码" maxlength="6" inputmode="numeric">' +
      '<button class="btn btn-soft" id="sendCode">获取验证码</button></div></div>' +
      '<div class="form-row" id="nameRow" style="display:none"><label>首次登录请设置昵称</label><input class="input" id="lName" placeholder="怎么称呼你" maxlength="24"></div>' +
      '<button class="btn btn-primary" id="btnL" style="width:100%">登 录 / 注 册</button>' +
      '<p class="muted small" id="loginHint" style="margin-top:12px">验证码 10 分钟内有效；未收到可稍后重试。' +
      (BE.mailReady ? "" : "当前后端未配置邮箱，验证码会打印在后端控制台。") + "</p>" +
      "</div>" +
      /* 密码面板 */
      '<div id="panePw" class="auth-pane hidden">' +
      '<div class="form-row"><label>用户名</label><input class="input" id="pwName" placeholder="用户名" maxlength="24" autocomplete="username"></div>' +
      '<div class="form-row"><label>密码</label><input class="input" id="pwPass" type="password" placeholder="6 位数字密码" maxlength="6" inputmode="numeric" autocomplete="current-password"></div>' +
      '<button class="btn btn-primary" id="btnPwLogin" style="width:100%">登 录</button>' +
      '<button class="btn btn-ghost" id="btnPwReg" style="width:100%;margin-top:8px">注册新账号</button>' +
      "</div>" +
      '<a class="skip-link" href="#/">暂不登录，继续浏览 →</a>' +
      "</div></div>";

    /* tab 切换 */
    var tCode = $("#tabCode"), tPw = $("#tabPw"), pill = $("#authPill");
    function showPane(pwMode) {
      tCode.classList.toggle("on", !pwMode);
      tPw.classList.toggle("on", pwMode);
      if (pill) pill.classList.toggle("right", pwMode);
      $("#paneCode").classList.toggle("hidden", pwMode);
      $("#panePw").classList.toggle("hidden", !pwMode);
    }
    tCode.onclick = function () { showPane(false); };
    tPw.onclick = function () { showPane(true); };

    /* 登录成功后的统一处理 */
    function afterLogin(d) {
      state.user = { id: d.user.id, name: d.user.name, email: d.user.email, desc: d.user.descr, role: d.user.role };
      state.counts = d.counts;
      renderNavRight();
      toast(d.isNew ? "欢迎加入喵站，" + d.user.name : "登录成功，欢迎回来 " + d.user.name);
      var ret = sessionStorage.getItem("miao_ret");
      sessionStorage.removeItem("miao_ret");
      location.hash = ret || "#/";
    }

    /* 验证码登录 */
    var btn = $("#sendCode"), timer = null;
    function countdown(sec) {
      var s = sec; btn.disabled = true; btn.textContent = s + "s 后重发";
      timer = setInterval(function () {
        s--;
        if (s <= 0) { clearInterval(timer); btn.disabled = false; btn.textContent = "获取验证码"; }
        else btn.textContent = s + "s 后重发";
      }, 1000);
    }
    btn.onclick = function () {
      var email = $("#lEmail").value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { toast("请输入正确的邮箱"); return; }
      btn.disabled = true; btn.textContent = "发送中…";
      API.post("/api/auth/request-code", { email: email })
        .then(function (d) { countdown(60); toast(d.dev ? "验证码已生成（未配置邮箱，请看后端控制台）" : "验证码已发送到 " + email); })
        .catch(function (e) { btn.disabled = false; btn.textContent = "获取验证码"; toast(e.message || "发送失败"); });
    };
    function doVerify() {
      var email = $("#lEmail").value.trim();
      var code = $("#lCode").value.trim();
      var name = ($("#lName") && $("#lName").value.trim()) || "";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { toast("请输入正确的邮箱"); return; }
      if (!/^\d{6}$/.test(code)) { toast("请输入 6 位数字验证码"); return; }
      var b = $("#btnL"); b.disabled = true; b.textContent = "验证中…";
      API.post("/api/auth/verify", { email: email, code: code, name: name })
        .then(afterLogin)
        .catch(function (e) { b.disabled = false; b.textContent = "登 录 / 注 册"; toast(e.message || "登录失败"); });
    }
    $("#btnL").onclick = doVerify;
    $("#lCode").onkeydown = function (e) { if (e.key === "Enter") doVerify(); };
    $("#lEmail").onkeydown = function (e) { if (e.key === "Enter") btn.click(); };

    /* 密码登录 / 注册 */
    function doPwLogin() {
      var name = $("#pwName").value.trim();
      var pw = $("#pwPass").value;
      if (!name) { toast("请输入用户名"); return; }
      if (!/^\d{6}$/.test(pw)) { toast("密码必须是 6 位数字"); return; }
      var b = $("#btnPwLogin"); b.disabled = true; b.textContent = "登录中…";
      API.post("/api/auth/password-login", { name: name, pw: pw })
        .then(afterLogin)
        .catch(function (e) { b.disabled = false; b.textContent = "登 录"; toast(e.message || "登录失败"); });
    }
    function doPwReg() {
      var name = $("#pwName").value.trim();
      var pw = $("#pwPass").value;
      if (name.length < 2) { toast("用户名至少 2 个字符"); return; }
      if (!/^\d{6}$/.test(pw)) { toast("密码必须是 6 位数字"); return; }
      var b = $("#btnPwReg"); b.disabled = true; b.textContent = "注册中…";
      API.post("/api/auth/register", { name: name, pw: pw })
        .then(afterLogin)
        .catch(function (e) { b.disabled = false; b.textContent = "注册新账号"; toast(e.message || "注册失败"); });
    }
    $("#btnPwLogin").onclick = doPwLogin;
    $("#btnPwReg").onclick = doPwReg;
    $("#pwPass").onkeydown = function (e) { if (e.key === "Enter") doPwLogin(); };
  }

  /* ---------------- 接口文档（老师 Tab，给 AI 制作） ---------------- */
  function apiDocMarkdown() {
    return [
      "# 喵站教程接口文档（AI 制作用）",
      "把本文件交给 AI，让它按规范产出教程 JSON，再在创作中心导入发布。",
      "## 内容 JSON 规范",
      "- title / intro / cat / diff / tags",
      "- thumb（200×200）/ cover（640×360）/ hero（1280×720）三张展示图必填",
      "- chapters: [{ title, blocks }]，blocks 的 t 可为：p / h2 / tip / ul / code / img / audio",
      "- tip 块可选 color 字段：green / blue / amber / gray；不写则跟随站点主题色",
      "## 发布接口",
      "- POST /api/my/works（需登录 + 签名），chapters 用上述结构",
      "- 图片先 POST /api/upload 上传，使用返回的 /uploads/ 地址",
      "## 给 AI 的指令模板",
      "- 请按上述 JSON 规范生成《XXX》教程，3 个章节、每章 4 块以上，代码可运行，输出单个 JSON。"
    ].join("\n\n");
  }

  /* ---------------- 个人中心 ---------------- */
  function vMe() {
    if (!state.user) { goLogin("查看个人中心"); return; }
    var c = state.counts || {};
    var learning = Object.keys(state.progress || {});
    var favItems = (BE.favs && BE.favs.items) || [];
    var works = (BE.works && BE.works.items) || [];
    var doneAll = learning.filter(function (id) {
      var t = BE.find(id);
      if (!t || !t.chapters || !t.chapters.length) return false;
      return t.chapters.every(function (ch) { return isDone(id, ch.id); });
    }).length;

    var worksHtml = works.length ? works.map(function (w) {
      return '<div class="learn-item card"><span class="w-thumb' + (w.thumb ? " has-img" : "") + '">' +
        (w.thumb ? '<img src="' + esc(w.thumb) + '" alt="">' : "新") + "</span>" +
        '<div class="inf"><h4>' + esc(w.title) + ' <span class="badge b-gray">' + esc(w.status) + "</span></h4>" +
        '<div class="muted small">' + (w.chaps || 1) + " 章 · 更新于 " + esc(w.updated || "") + "</div>" +
        '<div class="ws-row"><span>' + fmtStat(w.views || 0) + " 浏览</span>" + starBadge(w.favs || 0, false, "收藏人数") + "</div></div>" +
        '<div style="display:flex;gap:8px"><a class="btn btn-soft btn-sm" href="#/editor">继续编辑</a>' +
        '<button class="btn btn-ghost btn-sm" data-delwork="' + w.id + '">删除</button></div></div>';
    }).join("") : '<div class="empty">还没有作品' + (state.teacher ? '，点右下「+ 新建作品」发布第一篇' : "") + "</div>";
    worksHtml += state.teacher
      ? '<div style="margin-top:14px"><a class="btn btn-primary" href="#/editor">+ 新建作品</a></div>'
      : (state.applied
        ? '<div class="set-card card" style="margin-top:14px"><b>老师申请审核中</b><div class="muted small">通过后即可发布教程</div></div>'
        : '<div class="set-card card" style="margin-top:14px"><b>想发布自己的教程？</b><div class="muted small" style="margin:6px 0 10px">申请成为认证老师，审核通过后解锁创作中心</div><a class="btn btn-soft btn-sm" href="#/apply">申请成为老师</a></div>');

    var learnHtml = learning.length ? learning.map(function (id) {
      var t = BE.find(id);
      if (!t) return "";
      return '<a class="learn-item card" href="#/tutorial/' + id + '">' + coverHtml(t, "card") +
        '<div class="inf"><h4>' + esc(t.title) + "</h4>" +
        '<div class="muted small">已学 ' + tutProgress(t) + "% · " + (t.chaps || t.chapters || []).length + " 章</div></div></a>";
    }).join("") : '<div class="empty">还没有开始学习，去首页挑一门吧</div>';

    var favHtml = favItems.length ? favItems.map(function (t) {
      return '<a class="learn-item card" href="#/tutorial/' + t.id + '">' + coverHtml(t, "card") +
        '<div class="inf"><h4>' + esc(t.title) + "</h4>" +
        '<div class="muted small">' + esc(t.author) + " · " + fmtStat(t.favs) + " 收藏</div></div>" +
        '<span class="badge b-gray">已收藏</span></a>';
    }).join("") : '<div class="empty">收藏的教程会显示在这里</div>';

    app.innerHTML =
      '<div class="container" style="max-width:980px">' +
      '<div class="crumb"><a href="#/">首页</a> / 个人中心</div>' +
      '<div class="me-head card">' +
      '<span class="avatar ' + avCls(state.user.name) + '">' + esc(state.user.name.slice(0, 1)) + "</span>" +
      '<div class="who"><h2>' + esc(state.user.name) + (state.teacher ? ' <span class="badge b-green">认证老师</span>' : "") +
      ' <span class="badge b-gray">ID ' + (state.user.id != null ? state.user.id : "?") + "</span></h2>" +
      "<p>" + esc(state.user.desc || "") + "</p></div>" +
      '<div class="me-acts"><button class="btn btn-soft btn-sm" id="meEditBtn">编辑资料</button></div>' +
      '<div class="me-stats">' +
      '<div class="st"><b>' + (c.follows || 0) + '</b><span>关注</span></div>' +
      '<div class="st"><b>' + fmtNum(c.fans || 0) + '</b><span>粉丝</span></div>' +
      '<div class="st"><b>' + (c.favs || 0) + '</b><span>收藏</span></div>' +
      '<div class="st"><b>' + learning.length + '</b><span>学习中</span></div>' +
      '<div class="st"><b>' + doneAll + '</b><span>已学完</span></div>' +
      "</div></div>" +
      '<div class="tabs"><button class="on" data-tab="works">我的作品 ' + works.length + "</button>" +
      '<button data-tab="learn">学习中</button><button data-tab="fav">我的收藏</button>' +
      (state.teacher ? '<button data-tab="api">接口文档</button>' : "") + "</div>" +
      '<div id="tabBody">' + worksHtml + "</div></div>";

    $("#meEditBtn").onclick = editProfile;
    function bindApiTab() {
      if ($("#dlApiMd")) $("#dlApiMd").onclick = function () {
        downloadText("喵站教程接口文档.md", apiDocMarkdown(), "text/markdown;charset=utf-8");
        toast("接口文档已下载，可直接交给 AI");
      };
    }
    $all(".tabs button").forEach(function (b) {
      b.onclick = function () {
        $all(".tabs button").forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        var body = $("#tabBody");
        if (b.dataset.tab === "works") body.innerHTML = worksHtml;
        else if (b.dataset.tab === "learn") body.innerHTML = learnHtml;
        else if (b.dataset.tab === "api") {
          body.innerHTML = '<div class="set-card card"><h3>接口文档（AI 制作用）</h3>' +
            '<div class="api-ops"><button class="btn btn-primary btn-sm" id="dlApiMd">下载接口文档（.md）</button></div>' +
            '<div class="article api-doc">' + mdToBlocks(apiDocMarkdown()).map(blockHtml).join("") + "</div></div>";
          bindApiTab();
        } else body.innerHTML = favHtml;
      };
    });
    $all("[data-delwork]").forEach(function (b) {
      b.onclick = function () {
        if (!confirm("确定删除这个作品？")) return;
        API.del("/api/my/works/" + b.dataset.delwork)
          .then(function () { toast("已删除"); BE.loadWorks().then(vMe); })
          .catch(function (e) { toast(e.message || "删除失败"); });
      };
    });
  }

  /* ---------------- 好友 ---------------- */
  function vFriends() {
    if (!state.user) { goLogin("查看好友"); return; }
    var d = BE.friends || { friends: [], requests: [], following: [], fans: [] };
    var reqs = (d.requests || []).map(function (n) {
      return '<div class="fr-row"><span class="avatar ' + avCls(n) + '">' + esc(n.slice(0, 1)) + "</span>" +
        '<div class="fr-inf"><div class="fr-name">' + esc(n) + '</div><div class="muted small">请求加你为好友</div></div>' +
        '<button class="btn btn-primary btn-sm" data-fok="' + esc(n) + '">接受</button>' +
        '<button class="btn btn-ghost btn-sm" data-fno="' + esc(n) + '">忽略</button></div>';
    }).join("");
    var list = (d.friends || []).map(function (f) {
      return '<div class="fr-row"><span class="avatar ' + avCls(f.name) + '">' + esc(f.name.slice(0, 1)) + "</span>" +
        '<div class="fr-inf"><div class="fr-name">' + esc(f.name) + (f.teacher ? ' <span class="badge b-green">老师</span>' : "") + "</div>" +
        '<div class="muted small">' + esc(f.descr || "") + " · " + fmtNum(f.fans || 0) + " 粉丝</div></div>" +
        '<a class="btn btn-soft btn-sm" href="#/user/' + encodeURIComponent(f.name) + '">TA 的主页</a>' +
        '<button class="btn btn-ghost btn-sm" data-fdel="' + esc(f.name) + '">移除</button></div>';
    }).join("");
    app.innerHTML =
      '<div class="container" style="max-width:760px"><h1 class="page-title">好友</h1>' +
      '<div class="set-card card"><h3>添加好友</h3>' +
      '<p class="desc">好友 = 互相关注：加为好友会自动互相关注，移除好友会同时取消关注。</p>' +
      '<div class="ed-inline2"><input class="input" id="frName" placeholder="对方昵称">' +
      '<button class="btn btn-primary btn-sm" id="frAdd">发送申请</button></div></div>' +
      (reqs ? '<div class="set-card card"><h3>好友申请 <span class="badge">' + (d.requests || []).length + "</span></h3>" + reqs + "</div>" : "") +
      '<div class="set-card card"><h3>我的好友 <span class="badge b-gray">' + (d.friends || []).length + "</span></h3>" +
      (list || '<div class="empty">还没有好友，用上面的输入框加一个吧</div>') + "</div></div>";
    function reload() { return BE.loadFriends().then(vFriends); }
    $("#frAdd").onclick = function () {
      var n = $("#frName").value.trim();
      if (!n) { toast("请输入对方昵称"); return; }
      API.post("/api/friends/request", { name: n })
        .then(function () { toast("已添加好友（互相关注）：" + n); renderNavRight(); reload(); })
        .catch(function (e) { toast(e.message || "操作失败"); });
    };
    $all("[data-fok]").forEach(function (b) {
      b.onclick = function () {
        API.post("/api/friends/accept", { name: b.dataset.fok })
          .then(function () { toast("已接受 " + b.dataset.fok + " 的申请"); renderNavRight(); reload(); })
          .catch(function (e) { toast(e.message || "操作失败"); });
      };
    });
    $all("[data-fno]").forEach(function (b) {
      b.onclick = function () {
        API.post("/api/friends/ignore", { name: b.dataset.fno })
          .then(function () { toast("已忽略申请"); reload(); })
          .catch(function (e) { toast(e.message || "操作失败"); });
      };
    });
    $all("[data-fdel]").forEach(function (b) {
      b.onclick = function () {
        doRemoveFriend(b.dataset.fdel)
          .then(function () { toast("已移除好友并取消关注：" + b.dataset.fdel); renderNavRight(); reload(); })
          .catch(function (e) { toast(e.message || "操作失败"); });
      };
    });
  }

  /* ---------------- 用户主页 ---------------- */
  function vUser(params) {
    var d = BE.userProfile;
    if (!d || (d.user && d.user.name !== params.name)) { v404(); return; }
    if (state.user && d.user && state.user.name === d.user.name) { location.hash = "#/me"; return; }
    var u = d.user, rel = d.relation || {}, cnt = d.counts || {};
    var btnTxt = rel.friend ? "已互关" : rel.followed ? "取关" : rel.followsMe ? "回关" : "＋ 关注";
    var btnCls = rel.friend ? "soft" : rel.followed ? "ghost" : "primary";
    var btnTip = rel.friend ? "已互关，点击取消" : rel.followed ? "点击取关" : rel.followsMe ? "对方已关注你，点击回关" : "关注 TA";
    var worksHtml = (d.works || []).length ? d.works.map(function (t) {
      return '<div class="learn-item card">' + coverHtml(t, "card") +
        '<div class="inf"><h4><a class="t-link" href="#/tutorial/' + t.id + '">' + esc(t.title) + "</a></h4>" +
        '<div class="muted small">' + (t.chaps || 0) + " 章 · 更新于 " + esc(t.updated || "") + "</div>" +
        '<div class="ws-row"><span>' + fmtStat(t.students || 0) + " 浏览</span>" + starBadge(t.favs || 0, false, "收藏人数") +
        '<span class="badge">' + esc(t.diff || "") + "</span></div></div>" +
        '<a class="btn btn-soft btn-sm" href="#/tutorial/' + t.id + '">进教程</a></div>';
    }).join("") : '<div class="empty">TA 还没有发布作品</div>';
    app.innerHTML =
      '<div class="container" style="max-width:900px">' +
      '<div class="crumb"><a href="#/">首页</a> / 用户主页 / ' + esc(u.name) + "</div>" +
      '<div class="me-head card">' +
      '<span class="avatar ' + avCls(u.name) + '" style="width:64px;height:64px;font-size:1.5rem">' + esc(u.name.slice(0, 1)) + "</span>" +
      '<div class="who"><h2>' + esc(u.name) + (u.teacher ? ' <span class="badge b-green">认证讲师</span>' : "") +
      ' <span class="badge b-gray">ID ' + (u.id != null ? u.id : "?") + "</span></h2>" +
      "<p>" + esc(u.descr || "") + "</p></div>" +
      '<div class="me-acts">' +
      (rel.followsMe && !rel.friend ? '<span class="follow-hint">TA 关注了你</span>' : "") +
      '<button class="btn ' + btnCls + ' btn-sm" id="uFollow" title="' + esc(btnTip) + '">' + esc(btnTxt) + "</button>" +
      "</div>" +
      '<div class="me-stats">' +
      '<div class="st"><b>' + (cnt.follows || 0) + '</b><span>关注</span></div>' +
      '<div class="st"><b>' + fmtNum(cnt.fans || 0) + '</b><span>粉丝</span></div>' +
      '<div class="st"><b>' + (cnt.works || 0) + '</b><span>作品</span></div>' +
      '<div class="st"><b>' + fmtStat(cnt.favs || 0) + '</b><span>总收藏</span></div>' +
      "</div></div>" +
      '<h3 style="margin:18px 0 10px">TA 的作品 <span class="muted small" style="font-weight:400">（含浏览量 / 收藏量）</span></h3>' +
      worksHtml + '<div style="height:40px"></div></div>';
    $("#uFollow").onclick = function () {
      if (needLogin("关注 TA")) return;
      var done2 = function (msg) { renderNavRight(); BE.loadUser(params.name).then(vUser.bind(null, params)); if (msg) toast(msg); };
      if (rel.friend) {
        doRemoveFriend(params.name).then(function () { done2("已取消互关（同时移出好友）"); })
          .catch(function (e) { toast(e.message || "操作失败"); });
        return;
      }
      if (rel.followed) {
        doUnfollow(params.name).then(function () { done2("已取消关注"); })
          .catch(function (e) { toast(e.message || "操作失败"); });
        return;
      }
      doFollow(params.name).then(function (r) {
        if (r && r.relation && r.relation.friend) done2("已回关 " + params.name + " → 互相关注，成为好友");
        else done2("已关注 " + params.name);
      }).catch(function (e) { toast(e.message || "操作失败"); });
    };
  }

  /* 申请成为老师（走后端；演示配置下提交即通过） */
  function vApply() {
    if (!state.user) { goLogin("申请成为老师"); return; }
    if (state.teacher) {
      app.innerHTML =
        '<div class="auth-wrap" style="max-width:560px"><div class="set-card card" style="margin-top:40px">' +
        "<h3>你已经是认证老师 <span class=\"badge b-green\">已通过</span></h3>" +
        '<p class="desc">无需重复申请，可直接进入创作中心发布教程；发布前须上传缩略图、卡片图与完整图三张展示图。</p>' +
        '<a class="btn btn-primary" href="#/editor">进入创作中心</a></div></div>';
      return;
    }
    if (state.applied) {
      app.innerHTML =
        '<div class="auth-wrap" style="max-width:560px"><div class="set-card card" style="margin-top:40px">' +
        "<h3>申请已提交 <span class=\"badge\">审核中</span></h3>" +
        '<p class="desc">审核通过后即可进入创作中心发布教程。撤回后 5 分钟内不可再次申请。</p>' +
        '<button class="btn btn-ghost" id="withdraw">撤回申请</button></div></div>';
      $("#withdraw").onclick = function () {
        API.post("/api/me/apply/withdraw")
          .then(function () { state.applied = false; save(); vApply(); toast("已撤回申请（5 分钟内不可再次申请）"); })
          .catch(function (e) { toast(e.message || "操作失败"); });
      };
      return;
    }
    app.innerHTML =
      '<div class="auth-wrap" style="max-width:560px"><div class="set-card card" style="margin-top:34px">' +
      "<h3>申请成为老师</h3>" +
      '<p class="desc">提交后由平台审核。通过后即可在创作中心发布教程，所有内容需审核后上架。</p>' +
      '<div class="form-row"><label>真实称呼</label><input class="input" id="apName" placeholder="如：王老师"></div>' +
      '<div class="form-row"><label>擅长领域（多选）</label><div class="cat-row" id="apCats">' +
      catList().map(function (c) { return '<span class="chip" data-c="' + esc(c) + '">' + esc(c) + "</span>"; }).join("") + "</div></div>" +
      '<div class="form-row"><label>个人介绍</label><textarea class="input" id="apIntro" rows="3" placeholder="经历、擅长方向、为什么想做教程"></textarea></div>' +
      '<div class="form-row"><label>样例作品（链接或内容简介）</label><textarea class="input" id="apWork" rows="2" placeholder="博客地址 / 作品链接 / 拟写教程大纲"></textarea></div>' +
      '<label class="agree"><input type="checkbox" id="apAgree">我已阅读并同意《内容创作协议》，承诺原创或已获授权</label>' +
      '<button class="btn btn-primary" id="apSubmit" style="width:100%">提交申请</button></div></div>';
    $all("#apCats .chip").forEach(function (c) { c.onclick = function () { c.classList.toggle("on"); }; });
    $("#apSubmit").onclick = function () {
      if (!$("#apName").value.trim()) { toast("请填写真实称呼"); return; }
      if (!$("#apIntro").value.trim()) { toast("请填写个人介绍"); return; }
      if (!$("#apAgree").checked) { toast("请先勾选创作协议"); return; }
      var b = $("#apSubmit");
      b.disabled = true; b.textContent = "提交中…";
      API.post("/api/me/apply", {})
        .then(function (d) {
          state.applied = true;
          state.teacher = !!(d.user && d.user.teacher);   // 以服务端审核结果为准（未开自动通过时为审核中）
          save();
          renderNavRight(); vApply();
          toast(state.teacher ? "申请已通过，欢迎成为喵站老师" : "申请已提交，等待平台审核");
        })
        .catch(function (e) { b.disabled = false; b.textContent = "提交申请"; toast(e.message || "提交失败"); });
    };
  }

  function vSettings() {
    app.innerHTML =
      '<div class="container" style="max-width:760px;padding-top:26px">' +
      '<h1 class="page-title" style="margin-top:0">设置</h1>' +
      '<div class="set-card card" style="margin-top:18px"><h3>外观主题</h3>' +
      '<p class="desc">浅色：白 · 淡粉 ｜ 深色：黑 · 粉</p>' +
      '<div class="theme-cards">' +
      '<div class="theme-card" data-t="light"><div class="pv pv-light"></div><div class="nm">浅色模式</div><div class="ds">白色底 · 淡粉点缀</div></div>' +
      '<div class="theme-card" data-t="dark"><div class="pv pv-dark"></div><div class="nm">深色模式</div><div class="ds">黑色底 · 亮粉点缀</div></div>' +
      '<div class="theme-card" data-t="auto"><div class="pv pv-auto"></div><div class="nm">跟随系统</div><div class="ds">随系统明暗自动切换</div></div>' +
      "</div></div>" +
      '<div class="set-card card"><h3>阅读字号</h3><p class="desc">影响全站文字大小（当前 <span id="fsVal">' + state.fs + "</span>px）</p>" +
      '<div class="fs-row"><span class="muted small">A</span><input type="range" id="fsRange" min="14" max="18" step="1" value="' + state.fs + '"><span style="font-size:1.2rem">A</span></div></div>' +
      '<div class="set-card card"><h3>关于喵站</h3><p class="desc" style="margin-bottom:0">喵站 · 开源教程站，教程内容永久免费 ｜ 账号、收藏与学习进度存放在站点自己的后端数据库。</p></div>' +
      "</div>";
    $all(".theme-card").forEach(function (c) {
      c.onclick = function () { setTheme(c.dataset.t); toast("已切换主题"); };
    });
    $("#fsRange").oninput = function (e) {
      state.fs = parseInt(e.target.value, 10); save(); applyTheme();
      $("#fsVal").textContent = state.fs;
    };
    applyTheme();
  }

  /* ---------------- 创作中心：老师文档编辑器（图形化 / 代码 双模式） ---------------- */
  var BLOCK_TYPES = [
    { v: "p", n: "段落" }, { v: "h2", n: "小标题" }, { v: "tip", n: "提示框" },
    { v: "ul", n: "列表" }, { v: "code", n: "代码" }, { v: "img", n: "图片" }, { v: "audio", n: "音频" }
  ];
  /* 提示框可选颜色：空 = 跟随主题粉；其余为浅/深双主题预置色（样式见 style.css 的 tipc-*） */
  var TIP_COLORS = [
    { v: "", n: "跟随主题", dot: "td-pink" },
    { v: "green", n: "草绿 · 建议/成功", dot: "td-green" },
    { v: "blue", n: "湖蓝 · 补充说明", dot: "td-blue" },
    { v: "amber", n: "琥珀 · 注意/警告", dot: "td-amber" },
    { v: "gray", n: "墨灰 · 低存在感", dot: "td-gray" }
  ];
  function tipColorOf(b) {
    for (var i = 0; i < TIP_COLORS.length; i++) if (TIP_COLORS[i].v === b.color) return b.color;
    return "";
  }
  function tipCls(b) { var c = tipColorOf(b); return c ? " tipc-" + c : ""; }
  function blockTypeName(t) {
    for (var i = 0; i < BLOCK_TYPES.length; i++) if (BLOCK_TYPES[i].v === t) return BLOCK_TYPES[i].n;
    return t;
  }
  function newBlock(t) {
    if (t === "ul") return { t: "ul", items: [] };
    if (t === "code") return { t: "code", lang: "text", code: "" };
    if (t === "img") return { t: "img", src: "", alt: "", caption: "" };
    if (t === "audio") return { t: "audio", src: "", title: "", note: "" };
    return { t: t, text: "" };
  }
  function blankDraft() {
    return {
      title: "", intro: "", cat: catList()[0] || "", diff: "入门", tags: [],
      thumb: "", cover: "", hero: "",
      chapters: [{ title: "第 1 章 · 开始", blocks: [{ t: "p", text: "" }] }]
    };
  }
  function getDraft() { if (!state.draft) state.draft = blankDraft(); return state.draft; }
  function draftCode(d) { return JSON.stringify(d, null, 2); }
  function normBlock(b) {
    if (!b || typeof b !== "object") return { t: "p", text: "" };
    var t = b.t || "p";
    if (t === "ul") return { t: "ul", items: Array.isArray(b.items) ? b.items : [] };
    if (t === "code") return { t: "code", lang: b.lang || "text", code: b.code || "" };
    if (t === "img") return { t: "img", src: b.src || "", alt: b.alt || "", caption: b.caption || "" };
    if (t === "audio") return { t: "audio", src: b.src || "", title: b.title || "", note: b.note || "" };
    if (t === "tip") {
      var tip = { t: "tip", text: b.text || "" };
      if (tipColorOf(b)) tip.color = b.color;
      return tip;
    }
    return { t: t === "h2" ? t : "p", text: b.text || "" };
  }
  function normalizeDraft(o) {
    var d = blankDraft();
    d.title = o.title || ""; d.intro = o.intro || "";
    d.cat = o.cat || d.cat; d.diff = o.diff || d.diff;
    d.tags = Array.isArray(o.tags) ? o.tags : [];
    d.thumb = o.thumb || ""; d.cover = o.cover || ""; d.hero = o.hero || "";
    d.chapters = (Array.isArray(o.chapters) ? o.chapters : []).map(function (ch, i) {
      return { title: ch.title || ("第 " + (i + 1) + " 章"), blocks: (ch.blocks || []).map(normBlock) };
    });
    if (!d.chapters.length) d.chapters = [{ title: "第 1 章", blocks: [{ t: "p", text: "" }] }];
    return d;
  }
  function today() {
    var t = new Date();
    function p(n) { return ("0" + n).slice(-2); }
    return t.getFullYear() + "-" + p(t.getMonth() + 1) + "-" + p(t.getDate());
  }

  function vEditor() {
    if (!state.user) { goLogin("进入创作中心"); return; }
    if (!state.teacher) { toast("成为认证老师后才能进入创作中心"); location.hash = "#/apply"; return; }
    if (!state.teacher) {
      app.innerHTML = '<div class="auth-wrap" style="max-width:520px"><div class="set-card card" style="margin-top:40px">' +
        "<h3>创作中心仅对认证老师开放</h3><p class=\"desc\">先申请成为老师并通过审核，即可在这里编写并发布教程。</p>" +
        '<a class="btn btn-primary" href="#/apply">去申请 / 查看进度</a></div></div>';
      return;
    }
    app.innerHTML =
      '<div class="container" style="max-width:1000px">' +
      '<div class="sec-head" style="margin-top:22px">' +
      '<h1 class="page-title" style="margin:0">创作中心 · 作品编辑器</h1>' +
      '<div class="seg" id="edMode"><button data-m="gui">图形化编辑</button><button data-m="code">代码编辑</button></div>' +
      "</div>" +
      '<p class="muted small" style="margin:8px 0 14px">认证老师 · 发布前须上传三张展示图（缩略图 / 卡片图 / 完整图），缺一不可。</p>' +
      '<div id="edBody"></div>' +
      '<div class="ed-foot"><button class="btn btn-soft" id="edPreview">预览页面</button>' +
      '<button class="btn btn-ghost" id="edSaveDraft">保存草稿</button>' +
      '<button class="btn btn-primary" id="edPublish">提交发布</button></div>' +
      "</div>";
    $all("#edMode button").forEach(function (b) {
      b.classList.toggle("on", b.dataset.m === state.editorMode);
      b.onclick = function () { switchMode(b.dataset.m); };
    });
    $("#edSaveDraft").onclick = function () { save(); toast("草稿已保存到本地"); };
    $("#edPreview").onclick = function () { location.hash = "#/preview"; };
    $("#edPublish").onclick = function () { publishWork(); };
    renderEditorBody();
  }

  function renderEditorBody() {
    var body = $("#edBody");
    if (!body) return;
    if (state.editorMode === "code") renderCodeMode(body);
    else renderGuiMode(body);
  }

  function switchMode(m) {
    if (m === state.editorMode) return;
    if (state.editorMode === "code") {
      var ta = $("#edJson");
      if (ta) {
        if (state.activeFile === "tutorial.json") {
          try { state.draft = normalizeDraft(JSON.parse(ta.value)); save(); }
          catch (e) { toast("草稿代码有误，未同步：" + e.message); return; }
        } else {
          /* 当前编辑的是其他文件：内容存回文件即可 */
          var af = null;
          for (var i = 0; i < (state.files || []).length; i++) if (state.files[i].name === state.activeFile) af = state.files[i];
          if (af) { af.text = ta.value; save(); }
        }
      }
    }
    state.editorMode = m; save();
    $all("#edMode button").forEach(function (b) { b.classList.toggle("on", b.dataset.m === m); });
    renderEditorBody();
    toast(m === "code" ? "已切换到代码模式" : "已切换到图形化模式");
  }

  /* 发布校验：三张展示图缺一不可 */
  /* 发布作品：三图与正文校验后提交后端 */
  function publishWork() {
    var d = getDraft();
    var miss = [];
    if (!d.title || !String(d.title).trim()) miss.push("教程标题");
    if (!d.intro || !String(d.intro).trim()) miss.push("简介");
    ["thumb", "cover", "hero"].forEach(function (k) { if (!d[k]) miss.push({ thumb: "缩略图", cover: "卡片图", hero: "完整图" }[k]); });
    var hasContent = d.chapters.some(function (c) {
      return (c.blocks || []).some(function (x) { return x.text || x.code || (x.items || []).length || x.src || x.title; });
    });
    if (!hasContent) miss.push("正文内容");
    if (miss.length) { toast("无法发布，请先完成：" + miss.join("、")); return; }
    var bad = ["thumb", "cover", "hero"].find(function (k) { return !/^(\/uploads\/|data:image\/)/.test(String(d[k])); });
    if (bad) { toast("展示图必须先上传到本站（" + { thumb: "缩略图", cover: "卡片图", hero: "完整图" }[bad] + "）"); return; }
    var b = $("#edPublish");
    b.disabled = true; b.textContent = "发布中…";
    API.post("/api/my/works", {
      title: d.title, intro: d.intro, cat: d.cat, diff: d.diff, tags: d.tags,
      thumb: d.thumb, cover: d.cover, hero: d.hero, chapters: d.chapters
    }).then(function (r) {
      toast("已提交发布，当前状态：" + r.status);
      state.draft = null; save();
      location.hash = "#/me";
    }).catch(function (e) {
      b.disabled = false; b.textContent = "提交发布";
      toast(e.message || "发布失败");
    });
  }

  function svgDataUri(code) {
    var s = String(code).trim()
      .replace(/%/g, "%25")
      .replace(/#/g, "%23")
      .replace(/"/g, "'")
      .replace(/[\r\n]+/g, " ");
    return "data:image/svg+xml;utf8," + s;
  }
  function svgCodeFrom(uri) {
    var s = String(uri || "");
    if (s.indexOf("data:image/svg+xml") !== 0) return "";
    var i = s.indexOf(",");
    if (i < 0) return "";
    var raw = s.slice(i + 1).replace(/'/g, '"');
    try { return decodeURIComponent(raw); } catch (e) { return raw; }
  }
  function SVG_TEMPLATE() {
    return [
      '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="270" viewBox="0 0 480 270">',
      '  <rect width="480" height="270" rx="18" fill="#fb7da8"/>',
      '  <circle cx="404" cy="52" r="88" fill="#ffffff" opacity="0.22"/>',
      '  <text x="40" y="140" font-family="sans-serif" font-size="44" font-weight="bold" fill="#ffffff">喵站教程</text>',
      '  <text x="42" y="184" font-family="sans-serif" font-size="20" fill="#ffffff" opacity="0.9">用代码生成的图片</text>',
      '</svg>'
    ].join("\n");
  }
  /* 弹层：写 SVG 代码 → 实时预览 → 写入目标 */
  function svgEditorModal(title, initCode, onDone) {
    var mask = document.createElement("div");
    mask.className = "mask";
    mask.innerHTML =
      '<div class="modal card" style="width:780px;max-width:94vw;text-align:left">' +
      "<h3>" + esc(title) + "</h3>" +
      '<p class="desc">直接写 SVG 代码生成图片：改代码 → 右侧实时预览 → 点「使用这张图」即可。颜色照常写 #fb7da8，不用手动转义。</p>' +
      '<div class="svg-ed"><textarea id="svgCode" spellcheck="false"></textarea>' +
      '<div class="svg-pv"><img id="svgImg" alt="预览"></div></div>' +
      '<div class="svg-msg" id="svgMsg"></div>' +
      '<div style="display:flex;justify-content:space-between;gap:10px;margin-top:6px">' +
      '<button class="btn btn-ghost btn-sm" id="svgTmpl">填充示例模板</button>' +
      '<span style="display:flex;gap:10px">' +
      '<button class="btn btn-ghost" id="svgCancel">取消</button>' +
      '<button class="btn btn-primary" id="svgUse">使用这张图</button></span></div></div>';
    document.body.appendChild(mask);
    var ta = $("#svgCode", mask), img = $("#svgImg", mask), msg = $("#svgMsg", mask);
    ta.value = initCode || SVG_TEMPLATE();
    function paint() {
      var code = ta.value.trim();
      if (!code) { msg.textContent = "先写点 SVG 代码吧～"; msg.className = "svg-msg"; return; }
      if (code.indexOf("<svg") < 0) {
        msg.textContent = "缺少 <svg> 根标签，图片无法渲染";
        msg.className = "svg-msg err";
      } else {
        msg.textContent = "预览已更新 · 生成图片约 " + Math.max(1, Math.round(svgDataUri(code).length / 1024)) + " KB";
        msg.className = "svg-msg";
      }
      img.src = svgDataUri(code);
    }
    img.addEventListener("error", function () {
      msg.textContent = "这段代码渲染失败，请检查标签是否闭合";
      msg.className = "svg-msg err";
    });
    ta.addEventListener("input", paint);
    paint();
    $("#svgTmpl", mask).onclick = function () { ta.value = SVG_TEMPLATE(); paint(); toast("已填充示例模板"); };
    $("#svgCancel", mask).onclick = function () { mask.remove(); };
    mask.onclick = function (e) { if (e.target === mask) mask.remove(); };
    $("#svgUse", mask).onclick = function () {
      var code = ta.value.trim();
      if (code.indexOf("<svg") < 0) { toast("请先写一段含 <svg> 的代码"); return; }
      mask.remove();
      onDone(svgDataUri(code), code);
      toast("已用代码生成图片");
    };
  }

  var SLOT_META = {
    thumb: { label: "缩略图", dims: "建议 200×200（1:1）", where: "我的作品列表" },
    cover: { label: "卡片图", dims: "建议 640×360（16:9）", where: "首页教程卡片" },
    hero: { label: "完整图", dims: "建议 1280×720（16:9）", where: "教程详情页大图" }
  };

  function imgSlot(kind, label, hint, val) {
    var meta = SLOT_META[kind] || { dims: "" };
    return '<div class="slot">' +
      '<div class="slot-pv">' + (val ? '<img src="' + esc(val) + '" alt="">' : '<span class="slot-ph">未上传</span>') + "</div>" +
      '<div class="slot-lb">' + label + ' <b class="req">必填</b> <span class="slot-dim">' + meta.dims + "</span>" +
      '<div class="muted small">' + hint + "</div></div>" +
      '<div class="slot-ops"><button class="btn btn-soft btn-sm" data-up="' + kind + '">上传</button>' +
      '<button class="btn btn-ghost btn-sm" data-upcode="' + kind + '">用代码生成</button>' +
      '<button class="btn btn-ghost btn-sm" data-upview="' + kind + '">看效果</button>' +
      (val ? '<button class="btn btn-ghost btn-sm" data-clear="' + kind + '">移除</button>' : "") +
      "</div></div>";
  }

  /* 展示图在真实页面里的样子（我的作品列表 / 首页卡片 / 详情页大图） */
  function slotContextHtml(kind, val) {
    var d = getDraft();
    var img = val
      ? '<img class="cover-img" src="' + esc(val) + '" alt="">'
      : '<span class="slot-ph">未上传</span>';
    var title = esc(d.title || "未命名教程");
    var intro = esc(d.intro || "教程简介会显示在这里");
    var meta = SLOT_META[kind] || {};
    var head = '<div class="mock-lb">出现位置：' + esc(meta.where || "") + " · " + esc(meta.dims || "") + "</div>";
    if (kind === "thumb") {
      return head + '<div class="learn-item card"><span class="w-thumb has-img">' + img + "</span>" +
        '<div class="inf"><h4>' + title + ' <span class="badge b-gray">审核中</span></h4>' +
        '<div class="muted small">' + d.chapters.length + " 章 · 更新于 " + today() + "</div></div></div>";
    }
    if (kind === "cover") {
      return head + '<a class="t-card card mock-card" href="javascript:void 0">' +
        '<div class="cover-wrap"><div class="cover cg-js has-img">' + img + "</div></div>" +
        '<div class="t-body"><h3>' + title + '</h3><p class="intro">' + intro + "</p>" +
        '<div class="t-meta"><span>你的昵称</span><span>·</span><span>0 人在学</span>' +
        '<span class="badge">' + esc(d.diff || "入门") + "</span></div></div></a>";
    }
    return head + '<div class="tut-hero card mock-hero">' +
      '<div class="cover cg-js has-img" style="width:210px;height:150px;border-radius:var(--radius-m);flex-shrink:0">' + img + "</div>" +
      '<div class="info"><h1>' + title + '</h1><p class="intro">' + intro + "</p>" +
      '<div class="tags"><span class="badge">' + esc(d.diff || "入门") + '</span><span class="chip">示例标签</span></div></div></div>';
  }

  function openSlotPreview(kind) {
    var meta = SLOT_META[kind] || { label: kind, where: "" };
    var mask = document.createElement("div");
    mask.className = "mask";
    mask.innerHTML =
      '<div class="modal card" style="width:720px;max-width:94vw;text-align:left">' +
      "<h3>展示图效果预览 · " + esc(meta.label) + "</h3>" +
      '<p class="desc">这是这张图在「' + esc(meta.where) + "」里实际呈现的样子。</p>" +
      '<div class="mock-wrap">' + slotContextHtml(kind, getDraft()[kind]) + "</div>" +
      '<div style="display:flex;justify-content:flex-end;margin-top:14px">' +
      '<button class="btn btn-primary" id="mockClose">知道了</button></div></div>';
    document.body.appendChild(mask);
    $("#mockClose", mask).onclick = function () { mask.remove(); };
    mask.onclick = function (e) { if (e.target === mask) mask.remove(); };
  }

  /* 可编辑区取值（jsdom 无 innerText，回退 textContent） */
  function readEditable(el) {
    var v = (typeof el.innerText === "string") ? el.innerText : null;
    if (v == null) v = el.textContent || "";
    return v.replace(/\u00a0/g, " ");
  }
  /* 聚焦某块的编辑区（拖入后自动定位光标） */
  function focusBlock(ci, bi, f, ii) {
    var box = $('[data-block="' + ci + "," + bi + '"]');
    if (!box) return;
    var el;
    if (f) el = $('[data-f="' + f + '"]' + (ii != null ? '[data-ii="' + ii + '"]' : ""), box);
    else el = $('[contenteditable="true"]', box) || $("textarea", box) || $("input", box);
    if (el && el.focus) { try { el.focus(); } catch (e) { /* 忽略 */ } }
  }

  /* 所见即所得内容块：拖进来就是页面上的样子，直接就地编辑 */
  function blockEditorHtml(b, ci, bi) {
    var tools = '<div class="ed-tools">' +
      '<span class="ed-grip" draggable="true" data-grip="' + ci + "," + bi + '" title="按住拖动排序">⠿</span>' +
      '<span class="ed-tag">' + blockTypeName(b.t) + "</span>" +
      '<button class="ed-del" data-delblock="' + ci + "," + bi + '" title="删除此块">✕</button></div>';
    var f = ' data-ci="' + ci + '" data-bi="' + bi + '"';
    var v = "";
    if (b.t === "p") {
      v = '<div class="w-p" contenteditable="true" data-f="text" data-ph="在这里输入正文…"' + f + ">" + esc(b.text || "") + "</div>";
    } else if (b.t === "h2") {
      v = '<div class="w-h2" contenteditable="true" data-f="text" data-ph="小节标题"' + f + ">" + esc(b.text || "") + "</div>";
    } else if (b.t === "tip") {
      v = '<div class="w-tip' + tipCls(b) + '" contenteditable="true" data-f="text" data-ph="提示 / 注意事项"' + f + ">" + esc(b.text || "") + "</div>" +
        '<div class="w-tip-ops"><span class="lb">提示框颜色</span>' +
        TIP_COLORS.map(function (tc) {
          return '<button type="button" class="tip-dot ' + tc.dot + (tipColorOf(b) === tc.v ? " on" : "") +
            '" data-tipcolor="' + ci + "," + bi + "," + tc.v + '" title="' + esc(tc.n) + '" aria-label="' + esc(tc.n) + '"></button>';
        }).join("") + "</div>";
    } else if (b.t === "ul") {
      var its = (b.items && b.items.length) ? b.items : [""];
      v = '<ul class="w-ul">' + its.map(function (it, ii) {
        return '<li><span class="w-li" contenteditable="true" data-f="li" data-ci="' + ci + '" data-bi="' + bi + '" data-ii="' + ii + '" data-ph="列表项">' + esc(it) + "</span></li>";
      }).join("") + "</ul>";
    } else if (b.t === "code") {
      v = '<div class="w-code"><div class="w-code-head">' +
        '<input class="w-lang" data-f="lang"' + f + ' value="' + esc(b.lang || "text") + '" placeholder="语言">' +
        '<span class="muted small">代码块</span></div>' +
        '<textarea class="w-code-body" spellcheck="false" data-f="code"' + f + ' placeholder="// 在这里粘贴或输入代码">' + esc(b.code || "") + "</textarea></div>";
    } else if (b.t === "img") {
      v = '<div class="w-img">' +
        (b.src
          ? '<img src="' + esc(b.src) + '" alt=""><div class="w-ops">' +
          '<button class="btn btn-ghost btn-sm" data-upimg="' + ci + "," + bi + '">更换图片</button>' +
          '<button class="btn btn-ghost btn-sm" data-upimgcode="' + ci + "," + bi + '">用代码生成</button>' +
          '<button class="btn btn-ghost btn-sm" data-clearsrc="' + ci + "," + bi + '">移除</button></div>'
          : '<button class="w-img-add" data-upimg="' + ci + "," + bi + '">点此上传图片</button>' +
          '<div class="w-ops"><button class="btn btn-ghost btn-sm" data-upimgcode="' + ci + "," + bi + '">或用代码生成图片</button></div>') +
        '<input class="w-cap" data-f="caption"' + f + ' value="' + esc(b.caption || "") + '" placeholder="图注（可选）">' +
        "</div>";
    } else if (b.t === "audio") {
      v = '<div class="w-audio">' +
        '<input class="w-au-title" data-f="title"' + f + ' value="' + esc(b.title || "") + '" placeholder="音频标题">' +
        '<input class="w-au-note" data-f="note"' + f + ' value="' + esc(b.note || "") + '" placeholder="说明（可选）">' +
        '<div class="w-ops">' +
        '<button class="btn btn-soft btn-sm" data-upaudio="' + ci + "," + bi + '">' + (b.src ? "更换音频" : "上传音频") + "</button>" +
        (b.src ? '<button class="btn btn-ghost btn-sm" data-clearsrc="' + ci + "," + bi + '">移除</button>' : "") +
        '<span class="muted small">' + (b.src ? "已上传音频" : "留空则使用内置演示音频") + "</span></div></div>";
    }
    return '<div class="ed-block" data-block="' + ci + "," + bi + '" data-t="' + b.t + '">' + tools + v + "</div>";
  }

  function chapterEditorHtml(ch, ci) {
    return '<div class="ed-chap" data-chap="' + ci + '">' +
      '<div class="ed-chap-head">' +
      '<input class="ed-chap-title" data-chap-input="' + ci + '" value="' + esc(ch.title) + '" placeholder="章节标题">' +
      '<button class="ed-del" data-delchap="' + ci + '" title="删除章节">✕</button></div>' +
      '<div class="ed-blocks" data-zone="' + ci + '">' +
      (ch.blocks.length
        ? ch.blocks.map(function (b, bi) { return blockEditorHtml(b, ci, bi); }).join("")
        : '<div class="ed-empty-doc">把左侧组件拖到这里，开始写文档…</div>') +
      "</div></div>";
  }

  /* 左侧组件调色板（拖拽源） */
  function paletteHtml() {
    return '<div class="pal-title">组件</div>' +
      BLOCK_TYPES.map(function (t) {
        return '<div class="pal-item" draggable="true" data-pal="' + t.v + '">' +
          '<span class="pal-ico">' + esc(t.n.slice(0, 1)) + "</span>" + esc(t.n) + "</div>";
      }).join("") +
      '<div class="pal-hint">按住组件拖到右侧文档里，松手即插入，可就地打字。</div>';
  }

  function renderGuiMode(body) {
    var d = getDraft();
    var meta =
      '<div class="set-card card"><h3>基本信息</h3>' +
      '<div class="form-row"><label>教程标题 *</label><input class="input" id="edTitle" value="' + esc(d.title) + '" placeholder="如：Vue3 组件设计实战"></div>' +
      '<div class="form-row"><label>简介 *</label><textarea class="input" id="edIntro" rows="2">' + esc(d.intro) + "</textarea></div>" +
      '<div class="ed-2col">' +
      '<div class="form-row"><label>分类 *</label><select class="input" id="edCat">' + catList().map(function (c) {
        return "<option" + (c === d.cat ? " selected" : "") + ">" + esc(c) + "</option>";
      }).join("") + "</select></div>" +
      '<div class="form-row"><label>难度 *</label><select class="input" id="edDiff">' + ["入门", "掌握", "精通"].map(function (x) {
        return "<option" + (x === d.diff ? " selected" : "") + ">" + x + "</option>";
      }).join("") + "</select></div></div>" +
      '<div class="form-row"><label>标签（逗号分隔）</label><input class="input" id="edTags" value="' + esc((d.tags || []).join(",")) + '" placeholder="Vue,前端,组件"></div>' +
      "</div>";
    var imgs =
      '<div class="set-card card"><h3>展示图（三张，缺一不可）</h3>' +
      '<p class="desc">缩略图 = 我的作品列表小方块；卡片图 = 首页教程卡片；完整图 = 教程详情页大图。点每张图的「看效果」可预览它在真实页面里的样子。</p>' +
      '<div class="slots">' + imgSlot("thumb", "缩略图", "我的作品列表里的小方块", d.thumb) +
      imgSlot("cover", "卡片图", "首页教程卡片的展示图", d.cover) +
      imgSlot("hero", "完整图", "教程详情页顶部大图", d.hero) + "</div>" +
      '<input type="file" id="edFile" accept="image/*" class="hidden"></div>';
    body.innerHTML = meta + imgs +
      '<div class="set-card card"><h3>正文编排</h3>' +
      '<p class="desc">把左侧组件拖进下面这张「文档」里，松手即插入、就地打字；抓 ⠿ 手柄可拖动换位，鼠标移上去才会出现操作按钮。</p>' +
      '<div class="ed-work">' +
      '<aside class="ed-palette">' + paletteHtml() + "</aside>" +
      '<div class="ed-doc wysiwyg" id="edDoc">' + d.chapters.map(chapterEditorHtml).join("") +
      '<button class="btn btn-soft btn-sm" id="edAddChap">+ 新增章节</button></div>' +
      "</div></div>";
    bindGuiEditor();
  }

  /* --- 拖拽编排：从调色板拖入文档 / 文档内拖动排序 --- */
  var dragPayload = null, dropTarget = null;

  function clearDropMarks() {
    $all(".ed-block").forEach(function (el) { el.classList.remove("drop-before", "drop-after"); });
    $all(".ed-blocks").forEach(function (el) { el.classList.remove("drop-into"); });
  }
  function resetDrag() {
    dragPayload = null; dropTarget = null;
    clearDropMarks();
    document.body.classList.remove("ed-dragging");
  }
  function onDragStart(e) {
    var pal = e.target.closest ? e.target.closest("[data-pal]") : null;
    var grip = e.target.closest ? e.target.closest("[data-grip]") : null;
    if (pal) dragPayload = { kind: "new", t: pal.dataset.pal };
    else if (grip) {
      var r = grip.dataset.grip.split(",").map(Number);
      dragPayload = { kind: "move", ci: r[0], bi: r[1] };
    } else { dragPayload = null; return; }
    document.body.classList.add("ed-dragging");
    if (e.dataTransfer) {
      try {
        e.dataTransfer.setData("text/plain", JSON.stringify(dragPayload));
        e.dataTransfer.effectAllowed = "move";
      } catch (err) { /* 忽略：部分环境不允许写 dataTransfer */ }
    }
  }
  function onDragOver(e) {
    if (!dragPayload) return;
    var blockEl = e.target.closest ? e.target.closest(".ed-block") : null;
    var zone = e.target.closest ? e.target.closest(".ed-blocks") : null;
    if (!blockEl && !zone) return;
    if (e.preventDefault) e.preventDefault();
    clearDropMarks();
    if (blockEl) {
      var rc = blockEl.getBoundingClientRect();
      var before = rc.height ? (e.clientY - rc.top) < rc.height / 2 : true;
      blockEl.classList.add(before ? "drop-before" : "drop-after");
      var pr = blockEl.dataset.block.split(",").map(Number);
      dropTarget = { ci: pr[0], bi: pr[1], before: before };
    } else {
      zone.classList.add("drop-into");
      dropTarget = { ci: +zone.dataset.zone, bi: -1, before: false };
    }
  }
  function onDrop(e) {
    if (!dragPayload) return;
    if (e.preventDefault) e.preventDefault();
    var d = getDraft(), tgt = dropTarget, payload = dragPayload, insCi = 0, insBi = 0;
    var ci = tgt ? tgt.ci : d.chapters.length - 1;
    var ch = d.chapters[ci];
    if (!ch) { resetDrag(); return; }
    var idx = tgt ? (tgt.bi < 0 ? ch.blocks.length : tgt.bi + (tgt.before ? 0 : 1)) : ch.blocks.length;
    if (payload.kind === "new") {
      ch.blocks.splice(idx, 0, newBlock(payload.t));
    } else {
      var from = d.chapters[payload.ci];
      var moved = from && from.blocks[payload.bi];
      if (!moved) { resetDrag(); return; }
      from.blocks.splice(payload.bi, 1);
      if (from === ch && payload.bi < idx) idx--;
      ch.blocks.splice(idx, 0, moved);
    }
    insCi = ci; insBi = idx;
    save(); resetDrag();
    renderGuiMode($("#edBody"));
    focusBlock(insCi, insBi);
  }

  function bindGuiEditor() {
    var body = $("#edBody");
    function sync(e) {
      var el = e.target, d = getDraft();
      if (el.id === "edTitle") d.title = el.value;
      else if (el.id === "edIntro") d.intro = el.value;
      else if (el.id === "edCat") d.cat = el.value;
      else if (el.id === "edDiff") d.diff = el.value;
      else if (el.id === "edTags") d.tags = el.value.split(/[,，]/).map(function (s) { return s.trim(); }).filter(Boolean);
      else if (el.dataset.chapInput != null) d.chapters[+el.dataset.chapInput].title = el.value;
      else if (el.dataset.f != null) {
        var b = d.chapters[+el.dataset.ci] && d.chapters[+el.dataset.ci].blocks[+el.dataset.bi];
        if (b) {
          var isCE = el.getAttribute && el.getAttribute("contenteditable") === "true";
          if (el.dataset.f === "items") b.items = el.value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
          else if (el.dataset.f === "li") {
            if (!b.items) b.items = [];
            b.items[+el.dataset.ii] = readEditable(el);
          }
          else if (isCE) b[el.dataset.f] = readEditable(el);
          else b[el.dataset.f] = el.value;
        }
      }
      save();
    }
    /* 列表块内回车新增一项、空项退格删除 */
    function onEditorKey(e) {
      var li = e.target && e.target.closest ? e.target.closest(".w-li") : null;
      if (e.key === "Tab" && e.target && e.target.classList && e.target.classList.contains("w-code-body")) {
        if (e.preventDefault) e.preventDefault();
        var st = e.target.selectionStart == null ? e.target.value.length : e.target.selectionStart;
        e.target.value = e.target.value.slice(0, st) + "  " + e.target.value.slice(e.target.selectionEnd == null ? st : e.target.selectionEnd);
        e.target.selectionStart = e.target.selectionEnd = st + 2;
        if (e.target.dispatchEvent) e.target.dispatchEvent(new Event("input", { bubbles: true }));
        return;
      }
      if (!li) return;
      var d = getDraft(), ci = +li.dataset.ci, bi = +li.dataset.bi, ii = +li.dataset.ii;
      var blk = d.chapters[ci] && d.chapters[ci].blocks[bi];
      if (!blk) return;
      if (!blk.items) blk.items = [];
      if (e.key === "Enter") {
        if (e.preventDefault) e.preventDefault();
        blk.items[ii] = readEditable(li);
        blk.items.splice(ii + 1, 0, "");
        save(); renderGuiMode(body);
        focusBlock(ci, bi, "li", ii + 1);
      } else if (e.key === "Backspace" && !readEditable(li) && blk.items.length > 1) {
        if (e.preventDefault) e.preventDefault();
        blk.items.splice(ii, 1);
        save(); renderGuiMode(body);
        focusBlock(ci, bi, "li", Math.max(0, ii - 1));
      }
    }
    /* #edBody 元素只重建一次，事件委托只绑一次，避免重复渲染后监听叠加 */
    if (!body.dataset.bound) {
      body.dataset.bound = "1";
      body.addEventListener("input", sync);
      body.addEventListener("change", sync);
      body.addEventListener("keydown", onEditorKey);
      body.addEventListener("click", onEditorClick);
      body.addEventListener("dragstart", onDragStart);
      body.addEventListener("dragover", onDragOver);
      body.addEventListener("drop", onDrop);
      body.addEventListener("dragend", resetDrag);
    }

    var fi = $("#edFile");
    if (fi) fi.onchange = function () {
      var f = fi.files[0];
      if (!f) return;
      if (f.size > 1024 * 1024) { toast("图片请小于 1MB"); fi.value = ""; return; }
      var isAudio = pendingUp && pendingUp.kind === "audio";
      var rd = new FileReader();
      rd.onload = function () {
        var dataUrl = rd.result;
        var store = function (src) {
          var d = getDraft();
          if (pendingUp && pendingUp.kind === "slot") d[pendingUp.slot] = src;
          else if (pendingUp && pendingUp.kind === "img") d.chapters[pendingUp.ci].blocks[pendingUp.bi].src = src;
          else if (pendingUp && pendingUp.kind === "audio") d.chapters[pendingUp.ci].blocks[pendingUp.bi].src = src;
          save(); renderGuiMode(body);
          toast(isAudio ? "音频已添加" : "图片已上传到本站");
          pendingUp = null; fi.value = "";
        };
        if (isAudio) {
          var probe = new Audio();
          probe.preload = "metadata";
          probe.onloadedmetadata = function () {
            if (probe.duration && probe.duration > 30) { toast("音频时长 " + Math.round(probe.duration) + " 秒，超过 30 秒上限"); fi.value = ""; return; }
            store(dataUrl);
          };
          probe.onerror = function () { store(dataUrl); };
          probe.src = dataUrl;
          return;
        }
        API.post("/api/upload", { dataUrl: dataUrl })
          .then(function (u) { store(u.url); })
          .catch(function (e) { toast(e.message || "上传失败"); fi.value = ""; });
      };
      rd.readAsDataURL(f);
    };

    function onEditorClick(e) {
      var t = e.target.closest("button");
      if (!t) return;
      var d = getDraft(), r;
      if (t.dataset.delblock != null) {
        r = t.dataset.delblock.split(",").map(Number);
        d.chapters[r[0]].blocks.splice(r[1], 1);
        if (!d.chapters[r[0]].blocks.length) d.chapters[r[0]].blocks.push({ t: "p", text: "" });
        save(); renderGuiMode(body); return;
      }
      if (t.dataset.delchap != null) {
        if (d.chapters.length <= 1) { toast("至少保留一章"); return; }
        d.chapters.splice(+t.dataset.delchap, 1);
        save(); renderGuiMode(body); return;
      }
      if (t.dataset.tipcolor != null) {
        r = t.dataset.tipcolor.split(",");
        var tipB = d.chapters[+r[0]] && d.chapters[+r[0]].blocks[+r[1]];
        if (tipB) { if (r[2]) tipB.color = r[2]; else delete tipB.color; }
        save(); renderGuiMode(body); return;
      }
      if (t.dataset.up != null) { pendingUp = { kind: "slot", slot: t.dataset.up }; $("#edFile").click(); return; }
      if (t.dataset.upcode != null) {
        var kd = t.dataset.upcode;
        var kName = { thumb: "缩略图", cover: "卡片图", hero: "完整图" }[kd] || kd;
        svgEditorModal("用代码生成图片 · " + kName, svgCodeFrom(d[kd]), function (uri) {
          getDraft()[kd] = uri; save();
          if (state.editorMode === "gui") renderGuiMode(body); else renderCodeMode(body);
        });
        return;
      }
      if (t.dataset.upimgcode != null) {
        r = t.dataset.upimgcode.split(",").map(Number);
        var blkX = d.chapters[r[0]].blocks[r[1]];
        svgEditorModal("用代码生成图片 · 图片块", svgCodeFrom(blkX.src), function (uri) {
          var b3 = getDraft().chapters[r[0]].blocks[r[1]];
          b3.src = uri; save(); renderGuiMode(body);
        });
        return;
      }
      if (t.dataset.upview != null) { openSlotPreview(t.dataset.upview); return; }
      if (t.dataset.clear != null) { d[t.dataset.clear] = ""; save(); renderGuiMode(body); return; }
      if (t.dataset.upimg != null) { r = t.dataset.upimg.split(",").map(Number); pendingUp = { kind: "img", ci: r[0], bi: r[1] }; $("#edFile").click(); return; }
      if (t.dataset.clearsrc != null) {
        r = t.dataset.clearsrc.split(",").map(Number);
        d.chapters[r[0]].blocks[r[1]].src = "";
        save(); renderGuiMode(body); return;
      }
      if (t.dataset.upaudio != null) {
        r = t.dataset.upaudio.split(",").map(Number);
        pendingUp = { kind: "audio", ci: r[0], bi: r[1] };
        var inp = document.createElement("input");
        inp.type = "file"; inp.accept = "audio/*";
        inp.onchange = function () {
          var f = inp.files[0]; if (!f) return;
          if (f.size > 2 * 1024 * 1024) { toast("音频请小于 2MB"); return; }
          var rd = new FileReader();
          rd.onload = function () {
            getDraft().chapters[pendingUp.ci].blocks[pendingUp.bi].src = rd.result;
            save(); renderGuiMode(body); toast("音频已上传");
          };
          rd.readAsDataURL(f);
        };
        inp.click(); return;
      }
      if (t.id === "edAddChap") {
        d.chapters.push({ title: "第 " + (d.chapters.length + 1) + " 章", blocks: [{ t: "p", text: "" }] });
        save(); renderGuiMode(body); return;
      }
    }
  }

  /* --- 代码编辑器支撑：高亮 / 下载 / 文件导入 / 压缩包解析 --- */
  var fsBound = false;

  /* JSON 语法高亮（键 / 字符串 / 数字 / 字面量 / 标点） */
  function jsonHighlight(code) {
    var out = "", i = 0, n = code.length;
    while (i < n) {
      var ch = code[i];
      if (ch === '"') {
        var j = i + 1;
        while (j < n) {
          if (code[j] === "\\") { j += 2; continue; }
          if (code[j] === '"') { j++; break; }
          j++;
        }
        var k = j;
        while (k < n && /\s/.test(code[k])) k++;
        out += '<span class="' + (code[k] === ":" ? "tk-key" : "tk-str") + '">' + esc(code.slice(i, j)) + "</span>";
        i = j; continue;
      }
      if (/[-\d]/.test(ch)) {
        var m = /^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(code.slice(i));
        if (m && m[0] !== "-") { out += '<span class="tk-num">' + m[0] + "</span>"; i += m[0].length; continue; }
      }
      var w = /^(true|false|null)/.exec(code.slice(i));
      if (w) { out += '<span class="tk-bool">' + w[0] + "</span>"; i += w[0].length; continue; }
      if ("{}[],:".indexOf(ch) >= 0) { out += '<span class="tk-punc">' + esc(ch) + "</span>"; i++; continue; }
      out += esc(ch); i++;
    }
    return out;
  }

  /* 下载文本到本地（无 createObjectURL 时退化为 data URI） */
  function downloadText(filename, text, mime) {
    var type = mime || "text/plain;charset=utf-8";
    var url = "";
    try { url = URL.createObjectURL(new Blob([text], { type: type })); }
    catch (e) { url = "data:" + type + "," + encodeURIComponent(text); }
    var a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () {
      if (URL.revokeObjectURL) { try { URL.revokeObjectURL(url); } catch (e2) { } }
    }, 1500);
  }

  /* Markdown / 纯文本 → 内容块 */
  function mdToBlocks(md) {
    var lines = String(md).split(/\r?\n/), blocks = [], buf = [];
    var inFence = false, fenceLang = "", fence = [];
    function flush() {
      var t = buf.join("\n").trim();
      if (t) blocks.push({ t: "p", text: t });
      buf = [];
    }
    for (var i = 0; i < lines.length; i++) {
      var ln = lines[i];
      if (/^\s*```/.test(ln)) {
        if (inFence) {
          blocks.push({ t: "code", lang: fenceLang || "text", code: fence.join("\n") });
          fence = []; inFence = false;
        } else { flush(); inFence = true; fenceLang = ln.replace(/^\s*```/, "").trim(); }
        continue;
      }
      if (inFence) { fence.push(ln); continue; }
      var h = ln.match(/^(#{1,6})\s+(.*)$/);
      if (h) { flush(); blocks.push({ t: "h2", text: h[2].trim() }); continue; }
      var q = ln.match(/^>\s?(.*)$/);
      if (q) { flush(); blocks.push({ t: "tip", text: q[1].trim() }); continue; }
      var im = ln.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/);
      if (im) { flush(); blocks.push({ t: "img", src: im[2].trim(), alt: im[1].trim(), caption: im[1].trim() }); continue; }
      var li = ln.match(/^\s*[-*+]\s+(.*)$/);
      if (li) {
        flush();
        var items = [li[1].trim()];
        while (i + 1 < lines.length && /^\s*[-*+]\s+/.test(lines[i + 1])) {
          i++; items.push(lines[i].replace(/^\s*[-*+]\s+/, "").trim());
        }
        blocks.push({ t: "ul", items: items });
        continue;
      }
      if (/^\s*$/.test(ln)) { flush(); continue; }
      buf.push(ln);
    }
    if (inFence && fence.length) blocks.push({ t: "code", lang: fenceLang || "text", code: fence.join("\n") });
    flush();
    return blocks;
  }

  var CODE_EXT = /^(js|mjs|cjs|ts|jsx|tsx|py|java|go|rs|c|h|cpp|cs|php|rb|sh|bash|sql|html|htm|css|scss|vue|kt|swift|yml|yaml|toml|ini|xml)$/;
  function baseName(name) { return String(name).replace(/^.*[\\/]/, "").replace(/\.[^.]+$/, ""); }

  /* 导入文件 → 写进草稿 */
  function applyImportedFile(name, text) {
    var low = String(name).toLowerCase(), d;
    if (/\.json$/.test(low)) {
      try {
        var o = JSON.parse(text);
        if (o && Array.isArray(o.chapters)) d = normalizeDraft(o);
        else if (Array.isArray(o)) {
          d = blankDraft(); d.title = baseName(name);
          d.chapters = [{ title: baseName(name), blocks: o.map(normBlock) }];
        } else throw new Error("不是教程结构（缺少 chapters）");
      } catch (e) { toast("JSON 导入失败：" + e.message); return; }
    } else {
      var ext = (low.match(/\.([a-z0-9]+)$/) || [])[1] || "text";
      var blocks = CODE_EXT.test(ext)
        ? [{ t: "code", lang: ext === "js" ? "javascript" : ext, code: String(text) }]
        : mdToBlocks(text);
      d = blankDraft();
      d.title = baseName(name);
      d.chapters = [{ title: baseName(name), blocks: blocks }];
    }
    state.draft = d; save();
    renderEditorBody();
    toast("已导入 " + name + "（" + d.chapters[0].blocks.length + " 个内容块）");
  }

  /* 极简 ZIP 读取：中央目录 + 存储(0)/deflate(8) 两种压缩方式 */
  function unzipSync(bytes) {
    var dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    var eocd = -1, maxBack = Math.min(bytes.length - 22, 66000);
    for (var i = bytes.length - 22; i >= bytes.length - 22 - maxBack && i >= 0; i--) {
      if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) throw new Error("不是有效的 ZIP 文件");
    var count = dv.getUint16(eocd + 10, true), cdOff = dv.getUint32(eocd + 16, true);
    var out = {}, p = cdOff, dec = new TextDecoder("utf-8");
    for (var k = 0; k < count; k++) {
      if (p + 46 > bytes.length || dv.getUint32(p, true) !== 0x02014b50) break;
      var method = dv.getUint16(p + 10, true);
      var csize = dv.getUint32(p + 20, true), usize = dv.getUint32(p + 24, true);
      var nameLen = dv.getUint16(p + 28, true), extraLen = dv.getUint16(p + 30, true), cmtLen = dv.getUint16(p + 32, true);
      var lho = dv.getUint32(p + 42, true);
      var name = dec.decode(bytes.subarray(p + 46, p + 46 + nameLen));
      var lNameLen = dv.getUint16(lho + 26, true), lExtraLen = dv.getUint16(lho + 28, true);
      var start = lho + 30 + lNameLen + lExtraLen;
      var ext = (name.match(/\.([A-Za-z0-9]+)$/) || [])[1];
      out[name] = {
        method: method, size: usize,
        raw: bytes.subarray(start, start + csize),
        isText: !!ext && (CODE_EXT.test(ext.toLowerCase()) || /^(md|markdown|txt|json)$/.test(ext.toLowerCase()))
      };
      p += 46 + nameLen + extraLen + cmtLen;
    }
    return out;
  }

  function inflateEntry(e) {
    if (e.method === 0) return Promise.resolve(new TextDecoder("utf-8").decode(e.raw));
    var DS = (typeof DecompressionStream === "function") ? DecompressionStream
      : (typeof window !== "undefined" && window.DecompressionStream) || null;
    if (!DS) return Promise.reject(new Error("当前环境不支持解压 deflate（需较新浏览器且非 file:// 直开）"));
    var stream = new Blob([e.raw]).stream().pipeThrough(new DS("deflate-raw"));
    return new Response(stream).text();
  }

  function handleZip(bytes, zipName) {
    var files;
    try { files = unzipSync(bytes); } catch (e) { toast("压缩包解析失败：" + e.message); return; }
    var names = Object.keys(files).filter(function (n) { return !/\/$/.test(n) && files[n].isText; });
    if (!names.length) { toast("压缩包内没有可导入的文本文件"); return; }
    Promise.all(names.map(function (n) {
      return inflateEntry(files[n]).then(function (txt) { files[n].text = txt; return n; })
        .catch(function () { files[n].text = null; return n; });
    })).then(function () {
      var usable = names.filter(function (n) { return files[n].text != null; });
      var failed = names.length - usable.length;
      if (!usable.length) { toast("压缩包内文件无法解压（环境不支持 deflate）"); return; }
      var mask = document.createElement("div");
      mask.className = "mask";
      mask.innerHTML =
        '<div class="modal card" style="width:540px;text-align:left;max-height:76vh;overflow:auto">' +
        "<h3>" + esc(zipName) + " 内容</h3>" +
        '<p class="muted small" style="margin:6px 0 12px">共 ' + usable.length + " 个可导入文件，选择要转换为内容块的文件" +
        (failed ? "（" + failed + " 个因压缩格式不支持已跳过）" : "") + "：</p>" +
        usable.map(function (n) {
          return '<button class="zip-item" data-n="' + esc(n) + '"><span>' + esc(n) + "</span><b>" + files[n].size + " B</b></button>";
        }).join("") +
        '<div style="display:flex;justify-content:flex-end;margin-top:12px"><button class="btn btn-ghost" id="zClose">取消</button></div></div>';
      document.body.appendChild(mask);
      $("#zClose", mask).onclick = function () { mask.remove(); };
      mask.onclick = function (e2) { if (e2.target === mask) mask.remove(); };
      $all(".zip-item", mask).forEach(function (b) {
        b.onclick = function () {
          var n = b.dataset.n;
          mask.remove();
          applyImportedFile(n, files[n].text);
        };
      });
      toast("已读取压缩包：" + usable.length + " 个文件");
    });
  }

  /* 极简 Markdown 高亮 */
  function mdHighlight(code) {
    return String(code).split("\n").map(function (ln) {
      var s = esc(ln);
      if (/^\s*#{1,6}\s/.test(ln)) return '<span class="tk-key">' + s + "</span>";
      if (/^\s*```/.test(ln)) return '<span class="tk-bool">' + s + "</span>";
      if (/^\s*[-*+]\s/.test(ln)) return '<span class="tk-str">' + s + "</span>";
      if (/^\s*>\s?/.test(ln)) return '<span class="tk-num">' + s + "</span>";
      return s;
    }).join("\n");
  }

  /* 通用文本输入弹层 */
  function textPrompt(title, init, onOk) {
    var mask = document.createElement("div");
    mask.className = "mask";
    mask.innerHTML = '<div class="modal card" style="width:380px;text-align:left"><h3>' + esc(title) + "</h3>" +
      '<div class="form-row"><input class="input" id="tpVal" value="' + esc(init || "") + '"></div>' +
      '<div style="display:flex;gap:10px;justify-content:flex-end"><button class="btn btn-ghost" id="tpCancel">取消</button>' +
      '<button class="btn btn-primary" id="tpOk">确定</button></div></div>';
    document.body.appendChild(mask);
    var inp = $("#tpVal", mask);
    if (inp && inp.focus) { try { inp.focus(); } catch (e) { /* 忽略 */ } }
    $("#tpCancel", mask).onclick = function () { mask.remove(); };
    mask.onclick = function (e) { if (e.target === mask) mask.remove(); };
    $("#tpOk", mask).onclick = function () {
      var v = inp ? inp.value.trim() : "";
      if (!v) { toast("不能为空"); return; }
      mask.remove();
      onOk(v);
    };
  }

  /* --- 代码模式：类 VS Code 编辑器（行号 / 高亮 / 缩放 / 全屏 / 文件管理 / 窗口拖动） --- */
  function renderCodeMode(body) {
    body.innerHTML =
      '<div class="set-card card"><h3>代码编辑（VS Code 风格）</h3>' +
      '<p class="desc">编辑教程 JSON；支持导入单个文件或压缩包（.zip）自动转成内容块；可高亮、缩放与全屏。</p>' +
      '<div class="vsc" id="vsc">' +
      '<div class="vsc-head" id="vscHead" title="按住可拖动窗口位置，双击复位">' +
      '<div class="vsc-tab"><i></i><span id="vscFileName">tutorial.json</span></div>' +
      '<div class="vsc-tools">' +
      '<button class="vsc-btn" id="edApply2" title="把当前文件写回草稿">应用</button>' +
      '<button class="vsc-btn" id="vscMerge" title="把当前文件并入草稿（追加为章节）">并入草稿</button>' +
      '<button class="vsc-btn" id="impFile">导入文件</button>' +
      '<button class="vsc-btn" id="impZip">导入压缩包</button>' +
      '<button class="vsc-btn" id="dlDraft" title="下载当前文件">下载</button>' +
      '<span class="vsc-zoom"><button class="vsc-btn" id="zOut" title="缩小">−</button><b id="zVal">100%</b><button class="vsc-btn" id="zIn" title="放大">+</button></span>' +
      '<button class="vsc-btn" id="vscFull" title="全屏 / 退出全屏">全屏</button>' +
      "</div></div>" +
      '<div class="vsc-main">' +
      '<aside class="vsc-files">' +
      '<div class="vf-head"><span>文件</span><span class="vf-btns">' +
      '<button class="vf-btn" id="vfFromDraft" title="从草稿导出为新文件">⇩</button>' +
      '<button class="vf-btn" id="vfNew" title="新建文件">＋</button></span></div>' +
      '<div class="vf-new hidden" id="vfNewBox"><input class="vf-input" id="vfName" placeholder="如 第2章.md"><button class="vf-ok" id="vfCreate">建</button></div>' +
      '<div id="vfList"></div>' +
      '<div class="vf-hint">tutorial.json 与草稿互通；双击文件名可重命名</div>' +
      "</aside>" +
      '<div class="vsc-body">' +
      '<div class="vsc-gutter"><div id="vscGutter"></div></div>' +
      '<div class="vsc-code"><pre class="vsc-hl"><code id="vscHl"></code></pre>' +
      '<textarea id="edJson" spellcheck="false" wrap="off"></textarea></div>' +
      "</div></div>" +
      '<div class="vsc-status"><span id="vscInfo">JSON</span><span id="vscPos">行 1，列 1</span><span id="vscZoomInfo">缩放 100%</span></div>' +
      '<div class="vsc-resize" id="vscResize" title="按住拖动调整编辑器高度"></div>' +
      '<span class="vsc-resize-x" id="vscResizeX" title="按住拖动调整编辑器宽度"></span>' +
      "</div>" +
      '<div style="display:flex;gap:10px;margin-top:12px">' +
      '<button class="btn btn-primary btn-sm" id="edApply">应用代码修改</button>' +
      '<button class="btn btn-ghost btn-sm" id="edResetCode">重新载入</button></div>' +
      '<input type="file" id="impFileInput" class="hidden" accept=".json,.md,.markdown,.txt,.js,.ts,.jsx,.tsx,.py,.java,.go,.rs,.c,.cpp,.cs,.php,.rb,.sh,.sql,.html,.css,.vue,.yml,.yaml">' +
      '<input type="file" id="impZipInput" class="hidden" accept=".zip,application/zip">' +
      "</div>";

    var ta = $("#edJson"), hl = $("#vscHl"), gut = $("#vscGutter"), vsc = $("#vsc");
    if (!state.files) state.files = [{ name: "tutorial.json", text: "" }];
    if (!state.files.some(function (f) { return f.name === state.activeFile; })) state.activeFile = "tutorial.json";

    function activeFileObj() {
      for (var i = 0; i < state.files.length; i++) if (state.files[i].name === state.activeFile) return state.files[i];
      return state.files[0];
    }
    function isDraftFile() { return state.activeFile === "tutorial.json"; }
    function langOf(name) { var m = /\.([a-z0-9]+)$/i.exec(name || ""); return m ? m[1].toLowerCase() : "text"; }
    function fileText(f) { return f.name === "tutorial.json" ? draftCode(getDraft()) : (f.text || ""); }

    function paint() {
      var v = ta.value, lines = v.split("\n").length, ext = langOf(state.activeFile);
      hl.innerHTML = (ext === "json" ? jsonHighlight(v) : (ext === "md" || ext === "markdown") ? mdHighlight(v) : esc(v)) + "\n";
      var g = "";
      for (var i = 1; i <= lines; i++) g += i + "\n";
      gut.textContent = g;
      var info = $("#vscInfo");
      if (info) info.textContent = ext.toUpperCase() + " · " + lines + " 行 · " + v.length + " 字符";
    }
    function renderFileList() {
      var box = $("#vfList");
      if (!box) return;
      box.innerHTML = state.files.map(function (f) {
        var ext = langOf(f.name);
        var ico = ext === "json" ? "{}" : (ext === "md" || ext === "markdown") ? "M" : "•";
        return '<div class="vf-item' + (f.name === state.activeFile ? " active" : "") + '" data-file="' + esc(f.name) + '">' +
          '<span class="vf-ico">' + ico + "</span>" +
          '<span class="vf-name">' + esc(f.name) + "</span>" +
          (f.name === "tutorial.json" ? "" : '<button class="vf-del" data-fdel="' + esc(f.name) + '" title="删除文件">✕</button>') +
          "</div>";
      }).join("");
    }
    function loadActive() {
      var f = activeFileObj();
      ta.value = fileText(f);
      var fn = $("#vscFileName"); if (fn) fn.textContent = f.name;
      renderFileList(); paint(); syncScroll(); updPos();
    }
    function commitActive() {
      var f = activeFileObj();
      if (f && !isDraftFile()) f.text = ta.value;
      save();
    }
    function leaveDraftOk() {
      if (!isDraftFile()) return true;
      try {
        var o = JSON.parse(ta.value);
        if (!o || !Array.isArray(o.chapters)) throw new Error("缺少 chapters 数组");
        state.draft = normalizeDraft(o); save(); return true;
      } catch (e) { toast("草稿 JSON 有误，未切换文件：" + e.message); return false; }
    }
    function syncScroll() {
      /* 直接同步滚动位置（不做 transform）：高亮层与行号层都是 overflow:hidden 的裁剪盒 */
      var hlBox = hl.parentNode, gutBox = gut.parentNode;
      if (hlBox) { hlBox.scrollTop = ta.scrollTop; hlBox.scrollLeft = ta.scrollLeft; }
      if (gutBox) gutBox.scrollTop = ta.scrollTop;
    }
    function updPos() {
      var upto = ta.value.slice(0, ta.selectionStart).split("\n");
      var el = $("#vscPos");
      if (el) el.textContent = "行 " + upto.length + "，列 " + (upto[upto.length - 1].length + 1);
    }
    function setZoom(z, silent) {
      state.codeZoom = Math.min(200, Math.max(60, z)); save();
      var fsz = (12 * state.codeZoom / 100) + "px";
      ta.style.fontSize = fsz; hl.style.fontSize = fsz; gut.style.fontSize = fsz;
      var zv = $("#zVal"); if (zv) zv.textContent = state.codeZoom + "%";
      var zi = $("#vscZoomInfo"); if (zi) zi.textContent = "缩放 " + state.codeZoom + "%";
      syncScroll();
      if (!silent) toast("缩放 " + state.codeZoom + "%");
    }
    loadActive(); setZoom(state.codeZoom, true);

    ta.addEventListener("input", function () {
      var f = activeFileObj();
      if (f && !isDraftFile()) { f.text = ta.value; save(); }
      paint(); syncScroll(); updPos();
    });
    ta.addEventListener("scroll", syncScroll);
    ta.addEventListener("keyup", updPos);
    ta.addEventListener("click", updPos);
    vsc.addEventListener("wheel", function (e) {
      if (!e.ctrlKey) return;
      if (e.preventDefault) e.preventDefault();
      setZoom(state.codeZoom + (e.deltaY < 0 ? 10 : -10), true);
    }, { passive: false });

    $("#zIn").onclick = function () { setZoom(state.codeZoom + 10); };
    $("#zOut").onclick = function () { setZoom(state.codeZoom - 10); };
    $("#dlDraft").onclick = function () {
      var ext = langOf(state.activeFile);
      downloadText(state.activeFile, ta.value, ext === "json" ? "application/json" : "text/plain;charset=utf-8");
      toast("已下载 " + state.activeFile);
    };

    /* 拖动边缘调整编辑器大小（下边缘=高度，右边缘=宽度），尺寸本地记忆 */
    var vscBody = $(".vsc-body");
    function applySize() {
      if (vscBody) vscBody.style.height = Math.max(200, state.codeHeight || 420) + "px";
      if (state.codeWidth && state.codeWidth < 100) vsc.style.width = state.codeWidth + "%";
      else vsc.style.width = "";
      syncScroll();
    }
    function dragEdge(e, axis) {
      var pt = function (ev) { return ev.touches ? { x: ev.touches[0].clientX, y: ev.touches[0].clientY } : { x: ev.clientX, y: ev.clientY }; };
      var p0 = pt(e);
      var startH = vscBody.getBoundingClientRect().height || (state.codeHeight || 420);
      var startW = vsc.getBoundingClientRect().width || 0;
      var hostW = (vsc.parentNode && vsc.parentNode.getBoundingClientRect().width) || startW || 1;
      function move(ev) {
        var p = pt(ev);
        if (axis !== "x") {
          var h = Math.round(startH + (p.y - p0.y));
          state.codeHeight = Math.max(200, Math.min(Math.round((window.innerHeight || 800) * 0.92), h));
          vscBody.style.height = state.codeHeight + "px";
        }
        if (axis !== "y" && startW) {
          var w = Math.round(startW + (p.x - p0.x));
          state.codeWidth = Math.max(40, Math.min(100, Math.round(w / hostW * 100)));
          vsc.style.width = state.codeWidth < 100 ? state.codeWidth + "%" : "";
        }
        syncScroll();
      }
      function up() {
        save();
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
        document.removeEventListener("touchmove", move);
        document.removeEventListener("touchend", up);
      }
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
      document.addEventListener("touchmove", move, { passive: false });
      document.addEventListener("touchend", up);
      if (e.preventDefault) e.preventDefault();
    }
    applySize();
    var rzY = $("#vscResize"), rzX = $("#vscResizeX");
    if (rzY) {
      rzY.addEventListener("mousedown", function (e) { dragEdge(e, "y"); });
      rzY.addEventListener("touchstart", function (e) { dragEdge(e, "y"); }, { passive: false });
    }
    if (rzX) {
      rzX.addEventListener("mousedown", function (e) { dragEdge(e, "x"); });
      rzX.addEventListener("touchstart", function (e) { dragEdge(e, "x"); }, { passive: false });
    }

    /* 全屏：优先真实全屏 API，不可用时退化为铺满窗口 */
    function fullOn() { return document.fullscreenElement === vsc || vsc.classList.contains("vsc-full"); }
    function setFullBtn() { var b = $("#vscFull"); if (b) b.textContent = fullOn() ? "退出全屏" : "全屏"; }
    $("#vscFull").onclick = function () {
      if (fullOn()) {
        if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen();
        vsc.classList.remove("vsc-full"); applySize(); setFullBtn(); return;
      }
      function big() { if (vscBody) vscBody.style.height = "calc(100vh - 130px)"; setFullBtn(); }
      if (vsc.requestFullscreen) {
        var pr = vsc.requestFullscreen();
        if (pr && pr.catch) pr.catch(function () { vsc.classList.add("vsc-full"); big(); });
        setTimeout(big, 40);
      } else { vsc.classList.add("vsc-full"); big(); }
      toast("全屏编辑中，按 Esc 退出");
    };
    vsc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && vsc.classList.contains("vsc-full")) {
        vsc.classList.remove("vsc-full"); applySize(); setFullBtn();
      }
    });
    if (!fsBound) {
      fsBound = true;
      document.addEventListener("fullscreenchange", function () {
        var v = $("#vsc");
        if (v) {
          v.classList.remove("vsc-full");
          var bd = $(".vsc-body");
          if (bd) bd.style.height = Math.max(200, state.codeHeight || 420) + "px";
        }
        var b = $("#vscFull");
        if (b) b.textContent = document.fullscreenElement ? "退出全屏" : "全屏";
      });
    }

    function applyCode(silent) {
      var f = activeFileObj();
      if (!isDraftFile()) {
        if (f) f.text = ta.value;
        save();
        if (!silent) toast("已保存到文件 " + state.activeFile);
        return true;
      }
      try {
        var obj = JSON.parse(ta.value);
        if (!obj || !Array.isArray(obj.chapters)) throw new Error("缺少 chapters 数组");
        state.draft = normalizeDraft(obj); save();
        if (!silent) toast("代码已写回草稿");
        return true;
      } catch (err) { if (!silent) toast("JSON 解析失败：" + err.message); return false; }
    }
    $("#edApply").onclick = function () { if (applyCode()) renderCodeMode(body); };
    $("#edApply2").onclick = function () { applyCode(); };
    $("#edResetCode").onclick = function () { renderCodeMode(body); toast("已重新载入"); };

    /* 文件管理器：新建 / 切换 / 重命名 / 删除 / 从草稿导出 / 并入草稿 */
    function createFile() {
      var inp = $("#vfName");
      var nm = inp ? inp.value.trim() : "";
      if (!nm) { toast("请填写文件名"); return; }
      if (nm.indexOf(".") < 0) nm += ".md";
      if (state.files.some(function (f) { return f.name === nm; })) { toast("同名文件已存在"); return; }
      if (!leaveDraftOk()) return;
      var ext = langOf(nm), title = nm.replace(/\.[^.]+$/, "");
      var tpl = ext === "json"
        ? JSON.stringify({ title: title, intro: "", cat: "JavaScript", diff: "入门", tags: [], thumb: "", cover: "", hero: "", chapters: [{ title: "第 1 章", blocks: [{ t: "p", text: "" }] }] }, null, 2)
        : ext === "md" || ext === "markdown"
          ? "# " + title + "\n\n在这里写 Markdown；点「并入草稿」会把它追加成草稿的一章。\n\n- 列表项一\n- 列表项二\n\n> 提示：引用行会变成提示框\n\n```js\nconsole.log('hello 喵站')\n```\n"
          : "// " + title + "\n";
      state.files.push({ name: nm, text: tpl });
      state.activeFile = nm; save(); loadActive();
      if ($("#vfNewBox")) $("#vfNewBox").classList.add("hidden");
      toast("已创建 " + nm);
    }
    if ($("#vfNew")) $("#vfNew").onclick = function () {
      var box = $("#vfNewBox");
      box.classList.toggle("hidden");
      if (!box.classList.contains("hidden")) { var i2 = $("#vfName"); if (i2) { i2.value = ""; try { i2.focus(); } catch (e) { } } }
    };
    if ($("#vfCreate")) $("#vfCreate").onclick = createFile;
    if ($("#vfName")) $("#vfName").onkeydown = function (e) { if (e.key === "Enter") createFile(); };
    if ($("#vfFromDraft")) $("#vfFromDraft").onclick = function () {
      var nm = "draft-copy-" + (state.files.length) + ".json";
      state.files.push({ name: nm, text: draftCode(getDraft()) });
      state.activeFile = nm; save(); loadActive();
      toast("已从草稿导出 " + nm);
    };
    if ($("#vfList")) $("#vfList").addEventListener("click", function (e) {
      var del = e.target.closest ? e.target.closest("[data-fdel]") : null;
      if (del) {
        var dn = del.dataset.fdel;
        state.files = state.files.filter(function (f) { return f.name !== dn; });
        if (state.activeFile === dn) state.activeFile = "tutorial.json";
        save(); loadActive(); toast("已删除 " + dn);
        return;
      }
      var item = e.target.closest ? e.target.closest("[data-file]") : null;
      if (!item || item.dataset.file === state.activeFile) return;
      if (!leaveDraftOk()) return;
      commitActive();
      state.activeFile = item.dataset.file; save(); loadActive();
    });
    if ($("#vfList")) $("#vfList").addEventListener("dblclick", function (e) {
      var item = e.target.closest ? e.target.closest("[data-file]") : null;
      if (!item) return;
      var old = item.dataset.file;
      textPrompt("重命名文件", old, function (nn) {
        if (state.files.some(function (f) { return f.name === nn; })) { toast("同名文件已存在"); return; }
        state.files.forEach(function (f) { if (f.name === old) f.name = nn; });
        if (state.activeFile === old) state.activeFile = nn;
        save(); loadActive(); toast("已重命名为 " + nn);
      });
    });
    $("#vscMerge").onclick = function () {
      if (isDraftFile()) { toast("tutorial.json 就是草稿本身，无需并入"); return; }
      var f = activeFileObj(), text = ta.value, ext = langOf(f.name), d = getDraft(), added = 0;
      if (ext === "json") {
        var o;
        try { o = JSON.parse(text); } catch (err) { toast("JSON 解析失败：" + err.message); return; }
        if (o && Array.isArray(o.chapters)) {
          if (o.title && !d.title) d.title = o.title;
          if (o.intro && !d.intro) d.intro = o.intro;
          ["thumb", "cover", "hero"].forEach(function (k) { if (o[k] && !d[k]) d[k] = o[k]; });
          o.chapters.forEach(function (ch) {
            d.chapters.push({ title: ch.title || "并入章节", blocks: (ch.blocks || []).map(normBlock) });
            added++;
          });
        } else if (Array.isArray(o)) {
          d.chapters.push({ title: baseName(f.name), blocks: o.map(normBlock) });
          added = 1;
        } else { toast("这个 JSON 既不是教程结构也不是内容块数组"); return; }
      } else {
        var blocks = CODE_EXT.test(ext) ? [{ t: "code", lang: ext, code: text }] : mdToBlocks(text);
        if (!blocks.length) { toast("文件内容为空"); return; }
        d.chapters.push({ title: baseName(f.name), blocks: blocks });
        added = 1;
      }
      f.text = text;
      state.activeFile = "tutorial.json";
      save(); loadActive();
      toast("已并入草稿：新增 " + added + " 个章节");
    };

    /* 非全屏时拖动标题栏移动编辑窗口（双击复位） */
    var pos = state.codePos || { x: 0, y: 0 };
    function applyPos() {
      vsc.style.transform = (pos.x || pos.y) ? "translate(" + pos.x + "px," + pos.y + "px)" : "";
      vsc.style.zIndex = (pos.x || pos.y) ? "40" : "";
    }
    applyPos();
    var headEl = $("#vscHead");
    if (headEl) {
      headEl.style.cursor = "move";
      headEl.addEventListener("mousedown", function (e) {
        if ((e.target.closest && e.target.closest("button, input")) || fullOn()) return;
        var sx = e.clientX, sy = e.clientY, ox = pos.x || 0, oy = pos.y || 0;
        function mv(ev) {
          pos = { x: Math.round(ox + ev.clientX - sx), y: Math.round(oy + ev.clientY - sy) };
          applyPos();
        }
        function up() {
          document.removeEventListener("mousemove", mv);
          document.removeEventListener("mouseup", up);
          state.codePos = pos; save(); syncScroll();
        }
        document.addEventListener("mousemove", mv);
        document.addEventListener("mouseup", up);
        if (e.preventDefault) e.preventDefault();
      });
      headEl.addEventListener("dblclick", function (e) {
        if (e.target.closest && e.target.closest("button, input")) return;
        pos = { x: 0, y: 0 }; state.codePos = pos; save(); applyPos();
        toast("编辑窗口已复位");
      });
    }

    $("#impFile").onclick = function () { $("#impFileInput").click(); };
    $("#impZip").onclick = function () { $("#impZipInput").click(); };
    $("#impFileInput").onchange = function () {
      var f = this.files && this.files[0];
      this.value = "";
      if (!f) return;
      if (f.size > 2 * 1024 * 1024) { toast("文本文件请小于 2MB"); return; }
      var rd = new FileReader();
      rd.onload = function () { applyImportedFile(f.name, String(rd.result)); };
      rd.readAsText(f);
    };
    $("#impZipInput").onchange = function () {
      var f = this.files && this.files[0];
      this.value = "";
      if (!f) return;
      if (f.size > 8 * 1024 * 1024) { toast("压缩包请小于 8MB"); return; }
      var rd = new FileReader();
      rd.onload = function () { handleZip(new Uint8Array(rd.result), f.name); };
      rd.readAsArrayBuffer(f);
    };
  }

  /* 从编辑器直接跳转到页面预览：草稿按成稿样式渲染 */
  function vPreview() {
    if (!state.teacher) { toast("预览仅对认证老师开放"); location.hash = "#/editor"; return; }
    var d = getDraft();
    var tree = d.chapters.map(function (ch, i) {
      return '<a class="rt-item" data-jump="ch-' + i + '"><span class="dot"></span><span>' + esc(ch.title) + "</span></a>";
    }).join("");
    var body = d.chapters.map(function (ch, ci) {
      return '<h2 class="pv-chap" id="ch-' + ci + '">' + esc(ch.title) + "</h2>" +
        ch.blocks.map(blockHtml).join("");
    }).join("");
    var heroSrc = coverSrc(d, "hero");
    app.innerHTML =
      '<div class="read-wrap"><div class="read-grid">' +
      '<aside class="read-tree card"><div class="rt-title">' + esc(d.title || "未命名教程") + " · 预览</div>" +
      (tree || '<span class="muted small">暂无章节</span>') + "</aside>" +
      '<article class="article">' +
      '<div class="pv-bar"><span class="badge">预览模式</span><span>这是草稿的成稿效果，发布前可随时返回修改。</span>' +
      '<button class="btn btn-soft btn-sm" id="pvBack">返回编辑</button></div>' +
      "<h1>" + esc(d.title || "未命名教程") + "</h1>" +
      '<div class="art-meta">' + esc(d.cat || "未选分类") + " · " + esc(d.diff || "未选难度") + " · " +
      (d.tags || []).map(function (x) { return "#" + esc(x); }).join(" ") + "</div>" +
      (d.intro ? '<p class="intro">' + esc(d.intro) + "</p>" : "") +
      (heroSrc ? '<figure class="art-img"><img src="' + esc(heroSrc) + '" alt="完整图"></figure>' : "") +
      (body || '<div class="empty">还没有内容，回编辑器拖几个组件吧</div>') +
      "</article>" +
      '<aside class="read-side"><div class="outline card"><h4>章节</h4>' +
      (d.chapters.map(function (ch, i) { return '<a data-jump="ch-' + i + '">' + esc(ch.title) + "</a>"; }).join("") || '<span class="muted small">无</span>') +
      "</div></aside></div></div>";
    window.scrollTo(0, 0);
    bindCopy();
    bindAudio();
    bindEnCards();
    $("#pvBack").onclick = function () { location.hash = "#/editor"; };
    $all("[data-jump]").forEach(function (a) {
      a.onclick = function (e) {
        if (e.preventDefault) e.preventDefault();
        var el = document.getElementById(a.dataset.jump);
        if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "start" });
      };
    });
  }

  /* 后端未连接时的提示页（不再退回假数据） */
  function beOffline() {
    app.innerHTML = '<div class="auth-wrap"><div class="auth-card card">' +
      "<h1>前端已就绪，后端未连接</h1>" +
      '<p class="sub">页面数据全部来自后端接口。请先启动后端服务，再刷新本页。</p>' +
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
    if (!BE.ready && !BE.error) await BE.boot();
    if (BE.error && s[0] !== "login") return beOffline();
    try {
      if (s[0] === "tutorial" && s[1]) {
        await BE.ensureTutorial(s[1]);
      } else if (s[0] === "read" && s[1] && s[2]) {
        await BE.ensureTutorial(s[1]);
        var rt = BE.find(s[1]);
        var hasCh = rt && rt.chapters && rt.chapters.some(function (c) { return c.id === s[2]; });
        try { await BE.loadChapter(s[1], s[2]); }       // 游客也可读；登录用户额外记进度
        catch (e) { toast(e.message || "本章加载失败"); }
      } else if (s[0] === "user" && s[1]) {
        await BE.loadUser(decodeURIComponent(s[1]));
      } else if (s[0] === "friends") {
        if (!state.user) { goLogin("查看好友"); return; }
        await BE.loadFriends();
      } else if (s[0] === "me") {
        await BE.loadMe();
        await BE.loadWorks().catch(function () { BE.works = { items: [] }; });
        await BE.loadFavs().catch(function () { BE.favs = { items: [] }; });
      }
    } catch (e) {
      toast((e && e.message) || "加载失败");
    }
    if (s.length === 0) vCategory(r.params);
    else if (s[0] === "category") vCategory(r.params);
    else if (s[0] === "tutorial" && s[1]) vTutorial({ id: s[1] });
    else if (s[0] === "read" && s[1] && s[2]) vRead({ id: s[1], cid: s[2] });
    else if (s[0] === "search") vSearch(r.params);
    else if (s[0] === "login") vLogin();
    else if (s[0] === "me") vMe();
    else if (s[0] === "friends") vFriends();
    else if (s[0] === "user" && s[1]) vUser({ name: decodeURIComponent(s[1]) });
    else if (s[0] === "editor") vEditor();
    else if (s[0] === "preview") vPreview();
    else if (s[0] === "apply") vApply();
    else if (s[0] === "settings") vSettings();
    else v404();
    window.scrollTo(0, 0);
  }

  /* ---------------- 启动 ---------------- */
  function init() {
    app = $("#app");
    renderNavRight();
    applyTheme();
    var ns = $("#navSearch");
    ns.onkeydown = function (e) {
      if (e.key === "Enter") location.hash = "#/search?q=" + encodeURIComponent(ns.value.trim());
    };
    window.addEventListener("hashchange", router);
    router();
  }
  document.addEventListener("DOMContentLoaded", init);
})();
