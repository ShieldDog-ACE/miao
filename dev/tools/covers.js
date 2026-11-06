/* 喵站 · 课程封面生成器（一张课 = 一份 spec + 一个标志函数，全部由代码画）
 *
 * 为什么收成一个脚本：
 *   封面原来有三个出处 —— ms-gen.js 里那段「米白底 + 8px 色带 + 按篇数点亮的方块」
 *   模板被 4 张微软课和 30 张 BYOX 课共用（37 张里 34 张是同一张脸），
 *   python/english/enwords 三张则是手写进仓库、没有任何工具拥有它们。
 *   上一轮「重跑生成器把手改的封面冲掉」（任务书 D-40）就是这么来的。收在这里之后
 *   封面只有这一个出处。
 *
 * 版式（2026-10-10 他当面定的）：标志摆在整个版面正中的上方，标题与说明在下面居中，
 *   不许出现「图偏在左上、字在右下、两者对不上中线」那种歪法。
 *
 * 15 门分类课（go/c/ts/github/c#/java/ide/rust/linux/math/embedded/algorithms/asm/basics/js）
 * 2026-10-29 统一重画：每门一张专属标志。Go/GitHub/Rust 直接嵌官方图形，Java 用咖啡杯，
 * C/C# 用同一只立方体（C++ 那只去掉 ++），TS/JS 各自独立。标题与说明的槽位不变。
 *
 * 硬约束（写完就跑 --check，不达标退出码 1，且 helper 在画图当场就抛错）：
 *   1) 每张自带不透明牌底：封面在卡片上是 full-bleed，站内三套配色都往它身上压。
 *   2) 安全区 44~596 × 34~326：卡片 hover 时封面要放大 1.06 倍（.t-card:hover
 *      .cover-img），左右各被裁掉约 20px，圆角还会啃掉四角 —— 贴边画的东西必被切掉，
 *      这就是他说的「有些甚至在屏幕外面」。所以每个画图函数都先算包围盒，越界直接抛。
 *   3) 文字宽度按「中文 1em、拉丁 0.56em、数字 0.62em、空格 0.3em」估，超界就抛。
 *   4) 色对分不开就抛：文字级 4.5:1；图形级允许「高饱和对中性底」这条路
 *      （官方黄 #ffd43b 在白底上亮度只有 1.33:1，但 python.org 自己就这么摆）。
 *
 * 跑法：
 *   node dev/tools/covers.js                生成全部在册课程封面（先验后写）
 *   node dev/tools/covers.js --check        只校验不写盘
 *   node dev/tools/covers.js --audit        体检磁盘上所有 svg（含还没接进来的 byox-*）
 *   node dev/tools/covers.js --only webdev  只出一门
 */
const fs = require("fs");
const path = require("path");

const DEV = path.resolve(__dirname, "..");
const OUT = path.join(DEV, "frontend", "assets", "img", "covers");
const W = 640, H = 360;
const SAFE = { x0: 44, y0: 34, x1: 596, y1: 326 };

/* ---------------- 小工具（每一个都自带越界与色值检查） ---------------- */
const esc = t => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const n = v => Math.round(v * 100) / 100;

function parse(c) {
  const s = String(c).trim();
  if (s[0] === "#") {
    let h = s.slice(1);
    if (h.length === 3) h = h.split("").map(x => x + x).join("");
    if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error("色值不是 6 位十六进制（牌底必须不透明）: " + c);
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  throw new Error("封面里只准写 #rrggbb，不接受 rgb()/rgba()/颜色名: " + c);
}
function lum(c) {
  const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const [r, g, b] = parse(c);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
const CR = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
function chroma(c) { const [r, g, b] = parse(c).map(v => v / 255); return Math.max(r, g, b) - Math.min(r, g, b); }
function separable(fg, bg) {
  const cr = CR(fg, bg);
  if (cr >= 3) return true;
  return chroma(fg) >= 0.4 && chroma(bg) <= 0.15 && cr >= 1.2;
}
function textW(s, size, mono) {
  let w = 0;
  for (const ch of String(s)) {
    if (/[\u2E80-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF]/.test(ch)) w += 1;
    else if (ch === " ") w += 0.3;
    else if (/[0-9]/.test(ch)) w += 0.62;
    else if (mono) w += 0.6;
    else w += 0.56;
  }
  return w * size;
}
/* 画图时逐件登记的包围盒。中心度与越界都以这份为准 —— 事后拿正则回读 SVG 会漏掉
   <g transform> 里面的坐标（官方蛇形 path 就是），量出来的包围盒直接差一个缩放倍数。 */
let EMIT = [];
function box(tag, x0, y0, x1, y1) {
  EMIT.push({ tag, x0, y0, x1, y1 });
  if (x0 < SAFE.x0 - 0.05 || y0 < SAFE.y0 - 0.05 || x1 > SAFE.x1 + 0.05 || y1 > SAFE.y1 + 0.05)
    throw new Error(`${tag} 出安全区：${n(x0)}~${n(x1)} × ${n(y0)}~${n(y1)}，允许 ${SAFE.x0}~${SAFE.x1} × ${SAFE.y0}~${SAFE.y1}`);
}
const plate = fill => `<rect width="${W}" height="${H}" fill="${fill}"/>`;
function rr(x, y, w, h, r, fill, o) {
  parse(fill); box("矩形" + ((o && o.tag) || ""), x, y, x + w, y + h);
  let s = `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${n(r)}" fill="${fill}"`;
  if (o && o.stroke) s += ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"`;
  if (o && o.op) s += ` fill-opacity="${o.op}"`;
  return s + "/>";
}
function circ(cx, cy, r, fill, o) {
  parse(fill); box("圆" + ((o && o.tag) || ""), cx - r, cy - r, cx + r, cy + r);
  let s = `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="${fill}"`;
  if (o && o.stroke) s += ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"`;
  if (o && o.hollow) s = `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="none" stroke="${o.stroke}" stroke-width="${o.sw || 4}"`;
  return s + (o && o.op ? ` fill-opacity="${o.op}"` : "") + "/>";
}
function tri(cx, cy, r, rot, fill, o) {
  parse(fill);
  const pts = [0, 1, 2].map(k => {
    const a = (rot + k * 120) * Math.PI / 180;
    return `${n(cx + r * Math.cos(a))},${n(cy + r * Math.sin(a))}`;
  }).join(" ");
  box("三角" + ((o && o.tag) || ""), cx - r, cy - r, cx + r, cy + r);
  return `<polygon points="${pts}" fill="${fill}"/>`;
}
function lines(d, o) {
  parse(o.stroke);
  const sw = o.width || 2;
  const b = dBox(d);
  if (!b) throw new Error("lines() 的 d 里一个坐标都没有: " + d);
  box("线组" + ((o && o.tag) || ""), b.minx - sw / 2, b.miny - sw / 2, b.maxx + sw / 2, b.maxy + sw / 2);
  return `<path d="${d}" fill="none" stroke="${o.stroke}" stroke-width="${sw}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""} stroke-linecap="round"/>`;
}
function txt(x, y, s, o) {
  parse(o.fill);
  const w = textW(s, o.size, !!o.mono);
  const ls = o.ls ? textW(s, o.ls, !!o.mono) : 0;
  const total = w + ls;
  const x0 = o.anchor === "end" ? x - total : o.anchor === "middle" ? x - total / 2 : x;
  const x1 = o.anchor === "end" ? x : o.anchor === "middle" ? x + total / 2 : x + total;
  box(`文字「${s}」`, x0, y - o.size * 0.8, x1, y + o.size * 0.26);
  const fam = o.mono
    ? "'JetBrains Mono','DejaVu Sans Mono','SFMono-Regular',Consolas,monospace"
    : "'Noto Sans CJK SC','DejaVu Sans','PingFang SC','HarmonyOS Sans SC','Microsoft YaHei',sans-serif";
  return `<text x="${n(x)}" y="${n(y)}" font-size="${o.size}" font-weight="${o.weight || 400}" fill="${o.fill}"` +
    ` font-family="${fam}"${o.anchor ? ` text-anchor="${o.anchor}"` : ""}${o.ls ? ` letter-spacing="${o.ls}"` : ""}>${esc(s)}</text>`;
}
const SANS = "'Noto Sans CJK SC','DejaVu Sans','PingFang SC','Microsoft YaHei',sans-serif";

/* 插画标志共用的一小组材料。15 门分类课不再各画各的：同样的线宽、同样的圆角、
   同样的中性蓝灰，底色只在课程本色 tint 上做深浅两档，摆在一起才像一套。 */
const NEUTRAL = "#c3d2e4";
const NEUTRAL_D = "#9fb3d0";
function mix(a, b, t) {
  const A = parse(a), B = parse(b);
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join("");
}
const soft = (c, k = 0.24) => mix(c, "#ffffff", 1 - k);
const readableOn = bg => (CR("#ffffff", bg) >= CR("#111827", bg) ? "#ffffff" : "#111827");
function arrow(x1, y1, x2, y2, o) {
  const w = o.width || 4, r = o.head || Math.max(9, w * 2);
  const a = Math.atan2(y2 - y1, x2 - x1);
  return lines(`M${n(x1)} ${n(y1)}L${n(x2 - r * Math.cos(a) * 0.82)} ${n(y2 - r * Math.sin(a) * 0.82)}`,
    { stroke: o.stroke, width: w, tag: o.tag }) +
    tri(x2 - r * Math.cos(a), y2 - r * Math.sin(a), r, a * 180 / Math.PI, o.stroke, { tag: o.tag });
}
function shape(d, fill, tag) {
  parse(fill);
  const b = dBox(d);
  if (!b) throw new Error("shape() 的 d 里没有坐标: " + d);
  box(tag, b.minx, b.miny, b.maxx, b.maxy);
  return `<path d="${d}" fill="${fill}"/>`;
}
/* 字形轮廓按墨迹框归一化后，中心点直接给足 —— 不依赖 text-anchor 的字体度量，
   换浏览器/换回退字体都不会偏。 */
function glyph(g, cx, cy, height, fill, tag) {
  const s = height / g.h, w = g.w * s;
  box(tag, cx - w / 2, cy - height / 2, cx + w / 2, cy + height / 2);
  return `<g transform="translate(${n(cx - w / 2)},${n(cy - height / 2)}) scale(${n(s)})"><path d="${g.d}" fill="${fill}"/></g>`;
}

/* 官方图形：原样嵌入，只改缩放与填充色。
   GitHub 的 Octocat 取自 Simple Icons 的 github 图标（品牌官方路径）；
   Rust 的齿轮标志取自 rust-lang.org/static/images/rust-logo-blk.svg；
   Go 的 Gopher 取自 go.dev/images/favicon-gopher.svg（Renée French，CC BY 3.0）。 */
const GITHUB_MARK = "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12";
const RUST_MARK = [
  "m71.05 23.68c-26.06 0-47.27 21.22-47.27 47.27s21.22 47.27 47.27 47.27 47.27-21.22 47.27-47.27-21.22-47.27-47.27-47.27zm-.07 4.2a3.1 3.11 0 0 1 3.02 3.11 3.11 3.11 0 0 1 -6.22 0 3.11 3.11 0 0 1 3.2-3.11zm7.12 5.12a38.27 38.27 0 0 1 26.2 18.66l-3.67 8.28c-.63 1.43.02 3.11 1.44 3.75l7.06 3.13a38.27 38.27 0 0 1 .08 6.64h-3.93c-.39 0-.55.26-.55.64v1.8c0 4.24-2.39 5.17-4.49 5.4-2 .23-4.21-.84-4.49-2.06-1.18-6.63-3.14-8.04-6.24-10.49 3.85-2.44 7.85-6.05 7.85-10.87 0-5.21-3.57-8.49-6-10.1-3.42-2.25-7.2-2.7-8.22-2.7h-40.6a38.27 38.27 0 0 1 21.41-12.08l4.79 5.02c1.08 1.13 2.87 1.18 4 .09zm-44.2 23.02a3.11 3.11 0 0 1 3.02 3.11 3.11 3.11 0 0 1 -6.22 0 3.11 3.11 0 0 1 3.2-3.11zm74.15.14a3.11 3.11 0 0 1 3.02 3.11 3.11 3.11 0 0 1 -6.22 0 3.11 3.11 0 0 1 3.2-3.11zm-68.29.5h5.42v24.44h-10.94a38.27 38.27 0 0 1 -1.24-14.61l6.7-2.98c1.43-.64 2.08-2.31 1.44-3.74zm22.62.26h12.91c.67 0 4.71.77 4.71 3.8 0 2.51-3.1 3.41-5.65 3.41h-11.98zm0 17.56h9.89c.9 0 4.83.26 6.08 5.28.39 1.54 1.26 6.56 1.85 8.17.59 1.8 2.98 5.4 5.53 5.4h16.14a38.27 38.27 0 0 1 -3.54 4.1l-6.57-1.41c-1.53-.33-3.04.65-3.37 2.18l-1.56 7.28a38.27 38.27 0 0 1 -31.91-.15l-1.56-7.28c-.33-1.53-1.83-2.51-3.36-2.18l-6.43 1.38a38.27 38.27 0 0 1 -3.32-3.92h31.27c.35 0 .59-.06.59-.39v-11.06c0-.32-.24-.39-.59-.39h-9.15zm-14.43 25.33a3.11 3.11 0 0 1 3.02 3.11 3.11 3.11 0 0 1 -6.22 0 3.11 3.11 0 0 1 3.2-3.11zm46.05.14a3.11 3.11 0 0 1 3.02 3.11 3.11 3.11 0 0 1 -6.22 0 3.11 3.11 0 0 1 3.2-3.11z",
  "m115.68 70.95a44.63 44.63 0 0 1 -44.63 44.63 44.63 44.63 0 0 1 -44.63-44.63 44.63 44.63 0 0 1 44.63-44.63 44.63 44.63 0 0 1 44.63 44.63zm-.84-4.31 6.96 4.31-6.96 4.31 5.98 5.59-7.66 2.87 4.78 6.65-8.09 1.32 3.4 7.46-8.19-.29 1.88 7.98-7.98-1.88.29 8.19-7.46-3.4-1.32 8.09-6.65-4.78-2.87 7.66-5.59-5.98-4.31 6.96-4.31-6.96-5.59 5.98-2.87-7.66-6.65 4.78-1.32-8.09-7.46 3.4.29-8.19-7.98 1.88 1.88-7.98-8.19.29 3.4-7.46-8.09-1.32 4.78-6.65-7.66-2.87 5.98-5.59-6.96-4.31 6.96-4.31-5.98-5.59 7.66-2.87-4.78-6.65 8.09-1.32-3.4-7.46 8.19.29-1.88-7.98 7.98 1.88-.29-8.19 7.46 3.4 1.32-8.09 6.65 4.78 2.87-7.66 5.59 5.98 4.31-6.96 4.31 6.96 5.59-5.98 2.87 7.66 6.65-4.78 1.32 8.09 7.46-3.4-.29 8.19 7.98-1.88-1.88 7.98 8.19-.29-3.4 7.46 8.09 1.32-4.78 6.65 7.66 2.87z",
];
/* C 系字母轮廓取自 Noto Sans CJK SC Bold（SIL OFL 1.1），按墨迹框归一化；
   Java 咖啡杯 logo 取自 Devicon 的 java-original.svg（Oracle Java 商标图形）。 */
const JS_LETTERS = `
<path d="m22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067z"/>
<path d="M13.051 11.031h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/>
`;

const GLYPH_C = { w: 575.0, h: 768.0, d: "M338.000 0.000C435.000 0.000 514.000 38.000 575.000 109.000L496.000 201.000C457.000 158.000 408.000 128.000 344.000 128.000C227.000 128.000 152.000 225.000 152.000 386.000C152.000 545.000 235.000 641.000 347.000 641.000C403.000 641.000 446.000 615.000 484.000 579.000L561.000 673.000C513.000 723.000 439.000 768.000 344.000 768.000C157.000 768.000 0.000 625.000 0.000 381.000C0.000 134.000 152.000 0.000 338.000 0.000Z" };
const GLYPH_PP = { w: 1102.0, h: 530.0, d: "M201.000 0.000L310.000 0.000L310.000 212.000L512.000 212.000L512.000 317.000L310.000 317.000L310.000 530.000L201.000 530.000L201.000 317.000L0.000 317.000L0.000 212.000L201.000 212.000ZM791.000 0.000L900.000 0.000L900.000 212.000L1102.000 212.000L1102.000 317.000L900.000 317.000L900.000 530.000L791.000 530.000L791.000 317.000L590.000 317.000L590.000 212.000L791.000 212.000Z" };
const GLYPH_CS = { w: 1158.0, h: 768.0, d: "M338.000 0.000C435.000 0.000 514.000 38.000 575.000 109.000L496.000 201.000C457.000 158.000 408.000 128.000 344.000 128.000C227.000 128.000 152.000 225.000 152.000 386.000C152.000 545.000 235.000 641.000 347.000 641.000C403.000 641.000 446.000 615.000 484.000 579.000L561.000 673.000C513.000 723.000 439.000 768.000 344.000 768.000C157.000 768.000 0.000 625.000 0.000 381.000C0.000 134.000 152.000 0.000 338.000 0.000ZM701.000 14.000L788.000 14.000L814.000 231.000L940.000 231.000L914.000 14.000L1002.000 14.000L1027.000 231.000L1135.000 231.000L1135.000 327.000L1039.000 327.000L1056.000 464.000L1158.000 464.000L1158.000 559.000L1068.000 559.000L1091.000 752.000L1005.000 752.000L980.000 559.000L854.000 559.000L877.000 752.000L791.000 752.000L767.000 559.000L664.000 559.000L664.000 464.000L755.000 464.000L738.000 327.000L641.000 327.000L641.000 231.000L727.000 231.000ZM825.000 327.000L842.000 464.000L968.000 464.000L951.000 327.000Z" };
const JAVA_LOGO = `
<path fill="#0074BD" d="M47.617 98.12s-4.767 2.774 3.397 3.71c9.892 1.13 14.947.968 25.845-1.092 0 0 2.871 1.795 6.873 3.351-24.439 10.47-55.308-.607-36.115-5.969zm-2.988-13.665s-5.348 3.959 2.823 4.805c10.567 1.091 18.91 1.18 33.354-1.6 0 0 1.993 2.025 5.132 3.131-29.542 8.64-62.446.68-41.309-6.336z"/><path fill="#EA2D2E" d="M69.802 61.271c6.025 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.792 15.635-29.58 0 .001-42.731 10.67-22.324 34.187z"/><path fill="#0074BD" d="M102.123 108.229s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.094.171-4.451-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.953-3.487-32.013 6.85-13.743 9.815 49.821 8.076 90.817-3.637 77.896-9.468zM49.912 70.294s-22.686 5.389-8.033 7.348c6.188.828 18.518.638 30.011-.326 9.39-.789 18.813-2.474 18.813-2.474s-3.308 1.419-5.704 3.053c-23.042 6.061-67.544 3.238-54.731-2.958 10.832-5.239 19.644-4.643 19.644-4.643zm40.697 22.747c23.421-12.167 12.591-23.86 5.032-22.285-1.848.385-2.677.72-2.677.72s.688-1.079 2-1.543c14.953-5.255 26.451 15.503-4.823 23.725 0-.002.359-.327.468-.617z"/><path fill="#EA2D2E" d="M76.491 1.587S89.459 14.563 64.188 34.51c-20.266 16.006-4.621 25.13-.007 35.559-11.831-10.673-20.509-20.07-14.688-28.815C58.041 28.42 81.722 22.195 76.491 1.587z"/><path fill="#0074BD" d="M52.214 126.021c22.476 1.437 57-.8 57.817-11.436 0 0-1.571 4.032-18.577 7.231-19.186 3.612-42.854 3.191-56.887.874 0 .001 2.875 2.381 17.647 3.331z"/>
`;

const GOPHER_SVG = `
<path d="m 16.091693,1021.3642 c -1.105749,0.01 -2.210341,0.049 -3.31609,0.09 C 6.8422558,1021.6738 2,1026.3942 2,1032.3622 c 0,2.9786 0,13 0,20 l 28,0 c 0,-8 0,-16 0,-20 0,-5.9683 -4.667345,-10.4912 -10.59023,-10.908 -1.10575,-0.078 -2.212328,-0.099 -3.318077,-0.09 z" fill="#384e54"/>
<path d="m 4.6078867,1025.0462 c 0.459564,0.2595 1.818262,1.2013 1.980983,1.648 0.183401,0.5035 0.159385,1.0657 -0.114614,1.551 -0.346627,0.6138 -1.005341,0.9487 -1.696421,0.9365 -0.339886,-0.01 -1.720283,-0.6372 -2.042561,-0.8192 -0.97754,-0.5519 -1.350795,-1.7418 -0.833686,-2.6576 0.517109,-0.9158 1.728749,-1.2107 2.706299,-0.6587 z" fill="#76e1fe"/>
<rect ry="0.62426329" x="14.406213" y="1035.6842" width="3.0866659" height="3.5313663" fill="#000000" fill-opacity="0.32850246"/>
<path d="m 16,1023.3622 c -9,0 -12,3.7153 -12,9 l 0,20 24,0 c -0.04889,-7.3562 0,-18 0,-20 0,-5.2848 -3,-9 -12,-9 z" fill="#76e1fe"/>
<path d="m 27.074073,1025.0462 c -0.45957,0.2595 -1.818257,1.2013 -1.980979,1.648 -0.183401,0.5035 -0.159384,1.0657 0.114614,1.551 0.346627,0.6138 1.005335,0.9487 1.696415,0.9365 0.33988,-0.01 1.72029,-0.6372 2.04256,-0.8192 0.97754,-0.5519 1.35079,-1.7418 0.83369,-2.6576 -0.51711,-0.9158 -1.72876,-1.2107 -2.7063,-0.6587 z" fill="#76e1fe"/>
<circle cx="21.175734" cy="1030.3542" r="4.6537542" fill="#ffffff"/>
<circle cx="10.339486" cy="1030.3542" r="4.8316345" fill="#ffffff"/>
<rect ry="0.72590536" x="14.115863" y="1035.9174" width="3.6673687" height="4.1063409" fill="#000000" fill-opacity="0.32941176"/>
<rect ry="0.72590536" x="14.115863" y="1035.2253" width="3.6673687" height="4.1063409" fill="#fffcfb"/>
<path d="m 19.999735,1036.5289 c 0,0.838 -0.871228,1.2682 -2.144766,1.1659 -0.02366,0 -0.04795,-0.6004 -0.254147,-0.5832 -0.503669,0.042 -1.095902,-0.02 -1.685964,-0.02 -0.612939,0 -1.206342,0.1826 -1.68549,0.017 -0.110233,-0.038 -0.178298,0.5838 -0.261532,0.5816 -1.243685,-0.033 -2.078803,-0.3383 -2.078803,-1.1618 0,-1.2118 1.815635,-2.1941 4.055351,-2.1941 2.239704,0 4.055351,0.9823 4.055351,2.1941 z" fill="#000000" fill-opacity="0.32941176"/>
<path d="m 19.977414,1035.7004 c 0,0.5685 -0.433659,0.8554 -1.138091,1.0001 -0.291933,0.06 -0.630371,0.096 -1.003719,0.1166 -0.56405,0.032 -1.207782,0.031 -1.89122,0.031 -0.672834,0 -1.307182,0 -1.864904,-0.029 -0.306268,-0.017 -0.589429,-0.043 -0.843164,-0.084 -0.813833,-0.1318 -1.324962,-0.417 -1.324962,-1.0344 0,-1.1601 1.805642,-2.1006 4.03303,-2.1006 2.227377,0 4.03303,0.9405 4.03303,2.1006 z" fill="#c38c74"/>
<ellipse cx="15.944382" cy="1033.8501" rx="2.0801733" ry="1.343747" fill="#23201f"/>
<circle cx="12.414201" cy="1030.3542" r="1.9630634" fill="#171311"/>
<circle cx="23.110121" cy="1030.3542" r="1.9630634" fill="#171311"/>
<path d="m 5.0055377,1027.2727 c -1.170435,-1.0835 -2.026973,-0.7721 -2.044172,-0.7463" fill="none" fill-rule="evenodd" stroke="#384e54" stroke-width="0.39730874" stroke-linecap="round" stroke-linejoin="miter"/>
<path d="m 4.3852457,1026.9152 c -1.158557,0.036 -1.346704,0.6303 -1.33881,0.6523" fill="none" fill-rule="evenodd" stroke="#384e54" stroke-width="0.39730874" stroke-linecap="round" stroke-linejoin="miter"/>
<path d="m 26.630533,1027.1724 c 1.17043,-1.0835 2.02697,-0.7721 2.04417,-0.7463" fill="none" fill-rule="evenodd" stroke="#384e54" stroke-width="0.39730874" stroke-linecap="round" stroke-linejoin="miter"/>
<path d="m 27.321773,1026.673 c 1.15856,0.036 1.3467,0.6302 1.3388,0.6522" fill="none" fill-rule="evenodd" stroke="#384e54" stroke-width="0.39730874" stroke-linecap="round" stroke-linejoin="miter"/>
`;

/* 标志里的字：整块字形必须落在那块面里，还要和面色分得开。
   txt() 只量整张画布的安全区，管不到面与面之间的斜接缝 —— cpp 上一版的 ++ 就是踩着
   接缝画到顶面外面去了，白 C 又写在了浅色面上，两个字符合起来读不出「C++」。
   pts 必须按屏幕上的顺时针给（y 轴向下），这样内部点的叉积恒为正。
   宽度用浏览器实测字距（Noto Sans CJK SC 800）：textW 的拉丁 0.56em 对 C / + 这种
   宽字低估 15%，而接缝只剩几个 px，拿平均值过闸等于没过。 */
function markText(pts, bg, x, y, s, o) {
  const half = (o.adv || textW(s, o.size, !!o.mono)) / 2;
  const x0 = x - half, x1 = x + half, y0 = y - o.size * 0.8, y1 = y + o.size * 0.26;
  if (CR(o.fill, bg) < 4.5) throw new Error(`标志「${s}」和所在面分不开（${CR(o.fill, bg).toFixed(2)}:1）`);
  for (let k = 0; k < pts.length; k++) {
    const ax = pts[k][0], ay = pts[k][1], nx = pts[(k + 1) % pts.length][0], ny = pts[(k + 1) % pts.length][1];
    const ex = nx - ax, ey = ny - ay;
    for (const [px, py] of [[x0, y0], [x1, y0], [x0, y1], [x1, y1]])
      if (ex * (py - ay) - ey * (px - ax) < 0)
        throw new Error(`标志「${s}」出了所在面：角点 ${n(px)},${n(py)} 越过边 ${n(ax)},${n(ay)}→${n(nx)},${n(ny)}`);
  }
  return txt(x, y, s, { size: o.size, weight: o.weight, fill: o.fill, anchor: "middle" });
}

/* ---------------- 版式：标志在正中上方，标题与说明居中在下 ---------------- */
/* 中线 cx=320。标志带 y 40~186，色线 y 196，标题基线 246，说明基线 284。
   每条 spec 只能往这几个槽里放东西，越界由 helper 当场拦下。 */
const CX = 320;
function layout(spec) {
  EMIT = [];
  const ink = spec.ink, dim = spec.dim, tint = spec.tint;
  const parts = [plate(spec.plate)];
  parts.push(MARKS[spec.id]({ tint, ink, dim, plate: spec.plate }));
  parts.push(rr(CX - 22, 196, 44, 4, 2, tint, { tag: "中线色条" }));
  parts.push(txt(CX, 250, spec.title, { size: 42, weight: 800, fill: ink, anchor: "middle" }));
  parts.push(txt(CX, 288, spec.sub, { size: 16, fill: dim, anchor: "middle", ls: 0.6 }));
  if (spec.corner) parts.push(spec.corner({ tint, ink, dim, plate: spec.plate }));
  const credit = spec.credit
    ? `\n  <!-- 喵站课程封面，由 dev/tools/covers.js 生成，别手改产物。\n       ${spec.credit} -->\n  `
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(spec.title)} 封面">` +
    credit + parts.join("") + "</svg>";
}

/* ---------------- 官方 Python 标志 ---------------- */
/* path 取自 python.org/static/community_logos/python-logo-generic.svg，
   © Python Software Foundation，CC-BY 3.0；仅用于指代这门语言本身，不代表官方出品或背书。
   两条 path 各含一个「眼孔」子路径，所以画出来蛇头带眼。原包围盒 112.5 × 110.3。 */
const PY_BLUE = "#3776ab", PY_YELLOW = "#ffd43b";
const PY_BBOX = { x0: 5.017, y0: 6.398, x1: 117.497, y1: 116.742 };
const BLUE_SNAKE = [
  "M 60.510156,6.3979729 C 55.926503,6.4192712 51.549217,6.8101906 47.697656,7.4917229 C 36.35144,9.4962267 34.291407,13.691825 34.291406,21.429223 L 34.291406,31.647973 L 61.103906,31.647973 L 61.103906,35.054223 L 34.291406,35.054223 L 24.228906,35.054223 C 16.436447,35.054223 9.6131468,39.73794 7.4789058,48.647973 C 5.0170858,58.860939 4.9078907,65.233996 7.4789058,75.897973 C 9.3848341,83.835825 13.936449,89.491721 21.728906,89.491723 L 30.947656,89.491723 L 30.947656,77.241723 C 30.947656,68.391821 38.6048,60.585475 47.697656,60.585473 L 74.478906,60.585473 C 81.933857,60.585473 87.885159,54.447309 87.885156,46.960473 L 87.885156,21.429223 C 87.885156,14.162884 81.755176,8.7044455 74.478906,7.4917229 C 69.872919,6.7249976 65.093809,6.3766746 60.510156,6.3979729 z M 46.010156,14.616723 C 48.779703,14.616723 51.041406,16.915369 51.041406,19.741723 C 51.041404,22.558059 48.779703,24.835473 46.010156,24.835473 C 43.23068,24.835472 40.978906,22.558058 40.978906,19.741723 C 40.978905,16.91537 43.23068,14.616723 46.010156,14.616723 z",
  "M 91.228906,35.054223 L 91.228906,46.960473 C 91.228906,56.191228 83.403011,63.960472 74.478906,63.960473 L 47.697656,63.960473 C 40.361823,63.960473 34.291407,70.238956 34.291406,77.585473 L 34.291406,103.11672 C 34.291406,110.38306 40.609994,114.65704 47.697656,116.74172 C 56.184987,119.23733 64.323893,119.68835 74.478906,116.74172 C 81.229061,114.78733 87.885159,110.85411 87.885156,103.11672 L 87.885156,92.897973 L 61.103906,92.897973 L 61.103906,89.491723 L 87.885156,89.491723 L 101.29141,89.491723 C 109.08387,89.491723 111.98766,84.056315 114.69765,75.897973 C 117.49698,67.499087 117.37787,59.422197 114.69765,48.647973 C 112.77187,40.890532 109.09378,35.054223 101.29141,35.054223 L 91.228906,35.054223 z M 76.166406,99.710473 C 78.945884,99.710476 81.197656,101.98789 81.197656,104.80422 C 81.197654,107.63057 78.945881,109.92922 76.166406,109.92922 C 73.396856,109.92922 71.135156,107.63057 71.135156,104.80422 C 71.135158,101.98789 73.396853,99.710473 76.166406,99.710473 z",
];
/* 平涂 + 同色 0.8 描边：斜向渐变会在两蛇咬合处压出一道深藏青，
   而边界严丝合缝时抗锯齿要在缝上漏 1px 底 —— 这两条就是「深色划痕和裂口」的来处。 */
function markSnakes(h, colors) {
  const s = h / (PY_BBOX.y1 - PY_BBOX.y0);
  const w = (PY_BBOX.x1 - PY_BBOX.x0) * s;
  const x0 = CX - w / 2, y0 = 186 - h;
  box("官方蛇形", x0, y0, x0 + w, y0 + h);
  const tx = x0 - PY_BBOX.x0 * s, ty = y0 - PY_BBOX.y0 * s;
  return `<g transform="translate(${n(tx)},${n(ty)}) scale(${n(s)})" stroke-linejoin="round">` +
    BLUE_SNAKE.map((d, i) => `<path d="${d}" fill="${colors[i]}" stroke="${colors[i]}" stroke-width="0.8"/>`).join("") + "</g>";
}

/* ---------------- C++ 立方体的骨架 ---------------- */
/* 尖顶六边形（r=66，中心 320,110）切成三块平行四边形面。顶点一律按屏幕顺时针给，
   markText 的「点在多边形内」判据靠这个顺序才成立。 */
function cppFaces() {
  const r = 66, dx = r * 0.866, cy = 110;
  const T = [CX, cy - r], B = [CX, cy + r],
    TL = [CX - dx, cy - r / 2], TR = [CX + dx, cy - r / 2],
    BL = [CX - dx, cy + r / 2], BR = [CX + dx, cy + r / 2], M = [CX, cy];
  return { T, TR, BR, B, BL, TL, M, top: [T, TR, M, TL], left: [TL, M, B, BL], right: [M, TR, BR, B] };
}
function facePoly(pts, fill, tag) {
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  box(tag, Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys));
  return `<polygon points="${pts.map(p => `${n(p[0])},${n(p[1])}`).join(" ")}" fill="${fill}"/>`;
}

/* ---------------- 各门课的标志 ---------------- */
const MARKS = {
  /* 英语发音：字母 → 音标 的一对关系就是这门课的全部 */
  english(c) {
    const tile = (x, s, solid) =>
      rr(x, 74, 92, 74, 14, solid ? c.tint : c.plate,
        solid ? { tag: "字母格" } : { stroke: c.tint, sw: 3, tag: "音标格" }) +
      txt(x + 46, 122, s, { size: 30, weight: 800, fill: solid ? "#ffffff" : c.tint, anchor: "middle" });
    return `<g font-family="${SANS}">` +
      tile(195, "Aa", true) +
      lines("M297 111H333", { stroke: c.dim, width: 3 }) + tri(341, 111, 9, 0, c.dim) +
      tile(353, "/eɪ/", false) + "</g>";
  },
  /* 英语入门词表：一条能听见的声波 —— 每词一条 mp3 是这门课的实体 */
  enwords(c) {
    const hs = [14, 26, 40, 22, 50, 34, 56, 30, 44, 20, 32, 16];
    const x0 = CX - (hs.length * 14) / 2;
    let s = rr(CX - 120, 52, 240, 44, 12, c.plate, { stroke: c.tint, sw: 3, tag: "词块" }) +
      txt(224, 82, "apple", { size: 24, weight: 700, fill: c.ink, mono: true }) +
      circ(400, 74, 13, c.tint, { tag: "播放点" });
    hs.forEach((h, i) => {
      s += rr(x0 + i * 14, 150 - h / 2, 8, h, 4, i % 3 === 1 ? c.tint : "#c3d2e4", { tag: "声波条" });
    });
    return s + lines(`M${x0 - 6} 150H${x0 + hs.length * 14 - 2}`, { stroke: "#c3d2e4", width: 1.5 });
  },
  python(c) { return markSnakes(132, [PY_BLUE, PY_YELLOW]); },
  /* 生成式 AI：一句提示进去，几条不同的答案出来。
     候选条直接用 rr() 画而不是拿 H 线段算长度 —— 上一版把 [宽, 长] 当成 [x, w] 解构，
     长度成了 w-100 的负数，三条候选反向倒回提示框里，整个标志就偏到中线左边去了。
     左右两端的 150 与 490 必须成对改：中线 320 的正上方只看这两个极值。 */
  genai(c) {
    const bx = 364, rows = [74, 110, 146], lens = [116, 92, 126];
    return rr(150, 84, 180, 52, 12, c.plate, { stroke: c.tint, sw: 2.5, tag: "提示框" }) +
      lines("M172 110H268", { stroke: c.dim, width: 3 }) +
      rr(278, 99, 6, 22, 2, c.tint, { tag: "光标" }) +
      lines("M338 74H350M338 110H350M338 146H350", { stroke: c.dim, width: 2.5 }) +
      rows.map(y => tri(356, y, 6, 0, c.dim)).join("") +
      rows.map((y, i) =>
        rr(bx, y - 4.5, lens[i], 9, 4.5, i === 0 ? c.tint : "#8f7aa8", { tag: "候选条" })).join("");
  },
  /* 机器学习：损失面上一颗往下滚的球，梯度下降就是这门课的心脏 */
  ml(c) {
    return lines("M148 168H492", { stroke: "#c9d6e6", width: 2.5, dash: "6 6" }) +
      lines("M148 168V60", { stroke: "#c9d6e6", width: 2.5 }) +
      lines("M170 74C220 132 268 158 320 150C372 142 418 116 466 92", { stroke: c.tint, width: 5 }) +
      [[186, 88], [232, 116], [276, 136], [318, 146]].map(([x, y], i) =>
        circ(x, y, i === 3 ? 13 : 7, i === 3 ? c.tint : "#9fb3d0", { tag: "下降点" })).join("") +
      tri(318, 128, 8, -90, c.tint);
  },
  /* Web 开发：同一份代码在三种屏宽下长什么样。
     桌面 / 平板 / 手机并排站在同一条地平线上，白屏面 + 本课程本色的标题栏压线，
     里面是「一块横幅 + 几行内容」—— 这套课真正要装进脑子的是响应式，不是套盒图。
     地平线 158~482 与三扇窗 170~470 都以 320 成对：改一边必须改另一边，不然标志就歪。 */
  webdev(c) {
    const ground = 172, sub = "#5f8573";
    const win = (x, w, h, hero) => {
      const y = ground - h;
      let s = rr(x, y, w, h, 6, "#ffffff", { stroke: c.tint, sw: 2.5, tag: "视口" });
      s += lines(`M${x + 2} ${y + 13}H${x + w - 2}`, { stroke: c.tint, width: 1.5, tag: "标题栏" });
      s += rr(x + 8, y + 20, w - 16, hero, 3, c.tint, { tag: "横幅" });
      for (let k = 0; k < 3; k++) {
        const ly = y + 20 + hero + 7 + k * 9;
        if (ly + 4 >= ground - 8) break;
        s += rr(x + 8, ly, (w - 16) * (k === 2 ? 0.55 : 0.86), 4, 2, sub, { tag: "内容条" });
      }
      return s;
    };
    return win(170, 156, 110, 18) + win(340, 74, 96, 14) + win(430, 40, 74, 10) +
      lines("M158 172H482", { stroke: c.dim, width: 2, tag: "地平线" });
  },
  /* AI Agent：想一步 → 调工具 → 拿结果 → 再想，那个回路才是 agent */
  agents(c) {
    return rr(158, 84, 108, 56, 12, c.plate, { stroke: c.tint, sw: 3, tag: "模型框" }) +
      txt(212, 118, "模型", { size: 21, weight: 700, fill: c.ink, anchor: "middle" }) +
      rr(374, 84, 108, 56, 12, c.plate, { stroke: c.dim, sw: 3, tag: "工具框" }) +
      txt(428, 118, "工具", { size: 21, weight: 700, fill: c.ink, anchor: "middle" }) +
      lines("M270 100H370", { stroke: c.tint, width: 3 }) + tri(372, 100, 8, 0, c.tint) +
      lines("M370 128H274", { stroke: c.dim, width: 3 }) + tri(272, 128, 8, 180, c.dim) +
      circ(320, 164, 8, c.tint, { tag: "回路点" }) +
      lines("M300 156C310 168 330 168 340 156", { stroke: c.tint, width: 2.5 });
  },
  /* C++ 入门：官方 logo 的几何 —— 尖顶六边形立方体，三块面按官方配色
     顶面浅 #659AD2 / 左面 #00599C / 右面 #004482。白字只能压在下面这两块深色面上。
     C 写在左面、++ 写在右面，两块面共用的那条竖棱（320,110→320,176）正好落在两者之间，
     横着读就是「C++」。两个字符的墨心都对在 y≈123.5，谁都不许踩接缝。 */
  cpp(c) {
    const F = cppFaces();
    const cen = pts => [pts.reduce((a, p) => a + p[0], 0) / pts.length, pts.reduce((a, p) => a + p[1], 0) / pts.length];
    const lc = cen(F.left), rc = cen(F.right);
    return facePoly(F.top, "#1f6fb2", "C++顶面") +
      facePoly(F.left, "#00599c", "C++左面") +
      facePoly(F.right, "#004482", "C++右面") +
      glyph(GLYPH_C, lc[0], 118, 46, "#ffffff", "C") +
      glyph(GLYPH_PP, rc[0], 118, 21, "#ffffff", "++");
  },
  /* C++ 掌握：同一个立方体只揭开顶面 —— 顶面实色当盖子，下面两块面留白，
     C 与 ++ 用本课程本色的深蓝直接写在牌底上。「外壳拆开、里面看得清」就是掌握要干的事，
     和入门那张整块实心立方体一眼分得开，但仍是同一个 logo 家族。 */
  cppm(c) {
    const F = cppFaces(), dx = F.TR[0] - CX;
    const hexPts = [F.T, F.TR, F.BR, F.B, F.BL, F.TL].map(p => `${n(p[0])},${n(p[1])}`).join(" ");
    box("掌握六边形", CX - dx - 3.25, 110 - 66 - 3.25, CX + dx + 3.25, 110 + 66 + 3.25);
    return facePoly(F.top, "#659ad2", "掌握顶面") +
      `<polygon points="${hexPts}" fill="none" stroke="${c.tint}" stroke-width="6.5" stroke-linejoin="round"/>` +
      lines(`M${n(F.M[0])} ${n(F.M[1])}L${n(F.TL[0])} ${n(F.TL[1])}M${n(F.M[0])} ${n(F.M[1])}L${n(F.TR[0])} ${n(F.TR[1])}M${n(F.M[0])} ${n(F.M[1])}L${n(F.B[0])} ${n(F.B[1])}`,
        { stroke: c.tint, width: 3.5, tag: "棱线" }) +
      glyph(GLYPH_C, (F.left.reduce((t, q) => t + q[0], 0)) / 4, 126.5, 46, c.tint, "C") +
      glyph(GLYPH_PP, (F.right.reduce((t, q) => t + q[0], 0)) / 4, 126.5, 21, c.tint, "++");
  },
  /* Git：一条主线三个提交，中间分出去一条支线、再并回来 —— 分支就是一张会往前挪的便利贴。
     只画指针与提交点，不放官方 logo：站点与 Git 项目没有授权关系，几何自己画。 */
  git(c) {
    const y = 118, up = 62, r = 12;
    return circ(244, y, r, c.tint, { tag: "提交点 1" }) +
      circ(320, y, r, c.tint, { tag: "提交点 2" }) +
      circ(396, y, r, c.tint, { tag: "提交点 3" }) +
      circ(320, up, r, c.plate, { stroke: c.tint, sw: 5, tag: "支线提交点" }) +
      lines(`M256 ${y}H308`, { stroke: c.tint, width: 5, tag: "主线左段" }) +
      lines(`M332 ${y}H384`, { stroke: c.tint, width: 5, tag: "主线右段" }) +
      lines(`M320 ${y - r}V${up + r}`, { stroke: c.dim, width: 4, tag: "分叉线" }) +
      lines(`M${320 + r} ${up}C352 ${up} 372 88 396 ${y - r}`, { stroke: c.dim, width: 4, tag: "并回线" });
  },

  /* ---- 下面 15 门共用一套版面：标志底边落在 y≈176；官方图形原样嵌，自绘的用同一档线宽 ---- */

  /* Go：官方 Gopher（go.dev 的 favicon-gopher.svg，原样嵌入） */
  go(c) {
    const size = 132, s = size / 32, tx = CX - size / 2, ty = 44;
    box("Gopher", tx, ty, tx + size, ty + size);
    return `<g transform="translate(${n(tx)},${n(ty)}) scale(${n(s)}) translate(0,-1020.3622)">${GOPHER_SVG}</g>`;
  },
  /* C：用 C++ 封面那只立方体，去掉 ++，把 C 摆在正面正中放大 */
  c(c) {
    const F = cppFaces();
    return facePoly(F.top, "#1f6fb2", "C顶面") +
      facePoly(F.left, "#00599c", "C左面") +
      facePoly(F.right, "#004482", "C右面") +
      glyph(GLYPH_C, 320, 118, 46, "#ffffff", "C");
  },
  /* TypeScript：一张 TS 牌接一张写着类型标注的代码卡，和 JS 的圆环彻底分开 */
  ts(c) {
    const tile = { x: 168, y: 72, w: 98, h: 98 };
    const card = { x: 288, y: 90, w: 184, h: 80 };
    return rr(tile.x, tile.y, tile.w, tile.h, 22, c.tint, { tag: "TS 牌" }) +
      txt(tile.x + tile.w / 2, tile.y + 62, "TS", { size: 38, weight: 800, fill: readableOn(c.tint), anchor: "middle", mono: true }) +
      rr(card.x, card.y, card.w, card.h, 12, c.plate, { stroke: c.tint, sw: 3, tag: "代码卡" }) +
      rr(card.x + 18, 108, 108, 9, 4.5, c.tint, { tag: "类型行" }) +
      rr(card.x + 18, 126, 84, 8, 4, NEUTRAL_D, { tag: "代码行" }) +
      rr(card.x + 18, 144, 96, 8, 4, NEUTRAL_D, { tag: "代码行" }) +
      txt(card.x + 150, 142, "<>", { size: 24, weight: 800, fill: c.tint, anchor: "middle", mono: true });
  },
  /* GitHub：官方 Octocat 标志（Simple Icons 的 github 路径） */
  github(c) {
    const size = 122, s = size / 24, tx = CX - size / 2, ty = 54;
    box("Octocat", tx, ty, tx + size, ty + size);
    return `<g transform="translate(${n(tx)},${n(ty)}) scale(${n(s)})"><path d="${GITHUB_MARK}" fill="${c.tint}"/></g>`;
  },
  /* C#：和 C 同一只立方体，把 C# 摆在正面正中放大（紫色面） */
  csharp(c) {
    const F = cppFaces();
    const top = mix(c.tint, "#ffffff", 0.18), right = mix(c.tint, "#000000", 0.22);
    return facePoly(F.top, top, "C#顶面") +
      facePoly(F.left, c.tint, "C#左面") +
      facePoly(F.right, right, "C#右面") +
      glyph(GLYPH_CS, 320, 118, 43, "#ffffff", "C#");
  },
  /* Java：官方咖啡杯 logo（Devicon 的 java-original.svg，原样嵌入） */
  java(c) {
    const size = 140, s = size / 128, tx = CX - size / 2, ty = 40;
    box("Java logo", tx, ty, tx + size, ty + size);
    return `<g transform="translate(${n(tx)},${n(ty)}) scale(${n(s)})">${JAVA_LOGO}</g>`;
  },
  /* IDE：一扇编辑器窗，侧栏、代码行、断点和运行键各就各位 */
  ide(c) {
    const x = 180, y = 56, w = 280, h = 122;
    let s = rr(x, y, w, h, 14, c.plate, { stroke: c.tint, sw: 4, tag: "编辑器窗" });
    s += circ(200, 74, 5, c.tint, { tag: "窗钮" }) + circ(216, 74, 5, NEUTRAL_D, { tag: "窗钮" }) + circ(232, 74, 5, NEUTRAL, { tag: "窗钮" });
    s += lines(`M${x + 2} 90H${x + w - 2}`, { stroke: NEUTRAL, width: 2.5, tag: "标题栏线" });
    s += rr(x + 2, 92, 52, 84, 6, soft(c.tint), { tag: "侧栏" });
    [104, 118, 132, 146].forEach((yy, i) =>
      s += rr(x + 12, yy, 30 - i * 3, 6, 3, i === 1 ? c.tint : NEUTRAL_D, { tag: "文件条" }));
    s += rr(248, 102, 150, 9, 4.5, c.tint, { tag: "代码行" })
      + rr(248, 120, 186, 8, 4, NEUTRAL_D, { tag: "代码行" })
      + rr(248, 138, 116, 8, 4, NEUTRAL_D, { tag: "代码行" })
      + rr(248, 156, 168, 8, 4, NEUTRAL_D, { tag: "代码行" })
      + circ(240, 142, 7, "#d6455d", { tag: "断点" })
      + circ(434, 73, 11, c.tint, { tag: "运行钮" })
      + tri(437, 73, 5, 0, readableOn(c.tint), { tag: "播放" });
    return s;
  },
  /* Rust：官方齿轮标志（rust-lang.org 的 rust-logo-blk.svg，改成本课程色） */
  rust(c) {
    const size = 128, s = size / 144, tx = CX - size / 2, ty = 48;
    box("Rust 标志", tx, ty, tx + size, ty + size);
    return `<g transform="translate(${n(tx)},${n(ty)}) scale(${n(s)})">` +
      `<path d="${RUST_MARK[0]}" fill="${c.tint}"/>` +
      `<path d="${RUST_MARK[1]}" fill="${c.tint}" fill-rule="evenodd" stroke="${c.tint}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>` +
      `</g>`;
  },
  /* Linux：一块深色终端，提示符、命令条和光标就是这门课的日常 */
  linux(c) {
    const deck = "#23211a", lit = mix(c.tint, "#ffffff", 0.55);
    return rr(168, 52, 304, 132, 14, deck, { tag: "终端" }) +
      circ(192, 70, 5, lit, { tag: "窗钮" }) + circ(208, 70, 5, "#8f8260", { tag: "窗钮" }) + circ(224, 70, 5, "#5d5543", { tag: "窗钮" }) +
      txt(192, 126, "$", { size: 30, weight: 800, fill: lit, anchor: "start", mono: true }) +
      rr(218, 108, 112, 10, 5, lit, { tag: "命令条" }) +
      rr(338, 102, 12, 22, 3, lit, { tag: "光标" }) +
      txt(192, 162, "$", { size: 26, weight: 800, fill: lit, anchor: "start", mono: true }) +
      rr(218, 144, 74, 9, 4.5, "#8f8260", { tag: "输出条" }) +
      rr(300, 144, 40, 9, 4.5, "#6b6450", { tag: "输出条" });
  },
  /* 高等数学：曲线、切线、积分面，三件事各占一个位置 */
  math(c) {
    const ay = 170, area = mix(c.tint, "#ffffff", 0.82);
    return lines(`M170 ${ay}H474`, { stroke: NEUTRAL_D, width: 3, tag: "x 轴" }) +
      lines(`M170 ${ay}V58`, { stroke: NEUTRAL_D, width: 3, tag: "y 轴" }) +
      tri(478, ay, 7, 0, NEUTRAL_D, { tag: "x 箭头" }) +
      tri(170, 54, 7, -90, NEUTRAL_D, { tag: "y 箭头" }) +
      shape(`M300 84C348 74 380 112 412 136L412 ${ay}H300Z`, area, "积分面") +
      lines("M186 152C236 148 254 92 300 84C348 74 380 112 412 136C434 152 452 156 466 156", { stroke: c.tint, width: 5, tag: "函数曲线" }) +
      lines("M320 72L400 122", { stroke: c.dim, width: 3, dash: "8 6", tag: "切线" }) +
      circ(360, 97, 7, c.tint, { tag: "切点" });
  },
  /* 嵌入式：一颗 MCU 引脚出来接亮一颗 LED —— 点灯是所有人的第一课 */
  embedded(c) {
    let s = "";
    [76, 108, 140].forEach(yy => {
      s += rr(188, yy - 5, 14, 10, 3, c.tint, { tag: "引脚" }) + rr(310, yy - 5, 14, 10, 3, c.tint, { tag: "引脚" });
    });
    [232, 280].forEach(xx => {
      s += rr(xx - 5, 46, 10, 14, 3, c.tint, { tag: "引脚" }) + rr(xx - 5, 168, 10, 14, 3, c.tint, { tag: "引脚" });
    });
    s += rr(200, 58, 112, 112, 16, c.tint, { tag: "芯片" })
      + rr(218, 76, 20, 20, 6, c.plate, { tag: "一角标记" })
      + txt(256, 132, "MCU", { size: 24, weight: 800, fill: readableOn(c.tint), anchor: "middle" })
      + lines("M324 108H380V88H398", { stroke: c.tint, width: 4, tag: "导线" })
      + circ(420, 88, 20, c.plate, { stroke: c.tint, sw: 5, tag: "LED" })
      + circ(420, 88, 9, "#e8a100", { tag: "LED 亮芯" });
    [[-90, 0], [-50, 0], [50, 0], [90, 0]].forEach(([deg]) => {
      const a = deg * Math.PI / 180;
      s += lines(`M${n(420 + 26 * Math.cos(a))} ${n(88 + 26 * Math.sin(a))}L${n(420 + 36 * Math.cos(a))} ${n(88 + 36 * Math.sin(a))}`,
        { stroke: "#e8a100", width: 3, tag: "光线" });
    });
    return s;
  },
  /* 算法：一排按序站好的柱子，放大镜正压在其中一根上 */
  algorithms(c) {
    const base = 176, w = 32, gap = 16, hs = [48, 70, 92, 114, 136];
    let s = "";
    hs.forEach((h, i) => {
      const x = 150 + i * (w + gap);
      s += rr(x, base - h, w, h, 8, i === 2 ? c.plate : c.tint,
        i === 2 ? { stroke: c.tint, sw: 4, tag: "目标柱" } : { tag: "柱子" });
    });
    return s + circ(430, 104, 42, c.plate, { stroke: c.tint, sw: 7, tag: "放大镜" })
      + circ(430, 104, 8, c.tint, { tag: "命中点" })
      + lines("M459 133L490 166", { stroke: c.tint, width: 12, tag: "镜柄" });
  },
  /* 汇编：一摞栈帧，栈指针从左边顶住栈顶 */
  asm(c) {
    const x = 290, w = 150, hgt = 26, gap = 6;
    let s = "";
    [0, 1, 2, 3].forEach(i => {
      const y = 62 + i * (hgt + gap), top = i === 0;
      s += rr(x, y, w, hgt, 7, top ? c.tint : c.plate, top ? { tag: "栈顶" } : { stroke: c.tint, sw: 3, tag: "栈格" });
      [0, 1, 2].forEach(k => {
        s += rr(x + 14 + k * 40, y + 9, 26 - k * 4, 8, 4, top ? readableOn(c.tint) : (k === 1 ? c.tint : NEUTRAL_D), { tag: "字节" });
      });
    });
    return s + arrow(212, 75, 282, 75, { stroke: c.ink, width: 6, head: 13, tag: "栈指针" });
  },
  /* 计算机基础：八个比特排成 01000001，解释成一个大写的 A */
  basics(c) {
    const bits = "01000001", x0 = 95, y = 84, w = 34, h = 72, gap = 4;
    let s = "";
    for (let i = 0; i < 8; i++) {
      const x = x0 + i * (w + gap) + (i >= 4 ? 6 : 0), one = bits[i] === "1";
      s += rr(x, y, w, h, 8, one ? c.tint : c.plate, one ? { tag: "比特 1" } : { stroke: c.tint, sw: 3, tag: "比特 0" }) +
        txt(x + w / 2, 130, bits[i], { size: 24, weight: 800, fill: one ? readableOn(c.tint) : c.tint, anchor: "middle", mono: true });
    }
    return s + arrow(412, 120, 444, 120, { stroke: c.tint, width: 5, head: 11, tag: "翻译" })
      + rr(453, 74, 92, 92, 16, c.tint, { tag: "字节值" })
      + txt(499, 138, "A", { size: 46, weight: 800, fill: readableOn(c.tint), anchor: "middle" });
  },
  /* JavaScript：黄底黑字的 JS 牌，只有牌，没有外圈 */
  js(c) {
    const tile = { x: 262, y: 56, w: 116, h: 116 };
    return rr(tile.x, tile.y, tile.w, tile.h, 14, "#f7df1e", { stroke: "#c9a227", sw: 3, tag: "JS 牌" }) +
      `<g transform="translate(${tile.x},${tile.y}) scale(${n(tile.w / 24)})" fill="#1f2937">${JS_LETTERS}</g>`;
  },
};

/* ---------------- 在册课程表 ---------------- */
const SPECS = [
  {
    id: "python", title: "Python 入门", sub: "45 课 · 零基础 · 每课都能在浏览器里跑",
    plate: "#eef3fa", tint: "#2f6feb", ink: "#1a2233", dim: "#5c6a80",
    credit: "标志 path 取自 python.org/static/community_logos/python-logo-generic.svg，© Python Software Foundation，CC-BY 3.0；仅用于指代 Python 这门语言本身，不代表官方出品或背书。",
  },
  { id: "english", title: "英语发音入门", sub: "26 个字母 · 48 个国际音标 · 每条都有真人读音", plate: "#f3effa", tint: "#7a4fb0", ink: "#231c33", dim: "#6a6280" },
  { id: "enwords", title: "英语入门 257 词", sub: "21 课 · 词 · 音标 · 中文 · 音频", plate: "#eef7f2", tint: "#1c8050", ink: "#182a21", dim: "#5d7468" },
  { id: "genai", title: "生成式 AI 入门", sub: "译自 Microsoft · MIT · 22 课", plate: "#f6f1fb", tint: "#6a4c93", ink: "#241d31", dim: "#6d6680" },
  { id: "ml", title: "机器学习入门", sub: "译自 Microsoft · MIT · 27 课", plate: "#eef4f7", tint: "#1b6f8c", ink: "#17262d", dim: "#5b7078" },
  { id: "webdev", title: "Web 开发入门", sub: "译自 Microsoft · MIT · 27 课", plate: "#eef5f1", tint: "#2f7d55", ink: "#18271f", dim: "#5d7568" },
  { id: "agents", title: "AI Agent 入门", sub: "译自 Microsoft · MIT · 19 课", plate: "#fdf2ec", tint: "#b8500f", ink: "#2b1d12", dim: "#7d6a5c" },
  { id: "git", title: "Git 入门", sub: "三个区 · 四种撤回 · 分支合并", plate: "#fdf1ec", tint: "#c0392b", ink: "#2b1a14", dim: "#7a6357" },
  {
    id: "cpp", title: "C++ 入门", sub: "81 课 · 现代 C++ · 每课考过关才能往下走",
    plate: "#eef2f8", tint: "#00599c", ink: "#142639", dim: "#57677c",
    credit: "标志几何取自 ISO C++ 官方 logo（六边形立方体，左面 #00599C / 右面 #004482）；顶面加深为 #1F6FB2，让白字能跨面居中仍读得清；字母轮廓取自 Noto Sans CJK SC Bold（SIL OFL 1.1）。仅用于指代 C++ 这门语言本身，不代表官方出品或背书。",
  },
  {
    id: "cppm", title: "C++ 掌握", sub: "132 课 · 标准库 · 数据结构与算法实战",
    plate: "#ecf0f7", tint: "#004482", ink: "#0f2032", dim: "#525f76",
    credit: "标志几何取自 ISO C++ 官方 logo（六边形立方体揭开顶面的线框版）；仅用于指代 C++ 这门语言本身，不代表官方出品或背书。",
  },
  {
    id: "java", title: "Java 入门", sub: "12 课 · 从 Oak 到 JVM · 一课一个概念",
    plate: "#fdf3e7", tint: "#c76a15", ink: "#2b1d12", dim: "#7a6357",
    credit: "Java logo © Oracle；图形取自 Devicon 的 java-original.svg，仅用于指代 Java 这门语言，不代表官方出品或背书。",
  },
  {
    id: "ts", title: "TypeScript 入门", sub: "12 课 · 给 JavaScript 加类型",
    plate: "#eef3fb", tint: "#2f6feb", ink: "#1a2233", dim: "#5c6a80",
    credit: "TS 牌按 TypeScript 官方标识的蓝底白字自绘，不复制官方图形文件。",
  },
  {
    id: "c", title: "C 入门", sub: "12 课 · 从 printf 到数组",
    plate: "#eef4f8", tint: "#1b6f8c", ink: "#17262d", dim: "#5b7078",
    credit: "立方体画法沿用本站 C++ 封面（顶面同样加深以便白字居中）；字母轮廓取自 Noto Sans CJK SC Bold（SIL OFL 1.1）。C 本身没有官方标志，这里仅用几何图形指代这门语言。",
  },
  {
    id: "csharp", title: "C# 入门", sub: "12 课 · .NET 与跨平台",
    plate: "#f3eefa", tint: "#6a4c93", ink: "#241d31", dim: "#6d6680",
    credit: "立方体画法沿用本站 C 封面（紫色三面，顶面加深以便白字居中）；字母轮廓取自 Noto Sans CJK SC Bold（SIL OFL 1.1）。C# 没有可直接使用的官方 logo 图形文件，本图为自绘。",
  },
  { id: "asm", title: "汇编入门", sub: "12 课 · x86-64 寄存器到函数", plate: "#f2f2f2", tint: "#4a5568", ink: "#1a202c", dim: "#5c6575" },
  {
    id: "rust", title: "Rust 入门", sub: "12 课 · 不可变、mut 与 Vec",
    plate: "#fdf0e8", tint: "#b7410e", ink: "#2b1a14", dim: "#7a6357",
    credit: "标志 path 取自 rust-lang.org/static/images/rust-logo-blk.svg，仅改成本课程色；仅用于指代 Rust 这门语言，不代表官方出品或背书。",
  },
  {
    id: "go", title: "Go 入门", sub: "12 课 · 从 goroutine 讲到切片",
    plate: "#eef6f4", tint: "#2a8c78", ink: "#173d36", dim: "#4d6f67",
    credit: "吉祥物 Gopher 图形取自 go.dev/images/favicon-gopher.svg（Renée French 设计，CC BY 3.0）；仅用于指代 Go 这门语言，不代表官方出品或背书。",
  },
  {
    id: "github", title: "GitHub 入门", sub: "12 课 · 从 push 到 Actions",
    plate: "#eef1f6", tint: "#24292f", ink: "#161b22", dim: "#57606a",
    credit: "Octocat 是 GitHub 的吉祥物；图形取自 Simple Icons 的 GitHub 官方路径，仅用于指代 GitHub，不代表官方出品或背书。",
  },
  { id: "linux", title: "Linux 入门", sub: "12 课 · 终端、权限、进程、脚本", plate: "#fdf7e3", tint: "#8a6d1a", ink: "#2b2412", dim: "#6f674d" },
  { id: "ide", title: "IDE 入门", sub: "12 课 · VS Code 从界面到调试", plate: "#eef2fb", tint: "#4f46e5", ink: "#17233d", dim: "#5a6880" },
  { id: "math", title: "高等数学入门", sub: "12 课 · 极限、导数、积分", plate: "#f3f0fa", tint: "#5b4bb7", ink: "#221d33", dim: "#6a6280" },
  { id: "embedded", title: "嵌入式入门", sub: "12 课 · 从点灯到 RTOS", plate: "#eef7ef", tint: "#2f7d55", ink: "#18271f", dim: "#5d7568" },
  { id: "algorithms", title: "算法入门", sub: "12 课 · 查找、排序、树与图", plate: "#fdf2ec", tint: "#b8500f", ink: "#2b1d12", dim: "#7d6a5c" },
  { id: "basics", title: "计算机基础入门", sub: "12 课 · 从比特到一次回车", plate: "#f2f5f8", tint: "#334155", ink: "#1a202c", dim: "#5a6577" },
  {
    id: "js", title: "JavaScript 入门", sub: "连载中 · 一课一个能跑的例子",
    plate: "#fdf8e2", tint: "#a16207", ink: "#1f2937", dim: "#6b5c3e",
    credit: "JS 字母 path 取自 Simple Icons 的 javascript 图标（官方标识路径）；仅改填充色，仅用于指代 JavaScript 这门语言。",
  },
];

/* d 属性 → 包围盒。把控制点也算进去（只会把盒子放大、不会缩小），所以拿它当
   「这块画到画布外没有」的判据是安全的。手写正则只认 M/H/V/L 的话，一条 C 曲线
   的终点就被完全漏掉了 —— ml 那张的下降曲线正是这样溜过检查的。 */
function dBox(d) {
  const toks = d.match(/[MmHhVvLlCcSsQqTtAaZz]|-?\d*\.?\d+/g) || [];
  let x = 0, y = 0, minx = 1e9, maxx = -1e9, miny = 1e9, maxy = -1e9;
  const put = (px, py) => { minx = Math.min(minx, px); maxx = Math.max(maxx, px); miny = Math.min(miny, py); maxy = Math.max(maxy, py); };
  for (let i = 0; i < toks.length;) {
    const c = toks[i];
    if (/[^MmHhVvLlCcSsQqTtAaZz]/.test(c)) { i++; continue; }
    i++;
    const num = () => (i < toks.length && !/[A-Za-z]/.test(toks[i]) ? +toks[i++] : null);
    const rel = c === c.toLowerCase();
    switch (c.toUpperCase()) {
      case "M": case "L": {
        let px = num(), py = num();
        while (px !== null && py !== null) { x = rel ? x + px : px; y = rel ? y + py : py; put(x, y); px = num(); py = num(); }
        break;
      }
      case "H": { let p = num(); while (p !== null) { x = rel ? x + p : p; put(x, y); p = num(); } break; }
      case "V": { let p = num(); while (p !== null) { y = rel ? y + p : p; put(x, y); p = num(); } break; }
      case "C": {
        let a = num(), b = num(), e = num(), f = num(), g = num(), h = num();
        while (a !== null && h !== null) {
          put(rel ? x + a : a, rel ? y + b : b); put(rel ? x + e : e, rel ? y + f : f);
          x = rel ? x + g : g; y = rel ? y + h : h; put(x, y);
          a = num(); b = num(); e = num(); f = num(); g = num(); h = num();
        }
        break;
      }
      case "S": case "Q": {
        let a = num(), b = num(), e = num(), f = num();
        while (a !== null && f !== null) {
          put(rel ? x + a : a, rel ? y + b : b);
          x = rel ? x + e : e; y = rel ? y + f : f; put(x, y);
          a = num(); b = num(); e = num(); f = num();
        }
        break;
      }
      case "T": { let a = num(), b = num(); while (a !== null && b !== null) { x = rel ? x + a : a; y = rel ? y + b : b; put(x, y); a = num(); b = num(); } break; }
      case "A": { let t; for (let k = 0; k < 5; k++) t = num(); const px = num(), py = num(); if (px !== null && py !== null) { x = rel ? x + px : px; y = rel ? y + py : py; put(x, y); } break; }
      default: break;
    }
  }
  return maxx < minx ? null : { minx, maxx, miny, maxy };
}
function svgBoxes(svg, yTop, yBottom) {
  const out = [];
  const push = (x0, y0, x1, y1) => { if (y0 >= (yTop === undefined ? -1e9 : yTop) && y1 <= (yBottom === undefined ? 1e9 : yBottom)) out.push([x0, y0, x1, y1]); };
  for (const m of svg.matchAll(/<rect x="(-?[\d.]+)" y="(-?[\d.]+)" width="([\d.]+)" height="([\d.]+)"/g))
    push(+m[1], +m[2], +m[1] + +m[3], +m[2] + +m[4]);
  for (const m of svg.matchAll(/<circle cx="(-?[\d.]+)" cy="(-?[\d.]+)" r="([\d.]+)"/g))
    push(+m[1] - +m[3], +m[2] - +m[3], +m[1] + +m[3], +m[2] + +m[3]);
  for (const m of svg.matchAll(/<polygon points="([^"]+)"/g)) {
    const pts = m[1].trim().split(/\s+/).map(p => p.split(",").map(Number));
    push(Math.min(...pts.map(p => p[0])), Math.min(...pts.map(p => p[1])), Math.max(...pts.map(p => p[0])), Math.max(...pts.map(p => p[1])));
  }
  for (const m of svg.matchAll(/<path d="([^"]+)"/g)) { const b = dBox(m[1]); if (b) push(b.minx, b.miny, b.maxx, b.maxy); }
  for (const m of svg.matchAll(/<text x="(-?[\d.]+)" y="(-?[\d.]+)" font-size="([\d.]+)"([^>]*)>([^<]*)/g)) {
    const w = textW(m[5].replace(/&amp;|&lt;|&gt;/g, "_"), +m[3], /Mono/.test(m[4]));
    const mid = /text-anchor="middle"/.test(m[4]), end = /text-anchor="end"/.test(m[4]);
    const x0 = end ? +m[1] - w : mid ? +m[1] - w / 2 : +m[1];
    push(x0, +m[2] - +m[3] * 0.8, end ? +m[1] : mid ? +m[1] + w / 2 : +m[1] + w, +m[2] + +m[3] * 0.26);
  }
  return out;
}

/* ---------------- 校验：每张都要过的四件事 ---------------- */
function checkSpec(spec) {
  const errs = [];
  if (!MARKS[spec.id]) { return ["没有 " + spec.id + " 的标志函数"]; }
  let svg;
  try { svg = layout(spec); } catch (e) { return ["画图时就出界/色值非法：" + e.message]; }
  if (!/^<svg[\s>]/.test(svg)) errs.push("产物不以 <svg 开头");
  if (!/^<svg[^>]*width="640"[^>]*height="360"/.test(svg)) errs.push("画布不是 640×360");
  const body = svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/^[\s\S]*?-->/, "");
  if (!/^<rect width="640" height="360" fill="#[0-9a-fA-F]{6}"\/>/.test(body.trim())) errs.push("第一件不是满幅不透明牌底");
  if (/url\(#|Gradient/.test(svg)) errs.push("用了渐变（135° 线性渐变是最典型的 AI 味）");
  if (/rgba?\(/.test(svg)) errs.push("用了半透明色，牌底等于不成立");
  /* 标志必须横跨中线两侧：左右不对称就是他说的「歪」。只看标志带（y 34~194）里登记过的件。 */
  const band = EMIT.filter(b => b.y0 >= 30 && b.y1 <= 194);
  if (band.length) {
    const lo = Math.min(...band.map(b => b.x0)), hi = Math.max(...band.map(b => b.x1));
    const off = (lo + hi) / 2 - CX;
    if (Math.abs(off) > 10) errs.push(`标志不在中线正上方：包围盒 ${lo.toFixed(0)}~${hi.toFixed(0)}，中心偏 ${off.toFixed(0)}px（${band.length} 件）`);
    const top = Math.min(...band.map(b => b.y0)), bot = Math.max(...band.map(b => b.y1));
    if (bot - top < 70) errs.push(`标志太矮：只占 ${Math.round(bot - top)}px 高，卡片缩到 169px 宽就糊成一团`);
  } else errs.push("标志带（y 34~194）里没有登记任何件");
  /* 色对 */
  [[spec.ink, spec.plate, 4.5, "标题"], [spec.dim, spec.plate, 4.5, "说明"]].forEach(([fg, bg, min, lb]) => {
    const cr = CR(fg, bg); if (cr < min) errs.push(`${lb} ${cr.toFixed(2)}:1 < ${min}:1`);
  });
  if (!separable(spec.tint, spec.plate)) errs.push(`强调色与牌底分不开（${CR(spec.tint, spec.plate).toFixed(2)}:1 且不满足高饱和对中性底）`);
  return errs;
}

/* ---------------- 磁盘体检：现存 SVG 有没有画到画布外 ---------------- */
/* 量具只有一套：几何一律走 svgBoxes()，和 --check 用同一把尺。
   这里以前自带一套更简单的正则，它不认 text-anchor="middle"，也不认 <g transform>，
   于是把 7 张新封面全误判成「贴边/出画布」（居中的说明行被当成从左沿往右铺）。 */
function diskBoxes(s) {
  /* 满幅牌底是故意画到边的，不是越界件 */
  const body = s.replace(/<rect width="640" height="360"[^>]*\/>/g, "");
  const out = [];
  const stripped = body.replace(/<g([^>]*)>([\s\S]*?)<\/g>/g, (m, attrs, inner) => {
    const t = /transform="translate\((-?[\d.]+),(-?[\d.]+)\)\s*scale\(([\d.]+)\)(?:\s*translate\((-?[\d.]+),(-?[\d.]+)\))?"/.exec(attrs);
    if (!t) return inner;
    const tx = +t[1], ty = +t[2], sc = +t[3], ox = t[4] ? +t[4] : 0, oy = t[5] ? +t[5] : 0;
    svgBoxes(inner).forEach(b => out.push([
      tx + (b[0] + ox) * sc, ty + (b[1] + oy) * sc, tx + (b[2] + ox) * sc, ty + (b[3] + oy) * sc,
    ]));
    return "";
  });
  svgBoxes(stripped).forEach(b => out.push(b));
  return out;
}
function auditDisk() {
  const files = fs.readdirSync(OUT).filter(f => f.endsWith(".svg"));
  const rows = [];
  for (const f of files) {
    const boxes = diskBoxes(fs.readFileSync(path.join(OUT, f), "utf8"));
    if (!boxes.length) { rows.push({ f, note: "读不出任何件" }); continue; }
    const minx = Math.min(...boxes.map(b => b[0])), maxx = Math.max(...boxes.map(b => b[2]));
    const miny = Math.min(...boxes.map(b => b[1])), maxy = Math.max(...boxes.map(b => b[3]));
    rows.push({ f, minx, maxx, miny, maxy, out: minx < 0 || miny < 0 || maxx > W || maxy > H, tight: minx < SAFE.x0 || miny < SAFE.y0 || maxx > SAFE.x1 || maxy > SAFE.y1 });
  }
  return rows;
}

/* ---------------- 主流程 ---------------- */
function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("--audit")) {
    const rows = auditDisk();
    const out = rows.filter(r => r.out), tight = rows.filter(r => r.tight && !r.out);
    console.log(`磁盘上 ${rows.length} 张封面，安全区 ${SAFE.x0}~${SAFE.x1} × ${SAFE.y0}~${SAFE.y1}（画布 ${W}×${H}）`);
    out.forEach(r => console.log(`  ✘ 画到画布外：${r.f}  占 ${n(r.minx)}~${n(r.maxx)} × ${n(r.miny)}~${n(r.maxy)}`));
    tight.forEach(r => console.log(`  ·  贴边（hover 放大 1.06 会被裁）：${r.f}  ${n(r.minx)}~${n(r.maxx)} × ${n(r.miny)}~${n(r.maxy)}`));
    console.log(`合计：越出画布 ${out.length} 张，贴边 ${tight.length} 张，安全 ${rows.length - out.length - tight.length} 张`);
    process.exit(out.length ? 1 : 0);
  }

  const only = argv.includes("--only") ? argv[argv.indexOf("--only") + 1] : null;
  const list = only ? SPECS.filter(s => s.id === only) : SPECS;
  if (only && !list.length) { console.log("不在册：" + only + "（在册：" + SPECS.map(s => s.id).join(", ") + "）"); process.exit(1); }

  let bad = 0;
  const built = [];
  for (const spec of list) {
    const errs = checkSpec(spec);
    if (errs.length) { bad++; console.log(`✘ ${spec.id}`); errs.forEach(e => console.log("    " + e)); continue; }
    built.push({ spec, svg: layout(spec) });
    console.log(`✔ ${spec.id.padEnd(9)} 版式/边界/对比度 全过`);
  }
  if (argv.includes("--check") || bad) { if (bad) { console.log(`\n红灯 ${bad} 门，一张都没写`); process.exit(1); } if (argv.includes("--check")) return; }

  fs.mkdirSync(OUT, { recursive: true });
  for (const b of built) {
    const p = path.join(OUT, b.spec.id + ".svg");
    const before = fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
    fs.writeFileSync(p, b.svg);
    console.log(`写出 ${b.spec.id}.svg${before && before !== b.svg ? "（覆盖旧版）" : ""}  ${Buffer.byteLength(b.svg)}B`);
  }
  console.log(`\n共 ${built.length} 张 → dev/frontend/assets/img/covers/`);
  console.log("注意：BYOX 那 30 门还没登记进 site.js，它们的 byox-*.svg 仍是旧模板产物，等正文回归再一起换。");
}
main();
