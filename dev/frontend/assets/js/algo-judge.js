/* 喵站 · 考试 · 算法题库判分器（纯逻辑，浏览器与 Node 共用）
 *
 * 它只做三件事：
 *   1. 把读者写的 Python 函数和一条用例拼成一段完整程序，交给站内沙箱（py-stdlib.js 的 run）跑；
 *   2. 从输出里取回函数返回值，与 expect 做 JSON 深比较；
 *   3. 记下这次运行的墙钟用时，并按沙箱里留下的数据估一个内存数。
 *
 * 为什么一条用例跑一次：一条用例死循环时不会把后面的用例一起拖死，也能分开报「哪条没过」。
 * 代价是每条用例都会重新解析一次代码 —— 题都很小，实测整套 6 条用例仍在几十毫秒级。
 *
 * 内存口径（必须说清楚，不能假装是进程占用）：
 *   站内 Python 沙箱跑在浏览器 JS 堆里，没有独立进程，拿不到「这次运行用了多少 MB」。
 *   这里估的是「这次运行留在沙箱里的数据」——全局变量里的列表 / 字典 / 字符串 / 对象图，
 *   加上源码与实参的字节数、一个固定的解释器底座。它是可复跑、可比较的估算，
 *   不是浏览器进程内存，也不拿来跟别人排名（本来就没有排名）。
 */
(function (root) {
  "use strict";
  var RUN = root.MIAO_PYRUN || null;

  function pyLit(v) {
    if (v === null || v === undefined) return "None";
    if (v === true) return "True";
    if (v === false) return "False";
    if (typeof v === "number") {
      if (!isFinite(v)) throw new Error("用例里出现了非有限数字");
      return String(v);
    }
    if (typeof v === "string") return JSON.stringify(v);
    if (Array.isArray(v)) return "[" + v.map(pyLit).join(", ") + "]";
    throw new Error("用例实参只支持数字 / 文本 / 布尔 / None / 数组");
  }

  function deepEq(a, b) {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (Array.isArray(a) || Array.isArray(b)) {
      if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
      for (var i = 0; i < a.length; i++) if (!deepEq(a[i], b[i])) return false;
      return true;
    }
    if (a && b && typeof a === "object") {
      var ka = Object.keys(a), kb = Object.keys(b);
      if (ka.length !== kb.length) return false;
      for (var j = 0; j < ka.length; j++) {
        if (!Object.prototype.hasOwnProperty.call(b, ka[j])) return false;
        if (!deepEq(a[ka[j]], b[ka[j]])) return false;
      }
      return true;
    }
    return false;
  }

  /* 沙箱里的数据估字节数：只认数据，不把函数 / 类 / 模块的整棵作用域拖进来 */
  function estValue(v, seen) {
    if (v === null || v === undefined) return 16;
    var t = typeof v;
    if (t === "number") return 8;
    if (t === "boolean") return 4;
    if (t === "bigint") return 16;
    if (t === "string") return 24 + v.length * 2;
    if (t !== "object") return 0;
    if (seen.has(v)) return 0;
    seen.add(v);
    if (Array.isArray(v)) {
      var an = 24 + v.length * 8;
      for (var i = 0; i < v.length; i++) an += estValue(v[i], seen);
      return an;
    }
    if (v instanceof Map) {
      var mn = 48 + v.size * 32;
      v.forEach(function (val, key) { mn += estValue(key, seen) + estValue(val, seen); });
      return mn;
    }
    if (v instanceof Set) {
      var sn = 48 + v.size * 16;
      v.forEach(function (val) { sn += estValue(val, seen); });
      return sn;
    }
    if (v.k === "none" || v.k === "notset") return 8;
    if (v.k === "float") return 16 + estValue(v.v, seen);
    if (v.k === "dict") {
      var dn = 48 + v.map.size * 40;
      v.map.forEach(function (pair) { dn += estValue(pair[0], seen) + estValue(pair[1], seen); });
      return dn;
    }
    if (v.k === "tuple") {
      var tn = 32 + (v.items || []).length * 8;
      (v.items || []).forEach(function (x) { tn += estValue(x, seen); });
      return tn;
    }
    if (v.k === "set" || v.k === "frozenset") {
      var qn = 48 + v.map.size * 24;
      v.map.forEach(function (pair) { qn += estValue(pair[0], seen); });
      return qn;
    }
    if (v.k === "bytes") return 32 + (v.b ? v.b.length : 0);
    if (v.k === "range") return 32;
    if (v.k === "obj") {
      var on = 48;
      v.dict.forEach(function (val, key) { on += estValue(key, seen) + estValue(val, seen); });
      return on;
    }
    /* 函数 / 类 / 内置 / 模块 / 绑定方法：只算一个壳，不钻进它们的作用域 */
    if (v.k === "func" || v.k === "builtin" || v.k === "bound" || v.k === "class" ||
      v.k === "module" || v.k === "type" || v.k === "super") return 32;
    var bn = 48;
    Object.keys(v).forEach(function (k) {
      if (k === "scope" || k === "parent" || k === "node" || k === "env" ||
        k === "globals" || k === "modules" || k === "fs" || k === "dict") return;
      bn += estValue(v[k], seen);
    });
    return bn;
  }

  function estimateBytes(env, source, args, out) {
    var seen = new Set();
    var bytes = 8192;                                  /* 解释器 / AST / 作用域的固定底座 */
    bytes += String(source || "").length * 2;
    bytes += JSON.stringify(args || []).length * 2;
    bytes += String(out || "").length * 2;
    try {
      env.globals.vars.forEach(function (v, k) {
        if (k === "__builtins__" || k === "__name__" || k === "__file__" || k === "__doc__") return;
        if (k.indexOf("__miao") === 0) return;
        bytes += estValue(v, seen);
      });
    } catch (e) { /* 估不出来就只算底座，不编一个数 */ }
    return Math.max(1024, Math.round(bytes));
  }

  function memoryText(bytes) {
    var n = Number(bytes) || 0;
    if (n >= 1024 * 1024) return (n / 1024 / 1024).toFixed(2) + " MB";
    return Math.max(1, Math.round(n / 1024)) + " KB";
  }

  function harness(problem, test) {
    var args = (test.args || []).map(pyLit).join(", ");
    return String(problem.fn) + "(" + args + ")";
  }

  function runCase(problem, source, test, index) {
    if (!RUN) return { index: index, ok: false, fatal: "Python 沙箱没加载上", error: "Python 沙箱没加载上" };
    var call = harness(problem, test);
    var full = String(source == null ? "" : source).replace(/\s+$/, "") + "\n\n" +
      "import json\n" +
      "try:\n" +
      "    __miao_value = " + call + "\n" +
      "    print(\"<<<MIAO_RESULT>>>\", json.dumps(__miao_value, ensure_ascii=False))\n" +
      "except Exception as __miao_err:\n" +
      "    print(\"<<<MIAO_ERROR>>>\", str(__miao_err))\n";
    var res;
    try {
      res = RUN.run(full, { file: "main.py", maxSteps: 1200000, maxLoop: 60000 });
    } catch (e) {
      return { index: index, ok: false, fatal: "沙箱启动失败：" + (e && e.message || e), error: String(e && e.message || e), ms: 0, memoryBytes: 8192 };
    }
    var out = String(res.out || "");
    var lines = out.split("\n");
    var gotText = null, errText = null;
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (line.indexOf("<<<MIAO_RESULT>>>") === 0) gotText = line.slice("<<<MIAO_RESULT>>>".length).trim();
      else if (line.indexOf("<<<MIAO_ERROR>>>") === 0) errText = line.slice("<<<MIAO_ERROR>>>".length).trim();
    }
    var mem = estimateBytes(res.env, full, test.args, out);
    var took = Number(res.ms) || 0;
    if (errText !== null) {
      return { index: index, ok: false, error: errText || "函数里抛了异常", ms: took, memoryBytes: mem, gotText: null };
    }
    if (gotText === null) {
      var why = res.err || "";
      var fatal = /步数|死循环|SyntaxError|InternalError/.test(why) || res.exitCode !== 0;
      return {
        index: index, ok: false, fatal: fatal ? (why || "运行没有跑通") : null,
        error: why ? lastLine(why) : "函数没有返回结果（检查有没有写 return，或者是不是死循环）",
        ms: took, memoryBytes: mem, gotText: null, detail: why
      };
    }
    var got;
    try { got = JSON.parse(gotText); }
    catch (e) {
      return { index: index, ok: false, error: "返回值不能比较：" + gotText, ms: took, memoryBytes: mem, gotText: gotText };
    }
    var ok = deepEq(got, test.expect);
    return {
      index: index, ok: ok, got: got, expect: test.expect,
      error: ok ? "" : "返回值与预期不一致", ms: took, memoryBytes: mem, gotText: gotText
    };
  }

  function lastLine(s) {
    var ls = String(s || "").replace(/\s+$/, "").split("\n");
    return ls.length ? ls[ls.length - 1] : "";
  }

  function run(problem, source, opts) {
    opts = opts || {};
    var tests = problem.tests || [];
    var n = opts.samplesOnly ? Math.min(problem.samples || 0, tests.length) : tests.length;
    var cases = [], fatal = null, totalMs = 0, maxMem = 0;
    for (var i = 0; i < n; i++) {
      var r = runCase(problem, source, tests[i], i);
      cases.push(r);
      totalMs += r.ms || 0;
      if (r.memoryBytes > maxMem) maxMem = r.memoryBytes;
      if (r.fatal) { fatal = r.fatal; break; }
    }
    var passedCount = cases.filter(function (c) { return c.ok; }).length;
    return {
      fatal: fatal,
      passed: !fatal && passedCount === n && n > 0,
      passedCount: passedCount,
      total: n,
      samplesOnly: !!opts.samplesOnly,
      cases: cases,
      ms: totalMs,
      memoryBytes: maxMem,
      memoryText: memoryText(maxMem)
    };
  }

  var api = {
    run: run, runCase: runCase, pyLit: pyLit, deepEq: deepEq,
    estimateBytes: estimateBytes, memoryText: memoryText
  };
  root.MIAO_ALGO_JUDGE = api;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
