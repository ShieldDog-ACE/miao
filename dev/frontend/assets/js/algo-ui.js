/* 喵站 · 考试 · 算法题库界面（列表 + 做题页）
 *
 * 参考的是力扣那两张页面的结构，功能按「大量精简」那轮的口径砍到只剩：
 *   列表：题型筛选用哈希表 / 数组这种；一行一题，题目在左，难度 / 结果在右，
 *         最右一颗收藏星；没有通过率、企业标签、打卡、排名。
 *   做题：左边「题目描述」（示例和提示只放文字，不做卡片），右边一栏代码：
 *         顶栏左边「代码」与纯文字语言选择，右上角是 重置 / 运行·提交一组、全屏、折叠；
 *         题面 / 代码可拖分栏，代码 / 测试面板可拖高度。
 *         测试用例是 Case 标签 + 参数输入；测试结果照力扣：通过 / 执行用时 + Case +
 *         输入 / 输出 / 预期结果（编译失败只留报错）；不做击败百分比与排行榜。
 *
 * 题面、用例、参考解都在 assets/data/algo-exam-data.js；
 * 判分与测量在 algo-judge.js；编辑器复用 code-editor.js（和课末考试同一件控件）。
 * 首屏不加载这一件：进 #/exams 才由 data.js 按需注入。
 */
(function (root) {
  "use strict";
  var doc = root.document;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function toast(msg) {
    var box = doc.querySelector("#toast");
    if (!box) return;
    var el = doc.createElement("div");
    el.className = "toast-item";
    el.textContent = msg;
    box.appendChild(el);
    setTimeout(function () { el.style.opacity = "0"; el.style.transition = "opacity .4s"; }, 1800);
    setTimeout(function () { el.remove(); }, 2300);
  }

  var K_RESULTS = "miao_algo_results";
  var K_DRAFT = "miao_algo_draft_";
  var K_FAVS = "miao_algo_favs";
  var K_LANG = "miao_algo_lang";
  var K_CODE_FS = "miao_code_fs", K_CODE_THEME = "miao_code_theme";
  /* 三种代码高光；颜色写在 JS 里，避免往 :root 外塞硬编码色被主题闸门拦下 */
  var CODE_THEMES = {
    cl: {
      label: "CLion",
      /* 本机 CLion 2026.3 的 Islands Dark：themes/islands/IslandSchemeDark.xml */
      vars: {
        "--ide-bg": "#191A1C", "--text": "#BCBEC4", "--text-3": "#4B5059",
        "--ide-key": "#CF8E6D", "--ide-str": "#6AAB73", "--ide-num": "#2AACB8",
        "--ide-bi": "#56A8F5", "--ide-call": "#56A8F5", "--ide-const": "#C77DBB",
        "--ide-self": "#C77DBB", "--ide-com": "#7A7E85", "--ide-fex": "#6AAB73",
        "--ide-op": "#BCBEC4", "--ide-pun": "#BCBEC4", "--ide-var": "#BCBEC4",
        "--ide-guide": "rgba(255,255,255,.06)", "--ide-tws": "rgba(255,120,120,.16)",
        "--ide-curln": "#1F2024", "--ide-sel": "#214283",
        "--ide-flash": "rgba(255,255,255,.12)"
      }
    },
    trae: {
      label: "Trae",
      /* 本机 Trae CN 的 Dark（theme-icube dark_plus → dark_vs） */
      vars: {
        "--ide-bg": "#1A1B1D", "--text": "#D1D3DB", "--text-3": "#979AA4",
        "--ide-key": "#B38CFF", "--ide-str": "#82D99F", "--ide-num": "#F48CCA",
        "--ide-bi": "#81CFE0", "--ide-call": "#F29D79", "--ide-const": "#80BBFF",
        "--ide-self": "#DED47E", "--ide-com": "#737780", "--ide-fex": "#82D99F",
        "--ide-op": "#D1D3DB", "--ide-pun": "#D1D3DB", "--ide-var": "#DED47E",
        "--ide-guide": "rgba(255,255,255,.06)", "--ide-tws": "rgba(255,120,120,.16)",
        "--ide-curln": "#292C34", "--ide-sel": "rgba(53,121,255,.28)",
        "--ide-flash": "rgba(255,255,255,.14)"
      }
    },
    vscode: {
      label: "VS Code",
      /* 本机 VS Code 默认 Dark Modern（theme-defaults dark_modern + dark_plus） */
      vars: {
        "--ide-bg": "#1F1F1F", "--text": "#CCCCCC", "--text-3": "#6E7681",
        "--ide-key": "#C586C0", "--ide-str": "#CE9178", "--ide-num": "#B5CEA8",
        "--ide-bi": "#4EC9B0", "--ide-call": "#DCDCAA", "--ide-const": "#4FC1FF",
        "--ide-self": "#9CDCFE", "--ide-com": "#6A9955", "--ide-fex": "#D7BA7D",
        "--ide-op": "#CCCCCC", "--ide-pun": "#CCCCCC", "--ide-var": "#9CDCFE",
        "--ide-guide": "rgba(255,255,255,.08)", "--ide-tws": "rgba(255,130,130,.16)",
        "--ide-curln": "rgba(255,255,255,.04)", "--ide-sel": "rgba(38,79,120,.75)",
        "--ide-flash": "rgba(77,159,253,.28)"
      }
    }
  };
  function normCodeFs(v) {
    var n = Number(v);
    if (!isFinite(n)) n = 14;
    return Math.max(12, Math.min(24, Math.round(n)));
  }
  function normCodeTheme(k) { return CODE_THEMES[k] ? k : "vscode"; }
  function applyCodeStyle(host, fs, theme) {
    if (!host) return;
    host.style.setProperty("--ide-fs", fs + "px");
    host.style.setProperty("--ide-lhpx", (fs * 1.65).toFixed(1) + "px");
    var vars = CODE_THEMES[normCodeTheme(theme)].vars;
    Object.keys(vars).forEach(function (k) { host.style.setProperty(k, vars[k]); });
  }
  function read(k, dft) { try { var v = localStorage.getItem(k); return v === null ? dft : JSON.parse(v); } catch (e) { return dft; } }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.warn("[算法题库] 本机存储写不进去", k, e); } }
  function results() { return read(K_RESULTS, {}); }
  function markPassed(p, r) {
    var all = results();
    all[p.id] = { passed: true, at: Date.now(), ms: r.ms, memory: r.memoryText };
    write(K_RESULTS, all);
  }
  function draftKey(id, lang) { return K_DRAFT + id + (lang === "py3" ? "" : "_" + lang); }
  function draftOf(id, lang) { try { return localStorage.getItem(draftKey(id, lang)); } catch (e) { return null; } }
  function saveDraft(id, lang, text) { try { localStorage.setItem(draftKey(id, lang), text); } catch (e) { } }
  function cleanStarter(text) {
    return String(text == null ? "" : text).replace(/^[ \t]*#[ \t]*在这里写代码[ \t]*\r?\n?/gm, "");
  }
  function favs() { var a = read(K_FAVS, []); return Array.isArray(a) ? a : []; }
  function isFav(id) { return favs().indexOf(id) >= 0; }
  function toggleFav(id) {
    var a = favs(), i = a.indexOf(id);
    if (i >= 0) a.splice(i, 1); else a.push(id);
    write(K_FAVS, a);
    return i < 0;
  }

  var DIFF_CLASS = { "简单": "easy", "中等": "medium", "困难": "hard" };

  function pyShow(v) {
    if (v === null || v === undefined) return "None";
    if (v === true) return "True";
    if (v === false) return "False";
    if (typeof v === "string") return JSON.stringify(v);
    if (Array.isArray(v)) return "[" + v.map(pyShow).join(", ") + "]";
    if (typeof v === "object") {
      try { return JSON.stringify(v); } catch (e) { return String(v); }
    }
    return String(v);
  }
  function argsShow(args) { return (args || []).map(pyShow).join(", "); }

  /* 从 starter 的 def 签名取参数名，测试用例输入照力扣写成 nums = / target = */
  function argNames(problem) {
    if (problem._argNames) return problem._argNames;
    var m = /def\s+[A-Za-z_]\w*\s*\(([^)]*)\)/.exec(String(problem.starter || ""));
    var names = m ? m[1].split(",").map(function (x) {
      return x.trim().split("=")[0].replace(/^\*+/, "").trim();
    }).filter(Boolean) : [];
    problem._argNames = names;
    return names;
  }

  function data() {
    var d = root.MIAO_ALGO;
    return d && Array.isArray(d.problems) ? d : null;
  }

  /* ================= 列表 ================= */
  /* 分类改成题型（哈希表 / 数组 / 栈…）；语言不再出现在列表里。
     每道题一行：题目在最左，难度 / 结果在右，最右一颗收藏星；没有表头、没有简介。 */
  var TOPICS = ["数组", "哈希表", "数学", "栈", "双指针", "二分查找", "动态规划", "滑动窗口", "排序"];
  var DIFFS = ["简单", "中等", "困难"];

  function algoProblemsFor(params) {
    params = params || {};
    var d = data();
    if (!d) return [];
    var curCat = params.cat || "", curDiff = params.diff || "";
    return d.problems.filter(function (p) {
      return (!curCat || (p.topic || "数组") === curCat) && (!curDiff || p.difficulty === curDiff);
    });
  }

  function vList(app, params) {
    document.body.classList.remove("algo-mode");
    params = params || {};
    var d = data();
    if (!d) { app.innerHTML = '<div class="container"><div class="algo-empty">题库没加载上，刷新一次再试。</div></div>'; return; }
    var curCat = params.cat || "", curDiff = params.diff || "";
    var problems = algoProblemsFor(params);
    var solved = results();

    function chipLink(label, key, val) {
      var p = { cat: curCat, diff: curDiff };
      var on = (key === "cat" ? curCat : curDiff) === val;
      p[key] = on ? "" : val;
      var qs = Object.keys(p).filter(function (k) { return p[k]; })
        .map(function (k) { return k + "=" + encodeURIComponent(p[k]); }).join("&");
      return '<a class="chip chip-' + key + (on ? " on" : "") + '" data-fkey="' + key + '" data-fval="' + esc(val) +
        '" href="#/exams' + (qs ? "?" + qs : "") + '">' + esc(label) + "</a>";
    }
    var catOpen = true;
    try { catOpen = JSON.parse(localStorage.getItem("miao_catOpen") || "true") !== false; } catch (e) { catOpen = true; }
    var catGroup = '<div class="cat-group">' +
      '<div class="cat-head">' + chipLink("全部", "cat", "") +
      '<span class="cat-toggle" id="algoCatToggle" role="button" tabindex="0" aria-expanded="' + (catOpen ? "true" : "false") + '">' +
      (catOpen ? "收起分类" : "展开分类") + "</span></div>" +
      '<div class="cat-body' + (catOpen ? "" : " hidden") + '" id="algoCatBody">' +
      '<div class="cat-row"><span class="cat-big">题型</span>' +
      TOPICS.map(function (c) { return chipLink(c, "cat", c); }).join("") + "</div></div></div>";
    var diffChips = chipLink("全部难度", "diff", "") +
      DIFFS.map(function (x) { return chipLink(x, "diff", x); }).join("");

    function rowHtml(p) {
      var done = solved[p.id] && solved[p.id].passed;
      var fav = isFav(p.id);
      return '<div class="algo-line rv" data-id="' + esc(p.id) + '">' +
        '<a class="algo-line-title" href="#/exams/' + esc(p.id) + '"><span class="algo-no">' + p.no + ".</span> " + esc(p.title) + "</a>" +
        '<span class="algo-line-meta">' +
        '<span class="lv ' + (DIFF_CLASS[p.difficulty] || "easy") + '">' + esc(p.difficulty) + "</span>" +
        '<span class="state ' + (done ? "pass" : "no") + '">' + (done ? "通过" : "未过") + "</span>" +
        '<button class="algo-fav' + (fav ? " on" : "") + '" data-fav="' + esc(p.id) + '" type="button" aria-pressed="' + (fav ? "true" : "false") + '" title="' + (fav ? "取消收藏" : "收藏这道题") + '">' + (fav ? "★" : "☆") + "</button>" +
        "</span></div>";
    }

    app.innerHTML =
      '<div class="container algo-page">' +
      '<h1 class="page-title">考试</h1>' +
      '<div class="filter-bar">' + catGroup + "</div>" +
      '<div class="filter-bar" style="margin-top:-6px">' + diffChips + "</div>" +
      '<div id="algoList">' + (problems.length ? '<div class="algo-lines">' + problems.map(rowHtml).join("") + "</div>"
        : '<div class="empty">这个筛选下还没有题</div>') + "</div>" +
      "</div>";

    var tg = $("#algoCatToggle");
    if (tg) tg.onclick = function () {
      var body = $("#algoCatBody");
      var open = body.classList.toggle("hidden") === false;
      tg.textContent = open ? "收起分类" : "展开分类";
      tg.setAttribute("aria-expanded", open ? "true" : "false");
      try { localStorage.setItem("miao_catOpen", JSON.stringify(open)); } catch (e) { }
    };
    bindRows(app);
    window.scrollTo(0, 0);
  }

  function bindRows(scope) {
    $$(".algo-line", scope).forEach(function (line) {
      line.onclick = function (ev) {
        if (ev.target && ev.target.closest && ev.target.closest("a,button")) return;
        var href = "#/exams/" + line.dataset.id;
        if (root.MIAO_ROUTE_CROSSFADE) root.MIAO_ROUTE_CROSSFADE(href);
        else location.hash = href;
      };
    });
    $$(".algo-fav", scope).forEach(function (btn) {
      btn.onclick = function (ev) {
        ev.preventDefault(); ev.stopPropagation();
        var on = toggleFav(btn.dataset.fav);
        btn.classList.toggle("on", on);
        btn.textContent = on ? "★" : "☆";
        btn.setAttribute("aria-pressed", on ? "true" : "false");
        btn.title = on ? "取消收藏" : "收藏这道题";
        btn.classList.remove("pop");
        void btn.offsetWidth;
        btn.classList.add("pop");
        setTimeout(function () { btn.classList.remove("pop"); }, 420);
      };
    });
  }

  /* 只换下面的题目行：标题、分类、难度栏不重画 */
  function partialList(params) {
    var wrap = $("#algoList");
    if (!wrap) return false;
    params = params || {};
    var problems = algoProblemsFor(params);
    var solved = results();
    function row(p) {
      var done = solved[p.id] && solved[p.id].passed;
      var fav = isFav(p.id);
      return '<div class="algo-line rv" data-id="' + esc(p.id) + '">' +
        '<a class="algo-line-title" href="#/exams/' + esc(p.id) + '"><span class="algo-no">' + p.no + ".</span> " + esc(p.title) + "</a>" +
        '<span class="algo-line-meta">' +
        '<span class="lv ' + (DIFF_CLASS[p.difficulty] || "easy") + '">' + esc(p.difficulty) + "</span>" +
        '<span class="state ' + (done ? "pass" : "no") + '">' + (done ? "通过" : "未过") + "</span>" +
        '<button class="algo-fav' + (fav ? " on" : "") + '" data-fav="' + esc(p.id) + '" type="button" aria-pressed="' + (fav ? "true" : "false") + '" title="' + (fav ? "取消收藏" : "收藏这道题") + '">' + (fav ? "★" : "☆") + "</button>" +
        "</span></div>";
    }
    wrap.innerHTML = problems.length ? '<div class="algo-lines">' + problems.map(row).join("") + "</div>"
      : '<div class="empty">这个筛选下还没有题</div>';
    bindRows(wrap);
    var curCat = params.cat || "", curDiff = params.diff || "";
    $$(".chip[data-fkey]").forEach(function (a) {
      var k = a.dataset.fkey, v = a.dataset.fval || "";
      var on = (k === "cat" ? curCat : curDiff) === v;
      a.classList.toggle("on", on);
      var p = { cat: curCat, diff: curDiff };
      p[k] = on ? "" : v;
      var qs = Object.keys(p).filter(function (x) { return p[x]; })
        .map(function (x) { return x + "=" + encodeURIComponent(p[x]); }).join("&");
      a.setAttribute("href", "#/exams" + (qs ? "?" + qs : ""));
    });
    return true;
  }

  /* ================= 做题页 ================= */
  /* 题面：力扣那种「示例 1：/ 输入：/ 输出：/ 解释：」的块。题面数据里 example 是连续的，
     这里按出现顺序自己编号，不要求数据里写死序号。 */
  function codeHl(text) {
    var h = root.MIAO_HL && root.MIAO_HL.py;
    return h ? h(String(text == null ? "" : text)) : esc(text);
  }

  function statementHtml(blocks) {
    blocks = blocks || [];
    var lastExample = -1;
    blocks.forEach(function (b, i) { if (b.t === "example") lastExample = i; });
    var hintTexts = [], constraints = null;
    blocks.forEach(function (b, i) {
      if (b.t === "constraints") constraints = b;
      if (b.t === "p" && lastExample >= 0 && i > lastExample) hintTexts.push(b.text);
    });
    var hintItems = hintTexts.length ? null : ((constraints && constraints.items) || []);
    var out = [], egNo = 0;
    blocks.forEach(function (b, i) {
      if (b.t === "p") {
        /* 演示下面那几段解释不再散在正文里，统一收进「提示」 */
        if (lastExample >= 0 && i > lastExample) return;
        out.push("<p>" + esc(b.text) + "</p>");
      } else if (b.t === "h") {
        out.push("<h3>" + esc(b.text) + "</h3>");
      } else if (b.t === "example") {
        egNo++;
        /* 演示只放文字，不再做卡片 */
        out.push('<p class="algo-example-text">' +
          '<span class="algo-example-head">示例 ' + egNo + "：</span><br>" +
          '<span class="algo-example-lbl">输入：</span><code>' + codeHl(b.input) + "</code><br>" +
          '<span class="algo-example-lbl">输出：</span><code>' + codeHl(b.output) + "</code>" +
          (b.note ? '<br><span class="algo-example-lbl">解释：</span>' + esc(b.note) : "") +
          "</p>");
      }
      /* constraints 不再单独渲染；有解释就用解释，没有再把约束放进提示 */
    });
    /* 提示同样只放文字，不做专属卡片 / 折叠头 */
    if (hintTexts.length) {
      out.push('<div class="algo-hint-text">' +
        hintTexts.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") +
        "</div>");
    } else if (hintItems.length) {
      out.push('<div class="algo-hint-text"><ul>' +
        hintItems.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") +
        "</ul></div>");
    }
    return out.join("");
  }

  /* 底部「测试用例」页签：照力扣样张 —— Case 1 / Case 2 / +，
     当前 Case 下面直接摆参数输入框（nums = / target =），不摆「公开」标签，也不做每例一张卡。 */
  function caseEditorHtml(problem, index, customArgs) {
    var samples = Math.min(problem.samples || 0, problem.tests.length);
    var custom = index >= samples;
    var test = custom ? { args: customArgs || [] } : (problem.tests[index] || {});
    var names = argNames(problem);
    var n = Math.max(names.length, (test.args || []).length, 1);
    var out = "";
    for (var i = 0; i < n; i++) {
      var name = names[i] || ("参数 " + (i + 1));
      var value = i < (test.args || []).length
        ? (custom ? String(test.args[i] == null ? "" : test.args[i]) : pyShow(test.args[i]))
        : "";
      out += '<label class="algo-case-field">' +
        '<span class="algo-case-name">' + esc(name) + " =</span>" +
        '<textarea class="algo-case-input" data-arg="' + i + '" rows="1" spellcheck="false" ' +
        'aria-label="' + esc(name) + ' 的输入">' + esc(value) + "</textarea></label>";
    }
    return out || '<div class="algo-case-empty">没有参数。</div>';
  }

  function casesHtml(problem) {
    var samples = Math.min(problem.samples || 0, problem.tests.length);
    if (!samples) return '<div class="algo-cases"><div class="algo-case-empty">这道题没有样例，直接提交吧。</div></div>';
    var tabs = "";
    for (var i = 0; i < samples; i++) {
      tabs += '<button class="algo-case-tab' + (i === 0 ? " on" : "") + '" data-case="' + i + '" type="button" ' +
        'role="tab" aria-selected="' + (i === 0 ? "true" : "false") + '">Case ' + (i + 1) + "</button>";
    }
    tabs += '<button class="algo-case-add" id="algoCaseAdd" type="button" aria-label="添加自定义测试用例" title="添加自定义测试用例">+</button>';
    return '<div class="algo-cases">' +
      '<div class="algo-case-tabs" role="tablist">' + tabs + "</div>" +
      '<div class="algo-case-editor" id="algoCaseEditor">' + caseEditorHtml(problem, 0, null) + "</div>" +
      "</div>";
  }

  function bindCases(problem) {
    var pane = $("#algoCasesPane");
    if (!pane) return;
    var samples = Math.min(problem.samples || 0, problem.tests.length);
    if (!samples) return;
    var tabsEl = $(".algo-case-tabs", pane), editor = $("#algoCaseEditor", pane);
    if (!tabsEl || !editor) return;
    var custom = [], active = 0;
    function tabHtml() {
      var h = "";
      for (var i = 0; i < samples; i++) {
        h += '<button class="algo-case-tab' + (active === i ? " on" : "") + '" data-case="' + i + '" type="button" ' +
          'role="tab" aria-selected="' + (active === i ? "true" : "false") + '">Case ' + (i + 1) + "</button>";
      }
      for (var j = 0; j < custom.length; j++) {
        var k = samples + j;
        h += '<button class="algo-case-tab' + (active === k ? " on" : "") + '" data-case="' + k + '" type="button" ' +
          'role="tab" aria-selected="' + (active === k ? "true" : "false") + '">Case ' + (k + 1) + "</button>";
      }
      return h + '<button class="algo-case-add" id="algoCaseAdd" type="button" aria-label="添加自定义测试用例" title="添加自定义测试用例">+</button>';
    }
    function sync() {
      tabsEl.innerHTML = tabHtml();
      $$(".algo-case-tab", tabsEl).forEach(function (b) {
        b.onclick = function () { active = +b.dataset.case; sync(); };
      });
      var add = $("#algoCaseAdd", tabsEl);
      if (add) add.onclick = function () {
        custom.push([]);
        active = samples + custom.length - 1;
        sync();
      };
      editor.innerHTML = caseEditorHtml(problem, active, custom[active - samples] || []);
      $$(".algo-case-input", editor).forEach(function (ta) {
        var i = +ta.dataset.arg;
        ta.oninput = function () {
          if (active < samples) return;
          var arr = custom[active - samples];
          while (arr.length <= i) arr.push("");
          arr[i] = ta.value;
        };
      });
    }
    sync();
  }

  /* 「测试结果」照力扣页签：通过 / 执行用时；Case 1…；输入 / 输出 / 预期结果。
     不通过时也不写「未过」；编译失败只留报错。 */
  function resCaseHtml(problem, r, i) {
    var c = r.cases[i] || {};
    var test = problem.tests[i] || {};
    var names = argNames(problem);
    var args = test.args || [];
    var fields = args.map(function (v, j) {
      return '<div class="algo-res-field">' +
        '<span class="algo-res-name">' + esc(names[j] || ("参数 " + (j + 1))) + " =</span>" +
        '<div class="algo-res-val">' + esc(pyShow(v)) + "</div></div>";
    }).join("");
    var out = '<div class="algo-res-label">输入</div><div class="algo-res-group">' + fields + "</div>";
    if (c.error && c.got === undefined) {
      return out + '<div class="algo-res-label">输出</div><div class="algo-err">' + esc(c.error) + "</div>";
    }
    return out +
      '<div class="algo-res-label">输出</div><div class="algo-res-box">' + esc(pyShow(c.got)) + "</div>" +
      '<div class="algo-res-label">预期结果</div><div class="algo-res-box">' + esc(pyShow(test.expect)) + "</div>";
  }

  function renderResult(box, problem, r, mode) {
    if (r.fatal) {
      box.innerHTML = '<div class="algo-err">' + esc(r.fatal) + "</div>";
      return;
    }
    var cases = r.cases || [];
    if (!cases.length) { box.innerHTML = ""; return; }
    var tabs = cases.map(function (c, i) {
      return '<button class="algo-res-tab' + (i === 0 ? " on" : "") + '" data-res="' + i + '" type="button" ' +
        'role="tab" aria-selected="' + (i === 0 ? "true" : "false") + '">' +
        (c.ok ? '<span class="mk">✓</span>' : "") + "Case " + (i + 1) + "</button>";
    }).join("");
    var head = (r.passed ? "<b>通过</b>" : "") + "<span>执行用时: " + r.ms + " ms</span>";
    box.innerHTML = '<div class="algo-res-head">' + head + "</div>" +
      '<div class="algo-res-tabs" role="tablist">' + tabs + "</div>" +
      '<div class="algo-res-body" id="algoResBody">' + resCaseHtml(problem, r, 0) + "</div>";
    $$(".algo-res-tab", box).forEach(function (b) {
      b.onclick = function () {
        var idx = +b.dataset.res;
        $$(".algo-res-tab", box).forEach(function (x) {
          var on = x === b;
          x.classList.toggle("on", on);
          x.setAttribute("aria-selected", on ? "true" : "false");
        });
        $("#algoResBody", box).innerHTML = resCaseHtml(problem, r, idx);
      };
    });
  }

  var CPP_STARTERS = {
    "two-sum": "vector<int> two_sum(vector<int>& nums, int target) {\n    \n}\n",
    "palindrome-number": "bool is_palindrome(int x) {\n    \n}\n",
    "valid-parentheses": "bool is_valid(string s) {\n    \n}\n",
    "merge-sorted-array": "vector<int> merge_sorted(vector<int>& nums1, vector<int>& nums2) {\n    \n}\n",
    "binary-search": "int search(vector<int>& nums, int target) {\n    \n}\n",
    "climb-stairs": "int climb_stairs(int n) {\n    \n}\n",
    "max-subarray": "int max_sub_array(vector<int>& nums) {\n    \n}\n",
    "longest-substring": "int length_of_longest_substring(string s) {\n    \n}\n",
    "search-insert": "int search_insert(vector<int>& nums, int target) {\n    \n}\n",
    "move-zeroes": "void move_zeroes(vector<int>& nums) {\n    \n}\n",
    "merge-intervals": "vector<vector<int>> merge_intervals(vector<vector<int>>& intervals) {\n    \n}\n",
    "trapping-rain-water": "int trap(vector<int>& height) {\n    \n}\n",
    "longest-valid-parentheses": "int longest_valid_parentheses(string s) {\n    \n}\n"
  };
  function cppStarter(problem) {
    var fn = CPP_STARTERS[problem.id] || "int main() {\n\n    return 0;\n}\n";
    if (fn.indexOf("int main") < 0) fn += "\nint main() {\n    return 0;\n}\n";
    /* 不用 GCC 专有的 bits/stdc++.h：Windows 的 MSVC 也要能直接编 */
    return "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <map>\nusing namespace std;\n\n" + fn;
  }

  function vProblem(app, id) {
    document.body.classList.add("algo-mode");
    var d = data();
    var problem = null;
    if (d) d.problems.forEach(function (p) { if (p.id === id) problem = p; });
    if (!problem) {
      app.innerHTML = '<div class="container"><div class="algo-empty">没有这道题或地址不对。<a class="btn btn-soft" href="#/exams">回考试列表</a></div></div>';
      return;
    }
    var done = results()[id] && results()[id].passed;
    var ED = root.MIAO_EDITOR;
    var JUDGE = root.MIAO_ALGO_JUDGE;
    if (!ED || !JUDGE) {
      app.innerHTML = '<div class="container"><div class="algo-empty">编辑器或判分器没加载上，刷新一次再试。</div></div>';
      return;
    }
    /* 默认 C++；Python 3 是站内真实能判题的沙箱。两种语言分开存草稿。 */
    var LANG_DEFS = [
      { key: "cpp", label: "C++", editor: "cpp" },
      { key: "py3", label: "Python 3", editor: "py" }
    ];
    function langByKey(k) {
      for (var i = 0; i < LANG_DEFS.length; i++) if (LANG_DEFS[i].key === k) return LANG_DEFS[i];
      return LANG_DEFS[0];
    }
    var currentLang = langByKey(read(K_LANG, "cpp"));
    var draft = draftOf(id, currentLang.key);
    var initial = cleanStarter(draft !== null ? draft : (currentLang.key === "py3" ? problem.starter : cppStarter(problem)));
    var codeFs = normCodeFs(read(K_CODE_FS, 14));
    var codeTheme = normCodeTheme(read(K_CODE_THEME, "vscode"));

    /* 站内真实可执行的只有浏览器内置 Python 沙箱；不再摆其他语言的假选项。 */
    app.innerHTML =
      '<div class="algo-problem" id="algoProblem">' +
      '<section class="algo-desc" id="algoDesc">' +
      '<div class="algo-desc-tabs"><span class="algo-dtab on">题目描述</span>' +
      '<button class="algo-collapse" id="algoDescToggle" type="button" aria-expanded="true" title="收起题目描述"><span class="algo-chev">▾</span></button>' +
      '</div>' +
      '<div class="algo-desc-scroll" id="algoDescBody">' +
      '<div class="algo-title-row">' +
      '<h1 class="algo-title">' + problem.no + ". " + esc(problem.title) + "</h1>" +
      '<span class="algo-diff ' + (DIFF_CLASS[problem.difficulty] || "easy") + '">' + esc(problem.difficulty) + "</span>" +
      '<span class="algo-passed-tag" id="algoPassedTag"' + (done ? "" : " hidden") + ">已通过</span>" +
      "</div>" +
      '<div class="algo-statement">' + statementHtml(problem.statement) + "</div>" +
      "</div></section>" +
      '<div class="algo-vsplit" id="algoVSplit" role="separator" aria-orientation="vertical" title="拖动调整题目与代码宽度"></div>' +
      '<section class="algo-workspace" id="algoWorkspace">' +
      '<div class="algo-code-head">' +
      '<span class="algo-code-title">' +
      '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">' +
      '<path d="M5.5 3.5 1.5 8l4 4.5M10.5 3.5 14.5 8l-4 4.5" fill="none" stroke="currentColor" ' +
      'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>代码</span>' +
      '<div class="algo-lang-wrap">' +
      '<button class="algo-lang" id="algoLangBtn" type="button" aria-haspopup="listbox" aria-expanded="false">' +
      esc(currentLang.label) + ' <span class="algo-chev">▾</span></button>' +
      '<div class="algo-lang-menu hidden" id="algoLangMenu" role="listbox">' +
      LANG_DEFS.map(function (l) {
        return '<button class="algo-lang-option' + (l.key === currentLang.key ? " on" : "") +
          '" data-lang="' + l.key + '" type="button" role="option" aria-selected="' +
          (l.key === currentLang.key ? "true" : "false") + '">' + esc(l.label) + "</button>";
      }).join("") +
      "</div></div>" +
      '<div class="algo-ops">' +
      '<span class="algo-status" id="algoStatus" role="status"></span>' +
      '<button class="algo-gear" id="algoGear" type="button" aria-label="代码设置" title="代码设置">' +
      '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 5.6A2.4 2.4 0 1 0 8 10.4 2.4 2.4 0 0 0 8 5.6Zm5.6 3.2v-1.6l-1.7-.3a5.8 5.8 0 0 0-.5-1.2l1-1.4-1.1-1.1-1.4 1a5.8 5.8 0 0 0-1.2-.5L8.4 2H6.8l-.3 1.7a5.8 5.8 0 0 0-1.2.5l-1.4-1-1.1 1.1 1 1.4a5.8 5.8 0 0 0-.5 1.2L1.6 7.2v1.6l1.7.3c.1.4.3.8.5 1.2l-1 1.4 1.1 1.1 1.4-1c.4.2.8.4 1.2.5l.3 1.7h1.6l.3-1.7c.4-.1.8-.3 1.2-.5l1.4 1 1.1-1.1-1-1.4c.2-.4.4-.8.5-1.2l1.7-.3Z" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg></button>' +
      '<button class="algo-reset" id="algoReset" type="button" title="回到初始代码">重置</button>' +
      '<div class="algo-action" id="algoAction">' +
      '<button class="algo-run" id="algoRun" type="button" title="运行（Ctrl+Enter）">运行</button>' +
      '<button class="algo-caret" id="algoActionMore" type="button" aria-label="更多操作" aria-expanded="false">▾</button>' +
      '<div class="algo-action-menu hidden" id="algoActionMenu">' +
      '<button data-act="run" type="button">运行</button>' +
      '<button data-act="submit" id="algoSubmit" type="button">提交</button>' +
      "</div></div>" +
      '<button class="algo-collapse algo-full" id="algoFull" type="button" aria-pressed="false" title="全屏代码">' +
      '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M6 2H2v4M10 2h4v4M2 10v4h4M14 10v4h-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
      '<button class="algo-collapse" id="algoCodeToggle" type="button" aria-expanded="true" title="收起代码"><span class="algo-chev">▾</span></button>' +
      "</div></div>" +
      '<div class="algo-editor" id="algoEditor"></div>' +
      '<div class="algo-hsplit" id="algoHSplit" role="separator" aria-orientation="horizontal" title="拖动调整代码与测试面板高度"></div>' +
      '<div class="algo-console" id="algoConsole">' +
      '<div class="algo-console-tabs" role="tablist">' +
      '<button class="algo-ctab on" id="algoTabCases" type="button" role="tab" aria-selected="true">测试用例</button>' +
      '<button class="algo-ctab" id="algoTabResult" type="button" role="tab" aria-selected="false">测试结果</button>' +
      '<span class="algo-console-tools">' +
      '<button class="algo-collapse algo-full" id="algoConsoleFull" type="button" aria-pressed="false" title="全屏测试面板">' +
      '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M6 2H2v4M10 2h4v4M2 10v4h4M14 10v4h-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
      '<button class="algo-collapse" id="algoConsoleToggle" type="button" aria-expanded="true" title="收起测试面板"><span class="algo-chev">▾</span></button>' +
      "</span></div>" +
      '<div class="algo-console-body" id="algoConsoleBody">' +
      '<div class="algo-pane on" id="algoCasesPane">' + casesHtml(problem) + "</div>" +
      '<div class="algo-pane" id="algoResultPane"><div class="algo-result" id="algoResult"></div></div>' +
      "</div></div></section></div>";

    var resultBox = $("#algoResult"), status = $("#algoStatus");
    var runBtn = $("#algoRun"), submitBtn = $("#algoSubmit"), resetBtn = $("#algoReset");
    var actionWrap = $("#algoAction"), actionMore = $("#algoActionMore"), actionMenu = $("#algoActionMenu");
    var tabCases = $("#algoTabCases"), tabResult = $("#algoTabResult");
    var paneCases = $("#algoCasesPane"), paneResult = $("#algoResultPane");
    var langWrap = $(".algo-lang-wrap"), langBtn = $("#algoLangBtn"), langMenu = $("#algoLangMenu");
    var ed = null;

    function mountEditor(value) {
      var host = $("#algoEditor");
      host.innerHTML = "";
      ed = ED.create(host, {
        lang: currentLang.editor,
        value: value,
        onChange: function (v) {
          saveDraft(id, currentLang.key, v);
          if (status && !status.classList.contains("busy")) status.textContent = "";
        },
        onKey: function (ev) {
          if (!(ev.ctrlKey || ev.metaKey)) return false;
          if (ev.key === "Enter") {
            ev.preventDefault();
            if (ev.shiftKey) doSubmit(); else doRun();
            return true;
          }
          return false;
        }
      });
      ed.ta.id = "algoTa";
      applyCodeStyle(host, codeFs, codeTheme);
    }

    /* 底部两个页签：只切换显示，结果节点一直留在 DOM 里（测试与「回看」都读它） */
    function showTab(which) {
      var res = which === "result";
      tabCases.classList.toggle("on", !res);
      tabResult.classList.toggle("on", res);
      tabCases.setAttribute("aria-selected", res ? "false" : "true");
      tabResult.setAttribute("aria-selected", res ? "true" : "false");
      paneCases.classList.toggle("on", !res);
      paneResult.classList.toggle("on", res);
    }
    tabCases.onclick = function () { showTab("cases"); };
    tabResult.onclick = function () { showTab("result"); };

    mountEditor(initial);
    bindCases(problem);

    function syncLangUi() {
      langBtn.innerHTML = esc(currentLang.label) + ' <span class="algo-chev">▾</span>';
      $$(".algo-lang-option", langMenu).forEach(function (b) {
        var on = b.dataset.lang === currentLang.key;
        b.classList.toggle("on", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
    }
    function openLang() {
      langMenu.classList.remove("hidden");
      if (langMenu.parentNode !== doc.body) doc.body.appendChild(langMenu);
      langMenu.classList.add("algo-lang-portal");
      var r = langBtn.getBoundingClientRect();
      var vw = root.innerWidth || 1024, vh = root.innerHeight || 768;
      var w = langMenu.offsetWidth || 168;
      var h = langMenu.offsetHeight || 0;
      var left = Math.max(8, Math.min(r.left, vw - w - 8));
      var top = r.bottom + 6;
      if (h && top + h > vh - 8) top = Math.max(8, r.top - h - 6);
      langMenu.style.position = "fixed";
      langMenu.style.left = left + "px";
      langMenu.style.top = top + "px";
      langMenu.style.zIndex = "1200";
      langBtn.setAttribute("aria-expanded", "true");
    }
    function closeLang() {
      langMenu.classList.add("hidden");
      langBtn.setAttribute("aria-expanded", "false");
      langMenu.classList.remove("algo-lang-portal");
      langMenu.style.position = "";
      langMenu.style.left = "";
      langMenu.style.top = "";
      langMenu.style.zIndex = "";
      if (langWrap && langMenu.parentNode !== langWrap) langWrap.appendChild(langMenu);
    }
    langBtn.onclick = function (e) {
      e.stopPropagation();
      if (langMenu.classList.contains("hidden")) openLang(); else closeLang();
    };
    langMenu.onclick = function (e) { e.stopPropagation(); };
    $$(".algo-lang-option", langMenu).forEach(function (b) {
      b.onclick = function (e) {
        e.stopPropagation();
        var key = b.dataset.lang;
        if (key === currentLang.key) { closeLang(); return; }
        if (ed) saveDraft(id, currentLang.key, ed.getValue());
        currentLang = langByKey(key);
        write(K_LANG, currentLang.key);
        closeLang();
        var d = draftOf(id, currentLang.key);
        var src = cleanStarter(d !== null ? d : (currentLang.key === "py3" ? problem.starter : cppStarter(problem)));
        mountEditor(src);
        syncLangUi();
      };
    });

    function closeAction() {
      actionMenu.classList.add("hidden");
      actionMore.setAttribute("aria-expanded", "false");
    }
    actionMore.onclick = function (e) {
      e.stopPropagation();
      var hidden = actionMenu.classList.toggle("hidden");
      actionMore.setAttribute("aria-expanded", hidden ? "false" : "true");
    };
    $$("button[data-act]", actionMenu).forEach(function (b) {
      b.onclick = function (e) {
        e.stopPropagation();
        closeAction();
        if (b.dataset.act === "submit") doSubmit(); else doRun();
      };
    });
    runBtn.onclick = function () { closeAction(); doRun(); };

    function bindCollapse(btn, target, cls) {
      if (!btn || !target) return;
      btn.onclick = function () {
        var collapsed = target.classList.toggle(cls);
        btn.setAttribute("aria-expanded", collapsed ? "false" : "true");
        btn.title = collapsed ? "展开" : "收起";
      };
    }
    bindCollapse($("#algoDescToggle"), $("#algoDesc"), "collapsed");
    bindCollapse($("#algoCodeToggle"), $("#algoWorkspace"), "code-collapsed");
    bindCollapse($("#algoConsoleToggle"), $("#algoConsole"), "collapsed");

    var problemEl = $("#algoProblem"), workspaceEl = $("#algoWorkspace");
    function bindFull(btn, target, cls, label) {
      if (!btn || !target) return;
      btn.onclick = function () {
        var on = target.classList.toggle(cls);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
        btn.title = (on ? "退出全屏" : "全屏") + label;
      };
    }
    bindFull($("#algoFull"), problemEl, "code-full", "代码");
    bindFull($("#algoConsoleFull"), workspaceEl, "console-full", "测试面板");

    /* 拖分栏：左题面 / 右代码的比例，代码 / 测试面板的高度 */
    function bindSplitter(el, axis) {
      if (!el) return;
      el.addEventListener("pointerdown", function (ev) {
        if (ev.button !== 0) return;
        ev.preventDefault();
        var rect = axis === "x" ? problemEl.getBoundingClientRect() : workspaceEl.getBoundingClientRect();
        function move(e2) {
          if (axis === "x") {
            var pct = ((e2.clientX - rect.left) / rect.width) * 100;
            pct = Math.max(28, Math.min(72, pct));
            problemEl.style.setProperty("--algo-desc-w", pct + "%");
          } else {
            var h = rect.bottom - e2.clientY;
            h = Math.max(120, Math.min(rect.height * 0.72, h));
            workspaceEl.style.setProperty("--algo-console-h", h + "px");
          }
        }
        function up() {
          document.removeEventListener("pointermove", move);
          document.removeEventListener("pointerup", up);
          document.removeEventListener("pointercancel", up);
          document.body.classList.remove("algo-resizing-x", "algo-resizing-y");
        }
        document.body.classList.add(axis === "x" ? "algo-resizing-x" : "algo-resizing-y");
        document.addEventListener("pointermove", move);
        document.addEventListener("pointerup", up);
        document.addEventListener("pointercancel", up);
      });
    }
    bindSplitter($("#algoVSplit"), "x");
    bindSplitter($("#algoHSplit"), "y");

    function onDocClick(e) {
      if (!doc.body.contains(actionWrap)) { doc.removeEventListener("click", onDocClick); return; }
      if (!langWrap.contains(e.target)) closeLang();
      if (!actionWrap.contains(e.target)) closeAction();
    }
    doc.addEventListener("click", onDocClick);

    function busy(on, label) {
      runBtn.disabled = on;
      submitBtn.disabled = on;
      actionMore.disabled = on;
      resetBtn.disabled = on;
      status.classList.toggle("busy", on);
      if (on) status.textContent = label;
    }
    function after(work, label) {
      busy(true, label);
      setTimeout(function () {
        try { work(); }
        catch (e) {
          resultBox.innerHTML = '<div class="algo-err">判分器出错：' + esc(e && e.message || e) + "</div>";
          status.textContent = "判分器出错";
        }
        finally { busy(false); }
      }, 30);
    }
    function codeNow() {
      var v = ed.getValue();
      if (!String(v).trim()) { toast("先写点代码再运行"); return ""; }
      return v;
    }
    function doRun() {
      if (currentLang.key !== "py3") { openCppGuide(); return; }
      var src = codeNow();
      if (!src) return;
      showTab("result");
      after(function () {
        var r = JUDGE.run(problem, src, { samplesOnly: true });
        renderResult(resultBox, problem, r, "run");
        status.textContent = (r.fatal ? "运行出错" : (r.passed ? "样例全过" : "运行完成")) + " · " + r.ms + " ms";
      }, "正在跑样例…");
    }
    function doSubmit() {
      if (currentLang.key !== "py3") { openCppGuide(); return; }
      var src = codeNow();
      if (!src) return;
      showTab("result");
      after(function () {
        var r = JUDGE.run(problem, src, {});
        renderResult(resultBox, problem, r, "submit");
        if (r.passed) {
          markPassed(problem, r);
          $("#algoPassedTag").hidden = false;
          status.textContent = "提交通过 · " + r.passedCount + "/" + r.total + " · " + r.ms + " ms";
          toast("通过：第 " + problem.no + " 题 · 用时 " + r.ms + " ms");
        } else {
          status.textContent = "提交完成 · " + r.ms + " ms";
        }
      }, "正在跑全部用例…");
    }

    function openResetConfirm() {
      var mask = doc.createElement("div");
      mask.className = "mask";
      mask.innerHTML = '<div class="card algo-confirm">' +
        "<h3>重置代码？</h3>" +
        "<p>当前编辑内容会被替换成这道题的初始代码，操作不能撤销。</p>" +
        '<div class="algo-confirm-ops">' +
        '<button class="btn btn-ghost btn-sm" id="algoResetNo" type="button">取消</button>' +
        '<button class="btn btn-primary btn-sm" id="algoResetYes" type="button">重置</button>' +
        "</div></div>";
      doc.body.appendChild(mask);
      function close() { mask.remove(); }
      $("#algoResetNo", mask).onclick = close;
      $("#algoResetYes", mask).onclick = function () {
        var resetSrc = cleanStarter(currentLang.key === "py3" ? problem.starter : cppStarter(problem));
        ed.setValue(resetSrc);
        saveDraft(id, currentLang.key, resetSrc);
        close();
      };
      mask.onclick = function (e) { if (e.target === mask) close(); };
    }
    resetBtn.onclick = openResetConfirm;

    /* 重置左边的小齿轮：和通用设置同一张卡，但只留代码字号与三种高光 */
    function openCodeSettings() {
      var mask = doc.createElement("div");
      mask.className = "mask";
      mask.innerHTML = '<div class="card set-pop algo-code-set">' +
        '<div class="set-head"><h3>代码设置</h3>' +
        '<button class="btn btn-ghost btn-sm" id="codeSetClose" type="button">关闭</button></div>' +
        '<div class="set-body">' +
        '<div class="fs-row"><span>代码字号</span>' +
        '<input class="fs-range" id="codeFsRange" type="range" min="12" max="24" step="1" value="' + codeFs + '" aria-label="代码字号">' +
        '<b id="codeFsNow">' + codeFs + " px</b></div>" +
        '<div class="set-label">代码高光</div>' +
        '<div class="code-theme-opts">' +
        Object.keys(CODE_THEMES).map(function (k) {
          var p = CODE_THEMES[k].vars;
          return '<button class="code-theme-opt' + (k === codeTheme ? " on" : "") + '" data-code-theme="' + k + '" type="button">' +
            '<b>' + esc(CODE_THEMES[k].label) + "</b>" +
            '<span class="code-theme-dots" aria-hidden="true">' +
            '<i style="background:' + p["--ide-key"] + '"></i>' +
            '<i style="background:' + p["--ide-str"] + '"></i>' +
            '<i style="background:' + p["--ide-call"] + '"></i></span></button>';
        }).join("") +
        "</div></div></div>";
      doc.body.appendChild(mask);
      function close() {
        mask.remove();
        doc.removeEventListener("keydown", onKey);
      }
      function onKey(e) { if (e.key === "Escape") close(); }
      doc.addEventListener("keydown", onKey);
      $("#codeSetClose", mask).onclick = close;
      mask.onclick = function (e) { if (e.target === mask) close(); };
      var range = $("#codeFsRange", mask), now = $("#codeFsNow", mask);
      range.oninput = function () {
        codeFs = normCodeFs(range.value);
        now.textContent = codeFs + " px";
        write(K_CODE_FS, codeFs);
        applyCodeStyle($("#algoEditor"), codeFs, codeTheme);
      };
      $$(".code-theme-opt", mask).forEach(function (b) {
        b.onclick = function () {
          codeTheme = normCodeTheme(b.dataset.codeTheme);
          write(K_CODE_THEME, codeTheme);
          applyCodeStyle($("#algoEditor"), codeFs, codeTheme);
          $$(".code-theme-opt", mask).forEach(function (x) { x.classList.toggle("on", x === b); });
        };
      });
    }
    var gearBtn = $("#algoGear");
    if (gearBtn) gearBtn.onclick = openCodeSettings;

    /* C++ 不在浏览器里假装跑：用你电脑上的编译器。三种系统给三套命令 */
    function openCppGuide() {
      var ua = String(root.navigator && root.navigator.userAgent || "");
      var guess = /Windows/i.test(ua) ? "win" : /Macintosh|Mac OS X/i.test(ua) ? "mac" : "linux";
      var steps = {
        linux: [
          { t: "确认编译器", c: "g++ --version" },
          { t: "安装（Debian / Ubuntu）", c: "sudo apt update && sudo apt install g++", n: "Fedora：sudo dnf install gcc-c++；Arch：sudo pacman -S gcc" },
          { t: "编译并运行", c: "g++ -std=c++17 main.cpp -o main && ./main" }
        ],
        win: [
          { t: "确认编译器（PowerShell / CMD）", c: "g++ --version" },
          { t: "安装", c: "winget install MSYS2.MSYS2", n: "或装 Visual Studio Build Tools 的「使用 C++ 的桌面开发」，把 g++ 放进 PATH" },
          { t: "编译并运行（PowerShell）", c: "g++ -std=c++17 main.cpp -o main.exe; .\\main.exe" },
          { t: "或者用 MSVC（Developer PowerShell）", c: "cl /EHsc /std:c++17 main.cpp; .\\main.exe" }
        ],
        mac: [
          { t: "确认编译器", c: "clang++ --version" },
          { t: "安装 Xcode Command Line Tools", c: "xcode-select --install" },
          { t: "编译并运行", c: "clang++ -std=c++17 main.cpp -o main && ./main" },
          { t: "或者 Homebrew GCC", c: "brew install gcc && g++-14 -std=c++17 main.cpp -o main && ./main" }
        ]
      };
      var mask = doc.createElement("div");
      mask.className = "mask";
      mask.innerHTML = '<div class="card set-pop algo-cpp-guide">' +
        '<div class="set-head"><h3>C++ 本地运行</h3>' +
        '<button class="btn btn-ghost btn-sm" id="cppGuideClose" type="button">关闭</button></div>' +
        '<div class="set-body">' +
        '<p class="set-p">浏览器不会执行 C++。请用你电脑上的 C++ 编译器运行：先下载 main.cpp，再按下面的系统命令编译。</p>' +
        '<div class="cpp-os-tabs">' +
        '<button class="cpp-os-tab" data-os="linux" type="button">Linux</button>' +
        '<button class="cpp-os-tab" data-os="win" type="button">Windows</button>' +
        '<button class="cpp-os-tab" data-os="mac" type="button">macOS</button></div>' +
        '<div id="cppSteps"></div>' +
        '<div class="cpp-guide-ops"><button class="btn btn-primary btn-sm" id="cppDownload" type="button">下载 main.cpp</button></div>' +
        "</div></div>";
      doc.body.appendChild(mask);
      function close() { mask.remove(); doc.removeEventListener("keydown", onKey); }
      function onKey(e) { if (e.key === "Escape") close(); }
      doc.addEventListener("keydown", onKey);
      $("#cppGuideClose", mask).onclick = close;
      mask.onclick = function (e) { if (e.target === mask) close(); };
      function render(os) {
        $$(".cpp-os-tab", mask).forEach(function (b) { b.classList.toggle("on", b.dataset.os === os); });
        $("#cppSteps", mask).innerHTML = steps[os].map(function (s, i) {
          return '<div class="cpp-step"><b>' + (i + 1) + ". " + esc(s.t) + "</b>" +
            (s.n ? '<p class="cpp-note">' + esc(s.n) + "</p>" : "") +
            "<pre><code>" + esc(s.c) + "</code></pre></div>";
        }).join("");
      }
      $$(".cpp-os-tab", mask).forEach(function (b) {
        b.onclick = function () { render(b.dataset.os); };
      });
      $("#cppDownload", mask).onclick = function () {
        var src = ed ? ed.getValue() : "";
        try {
          var blob = new root.Blob([src], { type: "text/x-c++src" });
          var url = root.URL.createObjectURL(blob);
          var a = doc.createElement("a");
          a.href = url; a.download = "main.cpp";
          doc.body.appendChild(a); a.click(); a.remove();
          setTimeout(function () { root.URL.revokeObjectURL(url); }, 1000);
        } catch (e) { toast("下载失败，手动复制代码吧"); }
      };
      render(guess);
    }

    setTimeout(function () {
      try { ed.ta.focus({ preventScroll: true }); } catch (e) { }
    }, 30);
    window.scrollTo(0, 0);
  }

  root.MIAO_ALGO_UI = { vList: vList, vProblem: vProblem, partial: partialList };
  if (typeof module === "object" && module.exports) module.exports = root.MIAO_ALGO_UI;
})(typeof window !== "undefined" ? window : globalThis);
