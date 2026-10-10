/* 喵站 · 微软四门课自检（只管这一摊，不碰别人的红灯）
 *
 * 全量回归 dev/tests/run.sh 现在被别的改动弄红了（考试 IDE 在重做中），
 * 拿它当微软课程的闸会分不清是谁的锅。这一份只查四门 MIT 课，跑一条命令出结论。
 *
 * 跑法：node dev/tools/ms-check.js            # 全查
 *      node dev/tools/ms-check.js ml webdev  # 只查指定课程
 *
 * 查什么：
 *   1 语法    每个正文文件 node --check 要过
 *   2 齐课    95 课一课不缺（genai 22 / ml 27 / webdev 27 / agents 19）
 *   3 口径    ≤25 块、正文（不含 code 与 svg）≤1,800 字、单段 code ≤12 行
 *   4 图形化  每课至少一个 t:'svg' 块，且 SVG 里没有 script/onclick/href/animate
 *   5 禁词    「椰子蛋」「管理」0 次；内容里 0 个反引号、0 个 ${
 *   6 授权    挂载后每章第一块必须带出处（含「译自」或「MIT」或「原文」）
 *   7 引用    「第 N 课」只许往回指
 */
const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const DEV = path.resolve(__dirname, "..");
const DIR = path.join(DEV, "frontend", "assets", "data", "ms");
const WANT = { genai: 22, ml: 27, webdev: 27, agents: 19 };

function main() {
  const only = process.argv.slice(2);
  const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter(function (f) { return f.endsWith(".js"); }) : [];
  const problems = [];

  /* 1 语法 */
  files.forEach(function (f) {
    try { cp.execFileSync(process.execPath, ["--check", path.join(DIR, f)], { stdio: "pipe" }); }
    catch (e) { problems.push("语法 " + f + " → " + String(e.stderr || e.message).split("\n").find(function (l) { return /Error/.test(l); })); }
  });

  /* 载入全部正文 + 骨架，走一遍真实挂载 */
  global.window = global;
  require(path.join(DEV, "frontend", "assets", "data", "ms-data.js"));
  files.forEach(function (f) { try { require(path.join(DIR, f)); } catch (e) {} });
  require(path.join(DEV, "frontend", "assets", "data", "ms-bodies.js"));
  const body = global.MIAO_MS_BODY || {};

  const bad = { miss: [], over: [], noSvg: [], word: [], quote: [], noSrc: [], fwd: [] };
  const perCourse = {};
  Object.keys(WANT).forEach(function (c) { if (only.length && only.indexOf(c) < 0) return; perCourse[c] = 0; });

  Object.keys(WANT).forEach(function (c) {
    if (!only.length || only.indexOf(c) >= 0) {
      for (let i = 1; i <= WANT[c]; i++) {
        const id = c + "-c" + String(i).padStart(2, "0");
        const bl = body[id];
        if (!bl || !bl.length) { bad.miss.push(id); continue; }
        perCourse[c]++;
        const prose = bl.filter(function (x) { return x.t !== "code" && x.t !== "svg"; })
          .reduce(function (s, y) { return s + ((y.text || "") + ((y.items || []).join(""))).length; }, 0);
        const mx = Math.max.apply(null, bl.filter(function (x) { return x.t === "code"; })
          .map(function (x) { return String(x.code || "").split("\n").length; }).concat([0]));
        if (bl.length > 25 || prose > 1800 || mx > 12) bad.over.push(id + "(" + bl.length + "块/" + prose + "字/" + mx + "行)");
        const svgs = bl.filter(function (x) { return x.t === "svg"; });
        if (!svgs.length) bad.noSvg.push(id);
        svgs.forEach(function (s) { if (/<script|onclick|href|<animate/i.test(String(s.code || ""))) bad.noSvg.push(id + " 的 svg 里有被剥的标签"); });
        const j = JSON.stringify(bl);
        if (/椰子蛋|管理/.test(j)) bad.word.push(id);
        if (j.indexOf("`") >= 0 || j.indexOf("${") >= 0) bad.quote.push(id);
        if (!/第\s*(\d+)\s*课/.test(j) || true) {
          const no = i;
          let m; const re = /第\s*(\d+)\s*课/g;
          while ((m = re.exec(j))) { if (+m[1] > no) { bad.fwd.push(id + " → 第" + m[1] + "课"); break; } }
        }
      }
    }
  });

  /* 6 挂载后出处块 */
  (global.MIAO_MS || []).forEach(function (p) {
    if (only.length && only.indexOf(p.tutorial.id) < 0) return;
    p.tutorial.chapters.forEach(function (ch) {
      if (!body[ch.id]) return;                       /* 没正文的章本来就还是占位，另算 */
      const first = JSON.stringify(ch.blocks[0] || {});
      if (!/译自|MIT|原文/.test(first)) bad.noSrc.push(ch.id);
    });
  });

  const total = Object.keys(WANT).reduce(function (s, c) { return s + WANT[c]; }, 0);
  const filled = Object.values(perCourse).reduce(function (s, n) { return s + n; }, 0);
  console.log("微软课程自检" + (only.length ? "（" + only.join(",") + "）" : "") + "：已填 " + filled + " / " + total + " 课");
  Object.keys(WANT).forEach(function (c) { if (perCourse[c] != null) console.log("  " + c.padEnd(8), perCourse[c] + " / " + WANT[c]); });
  const groups = [["缺课", bad.miss], ["超口径", bad.over], ["缺图形化演示", bad.noSvg], ["禁词", bad.word], ["反引号或${", bad.quote], ["挂载后缺出处块", bad.noSrc], ["前向引用", bad.fwd]];
  let n = problems.length;
  groups.forEach(function (g) { n += g[1].length; console.log("  " + g[0].padEnd(14), g[1].length ? g[1].length + " 处：" + g[1].slice(0, 10).join(" ") : "0"); });
  if (problems.length) problems.slice(0, 8).forEach(function (p) { console.log("   ! " + p); });
  console.log(n ? "\n问题 " + n + " 处 ✘" : "\n四门课全部齐课、合规、带演示、带出处 ✔");
  process.exit(n ? 1 : 0);
}
main();
