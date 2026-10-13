#!/usr/bin/env node
/* 喵站 · 正文代码高光自测（window.MIAO_HL）
 *   1) 无损：全部正文 t:"code" 块过高光后，剥掉 span 再反转义必须逐字等于原文
 *      （「复制」按钮取的是原始串，读者复制到的必须还是自己看到的那段代码）
 *   2) 不许静默掉兜底：除了 text（终端/图解，本来只染提示符），每个 lang 都必须
 *      命中 hlCode 的分发表；真出现陌生 lang 时在这里红，而不是在页面上悄悄没颜色
 *   3) 真上色：python / c++ / javascript / html / css / shell 六个主力语言
 *      在各自语料里至少产出过一个上色 span（分发表挂空名=全站悄悄灰掉，也要红）
 * 跑法：node dev/tests/hl-test.js（run.sh 里跟着全量一起跑）
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { JSDOM, VirtualConsole } = require("jsdom");

const ROOT = path.resolve(__dirname, "..");
const DATA = path.join(ROOT, "frontend", "assets", "data");
const VC = new VirtualConsole(); // app.js 的 init 在裸页面会摸不到导航栏节点，噪音收掉，只测 MIAO_HL

const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost/", virtualConsole: VC });
const ctx = vm.createContext(dom.window);

function load(file) {
  vm.runInContext(fs.readFileSync(file, "utf8"), ctx, { filename: file });
}

(function walkData(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walkData(p);
    else if (f.endsWith(".js")) load(p);
  }
})(DATA);
load(path.join(ROOT, "frontend", "assets", "js", "app.js"));

const HL = dom.window.MIAO_HL;
if (!HL) { console.log("FAIL  window.MIAO_HL 不存在（app.js 的自测钩子被挪走了？）"); process.exit(1); }

const unesc = (s) => s.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, (c) => ({ "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" }[c]));
const strip = (h) => unesc(h.replace(/<span class="[^"]*">/g, "").replace(/<\/span>/g, ""));

/* 与 app.js hlCode 的分发表一致；text 是有意「只染提示符」的那一档 */
const DISPATCH = new Set(["c++", "cpp", "shell", "sh", "bash", "powershell", "ps1", "python", "py",
  "javascript", "js", "html", "xml", "vue", "css", "scss", "less", "json", "yaml", "yml",
  "ini", "toml", "cfg", "text", "txt", "console"]);
const SPAN_LANGS = new Set(["python", "c++", "javascript", "html", "css", "shell"]);
const seen = {}; // lang -> 是否产出过上色 span

let total = 0, fails = 0;
function ok(name, cond, detail) {
  if (!cond) { fails++; console.log("FAIL  " + name + (detail ? " —— " + detail : "")); }
}

function scan(o, src) {
  if (!o || typeof o !== "object") return;
  if (Array.isArray(o)) { o.forEach((x) => scan(x, src)); return; }
  if (o.t === "code" && typeof o.code === "string") {
    total++;
    const lang = String(o.lang || "").toLowerCase();
    ok("lang 必须命中分发表（" + src + "）", DISPATCH.has(lang), "lang=" + JSON.stringify(o.lang) + " 现在会静默 esc 不上色");
    let h;
    try { h = HL.code(o.code, o.lang); } catch (e) { ok("高光不抛错（" + src + "）", false, e.message); return; }
    ok("高光无损（" + src + "）", strip(h) === o.code,
      JSON.stringify(o.code.slice(0, 60)) + " <> " + JSON.stringify(strip(h).slice(0, 60)));
    if (/<span/.test(h)) seen[lang] = true;
  }
  for (const k in o) scan(o[k], src);
}
for (const k of Object.keys(dom.window)) if (k.startsWith("MIAO_")) scan(dom.window[k], k);

for (const l of SPAN_LANGS) ok("主力语言 " + l + " 的语料里至少有一块真上了色", !!seen[l], "全语料零 span");

console.log("正文高光自测：" + total + " 个代码块 · " + (fails ? "FAIL " + fails : "全部通过 ✔"));
process.exit(fails ? 1 : 0);
