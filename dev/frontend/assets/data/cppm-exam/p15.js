/* 喵站 · C++ 掌握 考卷分部 p15：第 133–136 课（第九轮）
 * 契约照 p10：每题分数合计正好 100、源稿每条任务都有题 coversTask 对着、
 * 带 coversTask 的题合计 ≥50 分、每题带 why、refs 判 100 / wrongs 判 <60 / loose 判 ≥60。
 * 四份源稿各只有 1 条【任务】，所以 coversTask 一律是 1。
 * 所有 output 题的 acceptLines 都是本机 g++ -std=c++23 实跑抄下来的行；
 * 第 136 课的耗时行只在「打印移动耗时」这一档是稳定的 0，复制那行受负载影响，
 * 所以任务题出在「改哪一行」与「怎么读那个 0」上，不出在背数字上。
 */
window.MIAO_CPPM_EXAM_P15 = {
  papers: [
    {
      cid: "m133", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, task: "任务题目：用 std::string 重做一遍复制与移动的实验 —— 搬空之后把原字符串的内容打印出来；先猜 a 会打印成什么，再跑", hint: "想不起来就回看本课【演示 2 · 本课任务：换成 std::string 重做，打印原件内容】与【演示 3 · 空壳不是报废】。",
      notes: ["std::move 一个字节都不搬，它只是把对象标成「我可以不要了」，真动手的是接收那一头。", "被搬空的原件标准只承诺有效但未指定：能安全析构、能重新装，里面是什么不能当回事。", "对 const 对象写 std::move，实测还是会走复制，原件一个字节都没搬走。", "移动划算的前提是对象自己管着一大块内存、而且原件确实不再用；搬 int 这种小东西通常并不比复制省。", "空壳不是报废：搬空之后再往里装，照样能重新用起来。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "把这份程序写成能跑的形：把字符串盒子和交接工具箱都搬进来（#include），再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*string\\s*>", "#\\s*include\\s*<\\s*utility\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n#include <string>\n#include <utility>\n\nint main() {", why: "std::move 住在 utility 里，std::string 住在 string 里，缺哪个都没人认。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "开一格 std::string 装一大串同样的字符（个数要给得多一点，才看得出搬的是内存不是内容）。", acceptRegex: ["\\bstd\\s*::\\s*string\\s+[A-Za-z_]\\w*\\s*\\(\\s*\\d{3,}\\s*,"], acceptOn: "code", sample: "std::string a(5000, 'x');", why: "个数给到几千，字符串自己管着一大块内存，这一课的比较才有意义。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "写一次复制：再开一格 std::string，直接拿原件赋值给它。", acceptRegex: ["\\bstd\\s*::\\s*string\\s+[A-Za-z_]\\w*\\s*=\\s*[A-Za-z_]\\w*\\s*;"], acceptOn: "code", sample: "std::string b = a;", why: "等号右边光是一个名字，走的是复制：另买一块内存逐个抄，原件照旧用。" },
        { id: "q4", type: "code", score: 25, coversTask: 1, stem: "写一次移动：再开一格 std::string，赋值时对原件用 std::move。", acceptRegex: ["\\bstd\\s*::\\s*string\\s+[A-Za-z_]\\w*\\s*=\\s*std\\s*::\\s*move\\s*\\("], acceptOn: "code", sample: "std::string c = std::move(a);", why: "那一块内存换个主人，一格字符都没动；被搬空的原件是合法的空串，不是垃圾值。" },
        { id: "q5", type: "code", score: 15, coversTask: 1, stem: "用一条 std::println 打复制件：占位坑里既给它的个数（size），也给它前几个字符（substr）。", acceptRegex: ["std\\s*::\\s*println\\s*\\([^;]*\\.\\s*size\\s*\\(", "std\\s*::\\s*println\\s*\\([^;]*\\.\\s*substr\\s*\\("], acceptOn: "code", sample: "std::println(\"b 有 {} 个，前三个是「{}」\", b.size(), b.substr(0, 3));", why: "复制件该有五千个字符、开头也是那串 x —— 它跟原件一样新。" },
        { id: "q6", type: "code", score: 15, coversTask: 1, stem: "用一条 std::println 打被搬空的原件：两个占位坑按顺序给它的个数和它本身。", acceptRegex: ["\"[^\"]*\\{\\}[^\"]*\\{\\}[^\"]*\"\\s*,\\s*([A-Za-z_]\\w*)\\s*\\.\\s*size\\s*\\(\\s*\\)\\s*,\\s*\\1\\s*\\)"], acceptOn: "code", sample: "std::println(\"a 剩 {} 个，内容是「{}」\", a.size(), a);", why: "这一条正是任务要你亲眼确认的：搬完之后原件是 0 个、内容是空，它仍然能安全打印。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <string>\n#include <utility>\n\nint main() {\n    std::string a(5000, 'x');\n    std::string b = a;\n    std::string c = std::move(a);\n    std::println(\"b 有 {} 个，前三个是「{}」\", b.size(), b.substr(0, 3));\n    std::println(\"c 有 {} 个，前三个是「{}」\", c.size(), c.substr(0, 3));\n    std::println(\"a 剩 {} 个，内容是「{}」\", a.size(), a);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <string>\n\nint main() {\n    std::string a(5, 'x');\n    std::string b = a;\n    std::println(\"{}\", b);\n    return 0;\n}\n",
          "#include <print>\n#include <string>\n#include <utility>\n\nint main() {\n    std::string a(5000, 'x');\n    std::string b = a;\n    std::string c = a;\n    std::println(\"b {}\", b.size());\n    return 0;\n}\n"],
        loose: [
          "#  include < print >\n#  include < string >\n#  include < utility >\nint  main ( )\n{\n  std :: string big ( 8000 , 'z' ) ;\n  std :: string copy1 = big ;\n  std :: string taken = std :: move ( big ) ;\n  std :: println ( \"复制 {} 个 {}\" , copy1 . size ( ) , copy1 . substr ( 0 , 2 ) ) ;\n  std :: println ( \"原件剩 {} 个 {}\" , big . size ( ) , big ) ;\n}\n"]
      }
    },
    {
      cid: "m134", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, task: "任务题目：给 Tracker 补写析构函数打印「打扫」，跑一遍看 a、b、c 的打扫顺序，并说清最后一行为为什么是空的", hint: "想不起来就回看本课【演示 2 · 本课任务：加一句析构，数清打扫顺序】与【演示 3】那两组输出。",
      notes: ["移动构造的参数恰恰不能有 const：搬走要把原件手里那块内存抹空，带了 const 这一行只能退回拷贝构造。", "类里只写移动构造、不写拷贝构造，一句 Tracker b = a; 会在编译期被拒 —— 几件套要成套写。", "搬空不等于销毁：对象本身还活着，退出作用域时它的析构照跑一遍。", "noexcept 管的是别人敢不敢用这扇门，不管这一行能不能编译；删掉它程序照样算对，只是慢。", "名字上的疤就是路径的证据：容器里出现甲的复印件的复印件，说明那一行走过的是拷贝。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：给 Tracker 补一行析构，里面用 std::println 把「打扫」和 name_ 一起打出来。", acceptRegex: ["~\\s*Tracker\\s*\\(\\s*\\)", "std\\s*::\\s*println\\s*\\([^;]*打扫"], acceptOn: "code", sample: "~Tracker() { std::println(\"  [打扫] 「{}」\", name_); }", why: "打扫按出生的反序走：先 c、再 b、最后 a；轮到 a 时它手里已经没有内存，名字也就是空的。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "写出拷贝构造那扇门：参数是一只只读的 const Tracker 引用。", acceptRegex: ["Tracker\\s*\\(\\s*const\\s+Tracker\\s*&"], acceptOn: "code", sample: "Tracker(const Tracker& o) : name_(o.name_ + \"的复印件\") {", why: "拷贝构造必须有 const：原件要完好，它只负责照着抄一份。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "写出移动构造那扇门：参数是 Tracker&& 那种右值引用，后面把 noexcept 写上。", acceptRegex: ["Tracker\\s*\\(\\s*Tracker\\s*&&\\s*\\w*\\s*\\)\\s*noexcept"], acceptOn: "code", sample: "Tracker(Tracker&& o) noexcept : name_(std::move(o.name_)) {", why: "&& 读作右值引用，专接可以搬走的东西；恰恰不能带 const，因为这一行要写原件。noexcept 别省，它管的是容器敢不敢用这扇门。" },
        { id: "q4", type: "code", score: 20, coversTask: 1, stem: "在 main 里写一句移动交接：新的一格 Tracker，右边对 a 用 std::move。", acceptRegex: ["\\bTracker\\s+\\w+\\s*=\\s*std\\s*::\\s*move\\s*\\("], acceptOn: "code", sample: "Tracker c = std::move(a);", why: "这一句走的是移动构造那扇门，a 被抹成空壳，但析构照样轮到它跑一遍。" },
        { id: "q5", type: "code", score: 20, stem: "把 Tracker 装进容器观察一次：开一个 std::vector<Tracker>，用 push_back 往里放两格。", acceptRegex: ["std\\s*::\\s*vector\\s*<\\s*Tracker\\s*>", "\\.\\s*push_back\\s*\\("], acceptOn: "code", sample: "std::vector<Tracker> v;\nv.push_back(Tracker(\"甲\"));\nv.push_back(Tracker(\"乙\"));", why: "容器换那块更大的内存时才轮得到 noexcept：写上它全是移动，删掉它就退回拷贝，结果仍对只是慢。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <string>\n#include <utility>\n#include <vector>\n\nclass Tracker {\npublic:\n    explicit Tracker(std::string name) : name_(std::move(name)) {}\n    ~Tracker() { std::println(\"  [打扫] 「{}」\", name_); }\n    Tracker(const Tracker& o) : name_(o.name_ + \"的复印件\") {\n        std::println(\"  [拷贝] 抄了一份 {}\", o.name_);\n    }\n    Tracker(Tracker&& o) noexcept : name_(std::move(o.name_)) {\n        std::println(\"  [移动] 整屋搬走 {}\", name_);\n    }\n    const std::string& name() const { return name_; }\nprivate:\n    std::string name_;\n};\n\nint main() {\n    Tracker a(\"A\");\n    Tracker b = a;\n    Tracker c = std::move(a);\n    std::println(\"b = {}, c = {}\", b.name(), c.name());\n    std::vector<Tracker> v;\n    v.push_back(Tracker(\"甲\"));\n    v.push_back(Tracker(\"乙\"));\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <string>\n\nclass Tracker {\npublic:\n    explicit Tracker(std::string name) : name_(std::move(name)) {}\n    Tracker(const Tracker& o) : name_(o.name_) { }\n    const std::string& name() const { return name_; }\nprivate:\n    std::string name_;\n};\n\nint main() {\n    Tracker a(\"A\");\n    Tracker b = a;\n    std::println(\"{}\", b.name());\n    return 0;\n}\n",
          "#include <print>\n#include <string>\n#include <utility>\n\nclass Tracker {\npublic:\n    explicit Tracker(std::string name) : name_(std::move(name)) {}\n    Tracker(const Tracker& o) : name_(o.name_) {}\n    Tracker(Tracker&& o) : name_(std::move(o.name_)) {}\nprivate:\n    std::string name_;\n};\n\nint main() {\n    Tracker a(\"A\");\n    return 0;\n}\n"],
        loose: [
          "#  include < print >\n#  include < string >\n#  include < utility >\n#  include < vector >\n\nclass Tracker {\n  public:\n  explicit Tracker ( std :: string name ) : name_ ( std :: move ( name ) ) { }\n  Tracker ( const Tracker & o ) : name_ ( o . name_ ) { }\n  ~ Tracker ( ) { std :: println ( \"  [打扫] {}\" , name_ ) ; }\n  Tracker ( Tracker && o ) noexcept : name_ ( std :: move ( o . name_ ) ) { }\n  const std :: string & name ( ) const { return name_ ; }\n  private:\n  std :: string name_ ;\n} ;\n\nint  main ( )\n{\n  Tracker first ( \"A\" ) ;\n  Tracker second = first ;\n  Tracker  taken = std :: move ( first ) ;\n  std :: vector < Tracker > box ;\n  box . push_back ( Tracker ( \"甲\" ) ) ;\n  box . push_back ( Tracker ( \"乙\" ) ) ;\n}\n"]
      }
    },
    {
      cid: "m135", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, task: "任务题目：在 by_value 里改 s 试试能不能过；再到 by_const_ref 里改同一句，看编译器拦不拦，把报错那两句读顺", hint: "想不起来就回看本课【演示 2 · 本课任务：往两个函数里各改一句】与【演示 3 · 三种传法各调一次，让类自己数】。",
      notes: ["传值那个参数是一个新对象：每调一次申请一块内存把整串抄进去，返回时打扫掉，调一万次就抄一万次。", "从输出上根本看不出传值多抄了一份，这正是本课要治的病；类里那一嗓子没响，才是零抄写的证据。", "只读原件就写 const 引用，要改原件就写非 const 引用，明确不要原件了就写值并在调用处配 std::move。", "八个字节的小东西传值更快，一律写 const 引用反而多一道间接；那条口诀管的是自己管内存的大对象。", "编译器不拦昂贵的写法，是因为传值在语言里完全合法：它只拦越界和写只读这类违背承诺的动作。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "写一个传值的函数：括号里的参数就写成 std::string 加一个名字，不带 & 也不带 const。", acceptRegex: ["void\\s+\\w+\\s*\\(\\s*std\\s*::\\s*string\\s+\\w+\\s*\\)"], acceptOn: "code", sample: "void by_value(std::string s) {", why: "参数不带 & 就是一个新对象：每调一次抄一份，返回时再把它打扫掉。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "再写一个只读的函数：参数写成 const std::string& 加一个名字。", acceptRegex: ["void\\s+\\w+\\s*\\(\\s*const\\s+std\\s*::\\s*string\\s*&"], acceptOn: "code", sample: "void by_const_ref(const std::string& s) {", why: "const 引用是只读的手：零抄写，只看不改，这个承诺由编译器在编译期验收。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条前半：在传值那个函数的身体里，对参数用 += 接上一段文字。这一版要能编译过。", acceptRegex: ["void\\s+\\w+\\s*\\(\\s*std\\s*::\\s*string\\s+\\w+\\s*\\)\\s*\\{[^}]*\\+="], acceptOn: "code", sample: "void by_value(std::string s) {\n    s += \"再加一句\";\n}", why: "改的是这份副本，原件照旧，所以合法 —— 代价是那一遍抄写。" },
        { id: "q4", type: "code", score: 25, coversTask: 1, stem: "任务第 1 条后半：在只读那个函数的身体里把同一句 += 也写出来（它编译不过，就是要你亲眼见），再在旁边跟一行注释，写下报错里出现的那个词。", acceptRegex: ["void\\s+\\w+\\s*\\(\\s*const\\s+std\\s*::\\s*string\\s*&\\s*\\w+\\s*\\)\\s*\\{[^}]*\\+=", "//[^\\n]{4,}"], acceptOn: "buffer", sample: "void by_const_ref(const std::string& s) {\n    s += \"再加一句\";   // 报错第一行说 no match for operator+=\n}", why: "拦的是写这个动作：const 引用不许 +=，但读它的个数、拿去比较都合法。这一条只能判到「报错那行注释写了」，注释内容对不对判不了。" },
        { id: "q5", type: "code", score: 25, stem: "在 main 里调用传值那个函数一次，调用处对原件配一个 std::move：这一档连抄写都省了，原件当场空掉。", acceptRegex: ["\\w+\\s*\\(\\s*std\\s*::\\s*move\\s*\\(\\s*\\w+\\s*\\)\\s*\\)\\s*;"], acceptOn: "code", sample: "by_value(std::move(long_text));", why: "明确不要原件了，就传值配 std::move：整屋搬走，调用者之后不该再拿原件干活。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <string>\n\nvoid by_value(std::string s) {\n    s += \"再加一句\";\n    std::println(\"  传值改完: {}\", s);\n}\n\nvoid by_const_ref(const std::string& s) {\n    s += \"再加一句\";   // 报错第一行说 no match for operator+=\n    std::println(\"  传引用改完: {}\", s);\n}\n\nint main() {\n    std::string long_text = \"这是一条很长的弹幕……\";\n    by_value(long_text);\n    by_const_ref(long_text);\n    by_value(std::move(long_text));\n    std::println(\"原件还在: {}\", long_text);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <string>\n\nvoid show(std::string s) {\n    std::println(\"{}\", s);\n}\n\nint main() {\n    std::string text = \"弹幕\";\n    show(text);\n    return 0;\n}\n",
          "#include <print>\n#include <string>\n\nvoid by_value(std::string s) {\n    std::println(\"{}\", s);\n}\nvoid by_const_ref(const std::string& s) {\n    std::println(\"{}\", s.size());\n}\n\nint main() {\n    std::string t = \"a\";\n    by_value(t);\n    by_const_ref(t);\n    return 0;\n}\n"],
        loose: [
          "#  include < print >\n#  include < string >\nvoid  take_by_copy ( std :: string  buf )\n{\n  buf  +=  \"追加一点东西\" ;\n  std :: println ( \"  {}\" , buf ) ;\n}\nvoid  look_only ( const std :: string &  buf )\n{\n  buf  +=  \"追加一点东西\" ;  // 编译器说不许写只读的东西\n  std :: println ( \"  {}\" , buf ) ;\n}\nint  main ( )\n{\n  std :: string  line  =  \"很长的一段字\" ;\n  take_by_copy ( line ) ;\n  look_only ( line ) ;\n  take_by_copy ( std :: move ( line ) ) ;\n}\n"]
      }
    },
    {
      cid: "m136", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, task: "任务题目：把演示 1 里的元素从一百万个改成一千个再跑一次，看移动那一行是不是依旧几乎是 0，并说清复制那行为什么跟着缩", hint: "想不起来就回看本课【演示 2 · 本课任务：把元素改成一千个再跑】与【演示 3 · 换成纳秒：0 不见了】。",
      notes: ["steady 说的是这个钟只朝前走、不会因为系统时间被调而倒退；问现在几点是另一个钟的事。", "微秒刻度下移动是 0，这个 0 只等于它低于这把尺子的最小刻度，不等于没有成本。", "复制的账按元素个数走，个数缩一千倍它就跟着缩；移动从不看元素个数，所以一动不动。", "同一份程序连跑几次、报中间那个，并把摆差一起说出来；第一次冷跑的数字先丢掉。", "本机这组数字只是同一台机器上的一次实测，不能当常数抄进文档；加不加 -O2，数字都在同一档。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "按下秒表两次：用 std::chrono::steady_clock::now() 各取一个时刻，中间夹住要量的活儿。", acceptRegex: ["std\\s*::\\s*chrono\\s*::\\s*steady_clock\\s*::\\s*now\\s*\\(\\s*\\)[\\s\\S]*?std\\s*::\\s*chrono\\s*::\\s*steady_clock\\s*::\\s*now\\s*\\("], acceptOn: "code", sample: "auto t1 = std::chrono::steady_clock::now();\nstd::vector<int> copy = big;\nauto t2 = std::chrono::steady_clock::now();", why: "两个 now 紧贴着要量的活儿，别把 println 夹在中间；steady 说的是这个钟只朝前走，量隔了多久该用它。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：把那一千个元素的 vector 写出来（元素个数写一千，带撇的写法也算）。", acceptRegex: ["std\\s*::\\s*vector\\s*<\\s*int\\s*>\\s+\\w+\\s*\\(\\s*1'?0{3}\\s*,"], acceptOn: "code", sample: "std::vector<int> big(1000, 1);", why: "这一跑的关键就是这个数字：百万元素缩成一千个，复制的账跟着缩一千倍。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "写一格复制：新的 std::vector<int> 直接拿原件赋值。", acceptRegex: ["std\\s*::\\s*vector\\s*<\\s*int\\s*>\\s+\\w+\\s*=\\s*\\w+\\s*;"], acceptOn: "code", sample: "std::vector<int> copy = big;", why: "复制要新申请一块内存逐个抄，个数多少直接写在这一档的耗时里。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "写一格移动：新的 std::vector<int> 赋值时对原件用 std::move。", acceptRegex: ["std\\s*::\\s*vector\\s*<\\s*int\\s*>\\s+\\w+\\s*=\\s*std\\s*::\\s*move\\s*\\("], acceptOn: "code", sample: "std::vector<int> moved = std::move(big);", why: "移动只交接手里那几根指针，从不看元素个数，所以个数怎么改它都一动不动。" },
        { id: "q5", type: "code", score: 20, coversTask: 1, stem: "把两个时刻相减换算成微秒，再取那个数：用 std::chrono::duration_cast 配上 count()。", acceptRegex: ["duration_cast\\s*<[^>]*>\\s*\\(\\s*\\w+\\s*-\\s*\\w+\\s*\\)", "\\.\\s*count\\s*\\("], acceptOn: "code", sample: "return std::chrono::duration_cast<std::chrono::microseconds>(b - a).count();", why: "两时刻相减是一个 duration，duration_cast 换成微秒刻度，count() 才取出那个数。" },
        { id: "q6", type: "code", score: 15, coversTask: 1, stem: "用一条 std::println 打移动那一档：格式串里带「微秒」，参数按顺序给那一格的元素个数；再在旁边写一行注释，记下你实测到的那个数。", acceptRegex: ["std\\s*::\\s*println\\s*\\(\\s*\"[^\"]*微秒[^\"]*\"\\s*,\\s*\\w+\\s*\\.\\s*size\\s*\\(", "//[^\\n]{4,}"], acceptOn: "buffer", sample: "std::println(\"移动 {} 个元素耗时 {} 微秒\", moved.size(), diff_us(t2, t3));   // 一千个元素，移动这一行还是一微秒都不到", why: "这一条判的是那句打印和「你确实记了一行」；你记的数字对不对这块编辑器判不动，本机实测是 0 微秒 —— 那只是低于尺子的最小刻度，纳秒下是几十到一百多纳秒。" }
      ],
      selftest: {
        refs: [
          "#include <chrono>\n#include <print>\n#include <vector>\n#include <utility>\n\nlong diff_us(std::chrono::steady_clock::time_point a,\n             std::chrono::steady_clock::time_point b) {\n    return std::chrono::duration_cast<std::chrono::microseconds>(b - a).count();\n}\n\nint main() {\n    std::vector<int> big(1000, 1);\n    auto t1 = std::chrono::steady_clock::now();\n    std::vector<int> copy = big;\n    auto t2 = std::chrono::steady_clock::now();\n    std::vector<int> moved = std::move(big);\n    auto t3 = std::chrono::steady_clock::now();\n    std::println(\"复制 {} 个元素耗时 {} 微秒\", copy.size(), diff_us(t1, t2));\n    std::println(\"移动 {} 个元素耗时 {} 微秒\", moved.size(), diff_us(t2, t3));   // 一千个元素这一跑，移动那一行还是 0\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <vector>\n#include <utility>\n\nint main() {\n    std::vector<int> big(1000000, 1);\n    std::vector<int> copy = big;\n    std::println(\"{}\", copy.size());\n    return 0;\n}\n",
          "#include <chrono>\n#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> big(1000, 1);\n    auto t1 = std::chrono::steady_clock::now();\n    auto t2 = std::chrono::steady_clock::now();\n    std::println(\"耗时 {} 微秒\", std::chrono::duration_cast<std::chrono::microseconds>(t2 - t1).count());\n    return 0;\n}\n"],
        loose: [
          "#  include < chrono >\n#  include < print >\n#  include < vector >\n#  include < utility >\n\nlong  us_between ( std :: chrono :: steady_clock :: time_point  p ,\n                   std :: chrono :: steady_clock :: time_point  q )\n{\n  return std :: chrono :: duration_cast < std :: chrono :: microseconds > ( q - p ) . count ( ) ;\n}\n\nint  main ( )\n{\n  std :: vector < int >  data ( 1000 , 7 ) ;\n  auto  s1  =  std :: chrono :: steady_clock :: now ( ) ;\n  std :: vector < int >  dup  =  data ;\n  auto  s2  =  std :: chrono :: steady_clock :: now ( ) ;\n  std :: vector < int >  handed  =  std :: move ( data ) ;\n  auto  s3  =  std :: chrono :: steady_clock :: now ( ) ;\n  std :: println ( \"dup {} 个 用了 {} 微秒\" , dup . size ( ) , us_between ( s1 , s2 ) ) ;\n  std :: println ( \"handed {} 个 用了 {} 微秒\" , handed . size ( ) , us_between ( s2 , s3 ) ) ;\n  // 一千个元素这一跑，复制落到一两微秒，移动照旧是 0\n}\n"]
      }
    },
  ]
};
