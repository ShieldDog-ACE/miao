/* 喵站 · 沙箱对拍回归：浏览器内置解释器 vs CPython 基准
 *
 * 基准来自 dev/tools/py-oracle.js（开发期用本机 python3 生成，测试本身不需要 python3）。
 * 分桶口径：
 *   strict/fs —— stdout 必须与 CPython 逐字节一致（fs 桶两边用同一套夹具目录）
 *   loose     —— 输出含随机数/内存大小/解释器内部信息，只要求沙箱能跑完
 * 用法：node dev/tests/engine-test.js [l01 l07 …]
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const DEV = path.resolve(__dirname, "..");
const RUN = require(path.join(DEV, "frontend", "assets", "js", "py-stdlib.js"));
const ORACLE = JSON.parse(fs.readFileSync(path.join(DEV, "tests", "oracle", "py-blocks.json"), "utf8"));

function loadBlocks() {
  /* 正文分七个分部文件，按 index.html 的顺序装配（见 tools/load-data.cjs） */
  const map = {};
  require("../tools/load-data.cjs").loadPy().chapters.forEach((c) => {
    if (!/^l/.test(c.id)) return;
    let n = 0;
    c.blocks.forEach((b) => { if (b.t === "code" && b.lang === "python") map[c.id + "#" + n++] = b.code; });
  });
  return map;
}

function runOne(code, opts) {
  const files = {};
  Object.keys(ORACLE.fixtures || {}).forEach((f) => { if (ORACLE.fixtures[f]) files[f] = ORACLE.fixtures[f]; });
  /* 沙箱的「脚本目录」用 /PARENT/CWD，比对时折成基准里的 /CWD，路径类输出才比得平 */
  return RUN.run(code, Object.assign({ files, root: "/PARENT/CWD", cwd: "/PARENT/CWD", file: "main.py", maxSteps: 3000000 }, opts || {}));
}

/* 内存地址每次都变（CPython 是真地址，沙箱是假地址），比对前统一抹成 0xADDR */
function normAddr(s) {
  return String(s).replace(/0x[0-9a-f]{6,}/g, "0xADDR").split("/PARENT/CWD").join("/CWD");
}

function main() {
  const only = process.argv.slice(2);
  const codes = loadBlocks();
  const want = ORACLE.blocks.filter((b) => !only.length || only.indexOf(b.cid) >= 0);
  const stat = { strict: [0, 0], fs: [0, 0], loose: [0, 0] };
  const diffs = [];
  const crashed = [];
  let t0 = Date.now();
  want.forEach((b) => {
    const key = b.cid + "#" + b.n;
    const src = codes[key];
    if (src === undefined) { diffs.push({ key, why: "基准里有这段，正文里找不到" }); return; }
    let r;
    try { r = runOne(src); }
    catch (e) {
      crashed.push({ key, msg: (e.message || String(e)).slice(0, 200), where: String(e.stack || "").split("\n")[1] });
      return;
    }
    /* 故意报错的演示段：不比 stdout，比的是「沙箱是否也抛出同一类错误」——
       正文里写的那句报错原文必须是真实的，两边一起作证 */
    if (b.expectError) {
      const sbErr = String(r.err || "");
      const both = r.exitCode !== 0 && sbErr.indexOf(b.expectError) >= 0;
      stat.strict[both ? 0 : 1]++;
      if (!both) diffs.push({ key, bucket: "报错演示", want: b.expectError + "（CPython 侧 errOk=" + b.errOk + "）", got: "exit " + r.exitCode + " " + (sbErr.split("\n").filter(Boolean).slice(-1)[0] || "没报错") });
      return;
    }
    if (b.bucket === "hang") {
      /* 故意的死循环演示：CPython 侧是超时，沙箱侧是主动掐 —— 只要求沙箱也没安静地跑成 */
      const okHang = r.exitCode !== 0 && /循环|步数|上限|loop|step/i.test(String(r.err || ""));
      stat.loose[okHang ? 0 : 1]++;
      if (!okHang) diffs.push({ key, bucket: "hang", want: "沙箱报死循环/步数上限", got: "exit " + r.exitCode + " " + String(r.err || "没报错").split("\n").pop() });
      return;
    }
    if (b.bucket === "loose") {
      stat.loose[r.exitCode === b.exit ? 0 : 1]++;
      if (r.exitCode !== b.exit) diffs.push({ key, bucket: "loose", want: "exit " + b.exit, got: "exit " + r.exitCode + " " + (r.err || "").split("\n").pop() });
      return;
    }
    if (normAddr(r.out) === normAddr(b.out)) stat[b.bucket][0]++;
    else stat[b.bucket][1]++;
    if (normAddr(r.out) !== normAddr(b.out)) {
      const wl = normAddr(b.out).split("\n"), gl = normAddr(String(r.out)).split("\n");
      let at = 0;
      while (at < wl.length && at < gl.length && wl[at] === gl[at]) at++;
      diffs.push({
        key, bucket: b.bucket, line: at + 1,
        want: JSON.stringify(wl[at] === undefined ? "<无此> " : wl[at]).slice(0, 150),
        got: JSON.stringify(gl[at] === undefined ? "<缺这行> " : gl[at]).slice(0, 150),
        err: r.exitCode === 0 ? "" : (r.err || "").split("\n").filter(Boolean).slice(-1)[0].slice(0, 150)
      });
    }
  });
  const total = want.length;
  const okAll = stat.strict[0] + stat.fs[0] + stat.loose[0];
  console.log(`沙箱对拍：${total} 段（裁判 ${ORACLE.python}，基准生成于 ${ORACLE.made}）`);
  ["strict", "fs", "loose"].forEach((k) => {
    const n = stat[k][0] + stat[k][1];
    if (n) console.log(`  ${k.padEnd(6)} 一致 ${String(stat[k][0]).padStart(3)}/${String(n).padStart(3)}  不一致 ${stat[k][1]}`);
  });
  console.log(`  合计一致 ${okAll}/${total} · 沙箱自身崩溃 ${crashed.length} 段 · 耗时 ${((Date.now() - t0) / 1000).toFixed(1)} 秒`);
  const show = process.env.MIAO_DIFF_ALL ? diffs : diffs.slice(0, Number(process.env.MIAO_DIFF || 25));
  show.forEach((d) => {
    console.log(`--- ${d.key} [${d.bucket || ""}]`);
    if (d.why) { console.log("    " + d.why); return; }
    if (d.line) console.log(`    第 ${d.line} 行  期望 ${d.want}\n              实得 ${d.got}${d.err ? "\n    stderr " + d.err : ""}`);
    else console.log("    " + d.want + " / " + d.got);
  });
  crashed.slice(0, 10).forEach((c) => console.log(`!!! ${c.key} 沙箱内部异常：${c.msg}\n     at ${c.where}`));
  if (only.length) return process.exit(0);
  const bad = total - okAll + crashed.length;
  console.log(bad === 0 ? "全部一致 ✔" : `存在差异 ${bad} 段 ✘`);
  process.exit(bad === 0 ? 0 : 1);
}
main();
