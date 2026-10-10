/* 喵站 · Python 沙箱 · 运行时核心
 *
 * 浏览器 <script> → window.MIAO_PYRUN；Node require() → module.exports。
 * 载入顺序：py-engine.js → py-runtime.js → py-builtin.js（内置函数与标准库挂在同一个对象上）。
 *
 * 数值表示：
 *   int   → JS number（超过安全整数用 bigint）
 *   float → PyFloat 包装对象 —— 因为 3 和 3.0 在 JS 里是同一个值，而 Python 的
 *           type()、repr()、//、% 都要区分它们。
 *   bool  → JS true/false（Python 里 bool 是 int 的子类，所以 True + 1 == 2）
 * 执行轨迹 trace：判分器靠它回答「这段代码到底经过了什么」（分支、调用、循环次数、变量终值）。
 */
(function (root, factory) {
  var eng = root.MIAO_PYFE || (typeof require === "function" ? require("./py-engine.js") : null);
  var api = factory(eng);
  if (typeof module === "object" && module.exports) module.exports = api;
  root.MIAO_PYRUN = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (ENG) {
  "use strict";

  var R = {};
  R.ENG = ENG;
  /* B 是内置函数 / 类型方法 / 标准库的注册表，由 py-builtin.js 填进来。
     两边共用同一个对象引用，所以运行时的 loadName 能直接查到。 */
  var B = { builtins: new Map(), methods: {}, attr_tables: {} };
  R.B = B;

  /* ================= 类型与构造 ================= */
  function PyFloat(v) { this.k = "float"; this.v = v; }
  function PyTuple(items) { this.k = "tuple"; this.items = items; }
  function PyDict() { this.k = "dict"; this.map = new Map(); }          /* pyKey → [key, value] */
  function PySet(isFz) { this.k = isFz ? "frozenset" : "set"; this.map = new Map(); }
  function PyBytes(b) { this.k = "bytes"; this.b = b; }
  function PyFunc(node, scope, name) {
    this.k = "func"; this.name = name || (node && node.name) || "<lambda>";
    this.node = node; this.scope = scope; this.doc = node && node.doc || null;
  }
  function PyBuiltin(name, fn, doc) { this.k = "builtin"; this.name = name; this.fn = fn; this.doc = doc || (name + "()"); }
  function PyBound(self, fn) { this.k = "bound"; this.self = self; this.fn = fn; }
  function PyClass(name, bases, dict, mod) { this.k = "class"; this.name = name; this.bases = bases; this.dict = dict; this.module = mod; }
  function PyInstance(cls) { this.k = "obj"; this.cls = cls; this.dict = new Map(); }
  function PyModule(name, dict) { this.k = "module"; this.name = name; this.dict = dict || new Map(); }
  function PyRange(a, b, c) { this.k = "range"; this.start = a; this.stop = b; this.step = c; }
  function PyType(name, pyname) { this.k = "type"; this.name = name; this.pyname = pyname || name; }
  var NONE = { k: "none" };
  var NOTSET = { k: "notset" };
  var OBJECT_CLS = null;   /* 下面补好依赖顺序后再建 */
  R.OBJECT_CLS = null;

  var TYPES = {};
  ["int", "float", "bool", "str", "bytes", "list", "tuple", "dict", "set", "frozenset",
    "NoneType", "object", "type", "function", "builtin_function_or_method", "range",
    "method", "module"].forEach(function (n) { TYPES[n] = new PyType(n); });
  OBJECT_CLS = new PyClass("object", [], new Map(), "builtins");
  R.OBJECT_CLS = OBJECT_CLS;

  /* ================= 基础判定 ================= */
  function isNum(x) { return typeof x === "number" || typeof x === "bigint" || x instanceof PyFloat || x === true || x === false; }
  function isBool(x) { return x === true || x === false; }
  function isInt(x) { return (typeof x === "number" && Number.isInteger(x)) || typeof x === "bigint"; }
  function isStr(x) { return typeof x === "string"; }
  function numOf(x) {
    if (x === true) return 1;
    if (x === false) return 0;
    if (typeof x === "bigint") return Number(x);
    if (x instanceof PyFloat) return x.v;
    return x;
  }
  function typeName(x) {
    if (x === NONE) return "NoneType";
    if (isBool(x)) return "bool";
    if (isStr(x)) return "str";
    if (x instanceof PyFloat) return "float";
    if (typeof x === "number" || typeof x === "bigint") return "int";
    if (Array.isArray(x)) return "list";
    if (x instanceof PyTuple) return "tuple";
    if (x instanceof PyDict) return "dict";
    if (x instanceof PySet) return x.k;
    if (x instanceof PyBytes) return "bytes";
    if (x instanceof PyFunc) return "function";
    if (x instanceof PyBuiltin) return "builtin_function_or_method";
    if (x instanceof PyBound) return "method";
    if (x instanceof PyClass) return "type";
    if (x instanceof PyInstance) return x.cls ? x.cls.name : "object";
    if (x instanceof PyModule) return "module";
    if (x instanceof PyRange) return "range";
    if (x instanceof PyType) return "type";
    if (x && x.k === "file") return x.clsName || "TextIOWrapper";
    if (x && x.k === "code") return "code";
    if (x && x.k === "view") return VIEW_NAME[x.vt] || "dict_keys";
    if (x && x.k === "iter") return "iterator";
    if (x && x.k === "exc") return x.cls.name;
    return "object";
  }
  R.isNum = isNum; R.isBool = isBool; R.isInt = isInt; R.isStr = isStr; R.numOf = numOf;
  R.typeName = typeName;
  R.NONE = NONE; R.NOTSET = NOTSET; R.TYPES = TYPES;
  function PySuper(cls, self) { this.k = "super"; this.cls = cls; this.self = self; }
  R.PySuper = PySuper;
  R.PyFloat = PyFloat; R.PyTuple = PyTuple; R.PyDict = PyDict; R.PySet = PySet; R.PyBytes = PyBytes;
  R.PyFunc = PyFunc; R.PyBuiltin = PyBuiltin; R.PyBound = PyBound; R.PyClass = PyClass;
  R.PyInstance = PyInstance; R.PyModule = PyModule; R.PyRange = PyRange; R.PyType = PyType;

  /* ================= 数字 ================= */
  function mkFloat(v) { return new PyFloat(v); }
  function mkInt(v) { return typeof v === "bigint" ? v : Math.trunc(v); }
  function safeInt(n) { return typeof n === "bigint" || Math.abs(n) <= Number.MAX_SAFE_INTEGER ? n : String(n); }
  function isZero(x) {
    if (x === true || x === false) return x === false;
    if (typeof x === "bigint") return x === 0n;
    return numOf(x) === 0;
  }
  function floatVal(x) { return x instanceof PyFloat ? x.v : numOf(x); }

  /* Python 的 float repr：最短可还原 + 阈值内不用科学计数 */
  function reprFloat(v) {
    if (Number.isNaN(v)) return "nan";
    if (v === Infinity) return "inf";
    if (v === -Infinity) return "-inf";
    var s = String(v);
    if (/[eE]/.test(s)) {
      var m = /^(-?[\d.]+)[eE]([+-]?)(\d+)$/.exec(s);
      if (m) s = m[1] + "e" + (m[2] === "-" ? "-" : "+") + ("00" + m[3]).slice(-2);
      if (!/[.]/.test(s.split(/[eE]/)[0])) s = s.replace("e", ".0e");
      return s;
    }
    var av = Math.abs(v);
    if (av !== 0 && (av < 1e-4 || av >= 1e16)) {                    /* 该用科学计数 */
      var e = Math.floor(Math.log10(av));
      var mant = v / Math.pow(10, e);
      var ms = String(Number(mant.toPrecision(16 - Math.abs(e) > 14 ? 1 : 17)));
      ms = String(parseFloat(mant.toPrecision(16)));
      if (/[eE]/.test(ms)) { var mm = /(-?[\d.]+)[eE]([+-]?)(\d+)/.exec(ms); ms = mm[1]; }
      if (!/[.]/.test(ms)) ms += ".0";
      return ms + "e" + (e < 0 ? "-" : "+") + ("00" + Math.abs(e)).slice(-2);
    }
    if (Number.isInteger(v) && String(v).indexOf(".") < 0) return s + ".0";
    return s;
  }
  function reprInt(x) { return typeof x === "bigint" ? x.toString() : String(x); }

  /* ================= str / repr ================= */
  var NEED_ESC = { "\\": "\\\\", "\n": "\\n", "\r": "\\r", "\t": "\\t", "\x07": "\\a", "\b": "\\b", "\f": "\\f", "\v": "\\v", "\0": "\\x00" };
  function reprStr(s) {
    var quote = "'";
    if (s.indexOf("'") >= 0 && s.indexOf('"') < 0) quote = '"';
    var out = quote;
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (NEED_ESC[c]) { out += NEED_ESC[c]; continue; }
      if (c === quote) { out += "\\" + quote; continue; }
      var code = c.codePointAt(0);
      if (code < 32 || code === 127) { out += "\\x" + ("0" + code.toString(16)).slice(-2); continue; }
      if (code > 0xFFFF) { out += "\\U" + code.toString(16).padStart(8, "0"); i++; continue; }
      if (code > 126 && !isPrintableWide(code)) { out += "\\x" + code.toString(16).padStart(2, "0"); continue; }
      out += c;
    }
    return out + quote;
  }
  function isPrintableWide(code) {
    /* 中日韩、标点、全角等都按可打印处理（Python 用 unicodedata 判定，这里取够用范围） */
    return (code >= 0xA0 && code <= 0x02FF) || (code >= 0x2000 && code <= 0x2BFF) ||
      (code >= 0x3000 && code <= 0x30FF) || (code >= 0x3100 && code <= 0x9FFF) ||
      (code >= 0xF900 && code <= 0xFAFF) || (code >= 0xFE30 && code <= 0xFE4F) ||
      (code >= 0xFF00 && code <= 0xFF65) || (code >= 0xFFE0 && code <= 0xFFE6) ||
      (code >= 0xD800 && code <= 0xDFFF) || (code >= 0x0370 && code <= 0x04FF) ||
      (code >= 0x0590 && code <= 0x05FF) || (code >= 0x0E00 && code <= 0x0E7F) ||
      (code >= 0x1000 && code <= 0x10FF) || (code >= 0x1E00 && code <= 0x1EFF);
  }
  function bytesRepr(b) {
    var out = "b'";
    for (var i = 0; i < b.length; i++) {
      var c = b[i];
      if (c === 0x27) out += "\\'";
      else if (c === 0x5C) out += "\\\\";
      else if (c === 0x0A) out += "\\n";
      else if (c === 0x09) out += "\\t";
      else if (c === 0x0D) out += "\\r";
      else if (c >= 0x20 && c < 0x7F) out += String.fromCharCode(c);
      else out += "\\x" + ("0" + c.toString(16)).slice(-2);
    }
    return out + "'";
  }
  function repr(v, env) {
    if (v === NONE) return "None";
    if (v === true) return "True";
    if (v === false) return "False";
    if (isStr(v)) return reprStr(v);
    if (typeof v === "number") return isInt(v) ? reprInt(v) : reprFloat(v);
    if (typeof v === "bigint") return reprInt(v);
    if (v instanceof PyFloat) return reprFloat(v.v);
    if (Array.isArray(v)) return "[" + v.map(function (x) { return repr(x, env); }).join(", ") + "]";
    if (v instanceof PyTuple) return v.items.length === 1 ? "(" + repr(v.items[0], env) + ",)" :
      "(" + v.items.map(function (x) { return repr(x, env); }).join(", ") + ")";
    if (v instanceof PyDict) {
      if (!v.map.size) return "{}";
      var ds = [];
      v.map.forEach(function (kv) { ds.push(repr(kv[0], env) + ": " + repr(kv[1], env)); });
      return "{" + ds.join(", ") + "}";
    }
    if (v instanceof PySet) {
      if (!v.map.size) return v.k === "frozenset" ? "frozenset()" : "set()";
      var ss = [];
      v.map.forEach(function (x, kk) { ss.push(repr(x, env)); });
      return v.k === "frozenset" ? "frozenset({" + ss.join(", ") + "})" : "{" + ss.join(", ") + "}";
    }
    if (v instanceof PyBytes) return bytesRepr(v.b);
    if (v instanceof PyRange) return "range(" + reprInt(v.start) + ", " + reprInt(v.stop) + ", " + reprInt(v.step) + ")";
    if (v instanceof PyFunc) return "<function " + v.name + " at 0x" + (v.__oid || (v.__oid = ++OID)).toString(16).padStart(12, "0") + ">";
    if (v instanceof PyBuiltin) return "<built-in function " + v.name + ">";
    if (v instanceof PyBound) return "<bound method " + (v.self && v.self.cls ? v.self.cls.name + "." : "") + v.fn.name + " of " + repr(v.self, env) + ">";
    if (v instanceof PyClass) return "<class '" + (v.module === "__main__" || !v.module ? v.name : v.module + "." + v.name) + "'>";
    if (v instanceof PyType) return "<class '" + v.pyname + "'>";
    if (v instanceof PyModule) return "<module '" + v.name + "'>";
    if (v instanceof PyInstance) {
      var r = dunder(v, "__repr__", env);
      if (r) return toStr(call(r, [], {}, env), env);
      return "<" + (v.cls.name) + " object>";
    }
    if (v && v.k === "file") return "<" + (v.binary ? "_io.BufferedReader" : "_io.TextIOWrapper") +
      " name=" + reprStr(String(v.name)) + " mode=" + reprStr(v.mode) +
      (v.encoding ? " encoding='" + normEnc(v.encoding) + "'" : "") + ">";
    if (v && v.k === "view") {
      var vin = v.items.map(function (x) { return repr(x, env); }).join(", ");
      if (v.vt === "keys") return "dict_keys([" + vin + "])";
      if (v.vt === "values") return "dict_values([" + vin + "])";
      return "dict_items([" + vin + "])";
    }
    if (v && v.k === "iter") return "<" + typeName(v) + " object>";
    return String(v);
  }
  function str(v, env) {
    if (isStr(v)) return v;
    if (v instanceof PyInstance) {
      var s = dunder(v, "__str__", env);
      if (s) return toStr(call(s, [], {}, env), env);
      var r = dunder(v, "__repr__", env);
      if (r) return toStr(call(r, [], {}, env), env);
    }
    return repr(v, env);
  }
  function toStr(v, env) { return isStr(v) ? v : str(v, env); }
  R.repr = repr; R.str = str; R.toStr = toStr; R.reprStr = reprStr; R.reprFloat = reprFloat;
  R.bytesRepr = bytesRepr;

  /* 编码别名归一（CPython 的 repr 里显示的是 codecs 的标准名） */
  var ENC_ALIAS = { "utf-8": "utf-8", utf8: "utf-8", UTF8: "utf-8", UTF_8: "utf-8", ascii: "utf-8", us_ascii: "ascii", gbk: "gbk", gb2312: "gb2312", latin1: "iso-8859-1" };
  function normEnc(e) {
    if (!e) return "utf-8";
    var up = String(e).toUpperCase().replace(/[^A-Z0-9]/g, "_");
    if (up === "UTF_8") return "utf-8";
    if (up === "ASCII") return "utf_8";
    if (up === "GBK") return "gbk";
    if (up === "GB2312") return "gb2312";
    if (up === "LATIN_1" || up === "ISO_8859_1") return "iso-8859-1";
    return ENC_ALIAS[e] || String(e);
  }
  R.normEnc = normEnc;

  /* ================= 真值判定 ================= */
  function truthy(v, env) {
    if (v === NONE || v === false) return false;
    if (v === true) return true;
    if (typeof v === "number") return v !== 0;
    if (typeof v === "bigint") return v !== 0n;
    if (v instanceof PyFloat) return v.v !== 0;
    if (isStr(v) || Array.isArray(v)) return v.length > 0;
    if (v instanceof PyTuple) return v.items.length > 0;
    if (v instanceof PyDict || v instanceof PySet) return v.map.size > 0;
    if (v instanceof PyBytes) return v.b.length > 0;
    if (v instanceof PyInstance) {
      var b = dunder(v, "__bool__", env);
      if (b) return truthy(call(b, [], {}, env), env);
      var l = dunder(v, "__len__", env);
      if (l) return truthy(call(l, [], {}, env), env);
      return true;
    }
    return v !== undefined && v !== null;
  }
  R.truthy = truthy;

  /* ================= 相等与哈希 ================= */
  function pyEq(a, b, env) {
    if (a === b) return true;
    if (a === NONE || b === NONE) return a === b;
    if (isNum(a) && isNum(b)) {
      if (a instanceof PyFloat || b instanceof PyFloat) return floatVal(a) === floatVal(b);
      if (isBool(a) || isBool(b)) return numOf(a) === numOf(b);          /* True == 1 → True */
      if (typeof a === "bigint" || typeof b === "bigint") {
        try { return BigInt(a) === BigInt(b); }                           /* 大整数按精确值比，不能先转 double */
        catch (e) { return Number(a) === Number(b); }
      }
      return a === b;
    }
    if (isStr(a) && isStr(b)) return a === b;
    if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every(function (x, i) { return pyEq(x, b[i], env); });
    if (a instanceof PyTuple && b instanceof PyTuple) return pyEq(a.items, b.items, env);
    if (a instanceof PyDict && b instanceof PyDict) {
      if (a.map.size !== b.map.size) return false;
      var same = true;
      a.map.forEach(function (kv, key) {
        if (!b.map.has(key)) same = false;
        else if (!pyEq(kv[1], b.map.get(key)[1], env)) same = false;
      });
      return same;
    }
    if ((a instanceof PySet || a instanceof PyBytes) && (b instanceof PySet || b instanceof PyBytes)) {
      if (a.k !== b.k) return false;
      if (a instanceof PyBytes) return a.b.length === b.b.length && a.b.every(function (x, i) { return x === b.b[i]; });
      if (a.map.size !== b.map.size) return false;
      var ok2 = true;
      a.map.forEach(function (_, key) { if (!b.map.has(key)) ok2 = false; });
      return ok2;
    }
    if (a instanceof PyInstance) {
      var eq = dunder(a, "__eq__", env);
      if (eq) { var r = call(eq, [b], {}, env); if (r !== NOTSET) return truthy(r, env); }
    }
    if (b instanceof PyInstance) {
      var eq2 = dunder(b, "__eq__", env);
      if (eq2) { var r2 = call(eq2, [a], {}, env); if (r2 !== NOTSET) return truthy(r2, env); }
    }
    if (a instanceof PyRange && b instanceof PyRange) {
      var la = a.step > 0 ? Math.max(0, Math.ceil((a.stop - a.start) / a.step)) : Math.max(0, Math.ceil((a.start - a.stop) / -a.step));
      var lb = b.step > 0 ? Math.max(0, Math.ceil((b.stop - b.start) / b.step)) : Math.max(0, Math.ceil((b.start - b.stop) / -b.step));
      if (la === 0 && lb === 0) return true;
      return a.start === b.start && a.stop === b.stop && a.step === b.step;
    }
    if (typeof a === "function" || typeof b === "function") return false;
    return false;
  }
  R.pyEq = pyEq;

  function hashKey(v, env) {
    if (v === NONE) return "N";
    if (v === true) return "i:1";
    if (v === false) return "i:0";
    if (typeof v === "number") { if (!Number.isInteger(v)) return "n:" + reprFloat(v); return "n:" + reprInt(v); }
    if (typeof v === "bigint") return "n:" + v.toString();
    if (v instanceof PyFloat) return Number.isInteger(v.v) ? "n:" + reprInt(v.v) : "n:" + reprFloat(v.v);
    if (isStr(v)) return "s:" + v;
    if (v instanceof PyTuple) return "t(" + v.items.map(function (x) { return hashKey(x, env); }).join(",") + ")";
    if (v instanceof PyBytes) return "b:" + Array.prototype.join.call(v.b, ",");
    if (v instanceof PyClass || v instanceof PyFunc || v instanceof PyBuiltin || v instanceof PyModule || v instanceof PyType) {
      return "o:" + (v.__oid || (v.__oid = ++OID));
    }
    if (v instanceof PyInstance) {
      var h = dunder(v, "__hash__", env);
      if (h) return "u:" + toStr(call(h, [], {}, env), env);
      if (!v.__oid) v.__oid = ++OID;
      return "o:" + v.__oid;
    }
    if (Array.isArray(v) || v instanceof PyDict || v instanceof PySet) throw errNew("TypeError", ["unhashable type: '" + typeName(v) + "'"], env);
    return "o:" + (++OID);
  }
  var OID = 0;
  R.hashKey = hashKey;

  /* ================= 异常 ================= */
  /* 异常继承树照 CPython：except Exception / except OSError 这类判断才成立 */
  var EXC_BASE = {
    BaseException: [], Exception: ["BaseException"],
    TypeError: ["Exception"], ValueError: ["Exception"], ArithmeticError: ["Exception"],
    ZeroDivisionError: ["ArithmeticError"], OverflowError: ["ArithmeticError"], FloatingPointError: ["ArithmeticError"],
    LookupError: ["Exception"], IndexError: ["LookupError"], KeyError: ["LookupError"],
    NameError: ["Exception"], UnboundLocalError: ["NameError"], AttributeError: ["Exception"],
    ImportError: ["Exception"], ModuleNotFoundError: ["ImportError"],
    SyntaxError: ["Exception"], IndentationError: ["SyntaxError"], TabError: ["IndentationError"],
    RuntimeError: ["Exception"], NotImplementedError: ["RuntimeError"], RecursionError: ["RuntimeError"],
    StopIteration: ["Exception"], GeneratorExit: ["BaseException"],
    OSError: ["Exception"], FileNotFoundError: ["OSError"], FileExistsError: ["OSError"],
    IsADirectoryError: ["OSError"], NotADirectoryError: ["OSError"], PermissionError: ["OSError"],
    EOFError: ["Exception"], MemoryError: ["Exception"], AssertionError: ["Exception"],
    KeyboardInterrupt: ["BaseException"], SystemExit: ["BaseException"],
    UnicodeError: ["ValueError"], UnicodeDecodeError: ["UnicodeError"], UnicodeEncodeError: ["UnicodeError"],
    JSONDecodeError: ["ValueError"], InvalidOperation: ["ArithmeticError"]
  };
  var EXC_TYPES = {};
  function excType(name) {
    if (!EXC_TYPES[name]) EXC_TYPES[name] = new PyType(name, name);
    return EXC_TYPES[name];
  }
  function excBases(name) {
    var out = [], list = EXC_BASE[name] || [];
    list.forEach(function (b) { out.push(excClass(b)); });
    return out;
  }
  var EXC_CLASSES = {};
  function excClass(name) {
    if (!EXC_CLASSES[name]) {
      EXC_CLASSES[name] = new PyClass(name, excBases(name), new Map(), "builtins");
      EXC_CLASSES[name].isExc = name;
      EXC_CLASSES[name].dict.set("__init__", new PyBuiltin("__init__", function (args, kw, env) {
        var self = args[0], rest = args.slice(1);
        self.args = rest;
        self.msg = rest.length ? toStr(rest[0], env) : "";
        self.dict.set("args", new PyTuple(rest));
        self.dict.set("msg", self.msg);
        self.dict.set("name", name);
        if (rest.length >= 2 && self.cls && derivesOSError(self.cls)) {
          self.dict.set("errno", rest[0]);
          var full = toStr(rest[1], env), cut = full.indexOf(": ");
          self.dict.set("strerror", cut >= 0 ? full.slice(0, cut) : full);
          self.dict.set("filename", cut >= 0 ? full.slice(cut + 2) : NONE);
        }
        return NONE;
      }));
    }
    return EXC_CLASSES[name];
  }
  function errNew(name, args, env) {
    var cls = (env && env.excCls && env.excCls[name]) || excClass(name);
    var inst = new PyInstance(cls);
    inst.k2 = "exc";
    inst.args = args || [];
    inst.msg = args && args.length ? toStr(args[0], env) : "";
    inst.dict.set("args", new PyTuple(inst.args));
    inst.dict.set("name", name);
    if (args && args.length >= 2 && (EXC_BASE[name] || []).indexOf("OSError") >= 0) {
      /* OSError 家族：args = (errno, strerror)，strerror 里带上文件名尾巴 */
      inst.dict.set("errno", args[0]);
      var full = toStr(args[1], env);
      var cut = full.indexOf(": ");
      inst.dict.set("strerror", cut >= 0 ? full.slice(0, cut) : full);
      inst.dict.set("filename", cut >= 0 ? full.slice(cut + 2) : NONE);
      inst.dict.set("filename2", NONE);
    } else if (name === "SyntaxError") {
      inst.dict.set("msg", inst.msg);
      inst.dict.set("lineno", 0);
      inst.dict.set("offset", NONE);
      inst.dict.set("text", NONE);
    }
    return inst;
  }
  function errFromPy(v, env) {                    /* raise 一个实例或类 */
    if (v instanceof PyInstance && v.cls && v.cls.isExc) {
      var e = new PyInstance(v.cls);
      e.k2 = "exc";
      e.args = v.args || [];
      e.msg = v.msg || "";
      e.fromPy = true;
      return e;
    }
    if (v instanceof PyClass && v.isExc) return errNew(v.isExc, [], env);
    throw errNew("TypeError", ["exceptions must derive from Exception"], env);
  }
  function excStr(e, env) {
    if (e.cls && e.cls.isExc === "KeyError" && e.args.length === 1) return repr(e.args[0], env);
    if (e.cls && derivesOSError(e.cls) && e.args.length >= 2) {
      return "[Errno " + numOf(e.args[0]) + "] " + toStr(e.args[1], env);
    }
    if (e.args.length === 1) return toStr(e.args[0], env);
    if (!e.args.length) return e.msg || "";
    return "[" + e.args.map(function (a) { return toStr(a, env); }).join(", ") + "]";
  }
  function derivesOSError(cls) {
    var c = cls;
    while (c) { if (c.isExc === "OSError") return true; c = c.bases.length ? c.bases[0] : null; }
    return false;
  }
  function isExcInstance(inst, clsName, env) {
    var c = inst.cls;
    while (c) {
      if (c.isExc === clsName) return true;
      c = c.bases[0] || null;
    }
    return false;
  }
  R.excClass = excClass; R.excType = excType; R.errNew = errNew; R.errFromPy = errFromPy;
  R.excStr = excStr; R.EXC_BASE = EXC_BASE; R.isExcInstance = isExcInstance;

  /* 让异常对象的 str() / repr() 说出 Python 的话：
     str(e) 是报错正文，repr(e) 是 ClassName(正文) ——  traceback 末行用的是前者拼法 */
  var _repr = repr;
  repr = function (v, env) {
    if (v && v.k2 === "exc") {
      var s = excStr(v, env);
      return v.cls.name + "(" + (s ? reprStr(s) : "") + ")";
    }
    return _repr(v, env);
  };
  var _str = str;
  str = function (v, env) {
    if (v && v.k2 === "exc") return excStr(v, env);
    return _str(v, env);
  };
  R.repr = repr; R.str = str;
  R.excLine = function (v, env) { return v && v.k2 === "exc" ? (excStr(v, env) ? v.cls.name + ": " + excStr(v, env) : v.cls.name) : repr(v, env); };

  /* ================= 格式化微语言（f-string 与 str.format 共用） ================= */
  /* [[fill]align][sign][#][0][width][,][.precision][type] */
  function parseSpec(spec) {
    spec = spec == null ? "" : String(spec);
    var o = { fill: null, align: null, sign: null, alt: false, zero: false, width: null, thousands: false, prec: null, type: "" };
    var m = /^(?:(.)?([<>^=]))?([+\- ])?(#)?(0)?(\d+)?(,)?(?:\.(\d+))?([bBboxXXeEfFgGn%scd])?$/.exec(spec);
    if (!m) return o;
    o.fill = m[1] || null;
    o.align = m[2] || null;
    o.sign = m[3] || null;
    o.alt = !!m[4];
    o.zero = !!m[5];
    o.width = m[6] != null ? Number(m[6]) : null;
    o.thousands = !!m[7];
    o.prec = m[8] != null ? Number(m[8]) : null;
    o.type = m[9] || "";
    if (o.zero) { o.align = o.align || "="; o.fill = o.fill || "0"; }
    return o;
  }
  function group3(s) { return s.replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
  function fmtNum(v, spec, env) {
    var o = parseSpec(spec);
    var num = numOf(v), isF = v instanceof PyFloat || /\./.test(String(spec)) === false && false;
    isF = v instanceof PyFloat || !Number.isInteger(num);
    var t = o.type;
    var neg = num < 0, a = Math.abs(num);
    var out, prefix = "";
    if (t === "d" || t === "i") {
      if (!Number.isInteger(num) && !(v instanceof PyFloat)) throw errNew("ValueError", ["Unknown type code 'd' for float"], env);
      out = Number.isInteger(a) ? (typeof v === "bigint" ? (v < 0n ? (-v).toString() : v.toString()) : String(a)) : reprFloat(a);
    } else if (t === "") {
      /* 空说明符 = str()：浮点必须保住小数点（270/3 是 90.0，不是 90） */
      out = (v instanceof PyFloat) ? reprFloat(a) : (typeof v === "bigint" ? (v < 0n ? (-v).toString() : v.toString()) : String(a));
    } else if (t === "f") {
      var p = o.prec == null ? 6 : o.prec;
      out = a.toFixed(p);
    } else if (t === "e") {
      var pe = o.prec == null ? 6 : o.prec;
      var s2 = a.toExponential(pe);
      out = s2.replace(/e([+-])(\d)$/, "e$10$2");
    } else if (t === "g" || t === "G" || t === "n") {
      var pg = o.prec == null ? null : o.prec;
      out = String(pg == null ? a : Number(a.toPrecision(pg)));
      if (t === "n" && o.thousands) out = group3(out);
    } else if (t === "x" || t === "X") {
      out = BigInt(Math.trunc(num)).toString(16);
      if (t === "X") out = out.toUpperCase();
      if (o.alt) prefix = "0x";
    } else if (t === "o") { out = BigInt(Math.trunc(num)).toString(8); prefix = "0o"; }
    else if (t === "b") { out = BigInt(Math.trunc(num)).toString(2); prefix = "0b"; }
    else if (t === "%") { out = (a * 100).toFixed(o.prec == null ? 6 : o.prec) + "%"; }
    else if (t === "c") { return String.fromCharCode(num); }
    else throw errNew("ValueError", ["Invalid format specifier '" + spec + "'"], env);
    if (t === "d" || t === "i" || t === "" || t === "f" || t === "e" || t === "g") {
      if (o.thousands && (t === "d" || t === "i" || t === "")) {
        var dot = out.indexOf(".");
        out = (dot < 0 ? group3(out) : group3(out.slice(0, dot)) + out.slice(dot));
      } else if (o.thousands && t === "f") {
        var d2 = out.indexOf(".");
        out = d2 < 0 ? group3(out) : group3(out.slice(0, d2)) + out.slice(d2);
      }
    }
    var signCh = neg ? "-" : (o.sign === "+" ? "+" : o.sign === " " ? " " : "");
    var body;
    if (o.zero && o.width) {
      var padLen = Math.max(0, o.width - out.length - signCh.length - prefix.length);
      body = signCh + prefix + "0".repeat(padLen) + out;
    } else {
      body = signCh + prefix + out;
    }
    return pad(body, o, spec);
  }
  function pad(s, o, spec) {
    var w = o.width || 0;
    if (s.length >= w) return s;
    var need = w - s.length;
    var fill = o.fill || " ";
    var align = o.align || (o.zero ? "=" : ">");
    if (o.zero) align = "=";
    if (align === ">") return fill.repeat(need) + s;
    if (align === "<") return s + fill.repeat(need);
    if (align === "^") {
      var l = Math.floor(need / 2), r = need - l;
      return fill.repeat(l) + s + fill.repeat(r);
    }
    /* = ：符号与数字之间填充 */
    if (/^[+-]/.test(s)) return s[0] + fill.repeat(need) + s.slice(1);
    return fill.repeat(need) + s;
  }
  function formatValue(v, spec, env) {
    spec = spec || "";
    if (isStr(v)) {
      var o = parseSpec(spec);
      var s = v;
      if (o.prec != null) s = s.slice(0, o.prec);
      if (!o.align && !o.zero) o.align = "<";                 /* 字符串默认左对齐 */
      return pad(s, o, spec);
    }
    /* 布尔：默认按 "True"/"False" 排；只有显式整数型说明符才当数字（format(True,'d')=='1'） */
    if (isBool(v)) {
      if (/[diBeXxon%]/.test(spec)) return fmtNum(v, spec, env);
      return formatValue(v ? "True" : "False", spec, env);
    }
    if (isNum(v)) return fmtNum(v, spec, env);
    if (v instanceof PyInstance) {
      var f = dunder(v, "__format__", env);
      if (f) return toStr(call(f, [spec], {}, env), env);
    }
    if (spec === "" || spec === "s") return toStr(v, env);
    if (/^[\d\s<>^=]*$/.test(spec)) return pad(toStr(v, env), parseSpec(spec), spec);
    throw errNew("TypeError", ["unsupported format string passed to " + typeName(v) + "__format__"], env);
  }
  R.formatValue = formatValue; R.parseSpec = parseSpec;

  /* ================= 虚拟文件系统 ================= */
  function VFS(root) {
    this.root = root || "/home/miao";
    this.files = new Map();       /* 绝对路径 → {text|bytes, mtime} */
    this.dirs = new Set();
    this.cwd = ".";
    this.mkdir("/");
    this.mkdir(this.root);
  }
  VFS.prototype.norm = function (p) {
    p = String(p);
    if (!p) p = ".";
    if (p.charAt(0) === "~") p = this.root + p.slice(1);
    var abs = p.charAt(0) === "/" ? p : (this.cwd === "/" ? "" : this.cwd) + "/" + p;
    var parts = [];
    abs.split("/").forEach(function (seg) {
      if (seg === "" || seg === ".") return;
      if (seg === "..") { parts.pop(); return; }
      parts.push(seg);
    });
    return "/" + parts.join("/");
  };
  VFS.prototype.mkdir = function (p) {
    p = this.norm(p);
    this.dirs.add("/");
    if (p === "/") return;
    var acc = "", self = this;
    p.split("/").forEach(function (s) {
      if (!s) return;
      acc += "/" + s;
      self.dirs.add(acc);
    });
  };
  VFS.prototype.write = function (p, data, mode) {
    p = this.norm(p);
    this.mkdir(p.split("/").slice(0, -1).join("/") || "/", true);
    var f = this.files.get(p) || { text: "", bytes: null };
    if (typeof data === "string") f.text = mode === "a" ? f.text + data : data;
    else {
      var enc = new TextEncoder();
      var nb = data instanceof PyBytes ? data.b : enc.encode(data);
      if (!f.bytes || mode !== "a") f.bytes = nb;
      else {
        var cat = new Uint8Array(f.bytes.length + nb.length);
        cat.set(f.bytes, 0); cat.set(nb, f.bytes.length);
        f.bytes = cat;
      }
      f.text = null;
    }
    f.mtime = f.mtime ? f.mtime + 1 : 1000;
    this.files.set(p, f);
  };
  VFS.prototype.append = function (p, data) { this.write(p, data, "a"); };
  VFS.prototype.read = function (p) {
    var f = this.files.get(this.norm(p));
    if (!f) return null;
    if (f.text !== null && f.text !== undefined) return f.text;
    return new TextDecoder("utf-8", { fatal: false }).decode(f.bytes || new Uint8Array(0));
  };
  VFS.prototype.readBytes = function (p) {
    var f = this.files.get(this.norm(p));
    if (!f) return null;
    if (f.bytes) return f.bytes;
    return new TextEncoder().encode(f.text || "");
  };
  VFS.prototype.exists = function (p) { p = this.norm(p); return this.files.has(p) || this.dirs.has(p); };
  VFS.prototype.isDir = function (p) { return this.dirs.has(this.norm(p)); };
  VFS.prototype.isFile = function (p) { return this.files.has(this.norm(p)); };
  VFS.prototype.remove = function (p) {
    p = this.norm(p);
    if (this.dirs.has(p) && p !== "/") {
      var kids = Array.from(this.files.keys()).concat(Array.from(this.dirs));
      if (kids.some(function (k) { return k !== p && (k.indexOf(p + "/") === 0); })) throw errNew("IsADirectoryError", [2, "Directory not empty: '" + p + "'"]);
      this.dirs.delete(p);
      return;
    }
    this.files.delete(p);
  };
  VFS.prototype.rmtree = function (p) {
    p = this.norm(p);
    var self = this;
    Array.from(this.files.keys()).forEach(function (k) { if (k === p || k.indexOf(p + "/") === 0) self.files.delete(k); });
    Array.from(this.dirs).forEach(function (k) { if (k === p || k.indexOf(p + "/") === 0) self.dirs.delete(k); });
  };
  VFS.prototype.list = function (p) {
    p = this.norm(p);
    var out = [], seen = {};
    var pre = p === "/" ? "/" : p + "/";
    this.files.forEach(function (_, k) {
      if (k.indexOf(pre) !== 0) return;
      var rest = k.slice(pre.length);
      if (rest && rest.indexOf("/") < 0 && !seen[rest]) { seen[rest] = 1; out.push(rest); }
    });
    this.dirs.forEach(function (d) {
      if (d.indexOf(pre) !== 0) return;
      var rest = d.slice(pre.length);
      if (rest && rest.indexOf("/") < 0 && !seen[rest]) { seen[rest] = 1; out.push(rest); }
    });
    return out;
  };
  VFS.prototype.size = function (p) {
    var f = this.files.get(this.norm(p));
    if (!f) return 0;
    if (f.bytes) return f.bytes.length;
    return new TextEncoder().encode(f.text || "").length;
  };
  R.VFS = VFS;

  /* ================= 作用域 ================= */
  function Scope(kind, parent, vars) {
    this.kind = kind;                 /* module | func | class | comp */
    this.parent = parent;
    this.vars = vars || new Map();
    this.pendingGlobal = null;        /* def 里声明 global 的名字 */
    this.pendingNonLocal = null;      /* def 里声明 nonlocal 的名字 */
  }
  Scope.prototype.get = function (name) { return this.vars.get(name); };
  function assign(sc, name, val, env) {
    if (sc.pendingGlobal && sc.pendingGlobal.has(name)) { env.globals.vars.set(name, val); return; }
    if (sc.pendingNonLocal && sc.pendingNonLocal.has(name)) {
      var p = sc.parent;
      while (p && p.kind !== "module") { if (p.vars.has(name)) { p.vars.set(name, val); return; } p = p.parent; }
      throw errNew("SyntaxError", ["no binding for nonlocal '" + name + "' found"], env);
    }
    sc.vars.set(name, val);
  }
  R.Scope = Scope; R.assign = assign;

  /* ================= 属性与元素协议 ================= */
  /* C3 线性化（和 CPython 的 __mro__ 顺序一致，第 40 课会把它打印出来） */
  function mro(cls) {
    if (!cls) return [];
    if (cls._mro) return cls._mro;
    var seqs = (cls.bases || []).map(mro).filter(function (l) { return l && l.length; });
    if (cls.bases && cls.bases.length) seqs.push(cls.bases.slice());
    var out = [cls], seen = new Set([cls]);
    while (seqs.length) {
      var picked = null;
      for (var i = 0; i < seqs.length && !picked; i++) {
        var head = seqs[i][0];
        if (!head) continue;
        var inTail = seqs.some(function (s, j) { return j !== i && s.indexOf(head) > 0; });
        if (!inTail) picked = head;
      }
      if (!picked) { picked = seqs[0][0]; }         /* 菱形冲突时退回保守取头，保证不死循环 */
      if (picked && !seen.has(picked)) { out.push(picked); seen.add(picked); }
      seqs = seqs.map(function (s) { return s[0] === picked ? s.slice(1) : s; }).filter(function (s) { return s.length; });
    }
    cls._mro = out;
    return out;
  }
  /* 读者自己写的协议方法（__str__ / __len__ / __eq__ …）；内置兜底不算 */
  function dunder(inst, name, env) {
    var a = inst instanceof PyClass ? classAttr(inst, name, env) : lookupAttr(inst, name, env);
    if (!a || a.pyDefined === false) return null;
    if (a.v instanceof PyFunc || a.v instanceof PyBuiltin || a.v instanceof PyBound) return a.v;
    return null;
  }
  R.dunder = dunder;
  function lookupAttr(inst, name, env) {
    var cls = inst.cls;
    var found = null, holder = null;
    var chain = cls ? mro(cls) : [];
    for (var i = 0; i < chain.length; i++) {
      if (chain[i].dict.has(name)) { found = chain[i].dict.get(name); holder = chain[i]; break; }
    }
    if (found === null) {
      if (inst.dict.has(name)) return { v: inst.dict.get(name), pyDefined: true, own: true };
      if (cls && cls.name) {
        var b = builtInAttr(inst, name, env);
        if (b !== NOTSET) return { v: b, pyDefined: false };
      }
      return null;
    }
    if ((found instanceof PyFunc || found instanceof PyBuiltin) && cls) {
      return { v: new PyBound(inst, found), pyDefined: true, holder: holder };
    }
    if (found instanceof PyClass) return { v: found, pyDefined: true };
    return { v: found, pyDefined: true };
  }
  function builtInAttr(inst, name, env) {
    if (name === "__dict__") { var d = new PyDict(); inst.dict.forEach(function (v, k) { dSet(d, k, v, env); }); return d; }
    if (name === "__class__") return inst.cls || NOTSET;
    if (name === "args" && inst.cls && inst.cls.isExc && inst.dict.has("args")) return inst.dict.get("args");
    if (inst.k2 === "exc") {
      /* raise 之外，异常对象还带这几个属性，第 44 课的 except 分支会读它们 */
      if (name === "__cause__") return inst.cause || NONE;
      if (name === "__context__") return inst.context || NONE;
      if (name === "__traceback__") return NONE;
      if (name === "__suppress_context__") return false;
    }
    return NOTSET;
  }
  function classAttr(cls, name, env) {
    var chain = mro(cls);
    for (var i = 0; i < chain.length; i++) if (chain[i].dict.has(name)) return { v: chain[i].dict.get(name), pyDefined: true };
    if (name === "__name__") return { v: cls.name, pyDefined: true };
    if (name === "__bases__") return { v: new PyTuple(cls.bases || []), pyDefined: true };
    if (name === "__mro__") return { v: new PyTuple(mro(cls)), pyDefined: true };
    if (name === "__doc__") return { v: cls.doc === undefined ? NONE : cls.doc, pyDefined: true };
    if (cls.isExc && name === "args") return { v: new PyTuple([]), pyDefined: true };
    return null;
  }
  R.lookupAttr = lookupAttr; R.classAttr = classAttr; R.mro = mro;

  function attrGet(obj, name, env) {
    if (obj instanceof PyType) {
      if (name === "__name__") return obj.pyname;
      if (name === "__qualname__") return obj.pyname;
      if (name === "name") return obj.name;
      throw errNew("AttributeError", ["type object '" + obj.pyname + "' has no attribute '" + name + "'"], env);
    }
    if (obj && obj.k === "file" && typeof obj.pyAttr === "function") return obj.pyAttr(name, env);
    if (obj && obj.k === "view") {
      var vt = VIEW_NAME[obj.vt];
      if (name === "__len__") return new PyBuiltin("__len__", function () { return obj.items.length; }, name);
      if (name === "keys" && obj.vt !== "values") return new PyBuiltin("keys", function (args, kw, e2) {
        return new PyTuple(obj.items.map(function (x) { return x instanceof PyTuple ? x.items[0] : x; }));
      }, name);
      throw errNew("AttributeError", ["'" + vt + "' object has no attribute '" + name + "'"], env);
    }
    if (obj && obj.k === "range") {
      if (name === "__len__") return new PyBuiltin("__len__", function () { return rangeLen(obj, env); }, name);
      if (name === "count") return new PyBuiltin("count", function (args) {
        var n = numOf(args[0]), k = 0;
        for (var x = obj.start; obj.step > 0 ? x < obj.stop : x > obj.stop; x += obj.step) if (x === n) k++;
        return k;
      }, name);
      if (name === "start" || name === "stop" || name === "step") return obj[name];
    }
    if (obj.k === "super") {
      var chain = mro(obj.cls), from = chain.indexOf(obj.cls);
      for (var i = Math.max(0, from) + 1; i < chain.length; i++) {
        if (chain[i].dict.has(name)) {
          var v0 = chain[i].dict.get(name);
          return v0 instanceof PyFunc || v0 instanceof PyBuiltin ? new PyBound(obj.self, v0) : v0;
        }
      }
      throw errNew("AttributeError", ["super object has no attribute '" + name + "'"], env);
    }
    if (obj instanceof PyInstance) {
      var a = lookupAttr(obj, name, env);
      if (a) return a.v;
      throw errNew("AttributeError", ["'" + obj.cls.name + "' object has no attribute '" + name + "'"], env);
    }
    if (obj instanceof PyClass) {
      var c = classAttr(obj, name, env);
      if (c) return c.v;
      throw errNew("AttributeError", ["type object '" + obj.name + "' has no attribute '" + name + "'"], env);
    }
    if (obj instanceof PyModule) {
      if (obj.dict.has(name)) return obj.dict.get(name);
      if (obj.lazy && !obj.loaded) { loadModule(obj, env); }
      if (obj.dict.has(name)) return obj.dict.get(name);
      throw errNew("AttributeError", ["module '" + obj.name + "' has no attribute '" + name + "'"], env);
    }
    var tab = B.attr_tables && B.attr_tables[typeName(obj)];
    if (tab) {
      var t = tab.get(name);
      if (t !== undefined) return typeof t === "function" ? new PyBuiltin(name, function () { return t(obj, arguments, env); }, name + "()") : t;
    }
    if (obj instanceof PyBuiltin || obj instanceof PyFunc || obj instanceof PyBound || obj instanceof PyClass) {
      if (name === "__doc__") return (obj.doc === undefined || obj.doc === null) ? NONE : obj.doc;
      if (name === "__name__") return obj.name;
      if (name === "__qualname__") return obj.name;
      if (name === "__class__") return obj instanceof PyClass ? TYPES.type : (obj instanceof PyBound ? TYPES.method : TYPES.function);
    }
    if (isStr(obj) && name === "__class__") return TYPES.str;
    throw errNew("AttributeError", ["'" + typeName(obj) + "' object has no attribute '" + name + "'"], env);
  }
  R.attrGet = attrGet;

  function attrSet(obj, name, val, env) {
    if (obj instanceof PyInstance) { obj.dict.set(name, val); return; }
    if (obj instanceof PyClass) { obj.dict.set(name, val); return; }
    if (obj instanceof PyModule) { obj.dict.set(name, val); return; }
    throw errNew("AttributeError", ["'" + typeName(obj) + "' object has no attribute '" + name + "'"], env);
  }
  function attrDel(obj, name, env) {
    if (obj instanceof PyInstance) { if (!obj.dict.delete(name)) throw errNew("AttributeError", ["'object has no attribute '" + name + "'"], env); return; }
    if (obj instanceof PyClass) { obj.dict.delete(name); return; }
    throw errNew("AttributeError", ["cannot delete attribute of '" + typeName(obj) + "' object"], env);
  }
  R.attrSet = attrSet; R.attrDel = attrDel;

  /* 容器协议 */
  function length(v, env) {
    if (isStr(v) || Array.isArray(v)) return v.length;
    if (v instanceof PyTuple) return v.items.length;
    if (v instanceof PyDict || v instanceof PySet) return v.map.size;
    if (v instanceof PyBytes) return v.b.length;
    if (v instanceof PyRange) return rangeLen(v, env);
    if (v && v.k === "view") return v.items.length;
    if (v instanceof PyInstance) {
      var l = dunder(v, "__len__", env);
      if (l) return numOf(call(l, [], {}, env));
    }
    throw errNew("TypeError", ["object of type '" + typeName(v) + "' has no len()"], env);
  }
  R.length = length;

  function sliceWithStep(v, sl, env) {
    var isStrv = isStr(v);
    var items = isStrv ? Array.from(v)
      : (v instanceof PyTuple ? v.items : (v instanceof PyBytes ? Array.prototype.slice.call(v.b) : v));
    if (sl.step === 1) {
      var seg = items.slice(sl.start, sl.stop);
      if (isStrv) return seg.join("");
      if (v instanceof PyBytes) return new PyBytes(new Uint8Array(seg));
      if (v instanceof PyTuple) return new PyTuple(seg);
      return seg;
    }
    var out = [];
    for (var i = sl.start; sl.step > 0 ? i < sl.stop : i > sl.stop; i += sl.step) out.push(items[i]);
    if (isStrv) return out.join("");
    if (v instanceof PyBytes) return new PyBytes(new Uint8Array(out));
    if (v instanceof PyTuple) return new PyTuple(out);
    return out;
  }
  R.sliceWithStep = sliceWithStep;

  function getItem(obj, key, env) {
    if (isStr(obj) || Array.isArray(obj) || obj instanceof PyBytes) {
      var kind = isStr(obj) ? "string" : (obj instanceof PyBytes ? "byte" : "list");
      var idx = normIndex(key, length(obj, env), env, kind);
      if (idx === SLICE) return sliceWithStep(obj, normSlice(key, length(obj, env), env), env);
      if (obj instanceof PyBytes) return obj.b[idx];
      return obj[idx];
    }
    if (obj instanceof PyTuple) {
      var i2 = normIndex(key, obj.items.length, env, "tuple");
      if (i2 === SLICE) return sliceWithStep(obj, normSlice(key, obj.items.length, env), env);
      return obj.items[i2];
    }
    if (obj instanceof PyDict) {
      var kk = hashKey(key, env), got = obj.map.get(kk);
      if (!got) {
        if (key instanceof PyInstance) throw errNew("KeyError", [key], env);
        throw errNew("KeyError", [key], env);
      }
      return got[1];
    }
    if (obj instanceof PyRange) {
      var n = normIndex(key, rangeLen(obj, env), env);
      if (n === SLICE) throw errNew("TypeError", ["range object is not subscripted by slice"], env);
      return obj.start + n * obj.step;
    }
    if (obj instanceof PyInstance) {
      var g = dunder(obj, "__getitem__", env);
      if (g) return call(g, [key], {}, env);
    }
    throw errNew("TypeError", ["'" + typeName(obj) + "' object is not subscriptable"], env);
  }
  R.getItem = getItem;
  var SLICE = { slice: 1 };

  function normIndex(k, len, env, what) {
    if (k && k.k === "slice") return SLICE;
    if (!isNum(k) || k instanceof PyFloat) throw errNew("TypeError", ["'" + typeName(k) + "' object cannot be interpreted as an integer"], env);
    var n = numOf(k);
    if (!Number.isInteger(n)) throw errNew("TypeError", ["'" + typeName(k) + "' object cannot be interpreted as an integer"], env);
    if (n < 0) n = len + n;
    if (n < 0 || n >= len) throw errNew("IndexError", [(what || "list") + " index out of range"], env);
    return n;
  }
  function sliceOf(v) { return !!(v && v.k === "slice"); }
  function normSlice(sl, len, env) {
    var step = sl.step === null || sl.step === undefined || sl.step === NONE ? 1 : numOf(sl.step);
    if (step === 0) throw errNew("ValueError", ["slice step cannot be zero"], env);
    var lo = sl.lower === null || sl.lower === undefined || sl.lower === NONE ? (step > 0 ? 0 : len - 1) : clampIdx(numOf(sl.lower), len, step, env);
    var up = sl.upper === null || sl.upper === undefined || sl.upper === NONE ? (step > 0 ? len : -1) : clampIdx(numOf(sl.upper), len, step, env);
    return { start: lo, stop: up, step: step };
  }
  function clampIdx(n, len, step, env) {
    if (n < 0) n = len + n;
    if (step > 0) return Math.max(0, Math.min(len, n));
    return Math.max(-1, Math.min(len - 1, n));
  }
  R.normIndex = normIndex; R.normSlice = normSlice; R.sliceOf = sliceOf; R.SLICE = SLICE;

  function rangeLen(r, env) {
    if (r.step > 0) return Math.max(0, Math.ceil((r.stop - r.start) / r.step));
    return Math.max(0, Math.ceil((r.start - r.stop) / -r.step));
  }
  R.rangeLen = rangeLen;

  function setItem(obj, key, val, env) {
    if (Array.isArray(obj)) {
      if (sliceOf(key) || (key && key.k === "slice")) {
        var sl = normSlice(key, obj.length, env);
        if (sl.step === 1) {
          var ins = Array.from(listOf(val, env));
          var np = sl.start + ins.length - (sl.stop - sl.start);
          Array.prototype.splice.apply(obj, [sl.start, sl.stop - sl.start].concat(ins));
          return;
        }
        var idxs = [];
        for (var q = sl.start; sl.step > 0 ? q < sl.stop : q > sl.stop; q += sl.step) idxs.push(q);
        var vs = Array.from(listOf(val, env));
        if (vs.length !== idxs.length) throw errNew("ValueError", ["attempt to assign " + vs.length + " items to extended slice " + idxs.length], env);
        idxs.forEach(function (x, i) { obj[x] = vs[i]; });
        return;
      }
      var i = normIndex(key, obj.length, env, "list");
      if (i === SLICE) throw errNew("TypeError", ["list indices must be integers or slices, not tuple"], env);
      if (i < 0 || i >= obj.length) throw errNew("IndexError", ["list assignment index out of range"], env);
      obj[i] = val;
      return;
    }
    if (obj instanceof PyDict) { dSet(obj, key, val, env); return; }
    if (obj instanceof PyInstance) {
      var s = dunder(obj, "__setitem__", env);
      if (s) { call(s, [key, val], {}, env); return; }
      throw errNew("TypeError", ["'" + typeName(obj) + "' object does not support item assignment"], env);
    }
    throw errNew("TypeError", ["'" + typeName(obj) + "' object does not support item assignment"], env);
  }
  function dSet(d, key, val, env) {
    var kk = hashKey(key, env);
    var prev = d.map.get(kk);
    d.map.set(kk, [prev ? prev[0] : key, val]);
  }
  R.setItem = setItem; R.dSet = dSet;

  function delItem(obj, key, env) {
    if (Array.isArray(obj)) {
      if (key && key.k === "slice") {
        var sl = normSlice(key, obj.length, env);
        Array.prototype.splice.apply(obj, [sl.start, sl.stop - sl.start]);
        return;
      }
      var i = normIndex(key, obj.length, env);
      obj.splice(i, 1);
      return;
    }
    if (obj instanceof PyDict) {
      var kk = hashKey(key, env);
      if (!obj.map.has(kk)) throw errNew("KeyError", [key], env);
      obj.map.delete(kk);
      return;
    }
    if (obj instanceof PyInstance) {
      var d = dunder(obj, "__delitem__", env);
      if (d) { call(d, [key], {}, env); return; }
    }
    throw errNew("TypeError", ["'" + typeName(obj) + "' object doesn't support item deletion"], env);
  }
  R.delItem = delItem;

  function contains(hay, needle, env) {
    if (isStr(hay)) {
      if (!isStr(needle)) throw errNew("TypeError", ["'in <string>' requires string as left operand, not " + typeName(needle)], env);
      return hay.indexOf(needle) >= 0;
    }
    if (Array.isArray(hay)) return hay.some(function (x) { return pyEq(x, needle, env); });
    if (hay instanceof PyTuple) return hay.items.some(function (x) { return pyEq(x, needle, env); });
    if (hay instanceof PyDict) return hay.map.has(hashKey(needle, env));
    if (hay instanceof PySet) return hay.map.has(hashKey(needle, env));
    if (hay instanceof PyBytes) {
      var n = numOf(needle);
      return hay.b.indexOf(typeof needle === "number" ? needle : n) >= 0;
    }
    if (hay instanceof PyRange) {
      if (!isNum(needle)) return false;
      var v = numOf(needle);
      if (hay.step > 0) return v >= hay.start && v < hay.stop && (v - hay.start) % hay.step === 0;
      return v <= hay.start && v > hay.stop && (hay.start - v) % -hay.step === 0;
    }
    if (hay && hay.k === "view") {
      return hay.items.some(function (x) {
        if (hay.vt === "items") return x instanceof PyTuple && pyEq(x.items[0], needle, env);
        return pyEq(x, needle, env);
      });
    }
    if (hay instanceof PyInstance) {
      var c = dunder(hay, "__contains__", env);
      if (c) return truthy(call(c, [needle], {}, env), env);
      var it = dunder(hay, "__iter__", env);
      if (it) {
        var found = false;
        iterate(hay, env, function (x) { if (pyEq(x, needle, env)) { found = true; return false; } });
        return found;
      }
    }
    throw errNew("TypeError", ["argument of type '" + typeName(hay) + "' is not iterable"], env);
  }
  R.contains = contains;

  /* 迭代：cb 返回 false 提前结束 */
  function iterate(v, env, cb) {
    if (isStr(v)) {
      var arr = Array.from(v);
      for (var i = 0; i < arr.length; i++) if (cb(arr[i]) === false) return;
      return;
    }
    if (Array.isArray(v)) { for (var j = 0; j < v.length; j++) if (cb(v[j]) === false) return; return; }
    if (v instanceof PyTuple) { for (var k = 0; k < v.items.length; k++) if (cb(v.items[k]) === false) return; return; }
    if (v instanceof PyDict) { v.map.forEach(function (kv) { return cb(kv[0]); }); return; }
    if (v instanceof PySet) { v.map.forEach(function (val) { return cb(val); }); return; }
    if (v instanceof PyBytes) { for (var b = 0; b < v.b.length; b++) if (cb(v.b[b]) === false) return; return; }
    if (v instanceof PyRange) {
      for (var x = v.start; v.step > 0 ? x < v.stop : x > v.stop; x += v.step) if (cb(x) === false) return;
      return;
    }
    if (v instanceof PyInstance) {
      var it = dunder(v, "__iter__", env);
      if (it) {
        var seq = call(it, [], {}, env);
        var io = iterOf(seq, env), rr;
        while ((rr = io.next()) !== STOP) if (cb(rr) === false) return;
        return;
      }
      var gi = dunder(v, "__getitem__", env);
      if (gi) {
        for (var q = 0; ; q++) {
          try { if (cb(call(gi, [q], {}, env)) === false) return; }
          catch (e) { if (e && e.k2 === "exc" && e.cls.isExc === "IndexError") return; throw e; }
        }
      }
    }
    if (v instanceof PyIter || (v && v.k === "iter" && typeof v.next === "function")) {
      var r;
      while ((r = v.next()) !== STOP) if (cb(r) === false) return;
      return;
    }
    if (v && v.k === "view") {
      for (var vi = 0; vi < v.items.length; vi++) if (cb(v.items[vi]) === false) return;
      return;
    }
    if (v && v.k === "file" && typeof v.readline === "function") {
      var ln;
      while ((ln = v.readline()) !== "" && ln !== undefined && ln !== null) if (cb(ln) === false) return;
      return;
    }
    if (v === NONE) throw errNew("TypeError", ["'NoneType' object is not iterable"], env);
    throw errNew("TypeError", ["'" + typeName(v) + "' object is not iterable"], env);
  }
  R.iterate = iterate;
  var STOP = { stop: 1 };
  R.STOP = STOP;

  function PyIter(list, env) {
    this.k = "iter"; this.list = list; this.i = 0; this.env = env;
  }
  PyIter.prototype.next = function () {
    if (this.i >= this.list.length) return STOP;
    return this.list[this.i++];
  };
  R.PyIter = PyIter;

  /* 自定义迭代器（有 __next__ 的对象转成的），以及 dict 的三个视图 */
  function PyNextIter(nextFn, hasNext) {
    this.k = "iter"; this.custom = true; this._next = nextFn;
  }
  PyNextIter.prototype.next = function () { return this._next(); };
  R.PyNextIter = PyNextIter;

  function PyView(kind, items) { this.k = "view"; this.vt = kind; this.items = items; }
  R.PyView = PyView;
  var VIEW_NAME = { keys: "dict_keys", values: "dict_values", items: "dict_items" };

  function listOf(v, env) {                 /* 收成 JS 数组 */
    var out = [];
    iterate(v, env, function (x) { out.push(x); });
    return out;
  }
  R.listOf = listOf;

  function iterOf(v, env) {
    if (v instanceof PyIter) return v;
    if (v instanceof PyInstance) {
      var nx = dunder(v, "__next__", env);
      if (nx) {
        return new PyNextIter(function () {
          try { return call(nx, [], {}, env); }
          catch (e) { if (e && e.k2 === "exc" && e.cls.isExc === "StopIteration") return STOP; throw e; }
        });
      }
      var it = dunder(v, "__iter__", env);
      if (it) {
        var s = call(it, [], {}, env);
        return s instanceof PyIter ? s : iterOf(s, env);
      }
    }
    return new PyIter(listOf(v, env), env);
  }
  R.iterOf = iterOf;
  function nextOf(it, env, dflt) {
    if (it instanceof PyIter) {
      var r = it.next();
      if (r === STOP) {
        if (dflt !== undefined) return dflt;
        throw errNew("StopIteration", [""], env);
      }
      return r;
    }
    var it2 = iterOf(it, env);
    var r2 = it2.next();
    if (r2 === STOP) { if (dflt !== undefined) return dflt; throw errNew("StopIteration", [""], env); }
    return r2;
  }
  R.nextOf = nextOf;

  /* ================= 调用 ================= */
  function call(fn, args, kw, env, selfOverride) {
    args = args || []; kw = kw || {};
    env.steps++;
    if (env.steps > env.maxSteps) throw errNew("RuntimeError", ["本沙箱执行步数超过上限 " + env.maxSteps + "（多半是死循环）"], env);
    if (env.depth > env.maxDepth) throw errNew("RecursionError", ["maximum recursion depth exceeded"], env);
    if (fn instanceof PyBuiltin) return fn.fn(args, kw, env, selfOverride);
    if (fn instanceof PyBound) return call(fn.fn, [fn.self].concat(args), kw, env);
    if (fn instanceof PyFunc) return callFunc(fn, args, kw, env);
    if (fn instanceof PyClass) {
      var inst = new PyInstance(fn);
      var ini = classAttr(fn, "__init__", env);
      traceCall(env, fn.name, args);
      if (ini) call(ini.v, [inst].concat(args), kw, env);
      else if (Object.keys(kw).length) throw errNew("TypeError", [fn.name + "() takes no keyword arguments"], env);
      else if (args.length) throw errNew("TypeError", [fn.name + "() takes no arguments"], env);
      return inst;
    }
    if (fn instanceof PyInstance) {
      var c = dunder(fn, "__call__", env);
      if (c) return call(c, args, kw, env);
      throw errNew("TypeError", ["'" + typeName(fn) + "' object is not callable"], env);
    }
    if (fn instanceof PyType) return coerce(fn, args, kw, env);
    throw errNew("TypeError", ["'" + typeName(fn) + "' object is not callable"], env);
  }
  R.call = call;

  function callFunc(f, args, kw, env) {
    var ps = f.node.params || { args: [], defs: [], kwonly: [], kwdefs: [], vararg: null, kwarg: null };
    var sc = new Scope("func", f.scope, new Map());
    sc.globals = env.globals;
    var n = ps.args.length, d = (ps.defs || []).length;
    var pos = args.slice();
    if (!ps.vararg && pos.length > n) {
      throw errNew("TypeError", [f.name + "() takes " + (d ? "at most " : "") + n + " positional argument" + (n === 1 ? "" : "s") + " but " + pos.length + " were given"], env);
    }
    for (var i = 0; i < n; i++) {
      if (i < pos.length) sc.vars.set(ps.args[i], pos[i]);
      else if (kw[ps.args[i]] !== undefined) { sc.vars.set(ps.args[i], kw[ps.args[i]]); delete kw[ps.args[i]]; }
      else if (ps.defs && ps.defs[i - (n - d)]) sc.vars.set(ps.args[i], evalExpr(ps.defs[i - (n - d)], sc, env));
      else throw errNew("TypeError", [f.name + "() missing required argument: '" + ps.args[i] + "'"], env);
    }
    if (ps.vararg) sc.vars.set(ps.vararg, new PyTuple(pos.slice(n)));
    ps.kwonly.forEach(function (kn, ki) {
      if (kw[kn] !== undefined) { sc.vars.set(kn, kw[kn]); delete kw[kn]; }
      else if (ps.kwdefs[ki]) sc.vars.set(kn, evalExpr(ps.kwdefs[ki], sc, env));
      else throw errNew("TypeError", [f.name + "() missing keyword-only argument: '" + kn + "'"], env);
    });
    if (ps.kwarg) { var kd = new PyDict(); Object.keys(kw).forEach(function (x) { dSet(kd, x, kw[x], env); }); sc.vars.set(ps.kwarg, kd); kw = {}; }
    if (Object.keys(kw).length) throw errNew("TypeError", [f.name + "() got unexpected keyword argument '" + Object.keys(kw)[0] + "'"], env);
    sc.pendingGlobal = sc.pendingGlobal || new Set();
    sc.pendingNonLocal = sc.pendingNonLocal || new Set();
    return runBody(f.node.body, sc, env, f);
  }
  R.callFunc = callFunc;

  /* 函数体执行：return 用异常穿透，在这里收口 */
  function runBody(body, sc, env, f) {
    var oldF = env.curFunc, oldSc = env.curScope;
    env.curFunc = f; env.curScope = sc; env.depth++;
    try {
      execBlock(body, sc, env);
    } catch (e) {
      if (e instanceof ReturnSig) return e.v === undefined ? NONE : e.v;
      throw e;
    } finally { env.depth--; env.curFunc = oldF; env.curScope = oldSc; }
    return NONE;
  }
  function ReturnSig(v) { this.v = v; }
  function BreakSig() { }
  function ContinueSig() { }
  R.ReturnSig = ReturnSig;

  /* ================= 执行轨迹 ================= */
  function traceCall(env, name, args) {
    if (!env.trace) return;
    env.trace.calls.push({ name: name, args: args.map(function (a) { return repr(a, env); }), line: env.line });
    if (env.trace.calls.length > 4000) env.trace.calls.shift();
  }
  function traceBranch(env, node, taken) {
    if (!env.trace) return;
    env.trace.branches.push({ line: node.line, kind: node.k, cond: srcOf(node.test, env), val: taken });
  }
  function traceLoop(env, node, times) {
    if (!env.trace) return;
    env.trace.loops.push({ line: node.line, kind: node.k, times: times });
  }
  R.traceCall = traceCall; R.traceBranch = traceBranch; R.traceLoop = traceLoop;

  /* AST → 源码片段（报错与判分提示都要用人话回显） */
  function srcOf(node, env) {
    if (!node) return "";
    if (env && env.srcOf) return env.srcOf(node);
    return unparse(node);
  }
  R.srcOf = srcOf;
  function unparse(n) {
    if (!n) return "";
    switch (n.k) {
      case "num": return typeof n.v === "string" ? n.v : (n.float ? reprFloat(n.v) : String(n.v));
      case "str": return JSON.stringify(n.v);
      case "fstr": return "f'" + n.parts.map(function (p) { return p.lit !== undefined ? p.lit : "{" + p.expr + "}"; }).join("") + "'";
      case "name": case "walrus": return n.name;
      case "bool": return n.v ? "True" : "False";
      case "none": return "None";
      case "list": return "[" + n.items.map(function (x) { return unparse(x.k === "star" ? "*" + unparse(x.value) : unparse(x)); }).join(", ") + "]";
      case "tup": return "(" + n.items.map(unparse).join(", ") + ")";
      case "set": return "{" + n.items.map(unparse).join(", ") + "}";
      case "dict": return "{" + n.keys.map(function (k, i) { return k === null ? "**" + unparse(n.vals[i].value) : unparse(k) + ": " + unparse(n.vals[i]); }).join(", ") + "}";
      case "bin": return unparse(n.left) + " " + n.op + " " + unparse(n.right);
      case "unary": return n.op + unparse(n.value);
      case "cmp": return unparse(n.left) + n.ops.map(function (o, i) { return " " + o + " " + unparse(n.comps[i]); }).join("");
      case "logic": return n.vals.map(unparse).join(" " + n.op + " ");
      case "not": return "not " + n.vals.map(unparse).join("not ");
      case "call": return unparse(n.fn) + "(" + n.args.map(function (a) { return a.star ? "*" + unparse(a.value) : unparse(a.gen || a.value); }).concat(n.kws.map(function (k) { return k.spread ? "**" + unparse(k.value) : k.name + "=" + unparse(k.value); })).join(", ") + ")";
      case "attr": return unparse(n.value) + "." + n.attr;
      case "sub": return unparse(n.value) + "[" + unparse(n.index) + "]";
      case "slice": return (n.lower ? unparse(n.lower) : "") + ":" + (n.upper ? unparse(n.upper) : "") + (n.step ? ":" + unparse(n.step) : "");
      case "ifexp": return unparse(n.body) + " if " + unparse(n.test) + " else " + unparse(n.orelse);
      case "listcomp": return "[" + unparse(n.elt) + " " + n.clauses.map(compStr).join(" ") + "]";
      case "genexp": return "(" + unparse(n.elt) + " " + n.clauses.map(compStr).join(" ") + ")";
      case "setcomp": return "{" + unparse(n.elt) + " " + n.clauses.map(compStr).join(" ") + "}";
      case "dictcomp": return "{" + unparse(n.key) + ": " + unparse(n.value) + " " + n.clauses.map(compStr).join(" ") + "}";
      case "lambda": return "lambda " + (n.params.args || []).join(", ") + ": " + unparse(n.body);
      case "star": return "*" + unparse(n.value);
      default: return n.k || "";
    }
  }
  function compStr(c) { return "for " + unparse(c.target) + " in " + unparse(c.iter) + (c.conds.length ? " if " + c.conds.map(unparse).join(" if ") : ""); }
  R.unparse = unparse;

  /* ================= 语句执行 ================= */

  function execBlock(stmts, sc, env) {
    for (var i = 0; i < stmts.length; i++) execStmt(stmts[i], sc, env);
  }
  R.execBlock = execBlock;

  function execStmt(st, sc, env) {
    if (!st) return;
    env.line = st.line;
    if (env.trace && env.trace.lines) env.trace.lines.add(st.line);
    if (env.steps++ > env.maxSteps) throw errNew("RuntimeError", ["本沙箱执行步数超过上限 " + env.maxSteps + "（多半是死循环）"], env);
    switch (st.k) {
      case "expr": evalExpr(st.value, sc, env); return;
      case "assign": {
        var v = evalExpr(st.value, sc, env);
        st.targets.forEach(function (t) { store(t, v, sc, env); });
        return;
      }
      case "annassign": {
        if (st.value === null || st.value === undefined) return;
        var v2 = evalExpr(st.value, sc, env);
        store({ k: "name", name: st.target.name, line: st.line }, v2, sc, env);
        return;
      }
      case "augassign": {
        var cur = evalLoad(st.target, sc, env);
        var rhs = evalExpr(st.value, sc, env);
        store(st.target, binop(st.op, cur, rhs, env), sc, env);
        return;
      }
      case "if": {
        var t = truthy(evalExpr(st.test, sc, env), env);
        traceBranch(env, st, t);
        if (t) execBlock(st.body, sc, env);
        else if (st.orelse.length) execBlock(st.orelse, sc, env);
        return;
      }
      case "while": {
        var n = 0, broke = false;
        while (truthy(evalExpr(st.test, sc, env), env)) {
          n++;
          if (n > env.maxLoop) throw errNew("RuntimeError", ["循环跑了 " + env.maxLoop + " 圈还没停，判它死循环"], env);
          try { execBlock(st.body, sc, env); }
          catch (e) {
            if (e instanceof BreakSig) { broke = true; break; }
            if (e instanceof ContinueSig) continue;
            throw e;
          }
        }
        traceLoop(env, st, n);
        if (!broke && st.orelse.length) execBlock(st.orelse, sc, env);
        return;
      }
      case "for": {
        var it = evalExpr(st.iter, sc, env);
        var iterObj = it instanceof PyIter ? it : iterOf(it, env);
        var cnt = 0, r, broke2 = false;
        while ((r = iterObj.next()) !== STOP) {
          store(st.target, r, sc, env);
          cnt++;
          try { execBlock(st.body, sc, env); }
          catch (e) {
            if (e instanceof BreakSig) { broke2 = true; break; }
            if (e instanceof ContinueSig) { if (cnt > env.maxLoop) throw errNew("RuntimeError", ["循环跑了 " + env.maxLoop + " 圈还没停，判它死循环"], env); continue; }
            throw e;
          }
          if (cnt > env.maxLoop) throw errNew("RuntimeError", ["循环跑了 " + env.maxLoop + " 圈还没停，判它死循环"], env);
        }
        traceLoop(env, st, cnt);
        if (!broke2 && st.orelse.length) execBlock(st.orelse, sc, env);
        return;
      }
      case "with": {
        var opened = [];
        try {
          st.items.forEach(function (it2) {
            var cm = evalExpr(it2.ctx, sc, env);
            opened.push(cm);
            var ent = attrGet(cm, "__enter__", env);
            var val = call(ent, [], {}, env);
            if (it2.opt) store(it2.opt, val, sc, env);
          });
          execBlock(st.body, sc, env);
        } catch (e) {
          var swallow = false;
          for (var wi = opened.length - 1; wi >= 0; wi--) {
            try {
              var ex = attrGet(opened[wi], "__exit__", env);
              if (e && e.k2 === "exc") swallow = truthy(call(ex, [e.cls, e, NONE], {}, env), env) || swallow;
              else call(ex, [NONE, NONE, NONE], {}, env);
            } catch (e2) { /* 关闭时再出错就让它盖过去 */ }
          }
          if (!swallow) throw e;
          return;
        }
        for (var ci = opened.length - 1; ci >= 0; ci--) {
          var ex2 = attrGet(opened[ci], "__exit__", env);
          call(ex2, [NONE, NONE, NONE], {}, env);
        }
        return;
      }
      case "try": return execTry(st, sc, env);
      case "raise": {
        var ev = st.exc ? evalExpr(st.exc, sc, env) : (env.curExc || null);
        if (!ev) throw errNew("RuntimeError", ["active exception not set"], env);
        var e2 = errFromPy(ev, env);
        if (st.frm) { e2.cause = evalExpr(st.frm, sc, env); }
        throw e2;
      }
      case "assert": {
        var av = evalExpr(st.test, sc, env);
        if (!truthy(av, env)) {
          var msg = st.msg ? toStr(evalExpr(st.msg, sc, env), env) : "";
          throw errNew("AssertionError", msg ? [msg] : [], env);
        }
        return;
      }
      case "pass": return;
      case "break": throw new BreakSig();
      case "continue": throw new ContinueSig();
      case "return": throw new ReturnSig(st.value ? evalExpr(st.value, sc, env) : NONE);
      case "global": st.names.forEach(function (x) { sc.pendingGlobal = sc.pendingGlobal || new Set(); sc.pendingGlobal.add(x); }); return;
      case "nonlocal": st.names.forEach(function (x) { sc.pendingNonLocal = sc.pendingNonLocal || new Set(); sc.pendingNonLocal.add(x); }); return;
      case "del": {
        st.targets.forEach(function (t) { delTarget(t, sc, env); });
        return;
      }
      case "import": case "fromimport": return execImport(st, sc, env);
      case "def": {
        var f = new PyFunc(st, sc, st.name);
        if (st.decs) st.decs.slice().reverse().forEach(function (d) { f = call(evalExpr(d, sc, env), [f], {}, env); });
        assign(sc, st.name, f, env);
        return;
      }
      case "class": {
        var bases = st.bases.map(function (b) {
          var v = evalExpr(b, sc, env);
          if (b.k === "star") return listOf(v, env);
          return v;
        });
        var flat = [];
        bases.forEach(function (b) { if (Array.isArray(b)) flat = flat.concat(b); else flat.push(b); });
        /* 不写基类就是继承 object —— __mro__ 末尾那个 object 就是这么来的 */
        if (!flat.length) flat = [R.OBJECT_CLS];
        var clsScope = new Scope("class", sc, new Map());
        execBlock(st.body, clsScope, env);
        var cls = new PyClass(st.name, flat.filter(function (x) { return x instanceof PyClass; }), clsScope.vars, (env.globals.vars.get("__name__") || "__main__"));
        cls.doc = st.doc;
        if (st.decs) st.decs.slice().reverse().forEach(function (d) { cls = call(evalExpr(d, sc, env), [cls], {}, env); });
        /* 类里的静态方法/类方法把所在类补上 */
        cls.dict.forEach(function (v, k) {
          if (v instanceof PyFunc) { v.ownerCls = cls; }
        });
        assign(sc, st.name, cls, env);
        return;
      }
      default:
        throw errNew("RuntimeError", ["沙箱还不认识语句类型 " + st.k], env);
    }
  }
  R.execStmt = execStmt;

  function execTry(st, sc, env) {
    var oldExc = env.curExc;
    try {
      execBlock(st.body, sc, env);
      if (st.orelse.length) execBlock(st.orelse, sc, env);
    } catch (e) {
      if (e instanceof ReturnSig || e instanceof BreakSig || e instanceof ContinueSig) throw e;
      if (!e || e.k2 !== "exc") {
        /* 沙箱自身没接住的 JS 异常：翻成人话，别让整页崩 */
        var ne = errNew("RuntimeError", [String(e && e.message || e)], env);
        try { execFinally(st, sc, env); } catch (f2) { throw f2; }
        throw ne;
      }
      var matched = null;
      for (var i = 0; i < st.handlers.length; i++) {
        var h = st.handlers[i];
        if (!h.typ) { matched = { h: h, e: e }; break; }
        var cls = excTargets(h.typ, sc, env);
        if (cls.some(function (c) { return excMatches(e, c); })) { matched = { h: h, e: e }; break; }
      }
      if (!matched) { execFinally(st, sc, env); env.curExc = oldExc; throw e; }
      env.curExc = e;
      if (matched.h.name) assign(sc, matched.h.name.name, e, env);
      try { execBlock(matched.h.body, sc, env); }
      finally { execFinally(st, sc, env); env.curExc = oldExc; }
      return;
    }
    execFinally(st, sc, env);
  }
  function execFinally(st, sc, env) { if (st.fin.length) execBlock(st.fin, sc, env); }
  function excTargets(node, sc, env) {
    if (node.k === "tup") return node.items.map(function (x) { return evalExpr(x, sc, env); });
    var v = evalExpr(node, sc, env);
    return [v];
  }
  function excMatches(e, cls) {
    if (!(cls instanceof PyClass)) return false;
    var c = e.cls;
    while (c) {
      if (c === cls) return true;
      if (cls.isExc && c.isExc === cls.isExc) return true;
      c = c.bases.length ? c.bases[0] : null;
    }
    return false;
  }
  R.excMatches = excMatches;

  function delTarget(t, sc, env) {
    if (t.k === "name") {
      if (sc.vars.has(t.name)) { sc.vars.delete(t.name); return; }
      if (env.globals.vars.has(t.name)) { env.globals.vars.delete(t.name); return; }
      throw errNew("NameError", ["name '" + t.name + "' is not defined"], env);
    }
    if (t.k === "sub") { delItem(evalExpr(t.value, sc, env), t.index.k === "slice" ? evalSlice(t.index, sc, env) : evalExpr(t.index, sc, env), env); return; }
    if (t.k === "attr") { attrDel(evalExpr(t.value, sc, env), t.attr, env); return; }
    if (t.k === "seq") { t.items.forEach(function (x) { delTarget(x, sc, env); }); return; }
    throw errNew("SyntaxError", ["cannot delete"], env);
  }

  function execImport(st, sc, env) {
    if (st.k === "import") {
      st.mods.forEach(function (m) {
        var mod = getModule(m.name, env);
        var name = m.as || m.name.split(".")[0];
        if (m.name.indexOf(".") >= 0 && !m.as) {
          var parts = m.name.split("."), cur = parts[0];
          var mm = getModule(cur, env);
          parts.slice(1).forEach(function (p) { mm = attrGet(mm, p, env); });
          assign(sc, cur, mm, env);
          env.trace && env.trace.imports.push(m.name);
          return;
        }
        assign(sc, name, mod, env);
        if (env.trace) env.trace.imports.push(m.name);
      });
      return;
    }
    var base = getModule(st.module || "", env, st.dots);
    if (st.star) {
      var names = [];
      base.dict.forEach(function (v, k) { if (k.charAt(0) !== "_") names.push(k); });
      names.forEach(function (n) { assign(sc, n, base.dict.get(n), env); });
      return;
    }
    st.names.forEach(function (n) {
      var val;
      var full = st.module ? st.module + "." + n.name : n.name;
      if (base.sub && base.sub[n.name]) val = getModule(full, env);
      else if (base.dict.has(n.name)) val = base.dict.get(n.name);
      else {
        try { val = getModule(full, env); }
        catch (e) { throw errNew("ImportError", ["cannot import name '" + n.name + "' from '" + st.module + "'"], env); }
      }
      assign(sc, n.as || n.name, val, env);
      if (env.trace) env.trace.imports.push((st.module || "") + "." + n.name);
    });
  }
  R.execImport = execImport;

  /* 模块导入：先查沙箱内置，再查虚拟文件系统里的 .py */
  function getModule(name, env, dots) {
    var key = name;
    if (env.modules.has(key)) return env.modules.get(key);
    var mod = B.buildModule ? B.buildModule(name, env) : null;
    if (mod) { env.modules.set(key, mod); return mod; }
    /* 同目录的 .py */
    var file = name.replace(/\./g, "/") + ".py";
    var path = R.fsFor(env) ? R.fsFor(env).norm(file) : "/" + file;
    if (env.fs && env.fs.exists(path)) {
      var m = new PyModule(name, new Map());
      m.__file__ = file;
      env.modules.set(key, m);
      m.dict.set("__name__", name);
      m.dict.set("__file__", file);
      var body = ENG.parse(env.fs.read(path), file);
      var sc = new Scope("module", null, m.dict);
      var oldG = env.globals, oldFs = env.curModule;
      env.globals = sc; env.curModule = m;
      var oldName = env.modName; env.modName = name;
      try { execBlock(body.body, sc, env); }
      finally { env.globals = oldG; env.curModule = oldFs; env.modName = oldName; }
      env.modules.set(key, m);
      return m;
    }
    throw errNew("ModuleNotFoundError", ["No module named '" + (name.split(".")[0] || name) + "'"], env);
  }
  R.getModule = getModule;

  /* ================= 表达式求值 ================= */
  function evalExpr(n, sc, env) {
    env.steps++;
    if (env.steps > env.maxSteps) throw errNew("RuntimeError", ["本沙箱执行步数超过上限 " + env.maxSteps + "（多半是死循环）"], env);
    if (n.line) env.line = n.line;
    switch (n.k) {
      case "num": return n.big ? BigInt(n.v) : (n.float ? new PyFloat(n.v) : n.v);
      case "str": return n.v;
      case "fstr": return evalFStr(n, sc, env);
      case "bool": return n.v;
      case "none": return NONE;
      case "name": return loadName(n.name, sc, env);
      case "list": return n.items.map(function (x) { return x.k === "star" ? listOf(evalExpr(x.value, sc, env), env) : [evalExpr(x, sc, env)]; })
        .reduce(function (a, b) { return a.concat(b); }, []);
      case "tup": {
        var its = [];
        n.items.forEach(function (x) { if (x.k === "star") its = its.concat(listOf(evalExpr(x.value, sc, env), env)); else its.push(evalExpr(x, sc, env)); });
        return new PyTuple(its);
      }
      case "set": {
        var s = new PySet(false);
        n.items.forEach(function (x) {
          if (x.k === "star") listOf(evalExpr(x.value, sc, env), env).forEach(function (v) { s.map.set(hashKey(v, env), v); });
          else { var sv = evalExpr(x, sc, env); s.map.set(hashKey(sv, env), sv); }
        });
        return s;
      }
      case "dict": {
        var d = new PyDict();
        n.keys.forEach(function (k, i) {
          var v = n.vals[i];
          if (k === null) {
            var src = v.value ? evalExpr(v.value, sc, env) : evalExpr(v, sc, env);
            if (src instanceof PyDict) src.map.forEach(function (kv) { d.map.set(hashKey(kv[0], env), kv); });
            else listOf(src, env).forEach(function (pair) {
              var arr = listOf(pair, env);
              dSet(d, arr[0], arr[1], env);
            });
            return;
          }
          dSet(d, evalExpr(k, sc, env), evalExpr(v, sc, env), env);
        });
        return d;
      }
      case "slice": return evalSlice(n, sc, env);
      case "sliceobj": return { k: "slice", lower: n.lower, upper: n.upper, step: n.step };
      case "bin": return binop(n.op, evalExpr(n.left, sc, env), evalExpr(n.right, sc, env), env);
      case "unary": return unaryOp(n.op, evalExpr(n.value, sc, env), env);
      case "cmp": return evalCmp(n, sc, env);
      case "logic": {
        if (n.op === "and") {
          var v1;
          for (var i = 0; i < n.vals.length; i++) { v1 = evalExpr(n.vals[i], sc, env); if (!truthy(v1, env)) return v1; }
          return v1;
        }
        var v2;
        for (var j = 0; j < n.vals.length; j++) { v2 = evalExpr(n.vals[j], sc, env); if (truthy(v2, env)) return v2; }
        return v2;
      }
      case "not":
        /* 语法层已经把 not not x 折成嵌套节点，这里只管取反一次 */
        return !truthy(evalExpr(n.vals[0], sc, env), env);
      case "call": return evalCall(n, sc, env);
      case "attr": return attrGet(evalExpr(n.value, sc, env), n.attr, env);
      case "sub": {
        var obj = evalExpr(n.value, sc, env);
        var key = n.index;
        var kk = key.k === "slice" ? evalSlice(key, sc, env) : evalExpr(key, sc, env);
        return getItem(obj, kk, env);
      }
      case "lambda": return new PyFunc({ k: "def", name: "<lambda>", params: n.params, body: [{ k: "return", line: n.line, value: n.body }], doc: null }, sc, "<lambda>");
      case "ifexp": return truthy(evalExpr(n.test, sc, env), env) ? evalExpr(n.body, sc, env) : evalExpr(n.orelse, sc, env);
      case "listcomp": return compRun(n, sc, env, "list");
      case "setcomp": return compRun(n, sc, env, "set");
      case "genexp": return new PyIter(compRun(n, sc, env, "list"), env);
      case "dictcomp": return compRun(n, sc, env, "dict");
      case "walrus": { var wv = evalExpr(n.value, sc, env); assign(sc, n.name, wv, env); return wv; }
      case "star": return evalExpr(n.value, sc, env);
      default:
        throw errNew("RuntimeError", ["沙箱还不认识表达式 " + n.k], env);
    }
  }
  R.evalExpr = evalExpr;

  function compRun(n, sc, env, kind) {
    var out = kind === "dict" ? new PyDict() : kind === "set" ? new PySet(false) : [];
    var cs = new Scope("comp", sc, new Map());
    function walk(ci) {
      if (ci >= n.clauses.length) {
        var c = n.clauses;
        if (kind === "list") out.push(evalExpr(n.elt, cs, env));
        else if (kind === "set") out.map.set(hashKey(evalExpr(n.elt, cs, env), env), evalExpr(n.elt, cs, env));
        else if (kind === "dict") { var kk = evalExpr(n.key, cs, env), vv = evalExpr(n.value, cs, env); dSet(out, kk, vv, env); }
        return;
      }
      var cl = n.clauses[ci];
      var seq = evalExpr(cl.iter, cs, env);
      iterate(seq, env, function (v) {
        store(cl.target, v, cs, env);
        for (var k = 0; k < cl.conds.length; k++) if (!truthy(evalExpr(cl.conds[k], cs, env), env)) return;
        walk(ci + 1);
      });
    }
    walk(0);
    if (kind === "list") return out;
    return out;
  }

  function evalFStr(n, sc, env) {
    var out = "";
    n.parts.forEach(function (p) {
      if (p.lit !== undefined) { out += p.lit; return; }
      var sub = p.__ast || (p.__ast = parseSub(p.expr, n.line, env));
      var v = evalExpr(sub, sc, env);
      var spec = "";
      if (p.spec) spec = p.spec.map(function (s) { return s.lit !== undefined ? s.lit : "{" + (s.__ast ? unparse(s.__ast) : s.expr) + "}"; }).join("");
      if (p.spec) {
        var specVal = p.spec.map(function (s) {
          if (s.lit !== undefined) return s.lit;
          var sa = s.__ast || (s.__ast = parseSub(s.expr, n.line, env));
          return toStr(evalExpr(sa, sc, env), env);
        }).join("");
        spec = specVal;
      } else spec = "";
      if (p.doc) out += (p.src || p.expr) + "=" + formatValue(repr(v, env), spec, env);
      else if (p.conv === "r") out += formatValue(repr(v, env), spec, env);
      else if (p.conv === "s") out += formatValue(toStr(v, env), spec, env);
      else if (p.conv === "a") out += formatValue(asciiRepr(v, env), spec, env);
      else out += formatValue(v, spec, env);
    });
    return out;
  }
  function asciiRepr(v, env) { return repr(v, env); }
  function parseSub(src, line, env) {
    if (!src.trim()) throw errNew("SyntaxError", ["f-string: empty expression not allowed"], env);
    try { return ENG.parse(src, env.file || "main.py").body[0].value; }
    catch (e) {
      if (e.isPyError) throw errNew("SyntaxError", ["f-string: " + e.pymsg], env);
      throw e;
    }
  }
  R.parseSub = parseSub;

  function evalCall(n, sc, env) {
    
    var fn, self = null;
    if (n.fn.k === "attr") {
      self = evalExpr(n.fn.value, sc, env);
      fn = methodOf(self, n.fn.attr, env);
      var args = [], kw = {};
      collectArgs(n, sc, env, args, kw);
      /* 方法调用也要进轨迹：判分器得知道读者真调过 append()/write()/format() 这些 */
      traceCall(env, callableName(n.fn, env), args);
      if (fn instanceof PyBuiltin && fn.onSelf) return fn.onSelf(self, args, kw, env);
      if (fn === NOTSET) {
        if (isStr(self) && n.fn.attr === "format") return B.str_format(self, args, kw, env);
        throw errNew("AttributeError", ["'" + typeName(self) + "' object has no attribute '" + n.fn.attr + "'"], env);
      }
      return call(fn, args, kw, env);
    }
    fn = evalExpr(n.fn, sc, env);
    var args2 = [], kw2 = {};
    collectArgs(n, sc, env, args2, kw2);
    traceCall(env, callableName(n.fn, env), args2);
    return call(fn, args2, kw2, env);
  }
  function collectArgs(n, sc, env, args, kw) {
    n.args.forEach(function (a) {
      if (a.star) { listOf(evalExpr(a.value, sc, env), env).forEach(function (x) { args.push(x); }); return; }
      if (a.gen) { var lst = compRun({ k: "listcomp", elt: a.gen.elt, clauses: a.gen.clauses }, sc, env, "list"); args.push(new PyIter(lst, env)); return; }
      args.push(evalExpr(a.value, sc, env));
    });
    n.kws.forEach(function (k) {
      if (k.spread) {
        var src = evalExpr(k.value, sc, env);
        if (src instanceof PyDict) src.map.forEach(function (kv) { kw[toStr(kv[0], env)] = kv[1]; });
        else listOf(src, env).forEach(function (pair) { var a2 = listOf(pair, env); kw[toStr(a2[0], env)] = a2[1]; });
        return;
      }
      kw[k.name] = evalExpr(k.value, sc, env);
    });
  }
  function callableName(node, env) {
    if (node.k === "name") return node.name;
    if (node.k === "attr") return node.attr;
    return unparse(node);
  }
  function methodOf(obj, name, env) {
    var tab = B.methods && B.methods[typeName(obj)];
    if (tab && tab[name]) return tab[name](obj);
    if (obj && obj.k === "super") return attrGet(obj, name, env);
    if (obj && (obj.k === "file" || obj.k === "view" || obj.k === "range")) return attrGet(obj, name, env);
    if (obj instanceof PyInstance) {
      var a = lookupAttr(obj, name, env);
      if (a) return a.v;
      return NOTSET;
    }
    if (obj instanceof PyClass) {
      var c = classAttr(obj, name, env);
      if (c) return c.v;
      return NOTSET;
    }
    if (obj instanceof PyModule) return attrGet(obj, name, env);
    return NOTSET;
  }
  R.methodOf = methodOf;

  function loadName(name, sc, env) {
    if (sc.vars.has(name)) return sc.vars.get(name);
    if (env.globals !== sc && env.globals.vars.has(name)) return env.globals.vars.get(name);
    var s = sc.parent;
    while (s) {
      if (s.kind !== "class" && s.vars.has(name)) return s.vars.get(name);
      if (s.kind === "module") break;
      s = s.parent;
    }
    if (B.builtins.has(name)) return B.builtins.get(name);
    if (name === "__name__") return env.globals.vars.get("__name__") || env.modName || "__main__";
    if (name === "__file__") return env.file || "main.py";
    if (name === "__doc__") return NONE;
    throw errNew("NameError", ["name '" + name + "' is not defined"], env);
  }
  R.loadName = loadName;

  function evalSlice(n, sc, env) {
    return {
      k: "slice",
      lower: n.lower ? evalExpr(n.lower, sc, env) : null,
      upper: n.upper ? evalExpr(n.upper, sc, env) : null,
      step: n.step ? evalExpr(n.step, sc, env) : null,
      line: n.line
    };
  }

  /* ================= 运算符 ================= */
  function binop(op, a, b, env) {
    switch (op) {
      case "+": return addOp(a, b, env);
      case "-": return numOp(op, a, b, env);
      case "*": return mulOp(a, b, env);
      case "/": return divOp(a, b, env);
      case "//": return floordivOp(a, b, env);
      case "%": return modOp(a, b, env);
      case "**": return powOp(a, b, env);
      case ">>": case "<<": {
        if (!isInt(a) || !isInt(b) || isBool(a) && false) throw errNew("TypeError", ["unsupported operand type(s) for " + op + ": '" + typeName(a) + "' and '" + typeName(b) + "'"], env);
        var na = typeof a === "bigint" ? a : BigInt(a), nb = typeof b === "bigint" ? b : BigInt(b);
        var sh = Number(nb);
        if (sh > 1023) throw errNew("OverflowError", ["too many shifts"], env);
        var r = op === ">>" ? na >> BigInt(sh) : na << BigInt(sh);
        return fits(r) ? Number(r) : r;
      }
      case "&": case "|": case "^": {
        if (a instanceof PySet && b instanceof PySet) return setOp(op, a, b, env);
        if (!isInt(a) || !isInt(b)) throw errNew("TypeError", ["unsupported operand type(s) for " + op + ": '" + typeName(a) + "' and '" + typeName(b) + "'"], env);
        var x = typeof a === "bigint" ? a : BigInt(a), y = typeof b === "bigint" ? b : BigInt(b);
        var rr = op === "&" ? x & y : op === "|" ? x | y : x ^ y;
        return fits(rr) ? Number(rr) : rr;
      }
      case "@": throw errNew("TypeError", ["unsupported operand type(s) for @: '" + typeName(a) + "' and '" + typeName(b) + "'"], env);
    }
    throw errNew("RuntimeError", ["未知运算符 " + op], env);
  }
  R.binop = binop;
  function fits(b) { var s = b.toString(); return typeof b === "bigint" ? (b >= -9007199254740991n && b <= 9007199254740991n) : true; }
  function needNum(op, a, b, env) {
    if (!isNum(a) || !isNum(b)) {
      throw errNew("TypeError", ["unsupported operand type(s) for " + op + ": '" + typeName(a) + "' and '" + typeName(b) + "'"], env);
    }
  }
  function numOp(op, a, b, env) {
    needNum(op, a, b, env);
    var fa = a instanceof PyFloat, fb = b instanceof PyFloat;
    if (typeof a === "bigint" || typeof b === "bigint") {
      if (fa || fb) return new PyFloat(floatVal(opFn(op, floatVal(a), floatVal(b), env)));
      var ra = typeof a === "bigint" ? a : BigInt(Math.trunc(numOf(a))), rb = typeof b === "bigint" ? b : BigInt(Math.trunc(numOf(b)));
      var out = op === "+" ? ra + rb : op === "-" ? ra - rb : ra * rb;
      return fits(out) ? Number(out) : out;
    }
    var na = numOf(a), nb = numOf(b);
    if (fa || fb) return new PyFloat(opFn(op, na, nb, env));
    var r2 = opFn(op, na, nb, env);
    if (!Number.isSafeInteger(r2)) {                       /* 超出安全整数就换 bigint，保住位数 */
      try {
        var ba = BigInt(Math.trunc(na)), bb = BigInt(Math.trunc(nb));
        var big = op === "+" ? ba + bb : op === "-" ? ba - bb : ba * bb;
        return fits(big) ? Number(big) : big;
      } catch (e) { /* 非整数的浮点走原路 */ }
    }
    return r2;
  }
  function opFn(op, a, b) { return op === "+" ? a + b : op === "-" ? a - b : a * b; }
  function addOp(a, b, env) {
    if (isStr(a) && isStr(b)) return a + b;
    if (Array.isArray(a) && Array.isArray(b)) return a.concat(b);
    if (a instanceof PyTuple && b instanceof PyTuple) return new PyTuple(a.items.concat(b.items));
    if (a instanceof PyBytes && b instanceof PyBytes) {
      var c = new Uint8Array(a.b.length + b.b.length); c.set(a.b); c.set(b.b, a.b.length); return new PyBytes(c);
    }
    if (isNum(a) && isNum(b)) return numOp("+", a, b, env);
    if (a instanceof PyInstance) {
      var m = dunder(a, "__add__", env);
      if (m) { var r = call(m, [b], {}, env); if (r !== NOTSET) return r; }
      var rm = dunder(b, "__radd__", env);
      if (rm) return call(rm, [a], {}, env);
    }
    throw errNew("TypeError", isStr(a)
      ? ["can only concatenate str (not \"" + typeName(b) + "\") to str"]
      : ["unsupported operand type(s) for +: '" + typeName(a) + "' and '" + typeName(b) + "'"], env);
  }
  function mulOp(a, b, env) {
    if (isStr(a) && isNum(b)) { var n = numOf(b); return n > 0 ? a.repeat(Math.min(n, 1e6)) : ""; }
    if (isNum(a) && isStr(b)) return mulOp(b, a, env);
    if (Array.isArray(a) && isNum(b)) { var m = Math.max(0, numOf(b)), out = []; for (var i = 0; i < m; i++) out = out.concat(a); return out; }
    if (isNum(a) && Array.isArray(b)) return mulOp(b, a, env);
    if (a instanceof PyTuple && isNum(b)) { var mm = Math.max(0, numOf(b)), o = []; for (var j = 0; j < mm; j++) o = o.concat(a.items); return new PyTuple(o); }
    if (isNum(a) && isNum(b)) return numOp("*", a, b, env);
    if (a instanceof PyInstance) { var m2 = dunder(a, "__mul__", env); if (m2) return call(m2, [b], {}, env); }
    throw errNew("TypeError", ["unsupported operand type(s) for *: '" + typeName(a) + "' and '" + typeName(b) + "'"], env);
  }
  function divOp(a, b, env) {
    if (!isNum(a) || !isNum(b)) {
      if (isStr(a) && b instanceof PyDict) return B.pctFormat(a, [b], env);
      if (isStr(a) && !Array.isArray(b)) return B.pctFormat(a, [b], env);
      if (isStr(a)) return B.pctFormat(a, Array.isArray(b) ? b : [b], env);
      /* Path / '文件名' 这类自定义类型重载了 / */
      if (a instanceof PyInstance) {
        var td = dunder(a, "__truediv__", env);
        if (td) return call(td, [b], {}, env);
      }
      if (b instanceof PyInstance) {
        var rd = dunder(b, "__rtruediv__", env);
        if (rd) return call(rd, [a], {}, env);
      }
      throw errNew("TypeError", ["unsupported operand type(s) for /: '" + typeName(a) + "' and '" + typeName(b) + "'"], env);
    }
    if (numOf(b) === 0) throw errNew("ZeroDivisionError", ["division by zero"], env);
    return new PyFloat(numOf(a) / numOf(b));
  }
  function floordivOp(a, b, env) {
    if (!isNum(a) || !isNum(b)) throw errNew("TypeError", ["unsupported operand type(s) for //: '" + typeName(a) + "' and '" + typeName(b) + "'"], env);
    if (numOf(b) === 0) throw errNew("ZeroDivisionError", ["integer division or modulo by zero"], env);
    var r = Math.floor(numOf(a) / numOf(b));
    if (a instanceof PyFloat || b instanceof PyFloat) return new PyFloat(r);
    return r;
  }
  function modOp(a, b, env) {
    if (isStr(a)) {
      if (b instanceof PyDict) return B.pctFormat(a, b, env, true);
      if (b instanceof PyTuple) return B.pctFormat(a, b.items, env);
      if (Array.isArray(b)) return B.pctFormat(a, b, env);
      return B.pctFormat(a, [b], env);
    }
    if (!isNum(a) || !isNum(b)) throw errNew("TypeError", ["unsupported operand type(s) for %: '" + typeName(a) + "' and '" + typeName(b) + "'"], env);
    if (numOf(b) === 0) throw errNew("ZeroDivisionError", ["integer division or modulo by zero"], env);
    var na = numOf(a), nb = numOf(b);
    var r = na % nb;
    if (r !== 0 && ((r < 0) !== (nb < 0))) r += nb;
    if (a instanceof PyFloat || b instanceof PyFloat) return new PyFloat(r);
    return r;
  }
  function powOp(a, b, env) {
    if (!isNum(a) || !isNum(b)) throw errNew("TypeError", ["unsupported operand type(s) for **: '" + typeName(a) + "' and '" + typeName(b) + "'"], env);
    if (numOf(a) === 0 && numOf(b) < 0) throw errNew("ZeroDivisionError", ["0.0 cannot be raised to a negative power"], env);
    var fa = a instanceof PyFloat, fb = b instanceof PyFloat;
    if (!fa && !fb && numOf(b) >= 0) {
      var base = typeof a === "bigint" ? a : BigInt(Math.trunc(numOf(a))), ex = BigInt(Math.trunc(numOf(b)));
      if (ex > 4096n) throw errNew("OverflowError", ["int too large to convert"], env);
      var res = 1n, bb = base, e2 = ex;
      while (e2 > 0n) { if (e2 & 1n) res *= bb; bb *= bb; e2 >>= 1n; }
      if (res >= -9007199254740991n && res <= 9007199254740991n) return Number(res);
      return res;
    }
    var r2 = Math.pow(numOf(a), numOf(b));
    if (!isFinite(r2)) throw errNew("OverflowError", ["(34, 'Numerical result out of range')"], env);
    if (!fa && !fb && numOf(b) < 0) return new PyFloat(r2);
    return new PyFloat(r2);
  }
  function unaryOp(op, v, env) {
    if (op === "-") {
      if (!isNum(v)) {
        if (v instanceof PyInstance) {
          var n = dunder(v, "__neg__", env);
          if (n) return call(n, [], {}, env);
        }
        throw errNew("TypeError", ["bad operand type for unary -: '" + typeName(v) + "'"], env);
      }
      if (typeof v === "bigint") return -v;
      if (v instanceof PyFloat) return new PyFloat(-v.v);
      if (v === true) return -1;
      if (v === false) return 0;
      return -v;
    }
    if (op === "+") {
      if (!isNum(v)) {
        if (v instanceof PyInstance) { var p = dunder(v, "__pos__", env); if (p) return call(p, [], {}, env); }
        throw errNew("TypeError", ["bad operand type for unary +: '" + typeName(v) + "'"], env);
      }
      return v;
    }
    if (op === "~") {
      if (!isInt(v)) throw errNew("TypeError", ["bad operand type for unary ~: '" + typeName(v) + "'"], env);
      var x = typeof v === "bigint" ? v : BigInt(Math.trunc(numOf(v)));
      var r = ~x;
      return fits(r) ? Number(r) : r;
    }
    return v;
  }
  R.unaryOp = unaryOp;

  function cmpOne(op, a, b, env) {
    switch (op) {
      case "==": return pyEq(a, b, env);
      case "!=": return !pyEq(a, b, env);
      case "is": return identityEq(a, b, env);
      case "is not": return !identityEq(a, b, env);
      case "in": return contains(b, a, env);
      case "not in": return !contains(b, a, env);
    }
    /* 大小比较 */
    if (isStr(a) && isStr(b)) return a < b ? (op === "<" || op === "<=") : a > b ? (op === ">" || op === ">=") : (op === "<=" || op === ">=");
    if (a instanceof PyBytes && b instanceof PyBytes) {
      var la = a.b.length, lb = b.b.length, min = Math.min(la, lb), rel = 0;
      for (var i = 0; i < min; i++) { if (a.b[i] !== b.b[i]) { rel = a.b[i] < b.b[i] ? -1 : 1; break; } }
      if (rel === 0) rel = la === lb ? 0 : (la < lb ? -1 : 1);
      return relOp(rel, op);
    }
    if (isNum(a) && isNum(b)) {
      if ((a === NONE || b === NONE)) return cmpFail(op, a, b, env);
      var na = floatVal(a), nb = floatVal(b);
      if (Number.isNaN(na) || Number.isNaN(nb)) return cmpFail(op, a, b, env);
      return relOp(na === nb ? 0 : (na < nb ? -1 : 1), op);
    }
    if (Array.isArray(a) && Array.isArray(b)) {
      var n = Math.min(a.length, b.length), r = 0;
      for (var j = 0; j < n; j++) {
        if (!pyEq(a[j], b[j], env)) { r = cmpOne("<", a[j], b[j], env) ? -1 : 1; break; }
      }
      if (r === 0) r = a.length === b.length ? 0 : (a.length < b.length ? -1 : 1);
      return relOp(r, op);
    }
    if (a instanceof PyTuple && b instanceof PyTuple) return cmpOne(op, a.items, b.items, env);
    if (a instanceof PyInstance || b instanceof PyInstance) {
      var pair = { "<": ["__lt__", "__gt__"], ">": ["__gt__", "__lt__"], "<=": ["__le__", "__ge__"], ">=": ["__ge__", "__le__"] }[op];
      if (pair) {
        if (a instanceof PyInstance) {
          var ma = dunder(a, pair[0], env);
          if (ma) { var va = call(ma, [b], {}, env); if (va !== NOTSET && va !== NONE) return truthy(va, env); }
        }
        if (b instanceof PyInstance) {
          var mb = dunder(b, pair[1], env);
          if (mb) { var vb = call(mb, [a], {}, env); if (vb !== NOTSET && vb !== NONE) return truthy(vb, env); }
        }
      }
      if (op === "==" || op === "!=") { var e1 = pyEq(a, b, env); return op === "==" ? e1 : !e1; }
    }
    return cmpFail(op, a, b, env);
  }
  function relOp(r, op) {
    return op === "<" ? r < 0 : op === ">" ? r > 0 : op === "<=" ? r <= 0 : r >= 0;
  }
  function cmpFail(op, a, b, env) {
    throw errNew("TypeError", ["'" + op + "' not supported between instances of '" + typeName(a) + "' and '" + typeName(b) + "'"], env);
  }
  function identityEq(a, b, env) {
    if (a === NONE || b === NONE) return a === b;
    if (isBool(a) || isBool(b)) return isBool(a) && isBool(b) ? a === b : false;
    if (isNum(a) || isNum(b)) {
      if (!(isNum(a) && isNum(b))) return false;
      /* 浮点值各算各的就是两个对象；只有同一个 PyFloat 引用才 is 得起来 */
      if (a instanceof PyFloat || b instanceof PyFloat) return a === b;
      var n1 = numOf(a), n2 = numOf(b);
      if (n1 !== n2) return false;
      return Number.isInteger(n1) && n1 >= -5 && n1 <= 256;      /* CPython 只缓存这一小把整数 */
    }
    if (isStr(a) && isStr(b)) return a === b;
    return a === b;
  }
  R.identityEq = identityEq;
  R.cmpOne = cmpOne;

  function evalCmp(n, sc, env) {
    var left = evalExpr(n.left, sc, env);
    var res = true;
    for (var i = 0; i < n.ops.length; i++) {
      var right = evalExpr(n.comps[i], sc, env);
      if (!cmpOne(n.ops[i], left, right, env)) { res = false; }
      left = right;
      if (!res) { /* 短路：后面的不再比 */ break; }
    }
    return res;
  }

  function setOp(op, a, b, env) {
    var out = new PySet(a.k === "frozenset" || b.k === "frozenset" ? "frozenset" : "set");
    if (op === "&") { a.map.forEach(function (v, k) { if (b.map.has(k)) out.map.set(k, v); }); return out; }
    if (op === "|") { a.map.forEach(function (v, k) { out.map.set(k, v); }); b.map.forEach(function (v, k) { out.map.set(k, v); }); return out; }
    if (op === "^") { a.map.forEach(function (v, k) { if (!b.map.has(k)) out.map.set(k, v); }); b.map.forEach(function (v, k) { if (!a.map.has(k)) out.map.set(k, v); }); return out; }
    return out;
  }

  /* 存值：目标节点 → 变量/属性/下标 */
  function store(t, v, sc, env) {
    switch (t.k) {
      case "name": assign(sc, t.name, v, env); if (env.trace) env.trace.vars[t.name] = v; return;
      case "attr": attrSet(evalExpr(t.value, sc, env), t.attr, v, env); return;
      case "sub": {
        var obj = evalExpr(t.value, sc, env);
        var key = t.index.k === "slice" ? evalSlice(t.index, sc, env) : evalExpr(t.index, sc, env);
        setItem(obj, key, v, env);
        return;
      }
      case "seq": return storeSeq(t, v, sc, env);
      case "star": throw errNew("SyntaxError", ["starred assignment target must be in a list or tuple"], env);
      default: throw errNew("SyntaxError", ["cannot assign to " + t.k], env);
    }
  }
  R.store = store;

  function storeSeq(t, v, sc, env) {
    var items = t.items;
    var starAt = -1;
    items.forEach(function (x, i) { if (x.k === "star") starAt = i; });
    var vals;
    if (v instanceof PyTuple) vals = v.items;
    else if (Array.isArray(v)) vals = v;
    else if (v instanceof PyRange) vals = listOf(v, env);
    else if (isStr(v)) vals = Array.from(v);
    else if (v instanceof PyDict) vals = listOf(v, env);
    else if (v instanceof PyIter) vals = listOf(v, env);
    else if (v && v.k === "iter") vals = listOf(v, env);
    else if (v instanceof PyInstance && (dunder(v, "__iter__", env) || dunder(v, "__getitem__", env))) vals = listOf(v, env);
    else throw errNew("TypeError", ["cannot unpack non-iterable " + typeName(v) + " object"], env);
    var n = items.length;
    if (starAt < 0) {
      if (vals.length !== n) throw errNew("ValueError", [vals.length < n
        ? "not enough values to unpack (expected " + n + ", got " + vals.length + ")"
        : "too many values to unpack (expected " + n + ", got " + vals.length + ")"], env);
      items.forEach(function (x, i) { store(x, vals[i], sc, env); });
      return;
    }
    var before = starAt, after = n - starAt - 1;
    if (vals.length < before + after) {
      throw errNew("ValueError", ["not enough values to unpack (expected at least " + (before + after) + ", got " + vals.length + ")"], env);
    }
    items.forEach(function (x, i) {
      if (i === starAt) store(x.target, vals.slice(before, vals.length - after), sc, env);
      else if (i < starAt) store(x, vals[i], sc, env);
      else store(x, vals[vals.length - (n - i)], sc, env);
    });
  }

  /* 删除名字用不到 evalLoad，但赋值目标里有嵌套读取 */
  function evalLoad(t, sc, env) {
    if (t.k === "name") return loadName(t.name, sc, env);
    if (t.k === "attr") return attrGet(evalExpr(t.value, sc, env), t.attr, env);
    if (t.k === "sub") {
      var o = evalExpr(t.value, sc, env);
      return getItem(o, t.index.k === "slice" ? evalSlice(t.index, sc, env) : evalExpr(t.index, sc, env), env);
    }
    return evalExpr(t, sc, env);
  }
  R.evalLoad = evalLoad;

  /* ================= 输出与解释器外壳 ================= */
  function coerce(cls, args, kw, env) {
    if (cls.ctor) return cls.ctor.fn ? cls.ctor.fn(args, kw, env) : cls.ctor(args, kw, env);
    if (cls === TYPES.int) return B.int_(args, kw, env);
    if (cls === TYPES.float) return B.float_(args, kw, env);
    if (cls === TYPES.bool) return args.length ? truthy(args[0], env) : false;
    if (cls === TYPES.str) return args.length ? toStr(args[0], env) : "";
    if (cls === TYPES.NoneType) return NONE;
    throw errNew("TypeError", ["cannot create '" + cls.pyname + "' instances in the sandbox"], env);
  }
  R.fsFor = function (env) { return env.fs; };
  R.INTERNAL = {
    execBlock: execBlock, execStmt: execStmt, evalExpr: evalExpr, store: store, storeSeq: storeSeq,
    assign: assign, call: call, binop: binop, cmpOne: cmpOne, unparse: unparse,
    Scope: Scope, getModule: getModule, dSet: dSet, execTry: execTry,
    BreakSig: BreakSig, ContinueSig: ContinueSig, ReturnSig: ReturnSig, runBody: runBody,
    callFunc: callFunc, formatValue: formatValue, loadName: loadName, attrGet: attrGet,
    mro: mro, PyIter: PyIter, nextOf: nextOf, iterOf: iterOf, compRun: compRun, evalFStr: evalFStr
  };
  return R;
});
