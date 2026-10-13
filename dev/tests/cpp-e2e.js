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

  /* ---------- 3. 笔试考场：六种题型全走一遍 ---------- */
  W.location.hash = "#/exam/cpp/c01";
  await sleep(2200);
  ok("笔试卷进得来考场（不是 Python IDE 那套）", $$(".en-card-q").length === 8 && !!$("#ppSubmit"), $$(".en-card-q").length + " 题");
  ok("考场脚本按 paper 轨加载：判分器与界面都在 window 上", !!W.MIAO_PAPER && !!W.MIAO_EXAM_PAPER, "");
  ok("题面顶部写着本课任务", /任务题目/.test(txt(".en-intro")), txt(".en-intro").slice(0, 40));

  {
    /* 参考解直接取考卷自带的 selftest.refs[0]（判分器已经验过它是满分，这里验的是界面走不走得通） */
    const paper = W.MIAO_API._local.papers("cpp").c01;
    const ref = paper.selftest.refs[0];
    const cards = $$(".en-card-q");
    let sawOrder = false, sawCode = false, sawOutput = false, codeEd = true;
    paper.questions.forEach((q, i) => {
      const card = cards[i];
      if (!card) return;
      const a = ref[q.id];
      if (q.type === "choice") {
        const r = card.querySelectorAll("input[type=radio]")[Number(a)];
        click(r); click(r);           /* 点两次：验「再点一次取消」，最后一次要点回来 */
        if (Number(r.dataset.was) !== 1) { click(r); }
      } else if (q.type === "multi") {
        (a || []).forEach(ix => { const cb = card.querySelectorAll("input[type=checkbox]")[Number(ix)]; if (cb) click(cb); });
      } else if (q.type === "blank") {
        typeIn(card.querySelector(".en-write"), String(a == null ? "" : a));
      } else if (q.type === "code") {
        sawCode = true;
        /* 他点名的那条：C++ 的代码题不许是裸 textarea —— 行号列与着色层必须真在 */
        const edTa = card.querySelector(".ed-ta");
        if (!(edTa && card.querySelector(".ed-gt") && card.querySelector(".ed-hl"))) codeEd = false;
        typeIn(edTa || card.querySelector(".pp-area"), String(a == null ? "" : a));
      } else if (q.type === "output") {
        sawOutput = true; typeIn(card.querySelector(".pp-area"), String(a == null ? "" : a));
      } else if (q.type === "order") {
        sawOrder = true;
        const steps = card.querySelectorAll(".pp-step");
        (a || []).forEach(ix => click(steps[Number(ix)]));
      }
    });
    ok("卷子里三种代码型题都真渲染了（补代码 / 写输出 / 排序）", sawCode && sawOutput && sawOrder,
      "code " + sawCode + " output " + sawOutput + " order " + sawOrder);
    ok("代码题走共用编辑器控件：行号列 + 着色层 + textarea 四层齐（不是裸 textarea）", codeEd, "");
    ok("作答进度条跟着变", /已答 8 \/ 8/.test(txt("#ppProg")), txt("#ppProg"));
    ok("导航条的圈跟着答题填实（8 题 8 个圈，全填）",
      $$(".pp-navdot").length === 8 && $$(".pp-navdot.filled").length === 8,
      "填了 " + $$(".pp-navdot.filled").length + "/" + $$(".pp-navdot").length);
    click($("#ppSubmit"));
    await sleep(500);
    const score = txt("#ppScore");
    ok("交卷后状态栏给出分数并判过", /得分 100（已过）/.test(score), score);
    ok("逐题复盘每题都有「你答了什么 + 为什么」", $$(".en-review li").length === 8 && /本课一句话|main|编译器/.test(txt(".en-review")), $$(".en-review li").length + " 条");
    const prog = JSON.parse(W.localStorage.getItem("miao_progress") || "{}");
    ok("考过才把这一课写进本机进度", (prog.cpp || []).indexOf("c01") >= 0, JSON.stringify(prog.cpp || []));
    const res = JSON.parse(W.localStorage.getItem("miao_exam_results") || "{}");
    ok("成绩落本机并记最高分", res.cpp && res.cpp.c01 && res.cpp.c01.best === 100 && res.cpp.c01.passed === true,
      JSON.stringify(res.cpp && res.cpp.c01 || {}));
  }

  /* ---------- 4. 错解不写 progress；草稿留在本机 ---------- */
  W.location.hash = "#/read/cpp/c02";
  await sleep(1300);
  W.location.hash = "#/exam/cpp/c02";
  await sleep(1800);
  {
    const cards = $$(".en-card-q");
    ok("第二场考试开得出（每课一场，不是共用一张卷）", cards.length >= 6, cards.length + " 题");
    /* 空卷交卷：confirm 已被 stub 成 true，应当判不过 */
    click($("#ppSubmit"));
    await sleep(400);
    ok("空卷交卷判不过", /未过/.test(txt("#ppScore")), txt("#ppScore"));
    ok("空着的题被点名：卡片与导航圈都标红",
      $$(".en-card-q.miss").length >= 5 && $$(".pp-navdot.miss").length >= 5,
      "卡片 " + $$(".en-card-q.miss").length + " · 圈 " + $$(".pp-navdot.miss").length);
    const prog = JSON.parse(W.localStorage.getItem("miao_progress") || "{}");
    ok("没考过就不写完成标记", (prog.cpp || []).indexOf("c02") < 0, JSON.stringify(prog.cpp || []));
    /* 答一题，退出，再进来 —— 草稿要在 */
    typeIn($(".en-card-q .en-write"), "赋值");
    await sleep(200);
    click($("#ppExit"));
    await sleep(900);
    W.location.hash = "#/exam/cpp/c02";
    await sleep(1600);
    const back = $(".en-card-q .en-write");
    ok("退出再进来，作答草稿还在本机", !!back && back.value === "赋值", back ? JSON.stringify(back.value) : "输入框没了");
  }

  /* ---------- 5. 掌握课的第一场卷 ---------- */
  W.location.hash = "#/exam/cppm/m82";
  await sleep(2000);
  ok("掌握课也排上了笔试（第 82 课进得去）", $$(".en-card-q").length >= 6, $$(".en-card-q").length + " 题");
  ok("试卷标题与课程归属对得上", /算法三件套/.test(txt(".ide-tb-mid")), txt(".ide-tb-mid").slice(0, 30));

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

