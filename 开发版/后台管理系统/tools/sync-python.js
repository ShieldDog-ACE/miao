/* 把 py-data.js 里的 Python 教程写进现有 miao.db
 *
 * 正文的唯一来源是同目录上层的 py-data.js（window.MIAO_PY.tutorial），
 * 本脚本只负责把它 upsert 进数据库，不含任何教程内容。
 *
 * 为什么需要它：教程正文存在 SQLite 里，只改 py-data.js 不会影响已入库内容。
 * 用 reset-data.sh 虽然也能生效，但会连账号、浏览记录一起清空——
 * 只想更新一门教程时，用本脚本。
 *
 * 用法：node tools/sync-python.js
 * 幂等：已存在同 id 则更新，不存在则插入；不会重复。
 */
const path = require("path");
const fs = require("fs");
const vm = require("vm");

const DIR = path.join(__dirname, "..");
const DATA = path.join(DIR, "py-data.js");
const DB = path.join(DIR, "data", "miao.db");
const WANT_CHAPTERS = 48;

function loadTutorial() {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(DATA, "utf8"), ctx, { timeout: 5000 });
  const py = ctx.window.MIAO_PY;
  if (!py || !py.tutorial) throw new Error("py-data.js 里没有 MIAO_PY.tutorial");
  return py.tutorial;
}

/* 入库前的自检：正文残缺比不更新更糟 */
function validate(tut) {
  const problems = [];
  if (tut.id !== "python") problems.push("id 应为 python，实际 " + tut.id);
  if (!Array.isArray(tut.chapters) || tut.chapters.length !== WANT_CHAPTERS) {
    problems.push("章节数应为 " + WANT_CHAPTERS + "，实际 " + (tut.chapters || []).length);
  }
  let chars = 0;
  (tut.chapters || []).forEach((c, i) => {
    if (!c.id || !c.title) problems.push(`第 ${i + 1} 章缺 id 或 title`);
    if (!Array.isArray(c.blocks) || !c.blocks.length) { problems.push(`${c.id} 没有内容块`); return; }
    c.blocks.forEach((b, j) => {
      const txt = (b.text || "") + (b.code || "") + (b.items || []).join("");
      chars += txt.length;
      if ((b.t === "p" || b.t === "h2" || b.t === "tip") && !b.text) problems.push(`${c.id} 第 ${j + 1} 块缺 text`);
      if (b.t === "code" && typeof b.code !== "string") problems.push(`${c.id} 第 ${j + 1} 块缺 code`);
      if (b.t === "img" && !/^data:image\//.test(b.src || "")) problems.push(`${c.id} 第 ${j + 1} 块 img.src 异常`);
    });
    const has = k => c.blocks.some(b => b.t === k);
    if (!c.blocks.some(b => b.t === "h2" && /任务/.test(b.text || ""))) problems.push(`${c.id} 缺「任务」小节`);
    // 四栏骨架只约束他的 l01-l45；三节准备课（s01-s03）讲装环境，没有代码演示与一句话
    if (/^l/.test(c.id)) {
      if (!has("code")) problems.push(`${c.id} 没有代码演示`);
      if (!c.blocks.some(b => b.t === "h2" && /原理/.test(b.text || ""))) problems.push(`${c.id} 缺「原理讲解」小节`);
      if (!c.blocks.some(b => b.t === "h2" && /假设它能干什么/.test(b.text || ""))) problems.push(`${c.id} 缺「假设它能干什么」小节`);
      if (!c.blocks.some(b => b.t === "tip" && /^本课一句话/.test(b.text || ""))) problems.push(`${c.id} 缺「本课一句话」收尾`);
    }
  });
  return { problems, chars };
}

function main() {
  const tut = loadTutorial();
  const { problems, chars } = validate(tut);
  if (problems.length) {
    console.error("自检未通过，已中止（不改动数据库）：");
    problems.slice(0, 20).forEach(p => console.error("  - " + p));
    if (problems.length > 20) console.error(`  …共 ${problems.length} 条`);
    process.exit(1);
  }
  let DatabaseSync;
  try { ({ DatabaseSync } = require("node:sqlite")); } catch (e) {
    console.error("需要 Node 22+ 的 node:sqlite");
    process.exit(1);
  }
  if (!fs.existsSync(DB)) {
    console.error("找不到数据库：" + DB + "（请先启动一次后端，让它自动建库并导入 seed）");
    process.exit(1);
  }

  const db = new DatabaseSync(DB);
  try {
    db.exec("PRAGMA journal_mode=WAL");
    const now = new Date().toISOString().replace("T", " ").slice(0, 19);
    const chapters = JSON.stringify(tut.chapters);
    const tags = JSON.stringify(tut.tags);
    const hit = db.prepare("SELECT id, chapters FROM tutorials WHERE id=?").get(tut.id);
    const oldLen = hit ? JSON.parse(hit.chapters || "[]").length : 0;

    if (hit) {
      /* 展示图三列用 COALESCE：数据文件写了就覆盖，没写就保留后台里老师自己设的值 */
      db.prepare("UPDATE tutorials SET title=?,intro=?,cat=?,diff=?,tags=?,author=?,chapters=?,thumb=COALESCE(?,thumb),cover=COALESCE(?,cover),hero=COALESCE(?,hero),updated=? WHERE id=?")
        .run(tut.title, tut.intro, tut.cat, tut.diff, tags, tut.author, chapters,
             tut.thumb ?? null, tut.cover ?? null, tut.hero ?? null, now, tut.id);
      console.log(`已更新教程 ${tut.id}：${oldLen} 章 → ${tut.chapters.length} 章`);
    } else {
      db.prepare("INSERT INTO tutorials (id,title,intro,cat,diff,tags,thumb,cover,hero,author,chapters,views,published,created_at,updated) VALUES (?,?,?,?,?,?,?,?,?,?,?,0,1,?,?)")
        .run(tut.id, tut.title, tut.intro, tut.cat, tut.diff, tags,
             tut.thumb || "", tut.cover || "", tut.hero || "", tut.author, chapters, Date.now(), now);
      console.log(`已插入教程 ${tut.id}：${tut.chapters.length} 章`);
    }

    const row = db.prepare("SELECT chapters, cover, updated FROM tutorials WHERE id=?").get(tut.id);
    const back = JSON.parse(row.chapters);
    const ok = back.length === WANT_CHAPTERS && back[0].id === "s01" && back[WANT_CHAPTERS - 1].id === "l45"
      && (!tut.cover || row.cover === tut.cover);
    console.log(`确认：库里 ${back.length} 章（${back[0].id}…${back[back.length - 1].id}），正文 ${chars.toLocaleString()} 字，封面=${row.cover || "无"}，updated=${row.updated}`);
    if (!ok) { console.error("回读校验失败，请检查数据库"); process.exit(1); }
  } finally {
    db.close();
  }
}

if (require.main === module) main();
module.exports = { loadTutorial, validate };
