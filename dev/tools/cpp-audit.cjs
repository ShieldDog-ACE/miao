/* 喵站 · C++ 正文审计闸（第九轮 T-21）
 *
 * 四条硬闸，一条不过退出码 1：
 *   A 梗与语气：椰子蛋 / 喵 结尾 / 管理（作人名用）一律零容忍；「管理盒子」这种正常动词用法放过。
 *   B 反引号：正文分部用反引号做字符串分隔符，内容里再出现反引号会把整份文件切坏 —— 直接判错。
 *   C 交叉引用：正文里「第 N 课」的 N 必须是**真实存在的课号**且不大于本课课号（前向引用清零，D-34 的 C++ 版）。
 *   D 构造首现：代码块里出现的构造，其「教学课号」不得大于本课课号（TEACH_AT 从源稿课表推，见 D-62）。
 *
 * 两条软指标（只报不拦，写进报表给人看）：
 *   E 规模口径：正文 ≤2,800 字、块 ≤30、单段代码 ≤14 行（D-56）。
 *   F 图形化演示：有 svg 块的章数（「该有的功能都要有」里的机制图，鼓励但不硬卡）。
 *
 * 跑法：
 *   node dev/tools/cpp-audit.cjs                 查两门课所有已落盘的分部
 *   node dev/tools/cpp-audit.cjs --part <文件>   只查某一份分部
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const DEV = path.resolve(__dirname, "..");
const SYL = JSON.parse(fs.readFileSync(path.join(__dirname, "cpp", "syllabus.json"), "utf8"));
const BY_N = {};
SYL.lessons.forEach(l => { BY_N[l.n] = l; });

const argv = process.argv.slice(2);
const onlyPart = argv.includes("--part") ? argv[argv.indexOf("--part") + 1] : null;

/* ---------- 课表：1–81 归 cpp（id c01…c81），82–213 归 cppm（id m82…m213） ---------- */
function courseOf(n) { return n <= 81 ? "cpp" : "cppm"; }
function idOf(n) { return n <= 81 ? "c" + String(n).padStart(2, "0") : "m" + n; }
function lessonNoOf(cid) { return Number(String(cid).replace(/\D/g, "")); }

/* ---------- D 闸：构造首现表（TEACH_AT）----------
 * 构造 → 最早能出现它的课号。取的是源稿里第一次正经教它的课号；
 * 没进表的构造出现在更早的课里不会被抓到，所以关键构造都要在表里。
 * 正则扫的是代码块原文（含注释！注释里提到的构造读者也看见了，一样算提前接触）。
 * 例外机制：某一章确实要提前露一小脸并且**正文里当场讲明白了**（比如第 5 课演示 std::string 的
 * length()），就在章上写 allowConstructs: ["member-call"]，闸对这章跳过该构造 —— 例外必须点名，
 * 不许整体放松。 */
const TEACH_AT = [
  ["std::println", /\bprintln\s*\(/, 1],
  ["main 函数", /\bint\s+main\s*\(/, 1],
  ["变量声明（类型 名字 =）", /\b(int|double|char|bool|auto)\s+[A-Za-z_]\w*\s*=/, 2],
  ["int 类型", /\bint\s+(?!main\b)\w/, 2],
  ["double 类型", /\bdouble\b/, 2],
  ["char 类型", /\bchar\b/, 2],
  ["bool / true / false", /\b(bool|true|false)\b/, 2],
  ["打印里的格式化写法 {:…}", /\{:[^}\n]*\}/, 9],
  ["auto", /\bauto\s+[A-Za-z_]\w*\s*=/, 4],
  ["sizeof", /\bsizeof\b/, 4],
  ["std::string", /\bstd::string\b/, 5],
  ["成员调用 .name()", /(?:^|[^:\w])\.\w+\s*\(/, 13, "member-call"],
  ["const", /\bconst\b/, 6],
  ["cin 键盘输入", /\bcin\b/, 20],
  ["比较运算符", "CMP", 19, "cmp"],   /* 第 19 课「字符串比大小」就在用 < >，线画在 22 会把正常内容判红 */
  ["逻辑与或非", /(&&|\|\|)/, 23],
  ["非 !", /![ \t]*[A-Za-z_(]/, 22],
  ["复合赋值", /(\+=|-=|\*=|\/=|%=)/, 14],   /* 源稿第 14 课就有 message += ... */
  ["整数之间的除号", /\d\s*\/\s*\d/, 8],
  ["取余运算 %", /\d\s*%\s*\d/, 9],
  ["自增自减", /(?:\w|\))\s*(?:\+\+|--)|\+\+\s*\w/, 24],   /* 注：C++ 这个名字已被 maskLiterals 折成 CLANG，不会误伤 */
  ["if", /\bif\s*\(/, 27],
  ["else", /\belse\b/, 28],
  ["switch", /\bswitch\s*\(/, 30],
  ["三目 ?: ", /\?[^:;\n]*:/, 31],
  ["while", /\bwhile\s*\(/, 33],
  ["do-while", /\bdo\s*\{/, 34],
  ["for", /\bfor\s*\(/, 35],
  ["range-for（for 里带冒号）", /for\s*\([^)]*:[^)=]*\)/, 37],
  ["break", /\bbreak\s*;/, 30],
  ["continue", /\bcontinue\s*;/, 38],
  ["vector", /\bvector\s*</, 40],
  ["pair", /\bpair\s*</, 46],
  ["结构化绑定", /\bauto\s*\[\s*\w+\s*,/, 47],
  ["constexpr", /\bconstexpr\b/, 49],
  ["using 别名", /^\s*using\s+[\w:]+\s*=/m, 50],
  ["自定义函数定义", /^\s*(int|double|bool|void|char|std::string)\s+(?!main\b)\w+\s*\([^)\n]*\)\s*(const\s*)?\{/m, 51],
  ["lambda", /\[[^\]\n]{0,20}\]\s*\(/, 56],
  ["参数列表里的引用（T& x）", /\(\s*[\w:<>]+\s*&\s*\w+\s*[,)]/, 60],
  ["const 引用（只看不摸）", /const\s+[\w:]+\s*&/, 61],   /* 第 59–62 课的代理指出：const 引用原本挂在 60 那条下面，61 课自己该有一条 */
  ["引用声明 int& 名字 = ", /\b[A-Za-z_][\w:<>]*\s*&\s*[A-Za-z_]\w*\s*=/, 58],
  ["指针声明 int *p", /\b(int|double|char|bool|void|auto|std::string)\s*\*\s*\w/, 74],
  ["取地址 &名字", /(?:\(|,|=|return|\[)\s*&\s*[A-Za-z_]\w*/, 58],   /* 只认表达式里的 &：f(&x)、p = &age、return &x、v[&x]。
   上一版把 int& alias = score; 这种**引用声明**也算进来了 —— 第 58 课正是教引用声明的课，等于自己判自己红（代理举证） */
  ["new / delete", /\b(new|delete)\b/, 76],
  ["智能指针", /\b(unique_ptr|shared_ptr|make_unique|make_shared)\b/, 78],
  ["sort 排序", /\bsort\s*\(/, 65],       /* 源稿第 65 课就拿 std::sort 跟冒泡对照 */
  ["其他标准算法（count_if / find_if / transform 一族）", /\b(count_if|find_if|for_each|binary_search|accumulate|next_permutation|unique|transform)\b/, 82],
  ["struct", /\bstruct\b/, 83],
  ["二维 vector", /vector\s*<\s*vector/, 88],
  ["views 管道", /\|\s*(filter|transform|take|reverse|iota|join|keys|values|elements|drop|split|stride)\b/, 90],
  ["map", /\bmap\s*</, 97],
  ["set", /\bset\s*</, 100],
  ["queue", /\bqueue\s*</, 101],
  ["stack", /\bstack\s*</, 102],
  ["priority_queue", /\bpriority_queue\b/, 103],
  ["class", /\bclass\b/, 112],
  ["初始化列表 :", /\w+\s*\([^)\n]*\)\s*:\s*\w+\s*\(/m, 113],
  ["const 成员函数", /\)\s*const\s*(\{|;)/, 83],   /* 源稿第 83 课的 struct 里就写了 passed() const */
  ["运算符重载", /operator\s*[+\-*\/<>=\[\]()]/, 115],
  ["继承", /\bclass\s+\w+\s*:\s*public/, 116],
  ["override", /\boverride\b/, 116],
  ["virtual", /\bvirtual\b/, 116],
  ["纯虚函数 = 0", /\bvirtual\b[^;\n]*=\s*0\s*;/, 117],
  ["explicit", /\bexplicit\b/, 117],
  ["析构函数 ~", /~\w+\s*\(/, 116],
  ["optional", /\boptional\s*</, 127],
  ["variant", /\bvariant\s*</, 129],
  ["expected", /\bexpected\s*</, 131],
  ["move / 转发动", /\b(std::move|std::forward)\b/, 113],
  ["reserve", /\.reserve\s*\(/, 138],
  ["namespace 块", /^\s*namespace\s+\w+\s*\{/m, 139],
  ["宏 #define", /^\s*#\s*define\b/m, 140],
  ["头文件分离（.h / pragma once / include guard）", /(pragma once|#ifndef\s+\w+_H)/, 139],
  ["string_view", /string_view/, 186],
  ["文件流", /\b(ifstream|ofstream|fstream)\b/, 168],
  ["异常", /\b(try|throw|catch)\b/, 176],
  ["线程 / 异步", /\b(thread|async|future|mutex)\b/, 200],
  ["模板", /\btemplate\s*</, 84],     /* 第 84 课自定义打印要写 template <> 的 formatter 特化，属于「先见到、后面再讲透」 */
  ["enum", /\benum\b/, 145],
  ["do { 代码块 }", /\}\s*while/, 34]
];

/* 判构造之前，先把字符串与字符字面量蒙掉：「I love C++」里的 ++、"Hello!" 里的 ! 都是**内容**，
   不是语言构造。注释不蒙 —— 注释里写 sort(...) 读者一样算提前看见了。 */
function maskLiterals(code) {
  return String(code)
    /* 语言名 C++ / c++ 在任何代码里都不是语法（没有人写 C++ ++），先折掉它：
       注释里「// I love C++」和字符串里 "找 \"C++\"" 都会把 ++ 的形状送进闸眼。 */
    .replace(/[Cc]\+\+(?![\w+-])/g, "CLANG")
    .replace(/"((?:\\.|[^"\\])*)"/g, function (m, inner) { return '"MASKED"'; })
    .replace(/'((?:\\.|[^'\\])*)'/g, "'MASKED'");
}

/* 比较运算符单独一条：#include <print> 的尖括号、vector<int> 的模板参数都不是比较，
   先把这两种尖括号蒙掉再找 < >，否则每一课都误报。 */
/* --lesson N：打印「第 N 课及以前能用 / 从第 N+1 课起才许出现」两条清单。
   派单时要按号段给代理写清楚课号线，靠人记 TEACH_AT 一定会漏 —— 这条就是把那张表变成可查的。 */
if (argv.includes("--lesson")) {
  const N = Number(argv[argv.indexOf("--lesson") + 1]);
  if (!N) { console.error("--lesson 要跟着一个课号，例如 --lesson 43"); process.exit(1); }
  const now = TEACH_AT.filter(e => e[2] === N).map(e => e[0]);
  const later = TEACH_AT.filter(e => e[2] > N).sort((a, b) => a[2] - b[2])
    .map(e => e[0] + '（' + e[2] + ' 课）');
  console.log('第 ' + N + ' 课');
  console.log('  本课新拿到：' + (now.join('、') || '（表里没有以这一课为首现的构造）'));
  console.log('  以后才许用：' + (later.join('、') || '（无）'));
  console.log('  写法豁免：allowConstructs: [`表里的名字`] —— 只有正文当场讲明白才准用');
  process.exit(0);
}

function cmpHit(code) {
  const masked = String(code)
    .replace(/^\s*#\s*include\s*<[^>\n]*>/gm, "MASKED_INCLUDE")
    .replace(/\b\w+\s*<\s*[\w:,\s<>*&]+\s*>/g, "MASKED_TEMPLATE")
    .replace(/->/g, "")
    /* 流的箭头：std::cin >> x 教在第 20 课，比 22 课的「比较运算符」还早 ——
       不蒙掉它，每个 cin 的演示都会假红（第 16–20 课的代理就是这么撞上的） */
    .replace(/>>/g, "MASKED_SHOOT")
    .replace(/<</g, "MASKED_SHOOT");
  return /(==|!=|>=|<=|<|>)/.test(masked);
}

/* 这些写法在 cpp / cppm 两门课里根本没教过 —— 代码块里一律不许出现。
   注意 iostream 不在名单里：std::cin / std::getline 就住在 iostream（源稿自己也这么包），
   这门课只禁 cout/cin 混着老的输出流用 —— 输出统一走 C++23 的 println。 */
const FORBIDDEN = [
  ["goto", /\bgoto\s+\w/],
  ["printf/scanf（C 老写法）", /\b(printf|scanf)\s*\(/],
  ["std::cout / cerr 旧输出流", /std::(cout|cerr|clog)/],
  ["<< 输出流写法", /std::\w+\s<</]
];

/* 完整程序（带 int main）的代码块必须能真编译：写了 cin/getline 就得把 iostream 请进来。
   片段块（没有 main 的演示）不查 —— 它们本来就在正文里说明过「接在上面那段后面」。 */
function includeCheck(code) {
  if (!/\bint\s+main\s*\(/.test(code)) return [];
  const out = [];
  const usesCin = /\bstd::cin\b|\bcin\s*>>/.test(code);
  const usesGetline = /getline\s*\(/.test(code);
  const hasIo = /#\s*include\s*<iostream>/.test(code);
  const hasStr = /#\s*include\s*<string>/.test(code);
  const hasPrint = /#\s*include\s*<print>/.test(code);
  if ((usesCin || usesGetline) && !hasIo) out.push("用了 std::cin / getline 却没 #include <iostream>（这段跑不起来）");
  if (/\bstd::string\b/.test(code) && !hasStr) out.push("用了 std::string 却没 #include <string>");
  if (/\bprintln\s*\(|\bprint\s*\(/.test(code) && !hasPrint) out.push("用了 std::println / std::print 却没 #include <print>");
  if (/\bvector\s*</.test(code) && !/#\s*include\s*<vector>/.test(code)) out.push("用了 vector 却没 #include <vector>");
  if (/\b(unique_ptr|shared_ptr|make_unique|make_shared)\b/.test(code) && !/#\s*include\s*<memory>/.test(code)) out.push("用了智能指针却没 #include <memory>");
  /* ranges 那一族的视图（std::views::transform 之类）不是 <algorithm> 里的算法，
     它要的是 <ranges>。蒙掉 views::名字 再查算法名，否则第 90/91 课那种管道全被误判成缺 <algorithm>。 */
  const algoSrc = code.replace(/\bviews\s*::\s*[A-Za-z_]\w*/g, "MASKED_VIEW");
  if (/\bsort\s*\(|\b(count_if|find_if|transform|for_each|binary_search|accumulate|next_permutation|unique)\s*\(/.test(algoSrc) && !/#\s*include\s*<algorithm>/.test(code)) out.push("用了标准算法却没 #include <algorithm>");
  if (/\bviews\s*::/.test(code) && !/#\s*include\s*<ranges>/.test(code)) out.push("用了 std::views 管道却没 #include <ranges>");
  if (/\bmap\s*</.test(code) && !/#\s*include\s*<(map|unordered_map)>/.test(code)) out.push("用了 map 却没包对应头文件（<map> 或 <unordered_map>）");
  if (/\bset\s*</.test(code) && !/#\s*include\s*<(set|unordered_set)>/.test(code)) out.push("用了 set 却没包对应头文件（<set> 或 <unordered_set>）");
  if (/\bstack\s*</.test(code) && !/#\s*include\s*<stack>/.test(code)) out.push("用了 stack 却没 #include <stack>");
  if (/\bpriority_queue\s*</.test(code) && !/#\s*include\s*<queue>/.test(code)) out.push("用了 priority_queue 却没 #include <queue>");
  if (/\bqueue\s*</.test(code) && !/#\s*include\s*<queue>/.test(code)) out.push("用了 queue 却没 #include <queue>");
  if (/\boptional\s*<|\bvariant\s*<|\bexpected\s*</.test(code) && !/#\s*include\s*<(optional|variant|expected)>/.test(code)) out.push("用了 optional/variant/expected 却没包对应头文件");
  if (/string_view/.test(code) && !/#\s*include\s*<string_view>/.test(code)) out.push("用了 string_view 却没 #include <string_view>（只包 <string> 不算）");
  return out;
}

/* ---------- A 闸：梗与语气 ---------- */
const MEME = [
  ["椰子蛋", /椰子蛋/],
  ["句尾喵", /喵[。！!]?\s*$/],
  ["人名梗「管理」", /(?:^|[^一-龥])管理(?:员|员老张|说|觉得|让他|交给管理)/]
];

function codeBlocksOf(ch) { return (ch.blocks || []).filter(b => b && b.t === "code"); }
function textOf(ch) {
  let s = String(ch.title || "");
  (ch.blocks || []).forEach(b => {
    if (b.t === "p" || b.t === "tip") s += "\n" + String(b.text || "");
    if (b.t === "h2") s += "\n" + String(b.text || "");
    if (b.t === "ul") (b.items || []).forEach(x => { s += "\n" + String(x); });
  });
  return s;
}
/* 图里的字（图注 + 每个 <text> 节点）读者一样看得见：梗与前向引用不许从 SVG 这条缝漏过去。
   故意不并进 textOf —— 「正文多少字」的口径不该被图注充，E 闸只看散文。 */
function svgWordsOf(ch) {
  let s = "";
  (ch.blocks || []).forEach(b => {
    if (b.t !== "svg") return;
    s += "\n" + String(b.caption || "");
    (String(b.code || "").match(/>([^<>]+)</g) || []).forEach(t => {
      s += "\n" + t.slice(1, -1).replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    });
  });
  return s;
}
function charCount(s) { return String(s).replace(/[\s]/g, "").length; }

/* ---------- 收集分部 ---------- */
const DATA = path.join(DEV, "frontend", "assets", "data");
/* --part 的相对路径按「仓库根」和「当前目录」两种写法都认：派单文档里教的是 dev/frontend/…
   （仓库根出发），而人常常已经站在 dev/ 里敲 frontend/… —— 只认一种就会报 ENOENT，
   而报的是「分部文件跑不起来」，容易被误读成正文写坏了。 */
function resolvePart(p) {
  const ROOT = path.resolve(DEV, "..");                 /* 仓库根 = 喵站/，DEV = 喵站/dev */
  const bare = String(p).replace(/^\.?\/?dev\//, "");   /* 文档教的是「dev/frontend/…」，站根的上一级出发 */
  const cands = [
    path.resolve(DEV, p), path.resolve(ROOT, p),
    path.resolve(process.cwd(), p), path.resolve(process.cwd(), "..", p),
    path.resolve(DEV, bare), path.resolve(ROOT, bare), path.resolve(process.cwd(), bare)
  ];
  const hit = cands.find(c => fs.existsSync(c));
  if (!hit) { console.error("[cpp-audit] --part 找不到文件，试过：" + [...new Set(cands)].join(" | ")); process.exit(1); }
  return hit;
}
const files = onlyPart ? [resolvePart(onlyPart)] : (() => {
  const out = [];
  ["cpp", "cppm"].forEach(sub => {
    const d = path.join(DATA, sub);
    if (!fs.existsSync(d)) return;
    fs.readdirSync(d).filter(f => /^p\d+\.js$/.test(f)).sort().forEach(f => out.push(path.join(d, f)));
  });
  return out;
})();
if (!files.length) { console.error("[cpp-audit] 一份分部都没有（data/cpp|cppm/pNN.js）"); process.exit(1); }

const violations = [];
const stats = [];
const knownIds = new Set(SYL.lessons.map(idOf));

files.forEach(file => {
  const ctx = { window: {}, console: { log: () => { }, error: console.error, warn: console.warn } };
  ctx.self = ctx.window; ctx.globalThis = ctx.window;
  ctx.document = { createElement: () => ({}) };
  vm.createContext(ctx);
  let chapters = [];
  try {
    vm.runInContext(fs.readFileSync(file, "utf8"), ctx, { filename: path.basename(file), timeout: 20000 });
    chapters = Object.keys(ctx.window).filter(k => /^MIAO_CPP(M)?_P\d+$/.test(k))
      .flatMap(k => (ctx.window[k] && ctx.window[k].chapters) || []);
  } catch (e) {
    violations.push({ file: path.relative(DEV, file), gate: "语法", cid: "—", msg: "分部文件跑不起来：" + e.message });
    return;
  }

  chapters.forEach(ch => {
    const no = lessonNoOf(ch.id);
    const prep = /^s\d/.test(String(ch.id));        /* 第 0 课准备课：不占源稿课号 */
    const lesson = BY_N[no];
    const rel = path.relative(DEV, file);
    if (!prep && !lesson) { violations.push({ file: rel, gate: "课号", cid: ch.id, msg: "章 id " + ch.id + " 在源稿课表里没有对应课号" }); return; }
    if (!prep && courseOf(no) !== (String(ch.id).startsWith("c") ? "cpp" : "cppm")) {
      violations.push({ file: rel, gate: "课号", cid: ch.id, msg: "第 " + no + " 课应属 " + courseOf(no) + "，却写进了 " + String(ch.id).slice(0, 1) + " 开头（课程归属错了）" });
    }

    const text = textOf(ch);
    const vis = text + svgWordsOf(ch);        /* A/B/C 三条看这个：散文 + 图注 + 图里的字 */

    /* A 梗 */
    MEME.forEach(([name, re]) => {
      const m = re.exec(vis);
      if (m) violations.push({ file: rel, gate: "A 梗", cid: ch.id, msg: name + "：「" + m[0] + "」" });
    });
    codeBlocksOf(ch).forEach((b, bi) => {
      MEME.forEach(([name, re]) => {
        const m = re.exec(String(b.code || ""));
        if (m) violations.push({ file: rel, gate: "A 梗", cid: ch.id, msg: "代码块 " + (bi + 1) + " 里有" + name + "：「" + m[0] + "」" });
      });
    });

    /* B 反引号：分部的字符串分隔符就是反引号，内容里出现即判错 */
    const raw = fs.readFileSync(file, "utf8");
    const btCount = (vis.match(/`/g) || []).length;
    if (btCount) violations.push({ file: rel, gate: "B 反引号", cid: ch.id, msg: "正文/标题里有 " + btCount + " 个反引号（会把分部文件的字符串切坏）" });

    /* C 交叉引用：第 N 课，N ≤ 本课号，且站内真有这一课（第 0 课导论本来要往后指，跳过） */
    const refRe = /第\s*(\d+)\s*课/g;
    let rm;
    while (!prep && (rm = refRe.exec(vis))) {
      const n = Number(rm[1]);
      if (!BY_N[n]) { violations.push({ file: rel, gate: "C 交叉引用", cid: ch.id, msg: "指向站内不存在的第 " + n + " 课（源稿只有 1–213）" }); continue; }
      if (n > no) { violations.push({ file: rel, gate: "C 交叉引用", cid: ch.id, msg: "前向引用：第 " + no + " 课里写了「第 " + n + " 课」（只许往回指，往后的说法用「下一课」「以后」）" }); }
    }

    if (!prep) {
      /* D 构造首现：代码块（含注释，读者看得见就算）里不许出现本课以后才教的构造 */
      const allow = {};
      /* 准备课（s01–s03）讲的就是整门课的走向与工具链，D 闸（构造首现）对它不成立，整段跳过 */
      (ch.allowConstructs || []).forEach(k => { allow[k] = 1; });
      codeBlocksOf(ch).forEach((b, bi) => {
        const raw = String(b.code || "");
        if (b.lang !== "c++") return;     /* shell / text 块里 g++、-std=c++23、箭头图不是语言构造 */
        const code = maskLiterals(raw);
        TEACH_AT.forEach(entry => {
          const [name, re, teachAt, key] = entry;
          const k = key || name;            /* 没另起键名的条目，就拿名字当 allowConstructs 的键 ——
                                               以前写的是 !key 就跳过，等于整张表只查了两条 */
          if (teachAt <= no || allow[k]) return;
          const hit = re === "CMP" ? cmpHit(code) : re.test(code);
          if (hit) {
            violations.push({ file: rel, gate: "D 构造首现", cid: ch.id, msg: "代码块 " + (bi + 1) + " 用了「" + name + "」，它到第 " + teachAt + " 课才教（本课是第 " + no + " 课）；正文里当场讲明白了才许写 allowConstructs: [\"" + k + "\"]" });
          }
        });
        FORBIDDEN.forEach(([name, re]) => {
          if (re.test(String(b.code || ""))) violations.push({ file: rel, gate: "D 构造首现", cid: ch.id, msg: "代码块 " + (bi + 1) + " 里有不教的写法「" + name + "」" });
        });
        if (b.lang === "c++") includeCheck(code).forEach(msg => {
          violations.push({ file: rel, gate: "H 能编译", cid: ch.id, msg: "代码块 " + (bi + 1) + "：" + msg });
        });
      });
    } else {
      /* 准备课不查构造首现，但「写了什么就得包什么头文件」这条照样成立 */
      codeBlocksOf(ch).forEach((b, bi) => {
        if (b.lang === "c++") includeCheck(String(b.code || "")).forEach(msg => {
          violations.push({ file: rel, gate: "H 能编译", cid: ch.id, msg: "代码块 " + (bi + 1) + "：" + msg });
        });
      });
    }

    /* G 内联 SVG：标签要配平，且不许出现渲染层会剥掉的东西（写了也是白写） */
    (ch.blocks || []).forEach((b, bi) => {
      if (!b || b.t !== "svg") return;
      const s = String(b.code || "");
      const where = "svg 块 " + (bi + 1);
      const BAD_TAGS = /\b(script|iframe|object|embed|animate|set)\b/i;
      const BAD_ATTR = /\s(on\w+|href|xlink:href|src)\s*=/i;
      const URL_STYLE = /\sstyle\s*=\s*"[^"]*url\s*\(/i;
      if (BAD_TAGS.test(s)) violations.push({ file: rel, gate: "G SVG", cid: ch.id, msg: where + " 里有渲染层一律剥掉的标签（script/iframe/object/embed/animate/set），写了也不显示" });
      if (BAD_ATTR.test(s)) violations.push({ file: rel, gate: "G SVG", cid: ch.id, msg: where + " 里有 on*/href/src 属性，会被剥掉" });
      if (URL_STYLE.test(s)) violations.push({ file: rel, gate: "G SVG", cid: ch.id, msg: where + " 的 style 里有 url()，会被剥掉" });
      if (!/^<svg[\s>]/.test(s.trim())) violations.push({ file: rel, gate: "G SVG", cid: ch.id, msg: where + " 不以 <svg 开头" });
      const stack = [];
      let unbalanced = null;
      for (const m of s.matchAll(/<(\/?)([a-zA-Z][\w:-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>/g)) {
        const close = m[1] === "/", name = m[2], selfClose = m[4] === "/";
        if (/^(svg|g|rect|circle|ellipse|path|line|polyline|polygon|text|tspan|defs|marker|linearGradient|radialGradient|stop|title)$/i.test(name)) {
          if (selfClose) continue;
          if (!close) stack.push(name);
          else {
            const top = stack.pop();
            if (top !== name) { unbalanced = "第 " + m.index + " 列：闭包 </" + name + "> 对不上 <" + (top || "（空）") + ">"; break; }
          }
        }
      }
      if (!unbalanced && stack.length) unbalanced = "有 " + stack.length + " 个标签没闭合：" + stack.slice(0, 3).join(", ");
      if (unbalanced) violations.push({ file: rel, gate: "G SVG", cid: ch.id, msg: where + " 标签不配平：" + unbalanced });
      if (!b.caption) violations.push({ file: rel, gate: "G SVG", cid: ch.id, msg: where + " 没有 caption（图注），读者看不出这张图在讲什么" });
    });

    /* C2 任务栏对账（第 0 课准备课没有对应源稿，跳过）：源稿每一条【任务】都要出现在正文【任务】栏里（可以补，不能删）。
       比对放宽到「去掉标点与空格后的前 12 个字要出现」—— 他会把「（提示：…）」这类括注改写，
       但任务主体不许换。*/
    if (prep) { /* 准备课没有源稿任务可对，直接跳到规模统计 */ } else {
    const squash = t => String(t).replace(/[\s"'“”‘’「」《》（）()：:；;，,。.、！!？?〔〕\[\]【】\-—_*#`]/g, "");
    const taskSec = [];
    (ch.blocks || []).forEach((b, i, arr) => {
      if (b.t === "h2" && /^任务/.test(String(b.text || "").trim())) {
        for (let k = i + 1; k < arr.length && arr[k].t !== "h2"; k++) {
          if (arr[k].t === "ul") taskSec.push(...(arr[k].items || []));
          if (arr[k].t === "p") taskSec.push(arr[k].text);
        }
      }
    });
    const taskBlob = squash(taskSec.join(" "));
    if (!taskSec.length) {
      violations.push({ file: rel, gate: "C2 任务对账", cid: ch.id, msg: "正文里没有【任务】栏（六栏课式的第六栏）" });
    } else {
      lesson.tasks.forEach((t, ti) => {
        const flat = squash(t);
        if (flat.length < 4) return;                        // 太短的任务不值得卡
        /* 滑动窗口：源稿任务里任意一段 8 字连续出现在【任务】栏，就算这条任务被保留了。
           代理常把「（预习）L1-06 学完 if 回来」这种人话改写掉，只比前 12 字会假红。 */
        const W = Math.min(8, flat.length);
        let hit = false;
        for (let i = 0; i + W <= flat.length && !hit; i++) hit = taskBlob.indexOf(flat.slice(i, i + W)) >= 0;
        if (!hit) {
          violations.push({ file: rel, gate: "C2 任务对账", cid: ch.id, msg: "源稿第 " + (ti + 1) + " 条任务「" + t.slice(0, 26) + "…」在正文【任务】栏里找不到任何一段 8 字对得上" });
        }
      });
    }

    }
    /* E 规模（软） */
    const chars = charCount(text);
    const blocks = (ch.blocks || []).length;
    const longCode = codeBlocksOf(ch).filter(b => String(b.code || "").split("\n").length > 14).length;
    if (chars > 2800 || blocks > 30 || longCode) {
      stats.push({ file: rel, cid: ch.id, chars, blocks, longCode, over: true });
    } else stats.push({ file: rel, cid: ch.id, chars, blocks, longCode, over: false });

    /* F 图形化（软） */
    const hasSvg = (ch.blocks || []).some(b => b.t === "svg");
    if (!hasSvg) stats[stats.length - 1].noSvg = true;
  });
});

/* ---------- 报表 ---------- */
const byGate = {};
violations.forEach(v => { byGate[v.gate] = (byGate[v.gate] || 0) + 1; });
console.log("[cpp-audit] 扫了 " + files.length + " 份分部 · 章 " + stats.length + " · 违规 " + violations.length);
violations.slice(0, 80).forEach(v => console.log("  ✘ " + v.gate + " · " + v.cid + " · " + v.file + "\n      " + v.msg));
if (violations.length > 80) console.log("  …还有 " + (violations.length - 80) + " 条");
const over = stats.filter(s => s.over);
const noSvg = stats.filter(s => s.noSvg);
if (over.length) {
  console.log("  · 超口径（≤2800 字 / ≤30 块 / 单段代码 ≤14 行）" + over.length + " 章：");
  over.forEach(s => console.log("      " + s.cid + " 字数 " + s.chars + " 块 " + s.blocks + " 超长代码段 " + s.longCode));
}
const avg = stats.length ? Math.round(stats.reduce((a, s) => a + s.chars, 0) / stats.length) : 0;
console.log("  · 均字数 " + avg + " · 有机制图 " + (stats.length - noSvg.length) + "/" + stats.length + " 章（软指标，不拦）");
console.log("  分闸统计 " + JSON.stringify(byGate));
process.exit(violations.length ? 1 : 0);
