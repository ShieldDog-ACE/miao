/* 喵站 · C++ 掌握 考卷分部 p12：第 121–124 课
 * 契约：权重和 100、任务逐条 coversTask、refs 判 100 / wrongs <60 / loose 过。
 * 号段纪律：这四场只考 值 / unique_ptr / 过户 / shared_ptr 计数 / 三种持有方式对比，
 *           题面与解析里不出现后面几课才教的名字；输出题的数字全部本机 g++ 实测过。
 */
window.MIAO_CPPM_EXAM_P12 = {
  papers: [
    {
      cid: "m121", kind: "paper", mode: "code", authored: "7a764f68", pass: 60, title: "第 121 课考试 · unique_ptr 独占", task: "任务题目：用 std::make_unique 造一个装三个 int 的数组，填 1、2、3 并把 arr[2] 打出来，再挨个打印整串", hint: "想不起来就回看本课【演示 1 · 数组版本：尖括号里写方括号】。",
      questions: [
        { id: "q1", type: "code", score: 27, coversTask: 1, stem: "（任务题）写出这两句：用一个变量 arr 保管着三个 int 的数组；再把第三格填成 3。", acceptRegex: ["make_unique\\s*<\\s*int\\s*\\[\\s*\\]\\s*>\\s*\\(\\s*3\\s*\\)", "arr\\s*\\[\\s*2\\s*\\]\\s*=\\s*3"], sample: "auto arr = std::make_unique<int[]>(3);\narr[2] = 3;", why: "数组版本在尖括号里写方括号、圆括号里写格数；下标 arr[2] 正是第三格，出作用域走的是数组那套释放，不用你区分。" },
        { id: "q2", type: "code", score: 18, coversTask: 1, stem: "（任务题）写出把 arr 的三个数挨个打印出来的那一行：下标变量叫 i，从 0 数到 2，每格打一个数。", acceptRegex: ["for\\s*\\(", "arr\\s*\\[\\s*i\\s*\\]"], sample: "for (size_t i = 0; i < 3; ++i) std::print(\"{} \", arr[i]);", why: "数组版本的 unique_ptr 下标照旧能用，arr[i] 就是第 i 格；一串三格就数到小于 3。" },
        { id: "q3", type: "code", score: 27, coversTask: 1, stem: "写一行：用 arr 保管着三格 int 的数组，把 1、2、3 挨个填进这三格。", acceptRegex: ["arr\\s*\\[\\s*0\\s*\\]\\s*=\\s*1", "arr\\s*\\[\\s*1\\s*\\]\\s*=\\s*2", "arr\\s*\\[\\s*2\\s*\\]\\s*=\\s*3"], sample: "arr[0] = 1; arr[1] = 2; arr[2] = 3;", why: "make_unique 造出来的数组是清零的，要什么内容得一格一格自己填；下标从 0 起，三格就是 0、1、2。" },
        { id: "q4", type: "code", score: 28, coversTask: 1, stem: "写一行打印：把 arr 第三格（下标 2 那格）的值打出来，前面带上「arr[2] = 」这几个字。", acceptRegex: ["std\\s*::\\s*println\\s*\\(", "\\{\\s*\\}", "arr\\s*\\[\\s*2\\s*\\]"], sample: "std::println(\"arr[2] = {}\", arr[2]);", why: "数组版本的 unique_ptr 下标照用，arr[2] 就是第三格；填了 3 之后这一行打出 arr[2] = 3。" }
      ],
      selftest: {
        refs: [
          {q1: "auto arr = std::make_unique<int[]>(3);\narr[2] = 3;", q2: "for (size_t i = 0; i < 3; ++i) std::print(\"{} \", arr[i]);", q3: "arr[0] = 1; arr[1] = 2; arr[2] = 3;", q4: "std::println(\"arr[2] = {}\", arr[2]);"}],
        wrongs: [
          {q1: "int arr[3];\narr[2] = 3;", q2: "std::println(\"{}\", arr);", q3: "arr[0] = 1; arr[1] = 2;", q4: "std::println(\"arr[1] = {}\", arr[1]);"}],
        loose: [
          {q1: "auto arr = std :: make_unique < int [ ] > ( 3 ) ;\n arr [ 2 ] = 3 ;", q2: "for ( size_t i = 0 ; i < 3 ; ++ i ) std . print ( \"{}\", arr [ i ] ) ;", q3: "arr [ 0 ] = 1 ;\narr [ 1 ] = 2 ;\narr [ 2 ] = 3 ;", q4: "std :: println ( \"arr[2] = {}\" , arr [ 2 ] ) ;"}]
      }
    },
    {
      cid: "m122", kind: "paper", mode: "quiz", pass: 60, title: "第 122 课考试 · 转移所有权", task: "任务题目：把源码里注释掉的那行复印写法放开，看清编译器怎么拦住「两张纸条管同一块内存」，再用过户的写法把程序改对", hint: "想不起来就回看本课【怎么做】与【演示 1 · 函数把纸条交回给你】。",
      questions: [
        { id: "q1", type: "choice", score: 15, coversTask: 1, stem: "（任务题）已有 auto p1 = std::make_unique<int>(7);，把注释里的 auto p2 = p1; 放开，结果是？", options: ["编译期就拒：报错里出现 use of deleted function，指向 unique_ptr 被写成 delete 的复制构造", "能编译，跑到 p2 那一行才崩", "只是警告，程序照跑，两份纸条各自释放一次", "编译通过，但 p1 会自动变空"], answer: 0, why: "标准库不是劝你别复印，而是在类型上把这条路堵死：两张纸条各自 delete 同一块内存就是双重释放，所以复制构造被显式删掉。" },
        { id: "q2", type: "choice", score: 15, coversTask: 1, stem: "（任务题）改成过户 auto p2 = std::move(p1); 之后，哪一句描述是对的？", options: ["p1 与 p2 共同保管，出作用域各释放一次", "p1 被写成空指针，保管权只剩 p2 一份，p2 离开作用域才释放", "p1 依旧管着那个 7，p2 只是它的别名", "对象被复制了一份，两人各管各的"], answer: 1, why: "move 干的是抢地址加置空两步，全程仍然只有一张有效纸条 —— 这就是「过户」和「复印」的区别。" },
        { id: "q3", type: "blank", score: 15, stem: "把变量标成「我打算弃用它」、从而让编译器选中移动构造的那个标准库名字是____。", accept: ["std::move", "move"], why: "std::move 自己不搬任何东西，它只是许可；真正抢地址并置空旧纸条的是 unique_ptr 的移动构造。" },
        { id: "q4", type: "output", score: 20, coversTask: 1, stem: "（任务题）这段打印两行，分别是什么？\nauto p1 = std::make_unique<int>(7);\nauto p2 = std::move(p1);\nstd::println(\"p1 空了吗: {}\", p1 == nullptr);\nstd::println(\"p2 的值: {}\", *p2);", acceptLines: ["p1 空了吗: true", "p2 的值: 7"], why: "过户完 p1 是空纸条，判空能问出来；那个 7 现在归 p2 管，穿过一层星号才读到它。本机实测两行就是这个。" },
        { id: "q5", type: "choice", score: 16, stem: "函数返回一个 unique_ptr 时，return 那一行为什么不用写 std::move？", options: ["返回值不能移动，只能复制", "返回局部对象时编译器自己会走移动这条路，硬写 move 反倒是老习惯", "unique_ptr 不许从函数往外传", "因为 return 会自动复制一份出来"], answer: 1, why: "「函数在堆上造、把保管权交回调用者」是 unique_ptr 最常用的一条路线：义务写在返回类型上，跟着返回值走，调用处不用 delete。机制以后再细讲，先记用法。" },
        { id: "q6", type: "multi", score: 19, stem: "关于过户与借用，哪些说法对？（多选，错一项整题 0 分）", options: ["往 vector 里 push 一张已有的纸条必须 std::move，否则报的是一大片落在标准库内部的模板错误", "release 之后纸条变空，那块内存的收尾义务回到你手上，得自己 delete", "只想让对方看一眼时，参数写引用或裸指针比按值收一张 unique_ptr 合适", "过户之后再用旧名字读值，编译器会拦住你"], answers: [0, 1, 2], why: "第四条不拦：旧名字是空指针，读它是未定义行为，防线在程序员这边 —— 要么判空，要么把它当已失效不再提。" }
      ],
      selftest: {
        refs: [
          {q1: 0, q2: 1, q3: "std::move", q4: "p1 空了吗: true\np2 的值: 7", q5: 1, q6: [0, 1, 2]}],
        wrongs: [
          {q1: 1, q2: 0, q3: "std::copy", q4: "p1 空了吗: false\np2 的值: 0", q5: 0, q6: [2, 3]}],
        loose: [
          {q1: "0", q2: "1", q3: "MOVE", q4: " p1 空了吗: true \np2 的值: 7 ", q5: "1", q6: [0, 1, 2]}]
      }
    },
    {
      cid: "m123", kind: "paper", mode: "quiz", pass: 60, title: "第 123 课考试 · shared_ptr 共享", task: "任务题目：从 b 再复制一张纸条给新变量 d，打印 use_count，再让 d 出作用域，看计数怎么变；每一步先把数字猜出来再验", hint: "想不起来就回看本课【怎么做】与【演示 1 · 从别人的纸条再复制一张】。",
      questions: [
        { id: "q1", type: "choice", score: 15, coversTask: 1, stem: "（任务题）复制一张 shared_ptr，会发生什么？", options: ["对象被复制一份，两张纸条各管一个副本", "多一张纸条，卡片上的计数加一，对象还是同一个", "计数不变，直到有人 reset 才更新", "原来的那张纸条立刻失效，像过户一样"], answer: 1, why: "共享纸条允许复印，复印的代价就是计数加一；被复制的是纸条，不是对象。" },
        { id: "q2", type: "blank", score: 12, coversTask: 1, stem: "（任务题）问「此刻一共几张纸条在管着它」用的那个成员函数叫____。", accept: ["use_count", "use_count()", "d.use_count()"], why: "它读的是那张计数卡片，所以用哪一张纸条去问，答案都一样。" },
        { id: "q3", type: "output", score: 23, coversTask: 1, stem: "（任务题）这段打印四行，依次是什么？\nauto a = std::make_shared<std::string>(\"共享数据\");\nstd::println(\"刚创建，计数 = {}\", a.use_count());\n{ auto b = a; auto c = a; std::println(\"两个朋友加入，计数 = {}\", a.use_count()); }\nstd::println(\"朋友走了，计数 = {}\", a.use_count());\nstd::println(\"数据还在: {}\", *a);", acceptLines: ["刚创建，计数 = 1", "两个朋友加入，计数 = 3", "朋友走了，计数 = 1", "数据还在: 共享数据"], why: "计数把 a 自己那张也算进去，所以两位朋友加入是 3；b、c 出作用域只减计数，对象照旧还在。本机实测四行如此。" },
        { id: "q4", type: "choice", score: 16, stem: "shared_ptr 保管的对象，真正被执行 delete 的时刻是？", options: ["最后一张纸条离开作用域、计数落到 0 的那一刻", "每一次复制纸条的那一刻", "对象被读到的那一刻", "任何一个保管人出作用域的那一刻"], answer: 0, why: "归零才打扫 —— 这就是它替你回答「谁来收尾」的方式，也是它比 unique_ptr 多付的那点代价换来的东西。" },
        { id: "q5", type: "output", score: 16, stem: "a 的计数本来是 1。接着依次做三件事：把它 push 进一个装 shared_ptr 的 vector（打印一次 a.use_count()）；把它按值传进一个参数是 shared_ptr 的函数（函数里打印 p.use_count()）；函数回来后自己再打印一次。这三行数字依次是什么？", acceptLines: ["2", "3", "2"], why: "进箱子是长期多一个保管人，所以是 2；按值传参临时再加一，函数里 3；参数销毁后掉回 2。" },
        { id: "q6", type: "multi", score: 18, stem: "关于 shared_ptr，哪些说法对？（多选，错一项整题 0 分）", options: ["两个对象互相用 shared_ptr 指着，计数回不到 0，析构根本不会发生", "本机实测 sizeof 一个 shared_ptr 是 16 字节，比 unique_ptr 的 8 字节胖，因为它要多记一张计数卡片", "拿 get 得到的地址再单独开一张 shared_ptr，会造成双重释放", "shared_ptr 不能放进 vector，容器只能装值类型"], answers: [0, 1, 2], why: "第四条错：装纸条进容器完全合法，push 一次就多一个保管人，计数会跟着加一 —— 演示里那三行数字正是这么来的。" }
      ],
      selftest: {
        refs: [
          {q1: 1, q2: "use_count", q3: "刚创建，计数 = 1\n两个朋友加入，计数 = 3\n朋友走了，计数 = 1\n数据还在: 共享数据", q4: 0, q5: "2\n3\n2", q6: [0, 1, 2]}],
        wrongs: [
          {q1: 0, q2: "count", q3: "刚创建，计数 = 1\n两个朋友加入，计数 = 2\n朋友走了，计数 = 0\n数据还在: 共享数据", q4: 3, q5: "1\n2\n1", q6: [1, 3]}],
        loose: [
          {q1: "1", q2: "USE_COUNT( )", q3: " 刚创建，计数 = 1 \n两个朋友加入，计数 = 3 \n朋友走了，计数 = 1 \n数据还在: 共享数据 ", q4: "0", q5: " 2\n3\n2 ", q6: [0, 1, 2]}]
      }
    },
    {
      cid: "m124", kind: "paper", mode: "quiz", pass: 60, title: "第 124 课考试 · 三种持有方式怎么选", task: "任务题目：翻出你以前写过的代码，找到裸 new 和 delete 的地方，把它们改成用 unique_ptr 保管；改完数一数少写了哪几行、多写了哪几行", hint: "想不起来就回看本课【它被设计成什么样】那张顺序表和【演示 2 · 非纸条不可的一排不同形状】。",
      questions: [
        { id: "q1", type: "choice", score: 16, coversTask: 1, stem: "（任务题）按本课给的决策顺序，四条路应该这么排：", options: ["shared_ptr → unique_ptr → 值 → 裸指针", "值 → unique_ptr → shared_ptr，裸指针只用来看一眼", "裸指针 → 值 → unique_ptr → shared_ptr", "unique_ptr → shared_ptr → 值，裸指针可以替纸条长期保管"], answer: 1, why: "顺序是按「你还要额外操多少心」排的：值类型自己扫尾，独占纸条替你记那一次释放，共享纸条要算计数；裸指针不表态，所以只配当眼睛。" },
        { id: "q2", type: "choice", score: 18, coversTask: 1, stem: "（任务题）下面哪一处才真的需要把东西放上堆、用纸条管着？", options: ["函数里造一个 string，用完打印就丢", "一排里要同时装圆和方两种派生对象，靠基类的虚函数统一调用", "一个只在当前大括号内用的整数", "把三个字符拼起来打印一次"], answer: 1, why: "容器每格的尺寸必须一样，装不进大小不同的两类对象；让每个对象各自住堆上、排里只放 unique_ptr，是这一课给的非用纸条不可的场合。" },
        { id: "q3", type: "output", score: 19, stem: "这段打印三行，依次是什么？\nstd::string best = \"值类型\";\nauto up = std::make_unique<int>(10);\nauto sp = std::make_shared<int>(20);\nstd::println(\"{}\", best);\nstd::println(\"{}\", *up);\nstd::println(\"{}\", *sp);", acceptLines: ["值类型", "10", "20"], why: "值直接写名字，两张纸条要穿过一层星号。多的那一层如果没换来任何东西，就不该套纸条 —— 给一个只在作用域内用的 int 上纸条就是这种浪费。" },
        { id: "q4", type: "blank", score: 16, coversTask: 1, stem: "（任务题）这一章要从你代码里赶出去的那两个词是 new 和____。", accept: ["delete", "delete[]", "手动 delete"], why: "还的路交给类型或者纸条，你不再手动写；写一次 delete 就多一处可能被跳过、被忘、被做两遍。" },
        { id: "q5", type: "choice", score: 13, stem: "有一个借看的函数 void peek(const int* p)。关于它的规矩，哪一条对？", options: ["里面可以 delete p，用完就还回去", "只读不还：判空再用，永远不 delete，也不把拿到的地址存成长期成员", "必须把它转成 shared_ptr 才安全", "参数不能接空地址，只能传真地址"], answer: 1, why: "裸指针在这一章只是眼睛，收尾义务还在原主人手里。存成长期成员更危险：纸条出作用域之后，那个地址就悬空了。" },
        { id: "q6", type: "multi", score: 18, stem: "关于三种持有方式，哪些说法对？（多选，错一项整题 0 分）", options: ["string 和 vector 的数据本来就住在堆上，选值不等于不用堆，只是收尾被类型管着", "按值收一个 shared_ptr 参数等于临时多配一把钥匙，函数里数出来的计数会比外面大一", "通过基类指针销毁对象时，基类析构必须是虚的，否则派生类那一半不会被拆", "函数要把一个对象交回调用者，只能返回指针"], answers: [0, 1, 2], why: "第四条错：返回值本来就会活到调用者那个变量出作用域，交回东西先考虑值；纸条是给「必须留在堆上」的场合准备的。" }
      ],
      selftest: {
        refs: [
          {q1: 1, q2: 1, q3: "值类型\n10\n20", q4: "delete", q5: 1, q6: [0, 1, 2]}],
        wrongs: [
          {q1: 0, q2: 0, q3: "值类型\n20\n10", q4: "free", q5: 0, q6: [1, 3]}],
        loose: [
          {q1: "1", q2: "1", q3: "值类型\n10\n20", q4: "DELETE", q5: "1", q6: [0, 1, 2]}]
      }
    },
  ]
};
