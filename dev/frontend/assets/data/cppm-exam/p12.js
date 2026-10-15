/* 喵站 · C++ 掌握 考卷分部 p12：第 121–124 课
 * 契约：权重和 100、任务逐条 coversTask、refs 判 100 / wrongs <60 / loose 过。
 * 号段纪律：这四场只考 值 / unique_ptr / 过户 / shared_ptr 计数 / 三种持有方式对比，
 *           题面与解析里不出现后面几课才教的名字；输出题的数字全部本机 g++ 实测过。
 */
window.MIAO_CPPM_EXAM_P12 = {
  papers: [
    {
      cid: "m121", kind: "paper", mode: "ide", authored: "7a764f68", file: "main.cpp", pass: 60, title: "第 121 课考试 · unique_ptr 独占", task: "任务题目：用 std::make_unique 造一个装三个 int 的数组，填 1、2、3 并把 arr[2] 打出来，再挨个打印整串", hint: "想不起来就回看本课【演示 1 · 数组版本：尖括号里写方括号】。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 27, coversTask: 1, stem: "（任务题）写出这两句：用一个变量 arr 保管着三个 int 的数组；再把第三格填成 3。", acceptRegex: ["make_unique\\s*<\\s*int\\s*\\[\\s*\\]\\s*>\\s*\\(\\s*3\\s*\\)", "arr\\s*\\[\\s*2\\s*\\]\\s*=\\s*3"], acceptOn: "code", sample: "auto arr = std::make_unique<int[]>(3);\narr[2] = 3;", why: "数组版本在尖括号里写方括号、圆括号里写格数；下标 arr[2] 正是第三格，出作用域走的是数组那套释放，不用你区分。" },
        { id: "q2", type: "code", score: 18, coversTask: 1, stem: "（任务题）写出把 arr 的三个数挨个打印出来的那一行：下标变量叫 i，从 0 数到 2，每格打一个数。", acceptRegex: ["for\\s*\\(", "arr\\s*\\[\\s*i\\s*\\]"], acceptOn: "code", sample: "for (size_t i = 0; i < 3; ++i) std::print(\"{} \", arr[i]);", why: "数组版本的 unique_ptr 下标照旧能用，arr[i] 就是第 i 格；一串三格就数到小于 3。" },
        { id: "q3", type: "code", score: 27, coversTask: 1, stem: "写一行：用 arr 保管着三格 int 的数组，把 1、2、3 挨个填进这三格。", acceptRegex: ["arr\\s*\\[\\s*0\\s*\\]\\s*=\\s*1", "arr\\s*\\[\\s*1\\s*\\]\\s*=\\s*2", "arr\\s*\\[\\s*2\\s*\\]\\s*=\\s*3"], acceptOn: "code", sample: "arr[0] = 1; arr[1] = 2; arr[2] = 3;", why: "make_unique 造出来的数组是清零的，要什么内容得一格一格自己填；下标从 0 起，三格就是 0、1、2。" },
        { id: "q4", type: "code", score: 28, coversTask: 1, stem: "写一行打印：把 arr 第三格（下标 2 那格）的值打出来，前面带上「arr[2] = 」这几个字。", acceptRegex: ["std\\s*::\\s*println\\s*\\(", "\\{\\s*\\}", "arr\\s*\\[\\s*2\\s*\\]"], acceptOn: "code", sample: "std::println(\"arr[2] = {}\", arr[2]);", why: "数组版本的 unique_ptr 下标照用，arr[2] 就是第三格；填了 3 之后这一行打出 arr[2] = 3。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <memory>\nint main() {\n    auto arr = std::make_unique<int[]>(3);\n    arr[2] = 3;\n    for (size_t i = 0; i < 3; ++i) std::print(\"{} \", arr[i]);\n    arr[0] = 1; arr[1] = 2; arr[2] = 3;\n    std::println(\"arr[2] = {}\", arr[2]);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "int arr[3];\narr[2] = 3;",
          "std::println(\"{}\", arr);",
          "arr[0] = 1; arr[1] = 2;",
          "std::println(\"arr[1] = {}\", arr[1]);"],
        loose: [
          "int main() {\n    auto arr = std :: make_unique < int [ ] > ( 3 ) ;\n    arr [ 2 ] = 3 ;\n    for ( size_t i = 0 ; i < 3 ; ++ i ) std . print ( \"{}\", arr [ i ] ) ;\n    arr [ 0 ] = 1 ;\n    arr [ 1 ] = 2 ;\n    arr [ 2 ] = 3 ;\n    std :: println ( \"arr[2] = {}\" , arr [ 2 ] ) ;\n    return 0;\n}\n"]
      }
    },
    {
      cid: "m122", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 122 课考试 · 转移所有权", task: "任务题目：把源码里注释掉的那行复印写法放开，看清编译器怎么拦住「两张纸条管同一块内存」，再用过户的写法把程序改对", hint: "想不起来就回看本课【怎么做】与【演示 1 · 函数把纸条交回给你】。",
      notes: ["两张纸条各自 delete 同一块内存就是双重释放，所以 unique_ptr 把复制构造显式删掉；复印在编译期就被拒。", "四条路只有一条能换保管人：复印不过、过户要 std::move、借用只给引用、放弃用 release。", "按值收 unique_ptr 参数的函数就是接手：不写 move 编译不过；交出去之后原变量变成空。", "release 把保管权讨回你手上，那张纸条变空，从那一刻起这块内存归你 delete。", "现造的直接 push_back 进容器不用 move；已经握在手里的纸条进容器必须过户。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "把这份程序写成能跑的形：把智能指针工具箱（#include <memory>）搬进来，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*memory\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <memory>\n\nint main() {", why: "unique_ptr 与 make_unique 住在 memory 里；没有 main，链接器找不到入口。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条的那张纸条：用 std::make_unique 造一个装 int 的独占指针，交给一个 auto 变量。", acceptRegex: ["auto\\s+\\w+\\s*=\\s*std\\s*::\\s*make_unique\\s*<\\s*int\\s*>\\s*\\("], acceptOn: "code", sample: "auto p1 = std::make_unique<int>(7);", why: "make_unique 现造一个对象并把保管权交给你这张纸条；保管人始终只有一个。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：把注释掉的那行复印放开，让它真留在代码里 —— 用一个 auto 变量直接等于另一张已有的纸条（auto p2 = p1; 这种写法）。", acceptRegex: ["auto\\s+\\w+\\s*=\\s*\\w+\\s*;"], acceptOn: "code", sample: "auto p2 = p1;", why: "标准库不是劝你别复印，而是在类型上把这条路堵死：复制构造被显式 delete，所以这一行当场编译不过。" },
        { id: "q4", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条的对照组：把复印改成过户再跑一次 —— 等号右边写 std::move 套住原来那张纸条。", acceptRegex: ["=\\s*std\\s*::\\s*move\\s*\\(\\s*\\w+\\s*\\)\\s*;"], acceptOn: "code", sample: "auto p2 = std::move(p1);", why: "move 自己不搬任何东西，它只是许可；真正抢地址并置空旧纸条的是 unique_ptr 的移动构造。" },
        { id: "q5", type: "code", score: 15, coversTask: 1, stem: "过户之后查一句：用一条 println 打出旧纸条跟 nullptr 比的结果（它是不是已经空了）。", acceptRegex: ["==\\s*nullptr|nullptr\\s*==", "std\\s*::\\s*println\\s*\\("], acceptOn: "code", sample: "std::println(\"p1 空了吗: {}\", p1 == nullptr);", why: "move 干的是抢地址加置空两步，全程仍然只有一张有效纸条 —— 这就是过户和复印的区别。" },
        { id: "q6", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：用一行注释抄下编译器拦复印时说的那个词（use of deleted function，至少四个字）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 放开那行就报 use of deleted function：两张纸条各自释放同一块内存就是双重释放", why: "正则只能验你写了注释，抄得对不对判不了；这一处是这块编辑器判不动的部分。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <memory>\n#include <utility>\n\nint main() {\n    auto p1 = std::make_unique<int>(7);\n    auto p2 = p1;\n    auto p3 = std::move(p1);\n    std::println(\"p1 空了吗: {}\", p1 == nullptr);\n    std::println(\"p3 的值: {}\", *p3);\n    return 0;\n}\n// 放开复印那行报 use of deleted function：两张纸条各自释放同一块内存就是双重释放\n"],
        wrongs: [
          "",
          "#include <print>\n\nint main() {\n    int* a = new int(7);\n    int* b = a;\n    std::println(\"{}\", *b);\n    delete a;\n    return 0;\n}\n",
          "#include <print>\n#include <memory>\n#include <utility>\n\nint main() {\n    auto p1 = std::make_unique<int>(7);\n    auto p2 = std::move(p1);\n    std::println(\"{}\", *p2);\n    return 0;\n}\n"],
        loose: [
          "#  include < memory >\n#  include < print >\n#  include < utility >\n\nint  main ( )\n{\n  auto  one = std :: make_unique < int > ( 5 ) ;\n  auto  two = one;\n  auto  three = std::move(one);\n  std::println(\"one 空了吗 {}\", one == nullptr);\n  return 0;\n}\n// 放开那行复印就是 use of deleted function，编译器当场拒\n"]
      }
    },
    {
      cid: "m123", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 123 课考试 · shared_ptr 共享", task: "任务题目：从 b 再复制一张纸条给新变量 d，打印 use_count，再让 d 出作用域，看计数怎么变；每一步先把数字猜出来再验", hint: "想不起来就回看本课【怎么做】与【演示 1 · 从别人的纸条再复制一张】。",
      notes: ["shared_ptr 允许复印，代价是计数加一：被复制的是纸条，不是对象；收尾时机是计数减到 0 的那一刻。", "unique_ptr 那张纸条 8 字节，shared_ptr 是 16 字节：一个对象地址加一个计数卡片地址。", "按值传参与 push_back 进容器都会悄悄加一：回来之后计数照旧，因为临时那张也走了。", "必须在堆上、主人只有一个时用 unique_ptr；真的有几个人共同保管、且顺序说不清才换 shared_ptr。", "两个人互相牵着就谁也走不了：两个节点的 peer 各指着对方，计数永远落不到 0，两个拆除都没打印 —— 这就是 shared_ptr 开始漏内存的地方。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "把这份程序写成能跑的形：把智能指针工具箱（#include <memory>）搬进来，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*memory\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <memory>\n\nint main() {", why: "make_shared 与 shared_ptr 住在 memory 里；没有 main 就没入口。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "先有一张共享纸条：用 std::make_shared 造一个对象，交给一个 auto 变量。", acceptRegex: ["auto\\s+\\w+\\s*=\\s*std\\s*::\\s*make_shared\\s*<"], acceptOn: "code", sample: "auto a = std::make_shared<std::string>(\"共享数据\");", why: "共享纸条从这一刻起计数为 1；被复制的永远是纸条，不是对象。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：连着复印两张 —— 先写一张纸条等于已有纸条，再写一张等于第一张（b 再复制给 d 那一步）。", acceptRegex: ["auto\\s+\\w+\\s*=\\s*\\w+\\s*;[\\s\\S]{0,200}auto\\s+\\w+\\s*=\\s*\\w+\\s*;"], acceptOn: "code", sample: "auto b = a;\nauto d = b;   // 从 b 再抄一张", why: "共享的那一路允许复印：每加一张纸条，卡片上的计数就加一，对象还是同一个。" },
        { id: "q4", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：把这两张复印关进一层自己的作用域 —— 另起一行开一对花括号，把抄纸条的语句写在括号里。", acceptRegex: ["\\n\\s*\\{[\\s\\S]{0,300}?auto\\s+\\w+\\s*=\\s*\\w+\\s*;[\\s\\S]{0,300}?\\n\\s*\\}"], acceptOn: "code", sample: "{\n    auto b = a;\n    auto d = b;\n    std::println(\"三张在手，计数 = {}\", d.use_count());\n}", why: "格子一合上，里面的纸条当场销毁、计数就往下掉 —— 这一步是任务要你亲眼看的变化。" },
        { id: "q5", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：用 use_count 问两次计数，各配一条 println —— 一次在格子合上之前，一次在之后。", acceptRegex: ["use_count\\s*\\(\\s*\\)[\\s\\S]{0,200}use_count\\s*\\(\\s*\\)", "std\\s*::\\s*println\\s*\\("], acceptOn: "code", sample: "std::println(\"三张在手，计数 = {}\", d.use_count());\nstd::println(\"他们走了，计数 = {}\", a.use_count());", why: "计数写在卡片上，用哪一张纸条去问答案都一样；收尾时机是计数减到 0 的那一刻。" },
        { id: "q6", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：用一行注释写下你看到的计数怎么涨怎么落（至少四个字，正则只验你写了注释）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 计数从 1 涨到 3，格子合上又落回 1 —— 对象一直是那一个", why: "注释内容判不了；这一档只确认你把跑出来的变化记下来了。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <memory>\n#include <string>\n\nint main() {\n    auto a = std::make_shared<std::string>(\"共享数据\");\n    std::println(\"刚创建，计数 = {}\", a.use_count());\n    {\n        auto b = a;\n        auto d = b;\n        std::println(\"三张在手，计数 = {}\", d.use_count());\n    }\n    std::println(\"他们走了，计数 = {}\", a.use_count());\n    std::println(\"数据还在: {}\", *a);\n    return 0;\n}\n// 计数从 1 涨到 3，格子一合上又落回 1：对象始终是同一个\n"],
        wrongs: [
          "",
          "#include <print>\n#include <memory>\n#include <utility>\n\nint main() {\n    auto a = std::make_unique<int>(7);\n    auto b = std::move(a);\n    std::println(\"{}\", *b);\n    return 0;\n}\n",
          "#include <print>\n#include <memory>\n\nint main() {\n    auto a = std::make_shared<int>(7);\n    auto b = a;\n    std::println(\"计数 {}\", a.use_count());\n    std::println(\"计数 {}\", b.use_count());\n    return 0;\n}\n"],
        loose: [
          "#  include < memory >\n#  include < print >\n\nint  main ( )\n{\n  auto  owner = std :: make_shared < int > ( 9 ) ;\n  std::println(\"起始 {}\", owner.use_count());\n  {\n      auto  second = owner;\n      auto  third = second;\n      std::println(\"三张 {}\", third.use_count());\n  }\n  std::println(\"散了 {}\", owner.use_count());\n  return 0;\n}\n// 计数上去又下来，东西只有一份\n"]
      }
    },
    {
      cid: "m124", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 124 课考试 · 三种持有方式怎么选", task: "任务题目：翻出你以前写过的代码，找到裸 new 和 delete 的地方，把它们改成用 unique_ptr 保管；改完数一数少写了哪几行、多写了哪几行", hint: "想不起来就回看本课【它被设计成什么样】那张顺序表和【演示 2 · 非纸条不可的一排不同形状】。",
      notes: ["问自己那一句再排顺序：值 → unique_ptr → shared_ptr，裸指针只用来看一眼，不负责收尾。", "收尾义务各家不同：值类型由类型自己扫尾，独占纸条在那张纸条出作用域时释放，共享纸条等计数落到 0 的那一刻。", "本机实测成本：unique_ptr 纸条 8 字节，shared_ptr 16 字节，裸指针 8 字节。", "非纸条不可的一排不同形状：派生对象装进装基类纸条的 vector，靠基类的虚函数统一调用，加一个新图形那段循环一个字都不用改。", "取地址与 get() 都是借出去看一眼；空地址那一路靠 if 挡掉，什么都不打。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "把这份程序写成能跑的形：把持有方式那条工具箱（#include <memory>）搬进来，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*memory\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <memory>\n\nint main() {", why: "make_unique 与 make_shared 都住在 memory 里；没有 main 就没入口。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：把那一处裸 new 改成纸条 —— 用 std::make_unique 造一个对象，交给一个 auto 变量，后面不再自己 delete。", acceptRegex: ["auto\\s+\\w+\\s*=\\s*std\\s*::\\s*make_unique\\s*<", "std\\s*::\\s*println\\s*\\("], acceptOn: "code", sample: "auto up = std::make_unique<int>(10);\nstd::println(\"② unique_ptr: {}\", *up);", why: "独占纸条替你记住那一次释放：纸条出作用域就收尾，不用再有一行 delete。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条先走第一步：能用在栈上活到作用域结束就够 —— 直接声明一个 std::string 值类型变量并给初值，再用一条 println 打它。", acceptRegex: ["std\\s*::\\s*string\\s+\\w+\\s*=\\s*\"[^\"]*\"\\s*;", "std\\s*::\\s*println\\s*\\("], acceptOn: "code", sample: "std::string best = \"值类型\";\nstd::println(\"① 值: {}\", best);", why: "顺序是按你还要额外操多少心排的：值类型自己扫尾，九成场景就到这一格为止。" },
        { id: "q4", type: "code", score: 25, coversTask: 1, stem: "任务第 1 条的最后一条路：裸指针只当眼睛 —— 写一个参数是 const 指针的函数，再把纸条用 .get() 借给它。", acceptRegex: ["void\\s+\\w+\\s*\\(\\s*const\\s+\\w+\\s*\\*\\s*\\w+\\s*\\)", "\\.get\\s*\\(\\s*\\)"], acceptOn: "code", sample: "void peek(const int* p) { if (p) std::println(\"看一眼: {}\", *p); }\n// main 里：peek(up.get());", why: "get() 借出去的是地址，保管权不动；谁也不许拿这只眼睛去 delete。" },
        { id: "q5", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：用一行注释写下你把哪一处从裸 new 与 delete 改成了 unique_ptr，还有没有剩下的（至少四个字，正则只验你写了注释）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 原来是 new 一个 int 再 delete，现在交给 make_unique：谁出作用域谁收尾", why: "自查这一件只能靠你把它写下来：判分器读不懂注释内容，也扫不到你另一个文件。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <memory>\n#include <string>\n\nvoid peek(const int* p) { if (p) std::println(\"看一眼: {}\", *p); }\n\nint main() {\n    std::string best = \"值类型\";\n    auto up = std::make_unique<int>(10);\n    std::println(\"① 值: {}\", best);\n    std::println(\"② unique_ptr: {}\", *up);\n    peek(up.get());\n    peek(nullptr);\n    return 0;\n}\n// 以前这里是 int* p = new int(10); 用完 delete p;，现在换成 make_unique，收尾不用再操心\n"],
        wrongs: [
          "",
          "#include <print>\n\nint main() {\n    int* p = new int(10);\n    std::println(\"{}\", *p);\n    delete p;\n    return 0;\n}\n",
          "#include <print>\n#include <memory>\n\nint main() {\n    auto up = std::make_unique<int>(10);\n    std::println(\"{}\", *up);\n    return 0;\n}\n",
          "#include <print>\n#include <memory>\n#include <string>\n\nint main() {\n    std::string s = \"值\";\n    auto sp = std::make_shared<int>(5);\n    std::println(\"{}\", *sp);\n    return 0;\n}\n"],
        loose: [
          "#  include < memory >\n#  include < print >\n\nvoid  look ( const int * q ) { if ( q ) std::println(\"看一眼 {}\", *q); }\n\nint  main ( )\n{\n  std :: string  label = \"先看值\" ;\n  auto  holder = std :: make_unique < int > ( 3 ) ;\n  std::println(\"{}\", label);\n  std::println(\"{}\", *holder);\n  look(holder.get());\n  return 0;\n}\n// 这一处原来是 new 加 delete，改成 make_unique 之后没人再管收尾\n"]
      }
    },
  ]
};
