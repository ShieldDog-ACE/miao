/* 喵站 · C++ 入门 考卷分部 p11：第 47–50 课（第九轮 · 结构化绑定 + constexpr + using 别名）
 *
 * 每场卷照 cpp-exam/p06.js 的形状与硬指标（cpp-exam-check 逐条对账）：
 *   1. kind:"paper"，题型只用笔试引擎认的六种（choice/multi/blank/code/output/order）；
 *   2. 各题 score 相加正好 100；
 *   3. 源稿每一条【任务】都有题用 coversTask 对着它（序号从 1 起，一条题可盖多条）；
 *   4. 带 coversTask 的题合计 ≥50 分；choice ≥2；output ≥1；
 *   5. 每题带 why；selftest 的 refs 判 100、wrongs 判 <60、loose 判 ≥60。
 *
 * 守的闸线（读者看得见的字段同样受管）：constexpr 是第 49 课、using 别名是第 50 课，
 *   c47 与 c48 的卷面里一律不提这两个关键字；自定义函数定义（51）与 lambda（56）全程不出现。
 *
 * 验收：node --check dev/frontend/assets/data/cpp-exam/p11.js
 *       node dev/tools/cpp-exam-check.cjs --only c47,c48,c49,c50
 */
window.MIAO_CPP_EXAM_P11 = {
  papers: [
    {
      cid: "c47", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 47 课考试 · 结构化绑定拆 pair", task: "任务题目：建一只 pair 存「长 3 宽 4」，用结构化绑定拆开后打印面积；再说清三个值装一箱该换哪种箱子", hint: "想不起来就回看本课【演示 1】的源稿写法、【演示 2】的副本对照，以及【演示 3】的名字写反现场。",
      notes: ["结构化绑定按站位分货：第一个名字拿第一格（也就是 .first 那个值），第二个名字拿第二格，从此不再写 .first 和 .second。", "auto 拆出来的是副本：绑定是真的，拷贝也是真的，改 name 不动箱子里那一份；想同步得用别的写法（以后再讲）。", "名字个数必须和被拆的东西的格数一致，多一个少一个都编译不过；方括号那串必须跟在 auto 后面，写 int [name, age] 会被当场拦下。", "名字随便起、不必沿用原来的成员名，这正是它治「.first 说不出人话」的地方；可名字写反了没人管 —— 个数对得上就合法，编译器不看含义，只会安静地打出一句荒诞的话。", "pair 固定两格，三样东西（科目名、得分、满分）装一箱归 tuple 管，那是以后再讲的课；用两只 pair 凑、或者塞一整串文本进第二格，都是能跑但把三件事拆散。"],
      questions: [
        { id: "q1", type: "code", score: 20, stem: "把这份程序写成能跑的形：请进 pair 住的那个头文件 utility，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*utility\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <utility>\n\nint main() {", why: "pair 住的头文件是 utility；结构化绑定自己不需要额外的头文件，要头文件的是那只箱子。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "建一只 pair 存「长 3 宽 4」：尖括号里两格都写 int，花括号按顺序给 3 和 4。", acceptRegex: ["std::pair\\s*<\\s*int\\s*,\\s*int\\s*>\\s*\\w+\\s*=\\s*\\{\\s*3\\s*,\\s*4\\s*\\}"], acceptOn: "code", sample: "std::pair<int, int> rect = {3, 4};", why: "pair 天生固定两格，第一格是长、第二格是宽，装进去的顺序就是站位顺序。" },
        { id: "q3", type: "code", score: 25, coversTask: 1, stem: "一次拆出两个有名有姓的变量：写一行 auto，方括号里给两个名字，等号右边是那两只格子所在的箱子。", acceptRegex: ["auto\\s*\\[\\s*\\w+\\s*,\\s*\\w+\\s*\\]\\s*=\\s*\\w+\\s*;"], acceptOn: "code", sample: "auto [chang, kuan] = rect;", why: "名字个数必须和格数严丝合缝：三个名字对两格是「绑定的声明太多」，一个名字对两格是「绑定的声明太少」，都编译不过；那串方括号只配跟在 auto 后面。" },
        { id: "q4", type: "code", score: 20, coversTask: 1, stem: "用一条 std::println 把面积打出来：格式串里一个占位坑，逗号后面给那两个名字相乘，别再写 .first 和 .second。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\*\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "std::println(\"面积 = {}\", chang * kuan);", why: "结构化绑定按站位分货：第一个名字拿第一格 3、第二个名字拿第二格 4，相乘得 12 —— 这正是它替你说人话的地方。" },
        { id: "q5", type: "code", score: 15, coversTask: 2, stem: "任务第 2 条：格数不止两个的箱子不归 pair 管 —— 用一行注释写下那种箱子叫什么。", acceptRegex: ["//[^\\n]{0,40}tuple"], acceptOn: "buffer", sample: "// 三个值装一箱要换 tuple，pair 固定只有两格", why: "这一条只能验你把那个名字写进了注释，验不了你说得完整不完整 —— 本课 pair 只教了两格，三格的箱子这一场判不了代码。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <string>\n#include <utility>\n\nint main() {\n    std::pair<int, int> rect = {3, 4};\n\n    auto [chang, kuan] = rect;\n    std::println(\"面积 = {}\", chang * kuan);\n\n    // 三个值装一箱要换 tuple，pair 固定只有两格\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <utility>\n\nint main() {\n    std::pair<int, int> rect = {3, 4};\n    std::println(\"面积 = {}\", rect.first * rect.second);\n    return 0;\n}\n",
          "int main() {\n    std::pair<int, int> r = {3, 4};\n    auto [a, b] = r;\n    return 0;\n}\n"],
        loose: [
          "#  include <print>\n#  include < utility >\n\nint  main ( )\n{\n  std::pair< int , int >  box = { 3 , 4 } ;\n  auto [ c1 , c2 ] = box ;\n  std::println( \"{}\" , c1 * c2 ) ;\n  // 三样东西一箱：pair 两格不够，得换 tuple\n  return 0;\n}\n"]
      }
    },
    {
      cid: "c48", kind: "paper", mode: "ide", authored: "5092302c", file: "main.cpp", pass: 60, title: "第 48 课考试 · 绑定遍历成绩表", task: "任务题目：给成绩表再加两行你自己的科目和分数，说出整张表逐行拆出来的输出；再在遍历的时候顺便找出最高分（说清记最高分的那个格子为什么必须在循环外面）", hint: "想不起来就回看本课【演示 2】的两处分工，以及【演示 3】的「改的是复印件」现场。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 19, coversTask: 1, stem: "（任务题）在已有的那张成绩表的初始化列表里，照原有格式再补两行你自己的科目和分数：花括号里写「字符串、逗号、整数」，两行之间用逗号隔开。", acceptRegex: ["\\{\\s*\"[^\"]+\"\\s*,\\s*[0-9]+\\s*\\}"], acceptOn: "code", sample: "{\"体育\", 100}, {\"历史\", 92}", why: "一行一个 {\"科目\", 分数}，整串塞在 = { …… }; 里就行；你写的先后顺序，就是以后遍历时的输出顺序。" },
        { id: "q2", type: "code", score: 24, coversTask: 2, stem: "（任务题）循环外面已经备好 int best = 0; 和 std::string best_name = \"\";。请写在 for (auto [subject, score] : scores) 的花括号里：这一轮的分数比 best 高时，把分数记进 best、把科目记进 best_name。", acceptRegex: ["if\\s*\\(\\s*score\\s*>\\s*best\\s*\\)", "best\\s*=\\s*score", "best_name\\s*="], acceptOn: "code", sample: "if (score > best) {\n    best = score;\n    best_name = subject;\n}", why: "骨架就是 if (score > best) { best = score; best_name = subject; }。比较用刚拆出来的 score，两个格子要一起换 —— 只换分数不换科目，就会打出「145 分，但不知道是哪一科」。" },
        { id: "q3", type: "code", score: 28, coversTask: 1, stem: "（任务题）写一行 for 的循环头：把 scores 这张表一轮拆一行，方括号里两个名字自己起，左边接科目名、右边接分数。", acceptRegex: ["for\\s*\\(\\s*auto\\s*\\[\\s*\\w+\\s*,\\s*\\w+\\s*\\]\\s*:\\s*scores\\s*\\)"], acceptOn: "code", sample: "for (auto [subject, score] : scores)", why: "range-for 每轮递一只 pair 到拆包台，方括号里两个名字按顺序接住两格，冒号右边是被拆的那张表。" },
        { id: "q4", type: "code", score: 29, coversTask: 2, stem: "（任务题）在 for 循环的外面写两行声明：整数格子 best 初值 0，字符串格子 best_name 初值是空串 —— 它们要活过整个循环。", acceptRegex: ["int\\s+best\\s*=\\s*0\\s*;", "string\\s+best_name\\s*=\\s*\"\"\\s*;"], acceptOn: "code", sample: "int best = 0;\nstd::string best_name = \"\";", why: "记数格摆在循环外面才跨轮存活；摆进循环里的话每轮开头都被抹回 0，最后只剩最后一行的比较结果。" }
      ],
      selftest: {
        refs: [
          "#include <string>\nint main() {\n    {\"体育\", 100}, {\"历史\", 92}\n    if (score > best) {\n    best = score;\n    best_name = subject;\n    }\n    for (auto [subject, score] : scores)\n    int best = 0;\n    std::string best_name = \"\";\n    return 0;\n}\n"],
        wrongs: [
          "",
          "{\"体育\", 100}",
          "best = score;",
          "for (int i = 0; i < 5; i++) {\n    std::println(\"{}\", i);\n}",
          "int best = 0;"],
        loose: [
          "#include <string>\nint main() {\n    { \"历史\", 92 } , { \"体育\", 100 }\n    if(score>best){ best=score; best_name=subject ; }\n    for(  auto  [  ke  ,  fs  ]  :  scores  )\n    int   best  =  0  ;\n    std::string   best_name  =  \"\"  ;\n    return 0;\n}\n"]
      }
    },
    {
      cid: "c49", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 49 课考试 · constexpr 编译期常量", task: "任务题目：用 constexpr 算出「每天跑 2 圈、20 周共跑几圈」并把结果也写成 constexpr；再把源稿那行 constexpr 改成 const 编译一遍，说清两个都能过时它们的区别在哪", hint: "想不起来就回看本课【演示 2】的三行规则加一行计算，以及【演示 3】那个键盘输入被当场拒绝的对照。",
      notes: ["constexpr 是给编译器派活儿（当场交货），const 只是不让你改：值可以晚一点才知道，也能交给 const。", "写 constexpr int n;（只声明先不给值）会被编译器当场拒绝；constexpr 必须声明当场就算得出值。", "把键盘读来的数交给 constexpr，编译器会说「初始化表达式不是常量表达式」；同一个数交给 const 完全合法。", "编译期算完就烧进程序里，运行时不必再算一遍，这是零成本的来历；右边只要全是编译期已知的东西就可以做运算，不必写成字面量。", "constexpr 是 constant expression 的缩写，重点是「现在就算得出来」而不是「不能改」；const 管改不改（人的规矩），constexpr 管什么时候定（编译器的活儿）。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "用 constexpr 把「每天跑 2 圈」和「一共 20 周」这两件事各定成一个编译期就钉死的 int。", acceptRegex: ["constexpr\\s+int\\s+\\w+\\s*=\\s*2\\s*;", "constexpr\\s+int\\s+\\w+\\s*=\\s*20\\s*;"], acceptOn: "code", sample: "constexpr int LAPS_PER_DAY = 2;\nconstexpr int WEEKS = 20;", why: "constexpr 必须声明当场就能算出值，先声明再给它赋值的路子不通；名字全大写加下划线是让人一眼看出别去动它。" },
        { id: "q2", type: "code", score: 25, coversTask: 1, stem: "再开一个 constexpr：等号右边用乘号把前面那两个名字乘起来，编译期把总圈数算完。", acceptRegex: ["constexpr\\s+int\\s+\\w+\\s*=\\s*\\w+\\s*\\*\\s*\\w+"], acceptOn: "code", sample: "constexpr int TOTAL_LAPS = LAPS_PER_DAY * 7 * WEEKS;", why: "右边只要全是编译期已知的东西就可以做运算，不必写成字面量；这一次乘法在编译期就做完了，运行时拿到的已经是成品数。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "用一条 std::println 把总圈数打出来：格式串里一个占位坑，逗号后面给那个编译期算好的名字。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "std::println(\"一共跑 {} 圈\", TOTAL_LAPS);", why: "2 乘 7 乘 20 是 280；编译期算完就烧进程序里，运行时只是拿来用，这正是零成本的来历。" },
        { id: "q4", type: "code", score: 20, coversTask: 2, stem: "任务第 2 条：把同样一行乘法的 constexpr 换成 const 再写一遍，让它和上面那行摆在一起编译。", acceptRegex: ["\\bconst\\s+int\\s+\\w+\\s*=\\s*\\w+\\s*\\*\\s*\\w+"], acceptOn: "code", sample: "const int TOTAL_LAPS_2 = LAPS_PER_DAY * 7 * WEEKS;", why: "15 乘 365 什么时候算都算得出来，所以两种写法都能编译 —— 差别在承诺的方向：constexpr 是给编译器派活儿，const 只是不让你改。" },
        { id: "q5", type: "code", score: 20, coversTask: 2, stem: "在那一行旁边用一行注释写下你琢磨到的区别：谁当场交货，谁只管不许改。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 都过：constexpr 要求编译期就算出来，const 只保证之后不许改", why: "这一条只能验你确实记了一行笔记，验不了笔记内容对不对 —— 「琢磨区别」这件事本身是这块编辑器判不动的部分。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint main() {\n    constexpr int LAPS_PER_DAY = 2;\n    constexpr int WEEKS = 20;\n    constexpr int TOTAL_LAPS = LAPS_PER_DAY * 7 * WEEKS;\n\n    std::println(\"一共跑 {} 圈\", TOTAL_LAPS);\n\n    const int TOTAL_LAPS_2 = LAPS_PER_DAY * 7 * WEEKS;   // 都过：constexpr 要求编译期就算出来，const 只保证之后不许改\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n\nint main() {\n    constexpr int LAPS_PER_DAY = 2;\n    constexpr int WEEKS = 20;\n    return 0;\n}\n",
          "#include <print>\n\nint main() {\n    int laps_per_day = 2;\n    int weeks = 20;\n    const int total = laps_per_day * 7 * weeks;\n    std::println(\"一共跑 {} 圈\", total);\n    return 0;\n}\n"],
        loose: [
          "#  include <print>\nint main ( )\n{\n  constexpr int per_day =2;\n  constexpr int  n_weeks  = 20 ;\n  constexpr int all = per_day * 7 * n_weeks ;\n  std::println( \"共 {} 圈\" , all ) ;\n  const int also_ok = per_day * n_weeks ;  // constexpr 是编译期算好，const 只是不许改\n  return 0;\n}\n"]
      }
    },
    {
      cid: "c50", kind: "paper", mode: "ide", authored: "6dc6f973", file: "main.cpp", pass: 60, title: "第 50 课考试 · using 类型别名", task: "任务题目：给 double 起别名 Height，用它存身高并打印；给 vector<int> 起别名 ScoreList，装三个分数并用遍历逐个打印", hint: "想不起来就回看本课【演示 2】那两个别名怎么立起来，以及【演示 3】里别名救不了的那次赋值。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 24, coversTask: 1, stem: "（任务题）给 double 起一个别名叫 Height；用它声明一个变量存 1.75；再用 std::println 把身高打印出来。三处都要写。", acceptRegex: ["using\\s+Height\\s*=\\s*double\\s*;", "Height\\s+\\w+\\s*=\\s*1\\.75", "println"], acceptOn: "code", sample: "using Height = double;\nHeight my_height = 1.75;\nstd::println(\"身高 {} 米\", my_height);", why: "骨架是 using Height = double; → Height my_height = 1.75; → std::println(\"身高 {} 米\", my_height);。别名右边必须选 double，因为身高带小数。" },
        { id: "q2", type: "code", score: 24, coversTask: 2, stem: "（任务题）给「一串整数分数」起别名叫 ScoreList（等号右边是 std::vector<int>）；用它声明一个装了三个分数的变量；再用 range-for 逐个打印。", acceptRegex: ["using\\s+ScoreList\\s*=\\s*std::vector\\s*<\\s*int\\s*>\\s*;", "ScoreList\\s+\\w+\\s*=\\s*\\{", "for\\s*\\("], acceptOn: "code", sample: "using ScoreList = std::vector<int>;\nScoreList three = {95, 145, 88};\nfor (auto one : three) {\n    std::println(\"- {}\", one);\n}", why: "三行分工要清楚：using ScoreList = std::vector<int>; 立别名，ScoreList three = {95, 145, 88}; 用它声明并填三个数，for (auto one : three) 遍历 —— 别名的价值就体现在这一行短了。" },
        { id: "q3", type: "code", score: 24, coversTask: 1, stem: "（任务题）上一行已经写好 using Height = double;。写一行：用 Height 当类型，声明一个变量存 1.75。", acceptRegex: ["Height\\s+\\w+\\s*=\\s*1\\.75\\s*;"], acceptOn: "code", sample: "Height my_height = 1.75;", why: "别名一旦立好，Height 就是 double 的另一个拼写，声明变量时直接把它写在类型那一格，小数那一截也留得住。" },
        { id: "q4", type: "code", score: 28, coversTask: 2, stem: "（任务题）上一行已经写好 using ScoreList = std::vector<int>;。写一行：用 ScoreList 当类型，声明一个变量，花括号里按顺序给三个整数分数。", acceptRegex: ["ScoreList\\s+\\w+\\s*=\\s*\\{\\s*-?\\d+\\s*,\\s*-?\\d+\\s*,\\s*-?\\d+\\s*\\}"], acceptOn: "code", sample: "ScoreList three = {95, 145, 88};", why: "那一长串嵌套类型已经在 using 那行写完了，这里只需要把 ScoreList 当类型名用，花括号里三个数按顺序进容器。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <vector>\nint main() {\n    using Height = double;\n    Height my_height = 1.75;\n    std::println(\"身高 {} 米\", my_height);\n    using ScoreList = std::vector<int>;\n    ScoreList three = {95, 145, 88};\n    for (auto one : three) {\n    std::println(\"- {}\", one);\n    }\n    Height my_height = 1.75;\n    ScoreList three = {95, 145, 88};\n    return 0;\n}\n"],
        wrongs: [
          "",
          "using Height = int;\nHeight h = 1.75;",
          "std::vector<int> three = {95, 145, 88};\nstd::println(\"{}\", three);",
          "std::string my_height = 1.75;",
          "std::vector<int> three = {95, 145};"],
        loose: [
          "#include <print>\n#include <vector>\nint main() {\n    using  Height = double ;\n    Height h=1.75;\n    std::println(\"身高 {} 米\", h);\n    using ScoreList = std::vector < int > ;\n    ScoreList s = { 95 , 145 , 88 } ;\n    for(auto one : s){ println(\"- {}\", one) ; }\n    Height   h1  =  1.75  ;\n    ScoreList   s  =  {  95 , 145 ,  88  }  ;\n    return 0;\n}\n"]
      }
    },
  ]
};
