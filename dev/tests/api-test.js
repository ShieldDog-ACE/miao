/**
 * 喵站后端 · 端到端接口测试（真实 HTTP，无第三方依赖）
 * 运行：node dev/tests/api-test.js
 * 会自己拉起后端（独立端口 + 独立数据目录），跑完自动清理。
 */
const { spawn, execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const os = require("os");
const { DatabaseSync } = require("node:sqlite");

const ROOT = path.resolve(__dirname, "..", "..");
const PORT = Number(process.env.MIAO_TEST_PORT || 8799);
const TMP_ROOT = process.env.MIAO_TEST_TMP || path.join(ROOT, "..", "..", "tmp");
const EXTERNAL = process.env.MIAO_TEST_BASE || "";              // 已外部启动后端时填，可省内存
const DATA_DIR = process.env.MIAO_TEST_DATA || path.join(TMP_ROOT, "miao-test-" + Date.now());
const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";
const BASE = EXTERNAL || ("http://127.0.0.1:" + PORT);

const results = [];
function ok(name, cond, extra) {
  results.push((cond ? "PASS" : "FAIL") + " | " + name + (extra != null && extra !== "" ? "  → " + extra : ""));
  return cond;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- 极简 cookie + HMAC 客户端 ---------- */
const jar = {};
function cookieHeader() {
  return Object.keys(jar).map((k) => k + "=" + jar[k]).join("; ");
}
function absorb(res) {
  const raw = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
  raw.forEach((c) => {
    const [kv] = c.split(";");
    const i = kv.indexOf("=");
    const name = kv.slice(0, i).trim(), val = decodeURIComponent(kv.slice(i + 1).trim());
    if (val === "") delete jar[name]; else jar[name] = val;
  });
}
async function call(method, p, body, opts) {
  const o = opts || {};
  const text = body == null ? "" : JSON.stringify(body);
  const headers = { "User-Agent": o.ua === undefined ? UA : o.ua, "Accept": "application/json" };
  if (text) headers["Content-Type"] = "application/json";
  if (o.ua === undefined && jar.miao_ck) {
    const nonce = Date.now() + "." + crypto.randomBytes(6).toString("hex");
    const sign = crypto.createHmac("sha256", jar.miao_ck)
      .update(method.toUpperCase() + "\n" + p + "\n" + text + "\n" + nonce).digest("hex");
    headers["X-Miao-Nonce"] = nonce;
    headers["X-Miao-Sign"] = o.badSign ? "0".repeat(sign.length) : sign;
  }
  if (o.noSign) { delete headers["X-Miao-Sign"]; delete headers["X-Miao-Nonce"]; }
  if (jar.miao_sid) headers["Cookie"] = cookieHeader();
  if (o.xff) headers["X-Forwarded-For"] = o.xff;
  if (o.cookieOnly) headers["Cookie"] = o.cookieOnly;
  let res = null, lastErr = null;
  for (let attempt = 0; attempt < 3; attempt++) {   // 沙箱代理偶发瞬断，重试
    try {
      res = await fetch(BASE + p, {
        method: method, headers: headers, body: text || undefined, redirect: "manual",
        signal: AbortSignal.timeout(12000)
      });
      break;
    } catch (e) { lastErr = e; await sleep(400); }
  }
  if (!res) throw lastErr || new Error("请求失败");
  absorb(res);
  const ct = res.headers.get("content-type") || "";
  const data = ct.indexOf("json") >= 0 ? await res.json().catch(() => null) : await res.text();
  return { status: res.status, data: data, headers: res.headers };
}

/* ---------- 拉起后端 ---------- */
function startServer(env) {
  const child = spawn(process.execPath, [path.join(ROOT, "dev", "backend", "index.js")], {
    cwd: ROOT,
    env: Object.assign({}, process.env, {
      NODE_NO_WARNINGS: "1",
      MIAO_PORT: String(PORT),
      MIAO_DATA_DIR: DATA_DIR,
      MIAO_NO_MAIL: "1",
      MIAO_RATE_AUTH: "20",
      MIAO_RATE_WRITE: "40",
      MIAO_BAN_AFTER_N: "8",
      MIAO_TRUST_PROXY: "true"
    }, env || {}),
    stdio: ["ignore", "pipe", "pipe"]
  });
  child.stdout.on("data", () => {});
  child.stderr.on("data", (d) => process.stderr.write("[server] " + d));
  return child;
}
function readOutboxCode(email) {
  const file = path.join(DATA_DIR, "mail-outbox.log");
  if (!fs.existsSync(file)) return null;
  const txt = fs.readFileSync(file, "utf8");
  const blocks = txt.split("-".repeat(60));
  for (let i = blocks.length - 1; i >= 0; i--) {
    if (blocks[i].indexOf(email) >= 0) {
      const m = /(?:验证码是：|Subject: .*?)(\d{6})/.exec(blocks[i]);
      if (m) return m[1];
    }
  }
  return null;
}

(async () => {
  let server = null;
  if (!EXTERNAL) {                       // 外部后端模式绝不能清理数据目录（会把运行中的库删掉）
    fs.rmSync(DATA_DIR, { recursive: true, force: true });
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!EXTERNAL) {
    server = startServer();
    for (let i = 0; i < 25; i++) {
      try {
        const hr = await fetch(BASE + "api/health", { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(2000) });
        if (hr.ok) break;
      } catch (e) { /* 未就绪，继续等 */ }
      await sleep(400);
    }
    console.log("[api-test] 后端已就绪\n");
  } else {
    console.log("[api-test] 使用已启动的后端 " + BASE + "（数据目录 " + DATA_DIR + "）\n");
  }

  try {
    /* ===== 0. 造测试教程（seed 已清空，测试自备数据） ===== */
    {
      const db = new DatabaseSync(path.join(DATA_DIR, "miao.db"));
      const mk = (id, title, cat, author, chaps) => {
        const chapters = [];
        for (let i = 1; i <= chaps; i++) {
          chapters.push({ id: "c" + i, title: "第 " + i + " 章", blocks: [{ t: "p", text: title + " 第 " + i + " 章正文内容。" }] });
        }
        db.prepare("INSERT OR REPLACE INTO tutorials (id,title,intro,cat,diff,tags,thumb,cover,hero,author,chapters,seed_views,seed_favs,views,published,updated,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
          .run(id, title, "测试简介", cat, "入门", "[]", "", "", "", author, JSON.stringify(chapters), 1000, 70, 0, 1, new Date().toISOString().slice(0, 10), Date.now());
      };
      mk("js", "JavaScript 指南", "js", "喵站官方", 5);
      mk("css", "CSS 基础", "css", "喵站官方", 4);
      mk("html", "HTML 入门", "html", "喵站官方", 4);
      mk("python", "Python 上手", "python", "喵站官方", 3);
      mk("sql", "SQL 数据库", "sql", "喵站官方", 3);
      mk("git", "Git 版本控制", "git", "喵站官方", 3);
      db.close();
    }

    /* ===== 1. 公开接口 ===== */
    let r = await call("GET", "/api/health");
    ok("健康检查", r.status === 200 && r.data.ok === true, "教程 " + (r.data && r.data.tutorials));
    r = await call("GET", "/api/meta");
    const catKeys = r.data.categories && !Array.isArray(r.data.categories) ? Object.keys(r.data.categories) : (r.data.categories || []);
    ok("元信息返回层级分类（大类→小类）", r.status === 200 && catKeys.length >= 3,
      catKeys.join("/"));
    r = await call("GET", "/api/users/" + encodeURIComponent("喵站官方"));
    ok("首个用户 ID 为 0（开源站账号 ID 从 0 递增）", r.status === 200 && r.data.user.id === 0,
      "ID=" + (r.data.user && r.data.user.id));
    r = await call("GET", "/api/announcements");
    ok("公告接口可用（含种子公告）", r.status === 200 && r.data.items.length >= 1,
      (r.data.items || []).length + " 条");
    r = await call("GET", "/api/tutorials?size=3");
    ok("教程列表分页", r.status === 200 && r.data.items.length === 3 && r.data.total >= 6, r.data.items.length + "/" + r.data.total);
    ok("列表不下发正文", r.data.items.every((t) => t.chapters.every((c) => c.blocks === undefined)), JSON.stringify(r.data.items[0].chapters).slice(0, 100));
    r = await call("GET", "/api/tutorials/js");
    ok("未登录看详情：锁定且无正文", r.status === 200 && r.data.locked === true && r.data.tutorial.chapters.every((c) => c.blocks === undefined), JSON.stringify(r.data.tutorial.chapters).slice(0, 100));
    ok("收藏数/学习人数来自真实计数", typeof r.data.tutorial.favs === "number" && r.data.tutorial.students > 0,
      "★" + r.data.tutorial.favs + " / " + r.data.tutorial.students);
    /* 开源站：正文无需登录，游客可直接读（防爬靠限流/封禁，不靠登录门槛） */
    r = await call("GET", "/api/tutorials/js/chapters/c1");
    ok("游客可直接读正文（200）", r.status === 200 && !!r.data.chapter.blocks,
      String(r.status) + " 字数 " + JSON.stringify(r.data.chapter.blocks || []).length);
    ok("游客正文按窗下发（不一次性给全）", !!r.data.window && typeof r.data.window.hasMore === "boolean");
    r = await call("GET", "/uploads/nope.png");
    ok("未知上传文件 404", r.status === 404);

    /* ===== 2. 防爬 ===== */
    r = await call("GET", "/api/meta", null, { ua: "python-requests/2.31.0" });
    ok("爬虫 UA 被拦（403）", r.status === 403, String(r.status));
    r = await call("GET", "/api/meta", null, { ua: "" });
    ok("空 UA 被拦（403）", r.status === 403, String(r.status));
    r = await call("GET", "/api/meta", null, { ua: "Mozilla/5.0 Scrapy/2.11" });
    ok("Scrapy UA 被拦（403）", r.status === 403, String(r.status));
    const S = require(path.join(ROOT, "dev", "backend", "security"));
    ok("蜜罐规则覆盖常见扫描路径（.env / wp-login / server / .db）",
      S.TRAP.test("/wp-login.php") && S.TRAP.test("/.env") && S.TRAP.test("/server/index.js") &&
      S.TRAP.test("/server/data/miao.db") && !S.TRAP.test("/assets/js/app.js"));
    // 封禁链路用「写操作」桶触发（MIAO_RATE_WRITE=2 → 超过 6 次即封），不占用验证码额度
    let banned = false;
    const seen = [];
    for (let i = 0; i < 20; i++) {
      const x = await call("POST", "/api/auth/request-code", { email: "probe" + i + "@spam.dev" }, { xff: "10.9.9.9" });
      seen.push(x.status);
      if (x.status === 403) { banned = true; break; }
      if (x.status !== 429 && x.status !== 200) break;
    }
    ok("连续超限后 IP 被自动封禁（403）", banned, seen.slice(0, 12).join(","));
    r = await call("GET", "/api/meta", null, { xff: "10.9.9.9" });
    ok("封禁期间该 IP 所有接口拒绝访问", r.status === 403, String(r.status));

    /* ===== 3. 邮箱验证码登录（用另一个 IP 视角：跳过封禁则换 UA 无效，故先解封 ===== */
    // 上面蜜罐已封本机 IP，测试封禁逻辑本身；后续需要正常访问，这里直接清库解封
    { const db = new DatabaseSync(path.join(DATA_DIR, "miao.db")); db.exec("DELETE FROM bans;"); db.close(); }
    r = await call("GET", "/api/meta", null, { xff: "10.9.9.9" });
    ok("解封后恢复正常访问", r.status === 200);

    const email = "tester@miao.dev";
    r = await call("POST", "/api/auth/request-code", { email: email });
    ok("请求邮箱验证码", r.status === 200 && r.data.sent === true, "dev=" + (r.data && r.data.dev));
    const code = readOutboxCode(email);
    ok("验证码已投递（开发传输写入 outbox）", !!code && /^\d{6}$/.test(code), String(code));
    r = await call("POST", "/api/auth/verify", { email: email, code: "000000" });
    ok("错误验证码被拒", r.status === 400, r.data && r.data.error);
    r = await call("POST", "/api/auth/verify", { email: email, code: code, name: "测试喵" });
    ok("正确验证码登录成功", r.status === 200 && r.data.user && r.data.user.name === "测试喵", r.data.user && r.data.user.name);
    ok("登录下发会话与签名密钥 Cookie", !!jar.miao_sid && !!jar.miao_ck && !!jar.miao_csrf);
    const me = await call("GET", "/api/me");
    ok("读取当前用户与统计（无模拟社交，粉丝从 0 开始）", me.status === 200 && typeof me.data.counts.fans === "number",
      "关注" + me.data.counts.follows + " 粉丝" + me.data.counts.fans);

    /* ===== 3.5 账号密码：注册 / 登录 / 哈希存储 ===== */
    r = await call("POST", "/api/auth/register", { name: "密码用户", pw: "123456" }, { xff: "10.7.7.7" });
    ok("用户名+密码注册成功", r.status === 200 && r.data.user && r.data.user.name === "密码用户");
    r = await call("POST", "/api/auth/register", { name: "密码用户", pw: "123456" }, { xff: "10.7.7.7" });
    ok("重复用户名被拒（409）", r.status === 409, r.data && r.data.error);
    r = await call("POST", "/api/auth/register", { name: "短密码", pw: "123" });
    ok("密码不足 6 位被拒（400）", r.status === 400, r.data && r.data.error);
    r = await call("POST", "/api/auth/register", { name: "长密码", pw: "1234567" });
    ok("密码超过 6 位被拒（400）", r.status === 400, r.data && r.data.error);
    r = await call("POST", "/api/auth/register", { name: "字母密码", pw: "abcdef" });
    ok("非数字密码被拒（400）", r.status === 400, r.data && r.data.error);
    /* 密码已哈希存储，不落明文 */
    { const db = new DatabaseSync(path.join(DATA_DIR, "miao.db"));
      const u = db.prepare("SELECT pw_salt, pw_hash FROM users WHERE name = ?").get("密码用户");
      ok("密码存 16 进制哈希（盐 + SHA-256，无明文）",
        u && /^[0-9a-f]{32}$/.test(u.pw_salt) && /^[0-9a-f]{64}$/.test(u.pw_hash) && u.pw_hash !== "123456");
      db.close(); }
    /* 退出后走密码登录 */
    await call("POST", "/api/auth/logout");
    r = await call("POST", "/api/auth/password-login", { name: "密码用户", pw: "000000" }, { xff: "10.7.7.7" });
    ok("错误密码被拒（401）", r.status === 401, r.data && r.data.error);
    r = await call("POST", "/api/auth/password-login", { name: "密码用户", pw: "123456" }, { xff: "10.7.7.7" });
    ok("正确密码登录成功", r.status === 200 && r.data.user && r.data.user.name === "密码用户");
    /* 改密码 */
    r = await call("POST", "/api/auth/set-password", { oldPw: "123456", newPw: "654321" }, { xff: "10.7.7.7" });
    ok("已登录可改密码", r.status === 200);
    await call("POST", "/api/auth/logout");
    r = await call("POST", "/api/auth/password-login", { name: "密码用户", pw: "654321" }, { xff: "10.7.7.8" });
    ok("改密后新密码生效", r.status === 200 && r.data && r.data.user && r.data.user.name === "密码用户",
      r.status + " " + JSON.stringify(r.data).slice(0, 80));
    /* 回到测试账号继续：重新请求一次验证码（旧 code 已用完），独立 IP 避免限流 */
    await call("POST", "/api/auth/logout");
    await call("POST", "/api/auth/request-code", { email: email }, { xff: "10.8.8.9" });
    const code2 = readOutboxCode(email);
    r = await call("POST", "/api/auth/verify", { email: email, code: code2 || code, name: "测试喵" }, { xff: "10.8.8.9" });
    ok("验证码方式仍可正常登录", r.status === 200 && r.data && r.data.user && r.data.user.name === "测试喵");

    /* ===== 4. 签名与写操作 ===== */
    r = await call("POST", "/api/follow", { name: "喵站官方" }, { noSign: true });
    ok("缺签名写操作被拒（403）", r.status === 403, String(r.status));
    r = await call("POST", "/api/follow", { name: "喵站官方" }, { badSign: true });
    ok("错误签名被拒（403）", r.status === 403, String(r.status));
    r = await call("POST", "/api/follow", { name: "喵站官方" });
    ok("正确签名关注成功", r.status === 200 && r.data.relation.followed === true, JSON.stringify(r.data.relation));
    r = await call("POST", "/api/follow", { name: "密码用户" });
    ok("关注另一真实用户成功", r.status === 200 && r.data.relation.followed === true, JSON.stringify(r.data.relation));

    /* ===== 5. 教程正文与配额 ===== */
    r = await call("GET", "/api/tutorials/js");
    ok("登录后详情下发正文", r.status === 200 && r.data.locked === false && Array.isArray(r.data.tutorial.chapters),
      "章节 " + (r.data.tutorial.chapters || []).length);
    const firstId = r.data.tutorial.chapters[0].id;
    r = await call("GET", "/api/tutorials/js/chapters/" + firstId);
    ok("登录后可读正文", r.status === 200 && !!r.data.chapter.blocks && r.data.chapter.blocks.length > 0);

    /* 分层加载：大文档只下发约 2000 字窗口 */
    { const db = new DatabaseSync(path.join(DATA_DIR, "miao.db"));
      db.prepare("INSERT OR REPLACE INTO tutorials (id,title,intro,cat,diff,tags,thumb,cover,hero,author,chapters,seed_views,seed_favs,views,published,updated,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,1,?,?)")
        .run("bigdoc", "百万字测试", "x", "前端开发", "入门", "[]", "", "", "", "测试喵",
          JSON.stringify([{ id: "b1", title: "巨长章节", blocks: [{ t: "p", text: "很".repeat(6000) }, { t: "p", text: "结尾标记" }] }]),
          0, 0, 0, new Date().toISOString().slice(0, 10), Date.now());
      db.close(); }
    r = await call("GET", "/api/tutorials/bigdoc");
    ok("大文档详情只给章节目录（不给正文）", r.status === 200 && r.data.tutorial.chapters.length === 1 &&
      r.data.tutorial.chapters[0].blocks === undefined);
    r = await call("GET", "/api/tutorials/bigdoc/chapters/b1");
    ok("分层加载：首窗按块下发（整块粒度）且 hasMore", r.status === 200 && r.data.window.hasMore === true &&
      r.data.window.served > 0 && r.data.window.nextOffset < r.data.window.totalChars,
      JSON.stringify(r.data.window).slice(0, 80));
    const next = r.data.window.nextOffset;
    r = await call("GET", "/api/tutorials/bigdoc/chapters/b1?offset=" + next);
    ok("续读窗口加载到结尾（offset 不计限速）", r.data.window.hasMore === false &&
      JSON.stringify(r.data.chapter.blocks).indexOf("结尾标记") >= 0);

    /* 阅读限速：生产默认每分钟 120 篇（offset=0 的读取计数，续读 offset 不计） */
    let rate429 = null, read200 = 0;
    for (let i = 0; i < 140; i++) {
      const x = await call("GET", "/api/tutorials/js/chapters/c" + (2 + (i % 3)));
      if (x.status === 429) { rate429 = x; break; }
      if (x.status !== 200) break;
      read200++;
    }
    ok("每分钟阅读超过 120 篇被限流（429）", !!rate429 && read200 >= 115,
      "本轮 200 计 " + read200 + " 次" + (rate429 ? "后触发 429" : "，未触发 429"));

    /* ===== 6. 收藏 / 浏览 ===== */
    const det = await call("GET", "/api/tutorials/js");
    if (!det.data || !det.data.tutorial) {
      throw new Error("详情接口异常：" + det.status + " " + JSON.stringify(det.data).slice(0, 160));
    }
    const before = det.data.tutorial.favs;
    r = await call("POST", "/api/tutorials/js/fav");
    ok("收藏成功且计数 +1", r.status === 200 && r.data.faved === true && r.data.favs === before + 1,
      before + " → " + (r.data && r.data.favs));
    const mid = r.data.favs;
    r = await call("DELETE", "/api/tutorials/js/fav");
    ok("取消收藏且计数 -1", r.status === 200 && r.data.favs === mid - 1);
    r = await call("POST", "/api/tutorials/css/fav");
    r = await call("GET", "/api/my/favs");
    ok("我的收藏列表可用", r.status === 200 && r.data.items.some((t) => t.id === "css"));
    const v1 = (await call("POST", "/api/tutorials/html/view")).data.views;
    const v2 = (await call("POST", "/api/tutorials/html/view")).data.views;
    ok("浏览量同日同人去重", v1 === v2, v1 + " / " + v2);

    /* ===== 7. 好友 / 用户主页 ===== */
    /* 无预置社交关系：通过「发申请 → 接受」真实链路验证 */
    r = await call("POST", "/api/friends/request", { name: "密码用户" });
    ok("向真实用户发送好友申请 → 直接互关", r.status === 200 && r.data.relation.friend === true, JSON.stringify(r.data.relation));
    r = await call("GET", "/api/friends");
    ok("好友列表返回真实好友", r.status === 200 && r.data.friends.some(function (f) { return f.name === "密码用户"; }),
      "好友 " + r.data.friends.length);
    r = await call("GET", "/api/users/" + encodeURIComponent("密码用户"));
    ok("用户主页返回关系与计数", r.status === 200 && r.data.user && r.data.user.name === "密码用户" &&
      typeof r.data.counts.fans === "number", "粉丝 " + r.data.counts.fans);
    r = await call("POST", "/api/friends/remove", { name: "密码用户" });
    ok("移除好友＝解除互关", r.status === 200 && r.data.relation.friend === false && r.data.relation.followed === false);

    /* ===== 8. 上传（含内容校验） ===== */
    const pngB64 = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(64)]).toString("base64");
    r = await call("POST", "/api/upload", { dataUrl: "data:image/png;base64," + pngB64 });
    ok("上传 PNG 成功并返回站内地址", r.status === 200 && /^\/uploads\/[a-f0-9]+\.png$/.test(r.data.url), r.data && r.data.url);
    const fakeGif = Buffer.from("not an image at all").toString("base64");
    r = await call("POST", "/api/upload", { dataUrl: "data:image/gif;base64," + fakeGif });
    ok("伪造格式的图片被拒", r.status === 400, r.data && r.data.error);
    const badSvg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>').toString("base64");
    r = await call("POST", "/api/upload", { dataUrl: "data:image/svg+xml;base64," + badSvg });
    ok("含脚本的 SVG 被拒（防挂马）", r.status === 400, r.data && r.data.error);
    const goodSvg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="#fb7da8"/></svg>').toString("base64");
    r = await call("POST", "/api/upload", { dataUrl: "data:image/svg+xml;base64," + goodSvg });
    ok("正常 SVG 可上传", r.status === 200 && /\.svg$/.test(r.data.url), r.data && r.data.url);
    const upUrl = r.data.url;
    const imgRes = await fetch(BASE + upUrl, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(8000) });
    ok("上传的图片可通过 /uploads 访问", imgRes.status === 200 && (imgRes.headers.get("content-type") || "").indexOf("svg") >= 0);

    /* ===== 9. 发布作品（三图必填） ===== */
    r = await call("POST", "/api/my/works", { title: "测试教程", intro: "简介", thumb: upUrl, cover: upUrl, hero: upUrl, chapters: [{ title: "1", blocks: [{ t: "p", text: "x" }] }] });
    ok("非老师发布被拒（403）", r.status === 403, r.data && r.data.error);
    /* 申请冷却：撤回后 5 分钟内不可再申请（用户尚未成为老师） */
    r = await call("POST", "/api/me/apply/withdraw");
    ok("可撤回老师申请", r.status === 200 && r.data.withdrawn === true);
    r = await call("POST", "/api/me/apply");
    ok("撤回后立即再申请被冷却拦截（429）", r.status === 429, r.data && r.data.error);
    { const db = new DatabaseSync(path.join(DATA_DIR, "miao.db")); db.prepare("UPDATE users SET withdraw_at=0, role='teacher' WHERE email=?").run(email); db.close(); }
    r = await call("POST", "/api/my/works", { title: "测试教程", intro: "简介", chapters: [{ title: "1", blocks: [{ t: "p", text: "x" }] }] });
    ok("老师未上传三图不可发布", r.status === 400 && /缩略图/.test(r.data.error), r.data && r.data.error);
    r = await call("POST", "/api/my/works", { title: "测试教程", intro: "简介", thumb: upUrl, cover: upUrl, hero: upUrl, chapters: [{ title: "1", blocks: [{ t: "p", text: "x" }] }] });
    ok("老师三图齐备发布成功（含文档大小）", r.status === 200 && r.data.status === "审核中" && typeof r.data.size === "number",
      JSON.stringify(r.data));
    r = await call("GET", "/api/my/works");
    ok("我的作品列表可见", r.status === 200 && r.data.items.length === 1, "共 " + r.data.items.length + " 条");
    /* 发布灌水：10 分钟 >10 篇 → 封禁 24 小时 */
    let pubBanned = false; const pubSeen = [];
    for (let i = 0; i < 13; i++) {
      const x = await call("POST", "/api/my/works", { title: "刷量" + i, intro: "x", thumb: upUrl, cover: upUrl, hero: upUrl, chapters: [{ title: "1", blocks: [{ t: "p", text: "x" }] }] });
      pubSeen.push(x.status);
      if (x.status === 403) { pubBanned = true; break; }
      if (x.status !== 200 && x.status !== 429) break;
    }
    ok("10 分钟内发布超过 10 篇 → 封禁 24 小时", pubBanned, pubSeen.join(","));
    { const db = new DatabaseSync(path.join(DATA_DIR, "miao.db")); db.exec("DELETE FROM bans"); db.close(); }
    r = await call("GET", "/api/me");
    ok("封禁解除后恢复正常", r.status === 200 && r.data.user !== null);
    r = await call("POST", "/api/my/works", { title: "外链图", intro: "x", thumb: "https://evil.com/a.png", cover: upUrl, hero: upUrl, chapters: [{ title: "1", blocks: [{ t: "p", text: "x" }] }] });
    ok("外链图片被拒（必须站内上传）", r.status === 400, r.data && r.data.error);

    /* ===== 10. 草稿 / 登出 ===== */
    r = await call("PUT", "/api/my/draft", { draft: { title: "草稿标题", chapters: [] } });
    ok("草稿保存", r.status === 200);
    r = await call("GET", "/api/my/draft");
    ok("草稿读取一致", r.data.draft.title === "草稿标题");
    r = await call("POST", "/api/auth/logout");
    ok("登出成功", r.status === 200);
    r = await call("GET", "/api/me");
    ok("登出后会话失效", r.status === 200 && r.data.user === null);

    /* ===== 11. 静态与 robots ===== */
    const home = await fetch(BASE + "/", { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(8000) });
    ok("首页可访问", home.status === 200 && (home.headers.get("content-type") || "").indexOf("html") >= 0);
    const robots = await fetch(BASE + "/robots.txt", { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(8000) });
    const robotsTxt = await robots.text();
    ok("robots.txt 屏蔽接口路径", robots.status === 200 && /Disallow: \/api\//.test(robotsTxt));
    const sec = await fetch(BASE + "/", { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(8000) });
    ok("安全响应头齐全", !!sec.headers.get("content-security-policy") && sec.headers.get("x-content-type-options") === "nosniff");
    function curlCode(p) {
      try {
        return execFileSync("curl", ["-s", "-o", "/dev/null", "-w", "%{http_code}", "--max-time", "3", "-A", UA, BASE + p],
          { encoding: "utf8" }).trim();
      } catch (e) { return null; }
    }
    const srcCode = curlCode("/server/index.js");
    const dbCode = curlCode("/server/data/miao.db");
    ok("后端源码不可通过静态访问", srcCode === "404",
      srcCode === null ? "沙箱代理未放行，已由蜜罐规则覆盖" : srcCode);
    ok("数据库文件不可访问", dbCode === "404", dbCode === null ? "沙箱代理未放行，已由蜜罐规则覆盖" : dbCode);
  } catch (e) {
    results.push("FAIL | 测试脚本异常中断  → " + (e && e.message));
  }

  if (server) {
    server.kill("SIGKILL");
    await sleep(200);
    fs.rmSync(DATA_DIR, { recursive: true, force: true });
  }

  console.log(results.join("\n"));
  const failed = results.filter((x) => x.startsWith("FAIL")).length;
  console.log("\n合计：" + results.length + " 项，失败 " + failed + " 项");
  process.exit(failed ? 1 : 0);
})();
