/* 喵站 · 代码编辑器（一件控件，两处用：Python 考场 IDE 与笔试卷的代码题）
 *
 * 为什么要抽这一份：C++ 在浏览器里跑不动，考试走笔试卷，代码题以前就是一枚裸 <textarea>
 * —— 没行号、没着色、括号不闭合、Tab 被浏览器抢去跳焦点，和 Python 那套 IDE 是两个手感。
 * 他原话：「C++ 的考试它居然不是代码编辑器」。手感这种东西不该按课程分等级，所以把 IDE 那套
 * 四层（行号 / 当前行 / 着色层 / 透明 textarea）连键位一起抽成控件，两边共用一把尺。
 *
 * 三条硬规矩（都是踩过坑留下的）：
 *   1) 改动一律走 execCommand("insertText")，不许整份 ta.value = —— 整赋值会清空浏览器原生
 *      undo 栈，按一次 Tab 之后 Ctrl+Z 能把前面写的全吐出来。没有 execCommand 的环境
 *      （jsdom 自测）退回手工拼接：功能不丢，只丢撤销。
 *   2) 着色只往原文上叠 <span>，一个字符都不许改 —— 高亮层与 textarea 逐字对齐才不错位。
 *      这条和阅读页那把尺（app.js 的 MIAO_HL）是同一条判据，tests/editor-test.js 逐字对拍。
 *   3) 四层共用同一套排版令牌（--mono / --ide-fs / --ide-lh / --ide-pad-*），行高由
 *      --ide-lhpx 撑住；差 0.1 行号就飘，飘了就成「字压在行线上」那种廉价感。
 *
 * lang 只有 "py" 与 "cpp" 两把尺（站内就这两门课有代码题）；认不出的 lang 走 py 那把，
 * 顶多关键字表不对，字符一个不丢。
 */
(function (root) {
  "use strict";
  var doc = root.document;
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
    function $$(sel, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(sel)); }
  /* 与 style.css 的 --ide-lh / --ide-pad-* 是同一个数，差一处行号就飘 */
  var LH = 1.6, PAD_V = 10, PAD_H = 14;

  /* ---------------- 行写入器：着色结果一行一个 <div class="hl-row"> ----------------
     高亮层靠它撑行高去对齐 textarea。跨行的 token（三引号、块注释）由 add() 就地拆开，
     颜色接着上一段走，所以串到第 20 行的注释也不会把后面的行染花。 */
  function rowWriter() {
    var html = '<div class="hl-row">', open = null;
    function closeSpan() { if (open !== null) { html += "</span>"; open = null; } }
    function add(cls, text) {
      var parts = String(text).split("\n");
      for (var k = 0; k < parts.length; k++) {
        if (parts[k] !== "") {
          if (cls) {
            if (open !== cls) { closeSpan(); html += '<span class="' + cls + '">'; open = cls; }
            html += esc(parts[k]);
          } else { closeSpan(); html += esc(parts[k]); }
        }
        if (k + 1 < parts.length) { closeSpan(); html += '</div><div class="hl-row">'; }
      }
    }
    return { add: add, done: function () { closeSpan(); return html + "</div>"; } };
  }

  /* ================= Python 那把尺（从 exam-ui.js 原样搬来，判据一个字没改） =================
     为什么不用 py-engine 的 token：tokenize() 只给 {t,v,line} 没有偏移，字符串的 v 还是解码后
     的值（"\n" 变真换行、引号没了）、注释不进 token、f-string 的 v 是数组 —— 照它拼 HTML 会把
     缩进和注释整段丢掉。所以自己扫：原文一个字符不动，只往上叠 class。 */
  var PFX = "rRbBuUfF", PUNS = "([{)]},.;:";
  /* 标识符用 \p{L}（含中文）而不是裸码点区间那种写法。
     数字：十六进制 / 下划线分隔 / 小数 / 指数，顺序从特到泛，末尾那条兜住纯整数。 */
  var RE_NAME = /^[\p{L}_][\p{L}\p{N}_]*/u;
  var RE_NUM = /^0[xXbBoO][0-9a-fA-F_]+|^\d[\d_]*\.(?:[\d_]+)?(?:[eE][+-]?\d+)?|^\.\d[\d_]*(?:[eE][+-]?\d+)?|^\d[\d_]*[eE][+-]?\d+|^\d[\d_]*/;
  var RE_OP = /^[+\-*\/%<>=!&|^~@]+/;
  var PY_CONST = { "True": 1, "False": 1, "None": 1 };
  var PY_SELF = { self: 1, cls: 1 };
  var PY_BI = {
    print: 1, len: 1, range: 1, input: 1, int: 1, str: 1, float: 1, bool: 1, list: 1, tuple: 1,
    dict: 1, set: 1, type: 1, isinstance: 1, sum: 1, max: 1, min: 1, abs: 1, round: 1, sorted: 1,
    open: 1, enumerate: 1, zip: 1, reversed: 1, repr: 1, any: 1, all: 1, map: 1, filter: 1, next: 1,
    iter: 1, frozenset: 1, bytes: 1, id: 1, hash: 1, chr: 1, ord: 1, divmod: 1, pow: 1, format: 1
  };
  /* 沙箱脚本比本文件晚挂上（engines.code 的顺序在 site.js 里），所以用到时再取 */
  function pyKW() { return (root.MIAO_PYFE && root.MIAO_PYFE.KEYWORDS) || {}; }

  /* 定位一个字符串字面量：只找边界，不改内容。没闭合就返回 0（不染色，免得后面整段跑偏） */
  function pyStrLen(code, i) {
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

  function hlPy(code) {
    code = String(code == null ? "" : code);
    var KW = pyKW(), w = rowWriter(), add = w.add;
    var i = 0, n = code.length, atLineStart = true, lastKw = "", indLevel = 0;

    while (i < n) {
      var c = code.charAt(i);
      if (c === "\n") { indLevel = 0; atLineStart = true; lastKw = ""; add(null, "\n"); i++; continue; }
      /* 行首空白 → 缩进参考线；整行只有空白就别画线 */
      if (atLineStart && (c === " " || c === "\t")) {
        var s0 = i;
        while (i < n && (code.charAt(i) === " " || code.charAt(i) === "\t")) i++;
        var ind = code.slice(s0, i), blank = i >= n || code.charAt(i) === "\n";
        add(blank ? null : "tk-ind", ind);
        indLevel = ind.replace(/\t/g, "    ").length;
        atLineStart = false;
        continue;
      }
      /* 词间空白不画，行尾空白标出来：读者能看见自己多敲了几个空格 */
      if (c === " " || c === "\t") {
        var s1 = i;
        while (i < n && (code.charAt(i) === " " || code.charAt(i) === "\t")) i++;
        add((i >= n || code.charAt(i) === "\n") ? "tk-tws" : null, code.slice(s1, i));
        continue;
      }
      if (c === "\f") { i++; continue; }
      atLineStart = false;

      if (c === "#") { var e1 = code.indexOf("\n", i); if (e1 < 0) e1 = n; add("tk-com", code.slice(i, e1)); i = e1; continue; }
      var sl = pyStrLen(code, i);
      if (sl) { i = pyString(code, add, i, sl); lastKw = ""; continue; }

      if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(code.charAt(i + 1)))) {
        var mn = RE_NUM.exec(code.slice(i, i + 48));
        if (mn && mn[0]) { add("tk-num", mn[0]); i += mn[0].length; lastKw = ""; continue; }
      }
      if (c === "@" && indLevel === 0 && /[\w.]/.test(code.charAt(i + 1) || "")) {
        var md = /^@[\p{L}_][\p{L}\p{N}._]*/u.exec(code.slice(i));
        add("tk-dec", md[0]); i += md[0].length; continue;
      }
      var rname = RE_NAME.exec(code.slice(i));
      if (rname && rname[0]) {
        var word = rname[0], cls;
        if (PY_CONST[word]) cls = "tk-const";        /* True/False/None 也在必用关键字里，先给它们自己的色 */
        else if (KW[word]) cls = "tk-kw";
        else if (PY_SELF[word]) cls = "tk-self";
        else if (PY_BI[word]) cls = "tk-bi";
        else if (lastKw === "def") cls = "tk-def";
        else if (lastKw === "class") cls = "tk-cls";
        else cls = /^\s*\(/.test(code.slice(i + word.length)) ? "tk-call" : "tk-var";
        add(cls, word);
        i += word.length;
        lastKw = (KW[word] || PY_CONST[word]) ? word : (lastKw === "def" || lastKw === "class" ? "" : lastKw);
        continue;
      }
      var mop = RE_OP.exec(code.slice(i));
      if (mop) { add("tk-op", mop[0]); i += mop[0].length; lastKw = ""; continue; }
      if (PUNS.indexOf(c) >= 0) { add("tk-pun", c); i++; continue; }
      add(null, c); i++;                                /* 兜底：原样吐，绝不吞字符 */
    }
    return w.done();
  }

  /* 一个字符串字面量吐进写入器，返回下一个下标。f-string 的 {表达式} 单独一个色，
     读长串时能一眼看出哪段是代码；判断只看引号前面的真前缀，用 raw.slice(0,3) 粗判
     会把引号后的内容字符算进去，'f{x}' 这种普通字符串就被误染成表达式。 */
  function pyString(code, add, i, sl) {
    var raw = code.slice(i, i + sl), fm = /^([rRbBuUfF]*)(['"]{1,3})/.exec(raw);
    if (!/[fF]/.test(fm[1])) { add("tk-str", raw); return i + sl; }
    var bStart = fm[0].length, bEnd = raw.length - fm[2].length;
    add("tk-str", raw.slice(0, bStart));
    var seg = bStart, p = bStart;
    while (p < bEnd) {
      if (raw.charAt(p) === "\\") { p += 2; continue; }
      if (raw.charAt(p) !== "{") { p++; continue; }
      add("tk-str", raw.slice(seg, p));
      var q = p + 1, dep = 1;
      while (q < bEnd && dep > 0) {
        if (raw.charAt(q) === "\\") { q += 2; continue; }
        if (raw.charAt(q) === "{") dep++;
        else if (raw.charAt(q) === "}") dep--;
        q++;
      }
      add("tk-fex", raw.slice(p, Math.min(q, bEnd)));
      p = seg = Math.min(q, bEnd);
    }
    add("tk-str", raw.slice(seg, bEnd));
    add("tk-str", raw.slice(bEnd));
    return i + sl;
  }

  /* ================= C++ 那把尺 =================
     关键字表不复制第二份：阅读页那把尺（app.js 的 hlCpp）已经把 CPP_KW / CPP_TYPES 挂在
     MIAO_HL 上，这里读同一份。两把尺的差别只在出口 —— 阅读页要行内 HTML（rd-*），编辑器要
     一行一个 hl-row 的 tk-*，因为编辑器那层必须和 textarea 逐行等高。 */
  function cppKW() { return (root.MIAO_HL && root.MIAO_HL.cppKw) || {}; }
  function cppTY() { return (root.MIAO_HL && root.MIAO_HL.cppTy) || {}; }
  /* 标准库里第一课就会碰到的名字：染成「内置」色，也进补全表 */
  var CPP_BI = ("std cout cin cerr string string_view vector map unordered_map set unordered_set " +
    "pair tuple optional variant any array list deque queue stack priority_queue " +
    "size_t nullptr true false sort find count_if find_if for_each transform accumulate " +
    "begin end cbegin cend rbegin rend push_back emplace_back pop_back insert erase clear " +
    "resize reserve at front back empty max min swap abs printf scanf to_string stoi stof " +
    "make_unique make_shared unique_ptr shared_ptr move forward static_cast cout").split(" ")
    .reduce(function (m, k) { m[k] = 1; return m; }, {});
  var RE_CPP_NUM = /^(?:0[xXbB][0-9a-fA-F']+|\d[\d']*(?:\.[\d']*)?(?:[eE][+-]?\d+)?[uUlLfF]*)/;
  var RE_CPP_OP = /^[+\-*\/%<>=!&|^~?:]+/;
  var CPP_PUNS = "([{)]},;:";

  function hlCpp(code) {
    code = String(code == null ? "" : code);
    var KW = cppKW(), TY = cppTY(), w = rowWriter(), add = w.add;
    var i = 0, n = code.length, atLineStart = true;

    while (i < n) {
      var c = code.charAt(i);
      if (c === "\n") { atLineStart = true; add(null, "\n"); i++; continue; }
      if (atLineStart && (c === " " || c === "\t")) {
        var s0 = i;
        while (i < n && (code.charAt(i) === " " || code.charAt(i) === "\t")) i++;
        var ind = code.slice(s0, i);
        add(i >= n || code.charAt(i) === "\n" ? null : "tk-ind", ind);
        atLineStart = false;
        continue;
      }
      if (c === " " || c === "\t") {
        var s1 = i;
        while (i < n && (code.charAt(i) === " " || code.charAt(i) === "\t")) i++;
        add((i >= n || code.charAt(i) === "\n") ? "tk-tws" : null, code.slice(s1, i));
        continue;
      }
      if (c === "\f") { i++; continue; }
      atLineStart = false;

      if (c === "/" && code.charAt(i + 1) === "/") { var e1 = code.indexOf("\n", i); if (e1 < 0) e1 = n; add("tk-com", code.slice(i, e1)); i = e1; continue; }
      if (c === "/" && code.charAt(i + 1) === "*") { var e2 = code.indexOf("*/", i + 2); e2 = e2 < 0 ? n : e2 + 2; add("tk-com", code.slice(i, e2)); i = e2; continue; }
      /* 预处理：行首（前面只有空白）的 # 整行吃掉，行尾反斜杠接着吃下一行 ——
         色用 tk-self：C++ 里没有 self，这个色（粉）正好和官方主题的预处理同族 */
      if (c === "#") {
        var ls = code.lastIndexOf("\n", i - 1) + 1;
        if (/^\s*$/.test(code.slice(ls, i))) {
          /* 找这一行的末尾：行尾是反斜杠就续到下一行。stop 必须落在行尾那个换行上，
             落在 i 原地就等于一个字符都没吃 —— 上一版就是这么死循环在 #include 那行的 */
          var p = i, stop = n;
          for (;;) {
            var e3 = code.indexOf("\n", p);
            if (e3 < 0) { stop = n; break; }
            if (code.charAt(e3 - 1) === "\\") { p = e3 + 1; continue; }
            stop = e3; break;
          }
          add("tk-self", code.slice(i, stop)); i = stop > i ? stop : i + 1; continue;
        }
      }

      if (c === '"' || c === "'") {
        var j = i + 1, closed = false;
        while (j < n && code.charAt(j) !== "\n") {
          if (code.charAt(j) === "\\") { j += 2; continue; }
          if (code.charAt(j) === c) { closed = true; j++; break; }
          j++;
        }
        if (closed) { add("tk-str", code.slice(i, j)); i = j; continue; }   /* 没闭合就不染色，免得后面整段跑偏 */
      }
      if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(code.charAt(i + 1)))) {
        var mn2 = RE_CPP_NUM.exec(code.slice(i, i + 48));
        if (mn2 && mn2[0]) { add("tk-num", mn2[0]); i += mn2[0].length; continue; }
      }
      var nm = RE_NAME.exec(code.slice(i));
      if (nm && nm[0]) {
        var word = nm[0], after = code.slice(i + word.length);
        if (KW[word]) add("tk-kw", word);
        else if (TY[word] || /^[A-Z]/.test(word)) add("tk-cls", word);   /* 类型名与类名（大写开头）同一色 */
        else if (CPP_BI[word]) add("tk-bi", word);
        else if (/^\s*\(/.test(after)) add("tk-call", word);
        else add("tk-var", word);
        i += word.length; continue;
      }
      var mop2 = RE_CPP_OP.exec(code.slice(i));
      if (mop2) { add("tk-op", mop2[0]); i += mop2[0].length; continue; }
      if (CPP_PUNS.indexOf(c) >= 0) { add("tk-pun", c); i++; continue; }
      add(null, c); i++;
    }
    return w.done();
  }

  function highlight(code, lang) { return lang === "cpp" ? hlCpp(code) : hlPy(code); }
  /* 终端与「看参考写法」要的不是整层，是一段能直接塞进 <pre> 的行内 HTML：
     把行分隔退回换行符，两边行高各自归 CSS 管，跨行的注释/三引号也不会串色。 */
  function hlInline(code, lang) {
    return highlight(code, lang)
      .replace(/<\/div><div class="hl-row">/g, "\n")
      .replace(/^<div class="hl-row">|<\/div>$/g, "");
  }

  /* 成员补全表：点号 / -> / :: 之后能出现的名字（C++ 与 Python 共用一张，够这两门课用） */
  var MEMBERS = ("size length empty c_str substr at begin end rbegin rend front back " +
      "push_back pop_back emplace_back insert erase clear resize reserve find count " +
      "first second str data value has_value reset get move swap max min real imag " +
      "getline flush precision fixed width seekg tellg read write close good").split(" ");

  /* ================= 控件本体 ================= */
  /* 成对插入的三张表：括号/方括号/花括号/两种引号/反引号。
     为什么自己写而不让浏览器吐：浏览器只会给你一个孤零零的左括号。 */
  var PAIRS = { "(": ")", "[": "]", "{": "}", "\"": "\"", "'": "'", "`": "`" };
  var OPENERS = "([{\"'`";
  var CLOSERS = ")]}\"'`";
  var BLOCKY = { "(": ")", "[": "]", "{": "}" };          /* 回车要撑成块的只有括号类，引号不算 */

  /* 一次编辑 = 选区替换。走 execCommand("insertText") 才留得住浏览器原生撤销栈；
     整份赋值 ta.value = 会把 undo 历史清空（按一次 Tab，Ctrl+Z 把前面写的全吐出来）。
     jsdom 里没有 execCommand，退回手工拼接：功能不丢，只丢撤销。 */
  function replaceRange(ta, from, to, text, selFrom, selTo) {
    ta.setSelectionRange(from, to);
    var done = false;
    try { done = doc.execCommand("insertText", false, text); } catch (e) { done = false; }
    if (!done) {
      var v = ta.value;
      ta.value = v.slice(0, from) + text + v.slice(to);
      ta.setSelectionRange(selFrom === undefined ? from + text.length : selFrom,
        selTo === undefined ? from + text.length : selTo);
    }
    /* execCommand 会自己发 input，但它把选区留在插入文本之后 —— 需要落点时由调用方补 setSelectionRange */
  }

  function create(host, o) {
    o = o || {};
    var lang = o.lang === "cpp" ? "cpp" : "py";
    var box = doc.createElement("div");
    box.className = "ed" + (o.boxed ? " ed-box" : "");
    /* 四层结构与 IDE 完全同一套 class：行号列 / 当前行 / 着色层 / 透明 textarea。
       笔试卡片复用同一份 CSS，才不会出现「IDE 里像编辑器、卡片里像留言板」两种手感。 */
    box.innerHTML = '<div class="ide-code-row">' +
      '<pre class="gt gt-code ed-gt" aria-hidden="true"></pre>' +
      '<div class="ide-code ed-code">' +
      '<div class="ide-cur ed-cur" aria-hidden="true"></div>' +
      '<pre class="ide-hl ed-hl" aria-hidden="true"></pre>' +
      '<textarea class="ide-ta ed-ta" wrap="off" spellcheck="false" autocomplete="off" autocapitalize="off" autocorrect="off"' +
      (o.placeholder ? ' placeholder="' + esc(o.placeholder) + '"' : "") + "></textarea>" +
      '<div class="ed-pop" hidden></div>' +
      "</div></div>";
    host.appendChild(box);
    var gt = box.querySelector(".ed-gt"), codeBox = box.querySelector(".ed-code");
    var hl = box.querySelector(".ed-hl"), ta = box.querySelector(".ed-ta");
    var cur = box.querySelector(".ed-cur"), pop = box.querySelector(".ed-pop");
    ta.value = o.value == null ? "" : String(o.value);

    function px() {
      var cs = (root.getComputedStyle ? getComputedStyle(ta) : null);
      var fs = cs ? (parseFloat(cs.fontSize) || 15) : 15;
      var lh = cs ? parseFloat(cs.lineHeight) : NaN;
      return { fs: fs, lh: isFinite(lh) && lh > 0 ? lh : fs * LH };
    }
    function rows() { return String(ta.value).split("\n").length; }
    function sizeBox() {
      if (!o.grow) return;
      var m = px(), k = Math.max(o.minRows || 3, Math.min(o.maxRows || 14, rows()));
      box.style.height = Math.round(k * m.lh + PAD_V * 2) + "px";
    }
    function syncScroll() { hl.scrollTop = ta.scrollTop; hl.scrollLeft = ta.scrollLeft; gt.scrollTop = ta.scrollTop; }

    function render() {
      var v = ta.value, lines = v.split("\n"), k;
      hl.innerHTML = highlight(v, lang);
      var g = "";
      for (k = 0; k < lines.length; k++) g += '<i class="ln">' + (k + 1) + "</i>";   /* 不能拿 "\n" 拼：pre 里会凭空多一行高 */
      gt.innerHTML = g;
      sizeBox(); syncScroll(); syncPos();
    }
    function syncPos() {
      var before = ta.value.slice(0, ta.selectionStart);
      var idx = before.split("\n").length - 1;
      var col = before.length - before.lastIndexOf("\n");
      var row = hl.children[idx], m = px();
      var top = (row && row.offsetTop ? row.offsetTop : PAD_V + idx * m.lh) - ta.scrollTop;
      cur.style.top = top + "px";
      cur.style.height = m.lh + "px";
      cur.style.display = (idx >= 0 && idx < hl.children.length) ? "block" : "none";
      var ln = gt.children;
      for (var k = 0; k < ln.length; k++) ln[k].classList.toggle("cur", k === idx);
      if (o.onCursor) {
        var all = ta.value.split("\n"), longest = 0, at = 0;
        for (var q = 0; q < all.length; q++) if (all[q].length > longest) { longest = all[q].length; at = q; }
        o.onCursor({ line: idx + 1, col: col, rows: all.length, longest: longest, longestAt: at + 1 });
      }
    }

    /* ---------------- 补全 ----------------
       候选词三个来源：本课语言的关键字/标准库名 + 这份代码里已经出现过的名字（后者最有用：
       刚写过的 vector 名、自己起的函数名，Tab 两下就能补全）。成员补全（. 或 -> 之后）走一张
       常用成员表。Ctrl+Space 强制弹，打字打到 2 个字母自动弹。 */

    var RE_TAIL = /[\p{L}\p{N}_]*$/u;
    var RE_ID = /[\p{L}_][\p{L}\p{N}_]*/gu;
    var cp = { items: [], at: -1, from: 0, on: false };   /* 补全弹框的状态（pop 是那个 DOM） */

    function knownWords() {
      var out = [], k;
      if (lang === "cpp") {
        for (k in cppKW()) out.push(k);
        for (k in cppTY()) out.push(k);
        for (k in CPP_BI) out.push(k);
      } else {
        for (k in pyKW()) out.push(k);
        for (k in PY_BI) out.push(k);
        for (k in PY_CONST) out.push(k);
      }
      return out;
    }
    function candidates(prefix, member) {
      var seen = {}, all = [], k;
      var src = member ? MEMBERS : knownWords();
      for (k = 0; k < src.length; k++) if (!seen[src[k]]) { seen[src[k]] = 1; all.push(src[k]); }
      var ids = String(ta.value).match(RE_ID) || [];               /* 文档里出现过的名字最有用，排最前 */
      var mine = [];
      for (k = 0; k < ids.length; k++) if (!seen[ids[k]]) { seen[ids[k]] = 1; mine.push(ids[k]); }
      /* 排序只按「谁先能补上你现在打的这段」：文档名一组、词表一组，组内按字母。
         上一版按字数排，把 push_back / transform 这类真正要补的长词挤到第 10 名外面了。 */
      function pick(list) {
        var hit = [], q;
        for (q = 0; q < list.length; q++)
          if (list[q] !== prefix && (!prefix || list[q].lastIndexOf(prefix, 0) === 0)) hit.push(list[q]);
        return hit.sort();
      }
      var res = pick(mine).concat(pick(all));
      return res.slice(0, 9);
    }
    function memberCtx() {
      var before = ta.value.slice(0, ta.selectionStart);
      return /\.$/.test(before) || /->\s*$/.test(before) || /::\s*$/.test(before);
    }
    function caretBox() {
      var m = px(), before = ta.value.slice(0, ta.selectionStart);
      var idx = before.split("\n").length - 1;
      var col = before.length - before.lastIndexOf("\n") - 1;
      var row = hl.children[idx];
      var y = (row && row.offsetTop ? row.offsetTop : PAD_V + idx * m.lh) + m.lh - ta.scrollTop;
      /* 横向用 canvas 量真实字宽：等宽字体下乘 col 也行，但一旦字体回落（没装 JetBrains Mono
         的那批机器）乘出来的位置和实际能差半个字，弹框就会盖住正在打的那一格。
         jsdom 没有 canvas 后端（getContext 直接回 null），量不到就退回「字号 × 0.6」的格宽。 */
      var meas = caretBox.c;
      if (meas === undefined) {
        meas = null;
        try {
          var cv = doc.createElement("canvas");
          meas = cv.getContext ? cv.getContext("2d") : null;      /* jsdom 里就是 null */
        } catch (e) { meas = null; }
        caretBox.c = meas;
      }
      var line0 = before.slice(before.lastIndexOf("\n") + 1), x;
      if (meas) {
        meas.font = (root.getComputedStyle ? getComputedStyle(ta).font : "") || (m.fs + "px monospace");
        x = PAD_H + meas.measureText(line0).width - ta.scrollLeft;
      } else {
        x = PAD_H + line0.length * m.fs * 0.6 - ta.scrollLeft;    /* 量不到就退回一格 0.6em 的格宽 */
      }
      return { x: Math.max(0, Math.round(x)), y: Math.round(y) };
    }
    function showPop(prefix, member) {
      cp.items = candidates(prefix, member);
      if (!cp.items.length) { hidePop(); return; }
      cp.on = true; cp.at = 0; cp.from = ta.selectionStart - prefix.length;
      var p = caretBox();
      pop.style.left = p.x + "px"; pop.style.top = p.y + "px"; pop.hidden = false;
      pop.innerHTML = cp.items.map(function (s, i) {
        return '<div class="ed-it' + (i === 0 ? " on" : "") + '" data-i="' + i + '"><b>' + esc(s.slice(0, prefix.length)) + "</b>" + esc(s.slice(prefix.length)) + "</div>";
      }).join("");
    }
    function hidePop() { cp.on = false; cp.at = -1; cp.items = []; pop.hidden = true; }
    function movePop(d) {
      cp.at = (cp.at + d + cp.items.length) % cp.items.length;
      $$(".ed-it", pop).forEach(function (el, i) { el.classList.toggle("on", i === cp.at); });
    }
    function acceptPop() {
      var s = cp.items[cp.at];
      if (!s) { hidePop(); return false; }
      var to = ta.selectionStart;
      replaceRange(ta, cp.from, to, s);
      ta.setSelectionRange(cp.from + s.length, cp.from + s.length);
      hidePop(); after();
      return true;
    }

    /* ---------------- 一次改动之后要做的事 ---------------- */
    function after() { render(); if (o.onChange) o.onChange(ta.value); }
    function insert(text) { replaceRange(ta, ta.selectionStart, ta.selectionEnd, text); }
    function caretTo(p) { ta.setSelectionRange(p, p); }
    function lineStartOf(pos) { return ta.value.lastIndexOf("\n", pos - 1) + 1; }

    /* ---------------- 键位 ---------------- */
    ta.addEventListener("keydown", function (ev) {
      var k = ev.key, mod = ev.ctrlKey || ev.metaKey;
      /* 1) 补全框开着：方向键挑、Enter/Tab 收下、Esc 关掉。这几个键此时不许再干别的，
         否则 Enter 会一边换行一边收词，光标位置就两处都错。 */
      if (cp.on) {
        if (k === "ArrowDown") { ev.preventDefault(); movePop(1); return; }
        if (k === "ArrowUp") { ev.preventDefault(); movePop(-1); return; }
        if (k === "Enter" || k === "Tab") { ev.preventDefault(); acceptPop(); return; }
        if (k === "Escape") { ev.preventDefault(); hidePop(); return; }
        if (k === "Backspace" || /[\p{L}\p{N}_]/u.test(k)) { /* 继续打字：让 input 事件重算候选 */ }
        else hidePop();
      }
      /* 2) 带 Ctrl 的组合键归调用方（运行 / 保存 / 字号），它说接住了就到此为止 */
      if (mod && o.onKey && o.onKey(ev) === true) { hidePop(); return; }
      if (mod && k === " ") {                                  /* Ctrl+Space：不管有没有前缀都弹 */
        ev.preventDefault();
        var all0 = RE_TAIL.exec(ta.value.slice(0, ta.selectionStart))[0];
        showPop(all0, memberCtx());
        return;
      }
      if (k === "Tab") {                                        /* 多行整块缩进；Shift+Tab 反缩；单行插 4 空格 */
        ev.preventDefault(); hidePop();
        var s = ta.selectionStart, e = ta.selectionEnd, v = ta.value;
        if (s !== e) {
          var ls = lineStartOf(s), seg = v.slice(ls, e);
          var ns = ev.shiftKey ? seg.replace(/^ {1,4}/gm, "") : seg.replace(/^/gm, "    ");
          replaceRange(ta, ls, e, ns); ta.setSelectionRange(ls, ls + ns.length);
        } else if (ev.shiftKey) {
          var l2 = lineStartOf(s), head = (v.slice(l2).match(/^ {1,4}/) || [""])[0];
          if (head) { replaceRange(ta, l2, l2 + head.length, ""); caretTo(Math.max(l2, s - head.length)); }
        } else { insert("    "); }
        after(); return;
      }

      var pos = ta.selectionStart, end = ta.selectionEnd, val = ta.value;
      /* 3) 成对：敲左半边补右半边；有选区就把选区包起来（改 `x` 成 "x" 这种最常见） */
      if (!mod && !ev.altKey && PAIRS[k]) {
        ev.preventDefault(); hidePop();
        var cl = PAIRS[k];
        if (pos !== end) {
          var sel = val.slice(pos, end);
          replaceRange(ta, pos, end, k + sel + cl);
          ta.setSelectionRange(pos + 1, pos + 1 + sel.length);
        } else { replaceRange(ta, pos, end, k + cl); caretTo(pos + 1); }
        after(); return;
      }
      /* 4) 光标右边已经是那个闭合符 —— 敲它只是「跨过去」，不许再插一个 */
      if (!mod && CLOSERS.indexOf(k) >= 0 && pos === end && val.charAt(pos) === k) {
        ev.preventDefault(); caretTo(pos + 1); syncPos(); return;
      }
      /* 5) 退格删掉左半边时把紧贴的右半边一起带走，别留一个孤括号 */
      if (k === "Backspace" && pos === end && pos > 0) {
        var prev = val.charAt(pos - 1);
        if (OPENERS.indexOf(prev) >= 0 && val.charAt(pos) === PAIRS[prev]) {
          ev.preventDefault(); replaceRange(ta, pos - 1, pos + 1, ""); caretTo(pos - 1); after(); return;
        }
      }
      /* 6) 回车：沿用上一行缩进；上一行以 : 或 { 收尾再多进一级；
         光标正夹在一对括号中间就撑成一个块（VS Code 的 main() {|} 手感） */
      if (k === "Enter" && !mod && !ev.altKey) {
        var lstart = lineStartOf(pos), curLine = val.slice(lstart, pos);
        var indent = (curLine.match(/^[ \t]*/) || [""])[0];
        var ob = val.charAt(pos - 1);
        if (BLOCKY[ob] && val.charAt(pos) === PAIRS[ob]) {
          ev.preventDefault(); hidePop();
          var blk = "\n" + indent + "    " + "\n" + indent;
          replaceRange(ta, pos, end, blk);
          caretTo(pos + 1 + indent.length + 4);
          after(); return;
        }
        var extra = /[{:]\s*(?:(?:\/\/|#)[^\n]*)?$/.test(curLine) ? "    " : "";
        if (indent || extra) {
          ev.preventDefault(); hidePop();
          var ins = "\n" + indent + extra;
          replaceRange(ta, pos, end, ins);
          caretTo(pos + ins.length);
          after(); return;
        }
      }
    });
    ta.addEventListener("input", function () {
      hidePop();
      var prefix = RE_TAIL.exec(ta.value.slice(0, ta.selectionStart))[0];
      if (!o.noComplete && prefix.length >= 2) showPop(prefix, memberCtx());
      after();
    });
    ta.addEventListener("keyup", function (ev) { if (!cp.on || ev.key === "ArrowLeft" || ev.key === "ArrowRight") hidePop(); syncPos(); });
    ta.addEventListener("click", function () { hidePop(); syncPos(); });
    ta.addEventListener("scroll", function () { syncScroll(); syncPos(); });
    pop.addEventListener("mousedown", function (ev) {
      var it = ev.target.closest ? ev.target.closest(".ed-it") : null;
      if (!it) return;
      ev.preventDefault();                                      /* 别让 textarea 先失焦，选区会塌 */
      cp.at = Number(it.getAttribute("data-i")); acceptPop();
    });

    var api = {
      el: box, ta: ta, gutter: gt, hlLayer: hl,
      getValue: function () { return ta.value; },
      /* 整份替换走选区替换而不是 ta.value =：后者会清空原生撤销，「重置」之后 Ctrl+Z 就废了 */
      setValue: function (v) {
        replaceRange(ta, 0, ta.value.length, String(v == null ? "" : v));
        caretTo(0); hidePop(); after();
      },
      focus: function () { try { ta.focus(); } catch (e) { } },
      refresh: function () { render(); },
      /* 报错行号点跳：选中那一行并滚到看得见 */
      jumpLine: function (ln) {
        var lines = ta.value.split("\n"), i = 0, p = 0;
        for (i = 0; i < Math.min(Math.max(1, ln) - 1, lines.length); i++) p += lines[i].length + 1;
        ta.focus();
        ta.setSelectionRange(p, p + (lines[i] || "").length);
        var m = px(), top = PAD_V + (ln - 1) * m.lh;
        ta.scrollTop = Math.max(0, top - ta.clientHeight / 2);
        syncScroll(); syncPos();
        box.classList.remove("flash"); void box.offsetWidth; box.classList.add("flash");
      },
      destroy: function () { if (box.parentNode) box.parentNode.removeChild(box); }
    };
    render();
    if (o.readOnly) { ta.readOnly = true; }
    return api;
  }

  root.MIAO_EDITOR = {
    create: create, highlight: highlight, hlInline: hlInline,
    PAIRS: PAIRS, LH: LH, PAD_V: PAD_V, PAD_H: PAD_H,
    /* 自测钩子：两把尺与补全表共用同一份词表，测试要能直接喂代码拿 HTML */
    pyKw: pyKW, cppKw: cppKW, members: MEMBERS
  };
  if (typeof module === "object" && module.exports) module.exports = root.MIAO_EDITOR;
})(typeof window !== "undefined" ? window : globalThis);
