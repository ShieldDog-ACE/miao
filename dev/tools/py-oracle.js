/* 喵站 · 沙箱对拍基准生成器（开发期工具，只在本机跑，不进运行时、不进镜像）
 *
 * 干什么：把 py-data.js 里 45 课的每一段 python 代码，用本机 CPython 真跑一遍，
 *        把 stdout / 退出码 / 分桶结论存成 dev/tests/oracle/py-blocks.json。
 * 为什么：浏览器里的内置解释器要有一个「说真话」的裁判，否则「像不像 Python」只是嘴上说。
 *        有了这份基准，回归测试只依赖 JSON，不在测试机上要求 python3。
 *
 * 用法：node dev/tools/py-oracle.js            # 重新生成全部
 *      node dev/tools/py-oracle.js l01 l07    # 只重生成指定课
 *
 * 分桶规则（决定要不要逐字节比 stdout）：
 *   strict  普通计算与打印            —— 必须与 CPython 完全一致
 *   fs      用到 open/Path/os/json 文件 —— 两边都用同一套夹具目录，仍要求完全一致
 *   loose   输出里有随机数/内存大小/解释器内部信息 —— 只要求沙箱能跑完（退出码 0 或与 CPython 同码）
 */
const fs = require("fs");
const path = require("path");
const os = require("os");
const vm = require("vm");
const cp = require("child_process");

const DEV = path.resolve(__dirname, "..");
const DATA = path.join(DEV, "frontend", "assets", "data", "py-data.js");
const OUT = path.join(DEV, "tests", "oracle", "py-blocks.json");
const PY = process.env.MIAO_ORACLE_PY || "python3";

/* 夹具：l41/l45 读的文件先备好，两边同一份内容 */
const FIXTURES = {
  /* 第四轮 D-33：夹具里也不许再出现旧梗，示例统一用中性名词 */
  "41name.txt": "张三\n李四\n666\n",
  "45name.json": JSON.stringify({ 名字: "张三", 分数: [88, 92], 备注: null }, null, 2) + "\n",
  "本课演示模块.py": ""            // l38 自己 write_text 出来，这里只留个占位
};

function loadBlocks() {
  /* 正文从第四轮起分七个分部文件，必须按 index.html 的顺序装配（见 load-data.cjs） */
  const tut = require("./load-data.cjs").loadPy().tutorial;
  const blocks = [];
  tut.chapters.forEach((c) => {
    if (!/^l/.test(c.id)) return;
    let n = 0;
    c.blocks.forEach((b) => {
      /* expectError：故意报错的演示行。不再靠注释藏着，而是真跑，
         由基准记下 CPython 实际报的错，engine-test 要求沙箱报同一类错。 */
      if (b.t === "code" && b.lang === "python") blocks.push({ cid: c.id, n: n++, code: b.code, expectError: b.expectError || null, expectHang: b.expectHang || null });
    });
  });
  return blocks;
}

function bucketOf(code, b) {
  if (b && b.expectHang) return "hang";   // 故意的死循环：裁判侧只看「有没有超时」
  if (/\bopen\s*\(|Path\(|os\.|shutil|read_text|write_text|listdir|iterdir|glob|unlink|mkdir|rmtree|stat\(/.test(code)) return "fs";
  if (/getsizeof|random|time\.|sys\.path|builtin_module_names|sys\.modules|__pycache__|import this|id\(|compile\(|Decimal|perf_counter|\bdir\(/.test(code)) return "loose";
  return "strict";
}

function runCPython(code, cwd) {
  const file = path.join(cwd, "main.py");
  fs.writeFileSync(file, code.endsWith("\n") ? code : code + "\n", "utf8");
  try {
    const r = cp.spawnSync(PY, ["-I", "-X", "frozen_modules=off", "main.py"], {
      cwd, encoding: "utf8", timeout: 20000, env: Object.assign({}, process.env, { PYTHONIOENCODING: "utf-8", PYTHONDONTWRITEBYTECODE: "1" })
    });
    return { code: r.status === null ? -1 : r.status, out: r.stdout || "", err: r.stderr || "" };
  } catch (e) {
    return { code: -1, out: "", err: String(e.message) };
  }
}

function main() {
  let ver = "";
  try { ver = cp.execSync(PY + " -V 2>&1").toString().trim(); } catch (e) { console.error("找不到 python3，无法生成基准：" + e.message); process.exit(1); }
  const only = process.argv.slice(2);
  const blocks = loadBlocks().filter((b) => !only.length || only.indexOf(b.cid) >= 0);
  console.log(`裁判：${ver} · 待跑代码块 ${blocks.length} 段`);
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "miao-oracle-"));
  const results = [];
  let t0 = Date.now();
  blocks.forEach((b) => {
    /* 每段独立目录，段与段之间不留残留 */
    const dir = path.join(base, b.cid + "_" + b.n);
    fs.mkdirSync(dir, { recursive: true });
    Object.keys(FIXTURES).forEach((f) => { if (FIXTURES[f]) fs.writeFileSync(path.join(dir, f), FIXTURES[f], "utf8"); });
    const r = runCPython(b.code, dir);
    /* 路径归一：脚本自己的目录 → /CWD，上一级（l45 会 chdir 过去再打印）→ /PARENT
       沙箱侧用同样的 root/cwd 跑，两边才比得出真差异 */
    const parent = path.dirname(dir);
    const norm = (s) => String(s).split(dir).join("/CWD").split(parent).join("/PARENT");
    const firstErr = (r.err || "").split("\n").filter((l) => /^[A-Za-z_.]*(Error|Exit|Iteration|KeyboardInterrupt)/.test(l))[0] || "";
    results.push({
      cid: b.cid, n: b.n, bucket: bucketOf(b.code, b), expectHang: b.expectHang || null,
      exit: r.code, out: norm(r.out), errFirst: firstErr,
      expectError: b.expectError,
      /* 报错演示的硬证据：CPython 必须真的非零退出，且报错行里出现那个类型名 */
      errOk: !b.expectError ? null : (r.code !== 0 && String(r.err).indexOf(b.expectError) >= 0),
      files: fs.readdirSync(dir).filter((x) => x !== "main.py").sort()
    });
  });
  fs.rmSync(base, { recursive: true, force: true });
  let all = results;
  if (only.length && fs.existsSync(OUT)) {
    /* 增量模式：只换掉本次跑的课次，其余原样保留 */
    const old = JSON.parse(fs.readFileSync(OUT, "utf8")).blocks || [];
    const touched = new Set(results.map((x) => x.cid));
    all = old.filter((x) => !touched.has(x.cid)).concat(results);
  }
  all.sort((a, b) => (a.cid === b.cid ? a.n - b.n : a.cid < b.cid ? -1 : 1));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({
    python: ver, made: new Date().toISOString(),
    sandboxRoot: "/CWD", fixtures: FIXTURES, blocks: all
  }, null, 1), "utf8");
  const by = {};
  all.forEach((x) => { by[x.bucket] = (by[x.bucket] || 0) + 1; });
  console.log(`写出 ${OUT}`);
  console.log(`耗时 ${((Date.now() - t0) / 1000).toFixed(1)} 秒 · 共 ${all.length} 段 · 分桶 ` +
    Object.entries(by).map(([k, v]) => k + "=" + v).join(" ") +
    ` · CPython 非零退出 ${all.filter((x) => x.exit !== 0).length} 段`);
}
main();
