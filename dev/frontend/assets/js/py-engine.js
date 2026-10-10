/* 喵站 · Python 沙箱 · 词法与语法层
 *
 * 载入方式：浏览器 <script> → window.MIAO_PYFE；Node require() → module.exports（给对拍测试用）。
 * 这一层只做 tokenize() 与 parse()，产出 AST；执行在 py-runtime.js。
 *
 * 覆盖范围按站内 45 课正文里真出现过的写法来定（数字见 dev/任务书.md §4）：
 *   f-string 260 处、三引号 34 处、切片 28 处、推导式 13 处、with 56 处、class 28 处、
 *   中文变量名 262 行 —— 所以词法必须允许 CJK 标识符。
 * 明确不支持（正文里一次都没出现过）：生成器 yield、async、match、@ 矩阵运算符。
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.MIAO_PYFE = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var KEYWORDS = {
    False: 1, None: 1, True: 1, and: 1, as: 1, assert: 1, async: 1, await: 1, break: 1,
    class: 1, continue: 1, def: 1, del: 1, elif: 1, else: 1, except: 1, finally: 1, for: 1,
    from: 1, global: 1, if: 1, import: 1, in: 1, is: 1, lambda: 1, nonlocal: 1, not: 1,
    or: 1, pass: 1, raise: 1, return: 1, try: 1, while: 1, with: 1, yield: 1
  };

  var OPS3 = ["**=", "//=", ">>=", "<<=", "..."];
  var OPS2 = ["**", "//", ">>", "<<", "<=", ">=", "==", "!=", "->", ":=", "+=", "-=",
    "*=", "/=", "%=", "&=", "|=", "^=", "@="];
  var OPS1 = "+-*/%=<>(),.:;[]{}&|^~@";
  var AUGIN = ["**=", "//=", ">>=", "<<=", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=", "@="];

  function syn(msg, line, file) {
    var e = new Error("SyntaxError: " + msg);
    e.isPyError = true; e.pytype = "SyntaxError"; e.pymsg = msg;
    e.pyline = line || 0; e.pyfile = file || "main.py";
    return e;
  }

  var NAME_START = /[\p{L}_]/u;
  var NAME_CH = /[\p{L}\p{N}_]/u;

  /* ---------------- 字符串字面量的转义 ---------------- */
  function escDecode(body, raw) {
    if (raw) return body;
    var out = "", i = 0;
    while (i < body.length) {
      var c = body[i];
      if (c !== "\\") { out += c; i++; continue; }
      var n = body[i + 1];
      if (n === undefined) { out += "\\"; i++; continue; }
      if (n === "\n") { i += 2; continue; }                       /* 三引号里的续行反斜杠 */
      var map = { n: "\n", t: "\t", r: "\r", "\\": "\\", "'": "'", '"': '"', a: "\x07", b: "\b", f: "\f", v: "\v", "0": "\0" };
      if (map[n] !== undefined) { out += map[n]; i += 2; continue; }
      if (n === "x" || n === "u" || n === "U") {
        var len = n === "x" ? 2 : n === "u" ? 4 : 8;
        var h = new RegExp("^([0-9a-fA-F]{1," + len + "})").exec(body.slice(i + 2));
        if (h) { out += n === "x" ? String.fromCharCode(parseInt(h[1], 16)) : String.fromCodePoint(parseInt(h[1], 16)); i += 2 + h[1].length; continue; }
      }
      if (n === "N") { var N = /^\{([^}]*)\}/.exec(body.slice(i + 2)); i += 2 + (N ? N[0].length : 0); continue; }
      out += c + n; i += 2;                                       /* 未知转义：照 CPython 原样保留并警告 */
    }
    return out;
  }

  /* ---------------- f-string 切片 ----------------
     返回 parts：[{lit:"文本"} | {expr:"源码", conv:"r"|null, spec:parts|null, doc:bool}] */
  function fSplit(text, raw, line, file) {
    var parts = [], buf = "", i = 0;
    function readExpr() {
      /* 从 text[i]（已在 '{' 之后）读到顶层的 '}'，返回 {src, doc}
         doc=true 表示 {x=} 这种自报形式：等号本身不属于表达式 */
      var s = "", depth = 0, q = null, doc = false;
      while (i < text.length) {
        var d = text[i];
        if (q) {
          if (d === "\\") { s += d + (text[i + 1] || ""); i += 2; continue; }
          if (d === q) q = null;
          s += d; i++; continue;
        }
        if (d === "'" || d === '"') { q = d; s += d; i++; continue; }
        if (d === "(" || d === "[" || d === "{") { depth++; s += d; i++; continue; }
        if (d === "}" && depth === 0) break;
        if (d === ")" || d === "]" || d === "}") { depth--; s += d; i++; continue; }
        if (d === "=" && depth === 0 && text[i + 1] === "=") { s += "=="; i += 2; continue; }
        if (d === "=" && depth === 0 && (text[i + 1] === "!" || text[i + 1] === ":" || text[i + 1] === "}")) {
          doc = true; i++; continue;
        }
        s += d; i++;
      }
      return { src: s, doc: doc };
    }
    while (i < text.length) {
      var c = text[i];
      if (c === "{") {
        if (text[i + 1] === "{") { buf += "{"; i += 2; continue; }
        if (buf) { parts.push({ lit: buf }); buf = ""; }
        i++;
        var got = readExpr(), src = got.src, doc = got.doc;
        if (i >= text.length) throw syn("f-string 缺少匹配的 '}'", line, file);
        i++;                                                       /* 吃掉 '}' */
        var conv = null, spec = null, ex = src;
        var mC = /!([rsa])\s*$/.exec(src);
        if (mC) { conv = mC[1]; ex = src.slice(0, mC.index); }
        /* 顶层冒号之后是格式化说明 */
        var cut = -1, dd = 0, qq = null, k = 0;
        while (k < ex.length) {
          var s2 = ex[k];
          if (qq) { if (s2 === "\\") { k += 2; continue; } if (s2 === qq) qq = null; k++; continue; }
          if (s2 === "'" || s2 === '"') { qq = s2; k++; continue; }
          if (s2 === "(" || s2 === "[" || s2 === "{") { dd++; k++; continue; }
          if (s2 === ")" || s2 === "]" || s2 === "}") { dd--; k++; continue; }
          if (s2 === ":" && dd === 0) { cut = k; break; }
          k++;
        }
        if (cut >= 0) { spec = ex.slice(cut + 1); ex = ex.slice(0, cut); }
        ex = ex.trim();
        parts.push({ expr: ex, src: src.trim(), conv: conv, spec: spec === null ? null : fSplit(spec, raw, line, file), doc: doc });
        continue;
      }
      if (c === "}") {
        if (text[i + 1] === "}") { buf += "}"; i += 2; continue; }
        throw syn("f-string 里出现了不配对的 '}'", line, file);
      }
      buf += c; i++;
    }
    if (buf) parts.push({ lit: buf });
    /* 转义只在字面片段上做 */
    parts.forEach(function (p) { if (p.lit !== undefined) p.lit = escDecode(p.lit, raw); });
    return parts;
  }

  /* ---------------- 词法器 ---------------- */
  function tokenize(src, file) {
    src = String(src).replace(/\r\n?/g, "\n");
    if (src.length && src[src.length - 1] !== "\n") src += "\n";
    var toks = [], indents = [0], depth = 0, line = 1, i = 0, atStart = true, sawCode = false;

    function push(t, v, extra) {
      var o = { t: t, v: v, line: line, file: file || "main.py" };
      if (extra) Object.keys(extra).forEach(function (k) { o[k] = extra[k]; });
      toks.push(o);
    }
    function toEol() { while (i < src.length && src[i] !== "\n") i++; }

    while (i < src.length) {
      if (atStart && depth === 0) {
        var col = 0, j = i;
        while (j < src.length) {
          var ch = src[j];
          if (ch === " ") col++;
          else if (ch === "\t") col += 8 - (col % 8);
          else if (ch === "\f") col = 0;
          else break;
          j++;
        }
        if (j >= src.length || src[j] === "\n" || src[j] === "#") {   /* 空行/整行注释不参与缩进 */
          i = j;
          if (i < src.length && src[i] === "#") toEol();
          if (i < src.length && src[i] === "\n") { i++; line++; }
          continue;
        }
        var top = indents[indents.length - 1];
        if (col > top) { indents.push(col); push("ind", ""); }
        else if (col < top) {
          if (indents.indexOf(col) < 0) throw syn("unindent does not match any outer indentation level", line, file);
          while (indents[indents.length - 1] > col) { indents.pop(); push("ded", ""); }
        }
        atStart = false; sawCode = true;
      }

      var c = src[i];
      if (c === "\n") {
        i++; line++;
        if (depth > 0) continue;                                   /* 括号内换行＝隐式续行 */
        atStart = true;
        if (sawCode) { push("nl", ""); sawCode = false; }
        continue;
      }
      if (c === " " || c === "\t" || c === "\f") { i++; continue; }
      if (c === "#") { toEol(); continue; }
      if (c === "\\" && (src[i + 1] === "\n" || src[i + 1] === "\r")) { i += 2; line++; continue; }

      /* ---- 字符串（含 r/f/b/u 前缀） ---- */
      var isStrStart = c === "'" || c === '"';
      if (!isStrStart && /[rRbBuUfF]/.test(c)) {
        var look = i, pfxLen = 0;
        while (look < src.length && /[rRbBuUfF]/.test(src[look]) && pfxLen < 3) { look++; pfxLen++; }
        if (src[look] === "'" || src[look] === '"') { isStrStart = true; }
      }
      if (isStrStart) {
        var pfx = "";
        while (/[rRbBuUfF]/.test(src[i]) && src[i] !== "'" && src[i] !== '"') pfx += src[i++];
        var badPfx = pfx.toLowerCase().replace(/[rfb]/g, "");
        if (badPfx) throw syn("invalid string prefix " + JSON.stringify(pfx), line, file);
        var raw = /[rR]/.test(pfx), isF = /[fF]/.test(pfx), isB = /[bB]/.test(pfx);
        var q = src[i];
        var triple = src[i + 1] === q && src[i + 2] === q;
        var close = triple ? q + q + q : q;
        i += close.length;
        var startLine = line, body = "";
        while (true) {
          if (i >= src.length) throw syn(triple ? "EOF in multi-line string（三引号没关上）" : "EOL while scanning string literal（引号没关上）", startLine, file);
          if (src[i] === "\\" && (src[i + 1] === "\n" || (!raw && src[i + 1]))) {
            if (src[i + 1] === "\n") { body += "\\\n"; i += 2; line++; continue; }
            if (!raw) { body += src[i] + src[i + 1]; i += 2; continue; }   /* 转义对整体吃掉，别让 \' 提前关串 */
          }
          if (src.substr(i, close.length) === close) { i += close.length; break; }
          if (src[i] === "\n") {
            if (!triple) throw syn("EOL while scanning string literal（引号没关上）", startLine, file);
            body += "\n"; line++; i++; continue;
          }
          body += src[i]; i++;
        }
        if (isF) push("fstr", fSplit(body, raw, startLine, file), { triple: triple });
        else push("str", escDecode(body, raw), { bytes: isB, triple: triple });
        continue;
      }

      /* ---- 数字 ---- */
      if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(src[i + 1] || ""))) {
        var st = i, isFloat = false, radix = 0;
        if (c === "0" && /[xXoObB]/.test(src[i + 1] || "")) {
          radix = { x: 16, X: 16, o: 8, O: 8, b: 2, B: 2 }[src[i + 1]];
          i += 2;
          while (i < src.length && /[0-9a-fA-F_]/.test(src[i])) i++;
        } else {
          while (i < src.length && /[0-9_]/.test(src[i])) i++;
          if (src[i] === ".") { isFloat = true; i++; while (i < src.length && /[0-9_]/.test(src[i])) i++; }
          if (/[eE]/.test(src[i] || "") && /[0-9+\-.]/.test(src[i + 1] || "")) {
            isFloat = true; i++; if (/[+-]/.test(src[i])) i++;
            while (i < src.length && /[0-9]/.test(src[i])) i++;
          }
          if (/[jJ]/.test(src[i] || "")) throw syn("本沙箱不支持复数", line, file);
        }
        var txt = src.slice(st, i).replace(/_/g, ""), val;
        if (radix) val = parseInt(txt.slice(2), radix);
        else if (isFloat) val = parseFloat(txt);
        else val = Math.abs(Number(txt)) > Number.MAX_SAFE_INTEGER ? txt : Number(txt);
        /* 数字后面紧贴字母 → CPython 报 invalid decimal literal（第 12 课的核心例子） */
        if (i < src.length && NAME_START.test(src[i])) throw syn("invalid decimal literal", line, file);
        push("num", val, { float: isFloat, big: !isFloat && !radix && typeof val === "string" });
        continue;
      }

      /* ---- 名字 / 关键字 ---- */
      if (NAME_START.test(c)) {
        var ns = i;
        while (i < src.length && NAME_CH.test(src[i])) i++;
        push("name", src.slice(ns, i));
        continue;
      }

      /* ---- 运算符 ---- */
      var th = src.substr(i, 3), tw = src.substr(i, 2);
      if (OPS3.indexOf(th) >= 0) { push("op", th); i += 3; continue; }
      if (OPS2.indexOf(tw) >= 0) { push("op", tw); i += 2; continue; }
      if (OPS1.indexOf(c) >= 0) {
        if (c === "(" || c === "[" || c === "{") depth++;
        if (c === ")" || c === "]" || c === "}") depth = Math.max(0, depth - 1);
        push("op", c); i++; continue;
      }
      throw syn("invalid character " + JSON.stringify(c) + " (U+" + c.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0") + ")", line, file);
    }

    if (sawCode) push("nl", "");
    while (indents.length > 1) { indents.pop(); push("ded", ""); }
    push("eof", "");
    return toks;
  }

  /* ---------------- 语法器 ---------------- */
  function Parser(toks, file) { this.p = 0; this.t = toks; this.file = file || "main.py"; }
  var P = Parser.prototype;

  P.cur = function () { return this.t[this.p]; };
  P.k = function () { return this.t[this.p].t; };
  P.v = function () { return this.t[this.p].v; };
  P.ln = function () { return this.t[this.p].line; };
  P.nx = function (o) { return this.t[this.p + (o || 1)]; };
  P.isOp = function (s) { var x = this.cur(); return x.t === "op" && x.v === s; };
  P.isKw = function (s) { var x = this.cur(); return x.t === "name" && x.v === s && KEYWORDS[s] === 1; };
  P.eatOp = function (s) { if (this.isOp(s)) { this.p++; return true; } return false; };
  P.eatKw = function (s) { if (this.isKw(s)) { this.p++; return true; } return false; };
  P.opTok = function (s) { if (!this.isOp(s)) throw syn("expected '" + s + "', got " + this.what(), this.ln(), this.file); this.p++; };
  P.kwTok = function (s) { if (!this.isKw(s)) throw syn("expected '" + s + "', got " + this.what(), this.ln(), this.file); this.p++; };
  P.nlTok = function () { if (this.k() !== "nl") throw syn("expected NEWLINE, got " + this.what(), this.ln(), this.file); this.p++; };
  P.what = function () {
    var x = this.cur();
    if (x.t === "eof") return "end of input";
    if (x.t === "nl") return "newline";
    if (x.t === "ind") return "indent";
    if (x.t === "ded") return "dedent";
    if (x.t === "str" || x.t === "fstr") return "string literal";
    return String(x.v);
  };
  P.idTok = function () {
    var x = this.cur();
    if (x.t !== "name" || KEYWORDS[x.v]) throw syn("expected identifier, got " + this.what(), this.ln(), this.file);
    this.p++; return x.v;
  };

  P.module = function () {
    var body = this.statList();
    if (this.k() !== "eof") throw syn("unexpected " + this.what(), this.ln(), this.file);
    return { k: "mod", body: body };
  };

  var COMPOUND = { if: 1, while: 1, for: 1, with: 1, try: 1, def: 1, class: 1 };

  /* 语句序列：遇到 eof / ded 就停（不吞 ded，交给 block() 精确吞一个）
     复合语句的结尾是「NEWLINE…DEDENT」，DEDENT 被 block() 吞掉后行尾已经没有 NEWLINE 了，
     所以不能再要求 NEWLINE —— 这是缩进式语法最容易踩的一条。 */
  P.statList = function () {
    var out = [];
    while (this.k() === "nl") this.p++;
    while (true) {
      var kk = this.k();
      if (kk === "eof" || kk === "ded") break;
      if (kk === "ind") throw syn("unexpected indent", this.ln(), this.file);
      var st = this.statement();
      out.push(st);
      if (this.k() === "nl") { while (this.k() === "nl") this.p++; continue; }
      if (this.isOp(";")) {
        this.p++;
        while (this.k() === "nl") this.p++;
        if (this.k() === "eof" || this.k() === "ded") break;
        continue;
      }
      if (COMPOUND[st.k]) continue;                       /* 块尾的 DEDENT 已经当终止符吃掉了 */
      throw syn("expected NEWLINE, got " + this.what(), this.ln(), this.file);
    }
    return out;
  };

  /* 缩进块：':' NEWLINE INDENT 语句 DEDENT；或一行式 'a; b' */
  P.block = function () {
    this.opTok(":");
    if (this.k() === "nl") {
      this.p++;
      if (this.k() !== "ind") throw syn("expected an indented block", this.ln(), this.file);
      this.p++;
      var body = this.statList();
      if (this.k() === "ded") this.p++;
      if (!body.length) throw syn("expected an indented block", this.ln(), this.file);
      return body;
    }
    var one = [];
    while (true) {
      one.push(this.simple());
      if (!this.isOp(";")) break;
      this.p++;
      if (this.k() === "nl" || this.k() === "eof" || this.k() === "ded") break;
    }
    return one;
  };

  P.statement = function () {
    if (this.isKw("if")) return this.ifStmt();
    if (this.isKw("while")) return this.whileStmt();
    if (this.isKw("for")) return this.forStmt();
    if (this.isKw("with")) return this.withStmt();
    if (this.isKw("try")) return this.tryStmt();
    if (this.isKw("def")) return this.funcDef();
    if (this.isKw("class")) return this.classDef();
    if (this.isOp("@")) {
      var dl = this.ln();
      this.p++;
      var dec = this.test();
      this.nlTok();
      var inner = this.statement();
      if (inner.k !== "def" && inner.k !== "class") throw syn("Decorators are only supported on def/class", dl, this.file);
      inner.decs = (inner.decs || []).concat([dec]);
      return inner;
    }
    return this.simple();
  };

  /* if / elif / else → orelse 是语句列表（elif 记成嵌一个 if，与 CPython AST 一致） */
  P.ifStmt = function () {
    var line = this.ln();
    this.p++;
    var test = this.test(), body = this.block(), orelse = [];
    if (this.isKw("elif")) { orelse = [this.ifStmt()]; return { k: "if", line: line, test: test, body: body, orelse: orelse }; }
    if (this.eatKw("else")) orelse = this.block();
    return { k: "if", line: line, test: test, body: body, orelse: orelse };
  };

  P.whileStmt = function () {
    var line = this.ln();
    this.p++;
    var test = this.test(), body = this.block(), orelse = [];
    if (this.eatKw("else")) orelse = this.block();
    return { k: "while", line: line, test: test, body: body, orelse: orelse };
  };

  P.forStmt = function () {
    var line = this.ln();
    this.p++;
    var target = this.targetListLow();
    this.kwTok("in");
    var it = this.testListRaw();
    var body = this.block(), orelse = [];
    if (this.eatKw("else")) orelse = this.block();
    return { k: "for", line: line, target: asTarget(target, this), iter: it, body: body, orelse: orelse };
  };

  P.withStmt = function () {
    var line = this.ln();
    this.p++;
    var items = [], paren = this.eatOp("(");
    while (true) {
      var cx = this.test(), opt = null;
      if (this.eatKw("as")) opt = asTarget(this.atom(), this);
      items.push({ ctx: cx, opt: opt });
      if (!this.eatOp(",")) break;
      if (paren && this.isOp(")")) break;
    }
    if (paren && this.isOp(")")) this.p++;
    var body = this.block();
    return { k: "with", line: line, items: items, body: body };
  };

  P.tryStmt = function () {
    var line = this.ln();
    this.p++;
    var body = this.block(), handlers = [], orelse = [], fin = [];
    while (this.isKw("except")) {
      var hl = this.ln();
      this.p++;
      var typ = null, name = null;
      if (!this.isOp(":")) {
        typ = this.test();
        if (this.eatKw("as")) name = { k: "name", name: this.idTok(), line: this.ln() };
      }
      var hb = this.block();
      handlers.push({ line: hl, typ: typ, name: name, body: hb });
    }
    if (this.eatKw("else")) orelse = this.block();
    if (this.eatKw("finally")) fin = this.block();
    if (!handlers.length && !fin.length) throw syn("expected 'except' or 'finally' clause", line, this.file);
    return { k: "try", line: line, body: body, handlers: handlers, orelse: orelse, fin: fin };
  };

  P.params = function () {
    var ps = { args: [], defs: [], kwonly: [], kwdefs: [], vararg: null, kwarg: null };
    this.opTok("(");
    var star = false;
    while (!this.isOp(")")) {
      if (this.eatOp("*")) {
        star = true;
        if (this.k() === "name") ps.vararg = this.idTok();
        if (this.eatOp(":")) this.test();
        if (!this.eatOp(",")) break;
        continue;
      }
      if (this.eatOp("**")) {
        ps.kwarg = this.idTok();
        if (this.eatOp(":")) this.test();
        if (!this.eatOp(",")) break;
        continue;
      }
      var nm = this.idTok();
      if (this.eatOp(":")) this.test();                    /* 注解收下不用 */
      var def = this.eatOp("=") ? this.test() : null;
      if (star) { ps.kwonly.push(nm); ps.kwdefs.push(def); }
      else {
        if (ps.kwonly.length) throw syn("non-keyword arg after keyword-only arg", this.ln(), this.file);
        ps.args.push(nm); ps.defs.push(def);
      }
      if (!this.eatOp(",")) break;
      if (this.isOp(")")) break;                            /* 尾逗号 */
    }
    this.opTok(")");
    if (this.eatOp("->")) this.test();
    return ps;
  };

  P.funcDef = function () {
    var line = this.ln();
    this.p++;
    var name = this.idTok();
    var ps = this.params();
    var body = this.block();
    return { k: "def", line: line, name: name, params: ps, body: body, doc: docOf(body) };
  };

  P.classDef = function () {
    var line = this.ln();
    this.p++;
    var name = this.idTok(), bases = [], kwds = [];
    if (this.eatOp("(")) {
      while (!this.isOp(")")) {
        if (this.eatOp("*")) { bases.push({ k: "star", value: this.test(), line: this.ln() }); if (!this.eatOp(",")) break; continue; }
        var e = this.test();
        if (this.eatOp("=")) { kwds.push({ name: e.name || e.v, value: this.test() }); }
        else bases.push(e);
        if (!this.eatOp(",")) break;
      }
      this.opTok(")");
    }
    var body = this.block();
    return { k: "class", line: line, name: name, bases: bases, kwds: kwds, body: body, doc: docOf(body) };
  };

  P.simple = function () {
    var line = this.ln();
    if (this.eatKw("pass")) return { k: "pass", line: line };
    if (this.eatKw("break")) return { k: "break", line: line };
    if (this.eatKw("continue")) return { k: "continue", line: line };
    if (this.eatKw("return")) {
      var rv = null;
      if (this.k() !== "nl" && this.k() !== "eof" && this.k() !== "ded" && !this.isOp(";")) rv = this.testListRaw();
      return { k: "return", line: line, value: rv };
    }
    if (this.eatKw("raise")) {
      var exc = null, frm = null;
      if (this.k() !== "nl" && this.k() !== "eof" && !this.isOp(";")) {
        exc = this.test();
        if (this.eatKw("from")) frm = this.test();
      }
      return { k: "raise", line: line, exc: exc, frm: frm };
    }
    if (this.eatKw("assert")) {
      var t = this.test(), msg = null;
      if (this.eatOp(",")) msg = this.test();
      return { k: "assert", line: line, test: t, msg: msg };
    }
    if (this.eatKw("del")) {
      var self = this;
      var ds = [this.targetItem()];
      while (this.eatOp(",")) {
        if (this.k() === "nl" || this.k() === "eof" || this.k() === "ded") break;
        ds.push(this.targetItem());
      }
      return { k: "del", line: line, targets: ds.map(function (x) { return asTarget(x, self); }) };
    }
    if (this.isKw("global") || this.isKw("nonlocal")) {
      var gk = this.v(); this.p++;
      var names = [this.idTok()];
      while (this.eatOp(",")) names.push(this.idTok());
      return { k: gk === "global" ? "global" : "nonlocal", line: line, names: names };
    }
    if (this.isKw("yield")) throw syn("本沙箱不支持生成器（yield）", line, this.file);
    if (this.isKw("import")) return this.importStmt();
    if (this.isKw("from")) return this.fromImportStmt();

    var lhs = this.testListStar();
    if (this.isOp("=")) {
      var targets = [asTarget(lhs, this)], value = null;
      while (this.eatOp("=")) {
        var rhs = this.testListStar();
        if (this.isOp("=")) targets.push(asTarget(rhs, this));
        else { value = rhs; break; }
      }
      if (!value) throw syn("invalid syntax", this.ln(), this.file);
      return { k: "assign", line: line, targets: targets, value: value };
    }
    if (this.isOp(":") && lhs.k === "name") {
      this.p++;
      this.test();                                          /* 注解类型：收下但不求值 */
      var v2 = null;
      if (this.eatOp("=")) v2 = this.testListStar();
      return { k: "annassign", line: line, target: lhs, value: v2 };
    }
    for (var ai = 0; ai < AUGIN.length; ai++) {
      if (this.isOp(AUGIN[ai])) {
        var op = AUGIN[ai].slice(0, -1);
        this.p++;
        return { k: "augassign", line: line, op: op, target: asTarget(lhs, this), value: this.testListStar() };
      }
    }
    return { k: "expr", line: line, value: lhs };
  };

  P.importStmt = function () {
    var line = this.ln();
    this.p++;
    var mods = [];
    while (true) {
      var name = this.dotted();
      var as = this.eatKw("as") ? this.idTok() : null;
      mods.push({ name: name, as: as });
      if (!this.eatOp(",")) break;
    }
    return { k: "import", line: line, mods: mods };
  };

  P.fromImportStmt = function () {
    var line = this.ln();
    this.p++;
    var dots = 0;
    while (this.isOp(".") || this.isOp("...")) {
      if (this.isOp("...")) { dots += 3; this.p++; break; }
      this.p++; dots++;
    }
    var mod = this.k() === "name" ? this.dotted() : null;
    this.kwTok("import");
    var names = [], star = false;
    if (this.eatOp("*")) star = true;
    else {
      var paren = this.eatOp("(");
      while (true) {
        var nm = this.idTok();
        var as = this.eatKw("as") ? this.idTok() : null;
        names.push({ name: nm, as: as });
        if (!this.eatOp(",")) break;
        if (paren && this.isOp(")")) break;
      }
      if (paren) this.opTok(")");
    }
    return { k: "fromimport", line: line, module: mod, names: names, star: star, dots: dots };
  };

  P.dotted = function () {
    var parts = [this.idTok()];
    while (this.isOp(".") && this.nx() && this.nx().t === "name") { this.p++; parts.push(this.idTok()); }
    return parts.join(".");
  };

  /* 目标列表：a, b = ... / for x, y in ...
     注意 for 与推导式的目标必须停在 in 之前 —— 用比较级解析会把 `x in 容器` 当成整体吃掉。 */
  P.targetList = function () {
    var first = this.orStar();
    if (!this.isOp(",")) return first;
    var items = [first];
    while (this.eatOp(",")) {
      if (this.isKw("in") || this.isOp(")") || this.k() === "nl" || this.isOp("=")) break;
      items.push(this.orStar());
    }
    return { k: "tup", items: items, line: first.line };
  };
  P.targetListLow = function () {
    var first = this.targetItem();
    if (!this.isOp(",")) return first;
    var items = [first];
    while (this.eatOp(",")) {
      if (this.isKw("in") || this.isOp(")") || this.k() === "nl" || this.k() === "eof" || this.k() === "ded" || this.isOp("=")) break;
      items.push(this.targetItem());
    }
    return { k: "tup", items: items, line: first.line };
  };
  P.targetItem = function () {
    var line = this.ln();
    if (this.eatOp("*")) return { k: "star", line: line, value: this.targetItem() };
    return this.trailer(this.atom());
  };

  /* ---------------- 表达式 ---------------- */
  P.testListRaw = function () {
    var first = this.test();
    if (!this.isOp(",")) return first;
    var items = [first];
    while (this.eatOp(",")) {
      if (this.isOp(")") || this.isOp("=") || this.k() === "nl" || this.k() === "eof" || this.isOp(":")) break;
      items.push(this.test());
    }
    return { k: "tup", items: items, line: first.line };
  };
  P.testListStar = function () {
    var first = this.orStar();
    if (!this.isOp(",")) return first;
    var items = [first];
    while (this.eatOp(",")) {
      if (this.isOp("=") || this.isOp(")") || this.isOp(";") || this.k() === "nl" || this.k() === "eof" || this.isOp(":")) break;
      items.push(this.orStar());
    }
    return { k: "tup", items: items, line: first.line };
  };

  P.test = function () {
    var line = this.ln();
    if (this.isKw("lambda")) {
      this.p++;
      var ps = { args: [], defs: [], kwonly: [], kwdefs: [], vararg: null, kwarg: null };
      if (!this.isOp(":")) {
        while (!this.isOp(":")) {
          var nm = this.idTok();
          ps.args.push(nm);
          ps.defs.push(this.eatOp("=") ? this.test() : null);
          if (!this.eatOp(",")) break;
        }
      }
      this.opTok(":");
      return { k: "lambda", line: line, params: ps, body: this.test() };
    }
    var v = this.orTest();
    if (this.eatKw("if")) {
      var cond = this.orTest();
      this.kwTok("else");
      return { k: "ifexp", line: line, test: cond, body: v, orelse: this.test() };
    }
    return v;
  };

  P.orTest = function () {
    var line = this.ln(), x = this.andTest();
    if (!this.isKw("or")) return x;
    var vals = [x];
    while (this.eatKw("or")) vals.push(this.andTest());
    return { k: "logic", op: "or", line: line, vals: vals };
  };
  P.andTest = function () {
    var line = this.ln(), x = this.notTest();
    if (!this.isKw("and")) return x;
    var vals = [x];
    while (this.eatKw("and")) vals.push(this.notTest());
    return { k: "logic", op: "and", line: line, vals: vals };
  };
  P.notTest = function () {
    var line = this.ln();
    if (this.eatKw("not")) {
      var vals = [this.notTest()];
      while (this.eatKw("not")) { this.p++; vals.push(this.notTest()); }
      return { k: "not", line: line, vals: vals };
    }
    return this.comparison();
  };
  P.comparison = function () {
    var line = this.ln(), left = this.bit(0);
    var ops = [], comps = [];
    while (true) {
      var o = null;
      if (this.isOp("<") || this.isOp(">") || this.isOp("==") || this.isOp(">=") || this.isOp("<=") || this.isOp("!=")) { o = this.v(); this.p++; }
      else if (this.isKw("in")) { o = "in"; this.p++; }
      else if (this.isKw("is")) { this.p++; o = this.eatKw("not") ? "is not" : "is"; }
      else if (this.isKw("not") && this.nx() && this.nx().v === "in") { this.p += 2; o = "not in"; }
      if (!o) break;
      ops.push(o); comps.push(this.bit(0));
    }
    if (!ops.length) return left;
    return { k: "cmp", line: line, left: left, ops: ops, comps: comps };
  };

  var LEVELS = [["|"], ["^"], ["&"], ["<<", ">>"], ["+", "-"], ["*", "/", "//", "%"]];
  P.bit = function (lvl) {
    if (lvl >= LEVELS.length) return this.powerOrUnary();
    var line = this.ln(), left = this.bit(lvl + 1);
    while (true) {
      var found = null;
      for (var i = 0; i < LEVELS[lvl].length; i++) if (this.isOp(LEVELS[lvl][i])) { found = LEVELS[lvl][i]; break; }
      if (!found) break;
      this.p++;
      left = { k: "bin", op: found, line: line, left: left, right: this.bit(lvl + 1) };
    }
    return left;
  };
  /* factor: ('+'|'-'|'~') factor | power ；power: atom_expr ['**' factor]
     —— 所以 -2 ** 2 得 -4：一元负号管不到 ** 的左边（第 20 课专门讲这条反直觉的规矩） */
  P.powerOrUnary = function () {
    var line = this.ln();
    if (this.isOp("+") || this.isOp("-") || this.isOp("~")) {
      var op = this.v(); this.p++;
      return { k: "unary", op: op, line: line, value: this.powerOrUnary() };
    }
    var a = this.trailer(this.atom());
    if (this.isOp("**")) {
      this.p++;
      return { k: "bin", op: "**", line: line, left: a, right: this.powerOrUnary() };
    }
    return a;
  };
  P.unary = function () { return this.powerOrUnary(); };
  P.orStar = function () {
    var line = this.ln();
    if (this.eatOp("*")) return { k: "star", line: line, value: this.bit(0) };
    return this.test();
  };

  P.atom = function () {
    var line = this.ln(), x = this.cur();
    if (x.t === "num") { this.p++; return { k: "num", line: line, v: x.v, float: !!x.float, big: !!x.big }; }
    if (x.t === "str" || x.t === "fstr") {
      var lits = [], fparts = [], anyTriple = false;
      while (this.k() === "str" || this.k() === "fstr") {
        var tk = this.cur();
        this.p++;
        if (tk.triple) anyTriple = true;
        if (tk.t === "str") { lits.push(tk.v); fparts.push({ lit: tk.v }); }
        else { lits.push(null); fparts = fparts.concat(tk.v); }
      }
      var hasF = fparts.some(function (p) { return p.expr !== undefined; });
      if (!hasF) return { k: "str", line: line, v: fparts.map(function (p) { return p.lit; }).join(""), triple: anyTriple };
      return { k: "fstr", line: line, parts: mergeLits(fparts), triple: anyTriple };
    }
    if (x.t === "name") {
      var nm = x.v;
      if (nm === "True") { this.p++; return { k: "bool", line: line, v: true }; }
      if (nm === "False") { this.p++; return { k: "bool", line: line, v: false }; }
      if (nm === "None") { this.p++; return { k: "none", line: line }; }
      if (KEYWORDS[nm]) throw syn("invalid syntax (" + nm + " 是关键字)", line, this.file);
      this.p++;
      if (this.isOp(":=")) {
        this.p++;
        return { k: "walrus", line: line, name: nm, value: this.test() };
      }
      return { k: "name", line: line, name: nm };
    }
    if (this.isOp("(")) { this.p++; return this.paren(line); }
    if (this.isOp("[")) { this.p++; return this.listDisp(line); }
    if (this.isOp("{")) { this.p++; return this.braceDisp(line); }
    throw syn("invalid syntax, got " + this.what(), line, this.file);
  };

  P.paren = function (line) {
    if (this.eatOp(")")) return { k: "tup", line: line, items: [], paren: true };
    var first = this.orStar();
    if (this.isOp(",")) {
      var items = [first];
      while (this.eatOp(",")) {
        if (this.isOp(")")) break;
        items.push(this.orStar());
      }
      this.opTok(")");
      return { k: "tup", line: line, items: items, paren: true };
    }
    if (this.isKw("for")) {
      var g = this.comp(first, "gen", line);
      this.opTok(")");
      return g;
    }
    this.opTok(")");
    return first;
  };

  P.listDisp = function (line) {
    if (this.eatOp("]")) return { k: "list", line: line, items: [] };
    var first = this.orStar();
    if (this.isKw("for")) {
      var c = this.comp(first, "list", line);
      this.opTok("]");
      return c;
    }
    var items = [first];
    while (this.eatOp(",")) {
      if (this.isOp("]")) break;
      items.push(this.orStar());
    }
    this.opTok("]");
    return { k: "list", line: line, items: items };
  };

  P.braceDisp = function (line) {
    if (this.eatOp("}")) return { k: "dict", line: line, keys: [], vals: [] };
    var first = this.orStar();
    if (first.k !== "star" && this.isOp(":")) {
      this.p++;                                            /* 冒号必须吃掉，不然值表达式从 ':' 开始解析 */
      var v0 = this.test();
      if (this.isKw("for")) {
        var clauses = this.compClauses();
        this.opTok("}");
        return { k: "dictcomp", line: line, key: first, value: v0, clauses: clauses };
      }
      var keys = [first], vals = [v0];
      while (this.eatOp(",")) {
        if (this.isOp("}")) break;
        if (this.eatOp("*")) { vals.push({ k: "starv", value: this.bit(0), line: this.ln() }); keys.push(null); continue; }
        var kk = this.test();
        this.opTok(":");
        keys.push(kk); vals.push(this.test());
      }
      this.opTok("}");
      return { k: "dict", line: line, keys: keys, vals: vals };
    }
    if (first.k === "star") {
      var ks = [null], vs = [{ k: "starv", value: first.value, line: first.line }];
      while (this.eatOp(",")) {
        if (this.isOp("}")) break;
        if (this.eatOp("*")) { ks.push(null); vs.push({ k: "starv", value: this.bit(0), line: this.ln() }); continue; }
        var k2 = this.test();
        this.opTok(":");
        ks.push(k2); vs.push(this.test());
      }
      this.opTok("}");
      return { k: "dict", line: line, keys: ks, vals: vs };
    }
    if (this.isKw("for")) {
      var sc = this.comp(first, "set", line);
      this.opTok("}");
      return sc;
    }
    var els = [first];
    while (this.eatOp(",")) {
      if (this.isOp("}")) break;
      els.push(this.orStar());
    }
    this.opTok("}");
    return { k: "set", line: line, items: els };
  };

  P.comp = function (elt, kind, line) {
    var clauses = this.compClauses();
    return { k: kind + "comp", line: line, elt: elt, clauses: clauses };
  };
  P.compClauses = function () {
    var clauses = [];
    while (this.isKw("for")) {
      var fl = this.ln();
      this.p++;
      var tgt = this.targetListLow();
      this.kwTok("in");
      var it = this.orTestNoComp();
      var conds = [];
      while (this.eatKw("if")) conds.push(this.orTestNoComp());
      clauses.push({ line: fl, target: asTarget(tgt, this), iter: it, conds: conds });
    }
    return clauses;
  };
  /* 推导式的 iter / if 条件：or_test 级别（含 not、and、or），但绝不再嵌推导 */
  P.orTestNoComp = function () {
    var line = this.ln(), x = this.andTestNoComp();
    if (!this.isKw("or")) return x;
    var vals = [x];
    while (this.eatKw("or")) vals.push(this.andTestNoComp());
    return { k: "logic", op: "or", line: line, vals: vals };
  };
  P.andTestNoComp = function () {
    var line = this.ln(), x = this.notTestNoComp();
    if (!this.isKw("and")) return x;
    var vals = [x];
    while (this.eatKw("and")) vals.push(this.notTestNoComp());
    return { k: "logic", op: "and", line: line, vals: vals };
  };
  P.notTestNoComp = function () {
    var line = this.ln();
    if (this.eatKw("not")) return { k: "not", line: line, vals: [this.notTestNoComp()] };
    return this.comparison();
  };

  P.trailer = function (node) {
    while (true) {
      var line = this.ln();
      if (this.isOp(".")) {
        this.p++;
        node = { k: "attr", line: line, value: node, attr: this.idTok() };
        continue;
      }
      if (this.isOp("[")) {
        this.p++;
        var items = [this.oneItem()];
        while (this.eatOp(",")) {
          if (this.isOp("]")) break;
          items.push(this.oneItem());
        }
        this.opTok("]");
        node = { k: "sub", line: line, value: node, index: items.length === 1 ? items[0] : { k: "tup", line: line, items: items } };
        continue;
      }
      if (this.isOp("(")) {
        this.p++;
        var args = [], kws = [];
        while (!this.isOp(")")) {
          var al = this.ln();
          if (this.eatOp("**")) { kws.push({ spread: true, value: this.bit(0) }); if (!this.eatOp(",")) break; continue; }
          if (this.eatOp("*")) { args.push({ star: true, value: this.bit(0) }); if (!this.eatOp(",")) break; continue; }
          if (this.k() === "name" && !KEYWORDS[this.v()] && this.nx() && this.nx().t === "op" && this.nx().v === "=" &&
              !(this.nx(2) && this.nx(2).t === "op" && this.nx(2).v === "=")) {
            var kn = this.v(); this.p += 2;
            kws.push({ name: kn, value: this.test() });
          } else {
            var e = this.orStar();
            if (e.k === "star") args.push({ star: true, value: e.value });
            else if (this.isKw("for")) args.push({ gen: this.comp(e, "gen", al) });
            else args.push({ value: e });
          }
          if (!this.eatOp(",")) break;
        }
        this.opTok(")");
        node = { k: "call", line: line, fn: node, args: args, kws: kws };
        continue;
      }
      break;
    }
    return node;
  };

  P.oneItem = function () {
    var line = this.ln(), lower = null;
    if (!this.isOp(":")) lower = this.test();
    if (!this.isOp(":")) return lower;
    this.p++;
    var upper = null, step = null;
    if (!this.isOp(":") && !this.isOp("]") && !this.isOp(",")) upper = this.test();
    if (this.eatOp(":") && !this.isOp("]") && !this.isOp(",")) step = this.test();
    return { k: "slice", line: line, lower: lower, upper: upper, step: step };
  };

  /* ---------------- 目标改写 ---------------- */
  function asTarget(n, parser) {
    if (!n) throw syn("invalid assignment target", parser ? parser.ln() : 0, parser && parser.file);
    switch (n.k) {
      case "tup": case "list":
        return { k: "seq", line: n.line, items: (n.items || []).map(function (it) { return asTarget(it, parser); }) };
      case "name": return { k: "name", name: n.name, line: n.line };
      case "attr": return { k: "attr", value: n.value, attr: n.attr, line: n.line };
      case "sub": return { k: "sub", value: n.value, index: n.index, line: n.line };
      case "star": return { k: "star", target: asTarget(n.value, parser), line: n.line };
      case "num": case "str": case "fstr": case "call":
        throw syn("cannot assign to " + (n.k === "call" ? "call expression" : "literal"), n.line, parser && parser.file);
      default:
        throw syn("cannot assign to " + n.k, n.line, parser && parser.file);
    }
  }
  /* 相邻字面片段合并，省掉运行时一堆空串拼接 */
  function mergeLits(parts) {
    var out = [];
    parts.forEach(function (p) {
      if (p.lit !== undefined && out.length && out[out.length - 1].lit !== undefined) out[out.length - 1].lit += p.lit;
      else out.push(p);
    });
    return out;
  }
  function docOf(body) {
    if (body[0] && body[0].k === "expr" && body[0].value && body[0].value.k === "str") return body[0].value.v;
    return null;
  }

  function parse(src, file) {
    var toks = tokenize(src, file);
    return new Parser(toks, file).module();
  }

  return { tokenize: tokenize, parse: parse, KEYWORDS: KEYWORDS, syn: syn };
});
