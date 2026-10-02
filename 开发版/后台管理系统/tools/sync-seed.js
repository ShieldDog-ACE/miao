/**
 * 喵站 · 种子同步工具
 * 把后端种子 后台管理系统/seed-data.js 同步到前端兜底副本 喵站/assets/js/data.js，
 * 消除「改了 seed-data.js 但前端 data.js 还是旧正文」的双副本漂移。
 * 用法：node tools/sync-seed.js [--check]
 *   --check 只比对差异，不写文件（有差异时退出码 1，可用于 CI）
 */
const fs = require("fs");
const path = require("path");
const { load } = require("../config");

const SRC = path.join(__dirname, "..", "seed-data.js");
const DEST = path.join(load().siteDir, "assets", "js", "data.js");
const BANNER = "/* 本文件由 node tools/sync-seed.js 从 后台管理系统/seed-data.js 生成，请勿直接编辑。 */\n";

const src = fs.readFileSync(SRC, "utf8");
const out = BANNER + src;
const current = fs.existsSync(DEST) ? fs.readFileSync(DEST, "utf8") : "";

if (current === out) {
  console.log("[sync-seed] 已一致：" + DEST);
  process.exit(0);
}
if (process.argv.indexOf("--check") >= 0) {
  console.error("[sync-seed] ✘ data.js 与 seed-data.js 不一致，请运行 node tools/sync-seed.js");
  process.exit(1);
}
fs.writeFileSync(DEST, out, "utf8");
console.log("[sync-seed] 已生成 " + DEST + "（" + Buffer.byteLength(out) + " 字节，来源 " + path.basename(SRC) + "）");
console.log("[sync-seed] 注意：已入库的 SQLite 内容不会被本工具改写，需重置库请运行 bash reset-data.sh");
