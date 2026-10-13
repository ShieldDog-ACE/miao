/* 喵站 · Python 沙箱 · 标准库与运行入口
 *
 * 载入顺序：py-engine.js → py-runtime.js → py-builtin.js → py-stdlib.js
 * 只实现正文里真出现过的模块：sys io json os os.path pathlib random math keyword string shutil decimal time。
 * 文件一律走虚拟文件系统（VFS），沙箱碰不到真实磁盘；随机数默认固定种子，考试重跑结果才稳定。
 */
(function (root) {
  "use strict";
  var R = root.MIAO_PYRUN || (typeof require === "function" ? require("./py-builtin.js") : null);
  var I = R.INTERNAL, B = R.B, ENG = R.ENG;
  var NONE = R.NONE, NOTSET = R.NOTSET, TYPES = R.TYPES;
  var PyTuple = R.PyTuple, PyDict = R.PyDict, PySet = R.PySet, PyBytes = R.PyBytes;
  var PyFloat = R.PyFloat, PyFunc = R.PyFunc, PyBuiltin = R.PyBuiltin, PyClass = R.PyClass, PyInstance = R.PyInstance;
  var PyModule = R.PyModule, PyRange = R.PyRange;
  var numOf = R.numOf, isStr = R.isStr, isNum = R.isNum, truthy = R.truthy, pyEq = R.pyEq;
  var errNew = R.errNew, call = R.call, hashKey = R.hashKey;
  var repr = function (v, e) { return R.repr(v, e); }, toStr = function (v, e) { return R.toStr(v, e); };
  var reprStr = R.reprStr;
  var listOf = R.listOf, dSet = I.dSet, typeName = function (v) { return R.typeName(v); };
  var length = function (v, e) { return R.length(v, e); };
  var PyFile = R.PyFile, VFS = R.VFS;

  function bin(name, fn, doc) { return new PyBuiltin(name, fn, doc); }
  function mod(name, entries) {
    var d = new Map();
    Object.keys(entries).forEach(function (k) {
      var v = entries[k];
      d.set(k, v && v.__pyb ? v.f : v);
    });
    return new PyModule(name, d);
  }

  /* ================= 标准库 ================= */
  var MODS = {};

  /* ---- sys ---- */
  MODS.sys = function (env) {
    var m = mod("sys", {
      argv: ["main.py"].concat(env.argv || []),
      version: "3.14.0 (Miao sandbox)",
      platform: "linux",
      maxsize: 9223372036854775807,
      prefix: "/usr",
      executable: "/usr/bin/python3",
      dont_write_bytecode: false,
      path: [env.file || "main.py", "/usr/lib/python3.14", "/usr/lib/python3.14/lib-dynload"],
      builtin_module_names: ["sys", "builtins", "_io", "marshal", "posix", "time", "math", "_json"],
      modules: new PyDict(),
      byteorder: "little",
      api_version: 1013
    });
    m.dict.set("stdout", makeStdout(env));
    m.dict.set("stderr", makeStderr(env));
    m.dict.set("stdin", makeStdin(env));
    m.dict.set("getsizeof", bin("getsizeof", function (args, kw, e) {
      var v = args[0];
      if (isStr(v)) return 49 + Array.from(v).length;
      if (typeof v === "bigint" || (typeof v === "number" && Number.isInteger(v))) return 28;
      if (v instanceof PyFloat) return 24;
      if (Array.isArray(v)) return 56 + v.length * 8;
      if (v instanceof PyDict) return 184 + v.map.size * 104;
      if (v instanceof PyTuple) return 40 + v.items.length * 8;
      return 56;
    }, "Return the size of an object in bytes."));
    m.dict.set("exit", bin("exit", function (args, kw, e) {
      var code = args.length ? numOf(args[0]) : 0;
      var sx = errNew("SystemExit", [code], e);
      sx.isSystemExit = code;
      throw sx;
    }, "Exit the sandbox."));
    return m;
  };
  function makeStdout(env) { return new StreamFile(env, "<stdout>", "w", "utf-8", "out"); }
  function makeStderr(env) { return new StreamFile(env, "<stderr>", "w", "utf-8", "err"); }
  function makeStdin(env) {
    var s = new StreamFile(env, "<stdin>", "r", "utf-8", "in");
    s.isStdin = true;
    return s;
  }
  /* StreamFile：终端流与 io.StringIO 共用的底子（k='file'，所以运行时按文件对象处理） */
  function StreamFile(env, name, mode, enc, which, stringIO) {
    this.k = "file";
    this.name = name;
    this.mode = mode;
    this.encoding = enc;
    this.binary = false;
    this.stringIO = !!stringIO;
    this.clsName = this.stringIO ? "StringIO" : "TextIOWrapper";
    this.closed = false;
    this.buf = which === "err" ? env.errBuf : which === "in" ? env.stdinBuf : env.outBuf;
    this.which = which;
    this.pos = 0;
    this.env = env;
    this.fs = env.fs;
  }
  StreamFile.prototype.write = function (s) {
    if (this.closed) throw errNew("ValueError", ["I/O operation on closed file."], this.env);
    if (this.which === "in") throw errNew("io.UnsupportedOperation", ["not writable"], this.env);
    this.buf.push(String(s));
    if (this.env.trace && this.env.trace.outputs) this.env.trace.outputs.push(String(s));
    return String(s).length;
  };
  StreamFile.prototype.read = function (n) {
    var all = this.buf.join("");
    if (n === undefined) { var s = all.slice(this.pos); this.pos = all.length; return s; }
    var p = all.slice(this.pos, this.pos + numOf(n)); this.pos += p.length; return p;
  };
  StreamFile.prototype.readline = function () {
    if (this.which === "in") {
      if (!this.env.stdinQueue.length) return "";
      var l = this.env.stdinQueue.shift();
      this.lastInput = l;
      if (this.env.trace) this.env.trace.inputs.push(l);
      return l + "\n";
    }
    var all = this.buf.join(""), at = all.indexOf("\n", this.pos);
    if (at < 0) { var rest = all.slice(this.pos); this.pos = all.length; return rest; }
    var line = all.slice(this.pos, at + 1); this.pos = at + 1; return line;
  };
  StreamFile.prototype.getvalue = function () { return this.buf.join(""); };
  StreamFile.prototype.seek = function (p) { this.pos = numOf(p || 0); };
  StreamFile.prototype.tell = function () { return this.pos; };
  StreamFile.prototype.close = function () { this.closed = true; };
  StreamFile.prototype.pyAttr = function (name, env) {
    var s = this;
    if (name === "__class__") return new R.PyType(s.clsName, s.clsName);
    if (name === "name") return s.name;
    if (name === "mode") return s.mode;
    if (name === "encoding") return s.encoding;
    if (name === "closed") return !!s.closed;
    if (name === "write") return bin("write", function (a) { return s.write(isStr(a[0]) ? a[0] : toStr(a[0], env)); });
    if (name === "read") return bin("read", function (a) { return s.read(a.length ? a[0] : undefined); });
    if (name === "readline") return bin("readline", function () { return s.readline(); });
    if (name === "readlines") return bin("readlines", function () {
      var out = [], p = s.pos; s.pos = 0;
      while (true) { var l = s.readline(); if (!l) break; out.push(l); }
      s.pos = p; return out;
    });
    if (name === "getvalue") return bin("getvalue", function () { return s.getvalue(); });
    if (name === "seek") return bin("seek", function (a) { s.seek(a[0]); return NONE; });
    if (name === "tell") return bin("tell", function () { return s.tell(); });
    if (name === "flush") return bin("flush", function () { return NONE; });
    if (name === "close") return bin("close", function () { s.close(); return NONE; });
    if (name === "__enter__") return bin("__enter__", function () { return s; });
    if (name === "__exit__") return bin("__exit__", function () { s.close(); return false; });
    if (name === "writable") return bin("writable", function () { return s.which !== "in"; });
    if (name === "readable") return bin("readable", function () { return s.which === "in"; });
    throw errNew("AttributeError", ["'" + typeName(s) + "' object has no attribute '" + name + "'"], env);
  };
  R.StreamFile = StreamFile;

  /* ---- io ---- */
  MODS.io = function (env) {
    var m = mod("io", { "__name__": "io" });
    m.dict.set("StringIO", bin("StringIO", function (args, kw, e) {
      var s = new StreamFile(e, "", "r+", "utf-8", "out", true);
      s.inbuf = args.length && args[0] !== NONE ? toStr(args[0], e) : "";
      s.buf = [];
      /* StringIO 自带一份缓冲，不占用标准输出 */
      s.read = function (n) {
        var all = s.inbuf + s.buf.join("");
        if (n === undefined) { var v = all.slice(s.pos); s.pos = all.length; return v; }
        var p = all.slice(s.pos, s.pos + numOf(n)); s.pos += p.length; return p;
      };
      s.readline = function () {
        var all = s.inbuf + s.buf.join(""), at = all.indexOf("\n", s.pos);
        if (at < 0) { var rest = all.slice(s.pos); s.pos = all.length; return rest === "" ? "" : rest; }
        var line = all.slice(s.pos, at + 1); s.pos = at + 1; return line;
      };
      s.getvalue = function () { return s.inbuf + s.buf.join(""); };
      s.write = function (x) {
        if (s.closed) throw errNew("ValueError", ["I/O operation on closed file."], e);
        s.buf.push(String(x));
        return String(x).length;
      };
      return s;
    }, "StringIO(initial_value='') -> file-like object"));
    m.dict.set("BytesIO", bin("BytesIO", function (args, kw, e) {
      var s = new StreamFile(e, "", "r+", "utf-8", "out", true);
      s.binary = true;
      s.clsName = "BytesIO";
      return s;
    }, "BytesIO()"));
    return m;
  };

  /* ---- json ---- */
  function jsonDump(v, env, opt, indent, lvl) {
    var pad2 = opt.indent ? " ".repeat(opt.indent * (lvl + 1)) : "";
    var closePad = opt.indent ? " ".repeat(opt.indent * lvl) : "";
    /* CPython 默认分隔符：不缩进时 ", " 与 ": "，缩进时换行 + ": " */
    var itemSep = opt.indent ? ",\n" : ", ";
    var sep = ": ";
    if (v === NONE) return "null";
    if (v === true) return "true";
    if (v === false) return "false";
    if (isStr(v)) return jsonStr(v, opt.ensureAscii);
    if (isNum(v)) {
      if (typeof v === "bigint") return v.toString();
      if (v instanceof PyFloat) {
        var f = v.v;
        if (!isFinite(f)) throw errNew("ValueError", [f > 0 ? "Out of range float values are not JSON compliant: inf" : "Out of range float values are not JSON compliant: nan"], env);
        return R.reprFloat(f);
      }
      return String(v);
    }
    if (Array.isArray(v) || v instanceof PyTuple) {
      var arr = Array.isArray(v) ? v : v.items;
      if (!arr.length) return "[]";
      var items = arr.map(function (x) { return jsonDump(x, env, opt, indent, lvl + 1); });
      if (opt.indent) return "[\n" + items.map(function (x) { return pad2 + x; }).join(",\n") + "\n" + closePad + "]";
      return "[" + items.join(", ") + "]";
    }
    if (v instanceof PyDict) {
      var ks = [];
      v.map.forEach(function (kv) { ks.push(kv); });
      if (opt.sortKeys) ks.sort(function (a, b) { return toStr(a[0], env) < toStr(b[0], env) ? -1 : 1; });
      if (!ks.length) return "{}";
      var parts = ks.map(function (kv) {
        var k = kv[0];
        if (!isStr(k) && !isNum(k) && k !== NONE && k !== true && k !== false) {
          if (opt.skipkeys !== false) throw errNew("TypeError", ["keys must be str, int, float, bool or None, not " + typeName(k)], env);
          return null;
        }
        var keyStr = isStr(k) ? jsonStr(k, opt.ensureAscii) : k === NONE ? "null" : k === true ? "true" : k === false ? "false" : jsonDump(k, env, opt, 0, 0);
        return (opt.indent ? pad2 : "") + keyStr + sep + jsonDump(kv[1], env, opt, indent, lvl + 1);
      }).filter(function (x) { return x !== null; });
      if (opt.indent) return "{\n" + parts.join(",\n") + "\n" + closePad + "}";
      return "{" + parts.join(", ") + "}";
    }
    throw errNew("TypeError", ["Object of type '" + typeName(v) + "' is not JSON serializable"], env);
  }
  var JSON_ESC = { '"': '\\"', "\\": "\\\\", "\n": "\\n", "\r": "\\r", "\t": "\\t", "\b": "\\b", "\f": "\\f" };
  function jsonStr(s, ensureAscii) {
    var out = '"';
    for (var i = 0; i < s.length; i++) {
      var c = s[i], code = s.charCodeAt(i);
      if (JSON_ESC[c]) { out += JSON_ESC[c]; continue; }
      if (code < 0x20) { out += "\\u" + ("0000" + code.toString(16)).slice(-4); continue; }
      if (code > 0x7E) {
        if (ensureAscii === false) { out += c; continue; }
        if (code >= 0xD800 && code <= 0xDBFF && i + 1 < s.length) {
          var lo = s.charCodeAt(i + 1);
          out += "\\u" + ("0000" + code.toString(16)).slice(-4) + "\\u" + ("0000" + lo.toString(16)).slice(-4);
          i++;
          continue;
        }
        out += "\\u" + ("0000" + code.toString(16)).slice(-4);
        continue;
      }
      out += c;
    }
    return out + '"';
  }
  function jsonLoads(s, env) {
    var i = 0;
    function ws() { while (i < s.length && /[ \t\n\r]/.test(s[i])) i++; }
    function val() {
      ws();
      var c = s[i];
      if (c === undefined) throw jsonErr("Expecting value", i, s);
      if (c === "{") return obj();
      if (c === "[") return arr();
      if (c === '"') return string();
      if (s.startsWith("true", i)) { i += 4; return true; }
      if (s.startsWith("false", i)) { i += 5; return false; }
      if (s.startsWith("null", i)) { i += 4; return NONE; }
      var m = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][-+]?\d+)?/.exec(s.slice(i));
      if (!m) throw jsonErr("Expecting value", i, s);
      i += m[0].length;
      return /[.eE]/.test(m[0]) ? new PyFloat(parseFloat(m[0])) : Number(m[0]);
    }
    function obj() {
      i++; var d = new PyDict(); ws();
      if (s[i] === "}") { i++; return d; }
      while (true) {
        ws();
        if (s[i] !== '"') throw jsonErr("Expecting property name enclosed in double quotes", i, s);
        var k = string();
        ws();
        if (s[i] !== ":") throw jsonErr("Expecting ':' delimiter", i, s);
        i++;
        var v = val();
        dSet(d, k, v, env);
        ws();
        if (s[i] === "}") { i++; return d; }
        if (s[i] !== ",") throw jsonErr("Expecting ',' delimiter", i, s);
        i++;
      }
    }
    function arr() {
      i++; var out = []; ws();
      if (s[i] === "]") { i++; return out; }
      while (true) {
        out.push(val()); ws();
        if (s[i] === "]") { i++; return out; }
        if (s[i] !== ",") throw jsonErr("Expecting ',' delimiter", i, s);
        i++;
      }
    }
    function string() {
      var quote = s[i]; i++;
      var out = "";
      while (i < s.length) {
        var c = s[i];
        if (c === quote) { i++; return out; }
        if (c === "\\") {
          var n = s[i + 1];
          if (n === "u") { out += String.fromCharCode(parseInt(s.substr(i + 2, 4), 16)); i += 6; continue; }
          var map = { n: "\n", t: "\t", r: "\r", b: "\b", f: "\f", '"': '"', "\\": "\\", "/": "/" };
          if (map[n] !== undefined) { out += map[n]; i += 2; continue; }
          throw jsonErr("Invalid \\escape", i, s);
        }
        out += c; i++;
      }
      throw jsonErr("Unterminated string starting at", i, s);
    }
    var r = val();
    ws();
    if (i < s.length) throw jsonErr("Extra data", i, s);
    return r;
  }
  function jsonErr(msg, pos, s) {
    var line = s.slice(0, pos).split("\n").length;
    var col = pos - s.slice(0, pos).lastIndexOf("\n");
    var e = errNew("JSONDecodeError", [msg + ": line " + line + " column " + col + " (char " + pos + ")"], null);
    return e;
  }
  MODS.json = function (env) {
    var m = mod("json", {});
    m.dict.set("dumps", bin("dumps", function (args, kw, e) {
      var opt = {
        ensureAscii: kw.ensure_ascii === undefined ? true : truthy(kw.ensure_ascii, e),
        indent: kw.indent === undefined ? (args[1] === undefined ? null : numOf(args[1])) : (kw.indent === NONE ? null : numOf(kw.indent)),
        sortKeys: kw.sort_keys ? truthy(kw.sort_keys, e) : false,
        skipkeys: kw.skipkeys ? truthy(kw.skipkeys, e) : false
      };
      if (kw.separators) opt.sepOverride = true;
      return jsonDump(args[0], e, opt, opt.indent, 0);
    }, "dumps(obj) -> str"));
    m.dict.set("loads", bin("loads", function (args, kw, e) {
      var s = isStr(args[0]) ? args[0] : (args[0] instanceof PyBytes ? new TextDecoder().decode(args[0].b) : toStr(args[0], e));
      return jsonLoads(s, e);
    }, "loads(s) -> object"));
    m.dict.set("dump", bin("dump", function (args, kw, e) {
      var text = jsonDump(args[0], e, { ensureAscii: kw.ensure_ascii === undefined ? true : truthy(kw.ensure_ascii, e), indent: kw.indent === undefined ? null : numOf(kw.indent), sortKeys: kw.sort_keys ? truthy(kw.sort_keys, e) : false }, kw.indent === undefined ? null : numOf(kw.indent), 0);
      args[1].write(text);
      return NONE;
    }, "dump(obj, fp)"));
    m.dict.set("load", bin("load", function (args, kw, e) { return jsonLoads(args[0].read(), e); }, "load(fp)"));
    return m;
  };

  /* ---- os / os.path ---- */
  function pathJoinSafe(parts, env) {
    var segs = parts.map(function (p) { return toStr(p, env); });
    if (!segs.length) throw errNew("TypeError", ["join() takes at least 1 argument (0 given)"], env);
    var out = segs.shift();
    segs.forEach(function (s) {
      if (s.charAt(0) === "/") { out = s; return; }
      if (!out) out = s;
      else if (/\/$/.test(out)) out += s;
      else out += "/" + s;
    });
    return out;
  }
  MODS.os = function (env) {
    var fs = env.fs;
    var m = mod("os", {
      sep: "/", linesep: "\n", name: "posix", pathsep: ":", curdir: ".", pardir: "..", extsep: ".", altsep: NONE
    });
    m.dict.set("getcwd", bin("getcwd", function () { return env.cwdShown; }, "getcwd() -> path"));
    m.dict.set("chdir", bin("chdir", function (args, kw, e) {
      var abs = e.fs.norm(toStr(args[0], e));
      if (!e.fs.dirs.has(abs)) throw errNew("FileNotFoundError", [2, "No such file or directory: " + repr(args[0], e)], e);
      e.fs.cwd = abs;
      e.cwdShown = abs;
      if (e.trace) e.trace.chdir = (e.trace.chdir || 0) + 1;
      return NONE;
    }, "chdir(path)"));
    m.dict.set("listdir", bin("listdir", function (args, kw, e) { return fs.list(toStr(args[0] === NONE ? "." : args[0], e)); }, "listdir(path) -> list"));
    m.dict.set("makedirs", bin("makedirs", function (args, kw, e) {
      var p = toStr(args[0], e);
      if (fs.isDir(p) && !truthy(kw.exist_ok || NONE, e)) throw errNew("FileExistsError", [17, "Directory already exists: " + repr(args[0], e)], e);
      fs.mkdir(p, true);
      return NONE;
    }, "makedirs(name)"));
    m.dict.set("mkdir", bin("mkdir", function (args, kw, e) {
      var p = toStr(args[0], e);
      if (fs.exists(p)) throw errNew("FileExistsError", [17, "File exists: " + repr(args[0], e)], e);
      fs.mkdir(p, false);
      return NONE;
    }, "mkdir(path)"));
    m.dict.set("remove", bin("remove", function (args, kw, e) {
      var p = toStr(args[0], e);
      if (!fs.exists(p)) throw errNew("FileNotFoundError", [2, "No such file or directory: " + repr(args[0], e)], e);
      if (fs.isDir(p)) throw errNew("IsADirectoryError", [21, "Is a directory: " + repr(args[0], e)], e);
      fs.files.delete(fs.norm(p));
      return NONE;
    }, "remove(path)"));
    m.dict.set("rename", bin("rename", function (args, kw, e) {
      var a = fs.norm(toStr(args[0], e)), b = fs.norm(toStr(args[1], e));
      if (!fs.files.has(a)) throw errNew("FileNotFoundError", [2, "No such file or directory: " + repr(args[0], e)], e);
      fs.files.set(b, fs.files.get(a));
      fs.files.delete(a);
      return NONE;
    }, "rename(src, dst)"));
    m.dict.set("fspath", bin("fspath", function (args, kw, e) { return toStr(args[0], e); }, "fspath(path)"));
    m.dict.set("environ", new PyDict());
    var p = mod("path", {});
    p.dict.set("join", bin("join", function (args, kw, e) { return pathJoinSafe(args, e); }, "join(a, b, ...)"));
    p.dict.set("dirname", bin("dirname", function (args, kw, e) {
      var s = toStr(args[0], e), at = s.lastIndexOf("/");
      if (at < 0) return "";
      if (at === 0) return "/";
      return s.slice(0, at);
    }, "dirname(p)"));
    p.dict.set("basename", bin("basename", function (args, kw, e) {
      var s = toStr(args[0], e);
      return s.slice(s.lastIndexOf("/") + 1);
    }, "basename(p)"));
    p.dict.set("abspath", bin("abspath", function (args, kw, e) {
      var s = toStr(args[0], e);
      var abs = env.fs.norm(s);
      return abs;
    }, "abspath(p)"));
    p.dict.set("exists", bin("exists", function (args, kw, e) { return env.fs.exists(toStr(args[0], e)); }, "exists(p)"));
    p.dict.set("isfile", bin("isfile", function (args, kw, e) { return env.fs.isFile(toStr(args[0], e)); }, "isfile(p)"));
    p.dict.set("isdir", bin("isdir", function (args, kw, e) { return env.fs.isDir(toStr(args[0], e)); }, "isdir(p)"));
    p.dict.set("isabs", bin("isabs", function (args, kw, e) { return toStr(args[0], e).charAt(0) === "/"; }, "isabs(p)"));
    p.dict.set("splitext", bin("splitext", function (args, kw, e) {
      var s = toStr(args[0], e), at = s.lastIndexOf("."), base = s.slice(s.lastIndexOf("/") + 1);
      if (at <= base.indexOf("/")) return new R.PyTuple([s, ""]);
      if (at < 0) return new R.PyTuple([s, ""]);
      return new R.PyTuple([s.slice(0, at), s.slice(at)]);
    }, "splitext(p)"));
    p.dict.set("getsize", bin("getsize", function (args, kw, e) {
      var s = toStr(args[0], e);
      if (!env.fs.exists(s)) throw errNew("FileNotFoundError", [2, "No such file or directory: " + repr(args[0], e)], e);
      return env.fs.size(s);
    }, "getsize(p)"));
    p.dict.set("split", bin("split", function (args, kw, e) {
      var s = toStr(args[0], e), at = s.lastIndexOf("/");
      return new R.PyTuple([at < 0 ? "" : s.slice(0, at + 1), s.slice(at + 1)]);
    }, "split(p)"));
    p.dict.set("normpath", bin("normpath", function (args, kw, e) {
      var s = toStr(args[0], e), abs = e.fs.norm(s);
      return s.charAt(0) === "/" ? abs : (abs === "/" ? "" : abs.slice(1));
    }, "normpath(p)"));
    m.dict.set("path", p);
    m.sub = { path: true };
    return m;
  };

  /* ---- pathlib ---- */
  MODS.pathlib = function (env) {
    var fs = env.fs;
    var cls = new PyClass("PosixPath", [], new Map(), "pathlib");

    /* Path 对象：_p 是给读者看的路径串（保持他写的样子），name/stem/suffix/parent 构造时算好 */
    function mkPathObj(p, depth) {
      var inst = new PyInstance(cls);
      if (p === "") p = ".";
      inst.dict.set("_p", p);
      var base = p.slice(p.lastIndexOf("/") + 1);
      inst.dict.set("name", base);
      var dot = base.lastIndexOf(".");
      inst.dict.set("suffix", dot > 0 ? base.slice(dot) : "");
      inst.dict.set("stem", dot > 0 ? base.slice(0, dot) : base);
      inst.dict.set("suffixes", dot > 0 ? [base.slice(dot)] : []);
      inst.dict.set("parts", p === "." ? [] : p.split("/").filter(function (x) { return x !== ""; }));
      var ps = parentStr(p);
      /* "." 和 "/" 的父目录是自己；再往上套 5 层就止步（正文最深只用到 .parent.parent） */
      if (ps === p || depth >= 5) inst.dict.set("parent", inst);
      else inst.dict.set("parent", mkPathObj(ps, depth + 1));
      return inst;
    }
    function parentStr(p) {
      if (p === "." || p === "/") return p;
      var at = p.lastIndexOf("/");
      if (at < 0) return "";
      if (at === 0) return "/";
      return p.slice(0, at);
    }
    function buildPath(p, e) { return mkPathObj(p, 0); }
    function displayPath(inst, e) {
      if (!inst) return "";
      if (inst.dict && inst.dict.has("_p")) return inst.dict.get("_p");
      return toStr(inst, e);
    }
    R.PathClass = cls;
    R.PathBuild = buildPath;
    R.PathDisplay = displayPath;

    function M2(name, fn) { cls.dict.set(name, bin(name, function (args, kw, e) { return fn(args[0], args.slice(1), kw, e); }, name + "()")); }
    cls.dict.set("__init__", bin("__init__", function (args, kw, e) {
      var self = args[0];
      var parts = args.slice(1).map(function (a) { return isStr(a) ? a : displayPath(a, e); });
      var joined = parts.length ? pathJoinSafe(parts, e) : ".";
      var src = mkPathObj(joined, 0);
      src.dict.forEach(function (v, k) { self.dict.set(k, v); });
      self.dict.set("_abs", e.fs.norm(joined));
      return NONE;
    }));
    cls.dict.set("__str__", bin("__str__", function (args, kw, e) {
      var inst = args[0];
      return displayPath(inst, e);
    }));
    cls.dict.set("__repr__", bin("__repr__", function (args, kw, e) { return "PosixPath(" + reprStr(displayPath(args[0], e)) + ")"; }));
    cls.dict.set("__fspath__", cls.dict.get("__str__"));
    cls.dict.set("__truediv__", bin("__truediv__", function (args, kw, e) {
      var a = displayPath(args[0], e), b = args[1] instanceof PyInstance ? displayPath(args[1], e) : toStr(args[1], e);
      if (b === "") return buildPath(a, e);
      if (b.charAt(0) === "/") return buildPath(b, e);
      if (a === "." ) return buildPath(b, e);
      if (a === "/") return buildPath("/" + b, e);
      return buildPath(a + "/" + b, e);
    }));
    cls.dict.set("__eq__", bin("__eq__", function (args, kw, e) {
      var o = args[1];
      if (o instanceof PyInstance && o.cls === cls) return displayPath(args[0], e) === displayPath(o, e);
      return NOTSET;
    }));
    cls.dict.set("__lt__", bin("__lt__", function (args, kw, e) {
      var o = args[1];
      if (o instanceof PyInstance && o.cls === cls) return displayPath(args[0], e) < displayPath(o, e);
      return NOTSET;
    }));
    cls.dict.set("__hash__", bin("__hash__", function (args, kw, e) { return hashKey(displayPath(args[0], e), e); }));
    M2("exists", function (self) { return fs.exists(displayPath(self, arguments[3])); });
    M2("is_file", function (self) { return fs.isFile(displayPath(self, arguments[3])); });
    M2("is_dir", function (self, args, kw, e) { return fs.isDir(displayPath(self, e)); });
    M2("read_text", function (self, args, kw, e) {
      var p = displayPath(self, e);
      if (!fs.exists(p)) throw errNew("FileNotFoundError", [2, "No such file or directory: " + reprStr(p)], e);
      if (fs.isDir(p)) throw errNew("IsADirectoryError", [21, "Is a directory: " + reprStr(p)], e);
      var s = fs.read(p);
      var enc = kw.encoding ? toStr(kw.encoding, e) : "utf-8";
      if (enc.replace(/-/g, "").toLowerCase() !== "utf8") {
        try { return new TextDecoder(enc).decode(fs.readBytes(p)); }
        catch (er) { throw errNew("LookupError", ["unknown encoding: " + enc], e); }
      }
      return s;
    });
    M2("write_text", function (self, args, kw, e) {
      var p = displayPath(self, e);
      var data = toStr(args[0], e);
      if (fs.isDir(p)) throw errNew("IsADirectoryError", [21, "Is a directory: " + reprStr(p)], e);
      fs.write(p, data, kw.mode && toStr(kw.mode, e) === "a" ? "a" : "w");
      if (e.trace) e.trace.writes.push({ path: p, text: data });
      return Array.from(data).length;
    });
    M2("unlink", function (self, args, kw, e) {
      var p = displayPath(self, e);
      if (kw.missing_ok && truthy(kw.missing_ok, e) && !fs.exists(p)) return NONE;
      if (!fs.exists(p)) throw errNew("FileNotFoundError", [2, "No such file or directory: " + reprStr(p)], e);
      if (fs.isDir(p)) {
        if (fs.list(p).length) throw errNew("OSError", [39, "[Errno 39] Directory not empty: " + reprStr(p)], e);
        fs.dirs.delete(fs.norm(p));
        return NONE;
      }
      fs.files.delete(fs.norm(p));
      if (e.trace) e.trace.unlinks = (e.trace.unlinks || []).concat([p]);
      return NONE;
    });
    M2("rmdir", function (self, args, kw, e) {
      var p = displayPath(self, e);
      if (!fs.isDir(p)) throw errNew("NotADirectoryError", [20, "Not a directory: " + reprStr(p)], e);
      if (fs.list(p).length) throw errNew("OSError", [39, "[Errno 39] Directory not empty: " + reprStr(p)], e);
      fs.dirs.delete(fs.norm(p));
      return NONE;
    });
    M2("mkdir", function (self, args, kw, e) {
      var p = displayPath(self, e);
      var parents = kw.parents ? truthy(kw.parents, e) : false;
      var existOk = kw.exist_ok ? truthy(kw.exist_ok, e) : false;
      if (fs.isDir(p)) {
        if (existOk) return NONE;
        throw errNew("FileExistsError", [17, "File exists: " + reprStr(p)], e);
      }
      var par = p.lastIndexOf("/") >= 0 ? p.slice(0, p.lastIndexOf("/")) : "";
      if (par && !fs.isDir(par) && !parents) throw errNew("FileNotFoundError", [2, "No such file or directory: " + reprStr(par)], e);
      fs.mkdir(p, true);
      return NONE;
    });
    M2("iterdir", function (self, args, kw, e) {
      var p = displayPath(self, e);
      if (!fs.isDir(p)) throw errNew("NotADirectoryError", [20, "Not a directory: " + reprStr(p)], e);
      return fs.list(p).map(function (n) { return buildPath(p === "." ? n : (p === "/" ? "/" + n : p + "/" + n), e); });
    });
    M2("glob", function (self, args, kw, e) {
      var p = displayPath(self, e), pat = toStr(args[0], e);
      return matchGlob(p, pat, false, e);
    });
    M2("rglob", function (self, args, kw, e) {
      var p = displayPath(self, e), pat = toStr(args[0], e);
      return matchGlob(p, pat, true, e);
    });
    M2("joinpath", function (self, args, kw, e) {
      var p = displayPath(self, e);
      args.forEach(function (a) {
        var b = a instanceof PyInstance ? displayPath(a, e) : toStr(a, e);
        p = p === "." ? b : p + "/" + b;
      });
      return buildPath(p, e);
    });
    M2("absolute", function (self, args, kw, e) {
      var p = displayPath(self, e);
      return buildPath(p.charAt(0) === "/" ? p : fs.norm(p), e);
    });
    M2("resolve", function (self, args, kw, e) { return buildPath(fs.norm(displayPath(self, e)), e); });
    M2("as_posix", function (self, args, kw, e) { return displayPath(self, e); });
    M2("with_suffix", function (self, args, kw, e) {
      var p = displayPath(self, e), s = toStr(args[0], e);
      var at = p.lastIndexOf(".");
      var base = p.lastIndexOf("/");
      if (at > base) p = p.slice(0, at);
      return buildPath(p + s, e);
    });
    M2("with_name", function (self, args, kw, e) {
      var p = displayPath(self, e), at = p.lastIndexOf("/");
      return buildPath(at < 0 ? toStr(args[0], e) : p.slice(0, at + 1) + toStr(args[0], e), e);
    });
    M2("open", function (self, args, kw, e) {
      var p = displayPath(self, e);
      var mode = args[0] !== undefined ? toStr(args[0], e) : "r";
      var enc = args[1] !== undefined ? toStr(args[1], e) : (kw.encoding ? toStr(kw.encoding, e) : null);
      return new PyFile(e, p, mode, enc, true);
    });
    M2("stat", function (self, args, kw, e) {
      var p = displayPath(self, e);
      if (!fs.exists(p)) throw errNew("FileNotFoundError", [2, "No such file or directory: " + reprStr(p)], e);
      var st = new PyInstance(STAT_CLS);
      st.dict.set("st_size", fs.isFile(p) ? fs.size(p) : 0);
      st.dict.set("st_mode", fs.isDir(p) ? 16832 : 33152);
      st.dict.set("st_mtime", (fs.files.get(fs.norm(p)) || {}).mtime || 1000);
      st.dict.set("st_ctime", (fs.files.get(fs.norm(p)) || {}).mtime || 1000);
      st.dict.set("st_atime", (fs.files.get(fs.norm(p)) || {}).mtime || 1000);
      st.dict.set("st_nlink", 1);
      return st;
    });
    cls.dict.set("cwd", bin("cwd", function (args, kw, e) { return buildPath(e.cwdShown === "/" ? "/" : (e.cwdShown || "."), e); }, "cwd()"));
    cls.dict.set("home", bin("home", function (args, kw, e) { return buildPath(fs.root, e); }, "home()"));
    cls.dict.set("__name__", "PosixPath");
    function matchGlob(dirp, pat, deep, e) {
      var out = [], rx = new RegExp("^" + pat.replace(/[.+^${}()|\[\]\\]/g, "\\$&").replace(/\*/g, "[^/]*").replace(/\?/g, "[^/]") + "$");
      var rrx = deep ? new RegExp("^" + pat.replace(/[.+^${}()|\[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".") + "$") : rx;
      var all = Array.from(fs.files.keys()).concat(Array.from(fs.dirs));
      var abs = fs.norm(dirp);
      all.forEach(function (k) {
        if (k === abs) return;
        if (k.indexOf(abs === "/" ? "/" : abs + "/") !== 0) return;
        var rest = k.slice((abs === "/" ? "" : abs).length + 1);
        if (!deep && rest.indexOf("/") >= 0) return;
        if ((deep ? rrx : rx).test(rest)) out.push(buildPath(dirp === "." ? rest : dirp + "/" + rest, e));
      });
      return out;
    }
    var m = mod("pathlib", {});
    m.dict.set("Path", cls);
    m.dict.set("PosixPath", cls);
    m.dict.set("PurePath", cls);
    R.PathClass = cls;
    R.PathBuild = buildPath;
    R.PathDisplay = displayPath;
    return m;
  };
  var STAT_CLS = new PyClass("stat_result", [], new Map(), "os");
  R.STAT_CLS = STAT_CLS;

  /* ---- random（固定种子，考试重跑结果才稳） ---- */
  MODS.random = function (env) {
    var state = env.randomState || (env.randomState = 20261005);
    function rnd() {
      state = (state * 1103515245 + 12345) % 2147483648;
      return state / 2147483648;
    }
    var m = mod("random", {});
    m.dict.set("seed", bin("seed", function (args) { state = args.length ? Math.abs(Math.trunc(numOf(args[0]))) || 1 : 20261005; return NONE; }, "seed(n)"));
    m.dict.set("random", bin("random", function () { return new PyFloat(Math.floor(rnd() * 1e16) / 1e16); }, "random() -> float"));
    m.dict.set("randint", bin("randint", function (args, kw, e) {
      var a = numOf(args[0]), b = numOf(args[1]);
      if (a > b) throw errNew("ValueError", ["empty range in randint()"], e);
      return Math.floor(a + rnd() * (b - a + 1));
    }, "randint(a, b) -> int"));
    m.dict.set("randrange", bin("randrange", function (args, kw, e) {
      var a = args.length > 1 ? numOf(args[0]) : 0, b = args.length > 1 ? numOf(args[1]) : numOf(args[0]);
      return Math.floor(a + rnd() * (b - a));
    }, "randrange(start, stop)"));
    m.dict.set("choice", bin("choice", function (args, kw, e) {
      var seq = Array.isArray(args[0]) ? args[0] : (args[0] instanceof PyTuple ? args[0].items : (isStr(args[0]) ? Array.from(args[0]) : listOf(args[0], e)));
      if (!seq.length) throw errNew("IndexError", ["no valid entry for a non-empty sequence"], e);
      return seq[Math.floor(rnd() * seq.length)];
    }, "choice(seq)"));
    m.dict.set("shuffle", bin("shuffle", function (args) {
      var a = args[0];
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
      return NONE;
    }, "shuffle(list)"));
    m.dict.set("sample", bin("sample", function (args, kw, e) {
      var pool = listOf(args[0], e).slice(), k = numOf(args[1]), out = [];
      for (var i = 0; i < k && pool.length; i++) out.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0]);
      return out;
    }, "sample(seq, k)"));
    m.dict.set("uniform", bin("uniform", function (args) { return new PyFloat(numOf(args[0]) + rnd() * (numOf(args[1]) - numOf(args[0]))); }, "uniform(a, b)"));
    return m;
  };

  /* ---- math ---- */
  MODS.math = function (env) {
    var m = mod("math", {
      pi: new PyFloat(Math.PI), e: new PyFloat(Math.E), tau: new PyFloat(Math.PI * 2),
      inf: new PyFloat(Infinity), nan: new PyFloat(NaN)
    });
    var fns = {
      sqrt: function (a, kw, e) { var x = numOf(a[0]); if (x < 0) throw errNew("ValueError", ["math domain error"], e); return new PyFloat(Math.sqrt(x)); },
      floor: function (a) { return Math.floor(numOf(a[0])); },
      ceil: function (a) { return Math.ceil(numOf(a[0])); },
      trunc: function (a) { return Math.trunc(numOf(a[0])); },
      fabs: function (a) { return new PyFloat(Math.abs(numOf(a[0]))); },
      exp: function (a) { return new PyFloat(Math.exp(numOf(a[0]))); },
      log: function (a, kw, e) { var x = numOf(a[0]); if (a[1] !== undefined) return new PyFloat(Math.log(x) / Math.log(numOf(a[1]))); return new PyFloat(Math.log(x)); },
      log2: function (a) { return new PyFloat(Math.log2(numOf(a[0]))); },
      log10: function (a) { return new PyFloat(Math.log10(numOf(a[0]))); },
      sin: function (a) { return new PyFloat(Math.sin(numOf(a[0]))); },
      cos: function (a) { return new PyFloat(Math.cos(numOf(a[0]))); },
      tan: function (a) { return new PyFloat(Math.tan(numOf(a[0]))); },
      pow: function (a, kw, e) { return R.binop("**", a[0], a[1], e); },
      hypot: function (a, kw, e) { return new PyFloat(Math.hypot.apply(null, a.map(function (x) { return numOf(x); }))); },
      isclose: function (a, kw, e) { return Math.abs(numOf(a[0]) - numOf(a[1])) <= 1e-9; },
      isinf: function (a) { return !isFinite(numOf(a[0])) && !Number.isNaN(numOf(a[0])); },
      isnan: function (a) { return Number.isNaN(numOf(a[0])); },
      isfinite: function (a) { return isFinite(numOf(a[0])); },
      gcd: function (a, kw, e) {
        var xs = a.map(function (x) { return Math.abs(numOf(x)); });
        function g2(x, y) { return y ? g2(y, x % y) : x; }
        return xs.reduce(function (p, c) { return g2(p, c); });
      },
      factorial: function (a, kw, e) {
        var n = numOf(a[0]);
        if (n < 0) throw errNew("ValueError", ["math domain error"], e);
        var r = 1;
        for (var i = 2; i <= n; i++) r *= i;
        return r;
      },
      modf: function (a) { var i = Math.trunc(numOf(a[0])); return new R.PyTuple([new PyFloat(numOf(a[0]) - i), new PyFloat(i)]); },
      fsum: function (a, kw, e) { return new PyFloat(listOf(a[0], e).reduce(function (p, x) { return p + numOf(x); }, 0)); }
    };
    Object.keys(fns).forEach(function (k) { m.dict.set(k, bin(k, function (args, kw, e) { return fns[k](args.concat([e]), kw, e); }, k + "()")); });
    return m;
  };

  /* ---- keyword / string / time / shutil / decimal ---- */
  MODS.keyword = function (env) {
    var m = mod("keyword", {
      kwlist: Object.keys(ENG.KEYWORDS).sort(),
      softkwlist: ["_", "case", "match", "type"]
    });
    m.dict.set("iskeyword", bin("iskeyword", function (args) { return !!ENG.KEYWORDS[args[0]]; }, "iskeyword(s)"));
    return m;
  };
  MODS.string = function (env) {
    return mod("string", {
      ascii_lowercase: "abcdefghijklmnopqrstuvwxyz",
      ascii_uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      ascii_letters: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
      digits: "0123456789",
      hexdigits: "0123456789abcdefABCDEF",
      octdigits: "01234567",
      punctuation: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
      whitespace: " \t\n\v\f\r",
      printable: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ \t\n\v\f\r"
    });
  };
  MODS.time = function (env) {
    env.timeBase = env.timeBase || 1730000000;
    var m = mod("time", {});
    m.dict.set("time", bin("time", function () { return new PyFloat(env.timeBase += 0.001); }, "time()"));
    m.dict.set("perf_counter", bin("perf_counter", function () { return new PyFloat(env.perf = (env.perf || 0) + 0.0001); }, "perf_counter()"));
    m.dict.set("monotonic", bin("monotonic", function () { return new PyFloat(env.perf = (env.perf || 0) + 0.0001); }, "monotonic()"));
    m.dict.set("sleep", bin("sleep", function () { return NONE; }, "sleep(s)"));
    m.dict.set("strftime", bin("strftime", function (args, kw, e) { return toStr(args[0], e).replace(/%Y/, "2026").replace(/%m/, "10").replace(/%d/, "05").replace(/%H/, "12").replace(/%M/, "00").replace(/%S/, "00"); }, "strftime(fmt)"));
    return m;
  };
  MODS.shutil = function (env) {
    var m = mod("shutil", {});
    m.dict.set("rmtree", bin("rmtree", function (args, kw, e) {
      var p = toStr(args[0], e);
      if (!e.fs.isDir(p)) {
        if (kw.ignore_errors && truthy(kw.ignore_errors, e)) return NONE;
        throw errNew("FileNotFoundError", [2, "No such file or directory: " + repr(args[0], e)], e);
      }
      e.fs.rmtree(p);
      return NONE;
    }, "rmtree(path)"));
    m.dict.set("copy", bin("copy", function (args, kw, e) {
      var a = toStr(args[0], e), b = toStr(args[1], e);
      if (!e.fs.isFile(a)) throw errNew("FileNotFoundError", [2, "No such file or directory: " + repr(args[0], e)], e);
      if (e.fs.isDir(b)) b = b.replace(/\/$/, "") + "/" + a.slice(a.lastIndexOf("/") + 1);
      e.fs.write(b, e.fs.read(a));
      return b;
    }, "copy(src, dst)"));
    m.dict.set("copy2", m.dict.get("copy"));
    m.dict.set("move", bin("move", function (args, kw, e) {
      var a = e.fs.norm(toStr(args[0], e)), b = toStr(args[1], e);
      if (!e.fs.files.has(a)) throw errNew("FileNotFoundError", [2, "No such file or directory: " + repr(args[0], e)], e);
      e.fs.write(b, e.fs.read(a));
      e.fs.files.delete(a);
      return b;
    }, "move(src, dst)"));
    return m;
  };
  MODS.decimal = function (env) {
    var cls = new PyClass("Decimal", [], new Map(), "decimal");
    cls.dict.set("__init__", bin("__init__", function (args, kw, e) {
      var self = args[0];
      var v = args[1];
      var s = isStr(v) ? v.trim() : (v instanceof PyFloat ? R.reprFloat(v.v) : String(numOf(v)));
      if (!/^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(s)) throw errNew("InvalidOperation", ["[<class 'decimal.ConversionSyntax'>]"], e);
      self.dict.set("_s", s);
      self.dict.set("_v", new PyFloat(parseFloat(s)));
      return NONE;
    }));
    function dv(i) { return i.dict.get("_v"); }
    function mk(s, e) { var d = new PyInstance(cls); call(R.dunder ? classInit(cls) : NONE, [], {}, e, d); return d; }
    function classInit(c) { return c.dict.get("__init__"); }
    function num(v) { return parseFloat(v.dict.get("_s")); }
    ["__add__", "__sub__", "__mul__", "__truediv__"].forEach(function (nm) {
      cls.dict.set(nm, bin(nm, function (args, kw, e) {
        var a = num(args[0]), b = args[1] instanceof PyInstance && args[1].cls === cls ? num(args[1]) : numOf(args[1]);
        var r = nm === "__add__" ? a + b : nm === "__sub__" ? a - b : nm === "__mul__" ? a * b : a / b;
        /* 十进制精确：小数位数按两边之和，避开二进制的 0.1+0.2 */
        var da = (args[0].dict.get("_s").split(".")[1] || "").length;
        var db = args[1] instanceof PyInstance && args[1].cls === cls ? (args[1].dict.get("_s").split(".")[1] || "").length : 0;
        var prec = nm === "__truediv__" ? 28 : Math.max(da, db);
        var s = r.toFixed(Math.min(prec, 28)).replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
        var out = new PyInstance(cls);
        out.dict.set("_s", s);
        out.dict.set("_v", new PyFloat(parseFloat(s)));
        return out;
      }));
    });
    cls.dict.set("__str__", bin("__str__", function (args) { return args[0].dict.get("_s"); }));
    cls.dict.set("__repr__", bin("__repr__", function (args) { return "Decimal('" + args[0].dict.get("_s") + "')"; }));
    cls.dict.set("__eq__", bin("__eq__", function (args) { return num(args[0]) === (args[1] instanceof PyInstance && args[1].cls === cls ? num(args[1]) : numOf(args[1])); }));
    cls.dict.set("__lt__", bin("__lt__", function (args) { return num(args[0]) < (args[1] instanceof PyInstance && args[1].cls === cls ? num(args[1]) : numOf(args[1])); }));
    cls.dict.set("is_integer", bin("is_integer", function (args) { return num(args[0]) === Math.trunc(num(args[0])); }));
    ["__neg__"].forEach(function (nm) {
      cls.dict.set(nm, bin(nm, function (args) {
        var out = new PyInstance(cls);
        var s = num(args[0]) < 0 ? args[0].dict.get("_s").slice(1) : "-" + args[0].dict.get("_s");
        out.dict.set("_s", s); out.dict.set("_v", new PyFloat(parseFloat(s)));
        return out;
      }));
    });
    var m = mod("decimal", { Decimal: cls });
    return m;
  };

  B.buildModule = function (name, env) {
    var dotted = name.split(".");
    var maker = MODS[dotted[0]];
    if (!maker) return null;
    var m = maker(env);
    if (!m.dict.has("__name__")) m.dict.set("__name__", name);
    m.dict.set("__builtins__", NONE);
    if (dotted[1] && m.dict.has(dotted[1])) return attrOf(m, dotted[1], env);
    if (dotted[1]) throw errNew("ModuleNotFoundError", ["No module named '" + name + "'"], env);
    return m;
  };
  function attrOf(m, name, env) { return R.attrGet(m, name, env); }
  R.MODS = MODS;

  /* ================= 运行入口 ================= */
  function makeEnv(opts) {
    opts = opts || {};
    var fs = new VFS(opts.root || "/home/miao");
    fs.cwd = opts.cwdAbs || fs.root;
    var env = {
      file: opts.file || "main.py",
      fs: fs,
      modules: new Map(),
      outBuf: [], errBuf: [],
      stdinQueue: (opts.stdin || []).map(function (s) { return String(s); }),
      stdinBuf: [],
      steps: 0, maxSteps: opts.maxSteps || 4000000,
      depth: 0, maxDepth: opts.maxDepth || 220,
      maxLoop: opts.maxLoop || 300000,
      line: 0,
      trace: { calls: [], branches: [], loops: [], lines: new Set(), vars: {}, outputs: [], inputs: [], opens: [], writes: [], imports: [], unlinks: [] },
      cwdShown: opts.cwd || (opts.root || "/home/miao"),
      argv: opts.argv || [],
      curScope: null, curFunc: null,
      modName: "__main__",
      pyStack: [],
      startTime: Date.now()
    };
    env.stdoutObj = makeStdout(env);
    env.globals = new R.Scope("module", null, new Map());
    env.globals.vars.set("__name__", "__main__");
    /* 自 3.9 起 __file__ 是绝对路径（第 38/41/45 课都用它锚定目录） */
    var absFile = env.file.charAt(0) === "/" ? env.file : (env.fs.norm(env.file));
    env.globals.vars.set("__file__", absFile);
    env.globals.vars.set("__doc__", NONE);
    env.globals.vars.set("__builtins__", B.builtins);
    var main = new PyModule("__main__", env.globals.vars);
    env.modules.set("__main__", main);
    return env;
  }
  R.makeEnv = makeEnv;

  /* 报错正文按 CPython 的排法：Traceback → 每帧（File 行 + 缩进的源码回显）→ 类名: 正文。
     这两段以前是「拼好了又丢掉」：语法错把 File/源码两行扔了只回结论行，
     运行错则因为 env.pyStack 从没入栈而一帧都没有 —— 于是终端里只有两行字，
     看着根本不像 Python，也轮不到呈现层给回显的源码上语法色。 */
  function frameLines(file, line, env, srcByFile) {
    var out = ['  File "' + file + '", line ' + line];
    var srcLine = (srcByFile[file] || env.src || "").split("\n")[line - 1];
    if (srcLine !== undefined) out.push("    " + srcLine.replace(/\t/g, "        "));
    return out;
  }
  function formatErr(e, env, srcByFile) {
    if (!e) return "";
    if (e.isPyError) {
      /* CPython 对语法错不打 Traceback 头，直接 File 行 + 源码回显 + 结论行 */
      return frameLines(e.pyfile || env.file, e.pyline, env, srcByFile)
        .concat(["SyntaxError: " + e.pymsg]).join("\n") + "\n";
    }
    if (e && e.k2 === "exc") {
      var out = ["Traceback (most recent call last):"];
      var stack = (env.pyStack && env.pyStack.length) ? env.pyStack
        : (e.pyline || env.line ? [{ file: e.pyfile || env.file, line: e.pyline || env.line, name: "<module>" }] : []);
      stack.forEach(function (fr) {
        var head = '  File "' + fr.file + '", line ' + fr.line + ", in " + fr.name;
        var body = frameLines(fr.file, fr.line, env, srcByFile);
        body[0] = head;                       /* File 行补上「, in 函数名」，源码回显跟在它下面 */
        out.push(body[0]);
        if (body[1] !== undefined) out.push(body[1]);
      });
      out.push(R.excLine(e, env));
      return out.join("\n") + "\n";
    }
    /* 沙箱自身没预料到的 JS 异常：明说，别装作是 Python 报错 */
    return "InternalError: 沙箱内部出错（这不是你的代码写错了）：" + (e.message || e) + "\n" +
      String(e.stack || "").split("\n").slice(1, 4).map(function (l) { return "  " + l.trim(); }).join("\n") + "\n";
  }
  R.formatErr = formatErr;

  R.run = function (src, opts) {
    opts = opts || {};
    var env = makeEnv(opts);
    env.src = src;
    var srcByFile = {};
    srcByFile[env.file] = src;
    Object.keys(opts.files || {}).forEach(function (name) { env.fs.write(name, opts.files[name]); });
    if (opts.dirs) opts.dirs.forEach(function (d) { env.fs.mkdir(d, true); });
    var exit = 0, ast = null;
    try {
      ast = ENG.parse(src, env.file);
      /* 模块首行的字符串字面量就是 __doc__（CPython 的规矩，第 9 课直接演示它） */
      var first = ast.body[0];
      if (first && first.k === "expr" && first.value && first.value.k === "str") env.globals.vars.set("__doc__", first.value.v);
      else env.globals.vars.set("__doc__", NONE);
    } catch (e) {
      return { out: env.outBuf.join(""), err: formatErr(e, env, srcByFile), exitCode: 1, trace: env.trace, files: dumpFs(env), error: e, ast: null };
    }
    try {
      I.execBlock(ast.body, env.globals, env);
    } catch (e) {
      if (e && e.isSystemExit !== undefined) { exit = e.isSystemExit; }
      else if (e && e.k2 === "exc" && e.cls.isExc === "SystemExit") { exit = e.args.length ? numOf(e.args[0]) : 0; }
      else {
        exit = 1;
        env.errBuf.push(formatErr(e, env, srcByFile));
        env.error = e;
      }
    }
    return {
      out: env.outBuf.join(""), err: env.errBuf.join(""),
      exitCode: exit, trace: env.trace, files: dumpFs(env),
      vars: dumpVars(env), env: env, ast: ast, ms: Date.now() - env.startTime
    };
  };
  function dumpFs(env) {
    var out = {};
    env.fs.files.forEach(function (f, k) { out[k] = f.text !== null && f.text !== undefined ? f.text : "<bytes " + (f.bytes ? f.bytes.length : 0) + ">"; });
    return out;
  }
  function dumpVars(env) {
    var out = {};
    env.globals.vars.forEach(function (v, k) {
      if (k === "__builtins__" || k === "__name__" || k === "__file__" || k === "__doc__") return;
      out[k] = { value: R.repr(v, env), type: R.typeName(v) };
    });
    return out;
  }
  R.dumpVars = dumpVars;
  root.MIAO_PYRUN = R;
  if (typeof module === "object" && module.exports) module.exports = R;
})(typeof globalThis !== "undefined" ? globalThis : this);
