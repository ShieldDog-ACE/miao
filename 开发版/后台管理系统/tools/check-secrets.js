/**
 * 喵站 · 发布前自查
 * 扫描会被公开的文件，找出密钥残留、真实邮箱/手机号、本机绝对路径、测试运行数据。
 * 用法：node tools/check-secrets.js [--from <目录>]
 *   退出码 1 = 发现高危项（必须先处理），2 = 仅中危提醒
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");   // 开发版/
const FROM = (() => {
  const i = process.argv.indexOf("--from");
  return i > 0 ? path.resolve(process.argv[i + 1]) : ROOT;
})();

/* 这些路径本就被 .gitignore 排除，不会公开，不必扫内容 */
const IGNORED_DIRS = ["node_modules", ".git", "data", "uploads", "dist", ".Trash-0"];
const IGNORED_FILES = [".env", ".env.local"];
const EXAMPLE_OK = /\.example[.]|^\.env\.example/;   // 模板里的占位值不算泄漏

const CONTENT_FILE = /(^|\/)(seed-data\.js|data\.js)$/;   // 教程正文，里面的 password="..." 是示例，不是配置
const PLACEHOLDER = /test|example|wrong|demo|changeme|placeholder|你的|请改|占位|\bxxx+\b|\$\{/i;  // 明显是假值
const RULES = [
  ["HIGH", /miao-admin-2026/, "残留的后台默认口令"],
  ["HIGH", /BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY/, "私钥文件"],
  ["HIGH", /^\s*(?:["']?(?:pass|password|passwd|token|secret|apikey|api_key|authcode)["']?)\s*[:=]\s*["']?[^"'\s#]{6,}/im, "明文密钥字段"],
  ["HIGH", /["']?(?:pass|passwd|password|authcode|authorization_code)["']?\s*[:=]\s*["'][^"'\s]{6,}["']/i, "配置里写死的口令/授权码"],
  ["HIGH", /quz?l\w{8,}|[A-Za-z0-9]{16}\b(?=\s*["']?\s*[,}]?.*(?:授权码|smtp))/i, "疑似邮箱授权码"],
  ["MED", /[\w.+-]+@(?!miao\.dev|example\.com|qq\.com\b|github\.com|gitee\.com|gitlab\.com|163\.com|126\.com)[\w-]+\.[a-z]{2,}/i, "真实邮箱（多半是个人邮箱）"],
  ["MED", /\/(?:home|Users|Users\/[^/]+|media)\/[a-zA-Z0-9._-]+\//, "本机绝对路径（泄漏用户名）"],
  ["MED", /1[3-9]\d{9}/, "疑似手机号"],
  ["MED", /(?:D:|C:)\\\\?Users\\\\?[^\\\/\s]+/i, "Windows 本机路径（泄漏用户名）"]
];

const hits = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    const st = fs.lstatSync(abs);
    if (st.isSymbolicLink()) continue;
    if (st.isDirectory()) {
      if (IGNORED_DIRS.indexOf(name) >= 0) continue;
      walk(abs);
      continue;
    }
    if (IGNORED_FILES.indexOf(name) >= 0) continue;
    if (!st.isFile() || st.size > 2 * 1024 * 1024) continue;
    if (/\.(png|jpg|jpeg|gif|webp|ico|woff2?|mp3|wav|zip|db|db-wal|db-shm)$/.test(name)) continue;
    let text;
    try { text = fs.readFileSync(abs, "utf8"); } catch (e) { continue; }
    if (text.indexOf("\0") >= 0) continue;
    const isExample = EXAMPLE_OK.test(name) || abs.indexOf("check-secrets.js") >= 0;
    const isContent = CONTENT_FILE.test(path.relative(ROOT, abs));
    text.split(/\r?\n/).forEach((line, i) => {
      for (const [level, re, why] of RULES) {
        if (!re.test(line)) continue;
        if (isExample && (level === "MED" || why === "残留的后台默认口令")) continue;
        if (isContent && why !== "残留的后台默认口令") continue;   // 教程正文里的 password= 只是示例
        if (/口令|密钥|授权码/.test(why) && PLACEHOLDER.test(line)) continue;   // 测试/模板里的假值
        hits.push({ level, file: display(abs), line: i + 1, why, text: line.trim().slice(0, 90) });
      }
    });
  }
}
function display(abs) {
  const rel = path.relative(ROOT, abs);
  return rel.startsWith("..") ? abs : rel;
}
walk(FROM);

/* 运行时数据是否还留在目录树里（即使 gitignore 了，手动拷贝发布时会一起带走） */
const leftovers = [];
function countFiles(dir) {
  let n = 0;
  for (const name of fs.readdirSync(dir)) {
    if (name.indexOf(".gitkeep") >= 0) continue;
    const abs = path.join(dir, name);
    const st = fs.lstatSync(abs);
    n += st.isDirectory() ? countFiles(abs) : 1;
  }
  return n;
}
if (FROM === ROOT) {
  for (const rel of ["后台管理系统/data", "后台管理系统/uploads"]) {
    const abs = path.join(ROOT, rel);
    if (fs.existsSync(abs)) {
      const n = countFiles(abs);
      if (n) leftovers.push(rel + "/ → " + n + " 个文件（本地运行数据，发布时务必排除）");
    }
  }
  const envPath = path.join(ROOT, "后台管理系统", ".env");
  if (fs.existsSync(envPath)) leftovers.push("后台管理系统/.env → 存在（.gitignore 已忽略；用复制目录的方式发布前务必排除）");
  const cfgPath = path.join(ROOT, "后台管理系统", "config.json");
  if (fs.existsSync(cfgPath)) leftovers.push("后台管理系统/config.json → 存在（本机偏好配置，仓库只留 config.example.json）");
}

let high = 0, med = 0;for (const h of hits) {
  if (h.level === "HIGH") high++; else med++;
  console.log((h.level === "HIGH" ? "✘ 高危  " : "· 提醒  ") + h.file + ":" + h.line + "  " + h.why + "\n          " + h.text);
}
if (!hits.length) console.log("✔ 未在待公开文件中发现问题内容");
for (const l of leftovers) console.log("· 本地数据  " + l);
console.log("\n汇总：" + high + " 项高危、" + med + " 项提醒、" + leftovers.length + " 项本地数据");
process.exit(high ? 1 : (med || leftovers.length ? 2 : 0));
