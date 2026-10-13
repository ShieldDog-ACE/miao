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
  /* 英语入门 200 词：一条能听见的声波 —— 每词一条 mp3 是这门课的实体 */
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
    const L = "#00599c", R = "#004482";
    return facePoly(F.top, "#659ad2", "C++顶面") +
      facePoly(F.left, L, "C++左面") +
      facePoly(F.right, R, "C++右面") +
      markText(F.left, L, 292, 138.5, "C", { size: 40, weight: 800, fill: "#ffffff", adv: 0.656 * 40 }) +
      markText(F.right, R, 350, 135, "++", { size: 30, weight: 800, fill: "#ffffff", adv: 1.18 * 30 });
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
      markText(F.left, c.plate, 292, 138.5, "C", { size: 40, weight: 800, fill: c.tint, adv: 0.656 * 40 }) +
      markText(F.right, c.plate, 350, 135, "++", { size: 30, weight: 800, fill: c.tint, adv: 1.18 * 30 });
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
  { id: "enwords", title: "英语入门 200 词", sub: "20 课 × 10 词 · 词 · 音标 · 中文 · 音频", plate: "#eef7f2", tint: "#1c8050", ink: "#182a21", dim: "#5d7468" },
  { id: "genai", title: "生成式 AI 入门", sub: "译自 Microsoft · MIT · 22 课", plate: "#f6f1fb", tint: "#6a4c93", ink: "#241d31", dim: "#6d6680" },
  { id: "ml", title: "机器学习入门", sub: "译自 Microsoft · MIT · 27 课", plate: "#eef4f7", tint: "#1b6f8c", ink: "#17262d", dim: "#5b7078" },
  { id: "webdev", title: "Web 开发入门", sub: "译自 Microsoft · MIT · 27 课", plate: "#eef5f1", tint: "#2f7d55", ink: "#18271f", dim: "#5d7568" },
  { id: "agents", title: "AI Agent 入门", sub: "译自 Microsoft · MIT · 19 课", plate: "#fdf2ec", tint: "#b8500f", ink: "#2b1d12", dim: "#7d6a5c" },
  {
    id: "cpp", title: "C++ 入门", sub: "81 课 · 现代 C++ · 每课考过关才能往下走",
    plate: "#eef2f8", tint: "#00599c", ink: "#142639", dim: "#57677c",
    credit: "标志几何取自 ISO C++ 官方 logo（六边形立方体，顶面 #659AD2 / 左面 #00599C / 右面 #004482）；仅用于指代 C++ 这门语言本身，不代表官方出品或背书。",
  },
  {
    id: "cppm", title: "C++ 掌握", sub: "132 课 · 标准库 · 数据结构与算法实战",
    plate: "#ecf0f7", tint: "#004482", ink: "#0f2032", dim: "#525f76",
    credit: "标志几何取自 ISO C++ 官方 logo（六边形立方体揭开顶面的线框版）；仅用于指代 C++ 这门语言本身，不代表官方出品或背书。",
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
    const t = /transform="translate\((-?[\d.]+),(-?[\d.]+)\)\s*scale\(([\d.]+)\)"/.exec(attrs);
    if (!t) return inner;
    const tx = +t[1], ty = +t[2], sc = +t[3];
    svgBoxes(inner).forEach(b => out.push([tx + b[0] * sc, ty + b[1] * sc, tx + b[2] * sc, ty + b[3] * sc]));
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
