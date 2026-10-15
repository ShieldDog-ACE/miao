/* 喵站 · C++ 考卷产物打印器（一份序列化规矩，两个改造器共用）
 *
 * 为什么单独成一件：51 份题包产物只由脚本写、人不手改（任务书 D-82）。上一轮的
 * cpp-exam-single-track.cjs 与这一轮的 cpp-exam-ide.cjs 都要把对象序列化回同一套排版，
 * 复制两份必漂移 —— 所以搬到这里，两边 require。
 *
 * 排版口径（改了它，--check 的无损对拍就会红）：
 *   · 头部注释（第一段 /* … *\/）原样保留，其余按固定顺序重新序列化；
 *   · 一场卷：头部字段一行，questions 一题一行（长数组自己换行），selftest 一行一组；
 *   · 对象键不是标识符的（勾线题的配对键是整句中文）必须 JSON.stringify 包引号 ——
 *     裸写出来的产物跑不起来，上一轮就是这么把分部文件写坏的。
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const q = v => JSON.stringify(v);
const RESERVED = ["if", "else", "for", "while", "new", "class", "function", "return", "in", "do", "var", "typeof", "default", "case", "switch", "delete", "void", "null", "true", "false", "this", "catch", "throw", "try", "const", "let", "enum", "export", "extends", "import", "super", "yield", "async", "await", "break", "continue", "debugger", "finally", "instanceof", "static", "with"];
function keySrc(k) {
  if (/^[A-Za-z_$][\w$]*$/.test(k) && RESERVED.indexOf(k) < 0) return k;
  return JSON.stringify(k);
}
function objSrc(o, indent) {
  const keys = Object.keys(o).filter(k => o[k] !== undefined);
  return "{" + keys.map(k => keySrc(k) + ": " + valSrc(o[k], indent)).join(", ") + "}";
}
function valSrc(v, indent) {
  if (v === null || v === undefined) return "null";
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (typeof v === "string") return q(v);
  if (Array.isArray(v)) {
    if (v.every(x => ["number", "boolean", "string"].indexOf(typeof x) >= 0)) return "[" + v.map(x => valSrc(x, indent)).join(", ") + "]";
    const inner = v.map(x => " ".repeat(indent + 2) + objSrc(x, indent + 2)).join(",\n");
    return "[\n" + inner + "]";
  }
  if (typeof v === "object") {
    const keys = Object.keys(v).filter(k => v[k] !== undefined);
    return "{" + keys.map(k => keySrc(k) + ": " + valSrc(v[k], indent)).join(", ") + "}";
  }
  return String(v);
}

/* 一场卷的源码。字段顺序固定；selftest 的一行既可能是对象（卡片卷按题号给答案），
   也可能是整份代码字符串（单编辑器卷按 buffer 给答案）—— 两种都在这一个打印器里，
   别再分叉出第二个。 */
const PAPER_ORDER = ["cid", "kind", "mode", "authored", "file", "pass", "title", "task", "hint"];
const Q_ORDER = ["id", "type", "score", "coversTask", "stem", "code", "options", "answer", "answers",
  "accept", "acceptRegex", "acceptOn", "sample", "acceptLines", "steps", "left", "right", "matchAny", "why"];
function paperSrc(p) {
  const head = PAPER_ORDER.filter(k => p[k] !== undefined).map(k => k + ": " + valSrc(p[k], 4));
  const L = [];
  L.push("    {");
  L.push("      " + head.join(", ") + ",");
  if (p.notes !== undefined) L.push("      notes: " + valSrc(p.notes, 6) + ",");
  L.push("      questions: [");
  (p.questions || []).forEach((qq, i) => {
    const keys = Q_ORDER.filter(k => qq[k] !== undefined).concat(Object.keys(qq).filter(k => Q_ORDER.indexOf(k) < 0));
    const body = keys.map(k => k + ": " + valSrc(qq[k], 8)).join(", ");
    L.push("        { " + body + " }" + (i < p.questions.length - 1 ? "," : ""));
  });
  L.push("      ],");
  L.push("      selftest: {");
  const st = p.selftest || {};
  ["refs", "wrongs", "loose"].forEach((k, i, arr) => {
    if (!st[k]) return;
    const rows = st[k].map(a => " ".repeat(10) + (typeof a === "string" ? q(a) : objSrc(a, 10))).join(",\n");
    L.push("        " + k + ": [\n" + rows + "]" + (i < arr.length - 1 && st[arr[i + 1]] ? "," : ""));
  });
  L.push("      }");
  L.push("    },");
  return L;
}

function headerOf(text) {
  const m = text.match(/^[\s\S]*?\*\//);
  return m ? m[0] + "\n" : "";
}
function emit(key, papers, header) {
  const L = [];
  L.push(header.trimEnd());
  L.push("window." + key + " = {");
  L.push("  papers: [");
  papers.forEach(p => L.push(paperSrc(p).join("\n")));
  L.push("  ]");
  L.push("};");
  return L.join("\n") + "\n";
}

/* 读一份分部：跑进干净 vm，取回它挂上的那个包 */
function loadPart(file) {
  const ctx = { window: {}, console: { log: () => { }, error: () => { }, warn: () => { } } };
  ctx.self = ctx.window; ctx.globalThis = ctx.window;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(file, "utf8"), ctx, { filename: path.basename(file), timeout: 20000 });
  const key = Object.keys(ctx.window).find(k => /^MIAO_CPP(M)?_EXAM_P\d+$/.test(k));
  if (!key) throw new Error(path.basename(file) + " 里没找到 MIAO_CPP*_EXAM_PNN");
  return { key, papers: ctx.window[key].papers, header: headerOf(fs.readFileSync(file, "utf8")) };
}

module.exports = { q, keySrc, objSrc, valSrc, paperSrc, headerOf, emit, loadPart, PAPER_ORDER, Q_ORDER };
