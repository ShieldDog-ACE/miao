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
      cid: "c01", kind: "paper", pass: 60,
      title: "第 1 课考试 · 第一个程序",
      task: "任务题目：用 std::println 输出一行文字；理解 main 函数、头文件、编译命令",
      hint: "想不起来就回看本课【演示 1】和「怎么做」那两段。",
      questions: [
        { id: "q1", type: "choice", score: 10,
          coversTask: 1,
          stem: "一个 C++ 程序，操作系统把它装进内存后从哪里开始执行？",
          options: ["源码文件的第一行", "#include 那一行", "main 函数", "程序里随便哪里"],
          answer: 2,
          why: "main 是整个程序的入口，每个 C++ 程序有且只有一个；别的语句都要么被编译、要么在 main 的调用链上。" },
        { id: "q2", type: "choice", score: 10,
          coversTask: 1,
          stem: "#include <print> 这一行的作用是什么？",
          options: ["给程序加一行注释", "把标准库的打印工具引进来", "声明 main 函数", "让程序跑得更快"],
          answer: 1,
          why: "std::println 住在标准库里，#include <print> 就是把那个工具箱搬进来；少了它，println 就是没人认识的名字。" },
        { id: "q3", type: "order", score: 12,
          coversTask: 1,
          stem: "把「从写代码到看见输出」的四个步骤排成正确顺序。",
          steps: ["写好 main.cpp 源码", "g++ 把源码编译成可执行文件", "运行可执行文件", "屏幕上出现输出"],
          answer: [0, 1, 2, 3],
          why: "源码是文本，机器不认，必须先经编译器翻译成可执行文件，再运行它才有输出。" },
        { id: "q4", type: "output", score: 12,
          stem: "这两行代码运行后屏幕上打出什么？（一行一条，按顺序写）\nstd::println(\"A\");\nstd::println(\"B\");",
          acceptLines: ["A", "B"],
          why: "std::println 把引号里的文字原样打到屏幕并自动换行，两次调用就是两行。" },
        { id: "q5", type: "code", score: 20,
          coversTask: 1,
          stem: "写一整行代码：用 std::println 打出「你好，C++」（含引号内的内容，分号收尾）。",
          acceptRegex: ['println\\s*\\(\\s*"你好，C\\++"\\s*\\)'],
          why: "句式就是 std::println(\"内容\");—— 引号圈住文字，括号表示调用，分号收尾。" },
        { id: "q6", type: "blank", score: 10,
          coversTask: 1,
          stem: "编译命令 g++ -std=c++23 main.cpp -o main 里，-o 后面那个 main 指定的是什么？（写它的作用）",
          accept: ["可执行文件的名字", "可执行文件名", "产物名字", "输出文件的名字", "生成的程序名"],
          why: "-o 指定编译产物叫什么；不写的话 Linux 上默认叫 a.out。" },
        { id: "q7", type: "multi", score: 16,
          stem: "下面哪些说法是对的？（多选，错一个整题 0 分）",
          options: ["每个 C++ 程序有且只有一个 main 函数", "return 0 表示程序正常结束", "语句结尾的分号可以省略", "改了源码必须重新编译，跑的才是新版本"],
          answers: [0, 1, 3],
          why: "分号是语句的收尾记号，不能省；main 与重编译那两条见本课正文。" },
        { id: "q8", type: "choice", score: 10,
          stem: "编译器（比如 g++）是干什么的？",
          options: ["帮你打字更快的工具", "把源码翻译成机器能执行的可执行文件", "管理你硬盘上文件的程序", "把程序跑起来的那台机器"],
          answer: 1,
          why: "C++ 是编译执行的语言，编译器就是那位翻译。" }
      ],
      selftest: {
        refs: [
          { q1: 2, q2: 1, q3: [0, 1, 2, 3], q4: "A\nB", q5: 'std::println("你好，C++");', q6: "可执行文件的名字", q7: [0, 1, 3], q8: 1 }
        ],
        wrongs: [
          { q1: 0, q2: 3, q3: [3, 2, 1, 0], q4: "", q5: 'println("hello");', q6: "源码行数", q7: [2], q8: 0 },
          { q1: 1, q2: 2, q3: [1, 0, 3, 2], q4: "A", q5: 'std::print("你好，C++");', q6: "", q7: [0, 2], q8: 3 }
        ],
        loose: [
          { q1: "2", q2: "1", q3: ["0", "1", "2", "3"], q4: "A \n B", q5: 'std::println( "你好，C++" );', q6: "可执行文件名", q7: [0, 1, 3], q8: "1" }
        ]
      }
    },
    {
      cid: "c02", kind: "paper", pass: 60,
      title: "第 2 课考试 · 声明变量",
      task: "任务题目：声明两个变量描述自己（身高用小数、住校用布尔）并打印；分清单引号字符与双引号字符串",
      hint: "回看本课【演示 1】的四种盒子与「单引号 vs 双引号」那条坑。",
      questions: [
        { id: "q1", type: "choice", score: 10,
          coversTask: 1,
          stem: "int 盒子能装下面哪个值？",
          options: ["3.14", "'你'", "200", "true"],
          answer: 2,
          why: "int 只装整数；3.14 是小数归 double，'你' 是字符归 char（还超一个），true 归 bool。" },
        { id: "q2", type: "choice", score: 10,
          stem: "char 类型的字符字面量用什么引号？",
          options: ["单引号", "双引号", "不用引号", "反引号"],
          answer: 0,
          why: "单引号是一个字符，双引号是字符串，两样东西不同。" },
        { id: "q3", type: "code", score: 20,
          coversTask: 1,
          stem: "（任务题）写两行声明：一行用 double 声明身高并给初值，一行用 bool 声明「是否住校」并给初值。变量名自取，但要能看出各是什么。",
          acceptRegex: ["double\\s+\\w+\\s*=", "bool\\s+\\w+\\s*="],
          why: "句式都是「类型 名字 = 初值;」—— double 装小数，bool 装 true/false。" },
        { id: "q4", type: "output", score: 12, coversTask: 1,
          stem: "这三行跑完，最后一行打印什么？\nint hp = 100;\nhp = hp - 30;\nstd::println(\"hp = {}\", hp);",
          acceptLines: ["hp = 70"],
          why: "等号是「右算左装」：右边先算出 70，再装回 hp。" },
        { id: "q5", type: "blank", score: 10,
          stem: "一个变量的声明只许一次，但____可以随便多少次。（填一个词）",
          accept: ["赋值", "赋值语句"],
          why: "声明定身份，赋值改内容；类型不变。" },
        { id: "q6", type: "multi", score: 16,
          stem: "下面哪些说法是对的？（多选，错一个整题 0 分）",
          options: ["声明时顺手给初值是好习惯", "age 和 Age 是同一个变量", "标识符可以拿数字开头", "bool 只有 true 和 false 两种值"],
          answers: [0, 3],
          why: "名字大小写敏感，age 与 Age 是两个变量；标识符不能数字开头。" },
        { id: "q7", type: "choice", score: 12, coversTask: 1,
          stem: "std::println(\"x = {}\", x); 里那个 {} 是干什么的？",
          options: ["表示空集", "占位坑：把后面的值按顺序填进去打印", "代码块的开头", "乘法的另一种写法"],
          answer: 1,
          why: "几个坑给几个值，坑和值对不上在编译期就报错。" },
        { id: "q8", type: "choice", score: 10,
          coversTask: 2,
          stem: "char grade = \"A\"; 这行会怎样？",
          options: ["正常运行", "打出来是 A", "编译报错：双引号是字符串，塞不进 char 盒", "把 A 变成 a"],
          answer: 2,
          why: "单引号一个字符、双引号字符串，类型对不上编译器当场拦下。" }
      ],
      selftest: {
        refs: [
          { q1: 2, q2: 0, q3: "double height = 1.75;\nbool is_dorm = true;", q4: "hp = 70", q5: "赋值", q6: [0, 3], q7: 1, q8: 2 }
        ],
        wrongs: [
          { q1: 0, q2: 1, q3: "int height = 1.75;\nbool is_dorm = true;", q4: "hp = 130", q5: "声明", q6: [1, 2], q7: 0, q8: 1 },
          { q1: 3, q2: 3, q3: "double height", q4: "hp = 100", q5: "", q6: [0, 1], q7: 2, q8: 0 }
        ],
        loose: [
          { q1: "2", q2: "0", q3: "double  my_height  =  1.75 ;\nbool  in_dorm= true ;", q4: "hp =  70", q5: "赋值", q6: [0, 3], q7: "1", q8: "2" }
        ]
      }
    },
    {
      cid: "c03", kind: "paper", pass: 60,
      title: "第 3 课考试 · 强类型",
      task: "任务题目：亲眼确认小数进 int 是砍尾巴不是四舍五入；读得懂「类型对不上」的报错",
      hint: "回看本课【演示 1】与【演示 2 · 砍尾巴的三兄弟】。",
      questions: [
        { id: "q1", type: "output", score: 15,
          coversTask: 2,
          stem: "这两行跑完打印什么？\nint age = 15;\nage = 3.7;\nstd::println(\"age = {}\", age);",
          acceptLines: ["age = 3"],
          why: "小数装进 int 盒是砍尾巴：3.7 变 3，不是四舍五入。" },
        { id: "q2", type: "choice", score: 12,
          coversTask: 2,
          stem: "age = 3.9; 之后 age 是多少？",
          options: ["3.9", "4", "3", "编译报错"],
          answer: 2,
          why: "3.9 同样砍尾巴成 3 —— 拦腰截断，向零看齐。" },
        { id: "q3", type: "choice", score: 10, coversTask: 2,
          stem: "把一个 double 的值装进 int 盒子时，编译器怎么做？",
          options: ["直接报错拦下", "四舍五入取最近的整数", "砍掉小数部分，朝 0 看齐", "悄悄把盒子换成 double"],
          answer: 2,
          why: "类型勉强对得上它就不拦，改用截断：小数部分直接没了，不是四舍五入，盒子也还是 int。" },
        { id: "q4", type: "code", score: 18, coversTask: 2,
          stem: "（任务题）写出这三行：声明一个 int 变量 n 并给 0；把 8.75 装进 n；把 n 打印出来。变量名就用 n。",
          acceptRegex: ["int\\s+n\\s*=\\s*0", "n\\s*=\\s*8\\.75", "println\\s*\\("],
          why: "声明给了 int 盒，第二行装小数编译器不拦 —— 第三行打印出来才知道被砍成了 8。" },
        { id: "q5", type: "blank", score: 10,
          coversTask: 3,
          stem: "-2.9 装进 int 得到 -2：截断是往____的方向砍。（填一个字）",
          accept: ["零", "0", "向零"],
          why: "是「向零」截断不是「向小」：-2.9 砍成 -2，不是 -3。" },
        { id: "q6", type: "choice", score: 12,
          coversTask: 1,
          stem: "age = \"十五\"; 编译时会怎样？",
          options: ["悄悄转换成功", "运行时才崩溃", "编译直接报错，类型对不上拦下", "把字符串变数字"],
          answer: 2,
          why: "int 盒拒绝装字符串，这类错在编译阶段就被拦住 —— 这正是强类型的保护。" },
        { id: "q7", type: "multi", score: 13,
          stem: "下面哪些说法是对的？（多选，错一个整题 0 分）",
          options: ["强类型把错误提前到编译阶段", "两个整数相除结果永远是整数", "3.9 砍尾巴会变成 4", "编译器的警告可以无视"],
          answers: [0, 1],
          why: "砍尾巴是 3；警告说的往往就是本课这种悄悄转换，别无视。" },
        { id: "q8", type: "output", score: 10, coversTask: 2,
          stem: "这三行打出什么？\nint n = 0;\nn = -0.9;\nstd::println(\"{}\", n);",
          acceptLines: ["0"],
          why: "-0.9 向零砍就是 0；要是「向下砍」才会是 -1 —— 这一眼就能看出两种说法谁对。" }
      ],
      selftest: {
        refs: [
          { q1: "age = 3", q2: 2, q3: 2, q4: "int n = 0;\nn = 8.75;\nstd::println(\"{}\", n);", q5: "零", q6: 2, q7: [0, 1], q8: "0" }
        ],
        wrongs: [
          { q1: "age = 3.7", q2: 1, q3: 1, q4: "double n = 8.75;\nstd::println(\"{}\", n);", q5: "四", q6: 0, q7: [0, 2], q8: "-1" },
          { q1: "age = 4", q2: 3, q3: 0, q4: "int n = 0;", q5: "", q6: 1, q7: [2, 3], q8: "-0.9" }
        ],
        loose: [
          { q1: "age  =  3", q2: "2", q3: "2", q4: "int  n = 0 ;\n n = 8.75 ;\n println( \"{}\" , n ) ;", q5: "0", q6: "2", q7: [0, 1], q8: " 0 " }
        ]
      }
    },
    {
      cid: "c04", kind: "paper", pass: 60,
      title: "第 4 课考试 · auto 与 sizeof",
      task: "任务题目：会用 auto 声明变量，会用 sizeof 验证编译器猜成了什么类型",
      hint: "回看本课【演示 2】的字节数对照。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          stem: "auto count = 10; 之后 count 是什么类型？",
          options: ["没有类型", "int", "double", "auto 类型"],
          answer: 1,
          why: "右边是整数字面量，编译器猜成 int；auto 不是一种类型，是「替你写类型」。" },
        { id: "q2", type: "choice", score: 12,
          stem: "auto 猜完类型之后，这个变量还能再装别的类型吗？",
          options: ["能，auto 随便装", "不能，类型已经定死，跟手写一样", "能，但要先打一声招呼", "看编译器心情"],
          answer: 1,
          why: "auto 只在声明那一刻看右边；之后该拦的照拦。" },
        { id: "q3", type: "blank", score: 12,
          coversTask: 1,
          stem: "想知道一个变量占几个字节，用____它。（填一个关键字）",
          accept: ["sizeof"],
          why: "sizeof(x) 返回 x 占的字节数，是验证类型猜测的探针。" },
        { id: "q4", type: "output", score: 16,
          coversTask: 1,
          stem: "这段代码的三行 sizeof 输出分别是多少？（一行一条，按顺序写）\nauto count = 10;\nauto height = 172.5;\nauto flag = true;\nstd::println(\"{}\", sizeof(count));\nstd::println(\"{}\", sizeof(height));\nstd::println(\"{}\", sizeof(flag));",
          acceptLines: ["4", "8", "1"],
          why: "int 4 字节、double 8 字节、bool 1 字节 —— 猜测由字节数坐实。" },
        { id: "q5", type: "code", score: 18,
          coversTask: 1,
          stem: "（任务题）用 auto 声明至少 3 个变量，再用 sizeof 各打印一次，验证编译器猜的类型。",
          acceptRegex: ["auto\\s+\\w+\\s*=", "sizeof\\s*\\("],
          why: "auto 声明 + sizeof 验证，两样都要在。" },
        { id: "q6", type: "choice", score: 10,
          coversTask: 2,
          stem: "auto height = 172; （整数）它占几个字节？",
          options: ["8", "4", "1", "172"],
          answer: 1,
          why: "右边是整数 → int → 4 字节；auto 按右边的字面类型猜，不会自动升级成 double。" },
        { id: "q7", type: "multi", score: 12,
          stem: "下面哪些说法是对的？（多选，错一个整题 0 分）",
          options: ["auto 不是「没有类型」", "auto 只在声明时看右边的类型", "auto 变量后面还能换装字符串", "auto 会让程序跑得更慢"],
          answers: [0, 1],
          why: "auto 猜完定死；类型是编译期的事，不拖累运行速度。" },
        { id: "q8", type: "choice", score: 8,
          stem: "auto x = 10; 后面想用 x 做小数除法，最直接的改法是？",
          options: ["把右边写成 10.0", "多打几个空格", "把 auto 换成 AUTO", "没法改"],
          answer: 0,
          why: "右边 10.0 让编译器猜成 double；auto 不帮你升级类型。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: 1, q3: "sizeof", q4: "4\n8\n1", q5: "auto a = 1;\nauto b = 2.5;\nauto c = true;\nstd::println(\"{} {} {}\", sizeof(a), sizeof(b), sizeof(c));", q6: 1, q7: [0, 1], q8: 0 }
        ],
        wrongs: [
          { q1: 0, q2: 0, q3: "size", q4: "8\n8\n8", q5: "int a = 1;\nint b = 2;\nint c = 3;", q6: 0, q7: [0, 2], q8: 3 },
          { q1: 2, q2: 2, q3: "", q4: "4\n4\n4", q5: "auto a = 1;", q6: 2, q7: [2, 3], q8: 1 }
        ],
        loose: [
          { q1: "1", q2: "1", q3: "SIZEOF", q4: " 4 \n 8 \n 1 ", q5: "auto  a1=1 ; auto  b1=2.5 ; auto  c1=true ; println(sizeof(a1));", q6: "1", q7: [0, 1], q8: "0" }
        ]
      }
    },
    {
      cid: "c05", kind: "paper", pass: 60,
      title: "第 5 课考试 · auto 的字符串坑",
      task: "任务题目：分清「号牌 vs 工具」—— auto 接双引号拿到的是 8 字节号牌，std::string 才有功能",
      hint: "回看本课【演示 1】的两个 sizeof。",
      questions: [
        { id: "q1", type: "choice", score: 14,
          coversTask: 3,
          stem: "auto name = \"小明\"; 之后 name 是什么？",
          options: ["std::string 工具", "8 字节的地址号牌", "char 字符", "空的"],
          answer: 1,
          why: "双引号字面量的字面类型就是「指向字符起点的号牌」，auto 只认字面类型。" },
        { id: "q2", type: "choice", score: 12,
          coversTask: 2,
          stem: "下面哪个能调 length() 求长度？",
          options: ["auto name = \"小明\";", "std::string name2 = \"小明\";", "两者都能", "两者都不能"],
          answer: 1,
          why: "length() 是 std::string 工具上的功能；号牌上没有这些功能。" },
        { id: "q3", type: "output", score: 14,
          stem: "std::string name2 = \"小明\";\nstd::println(\"{}\", name2.length());\n打印什么？",
          acceptLines: ["6"],
          why: "UTF-8 里一个汉字占 3 字节，两个汉字 6 —— 注意是字节数不是字数。" },
        { id: "q4", type: "code", score: 20,
          coversTask: 1,
          stem: "（任务题）name2 是 std::string，装着「小明」。写一行：把它自己拼接上「同学」再存回 name2。",
          acceptRegex: ['name2\\s*(=\\s*name2\\s*\\+|\\+=)\\s*"同学"'],
          why: "工具能拼接：name2 = name2 + \"同学\"; 或 name2 += \"同学\"; 都行。" },
        { id: "q5", type: "blank", score: 12,
          coversTask: 3,
          stem: "背住这句：auto s = \"abc\" 得到的____ std::string。（填两个字）",
          accept: ["不是", "并非"],
          why: "auto 接双引号拿到的是号牌，不是工具；要工具就老实写 std::string。" },
        { id: "q6", type: "multi", score: 14,
          stem: "下面哪些说法是对的？（多选，错一个整题 0 分）",
          options: ["双引号字面量是 C 语言时代遗留的写法", "std::string 自己管内存", "号牌能直接求长度", "UTF-8 里一个汉字占 3 字节"],
          answers: [0, 1, 3],
          why: "求长度是工具的功能，号牌没有；其余三条都是本课正文原话。" },
        { id: "q7", type: "choice", score: 14,
          stem: "sizeof(name) 的返回值是多少？（name 来自 auto name = \"小明\";）",
          options: ["6", "4", "8", "不确定，看机器"],
          answer: 2,
          why: "号牌固定 8 字节；别把它和文本长度搞混。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: 1, q3: "6", q4: 'name2 = name2 + "同学";', q5: "不是", q6: [0, 1, 3], q7: 2 }
        ],
        wrongs: [
          { q1: 0, q2: 0, q3: "2", q4: 'name + "同学";', q5: "是", q6: [2, 3], q7: 0 },
          { q1: 2, q2: 2, q3: "3", q4: 'std::string name2 = "同学";', q5: "", q6: [0, 2], q7: 1 }
        ],
        loose: [
          { q1: "1", q2: "1", q3: " 6 ", q4: 'name2 += "同学" ;', q5: "不是", q6: [0, 1, 3], q7: "2" }
        ]
      }
    }
  ]
};
