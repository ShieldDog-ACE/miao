/* 喵站 · 考试 · 算法题库回归（Node 侧，不碰 DOM）
 *
 * 查四件事：
 *   1. 数据形状：id / 题号 / 难度 / 分类 / 函数名 / 样例数 / 用例 / 参考解，逐条查；
 *   2. 参考解：每道题的参考解必须把全部用例跑过（不是「应该能过」）；
 *   3. 骨架：starter 原样交卷必须过不了，防止哪道题白送；
 *   4. 判分器：JSON 深比较、Python 实参转写、内存估算与错误分支各有一组小用例。
 *
 * 跑法：node dev/tests/algo-test.js
 */
"use strict";

global.window = global;
require("../frontend/assets/js/py-engine.js");
require("../frontend/assets/js/py-runtime.js");
require("../frontend/assets/js/py-builtin.js");
require("../frontend/assets/js/py-stdlib.js");
require("../frontend/assets/data/algo-exam-data.js");
require("../frontend/assets/js/algo-judge.js");

var DATA = global.MIAO_ALGO;
var JUDGE = global.MIAO_ALGO_JUDGE;
var fails = [], passes = 0;
function ok(name, cond, detail) {
  if (cond) { passes++; return; }
  fails.push(name + (detail ? " — " + detail : ""));
}

ok("题库数据挂上了", !!(DATA && Array.isArray(DATA.problems)), DATA ? typeof DATA.problems : "MIAO_ALGO 不在");
ok("判分器挂上了", !!(JUDGE && typeof JUDGE.run === "function"), JUDGE ? typeof JUDGE.run : "MIAO_ALGO_JUDGE 不在");

var problems = (DATA && DATA.problems) || [];
var ids = {}, nos = {};
var DIFF = { "简单": 1, "中等": 1, "困难": 1 };
var totalCases = 0;

problems.forEach(function (p) {
  var tag = p.id || "(没有 id)";
  ok("[" + tag + "] id 合法（小写字母 / 数字 / 短横线）", /^[a-z0-9-]+$/.test(p.id || ""), p.id);
  ok("[" + tag + "] id 唯一", !ids[p.id], ids[p.id] ? "和第 " + ids[p.id] + " 题撞了" : "");
  ids[p.id] = p.no;
  ok("[" + tag + "] 题号是正整数且唯一", Number.isInteger(p.no) && p.no > 0 && !nos[p.no], String(p.no));
  nos[p.no] = true;
  ok("[" + tag + "] 难度只有三档", !!DIFF[p.difficulty], p.difficulty);
  ok("[" + tag + "] 历史 lang 是允许的五个之一（python3 / c / c++ / ts / java）",
    ["python3", "c", "c++", "ts", "java"].indexOf(p.lang) >= 0, p.lang);
  ok("[" + tag + "] 题型是允许的九类之一（数组 / 哈希表 / 数学 / 栈 / 双指针 / 二分查找 / 动态规划 / 滑动窗口 / 排序）",
    ["数组", "哈希表", "数学", "栈", "双指针", "二分查找", "动态规划", "滑动窗口", "排序"].indexOf(p.topic) >= 0, p.topic);
  ok("[" + tag + "] 函数名是合法 Python 标识符", /^[a-z_][a-z0-9_]*$/.test(p.fn || ""), p.fn);
  ok("[" + tag + "] 有题面", Array.isArray(p.statement) && p.statement.length >= 2, String((p.statement || []).length));
  ok("[" + tag + "] 有 starter", typeof p.starter === "string" && p.starter.indexOf("def " + p.fn) >= 0, p.starter);
  ok("[" + tag + "] 有参考解", typeof p.reference === "string" && p.reference.indexOf("def " + p.fn) >= 0);
  ok("[" + tag + "] 样例数在用例范围内", Number.isInteger(p.samples) && p.samples >= 1 && p.samples < p.tests.length, String(p.samples) + "/" + p.tests.length);
  ok("[" + tag + "] 至少 4 条用例", Array.isArray(p.tests) && p.tests.length >= 4, String((p.tests || []).length));
  totalCases += (p.tests || []).length;

  (p.tests || []).forEach(function (t, i) {
    ok("[" + tag + "] 用例 " + (i + 1) + " 有 args 与 expect", !!t && Array.isArray(t.args) && t.expect !== undefined);
    try { JUDGE.pyLit(t.args); }
    catch (e) { ok("[" + tag + "] 用例 " + (i + 1) + " 实参可转成 Python", false, e.message); }
  });

  var ref = JUDGE.run(p, p.reference, {});
  ok("[" + tag + "] 参考解全过（" + ref.passedCount + "/" + ref.total + "）", ref.passed && !ref.fatal,
    ref.fatal || (ref.cases.filter(function (c) { return !c.ok; })[0] || {}).error || "");
  ok("[" + tag + "] 参考解有真实用时", ref.ms >= 0 && Number.isFinite(ref.ms), String(ref.ms));
  ok("[" + tag + "] 参考解有内存估算", ref.memoryBytes >= 1024 && /KB|MB/.test(ref.memoryText || ""), ref.memoryText);

  var sample = JUDGE.run(p, p.reference, { samplesOnly: true });
  ok("[" + tag + "] 参考解跑样例也全过", sample.passed && !sample.fatal && sample.total === p.samples, sample.passedCount + "/" + sample.total);

  var base = JUDGE.run(p, p.starter, { samplesOnly: true });
  ok("[" + tag + "] 骨架单独跑样例过不了", !base.passed, base.passedCount + "/" + base.total);
});

ok("题号从 1 连到 " + problems.length + "，没有断号", problems.every(function (p, i) { return p.no === i + 1; }),
  problems.map(function (p) { return p.no; }).join(","));
ok("三道难度都有题", ["简单", "中等", "困难"].every(function (d) { return problems.some(function (p) { return p.difficulty === d; }); }),
  JSON.stringify(problems.reduce(function (a, p) { a[p.difficulty] = (a[p.difficulty] || 0) + 1; return a; }, {})));
ok("总用例数够撑起一次提交", totalCases >= 50, String(totalCases));

/* ---------- 判分器自己的小用例 ---------- */
ok("pyLit：数字 / 文本 / 布尔 / None / 数组",
  JUDGE.pyLit([1, "a\"b", true, false, null, [2, 3]]) === '[1, "a\\"b", True, False, None, [2, 3]]',
  JUDGE.pyLit([1, "a\"b", true, false, null, [2, 3]]));
ok("deepEq：数组逐项比，顺序有关",
  JUDGE.deepEq([[1, 2], [3]], [[1, 2], [3]]) && !JUDGE.deepEq([1, 2], [2, 1]));
ok("deepEq：布尔和数字不混为一谈", !JUDGE.deepEq(true, 1) && JUDGE.deepEq(1, 1));
ok("deepEq：None 只等于 None", JUDGE.deepEq(null, null) && !JUDGE.deepEq(null, 0));
ok("memoryText：KB / MB 两档", JUDGE.memoryText(2048) === "2 KB" && /MB$/.test(JUDGE.memoryText(2 * 1024 * 1024)),
  JUDGE.memoryText(2048) + " / " + JUDGE.memoryText(2 * 1024 * 1024));

var syntax = JUDGE.run(problems[0], "def two_sum(nums, target)\n    return []\n", { samplesOnly: true });
ok("语法错误会被当成致命错误报出来，不静默判 0", !!syntax.fatal && /SyntaxError/.test(syntax.fatal), syntax.fatal);

var missing = JUDGE.run(problems[0], "def other(nums, target):\n    return []\n", { samplesOnly: true });
ok("函数名写错会报「函数里抛了异常」，用例判错", !missing.passed && /not defined|未定义|NameError/.test((missing.cases[0] || {}).error || ""),
  (missing.cases[0] || {}).error);

var wrong = JUDGE.run(problems[0], "def two_sum(nums, target):\n    return [0, 0]\n", {});
ok("明显错解不会通过", !wrong.passed && wrong.passedCount === 0, wrong.passedCount + "/" + wrong.total);
ok("明显错解会留下逐条结果", wrong.cases.length === wrong.total && wrong.cases.every(function (c) { return c.got !== undefined || c.error; }));

console.log("");
console.log("算法题库：" + problems.length + " 题 · " + totalCases + " 条用例");
console.log("通过 " + passes + " 项 · 失败 " + fails.length + " 项");
if (fails.length) {
  fails.forEach(function (f) { console.error("  ✗ " + f); });
  process.exitCode = 1;
} else {
  console.log("全绿。");
}
