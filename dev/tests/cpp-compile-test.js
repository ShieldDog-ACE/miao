/* 喵站 · 模拟编译检查器自测（tests/run.sh 的第 4e 步）
 * 两条判据一起才算数：该报的必须报（漏报＝这把尺是哑巴），不该报的一律不许报 ——
 * 假错会把读者挡在门外，上一版就是拿 `long long` 与一行写完的 main 试过才露馅的。
 * 用例全是站内真代码：正文演示 + 考卷参考写法。
 */
const path = require("path");
const fs = require("fs");
const CC = require(path.join(__dirname, "..", "frontend", "assets", "js", "cpp-compile.js"));
const PRINT = require(path.join(__dirname, "..", "tools", "cpp-exam-print.cjs"));

let pass = 0, fail = 0;
function ok(cond, name, extra) { (cond ? pass++ : fail++); console.log((cond ? "PASS " : "FAIL ") + name + (extra ? "  → " + extra : "")); }

/* 该报的 */
const MUST = [
  ["括号互不认账", "int main(){ std::println(\"hi\" }", /关不上/],
  ["引号没关", "int main(){ std::println(\"hi); return 0; }", /双引号没关起来/],
  ["没有 main", "std::println(\"hi\");", /没有 main/],
  ["用 println 没搬 print", "int main(){ std::println(\"hi\"); return 0; }", /没 #include <print>/],
  ["用 vector 没搬 vector", "#include <print>\nint main(){ std::vector<int> v; return 0; }", /没 #include <vector>/],
  ["两句之间真少分号", "#include <print>\nint a = 1\nint b = 2;\nint main(){ return 0; }", /少了分号/],
  ["调用后直接跟 return", "#include <print>\nint main(){ std::println(\"x\") return 0; }", /少了分号/]
];
MUST.forEach(([name, src, re]) => {
  const r = CC.check(src);
  /* 消息里的 <print> 出 HTML 前被转义成 &lt;print&gt;（那是第三条规矩），比对前先还原 */
  /* 顺序不能反：先把真的 HTML 标签（那颗可点的行号按钮）去掉，再把转义还原 ——
     反过来做会把 &lt;print&gt; 还原成 <print> 再当成标签删掉，等于把消息里的头名字自己吃了 */
  const plain = l => String(l.html).replace(/<[^>]*>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
  ok(r.problems > 0 && r.lines.some(l => re.test(plain(l))), "该报：" + name, r.problems ? "" : "一条都没报");
});

/* 不许报的：一行写完的 main、long long、范围 for、控制头后直接跟一句、字符串里的 // 与 ; */
const MUST_NOT = [
  ["一行写完的 main", "#include <print>\nint main(){ std::println(\"hi\"); return 0; }"],
  ["long long 连着写", "#include <print>\nint main(){ long long big = 9000000000LL; std::println(\"{}\", big); return 0; }"],
  ["double 与 char 声明", "#include <print>\nint main(){ double d = 1.5; char c = 'A'; std::println(\"{} {}\", d, c); return 0; }"],
  ["控制头后面直接跟一句", "#include <print>\nint main(){ for (int i = 0; i < 3; i++) std::println(\"{}\", i); return 0; }"],
  ["字符串里带 // 与分号", "#include <print>\nint main(){ std::println(\"http://x; y\"); return 0; }"],
  ["const 引用与 auto", "#include <print>\n#include <vector>\nint main(){ auto v = std::vector<int>{1,2}; for (const int& x : v) std::println(\"{}\", x); return 0; }"],
  ["块注释横跨多行", "#include <print>\n/* 说明\n   好几行 */\nint main(){ std::println(\"ok\"); return 0; }"],
  ["函数定义与前置声明", "#include <print>\nbool isPrime(int n);\nint main(){ std::println(\"{}\", isPrime(7)); return 0; }\nbool isPrime(int n){ for (int d = 2; d * d <= n; d++) if (n % d == 0) return false; return n >= 2; }"]
];
MUST_NOT.forEach(([name, src]) => {
  const r = CC.check(src);
  ok(r.problems === 0, "不许误报：" + name, r.lines.map(l => l.html.replace(/<[^>]*>/g, "")).join(" | ").slice(0, 70));
});

/* 真代码对账：分两档判。
   人写的题稿（dev/tools/cpp/ide/<cid>.json 有档）与它的 starter 必须一份编译形状都对 —— 这是读者会照抄的东西；
   机器从旧「写一行」卷拼出来的那几十场，参考文本本身就是写法清单（每条一行、由脚本摊成一份文件），
   这一档只在报告里数出来给主控看，不当红灯：判分口径与读者看到的复盘都不依赖它成不成一份程序。 */
const DATA = path.join(__dirname, "..", "frontend", "assets", "data");
const drafted = new Set(fs.readdirSync(path.join(__dirname, "..", "tools", "cpp", "ide")).map(f => f.replace(/\.json$/, "")));
let refs = 0, refBad = 0, badList = [], machine = 0, machineBad = 0;
["cpp-exam", "cppm-exam"].forEach(d => fs.readdirSync(path.join(DATA, d)).filter(f => /^p\d+/.test(f)).forEach(f => {
  PRINT.loadPart(path.join(DATA, d, f)).papers.forEach(p => {
    if (p.mode !== "ide") return;
    const src = String((p.selftest || {}).refs || [""][0]);
    const st = String(p.starter || "");
    const draftedOne = drafted.has(p.cid);
    if (draftedOne) {
      refs++;
      const r = CC.check(src);
      if (r.problems) { refBad++; if (badList.length < 6) badList.push(p.cid + "：" + r.lines.map(l => l.html.replace(/<[^>]*>/g, "")).join(" | ").slice(0, 80)); }
      if (st.trim() && CC.check(st).problems) { refBad++; badList.push(p.cid + " starter：" + CC.check(st).lines.length + " 处"); }
    } else {
      machine++;
      if (CC.check(src).problems) machineBad++;
    }
  });
}));
ok(refBad === 0, "题稿那 " + refs + " 场的参考写法与骨架都不许被模拟编译报错", badList.join(" ；").slice(0, 220));
console.log("  （机器拼的那 " + machine + " 场是「每条一行的写法清单」，其中 " + machineBad + " 场拼出来还不是完整程序 —— 判分与复盘不依赖它，记在任务书 §20.4 的欠账里）");

console.log("\n模拟编译自测：" + (pass + fail) + " 项，失败 " + fail + " 项");
process.exit(fail ? 1 : 0);
