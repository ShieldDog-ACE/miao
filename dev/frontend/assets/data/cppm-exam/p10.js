/* 喵站 · C++ 掌握 考卷分部 p10：第 113–116 课（第九轮）
 * 契约与 p04 一样：每题分数合计正好 100、源稿每条任务都有题 coversTask 对着、
 * 带 coversTask 的题合计 ≥50 分、每题带 why、refs 判 100 / wrongs 判 <60 / loose 判 ≥60。
 * 四份源稿各只有 1 条【任务】，所以 coversTask 一律是 [1]。
 */
window.MIAO_CPPM_EXAM_P10 = {
  papers: [
    {
      cid: "m113", kind: "paper", mode: "ide", authored: "c31922bc", file: "main.cpp", pass: 60, task: "任务题目：给 Score 加第三个成员 int done_ = 0;，构造函数不管它，然后打印出来确认对象一出生它就是 0；再回答它凭什么没被初始化列表也带着值出生", hint: "想不起来就回看本课【演示 3 · 声明处给默认值，构造函数可以不管它】与【原理讲解】里那条装载顺序。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 26, coversTask: 1, stem: "（任务题）按本课任务给这个类补上第三个成员：一个 int done_，对象一出生它就是 0，构造函数的参数表和冒号后面都不必写它。写出那一行声明。", acceptRegex: ["int\\s+done_\\s*=\\s*0"], acceptOn: "code", sample: "int done_ = 0;", why: "声明处那个 = 0 本身就是一份初始化，由所有构造函数共享。放在 private 区里，写不写注释都不算这题的点，那行 = 0 才是。" },
        { id: "q2", type: "code", score: 22, stem: "把演示 1 那个带冒号的构造函数改成不写冒号、在函数体里把两个成员一一赋值。写出函数体里那两句赋值。", acceptRegex: ["subject_\\s*=", "total_\\s*=\\s*total"], acceptOn: "code", sample: "subject_ = std::move(subject);\n        total_ = total;", why: "结果是同样的，代价不同：string 成员多付一次造壳与扔壳。这题只认你有没有把值写进带下划线的成员。" },
        { id: "q3", type: "code", score: 30, coversTask: 1, stem: "（任务题）写出这个构造函数：参数表收 std::string 和 int 各一个，紧跟冒号，后面只安排 subject_ 与 total_ 两栏，函数体空着。", acceptRegex: ["Score\\s*\\(\\s*(const\\s+)?std\\s*::\\s*string\\s+\\w+\\s*,\\s*int\\s+\\w+\\s*\\)\\s*:", "subject_\\s*\\(\\s*\\w+", "total_\\s*\\(\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "Score(std::string subject, int total) : subject_(std::move(subject)), total_(total) {}", why: "同名、不写返回类型，紧跟冒号那一段就是初始化列表 —— 成员出生时就带着值，没有「先成空壳再被赋值」那一步；done_ 不在列表里也不在参数里，它靠声明处的 = 0 自己出生。" },
        { id: "q4", type: "code", score: 22, coversTask: 1, stem: "（任务题）写一行：造一个 Score 对象，只递科目名和总数两个参数，第三个成员 done_ 不用你管。", acceptRegex: ["Score\\s+\\w+\\s*\\(\\s*\"[^\"]*\"\\s*,\\s*\\d+\\s*\\)"], acceptOn: "code", sample: "Score s(\"英语词汇\", 5500);", why: "声明处给了 = 0，所有构造函数共享这份初始化，调用处自然一个参数都不用多加 —— 对象一出生 done_ 就是 0。" }
      ],
      selftest: {
        refs: [
          "#include <string>\nint main() {\n    int done_ = 0;\n    subject_ = std::move(subject);\n    total_ = total;\n    Score(std::string subject, int total) : subject_(std::move(subject)), total_(total) {}\n    Score s(\"英语词汇\", 5500);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "int done_;",
          "subject(subject_); total(total_);",
          "Score(std::string subject, int total) { subject_ = std::move(subject); total_ = total; }",
          "Score s(5500, \"英语词汇\");"],
        loose: [
          "int main() {\n    int   done_=0 ;\n    subject_=std::move( subject ) ;\n    total_=total ;\n    Score ( std :: string  s , int  n )  :   total_ ( n ) ,  subject_ ( std :: move ( s ) ) { }\n    Score   p  (  \"数学\"  ,  30  ) ;\n    return 0;\n}\n"]
      }
    },
    {
      cid: "m114", kind: "paper", mode: "ide", authored: "20154591", file: "main.cpp", pass: 60, task: "任务题目：往只读的 remaining 里塞一行 done_ = 0;，看清编译器怎么把你拦下来，然后把那行删掉；再说清这条拦阻到底在保护谁", hint: "想不起来就回看本课【演示 2 · 本课任务：在 remaining 里手滑一行】与【演示 3 · const 引用只能敲带 const 的门】。",
      notes: ["const 写在参数表后面才算本课的 const 成员函数；只写在返回值前面一样合法，但方法内部照样能写成员。", "那行赋值被拦下时报的是 assignment of member in read-only object：方法把自己签成了只读，一写成员就撞编译器。", "标了 const，收 const 引用的函数才调得动这个方法；在带 const 的方法里调同类另一个不带 const 的方法，同样被拦。", "一个方法挂了 const，并不保证这个对象在整个程序期间不变 —— const 管的是这个方法动不动成员，管不住别的方法什么时候改对象。", "该不该挂 const 的口径只看函数体里既没写成员、也没调不带 const 的方法，跟名字、可见性、有没有返回值都无关。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "把这份程序写成能跑的形：把打印工具箱（#include <print>）搬进来，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n\nint main() {", why: "类定义写在 main 外面；没有 main，链接器找不到入口。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "写一个类，里面有一个只读的 int 方法：const 挂在参数表后面，像 int remaining() const。", acceptRegex: ["class\\s+\\w+", "int\\s+\\w+\\s*\\(\\s*\\)\\s*const"], acceptOn: "code", sample: "class Score {\npublic:\n    int remaining() const { return total_ - done_; }", why: "位置不同管的东西不同：const 只有挂在参数表后面才修饰这个方法；写在返回值前面一样合法，却什么也没承诺。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "再开一个不带 const 的方法：收一个 int 的 void 函数，函数体里用 += 改那个成员。", acceptRegex: ["void\\s+\\w+\\s*\\(\\s*int\\s+\\w+\\s*\\)\\s*\\{", "\\w+_\\s*\\+="], acceptOn: "code", sample: "void add(int n) { done_ += n; }", why: "它要写 done_，挂了 const 反而编译不过；要不要挂只看这个函数动不动成员。" },
        { id: "q4", type: "code", score: 25, coversTask: 1, stem: "任务第 1 条：在那个带 const 的方法里手滑一行 —— 直接给成员赋值 0（done_ = 0; 这样一句），就是要编译器当场拦你。", acceptRegex: ["[\\n;]\\s*\\w+_\\s*=\\s*0\\s*;"], acceptOn: "code", sample: "int remaining() const {\n    done_ = 0;\n    return total_ - done_;\n}", why: "这个方法把自己签成了只读，只读的方法里不能写成员；同样的赋值挪进不带 const 的 add 里立刻合法。" },
        { id: "q5", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：在旁边用一行注释抄下报错里那个词（read-only object，至少四个字），确认之后把那行删掉再说。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 报错说 assignment of member in read-only object：拦你的是参数表后面那个 const", why: "正则只能验你写了注释，抄得对不对判不了 —— 这一处是这块编辑器判不动的部分。" },
        { id: "q6", type: "code", score: 15, coversTask: 1, stem: "把只读这件事再做一层：写一个函数，参数是那个类的 const 引用，里面只用带 const 的方法。", acceptRegex: ["void\\s+\\w+\\s*\\(\\s*const\\s+\\w+\\s*&\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "void report(const Score& s) {\n    std::println(\"还剩 {} 个\", s.remaining());\n}", why: "交出去的是只读对象，不带 const 的方法一个也敲不开；所以 s.add(1) 那一行要先删掉才过得去。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nclass Score {\npublic:\n    Score(int total) : total_(total), done_(0) {}\n    int remaining() const {\n        done_ = 0;\n        return total_ - done_;\n    }\n    double progress() const { return static_cast<double>(done_) / total_; }\n    void add(int n) { done_ += n; }\nprivate:\n    int total_, done_;\n};\n\nvoid report(const Score& s) {\n    std::println(\"还剩 {} 个\", s.remaining());\n}\n\nint main() {\n    Score s(10);\n    s.add(4);\n    report(s);\n    return 0;\n}\n// 报错原话：assignment of member Score::done_ in read-only object，删掉那一行才过\n"],
        wrongs: [
          "",
          "#include <print>\n\nclass Score {\npublic:\n    int remaining() { return total_ - done_; }\n    void add(int n) { done_ += n; }\nprivate:\n    int total_ = 10;\n    int done_ = 0;\n};\n\nint main() {\n    Score s;\n    s.add(4);\n    std::println(\"{}\", s.remaining());\n    return 0;\n}\n",
          "#include <print>\n\nclass Score {\npublic:\n    const int remaining() const { return total_; }\n    void add(int n) { done_ = n; }\nprivate:\n    int total_ = 10;\n    int done_ = 0;\n};\n\nint main() {\n    Score s;\n    std::println(\"{}\", s.remaining());\n    return 0;\n}\n"],
        loose: [
          "#  include < print >\n\nclass  Score\n{\n  public :\n      int  left ( )  const {\n          done_ = 0;\n          return total_ - done_;\n      }\n      void  add ( int n ) { done_ += n; }\n  private :\n      int total_ = 10;\n      int done_ = 0;\n};\n\nvoid  tell ( const  Score & obj ) { std::println(\"{}\", obj.left()); }\n\nint  main ( )\n{\n  Score s;\n  s.add(3);\n  tell(s);\n  return 0;\n}\n// 报错里有 read-only object 这个词，那一行删掉就编译过了\n"]
      }
    },
    {
      cid: "m115", kind: "paper", mode: "ide", authored: "3c7515e1", file: "main.cpp", pass: 60, task: "任务题目：给 Score 再写一个 operator==，科目名相同就算相等，然后打印 v[0] == v[1]；先想清楚排完序之后 v[0] 和 v[1] 各是谁再跑", hint: "想不起来就回看本课【演示 3 · 本课任务：再写一个 operator==】与【常见坑】里那条「写成一个让 a 不小于 a 成立的样式」。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 27, coversTask: 1, stem: "（任务题）写一个 operator==：两个 Score 的科目名相同就算相等。参数是右边那个对象，方法本身不改任何东西。", acceptRegex: ["operator\\s*=", "name_\\s*=="], acceptOn: "code", sample: "bool operator==(const Score& o) const { return name_ == o.name_; }", why: "名字固定是 operator 跟一个符号；比较只看名字是否相同，就用 name_ 跟 o 的 name_ 比。后面那个 const 是上一课的规矩。" },
        { id: "q2", type: "code", score: 17, coversTask: 1, stem: "写出 Score 的 operator<：按完成率决定谁排前面，参数接右边那个对象，方法不改对象。", acceptRegex: ["operator\\s*<", "rate\\s*\\("], acceptOn: "code", sample: "bool operator<(const Score& o) const { return rate() < o.rate(); }", why: "这一句是整节课的轴：算法问的那句话由它回答，比较的口径直接用已经写好的只读方法 rate。" },
        { id: "q3", type: "code", score: 28, coversTask: 1, stem: "写一行打印：这个排完序的 vector 里，下标 0 和下标 1 那两个对象相等吗？直接用 == 比较它们，把结果塞进 {} 里打出来。", acceptRegex: ["std\\s*::\\s*println\\s*\\(", "\\{\\s*\\}", "\\[\\s*0\\s*\\]\\s*==\\s*\\w+\\s*\\[\\s*1\\s*\\]"], acceptOn: "code", sample: "std::println(\"排完 v0 == v1 是 {}\", v[0] == v[1]);", why: "operator== 写完之后，v[0] == v[1] 这一句就是在调用它；打印出来是 true 还是 false，看的是你定的那条相等规则。" },
        { id: "q4", type: "code", score: 28, coversTask: 1, stem: "写一行：把整批 Score 对象排一次序，排序用的就是类里那个 operator<，一个额外参数都不必给。", acceptRegex: ["std\\s*::\\s*sort\\s*\\(", "\\.\\s*begin\\s*\\(\\s*\\)", "\\.\\s*end\\s*\\(\\s*\\)"], acceptOn: "code", sample: "std::sort(v.begin(), v.end());", why: "std::sort 只要两个迭代器；它自己会去问 a < b，于是你在类里写下的 operator< 就是它用的那把尺子。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <algorithm>\nint main() {\n    bool operator==(const Score& o) const { return name_ == o.name_; }\n    bool operator<(const Score& o) const { return rate() < o.rate(); }\n    std::println(\"排完 v0 == v1 是 {}\", v[0] == v[1]);\n    std::sort(v.begin(), v.end());\n    return 0;\n}\n"],
        wrongs: [
          "",
          "bool operator==(const Score& o) { return rate() == o.rate(); }",
          "int compare(Score o) { return 0; }",
          "std::println(\"{}\", v[0] < v[1]);",
          "std::max(v.begin(), v.end());"],
        loose: [
          "int main() {\n    bool operator == ( const Score& other ) const {\n    return  name_  ==  other.name_ ;\n    }\n    bool  operator <(const Score& other) const{ return other.rate() > rate(); }\n    std :: println ( \"看： {}\" , v [ 0 ] == v [ 1 ] ) ;\n    std :: sort ( v . begin ( ) , v . end ( ) ) ;\n    return 0;\n}\n"]
      }
    },
    {
      cid: "m116", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, task: "任务题目：把 override 删掉再故意把 area 拼成 aer，对比有无 override 时编译器的反应，并说清那两行 0.00 是从哪一句来的", hint: "想不起来就回看本课【演示 2 · 本课任务：把 override 删掉，再故意拼错名字】与【常见坑】里那条析构。",
      notes: ["virtual 说这个方法欢迎孩子改写，override 说我这一行就是在改写、请编译器检查：一个开口子，一个验收。", "把 override 删掉又把名字拼错时，编译一路通过，s->area() 走的还是基类那句 return 0.0，屏幕上就是 0.00。", "挂着 override 拼错名字时报 marked 'override', but does not override：它盯的是签名三项对不对得上。", "打算被继承的类，析构要写 virtual，否则孩子那一份不跑；再加一个新图形类型，遍历那一段代码一个字都不用改。", "基类摆在 private 下的数据成员，孩子在类里直接写是报错的，要走父亲留下的公开方法。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "把这份程序写成能跑的形：把打印工具箱（#include <print>）搬进来，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n\nint main() {", why: "两个类写在 main 外面；没有 main，链接器找不到入口。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：先立父亲 —— 写一个类，里面有一个参数表后面挂着 virtual 的 double area() const，函数体 return 一个 0.0。", acceptRegex: ["virtual\\s+double\\s+\\w+\\s*\\(\\s*\\)\\s*const", "return\\s+0\\.0\\s*;"], acceptOn: "code", sample: "class Shape {\npublic:\n    virtual double area() const { return 0.0; }\n};", why: "virtual 说的是这个方法欢迎孩子改写；基类的 area 留着兜底，没人改写时就走它。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：再立孩子 —— 用 class 名字后面接冒号 public 基类那种写法继承过去，并在孩子里把 area 改写一遍，参数表后面挂上 override。", acceptRegex: ["class\\s+\\w+\\s*:\\s*public\\s+\\w+", "area\\s*\\(\\s*\\)\\s*const\\s+override"], acceptOn: "code", sample: "class Circle : public Shape {\npublic:\n    double area() const override { return 3.14159265 * r_ * r_; }\n};", why: "class Circle : public Shape 读作 Circle 对外就是一个 Shape；override 是请编译器替你确认这一行真的改到了父亲的方法。" },
        { id: "q4", type: "code", score: 30, coversTask: 1, stem: "任务第 1 条：把 area 故意拼成 aer，那一行照样挂着 override 别删 —— 就是要编译器替你查这笔账。", acceptRegex: ["aer\\s*\\(\\s*\\)\\s*const\\s+override"], acceptOn: "code", sample: "double aer() const override { return 3.14159265 * r_ * r_; }", why: "挂着 override 时这一行被当场拦下；同一个报错也出现在参数多写一个、或者孩子自己漏了 const 的情况。" },
        { id: "q5", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：再把那一行的 override 删掉跑一次，然后用一行注释写下两种写法各是什么反应（至少四个字）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 挂着 override 报 marked override but does not override；删掉 override 一路通过，面积打成 0.00", why: "注释内容判不了，只能验你确实记录了对比；那两样反应要你自己跑两遍看。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nclass Shape {\npublic:\n    virtual ~Shape() = default;\n    virtual double area() const { return 0.0; }\n};\n\nclass Circle : public Shape {\npublic:\n    Circle(double r) : r_(r) {}\n    double area() const override { return 3.14159265 * r_ * r_; }\n    double aer() const override { return 3.14159265 * r_ * r_; }\nprivate:\n    double r_;\n};\n\nint main() {\n    Circle c(2.0);\n    std::println(\"圆的面积 = {:.2f}\", c.area());\n    return 0;\n}\n// 挂着 override 时报 marked 'override' but does not override；把 override 删掉就一路通过，面积还是 0.00\n"],
        wrongs: [
          "",
          "#include <print>\n\nclass Shape {\npublic:\n    double area() const { return 0.0; }\n};\n\nclass Circle : public Shape {\npublic:\n    double aer() const { return 3.0 * 3.0; }\n};\n\nint main() {\n    Circle c;\n    std::println(\"{}\", c.aer());\n    return 0;\n}\n",
          "#include <print>\n\nclass Shape {\npublic:\n    virtual double area() const { return 0.0; }\n};\n\nclass Circle : public Shape {\npublic:\n    double area() const override { return 3.0 * 3.0; }\n};\n\nint main() {\n    Circle c;\n    std::println(\"{}\", c.area());\n    return 0;\n}\n"],
        loose: [
          "#  include < print >\n\nclass  Shape\n{\n  public :\n      virtual  double  area ( )  const { return 0.0; }\n};\n\nclass  Ring :  public  Shape\n{\n  public :\n      double  area ( )  const  override { return 2.0 * 2.0; }\n      double  aer ( )  const  override { return 2.0; }\n};\n\nint  main ( )\n{\n  Ring  r ;\n  std::println(\"{}\", r.area());\n  return 0;\n}\n// 挂 override 时编译器说 does not override，删掉 override 一声不响，面积还是零\n"]
      }
    },
  ]
};
