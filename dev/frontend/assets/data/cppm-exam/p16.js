/* 喵站 · C++ 掌握 考卷分部 p16：第 137–140 课（第九轮）
 * 契约与 p10 一样：每题分数合计正好 100、源稿每条任务都有题 coversTask 对着、
 * 带 coversTask 的题合计 ≥50 分、每题带 why、refs 判 100 / wrongs 判 <60 / loose 判 ≥60。
 * 四份源稿各只有 1 条【任务】，所以 coversTask 一律是 1。
 */
window.MIAO_CPPM_EXAM_P16 = {
  papers: [
    {
      cid: "m137", kind: "paper", mode: "code", authored: "b9351744", pass: 60, task: "任务题目：写一个返回 std::string 的函数，把「1~10 的和 = 55」拼出来，直接 return 那个局部变量 —— 然后说清你为什么不写 std::move", hint: "想不起来就回看本课【演示 4 · 本课任务：返回一个拼好的 string】与【演示 2 · 给返回装上计数器】。",
      questions: [
        { id: "q1", type: "code", score: 27, coversTask: 1, stem: "（任务题）函数里已经算好了 int sum = 55。写出最后那两句：把结果拼进一个局部 std::string，然后按本课的写法把它交给调用者。", acceptRegex: ["std::string\\s+\\w+\\s*=", "return\\s+\\w+\\s*;"], sample: "std::string text = \"1~10 的和 = \" + std::to_string(sum);\n    return text;", why: "拼字符串用 + 加 std::to_string 都行；关键是 return 后面跟的是那个局部变量的名字，中间不许出现 std::move。" },
        { id: "q2", type: "code", score: 17, coversTask: 1, stem: "（任务延伸）写出这一句：把还有名字的 std::string 变量 item 交原件放进 vector 里，也就是本课说的「该你开口」的那种写法。", acceptRegex: ["push_back\\s*\\(\\s*std::move\\s*\\(\\s*item\\s*\\)\\s*\\)"], sample: "vec.push_back(std::move(item));", why: "编译器看不出你是想留一份还是整个交出，所以有名字、以后还要不要它这件事必须由你说。实测交原件之后 item 里剩 0 个字符。" },
        { id: "q3", type: "code", score: 28, coversTask: 1, stem: "写出 summary 的函数头：不收参数，还一串文字。", acceptRegex: ["std::string\\s+summary\\s*\\(\\s*\\)"], sample: "std::string summary() {", why: "返回类型写 std::string，调用处接的就是本格内存 —— 本课说的自动移动正是从这一行开始的：函数里的局部变量马上销毁，编译器直接把它挪到外面。" },
        { id: "q4", type: "code", score: 28, coversTask: 1, stem: "写一行循环：i 从 1 数到 10，每轮把 i 记进 sum。", acceptRegex: ["for\\s*\\(\\s*int\\s+i\\s*=\\s*1\\s*;\\s*i\\s*<=\\s*10", "(sum\\s*\\+=\\s*i|sum\\s*=\\s*sum\\s*\\+\\s*i)"], sample: "for (int i = 1; i <= 10; ++i) sum += i;", why: "先有 sum 这个数，才谈得上把它拼进文字。循环只管算数，交出去那一步留给后面那句直接 return。" }
      ],
      selftest: {
        refs: [
          {q1: "std::string text = \"1~10 的和 = \" + std::to_string(sum);\n    return text;", q2: "vec.push_back(std::move(item));", q3: "std::string summary() {", q4: "int sum = 0;\nfor (int i = 1; i <= 10; ++i) sum += i;"}],
        wrongs: [
          {q1: "std::string text = \"和\"; return std::move(text);", q2: "vec.push_back(item);", q3: "void summary() {", q4: "int sum = 0;\nfor (int i = 1; i <= 10; ++i) sum = 0;"}],
        loose: [
          {q1: "std::string   s = std::to_string ( sum ) ;\nreturn  s ;", q2: "vec . push_back ( std :: move ( item ) ) ;", q3: "std::string  summary ( ){", q4: "int sum = 0;\nfor ( int  i = 1 ;  i <=  10 ;  ++i )  sum  +=  i ;"}]
      }
    },
    {
      cid: "m138", kind: "paper", mode: "code", authored: "17960153", pass: 60, task: "任务题目：已知要装一万个 int，写出给 vector 预留容量那一行代码；再回答为什么这一行只能写在 push_back 之前、而不是把 v[0] 当现成元素用", hint: "想不起来就回看本课【演示 4 · 本课任务：已知要装一万个 int】与【常见坑】第一条。",
      questions: [
        { id: "q1", type: "code", score: 30, coversTask: 1, stem: "（任务题）已知要往一个空的 std::vector<int> 里装一万个 int。写出预留容量的那一行，容器名叫 data。", acceptRegex: ["data\\s*\\.\\s*reserve\\s*\\(\\s*10000\\s*\\)"], sample: "data.reserve(10000);", why: "一行就够：先租够一万个位置，后面一万次 push_back 就一次家都不用搬。" },
        { id: "q2", type: "code", score: 23, coversTask: 1, stem: "写一行：开出一个还空着的 int 容器 data，一个元素都还没装。", acceptRegex: ["std::vector\\s*<\\s*int\\s*>\\s+data\\s*;"], sample: "std::vector<int> data;", why: "先有容器才谈得上给它租地皮。这一行只是把地皮合同签下来，size 是 0 —— reserve 之后照样是 0，椅子多、坐的人少。" },
        { id: "q3", type: "code", score: 23, coversTask: 1, stem: "写一行循环：往 data 里一个接一个装 i，从 0 装到 9999，一共一万个。", acceptRegex: ["for\\s*\\(\\s*int\\s+i\\s*=\\s*0\\s*;\\s*i\\s*<\\s*10000", "data\\s*\\.\\s*push_back\\s*\\(\\s*i\\s*\\)"], sample: "for (int i = 0; i < 10000; ++i) data.push_back(i);", why: "这一万声 push_back 就是 reserve 要省掉的那笔搬家钱：地皮提前租够，这一次次往里放东西就一次都不挪窝。" },
        { id: "q4", type: "code", score: 24, coversTask: 1, stem: "写一行：把 data 坐了几个人、摆了几把椅子一起打印出来。", acceptRegex: ["println", "data\\s*\\.\\s*size\\s*\\(\\s*\\)", "data\\s*\\.\\s*capacity\\s*\\(\\s*\\)"], sample: "std::println(\"size = {}, capacity = {}\", data.size(), data.capacity());", why: "size 是元素个数，capacity 是租到的位置数。装满之后两个数才追上彼此，这正是验收这次预留有没有生效的那一眼。" }
      ],
      selftest: {
        refs: [
          {q1: "data.reserve(10000);", q2: "std::vector<int> data;", q3: "data.reserve(10000);\nfor (int i = 0; i < 10000; ++i) data.push_back(i);", q4: "std::println(\"size = {}, capacity = {}\", data.size(), data.capacity());"}],
        wrongs: [
          {q1: "data.resize(10000);", q2: "std::vector<int> data(10000);", q3: "data.reserve(10000);\nfor (int i = 0; i < 9999; ++i) data.push_back(i);", q4: "std::println(\"size = {}\", data.size());"}],
        loose: [
          {q1: "data . reserve (  10000  ) ;", q2: "std::vector < int >  data ;", q3: "data.reserve(10000);\nfor ( int  i = 0 ;  i <  10000 ;  ++i )  data . push_back ( i ) ;", q4: "std::println ( \"size = {}, capacity = {}\" , data . size ( ) ,  data . capacity ( ) ) ;"}]
      }
    },
    {
      cid: "m139", kind: "paper", mode: "code", authored: "9bbf9bf5", pass: 60, task: "任务题目：加一个 namespace my_tools，里面写个 triple 返回三倍，并在 main 里调用；再回答这个区和将来的两个文件是怎么对上的", hint: "想不起来就回看本课【演示 4 · 本课任务】与【演示 2 · 真的拆成三个文件】。",
      questions: [
        { id: "q1", type: "code", score: 25, coversTask: 1, stem: "（任务题）写出 my_tools 这个区里 triple 的定义：收一个 int，返回它的三倍。", acceptRegex: ["int\\s+triple\\s*\\(\\s*int\\s+x\\s*\\)", "return\\s+x\\s*\\*\\s*3"], sample: "namespace my_tools { int triple(int x) { return x * 3; } }", why: "这是零件那一侧的写法，函数体在里面；写在清单里就只有签名加分号。两条正则分别认签名与那一句返回。" },
        { id: "q2", type: "code", score: 18, coversTask: 1, stem: "（任务的另一半）写出 my_tools.h 里那份清单上关于 triple 的那一行：只给签名，不给函数体。", acceptRegex: ["int\\s+triple\\s*\\(\\s*int\\s+x\\s*\\)\\s*;"], sample: "int triple(int x);", why: "末尾是分号而不是花括号 —— 「清单可以重复看，零件只能交一遍」这条规矩就落在这一个字符上。" },
        { id: "q3", type: "code", score: 28, coversTask: 1, stem: "（任务的另一半）在 main 里把 my_tools 区的 triple 用上：拿它算 7 的三倍，用标准库那个打印函数把结果打到一行里。", acceptRegex: ["std\\s*::\\s*println\\s*\\(", "my_tools\\s*::\\s*triple\\s*\\(\\s*7\\s*\\)"], sample: "std::println(\"{}\", my_tools::triple(7));", why: "区名加双冒号是进那层壳的唯一走法；调用侧写全名，打印侧只递表达式，结果由 triple 自己算出来。" },
        { id: "q4", type: "code", score: 29, coversTask: 1, stem: "写一行放在 my_tools.h 最上面：让这份清单在每个 .cpp 里只被抄一遍。", acceptRegex: ["#\\s*pragma\\s+once"], sample: "#pragma once", why: "这份清单会被好几份 .cpp 请走，同一个 .cpp 绕着绕着也可能请两遍；这一行是给照抄的抄写员下的口令，同一份文件只抄一次。" }
      ],
      selftest: {
        refs: [
          {q1: "namespace my_tools { int triple(int x) { return x * 3; } }", q2: "int triple(int x);", q3: "std::println(\"{}\", my_tools::triple(7));", q4: "#pragma once"}],
        wrongs: [
          {q1: "int triple(int x);", q2: "int triple(int x) { return x * 3; }", q3: "std::println(\"{}\", triple(7));", q4: "#include \"my_tools.h\""}],
        loose: [
          {q1: "int  triple ( int  x ) {  return  x*3 ; }", q2: "int triple ( int x ) ;", q3: "std  ::  println ( \"{}\" ,  my_tools :: triple ( 7 ) ) ;", q4: "#  pragma   once"}]
      }
    },
    {
      cid: "m140", kind: "paper", mode: "quiz", pass: 60, task: "任务题目：写个宏 QUAD 返回四倍，打印 QUAD(1 + 1)，验证结果是 8 不是 5；再用 -E 看看你的文件被抄成了多少行", hint: "想不起来就回看本课【演示 3 · 本课任务：QUAD 与不给括号的那一版】与【演示 2 · 用 -E 亲眼看见抄写员的成品】。",
      questions: [
        { id: "q1", type: "choice", score: 14, stem: "本课说的 #include，本质在干什么？", options: ["向链接器登记一个外部模块，运行时才去找", "在编译开始前，把那份文件的内容原样抄进你这一行的位置", "把这个功能复制进可执行文件里", "告诉编译器去别处找函数体"], answer: 1, why: "那是一位只照字面办事的抄写员：看见 include 就抄文件，看见 define 就换词。编译器睁眼时看到的已经是一份抄好的巨大文本。" },
        { id: "q2", type: "output", score: 26, coversTask: 1, stem: "文件里有两行宏：QUAD 是 ((x) * 4)，RAWQUAD 是 x * 4。main 打印这两句，输出是什么？（一行一个结果）\nstd::println(\"QUAD(1 + 1) = {}\", QUAD(1 + 1));\nstd::println(\"RAWQUAD(1 + 1) = {}\", RAWQUAD(1 + 1));", acceptLines: ["QUAD(1 + 1) = 8", "RAWQUAD(1 + 1) = 5"], why: "任务要验的就是这一对：8 是正确答案，5 是不给括号的下场，本机实测两行都跑过。" },
        { id: "q3", type: "choice", score: 24, coversTask: 1, stem: "RAWQUAD 那行为什么是 5 而不是 8？", options: ["因为宏只能处理整数", "因为抄写员把 1 + 1 原样搬进去，成了 1 + 1 * 4，先乘后加", "因为宏在编译期就算错了答案", "因为 println 把结果截断了一位"], answer: 1, why: "宏是机械换词：参数是什么字面就搬什么字面，不先算。括号的意义就在这里 —— 少一层，你就在赌传进来的表达式里没有别的运算符。" },
        { id: "q4", type: "multi", score: 17, stem: "关于这位抄写员，说法对的是？（多选，错勾任何一项整题 0 分）", options: ["它不懂 C++，只会照字面抄文件、换名字", "实测本机：一个只 include print 的文件展开后有 65779 行", "打印用的字符串里那几个宏名字不会被换掉", "宏跟函数一样有作用域，只在定义它的那个函数里生效"], answers: [0, 1, 2], why: "宏没有作用域：从它被定义那一刻起，这份文件剩下的每一处都换。实测那句 int LIMIT = 5 直接变成 int 100 = 5。" },
        { id: "q5", type: "blank", score: 10, stem: "想只看抄写员的成品、不进编译器，用的那条命令是 g++ -std=c++23 ____ 你的文件。", accept: ["-E", "-E mac.cpp", "大写的 E"], why: "-E 只干活到抄完为止，把展开结果打到屏幕上；成品里那些井号加行号加文件名的行是给编译器对位置用的门牌号。" },
        { id: "q6", type: "choice", score: 9, stem: "把宏名 QUAD 手滑写成 QUD 去调用，实测报什么？", options: ["QUD was not declared in this scope，后面还会提示 did you mean QUAD", "编译通过，结果为 0", "报 redefinition of QUAD", "抄写员会自动帮你改回来"], answer: 0, why: "抄写员只认识它见过的 define，没见过就原样交给编译器 —— 编译器第一次见到这个词。看到「某某未声明」而你觉得明明写过，先查 define 那行的拼写。" }
      ],
      selftest: {
        refs: [
          {q1: 1, q2: "QUAD(1 + 1) = 8\nRAWQUAD(1 + 1) = 5", q3: 1, q4: [0, 1, 2], q5: "-E", q6: 0}],
        wrongs: [
          {q1: 0, q2: "QUAD(1 + 1) = 5\nRAWQUAD(1 + 1) = 8", q3: 0, q4: [3], q5: "-c", q6: 2}],
        loose: [
          {q1: "1", q2: " QUAD(1 + 1) = 8 \n RAWQUAD(1 + 1) = 5 ", q3: "1", q4: [2, 0, 1], q5: "E", q6: "0"}]
      }
    },
  ]
};
