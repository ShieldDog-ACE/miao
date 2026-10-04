/**
 * 喵站后端 · 数据层（SQLite，使用 Node 内置 node:sqlite，零第三方依赖）
 * 需要 Node >= 22.5（node:sqlite 为实验特性，可用 NODE_NO_WARNINGS=1 隐藏警告）
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");

let DatabaseSync;
try {
  ({ DatabaseSync } = require("node:sqlite"));
} catch (e) {
  console.error("\n[db] 当前 Node 不支持 node:sqlite，请使用 Node >= 22.5（推荐 22 LTS / 24）。\n");
  throw e;
}

const cfg = require("./config").load();
fs.mkdirSync(cfg.dataDir, { recursive: true });
fs.mkdirSync(cfg.uploadDir, { recursive: true });

const DB_FILE = path.join(cfg.dataDir, "miao.db");
let db = null;
for (let attempt = 0; attempt < 10; attempt++) {
  try {
    db = new DatabaseSync(DB_FILE);
    break;
  } catch (e) {
    if (attempt === 9) throw e;
    require("child_process").execSync("sleep 0.4");
  }
}
db.exec("PRAGMA busy_timeout = 3000;");
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");
function tryAlter(sql) { try { db.exec(sql); } catch (e) { /* 列已存在 */ } }

/* ---------------- 建表 ---------------- */
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  descr TEXT DEFAULT '',
  avatar TEXT DEFAULT '',
  role TEXT DEFAULT 'user',            -- user | teacher | admin
  applied INTEGER DEFAULT 0,
  withdraw_at INTEGER DEFAULT 0,       -- 撤回老师申请的时间（冷却用）
  pw_salt TEXT DEFAULT '',             -- 密码盐（hex）
  pw_hash TEXT DEFAULT '',             -- 密码哈希（hex，SHA-256(salt+密码)）
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,                 -- token 的 sha256
  user_id INTEGER NOT NULL,
  csrf TEXT NOT NULL,
  client_key TEXT NOT NULL,
  ip TEXT, ua TEXT,
  created_at INTEGER NOT NULL,
  last_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS codes (
  email TEXT PRIMARY KEY,
  hash TEXT NOT NULL,
  expires INTEGER NOT NULL,
  tries INTEGER DEFAULT 0,
  sent_at INTEGER NOT NULL,
  ip TEXT
);
CREATE TABLE IF NOT EXISTS tutorials (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  intro TEXT DEFAULT '',
  cat TEXT DEFAULT '',
  diff TEXT DEFAULT '',
  tags TEXT DEFAULT '[]',
  thumb TEXT DEFAULT '',
  cover TEXT DEFAULT '',
  hero TEXT DEFAULT '',
  author TEXT NOT NULL,
  chapters TEXT DEFAULT '[]',
  seed_views INTEGER DEFAULT 0,        -- 迁移前的历史浏览数（真实浏览量在此基础上累加）
  seed_favs INTEGER DEFAULT 0,         -- 迁移前的历史收藏数
  views INTEGER DEFAULT 0,
  published INTEGER DEFAULT 1,
  updated TEXT DEFAULT '',
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS favs (
  user_id INTEGER NOT NULL,
  tutorial_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, tutorial_id)
);
CREATE TABLE IF NOT EXISTS follows (
  user_id INTEGER NOT NULL,
  target TEXT NOT NULL,                -- 关注对象的用户名
  created_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, target)
);
CREATE TABLE IF NOT EXISTS friend_reqs (
  from_name TEXT NOT NULL,
  to_user INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',       -- pending | accepted | ignored
  created_at INTEGER NOT NULL,
  PRIMARY KEY (from_name, to_user)
);
CREATE TABLE IF NOT EXISTS view_marks (
  who TEXT NOT NULL,                   -- u<id> 或 ip:<hash>
  tutorial_id TEXT NOT NULL,
  day TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (who, tutorial_id, day)
);
CREATE TABLE IF NOT EXISTS progress (
  user_id INTEGER NOT NULL,
  tutorial_id TEXT NOT NULL,
  chapter_id TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, tutorial_id, chapter_id)
);
CREATE TABLE IF NOT EXISTS works (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT '草稿',           -- 草稿 | 审核中 | 已发布
  chaps INTEGER DEFAULT 1,
  views INTEGER DEFAULT 0,
  seed_favs INTEGER DEFAULT 0,
  size INTEGER DEFAULT 0,              -- 文档字节数（>20MB 每次修改都需审核）
  updated TEXT DEFAULT '',
  thumb TEXT DEFAULT '', cover TEXT DEFAULT '', hero TEXT DEFAULT '',
  draft TEXT DEFAULT '{}',
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  body TEXT DEFAULT '',
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS drafts (
  user_id INTEGER PRIMARY KEY,
  json TEXT DEFAULT '{}',
  updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS bans (
  ip TEXT PRIMARY KEY,
  until INTEGER NOT NULL,
  reason TEXT DEFAULT '',
  hits INTEGER DEFAULT 1
);
CREATE TABLE IF NOT EXISTS quota (
  user_id INTEGER NOT NULL,
  day TEXT NOT NULL,
  chapters INTEGER DEFAULT 0,
  PRIMARY KEY (user_id, day)
);
CREATE INDEX IF NOT EXISTS idx_tut_cat ON tutorials(cat);
CREATE INDEX IF NOT EXISTS idx_tut_author ON tutorials(author);
CREATE INDEX IF NOT EXISTS idx_favs_tut ON favs(tutorial_id);
CREATE INDEX IF NOT EXISTS idx_follows_target ON follows(target);
`);
tryAlter("ALTER TABLE users ADD COLUMN withdraw_at INTEGER DEFAULT 0");
tryAlter("ALTER TABLE users ADD COLUMN pw_salt TEXT DEFAULT ''");
tryAlter("ALTER TABLE users ADD COLUMN pw_hash TEXT DEFAULT ''");
tryAlter("ALTER TABLE works ADD COLUMN size INTEGER DEFAULT 0");

/* ---------------- 便捷封装 ---------------- */
const stmtCache = new Map();
function prep(sql) {
  if (!stmtCache.has(sql)) stmtCache.set(sql, db.prepare(sql));
  return stmtCache.get(sql);
}
const get = (sql, ...p) => prep(sql).get(...p);
const all = (sql, ...p) => prep(sql).all(...p);
const run = (sql, ...p) => prep(sql).run(...p);
function tx(fn) {
  db.exec("BEGIN");
  try { const r = fn(); db.exec("COMMIT"); return r; }
  catch (e) { db.exec("ROLLBACK"); throw e; }
}
const now = () => Date.now();
const today = () => new Date().toISOString().slice(0, 10);
const sha256 = (s) => crypto.createHash("sha256").update(String(s)).digest("hex");

/* 密码哈希：SHA-256(盐 + 密码)，盐与哈希均存 16 进制 */
function hashPassword(pw, salt) {
  return sha256((salt || "") + String(pw));
}
function newSalt() { return crypto.randomBytes(16).toString("hex"); }
function setPassword(userId, pw) {
  const salt = newSalt();
  run("UPDATE users SET pw_salt = ?, pw_hash = ? WHERE id = ?", salt, hashPassword(pw, salt), userId);
}
function verifyPassword(pw, salt, hash) {
  if (!salt || !hash) return false;
  const h = hashPassword(pw, salt);
  return h.length === hash.length && crypto.timingSafeEqual(Buffer.from(h, "hex"), Buffer.from(hash, "hex"));
}

/* ---------------- 首次运行：导入 seed-data.js 的种子教程 ---------------- */
/* 教程正文各自放在独立数据文件里，由 seed-data.js 通过 window.MIAO_XX.tutorial 引用：
     py-data.js  → window.MIAO_PY   （Python 入门 · 46 章）
     en-data.js  → window.MIAO_EN   （26 字母 / 48 音标 / 教程正文）
   每个数据文件都是全站唯一来源，前端与 seed 都不留副本。 */
const SEED_DEPS = ["py-data.js", "en-data.js"];

function readLegacyData() {
  // 种子正文的唯一来源是后端 seed-data.js（前端不再保留副本，避免静态泄露全站正文）
  const seedFile = path.join(__dirname, "seed-data.js");
  if (!fs.existsSync(seedFile)) return null;
  const sandbox = { window: {}, localStorage: { getItem: () => null, setItem: () => {} }, console };
  sandbox.window.localStorage = sandbox.localStorage;
  const ctx = vm.createContext(sandbox);
  try {
    // 先载入各数据文件，让 seed-data.js 能引用它们的 tutorial
    for (const dep of SEED_DEPS) {
      const f = path.join(__dirname, dep);
      if (fs.existsSync(f)) vm.runInContext(fs.readFileSync(f, "utf8"), ctx, { timeout: 5000 });
    }
    vm.runInContext(fs.readFileSync(seedFile, "utf8"), ctx, { timeout: 5000 });
    return sandbox.window.MIAO_DATA || null;
  } catch (e) {
    console.error("[db] 迁移种子数据失败：", e.message);
    return null;
  }
}

/* 英语模块数据（26 字母 / 48 音标），供 /api/meta 一并下发 */
function readEnData() {
  const f = path.join(__dirname, "en-data.js");
  if (!fs.existsSync(f)) return null;
  const sandbox = { window: {} };
  try {
    vm.runInNewContext(fs.readFileSync(f, "utf8"), sandbox, { timeout: 5000 });
    return sandbox.window.MIAO_EN || null;
  } catch (e) {
    console.error("[db] 读取 en-data.js 失败：", e.message);
    return null;
  }
}

function ensureUser(name, opts) {
  const o = opts || {};
  let u = get("SELECT * FROM users WHERE name = ?", name);
  if (u) return u;
  run(
    "INSERT INTO users (name, email, descr, avatar, role, applied, created_at) VALUES (?,?,?,?,?,?,?)",
    name, o.email || null, o.descr || (o.role === "teacher" ? "认证讲师" : "喵站用户 · 正在学习"),
    o.avatar || "", o.role || "user", o.applied ? 1 : 0, now()
  );
  return get("SELECT * FROM users WHERE name = ?", name);
}

function seedIfEmpty() {
  const cnt = get("SELECT COUNT(*) AS c FROM tutorials").c;
  if (cnt > 0) return false;
  const legacy = readLegacyData();
  if (!legacy || !Array.isArray(legacy.tutorials) || !cfg.security.seedDemo) {
    console.warn("[db] 跳过演示数据（seedDemo=false 或无种子源）；首个注册用户将获得 ID 0");
    run(
      "INSERT OR IGNORE INTO users (id,name,email,descr,role,applied,created_at) VALUES (0,?,?,?,?,0,?)",
      "喵站官方", null, "喵站官方账号", "teacher", now()
    );
    run("INSERT INTO announcements (title,body,created_at) VALUES (?,?,?)",
      "喵站上线", "欢迎来到喵站", now());
    return false;
  }
  tx(() => {
    // 站点官方账号（ID=0）+ 教程作者
    run(
      "INSERT OR IGNORE INTO users (id,name,email,descr,avatar,role,applied,created_at) VALUES (0,?,?,?,?,?,?,?)",
      "喵站官方", null, "喵站官方账号", "", "teacher", 0, now()
    );
    const authors = new Set(legacy.tutorials.map((t) => t.author));
    authors.forEach((a) => ensureUser(a, { role: "teacher" }));

    legacy.tutorials.forEach((t) => {
      const students = Number(t.students) || 0;
      run(
        `INSERT OR REPLACE INTO tutorials
         (id,title,intro,cat,diff,tags,thumb,cover,hero,author,chapters,seed_views,seed_favs,views,published,updated,created_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        t.id, t.title, t.intro || "", t.cat || "", t.diff || "", JSON.stringify(t.tags || []),
        t.thumb || "", t.cover || "", t.hero || "", t.author,
        JSON.stringify(t.chapters || []), students, Math.round(students * 0.07), 0, 1,
        t.updated || today(), now()
      );
    });

    run("INSERT INTO announcements (title,body,created_at) VALUES (?,?,?)",
      "喵站上线", "欢迎来到喵站！本站为开源站点，注册后可免费阅读全部教程。", now());
  });
  console.log("[db] 已从 seed-data.js 导入 " + legacy.tutorials.length + " 门教程作为初始数据");
  return true;
}

/* 新注册用户：无预置社交关系（关注/好友从零开始，真实数据） */
function bootstrapNewUser(userId, userName) {
  /* 保留函数签名，避免调用处改动；不再注入任何模拟人际关系 */
}

module.exports = {
  db, get, all, run, tx, now, today, sha256, ensureUser, seedIfEmpty, bootstrapNewUser,
  hashPassword, newSalt, setPassword, verifyPassword, readLegacyData, readEnData,
  DB_FILE, cfg
};
