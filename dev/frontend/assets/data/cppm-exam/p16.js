/* 喵站 · C++ 掌握 考卷分部 p16：第 137–140 课（第九轮）
 * 契约与 p10 一样：每题分数合计正好 100、源稿每条任务都有题 coversTask 对着、
 * 带 coversTask 的题合计 ≥50 分、每题带 why、refs 判 100 / wrongs 判 <60 / loose 判 ≥60。
 * 四份源稿各只有 1 条【任务】，所以 coversTask 一律是 1。
 */
window.MIAO_CPPM_EXAM_P16 = {
  papers: [
    {
      cid: "m137", kind: "paper", pass: 60,
      task: "任务题目：写一个返回 std::string 的函数，把「1~10 的和 = 55」拼出来，直接 return 那个局部变量 —— 然后说清你为什么不写 std::move",
      hint: "想不起来就回看本课【演示 4 · 本课任务：返回一个拼好的 string】与【演示 2 · 给返回装上计数器】。",
      questions: [
        { id: "q1", type: "choice", score: 10,
          stem: "编译器凭什么敢在返回局部变量时自动用移动？",
          options: ["因为它假定函数返回值一律不许再用", "因为它看得见这东西马上就消失：局部变量出了函数就销毁，抄一份纯属浪费", "因为 std::move 是它偷偷替你写的", "因为容器和字符串都比普通对象小"],
          answer: 1,
          why: "自动移动的全部判据就是「马上就消失」。临时结果也一样：用完当前这句就没了。" },
        { id: "q2", type: "code", score: 20, coversTask: 1,
          stem: "（任务题）函数里已经算好了 int sum = 55。写出最后那两句：把结果拼进一个局部 std::string，然后按本课的写法把它交给调用者。",
          acceptRegex: ["std::string\\s+\\w+\\s*=", "return\\s+\\w+\\s*;"],
          why: "拼字符串用 + 加 std::to_string 都行；关键是 return 后面跟的是那个局部变量的名字，中间不许出现 std::move。" },
        { id: "q3", type: "output", score: 14, coversTask: 1,
          stem: "那个函数返回「1~10 的和 = 」加上 sum，main 里写 std::println 打印它。跑出来是什么？（一行）",
          acceptLines: ["1~10 的和 = 55"],
          why: "1 加到 10 是 55，拼出来的就是这个串。这行输出就是本课任务的验收点，实测本机跑过。" },
        { id: "q4", type: "choice", score: 12, coversTask: 1,
          stem: "实测本机：给一个只有复制构造、没有移动构造的类型写 return std::move(o); 而不是 return o;，结果是什么？",
          options: ["什么都没变，两者都是零次复制", "复制次数从 0 变成 1 —— 整份数据重新抄一遍", "编译不过，编译器拦下这句", "变成零次复制，移动更快"],
          answer: 1,
          why: "直接 return 时编译器把对象就地造在调用者的格子里，一次复制都不发生；那句 std::move 把这条路挡了，只能真复制。对 vector 这种移动便宜的对象你从输出上看不出来，所以这个毛病最会藏。" },
        { id: "q5", type: "multi", score: 14,
          stem: "关于自动移动与 std::move，说法对的是？（多选，错勾任何一项整题 0 分）",
          options: ["返回有名字的局部变量，直接 return 就是最高效的写法", "std::move 之后那个变量成了空壳，要么立刻重新赋值，要么别再出现", "静态变量和类的成员也会被自动移动，因为它们同样住在内存里", "std::string b = 一个临时串; 这种接法不用你写 std::move"],
          answers: [0, 1, 3],
          why: "自动移动的判据是「马上就销毁」。静态变量、全局变量、成员出了这句还要活着，编译器不敢拆，实测写 return cache; 就是一整份复制。" },
        { id: "q6", type: "code", score: 12, coversTask: 1,
          stem: "（任务延伸）写出这一句：把还有名字的 std::string 变量 item 交原件放进 vector 里，也就是本课说的「该你开口」的那种写法。",
          acceptRegex: ["push_back\\s*\\(\\s*std::move\\s*\\(\\s*item\\s*\\)\\s*\\)"],
          why: "编译器看不出你是想留一份还是整个交出，所以有名字、以后还要不要它这件事必须由你说。实测交原件之后 item 里剩 0 个字符。" },
        { id: "q7", type: "blank", score: 6,
          stem: "自动移动的判据只有一句：这个东西是不是马上就____了。是 —— 编译器自己安排；否 —— 才轮到你写 std::move。",
          accept: ["消失", "销毁", "没了", "不存在"],
          why: "局部变量出函数就销毁，临时结果用完这句就销毁 —— 「看得见的不复份」是这一族优化的根。" },
        { id: "q8", type: "choice", score: 12,
          stem: "一个函数返回自己留着的那个静态 vector，两次调用各拿到多少元素？",
          options: ["直接 return 时两次都是 1000 个；写 std::move 后第一次 1000、第二次 0 个", "两种写法都是两次 1000 个，静态变量不许移动", "写 std::move 后两次都是 0 个", "直接 return 那版编译不过"],
          answer: 0,
          why: "实测本机：直接 return 走整份复制，家底还在原地；写了 std::move，第二次调用时那份已经被掏空。交原件前要想清楚这是「一份」而不是「每次」。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: "std::string text = \"1~10 的和 = \" + std::to_string(sum);\n    return text;", q3: "1~10 的和 = 55", q4: 1, q5: [0, 1, 3], q6: "vec.push_back(std::move(item));", q7: "消失", q8: 0 }
        ],
        wrongs: [
          { q1: 0, q2: "std::string text = \"和\"; return std::move(text);", q3: "1~10 的和 = 5", q4: 3, q5: [2], q6: "vec.push_back(item);", q7: "容量", q8: 1 }
        ],
        loose: [
          { q1: "1", q2: "std::string   s = std::to_string ( sum ) ;\nreturn  s ;", q3: " 1~10 的和 = 55 ", q4: "1", q5: [3, 1, 0], q6: "vec . push_back ( std :: move ( item ) ) ;", q7: "销毁", q8: "0" }
        ]
      }
    },
    {
      cid: "m138", kind: "paper", pass: 60,
      task: "任务题目：已知要装一万个 int，写出给 vector 预留容量那一行代码；再回答为什么这一行只能写在 push_back 之前、而不是把 v[0] 当现成元素用",
      hint: "想不起来就回看本课【演示 4 · 本课任务：已知要装一万个 int】与【常见坑】第一条。",
      questions: [
        { id: "q1", type: "choice", score: 10,
          stem: "所谓「搬家式扩容」，vector 装不下时做的是什么动作？",
          options: ["原地把内存撑大，元素一个都不动", "找一块更大的连续地皮，把已有元素全部搬过去，再退掉旧地皮", "把多出来的元素扔进另一个小容器", "直接报错，要求你自己 reserve"],
          answer: 1,
          why: "vector 是一块连着的内存，后面被占了就只能整块挪窝；代价跟「已经装了多少」成正比，这是它疼的地方。" },
        { id: "q2", type: "code", score: 20, coversTask: 1,
          stem: "（任务题）已知要往一个空的 std::vector<int> 里装一万个 int。写出预留容量的那一行，容器名叫 data。",
          acceptRegex: ["data\\s*\\.\\s*reserve\\s*\\(\\s*10000\\s*\\)"],
          why: "一行就够：先租够一万个位置，后面一万次 push_back 就一次家都不用搬。" },
        { id: "q3", type: "output", score: 14, coversTask: 1,
          stem: "先 reserve 一万个位置，再 push_back 一万个 int，然后打印「size = …, capacity = …」。输出是什么？（一行）",
          acceptLines: ["size = 10000, capacity = 10000"],
          why: "装满之后 size 才追上 capacity。只塞三个的话就是 size = 3, capacity = 10000 —— 椅子比人多，这正是 reserve 的作用而不是 bug。" },
        { id: "q4", type: "choice", score: 12, coversTask: 1,
          stem: "实测本机：往空的 vector 里 push_back 一千个元素，搬家次数与最终容量各是多少？",
          options: ["搬 11 次家，容量 1024", "搬 1000 次家，容量 1000", "一次都不搬，容量 1000", "搬 17 次家，容量 131072"],
          answer: 0,
          why: "容量台阶是 1、2、4、8 一路翻倍到 1024，跳一格搬一次，一共 11 次；十万个元素才是 17 次家、容量 131072。" },
        { id: "q5", type: "multi", score: 14,
          stem: "下列说法对的是？（多选，错勾任何一项整题 0 分）",
          options: ["每次翻倍扩容，让搬元素的总次数跟最终规模成正比，所以不 reserve 并不算错", "reserve 只加椅子不多坐人：容量上去了，元素个数还是 0", "std::string 十五个字符以内本来就不去堆上租地皮，所以拿它演示 reserve 常常看不出差别", "reserve 之后可以放心用 v[0]，因为位置已经租好了"],
          answers: [0, 1, 2],
          why: "v[0] 要的是「那里有一个元素」，reserve 只给地皮不给元素；实测 reserve 一万个之后 size 仍是 0，用 v[0] 就是越界。" },
        { id: "q6", type: "output", score: 12, coversTask: 1,
          stem: "给元素装了计数器，往空 vector 里 push_back 一千个元素打印「复制 … 移动 …, 最终容量 …」；第二行是加了 v.reserve(1000) 之后的结果。两行各输出什么？（一行一个结果）",
          acceptLines: ["复制 0 移动 2023, 最终容量 1024", "复制 0 移动 1000, 最终容量 1000"],
          why: "那一千次是 push_back 把临时对象交给容器时的自动移动，reserve 管不着；被清零的是多出来的 1023 次，正是 11 次搬家攒下来的。" },
        { id: "q7", type: "blank", score: 6,
          stem: "reserve 买的是「把搬很多次家换成搬一次家」，卖的是地皮要一次付清。值不值只看一件事：要装多少个是事先____的还是临场才知道的。",
          accept: ["知道", "已知", "确定", "清楚"],
          why: "题目讲明有一万个数、文件里读出十万行，这类才值得报数；规模未知就报个虚高的数，钱花在空椅子上。" },
        { id: "q8", type: "choice", score: 12,
          stem: "关于「搬家会让手里的旧东西作废」，下列哪种写法有风险？",
          options: ["先取好 v[0] 的一个引用存起来，再一路 push_back 到一万个", "每次都用下标现取现用", "在开始 push_back 之前先把容量预留够", "只保留索引，不保留引用"],
          answer: 0,
          why: "实测搬一次家之后数据的地址就换了，扩容一旦发生，先前拿到的引用、指针、记下的位置全部作废；取索引或先 reserve 再取才是稳的。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: "data.reserve(10000);", q3: "size = 10000, capacity = 10000", q4: 0, q5: [0, 1, 2], q6: "复制 0 移动 2023, 最终容量 1024\n复制 0 移动 1000, 最终容量 1000", q7: "知道", q8: 0 }
        ],
        wrongs: [
          { q1: 0, q2: "data.resize(10000);", q3: "size = 0, capacity = 0", q4: 1, q5: [3], q6: "复制 1000 移动 0, 最终容量 1000\n复制 0 移动 0, 最终容量 1000", q7: "猜", q8: 1 }
        ],
        loose: [
          { q1: "1", q2: "data . reserve (  10000  ) ;", q3: " size = 10000, capacity = 10000 ", q4: "0", q5: [2, 0, 1], q6: " 复制 0 移动 2023, 最终容量 1024 \n复制 0 移动 1000, 最终容量 1000 ", q7: "已知", q8: "0" }
        ]
      }
    },
    {
      cid: "m139", kind: "paper", pass: 60,
      task: "任务题目：加一个 namespace my_tools，里面写个 triple 返回三倍，并在 main 里调用；再回答这个区和将来的两个文件是怎么对上的",
      hint: "想不起来就回看本课【演示 4 · 本课任务】与【演示 2 · 真的拆成三个文件】。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          stem: "按本课的说法，把代码拆成多个文件买到的三样东西是？",
          options: ["找代码快、改一处只重编那一处、别人能只借他想要的那块功能", "程序跑得更快、内存占得更少、代码行数变短", "不用再写头文件、不用再写编译命令、不用管链接", "编译器会自动帮你把大文件拆开"],
          answer: 0,
          why: "运行速度跟拆不拆没关系；买的是人的效率与编译的局部性。源稿那个书包类比说的就是「借不走、翻半天」这两件。" },
        { id: "q2", type: "code", score: 18, coversTask: 1,
          stem: "（任务题）写出 my_tools 这个区里 triple 的定义：收一个 int，返回它的三倍。",
          acceptRegex: ["int\\s+triple\\s*\\(\\s*int\\s+x\\s*\\)", "return\\s+x\\s*\\*\\s*3"],
          why: "这是零件那一侧的写法，函数体在里面；写在清单里就只有签名加分号。两条正则分别认签名与那一句返回。" },
        { id: "q3", type: "output", score: 12, coversTask: 1,
          stem: "main 里先打印 math_tools::add(3, 4)，再打印 my_tools::triple(7)。跑出来是什么？（一行一个结果）",
          acceptLines: ["7", "21"],
          why: "3 加 4 是 7，7 的三倍是 21。同一个文件里两个区各交各的活，双冒号那一步实测就是这么调的。" },
        { id: "q4", type: "choice", score: 12, coversTask: 1,
          stem: "你把 my_tools.cpp 忘了交上去，只编 main.cpp。实测会看到什么？",
          options: ["undefined reference to my_tools::triple(int) —— 在最后拼装那一步才报", "my_tools has not been declared —— 编译期就拦下", "编译一路通过，运行时静默输出 0", "编译器替你把缺的那份自己编出来"],
          answer: 0,
          why: "清单请了、零件没交，源码层面无错；这条长在链接器消息里，翻 main.cpp 是白翻，修法是把缺的文件补进编译命令。" },
        { id: "q5", type: "multi", score: 14,
          stem: "关于 .h、.cpp 与 #pragma once，说法对的是？（多选，错勾任何一项整题 0 分）",
          options: ["函数体写进 .h、又被两个 .cpp 请走，实测报 redefinition", "只有签名的 .h 被同一个 .cpp include 两遍，实测不报错：声明允许重复，定义不允许", "#pragma once 是说给编译开始前那位照抄的抄写员听的：这份文件只抄一遍", "区名 my_tools 里的 triple 与别处的 triple 一定冲突，只能改名字"],
          answers: [0, 1, 2],
          why: "区的作用就是让同名不冲突：两个区的 triple 全名不同，各走各的。前三条都是本课在本机实测过的。" },
        { id: "q6", type: "code", score: 12, coversTask: 1,
          stem: "（任务的另一半）写出 my_tools.h 里那份清单上关于 triple 的那一行：只给签名，不给函数体。",
          acceptRegex: ["int\\s+triple\\s*\\(\\s*int\\s+x\\s*\\)\\s*;"],
          why: "末尾是分号而不是花括号 —— 「清单可以重复看，零件只能交一遍」这条规矩就落在这一个字符上。" },
        { id: "q7", type: "blank", score: 10,
          stem: "调用区里的函数时，区名和函数名之间要写那两个符号，本课管它读作「里面的」。那两个符号叫____。",
          accept: ["双冒号", "两个冒号", "冒号冒号", "::"],
          why: "写成 区名::函数名，比如 math_tools::add(3, 4)。这一层壳就是将来文件之间的那道门。" },
        { id: "q8", type: "choice", score: 10,
          stem: "本课实测本机三文件工程：单独编 main.cpp 要 1.29 秒，单独编 my_tools.cpp 要 0.30 秒。你只改了 main.cpp 一行，重编时那 0.30 秒的部分会怎样？",
          options: ["照样重跑一遍，编译器不认改动", "根本不重跑 —— 这正是拆文件买到的东西", "变成 1.29 秒，两份一起编", "必须先手动删掉旧产物才会跳过"],
          answer: 1,
          why: "每份 .cpp 各自编译，谁被改才重编谁；全挤在一个文件里时，改一个字都得重编整个文件。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: "namespace my_tools { int triple(int x) { return x * 3; } }", q3: "7\n21", q4: 0, q5: [0, 1, 2], q6: "int triple(int x);", q7: "双冒号", q8: 1 }
        ],
        wrongs: [
          { q1: 1, q2: "int triple(int x);", q3: "21\n7", q4: 2, q5: [3], q6: "int triple(int x) { return x * 3; }", q7: "点号", q8: 0 }
        ],
        loose: [
          { q1: "0", q2: "int  triple ( int  x ) {  return  x*3 ; }", q3: " 7 \n 21 ", q4: "0", q5: [2, 1, 0], q6: "int triple ( int x ) ;", q7: "::", q8: "1" }
        ]
      }
    },
    {
      cid: "m140", kind: "paper", pass: 60,
      task: "任务题目：写个宏 QUAD 返回四倍，打印 QUAD(1 + 1)，验证结果是 8 不是 5；再用 -E 看看你的文件被抄成了多少行",
      hint: "想不起来就回看本课【演示 3 · 本课任务：QUAD 与不给括号的那一版】与【演示 2 · 用 -E 亲眼看见抄写员的成品】。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          stem: "本课说的 #include，本质在干什么？",
          options: ["向链接器登记一个外部模块，运行时才去找", "在编译开始前，把那份文件的内容原样抄进你这一行的位置", "把这个功能复制进可执行文件里", "告诉编译器去别处找函数体"],
          answer: 1,
          why: "那是一位只照字面办事的抄写员：看见 include 就抄文件，看见 define 就换词。编译器睁眼时看到的已经是一份抄好的巨大文本。" },
        { id: "q2", type: "code", score: 20, coversTask: 1,
          stem: "（任务题）写出那一行宏定义：宏名叫 QUAD、参数叫 x，返回四倍，并且按本课的规矩把该括的地方都括上。",
          acceptRegex: ["define\\s+QUAD", "\\(\\s*x\\s*\\)\\s*\\*\\s*4"],
          why: "两条正则分别认「define 加宏名」与「括起来的参数乘四」。整条写成 ((x) * 4) 这个形状才安全。" },
        { id: "q3", type: "output", score: 14, coversTask: 1,
          stem: "文件里有两行宏：QUAD 是 ((x) * 4)，RAWQUAD 是 x * 4。main 打印这两句，输出是什么？（一行一个结果）\nstd::println(\"QUAD(1 + 1) = {}\", QUAD(1 + 1));\nstd::println(\"RAWQUAD(1 + 1) = {}\", RAWQUAD(1 + 1));",
          acceptLines: ["QUAD(1 + 1) = 8", "RAWQUAD(1 + 1) = 5"],
          why: "任务要验的就是这一对：8 是正确答案，5 是不给括号的下场，本机实测两行都跑过。" },
        { id: "q4", type: "choice", score: 12, coversTask: 1,
          stem: "RAWQUAD 那行为什么是 5 而不是 8？",
          options: ["因为宏只能处理整数", "因为抄写员把 1 + 1 原样搬进去，成了 1 + 1 * 4，先乘后加", "因为宏在编译期就算错了答案", "因为 println 把结果截断了一位"],
          answer: 1,
          why: "宏是机械换词：参数是什么字面就搬什么字面，不先算。括号的意义就在这里 —— 少一层，你就在赌传进来的表达式里没有别的运算符。" },
        { id: "q5", type: "multi", score: 14,
          stem: "关于这位抄写员，说法对的是？（多选，错勾任何一项整题 0 分）",
          options: ["它不懂 C++，只会照字面抄文件、换名字", "实测本机：一个只 include print 的文件展开后有 65779 行", "打印用的字符串里那几个宏名字不会被换掉", "宏跟函数一样有作用域，只在定义它的那个函数里生效"],
          answers: [0, 1, 2],
          why: "宏没有作用域：从它被定义那一刻起，这份文件剩下的每一处都换。实测那句 int LIMIT = 5 直接变成 int 100 = 5。" },
        { id: "q6", type: "code", score: 12, coversTask: 1,
          stem: "（任务的另一半）写出 main 里那一句打印：把 QUAD(1 + 1) 交给 println 打出来。",
          acceptRegex: ["QUAD\\s*\\(\\s*1\\s*\\+\\s*1\\s*\\)"],
          why: "任务要的是这一处调用；写法上引号里放格式串、后面跟表达式，本课的输出一律走 println。" },
        { id: "q7", type: "blank", score: 8,
          stem: "想只看抄写员的成品、不进编译器，用的那条命令是 g++ -std=c++23 ____ 你的文件。",
          accept: ["-E", "-E mac.cpp", "大写的 E"],
          why: "-E 只干活到抄完为止，把展开结果打到屏幕上；成品里那些井号加行号加文件名的行是给编译器对位置用的门牌号。" },
        { id: "q8", type: "choice", score: 8,
          stem: "把宏名 QUAD 手滑写成 QUD 去调用，实测报什么？",
          options: ["QUD was not declared in this scope，后面还会提示 did you mean QUAD", "编译通过，结果为 0", "报 redefinition of QUAD", "抄写员会自动帮你改回来"],
          answer: 0,
          why: "抄写员只认识它见过的 define，没见过就原样交给编译器 —— 编译器第一次见到这个词。看到「某某未声明」而你觉得明明写过，先查 define 那行的拼写。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: "#define QUAD(x) ((x) * 4)", q3: "QUAD(1 + 1) = 8\nRAWQUAD(1 + 1) = 5", q4: 1, q5: [0, 1, 2], q6: "std::println(\"QUAD(1 + 1) = {}\", QUAD(1 + 1));", q7: "-E", q8: 0 }
        ],
        wrongs: [
          { q1: 0, q2: "#define QUAD x * 4", q3: "QUAD(1 + 1) = 5\nRAWQUAD(1 + 1) = 8", q4: 0, q5: [3], q6: "std::println(QUD(2));", q7: "-c", q8: 2 }
        ],
        loose: [
          { q1: "1", q2: "# define  QUAD ( x )   ( ( x )  *  4 )", q3: " QUAD(1 + 1) = 8 \n RAWQUAD(1 + 1) = 5 ", q4: "1", q5: [2, 0, 1], q6: "std :: println ( QUAD ( 1+1 ) ) ;", q7: "E", q8: "0" }
        ]
      }
    }
  ]
};
