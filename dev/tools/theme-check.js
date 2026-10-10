/* 喵站 · 主题闸门
 *
 * 为什么要这么一把尺子：上一轮加深色模式，是靠「哪块看着不对就补一条
 * :root[data-theme="dark"] .xxx」的方式一处一处打的，于是 .tip-box 的浅字浅底
 * 这种 1.60:1 的组合一路活到了现在，而且没人发现。加第三套配色之后，这种
 * 「某一套主题下破图」的组合只会被手工漏得更多。
 *
 * 三件事，一件比一件硬：
 *   1) 令牌完备性 —— CSS 里用到的每个 var(--x)，在当前三套主题下都要能解析出值；
 *      浅色块里定义过的**颜色类**令牌，深色与粉色块必须显式覆盖，不许漏（漏了就是
 *      深色里贴一块浅底，肉眼最容易看漏的那种）。
 *   2) 对比度 —— 八组关键「字/底」组合按 WCAG 相对亮度算，正文级 ≥4.5:1，
 *      弱文字与大号字 ≥3:1。半透明要先叠到实际底色上再算。
 *   3) 硬编码色 —— :root 块之外还直接写 #hex / rgb() 的地方列出来，给数量上限。
 *
 * 跑法：node dev/tools/theme-check.js [--verbose]
 * 退出码：0 绿；1 有红灯。
 */
const fs = require("fs");
const path = require("path");

const CSS = path.resolve(__dirname, "..", "frontend", "assets", "css", "style.css");
const VERBOSE = process.argv.includes("--verbose");

/* 主题块：选择器原文 → 主题名。粉色是这一轮新加的，之前只有 light/dark。 */
const THEMES = ["light", "dark", "pink"];
const BLOCK = {
  light: ":root",
  dark: ':root[data-theme="dark"]',
  pink: ':root[data-theme="pink"]',
};

/* 浅色块里的颜色令牌，允许深色/粉色不覆盖的白名单 —— 每条都要写理由，
   不写理由的白名单等于把闸门自己拆了。 */
const INHERIT_OK = {
  "--green": "语义绿（已完成）三套同值，跟底色的对比靠 --green-soft 那层",
};

/* 八组字/底组合。label 是给他人看的，fg/bg 是令牌名，min 是达标线。 */
const PAIRS = [
  { label: "正文 / 页面底", fg: "--text", bg: "--bg", min: 4.5 },
  { label: "次要文字 / 页面底", fg: "--text-2", bg: "--bg", min: 4.5 },
  { label: "弱文字 / 页面底", fg: "--text-3", bg: "--bg", min: 3.0 },
  { label: "主按钮字 / 主按钮底", fg: "--accent-contrast", bg: "--accent", min: 4.5 },
  /* hover 态单独一组：上一版浅色把 hover 定成「更亮的 --accent-2」，白字当场掉到 3.27:1 ——
     静态默认态达标、一 hover 就不达标，是最容易漏的一类 */
  { label: "主按钮字 / hover 底", fg: "--accent-contrast", bg: "--accent-hover", min: 4.5 },
  { label: "链接 / 页面底", fg: "--link", bg: "--bg", min: 4.5 },
  { label: "提示框字 / 提示框底", fg: "--tip-text", bg: "--tip-bg", min: 4.5 },
  { label: "代码块字 / 代码块底", fg: "--text", bg: "--code-bg", min: 4.5 },
  { label: "徽章字 / 徽章底", fg: "--accent-ink", bg: "--accent-soft", min: 4.5 },
  { label: "正文文字 / 卡片底", fg: "--text", bg: "--panel", min: 4.5 },
  { label: "考场编辑器字 / 考场底", fg: "--ide-var", bg: "--ide-bg", min: 4.5 },
  { label: "考场注释字 / 考场底", fg: "--ide-com", bg: "--ide-bg", min: 3.0 },
  { label: "考场字符串字 / 考场底", fg: "--ide-str", bg: "--ide-bg", min: 4.5 },
];

/* ---------- CSS 解析：只要「选择器 → 声明块」这一层，够用了 ---------- */
function parseBlocks(css) {
  const blocks = [];
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf("{", i);
    if (open < 0) break;
    const sel = css.slice(i, open).replace(/\/\*[\s\S]*?\*\//g, "").trim();
    let depth = 0, end = open;
    for (; end < css.length; end++) {
      if (css[end] === "{") depth++;
      else if (css[end] === "}") { depth--; if (!depth) break; }
    }
    const body = css.slice(open + 1, end);
    if (sel && !sel.startsWith("@")) blocks.push({ sel, body, line: css.slice(0, open).split("\n").length });
    else if (sel.startsWith("@media") || sel.startsWith("@keyframes")) blocks.push({ sel, body, line: 0, nest: true });
    i = end + 1;
  }
  return blocks;
}

function decls(body) {
  const out = {};
  const stripped = body.replace(/\/\*[\s\S]*?\*\//g, "");
  const re = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(stripped))) out[m[1]] = m[2].trim();
  return out;
}

function isColor(v) {
  return /#[0-9a-fA-F]{3,8}\b|rgba?\(/.test(v);
}

/* 令牌值允许 var(--x) 间接引用（--tip-bg: var(--accent-soft) 就是这么写的），
   算对比度前先把它解析成颜色，不然一律「解析不了」。 */
function resolve(map, v, depth) {
  depth = depth || 0;
  let out = String(v).trim();
  const re = /var\((--[\w-]+)(?:\s*,\s*([^()]*))?\)/;
  let m;
  while (depth++ < 8 && (m = re.exec(out))) {
    const next = (m[1] in map) ? resolve(map, map[m[1]], depth) : (m[2] || "").trim();
    if (!next) break;
    out = out.slice(0, m.index) + next + out.slice(m.index + m[0].length);
  }
  return out;
}

/* ---------- 颜色数学 ---------- */
function toRGB(c) {
  if (Array.isArray(c)) return c;
  const s = String(c).trim();
  if (s[0] === "#") {
    let h = s.slice(1);
    if (h.length === 3) h = h.split("").map(x => x + x).join("");
    if (h.length === 8) h = h.slice(0, 6);
    if (h.length !== 6 || /[^0-9a-fA-F]/.test(h)) throw new Error("解析不了的颜色: " + c);
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (!m) throw new Error("解析不了的颜色: " + c);
  const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
  return [p[0], p[1], p[2]];
}
function alpha(c) {
  const s = String(c).trim();
  const m = s.match(/rgba\([^,]+,[^,]+,[^,]+[,\s/]+([\d.]+%?)\s*\)/);
  if (m) return m[1].endsWith("%") ? parseFloat(m[1]) / 100 : parseFloat(m[1]);
  if (s[0] === "#" && s.length === 9) return parseInt(s.slice(7, 9), 16) / 255;
  return 1;
}
function over(fg, bg) {
  const a = alpha(fg);
  if (a >= 1) return toRGB(fg);
  const [r, g, b] = toRGB(fg), [br, bg2, bb] = toRGB(bg);
  return [r * a + br * (1 - a), g * a + bg2 * (1 - a), b * a + bb * (1 - a)];
}
function lum(rgb) {
  const f = v => { v = Math.max(0, Math.min(255, v)) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
}
function contrast(fg, bg) {
  const l1 = lum(fg), l2 = lum(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/* ---------- 主流程 ---------- */
const css = fs.readFileSync(CSS, "utf8");
const blocks = parseBlocks(css);
const tokens = {};
for (const t of THEMES) tokens[t] = {};
for (const b of blocks) {
  for (const t of THEMES) {
    if (b.sel === BLOCK[t]) Object.assign(tokens[t], decls(b.body));
  }
}

const problems = [];
const warn = (area, msg) => problems.push({ area, msg });

/* 深色与粉色块是**叠加**在 :root 上的（CSS 自定义属性照层叠走，没覆盖的沿用浅色值），
   所以解析 var() 时要用「浅色 ∪ 本主题」这张合成表，不是只看本主题块。
   另外在普通规则里就地声明的自定义属性（如 .ide{--ide-fs:15px}）不属于主题令牌，
   单独收集起来豁免。 */
const effective = {};
for (const t of THEMES) effective[t] = Object.assign({}, tokens.light, tokens[t]);
const localProps = new Set();
for (const b of blocks) {
  if (Object.values(BLOCK).includes(b.sel)) continue;
  let lm;
  const lre = /(--[\w-]+)\s*:/g;
  while ((lm = lre.exec(b.body))) localProps.add(lm[1]);
}

/* 1) 三套主题块都得存在，且颜色令牌数量对得上 */
const lightColors = Object.keys(tokens.light).filter(k => isColor(tokens.light[k]));
for (const t of THEMES) {
  if (!Object.keys(tokens[t]).length) { warn("令牌完备性", `主题块 ${BLOCK[t]} 一个令牌都没有（CSS 里缺这一套）`); continue; }
  if (t === "light") continue;
  const missing = lightColors.filter(k => !(k in tokens[t]) && !(k in INHERIT_OK));
  if (missing.length)
    warn("令牌完备性", `${t} 没覆盖浅色的 ${missing.length} 个颜色令牌：${missing.join(", ")} —— 这些位置在该主题下会贴一块浅底`);
  const extra = Object.keys(tokens[t]).filter(k => isColor(tokens[t][k]) && !(k in tokens.light));
  if (extra.length) warn("令牌完备性", `${t} 定义了浅色没有的颜色令牌：${extra.join(", ")}`);
}

/* 2) 每个 var(--x) 引用都要能解析出值 */
const refs = new Set();
let rm;
const refRe = /var\((--[\w-]+)(\s*,\s*([^)]*))?\)/g;
const cssNoComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
while ((rm = refRe.exec(cssNoComments))) refs.add(rm[1]);
for (const t of THEMES) {
  const undef = [...refs].filter(k => !(k in effective[t]) && !localProps.has(k) && !isColorVarFallback(cssNoComments, k));
  if (undef.length) warn("令牌完备性", `${t} 下 var(${undef.slice(0, 6).join(") / var(")}) 解析不到值`);
}
function isColorVarFallback(src, key) {
  return new RegExp("var\\(" + key.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") + "\\s*,\\s*(#[0-9a-fA-F]{3,8}|rgba?\\()").test(src);
}

/* 3) 对比度 */
const rows = [];
for (const t of THEMES) {
  if (!Object.keys(tokens[t]).length) continue;
  for (const p of PAIRS) {
    const fv = effective[t][p.fg], bv = effective[t][p.bg];
    if (!fv || !bv) {
      const miss = [!fv && p.fg, !bv && p.bg].filter(Boolean).join(" / ");
      warn("对比度", `${t} 缺令牌 ${miss}（${p.label} 这一组算不了）`);
      continue;
    }
    let base;
    try {
      const fvR = resolve(effective[t], fv), bvR = resolve(effective[t], bv);
      base = toRGB(bvR);
      const bAlpha = alpha(bvR);
      if (bAlpha < 1 && effective[t]["--bg"]) base = over(bvR, toRGB(resolve(effective[t], effective[t]["--bg"])));
      const fg = over(fvR, base);
      const r = contrast(fg, base);
      rows.push({ theme: t, label: p.label, ratio: r, min: p.min, ok: r >= p.min });
      if (r < p.min) warn("对比度", `${t} · ${p.label} ${r.toFixed(2)}:1 < ${p.min}:1（${fv} → ${fvR} on ${bvR}）`);
    } catch (e) { warn("对比度", `${t} · ${p.label} 算不了：${e.message}`); }
  }
}

/* 4) :root 块之外的硬编码色 */
const hard = [];
for (const b of blocks) {
  if (Object.values(BLOCK).includes(b.sel)) continue;
  const src = b.body.replace(/\/\*[\s\S]*?\*\//g, "");
  const seen = new Set();
  const re = /:\s*[^;{}]*?(#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\))/g;
  let m2;
  while ((m2 = re.exec(src))) {
    const decl = src.slice(0, m2.index).split(";").pop().trim();
    if (seen.has(decl)) continue;
    seen.add(decl);
    hard.push({ sel: b.sel, line: b.line, decl: decl.slice(0, 60) });
  }
}
const HARD_LIMIT = Number(process.env.MIAO_HARD_COLOR_LIMIT || 0);
if (hard.length > HARD_LIMIT)
  warn("硬编码色", `:root 之外还有 ${hard.length} 处直接写颜色（上限 ${HARD_LIMIT}），主题一改它们就掉队`);

/* ---------- 报告 ---------- */
console.log("喵站主题闸门 · " + path.relative(path.resolve(__dirname, "..", ".."), CSS));
console.log("主题：" + THEMES.map(t => `${t}(${Object.keys(tokens[t]).length} 令牌)`).join("  "));
if (VERBOSE) {
  const byTheme = {};
  for (const r of rows) (byTheme[r.theme] = byTheme[r.theme] || []).push(r);
  for (const t of THEMES) {
    if (!byTheme[t]) continue;
    console.log(`\n—— ${t} ——`);
    for (const r of byTheme[t].sort((a, b) => a.ratio - b.ratio))
      console.log("  " + (r.ok ? "✔ " : "✘ ") + r.label.padEnd(22) + r.ratio.toFixed(2) + ":1  (≥" + r.min + ")");
  }
  if (hard.length) {
    console.log(`\n—— :root 外的硬编码色 ${hard.length} 处 ——`);
    for (const h of hard) console.log(`  ${String(h.line).padStart(4)}  ${h.sel.slice(0, 30).padEnd(32)} ${h.decl}`);
  }
}

if (problems.length) {
  console.log("\n红灯 " + problems.length + " 项：");
  for (const p of problems) console.log(`  [${p.area}] ${p.msg}`);
  console.log("\n（加 --verbose 看每组对比度的具体数字）");
  process.exit(1);
}
const worst = rows.slice().sort((a, b) => a.ratio - b.ratio)[0];
console.log(`\n全绿 ✔ ${rows.length} 组字/底组合达标（最低 ${worst.ratio.toFixed(2)}:1 · ${worst.theme} · ${worst.label}），` +
  `:root 外硬编码色 ${hard.length} 处。`);
