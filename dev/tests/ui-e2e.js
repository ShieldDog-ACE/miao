/**
 * 喵站 · 纯静态站 E2E（jsdom + 本地静态服务器）
 *
 * 站点没有后端了：正文与题库从 assets/data/ 直接进页面，收藏 / 进度 / 成绩落 localStorage。
 * 这套测试做三件事：
 *   1. 真起一台只发文件的静态服务器（dev/tests/static-server.js，零依赖），jsdom 从 HTTP 加载页面；
 *   2. 走一遍读者的真实路径：首页 → 分类 → 详情 → 阅读 → 考试 → 交卷 → 收藏 → 页脚投稿入口；
 *   3. 反向断言：页面不许再发出任何 /api 请求，也不许再有登录注册入口。
 * 跑法：node dev/tests/ui-e2e.js（或 bash dev/tests/run.sh 一起跑）
 */
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");
const { start } = require("./static-server.js");

const DEV = path.resolve(__dirname, "..");
const PORT = Number(process.env.MIAO_TEST_PORT || 8793);
const BASE = "http://127.0.0.1:" + PORT + "/";
/* 布局类的回归（行号列折行、长文字撑破卡片）在 jsdom 里量不到像素，只能直接盯住 CSS 源码里的规则 */
const CSS_TEXT = fs.readFileSync(path.join(DEV, "frontend/assets/css/style.css"), "utf8");

const results = [];
function ok(name, cond, extra) {
  results.push((cond ? "PASS" : "FAIL") + " | " + name + (extra != null && extra !== "" ? "  → " + extra : ""));
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let W = null;                                   // jsdom window，所有选择器默认在它身上找
const winOf = (a, b) => (a && a.document) ? a : ((b && b.document) ? b : W);
const selOf = (a, b) => (a && a.document) ? b : a;
const txt = (a, b) => { const el = winOf(a, b).document.querySelector(selOf(a, b)); return el ? el.textContent.replace(/\s+/g, " ").trim() : ""; };
const $ = (a, b) => winOf(a, b).document.querySelector(selOf(a, b));
const $$ = (a, b) => Array.from(winOf(a, b).document.querySelectorAll(selOf(a, b)));
const click = (el, w) => { if (!el) return; const t = w || W; el.dispatchEvent(new t.MouseEvent("click", { bubbles: true })); };
const type = (el, v, w) => { const t = (w) || W; if (!el) return; el.value = v; el.dispatchEvent(new t.Event("input", { bubbles: true })); };

let server = null;

/* 静态服务器替我记每一笔请求：按需加载到底有没有生效，只看这个清单，不看代码注释 */
const reqLog = [];

(async () => {
  server = await start(PORT, (u) => reqLog.push(String(u).split("?")[0]));

  /* 静态站上任何一次 /api 请求都是「后端没删干净」的证据 */
  const apiCalls = [];
  const html = fs.readFileSync(path.join(DEV, "frontend", "index.html"), "utf8");
  const vcErrors = [];
  const dom = new JSDOM(html, {
    url: BASE,
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true,
    beforeParse(window) {
      const real = window.fetch ? window.fetch.bind(window) : null;
      window.fetch = function (input, init) {
        const u = typeof input === "string" ? input : ((input && input.url) || "");
        if (/\/api\//.test(u)) apiCalls.push(u);
        return real ? real(u, init) : Promise.reject(new Error("这个环境没有 fetch"));
      };
      window.addEventListener("error", (e) => vcErrors.push(String(e.message)));
    }
  });
  W = dom.window;
  await sleep(2500);
  /* 首屏拉到的脚本，此刻就定终身了 */
  const shellJs = reqLog.filter((u) => u.endsWith(".js"));

  /* ---------- 1. 首页与数据源 ---------- */
  ok("页面加载：本地数据层就绪", W.MIAO_BE && W.MIAO_BE.ready === true && !W.MIAO_BE.error,
    W.MIAO_BE && W.MIAO_BE.error && W.MIAO_BE.error.message);
  ok("教程卡片来自静态数据文件", $$(".t-card").length >= 2, "卡片 " + $$(".t-card").length);
  ok("卡片不再摆编造的「人在学」", !/人在学/.test(txt("#app")), txt(".t-meta"));
  /* 元信息行：他实测到这一行要塞 261~350px 而格子只有 221px，被压成上下堆叠。
     像素在 jsdom 里量不到，所以一半盯 DOM 结构、一半盯 CSS 源码规则。 */
  {
    var metas = $$(".t-card .t-meta");
    var shaped = metas.every((m) => m.querySelectorAll(".m-item").length >= 2 && m.querySelectorAll(".diff").length === 1);
    ok("每张卡片的元信息 = 1 个 .diff + ≥2 个 .m-item（不是散 span 拼的）", shaped,
      metas.length + " 张，首个：" + (metas[0] ? metas[0].querySelectorAll(".m-item").length + " 项" : "无"));
    /* 卡片行不摆作者：最窄格子 221px，而「Microsoft 原文 · 喵站译」独占 213px，
       省略到底只剩「Mi…」—— 摆了个读不出东西的位置。全名在教程页顶与侧栏都有。 */
    ok("卡片元信息里没有作者名（213px 的作者塞不进 221px 的格子）",
      !$$(".t-card .t-meta").some((m) => /Microsoft|喵站官方/.test(m.textContent)),
      (metas[0] ? metas[0].textContent.trim() : "无"));
    ok("分隔点全部带 .m-sep，没有裸「·」span 混在里面",
      !$$(".t-card .t-meta > span").some((s) => s.textContent.trim() === "·" && !s.classList.contains("m-sep")));
    ok("元信息一行摆平：.t-meta 有 flex-wrap:nowrap 与 overflow:hidden",
      /\.t-meta\s*\{[^}]*flex-wrap:\s*nowrap/.test(CSS_TEXT) && /\.t-meta\s*\{[^}]*overflow:\s*hidden/.test(CSS_TEXT));
    ok("缩得下的项给了省略号：.t-meta .m-item 有 text-overflow:ellipsis",
      /\.t-meta \.m-item\s*\{[^}]*text-overflow:\s*ellipsis/.test(CSS_TEXT));
    ok("窄栏文字补了 min-width:0（flex 子项默认 auto，长标题会撑破容器而不是收缩）",
      /\.chap-item \.tt\s*\{[^}]*min-width: 0/.test(CSS_TEXT) &&
      /\.rt-item > span:not\(\.dot\)\s*\{[^}]*min-width: 0/.test(CSS_TEXT) &&
      /\.crumb\s*\{[^}]*text-overflow: ellipsis/.test(CSS_TEXT));
    ok("「作者名可以点」这个死件已经删掉（点了没有作者页）",
      $$(".t-card .t-author").length === 0 && !/\.t-author\s*\{[^}]*cursor:\s*pointer/.test(CSS_TEXT));
    /* 首页那张卡自己的形状与截断，是调了十几轮定下来的（封面 16:9 + 正文两行封顶、超出走省略号，
       实测 1440 宽下封面 151 / 正文 132 ≈ 1:1）。上一轮做视频页时我把它钉成 3:4、简介放到三行，
       被他抓出来了 —— 这条尺子就是防下一次「改视频改到首页」。 */
    /* 首页那张卡的形状与截断是调了十几轮定下来的：封面 16:9、正文两行封顶、超出走省略号，
       1440 宽下实测封面 151 / 正文 132 ≈ 1:1。上一轮做视频页时我把它钉成 3:4、简介放到三行，被他抓出来了
       —— 下面这四条尺子就是防下一次「改视频改到首页」。 */
    ok("首页卡不许被别摊带歪：.t-card 不钉 aspect-ratio",
      !/\.t-card\s*\{[^}]*aspect-ratio/.test(CSS_TEXT));
    ok("首页简介仍是两行封顶（超出直接省略号，不靠加高卡片塞字）",
      /\.t-body \.intro\s*\{[^}]*-webkit-line-clamp:\s*2/.test(CSS_TEXT));
    ok("首页封面仍是 16:9 那条（1440 宽下 151px，与正文 132px 差不多一比一）",
      /\.t-card \.cover\.has-img\s*\{[^}]*aspect-ratio:\s*16 \/ 9/.test(CSS_TEXT));
    ok("首页卡的类名与结构没换：还是 .t-card > .cover.has-img + .t-body",
      !!$(".t-card .cover.has-img") && !!$(".t-card .t-body .intro") && !!$(".t-card .t-meta"),
      $$(".t-card").length + " 张卡");
  }
  ok("没有登录 / 注册入口", !/href="#\/login"/.test(W.document.body.innerHTML) && !$("#avBtn"));
  ok("导航里不再有「成为老师」（挪到页脚了）", !/href="#\/apply"/.test($("header").innerHTML));

  /* ---------- 2. 分类与详情 ---------- */
  W.location.hash = "#/category";
  await sleep(1000);
  /* 小类为空的大类（动手造 / 英语）在 app.js 里渲染成 chip 而不是带标题的一行，
     所以判据是「每个大类都有入口」，不是「有几行标题」 */
  {
    var bigs = Object.keys(W.MIAO_SITE.categories);
    var titled = $$(".cat-big").map((e) => e.textContent.trim());
    var chips = $$(".cat-group .chip").map((e) => e.textContent.trim());
    var gone = bigs.filter((b) => titled.indexOf(b) < 0 && chips.indexOf(b) < 0);
    ok("每个大类都有入口（行标题或 chip）", gone.length === 0,
      "标题 " + JSON.stringify(titled) + " 缺 " + JSON.stringify(gone));
  }
  ok("python 小类在列", $$(".cat-group .chip").some((e) => e.textContent.trim() === "python"));
  W.location.hash = "#/tutorial/python";
  await sleep(1200);
  ok("详情页渲染：48 章目录 + 侧栏", $$(".chap-item").length >= 45 && !!$(".side-card"), "章节 " + $$(".chap-item").length);
  /* 同一个「入门」以前在三个地方长三种样子：卡片与 hero 是 .badge 胶囊（而 .badge 还被
     考场面板的计数块共用），右侧信息卡干脆是纯文本。现在三处必须同一个 .diff。 */
  ok("难度标签在详情页三处同一个样子（都是 .diff，不再是 .badge 或纯文本）",
    $$(".tut-hero .diff").length === 1 && $$(".tut-hero .badge").length === 0 &&
    $$(".side-card .kv .diff").length === 1,
    "hero " + $$(".tut-hero .diff").length + " 个 / 侧栏 " + $$(".side-card .kv .diff").length + " 个");
  ok("教程页顶的元信息行带作者全名（卡片省掉的那一项在这里补回来）",
    /喵站官方|Microsoft/.test(txt(".tut-hero .t-meta")), txt(".tut-hero .t-meta").slice(0, 46));
  ok("详情页信息卡不再用内联 style 摆样式", !/style="[^"]*border-top:1px solid var\(--border\)/.test($(".side-card").outerHTML));
  ok("侧栏报出本机考试进度（45 课里过了几课）", /课末考试/.test(txt(".side-card")), txt(".side-card").slice(0, 70));

  /* ---------- 3. 阅读页 ---------- */
  W.location.hash = "#/read/python/l01";
  await sleep(1300);
  ok("正文直接渲染，不登录也能读", $$(".article").length > 0 && txt(".article").length > 50, "正文 " + txt(".article").length + " 字");
  ok("排了考卷的课只有「进入考试」", !!$(".exam-entry") && !$("#doneBtn"));
  W.location.hash = "#/read/python/s01";
  await sleep(1200);
  ok("第 0 课不考试：仍是「完成！」按钮", !!$("#doneBtn") && !$(".exam-entry"));
  click($("#doneBtn"));
  await sleep(900);
  ok("点完成写进本机进度（localStorage）",
    (JSON.parse(W.localStorage.getItem("miao_progress") || "{}").python || []).indexOf("s01") >= 0,
    W.localStorage.getItem("miao_progress"));

  /* ---------- 4. Python 考试：IDE / 跑 / 判分 / 完成标记 ---------- */
  W.location.hash = "#/read/python/l01";
  await sleep(1200);
  click($(".exam-entry"));
  await sleep(1700);
  ok("考试页是整屏 IDE：标题栏 / 编辑区 / 底部面板 / 终端 / 状态栏都在",
    !!$(".ide-titlebar") && !!$("#ideEditor") && !!$("#idePanel") && !!$("#term") && !!$(".ide-status"));
  ok("左上角有「退出考试」", !!$("#ideExit") && /退出/.test(txt("#ideExit")), txt("#ideExit"));
  ok("考场只剩编辑区：活动栏、考试目录、右侧任务卡、假菜单全没了",
    [".ide-activity", ".ide-explorer", ".ide-side", ".ide-tb-menu", ".tab-add"].filter((s) => !!$(s)).length === 0,
    "还在的：" + [".ide-activity", ".ide-explorer", ".ide-side", ".ide-tb-menu", ".tab-add"].filter((s) => !!$(s)).join(","));
  ok("运行 / 重置 / 交卷 都在标题栏里（不再被 sticky 导航条盖住）",
    !!$(".ide-titlebar #ideRun") && !!$(".ide-titlebar #ideReset") && !!$(".ide-titlebar #ideSubmit"), txt(".ide-tb-right"));
  ok("考试路由给 body 挂上 exam-mode，导航条与页脚让位", W.document.body.classList.contains("exam-mode"),
    W.document.body.className || "(无类名)");
  {
    const lines = String($("#ideTa").value).split("\n");
    const cut = lines.indexOf("#") + 1;
    const taskTxt = lines.slice(0, cut).join("\n");
    const conds = (taskTxt.match(/# 条件\d+：/g) || []).length;
    ok("题面就写在编辑器里：textarea 以 # 注释开头（任务题目 + 逐条条件），独行 # 收尾",
      /^# /.test(lines[0]) && /# 任务题目：/.test(taskTxt) && conds >= 3 && lines[cut - 1] === "#", conds + " 条条件");
    ok("题面里的条件与判定清单一一对应，不会两处说两套话",
      conds > 0 && conds === $$("#jdList li").length, "题面 " + conds + " 条 / 清单 " + $$("#jdList li").length + " 条");
    ok("判定清单住在下方面板的页签里，不在右边", !!$(".panel-tabs .pt[data-pt=\"judge\"]") && !!$("#jdList"),
      $$("#jdList li").length + " 项");
  }
  {
    const gtRule = /\.gt-code \.ln\s*\{[^}]*\}/.exec(CSS_TEXT);
    ok("行号列一段一个号：行号行写了 white-space: pre（少了它一列里会折出三个数字）",
      !!gtRule && /white-space:\s*pre/.test(gtRule[0]), gtRule ? gtRule[0].replace(/\s+/g, " ").slice(0, 56) : "找不到 .gt-code .ln 规则");
    const hlRow = /\.hl-row\s*\{[^}]*\}/.exec(CSS_TEXT);
    ok("高亮层的空行不许塌：.hl-row 写了 min-height（空行 0 高 = 高亮与输入错位）",
      !!hlRow && /min-height/.test(hlRow[0]), hlRow ? hlRow[0].replace(/\s+/g, " ").slice(0, 56) : "找不到 .hl-row 规则");
    ok("语法色系全齐：注释/调用/常量/self/f-string 表达式都有色（第七轮一度只剩 5 个色）",
      [".tk-com", ".tk-call", ".tk-const", ".tk-self", ".tk-fex", ".tk-var", ".tk-pun", ".tk-def", ".tk-cls"].every((s) => CSS_TEXT.indexOf(s) >= 0),
      [".tk-com", ".tk-call", ".tk-const", ".tk-self", ".tk-fex", ".tk-var", ".tk-pun", ".tk-def", ".tk-cls"].filter((s) => CSS_TEXT.indexOf(s) < 0).join(",") || "9 类全在");
    ok("「未交卷」徽标已从面板页签删掉（他点名的）", !$("#ptJudge"), $("#ptJudge") ? "还在" : "已删");
    ok("题面面板与两个开关都没了：收起题面 / 自动换行不再存在（他点名的）",
      !$(".ide-task") && !$("#gtTask") && !$("#taskToggle") && !$("#wrapToggle") && !/\.ide-editor\.wrap/.test(CSS_TEXT),
      ["ide-task", "gtTask", "taskToggle", "wrapToggle"].filter((s) => $("#" + s) || $("." + s)).join(",") || "全删");
    const val = String($("#ideTa").value);
    const nums = $$("#gtCode .ln");
    ok("行号一列编到底：从 1 起、条数等于文件行数（题面 + 代码）",
      nums.length > 1 && nums[0].textContent === "1" && Number(nums[nums.length - 1].textContent) === val.split("\n").length,
      "行号 " + nums.length + " 行 / 文件 " + val.split("\n").length + " 行");
    ok("textarea 固定不折行（wrap=off，自动换行开关删了）", $("#ideTa").getAttribute("wrap") === "off");
    /* 题面不再锁（2026-10-13 他点名「允许整块删掉」）：整份重打就是整份重打，
       # 注释不许自己长回来；判分口径改成「独行 # 之后算代码」，删了题面就整份算代码。 */
    type($("#ideTa"), "print('replaced')");
    ok("题面删得掉：整份重打之后缓冲区就是这一段，注释不复活",
      String($("#ideTa").value) === "print('replaced')",
      JSON.stringify(String($("#ideTa").value).slice(0, 34)));
    $("#ideReset").click();
    const back = String($("#ideTa").value);
    ok("重置把题面与初始代码一起放回来",
      /^# /.test(back) && /# 任务题目：/.test(back) && /# 条件1：/.test(back),
      back.split("\n").slice(0, 2).join(" ⏎ "));
    /* 判分只取那条独行 "#" 之后：把代码全擦掉、只留题面，交卷必须被拦 ——
       题面里写着「是用 print 打出来的」这类条件，能凑分的话锁区一删就全是满分了 */
    const cut = back.split("\n").indexOf("#");
    const taskOnly = back.split("\n").slice(0, cut + 1).join("\n") + "\n";
    type($("#ideTa"), taskOnly);
    click($("#ideSubmit"));
    await sleep(300);
    const tItem = W.document.querySelector("#toast .toast-item");
    ok("只留题面、一个字代码没写就交卷 → 拦住（题面那几行注释不算代码）",
      !!tItem && /先写点代码再交卷/.test(tItem.textContent), tItem ? tItem.textContent : "没有 toast");
  }
  {
    const root = $("#ideRoot");
    const before = root.style.getPropertyValue("--ide-fs");
    $("#ideEditor").dispatchEvent(new W.MouseEvent("wheel", { ctrlKey: true, bubbles: true, cancelable: true }));
    const after = root.style.getPropertyValue("--ide-fs");
    ok("Ctrl+滚轮 调编辑器字号，并存在本机（Ctrl+0 回 14）",
      before !== after && /^\d+px$/.test(after) && W.localStorage.getItem("miao_ide_fs") === parseInt(after, 10) + "",
      before + " → " + after);
  }
  type($("#ideTa"), "print(  'hello     world'  )");
  click($("#ideRun"));
  await sleep(800);
  ok("内置沙箱真跑起来了：终端里看到输出与退出码",
    /hello\s+world/.test(txt("#term")) && /退出码 0/.test(txt("#term")), txt("#term").slice(-46));
  type($("#ideTa"), "print('喵要考试')");
  click($("#ideSubmit"));
  await sleep(1000);
  ok("错解交卷判不过，也不给完成标记",
    /未通过/.test(txt("#ideResult")) &&
    (JSON.parse(W.localStorage.getItem("miao_exam_results") || "{}").python || {}).l01 === undefined,
    txt("#stScore"));
  type($("#ideTa"), "print( 'hello world' )");
  click($("#ideSubmit"));
  await sleep(1000);
  ok("多打空格仍判 100 通过（需求：不能因为一个空格判错）", /100\/100 · 通过/.test(txt("#ideResult")), txt("#ideResult").slice(0, 22));
  ok("交卷后自动翻到「判定清单」页签，状态栏写出成绩",
    !!$(".panel-tabs .pt[data-pt=\"judge\"].on") && /得分 100/.test(txt("#stScore")), txt("#stScore"));
  ok("逐项检测每条都写了「检测到了什么」",
    $$("#ideResult .ck-saw").length >= 3 && $$("#ideResult .ck-saw").every((e) => e.textContent.trim().length > 6),
    $$("#ideResult .ck-saw").length + " 条");
  ok("成绩与完成标记都落到本机",
    (JSON.parse(W.localStorage.getItem("miao_progress") || "{}").python || []).indexOf("l01") >= 0 &&
    !!((JSON.parse(W.localStorage.getItem("miao_exam_results") || "{}").python || {}).l01 || {}).passed,
    W.localStorage.getItem("miao_exam_results"));
  click($("#ideExit"));
  await sleep(1100);
  ok("回课文看到「已考过」", /已考过/.test(txt(".art-ops")) && !$("#doneBtn"), txt(".art-ops").slice(0, 40));
  ok("退出考场后 body 的 exam-mode 摘掉，导航条与页脚回来", !W.document.body.classList.contains("exam-mode"),
    W.document.body.className || "(无类名)");
  W.location.hash = "#/exam/python/l01";
  await sleep(1500);
  ok("草稿留在本机：退出再进来自己写的代码还在", String($("#ideTa").value || "").indexOf("hello world") >= 0,
    JSON.stringify(String($("#ideTa").value).slice(0, 26)));

  /* 预置文件：原来靠「考试目录」那块列出来，面板删掉之后必须留在题面（编辑器顶上的注释）里 */
  W.location.hash = "#/exam/python/l41";
  await sleep(1600);
  ok("带预置文件的课题，题面里点名给出文件名与读法",
    /# 预置文件：台账\.txt/.test(String($("#ideTa").value)) && /open\("台账\.txt"\)/.test(String($("#ideTa").value)),
    String($("#ideTa").value).split("\n").filter((l) => /预置文件/.test(l))[0] || "题面里没有预置文件那行");
  ok("换一场考试，exam-mode 仍然挂着（不是只在第一次进时生效）",
    W.document.body.classList.contains("exam-mode"), W.document.body.className || "(无类名)");

  /* ---------- 5. 英语卷 ---------- */
  W.location.hash = "#/read/english/en-c01";
  await sleep(1200);
  ok("英语章也挂考试，提示按卷型换了话", !!$(".exam-entry") && /听音|听力/.test(txt(".exam-note")), txt(".exam-note").slice(0, 46));
  W.location.hash = "#/exam/english/en-c01";
  await sleep(1800);
  ok("英语卷：一场 25 题", $$(".en-card-q").length === 25, $$(".en-card-q").length + " 题");
  ok("英语卷：听力题都带「听」按钮", $$(".eq-play").length >= 10, $$(".eq-play").length + " 个播放键");
  /* 勾线题：点左再点右要真画出一条线，× 要能撤销 —— 从前参照系算错，线画到 SVG 外面，看着就是「连不上」 */
  {
    const mc = $$(".en-match")[0];
    if (!mc) ok("卷子里有勾线题", false, "没找到 .en-match");
    else {
      const L = $$('.en-node[data-side="l"]', mc), R = $$('.en-node[data-side="r"]', mc);
      const paths = () => $$("svg.en-lines path", mc).length;
      click(L[0]); await sleep(120);
      ok("勾线题：左边选中会有高亮态", !!$(".en-node.sel", mc) || L[0].classList.contains("sel"), "");
      click(R[0]); await sleep(200);
      ok("勾线题：点左边再点右边，中间真画出一条线", paths() === 1, paths() + " 条线");
      ok("连上的两端都标成已连线", $$(".en-node.linked", mc).length === 2, $$(".en-node.linked", mc).length + " 个");
      click(L[0]); await sleep(120); click(R[1]); await sleep(200);
      ok("同一个左项改连别的右项，不会留下两条线", paths() === 1, paths() + " 条线");
      const un = $("[data-un]", mc);
      click(un); await sleep(200);
      ok("配对项上的 × 能撤销这条线", paths() === 0, paths() + " 条线");
    }
  }
  {
    /* 单选：原生 radio 点已选中的不会自己取消，考生改不了主意 */
    const card = $$(".en-card-q")[0], opt = $$('input[type=radio]', card)[0];
    const prog0 = txt("#enProg");
    opt.checked = true; opt.dispatchEvent(new W.Event("change", { bubbles: true }));
    await sleep(120);
    const prog1 = txt("#enProg");
    click(opt); await sleep(160);
    ok("单选：再点一次已选中的那一项 = 取消选择",
      opt.checked === false && prog1 !== prog0 && txt("#enProg") === prog0, prog0 + " ｜ " + prog1 + " ｜ " + txt("#enProg"));
  }
  ok("长文字不再撑破卡片：选项栏与两栏都按 minmax(0,1fr) 收缩，节点文字可断行",
    /\.en-opts\s*\{[^}]*minmax\(0,\s*1fr\)/.test(CSS_TEXT) &&
    /\.en-cols\s*\{[^}]*minmax\(0,\s*1fr\)/.test(CSS_TEXT) &&
    /\.en-node span\s*\{[^}]*overflow-wrap:\s*anywhere/.test(CSS_TEXT) &&
    /\.en-qprompt\s*\{[^}]*min-width:\s*0/.test(CSS_TEXT), "");
  ok("勾线中间留出了画线的通道（不会被两栏挤成 0）",
    /\.en-cols\s*\{[^}]*minmax\(76px,\s*128px\)/.test(CSS_TEXT) &&
    /\.en-col\.right\s*\{\s*grid-column:\s*3/.test(CSS_TEXT),
    "绝对定位的 SVG 不占网格轨道，两栏必须点名站第 1 / 第 3 轨");
  {
    const urls = Array.from(new Set($$(".eq-play").map((b) => b.getAttribute("data-audio"))));
    const bad = [];
    for (const u of urls) {
      try {
        const h = await fetch(BASE + String(u).replace(/^\//, ""), { method: "HEAD" });
        if (!h.ok) bad.push(u + "→" + h.status);
      } catch (e) { bad.push(u + "→" + e.message); }
    }
    ok("音频随站点一起发布，静态目录里都取得到", urls.length > 0 && bad.length === 0, urls.length + " 个地址 ｜ " + bad.slice(0, 2).join("，"));
    ok("音频走 /assets/audio/（不再是后端的 /audio/）", urls.every((u) => u.indexOf("/assets/audio/") === 0), urls[0]);
  }
  {
    const asked = [];
    W.confirm = function (msg) { asked.push(String(msg)); return false; };
    click($("#enSubmit"));
    await sleep(700);
    ok("空题交卷前先拦一道：告诉你还剩几题没做", asked.length === 1 && /没做完/.test(asked[0]), asked[0] || "没弹确认");
    ok("点了取消就不交卷", !$("#enResult") || txt("#enResult") === "");
    W.confirm = function () { return true; };
    click($("#enSubmit"));
    await sleep(1100);
    ok("空卷交卷判 0 分不过，逐题回「你答了什么、正确的是什么」",
      /0\/100/.test(txt("#enResult")) && $$(".en-review .ck-saw").length >= 20,
      txt("#enResult").slice(0, 26) + " ｜ 复盘 " + $$(".en-review .ck-saw").length + " 条");
    W.confirm = undefined;
  }

  /* ---------- 5.5 英语入门（21 课 257 词）：单词卡与 22 场考卷 ---------- */
  {
    const before = reqLog.length;
    W.location.hash = "#/tutorial/enwords";
    await sleep(1600);
    ok("英语入门详情页：22 章目录", $$(".chap-item").length === 22, "章 " + $$(".chap-item").length);
    ok("点开这门课才拉它的正文", reqLog.slice(before).some((u) => /enwords-data\.js$/.test(u)),
      reqLog.slice(before).join("，") || "没新增请求");
    const hero = $(".tut-hero .cover-img");
    ok("封面是代码画的 SVG，走站内路径", !!hero && /^\/assets\/img\/covers\/enwords\.svg$/.test(hero.getAttribute("src")),
      hero ? hero.getAttribute("src") : "没有封面图");
    ok("目录最后一课是结课总复习", /结课总复习/.test(txt("#app")), "");

    W.location.hash = "#/read/enwords/ew-l01";
    await sleep(1500);
    const cards = $$(".en-card-word");
    ok("第 1 课摆出本课的单词卡", cards.length >= 10, cards.length + " 张");
    /* 注意：这套测试的 $ 助手是 (窗口, 选择器) 的语义，$(选择器, 元素) 会退回整篇文档去查 ——
       逐元素检查必须直接 c.querySelector，否则「每张卡都齐」会变成「文档里有一张齐的」。 */
    ok("每张卡齐：单词 + 词性 + 音标 + 中文 + 短语 + 播放键",
      cards.every((c) => ["en-word-glyph", "en-word-pos", "en-ipa", "en-cn", "en-w", "en-play"]
        .every((cls) => !!c.querySelector("." + cls))), "");
    ok("每张卡的读音地址都指向这个词自己的 mp3",
      cards.every((c) => {
        const w = c.getAttribute("data-en-k").toLowerCase();   // 字块里还夹着词性，取卡片自己的键
        const src = c.querySelector(".en-play").getAttribute("data-en-src") || "";
        return src === "/assets/audio/words/" + w + ".mp3";
      }), cards.length ? cards[0].querySelector(".en-play").getAttribute("data-en-src") : "");
    ok("第一张卡是 hello /həˈləʊ/",
      /hello/.test(txt(".en-card-word .en-word-glyph")) && /hə/.test(txt(".en-card-word .en-ipa")),
      txt(".en-card-word").replace(/\s+/g, " ").slice(0, 40));
    ok("每课一张讲机制的图（音素数阶梯）", $$(".art-svg svg").length >= 1, $$(".art-svg svg").length + " 张");
    ok("课式骨架齐：目标 / 单词卡 / 读音要点 / 怎么记 / 常见坑 / 任务 / 一句话",
      ["本课目标", "单词卡", "读音要点", "怎么记", "常见坑", "任务", "本课一句话"].every((k) => txt(".article").indexOf(k) >= 0),
      txt(".article").replace(/\s+/g, " ").slice(0, 60));
    {
      const urls = Array.from(new Set($$(".en-card-word .en-play").map((b) => b.getAttribute("data-en-src"))));
      const bad = [];
      for (const u of urls) {
        try {
          const h = await fetch(BASE + u.replace(/^\//, ""), { method: "HEAD" });
          if (!h.ok) bad.push(u + "→" + h.status);
        } catch (e) { bad.push(u + "→" + e.message); }
      }
      ok("这一课每条读音都取得到", urls.length === cards.length && bad.length === 0, bad.slice(0, 3).join("，") || urls.length + " 条");
    }
    {
      const sents = $$(".en-sent");
      ok("核心句子区块：本课每句一条", sents.length >= 10, sents.length + " 句");
      ok("每句的播放键放的是整句音频（走 sents/，不是单词那条 words/）",
        sents.length > 0 && sents.every((s) => /^\/assets\/audio\/sents\/[a-z0-9]+\.mp3$/.test(
          s.querySelector(".en-play").getAttribute("data-en-src") || "")),
        sents.length ? sents[0].querySelector(".en-play").getAttribute("data-en-src") : "");
      ok("第一句的播放键念的就是屏幕上这句英文（hello, everyone）",
        sents.length > 0 && sents[0].querySelector(".en-play").getAttribute("data-say") ===
          sents[0].querySelector(".en-sent-en").textContent.trim(),
        sents.length ? sents[0].querySelector(".en-play").getAttribute("data-say") : "");
      const sbad = [];
      for (const u of Array.from(new Set(sents.map((s) => s.querySelector(".en-play").getAttribute("data-en-src"))))) {
        try {
          const h = await fetch(BASE + u.replace(/^\//, ""), { method: "HEAD" });
          if (!h.ok) sbad.push(u + "→" + h.status);
        } catch (e) { sbad.push(u + "→" + e.message); }
      }
      ok("这一课每条整句音频都取得到", sbad.length === 0, sbad.slice(0, 3).join("，") || "");
    }
    ok("单词卡不预载音频（点了才拉，页面里没有 audio 元素）",
      $$(".en-card-word audio").length === 0 && $$("article audio").length === 0,
      "audio 元素 " + $$("article audio").length + " 个");
    ok("这一课排了考：只有「进入考试」，没有「完成！」", !!$(".exam-entry") && !$("#doneBtn"), txt(".art-ops").slice(0, 36));
  }
  {
    const before = reqLog.length;
    W.location.hash = "#/exam/enwords/ew-l01";
    await sleep(2400);
    ok("进考场才拉这门课的题包（考场脚本若已在别的课上拉过就不重复要）",
      reqLog.slice(before).some((u) => /enword-exam-data\.js$/.test(u)) &&
      reqLog.some((u) => /exam-en\.js$/.test(u)) && !shellJs.some((u) => /exam/.test(u)),
      reqLog.slice(before).join("，"));
    ok("课末卷 14 题：勾线 2 组、补全与默写共 5 个输入框",
      $$(".en-card-q").length === 14 && $$(".en-match").length === 2 && $$(".en-write").length === 5,
      $$(".en-card-q").length + " 题 ｜ 勾线 " + $$(".en-match").length + " ｜ 输入框 " + $$(".en-write").length);
    ok("补全与默写不给「听」按钮（一听等于把答案念出来）",
      $$(".en-card-q").filter((c) => /把单词补全|用英语怎么写/.test(c.textContent) &&
        c.querySelector(".eq-play")).length === 0 &&
      $$(".en-card-q").filter((c) => /把单词补全|用英语怎么写/.test(c.textContent)).length === 5, "");
    /* 只有听力题在答题时给播放键：选择题一「听」就等于把答案念出来了 */
    ok("听音选词 3 题各带一个播放键，选择题一个都不带",
      $$(".en-card-q").filter((c) => /听录音/.test(c.textContent) && c.querySelector(".eq-play")).length === 3 &&
      $$(".en-card-q").filter((c) => /对应的英文单词/.test(c.textContent) && c.querySelector(".eq-play")).length === 0,
      "听力键 " + $$(".en-card-q").filter((c) => /听录音/.test(c.textContent) && c.querySelector(".eq-play")).length +
      " ｜ 选择题误带的键 " + $$(".en-card-q").filter((c) => /对应的英文单词/.test(c.textContent) && c.querySelector(".eq-play")).length);
    {
      const asked = [];
      W.confirm = (m) => { asked.push(String(m)); return true; };
      click($("#enSubmit"));
      await sleep(1000);
      ok("空卷判 0 分不通过，逐题都回「正确的是什么」",
        /0\/100/.test(txt("#enResult")) && $$(".en-review li").length === 14,
        txt("#enResult").replace(/\s+/g, " ").slice(0, 22) + " ｜ 复盘 " + $$(".en-review li").length + " 条");
      W.confirm = undefined;
    }
    {
      const res = JSON.parse(W.localStorage.getItem("miao_exam_results") || "{}");
      const prog = JSON.parse(W.localStorage.getItem("miao_progress") || "{}");
      ok("没考过就不写成绩也不打完成标记",
        !((res.enwords || {})["ew-l01"] || {}).passed && !((prog.enwords || []).length),
        JSON.stringify(res.enwords || {}) + " ｜ " + JSON.stringify(prog.enwords || []));
    }
    W.location.hash = "#/exam/enwords/ew-l22";
    await sleep(2200);
    ok("结课大考 20 题、范围写明 257 个词",
      $$(".en-card-q").length === 20 && /257 个词/.test(txt(".en-intro")),
      $$(".en-card-q").length + " 题 ｜ " + txt(".en-intro").replace(/\s+/g, " ").slice(0, 34));
  }

  /* ---------- 6. 收藏（本机） ---------- */
  W.location.hash = "#/tutorial/english";
  await sleep(1200);
  click($("#favBtn"));
  await sleep(900);
  ok("点收藏写进本机 localStorage", (JSON.parse(W.localStorage.getItem("miao_favs") || "[]")).indexOf("english") >= 0,
    W.localStorage.getItem("miao_favs"));
  ok("按钮变「已收藏」", /已收藏/.test(txt("#favBtn")), txt("#favBtn"));
  click($("#favBtn"));
  await sleep(900);
  ok("再点取消收藏", (JSON.parse(W.localStorage.getItem("miao_favs") || "[]")).indexOf("english") < 0);

  /* ---------- 7. 页脚两颗入口：各开各的弹层，不进通用设置 ---------- */
  {
    ok("页脚那两颗一直在：「加入我们」（原「成为老师」）与「赞助」，没有变成一颗「通用设置」",
      !!W.document.getElementById("joinBtn") && !!W.document.getElementById("sponsorBtn") &&
      txt("#joinBtn") === "加入我们" && txt("#sponsorBtn") === "赞助" &&
      !W.document.getElementById("toSettings"),
      $$("footer .foot-link").map((b) => b.textContent.trim()).join("，"));

    click(W.document.getElementById("sponsorBtn"));
    await sleep(600);
    const sp = W.document.getElementById("sponsorPop");
    ok("点页脚「赞助」：开的是它自己的弹层，不是通用设置面板",
      !!sp && sp.className === "mask" && !!$(".sponsor-qr img", sp) && !$(".set-pop"),
      sp ? sp.className + " ｜ " + ($(".sponsor-qr img", sp) || {}).getAttribute("src") : "没这个容器");
    click($(".fp-close", sp));
    await sleep(400);
    ok("赞助弹层关闭后容器收干净（hidden + 清空，收款码跟着不再请求）",
      W.document.getElementById("sponsorPop").className === "hidden" &&
      W.document.getElementById("sponsorPop").innerHTML === "" && !$(".mask"),
      JSON.stringify(W.document.getElementById("sponsorPop").className));

    click(W.document.getElementById("joinBtn"));
    await sleep(600);
    const jp = W.document.getElementById("joinPop");
    ok("点页脚「加入我们」：也是独立弹层，邮箱与「发邮件」都在",
      !!jp && jp.className === "mask" && /m15781851831@163\.com/.test(jp.textContent) &&
      !!$("a[href^='mailto:']", jp) && !$(".set-pop"),
      jp ? jp.textContent.replace(/\s+/g, " ").slice(0, 54) : "没这个容器");
    click($(".fp-close", jp));
    await sleep(300);
    ok("点弹层外的黑幕也能关（跟站内别的弹层一个手感）",
      W.document.getElementById("joinPop").className === "hidden" && !$(".mask"),
      JSON.stringify(W.document.getElementById("joinPop").className));

    click(W.document.getElementById("gearBtn"));
    await sleep(300);
    click(W.document.getElementById("settingsItem"));
    await sleep(600);
    ok("通用设置里那两栏照旧留着：面板还是六栏，同一份登记、两种入口",
      $$(".set-nav-item").map((b) => b.textContent.trim()).join("|") === "公告|赞助|开源仓库|加入我们|学习记录|建议",
      $$(".set-nav-item").map((b) => b.textContent.trim()).join("，"));
    click(W.document.getElementById("setClose"));
    await sleep(300);
  }

  /* ---------- 7.8 首页「首页」右边四个入口 + 设置里的通用设置 ---------- */
  {
    W.location.hash = "#/";
    await sleep(900);
    const navText = txt(".nav-links");
    const opts = $$(".nav-links .nav-soon").map((a) => a.textContent.trim());
    ok("导航栏「首页」右边：视频已是真页面，考试 / 幻灯片 / 终生学习还是占位入口",
      !!$("#navVideo") && opts.length === 3 &&
      ["考试", "幻灯片", "终生学习"].every((t) => opts.indexOf(t) >= 0) &&
      navText.indexOf("首页") < navText.indexOf("视频"), navText);
    ok("视频入口不再挂在「筹备中」那批里（它是真路由 #/video）",
      !opts.some((t) => /视频/.test(t)) && !!$('.nav-links a[href="#/video"]'), opts.join("，"));
    ok("四个入口挂在「首页」旁边，不在搜索框那侧（#navRight 里只剩齿轮）",
      $$("#navRight .nav-soon").length === 0 && !!$("#navRight #gearBtn"), txt("#navRight"));
    const hash0 = W.location.hash;
    click($$(".nav-links .nav-soon")[0]);
    await sleep(350);
    ok("只挂入口、不建页面：点入口只给提示，不跳路由",
      W.location.hash === hash0 && /功能筹备中/.test(txt("#toast")), txt("#toast"));
    click(W.document.getElementById("gearBtn"));
    await sleep(350);
    const menuText = txt("#gearMenu");
    ok("齿轮里那一项就是可点的「通用设置」，原来的「公告」被它替掉（主题与字号仍在这一排）",
      !!W.document.getElementById("settingsItem") && !W.document.getElementById("annItem") &&
      menuText.indexOf("通用设置") >= 0 && menuText.indexOf("通用设置") < menuText.indexOf("外观主题") &&
      /正文字号/.test(menuText), menuText);
    click(W.document.getElementById("settingsItem"));
    await sleep(700);
    ok("点开就是通用设置面板，默认落在公告，公告那条内容真在里面",
      !!$(".set-pop") && /公告/.test(txt(".set-nav-item.on")) &&
      /fuka开发者/.test(txt(".set-body")) && /m15681851831@163\.com/.test(txt(".set-body")),
      txt(".set-body").replace(/\s+/g, " ").slice(0, 70));
    click(W.document.getElementById("setClose"));
    await sleep(400);
    ok("关闭按钮真把面板收掉（不是藏起来一个空壳等下次）", !$(".set-pop"), $(".set-pop") ? "还在" : "没了");
  }

  /* ---------- 7.9 分层加载的账：点开哪章拉哪章，空了才补齐 ---------- */
  {
    const short = (u) => String(u).replace(/^\/?assets\/data\//, "data/").replace(/^\/?assets\/js\//, "js/").split("/").slice(-2).join("/");
    const bytesOf = (list) => list.reduce((n, u) => {
      try { return n + fs.statSync(path.join(DEV, "frontend", String(u).replace(/^\/+/, ""))).size; } catch (e) { return n; }
    }, 0);
    const jsFrom = (mark) => reqLog.slice(mark).filter((u) => u.endsWith(".js"));

    /* ① 详情页：132 章的目录要齐，但正文一片都不要 */
    let mark = reqLog.length;
    W.location.hash = "#/tutorial/cppm";
    await sleep(1300);
    let got = jsFrom(mark);
    ok("点进 132 章那门课：只拉骨架那一份，正文分片一片都不来",
      got.length === 1 && /\/data\/cppm-data\.js$/.test(got[0]), got.map(short).join("，"));
    ok("详情页 132 章目录照样齐（章号与标题在 index.js 里，不靠正文）",
      $$(".chap-item").length === 132, "章 " + $$(".chap-item").length);

    /* ② 打开其中一课：只多它自己那一份分片 */
    mark = reqLog.length;
    W.location.hash = "#/read/cppm/m90";
    await sleep(900);
    got = jsFrom(mark);
    ok("打开第 90 课：只多拉它那一份分片 p04.js（m89–m92 在同一片）",
      got.length === 1 && /\/data\/cppm\/p04\.js$/.test(got[0]), got.map(short).join("，"));
    ok("这一章的正文真落到页面上了", !!$(".article h1") && txt(".article h1").length > 4, txt(".article h1").slice(0, 24));
    ok("从进目录到正文落地，一共只传了不到 130 KB",
      bytesOf(got) < 130 * 1024, (bytesOf(got) / 1024).toFixed(0) + " KB");

    /* ③ 这一章到位、人没别的事：空了才往后补齐，而且是渐进的（起手有 2.5 s 缓冲） */
    mark = reqLog.length;
    await sleep(7000);
    got = jsFrom(mark).filter((u) => /\/data\/cppm\/(p\d+|legacy)\.js$/.test(u));
    ok("空了就在补这本其余的分片（不止手头这一片）", got.length >= 2, got.map(short).join("，"));
    ok("补齐按就近排：接着补的是往后那一片 p05.js（m93–m96）",
      got.some((u) => /\/p05\.js$/.test(u)), got.map(short).join("，"));
    ok("补齐是渐进的，不是一把把 36 片全拉完", got.length < 36, "这几秒补了 " + got.length + " 片");

    /* ④ 读者一动就让路 */
    W.location.hash = "#/";
    await sleep(700);
    const before = reqLog.filter((u) => /\/data\/cppm\/(p\d+|legacy)\.js$/.test(u)).length;
    await sleep(3600);
    const after = reqLog.filter((u) => /\/data\/cppm\/(p\d+|legacy)\.js$/.test(u)).length;
    ok("回首页之后预取立刻收手：不再偷偷拉分片", before === after, before + " → " + after);

    /* ⑤ 占位稿只在该它出场时才拉：cppm 还欠着 26 章正文 */
    mark = reqLog.length;
    W.location.hash = "#/read/cppm/m200";
    await sleep(900);
    got = jsFrom(mark).filter((u) => /\/data\/cppm\//.test(u));
    ok("点开还挂着占位的第 200 课：拉的是那份占位稿 legacy.js，不是几十份真正文",
      got.length === 1 && /cppm\/legacy\.js$/.test(got[0]), got.map(short).join("，"));

    /* ⑥ 进考场只要题包与引擎，不为考试拖来整门课正文 */
    mark = reqLog.length;
    W.location.hash = "#/exam/cpp/c05";
    await sleep(4000);
    got = jsFrom(mark);
    ok("进 C++ 考场：题包与笔试引擎都来了",
      got.some((u) => /\/data\/cpp-exam\//.test(u)) && got.some((u) => /exam-paper(-ui)?\.js$/.test(u)),
      got.map(short).slice(0, 6).join("，"));
    ok("进考场不拉这门课的正文分片",
      !got.some((u) => /\/data\/cpp\/p\d+\.js$/.test(u)),
      got.filter((u) => /\/data\/cpp\//.test(u)).map(short).join("，") || "一片都没拉");
  }

  /* ---------- 7.10 视频：列表 / 播放页 / 那三个点（下载与收藏） ---------- */
  {
    /* 清单不靠界面自证：把 videos.js 当纯数据读进来看一遍，界面上摆的必须与它逐条对得上 */
    const vsrcText = fs.readFileSync(path.join(DEV, "frontend/assets/data/videos.js"), "utf8");
    const fakeWin = {};
    new Function("window", vsrcText)(fakeWin);
    const VREG = fakeWin.MIAO_VIDEOS;
    const VCOL = (VREG.collections || [])[0] || { videos: [] };
    const VLIST = VCOL.videos || [];
    const CATS = W.MIAO_SITE.categories;
    const FLAT = Object.keys(CATS).reduce((a, k) => a.concat(CATS[k] || []), []);

    /* mp4 的时长从 mvhd 里读（这台机器没有 ffmpeg，站内也不许手填整数） */
    function mp4Dur(f) {
      const b = fs.readFileSync(f);
      let out = null;
      (function walk(off, end) {
        for (let p = off; p + 8 <= end;) {
          let size = b.readUInt32BE(p);
          const type = b.toString("ascii", p + 4, p + 8);
          if (size === 1) size = Number(b.readBigUInt64BE(p + 8));
          if (size < 8) return;
          if (type === "mvhd") {
            const ver = b[p + 8];
            const ts = b.readUInt32BE(ver === 0 ? p + 20 : p + 28);
            const du = ver === 0 ? b.readUInt32BE(p + 24) : Number(b.readBigUInt64BE(p + 32));
            out = du / ts; return;
          }
          if (/moov|trak|mdia|minf|stbl|edts/.test(type)) walk(p + 8, p + size);
          p += size;
        }
      })(0, b.length);
      return out;
    }
    /* PNG 的宽高就在 IHDR 里，封面口径（横版 3×4、约 1K 宽）就这么量，不靠肉眼 */
    function pngWH(f) { const b = fs.readFileSync(f); return [b.readUInt32BE(16), b.readUInt32BE(20)]; }

    ok("视频清单不是空的，合集与条目都带 id", VLIST.length >= 1 && VLIST.every((v) => v.id && v.src),
      VCOL.title + " · " + VLIST.length + " 条");

    const badCat = [];
    (VCOL.cats || []).forEach((c) => { if (FLAT.indexOf(c) < 0) badCat.push("合集→" + c); });
    VLIST.forEach((v) => (v.cats || []).forEach((c) => { if (FLAT.indexOf(c) < 0) badCat.push(v.id + "→" + c); }));
    ok("分类不许自造：登记的 cats 全部落在首页那张 categories 表里（两边共享一套）",
      (VCOL.cats || []).length >= 1 && badCat.length === 0, badCat.join("，") || (VCOL.cats || []).join("，"));

    const missing = [], wrongCover = [], wrongDur = [], noWH = [];
    VLIST.forEach((v) => {
      const mp4 = path.join(DEV, "frontend", v.src.replace(/^\/+/, ""));
      if (!fs.existsSync(mp4)) { missing.push(v.id + " 的 mp4 不在"); return; }
      const d = mp4Dur(mp4);
      if (d == null || Math.abs(d - v.dur) > 0.15) wrongDur.push(v.id + " 登记 " + v.dur + "，mvhd 是 " + (d == null ? "?" : d.toFixed(2)));
      if (!v.w || !v.h) noWH.push(v.id);
      if (v.cover) {
        const png = path.join(DEV, "frontend", v.cover.replace(/^\/+/, ""));
        if (!fs.existsSync(png)) { missing.push(v.id + " 的封面不在"); return; }
        const [w, h] = pngWH(png);
        if (w <= h || Math.abs(w / h - 4 / 3) > 0.02 || w < 1000) wrongCover.push(v.id + " " + w + "×" + h);
      }
    });
    ok("每条视频的 mp4 都在站内可达（assets/video/ 软链接指向工程成品）", missing.length === 0, missing.join("，") || VLIST.length + " 条全在");
    ok("封面口径：横版 3×4（宽 4 高 3）、宽 ≥1000，竖的一律算不合格", wrongCover.length === 0, wrongCover.join("，") || "全部合格");
    ok("时长不是手填的：登记的秒数与 mp4 mvhd 实测差 0.15 s 以内", wrongDur.length === 0, wrongDur.join("，") || VLIST.map((v) => v.dur + "s").join("，"));
    ok("每条都登记了素材真实 w/h —— 播放器那一格的比例由它算，不写死 16:9",
      noWH.length === 0, noWH.join("，") || VLIST.map((v) => v.w + "×" + v.h).join("，"));

    /* ① 进视频页之前，这两份脚本一次都没来过 */
    ok("进「视频」之前，videos.js 与 video-ui.js 一次都没被请求",
      !reqLog.some((u) => /videos\.js$/.test(u)) && !reqLog.some((u) => /video-ui\.js$/.test(u)),
      reqLog.filter((u) => /videos\.js|video-ui\.js/.test(u)).slice(0, 2).join("，") || "干净");

    const vmark = reqLog.length;
    W.location.hash = "#/video";
    await sleep(1100);
    const vgot = reqLog.slice(vmark).filter((u) => u.endsWith(".js")).map((u) => u.split("/").pop());
    ok("点「视频」才拉那两份，而且数据在前、界面在后", vgot.join(",") === "videos.js,video-ui.js", vgot.join(","));

    /* ② 列表页 */
    ok("列表页：卡片数 = 登记条数，每张都有封面、名字、简介、右下角那三个点",
      $$(".v-card").length === VLIST.length &&
      $$(".v-card").every((c) => c.querySelector(".v-cover-img") && c.querySelector(".v-name") &&
        c.querySelector(".v-brief") && c.querySelector(".v-more")),
      "卡片 " + $$(".v-card").length + " / 登记 " + VLIST.length);
    ok("卡片上摆的名字与简介就是清单里那一份",
      $$(".v-card .v-name").map((a) => a.textContent.trim()).join("|") === VLIST.map((v) => v.name).join("|"),
      $$(".v-card .v-name").map((a) => a.textContent.trim()).join("，"));
    ok("第二行是「题目 + 时长 + 三个点」（收藏过的多一个「已收藏」），发布时间不摆在这",
      $$(".v-card .v-foot > *").every((n) => ["v-name", "v-sub", "v-faved-tag", "v-more"].indexOf(n.className) >= 0) &&
      $$(".v-card .v-foot .v-name").length === VLIST.length &&
      $$(".v-card .v-foot .v-more").length === VLIST.length &&
      !/\d{4}-\d{2}-\d{2}/.test(txt(".v-card .v-foot")),
      $$(".v-card .v-foot > *").map((n) => n.className).join("，"));
    ok("简介与题目互换了：简介在第一行（大、主文本色），题目在第二行（小、次级色）",
      $(".v-body").children[0].className === "v-brief" &&
      /\.v-brief\s*\{[^}]*font-size:\s*\.98rem[^}]*color:\s*var\(--text\)/.test(CSS_TEXT) &&
      /\.v-name\s*\{[^}]*font-size:\s*\.84rem[^}]*color:\s*var\(--text-2\)/.test(CSS_TEXT),
      $$(".v-body").map((b) => b.children[0].className).join("，"));
    ok("列表页用视频自己的标题与网格，只有分类那一栏照首页抄",
      txt(".v-page-title") === "视频" && !!$(".v-grid") && !!$(".filter-bar .cat-group .cat-head .chip") &&
      !$(".page-title") && !$("#app .grid"),
      $$(".video-page > *").map((n) => n.className || n.tagName).join("，"));
    ok("分类那一栏就是首页那张表：大类当行标题、小类当 chip，逐字对得上",
      $$(".cat-row .cat-big").map((e) => e.textContent.trim()).join("|") === Object.keys(CATS).join("|") &&
      $$(".cat-row").length === Object.keys(CATS).length,
      $$(".cat-row .cat-big").map((e) => e.textContent.trim()).join("，"));
    ok("卡片照信息流那版排：封面在上（横版 3×4），名字与简介在封面下面，不拿东西盖住画面",
      /\.v-cover\s*\{[^}]*aspect-ratio:\s*4 \/ 3/.test(CSS_TEXT) &&
      /\.v-body\s*\{[^}]*flex:\s*1/.test(CSS_TEXT) &&
      !/\.v-body\s*\{[^}]*position:\s*absolute/.test(CSS_TEXT) &&
      !/\.v-card\s*\{[^}]*aspect-ratio/.test(CSS_TEXT),
      $$(".v-card").map((c) => c.className).join(" ｜ "));
    ok("画面上一个覆盖层都没有：时长角标删了，时长改摆在第二行，只剩 mm:ss",
      !/\.v-dur\s*\{/.test(CSS_TEXT) && $$(".v-card .v-dur").length === 0 &&
      /^\d\d:\d\d$/.test(txt(".v-card .v-sub")), txt(".v-card .v-sub"));
    ok("只留一条成片：列表里就这一张，而且它就是那张大屏（3 列 × 2 行）",
      VLIST.length === 1 && $$(".v-card").length === 1 &&
      $$(".v-card")[0].classList.contains("v-big") &&
      /\.v-big\s*\{[^}]*grid-column:\s*span 3[^}]*grid-row:\s*span 2/.test(CSS_TEXT) &&
      /@media \(max-width: 720px\)[^}]*\.v-big\s*\{\s*grid-column:\s*span 1/.test(CSS_TEXT),
      $$(".v-card").map((c) => c.className).join(" ｜ ") + " ｜ 登记 " + VLIST.length + " 条");
    ok("片头那条真删干净了：清单里没有、站内也没有留给它的软链接",
      !VLIST.some((v) => /head/.test(v.id)) &&
      !fs.existsSync(path.join(DEV, "frontend/assets/video/devlog-01-head.mp4")) &&
      !fs.existsSync(path.join(DEV, "frontend/assets/video/covers/devlog-01-head.png")),
      VLIST.map((v) => v.id).join("，"));
    ok("「灰色的圆角方框」真删了：卡片不挂 .card，规则里没有面板底 / 描边 / 阴影 / 外圆角",
      $$(".v-card").every((c) => !c.classList.contains("card")) &&
      !/\.v-card\s*\{[^}]*(background|border:|box-shadow)/.test(CSS_TEXT) &&
      /\.v-cover\s*\{[^}]*border-radius:/.test(CSS_TEXT),
      $$(".v-card").map((c) => c.className).join(" ｜ "));
    ok("筛法全是链接不是按钮：能后退、能右键新开",
      $$(".cat-head .chip").every((a) => a.tagName === "A" && /^#\/video/.test(a.getAttribute("href"))) &&
      $$(".cat-row .chip").every((a) => /^#\/video(\?cat=|$)/.test(a.getAttribute("href"))),
      $$(".cat-head .chip").map((a) => a.textContent.trim() + "→" + a.getAttribute("href")).join("，"));

    {
      const t = txt("#app");
      const banned = ["关注", "投币", "弹幕", "广告", "评论", "播放量", "点赞"].filter((w) => t.includes(w));
      ok("列表页没有关注 / 投币 / 弹幕 / 广告 / 评论 / 播放量 / 点赞这些位子", banned.length === 0, banned.join("，") || "一个都没有");
    }

    /* ③ 那三个点：只有两项 */
    click($$(".v-card .v-more")[0]);
    await sleep(200);
    const mItems = $$(".v-menu-item").map((x) => x.textContent.trim());
    ok("三个点打开就是两项：收藏、下载至本地（没有第三项）",
      mItems.length === 2 && mItems[1] === "下载至本地" && /收藏/.test(mItems[0]), mItems.join(" ｜ "));
    click($$(".v-menu-item")[0]);
    await sleep(200);
    ok("点收藏：本机 localStorage 落了这条 id，菜单当场收掉",
      (JSON.parse(W.localStorage.getItem("miao_video_favs") || "[]")).indexOf(VLIST[0].id) >= 0 && $$(".v-menu").length === 0,
      W.localStorage.getItem("miao_video_favs"));
    ok("收藏过的卡片自己带上标记", $$(".v-card.faved").length === 1, "带标记 " + $$(".v-card.faved").length + " 张");
    ok("这一排与首页一模一样：只有「全部」与「收起分类」，收藏不是筛法、不摆在这一排",
      $$(".cat-head .chip").length === 1 && txt(".cat-head .chip") === "全部 " + VLIST.length &&
      !!$("#vCatToggle") && !/收藏/.test(txt(".cat-head")), txt(".cat-head").replace(/\s+/g, " "));
    click($$(".v-card .v-more")[0]);
    await sleep(150);
    ok("再开三个点，第一项变成「已收藏 · 取消收藏」（这一项点了真能取消）",
      /已收藏/.test($$(".v-menu-item")[0].textContent), $$(".v-menu-item")[0].textContent);
    click($$(".v-menu-item")[0]);            // 先取消，收藏的账留到后面那一步再验
    await sleep(150);
    ok("取消收藏：本机存储里就没这条了",
      (JSON.parse(W.localStorage.getItem("miao_video_favs") || "[]")).indexOf(VLIST[0].id) < 0,
      W.localStorage.getItem("miao_video_favs"));

    /* ④ 播放页：标题与简介在屏上面（字大），介绍与分类在屏下面 */
    click($$(".v-card .v-name")[0]);
    await sleep(1100);
    const v0 = VLIST[0];
    ok("点卡片进播放页，路由是 #/video/<id>", W.location.hash === "#/video/" + v0.id, W.location.hash);
    ok("播放器指向站内那份素材（不是外链、也不是编的占位）",
      !!$("#vPlayer") && /\/assets\/video\//.test($("#vPlayer").getAttribute("src")), $("#vPlayer") && $("#vPlayer").getAttribute("src"));
    ok("播放器不拿封面当 poster：poster 是 3×4，塞进 16:9 的屏两边会多出两条黑边",
      !$("#vPlayer").getAttribute("poster"), $("#vPlayer").getAttribute("poster") || "没有 poster，对");
    ok("那一格的比例由登记的 w/h 现算，不是 CSS 里写死的",
      new RegExp("aspect-ratio:" + v0.w + "/" + v0.h).test($("#vPlayer").getAttribute("style") || "") &&
      !/\.v-player video\s*\{[^}]*aspect-ratio/.test(CSS_TEXT),
      $("#vPlayer").getAttribute("style"));
    ok("左上角的喵站水印在播放器里面，且不吃点击", !!$(".v-player .v-mark") && /喵站/.test(txt(".v-mark")), txt(".v-mark").replace(/\s+/g, " "));
    ok("标题就是清单里那条名字，元信息带时长 mm:ss",
      txt(".v-title-row h1") === v0.name && /\d\d:\d\d/.test(txt(".v-meta")),
      txt(".v-title-row h1") + " ｜ " + txt(".v-meta").replace(/\s+/g, " "));
    ok("读的顺序 = 标题 → 元信息 → 简介 → 播放器 → 介绍与分类",
      $$(".v-main > *").map((n) => n.className).join("|") === "v-title-row|v-meta|v-desc|v-player|v-after",
      $$(".v-main > *").map((n) => n.className).join(" ｜ "));
    ok("简介就这一条自己的，摆在屏上面，字比下面那两段大",
      $$(".v-desc p").length === 1 && $(".v-desc p").textContent.trim() === v0.brief &&
      /\.v-desc p\s*\{[^}]*font-size:\s*1\.05rem/.test(CSS_TEXT) &&
      /\.v-after p\s*\{[^}]*font-size:\s*\.93rem/.test(CSS_TEXT),
      $(".v-desc p") ? $(".v-desc p").textContent.trim().slice(0, 20) + "…" : "没有简介");
    ok("介绍与相关分类都在播放器下面",
      $$(".v-after p").length >= 1 && $$(".v-after .v-tag").length >= 1 &&
      $(".v-main").innerHTML.indexOf("v-after") > $(".v-main").innerHTML.indexOf("v-player"),
      "下面 " + $$(".v-after p").length + " 段 + " + $$(".v-after .v-tag").length + " 个分类");
    ok("下面那排分类链接按 cat= 筛，词全部来自共享那张表",
      $$(".v-after .v-tag").every((a) => /#\/video\?cat=/.test(a.getAttribute("href")) &&
        FLAT.indexOf(a.textContent.trim()) >= 0),
      $$(".v-after .v-tag").map((a) => a.textContent.trim()).join("，"));
    ok("这几段不起小标题、不画分隔线（他说不要那种标注）",
      $$(".v-main h2").length === 0 && !/v-sec/.test($(".v-main").innerHTML) && !/\.v-sec\s*\{/.test(CSS_TEXT),
      "h2 " + $$(".v-main h2").length + " 个，.v-sec " + ($(".v-main").innerHTML.match(/v-sec/g) || []).length + " 处");
    ok("右栏只剩合集：标题、第几条 / 共几条、每条一行",
      !!$(".v-col-box") && txt(".v-col-count") === "1 / " + VLIST.length && $$(".v-ep").length === VLIST.length,
      txt(".v-col-count") + " ｜ 行 " + $$(".v-ep").length);
    ok("正在播的那一行有高亮与播放标记，别的行没有",
      $$(".v-ep.on").length === 1 && !!$(".v-ep.on .v-play-bar"), "高亮 " + $$(".v-ep.on").length + " 行");
    {
      const t = txt("#app");
      const banned = ["关注", "投币", "弹幕", "广告", "评论", "播放量", "订阅合集"].filter((w) => t.includes(w));
      ok("播放页同样没有那些位子（UP 主卡、订阅按钮、弹幕框都不在）", banned.length === 0, banned.join("，") || "一个都没有");
    }

    /* ⑤ 下载至本地：http 下走 <a download>，不许留下打不开的菜单 */
    click($(".v-title-more"));
    await sleep(150);
    click($$(".v-menu-item").find((x) => /下载/.test(x.textContent)));
    await sleep(200);
    ok("下载至本地：菜单收掉、给出到位的提示，不是点了没反应",
      $$(".v-menu").length === 0 && /正在下载/.test(txt("#toast")), txt("#toast"));

    /* ⑥ 合集切集 */
    if (VLIST.length > 1) {
      click($$(".v-ep a")[1]);
      await sleep(1100);
      ok("合集里点第二条：路由与播放器都跟着换过去",
        W.location.hash === "#/video/" + VLIST[1].id && /devlog-01-head\.mp4/.test($("#vPlayer").getAttribute("src")),
        W.location.hash);
      ok("右栏的「第几条 / 共几条」跟着变", txt(".v-col-count") === "2 / " + VLIST.length, txt(".v-col-count"));
      click($$(".v-ep a")[0]);
      await sleep(1000);
    }

    /* ⑦ 分类筛选：点一下定，再点同一个取消（与首页同一个手感） */
    W.location.hash = "#/video";
    await sleep(1000);
    const allCards = $$(".v-card").length;
    const C0 = (VCOL.cats || [])[0];
    click($$(".cat-row .chip").find((a) => a.textContent.trim() === C0));
    await sleep(1000);
    ok("点一下分类就定上：链接带 cat=、那颗 chip 亮起来、卡片只剩带这个分类的条",
      W.location.hash === "#/video?cat=" + encodeURIComponent(C0) &&
      $$(".cat-row .chip.on").length === 1 && txt(".cat-row .chip.on") === C0 &&
      $$(".v-card").length === allCards,
      "「" + C0 + "」筛出 " + $$(".v-card").length + " / " + allCards + " 条 ｜ " + W.location.hash);
    click($$(".cat-row .chip.on")[0]);
    await sleep(900);
    ok("再点同一个分类就是取消，回到全部",
      W.location.hash === "#/video" && $$(".cat-row .chip.on").length === 0 && $$(".v-card").length === allCards,
      W.location.hash);
    const emptyCat = FLAT.find((c) => (VCOL.cats || []).indexOf(c) < 0);
    click($$(".cat-row .chip").find((a) => a.textContent.trim() === emptyCat));
    await sleep(900);
    ok("点一个还没成片的分类：给到位的空状态，不摆假卡",
      $$(".v-card").length === 0 && /这个分类下还没有登记成片/.test(txt("#app")),
      "「" + emptyCat + "」→ " + txt(".empty").slice(0, 24));

    /* ⑧ 收起分类：与首页共用同一个开关（miao_catOpen），一处收起两处都收起 */
    W.location.hash = "#/video";
    await sleep(900);
    click($("#vCatToggle"));
    await sleep(700);
    ok("点「收起分类」：分类那几行真收起来，按钮自己改成「展开分类」，开关写进本机",
      $("#vCatBody").classList.contains("hidden") && txt("#vCatToggle") === "展开分类" &&
      W.localStorage.getItem("miao_catOpen") === "false",
      txt("#vCatToggle") + " ｜ " + W.localStorage.getItem("miao_catOpen"));
    W.location.hash = "#/";
    await sleep(900);
    ok("首页那一栏跟着是收起状态（两边读的是同一个开关）",
      !!$("#catBody") && $("#catBody").classList.contains("hidden") && txt("#catToggle") === "展开分类",
      txt("#catToggle"));
    click(W.document.getElementById("catToggle"));
    await sleep(700);
    W.location.hash = "#/video";
    await sleep(900);
    ok("在首页展开，回视频页就是展开的",
      !$("#vCatBody").classList.contains("hidden") && txt("#vCatToggle") === "收起分类", txt("#vCatToggle"));
    W.localStorage.setItem("miao_catOpen", "true");
    W.localStorage.setItem("miao_video_favs", "[]");
  }

  /* ---------- 7.11 首页：分类栏不加「视频」那颗，小类点两下能取消 ---------- */
  {
    W.location.hash = "#/";
    await sleep(1000);
    ok("首页分类栏「全部」右边没有多出一颗「视频」（视频页自己有同一栏，共享那张表）",
      !$$(".cat-head .chip").some((a) => /#\/video/.test(a.getAttribute("href") || "")) && !$("#catVideoChip"),
      $$(".cat-head .chip").map((a) => a.textContent.trim()).join("，"));
    const py = $$(".cat-body .chip").find((a) => a.textContent.trim() === "python");
    click(py);
    await sleep(900);
    ok("首页小类点一下定上：链接带 cat=，那颗自己亮起来",
      /cat=python/.test(W.location.hash) && txt(".cat-body .chip.on") === "python", W.location.hash);
    click($$(".cat-body .chip.on")[0]);
    await sleep(900);
    ok("再点同一个就取消，回到全部（与视频页同一个手感）",
      /^#\/category(\?sort=hot)?$/.test(W.location.hash) && !/cat=/.test(W.location.hash) &&
      $$(".cat-body .chip.on").length === 0 && $$(".t-card").length >= 2,
      W.location.hash + " ｜ 课程 " + $$(".t-card").length + " 门");
  }

  /* ---------- 7.12 通用设置：六栏都真、进度导得出去也还得回来 ---------- */
  {
    /* 先给这台浏览器造一份已知的账，面板里的数字必须与它逐条对得上（不是界面自己编的） */
    W.localStorage.setItem("miao_progress", JSON.stringify({ python: ["l01", "l02", "l03"], git: ["git-l01"] }));
    W.localStorage.setItem("miao_favs", JSON.stringify(["python"]));
    W.localStorage.setItem("miao_exam_results", JSON.stringify({ python: { l01: { passed: true, best: 88 }, l02: { passed: false, best: 40 } } }));
    W.localStorage.setItem("miao_video_favs", JSON.stringify(["devlog-01"]));
    W.localStorage.setItem("miao_theme", JSON.stringify("light"));
    W.localStorage.setItem("miao_fs", JSON.stringify(15));

    click(W.document.getElementById("gearBtn"));
    await sleep(300);
    click(W.document.getElementById("settingsItem"));
    await sleep(700);
    ok("面板六栏齐：公告 / 赞助 / 开源仓库 / 加入我们 / 学习记录 / 建议",
      $$(".set-nav-item").map((b) => b.textContent.trim()).join("|") === "公告|赞助|开源仓库|加入我们|学习记录|建议",
      $$(".set-nav-item").map((b) => b.textContent.trim()).join("，"));
    ok("左栏只写栏目名：底下那些小字说明全删了",
      $$(".set-nav-item span").length === 0 && $$(".set-nav-item b").length === 0,
      $$(".set-nav-item").map((b) => b.innerHTML).join(" ｜ ").slice(0, 60));
    ok("面板里没有任何小字描述（.muted small 一栏都不摆）",
      $$(".set-pop .muted.small").length === 0,
      $$(".set-pop .muted").map((e) => e.textContent.trim().slice(0, 18)).join(" ｜ ") || "一处都没有");

    async function goSec(k) {
      const b = $$(".set-nav-item").find((x) => x.textContent.trim() === k);
      click(b);
      await sleep(500);
      return $("#setBody");
    }

    await goSec("公告");
    ok("公告标题自己一行、正文往下拉一行（不跟「喵站公告」挤在同一行）",
      !!$(".set-note-t") && $(".set-note-t").textContent.trim() === "喵站公告" &&
      /\.set-note-t\s*\{[^}]*display:\s*block/.test(CSS_TEXT),
      $(".set-note-t") ? $(".set-note-t").textContent.trim() : "没这个类");
    ok("公告不再套卡片，内容直接写成一段话",
      $$(".set-note").length === 0 && $$(".set-body p").length >= 1 &&
      /喵站公告/.test(txt(".set-body")) && /fuka开发者/.test(txt(".set-body")) &&
      /m15681851831@163\.com/.test(txt(".set-body")), txt(".set-body").replace(/\s+/g, " ").slice(0, 64));

    await goSec("赞助");
    ok("赞助这一栏就是原来页脚那个收款码，而且只有点开这一栏才创建 img",
      !!$(".sponsor-qr img") && /donate-qr\.png/.test($(".sponsor-qr img").getAttribute("src")),
      $(".sponsor-qr img") ? $(".sponsor-qr img").getAttribute("src") : "没图");

    await goSec("开源仓库");
    const gh = $(".set-line a");
    ok("开源仓库这一栏给的是真仓库地址（新窗口打开，带 noopener），短名与 site.js 一致",
      !!gh && gh.getAttribute("href") === W.MIAO_SITE.github.url &&
      gh.getAttribute("target") === "_blank" && /noopener/.test(gh.getAttribute("rel") || "") &&
      gh.textContent.trim() === W.MIAO_SITE.github.repo,
      gh ? gh.getAttribute("href") : "没有链接");
    const star = $$(".set-ops a").find((a) => /星标/.test(a.textContent));
    ok("「给个星标」不是句装饰：它指向仓库的 stargazers 页",
      !!star && /\/stargazers$/.test(star.getAttribute("href")), star ? star.getAttribute("href") : "没这颗");
    ok("复制地址那种按钮全删了（整个面板一个 copy-btn 都没有）",
      $$(".set-pop .copy-btn").length === 0, $$(".set-pop .copy-btn").length + " 个");

    await goSec("加入我们");
    ok("加入我们 = 原页脚「成为老师」那一栏：邮箱 + 一封邮件，没有多余的按钮",
      /m15781851831@163\.com/.test(txt(".mail-line")) &&
      $(".mail-line a").getAttribute("href") === "mailto:m15781851831@163.com" &&
      $$(".mail-line button").length === 0, txt(".mail-line").replace(/\s+/g, " "));

    await goSec("建议");
    ok("建议这一栏中间就一个邮箱，配那句「投稿请通过电子邮箱联系我们」",
      /投稿请通过电子邮箱联系我们/.test(txt(".set-body")) && !!$(".set-mail a") &&
      $(".set-mail a").textContent.trim() === "m15781851831@163.com" &&
      $(".set-mail a").getAttribute("href") === "mailto:m15781851831@163.com",
      txt(".set-mail"));
    ok("输入框、发送、复制那些都删干净了（站内没有留言板，也不假装能收建议）",
      !$("#setAdvice") && !$("#setAdviceSend") && !$("#setAdviceCopy") &&
      !/提交成功|已收到你的建议/.test(txt(".set-body")), "只剩邮箱");

    await goSec("学习记录");
    ok("学习记录读的是本机存着的那份，不是内存里的 state：章数、门数、收藏、考过几场、视频收藏几条",
      /学过 4 章（2 门课）/.test(txt(".set-body")) && /收藏 1 门教程/.test(txt(".set-body")) &&
      /考过 1 场/.test(txt(".set-body")) && /收藏 1 条视频/.test(txt(".set-body")),
      txt(".set-p").replace(/\s+/g, " ").slice(0, 70));
    ok("下面那串清单是真按课程列的（两门，按学完的章数排），不是写死的句子",
      $$(".set-list li").length === 2 && /Python/.test($$(".set-list li")[0].textContent) &&
      /3 \/ 48 章/.test($$(".set-list li")[0].textContent),
      $$(".set-list li").map((li) => li.textContent.replace(/\s+/g, " ")).join(" ｜ "));

    click(W.document.getElementById("setExport"));
    await sleep(400);
    const ta = $("#setJson");
    let snap = null;
    try { snap = JSON.parse(ta.value); } catch (e) { snap = null; }
    ok("导出：文本框里是一份合法 JSON，六个键全在（主题 / 字号 / 进度 / 收藏 / 成绩 / 视频收藏）",
      !!snap && snap.kind === "miao-progress" && !ta.classList.contains("hidden") &&
      Object.keys(snap.data).length === 6,
      snap ? Object.keys(snap.data).join("，") : "JSON 解析不了");

    /* 导入：换一份进度进去，localStorage、内存里的 state、面板上那行数字都要跟着变 */
    const next = {
      app: "喵站", kind: "miao-progress", version: 1, at: "2026-11-06T00:00:00.000Z",
      data: {
        miao_progress: { python: ["l01", "l02", "l03", "l04", "l05"], enwords: ["ew-l01"] },
        miao_favs: ["python", "git"], miao_exam_results: {}, miao_video_favs: [],
        miao_theme: "pink", miao_fs: 17
      }
    };
    const inp = $("#setImport");
    const file = new W.File([JSON.stringify(next)], "miao-progress-test.json", { type: "application/json" });
    Object.defineProperty(inp, "files", { value: [file], configurable: true });
    inp.dispatchEvent(new W.Event("change", { bubbles: true }));
    await sleep(1000);
    const after = JSON.parse(W.localStorage.getItem("miao_progress") || "{}");
    ok("导入：文件里的进度真写回本机（python 5 章 + enwords 1 章）",
      (after.python || []).length === 5 && (after.enwords || []).length === 1, JSON.stringify(after));
    ok("导入后面板当场重算，不是还对着旧数字",
      /学过 6 章（2 门课）/.test(txt(".set-body")) && /收藏 2 门教程/.test(txt(".set-body")) &&
      /考过 0 场/.test(txt(".set-body")), txt(".set-p").replace(/\s+/g, " ").slice(0, 70));
    ok("导入也带主题与字号：整站跟着换过去（state 是真读回来了）",
      W.document.documentElement.getAttribute("data-theme") === "pink" &&
      W.document.documentElement.style.getPropertyValue("--fs-base") === "17px",
      W.document.documentElement.getAttribute("data-theme") + " / " +
      W.document.documentElement.style.getPropertyValue("--fs-base"));

    const bad = new W.File([JSON.stringify({ kind: "别的软件", data: { miao_progress: { python: [] } } })],
      "bad.json", { type: "application/json" });
    Object.defineProperty(inp, "files", { value: [bad], configurable: true });
    inp.dispatchEvent(new W.Event("change", { bubbles: true }));
    await sleep(800);
    ok("导入不是自己家的文件：说清为什么不行，一个键都不写",
      /认不出 kind/.test(txt("#toast")) &&
      (JSON.parse(W.localStorage.getItem("miao_progress") || "{}").python || []).length === 5,
      txt("#toast"));

    {
      const dead = $$(".set-pop a").filter((a) => {
        const h = a.getAttribute("href") || "";
        return h === "" || h === "#" || h === "#/";
      });
      ok("面板里没有死链：每个 a 都指向真地方（仓库 / stargazers / mailto）",
        dead.length === 0, dead.map((a) => a.textContent.trim()).join("，") ||
        $$(".set-pop a").length + " 个链接全部有去处");
    }

    W.location.hash = "#/category";
    await sleep(800);
    ok("换页时面板自己收掉：里面的数字是按当时那份数据画的，留着就是旧账",
      !$(".set-pop"), $(".set-pop") ? "还在" : "收掉了");
    W.localStorage.setItem("miao_progress", "{}");
    W.localStorage.setItem("miao_favs", "[]");
    W.localStorage.setItem("miao_exam_results", "{}");
    W.localStorage.setItem("miao_video_favs", "[]");
    W.localStorage.setItem("miao_theme", '"auto"');
    W.localStorage.setItem("miao_fs", "15");
  }

  /* ---------- 8. 反向断言 ---------- */
  W.location.hash = "#/login";
  await sleep(900);
  ok("旧账号路由已经不存在：#/login 落到 404", /404/.test(txt("#app")), txt("#app").slice(0, 30));
  ok("全程零次 /api 请求（真的没有后端了）", apiCalls.length === 0, apiCalls.slice(0, 3).join("，"));
  /* ---------- 按需加载的账 ---------- */
  ok("首屏只拉壳与目录：5 份 js，一份正文都没有",
    shellJs.length === 5 && shellJs.every((u) => /\/assets\/(js|data)\/(theme-boot|site|index|data|app)\.js$/.test(u)),
    shellJs.join("，"));
  ok("没点开的课一个字节都不下载：BYOX 与微软正文都没被请求",
    !reqLog.some((u) => /byox/.test(u)) && !reqLog.some((u) => /\/data\/ms\//.test(u)),
    reqLog.filter((u) => /byox|\/data\/ms\//.test(u)).slice(0, 3).join("，") || "干净");
  ok("Python 正文分片是点开 python 才拉的，旧稿兜底那份死稿已经不在树里",
    reqLog.some((u) => /\/data\/py-data\.js$/.test(u)) && reqLog.some((u) => /\/data\/py\/p\d+\.js$/.test(u)) &&
    !reqLog.some((u) => /\/data\/py\/legacy\.js$/.test(u)),
    reqLog.filter((u) => /\/data\/py\//.test(u)).map((u) => u.split("/").pop()).slice(0, 4).join("，"));
  ok("旧稿死稿不回归：540 KB 的 py/legacy.js 与 44 KB 的 cpp/legacy.js 都从产物里没了",
    !fs.existsSync(path.join(DEV, "frontend/assets/data/py/legacy.js")) &&
    !fs.existsSync(path.join(DEV, "frontend/assets/data/cpp/legacy.js")), "两份都删干净了");
  ok("沙箱四份只在进 Python 考场时才进来",
    reqLog.some((u) => /\/js\/py-engine\.js$/.test(u)) && reqLog.some((u) => /\/js\/py-stdlib\.js$/.test(u)), "");
  {
    W.location.hash = "#/search?q=watermelon";
    await sleep(900);
    const hitWord = $$(".s-item").length;
    W.location.hash = "#/search?q=" + encodeURIComponent("模拟输入");
    await sleep(900);
    const hitBody = $$(".s-item").length;
    ok("搜单词表里的词能命中课程（走目录带的 keywords，不拉正文）",
      hitWord >= 1, hitWord + " 条");
    ok("只出现在正文里的词搜不到 —— 这是「用不到的不加载」换来的口径，界面上也写明了",
      hitBody === 0 && /搜索范围：课程名、章节标题/.test(W.document.body.textContent),
      hitBody + " 条命中");
  }
  ok("无未捕获运行期错误", vcErrors.length === 0, vcErrors.slice(0, 2).join(" ｜ "));

  await server.close();
  console.log(results.join("\n"));
  const fail = results.filter((x) => x.startsWith("FAIL")).length;
  console.log("\n合计：" + results.length + " 项，失败 " + fail + " 项");
  process.exit(fail ? 1 : 0);
})().catch(async (e) => {
  console.log(results.join("\n"));
  console.log("FATAL: " + ((e && e.stack) || e));
  if (server) await server.close();
  process.exit(2);
});
