/**
 * 喵站 · 后台管理系统（独立后端服务，独立端口）
 * - 只有管理员（口令登录）可访问；防爬/防脚本手段全部在本服务实现
 * - 启动：node server/admin.js   （默认 http://127.0.0.1:8788/）
 * - 管理员口令：必须由环境变量 MIAO_ADMIN_PASS（或 .env / config.json 的 admin.pass）提供；
 *   未提供时每次启动随机生成一次性口令，不存在任何默认口令
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const crypto = require("crypto");

const dbm = require("./db");
const { get, all, run, now, today } = dbm;
const S = require("./security");
const { load } = require("./config");
const cfg = load();

const PORT = Number(process.env.MIAO_ADMIN_PORT || cfg.admin.port || 8788);
const HOST = process.env.MIAO_ADMIN_HOST || "127.0.0.1";
/* 不再有内置默认口令：未配置时本次进程随机生成一次性口令（重启即失效） */
let ADMIN_PASS = process.env.MIAO_ADMIN_PASS || (cfg.admin && cfg.admin.pass) || "";
const ADMIN_PASS_IS_EPHEMERAL = !ADMIN_PASS;
if (ADMIN_PASS_IS_EPHEMERAL) ADMIN_PASS = crypto.randomBytes(12).toString("base64url");

/* 管理员会话（内存 + 简单 HMAC token） */
const tokens = new Map(); // token -> expire
function sha256(s) { return crypto.createHash("sha256").update(String(s)).digest("hex"); }

function send(res, status, data) {
  const body = typeof data === "string" ? data : JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": typeof data === "string" ? "text/plain; charset=utf-8" : "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(body);
}
function fail(res, status, msg) { send(res, status, { error: msg }); }
function ok(res, data) { send(res, 200, data || { ok: true }); }

function parseCookies(req) {
  const out = {};
  String(req.headers.cookie || "").split(";").forEach((p) => {
    const i = p.indexOf("=");
    if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
  });
  return out;
}
function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on("data", (c) => { size += c.length; if (size > (limit || 1e6)) { reject(new Error("too large")); req.destroy(); return; } chunks.push(c); });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

/* ---------------- 管理数据 ---------------- */
function pendingTeachers() {
  return all("SELECT id,name,descr,email,created_at FROM users WHERE applied = 1 AND role != 'teacher' AND role != 'admin'");
}
function pendingWorks() {
  return all("SELECT id,title,owner_id,chaps,size,updated,created_at FROM works WHERE status = '审核中' ORDER BY created_at DESC");
}
function stats() {
  return {
    teachers: pendingTeachers().length,
    works: pendingWorks().length,
    users: get("SELECT COUNT(*) c FROM users").c,
    tutorials: get("SELECT COUNT(*) c FROM tutorials").c,
    bans: get("SELECT COUNT(*) c FROM bans").c
  };
}

/* ---------------- API ---------------- */
async function api(req, res, pathname, query) {
  if (pathname === "/api/login") {
    const b = JSON.parse(await readBody(req, 1e5) || "{}");
    if (sha256(b.pass || "") !== sha256(ADMIN_PASS)) return fail(res, 401, "口令错误");
    const token = crypto.randomBytes(24).toString("hex");
    tokens.set(token, now() + 12 * 3600e3);
    res.setHeader("Set-Cookie", "miao_admin=" + token + "; Path=/; HttpOnly; SameSite=Lax");
    return ok(res, { ok: true });
  }
  if (pathname === "/api/logout") {
    const ck = parseCookies(req).miao_admin;
    if (ck) tokens.delete(ck);
    return ok(res, { ok: true });
  }
  /* 以下需登录 */
  const ck = parseCookies(req).miao_admin;
  if (!ck || !tokens.has(ck) || tokens.get(ck) < now()) return fail(res, 401, "未登录或会话过期");

  if (pathname === "/api/stats") return ok(res, stats());

  if (pathname === "/api/teachers") {
    const rows = pendingTeachers().map((t) => ({
      id: t.id, name: t.name, descr: t.descr, email: t.email,
      time: new Date(t.created_at).toLocaleString("zh-CN")
    }));
    return ok(res, { items: rows });
  }
  if (pathname === "/api/works") {
    const rows = pendingWorks().map((w) => ({
      id: w.id, title: w.title, chaps: w.chaps, size: w.size,
      bigDoc: (w.size || 0) > cfg.security.bigDocMB * 1024 * 1024,
      time: new Date(w.created_at).toLocaleString("zh-CN")
    }));
    return ok(res, { items: rows });
  }
  if (pathname === "/api/works/preview") {
    const w = get("SELECT * FROM works WHERE id = ?", Number(query.id));
    if (!w) return fail(res, 404, "作品不存在");
    let draft = {};
    try { draft = JSON.parse(w.draft || "{}"); } catch (e) { /* ignore */ }
    return ok(res, { title: w.title, chapters: draft.chapters || [], size: w.size, bigDoc: (w.size || 0) > cfg.security.bigDocMB * 1024 * 1024 });
  }

  /* 写操作：审核通过/驳回、发公告、解封 */
  if (pathname === "/api/teachers/approve") {
    const id = Number((JSON.parse(await readBody(req) || "{}")).id);
    run("UPDATE users SET role='teacher', applied=0 WHERE id = ?", id);
    return ok(res, { ok: true });
  }
  if (pathname === "/api/teachers/reject") {
    const id = Number((JSON.parse(await readBody(req) || "{}")).id);
    run("UPDATE users SET applied=0 WHERE id = ?", id);
    return ok(res, { ok: true });
  }
  if (pathname === "/api/works/approve") {
    const b = JSON.parse(await readBody(req) || "{}");
    const w = get("SELECT * FROM works WHERE id = ?", Number(b.id));
    if (!w) return fail(res, 404, "作品不存在");
    const draft = JSON.parse(w.draft || "{}");
    const tutId = "w" + w.id;
    run(`INSERT OR REPLACE INTO tutorials (id,title,intro,cat,diff,tags,thumb,cover,hero,author,chapters,seed_views,seed_favs,views,published,updated,created_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,0,0,0,1,?,?)`,
      tutId, w.title, draft.intro || "", draft.cat || "", draft.diff || "", JSON.stringify(draft.tags || []),
      w.thumb, w.cover, w.hero, get("SELECT name FROM users WHERE id = ?", w.owner_id).name,
      JSON.stringify(draft.chapters || []), today(), now());
    run("UPDATE works SET status='已发布' WHERE id = ?", w.id);
    return ok(res, { ok: true, tutorialId: tutId });
  }
  if (pathname === "/api/works/reject") {
    const id = Number((JSON.parse(await readBody(req) || "{}")).id);
    run("UPDATE works SET status='已驳回' WHERE id = ?", id);
    return ok(res, { ok: true });
  }
  if (pathname === "/api/announcements/publish") {
    const b = JSON.parse(await readBody(req) || "{}");
    if (!b.title || !b.body) return fail(res, 400, "标题与正文必填");
    run("INSERT INTO announcements (title,body,created_at) VALUES (?,?,?)", String(b.title).slice(0, 80), String(b.body).slice(0, 2000), now());
    return ok(res, { ok: true });
  }
  if (pathname === "/api/bans") {
    return ok(res, { items: all("SELECT * FROM bans ORDER BY until DESC") });
  }
  if (pathname === "/api/bans/clear") {
    const ip = (JSON.parse(await readBody(req) || "{}")).ip;
    if (ip) run("DELETE FROM bans WHERE ip = ?", ip); else run("DELETE FROM bans");
    return ok(res, { ok: true });
  }
  return fail(res, 404, "接口不存在");
}

/* ---------------- 静态管理页 ---------------- */
const ADMIN_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>喵站 · 后台管理系统</title>
<style>
:root{--accent:#e8507f;--bg:#f6f7f9;--card:#fff;--line:#e5e7eb;--txt:#1f2329;--txt2:#6b7280}
*{box-sizing:border-box}body{margin:0;font-family:system-ui,-apple-system,'PingFang SC',sans-serif;background:var(--bg);color:var(--txt)}
.wrap{max-width:920px;margin:0 auto;padding:24px 16px 60px}
h1{font-size:1.4rem;margin:0}h3{margin:18px 0 10px;font-size:1.05rem}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px}
.muted{color:var(--txt2);font-size:.82rem}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-top:16px}
.stat b{display:block;font-size:1.6rem}.stat span{color:var(--txt2);font-size:.82rem}
.row{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--line)}
.row:last-child{border-bottom:0}.grow{flex:1;min-width:0}
button{cursor:pointer;border:1px solid var(--line);background:#fff;border-radius:8px;padding:6px 14px;font-size:.85rem}
button.primary{background:var(--accent);color:#fff;border-color:var(--accent)}
button.ghost{background:#fff;color:var(--txt)}button.danger{color:#d33;border-color:#f0b7c0}
input,textarea{width:100%;padding:8px 10px;border:1px solid var(--line);border-radius:8px;font-size:.9rem;margin:6px 0}
.login{max-width:360px;margin:80px auto}
.toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#1f2329;color:#fff;padding:8px 16px;border-radius:8px;font-size:.85rem;opacity:0;transition:.3s}
.toast.show{opacity:1}
pre{white-space:pre-wrap;font-size:.85rem;background:#f6f7f9;padding:12px;border-radius:8px}
</style>
</head>
<body>
<div class="wrap" id="app">
  <div class="login card" id="loginBox">
    <h1>喵站后台</h1><p class="muted">管理员专用 · 请输入管理口令</p>
    <input type="password" id="pass" placeholder="管理口令">
    <button class="primary" id="go" style="width:100%;margin-top:6px">登录</button>
  </div>
  <div id="panel" style="display:none">
    <div style="display:flex;align-items:center;gap:12px">
      <h1>后台管理系统</h1><span class="muted" style="flex:1">防爬/防脚本已在此后端实施</span>
      <button class="ghost" id="out">退出</button>
    </div>
    <div class="grid" id="stats"></div>

    <h3>老师申请审核</h3><div class="card" id="teachers"></div>
    <h3>新教程审核 <span class="muted">（通过后上架，>20MB 每次修改需重新审核）</span></h3><div class="card" id="works"></div>
    <h3>发布公告</h3><div class="card">
      <input id="annTitle" placeholder="公告标题"><textarea id="annBody" rows="2" placeholder="公告内容"></textarea>
      <button class="primary" id="annPub">发布公告</button>
    </div>
    <h3>封禁管理</h3><div class="card" id="bans"></div>
  </div>
</div>
<div class="toast" id="toast"></div>
<script>
function toast(m){var t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
async function j(m,p,b){var o={method:m,headers:{'Content-Type':'application/json'}};if(b)o.body=JSON.stringify(b);var r=await fetch(p,o);var d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||('失败 '+r.status));return d}
function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
async function load(){
  var s=await j('GET','/api/stats');
  document.getElementById('stats').innerHTML=[['待审老师',s.teachers],['待审教程',s.works],['用户',s.users],['教程',s.tutorials],['封禁IP',s.bans]].map(x=>'<div class="card stat"><b>'+x[1]+'</b><span>'+x[0]+'</span></div>').join('');
  var ts=await j('GET','/api/teachers');document.getElementById('teachers').innerHTML=ts.items.map(t=>'<div class="row"><div class="grow"><b>'+esc(t.name)+'</b><div class="muted">'+esc(t.descr||'')+' ｜ '+esc(t.email||'')+'</div></div><button class="primary" data-ok="t" data-id="'+t.id+'">通过</button><button class="danger" data-no="t" data-id="'+t.id+'">驳回</button></div>').join('')||'<div class="muted">队列已清空</div>';
  var ws=await j('GET','/api/works');document.getElementById('works').innerHTML=ws.items.map(w=>'<div class="row"><div class="grow"><b>《'+esc(w.title)+'》</b>'+(w.bigDoc?' <span style="color:#d33">[大文档]</span>':'')+'<div class="muted">'+w.chaps+' 章 · '+esc(w.time)+'</div></div><button class="ghost" data-pv="'+w.id+'">预览</button><button class="primary" data-ok="w" data-id="'+w.id+'">通过</button><button class="danger" data-no="w" data-id="'+w.id+'">驳回</button></div>').join('')||'<div class="muted">队列已清空</div>';
  var bs=await j('GET','/api/bans');document.getElementById('bans').innerHTML=bs.items.map(b=>'<div class="row"><div class="grow"><b>'+esc(b.ip)+'</b><div class="muted">'+esc(b.reason||'')+' ｜ 至 '+new Date(b.until).toLocaleString()+'</div></div><button class="danger" data-unban="'+esc(b.ip)+'">解封</button></div>').join('')||'<div class="muted">无封禁</div>';
  bind();
}
function bind(){
  document.querySelectorAll('[data-ok]').forEach(b=>b.onclick=async()=>{try{await j('POST','/api/'+(b.dataset.ok==='t'?'teachers':'works')+'/approve',{id:+b.dataset.id});toast('已通过');load()}catch(e){toast(e.message)}});
  document.querySelectorAll('[data-no]').forEach(b=>b.onclick=async()=>{try{await j('POST','/api/'+(b.dataset.no==='t'?'teachers':'works')+'/reject',{id:+b.dataset.id});toast('已驳回');load()}catch(e){toast(e.message)}});
  document.querySelectorAll('[data-pv]').forEach(b=>b.onclick=async()=>{try{var d=await j('GET','/api/works/preview?id='+b.dataset.pv);var html='<h3>《'+esc(d.title)+'》'+(d.bigDoc?' <span style="color:#d33">[>20MB]</span>':'')+'</h3>';(d.chapters||[]).forEach((c,i)=>{html+='<p><b>'+(i+1)+'. '+esc(c.title)+'</b></p>';html+='<pre>'+esc(((c.blocks||[]).map(x=>x.text||x.code||'').join('\\n')||'').slice(0,800))+'</pre>'});var m=document.createElement('div');m.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;z-index:99';m.innerHTML='<div style="background:#fff;border-radius:12px;padding:20px;max-width:680px;width:92vw;max-height:84vh;overflow:auto">'+html+'<button onclick="this.closest(\'div\').parentElement.remove()" style="margin-top:12px">关闭</button></div>';document.body.appendChild(m)}catch(e){toast(e.message)}});
  document.querySelectorAll('[data-unban]').forEach(b=>b.onclick=async()=>{try{await j('POST','/api/bans/clear',{ip:b.dataset.unban});toast('已解封');load()}catch(e){toast(e.message)}});
  document.getElementById('annPub').onclick=async()=>{try{await j('POST','/api/announcements/publish',{title:document.getElementById('annTitle').value.trim(),body:document.getElementById('annBody').value.trim()});document.getElementById('annTitle').value='';document.getElementById('annBody').value='';toast('公告已发布')}catch(e){toast(e.message)}};
}
document.getElementById('go').onclick=async()=>{try{await j('POST','/api/login',{pass:document.getElementById('pass').value});document.getElementById('loginBox').style.display='none';document.getElementById('panel').style.display='';load()}catch(e){toast(e.message)}};
document.getElementById('out').onclick=async()=>{await j('POST','/api/logout');location.reload()};
</script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  S.securityHeaders(res);
  const ip = S.clientIp(req);
  const u = url.parse(req.url, true);

  /* 防爬/防脚本：全部在此后端实施 */
  if (S.isBanned(ip)) return send(res, 403, "访问被拒绝");
  if (u.pathname.indexOf("/api/") === 0) {
    if (S.isBot(req)) return send(res, 403, "检测到自动化访问");
    const rl = S.rateLimit("admin:" + ip, cfg.security.rate.write, 60000);
    if (!rl.ok) { if (rl.count > cfg.security.rate.write * 3) S.ban(ip, "后台请求过频", 30); return fail(res, 429, "请求过于频繁"); }
    return api(req, res, u.pathname, u.query).catch((e) => { console.error("[admin]", e); fail(res, 500, "服务器错误"); });
  }
  if (S.isBot(req)) return send(res, 403, "检测到自动化访问");
  if (S.TRAP.test(u.pathname)) { S.trapHit(ip); return send(res, 404, "404"); }
  send(res, 200, ADMIN_HTML);
});

server.listen(PORT, HOST, () => {
  console.log("\n喵站后台管理系统已启动  http://" + HOST + ":" + PORT + "/");
  console.log("  管理口令：" + (ADMIN_PASS_IS_EPHEMERAL
    ? "⚠ 未设置 MIAO_ADMIN_PASS，本次使用随机一次性口令「" + ADMIN_PASS + "」，重启即失效；请在 .env 中固定"
    : "已从环境变量 / .env 读取（已设置）"));
  console.log("  防爬/防脚本已在此服务实施：UA 拦截、蜜罐、限流、封禁\n");
});
function shutdown() { try { server.close(); } catch (e) {} process.exit(0); }
process.on("SIGINT", shutdown); process.on("SIGTERM", shutdown);
