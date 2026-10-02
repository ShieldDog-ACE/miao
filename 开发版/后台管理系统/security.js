/**
 * 喵站后端 · 安全层
 * 防爬虫策略（分层）：
 *  1) 常见爬虫 UA 拦截          2) 扫描器路径蜜罐 → 直接封 IP
 *  3) 按 IP / 桶 的滑窗限流      4) 写操作 HMAC 签名 + nonce 防重放
 * 说明：签名与 CSRF 用于抬高「脚本化批量抓取」的成本；
 *       真正的硬防线是「正文必须登录 + 每日配额 + 限流 + 封禁」。
 */
const crypto = require("crypto");
const { get, run, now } = require("./db");
const { load } = require("./config");
const cfg = load();
const SEC = cfg.security;

/* ---------------- 真实 IP ---------------- */
function clientIp(req) {
  if (SEC.trustProxy) {
    const xff = req.headers["x-forwarded-for"];
    if (xff) return String(xff).split(",")[0].trim();
  }
  return (req.socket && (req.socket.remoteAddress || "")) || "0.0.0.0";
}

/* ---------------- 爬虫 UA ---------------- */
const BOT_UA = new RegExp([
  "python-requests", "python-urllib", "aiohttp", "httpx", "scrapy", "mechanize", "beautifulsoup",
  "curl/", "wget", "libwww", "httpclient", "okhttp", "go-http-client", "java/", "apache-httpclient",
  "node-fetch", "axios/", "undici", "guzzle", "postman", "insomnia", "httpie",
  "phantomjs", "headlesschrome", "puppeteer", "playwright", "selenium", "webdriver",
  "scrapybot", "semrush", "ahrefs", "mj12bot", "dotbot", "megaindex", "blexbot", "bytespider",
  "petalbot", "dataforseo", "zoominfo", "serpstat", "spider", "crawler", "wget", "harvester"
].join("|"), "i");

function isBot(req) {
  if (!SEC.botBlock) return false;
  const ua = String(req.headers["user-agent"] || "");
  if (!ua.trim()) return true;               // API 无 UA 一律视为脚本
  return BOT_UA.test(ua);
}

/* ---------------- 扫描器蜜罐路径 ---------------- */
const TRAP = /(^|\/)(\.env|\.git|\.svn|\.ssh|config\.json|config\.example\.json|server\/|data\/|\.workbuddy|wp-login\.php|wp-admin|phpmyadmin|admin\.php|xmlrpc\.php|_trap|\.db$|\.sql$|\.sqlite$|\.bak$|\.log$)/i;
const trapHits = new Map();                  // ip -> 命中次数

/* ---------------- 封禁 ---------------- */
function isBanned(ip) {
  const row = get("SELECT * FROM bans WHERE ip = ?", ip);
  if (!row) return false;
  if (row.until && row.until < now()) { run("DELETE FROM bans WHERE ip = ?", ip); return false; }
  return true;
}
function ban(ip, reason, minutes) {
  const mins = minutes || SEC.banMinutes;
  const until = now() + mins * 60000;
  const row = get("SELECT * FROM bans WHERE ip = ?", ip);
  if (row) run("UPDATE bans SET until=?, reason=?, hits=hits+1 WHERE ip=?", until, reason || row.reason, ip);
  else run("INSERT INTO bans (ip,until,reason,hits) VALUES (?,?,?,?)", ip, until, reason || "auto", 1);
  console.warn("[security] 封禁 " + ip + "（" + (reason || "auto") + "，" + mins + " 分钟）");
}

/* ---------------- 限流（滑窗，内存） ---------------- */
const hits = new Map();                      // key -> [ts,...]
function rateLimit(key, limit, windowMs) {
  const w = windowMs || 60000;
  const t = now();
  const arr = (hits.get(key) || []).filter((x) => t - x < w);
  arr.push(t);
  hits.set(key, arr);
  if (hits.size > 20000) {                   // 简单的内存回收
    for (const [k, v] of hits) if (!v.length || t - v[v.length - 1] > 600000) hits.delete(k);
  }
  return { ok: arr.length <= limit, count: arr.length, limit };
}

/* ---------------- 签名 / nonce ---------------- */
const usedNonces = new Map();                // nonce -> ts
function signPayload(clientKey, method, pathname, body, nonce) {
  return crypto.createHmac("sha256", clientKey)
    .update(method.toUpperCase() + "\n" + pathname + "\n" + (body || "") + "\n" + nonce)
    .digest("hex");
}
function verifySign(req, session, rawBody) {
  if (!SEC.requireSign) return { ok: true };
  const nonce = String(req.headers["x-miao-nonce"] || "");
  const sign = String(req.headers["x-miao-sign"] || "");
  if (!nonce || !sign) return { ok: false, why: "缺少签名" };
  const ts = Number(nonce.split(".")[0]);
  if (!ts || Math.abs(now() - ts) > 300000) return { ok: false, why: "nonce 过期" };
  if (usedNonces.has(nonce)) return { ok: false, why: "nonce 重复" };
  const key = session.clientKey || (session.row && session.row.client_key);
  if (!key) return { ok: false, why: "会话缺少签名密钥" };
  const expect = signPayload(key, req.method, req.url.split("?")[0], rawBody, nonce);
  if (expect.length !== sign.length ||
      !crypto.timingSafeEqual(Buffer.from(expect, "utf8"), Buffer.from(sign, "utf8"))) {
    return { ok: false, why: "签名不匹配" };
  }
  usedNonces.set(nonce, now());
  if (usedNonces.size > 50000) usedNonces.clear();
  return { ok: true };
}
function newKeys() {
  return {
    clientKey: crypto.randomBytes(24).toString("hex"),
    csrf: crypto.randomBytes(16).toString("hex")
  };
}

/* ---------------- 安全响应头 ---------------- */
function securityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  res.setHeader("Content-Security-Policy", [
    "default-src 'self'",
    "img-src 'self' data: blob:",
    "media-src 'self' data: blob:",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self'",
    "connect-src 'self'",
    "font-src 'self' data:",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'self'"
  ].join("; "));
}

function trapHit(ip) {
  const n = (trapHits.get(ip) || 0) + 1;
  trapHits.set(ip, n);
  if (n >= 2) ban(ip, "扫描敏感路径", 1440);
  return n;
}

module.exports = {
  clientIp, isBot, TRAP, trapHit, isBanned, ban, rateLimit,
  signPayload, verifySign, newKeys, securityHeaders
};
