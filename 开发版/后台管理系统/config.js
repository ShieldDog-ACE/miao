/**
 * 喵站后端 · 配置加载
 * 优先级：进程环境变量 > .env > config.json > 默认值
 * 普通偏好（端口、限流等）写 config.json；
 * 一切密钥（SMTP_PASS / MIAO_ADMIN_PASS 等）只放 .env 或环境变量，绝不写进仓库文件。
 */
const fs = require("fs");
const path = require("path");

const SERVER_DIR = __dirname;
// 后端位于 <根>/开发版/后台管理系统/，ROOT 需再往上两层到喵站根目录
const ROOT = path.resolve(SERVER_DIR, "..", "..");

/* 读取同目录 .env（KEY=VALUE，# 注释）；已存在的环境变量优先，不覆盖 */
const ENV_FILE = path.join(SERVER_DIR, ".env");
function loadDotEnv() {
  if (!fs.existsSync(ENV_FILE)) return;
  let text;
  try { text = fs.readFileSync(ENV_FILE, "utf8"); } catch (e) { return; }
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (val.length > 1 && /^["'].*["']$/.test(val)) val = val.slice(1, -1);
    if (process.env[key] === undefined) process.env[key] = val;
  }
}
loadDotEnv();

const DEFAULTS = {
  port: 8787,
  host: "127.0.0.1",                          // 生产环境建议 127.0.0.1 + 反向代理（Nginx/Caddy）
  siteDir: path.join(ROOT, "开发版", "喵站"),   // 前端静态目录（ROOT 已是喵站根）
  dataDir: path.join(SERVER_DIR, "data"),      // SQLite 数据目录
  uploadDir: "",                                // 留空 = 跟随 dataDir（测试改 MIAO_DATA_DIR 即自动隔离）
  sessionDays: 30,
  admin: {
    port: 8788,             // 后台管理系统独立端口
    pass: ""                // 永远留空：口令只从环境变量/.env 的 MIAO_ADMIN_PASS 读；未设置则每次启动随机生成
  },
  mail: {
    enabled: false,        // 填了 SMTP_PASS 后自动开启
    host: "smtp.qq.com",
    port: 465,
    secure: true,                 // 465 用隐式 TLS；587 用 STARTTLS
    user: "",                     // 发信邮箱，用 SMTP_USER 提供
    pass: "",                     // 永远留空：邮箱授权码只从环境变量/.env 的 SMTP_PASS 读，不写进文件
    from: ""                      // 留空则用 "喵站 <user>"
  },
  security: {
    trustProxy: false,     // 反向代理后设为 true，才能取到真实 IP（X-Forwarded-For）
    requireSign: true,     // 写操作必须带 HMAC 签名（挡掉不解析 Cookie/HMAC 的简易爬虫）
    botBlock: true,        // 拦截常见爬虫 UA
    banMinutes: 30,        // 触发封禁时长
    banAfterN: 0,          // 同一桶内超过该次数即封禁（0 = 用「限流上限 × 3」）
    autoApproveTeacher: true,  // 老师申请提交即通过（演示）；正式部署设 false 走人工
    seedDemo: true,            // 首次启动导入 6 门演示教程（正式部署可设 false，首个注册用户 ID=0）
    rate: {                // 每 IP 每分钟次数上限
      api: 150,            // 普通 GET
      auth: 8,             // 验证码相关
      write: 40,           // 写操作
      content: 240         // 章节正文读取
    },
    docsPerMin: 120,        // 每分钟最多阅读/下载 120 篇文档（正常阅读远低于此，仅拦批量扒站）
    applyCooldownMin: 5,    // 撤回老师申请后，几分钟内不可再次申请
    codePer10min: 5,        // 10 分钟内验证码申请达 5 次 → 封 IP 24 小时
    publishPer10min: 10,    // 10 分钟内发布超过 10 篇 → 封禁 24 小时
    maxImageMB: 1,          // 单张图片上限
    maxAudioSec: 30,        // 单条音频时长上限（秒）
    bigDocMB: 20,           // 文档超过 20MB，每次修改都需审核
    chapterWindow: 2000,    // 分层加载：每次下发约 2000 字
  }
};

function load() {
  const cfg = JSON.parse(JSON.stringify(DEFAULTS));
  const file = path.join(SERVER_DIR, "config.json");
  if (fs.existsSync(file)) {
    try {
      const user = JSON.parse(fs.readFileSync(file, "utf8"));
      for (const k of Object.keys(user)) {
        if (k === "mail" || k === "security" || k === "admin") continue;
        cfg[k] = user[k];
      }
      cfg.mail = Object.assign({}, DEFAULTS.mail, user.mail || {});
      cfg.security = Object.assign({}, DEFAULTS.security, user.security || {});
      cfg.security.rate = Object.assign({}, DEFAULTS.security.rate, (user.security && user.security.rate) || {});
      cfg.admin = Object.assign({}, DEFAULTS.admin, user.admin || {});
      /* 密钥只认环境变量 / .env：仓库里的 config.json 若被误填了授权码或口令，一律丢弃并告警。
         这样「明文密钥进仓库」这条路径在代码层面就被堵死，而不只是靠自觉。 */
      if (cfg.mail.pass) {
        console.warn("[config] ⚠ 已忽略 config.json 里的 mail.pass —— 邮箱授权码只从环境变量 SMTP_PASS 读取");
        cfg.mail.pass = "";
      }
      if (cfg.admin.pass) {
        console.warn("[config] ⚠ 已忽略 config.json 里的 admin.pass —— 后台口令只从环境变量 MIAO_ADMIN_PASS 读取");
        cfg.admin.pass = "";
      }
    } catch (e) {
      console.error("[config] config.json 解析失败，改用默认配置：", e.message);
    }
  }
  const env = process.env;
  if (env.MIAO_PORT) cfg.port = Number(env.MIAO_PORT);
  if (env.MIAO_HOST) cfg.host = env.MIAO_HOST;
  if (env.MIAO_SITE_DIR) cfg.siteDir = path.resolve(env.MIAO_SITE_DIR);
  if (env.MIAO_DATA_DIR) cfg.dataDir = path.resolve(env.MIAO_DATA_DIR);
  if (env.MIAO_UPLOAD_DIR) cfg.uploadDir = path.resolve(env.MIAO_UPLOAD_DIR);
  if (env.SMTP_HOST) cfg.mail.host = env.SMTP_HOST;
  if (env.SMTP_PORT) cfg.mail.port = Number(env.SMTP_PORT);
  if (env.SMTP_SECURE) cfg.mail.secure = String(env.SMTP_SECURE) !== "false";
  if (env.SMTP_USER) cfg.mail.user = env.SMTP_USER;
  if (env.SMTP_PASS) { cfg.mail.pass = env.SMTP_PASS; cfg.mail.enabled = true; }
  if (env.MIAO_NO_MAIL) { cfg.mail.enabled = false; }   // 测试/开发：强制走 outbox，不连 SMTP
  if (env.SMTP_FROM) cfg.mail.from = env.SMTP_FROM;
  if (env.MIAO_TRUST_PROXY) cfg.security.trustProxy = String(env.MIAO_TRUST_PROXY) !== "false";
  if (env.MIAO_CONTENT_QUOTA) cfg.security.contentQuotaPerDay = Number(env.MIAO_CONTENT_QUOTA);
  if (env.MIAO_REQUIRE_SIGN) cfg.security.requireSign = String(env.MIAO_REQUIRE_SIGN) !== "false";
  if (env.MIAO_BOT_BLOCK) cfg.security.botBlock = String(env.MIAO_BOT_BLOCK) !== "false";
  if (env.MIAO_RATE_API) cfg.security.rate.api = Number(env.MIAO_RATE_API);
  if (env.MIAO_RATE_AUTH) cfg.security.rate.auth = Number(env.MIAO_RATE_AUTH);
  if (env.MIAO_RATE_WRITE) cfg.security.rate.write = Number(env.MIAO_RATE_WRITE);
  if (env.MIAO_BAN_AFTER_N) cfg.security.banAfterN = Number(env.MIAO_BAN_AFTER_N);
  if (env.MIAO_BAN_MINUTES) cfg.security.banMinutes = Number(env.MIAO_BAN_MINUTES);
  if (env.MIAO_AUTO_TEACHER) cfg.security.autoApproveTeacher = String(env.MIAO_AUTO_TEACHER) !== "false";
  if (env.MIAO_DOCS_PER_MIN) cfg.security.docsPerMin = Number(env.MIAO_DOCS_PER_MIN);
  if (env.MIAO_APPLY_COOLDOWN_MIN) cfg.security.applyCooldownMin = Number(env.MIAO_APPLY_COOLDOWN_MIN);
  if (env.MIAO_CODE_PER_10MIN) cfg.security.codePer10min = Number(env.MIAO_CODE_PER_10MIN);
  if (env.MIAO_SEED_DEMO) cfg.security.seedDemo = String(env.MIAO_SEED_DEMO) !== "false";
  if (!cfg.mail.from && cfg.mail.user) cfg.mail.from = "喵站 <" + cfg.mail.user + ">";
  if (!cfg.mail.pass) cfg.mail.enabled = false;   // 无授权码一律不发真信，验证码走控制台 + outbox

  if (env.MIAO_ADMIN_PORT) cfg.admin.port = Number(env.MIAO_ADMIN_PORT);
  if (env.MIAO_ADMIN_PASS) cfg.admin.pass = env.MIAO_ADMIN_PASS;
  cfg.siteDir = path.resolve(cfg.siteDir);
  cfg.dataDir = path.resolve(cfg.dataDir);
  if (!cfg.uploadDir) cfg.uploadDir = path.join(cfg.dataDir, "uploads");   // 默认住在数据目录里
  cfg.uploadDir = path.resolve(cfg.uploadDir);
  return cfg;
}

module.exports = { load, DEFAULTS, ROOT, SERVER_DIR };
