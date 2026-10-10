/* 喵站 · 课末考试 · Python  IDE 界面
 *
 * 布局照 VS Code，但只留真能用的那几块：标题栏（退出 / 运行 / 重置 / 交卷 / 字号）
 * → 编辑区（题面就是文件顶部那几行 # 注释，只读、可折叠；下面是可写的代码）
 * → 屏幕正下方的面板（终端 / 判定清单 / 问题，可拖高、可收起）→ 底部状态栏。
 * 这一版只管「看得清」：着色自己扫源码、自己记偏移（引擎的 token 不带偏移，靠它拼会丢缩进和注释），
 * 判分与解释一概不动 —— 跑代码走 GRADE.runCode，交卷走 GRADE.grade。
 */
(function (root) {
  "use strict";
  var doc = root.document;
  var API = root.MIAO_API, GRADE = root.MIAO_EXAM, ENG = root.MIAO_PYFE;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------------- 编辑器排版常量：四层（题面 / 行号 / 着色层 / textarea）共用一套 ---------------- */
  var LH = 1.7;          /* 行距：四层必须一模一样，差 0.1 行号就飘 */
  var PAD_V = 10, PAD_H = 14;

  /* ---------------- 字号：Ctrl+滚轮 / Ctrl+−0，改的是 #ideRoot 上的 --ide-fs ---------------- */
  var FS_MIN = 12, FS_MAX = 26, FS_0 = 15;

  /* ---------------- 语法着色 ----------------
   * 为什么不用引擎的 token：py-engine 的 tokenize() 只给 {t, v, line}，没有 start/end，
   * 而且字符串的 v 是「解码后」的值（"\n" 变成真换行、引号没了）、注释直接不进 token、
   * f-string 的 v 还是个数组 —— 照它拼 HTML 会把缩进和注释整段丢掉，末尾还要把源码重贴一遍。
   * 所以这里自己扫一遍源码，位置由 scanner 自己记：原文一个字符都不动，只往上叠 class。 */
  var KW = ENG && ENG.KEYWORDS ? ENG.KEYWORDS : {};
  var CONST = { "True": 1, "False": 1, "None": 1 };
  var SELFISH = { self: 1, cls: 1 };
  var BUILTIN_NAMES = {
    print: 1, len: 1, range: 1, input: 1, int: 1, str: 1, float: 1, bool: 1, list: 1, tuple: 1,
    dict: 1, set: 1, type: 1, isinstance: 1, sum: 1, max: 1, min: 1, abs: 1, round: 1, sorted: 1,
    open: 1, enumerate: 1, zip: 1, reversed: 1, repr: 1, any: 1, all: 1, map: 1, filter: 1, next: 1,
    iter: 1, frozenset: 1, bytes: 1, id: 1, hash: 1, chr: 1, ord: 1, divmod: 1, pow: 1, format: 1
  };
  var PFX = "rRbBuUfF", OPS = "+-*/%<>=!&|^~@", PUNS = "([{)]},.;:";
  var RE_NAME = /^[^\W\d][\w\u0080-\uffff]*/;
  var RE_NUM = /^0[xXbBoO][0-9a-fA-F_]+|^\d[\d_]*\.(?:[\d_]+)?(?:[eE][+-]?\d+)?|^\.\d[\d_]*(?:[eE][+-]?\d+)?|^\d[\d_]*[eE][+-]?\d+|^\d[\d_]*/;
  var RE_OP = /^[+\-*\/%<>=!&|^~@]+/;

  /* 定位一个字符串字面量：只找边界，不改内容。没闭合就返回 0（不染色，免得后面整段跑偏） */
  function strLen(code, i) {
    var p = i, pre = 0;
    while (p < code.length && PFX.indexOf(code.charAt(p)) >= 0 && pre < 3) { p++; pre++; }
    var q = code.charAt(p);
    if (q !== "'" && q !== '"') return 0;
    var triple = code.charAt(p + 1) === q && code.charAt(p + 2) === q;
    var close = triple ? q + q + q : q;
    var j = p + close.length;
    while (j < code.length) {
      if (code.charAt(j) === "\\") { j += 2; continue; }
      if (code.substr(j, close.length) === close) return j + close.length - i;
      if (code.charAt(j) === "\n" && !triple) return 0;
      j++;
    }
    return triple ? code.length - i : 0;      /* 三引号没关上：吃到文件尾，至少不断行 */
  }

  function highlight(code) {
    code = String(code == null ? "" : code);
    var html = '<div class="hl-row">', openCls = null, i = 0, n = code.length;
    var atLineStart = true, lastKw = "", indLevel = 0;

    function closeSpan() { if (openCls !== null) { html += "</span>"; openCls = null; } }
    function openSpan(cls) { openCls = cls; html += '<span class="' + cls + '">'; }
    /* 一次写入：内含换行就按行拆，拆完颜色接着上（三引号跨行不会串色） */
    function add(cls, text) {
      var parts = String(text).split("\n");
      for (var k = 0; k < parts.length; k++) {
        if (parts[k] !== "") {
          if (cls) { if (openCls !== cls) { closeSpan(); openSpan(cls); } html += esc(parts[k]); }
          else { closeSpan(); html += esc(parts[k]); }
        }
        if (k + 1 < parts.length) { closeSpan(); html += '</div><div class="hl-row">'; }
      }
    }

    while (i < n) {
      var c = code.charAt(i);

      if (c === "\n") { closeSpan(); indLevel = 0; atLineStart = true; lastKw = ""; html += '</div><div class="hl-row">'; i++; continue; }

      /* 行首空白 → 缩进参考线；整行只有空白就别画线 */
      if (atLineStart && (c === " " || c === "\t")) {
        var s0 = i;
        while (i < n && (code.charAt(i) === " " || code.charAt(i) === "\t")) i++;
        var ind = code.slice(s0, i);
        var blank = i >= n || code.charAt(i) === "\n";
        add(blank ? null : "tk-ind", ind);
        indLevel = ind.replace(/\t/g, "    ").length;
        atLineStart = false;
        continue;
      }
      /* 词间空白 / 行尾空白（行尾的标出来：读者能看见自己多敲了几个空格） */
      if (c === " " || c === "\t") {
        var s1 = i;
        while (i < n && (code.charAt(i) === " " || code.charAt(i) === "\t")) i++;
        add((i >= n || code.charAt(i) === "\n") ? "tk-tws" : null, code.slice(s1, i));
        continue;
      }
      if (c === "\f") { i++; continue; }
      atLineStart = false;

      if (c === "#") { var s2 = code.indexOf("\n", i); if (s2 < 0) s2 = n; add("tk-com", code.slice(i, s2)); i = s2; continue; }

      var sl = strLen(code, i);
      if (sl) {
        var raw = code.slice(i, i + sl);
        var isF = /[fF]/.test(raw.slice(0, 3));
        if (!isF) add("tk-str", raw);
        else {
          /* f-string：串本身跟着串色，{} 里的表达式单独一个色，读长串时能一眼看出哪段是代码 */
          var fm = /^([rRbBuUfF]*)(['"]{1,3})/.exec(raw);
          var bStart = fm[0].length, bEnd = raw.length - fm[2].length;
          add("tk-str", raw.slice(0, bStart));
          var seg = bStart, p = bStart;
          while (p < bEnd) {
            if (raw.charAt(p) === "\\") { p += 2; continue; }
            if (raw.charAt(p) !== "{") { p++; continue; }
            add("tk-str", raw.slice(seg, p));                 /* 表达式前面那段普通文字 */
            var q = p + 1, dep = 1;
            while (q < bEnd && dep > 0) {
              if (raw.charAt(q) === "\\") { q += 2; continue; }
              if (raw.charAt(q) === "{") dep++;
              else if (raw.charAt(q) === "}") dep--;
              q++;
            }
            add("tk-fex", raw.slice(p, Math.min(q, bEnd)));   /* {expr} 整段 */
            p = seg = Math.min(q, bEnd);
          }
          add("tk-str", raw.slice(seg, bEnd));
          add("tk-str", raw.slice(bEnd));                     /* 收尾的引号 */
        }
        i += sl; lastKw = ""; continue;
      }

      if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(code.charAt(i + 1)))) {
        var mn = RE_NUM.exec(code.slice(i, i + 48));
        if (mn && mn[0]) { add("tk-num", mn[0]); i += mn[0].length; lastKw = ""; continue; }
      }

      if (c === "@" && indLevel === 0 && /[\w.]/.test(code.charAt(i + 1) || "")) {
        var md = /^@[\w\u0080-\uffff][\w.\u0080-\uffff]*/.exec(code.slice(i));
        add("tk-dec", md[0]); i += md[0].length; continue;
      }

      var rname = RE_NAME.exec(code.slice(i));
      if (rname && rname[0]) {
        var word = rname[0], cls;
        if (CONST[word]) cls = "tk-const";          /* True/False/None 也在必用关键字里，先给它们自己的色 */
        else if (KW[word]) cls = "tk-kw";
        else if (SELFISH[word]) cls = "tk-self";
        else if (BUILTIN_NAMES[word]) cls = "tk-bi";
        else if (lastKw === "def") cls = "tk-def";
        else if (lastKw === "class") cls = "tk-cls";
        else {
          var after = code.slice(i + word.length).match(/^[ \t]*\(/);
          cls = after ? "tk-call" : "tk-var";
        }
        add(cls, word);
        i += word.length;
        lastKw = KW[word] || CONST[word] ? word : (lastKw === "def" || lastKw === "class" ? "" : lastKw);
        continue;
      }

      var mop = RE_OP.exec(code.slice(i));
      if (mop) { add("tk-op", mop[0]); i += mop[0].length; lastKw = ""; continue; }
      if (PUNS.indexOf(c) >= 0) { add("tk-pun", c); i++; continue; }

      add(null, c); i++;                                /* 兜底：原样吐，绝不吞字符 */
    }
    closeSpan();
    html += "</div>";
    return html;
  }

  /* ---------------- 主视图 ---------------- */
  function vExam(app, params) {
    var tid = params.id, cid = params.cid;
    app.innerHTML = '<div class="ide"><div class="ide-loading">考卷加载中…</div></div>';
    API.get("/api/exams/" + encodeURIComponent(tid) + "/" + encodeURIComponent(cid)).then(function (data) {
      render(app, tid, cid, data.exam || data);
    }).catch(function (e) {
      app.innerHTML = '<div class="ide"><div class="ide-loading">' +
        "<h2>这场考试打不开</h2><p>" + esc(e.message || "未知错误") + "</p>" +
        '<a class="btn btn-primary" href="#/read/' + esc(tid) + "/" + esc(cid) + '">回到课文</a></div></div>';
    });
  }

  function render(app, tid, cid, exam) {
    /* 英语那两套卷（字母音标卷 / 单词卷）不是写代码，交给另一套界面画 */
    if (exam && (exam.kind === "en" || exam.kind === "enword") && root.MIAO_EXAM_EN) {
      root.MIAO_EXAM_EN.render(app, tid, cid, exam);
      return;
    }
    var title = exam.title || ("第 " + cid.replace(/\D/g, "") + " 课考试");
    var fileName = exam.file || "main.py";
    var draft = loadDraft(tid, cid);
    var code = draft !== null ? draft : (exam.starter || "");
    var stdinLines = (exam.stdin || []).join("\n");

    /* ---- 题面就是文件顶部那几行 # 注释；「条件」直接取判定清单，两边不会说两套话 ----
     * 结构（kind）决定这一行长什么样、染色怎么染；文字（text）还是原样的 # 注释，一个字不改。 */
    var TASK = [{ kind: "title", text: "# " + title }];
    TASK.push({ kind: "task", text: "# 任务题目：" + (exam.task || "") });
    (exam.checks || []).forEach(function (c, i) {
      TASK.push({
        kind: "cond", ci: i, no: i + 1,
        label: c.label || c.type, w: (c.weight || 0),
        text: "# 条件" + (i + 1) + "：" + (c.label || c.type) + "（" + (c.weight || 0) + " 分）"
      });
    });
    if (exam.hint) TASK.push({ kind: "hint", text: "# 提示：" + exam.hint });
    /* 原来「考试目录」那块列的就是这些文件；删了面板，名字得留在题面里，不然没人知道有预置文件 */
    var preset = Object.keys(exam.files || {});
    if (preset.length) TASK.push({ kind: "file", text: "# 预置文件：" + preset.join("、") + "（用 open(\"" + preset[0] + "\") 读）" });
    TASK.push({ kind: "blank", text: "#" });
    var TL = TASK.length;

    app.innerHTML =
      '<div class="ide" id="ideRoot">' +
      /* ---- 标题栏：左边退出，右边运行 / 重置 / 交卷 ---- */
      '<div class="ide-titlebar">' +
      '<button class="ide-exit" id="ideExit" type="button" title="退出考试，回到课文（草稿留在本机，回来还在）">← 退出考试</button>' +
      '<div class="ide-tb-mid"><b class="tb-file">' + esc(fileName) + '</b><span class="tb-sep">—</span><span>' + esc(title) + "</span></div>" +
      '<div class="ide-tb-right">' +
      '<span class="ide-zoom" id="ideZoom" title="Ctrl+滚轮 或 Ctrl +/−/0 调编辑器字号">字号 ' + FS_0 + "</span>" +
      '<button class="ide-btn ide-btn-run" id="ideRun" type="button" title="运行（Ctrl+Enter）"><b>▶</b> 运行</button>' +
      '<button class="ide-btn" id="ideReset" type="button" title="恢复成本课初始代码">重置</button>' +
      '<button class="ide-btn ide-btn-go" id="ideSubmit" type="button" title="按本课目标判分（不扣运行次数，取最高分）">交卷</button>' +
      "</div></div>" +

      /* ---- 主体：编辑区在上，面板在下，中间靠 flex 分高矮，谁也不盖谁 ---- */
      '<div class="ide-body">' +
      '<div class="ide-main">' +
      '<div class="ide-tabs"><span class="tab on">' + esc(fileName) +
      '<i class="dot" id="ideDirty"></i></span>' +
      '<span class="tabs-hint">题面就是文件最上面那几行 # 注释（只读）</span></div>' +

      '<div class="ide-crumb">' +
      '<span class="crumb-path">' + esc(tid) + " › " + esc(cid) + " › " + esc(fileName) + "</span>" +
      '<span class="crumb-ops">' +
      '<button class="crumb-btn" id="taskToggle" type="button" title="把题面收起来，编辑区大一截">收起题面</button>' +
      '<button class="crumb-btn" id="wrapToggle" type="button" title="长行折回来看不用左右拖（默认关）">自动换行</button>' +
      "</span></div>" +

      /* 行号两段：题面那段跟着各自的文字行高走（题面要折行），代码那段跟着 textarea 同步滚 */
      '<div class="ide-editor" id="ideEditor">' +
      '<div class="ide-task" id="ideTaskWrap">' +
      '<pre class="gt gt-task" id="gtTask" aria-hidden="true"></pre>' +
      '<div class="ide-tasktext" id="ideTask" aria-label="本题题面"></div>' +
      "</div>" +
      '<div class="ide-code-row">' +
      '<pre class="gt gt-code ide-gutter" id="gtCode" aria-hidden="true"></pre>' +
      '<div class="ide-code">' +
      '<div class="ide-cur" id="ideCur"></div>' +
      '<pre class="ide-hl" id="ideHl" aria-hidden="true"></pre>' +
      '<textarea class="ide-ta" id="ideTa" spellcheck="false" autocomplete="off" autocapitalize="off">' +
      esc(code) + "</textarea>" +
      "</div></div>" +
      "</div>" +

      /* ---- 屏幕正下方的面板：终端 / 判定清单 / 问题（上面那条能拖） ---- */
      '<div class="ide-panel" id="idePanel">' +
      '<div class="panel-split" id="panelSplit" title="上下拖改变面板高度"></div>' +
      '<div class="panel-tabs">' +
      '<span class="pt on" data-pt="term">终端</span>' +
      '<span class="pt" data-pt="judge">判定清单 <i class="badge" id="ptJudge">未交卷</i></span>' +
      '<span class="pt" data-pt="prob">问题 <i class="badge" id="ptProb">0</i></span>' +
      '<span class="panel-ops">' +
      '<button class="po" id="termClear" type="button" title="清空终端输出">清屏</button>' +
      '<button class="po" id="panelHide" type="button" title="收起面板，编辑区占满">收起面板 ×</button>' +
      "</span></div>" +
      '<div class="panel-body" id="panelBody">' +
      '<div class="pane on" data-pane="term">' +
      '<div class="term-note">内置沙箱：只教过的语法跑得动，死循环会被强制掐断。<b>Ctrl+Enter</b> 运行；红字里的「第 N 行」可以点，直接跳过去。</div>' +
      '<div class="term" id="term"></div>' +
      '<button class="term-tail" id="termTail" type="button" hidden>↓ 回到最新</button>' +
      "</div>" +
      '<div class="pane" data-pane="judge">' +
      '<div class="sd-sec">判定清单（交卷后逐条给结果，跟题面里的「条件 N」是同一批）</div>' +
      '<ul class="sd-checks" id="jdList">' + (exam.checks || []).map(function (c, i) {
        return '<li data-ci="' + i + '"><span class="ck-mark">•</span><span class="ck-body">' +
          '<span class="ck-label">' + esc(c.label || c.type) + "</span>" +
          '<span class="ck-w">' + (c.weight || 0) + " 分</span></span></li>";
      }).join("") + "</ul>" +
      (needStdin(exam)
        ? '<div class="sd-sec">模拟输入（每行一次 input）</div>' +
          '<textarea class="sd-stdin" id="ideStdin" rows="3" spellcheck="false">' + esc(stdinLines) + "</textarea>" +
          '<div class="sd-hint">这里给什么，程序里的 input() 就读什么。</div>'
        : "") +
      '<div class="sd-result" id="ideResult"></div>' +
      "</div>" +
      '<div class="pane" data-pane="prob"><div class="term" id="probList">' +
      '<div class="term-line term-dim">还没有诊断信息。运行一次，报错会出现在这里。</div></div>' +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +

      /* ---- 状态栏 ---- */
      '<div class="ide-status">' +
      '<span class="st branch">⑥ 考试模式</span>' +
      '<span class="st" id="stPos">Ln 1, Col 1</span>' +
      '<span class="st" id="stLen"></span>' +
      '<span class="st st-opt">UTF-8</span><span class="st st-opt">空格: 4</span>' +
      '<span class="st st-opt">Python</span>' +
      '<span class="st st-score" id="stScore">还没交卷</span>' +
      "</div></div>";

    /* ---------- 题面：一行一对（行号 + 文字），文字折行了行号也跟着走，不会错位 ---------- */
    var ta = $("#ideTa"), hl = $("#ideHl"), editor = $("#ideEditor"), ideRoot = $("#ideRoot");
    var gtTask = $("#gtTask"), gtCode = $("#gtCode"), taskBox = $("#ideTask"), taskWrap = $("#ideTaskWrap");
    var cur = $("#ideCur"), dirty = $("#ideDirty");

    gtTask.innerHTML = TASK.map(function (_, i) {
      return '<i class="ln">' + (i + 1) + "</i>";
    }).join("\n");
    taskBox.innerHTML = TASK.map(function (row, i) {
      var inner;
      if (row.kind === "cond") {
        inner = '<span class="tl-punc"># </span><span class="tl-tag">条件' + row.no + "</span>" +
          '<span class="tl-punc">：</span><span class="tl-body">' + esc(row.label) + "</span>" +
          '<span class="tl-w">（' + row.w + " 分）</span><i class=\"tl-ck\" data-ci=\"" + row.ci + '">•</i>';
      } else if (row.kind === "blank") {
        inner = '<span class="tl-punc">#</span>';
      } else {
        var head = row.kind === "task" ? "# 任务题目：" : row.kind === "hint" ? "# 提示：" : row.kind === "file" ? "# 预置文件：" : "# ";
        var rest = row.text.slice(head.length);
        inner = '<span class="tl-punc"># </span>' + (head.length > 2 ? '<span class="tl-tag">' + esc(head.slice(2)) + "</span>" : "") +
          '<span class="tl-body">' + esc(rest) + "</span>";
      }
      return '<div class="tl tl-' + row.kind + '" style="grid-row:' + (i + 1) + '">' + inner + "</div>";
    }).join("");
    $$(".gt-task .ln").forEach(function (el, i) { el.style.gridRow = String(i + 1); el.style.gridColumn = "1"; });
    $$(".ide-tasktext .tl").forEach(function (el) { el.style.gridColumn = "2"; });

    /* ---------- 代码：着色层 + 透明 textarea 叠在一起，行号单独一列 ---------- */
    var wrapOn = false;
    try { wrapOn = localStorage.getItem("miao_ide_wrap") === "1"; } catch (e) { }

    function syncSize() {
      hl.innerHTML = highlight(ta.value);
      var lines = ta.value.split("\n");
      gtCode.innerHTML = lines.map(function (_, i) {
        return '<i class="ln">' + (TL + i + 1) + "</i>";
      }).join("\n");
      hl.scrollTop = ta.scrollTop; hl.scrollLeft = ta.scrollLeft;
      gtCode.scrollTop = ta.scrollTop;
      alignGutter(lines.length);
      syncPos();
    }
    /* 换行开着的时候，一行占几个视觉行要量才知道，行号得跟着量出来的位置站 */
    function alignGutter() {
      if (!wrapOn) return;
      var nums = gtCode.children, rows = hl.children;
      for (var i = 0; i < nums.length; i++) if (rows[i]) nums[i].style.top = rows[i].offsetTop + "px";
    }
    function syncPos() {
      var before = ta.value.slice(0, ta.selectionStart);
      var idx = before.split("\n").length - 1;
      var ln = idx + 1 + TL, col = before.length - before.lastIndexOf("\n");
      $("#stPos").textContent = "Ln " + ln + ", Col " + col;
      var all = ta.value.split("\n"), longest = 0, at = 0;
      for (var i = 0; i < all.length; i++) if (all[i].length > longest) { longest = all[i].length; at = i; }
      $("#stLen").textContent = longest > 79
        ? "最长 " + longest + " 列（第 " + (TL + at + 1) + " 行）· 可点「自动换行」"
        : "共 " + all.length + " 行";
      /* 当前行高亮：跟着光标那一行走（量不到像素就退回按行距算） */
      var row = hl.children[idx];
      var top = (row && row.offsetTop ? row.offsetTop : PAD_V + idx * fsPx()) - ta.scrollTop;
      cur.style.top = top + "px";
      cur.style.height = fsPx() + "px";
      cur.style.display = (idx >= 0 && idx < hl.children.length) ? "block" : "none";
      $$(".gt-code .ln").forEach(function (el, i) { el.classList.toggle("cur", i === idx); });
    }
    ta.addEventListener("input", function () {
      dirty.classList.add("on");
      saveDraft(tid, cid, ta.value);
      syncSize();
    });
    ta.addEventListener("keyup", syncPos);
    ta.addEventListener("click", syncPos);
    ta.addEventListener("select", syncPos);
    ta.addEventListener("scroll", function () {
      hl.scrollTop = ta.scrollTop; hl.scrollLeft = ta.scrollLeft; gtCode.scrollTop = ta.scrollTop;
      syncPos();
    });
    editor.addEventListener("keydown", function (ev) { if (ev.target === ta) syncPos(); });

    /* ---------- 字号 / 换行：四层一起变，行号才不会错位 ---------- */
    var fs = FS_0;
    try { var saved = Number(localStorage.getItem("miao_ide_fs")); if (saved >= FS_MIN && saved <= FS_MAX) fs = saved; } catch (e) { }
    function fsPx() { return fs * LH; }
    function applyFs() {
      ideRoot.style.setProperty("--ide-fs", fs + "px");
      ideRoot.style.setProperty("--ide-lhpx", (fs * LH) + "px");
      $("#ideZoom").textContent = "字号 " + fs;
      gtCode.scrollTop = ta.scrollTop;
      syncPos();
    }
    function setFs(v) {
      fs = Math.max(FS_MIN, Math.min(FS_MAX, v));
      try { localStorage.setItem("miao_ide_fs", String(fs)); } catch (e) { }
      applyFs();
    }
    editor.addEventListener("wheel", function (ev) {
      if (!(ev.ctrlKey || ev.metaKey)) return;
      ev.preventDefault();
      setFs(fs + (ev.deltaY < 0 ? 1 : -1));
    }, { passive: false });

    function applyWrap() {
      editor.classList.toggle("wrap", wrapOn);
      var btn = $("#wrapToggle");
      btn.textContent = wrapOn ? "自动换行：开" : "自动换行：关";
      btn.classList.toggle("on", wrapOn);
      try { localStorage.setItem("miao_ide_wrap", wrapOn ? "1" : "0"); } catch (e) { }
      gtCode.scrollTop = ta.scrollTop;
      syncSize();
    }
    applyFs();

    ta.addEventListener("keydown", function (ev) {
      var k = ev.key;
      if ((ev.ctrlKey || ev.metaKey) && k === "Enter") { ev.preventDefault(); doRun(); return; }
      if ((ev.ctrlKey || ev.metaKey) && (k === "=" || k === "+")) { ev.preventDefault(); setFs(fs + 1); return; }
      if ((ev.ctrlKey || ev.metaKey) && (k === "-" || k === "_")) { ev.preventDefault(); setFs(fs - 1); return; }
      if ((ev.ctrlKey || ev.metaKey) && k === "0") { ev.preventDefault(); setFs(FS_0); return; }
      if ((ev.ctrlKey || ev.metaKey) && (k === "s" || k === "S")) { ev.preventDefault(); saveDraft(tid, cid, ta.value); toast("已保存到本机"); return; }
      if (k === "Tab") {
        ev.preventDefault();
        var s = ta.selectionStart, e2 = ta.selectionEnd, v = ta.value;
        if (s !== e2) {                            /* 选中多行 → 整块缩进 */
          var ls = v.lastIndexOf("\n", s - 1) + 1, seg = v.slice(ls, e2);
          var ns = ev.shiftKey ? seg.replace(/^ {1,4}/gm, "") : seg.replace(/^/gm, "    ");
          ta.value = v.slice(0, ls) + ns + v.slice(e2);
          ta.selectionStart = ls; ta.selectionEnd = ls + ns.length;
        } else if (ev.shiftKey) {
          var l2 = v.lastIndexOf("\n", s - 1) + 1, head = v.slice(l2).match(/^ {1,4}/);
          if (head) { ta.value = v.slice(0, l2) + v.slice(l2 + head[0].length); ta.selectionStart = ta.selectionEnd = Math.max(l2, s - head[0].length); }
        } else {
          ta.value = v.slice(0, s) + "    " + v.slice(e2);
          ta.selectionStart = ta.selectionEnd = s + 4;
        }
        dirty.classList.add("on"); saveDraft(tid, cid, ta.value); syncSize();
        return;
      }
      if (k === "Enter") {                          /* 自动缩进：跟上一行对齐，冒号后多进一层 */
        var pos = ta.selectionStart, before = ta.value.slice(0, pos);
        var lineStart = before.lastIndexOf("\n") + 1, cur2 = before.slice(lineStart);
        var indent = (cur2.match(/^[ \t]*/) || [""])[0];
        if (/\:\s*(#.*)?$/.test(cur2)) indent += "    ";
        ev.preventDefault();
        var add2 = "\n" + indent, val = ta.value;
        ta.value = val.slice(0, pos) + add2 + val.slice(ta.selectionEnd);
        ta.selectionStart = ta.selectionEnd = pos + add2.length;
        dirty.classList.add("on"); saveDraft(tid, cid, ta.value); syncSize();
      }
    });
    syncSize();
    applyWrap();

    /* ---------- 终端 ---------- */
    var term = $("#term");
    var stickTail = true, runBox = null;
    function ensureRun() {
      if (!runBox) { runBox = doc.createElement("div"); runBox.className = "term-run"; term.appendChild(runBox); }
      return runBox;
    }
    function mk(text, cls) {
      var d = doc.createElement("div");
      d.className = "term-line" + (cls ? " " + cls : "");
      d.textContent = text;
      return d;
    }
    function termLine(text, cls) {
      var d = mk(text, cls);
      ensureRun().appendChild(d);
      if (stickTail) term.scrollTop = term.scrollHeight;
      return d;
    }
    function termHtml(html, cls) {
      var d = doc.createElement("div");
      d.className = "term-line" + (cls ? " " + cls : "");
      d.innerHTML = html;
      ensureRun().appendChild(d);
      if (stickTail) term.scrollTop = term.scrollHeight;
      return d;
    }
    /* 报错按 CPython 的排法认：Traceback 头 → 帧（File "main.py", line N, in …）→ 缩进的源码行 → 结论行 */
    var RE_FRAME = /^(\s*File "[^"]+", line )(\d+)(, in .*)?$/;
    function errCls(l) {
      if (/^Traceback \(most recent call last\)/.test(l)) return "term-err tb-head";
      if (RE_FRAME.test(l)) return "term-err tb-frame";
      if (/^ {4}\S/.test(l)) return "tb-src";
      if (/^[A-Za-z_][\w.]*(Error|Exception|Exit|Interrupt|Warning)\b/.test(l)) return "term-err tb-final";
      if (/^(SyntaxError|IndentationError|NameError|InternalError)/.test(l)) return "term-err tb-final";
      return "term-warn";
    }
    function jumpBtn(n) {
      return '<button class="tb-jump" type="button" data-line="' + n + '">第 ' + n + " 行</button>";
    }
    function frameHtml(l) {
      var m = RE_FRAME.exec(l);
      if (!m) return esc(l);
      return esc(m[1]) + jumpBtn(m[2]) + esc(m[3] || "");
    }
    /* 一份报错文本 → 逐行 {cls, html}：终端和「问题」页签共用同一套染法，不会两处两个样 */
    function errLines(text, extraLine) {
      var lines = String(text || "").split("\n");
      if (lines.length && lines[lines.length - 1] === "") lines.pop();
      var hasFrame = lines.some(function (l) { return RE_FRAME.test(l); });
      var out = lines.map(function (l) {
        return { cls: errCls(l), html: RE_FRAME.test(l) ? frameHtml(l) : esc(l) };
      });
      /* 语法错的时候解释器只回「SyntaxError: …」不带行号（formatErr 里那几行 File 被丢了），
         但 error 对象上有 pyline —— 呈现层拿来补一条能点的提示，不改解释器一个字。 */
      if (extraLine && !hasFrame) {
        out.push({
          cls: "tb-hint",
          html: "→ 出问题的应该是 " + jumpBtn(extraLine) + "（点一下跳过去）"
        });
      }
      return out;
    }
    function showErr(text, extraLine) {
      errLines(text, extraLine).forEach(function (l) { termHtml(l.html, l.cls); });
    }
    function jumpToLine(total) {
      var idx = Number(total) - TL;                 /* 屏上的行号含题面那几行，换成代码里的第几行 */
      if (idx < 1) { flashEl($$(".ide-tasktext .tl")[Number(total) - 1]); return; }
      var lines = ta.value.split("\n"), pos = 0;
      for (var i = 0; i < idx - 1 && i < lines.length; i++) pos += lines[i].length + 1;
      try {
        ta.focus();
        ta.setSelectionRange(pos, pos + (lines[idx - 1] || "").length);
        var row = hl.children[idx - 1];
        if (row && row.offsetTop) ta.scrollTop = Math.max(0, row.offsetTop - editor.clientHeight * 0.34);
        syncPos();
      } catch (e) { /* jsdom 量不到像素，忽略 */ }
      flashEl(cur);
    }
    function flashEl(el) {
      if (!el) return;
      el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash");
      setTimeout(function () { el.classList.remove("flash"); }, 900);
    }
    [term, $("#probList")].forEach(function (box) {
      box.addEventListener("click", function (ev) {
        var b = ev.target && ev.target.closest ? ev.target.closest(".tb-jump") : null;
        if (b && b.dataset.line) jumpToLine(b.dataset.line);
      });
    });
    /* 往上翻就不跟着滚了（终端最基本的规矩），翻回底部或点「回到最新」才继续跟 */
    term.addEventListener("scroll", function () {
      stickTail = term.scrollHeight - term.scrollTop - term.clientHeight < 24;
      $("#termTail").hidden = stickTail;
    });
    $("#termTail").onclick = function () { stickTail = true; $("#termTail").hidden = true; term.scrollTop = term.scrollHeight; };

    function doRun() {
      var src = ta.value;
      runBox = null;
      termLine("$ python3 " + fileName, "term-cmd");
      var t0 = Date.now();
      var r;
      try {
        r = GRADE.runCode(exam, src, { stdin: stdinNow() });
      } catch (e) {
        termLine("沙箱启动失败：" + (e && e.message || e), "term-err tb-final");
        showProb("沙箱启动失败：" + (e && e.message || e));
        return null;
      }
      if (r.out) r.out.split("\n").forEach(function (l, i, arr) { if (i < arr.length - 1 || l !== "") termLine(l, "term-out"); });
      if (r.err) showErr(r.err, r.error && r.error.pyline);
      termLine("[进程已结束 · 退出码 " + r.exitCode + " · 用时 " + (Date.now() - t0) + " ms]", "term-meta");
      runBox = null;
      var probs = r.exitCode === 0 ? "" : String(r.err || "运行没跑通，看一眼终端里的红字。");
      $("#ptProb").textContent = r.exitCode === 0 ? "0" : "1";
      showProb(probs, r.error && r.error.pyline);
      return r;
    }
    /* 「问题」页签：把同一份报错再列一遍，行号照样能点 —— 跟 VS Code 那个面板一个用法 */
    function showProb(text, extraLine) {
      var box = $("#probList");
      if (!box) return;
      var ls = errLines(text || "", extraLine);
      if (!ls.length) { box.innerHTML = '<div class="term-line term-dim">没有发现问题。</div>'; return; }
      box.innerHTML = ls.map(function (l) {
        return '<div class="term-line ' + l.cls + '">' + l.html + "</div>";
      }).join("");
    }
    function stdinNow() {
      var box = $("#ideStdin");
      if (!box) return exam.stdin || [];
      return String(box.value).split("\n").filter(function (l, i, arr) { return !(i === arr.length - 1 && l === ""); });
    }

    /* ---------- 交卷 ---------- */
    function doSubmit() {
      var src = ta.value;
      if (!src.trim()) { toast("先写点代码再交卷"); return; }
      runBox = null;
      termLine("$ python3 -m 判分 " + cid, "term-cmd");
      var res;
      try { res = GRADE.grade(exam, src, { stdin: stdinNow() }); }
      catch (e) { termLine("判分器出错：" + (e && e.message || e), "term-err"); return; }
      var box = $("#ideResult");
      var rows = res.checks.map(function (c) {
        return '<li class="' + (c.ok ? "pass" : "fail") + '"><span class="ck-mark">' + (c.ok ? "✓" : "✗") + "</span>" +
          '<div class="ck-body"><div class="ck-label">' + esc(c.label) + ' <span class="ck-w">' + c.weight + " 分</span></div>" +
          '<div class="ck-saw">' + esc(c.saw || "") + "</div></div></li>";
      }).join("");
      box.innerHTML =
        '<div class="rs-band ' + (res.passed ? "ok" : "no") + '">' +
        '<span class="rs-score ' + (res.passed ? "ok" : "no") + '">' + res.score + "<small>/100 · " + (res.passed ? "通过" : "未通过") + "</small></span>" +
        '<span class="rs-line">通过线 ' + res.passLine + " 分" + (res.passed ? " · 可以回课文了" : " · 还差 " + Math.max(0, res.passLine - res.score) + " 分") + "</span></div>" +
        '<div class="sd-sec">逐项检测（这一栏就是「你的代码到底经过了什么」）</div>' +
        '<ul class="sd-checks result">' + rows + "</ul>" +
        '<div class="rs-ops">' +
        (res.passed
          ? (exam.reference ? '<button class="btn btn-ghost btn-sm" id="rsRef" type="button">看参考写法</button>' : "") +
            '<a class="btn btn-primary btn-sm" id="rsNext" href="#/read/' + esc(tid) + "/" + esc(cid) + '">回课文，已标记完成</a>'
          : '<button class="btn btn-ghost btn-sm" id="rsRef" type="button">看提示</button>' +
            '<button class="btn btn-primary btn-sm" id="rsAgain" type="button">回去改代码</button>') +
        "</div>" +
        (res.passed && exam.reference ? '<pre class="rs-ref hidden">' + esc(exam.reference) + "</pre>" : "");
      $("#stScore").textContent = "得分 " + res.score + "（" + (res.passed ? "已过" : "未过") + "）";
      $("#stScore").classList.toggle("ok", res.passed);
      $("#ptJudge").textContent = res.score + " 分";
      $("#ptJudge").classList.toggle("ok", res.passed);
      showPane("judge");
      /* 题面里那几行「条件 N」跟着一起打勾/打叉 —— 两边说的是同一批条件 */
      $$(".tl-ck").forEach(function (el) {
        var c = res.checks[Number(el.dataset.ci)];
        if (!c) return;
        el.textContent = c.ok ? "✓" : "✗";
        el.classList.add(c.ok ? "pass" : "fail");
      });
      var refBtn = $("#rsRef");
      if (refBtn) refBtn.onclick = function () {
        var pre = $(".rs-ref", box);
        if (pre) { pre.classList.toggle("hidden"); return; }
        toast(exam.hint || "再想想这一课到底要你做什么");
      };
      var again = $("#rsAgain");
      if (again) again.onclick = function () { showPane("term"); ta.focus(); };
      if (res.passed) { root.MIAO_EXAM_UI.onPassed(tid, cid, res); }
      else toast("还差一点：" + res.score + " 分，通过线 " + res.passLine + " 分");
      /* 上方那份「条件」清单同步打勾/打叉，跟编辑器里的 # 条件N 一一对上 */
      $$("#jdList li").forEach(function (li, i) {
        var c = res.checks[i];
        if (!c) return;
        li.classList.add(c.ok ? "pass" : "fail");
        $(".ck-mark", li).textContent = c.ok ? "✓" : "✗";
      });
    }

    /* ---------- 绑定 ---------- */
    $("#ideExit").onclick = function () {
      saveDraft(tid, cid, ta.value);
      if (doc.querySelector("#app") && root.MIAO_NAV) root.MIAO_NAV("#/read/" + tid + "/" + cid);
      else location.hash = "#/read/" + tid + "/" + cid;
    };
    $("#ideRun").onclick = doRun;
    $("#ideSubmit").onclick = doSubmit;
    $("#ideReset").onclick = function () {
      ta.value = exam.starter || "";
      saveDraft(tid, cid, ta.value); syncSize();
      runBox = null; termLine("[已恢复成本课初始代码]", "term-dim");
    };
    $("#termClear").onclick = function () { term.innerHTML = ""; runBox = null; termLine("[终端已清空]", "term-dim"); };
    $("#panelHide").onclick = function () { $("#idePanel").classList.toggle("hidden-panel"); };
    $("#taskToggle").onclick = function () {
      var off = taskWrap.classList.toggle("min");
      $("#taskToggle").textContent = off ? "展开题面" : "收起题面";
      try { localStorage.setItem("miao_ide_taskmin", off ? "1" : "0"); } catch (e) { }
      syncPos();
    };
    try {
      if (localStorage.getItem("miao_ide_taskmin") === "1") {
        taskWrap.classList.add("min"); $("#taskToggle").textContent = "展开题面";
      }
    } catch (e) { }
    $("#wrapToggle").onclick = function () { wrapOn = !wrapOn; applyWrap(); };

    /* 面板高度：拖那条缝，写进本机；窄屏给个够看的默认高 */
    var PH_MIN = 96, PH_MAX = Math.round((root.innerHeight || 800) * 0.72);
    function setPanelH(px) {
      px = Math.max(PH_MIN, Math.min(PH_MAX, px));
      $("#idePanel").style.flexBasis = px + "px";
      try { localStorage.setItem("miao_ide_panel_h", String(Math.round(px))); } catch (e) { }
    }
    try {
      var ph = Number(localStorage.getItem("miao_ide_panel_h"));
      if (ph >= PH_MIN && ph <= PH_MAX) $("#idePanel").style.flexBasis = ph + "px";
    } catch (e) { }
    (function bindSplit() {
      var sp = $("#panelSplit"), dragging = false, startY = 0, startH = 0;
      sp.addEventListener("mousedown", function (ev) {
        dragging = true; startY = ev.clientY;
        startH = $("#idePanel").getBoundingClientRect().height || 232;
        sp.classList.add("on"); ev.preventDefault();
      });
      doc.addEventListener("mousemove", function (ev) {
        if (!dragging) return;
        setPanelH(startH - (ev.clientY - startY));
      });
      doc.addEventListener("mouseup", function () { if (dragging) { dragging = false; sp.classList.remove("on"); } });
      sp.addEventListener("dblclick", function () { $("#idePanel").style.flexBasis = ""; try { localStorage.removeItem("miao_ide_panel_h"); } catch (e) { } });
    })();

    /* 页签只切显示，不重画面板 —— 换页签不该把终端历史清空 */
    function showPane(name) {
      $$(".panel-tabs .pt").forEach(function (x) { x.classList.toggle("on", x.dataset.pt === name); });
      $$(".pane", $("#panelBody")).forEach(function (p) { p.classList.toggle("on", p.dataset.pane === name); });
      $("#idePanel").classList.remove("hidden-panel");
    }
    $$(".panel-tabs .pt").forEach(function (b) { b.onclick = function () { showPane(b.dataset.pt); }; });

    termLine("$ python3 " + fileName + "   # 题面就在文件最上面那几行 # 注释里；写完点右上「▶ 运行」或按 Ctrl+Enter", "term-cmd");
    termLine("  Ctrl+滚轮（或 Ctrl +/−）调字号，Ctrl+0 回到 " + FS_0 + "。", "term-dim");
    if (loadDraft(tid, cid) !== null) termLine("[已恢复你上次的草稿]", "term-dim");
    runBox = null;
    setTimeout(function () { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }, 30);
  }

  /* ---------------- 草稿：按「教程+章节」各自留着，退出再进来不丢 ---------------- */
  function draftKey(tid, cid) { return "miao_examdraft_" + tid + "_" + cid; }
  function saveDraft(tid, cid, text) { try { localStorage.setItem(draftKey(tid, cid), text); } catch (e) { } }
  function loadDraft(tid, cid) { try { return localStorage.getItem(draftKey(tid, cid)); } catch (e) { return null; } }

  function needStdin(exam) {
    if (exam.stdin && exam.stdin.length) return true;
    var code = (exam.reference || "") + (exam.starter || "");
    return /\binput\s*\(/.test(code);
  }
  function toast(msg) {
    var box = doc.querySelector("#toast");
    if (!box) return;
    var el = doc.createElement("div");
    el.className = "toast-item"; el.textContent = msg;
    box.appendChild(el);
    setTimeout(function () { el.style.opacity = "0"; el.style.transition = "opacity .4s"; }, 1800);
    setTimeout(function () { el.remove(); }, 2300);
  }

  root.MIAO_EXAM_UI = {
    vExam: vExam,
    highlight: highlight,     /* 自测用：着色器不碰 DOM，Node 里也能直接验 */
    onPassed: function () { }   /* app.js 会覆盖它，用来打完成标记与同步成绩 */
  };
})(typeof window !== "undefined" ? window : globalThis);
