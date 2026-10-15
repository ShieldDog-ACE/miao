/* 喵站 · C++ 入门 考卷分部 p01：第 1–5 课（第九轮 T-23 黄金样板）
 *
 * 每场卷的硬指标（任务书 D-57/D-58，cpp-exam-check 逐条对账）：
 *   1. kind:"paper"，题型只用笔试引擎认的六种（choice/multi/blank/code/output/order）；
 *   2. 各题 score 相加必须正好 100（D-13，判分器会当场拒绝不平的卷）；
 *   3. 源稿的每条【任务】在卷里至少有一道题对着它：题目字段 coversTask 写源稿任务序号
 *      （一条题可以盖多条：coversTask: [1,2]）；cpp-exam-check 按 syllabus.json 逐条对账；
 *   4. 任务题（带 coversTask 的）合计 ≥50 分；至少 2 道 choice + 1 道 output；
 *   5. 每题带 why（复盘用）；selftest 里参考解必须 ≥60、错解必须 <60、宽松写法必须仍过。
 *
 * selftest 是机器自测字段，读者不可见：refs=参考解（判 100）、wrongs=典型错解（判不过）、
 * loose=换个空格/大小写也要判过的写法。跑法：node dev/tools/cpp-exam-check.cjs
 */
window.MIAO_CPP_EXAM_P01 = {
  papers: [
    {
      cid: "c01", kind: "paper", mode: "ide", authored: "2d09dffb", file: "main.cpp", pass: 60, title: "第 1 课考试 · 第一个程序", task: "任务题目：用 std::println 输出一行文字；理解 main 函数、头文件、编译命令", hint: "想不起来就回看本课【演示 1】和「怎么做」那两段。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 22, coversTask: 1, stem: "写一整行代码：用 std::println 打出「你好，C++」（含引号内的内容，分号收尾）。", acceptRegex: ["println\\s*\\(\\s*\"你好，C\\++\"\\s*\\)"], acceptOn: "code", sample: "std::println(\"你好，C++\");", why: "句式就是 std::println(\"内容\");—— 引号圈住文字，括号表示调用，分号收尾。" },
        { id: "q2", type: "code", score: 26, coversTask: 1, stem: "写一行：把标准库里那个打印工具箱搬进来（少了它，std::println 就是没人认识的名字）。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>"], acceptOn: "code", sample: "#include <print>", why: "#include 那一行是给预处理器看的搬运指令，把标准库里的 print 工具搬进来，std::println 才有人认识。" },
        { id: "q3", type: "code", score: 26, coversTask: 1, stem: "写一行：开出这个程序的入口 —— 返回整数、名字叫 main、后面跟一对括号和左花括号。", acceptRegex: ["int\\s+main\\s*\\("], acceptOn: "code", sample: "int main() {", why: "每个 C++ 程序有且只有一个 main，操作系统把可执行文件装进内存后就从这里开始执行。" },
        { id: "q4", type: "code", score: 26, coversTask: 1, stem: "写一行编译命令：按本课那个标准编译 main.cpp，并把产物命名为 main。", acceptRegex: ["g\\+\\+.*-o\\s*\\w+"], acceptOn: "buffer", sample: "g++ -std=c++23 main.cpp -o main", why: "-std 定语言标准，-o 定编译产物叫什么；不写 -o 的话 Linux 上默认叫 a.out。" }
      ],
      selftest: {
        refs: [
          "#include <print>\nint main() {\n    std::println(\"你好，C++\");\n}\n// g++ -std=c++23 main.cpp -o main\n"],
        wrongs: [
          "",
          "println(\"hello\");",
          "#include <iostream>",
          "void start() {",
          "// g++ main.cpp"],
        loose: [
          "#  include   < print >\nint   main ( ){\n    std::println( \"你好，C++\" );\n}\n// g++  -std=c++23   main.cpp   -o   main\n"]
      }
    },
    {
      cid: "c02", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 2 课考试 · 声明变量", task: "任务题目：声明两个变量描述自己（身高用小数、住校用布尔）并打印；分清单引号字符与双引号字符串", hint: "回看本课【演示 1】的四种盒子与「单引号 vs 双引号」那条坑。",
      notes: ["int 盒只装整数：3.14 归 double，'你' 归 char（还超一个），true 归 bool。", "声明定身份，赋值改内容；声明只许一次，赋值可以随便多少次。", "名字大小写敏感，age 与 Age 是两个变量；标识符不能拿数字开头。", "等号是「右算左装」：hp = hp - 30 先把右边算成 70，再装回 hp。", "两个盒子换东西要第三个帮忙：先借放一份，再互相接。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "写一行：用一个 double 装你的身高（值要带小数点）。", acceptRegex: ["\\bdouble\\s+\\w+\\s*[={]"], acceptOn: "code", sample: "double height = 172.5;", why: "double 是小数盒子；同一个数写进 int 盒会被砍掉小数部分，那是另一课的坑。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "写一行：用一个 bool 装「是否住校」，值只能是 true 或 false。", acceptRegex: ["\\bbool\\s+\\w+\\s*=\\s*(true|false)\\s*;"], acceptOn: "code", sample: "bool is_boarder = true;", why: "bool 只有两个值。写 1 或 0 编译器会勉强接受，但那不是本课要的形状。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "用一条 std::println 把这两样一起打出来：格式串里要有两个占位坑，逗号后面按顺序给那两个变量。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*,\\s*\\w+"], acceptOn: "code", sample: "std::println(\"身高 {}，住校 {}\", height, is_boarder);", why: "几个坑就给几个值，坑和值对不上在编译期就报错 —— 这正是 {} 占位比拼接省事的地方。" },
        { id: "q4", type: "code", score: 15, stem: "把这份程序写成能跑的形：把打印工具箱搬进来（#include），再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n\nint main() {", why: "缺 #include 就没人认识 std::println；没有 main，链接器找不到入口。" },
        { id: "q5", type: "code", score: 30, coversTask: 2, stem: "任务第 2 条：把 char 那一行的单引号换成双引号写出来（它编译不过，就是要你亲眼见），再在它旁边用一行注释写下你看到的报错里那个词。", acceptRegex: ["\\bchar\\s+\\w+\\s*=\\s*\"[^\"]*\"\\s*;", "//[^\\n]{4,}"], acceptOn: "buffer", sample: "char grade = \"A\";   // 报错第一行说 cannot convert", why: "单引号是一个字符，双引号是一段字符串，两样东西不同：char 盒拒绝装字符串，这类错在编译阶段就被拦下。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint main() {\n    double height = 172.5;\n    bool is_boarder = true;\n    char grade = \"A\";   // 报错第一行说 cannot convert\n    std::println(\"身高 {}，住校 {}\", height, is_boarder);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "double height = 172.5;\n",
          "#include <print>\nint main() {\n    int height = 172.5;\n    bool b = 1;\n    std::println(\"{}\", height);\n}\n"],
        loose: [
          "#  include   < print >\nint  main ( )\n{\n  double my_height=172.5;\n  bool boarder = false;\n  char g = \"A\";  // 编译器说 cannot convert from string literal to char\n  std::println( \"高 {} 校{}\" , my_height , boarder );\n}\n"]
      }
    },
    {
      cid: "c03", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 3 课考试 · 强类型", task: "任务题目：亲眼确认小数进 int 是砍尾巴不是四舍五入；读得懂「类型对不上」的报错", hint: "回看本课【演示 1】与【演示 2 · 砍尾巴的三兄弟】。",
      notes: ["小数装进 int 盒是砍尾巴：3.7 变 3，不是四舍五入。", "-2.9 装进 int 得到 -2：截断是往零的方向砍，不是向小。", "int 盒拒绝装字符串，这类错在编译阶段就被拦下 —— 这正是强类型的保护。", "同一句话换 double 盒：92.5 原样收下，double 盒装整数会变成 7.0。", "编译器的警告说的往往就是这种悄悄丢数据的转换，别当成耳旁风。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "开出任务 1 那一行：先准备一个 int 盒子，再把一整段字符串（双引号包住）直接塞给它 —— 这行编译不过，就是要你亲手写出来。", acceptRegex: ["\\bint\\s+\\w+\\b", "\\w+\\s*=\\s*\"[^\"]+\"\\s*;"], acceptOn: "code", sample: "int age = 15;\n    age = \"十五\";", why: "int 盒拒绝装字符串，这类错在编译阶段就被拦下 —— 这正是强类型的保护。" },
        { id: "q2", type: "code", score: 10, coversTask: 1, stem: "在这一行旁边留一行注释，把报错第一行里那个核心词抄下来（至少四个字）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 报错说 cannot convert", why: "报错第一行通常在讲「类型对不上 / cannot convert」；正则只能验你写了注释，抄得对不对要你复盘时核对。" },
        { id: "q3", type: "code", score: 20, coversTask: 2, stem: "写两行：把 3.2 和 3.9 先后装进同一个 int 盒。", acceptRegex: ["=\\s*3\\.2\\s*;", "=\\s*3\\.9\\s*;"], acceptOn: "code", sample: "age = 3.2;\n    age = 3.9;", why: "小数装进 int 盒是砍尾巴：3.2 变 3、3.9 也变 3，不是四舍五入进位。" },
        { id: "q4", type: "code", score: 15, coversTask: 2, stem: "用一条 std::println 把负数这一眼打出来：先把 -2.9 装进 int 盒，再打印那个盒子。", acceptRegex: ["=\\s*-2\\.9\\s*;", "std::println\\s*\\("], acceptOn: "code", sample: "n = -2.9; std::println(\"{}\", n);", why: "-2.9 砍成 -2，是朝 0 那一侧砍（向零截断），不是往小砍成 -3。" },
        { id: "q5", type: "code", score: 15, coversTask: 3, stem: "任务 3 的现场：把 3.7 装进 int 盒并打印它，亲眼看到这一行编译器根本不拦。", acceptRegex: ["=\\s*3\\.7\\s*;", "std::println\\s*\\("], acceptOn: "code", sample: "age = 3.7; std::println(\"age = {}\", age);", why: "类型勉强对得上（小数能勉强变整数）它就不拦，改用悄悄截断 —— 有时你就是故意只要整数部分。" },
        { id: "q6", type: "code", score: 20, stem: "把这份程序写成能跑的形：把打印工具箱搬进来（#include），再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n\nint main() {", why: "缺 #include 就没人认识 std::println；没有 main，链接器找不到入口。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint main() {\n    int age = 15;\n    age = \"十五\";   // 报错说 cannot convert from const char* to int\n    age = 3.2;\n    age = 3.9;\n    std::println(\"{}\", age);\n    int n = 0;\n    n = -2.9;\n    std::println(\"{}\", n);\n    age = 3.7;\n    std::println(\"age = {}\", age);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\nint main() {\n    int age = 15;\n    age = 3.7;\n    std::println(\"age = {}\", age);\n    return 0;\n}\n",
          "int age = 15;\nage = 3.2;\n"],
        loose: [
          "#  include < print >\nint  main ( )\n{\n  int num = 15;\n  num = \"abc\";  // 编译器提示 cannot convert\n  num = 3.2;\n  num = 3.9;   std::println( \"{}\" , num );\n  int k = 0;\n  k = -2.9;    std::println( \"{}\", k );\n  num = 3.7;   std::println( \"{}\" , num );\n}\n"]
      }
    },
    {
      cid: "c04", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 4 课考试 · auto 与 sizeof", task: "任务题目：会用 auto 声明变量，会用 sizeof 验证编译器猜成了什么类型", hint: "回看本课【演示 2】的字节数对照。",
      notes: ["auto 不是一种类型，是「替你写类型」：只在声明那一刻看右边。", "auto 猜完就定死，之后该拦的照拦：给字符串装 double 盒一样报错。", "int 占 4 字节、double 占 8 字节、bool 占 1 字节 —— 字节数是猜测的证据。", "不写变量也能直接探字面量：sizeof(10) 是 4，sizeof(10.0) 是 8，sizeof(1e3) 也是 8。", "auto 不帮你升级类型：想让 x 做小数除法，就把右边写成 10.0。"],
      questions: [
        { id: "q1", type: "code", score: 25, coversTask: 1, stem: "写出三个 auto：右边分别给一个整数、一个小数、一个 true 或 false，类型全交给编译器猜。", acceptRegex: ["\\bauto\\s+\\w+\\s*=\\s*\\d+\\s*;", "\\bauto\\s+\\w+\\s*=\\s*\\d+\\.\\d+\\s*;", "\\bauto\\s+\\w+\\s*=\\s*(true|false)\\s*;"], acceptOn: "code", sample: "auto count = 10;\nauto height = 172.5;\nauto flag = true;", why: "auto 不是一种类型，是「替你写类型」：右边是整数就猜 int，带小数点就猜 double，true/false 就猜 bool。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "用一条 std::println 把某个 auto 变量占的字节数打出来：把 sizeof 塞进这条打印里。", acceptRegex: ["std::println\\s*\\([^)]*sizeof\\s*\\("], acceptOn: "code", sample: "std::println(\"height 占 {} 字节\", sizeof(height));", why: "sizeof(x) 返回 x 占的字节数，是验证类型猜测的探针；先在心里猜一个数再打，猜没猜中一眼就看见。" },
        { id: "q3", type: "code", score: 20, coversTask: 2, stem: "任务 2 那一改：把原来那个 172.5 换成整数 172，重新写一行 auto。", acceptRegex: ["\\bauto\\s+\\w+\\s*=\\s*172\\s*;"], acceptOn: "code", sample: "auto height = 172;", why: "auto 只看右边那一刻：右边从 172.5 换成 172，盒子就跟着从 double 换成 int，不会自动升级。" },
        { id: "q4", type: "code", score: 20, coversTask: 2, stem: "用 std::println 把 sizeof(172) 打出来，亲眼看到整数字面量是 4 字节不是 8 字节。", acceptRegex: ["std::println\\s*\\([^)]*sizeof\\s*\\(\\s*172\\s*\\)"], acceptOn: "code", sample: "std::println(\"{}\", sizeof(172));", why: "整数字面量本身是 int，sizeof 就是 4 —— 这就是上一行字节数从 8 掉到 4 的原因。" },
        { id: "q5", type: "code", score: 15, coversTask: 2, stem: "在改完那一行旁边留一行注释（至少四个字），写下你觉得字节数为什么会变。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 右边是整数就猜成 int，只有 4 字节", why: "正则只能验你写了注释，写得对不对要复盘时核对 —— 预测这一步本身这块编辑器判不动。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint main() {\n    auto count = 10;\n    auto height = 172.5;\n    auto flag = true;\n    std::println(\"count  占 {} 字节\", sizeof(count));\n    std::println(\"height 占 {} 字节\", sizeof(height));\n    std::println(\"flag   占 {} 字节\", sizeof(flag));\n\n    auto new_height = 172;   // 右边是整数就猜成 int，字节数从 8 掉到 4\n    std::println(\"{}\", sizeof(172));\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\nint main() {\n    auto count = 10;\n    std::println(\"{}\", count);\n    return 0;\n}\n",
          "auto x = 10;\nstd::println(\"{}\", x);\n"],
        loose: [
          "#  include  <  print  >\nint  main ( )\n{\n  auto c = 10; auto h = 172.5; auto b = false;\n  std::println( \"h 占 {}\", sizeof( h ) );\n  auto  hh = 172;   // 换成整数就退成 int 只有 4 字节\n  std::println(\"{}\",  sizeof (172));\n}\n"]
      }
    },
    {
      cid: "c05", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 5 课考试 · auto 的字符串坑", task: "任务题目：分清「号牌 vs 工具」—— auto 接双引号拿到的是 8 字节号牌，std::string 才有功能", hint: "回看本课【演示 1】的两个 sizeof。",
      notes: ["双引号字面量的字面类型是「指向字符起点的号牌」，auto 只认字面类型，不会换成工具。", "length() 和拼接都是 std::string 身上的功能；号牌上没有这些功能。", "号牌固定 8 字节（64 位机器），别把它和文本的长度搞混。", "UTF-8 里一个汉字占 3 字节：length() 打出来的 6 是字节数，不是字数。", "要字符串工具就老实写 std::string，并把 #include <string> 一起搬进来。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "写出「对的那一种拿法」：声明一个 std::string 变量，右边给一段双引号包住的文字。", acceptRegex: ["std::string\\s+\\w+\\s*=\\s*\"[^\"]+\"\\s*;"], acceptOn: "code", sample: "std::string name2 = \"小明\";", why: "std::string 是字符串工具，自己管内存，拼接、求长度都在它身上。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "任务 1：把这个变量拼接上一段新的文字再存回它自己，然后用一条 std::println 打印结果。", acceptRegex: ["(\\w+)\\s*=\\s*\\1\\s*\\+\\s*\"[^\"]*\"\\s*;", "std::println\\s*\\("], acceptOn: "code", sample: "name2 = name2 + \"同学\";\n    std::println(\"{}\", name2);", why: "工具能拼接：左边和右边是同一只盒子，加号交出一份新的再装回去，打印出来就是「小明同学」。" },
        { id: "q3", type: "code", score: 25, coversTask: 2, stem: "任务 2：再写出「坑的那一种拿法」—— 用 auto 接一段双引号；然后把上面那行自我拼接也给它来一遍（这行编译不过，就是要你亲手试）。", acceptRegex: ["auto\\s+\\w+\\s*=\\s*\"[^\"]+\"\\s*;", "(\\w+)\\s*=\\s*\\1\\s*\\+\\s*\""], acceptOn: "code", sample: "auto name = \"小明\";\n    name = name + \"同学\";", why: "号牌上没有拼接这些功能：给 auto 接来的号牌做加号，编译期就被拦下 —— 这就是本课那个坑。" },
        { id: "q4", type: "code", score: 10, coversTask: 2, stem: "在这一行旁边留一行注释（至少四个字），写下你在报错里看到的那个核心词。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 报错说 no operator matches these operands", why: "正则只能验你写了注释，抄得对不对要复盘时核对 —— 这块编辑器判不了注释内容。" },
        { id: "q5", type: "code", score: 10, coversTask: 3, stem: "任务 3：用一条 std::println 把那个 auto 变量的 sizeof 打出来，亲眼看到它是号牌不是工具。", acceptRegex: ["std::println\\s*\\([^)]*sizeof\\s*\\("], acceptOn: "code", sample: "std::println(\"auto 接双引号 占 {} 字节\", sizeof(name));", why: "auto s = \"abc\" 得到的不是 std::string，而是固定 8 字节的号牌；字节数一打就露馅。" },
        { id: "q6", type: "code", score: 15, stem: "把两个工具箱都搬进来：打印用的 #include 和字符串用的 #include 各写一行。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "#\\s*include\\s*<\\s*string\\s*>"], acceptOn: "code", sample: "#include <print>\n#include <string>", why: "缺 #include <print> 就没人认识 std::println；std::string 这个工具来自 #include <string>。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <string>\n\nint main() {\n    std::string name2 = \"小明\";\n    name2 = name2 + \"同学\";\n    std::println(\"{}\", name2);\n\n    auto name = \"小明\";\n    name = name + \"同学\";   // 报错说 no operator matches these operands\n\n    std::println(\"auto 接双引号 占 {} 字节\", sizeof(name));\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\nint main() {\n    std::string s = \"abc\";\n    std::println(\"{}\", s);\n    return 0;\n}\n",
          "auto name = \"小明\";\nstd::println(\"{}\", name);\n"],
        loose: [
          "#  include   < print >\n# include < string >\nint  main ( )\n{\n  std::string  n2 = \"xiao\";\n  n2  =  n2 + \" tongxue\";\n  std::println( \"{}\" , n2 );\n  auto  n1 = \"a\";\n  n1 = n1 + \"b\";   // cannot convert 说号牌不能加\n  std::println(  \"{}\" , sizeof( n1 ) );\n}\n"]
      }
    },
  ]
};
