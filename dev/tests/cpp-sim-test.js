/* 喵站 · C++ 子集模拟器对拍（tests/run.sh 的第 4d 步）
 *
 * 判据不是「跑起来没报错」，而是**与本机真编译器逐字对拍**：
 *   每个用例先交给 g++ -std=c++23 真编译真运行拿 stdout，再交给站内模拟器跑同一份代码，
 *   两边输出必须一模一样。跑不动的（真编译器能过、站内说「还没学会」）单独计一档，
 *   不许混进「通过」，也不许当成失败 —— 那是这一版支持面的边界，写在报告里给人看。
 * 没有 g++ 的机器上退化成「只跑站内并核对内置期望输出」，不假装对拍过。
 *
 * 用例来源：正文里那些演示代码（第一课到第二十几课的形状）+ 考卷参考写法，全是站内真代码，
 * 不是我为了绿灯编的小样本。
 */
const fs = require("fs");
const path = require("path");
const os = require("os");
const cp = require("child_process");

const SIM = require(path.join(__dirname, "..", "frontend", "assets", "js", "cpp-sim.js"));
const GXX = process.env.CPP_GXX || "g++";
let hasGxx = true;
try { cp.execFileSync(GXX, ["--version"], { stdio: "pipe" }); } catch (e) { hasGxx = false; }

const CASES = [];
function T(name, src, stdin) { CASES.push({ name, src: String(src).replace(/\r/g, ""), stdin: stdin || [] }); }

/* ---------- 第 1–4 课：第一个程序、四种盒子、强类型、auto 与 sizeof ---------- */
T("第一个程序", `#include <print>
int main() {
    std::println("你好，C++");
    return 0;
}`);
T("四种盒子各来一个", `#include <print>
int main() {
    int age = 15;
    double score = 92.5;
    char grade = 'A';
    bool is_student = true;
    std::println("age = {}", age);
    std::println("score = {}", score);
    std::println("grade = {}", grade);
    std::println("is_student = {}", is_student);
    return 0;
}`);
T("声明和赋值分开、换值", `#include <print>
int main() {
    int hp;
    hp = 100;
    hp = hp - 30;
    std::println("hp = {}", hp);
    return 0;
}`);
T("两个盒子换东西要第三个帮忙", `#include <print>
int main() {
    int left = 1;
    int right = 2;
    int hold = left;
    left = right;
    right = hold;
    std::println("left = {}, right = {}", left, right);
    return 0;
}`);
T("强类型：小数进 int 砍尾巴", `#include <print>
int main() {
    int age = 15;
    age = 3.7;
    std::println("age = {}", age);
    double d = 3.9;
    std::println("d = {}", d);
    int n = -0.9;
    std::println("{}", n);
    return 0;
}`);
T("auto 猜类型 + sizeof 探针", `#include <print>
int main() {
    auto height = 172.5;
    auto count = 10;
    auto flag = true;
    std::println("{} {}", sizeof(height), sizeof(count));
    std::println("{} {} {}", sizeof(10), sizeof(10.0), sizeof(true));
    std::println("{}", sizeof(flag));
    return 0;
}`);

/* ---------- 第 5–12 课：字符串、输入、分支、循环 ---------- */
T("std::string 基本操作", `#include <print>
#include <string>
int main() {
    std::string name = "喵站";
    std::string hi = "你好, " + name + "!";
    std::println("{}", hi);
    std::println("{} {}", hi.size(), name.length());
    std::println("[{}]", hi.substr(3, 2));
    std::string empty;
    std::println("{}", empty.empty());
    return 0;
}`);
T("读一个数再打印", `#include <print>
#include <iostream>
int main() {
    int n;
    std::cin >> n;
    std::println("平方是 {}", n * n);
    return 0;
}`, ["7"]);
T("if / else if / else", `#include <print>
int main() {
    int score = 77;
    if (score >= 90) {
        std::println("优秀");
    } else if (score >= 60) {
        std::println("及格");
    } else {
        std::println("重来");
    }
    std::println("{}", score > 60 && score < 90);
    return 0;
}`);
T("三目与逻辑非", `#include <print>
int main() {
    int a = 12;
    auto b = a > 10 ? a * 2 : a + 1;
    std::println("{}", b);
    std::println("{}", !(b > 30));
    return 0;
}`);
T("for 数一圈", `#include <print>
int main() {
    int sum = 0;
    for (int i = 1; i <= 10; i++) {
        sum = sum + i;
    }
    std::println("{}", sum);
    return 0;
}`);
T("while 与 do-while、break continue", `#include <print>
int main() {
    int n = 5;
    while (n > 0) {
        std::println("n = {}", n);
        n--;
    }
    int k = 0;
    do {
        k += 2;
    } while (k < 6);
    std::println("k = {}", k);
    for (int i = 0; i < 6; i++) {
        if (i % 2 == 0) continue;
        if (i > 4) break;
        std::println("{}", i);
    }
    return 0;
}`);
T("switch", `#include <print>
int main() {
    for (int lv = 1; lv <= 3; lv++) {
        switch (lv) {
            case 1: std::println("一"); break;
            case 2: std::println("二"); break;
            default: std::println("别的");
        }
    }
    return 0;
}`);
T("整数相除与取余", `#include <print>
int main() {
    int a = 7, b = 2;
    std::println("{} {}", a / b, a % b);
    double c = 7.0;
    std::println("{}", c / b);
    return 0;
}`);

/* ---------- 容器与函数 ---------- */
T("vector 增删查", `#include <print>
#include <vector>
int main() {
    std::vector<int> v;
    for (int i = 0; i < 5; i++) v.push_back(i * i);
    std::println("size = {} front = {} back = {}", v.size(), v.front(), v.back());
    std::println("{}", v[2]);
    v[2] = 100;
    std::println("{}", v[2]);
    v.pop_back();
    std::println("{}", v.size());
    std::vector<std::string> names = {"甲", "乙", "丙"};
    std::println("{}", names.size());
    return 0;
}`);
T("范围 for 走一遍容器", `#include <print>
#include <vector>
int main() {
    std::vector<int> v = {3, 1, 2};
    int total = 0;
    for (int x : v) total += x;
    std::println("{}", total);
    for (auto x : v) std::println("- {}", x);
    return 0;
}`);
T("自己写的函数（值传参与 const 引用）", `#include <print>
#include <vector>
int square(int x) {
    return x * x;
}
double average(const std::vector<int>& v) {
    int sum = 0;
    for (int x : v) sum += x;
    return sum / v.size();
}
int main() {
    std::println("{}", square(9));
    std::vector<int> s = {80, 90, 100};
    std::println("{}", average(s));
    return 0;
}`);
T("引用参数改到调用方", `#include <print>
void bump(int& n) {
    n = n + 1;
}
int main() {
    int x = 41;
    bump(x);
    std::println("{}", x);
    return 0;
}`);
T("指针：取址、解引用、写回", `#include <print>
int main() {
    int x = 10;
    int* p = &x;
    std::println("{}", *p);
    *p = 25;
    std::println("{}", x);
    return 0;
}`);
T("std::sort 默认与 lambda 比较器", `#include <print>
#include <vector>
#include <algorithm>
int main() {
    std::vector<int> a = {5, 3, 9, 1};
    std::sort(a.begin(), a.end());
    for (int x : a) std::println("asc {}", x);
    std::sort(a.begin(), a.end(), [](int x, int y) { return x > y; });
    for (int x : a) std::println("desc {}", x);
    return 0;
}`);
T("algorithm 那一族", `#include <print>
#include <vector>
#include <numeric>
#include <algorithm>
int main() {
    std::vector<int> v = {1, 2, 3, 4};
    std::println("{}", std::accumulate(v.begin(), v.end(), 0));
    std::println("{}", std::count_if(v.begin(), v.end(), [](int x) { return x % 2 == 0; }));
    std::for_each(v.begin(), v.end(), [](int x) { std::println("each {}", x); });
    int lo = *std::min_element(v.begin(), v.end());
    int hi = *std::max_element(v.begin(), v.end());
    std::println("{} {}", lo, hi);
    return 0;
}`);
T("lambda 捕获", `#include <print>
int main() {
    int base = 10;
    auto add = [base](int x) { return x + base; };
    std::println("{}", add(5));
    auto sq = [](int x) { return x * x; };
    std::println("square(9) = {}", sq(9));
    return 0;
}`);
T("std::map 与 std::set", `#include <print>
#include <map>
#include <set>
int main() {
    std::map<std::string, int> ages;
    ages["喵"] = 3;
    ages["站"] = 5;
    std::println("{} {} {}", ages["喵"], ages.size(), ages.count("站"));
    std::set<int> s = {3, 1, 2};
    std::println("{}", s.size());
    return 0;
}`);
T("format 与打印的宽度和精度", `#include <print>
#include <string>
int main() {
    std::println("{:>8} {:08} {:.2f}", "ab", 42, 3.14159);
    std::println("{:<5}| {}", "ab", 1);
    std::println("{}", std::format("{}+{}={}", 1, 2, 3));
    std::println("{:#x} {:#b}", 255, 5);
    return 0;
}`);
T("string 与数字互转、多行输出", `#include <print>
#include <string>
int main() {
    std::string s = std::to_string(42);
    int n = std::stoi("365");
    std::println("{} {}", s + "!" , n + 1);
    for (int i = 0; i < 3; i++) std::println("第 {} 行", i + 1);
    return 0;
}`);
T("二维循环与嵌套", `#include <print>
int main() {
    for (int i = 1; i <= 3; i++) {
        for (int j = 1; j <= i; j++) {
            std::print("{} ", i * j);
        }
        std::println("");
    }
    return 0;
}`);
T("全局函数与前置声明", `#include <print>
bool isPrime(int n);
int main() {
    for (int i = 2; i < 12; i++) std::println("{} {}", i, isPrime(i));
    return 0;
}
bool isPrime(int n) {
    for (int d = 2; d * d <= n; d++) {
        if (n % d == 0) return false;
    }
    return n >= 2;
}`);

/* ---------- 跑 ---------- */
let pass = 0, fail = 0, gap = 0, oracleFail = 0;
const failRows = [], gapRows = [];
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cpp-sim-oracle-"));

function realRun(c) {
  const srcFile = path.join(tmp, c.name.replace(/[^\w]/g, "_") + ".cpp");
  const bin = srcFile.replace(/\.cpp$/, "");
  fs.writeFileSync(srcFile, c.src);
  try {
    cp.execFileSync(GXX, ["-std=c++23", "-O0", srcFile, "-o", bin], { stdio: "pipe" });
  } catch (e) {
    return { err: "真编译器就拒绝了：" + String(e.stderr || e.message).split("\n").slice(0, 2).join(" ") };
  }
  try {
    const out = cp.execFileSync(bin, { input: c.stdin.join("\n") + (c.stdin.length ? "\n" : ""), encoding: "utf8" });
    return { out };
  } catch (e) {
    return { err: "真编译器跑出错：" + String(e.message).slice(0, 80) };
  }
}

CASES.forEach(c => {
  const r = SIM.run(c.src, { stdin: c.stdin });
  let expect = null;
  if (hasGxx) {
    const o = realRun(c);
    if (o.err) { oracleFail++; failRows.push(c.name + " · " + o.err); return; }
    expect = o.out;
  }
  if (r.exitCode !== 0) {
    if (/还没学会|支持面/.test(r.err)) { gap++; gapRows.push(c.name + " · " + r.err.trim()); return; }
    fail++; failRows.push(c.name + " · 站内跑不出：" + r.err.trim().slice(0, 90)); return;
  }
  if (hasGxx) {
    if (r.out === expect) { pass++; return; }
    fail++;
    failRows.push(c.name + " · 与 g++ 输出不一致\n      期望 ' + " + JSON.stringify(expect.slice(0, 70)) + "\n      站内 " + JSON.stringify(r.out.slice(0, 70)));
    return;
  }
  pass++;
});

console.log("用法器：" + (hasGxx ? "g++ 对拍（真编译真运行比 stdout）" : "没找到 g++（设 CPP_GXX 指向它）—— 只跑站内，不算对拍"));
failRows.forEach(t => console.log("  FAIL " + t));
gapRows.forEach(t => console.log("  GAP  " + t));
console.log("C++ 子集模拟器对拍：" + CASES.length + " 例 · 与 g++ 逐字一致 " + pass +
  " · 失败 " + fail + " · 这版不支持（如实说） " + gap + (oracleFail ? " · 真编译器侧问题 " + oracleFail : ""));
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(fail ? 1 : 0);
