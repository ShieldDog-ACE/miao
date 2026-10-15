/* 喵站 · C++ 两门课的 E2E（jsdom + 自带静态服务器，第九轮 T-19/T-20 的回归）
 *
 * 盯的是三件以前没有对应物的事：
 *   1. 笔试考场（engine:"paper"）真能走通：进考场 → 六种题型都能作答 → 交卷 → 逐题复盘 → 考过打完成标记；
 *   2. 「考过才算完成」对 C++ 同样成立：错解交卷不写 progress，参考解交卷才写；
 *   3. 阅读页代码高光（rd-*）真的在 DOM 上 —— 这是他点的「该有的高光也要有」。
 * 跑法：node dev/tests/cpp-e2e.js（也在 bash dev/tests/run.sh 里）
 */
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");
const { start } = require("./static-server.js");

const DEV = path.resolve(__dirname, "..");
/* 跟 ui-e2e 用同一台端口会撞（前一个 server 关掉到端口释放有延迟），错开一位 */
const PORT = Number(process.env.MIAO_TEST_PORT || 8797) + 1;
const BASE = "http://127.0.0.1:" + PORT + "/";

const results = [];
function ok(name, cond, extra) {
  results.push((cond ? "PASS" : "FAIL") + " | " + name + (extra != null && extra !== "" ? "  → " + extra : ""));
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
let W = null;
const $ = s => W.document.querySelector(s);
const $$ = s => Array.prototype.slice.call(W.document.querySelectorAll(s));
const click = el => { if (el) el.dispatchEvent(new W.MouseEvent("click", { bubbles: true })); };
const typeIn = (el, v) => { if (!el) return; el.value = v; el.dispatchEvent(new W.Event("input", { bubbles: true })); };
const txt = s => { const e = $(s); return e ? e.textContent.replace(/\s+/g, " ").trim() : ""; };

let server = null;
const reqLog = [];

(async () => {
  server = await start(PORT, u => reqLog.push(String(u).split("?")[0]));
  const html = fs.readFileSync(path.join(DEV, "frontend", "index.html"), "utf8");
  const vcErrors = [];
  const dom = new JSDOM(html, {
    url: BASE, runScripts: "dangerously", resources: "usable", pretendToBeVisual: true,
    beforeParse(w) {
      w.addEventListener("error", e => vcErrors.push(String(e.message)));
      w.confirm = () => true;            /* 拦「还有 N 题没做」的确认框，测试里照常交卷 */
    }
  });
  W = dom.window;
  await sleep(2500);
  const firstScreen = reqLog.slice();      /* 首屏到底拉了什么，此刻定终身 */

  /* ---------- 1. 两门课进站在哪 ---------- */
  const tutIds = (W.MIAO_API._local.tutorials || []).map(t => t.id);
  ok("C++ 两门课都登记进目录了", tutIds.indexOf("cpp") >= 0 && tutIds.indexOf("cppm") >= 0, tutIds.join(","));
  const cpp = (W.MIAO_API._local.tutorials || []).find(t => t.id === "cpp");
  const cppm = (W.MIAO_API._local.tutorials || []).find(t => t.id === "cppm");
  ok("入门 84 章（3 节第 0 课 + 81 正课）/ 掌握 132 章，课号不重排",
    cpp && cpp.chaps === 84 && cppm && cppm.chaps === 132,
    cpp && cppm ? cpp.chaps + " / " + cppm.chaps : "缺章");
  ok("第 0 课三节在目录里，且不排考试（页脚该留「完成！」那种按钮）",
    cpp.chapters.some(c => c.id === "s01") && cpp.chapters.some(c => c.id === "s03") &&
    (cpp.examIds || []).indexOf("s01") < 0 && (cpp.examIds || []).indexOf("s03") < 0,
    "examIds " + ((cpp.examIds || []).length) + " 场");
  ok("入门与掌握是两门独立的课（不同 id、不同封面、不同难度），但同挂一个「C++」分类位",
    cpp.id !== cppm.id && cpp.cat === "C++" && cppm.cat === "C++" &&
    cpp.diff === "入门" && cppm.diff === "掌握" && cpp.cover !== cppm.cover,
    cpp.cat + " / " + cpp.diff + " · " + cppm.cat + " / " + cppm.diff);
  ok("首屏请求里没有任何 C++ 文件（这门课没点开就不该下载）",
    !firstScreen.some(u => /cpp/.test(u)), firstScreen.filter(u => /cpp/.test(u)).join(" | "));

  /* ---------- 2. 阅读页：真实正文 + 代码高光 ---------- */
  W.location.hash = "#/read/cpp/c01";
  await sleep(1400);
  ok("第 1 课正文渲染出来（不是占位）", /原理讲解/.test(txt("#app")) && !/正文还在写/.test(txt("#app")), txt(".article h1").slice(0, 30));
  {
    const kws = $$(".code-block pre code .rd-kw");
    const strs = $$(".code-block pre code .rd-str");
    const pres = $$(".code-block pre code .rd-pre");
    ok("阅读页 C++ 代码块有语法高光（关键字 / 字符串 / 预处理三类都在）",
      kws.length > 0 && strs.length > 0 && pres.length > 0,
      "rd-kw " + kws.length + " · rd-str " + strs.length + " · rd-pre " + pres.length);
    ok("高光没把代码吃字符：可见文本仍等于原代码（含尖括号）",
      /#include\s*<print>/.test(txt(".code-block pre")), txt(".code-block pre").slice(0, 40));
    {
      /* 第八轮踩过的那个坑：JS 发出十几个类、CSS 只定义一少半，剩下的静默退回默认字色，
         看着像「主题没配好」，theme-check 也查不出来。rd-* 同理，这里逐类钉住。 */
      const CSSTXT = fs.readFileSync(path.join(DEV, "frontend/assets/css/style.css"), "utf8");
      const need = ["rd-kw", "rd-str", "rd-com", "rd-num", "rd-pre", "rd-fn", "rd-cls", "rd-tag", "rd-atr"];
      const missing = need.filter(c => !new RegExp("\\." + c + "\\s*\\{").test(CSSTXT));
      ok("app.js 发出去的每一个 rd-* 高光类，style.css 里都真有规则", missing.length === 0, "缺规则：" + missing.join(" "));
      const undef = need.map(c => "--" + c).filter(t => !new RegExp(t + "\\s*:").test(CSSTXT));
      ok("高光色全走主题令牌（三套都有定义，不写死色、不引用没定义的令牌）", undef.length === 0, "缺令牌：" + undef.join(" "));
    }
    const shellHl = $$(".code-block pre code .rd-fn").length;
    ok("shell 命令块也有高光", shellHl > 0, "rd-fn " + shellHl);
  }
  ok("课末只剩「进入考试」，没有白送的完成按钮", !!$(".exam-entry") && !$("#doneBtn"), txt(".exam-entry").slice(0, 20));

  /* 占位章也得诚实说明自己在占位（不许拿骨架当进度）—— 号段每天在变，运行时现找一个仍是占位的章 */
  {
    const packs = W.MIAO_API._local;
    let ph = null;
    ["cppm", "cpp"].forEach(id => {
      (packs.full[id] || []).forEach(c => {
        if (!ph && (c.blocks || []).some(b => b && /正文还在写/.test(String(b.text || "")))) ph = { id, cid: c.id };
      });
    });
    if (!ph) ok("所有章都已写完（占位断言本轮没有对象）", true, "");
    else {
      W.location.hash = "#/read/" + ph.id + "/" + ph.cid;
      await sleep(1300);
      ok("没写完的章明确写着「正文还在写」并列出源稿任务（抽查 " + ph.cid + "）",
        /正文还在写/.test(txt("#app")) && /任务（预告）/.test(txt("#app")), txt(".article h1").slice(0, 34));
    }
  }

  /* ---------- 3. 单编辑器那一屏：C++ 考场与 Python 考场同一件外壳（第二十轮 D-88） ---------- */
  const packOf = tid => (W.MIAO_API && W.MIAO_API._local.papers(tid)) || {};
  W.location.hash = "#/exam/cpp/c01";
  await sleep(2200);
  {
    const paper = packOf("cpp").c01;
    ok("每场都是那一屏：标题栏 / 编辑区 / 下方面板 / 状态栏四块齐",
      !!$("#ideRoot") && !!$("#ideEditor") && !!$("#idePanel") && !!$(".ide-titlebar") && !!$(".ide-status"), "");
    ok("卡片卷彻底不在了：一枚选择题框、一张题号卡片都没有",
      $$(".en-card-q").length === 0 && $$('input[type=radio], input[type=checkbox]').length === 0,
      "卡片 " + $$(".en-card-q").length + " 张");
    ok("编辑器是四层那一件（行号列 + 着色层 + textarea），不是裸 textarea",
      !!$(".ed-gt") && !!$(".ed-hl") && !!$(".ed-ta"), "行号 " + ($(".ed-gt") ? $(".ed-gt").children.length : 0) + " 格");
    ok("C++ 那把尺在着色：题面注释与预处理的形状都认得（不是整片无色）",
      $$(".ed-hl .tk-com, .ed-hl .tk-self, .ed-hl .tk-kw, .ed-hl .tk-str").length > 0,
      "tk-com " + $$(".ed-hl .tk-com").length + " · tk-self " + $$(".ed-hl .tk-self").length);
    const taVal = String($("#ideTa").value);
    const condLines = taVal.split("\n").filter(l => /^\s*\/\/\s*条件\d+/.test(l)).length;
    ok("题面就是文件顶部那几行 // 注释，条数与判定清单一样",
      /^\/\//.test(taVal.trim()) && condLines > 0 && condLines === $$("#jdList li").length,
      "题面 " + condLines + " 条 / 清单 " + $$("#jdList li").length + " 条");
    ok("C++ 这两颗按钮真在：编译 与 运行", !!$("#ideBuild") && !!$("#ideRun"), "");

    /* 编译：形状错误要点名，行号要能点 */
    typeIn($("#ideTa"), "#include <print>\nint main(){ std::println(\"hi\" }\n");
    await sleep(200);
    click($("#ideBuild"));
    await sleep(400);
    ok("按编译：终端打出 g++ 那一条命令并点名错误",
      /\$ g\+\+ -std=c\+\+23/.test(txt("#term")) && /error:/.test(txt("#term")), txt("#term").slice(0, 60));
    ok("报错里的「第 N 行」是能点的按钮", $$("#term .tb-jump").length > 0, $$("#term .tb-jump").length + " 颗");
    if ($$("#term .tb-jump")[0]) {
      const want = Number($$("#term .tb-jump")[0].getAttribute("data-line"));
      click($$("#term .tb-jump")[0]);
      await sleep(200);
      const ta2 = $("#ideTa"), lnBefore = String(ta2.value).slice(0, ta2.selectionStart).split("\n").length;
      ok("点完行号，光标落到那一行", lnBefore === want, "跳到第 " + lnBefore + " 行（按钮写的是 " + want + "）");
    }

    /* 运行：站内那台 C++ 子集机器真把参考解跑出输出 */
    const ref0 = String((paper.selftest || {}).refs ? paper.selftest.refs[0] : "");
    typeIn($("#ideTa"), ref0);
    await sleep(200);
    click($("#ideRun"));
    await sleep(600);
    const termTxt = txt("#term");
    ok("按运行：打出 $ ./main 与这段程序的真输出",
      /\$ \.\/main/.test(termTxt) && /退出码 0/.test(termTxt) && termTxt.length > 30,
      termTxt.replace(/\s+/g, " ").slice(-90));

    /* 抄题面不白拿分：把注释留在文件里、代码一行不写 */
    typeIn($("#ideTa"), "// 条件1：写一行 println\n//\n// std::println(\"你好，C++\");\n// #include <print>\n");
    await sleep(200);
    click($("#ideSubmit"));
    await sleep(500);
    ok("把条件原样抄进注释交卷判 0 分（判分先剥注释）",
      /得分 0（未过）/.test(txt("#stScore")), txt("#stScore"));

    /* 参考解交卷：满分、打完成标记 */
    typeIn($("#ideTa"), ref0);
    await sleep(200);
    click($("#ideSubmit"));
    await sleep(500);
    ok("按参考写法交卷判满分并通过", /得分 100（已过）/.test(txt("#stScore")), txt("#stScore"));
    ok("判定清单逐条打勾", $$("#ideResult .sd-checks li.pass").length >= 3,
      "过了 " + $$("#ideResult .sd-checks li.pass").length + " 条");
    ok("复盘里给的是参考写法，不甩裸正则",
      !/acceptRegex/.test(txt("#ideResult")) && /参考写法|命中/.test(txt("#ideResult")), txt("#ideResult").slice(0, 50));
    const prog = JSON.parse(W.localStorage.getItem("miao_progress") || "{}");
    ok("考过了才打完成标记", (prog.cpp || []).indexOf("c01") >= 0, JSON.stringify((prog.cpp || []).slice(-3)));
  }

  /* ---------- 4. 另一场：空骨架不该过关，草稿要留在本机 ---------- */
  W.location.hash = "#/exam/cpp/c02";
  await sleep(1800);
  {
    const paper = packOf("cpp").c02;
    ok("每课一场自己的卷（条件 3–6 条）",
      $$("#jdList li").length >= 3 && $$("#jdList li").length <= 6, $$("#jdList li").length + " 条条件");
    typeIn($("#ideTa"), "// 第 2 课\n//\n" + String(paper.starter || "") + "\n// 还没想好怎么写\n");
    await sleep(200);
    click($("#ideSubmit"));
    await sleep(500);
    ok("只把骨架与注释留着交卷过不了线", /未过/.test(txt("#stScore")), txt("#stScore"));
    const prog0 = JSON.parse(W.localStorage.getItem("miao_progress") || "{}");
    ok("没考过就不写完成标记", (prog0.cpp || []).indexOf("c02") < 0, JSON.stringify(prog0.cpp || []));
    typeIn($("#ideTa"), "// 我写到一半\n//\nint main(){ return 0; }\n");
    await sleep(300);
    click($("#ideExit"));
    await sleep(900);
    W.location.hash = "#/exam/cpp/c02";
    await sleep(1600);
    ok("退出再进来，编辑器里那份草稿还在",
      /我写到一半/.test(String($("#ideTa").value)), JSON.stringify(String($("#ideTa").value).slice(0, 24)));
  }

  /* ---------- 5. 掌握那门课同一屏（不是只有入门改了） ---------- */
  W.location.hash = "#/exam/cppm/m82";
  await sleep(2000);
  {
    const m82 = packOf("cppm").m82;
    ok("掌握课也走这一屏：一块编辑器、零张卡片",
      !!$("#ideEditor") && $$(".en-card-q").length === 0 && !!$(".ed-ta"), "");
    ok("这一场的形状字段是单编辑器", !!m82 && m82.mode === "ide", "mode " + (m82 && m82.mode));
    ok("试卷标题与课程归属对得上", /第 82 课|管道思想|算法/.test(txt(".ide-tb-mid")), txt(".ide-tb-mid").slice(0, 30));
  }

  /* ---------- 6. 反向闸：按需加载与 /api ---------- */
  const shellJs = firstScreen.filter(u => u.endsWith(".js"));
  ok("首屏一份 C++ 正文都不拉（按需加载守住）",
    !firstScreen.some(u => /assets\/data\/cpp/.test(u)) && shellJs.length <= 7,
    "首屏 js " + shellJs.length + " 份");
  ok("点进 C++ 课之后才拉它的正文", reqLog.some(u => /assets\/data\/cpp\/(legacy|p\d+)\.js/.test(u)), "");
  ok("进考场才拉笔试引擎与题包", reqLog.some(u => /exam-paper(-ui)?\.js/.test(u)) && reqLog.some(u => /cpp-exam\/p\d+\.js/.test(u)), "");
  ok("全程一次 /api 请求都没有", !reqLog.some(u => /\/api\//.test(u)),
    reqLog.filter(u => /\/api\//.test(u)).slice(0, 2).join(" | "));
  ok("没有未捕获的页面运行期错误", vcErrors.length === 0, vcErrors.slice(0, 3).join(" | "));

  const fails = results.filter(r => r.startsWith("FAIL"));
  results.forEach(r => console.log(r));
  console.log("\n合计 " + results.length + " 项，失败 " + fails.length + " 项");
  server.close && server.close();
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.error("测试自己崩了：" + (e && e.stack || e)); server && server.close && server.close(); process.exit(1); });

