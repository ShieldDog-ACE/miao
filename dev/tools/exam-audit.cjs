/* 喵站 · 考卷审计闸（第四轮 T-12 的验收工具）
 *
 * 正文过了闸不算完：**考题的 task/hint/reference/alts/loose 同样是给读者看的代码**。
 * 这里按 §11.6.2 的累积白名单检查每场考试：
 *   A 题面与参考解里不许出现「本课还没教」的构造（考点本身除外 —— 本课教的就是它）
 *   B task/hint/reference 文本里不许出现指向后面课号的交叉引用
 *   C 「椰子蛋 / 管理」这两个旧梗必须 0 处
 *   D 权重和必须 100、pass 必须是 60（沿用 D-13）
 *
 * 用法：node dev/tools/exam-audit.cjs            # 查全部 45 场
 *      node dev/tools/exam-audit.cjs l03 l17   # 只查指定课
 * 退出码：0 干净，1 有违规。
 */
const path = require("path");
const fs = require("fs");

const DEV = path.resolve(__dirname, "..");
const AUD = require("./lesson-audit.cjs");   // 复用同一份白名单与检测器，避免两套口径

function collect() {
  const vm = require("vm");
  const files = ["py-exam-data.js", "exam-parts/l04-l10.js", "exam-parts/l11-l17.js",
    "exam-parts/l18-l24.js", "exam-parts/l25-l31.js", "exam-parts/l32-l38.js", "exam-parts/l39-l45.js"]
    .map(f => path.join(DEV, "frontend", "assets", "data", f));
  const c = { window: {}, console: { error() {} } };
  c.self = c.window;
  vm.createContext(c);
  files.forEach(f => vm.runInContext(fs.readFileSync(f, "utf8"), c, { timeout: 20000, filename: f }));
  /* 主文件挂 window.MIAO_PY_EXAM = { pass, exams: { l01, l02, l03 } }；
     分片文件各自 window.MIAO_PY_EXAM_PARTS.push(一场或多场) */
  const out = {};
  const main = c.window.MIAO_PY_EXAM;
  if (main && main.exams) Object.assign(out, main.exams);
  (c.window.MIAO_PY_EXAM_PARTS || []).forEach(function (e) {
    if (e && e.cid) out[e.cid] = e;
    else if (e) Object.keys(e).forEach(k => { if (/^l\d\d$/.test(k)) out[k] = e[k]; });
  });
  return out;
}

/* 读者看得见的字段：题面、提示、编辑器预填骨架、通过后展示的参考解、判定清单上的人话、虚拟文件内容。
   alts / wrongs / loose 只喂给判分器自测，读者永远看不到 —— 它们**允许**用后面的写法（本来就是「别的写法 / 错解」），
   所以单独一档只报数字，不算违规。把两种混在一起判，就会拿自测样例当教材开火。 */
function visibleTexts(e) {
  const s = [e.title || "", e.task || "", e.hint || "", e.starter || "", e.reference || ""];
  (e.checks || []).forEach(c => { s.push(String(c.text || "")); s.push(String(c.has || "")); s.push(String(c.name || "")); });
  Object.keys(e.files || {}).forEach(f => { s.push(f); s.push(String(e.files[f])); });
  (e.stdin || []).forEach(x => s.push(String(x)));
  return s.join("\n");
}
function examTexts(e) {
  const s = [visibleTexts(e)];
  (e.alts || []).forEach(x => s.push(x));
  (e.wrongs || []).forEach(x => s.push(x));
  (e.loose || []).forEach(x => s.push(x));
  return s.join("\n");
}

function main() {
  const only = process.argv.slice(2);
  const exams = collect();
  const ids = Object.keys(exams).sort();
  if (!ids.length) { console.error("没收到任何考卷数据（window 上的挂法变了，改 collect()）"); process.exit(2); }
  const teach = AUD.TEACH_AT, detect = AUD.DETECT, ban = AUD.BAN_WORDS;
  const bad = { feat: [], ref: [], ban: [], weight: [], missing: [] };
  let testOnly = 0;
  const want = ids.filter(id => !only.length || only.indexOf(id) >= 0);

  want.forEach(function (id) {
    const e = exams[id];
    const no = parseInt(id.slice(1), 10);
    const txt = visibleTexts(e);
    if (!e.reference) bad.missing.push(id + " 没有 reference（判分器自测没法定）");
    const sum = (e.checks || []).reduce((s, c) => s + (c.weight || 0), 0);
    if (sum !== 100) bad.weight.push(id + " 权重和 = " + sum + "（要正好 100）");
    for (const w of ban) { const n = txt.split(w).length - 1; if (n) bad.ban.push(id + " 「" + w + "」×" + n); }
    for (const m of txt.matchAll(/第\s*(\d+)\s*课/g)) if (+m[1] > no) bad.ref.push(id + " → 第" + m[1] + " 课：" + txt.slice(Math.max(0, m.index - 25), m.index + 25).replace(/\n/g, " "));
    /* 构造：考点就是本课教的那个，所以「等于本课课号」放行；晚于本课的不放行 */
    for (const [feat, re] of detect) {
      if (!re || !re.test(txt)) continue;
      const t = teach[feat];
      if (t === null || t === undefined) bad.feat.push(id + " 题面/参考解用了站内不教的构造：" + feat);
      else if (t > no) bad.feat.push(id + " 第 " + no + " 课的题面或参考解用了第 " + t + " 课才教的 " + feat);
    }
    /* 只喂自测的 alts/wrongs/loose 允许用后面的写法，只统计条数给个人数看 */
    const all = examTexts(e);
    for (const [feat, re] of detect) {
      if (!re) continue;
      const t = teach[feat];
      if ((t === null || t > no) && re.test(all) && !re.test(txt)) testOnly++;
    }
  });

  const miss = [];
  for (let i = 1; i <= 45; i++) { const id = "l" + String(i).padStart(2, "0"); if (!exams[id]) miss.push(id); }
  console.log("考卷审计：" + want.length + " 场（站内共收到 " + ids.length + " 场）· 白名单构造 " + Object.keys(teach).length + " 项");
  ["ban", "ref", "feat", "weight", "missing"].forEach(function (k) {
    console.log("  " + k + " 违规 " + bad[k].length + " 处");
    bad[k].slice(0, 14).forEach(x => console.log("     " + x));
  });
  if (miss.length) console.log("  缺考卷的课：" + miss.join(" "));
  console.log("  （只喂判分器自测的 alts/wrongs/loose 里用了更晚写法：" + testOnly + " 处，不计违规）");
  const total = Object.values(bad).reduce((s, a) => s + a.length, 0) + miss.length;
  console.log("\n违规合计 " + total + " 处" + (total ? " ✘" : " ✔"));
  process.exit(total ? 1 : 0);
}
main();
