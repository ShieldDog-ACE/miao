/**
 * 喵站后端 · 业务接口
 * 约定：所有接口返回 JSON；写操作需要登录 + HMAC 签名（见 security.verifySign）
 */
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const dbm = require("./db");
const { get, all, run, tx, now, today, sha256, ensureUser, bootstrapNewUser, setPassword, verifyPassword } = dbm;
const { clientIp, ban, rateLimit, verifySign, newKeys } = require("./security");
const { load } = require("./config");
const { sendLoginCode, mailReady } = require("./mailer");

const cfg = load();
const CODE_TTL_MIN = 10;
const CODE_MAX_TRIES = 6;
const SESSION_MS = cfg.sessionDays * 24 * 3600 * 1000;

/* ---------------- 基础工具 ---------------- */
function send(res, status, data, extraHeaders) {
  const body = typeof data === "string" ? data : JSON.stringify(data);
  res.writeHead(status, Object.assign({
    "Content-Type": typeof data === "string" ? "text/plain; charset=utf-8" : "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  }, extraHeaders || {}));
  res.end(body);
}
function fail(res, status, msg, code) { send(res, status, { error: msg, code: code || status }); }
function ok(res, data) { send(res, 200, data || { ok: true }); }
function parseCookies(req) {
  const out = {};
  String(req.headers.cookie || "").split(";").forEach((p) => {
    const i = p.indexOf("=");
    if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
  });
  return out;
}
function setCookie(res, name, value, opts) {
  const o = opts || {};
  const parts = [name + "=" + encodeURIComponent(value), "Path=/", "SameSite=Lax"];
  if (o.httpOnly) parts.push("HttpOnly");
  if (o.maxAge) parts.push("Max-Age=" + o.maxAge);
  if (o.secure) parts.push("Secure");
  const prev = res.getHeader("Set-Cookie");
  const list = prev ? (Array.isArray(prev) ? prev : [prev]) : [];
  list.push(parts.join("; "));
  res.setHeader("Set-Cookie", list);
}

/* ---------------- 会话 ---------------- */
function loadSession(req, res) {
  const cookies = parseCookies(req);
  const sid = cookies.miao_sid;
  if (!sid) return null;
  const s = get("SELECT * FROM sessions WHERE id = ?", sha256(sid));
  if (!s) return null;
  if (now() - s.last_at > SESSION_MS) { run("DELETE FROM sessions WHERE id = ?", s.id); return null; }
  if (now() - s.last_at > 60000) run("UPDATE sessions SET last_at = ? WHERE id = ?", now(), s.id);
  const user = get("SELECT * FROM users WHERE id = ?", s.user_id);
  if (!user) return null;
  return { row: s, user: user, cookies: cookies, clientKey: s.client_key, csrf: s.csrf };
}
function createSession(res, user, req) {
  const token = crypto.randomBytes(32).toString("hex");
  const keys = newKeys();
  const id = sha256(token);
  run(
    "INSERT INTO sessions (id,user_id,csrf,client_key,ip,ua,created_at,last_at) VALUES (?,?,?,?,?,?,?,?)",
    id, user.id, keys.csrf, keys.clientKey, clientIp(req), String(req.headers["user-agent"] || "").slice(0, 180), now(), now()
  );
  const secure = !!req.socket.encrypted;
  setCookie(res, "miao_sid", token, { httpOnly: true, maxAge: cfg.sessionDays * 86400, secure });
  setCookie(res, "miao_ck", keys.clientKey, { maxAge: cfg.sessionDays * 86400, secure });   // 前端用于 HMAC
  setCookie(res, "miao_csrf", keys.csrf, { maxAge: cfg.sessionDays * 86400, secure });
  return { csrf: keys.csrf, clientKey: keys.clientKey };
}
function publicUser(u) {
  return u ? {
    id: u.id, uid: "UID " + u.id, name: u.name, email: u.email || "", descr: u.descr || "", avatar: u.avatar || "",
    role: u.role || "user", applied: !!u.applied, teacher: u.role === "teacher" || u.role === "admin"
  } : null;
}
function countsOf(userName, userId) {
  return {
    follows: get("SELECT COUNT(*) AS c FROM follows WHERE user_id = ?", userId).c,
    fans: get("SELECT COUNT(*) AS c FROM follows WHERE target = ?", userName).c,
    favs: get("SELECT COUNT(*) AS c FROM favs WHERE user_id = ?", userId).c,
    friends: get("SELECT COUNT(*) AS c FROM follows f1 WHERE f1.user_id = ? AND EXISTS (SELECT 1 FROM follows f2 WHERE f2.user_id = (SELECT id FROM users WHERE name = f1.target) AND f2.target = ?)", userId).c || 0,
    works: get("SELECT COUNT(*) AS c FROM works WHERE owner_id = ?", userId).c
  };
}
/* 关系：followed(我关注他) / followsMe(他关注我) / friend(互关) */
function relationOf(userName, target) {
  if (!userName || !target || userName === target) {
    return { followed: false, followsMe: false, friend: false, self: userName === target };
  }
  const me = get("SELECT id FROM users WHERE name = ?", userName);
  const him = get("SELECT id FROM users WHERE name = ?", target);
  const followed = me ? !!get("SELECT 1 FROM follows WHERE user_id = ? AND target = ?", me.id, target) : false;
  const followsMe = him ? !!get("SELECT 1 FROM follows WHERE user_id = ? AND target = ?", him.id, userName) : false;
  return { followed: followed, followsMe: followsMe, friend: followed && followsMe, self: false };
}

/* ---------------- 元信息 ---------------- */
function meta(ctx) {
  // 分类体系：优先用 seed-data 里定义的层级分类（大类→小类），否则回退到教程的 cat 聚合
  const seedCats = dbm.readLegacyData && dbm.readLegacyData();
  const cats = all("SELECT cat, COUNT(*) AS c FROM tutorials WHERE published = 1 GROUP BY cat ORDER BY c DESC");
  // 英语模块数据（26 字母 / 48 音标）：随 meta 一并下发，前端不再保留副本
  const en = dbm.readEnData && dbm.readEnData();
  return ok(ctx.res, {
    site: "喵站",
    mailReady: mailReady(),
    categories: seedCats && seedCats.categories && !Array.isArray(seedCats.categories)
      ? seedCats.categories
      : cats.map((r) => r.cat).filter(Boolean),
    en: en ? { letters: en.letters, phonemes: en.phonemes, groups: en.groups } : null,
    stats: {
      tutorials: get("SELECT COUNT(*) AS c FROM tutorials WHERE published = 1").c,
      users: get("SELECT COUNT(*) AS c FROM users").c,
      authors: get("SELECT COUNT(DISTINCT author) AS c FROM tutorials WHERE published = 1").c
    }
  });
}

/* ---------------- 登录：邮箱验证码 ---------------- */
async function requestCode(ctx) {
  const email = String((ctx.body && ctx.body.email) || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return fail(ctx.res, 400, "邮箱格式不正确");

  // 蜜罐字段：正常用户不会填
  if (ctx.body && (ctx.body.website || ctx.body.company)) {
    ban(ctx.ip, "表单蜜罐命中", 1440);
    return fail(ctx.res, 400, "请求被拒绝");
  }
  // 规则：验证码一分钟只发一次；10 分钟内连续申请 5 次 → 封 IP 24 小时
  const win10 = rateLimit("code10:" + ctx.ip, cfg.security.codePer10min, 600000);
  if (win10.count > cfg.security.codePer10min) {
    ban(ctx.ip, "10 分钟内验证码申请达 " + win10.count + " 次", 1440);
    return fail(ctx.res, 403, "请求过于频繁，IP 已被临时封禁");
  }
  const burst = rateLimit("code1m:" + ctx.ip, 3, 60000);
  if (!burst.ok) return fail(ctx.res, 429, "请求过于频繁，请稍后再试");

  const prev = get("SELECT * FROM codes WHERE email = ?", email);
  if (prev && now() - prev.sent_at < 60000) {
    const wait = Math.ceil((60000 - (now() - prev.sent_at)) / 1000);
    return fail(ctx.res, 429, "请 " + wait + " 秒后再获取验证码");
  }
  if (prev && now() - prev.sent_at < 3600000 && prev.tries >= 10) {
    return fail(ctx.res, 429, "该邮箱请求次数过多，请稍后再试");
  }

  const code = String(crypto.randomInt(100000, 1000000));
  run(
    "INSERT INTO codes (email,hash,expires,tries,sent_at,ip) VALUES (?,?,?,0,?,?) " +
    "ON CONFLICT(email) DO UPDATE SET hash=excluded.hash, expires=excluded.expires, tries=0, sent_at=excluded.sent_at, ip=excluded.ip",
    email, sha256(code + ":" + email), now() + CODE_TTL_MIN * 60000, now(), ctx.ip
  );
  try {
    await sendLoginCode(email, code, CODE_TTL_MIN);
  } catch (e) {
    console.error("[mail] 发送失败：", e.message);
    return fail(ctx.res, 502, "验证码发送失败：" + e.message);
  }
  return ok(ctx.res, { sent: true, email: email, ttlMinutes: CODE_TTL_MIN, dev: !mailReady() });
}

function verifyCode(ctx) {
  const email = String((ctx.body && ctx.body.email) || "").trim().toLowerCase();
  const code = String((ctx.body && ctx.body.code) || "").trim();
  const name = String((ctx.body && ctx.body.name) || "").trim();
  if (!email || !/^\d{6}$/.test(code)) return fail(ctx.res, 400, "请输入 6 位验证码");

  const rec = get("SELECT * FROM codes WHERE email = ?", email);
  if (!rec) return fail(ctx.res, 400, "请先获取验证码");
  if (rec.expires < now()) { run("DELETE FROM codes WHERE email = ?", email); return fail(ctx.res, 400, "验证码已过期，请重新获取"); }
  if (rec.tries >= CODE_MAX_TRIES) { run("DELETE FROM codes WHERE email = ?", email); return fail(ctx.res, 429, "尝试次数过多，请重新获取验证码"); }
  if (rec.hash !== sha256(code + ":" + email)) {
    run("UPDATE codes SET tries = tries + 1 WHERE email = ?", email);
    return fail(ctx.res, 400, "验证码不正确");
  }

  let user = get("SELECT * FROM users WHERE email = ?", email);
  let isNew = false;
  if (!user) {
    isNew = true;
    let finalName = name || (email.split("@")[0] || "喵友").slice(0, 24);
    if (get("SELECT 1 FROM users WHERE name = ?", finalName)) finalName = finalName + "_" + crypto.randomInt(100, 999);
    run(
      "INSERT INTO users (name,email,descr,role,applied,created_at) VALUES (?,?,?,?,0,?)",
      finalName, email, "", "user", now()
    );
    user = get("SELECT * FROM users WHERE email = ?", email);
    bootstrapNewUser(user.id, user.name);
  }
  run("DELETE FROM codes WHERE email = ?", email);
  const keys = createSession(ctx.res, user, ctx.req);
  return ok(ctx.res, { user: publicUser(user), csrf: keys.csrf, isNew: isNew, counts: countsOf(user.name, user.id) });
}

function logout(ctx) {
  const cookies = parseCookies(ctx.req);
  if (cookies.miao_sid) run("DELETE FROM sessions WHERE id = ?", sha256(cookies.miao_sid));
  ["miao_sid", "miao_ck", "miao_csrf"].forEach((n) => setCookie(ctx.res, n, "", { maxAge: 0 }));
  return ok(ctx.res, { ok: true });
}

/* ---------------- 账号密码登录 / 注册 ---------------- */
/* 密码规则：固定 6 位数字 */
function validPw(pw) { return typeof pw === "string" && /^\d{6}$/.test(pw); }

/* 用户名 + 密码注册（可选邮箱）；用户名唯一，密码 SHA-256+盐 存 hex */
function register(ctx) {
  const name = String((ctx.body && ctx.body.name) || "").trim();
  const pw = ctx.body && ctx.body.pw;
  const email = String((ctx.body && ctx.body.email) || "").trim().toLowerCase();
  if (name.length < 2 || name.length > 24) return fail(ctx.res, 400, "用户名需 2-24 个字符");
  if (!validPw(pw)) return fail(ctx.res, 400, "密码必须是 6 位数字");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return fail(ctx.res, 400, "邮箱格式不正确");
  if (get("SELECT 1 FROM users WHERE name = ?", name)) return fail(ctx.res, 409, "用户名已被占用");
  if (email && get("SELECT 1 FROM users WHERE email = ?", email)) return fail(ctx.res, 409, "邮箱已注册，可直接登录");

  run("INSERT INTO users (name,email,descr,role,applied,created_at) VALUES (?,?,?,?,0,?)",
    name, email || null, "", "user", now());
  const user = get("SELECT * FROM users WHERE name = ?", name);
  setPassword(user.id, pw);
  bootstrapNewUser(user.id, user.name);
  const keys = createSession(ctx.res, user, ctx.req);
  return ok(ctx.res, { user: publicUser(user), csrf: keys.csrf, isNew: true, counts: countsOf(user.name, user.id) });
}

/* 用户名 + 密码登录 */
function passwordLogin(ctx) {
  const name = String((ctx.body && ctx.body.name) || "").trim();
  const pw = ctx.body && ctx.body.pw;
  if (!name || !validPw(pw)) return fail(ctx.res, 400, "请输入用户名和密码");

  const rl = rateLimit("pwlogin:" + ctx.ip, cfg.security.rate.auth, 600000);
  if (!rl.ok) { ban(ctx.ip, "密码登录尝试过频", 30); return fail(ctx.res, 429, "尝试过于频繁，请稍后再试"); }

  const user = get("SELECT * FROM users WHERE name = ?", name);
  if (!user || !verifyPassword(pw, user.pw_salt, user.pw_hash)) {
    return fail(ctx.res, 401, "用户名或密码错误");
  }
  const keys = createSession(ctx.res, user, ctx.req);
  return ok(ctx.res, { user: publicUser(user), csrf: keys.csrf, counts: countsOf(user.name, user.id) });
}

/* 已登录用户设置/修改密码 */
function setPw(ctx) {
  const oldPw = ctx.body && ctx.body.oldPw;
  const newPw = ctx.body && ctx.body.newPw;
  if (!validPw(newPw)) return fail(ctx.res, 400, "新密码必须是 6 位数字");
  const u = get("SELECT * FROM users WHERE id = ?", ctx.user.id);
  if (u.pw_hash && !verifyPassword(oldPw || "", u.pw_salt, u.pw_hash)) {
    return fail(ctx.res, 401, "原密码不正确");
  }
  setPassword(u.id, newPw);
  return ok(ctx.res, { set: true });
}

/* ---------------- 我 / 资料 ---------------- */
function me(ctx) {
  if (!ctx.user) return ok(ctx.res, { user: null });
  return ok(ctx.res, {
    user: publicUser(ctx.user),
    counts: countsOf(ctx.user.name, ctx.user.id),
    csrf: ctx.session ? ctx.session.row.csrf : null
  });
}
function applyTeacher(ctx) {
  if (ctx.user.role === "teacher" || ctx.user.role === "admin") {
    return ok(ctx.res, { already: true, user: publicUser(ctx.user) });
  }
  const cool = cfg.security.applyCooldownMin * 60000;
  const wu = get("SELECT withdraw_at FROM users WHERE id = ?", ctx.user.id);
  if (wu && wu.withdraw_at && now() - wu.withdraw_at < cool) {
    const left = Math.ceil((cool - (now() - wu.withdraw_at)) / 60000);
    return fail(ctx.res, 429, "撤回申请后 " + cfg.security.applyCooldownMin + " 分钟内不可再次申请（还剩约 " + left + " 分钟）");
  }
  run("UPDATE users SET applied = 1 WHERE id = ?", ctx.user.id);
  /* 演示配置：提交即通过。正式部署设 MIAO_AUTO_TEACHER=false 走人工审核 */
  const auto = cfg.security.autoApproveTeacher !== false;
  if (auto) run("UPDATE users SET role = 'teacher' WHERE id = ?", ctx.user.id);
  const u = get("SELECT * FROM users WHERE id = ?", ctx.user.id);
  return ok(ctx.res, { user: publicUser(u), auto: auto });
}
function updateProfile(ctx) {
  const descr = ctx.body.descr == null ? null : String(ctx.body.descr).slice(0, 200);
  const avatar = ctx.body.avatar == null ? null : String(ctx.body.avatar);
  const name = ctx.body.name == null ? null : String(ctx.body.name).trim();
  if (name && name !== ctx.user.name) {
    if (name.length < 2 || name.length > 24) return fail(ctx.res, 400, "昵称长度需在 2-24 个字符");
    if (get("SELECT 1 FROM users WHERE name = ?", name)) return fail(ctx.res, 409, "该昵称已被占用");
    tx(() => {
      run("UPDATE users SET name = ? WHERE id = ?", name, ctx.user.id);
      run("UPDATE follows SET target = ? WHERE target = ?", name, ctx.user.name);
      run("UPDATE friend_reqs SET from_name = ? WHERE from_name = ?", name, ctx.user.name);
      run("UPDATE tutorials SET author = ? WHERE author = ?", name, ctx.user.name);
    });
  }
  if (descr != null) run("UPDATE users SET descr = ? WHERE id = ?", descr, ctx.user.id);
  if (avatar != null && (avatar === "" || /^(\/uploads\/|data:image\/)/.test(avatar))) {
    run("UPDATE users SET avatar = ? WHERE id = ?", avatar.slice(0, 300000), ctx.user.id);
  }
  const u = get("SELECT * FROM users WHERE id = ?", ctx.user.id);
  return ok(ctx.res, { user: publicUser(u) });
}

/* ---------------- 关注 / 好友 ---------------- */
function relPayload(name, target) {
  const rel = relationOf(name, target);
  const u = get("SELECT * FROM users WHERE name = ?", target);
  return {
    target: target,
    relation: rel,
    fans: get("SELECT COUNT(*) AS c FROM follows WHERE target = ?", target).c,
    follows: u ? get("SELECT COUNT(*) AS c FROM follows WHERE user_id = ?", u.id).c : 0
  };
}
function follow(ctx) {
  const target = String((ctx.body && ctx.body.name) || "").trim();
  if (!target) return fail(ctx.res, 400, "缺少目标用户");
  if (target === ctx.user.name) return fail(ctx.res, 400, "不能关注自己");
  ensureUser(target, {});
  run("INSERT OR IGNORE INTO follows (user_id,target,created_at) VALUES (?,?,?)", ctx.user.id, target, now());
  // 互关即成为好友：清理对方待处理的申请
  const rel = relationOf(ctx.user.name, target);
  if (rel.friend) {
    const him = get("SELECT id FROM users WHERE name = ?", target);
    if (him) run("UPDATE friend_reqs SET status='accepted' WHERE from_name = ? AND to_user = ?", target, ctx.user.id);
  }
  return ok(ctx.res, Object.assign(relPayload(ctx.user.name, target), { becameFriend: rel.friend }));
}
function unfollow(ctx) {
  const target = String((ctx.body && ctx.body.name) || "").trim();
  run("DELETE FROM follows WHERE user_id = ? AND target = ?", ctx.user.id, target);
  return ok(ctx.res, relPayload(ctx.user.name, target));
}
function friendList(ctx) {
  const friends = all(
    "SELECT u.name, u.descr, u.role, (SELECT COUNT(*) FROM follows f WHERE f.target = u.name) AS fans " +
    "FROM users u WHERE EXISTS (SELECT 1 FROM follows f1 WHERE f1.user_id = ? AND f1.target = u.name) " +
    "AND EXISTS (SELECT 1 FROM follows f2 WHERE f2.user_id = u.id AND f2.target = ?)",
    ctx.user.id, ctx.user.name
  ).map((r) => ({ name: r.name, descr: r.descr || "", fans: r.fans, teacher: r.role === "teacher" }));
  const requests = all("SELECT from_name FROM friend_reqs WHERE to_user = ? AND status = 'pending'", ctx.user.id)
    .map((r) => r.from_name);
  const following = all("SELECT target FROM follows WHERE user_id = ? ORDER BY created_at DESC", ctx.user.id)
    .map((r) => r.target);
  const fans = all("SELECT u.name FROM follows f JOIN users u ON u.id = f.user_id WHERE f.target = ?", ctx.user.name)
    .map((r) => r.name);
  return ok(ctx.res, { friends: friends, requests: requests, following: following, fans: fans });
}
function friendRequest(ctx) {
  const target = String((ctx.body && ctx.body.name) || "").trim();
  if (!target) return fail(ctx.res, 400, "缺少目标用户");
  if (target === ctx.user.name) return fail(ctx.res, 400, "不能加自己为好友");
  const him = ensureUser(target, {});
  const rel = relationOf(ctx.user.name, target);
  if (rel.friend) return ok(ctx.res, Object.assign(relPayload(ctx.user.name, target), { already: true }));
  run("INSERT OR REPLACE INTO friend_reqs (from_name,to_user,status,created_at) VALUES (?,?,?,?)",
    ctx.user.name, him.id, "pending", now());
  // 演示友好：对方收到申请后立即「同意」，于是直接互为关注
  tx(() => {
    run("INSERT OR IGNORE INTO follows (user_id,target,created_at) VALUES (?,?,?)", ctx.user.id, target, now());
    run("INSERT OR IGNORE INTO follows (user_id,target,created_at) VALUES (?,?,?)", him.id, ctx.user.name, now());
    run("UPDATE friend_reqs SET status='accepted' WHERE from_name = ? AND to_user = ?", ctx.user.name, him.id);
  });
  return ok(ctx.res, relPayload(ctx.user.name, target));
}
function friendAccept(ctx) {
  const from = String((ctx.body && ctx.body.name) || "").trim();
  const him = ensureUser(from, {});
  tx(() => {
    run("UPDATE friend_reqs SET status='accepted' WHERE from_name = ? AND to_user = ?", from, ctx.user.id);
    run("INSERT OR IGNORE INTO follows (user_id,target,created_at) VALUES (?,?,?)", ctx.user.id, from, now());
    run("INSERT OR IGNORE INTO follows (user_id,target,created_at) VALUES (?,?,?)", him.id, ctx.user.name, now());
  });
  return ok(ctx.res, relPayload(ctx.user.name, from));
}
function friendIgnore(ctx) {
  const from = String((ctx.body && ctx.body.name) || "").trim();
  run("UPDATE friend_reqs SET status='ignored' WHERE from_name = ? AND to_user = ?", from, ctx.user.id);
  return ok(ctx.res, { ignored: from });
}
function friendRemove(ctx) {
  const target = String((ctx.body && ctx.body.name) || "").trim();
  const him = get("SELECT id FROM users WHERE name = ?", target);
  tx(() => {
    run("DELETE FROM follows WHERE user_id = ? AND target = ?", ctx.user.id, target);
    if (him) run("DELETE FROM follows WHERE user_id = ? AND target = ?", him.id, ctx.user.name);
  });
  return ok(ctx.res, relPayload(ctx.user.name, target));
}

/* ---------------- 教程 ---------------- */
function tutRow(r, withChapters) {
  const chapters = JSON.parse(r.chapters || "[]");
  const t = {
    id: r.id, title: r.title, intro: r.intro, cat: r.cat, diff: r.diff,
    tags: JSON.parse(r.tags || "[]"), author: r.author,
    thumb: r.thumb, cover: r.cover, hero: r.hero,
    students: (r.seed_views || 0) + (r.views || 0),
    favs: (r.seed_favs || 0) + get("SELECT COUNT(*) AS c FROM favs WHERE tutorial_id = ?", r.id).c,
    chaps: chapters.length, updated: r.updated
  };
  if (withChapters) t.chapters = chapters; else t.chapters = chapters.map((c) => ({ id: c.id, title: c.title }));
  return t;
}
function listTutorials(ctx) {
  const q = ctx.query || {};
  const where = ["published = 1"], params = [];
  if (q.cat) { where.push("cat = ?"); params.push(q.cat); }
  if (q.author) { where.push("author = ?"); params.push(q.author); }
  if (q.q) {
    where.push("(title LIKE ? OR intro LIKE ? OR tags LIKE ?)");
    const like = "%" + q.q + "%";
    params.push(like, like, like);
  }
  const size = Math.min(50, Math.max(1, Number(q.size) || 24));   // 单页上限 50，防一次性拉全站
  const page = Math.max(1, Number(q.page) || 1);
  const order = q.sort === "new" ? "updated DESC" : "((seed_views + views) * 1.0) DESC";
  const rows = all("SELECT * FROM tutorials WHERE " + where.join(" AND ") + " ORDER BY " + order + " LIMIT ? OFFSET ?",
    ...params.concat([size, (page - 1) * size]));
  const total = get("SELECT COUNT(*) AS c FROM tutorials WHERE " + where.join(" AND "), ...params).c;
  return ok(ctx.res, { total: total, page: page, size: size, items: rows.map((r) => tutRow(r, false)) });
}
function tutorialDetail(ctx) {
  const r = get("SELECT * FROM tutorials WHERE id = ? AND published = 1", ctx.params.id);
  if (!r) return fail(ctx.res, 404, "教程不存在");
  const logged = !!ctx.user;
  const faved = logged ? !!get("SELECT 1 FROM favs WHERE user_id = ? AND tutorial_id = ?", ctx.user.id, r.id) : false;
  return ok(ctx.res, {
    tutorial: tutRow(r, false),           // 正文一律按需经 /chapters 分层加载
    locked: !logged,
    faved: faved,
    relation: logged ? relationOf(ctx.user.name, r.author) : null,
    progress: logged ? all("SELECT chapter_id FROM progress WHERE user_id = ? AND tutorial_id = ?", ctx.user.id, r.id).map((x) => x.chapter_id) : []
  });
}
function countView(r, who) {
  const ins = run("INSERT OR IGNORE INTO view_marks (who,tutorial_id,day,created_at) VALUES (?,?,?,?)", who, r.id, today(), now());
  if (ins.changes > 0) run("UPDATE tutorials SET views = views + 1 WHERE id = ?", r.id);
}
function viewTutorial(ctx) {
  const r = get("SELECT * FROM tutorials WHERE id = ? AND published = 1", ctx.params.id);
  if (!r) return fail(ctx.res, 404, "教程不存在");
  countView(r, ctx.user ? "u" + ctx.user.id : "ip:" + sha256(ctx.ip).slice(0, 16));
  const fresh = get("SELECT * FROM tutorials WHERE id = ?", r.id);
  return ok(ctx.res, { views: (fresh.seed_views || 0) + (fresh.views || 0) });
}
function blockLen(b) {
  if (b.text) return String(b.text).length;
  if (b.code) return String(b.code).length;
  if (Array.isArray(b.items)) return b.items.join("").length;
  /* 说明：img / audio / en（英语卡片）等交互块一律返回 0 —— 它们不计入分窗配额。
     好处是这类块永远不会被窗口切成两半，卡片组始终完整下发；
     代价是含交互块的章节正文几乎总是 hasMore=false，读者不需要点「继续加载」。 */
  return 0;
}
/* 分层加载：每次只下发约 2000 字（按块取整），offset 为已读字符数 */
function readChapter(ctx) {
  const r = get("SELECT * FROM tutorials WHERE id = ? AND published = 1", ctx.params.id);
  if (!r) return fail(ctx.res, 404, "教程不存在");
  const chapters = JSON.parse(r.chapters || "[]");
  const ch = chapters.find((c) => c.id === ctx.params.cid);
  if (!ch) return fail(ctx.res, 404, "章节不存在");

  const offset = Math.max(0, Number(ctx.query.offset) || 0);
  const who = ctx.user ? "u" + ctx.user.id : "ip:" + sha256(ctx.ip).slice(0, 16);   // 游客按 IP 计数
  if (offset === 0) {
    const rl = rateLimit("read:" + who, cfg.security.docsPerMin, 60000);
    if (!rl.ok) return fail(ctx.res, 429, "阅读太快啦：每分钟最多 " + cfg.security.docsPerMin + " 篇文档");
    countView(r, who);
  }
  /* 学习进度只记录登录用户 */
  if (ctx.user) {
    run("INSERT OR REPLACE INTO progress (user_id,tutorial_id,chapter_id,updated_at) VALUES (?,?,?,?)",
      ctx.user.id, r.id, ch.id, now());
  }

  const blocks = ch.blocks || [];
  const total = blocks.reduce((s, b) => s + blockLen(b), 0);
  const W = cfg.security.chapterWindow;
  const out = [];
  let cum = 0, served = 0, i = 0, skipped = 0;
  while (i < blocks.length) {
    const n = blockLen(blocks[i]);
    if (cum + n <= offset) { cum += n; i++; continue; }
    break;
  }
  skipped = cum;
  for (; i < blocks.length && served < W; i++) {
    out.push(blocks[i]);
    served += blockLen(blocks[i]);
    cum += blockLen(blocks[i]);
  }
  const hasMore = cum < total;
  return ok(ctx.res, {
    chapter: { id: ch.id, title: ch.title, blocks: out },
    title: r.title,
    chapters: chapters.map((c) => ({ id: c.id, title: c.title })),
    window: { offset: skipped, served: served, nextOffset: cum, totalChars: total, hasMore: hasMore, window: W }
  });
}
function favToggle(ctx, on) {
  const r = get("SELECT * FROM tutorials WHERE id = ?", ctx.params.id);
  if (!r) return fail(ctx.res, 404, "教程不存在");
  if (on) run("INSERT OR IGNORE INTO favs (user_id,tutorial_id,created_at) VALUES (?,?,?)", ctx.user.id, r.id, now());
  else run("DELETE FROM favs WHERE user_id = ? AND tutorial_id = ?", ctx.user.id, r.id);
  const fresh = get("SELECT * FROM tutorials WHERE id = ?", r.id);
  return ok(ctx.res, { faved: on, favs: (fresh.seed_favs || 0) + get("SELECT COUNT(*) AS c FROM favs WHERE tutorial_id = ?", r.id).c });
}
function myFavs(ctx) {
  const rows = all(
    "SELECT t.* FROM favs f JOIN tutorials t ON t.id = f.tutorial_id WHERE f.user_id = ? ORDER BY f.created_at DESC",
    ctx.user.id
  );
  return ok(ctx.res, { items: rows.map((r) => tutRow(r, false)) });
}

/* ---------------- 用户主页 ---------------- */
function userProfile(ctx) {
  const name = ctx.params.name;
  const u = get("SELECT * FROM users WHERE name = ?", name);
  if (!u) return fail(ctx.res, 404, "用户不存在");
  const tuts = all("SELECT * FROM tutorials WHERE author = ? AND published = 1 ORDER BY (seed_views + views) DESC", name)
    .map((r) => tutRow(r, false));
  const works = all("SELECT * FROM works WHERE owner_id = ? AND status = '已发布' ORDER BY created_at DESC", u.id)
    .map((w) => ({
      id: "w" + w.id, title: w.title, intro: "老师发布的作品", cat: "", diff: "掌握", tags: [],
      author: name, thumb: w.thumb, cover: w.cover, hero: w.hero,
      students: w.views, favs: w.seed_favs || 0, chaps: w.chaps, updated: w.updated, fromWork: true
    }));
  const items = tuts.concat(works);
  return ok(ctx.res, {
    user: { id: u.id, name: u.name, descr: u.descr, avatar: u.avatar, role: u.role, teacher: u.role === "teacher" || u.role === "admin" },
    relation: ctx.user ? relationOf(ctx.user.name, name) : { followed: false, followsMe: false, friend: false, self: false },
    counts: {
      follows: get("SELECT COUNT(*) AS c FROM follows WHERE user_id = ?", u.id).c,
      fans: get("SELECT COUNT(*) AS c FROM follows WHERE target = ?", name).c,
      works: items.length,
      favs: items.reduce((s, t) => s + t.favs, 0)
    },
    works: items
  });
}

/* ---------------- 我的作品 / 草稿 ---------------- */
function myWorks(ctx) {
  const rows = all("SELECT * FROM works WHERE owner_id = ? ORDER BY created_at DESC", ctx.user.id);
  return ok(ctx.res, {
    items: rows.map((w) => ({
      id: w.id, title: w.title, status: w.status, chaps: w.chaps, views: w.views,
      favs: w.seed_favs || 0, updated: w.updated, thumb: w.thumb, cover: w.cover, hero: w.hero
    }))
  });
}
function publishWork(ctx) {
  if (ctx.user.role !== "teacher" && ctx.user.role !== "admin") return fail(ctx.res, 403, "仅认证老师可发布教程");
  const b = ctx.body || {};
  const miss = [];
  if (!b.title || !String(b.title).trim()) miss.push("教程标题");
  if (!b.intro || !String(b.intro).trim()) miss.push("简介");
  if (!b.thumb) miss.push("缩略图");
  if (!b.cover) miss.push("卡片图");
  if (!b.hero) miss.push("完整图");
  const chapters = Array.isArray(b.chapters) ? b.chapters : [];
  const hasContent = chapters.some((c) => (c.blocks || []).some((x) => x.text || x.code || (x.items || []).length || x.src || x.title));
  if (!hasContent) miss.push("正文内容");
  if (miss.length) return fail(ctx.res, 400, "无法发布，请先完成：" + miss.join("、"));
  const bad = ["thumb", "cover", "hero"].find((k) => !/^(\/uploads\/|data:image\/)/.test(String(b[k])));
  if (bad) return fail(ctx.res, 400, "展示图必须先上传到本站（" + bad + "）");
  // 防灌水：10 分钟内发布超过 10 篇 → 直接封禁 24 小时
  const pc = rateLimit("pub:" + ctx.user.id, cfg.security.publishPer10min, 600000);
  if (!pc.ok) {
    ban(ctx.ip, "10 分钟内发布超过 " + cfg.security.publishPer10min + " 篇", 1440);
    return fail(ctx.res, 403, "发布过于频繁，账号已封禁 24 小时");
  }
  const draftJson = JSON.stringify({ title: b.title, intro: b.intro, cat: b.cat, diff: b.diff, tags: b.tags, chapters: chapters });
  const size = Buffer.byteLength(draftJson, "utf8");
  const bigDoc = size > cfg.security.bigDocMB * 1024 * 1024;
  const info = run(
    "INSERT INTO works (owner_id,title,status,chaps,views,seed_favs,size,updated,thumb,cover,hero,draft,created_at) VALUES (?,?,?,?,0,0,?,?,?,?,?,?,?)",
    ctx.user.id, String(b.title).slice(0, 120), "审核中", chapters.length, today(), size,
    String(b.thumb), String(b.cover), String(b.hero), draftJson, now()
  );
  return ok(ctx.res, {
    id: info.lastInsertRowid, status: "审核中", size: size,
    bigDoc: bigDoc,
    note: bigDoc ? "文档超过 " + cfg.security.bigDocMB + "MB，每次修改都需重新审核" : undefined
  });
}
function withdrawApply(ctx) {
  run("UPDATE users SET applied = 0, withdraw_at = ? WHERE id = ?", now(), ctx.user.id);
  return ok(ctx.res, { withdrawn: true, cooldownMinutes: cfg.security.applyCooldownMin });
}
function announcements(ctx) {
  const rows = all("SELECT * FROM announcements ORDER BY created_at DESC LIMIT 20");
  return ok(ctx.res, { items: rows.map((r) => ({ id: r.id, title: r.title, body: r.body, created_at: r.created_at })) });
}
function deleteWork(ctx) {
  const w = get("SELECT * FROM works WHERE id = ? AND owner_id = ?", ctx.params.id, ctx.user.id);
  if (!w) return fail(ctx.res, 404, "作品不存在");
  run("DELETE FROM works WHERE id = ?", w.id);
  return ok(ctx.res, { deleted: w.id });
}
function getDraft(ctx) {
  const d = get("SELECT * FROM drafts WHERE user_id = ?", ctx.user.id);
  return ok(ctx.res, { draft: d ? JSON.parse(d.json) : null, updated: d ? d.updated_at : null });
}
function putDraft(ctx) {
  const draft = (ctx.body && ctx.body.draft) || {};
  run("INSERT INTO drafts (user_id,json,updated_at) VALUES (?,?,?) ON CONFLICT(user_id) DO UPDATE SET json=excluded.json, updated_at=excluded.updated_at",
    ctx.user.id, JSON.stringify(draft).slice(0, 4000000), now());
  return ok(ctx.res, { saved: true, at: now() });
}

/* ---------------- 图片上传 ---------------- */
const MAGIC = [
  [0x89, 0x50, 0x4e, 0x47], [0xff, 0xd8, 0xff], [0x47, 0x49, 0x46, 0x38], [0x52, 0x49, 0x46, 0x46]
];
function uploadImage(ctx) {
  const dataUrl = String((ctx.body && ctx.body.dataUrl) || "");
  const m = /^data:(image\/(?:png|jpeg|jpg|gif|webp|svg\+xml));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!m) return fail(ctx.res, 400, "仅支持 PNG / JPEG / GIF / WebP / SVG 的 base64 图片");
  const buf = Buffer.from(m[2], "base64");
  if (buf.length > 1024 * 1024) return fail(ctx.res, 413, "图片需小于 1MB");
  let ext;
  if (m[1].indexOf("svg") >= 0) {
    const txt = buf.toString("utf8");
    if (/<script|onload\s*=|onerror\s*=|javascript:|<foreignObject/i.test(txt)) {
      return fail(ctx.res, 400, "SVG 中含可执行内容，已拒绝");
    }
    ext = "svg";
  } else {
    if (!MAGIC.some((sig) => sig.every((b, i) => buf[i] === b))) return fail(ctx.res, 400, "图片内容与格式不符");
    ext = /jpe?g/.test(m[1]) ? "jpg" : /gif/.test(m[1]) ? "gif" : /webp/.test(m[1]) ? "webp" : "png";
  }
  const name = crypto.randomBytes(10).toString("hex") + "." + ext;
  fs.writeFileSync(path.join(cfg.uploadDir, name), buf);
  return ok(ctx.res, { url: "/uploads/" + name, size: buf.length });
}

/* ---------------- 接口文档（给 AI 用） ---------------- */
function apiDocs(ctx) {
  const md = [
    "# 喵站 REST 接口文档",
    "",
    "所有接口返回 JSON；写操作需登录并在请求头带 `X-Miao-Nonce` 与 `X-Miao-Sign`。",
    "签名算法：HMAC-SHA256(clientKey, METHOD + \"\\n\" + PATH + \"\\n\" + BODY + \"\\n\" + nonce)，clientKey 取自 Cookie `miao_ck`。",
    "",
    "## 登录（邮箱验证码）",
    "- POST /api/auth/request-code  { email } → 发送 6 位验证码（10 分钟有效）",
    "- POST /api/auth/verify        { email, code, name? } → 建立会话，返回 user / csrf",
    "- POST /api/auth/logout",
    "- GET  /api/me                 当前用户与统计（关注 / 粉丝 / 收藏 / 好友 / 作品）",
    "- POST /api/me/profile         { name?, descr?, avatar? }",
    "",
    "## 教程",
    "- GET  /api/tutorials?cat=&q=&sort=hot|new&page=&size=  列表（不含正文）",
    "- GET  /api/tutorials/:id                              详情（未登录 locked=true 且不下发正文）",
    "- POST /api/tutorials/:id/view                         记一次浏览（同日同人去重）",
    "- GET  /api/tutorials/:id/chapters/:cid                读正文（分层加载，每次约 2000 字，offset 翻页）",
    "- POST /api/tutorials/:id/fav  / DELETE                 收藏 / 取消收藏",
    "- GET  /api/my/favs                                   我的收藏",
    "",
    "## 社交（好友 = 互相关注）",
    "- POST /api/follow { name } / POST /api/unfollow { name }",
    "- GET  /api/friends                                    好友 + 待处理申请 + 关注/粉丝",
    "- POST /api/friends/request { name } / accept / ignore / remove",
    "- GET  /api/users/:name                                用户主页（含 relation / counts / works）",
    "",
    "## 创作",
    "- GET  /api/my/works / POST /api/my/works（三张展示图必填）/ DELETE /api/my/works/:id",
    "- GET  /api/my/draft / PUT /api/my/draft",
    "- POST /api/upload { dataUrl } → { url }  图片上传（≤1MB，校验真实格式）",
    "",
    "## 内容 JSON 规范（创作中心导入用）",
    "- thumb 建议 200×200（我的作品列表）",
    "- cover 建议 640×360（首页卡片）",
    "- hero 建议 1280×720（教程详情页大图）",
    "- chapters[].blocks[].t ∈ p / h2 / tip / ul / code / img / audio",
    "- tip 块可选 color：green / blue / amber / gray（不写则跟随站点主题色）"
  ].join("\n");
  return send(ctx.res, 200, md);
}

module.exports = {
  base: {
    meta, requestCode, verifyCode, logout, register, passwordLogin, setPw, me, applyTeacher, withdrawApply, updateProfile, announcements,
    follow, unfollow, friendList, friendRequest, friendAccept, friendIgnore, friendRemove
  },
  content: {
    listTutorials, tutorialDetail, viewTutorial, readChapter, favToggle, myFavs,
    userProfile, myWorks, publishWork, deleteWork, getDraft, putDraft, uploadImage, apiDocs
  },
  helpers: { send, fail, ok, parseCookies, loadSession, publicUser, countsOf, relationOf, setCookie }
};
