/* 喵站 · C++ 入门 考卷分部 p17：第 71–74 课（第九轮 · 递归 + 前向声明 + 内存地址 + 指针初见）
 *
 * 每场卷照 cpp-exam/p13.js 的形状与硬指标（cpp-exam-check 逐条对账）：
 *   1. kind:"paper"，题型只用笔试引擎认的六种；
 *   2. 各题 score 相加正好 100；
 *   3. 源稿每一条【任务】都有题用 coversTask 对着它；
 *   4. 带 coversTask 的题合计 >=50 分；choice >=2；output >=1；
 *   5. 每题带 why；selftest 的 refs 判 100、wrongs 判 <60、loose 判 >=60。
 *
 * 守的闸线：c71、c72、c73 卷面不出现指针声明；new、delete、智能指针、struct、class 一律不碰。
 *           第 73 课只考地址与 & 取地址，指针留给第 74 课那场。
 *
 * 验收：node dev/tools/cpp-exam-check.cjs --only c71,c72,c73,c74
 */
window.MIAO_CPP_EXAM_P17 = {
  papers: [
    {
      cid: "c71", kind: "paper", mode: "ide", authored: "a2fb9d87", file: "main.cpp", pass: 60, title: "第 71 课考试 · 递归：函数调用自己", task: "任务题目：写一个递归的 sum_to，收一个 n，返回 1+2+…+n；动手之前先把出口想清楚 —— n 等于 1 的时候该 return 什么", hint: "想不起来就回看正文【演示 3】那个 sum_to、【演示 1】的 factorial 两行结构，还有【常见坑】第一条没有出口会怎样。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 26, coversTask: 1, stem: "补出 sum_to 里递归那一句：把当前的 n 和下层还回来的和加起来交上去。", acceptRegex: ["n\\s*\\+\\s*sum_to\\s*\\(\\s*n\\s*-\\s*1\\s*\\)"], acceptOn: "code", sample: "return n + sum_to(n - 1);", why: "整句是 return n + sum_to(n - 1); —— 加号左边是手里已有的 n，右边是等下层还的活儿，而 n - 1 就是那句「让规模变小」。return 不能漏，漏了上层收到的是空。" },
        { id: "q2", type: "code", score: 37, coversTask: 1, stem: "补出 sum_to 的出口那一句：只有 1 个数时，和就是 1，直接交货，不再喊自己。", acceptRegex: ["if\\s*\\(\\s*n\\s*(==|<=)\\s*1\\s*\\)\\s*return\\s+1\\s*;"], acceptOn: "code", sample: "if (n == 1) return 1;", why: "出口就是那级最矮的楼梯：if 先问一句能不能直接答，能答就 return 交货，一句都不再往下问。漏了它，那叠欠条没有底，运行时栈被吃光。" },
        { id: "q3", type: "code", score: 37, coversTask: 1, stem: "写出 sum_to 的函数头：返回整数、名字叫 sum_to、收一个整数。", acceptRegex: ["int\\s+sum_to\\s*\\(\\s*int"], acceptOn: "code", sample: "int sum_to(int n) {", why: "还回来的是一份和，所以返回值写 int；收进来的那步数是原料，也写成 int。返回值一省，编译器就不认这个定义了。" }
      ],
      selftest: {
        refs: [
          "int sum_to(int n) {\n}\nint main() {\n    return n + sum_to(n - 1);\n    if (n == 1) return 1;\n    return 0;\n}\n"],
        wrongs: [
          "",
          "sum_to(n - 1);",
          "if (n == 1) return 0;",
          "void sum_to(int n) {"],
        loose: [
          "int   sum_to ( int   n ) {\n}\nint main() {\n    return  n  +  sum_to ( n - 1 ) ;\n    if( n <= 1 ) return  1 ;\n    return 0;\n}\n"]
      }
    },
    {
      cid: "c72", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 72 课考试 · 先声明后定义：函数的预告片", task: "任务题目：把源稿里那行 is_prime 的声明整个删掉，再编译一次，看编译器甩来哪句错；把这句错的长相记下来，想清楚它为什么正好证明声明有用", hint: "想不起来就回看正文【演示 1】那三段的摆法、【演示 2】那两个互相喊的函数，还有【常见坑】第一条和第四条。",
      notes: ["声明只讲形状、以分号结尾；定义带花括号身体，同一个函数的定义只能有一份。", "同一个函数的声明可以出现好几次，只要形状一样；声明末尾的分号不能少，少了编译器会把下一行的开头当成续写。", "声明里参数的类型必须和定义一字不差，参数名可以各写各的，圆括号里也可以只写类型不写名字。", "没写声明是 use of undeclared identifier，红线画在调用那一行；没写定义卡在链接那一步报 undefined reference，两个长相不同。", "even 和 odd 互相喊就靠开头两行预告片：我喊你、你喊我，光排顺序排不出来。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "在文件开头给 is_prime 写一行预告片：只有形状、以分号结尾，没有花括号。", acceptRegex: ["\\bbool\\s+\\w+\\s*\\(\\s*(int\\s*\\w*)?\\s*\\)\\s*;"], acceptOn: "code", sample: "bool is_prime(int n);", why: "声明只讲形状、以分号结尾，编译器先在本子上记下这个名字；定义才带花括号身体。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "在 main 里调用一次 is_prime，把一只 int 变量或一个数递给它。", acceptRegex: ["is_prime\\s*\\(\\s*(?!int\\b)(\\w+|\\d+)\\s*\\)"], acceptOn: "code", sample: "is_prime(n)", why: "调用之前必须先见到那个函数的名字 —— 要么定义写在上面，要么先来一行声明，编译器是一遍扫到底的。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "把 is_prime 的身体写成真正的定义放在 main 后面：签名收一个 int、带花括号，里面 return true 和 return false 都得有。", acceptRegex: ["\\bbool\\s+\\w+\\s*\\(\\s*int\\s+\\w+\\s*\\)\\s*\\{", "\\breturn\\s+false\\s*;", "\\breturn\\s+true\\s*;", "\\bint\\s+main[\\s\\S]*\\bbool\\s+\\w+\\s*\\("], acceptOn: "code", sample: "bool is_prime(int n) {\n    if (n < 2) return false;\n    return true;\n}", why: "定义只能有一份；把它写在 main 后面正是这一行预告片换来的自由。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "用一条 std::println 在那个循环里把数和判断结果一起打出来：格式串里两个占位坑，逗号后面按顺序给值。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\\{\\}[^\"]*\"\\s*,"], acceptOn: "code", sample: "std::println(\"{} {}\", n, is_prime(n) ? \"是素数\" : \"不是\");", why: "几个坑就给几个值；三目那一句把 bool 换成两段文字，打出来比 true false 好看。" },
        { id: "q5", type: "code", score: 15, coversTask: 1, stem: "把这份程序写成能跑的形：搬进打印工具箱（#include <print>），开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n\nint main() {", why: "缺 #include 就没人认识 std::println；没有 main，链接器找不到入口。" },
        { id: "q6", type: "code", score: 20, coversTask: 1, stem: "任务那一删：把声明那行删掉再编译一次，在原处留一行注释写下报错里你认出的那个词（四个字以上），然后把声明加回来交卷。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 报错说 use of undeclared identifier is_prime，红线画在调用那一行", why: "本子上没登记过这个名字，扫到调用那行当场拦下；正则只能验你确实写了注释，写的内容对不对得人来读，这一条判不严格。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nbool is_prime(int n);                  // 声明：预告片，注意分号\n\nint main() {\n    for (int n : {2, 9, 17, 21}) {\n        std::println(\"{} {}\", n, is_prime(n) ? \"是素数\" : \"不是\");\n    }\n    return 0;\n}\n\nbool is_prime(int n) {                 // 定义：正片放在 main 后面\n    if (n < 2) return false;\n    for (int i = 2; i * i <= n; ++i)\n        if (n % i == 0) return false;\n    return true;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n\nbool is_prime(int n) {\n    if (n < 2) return false;\n    return true;\n}\n\nint main() {\n    int n = 17;\n    if (is_prime(n)) {\n        n = 1;\n    }\n    return 0;\n}\n",
          "#include <print>\n\nint main() {\n    std::println(\"{}\", 7);\n    return 0;\n}\n",
          "#include <print>\nbool is_prime(int n) { return n > 1; }\nint main() {\n    std::println(\"{}\", is_prime(7));\n    return 0;\n}\n"],
        loose: [
          "# include  <print>\nbool  is_prime ( int ) ;        // 预告片可以只写类型\n\nint  main ( )\n{\n    int  n = 17;\n    bool  ok = is_prime ( n );\n    std::println( \"数 {} 是素数吗 {}\" , n , ok );   // 删掉上面那行时编译器说认不出 is_prime\n    return 0;\n}\n\nbool is_prime(int k)\n{\n    if (k < 2) return false;\n    for (int i = 2; i * i <= k; ++i)\n        if (k % i == 0) return false;\n    return true;\n}\n"]
      }
    },
    {
      cid: "c73", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 73 课考试 · 内存与地址：变量住在哪一号柜子", task: "任务题目：把 age 的地址打印出来，同一个程序编译运行两次，比对两次的号；再自己加一行打印 &age2，确认它和 &age 不是同一个柜子；最后说清楚地址为什么写成 0x 开头", hint: "想不起来就回看正文【演示 2】那行 false、【演示 3】的 sizeof 两行比对，还有【常见坑】第三条关于两次运行的号会不会一样。",
      notes: ["程序每次被放到内存的哪个位置是系统临场定的，所以两趟运行之间号不同；同一趟里问同一个变量，号才是稳的，任何逻辑都不该写死某个具体地址。", "& 站在变量前面是取地址，站在类型后面是起外号 —— 同一个符号两份工。", "占几格由类型定：int 通常占 4 格，跟装的是 15 还是一百万无关；sizeof 就是问这个的，写 sizeof c 这种形式。", "两个变量的地址相同，说明它们是同一组柜子的两个名字，不是互不相干的两个盒子。", "机器执行 int age = 15; 是先把地址和名字对上，再按 int 腾 4 个连续的柜子、把 15 摊进去；编号是腾出来那一刻就定好的。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "用一条 std::println 问出 age 的门牌号：格式串里用 {:p} 这个坑，逗号后面写 & 再加变量名。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{:p\\}[^\"]*\"\\s*,\\s*&\\s*\\w+"], acceptOn: "code", sample: "std::println(\"age   的地址: {:p}\", &age);", why: "& 读作取地址，写在变量前面就问这个变量住在几号柜；打地址要用 {:p} 这个坑，普通 {} 打不出规整的号。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "把这份程序编译运行两次，在那行打印旁边留一行注释，写下你看到的两个号是相同还是不同。", acceptRegex: ["//[^\\n]*(不同|一样|相同|变)"], acceptOn: "buffer", sample: "// 跑两次这里的号不一样，程序每次被放到哪儿是系统临场定的", why: "号不同是正常的，不是 bug；正则只能验你确实写了这么一行注释，写的内容对不对得人来读，这一条判不严格。" },
        { id: "q3", type: "code", score: 15, coversTask: 2, stem: "复制一份：再声明一只 int，初值不给数字，直接把第一只变量的值抄过来。", acceptRegex: ["\\bint\\s+\\w+\\s*=\\s*[A-Za-z_]\\w*\\s*;"], acceptOn: "code", sample: "int age2 = age;", why: "复制过去的是柜子里摊着的那个值，不是柜子本身；起编号得重新腾一组才有。" },
        { id: "q4", type: "code", score: 20, coversTask: 2, stem: "验证各住各家：用一条 std::println 把「两只的地址是不是同一个」打出来，逗号后面写 & 一只 == & 另一只。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*&\\s*\\w+\\s*==\\s*&\\s*\\w+"], acceptOn: "code", sample: "std::println(\"同一个柜子吗？{}\", &age == &age2);", why: "比较号用 & 取地址再 ==，打出来是 bool；两个名字同号说明压根是同一组柜子，那就是起外号。" },
        { id: "q5", type: "code", score: 20, coversTask: 2, stem: "把 age2 改成一个新值，再用一条 std::println 把两只的值一起打出来：格式串里两个占位坑。", acceptRegex: ["\\w+\\s*=\\s*\\d+\\s*;", "std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*,\\s*\\w+"], acceptOn: "code", sample: "age2 = 16;\nstd::println(\"age = {}, age2 = {}\", age, age2);", why: "各改各的：改副本不碰原件，这也是传值那种「改了白改」的底子。" },
        { id: "q6", type: "code", score: 15, coversTask: 3, stem: "任务第 3 条：在文件里另起一行注释，写下地址为什么用 0x 开头（要点到它是几进制）。", acceptRegex: ["//[^\\n]*(16|十六)"], acceptOn: "buffer", sample: "// 0x 是十六进制的前缀，每一位正好顶 4 个二进制位，几十亿格的编号这样写短一半", why: "这一条为什么这么出：思考题在这块编辑器里只能验「你写了注释、而且点到进制」，句子本身对不对要靠人读。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint main() {\n    int age = 15;\n    double score = 92.5;\n\n    std::println(\"age   的值  : {}\", age);\n    std::println(\"age   的地址: {:p}\", &age);      // 跑两次这里的号不一样，程序被放到哪儿是系统临场定的\n    std::println(\"score 的地址: {:p}\", &score);    // 0x 打头是 16 进制，编号这样写短一半\n\n    int age2 = age;\n    std::println(\"age2 的地址: {:p}\", &age2);\n    std::println(\"同一个柜子吗？{}\", &age == &age2);\n\n    age2 = 16;\n    std::println(\"age = {}, age2 = {}\", age, age2);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n\nint main() {\n    int age = 15;\n    std::println(\"age = {}\", age);\n    return 0;\n}\n",
          "#include <print>\n\nint main() {\n    int age = 15;\n    int age2 = age;\n    std::println(\"age2 = {}\", age2);\n    return 0;\n}\n",
          "#include <print>\n\nint main() {\n    int age = 15;\n    std::println(\"{:p}\", &age);   // 两次的号不同\n    return 0;\n}\n"],
        loose: [
          "#  include <print>\nint  main ( )\n{\n    int  n1 = 15;\n    std::println( \"n1 的值 {}\" , n1 );\n    std::println( \"n1 门牌 {:p}\" , & n1 );      // 再跑一次门牌变了，两趟之间不同是正常\n    int  n2 = n1 ;\n    std::println( \"n2 门牌 {:p}\" , &n2 );       // 0x 打头是十六进制，长编号写起来短\n    std::println( \"同一个家吗 {}\" , &n1 == &n2 );\n    n2 = 20;\n    std::println(\"n1 {} n2 {}\", n1, n2);\n    return 0;\n}\n"]
      }
    },
    {
      cid: "c74", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 74 课考试 · 指针基础：一张写着门牌号的纸条", task: "任务题目：声明一个 double 变量 d 给它 1.5，做一张 double* 的纸条指向它，再通过这张纸条把 d 改成 9.9；再写一个 void swap_ptr，收两个 int 指针，把两个数的值真交换掉；最后说清楚 int* p 里那个星号和 *p = 100 里那个星号各干什么", hint: "想不起来就回看正文【演示 2】那句 p = &other; 和【演示 3】那三句 tmp 打头的交换，还有【常见坑】第一条和第四条。",
      notes: ["挨着类型写的 * 是户口，说明纸条记的是哪种门牌；挨着变量写在表达式里的 * 是动作，叫解引用。", "int* p = &age; 之后写 *p = 100，等价于 age = 100；想让纸条换个指向就写 p = &other;，左边不带星号。", "纸条上还没抄号就顺着 *p 去写，编译一路放行，跑起来直接 Segmentation fault：p 里是那一格留下的旧数字。", "一行写 int* a, b; 只有 a 是指针，b 是普通的 int；规矩是一条：一行只声明一个指针，或者老老实实写成 int *a, *b;。", "p == &age 打出来是 true：纸条记的号就是 &age 问出来的那个号。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "声明一只 double 把 1.5 装进去，再写一张 double* 的纸条记住它的地址。", acceptRegex: ["\\bdouble\\s+\\w+\\s*=\\s*\\d*\\.\\d+\\s*;", "\\bdouble\\s*\\*\\s*\\w+\\s*=\\s*&\\s*\\w+\\s*;"], acceptOn: "code", sample: "double d = 1.5;\ndouble* p = &d;", why: "星号挨着类型写，是这张纸条的户口：它记的是 double 的门牌；右边用 & 问到号再抄进去。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "别写 d 的名字，顺着纸条把那格改成 9.9。", acceptRegex: ["\\*\\s*\\w+\\s*=\\s*\\d+\\.\\d+\\s*;"], acceptOn: "code", sample: "*p = 9.9;", why: "表达式里挨着变量写的那个 * 是动作，叫解引用：顺着号找上门直接写，等价于 d = 9.9。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "再打一条 std::println，把顺着纸条摸出来的内容打出来：逗号后面写 * 加纸条名。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\*\\s*\\w+"], acceptOn: "code", sample: "std::println(\"*p 顺藤摸瓜 : {}\", *p);", why: "& 从东西拿到号，* 从号拿到内容：打 *p 就是打 d 那一格里摊着的值。" },
        { id: "q4", type: "code", score: 20, coversTask: 2, stem: "写 swap_ptr 那一类的函数头部：两个参数都得是记 int 门牌的纸条，各带一个 *。", acceptRegex: ["\\bvoid\\s+\\w+\\s*\\(\\s*int\\s*\\*\\s*\\w+\\s*,\\s*int\\s*\\*\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "void swap_ptr(int* a, int* b) {", why: "递进去的是门牌号不是值，函数里才碰得到原件 —— 这是复印件那套碰不到的天花板。" },
        { id: "q5", type: "code", score: 20, coversTask: 2, stem: "在这个函数体里用三句话换掉两格的内容：先把 *a 的内容抄进一只 int 备用盒，再把 *b 写进 *a，最后把备用盒那份写回 *b。", acceptRegex: ["\\bint\\s+\\w+\\s*=\\s*\\*\\s*\\w+\\s*;", "\\*\\s*\\w+\\s*=\\s*\\*\\s*\\w+\\s*;", "\\*\\s*\\w+\\s*=\\s*\\w+\\s*;"], acceptOn: "code", sample: "int tmp = *a;\n*a = *b;\n*b = tmp;", why: "左边带 * 才写进别人的柜子；抄下来那一份是不带 * 的普通 int。" },
        { id: "q6", type: "code", score: 15, coversTask: 3, stem: "任务第 3 条：在文件里用一行注释写清楚，int* p 里的 * 和 *p = 100 里的 * 各自是什么。", acceptRegex: ["//[^\\n]*(类型|户口|动作|解引用|内容|地址)"], acceptOn: "buffer", sample: "// 挨着类型写的 * 是户口，说这张纸条记的是 int 的门牌；写在表达式里的 * 是动作，顺着号取内容", why: "判据永远是看它站在哪儿。正则只能验注释里点到了这些词，句子对不对得人来读，这一条判不严格。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nvoid swap_ptr(int* a, int* b) {\n    int tmp = *a;\n    *a = *b;\n    *b = tmp;\n}\n\nint main() {\n    double d = 1.5;\n    double* p = &d;\n    *p = 9.9;\n    std::println(\"d = {}\", d);\n    std::println(\"*p 顺藤摸瓜 : {}\", *p);\n\n    int x = 1, y = 9;\n    swap_ptr(&x, &y);\n    std::println(\"换完：x = {}, y = {}\", x, y);\n    // 挨着类型写的 * 是户口，说 p 记的是 double 的门牌；表达式里的 * 是顺着地址取内容\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n\nvoid swap_ptr(int a, int b) {\n    int tmp = a;\n    a = b;\n    b = tmp;\n}\n\nint main() {\n    int x = 1, y = 9;\n    swap_ptr(x, y);\n    std::println(\"x = {}, y = {}\", x, y);\n    return 0;\n}\n",
          "#include <print>\n\nint main() {\n    double d = 1.5;\n    double* p = &d;\n    std::println(\"{:p}\", p);\n    return 0;\n}\n",
          "#include <print>\n\nint main() {\n    double d = 1.5;\n    double* p = &d;\n    *p = 9.9;\n    std::println(\"{}\", *p);\n    return 0;\n}\n"],
        loose: [
          "# include <print>\nvoid  trade ( int *  left , int *  right )\n{\n    int  hold = * left ;\n    * left  = * right ;\n    * right  = hold ;\n}\n\nint  main ( )\n{\n    double  price = 1.5 ;\n    double *  tag = & price ;\n    * tag = 9.9 ;\n    std::println(\"price {}\", price);\n    std::println( \"摸出来 {}\" , * tag ) ;\n    int  a = 1 ,  b = 9;\n    trade( &a , &b );\n    std::println(\"a {} b {}\", a, b);\n    // 类型旁边的星号是户口，表达式里的星号才是顺着门牌取内容\n    return 0;\n}\n"]
      }
    },
  ]
};
