/* 喵站 · 微软 MIT 课程生成器（第四轮：把「只需要保留版权与许可」的内容拿进来）
 *
 * 来源与授权（实测，2026-10-06）：
 *   microsoft/generative-ai-for-beginners  22 个课次目录  LICENSE = MIT  star 121k
 *   microsoft/ai-agents-for-beginners      19 个课次目录  LICENSE = MIT  star 76k
 *   microsoft/ml-for-beginners / Web-Dev-For-Beginners 目录命名不同，本脚本先跳过（见 --todo）
 * MIT 的唯一硬要求是**保留版权声明与许可文本**，所以：
 *   1) 每章第一块 tip 写明译自哪门课、原作者、许可证、原文地址；
 *   2) 仓库里存一份 dev/frontend/assets/data/ms-LICENSE-MIT.txt（原文照抄，不改一字）；
 *   3) 教程 author 字段带出处，不用「喵站官方」。
 *
 * 跑法：node dev/tools/ms-gen.js            # 抓 + 产出 + 自校验
 *      node dev/tools/ms-gen.js --check-only
 */
const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const DEV = path.resolve(__dirname, "..");
const DATA = path.join(DEV, "frontend", "assets", "data");
const IMG = path.join(DEV, "frontend", "assets", "img", "covers");
const ZH = require("./ms-titles-zh.js");   /* 95 条中文标题，按源目录名查 */
const CHECK_ONLY = process.argv.includes("--check-only");

const COURSES = [
  { id: "genai", repo: "microsoft/generative-ai-for-beginners", zh: "生成式 AI 入门", cat: "大模型",
    intro: "微软官方写的 22 课生成式 AI 入门课，MIT 授权、本站译成中文。从「大模型到底在干什么」讲起，一路到提示工程、向量与 RAG、微调、Agent、元提示、设计原则与落地应用。每课自带可跑的 notebook 与代码。",
    tags: ["AI", "大模型", "提示工程", "RAG"], diff: "入门", tint: "#6a4c93" },
  { id: "ml", repo: "microsoft/ml-for-beginners", zh: "机器学习入门", cat: "大模型",
    intro: "微软官方 9 组 · 每组 3 课的机器学习入门，MIT 授权、本站译成中文。从回归、分类、聚类一路做到 NLP、时间序列与强化学习，每组都带可跑的 notebook，还专门有一组讲真实项目里怎么落地。",
    tags: ["机器学习", "回归", "分类", "聚类", "NLP"], diff: "入门", tint: "#2f6f8f", mode: "nested" },
  { id: "webdev", repo: "microsoft/Web-Dev-For-Beginners", zh: "Web 开发入门", cat: "计算机基础",
    intro: "微软官方 10 组 · 每组 2–3 课的 Web 开发入门，MIT 授权、本站译成中文。HTML/CSS/JS 打底，后面连着做打字小游戏、浏览器扩展、太空游戏、银行页面、代码编辑器，最后一组是接大模型的旅行生成器项目。",
    tags: ["HTML", "CSS", "JavaScript", "前端"], diff: "入门", tint: "#c0563a", mode: "nested" },
  { id: "agents", repo: "microsoft/ai-agents-for-beginners", zh: "AI Agent 入门", cat: "Agent",
    intro: "微软官方 19 课 AI Agent 入门，MIT 授权、本站译成中文。讲清 agent 与普通对话的区别、任务描述与规划、对话方式、信任来源、知识检索、多 agent 协作、工作流、可观测性，最后一课是真实的旅行规划 agent，末尾还有一课专门讲 agent 的安全。",
    tags: ["AI", "Agent", "多智能体", "工作流"], diff: "入门", tint: "#1b7f79" }
];

/* 目录清单缓存：GitHub 匿名接口 60 次/小时，跑满就 403。
   抓到就存 tools/ms-dirs.json，抓不到就退回缓存 —— 没有缓存且抓不到时报错，绝不写残缺产物 */
const DIRS_CACHE = path.join(__dirname, "ms-dirs.json");
function loadCache() { try { return JSON.parse(fs.readFileSync(DIRS_CACHE, "utf8")); } catch (e) { return {}; } }
function saveCache(c) { try { fs.writeFileSync(DIRS_CACHE, JSON.stringify(c, null, 1)); } catch (e) {} }

function getJSON(url) {
  const out = cp.execFileSync("curl", ["-4", "-sL", "--fail", "--max-time", "60", url], { maxBuffer: 40 << 20 }).toString("utf8");
  return JSON.parse(out);
}
function lessonTitle(dir) {
  return dir.replace(/^\d+-/, "").replace(/-/g, " ").replace(/\b\w/g, function (c) { return c.toLowerCase(); })
    .replace(/^./, function (c) { return c.toUpperCase(); });
}
/* 封面：纯代码画的 SVG，跟站内 Python 封面同一套路（不引外部图、不依赖网络） */
function coverSvg(c, n) {
  var rows = "";
  for (var i = 0; i < n; i++) {
    var x = 46 + (i % 6) * 46, y = 150 + Math.floor(i / 6) * 46;
    rows += '<rect x="' + x + '" y="' + y + '" width="30" height="30" rx="7" fill="' + c.tint + '" fill-opacity="' + (0.25 + (i % 5) * 0.14).toFixed(2) + '"/>';
  }
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">'
    + '<rect width="640" height="360" fill="#fffaf3"/>'
    + '<rect width="640" height="8" fill="' + c.tint + '"/>'
    + '<text x="46" y="86" font-size="34" font-weight="700" fill="#2b2118" font-family="Noto Sans CJK SC,sans-serif">' + c.zh + '</text>'
    + '<text x="46" y="118" font-size="16" fill="#7a6a5c" font-family="monospace">' + c.repo + ' · MIT · ' + n + ' 课</text>'
    + rows + '</svg>';
}

/** 正文清单同步。
 * 改成按需加载之后，index.html 不再逐个列正文（列了首屏就退回 3 MB），
 * 每门课要拉哪些脚本由 site.js 的 glob 交给 dev/tools/gen-index.js 展开进 assets/data/index.js。
 * 所以这里只报文件数，并把目录生成交给 gen-index.js —— 不再改 index.html 一个字节。 */
function syncIndexTags() {
  const dir = path.join(DATA, "ms");
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(function (f) { return /^[a-z]+-c\d+\.js$/.test(f); }).sort() : [];
  const r = require("child_process").spawnSync(process.execPath, [path.join(DEV, "tools", "gen-index.js")], { encoding: "utf8" });
  if (r.status !== 0) { console.log(r.stdout || ""); console.error(r.stderr || ""); throw new Error("gen-index.js 没过，正文没进目录"); }
  return files.length;
}

function main() {
  const problems = [];
  const packs = [];
  COURSES.forEach(function (c) {
    let dirs;
    try {
      const cache = loadCache();
      if (cache[c.id]) { dirs = cache[c.id]; }
      else if (c.mode === "nested") {
        /* 这两门是「组 / 课」两层：组目录形如 2-js-basics，课目录形如 1-js-basics */
        const groups = getJSON("https://api.github.com/repos/" + c.repo + "/contents/")
          .filter(function (x) { return x.type === "dir" && /^\d+-/.test(x.name); })
          .map(function (x) { return x.name; }).sort(function (a, b) { return parseInt(a) - parseInt(b); });
        dirs = [];
        groups.forEach(function (g) {
          const subs = getJSON("https://api.github.com/repos/" + c.repo + "/contents/" + g)
            .filter(function (x) { return x.type === "dir" && /^\d+-/.test(x.name); })
            .map(function (x) { return g + "/" + x.name; });
          if (!subs.length) dirs.push(g); else dirs = dirs.concat(subs.sort());
        });
      } else {
        dirs = getJSON("https://api.github.com/repos/" + c.repo + "/contents/")
          .filter(function (x) { return x.type === "dir" && /^\d\d?-/.test(x.name); })
          .map(function (x) { return x.name; }).sort();
      }
      if (dirs.length) { const cc = loadCache(); cc[c.id] = dirs; saveCache(cc); }
      if (!dirs.length) problems.push(c.id + " 一门课都没枚举到（接口限流？缓存也没有），拒绝写产物");
    } catch (e) { problems.push(c.repo + " 列目录失败：" + e.message); return; }
    /* 00-course-setup 是「怎么跑这门课」，站内当第 1 章保留，不丢 */
    const noTitle = [];
    const chapters = dirs.map(function (d, i) {
      const no = String(i + 1).padStart(2, "0");
      return {
        id: c.id + "-c" + no,
        title: "第 " + (i + 1) + " 课 · " + (ZH[d] || (noTitle.push(c.id + " ← " + d), "（缺中文标题）")),
        blocks: [
          { t: "tip", color: "blue", text: "本课译自 " + c.repo + " 的 " + d + "（Microsoft，MIT 许可），原文：https://github.com/" + c.repo + "/tree/main/" + d },
          { t: "p", text: "正文待译。原课每课都带可运行的代码与截图，译完会按站内三条闸复核（不出现未教过的写法、交叉引用只往回指、代码两头对拍）。" }
        ]
      };
    });
    /* 标题查不到就报错，不许悄悄用英文目录名顶上 —— 漏一条就会在站上露出来 */
    if (noTitle.length) problems.push(c.id + " 缺中文标题：" + noTitle.join(", "));
    if (chapters.length < 8) problems.push(c.repo + " 只解析到 " + chapters.length + " 课，少于预期");
    packs.push({ tutorial: {
      id: c.id, title: c.zh + "（译自 Microsoft · MIT）", intro: c.intro, cat: c.cat, diff: c.diff,
      tags: c.tags, author: "Microsoft 原文 · 喵站译", cover: "/assets/img/covers/" + c.id + ".svg", chapters: chapters
    } });
    if (!CHECK_ONLY) {
      fs.mkdirSync(IMG, { recursive: true });
      fs.writeFileSync(path.join(IMG, c.id + ".svg"), coverSvg(c, chapters.length));
    }
    console.log(c.id.padEnd(8), chapters.length, "课 ·", c.cat, "· 封面", c.id + ".svg");
  });

  /* 先验完再落盘：任何一门没枚举到、任何一课缺中文标题，都不许覆盖 ms-data.js
     （上一版就是接口限流后照样写，把三门课的骨架冲没了） */
  if (problems.length) {
    problems.forEach(function (p) { console.log("!! " + p); });
    console.log("有 " + problems.length + " 个问题，产物未写入");
    process.exit(1);
  }
  if (!CHECK_ONLY) {
    const body = "/* 喵站 · 微软 MIT 课程数据（由 dev/tools/ms-gen.js 生成，要改改生成器）\n"
      + " *\n * 授权：内容译自下列仓库，LICENSE = MIT（实测 GitHub /license 接口）。\n"
      + " * MIT 的唯一硬要求是保留版权声明与许可文本，所以每章第一块 tip 都写明出处，\n"
      + " * 许可原文存在 assets/data/ms-LICENSE-MIT.txt。\n */\n(function (root) {\n  \"use strict\";\n  var PACKS = "
      + JSON.stringify(packs, null, 1) + ";\n  root.MIAO_MS = PACKS;\n  PACKS.forEach(function (p) { root['MIAO_MS_' + p.tutorial.id.toUpperCase()] = p; });\n})(typeof window !== 'undefined' ? window : globalThis);\n";
    fs.writeFileSync(path.join(DATA, "ms-data.js"), body);
    console.log("写出 ms-data.js", fs.statSync(path.join(DATA, "ms-data.js")).size, "字节");
  }
  console.log("ms 正文文件：", syncIndexTags(), "个 · 目录已由 gen-index.js 重建");
}
/* 有问题的话根本不写文件：上一版把 ms-data.js 覆盖成只剩一门课，是实打实的事故 */
if (require.main === module) main();
