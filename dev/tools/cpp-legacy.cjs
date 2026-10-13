/* 喵站 · C++ 双课骨架生成器（第九轮 T-22）
 *
 * 读 tools/cpp/syllabus.json（213 课课表），产出两份「占位正文」：
 *   frontend/assets/data/cpp/legacy.js    → window.MIAO_CPP_LEGACY  = { chapters: c01…c81  }
 *   frontend/assets/data/cppm/legacy.js   → window.MIAO_CPPM_LEGACY = { chapters: m82…m213 }
 *
 * 为什么要有占位：量产正文按批落盘（每批一个 pNN.js），批与批之间站点必须始终是
 * 完整的两门课 —— 占位章显示标题与本课任务清单，正文块只有一条「还在写」的说明，
 * 一眼能分清哪些是真内容、哪些是占位（不许拿骨架当进度）。
 * 正文分部写完一批，装配层（cpp-data.js / cppm-data.js）就按章 id 用新稿顶掉占位。
 *
 * 跑法：node dev/tools/cpp-legacy.cjs        （每次重生成，可反复跑，幂等）
 */
const fs = require("fs");
const path = require("path");

const DEV = path.resolve(__dirname, "..");
const DATA = path.join(DEV, "frontend", "assets", "data");
const syllabus = JSON.parse(fs.readFileSync(path.join(__dirname, "cpp", "syllabus.json"), "utf8"));

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const bt = s => String(s).replace(/`/g, "＼`"); // 正文里不许出现反引号（分部文件用反引号做字符串分隔符），占位清单同样守这条

function chapterOf(lesson) {
  const isEntry = lesson.n <= 81;
  const cid = isEntry ? "c" + String(lesson.n).padStart(2, "0") : "m" + lesson.n;
  const tasks = lesson.tasks.map(t => bt(t));
  const blocks = [
    { t: "tip", color: "amber", text: "这一课的正文还在写，写完会自动换掉这段说明。下面的任务清单来自他的源稿，考试也会从这里出。" },
    { t: "h2", text: "任务（预告）" },
    { t: "ul", items: tasks }
  ];
  return { id: cid, title: "第 " + lesson.n + " 课 · " + bt(lesson.title), blocks, placeholder: true, src: lesson.file };
}

const entry = syllabus.lessons.filter(l => l.n <= 81).map(chapterOf);
const mastery = syllabus.lessons.filter(l => l.n > 81).map(chapterOf);

function emit(file, varName, course, chapters) {
  const head =
    "/* 喵站 · " + course + " 占位正文（由 dev/tools/cpp-legacy.cjs 生成，别手改）\n" +
    " *\n" + " * 每章只有任务预告一条真内容，正文块是「还在写」的说明；真正文在 data 分部里，\n" +
    " * 装配层按章 id 用新稿顶掉这里的占位。改任务清单请改源稿与 tools/cpp/syllabus.json，重跑生成器。\n" +
    " */\n" +
    "window." + varName + " = {\n  chapters: [\n";
  const body = chapters.map(c =>
    "    {\n" +
    "      id: `" + c.id + "`, title: `" + c.title + "`,\n" +
    "      blocks: [\n" +
    c.blocks.map(b => {
      if (b.t === "tip") return "        { t: `tip`, color: `amber`, text: `" + b.text + "` },";
      if (b.t === "h2") return "        { t: `h2`, text: `" + b.text + "` },";
      return "        { t: `ul`, items: [\n" + b.items.map(x => "          `" + x + "`").join(",\n") + "\n        ] },";
    }).join("\n") + "\n" +
    "      ]\n" +
    "    }"
  ).join(",\n");
  fs.writeFileSync(path.join(DATA, file), head + body + "\n  ]\n};\n", "utf8");
  console.log("[骨架] " + file + " → " + chapters.length + " 章");
}

fs.mkdirSync(path.join(DATA, "cpp"), { recursive: true });
fs.mkdirSync(path.join(DATA, "cppm"), { recursive: true });
emit(path.join("cpp", "legacy.js"), "MIAO_CPP_LEGACY", "C++ 入门（c01–c81）", entry);
emit(path.join("cppm", "legacy.js"), "MIAO_CPPM_LEGACY", "C++ 掌握（m82–m213）", mastery);
console.log("[骨架] 占位章 " + (entry.length + mastery.length) + " 个，等正文分部顶掉");
