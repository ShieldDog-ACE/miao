/* 喵站 · C++ 掌握 考卷分部 p10：第 113–116 课（第九轮）
 * 契约与 p04 一样：每题分数合计正好 100、源稿每条任务都有题 coversTask 对着、
 * 带 coversTask 的题合计 ≥50 分、每题带 why、refs 判 100 / wrongs 判 <60 / loose 判 ≥60。
 * 四份源稿各只有 1 条【任务】，所以 coversTask 一律是 [1]。
 */
window.MIAO_CPPM_EXAM_P10 = {
  papers: [
    {
      cid: "m113", kind: "paper", mode: "code", authored: "c31922bc", pass: 60, task: "任务题目：给 Score 加第三个成员 int done_ = 0;，构造函数不管它，然后打印出来确认对象一出生它就是 0；再回答它凭什么没被初始化列表也带着值出生", hint: "想不起来就回看本课【演示 3 · 声明处给默认值，构造函数可以不管它】与【原理讲解】里那条装载顺序。",
      questions: [
        { id: "q1", type: "code", score: 26, coversTask: 1, stem: "（任务题）按本课任务给这个类补上第三个成员：一个 int done_，对象一出生它就是 0，构造函数的参数表和冒号后面都不必写它。写出那一行声明。", acceptRegex: ["int\\s+done_\\s*=\\s*0"], sample: "int done_ = 0;", why: "声明处那个 = 0 本身就是一份初始化，由所有构造函数共享。放在 private 区里，写不写注释都不算这题的点，那行 = 0 才是。" },
        { id: "q2", type: "code", score: 22, stem: "把演示 1 那个带冒号的构造函数改成不写冒号、在函数体里把两个成员一一赋值。写出函数体里那两句赋值。", acceptRegex: ["subject_\\s*=", "total_\\s*=\\s*total"], sample: "subject_ = std::move(subject);\n        total_ = total;", why: "结果是同样的，代价不同：string 成员多付一次造壳与扔壳。这题只认你有没有把值写进带下划线的成员。" },
        { id: "q3", type: "code", score: 30, coversTask: 1, stem: "（任务题）写出这个构造函数：参数表收 std::string 和 int 各一个，紧跟冒号，后面只安排 subject_ 与 total_ 两栏，函数体空着。", acceptRegex: ["Score\\s*\\(\\s*(const\\s+)?std\\s*::\\s*string\\s+\\w+\\s*,\\s*int\\s+\\w+\\s*\\)\\s*:", "subject_\\s*\\(\\s*\\w+", "total_\\s*\\(\\s*\\w+\\s*\\)"], sample: "Score(std::string subject, int total) : subject_(std::move(subject)), total_(total) {}", why: "同名、不写返回类型，紧跟冒号那一段就是初始化列表 —— 成员出生时就带着值，没有「先成空壳再被赋值」那一步；done_ 不在列表里也不在参数里，它靠声明处的 = 0 自己出生。" },
        { id: "q4", type: "code", score: 22, coversTask: 1, stem: "（任务题）写一行：造一个 Score 对象，只递科目名和总数两个参数，第三个成员 done_ 不用你管。", acceptRegex: ["Score\\s+\\w+\\s*\\(\\s*\"[^\"]*\"\\s*,\\s*\\d+\\s*\\)"], sample: "Score s(\"英语词汇\", 5500);", why: "声明处给了 = 0，所有构造函数共享这份初始化，调用处自然一个参数都不用多加 —— 对象一出生 done_ 就是 0。" }
      ],
      selftest: {
        refs: [
          {q1: "int done_ = 0;", q2: "subject_ = std::move(subject);\n        total_ = total;", q3: "Score(std::string subject, int total) : subject_(std::move(subject)), total_(total) {}", q4: "Score s(\"英语词汇\", 5500);"}],
        wrongs: [
          {q1: "int done_;", q2: "subject(subject_); total(total_);", q3: "Score(std::string subject, int total) { subject_ = std::move(subject); total_ = total; }", q4: "Score s(5500, \"英语词汇\");"}],
        loose: [
          {q1: "int   done_=0 ;", q2: "subject_=std::move( subject ) ;\ntotal_=total ;", q3: "Score ( std :: string  s , int  n )  :   total_ ( n ) ,  subject_ ( std :: move ( s ) ) { }", q4: "Score   p  (  \"数学\"  ,  30  ) ;"}]
      }
    },
    {
      cid: "m114", kind: "paper", mode: "quiz", authored: "20154591", pass: 60, task: "任务题目：往只读的 remaining 里塞一行 done_ = 0;，看清编译器怎么把你拦下来，然后把那行删掉；再说清这条拦阻到底在保护谁", hint: "想不起来就回看本课【演示 2 · 本课任务：在 remaining 里手滑一行】与【演示 3 · const 引用只能敲带 const 的门】。",
      questions: [
        { id: "q1", type: "choice", score: 11, stem: "const 写在哪个位置，才算本课说的 const 成员函数？", options: ["写在返回值前面，比如 const int remaining()", "写在参数表后面，比如 int remaining() const", "写在类名后面", "写在成员变量的声明后面"], answer: 1, why: "位置不同管的东西不同。只写返回值前面那个 const 一样合法，但方法内部照样能写成员 —— 等于什么都没承诺。" },
        { id: "q2", type: "output", score: 13, stem: "演示 1 那段跑完打印什么？（一行）", acceptLines: ["进度 40%，还剩 6 个"], why: "s 总共 10 个、add(4) 之后做了 4 个：progress 是 0.4 乘 100 得 40，remaining 是 10 减 4 得 6。" },
        { id: "q3", type: "choice", score: 14, coversTask: 1, stem: "那行赋值被拦下时，编译器报的是 assignment of member 'Score::done_' in read-only object。根因是什么？", options: ["done_ 是 private，remaining 在类里看不见它", "这个方法把「自己」签成了只读，只读的方法里不能写成员", "remaining 有返回值，所以不许再有副作用", "带 const 的方法只能有一句 return"], answer: 1, why: "在类里 private 成员当然可见。拦你的是后面那个 const；同样的赋值挪进不带 const 的 add 里立刻合法。" },
        { id: "q4", type: "multi", score: 15, coversTask: 1, stem: "关于 const 成员函数，说法对的是？（多选，错勾任何一项整题 0 分）", options: ["标了 const，收 const Score& 的函数才调得动这个方法", "只把 const 写在返回值前面，方法里仍然可以写成员", "一个方法挂了 const，就保证这个对象在整个程序期间不会变", "在 const 方法里调同类另一个不带 const 的方法，同样被拦"], answers: [0, 1, 3], why: "const 管的是「这个方法动不动成员」和「只读对象上能调什么」，它管不住别的方法什么时候改对象。" },
        { id: "q5", type: "output", score: 14, coversTask: 1, stem: "演示 3 里把 s.add(1) 那一行删掉之后，这段跑完打印什么？（一行）\nScore s(10); s.add(4); report(s);", acceptLines: ["还剩 6 个"], why: "留着一行 add 就先被编译拦下；删掉之后 report 只读，10 减 4 得 6。这也说明只读函数干不了改数据的活。" },
        { id: "q6", type: "choice", score: 12, stem: "一个方法该不该挂 const，本课给的判断口径是？", options: ["看它有没有返回值", "函数体里既没写成员、也没调不带 const 的方法，就该挂", "看它写在 public 还是 private 下面", "名字里带 get、print 的一律挂上"], answer: 1, why: "口径只看它动不动状态，跟名字、可见性、有没有返回值都无关。靠名字猜是最容易漏标的那条路。" },
        { id: "q7", type: "match", score: 21, coversTask: 1, stem: "把左边关于 const 的四种写法，和它真正管到的事连起来（右边顺序是打乱的）。", answer: {"把 const 写在参数表后面，像 int remaining() const": "编译器替这份承诺盯着：一写成员就报只读对象，删掉那行才过得去", "把 const 只写在返回值前面": "它管不到这个方法动不动成员，光写在这儿什么也没承诺", "在带 const 的方法里写一行 done_ = 0": "这就是本课任务里那一行手滑的下场", "函数参数写成 const Score& s": "交出去的是只读对象，不带 const 的方法一个也敲不开"}, left: ["把 const 写在参数表后面，像 int remaining() const", "把 const 只写在返回值前面", "在带 const 的方法里写一行 done_ = 0", "函数参数写成 const Score& s"], right: ["它管不到这个方法动不动成员，光写在这儿什么也没承诺", "编译器替这份承诺盯着：一写成员就报只读对象，删掉那行才过得去", "交出去的是只读对象，不带 const 的方法一个也敲不开", "这就是本课任务里那一行手滑的下场"], why: "const 写在参数表后面才修饰这个方法：它承诺不动成员，这份承诺由编译器在编译期兑现，写一下就拦住，删掉才过。返回值前面那个 const 管的是别的事。参数写成只读引用时，交出去的是只读对象，只有带 const 的方法敲得开。" }
      ],
      selftest: {
        refs: [
          {q1: 1, q2: "进度 40%，还剩 6 个", q3: 1, q4: [0, 1, 3], q5: "还剩 6 个", q6: 1, q7: {"把 const 写在参数表后面，像 int remaining() const": "编译器替这份承诺盯着：一写成员就报只读对象，删掉那行才过得去", "把 const 只写在返回值前面": "它管不到这个方法动不动成员，光写在这儿什么也没承诺", "在带 const 的方法里写一行 done_ = 0": "这就是本课任务里那一行手滑的下场", "函数参数写成 const Score& s": "交出去的是只读对象，不带 const 的方法一个也敲不开"}}],
        wrongs: [
          {q1: 0, q2: "进度 4%，还剩 6 个", q3: 0, q4: [2], q5: "还剩 5 个", q6: 3, q7: {"把 const 写在参数表后面，像 int remaining() const": "它管不到这个方法动不动成员，光写在这儿什么也没承诺", "把 const 只写在返回值前面": "交出去的是只读对象，不带 const 的方法一个也敲不开", "在带 const 的方法里写一行 done_ = 0": "编译器替这份承诺盯着：一写成员就报只读对象，删掉那行才过得去", "函数参数写成 const Score& s": "这就是本课任务里那一行手滑的下场"}}],
        loose: [
          {q1: "1", q2: " 进度 40%，还剩 6 个 ", q3: "1", q4: [3, 1, 0], q5: "还剩 6 个 ", q6: "1", q7: {"0": 1, "1": 0, "2": 3, "3": 2}}]
      }
    },
    {
      cid: "m115", kind: "paper", mode: "code", authored: "3c7515e1", pass: 60, task: "任务题目：给 Score 再写一个 operator==，科目名相同就算相等，然后打印 v[0] == v[1]；先想清楚排完序之后 v[0] 和 v[1] 各是谁再跑", hint: "想不起来就回看本课【演示 3 · 本课任务：再写一个 operator==】与【常见坑】里那条「写成一个让 a 不小于 a 成立的样式」。",
      questions: [
        { id: "q1", type: "code", score: 27, coversTask: 1, stem: "（任务题）写一个 operator==：两个 Score 的科目名相同就算相等。参数是右边那个对象，方法本身不改任何东西。", acceptRegex: ["operator\\s*=", "name_\\s*=="], sample: "bool operator==(const Score& o) const { return name_ == o.name_; }", why: "名字固定是 operator 跟一个符号；比较只看名字是否相同，就用 name_ 跟 o 的 name_ 比。后面那个 const 是上一课的规矩。" },
        { id: "q2", type: "code", score: 17, coversTask: 1, stem: "写出 Score 的 operator<：按完成率决定谁排前面，参数接右边那个对象，方法不改对象。", acceptRegex: ["operator\\s*<", "rate\\s*\\("], sample: "bool operator<(const Score& o) const { return rate() < o.rate(); }", why: "这一句是整节课的轴：算法问的那句话由它回答，比较的口径直接用已经写好的只读方法 rate。" },
        { id: "q3", type: "code", score: 28, coversTask: 1, stem: "写一行打印：这个排完序的 vector 里，下标 0 和下标 1 那两个对象相等吗？直接用 == 比较它们，把结果塞进 {} 里打出来。", acceptRegex: ["std\\s*::\\s*println\\s*\\(", "\\{\\s*\\}", "\\[\\s*0\\s*\\]\\s*==\\s*\\w+\\s*\\[\\s*1\\s*\\]"], sample: "std::println(\"排完 v0 == v1 是 {}\", v[0] == v[1]);", why: "operator== 写完之后，v[0] == v[1] 这一句就是在调用它；打印出来是 true 还是 false，看的是你定的那条相等规则。" },
        { id: "q4", type: "code", score: 28, coversTask: 1, stem: "写一行：把整批 Score 对象排一次序，排序用的就是类里那个 operator<，一个额外参数都不必给。", acceptRegex: ["std\\s*::\\s*sort\\s*\\(", "\\.\\s*begin\\s*\\(\\s*\\)", "\\.\\s*end\\s*\\(\\s*\\)"], sample: "std::sort(v.begin(), v.end());", why: "std::sort 只要两个迭代器；它自己会去问 a < b，于是你在类里写下的 operator< 就是它用的那把尺子。" }
      ],
      selftest: {
        refs: [
          {q1: "bool operator==(const Score& o) const { return name_ == o.name_; }", q2: "bool operator<(const Score& o) const { return rate() < o.rate(); }", q3: "std::println(\"排完 v0 == v1 是 {}\", v[0] == v[1]);", q4: "std::sort(v.begin(), v.end());"}],
        wrongs: [
          {q1: "bool operator==(const Score& o) { return rate() == o.rate(); }", q2: "int compare(Score o) { return 0; }", q3: "std::println(\"{}\", v[0] < v[1]);", q4: "std::max(v.begin(), v.end());"}],
        loose: [
          {q1: "bool operator == ( const Score& other ) const {\n  return  name_  ==  other.name_ ;\n}", q2: "bool  operator <(const Score& other) const{ return other.rate() > rate(); }", q3: "std :: println ( \"看： {}\" , v [ 0 ] == v [ 1 ] ) ;", q4: "std :: sort ( v . begin ( ) , v . end ( ) ) ;"}]
      }
    },
    {
      cid: "m116", kind: "paper", mode: "quiz", pass: 60, task: "任务题目：把 override 删掉再故意把 area 拼成 aer，对比有无 override 时编译器的反应，并说清那两行 0.00 是从哪一句来的", hint: "想不起来就回看本课【演示 2 · 本课任务：把 override 删掉，再故意拼错名字】与【常见坑】里那条析构。",
      questions: [
        { id: "q1", type: "choice", score: 10, stem: "virtual 和 override 分别在哪一头说话？", options: ["virtual 说这个方法欢迎孩子改写；override 说我这一行就是在改写，请编译器检查", "virtual 说这个类不许被继承；override 说要重写两遍", "两个是一个意思，写哪个都行", "virtual 只给析构用，override 只给方法用"], answer: 0, why: "一个开口子、一个验收。源稿那两行注释正好对上：基类 virtual ~Shape 与 virtual double area，孩子 area 后面写 override。" },
        { id: "q2", type: "output", score: 13, stem: "把 override 删掉、又把 area 拼成 aer，其余照演示 1，两个半径 2.0 和 1.0 的圆跑出来打印什么？（两行）", acceptLines: ["圆的面积 = 0.00", "圆的面积 = 0.00"], why: "拼错的那个 aer 没人调用，s->area() 走的还是基类那句 return 0.0 —— 编译一路通过，这正是没写 override 的下场。" },
        { id: "q3", type: "choice", score: 28, coversTask: 1, stem: "保留 override、把 area 拼成 aer，编译器报 'double Circle::aer() const' marked 'override', but does not override。这句在说什么？", options: ["你写的这个函数没匹配上任何允许改写的方法，改写根本没发生", "Circle 不能继承 Shape", "area 的返回值类型必须是 int", "基类的析构函数漏了 virtual"], answer: 0, why: "同一个报错也出现在参数多写一个、或者孩子自己漏了 const 的情况 —— 它盯的就是签名三项对不对得上。" },
        { id: "q4", type: "multi", score: 15, stem: "关于继承，说法对的是？（多选，错勾任何一项整题 0 分）", options: ["class Circle : public Shape 读作 Circle 对外就是一个 Shape", "打算被继承的类，析构要写 virtual，否则孩子那一份不跑", "基类摆在 private 下的数据成员，孩子在 Circle 的类里可以直接写", "再加一个新图形类型，遍历那一段代码一个字都不用改"], answers: [0, 1, 3], why: "基类的 private 孩子在类里直接写是报错的，要走父亲留下的公开方法；其余三条都是本课正文实测过或明确讲过的形状。" },
        { id: "q5", type: "blank", score: 22, coversTask: 1, stem: "孩子那一行想在编译期确认自己真的改到了父亲的方法，就在参数表后面写上关键词____。", accept: ["override", "写 override"], why: "老写法没这层保险：拼错名字、参数不同、少个 const，全都静悄悄合法，程序照跑，只是走的是基类那份。" },
        { id: "q6", type: "choice", score: 12, stem: "实测把基类析构的 virtual 去掉，父子两个析构各打印一句话，程序打出来的是？", options: ["先 清理 Circle 再 清理 Shape", "只打印 清理 Shape —— 孩子那句根本没跑", "-Wall 会先警告一句，然后照常清理两个", "编译不过，逼你加回来"], answer: 1, why: "通过父亲的手收孩子时，析构不带 virtual 就只跑父亲那一份，而且实测连 -Wall 都没提示。规矩：打算被继承的类，析构写 virtual。" }
      ],
      selftest: {
        refs: [
          {q1: 0, q2: "圆的面积 = 0.00\n圆的面积 = 0.00", q3: 0, q4: [0, 1, 3], q5: "override", q6: 1}],
        wrongs: [
          {q1: 1, q2: "圆的面积 = 12.57\n圆的面积 = 3.14", q3: 3, q4: [2], q5: "virtual", q6: 0}],
        loose: [
          {q1: "0", q2: " 圆的面积 = 0.00 \n圆的面积 = 0.00 ", q3: "0", q4: [3, 1, 0], q5: "OVERRIDE", q6: "1"}]
      }
    },
  ]
};
