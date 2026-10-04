/**
 * 喵站后端 · HTTP 服务入口
 * 启动：node server/index.js      （可用 NODE_NO_WARNINGS=1 隐藏 sqlite 实验特性警告）
 * 依赖：仅 Node 内置模块（Node >= 22.5）
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const { load, ROOT } = require("./config");
const dbm = require("./db");
const { get, run, now } = dbm;
const A = require("./api");
const S = require("./security");

const cfg = load();

/* ---------------- 路由表 ---------------- */
const ROUTES = [
  ["GET", /^\/api\/health$/, "pub", (c) => A.helpers.ok(c.res, {
    ok: true, uptime: Math.round(process.uptime()), tutorials: get("SELECT COUNT(*) AS c FROM tutorials").c,
    users: get("SELECT COUNT(*) AS c FROM users").c, mailReady: require("./mailer").mailReady(), node: process.version
  })],
  ["GET", /^\/api\/meta$/, "pub", A.base.meta],
  ["POST", /^\/api\/auth\/request-code$/, "auth", A.base.requestCode, false],
  ["POST", /^\/api\/auth\/verify$/, "auth", A.base.verifyCode, false],
  ["POST", /^\/api\/auth\/register$/, "auth", A.base.register, false],
  ["POST", /^\/api\/auth\/password-login$/, "auth", A.base.passwordLogin, false],
  ["POST", /^\/api\/auth\/set-password$/, "write", A.base.setPw, true],
  ["POST", /^\/api\/auth\/logout$/, "write", A.base.logout, false],
  ["GET", /^\/api\/me$/, "pub", A.base.me],
  ["POST", /^\/api\/me\/apply$/, "write", A.base.applyTeacher, true],
  ["POST", /^\/api\/me\/apply\/withdraw$/, "write", A.base.withdrawApply, true],
  ["GET", /^\/api\/announcements$/, "pub", A.base.announcements],
  ["POST", /^\/api\/me\/profile$/, "write", A.base.updateProfile, true],

  ["GET", /^\/api\/tutorials$/, "pub", A.content.listTutorials],
  ["GET", /^\/api\/tutorials\/([^/]+)$/, "pub", A.content.tutorialDetail, false, ["id"]],
  ["POST", /^\/api\/tutorials\/([^/]+)\/view$/, "content", A.content.viewTutorial, false, ["id"]],
  ["GET", /^\/api\/tutorials\/([^/]+)\/chapters\/([^/]+)$/, "content", A.content.readChapter, false, ["id", "cid"]],
  ["POST", /^\/api\/tutorials\/([^/]+)\/fav$/, "write", (c) => A.content.favToggle(c, true), true, ["id"]],
  ["DELETE", /^\/api\/tutorials\/([^/]+)\/fav$/, "write", (c) => A.content.favToggle(c, false), true, ["id"]],
  ["GET", /^\/api\/my\/favs$/, "pub", A.content.myFavs, true],

  ["GET", /^\/api\/users\/([^/]+)$/, "pub", A.content.userProfile, false, ["name"]],
  ["GET", /^\/api\/friends$/, "pub", A.base.friendList, true],
  ["POST", /^\/api\/friends\/request$/, "write", A.base.friendRequest, true],
  ["POST", /^\/api\/friends\/accept$/, "write", A.base.friendAccept, true],
  ["POST", /^\/api\/friends\/ignore$/, "write", A.base.friendIgnore, true],
  ["POST", /^\/api\/friends\/remove$/, "write", A.base.friendRemove, true],
  ["POST", /^\/api\/follow$/, "write", A.base.follow, true],
  ["POST", /^\/api\/unfollow$/, "write", A.base.unfollow, true],

  ["GET", /^\/api\/my\/works$/, "pub", A.content.myWorks, true],
  ["POST", /^\/api\/my\/works$/, "write", A.content.publishWork, true],
  ["DELETE", /^\/api\/my\/works\/(\d+)$/, "write", A.content.deleteWork, true, ["id"]],
  ["GET", /^\/api\/my\/draft$/, "pub", A.content.getDraft, true],
  ["PUT", /^\/api\/my\/draft$/, "write", A.content.putDraft, true],
  ["POST", /^\/api\/upload$/, "write", A.content.uploadImage, true],
  ["GET", /^\/api\/docs$/, "pub", A.content.apiDocs]
];

/* ---------------- 静态资源 ---------------- */
const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".gif": "image/gif", ".webp": "image/webp", ".ico": "image/x-icon", ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2", ".map": "application/json",
  ".mp3": "audio/mpeg", ".m4a": "audio/mp4", ".ogg": "audio/ogg", ".wav": "audio/wav"
};
const ROBOTS = [
  "User-agent: *",
  "Allow: /$",
  "Allow: /assets/",
  "Allow: /audio/",
  "Disallow: /api/",
  "Disallow: /uploads/",
  "Disallow: /server/",
  "Crawl-delay: 10",
  ""].join("\n");

/* /audio/ 允许暴露的子目录白名单（英语字母与音标音频） */
const AUDIO_SUBDIRS = ["letters", "phonemes"];

function serveFile(res, abs, req) {
  const ext = path.extname(abs).toLowerCase();
  const st = fs.statSync(abs);
  /* 缓存策略：/uploads/ 文件名为内容哈希，可永久缓存；
     其余站点资源（含 /audio/ 的 01.mp3、A.mp3 等）一律 no-cache + ETag 协商：
     每次请求回源校验，未改动返回 304（省带宽），改过立即下发新内容（改完即生效）。
     音频刻意不给 immutable —— 文件名不是内容哈希，重新切片后同名文件必须能立刻生效。 */
  const cacheControl = abs.indexOf(cfg.uploadDir + path.sep) === 0
    ? "public, max-age=31536000, immutable"
    : "no-cache";
  const etag = 'W/"' + st.size.toString(16) + "-" + Math.floor(st.mtimeMs).toString(36) + '"';
  const lastMod = st.mtime.toUTCString();
  const ifNoneMatch = req.headers["if-none-match"];
  const ifModSince = req.headers["if-modified-since"];
  const fresh = ifNoneMatch ? ifNoneMatch === etag : (!!ifModSince && ifModSince === lastMod);
  if (fresh) {
    res.writeHead(304, { "Cache-Control": cacheControl, "ETag": etag, "Last-Modified": lastMod });
    return res.end();
  }
  const headers = {
    "Content-Type": MIME[ext] || "application/octet-stream",
    "Content-Length": st.size,
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": cacheControl,
    "ETag": etag,
    "Last-Modified": lastMod
  };
  res.writeHead(200, headers);
  if (req.method === "HEAD") return res.end();
  fs.createReadStream(abs).pipe(res);
}

function handleStatic(req, res, pathname) {
  if (S.TRAP.test(pathname)) {
    S.trapHit(S.clientIp(req));
    A.helpers.send(res, 404, "404 Not Found");
    return;
  }
  if (pathname === "/robots.txt") { res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" }); return res.end(ROBOTS); }
  if (pathname.indexOf("/uploads/") === 0) {
    const name = path.basename(pathname);
    const abs = path.join(cfg.uploadDir, name);
    if (fs.existsSync(abs)) return serveFile(res, abs, req);
    return A.helpers.send(res, 404, "404");
  }
  /* 英语音频：/audio/letters/A.mp3 · /audio/phonemes/01.mp3
     audioDir 指向后台目录本身，靠下面的白名单限定只能读到这两个子目录，
     所以 seed-data.js / db.js / config.json / data/miao.db 都碰不到。 */
  if (pathname.indexOf("/audio/") === 0) {
    let rel = "";
    try { rel = decodeURIComponent(pathname.slice("/audio/".length)); } catch (e) { return A.helpers.send(res, 400, "400"); }
    const seg = rel.split("/");
    if (seg.length !== 2 || AUDIO_SUBDIRS.indexOf(seg[0]) < 0) return A.helpers.send(res, 404, "404");
    const abs = path.join(cfg.audioDir, seg[0], path.basename(seg[1]));
    if (abs.indexOf(cfg.audioDir + path.sep) !== 0) return A.helpers.send(res, 403, "403");
    if (fs.existsSync(abs) && fs.statSync(abs).isFile()) return serveFile(res, abs, req);
    return A.helpers.send(res, 404, "404");
  }
  let rel;
  try { rel = decodeURIComponent(pathname); } catch (e) { return A.helpers.send(res, 400, "400"); }
  if (rel === "/" || rel === "") rel = "/index.html";
  const abs = path.normalize(path.join(cfg.siteDir, rel));
  if (abs !== cfg.siteDir && abs.indexOf(cfg.siteDir + path.sep) !== 0) return A.helpers.send(res, 403, "403");
  if (fs.existsSync(abs) && fs.statSync(abs).isFile()) return serveFile(res, abs, req);
  // 本站是哈希路由（页面入口恒为 /），不存在需要「回退到 index.html」的路径。
  // 缺失的资源（js / css / 图片）直接 404：若回退成 HTML，浏览器会因 MIME 不符拒绝执行，
  // 既掩盖真实错误，也让排查无从下手。
  if (!fs.existsSync(cfg.siteDir)) return A.helpers.send(res, 404, "前端目录不存在：" + cfg.siteDir);
  A.helpers.send(res, 404, "404 Not Found");
}

/* ---------------- 请求体 ---------------- */
function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > (limit || 1 * 1024 * 1024)) { reject(new Error("body too large")); req.destroy(); return; }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

/* ---------------- API 分发 ---------------- */
async function handleApi(req, res, pathname, query) {
  const ip = S.clientIp(req);
  if (S.isBanned(ip)) return A.helpers.send(res, 403, "访问被拒绝");

  // 蜜罐：浏览器不会访问的「正常用户不可见」路径
  if (/^\/api\/_(trap|honeypot)$/.test(pathname)) {
    S.ban(ip, "蜜罐命中", 1440);
    return A.helpers.send(res, 403, "访问被拒绝");
  }
  if (S.isBot(req)) return A.helpers.send(res, 403, "检测到自动化访问，已拦截");

  let match = null;
  for (const r of ROUTES) {
    if (r[0] !== req.method) continue;
    const m = r[1].exec(pathname);
    if (m) { match = { def: r, m: m }; break; }
  }
  if (!match) return A.helpers.fail(res, 404, "接口不存在");

  const def = match.def;
  const bucket = def[2];
  const handler = def[3];
  const needAuth = def[4] === true;          // 默认公开，需登录的接口显式声明 true
  const paramNames = def[5] || [];
  const limit = bucket === "auth" ? cfg.security.rate.auth : bucket === "write" ? cfg.security.rate.write : bucket === "content" ? cfg.security.rate.content : cfg.security.rate.api;

  const rl = S.rateLimit(bucket + ":" + ip, limit, 60000);
  res.setHeader("X-RateLimit-Limit", String(limit));
  res.setHeader("X-RateLimit-Remaining", String(Math.max(0, limit - rl.count)));
  // 封禁阈值只用于「验证码」桶（最易被撞库/刷码）；其余桶一律按「限流上限 × 3」
  const banAfter = (bucket === "auth" && cfg.security.banAfterN) || limit * 3;
  if (rl.count > banAfter) {                     // 超过封禁阈值：直接封 IP
    S.ban(ip, "超过封禁阈值（" + bucket + " 桶 " + rl.count + " 次/分钟）", 15);
    return A.helpers.fail(res, 403, "访问被拒绝");
  }
  if (!rl.ok) return A.helpers.fail(res, 429, "请求过于频繁，请稍后再试");

  // 会话
  const session = A.helpers.loadSession(req, res);
  const bodyText = (req.method === "GET" || req.method === "HEAD") ? "" : await readBody(req, bucket === "write" ? 8 * 1024 * 1024 : 256 * 1024);
  let body = null;
  if (bodyText) {
    const ct = String(req.headers["content-type"] || "");
    if (ct.indexOf("application/json") < 0) return A.helpers.fail(res, 415, "仅接受 application/json");
    try { body = JSON.parse(bodyText || "{}"); } catch (e) { return A.helpers.fail(res, 400, "请求体不是合法 JSON"); }
  }

  const ctx = {
    req, res, ip, query,
    body: body || {},
    params: {},
    session: session,
    user: session ? session.user : null
  };
  paramNames.forEach((n, i) => { ctx.params[n] = decodeURIComponent(match.m[i + 1] || ""); });

  if (needAuth && !ctx.user) return A.helpers.fail(res, 401, "请先登录");
  // 写操作必须签名（登录相关接口除外）
  if (bucket === "write" && needAuth) {
    const v = S.verifySign(req, session, bodyText);
    if (!v.ok) {
      S.rateLimit("badsign:" + ip, 1000, 600000);
      return A.helpers.fail(res, 403, "签名校验失败（" + v.why + "）");
    }
  }
  try {
    return await handler(ctx);
  } catch (e) {
    console.error("[api] " + req.method + " " + pathname + " 出错：", e && e.stack || e);
    return A.helpers.fail(res, 500, "服务器内部错误");
  }
}

/* ---------------- 服务器 ---------------- */
const server = http.createServer((req, res) => {
  S.securityHeaders(res);
  const u = url.parse(req.url, true);
  const pathname = u.pathname || "/";
  if (pathname.indexOf("/api/") === 0) {
    handleApi(req, res, pathname, u.query).catch((e) => {
      console.error("[api] 未捕获错误：", e);
      A.helpers.fail(res, 500, "服务器内部错误");
    });
    return;
  }
  handleStatic(req, res, pathname);
});

dbm.seedIfEmpty();

server.listen(cfg.port, cfg.host, () => {
  const mailer = require("./mailer");
  console.log("\n喵站后端已启动");
  console.log("  地址    http://" + cfg.host + ":" + cfg.port + "/");
  console.log("  前端    " + cfg.siteDir);
  console.log("  数据    " + dbm.DB_FILE);
  console.log("  上传    " + cfg.uploadDir);
  console.log("  发信    " + (mailer.mailReady() ? "已配置 SMTP（真实发信）" : "未配置 → 验证码打到控制台与 " + mailer.OUTBOX));
  console.log("  防爬    UA拦截=" + cfg.security.botBlock + " 必签名=" + cfg.security.requireSign +
    " 限流=" + JSON.stringify(cfg.security.rate));
  console.log("  提示    生产环境建议 NODE_NO_WARNINGS=1，并用 Nginx/Caddy 反代 + HTTPS\n");
});

function shutdown() {
  console.log("\n正在关闭…");
  try { server.close(); } catch (e) { /* ignore */ }
  try { dbm.db.exec("PRAGMA wal_checkpoint(TRUNCATE)"); dbm.db.close(); } catch (e) { /* ignore */ }
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("uncaughtException", (e) => console.error("[uncaught]", e && e.stack || e));
