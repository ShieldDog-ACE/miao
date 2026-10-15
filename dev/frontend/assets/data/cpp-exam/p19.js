/* 喵站 · C++ 入门 考卷分部 p19：第 79–81 课（第九轮 · 入门收官：lambda 三件套）
 *
 * 每场卷照 cpp-exam/p13.js 的形状与硬指标（cpp-exam-check 逐条对账）：
 *   1. kind:"paper"，题型只用笔试引擎认的六种；
 *   2. 各题 score 相加正好 100；
 *   3. 源稿每一条【任务】都有题用 coversTask 对着它，任务题合计 ≥50 分；
 *   4. choice ≥2；output ≥1；每题带 why；
 *   5. selftest 的 refs 判 100、wrongs 判 <60、loose 判 ≥60。
 *
 * 守的闸线：三场卷都不碰 struct（83）、模板（84）、map（96）、set（100）、class（112），
 *   也不碰其他标准算法（count_if、find_if、transform 一族，82 课才教），只用第 65 课的 sort。
 *   读者看得见的字段一律中文括号，函数名裸写。
 * c81 是入门最后一课，那场里放了一道把入门串起来的大综合题（只用已教过的构造）。
 *
 * 验收：node dev/tools/cpp-exam-check.cjs --only c79,c80,c81
 */
window.MIAO_CPP_EXAM_P19 = {
  papers: [
    {
      cid: "c79", kind: "paper", mode: "ide", authored: "c4012288", file: "main.cpp", pass: 60, title: "第 79 课考试 · lambda：一次性的小函数", task: "任务题目：写一把 lambda，收一个 int、返回它的平方，把 square(9) 打印出来；再顺手做一把不收任何参数、只还一句文字的小工具，喊它三次", hint: "想不起来就回看正文【演示 1】那两把工具、【演示 2】的 square，还有【常见坑】第一条关于句末分号。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 26, coversTask: 1, stem: "补出求平方那把工具的开头那一截：中括号空着、参数表收一个 int。（只写关键前半句就行）", acceptRegex: ["\\[\\s*\\]\\s*\\(\\s*int"], acceptOn: "code", sample: "auto square = [](int x) { return x * x; };", why: "句式是 auto square = [](int x) { return x * x; }; —— 那对空中括号是 lambda 的身份证，整个省掉编译器就报 expected expression；空着则明说「我不拿外面的东西」。" },
        { id: "q2", type: "code", score: 37, coversTask: 1, stem: "补出花括号里那一句：把收进来的数自己乘自己，再交出去。", acceptRegex: ["return\\s+\\w+\\s*\\*\\s*\\w+\\s*;"], acceptOn: "code", sample: "auto square = [](int x) { return x * x; };", why: "花括号里只留一条出货口：return 把算好的乘积交回给喊它的那一句。少了 return，屏幕上出现的是 no matching function for call to println —— 因为 square(9) 还回来的是空。" },
        { id: "q3", type: "code", score: 37, coversTask: 1, stem: "写一行：喊响这把工具，把 9 递进去，再把还回来的结果打印成一行。", acceptRegex: ["println", "square\\s*\\(\\s*9\\s*\\)"], acceptOn: "code", sample: "std::println(\"square(9) = {}\", square(9));", why: "定义处的参数表可以整个省，调用处的那对圆括号一个都不能少 —— 少了括号递出去的是那把工具本身，不是 81。" }
      ],
      selftest: {
        refs: [
          "#include <print>\nint main() {\n    auto square = [](int x) { return x * x; };\n    auto square = [](int x) { return x * x; };\n    std::println(\"square(9) = {}\", square(9));\n    return 0;\n}\n"],
        wrongs: [
          "",
          "auto square(int x) { return x * x; };",
          "auto square = [](int x) { return x + x; };",
          "std::println(\"square(9) = {}\", square);"],
        loose: [
          "int main() {\n    auto  square = [ ] ( int x ) { return x * x; } ;\n    auto square = [ ] ( int  x ) {   return   x*x;   } ;\n    std :: println (  \"{}\" ,  square ( 9 ) ) ;\n    return 0;\n}\n"]
      }
    },
    {
      cid: "c80", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 80 课考试 · 捕获：让 lambda 记住外面的变量", task: "任务题目：源稿那把 bump 写成 [&counter]，身体里一句 counter++，喊两次外面真变 2。把中括号改成 [counter]，编译器会拦你 —— 说清它为什么拦、以及这一课给的解法是什么", hint: "想不起来就回看正文【演示 2】那条报错、【演示 1】的两行输出，还有那张照片对一根线的示意图。",
      notes: ["按值带进来的那份被当成常量：拿它做加减、拼字符串都行，唯独不能给它赋值，所以报错里有 in lambda capture of type 'const int' 那半句。", "外面 int counter = 0 一点不是 const，只读的是包里那份复印件；没在中括号里点名报的是 use of undeclared identifier，那是另一条错。", "[x] 在定义那一刻复印一份，之后原件怎么改都不关它的事；[&x] 读到的是外面那个变量的最新值，给它赋值改的就是外面那个盒子本身。", "一把 [&] 全带上是省事，但外面哪几个盒子被动过一眼看不出来，哪天某个盒子先没了就难查。", "中括号里点名可以一次带好几个：[&calls, &open] 各挂各的 &，带进去的线就各指各的原件。"],
      questions: [
        { id: "q1", type: "code", score: 30, coversTask: 1, stem: "任务那条：把中括号里的 & 抹掉写一次（写成 [counter] 那种），身体里照旧给它加一，编译一遍让它拦你，然后把那行注释掉留在原位。", acceptRegex: ["\\[\\s*(\\w+)\\s*\\][^{]*\\{[^}]*\\b\\1\\s*(\\+\\+|=[^=])"], acceptOn: "buffer", sample: "// auto bump = [counter] { counter++; };   ← 只改了中括号，编译当场拦下", why: "中括号不带 & 就是复印一份进包里，那份是只读的；counter++ 读出来、加一、最后一步要写回包里那盒，写不动。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "先在外面写好原件：声明一只 int 并给它 0。", acceptRegex: ["\\bint\\s+\\w+\\s*=\\s*0\\s*;"], acceptOn: "code", sample: "int counter = 0;", why: "盒子先存在，线才有得指：外面那只盒子就是按引用带进去时真正被写的那一只。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "再写一把留线的：中括号里那个名字前面挂 &，身体里给它加一。", acceptRegex: ["\\[\\s*&\\s*(\\w+)\\s*\\][^{]*\\{[^}]*\\b\\1\\s*(\\+\\+|=[^=])"], acceptOn: "code", sample: "auto bump = [&counter] { counter++; };", why: "包里没有第二个盒子，两次 counter++ 写的都是外面那个 0，所以攒得到 2。" },
        { id: "q4", type: "code", score: 20, coversTask: 1, stem: "在那行旁边留一行注释，写下编译器拦你的理由：点到它抱怨的是包里那一份（只读、复印件、const 都算）。", acceptRegex: ["//[^\\n]*(只读|复印|const|capture|拦)"], acceptOn: "buffer", sample: "// 报错是 cannot assign to variable counter in lambda capture of type const int：说的是包里那份复印件", why: "关键在半句 in lambda capture of type：抱怨的是捕获进来的那一份，不是外面原件；正则只能验注释里点到词，写的内容对不对得人来读，这一条判不严格。" },
        { id: "q5", type: "code", score: 15, coversTask: 1, stem: "把这份程序写成能跑的形：搬进打印工具箱（#include <print>），开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n\nint main() {", why: "缺 #include 就没人认识 std::println；没有 main，链接器找不到入口。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint main() {\n    int counter = 0;\n    auto bump = [&counter] { counter++; };      // 留一根线：写的就是外面那只盒子\n    bump();\n    bump();\n    std::println(\"counter = {}\", counter);\n\n    // auto bad = [counter] { counter++; };   ← 把 & 抹掉再编译：拦在编译期\n    // 报错是 cannot assign to variable counter in lambda capture of type const int：只读的是包里那份复印件\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n\nint main() {\n    int counter = 0;\n    auto bump = [&counter] { counter++; };\n    bump();\n    std::println(\"counter = {}\", counter);\n    return 0;\n}\n",
          "#include <print>\n\nint main() {\n    int counter = 0;\n    return 0;\n}\n",
          "#include <print>\n\nint main() {\n    int base = 100;\n    int counter = 0;\n    auto add_base = [base](int x) { return base + x; };\n    std::println(\"{}\", add_base(5));\n    return 0;\n}\n"],
        loose: [
          "#  include < print >\nint  main ( )\n{\n  int  tally = 0;                                  // 原件先存在，线才有得指\n  auto  tick = [&  tally ]  {  tally ++ ; };\n  tick();\n  tick();\n  std::println( \"tally = {}\", tally );\n  // auto cross = [tally] { tally = tally + 1; };   抹掉 & 之后编译不过\n  // 按值抄进包里的是一份只读复印件，最后那一步要写它，就被 const 拦下\n  return 0;\n}\n"]
      }
    },
    {
      cid: "c81", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 81 课考试 · lambda 配 sort：自定义排队规则", task: "任务题目：源稿给 std::sort 派了一把 [](int a, int b) { return a > b; } 的裁判，串从大到小排。把那句 a > b 改成 a < b，运行，说清顺序变成了什么样、为什么", hint: "想不起来就回看正文【演示 2】那个两版对照、那张裁判问答示意图，还有【常见坑】第一条关于平手要答假。",
      notes: ["std::sort 只给头尾两截时默认也是从小到大；想换规矩就派裁判，第三个格子就是留给它的。", "平手那次必须答假，所以规矩只能用 > 和 <，不能写 >= 或 <=。", "裁判会被喊很多次，不是一场只问一次，所以答案必须自洽：别在身体里改 a 或 b 的值。", "规矩可以有两层：先比长度再比字面，写法是 if (a.size() != b.size()) return a.size() < b.size(); 再接一句 return a < b;。", "按值捕获进来的那份停在定义那一刻的值，后来把原件改了也不算；sort 不靠返回值交货，它改的就是那串本身。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "备好那串数：一只 std::vector<int>，花括号里按源稿给上五个值。", acceptRegex: ["std::vector\\s*<\\s*int\\s*>\\s+\\w+\\s*=\\s*\\{[^}]+\\}"], acceptOn: "code", sample: "std::vector<int> nums = {5, 2, 8, 1, 9};", why: "先有串才有得排：sort 排的就是这一串自己，不用你接返回值。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "现场捏一把裁判：中括号空的，圆括号里收两个 int，身体里 return 一句谁该站前面的比较。", acceptRegex: ["\\[\\s*\\]\\s*\\(\\s*int\\s+\\w+\\s*,\\s*int\\s+\\w+\\s*\\)", "return\\s+\\w+\\s*[<>]\\s*\\w+\\s*;"], acceptOn: "code", sample: "[](int a, int b) {\n    return a > b;\n}", why: "a 和 b 是 sort 每次挑出来递给它的两个元素本身；返回真的意思是 a 该排在 b 前面，不是 a 更大。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "把裁判连同头尾两截一起塞进 std::sort 的三个格子：第三个格子就是留给它的。", acceptRegex: ["std::sort\\s*\\(\\s*\\w+\\.begin\\s*\\(\\s*\\)\\s*,\\s*\\w+\\.end\\s*\\(\\s*\\)\\s*,\\s*\\["], acceptOn: "code", sample: "std::sort(nums.begin(), nums.end(), [](int a, int b) { return a < b; });", why: "sort 管怎么排，你管按什么排；挑哪两位、问多少回都由 sort 决定。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "任务那一改：裁判身体里现在写的那句是小于号版本（a 比 b 小就让它站前面）。", acceptRegex: ["return\\s+\\w+\\s*<\\s*\\w+\\s*;"], acceptOn: "code", sample: "return a < b;", why: "串于是从前往后长上去；默认规矩本来就是 a < b，这一改等于把默认规则亲手写了一遍。" },
        { id: "q5", type: "code", score: 15, coversTask: 1, stem: "用一条 std::println 把排完的那串整个打出来：格式串一个占位坑，逗号后面给那串变量。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "std::println(\"派裁判：{}\", nums);", why: "vector 能整个递给 {} 这个坑，一行就打完；顺序就是串被原地重排后的新顺序。" },
        { id: "q6", type: "code", score: 15, stem: "把这份程序写成能跑的形：排序工具箱和 vector 头都搬进来，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*algorithm\\s*>", "#\\s*include\\s*<\\s*vector\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <algorithm>\n#include <vector>\n\nint main() {", why: "std::sort 是放在 algorithm 里的函数，不搬进来没人认识它；缺 vector 头就没人认识 std::vector。" }
      ],
      selftest: {
        refs: [
          "#include <algorithm>\n#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> nums = {5, 2, 8, 1, 9};\n    std::sort(nums.begin(), nums.end(), [](int a, int b) {\n        return a < b;        // 任务：把 > 改成 <，顺序翻过来\n    });\n    std::println(\"派裁判：{}\", nums);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <algorithm>\n#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> nums = {5, 2, 8, 1, 9};\n    std::sort(nums.begin(), nums.end());\n    std::println(\"{}\", nums);\n    return 0;\n}\n",
          "#include <print>\n\nint main() {\n    auto judge = [](int a, int b) { return a > b; };\n    std::println(\"{}\", 1);\n    return 0;\n}\n",
          "#include <print>\n\nint main() {\n    return 0;\n}\n"],
        loose: [
          "# include < vector >\n# include < algorithm >\n# include < print >\n\nint  main ( )\n{\n    std::vector < int >  data = { 5 , 2 , 8 , 1 , 9 } ;\n    std::sort( data.begin( ), data.end( ), [ ] ( int  x , int  y ) {\n        return  x  <  y ;\n    } ) ;\n    std::println( \"改完 {}\" , data ) ;\n    return 0;\n}\n"]
      }
    },
  ]
};
