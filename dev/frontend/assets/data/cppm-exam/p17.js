/* 喵站 · C++ 掌握 考卷分部 p17：第 141–144 课（第九轮）
 * 契约与前几批一致：每场 7–8 题、score 合计正好 100、choice ≥2、output ≥1、
 * 源稿每条【任务】都有题的 coversTask 对着、带 coversTask 的题合计 ≥50 分、每题带 why、
 * selftest 的 refs 判 100 / wrongs 判 <60 / loose 判 ≥60。
 * output 题考的是「跑那条命令后打印什么」，命令与输出都经本机 g++ 15.2.0 实跑核对。
 * 第 144 课的 cmake 命令本机没装 cmake，所以那场只考实跑过的 g++ 等价命令。
 */
window.MIAO_CPPM_EXAM_P17 = {
  papers: [
    {
      cid: "m141", kind: "paper", mode: "quiz", pass: 60, task: "任务题目：把源稿那份文件存成 main.cpp，跑 g++ -std=c++23 -E main.cpp | tail -n 12，说出抄写员干完活后你的代码出现在哪、前面那一大坨是什么", hint: "想不起来就回看本课【演示 3 · 本课任务：抄写员干完活以后，你的代码在哪儿】与【演示 2 · 把四站拆开，亲手各跑一次】。",
      questions: [
        { id: "q1", type: "choice", score: 10, stem: "一个 .cpp 变成可执行文件，四站的正确顺序是？", options: ["预处理 → 编译 → 汇编 → 链接", "编译 → 预处理 → 链接 → 汇编", "链接 → 汇编 → 编译 → 预处理", "汇编 → 预处理 → 编译 → 链接"], answer: 0, why: "预处理管抄头和换宏，编译翻成汇编并管语法，汇编出 .o 半成品，链接把所有 .o 凑齐。对应命令分别是 -E、-S、-c，最后一站不带这三个开关。" },
        { id: "q2", type: "choice", score: 13, stem: "你只写了 add 的声明却没给实现，编译命令里也没列那份 add.cpp。报错会出现在哪一站？", options: ["第二站编译，报 expected primary-expression", "第三站汇编，报符号冲突", "第四站链接，报 undefined reference —— 实测前三站一路绿灯", "不会报错，运行时才崩"], answer: 2, why: "声明本身合法，前三个文件各自走得通；main.o 里那个 add 是个待填的空格，链接器翻遍所有 .o 找不到人才翻脸。看到报错行首是 ld 就该数命令里有几份 .cpp。" },
        { id: "q3", type: "blank", score: 20, coversTask: 1, stem: "实测 main.cpp 只有七行，展开却有 65,785 行；用 tail 看结果时，你自己写的那几行出现在展开结果的____。", accept: ["最后", "末尾", "尾部", "最下面"], why: "预处理是按顺序抄写：#include 在前，你的代码在后，所以你的代码永远在尾巴上。这也说明 -E 的输出里行数不等于你文件的行数。" },
        { id: "q4", type: "output", score: 30, coversTask: 1, stem: "按【演示 2】把四站拆开跑：main.cpp 里打印 s 和 add(1, 2)，实现写在 add.cpp。下面两行跑完打印什么？（一行）\ng++ -std=c++23 -c main.cpp -o main.o\ng++ -std=c++23 -c add.cpp -o add.o && g++ -std=c++23 main.o add.o -o app && ./app", acceptLines: ["hello 3"], why: "两份半成品各自走前三站，最后一行才补上 add 的空格。少列 add.o 就在链接那站报 undefined reference。" },
        { id: "q5", type: "multi", score: 15, stem: "关于这条流水线，说法对的是？（多选，错勾任何一项整题 0 分）", options: ["预处理那一站不懂 C++，它只碰文本", "每个 .cpp 各自走完前三站，链接那站才把所有 .o 凑齐", "头文件也要单独编译成 .o，所以它得列进编译命令", ".o 是半成品，里面别人的符号还留着空格"], answers: [0, 1, 3], why: "头文件没有 .o，它被抄进每一个用到它的 .cpp；实测把 .h 列进命令本机 g++ 也不拦，但那是白活 —— 命令里只列 .cpp。" },
        { id: "q6", type: "blank", score: 12, stem: "实测 nm 看 main.o 的符号表，能看到一行 U add。那个 U 表示这个符号____，要等第四站来补。", accept: ["未定义", "还没定义", "只有声明没实现", "欠着"], why: "U 是 undefined：编译器照单翻译，链接器负责找人。这个空格就是 undefined reference 报错的源头。" }
      ],
      selftest: {
        refs: [
          {q1: 0, q2: 2, q3: "最后", q4: "hello 3", q5: [0, 1, 3], q6: "未定义"}],
        wrongs: [
          {q1: 1, q2: 0, q3: "最前", q4: "hello 103", q5: [2], q6: "已经定义好了"}],
        loose: [
          {q1: "0", q2: "2", q3: "末尾 ", q4: " hello 3", q5: [3, 1, 0], q6: "未定义的"}]
      }
    },
    {
      cid: "m142", kind: "paper", mode: "code", authored: "f48ad332", pass: 60, task: "任务题目：给 Student 添一道叫 is_passed 的菜 —— 菜单那一行声明写在哪个文件、后厨那一行实现写在哪个文件，60 分算及格，最后让顾客在 main 里把它打印出来", hint: "想不起来就回看本课【演示 2 · 真拆成三个文件，顺带完成本课任务】和【演示 3 · 三种漏写，报错长相各不相同】。",
      questions: [
        { id: "q1", type: "code", score: 34, coversTask: 1, stem: "（任务题）按本课的规矩把 is_passed 分家写全：菜单里那一行声明，加上后厨里那一行实现，及格线 60 分。", acceptRegex: ["bool\\s+is_passed\\s*\\(\\s*\\)\\s*const", "Student\\s*::\\s*is_passed", ">=\\s*60|60\\s*<="], sample: "student.h 里写 bool is_passed() const;，student.cpp 里写 bool Student::is_passed() const { return score_ >= 60; }", why: "声明那行归 student.h，实现那行必须以类名加两个冒号开头并住在 student.cpp，比较写成 score_ 大于等于 60。菜单一行、后厨一行，缺一样顾客就点不到这道菜。" },
        { id: "q2", type: "code", score: 33, coversTask: 1, stem: "（任务的最后一步）在 main.cpp 里按菜单点菜：造一个名字随意、分数 59.0 的 Student，再用标准库那个打印函数把 name 和 is_passed 的结果打到一行里。", acceptRegex: ["Student\\s+\\w+\\s*\\(\\s*\"[^\"]*\"\\s*,\\s*59(?:\\.0)?\\s*\\)", "\\w+\\s*\\.\\s*is_passed\\s*\\(\\s*\\)", "std\\s*::\\s*println\\s*\\("], sample: "Student late(\"小刚\", 59.0);\nstd::println(\"{} 及格了吗：{}\", late.name(), late.is_passed());", why: "顾客这一侧只认签名：造对象、点方法，一句实现都不写。59.0 没过 60 的线，打印出来是 false。" },
        { id: "q3", type: "code", score: 33, coversTask: 1, stem: "写 student.cpp 的第一行：自己把自己依赖的那份清单请进来（别指望隔壁 main.cpp 顺手包过）。", acceptRegex: ["#\\s*include\\s*\"\\s*student\\.h\\s*\""], sample: "#include \"student.h\"", why: "实现要用到 class 的样子，就得自己请清单。写成尖括号是找标准库那份路径，自己的头文件要用双引号。" }
      ],
      selftest: {
        refs: [
          {q1: "student.h 里写 bool is_passed() const;，student.cpp 里写 bool Student::is_passed() const { return score_ >= 60; }", q2: "Student late(\"小刚\", 59.0);\nstd::println(\"{} 及格了吗：{}\", late.name(), late.is_passed());", q3: "#include \"student.h\""}],
        wrongs: [
          {q1: "把实现塞进头文件：bool is_passed() const { return true; }", q2: "Student late(\"小刚\", 92.5);\nstd::println(\"{}\", late.name());", q3: "#include <student.h>"}],
        loose: [
          {q1: "头文件：bool  is_passed()  const ;\n源文件：bool  Student :: is_passed() const { return score_>=60; }", q2: "Student  late (  \"小刚\" ,  59.0 ) ;\nstd :: println ( \"{} 及格了吗：{}\" , late . name ( ) ,  late . is_passed ( ) ) ;", q3: "#  include   \"student.h\""}]
      }
    },
    {
      cid: "m143", kind: "paper", mode: "quiz", pass: 60, task: "任务题目：把源稿那段里的标记 COMMON_H_OPENED 改名成别的，看打印出来的值怎么变，再用一句话说清这把锁凭什么只放行第一遍", hint: "想不起来就回看本课【演示 1 · 源稿这段：标记在不在，走的是两条岔路】和【演示 3 · 上锁：一行版与三件套版】。",
      questions: [
        { id: "q1", type: "choice", score: 12, stem: "a.h 和 b.h 都抄了 common.h，main.cpp 又同时 include a.h 和 b.h。common.h 里的东西在这个编译单元里会出现几份？", options: ["一份，预处理器认得出这段刚才抄过了", "两份，抄写员不认识「刚才抄过了」，它只管照抄", "两份，但要到链接站才发现", "一份，因为头文件没有自己的 .o"], answer: 1, why: "预处理只碰文本、不懂 C++，两条路各抄一次就是两份。两份定义撞在一起，报错出在第二站。" },
        { id: "q2", type: "choice", score: 15, stem: "实测那份没上锁的工程，第一句报错是 common.h:1:8: error: redefinition of ‘struct Point’。关于它说法对的是？", options: ["第二站编译报的，后面还配了一句 note: previous definition，两条指着同一个头文件", "第四站链接报的，说明命令里少列了一个 .cpp", "预处理报的，说明 include 写重了", "程序跑起来才崩，因为成员被覆盖了"], answer: 0, why: "重复包含是编译期的事，一句都到不了链接站。error 说这里第二次定义，note 说第一次就在刚才那行 —— 成对出现就该想到锁。" },
        { id: "q3", type: "blank", score: 16, coversTask: 1, stem: "（任务题）源稿那段里，把标记的定义改成别的名字、COMMON_H_OPENED 再也没被定义过，实测打印出来的值是____。", accept: ["999", "值 999", "变成 999"], why: "标记不在了，两条岔路就换了一条：#ifdef 那段不成立，#ifndef 那段放行，于是写进去的是 999。这正是「锁只放行第一遍」的反面演示。" },
        { id: "q4", type: "output", score: 18, coversTask: 1, stem: "（任务题）把源稿那段按原样编一遍再跑，屏幕上打印什么？", acceptLines: ["内容只被定义了一次，值 = 1"], why: "标记在第一行就被定义上了，所以走的是 #ifdef 那条岔路，写进去的是 1；后面 #ifndef 整段跳过 —— 两段只有一段干活。" },
        { id: "q5", type: "multi", score: 15, stem: "关于这把锁，说法对的是？（多选，错勾任何一项整题 0 分）", options: ["锁名必须全局唯一：实测两份头文件撞同一个名字，后一份整段被跳过，报的是 was not declared in this scope", "实测 #pragma once 和三件套同时挂在一份头文件上，本机一句警告都不给", "上了锁以后，两个不同的 .cpp 各抄一遍同一份头文件也就变成错误了", "三件套忘写收尾那句，实测报的是 unterminated #ifndef，指着文件第一行"], answers: [0, 1, 3], why: "锁只管同一个编译单元里抄两遍。两个编译单元各抄一次是设计内的正常事，各自的标记互不相干 —— 那条 multiple definition 的药方是头文件里别写实现。" },
        { id: "q6", type: "order", score: 16, coversTask: 1, stem: "（任务题）把三件套这把锁的四步按先后排好。", answer: [1, 3, 0, 2], steps: ["把真正的内容写在中间", "第一行问标记在不在", "最后一句 #endif 收尾", "不在就当场把标记写上"], why: "问 → 写标记 → 放内容 → 关门。第二遍进来时第一问就有答案，从 #ifndef 到 #endif 整段被剪掉，这个文件在那一遍等于空文件。" },
        { id: "q7", type: "choice", score: 8, stem: "下面哪种情况才是本课这把锁要治的病？", options: ["同一个 .cpp 里，一份头文件顺着两条路被抄了两遍", "main.cpp 和 student.cpp 各 include 了一次同一份 student.h", "编译命令里少列了一份 utils.cpp", "student.h 里用了 std::string 却忘了请对应的头文件"], answer: 0, why: "后三条各有各的去处：各抄一遍是正常事；少列文件是链接期 undefined reference；忘请头文件是编译期缺名字，都不是锁的活。" }
      ],
      selftest: {
        refs: [
          {q1: 1, q2: 0, q3: "999", q4: "内容只被定义了一次，值 = 1", q5: [0, 1, 3], q6: [1, 3, 0, 2], q7: 0}],
        wrongs: [
          {q1: 0, q2: 1, q3: "1", q4: "内容只被定义了一次，值 = 999", q5: [2], q6: [0, 1, 2, 3], q7: 1}],
        loose: [
          {q1: "1", q2: "0", q3: " 999 ", q4: "内容只被定义了一次，值 = 1 ", q5: [3, 1, 0], q6: "1→3→0→2", q7: "0"}]
      }
    },
    {
      cid: "m144", kind: "paper", mode: "quiz", pass: 60, task: "任务题目：新建一份 utils.cpp 把 square 挪进去，用一条命令把两个 .cpp 一起编过；再照源稿那四行写一份 CMakeLists.txt，说清它两行两行各对应命令里的哪一段", hint: "想不起来就回看本课【演示 2 · 本课任务 1：真拆三份，一条命令编过】和【演示 3 · 名单写错的两种长相】；CMake 那部分看【它被设计成什么样】。",
      questions: [
        { id: "q1", type: "choice", score: 17, stem: "多文件工程的编译命令，名单上该列什么？", options: ["所有 .cpp，一份不落；头文件不列", "所有源文件加头文件，一个都不少", "只列 main.cpp，其余靠抄进去", "只列这次改过的那一个 .cpp"], answer: 0, why: "一个 .cpp 是一个编译单元，g++ 替每一份各走前三站再一起链接。头文件早在每个 .cpp 里被抄过了，实测本机把它列进去也不拦，做的是白活。" },
        { id: "q2", type: "choice", score: 17, stem: "命令里忘了写 -std=c++23，本机实测会怎样？", options: ["只是少几条警告，照跑", "第二站就拦下：报 ‘println’ is not a member of ‘std’", "链接期报 undefined reference", "要到运行时才崩"], answer: 1, why: "第 141 课实测过这条：本机 g++ 15.2 默认按老标准走，std::println 还没进那本字典。同一条命令补上标准开关立刻过。" },
        { id: "q3", type: "output", score: 19, coversTask: 1, stem: "（任务题）utils.h 只给签名、utils.cpp 里写 square 是 x 乘 x，main.cpp 打印 tools::square(9)。依次跑 g++ -std=c++23 -Wall -Wextra main.cpp utils.cpp -o app 和 ./app，屏幕输出是什么？", acceptLines: ["81"], why: "两个 .cpp 各走前三站、一次链接，警告开关一声没吭，最后打出 9 的平方 81。这条是本机实跑的结果。" },
        { id: "q4", type: "blank", score: 15, coversTask: 2, stem: "CMakeLists.txt 第四行 add_executable 里，产物名 app 后面那一串写的是____。", accept: ["源文件", "源文件名单", "要编译的源文件"], why: "那一行就是名单，等价于命令里 main.cpp utils.cpp 那一段 —— 而且和命令一样，只列源文件，不列头文件。" },
        { id: "q5", type: "multi", score: 20, coversTask: 2, stem: "关于 cmake -B build 与 cmake --build build 这两条命令，说法对的是？（多选，错勾任何一项整题 0 分）", options: ["前一条是配置阶段：把 build 目录建出来并写好转译清单", "后一条才真干活：照那份清单替你敲编译器", "中间产物一律隔在 build 目录里，推倒重来就删掉那一个文件夹", "两条顺序无所谓，它们干的是同一件事"], answers: [0, 1, 2], why: "分工是配置与构建两班，没配置过就没有清单可读。要补一句老实话：本机没装 cmake，这一层是按设计讲的，实跑过的是它替你敲的那条 g++。" },
        { id: "q6", type: "choice", score: 12, stem: "实测两份 .cpp 各写了一遍同一个 square，把它们一起列进命令，链接器说的是？", options: ["multiple definition，后面还跟一句 first defined here", "undefined reference to tools::square", "redefinition，指着头文件第一行", "unterminated #ifndef"], answer: 0, why: "一个符号来了两份实现，链接器把另一份在哪也告诉你了。修法是删掉重复的那份 —— 头文件里别写函数体，就是上一课那条。" }
      ],
      selftest: {
        refs: [
          {q1: 0, q2: 1, q3: "81", q4: "源文件名单", q5: [0, 1, 2], q6: 0}],
        wrongs: [
          {q1: 1, q2: 3, q3: "9", q4: "头文件", q5: [3], q6: 1}],
        loose: [
          {q1: "0", q2: "1", q3: " 81 ", q4: "源文件 ", q5: [2, 0, 1], q6: "0"}]
      }
    },
  ]
};
