/* 喵站 · BYOX 30 门课的封面（纯代码画 SVG，不引外部图、不依赖网络）
 *
 * 为什么单独一个脚本：byox-gen.js 的自检要求 site.js 必须登记那 30 门课，
 * 而这批课现在被摘出站点（等正文填好再登记），两者会打架。封面只取决于
 * tools/byox-index.json 里的类目与篇数，所以单独出，谁也不影响谁。
 *
 * 跑法：node dev/tools/byox-covers.js
 */
const fs = require("fs");
const path = require("path");

const DEV = path.resolve(__dirname, "..");
const IDX = path.join(DEV, "tools", "byox-index.json");
const OUT = path.join(DEV, "frontend", "assets", "img", "covers");

const TINTS = ["#c0563a", "#1b7f79", "#6a4c93", "#2f6f8f", "#b8860b", "#3f7d4e", "#8e4a68", "#46627f"];
const esc = function (t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); };

function cover(meta, n, idx) {
  const tint = TINTS[idx % TINTS.length];
  const cols = 8, rows = Math.min(4, Math.max(1, Math.ceil(n / cols)));
  let cells = "";
  for (let k = 0; k < rows * cols; k++) {
    const on = k < n;
    const x = 46 + (k % cols) * 34, y = 168 + Math.floor(k / cols) * 34;
    cells += '<rect x="' + x + '" y="' + y + '" width="26" height="26" rx="6" fill="' + tint +
      '" fill-opacity="' + (on ? (0.3 + (k % 4) * 0.18).toFixed(2) : "0.06") + '"/>';
  }
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">'
    + '<rect width="640" height="360" fill="#fffaf3"/><rect width="640" height="8" fill="' + tint + '"/>'
    + '<text x="46" y="82" font-size="31" font-weight="700" fill="#2b2118" font-family="Noto Sans CJK SC,sans-serif">' + esc(meta.title) + '</text>'
    + '<text x="46" y="114" font-size="15" fill="#7a6a5c" font-family="monospace">build-your-own-x · ' + esc(meta.src) + ' · ' + n + ' 篇</text>'
    + cells + "</svg>";
}

function main() {
  if (!fs.existsSync(IDX)) { console.error("没有 " + IDX + "，先跑 node dev/tools/byox-gen.js"); process.exit(1); }
  const idx = JSON.parse(fs.readFileSync(IDX, "utf8"));
  /* 索引顶层是 { generatedBy, totals, distribution, ... }，类目数组挂在 categories 下 */
  const cats = idx.categories || idx.cats || Object.keys(idx).map(function (k) { return idx[k]; })
    .filter(function (v) { return Array.isArray(v) && v.length && v[0] && v[0].tutorialId; })[0] || [];
  if (!cats.length) { console.error("索引里没有类目（结构变了？顶层键：" + Object.keys(idx).join(",") + "）"); process.exit(1); }
  fs.mkdirSync(OUT, { recursive: true });
  let n2 = 0;
  cats.forEach(function (c, i) {
    /* 索引里的真实键名：{ name, tutorialId, count, lessons } —— 没有 abbr，
       第一版拿 c.abbr 取到 undefined，30 张全写进了同一个 byox-undefined.svg */
    const abbr = c.tutorialId || c.abbr || c.id;
    const n = (c.count != null ? c.count : (c.lessons || []).length);
    const meta = { title: c.title || ("从零造 " + c.name), src: c.name || abbr };
    if (!abbr) { console.error("第 " + i + " 个类目没有 tutorialId，跳过"); return; }
    fs.writeFileSync(path.join(OUT, "byox-" + abbr + ".svg"), cover(meta, n, i));
    n2++;
  });
  console.log("写出", n2, "张封面 → assets/img/covers/byox-*.svg");
}
main();
