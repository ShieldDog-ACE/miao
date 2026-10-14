/* 喵站 · 课末考试 · 笔试界面（kind:"paper"，配合 exam-paper.js 的判分引擎）
 *
 * 为什么要有这一份：C++ 在浏览器里跑不动，213 场课末考试全走笔试 —— 题目是出卷人写死的
 * （python 沙箱卷那种「现场跑代码判分」在 cpp 这门课没有对应物）。
 *
 * 七种题型的交互：
 *   choice  单选 —— 再点一次已选中的可以取消（原生 radio 做不到，这是英语卷踩过的坑）；
 *   multi   多选 —— 普通勾选框；
 *   blank   填空 —— 单行输入；
 *   code    补代码 —— 与 Python 考场同一枚编辑器控件（code-editor.js：行号 / 着色 / 成对闭合 /
 *            块缩进 / 补全），判分只按 acceptRegex 找关键字，写法形状不卡；
 *   output  读代码写输出 —— 多行 textarea，逐行宽松比对；
 *   order   步骤排序 —— 点选项按点击顺序排成你的答案，再点已选的把它撤下来；
 *   match   勾线配对 —— 左边点一项再点右边对应项，中间真画一条线（交互与样式沿用英语卷
 *            exam-en.js 那套 wireMatch 和 .en-cols / .en-node / .en-lines）。
 *
 * 草稿：作答即存本机（miao_paprdraft_<tid>_<cid>），退出再进来不丢。
 * 交卷：有没答完的先拦一道确认；判分走 MIAO_PAPER.gradePaper，逐题复盘带「你答了什么 /
 *       正确答案 / 为什么」；只有通过才调 onPassed 打完成标记（与 python/英语两套同规矩）。
 */
(function (root) {
  "use strict";
  var doc = root.document;
  var PAPER = root.MIAO_PAPER || null;
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var TYPE_CN = {
    choice: "单项选择", multi: "多项选择", blank: "填空",
    code: "补代码", output: "读代码写输出", order: "步骤排序", match: "勾线配对"
  };
  var TYPE_TIP = {
    choice: "选一个；再点一次可以取消",
    multi: "把对的都勾上；漏选给一半，选错任何一个就全丢",
    blank: "写一个词或一句话，大小写与多余空格不计较",
    code: "把缺的代码补上；判分看关键写法在不在，不管空格与变量名",
    output: "一行一个输出，写程序打印出来的内容",
    order: "按正确顺序逐个点下面的步骤；点错了再点一遍撤下来",
    match: "先点左边一项，再点右边跟它对应的那一项；连线下面点 × 可以撤"
  };

  /* 题面里的代码行识别：C++ 卷的 stem 是「人话 + 贴在下面的代码」混在一个字符串里，
     代码行靠形状认 —— 以 ; { } 收尾、#include 开头、std:: 开头，或整行只是右括号。
     人话（中文标点收尾）不会被这几个形状误伤。认出来就交给 hlCode 上色（MIAO_HL，
     app.js 导出），认不出原样转义 —— 宁可不上色，不许改一个字。 */
  var RE_CODELINE = /(?:[;{}]\s*$)|(?:^\s*#include)|(?:std::)|(?:^\s*[})])/;
  function stemHtml(text, lang) {
    var hl = root.MIAO_HL || {};
    return String(text == null ? "" : text).split("\n").map(function (line) {
      if (RE_CODELINE.test(line)) {
        return '<span class="pp-cline">' + (hl.hlCode ? hl.hlCode(line, lang) : esc(line)) + "</span>";
      }
      return '<span class="pp-sline">' + esc(line) + "</span>";
    }).join("");
  }
  function codeHtml(code, lang) {
    var hl = root.MIAO_HL || {};
    return hl.hlCode ? hl.hlCode(String(code || ""), lang) : esc(code);
  }

  function draftKey(tid, cid) { return "miao_paprdraft_" + tid + "_" + cid; }
  function saveDraft(tid, cid, answers) {
    try { localStorage.setItem(draftKey(tid, cid), JSON.stringify(answers)); } catch (e) { }
  }
  function loadDraft(tid, cid) {
    try { return JSON.parse(localStorage.getItem(draftKey(tid, cid))); } catch (e) { return null; }
  }

  function unanswered(q, a) {
    if (q.type === "multi") return !a || !a.length;
    if (q.type === "order") return !a || !a.length;
    if (q.type === "match") return Object.keys(a || {}).length < matchPairCount(q);
    if (a && typeof a === "object") return Object.keys(a).length === 0;
    return a == null || a === "";
  }

  /* 配对题该连几对：以 answer 的项数为准。answer 里写了 left/right 认不出的配对时，
     validatePaper 会直接把这张卷判坏，所以这里不必再兜那一层 */
  function matchPairCount(q) {
    var ans = q && (q.answer !== undefined ? q.answer : (q.correct !== undefined ? q.correct : q.answers));
    if (!ans || typeof ans !== "object" || Array.isArray(ans)) return 0;
    return Object.keys(ans).length;
  }

  function render(app, tid, cid, exam, my) {
    if (!PAPER) {
      app.innerHTML = '<div class="ide"><div class="ide-loading"><h2>笔试引擎没加载上</h2>' +
        '<p>site.js 的 engines.paper 里必须先有 exam-paper.js，再有本文件。</p>' +
        '<a class="btn btn-primary" href="#/read/' + esc(tid) + "/" + esc(cid) + '">回到课文</a></div></div>';
      return;
    }
    var qs = [].concat(exam.questions || []);
    /* 这套界面今天只服务 C++ 两门（py 在浏览器里跑得动，走的是考场编辑器）；
       万一以后别课也用笔试卷，lang 认不出就退 text，顶多不上色 */
    var HL_LANG = /^cpp/.test(tid) ? "cpp" : "text";
    var draft = loadDraft(tid, cid);
    var answers = {};
    qs.forEach(function (q, i) {
      var d = draft ? draft[i] : null;
      answers[i] = d === undefined || d === null
        ? (q.type === "multi" || q.type === "order" ? [] : (q.type === "match" ? {} : "")) : d;
    });

    app.innerHTML =
      '<div class="ide">' +
      '<div class="ide-titlebar">' +
      '<button class="ide-exit" id="ppExit" type="button" title="退出考试，回到课文（作答留在本机，回来还在）">← 退出考试</button>' +
      '<div class="ide-tb-mid">' + esc(exam.title || "笔试") + "</div>" +
      '<div class="ide-tb-right"><button class="ide-btn ide-btn-go" id="ppSubmit" type="button" title="按本课目标判分（不限次数，取最高分）">交卷</button></div>' +
      "</div>" +
      '<div class="en-wrap2">' +
      '<div class="en-intro"><b>' + esc(exam.task || "完成下面所有题目") + "</b>" +
      (exam.hint ? '<div class="sd-hint">' + esc(exam.hint) + "</div>" : "") +
      '<div class="sd-hint">共 ' + qs.length + " 题，满分 100，" + (exam.pass || 60) + " 分通过。判分宽松：空格、大小写、全半角不计较。</div></div>" +
      /* 题目导航条：8–10 题一张卷，滚到底就忘了上面答没答 —— 状态点亮在眼前，点一下跳过去 */
      '<nav class="pp-nav" id="ppNav" aria-label="题目导航">' +
      qs.map(function (q, i) {
        return '<button class="pp-navdot" type="button" data-jump="' + i + '" title="' + esc(TYPE_CN[q.type] || q.type) + " · 第 " + (i + 1) + ' 题"><i>' + (i + 1) + "</i></button>";
      }).join("") +
      '<span class="pp-nav-hint" id="ppNavHint">点题号跳过去 · 没答的圈是空的</span></nav>' +
      '<div class="en-qs">' + qs.map(function (q, i) { return cardHtml(q, i, HL_LANG); }).join("") + "</div>" +
      "</div>" +
      '<div class="ide-status"><span class="st branch">考试模式</span><span class="st" id="ppProg">已答 0 / ' + qs.length + "</span>" +
      '<span class="st st-opt">笔试</span>' +
      '<span class="st st-score" id="ppScore">' +
      (my && my.best ? "最高 " + my.best + " 分" + (my.passed ? "（已过）" : "") : "") +
      "</span></div>" +
      "</div>";

    /* 换卷先清掉上一屏配对题的重画函数，否则 resize 时会去量已经不在文档里的盒子 */
    matchRedraws = [];
    bind(app, tid, cid, qs, answers, HL_LANG);
    bindNav(app, qs, answers);
    updProgress(app, qs, answers);

    $("#ppExit", app).onclick = function () { saveDraft(tid, cid, answers); location.hash = "#/read/" + tid + "/" + cid; };
    $("#ppSubmit", app).onclick = function () { doSubmit(app, tid, cid, qs, answers, exam, my); };
  }

  function cardHtml(q, i, lang) {
    var head = '<div class="en-qhead"><span class="en-qno">' + (i + 1) + "</span>" +
      '<span class="en-qprompt"><b class="pp-type">' + esc(TYPE_CN[q.type] || q.type) + "</b>" + stemHtml(q.stem, lang) + "</span>" +
      '<span class="en-qw">' + (q.score || 0) + " 分</span></div>" +
      '<div class="pp-tip">' + esc(TYPE_TIP[q.type] || "") + "</div>";
    if (q.code) head += '<pre class="pp-code"><code>' + codeHtml(q.code, lang) + "</code></pre>";
    if (q.type === "choice") {
      return '<div class="en-card-q" data-q="' + i + '">' + head +
        '<div class="en-opts">' + (q.options || []).map(function (o, oi) {
          var body = RE_CODELINE.test(o) ? codeHtml(o, lang) : esc(o);
          return '<label class="en-opt"><input type="radio" name="pp' + i + '" value="' + oi + '"><span>' + body + "</span></label>";
        }).join("") + "</div></div>";
    }
    if (q.type === "multi") {
      return '<div class="en-card-q" data-q="' + i + '">' + head +
        '<div class="en-opts">' + (q.options || []).map(function (o, oi) {
          var body = RE_CODELINE.test(o) ? codeHtml(o, lang) : esc(o);
          return '<label class="en-opt"><input type="checkbox" name="pp' + i + '" value="' + oi + '"><span>' + body + "</span></label>";
        }).join("") + "</div></div>";
    }
    if (q.type === "blank") {
      return '<div class="en-card-q" data-q="' + i + '">' + head +
        '<input class="en-write" type="text" autocomplete="off" spellcheck="false" placeholder="在这里写答案"></div>';
    }
    if (q.type === "code") {
      /* 代码题不再是一枚裸 textarea：交给共用控件（code-editor.js），
         行号 / 着色 / 成对闭合 / 块缩进 / 补全与 Python 考场同一套手感。
         output 题不套控件 —— 那格填的是程序输出，自动闭合引号只会碍事。 */
      return '<div class="en-card-q" data-q="' + i + '">' + head +
        '<div class="pp-ed" data-ed="' + i + '"></div></div>';
    }
    if (q.type === "output") {
      return '<div class="en-card-q" data-q="' + i + '">' + head +
        '<textarea class="pp-area" rows="4" spellcheck="false" placeholder="一行一条输出"></textarea></div>';
    }
    if (q.type === "order") {
      var steps = q.steps || q.options || q.items || [];
      return '<div class="en-card-q" data-q="' + i + '">' + head +
        '<div class="pp-seq" data-seq></div>' +
        '<div class="pp-order">' + steps.map(function (s, si) {
          return '<button class="pp-step" type="button" data-si="' + si + '"><span>' + esc(s) + "</span></button>";
        }).join("") + "</div></div>";
    }
    if (q.type === "match") {
      /* 两栏 + 中间画线：类名与英语卷共用一套（.en-cols 自带 position:relative，
         .en-lines 是铺在它身上的绝对层 —— 参照系必须同一个，不然线画到盒子外被裁掉） */
      var ml = q.left || q.items || [];
      var mr = q.right || q.options || [];
      return '<div class="en-card-q en-match" data-q="' + i + '">' + head +
        '<div class="en-cols"><div class="en-col left">' + ml.map(function (l) {
          return '<button class="en-node" type="button" data-side="l" data-v="' + esc(l) + '"><span>' + esc(l) + "</span></button>";
        }).join("") + "</div>" +
        '<svg class="en-lines"></svg>' +
        '<div class="en-col right">' + mr.map(function (r) {
          return '<button class="en-node" type="button" data-side="r" data-v="' + esc(r) + '"><span>' + esc(r) + "</span></button>";
        }).join("") + "</div></div>" +
        '<div class="en-pairs" data-pairs></div></div>';
    }
    return '<div class="en-card-q" data-q="' + i + '">' + head + '<div class="pp-tip">这种题型判不了，跳过吧</div></div>';
  }

  function bind(app, tid, cid, qs, answers, lang) {
    var editors = {};                 /* 代码题那几枚控件的实例，留着好收（将来切题不残留） */
    qs.forEach(function (q, i) {
      var card = $('.en-card-q[data-q="' + i + '"]', app);
      if (!card) return;
      if (q.type === "choice") {
        $$('input[type=radio]', card).forEach(function (r) {
          if (answers[i] === Number(r.value)) { r.checked = true; r.dataset.was = "1"; }
          r.addEventListener("click", function () {
            if (r.dataset.was === "1") { r.checked = false; r.dataset.was = ""; answers[i] = ""; }
            else { answers[i] = Number(r.value); }
            saveDraft(tid, cid, answers); updProgress(app, qs, answers);
          });
          r.addEventListener("change", function () {
            $$('input[type=radio]', card).forEach(function (x) { x.dataset.was = ""; });
            if (r.checked) { r.dataset.was = "1"; answers[i] = Number(r.value); }
            saveDraft(tid, cid, answers); updProgress(app, qs, answers);
          });
        });
      } else if (q.type === "multi") {
        $$('input[type=checkbox]', card).forEach(function (r) {
          var cur = Array.isArray(answers[i]) ? answers[i] : [];
          if (cur.indexOf(Number(r.value)) >= 0) r.checked = true;
          r.addEventListener("change", function () {
            var set = [];
            $$('input[type=checkbox]', card).forEach(function (x) { if (x.checked) set.push(Number(x.value)); });
            answers[i] = set;
            saveDraft(tid, cid, answers); updProgress(app, qs, answers);
          });
        });
      } else if (q.type === "blank") {
        var inp = $(".en-write", card);
        inp.value = answers[i] || "";
        inp.oninput = function () { answers[i] = inp.value; saveDraft(tid, cid, answers); updProgress(app, qs, answers); };
      } else if (q.type === "code") {
        var host = $("[data-ed]", card);
        if (!host) return;
        if (!root.MIAO_EDITOR) {
          host.innerHTML = '<textarea class="pp-area mono" rows="4" spellcheck="false" placeholder="把代码写在这里"></textarea>';
          var fb = $("textarea", host);
          fb.value = answers[i] || "";
          fb.oninput = function () { answers[i] = fb.value; saveDraft(tid, cid, answers); updProgress(app, qs, answers); };
          return;
        }
        editors[i] = root.MIAO_EDITOR.create(host, {
          lang: lang, boxed: true, grow: true, minRows: 4, maxRows: 16,
          value: answers[i] || "", placeholder: "把代码写在这里",
          onChange: function (v) { answers[i] = v; saveDraft(tid, cid, answers); updProgress(app, qs, answers); }
        });
      } else if (q.type === "output") {
        var ta2 = $(".pp-area", card);
        ta2.value = answers[i] || "";
        ta2.oninput = function () { answers[i] = ta2.value; saveDraft(tid, cid, answers); updProgress(app, qs, answers); };
      } else if (q.type === "order") {
        wireOrder(app, card, i, q, tid, cid, qs, answers);
      } else if (q.type === "match") {
        wireMatch(app, card, i, q, tid, cid, qs, answers);
      }
    });
  }

  /* 排序题：点步骤把它追加进你的顺序；点「你的顺序」里的某一步把它撤掉 */
  function wireOrder(app, card, i, q, tid, cid, qs, answers) {
    var steps = q.steps || q.options || q.items || [];
    var seqBox = $("[data-seq]", card);
    function redraw() {
      var cur = Array.isArray(answers[i]) ? answers[i] : [];
      seqBox.innerHTML = cur.length
        ? cur.map(function (si, pos) {
          return '<span class="pp-pick" data-un="' + si + '"><i>' + (pos + 1) + "</i>" + esc(steps[si]) + "<b>×</b></span>";
        }).join("")
        : '<span class="pp-tip">还没排 —— 按顺序点下面的步骤</span>';
      $$("[data-un]", seqBox).forEach(function (b) {
        b.onclick = function () {
          answers[i] = cur.filter(function (x) { return x !== Number(b.getAttribute("data-un")); });
          saveDraft(tid, cid, answers); redraw(); updProgress(app, qs, answers);
        };
      });
      $$(".pp-step", card).forEach(function (s) { s.classList.remove("on"); });
      cur.forEach(function (si) { var el = $('.pp-step[data-si="' + si + '"]', card); if (el) el.classList.add("on"); });
    }
    $$(".pp-step", card).forEach(function (s) {
      s.onclick = function () {
        var si = Number(s.getAttribute("data-si"));
        var cur = Array.isArray(answers[i]) ? answers[i] : [];
        if (cur.indexOf(si) >= 0) answers[i] = cur.filter(function (x) { return x !== si; });
        else answers[i] = cur.concat([si]);
        saveDraft(tid, cid, answers); redraw(); updProgress(app, qs, answers);
      };
    });
    redraw();
  }

  /* 勾线题：点左边一项 → 再点右边对应项，中间画一条线；连线下面的小牌点 × 撤掉。
     画法与英语卷 exam-en.js 的 wireMatch 同一套（照着它搬，别再发明一遍）：
     坐标一律按 .en-cols 量，因为铺在身上的 SVG 也以它为参照系。 */
  var matchRedraws = [];      /* 当前这一屏所有配对题的重画函数；每次 render 清空重建 */
  var matchResizeBound = false;
  function bindMatchResize() {
    if (matchResizeBound || !root.addEventListener) return;
    matchResizeBound = true;
    var run = function () {
      matchRedraws = matchRedraws.filter(function (f) {
        try { f(); return true; } catch (e) { return false; }   /* 卡片已经换掉了就把它摘下来 */
      });
    };
    root.addEventListener("resize", run);
    root.addEventListener("load", run);        /* 字体/图片晚到一步会改变盒子，补画一次 */
  }

  function wireMatch(app, card, i, q, tid, cid, qs, answers) {
    var sel = null;
    var cols = $(".en-cols", card), lines = $(".en-lines", card), pairsBox = $("[data-pairs]", card);
    if (!answers[i] || typeof answers[i] !== "object" || Array.isArray(answers[i])) answers[i] = {};
    function nodeAt(side, val) {
      var hit = null;
      $$(".en-node", card).forEach(function (x) {
        if (x.getAttribute("data-side") === side && x.getAttribute("data-v") === String(val)) hit = x;
      });
      return hit;
    }
    function redraw() {
      var map = answers[i] || {};
      var cb = cols.getBoundingClientRect();
      lines.innerHTML = "";
      lines.setAttribute("viewBox", "0 0 " + cb.width + " " + cb.height);
      lines.setAttribute("preserveAspectRatio", "none");
      $$(".en-node", card).forEach(function (x) { x.classList.remove("linked", "sel"); x.style.borderColor = ""; });
      if (sel) { var se = nodeAt("l", sel); if (se) se.classList.add("sel"); }
      var colors = ["#fb7da8", "#2f6feb", "#2fbf71", "#e8833a", "#8e5cd9", "#c0392b"];
      var n = 0;
      Object.keys(map).forEach(function (l) {
        var le = nodeAt("l", l), re = nodeAt("r", map[l]);
        if (!le || !re) return;
        var a = le.getBoundingClientRect(), b = re.getBoundingClientRect();
        var c = colors[(n++) % colors.length];
        var x1 = a.right - cb.left, y1 = a.top + a.height / 2 - cb.top;
        var x2 = b.left - cb.left, y2 = b.top + b.height / 2 - cb.top;
        var path = doc.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M" + x1 + " " + y1 + " C" + (x1 + 34) + " " + y1 + " " + (x2 - 34) + " " + y2 + " " + x2 + " " + y2);
        path.setAttribute("stroke", c); path.setAttribute("fill", "none"); path.setAttribute("stroke-width", "2.5");
        lines.appendChild(path);
        le.style.borderColor = c; re.style.borderColor = c;
        le.classList.add("linked"); re.classList.add("linked");
      });
      pairsBox.innerHTML = Object.keys(map).map(function (l) {
        return '<span class="en-pair">' + esc(l) + " → " + esc(map[l]) + '<b data-un="' + esc(l) + '">×</b></span>';
      }).join("");
      $$("[data-un]", pairsBox).forEach(function (b) {
        b.onclick = function () {
          delete answers[i][b.getAttribute("data-un")];
          saveDraft(tid, cid, answers); redraw(); updProgress(app, qs, answers);
        };
      });
    }
    $$(".en-node", card).forEach(function (nd) {
      nd.onclick = function () {
        var side = nd.getAttribute("data-side"), val = nd.getAttribute("data-v");
        if (side === "l") {
          /* 再点一次已选中的左边 = 取消选择（和单选那条同一个道理：不能只进不能退） */
          if (sel === val) { sel = null; nd.classList.remove("sel"); return; }
          $$('.en-node[data-side="l"]', card).forEach(function (x) { x.classList.remove("sel"); });
          nd.classList.add("sel"); sel = val; return;
        }
        if (!sel) { toast("先点左边一项，再点右边跟它对应的那一项"); return; }
        /* 一个左项只留一条线；右项被别的线占了就让给新连的这条（判分只看最终这张对照表） */
        Object.keys(answers[i]).forEach(function (l) { if (answers[i][l] === val) delete answers[i][l]; });
        answers[i][sel] = val;
        sel = null;
        saveDraft(tid, cid, answers); redraw(); updProgress(app, qs, answers);
      };
    });
    matchRedraws.push(redraw);
    bindMatchResize();
    setTimeout(redraw, 30);
    redraw();
  }

  function updProgress(app, qs, answers) {
    var done = qs.filter(function (q, i) { return !unanswered(q, answers[i]); }).length;
    var el = $("#ppProg", app);
    if (el) el.textContent = "已答 " + done + " / " + qs.length;
    /* 导航条的圈跟着答题状态填实：读者不用滚全卷就知道还剩哪几道空着 */
    $$(".pp-navdot", app).forEach(function (dot) {
      var i = Number(dot.getAttribute("data-jump"));
      dot.classList.toggle("filled", i < qs.length && !unanswered(qs[i], answers[i]));
    });
  }

  function bindNav(app, qs, answers) {
    $$(".pp-navdot", app).forEach(function (dot) {
      dot.onclick = function () {
        var i = Number(dot.getAttribute("data-jump"));
        var card = $('.en-card-q[data-q="' + i + '"]', app);
        if (!card) return;
        if (card.scrollIntoView) { try { card.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) { /* jsdom 之类没实现，跳过 */ } }
        var f = card.querySelector("input, textarea");
        if (f && f.focus) { try { f.focus(); } catch (e) { } }
      };
    });
  }

  function doSubmit(app, tid, cid, qs, answers, exam, my) {
    var blank = qs.filter(function (q, i) { return unanswered(q, answers[i]); }).length;
    if (blank && !root.confirm("还有 " + blank + " 题没做完，确定交卷？")) return;
    var r = PAPER.gradePaper(exam, answers);
    /* 没答的题在卡片上点出来：交完卷才知道哪道空着，比让人回头滚全卷强 */
    qs.forEach(function (q, i) {
      var card = $('.en-card-q[data-q="' + i + '"]', app);
      if (!card) return;
      var blank = unanswered(q, answers[i]);
      card.classList.toggle("miss", blank);
      var dot = $('.pp-navdot[data-jump="' + i + '"]', app);
      if (dot) dot.classList.toggle("miss", blank);
    });
    var box = $("#ppResult", app) || doc.createElement("div");
    if (!$("#ppResult", app)) { box.id = "ppResult"; $(".en-wrap2", app).appendChild(box); }
    box.className = "en-result";
    box.innerHTML =
      (r.valid ? "" :
        '<div class="rs-band no"><span class="rs-line">这张卷子本身写坏了，判分不算数：' +
        esc(r.errors.join("；")) + "</span></div>") +
      '<div class="rs-score ' + (r.passed ? "ok" : "no") + '">' + r.score + "<small>/100 · " + (r.passed ? "通过" : "未通过") + "</small></div>" +
      '<div class="sd-sec">逐题复盘（你答了什么、正确答案是什么、为什么）</div>' +
      '<ul class="en-review">' + r.items.map(function (it, i) {
        var q = qs[i];
        return '<li class="' + (it.mark === "ok" ? "pass" : it.mark === "half" ? "half" : "fail") + '">' +
          '<span class="ck-mark">' + (it.mark === "ok" ? "✓" : it.mark === "half" ? "◐" : "✗") + "</span>" +
          "<div><div>第 " + (i + 1) + " 题 · " + esc(TYPE_CN[it.type] || it.type) + " " + it.pts + "/" + it.weight + " 分</div>" +
          '<div class="ck-saw">' + esc(it.saw) + "</div>" +
          (q && q.code ? '<pre class="pp-code"><code>' + esc(q.code) + "</code></pre>" : "") +
          (it.why ? '<div class="pp-why">' + esc(it.why) + "</div>" : "") +
          "</div></li>";
      }).join("") + "</ul>" +
      '<div class="rs-ops">' +
      (r.passed
        ? '<a class="btn btn-primary btn-sm" href="#/read/' + esc(tid) + "/" + esc(cid) + '">回课文，已标记完成</a>'
        : '<button class="btn btn-primary btn-sm" id="ppRetry" type="button">回去改答案</button>') +
      "</div>";
    $("#ppScore", app).textContent = "得分 " + r.score + "（" + (r.passed ? "已过" : "未过") + "）";
    if (box.scrollIntoView) { try { box.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) { /* jsdom 没实现，跳过 */ } }
    var retry = $("#ppRetry", box);
    if (retry) retry.onclick = function () {
      if (box.parentNode) box.parentNode.removeChild(box);
      $("#ppScore", app).textContent = my && my.best ? "最高 " + my.best + " 分" : "";
    };
    if (r.passed && root.MIAO_EXAM_UI && root.MIAO_EXAM_UI.onPassed) {
      root.MIAO_EXAM_UI.onPassed(tid, cid, { score: r.score, passed: true });
    } else if (r.valid) {
      toast("还差一点：" + r.score + " 分，通过线 " + r.passLine + " 分");
    }
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

  root.MIAO_EXAM_PAPER = {
    render: render,
    unanswered: unanswered,
    /* 自测用：判分本体在 exam-paper.js，这里只是把界面依赖的几个函数带出来 */
    TYPE_CN: TYPE_CN
  };
  if (typeof module === "object" && module.exports) module.exports = root.MIAO_EXAM_PAPER;
})(typeof window !== "undefined" ? window : globalThis);
