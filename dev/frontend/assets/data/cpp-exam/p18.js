/* 喵站 · C++ 入门 考卷分部 p18：第 75–78 课（第九轮 · 指针篇收尾）
 *
 * 每场卷照 cpp-exam/p13.js 的形状与硬指标（cpp-exam-check 逐条对账）：
 *   1. kind:"paper"，题型只用笔试引擎认的六种；
 *   2. 各题 score 相加正好 100；
 *   3. 源稿每一条【任务】都有题用 coversTask 对着它；
 *   4. 带 coversTask 的题合计 >=50 分；choice >=2；output >=1；
 *   5. 每题带 why；selftest 的 refs 判 100、wrongs 判 <60、loose 判 >=60。
 *
 * 守的闸线：c75 卷面不出现 new / delete（76 课首现）、不出现智能指针（78 课首现）；
 *           c76、c77 卷面同样不出现智能指针那三个词；struct / class 一律不出现。
 *           异常是 176 课才教的东西，闸按词面拦读者可见字段，所以 c77 那两场涉及捕获的题
 *           一律写「被盯着的那块花括号」「按类型接住」，try 与 catch 只出现在 selftest 的参考解里。
 * 读者看得见的字段一律用中文括号，代码原文里才出现半角括号。
 *
 * 验收：node --check dev/frontend/assets/data/cpp-exam/p18.js
 *       node dev/tools/cpp-exam-check.cjs --only c75,c76,c77,c78
 */
window.MIAO_CPP_EXAM_P18 = {
  papers: [
    {
      cid: "c75", kind: "paper", pass: 60,
      title: "第 75 课考试 · 指针 vs 引用",
      task: "任务题目：写一个返回「较大者引用」的 max_of，在外面一句 max_of(x, y) = 0; 就把较大者清零；再写一个原地反转 vector 的 reverse，不返回新容器。顺带回答：想改绑引用办不到，指针为什么办得到",
      hint: "想不起来就回看正文【演示 1】那句 ref = b 落在哪个盒子、【演示 2】三行各自的分工，以及【任务】那三条的原话。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          coversTask: 3,
          stem: "源稿实验 1：int& ref = a; 之后写 ref = b;。关于这句，哪种说法是对的？",
          options: ["把 b 的值抄进 a，ref 仍然只拴着 a", "ref 从此改拴到 b，a 不再受影响", "a 和 b 的值互相交换", "编译不过，引用身上不许写等号"],
          answer: 0,
          why: "引用身上的等号永远是「给本人赋值」，改绑这个动作在 C++ 里压根不存在。实验 1 跑完 a 变 20、b 仍是 20，就是这个道理。" },
        { id: "q2", type: "output", score: 14,
          coversTask: 1,
          stem: "这段程序打印什么？（一行一条，两行）\nint& max_of(int& x, int& y) {\n    if (x > y) return x;\n    return y;\n}\nint main() {\n    int a = 30, b = 70;\n    max_of(a, b) = 0;\n    std::println(\"a={}, b={}\", a, b);\n    std::println(\"a 没被动过吗? {}\", a == 30);\n    return 0;\n}",
          acceptLines: ["a=30, b=0", "a 没被动过吗? true"],
          why: "max_of 里 70 大于 30，所以还回来的是 b 本人的外号；给这个外号写 0，改的就是 b。a 从头到尾没人碰，第二句比较成立，打 true。" },
        { id: "q3", type: "code", score: 14,
          coversTask: 1,
          stem: "写出 max_of 的函数头：它收两个 int 的引用，返回「其中较大那个」的引用。（只写开头那一行就够）",
          acceptRegex: ["int\\s*&\\s*max_of"],
          why: "关键在类型后面那个 & —— 返回类型写成 int 就只是还一份复印件，外面再怎么赋值都碰不到原件。int& max_of(int& x, int& y) 才让 max_of(a, b) = 0; 真改到 a 或 b。" },
        { id: "q4", type: "code", score: 14,
          coversTask: 2,
          stem: "补出 reverse 的参数写法：它要能真改掉外面那个 vector，不返回新容器。void reverse(____)。",
          acceptRegex: ["vector\\s*<\\s*int\\s*>\\s*&"],
          why: "参数类型是 std::vector<int>&：带上 & 才是外号，能原地改；漏掉 & 就等于把整串分数复印一份进去折腾，外面一点感觉没有 —— 这正是第 55 课那条天花板的解药。" },
        { id: "q5", type: "choice", score: 12,
          stem: "下面哪个场景真的需要指针，引用表达不出来？",
          options: ["一个查找函数可能什么都没找到，得写明「目前没有」", "函数要原地改掉传进来的 vector", "要在函数里返回某个变量本身，让调用方接着改", "想把一整串 int 递给函数，不加 &"],
          answer: 0,
          why: "后三条都是「必然有个东西、也不许换」，引用正好合用，而且更安全。只有「可空」这一件事引用办不到 —— 外号不能悬空挂在没人身上，这才轮到纸条上场。" },
        { id: "q6", type: "blank", score: 8,
          stem: "想让一张纸条明确写着「目前没有指向」，就把它初始化成____。（填那个关键字）",
          accept: ["nullptr", "NULL", "nullptr 常量"],
          why: "写 int* p = nullptr; 是合法而且推荐的：纸条可以空着。空着的危害在于硬去解引用会当场段错误，所以用之前先跟 nullptr 比一次。" },
        { id: "q7", type: "multi", score: 14,
          coversTask: 3,
          stem: "关于引用和指针的三大区别，下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["引用声明那一行就必须指认本人，指针可以先声明、后指认", "指针能换指向，且原盒子的值不受牵连", "引用也能靠一句赋值改拴到另一个变量身上，只是要多写一个星号", "用起来引用像本人，指针要 & 问地址、* 取值"],
          answers: [0, 1, 3],
          why: "第三条是本课最贵的坑：改绑这个动作对引用不存在，加星号也救不了 —— 写 r = b 只是把 b 的值灌进本人。其余三条就是「出生、改绑、长相」三大区别。" },
        { id: "q8", type: "order", score: 12,
          stem: "把「用纸条换指向并改掉一个值」这五步排成正确顺序。",
          steps: ["声明两个 int 盒子 c 和 d", "写 int* p = &c;，纸条上填 c 的门牌号", "把纸条涂掉重填：p = &d;", "解引用改值：*p = 44;", "打印确认：只有 d 变了，c 毫发无损"],
          answer: [0, 1, 3, 2, 4],
          why: "先有盒子才有地址可问；纸条填上号之后才谈得上换号。注意顺序里的关键一环：本题演示的是「先改号再动值」，所以 44 落到了 d 头上 —— 要是把换号那句挪到最后，被改的就是 c 了。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: "a=30, b=0\na 没被动过吗? true", q3: "int& max_of(int& x, int& y) {", q4: "void reverse(std::vector<int>& v)", q5: 0, q6: "nullptr", q7: [0, 1, 3], q8: [0, 1, 3, 2, 4] }
        ],
        wrongs: [
          { q1: 1, q2: "a=0, b=70\na 没被动过吗? false", q3: "int max_of(int x, int y) {", q4: "void reverse(std::vector<int> v)", q5: 1, q6: "0", q7: [0, 1, 2], q8: [0, 1, 2, 3, 4] }
        ],
        loose: [
          { q1: "0", q2: " a=30, b=0 \na 没被动过吗?  true", q3: "int & max_of ( int & x , int & y )", q4: "void reverse(std::vector <int> & v)", q5: "0", q6: "NULL", q7: [0, 1, 3], q8: [0, 1, 3, 2, 4] }
        ]
      }
    },
    {
      cid: "c76", kind: "paper", pass: 60,
      title: "第 76 课考试 · 栈与堆",
      task: "任务题目：用 new 申请一个装 10 个 int 的数组，往里填 1 到 10，求和打印，然后用 delete[] 归还；再把归还那句注释掉跑一遍，说说为什么程序表面一切正常、内存却漏了；最后答一句：大数组为什么建议放堆上",
      hint: "想不起来就回看正文【演示 2】那两行收尾的仪式、【演示 3】里 int 数组长度为什么不能是现场才知道的数，还有那张两块地的示意图。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          coversTask: 3,
          stem: "一个要装一百万个 int 的数组，源稿建议放堆上。最硬的理由是哪一条？",
          options: ["栈那几 MB 装不下，硬放会堆栈溢出当场崩", "堆上的数组读起来比栈上快", "只有堆上的数组才能用下标访问", "放在栈上编译器会直接报错，不让过"],
          answer: 0,
          why: "栈通常只有几 MB，一百万个 int 是 4 MB 左右，加上别的现场一起就溢出。第二条说反了：栈更省更快；第三条、第四条都不成立，栈上数组照样用下标，小数组照样合法。" },
        { id: "q2", type: "code", score: 14,
          coversTask: 1,
          stem: "写出申请那一行：向仓库要 10 个连着摆的 int，交给一张纸条接住。（把 new 的那一段写对就行）",
          acceptRegex: ["new\\s*int\\s*\\[\\s*10\\s*\\]"],
          why: "方括号里是要几个，new 还回来的是这一排的起点地址，所以左边必须是 int* 的变量。写成 new int[10] 却用 int 接，就丢了归还的唯一线索。" },
        { id: "q3", type: "code", score: 12,
          coversTask: 1,
          stem: "写出归还那一行：上面那 10 个格子用完，整排一起还回仓库。",
          acceptRegex: ["delete\\s*\\[\\s*\\]"],
          why: "数组必须用带方括号的 delete[]，口诀是「成对记」：申请时带了几个方括号，归还时就带几个。漏掉方括号，编译器会给一句 warning 说这指针是 new[] 出来的。" },
        { id: "q4", type: "output", score: 14,
          coversTask: 1,
          stem: "这段程序打印什么？（一行一条，两行）\nint main() {\n    int* arr = new int[4]{3, 6, 9, 12};\n    int sum = 0;\n    for (int i = 0; i < 4; ++i) sum += arr[i];\n    std::println(\"和 = {}\", sum);\n    delete[] arr;\n    arr = nullptr;\n    return 0;\n}",
          acceptLines: ["和 = 30"],
          why: "3+6+9+12 是 30。这一行的看点在后头：先算完再归还，归还之后立刻把纸条写成 nullptr —— 顺序颠倒的话，读到的就是垃圾。" },
        { id: "q5", type: "choice", score: 12,
          coversTask: 2,
          stem: "把 delete[] 那一行注释掉再跑，会发生什么？",
          options: ["程序表面完全正常、结果一行不缺，但那块地一直没还，内存漏了", "编译立刻失败，报错说少了 delete", "运行时当场段错误，提醒你必须归还", "程序结束时操作系统会回收，所以等于没漏"],
          answer: 0,
          why: "这正是裸 new 最阴的地方：这种「看不到的错误」编译器不拦、运行不崩，长期跑的服务会被一点点拖垮。" },
        { id: "q6", type: "blank", score: 8,
          stem: "函数一进来就摆盒子、函数一返回就整层自动收走的那块地叫____。（填一个字）",
          accept: ["栈", "stack", "调用栈"],
          why: "栈是「摞盘子」：后摆的先收，全靠机器移动一根指针，快到几乎不要钱，代价是只有几 MB，而且跟着函数一起消失。" },
        { id: "q7", type: "multi", score: 14,
          coversTask: [1, 3],
          stem: "关于栈与堆，下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["new 还回来的是地址，所以堆和指针总是一起讲", "栈上数组的长度必须是编译期就能定下来的数", "delete[] 之后纸条上的地址会自动变成 nullptr", "想让一个东西在函数结束之后还活着，就得让它住堆上"],
          answers: [0, 1, 3],
          why: "第三条错得要命：归还的是那块地，纸条上那串号照旧写着，误用就成了悬垂。所以正文里 delete 之后紧跟一句赋 nullptr，那是人写的，不是机器做的。" },
        { id: "q8", type: "order", score: 14,
          coversTask: 1,
          stem: "把「借仓库办一件事」这五步排成正确顺序。",
          steps: ["用下标把格子里填上 1 到 10", "向仓库申请：new 一个装 10 个 int 的数组", "拿纸条上的地址求和、打印", "把整排地归还：delete[]", "顺手把纸条写成 nullptr"],
          answer: [1, 0, 2, 3, 4],
          why: "先申请才有地可填，填完才能读着算，算完归还、最后撕纸条 —— 撕纸条这一步写在 delete[] 后面半秒都不能省，它是下一课那四个坑的第一道闸。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: "int* arr = new int[10];", q3: "delete[] arr;", q4: "和 = 30", q5: 0, q6: "栈", q7: [0, 1, 3], q8: [1, 0, 2, 3, 4] }
        ],
        wrongs: [
          { q1: 1, q2: "int arr[10];", q3: "delete arr;", q4: "和 = 4", q5: 1, q6: "堆", q7: [0, 1, 2], q8: [0, 1, 2, 3, 4] }
        ],
        loose: [
          { q1: "0", q2: "int * p = new int [ 10 ] ;", q3: "delete [ ] arr ;", q4: " 和 = 30 ", q5: "0", q6: "stack", q7: [0, 1, 3], q8: [1, 0, 2, 3, 4] }
        ]
      }
    },
    {
      cid: "c77", kind: "paper", pass: 60,
      title: "第 77 课考试 · 裸指针的四大坑",
      task: "任务题目：把坑① 里那句解引用挪到 if 外面，对 nullptr 硬来一次，看清崩溃信息里的 segfault 或段错误字样；再用带边界检查的那扇门取一次越界的格子，把抛出来的那只东西接住、打印它的消息；最后答一句：坑③ 泄漏和坑④ 越界，编译器为什么不报错",
      hint: "想不起来就回看正文【演示 1】那个 else、【演示 2】delete 后面紧跟的那句置空，还有【演示 3】里那两块花括号各管哪一段。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          stem: "「悬垂指针」说的是下面哪一种情况？",
          options: ["纸条上还写着一块已经 delete 掉的地的号", "纸条压根没初始化，里面是随机残留", "纸条指向的那块地在栈上", "同一块地被 delete 了两次"],
          answer: 0,
          why: "悬垂的样子就是「门牌号还在、房子已拆」：还掉的是地，纸条上那串号一个字不会少。没初始化那种叫野指针，是坑①。" },
        { id: "q2", type: "choice", score: 12,
          coversTask: 1,
          stem: "int* wild = nullptr; 之后把解引用那句挪到 if 外面，直接写 *wild = 1;。会怎样？",
          options: ["编译能过，运行时当场崩，信息里有 segfault 或段错误字样", "编译就过不去，报错说不能对 nullptr 赋值", "没事，写进一个谁也用不到的地方", "wild 自动指向一个新申请的盒子"],
          answer: 0,
          why: "这一句格式完全合法，所以编译器放行；崩是运行时崩的。源稿这个任务就是让你见一次那种信号，见过就忘不了「用之前先判断」那句口诀。" },
        { id: "q3", type: "output", score: 14,
          stem: "这段程序打印什么？（一行一条，两行）\nint main() {\n    int* p = new int(5);\n    std::println(\"{}\", *p);\n    delete p;\n    p = nullptr;\n    std::println(\"{}\", p == nullptr);\n    return 0;\n}",
          acceptLines: ["5", "true"],
          why: "第一行是还没还的时候读到的 5；归还之后纸条被我们自己涂成空号，跟 nullptr 一比自然成立，打 true。这两句连着写的纪律，就是坑② 唯一的护栏。" },
        { id: "q4", type: "code", score: 14,
          coversTask: 2,
          stem: "补出正文【演示 3】里「接住越界那只东西」那一行的关键部分：括号里要写明接的是哪种类型、用引用接、再给它起个名字。把类型和引用符号写出来就行。",
          acceptRegex: ["std::out_of_range\\s*&"],
          why: "标准写法是接 const std::out_of_range 的引用，名字随你起。类型要对得上才接得住，用引用接才不会复制那只东西，之后靠它的 what 拿到那句人话消息。" },
        { id: "q5", type: "choice", score: 12,
          coversTask: 3,
          stem: "坑③ 内存泄漏和坑④ 越界访问，编译器为什么不报错？",
          options: ["编译器只查语法，这两件事都得运行时才知道答案", "编译器偷懒，标准允许它不管这两处", "因为这两处其实不算错误，只是不优雅", "只要 include 写全它就会检查，是初学者没写全"],
          answer: 0,
          why: "一块地有没有还、一个下标超没超出，取决于程序跑起来那刻的实际状态 —— 编译器读源码时既不知道 new 了几次，也不知道 size 当场是几。这正是 C++「不查就不付钱」的取舍。" },
        { id: "q6", type: "blank", score: 8,
          coversTask: 1,
          stem: "对空纸条解引用崩掉时，调试信息里那句信号名叫____。（写英文字样或中文「段错误」都行）",
          accept: ["SIGSEGV", "segfault", "段错误", "signal 11"],
          why: "这个信号是操作系统发来的：你指的那块地压根不在这个进程名下。看到它就该想到那句 != nullptr 的判断写漏了。" },
        { id: "q7", type: "multi", score: 14,
          coversTask: [1, 3],
          stem: "关于四个坑的防护口诀，下面哪些是对的？（多选，错勾任何一项整题 0 分）",
          options: ["纸条没指向谁就先写 nullptr，用之前再判一次", "delete 完紧跟一句把纸条写成 nullptr，中间不插别的", "方括号不查边界，at 查；at 越界会抛出可以被接住的东西", "编译器不报错的地方，就说明这段代码是对的"],
          answers: [0, 1, 2],
          why: "第四条正是本课要打破的错觉：四个坑全都「格式合法、语义错」，编译器一声不响，运行起来才出事。护栏得由人自己补，那三句口诀就是护栏。" },
        { id: "q8", type: "order", score: 14,
          coversTask: 2,
          stem: "把「用带检查的那扇门处理一次越界」这五步排成正确顺序。",
          steps: ["把可能越界的那句读取放进被盯着的那块花括号里", "at 一查，发现下标不在合法范围内", "抛出 std::out_of_range，那句读取当场停", "按类型接住那只东西，拿到它的引用", "打印它的消息，程序接着往下跑"],
          answer: [0, 1, 2, 3, 4],
          why: "顺序就是运行时的时间线：先给一段被盯着的代码，at 一查越界就抛，抛出去的东西按类型被接住，接住了才谈得上打印消息并活下去。没接住，程序就在抛出那一行终止。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: 0, q3: "5\ntrue", q4: "catch (const std::out_of_range& e)", q5: 0, q6: "SIGSEGV", q7: [0, 1, 2], q8: [0, 1, 2, 3, 4] }
        ],
        wrongs: [
          { q1: 3, q2: 1, q3: "5\nfalse", q4: "catch (int e)", q5: 1, q6: "内存不足", q7: [0, 1, 3], q8: [1, 0, 2, 3, 4] }
        ],
        loose: [
          { q1: "0", q2: "0", q3: " 5 \n true ", q4: "catch ( std::out_of_range & err )", q5: "0", q6: " 段错误 ", q7: [0, 1, 2], q8: [0, 1, 2, 3, 4] }
        ]
      }
    },
    {
      cid: "c78", kind: "paper", pass: 60,
      title: "第 78 课考试 · 智能指针",
      task: "任务题目：把上一课坑③ 那个「new 一百万次、归还零次」的循环改成 unique_ptr 版本，确认自己一句归还都不用写；再用 make_unique 造一个能装 10 个 int 的数组、填 1 到 10 求和，跟第 76 课手写 delete 那一版比一比；最后答一句：为什么说 vector 加智能指针消灭了你 99% 的 new 和 delete 需求",
      hint: "想不起来就回看正文【演示 1】那两个大括号、【演示 2】末尾那个一百万圈的循环，还有【演示 3】那三行计数。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          coversTask: 3,
          stem: "下面哪一件事仍然该交给智能指针，而不是容器或者引用？",
          options: ["在堆上造一个对象，而且它的寿命要跨过大括号活到外面", "存 10 个分数，长度以后还会变", "把一整串文字递给一个函数去读，不复制", "让函数原地改掉外面那个 vector"],
          answer: 0,
          why: "一串会长的东西交给 vector；只借看不复制交给 const 引用；只有「一个东西必须在堆上、还得活得比某块花括号久」这一小块，才轮到智能指针 —— 这正是那 99% 与 1% 的分界。" },
        { id: "q2", type: "output", score: 14,
          coversTask: 1,
          stem: "这段程序打印什么？（一行一条，两行）\nint main() {\n    {\n        auto p = std::make_unique<int>(42);\n        std::println(\"{}\", *p);\n    }\n    std::println(\"出作用域之后没人再管归还\");\n    return 0;\n}",
          acceptLines: ["42", "出作用域之后没人再管归还"],
          why: "纸条 p 活到那块花括号合上为止：读到 42，然后它到寿，地自动还回仓库。第二句照旧打印 —— 全段一句 delete 都没有，泄漏和悬垂一并没了。" },
        { id: "q3", type: "code", score: 14,
          coversTask: 2,
          stem: "写出申请那一行：用 make_unique 造一个能装 10 个 int 的数组，交给 auto 接住。（尖括号里要写明这是数组，圆括号里给出个数）",
          acceptRegex: ["make_unique\\s*<\\s*int\\s*\\[\\s*\\]"],
          why: "数组有专门的类型写法：尖括号里 int 后面跟一对空方括号，圆括号里写 10。造出来之后下标访问照旧，归还时它自己知道整排怎么还，你不用去记 delete 带不带方括号那件事。" },
        { id: "q4", type: "blank", score: 8,
          coversTask: 1,
          stem: "改成 unique_ptr 版本之后，那句归还还要不要你自己写？（答要不要都行，写清楚）",
          accept: ["不用", "不需要", "不写", "不用写", "不要", "否"],
          why: "不要。归还被绑在纸条的寿命上：作用域一结束，它的收尾动作自动执行。这正是智能指针相对裸 new 唯一但最值钱的区别。" },
        { id: "q5", type: "choice", score: 12,
          stem: "auto q = std::move(p); 跑完之后，p 现在是什么？",
          options: ["一张空纸条，跟 nullptr 一样", "仍然指着原来那块地，只是多了一个人用", "指向 p 自己，成了自引用", "被编译器直接删掉，这个名字不再存在"],
          answer: 0,
          why: "独占的钥匙只有一把，递出去原主当场空掉 —— 这也是它的安全网：之后误用 p 会当场崩给你看，而不是悄悄读着一块别人已经租走的地。想复制 unique_ptr 压根编译不过。" },
        { id: "q6", type: "multi", score: 16,
          stem: "关于 shared_ptr 的计数，下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["赋值给新的合租人，计数加一", "每一位合租人出作用域，计数减一", "数到零那一刻才真的归还那块地", "两张 shared_ptr 互相指向对方，计数照样会归零"],
          answers: [0, 1, 2],
          why: "第四条是这套机制唯一治不了的漏：互相牵着就谁都不肯先松手，计数永不归零，地还不回来 —— 没有报错也没有崩溃，得等以后再学的一招来解。" },
        { id: "q7", type: "order", score: 14,
          coversTask: 1,
          stem: "把「一张 unique_ptr 从出生到自动归还」这五步排成正确顺序。",
          steps: ["make_unique 造出纸条，接住刚划出来的那块地", "用星号或者下标正常读写那块地", "大括号合上，纸条到寿", "纸条的收尾动作把地还给仓库", "全程你没写过一句归还"],
          answer: [0, 1, 2, 3, 4],
          why: "顺序就是作用域的时间线：先造才有得用，用完那一层结束，归还跟着结束自动发生 —— 「不用写 delete」是这条链跑到底的结果，不是前提。" },
        { id: "q8", type: "choice", score: 10,
          coversTask: 3,
          stem: "源稿那句「实际开发 99% 的动态数组直接用容器」是什么意思？",
          options: ["要一串东西就交给 vector，它自己管内存，压根轮不到你写 new 和 delete", "容器比智能指针慢，所以只留 1% 的场合用它", "vector 内部也是智能指针，所以两者其实是一样东西", "数组永远不该放上堆"],
          answer: 0,
          why: "vector 早就在做同样的事：容器一死，地就还 —— 你从来没为一串 int 操过心。剩下的 1% 是「单个对象要在堆上、寿命自己说」，那才轮到智能指针。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: "42\n出作用域之后没人再管归还", q3: "auto arr = std::make_unique<int[]>(10);", q4: "不用", q5: 0, q6: [0, 1, 2], q7: [0, 1, 2, 3, 4], q8: 0 }
        ],
        wrongs: [
          { q1: 2, q2: "42", q3: "auto arr = new int[10];", q4: "要", q5: 1, q6: [0, 1, 3], q7: [1, 0, 2, 3, 4], q8: 1 }
        ],
        loose: [
          { q1: "0", q2: " 42 \n 出作用域之后没人再管归还 ", q3: "std::make_unique< int [ ] >( 10 )", q4: "不需要", q5: "0", q6: [0, 1, 2], q7: [0, 1, 2, 3, 4], q8: "0" }
        ]
      }
    }
  ]
};
