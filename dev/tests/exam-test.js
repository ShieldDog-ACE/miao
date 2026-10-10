/* 喵站 · 课末考试回归：每道题的参考解必须过、错解必须挂、多打空格仍要过
 *
 * 三道自测对应三条需求：
 *   reference / alts 判过      → 「参考写法一定能通过」
 *   wrongs 判不过              → 「没达到目标不能蒙混」
 *   loose（多空行/多空格）判过  → 「不能因为多打一个空格就不判对」（需求 6）
 *
 * 用法：node dev/tests/exam-test.js            # 全部课
 *      node dev/tests/exam-test.js l04 l07   # 只查某几课（写题时反复跑这条）
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const DEV = path.resolve(__dirname, "..");
const GRADE = require(path.join(DEV, "frontend", "assets", "js", "exam-grade.js"));

function loadExams() {
  const ctx = { window: {} };
  vm.createContext(ctx);
  const files = [path.join(DEV, "frontend", "assets", "data", "py-exam-data.js")];
  const partDir = path.join(DEV, "frontend", "assets", "data", "exam-parts");
  if (fs.existsSync(partDir)) {
    fs.readdirSync(partDir).filter((f) => /\.js$/.test(f)).sort().forEach((f) => files.push(path.join(partDir, f)));
  }
  files.forEach((f) => {
    if (!fs.existsSync(f)) return;
    try { vm.runInContext(fs.readFileSync(f, "utf8"), ctx, { timeout: 8000 }); }
    catch (e) { console.error("⚠ 跳过解析失败的考卷文件 " + path.basename(f) + "：" + e.message); }
  });
  const bag = ctx.window.MIAO_PY_EXAM || { exams: {} };
  const ex = Object.assign({}, bag.exams || {});
  /* 分片文件把题目 push 进 MIAO_PY_EXAM_PARTS；后端 db.readExamData() 同样按 exam-parts/*.js 直接合并，
     所以分片就是正式形态，不需要再并回主文件（一门课一片，改哪课只碰哪片） */
  (ctx.window.MIAO_PY_EXAM_PARTS || []).forEach((e) => { if (e && e.cid) ex[e.cid] = e; });
  return ex;
}

function main() {
  const only = process.argv.slice(2);
  const exams = loadExams();
  const ids = Object.keys(exams).filter((k) => !only.length || only.indexOf(k) >= 0)
    .sort((a, b) => (/^l/.test(a) && /^l/.test(b) ? Number(a.slice(1)) - Number(b.slice(1)) : a < b ? -1 : 1));
  if (!ids.length) { console.error("没有找到考试数据（检查 dev/frontend/assets/data/py-exam-data.js）"); process.exit(1); }
  let pass = 0, fail = 0, enBad = 0;
  const problems = [];
  ids.forEach((id) => {
    const e = exams[id];
    const errs = [];
    /* 契约自检 */
    const sum = (e.checks || []).reduce((a, c) => a + (c.weight || 0), 0);
    if (sum !== 100) errs.push(`权重相加 ${sum}，要求正好 100`);
    if (!e.checks || !e.checks.length) errs.push("没有 checks");
    if (!e.task) errs.push("没有 task");
    if (!e.reference) errs.push("没有 reference");
    const floorSum = (e.checks || []).filter((c) => ["run-ok", "no-error", "lines-at-least"].indexOf(c.type) >= 0)
      .reduce((a, c) => a + c.weight, 0);
    if (floorSum > 45) errs.push(`地板项（跑通/无报错）合计 ${floorSum} 分，超过 45 —— 光跑通就能及格了`);

    const judge = (code) => {
      try { return GRADE.grade(e, code || ""); }
      catch (err) { return { passed: false, score: 0, err: err.message, checks: [] }; }
    };
    const ref = judge(e.reference);
    if (!ref.passed) errs.push("参考解没过（" + ref.score + "分）：" + failing(ref));
    (e.alts || []).forEach((a, i) => {
      const r = judge(a);
      if (!r.passed) errs.push(`合法写法 #${i + 1} 没过（${r.score}分）：` + failing(r));
    });
    (e.loose || []).forEach((a, i) => {
      const r = judge(a);
      if (!r.passed) errs.push(`宽松写法 #${i + 1}（多空格/多空行）没过（${r.score}分）：` + failing(r));
    });
    (e.wrongs || []).forEach((a, i) => {
      const r = judge(a);
      if (r.passed) errs.push(`错解 #${i + 1} 竟然过了（${r.score}分）：` + JSON.stringify(a.slice(0, 50)));
    });
    if (errs.length) { fail++; problems.push({ id, errs }); }
    else pass++;
  });
  function failing(r) {
    const bad = (r.checks || []).filter((c) => !c.ok);
    return bad.map((c) => c.label + " → " + c.saw).join("；") || r.err || "";
  }
  console.log(`考试自测：${ids.length} 道题 · 通过 ${pass} · 有问题 ${fail}`);
  problems.forEach((p) => {
    console.log(`--- ${p.id}《${exams[p.id].task}》`);
    p.errs.slice(0, 6).forEach((m) => console.log("    " + m));
  });
  if (!only.length) {
    const need = 45;
    console.log(`已建题数 ${ids.length}/${need}，缺：` + missing(ids).join(" "));
    enBad = englishReport();
  }
  const total = fail + (only.length ? 0 : enBad);
  console.log(total === 0 ? "考卷自测全部通过 ✔" : `考卷有问题 ${total} 处 ✘`);
  process.exit(total === 0 ? 0 : 1);
}
/* ---------------- 英语卷：题量、分值、判分开箱检查 ---------------- */
function englishChecks() {
  const path2 = path;
  const EN = require(path2.join(DEV, "frontend", "assets", "js", "exam-en.js"));
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path2.join(DEV, "frontend", "assets", "data", "en-data.js"), "utf8"), ctx, { timeout: 9000 });
  const vm2 = ctx.window.MIAO_EN;
  const ctx2 = { window: {} };
  vm.createContext(ctx2);
  vm.runInContext(fs.readFileSync(path2.join(DEV, "frontend", "assets", "data", "en-exam-data.js"), "utf8"), ctx2, { timeout: 9000 });
  const spec = ctx2.window.MIAO_EN_EXAM;
  if (!spec) throw new Error("en-exam-data.js 里没有 MIAO_EN_EXAM");
  const pools = { letters: EN.letterPool(vm2.letters), phonemes: EN.phonemePool(vm2.phonemes) };
  const out = [];
  spec.exams.forEach((e) => {
    const qs = EN.buildPaper({ pool: e.pool, counts: spec.counts, weights: spec.weights }, pools);
    const kinds = { mc: 0, pick: 0, write: 0, match: 0 };
    let full = 0;
    qs.forEach((q) => {
      kinds[q.type]++;
      full += q.type === "match" ? Object.keys(q.answer).length * q.weight : q.weight;
    });
    /* 满分答案 */
    const perfect = qs.map((q) => {
      if (q.type === "mc" || q.type === "pick") return q.answer;
      if (q.type === "write") return q.answer;
      const m = {}; Object.keys(q.answer).forEach((l) => { m[l] = q.answer[l]; }); return m;
    });
    const rFull = EN.gradeEN(qs, perfect);
    const rEmpty = EN.gradeEN(qs, qs.map(() => null));
    /* 听写大小写宽松：小写字母也算对 */
    const lower = qs.map((q, i) => (q.type === "write" ? String(q.answer).toLowerCase() : perfect[i]));
    const rLower = EN.gradeEN(qs, lower);
    /* 勾线部分给分：只连对一半时按对数给 */
    const halfMatch = qs.map((q, i) => {
      if (q.type !== "match") return perfect[i];
      const keys = Object.keys(q.answer), m = {};
      keys.slice(0, Math.ceil(keys.length / 2)).forEach((l) => { m[l] = q.answer[l]; });
      return m;
    });
    const rHalf = EN.gradeEN(qs, halfMatch);
    const bad = { ok: true, why: "" };
    if (kinds.mc !== spec.counts.mc) bad.why += `选择题 ${kinds.mc} ≠ ${spec.counts.mc}；`;
    if (kinds.pick !== spec.counts.listenPick) bad.why += `听力选 ${kinds.pick} ≠ ${spec.counts.listenPick}；`;
    if (kinds.write !== spec.counts.listenWrite) bad.why += `听写 ${kinds.write} ≠ ${spec.counts.listenWrite}；`;
    if (kinds.match !== spec.counts.match) bad.why += `勾线组 ${kinds.match} ≠ ${spec.counts.match}；`;
    if (full !== 100) bad.why += `满分 ${full} ≠ 100；`;
    if (rFull.score !== 100) bad.why += `全对只有 ${rFull.score} 分；`;
    if (rEmpty.score !== 0 || rEmpty.passed) bad.why += `空卷得分 ${rEmpty.score}；`;
    if (rLower.score !== 100) bad.why += `听写小写没放过（${rLower.score} 分）；`;
    if (rHalf.passed !== (rHalf.score >= spec.pass)) bad.why += "勾线部分给分与通过线不自洽；";
    out.push({
      cid: e.cid, 题数: qs.length, 满分: full, 分布: `选择${kinds.mc}/听选${kinds.pick}/听写${kinds.write}/勾线${kinds.match}`,
      全对: rFull.score, 空卷: rEmpty.score, 半对勾线: rHalf.score, 结论: bad.why ? "✗ " + bad.why : "✓"
    });
  });
  return out;
}

function englishReport() {
  try {
    const rows = englishChecks();
    let bad = 0;
    console.log("\n英语卷出题检查（题量口径：" + JSON.stringify({ 选择: 10, 听力选: 5, 听写: 5, 勾线组: 5 }) + "）");
    rows.forEach((r) => {
      console.log(`  ${r.cid} · ${r.题数} 题 · ${r.分布} · 满分 ${r.满分} · 全对 ${r.全对} · 空卷 ${r.空卷} · 勾线半对 ${r.半对勾线} · ${r.结论}`);
      if (String(r.结论).charAt(0) === "✗") bad++;
    });
    return bad;
  } catch (e) {
    console.log("\n英语卷检查没跑成：" + (e && e.message));
    return 1;
  }
}
function missing(ids) {
  const have = new Set(ids);
  const out = [];
  for (let i = 1; i <= 45; i++) { const k = "l" + (i < 10 ? "0" + i : i); if (!have.has(k)) out.push(k); }
  return out;
}
main();
