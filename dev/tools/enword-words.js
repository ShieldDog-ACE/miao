/* 喵站 · 英语入门 · 词表导出（给 TTS 与生成器共用）
 *
 * 读 dev/tools/enword/l*.js 六份原稿 → 吐一份 JSON：
 *   /tmp/miao-tts/enwords.json      全词表 + 整句清单 + 课程与课时结构（音频脚本共读一份）
 *   标准输出打印统计（词数、去重后词数、重复的词、音标字符表）
 * 跑法：node dev/tools/enword-words.js [输出路径]
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const SRC = path.join(__dirname, "enword");
const OUT = process.argv[2] || "/tmp/miao-tts/enwords.json";

const ctx = { window: {}, console: { log: () => {}, error: console.error, warn: console.warn } };
ctx.self = ctx.window;
ctx.globalThis = ctx.window;
vm.createContext(ctx);

const files = fs.readdirSync(SRC).filter(f => /^l\d\d(-l\d\d)?\.js$/.test(f)).sort();
if (files.length !== 6) {
  console.error("[词表] 原稿应是 6 份（l01-l05 / l06-l10 / l11-l15 / l16-l20 / l21 / l22），实到 " + files.length + " 份：" + files.join(" "));
  process.exit(1);
}
for (const f of files) {
  vm.runInContext(fs.readFileSync(path.join(SRC, f), "utf8"), ctx, { timeout: 20000, filename: f });
}

const src = ctx.window.MIAO_ENW_SRC || {};
const ids = Object.keys(src).sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));

const lessons = [];
const dup = [];
const seen = {};
for (const id of ids) {
  const L = src[id];
  const no = Number(id.slice(1));
  /* 结课总复习课（l22）不教新词，words 是空的，不进词表 */
  if (!L.words || L.words.length === 0) continue;
  if (L.words.length < 10) {
    console.error("[词表] " + id + " 的 words 只有 " + L.words.length + " 条，至少要 10 条");
    process.exit(1);
  }
  for (const w of L.words) {
    const k = w.w.toLowerCase();
    if (seen[k]) dup.push(k + "（第 " + seen[k] + " 课与第 " + no + " 课）");
    seen[k] = no;
  }
  lessons.push({ id, no, title: L.title, goal: L.goal, one: L.one, read: L.read, memo: L.memo, trap: L.trap, task: L.task, words: L.words });
}
if (dup.length) {
  console.error("[词表] 有重复单词，必须改词：\n  - " + dup.join("\n  - "));
  process.exit(1);
}
if (lessons.length !== 21) {
  console.error("[词表] 教词的课时应是 21 课（l22 是结课复习，不算），实到 " + lessons.length);
  process.exit(1);
}

const words = [];
for (const L of lessons) for (const w of L.words) words.push(Object.assign({ lesson: L.id, no: L.no }, w));

/* 整句清单：每个词配一句（键 = 单词小写，对应 assets/audio/sents/<键>.mp3）。
   念的文本优先用原稿的 phsay（代码句像 print("hello") 用它给一个能念的版本），默认就是 ph。 */
const sents = words.map(w => ({ no: w.no, lesson: w.lesson, key: w.w.toLowerCase(), text: w.phsay || w.ph }));

const ipaChars = Array.from(new Set(words.map(w => w.ipa).join("").replace(/[\/\[\]]/g, "").split(""))).sort();

const payload = { lessons, words, sents };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(payload, null, 1));

console.log("[词表] 课时 " + lessons.length + " · 单词 " + words.length + " · 整句 " + sents.length + " · 无重复");
console.log("[词表] 音标用到的字符（" + ipaChars.length + " 个）：" + ipaChars.join(" "));
console.log("[词表] 已写出 " + OUT);
