/* 喵站 · 分部正文自检（并行安全：不写 tests/oracle/ 那份共享基准）
 *
 * 干什么：把某一个分部文件里的每一段 python 代码，
 *        ① 用本机 CPython 真跑，② 用浏览器那套沙箱跑，③ 比 stdout 与是否报错。
 * 为什么：py-oracle.js 会覆写 tests/oracle/py-blocks.json，多个任务同时跑会互相踩；
 *        这个工具只读不写，谁都能同时跑。最终基准仍由 py-oracle.js 统一生成。
 *
 * 用法：node dev/tools/blockcheck.cjs dev/frontend/assets/data/py/p2.js [p3.js …]
 * 退出码：全对 0；有对不上的 1。
 *
 * expectError 的段（故意报错的演示）判据反过来：两边都必须非零退出，
 * 且都抛出同一个异常类型 —— 正文里写的那句报错原文必须是真事。
 */
const fs = require("fs");
const os = require("os");
const cp = require("child_process");
const path = require("path");

const DEV = path.resolve(__dirname, "..");
const PY = process.env.MIAO_ORACLE_PY || "python3";
const RUN = require(path.join(DEV, "frontend", "assets", "js", "py-stdlib.js"));
const FIXTURES = {
  "41name.txt": "张三\n李四\n666\n",
  "45name.json": JSON.stringify({ 名字: "张三", 分数: [88, 92], 备注: null }, null, 2) + "\n"
};

function blocksOf(file) {
  const prev = global.window;
  global.window = global;
  /* 一次只算这一个文件的章：上一份文件挂到 global 上的 MIAO_PY_Pn 不清掉的话，
     多文件同跑会把它们再数一遍（p9 虚报成 97 段就是这么来的） */
  Object.keys(global).filter(function (k) { return /^MIAO_PY_P\d+$/.test(k); }).forEach(function (k) { delete global[k]; });
  try {
    delete global.MIAO_PY;
    (0, eval)(fs.readFileSync(file, "utf8"));
  } finally { global.window = prev; }
  const out = [];
  Object.keys(global).forEach(function (k) {
    const m = /^MIAO_PY_(P\d)$/.exec(k);
    if (!m) return;
    (global[k].chapters || []).forEach(function (c) {
      let n = 0;
      (c.blocks || []).forEach(function (b) {
        if (b.t === "code" && b.lang === "python") out.push({ cid: c.id, n: n++, code: b.code, expectError: b.expectError || null, expectHang: b.expectHang || null });
      });
    });
  });
  return out;
}

function normAddr(s) { return String(s).replace(/0x[0-9a-f]{6,}/g, "0xADDR"); }

function runCP(code, dir) {
  fs.writeFileSync(path.join(dir, "main.py"), code.endsWith("\n") ? code : code + "\n", "utf8");
  const r = cp.spawnSync(PY, ["-I", "-X", "frozen_modules=off", "main.py"], {
    cwd: dir, encoding: "utf8", timeout: 20000,
    env: Object.assign({}, process.env, { PYTHONIOENCODING: "utf-8", PYTHONDONTWRITEBYTECODE: "1" })
  });
  return { exit: r.status === null ? -1 : r.status, out: r.stdout || "", err: r.stderr || "" };
}
function runSB(code, dir) {
  const files = {};
  Object.keys(FIXTURES).forEach(function (f) { files[f] = FIXTURES[f]; });
  const r = RUN.run(code, { files: files, root: dir, cwd: dir, file: "main.py", stdin: "", maxSteps: 3000000 });
  /* 沙箱返回的字段是 out / err / exitCode（不是 stdout）—— 第一版抄错了字段名，
     结果每段都拿到空串，22/23 假不一致。engine-test.js 用的就是 r.out。 */
  return { exit: r.exitCode, out: r.out || "", err: r.err || "" };
}
/* 路径类输出两边折成同一个记号，否则一边是 /tmp/xxx 一边是别处 */
/* stderr 可能是全空行，[...][0] 会拿到 undefined —— 崩溃过一次，这里统一兜住 */
function lastLine(s) { const a = String(s || "").split("\n").filter(Boolean); return a.length ? String(a[a.length - 1]).slice(0, 120) : "（无 stderr）"; }
function fold(s, dir) { return normAddr(String(s).split(dir).join("/CWD").split(path.dirname(dir)).join("/PARENT")); }
function errType(err) {
  /* 报错消息会折行（TypeError 后面还跟一句 "when serializing ..."），
     所以扫所有顶格行、取第一个「XxxError:」形状的，别用 .pop() 拿最后一行 */
  const 行 = String(err).split("\n").filter(function (l) { return /^[A-Za-z_]/.test(l); });
  const hit = 行.filter(function (l) { return /^[A-Za-z_][A-Za-z0-9_.]*(Error|Exception|Warning):/.test(l); })[0] || 行[0] || "";
  const m = /^([A-Za-z_][A-Za-z0-9_.]*)/.exec(hit);
  return m ? m[1] : "";
}

function main() {
  const files = process.argv.slice(2);
  if (!files.length) { console.log("用法：node dev/tools/blockcheck.cjs <分部文件.js> […]"); process.exit(2); }
  let total = 0, ok = 0, bad = [];
  files.forEach(function (f) {
    const blocks = blocksOf(path.resolve(f));
    const base = fs.mkdtempSync(path.join(os.tmpdir(), "miao-check-"));
    let fo = 0, fk = 0;
    blocks.forEach(function (b, i) {
      const dir = path.join(base, "b" + i);
      fs.mkdirSync(dir, { recursive: true });
      Object.keys(FIXTURES).forEach(function (x) { fs.writeFileSync(path.join(dir, x), FIXTURES[x], "utf8"); });
      const cp1 = runCP(b.code, dir), sb = runSB(b.code, dir);
      total++;
      /* expectHang：故意的死循环演示。CPython 侧是「20 秒超时跑不完」，
         沙箱侧是「主动掐掉并报步数上限」—— 两边都不该安静地成功，但形态不同，所以单独一档 */
      if (b.expectHang) {
        /* 判据是「有没有跑完」：超时被 kill 时 status 是 null → exit 记 -1。
           死循环本来就会刷几十万字符输出，别拿输出长度当判据（第一版就这么错过） */
        const cpHang = cp1.exit === -1;
        const sbHang = sb.exit !== 0 && /循环|步数|上限|loop|step|timeout/i.test(String(sb.err));
        if (cpHang && sbHang) { ok++; fo++; }
        else bad.push({ where: f + " " + b.cid + "#" + b.n, why: "死循环演示对不上：CPython exit " + cp1.exit +
          " 输出长度 " + String(cp1.out).length + "｜沙箱 exit " + sb.exit + " " + lastLine(sb.err) });
        return;
      }
      if (b.expectError) {
        const both = cp1.exit !== 0 && sb.exit !== 0 && errType(cp1.err) === b.expectError && errType(sb.err) === b.expectError;
        if (both) { ok++; fk++; }
        else bad.push({ where: f + " " + b.cid + "#" + b.n, why: "报错演示对不上：期望 " + b.expectError +
          "｜CPython exit " + cp1.exit + " " + (errType(cp1.err) || String(cp1.err).split("\n").pop().slice(0, 70)) +
          "｜沙箱 exit " + sb.exit + " " + (errType(sb.err) || String(sb.err).split("\n").pop().slice(0, 70)) });
        return;
      }
      const a = fold(cp1.out, dir), c = fold(sb.out, dir);
      const sameExit = cp1.exit === sb.exit || (cp1.exit === 0);
      if (a === c && cp1.exit === 0 && sameExit) { ok++; fo++; }
      else {
        const wl = a.split("\n"), gl = c.split("\n");
        let at = 0; while (at < wl.length && at < gl.length && wl[at] === gl[at]) at++;
        bad.push({ where: f + " " + b.cid + "#" + b.n, why: "第 " + (at + 1) + " 行 期望 " + JSON.stringify(wl[at]) +
          " 实得 " + JSON.stringify(gl[at]) + (cp1.exit !== 0 ? "\n     CPython 非零退出：" + lastLine(cp1.err) : "") +
          (sb.err ? "\n     沙箱报错：" + lastLine(sb.err) : "") });
      }
    });
    fs.rmSync(base, { recursive: true, force: true });
    console.log(path.basename(f) + "：代码 " + blocks.length + " 段 · 正常 " + fo + " · 报错演示 " + fk + " · 不一致 " + (blocks.length - fo - fk));
  });
  bad.slice(0, 25).forEach(function (x) { console.log("--- " + x.where + "\n    " + x.why); });
  console.log("\n合计 " + ok + "/" + total + " 段两边一致" + (bad.length ? " · 有问题 " + bad.length + " 段 ✘" : " ✔"));
  process.exit(bad.length ? 1 : 0);
}
main();
