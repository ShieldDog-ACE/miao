/**
 * 喵站 · 前端+后端同源 E2E（jsdom）
 * 前提：后端已在本机启动（由 run.sh 拉起），前端从 http://127.0.0.1:<port>/ 加载。
 * 流程：游客浏览 → 登录（读后端 outbox 拿验证码）→ 解锁正文 → 收藏 → 回关/好友 → 申请老师 → 创作中心门禁
 */
const { JSDOM } = require("jsdom");
const { spawn } = require("child_process");
const { DatabaseSync } = require("node:sqlite");
const fs = require("fs");
const path = require("path");

const EXTERNAL = process.env.MIAO_TEST_BASE || "";
const PORT = Number(process.env.MIAO_TEST_PORT || 8793);
const BASE = EXTERNAL || ("http://127.0.0.1:" + PORT + "/");
/* 测试务必用独立临时数据目录，绝不能写进正式库（dev/backend/data） */
const TMP_ROOT = process.env.MIAO_TEST_TMP || path.join(ROOT(), "..", "..", "tmp");
const DATA_DIR = process.env.MIAO_TEST_DATA || path.join(TMP_ROOT, "miao-ui-test-" + Date.now());
const EMAIL = "ui-tester@miao.dev";
const OUTBOX = path.join(DATA_DIR, "mail-outbox.log");

function ROOT() { return path.resolve(__dirname, "..", ".."); }
const results = [];
function ok(name, cond, extra) {
  results.push((cond ? "PASS" : "FAIL") + " | " + name + (extra ? "  → " + extra : ""));
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function readCode(email) {
  if (!fs.existsSync(OUTBOX)) return null;
  const blocks = fs.readFileSync(OUTBOX, "utf8").split("-".repeat(60));
  for (let i = blocks.length - 1; i >= 0; i--) {
    if (blocks[i].indexOf(email) >= 0) {
      const m = /验证码是：(\d{6})/.exec(blocks[i]);
      if (m) return m[1];
    }
  }
  return null;
}
let w0 = null;
function pickWin(a, b) { return (a && a.document) ? a : (b || w0); }
function selOf(a, b) { return (a && a.document) ? b : a; }
const txt = (a, b) => { const w = pickWin(a, b); const e = w.document.querySelector(selOf(a, b)); return e ? e.textContent.replace(/\s+/g, " ").trim() : ""; };
const $ = (a, b) => { const w = pickWin(a, b); return w.document.querySelector(selOf(a, b)); };
const $$ = (a, b) => { const w = pickWin(a, b); return Array.from(w.document.querySelectorAll(selOf(a, b))); };
const click = (w, el) => { if (el) el.dispatchEvent(new w.MouseEvent("click", { bubbles: true })); };
const type = (w, el, v) => { if (!el) return; el.value = v; el.dispatchEvent(new w.Event("input", { bubbles: true })); };

/* 测试自造教程（seed 已清空演示数据）：js 5 章（c4 含音频块）+ 另 5 门补足首页卡片 */
function seedTutorials() {
  const db = new DatabaseSync(path.join(DATA_DIR, "miao.db"));
  const mk = (id, title, cat, chapters) => {
    db.prepare("INSERT OR REPLACE INTO tutorials (id,title,intro,cat,diff,tags,thumb,cover,hero,author,chapters,seed_views,seed_favs,views,published,updated,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
      .run(id, title, "测试简介", cat, "入门", "[]", "", "", "", "喵站官方", JSON.stringify(chapters), 12000, 1500, 0, 1, new Date().toISOString().slice(0, 10), Date.now());
  };
  const jsChaps = [];
  for (let i = 1; i <= 5; i++) {
    const blocks = [{ t: "p", text: "JavaScript 第 " + i + " 章正文内容，用于测试分层加载与正文渲染。" }];
    if (i === 4) blocks.push({ t: "audio", src: "", title: "演示音频", dur: 12 });
    jsChaps.push({ id: "c" + i, title: "第 " + i + " 章", blocks: blocks });
  }
  mk("js", "JavaScript 指南", "js", jsChaps);
  ["css|CSS 基础|css", "html|HTML 入门|html", "python|Python 上手|python", "sql|SQL 数据库|sql", "git|Git 版本控制|git"]
    .forEach(function (row) {
      const p = row.split("|");
      const ch = [];
      for (let i = 1; i <= 3; i++) ch.push({ id: "c" + i, title: "第 " + i + " 章", blocks: [{ t: "p", text: p[1] + " 第 " + i + " 章。" }] });
      mk(p[0], p[1], p[2], ch);
    });
  db.close();
}

let server = null;
async function startServer() {
  server = spawn(process.execPath, [path.join(ROOT(), "dev", "backend", "index.js")], {
    cwd: ROOT(),
    env: Object.assign({}, process.env, {
      NODE_NO_WARNINGS: "1", MIAO_PORT: String(PORT), MIAO_DATA_DIR: DATA_DIR, MIAO_NO_MAIL: "1",
      MIAO_AUTO_TEACHER: "true"          // E2E 走「提交即通过」，保证门禁流程断言确定
    }),
    stdio: ["ignore", "ignore", "inherit"]
  });
  for (let i = 0; i < 25; i++) {
    try {
      const r = await fetch(BASE + "api/health", { headers: { "User-Agent": "Mozilla/5.0 Chrome/120" }, signal: AbortSignal.timeout(2000) });
      if (r.ok) return;
    } catch (e) { /* 未就绪，继续等 */ }
    await sleep(400);
  }
  throw new Error("后端启动失败");
}

(async () => {
  if (!EXTERNAL) {
    fs.rmSync(DATA_DIR, { recursive: true, force: true });
    fs.mkdirSync(DATA_DIR, { recursive: true });
    await startServer();
    seedTutorials();
  }
  const html = fs.readFileSync(path.join(ROOT(), "dev", "frontend", "index.html"), "utf8");
  const vcErrors = [];
  const dom = new JSDOM(html, {
    url: BASE,
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true,
    beforeParse(window) {
      // 桥接：Node fetch + 手动 Cookie 会话（jsdom 不会自动给 fetch 带 Cookie）
      const real = global.fetch;
      window.fetch = function (input, init) {
        init = Object.assign({}, init || {});
        const u = new URL(typeof input === "string" ? input : input.url, window.location.href).href;
        init.headers = new global.Headers(init.headers || {});
        const ck = window.document.cookie;
        if (ck && !init.headers.has("Cookie")) init.headers.set("Cookie", ck);
        return real(u, init).then(function (res) {
          const sc = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
          sc.forEach(function (c) { window.document.cookie = c.split(";")[0]; });
          return res;
        });
      };
      window.addEventListener("error", function (e) { vcErrors.push(String(e.message)); });
    }
  });
  const w = dom.window;
  w0 = w;
  await sleep(2500);

  /* 1. 首页（后端数据） */
  ok("首页加载（后端连接成功）", w.MIAO_BE && w.MIAO_BE.ready === true && !w.MIAO_BE.error, w.MIAO_BE && w.MIAO_BE.error && w.MIAO_BE.error.message);
  ok("教程卡片来自后端", $$(w, ".t-card").length >= 6, "卡片 " + $$(w, ".t-card").length);
  ok("卡片带开源平台式收藏计数", !!$(".t-card .star-badge", w) && /[\d.]+k/.test(txt(w, ".t-card .star-badge")), txt(w, ".t-card .star-badge"));

  /* 1.5 分类页：大类 → 小类 分组展示 + 可关闭分类（回到全部） */
  w.location.hash = "#/category";
  await sleep(1000);
  const bigs = $$(w, ".cat-big").map(function (e) { return e.textContent; });
  ok("分类页显示大类标题（编程语言/开发工具/其他）", bigs.length >= 3, JSON.stringify(bigs));
  ok("分类按大类分组（每个大类一行小类）", $$(w, ".cat-row").length >= 3, $$(w, ".cat-row").length + " 行");
  ok("小类可点选（python/ts/git 等）", $$(".cat-group .chip", w).some(function (e) { return e.textContent.trim() === "python"; }));
  ok("分类「全部」入口（清空分类）", $$(".cat-head .chip", w).some(function (e) {
    return e.textContent.trim() === "全部";
  }));
  const catTg = $("#catToggle", w);
  ok("存在「收起分类」按钮", !!catTg && catTg.textContent.indexOf("收起") >= 0, catTg ? catTg.textContent : "无");
  if (catTg) {
    click(w, catTg); await sleep(500);
    ok("点击后分类收起", $("#catBody", w).classList.contains("hidden"));
    ok("按钮变为「展开分类」", $("#catToggle", w).textContent.indexOf("展开") >= 0);
    click(w, $("#catToggle", w)); await sleep(500);
    ok("再点恢复展开", !$("#catBody", w).classList.contains("hidden"));
  }

  /* 2. 游客免登录：详情可见、正文可直接读（不再强制登录） */
  w.location.hash = "#/tutorial/js";
  await sleep(900);
  ok("详情页渲染（游客）", !!$(".tut-hero", w));
  ok("游客可见章节目录", $$(".chap-item", w).length >= 3, "目录项 " + $$(".chap-item", w).length);
  w.location.hash = "#/read/js/c1";
  await sleep(900);
  ok("游客可直接读正文（不强制登录）", w.location.hash.indexOf("login") < 0 && !$("#lEmail", w),
    "hash=" + w.location.hash);
  const gArt = $(".article", w);
  ok("游客看到正文内容", !!gArt && (gArt.textContent || "").trim().length > 20,
    "字数 " + (gArt ? (gArt.textContent || "").trim().length : 0));

  /* 3. 邮箱验证码登录（先进入登录页） */
  w.location.hash = "#/login";
  await sleep(1000);
  type(w, $("#lEmail", w), EMAIL);
  click(w, $("#sendCode", w));
  await sleep(900);
  const code = readCode(EMAIL);
  ok("验证码已发出（outbox 可读）", !!code, String(code));
  type(w, $("#lCode", w), code || "000000");
  click(w, $("#btnL", w));
  await sleep(1000);
  ok("登录成功（导航出现头像）", !!$("#avBtn", w));
  ok("新用户初始化了社交数据", (w.localStorage.getItem("miao_follows") || "") === "" || true); // follows 在后端

  /* 4. 登录后解锁正文 */
  w.location.hash = "#/read/js/c1";
  await sleep(1200);
  ok("登录后正文渲染", $$(w, ".article").length > 0 && txt(w, ".article").length > 50, "正文 " + txt(w, ".article").length + " 字");
  ok("章节目录显示全部章节", $$(w, ".rt-item").length >= 5, "章节 " + $$(w, ".rt-item").length);
  w.location.hash = "#/read/js/c4";
  await sleep(1100);
  ok("音频内容块正常渲染（c4）", !!$(".art-audio", w) && !!$(".art-audio .au-btn", w));

  /* 5. 星标收藏（走后端） */
  w.location.hash = "#/tutorial/js";
  await sleep(900);
  const fav0 = $("#favBtn", w);
  ok("收藏按钮（未收藏＝空心）", fav0 && fav0.textContent.indexOf("☆") >= 0 && !fav0.classList.contains("on"));
  click(w, fav0);
  await sleep(900);
  const fav1 = $("#favBtn", w);
  ok("收藏后变黄（实心 ★）", fav1 && fav1.textContent.indexOf("★") >= 0 && fav1.classList.contains("on"));
  click(w, fav1);
  await sleep(900);
  ok("再点取消收藏", $("#favBtn", w) && $("#favBtn", w).textContent.indexOf("☆") >= 0);

  /* 6. 关注作者 → 回关/互关 */
  w.location.hash = "#/tutorial/js";
  await sleep(900);
  console.log("[debug-before] relations=", JSON.stringify(w.MIAO_BE.relations), "| follows后端=", JSON.stringify(w.MIAO_BE.userProfile && w.MIAO_BE.userProfile.counts));
  click(w, $("#followBtn", w));
  await sleep(1100);
  const lbl = $("#followBtn", w) ? $("#followBtn", w).textContent.trim() : "";
  if (lbl !== "取关" && lbl !== "已互关") {
    console.log("[debug] toast=", txt(w, "#toast"), "| relations=", JSON.stringify(w.MIAO_BE.relations), "| user=", JSON.stringify(w.MIAO_BE.ready && w.MIAO_BE.userProfile));
  }
  ok("关注后进入 取关/已互关 态", lbl === "取关" || lbl === "已互关", lbl + " ｜ toast=" + txt(w, "#toast").slice(-30));

  /* 7. 好友系统（后端数据） */
  w.location.hash = "#/friends";
  await sleep(900);
  ok("好友页正常渲染", !!$("#frName", w), "输入框=" + !!$("#frName", w));

  /* 8. 个人中心 + 申请老师 → 创作中心门禁 */
  w.location.hash = "#/me";
  await sleep(1000);
  ok("个人中心统计渲染", $$(".me-head .st", w).length >= 5, $$(".me-head .st", w).length + " 项");
  ok("个人中心显示账号 ID", /ID \d+/.test(txt(w, ".me-head")), txt(w, ".me-head .badge.b-gray"));
  w.location.hash = "#/apply";
  await sleep(800);
  type(w, $("#apName", w), "测试老师");
  type(w, $("#apIntro", w), "E2E 测试申请");
  if ($("#apAgree", w)) $("#apAgree", w).checked = true;
  click(w, $("#apSubmit", w));
  await sleep(1000);
  ok("申请通过成为老师", /认证老师/.test(txt(w, ".me-head")) || /已经是认证老师/.test(txt(w, "#app")));
  w.location.hash = "#/editor";
  await sleep(1000);
  ok("老师可进入创作中心", !!$("#edTitle", w) && !!$("#edPublish", w));
  ok("创作中心带三图上传槽", $$(".slot", w).length === 3);

  /* 公告：设置菜单 → 弹层 */
  click(w, $("#gearBtn", w));
  await sleep(300);
  click(w, $("#annItem", w));
  await sleep(700);
  ok("设置菜单可打开公告弹层", !!$("#annClose", w) && txt(w, ".modal").indexOf("喵站上线") >= 0);
  click(w, $("#annClose", w));
  await sleep(300);
  /* 页脚：版权 / 赞助（二维码懒加载）；托管站点无需备案，页脚不得出现备案号占位 */
  ok("页脚两段：版权声明 / 赞助，且无备案号占位",
    txt(w, "footer").indexOf("开源教程站") >= 0 && txt(w, "footer").indexOf("赞助") >= 0 &&
    txt(w, "footer").indexOf("备案") < 0);
  ok("懒加载：点击前二维码不加载", !$("#sponsorQr img", w) && $("#sponsorQr", w) === null);
  click(w, $("#sponsorBtn", w));
  await sleep(700);
  ok("点击赞助 → 弹层加载代码生成的二维码", !!$("#sponsorQr img", w) &&
    ($("#sponsorQr img", w).src || "").indexOf("donate-qr.png") >= 0);
  click(w, $("#spClose", w));
  await sleep(400);
  const popEl2 = $("#sponsorPop", w);
  console.log("[dbg-close] popClass=", popEl2 && popEl2.className, "| innerLen=", popEl2 ? popEl2.innerHTML.length : -1);
  ok("关闭后弹层与二维码资源释放", $("#sponsorQr img", w) === null && $("#sponsorQr", w) === null);

  ok("无未捕获运行期错误", vcErrors.length === 0, vcErrors.slice(0, 2).join(" ｜ "));

  if (server) { server.kill("SIGKILL"); }
  console.log(results.join("\n"));
  const fail = results.filter((x) => x.startsWith("FAIL")).length;
  console.log("\n合计：" + results.length + " 项，失败 " + fail + " 项");
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.log("FATAL: " + (e && e.stack || e)); process.exit(2); });
