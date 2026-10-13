/* 一次性小工具：按 cpp-audit 的 textOf/charCount 口径逐章报字数、块数、图数 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const DEV = path.resolve(__dirname, "..", "..");
const DATA = path.join(DEV, "frontend", "assets", "data");
const charCount = s => String(s).replace(/[\s]/g, "").length;
function textOf(ch) {
  let s = String(ch.title || "");
  (ch.blocks || []).forEach(b => {
    if (b.t === "code" || b.t === "svg") return;
    if (b.t === "ul") { (b.items || []).forEach(x => { s += "\n" + String(x); }); return; }
    s += "\n" + String(b.text || "");
  });
  return s;
}
for (const f of process.argv.slice(2)) {
  const root = {};
  const ctx = vm.createContext({ window: root, root, console });
  const src = fs.readFileSync(path.resolve(DATA, f), "utf8");
  try { vm.runInContext(src, ctx); } catch (e) { console.log("!! " + f + " 跑不起来: " + e.message); continue; }
  for (const k of Object.keys(root)) {
    if (!/^MIAO_CPPM?_P\d+$/.test(k)) continue;
    for (const ch of (root[k].chapters || [])) {
      const long = (ch.blocks || []).filter(b => b.t === "code" && String(b.code || "").split("\n").length > 14).length;
      console.log(`${ch.id}  字数 ${charCount(textOf(ch))}  块 ${ch.blocks.length}  图 ${(ch.blocks || []).filter(b => b.t === "svg").length}  超长段 ${long}`);
    }
  }
}
