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
      cid: "c51", kind: "paper", pass: 60,
      title: "第 51 课考试 · 第一个函数",
      task: "任务题目：再写一个 say_goodbye，在 main 里先 hello 后 goodbye；把 say_hello 改成输出三行自我介绍，说清你改的是哪一段、被喊几次会打几行",
      hint: "想不起来就回看本课【演示 1】的「备案与执行」、【演示 2】的三行输出和【演示 3】的少了括号那起事故。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          coversTask: 1,
          stem: "要做出「先说你好、再说下次再聊」，下面哪种写法办得到？",
          options: [
            "定义好 say_hello 和 say_goodbye 两个函数，在 main 里先写 say_hello()，再写 say_goodbye()",
            "把 say_goodbye 的定义写在 say_hello 的定义下面，不用在 main 里调用",
            "在 main 里只写两个函数名，括号留到最后统一加",
            "把两句打印都塞进 say_hello，再喊它两次"
          ],
          answer: 0,
          why: "调用顺序就是执行顺序：谁被写在 main 的哪一行，谁就在那个时刻被跳进去执行。光有定义不调用，屏幕上一个字都不会出现。" },
        { id: "q2", type: "output", score: 14,
          coversTask: 1,
          stem: "这段程序打印什么？（一行一条，按顺序写）\nvoid say_hello() {\n    std::println(\"你好\");\n}\nvoid say_goodbye() {\n    std::println(\"下次再聊\");\n}\nint main() {\n    say_hello();\n    say_goodbye();\n    say_hello();\n    return 0;\n}",
          acceptLines: ["你好", "下次再聊", "你好"],
          why: "三次调用、三行输出。第二次喊 say_hello 又把函数体从头执行了一遍，函数不会记得自己上次跑过 —— 这就是「定义一次、调用任意次」。" },
        { id: "q3", type: "code", score: 18,
          coversTask: 1,
          stem: "（任务题）写一个函数的定义：不需要任何输入、不交回任何东西，名字是 say_goodbye，函数体里用 std::println 打印「下次再聊」。",
          acceptRegex: ["void\\s+say_goodbye\\s*\\(", "下次再聊"],
          why: "骨架就是 void say_goodbye() { std::println(\"下次再聊\"); } —— 开头那个 void 是返回类型位置，什么都不交也必须写；名字后面那对空括号是函数定义的一部分。" },
        { id: "q4", type: "output", score: 14,
          coversTask: 2,
          stem: "已经把 say_hello 改成打印三行自我介绍（三行依次是「我叫王小明」「我在学 C++」「今天第 51 课」），main 里连喊它两次。程序打印什么？（一行一条，按顺序写六行）",
          acceptLines: ["我叫王小明", "我在学 C++", "今天第 51 课", "我叫王小明", "我在学 C++", "今天第 51 课"],
          why: "三行写在函数体里，一次调用打三行，两次调用就整段重来一遍 —— 一共六行，顺序完全一致。想让内容变只在函数体里改一次，想多打一遍只加一句调用，两件事互不牵扯。" },
        { id: "q5", type: "blank", score: 10,
          coversTask: 2,
          stem: "做上一条任务时，那三行自我介绍应该写在 say_hello 的____里（填两个字：那对符号圈出的范围），而不是写在 main 里。",
          accept: ["花括号", "函数体", "大括号"],
          why: "定义函数时，花括号圈出的就是这张值日表的内容；写在 main 里就变成只执行一次的普通语句，下次要用还得再抄一遍。" },
        { id: "q6", type: "choice", score: 12,
          stem: "main 里写了一行 say_hello;（名字后面没有括号，也没有别的东西）。结果是什么？",
          options: [
            "编译报错，必须有括号才能通过",
            "能编译，最多一句警告，但函数一次都不会执行",
            "能编译，效果和 say_hello() 一样，只是慢一点",
            "运行到这一行就崩溃退出"
          ],
          answer: 1,
          why: "函数名本身就代表那个函数，光写出来只是引用它；那对空括号才是「现在执行」的指令。所以这行合法、安静、什么也不做 —— 症状是少输出而不是红字，最难查。" },
        { id: "q7", type: "multi", score: 10,
          stem: "关于本课的函数定义，下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: [
            "定义必须写在调用它的代码前面，否则编译器报 was not declared in this scope",
            "开头那个 void 是返回类型，什么都不交也得写",
            "函数定义可以写在另一个函数的花括号里面",
            "一个函数可以被调用任意多次，包括零次"
          ],
          answers: [0, 1, 3],
          why: "第三条不成立：C++ 不允许在函数里定义函数，所有定义一律平铺在外面。其余三条正是本课的三条纪律。" },
        { id: "q8", type: "order", score: 10,
          stem: "把「程序执行一次函数调用」的四个动作排成正确顺序。",
          steps: [
            "走到 main 里那句带括号的名字",
            "跳出 main，进入函数的花括号第一行",
            "函数体里一行行走完，撞到右花括号",
            "沿来路回到调用那一行的下一行继续"
          ],
          answer: [0, 1, 2, 3],
          why: "这一跳一回是原子的：函数没跑完之前，main 后面的语句绝不偷跑；这也是为什么调用顺序决定了输出顺序。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: "你好\n下次再聊\n你好", q3: "void say_goodbye() {\n    std::println(\"下次再聊\");\n}", q4: "我叫王小明\n我在学 C++\n今天第 51 课\n我叫王小明\n我在学 C++\n今天第 51 课", q5: "花括号", q6: 1, q7: [0, 1, 3], q8: [0, 1, 2, 3] }
        ],
        wrongs: [
          { q1: 1, q2: "你好\n下次再聊", q3: "say_goodbye();", q4: "我叫王小明\n我在学 C++\n今天第 51 课", q5: "main", q6: 0, q7: [2, 3], q8: [0, 3, 2, 1] }
        ],
        loose: [
          { q1: "0", q2: " 你好 \n下次再聊\n你好", q3: "void say_goodbye ( ) { println ( \"下次再聊\" ) ; }", q4: "我叫王小明\n我在学C++\n今天第51课\n我叫王小明\n我在学C++\n今天第51课", q5: "函数体", q6: "1", q7: [0, 1, 3], q8: [0, 1, 2, 3] }
        ]
      }
    },
    {
      cid: "c52", kind: "paper", pass: 60,
      title: "第 52 课考试 · 带参数的函数",
      task: "任务题目：写 void print_stars(int n)，打印 n 个星号；写 void print_age(int age)，输出「我 X 岁了」。说清调用时那份料进了哪个空位、函数里改形参会不会动到调用者的变量",
      hint: "想不起来就回看本课【演示 3】的 print_stars 骨架、那张复印件示意图，以及【演示 2】的两个进料口怎么按位置对号。",
      questions: [
        { id: "q1", type: "choice", score: 10,
          stem: "已有定义 void greet(std::string name)。执行到 main 里的 greet(\"小明\") 时，程序做了什么？",
          options: [
            "造一个叫 name 的 std::string 变量，把「小明」复制进去，然后执行函数体",
            "把「小明」搬进函数，main 那边从此不再有这个名字",
            "只核对类型对不对，不做任何复制，name 直接指向字面量",
            "让 name 变成「小明」的别名，函数里改它外面跟着改"
          ],
          answer: 0,
          why: "形参就是函数内部的一个普通局部变量，它的初值来自调用时递进来的那份**副本**。搬走、别名都是别的语言的规矩，C++ 本课这条是值传递。" },
        { id: "q2", type: "output", score: 14,
          coversTask: 1,
          stem: "这段程序打印什么？（一行一条，按顺序写两行）\nvoid print_stars(int n) {\n    for (int i = 0; i < n; i++) {\n        std::print(\"*\");\n    }\n    std::println();\n}\nint main() {\n    print_stars(3);\n    print_stars(2);\n    return 0;\n}",
          acceptLines: ["***", "**"],
          why: "n 是每次现递的料：喊 3 走三步、喊 2 走两步，函数体一个字没改。std::print 不换行所以星号排成一串，循环后那句 std::println 把每次的输出各自收成一行。" },
        { id: "q3", type: "code", score: 18,
          coversTask: 1,
          stem: "（任务题）写出 print_stars 的定义：一个 int 进料口（名字随意，按 n 算），函数体里用 for 打印 n 个 * ，打完再换行。",
          acceptRegex: ["print_stars\\s*\\(\\s*int", "for\\s*\\("],
          why: "骨架就是 void print_stars(int n) 加一个从 0 数到 n 的 for，循环体打一个星号。开头返回类型写 void，因为它只做事、不交东西。" },
        { id: "q4", type: "code", score: 16,
          coversTask: 2,
          stem: "（任务题）写出 print_age 的定义：收一个 int 参数 age，函数体里用 std::println 输出「我 20 岁了」这种句子，数字由 age 决定。",
          acceptRegex: ["print_age\\s*\\(\\s*int", "岁了"],
          why: "写法是 void print_age(int age) { std::println(\"我 {} 岁了\", age); } —— 花括号里那条占位符换成 age 这个进料口，递什么数就说几岁。" },
        { id: "q5", type: "output", score: 12,
          stem: "这段程序打印什么？（一行一条）\nvoid add_year(int age) {\n    age = age + 1;\n}\nint main() {\n    int my_age = 20;\n    add_year(my_age);\n    std::println(\"{}\", my_age);\n    return 0;\n}",
          acceptLines: ["20"],
          why: "add_year 改的是那份复印件，函数一返回它就被销毁；main 里的 my_age 从头到尾没被人碰过，照样是 20。想让函数把新数交回来，得用返回值。" },
        { id: "q6", type: "choice", score: 8,
          stem: "有个函数带两个 std::string 参数：void show(std::string city, std::string name)。调用时把两个实参写反了，编译器的态度是？",
          options: ["照常编译通过，输出里城市和名字互换位置", "报错，要求实参与形参同名", "警告一句并自动按名字纠正", "运行时崩溃"],
          answer: 0,
          why: "参数靠位置认领，不靠名字。两个空位规格一样，你递反了它也无从知道哪个「应该」是城市 —— 这种 bug 只能靠读调用点抓。" },
        { id: "q7", type: "multi", score: 10,
          stem: "下面关于参数的说法，哪些是对的？（多选，错勾任何一项整题 0 分）",
          options: [
            "实参可以是字面量，也可以是一个变量，编译器只看值的类型",
            "几个形参就必须递几份实参，少一个编译器在调用点报错",
            "把 int 递给 std::string 形参会被拦下，报错里会提到类型转换",
            "函数里给形参赋新值，调用者手上那个变量也跟着变"
          ],
          answers: [0, 1, 2],
          why: "最后一条正好是值传递的反面：函数只碰复印件。前三条都是本课演示与常见坑里反复出现的规矩。" },
        { id: "q8", type: "order", score: 12,
          coversTask: 1,
          stem: "把「写一个带 int 参数的 print_stars」的四个动作排成正确顺序。",
          steps: [
            "在定义的括号里留一个 int 进料口，起名叫 n",
            "写 for 循环：计数器从 0 走到小于 n，共 n 步",
            "循环体里用 std::print 打一个星号，不换行",
            "循环结束后用 std::println 补一个换行"
          ],
          answer: [0, 1, 2, 3],
          why: "先有进料口才谈得上用 n；循环负责次数，print 负责内容，最后那次换行是收尾 —— 少掉第四步，几次调用的星号会全挤在同一行。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: "***\n**", q3: "void print_stars(int n) {\n    for (int i = 0; i < n; i++) {\n        std::print(\"*\");\n    }\n    std::println();\n}", q4: "void print_age(int age) {\n    std::println(\"我 {} 岁了\", age);\n}", q5: "20", q6: 0, q7: [0, 1, 2], q8: [0, 1, 2, 3] }
        ],
        wrongs: [
          { q1: 3, q2: "***", q3: "void print_stars() {\n    std::println(\"***\");\n}", q4: "void print_age(age) {\n    std::println(\"我几岁了\");\n}", q5: "21", q6: 1, q7: [3], q8: [2, 1, 0, 3] }
        ],
        loose: [
          { q1: "0", q2: " *** \n  **", q3: "void  print_stars ( int  n ) {  for( int i=0;i<n ;i++ ) print ( \"*\" ) ;  }  println ( ) ;", q4: "void print_age(int age){println(\"我 {} 岁了\",age);}", q5: "20 ", q6: "0", q7: [0, 1, 2], q8: [0, 1, 2, 3] }
        ]
      }
    },
    {
      cid: "c53", kind: "paper", pass: 60,
      title: "第 53 课考试 · 返回值交作业",
      task: "任务题目：写 int square(int x) 返回平方，打印 5 和 12 的平方；写 int sub(int a, int b) 返回差，验证 10 - 4 = 6。说清 return 干了哪两件事",
      hint: "想不起来就回看本课【演示 2】的 square、【演示 3】的提前返回，以及那张「投料、算一遍、掉出一个值」的示意图。",
      questions: [
        { id: "q1", type: "choice", score: 10,
          stem: "已有 int add(int a, int b) { return a + b; }。关于调用处那个表达式 add(3, 5)，哪种理解最准确？",
          options: [
            "它是一条指令，跑完就没了，留不下东西",
            "它整个就等于交回来的那个值 8：能打印、能存进变量、能继续参加运算",
            "它必须先赋给一个变量才能被使用",
            "它等于顺便把 8 打印到了屏幕上"
          ],
          answer: 1,
          why: "return 把结果递回调用处，调用处那一整串从值上看就是 8。这就是函数能搭积木的原因：交回值比打印一句有用得多。" },
        { id: "q2", type: "output", score: 16,
          coversTask: 1,
          stem: "这段程序打印什么？（一行一条，按顺序写两行）\nint square(int x) {\n    return x * x;\n}\nint main() {\n    std::println(\"{}\", square(5));\n    std::println(\"{}\", square(12));\n    return 0;\n}",
          acceptLines: ["25", "144"],
          why: "函数体里没有一句打印，打印全在 main：square 把 25 和 144 交回来，std::println 负责显示。两次调用各自算一遍，函数不记得上一次。" },
        { id: "q3", type: "code", score: 18,
          coversTask: 1,
          stem: "（任务题）写出 square 的定义：交回一个 int，收一个 int 参数 x，函数体里用 return 把 x 的平方递回调用处。",
          acceptRegex: ["square\\s*\\(\\s*int", "return\\s+x\\s*\\*\\s*x"],
          why: "写法是 int square(int x) { return x * x; } —— 开头那个 int 是承诺，return 交货并当场结束函数。" },
        { id: "q4", type: "code", score: 16,
          coversTask: 2,
          stem: "（任务题）写出 sub 的定义：交回一个 int，收两个 int 参数 a 和 b，函数体里把差递回去。",
          acceptRegex: ["sub\\s*\\(\\s*int", "return\\s+a\\s*-\\s*b"],
          why: "写法是 int sub(int a, int b) { return a - b; } —— 两个进料口按位置认领，交回的作业是一个 int。减法要留意顺序：a - b 和 b - a 是两个答案。" },
        { id: "q5", type: "output", score: 12,
          coversTask: 2,
          stem: "已知 int sub(int a, int b) { return a - b; }。这段程序打印什么？（一行一条，按顺序写两行）\nstd::println(\"{}\", sub(10, 4));\nstd::println(\"{}\", sub(10, 4) + sub(1, 1));",
          acceptLines: ["6", "6"],
          why: "sub(10, 4) 就是 6，所以第一行 6；第二行是 6 加上 sub(1, 1) 的 0，还是 6。第二次调用重新算了一遍，结果没被存起来也没被上次影响。" },
        { id: "q6", type: "choice", score: 10,
          stem: "函数体里先写了 return a / b;，下面还跟着一句 std::println。那句打印会怎样？",
          options: ["永远不执行，但程序照样能编译通过", "每次都执行，因为 return 只是把值记下来", "编译报错：return 后面不许再写语句", "只有当 b 不为 0 时才执行"],
          answer: 0,
          why: "return 干两件事：交货、当场结束函数。它后面的语句一次也轮不到，而且编译器不一定提醒你这行到不了 —— 这是常见坑里最难自查的一种。" },
        { id: "q7", type: "multi", score: 10,
          stem: "下面关于返回值的说法，哪些是对的？（多选，错勾任何一项整题 0 分）",
          options: [
            "开头写了 int，函数里每条能走到的路径都必须 return 一个 int",
            "同一个函数调用两次就计算两次，它不会替你存着上次的结果",
            "把结果打印在函数里，比交回一个值更灵活",
            "void 函数的调用不能当成值来用，int x = say_hello(); 会被编译器拦下"
          ],
          answers: [0, 1, 3],
          why: "第三条说反了：打印只能给人看，值能存、能比、能继续算，只有交回值才搭得成积木。第一条漏了会收到一句「非 void 函数没有返回语句」的警告。" },
        { id: "q8", type: "blank", score: 8,
          stem: "开头写的是 int，函数体里却一句 return 都没有。编译器的态度是不报错、只给一条____，大意是非 void 函数没有返回语句；这条绝不能忽略。",
          accept: ["警告", "warning", "告警"],
          why: "语法上合法，所以编译器只能警告；但漏交货时调用处拿到的是没人负责的垃圾值，同一程序换台机器就可能变样 —— 见到这条警告就去补出口。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: "25\n144", q3: "int square(int x) {\n    return x * x;\n}", q4: "int sub(int a, int b) {\n    return a - b;\n}", q5: "6\n6", q6: 0, q7: [0, 1, 3], q8: "警告" }
        ],
        wrongs: [
          { q1: 0, q2: "10\n24", q3: "void square(int x) {\n    std::println(\"{}\", x * x);\n}", q4: "int sub(int a, int b) {\n    return b - a;\n}", q5: "6\n10", q6: 2, q7: [2], q8: "错误" }
        ],
        loose: [
          { q1: "1", q2: " 25 \n144 ", q3: "int  square ( int  x ) {  return  x*x ;  }", q4: "int sub ( int a , int b ) { return a - b ; }", q5: "6\n6", q6: "0", q7: [0, 1, 3], q8: "WARNING" }
        ]
      }
    },
    {
      cid: "c54", kind: "paper", pass: 60,
      title: "第 54 课考试 · 返回 bool 的函数",
      task: "任务题目：写 bool is_even(int n) 判断偶数并测 3 个数；写 bool is_pass(int score)，60 分以上返回 true。说清这种函数交回的是什么、调用处能拿它做什么",
      hint: "想不起来就回看本课【演示 2】的 is_even、【演示 3】is_pass 的两种用法，以及那张「裁判只按一个开关」的示意图。",
      questions: [
        { id: "q1", type: "choice", score: 10,
          stem: "bool is_even(int n) 的函数体，最省事又正确的写法是哪一种？",
          options: [
            "return n % 2 == 0;",
            "if (n % 2 == 0) { return true; } else { return false; }",
            "return n % 2;",
            "std::println(n % 2 == 0);"
          ],
          answer: 0,
          why: "比较表达式本身就是 bool，直接交货。第二种是同一件事摊成三行；第三种交的是 int，奇数会变成 true，答案整个反了；第四种只打印没交货。" },
        { id: "q2", type: "output", score: 14,
          coversTask: 1,
          stem: "这段程序打印什么？（一行一条，按顺序写三行）\nbool is_even(int n) {\n    return n % 2 == 0;\n}\nint main() {\n    std::println(\"{}\", is_even(4));\n    std::println(\"{}\", is_even(7));\n    std::println(\"{}\", is_even(0));\n    return 0;\n}",
          acceptLines: ["true", "false", "true"],
          why: "bool 被打印出来就是 true 和 false 这两个词。第三个是特意留的边界测试：0 除 2 余 0，按规则它是偶数。" },
        { id: "q3", type: "code", score: 16,
          coversTask: 1,
          stem: "（任务题）写出 is_even 的定义：收一个 int 参数 n，把「它是偶数吗」的答案交回去。",
          acceptRegex: ["is_even\\s*\\(\\s*int", "return\\s+n\\s*%\\s*2\\s*==\\s*0"],
          why: "写法是 bool is_even(int n) { return n % 2 == 0; } —— 开头承诺 bool，return 后面直接放判断，用取余（第 9 课）判断整除。" },
        { id: "q4", type: "code", score: 16,
          coversTask: 2,
          stem: "（任务题）写出 is_pass 的定义：收一个 int 参数 score，60 分以上（含 60）返回 true。",
          acceptRegex: ["is_pass\\s*\\(\\s*int", "score\\s*>=\\s*60"],
          why: "写法是 bool is_pass(int score) { return score >= 60; } —— 「含不含 60」这类边界一旦定了，就写进这一个地方，所有人共用同一个答案。" },
        { id: "q5", type: "choice", score: 12,
          coversTask: 2,
          stem: "is_pass 的函数体写的是 return score >= 60;。那么 is_pass(60) 交回什么？",
          options: ["true —— 60 分算及格", "false —— 60 分不算", "编译报错：边界值不能这么比", "要再看一眼 is_pass 被调用了几次才知道"],
          answer: 0,
          why: "大于等于把 60 归进及格档，和第 28 课分档时的边界习惯一致。选谁都可以，但必须只写在函数里一处，不能五处各写各的。" },
        { id: "q6", type: "output", score: 12,
          stem: "已知 bool is_pass(int score) { return score >= 60; }。这段程序打印什么？（一行一条）\nint score = 59;\nif (is_pass(score)) {\n    std::println(\"恭喜及格\");\n} else {\n    std::println(\"差一点\");\n}",
          acceptLines: ["差一点"],
          why: "if 的括号里没有任何比较号 —— 装进去的就是函数交回的那张 bool。59 分得到 false，门卫拦下，走 else。" },
        { id: "q7", type: "multi", score: 10,
          stem: "下面关于这类「裁判型」函数的说法，哪些是对的？（多选，错勾任何一项整题 0 分）",
          options: [
            "名字用 is_ 开头，调用处读起来就像一句问话",
            "它交回的 bool 能直接放进 if 的括号，也能赋给一个 bool 变量",
            "写成 return score = 60; 会让所有人都及格",
            "用的时候必须再加一句「等于 true」，否则 if 不认"
          ],
          answers: [0, 1, 2],
          why: "第三条是 = 与 == 那个老坑搬进函数：交回的是 60 转成的 bool，非 0 一律 true。第四条多余 —— 门卫要的就是 bool，你再比一次反而多一个写错的机会。" },
        { id: "q8", type: "blank", score: 10,
          stem: "is_even、is_pass、is_leap_year 这一类函数只回答「是」或「否」，行话把它们叫做____型函数（填两个字，源稿用的词是「提问」「裁判」那一类意思）。",
          accept: ["提问", "判断", "裁判", "谓词"],
          why: "记住它们的性格：只回答问题，不打印、不改东西、不记上一次。规则写在函数里，选择写在 if 里，两边各自单独可改。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: "true\nfalse\ntrue", q3: "bool is_even(int n) {\n    return n % 2 == 0;\n}", q4: "bool is_pass(int score) {\n    return score >= 60;\n}", q5: 0, q6: "差一点", q7: [0, 1, 2], q8: "提问" }
        ],
        wrongs: [
          { q1: 2, q2: "true\nfalse\nfalse", q3: "bool is_even(int n) {\n    return n / 2 == 0;\n}", q4: "bool is_pass(int score) {\n    return score > 60;\n}", q5: 1, q6: "恭喜及格", q7: [3], q8: "整数" }
        ],
        loose: [
          { q1: "0", q2: " true \nfalse\n  true", q3: "bool  is_even ( int  n ) { return n%2==0 ; }", q4: "bool is_pass(int score){return score>=60;}", q5: "0", q6: "差一点 ", q7: [0, 1, 2], q8: "裁判" }
        ]
      }
    }
  ]
};
