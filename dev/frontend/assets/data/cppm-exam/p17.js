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
      cid: "m141", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, task: "任务题目：把源稿那份文件存成 main.cpp，跑 g++ -std=c++23 -E main.cpp | tail -n 12，说出抄写员干完活后你的代码出现在哪、前面那一大坨是什么", hint: "想不起来就回看本课【演示 3 · 本课任务：抄写员干完活以后，你的代码在哪儿】与【演示 2 · 把四站拆开，亲手各跑一次】。",
      notes: ["四站的顺序是预处理、编译、汇编、链接，对应开关是 -E、-S、-c，最后一站这三个都不带。", "只写声明不写实现，前三站一路绿灯，缺块要到链接那站才报 undefined reference —— 看到报错行首是 ld 就数命令里有几份 .cpp。", "预处理是按顺序抄写：#include 在前、你的代码在后，所以你的代码永远在展开结果的尾巴上。", "展开出来的行数不等于你文件的行数：实测只有七行的 main.cpp 展开成六万多行。", "用 nm 看 .o 的符号表能看到一行 U add：那个 U 是说这个符号还欠着，等第四站来补。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：在注释里写下那条只让抄写员干完活、再看尾巴那几行的命令（g++ 带上 -E，后面跟 tail）。", acceptRegex: ["g\\s*\\+\\s*\\+[^\\n]*-E[^\\n]*\\.cpp", "tail"], acceptOn: "buffer", sample: "// g++ -std=c++23 -E main.cpp | tail -n 12", why: "-E 只干活到抄完为止，把展开结果打到屏幕上；tail 取尾巴，你写的那几行就在那里。" },
        { id: "q2", type: "code", score: 15, stem: "把这份程序写成能跑的形：把打印工具箱搬进来（#include），再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n\nint main() {", why: "这份 .cpp 就是喂给预处理的那份文件：#include 会被整份抄进来。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "开一格 std::string，装一段文字。", acceptRegex: ["std\\s*::\\s*string\\s+\\w+\\s*=\\s*\"[^\"]*\"\\s*;"], acceptOn: "code", sample: "std::string s = \"hello\";", why: "这一行会原样出现在展开结果的尾巴上，是本课观察的对象之一。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "写一行只有声明、没有实现的函数：返回 int，括号里两个 int 参数，行尾直接是分号。", acceptRegex: ["\\bint\\s+\\w+\\s*\\(\\s*int\\s+\\w+\\s*,\\s*int\\s+\\w+\\s*\\)\\s*;"], acceptOn: "code", sample: "int add(int a, int b);", why: "声明本身合法：编译器照单翻译，把 add 留成一个待填的空格，要到链接那站才找人。" },
        { id: "q5", type: "code", score: 20, coversTask: 1, stem: "用一条 std::println 把那格字符串和那次函数调用一起打出来：格式串里两个占位坑，参数按顺序给。", acceptRegex: ["std\\s*::\\s*println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\("], acceptOn: "code", sample: "std::println(\"{} {}\", s, add(1, 2));", why: "这一句在展开成品里还是你那一句的样子 —— 预处理只换宏、抄头文件，不动你的语句。" },
        { id: "q6", type: "code", score: 15, stem: "在注释里把后两站的命令各写一行：一行用 -c 出一份 .o，一行把 .o 拼成可执行文件。", acceptRegex: ["g\\s*\\+\\s*\\+[^\\n]*-c[^\\n]*\\.cpp", "g\\s*\\+\\s*\\+[^\\n]*\\.o[^\\n]*-o\\s*\\w+"], acceptOn: "buffer", sample: "// g++ -std=c++23 -c main.cpp -o main.o\n// g++ -std=c++23 main.o add.o -o app", why: "每个 .cpp 各自走完前三站，最后一站才把所有 .o 凑齐；命令里只列 .cpp，头文件没有 .o。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <string>\n\nint add(int a, int b);          // 只有声明：实现住在 add.cpp\n\nint main() {\n    std::string s = \"hello\";\n    std::println(\"{} {}\", s, add(1, 2));\n    return 0;\n}\n// g++ -std=c++23 -E main.cpp | tail -n 12   我的那几行在展开结果的尾巴上\n// g++ -std=c++23 -c main.cpp -o main.o\n// g++ -std=c++23 main.o add.o -o app && ./app\n"],
        wrongs: [
          "",
          "#include <print>\n\nint main() {\n    std::println(\"{}\", \"hi\");\n    return 0;\n}\n",
          "#include <print>\n#include <string>\n\nint main() {\n    std::string s = \"hello\";\n    std::println(\"{}\", s);\n    return 0;\n}\n// 抄写员干完活以后我的代码在哪儿\n"],
        loose: [
          "#  include < print >\n#  include < string >\n\nint  calc ( int  p , int  q ) ;\n\nint  main ( )\n{\n  std :: string  word  =  \"hi\" ;\n  std :: println ( \" 打 {} 和 {}\" , word , calc ( 1 , 2 ) ) ;\n}\n// 跑 g++ -std=c++23 -E build.cpp | tail -n 12 看到自己的代码在末尾\n// g++ -std=c++23 -c build.cpp -o build.o\n// g++ -std=c++23 build.o calc.o -o app\n"]
      }
    },
    {
      cid: "m142", kind: "paper", mode: "ide", authored: "f48ad332", file: "main.cpp", pass: 60, task: "任务题目：给 Student 添一道叫 is_passed 的菜 —— 菜单那一行声明写在哪个文件、后厨那一行实现写在哪个文件，60 分算及格，最后让顾客在 main 里把它打印出来", hint: "想不起来就回看本课【演示 2 · 真拆成三个文件，顺带完成本课任务】和【演示 3 · 三种漏写，报错长相各不相同】。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 34, coversTask: 1, stem: "（任务题）按本课的规矩把 is_passed 分家写全：菜单里那一行声明，加上后厨里那一行实现，及格线 60 分。", acceptRegex: ["bool\\s+is_passed\\s*\\(\\s*\\)\\s*const", "Student\\s*::\\s*is_passed", ">=\\s*60|60\\s*<="], acceptOn: "code", sample: "student.h 里写 bool is_passed() const;，student.cpp 里写 bool Student::is_passed() const { return score_ >= 60; }", why: "声明那行归 student.h，实现那行必须以类名加两个冒号开头并住在 student.cpp，比较写成 score_ 大于等于 60。菜单一行、后厨一行，缺一样顾客就点不到这道菜。" },
        { id: "q2", type: "code", score: 33, coversTask: 1, stem: "（任务的最后一步）在 main.cpp 里按菜单点菜：造一个名字随意、分数 59.0 的 Student，再用标准库那个打印函数把 name 和 is_passed 的结果打到一行里。", acceptRegex: ["Student\\s+\\w+\\s*\\(\\s*\"[^\"]*\"\\s*,\\s*59(?:\\.0)?\\s*\\)", "\\w+\\s*\\.\\s*is_passed\\s*\\(\\s*\\)", "std\\s*::\\s*println\\s*\\("], acceptOn: "code", sample: "Student late(\"小刚\", 59.0);\nstd::println(\"{} 及格了吗：{}\", late.name(), late.is_passed());", why: "顾客这一侧只认签名：造对象、点方法，一句实现都不写。59.0 没过 60 的线，打印出来是 false。" },
        { id: "q3", type: "code", score: 33, coversTask: 1, stem: "写 student.cpp 的第一行：自己把自己依赖的那份清单请进来（别指望隔壁 main.cpp 顺手包过）。", acceptRegex: ["#\\s*include\\s*\"\\s*student\\.h\\s*\""], acceptOn: "code", sample: "#include \"student.h\"", why: "实现要用到 class 的样子，就得自己请清单。写成尖括号是找标准库那份路径，自己的头文件要用双引号。" }
      ],
      selftest: {
        refs: [
          "#include \"student.h\"\n#include <print>\nint main() {\n    student.h 里写 bool is_passed() const;，student.cpp 里写 bool Student::is_passed() const { return score_ >= 60; }\n    Student late(\"小刚\", 59.0);\n    std::println(\"{} 及格了吗：{}\", late.name(), late.is_passed());\n    return 0;\n}\n"],
        wrongs: [
          "",
          "把实现塞进头文件：bool is_passed() const { return true; }",
          "Student late(\"小刚\", 92.5);\nstd::println(\"{}\", late.name());",
          "#include <student.h>"],
        loose: [
          "#  include   \"student.h\"\nint main() {\n    头文件：bool  is_passed()  const ;\n    源文件：bool  Student :: is_passed() const { return score_>=60; }\n    Student  late (  \"小刚\" ,  59.0 ) ;\n    std :: println ( \"{} 及格了吗：{}\" , late . name ( ) ,  late . is_passed ( ) ) ;\n    return 0;\n}\n"]
      }
    },
    {
      cid: "m143", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, task: "任务题目：把源稿那段里的标记 COMMON_H_OPENED 改名成别的，看打印出来的值怎么变，再用一句话说清这把锁凭什么只放行第一遍", hint: "想不起来就回看本课【演示 1 · 源稿这段：标记在不在，走的是两条岔路】和【演示 3 · 上锁：一行版与三件套版】。",
      notes: ["抄写员不认识刚才抄过了：两条路各抄一次就是两份，两份定义撞在一起报的是 redefinition of struct Point。", "error 说这里第二次定义，note 说第一次就在刚才那行 —— 成对出现就该想到锁；重复包含是编译期的事，一句都到不了链接站。", "第二遍进来时第一问就有答案，从 #ifndef 到 #endif 整段被剪掉，这个文件在那一遍等于空文件。", "两个不同的 .cpp 各抄一遍同一份头文件是设计内的正常事，这把锁只管同一个编译单元里抄两遍。", "三件套忘写收尾那句，实测报的是 unterminated #ifndef，指着文件第一行；#pragma once 与三件套同时挂在本机一句警告都不给。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "写出第一条岔路：用 #ifdef 问一个标记在不在，中间用一个带数值的 #define 把值写成 1，最后 #endif 关门。", acceptRegex: ["#\\s*ifdef\\s+\\w+[\\s\\S]{0,160}?#\\s*define\\s+\\w+\\s+1[\\s\\S]{0,160}?#\\s*endif"], acceptOn: "code", sample: "#ifdef COMMON_H_OPENED\n#define LOCKED_VERSION 1\n#endif", why: "标记在，这段就放行；锁的第二遍正是靠这一问把整段剪掉。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：写出相反的那条岔路 —— #ifndef 开头，中间把同一个名字的值写成 999，#endif 收尾。要让这一条放行，开头那行标记的定义得换成别的名字。", acceptRegex: ["#\\s*ifndef\\s+\\w+[\\s\\S]{0,160}?#\\s*define\\s+\\w+\\s+999[\\s\\S]{0,160}?#\\s*endif"], acceptOn: "code", sample: "#ifndef COMMON_H_OPENED\n#define LOCKED_VERSION 999\n#endif", why: "标记不在了，两条岔路就换了一条：#ifdef 那段不成立，#ifndef 那段放行，写进去的是 999 —— 这是锁只放行第一遍的反面演示。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "用一条 std::println 把那个值打出来：格式串里一个占位坑，参数给那个名字。", acceptRegex: ["std\\s*::\\s*println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "std::println(\"内容只被定义了一次，值 = {}\", LOCKED_VERSION);", why: "两段只有一段干活：这句打出来的就是最终那个值，改名的效果全在这一行上。" },
        { id: "q4", type: "code", score: 20, coversTask: 1, stem: "把改名以后你看到的值记在一行注释里（要写出 999 那个数）。", acceptRegex: ["//[^\\n]{4,}", "//[^\\n]*999"], acceptOn: "buffer", sample: "// 把标记改名成 MY_MARK 以后，跑出来值 = 999", why: "判的是你确实记下了一次观察；注释里那句对不对这块编辑器判不动，得自己跑一遍核对。" },
        { id: "q5", type: "code", score: 25, stem: "给一份头文件上锁：#ifndef 一个锁名、紧跟着把同一个名字写上、中间放 struct Point 那一行，最后 #endif 收尾。", acceptRegex: ["#\\s*ifndef\\s+\\w+[\\s\\S]{0,120}?#\\s*define\\s+\\w+[\\s\\S]{0,160}?struct\\s+Point[\\s\\S]{0,160}?#\\s*endif"], acceptOn: "code", sample: "#ifndef POINT_H\n#define POINT_H\nstruct Point { int x; int y; };\n#endif", why: "问、写标记、放内容、关门，四步按这个顺序；锁名必须全局唯一，两份头文件撞同一个名字时后一份整段被跳过。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\n#define MY_MARK                    // 把源稿那个标记改了名\n\n#ifdef COMMON_H_OPENED\n#define LOCKED_VERSION 1\n#endif\n\n#ifndef COMMON_H_OPENED\n#define LOCKED_VERSION 999\n#endif\n\n#ifndef POINT_H\n#define POINT_H\nstruct Point { int x; int y; };\n#endif\n\nint main() {\n    std::println(\"内容只被定义了一次，值 = {}\", LOCKED_VERSION);\n    Point p{3, 4};\n    std::println(\"点 {} {}\", p.x, p.y);\n    return 0;\n}\n// 把标记改名成 MY_MARK 以后，跑出来值 = 999\n"],
        wrongs: [
          "",
          "#include <print>\n\n#ifndef HAVE_MARK\n#define VERSION 999\n#endif\n\nint main() {\n    std::println(\"值 = {}\", VERSION);\n    return 0;\n}\n",
          "#include <print>\n\n#define COMMON_H_OPENED\n\n#ifdef COMMON_H_OPENED\n#define LOCKED_VERSION 1\n#endif\n\n#ifndef COMMON_H_OPENED\n#define LOCKED_VERSION 999\n#endif\n\nint main() {\n    std::println(\"内容只被定义了一次，值 = {}\", LOCKED_VERSION);\n    return 0;\n}\n"],
        loose: [
          "#  include < print >\n#  define  MY_OWN_MARK\n\n# ifdef  OLD_MARK\n#  define   GATE  1\n# endif\n\n# ifndef OLD_MARK\n#  define  GATE  999\n# endif\n\n# ifndef  POINT_LOCK\n#  define  POINT_LOCK\nstruct  Point  {  int  x ;  int  y ; } ;\n# endif\n\nint  main ( )\n{\n  std :: println ( \" 这一次的值 {}\" , GATE ) ;\n  Point  q { 1 , 2 } ;\n  std :: println ( \"{} {}\" , q . x , q . y ) ;\n}\n// 改名以后跑起来是 999，说明第二条岔路放行了\n"]
      }
    },
    {
      cid: "m144", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, task: "任务题目：新建一份 utils.cpp 把 square 挪进去，用一条命令把两个 .cpp 一起编过；再照源稿那四行写一份 CMakeLists.txt，说清它两行两行各对应命令里的哪一段", hint: "想不起来就回看本课【演示 2 · 本课任务 1：真拆三份，一条命令编过】和【演示 3 · 名单写错的两种长相】；CMake 那部分看【它被设计成什么样】。",
      notes: ["名单上一人一份 .cpp，头文件不列：实测本机把它列进命令也不拦，做的是白活。", "命令里忘了 -std=c++23，第二站就拦下：报 println 不是 std 的成员，因为本机默认按老标准走。", "-Wall -Wextra 是免费纠错老师：不开也能编过，开了才看得见未用参数、无符号数与 int 比大小这类暗坑。", "少列一个文件，链接期报 undefined reference；两份 .cpp 各写一遍同一个 square，链接器报 multiple definition 并告诉你 first defined here。", "本机没装 cmake，那两条命令这一层是按设计讲的；实跑过的是它替你敲的那条 g++。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "把 square 的实现搬进 namespace tools 那一格里：函数体里 return 乘出来的结果。", acceptRegex: ["namespace\\s+\\w+\\s*\\{[^}]*int\\s+square\\s*\\([^)]*\\)\\s*\\{[^}]*return"], acceptOn: "code", sample: "namespace tools { int square(int x) { return x * x; } }", why: "这一格就是 utils.cpp：实现住在后厨，头文件里别写函数体。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "再给同一格只写签名的那一行：namespace 里 int square 加参数后面直接是分号。", acceptRegex: ["namespace\\s+\\w+\\s*\\{[^}]*int\\s+square\\s*\\([^)]*\\)\\s*;"], acceptOn: "code", sample: "namespace tools { int square(int x); }", why: "这是 utils.h 那份菜单：顾客只认签名，链接那站再去找实现。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "在 main 里用一条 std::println 打那次 tools::square 的调用结果。", acceptRegex: ["std\\s*::\\s*println\\s*\\([^;]*tools\\s*::\\s*square\\s*\\("], acceptOn: "code", sample: "std::println(\"{}\", tools::square(9));", why: "点名要走命名空间限定；这一句打出来的是 9 的平方 81。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：在注释里写下把两个 .cpp 一起编过的那条命令，带上标准开关，名单列 main.cpp 与 utils.cpp，再用 -o 给产物起名。", acceptRegex: ["g\\s*\\+\\s*\\+[^\\n]*main\\.cpp[^\\n]*utils\\.cpp[^\\n]*-o\\s*\\w+", "-std\\s*=\\s*c\\+\\+23"], acceptOn: "buffer", sample: "// g++ -std=c++23 -Wall -Wextra main.cpp utils.cpp -o app", why: "一个 .cpp 是一个编译单元，g++ 替每一份各走前三站再一起链接；头文件不列，它早在每个 .cpp 里被抄过了。" },
        { id: "q5", type: "code", score: 20, coversTask: 2, stem: "任务第 2 条：把 CMakeLists.txt 的第四行写进注释 —— add_executable 里产物名后面跟那两份源文件。", acceptRegex: ["add_executable\\s*\\(\\s*\\w+\\s+\\w+\\.cpp\\s+\\w+\\.cpp\\s*\\)"], acceptOn: "buffer", sample: "// add_executable(app main.cpp utils.cpp)", why: "那一行就是名单，等价于命令里 main.cpp utils.cpp 那一段；和命令一样只列源文件，不列头文件。" },
        { id: "q6", type: "code", score: 15, coversTask: 2, stem: "把 cmake 那两条命令各写一行注释：一条 -B build 做配置，一条 --build build 才真干活。", acceptRegex: ["cmake[^\\n]*-B\\s*build", "cmake[^\\n]*--build\\s*build"], acceptOn: "buffer", sample: "// cmake -B build\n// cmake --build build", why: "前一条把 build 目录建出来并写好转译清单，后一条照清单替你敲编译器；顺序不能颠倒，中间产物一律隔在 build 目录里。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nnamespace tools { int square(int x); }                      // utils.h 那份菜单\n\nnamespace tools { int square(int x) { return x * x; } }   // utils.cpp 后厨\n\nint main() {\n    std::println(\"{}\", tools::square(9));\n    return 0;\n}\n// g++ -std=c++23 -Wall -Wextra main.cpp utils.cpp -o app\n// CMakeLists.txt 四行：cmake_minimum_required(VERSION 3.15)、project(app CXX)、set(CMAKE_CXX_STANDARD 23)\n// add_executable(app main.cpp utils.cpp)\n// cmake -B build\n// cmake --build build\n"],
        wrongs: [
          "",
          "#include <print>\n\nint square(int x) { return x * x; }\n\nint main() {\n    std::println(\"{}\", square(9));\n    return 0;\n}\n",
          "#include <print>\n\nnamespace tools { int square(int x) { return x * x; } }\n\nint main() {\n    std::println(\"{}\", tools::square(9));\n    return 0;\n}\n"],
        loose: [
          "#  include < print >\nnamespace  tools  {  int  square ( int  n ) ;  }\nnamespace  tools  {  int  square ( int  n )  {  return  n * n ;  }  }\n\nint  main ( )\n{\n  std :: println ( \" 平方 {}\" , tools :: square ( 9 ) ) ;\n}\n// 一次编两个： g++ -std=c++23 main.cpp utils.cpp -o app\n// add_executable ( app  main.cpp  utils.cpp )\n// cmake -B build  先把清单写出来\n// cmake --build build  再照清单干活\n"]
      }
    },
  ]
};
