/* 喵站 · C++ 站内静态检查器（「编译」那颗按钮背后的东西）
 *
 * 先说清它是什么、不是什么：浏览器里跑不动真编译器（28 MB 的 WASM clang 会把「双击 index.html
 * 也能用」这条直接弄破，进考场的体积账也全废 —— 见 dev/tools/_scratch/wasm-cpp-调研.md），
 * 所以这颗按钮做的是**站内模拟编译**：查「这份代码能不能被编译器接受」里那些不用类型系统也
 * 判得出来的形状 —— 括号与引号闭合、两句话之间少分号、有没有 main、用了没搬进来的名字。
 * 报错行号可点（走 exam-ui.js 那套 tb-jump，和 Python 沙箱同一个抓手）。
 *
 * 三条规矩：
 *   1) 宁可漏报，不许误报。读者被一条假错挡住，比少一条真错更伤。所以分号那条按 token 走而不
 *      按行走 —— 按行判会把 `int main(){ println("hi"); return 0; }` 这种一行写完的写法冤枉成
 *      缺分号；控制头（if/for/while/switch 的括号）后面直接跟一句也合法，一并放过。
 *   2) 只读代码，一个字都不改；行号按「这段代码的第几行」返回，屏上行号由界面补题面偏移。
 *   3) 消息里带 <print> 这种尖括号，出 HTML 前必须转义 —— 不转义就被浏览器当标签吃掉。
 */
(function (root) {
  "use strict";
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function linesOf(s) { return String(s == null ? "" : s).replace(/\r/g, "").split("\n"); }
  function nlCount(s) { return (String(s).match(/\n/g) || []).length; }

  /* ---------- 逐字符扫：字符串 / 字符字面量 / 两种注释，同时用栈查括号配对 ---------- */
  var OPEN = { "(": 1, "[": 1, "{": 1 }, CLOSE = { ")": "(", "]": "[", "}": "{" };
  function scan(src) {
    var s = String(src == null ? "" : src), n = s.length, i = 0, line = 1;
    var code = "", stack = [], bad = [];
    while (i < n) {
      var c = s.charAt(i), d = s.charAt(i + 1);
      if (c === "\n") { line++; code += c; i++; continue; }
      /* 预处理那一行整行照抄进 code（后面查 #include 要用），但不参与括号栈 */
      if (c === "#" && /^\s*$/.test(s.slice(s.lastIndexOf("\n", i - 1) + 1, i))) {
        var e0 = s.indexOf("\n", i); e0 = e0 < 0 ? n : e0;
        code += s.slice(i, e0); i = e0; continue;
      }
      if (c === "/" && d === "/") { while (i < n && s.charAt(i) !== "\n") i++; continue; }
      if (c === "/" && d === "*") {
        var e = s.indexOf("*/", i + 2); e = e < 0 ? n : e + 2;
        for (; i < e; i++) if (s.charAt(i) === "\n") { line++; code += "\n"; }
        continue;
      }
      if (c === '"' || c === "'") {
        var q = c, j = i + 1, closed = false;
        while (j < n) {
          if (s.charAt(j) === "\\") { j += 2; continue; }
          if (s.charAt(j) === q) { closed = true; j++; break; }
          if (s.charAt(j) === "\n") break;                    /* 字面量不许跨行 */
          j++;
        }
        if (!closed) bad.push({ line: line, msg: (q === '"' ? "双引号" : "单引号") + "没关起来，编译器会一直往后找闭合" });
        code += s.slice(i, Math.min(j, n));
        for (var k = i; k < Math.min(j, n); k++) if (s.charAt(k) === "\n") line++;
        i = j; continue;
      }
      if (OPEN[c]) { stack.push({ c: c, line: line }); code += c; i++; continue; }
      if (CLOSE[c]) {
        var top = stack.pop();
        if (!top) bad.push({ line: line, msg: "多了一个 " + c + "，它左边没有等着被关掉的 " + CLOSE[c] });
        else if (top.c !== CLOSE[c]) bad.push({ line: top.line, msg: c + " 关不上第 " + top.line + " 行那个 " + top.c + " —— 两种括号不能互相顶" });
        code += c; i++; continue;
      }
      code += c; i++;
    }
    stack.forEach(function (x) { bad.push({ line: x.line, msg: "这里的 " + x.c + " 到文件尾都没关掉" }); });
    return { code: code, errors: bad };
  }

  /* ---------- 用了名字却没搬对应的头 ---------- */
  var NEED_INCLUDE = [
    [/std::(println|print)\b/, "print", "std::println / std::print"],
    [/std::(sort|find|count_if|transform|accumulate|for_each|reverse|min|max)\b/, "algorithm", "std::sort 那一族算法"],
    [/std::(sqrt|pow|sin|cos|fabs)\b/, "cmath", "std::sqrt 这类数学函数"],
    [/std::(stoi|to_string|stof)\b/, "string", "std::to_string / std::stoi"],
    [/std::vector\b/, "vector", "std::vector"],
    [/std::(map|set|unordered_map|unordered_set)\b/, "map", "std::map / std::set"],
    [/std::(make_unique|unique_ptr|shared_ptr|make_shared)\b/, "memory", "智能指针"],
    [/std::format\b/, "format", "std::format"],
    [/std::(views|ranges)\b/, "ranges", "std::views / std::ranges"],
    [/std::(cin|cout)\b/, "iostream", "std::cin / std::cout"]
  ];

  /* ---------- 两句话之间少了分号：按 token 走 ---------- */
  var RE_TOK = /[A-Za-z_][A-Za-z_0-9:]*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\d[\d.]*|\S/g;
  var START_STMT = /^(int|double|float|bool|char|void|auto|long|unsigned|short|return|std|string|vector|const|size_t|int8_t|wchar_t)$/;
  var CONTROL = { if: 1, for: 1, while: 1, switch: 1 };
  var TYPE_WORDS = "int double float bool char void auto long short unsigned signed size_t string vector map set pair tuple wchar_t int8_t int32_t int64_t uint64_t";
  function isKeywordish(t) {
    if (TYPE_WORDS.split(" ").indexOf(t) >= 0) return true;      /* 类型名打头或连着写（long long）都不算「上一句的结尾」 */
    return /^(if|else|for|while|do|switch|case|default|return|break|continue|class|struct|public|private|protected|template|typename|namespace|using|new|delete|try|catch|const|constexpr|static|virtual|override|true|false|nullptr|this|sizeof|and|or|not)$/.test(t);
  }
  function missingSemicolons(code) {
    var s = String(code == null ? "" : code).replace(/^\s*#.*$/gm, "");   /* 预处理行不参与 */
    var toks = [], re = new RegExp(RE_TOK.source, "g"), m, lastEnd = 0, line = 1;
    while ((m = re.exec(s))) {
      line += nlCount(s.slice(lastEnd, m.index));
      toks.push({ t: m[0], line: line });
      lastEnd = m.index + m[0].length;
    }
    /* 记着每个 ( 是不是控制头的括号：控制头后面直接跟一句是合法的，不该报缺分号 */
    var pstack = [];
    for (var i = 0; i < toks.length; i++) {
      var t = toks[i].t;
      if (t === "(") pstack.push({ ctrl: !!(toks[i - 1] && CONTROL[toks[i - 1].t]), name: toks[i - 1] && toks[i - 1].t, line: toks[i].line });
      else if (t === ")") {
        var open = pstack.pop();
        /* 跟着就是 { 的那对括号是「函数头 / 控制头」，不是表达式的结尾：
           `auto format(...) const {` 里 const 前面那个 ) 就被上一版当成少分号的元凶 */
        var next = toks[i + 1] && toks[i + 1].t;
        toks[i].ctrl = !!open && (open.ctrl || next === "{" || next === "const" || next === "override" || next === "->");
      }
    }
    var out = [], seen = {};
    for (var k = 1; k < toks.length; k++) {
      var prev = toks[k - 1].t, cur = toks[k].t;
      var endsExpr = (/^[A-Za-z_]\w*$|^\d|^"|^'$|^\]$/.test(prev) && !isKeywordish(prev)) ||
        (prev === ")" && !toks[k - 1].ctrl);
      if (!endsExpr || !START_STMT.test(cur)) continue;
      var key = toks[k - 1].line + "|" + cur;
      if (seen[key]) continue; seen[key] = 1;
      out.push({ line: toks[k - 1].line, msg: "这前后两句之间少了分号 ;（编译器会说 expected “;”）" });
    }
    return out;
  }

  /* ---------- 主入口 ----------
   * check(src, opts) → { problems, echo, lines, meta }
   *   opts.jumpHtml(n) 可选：给「第 N 行」那颗可点按钮的 HTML（由 exam-ui.js 提供） */
  function check(src, opts) {
    opts = opts || {};
    var s = String(src == null ? "" : src);
    var sc = scan(s), code = sc.code;
    var errs = sc.errors.slice();
    var hasBody = code.replace(/[#/*\s]/g, "") !== "";
    if (hasBody && !/\bmain\s*\(/.test(code)) {
      errs.push({ line: 1, msg: "这份文件里没有 main —— 程序没有入口，链接器会报 undefined reference to main" });
    }
    NEED_INCLUDE.forEach(function (row) {
      if (!row[0].test(code)) return;
      if (!new RegExp("#\\s*include\\s*<\\s*" + row[1] + "\\s*>").test(s)) {
        errs.push({ line: firstLineOf(s, row[0]), msg: "用了 " + row[2] + "，但没 #include <" + row[1] + ">" });
      }
    });
    if (hasBody) errs = errs.concat(missingSemicolons(code));
    errs.sort(function (a, b) { return (a.line || 1) - (b.line || 1); });
    var lines = errs.map(function (e) {
      return {
        cls: "term-err tb-final",
        html: esc("main.cpp:" + (e.line || 1) + ": error: " + e.msg) + (opts.jumpHtml ? " " + opts.jumpHtml(e.line || 1) : "")
      };
    });
    var echo = [{ text: "$ g++ -std=c++23 -Wall main.cpp -o main", cls: "term-cmd" }];
    if (!errs.length) {
      lines.push({
        cls: hasBody ? "term-out" : "term-dim",
        html: hasBody
          ? esc("模拟编译通过：括号闭合、入口齐全、用到的名字都搬进来了。（真编译还要过类型检查，这一步站内不做。）")
          : esc("文件还是空的 —— 先写几行再按编译。")
      });
    }
    return {
      problems: errs.length, echo: echo, lines: lines,
      meta: errs.length ? "[模拟编译结束 · " + errs.length + " 处错误]" : "[模拟编译结束 · 没发现可判的错误]"
    };
  }
  function firstLineOf(src, re) {
    var ls = linesOf(src);
    for (var i = 0; i < ls.length; i++) if (re.test(ls[i])) return i + 1;
    return 1;
  }

  root.MIAO_CPP_COMPILE = { check: check, scan: scan, linesOf: linesOf, esc: esc };
  if (typeof module === "object" && module.exports) module.exports = root.MIAO_CPP_COMPILE;
})(typeof window !== "undefined" ? window : globalThis);
