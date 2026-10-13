/* 喵站 · 代码编辑器控件自测（tests/editor-test.js）
 *
 * 为什么单开一套：code-editor.js 是 Python 考场与 C++ 笔试卷共用的那一件控件，它一坏两边同时坏，
 * 而坏法大多是「静默错位」—— 高亮吞了一个字符、行号少数一行、括号闭合把光标丢到别处。
 * 三条判据都是能算死的：
 *   1) 无损：剥掉 <span> 反转义之后必须逐字等于原文（高光是叠色，不是重写）；
 *   2) 层数与行号：一行一个 hl-row，行号条数 == 行数，空行不许塌；
 *   3) 键位：成对闭合 / 跨过闭合符 / 成对退格 / 块缩进 / 自动缩进 / 补全收下，逐条按事件验。
 * 跑法：node dev/tests/editor-test.js
 */
"use strict";
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const JS = p => path.join(__dirname, "..", "frontend", "assets", "js", p);
const SRC = fs.readFileSync(JS("code-editor.js"), "utf8");

let pass = 0, fail = 0;
function ok(name, cond, got) {
  if (cond) { pass++; console.log("PASS | " + name + (got ? "  → " + got : "")); }
  else { fail++; console.log("FAIL | " + name + (got !== undefined ? "  → " + got : "")); }
}

/* ---------- 起一个带 window 的小环境，把控件装上去 ---------- */
const dom = new JSDOM('<!doctype html><meta charset="utf-8"><body><div id="host"></div></body>',
  { pretendToBeVisual: true, runScripts: "outside-only" });
const W = dom.window;
W.MIAO_HL = { cppKw: { int: 1, return: 1, if: 1, for: 1, class: 1, template: 1 }, cppTy: { string: 1, vector: 1 } };
W.eval(SRC);
const ED = W.MIAO_EDITOR;
ok("控件挂上 window.MIAO_EDITOR", !!ED && typeof ED.create === "function", "");

/* ---------- 1. 无损：两把尺各喂一段带坑的样本 ---------- */
/* 高亮层是一行一个 <div class="hl-row">，行分隔就藏在那对标签里 ——
   剥标签之前必须先把它还原成 \n，否则量出来的「丢字符」是测试自己的错。 */
const strip = h => h.replace(/<\/div><div class="hl-row">/g, "\n")
  .replace(/^<div class="hl-row">|<\/div>$/g, "")
  .replace(/<\/?(div|span)[^>]*>/g, "")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
const PY_SAMPLES = [
  "", "print('hi')", "# 只有题面\nx = 1", "s = '未闭合", "t = \"\"\"\n多行\n\"\"\"",
  "def f(self):\n    return f'{self.x:>3} {1_000:,}'  # 尾随空格   ",
  "x = {'a': [1, 2.5, 0x1F, 1e-3]}\nif x:\n\tpass",
  "@decorator(.at)\nn = 0b1010", "中文 = '串里的 // 不是注释'", "print(  '  双空格  '  )"
];
const CPP_SAMPLES = [
  "", "#include <iostream>\nint main() { return 0; }",
  "// 行注释\n/* 块注释\n跨了三行 */\nint x = 42;",
  "auto s = std::string(\"未闭合", "char c = '\\'';", "template<typename T>\nT add(T a, T b) { return a + b; }",
  "#define A \\\n  1\nint i = 0;", "std::cout << \"a // b\" << std::endl;", "if (a && b) { x = 1; }  // 尾随   ",
  "int 中文变量 = 1;"
];
PY_SAMPLES.map(s => ["py", s]).concat(CPP_SAMPLES.map(s => ["cpp", s])).forEach((pair, i) => {
  const lang = pair[0], src = pair[1];
  let got;
  try { got = strip(ED.highlight(src, lang)); } catch (e) { got = "抛错：" + e.message; }
  ok(`无损 round-trip（${lang} 样本 ${i + 1}）`, got === src, got === src ? "" : JSON.stringify(got).slice(0, 70));
});

/* ---------- 2. 控件：四层齐不齐、行号跟不跟得上 ---------- */
const host = W.document.getElementById("host");
const mk = opts => ED.create(W.document.createElement("div"), opts || {});
/* 敲一个键：只发 keydown，返回「默认动作有没有被拦下来」。
   jsdom 没有真正的编辑控件，普通字符它自己不会进 textarea —— 被拦下的键由控件负责写入，
   没拦的键（比如普通字母）要测试自己补一次 input，等于浏览器的那一下。 */
function press(ed, key, opt) {
  const o = Object.assign({ key, bubbles: true, cancelable: true }, opt || {});
  return ed.ta.dispatchEvent(new W.KeyboardEvent("keydown", o)) === false;   /* true = preventDefault 过 */
}
function type(ed, text) {
  const s = ed.ta.selectionStart, e = ed.ta.selectionEnd, v = ed.ta.value;
  ed.ta.value = v.slice(0, s) + text + v.slice(e);
  ed.ta.setSelectionRange(s + text.length, s + text.length);
  ed.ta.dispatchEvent(new W.Event("input", { bubbles: true }));
}
const caret = ed => ed.ta.selectionStart;

{
  const ed = mk({ lang: "cpp", value: "int main() {\n    return 0;\n}\n" });
  const lines = ed.ta.value.split("\n").length;
  ok("四层结构齐：行号列 / 当前行 / 着色层 / textarea",
    !!ed.el.querySelector(".ed-gt") && !!ed.el.querySelector(".ed-cur") && !!ed.el.querySelector(".ed-hl") && !!ed.el.querySelector("textarea.ed-ta"), "");
  ok("行号条数 == 行数（含末尾空行）", ed.gutter.querySelectorAll(".ln").length === lines,
    ed.gutter.querySelectorAll(".ln").length + " / " + lines);
  ok("着色层一行一个 hl-row，空行不许塌", ed.hlLayer.children.length === lines, ed.hlLayer.children.length + " 行");
  ok("textarea 不折行（wrap=off，与 IDE 同一条判据）", ed.ta.getAttribute("wrap") === "off", "");
  ok("C++ 那把尺真给关键字上了色（不是整段原样吐）", /tk-kw/.test(ed.hlLayer.innerHTML), "");
}

/* ---------- 3. 键位：成对闭合 / 跨过 / 成对退格 / 缩进 / 撑块 ---------- */
{
  const ed = mk({ lang: "cpp", value: "" });
  press(ed, "(");
  ok("敲左括号自动补右括号，光标落在中间", ed.ta.value === "()" && caret(ed) === 1, JSON.stringify(ed.ta.value) + " @" + caret(ed));
  press(ed, ")");
  ok("右边已经是 ) 时再敲 ) 只是跨过去，不插第二个", ed.ta.value === "()" && caret(ed) === 2, JSON.stringify(ed.ta.value) + " @" + caret(ed));
  press(ed, "Backspace");
  ok("退格删掉 ( 时把紧贴的 ) 一起带走（光标在两个括号中间）", ed.ta.value === "()" && caret(ed) === 2, JSON.stringify(ed.ta.value));
  ed.ta.setSelectionRange(1, 1);                        /* 回到刚插完的样子：(|) */
  press(ed, "Backspace");
  ok("光标夹在 (|) 中间按退格 → 两个一起删，不留孤括号", ed.ta.value === "" && caret(ed) === 0, JSON.stringify(ed.ta.value));
}
{
  const ed = mk({ lang: "cpp", value: "cout << hello << endl;" });
  ed.ta.setSelectionRange(8, 13);                       /* 选中 hello */
  press(ed, "\"");
  ok("有选区时敲引号 → 把选区包起来，选区仍然是那段字",
    ed.ta.value === 'cout << "hello" << endl;' && ed.ta.selectionStart === 9 && ed.ta.selectionEnd === 14,
    JSON.stringify(ed.ta.value) + " [" + ed.ta.selectionStart + "," + ed.ta.selectionEnd + "]");
}
{
  const ed = mk({ lang: "cpp", value: "int main() {" });
  ed.ta.setSelectionRange(12, 12);
  press(ed, "Enter");
  ok("行尾是 { 时回车自动进一级（4 空格）", ed.ta.value === "int main() {\n    " && caret(ed) === 17,
    JSON.stringify(ed.ta.value));
}
{
  const ed = mk({ lang: "cpp", value: "int main() {}" });
  ed.ta.setSelectionRange(12, 12);                      /* 光标正夹在 {|} 中间 */
  press(ed, "Enter");
  ok("光标夹在一对花括号里回车 → 撑成一个块，光标停在中间那行",
    ed.ta.value === "int main() {\n    \n}" && caret(ed) === 17, JSON.stringify(ed.ta.value) + " @" + caret(ed));
}
{
  const ed = mk({ lang: "py", value: "def f():\n    pass" });
  ed.ta.setSelectionRange(8, 8);
  press(ed, "Enter");
  ok("Python 行尾冒号回车也进一级（沿用上一把尺的判据）", ed.ta.value === "def f():\n    \n    pass", JSON.stringify(ed.ta.value));
}
{
  const ed = mk({ lang: "cpp", value: "aa\nbb" });
  ed.ta.setSelectionRange(0, 0);
  press(ed, "Tab");
  ok("单行 Tab 插 4 个空格，不跳焦点", ed.ta.value === "    aa\nbb" && caret(ed) === 4, JSON.stringify(ed.ta.value));
  ed.ta.setSelectionRange(0, ed.ta.value.length);
  press(ed, "Tab");
  ok("选中多行 Tab → 整块加一级", ed.ta.value === "        aa\n    bb", JSON.stringify(ed.ta.value));
  press(ed, "Tab", { shiftKey: true });
  ok("Shift+Tab 整块反缩一级", ed.ta.value === "    aa\nbb", JSON.stringify(ed.ta.value));
}

/* ---------- 4. 补全：候选从哪来、收下之后写回什么 ---------- */
{
  const ed = mk({ lang: "cpp", value: "std::vector<int> nums;\nfor (int n" });
  const popEl = ed.el.querySelector(".ed-pop");
  ed.ta.setSelectionRange(ed.ta.value.length, ed.ta.value.length);
  press(ed, " ", { ctrlKey: true });
  const items = Array.prototype.map.call(popEl.querySelectorAll(".ed-it"), e => e.textContent);
  ok("Ctrl+Space 弹候选，文档里出现过的名字排最前",
    popEl.hidden === false && items.length > 0 && /^nums/.test(items[0]), items.slice(0, 4).join(" | "));
  press(ed, "Enter");
  ok("Enter 收下第一个候选：前缀被换成整词，光标落在词尾",
    ed.ta.value === "std::vector<int> nums;\nfor (int nums" && caret(ed) === ed.ta.value.length,
    JSON.stringify(ed.ta.value.slice(-14)) + " @" + caret(ed));

  const ed2 = mk({ lang: "cpp", value: "std::vector<int> v;\nvec" });
  const pop2 = ed2.el.querySelector(".ed-pop");
  type(ed2, "");                                        /* 触发一次 input，让自动弹框按当前前缀重算 */
  const it2 = Array.prototype.map.call(pop2.querySelectorAll(".ed-it"), e => e.textContent);
  ok("打到 2 个字母自动弹框，vector 在候选里", pop2.hidden === false && it2.some(s => /^vector/.test(s)), it2.slice(0, 5).join(" | "));
  ok("补全框贴在光标那一格（坐标由控件量出来写进 style）",
    /px$/.test(pop2.style.left) && /px$/.test(pop2.style.top), pop2.style.left + " / " + pop2.style.top);

  const ed3 = mk({ lang: "cpp", value: "std::vector<int> v;\nv.p" });
  ed3.ta.setSelectionRange(ed3.ta.value.length, ed3.ta.value.length);
  press(ed3, " ", { ctrlKey: true });
  const it3 = Array.prototype.map.call(ed3.el.querySelector(".ed-pop").querySelectorAll(".ed-it"), e => e.textContent);
  ok("点号之后能补成员，长词没被排序挤掉（pop_back / push_back 都在）",
    it3.some(s => /^push_back/.test(s)) && it3.some(s => /^pop_back/.test(s)), it3.slice(0, 6).join(" | "));
  ok("候选里不许出现「已经打完的那段自己」（打 p 就别再把 p 列出来）",
    !it3.some(s => s.trim() === "p"), it3.slice(0, 3).join(" | "));
}

/* ---------- 5. 对照：故意写坏的输入不许把尺子弄崩 ---------- */
["\"未闭合的串", "'''三引号没关", "/* 块注释到底", "#define A \\", "{{{{", "}}}}", "中文()“引号”"].forEach((s, i) => {
  let bad = null;
  try { ED.highlight(s, i % 2 ? "cpp" : "py"); } catch (e) { bad = e.message; }
  ok("坏输入只许不染色，不许抛错（样本 " + (i + 1) + "）", !bad, bad || "");
});

console.log("\n合计 " + (pass + fail) + " 项，失败 " + fail + " 项");
W.close();
process.exit(fail ? 1 : 0);



