/**
 * 喵站前端 · 后端对接层
 * - 统一走同源 /api（部署时前后端同域，或由反向代理转发）
 * - 写操作自动附带 X-Miao-Nonce + X-Miao-Sign（HMAC-SHA256，密钥取自 Cookie miao_ck）
 * - 自带纯 JS 的 SHA-256/HMAC 实现：不依赖 https 环境下的 WebCrypto，普通 http 也能签名
 */
(function () {
  "use strict";

  /* ---------------- 纯 JS SHA-256 / HMAC-SHA256 ---------------- */
  var K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  function rotr(x, n) { return (x >>> n) | (x << (32 - n)); }
  function utf8Bytes(str) {
    var out = [], i, c, c2, cp;
    for (i = 0; i < str.length; i++) {
      c = str.charCodeAt(i);
      if (c < 0x80) out.push(c);
      else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
      else if (c >= 0xd800 && c < 0xdc00 && i + 1 < str.length) {
        c2 = str.charCodeAt(++i);
        cp = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        out.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 63), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
      } else {
        out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
      }
    }
    return out;
  }
  function sha256Bytes(bytes) {
    var H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    var bitLen = bytes.length * 8;
    var data = bytes.slice();
    data.push(0x80);
    while (data.length % 64 !== 56) data.push(0);
    var hi = Math.floor(bitLen / 4294967296), lo = bitLen >>> 0;
    data.push((hi >>> 24) & 255, (hi >>> 16) & 255, (hi >>> 8) & 255, hi & 255,
      (lo >>> 24) & 255, (lo >>> 16) & 255, (lo >>> 8) & 255, lo & 255);

    var w = new Array(64), i, off;
    for (off = 0; off < data.length; off += 64) {
      for (i = 0; i < 16; i++) {
        w[i] = (data[off + i * 4] << 24) | (data[off + i * 4 + 1] << 16) |
          (data[off + i * 4 + 2] << 8) | data[off + i * 4 + 3];
      }
      for (i = 16; i < 64; i++) {
        var s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        var s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (i = 0; i < 64; i++) {
        var S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
        var ch = (e & f) ^ (~e & g);
        var t1 = (h + S1 + ch + K[i] + w[i]) | 0;
        var S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var t2 = (S0 + maj) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    var out = [];
    for (i = 0; i < 8; i++) {
      out.push((H[i] >>> 24) & 255, (H[i] >>> 16) & 255, (H[i] >>> 8) & 255, H[i] & 255);
    }
    return out;
  }
  function toHex(bytes) {
    var s = "";
    for (var i = 0; i < bytes.length; i++) s += ("0" + bytes[i].toString(16)).slice(-2);
    return s;
  }
  function sha256Hex(str) { return toHex(sha256Bytes(utf8Bytes(str))); }
  function hmacHex(key, msg) {
    var block = utf8Bytes(key), i;
    if (block.length > 64) block = sha256Bytes(block);
    while (block.length < 64) block.push(0);
    var o = [], n = [];
    for (i = 0; i < 64; i++) { o.push(block[i] ^ 0x5c); n.push(block[i] ^ 0x36); }
    return toHex(sha256Bytes(o.concat(sha256Bytes(n.concat(utf8Bytes(msg))))));
  }

  /* ---------------- Cookie ---------------- */
  function cookie(name) {
    var m = new RegExp("(?:^|;\\s*)" + name + "=([^;]*)").exec(document.cookie || "");
    return m ? decodeURIComponent(m[1]) : "";
  }

  /* ---------------- 请求 ---------------- */
  var BASE = "";                       // 同源部署留空；跨域时改成后端地址
  function req(method, path, body) {
    method = (method || "GET").toUpperCase();
    var text = body == null ? "" : JSON.stringify(body);
    var headers = { "Accept": "application/json" };
    if (text) headers["Content-Type"] = "application/json";
    var isWrite = method !== "GET" && method !== "HEAD";
    if (isWrite) {
      var key = cookie("miao_ck");
      if (key) {
        var nonce = Date.now() + "." + Math.random().toString(16).slice(2, 10);
        headers["X-Miao-Nonce"] = nonce;
        headers["X-Miao-Sign"] = hmacHex(key, method + "\n" + path + "\n" + text + "\n" + nonce);
      }
    }
    return fetch(BASE + path, {
      method: method, headers: headers, body: text || undefined, credentials: "same-origin"
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok) {
          var err = new Error((data && data.error) || ("请求失败 " + res.status));
          err.status = res.status;
          err.data = data;
          throw err;
        }
        return data;
      });
    });
  }

  window.MIAO_API = {
    base: BASE,
    get: function (p) { return req("GET", p); },
    post: function (p, b) { return req("POST", p, b); },
    put: function (p, b) { return req("PUT", p, b); },
    del: function (p, b) { return req("DELETE", p, b); },
    /* 加密工具（供联调/自检使用） */
    _crypto: { sha256Hex: sha256Hex, hmacHex: hmacHex }
  };
})();
