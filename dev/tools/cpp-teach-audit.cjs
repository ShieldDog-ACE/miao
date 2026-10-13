/* 喵站 · TEACH_AT 表反向校验（第九轮）
 *
 * 干什么：cpp-audit 的「构造首现」表是我手写的课号线。线画高了 → 正常内容假红；
 * 画低了 → 提前接触漏报。两种都该由数据说话，不该靠我记性。
 *
 * 算法：对每条构造，扫 213 份源稿，只看**代码行**（把以 // 开头的整行注释与空行剔掉，
 * 因为注释里提到某写法不算「用了」），找出第一次出现它的课号 first；
 * 然后跟表里的 teachAt 比：
 *   first < teachAt  → 「线画高了」：源稿在 first 课就用了，我却要求到 teachAt 才准出现 → 假红
 *   first > teachAt  → 「线画低了」：表比源稿早放行 → 漏报（通常无害，标出来给人看）
 *   源稿一次都没出现 → 表里这条是从别处带来的（智能指针这类），标「源稿未见」
 *
 * 跑法：node dev/tools/cpp-teach-audit.cjs [--strict]
 *   默认只报不改；--strict 时「线画高了」按退出码 1 收（可以直接接进 run.sh）。
 */
const fs = require("fs");
const path = require("path");

const DEV = path.resolve(__dirname, "..");
const SRC = "/run/media/fuka/99180618-d058-4083-83ed-c54d33771da1/学习资料/C++入门";

/* 从 cpp-audit 里把表拿出来（同一份出处，不复制第二份） */
const tool = fs.readFileSync(path.join(__dirname, "cpp-audit.cjs"), "utf8");
const m = /\nconst TEACH_AT = \[([\s\S]*?)\n\];/.exec(tool);
if (!m) { console.error("从 cpp-audit.cjs 里没抓到 TEACH_AT 表"); process.exit(1); }
const TEACH_AT = eval("[" + m[1] + "]");
/* 两把尺也从同一份出处现取，别在这里再抄一份 */
function grabFn(name) {
  const i = tool.indexOf("function " + name);
  if (i < 0) { console.error("cpp-audit.cjs 里找不到函数 " + name); process.exit(1); }
  return tool.slice(i, tool.indexOf("\n}", i) + 2);
}
const sandbox = {};
eval(grabFn("maskLiterals") + "\n" + grabFn("cmpHit") +
     "\nsandbox.maskLiterals = maskLiterals; sandbox.cmpHit = cmpHit;");

/* 只留代码行：整行 // 注释、行首 * / 的块注释行、空行都剔掉；
   行尾注释保留会误报（// sort 之类），所以顺手把行内 // 之后也切掉。 */
function codeOnly(text) {
  return text.split("\n")
    .map(l => l.replace(/\/\/.*$/, ""))
    .filter(l => l.trim() !== "" && !/^\s*[*)]/.test(l))
    .join("\n");
}

const lessons = [];
for (const f of fs.readdirSync(SRC).filter(x => x.endsWith(".cpp"))) {
  const n = Number(/^(\d+)_/.exec(f)[1]);
  lessons.push({ n, code: codeOnly(fs.readFileSync(path.join(SRC, f), "utf8")) });
}
lessons.sort((a, b) => a.n - b.n);

const rows = [];
for (const entry of TEACH_AT) {
  const [name, re, teachAt] = entry;
  let first = null;
  for (const L of lessons) {
    const hit = re === "CMP" ? sandbox.cmpHit(L.code) : re.test(sandbox.maskLiterals(L.code));
    if (hit) { first = L.n; break; }
  }
  rows.push({ name, teachAt, first });
}

const high = rows.filter(r => r.first !== null && r.first < r.teachAt);   // 线画高了 → 假红
const low = rows.filter(r => r.first !== null && r.first > r.teachAt);     // 线画低了 → 漏报
const unseen = rows.filter(r => r.first === null);                          // 源稿里根本没出现过

console.log("[teach-audit] 表里 " + rows.length + " 条构造 · 线画高 " + high.length + " · 线画低 " + low.length + " · 源稿未见 " + unseen.length);
high.forEach(r => console.log(`  ✘ 高了：${r.name} 表里要求 ${r.teachAt} 课起，源稿第 ${r.first} 课就用了`));
low.forEach(r => console.log(`  ·  低了：${r.name} 表里 ${r.teachAt} 课放行，源稿第 ${r.first} 课才第一次用`));
if (unseen.length) console.log("  ·  源稿未见（多半是我从别处带来的规矩，不算错）：" + unseen.map(r => r.name + "(" + r.teachAt + ")").join("、"));
process.exit(process.argv.includes("--strict") && high.length ? 1 : 0);
