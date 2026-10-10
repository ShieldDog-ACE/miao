/* 喵站 · 英语入门 · 数据与考卷生成器
 *
 * 读四份词表原稿 + 第 21 课 → 产出两份站点数据：
 *   frontend/assets/data/enwords-data.js       200 词表 + 21 章正文（window.MIAO_ENW）
 *   frontend/assets/data/enword-exam-data.js   21 场考卷的规格（window.MIAO_ENW_EXAM）
 *
 * 先验后写：任何一项检查没过就不落盘（上一轮「骨架当交付」的教训，见 dev/任务书.md）。
 * 跑法：
 *   node dev/tools/enword-gen.js --check     只体检，不写文件
 *   node dev/tools/enword-gen.js             验完再写
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const DEV = path.resolve(__dirname, "..");
const SRC = path.join(DEV, "tools", "enword");
const DATA = path.join(DEV, "frontend", "assets", "data");
const AUDIO_DIR = path.join(DEV, "frontend", "assets", "audio", "words");
const WRITE = process.argv.indexOf("--check") < 0;

/* ---------- 1. 读原稿 ---------- */
const ctx = { window: {}, console: { log: () => {}, error: console.error, warn: console.warn } };
ctx.self = ctx.window; ctx.globalThis = ctx.window;
vm.createContext(ctx);
const chunkFiles = fs.readdirSync(SRC).filter(f => /^l\d\d(-l\d\d)?\.js$/.test(f)).sort();
for (const f of chunkFiles) vm.runInContext(fs.readFileSync(path.join(SRC, f), "utf8"), ctx, { timeout: 20000, filename: f });
const SRC21 = ctx.window.MIAO_ENW_SRC || {};
const errors = [];
const warn = m => errors.push(m);

/* ---------- 2. 音标表：站内 48 音标 + 重音号，别自创符号 ---------- */
const en = { window: {} };
en.self = en.window; en.globalThis = en.window;
vm.createContext(en);
vm.runInContext(fs.readFileSync(path.join(DATA, "en-data.js"), "utf8"), en, { timeout: 20000 });
const PHONEMES = (en.window.MIAO_EN.phonemes || []).map(p => p.ph.replace(/^\//, "").replace(/\/$/, ""));
/* 站内 48 个音标卡 + 两个重音号，就是这门课允许的音标字符集（两门英语课必须说同一套话）。
   两个例外写死在这里：
     ˑ 之外不加任何东西；i 是 DJ 词典在词尾 -y 上的写法（/ˈhæpi/），站内那张卡教的是 /ɪ/。
   另外 ɡ（U+0261）与 g（U+0067）是同一个音的两种字形，进来一律折成 g。 */
const EXTRA = ["i"];
const INVENTORY = PHONEMES.concat(EXTRA, ["ˈ", "ˌ"]).sort((a, b) => b.length - a.length);
const fixIpa = s => String(s || "").replace(/ɡ/g, "g");

/** 把音标串切成音素：最长优先匹配，ː 并进前一个音素；ɡ/g 两种字形都认 */
function tokenize(ipa) {
  const s = fixIpa(ipa).replace(/^\/|\/$/g, "");
  const out = [];
  for (let i = 0; i < s.length;) {
    if (s[i] === "ː") { if (out.length) out[out.length - 1] += "ː"; i++; continue; }
    const hit = INVENTORY.find(p => s.startsWith(fixIpa(p), i));
    if (!hit) { out.push({ bad: s[i], at: i }); i++; continue; }
    out.push(fixIpa(hit)); i += hit.length;
  }
  return out;
}
const VOWEL_CHARS = "aeiouæɑɒɔəɜʌɪʊ";
const isVowel = p => typeof p === "string" && (p.indexOf("ː") >= 0 || VOWEL_CHARS.includes(p.replace("ː", "")));

/* ---------- 3. 词表体检 ---------- */
const lessons = [];
const wordKeys = {};
for (let no = 1; no <= 21; no++) {
  const id = "l" + String(no).padStart(2, "0");
  const L = SRC21[id];
  if (!L) { warn("缺第 " + id + " 课原稿"); continue; }
  if (no <= 20) {
    if (!L.words || L.words.length !== 10) warn(id + " 的 words 是 " + (L.words || []).length + " 条，必须 10 条");
    if (!L.read || L.read.length < 3) warn(id + " 的读音要点不足 3 条");
    if (!L.trap || L.trap.length < 3) warn(id + " 的常见坑不足 3 条");
    if (!L.task || L.task.length < 3) warn(id + " 的任务不足 3 条");
    for (const w of L.words || []) {
      const k = w.w.toLowerCase();
      if (wordKeys[k]) warn("单词重复：" + k + "（第 " + wordKeys[k] + " 课与第 " + no + " 课）");
      wordKeys[k] = no;
      if (!w.ipa || !/^\/.+\/$/.test(w.ipa)) warn(k + " 的 ipa 形状不对：" + w.ipa);
      if (!w.cn) warn(k + " 缺中文");
      if (!w.pos) warn(k + " 缺词性");
      if (!w.ph) warn(k + " 缺短语");
      const toks = tokenize(w.ipa || "");
      const bad = toks.filter(t => t && t.bad);
      if (bad.length) warn(k + " 的音标里有站内 48 音标之外的字符：" + bad.map(b => b.bad).join(" ") + "（" + w.ipa + "）");
      if (w.ipa && w.ipa.indexOf("ˈ") < 0 && toks.filter(isVowel).length > 1) warn(k + " 多音节却没有主重音号 ˈ：" + w.ipa);
      const mp3 = path.join(AUDIO_DIR, k + ".mp3");
      if (!fs.existsSync(mp3)) warn("缺音频：" + k + ".mp3（" + mp3 + "）");
      else if (fs.statSync(mp3).size < 800) warn("音频小得可疑：" + k + ".mp3 " + fs.statSync(mp3).size + "B");
    }
  }
  lessons.push({ id, no, L });
}

/* 交叉引用只许往回指：正文里出现的「第 N 课」N 必须 ≤ 本课课号 */
const proseOf = L => [L.goal, L.one, ...(L.read || []), ...(L.memo || []), ...(L.trap || []), ...(L.task || [])].join("\n");
for (const { id, no, L } of lessons) {
  if (no > 20) continue;
  const refs = [...proseOf(L).matchAll(/第\s*(\d{1,2})\s*课/g)].map(m => Number(m[1]));
  for (const r of refs) if (r > no) warn(id + " 正文里出现了指向后面第 " + r + " 课的引用");
}

/* 不许提前接触：这一条拆两档判，因为「讲解」和「布置任务」的性质不一样。
   - 硬闸（判错）：本课目标 / 任务 / 本课一句话。任务是要读者真开口造句的，
     里面冒出没教过的词，读者就只能照抄，那就失去意义了。
   - 软报（只列数字）：读音要点 / 怎么记 / 常见坑 / 短语。这些是整句照着念的样板，
     教材本来就会带几个后续词，拦死反而写不出人话。
   音标括注（/ˈæpl/）与拼读拟形（hə-LEU、SO-ri、sh、nd）都不算英文单词，先剔掉。 */
function tokensOf(text) {
  const s = String(text).replace(/\/[^\/]*\//g, " ");                 // 丢音标
  const out = [];
  for (const m of s.matchAll(/[A-Za-z][A-Za-z']*(?:-[A-Za-z]+)?/g)) {
    const raw = m[0];
    if (raw.includes("-") || raw.length <= 2) continue;               // 丢拼读拟形与缩写
    out.push(raw.toLowerCase().replace(/'/g, ""));
  }
  return out;
}
const FUNCTION = new Set(("a an the is am are was were be been being of to in on at by from and or but not no yes " +
  "this that these those it its i you he she we they me him us my your his her their our have has had " +
  "what who where when why how very really about with without there here do does did dont can will " +
  "would could should ok okay please thank sorry hello hi good morning afternoon o clock").split(" "));
const taughtUpTo = {};          /* 课号 → 到这一课为止教过的词（小写） */
{
  const acc = new Set();
  for (let no = 1; no <= 20; no++) {
    (SRC21["l" + String(no).padStart(2, "0")].words || []).forEach(w => acc.add(w.w.toLowerCase()));
    taughtUpTo[no] = acc;
  }
}
const earlyHard = [], earlySoft = [];
function checkEarly(no, label, text, hard) {
  const known = taughtUpTo[no] || new Set();
  for (const w of tokensOf(text)) {
    if (FUNCTION.has(w) || known.has(w)) continue;
    if (known.has(w + "s") || known.has(w + "es") || known.has(w.replace(/s$/, ""))) continue;
    (hard ? earlyHard : earlySoft).push("第 " + no + " 课 · " + label + " · " + w + "：「" + String(text).slice(0, 44) + "」");
  }
}
for (const { no, L } of lessons) {
  if (no > 20) continue;
  checkEarly(no, "本课目标", L.goal || "", true);
  (L.task || []).forEach(s => checkEarly(no, "任务", s, true));
  checkEarly(no, "本课一句话", L.one || "", true);
  (L.read || []).forEach(s => checkEarly(no, "读音要点", s, false));
  (L.memo || []).forEach(s => checkEarly(no, "怎么记", s, false));
  (L.trap || []).forEach(s => checkEarly(no, "常见坑", s, false));
  (L.words || []).forEach(w => checkEarly(no, w.w + " 的短语", w.ph || "", false));
}
earlyHard.forEach(m => warn("任务/目标里出现没教过的单词 → " + m));
if (earlySoft.length) console.error("[软报] 讲解与短语里带出的后续词 " + earlySoft.length + " 处（不拦，整句照着念的样板）：\n  - " + earlySoft.join("\n  - "));
if (lessons.length !== 21) warn("课时数 " + lessons.length + " ≠ 21");

/* ---------- 4. 章节装配 ---------- */
function wordItem(no, w) {
  return {
    w: w.w, ipa: w.ipa, pos: w.pos, cn: w.cn, ph: w.ph,
    a: "/assets/audio/words/" + w.w.toLowerCase() + ".mp3", lesson: "ew-l" + String(no).padStart(2, "0")
  };
}
function stressRow(w) {
  const raw = tokenize(w.ipa);
  const mark = raw.indexOf("ˈ");
  /* ˈ 与 ˌ 是重音号，不是音素：算「几个音」的时候必须剔掉，
     否则 apple 会被报成 4 个音（æ p l 加上那个重音号） */
  const toks = raw.filter(t => t !== "ˈ" && t !== "ˌ");
  const from = mark >= 0 ? raw.slice(0, mark + 1).filter(t => t !== "ˈ" && t !== "ˌ").length : 0;
  let nucleus = -1;
  for (let i = from; i < toks.length; i++) if (isVowel(toks[i])) { nucleus = i; break; }
  const syl = [];
  let cur = [];
  for (const t of toks) {
    cur.push(t);
    if (isVowel(t)) { syl.push(cur); cur = []; }
  }
  if (cur.length) { if (syl.length) syl[syl.length - 1] = syl[syl.length - 1].concat(cur); else syl.push(cur); }
  return { word: w.w, phonemes: toks.filter(t => !t.bad), stressed: nucleus };
}

/** 每课一张机制图：十个词的音素数排成阶梯，重音落在哪一格用实心点标出来。
 *  字体字号一律挂在 <g> 上（原先每个 <text> 自带一长串 font-family，21 张图多占 60 KB）。 */
const SANS = "'Noto Sans CJK SC','DejaVu Sans',sans-serif";
function lessonSvg(L) {
  const rows = L.words.map(stressRow);
  const maxP = Math.max(...rows.map(r => r.phonemes.length), 1);
  const y0 = 54, rowH = 20, barX = 150, barW = 380;
  const H = y0 + rows.length * rowH + 16;
  let g = `<g font-family="${SANS}" font-size="13">`;
  rows.forEach((r, i) => {
    const y = y0 + i * rowH;
    const w = Math.max(24, Math.round(barW * r.phonemes.length / maxP));
    const dot = r.stressed >= 0 ? r.stressed : 0;
    const dx = barX + Math.min(w - 10, Math.round((dot + 0.5) * (w / Math.max(r.phonemes.length, 1))));
    g += `<text x="8" y="${y + 13}" fill="#333">${r.word}</text>`;
    g += `<rect x="${barX}" y="${y}" width="${w}" height="16" rx="3" fill="#FBBF5A" stroke="#D98B1F"/>`;
    g += `<circle cx="${dx}" cy="${y + 8}" r="4" fill="#FB7DA8" stroke="#B23F6B"/>`;
    g += `<text x="${barX + w + 10}" y="${y + 13}" font-size="12" fill="#7a7a7a">${r.phonemes.length} 个音</text>`;
  });
  g += "</g>";
  const head = `<g font-family="${SANS}" fill="#333">` +
    `<text x="8" y="20" font-size="15" font-weight="bold">本课十个词的音素数（粉点 = 主重音所在的那个元音）</text>` +
    `<text x="8" y="40" font-size="13" fill="#666">条子长短 = 音标里有几个音，不是有几个字母 —— 英语的拼写和读音不成比例</text></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 ${H}">` +
    `<rect width="640" height="${H}" fill="#FDF6EF"/>` + head + g + `</svg>`;
}

function lessonBlocks({ no, L }) {
  const cid = "ew-l" + String(no).padStart(2, "0");
  const b = [];
  b.push({ t: "tip", color: "blue", text: "本课目标：" + L.goal });
  b.push({ t: "h2", text: "单词卡 · 点一下听读音" });
  /* 十个词的数据只存一份（在 pack.words 里），正文这块按课号引过去，渲染层当场取 */
  b.push({ t: "en", kind: "word", ref: cid });
  b.push({ t: "h2", text: "读音要点" });
  b.push({ t: "ul", items: L.read });
  b.push({ t: "h2", text: "这一课的机制图" });
  b.push({ t: "svg", code: lessonSvg(L), caption: "十个词的音素数排出来的阶梯：一眼看出哪个词最长、主重音落在第几个音上" });
  b.push({ t: "h2", text: "怎么记" });
  b.push({ t: "ul", items: L.memo });
  b.push({ t: "h2", text: "常见坑" });
  b.push({ t: "ul", items: L.trap });
  b.push({ t: "h2", text: "任务" });
  b.push({ t: "ul", items: L.task });
  b.push({ t: "tip", color: "green", text: "本课一句话：" + L.one });
  return b;
}

function reviewBlocks() {
  const L = SRC21.l21;
  const mapSvg = (() => {
    let g = "";
    L.map.forEach((row, i) => {
      const col = i % 4, r = Math.floor(i / 4);
      const x = 8 + col * 160, y = 46 + r * 58;
      g += `<rect x="${x}" y="${y}" width="152" height="50" rx="6" fill="#FFFFFF" stroke="#E4CBAE"/>`;
      g += `<text x="${x + 8}" y="${y + 18}" font-size="13" font-weight="bold" fill="#B23F6B" font-family="'Noto Sans CJK SC',sans-serif">${row[0]}</text>`;
      g += `<text x="${x + 8}" y="${y + 34}" font-size="12" fill="#333" font-family="'Noto Sans CJK SC',sans-serif">${row[1]}</text>`;
      g += `<text x="${x + 8}" y="${y + 46}" font-size="11" fill="#7a7a7a" font-family="'DejaVu Sans',sans-serif">${row[2]}</text>`;
    });
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">` +
      `<rect width="640" height="360" fill="#FDF6EF"/>` +
      `<text x="8" y="20" font-size="15" font-weight="bold" fill="#333" font-family="'Noto Sans CJK SC',sans-serif">200 个词 = 20 个主题 × 10 个词</text>` +
      `<text x="8" y="38" font-size="13" fill="#666" font-family="'Noto Sans CJK SC',sans-serif">复习按主题走，不按字母表走：一格就是一幅画</text>` + g + `</svg>`;
  })();
  return [
    { t: "tip", color: "blue", text: "本课目标：" + L.goal },
    { t: "h2", text: "这 200 个词是怎么排的" },
    { t: "svg", code: mapSvg, caption: "二十个主题各占一格，格子里写着这一格抽到的三个代表词" },
    { t: "h2", text: "五步复习法" },
    { t: "ul", items: L.steps },
    { t: "h2", text: "结课前先自测这四项" },
    { t: "ul", items: L.check },
    { t: "h2", text: "常见坑" },
    { t: "ul", items: L.trap },
    { t: "h2", text: "任务" },
    { t: "ul", items: L.task },
    { t: "tip", color: "green", text: "本课一句话：" + L.one }
  ];
}

/* ---------- 5. 装配章节（正文 + 机制图） ---------- */
const chaptersPre = [];
for (let no = 1; no <= 20; no++) {
  const L = SRC21["l" + String(no).padStart(2, "0")];
  chaptersPre.push({ id: "ew-l" + String(no).padStart(2, "0"), title: L.title, blocks: lessonBlocks({ no, L }) });
}
chaptersPre.push({ id: "ew-l21", title: SRC21.l21.title, blocks: reviewBlocks() });

/* ---------- 6. 口径体检：块数 / 字数 ---------- */
const bodyChars = blocks => blocks.filter(b => ["p", "h2", "tip", "ul"].includes(b.t))
  .reduce((n, b) => n + (b.text || "").length + (b.items || []).join("").length, 0);
for (const [i, ch] of chaptersPre.entries()) {
  const n = ch.blocks.length, c = bodyChars(ch.blocks);
  if (n > 25) warn(ch.id + " 有 " + n + " 块，超 25 块上限");
  if (c > 1800) warn(ch.id + " 正文 " + c + " 字，超 1,800 字上限");
  if (!ch.blocks.some(b => b.t === "svg")) warn(ch.id + " 缺图形化演示（每课至少一张 svg）");
  for (const b of ch.blocks) {
    const txt = (b.text || "") + (b.items || []).join("") + (b.code || "");
    if (/喵|椰子蛋|管理/.test(txt)) warn(ch.id + " 正文里出现禁词：" + txt.slice(0, 40));
  }
}

/* ---------- 7. 考卷规格 ---------- */
/* 每课一场的分值要凑成整 100，这里把两种卷的形状写死并当场验算：
   课末卷 14 题：选择 4×6 + 听音选词 3×6 + 补全单词 3×6 + 中译英默写 2×8 + 连线 2 组×4 对×3 = 100
   结课卷 20 题：选择 8×5 + 听音选词 6×5 + 中译英默写 5×4 + 连线 1 组×5 对×2 = 100 */
const LESSON_PAPER = { counts: { mc: 4, pick: 3, fill: 3, spell: 2, match: 2 }, weights: { mc: 6, pick: 6, fill: 6, spell: 8, matchPair: 3 } };
const FINAL_PAPER = { counts: { mc: 8, pick: 6, fill: 0, spell: 5, match: 1 }, weights: { mc: 5, pick: 5, fill: 0, spell: 4, matchPair: 2 } };
const PAIRS_PER_GROUP = q => (q === LESSON_PAPER ? 4 : 5);
function sum100(spec, pairs) {
  const w = spec.weights, c = spec.counts;
  return w.mc * c.mc + w.pick * c.pick + w.fill * c.fill + w.spell * c.spell + w.matchPair * c.match * pairs;
}
if (sum100(LESSON_PAPER, 4) !== 100) warn("课末卷分值合计 = " + sum100(LESSON_PAPER, 4) + "，必须 100");
if (sum100(FINAL_PAPER, 5) !== 100) warn("结课卷分值合计 = " + sum100(FINAL_PAPER, 5) + "，必须 100");

const examPapers = [];
for (let no = 1; no <= 20; no++) {
  const L = SRC21["l" + String(no).padStart(2, "0")];
  const cid = "ew-l" + String(no).padStart(2, "0");
  examPapers.push(Object.assign({
    cid, kind: "enword", pool: [cid], pairsPerGroup: 4,
    title: "第 " + no + " 课考试 · " + L.title.replace(/^第 \d+ 课 · /, ""),
    task: "范围就是本课这 10 个词：看中文选英文、听音选词、按首字母把单词补全、看中译默写英文，最后一组把英文和中文连起来。",
    hint: "补全和默写都写单词原形：大小写不管，多打空格不算错，写错一个字母才算错。"
  }, LESSON_PAPER));
}
examPapers.push(Object.assign({
  cid: "ew-l21", kind: "enword", pool: examPapers.map(p => p.cid), pairsPerGroup: 5,
  title: "结课考试 · 200 个词混合卷",
  task: "范围是前 20 课的全部 200 个词，混着考：看中文选英文、听音选词、看中文默写英文，再加一组五对连线。",
  hint: "错在哪一题，复盘里会写出正确拼写，点「听」能重听那个词。范围太大，错得多就回到对应那一课重做课末卷。"
}, FINAL_PAPER));

/* ---------- 8. 打包并落盘 ---------- */
const allWords = [];
for (const { no, L } of lessons) if (no <= 20) for (const w of L.words) allWords.push(wordItem(no, w));

if (errors.length) {
  console.error("!! 体检没过，未写任何文件：\n  - " + errors.join("\n  - "));
  process.exit(1);
}

const pack = {
  /* 200 条词卡只存这一份：每条带 lesson（所属章 id），正文的单词卡块和考卷都按它取 */
  words: allWords,
  tutorial: {
    id: "enwords",
    title: "英语入门：20 课 200 个基础单词",
    intro: "从 hello 到 have，20 个主题各 10 个真正入门要用的词。每个词都有读音、音标、词性、中文和一句常用短语，点一下就听；每课一场小考，最后一场 200 词的结课大考。",
    cat: "英语",
    diff: "入门",
    tags: ["英语", "单词", "零基础", "发音"],
    author: "喵站官方",
    cover: "/assets/img/covers/enwords.svg",
    chapters: chaptersPre
  }
};

const qStr = s => JSON.stringify(s);
function emitData() {
  const head = `/* 喵站 · 英语入门（200 词）数据 · 由 dev/tools/enword-gen.js 生成，别手改
 *
 * 词表与讲解的真身在 dev/tools/enword/l01-l05.js、l06-l10.js、l11-l15.js、l16-l20.js、l21.js；
 * 改内容改那五份，再跑 \`node dev/tools/enword-gen.js\` 重生成这一份。
 * 音频在 assets/audio/words/<单词小写>.mp3，由 dev/tools/enword-tts.py 生成（IndexTTS-2.5 · voice_09）。
 * 考卷规格在 assets/data/enword-exam-data.js，出题与判分在 assets/js/exam-en.js。
 */\n`;
  const body = "window.MIAO_ENW = " + JSON.stringify(pack, null, 1) + ";\n";
  return head + body;
}
function emitExam() {
  const head = `/* 喵站 · 英语入门考卷规格 · 由 dev/tools/enword-gen.js 生成，别手改
 *
 * 每课一场（池子就是本课 10 词），第 21 课是 200 词混合大考；分值合计都验过等于 100。
 * 题型：mc 选择 / pick 听音选词 / fill 补字母 / spell 中译英默写 / match 五对连线。
 * 出题与判分在 assets/js/exam-en.js（pool=words 那一支）。
 */\n`;
  const payload = { kind: "enword", pass: 60, papers: examPapers };
  return head + "window.MIAO_ENW_EXAM = " + JSON.stringify(payload, null, 1) + ";\n";
}

if (!WRITE) {
  console.log("[体检通过] 21 章 · " + allWords.length + " 词 · " + examPapers.length + " 场考卷（--check 未写文件）");
  console.log("  章数最多 " + Math.max(...chaptersPre.map(c => c.blocks.length)) + " 块，正文最多 " +
    Math.max(...chaptersPre.map(c => bodyChars(c.blocks))) + " 字");
  process.exit(0);
}
fs.writeFileSync(path.join(DATA, "enwords-data.js"), emitData());
fs.writeFileSync(path.join(DATA, "enword-exam-data.js"), emitExam());
console.log("[已写出] frontend/assets/data/enwords-data.js（" + (emitData().length / 1024).toFixed(0) + " KB）" +
  " 与 enword-exam-data.js（" + (emitExam().length / 1024).toFixed(0) + " KB）");
console.log("  21 章 · " + allWords.length + " 词 · " + examPapers.length + " 场考卷");
console.log("  章数最多 " + Math.max(...chaptersPre.map(c => c.blocks.length)) + " 块，正文最多 " +
  Math.max(...chaptersPre.map(c => bodyChars(c.blocks))) + " 字");
