/* 喵站 · C++ 入门 考卷分部 p05：第 21–25 课（第九轮）
 *
 * 款式照 cpp-exam/p01.js：每场卷 kind 是 paper，题分合计正好 100，
 * 源稿每一条【任务】都有题的 coversTask 对着它，任务题合计 ≥50 分，
 * choice ≥2、output ≥1，每题带 why，selftest 的 refs 判满 100、wrongs 判不过、loose 仍过。
 *
 * 号线：本分部五场卷都不出现「条件分支」那类以后才教的写法，判断结果一律用打印出来问。
 *
 * 验收：node dev/tools/cpp-exam-check.cjs --only c21,c22,c23,c24,c25
 */
window.MIAO_CPP_EXAM_P05 = {
  papers: [
    {
      cid: "c21", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 21 课考试 · 算术运算符上场", task: "任务题目：对输入的数用 + - * / % 做一次完整运算；亲眼确认取余不收小数", hint: "想不起来就回看正文【演示 1】的四个问法和【演示 3】那条报错。",
      notes: ["整数除法砍尾巴不四舍五入：25 / 2 打 12，不是 12.5；想按小数除，至少有一边得是小数。", "+ - * / 都能收小数，唯独 % 只收整数，这是本课唯一的硬性类型限制。", "对 10 取余拿到个位数字，整除 10 砍掉个位；对 2 取余是 0 就是偶数，是 1 就是奇数。", "205 秒是几分几秒，靠一对搭档符号各问一半：205 / 60 得分钟，205 % 60 得零头秒数。", "除数是 0 不会得到无穷大，那是未定义行为，程序常常直接异常终止。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "开两只 int 盒子：一只装单价 8，一只装数量 3。", acceptRegex: ["int\\s+\\w+\\s*=\\s*8\\s*;", "int\\s+\\w+\\s*=\\s*3\\s*;"], acceptOn: "code", sample: "int price = 8;\nint count = 3;", why: "先把两个数各归一只盒子，后面四次问法都从这两只盒子取；写死数字是为了每次编译都对得上心算的结果。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "再开一只 int 盒子装总价，右边就写这两只盒子相乘。", acceptRegex: ["int\\s+\\w+\\s*=\\s*\\w+\\s*\\*\\s*\\w+\\s*;"], acceptOn: "code", sample: "int total = price * count;", why: "运算符两边算完会塌成一个值再装进左边的盒子，所以 8 乘 3 得 24 落进 total。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "用一条 std::println 把总价打出来：格式串里带上总价两个字，再加一个占位坑。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*总价[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+"], acceptOn: "code", sample: "std::println(\"总价 = {}\", total);", why: "这一行就是拿来跟你心算的 24 对照的；一个坑给一个值，坑和值按逗号顺序对。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "用一条 std::println 问「零头」：把总价对 10 取余的结果打出来，格式串里带上零头两个字。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*零头[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*%\\s*10"], acceptOn: "code", sample: "std::println(\"不满 10 的零头 = {}\", total % 10);", why: "同一只盒子四种问法：乘、减、整除问装得下几个 10，取余问不够一个 10 的剩多少；24 对 10 取余是 4。" },
        { id: "q5", type: "code", score: 20, coversTask: 2, stem: "任务第 2 条：开一只 double 盒子装 10.5，再拿它去对一个整数取余（这两行要真写进代码里，编译不过才看得见报错）。", acceptRegex: ["double\\s+(\\w+)\\s*=\\s*10\\.5\\s*;[\\s\\S]*\\1\\s*%", "%\\s*[\\w]+[\\s\\S]*double\\s+\\w+\\s*=\\s*10\\.5"], acceptOn: "code", sample: "double money = 10.5;\nstd::println(\"{}\", money % 4);", matchAny: true, why: "余数的定义依赖整除，% 只在整数之间成立；类型对不上，编译器在编译阶段就把这一行拦下。" },
        { id: "q6", type: "code", score: 15, coversTask: 2, stem: "在它旁边用一行注释写下报错里那个词（至少写四个字）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "double money = 10.5;\nstd::println(\"{}\", money % 4);   // 报错里说 invalid operands", why: "这一条只能判「你写了一行像样的注释」，抄的报错对不对这块编辑器判不了 —— 这是它判不动的部分。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint main() {\n    int price = 8;\n    int count = 3;\n\n    int total = price * count;\n    std::println(\"总价 = {}\", total);\n    std::println(\"付 100 找零 = {}\", 100 - total);\n    std::println(\"总价里有几个 10 = {}\", total / 10);\n    std::println(\"不满 10 的零头 = {}\", total % 10);\n\n    double money = 10.5;\n    std::println(\"小数取余 = {}\", money % 4);   // 报错里说 invalid operands\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\nint main() {\n    int price = 8;\n    int count = 3;\n    int total = price * count;\n    std::println(\"总价 = {}\", total);\n    return 0;\n}\n",
          "#include <print>\nint main() {\n    int a = 8;\n    int b = 3;\n    int c = a + b;\n    std::println(\"{}\", c / 10);\n    return 0;\n}\n"],
        loose: [
          "#  include <print>\n\nint main ( )\n{\n  int  unit_price = 8;\n  int qty = 3 ;\n  auto  all = unit_price * qty;\n  int all2 = 0;\n  all2 = unit_price * qty;\n  std::println( \"总价一共 {}\", all );\n  std::println( \"零头还剩 {}\", all % 10 );\n  double cash = 10.5;\n  std::println( \"{}\", cash % 4 );\n  // 编译不过，说运算数类型不对\n}\n"]
      }
    },
    {
      cid: "c22", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 22 课考试 · 比较运算：结果是真是假", task: "任务题目：输入 60 和 90 逐行对照比较运算的输出；输入两个相等的数，看清 == 与 != 各打出什么", hint: "回看正文【演示 1】的六行问法、【演示 2】那个不报错的等号，以及【常见坑】里连写两个比较那条。",
      notes: ["六个比较符号里，>= 和 <= 带等号，正好卡边界时也算过线：60 >= 60 是 true。", "单个 = 是装进去，== 才是问一句；a = 5 当比较写不报错，因为赋值本身也是个表达式，代价是盒子的值被换掉。", "比较只是回答一个问题，回答是一个真假值，既不改变 a 也不改变 b。", "照数学课的写法写 60 <= score <= 90，在 C++ 里恒为 true：先算 60 <= score 得一个 bool，再把它当成 1 或 0 去和 90 比。", "std::println 打 bool 会印出 true 或 false 这两个词，不会印 1 和 0。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "把这份程序写成能跑的形：把键盘和打印两个工具箱都搬进来（两行 #include），再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*iostream\\s*>", "#\\s*include\\s*<\\s*print\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <iostream>\n#include <print>\n\nint main() {", why: "std::cin 和 std::print 住在 iostream 里，std::println 住在 print 里，缺一个就没人认识它们；没有 main，链接器找不到入口。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "开两只 int 盒子并给上初值 0，再用一条 std::cin 连着读进两个数。", acceptRegex: ["int\\s+\\w+\\s*=\\s*0\\s*;[\\s\\S]*int\\s+\\w+\\s*=\\s*0\\s*;", "std::cin\\s*>>\\s*\\w+\\s*>>\\s*\\w+"], acceptOn: "code", sample: "int a = 0;\nint b = 0;\nstd::cin >> a >> b;", why: "程序按个数收，一行敲 60 空格 90 就各灌进一只盒子；读不进去时盒子保持初值 0。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "用一条 std::println 打出「前者大于后者吗」的比较结果：逗号后面就写那两个变量之间的 >。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*>\\s*\\w+"], acceptOn: "code", sample: "std::println(\"a > b  是 {}\", a > b);", why: "比较式先算成一个真假值再进占位坑，和塞一个变量名进去是同一回事；60 对 90 这一行打 false。" },
        { id: "q4", type: "code", score: 20, coversTask: 2, stem: "任务第 2 条要的那一句：用一条 std::println 打出两个数 == 的结果（两个等号，不是一个）。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*==\\s*\\w+"], acceptOn: "code", sample: "std::println(\"a == b 是 {}\", a == b);", why: "== 是问一句，单个 = 是装进去；写成 a = b 编译器不报错，还把 b 的值悄悄灌进 a。" },
        { id: "q5", type: "code", score: 15, coversTask: 2, stem: "再补一条 std::println，打这两个数 != 的结果。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*!=\\s*\\w+"], acceptOn: "code", sample: "std::println(\"a != b 是 {}\", a != b);", why: "两个数一样时 == 点头、!= 摇头，这一对正好互为反面，是任务 2 要你逐行对照的那一组。" },
        { id: "q6", type: "code", score: 15, stem: "把一次比较的结果先存起来：开一只 bool 盒子，右边写一次比较。", acceptRegex: ["bool\\s+\\w+\\s*=\\s*\\w+\\s*(==|!=|>=|<=|>|<)"], acceptOn: "code", sample: "bool pass = a >= 60;", why: "比较算完得到的是一个 bool 值，可以先用 bool 盒子装着，之后再打印或反复用。" }
      ],
      selftest: {
        refs: [
          "#include <iostream>\n#include <print>\n\nint main() {\n    int a = 0;\n    int b = 0;\n\n    std::print(\"输入两个整数: \");\n    std::cin >> a >> b;\n\n    std::println(\"a > b  是 {}\", a > b);\n    std::println(\"a == b 是 {}\", a == b);\n    std::println(\"a != b 是 {}\", a != b);\n\n    bool same = a == b;\n    std::println(\"先存起来的 {}\", same);\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <iostream>\n#include <print>\nint main() {\n    int a = 0;\n    std::cin >> a;\n    std::println(\"{}\", a);\n    return 0;\n}\n",
          "#  include <print>\nint main() {\n    int a = 60;\n    int b = 90;\n    std::println(\"{}\", a = b);\n    std::println(\"{}\", a < b);\n    return 0;\n}\n"],
        loose: [
          "#  include < iostream >\n#  include <print>\n\nint main ( )\n{\n  int  x = 0;\n  int y = 0;\n  std::print ( \"来两个数 : \" );\n  std::cin >> x >> y;\n  std::println( \"谁大 {}\", x > y );\n  std::println( \"一样吗 {}\", x == y );\n  std::println( \"不一样 {}\", x != y );\n  bool  bigger = x >= y;\n}\n"]
      }
    },
    {
      cid: "c23", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 23 课考试 · 且、或、非", task: "任务题目：输入 16 和 1 自己判断三行输出再对照程序；把且改成或再跑一遍，体会两者的差别", hint: "回看正文【演示 1】的两行问法、【演示 2】感叹号管多远，以及那张短路求值走向图。",
      notes: ["这个脾气叫短路求值：&& 左边已经是 false，右边根本不被计算；|| 左边已经是 true，右边同样被跳过。", "&& 的优先级比 || 高：a || b && a 先算 b && a 折成一个值，再和 a 或。", "或的意思是至少一个成立，两边都真结果还是 true；且要两边都真才 true。", "程序算 age >= 18 && has_ticket 的走法：先算左边，左边假就收工，左边真才轮得到右边。", "a && !b 是 true：感叹号比 && 紧，先算 !b 再拼起来。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "把这份程序写成能跑的形：把键盘和打印两个工具箱都搬进来（两行 #include），再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*iostream\\s*>", "#\\s*include\\s*<\\s*print\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <iostream>\n#include <print>\n\nint main() {", why: "std::cin 和 std::print 住在 iostream 里，std::println 住在 print 里，缺一个就没人认识它们；没有 main，链接器找不到入口。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "开一只 int 盒子装年龄（给上初值 0），再开一只 bool 盒子装有票（初值 false），然后用一条 std::cin 把两个都连着读进来。", acceptRegex: ["int\\s+\\w+\\s*=\\s*0\\s*;", "bool\\s+\\w+\\s*=\\s*false\\s*;", "std::cin\\s*>>\\s*\\w+\\s*>>\\s*\\w+"], acceptOn: "code", sample: "int age = 0;\nbool has_ticket = false;\nstd::cin >> age >> has_ticket;", why: "bool 盒子也能用 cin 读：敲 1 变 true，敲 0 变 false；两个数用空格隔开一次读完，程序按个数收。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "拼一句「且」：用一条 std::println 打出「年龄够 18 且有票」，逗号后面左边是一次比较，右边是那只 bool 盒子。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*(>=|<=|>|<|==|!=)\\s*[\\w\\d]+\\s*&&\\s*\\w+"], acceptOn: "code", sample: "std::println(\"年龄够 且 有票 = {}\", age >= 18 && has_ticket);", why: "&& 要两边都真才 true：16 岁时左边 age >= 18 已经是 false，右边连看都不看，整句就是 false。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "拼一句「或」带翻面的：用一条 std::println，式子里既有 ||，又有一个感叹号只翻一只盒子。", acceptRegex: ["std::println\\s*\\([^;]*\\|\\|[^;]*!", "std::println\\s*\\([^;]*![^;]*\\|\\|"], acceptOn: "code", sample: "std::println(\"是小孩 或 没票 = {}\", age < 18 || !has_ticket);", matchAny: true, why: "感叹号翻的只是 has_ticket 这一小块；或是一边真就真，16 岁那条左边已经成立。" },
        { id: "q5", type: "code", score: 15, coversTask: 2, stem: "把上一次那句「且」照原样改成「或」，用一条 std::println 再打一遍（同一对操作数，只把 && 换成 ||）。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*(>=|<=|>|<|==|!=)\\s*[\\w\\d]+\\s*\\|\\|\\s*\\w+"], acceptOn: "code", sample: "std::println(\"年龄够 或 有票 = {}\", age >= 18 || has_ticket);", why: "同一句只换一个符号，结果从 false 翻成 true：16 岁不够 18，但有票这一边真；这就是且与或的分界。" },
        { id: "q6", type: "code", score: 15, coversTask: 1, stem: "把整句翻面：用一条 std::println 打「不是（年龄够且有票）」，感叹号后面要跟上括号。", acceptRegex: ["std::println\\s*\\([^;]*!\\s*\\(\\s*\\w+\\s*(>=|<=|>|<|==|!=)[^;]*&&[^;]*\\)"], acceptOn: "code", sample: "std::println(\"两个条件都不成立 = {}\", !(age >= 18 && has_ticket));", why: "不加括号时感叹号只管紧跟着的那一小块；要翻整句就得把整句括起来，这是本课最容易写错的一行。" }
      ],
      selftest: {
        refs: [
          "#include <iostream>\n#include <print>\n\nint main() {\n    int age = 0;\n    bool has_ticket = false;\n\n    std::print(\"输入年龄 和 是否有票(1/0): \");\n    std::cin >> age >> has_ticket;\n\n    std::println(\"年龄够 且 有票 = {}\", age >= 18 && has_ticket);\n    std::println(\"年龄够 或 有票 = {}\", age >= 18 || has_ticket);\n    std::println(\"是小孩 或 没票 = {}\", age < 18 || !has_ticket);\n    std::println(\"都不成立吗 = {}\", !(age >= 18 && has_ticket));\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <iostream>\n#include <print>\nint main() {\n    int age = 0;\n    std::cin >> age;\n    std::println(\"{}\", age >= 18);\n    return 0;\n}\n",
          "#include <print>\nint main() {\n    bool a = true;\n    bool b = false;\n    std::println(\"{}\", a && b);\n    std::println(\"{}\", !a);\n    return 0;\n}\n"],
        loose: [
          "#  include < iostream >\n#  include <print>\n\nint main ( )\n{\n  int  years = 0;\n  bool  ticket = false;\n  std::print ( \"年龄 有票吗 : \" );\n  std::cin >> years >> ticket;\n  std::println( \"且 {}\", years >= 18 && ticket );\n  std::println( \"改成一或 {}\", years >= 18 || ticket );\n  std::println( \"小孩或没票 {}\", ticket == false || ! ( years >= 18 ) );\n  std::println( \"反面 {}\", ! ( years >= 18 && ticket ) );\n}\n"]
      }
    },
    {
      cid: "c24", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 24 课考试 · 让变量自己变：++ -- += -=", task: "任务题目：给记分板加一行 score *= 2 先猜结果再运行；把 score++ 写成完整的啰嗦版赋值语句", hint: "回看正文【演示 1】的三次变动、【演示 2】累计盒和【演示 3】那个旧值新值之差。",
      notes: ["+= 真正的主场是累计盒：先写 int total = 0; 清零，每拿到一个新分数走一行 total += 那个分数;，全部加完再打印。", "total -= 5; 是在自己身上减，和 += 是同一套缩写。", "后置的 score++ 先交出旧值再自己加 1：score 是 10 时打印交出 10，下一行读到的才是 11；前置 ++score 交出加完的新值。", "score++ 2 这种写法不存在：++ 只加 1，多出来那个数编译器不认识，会报 expected ';' 之类；想一次加 2 就写 score += 2;。", "在同一行里既用 score 的旧值又改 score 是不可靠的写法，别这么写。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "开一只 int 盒子装分数，右边给一个整数初值。", acceptRegex: ["int\\s+\\w+\\s*=\\s*\\d+\\s*;"], acceptOn: "code", sample: "int score = 100;", why: "后面每一行都是在这只盒子身上改，所以先要有它，并且要给一个说得清的初值才好对照你猜的结果。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "加一行 *= 2：让这只盒子在自己身上翻倍（左边就是那只盒子的名字）。", acceptRegex: ["\\w+\\s*\\*=\\s*2\\s*;"], acceptOn: "code", sample: "score *= 2;", why: "* 是乘法那一层的缩写版：*= 就是自己乘上右边那个数再装回自己，100 变 200。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "用一条 std::println 把变完之后的分数打出来：格式串里一个占位坑，逗号后面给那只盒子。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "std::println(\"score = {}\", score);", why: "这一行就是拿来对照你心算的结果的；运算符两边算完会塌成一个值，直接进占位坑。" },
        { id: "q4", type: "code", score: 20, coversTask: 2, stem: "写出 score++ 的啰嗦版：一行的左边是那只盒子，右边是它自己加上 1。", acceptRegex: ["(\\w+)\\s*=\\s*\\1\\s*\\+\\s*1\\s*;"], acceptOn: "code", sample: "score = score + 1;", why: "复合赋值只是「左边的盒子参与运算再装回左边」的缩写，这两行语义完全等价，前者只是少打一遍变量名。" },
        { id: "q5", type: "code", score: 15, coversTask: 2, stem: "再写它的简写版：对同一只盒子用一对加号，单独占一行。", acceptRegex: ["\\w+\\s*\\+\\+\\s*;"], acceptOn: "code", sample: "score++;", why: "单独占一行时 score++ 和 ++score 没有区别，都是把盒子加 1；差别要塞进更大的表达式里才露脸。" },
        { id: "q6", type: "code", score: 15, stem: "把这份程序写成能跑的形：把打印工具箱搬进来（#include），再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n\nint main() {", why: "缺 #include <print> 就没人认识 std::println；没有 main，链接器找不到入口。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint main() {\n    int score = 100;\n    int total = 0;\n\n    total += score;\n    score *= 2;\n    score = score + 1;\n    score++;\n\n    std::println(\"score = {}\", score);\n    std::println(\"total = {}\", total);\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\nint main() {\n    int score = 90;\n    score = score * 2;\n    std::println(\"{}\", score);\n    return 0;\n}\n",
          "#include <print>\nint main() {\n    int score;\n    score = score + 2;\n    std::println(\"{}\", score++ 2);\n    return 0;\n}\n"],
        loose: [
          "#  include <print>\n\nint main ( )\n{\n  int  points = 7;\n  int  sum = 0;\n  sum += points;\n  sum  -=  1;\n  points  *=  2 ;\n  points = points + 1 ;\n  points++;\n  std::println( \"最后 {}\", points );\n}\n"]
      }
    },
    {
      cid: "c25", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 25 课考试 · 先乘除后加减", task: "任务题目：心算 5 + 2 * 3 % 4 再运行验证；用括号改写它，让加法先算", hint: "回看正文那张优先级阶梯与算式树，以及【演示 2】那个忘了括号的平均分。",
      notes: ["这条阶梯是：括号最优先，其次 * / %，再是 + -，赋值排在最后；同一层从左往右算。", "拿不准就加括号，多余的括号不会多生成一条代码。", "100 - 20 - 5 是 75，100 - (20 - 5) 是 85：减法同层从左往右，括号能把顺序整个扳过来。", "赋值排在最底下：total += 10 + 4 * 2 先把等号右边整个算成 18，才并进 total。", "2 + 3 * 4 打 14 不是 20：乘号比加号高，3 * 4 先折成 12 再加。"],
      questions: [
        { id: "q1", type: "code", score: 25, coversTask: 1, stem: "用一条 std::println 把 5 + 2 * 3 % 4 原样打出来：逗号后面照抄这个式子，一个括号都别加。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\"\\s*,\\s*5\\s*\\+\\s*2\\s*\\*\\s*3\\s*%\\s*4"], acceptOn: "code", sample: "std::println(\"5 + 2 * 3 % 4 = {}\", 5 + 2 * 3 % 4);", why: "乘和取余同一层，从左往右：先 2 * 3 得 6，再 6 % 4 得 2，最后才轮到 5 + 2，打出来是 7。" },
        { id: "q2", type: "code", score: 25, coversTask: 2, stem: "任务第 2 条：用一条 std::println 把它改成加法先算：给 5 + 2 套上括号，后面的乘和取余照旧。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\"\\s*,\\s*\\(\\s*5\\s*\\+\\s*2\\s*\\)\\s*\\*\\s*3\\s*%\\s*4"], acceptOn: "code", sample: "std::println(\"(5 + 2) * 3 % 4 = {}\", (5 + 2) * 3 % 4);", why: "括号最优先这一条永远不会错：7 * 3 得 21，21 % 4 余 1，一个括号就把结果从 7 挪到 1。" },
        { id: "q3", type: "code", score: 20, stem: "算一次平均分：开一只 int 盒子，右边先把三个数用括号括起来求和，再除以一个数。", acceptRegex: ["int\\s+\\w+\\s*=\\s*\\(\\s*\\d+\\s*\\+\\s*\\d+\\s*\\+\\s*\\d+\\s*\\)\\s*/\\s*\\d+\\s*;"], acceptOn: "code", sample: "int avg = (85 + 92 + 78) / 3;", why: "先加括号求和再除，255 / 3 得 85（整数除法，小数砍掉）；这一对在正文里救过很多程序的命。" },
        { id: "q4", type: "code", score: 15, stem: "把同一道平均分去掉括号再算一遍：另开一只 int 盒子，右边是同样的三个数加加加，最后除，不带任何括号。", acceptRegex: ["int\\s+\\w+\\s*=\\s*\\d+\\s*\\+\\s*\\d+\\s*\\+\\s*\\d+\\s*/\\s*\\d+\\s*;"], acceptOn: "code", sample: "int wrong = 85 + 92 + 78 / 3;", why: "除号抢先：78 / 3 得 26，再加 85 和 92 得 203；编译器一个字都不说，这就是优先级最坑人的地方。" },
        { id: "q5", type: "code", score: 15, stem: "把这份程序写成能跑的形：把打印工具箱搬进来（#include），再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n\nint main() {", why: "缺 #include <print> 就没人认识 std::println；没有 main，链接器找不到入口。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint main() {\n    std::println(\"原式 = {}\", 5 + 2 * 3 % 4);\n    std::println(\"括号改一下 = {}\", (5 + 2) * 3 % 4);\n\n    int avg = (85 + 92 + 78) / 3;\n    std::println(\"平均分 = {}\", avg);\n\n    int wrong = 85 + 92 + 78 / 3;\n    std::println(\"去掉括号 = {}\", wrong);\n\n    int total = 0;\n    total += 10 + 4 * 2;\n    std::println(\"total = {}\", total);\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\nint main() {\n    std::println(\"{}\", 5 + 2);\n    std::println(\"{}\", 3 * 4);\n    return 0;\n}\n",
          "#include <print>\nint main() {\n    int avg = 85 + 92 + 78 / 3;\n    std::println(\"{}\", avg);\n    std::println(\"{}\", 1 + 2 * 3);\n    return 0;\n}\n"],
        loose: [
          "#  include <print>\n\nint main ( )\n{\n  std::println( \"第一个 {}\" , 5 + 2 * 3 % 4 );\n  std::println( \"加了括号 {}\" , ( 5 + 2 ) * 3 % 4 );\n  int  pingjun = ( 80 + 90 + 100 ) / 3 ;\n  int  cuowu = 80 + 90 + 100 / 3;\n  std::println( \"{} 和 {}\", pingjun, cuowu );\n}\n"]
      }
    },
  ]
};
