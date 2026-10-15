/* 喵站 · C++ 子集模拟器（「运行」那颗按钮背后的东西）
 *
 * 它是什么：站内自己写的一台小机器，把读者的那份 C++ 代码**真的跑起来**给他看输出 ——
 * 和 Python 那门课的沙箱（py-engine.js / py-runtime.js）同一个路子。为什么不塞真编译器：
 * 浏览器里的 WASM clang 要 28 MB、且 file:// 双击打开这条会当场破功
 * （量与结论见 dev/tools/_scratch/wasm-cpp-调研.md）。教学站的第一约束是「拿到手就能用」。
 *
 * 支持面（v1，按语料频率定的，不是拍脑袋）：
 *   声明（int/double/bool/char/auto/std::string/std::vector/std::map/数组式初始化列表）、
 *   算术与比较与逻辑、三目、自增自减、复合赋值、if/else、for、范围 for、while、do-while、
 *   switch、break/continue/return、自己写的函数（值传参与 const 引用传参）、lambda（含捕获）、
 *   std::println / print / format 的 {} 占位与常见宽度精度、std::cin >> 、
 *   string 的 + == < length size substr，vector 的 push_back size [] at front back begin end，
 *   map 的 [k] 与 size，std::sort/find/count_if/for_each/transform/accumulate/min/max/abs/sqrt/pow，
 *   指针与取址（&x / *p / p->m）按引用语义近似实现。
 * 不支持的会**当场明说**「第 N 行：这种写法站内模拟器还没学会（class 不在 v1 的支持面里）」，
 * 而不是硬跑出个错的东西骗人。这一句是这颗按钮的底线：宁可说不会，不许算错。
 * 死循环：与 Python 沙箱同一口径，步数上限掐断。
 */
(function (root) {
  "use strict";

  var MAX_STEPS = 4000000;

  /* ================= 词法 ================= */
  var RE_NUM = /^\d[\d']*(?:\.\d[\d']*)?(?:[eE][+-]?\d+)?[uUlLfF]*|^\.\d[\d']*(?:[eE][+-]?\d+)?/;
  var RE_ID = /^[A-Za-z_]\w*/;
  var OPS = ["<<=", ">>=", "<<", ">>", "<=", ">=", "==", "!=", "&&", "||", "++", "--",
    "+=", "-=", "*=", "/=", "%=", "->", "::", "+", "-", "*", "/", "%", "<", ">", "=", "!",
    "(", ")", "{", "}", "[", "]", ";", ",", ".", "&", "|", "^", "~", "?", ":", ""];
  function tokenize(src) {
    var s = String(src == null ? "" : src), i = 0, line = 1, out = [];
    function push(t, kind) { out.push({ t: t, k: kind || "op", line: line }); }
    while (i < s.length) {
      var c = s.charAt(i);
      if (c === "\n") { i++; line++; continue; }
      if (c === " " || c === "\t" || c === "\r") { i++; continue; }
      if (c === "/" && s.charAt(i + 1) === "/") { while (i < s.length && s.charAt(i) !== "\n") i++; continue; }
      if (c === "/" && s.charAt(i + 1) === "*") {
        var e = s.indexOf("*/", i + 2); e = e < 0 ? s.length : e + 2;
        line += (s.slice(i, e).match(/\n/g) || []).length; i = e; continue;
      }
      if (c === "#") {                                      /* 预处理：整行吃掉，登记一下给 include 检查用 */
        var e2 = s.indexOf("\n", i); e2 = e2 < 0 ? s.length : e2;
        push(s.slice(i, e2).trim(), "pp"); i = e2; continue;
      }
      var rest = s.slice(i);
      var mn = RE_NUM.exec(rest);
      if (mn) { push(mn[0].replace(/'/g, ""), "num"); i += mn[0].length; continue; }
      if (c === '"' || c === "'") {
        var q = c, j = i + 1, buf = "";
        while (j < s.length) {
          if (s.charAt(j) === "\\") {
            var nx = s.charAt(j + 1);
            buf += nx === "n" ? "\n" : nx === "t" ? "\t" : nx === "0" ? "\0" : nx;
            j += 2; continue;
          }
          if (s.charAt(j) === q) { j++; break; }
          if (s.charAt(j) === "\n") { line++; }
          buf += s.charAt(j); j++;
        }
        push(buf, q === '"' ? "str" : "chr"); i = j; continue;
      }
      var mi = RE_ID.exec(rest);
      if (mi) { push(mi[0], "id"); i += mi[0].length; continue; }
      var op = OPS.filter(function (o) { return o && rest.indexOf(o, 0) === 0; })
        .sort(function (a, b) { return b.length - a.length; })[0];
      if (op) { push(op, "op"); i += op.length; continue; }
      i++;                                                  /* 认不出的字符（中文标点之类）跳过，别拿它当代码 */
    }
    return out;
  }

  /* ================= 语法 ================= */
  function SimError(msg, line) { var e = new Error(msg); e.simLine = line; e.simMsg = msg; return e; }
  function Parser(toks) {
    this.t = toks; this.i = 0;
  }
  var P = Parser.prototype;
  P.peek = function (k) { return this.t[this.i + (k || 0)]; };
  /* 只有词性是 op 的 token 才是运算符：字符串 "!" 也算不上一个「!」 */
  P.peekOp = function (k) { var t = this.t[this.i + (k || 0)]; return (t && t.k === "op") ? t : null; };
  P.next = function () { return this.t[this.i++]; };
  P.at = function (s) { var x = this.peek(); return !!x && x.t === s && x.k !== "str" && x.k !== "chr"; };
  P.eat = function (s) { if (this.at(s)) { return this.next(); } return null; };
  P.expect = function (s) {
    if (!this.at(s)) throw SimError("编译器在这里期待 " + s + "，实际看到的是 " +
      (this.peek() ? "「" + this.peek().t + "」" : "文件尾"), this.peek() ? this.peek().line : 1);
    return this.next();
  };
  function isIdTok(tk) { return tk && tk.k === "id"; }

  /* 类型名：内置类型 / std::X<...> / 用户写过的名字（宽松认，交给运行期判） */
  var BUILTIN_T = { int: 1, double: 1, float: 1, bool: 1, char: 1, wchar_t: 1, void: 1, auto: 1, long: 1, short: 1, unsigned: 1, signed: 1, size_t: 1, int8_t: 1, int32_t: 1, int64_t: 1, uint64_t: 1 };
  function tokIsType(p) {
    var tk = p.peek();
    if (!isIdTok(tk)) return false;
    if (BUILTIN_T[tk.t] || MOD_WORDS[tk.t]) return true;
    if (tk.t === "std") return true;
    if (/^[A-Z]/.test(tk.t)) return true;
    return !!p.typeNames[tk.t];
  }
  var CONTROL = { if: 1, for: 1, while: 1, switch: 1 };
  /* 这一句到底是「声明」还是「一条表达式」？只按「类型名后面跟着一个标识符」判：
     std::println(...) 与 std::sort(...) 里那个 std 会被 tokIsType 认成类型，光看开头分不开 ——
     上一版就是把它当声明读，剩下的 ( 与 , 全都错位。这里试读一遍再退回去，不改状态。 */
  /* 控制头的四个关键字：判断「类型名后面那个标识符是不是其实是个 if/for」用得上 */
  var CONTROL = { if: 1, for: 1, while: 1, switch: 1, do: 1, else: 1, return: 1 };
  P.looksLikeDecl = function () {
    var save = this.i;
    try {
      if (!tokIsType(this)) return false;
      readType(this);
      var tk = this.peek();
      return !!(tk && tk.k === "id" && !CONTROL[tk.t]);
    } catch (e) {
      if (typeof process !== "undefined" && process.env.CPP_SIM_DEBUG) console.log("[looksLikeDecl 抛错] " + e.message);
      return false;
    } finally {
      this.i = save;
    }
  };

  /* 读一个类型（含 std::vector<int> 这种带模板参数的、const、引用与指针星号） */
  var MOD_WORDS = { const: 1, constexpr: 1, unsigned: 1, signed: 1, long: 1, short: 1, volatile: 1, mutable: 1 };
  function readType(p) {
    var base = "", depth = 0;
    readType.lastRef = false; readType.lastPtr = false;
    var mods = [];
    while (p.peek() && p.peek().k === "id" && MOD_WORDS[p.peek().t]) mods.push(p.next().t);
    if (mods.length && !p.peek()) return mods[mods.length - 1];
    var tk = p.peek();
    if (isIdTok(tk)) {
      base = tk.t; p.next();
      if (base === "std" && p.at("::")) { p.next(); base = "std::" + (p.peek() && p.peek().t); if (isIdTok(p.peek())) p.next(); }
      else if (mods.length && (mods[mods.length - 1] === "long" || mods[mods.length - 1] === "short" ||
        mods[mods.length - 1] === "unsigned" || mods[mods.length - 1] === "signed")) {
        base = mods.join(" ");                       /* long long、unsigned int 这种：修饰词本身就是类型 */
        mods = [];
      }
      if (p.at("<")) {
        depth = 1; p.next(); var inner = [];
        while (p.peek() && depth) {
          if (p.peek().t === "<") depth++;
          else if (p.peek().t === ">") { depth--; if (!depth) { p.next(); break; } }
          else if (p.peek().t === ">>") { depth -= 2; if (!depth) { p.next(); break; } p.next(); continue; }
          inner.push(p.next().t);
        }
        base += "<" + inner.join(" ") + ">";
      }
    }
    if (!base && mods.length) base = mods[mods.length - 1];   /* const int x：const 吃完剩下 int 会被下面当名字 */
    while (p.at("*") || p.at("&")) {
      if (p.at("&")) readType.lastRef = true; else readType.lastPtr = true;
      p.next();
    }
    readType.lastRef = readType.lastRef || false;
    readType.lastPtr = readType.lastPtr || false;
    return base || "auto";
  }

  /* ---------- 表达式：递归下降，优先级一层一层来 ---------- */
  P.expr = function () { return this.assign(); };
  P.assign = function () {
    var left = this.ternary();
    var op = this.peekOp();
    if (op && ["=", "+=", "-=", "*=", "/=", "%="].indexOf(op.t) >= 0) {
      this.next();
      return { k: "assign", op: op.t, to: left, from: this.assign(), line: op.line };
    }
    return left;
  };
  P.ternary = function () {
    var c = this.bin(0);
    var tq = this.peekOp();
    if (tq && tq.t === "?") { this.next(); var a = this.assign(); this.expect(":"); var b = this.ternary(); return { k: "tern", c: c, a: a, b: b }; }
    return c;
  };
  /* 优先级从疏到密：|| > && > == > 关系 > 加减 > 移位 > 乘除（与 C++ 同序），
     少了「移位」这一层，std::cin >> n 里那个 >> 谁都不吃，整句就散成一地 token。 */
  var LEVELS = [["||"], ["&&"], ["==", "!="], ["<=", ">=", "<", ">"], ["+", "-"], ["<<", ">>"], ["*", "/", "%"]];
  P.bin = function (lv) {
    if (lv >= LEVELS.length) return this.unary();
    var left = this.bin(lv + 1);
    for (; ;) {
      var op = this.peekOp();
      if (!op || LEVELS[lv].indexOf(op.t) < 0) return left;
      this.next();
      left = { k: "bin", op: op.t, a: left, b: this.bin(lv + 1), line: op.line };
    }
  };
  P.unary = function () {
    var head = this.peek();
    if (head && head.t === "static_cast" && this.peek(1) && this.peek(1).t === "<") return this.staticCast();
    var op = this.peekOp();
    if (op && ["-", "+", "!", "~", "*", "&"].indexOf(op.t) >= 0) {
      this.next();
      return { k: "un", op: op.t, e: this.unary(), line: op.line };
    }
    if (op && (op.t === "++" || op.t === "--")) { this.next(); return { k: "pre", op: op.t, e: this.unary() }; }
    return this.postfix(this.primary());
  };
  /* 「< 类型, 类型 > 后面紧跟 ( 或 { 或 ; ）」才当模板实参跳掉 —— 不然 a < b 这种比较会被吃掉 */
  function looksLikeTemplateArgs(p) {
    let i = p.i + 1, depth = 1, seen = 0;
    while (i < p.t.length && depth > 0 && seen++ < 14) {
      const x = p.t[i];
      if (x.t === "<") depth++;
      else if (x.t === ">") { depth--; if (!depth) { const nx = p.t[i + 1]; return !!(nx && ["(", "{", ";", ")", ",", "]", "="].indexOf(nx.t) >= 0); } }
      else if (x.t === ">>") { depth -= 2; if (depth <= 0) { const nx = p.t[i + 1]; return !!(nx && ["(", "{", ";", ")", ",", "]", "="].indexOf(nx.t) >= 0); } }
      else if (x.t === "(" || x.t === ";" || x.t === "}" || x.t === ":") return false;
      i++;
    }
    return false;
  }
  function skipTemplateArgs(p) {
    let depth = 1;
    p.next();
    while (p.peek() && depth > 0) {
      const x = p.next();
      if (x.t === "<") depth++;
      else if (x.t === ">") depth--;
      else if (x.t === ">>") depth -= 2;
    }
  }
  P.staticCast = function () {
    this.next(); this.expect("<"); var t = readType(this); this.expect(">"); this.expect("(");
    var e = this.expr(); this.expect(")");
    return { k: "cast", to: t, e: e };
  };
  P.postfix = function (node) {
    for (; ;) {
      var op = this.peekOp();
      if (!op) return node;
      if (op.t === "(") { this.next(); var args = this.argList(); node = { k: "call", fn: node, args: args, line: op.line }; continue; }
      /* 自由函数的模板实参 make_unique<int>(5) / vector<char>{3}：先跳过头参数那一截再按普通调用走 */
      if (op.t === "<" && looksLikeTemplateArgs(this)) { skipTemplateArgs(this); continue; }
      if (op.t === "[") {
        this.next();
        if (this.at("]")) { this.next(); node = { k: "initlist", items: this.braceItems(), line: op.line }; continue; }
        var idx = this.expr(); this.expect("]");
        node = { k: "index", e: node, i: idx, line: op.line }; continue;
      }
      if (op.t === "." || op.t === "->") { this.next(); var m = this.next(); node = { k: "member", e: node, name: m && m.t, line: op.line }; continue; }
      if (op.t === "::") { this.next(); var q = this.next(); node = { k: "qual", e: node, name: q && q.t }; continue; }
      if (op.t === "++" || op.t === "--") { this.next(); node = { k: "post", op: op.t, e: node }; continue; }
      return node;
    }
  };
  P.argList = function () {
    var out = [];
    if (this.at(")")) { this.next(); return out; }
    for (; ;) {
      var before = this.i;
      out.push(this.expr());
      if (this.i === before) throw SimError("括号里这一串读不下去：" + (this.peek() ? this.peek().t : "文件尾"), this.peek() ? this.peek().line : 1);
      if (this.eat(",")) continue;
      this.expect(")");
      return out;
    }
  };
  P.braceItems = function () {
    var out = [];
    if (this.at("}")) { this.next(); return out; }
    for (; ;) {
      if (this.at("}")) { this.next(); return out; }
      out.push(this.assign());
      if (this.eat(",")) continue;
      if (this.at("}")) { this.next(); return out; }
      throw SimError("初始化列表里看不懂的东西：" + (this.peek() ? this.peek().t : "文件尾"), this.peek() ? this.peek().line : 1);
    }
  };
  P.primary = function () {
    var tk = this.peek();
    if (!tk) throw SimError("代码在文件尾突然断了", 1);
    if (tk.k === "num") {
      this.next();
      var isIntLit = tk.t.indexOf(".") < 0 && !/[eEfF]$/.test(tk.t) && tk.t.indexOf("e") < 0 && tk.t.indexOf("E") < 0;
      return { k: "lit", v: "num", x: Number(tk.t.replace(/[uUlLfF]$/, "")), isInt: isIntLit };
    }
    if (tk.k === "str") { this.next(); return { k: "lit", v: "str", x: tk.t, line: tk.line }; }
    if (tk.k === "chr") { this.next(); return { k: "lit", v: "chr", x: tk.t }; }
    if (tk.t === "(") { this.next(); var e = this.expr(); this.expect(")"); return e; }
    if (tk.t === "{") { this.next(); var items = this.braceItems(); return { k: "initlist", items: items, line: tk.line }; }
    if (tk.t === "[") { return this.lambda(); }
    if (isIdTok(tk)) {
      this.next();
      if (tk.t === "true") return { k: "lit", v: "bool", x: true };
      if (tk.t === "false") return { k: "lit", v: "bool", x: false };
      if (tk.t === "nullptr") return { k: "lit", v: "ptr", x: null };
      if (tk.t === "sizeof") {
        if (this.eat("(")) {
          if (tokIsType(this)) {
            var st1 = readType(this); this.expect(")");
            return { k: "sizeof", of: st1 };
          }
          var se = this.expr(); this.expect(")");
          return { k: "sizeof", e: se };
        }
        var st2 = readType(this);
        return { k: "sizeof", of: st2 };
      }
      if (tk.t === "new") { var t = readType(this); var init = this.at("{") ? (this.next(), { k: "initlist", items: this.braceItems() }) : null; return { k: "new", of: t, init: init }; }
      return { k: "var", name: tk.t, line: tk.line };
    }
    throw SimError("这种写法站内模拟器还没读懂：" + tk.t, tk.line);
  };
  P.lambda = function () {
    var line = this.peek().line;
    this.expect("[");
    var caps = [];
    if (!this.at("]")) {
      for (; ;) {
        var t = this.next();
        if (t.t === "=" || t.t === "&") { caps.push({ all: t.t }); if (!this.at("]")) { if (this.peek().t === ",") this.next(); continue; } break; }
        caps.push({ name: t.t, ref: this.at("&") ? (this.next(), true) : false });
        if (this.eat(",")) continue; break;
      }
    }
    this.expect("]");
    var params = [];
    if (this.eat("(")) { while (!this.at(")")) { readType(this); var nm = this.next(); params.push(nm.t); if (!this.eat(",")) break; } this.expect(")"); }
    var ret = null;
    if (this.eat("->")) ret = readType(this);
    if (this.at("{")) { this.next(); var body = this.blockStmts(); return { k: "lambda", caps: caps, params: params, body: body, line: line }; }
    var e = this.expr();
    return { k: "lambda", caps: caps, params: params, expr: e, line: line };
  };

  /* ---------- 语句 ---------- */
  P.blockStmts = function () {
    var out = [];
    for (; ;) {
      if (this.at("}")) { this.next(); return out; }
      if (!this.peek()) return out;
      var before = this.i;
      var st = this.statement();
      if (this.i === before) throw SimError("解析在这里一步都没往前走（卡在 " + (this.peek() ? this.peek().t : "文件尾") + "）", this.peek() ? this.peek().line : 1);
      if (st) out.push(st);
    }
  };
  P.declForInit = function () {
    var q = this.declStmt(true);
    return { k: "decl", type: q.type, names: q.names };
  };
  P.statement = function () {
    var tk = this.peek();
    if (!tk) return null;
    if (tk.k === "pp") { this.next(); return { k: "empty" }; }
    if (tk.t === "{") { this.next(); return { k: "block", body: this.blockStmts(), line: tk.line }; }
    if (tk.t === "if") { return this.ifStmt(); }
    if (tk.t === "for") { return this.forStmt(); }
    if (tk.t === "while") { this.next(); this.expect("("); var c = this.expr(); this.expect(")"); var b = this.statement(); return { k: "while", c: c, body: b, line: tk.line }; }
    if (tk.t === "do") { this.next(); var b2 = this.statement(); this.expect("while"); this.expect("("); var c2 = this.expr(); this.expect(")"); this.eat(";"); return { k: "do", body: b2, c: c2, line: tk.line }; }
    if (tk.t === "switch") { return this.switchStmt(); }
    if (tk.t === "break") { this.next(); this.eat(";"); return { k: "break" }; }
    if (tk.t === "continue") { this.next(); this.eat(";"); return { k: "continue" }; }
    if (tk.t === "return") { this.next(); var e = this.at(";") ? null : this.expr(); this.eat(";"); return { k: "return", e: e, line: tk.line }; }
    if (tk.t === "using" || tk.t === "namespace" || tk.t === "template" || tk.t === "class" || tk.t === "struct") {
      return this.declOrSkip(tk);
    }
    if (this.looksLikeDecl()) {
      var d = this.declStmt();
      if (d.k === "fndef" || d.k === "fndecl" || d.k === "struct") return d;
      return { k: "decl", line: tk.line, type: d.type, names: d.names };
    }
    var e2 = this.expr(); this.eat(";");
    return { k: "expr", e: e2, line: tk.line };
  };
  P.declOrSkip = function (tk) {
    /* class / struct / template：v1 不跑，明确说不 supported —— 但空 struct 声明（POD）先支持字段 */
    if (tk.t === "class" || tk.t === "struct") {
      this.next();
      var nm = this.peek();
      if (nm && isIdTok(nm) && this.peek(1) && (this.peek(1).t === "{" || this.peek(1).t === ";")) {
        this.next();
        if (this.eat(";")) return { k: "empty" };
        return this.structBody(nm.t, tk);
      }
      throw SimError("这种写法站内模拟器还没学会（class / struct 的这份形状还没进支持面）", tk.line);
    }
    if (tk.t === "namespace") { this.next(); var nn = this.next(); if (this.eat(";")) return { k: "empty" }; this.expect("{"); var body = this.blockStmts(); return { k: "ns", name: nn && nn.t, body: body }; }
    if (tk.t === "using") {                                    /* using namespace std; 直接当没写过：std:: 前缀两边都认 */
      var guard = 0;
      while (this.peek() && this.peek().t !== ";" && guard++ < 12) this.next();
      this.eat(";");
      return { k: "empty" };
    }
    throw SimError("这种写法站内模拟器还没学会（模板 / 别名为型这类声明还没进支持面）", tk.line);
  };
  P.structBody = function (name, tk) {
    this.expect("{");
    var fields = [];
    this.typeNames[name] = true;
    while (!this.at("}")) {
      if (!this.peek()) throw SimError(name + " 的花括号没关掉", tk.line);
      var t = readType(this);
      for (; ;) {
        var id = this.next(); if (!id) break;
        fields.push({ name: id.t, type: t });
        if (this.eat("=")) { this.primary(); }
        if (!this.eat(",")) break;
      }
      this.eat(";");
      if (this.at("(") || this.at("{")) { this.skipBalanced(); }
    }
    this.expect("}"); this.eat(";");
    return { k: "struct", name: name, fields: fields, line: tk.line };
  };
  P.skipBalanced = function () {                        /* 成员函数体：v1 不跑，跳过一整对花括号 */
    if (this.at("(")) { var d1 = 0; for (; ;) { var t = this.next(); if (!t) break; if (t.t === "(") d1++; else if (t.t === ")") { d1--; if (!d1) break; } } }
    if (this.at("{")) { var d2 = 0; for (; ;) { var u = this.next(); if (!u) break; if (u.t === "{") d2++; else if (u.t === "}") { d2--; if (!d2) break; } } }
    this.eat(";");
  };
  P.ifStmt = function () {
    var line = this.peek().line; this.next(); this.expect("(");
    var hasInit = false, init = null;
    if (this.looksLikeDecl() || this.at(";")) {
      hasInit = true;
      init = this.at(";") ? null : this.declStmt(true);
      if (init) { this.eat(";"); }
    }
    var cond = this.expr(); this.expect(")");
    var thenB = this.statement();
    var elseB = this.at("else") ? (this.next(), this.statement()) : null;
    return { k: "if", init: init, c: cond, then: thenB, els: elseB, line: line };
  };
  P.forStmt = function () {
    var line = this.peek().line; this.next(); this.expect("(");
    var init = null, semiDone = false;
    if (!this.at(";")) {
      init = this.looksLikeDecl() ? this.declForInit() : { k: "expr", e: this.expr() };
      if (this.at(":")) return this.rangeFor(line, init);     /* 范围 for：这里轮到冒号，不是分号 */
      if (this.at(";")) { this.next(); semiDone = true; }
    }
    if (!semiDone) this.expect(";");
    var cond = this.at(";") ? null : this.expr(); this.expect(";");
    var step = this.at(")") ? null : this.expr(); this.expect(")");
    var body = this.statement();
    return { k: "for", init: init, cond: cond, step: step, body: body, line: line };
  };
  P.rangeFor = function (line, decl) {
    this.next();                                            /* 那个冒号 */
    var iter = this.expr(); this.expect(")");
    var body = this.statement();
    var vname = (decl.names && decl.names[0] && decl.names[0].name) || (decl.e && decl.e.name) || null;
    return { k: "range", decl: decl.node, vname: vname, iter: iter, body: body, line: line };
  };
  P.switchStmt = function () {
    var line = this.peek().line; this.next(); this.expect("("); var e = this.expr(); this.expect(")");
    this.expect("{");
    var cases = [];
    while (!this.at("}")) {
      var t = this.peek();
      if (!t) throw SimError("switch 的花括号没关掉", line);
      if (t.t === "case") { this.next(); var v = this.assign(); this.expect(":"); cases.push({ v: v, body: [] }); continue; }
      if (t.t === "default") { this.next(); this.expect(":"); cases.push({ def: true, body: [] }); continue; }
      if (!cases.length) throw SimError("switch 里的这一句没有 case 接着它", t.line);
      cases[cases.length - 1].body.push(this.statement());
    }
    this.expect("}");
    return { k: "switch", e: e, cases: cases, line: line };
  };
  P.declStmt = function (noSemi) {
    var type = readType(this);
    var names = [];
    for (; ;) {
      var id = this.peek();
      if (!id || !isIdTok(id)) break;
      this.next();
      var item = { name: id.t, init: null, arr: false };
      if (this.eat("(")) {                                  /* 函数定义：type name(...) { body } */
        var params = [];
        while (!this.at(")")) {
          var pBefore = this.i;
          var pt = readType(this);
          var wasRef = readType.lastRef, wasPtr = readType.lastPtr;
          var pn = this.peek() && isIdTok(this.peek()) ? this.next().t : "_";
          if (this.at(",")) this.next();
          params.push({ name: pn, type: pt, ref: wasRef, ptr: wasPtr });
          if (this.i === pBefore) throw SimError("参数表读不下去：" + (this.peek() ? this.peek().t : "文件尾"), this.peek() ? this.peek().line : 1);
        }
        this.expect(")");
        var isProto = !this.at("{");
        var body = null;
        if (!isProto) { this.next(); body = this.blockStmts(); }
        this.typeNames[id.t] = true;
        if (isProto) { this.eat(";"); return { k: "fndecl", proto: true, name: id.t, params: params }; }
        return { k: "fndef", name: id.t, params: params, body: body, ret: type, line: id.line };
      }
      if (this.at("[")) { this.next(); if (!this.at("]")) this.expr(); this.expect("]"); item.arr = true; }
      if (this.eat("=")) item.init = this.assign();
      else if (this.at("{") && !noSemi) { var lb = this.next(); item.init = { k: "initlist", items: this.braceItems() }; }
      names.push(item);
      if (this.eat(",")) continue;
      break;
    }
    if (!noSemi) this.eat(";");
    return { k: "decl", type: type, names: names };
  };
  P.tu = function () {                                     /* 整个翻译单元 */
    this.typeNames = {};
    var out = [];
    while (this.peek()) {
      var before = this.i;
      var st = this.statement();
      if (this.i === before) throw SimError("解析在这里一步都没往前走（卡在 " + (this.peek() ? this.peek().t : "文件尾") + "）", this.peek() ? this.peek().line : 1);
      if (st) out.push(st);
    }
    return out;
  };

  /* ================= 运行期 ================= */
  function V(kind, v, isInt) { return { kind: kind, v: v, isInt: !!isInt }; }
  function num(n, isInt) { return V("num", n, isInt === undefined ? Number.isInteger(n) : !!isInt); }
  function intNum(n) { return V("num", Math.trunc(n), true); }
  var TE = typeof TextEncoder !== "undefined" ? new TextEncoder() : null;
  function byteLen(s) { return TE ? TE.encode(String(s)).length : String(s).length; }
  function byteSlice(s, from, count) {
    if (!TE) return String(s).substr(from, count);
    var b = TE.encode(String(s)), part = b.subarray(from, from + count);
    /* 切在半个汉字上时 TextDecoder 会补 U+FFFD，与真编译器留下的碎字节不同 —— 教学上宁可给整字 */
    try { return new TextDecoder("utf-8", { fatal: false }).decode(part); } catch (e) { return String(s).substr(from, count); }
  }
  function str(s) { return V("str", String(s)); }
  function bool(b) { return V("bool", !!b); }
  function isNum(x) { return x && (x.kind === "num" || x.kind === "bool"); }
  function numOf(x) { return x.kind === "bool" ? (x.v ? 1 : 0) : x.v; }
  function toDisplay(x) {
    if (!x) return "";
    if (x.kind === "str") return x.v;
    if (x.kind === "chr") return x.v;
    if (x.kind === "bool") return x.v ? "true" : "false";
    if (x.kind === "num") {
      var n = x.v;
      if (Number.isInteger(n) && Math.abs(n) < 1e15) return String(n);
      return String(n);
    }
    if (x.kind === "vec") return "[" + x.v.map(toDisplay).join(", ") + "]";
    if (x.kind === "map") return "{" + x.v.map(function (kv) { return kv[0] + ": " + toDisplay(kv[1]); }).join(", ") + "}";
    if (x.kind === "ptr") return x.v ? "0x..." : "nullptr";
    if (x.kind === "fn") return "<function>";
    if (x.kind === "none" || x.v === undefined) return "";
    return String(x.v);
  }

  function Interp(opts) { this.out = ""; this.stdin = (opts && opts.stdin || []).slice(); this.steps = 0; this.fns = {}; this.structs = {}; }
  var I = Interp.prototype;
  I.tick = function (line) {
    if (++this.steps > MAX_STEPS) throw SimError("循环转了太多趟（" + MAX_STEPS + " 步）被掐断了 —— 检查条件里那个变量是不是根本没往结束的方向走", line);
  };
  I.newScope = function (parent) { return { p: parent, d: {}, ty: {} }; };
  I.find = function (sc, name) {
    var s = sc;
    while (s) { if (Object.prototype.hasOwnProperty.call(s.d, name)) return s.d[name]; s = s.p; }
    return null;
  };
  I.typeOf = function (sc, name) {
    var s = sc;
    while (s) { if (s.ty && s.ty[name]) return s.ty[name]; s = s.p; }
    return null;
  };
  I.set = function (sc, name, val) {
    var s = sc;
    while (s) { if (Object.prototype.hasOwnProperty.call(s.d, name)) { s.d[name] = coerce(s.ty && s.ty[name], val); return; } s = s.p; }
    sc.d[name] = val;
  };
  /* 强类型是这两门课的头几课：int 盒装进 3.7 要砍尾巴，不是四舍五入，也不是把盒子换成 double。
     声明时那一次和之后每一次赋值都走这同一条（否则「age = 3.7 之后 age 是几」在站内和真编译器两套话）。 */
  function baseType(t) { return String(t == null ? "" : t).replace(/\s+/g, "").replace(/<.*$/, ""); }
  function coerce(type, v) {
    if (!type || v === null || v === undefined) return v;
    var t = String(type), bt = baseType(t);
    if (t === "int" || t === "long" || t === "unsigned" || t === "size_t" || t === "short" ||
      t === "int8_t" || t === "int32_t" || t === "int64_t" || t === "uint64_t") {
      if (v.kind === "bool") return num(v.v ? 1 : 0, true);
      if (v.kind === "num") return intNum(v.v);
      if (v.kind === "chr") return num(v.v.charCodeAt(0) || 0, true);
      return v;
    }
    if (t === "double" || t === "float") return v.kind === "bool" ? num(v.v ? 1 : 0, true) : num(numOf(v), false);
    if (t === "bool") return bool(truth(v));
    if (t === "char") return V("chr", v.kind === "str" ? String(v.v).charAt(0) : v.kind === "chr" ? v.v : String.fromCharCode(numOf(v)));
    if (bt === "std::string" || bt === "string" || bt === "std::string_view") return v.kind === "str" ? v : str(toDisplay(v));
    return v;
  }

  I.run = function (ast) {
    var top = this.newScope(null);
    this.declareFns(ast, top);
    for (var i = 0; i < ast.length; i++) {
      var st = ast[i];
      if (st.k === "fndef") continue;                       /* 函数体在被喊的时候才跑 */
      if (st.k === "struct") { this.structs[st.name] = st; continue; }
      if (st.k === "ns") { this.exec(st.body, top); continue; }
      this.exec(st, top);
    }
    var m = top.d["main"] || this.fns["main"];
    if (!m) throw SimError("这份文件里没有 main —— 程序没有入口");
    this.call(m, [], top);
    return this.out;
  };
  I.declareFns = function (list, scope) {
    var self = this;
    list.forEach(function (st) {
      if (st.k === "fndef") self.fns[st.name] = { params: st.params, body: st.body, ret: st.ret, scope: scope, name: st.name };
      if (st.k === "ns") self.declareFns(st.body, scope);
      if (st.k === "decl") (st.names || []).forEach(function () { });
    });
  };
  I.exec = function (st, sc) {
    if (!st) return null;
    this.tick(st.line || 1);
    switch (st.k) {
      case "empty": return null;
      case "fndecl": return null;                    /* 只有原型没有体：认这个名字就够了，喊的时候才找实现 */
      case "block": {
        var inner = this.newScope(sc);
        var body = st.body || [];
        for (var i = 0; i < body.length; i++) {
          var r = this.exec(body[i], inner);
          if (r && (r.__break || r.__continue || r.__return)) return r;
        }
        return null;
      }
      case "decl": return this.doDecl(st, sc);
      case "expr": this.eval(st.e, sc); return null;
      case "if": {
        var guard = this.newScope(sc);
        if (st.init) this.exec(st.init, guard);
        if (truth(this.eval(st.c, guard))) { var a = this.exec(st.then, guard); return a; }
        if (st.els) return this.exec(st.els, guard);
        return null;
      }
      case "for": {
        var loop = this.newScope(sc);
        if (st.init) this.exec(st.init, loop);
        for (; ;) {
          this.tick(st.line || 1);
          if (st.cond && !truth(this.eval(st.cond, loop))) break;
          var r1 = this.exec(st.body, loop);
          if (r1 && r1.__break) break;
          if (r1 && r1.__return) return r1;
          if (st.step) this.eval(st.step, loop);
        }
        return null;
      }
      case "range": {
        var it = this.eval(st.iter, sc);
        var items = rangeItems(it);
        for (var k = 0; k < items.length; k++) {
          var loop2 = this.newScope(sc);
          var val = items[k];
          var nm = st.vname || (st.decl && st.decl.names && st.decl.names[0] && st.decl.names[0].name);
          if (!nm) throw SimError("范围 for 里没认出循环变量的名字", st.line || 1);
          loop2.d[nm] = val;
          var r2 = this.exec(st.body, loop2);
          if (r2 && r2.__break) break;
          if (r2 && r2.__return) return r2;
        }
        return null;
      }
      case "while": {
        for (; ;) {
          this.tick(st.line || 1);
          if (!truth(this.eval(st.c, sc))) break;
          var r3 = this.exec(st.body, sc);
          if (r3 && r3.__break) break;
          if (r3 && r3.__return) return r3;
        }
        return null;
      }
      case "do": {
        for (; ;) {
          this.tick(st.line || 1);
          var r4 = this.exec(st.body, sc);
          if (r4 && r4.__break) break;
          if (r4 && r4.__return) return r4;
          if (!truth(this.eval(st.c, sc))) break;
        }
        return null;
      }
      case "switch": {
        var v = this.eval(st.e, sc), hit = -1;
        for (var c = 0; c < st.cases.length; c++) {
          if (st.cases[c].def) { if (hit < 0) hit = c; continue; }
          if (eqv(v, this.eval(st.cases[c].v, sc))) { hit = c; break; }
        }
        if (hit < 0) return null;
        var sw = this.newScope(sc);
        for (var n = hit; n < st.cases.length; n++) {
          var bl = st.cases[n].body;
          for (var q = 0; q < bl.length; q++) {
            var r5 = this.exec(bl[q], sw);
            if (r5 && r5.__break) return null;
            if (r5 && (r5.__return || r5.__continue)) return r5;
          }
        }
        return null;
      }
      case "break": return { __break: true };
      case "continue": return { __continue: true };
      case "return": return { __return: true, v: st.e ? this.eval(st.e, sc) : null };
      default: throw SimError("这种语句站内模拟器还没学会：" + st.k, st.line || 1);
    }
  };
  I.doDecl = function (st, sc) {
    var self = this;
    (st.names || []).forEach(function (item) {
      var v = item.init ? self.eval(item.init, sc) : zeroOf(st.type);
      var bty = baseType(st.type);
      if (bty === "std::vector" || bty === "vector") { if (!(v && v.kind === "vec")) v = V("vec", []); }
      if (bty === "std::map" || bty === "std::set" || bty === "map" || bty === "set") {
        if (v && v.kind === "vec") v = V("map", v.v.map(function (x) { return [toDisplay(x), x]; }));
        else if (!(v && v.kind === "map")) v = V("map", []);
      }
      v = coerce(st.type, v);
      sc.d[item.name] = v;
      sc.ty[item.name] = st.type;
    });
    return null;
  };

  /* ---------- 表达式 ---------- */
  I.eval = function (e, sc) {
    if (!e) return num(0);
    this.tick(e.line || 1);
    switch (e.k) {
      case "lit":
        if (e.v === "num") return num(e.x, e.isInt !== false && e.x === Math.trunc(e.x));
        if (e.v === "str") return str(e.x);
        if (e.v === "chr") return V("chr", e.x);
        if (e.v === "bool") return bool(e.x);
        if (e.v === "ptr") return V("ptr", null);
        return num(0);
      case "var": {
        if (e.name === "std") return V("ns", "std");
        var got = this.find(sc, e.name);
        if (got && got.kind === "ref") {                      /* 引用形参：读的是调用方那个变量本体 */
          var pointed = this.find(got.v.sc, got.v.name);
          if (pointed !== null) return pointed;
          throw SimError("引用 " + e.name + " 指向的 " + got.v.name + " 在调用方那一层找不到", e.line || 1);
        }
        if (got) return got;
        if (this.fns[e.name]) return V("fn", this.fns[e.name]);
        if (STD_GLOBAL[e.name]) return V("ns", e.name);
        throw SimError("名字 " + e.name + " 没见过（这一课教的写法里没有它，或者忘了声明）", e.line || 1);
      }
      case "initlist": {
        var items = e.items.map(function (x) { return this.eval(x, sc); }, this);
        return V("vec", items);
      }
      case "new": {
        var inner = e.init ? this.eval(e.init, sc) : zeroOf(e.of);
        return V("ptr", { box: inner });
      }
      case "qual": {
        if (e.e && e.e.k === "var" && (e.e.name === "std" || e.e.name === "string" || e.e.name === "vector" || e.e.name === "map")) return this.eval({ k: "var", name: e.name, line: e.line }, sc);
        return this.eval(e.e, sc);
      }
      case "member": {
        var o = this.eval(e.e, sc);
        return memberGet(this, o, e.name, e.line);
      }
      case "index": {
        var t = this.eval(e.e, sc), kv = this.eval(e.i, sc);
        return indexGet(t, kv, e.line);
      }
      case "bin": return this.binop(e, sc);
      case "un": {
        var u = this.eval(e.e, sc);
        if (e.op === "-") return isNum(u) ? num(-numOf(u)) : u;
        if (e.op === "+") return u;
        if (e.op === "!") return bool(!truth(u));
        if (e.op === "~") return num(~numOf(u));
        if (e.op === "*") {
          if (u && u.kind === "iter") return u.v.a[u.v.i] || V("none", null);
          if (!u || u.kind !== "ptr" || !u.v) throw SimError("对空指针解引用（*p）", e.e.line);
          if (u.v.live) {                                    /* &x 记的是「那一个变量」，不是它当时的值 */
            var live = this.find(u.v.live.sc, u.v.live.name);
            if (live === null) throw SimError("指针指向的 " + u.v.live.name + " 已经找不到了", e.e.line);
            return live;
          }
          return u.v.box;
        }
        if (e.op === "&") {
          if (e.e.k === "var") return V("ptr", { live: { sc: sc, name: e.e.name } });
          return V("ptr", { box: u });
        }
        return u;
      }
      case "pre": case "post": {
        var before = numOf(this.eval(e.e, sc));
        var after = e.op === "++" ? before + 1 : before - 1;
        this.assignTo(e.e, num(after), sc);
        return num(e.k === "pre" ? after : before);
      }
      case "assign": {
        var right = this.eval(e.from, sc);
        if (e.op === "=") { this.assignTo(e.to, right, sc); return right; }
        var left = this.eval(e.to, sc);
        var merged = arith(e.op.charAt(0), left, right, e.to.line);
        this.assignTo(e.to, merged, sc);
        return merged;
      }
      case "tern": return truth(this.eval(e.c, sc)) ? this.eval(e.a, sc) : this.eval(e.b, sc);
      case "cast": {
        var cv = this.eval(e.e, sc);
        if (e.to === "int" || e.to === "long" || e.to === "size_t" || e.to === "unsigned") {
          var n = numOf(cv);
          if (cv.kind === "str") { if (/^[+-]?\d+$/.test(cv.v.trim())) n = Number(cv.v.trim()); else if (/^[+-]?\d*\.\d+/.test(cv.v.trim())) n = Math.floor(parseFloat(cv.v)); else throw SimError("to_string 反过来不行：std::stoi 遇到 \"" + cv.v + "\" 会抛 invalid_argument", e.e.line); return num(Math.trunc(n)); }
          return num(Math.trunc(n));                        /* 砍尾巴，不是四舍五入 —— 第 3 课那条 */
        }
        if (e.to === "double" || e.to === "float") return num(cv.kind === "str" ? parseFloat(cv.v) : numOf(cv));
        if (e.to === "bool") return bool(cv.kind === "str" ? cv.v !== "" : numOf(cv) !== 0);
        if (e.to === "char") return V("chr", String.fromCharCode(numOf(cv)));
        if (e.to === "std::string" || e.to === "string") return str(toDisplay(cv));
        return cv;
      }
      case "sizeof": {
        var ty = e.of;
        if (!ty && e.e.k === "var") ty = this.typeOf(sc, e.e.name);
        if (!ty || ty === "auto" || /(^|\s)auto(\s|&|\*)?$/.test(String(ty))) {
          var sv = this.eval(e.e, sc);
          ty = sv && sv.kind === "vec" ? "std::vector<int>" : sv && sv.kind === "map" ? "std::map<int, int>"
            : sv && sv.kind === "str" ? "std::string" : sv && sv.kind === "bool" ? "bool"
            : sv && sv.kind === "chr" ? "char" : (sv && sv.kind === "num" && sv.isInt) ? "int" : "double";
        }
        return num(sizeofType(String(ty)));
      }
      case "call": return this.callExpr(e, sc);
      case "lambda": {
        var self = this;
        var captured = this.newScope(sc);
        (e.caps || []).forEach(function (c) {
          if (c.all) {                                       /* [=] / [&]：整层作用域拿过来（近似：直接共享） */
            var s = sc;
            while (s) { Object.keys(s.d).forEach(function (k) { if (!(k in captured.d)) captured.d[k] = s.d[k]; }); s = s.p; }
            return;
          }
          var got = self.find(sc, c.name);
          if (got !== null) captured.d[c.name] = got;
        });
        return V("fn", { params: e.params, body: e.body, expr: e.expr, scope: captured, name: "<lambda>" });
      }
      default: throw SimError("这种写法站内模拟器还没学会：" + e.k, e.line || 1);
    }
  };
  I.assignTo = function (target, val, sc) {
    if (target.k === "var") {
      var holder = null, s = sc;
      while (s) { if (Object.prototype.hasOwnProperty.call(s.d, target.name)) { holder = s; break; } s = s.p; }
      if (holder && holder.d[target.name] && holder.d[target.name].kind === "ref") {
        var r = holder.d[target.name];
        return this.assignTo({ k: "var", name: r.v.name, line: target.line }, val, r.v.sc);
      }
      holder = holder || sc;
      holder.d[target.name] = coerce(holder.ty && holder.ty[target.name], val);
      return;
    }
    if (target.k === "index") {
      var t = this.eval(target.e, sc), kv = this.eval(target.i, sc);
      if (indexPut(this, t, kv, val, target.line)) return;
      throw SimError("这东西不能按下标写进去", target.line);
    }
    if (target.k === "member") {
      var o = this.eval(target.e, sc);
      if (o.kind === "ptr" && o.v) o = o.v.box;
      if (o.kind === "obj") { o.fields[target.name] = val; return; }
      return;
    }
    if (target.k === "un" && target.op === "*") {
      var pv = this.eval(target.e, sc);
      if (pv.kind === "ptr" && pv.v && pv.v.live) return this.assignTo({ k: "var", name: pv.v.live.name, line: target.line }, val, pv.v.live.sc);
      if (pv.kind === "ptr" && pv.v) { pv.v.box = val; return; }
      throw SimError("对空指针解引用（*p）", target.line);
    }
    throw SimError("这一行的左边不能赋值", target.line || 1);
  };
  function putMap(t, key, val) {
    for (var i = 0; i < t.v.length; i++) if (t.v[i][0] === key) { t.v[i][1] = val; return; }
    t.v.push([key, val]);
  }
  I.binop = function (e, sc) {
    var a = this.eval(e.a, sc), b = this.eval(e.b, sc);
    /* std::cin >> x ：读一行模拟输入，直接写进右边那个变量 */
    if (e.op === ">>" && a && a.kind === "ns" && String(a.v).indexOf("cin") >= 0) {
      var got = readStdin(this);
      this.assignTo(e.b, coerce(this.typeOf(sc, e.b.name || ""), got), sc);
      return a;                            /* 还回流本身：连着写 cin >> x >> y 才有第二层可读 */
    }
    switch (e.op) {
      case "&&": return bool(truth(a) && truth(b));
      case "||": return bool(truth(a) || truth(b));
      case "==": return bool(eqv(a, b));
      case "!=": return bool(!eqv(a, b));
      case "<": return bool(cmp(a, b) < 0);
      case ">": return bool(cmp(a, b) > 0);
      case "<=": return bool(cmp(a, b) <= 0);
      case ">=": return bool(cmp(a, b) >= 0);
      case "+":
        if (a.kind === "str" || b.kind === "str") return str(toDisplay(a) + toDisplay(b));
        if (a.kind === "vec" && b.kind === "vec") return V("vec", a.v.concat(b.v));
        return arith("+", a, b, e.line);
      case "-": case "*": case "/": case "%": return arith(e.op, a, b, e.line);
      case "<<":
        if (a.kind === "num" && b.kind === "num") return num(a.v << b.v);
        return str(toDisplay(a) + toDisplay(b));
      case ">>":
        if (a.kind === "num" && b.kind === "num") return num(a.v >> b.v);
        throw SimError("这种写法站内模拟器还没学会：>> 用在了非整数的地方", e.line);
      case "|": case "&": case "^": return num(opInt(e.op, numOf(a), numOf(b)));
      default: throw SimError("这个运算符还没进支持面：" + e.op, e.line);
    }
  };
  function opInt(op, x, y) { return op === "|" ? (x | y) : op === "&" ? (x & y) : (x ^ y); }
  function arith(op, a, b, line) {
    if (a.kind === "str" && op === "+" && b.kind === "num") return str(a.v + String(b.v));
    var x = numOf(a), y = numOf(b);
    if (isNaN(x) || isNaN(y)) throw SimError("这两个东西没法做 " + op + " 运算", line);
    if (op === "/") {
      if (y === 0) throw SimError("除以 0", line);
      /* 两边都是整数类型才截断 —— 7 / 2 是 3，7.0 / 2 是 3.5，这一条是第 6 课的考点 */
      if (a.isInt && b.isInt) return intNum(x / y);
      return num(x / y, false);
    }
    if (op === "%") { if (y === 0) throw SimError("取余的右边是 0", line); return num(x - Math.trunc(x / y) * y); }
    var bothInt = a.isInt && b.isInt;
    if (op === "+") return num(x + y, bothInt);
    if (op === "-") return num(x - y, bothInt);
    return num(x * y, bothInt);
  }
  function truth(v) {
    if (!v) return false;
    if (v.kind === "bool") return !!v.v;
    if (v.kind === "num") return v.v !== 0;
    if (v.kind === "str") return v.v.length > 0;
    if (v.kind === "chr") return v.v !== "\0" && v.v !== "";
    if (v.kind === "vec" || v.kind === "map") return true;
    if (v.kind === "ptr") return !!v.v;
    return true;
  }
  function eqv(a, b) {
    if (!a || !b) return a === b;
    if (a.kind === "str" || b.kind === "str") return toDisplay(a) === toDisplay(b);
    if (a.kind === "bool" && b.kind === "bool") return a.v === b.v;
    if (isNum(a) && isNum(b)) return numOf(a) === numOf(b);
    if (a.kind === "vec" && b.kind === "vec") return a.v.length === b.v.length && a.v.every(function (x, i) { return eqv(x, b.v[i]); });
    return a === b;
  }
  function cmp(a, b) {
    if (a.kind === "str" || b.kind === "str") { var x = toDisplay(a), y = toDisplay(b); return x < y ? -1 : x > y ? 1 : 0; }
    var m = numOf(a), n = numOf(b); return m < n ? -1 : m > n ? 1 : 0;
  }
  function rangeItems(v) {
    if (!v) return [];
    if (v.kind === "vec") return v.v.slice();
    if (v.kind === "str") return v.v.split("").map(function (c) { return V("chr", c); });   /* 范围 for 走的是字符：与 size() 的字节口径不同，这一点正文里也讲过 */
    if (v.kind === "map") return v.v.map(function (kv) { return V("pair", kv); });
    throw SimError("这东西还不能被 for 挨个走一遍（支持面里只有 vector / string / map）");
  }
  function zeroOf(type) {
    var t = String(type || "");
    if (t.indexOf("vector") >= 0) return V("vec", []);
    if (t.indexOf("map") >= 0 || t.indexOf("set") >= 0) return V("map", []);
    if (t.indexOf("string") >= 0) return str("");
    if (t === "bool") return bool(false);
    if (t === "char") return V("chr", "\0");
    if (t === "auto") return num(0);
    if (/^[A-Z]/.test(t) || t === "std::string_view") return str("");
    return num(0);
  }
  function indexGet(t, kv, line) {
    var ix = isNum(kv) || kv.kind === "chr" ? numOf(kv) : null;
    if (t.kind === "vec") {
      if (ix === null) throw SimError("容器按下标取要用整数，给的是 " + toDisplay(kv), line);
      if (ix < 0 || ix >= t.v.length) throw SimError("下标越界：这个容器里只有 " + t.v.length + " 个东西，你要的第 " + ix + " 个（从 0 数）没有", line);
      return t.v[ix];
    }
    if (t.kind === "str") {
      if (ix === null) throw SimError("字符串按下标取要用整数", line);
      if (ix < 0 || ix >= t.v.length) throw SimError("下标越界：这个字符串只有 " + t.v.length + " 个字符", line);
      return V("chr", t.v.charAt(ix));
    }
    if (t.kind === "map") {
      var key = toDisplay(kv);
      var found = null;
      t.v.forEach(function (pair) { if (pair[0] === key) found = pair[1]; });
      if (found) return found;
      var fresh = zeroOf("int");
      t.v.push([key, fresh]);                              /* map 取一个没有的键：C++ 会当场insert一个默认值 */
      return fresh;
    }
    if (t.kind === "ptr" && t.v && t.v.box) return indexGet(t.v.box, kv, line);
    throw SimError("这东西不能按下标取（" + toDisplay(kv) + "）", line);
  }
  function indexPut(sim, t, kv, val, line) {
    if (t.kind === "vec") { var ix = numOf(kv); while (t.v.length <= ix) t.v.push(num(0)); t.v[ix] = val; return true; }
    if (t.kind === "map") { putMap(t, toDisplay(kv), val); return true; }
    if (t.kind === "str") { var a = t.v.split(""); a[numOf(kv)] = toDisplay(val); t.v = a.join(""); return true; }
    return false;
  }
  I.callExpr = function (e, sc) {
    var fn = e.fn;
    /* std::xxx 与裸 xxx 两边同一张表：正文里既写 println 也写 std::println */
    var name = fnName(fn);
    /* 成员调用排在标准库查表前面：v.size() 里那个 size 与 STD.size 同名，先查表就会把容器的那一手抢走。
       只有 `std::xxx(...)` 这种整体才走标准库那张表。 */
    if (fn.k === "member") {
      var recNode = fn.e;
      var recIsStd = recNode && ((recNode.k === "var" && recNode.name === "std") ||
        (recNode.k === "qual" && recNode.e && recNode.e.name === "std"));
      if (!recIsStd) {
        var recv0 = this.eval(recNode, sc);
        var m0 = memberCall(this, recv0, fn.name, e.args.map(function (a) { return this.eval(a, sc); }, this), e.line);
        if (m0 !== undefined) return m0;
      }
    }
    /* 再认自己写的函数：引用形参（int& x）要能把「调用方那个变量」本身接过来，
       所以这条路上参数不能先求值 —— 得把 AST 节点连同调用方的作用域一起递进去。 */
    if (name && this.fns[name] && !STD[name]) {
      var ur = this.callRaw(this.fns[name], e.args, sc);
      return ur && ur.__return ? ur.v : (ur || V("none", null));
    }
    if (name && STD[name] && !(this.find(sc, name))) {
      return STD[name](this, e.args.map(function (a) { return this.eval(a, sc); }, this), sc, e.line);
    }
    var f = this.eval(fn, sc);
    if (f && f.kind === "ns") {
      var nm2 = fn.name || (fn.e && fn.e.name);
      if (STD[nm2]) return STD[nm2](this, e.args.map(function (a) { return this.eval(a, sc); }, this), sc, e.line);
      throw SimError("标准库里那个 " + nm2 + " 还没进站内模拟器的支持面", e.line || 1);
    }
    if (!f || f.kind !== "fn") {
      if (f && f.kind === "vec") { /* vector{...} 构造 */ return V("vec", e.args.slice()); }
      throw SimError((name || "这个东西") + " 不是可以被喊的函数", e.line || 1);
    }
    var lr = this.call(f.v, e.args.map(function (a) { return this.eval(a, sc); }, this), sc);
    return lr && lr.__return ? lr.v : (lr || V("none", null));
  };
  function fnName(fn) {
    if (!fn) return null;
    if (fn.k === "var") return fn.name;
    if (fn.k === "qual") return fn.name;
    if (fn.k === "member") return fn.name;
    return null;
  }
  I.call = function (f, argVals, sc) {
    if (!f) throw SimError("喊了一个不存在的函数");
    var inner = this.newScope(f.scope || sc);
    (f.params || []).forEach(function (p, i) {
      var nm = p.name !== undefined ? p.name : p;
      var v = argVals[i];
      if (v === undefined) v = zeroOf(p.type);
      if (nm && nm !== "_") inner.d[nm] = coerce(p.type, v);
    });
    return this.runBody(f, inner);
  };
  /* 自己写的函数走这条：参数节点还在，引用形参才能把调用方那个变量「接进来」而不是抄一份 */
  I.callRaw = function (f, nodes, callerSc) {
    var inner = this.newScope(f.scope || callerSc);
    (f.params || []).forEach(function (p, i) {
      var node = nodes[i];
      if (p.ref && node && node.k === "var") { inner.d[p.name] = V("ref", { sc: callerSc, name: node.name }); return; }
      var v = node !== undefined ? this.eval(node, callerSc) : zeroOf(p.type);
      if (p.name && p.name !== "_") inner.d[p.name] = coerce(p.type, v);
    }, this);
    return this.runBody(f, inner);
  };
  I.runBody = function (f, inner) {
    if (f.expr) return { __return: true, v: this.eval(f.expr, inner) };
    var body = f.body || [];
    for (var i = 0; i < body.length; i++) {
      var r = this.exec(body[i], inner);
      if (r && r.__return) return r;
    }
    return { __return: true, v: null };
  };

  /* ---------- 成员访问与成员函数 ---------- */
  function memberGet(sim, o, name, line) {
    if (!o) throw SimError("这个东西是空的，没有 ." + name, line);
    if (o.kind === "str" || (o.kind === "chr" && (name === "size" || name === "length"))) {
      if (name === "size" || name === "length") return num(byteLen(o.v));
      if (name === "empty") return bool(o.v === "");
    }
    if (o.kind === "vec") {
      if (name === "size" || name === "length") return num(o.v.length);
      if (name === "empty") return bool(o.v.length === 0);
      if (name === "front") { if (!o.v.length) throw SimError("front() 问的是空的容器"); return o.v[0]; }
      if (name === "back") { if (!o.v.length) throw SimError("back() 问的是空的容器"); return o.v[o.v.length - 1]; }
      if (name === "begin") return V("iter", { a: o.v, i: 0 });
      if (name === "end") return V("iter", { a: o.v, i: o.v.length });
      if (name === "capacity") return num(o.v.length);
    }
    if (o.kind === "map") {
      if (name === "size") return num(o.v.length);
      if (name === "empty") return bool(o.v.length === 0);
    }
    if (o.kind === "pair") { if (name === "first") return o.v[0]; if (name === "second") return o.v[1]; }
    if (o.kind === "ptr" && o.v) {
      var box = o.v.box;
      if (box && box.kind === "obj" && box.fields[name] !== undefined) return box.fields[name];
      return memberGet(sim, box, name, line);
    }
    if (o.kind === "obj" && o.fields[name] !== undefined) return o.fields[name];
    if (o.kind === "num" && (name === "size")) throw SimError("数字没有 ." + name + "（是不是忘了先声明成容器？）", line);
    throw SimError("这个写法站内模拟器还没学会：." + name + " 用在了 " + kindName(o) + " 上", line);
  }
  function kindName(o) { return o && o.kind ? o.kind : "undefined"; }
  function memberCall(sim, o, name, args, line) {
    if (!o) return undefined;
    if (o.kind === "vec") {
      if (name === "push_back" || name === "emplace_back") { o.v.push(args[0]); return V("none", null); }
      if (name === "pop_back") { o.v.pop(); return V("none", null); }
      if (name === "clear") { o.v = []; return V("none", null); }
      if (name === "resize") { var n = numOf(args[0]); while (o.v.length < n) o.v.push(zeroOf("int")); o.v.length = n; return V("none", null); }
      if (name === "at") return indexGet(o, numOf(args[0]), line);
      if (name === "size" || name === "empty" || name === "front" || name === "back") return memberGet(sim, o, name, line);
      if (name === "begin" || name === "end") return memberGet(sim, o, name, line);
      if (name === "insert") { o.v.splice(numOf(args[0]), 0, args[1]); return V("none", null); }
      if (name === "erase") { var ix = args[0] && args[0].kind === "iter" ? args[0].v.i : numOf(args[0]); o.v.splice(ix, 1); return V("none", null); }
    }
    if (o.kind === "str") {
      if (name === "substr") { var st = numOf(args[0]), ln = args[1] ? numOf(args[1]) : byteLen(o.v) - st; return str(byteSlice(o.v, st, ln)); }
      if (name === "size" || name === "length") return num(byteLen(o.v));
      if (name === "empty") return bool(o.v === "");
      if (name === "find") return num(o.v.indexOf(toDisplay(args[0])));
      if (name === "c_str") return str(o.v);
      if (name === "+") return str(o.v + toDisplay(args[0]));
      if (name === "at") return V("chr", o.v.charAt(numOf(args[0])));
      if (name === "append") { o.v += toDisplay(args[0]); return V("none", null); }
      if (name === "clear") { o.v = ""; return V("none", null); }
    }
    if (o.kind === "map") {
      if (name === "size" || name === "empty") return memberGet(sim, o, name, line);
      if (name === "count") { var k = toDisplay(args[0]); var hit = 0; o.v.forEach(function (kv) { if (kv[0] === k) hit++; }); return num(hit); }
      if (name === "clear") { o.v = []; return V("none", null); }
      if (name === "erase") { var k2 = toDisplay(args[0]); o.v = o.v.filter(function (kv) { return kv[0] !== k2; }); return V("none", null); }
    }
    if (o.kind === "ptr" && o.v && o.v.box) {
      if (name === "get") return o.v.box;
      if (name === "reset") { o.v = null; return V("none", null); }
      var sub = memberCall(sim, o.v.box, name, args, line);
      if (sub !== undefined) return sub;
    }
    if (o.kind === "obj") {
      var m = o.methods && o.methods[name];
      if (m) return sim.call(m, args, o.scope);
    }
    if (o.kind === "fn") return sim.call(o.v, args, null);
    if (o.kind === "vec" && name === "at") return indexGet(o, numOf(args[0]), line);
    return undefined;
  }

  /* sizeof 的字节数：按 x86-64 上 libstdc++ 的实际形状给（第 4 课那张对照表就是这台机器的数）。
     换平台会变，所以这一条只在「站内模拟」这个口径下成立 —— 界面里也照这个口径说。 */
  var SIZEOF = {
    char: 1, bool: 1, int: 4, float: 4, double: 8, long: 8, short: 2, unsigned: 4,
    size_t: 8, int8_t: 1, int32_t: 4, int64_t: 8, uint64_t: 8, wchar_t: 4,
    "std::string": 32, "string": 32, "std::string_view": 16, "std::vector": 24,
    "std::map": 48, "std::set": 48, "std::pair": 16, "std::array": 0
  };
  function sizeofType(t) {
    var s = String(t || "").replace(/\s+/g, "");
    if (/[*&]$/.test(s)) return 8;
    if (/^(std::vector|std::deque|std::list)<.*>$/.test(s)) return 24;
    if (/^(std::map|std::set)<.*>$/.test(s)) return 48;
    if (/^std::array<.*,\d+>$/.test(s)) {
      var m = /^std::array<([^,]+),(\d+)>$/.exec(s);
      return (SIZEOF[m[1]] || 4) * Number(m[2]);
    }
    if (/^std::(unique_ptr|shared_ptr)/.test(s)) return s.indexOf("shared") >= 0 ? 16 : 8;
    var cut = s.replace(/<.*$/, "");
    if (SIZEOF[cut] !== undefined) return SIZEOF[cut];
    if (SIZEOF[s] !== undefined) return SIZEOF[s];
    return 8;                                             /* 认不出的类型：按指针尺寸给，宁大不小 */
  }

  /* ---------- 标准库那一张表（够这两门课的前几十课真跑出东西） ---------- */
  var STD_GLOBAL = { cout: 1, cin: 1, endl: 1, string: 1, vector: 1, map: 1, set: 1, sort: 1, min: 1, max: 1, abs: 1 };
  var STD = {};
  function fmtInto(out, spec, v) {
    var s = toDisplay(v);
    var m = /^([^{}]*)(?:\{([^}]*)\})(.*)$/.exec(out);
    return m;
  }
  STD.format = function (sim, args) {
    if (!args.length) return str("");
    var fmt = toDisplay(args[0]), i = 1, out = "", at = 0;
    while (at < fmt.length) {
      var c = fmt.charAt(at);
      if (c === "{") {
        var close = fmt.indexOf("}", at);
        var raw = fmt.slice(at + 1, close);
        var spec = raw.charAt(0) === ":" ? raw.slice(1) : (raw.match(/^\d+$/) ? "" : raw);
        at = close + 1;
        var v = args[i++] || V("none", null);
        out += applySpec(spec, v);
        continue;
      }
      if (c === "}" && fmt.charAt(at + 1) === "}") { out += "}"; at += 2; continue; }
      out += c; at++;
    }
    return str(out);
  };
  function applySpec(spec, v) {
    spec = String(spec == null ? "" : spec);
    var s, i;
    if (spec === "") return toDisplay(v);
    var m = /^(?:(.)?([<>^]))?([-+ ])?(#)?(0)?(\d+)?(?:\.(\d+))?([bBoxXnfdFeEgGsAa]?)$/.exec(spec);
    if (!m) return toDisplay(v);
    var fill = m[1] || (m[2] ? "" : ""), align = m[2] || "", sign = m[3] || "", hash = m[4], zero = m[5];
    var width = m[6] ? Number(m[6]) : 0, prec = m[7] !== undefined ? Number(m[7]) : null, type = m[8] || "";
    var n = v && v.kind === "num" ? v.v : (v && v.kind === "bool" ? (v.v ? 1 : 0) : null);
    if (type === "b") s = (n >>> 0).toString(2);
    else if (type === "o") s = (n >>> 0).toString(8);
    else if (type === "x") s = (n >>> 0).toString(16);
    else if (type === "X") s = (n >>> 0).toString(16).toUpperCase();
    else if (type === "f" || type === "e" || type === "g" || type === "E" || type === "G") {
      s = prec !== null ? (type === "f" ? Number(n).toFixed(prec) : Number(n).toPrecision(Math.max(1, prec || 6))) : String(n);
    }
    else if (type === "s" || v.kind === "str" || v.kind === "chr") s = toDisplay(v);
    else if (n !== null) s = prec !== null && String(n).indexOf(".") >= 0 ? Number(n).toFixed(prec) : String(n);
    else s = toDisplay(v);
    if (hash && n !== null) s = (type === "b" ? "0b" : type === "B" ? "0B" : type === "x" ? "0x" : type === "X" ? "0X" : type === "o" ? "0" : "") + s;
    if (sign === "+" && n !== null && n > 0) s = "+" + s;
    var padChar = fill || (zero ? "0" : " ");
    if (zero && s.length < width && !align) {                       /* 0 填充要垫在符号后面、数字前面 */
      var neg = s.charAt(0) === "-" || s.charAt(0) === "+";
      s = (neg ? s.charAt(0) : "") + repeat(padChar, width - s.length) + (neg ? s.slice(1) : s);
    } else if (width && s.length < width) {
      if (align === "<") s = s + repeat(padChar, width - s.length);
      else if (align === "^") { var half = Math.floor((width - s.length) / 2); s = repeat(padChar, half) + s + repeat(padChar, width - s.length - half); }
      else s = repeat(padChar, width - s.length) + s;
    }
    return s;
  }
  function repeat(s, n) { return new Array(Math.max(0, n) + 1).join(s || " "); }
  STD.println = function (sim, args) {
    var line = args.length ? toDisplay(STD.format(sim, args)) : "";
    sim.out += line + "\n";
    if (sim.out.length > 200000) throw SimError("输出长得被掐断了（大概是循环里一直在打印）");
    return V("none", null);
  };
  STD.print = function (sim, args) {
    sim.out += args.length ? toDisplay(STD.format(sim, args)) : "";
    if (sim.out.length > 200000) throw SimError("输出长得被掐断了（大概是循环里一直在打印）");
    return V("none", null);
  };
  STD.to_string = function (sim, args) { return str(toDisplay(args[0])); };
  STD.stoi = function (sim, args) {
    var s = String(toDisplay(args[0])).trim();
    if (!/^[+-]?\d+/.test(s)) throw SimError("std::stoi 遇到 \"" + s + "\" 会抛 invalid_argument（里面一个数字都没有）");
    return num(parseInt(s, 10));
  };
  STD.stof = function (sim, args) { return num(parseFloat(toDisplay(args[0]))); };
  STD.size = function (sim, args) { var v = args[0]; return num(v && (v.kind === "vec" ? v.v.length : v.kind === "str" ? v.v.length : v.kind === "map" ? v.v.length : 0)); };
  STD.abs = function (sim, args) { return num(Math.abs(numOf(args[0]))); };
  STD.sqrt = function (sim, args) { return num(Math.sqrt(numOf(args[0]))); };
  STD.pow = function (sim, args) { return num(Math.pow(numOf(args[0]), numOf(args[1]))); };
  /* min/max/find 还回的是迭代器：*std::min(a.begin(), a.end()) 这样用才对得上真编译器 */
  function bestIter(a, b, want) {
    var arr = span(a, b), host = a && a.kind === "vec" ? a.v : (a && a.kind === "iter" ? a.v.a : arr);
    if (!arr.length) return V("iter", { a: host, i: 0 });
    var bi = 0;
    for (var i = 1; i < arr.length; i++) {
      var c = cmp(arr[i], arr[bi]);
      if ((want < 0 && c < 0) || (want > 0 && c > 0)) bi = i;
    }
    return V("iter", { a: host, i: (a && a.kind === "iter" ? a.v.i + bi : bi) });
  }
  function derefIter(v) { return v && v.kind === "iter" ? (v.v.a[v.v.i] || V("none", null)) : v; }
  STD.min = function (sim, args) { if (args.length === 1 && args[0].kind === "vec") { var best = args[0].v[0]; args[0].v.forEach(function (x) { if (cmp(x, best) < 0) best = x; }); return best; } return bestIter(args[0], args[1], -1); };
  STD.max = function (sim, args) { if (args.length === 1 && args[0].kind === "vec") { var best = args[0].v[0]; args[0].v.forEach(function (x) { if (cmp(x, best) > 0) best = x; }); return best; } return bestIter(args[0], args[1], 1); };
  STD.swap = function (sim, args) { var t = args[0]; args[0] = args[1]; args[1] = t; return V("none", null); };
  function cmpNum(a, b) { return numOf(a) - numOf(b); }
  function extremeIter(args, want) {
    var arr = span(args[0], args[1]), host = args[0] && args[0].kind === "vec" ? args[0].v : (args[0] && args[0].kind === "iter" ? args[0].v.a : arr);
    if (!arr.length) return V("iter", { a: host, i: 0 });
    var bi = 0;
    for (var i = 1; i < arr.length; i++) {
      var c = cmp(arr[i], arr[bi]);
      if ((want < 0 && c < 0) || (want > 0 && c > 0)) bi = i;
    }
    return V("iter", { a: host, i: (args[0] && args[0].kind === "iter" ? args[0].v.i + bi : bi) });
  }
  STD.min_element = function (sim, args) { return extremeIter(args, -1); };
  STD.max_element = function (sim, args) { return extremeIter(args, 1); };
  STD.sort = function (sim, args) {
    var v = args[0];
    if (v && v.kind === "iter") v = { kind: "vec", v: v.v.a };       /* sort(begin, end)：动的是那个容器本体 */
    if (!v || v.kind !== "vec") throw SimError("std::sort 的容器得先声明成 vector");
    var cmpFn = args[2];
    if (cmpFn && cmpFn.kind === "fn") {
      v.v.sort(function (a, b) { var r = sim.call(cmpFn.v, [a, b], cmpFn.scope); return truth(r.v) ? -1 : (eqv(a, b) ? 0 : 1); });
    } else v.v.sort(cmpNum);
    return V("none", null);
  };
  /* (begin, end) 这一对先摊成数组：站内的迭代器就是「数组 + 下标」，够用且诚实 */
  function span(a, b) {
    if (!a) return [];
    if (a.kind === "vec") return a.v;
    if (a.kind === "str") return a.v.split("").map(function (c) { return V("chr", c); });
    if (a.kind === "iter") { var arr = a.v.a, from = a.v.i, to = b && b.kind === "iter" ? b.v.i : arr.length; return arr.slice(from, to); }
    return [];
  }
  STD.find = function (sim, args) {
    var arr = span(args[0], args[1]), what = args[2];
    var host = args[0] && args[0].kind === "vec" ? args[0].v : arr;
    for (var i = 0; i < arr.length; i++) if (eqv(arr[i], what)) return V("iter", { a: host, i: i });
    return V("iter", { a: host, i: host.length });
  };
  STD.count_if = function (sim, args) {
    var arr = span(args[0], args[1]), f = args[2], n = 0;
    arr.forEach(function (x) { if (f && f.kind === "fn" && truth(sim.call(f.v, [x], f.scope).v)) n++; });
    return num(n);
  };
  STD.for_each = function (sim, args) {
    var arr = span(args[0], args[1]), f = args[2];
    arr.forEach(function (x) { if (f && f.kind === "fn") sim.call(f.v, [x], f.scope); });
    return V("none", null);
  };
  STD.transform = function (sim, args) {
    var arr = span(args[0], args[1]), f = args[3] || args[2];
    var dest = args[2] && args[2].kind === "vec" ? args[2] : null;
    var res = arr.map(function (x) { return f && f.kind === "fn" ? sim.call(f.v, [x], f.scope).v : x; });
    if (dest) { dest.v = res; return V("none", null); }
    return V("vec", res);
  };
  STD.accumulate = function (sim, args) {
    var arr = span(args[0], args[1]), acc = args[2] || num(0);
    arr.forEach(function (x) { acc = arith("+", acc, x); });
    return acc;
  };
  STD.reverse = function (sim, args) { if (args[0] && args[0].kind === "vec") args[0].v.reverse(); if (args[0] && args[0].kind === "str") args[0].v = args[0].v.split("").reverse().join(""); return V("none", null); };
  STD.begin = function (sim, args) { var v = args[0]; return memberGet(sim, v, "begin"); };
  STD.end = function (sim, args) { var v = args[0]; return memberGet(sim, v, "end"); };
  STD.make_unique = function (sim, args) { return V("ptr", { box: args[0] || zeroOf("int") }); };
  STD.make_shared = STD.make_unique;
  STD.move = function (sim, args) { return args[0]; };
  STD.forward = function (sim, args) { return args[0]; };
  STD.greater = function () { return V("fn", { params: [{ name: "a" }, { name: "b" }], expr: { k: "bin", op: ">", a: { k: "var", name: "a" }, b: { k: "var", name: "b" } }, scope: null }); };
  STD.cout = function () { return V("none", null); };
  STD.cin = function (sim, args) { return readStdin(sim); };
  function readStdin(sim) {
    var line = sim.stdin.shift();
    if (line === undefined) { line = ""; }
    var tk = line.match(/^\s*([+-]?\d+(?:\.\d+)?)/);
    if (tk) return num(Number(tk[1]));
    var wd = line.match(/^\s*(\S+)/);
    return str(wd ? wd[1] : "");
  }

  /* ---------- 入口 ----------
   * run(src, {stdin:[...]}) → { out, err, exitCode, error }
   *   与 Python 沙箱同一种返回形状，exam-ui.js 那套终端与「问题」页签照原样吃得下。 */
  function run(src, opts) {
    opts = opts || {};
    var sim = new Interp(opts);
    try {
      var toks = tokenize(src);
      var ast = new Parser(toks).tu();
      sim.run(ast);
      return { out: sim.out, err: "", exitCode: 0, error: null };
    } catch (e) {
      var where = e.simLine ? "第 " + e.simLine + " 行：" : "";
      var msg = (e.simMsg || e.message || String(e));
      return {
        out: sim.out,
        err: "simulator error: " + where + msg + "\n",
        exitCode: 1,
        error: { pyline: e.simLine || null, message: msg }
      };
    }
  }

  root.MIAO_CPP_SIM = { run: run, tokenize: tokenize, Parser: Parser, toDisplay: toDisplay, truth: truth, eqv: eqv };
  if (typeof module === "object" && module.exports) module.exports = root.MIAO_CPP_SIM;
})(typeof window !== "undefined" ? window : globalThis);
