/* 喵站 · C++ 掌握 考卷分部 p02：第 83–85 课（主控亲写）
 * 契约与入门那两份完全一样：权重和 100、任务逐条 coversTask、refs 判 100 / wrongs <60 / loose 过。
 */
window.MIAO_CPPM_EXAM_P02 = {
  papers: [
    {
      cid: "m83", kind: "paper", pass: 60,
      title: "第 83 课考试 · struct 把数据装进一张名片",
      task: "任务题目：定义 struct Point { double x; double y; }; 存一个点并打印；说清 struct 比一排散变量好在哪",
      hint: "回看本课「怎么做」那段与【演示 2 · 一屋子名片】。",
      questions: [
        { id: "q1", type: "choice", score: 10,
          stem: "为什么要把学号、姓名、分数装进一个 struct，而不是摆三个 vector？",
          options: ["struct 运行更快", "本来就属于一个东西的数据订在一起，类型替你保证不被拆散", "struct 能占更少内存", "因为 vector 不能装字符串"],
          answer: 1,
          why: "三个盒子各自伸缩，长度一旦不同步，下标 2 的名字就配上了下标 2 的另一个分数，而程序不报错。" },
        { id: "q2", type: "code", score: 20, coversTask: 1,
          stem: "（任务题）写出 struct 的定义，以及 main 里那两句：造一个 Point 存 x=1.5、y=2，然后打印 x 与 y（打印格式随意，用 println 就行）。",
          acceptRegex: ["struct\\s+Point\\s*\\{[^}]*double\\s+x", "struct\\s+Point\\s*\\{[^}]*double\\s+y", "Point\\s+\\w+\\s*\\{\\s*1\\.5\\s*,\\s*2", "\\.x", "\\.y"],
          why: "定义里两个 double 栏位、结尾的 }; 带分号；取值用点号 p.x / p.y。" },
        { id: "q3", type: "choice", score: 12, coversTask: 1,
          stem: "struct 定义结尾那个分号，下列说法对的是？",
          options: ["可以省，编译器自己找得到", "必须有，它是语法的一部分", "只有带成员函数时才要", "写了会报错"],
          answer: 1,
          why: "}; 的分号是定义的一部分，少了它报错常常甩到后面很远的地方。" },
        { id: "q4", type: "output", score: 14, coversTask: 1,
          stem: "这段跑完打印什么？（一行）\nstruct Student { int id; std::string name; };\nStudent s{1001, \"小明\"};\ns.id = 2002;\nstd::println(\"{}\", s.id);",
          acceptLines: ["2002"],
          why: "改一栏不动别的；s 的 name 仍然是小明，但这里只印 id。" },
        { id: "q5", type: "choice", score: 12,
          stem: "成员函数写成 bool passed() const 结尾带 const，它表达的意思是？",
          options: ["返回值不能被修改", "这个函数承诺不改名片上的任何一栏", "这个函数只能被调用一次", "它是常量成员，值不能变"],
          answer: 1,
          why: "结尾的 const 修饰的是这个成员函数：只读，不动成员。今天照抄即可，背后的规矩以后专门讲。" },
        { id: "q6", type: "multi", score: 18,
          stem: "下面关于 struct 的说法，哪些是对的？（多选，错一项整题 0 分）",
          options: ["Student b = a; 得到的是整份复制的新名片", "栏位按声明顺序填进花括号", "成员函数里可以直接写 score，不用 this->score", "struct 里不能放函数"],
          answers: [0, 1, 2],
          why: "struct 是值类型（赋值即复制）；定义里可以放成员函数，这正是名片带技能的意思。" },
        { id: "q7", type: "blank", score: 8, coversTask: 1,
          stem: "要造一个「一屋子学生」，用标准库的容器装 struct：声明写成 std::____<Student> 。（填容器名，不带 std::）",
          accept: ["vector"],
          why: "vector 的元素可以是任何类型，包括你自己造的 struct。" },
        { id: "q8", type: "choice", score: 6, coversTask: 1,
          stem: "range-for 遍历一屋子名片时，写 for (const Student& s : klass) 而不是 for (Student s : klass)，图的是什么？",
          options: ["省掉每圈复制一整张名片", "让 s 能被修改", "排序更快", "没有区别，只是习惯"],
          answer: 0,
          why: "按值就是每圈复制一份（名片里还有 string）；const 引用只看不摸，这是第 61 课的规矩。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: "struct Point { double x; double y; };\nint main() {\n    Point p{1.5, 2};\n    std::println(\"{} {}\", p.x, p.y);\n    return 0;\n}", q3: 1, q4: "2002", q5: 1, q6: [0, 1, 2], q7: "vector", q8: 0 }
        ],
        wrongs: [
          { q1: 0, q2: "struct Point { int x; int y; };\nPoint p{1, 2};", q3: 0, q4: "1001", q5: 0, q6: [0, 3], q7: "array", q8: 1 },
          { q1: 2, q2: "struct Point { double x, y };\nPoint p = {1.5, 2};\nprintln(p.x);", q3: 2, q4: "2002.0", q5: 3, q6: [1, 2, 3], q7: "list", q8: 2 }
        ],
        loose: [
          { q1: "1", q2: "struct Point{\n  double x;\n  double y;\n};\nint main(){ Point  P  = {1.5, 2.0} ; println(\"{},{}\",P.x , P.y);} ", q3: "1", q4: " 2002 ", q5: "1", q6: [0, 1, 2], q7: "VECTOR", q8: "0" }
        ]
      }
    },
    {
      cid: "m84", kind: "paper", pass: 60,
      title: "第 84 课考试 · 教 println 认识你的 struct",
      task: "任务题目：把说明书里的格式改成 学生{}:{}（学号在前、名字在后），重跑看效果；并说清登记 formatter 换来什么",
      hint: "回看【演示 1 · 换一种格式，只改一处】与「怎么做」那段。",
      questions: [
        { id: "q1", type: "choice", score: 14, coversTask: 1,
          stem: "std::println(\"{}\", s) 印不出你自创的 Student，根本原因是什么？",
          options: ["s 没初始化", "println 认类型，而你这个类型没在它的名单上", "struct 不能有成员函数", "println 只能印一个参数"],
          answer: 1,
          why: "int、double、std::string 在册；你昨天造的 Student 不在，得给它登记一份怎么写。" },
        { id: "q2", type: "code", score: 22, coversTask: 1,
          stem: "（任务题）把 format 里那句格式串改成「学生{}:{}」（先印 id 再印 name），写出那一行。",
          acceptRegex: ['format_to\\s*\\(\\s*ctx\\.out\\s*\\(\\s*\\)\\s*,\\s*"学生\\{\\}:\\{\\}"\\s*,\\s*\\w+\\.id\\s*,\\s*\\w+\\.name'],
          why: "只改格式串与两个实参的顺序；parse 那句照抄别动。" },
        { id: "q3", type: "choice", score: 12, coversTask: 1,
          stem: "这份说明书（formatter 特化）里，今天真正需要你写的是哪部分？",
          options: ["parse 那一整行", "format 里的格式串与实参", "template <> 那一行", "三个 #include"],
          answer: 1,
          why: "parse 与骨架照抄；格式由你的名片决定，改的是 format。" },
        { id: "q4", type: "output", score: 14, coversTask: 1,
          stem: "说明书里写的是 \"[{}] {}\"，学号 1001、姓名 小明。std::println(\"{}\", s) 打印什么？",
          acceptLines: ["[1001] 小明"],
          why: "两个坑依次填 id 与 name，方括号是格式串里的普通字符。" },
        { id: "q5", type: "multi", score: 16,
          stem: "关于「登记 formatter」，哪些说法对？（多选，错一项整题 0 分）",
          options: ["登记一次，工程里所有打印点都跟着变", "忘 #include <format> 会甩一大串模板内部报错", "它能顺便教会 sort 怎么比较", "临时只印一次的情况，直接写 s.id 与 s.name 更省事"],
          answers: [0, 1, 3],
          why: "怎么比是另一件事（下一课 sort + lambda）；formatter 只管「怎么写」。" },
        { id: "q6", type: "blank", score: 8,
          stem: "标准库预留的那个「每个类型怎么写」的空格，正式名字叫 std::____（填模板名）。",
          accept: ["formatter"],
          why: "std::formatter<你的类型> 就是往那个空格里填东西。" },
        { id: "q7", type: "order", score: 14, coversTask: 1,
          stem: "把「让 println 认识新类型」的四步排成正确顺序。",
          steps: ["定义好 struct（确定要印哪几栏）", "包含 print 与 format 两个头文件", "写 std::formatter<类型> 特化，填 parse 与 format", "在 main 里直接把对象放进花括号打印"],
          answer: [0, 1, 2, 3],
          why: "先有类型，再包头文件，然后登记说明书，最后才用得上。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: 'return std::format_to(ctx.out(), "学生{}:{}", s.id, s.name);', q3: 1, q4: "[1001] 小明", q5: [0, 1, 3], q6: "formatter", q7: [0, 1, 2, 3] }
        ],
        wrongs: [
          { q1: 0, q2: 'return std::format_to(ctx.out(), "{} {}", s.name, s.id);', q3: 0, q4: "小明 1001", q5: [0, 2], q6: "print", q7: [1, 0, 3, 2] },
          { q1: 3, q2: 'println("学生", s.id);', q3: 2, q4: "[1001] 小明", q5: [1, 2], q6: "formatter", q7: [3, 2, 1, 0] }
        ],
        loose: [
          { q1: "1", q2: 'return std::format_to( ctx.out() ,  "学生{}:{}" ,  s.id , s.name ) ;', q3: "1", q4: "[1001]  小明", q5: [0, 1, 3], q6: "FORMATTER", q7: ["0", "1", "2", "3"] }
        ]
      }
    },
    {
      cid: "m85", kind: "paper", pass: 60,
      title: "第 85 课考试 · 多关键字定名次",
      task: "任务题目：改排序规则为「分数升序，平局时学号大的在前」；并说清平局为什么必须有第二条",
      hint: "回看【演示 1 · 先比分数，平局比学号】和那张比较链的图。",
      questions: [
        { id: "q1", type: "choice", score: 12, coversTask: 1,
          stem: "传给 sort 的那个 lambda，它回答的问题是哪一句？",
          options: ["a 和 b 谁大", "a 该排在 b 前面吗", "a 等于 b 吗", "要不要交换 a 和 b 的位置"],
          answer: 1,
          why: "返回 true 表示 a 该在 b 前面 —— 所以「高分在前」写的是 a.score > b.score。" },
        { id: "q2", type: "code", score: 22, coversTask: 1,
          stem: "（任务题）写出那段比较 lambda：分数升序（低分在前），平局时学号大的在前。",
          acceptRegex: ["if\\s*\\(\\s*a\\.score\\s*!=\\s*b\\.score\\s*\\)\\s*return\\s*a\\.score\\s*<", "return\\s*a\\.id\\s*>\\s*b\\.id"],
          why: "第一关键字换成小于（升序），平局那条学号要用大于（大的在前）。" },
        { id: "q3", type: "choice", score: 14, coversTask: 1,
          stem: "如果只比分数、不定第二条规则，最可能的后果是什么？",
          options: ["编译不过", "同分两人的先后没被规定，换个编译器或数据量就可能变", "运行时崩溃", "sort 会自己按学号补排"],
          answer: 1,
          why: "普通 sort 不负责平局稳定：名次「时对时错」正是这个症状。" },
        { id: "q4", type: "output", score: 14, coversTask: 1,
          stem: "按「分数高在前、平局学号小在前」排序后，只打印姓名，顺序是什么？（数据：{1,小明,88.5} {2,小强,95.0} {3,小红,88.5}）",
          acceptLines: ["小强", "小明", "小红"],
          why: "95 最高在前；两个 88.5 比学号，1 比 3 小，所以小明在小红前。" },
        { id: "q5", type: "multi", score: 16,
          stem: "关于这段排序代码，哪些说法对？（多选，错一项整题 0 分）",
          options: ["参数写 const Student& 是为了少复制名片", "比较 lambda 里不该改数据", "多关键字的链条最后一条必须保证能分出先后", "用了 sort 就不必 #include <algorithm>"],
          answers: [0, 1, 2],
          why: "sort 住在 algorithm 里，不包就报名字找不到。" },
        { id: "q6", type: "blank", score: 8,
          stem: "让排序过程能直接写 a.score、a.name，靠的是 lambda 的____列表里给参数起了名字。（填两个字）",
          accept: ["参数", "形参", "参数表"],
          why: "[](const Student& a, const Student& b) 这个方括号后面的圆括号就是参数表。" },
        { id: "q7", type: "order", score: 14, coversTask: 1,
          stem: "把「多关键字排序」的思考顺序排对。",
          steps: ["定第一关键字（最关心的那个）", "问：这一条会不会相等", "会相等就加第二关键字", "一直加到某条键唯一、保证不再平局"],
          answer: [0, 1, 2, 3],
          why: "先粗后细，最后一条必须能分出胜负，链条才算写完。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: "[](const Student& a, const Student& b) {\n    if (a.score != b.score) return a.score < b.score;\n    return a.id > b.id;\n}", q3: 1, q4: "小强\n小明\n小红", q5: [0, 1, 2], q6: "参数", q7: [0, 1, 2, 3] }
        ],
        wrongs: [
          { q1: 0, q2: "[](const Student& a, const Student& b) {\n    return a.score > b.score;\n}", q3: 0, q4: "小明\n小红\n小强", q5: [0, 3], q6: "捕获", q7: [1, 0, 3, 2] },
          { q1: 2, q2: "[](Student a, Student b) { return a.id < b.id; }", q3: 3, q4: "小强\n小红\n小明", q5: [1, 2, 3], q6: "实参", q7: [3, 2, 1, 0] }
        ],
        loose: [
          { q1: "1", q2: "[]( const  Student & a , const Student&  b ){\n  if(a.score!=b.score) return a.score<b.score;\n  return a.id>b.id;\n}", q3: "1", q4: " 小强 \n\n小明\n小红\n", q5: [0, 1, 2], q6: "参数", q7: ["0", "1", "2", "3"] }
        ]
      }
    }
  ]
};
