/* 喵站 · C++ 入门 考卷分部 p12：第 51–54 课（第九轮 · 自己写函数）
 *
 * 每场卷照 cpp-exam/p06.js 的形状与硬指标（cpp-exam-check 逐条对账）：
 *   1. kind:"paper"，题型只用笔试引擎认的六种；
 *   2. 各题 score 相加正好 100；
 *   3. 源稿每一条【任务】都有题用 coversTask 对着它；
 *   4. 带 coversTask 的题合计 ≥50 分；choice ≥2；output ≥1；
 *   5. 每题带 why；selftest 的 refs 判 100、wrongs 判 <60、loose 判 ≥60。
 *
 * 守的闸线：本分部只用到第 51–54 课教过的东西 —— 自定义函数、参数、返回值、返回 bool；
 *           lambda（56）、引用参数（60）、默认参数（68）、重载（69）、递归（71）一律不出场，
 *           也不出「函数里调用另一个自己写的函数」（55）。
 *
 * 验收：node dev/tools/cpp-exam-check.cjs --only c51,c52,c53,c54
 */
window.MIAO_CPP_EXAM_P12 = {
  papers: [
    {
      cid: "c51", kind: "paper", mode: "ide", authored: "3564ca17", file: "main.cpp", pass: 60, title: "第 51 课考试 · 第一个函数", task: "任务题目：再写一个 say_goodbye，在 main 里先 hello 后 goodbye；把 say_hello 改成输出三行自我介绍，说清你改的是哪一段、被喊几次会打几行", hint: "想不起来就回看本课【演示 1】的「备案与执行」、【演示 2】的三行输出和【演示 3】的少了括号那起事故。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 28, coversTask: 1, stem: "（任务题）写一个函数的定义：不需要任何输入、不交回任何东西，名字是 say_goodbye，函数体里用 std::println 打印「下次再聊」。", acceptRegex: ["void\\s+say_goodbye\\s*\\(", "下次再聊"], acceptOn: "code", sample: "void say_goodbye() {\n    std::println(\"下次再聊\");\n}", why: "骨架就是 void say_goodbye() { std::println(\"下次再聊\"); } —— 开头那个 void 是返回类型位置，什么都不交也必须写；名字后面那对空括号是函数定义的一部分。" },
        { id: "q2", type: "code", score: 41, coversTask: 2, stem: "（任务题）写一个函数的定义：不需要输入、不交回东西，名字是 say_hello，函数体里用 std::println 打三行自我介绍（三行内容自己定）。", acceptRegex: ["void\\s+say_hello\\s*\\(", "println[\\s\\S]*println[\\s\\S]*println"], acceptOn: "code", sample: "void say_hello() {\n    std::println(\"我叫王小明\");\n    std::println(\"我在学 C++\");\n    std::println(\"欢迎一起写代码\");\n}", why: "三行都写在这张值日表的花括号里，一次调用就打三行；以后想换内容只改这一处，想多打一遍只在 main 里多加一句调用。" },
        { id: "q3", type: "code", score: 31, coversTask: 1, stem: "（任务题）两个函数都已经定义好了。写出对它们的调用，先喊 say_hello 再喊 say_goodbye，一行一句，括号别漏。", acceptRegex: ["say_hello\\s*\\(\\s*\\)[\\s\\S]{0,40}say_goodbye\\s*\\(\\s*\\)"], acceptOn: "code", sample: "say_hello();\nsay_goodbye();", why: "那对空括号才是「现在执行」的指令，写在前面还是后面决定谁先打印 —— 调用顺序就是输出顺序。" }
      ],
      selftest: {
        refs: [
          "#include <print>\nvoid say_goodbye() {\n    std::println(\"下次再聊\");\n}\nvoid say_hello() {\n    std::println(\"我叫王小明\");\n    std::println(\"我在学 C++\");\n    std::println(\"欢迎一起写代码\");\n}\nint main() {\n    say_hello();\n    say_goodbye();\n    return 0;\n}\n"],
        wrongs: [
          "",
          "say_goodbye();",
          "void say_hello() {\n    std::println(\"我叫王小明\");\n}",
          "say_goodbye();\nsay_hello();"],
        loose: [
          "void say_goodbye ( ) { println ( \"下次再聊\" ) ; }\nvoid  say_hello ( )  {  println ( \"我叫王小明\" ) ;  println ( \"我在学 C++\" ) ;  println ( \"欢迎一起写代码\" ) ;  }\nint main() {\n    say_hello  ( ) ;\n    say_goodbye();\n    return 0;\n}\n"]
      }
    },
    {
      cid: "c52", kind: "paper", mode: "ide", authored: "42ffca2f", file: "main.cpp", pass: 60, title: "第 52 课考试 · 带参数的函数", task: "任务题目：写 void print_stars(int n)，打印 n 个星号；写 void print_age(int age)，输出「我 X 岁了」。说清调用时那份料进了哪个空位、函数里改形参会不会动到调用者的变量", hint: "想不起来就回看本课【演示 3】的 print_stars 骨架、那张复印件示意图，以及【演示 2】的两个进料口怎么按位置对号。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 26, coversTask: 1, stem: "（任务题）写出 print_stars 的定义：一个 int 进料口（名字随意，按 n 算），函数体里用 for 打印 n 个 * ，打完再换行。", acceptRegex: ["print_stars\\s*\\(\\s*int", "for\\s*\\("], acceptOn: "code", sample: "void print_stars(int n) {\n    for (int i = 0; i < n; i++) {\n        std::print(\"*\");\n    }\n    std::println();\n}", why: "骨架就是 void print_stars(int n) 加一个从 0 数到 n 的 for，循环体打一个星号。开头返回类型写 void，因为它只做事、不交东西。" },
        { id: "q2", type: "code", score: 22, coversTask: 2, stem: "（任务题）写出 print_age 的定义：收一个 int 参数 age，函数体里用 std::println 输出「我 20 岁了」这种句子，数字由 age 决定。", acceptRegex: ["print_age\\s*\\(\\s*int", "岁了"], acceptOn: "code", sample: "void print_age(int age) {\n    std::println(\"我 {} 岁了\", age);\n}", why: "写法是 void print_age(int age) { std::println(\"我 {} 岁了\", age); } —— 花括号里那条占位符换成 age 这个进料口，递什么数就说几岁。" },
        { id: "q3", type: "code", score: 26, coversTask: 1, stem: "（任务题）print_stars 已经定义好了。在 main 里写两行调用：先让它打 3 个星号，再让它打 8 个星号。", acceptRegex: ["print_stars\\s*\\(\\s*3\\s*\\)[\\s\\S]{0,60}print_stars\\s*\\(\\s*8\\s*\\)"], acceptOn: "code", sample: "print_stars(3);\nprint_stars(8);", why: "同一个函数喂两种料：括号里的数就是那一轮循环要走几步，函数体一个字都不用改 —— 这就是带参数的价值。" },
        { id: "q4", type: "code", score: 26, coversTask: 2, stem: "（任务题）写两行：先在 main 里备好一个整数变量 years，值是 20；再把这个变量递给 print_age。", acceptRegex: ["int\\s+years\\s*=\\s*20\\s*;", "print_age\\s*\\(\\s*years\\s*\\)"], acceptOn: "code", sample: "int years = 20;\nprint_age(years);", why: "实参不限于写死的数，变量同样能递进去 —— 递的仍然是那一刻值的复印件，years 本身留在 main 里不动。" }
      ],
      selftest: {
        refs: [
          "#include <print>\nvoid print_stars(int n) {\n    for (int i = 0; i < n; i++) {\n        std::print(\"*\");\n    }\n    std::println();\n}\nvoid print_age(int age) {\n    std::println(\"我 {} 岁了\", age);\n}\nint main() {\n    print_stars(3);\n    print_stars(8);\n    int years = 20;\n    print_age(years);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "void print_stars() {\n    std::println(\"***\");\n}",
          "void print_age(age) {\n    std::println(\"我几岁了\");\n}",
          "print_stars(8);\nprint_stars(3);",
          "int years = 20;\nprint_age(20);"],
        loose: [
          "void  print_stars ( int  n ) {  for( int i=0;i<n ;i++ ) print ( \"*\" ) ;  }  println ( ) ;\nvoid print_age(int age){println(\"我 {} 岁了\",age);}\nint main() {\n    print_stars  (  3  )  ;\n    print_stars ( 8 ) ;\n    int  years  =  20  ;\n    print_age  (  years  ) ;\n    return 0;\n}\n"]
      }
    },
    {
      cid: "c53", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 53 课考试 · 返回值交作业", task: "任务题目：写 int square(int x) 返回平方，打印 5 和 12 的平方；写 int sub(int a, int b) 返回差，验证 10 - 4 = 6。说清 return 干了哪两件事", hint: "想不起来就回看本课【演示 2】的 square、【演示 3】的提前返回，以及那张「投料、算一遍、掉出一个值」的示意图。",
      notes: ["调用处那一整串（比如 add(3, 5)）从值上看就等于交回来的那个数：能打印、能存进变量、能继续参加运算，这是函数能搭积木的原因。", "return 干两件事：交货、当场结束函数。它后面的语句一次也轮不到，而且编译器不一定提醒你这行到不了。", "开头写 int 却一句 return 都没有，编译器不报错、只给一条「非 void 函数没有返回语句」的警告；漏交货时调用处拿到的是没人负责的垃圾值，换台机器就可能变样。", "同一个函数调用两次就计算两次，结果既没被存起来也没被上次影响。", "把结果打印在函数里，不如交回一个值灵活：打印只能给人看，值能存、能比、能继续算；void 函数的调用不能当值用，int x = say_hello(); 会被编译器拦下。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "写一个交回 int 的函数：圆括号里只收一个 int，函数体里用 return 把那个参数乘它自己交回来。", acceptRegex: ["int\\s+\\w+\\s*\\(\\s*int\\s+(\\w+)\\s*\\)\\s*\\{\\s*return\\s+\\1\\s*\\*\\s*\\1\\s*;"], acceptOn: "code", sample: "int square(int x) {\n    return x * x;\n}", why: "开头写了 int，函数里每条能走到的路径都必须 return 一个 int；return 算出值、递回调用处、当场结束函数，三件事一口气做完。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "在 main 里用一条 std::println 打印 5 的平方：格式串留一个占位坑，逗号后面直接拿那个函数调用 5。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\(\\s*5\\s*\\)\\s*\\)"], acceptOn: "code", sample: "std::println(\"5 的平方 = {}\", square(5));", why: "函数体里一句打印都没有，打印全在 main：调用处那一整串从值上看就是 25，能直接塞进打印里。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "再用一条 std::println 打印 12 的平方。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\(\\s*12\\s*\\)\\s*\\)"], acceptOn: "code", sample: "std::println(\"12 的平方 = {}\", square(12));", why: "同一个函数调用两次就计算两次，它不替你存着上次的结果，也不记得上一次。" },
        { id: "q4", type: "code", score: 20, coversTask: 2, stem: "任务第 2 条：写一个交回 int 的函数，圆括号里收两个 int，函数体里用 return 把前一格减后一格交回来。", acceptRegex: ["int\\s+\\w+\\s*\\(\\s*int\\s+(\\w+)\\s*,\\s*int\\s+(\\w+)\\s*\\)\\s*\\{\\s*return\\s+\\1\\s*-\\s*\\2\\s*;"], acceptOn: "code", sample: "int sub(int a, int b) {\n    return a - b;\n}", why: "两个进料口按位置对号入座：写反成 b - a 也编译得过，只是交回的是 -6。" },
        { id: "q5", type: "code", score: 15, coversTask: 2, stem: "用一条 std::println 验一次：逗号后面拿那个减法函数调用 10 和 4，屏幕上就该出现 6。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\(\\s*10\\s*,\\s*4\\s*\\)"], acceptOn: "code", sample: "std::println(\"10 - 4 = {}\", sub(10, 4));", why: "交回值比打印一句有用得多：它能打印、能存进变量、能继续参加运算，函数才搭得成积木。" },
        { id: "q6", type: "code", score: 15, stem: "把这份程序写成能跑的形：请进打印那个头文件，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n\nint main() {", why: "缺头文件就没人认识 std::println；main 是程序的入口，函数定义写在它外面。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint square(int x) {\n    return x * x;\n}\n\nint sub(int a, int b) {\n    return a - b;\n}\n\nint main() {\n    std::println(\"5 的平方 = {}\", square(5));\n    std::println(\"12 的平方 = {}\", square(12));\n    std::println(\"10 - 4 = {}\", sub(10, 4));\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n\nvoid square(int x) {\n    std::println(\"{}\", x * x);\n}\n\nint main() {\n    square(5);\n    return 0;\n}\n",
          "#include <print>\n\nint square(int x) {\n    return x * x;\n}\n\nint main() {\n    return 0;\n}\n"],
        loose: [
          "#  include < print >\nint  square ( int v )\n{\n    return v * v ;\n}\nint minus ( int p , int q ) { return p - q ; }\nint  main ( )\n{\n  std::println( \"5 平方 {}\" , square ( 5 ) ) ;\n  std::println( \"12 平方 {}\" , square(12) ) ;\n  std::println( \"差是 {}\" , minus ( 10 , 4 ) ) ;\n  return 0;\n}\n"]
      }
    },
    {
      cid: "c54", kind: "paper", mode: "ide", authored: "1926f3c0", file: "main.cpp", pass: 60, title: "第 54 课考试 · 返回 bool 的函数", task: "任务题目：写 bool is_even(int n) 判断偶数并测 3 个数；写 bool is_pass(int score)，60 分以上返回 true。说清这种函数交回的是什么、调用处能拿它做什么", hint: "想不起来就回看本课【演示 2】的 is_even、【演示 3】is_pass 的两种用法，以及那张「裁判只按一个开关」的示意图。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 21, coversTask: 1, stem: "（任务题）写出 is_even 的定义：收一个 int 参数 n，把「它是偶数吗」的答案交回去。", acceptRegex: ["is_even\\s*\\(\\s*int", "return\\s+n\\s*%\\s*2\\s*==\\s*0"], acceptOn: "code", sample: "bool is_even(int n) {\n    return n % 2 == 0;\n}", why: "写法是 bool is_even(int n) { return n % 2 == 0; } —— 开头承诺 bool，return 后面直接放判断，用取余（第 9 课）判断整除。" },
        { id: "q2", type: "code", score: 21, coversTask: 2, stem: "（任务题）写出 is_pass 的定义：收一个 int 参数 score，60 分以上（含 60）返回 true。", acceptRegex: ["is_pass\\s*\\(\\s*int", "score\\s*>=\\s*60"], acceptOn: "code", sample: "bool is_pass(int score) {\n    return score >= 60;\n}", why: "写法是 bool is_pass(int score) { return score >= 60; } —— 「含不含 60」这类边界一旦定了，就写进这一个地方，所有人共用同一个答案。" },
        { id: "q3", type: "code", score: 33, coversTask: 1, stem: "（任务题）写出判断闰年的函数定义：开头是 bool，名字 is_leap_year，收一个 int 参数 year，函数体只有一句 return —— 把「四年一闰、百年不闰、四百年又闰」这条规则写成与号、竖号串起来的复合判断。", acceptRegex: ["is_leap_year\\s*\\(\\s*int", "year\\s*%\\s*4\\s*==\\s*0", "year\\s*%\\s*100\\s*!=\\s*0", "year\\s*%\\s*400\\s*==\\s*0"], acceptOn: "code", sample: "bool is_leap_year(int year) { return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0); }", why: "写法是 bool is_leap_year(int year) { return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0); } —— return 后面不需要自己拼 if else，与号把必须同时成立的条件串起来，竖号给出例外的那一支，整个复合表达式本身就是 bool。" },
        { id: "q4", type: "code", score: 25, coversTask: 2, stem: "（任务题）在 main 里接住分数：先开一个 bool 变量 ok，把 is_pass(59) 交回的答案存进去；再写一句 if，括号里直接用这个函数调用当条件，成立就打印一行恭喜。", acceptRegex: ["bool\\s+\\w+\\s*=\\s*is_pass\\s*\\(", "if\\s*\\(\\s*is_pass\\s*\\("], acceptOn: "code", sample: "bool ok = is_pass(59); if (is_pass(60)) { std::println(\"及格，恭喜\"); }", why: "同一个返回值有两种去处：赋给 bool 变量存着用，或者直接钻进 if 的括号。后者不用再写等于 true —— 门卫要的就是 bool，多比一次只是多一个写错的机会。" }
      ],
      selftest: {
        refs: [
          "#include <print>\nbool is_even(int n) {\n    return n % 2 == 0;\n}\nbool is_pass(int score) {\n    return score >= 60;\n}\nbool is_leap_year(int year) { return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0); }\nint main() {\n    bool ok = is_pass(59); if (is_pass(60)) { std::println(\"及格，恭喜\"); }\n    return 0;\n}\n"],
        wrongs: [
          "",
          "bool is_even(int n) {\n    return n / 2 == 0;\n}",
          "bool is_pass(int score) {\n    return score > 60;\n}",
          "bool is_leap_year(int year) {\n    return year % 4 == 0;\n}",
          "int main() {\n    int ok = is_pass(59);\n    if (ok == true) {\n        std::println(\"恭喜\");\n    }\n    return 0;\n}"],
        loose: [
          "#include <print>\nint main(){bool   ok= is_pass ( 59 ) ; if( is_pass  (  60  ) ){std::println(\"及格\");}return 0;}\n    bool  is_even ( int  n ) { return n%2==0 ; }\n    bool is_pass(int score){return score>=60;}\n    bool   is_leap_year ( int   year ) { return ( year % 4   ==   0 &&  year % 100  !=  0 ) || ( year % 400 == 0 ) ; }\n"]
      }
    },
  ]
};
