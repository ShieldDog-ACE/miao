/* 喵站 · C++ 掌握 考卷分部 p16：第 137–140 课（第九轮）
 * 契约与 p10 一样：每题分数合计正好 100、源稿每条任务都有题 coversTask 对着、
 * 带 coversTask 的题合计 ≥50 分、每题带 why、refs 判 100 / wrongs 判 <60 / loose 判 ≥60。
 * 四份源稿各只有 1 条【任务】，所以 coversTask 一律是 1。
 */
window.MIAO_CPPM_EXAM_P16 = {
  papers: [
    {
      cid: "m137", kind: "paper", mode: "ide", authored: "b9351744", file: "main.cpp", pass: 60, task: "任务题目：写一个返回 std::string 的函数，把「1~10 的和 = 55」拼出来，直接 return 那个局部变量 —— 然后说清你为什么不写 std::move", hint: "想不起来就回看本课【演示 4 · 本课任务：返回一个拼好的 string】与【演示 2 · 给返回装上计数器】。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 27, coversTask: 1, stem: "（任务题）函数里已经算好了 int sum = 55。写出最后那两句：把结果拼进一个局部 std::string，然后按本课的写法把它交给调用者。", acceptRegex: ["std::string\\s+\\w+\\s*=", "return\\s+\\w+\\s*;"], acceptOn: "code", sample: "std::string text = \"1~10 的和 = \" + std::to_string(sum);\n    return text;", why: "拼字符串用 + 加 std::to_string 都行；关键是 return 后面跟的是那个局部变量的名字，中间不许出现 std::move。" },
        { id: "q2", type: "code", score: 17, coversTask: 1, stem: "（任务延伸）写出这一句：把还有名字的 std::string 变量 item 交原件放进 vector 里，也就是本课说的「该你开口」的那种写法。", acceptRegex: ["push_back\\s*\\(\\s*std::move\\s*\\(\\s*item\\s*\\)\\s*\\)"], acceptOn: "code", sample: "vec.push_back(std::move(item));", why: "编译器看不出你是想留一份还是整个交出，所以有名字、以后还要不要它这件事必须由你说。实测交原件之后 item 里剩 0 个字符。" },
        { id: "q3", type: "code", score: 28, coversTask: 1, stem: "写出 summary 的函数头：不收参数，还一串文字。", acceptRegex: ["std::string\\s+summary\\s*\\(\\s*\\)"], acceptOn: "code", sample: "std::string summary() {", why: "返回类型写 std::string，调用处接的就是本格内存 —— 本课说的自动移动正是从这一行开始的：函数里的局部变量马上销毁，编译器直接把它挪到外面。" },
        { id: "q4", type: "code", score: 28, coversTask: 1, stem: "写一行循环：i 从 1 数到 10，每轮把 i 记进 sum。", acceptRegex: ["for\\s*\\(\\s*int\\s+i\\s*=\\s*1\\s*;\\s*i\\s*<=\\s*10", "(sum\\s*\\+=\\s*i|sum\\s*=\\s*sum\\s*\\+\\s*i)"], acceptOn: "code", sample: "for (int i = 1; i <= 10; ++i) sum += i;", why: "先有 sum 这个数，才谈得上把它拼进文字。循环只管算数，交出去那一步留给后面那句直接 return。" }
      ],
      selftest: {
        refs: [
          "#include <string>\nstd::string summary() {\n}\nint main() {\n    std::string text = \"1~10 的和 = \" + std::to_string(sum);\n    return text;\n    vec.push_back(std::move(item));\n    for (int i = 1; i <= 10; ++i) sum += i;\n    return 0;\n}\n"],
        wrongs: [
          "",
          "std::string text = \"和\"; return std::move(text);",
          "vec.push_back(item);",
          "void summary() {",
          "int sum = 0;\nfor (int i = 1; i <= 10; ++i) sum = 0;"],
        loose: [
          "#include <string>\nstd::string  summary ( ){\n}\nint main() {\n    std::string   s = std::to_string ( sum ) ;\n    return  s ;\n    vec . push_back ( std :: move ( item ) ) ;\n    int sum = 0;\n    for ( int  i = 1 ;  i <=  10 ;  ++i )  sum  +=  i ;\n    return 0;\n}\n"]
      }
    },
    {
      cid: "m138", kind: "paper", mode: "ide", authored: "17960153", file: "main.cpp", pass: 60, task: "任务题目：已知要装一万个 int，写出给 vector 预留容量那一行代码；再回答为什么这一行只能写在 push_back 之前、而不是把 v[0] 当现成元素用", hint: "想不起来就回看本课【演示 4 · 本课任务：已知要装一万个 int】与【常见坑】第一条。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 30, coversTask: 1, stem: "（任务题）已知要往一个空的 std::vector<int> 里装一万个 int。写出预留容量的那一行，容器名叫 data。", acceptRegex: ["data\\s*\\.\\s*reserve\\s*\\(\\s*10000\\s*\\)"], acceptOn: "code", sample: "data.reserve(10000);", why: "一行就够：先租够一万个位置，后面一万次 push_back 就一次家都不用搬。" },
        { id: "q2", type: "code", score: 23, coversTask: 1, stem: "写一行：开出一个还空着的 int 容器 data，一个元素都还没装。", acceptRegex: ["std::vector\\s*<\\s*int\\s*>\\s+data\\s*;"], acceptOn: "code", sample: "std::vector<int> data;", why: "先有容器才谈得上给它租地皮。这一行只是把地皮合同签下来，size 是 0 —— reserve 之后照样是 0，椅子多、坐的人少。" },
        { id: "q3", type: "code", score: 23, coversTask: 1, stem: "写一行循环：往 data 里一个接一个装 i，从 0 装到 9999，一共一万个。", acceptRegex: ["for\\s*\\(\\s*int\\s+i\\s*=\\s*0\\s*;\\s*i\\s*<\\s*10000", "data\\s*\\.\\s*push_back\\s*\\(\\s*i\\s*\\)"], acceptOn: "code", sample: "for (int i = 0; i < 10000; ++i) data.push_back(i);", why: "这一万声 push_back 就是 reserve 要省掉的那笔搬家钱：地皮提前租够，这一次次往里放东西就一次都不挪窝。" },
        { id: "q4", type: "code", score: 24, coversTask: 1, stem: "写一行：把 data 坐了几个人、摆了几把椅子一起打印出来。", acceptRegex: ["println", "data\\s*\\.\\s*size\\s*\\(\\s*\\)", "data\\s*\\.\\s*capacity\\s*\\(\\s*\\)"], acceptOn: "code", sample: "std::println(\"size = {}, capacity = {}\", data.size(), data.capacity());", why: "size 是元素个数，capacity 是租到的位置数。装满之后两个数才追上彼此，这正是验收这次预留有没有生效的那一眼。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <vector>\nint main() {\n    data.reserve(10000);\n    std::vector<int> data;\n    for (int i = 0; i < 10000; ++i) data.push_back(i);\n    std::println(\"size = {}, capacity = {}\", data.size(), data.capacity());\n    return 0;\n}\n"],
        wrongs: [
          "",
          "data.resize(10000);",
          "std::vector<int> data(10000);",
          "data.reserve(10000);\nfor (int i = 0; i < 9999; ++i) data.push_back(i);",
          "std::println(\"size = {}\", data.size());"],
        loose: [
          "#include <print>\n#include <vector>\nint main() {\n    data . reserve (  10000  ) ;\n    std::vector < int >  data ;\n    data.reserve(10000);\n    for ( int  i = 0 ;  i <  10000 ;  ++i )  data . push_back ( i ) ;\n    std::println ( \"size = {}, capacity = {}\" , data . size ( ) ,  data . capacity ( ) ) ;\n    return 0;\n}\n"]
      }
    },
    {
      cid: "m139", kind: "paper", mode: "ide", authored: "9bbf9bf5", file: "main.cpp", pass: 60, task: "任务题目：加一个 namespace my_tools，里面写个 triple 返回三倍，并在 main 里调用；再回答这个区和将来的两个文件是怎么对上的", hint: "想不起来就回看本课【演示 4 · 本课任务】与【演示 2 · 真的拆成三个文件】。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 25, coversTask: 1, stem: "（任务题）写出 my_tools 这个区里 triple 的定义：收一个 int，返回它的三倍。", acceptRegex: ["int\\s+triple\\s*\\(\\s*int\\s+x\\s*\\)", "return\\s+x\\s*\\*\\s*3"], acceptOn: "code", sample: "namespace my_tools { int triple(int x) { return x * 3; } }", why: "这是零件那一侧的写法，函数体在里面；写在清单里就只有签名加分号。两条正则分别认签名与那一句返回。" },
        { id: "q2", type: "code", score: 18, coversTask: 1, stem: "（任务的另一半）写出 my_tools.h 里那份清单上关于 triple 的那一行：只给签名，不给函数体。", acceptRegex: ["int\\s+triple\\s*\\(\\s*int\\s+x\\s*\\)\\s*;"], acceptOn: "code", sample: "int triple(int x);", why: "末尾是分号而不是花括号 —— 「清单可以重复看，零件只能交一遍」这条规矩就落在这一个字符上。" },
        { id: "q3", type: "code", score: 28, coversTask: 1, stem: "（任务的另一半）在 main 里把 my_tools 区的 triple 用上：拿它算 7 的三倍，用标准库那个打印函数把结果打到一行里。", acceptRegex: ["std\\s*::\\s*println\\s*\\(", "my_tools\\s*::\\s*triple\\s*\\(\\s*7\\s*\\)"], acceptOn: "code", sample: "std::println(\"{}\", my_tools::triple(7));", why: "区名加双冒号是进那层壳的唯一走法；调用侧写全名，打印侧只递表达式，结果由 triple 自己算出来。" },
        { id: "q4", type: "code", score: 29, coversTask: 1, stem: "写一行放在 my_tools.h 最上面：让这份清单在每个 .cpp 里只被抄一遍。", acceptRegex: ["#\\s*pragma\\s+once"], acceptOn: "code", sample: "#pragma once", why: "这份清单会被好几份 .cpp 请走，同一个 .cpp 绕着绕着也可能请两遍；这一行是给照抄的抄写员下的口令，同一份文件只抄一次。" }
      ],
      selftest: {
        refs: [
          "#pragma once\n#include <print>\nint main() {\n    namespace my_tools { int triple(int x) { return x * 3; } }\n    int triple(int x);\n    std::println(\"{}\", my_tools::triple(7));\n    return 0;\n}\n"],
        wrongs: [
          "",
          "int triple(int x);",
          "int triple(int x) { return x * 3; }",
          "std::println(\"{}\", triple(7));",
          "#include \"my_tools.h\""],
        loose: [
          "#  pragma   once\nint  triple ( int  x ) {  return  x*3 ; }\nint main() {\n    int triple ( int x ) ;\n    std  ::  println ( \"{}\" ,  my_tools :: triple ( 7 ) ) ;\n    return 0;\n}\n"]
      }
    },
    {
      cid: "m140", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, task: "任务题目：写个宏 QUAD 返回四倍，打印 QUAD(1 + 1)，验证结果是 8 不是 5；再用 -E 看看你的文件被抄成了多少行", hint: "想不起来就回看本课【演示 3 · 本课任务：QUAD 与不给括号的那一版】与【演示 2 · 用 -E 亲眼看见抄写员的成品】。",
      notes: ["本课的 #include 是在编译开始前把那份文件的内容原样抄进你这一行的位置；编译器睁眼时看到的已经是一份抄好的巨大文本。", "这位抄写员不懂 C++，只会照字面抄文件、换名字；实测本机一个只 include print 的文件展开后有六万多行。", "宏没有作用域：从它被定义那一刻起，这份文件剩下的每一处都换；那句 int LIMIT = 5 会直接变成 int 100 = 5。", "打印用的字符串里那几个宏名字不会被换掉；把宏名手滑写成 QUD，编译器报的是某某未声明，先查 define 那行的拼写。", "成品里那些井号加行号加文件名的行，是给编译器对位置用的门牌号。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "写一个带参数的宏 QUAD：把参数先括起来，再整体括起来，乘 4。", acceptRegex: ["#\\s*define\\s+QUAD\\s*\\(\\s*\\w+\\s*\\)\\s*\\(\\s*\\(\\s*\\w+\\s*\\)\\s*\\*\\s*4"], acceptOn: "code", sample: "#define QUAD(x) ((x) * 4)", why: "抄写员把 TRIPLE(7) 抄成 ((7) * 3)：参数是什么字面就搬什么字面，括号的意义就在这里。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "用一条 std::println 把 QUAD(1 + 1) 打出来（宏名当参数传给打印，不是写进字符串里）。", acceptRegex: ["std\\s*::\\s*println\\s*\\([^;]*,\\s*QUAD\\s*\\(\\s*1\\s*\\+\\s*1\\s*\\)"], acceptOn: "code", sample: "std::println(\"QUAD(1 + 1) = {}\", QUAD(1 + 1));", why: "这一句要验的就是结果 8：括号把 1 + 1 先算成 2，再乘 4。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "再写一个故意不括的宏 RAWQUAD：参数不括、整体也不括，直接写 x * 4。", acceptRegex: ["#\\s*define\\s+RAWQUAD\\s*\\(\\s*\\w+\\s*\\)\\s*\\w+\\s*\\*\\s*4"], acceptOn: "code", sample: "#define RAWQUAD(x) x * 4", why: "少一层括号，你就在赌传进来的表达式里没有别的运算符。" },
        { id: "q4", type: "code", score: 20, coversTask: 1, stem: "用一条 std::println 把 RAWQUAD(1 + 1) 也打出来，跟前一行并排看结果。", acceptRegex: ["std\\s*::\\s*println\\s*\\([^;]*,\\s*RAWQUAD\\s*\\(\\s*1\\s*\\+\\s*1\\s*\\)"], acceptOn: "code", sample: "std::println(\"RAWQUAD(1 + 1) = {}\", RAWQUAD(1 + 1));", why: "这一档打出 5：抄写员把 1 + 1 原样搬进去成了 1 + 1 * 4，先乘后加 —— 这一对 8 和 5 就是任务要的结果。" },
        { id: "q5", type: "code", score: 20, stem: "在注释里写下那条只看抄写员成品、不进编译器的命令：g++ 带上 -E，后面跟你的文件名。", acceptRegex: ["g\\s*\\+\\s*\\+[^\\n]*-E[^\\n]*\\.cpp"], acceptOn: "buffer", sample: "// g++ -std=c++23 -E mac.cpp 只干活到抄完为止，把展开结果打到屏幕上", why: "-E 的成品里能亲眼看见 ((1 + 1) * 4) 和 1 + 1 * 4 这两种字面；判的是你写出了这条命令，展开结果对不对得自己看。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\n#define QUAD(x) ((x) * 4)\n#define RAWQUAD(x) x * 4\n\nint main() {\n    std::println(\"QUAD(1 + 1) = {}\", QUAD(1 + 1));\n    std::println(\"RAWQUAD(1 + 1) = {}\", RAWQUAD(1 + 1));\n    return 0;\n}\n// 用 g++ -std=c++23 -E mac.cpp 看展开成品，两行分别是 ((1 + 1) * 4) 和 1 + 1 * 4\n"],
        wrongs: [
          "",
          "#include <print>\n\n#define QUAD(x) x * 4\n\nint main() {\n    std::println(\"{}\", QUAD(7));\n    return 0;\n}\n",
          "#include <print>\n\n#define DOUBLE(x) ((x) * 2)\n\nint main() {\n    std::println(\"{}\", DOUBLE(1 + 1));\n    return 0;\n}\n"],
        loose: [
          "#  include < print >\n#  define  QUAD ( n ) ( ( n ) * 4 )\n#  define  RAWQUAD ( n ) n * 4\n\nint  main ( )\n{\n  std :: println ( \" 带括号 {}\" , QUAD ( 1 + 1 ) ) ;\n  std :: println ( \" 不带括号 {}\" , RAWQUAD ( 1 + 1 ) ) ;\n}\n// g++ -std=c++23 -E quad.cpp | tail -5 看到的就是 8 和 5 这两行\n"]
      }
    },
  ]
};
