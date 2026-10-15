/* 喵站 · C++ 入门 考卷分部 p14：第 59–62 课（第九轮）
 *
 * 每场卷照 cpp-exam/p01.js、p10.js 的形状与硬指标（cpp-exam-check 逐条对账）：
 *   1. kind:"paper"，题型只用笔试引擎认的六种（choice/multi/blank/code/output/order）；
 *   2. 各题 score 相加正好 100；choice ≥2、output ≥1；
 *   3. 源稿每一条【任务】都有题用 coversTask 对着它（四课各一条任务，序号都是 1）；
 *   4. 带 coversTask 的题合计 ≥50 分；每题带 why；
 *   5. selftest 的 refs 判 100、wrongs 判 <60、loose 判 ≥60。
 *
 * 本分部四处特殊交代：
 *   · 课号线：函数定义 51、引用别名 58、参数列表里的引用 60（const 引用属同一条登记）。
 *     c59 那场题面只出现传值函数与第 58 课的引用别名，绝不出现 int& 参数；
 *     c60 起才在题面写 int& 参数，c61/62 写 const T& 与多只答案格。
 *   · 交叉引用只往回指（第 53 课的 return、第 49 课的 const、第 46 课的 pair、第 44 课的 auto&、
 *     第 43 课的累加、第 27 课的 if、第 24 课的 +=），往后的（指针、冒泡排序）一律不提课号。
 *   · 读代码写输出的题面都是不带 int main 的片段，头文件的事由 H 闸管正文那边，这儿不触发。
 *   · 每条任务的「写代码」类题只按正则认关键写法：int& sum、v[0] = 0、sum += x、int t = a，
 *     变量名按题面给定，空格与换行不计。
 *
 * 验收：node dev/tools/cpp-exam-check.cjs --only c59,c60,c61,c62
 */
window.MIAO_CPP_EXAM_P14 = {
  papers: [
    {
      cid: "c59", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 59 课考试 · 传值：函数拿到复印件", task: "任务题目：先猜输出再运行 —— 调用 try_change 之后 a 最后是多少？为什么？", hint: "想不起来就回看本课【它被设计成什么样】那张三步表、【演示 1】的源稿这段和【演示 2】的两次复印。",
      notes: ["传值等于复印：参数盒是函数自己新建的独立盒子，出生时值和外面那只相同，此后各走各路；「写 x 就是写 a」是带 & 的那种写法，本课还没学。", "函数里对参数的修改随函数结束一起消失，副本被扔掉、外面看不见它存在过；这种隔离是好脾气 —— 调完函数不用担心自己的数据被偷偷改掉。", "每次调用都重新复印一次当前值：a = 10 时看到 10，main 里改成 a = 42 再调一次才看到 42，那份旧复印件早随上一轮调用作废，不会跟着刷新。", "传值的英文是 pass by value，名字里的 value 就是全部重点：递进去的是值的一份副本，不是变量本身，也不是变量的地址。", "想改到原件有两条路：用 return 把值带出来（干净，但一只手只能拎一个值），或者给参数加个 & 拿到原稿本身（下一课讲）；这条任务的重点在「先猜」两个字，没猜在前，跑完就只是看了一遍现成的结果。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "写一把只收一份复印件的工具：void 开头，圆括号里收一个 int，身体第一件事就是给那个参数赋成 999。", acceptRegex: ["void\\s+\\w+\\s*\\(\\s*int\\s+(\\w+)\\s*\\)\\s*\\{\\s*\\1\\s*=\\s*999\\s*;"], acceptOn: "code", sample: "void try_change(int x) {\n    x = 999;", why: "参数 x 是函数自己新建的一只独立盒子，出生时值和 a 相同，此后各走各路；写 x 就是写副本，写不到 a。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "在工具的身体里用一条 std::println 把那个参数此刻的值打出来：格式串一个占位坑。", acceptRegex: ["void\\s+\\w+\\s*\\(\\s*int\\s+\\w+\\s*\\)\\s*\\{[^}]*std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\""], acceptOn: "code", sample: "    std::println(\"函数里 x = {}\", x);", why: "副本被改成 999 并当场打印出来，这是两行输出里第一行的来历。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "在 main 里让一只 int 出生就是 10，然后调用那把工具、把它递进去。", acceptRegex: ["int\\s+\\w+\\s*=\\s*10\\s*;", "\\w+\\s*\\(\\s*\\w+\\s*\\)\\s*;"], acceptOn: "code", sample: "int a = 10;\ntry_change(a);", why: "调用发生的一瞬间把 a 的当前值复印一份装进参数盒 —— 递进去的不是那个变量，而是它那一刻的值。" },
        { id: "q4", type: "code", score: 20, coversTask: 1, stem: "调用一结束就在 main 里打一条 std::println，逗号后面还是那个被递出去的变量 —— 这两行数字不一样，就是传值的全部证据。", acceptRegex: ["\\w+\\s*\\(\\s*(\\w+)\\s*\\)\\s*;[\\s\\S]{0,200}?std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\1\\s*\\)"], acceptOn: "code", sample: "try_change(a);\nstd::println(\"调用后 a = {}\", a);", why: "原件 a 一个字节都没被碰过，所以这一行还是 10；函数里对参数的修改随函数结束一起消失，外面完全看不见它存在过。" },
        { id: "q5", type: "code", score: 20, coversTask: 1, stem: "先猜再跑：猜完之后，用一行注释写出 a 为什么没变。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 函数拿到的是那一刻值的复印件，写在副本上，原稿不动", why: "这一条只能验你确实写了一行解释，验不了写得对不对 —— 「先猜」这件事本身是这块编辑器判不动的部分。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nvoid try_change(int x) {\n    x = 999;\n    std::println(\"函数里 x = {}\", x);\n}\n\nint main() {\n    int a = 10;\n\n    try_change(a);\n    std::println(\"调用后 a = {}   ← 原稿没变\", a);\n\n    a = 42;\n    try_change(a);\n    std::println(\"再喊一次，a = {}\", a);\n\n    // 函数拿到的是那一刻值的复印件，写在副本上，原稿不动\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n\nvoid try_change(int x) {\n    x = 999;\n    std::println(\"函数里 x = {}\", x);\n}\n",
          "#include <print>\n\nint try_change(int x) {\n    return x;\n}\n\nint main() {\n    int a = 10;\n    std::println(\"a = {}\", a);\n    return 0;\n}\n"],
        loose: [
          "#  include < print >\nvoid  change ( int v )\n{\n  v = 999 ;\n  std::println( \"函数里 {}\" , v ) ;\n}\nint main ( )\n{\n  int n = 10 ;\n  change ( n ) ;\n  std::println( \"外面 {}\" , n ) ;\n  // 复印件被改，原件一动不动\n  return 0;\n}\n"]
      }
    },
    {
      cid: "c60", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 60 课考试 · 传引用：函数直接改原稿", task: "任务题目：写一个函数把两个数交换，参数表里两只都带引用；调用完把两个数打印出来验证，看它们真的换了没有", hint: "想不起来就回看本课【演示 3】swap_two 那三行、【它被设计成什么样】的两行签名对照，还有那张复印件与外号的图。",
      notes: ["传值是新建一只盒子把实参的值印进去；传引用不新建盒子，把参数名直接接到实参那一格上。", "参数类型后面那个 & 读作引用：给已有的变量再起一个名字，写它就是写正主 —— 和 range-for 里那个 & 是同一个字、同一件事，只是这次写在参数表上。", "把两只参数的 & 全删掉，症状是「很成功地什么都没做」：复印件也是合法的盒子，往里写什么都行，只是没人把结果搬回原件。", "写不写 & 的判断只有一句：这个函数要不要把结果写回调用者的变量？要就加 &，不要就不加。", "带 & 的参数不是只能往里写，外号当然能读，读和写都通着原件；用 return 带回值那条路只能一只手拎一个值，绕不到这种两格互换。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "把这份程序写成能跑的形：请进打印那个头文件，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n\nint main() {", why: "交换的函数写在 main 外面，调用和打印写在 main 里面 —— 先定签名再写函数体，然后调用、验证。" },
        { id: "q2", type: "code", score: 25, coversTask: 1, stem: "写一把真能改到原稿的交换工具：void 开头，圆括号里两只参数都要写成带 & 的样子。", acceptRegex: ["void\\s+\\w+\\s*\\(\\s*int\\s*&\\s*\\w+\\s*,\\s*int\\s*&\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "void swap_two(int& a, int& b) {", why: "类型后面挂一个 &，参数就成了那只变量的外号，写它等于写原件；整个差别就是这一个字符，只带一只就只改得动一只。" },
        { id: "q3", type: "code", score: 25, coversTask: 1, stem: "函数体里三行按顺序写完：先拿一个临时 int 接住第一格的旧值，再把第二格写进第一格，最后把接住的那份放进第二格。", acceptRegex: ["int\\s+(\\w+)\\s*=\\s*(\\w+)\\s*;[\\s\\S]{0,200}?\\2\\s*=\\s*(\\w+)\\s*;[\\s\\S]{0,200}?\\3\\s*=\\s*\\1\\s*;"], acceptOn: "code", sample: "int t = a;\na = b;\nb = t;", why: "不先找个临时盒子接住旧值，第一格一被覆盖，那份旧数据就再也捞不回来了 —— 先存、再覆盖、最后回填。" },
        { id: "q4", type: "code", score: 20, coversTask: 1, stem: "在 main 里备好两只各有初值的 int，把它们按名字递进这把工具。", acceptRegex: ["int\\s+\\w+\\s*=\\s*\\d+\\s*[,;]\\s*(?:int\\s+)?\\w+\\s*=\\s*\\d+\\s*[,;]", "\\w+\\s*\\(\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*;"], acceptOn: "code", sample: "int x = 3, y = 8;\nswap_two(x, y);", why: "引用参数得递一只真实存在的变量：递一个现成的数字会被编译器拦下，大意是「非常量引用只能绑定左值」。" },
        { id: "q5", type: "code", score: 15, coversTask: 1, stem: "打印验证：调用之后用一条 std::println 打出这两只变量，格式串里两个占位坑，逗号后面按顺序给它们。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "std::println(\"交换后 x = {}，y = {}\", x, y);", why: "这一课的失败全都是安静的：& 忘了写照样编译过、照样跑完，只是两个数一个也没换 —— 不打印就等于没检查。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nvoid swap_two(int& a, int& b) {\n    int t = a;\n    a = b;\n    b = t;\n}\n\nint main() {\n    int x = 3, y = 8;\n\n    swap_two(x, y);\n    std::println(\"交换后 x = {}，y = {}\", x, y);\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n\nvoid swap_two(int& a, int& b) {\n}\n\nint main() {\n    return 0;\n}\n",
          "#include <print>\n\nint add_back(int x) {\n    return x + 100;\n}\n\nint main() {\n    int a = 5;\n    std::println(\"{}\", add_back(a));\n    return 0;\n}\n"],
        loose: [
          "#  include < print >\nvoid  swap ( int&  p , int&  q )\n{\n  int  hold = p ;\n  p = q ;\n  q = hold ;\n}\nint  main ( )\n{\n  int m = 1 ;\n  int n = 2 ;\n  swap ( m , n ) ;\n  std::println( \"m {} n {}\" , m , n ) ;\n  return 0;\n}\n"]
      }
    },
    {
      cid: "c61", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 61 课考试 · const 引用：只许看不许摸", task: "任务题目：在只读函数 total 里加一行 v[0] = 0，编译看看报什么错，并说清这条错为什么是在保护你", hint: "想不起来就回看本课【演示 3】那次手滑、【它被设计成什么样】的三种签名对照，还有那张戴手套逛博物馆的图。",
      notes: ["收一只 vector 有三种签名：传值新建一整个副本，安全但慢；引用不复印、可写原件，权力最大；const 引用不复印、只读，只看不摸。", "读的时候三样都一样能使：v.size() 问几个、v[0] 看第一格、for (int x : v) 挨个走一遍，x 是每轮新建的小盒子。", "本来就不许改的那只盒子（const 那只），只有 const 引用才接得住；函数体里一句赋值给参数的话都没有，就该把 const 写上。", "const 只挡写，不挡越界：空盒子里取 v[0] 照样出事，判空得自己写一句，这件事 const 帮不了你。", "小东西（int、bool）传值就好，用 const 引用只是把签名写啰嗦；真正需要它的是装着几千个元素的盒子。判断顺序两问定形态：改不改、大不大。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "请进盒子住的那个头文件：文件顶上写一行 include vector。", acceptRegex: ["#\\s*include\\s*<\\s*vector\\s*>"], acceptOn: "code", sample: "#include <vector>", why: "参数要收 std::vector，就得先请它的头文件；缺这一行报错说的是 std 里没有叫 vector 的名字。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "写出「大盒子只读」的标准签名：一个交回 int 的函数，圆括号里收一只 const 打头、后面带 & 的 std::vector<int>。", acceptRegex: ["int\\s+\\w+\\s*\\(\\s*const\\s+std::vector\\s*<\\s*int\\s*>\\s*&\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "int total(const std::vector<int>& v) {", why: "拆开最好记：& 是为了省下整份拷贝，const 是把这只把手上「能写」的权力收走，叠在一起就是又快又安全。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "函数体里只读地把整盒走完：循环外备一本清零的账本，用 for (int x : 盒子) 挨个累加，最后 return 那本账。", acceptRegex: ["int\\s+\\w+\\s*=\\s*0\\s*;", "for\\s*\\(\\s*int\\s+\\w+\\s*:\\s*\\w+\\s*\\)", "return\\s+\\w+\\s*;"], acceptOn: "code", sample: "int sum = 0;\nfor (int x : v) sum += x;\nreturn sum;", why: "只读的意思是不能写，读法一个都不少：问 size()、取格子、挨个遍历照旧能使，85 加 92 加 78 加 96 得 351。" },
        { id: "q4", type: "code", score: 20, coversTask: 1, stem: "任务那一行：在这个函数体里写一句给盒子第一格赋值的 v[0] = 0; —— 就是要让它编译过不去。", acceptRegex: ["\\w+\\s*\\[\\s*0\\s*\\]\\s*=\\s*0\\s*;"], acceptOn: "code", sample: "v[0] = 0;", why: "想摸原件的那一步被当场拦下：编译不通过，报错停在赋值那一行，说那个位置是只读的 —— 这正是 const 在保护你。" },
        { id: "q5", type: "code", score: 15, coversTask: 1, stem: "编译一次，用一行注释记在旁边：报错停在第几行、里面出现哪个词。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 报错停在赋值这一行：读不出来，那个位置是只读的", why: "这一条只能验你确实记了一行笔记，验不了笔记内容对不对；上一课丢 & 要等跑完才发现，const 这类失败在编译就被拦下，越早暴露的错越便宜。" },
        { id: "q6", type: "code", score: 15, coversTask: 1, stem: "在 main 里用花括号造一只装 int 的盒子递进这把工具，再用一条 std::println 把交回来的总分打出来。", acceptRegex: ["std::vector\\s*<\\s*int\\s*>\\s*\\w+\\s*=\\s*\\{[^}]*\\}", "std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\(\\s*\\w+\\s*\\)\\s*\\)"], acceptOn: "code", sample: "std::vector<int> scores = {85, 92, 78, 96};\nstd::println(\"总分 = {}\", total(scores));", why: "调用处递的是那只盒子本身：不复印、也不许改，函数只是借来看一眼。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <vector>\n\nint total(const std::vector<int>& v) {\n    int sum = 0;\n    v[0] = 0;                      // 报错停在赋值这一行：那个位置是只读的\n    for (int x : v) sum += x;\n    return sum;\n}\n\nint main() {\n    std::vector<int> scores = {85, 92, 78, 96};\n    std::println(\"总分 = {}\", total(scores));\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <vector>\n\nint total(std::vector<int> v) {\n    int sum = 0;\n    for (int x : v) sum += x;\n    return sum;\n}\n\nint main() {\n    std::vector<int> scores = {85, 92, 78, 96};\n    std::println(\"总分 = {}\", total(scores));\n    return 0;\n}\n",
          "#include <print>\n#include <vector>\n\nint total(const std::vector<int>& v) {\n    return 0;\n}\n\nint main() {\n    return 0;\n}\n"],
        loose: [
          "#  include <print>\n#  include < vector >\nint  sum_all ( const std::vector< int > & box )\n{\n  int s = 0 ;\n  box[ 0 ] = 0 ;   // 编译器说这一行是只读的\n  for( int one : box ) s += one ;\n  return s ;\n}\nint main ( )\n{\n  std::vector<int>  aa = {1, 2, 3} ;\n  std::println( \"共 {}\" , sum_all ( aa ) ) ;\n  return 0;\n}\n"]
      }
    },
    {
      cid: "c62", kind: "paper", mode: "ide", authored: "d77a6cb9", file: "main.cpp", pass: 60, title: "第 62 课考试 · 引用妙用：一次带回多个结果", task: "任务题目：给 min_max 再加一个引用参数，顺带把总分也算出来带回 main，三个结果一次打印", hint: "想不起来就回看本课【演示 3】那只多出来的答案格、【它被设计成什么样】的三种出口对照，还有那张递答案格的图。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 22, coversTask: 1, stem: "（任务题）写函数头的参数表：把 min_max 扩成三只答案格，最后那只叫 sum，前两只还是 lo 和 hi，名单照旧只读递进来。", acceptRegex: ["int\\s*&\\s*sum"], acceptOn: "code", sample: "void min_max(const std::vector<int>& v, int& lo, int& hi, int& sum) {", why: "答案形状是 void min_max(const std::vector<int>& v, int& lo, int& hi, int& sum) —— 加一个结果就是加一格，判分只认新加那格的写法 int& sum。" },
        { id: "q2", type: "code", score: 21, coversTask: 1, stem: "（任务题）写一行：把这一轮走到的 x 累加进答案格 sum。", acceptRegex: ["sum\\s*\\+=\\s*x"], acceptOn: "code", sample: "sum += x;", why: "答案形状是 sum += x; —— += 是第 24 课那个复合赋值，而 sum 是外面那只格子的外号，所以这一笔真的留得下来。" },
        { id: "q3", type: "code", score: 28, coversTask: 1, stem: "写一行：在 main 里把三只答案格摆出来 —— lo、hi、新加的 sum，全部从 0 起步。", acceptRegex: ["int\\s+lo\\s*=\\s*0", "sum\\s*=\\s*0"], acceptOn: "code", sample: "int lo = 0, hi = 0, sum = 0;", why: "格子不存在，函数就没有可写的那一格内存。第三只格子 sum 和另外两只一起声明出来，才是把总分带回外面的第一步。" },
        { id: "q4", type: "code", score: 29, coversTask: 1, stem: "写一行：把名单 nums 和 lo、hi、sum 三只格子一起递进 min_max_sum。", acceptRegex: ["min_max_sum\\s*\\(\\s*nums\\s*,\\s*lo\\s*,\\s*hi\\s*,\\s*sum"], acceptOn: "code", sample: "min_max_sum(nums, lo, hi, sum);", why: "签名多了一格，调用处就得多数一个名字。少了递进去的那只 sum，编译器会说实参不够；递错了顺序，写回来的就是别的格子。" }
      ],
      selftest: {
        refs: [
          "#include <vector>\nvoid min_max(const std::vector<int>& v, int& lo, int& hi, int& sum) {\n}\nint main() {\n    sum += x;\n    int lo = 0, hi = 0, sum = 0;\n    min_max_sum(nums, lo, hi, sum);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "void min_max(const std::vector<int>& v, int& lo, int& hi) {",
          "sum = x;",
          "int lo = 0, hi = 0;",
          "min_max_sum(nums, lo, hi);"],
        loose: [
          "#include <vector>\nint main() {\n    min_max(const std::vector<int>& v, int& lo, int& hi, int & sum)\n    sum  +=  x  ;\n    int  lo = 0 , hi = 0 , sum  =  0 ;\n    min_max_sum ( nums ,  lo , hi ,  sum ) ;\n    return 0;\n}\n"]
      }
    },
  ]
};
