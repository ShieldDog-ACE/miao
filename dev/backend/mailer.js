/**
 * 喵站后端 · 邮件发送（零依赖手写 SMTP）
 * - 真实发信凭据只从环境变量 / .env 读取：SMTP_USER + SMTP_PASS（授权码），两者齐备即自动启用
 * - 未配置时走「开发传输」：验证码打到控制台并写入 data/mail-outbox.log，方便先跑通流程
 * - 支持 465（隐式 TLS，secure:true）与 587/25（STARTTLS）
 */
const net = require("net");
const tls = require("tls");
const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const { load } = require("./config");

const cfg = load();
const OUTBOX = path.join(cfg.dataDir, "mail-outbox.log");

function b64(s) { return Buffer.from(String(s), "utf8").toString("base64"); }
function encodeHeader(s) {
  return /^[\x20-\x7e]*$/.test(s) ? s : "=?UTF-8?B?" + b64(s) + "?=";
}

/* ---------------- 极简 SMTP 客户端 ---------------- */
function smtpSend({ to, subject, text, html }) {
  const m = cfg.mail;
  return new Promise((resolve, reject) => {
    let socket, buf = "", finished = false;
    let waiters = [];
    const log = [];

    function done(err) {
      if (finished) return;
      finished = true;
      if (socket) { try { socket.destroy(); } catch (e) { /* ignore */ } }
      err ? reject(err) : resolve({ ok: true, log });
    }
    function onResponse(code, lines) {
      log.push(code + " " + lines.join(" | ").slice(0, 120));
      const w = waiters.shift();
      if (w) w(code, lines);
    }
    function feed(chunk) {
      buf += chunk.toString("utf8");
      let idx, code = null, lines = [];
      while ((idx = buf.indexOf("\r\n")) >= 0) {
        const line = buf.slice(0, idx);
        buf = buf.slice(idx + 2);
        if (/^\d{3} /.test(line)) {
          lines.push(line);
          onResponse(line.slice(0, 3), lines);
          lines = [];
        } else if (/^\d{3}-/.test(line)) {
          if (code === null) code = line.slice(0, 3);
          lines.push(line);
        } else {
          lines.push(line);
        }
      }
    }
    function wait() { return new Promise((res) => waiters.push(res)); }
    function send(line) { socket.write(line + "\r\n"); }
    function expect(okCodes, what) {
      return wait().then((code) => {
        if (!okCodes.includes(code)) throw new Error(what + " 失败：SMTP 返回 " + code);
        return code;
      });
    }
    function upgrade() {
      return new Promise((res, rej) => {
        const t = tls.connect({ socket, servername: m.host }, () => { socket = t; res(); });
        t.on("data", feed);
        t.on("error", rej);
      });
    }

    const messageId = "<" + crypto.randomBytes(12).toString("hex") + "@" + (m.host || "miao") + ">";
    const headers = [
      "From: " + (m.from || m.user),
      "To: " + to,
      "Subject: " + encodeHeader(subject),
      "Message-ID: " + messageId,
      "Date: " + new Date().toUTCString(),
      "MIME-Version: 1.0",
      "Content-Type: " + (html ? "text/html" : "text/plain") + "; charset=utf-8",
      "Content-Transfer-Encoding: base64"
    ];
    const bodyB64 = b64(html || text || "").replace(/(.{76})/g, "$1\r\n");

    const connectOpts = { host: m.host, port: m.port };
    socket = m.secure
      ? tls.connect(Object.assign({ servername: m.host }, connectOpts), onConnect)
      : net.connect(connectOpts, onConnect);
    socket.setTimeout(15000, () => done(new Error("SMTP 连接超时")));
    socket.on("data", feed);
    socket.on("error", (e) => done(new Error("SMTP 连接错误：" + e.message)));

    function onConnect() {
      Promise.resolve()
        .then(() => expect(["220"], "握手"))
        .then(() => send("EHLO " + (os.hostname() || "miao.local")))
        .then(() => wait())
        .then((code, lines) => {
          const caps = (lines || []).join(" ").toUpperCase();
          if (!m.secure && /STARTTLS/.test(caps)) {
            send("STARTTLS");
            return expect(["220"], "STARTTLS").then(upgrade)
              .then(() => send("EHLO " + (os.hostname() || "miao.local")))
              .then(() => wait());
          }
          return null;
        })
        .then(() => { send("AUTH LOGIN"); return expect(["334"], "AUTH"); })
        .then(() => { send(b64(m.user)); return expect(["334"], "用户名"); })
        .then(() => { send(b64(m.pass)); return expect(["235"], "密码/授权码"); })
        .then(() => { send("MAIL FROM:<" + (m.user) + ">"); return expect(["250"], "MAIL FROM"); })
        .then(() => { send("RCPT TO:<" + to + ">"); return expect(["250", "251"], "RCPT TO"); })
        .then(() => { send("DATA"); return expect(["354"], "DATA"); })
        .then(() => {
          socket.write(headers.join("\r\n") + "\r\n\r\n" + bodyB64 + "\r\n.\r\n");
          return expect(["250"], "发送正文");
        })
        .then(() => { send("QUIT"); })
        .then(() => done(null))
        .catch((e) => done(e));
    }
  });
}

/* ---------------- 开发传输（未配置邮箱时） ---------------- */
function devSend({ to, subject, text }) {
  const line = "[" + new Date().toISOString() + "] → " + to + " | " + subject + "\n" + text + "\n" + "-".repeat(60) + "\n";
  try { fs.appendFileSync(OUTBOX, line, "utf8"); } catch (e) { /* ignore */ }
  console.log("\n===== 喵站邮件（开发模式，未配置 SMTP） =====");
  console.log("收件人：" + to + "\n主题：" + subject + "\n\n" + text);
  console.log("（已同时写入 " + OUTBOX + "）\n===========================================\n");
  return Promise.resolve({ ok: true, dev: true });
}

/* ---------------- 对外接口 ---------------- */
function mailReady() {
  return !!(cfg.mail.enabled && cfg.mail.host && cfg.mail.user && cfg.mail.pass);
}
function sendMail(msg) {
  return mailReady() ? smtpSend(msg) : devSend(msg);
}
/* 登录验证码邮件 */
function sendLoginCode(to, code, minutes) {
  const subject = "【喵站】登录验证码 " + code;
  const text = [
    "你的喵站登录验证码是：" + code,
    "",
    "有效期 " + minutes + " 分钟，请勿转发给他人。",
    "如果这不是你本人的操作，忽略本邮件即可。",
    "",
    "—— 喵站"
  ].join("\n");
  const html = '<div style="font-family:system-ui,-apple-system,\'PingFang SC\',sans-serif;max-width:520px">' +
    '<h2 style="margin:0 0 8px">喵站登录验证码</h2>' +
    '<p style="color:#666;margin:0 0 18px">请在登录页面输入下面的验证码</p>' +
    '<div style="font-size:32px;font-weight:800;letter-spacing:6px;color:#e8507f;background:#fff0f5;padding:14px 18px;border-radius:12px;text-align:center">' + code + "</div>" +
    '<p style="color:#999;font-size:13px;margin-top:18px">有效期 ' + minutes + " 分钟；请勿转发给他人。<br>如果这不是你本人的操作，忽略本邮件即可。</p></div>";
  return sendMail({ to: to, subject: subject, text: text, html: html });
}

module.exports = { sendMail, sendLoginCode, mailReady, OUTBOX };
