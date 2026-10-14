/* 喵站 · C++ 掌握 考卷分部 p02：第 83–85 课（主控亲写）
 * 契约与入门那两份完全一样：权重和 100、任务逐条 coversTask、refs 判 100 / wrongs <60 / loose 过。
 */
window.MIAO_CPPM_EXAM_P02 = {
  papers: [
    {
      cid: "m83", kind: "paper", mode: "code", authored: "0a1e3a58", pass: 60, title: "第 83 课考试 · struct 把数据装进一张名片", task: "任务题目：定义 struct Point { double x; double y; }; 存一个点并打印；说清 struct 比一排散变量好在哪", hint: "回看本课「怎么做」那段与【演示 2 · 一屋子名片】。",
      questions: [
        { id: "q1", type: "code", score: 37, coversTask: 1, stem: "（任务题）写出 struct 的定义，以及 main 里那两句：造一个 Point 存 x=1.5、y=2，然后打印 x 与 y（打印格式随意，用 println 就行）。", acceptRegex: ["struct\\s+Point\\s*\\{[^}]*double\\s+x", "struct\\s+Point\\s*\\{[^}]*double\\s+y", "Point\\s+\\w+\\s*\\{\\s*1\\.5\\s*,\\s*2", "\\.x", "\\.y"], sample: "struct Point { double x; double y; };\nint main() {\n    Point p{1.5, 2};\n    std::println(\"{} {}\", p.x, p.y);\n    return 0;\n}", why: "定义里两个 double 栏位、结尾的 }; 带分号；取值用点号 p.x / p.y。" },
        { id: "q2", type: "code", score: 36, coversTask: 1, stem: "（任务题）写出这张名片的定义：名字是 Point，两栏都是 double，先 x 后 y，结尾带上那个分号。", acceptRegex: ["struct\\s+Point\\s*\\{", "double\\s+x\\s*;", "double\\s+y\\s*;", "\\}\\s*;"], sample: "struct Point { double x; double y; };", why: "左花括号前是名片的名字，花括号里按顺序摆栏位，收尾的 }; 里那个分号是语法的一部分 —— 少了它，报错常常甩到后面很远的地方。" },
        { id: "q3", type: "code", score: 27, coversTask: 1, stem: "（任务题）造一张 Point 名片，按声明顺序把 1.5 填进 x、2 填进 y。", acceptRegex: ["Point\\s+\\w+\\s*(=\\s*)?\\{\\s*1\\.5\\s*,\\s*2"], sample: "Point p{1.5, 2};", why: "花括号里的数按声明顺序进栏位：第一个进 x，第二个进 y。顺序写反就得到 x 是 2、y 是 1.5 的那个点。" }
      ],
      selftest: {
        refs: [
          {q1: "struct Point { double x; double y; };\nint main() {\n    Point p{1.5, 2};\n    std::println(\"{} {}\", p.x, p.y);\n    return 0;\n}", q2: "struct Point { double x; double y; };", q3: "Point p{1.5, 2};"}],
        wrongs: [
          {q1: "struct Point { int x; int y; };\nPoint p{1, 2};", q2: "struct Point { double x; double y; }", q3: "Point p{2, 1.5};"},
          {q1: "struct Point { double x, y };\nPoint p = {1.5, 2};\nprintln(p.x);", q2: "struct Point { double x; double y; }", q3: "Point p{2, 1.5};"}],
        loose: [
          {q1: "struct Point{\n  double x;\n  double y;\n};\nint main(){ Point  P  = {1.5, 2.0} ; println(\"{},{}\",P.x , P.y);} ", q2: "struct   Point   {   double  x ;   double   y ;   }   ;", q3: "Point   Q  =  {  1.5 ,  2.0 } ;"}]
      }
    },
    {
      cid: "m84", kind: "paper", mode: "quiz", pass: 60, title: "第 84 课考试 · 教 println 认识你的 struct", task: "任务题目：把说明书里的格式改成 学生{}:{}（学号在前、名字在后），重跑看效果；并说清登记 formatter 换来什么", hint: "回看【演示 1 · 换一种格式，只改一处】与「怎么做」那段。",
      questions: [
        { id: "q1", type: "choice", score: 18, coversTask: 1, stem: "std::println(\"{}\", s) 印不出你自创的 Student，根本原因是什么？", options: ["s 没初始化", "println 认类型，而你这个类型没在它的名单上", "struct 不能有成员函数", "println 只能印一个参数"], answer: 1, why: "int、double、std::string 在册；你昨天造的 Student 不在，得给它登记一份怎么写。" },
        { id: "q2", type: "choice", score: 16, coversTask: 1, stem: "这份说明书（formatter 特化）里，今天真正需要你写的是哪部分？", options: ["parse 那一整行", "format 里的格式串与实参", "template <> 那一行", "三个 #include"], answer: 1, why: "parse 与骨架照抄；格式由你的名片决定，改的是 format。" },
        { id: "q3", type: "output", score: 17, coversTask: 1, stem: "说明书里写的是 \"[{}] {}\"，学号 1001、姓名 小明。std::println(\"{}\", s) 打印什么？", acceptLines: ["[1001] 小明"], why: "两个坑依次填 id 与 name，方括号是格式串里的普通字符。" },
        { id: "q4", type: "multi", score: 21, stem: "关于「登记 formatter」，哪些说法对？（多选，错一项整题 0 分）", options: ["登记一次，工程里所有打印点都跟着变", "忘 #include <format> 会甩一大串模板内部报错", "它能顺便教会 sort 怎么比较", "临时只印一次的情况，直接写 s.id 与 s.name 更省事"], answers: [0, 1, 3], why: "怎么比是另一件事（下一课 sort + lambda）；formatter 只管「怎么写」。" },
        { id: "q5", type: "blank", score: 10, stem: "标准库预留的那个「每个类型怎么写」的空格，正式名字叫 std::____（填模板名）。", accept: ["formatter"], why: "std::formatter<你的类型> 就是往那个空格里填东西。" },
        { id: "q6", type: "order", score: 18, coversTask: 1, stem: "把「让 println 认识新类型」的四步排成正确顺序。", answer: [0, 1, 2, 3], steps: ["定义好 struct（确定要印哪几栏）", "包含 print 与 format 两个头文件", "写 std::formatter<类型> 特化，填 parse 与 format", "在 main 里直接把对象放进花括号打印"], why: "先有类型，再包头文件，然后登记说明书，最后才用得上。" }
      ],
      selftest: {
        refs: [
          {q1: 1, q2: 1, q3: "[1001] 小明", q4: [0, 1, 3], q5: "formatter", q6: [0, 1, 2, 3]}],
        wrongs: [
          {q1: 0, q2: 0, q3: "小明 1001", q4: [0, 2], q5: "print", q6: [1, 0, 3, 2]},
          {q1: 3, q2: 2, q3: "[1001] 小明", q4: [1, 2], q5: "formatter", q6: [3, 2, 1, 0]}],
        loose: [
          {q1: "1", q2: "1", q3: "[1001]  小明", q4: [0, 1, 3], q5: "FORMATTER", q6: ["0", "1", "2", "3"]}]
      }
    },
    {
      cid: "m85", kind: "paper", mode: "code", authored: "d34990e1", pass: 60, title: "第 85 课考试 · 多关键字定名次", task: "任务题目：改排序规则为「分数升序，平局时学号大的在前」；并说清平局为什么必须有第二条", hint: "回看【演示 1 · 先比分数，平局比学号】和那张比较链的图。",
      questions: [
        { id: "q1", type: "code", score: 38, coversTask: 1, stem: "（任务题）写出那段比较 lambda：分数升序（低分在前），平局时学号大的在前。", acceptRegex: ["if\\s*\\(\\s*a\\.score\\s*!=\\s*b\\.score\\s*\\)\\s*return\\s*a\\.score\\s*<", "return\\s*a\\.id\\s*>\\s*b\\.id"], sample: "[](const Student& a, const Student& b) {\n    if (a.score != b.score) return a.score < b.score;\n    return a.id > b.id;\n}", why: "第一关键字换成小于（升序），平局那条学号要用大于（大的在前）。" },
        { id: "q2", type: "code", score: 31, coversTask: 1, stem: "（任务题）写这把比较工具的开头：中括号空着，圆括号里按 const Student& 收两张名片，一张叫 a、一张叫 b。", acceptRegex: ["\\[\\s*\\]\\s*\\(", "Student\\s*&\\s*a\\s*,\\s*(const\\s+)?Student\\s*&\\s*b\\s*\\)"], sample: "[](const Student& a, const Student& b) {", why: "空中括号是「不拿外面任何东西」的声明，紧跟着那对圆括号才是参数表；按 const 引用收名片，比较时想写 a.score、a.name 才写得出，也不用每比一次复制两张名片。" },
        { id: "q3", type: "code", score: 31, coversTask: 1, stem: "（任务题）把规则挂上去：写一行，拿 sort 对 ss 整段排序，比较规则就用现场捏的这把 lambda（内容随你写）。", acceptRegex: ["sort\\s*\\(\\s*ss\\s*\\.\\s*begin\\s*\\(\\s*\\)\\s*,\\s*ss\\s*\\.\\s*end\\s*\\(\\s*\\)", "\\[\\s*\\]"], sample: "std::sort(ss.begin(), ss.end(), [](const Student& a, const Student& b) { return a.score < b.score; });", why: "sort 的喂法还是「头 + 尾后 + 规则」，第三头换成你的 lambda；少给这一头就退回默认的小在前，那条规则就不再是你定的了。" }
      ],
      selftest: {
        refs: [
          {q1: "[](const Student& a, const Student& b) {\n    if (a.score != b.score) return a.score < b.score;\n    return a.id > b.id;\n}", q2: "[](const Student& a, const Student& b) {", q3: "std::sort(ss.begin(), ss.end(), [](const Student& a, const Student& b) { return a.score < b.score; });"}],
        wrongs: [
          {q1: "[](const Student& a, const Student& b) {\n    return a.score > b.score;\n}", q2: "[](int a, int b) {", q3: "std::sort(ss.begin(), ss.end());"},
          {q1: "[](Student a, Student b) { return a.id < b.id; }", q2: "[](int a, int b) {", q3: "std::sort(ss.begin(), ss.end());"}],
        loose: [
          {q1: "[]( const  Student & a , const Student&  b ){\n  if(a.score!=b.score) return a.score<b.score;\n  return a.id>b.id;\n}", q2: "[ ] ( const  Student &  a , const Student &  b ) {", q3: "sort( ss . begin ( ) , ss . end ( ) , [ ] ( const Student & a , const Student & b ){ return a.score<b.score; } );"}]
      }
    },
  ]
};
