/* 出题助手：把指定课次的正文摘要打出来（标题 / 本课目标 / 全部 h2 / 演示代码 / 【任务】栏）
 *
 * 用法：node dev/tools/lesson-dump.js l04 l05 l06
 *      node dev/tools/lesson-dump.js l10 --code   # 连演示代码一起打（默认打）
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const DEV = path.resolve(__dirname, "..");
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(DEV, "frontend", "assets", "data", "py-data.js"), "utf8"), ctx, { timeout: 9000 });
const tut = ctx.window.MIAO_PY.tutorial;
const want = process.argv.slice(2).filter((a) => !a.startsWith("--"));
if (!want.length) { console.error("用法：node dev/tools/lesson-dump.js l04 l05 …"); process.exit(1); }

tut.chapters.forEach((c) => {
  if (want.indexOf(c.id) < 0) return;
  console.log("═".repeat(70));
  console.log("### " + c.id + " · " + c.title);
  let inTask = false;
  c.blocks.forEach((b) => {
    if (b.t === "tip" && /本课目标/.test(b.text || "")) console.log("〔目标〕" + b.text.replace(/^本课目标：/, ""));
    if (b.t === "h2") { inTask = /任务/.test(b.text); console.log("\n── " + b.text); return; }
    if (b.t === "ul" && inTask) { b.items.forEach((x, i) => console.log(`  任务${i + 1}. ${x}`)); return; }
    if (b.t === "code" && b.lang === "python") { console.log("  ▶ 演示：\n" + b.code.split("\n").map((l) => "      " + l).join("\n")); return; }
    if (b.t === "tip" && /本课一句话/.test(b.text || "")) console.log("\n〔一句话〕" + b.text.replace(/^本课一句话：/, ""));
  });
});
