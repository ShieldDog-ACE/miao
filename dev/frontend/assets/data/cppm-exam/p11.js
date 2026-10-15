/* 喵站 · C++ 掌握 考卷分部 p11：第 117–120 课（第九轮）
 * 契约同 p04：权重和正好 100、源稿每条任务都有题的 coversTask 对着、
 * refs 判 100 / wrongs 判 <60 / loose 判 ≥60、每题带 why。
 * 这一段的考点集中在「抽象类把实现逼到子类」「五件套交给编译器」「资源绑在对象寿命上」。
 */
window.MIAO_CPPM_EXAM_P11 = {
  papers: [
    {
      cid: "m117", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 117 课考试 · 抽象类与 explicit", task: "任务题目：给抽象类 Shape 补一个 Rectangle(w, h) 并实现 area；再把 Circle 构造前面那个 explicit 删掉，试试 Circle c = 3.0; 是不是居然能编译", hint: "想不起来就回看本课【演示 2 · 补一个 Rectangle】与【演示 3 · 一批形状，各算各的】。",
      notes: ["普通虚函数是父类给一个版本、孩子愿意就盖掉；末尾写 = 0 才是纯虚：父类一格都没填，孩子必须自己写。", "含空洞的类叫抽象类：动作列出来了，算法没填，所以它只能当爹，不能直接造对象。", "explicit 堵的就是一个数悄悄变成一个圆那条路；不加 explicit 时 Circle c = 3.0 能编译，参数顺序写反、类型想错都一路放行。", "Shape& s = c 是爹的引用指着儿子的对象，Shape* p = &r 是指针姿势，一样好用；同一类爹指针底下可以装着不同的儿子。", "遍历那一段圈里没有一个字提到 Circle 或 Rectangle，各算各的面积 —— 这就是这批形状各算各的写法。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "把这份程序写成能跑的形：把打印工具箱（#include <print>）搬进来，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n\nint main() {", why: "类写在 main 外面；没有 main，链接器找不到入口。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：先有那个留空洞的爹 —— class Shape 里写一句 virtual double area() const = 0;，自己不填。", acceptRegex: ["class\\s+Shape", "virtual\\s+double\\s+area\\s*\\(\\s*\\)\\s*const\\s*=\\s*0\\s*;"], acceptOn: "code", sample: "class Shape {\npublic:\n    virtual double area() const = 0;\n};", why: "= 0 是个记号，不是返回值：父类不实现，孩子必须写一份；含空洞的类只能当爹，不能直接造对象。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：补一个 Rectangle —— 用冒号 public Shape 继承过去，再写一个收两个 double 的构造，函数体里用 override 实现 area。", acceptRegex: ["class\\s+Rectangle\\s*:\\s*public\\s+Shape", "\\w+\\s*\\(\\s*double\\s+\\w+\\s*,\\s*double\\s+\\w+\\s*\\)", "double\\s+area\\s*\\(\\s*\\)\\s*const\\s+override"], acceptOn: "code", sample: "class Rectangle : public Shape {\npublic:\n    Rectangle(double w, double h) : w_(w), h_(h) {}\n    double area() const override { return w_ * h_; }", why: "纯虚那一格空洞由孩子填；填不上就还是抽象类，造不出对象。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：area 那一行 return 两个私有成员相乘的结果（宽乘高那个式子）。", acceptRegex: ["return\\s+\\w+_\\s*\\*\\s*\\w+_\\s*;"], acceptOn: "code", sample: "private:\n    double w_, h_;\npublic:\n    double area() const override { return w_ * h_; }", why: "零件锁在 private，孩子只能在自己的类里用它们；同一句 p->area() 走的就是这一条算法。" },
        { id: "q5", type: "code", score: 20, coversTask: 2, stem: "任务第 2 条：把 Circle 构造前面的 explicit 删掉，然后在 main 里按 Circle c = 3.0; 这种写法造一个圆 —— 这一行就是要你亲眼见它过不过。", acceptRegex: ["Circle\\s+\\w+\\s*=\\s*3\\.0\\s*;"], acceptOn: "code", sample: "Circle c = 3.0;   // 删掉 explicit 之后居然编译通过", why: "单参数构造不加 explicit 就成了一条隐式转换通道，编译器替你调用了一次构造；危险恰恰在于它能编译。" },
        { id: "q6", type: "code", score: 15, coversTask: 2, stem: "任务第 2 条：在这一行旁边用注释写下挂着 explicit 时和删掉之后各是什么反应（至少四个字，正则只验你写了注释）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 有 explicit 时这行报 no matching constructor，删掉 explicit 它一声不响地过了", why: "这是这块编辑器判不动的部分：两边的报错要你自己各跑一遍抄下来。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nclass Shape {\npublic:\n    virtual ~Shape() = default;\n    virtual double area() const = 0;\n};\n\nclass Circle : public Shape {\npublic:\n    Circle(double r) : r_(r) {}\n    double area() const override { return 3.14159265 * r_ * r_; }\nprivate:\n    double r_;\n};\n\nclass Rectangle : public Shape {\npublic:\n    Rectangle(double w, double h) : w_(w), h_(h) {}\n    double area() const override { return w_ * h_; }\nprivate:\n    double w_, h_;\n};\n\nint main() {\n    Circle c = 3.0;\n    Rectangle r(3.0, 4.0);\n    Shape* p = &r;\n    std::println(\"长方形 = {:.2f}\", p->area());\n    std::println(\"圆 = {:.2f}\", c.area());\n    return 0;\n}\n// 挂着 explicit 时 Circle c = 3.0 编译不过，删掉 explicit 它居然过了\n"],
        wrongs: [
          "",
          "#include <print>\n\nclass Shape {\npublic:\n    double area() const { return 0.0; }\n};\n\nclass Circle : public Shape {\npublic:\n    double area() const override { return 1.0; }\n};\n\nint main() {\n    Circle c;\n    std::println(\"{}\", c.area());\n    return 0;\n}\n",
          "#include <print>\n\nclass Shape {\npublic:\n    virtual double area() const = 0;\n};\n\nclass Rectangle : public Shape {\npublic:\n    Rectangle(double w, double h) : w_(w), h_(h) {}\n    double area() const override { return w_ + h_; }\nprivate:\n    double w_, h_;\n};\n\nint main() {\n    Rectangle r(2.0, 3.0);\n    std::println(\"{}\", r.area());\n    return 0;\n}\n"],
        loose: [
          "#  include < print >\n\nclass  Shape\n{\n  public :\n      virtual  double  area ( )  const  =  0 ;\n};\n\nclass  Circle : public Shape {\npublic:\n    Circle(double r) : r_(r) {}\n    double area() const override { return r_ * r_;\n    }\n};\n\nclass  Rectangle  :  public  Shape\n{\n  public :\n      Rectangle ( double wide , double high ) : a_(wide), b_(high) {}\n      double  area ( )  const  override { return a_ * b_; }\n  private :\n      double a_, b_;\n};\n\nint  main ( )\n{\n  Circle  cc = 3.0 ;\n  std::println(\"{}\", cc.area());\n  return 0;\n}\n// 挂着 explicit 那行报的是没有匹配的构造，删掉之后它就过了\n"]
      }
    },
    {
      cid: "m118", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 118 课考试 · 特殊五件套", task: "任务题目：把 ~Notebook() = default; 改成打印一句「打扫卫生」，跑一遍看 a 和 b 谁先析构，把输出的顺序抄下来跟自己对一遍", hint: "想不起来就回看本课【演示 2 · 让析构自己说话】与【演示 1 · 五件全交给编译器】。",
      notes: ["析构函数在对象离开作用域、被删掉时自动调用，负责还；成员都能自己管自己时，五件全写 = default。", "拷贝构造是拿另一个同类型的对象造一个新的：Notebook b = a;；拷贝赋值是把右边整个盖到一个已经存在的对象上：b = a;。", "移动构造与移动赋值的右边是个不要了的对象，东西直接搬过来，不用再造一份。", "内层作用域先结束，里面的那个对象就先析构，外层的后走 —— 屏幕上先出现的打扫话，属于先进圈的那个。", "成员是裸指针时默认拷贝会照抄地址：两份守的是同一块内存，这就是 = default 不能瞎用的一站。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "把这份程序写成能跑的形：把打印工具箱（#include <print>）搬进来，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n\nint main() {", why: "类写在 main 外面；析构要在对象离开作用域时自己跑，不用谁去叫。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "先立一个类：class 起头，private 里放一个 std::string 成员并在声明处直接给默认值。", acceptRegex: ["class\\s+\\w+", "std\\s*::\\s*string\\s+\\w+\\s*=\\s*\"[^\"]*\"\\s*;"], acceptOn: "code", sample: "class Notebook {\nprivate:\n    std::string owner_ = \"我\";", why: "成员都是这种自己会打扫的类型，五件套才能整件交给编译器。" },
        { id: "q3", type: "code", score: 25, coversTask: 1, stem: "任务第 1 条：把析构从 = default 改成会说话 —— 波浪号加类名那一句后面接函数体，里面用一条 println 把成员打出来。", acceptRegex: ["~\\w+\\s*\\(\\s*\\)\\s*\\{", "std\\s*::\\s*println\\s*\\("], acceptOn: "code", sample: "~Notebook() { std::println(\"打扫卫生：{} 的 {} 页\", owner_, pages_.size()); }", why: "析构负责还：谁离开作用域谁当场报名，屏幕上谁先出现就是谁先走。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "拷贝构造这件交给编译器：写一句收本类型 const 引用、后面直接 = default 的构造声明。", acceptRegex: ["\\w+\\s*\\(\\s*const\\s+\\w+\\s*&\\s*\\)\\s*=\\s*default\\s*;"], acceptOn: "code", sample: "Notebook(const Notebook&) = default;", why: "= default 是让编译器替你把每个成员各抄各的；成员能自己管自己时这样写最省事。" },
        { id: "q5", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：造一个对象，再另开一对花括号，在这个更小的作用域里用等号从它拷贝出第二个对象。", acceptRegex: ["\\n\\s*\\{[^{}]{0,200}\\w+\\s+\\w+\\s*=\\s*\\w+\\s*;"], acceptOn: "code", sample: "Notebook a;\n{\n    Notebook b = a;\n}", why: "等号左边是个新的名字，走的是拷贝构造；b 活的那一段比 a 短，正好看出谁先析构。" },
        { id: "q6", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：用一行注释写下你观察到的顺序：a、b 谁先析构（至少四个字，正则只验你写了注释）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 内层的 b 先打扫，外层的 a 等 main 结束才走：后造的先生还", why: "注释内容判不了；这一条只确认你把跑出来的顺序记下来了。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <string>\n#include <vector>\n\nclass Notebook {\npublic:\n    Notebook() = default;\n    Notebook(const Notebook&) = default;\n    ~Notebook() { std::println(\"打扫卫生：{} 的 {} 页\", owner_, pages_.size()); }\n    void add(const std::string& s) { pages_.push_back(s); }\nprivate:\n    std::string owner_ = \"我\";\n    std::vector<std::string> pages_;\n};\n\nint main() {\n    Notebook a;\n    a.add(\"C++\");\n    {\n        Notebook b = a;\n        b.add(\"数学\");\n        std::println(\"—— 内层作用域要结束了 ——\");\n    }\n    std::println(\"—— 外层 main 要结束了 ——\");\n    return 0;\n}\n// b 先打扫（它先离开作用域），a 要等 main 结束才走\n"],
        wrongs: [
          "",
          "#include <print>\n#include <string>\n\nclass Notebook {\npublic:\n    Notebook(const Notebook&) = default;\n    ~Notebook() = default;\n    int pages() const { return 0; }\nprivate:\n    std::string owner_ = \"我\";\n};\n\nint main() {\n    Notebook a;\n    Notebook b = a;\n    std::println(\"{}\", b.pages());\n    return 0;\n}\n",
          "#include <print>\n\nclass Box {\npublic:\n    ~Box() { std::println(\"走啦\"); }\nprivate:\n    int n_ = 0;\n};\n\nint main() {\n    Box x;\n    return 0;\n}\n"],
        loose: [
          "#  include < print >\n#  include < string >\n\nclass  Book\n{\n  public :\n      Book ( const Book & )  =  default ;\n      ~ Book ( ) { std::println(\"打扫 {}\", name_); }\n  private :\n      std :: string  name_ = \"本子\" ;\n};\n\nint  main ( )\n{\n  Book  outer ;\n  {\n      Book  inner = outer ;\n      std::println(\"内层要结束了\");\n  }\n  std::println(\"外层要结束了\");\n  return 0;\n}\n// 里层那个先打扫完，外层的最后才走\n"]
      }
    },
    {
      cid: "m119", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 119 课考试 · RAII 是什么", task: "任务题目：在 main 里加一层大括号，括号里再创建一个 Locker，先把自己猜的「还」的顺序写下来，再跑一遍跟输出对一遍", hint: "想不起来就回看本课【演示 2 · 加一层大括号，看清「还」的顺序】与【演示 3 · 中途 return，到底漏不漏】。",
      notes: ["RAII 的核心：把借写进构造函数、还把写进析构函数，而析构由编译器担保一定执行；智能指针就是这个做法写成库的版本。", "析构在它所在的那对大括号合上的那一刻当场执行；做成全局或静态对象，才会一路拖到 main 之后。", "靠记性的写法里，那条 if 就 return 的出口会漏还；靠对象的写法两条出口都从同一个作用域末端出去，析构守在那儿。", "本机实测的八行是：三声投币连着来，两声拔钥匙在格子合上时倒着走，最后才是外层的拔钥匙。", "名字只是给日志看的，它自己会打扫；真正不许抄的是那块借来的资源，所以拷贝构造要写 = delete。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "把这份程序写成能跑的形：把打印工具箱（#include <print>）搬进来，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n\nint main() {", why: "守卫对象的寿命写在源码的那对大括号里，析构调用就被插在格子合上的位置。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "写一个当柜子的类：class 起头，一个收 std::string 参数的构造（借）、一个 ~ 开头的析构（还），两处各用一条 println 报自己的名。", acceptRegex: ["class\\s+\\w+", "\\w+\\s*\\(\\s*(?:std\\s*::\\s*)?string\\s+\\w+\\s*\\)", "~\\w+\\s*\\(\\s*\\)", "std\\s*::\\s*println\\s*\\("], acceptOn: "code", sample: "class Locker {\npublic:\n    explicit Locker(std::string who) : who_(std::move(who)) {\n        std::println(\"{}：投币（构造=借资源）\", who_);\n    }\n    ~Locker() {\n        std::println(\"{}：拔钥匙（析构=还资源）\", who_);\n    }", why: "借写进构造、还写进析构，而析构由编译器担保一定执行 —— 靠对象而不是靠记性。" },
        { id: "q3", type: "code", score: 30, coversTask: 1, stem: "任务第 1 条：在 main 里先造一个守卫，再另起一行加一层大括号，在这个更小的作用域里再创建一个守卫对象（名字随你）。", acceptRegex: ["\\n\\s*\\{[^{}]{0,200}\\w+\\s+\\w+\\s*\\(\\s*\"", "\\w+\\s+\\w+\\s*\\(\\s*\""], acceptOn: "code", sample: "Locker x(\"外层\");\n{\n    Locker y(\"内层\");\n    Locker z(\"内层二号\");\n}", why: "多一层大括号就多一个主人：格子合上时里面那几个先还，外层的最后才走 —— 后借的先还。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "柜主只有一个，不许抄：把拷贝构造写成 = default 的反面 —— 收 const 引用、后面接 = delete; 的那一句声明。", acceptRegex: ["=\\s*delete\\s*;"], acceptOn: "code", sample: "Locker(const Locker&) = delete;", why: "抄了就会两个人守同一块资源，还的时候还两遍；不许抄才是柜子的脾气。" },
        { id: "q5", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：用一行注释写下你看到的还的顺序：内层那几个和外层那个谁先谁后（至少四个字，正则只验你写了注释）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 格子合上时内层二号先还、内层后还，外层的 x 等 main 结束才走", why: "顺序要靠跑一遍看屏幕；注释内容判不了，这一档只确认你把观察记下来了。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <string>\n#include <utility>\n\nclass Locker {\npublic:\n    explicit Locker(std::string who) : who_(std::move(who)) {\n        std::println(\"{}：投币，柜门开了（构造=借资源）\", who_);\n    }\n    ~Locker() {\n        std::println(\"{}：拔钥匙，柜门锁了（析构=还资源）\", who_);\n    }\n    Locker(const Locker&) = delete;\nprivate:\n    std::string who_;\n};\n\nint main() {\n    Locker x(\"外层\");\n    {\n        Locker y(\"内层\");\n        Locker z(\"内层二号\");\n        std::println(\"  ……内层干活……\");\n    }\n    std::println(\"  ……外层还在……\");\n    return 0;\n}\n// 格子合上时 z 先还、y 后还，外层的 x 等 main 结束才走：后借的先还\n"],
        wrongs: [
          "",
          "#include <print>\n#include <string>\n\nvoid borrow(const std::string& who) { std::println(\"{} 借\", who); }\nvoid give_back(const std::string& who) { std::println(\"{} 还\", who); }\n\nint main() {\n    borrow(\"小明\");\n    give_back(\"小明\");\n    return 0;\n}\n",
          "#include <print>\n#include <string>\n\nclass Locker {\npublic:\n    Locker(std::string who) { std::println(\"{} 借\", who); }\n    ~Locker() { std::println(\"拔钥匙\"); }\n};\n\nint main() {\n    Locker x(\"小明\");\n    return 0;\n}\n"],
        loose: [
          "#  include < print >\n#  include < string >\n\nclass  Guard\n{\n  public :\n      Guard ( string  tag ) { std::println(\"借 {}\", tag); }\n      ~ Guard ( ) { std::println(\"还\"); }\n      Guard ( const Guard & ) =  delete ;\n  private :\n      std :: string  tag_;\n};\n\nint  main ( )\n{\n  Guard  out(\"外\");\n  {\n      Guard  in(\"内\");\n      std::println(\"干活\");\n  }\n  return 0;\n}\n// 里层那个先说还，外层的排在后面\n"]
      }
    },
    {
      cid: "m120", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 120 课考试 · 手写一个 RAII 类", task: "任务题目：在 f.write(...) 之后加一句 return 0; 重新编译 —— 文件还会被关吗？先把猜的输出写下来，再跟本机跑出来的三行对一遍", hint: "想不起来就回看本课【演示 2 · 中途 return，还关不关】与【演示 3 · 封死拷贝，顺便看看打不开】。",
      notes: ["老的写法靠人记：出事就 return，忘关没人知道；缝成对象之后，无论从哪条出口离开，析构那一句必被执行。", "构造允许借不到：f_ 就是个空指针，每个用到它的地方先判一下，比当场翻脸更好教。", "抄一份就是两个主人守一个句柄：拷贝构造与拷贝赋值都要写成 = delete 才把这条路封死。", "先造的晚析构：两个守卫在同一格子里时，后创建的那个先打扫。", "写在格子外面的那行打印再也轮不到 —— 提前 return 跳出的是整个 main，不是那一层括号。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "把这份程序写成能跑的形：把文件工具箱（#include <cstdio>）搬进来，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*cstdio\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <cstdio>\n\nint main() {", why: "fopen、fclose、fputs 都带 std:: 前缀住在 cstdio 里；没有 main 就没入口。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条要用的那个类：写一个 class，构造里用 std::fopen 把文件借进来，并把裸指针放在成员位置、声明处直接给 nullptr。", acceptRegex: ["class\\s+\\w+", "fopen\\s*\\(", "FILE\\s*\\*\\s*\\w+\\s*=\\s*nullptr\\s*;"], acceptOn: "code", sample: "class FileGuard {\npublic:\n    explicit FileGuard(const char* path) : f_(std::fopen(path, \"w\")) {}\nprivate:\n    std::FILE* f_ = nullptr;", why: "裸指针藏进类里，外人碰不到它，就不会有人半路去 fclose 或者把它改成空。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "给这个类开一个 void 的 write 方法，参数是一个 const char 指针，里面用 std::fputs 把内容落地。", acceptRegex: ["void\\s+\\w+\\s*\\(\\s*const\\s+char\\s*\\*\\s*\\w+\\s*\\)", "fputs\\s*\\("], acceptOn: "code", sample: "void write(const char* s) { if (f_) std::fputs(s, f_); }", why: "构造允许借不到：f_ 可能就是空指针，所以每个用它的地方先判一下再动手。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "把还写进析构：写一个 ~ 开头、不带参数的析构函数，函数体里调 std::fclose 关掉那个句柄。", acceptRegex: ["~\\w+\\s*\\(\\s*\\)", "fclose\\s*\\("], acceptOn: "code", sample: "~FileGuard() {\n    if (f_) std::fclose(f_);\n    std::println(\"自动关闭\");\n}", why: "析构由编译器担保一定执行 —— 缝上这两下，文件的寿命就等于对象的寿命。" },
        { id: "q5", type: "code", score: 25, coversTask: 1, stem: "任务第 1 条：在 main 里另起一行开一层大括号，在里面造一个这个类的对象、调它的 write，紧跟一句 return 0; 从 main 跳出去。", acceptRegex: ["\\n\\s*\\{[^{}]{0,300}write\\s*\\([^)]*\\)\\s*;[^{}]{0,200}return\\s+0\\s*;", "\\w+\\s+\\w+\\s*\\(\\s*\""], acceptOn: "code", sample: "{\n    FileGuard f(\"/tmp/raii_demo.txt\");\n    f.write(\"hello raii\\n\");\n    return 0;\n}", why: "这一条要的是提前溜走那条出口：重新编译跑一遍，看自动关闭那句还在不在屏幕上。" },
        { id: "q6", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：用一行注释回答文件还会被关吗，以及写在括号外面的那一行打印还轮不轮得到（至少四个字）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 照样关：return 0 也是出作用域，析构那句 fclose 跑了，格子外面那行打印轮不到", why: "注释内容判不了；这一档只确认你把跑出来的结论写下来了。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <cstdio>\n\nclass FileGuard {\npublic:\n    explicit FileGuard(const char* path) : f_(std::fopen(path, \"w\")) {\n        std::println(\"打开 {}\", path);\n    }\n    ~FileGuard() {\n        if (f_) std::fclose(f_);\n        std::println(\"自动关闭\");\n    }\n    void write(const char* s) { if (f_) std::fputs(s, f_); }\nprivate:\n    std::FILE* f_ = nullptr;\n};\n\nint main() {\n    {\n        FileGuard f(\"/tmp/raii_demo.txt\");\n        f.write(\"hello raii\\n\");\n        std::println(\"提前走人的那条出口\");\n        return 0;\n    }\n    std::println(\"已离开作用域\");\n    return 0;\n}\n// 照样关：return 0 也是出作用域，析构里那句 fclose 跑了，格子外面那行轮不到\n"],
        wrongs: [
          "",
          "#include <print>\n#include <cstdio>\n\nint main() {\n    std::FILE* f = std::fopen(\"/tmp/x.txt\", \"w\");\n    std::fputs(\"hi\", f);\n    return 0;\n}\n",
          "#include <print>\n#include <cstdio>\n\nclass FileGuard {\npublic:\n    std::FILE* f;\n    FileGuard(const char* path) { f = std::fopen(path, \"w\"); }\n    void write(const char* s) { std::fputs(s, f); }\n};\n\nint main() {\n    FileGuard g(\"/tmp/x.txt\");\n    g.write(\"hi\\n\");\n    std::println(\"没有析构，句柄就这么丢了\");\n    return 0;\n}\n"],
        loose: [
          "#  include < cstdio >\n#  include < print >\n\nclass  Holder\n{\n  public :\n      Holder ( const char * path ) { handle = std::fopen(path, \"w\"); }\n      ~ Holder ( ) { if ( handle ) std::fclose( handle ); std::println(\"关了\"); }\n      void  write ( const char * s ) { if (handle) std::fputs(s, handle); }\n  private :\n      std :: FILE *  handle = nullptr;\n};\n\nint  main ( )\n{\n  {\n      Holder  g(\"/tmp/demo.txt\");\n      g.write(\"hi\\n\");\n      return 0;\n  }\n  std::println(\"轮不到这行\");\n}\n// 文件还是关了，因为 return 也要出作用域，格子外那行没打出来\n"]
      }
    },
  ]
};
