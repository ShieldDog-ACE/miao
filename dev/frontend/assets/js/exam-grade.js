/* 喵站 · 课末考试 · 判分器（纯逻辑，浏览器与 Node 共用）
 *
 * 判分口径照需求来：
 *   ① 「不能太严格」——输出比对先把连续空白折成一个空格、逐行去首尾空白、丢掉行尾空行，
 *      所以多打空格、缩进写歪、结尾多按一次回车都不该判错；
 *   ② 「if 等等检测它都经过了什么」——解释器交出执行轨迹（走了哪条分支、调了哪些函数、
 *      循环转了几圈、变量最后是什么），判分器拿轨迹说话，并把「检测到了什么」写回给读者看。
 * 分数：各检查项按 weight 加权，总分 ≥ exam.pass（默认 60）即通过。
 */
(function (root, factory) {
  /* 浏览器里 <script> 是顺序执行的，全局名先到位；Node 侧走 require。两边都不许在缺全局时静默拿 null。 */
  var need = typeof require === "function" ? require : null;
  var api = factory(root.MIAO_PYRUN || (need && need("./py-stdlib.js")), root.MIAO_PYFE || (need && need("./py-engine.js")));
  if (typeof module === "object" && module.exports) module.exports = api;
  root.MIAO_EXAM = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (RUN, ENG) {
  "use strict";

  /* 空白折叠：连续空格/Tab 合成一个，行首行尾去掉，尾部空行丢掉 */
  function fold(s) {
    return String(s == null ? "" : s)
      .replace(/\r/g, "")
      .split("\n")
      .map(function (l) { return l.replace(/[ \t\u3000]+/g, " ").trim(); })
      .join("\n")
      .replace(/\n+$/, "");
  }
  function lines(s) { return fold(s) === "" ? [] : fold(s).split("\n"); }
  function normText(s) { return String(s == null ? "" : s).replace(/[ \t\u3000]+/g, " ").trim(); }

  /* AST 特征扫描：用来判断「读者到底用了这一课教的东西没有」 */
  var FEATURES = {
    fstr: function (n) { return n.k === "fstr"; },
    str: function (n) { return n.k === "str" && n.v !== ""; },
    format: function (n) { return n.k === "call" && n.fn && n.fn.k === "attr" && n.fn.attr === "format"; },
    pct: function (n) { return n.k === "bin" && n.op === "%" && n.left && n.left.k === "str"; },
    if: function (n) { return n.k === "if"; },
    elif: function (n) { return n.k === "if" && n.orelse && n.orelse.length === 1 && n.orelse[0].k === "if"; },
    while: function (n) { return n.k === "while"; },
    for: function (n) { return n.k === "for"; },
    def: function (n) { return n.k === "def"; },
    class: function (n) { return n.k === "class"; },
    subclass: function (n) { return n.k === "class" && (n.bases || []).length > 0; },
    super: function (n) { return n.k === "call" && n.fn && n.fn.k === "name" && n.fn.name === "super"; },
    try: function (n) { return n.k === "try"; },
    with: function (n) { return n.k === "with"; },
    list: function (n) { return n.k === "list"; },
    dict: function (n) { return n.k === "dict"; },
    set: function (n) { return n.k === "set"; },
    tup: function (n) { return n.k === "tup"; },
    slice: function (n) { return n.k === "slice"; },
    comp: function (n) { return /comp$/.test(n.k); },
    lambda: function (n) { return n.k === "lambda"; },
    in: function (n) { return n.k === "cmp" && n.ops.indexOf("in") >= 0; },
    not: function (n) { return n.k === "not"; },
    and: function (n) { return n.k === "logic" && n.op === "and"; },
    or: function (n) { return n.k === "logic" && n.op === "or"; },
    import: function (n) { return n.k === "import" || n.k === "fromimport"; },
    unpack: function (n) { return n.k === "assign" && n.targets.some(function (t) { return t.k === "seq"; }); },
    var: function (n) { return n.k === "assign"; },
    strconcat: function (n) { return n.k === "bin" && n.op === "+"; },
    print: function (n) { return n.k === "call" && n.fn && n.fn.k === "name" && n.fn.name === "print"; },
    /* ↓ 第 4–10 课要点：sep= / end= / 多个位置参数 / 三引号 / 字符串里写 \n */
    sep: function (n) { return isPrint(n) && hasKw(n, "sep"); },
    endkw: function (n) { return isPrint(n) && hasKw(n, "end"); },
    multiarg: function (n) { return isPrint(n) && plainArgs(n) >= 2; },
    singlearg: function (n) { return isPrint(n) && plainArgs(n) === 1; },
    tq: function (n) { return (n.k === "str" || n.k === "fstr") && n.triple; },
    escnl: function (n) { return (n.k === "str" || n.k === "fstr") && String(n.v || "").indexOf("\n") >= 0; },
    assign: function (n) { return n.k === "assign" || n.k === "annassign"; }
  };
  function isPrint(n) { return n.k === "call" && n.fn && n.fn.k === "name" && n.fn.name === "print"; }
  function hasKw(n, name) { return (n.kws || []).some(function (k) { return k.name === name; }); }
  function plainArgs(n) { return (n.args || []).length; }
  /* 判分证据要给人话，不能露出内部字段名（multiarg 这种） */
  var FEATURE_LABELS = {
    fstr: "f-string（花括号里直接放值）", str: "引号圈起来的文本", strconcat: "用 + 把文本接起来",
    format: ".format() 的写法", pct: "% 老式格式化", "if": "if 判断", elif: "elif 分支",
    while: "while 循环", "for": "for 循环", def: "def 自定义函数", class: "class 定义的类",
    try: "try/except", with: "with 语句", list: "列表", dict: "字典", set: "集合", tup: "元组",
    slice: "切片写法 a[1:3]", comp: "推导式", lambda: "lambda", "in": "in 判断", not: "not 取反",
    and: "and", or: "or", import: "import 导入", unpack: "一行解包赋值",
    var: "变量赋值", print: "print 调用", sep: "sep= 指定分隔符", endkw: "end= 控制结尾",
    multiarg: "一条 print 里用逗号给了多个值", singlearg: "print 只有一个参数",
    tq: "三引号字符串", escnl: "字符串里写了 \\n", assign: "赋值语句",
    subclass: "带父类的 class 定义（继承）", super: "super() 调用父类"
  };
  function featName(f) { return FEATURE_LABELS[f] || f; }

  function walk(node, cb) {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) { node.forEach(function (x) { walk(x, cb); }); return; }
    cb(node);
    Object.keys(node).forEach(function (k) {
      if (k === "line" || k === "v" || k === "name" && typeof node.name === "string") { /* 名字节点仍要继续走 */ }
      var child = node[k];
      if (child && typeof child === "object") walk(child, cb);
    });
  }
  function astFeatures(ast) {
    var hit = {};
    walk(ast, function (n) {
      Object.keys(FEATURES).forEach(function (f) {
        try { if (FEATURES[f](n)) hit[f] = (hit[f] || 0) + 1; } catch (e) { /* 结构不齐的节点跳过 */ }
      });
    });
    return hit;
  }

  /* ---------- 各类检查项 ----------
     每项返回 {ok, saw}：saw 是给读者看的人话证据，一定要写清「检测到了什么」 */
  var CHECKS = {
    "run-ok": function (c, ctx) {
      var ok = ctx.exit === 0;
      return { ok: ok, saw: ok ? "代码跑完了，没有报错" : "运行时报错：" + firstErrLine(ctx.err) };
    },
    "no-error": function (c, ctx) {
      var ok = ctx.exit === 0 && ctx.err.indexOf("Traceback") < 0;
      return { ok: ok, saw: ok ? "终端里没有红色报错" : "有报错：—" + firstErrLine(ctx.err) };
    },
    "stdout-has": function (c, ctx) {
      var want = normText(c.text), got = fold(ctx.out), hay = c.ignoreCase ? got.toLowerCase() : got;
      var needle = c.ignoreCase ? want.toLowerCase() : want;
      var ok = hay.indexOf(needle) >= 0;
      return { ok: ok, saw: ok ? "终端输出里找到了「" + c.text + "」" : "输出里没找到「" + c.text + "」，你的输出是：" + (got === "" ? "（空的）" : quote(got)) };
    },
    "stdout-not": function (c, ctx) {
      var hay = fold(ctx.out), ok = hay.indexOf(normText(c.text)) < 0;
      return { ok: ok, saw: ok ? "确认没有「" + c.text + "」" : "输出里出现了不该有的「" + c.text + "」" };
    },
    "stdout-equals": function (c, ctx) {
      var want = c.ignoreCase ? normText(c.text).toLowerCase() : fold(c.text);
      var got = c.ignoreCase ? fold(ctx.out).toLowerCase() : fold(ctx.out);
      var ok = got === want;
      return { ok: ok, saw: ok ? "输出与要求一致（已忽略多余空格）" : "输出对不上。要求：" + quote(want) + "；你的：" + quote(got) };
    },
    "stdout-line": function (c, ctx) {
      var ls = lines(ctx.out), idx = c.index || 0;
      var gotLine = idx < ls.length ? ls[idx] : null;
      var ok = gotLine !== null && normText(gotLine) === normText(c.text);
      return { ok: ok, saw: ok ? "第 " + (idx + 1) + " 行正是「" + c.text + "」" :
        "第 " + (idx + 1) + " 行不对：要求「" + c.text + "」，实际「" + (gotLine === null ? "（没有这一行）" : gotLine) + "」" };
    },
    "stdout-regex": function (c, ctx) {
      var re = new RegExp(c.pattern, c.flags || "");
      var ok = re.test(fold(ctx.out));
      return { ok: ok, saw: ok ? "输出符合 " + c.pattern : "输出里找不到 " + c.pattern + " 这种样子，你的输出是：" + quote(fold(ctx.out)) };
    },
    "called": function (c, ctx) {
      var min = c.min || 1;
      var n = ctx.trace.calls.filter(function (x) { return x.name === c.name; }).length;
      var ok = n >= min;
      return { ok: ok, saw: ok ? "检测到 " + c.name + "() 被调用了 " + n + " 次" :
        "没检测到 " + c.name + "() 的调用" + (n ? "（只调了 " + n + " 次，要求 " + min + " 次）" : "") };
    },
    "not-called": function (c, ctx) {
      var n = ctx.trace.calls.filter(function (x) { return x.name === c.name; }).length;
      return { ok: n === 0, saw: n === 0 ? "确认没用 " + c.name : "用了 " + c.name + "（" + n + " 次），本课要求不用它" };
    },
    "branch": function (c, ctx) {
      var bs = ctx.trace.branches.filter(function (b) { return b.kind === (c.at === "loop" ? c.kind || "if" : "if"); });
      if (c.line) bs = bs.filter(function (b) { return b.line === c.line; });
      var want = c.at === "true" ? true : c.at === "false" ? false : null;
      var hit = want === null ? bs : bs.filter(function (b) { return b.val === want; });
      var ok = hit.length > 0;
      var desc = want === null ? "分支" : (want ? "真分支" : "假分支");
      return {
        ok: ok, saw: ok ? "检测到你走过了 " + (c.line ? "第 " + c.line + " 行的" : "") + desc + "（条件 " + hit[0].cond + "）"
          : "没走到" + desc + (bs.length ? "；你跑过的判断是：" + bs.map(function (b) { return "第" + b.line + "行 " + b.cond + "→" + (b.val ? "真" : "假"); }).join("，") : "；一个 if 都没执行")
      };
    },
    "loop": function (c, ctx) {
      var min = c.min == null ? 1 : c.min;
      var kind = c.kind || "for";
      var ls = ctx.trace.loops.filter(function (l) { return l.kind === kind; });
      var times = ls.reduce(function (a, b) { return a + b.times; }, 0);
      var ok = times >= min;
      return { ok: ok, saw: ok ? "检测到 " + kind + " 循环转了 " + times + " 圈" : (ls.length ? "循环只转了 " + times + " 圈，要求至少 " + min : "没检测到 " + kind + " 循环") };
    },
    "var": function (c, ctx) {
      /* equals / expected 两种写法都认：出题数据里手滑写哪个都能用 */
      var want = c.equals !== undefined ? c.equals : c.expected;
      var v = ctx.trace.vars[c.name];
      var got = v === undefined ? undefined : RUN.repr(v, ctx.env);
      var ok = v !== undefined && looseEq(v, want, ctx);
      return { ok: ok, saw: ok ? "变量 " + c.name + " 最后是 " + got : "变量 " + c.name + " 不等于要求：" + (v === undefined ? "这个名字没出现过" : "它是 " + got + "，要求 " + RUN.repr(want, ctx.env)) };
    },
    "file-has": function (c, ctx) {
      var content = ctx.files[c.path];
      var ok = content !== undefined && String(content).indexOf(c.has) >= 0;
      return { ok: ok, saw: ok ? "文件 " + c.path + " 里确实写着「" + c.has + "」" : "文件 " + c.path + (content === undefined ? " 没被创建" : " 里没找到「" + c.has + "」，它现在是：" + quote(String(content))) };
    },
    "ast": function (c, ctx) {
      var need = [].concat(c.uses || []);
      var miss = need.filter(function (f) { return !ctx.features[f]; });
      return { ok: miss.length === 0, saw: miss.length === 0 ? "用到了 " + need.map(featName).join("、") : "没检测到 " + miss.map(featName).join("、") };
    },
    "ast-not": function (c, ctx) {
      var bad = [].concat(c.uses || []).filter(function (f) { return ctx.features[f]; });
      return { ok: bad.length === 0, saw: bad.length === 0 ? "确认没用 " + [].concat(c.uses).map(featName).join("、") : "用了 " + bad.map(featName).join("、") + "，本课要求换一种写法" };
    },
    "assign-count": function (c, ctx) {
      var n = ctx.features.assign || 0;
      var min = c.min == null ? 1 : c.min;
      return { ok: n >= min, saw: n >= min ? "一共赋值了 " + n + " 次" : "只赋值 " + n + " 次，要求至少 " + min + " 次" };
    },
    "print-calls": function (c, ctx) {
      var n = ctx.features.print || 0;
      if (c.exactly != null) return { ok: n === c.exactly, saw: n === c.exactly ? "正好调用了 " + n + " 次 print" : "print 调用了 " + n + " 次，要求正好 " + c.exactly + " 次" };
      var min = c.min == null ? 1 : c.min;
      return { ok: n >= min, saw: n >= min ? "print 调用了 " + n + " 次" : "print 只调用了 " + n + " 次，要求至少 " + min + " 次" };
    },
    "lines-at-least": function (c, ctx) {
      var n = lines(ctx.out).length;
      return { ok: n >= c.n, saw: n >= c.n ? "输出了 " + n + " 行" : "只输出了 " + n + " 行，要求至少 " + c.n + " 行" };
    },
    /* 注释这一课没法从输出或轨迹看出来，只能看源码里有没有 #。
       这是唯一一处直接看源码的检查项：只数「字符串之外」的 #，写法、缩进、空格一概不管。 */
    "source-has-comment": function (c, ctx) {
      var min = c.min == null ? 1 : c.min;
      var ls = commentLines(ctx.code);
      var ok = ls.length >= min;
      return { ok: ok, saw: ok ? "检测到 " + ls.length + " 行给人看的注释（机器不看的那部分）"
        : "只找到 " + ls.length + " 行 # 注释，要求至少 " + min + " 行（引号里的 # 不算注释）" };
    }
  };
  /* 把字符串（含三引号、转义）整体抹掉，剩下才是真代码；然后数带 # 的行 */
  function commentLines(code) {
    var s = String(code || ""), out = "", i = 0;
    while (i < s.length) {
      var c = s.charAt(i);
      if (c === "'" || c === '"') {
        var triple = s.substr(i, 3) === c + c + c, d = triple ? c + c + c : c;
        i += d.length;
        while (i < s.length) {
          if (s.charAt(i) === "\\") { i += 2; continue; }
          if (s.substr(i, d.length) === d) { i += d.length; break; }
          i++;
        }
        out += " ";
        continue;
      }
      out += c; i++;
    }
    return out.split("\n").filter(function (l) { return l.indexOf("#") >= 0; });
  }
  function quote(s) { return "「" + String(s).replace(/\n/g, " ⏎ ") + "」"; }
  function firstErrLine(err) {
    var ls = String(err || "").split("\n").filter(Boolean);
    return ls.length ? ls[ls.length - 1] : "（无报错信息）";
  }
  function looseEq(v, want, ctx) {
    if (typeof v === "string" || typeof want === "string") return String(v) === String(want);
    if (v === RUN.NONE) return want === null;
    if (typeof v === "number" || typeof want === "number") {
      var n = v && v.k === "float" ? v.v : v;
      var w = want && want.k === "float" ? want.v : want;
      return Number(n) === Number(w);
    }
    return RUN.pyEq(v, want, ctx.env);
  }

  /* ---------- 主入口 ---------- */
  function runCode(exam, code, opts) {
    opts = opts || {};
    var res = RUN.run(code, {
      file: "main.py",
      stdin: (opts.stdin !== undefined ? opts.stdin : exam.stdin) || [],
      files: Object.assign({}, exam.files || {}, opts.files || {}),
      root: "/home/miao", cwd: "/home/miao",
      maxSteps: opts.maxSteps || 1200000,
      maxLoop: opts.maxLoop || 60000
    });
    return res;
  }

  function grade(exam, code, opts) {
    var res = runCode(exam, code, opts);
    var env = res.env;
    var ctx = {
      out: res.out, err: res.err, exit: res.exitCode, trace: res.trace,
      files: res.files, env: env, features: astFeatures(res.ast), code: code
    };
    var items = (exam.checks || []).map(function (c) {
      var fn = CHECKS[c.type];
      if (!fn) return { id: c.id || c.type, label: c.label, weight: c.weight || 0, ok: false, saw: "判分器不认识这种检查项：" + c.type };
      var r;
      try { r = fn(c, ctx); }
      catch (e) { r = { ok: false, saw: "这一项没法判定：" + (e.message || e) }; }
      return { id: c.id || c.type, label: c.label, weight: c.weight || 0, ok: !!r.ok, saw: r.saw };
    });
    var full = items.reduce(function (a, x) { return a + x.weight; }, 0);
    var got = items.reduce(function (a, x) { return a + (x.ok ? x.weight : 0); }, 0);
    var score = full ? Math.round(got * 100 / full) : 0;
    var passLine = exam.pass == null ? 60 : exam.pass;
    return {
      score: score, passLine: passLine, passed: score >= passLine,
      checks: items, out: res.out, err: res.err, exit: res.exitCode,
      trace: res.trace, files: res.files, features: ctx.features, ms: res.ms
    };
  }

  return {
    grade: grade, runCode: runCode, fold: fold, normText: normText, lines: lines,
    astFeatures: astFeatures, CHECKS: CHECKS, FEATURES: FEATURES, quote: quote
  };
});
