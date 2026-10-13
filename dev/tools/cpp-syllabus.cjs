/* 喵站 · C++ 源稿课表解析器（第九轮 T-18）
 *
 * 输入：学习资料/C++入门/ 下 213 份 .cpp，每份格式：
 *   //任务名 N 标题（可带 L 分组标注）
 *   //要求 一句话
 *   … 代码 …
 *   //【这是什么】/【一句话原理】/【重点提醒】 等讲解段
 *   //【任务】
 *   //1. …
 *   //2. …
 *
 * 输出：dev/tools/cpp/syllabus.json
 *   { generated, dir, count, lessons: [ { n, file, title, req, group, tasks: [..], taskCount } ] }
 *
 * 用途：
 *   1. 派代理时的课号清单与互斥号段；
 *   2. exam-check 的「任务全覆盖」判据（每份源稿的每条任务都要在考卷里有一条题对着它）；
 *   3. cpp-audit 的构造首现闸（TEACH_AT）按这个课表推。
 */
const fs = require("fs");
const path = require("path");

const SRC = "/run/media/fuka/99180618-d058-4083-83ed-c54d33771da1/学习资料/C++入门";
const OUT = path.join(__dirname, "cpp", "syllabus.json");

const files = fs.readdirSync(SRC).filter(f => f.endsWith(".cpp"));
const lessons = [];
for (const f of files) {
  const m = /^(\d+)_/.exec(f);
  if (!m) throw new Error("文件名没有课号前缀：" + f);
  const n = Number(m[1]);
  const text = fs.readFileSync(path.join(SRC, f), "utf8");
  const lines = text.split("\n");

  // 标题：第一条 //任务名 行
  let title = "", req = "", group = "";
  for (const ln of lines) {
    const t = /^\/\/任务名\s*\d*\s*(.*)$/.exec(ln.trim());
    if (t && !title) { title = t[1].trim(); continue; }
    const r = /^\/\/要求\s*(.*)$/.exec(ln.trim());
    if (r && !req) { req = r[1].trim(); continue; }
    if (title && req) break;
  }
  const g = /（(L\d+-\d+[^）]*)）/.exec(title);
  if (g) group = g[1];

  // 任务段：//【任务】 之后所有 //数字. 开头的行（可能折行——后续不以 //N. 开头的 // 行并入上一条）
  const tasks = [];
  let inTasks = false, cur = null;
  for (const raw of lines) {
    const ln = raw.replace(/\r$/, "");
    if (/^\/\/\s*【任务/.test(ln)) { inTasks = true; continue; }
    if (/^\/\/\s*【/.test(ln) && inTasks) break; // 任务段结束（遇到下一个【段】）
    if (!inTasks) continue;
    if (!/^\/\//.test(ln)) continue;
    const body = ln.replace(/^\/\/\s?/, "").trim();
    if (!body) continue;
    const item = /^(\d+)[.、．]\s*(.*)$/.exec(body);
    if (item) { cur = item[2].trim(); tasks.push(cur); }
    else if (cur !== null) { cur += body; tasks[tasks.length - 1] = cur; }
  }

  // 第 1 课没有【任务】段，它的「//要求」本身就是那一条任务 —— 兜底补上，别让任务全覆盖闸空转
  if (!tasks.length && req) tasks.push(req);

  lessons.push({ n, file: f, title: title || f.replace(/\.cpp$/, "").replace(/^\d+_/, ""), req, group, tasks, taskCount: tasks.length });
}
lessons.sort((a, b) => a.n - b.n);

// 体检：课号 1..213 连续、无缺号、每课至少一条任务
const ns = lessons.map(l => l.n);
for (let i = 0; i < ns.length; i++) {
  if (ns[i] !== i + 1) throw new Error("课号断裂：第 " + (i + 1) + " 个位置是课 " + ns[i]);
}
const noTasks = lessons.filter(l => l.taskCount === 0).map(l => l.n);
const dup = ns.length !== new Set(ns).size;

const out = { generated: new Date().toISOString(), dir: SRC, count: lessons.length, noTasks, dup, lessons };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1), "utf8");

const withTasks = lessons.filter(l => l.taskCount > 0).length;
const dist = {};
lessons.forEach(l => { dist[l.taskCount] = (dist[l.taskCount] || 0) + 1; });
console.log("[课表] " + lessons.length + " 课 · 有任务 " + withTasks + " 课 · 任务数分布 " + JSON.stringify(dist));
if (noTasks.length) console.log("[课表] 没解析出任务的课：" + noTasks.join(","));
console.log("[课表] 输出 → " + OUT);
