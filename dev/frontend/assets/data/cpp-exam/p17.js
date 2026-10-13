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
      cid: "c71", kind: "paper", pass: 60,
      title: "第 71 课考试 · 递归：函数调用自己",
      task: "任务题目：写一个递归的 sum_to，收一个 n，返回 1+2+…+n；动手之前先把出口想清楚 —— n 等于 1 的时候该 return 什么",
      hint: "想不起来就回看正文【演示 3】那个 sum_to、【演示 1】的 factorial 两行结构，还有【常见坑】第一条没有出口会怎样。",
      questions: [
        { id: "q1", type: "choice", score: 14,
          coversTask: 1,
          stem: "写 sum_to(n) 求 1 加到 n，你只打算把正整数递进去。下面哪个出口既算得对又接得住？",
          options: ["if (n == 1) return 1;", "if (n == 1) return 0;", "不用写出口，n 每层减 1 总会到底", "if (n == 0) return 0; 然后写 return n + sum_to(n);"],
          answer: 0,
          why: "只有一个数时，和就是那个 1，所以出口 return 1。写 return 0 会把最里层交货交成 0，往上加一圈全乱；所谓不用出口，就是那条没有底的楼梯，跑起来必崩；最后那条 n 压根没变小，永远撞不上出口。" },
        { id: "q2", type: "output", score: 16,
          coversTask: 1,
          stem: "这段程序打印什么？（一行一条，两行）\nint sum_to(int n) {\n    if (n == 1) return 1;\n    return n + sum_to(n - 1);\n}\nstd::println(\"{}\", sum_to(4));\nstd::println(\"{}\", sum_to(1));",
          acceptLines: ["10", "1"],
          why: "sum_to(4) 是 4 + 3 + 2 + 1 = 10；sum_to(1) 一进门就撞上出口，直接 return 1，一次都没喊自己 —— 那是最短的一趟递归。" },
        { id: "q3", type: "code", score: 14,
          coversTask: 1,
          stem: "补出 sum_to 里递归那一句：把当前的 n 和下层还回来的和加起来交上去。",
          acceptRegex: ["n\\s*\\+\\s*sum_to\\s*\\(\\s*n\\s*-\\s*1\\s*\\)"],
          why: "整句是 return n + sum_to(n - 1); —— 加号左边是手里已有的 n，右边是等下层还的活儿，而 n - 1 就是那句「让规模变小」。return 不能漏，漏了上层收到的是空。" },
        { id: "q4", type: "choice", score: 10,
          stem: "有人把一个递归函数里那句出口判断整个删掉，其余一字不动。最可能发生什么？",
          options: ["编译器立刻报错，说函数缺 return", "编译能过，一跑就当场崩，终端打 Segmentation fault 或者栈溢出那几行", "编译能过，程序安静地算出正确答案", "编译器会自己补一个出口顶上"],
          answer: 1,
          why: "语法上没毛病，所以编译一路放行；运行时那叠欠条没有底，盒子越叠越多，栈被吃光，操作系统把程序抬走。递归的错多半不是编译错，是崩溃。" },
        { id: "q5", type: "output", score: 10,
          stem: "这段程序打印什么？（一行一条，四行）\nvoid count_down(int n) {\n    if (n <= 0) return;\n    std::println(\"进一层：{}\", n);\n    count_down(n - 1);\n    std::println(\"回一层：{}\", n);\n}\ncount_down(2);",
          acceptLines: ["进一层：2", "进一层：1", "回一层：1", "回一层：2"],
          why: "喊之前那句先印，所以往下走时是 2、1；喊之后那句要等下层彻底干完才轮到，所以回来时是 1、2。同一个函数体，两句话被那次调用劈成了两截。" },
        { id: "q6", type: "multi", score: 12,
          stem: "关于这一课的递归，下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["进门先问一句「这一步能不能直接答」，那句 if 就是出口", "每一层都得把规模切小一点，不然走不到出口", "递归喊回来的结果要不要 return 带上去，不影响最终答案", "递归能干的事循环基本都能干，而且循环不用叠那一摞盒子"],
          answers: [0, 1, 3],
          why: "第三条错得致命：喊了下层却不 return，等于问了一圈没人收到答案，编译器报 non-void function does not return a value，运气坏时给你一个乱数。其余三条正是本课的三块基石。" },
        { id: "q7", type: "blank", score: 8,
          coversTask: 1,
          stem: "递归只有两个零件：自己调用自己，还有一个负责在最简的那一步停下来 —— 那个零件课上管它叫____。",
          accept: ["出口", "出口条件", "基准情形"],
          why: "出口就是套娃的最里层：谁也不欠，直接交货。源稿那句 if (n <= 1) return 1 写的就是它。" },
        { id: "q8", type: "order", score: 16,
          coversTask: [1],
          stem: "把 sum_to(4) 算出 10 的全过程排成正确顺序。",
          steps: ["sum_to(2) 收到下层还来的 1，算出 2 + 1 = 3 往上还", "main 喊 sum_to(4)，它把活儿交给下层：4 + sum_to(3)", "sum_to(1) 撞上出口，直接 return 1，谁也不问", "sum_to(4) 收到 6，算出 4 + 6 = 10，交给 main", "sum_to(3) 收到 3，算出 3 + 3 = 6 往上还"],
          answer: [1, 2, 0, 4, 3],
          why: "先有最外面那一次调用，一路问到最简的那一步，才开始原路回话；回话的顺序正好跟往下问相反，从 2 那层起一层层往上加。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: "10\n1", q3: "return n + sum_to(n - 1);", q4: 1, q5: "进一层：2\n进一层：1\n回一层：1\n回一层：2", q6: [0, 1, 3], q7: "出口", q8: [1, 2, 0, 4, 3] }
        ],
        wrongs: [
          { q1: 1, q2: "10\n4", q3: "sum_to(n - 1);", q4: 0, q5: "进一层：2\n进一层：1\n进一层：0\n回一层：1", q6: [0, 2, 3], q7: "循环", q8: [1, 2, 3, 4, 0] }
        ],
        loose: [
          { q1: "0", q2: " 10 \n 1 ", q3: "return  n  +  sum_to ( n - 1 ) ;", q4: "1", q5: "进一层：2 \n进一层：1\n回一层：1\n回一层：2", q6: [0, 1, 3], q7: "出 口", q8: [1, 2, 0, 4, 3] }
        ]
      }
    },
    {
      cid: "c72", kind: "paper", pass: 60,
      title: "第 72 课考试 · 先声明后定义：函数的预告片",
      task: "任务题目：把源稿里那行 is_prime 的声明整个删掉，再编译一次，看编译器甩来哪句错；把这句错的长相记下来，想清楚它为什么正好证明声明有用",
      hint: "想不起来就回看正文【演示 1】那三段的摆法、【演示 2】那两个互相喊的函数，还有【常见坑】第一条和第四条。",
      questions: [
        { id: "q1", type: "choice", score: 14,
          coversTask: 1,
          stem: "源稿那个程序，把第一行 bool is_prime 的声明整个删掉，其余一字不动。编译时最可能看到哪句错？",
          options: ["use of undeclared identifier 'is_prime'，红线画在 main 里那次调用上", "undefined reference to is_prime，卡在链接那一步", "no matching function for call to 'println'", "no viable conversion from returned value of type int"],
          answer: 0,
          why: "本子上压根没登记过这个名字，编译器扫到调用那一行不认识 is_prime，当场拦下 —— 这正是那条任务要你亲眼看的东西。第二条是没写定义才会出现的链接错，长相完全不同。" },
        { id: "q2", type: "output", score: 12,
          stem: "这段程序打印什么？（一行一条，四行）\nbool is_prime(int n);                  // 声明：预告片\nint main() {\n    for (int n : {2, 9, 17, 21}) {\n        std::println(\"{} {}\", n, is_prime(n) ? \"是素数\" : \"不是\");\n    }\n    return 0;\n}\nbool is_prime(int n) {                  // 定义：正片\n    if (n < 2) return false;\n    for (int i = 2; i * i <= n; ++i)\n        if (n % i == 0) return false;\n    return true;\n}",
          acceptLines: ["2 是素数", "9 不是", "17 是素数", "21 不是"],
          why: "2 进不了那个内层循环，一路走到 return true；9 撞上 i 等于 3，21 也撞上 3，两个都提前 return false。行的顺序就是那四个初值的顺序。" },
        { id: "q3", type: "code", score: 14,
          coversTask: 1,
          stem: "把 is_prime 的声明那一行写出来：收一个 int，返回 bool，末尾别忘了那个要命的分号。",
          acceptRegex: ["bool\\s+is_prime\\s*\\(\\s*int\\s*\\w*\\s*\\)\\s*;"],
          why: "句式是 bool is_prime(int n); —— 只有头、没有花括号、以分号收。删掉这一行去做任务 1 那个实验，编译器立刻补你一句 use of undeclared identifier。" },
        { id: "q4", type: "choice", score: 12,
          stem: "下面关于声明和定义的说法，哪一句是对的？",
          options: ["声明只讲形状、以分号结尾；定义带花括号身体，同一个函数的定义只能有一份", "声明必须带上身体，否则编译器找不到函数", "定义可以写两三份，编译器自己挑一份", "声明必须写在 main 的后面，否则调用不合法"],
          answer: 0,
          why: "形状和身体是两件事：前者让人提前认识，后者才是真东西。定义写多份，接线那一步不知道该用哪个；声明则爱重复几次都行，只要形状一致。" },
        { id: "q5", type: "blank", score: 12,
          coversTask: 1,
          stem: "编译器扫源码是一路向____扫的，所以调用之前必须先见到那个函数的名字 —— 要么把定义写在上面，要么先来一行声明。（填一个字）",
          accept: ["上", "上面", "从上"],
          why: "先见后喊这条规矩的根子就在这儿：一遍扫到底，没见过的名字就是不认识。任务 1 那一删，删的正是先见到那一步。" },
        { id: "q6", type: "multi", score: 12,
          stem: "关于这一课的声明，下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["同一个函数的声明可以出现好几次，只要形状一样", "声明末尾的分号不能少，少了编译器会把下一行的开头当成续写", "声明里参数的类型可以和定义不一样，反正名字各写各的", "声明里那对圆括号可以只写类型、不写参数名"],
          answers: [0, 1, 3],
          why: "第三条说反了：参数名可以各写各的，类型却必须一字不差，否则调用处配不上号，报 declaration 与声明冲突。其余三条就是这一课的三条硬规矩。" },
        { id: "q7", type: "output", score: 12,
          stem: "这段程序打印什么？（就一行）\nbool even(int n);\nbool odd(int n);\nbool even(int n) { if (n == 0) return true; return odd(n - 1); }\nbool odd(int n) { if (n == 0) return false; return even(n - 1); }\nstd::println(\"{} {}\", even(3), odd(4));",
          acceptLines: ["false false"],
          why: "两个格子都是 false：3 是奇数，所以 even(3) 假；4 是偶数，所以 odd(4) 假。两条链都是一路减到 0 才撞上出口。这场你喊我、我喊你靠的正是开头那两行声明 —— 光排顺序排不出来。" },
        { id: "q8", type: "order", score: 12,
          coversTask: 1,
          stem: "把编译器带着 is_prime 干完的这几件事排成正确顺序。",
          steps: ["把调用和身体接上头；找不到身体就在这一步报 undefined reference", "扫到那行声明，在本子上登记 is_prime 的形状：收 int、还 bool", "扫到 main 里的调用，照本子核对参数类型与返回类型", "扫到文件下方带花括号的那一段，收下真正的身体", "程序跑起来，每次调用都跳进那具身体干活"],
          answer: [1, 2, 3, 0, 4],
          why: "先登记形状，才谈得上核对调用；核对完才轮到收身体；形状与身体都齐了才接线，最后才是运行。任务 1 那一删，卡死的是第二步。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: "2 是素数\n9 不是\n17 是素数\n21 不是", q3: "bool is_prime(int n);", q4: 0, q5: "上", q6: [0, 1, 3], q7: "false false", q8: [1, 2, 3, 0, 4] }
        ],
        wrongs: [
          { q1: 1, q2: "2 是素数\n9 是素数\n17 是素数\n21 是素数", q3: "bool is_prime(int n)", q4: 1, q5: "下", q6: [0, 2], q7: "true true", q8: [1, 2, 3, 4, 0] }
        ],
        loose: [
          { q1: "0", q2: "2 是素数 \n 9 不是\n17 是素数\n21 不是", q3: "bool  is_prime ( int n ) ;", q4: "0", q5: " 上", q6: [0, 1, 3], q7: "false  false", q8: [1, 2, 3, 0, 4] }
        ]
      }
    },
    {
      cid: "c73", kind: "paper", pass: 60,
      title: "第 73 课考试 · 内存与地址：变量住在哪一号柜子",
      task: "任务题目：把 age 的地址打印出来，同一个程序编译运行两次，比对两次的号；再自己加一行打印 &age2，确认它和 &age 不是同一个柜子；最后说清楚地址为什么写成 0x 开头",
      hint: "想不起来就回看正文【演示 2】那行 false、【演示 3】的 sizeof 两行比对，还有【常见坑】第三条关于两次运行的号会不会一样。",
      questions: [
        { id: "q1", type: "choice", score: 14,
          coversTask: 2,
          stem: "int age = 15; 之后写 int age2 = age;。把 &age2 打印出来，跟 &age 一比，最可能看到什么？",
          options: ["两个号不同 —— age2 是新腾出来的一组柜子，各住各家", "两个号相同 —— 复制值就是把盒子也复制了一份地址", "编译器报错，不许打印一个 int 变量的地址", "两个号只差 1，因为 age2 写在下一行"],
          answer: 0,
          why: "复制过去的是柜子里摊着的那个值，起编号得重新腾一组才有，所以两家的号不同。真正同号的是第 58 课那种起外号：两个名字、一个盒子。" },
        { id: "q2", type: "blank", score: 12,
          coversTask: 3,
          stem: "地址打出来形如 0x7ffd1234，开头那个 0x 说明这个数是用____进制写的 —— 几十亿格柜子的编号，用这种写法能短一半。（填一个数字或一个词）",
          accept: ["16", "16进制", "十六", "十六进制"],
          why: "0x 是十六进制的前缀。选它是因为每一位正好顶 4 个二进制位，换算不打架，而且比十进制短得多。" },
        { id: "q3", type: "output", score: 14,
          stem: "这段程序打印什么？（一行一条，三行）\nint a = 10;\nint b = a;\nb = 20;\nstd::println(\"{}\", &a == &b);\nstd::println(\"{}\", a == b);\nstd::println(\"{} {}\", a, b);",
          acceptLines: ["false", "false", "10 20"],
          why: "b 是复制出来的新盒子，地址不同 → 第一行 false；值也被改成了 20，跟 a 的 10 不相等 → 第二行 false；第三行 a 仍是 10、b 是 20，各改各的。" },
        { id: "q4", type: "choice", score: 12,
          coversTask: 1,
          stem: "源稿任务 1 让你把同一个程序编译运行两次，比对打印出来的地址。绝大多数情况下两次的号不一样，原因是？",
          options: ["程序每次被放到内存的哪个位置，是系统临场定的，号当然会变", "第二次运行必然出了 bug", "编译器把变量悄悄改了名字", "地址会跟着变量的值一起变"],
          answer: 0,
          why: "这正是任务要你亲眼确认的事：号不同是正常的，不是错。所以任何逻辑都不该写死某个具体地址；同一趟运行之内问同一个变量，号才是稳的。" },
        { id: "q5", type: "code", score: 14,
          coversTask: 2,
          stem: "写出那一行打印：把变量 age2 的门牌号打出来，别打它的值。",
          acceptRegex: ["&\\s*age2"],
          why: "关键就在变量前面那个 &：问的是位置。写成 println 里只放 age2，你打的是柜子里的东西，任务 2 就验证不了两家的界线了。" },
        { id: "q6", type: "multi", score: 12,
          coversTask: [1, 3],
          stem: "关于内存与地址，下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["同一个变量，一趟运行里问几次地址，号都一样", "int 通常占 4 格，占几格由类型定，跟装的是 15 还是一百万无关", "地址写成 0x 开头，是因为每一位正好顶 4 个二进制位", "两个变量的地址相同，说明它们是两个互不相干的盒子"],
          answers: [0, 1, 2],
          why: "第四条正好说反：号相同说明压根是同一组柜子，也就是第 58 课那种「一个盒子两个名字」。其余三条是这一课要留下的三块基石。" },
        { id: "q7", type: "blank", score: 10,
          coversTask: 2,
          stem: "站在变量前面、读作「你住几号柜」的那个符号是____。（填一个符号或它的读法）",
          accept: ["&", "取地址", "& 号"],
          why: "& 站在变量前面是取地址，站在类型后面是起外号 —— 同一个符号两份工，这一课的判断题全靠这一眼。" },
        { id: "q8", type: "order", score: 12,
          coversTask: 1,
          stem: "把机器执行 int age = 15; 之后跟地址有关的这几件事排成正确顺序。",
          steps: ["把这一组的起始编号和名字 age 对上，以后喊 age 就是喊这组柜子", "按 int 这个类型腾出 4 个连续的柜子", "把 15 按 int 的读法摊进这 4 格", "等你写 &age，问出来的是这一组的起始编号"],
          answer: [1, 2, 0, 3],
          why: "先腾地方，再摊值，再把名字拴到起始编号上 —— 编号是腾出来那一刻就定好的；只有这些都做完了，& 才问得到号。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: "十六", q3: "false\nfalse\n10 20", q4: 0, q5: "std::println(\"{:p}\", &age2);", q6: [0, 1, 2], q7: "&", q8: [1, 2, 0, 3] }
        ],
        wrongs: [
          { q1: 1, q2: "十", q3: "false\ntrue\n20 20", q4: 1, q5: "std::println(\"{}\", age2);", q6: [0, 1, 3], q7: "值", q8: [1, 2, 3, 0] }
        ],
        loose: [
          { q1: "0", q2: "16 进制", q3: " false \nfalse\n10  20", q4: "0", q5: "std::println( \"{:p}\" ,  & age2 ) ;", q6: [0, 1, 2], q7: " 取地址 ", q8: [1, 2, 0, 3] }
        ]
      }
    },
    {
      cid: "c74", kind: "paper", pass: 60,
      title: "第 74 课考试 · 指针基础：一张写着门牌号的纸条",
      task: "任务题目：声明一个 double 变量 d 给它 1.5，做一张 double* 的纸条指向它，再通过这张纸条把 d 改成 9.9；再写一个 void swap_ptr，收两个 int 指针，把两个数的值真交换掉；最后说清楚 int* p 里那个星号和 *p = 100 里那个星号各干什么",
      hint: "想不起来就回看正文【演示 2】那句 p = &other; 和【演示 3】那三句 tmp 打头的交换，还有【常见坑】第一条和第四条。",
      questions: [
        { id: "q1", type: "choice", score: 14,
          coversTask: 3,
          stem: "int* p = &age; 里那个星号，和 *p = 100; 里那个星号，是一回事吗？",
          options: ["不是：前者属于类型那一截，说这张纸条记的是 int 的门牌；后者是动作，顺着号找到内容", "是一回事：两个都是在解引用", "不是：前者是取地址，后者是解引用", "是一回事：两个都必须在声明里出现"],
          answer: 0,
          why: "这就是任务 3 的答案：挨着类型写的那个 * 是户口，说明 p 是什么类型；挨着变量写在表达式里的那个 * 是动作，叫解引用。判据永远是看它站在哪儿。" },
        { id: "q2", type: "output", score: 14,
          stem: "这段程序打印什么？（一行一条，三行）\nint age = 15;\nint* p = &age;\nstd::println(\"{}\", *p);\nstd::println(\"{}\", p == &age);\n*p = 100;\nstd::println(\"{}\", age);",
          acceptLines: ["15", "true", "100"],
          why: "p 记的号就是 &age 问出来的号，所以第二行 true；*p 顺着那个号读，拿到 15；最后 *p = 100 写的正是 age 那一格，所以第三行打出 100 —— 改的就是本人。" },
        { id: "q3", type: "code", score: 14,
          coversTask: 1,
          stem: "写出任务 1 的那张纸条：给已经存在的 double 变量 d 做一张 double* 的纸条，并把 d 的门牌号抄上去。",
          acceptRegex: ["double\\s*\\*\\s*\\w+\\s*=\\s*&\\s*d\\s*;"],
          why: "句式是 double* pd = &d; —— 类型那一截的星号不能少，纸条名字随你起，右边那个 &d 才是「问出来的号」。纸条类型必须跟着柜子的类型走，拿 double* 去记一个 int 的号会被拦。" },
        { id: "q4", type: "output", score: 12,
          coversTask: 2,
          stem: "这段程序打印什么？（就一行）\nvoid swap_ptr(int* a, int* b) {\n    int tmp = *a;\n    *a = *b;\n    *b = tmp;\n}\nint x = 1, y = 9;\nswap_ptr(&x, &y);\nstd::println(\"x = {}, y = {}\", x, y);",
          acceptLines: ["x = 9, y = 1"],
          why: "递进去的是两个号，函数里 a 记着 x 的家、b 记着 y 的家，所以三句话换的是本人的值：x 变 9、y 变 1。这正是第 55 课那台「复印件碰不到原件」的天花板被打通的地方。" },
        { id: "q5", type: "code", score: 14,
          coversTask: 2,
          stem: "补出 swap_ptr 中间那一句：把 b 那格的内容写进 a 那格。（关键就是左右两边各带一个星号）",
          acceptRegex: ["\\*\\s*a\\s*=\\s*\\*\\s*b\\s*;"],
          why: "整段是 int tmp = *a; *a = *b; *b = tmp; —— 少了第一句先把 a 的内容抄下来，这一写就把 x 原来的值冲干净了，y 再也拿不到它。等号两边带的星号表示「往那格柜子里写」。" },
        { id: "q6", type: "multi", score: 12,
          coversTask: [1, 2],
          stem: "关于这一课的纸条，下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["int* p = &age; 之后写 *p = 100，等价于 age = 100", "想让纸条换个指向，写 p = &other;，左边不带星号", "纸条上还没抄号就顺着 *p 去写，编译器一定当场拦住", "*p 读的是 p 记的那个号里的内容"],
          answers: [0, 1, 3],
          why: "第三条错得最要命：号没抄就顺着找，编译一路放行，跑起来直接 Segmentation fault —— 因为 p 里是那一格留下的旧数字，顺着一个乱写的号找上门，那块地根本不归你。" },
        { id: "q7", type: "blank", score: 10,
          coversTask: 3,
          stem: "课上的口诀：& 从东西拿到号，* 从号拿到____。（填两个字）",
          accept: ["内容", "东西", "值"],
          why: "两个符号方向相反：& 站在变量前面问门牌号，* 顺着门牌号找回柜子里摊着的东西。这一眼分清，整课的错就避掉一大半。" },
        { id: "q8", type: "choice", score: 10,
          coversTask: 3,
          stem: "有人一行写了 int* a, b;，以为两张纸条都有了。实际上呢？",
          options: ["只有 a 是指针，b 是个普通的 int", "a 和 b 都是指针", "b 是 double 指针", "编译器当场报错"],
          answer: 0,
          why: "星号只在声明那一截跟着第一个名字走，逗号后面的 b 拿到的是 int。后面想用 b 记号就报类型对不上。规矩是一条：一行只声明一个指针，或者老老实实写成 int *a, *b;。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: "15\ntrue\n100", q3: "double* pd = &d;", q4: "x = 9, y = 1", q5: "*a = *b;", q6: [0, 1, 3], q7: "内容", q8: 0 }
        ],
        wrongs: [
          { q1: 1, q2: "15\nfalse\n15", q3: "double pd = d;", q4: "x = 1, y = 9", q5: "a = b;", q6: [0, 2, 3], q7: "地址", q8: 1 }
        ],
        loose: [
          { q1: "0", q2: " 15 \ntrue\n100 ", q3: "double * pd = & d ;", q4: "x = 9,  y = 1", q5: "* a  =  * b ;", q6: [0, 1, 3], q7: "内 容", q8: "0" }
        ]
      }
    }
  ]
};
