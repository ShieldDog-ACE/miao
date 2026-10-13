/* 喵站 · C++ 掌握 考卷分部 p10：第 113–116 课（第九轮）
 * 契约与 p04 一样：每题分数合计正好 100、源稿每条任务都有题 coversTask 对着、
 * 带 coversTask 的题合计 ≥50 分、每题带 why、refs 判 100 / wrongs 判 <60 / loose 判 ≥60。
 * 四份源稿各只有 1 条【任务】，所以 coversTask 一律是 [1]。
 */
window.MIAO_CPPM_EXAM_P10 = {
  papers: [
    {
      cid: "m113", kind: "paper", pass: 60,
      task: "任务题目：给 Score 加第三个成员 int done_ = 0;，构造函数不管它，然后打印出来确认对象一出生它就是 0；再回答它凭什么没被初始化列表也带着值出生",
      hint: "想不起来就回看本课【演示 3 · 声明处给默认值，构造函数可以不管它】与【原理讲解】里那条装载顺序。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          stem: "构造函数为什么必须跟类同名、而且不写返回类型？",
          options: ["因为构造函数要算出一个新对象交回去，名字得跟类一样", "因为它不返回东西 —— 它就地改造刚分到的那块内存；名字跟类相同，编译器才知道它管哪张图纸", "这是历史遗留写法，写不写返回类型其实都行", "因为类名必须是名词，构造函数只能借用它"],
          answer: 1,
          why: "构造函数不是「造完再交给你」的函数，它是出生手续。实测给它加个 void，编译器报 return type specification for constructor invalid。" },
        { id: "q2", type: "code", score: 20, coversTask: 1,
          stem: "（任务题）按本课任务给这个类补上第三个成员：一个 int done_，对象一出生它就是 0，构造函数的参数表和冒号后面都不必写它。写出那一行声明。",
          acceptRegex: ["int\\s+done_\\s*=\\s*0"],
          why: "声明处那个 = 0 本身就是一份初始化，由所有构造函数共享。放在 private 区里，写不写注释都不算这题的点，那行 = 0 才是。" },
        { id: "q3", type: "output", score: 14, coversTask: 1,
          stem: "用带 done_ = 0 的那版类，show() 打印的是「subject_：done_ / total_ 个」。下面两行输出什么？（一行一个结果）\nScore a(\"英语词汇\", 5500); a.show();\nScore b(\"数学\", 30); b.show();",
          acceptLines: ["英语词汇：0 / 5500 个", "数学：0 / 30 个"],
          why: "done_ 没进列表也没进参数，靠声明处的默认值出生，所以两个新对象里它都是 0；这正是要打印确认的事。" },
        { id: "q4", type: "choice", score: 10,
          stem: "冒号后面那段初始化列表，比「进门以后再赋值」好在哪句说得最准？",
          options: ["少一次函数调用，所以快", "对 std::string 这类自己管内存的成员，省掉先造一个空壳、再把空壳扔掉这两步", "成员可以不写声明了", "没什么实质区别，只是看着短"],
          answer: 1,
          why: "先进门再赋值时，subject_ 必须先成为一个合法的空串才谈得上被赋值；写列表则让它直接带着值出现 —— 中间那个没用的状态被取消了。" },
        { id: "q5", type: "code", score: 16,
          stem: "把演示 1 那个带冒号的构造函数改成不写冒号、在函数体里把两个成员一一赋值。写出函数体里那两句赋值。",
          acceptRegex: ["subject_\\s*=", "total_\\s*=\\s*total"],
          why: "结果是同样的，代价不同：string 成员多付一次造壳与扔壳。这题只认你有没有把值写进带下划线的成员。" },
        { id: "q6", type: "blank", score: 10, coversTask: 1,
          stem: "构造函数的冒号后面没有 done_，参数表里也没有它，可它一出生就是 0 —— 因为它拿到了声明处给的____。",
          accept: ["默认值", "缺省值", "默认初始值"],
          why: "成员必须有自己的初始化路：要么进列表，要么在声明处给值。两条都没有时不是 0，是内存里的残留。" },
        { id: "q7", type: "multi", score: 12, coversTask: 1,
          stem: "下列说法对的是？（多选，错勾任何一项整题 0 分）",
          options: ["成员在声明处写 = 0 也算一份初始化，构造函数可以不管它", "构造函数体留空是没写完，必须再赋一遍值才算完整", "用了 std::move 却没请 <utility>，可能在这个编译器上过、在那个上过不了", "没进初始化列表、也没有声明处默认值的 int 成员，会被自动填成 0"],
          answers: [0, 2],
          why: "函数体空恰恰是最标准的样子，活都在冒号后面干完了；漏掉的 int 成员实测是每跑一次换一个数的垃圾。" },
        { id: "q8", type: "choice", score: 6,
          stem: "成员装载的先后顺序由什么决定？",
          options: ["初始化列表里谁写在前面谁先装", "类里成员的声明顺序", "参数表的顺序", "编译器随机挑一个"],
          answer: 1,
          why: "书写顺序不算数。让后一项去读前面还没装的成员就是错，实测不开 -Wall 时编译一路绿灯，只是安静地读到垃圾。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: "int done_ = 0;", q3: "英语词汇：0 / 5500 个\n数学：0 / 30 个", q4: 1, q5: "subject_ = std::move(subject);\n        total_ = total;", q6: "默认值", q7: [0, 2], q8: 1 }
        ],
        wrongs: [
          { q1: 0, q2: "int done_;", q3: "英语词汇：5500 / 0 个\n数学：30 / 0 个", q4: 3, q5: "subject(subject_); total(total_);", q6: "垃圾", q7: [1, 3], q8: 0 }
        ],
        loose: [
          { q1: "1", q2: "int   done_=0 ;", q3: " 英语词汇：0 / 5500 个 \n  数学：0 / 30 个", q4: "1", q5: "subject_=std::move( subject ) ;\ntotal_=total ;", q6: "缺省值", q7: [2, 0], q8: "1" }
        ]
      }
    },
    {
      cid: "m114", kind: "paper", pass: 60,
      task: "任务题目：往只读的 remaining 里塞一行 done_ = 0;，看清编译器怎么把你拦下来，然后把那行删掉；再说清这条拦阻到底在保护谁",
      hint: "想不起来就回看本课【演示 2 · 本课任务：在 remaining 里手滑一行】与【演示 3 · const 引用只能敲带 const 的门】。",
      questions: [
        { id: "q1", type: "choice", score: 10,
          stem: "const 写在哪个位置，才算本课说的 const 成员函数？",
          options: ["写在返回值前面，比如 const int remaining()", "写在参数表后面，比如 int remaining() const", "写在类名后面", "写在成员变量的声明后面"],
          answer: 1,
          why: "位置不同管的东西不同。只写返回值前面那个 const 一样合法，但方法内部照样能写成员 —— 等于什么都没承诺。" },
        { id: "q2", type: "code", score: 18, coversTask: 1,
          stem: "（任务题）写出你按本课任务塞进 remaining() 里的那一行：把成员 done_ 赋成 0。",
          acceptRegex: ["done_\\s*=\\s*0\\s*;"],
          why: "这一行在带 const 的方法里必被拦下，删掉它就是任务的收尾动作；写在别的语句形式里也行，关键是把值写进 done_。" },
        { id: "q3", type: "output", score: 12,
          stem: "演示 1 那段跑完打印什么？（一行）",
          acceptLines: ["进度 40%，还剩 6 个"],
          why: "s 总共 10 个、add(4) 之后做了 4 个：progress 是 0.4 乘 100 得 40，remaining 是 10 减 4 得 6。" },
        { id: "q4", type: "choice", score: 12, coversTask: 1,
          stem: "那行赋值被拦下时，编译器报的是 assignment of member 'Score::done_' in read-only object。根因是什么？",
          options: ["done_ 是 private，remaining 在类里看不见它", "这个方法把「自己」签成了只读，只读的方法里不能写成员", "remaining 有返回值，所以不许再有副作用", "带 const 的方法只能有一句 return"],
          answer: 1,
          why: "在类里 private 成员当然可见。拦你的是后面那个 const；同样的赋值挪进不带 const 的 add 里立刻合法。" },
        { id: "q5", type: "multi", score: 14,
          stem: "关于 const 成员函数，说法对的是？（多选，错勾任何一项整题 0 分）",
          options: ["标了 const，收 const Score& 的函数才调得动这个方法", "只把 const 写在返回值前面，方法里仍然可以写成员", "一个方法挂了 const，就保证这个对象在整个程序期间不会变", "在 const 方法里调同类另一个不带 const 的方法，同样被拦"],
          answers: [0, 1, 3],
          why: "const 管的是「这个方法动不动成员」和「只读对象上能调什么」，它管不住别的方法什么时候改对象。" },
        { id: "q6", type: "code", score: 12, coversTask: 1,
          stem: "（任务延伸）写一个函数 report：它收一个只读的 Score，函数体里调用只读的 remaining 并打印出来。写出参数那一部分和那句调用。",
          acceptRegex: ["const\\s+Score\\s*&", "remaining\\s*\\("],
          why: "参数写 const Score& 是「只看不摸」的交出手，能敲开的就只有带 const 的门 —— 两件事配合才成环。" },
        { id: "q7", type: "output", score: 12, coversTask: 1,
          stem: "演示 3 里把 s.add(1) 那一行删掉之后，这段跑完打印什么？（一行）\nScore s(10); s.add(4); report(s);",
          acceptLines: ["还剩 6 个"],
          why: "留着一行 add 就先被编译拦下；删掉之后 report 只读，10 减 4 得 6。这也说明只读函数干不了改数据的活。" },
        { id: "q8", type: "choice", score: 10,
          stem: "一个方法该不该挂 const，本课给的判断口径是？",
          options: ["看它有没有返回值", "函数体里既没写成员、也没调不带 const 的方法，就该挂", "看它写在 public 还是 private 下面", "名字里带 get、print 的一律挂上"],
          answer: 1,
          why: "口径只看它动不动状态，跟名字、可见性、有没有返回值都无关。靠名字猜是最容易漏标的那条路。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: "done_ = 0;", q3: "进度 40%，还剩 6 个", q4: 1, q5: [0, 1, 3], q6: "void report(const Score& s) {\n    std::println(\"还剩 {} 个\", s.remaining());\n}", q7: "还剩 6 个", q8: 1 }
        ],
        wrongs: [
          { q1: 0, q2: "done_ == 0;", q3: "进度 4%，还剩 6 个", q4: 0, q5: [2], q6: "void report(Score s) { s.add(1); }", q7: "还剩 5 个", q8: 3 }
        ],
        loose: [
          { q1: "1", q2: "done_  =  0 ;", q3: " 进度 40%，还剩 6 个 ", q4: "1", q5: [3, 1, 0], q6: "void report(const Score&  s){\n std::println(s.remaining()); }", q7: "还剩 6 个 ", q8: "1" }
        ]
      }
    },
    {
      cid: "m115", kind: "paper", pass: 60,
      task: "任务题目：给 Score 再写一个 operator==，科目名相同就算相等，然后打印 v[0] == v[1]；先想清楚排完序之后 v[0] 和 v[1] 各是谁再跑",
      hint: "想不起来就回看本课【演示 3 · 本课任务：再写一个 operator==】与【常见坑】里那条「写成一个让 a 不小于 a 成立的样式」。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          stem: "std::sort 在决定两个元素谁在前时，做的是什么动作？",
          options: ["把两个元素相加比大小", "问一句 a 小于 b，真就把 a 往前放", "调用一个必须叫 compare 的方法", "按元素在内存里的地址排"],
          answer: 1,
          why: "算法的本领就是反复问同一句「小于吗」。这句话在代码里写成 a < b，于是你写下 operator< 就等于替它回答。" },
        { id: "q2", type: "code", score: 20, coversTask: 1,
          stem: "（任务题）写一个 operator==：两个 Score 的科目名相同就算相等。参数是右边那个对象，方法本身不改任何东西。",
          acceptRegex: ["operator\\s*=", "name_\\s*=="],
          why: "名字固定是 operator 跟一个符号；比较只看名字是否相同，就用 name_ 跟 o 的 name_ 比。后面那个 const 是上一课的规矩。" },
        { id: "q3", type: "output", score: 14, coversTask: 1,
          stem: "三个元素按完成率升序排完，v[0] 是英语、v[1] 是 C++。again 是一个名叫英语的新对象。这两行打印什么？（一行一个结果）\nstd::println(\"排完 v0 == v1 是 {}\", v[0] == v[1]);\nstd::println(\"同名的两个对象：{}\", v[0] == again);",
          acceptLines: ["排完 v0 == v1 是 false", "同名的两个对象：true"],
          why: "排完之后 v[0] 与 v[1] 名字不同，等式为假；跟 again 同名才是真。这行输出顺便让你记住排序后的顺序长什么样。" },
        { id: "q4", type: "choice", score: 12,
          stem: "把 operator< 写成 return rate() <= o.rate(); 会怎样？",
          options: ["只是顺序反一下，没有别的后果", "a 小于 a 成了真，算法的假设被破坏 —— 实测两百个含重复值的元素交给 sort 直接段错误", "编译器当场报错，拦下这个写法", "sort 会自动把小于等于改成小于"],
          answer: 1,
          why: "这是本课唯一会运行时才炸的坑：编译一路绿灯。自检两句 —— 自己跟自己比必须是假；先后关系要能传递。" },
        { id: "q5", type: "multi", score: 14,
          stem: "只写了 operator< 和 operator== 之后，实测成立的说法是？（多选，错勾任何一项整题 0 分）",
          options: ["std::max 不用改一个字就能用在 Score 上", "std::set 里元素的先后也由这个 operator< 决定", "a > b 会由 a < b 反过来自动得到，本机编译器白送", "a != b 由 operator== 合成出来，实测可用"],
          answers: [0, 1, 3],
          why: "实测 a > b 与 a >= b 都报 no match —— 别把程序建在编译器的好心上，要别的口径就自己写。" },
        { id: "q6", type: "code", score: 12, coversTask: 1,
          stem: "写出 Score 的 operator<：按完成率决定谁排前面，参数接右边那个对象，方法不改对象。",
          acceptRegex: ["operator\\s*<", "rate\\s*\\("],
          why: "这一句是整节课的轴：算法问的那句话由它回答，比较的口径直接用已经写好的只读方法 rate。" },
        { id: "q7", type: "blank", score: 8,
          stem: "运算符重载的函数名固定是 operator 后面紧跟要重载的那个____。",
          accept: ["符号", "运算符符号", "字符"],
          why: "写 operator< 就是重载小于号，写 operator== 就是重载等号；名字里没有猜测空间。" },
        { id: "q8", type: "choice", score: 8, coversTask: 1,
          stem: "源稿那两条规则口径不一样：operator< 按完成率，operator== 按名字。实测把英语 300/5500 和英语 7/10 两个对象一起放进 std::set，最后留着几个？",
          options: ["1 个，同名就算重复", "2 个 —— set 只问 operator<，这两个完成率不同就不算重复", "编译不过，两套规则不许共存", "0 个，两个都被扔掉"],
          answer: 1,
          why: "== 说是相等，< 说是两个位置，算法各按各的理解跑偏：unique 只挨着才去得掉，set 干脆留两个。一个类型的相等和先后必须说同一件事。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: "bool operator==(const Score& o) const { return name_ == o.name_; }", q3: "排完 v0 == v1 是 false\n同名的两个对象：true", q4: 1, q5: [0, 1, 3], q6: "bool operator<(const Score& o) const { return rate() < o.rate(); }", q7: "符号", q8: 1 }
        ],
        wrongs: [
          { q1: 2, q2: "bool operator==(const Score& o) { return rate() == o.rate(); }", q3: "排完 v0 == v1 是 true\n同名的两个对象：false", q4: 0, q5: [2], q6: "int compare(Score o) { return 0; }", q7: "返回值", q8: 0 }
        ],
        loose: [
          { q1: "1", q2: "bool operator == ( const Score& other ) const {\n  return  name_  ==  other.name_ ;\n}", q3: " 排完 v0 == v1 是 false \n 同名的两个对象：true ", q4: "1", q5: [1, 3, 0], q6: "bool  operator <(const Score& other) const{ return other.rate() > rate(); }", q7: "符号 ", q8: "1" }
        ]
      }
    },
    {
      cid: "m116", kind: "paper", pass: 60,
      task: "任务题目：把 override 删掉再故意把 area 拼成 aer，对比有无 override 时编译器的反应，并说清那两行 0.00 是从哪一句来的",
      hint: "想不起来就回看本课【演示 2 · 本课任务：把 override 删掉，再故意拼错名字】与【常见坑】里那条析构。",
      questions: [
        { id: "q1", type: "choice", score: 10,
          stem: "virtual 和 override 分别在哪一头说话？",
          options: ["virtual 说这个方法欢迎孩子改写；override 说我这一行就是在改写，请编译器检查", "virtual 说这个类不许被继承；override 说要重写两遍", "两个是一个意思，写哪个都行", "virtual 只给析构用，override 只给方法用"],
          answer: 0,
          why: "一个开口子、一个验收。源稿那两行注释正好对上：基类 virtual ~Shape 与 virtual double area，孩子 area 后面写 override。" },
        { id: "q2", type: "code", score: 18, coversTask: 1,
          stem: "（任务题的对照）写出 Circle 改写 area 的那一行：名字、参数、const 都跟基类对得上，并在签名后面请编译器检查。",
          acceptRegex: ["area\\s*\\(\\s*\\)\\s*const", "override"],
          why: "三项全对上才叫改写。写 override 就是把「我以为改了」这件事交给编译器验，它不改任何行为，只补上拦这一下。" },
        { id: "q3", type: "output", score: 12,
          stem: "把 override 删掉、又把 area 拼成 aer，其余照演示 1，两个半径 2.0 和 1.0 的圆跑出来打印什么？（两行）",
          acceptLines: ["圆的面积 = 0.00", "圆的面积 = 0.00"],
          why: "拼错的那个 aer 没人调用，s->area() 走的还是基类那句 return 0.0 —— 编译一路通过，这正是没写 override 的下场。" },
        { id: "q4", type: "choice", score: 12, coversTask: 1,
          stem: "保留 override、把 area 拼成 aer，编译器报 'double Circle::aer() const' marked 'override', but does not override。这句在说什么？",
          options: ["你写的这个函数没匹配上任何允许改写的方法，改写根本没发生", "Circle 不能继承 Shape", "area 的返回值类型必须是 int", "基类的析构函数漏了 virtual"],
          answer: 0,
          why: "同一个报错也出现在参数多写一个、或者孩子自己漏了 const 的情况 —— 它盯的就是签名三项对不对得上。" },
        { id: "q5", type: "multi", score: 14,
          stem: "关于继承，说法对的是？（多选，错勾任何一项整题 0 分）",
          options: ["class Circle : public Shape 读作 Circle 对外就是一个 Shape", "打算被继承的类，析构要写 virtual，否则孩子那一份不跑", "基类摆在 private 下的数据成员，孩子在 Circle 的类里可以直接写", "再加一个新图形类型，遍历那一段代码一个字都不用改"],
          answers: [0, 1, 3],
          why: "基类的 private 孩子在类里直接写是报错的，要走父亲留下的公开方法；其余三条都是本课正文实测过或明确讲过的形状。" },
        { id: "q6", type: "code", score: 12, coversTask: 1,
          stem: "（任务延伸）写出这两行：声明一个装着「指向 Shape 的智能指针」的 vector，然后往里塞一个半径 2.0 的圆。",
          acceptRegex: ["unique_ptr\\s*<\\s*Shape\\s*>", "make_unique\\s*<\\s*Circle\\s*>\\s*\\(\\s*2\\.0\\s*\\)"],
          why: "容器存的是父亲的手，造出来的却是孩子 —— 这一句交得出去，靠的正是「Circle 是一个 Shape」。" },
        { id: "q7", type: "blank", score: 10, coversTask: 1,
          stem: "孩子那一行想在编译期确认自己真的改到了父亲的方法，就在参数表后面写上关键词____。",
          accept: ["override", "写 override"],
          why: "老写法没这层保险：拼错名字、参数不同、少个 const，全都静悄悄合法，程序照跑，只是走的是基类那份。" },
        { id: "q8", type: "choice", score: 12,
          stem: "实测把基类析构的 virtual 去掉，父子两个析构各打印一句话，程序打出来的是？",
          options: ["先 清理 Circle 再 清理 Shape", "只打印 清理 Shape —— 孩子那句根本没跑", "-Wall 会先警告一句，然后照常清理两个", "编译不过，逼你加回来"],
          answer: 1,
          why: "通过父亲的手收孩子时，析构不带 virtual 就只跑父亲那一份，而且实测连 -Wall 都没提示。规矩：打算被继承的类，析构写 virtual。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: "double area() const override { return 3.14159265 * r_ * r_; }", q3: "圆的面积 = 0.00\n圆的面积 = 0.00", q4: 0, q5: [0, 1, 3], q6: "std::vector<std::unique_ptr<Shape>> shapes;\n    shapes.push_back(std::make_unique<Circle>(2.0));", q7: "override", q8: 1 }
        ],
        wrongs: [
          { q1: 1, q2: "double aer() { return 3.14 * r_ * r_; }", q3: "圆的面积 = 12.57\n圆的面积 = 3.14", q4: 3, q5: [2], q6: "std::vector<Circle> shapes;\n    shapes.push_back(Circle(2));", q7: "virtual", q8: 0 }
        ],
        loose: [
          { q1: "0", q2: "double  area( )  const override{ return 3.14 * r_ * r_; }", q3: " 圆的面积 = 0.00 \n圆的面积 = 0.00 ", q4: "0", q5: [3, 1, 0], q6: "std::vector< std::unique_ptr < Shape > >  v ;\nv.push_back( std::make_unique < Circle >( 2.0 ) );", q7: "OVERRIDE", q8: "1" }
        ]
      }
    }
  ]
};
