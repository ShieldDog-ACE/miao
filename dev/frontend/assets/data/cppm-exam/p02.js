/* 喵站 · C++ 掌握 考卷分部 p02：第 83–85 课（主控亲写）
 * 契约与入门那两份完全一样：权重和 100、任务逐条 coversTask、refs 判 100 / wrongs <60 / loose 过。
 */
window.MIAO_CPPM_EXAM_P02 = {
  papers: [
    {
      cid: "m83", kind: "paper", mode: "ide", authored: "0a1e3a58", file: "main.cpp", pass: 60, title: "第 83 课考试 · struct 把数据装进一张名片", task: "任务题目：定义 struct Point { double x; double y; }; 存一个点并打印；说清 struct 比一排散变量好在哪", hint: "回看本课「怎么做」那段与【演示 2 · 一屋子名片】。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 37, coversTask: 1, stem: "（任务题）写出 struct 的定义，以及 main 里那两句：造一个 Point 存 x=1.5、y=2，然后打印 x 与 y（打印格式随意，用 println 就行）。", acceptRegex: ["struct\\s+Point\\s*\\{[^}]*double\\s+x", "struct\\s+Point\\s*\\{[^}]*double\\s+y", "Point\\s+\\w+\\s*\\{\\s*1\\.5\\s*,\\s*2", "\\.x", "\\.y"], acceptOn: "code", sample: "struct Point { double x; double y; };\nint main() {\n    Point p{1.5, 2};\n    std::println(\"{} {}\", p.x, p.y);\n    return 0;\n}", why: "定义里两个 double 栏位、结尾的 }; 带分号；取值用点号 p.x / p.y。" },
        { id: "q2", type: "code", score: 36, coversTask: 1, stem: "（任务题）写出这张名片的定义：名字是 Point，两栏都是 double，先 x 后 y，结尾带上那个分号。", acceptRegex: ["struct\\s+Point\\s*\\{", "double\\s+x\\s*;", "double\\s+y\\s*;", "\\}\\s*;"], acceptOn: "code", sample: "struct Point { double x; double y; };", why: "左花括号前是名片的名字，花括号里按顺序摆栏位，收尾的 }; 里那个分号是语法的一部分 —— 少了它，报错常常甩到后面很远的地方。" },
        { id: "q3", type: "code", score: 27, coversTask: 1, stem: "（任务题）造一张 Point 名片，按声明顺序把 1.5 填进 x、2 填进 y。", acceptRegex: ["Point\\s+\\w+\\s*(=\\s*)?\\{\\s*1\\.5\\s*,\\s*2"], acceptOn: "code", sample: "Point p{1.5, 2};", why: "花括号里的数按声明顺序进栏位：第一个进 x，第二个进 y。顺序写反就得到 x 是 2、y 是 1.5 的那个点。" }
      ],
      selftest: {
        refs: [
          "#include <print>\nint main() {\n    struct Point { double x; double y; };\n    int main() {\n    Point p{1.5, 2};\n    std::println(\"{} {}\", p.x, p.y);\n    return 0;\n    }\n    struct Point { double x; double y; };\n    Point p{1.5, 2};\n    return 0;\n}\n"],
        wrongs: [
          "",
          "struct Point { int x; int y; };\nPoint p{1, 2};",
          "struct Point { double x; double y; }",
          "Point p{2, 1.5};"],
        loose: [
          "int main() {\n    struct Point{\n    double x;\n    double y;\n    };\n    int main(){ Point  P  = {1.5, 2.0} ; println(\"{},{}\",P.x , P.y);}\n    struct   Point   {   double  x ;   double   y ;   }   ;\n    Point   Q  =  {  1.5 ,  2.0 } ;\n    return 0;\n}\n"]
      }
    },
    {
      cid: "m84", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 84 课考试 · 教 println 认识你的 struct", task: "任务题目：把说明书里的格式改成 学生{}:{}（学号在前、名字在后），重跑看效果；并说清登记 formatter 换来什么", hint: "回看【演示 1 · 换一种格式，只改一处】与「怎么做」那段。",
      notes: ["println 认类型：int、double、std::string 在册，你自创的 struct 不在，得给它登记一份怎么写。", "parse 那一整行和 template <> 那一行照抄就行，需要你自己写的是 format 里的格式串与实参。", "登记一次，工程里所有打印点都跟着变；临时只印一次的情况，直接写 s.id 与 s.name 更省事。", "忘 #include <format> 会甩一大串模板内部报错，那不是你的类型错了，是说明书压根没地方登记。", "一个类型一份说明书，两份互不打扰；formatter 只管怎么写，怎么比是另一件事。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "定义好要印的那个类型：一个 struct，里面一栏 int、一栏 std::string。", acceptRegex: ["\\bstruct\\s+\\w+\\s*\\{[^}]*\\bint\\s+\\w+", "std::string\\s+\\w+"], acceptOn: "code", sample: "struct Student { int id; std::string name; };", why: "先确定要印哪几栏：int、double、std::string 这些标准库类型本来就在 println 的名单上，自创的类型不在。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "登记说明书：template <> 后面写 struct std::formatter<你的类型>，并把 parse 那一行照抄进来（收一个 std::format_parse_context 引用）。", acceptRegex: ["template\\s*<>", "std::formatter\\s*<\\s*\\w+\\s*>", "parse\\s*\\(\\s*std::format_parse_context\\s*&\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "template <>\nstruct std::formatter<Student> {\n    constexpr auto parse(std::format_parse_context& ctx) { return ctx.begin(); }", why: "std::formatter<你的类型> 就是往标准库预留的那个空格里填东西；parse 和骨架照抄，今天真正要写的是 format。" },
        { id: "q3", type: "code", score: 25, coversTask: 1, stem: "任务那一改：format 里用 std::format_to 往 ctx.out() 写，格式串换成源稿要的那一句 学生{}:{}。", acceptRegex: ["std::format_to\\s*\\(\\s*\\w+\\.out\\s*\\(\\s*\\)", "\"学生\\{\\}:\\{\\}\""], acceptOn: "code", sample: "return std::format_to(ctx.out(), \"学生{}:{}\", s.id, s.name);", why: "换一种格式只改这一处：工程里所有打印这个类型的点都跟着变，一处没漏。" },
        { id: "q4", type: "code", score: 20, coversTask: 1, stem: "把那两个坑的实参给全：按顺序递上这个对象的两栏（点号取成员，逗号隔开）。", acceptRegex: ["std::format_to\\s*\\(", "\\w+\\.\\w+\\s*,\\s*\\w+\\.\\w+"], acceptOn: "code", sample: "std::format_to(ctx.out(), \"学生{}:{}\", s.id, s.name)", why: "几个坑就给几个值，顺序就是名单里那两栏的顺序；冒号和方括号都是格式串里的普通字符。" },
        { id: "q5", type: "code", score: 20, coversTask: 1, stem: "在 main 里把整个对象直接放进坑里打一次：std::println 的格式串一个占位坑，逗号后面给那个对象。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "std::println(\"名单：{}\", s);", why: "登记过说明书之后，println 才认得这个类型；临时造出来的 Student{1002, 小红} 也能直接印。" }
      ],
      selftest: {
        refs: [
          "#include <format>\n#include <print>\n#include <string>\n\nstruct Student { int id; std::string name; };\n\ntemplate <>\nstruct std::formatter<Student> {\n    constexpr auto parse(std::format_parse_context& ctx) { return ctx.begin(); }\n    auto format(const Student& s, std::format_context& ctx) const {\n        return std::format_to(ctx.out(), \"学生{}:{}\", s.id, s.name);   // 任务：只改这一处\n    }\n};\n\nint main() {\n    Student s{1001, \"小明\"};\n    std::println(\"{}\", s);\n    std::println(\"名单：{}\", s);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <string>\n\nstruct Student { int id; std::string name; };\n\nint main() {\n    Student s{1001, \"小明\"};\n    std::println(\"[{}] {}\", s.id, s.name);\n    return 0;\n}\n",
          "#include <print>\n#include <string>\n\nstruct Student { int id; std::string name; };\n\ntemplate <>\nstruct std::formatter<Student> {\n    constexpr auto parse(std::format_parse_context& ctx) { return ctx.begin(); }\n};\n\nint main() {\n    Student s{1001, \"小明\"};\n    std::println(\"{}\", s);\n    return 0;\n}\n",
          "#include <print>\n\nint main() {\n    std::println(\"{}\", 1);\n    return 0;\n}\n"],
        loose: [
          "# include < format >\n# include < print >\n# include < string >\n\nstruct  Pupil { int  no ; std::string  label ; } ;\n\ntemplate  < >\nstruct  std::formatter < Pupil >\n{\n    constexpr auto parse ( std::format_parse_context &  cc ) { return cc.begin( ) ; }\n    auto  format ( const  Pupil &  one , std::format_context & cc ) const {\n        return std::format_to ( cc.out( ) ,  \"学生{}:{}\" , one.no , one.label ) ;\n    }\n};\n\nint  main ( )\n{\n    Pupil  p {7, \"阿明\"};\n    std::println(\"第二次：{} 又是 {}\", p, p);\n    std::println( \"学生 {}\" , p ) ;\n    return 0;\n}\n"]
      }
    },
    {
      cid: "m85", kind: "paper", mode: "ide", authored: "d34990e1", file: "main.cpp", pass: 60, title: "第 85 课考试 · 多关键字定名次", task: "任务题目：改排序规则为「分数升序，平局时学号大的在前」；并说清平局为什么必须有第二条", hint: "回看【演示 1 · 先比分数，平局比学号】和那张比较链的图。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 38, coversTask: 1, stem: "（任务题）写出那段比较 lambda：分数升序（低分在前），平局时学号大的在前。", acceptRegex: ["if\\s*\\(\\s*a\\.score\\s*!=\\s*b\\.score\\s*\\)\\s*return\\s*a\\.score\\s*<", "return\\s*a\\.id\\s*>\\s*b\\.id"], acceptOn: "code", sample: "[](const Student& a, const Student& b) {\n    if (a.score != b.score) return a.score < b.score;\n    return a.id > b.id;\n}", why: "第一关键字换成小于（升序），平局那条学号要用大于（大的在前）。" },
        { id: "q2", type: "code", score: 31, coversTask: 1, stem: "（任务题）写这把比较工具的开头：中括号空着，圆括号里按 const Student& 收两张名片，一张叫 a、一张叫 b。", acceptRegex: ["\\[\\s*\\]\\s*\\(", "Student\\s*&\\s*a\\s*,\\s*(const\\s+)?Student\\s*&\\s*b\\s*\\)"], acceptOn: "code", sample: "[](const Student& a, const Student& b) {", why: "空中括号是「不拿外面任何东西」的声明，紧跟着那对圆括号才是参数表；按 const 引用收名片，比较时想写 a.score、a.name 才写得出，也不用每比一次复制两张名片。" },
        { id: "q3", type: "code", score: 31, coversTask: 1, stem: "（任务题）把规则挂上去：写一行，拿 sort 对 ss 整段排序，比较规则就用现场捏的这把 lambda（内容随你写）。", acceptRegex: ["sort\\s*\\(\\s*ss\\s*\\.\\s*begin\\s*\\(\\s*\\)\\s*,\\s*ss\\s*\\.\\s*end\\s*\\(\\s*\\)", "\\[\\s*\\]"], acceptOn: "code", sample: "std::sort(ss.begin(), ss.end(), [](const Student& a, const Student& b) { return a.score < b.score; });", why: "sort 的喂法还是「头 + 尾后 + 规则」，第三头换成你的 lambda；少给这一头就退回默认的小在前，那条规则就不再是你定的了。" }
      ],
      selftest: {
        refs: [
          "#include <algorithm>\nint main() {\n    [](const Student& a, const Student& b) {\n    if (a.score != b.score) return a.score < b.score;\n    return a.id > b.id;\n    }\n    [](const Student& a, const Student& b) {\n    std::sort(ss.begin(), ss.end(), [](const Student& a, const Student& b) { return a.score < b.score; });\n    return 0;\n}\n}\n"],
        wrongs: [
          "",
          "[](const Student& a, const Student& b) {\n    return a.score > b.score;\n}",
          "[](int a, int b) {",
          "std::sort(ss.begin(), ss.end());"],
        loose: [
          "int main() {\n    []( const  Student & a , const Student&  b ){\n    if(a.score!=b.score) return a.score<b.score;\n    return a.id>b.id;\n    }\n    [ ] ( const  Student &  a , const Student &  b ) {\n    sort( ss . begin ( ) , ss . end ( ) , [ ] ( const Student & a , const Student & b ){ return a.score<b.score; } );\n    return 0;\n}\n}\n"]
      }
    },
  ]
};
