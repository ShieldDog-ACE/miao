/**
 * 喵站 · 零依赖静态服务器
 *
 * 站点没有后端了，但「用 file:// 直接双击打开」这条路在浏览器里会被同源策略卡住
 * （fetch/localStorage 行为也不一致），所以本地预览与测试都要走 HTTP。
 * 这个脚本就是那台「只会发文件」的小服务器：
 *   node dev/tests/static-server.js            # 预览，默认 127.0.0.1:8811
 *   node dev/tests/static-server.js 8080       # 指个端口
 * 测试里则用 require("./static-server.js").start(port) 自起自停。
 * 它只读 dev/frontend 底下的文件，不认识任何 /api —— 有请求打到 /api 就是站点出问题。
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "frontend");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8"
};

function resolveSafe(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  const rel = path.normalize(clean).replace(/^(\.\.[/\\])+/, "").replace(/^[/\\]+/, "");
  const file = path.join(ROOT, rel || "index.html");
  /* 目录穿越一律夹回根目录里 */
  if (!file.startsWith(ROOT)) return null;
  return file;
}

function handler(req, res) {
  let file = resolveSafe(req.url || "/");
  if (!file) { res.writeHead(400).end("bad path"); return; }
  try {
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 " + (req.url || ""));
      return;
    }
    const body = fs.readFileSync(file);
    res.writeHead(200, {
      "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    });
    res.end(body);
  } catch (e) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("500 " + e.message);
  }
}

function start(port, onReq) {
  return new Promise((resolve, reject) => {
    const srv = http.createServer((req, res) => {
      /* 记一笔请求：按需加载那套断言（「首屏到底拉了哪几个文件」）全靠这条口子 */
      if (typeof onReq === "function") { try { onReq(req.url || "/"); } catch (e) { /* 记账不许影响发文件 */ } }
      handler(req, res);
    });
    srv.on("error", reject);
    srv.listen(port, "127.0.0.1", () => resolve({
      url: "http://127.0.0.1:" + port + "/",
      close: () => new Promise((r) => srv.close(r))
    }));
  });
}

module.exports = { start, ROOT };

if (require.main === module) {
  const port = Number(process.argv[2] || 8811);
  start(port).then((s) => console.log("喵站静态预览：" + s.url + "（Ctrl+C 退出）"))
    .catch((e) => { console.error("起不来：" + e.message); process.exit(1); });
}
