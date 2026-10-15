/* 喵站 · C++ 掌握 考卷分部 p13：第 125–128 课
 * 契约与各场一致：权重和 100、任务逐条 coversTask、带任务的题合计过 50、
 * selftest 里 refs 判 100、wrongs 判不到 60、loose 判过 60。
 * 题干只用读者到对应课为止见过的东西：m125、m126 两场里不出现 std::optional —— 那是第 127 课才放行的。
 */
window.MIAO_CPPM_EXAM_P13 = {
  papers: [
    {
      cid: "m125", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 125 课考试 · unique_ptr 链表与自动释放", task: "任务题目：在尾部再接一个节点 4，重新编译运行，看遍历输出；并说清 reset 之后整条链是怎么被一格一格释放的", hint: "回看本课【演示 1 · 串起来，再走一遍】【演示 2 · 删头 = 整条链自动释放】和【演示 3 · 链太长会怎样】。",
      notes: ["裸指针链表 new 出来必须记着逐个 delete，删中间节点还要手动补前一个的 next；换成 unique_ptr 之后忘了也没人骂你。", "next 是 std::unique_ptr 时，所有权沿链单向传下去：这个节点析构就把下一个一并处置掉。", "head.reset() 一行 delete 都没写就把整条链还干净：那是推倒第一张骨牌，后面的跟着自己倒。", "只有 reset 和整链销毁，谈不上顺序问题；delete 顺序错了留下的悬垂指针这一路碰不到。", "这条自动释放的链在特别长时藏着代价：多米诺的递归深度等于链长，一百万个节点 reset 时那一行永远走不到。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "把这份程序写成能跑的形：把独占指针工具箱（#include <memory>）搬进来，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*memory\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <memory>\n\nint main() {", why: "unique_ptr 与 make_unique 住在 memory 里；没有 main 就没入口。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条的图纸：写一个 struct Node，里面一个装 int 的成员，再加一个下一节点的 std::unique_ptr 成员。", acceptRegex: ["struct\\s+\\w+", "unique_ptr\\s*<\\s*(?:std\\s*::\\s*)?\\w+\\s*>\\s+\\w+"], acceptOn: "code", sample: "struct Node {\n    int value;\n    std::unique_ptr<Node> next;\n    explicit Node(int v) : value(v) {}\n};", why: "next 不再是「指向」而是「拥有」：这个节点被析构时把下一个也一并处置掉。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：先把链串起来 —— 用 make_unique 造头一节（值给 1），再对 next 赋值接上后面的节点。", acceptRegex: ["make_unique\\s*<\\s*(?:std\\s*::\\s*)?\\w+\\s*>\\s*\\(\\s*1\\s*\\)", "->\\s*next\\s*=\\s*std\\s*::\\s*make_unique"], acceptOn: "code", sample: "auto head = std::make_unique<Node>(1);\nhead->next = std::make_unique<Node>(2);\nhead->next->next = std::make_unique<Node>(3);", why: "对 next 赋值就是转移，旧的那条自动释放；全程没写一个 delete。" },
        { id: "q4", type: "code", score: 25, coversTask: 1, stem: "任务第 1 条：在尾部再接一个值为 4 的节点 —— 一路写到底那一格的 next，再把它赋成 std::make_unique 造出来的 4 号。", acceptRegex: ["next\\s*->\\s*next\\s*->\\s*next\\s*=\\s*std\\s*::\\s*make_unique", "make_unique\\s*<\\s*(?:std\\s*::\\s*)?\\w+\\s*>\\s*\\(\\s*4\\s*\\)"], acceptOn: "code", sample: "head->next->next->next = std::make_unique<Node>(4);", why: "第四格的 next 原本是空的 unique_ptr，接上新节点之后它才不再是尾巴。" },
        { id: "q5", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：走一遍这条链 —— 一条 for，观察指针用 get() 起步，条件是不等于 nullptr，每轮往前挪一格也用 next.get()。", acceptRegex: ["for\\s*\\(\\s*\\w+\\s*\\*\\s*\\w+\\s*=", "!=\\s*nullptr", "->\\s*next\\.get\\s*\\(\\s*\\)"], acceptOn: "code", sample: "for (Node* c = head.get(); c != nullptr; c = c->next.get())\n    std::print(\"{} → \", c->value);", why: "到头那一格交出的是 nullptr，循环自己收住，不用你写判断尾巴的 if。" },
        { id: "q6", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：圈里备一个从 0 起步的 int 计数器，每走过一节加一，走完了用一条 println 把走了几个节点报出来。", acceptRegex: ["int\\s+\\w+\\s*=\\s*0\\s*;", "\\+\\+\\s*\\w+\\s*;", "std\\s*::\\s*println\\s*\\("], acceptOn: "code", sample: "int count = 0;\n++count;\nstd::println(\"到头了，一共走过 {} 个节点\", count);", why: "接上 4 号之后这一行应该从 3 变成 4 —— 这就是任务要你重跑对照的输出。" }
      ],
      selftest: {
        refs: [
          "#include <memory>\n#include <print>\n\nstruct Node {\n    int value;\n    std::unique_ptr<Node> next;\n    explicit Node(int v) : value(v) {}\n};\n\nint main() {\n    auto head = std::make_unique<Node>(1);\n    head->next = std::make_unique<Node>(2);\n    head->next->next = std::make_unique<Node>(3);\n    head->next->next->next = std::make_unique<Node>(4);\n    int count = 0;\n    for (Node* c = head.get(); c != nullptr; c = c->next.get()) {\n        std::print(\"{} → \", c->value);\n        ++count;\n    }\n    std::println(\"到头了，一共走过 {} 个节点\", count);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n\nstruct Node { int value; Node* next; Node(int v) : value(v) { next = nullptr; } };\n\nint main() {\n    Node a(1);\n    Node b(2);\n    a.next = &b;\n    for (Node* c = &a; c != nullptr; c = c->next) std::print(\"{} \", c->value);\n    std::println(\"\");\n    return 0;\n}\n",
          "#include <memory>\n#include <print>\n\nstruct Node { int value; std::unique_ptr<Node> next; explicit Node(int v) : value(v) {} };\n\nint main() {\n    auto head = std::make_unique<Node>(1);\n    std::println(\"{}\", head->value);\n    return 0;\n}\n"],
        loose: [
          "#  include < memory >\n#  include < print >\n\nstruct  Node\n{\n  int  data ;\n  std :: unique_ptr < Node >  next ;\n  Node ( int v ) : data ( v ) { }\n};\n\nint  main ( )\n{\n  auto  top = std :: make_unique < Node > ( 1 ) ;\n  top -> next = std::make_unique<Node>(2);\n  top->next->next = std::make_unique<Node>(3);\n  top -> next -> next -> next = std::make_unique<Node>( 4 );\n  int  walked = 0;\n  for ( Node * cur = top.get(); cur != nullptr; cur = cur -> next.get ( ) ) {\n      std::print(\"{} | \", cur->data);\n      ++ walked ;\n  }\n  std::println(\"一共 {} 节\", walked);\n  return 0;\n}\n"]
      }
    },
    {
      cid: "m126", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 126 课考试 · 魔法值与暗号的害处", task: "任务题目：想清楚编译器为什么不提醒「你忘了检查 -1」，它知不知道 -1 是暗号；再用「返回 bool 加引用参数」把两个信息分开", hint: "回看【演示 1 · 忘检查的人会走到哪一步】【演示 2 · 暗号撞上真数据】【演示 3 · 现有工具里最好的一步】。",
      notes: ["暗号写在人脑里、靠注释靠自觉；写进类型的话编译器看得见，不处理就过不去。", "每个函数各定一套暗号，正常数据还可能正好撞上暗号 —— 零下 1 度是正经读数，跟「没有」撞在一起就分不开了。", "没找到时那个返回值是 -1，拿它当下标读越到了名单外面：这是运行期捅出来的娄子，不是语法错误。", "现有工具里最好的一步是返回 bool 把结果用引用参数带出来，或者让返回值自带「有」与「没有」两格状态。", "把返回值转成下标那一步要写 static_cast<int>(i)，因为 size_t 与 int 是两回事。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "把这份程序写成能跑的形：把数组工具箱（#include <vector>）搬进来，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*vector\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <vector>\n\nint main() {", why: "查找要有名单可查：vector 的 size 与下标这一套都在 vector 里。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条要想的正是这只函数：写一个收 vector 引用加目标值的查找函数，找不到时 return -1; 当暗号。", acceptRegex: ["\\w+\\s+\\w+\\s*\\([^)]*vector[^)]*\\)\\s*\\{", "return\\s+-1\\s*;"], acceptOn: "code", sample: "int find_index(const std::vector<int>& v, int target) {\n    for (std::size_t i = 0; i < v.size(); ++i)\n        if (v[i] == target) return static_cast<int>(i);\n    return -1;\n}", why: "签名里只有一个 int，没有任何关于「没有」的信息；约定只写在人脑里。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：在 main 里真忘检查一次 —— 把返回值接进一个 int，再直接拿它当下标去读那个元素，并用一条 println 打出来。", acceptRegex: ["=\\s*\\w+\\s*\\(\\s*\\w+\\s*,\\s*\\d+\\s*\\)\\s*;", "\\w+\\s*\\[\\s*\\w+\\s*\\]"], acceptOn: "code", sample: "int idx = find_index(scores, 99);\nstd::println(\"拿它当下标读: {}\", scores[idx]);", why: "没找到时 idx 是 -1，这一读越到了名单外面：编译器一路放行，因为它只看见一个 int。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：让暗号撞上真数据 —— 开一个装 int 的 vector，初值里就有一个 -1。", acceptRegex: ["vector\\s*<\\s*int\\s*>\\s+\\w+\\s*=\\s*\\{[^{}]*-1[^{}]*\\}"], acceptOn: "code", sample: "std::vector<int> a = {3, -1, 5};   // 零下 1 度是正经读数", why: "数据的地盘和「没有」挤在同一个 int 里就会撞车：-1 既是读数又是暗号，谁也分不清。" },
        { id: "q5", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：换掉暗号那一步 —— 另写一只返回 bool、用 int 引用参数把结果带出来的函数，调用处用 if 挡住再打印。", acceptRegex: ["bool\\s+\\w+\\s*\\(", "\\w+&\\s*\\w+", "if\\s*\\(\\s*\\w+"], acceptOn: "code", sample: "bool find_index(const std::vector<int>& v, int target, int& out) { ... }\nif (find_index(scores, 55, pos)) std::println(\"找到 55，下标 {}\", pos);", why: "有 还是 没有 变成返回值自带的两种状态：不处理就过不去，编译器这才看得见这条约定。" },
        { id: "q6", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：用一行注释回答编译器为什么不提醒、它知不知道 -1 是暗号（至少四个字，正则只验你写了注释）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 它只看见一个 int：暗号是人和人约好的，类型里没有这一格，所以提醒不了", why: "这是一道想清楚的题，判分器只能确认你把结论写下来了，内容对不对要主控读。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <vector>\n\nint find_index(const std::vector<int>& v, int target) {\n    for (std::size_t i = 0; i < v.size(); ++i)\n        if (v[i] == target) return static_cast<int>(i);\n    return -1;\n}\n\nbool find_index(const std::vector<int>& v, int target, int& out) {\n    for (std::size_t i = 0; i < v.size(); ++i)\n        if (v[i] == target) { out = static_cast<int>(i); return true; }\n    return false;\n}\n\nint main() {\n    std::vector<int> scores = {60, 55};\n    int idx = find_index(scores, 99);\n    std::println(\"idx = {}\", idx);\n    std::println(\"拿它当下标读: {}\", scores[idx]);\n    std::vector<int> a = {3, -1, 5};\n    std::println(\"a 里第一个负数: {}\", a[1]);\n    int pos = 0;\n    if (find_index(scores, 55, pos)) std::println(\"找到 55，下标 {}\", pos);\n    return 0;\n}\n// 编译器不提醒：签名里只有一个 int，暗号是人和人约好的，类型里没有这一格\n"],
        wrongs: [
          "",
          "#include <print>\n#include <vector>\n\nint find_index(const std::vector<int>& v, int target) {\n    for (std::size_t i = 0; i < v.size(); ++i) if (v[i] == target) return static_cast<int>(i);\n    return -1;\n}\n\nint main() {\n    std::vector<int> scores = {60, 55};\n    int idx = find_index(scores, 99);\n    if (idx >= 0) std::println(\"{}\", idx);\n    return 0;\n}\n",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> scores = {60, 55};\n    std::println(\"{}\", scores[0]);\n    return 0;\n}\n"],
        loose: [
          "#  include < vector >\n#  include < print >\n\nint  locate ( const std :: vector < int > & v, int want ) {\n    for ( std::size_t i = 0; i < v.size(); ++i )\n        if (v[i] == want) return static_cast<int>(i);\n    return -1;\n}\n\nbool  locate2 ( const std::vector<int>& v, int want, int& where ) {\n    where = 0;\n    return false;\n}\n\nint  main ( )\n{\n  std :: vector < int >  scores = { 60 , 55 } ;\n  int  hole = locate(scores, 99);\n  std::println(\"{}\", scores[hole]);\n  std::vector<int> cold = { 3, -1, 5 };\n  std::println(\"{}\", cold[1]);\n  int  pos = 0;\n  if ( locate2( scores, 55, pos ) ) std::println(\"{}\", pos);\n  return 0;\n}\n// 它只看见 int，暗号是人和人约好的，类型里没有这一格，所以提醒不了\n"]
      }
    },
    {
      cid: "m127", kind: "paper", mode: "ide", authored: "103f9fe1", file: "main.cpp", pass: 60, title: "第 127 课考试 · std::optional 这只可能空着的盒子", task: "任务题目：写 find_max(v) 返回 optional<int> —— 空数组给 nullopt，否则给最大值；调用方先问一句再取值", hint: "回看【怎么做】【演示 1 · if 直接问盒子】【演示 3 · 不问就硬取会怎样】。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 26, coversTask: [1], stem: "（任务题）写出 find_max 的头一行：返回一只「可能装着 int 的盒子」，参数是 std::vector<int> 的常量引用 v。", acceptRegex: ["optional\\s*<\\s*int\\s*>"], acceptOn: "code", sample: "std::optional<int> find_max(const std::vector<int>& v) {", why: "任务的关键就在返回类型：从 int 换成 optional<int>，「空表没有最大值」这件事才有地方放。" },
        { id: "q2", type: "code", score: 22, coversTask: [1], stem: "（任务题）接着上一题：v 是空表时那一条 return 写出来。", acceptRegex: ["return\\s+std\\s*::\\s*nullopt"], acceptOn: "code", sample: "return std::nullopt;", why: "空表交还的是明确的空盒，不是 0、不是 -1 —— 不占用任何一个正经数值当暗号。" },
        { id: "q3", type: "code", score: 27, coversTask: 1, stem: "写出 find_max 找最大值那一段：开一个 int 变量 best 先记 0，用 for 挨个看 v 里的数，谁比 best 大就把它写进 best，最后把 best 还回去。", acceptRegex: ["int\\s+best\\s*=", "for\\s*\\(\\s*int\\s+\\w+\\s*:", "best\\s*=\\s*\\w+", "return\\s+best\\s*;"], acceptOn: "code", sample: "int best = 0;\nfor (int s : v) if (s > best) best = s;\nreturn best;", why: "打擂台这一段跟 optional 无关，普通 int 就够；关键是最后那句 return best —— 交回去的数会被自动装进盒子，签名里那个 optional<int> 替你办这件事。" },
        { id: "q4", type: "code", score: 25, stem: "写一行：调用 find_max(v) 拿到盒子，先用 if 问一句盒里有没有货，有货才用星号把最大值取出来打印。", acceptRegex: ["if\\s*\\(\\s*auto\\s+\\w+\\s*=\\s*find_max\\s*\\(", "std\\s*::\\s*println\\s*\\(", "\\*\\s*\\w+"], acceptOn: "code", sample: "if (auto r = find_max(v)) std::println(\"最大值 = {}\", *r);", why: "if 拿到的就是那只盒子本身：有货走前一条、空盒走后一条，星号只在确认有货之后才写 —— 这正是 optional 比 -1 暗号可靠的地方。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <vector>\n#include <optional>\nstd::optional<int> find_max(const std::vector<int>& v) {\n}\nint main() {\n    return std::nullopt;\n    int best = 0;\n    for (int s : v) if (s > best) best = s;\n    return best;\n    if (auto r = find_max(v)) std::println(\"最大值 = {}\", *r);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "int find_max(const std::vector<int>& v) {",
          "return -1;",
          "int best = 0;\nreturn best;",
          "std::println(\"最大值 = {}\", find_max(v));"],
        loose: [
          "std :: optional < int >  find_max ( const std :: vector < int > & v )  {\n}\nint main() {\n    return  std :: nullopt ;\n    int  best = 0 ;\n    for ( int x : v ) { if ( x > best ) best = x ; }\n    return best ;\n    if ( auto res = find_max ( v ) ) { std :: println ( \"最大值 {}\" , * res ) ; }\n    return 0;\n}\n"]
      }
    },
    {
      cid: "m128", kind: "paper", mode: "ide", authored: "4bb00613", file: "main.cpp", pass: 60, title: "第 128 课考试 · value_or 的兜底值", task: "任务题目：给 nickname 加 2 号「小红」，再分别用 if 和 value_or 两种方式各取一次值，说清两种写法各自适合什么时候", hint: "回看【怎么做】【演示 2 · 同一条数据，if 与 value_or 各走一遍】【演示 3 · 兜底表达式每次都被算】。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 23, coversTask: [1], stem: "（任务题）nickname 查无此人时给空盒。写一行：打印 9 号的显示名，没有昵称就用「匿名用户」兜底，一行的 if 都不许写。", acceptRegex: ["value_or\\s*\\(", "匿名用户"], acceptOn: "code", sample: "std::println(\"9 号昵称: {}\", nickname(9).value_or(\"匿名用户\"));", why: "value_or 括号里放的就是那条备注：查得到用查到的，查不到用备用的，一行收尾。" },
        { id: "q2", type: "code", score: 20, coversTask: [1], stem: "（任务题）给 nickname 补上 2 号「小红」：写那一条判断加返回，id 等于 2 就交「小红」。", acceptRegex: ["id\\s*==\\s*2", "小红"], acceptOn: "code", sample: "if (id == 2) return \"小红\";", why: "返回一个 std::string 会自动装进盒子，这一句和 1 号那条形状一样 —— 盒子的构造是隐含的。" },
        { id: "q3", type: "code", score: 30, coversTask: 1, stem: "写一行：走 if 那条路 —— 拿 nickname(2) 交回来的盒子问一句有没有货，有货就用星号把真名取出来打印。", acceptRegex: ["if\\s*\\(\\s*auto\\s+\\w+\\s*=\\s*nickname\\s*\\(", "std\\s*::\\s*println\\s*\\(", "\\*\\s*\\w+"], acceptOn: "code", sample: "if (auto n = nickname(2)) std::println(\"2 号真名: {}\", *n);", why: "if 分流这一边拿到的是盒子本身，所以能写星号取值；value_or 那一边只会交出一个拷贝，改不到盒里 —— 这就是两条路的分工界线。" },
        { id: "q4", type: "code", score: 27, coversTask: 1, stem: "写出 nickname 的头一行：返回一只「可能装着别名的盒子」，参数是一个 int。", acceptRegex: ["optional\\s*<\\s*std\\s*::\\s*string\\s*>", "nickname\\s*\\(\\s*int\\b"], acceptOn: "code", sample: "std::optional<std::string> nickname(int id) {", why: "返回类型里的 optional 是这一课全部的起点：签名上写着可能没有，函数里那句 return 一个 std::string 才会被自动装进盒子。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <string>\n#include <optional>\nstd::optional<std::string> nickname(int id) {\n}\nint main() {\n    std::println(\"9 号昵称: {}\", nickname(9).value_or(\"匿名用户\"));\n    if (id == 2) return \"小红\";\n    if (auto n = nickname(2)) std::println(\"2 号真名: {}\", *n);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "std::println(\"9 号昵称: {}\", *nickname(9));",
          "if (id == 3) return \"小红\";",
          "std::println(\"2 号真名: {}\", nickname(2).value_or(\"匿名用户\"));",
          "std::string nickname(int id) {"],
        loose: [
          "#include <print>\nstd :: optional < std :: string >  nickname ( int  who )  {\n}\nint main() {\n    std::println ( \"9 号昵称: {}\" , nickname ( 9 ) . value_or ( \"匿名用户\" ) ) ;\n    if ( id == 2 )  return \"小红\" ;\n    if ( auto nm = nickname ( 2 ) ) { std :: println ( \"2 号真名：{}\" , * nm ) ; }\n    return 0;\n}\n"]
      }
    },
  ]
};
