/* 喵站 · Python 沙箱 · 内置函数与类型方法
 *
 * 载入顺序：py-engine.js → py-runtime.js → py-builtin.js → py-stdlib.js
 * 这一层往 runtime 的注册表 B 里填 builtins / methods / attr_tables，不碰执行核心。
 * 报错正文一律照 CPython 的写法，因为正文里有大量 try/except 演示会把异常原样打印出来。
 */
(function (root) {
  "use strict";
  var R = root.MIAO_PYRUN || (typeof require === "function" ? require("./py-runtime.js") : null);
  var I = R.INTERNAL, B = R.B, ENG = R.ENG;
  var NONE = R.NONE, NOTSET = R.NOTSET, TYPES = R.TYPES;
  var PyTuple = R.PyTuple, PyDict = R.PyDict, PySet = R.PySet, PyBytes = R.PyBytes;
  var PyFloat = R.PyFloat, PyFunc = R.PyFunc, PyBuiltin = R.PyBuiltin, PyClass = R.PyClass, PyInstance = R.PyInstance;
  var PyRange = R.PyRange, PyModule = R.PyModule, PyType = R.PyType;
  /* repr/str/toStr/length/iterate/typeName 都走一层包装：
     运行时里这些函数会随视图、文件等新类型继续长胖，注册表必须现取现用，不能捕获快照。 */
  var repr = function (v, env) { return R.repr(v, env); };
  var str = function (v, env) { return R.str(v, env); };
  var toStr = function (v, env) { return R.toStr(v, env); };
  var length = function (v, env) { return R.length(v, env); };
  var iterate = function (v, env, cb) { return R.iterate(v, env, cb); };
  var typeName = function (v) { return R.typeName(v); };
  var reprStr = R.reprStr, reprFloat = R.reprFloat;
  var truthy = R.truthy, pyEq = R.pyEq, hashKey = R.hashKey, numOf = R.numOf;
  var isNum = R.isNum, isStr = R.isStr, isInt = R.isInt, isBool = R.isBool;
  var call = R.call, errNew = R.errNew, length = R.length, getItem = R.getItem, setItem = R.setItem;
  var iterate = R.iterate, listOf = R.listOf, iterOf = R.iterOf, nextOf = R.nextOf, STOP = R.STOP;
  var formatValue = R.formatValue, normIndex = R.normIndex, normSlice = R.normSlice, SLICE = R.SLICE;
  var rangeLen = R.rangeLen, dunder = R.dunder, contains = R.contains, dSet = I.dSet;
  var evalExpr = R.evalExpr, attrGet = R.attrGet;

  /* ---------------- 小工具 ---------------- */
  function bin(name, fn, doc) { return new PyBuiltin(name, fn, doc); }
  function def(name, fn, doc) { B.builtins.set(name, bin(name, fn, doc)); }
  function argCount(args, name, n, env, min) {
    if (min != null ? args.length < min : args.length < n) throw errNew("TypeError", [name + "() takes " + n + " argument" + (n === 1 ? "" : "s") + " (" + args.length + " given)"], env);
    if (args.length > (min != null ? Infinity : n)) throw errNew("TypeError", [name + "() takes " + n + " argument" + (n === 1 ? "" : "s") + " (" + args.length + " given)"], env);
  }
  function kwGet(kw, name, dft) { return kw[name] === undefined ? dft : kw[name]; }
  function tup(items) { return new PyTuple(items); }
  function toList(v) { return v instanceof PyTuple ? v.items.slice() : v.slice(); }
  function pyJoin(parts, sep) { return parts.join(sep); }
  function ord1(s) { var cp = s.codePointAt(0); return cp; }
  function chrOf(n) {
    n = numOf(n);
    if (n < 0 || n > 0x10FFFF) throw errNew("ValueError", ["chr() arg not in range(0x110000)"], R.curEnv);
    return String.fromCodePoint(n);
  }
  function idxOf(v, len, env, negErr, what) {
    var n = numOf(v);
    if (n < 0) {
      if (negErr) throw errNew(negErr, [typeof negErr === "string" && negErr.indexOf("empty") >= 0 ? "empty " + (what || "") : ""], env);
      n = 0;
    }
    return Math.min(n, len);
  }
  /* 参数里的可迭代对象统一收成数组 */
  function seqOf(v, env) { return listOf(v, env); }

  /* ================= 输出：print / 文件句柄 ================= */
  function writeOut(env, text) {
    env.outBuf.push(text);
    if (env.outBuf.length > 20000) env.outBuf.splice(0, 10000);
    if (env.trace && env.trace.outputs) env.trace.outputs.push(text);
  }
  R.writeOut = writeOut;

  def("print", function (args, kw, env) {
    var sep = kw.sep === undefined || kw.sep === NONE ? " " : toStr(kw.sep, env);
    var end = kw.end === undefined || kw.end === NONE ? "\n" : toStr(kw.end, env);
    var text = args.map(function (a) { return toStr(a, env); }).join(sep) + end;
    if (kw.file && kw.file !== NONE && kw.file.k === "file") { kw.file.write(text); return NONE; }
    if (kw.file && kw.file.k === "obj") { var w = dunder(kw.file, "write", env); if (w) call(w, [text], {}, env); return NONE; }
    if (env.stdoutObj) env.stdoutObj.write(text);
    else writeOut(env, text);
    return NONE;
  }, "Prints the values to a stream, or to sys.stdout by default.\n" +
      "\n" +
      "  sep\n" +
      "    string inserted between values, default a space.\n" +
      "  end\n" +
      "    string appended after the last value, default a newline.\n" +
      "  file\n" +
      "    a file-like object (stream); defaults to the current sys.stdout.\n" +
      "  flush\n" +
      "    whether to forcibly flush the stream.");

  /* 文件对象：k='file'，内容走虚拟文件系统，永远不会碰到真实磁盘 */
  function PyFile(env, name, mode, encoding, isStr2) {
    this.k = "file";
    this.name = name;
    this.mode = mode;
    this.encoding = encoding || null;
    this.binary = /[bB]/.test(mode);
    this.clsName = this.binary ? (/r/.test(mode) ? "BufferedReader" : "BufferedWriter") : "TextIOWrapper";
    this.closed = false;
    this.pos = 0;
    this.env = env;
    this.fs = env.fs;
    this.append = /[aA]/.test(mode);
    this.wbuf = "";
    if (this.binary) this.wbytes = [];
    if (/r/.test(mode) && !/[+]/.test(mode) || /r/.test(mode)) {
      if (!env.fs.exists(name)) {
        if (/w|a|x/.test(mode)) { /* 不会走到这里 */ }
        else throw errNew("FileNotFoundError", [2, "No such file or directory: " + reprStr(name)], env);
      }
      if (env.fs.isDir(name)) throw errNew("IsADirectoryError", [21, "Is a directory: " + reprStr(name)], env);
    }
    if (/x/.test(mode) && env.fs.exists(name)) throw errNew("FileExistsError", [17, "File exists: " + reprStr(name)], env);
    if (/w|a/.test(mode)) {
      if (this.append) {
        var old = this.binary ? (env.fs.readBytes(name) || new Uint8Array(0)) : (env.fs.read(name) || "");
        if (this.binary) this.wbytes = [old]; else this.wbuf = typeof old === "string" ? old : "";
      }
      this.flushNow();
    }
  }
  PyFile.prototype.absName = function () { return this.fs.norm(this.name); };
  PyFile.prototype.flushNow = function () {
    if (this.binary) {
      var total = this.wbytes.reduce(function (n, b) { return n + b.length; }, 0);
      var out = new Uint8Array(total), off = 0;
      this.wbytes.forEach(function (b) { out.set(b, off); off += b.length; });
      this.fs.files.set(this.absName(), { text: null, bytes: out, mtime: (this.fs.files.get(this.absName()) || {}).mtime || 1000 });
      this.fs.mkdir(this.absName().split("/").slice(0, -1).join("/") || "/", true);
    } else {
      var cur = this.fs.read(this.name);
      if (cur === null || cur !== this.wbuf) this.fs.write(this.name, this.wbuf);
    }
  };
  PyFile.prototype.write = function (s) {
    if (this.closed) throw errNew("ValueError", ["I/O operation on closed file."], this.env);
    if (this.binary) {
      var b = s instanceof PyBytes ? s.b : new TextEncoder().encode(String(s));
      this.wbytes.push(b);
      this.pos += b.length;
      this.dirty = true;
      return b.length;
    }
    this.wbuf += String(s);
    this.pos += Array.from(String(s)).length;
    this.dirty = true;
    /* CPython 写文件是有缓冲的，没 close/flush 之前磁盘上读不到 —— 第 42 课拿这点做过演示 */
    return Array.from(String(s)).length;
  };
  PyFile.prototype.content = function () {
    if (this.binary) return new PyBytes(this.fs.readBytes(this.name) || new Uint8Array(0));
    return this.fs.read(this.name) || "";
  };
  PyFile.prototype.read = function (n) {
    if (this.closed) throw errNew("ValueError", ["I/O operation on closed file."], this.env);
    var all = this.binary ? new PyBytes(this.fs.readBytes(this.name) || new Uint8Array(0)) : (this.fs.read(this.name) || "");
    if (n === undefined || n === null || n === NONE) {
      if (this.binary) { var b = all.b.slice(this.pos); this.pos = all.b.length; return new PyBytes(b); }
      var s = String(all).slice(this.pos); this.pos = String(all).length; return s;
    }
    var k = numOf(n);
    if (this.binary) { var seg = all.b.slice(this.pos, this.pos + k); this.pos += seg.length; return new PyBytes(seg); }
    var part = String(all).slice(this.pos, this.pos + k); this.pos += part.length; return part;
  };
  PyFile.prototype.readline = function () {
    var all = this.binary ? new PyBytes(this.fs.readBytes(this.name) || new Uint8Array(0)) : (this.fs.read(this.name) || "");
    if (this.binary) {
      var b = all.b, i = this.pos;
      while (i < b.length && b[i] !== 10) i++;
      var seg = b.slice(this.pos, i < b.length ? i + 1 : i);
      this.pos = i < b.length ? i + 1 : i;
      return new PyBytes(seg);
    }
    var s = String(all), j = s.indexOf("\n", this.pos);
    var line = j < 0 ? s.slice(this.pos) : s.slice(this.pos, j + 1);
    this.pos = j < 0 ? s.length : j + 1;
    return line;
  };
  R.PyFile = PyFile;
  R.isFileObj = function (v) { return v && v.k === "file"; };

  /* ================= 内置函数 ================= */
  def("len", function (args, kw, env) {
    if (args.length !== 1) throw errNew("TypeError", ["len() takes exactly one argument (" + args.length + " given)"], env);
    var v = args[0];
    if (isStr(v)) return Array.from(v).length;
    return length(v, env);
  }, "Return the number of items in a container.");

  def("type", function (args, kw, env) {
    if (args.length === 3) return NONE;                     /* type(名, 基, 字典) 不接 */
    var v = args[0];
    var n = typeName(v);
    if (v instanceof PyInstance) {
      var t = TYPES[v.cls.name];
      return v.cls;
    }
    if (TYPES[n]) return TYPES[n];
    if (n === "method") return TYPES.method;
    if (n === "function") return TYPES.function;
    if (v && v.k === "file") return { k: "type", name: v.clsName, pyname: v.clsName };
    if (v instanceof PyModule) return TYPES.module;
    return TYPES.object;
  }, "type(object) -> the object's type");

  def("isinstance", function (args, kw, env) {
    var v = args[0], cls = args[1];
    var list = cls instanceof PyTuple ? cls.items : [cls];
    return list.some(function (c) { return isinstanceOne(v, c, env); });
  }, "Check if an object is an instance of a class.");
  function isinstanceOne(v, cls, env) {
    if (cls === TYPES.int) return (isNum(v) && !(v instanceof PyFloat) && !isBool(v)) || isBool(v);
    if (cls === TYPES.float) return v instanceof PyFloat;
    if (cls === TYPES.bool) return isBool(v);
    if (cls === TYPES.str) return isStr(v);
    if (cls === TYPES.bytes) return v instanceof PyBytes;
    if (cls === TYPES.list) return Array.isArray(v);
    if (cls === TYPES.tuple) return v instanceof PyTuple;
    if (cls === TYPES.dict) return v instanceof PyDict;
    if (cls === TYPES.set) return v instanceof PySet && v.k === "set";
    if (cls === TYPES.frozenset) return v instanceof PySet && v.k === "frozenset";
    if (cls === TYPES.object) return !(v === NONE) && typeof v !== "number" && typeof v !== "bigint";
    if (cls instanceof PyClass) {
      if (cls.isExc && v && v.k2 === "exc") return R.isExcInstance(v, cls.isExc, env);
      if (!(v instanceof PyInstance)) {
        if (cls === TYPES.module && v instanceof PyModule) return true;
        return false;
      }
      var c = v.cls;
      while (c) { if (c === cls) return true; c = c.bases.length ? c.bases[0] : null; }
      return false;
    }
    if (cls instanceof PyType) return typeName(v) === cls.name;
    return false;
  }
  R.isinstanceOne = isinstanceOne;

  def("issubclass", function (args, kw, env) {
    var a = args[0], b = args[1];
    /* 内置类型之间的父子关系（bool 是 int 的儿子，第 18、21 课都会问到） */
    var PARENTS = { bool: ["int", "object"], int: ["object"], float: ["object"], str: ["object"],
      bytes: ["object"], list: ["object"], tuple: ["object"], dict: ["object"], set: ["object"],
      frozenset: ["object"], type: ["object"], object: [] };
    var targets = b instanceof PyTuple ? b.items : [b];
    if (a instanceof PyType) {
      return targets.some(function (t) {
        var tn = t instanceof PyType ? t.name : (t instanceof PyClass ? t.name : typeName(t));
        return tn === a.name || (PARENTS[a.name] || []).indexOf(tn) >= 0 || tn === "object";
      });
    }
    if (!(a instanceof PyClass)) return false;
    return targets.some(function (target) {
      if (!(target instanceof PyClass)) return target === TYPES.object || (target instanceof PyType && target.name === "object");
      var c = a;
      while (c) { if (c === target) return true; c = c.bases.length ? c.bases[0] : null; }
      return false;
    });
  }, "issubclass(class, class tuple) -> bool");

  def("repr", function (args, kw, env) { return repr(args[0], env); }, "Return the interpreter's representation.");
  def("ascii", function (args, kw, env) { return repr(args[0], env); }, "ascii(object) -> string");
  def("id", function (args, kw, env) {
    var v = args[0];
    if (args.length !== 1) throw errNew("TypeError", ["id() takes exactly one argument (" + args.length + " given)"], env);
    if (v === NONE) return 140000000000000;
    if (v === true) return 140000000000672;
    if (v === false) return 140000000000632;
    /* 小整数与相同内容的字符串在 CPython 里是同一个对象，这里给确定性假地址 */
    if (typeof v === "number" && Number.isInteger(v) && Math.abs(v) < 257) return 140000000001000 + (v + 5) * 28;
    if (typeof v === "bigint" && v > -5n && v < 257n) return 140000000001000 + Number(v + 5n) * 28;
    if (isStr(v)) return 140000000200000 + strSlot(v);
    if (v && typeof v === "object") {
      if (!v.__iid) v.__iid = ++IDC;
      return 140000000000000 + 500000 + v.__iid * 32;
    }
    return 140000000000000 + 900000;
  }, "Return the identity of an object.");
  var IDC = 0, SLOTS = {};
  function strSlot(s) {
    if (SLOTS[s] === undefined) SLOTS[s] = Object.keys(SLOTS).length + 1;
    return SLOTS[s] * 64;
  }

  def("hash", function (args, kw, env) {
    var k = hashKey(args[0], env);
    var h = 0;
    for (var i = 0; i < k.length; i++) h = (h * 131 + k.charCodeAt(i)) | 0;
    return h === -1 ? -2 : h;
  }, "Return the hash value of an object.");

  /* 类型转换 */
  def("int", B.int_ = function (args, kw, env) {
    if (!args.length) return 0;
    var v = args[0], base = args.length > 1 ? numOf(args[1]) : (kw.base !== undefined ? numOf(kw.base) : 10);
    if (isBool(v)) return v ? 1 : 0;
    if (typeof v === "bigint") return Math.abs(v) <= 9007199254740991n ? Number(v) : v;
    if (typeof v === "number") return Math.trunc(v);
    if (v instanceof PyFloat) return Math.trunc(v.v);
    if (isStr(v)) {
      var s = v.trim();
      if (!s) throw errNew("ValueError", ["invalid literal for int() with base " + base + ": " + reprStr(v)], env);
      var n = base === 10 ? /^[-+]?[0-9]+(_[0-9]+)*$/.test(s) ? Number(s.replace(/_/g, "")) : NaN : parseInt(s.replace(/_/g, ""), base);
      if (isNaN(n) || !Number.isFinite(n)) throw errNew("ValueError", ["invalid literal for int() with base " + base + ": " + reprStr(v)], env);
      return Math.trunc(n);
    }
    if (v instanceof PyBytes) return B.methods.bytes ? int_from_bytes_stub(env) : 0;
    throw errNew("int() argument must be a string, a bytes-like object or a real number, not '" + typeName(v) + "'", env ? ["int() argument must be a string, a bytes-like object or a real number, not '" + typeName(v) + "'"] : [], env);
  }, "int(x) -> integer");
  function int_from_bytes_stub(env) { throw errNew("TypeError", ["int() can't convert non-string with explicit base"], env); }

  def("float", B.float_ = function (args, kw, env) {
    if (!args.length) return new PyFloat(0);
    var v = args[0];
    if (isBool(v)) return new PyFloat(v ? 1 : 0);
    if (isNum(v)) return new PyFloat(numOf(v));
    if (isStr(v)) {
      var s = v.trim().replace(/_/g, "");
      var m = /^[-+]?((\d+\.?\d*|\.\d+)([eE][-+]?\d+)?|inf(inity)?|nan)$/i.exec(s);
      if (!m) throw errNew("ValueError", ["could not convert string to float: " + reprStr(v)], env);
      /* JS 的 parseFloat 不认 inf / nan 这两个词，得自己翻译 */
      var low = s.toLowerCase();
      if (low === "inf" || low === "+inf" || low === "infinity" || low === "+infinity") return new PyFloat(Infinity);
      if (low === "-inf" || low === "-infinity") return new PyFloat(-Infinity);
      if (low === "nan") return new PyFloat(NaN);
      return new PyFloat(parseFloat(s));
    }
    if (v instanceof PyInstance) { var f = dunder(v, "__float__", env); if (f) return new PyFloat(numOf(call(f, [], {}, env))); }
    throw errNew("float() argument must be a string or a real number, not '" + typeName(v) + "'", [], env);
  }, "float(x) -> floating point number");

  def("complex", function () { throw errNew("TypeError", ["本沙箱不支持复数"], arguments[2]); }, "complex(x)");
  def("bool", function (args, kw, env) { return args.length ? truthy(args[0], env) : false; }, "bool(x) -> bool");
  def("str", function (args, kw, env) {
    if (!args.length) return "";
    var v = args[0];
    if (v instanceof PyBytes && args.length > 1) return toStr(decodeBytes(v, toStr(args[1], env), env), env);
    return toStr(v, env);
  }, "str(object) -> string");
  function decodeBytes(b, enc, env) {
    if (enc.indexOf("utf") < 0 && enc !== "utf-8") throw errNew("LookupError", ["unknown encoding: " + enc], env);
    return new TextDecoder("utf-8").decode(b.b);
  }
  def("bytes", function (args, kw, env) {
    if (!args.length) return new PyBytes(new Uint8Array(0));
    var v = args[0];
    if (isStr(v)) return new PyBytes(new TextEncoder().encode(v));
    if (v instanceof PyBytes) return new PyBytes(v.b.slice());
    if (isNum(v)) return new PyBytes(new Uint8Array(Math.max(0, numOf(v))));
    return new PyBytes(new Uint8Array(seqOf(v, env).map(function (x) { return numOf(x) & 255; })));
  }, "bytes(x)");

  def("list", function (args, kw, env) {
    if (!args.length) return [];
    var v = args[0];
    if (Array.isArray(v)) return v.slice();
    if (v instanceof PyTuple) return v.items.slice();
    if (isStr(v)) return Array.from(v);
    if (v instanceof PyDict) return listOf(v, env);
    if (v instanceof PyBytes) return listOf(v, env);
    return listOf(v, env);
  }, "list(iterable) -> list");
  def("tuple", function (args, kw, env) {
    if (!args.length) return tup([]);
    return tup(seqOf(args[0], env));
  }, "tuple(iterable) -> tuple");
  def("set", function (args, kw, env) {
    var s = new PySet(false);
    if (args.length) seqOf(args[0], env).forEach(function (v) { s.map.set(hashKey(v, env), v); });
    return s;
  }, "set(iterable) -> set");
  def("frozenset", function (args, kw, env) {
    var s = new PySet(true);
    if (args.length) seqOf(args[0], env).forEach(function (v) { s.map.set(hashKey(v, env), v); });
    return s;
  }, "frozenset(iterable) -> frozenset");
  def("dict", function (args, kw, env) {
    var d = new PyDict();
    if (args.length) {
      var src = args[0];
      if (src instanceof PyDict) src.map.forEach(function (kv) { d.map.set.apply(d.map, [hashKey(kv[0], env), kv]); });
      else seqOf(src, env).forEach(function (pair) { var a2 = seqOf(pair, env); dSet(d, a2[0], a2[1], env); });
    }
    Object.keys(kw).forEach(function (k) { dSet(d, k, kw[k], env); });
    return d;
  }, "dict() -> dict");

  def("range", function (args, kw, env) {
    var a = args.map(function (x) { return numOf(x); });
    if (!args.length) throw errNew("TypeError", ["range() must either be all integers, or all real numbers"], env);
    if (a.length === 1) return new PyRange(0, a[0], 1);
    if (a.length === 2) return new PyRange(a[0], a[1], 1);
    if (a.length === 3) {
      if (a[2] === 0) throw errNew("ValueError", ["range() arg 3 must not be zero"], env);
      return new PyRange(a[0], a[1], a[2]);
    }
    throw errNew("TypeError", ["range() takes 1-3 arguments (" + args.length + " given)"], env);
  }, "range(stop) -> range object");
  def("slice", function (args, kw, env) {
    return { k: "slice", lower: args.length > 1 ? args[0] : null, upper: args.length > 1 ? args[1] : args[0], step: args.length > 2 ? args[2] : null, isSliceObj: true };
  }, "slice(start, stop, step)");

  /* 聚合 */
  function arithInit(v, env) {
    if (isBool(v)) return { n: numOf(v), f: false };
    if (typeof v === "bigint") return { n: v, f: false };
    if (v instanceof PyFloat) return { n: v.v, f: true };
    if (typeof v === "number") return { n: v, f: !Number.isInteger(v) };
    throw errNew("TypeError", ["unsupported operand type(s) for +: '" + typeName(v) + "' and 'int'"], env);
  }
  def("sum", function (args, kw, env) {
    var seq = seqOf(args[0], env), start = args[1] === undefined ? (kw.start === undefined ? 0 : kw.start) : args[1];
    var acc = arithInit(start, env);
    seq.forEach(function (v) {
      var x = arithInit(v, env);
      if (x.f || acc.f) { acc = { n: acc.n + x.n, f: true }; }
      else if (typeof acc.n === "bigint" || typeof x.n === "bigint") acc = { n: BigInt(acc.n) + BigInt(x.n), f: false };
      else {
        var s = acc.n + x.n;
        if (!Number.isSafeInteger(s)) acc = { n: BigInt(acc.n) + BigInt(x.n), f: false };
        else acc = { n: s, f: false };
      }
    });
    return acc.f ? new PyFloat(acc.n) : acc.n;
  }, "Sum of a sequence.");
  def("max", function (args, kw, env) {
    var seq = args.length === 1 ? seqOf(args[0], env) : args;
    var key = kw.key ? function (v) { return call(kw.key, [v], {}, env); } : function (v) { return v; };
    if (!seq.length) {
      if (kw.default !== undefined) return kw.default;
      throw errNew("ValueError", ["max() arg is an empty sequence"], env);
    }
    var best = seq[0], bk = key(best);
    seq.slice(1).forEach(function (v) { var k = key(v); if (R.cmpOne(">", k, bk, env)) { best = v; bk = k; } });
    return best;
  }, "max(iterable) -> value");
  def("min", function (args, kw, env) {
    var seq = args.length === 1 ? seqOf(args[0], env) : args;
    var key = kw.key ? function (v) { return call(kw.key, [v], {}, env); } : function (v) { return v; };
    if (!seq.length) {
      if (kw.default !== undefined) return kw.default;
      throw errNew("ValueError", ["min() arg is an empty sequence"], env);
    }
    var best = seq[0], bk = key(best);
    seq.slice(1).forEach(function (v) { var k = key(v); if (R.cmpOne("<", k, bk, env)) { best = v; bk = k; } });
    return best;
  }, "min(iterable) -> value");
  def("abs", function (args, kw, env) {
    var v = args[0];
    if (isBool(v)) return numOf(v) ? 1 : 0;
    if (typeof v === "bigint") return v < 0n ? -v : v;
    if (!isNum(v)) throw errNew("BadOpcode", ["bad operand type for abs(): '" + typeName(v) + "'"], env);
    var n = numOf(v);
    if (v instanceof PyFloat) return new PyFloat(Math.abs(n));
    return Math.abs(n);
  }, "abs(x) -> value");
  def("round", function (args, kw, env) {
    if (!args.length) throw errNew("TypeError", ["round() takes at least 1 argument (0 given)"], env);
    var v = args[0];
    if (!isNum(v)) throw errNew("TypeError", ["type " + typeName(v) + " doesn't define __round__ method"], env);
    var nd = args[1] === undefined ? (kw.ndigits === undefined ? 0 : numOf(kw.ndigits)) : numOf(args[1]);
    var isFloatIn = v instanceof PyFloat;
    if (nd < 0) {                                  /* round(1250, -2) → 1200 */
      var scale = Math.pow(10, -nd), n4 = numOf(v) / scale;
      var r4 = pyRoundNum(n4, 0) * scale;
      return isFloatIn ? new PyFloat(r4) : Math.trunc(r4);
    }
    var r = pyRoundNum(numOf(v), nd);
    return nd === 0 && !isFloatIn && kw.ndigits === undefined && args[1] !== undefined
      ? Math.trunc(r)
      : (nd === 0 && args[1] === undefined && kw.ndigits === undefined ? Math.trunc(r) : new PyFloat(r));
  }, "Return the number rounded to ndigits places.");
  /* 「四舍六入五成双」，而且要按这个 double 的真实十进制展开来判 5
     —— round(2.675, 2) 得 2.67，因为 2.675 存进来其实是 2.67499999…（第 17 课的例子） */
  function pyRoundNum(x, nd) {
    if (!isFinite(x)) return x;
    var neg = x < 0, a = Math.abs(x);
    var s = a.toPrecision(21);
    if (/e[-+]/i.test(s)) s = a.toFixed(20);
    var dot = s.indexOf(".");
    var intPart = dot < 0 ? s : s.slice(0, dot);
    var frac = dot < 0 ? "" : s.slice(dot + 1);
    if (frac.length <= nd) return neg ? -a : a;
    var keepF = frac.slice(0, nd), dropped = frac.slice(nd);
    var d = dropped.charAt(0), more = /[1-9]/.test(dropped.slice(1));
    var lastKeptStr = nd > 0 ? keepF.charAt(nd - 1) : intPart.charAt(intPart.length - 1);
    var up = d > "5" ? true : d < "5" ? false : (more ? true : (Number(lastKeptStr) % 2 === 1));
    var scaled = BigInt(intPart + (keepF || ""));
    if (up) scaled += 1n;
    var str = scaled.toString();
    var ip = nd > 0 ? (str.slice(0, str.length - nd) || "0") : str;
    var fp = nd > 0 ? str.slice(str.length - nd) : "";
    var val = parseFloat(ip + (fp ? "." + fp : ""));
    return neg ? -val : val;
  }
  R.pyRoundNum = pyRoundNum;
  function bankerRound(x, nd) {
    var fl = Math.floor(x), fr = x - fl;
    if (fr > 0.5) return fl + 1;
    if (fr < 0.5) return fl;
    return fl % 2 === 0 ? fl : fl + 1;                       /* .5 取偶 */
  }
  def("pow", function (args, kw, env) {
    var r = R.binop("**", args[0], args[1], env);
    if (args.length === 3) return Number(((typeof r === "bigint" ? r : BigInt(Math.trunc(numOf(r)))) % BigInt(numOf(args[2]))));
    return r;
  }, "pow(x, y) -> x**y");
  def("divmod", function (args, kw, env) {
    var a = numOf(args[0]), b = numOf(args[1]);
    if (b === 0) throw errNew("ZeroDivisionError", ["integer division or modulo by zero"], env);
    var q = Math.floor(a / b), m = a - q * b;
    var isF = args[0] instanceof PyFloat || args[1] instanceof PyFloat;
    return tup([isF ? new PyFloat(q) : q, isF ? new PyFloat(m) : m]);
  }, "divmod(x, y) -> (quotient, remainder)");
  def("all", function (args, kw, env) { return listOf(args[0], env).every(function (v) { return truthy(v, env); }); }, "all(i) -> bool");
  def("any", function (args, kw, env) { return listOf(args[0], env).some(function (v) { return truthy(v, env); }); }, "any(i) -> bool");
  def("sorted", function (args, kw, env) {
    if (!args.length) throw errNew("TypeError", ["'sorted' takes at least one argument (0 given)"], env);
    var arr = listOf(args[0], env);
    return sortInPlace(arr, kw, env);
  }, "sorted(iterable) -> list");
  function sortInPlace(arr, kw, env) {
    var key = kw.key ? function (v) { return call(kw.key, [v], {}, env); } : function (v) { return v; };
    var decorated = arr.map(function (v, i) { return [key(v), i, v]; });
    var rev = kw.reverse ? truthy(kw.reverse, env) : false;
    decorated.sort(function (a, b) {
      if (pyEq(a[0], b[0], env)) return a[1] - b[1];
      var less = R.cmpOne("<", a[0], b[0], env);
      return less ? -1 : 1;
    });
    if (rev) decorated.reverse();
    return decorated.map(function (x) { return x[2]; });
  }
  R.sortInPlace = sortInPlace;
  def("reversed", function (args, kw, env) {
    var v = args[0];
    var arr;
    if (isStr(v)) arr = Array.from(v).reverse();
    else if (v instanceof PyRange) arr = listOf(v, env).reverse();
    else if (Array.isArray(v)) arr = v.slice().reverse();
    else if (v instanceof PyTuple) arr = v.items.slice().reverse();
    else throw errNew("TypeError", ["'" + typeName(v) + "' object is not reversed"], env);
    return new R.PyIter(arr, env);
  }, "reversed(seq) -> iterator");
  def("enumerate", function (args, kw, env) {
    var start = args[1] === undefined ? (kw.start === undefined ? 0 : numOf(kw.start)) : numOf(args[1]);
    var arr = listOf(args[0], env);
    return new R.PyIter(arr.map(function (v, i) { return tup([i + start, v]); }), env);
  }, "enumerate(iterable) -> iterator");
  def("zip", function (args, kw, env) {
    if (!args.length) return new R.PyIter([], env);
    var strict = kw.strict && truthy(kw.strict, env);
    var lists = args.map(function (a) { return listOf(a, env); });
    var n = Math.min.apply(null, lists.map(function (l) { return l.length; }));
    var out = [];
    for (var i = 0; i < n; i++) out.push(tup(lists.map(function (l) { return l[i]; })));
    return new R.PyIter(out, env);
  }, "zip(iterables) -> iterator");
  def("map", function (args, kw, env) {
    var f = args[0], lists = args.slice(1).map(function (a) { return listOf(a, env); });
    var n = lists.length ? Math.min.apply(null, lists.map(function (l) { return l.length; })) : 0;
    var out = [];
    for (var i = 0; i < n; i++) out.push(f === NONE ? lists.map(function (l) { return l[i]; })[0] : call(f, lists.map(function (l) { return l[i]; }), {}, env));
    return new R.PyIter(out, env);
  }, "map(function, iterable) -> iterator");
  def("filter", function (args, kw, env) {
    var f = args[0], arr = listOf(args[1], env);
    var out = arr.filter(function (v) { return f === NONE ? truthy(v, env) : truthy(call(f, [v], {}, env), env); });
    return new R.PyIter(out, env);
  }, "filter(function, iterable) -> iterator");
  def("iter", function (args, kw, env) { return iterOf(args[0], env); }, "iter(x) -> iterator");
  def("next", function (args, kw, env) {
    var it = args[0];
    if (args.length > 1 || kw.default !== undefined) {
      try { return nextOf(it, env); } catch (e) { if (e && e.k2 === "exc" && e.cls.isExc === "StopIteration") return args[1] !== undefined ? args[1] : kw.default; throw e; }
    }
    return nextOf(it, env);
  }, "next(iterator) -> value");

  def("input", function (args, kw, env) {
    if (args.length && toStr(args[0], env)) {
      if (env.stdoutObj) env.stdoutObj.write(toStr(args[0], env)); else writeOut(env, toStr(args[0], env));
    }
    var src = env.stdinObj || (env.modules.get("sys") || {}).dict && env.modules.get("sys").dict.get("stdin");
    if (src && typeof src.readline === "function" && src !== env.stdoutObj && src.k === "file") {
      var line = src.readline();
      if (line === "" || line === undefined) throw errNew("EOFError", ["EOF when reading a line"], env);
      if (env.trace) env.trace.inputs.push(line.replace(/\n$/, ""));
      return line.replace(/\n$/, "");
    }
    if (env.stdinQueue && env.stdinQueue.length) {
      var l = env.stdinQueue.shift();
      if (env.trace) env.trace.inputs.push(l);
      return l;
    }
    throw errNew("EOFError", ["EOF when reading a line"], env);
  }, "Read a line from input.");

  def("open", function (args, kw, env) {
    var name = args.length ? toStr(args[0], env) : (kw.file !== undefined ? toStr(kw.file, env) : "");
    var mode = args[1] !== undefined ? toStr(args[1], env) : (kw.mode !== undefined ? toStr(kw.mode, env) : "r");
    var enc = args[2] !== undefined ? toStr(args[2], env) : (kw.encoding !== undefined ? toStr(kw.encoding, env) : null);
    if (!/^[rwabt+]*x?$/.test(mode) && !/[rwa+]/.test(mode)) throw errNew("ValueError", ["Must have mode 'r', 'w', 'a', or 'x': got " + reprStr(mode)], env);
    var binary = /[bB]/.test(mode);
    if (!binary && enc === null && /[rwa]/.test(mode) && env.strictEncoding) { /* 演示里都写了 encoding，不额外报错 */ }
    if (binary && enc !== null) throw errNew("ValueError", ["binary mode: expected None, got " + reprStr(enc)], env);
    if (env.trace) env.trace.opens.push({ name: name, mode: mode, encoding: enc });
    return new PyFile(env, name, mode, enc, true);
  }, "open(path, mode) -> file object");

  def("chr", function (args, kw, env) {
    var n = numOf(args[0]);
    if (n < 0 || n > 0x10FFFF) throw errNew("ValueError", ["chr() arg not in range(0x110000)"], env);
    return String.fromCodePoint(n);
  }, "chr(i) -> character");
  def("ord", function (args, kw, env) {
    var s = args[0];
    if (!isStr(s)) throw errNew("TypeError", ["ord() expected string of length 1, but " + typeName(s) + " found"], env);
    if (Array.from(s).length !== 1) throw errNew("TypeError", ["ord() expected a character, but string of length " + s.length + " found"], env);
    return s.codePointAt(0);
  }, "ord(c) -> integer");
  def("bin", function (args, kw, env) { return (typeof args[0] === "bigint" ? args[0] : BigInt(Math.trunc(numOf(args[0])))).toString(2).replace("-", "-0b").replace(/^-0b/, "-0b") && "-" === "" ? "0b" + BigInt(Math.trunc(numOf(args[0]))) : (numOf(args[0]) < 0 ? "-0b" + (-BigInt(Math.trunc(numOf(args[0])))).toString(2) : "0b" + BigInt(Math.trunc(numOf(args[0]))).toString(2)); }, "bin(x) -> string");
  def("hex", function (args, kw, env) { var n = BigInt(Math.trunc(numOf(args[0]))); return (n < 0n ? "-0x" : "0x") + (n < 0n ? -n : n).toString(16); }, "hex(x)");
  def("oct", function (args, kw, env) { var n = BigInt(Math.trunc(numOf(args[0]))); return (n < 0n ? "-0o" : "0o") + (n < 0n ? -n : n).toString(8); }, "oct(x)");
  def("format", function (args, kw, env) {
    if (!args.length) return "";
    var spec = args[1] !== undefined ? toStr(args[1], env) : (kw.format_spec !== undefined ? toStr(kw.format_spec, env) : "");
    return formatValue(args[0], spec, env);
  }, "format(value, spec) -> string");
  def("getattr", function (args, kw, env) {
    var name = toStr(args[1], env);
    try { return attrGet(args[0], name, env); }
    catch (e) {
      if (args.length > 2 || kw.default !== undefined) return args[2] !== undefined ? args[2] : kw.default;
      throw e;
    }
  }, "getattr(object, name, default)");
  def("setattr", function (args, kw, env) { R.attrSet(args[0], toStr(args[1], env), args[2], env); return NONE; }, "setattr(object, name, value)");
  def("delattr", function (args, kw, env) { R.attrDel(args[0], toStr(args[1], env), env); return NONE; }, "delattr(object, name)");
  def("hasattr", function (args, kw, env) {
    try { attrGet(args[0], toStr(args[1], env), env); return true; } catch (e) { if (e && e.k2 === "exc") return false; throw e; }
  }, "hasattr(object, name) -> bool");
  def("callable", function (args, kw, env) {
    var v = args[0];
    return v instanceof PyFunc || v instanceof PyBuiltin || v instanceof PyBound || v instanceof PyClass || v instanceof TYPES.constructor || (v instanceof PyInstance && !!dunder(v, "__call__", env));
  }, "callable(object) -> bool");
  def("dir", function (args, kw, env) {
    var v = args[0];
    var names = [];
    if (v === undefined) {
      var sc = env.curScope, seen = {};
      var s = sc;
      while (s) { s.vars.forEach(function (_, k) { seen[k] = 1; s = null; }); }
      if (sc) sc.vars.forEach(function (_, k) { seen[k] = 1; });
      env.globals.vars.forEach(function (_, k) { seen[k] = 1; });
      Object.keys(seen).forEach(function (k) { names.push(k); });
      return names.sort();
    }
    if (v instanceof PyModule) v.dict.forEach(function (_, k) { names.push(k); });
    else if (v instanceof PyClass) { mroCollect(v, names); }
    else if (v instanceof PyInstance) { mroCollect(v.cls, names); v.dict.forEach(function (_, k) { if (names.indexOf(k) < 0) names.push(k); }); }
    else {
      var tab = B.methods[typeName(v)];
      if (tab) Object.keys(tab).forEach(function (k) { names.push(k); });
      if (v && v.k === "file") R.FILE_ATTRS.forEach(function (k) { names.push(k); });
      if (v && v.k === "view") ["__len__", "keys"].forEach(function (k) { names.push(k); });
      if (isStr(v)) ["__class__", "__doc__", "__len__", "__str__"].forEach(function (k) { names.push(k); });
    }
    var uniq = {}, out = [];
    names.forEach(function (n) { if (!uniq[n]) { uniq[n] = 1; out.push(n); } });
    return out.sort();
  }, "dir(object) -> list");
  function mroCollect(cls, names) {
    mroList(cls).forEach(function (c) { c.dict.forEach(function (_, k) { names.push(k); }); if (c.name) names.push("__name__"); });
  }
  function mroList(c) { var out = [], seen = new Set(); (function w(x) { if (!x || seen.has(x)) return; seen.add(x); out.push(x); (x.bases || []).forEach(w); })(c); return out; }
  def("vars", function (args, kw, env) {
    var v = args[0];
    var d = new PyDict();
    if (v instanceof PyInstance) v.dict.forEach(function (val, k) { dSet(d, k, val, env); });
    else if (v instanceof PyModule) v.dict.forEach(function (val, k) { dSet(d, k, val, env); });
    else if (v === undefined) { env.curScope.vars.forEach(function (val, k) { dSet(d, k, val, env); }); }
    return d;
  }, "vars(object) -> dict");
  def("help", function (args, kw, env) {
    var v = args[0];
    var doc = v && v.doc ? v.doc : (v && v.name ? v.name + "()" : "help available on the sandbox");
    writeOut(env, "Help on " + typeName(v) + " object " + (v.name || "") + ":\n\n    " + doc + "\n");
    return NONE;
  }, "help(object)");
  def("globals", function (args, kw, env) { var d = new PyDict(); env.globals.vars.forEach(function (v, k) { dSet(d, k, v, env); }); return d; }, "globals()");
  def("locals", function (args, kw, env) { var d = new PyDict(); (env.curScope || env.globals).vars.forEach(function (v, k) { dSet(d, k, v, env); }); return d; }, "locals()");

  /* 异常名字作为内置可被 getattr/raise 引用 */
  ["BaseException", "Exception", "TypeError", "ValueError", "ZeroDivisionError", "NameError",
    "UnboundLocalError", "IndexError", "KeyError", "AttributeError", "ImportError",
    "ModuleNotFoundError", "SyntaxError", "IndentationError", "OSError", "FileNotFoundError",
    "IsADirectoryError", "PermissionError", "FileExistsError", "NotADirectoryError", "RuntimeError",
    "RecursionError", "StopIteration", "OverflowError", "ArithmeticError", "AssertionError",
    "KeyboardInterrupt", "SystemExit", "LookupError", "EOFError", "MemoryError",
    "NotImplementedError", "UnicodeDecodeError"].forEach(function (n) {
    B.builtins.set(n, R.excClass(n));
  });

  /* % 格式化：把老式说明符翻译成 format spec，再交给同一套格式化微语言 */
  B.pctFormat = function (tmpl, vals, env, named) {
    var i = 0;
    return tmpl.replace(/%(?:\(([^)]+)\))?([-+ #0]*)(\d*)(?:\.(\d+))?([diouxXeEfFgGcrsa%])/g,
      function (all, key, flags, width, prec, type) {
        if (type === "%") return "%";
        flags = flags || ""; width = width || ""; prec = prec ? "." + prec : "";
        var v;
        if (key !== undefined) {
          if (!(vals instanceof PyDict)) throw errNew("TypeError", ["format requires a mapping"], env);
          var got = vals.map.get(hashKey(key, env));
          if (!got) throw errNew("KeyError", [key], env);
          v = got[1];
        } else {
          var list = Array.isArray(vals) ? vals : [vals];
          if (i >= list.length) throw errNew("TypeError", ["not enough arguments for format string"], env);
          v = list[i];
        }
        i++;
        if (type === "s") return R.formatValue(toStr(v, env), (flags.indexOf("-") >= 0 ? "<" : ">") + width + prec, env);
        if (type === "r") return R.formatValue(repr(v, env), (flags.indexOf("-") >= 0 ? "<" : ">") + width + prec, env);
        if (type === "c") return String.fromCharCode(numOf(v));
        var spec = (flags.indexOf("0") >= 0 ? "0" : "") + width + prec + type;
        if (flags.indexOf("-") >= 0) spec = "<" + spec;
        if (flags.indexOf("+") >= 0) spec = "+" + spec;
        if (flags.indexOf(" ") >= 0) spec = " " + spec;
        if (flags.indexOf("#") >= 0) spec = "#" + spec;
        return R.formatValue(v, spec, env);
      });
  };

  /* ================= 类型方法注册 ================= */
  function M(type, table) {
    B.methods[type] = B.methods[type] || {};
    Object.keys(table).forEach(function (name) {
      B.methods[type][name] = function (self) {
        var f = table[name];
        return new PyBuiltin(name, function (args, kw, env) { return f(self, args, kw, env); }, name + "()");
      };
    });
  }
  R.M = M;

  function splitKeepEmpty(s, sep, maxp, env, right) {
    if (sep === undefined || sep === NONE) {
      var t = s.replace(/^[\s\u3000]+|[\s\u3000]+$/g, "");
      return t === "" ? [] : t.split(/[\s\u3000]+/);
    }
    if (!isStr(sep)) throw errNew("TypeError", ["sep must be str, not " + typeName(sep)], env);
    if (sep === "") throw errNew("ValueError", ["empty separator"], env);
    if (maxp === undefined || maxp < 0) return s.split(sep);
    if (right) {
      var arr = s.split(sep);
      if (arr.length <= maxp + 1) return arr;
      var head = arr.slice(0, arr.length - maxp - 1).join(sep);
      return [head].concat(arr.slice(arr.length - maxp));
    }
    var out = [], rest = s, k = 0;
    while (k < maxp) {
      var at = rest.indexOf(sep);
      if (at < 0) break;
      out.push(rest.slice(0, at));
      rest = rest.slice(at + sep.length);
      k++;
    }
    out.push(rest);
    return out;
  }

  /* ---- str ---- */
  M("str", {
    upper: function (s) { return s.toUpperCase(); },
    lower: function (s) { return s.toLowerCase(); },
    capitalize: function (s) { return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(); },
    title: function (s) { return s.replace(/([^\W_])(\p{L}*)/gu, function (m, a, b) { return a.toUpperCase() + b.toLowerCase(); }); },
    swapcase: function (s) { return s.replace(/\S/g, function (c) { return c === c.toUpperCase() && c !== c.toLowerCase() ? c.toLowerCase() : c.toUpperCase(); }); },
    strip: function (s, args) { return trimSide(s, args[0] === undefined || args[0] === NONE ? null : toStr(args[0], arguments[2]), "both", arguments[2]); },
    lstrip: function (s, args) { return trimSide(s, args[0] === undefined || args[0] === NONE ? null : toStr(args[0], arguments[2]), "left", arguments[2]); },
    rstrip: function (s, args) { return trimSide(s, args[0] === undefined || args[0] === NONE ? null : toStr(args[0], arguments[2]), "right", arguments[2]); },
    split: function (s, args, kw, env) {
      var maxp = args[1] === undefined ? -1 : numOf(args[1]);
      return splitKeepEmpty(s, args[0], maxp < 0 ? undefined : maxp, env);
    },
    rsplit: function (s, args, kw, env) {
      var maxp = args[1] === undefined ? -1 : numOf(args[1]);
      if (maxp < 0) return splitKeepEmpty(s, args[0], undefined, env);
      return splitKeepEmpty(s, args[0], maxp, env, true);
    },
    splitlines: function (s, args, kw, env) {
      var keep = args[0] ? truthy(args[0], env) : false;
      if (s === "") return [];
      var out = [], cur = "";
      for (var i = 0; i < s.length; i++) {
        var c = s[i];
        cur += c;
        if (c === "\n" || c === "\r") {
          if (c === "\r" && s[i + 1] === "\n") continue;
          out.push(keep ? cur : cur.replace(/[\r\n]+$/, ""));
          if (c === "\r" && s[i + 1] === "\n") { out[out.length - 1] += "\r\n".slice(keep ? 0 : 2, keep ? 2 : 2); }
          cur = "";
        }
      }
      if (cur) out.push(keep ? cur : cur);
      return out;
    },
    join: function (s, args, kw, env) {
      var parts = listOf(args[0], env);
      return parts.map(function (p) {
        if (!isStr(p)) throw errNew("TypeError", ["sequence item " + parts.indexOf(p) + ": expected str instance, " + typeName(p) + " found"], env);
        return p;
      }).join(s);
    },
    replace: function (s, args, kw, env) {
      var a = toStr(args[0], env), b = toStr(args[1], env);
      var cnt = args[2] === undefined ? Infinity : numOf(args[2]);
      if (a === "") {
        if (cnt === 0) return s;
        var pieces = Array.from(s);
        var k = Math.min(cnt, pieces.length + 1);
        var outStr = "";
        for (var i = 0; i < pieces.length; i++) { if (i < k) outStr += b; outStr += pieces[i]; }
        if (k > pieces.length) outStr += b;
        return outStr;
      }
      if (!a) return s;
      return s.split(a).slice(0, cnt === Infinity ? undefined : cnt + 1).join(b) +
        (cnt === Infinity ? "" : s.split(a).slice(cnt + 1).join(a));
    },
    startswith: function (s, args, kw, env) {
      var pref = args[0] instanceof PyTuple ? args[0].items : [args[0]];
      var start = args[1] === undefined ? 0 : numOf(args[1]), end = args[2] === undefined ? s.length : numOf(args[2]);
      var sub = s.slice(start, end);
      return pref.some(function (p) { return sub.indexOf(toStr(p, env)) === 0; });
    },
    endswith: function (s, args, kw, env) {
      var suf = args[0] instanceof PyTuple ? args[0].items : [args[0]];
      var start = args[1] === undefined ? 0 : numOf(args[1]), end = args[2] === undefined ? s.length : numOf(args[2]);
      var sub = s.slice(start, end);
      return suf.some(function (p) { var t = toStr(p, env); return t.length <= sub.length && sub.slice(-t.length) === t; });
    },
    find: function (s, args, kw, env) { return indexOfStr(s, toStr(args[0], env), args[1] === undefined ? 0 : numOf(args[1]), -1); },
    rfind: function (s, args, kw, env) { return s.lastIndexOf(toStr(args[0], env)); },
    index: function (s, args, kw, env) {
      var i = indexOfStr(s, toStr(args[0], env), args[1] === undefined ? 0 : numOf(args[1]), -1);
      if (i < 0) throw errNew("ValueError", ["substring not found"], env);
      return i;
    },
    count: function (s, args, kw, env) {
      var sub = toStr(args[0], env);
      if (!sub) return Array.from(s).length + 1;
      var n = 0, at = 0;
      while ((at = s.indexOf(sub, at)) >= 0) { n++; at += sub.length; }
      return n;
    },
    isdigit: function (s) { return s.length > 0 && /^[0-9]+$/.test(s); },
    isnumeric: function (s) { return s.length > 0 && /^[0-9]+$/.test(s); },
    isdecimal: function (s) { return s.length > 0 && /^[0-9]+$/.test(s); },
    isalpha: function (s) { return s.length > 0 && /^[\p{L}]+$/u.test(s); },
    isalnum: function (s) { return s.length > 0 && /^[\p{L}\p{N}]+$/u.test(s); },
    isspace: function (s) { return s.length > 0 && /^\s+$/.test(s); },
    isupper: function (s) { return /[A-Z]/.test(s) && s === s.toUpperCase(); },
    islower: function (s) { return /[a-z]/.test(s) && s === s.toLowerCase(); },
    isprintable: function (s) { return s.length === 0 || !/[\x00-\x08\x0b-\x1f\x7f]/.test(s); },
    isidentifier: function (s) { return /^[^\p{N}][\p{L}\p{N}_]*$/u.test(s); },
    isascii: function (s) { return !/[^\x00-\x7F]/.test(s); },
    encode: function (s, args, kw, env) {
      var enc = args[0] ? toStr(args[0], env).toLowerCase() : "utf-8";
      if (enc.replace(/-/g, "") === "ascii") {
        for (var i = 0; i < s.length; i++) if (s.charCodeAt(i) > 127) throw errNew("UnicodeEncodeError", ["'ascii' codec can't encode character " + reprStr(s[i]) + " in position " + i + ": ordinal not in range(128)"], env);
        return new PyBytes(new TextEncoder().encode(s));
      }
      return new PyBytes(new TextEncoder().encode(s));
    },
    zfill: function (s, args, kw, env) {
      var w = numOf(args[0]);
      if (s.length >= w) return s;
      var sign = /^[+-]/.test(s) ? s[0] : "", body = sign ? s.slice(1) : s;
      return sign + "0".repeat(w - body.length - sign.length + (sign ? 0 : 0)) + body;
    },
    center: function (s, args, kw, env) { return formatValue(s, String(numOf(args[0])), env); },
    ljust: function (s, args, kw, env) { return formatValue(s, numOf(args[0]) + (args[1] ? toStr(args[1], env) : ""), env); },
    rjust: function (s, args, kw, env) { return formatValue(s, ">" + numOf(args[0]) + (args[1] ? toStr(args[1], env) : ""), env); },
    partition: function (s, args, kw, env) {
      var sep = toStr(args[0], env), at = s.indexOf(sep);
      if (at < 0) return tup([s, "", ""]);
      return tup([s.slice(0, at), sep, s.slice(at + sep.length)]);
    },
    removeprefix: function (s, args, kw, env) { var p = toStr(args[0], env); return s.indexOf(p) === 0 ? s.slice(p.length) : s; },
    removesuffix: function (s, args, kw, env) { var t = toStr(args[0], env); return t && s.slice(-t.length) === t ? s.slice(0, -t.length) : s; },
    format: function (s, args, kw, env) { return B.str_format(s, args, kw, env); },
    expandtabs: function (s) { return s.replace(/(^|[^\t\n]*)\t/gm, function (m, p) { return p + " ".repeat(8 - (Array.from(p).length % 8)); }); },
    casefold: function (s) { return s.toLowerCase(); }
  });
  function indexOfStr(s, sub, from, dft) {
    var i = s.indexOf(sub, Math.max(0, from));
    return i;
  }
  function trimSide(s, chars, side, env) {
    if (chars === null || chars === undefined) return side === "left" ? s.replace(/^[\s\u3000]+/, "") : side === "right" ? s.replace(/[\s\u3000]+$/, "") : s.replace(/^[\s\u3000]+|[\s\u3000]+$/g, "");
    var esc = chars.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&");
    var re = side === "left" ? new RegExp("^[" + esc + "]+") : side === "right" ? new RegExp("[" + esc + "]+$") : new RegExp("^[" + esc + "]+|[" + esc + "]+$", "g");
    return s.replace(re, "");
  }

  B.str_format = function (s, args, kw, env) {
    var auto = 0;
    return s.replace(/\{([^{}]*)\}/g, function (all, inner) {
      var m = /^([^:]*)(?::(.*))?$/.exec(inner);
      var field = m[1], spec = m[2] || "";
      var v;
      if (field === "" || /^\d+$/.test(field)) {
        var idx = field === "" ? auto++ : Number(field);
        if (args[idx] === undefined) throw errNew("IndexError", ["Replacement index " + idx + " out of range for positional args tuple"], env);
        v = args[idx];
      } else if (/^[\w\u4e00-\u9fa5]+$/.test(field)) {
        if (kw[field] === undefined) throw errNew("KeyError", ["'" + field + "'"], env);
        v = kw[field];
      } else if (/\./.test(field)) {
        var parts = field.split("."), base = parts.shift();
        v = /^\d+$/.test(base) ? args[Number(base)] : kw[base];
        parts.forEach(function (p) { v = attrGet(v, p, env); });
      } else throw errNew("ValueError", ["Invalid format specifier"], env);
      return formatValue(v, spec, env);
    });
  };

  /* ---- list ---- */
  M("list", {
    append: function (a, args, kw, env) { if (args.length !== 1) throw errNew("TypeError", ["append() takes exactly one argument (" + args.length + " given)"], env); a.push(args[0]); return NONE; },
    extend: function (a, args, kw, env) { listOf(args[0], env).forEach(function (v) { a.push(v); }); return NONE; },
    insert: function (a, args, kw, env) {
      var i = numOf(args[0]);
      if (i < 0) i = Math.max(0, a.length + i);
      a.splice(Math.min(i, a.length), 0, args[1]);
      return NONE;
    },
    pop: function (a, args, kw, env) {
      if (!a.length) throw errNew("IndexError", ["pop from empty list"], env);
      var i = args.length ? numOf(args[0]) : -1;
      if (i < 0) i = a.length + i;
      if (i < 0 || i >= a.length) throw errNew("IndexError", ["pop index out of range"], env);
      return a.splice(i, 1)[0];
    },
    remove: function (a, args, kw, env) {
      var at = -1;
      for (var i = 0; i < a.length; i++) if (pyEq(a[i], args[0], env)) { at = i; break; }
      if (at < 0) throw errNew("ValueError", ["list.remove(x): x not in list"], env);
      a.splice(at, 1);
      return NONE;
    },
    clear: function (a) { a.length = 0; return NONE; },
    copy: function (a) { return a.slice(); },
    index: function (a, args, kw, env) {
      for (var i = 0; i < a.length; i++) if (pyEq(a[i], args[0], env)) return i;
      throw errNew("ValueError", [repr(args[0], env) + " is not in list"], env);
    },
    count: function (a, args, kw, env) { return a.filter(function (x) { return pyEq(x, args[0], env); }).length; },
    sort: function (a, args, kw, env) {
      var s2 = sortInPlace(a, kw, env);
      a.length = 0;
      s2.forEach(function (v) { a.push(v); });
      return NONE;
    },
    reverse: function (a) { a.reverse(); return NONE; }
  });

  /* ---- tuple ---- */
  M("tuple", {
    count: function (t, args, kw, env) { return t.items.filter(function (x) { return pyEq(x, args[0], env); }).length; },
    index: function (t, args, kw, env) {
      var i = t.items.findIndex(function (x) { return pyEq(x, args[0], env); });
      if (i < 0) throw errNew("ValueError", ["tuple.index(x): x not in tuple"], env);
      return i;
    }
  });

  /* ---- dict ---- */
  function dictItems(d) { var out = []; d.map.forEach(function (kv) { out.push(kv); }); return out; }
  M("dict", {
    keys: function (d, args, kw, env) { return new R.PyView("keys", dictItems(d).map(function (kv) { return kv[0]; })); },
    values: function (d, args, kw, env) { return new R.PyView("values", dictItems(d).map(function (kv) { return kv[1]; })); },
    items: function (d, args, kw, env) { return new R.PyView("items", dictItems(d).map(function (kv) { return tup([kv[0], kv[1]]); })); },
    get: function (d, args, kw, env) {
      var got = d.map.get(hashKey(args[0], env));
      return got ? got[1] : (args[1] !== undefined ? args[1] : NONE);
    },
    setdefault: function (d, args, kw, env) {
      var k = hashKey(args[0], env);
      if (d.map.has(k)) return d.map.get(k)[1];
      var v = args[1] !== undefined ? args[1] : NONE;
      dSet(d, args[0], v, env);
      return v;
    },
    update: function (d, args, kw, env) {
      args.forEach(function (src) {
        if (src instanceof PyDict) src.map.forEach(function (kv) { dSet(d, kv[0], kv[1], env); });
        else listOf(src, env).forEach(function (pair) { var a2 = listOf(pair, env); dSet(d, a2[0], a2[1], env); });
      });
      Object.keys(kw).forEach(function (k) { dSet(d, k, kw[k], env); });
      return NONE;
    },
    pop: function (d, args, kw, env) {
      var k = hashKey(args[0], env);
      if (!d.map.has(k)) {
        if (args[1] !== undefined) return args[1];
        throw errNew("KeyError", [args[0]], env);
      }
      var v = d.map.get(k)[1];
      d.map.delete(k);
      return v;
    },
    popitem: function (d, args, kw, env) {
      var arr = dictItems(d);
      if (!arr.length) throw errNew("KeyError", ["dictionary is empty"], env);
      var last = arr[arr.length - 1];
      d.map.delete(hashKey(last[0], env));
      return tup([last[0], last[1]]);
    },
    clear: function (d) { d.map.clear(); return NONE; },
    copy: function (d, args, kw, env) { var n2 = new PyDict(); d.map.forEach(function (kv) { n2.map.set(hashKey(kv[0], env), kv); }); return n2; },
    fromkeys: function (d, args, kw, env) {
      var out = new PyDict();
      listOf(args[0], env).forEach(function (k) { dSet(out, k, args[1] !== undefined ? args[1] : NONE, env); });
      return out;
    }
  });
  /* 视图类型由运行时统一处理（dict_keys / dict_values / dict_items） */

  /* ---- set ---- */
  function setArr(s) { var out = []; s.map.forEach(function (v) { out.push(v); }); return out; }
  M("set", {
    add: function (s, args, kw, env) { s.map.set(hashKey(args[0], env), args[0]); return NONE; },
    discard: function (s, args, kw, env) { s.map.delete(hashKey(args[0], env)); return NONE; },
    remove: function (s, args, kw, env) {
      var k = hashKey(args[0], env);
      if (!s.map.has(k)) throw errNew("KeyError", repr(args[0], env), env);
      s.map.delete(k);
      return NONE;
    },
    pop: function (s, args, kw, env) {
      var arr = setArr(s);
      if (!arr.length) throw errNew("KeyError", ["pop from an empty set"], env);
      s.map.delete(hashKey(arr[0], env));
      return arr[0];
    },
    clear: function (s) { s.map.clear(); return NONE; },
    copy: function (s, args, kw, env) { var n2 = new PySet(false); s.map.forEach(function (v, k) { n2.map.set(k, v); }); return n2; },
    union: function (s, args, kw, env) { return binopSet("|", s, args, env); },
    intersection: function (s, args, kw, env) { return binopSet("&", s, args, env); },
    difference: function (s, args, kw, env) { return binopSet("-", s, args, env); },
    symmetric_difference: function (s, args, kw, env) { return binopSet("^", s, args, env); },
    update: function (s, args, kw, env) { args.forEach(function (a2) { listOf(a2, env).forEach(function (v) { s.map.set(hashKey(v, env), v); }); }); return NONE; },
    issubset: function (s, args, kw, env) { var o = args[0]; return setArr(s).every(function (v) { return contains(o, v, env); }); },
    issuperset: function (s, args, kw, env) { var o = listOf(args[0], env); return o.every(function (v) { return contains(s, v, env); }); },
    isdisjoint: function (s, args, kw, env) { return !listOf(args[0], env).some(function (v) { return contains(s, v, env); }); }
  });
  /* 不可变集合与集合共用同一套查询方法（add/update 之类对它没有意义，但正文里只用得到交并差） */
  B.methods.frozenset = B.methods.set;
  function binopSet(op, s, args, env) {
    var rhs = args.map(function (a2) { return a2 instanceof PySet ? a2 : new R.PySet(false); });
    var out = new PySet(false);
    s.map.forEach(function (v, k) { out.map.set(k, v); });
    rhs.forEach(function (o) {
      if (op === "|") o.map.forEach(function (v, k) { out.map.set(k, v); });
      if (op === "&") out.map.forEach(function (v, k) { if (!o.map.has(k)) out.map.delete(k); });
      if (op === "-") o.map.forEach(function (v, k) { out.map.delete(k); });
      if (op === "^") o.map.forEach(function (v, k) { if (out.map.has(k)) out.map.delete(k); else out.map.set(k, v); });
    });
    return out;
  }

  /* ---- bytes ---- */
  M("bytes", {
    decode: function (b, args, kw, env) {
      var enc = args[0] ? toStr(args[0], env).toLowerCase().replace(/-/g, "") : "utf8";
      if (enc !== "utf8" && enc !== "ascii" && enc !== "gbk" && enc !== "latin1") throw errNew("LookupError", ["unknown encoding: " + toStr(args[0], env)], env);
      if (enc === "gbk") {
        try { return new TextDecoder("gbk").decode(b.b); }
        catch (e) { throw errNew("UnicodeDecodeError", ["'gbk' codec can't decode byte"], env); }
      }
      var strict = kw.errors ? toStr(kw.errors, env) : "strict";
      try { return new TextDecoder("utf-8", { fatal: strict === "strict" }).decode(b.b); }
      catch (e) {
        if (strict === "ignore") return new TextDecoder("utf-8").decode(b.b);
        throw errNew("UnicodeDecodeError", ["'utf-8' codec can't decode byte 0x" + (b.b[0] || 0).toString(16) + " in position 0: invalid continuation byte"], env);
      }
    },
    hex: function (b) { return Array.from(b.b).map(function (x) { return ("0" + x.toString(16)).slice(-2); }).join(""); },
    join: function (b, args, kw, env) {
      var parts = listOf(args[0], env), out = [];
      parts.forEach(function (p, i) { if (i) out = out.concat(Array.from(b.b)); out = out.concat(Array.from(p instanceof PyBytes ? p.b : new TextEncoder().encode(toStr(p, env)))); });
      return new PyBytes(new Uint8Array(out));
    },
    strip: function (b, args, kw, env) {
      var arr = Array.from(b.b), s = 0, e = arr.length;
      while (s < e && arr[s] === 10 || s < e && arr[s] === 32) s++;
      while (e > s && (arr[e - 1] === 10 || arr[e - 1] === 32)) e--;
      return new PyBytes(new Uint8Array(arr.slice(s, e)));
    },
    startswith: function (b, args, kw, env) { var t = args[0] instanceof PyBytes ? Array.from(args[0].b) : Array.from(toStr(args[0], env)).map(function (c) { return c.charCodeAt(0); }); return t.every(function (x, i) { return b.b[i] === x; }); }
  });

  /* compile() 只走「切词 + 语法」两段，不执行 —— 第 12、15 课用它演示两种红字的差别 */
  def("compile", function (args, kw, env) {
    if (!args.length) throw errNew("TypeError", ["compile() takes at least 1 argument (0 given)"], env);
    var src = toStr(args[0], env);
    var fname = args[1] !== undefined ? toStr(args[1], env) : "<string>";
    var mode = args[2] !== undefined ? toStr(args[2], env) : "exec";
    try { ENG.parse(src, fname); }
    catch (e) {
      if (e.isPyError) {
        var inst = errNew("SyntaxError", [e.pymsg], env);
        inst.dict.set("msg", e.pymsg);
        inst.dict.set("lineno", e.pyline || 0);
        inst.dict.set("offset", NONE);
        inst.dict.set("text", NONE);
        inst.dict.set("name", fname);
        inst.dict.set("file", fname);
        throw inst;
      }
      throw e;
    }
    return { k: "code", file: fname, mode: mode, src: src };
  }, "Compile source into a code object; the sandbox never executes it.");

  /* ---- float / int 的方法 ---- */
  M("float", {
    is_integer: function (v) { return Number.isInteger(v.v); },
    hex: function (v) { return Number(v.v).toString(16); },
    __round__: function (v, args, kw, env) { return B.builtins.get("round")([v].concat(args || []), kw, env); }
  });
  M("int", {
    bit_length: function (v) { var n = typeof v === "bigint" ? (v < 0n ? -v : v) : BigInt(Math.abs(Math.trunc(numOf(v)))); return n.toString(2).length; }
  });

  /* ---- object 通用 ---- */
  /* ---- 文件对象：属性与方法都由 pyAttr 一处给出 ---- */
  PyFile.prototype.pyAttr = function (name, env) {
    var f = this;
    if (name === "__class__") return new R.PyType(f.clsName, f.clsName);
    if (name === "name") return f.name;
    if (name === "mode") return f.mode;
    if (name === "encoding") return f.binary ? NONE : R.normEnc(f.encoding || "utf-8");
    if (name === "closed") return !!f.closed;
    if (name === "read") return bin(name, function (args) { return f.read(args.length && args[0] !== NONE ? numOf(args[0]) : undefined); }, "read(size=-1)");
    if (name === "readline") return bin(name, function () { return f.readline(); }, "readline()");
    if (name === "readlines") return bin(name, function () {
      var out = [], p = f.pos;
      f.pos = 0;
      while (true) { var l = f.readline(); if (!l) break; out.push(l); }
      f.pos = p;
      return out;
    }, "readlines()");
    if (name === "writelines") return bin(name, function (args) { listOf(args[0], env).forEach(function (x) { f.write(isStr(x) ? x : toStr(x, env)); }); return NONE; }, "writelines(lines)");
    if (name === "write") return bin(name, function (args) {
      var a = args[0];
      return f.write(isStr(a) ? a : (a instanceof PyBytes ? a.b : toStr(a, env)));
    }, "write(s)");
    if (name === "seek") return bin(name, function (args) { f.pos = numOf(args[0] || 0); return NONE; }, "seek(offset)");
    if (name === "tell") return bin(name, function () { return f.pos; }, "tell()");
    if (name === "flush") return bin(name, function () { return NONE; }, "flush()");
    if (name === "close") return bin(name, function () { f.close(); return NONE; }, "close()");
    if (name === "__enter__") return bin(name, function () {
      if (f.closed) throw errNew("ValueError", ["I/O operation on closed file."], env);
      return f;
    }, "__enter__()");
    if (name === "__exit__") return bin(name, function () { f.close(); return false; }, "__exit__()");
    throw errNew("AttributeError", ["'_io." + f.clsName + "' object has no attribute '" + name + "'"], env);
  };
  PyFile.prototype.close = function () { if (this.dirty) { this.flushNow(); this.dirty = false; } this.closed = true; };
  R.FILE_ATTRS = ["name", "mode", "encoding", "closed", "read", "readline", "readlines", "write", "writelines", "seek", "tell", "flush", "close"];

  /* super()：零参形式靠「当前正在执行的函数」拿到所属类与 self（第 40 课只用这一种） */
  def("super", function (args, kw, env) {
    if (args.length >= 2) return new R.PySuper(args[0], args[1]);
    var f = env.curFunc;
    if (!f || !f.ownerCls) throw errNew("RuntimeError", ["super(): __class__ cell not found"], env);
    var first = (f.node.params && f.node.params.args && f.node.params.args[0]) || "self";
    var self = (env.curScope && env.curScope.vars.has(first)) ? env.curScope.vars.get(first) : NONE;
    return new R.PySuper(f.ownerCls, self);
  }, "super() -> proxy object");

  /* 类型名既是类型也是构造函数：`type(x) is int`、`isinstance(x, (int, float))` 要成立，
     名字 int/str/list… 就必须绑定到那个 type 对象本身，而不是一个普通函数。 */
  ["int", "float", "bool", "str", "bytes", "list", "tuple", "dict", "set", "frozenset"].forEach(function (n) {
    var ctor = B.builtins.get(n);
    if (!ctor || !TYPES[n]) return;
    TYPES[n].ctor = ctor;
    B.builtins.set(n, TYPES[n]);
  });

  R.apiReady = true;
  root.MIAO_PYRUN = R;
  if (typeof module === "object" && module.exports) module.exports = R;
})(typeof globalThis !== "undefined" ? globalThis : this);
