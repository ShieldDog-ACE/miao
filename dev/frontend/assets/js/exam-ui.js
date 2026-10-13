/* 喵站 · 课末考试 · Python  IDE 界面
 *
 * 布局照 VS Code，但只留真能用的那几块：标题栏（退出 / 运行 / 重置 / 交卷 / 字号）
 * → 编辑区（题面就是文件顶部那几行 # 注释，跟代码同在编辑器里，想删就删；判分只取独行 # 之后）
 * → 屏幕正下方的面板（终端 / 判定清单 / 问题，可拖高、可收起）→ 底部状态栏。
 * 编辑器本体（四层 + 键位 + 成对闭合 + 补全 + 着色）在 code-editor.js，与 C++ 笔试卷共用一件；
 * 判分与运行一概不动 —— 跑代码走 GRADE.runCode，交卷走 GRADE.grade。
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

  /* ---------------- 编辑器与着色都在 code-editor.js ----------------
     这件控件 Python 考场与 C++ 笔试卷共用：四层（行号 / 当前行 / 着色 / textarea）、
     成对闭合、块缩进、自动缩进、补全都在那边。以前这把 py 尺（自己扫源码、自己记偏移）
     整体搬进了控件，这里只留两个转发 —— 终端回显与「看参考写法」拿到的还是同一个高亮器。
     注意别在文件顶上就把控件接住：英语那两套考场的清单里只有 exam-ui.js，它一旦先跑起来，
     顶层的 root.MIAO_EDITOR 还是空的，Python 考场就会永远「编辑器没加载上」。用到时再取。 */
  function highlight(code) { return root.MIAO_EDITOR ? root.MIAO_EDITOR.highlight(code, "py") : esc(code); }
  function hlInline(code) { return root.MIAO_EDITOR ? root.MIAO_EDITOR.hlInline(code, "py") : esc(code); }

  /* 字号档位：Ctrl+滚轮 / Ctrl+−0 改的是 #ideRoot 上的 --ide-fs，控件四层跟着走 */
  var FS_MIN = 12, FS_MAX = 26, FS_0 = 15;

  /* ---------------- 主视图 ---------------- */
  function vExam(app, params) {
    var tid = params.id, cid = params.cid;
    app.innerHTML = '<div class="ide"><div class="ide-loading">考卷加载中…</div></div>';
    API.get("/api/exams/" + encodeURIComponent(tid) + "/" + encodeURIComponent(cid)).then(function (data) {
      render(app, tid, cid, data.exam || data, data.my || null);
    }).catch(function (e) {
      app.innerHTML = '<div class="ide"><div class="ide-loading">' +
        "<h2>这场考试打不开</h2><p>" + esc(e.message || "未知错误") + "</p>" +
        '<a class="btn btn-primary" href="#/read/' + esc(tid) + "/" + esc(cid) + '">回到课文</a></div></div>';
    });
  }

  function render(app, tid, cid, exam, my) {
    /* 英语那两套卷（字母音标卷 / 单词卷）不是写代码，交给另一套界面画；
       笔试卷（C++ 这种浏览器跑不了的）也是 —— 判分本体在 exam-paper.js */
    if (exam && exam.kind === "paper" && root.MIAO_EXAM_PAPER) {
      root.MIAO_EXAM_PAPER.render(app, tid, cid, exam, my);
      return;
    }
    if (exam && (exam.kind === "en" || exam.kind === "enword") && root.MIAO_EXAM_EN) {
      root.MIAO_EXAM_EN.render(app, tid, cid, exam, my);
      return;
    }
    var title = exam.title || ("第 " + cid.replace(/\D/g, "") + " 课考试");
    var fileName = exam.file || "main.py";
    var draft = loadDraft(tid, cid);
    var stdinLines = (exam.stdin || []).join("\n");

    /* ---- 题面就是文件顶部那几行 # 注释，写在编辑器里，但不再锁 ----
     * 「条件」直接取判定清单，两边不会说两套话。跑 / 判分取的是那条独行 "#" 之后的部分
     * （codeNow()），报错行号的偏移也按同一条线算，所以整块题面删掉只是少了那几行注释，
     * 不会把行号跳错一格。
     * 为什么不再锁：上一版每次 input 都拿 TASK_TEXT 往回贴，全选重打、行首退格都会让题面
     * 自己长回来，这份文件想清空都清不掉 —— 2026-10-13 他点名改成「允许整块删掉」。 */
    var TASK = ["# " + title, "# 任务题目：" + (exam.task || "")];
    (exam.checks || []).forEach(function (c, i) {
      TASK.push("# 条件" + (i + 1) + "：" + (c.label || c.type) + "（" + (c.weight || 0) + " 分）");
    });
    if (exam.hint) TASK.push("# 提示：" + exam.hint);
    /* 原来「考试目录」那块列的就是这些文件；删了面板，名字得留在题面里，不然没人知道有预置文件 */
    var preset = Object.keys(exam.files || {});
    if (preset.length) TASK.push("# 预置文件：" + preset.join("、") + "（用 open(\"" + preset[0] + "\") 读）");
    TASK.push("#");
    var TASK_TEXT = TASK.join("\n") + "\n";
    /* 草稿存的是整份 buffer（题面 + 代码一起）。改版之前的草稿存的是「只有代码」——
       那种 buffer 开头不是 "# "，按新口径整份都算代码，判分与行号都不会错位，不用迁移。 */
    var buffer = draft !== null ? draft : TASK_TEXT + (exam.starter || "");

    app.innerHTML =
      '<div class="ide" id="ideRoot">' +
      /* ---- 标题栏：左边退出，右边运行 / 重置 / 交卷 ---- */
      '<div class="ide-titlebar">' +
      '<button class="ide-exit" id="ideExit" type="button" title="退出考试，回到课文（草稿留在本机，回来还在）">← 退出考试</button>' +
      '<div class="ide-tb-mid"><b class="tb-file">' + esc(fileName) + '</b><span class="tb-sep">—</span><span>' + esc(title) + "</span></div>" +
      '<div class="ide-tb-right">' +
      '<button class="ide-zoom" id="ideZoom" type="button" title="当前编辑器字号；点一下回到 ' + FS_0 + '，Ctrl+滚轮 或 Ctrl +/− 微调">字号 ' + FS_0 + "</button>" +
      '<button class="ide-btn ide-btn-run" id="ideRun" type="button" title="运行（Ctrl+Enter）"><b>▶</b> 运行</button>' +
      '<button class="ide-btn" id="ideReset" type="button" title="恢复成本课初始代码">重置</button>' +
      '<button class="ide-btn ide-btn-go" id="ideSubmit" type="button" title="按本课目标判分（不扣运行次数，取最高分）">交卷</button>' +
      "</div></div>" +

      /* ---- 主体：编辑区在上，面板在下，中间靠 flex 分高矮，谁也不盖谁 ---- */
      '<div class="ide-body">' +
      '<div class="ide-main">' +
      '<div class="ide-tabs"><span class="tab on">' + esc(fileName) +
      '<i class="dot" id="ideDirty"></i></span>' +
      '<span class="tabs-hint">题面就是文件最上面那几行 # 注释（判分只取独行 # 之后，删掉也行）</span></div>' +

      '<div class="ide-crumb">' +
      '<span class="crumb-path">' + esc(tid) + " › " + esc(cid) + " › " + esc(fileName) + "</span></div>" +

      /* 行号一列编到底：题面那几行 # 注释就在编辑器里，跟代码连着编号。
         四层 DOM 由 code-editor.js 建，这里只给宿主。 */
      '<div class="ide-editor" id="ideEditor"></div>' +

      /* ---- 屏幕正下方的面板：终端 / 判定清单 / 问题（上面那条能拖） ---- */
      '<div class="ide-panel" id="idePanel">' +
      '<div class="panel-split" id="panelSplit" title="上下拖改变面板高度"></div>' +
      '<div class="panel-tabs">' +
      '<span class="pt on" data-pt="term">终端</span>' +
      '<span class="pt" data-pt="judge">判定清单</span>' +
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

      /* ---- 状态栏：左边是模式，右边照着 VS Code 摆位置 / 编码 / 缩进 / 语言 / 成绩 ---- */
      '<div class="ide-status">' +
      '<span class="st branch">考试模式</span>' +
      '<span class="st" id="stPos">Ln 1, Col 1</span>' +
      '<span class="st" id="stLen"></span>' +
      '<span class="st st-opt">UTF-8</span><span class="st st-opt">空格: 4</span>' +
      '<span class="st st-opt">Python</span>' +
      '<span class="st st-score' + (my && my.passed ? " ok" : "") + '" id="stScore">' +
      (my && my.best ? "最高 " + my.best + " 分" + (my.passed ? "（已过）" : "") : "") +
      "</span>" +
      "</div></div>";

    /* ---------- 编辑器：整件控件交给 code-editor.js（四层 + 键位 + 成对闭合 + 补全） ----------
       题面不再锁：那几行 # 注释就躺在 buffer 最上面，随便删；跑与判分取的是独行 "#" 之后。 */
    var editor = $("#ideEditor"), ideRoot = $("#ideRoot");
    var dirty = $("#ideDirty");
    var ED = root.MIAO_EDITOR;
    if (!ED) {
      editor.innerHTML = '<div class="ide-loading">编辑器控件没加载上：site.js 的 engines.code 里 code-editor.js 必须排在 exam-ui.js 前面。</div>';
      return;
    }
    var ed = ED.create(editor, {
      lang: "py", value: buffer,
      onChange: function (v) { saveDraft(tid, cid, v); updDirty(); },
      onCursor: function (c) {
        $("#stPos").textContent = "Ln " + c.line + ", Col " + c.col;
        $("#stLen").textContent = c.longest > 79
          ? "最长 " + c.longest + " 列（第 " + c.longestAt + " 行）" : "共 " + c.rows + " 行";
      },
      /* Ctrl 组合键归考场自己（运行 / 字号 / 保存）；Tab、回车、成对闭合那些归控件 */
      onKey: function (ev) {
        var k = ev.key;
        if (!(ev.ctrlKey || ev.metaKey)) return false;
        if (k === "Enter") { ev.preventDefault(); doRun(); return true; }
        if (k === "=" || k === "+") { ev.preventDefault(); setFs(fs + 1); return true; }
        if (k === "-" || k === "_") { ev.preventDefault(); setFs(fs - 1); return true; }
        if (k === "0") { ev.preventDefault(); setFs(FS_0); return true; }
        if (k === "s" || k === "S") { ev.preventDefault(); saveDraft(tid, cid, ed.getValue()); toast("已保存到本机"); return true; }
        return false;
      }
    });
    var ta = ed.ta, hl = ed.hlLayer, gtCode = ed.gutter;
    var cur = ed.el.querySelector(".ed-cur");
    /* 这几个 id 是测试与跳行共用的抓手；控件本身不带课专属的 id，建完再贴上去 */
    ta.id = "ideTa"; gtCode.id = "gtCode"; hl.id = "ideHl"; cur.id = "ideCur";

    /* 题面与代码的分界 = TASK 收尾那条独行的 "#"。整块题面被删掉就没有这条线，
       那时整份 buffer 都算代码 —— 判分与报错行号用的是同一个函数，不会两处两套话。 */
    function splitAt(v) {
      var lines = String(v == null ? "" : v).split("\n"), k;
      for (k = 0; k < lines.length; k++) if (lines[k] === "#") return k + 1;
      return 0;
    }
    function codeNow() { return String(ta.value).split("\n").slice(splitAt(ta.value)).join("\n"); }
    function taskLines() { return splitAt(ta.value); }
    function updDirty() {
      /* 标签页上的点 =「代码与初始代码不一样」。草稿每次击键都自动存，
         「没保存」这个状态在考场里不存在，点不该表达一个不存在的状态 */
      dirty.classList.toggle("on", codeNow() !== (exam.starter || ""));
    }
    function syncSize() { ed.refresh(); updDirty(); }

    /* ---------- 字号：四层一起变，行号才不会错位（行距常量住在控件里，两边必须是同一个数） ---------- */
    var fs = FS_0;
    try { var saved = Number(localStorage.getItem("miao_ide_fs")); if (saved >= FS_MIN && saved <= FS_MAX) fs = saved; } catch (e) { }
    function applyFs() {
      ideRoot.style.setProperty("--ide-fs", fs + "px");
      ideRoot.style.setProperty("--ide-lhpx", (fs * ED.LH) + "px");
      $("#ideZoom").textContent = "字号 " + fs;
      ed.refresh();                     /* 重排当前行与行号：控件自己按新的 --ide-fs 量 */
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

    applyFs();
    $("#ideZoom").onclick = function () { setFs(FS_0); };

    /* Tab / Shift+Tab / 回车自动缩进 / 成对闭合 / 补全全部在控件里，考场不再自己抢键位。
       上一版这里那串 ta.value = 的写法还会顺手清掉浏览器原生撤销栈。 */
    updDirty();

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
    /* 沙箱跑的是独行 "#" 之后的代码（codeNow()），报的行号是「代码第几行」；屏上行号连题面
       一起编，所以补的是「题面占了几行」—— 那几行被删掉之后偏移自动跟着变回 0。 */
    function screenLine(n) { return Number(n) + taskLines(); }
    function frameHtml(l) {
      var m = RE_FRAME.exec(l);
      if (!m) return esc(l);
      var n = /"main\.py"/.test(l) ? screenLine(m[2]) : Number(m[2]);
      return esc(m[1]) + jumpBtn(n) + esc(m[3] || "");
    }
    /* 一份报错文本 → 逐行 {cls, html}：终端和「问题」页签共用同一套染法，不会两处两个样 */
    function errLines(text, extraLine) {
      var lines = String(text || "").split("\n");
      if (lines.length && lines[lines.length - 1] === "") lines.pop();
      var hasFrame = lines.some(function (l) { return RE_FRAME.test(l); });
      var out = lines.map(function (l) {
        var cls = errCls(l);
        /* 帧里回显的那行源码本身就是一段 Python —— 交给编辑器那把尺，字色跟在编辑器里
           敲出来的一致；但 ^^^^ / ~~~~ 那种指示行不是代码，别拿运算符色去染它 */
        var codeLine = cls === "tb-src" && !/^[ \t]*[~^]+[ \t]*$/.test(l);
        return { cls: cls, html: RE_FRAME.test(l) ? frameHtml(l) : codeLine ? hlInline(l) : esc(l) };
      });
      /* 语法错的时候解释器只回「SyntaxError: …」不带行号（formatErr 里那几行 File 被丢了），
         但 error 对象上有 pyline —— 呈现层拿来补一条能点的提示，不改解释器一个字。 */
      if (extraLine && !hasFrame) {
        out.push({
          cls: "tb-hint",
          html: "→ 出问题的应该是 " + jumpBtn(screenLine(extraLine)) + "（点一下跳过去）"
        });
      }
      return out;
    }
    function showErr(text, extraLine) {
      errLines(text, extraLine).forEach(function (l) { termHtml(l.html, l.cls); });
    }
    /* 「第 N 行」跳行：N 已经是屏上行号（连题面一起编），编辑器同一套编号，直接交给控件选行 */
    function jumpToLine(total) {
      var n = Number(total);
      if (!(n >= 1) || n > ta.value.split("\n").length) return;
      try { ed.jumpLine(n); } catch (e) { /* jsdom 量不到像素，忽略 */ }
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
      var src = codeNow();
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
      var src = codeNow();
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
        (res.passed && exam.reference ? '<pre class="rs-ref hidden">' + hlInline(exam.reference) + "</pre>" : "");
      $("#stScore").textContent = "得分 " + res.score + "（" + (res.passed ? "已过" : "未过") + "）";
      $("#stScore").classList.toggle("ok", res.passed);
      showPane("judge");
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
      saveDraft(tid, cid, ed.getValue());
      if (doc.querySelector("#app") && root.MIAO_NAV) root.MIAO_NAV("#/read/" + tid + "/" + cid);
      else location.hash = "#/read/" + tid + "/" + cid;
    };
    $("#ideRun").onclick = doRun;
    $("#ideSubmit").onclick = doSubmit;
    $("#ideReset").onclick = function () {
      ed.setValue(TASK_TEXT + (exam.starter || ""));      /* setValue 走选区替换，Ctrl+Z 还能撤回来 */
      runBox = null; termLine("[已恢复成本课初始代码]", "term-dim");
    };
    $("#termClear").onclick = function () { term.innerHTML = ""; runBox = null; termLine("[终端已清空]", "term-dim"); };
    /* 收起时清掉行内的 flexBasis（不然 flex 0 0 auto 被行内像素值压着，收不起来）；
       展开时把本机记住的高度放回去 */
    function setPanelHidden(hide) {
      var p = $("#idePanel");
      p.classList.toggle("hidden-panel", hide);
      if (hide) p.style.flexBasis = "";
      else {
        try {
          var ph = Number(localStorage.getItem("miao_ide_panel_h"));
          p.style.flexBasis = (ph >= PH_MIN && ph <= PH_MAX ? ph : 232) + "px";
        } catch (e) { p.style.flexBasis = ""; }
      }
      $("#panelHide").textContent = hide ? "展开面板" : "收起面板 ×";
    }
    $("#panelHide").onclick = function () { setPanelHidden(!$("#idePanel").classList.contains("hidden-panel")); };

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
      setPanelHidden(false);
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
    hlInline: hlInline,       /* 同一把尺的行内版：终端源码行与参考写法走的都是它 */
    onPassed: function () { }   /* app.js 会覆盖它，用来打完成标记与同步成绩 */
  };
})(typeof window !== "undefined" ? window : globalThis);
