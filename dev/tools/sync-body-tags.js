/* 喵站 · 正文清单同步（改成按需加载之后，这一份只是 gen-index.js 的门面）
 *
 * 以前它干的是「把 assets/data/ms/*.js 逐个写成 index.html 里的 <script> 标签」——
 * 上一轮就是忘了同步，74 个正文文件里只有 19 个被引用，站上看着像「全是占位」。
 * 现在 index.html 不再列正文（列了就等于首屏 3 MB），正文清单搬到 site.js 的 glob，
 * 由 dev/tools/gen-index.js 展开进 assets/data/index.js，点开那门课才注入。
 *
 * 不变的那件事：磁盘上有正文文件而没人登记，必须报错。这条现在由 gen-index.js 把关，
 * 这个脚本保留原来的「跑一次对齐 + 自查」用法，别让人记两套命令。
 *
 * 跑法：node dev/tools/gen-index.js && node dev/tools/sync-body-tags.js
 */
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const DEV = path.resolve(__dirname, "..");
const OUT = path.join(DEV, "frontend", "assets", "data", "index.js");

const r = spawnSync(process.execPath, [path.join(DEV, "tools", "gen-index.js")], { encoding: "utf8" });
process.stdout.write(r.stdout || "");
process.stderr.write(r.stderr || "");
if (r.status !== 0) { console.log("目录生成失败 ✘"); process.exit(r.status || 1); }

/* 自查：index.js 里登记的正文文件数，必须等于磁盘上这些目录里的文件数 */
const idx = fs.readFileSync(OUT, "utf8");
const dirs = ["ms", "byox", "py", "exam-parts"];
let bad = 0;
dirs.forEach(d => {
  const dir = path.join(DEV, "frontend", "assets", "data", d);
  if (!fs.existsSync(dir)) return;
  const disk = fs.readdirSync(dir).filter(f => f.endsWith(".js"));
  const listed = disk.filter(f => idx.indexOf("assets/data/" + d + "/" + f) >= 0);
  const missing = disk.filter(f => listed.indexOf(f) < 0);
  if (missing.length) {
    const parked = /^(web|db|os|lang|game|net|3d|ar|aimodel|alloc|bot|browser|bt|chain|cli|cpu|dist|docker|editor|emu|fe|git|nn|physics|regex|search|shell|tpl|vision|voxel)-c\d+\.js$/;
    if (d === "byox" && missing.every(f => parked.test(f))) {
      console.log(`· ${d}/：${disk.length} 份，${missing.length} 份未登记 —— BYOX 整门课是有意停用的车位，不算错`);
      return;
    }
    console.log(`!! ${d}/：磁盘 ${disk.length} 份，目录里登了 ${listed.length} 份，漏：${missing.slice(0, 6).join(" ")}`);
    bad++;
  } else {
    console.log(`· ${d}/：${disk.length} 份全部在目录里 ✔`);
  }
});
console.log(bad ? "有正文文件没进目录 ✘" : "正文与目录一致 ✔");
process.exit(bad ? 1 : 0);
