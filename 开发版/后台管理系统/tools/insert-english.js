/* 把 en-data.js 里的英语教程写进现有 miao.db
 *
 * 英语数据与教程正文的唯一来源是同目录的 en-data.js（window.MIAO_EN.tutorial），
 * 本脚本只负责把它 upsert 进数据库，不含任何教程内容。
 *
 * 用法：node tools/insert-english.js
 * 幂等：已存在同 id 则更新，不存在则插入；不会重复。
 */
const path = require("path");
const fs = require("fs");
const vm = require("vm");

const DIR = path.join(__dirname, "..");
const EN = path.join(DIR, "en-data.js");
const DB = path.join(DIR, "data", "miao.db");

/* 从 en-data.js 取教程对象 */
function loadTutorial() {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(EN, "utf8"), ctx, { timeout: 5000 });
  const en = ctx.window.MIAO_EN;
  if (!en || !en.tutorial) throw new Error("en-data.js 里没有 MIAO_EN.tutorial");
  return en.tutorial;
}

function main() {
  const tut = loadTutorial();
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
    const ts = Date.now();
    const chapters = JSON.stringify(tut.chapters);
    const tags = JSON.stringify(tut.tags);
    const hit = db.prepare("SELECT id FROM tutorials WHERE id=?").get(tut.id);

    if (hit) {
      /* 展示图三列用 COALESCE：数据文件写了就覆盖，没写就保留后台里老师自己设的值 */
      db.prepare("UPDATE tutorials SET title=?,intro=?,cat=?,diff=?,tags=?,author=?,chapters=?,thumb=COALESCE(?,thumb),cover=COALESCE(?,cover),hero=COALESCE(?,hero),updated=? WHERE id=?")
        .run(tut.title, tut.intro, tut.cat, tut.diff, tags, tut.author, chapters,
             tut.thumb ?? null, tut.cover ?? null, tut.hero ?? null, now, tut.id);
      console.log("已更新教程：" + tut.id);
    } else {
      db.prepare("INSERT INTO tutorials (id,title,intro,cat,diff,tags,thumb,cover,hero,author,chapters,views,published,created_at,updated) VALUES (?,?,?,?,?,?,?,?,?,?,?,0,1,?,?)")
        .run(tut.id, tut.title, tut.intro, tut.cat, tut.diff, tags,
             tut.thumb || "", tut.cover || "", tut.hero || "", tut.author, chapters, ts, now);
      console.log("已插入教程：" + tut.id);
    }
    const n = db.prepare("SELECT count(*) c FROM tutorials WHERE id=?").get(tut.id).c;
    const ch = db.prepare("SELECT chapters, cover FROM tutorials WHERE id=?").get(tut.id);
    const parsed = JSON.parse(ch.chapters);
    console.log("确认：english " + n + " 条，" + parsed.length + " 章，封面=" + (ch.cover || "无"));
    if (n !== 1 || parsed.length !== 3 || (tut.cover && ch.cover !== tut.cover)) {
      console.error("自检失败，请检查 en-data.js");
      process.exit(1);
    }
  } finally {
    db.close();
  }
}

if (require.main === module) main();
module.exports = { loadTutorial };
