/**
 * 喵站 · 后台管理系统端到端测试（真实 HTTP）
 * 覆盖：管理口令登录、防爬拦截、老师审核、教程审核上架、发公告、封禁管理
 * 运行：node 开发版/tests/admin-test.js  （自起 backend + admin 两个进程）
 */
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");
const API_PORT = 8796;
const ADMIN_PORT = 8797;
const DATA_DIR = path.join(process.env.MIAO_TEST_TMP || path.join(ROOT, "..", "..", "tmp"), "miao-admin-test");
const PASS = "test-admin-pass";
const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36";
const results = [];
function ok(name, cond, extra) { results.push((cond ? "PASS" : "FAIL") + " | " + name + (extra != null && extra !== "" ? "  → " + extra : "")); }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const jar = {};
function cookieHeader() { return Object.keys(jar).map((k) => k + "=" + jar[k]).join("; "); }
async function call(base, method, p, body, opts) {
  const o = opts || {};
  const text = body == null ? "" : JSON.stringify(body);
  const headers = { "User-Agent": o.ua === undefined ? UA : o.ua, "Accept": "application/json" };
  if (text) headers["Content-Type"] = "application/json";
  if (cookieHeader()) headers["Cookie"] = cookieHeader();
  let res = null, lastErr = null;
  for (let i = 0; i < 3; i++) {
    try { res = await fetch(base + p, { method, headers, body: text || undefined, signal: AbortSignal.timeout(10000) }); break; }
    catch (e) { lastErr = e; await sleep(400); }
  }
  if (!res) throw lastErr || new Error("请求失败");
  const sc = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
  sc.forEach((c) => { const [kv] = c.split(";"); const i = kv.indexOf("="); jar[kv.slice(0, i).trim()] = decodeURIComponent(kv.slice(i + 1).trim()); });
  const ct = res.headers.get("content-type") || "";
  return { status: res.status, data: ct.indexOf("json") >= 0 ? await res.json().catch(() => null) : await res.text() };
}

function start(name, file, env) {
  const child = spawn(process.execPath, [path.join(ROOT, "开发版", "后台管理系统", file)], {
    cwd: ROOT, env: Object.assign({}, process.env, { NODE_NO_WARNINGS: "1", MIAO_DATA_DIR: DATA_DIR, MIAO_NO_MAIL: "1" }, env),
    stdio: ["ignore", "ignore", "inherit"]
  });
  child.name = name;
  return child;
}

(async () => {
  fs.rmSync(DATA_DIR, { recursive: true, force: true });
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const api = start("backend", "index.js", { MIAO_PORT: String(API_PORT), MIAO_CONTENT_QUOTA: "500" });
  await sleep(1200);
  const adm = start("admin", "admin.js", { MIAO_PORT: String(API_PORT), MIAO_ADMIN_PORT: String(ADMIN_PORT), MIAO_ADMIN_PASS: PASS });
  for (let i = 0; i < 20; i++) {
    try { const r = await fetch("http://127.0.0.1:" + ADMIN_PORT + "/", { headers: { "User-Agent": UA } }); if (r.ok) break; } catch (e) {}
    await sleep(400);
  }

  try {
    const AB = "http://127.0.0.1:" + ADMIN_PORT;
    const BB = "http://127.0.0.1:" + API_PORT;

    /* 1. 防爬：后台也拦截爬虫 */
    let r = await call(AB, "GET", "/", null, { ua: "python-requests/2.31" });
    ok("后台拦截爬虫 UA（403）", r.status === 403, String(r.status));

    /* 2. 口令登录 */
    r = await call(AB, "POST", "/api/login", { pass: "wrong-pass" });
    ok("错误管理口令被拒（401）", r.status === 401, String(r.status));
    r = await call(AB, "POST", "/api/login", { pass: PASS });
    ok("正确管理口令登录成功", r.status === 200 && !!jar.miao_admin);

    /* 3. 登录后才能看数据 */
    r = await call(AB, "GET", "/api/stats");
    ok("后台统计接口可用", r.status === 200 && typeof r.data.users === "number", "用户 " + r.data.users);

    /* 4. 造一个老师申请 + 一篇待审作品，走审核流 */
    // 用后端 API 登录一个用户并申请老师
    const email = "adm-user@miao.dev";
    await call(BB, "POST", "/api/auth/request-code", { email });
    const log = fs.readFileSync(path.join(DATA_DIR, "mail-outbox.log"), "utf8");
    const code = /验证码是：(\d{6})/.exec(log.split("-".repeat(60)).filter((b) => b.includes(email)).pop())[1];
    await call(BB, "POST", "/api/auth/verify", { email, code, name: "待审老师" });
    // 申请老师（演示 autoApprove 会立即通过，这里手动改回待审态）
    const DatabaseSync = require("node:sqlite").DatabaseSync;
    { const db = new DatabaseSync(path.join(DATA_DIR, "miao.db"));
      db.prepare("UPDATE users SET role='user', applied=1 WHERE email=?").run(email); db.close(); }

    r = await call(AB, "GET", "/api/teachers");
    ok("后台看到待审老师", r.status === 200 && r.data.items.some((t) => t.name === "待审老师"), r.data.items.length + " 条");
    const tid = r.data.items.find((t) => t.name === "待审老师").id;
    r = await call(AB, "POST", "/api/teachers/approve", { id: tid });
    ok("通过老师申请", r.status === 200);
    r = await call(AB, "GET", "/api/teachers");
    ok("通过后队列移除", r.data.items.every((t) => t.id !== tid));

    /* 5. 作品审核：造一篇待审作品 → 通过 → 上架成教程 */
    { const db = new DatabaseSync(path.join(DATA_DIR, "miao.db"));
      const owner = db.prepare("SELECT id,name FROM users WHERE email=?").get(email);
      db.prepare("UPDATE users SET role='teacher' WHERE id=?").run(owner.id);
      db.prepare("INSERT INTO works (owner_id,title,status,chaps,views,seed_favs,size,updated,thumb,cover,hero,draft,created_at) VALUES (?,?,?,?,0,0,?,?,?,?,?,?,?)")
        .run(owner.id, "后台审核教程", "审核中", 2, 500, "2026-10-01", "", "", "", JSON.stringify({ title: "后台审核教程", intro: "x", cat: "前端开发", diff: "入门", tags: [], chapters: [{ id: "a1", title: "章一", blocks: [{ t: "p", text: "正文内容" }] }] }), Date.now());
      db.close(); }
    r = await call(AB, "GET", "/api/works");
    ok("后台看到待审作品", r.status === 200 && r.data.items.some((w) => w.title === "后台审核教程"), r.data.items.length + " 条");
    const wid = r.data.items.find((w) => w.title === "后台审核教程").id;
    r = await call(AB, "GET", "/api/works/preview?id=" + wid);
    ok("作品文档预览可用", r.status === 200 && r.data.chapters.length === 1, r.data.title);
    r = await call(AB, "POST", "/api/works/approve", { id: wid });
    ok("通过作品并上架为教程", r.status === 200 && !!r.data.tutorialId, r.data.tutorialId);
    r = await call(BB, "GET", "/api/tutorials/" + r.data.tutorialId);
    ok("上架后前台可读到该教程", r.status === 200 && r.data.tutorial.title === "后台审核教程");

    /* 6. 发公告 → 前台可读 */
    r = await call(AB, "POST", "/api/announcements/publish", { title: "测试公告", body: "这是一条后台发布的公告" });
    ok("后台发布公告", r.status === 200);
    r = await call(BB, "GET", "/api/announcements");
    ok("前台公告接口读到新公告", r.data.items.some((a) => a.title === "测试公告"));

    /* 7. 封禁管理 */
    r = await call(AB, "GET", "/api/bans");
    ok("封禁列表接口可用", r.status === 200 && Array.isArray(r.data.items));
    r = await call(AB, "POST", "/api/bans/clear", {});
    ok("清空封禁", r.status === 200);
  } catch (e) {
    results.push("FAIL | 测试脚本异常中断  → " + (e && e.message));
  }

  api.kill("SIGKILL"); adm.kill("SIGKILL");
  await sleep(300);
  fs.rmSync(DATA_DIR, { recursive: true, force: true });

  console.log(results.join("\n"));
  const fail = results.filter((x) => x.startsWith("FAIL")).length;
  console.log("\n合计：" + results.length + " 项，失败 " + fail + " 项");
  process.exit(fail ? 1 : 0);
})();
