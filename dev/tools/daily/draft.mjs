/* 喵站日更 · 本地模型起草一章（不出网）
 *
 * 干什么：把「这一章该讲什么 + 站内写作规矩」交给本机模型，拿回一份结构化草稿，
 * 先过本地的形状校验，再（可选）丢给 cpp-audit 那把真尺子。
 *
 * 明确不做的事：**不写站点数据、不改 index.js、不碰 site.js**。
 * 草稿落在 dev/tools/daily/out/ 里，人工看过、改过、并且过了闸，才允许手抄进
 * frontend/assets/data/<课>/pNN.js。理由写在 dev/日更.md：本地模型出的字没资格直接上线。
 *
 * 用法：
 *   node dev/tools/daily/draft.mjs --course cppm --chapter m173 --model qwen3.8-27b
 *   node dev/tools/daily/draft.mjs --course cppm --chapter m173 --model glm-4.6v-flash --audit
 *   node dev/tools/daily/draft.mjs --list          # 只列出这门课里还空着的章
 *
 * 退出码：0 = 草稿拿到且形状合规（--audit 时还要求闸也过）；1 = 不合规；2 = 用法错。
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
import { chat } from "./llm.mjs";

const ROOT = path.resolve(import.meta.dirname, "../..");          // dev/
const FRONT = path.join(ROOT, "frontend");
const DATA = path.join(FRONT, "assets/data");
const OUT = path.join(import.meta.dirname, "out");

const argv = process.argv.slice(2);
const get = (k, d) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : d);
const course = get("--course", "cppm");
const chapterId = get("--chapter", null);
const model = get("--model", "qwen3.8-27b");
const useAudit = argv.includes("--audit");
const wantList = argv.includes("--list");

/* ---------- 1. 读真数据：把分部脚本跑在沙箱里，拿装配后的整门课 ---------- */
function loadCourse(id) {
  const spec = {
    cppm: { dir: "cppm", assembly: "cppm-data.js", pkg: "MIAO_CPPM_P" },
    cpp: { dir: "cpp", assembly: "cpp-data.js", pkg: "MIAO_CPP_P" },
  }[id];
  if (!spec) throw new Error("只认 cpp / cppm，收到：" + id);
  const sandbox = { window: {}, console: { log() {}, error() {}, warn() {} } };
  sandbox.window.window = sandbox.window;
  const ctx = vm.createContext(sandbox);
  const dir = path.join(DATA, spec.dir);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".js")).sort()
    .map((f) => path.join(dir, f));
  files.push(path.join(DATA, spec.assembly));
  for (const f of files) vm.runInContext(fs.readFileSync(f, "utf8"), ctx, { filename: f });
  const asm = Object.keys(sandbox.window).find((k) => /_ASSEMBLE$/.test(k) && k.includes(id.toUpperCase()));
  if (asm && typeof sandbox.window[asm] === "function") sandbox.window[asm]();
  const key = Object.keys(sandbox.window).find((k) => /^MIAO_(CPPM|CPP)$/.test(k));
  if (!key) throw new Error("装配后没拿到 MIAO_CPPM / MIAO_CPP");
  return sandbox.window[key].tutorial;
}

const tutorial = loadCourse(course);
const chapters = tutorial.chapters || [];
const isPlaceholder = (c) => /正文还在写/.test(((c.blocks || [])[0] || {}).text || "");

if (wantList) {
  const ph = chapters.filter(isPlaceholder);
  console.log(`[${tutorial.title}] 共 ${chapters.length} 章，占位 ${ph.length} 章：`);
  ph.forEach((c) => console.log("  " + c.id + "  " + c.title));
  process.exit(0);
}
if (!chapterId) {
  console.error("缺 --chapter（或者用 --list 看还有哪些章空着）");
  process.exit(2);
}

const ch = chapters.find((c) => c.id === chapterId);
if (!ch) {
  console.error("这门课里没有这一章：" + chapterId);
  process.exit(2);
}

/* 源稿任务清单：占位章的第一个 ul 就是它（写稿摊子把源稿任务原样放在那） */
const tasks = ((ch.blocks || []).find((b) => b.t === "ul") || {}).items || [];
const num = Number(String(ch.id).replace(/[^\d]/g, ""));

/* ---------- 2. 写提示词：规矩全从站内文件里来，不另立一套 ---------- */
const SYSTEM = `你是「喵站」的技术教程作者，写中文教程正文。硬规矩（违反任何一条，这份稿子作废）：
1. 正文里不许出现反引号（那个字符本身），代码名直接写，或者用「」括起来。
2. 只有三种行内标记可用：**加粗**、链接、第 N 课这种编号引用。
3. 交叉引用只许往回指：提到「第 N 课」时 N 必须小于等于本章课号 ${num}，不许指向后面的课。
4. 每章 1000 到 1600 字中文（不含代码），块数不超过 25。
5. 代码块只放能编译/能跑的完整片段，单段不超过 12 行；长演示拆成两块；C++ 用 C++23 写法，要带 #include。
6. 每章结构固定：先一个 tip 块写本节目标，再 h2 原理讲解 + 若干 p，然后 h2 演示 + code，
   然后 h2 常见坑 + ul，然后 h2 任务 + ul，最后一个 tip 写一句话总结。
7. 「任务」栏必须逐条复述源稿任务，保留里面出现的具体数字、变量名、函数名（比如把 8 换成 4、d1 用 r+c），
   每条的措辞可以顺一遍，但不能丢信息 —— 站内的机器闸会逐条比对。
8. 单个代码块不超过 12 行：长演示拆成两块，或者只给关键那一段。
9. 只输出一个 JSON 对象，不要解释、不要 Markdown 代码围栏。`;

const USER = `课程：${tutorial.title}
本章：第 ${num} 课（id ${ch.id}）
标题（可微调，保持课号与主题不变）：${ch.title}
源稿要求覆盖的任务（正文的「任务」栏必须逐条对上，措辞可改但不能丢）：
${tasks.length ? tasks.map((t, i) => `${i + 1}. ${t}`).join("\n") : "（源稿没给任务，自己按本章主题出两条可验证的任务）"}

输出 JSON 形状（严格按这个）：
{"id":"${ch.id}","title":"第 ${num} 课 · <标题>","blocks":[
 {"t":"tip","color":"blue","text":"..."},
 {"t":"h2","text":"原理讲解"},
 {"t":"p","text":"..."},
 {"t":"code","lang":"cpp","code":"..."},
 {"t":"ul","items":["...","..."]},
 {"t":"tip","color":"green","text":"..."}]}`;

/* ---------- 3. 准备输出目录与计时 ---------- */
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
const t0 = Date.now();
console.log(`[draft] ${tutorial.title} · ${ch.id} · 模型 ${model} · 任务 ${tasks.length} 条`);

/* ---------- 4. 本地形状校验：过了才配去见真尺子 ---------- */
function parseDraft(text) {
  const rawText = text.replace(/^\s*```(?:json)?/i, "").replace(/```\s*$/, "").trim();
  try { return JSON.parse(rawText); }
  catch {
    const a = rawText.indexOf("{"), b = rawText.lastIndexOf("}");
    if (a >= 0 && b > a) { try { return JSON.parse(rawText.slice(a, b + 1)); } catch { /* 留空 */ } }
  }
  return null;
}

const ALLOWED = new Set(["p", "h2", "tip", "ul", "code", "svg"]);

function validate(draft) {
  const errors = [];
  if (!draft) return ["不是合法 JSON"];
  if (draft.id !== ch.id) errors.push(`id 不是 ${ch.id}（拿到 ${draft.id}）`);
  if (!Array.isArray(draft.blocks) || !draft.blocks.length) return errors.concat("blocks 不是非空数组");
  const texts = [];
  for (const [i, b] of draft.blocks.entries()) {
    if (!ALLOWED.has(b.t)) errors.push(`第 ${i} 块类型不认识：${b.t}`);
    if (b.t === "code") {
      const lines = String(b.code || "").split("\n").length;
      if (lines > 14) errors.push(`第 ${i} 块代码 ${lines} 行超过 14 行`);
    } else {
      const s = b.t === "ul" ? (b.items || []).join("\n") : String(b.text || "");
      if (s.includes("`")) errors.push(`第 ${i} 块出现反引号`);
      texts.push(s);
    }
  }
  const body = texts.join("\n");
  const chars = body.replace(/\s/g, "").length;
  if (chars < 600) errors.push(`正文只有 ${chars} 字，少于 600`);
  if (chars > 2800) errors.push(`正文 ${chars} 字，超过站内口径 2800`);
  const refs = [...body.matchAll(/第\s*(\d+)\s*课/g)].map((m) => Number(m[1]));
  const forward = refs.filter((n) => n > num);
  if (forward.length) errors.push(`前向引用：第 ${forward.join("、")} 课在本章（第 ${num} 课）之后`);
  if (draft.blocks.filter((b) => b.t === "code").length === 0) errors.push("一个代码块都没有（cppm 的章至少一段代码）");
  /* 任务对账：源稿每条任务里的数字/标识符必须能在「任务」栏里找到 */
  if (tasks.length) {
    const taskSection = draft.blocks.filter((b) => b.t === "ul").map((b) => (b.items || []).join(" ")).join(" ");
    tasks.forEach((t, i) => {
      const tokens = String(t).match(/[A-Za-z_][\w.]*|\d+/g) || [];
      const missing = tokens.filter((k) => !taskSection.includes(k));
      if (missing.length > Math.max(1, Math.floor(tokens.length / 2)))
        errors.push(`第 ${i + 1} 条源稿任务没被复述（缺 ${missing.slice(0, 6).join("、")}）`);
    });
  }
  return errors;
}

/* ---------- 5. 问模型；不合规就把问题回灌，返修 --retry 轮 ---------- */
const opts = {
  model, numPredict: 4096, temperature: 0.4, json: true, think: false, timeoutMs: 1800000,
};
let chatMessages = [{ role: "system", content: SYSTEM }, { role: "user", content: USER }];
let r = await chat({ ...opts, messages: chatMessages });
let draft = parseDraft(r.text);
let errors = validate(draft);
const maxRetry = Number(get("--retry", "1"));
for (let round = 1; errors.length && round <= maxRetry; round++) {
  console.log(`[draft] 第 ${round} 轮返修（${errors.length} 条问题回灌）`);
  chatMessages = [
    chatMessages[0],
    { role: "user", content: USER },
    { role: "assistant", content: r.text },
    { role: "user", content: "你上一版有这些问题，逐条改掉，然后重新输出完整 JSON（不要只给补丁）：\n" +
      errors.map((e) => "- " + e).join("\n") },
  ];
  r = await chat({ ...opts, messages: chatMessages });
  draft = parseDraft(r.text);
  errors = validate(draft);
}
const wall = Math.round((Date.now() - t0) / 100) / 10;
console.log(`[draft] 总耗时 ${wall}s · 最后一轮 ${r.tokPerSec ?? "?"} tok/s`);

const base = path.join(OUT, `${course}-${ch.id}`);
fs.writeFileSync(base + ".prompt.txt", SYSTEM + "\n\n---\n\n" + USER + "\n");
fs.writeFileSync(base + ".raw.txt", r.text + "\n");
if (draft) {
  fs.writeFileSync(base + ".json", JSON.stringify(draft, null, 2) + "\n");
  /* 顺手拼一份能被 cpp-audit 直接读的分部（只落在 out/，不进站点） */
  const pkg = course === "cppm" ? "MIAO_CPPM_P99" : "MIAO_CPP_P99";
  fs.writeFileSync(base + ".part.js",
    `window.${pkg} = { chapters: [${JSON.stringify(draft, null, 2)}] };\n`);
}

console.log(errors.length ? "[draft] 形状不合规：" : "[draft] 形状合规");
errors.forEach((e) => console.log("  ✘ " + e));
console.log(`[draft] 产物：${path.relative(ROOT, base)}.{prompt.txt,raw.txt,json,part.js}`);

/* ---------- 6. 真尺子：cpp-audit 直接判这份草稿 ---------- */
let auditOk = true;
if (useAudit && draft) {
  const part = base + ".part.js";
  try {
    const out = execFileSync(process.execPath, [path.join(ROOT, "tools/cpp-audit.cjs"), "--part", part],
      { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    console.log("[audit] cpp-audit 通过\n" + out.trim());
  } catch (e) {
    auditOk = false;
    console.log("[audit] cpp-audit 没过：\n" + String(e.stdout || "").trim());
  }
}

process.exit(errors.length === 0 && auditOk ? 0 : 1);
