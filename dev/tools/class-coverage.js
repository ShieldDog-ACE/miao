/* 喵站 · 类名覆盖率闸门：JS 里发出去的 class，CSS 里必须真有规则
 *
 * 为什么单独一把尺：这一轮查出来的「语法高光只剩 5 个色」不是颜色写错了，
 *   而是 highlight() 发 17 个 tk- 类、style.css 只定义了 5 个 —— 剩下 12 类静默
 *   退回默认字色，肉眼看着像「主题没配好」，theme-check 也看不见（它只查 :root
 *   外的硬编码色，不查类名对不对得上）。同类问题在终端行类上又出现一次
 *   （发 20 个，定义 6 个）。所以把「发了但没定义」做成一条能红的闸。
 *
 * 尺子的边界（故意不严）：
 *   · 只看带前缀的状态/语义类（tk- term- tb- hl- en- pp- sd- rs- ck- gt- st- tl- pt- po-），
 *     通用布局类（.btn .card …）不在这把尺的范围里；
 *   · JS 里拼出来的类名有截断风险，所以扫的是整份源码文本，不执行代码；
 *   · :hover / :focus 之类只在伪类里出现的类也算「有规则」。
 *
 * 跑法：node dev/tools/class-coverage.js            全量报告
 *       node dev/tools/class-coverage.js --quiet    只在有缺漏时退出 1（给 run.sh 用）
 */
const fs = require("fs");
const path = require("path");

const DEV = path.resolve(__dirname, "..");
const FRONT = path.join(DEV, "frontend");
const CSS_FILE = process.env.MIAO_CSS                            /* 自测用：换一份 CSS 喂给这把尺，验证它真的会红 */
  || path.join(FRONT, "assets", "css", "style.css");
const PREFIX = /^(tk|term|tb|hl|en|pp|sd|rs|ck|gt|st|tl|pt|po|uv|cg|rt|cr|nb|ms|ew|rd)-/;
const QUIET = process.argv.includes("--quiet");

const css = fs.readFileSync(CSS_FILE, "utf8");
/* CSS 里出现过的类名（含伪类/组合选择器里的），只取名字本身 */
const styled = new Set();
for (const m of css.matchAll(/\.([a-zA-Z][\w-]*)/g)) styled.add(m[1]);

/* JS 与 HTML 里发出去的类名：class="…" / className = "…" / classList.add|toggle|remove("…")
   外加 hlSpan("rd-kw", …) 这一种——正文高光是把类名当参数传的，不认它就扫不到 */
const EMIT_RE = /(?:class|className)\s*=\s*["']([^"']*)["']|classList\.(?:add|remove|toggle)\(\s*["']([^"']*)["']|class="([^"]*)"|hlSpan\(\s*["']([^"']*)["']/g;
function scan(dir, out) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) { if (f.name !== "node_modules") scan(p, out); continue; }
    if (!/\.(js|html)$/.test(f.name)) continue;
    if (/\/(data|vendor)\//.test(p)) continue;                 // 数据文件里的字符串不是界面类名
    const src = fs.readFileSync(p, "utf8");
    const found = new Set();
    for (const m of src.matchAll(EMIT_RE)) {
      const raw = (m[1] || m[2] || m[3] || m[4] || "").replace(/\$\{[^}]*\}/g, " ");
      raw.split(/\s+/).forEach(c => { if (PREFIX.test(c)) found.add(c); });
    }
    /* 拼类名时常见写法：'class="pt on" data-pt' 这类连着写的也一并抓到，靠白名单再筛一次 */
    if (found.size) out.push({ file: path.relative(DEV, p), names: [...found].sort() });
  }
  return out;
}

/* 白名单：确实还没规则的类，逐条写清为什么先挂着（照 theme-check 的规矩，没有理由的不许进）
   这几个都不是「色」的问题，补一条选择器就好，归第八轮 IDE 大修那一摊收掉；
   它们挂在这儿只允许变短，不允许变长。 */
const BASE = {
  "tb-file": "标题栏文件名，目前靠 .ide-titlebar 继承字色，读得出但没有 VS Code 那种强调",
  "tb-sep": "标题栏分隔符，同上，继承父级样式",
  "en-match": "英语勾线题容器，exam-en.js 正在被另一路改动重写",
  "en-tx": "同上：勾线题里左右两列的文字节点",
  "en-card-ph": "同上：英语卡片的占位类"
};

const rows = scan(FRONT, []);
const missing = [];
let total = 0;
for (const r of rows) {
  /* 抓类名的正则会连拼在一起的属性片段一起抓，出现「前缀后面什么都没有」的残片（tl-）
     不是类名，直接扔 —— 尺子先把自家误报清掉，不然下一个真漏会被淹在噪音里 */
  const real = r.names.filter(c => /^[a-z]+-[a-z0-9][\w-]*$/.test(c));
  const gap = real.filter(c => !styled.has(c) && !BASE[c]);
  total += real.length;
  if (gap.length) missing.push({ file: r.file, gap });
  /* 白名单不许烂在里面：已经有规则了还挂着，同样报出来 */
  const stale = r.names.filter(c => BASE[c] && styled.has(c));
  if (stale.length) console.log(`  ·  ${r.file} 白名单里的类已经有规则了，可以摘掉：${stale.join(" ")}`);
}

if (!QUIET || missing.length) {
  console.log(`类名覆盖率 · ${rows.length} 个界面文件，带前缀的类共 ${total} 个，缺规则 ${missing.reduce((a, m) => a + m.gap.length, 0)} 个（白名单里另有 ${Object.keys(BASE).length} 个）`);
  missing.forEach(m => console.log(`  ✘ ${m.file}\n      ${m.gap.join(" ")}`));
  if (!missing.length) console.log("全绿 ✔ JS 发出去的每一个类，style.css 里都找得到规则（白名单除外）。");
}
process.exit(missing.length ? 1 : 0);
