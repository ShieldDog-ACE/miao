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
      cid: "c47", kind: "paper", mode: "quiz", pass: 60, title: "第 47 课考试 · 结构化绑定拆 pair", task: "任务题目：建一只 pair 存「长 3 宽 4」，用结构化绑定拆开后打印面积；再说清三个值装一箱该换哪种箱子", hint: "想不起来就回看本课【演示 1】的源稿写法、【演示 2】的副本对照，以及【演示 3】的名字写反现场。",
      questions: [
        { id: "q1", type: "output", score: 27, coversTask: 1, stem: "已有 std::pair<int, int> rect = {3, 4};（第一格是长、第二格是宽）。这段程序打印什么？（一行一条）\nauto [chang, kuan] = rect;\nstd::println(\"面积 = {}\", chang * kuan);", acceptLines: ["面积 = 12"], why: "结构化绑定按站位分货：第一个名字拿第一格 3，第二个名字拿第二格 4，相乘得 12 —— 全程没写一次 .first / .second。" },
        { id: "q2", type: "choice", score: 23, coversTask: 2, stem: "现在一只箱子要装三样东西（科目名、得分、满分）。按本课的说法，正确的做法是？", options: ["换 tuple：格数不止两个的箱子归它管，拆的时候方括号里写三个名字", "再拉一只 pair 拼在后面，用两只箱子凑三样", "把第二格写成 \"语文,90,100\" 这样一整串文本塞进去", "pair 想装几格装几格，方括号里多写一个名字就行"], answer: 0, why: "pair 天生固定两格，名字个数必须和格数严丝合缝；三样东西归 tuple（源稿点的那件事，以后再讲，先混个脸熟）。B、C 是能跑但把三件事拆散，D 直接编译不过。" },
        { id: "q3", type: "choice", score: 10, stem: "auto [name, age] = student; 之后写了一句 name = \"小红\";。此时 student.first 是什么？", options: ["也变成 小红，因为它们是绑在一起的", "还是原来的值 —— auto 拆出来的是副本", "编译报错，绑定出来的变量不许赋值", "变成空字符串"], answer: 1, why: "绑定是真的，auto 的拷贝也是真的：name 和 student.first 是两份内存里的两个值，改口袋不动箱子。想同步得用别的写法（以后再讲）。" },
        { id: "q4", type: "blank", score: 9, stem: "结构化绑定左边那串方括号，必须跟在____这个关键字后面（几个成员、各是什么类型，全由右边那只箱子推出来）。", accept: ["auto", "auto 关键字", "自动推导"], why: "写 int [name, age] = student; 会被编译器在方括号处当场拦下，报错大意是「这个声明不合法」—— 只有 auto 这一类才配得上这串方括号。" },
        { id: "q5", type: "multi", score: 12, stem: "下面关于结构化绑定的说法，哪些是对的？（多选，错勾任何一项整题 0 分）", options: ["名字个数必须和被拆的东西的格数一致，多一个少一个都编译不过", "第一个名字拿的是第一格（也就是 .first 那个值），第二个名字拿第二格", "方括号里的名字必须沿用原来的成员名，不能自己起", "结构化绑定自己不需要额外的头文件，要头文件的是 pair"], answers: [0, 1, 3], why: "第三条正好说反了：名字随便起，这正是它治「.first 说不出人话」的地方；其余三条都是本课的正面结论，pair 住的头文件是 utility。" },
        { id: "q6", type: "output", score: 9, stem: "student 的第一格是 \"小明\"、第二格是 15。这段程序打印什么？（一行一条）\nauto [score, name] = student;\nstd::println(\"{}, {}\", score, name);", acceptLines: ["小明, 15"], why: "个数对得上就合法，编译器不看名字的含义：score 接住第一格（姓名）、name 接住第二格（分数），屏幕上是一句荒诞的话，却没有一行红字。" },
        { id: "q7", type: "order", score: 10, stem: "把「用结构化绑定拆 pair」这件事的四个动作排成正确顺序。", answer: [0, 1, 2, 3], steps: ["声明一只 pair，把两个值按顺序装进去", "写 auto [名字1, 名字2] = 那只箱子;", "核对名字个数和格数一致（pair 是两格）", "直接用这两个名字读写，不再写 .first / .second"], why: "先有箱子再拆；拆的时候个数必须对上，这一步是编译器替你把关；核对完才敢用名字干活 —— 顺序换成先拆再核，报错就晚了。" }
      ],
      selftest: {
        refs: [
          {q1: "面积 = 12", q2: 0, q3: 1, q4: "auto", q5: [0, 1, 3], q6: "小明, 15", q7: [0, 1, 2, 3]}],
        wrongs: [
          {q1: "面积 = 7", q2: 3, q3: 0, q4: "pair", q5: [0, 1, 2], q6: "15, 小明", q7: [0, 2, 1, 3]}],
        loose: [
          {q1: " 面积 = 12 ", q2: "0", q3: "1", q4: "AUTO", q5: [0, 1, 3], q6: "小明, 15 ", q7: [0, 1, 2, 3]}]
      }
    },
    {
      cid: "c48", kind: "paper", mode: "code", authored: "5092302c", pass: 60, title: "第 48 课考试 · 绑定遍历成绩表", task: "任务题目：给成绩表再加两行你自己的科目和分数，说出整张表逐行拆出来的输出；再在遍历的时候顺便找出最高分（说清记最高分的那个格子为什么必须在循环外面）", hint: "想不起来就回看本课【演示 2】的两处分工，以及【演示 3】的「改的是复印件」现场。",
      questions: [
        { id: "q1", type: "code", score: 19, coversTask: 1, stem: "（任务题）在已有的那张成绩表的初始化列表里，照原有格式再补两行你自己的科目和分数：花括号里写「字符串、逗号、整数」，两行之间用逗号隔开。", acceptRegex: ["\\{\\s*\"[^\"]+\"\\s*,\\s*[0-9]+\\s*\\}"], sample: "{\"体育\", 100}, {\"历史\", 92}", why: "一行一个 {\"科目\", 分数}，整串塞在 = { …… }; 里就行；你写的先后顺序，就是以后遍历时的输出顺序。" },
        { id: "q2", type: "code", score: 24, coversTask: 2, stem: "（任务题）循环外面已经备好 int best = 0; 和 std::string best_name = \"\";。请写在 for (auto [subject, score] : scores) 的花括号里：这一轮的分数比 best 高时，把分数记进 best、把科目记进 best_name。", acceptRegex: ["if\\s*\\(\\s*score\\s*>\\s*best\\s*\\)", "best\\s*=\\s*score", "best_name\\s*="], sample: "if (score > best) {\n    best = score;\n    best_name = subject;\n}", why: "骨架就是 if (score > best) { best = score; best_name = subject; }。比较用刚拆出来的 score，两个格子要一起换 —— 只换分数不换科目，就会打出「145 分，但不知道是哪一科」。" },
        { id: "q3", type: "code", score: 28, coversTask: 1, stem: "（任务题）写一行 for 的循环头：把 scores 这张表一轮拆一行，方括号里两个名字自己起，左边接科目名、右边接分数。", acceptRegex: ["for\\s*\\(\\s*auto\\s*\\[\\s*\\w+\\s*,\\s*\\w+\\s*\\]\\s*:\\s*scores\\s*\\)"], sample: "for (auto [subject, score] : scores)", why: "range-for 每轮递一只 pair 到拆包台，方括号里两个名字按顺序接住两格，冒号右边是被拆的那张表。" },
        { id: "q4", type: "code", score: 29, coversTask: 2, stem: "（任务题）在 for 循环的外面写两行声明：整数格子 best 初值 0，字符串格子 best_name 初值是空串 —— 它们要活过整个循环。", acceptRegex: ["int\\s+best\\s*=\\s*0\\s*;", "string\\s+best_name\\s*=\\s*\"\"\\s*;"], sample: "int best = 0;\nstd::string best_name = \"\";", why: "记数格摆在循环外面才跨轮存活；摆进循环里的话每轮开头都被抹回 0，最后只剩最后一行的比较结果。" }
      ],
      selftest: {
        refs: [
          {q1: "{\"体育\", 100}, {\"历史\", 92}", q2: "if (score > best) {\n    best = score;\n    best_name = subject;\n}", q3: "for (auto [subject, score] : scores) {\n    std::println(\"{} {}\", subject, score);\n}", q4: "int best = 0;\nstd::string best_name = \"\";"}],
        wrongs: [
          {q1: "{\"体育\", 100}", q2: "best = score;", q3: "for (int i = 0; i < 5; i++) {\n    std::println(\"{}\", i);\n}", q4: "int best = 0;"}],
        loose: [
          {q1: "{ \"历史\", 92 } , { \"体育\", 100 }", q2: "if(score>best){ best=score; best_name=subject ; }", q3: "for(  auto  [  ke  ,  fs  ]  :  scores  )", q4: "int   best  =  0  ;\n   std::string   best_name  =  \"\"  ;"}]
      }
    },
    {
      cid: "c49", kind: "paper", mode: "quiz", pass: 60, title: "第 49 课考试 · constexpr 编译期常量", task: "任务题目：用 constexpr 算出「每天跑 2 圈、20 周共跑几圈」并把结果也写成 constexpr；再把源稿那行 constexpr 改成 const 编译一遍，说清两个都能过时它们的区别在哪", hint: "想不起来就回看本课【演示 2】的三行规则加一行计算，以及【演示 3】那个键盘输入被当场拒绝的对照。",
      questions: [
        { id: "q1", type: "output", score: 28, coversTask: 1, stem: "这段程序打印什么？（一行）\nconstexpr int LAPS_PER_DAY = 2;\nconstexpr int WEEKS = 20;\nconstexpr int TOTAL = LAPS_PER_DAY * 7 * WEEKS;\nstd::println(\"一共 {} 圈\", TOTAL);", acceptLines: ["一共 280 圈"], why: "2 乘 7 乘 20 等于 280；这一次乘法在编译期就做完了，程序运行时拿到的已经是成品数，没有一行计算的机器代码。" },
        { id: "q2", type: "choice", score: 22, coversTask: 2, stem: "把源稿那行 constexpr int WORDS_PER_YEAR = WORDS_PER_DAY * 365; 改成 const，编译能过吗？区别在哪？", options: ["过不了：const 不能参与乘法运算", "照样过；区别是 constexpr 要求编译期就把值算出来，const 只保证之后不许改，值可以晚一点才知道", "过不了：const 只能配字面量，不能配运算", "照样过，而且两者完全等价，没有任何区别"], answer: 1, why: "15 乘 365 什么时候算都算得出来，所以两种写法都能编译。差别在承诺的方向：constexpr 是给编译器派活儿（当场交货），const 只是不让你改。" },
        { id: "q3", type: "choice", score: 14, stem: "下面哪种写法会被编译器当场拒绝？", options: ["constexpr int n = 15 * 365;", "constexpr int n;（只声明，先不给值）", "const int n = 键盘读来的数;", "constexpr double pi = 3.14;"], answer: 1, why: "constexpr 必须声明当场就能算出值，先声明再赋值的路子不通。C 是合法的 —— const 只管「之后不许改」，值来自运行时完全没问题；A 和 D 都是编译期算得出来的写法。" },
        { id: "q4", type: "blank", score: 10, stem: "constexpr 这个关键字是 constant ____ 的缩写，意思是「这个值是编译期就能算出来的表达式」。", accept: ["expression", "表达式", "constant expression"], why: "名字本身就是说明书：constant（常量）+ expression（表达式），重点不在于「不能改」，而在于「现在就算得出来」。" },
        { id: "q5", type: "multi", score: 14, stem: "下列关于 constexpr 的说法，哪些是对的？（多选，错勾任何一项整题 0 分）", options: ["右边只要全是编译期已知的东西，就可以做运算，不必写成字面量", "把键盘读来的数交给 constexpr，编译器会说「初始化表达式不是常量表达式」", "constexpr 的值虽然编译期算过，运行时还得再算一遍", "命名用全大写加下划线，是让人一眼看出这是钉死的数、别去动它"], answers: [0, 1, 3], why: "第三条说反了：编译期算完就烧进程序里，运行时只是拿来用，这正是「零成本」的来历；其余三条都是本课的正面结论。" },
        { id: "q6", type: "blank", score: 12, stem: "一句话记两个关键字：const 承诺「之后不许____」，constexpr 承诺「现在就算得出来」。", accept: ["改", "修改", "改变", "变"], why: "const 管的是改不改（人的规矩），constexpr 管的是什么时候定（编译器的活儿）。方向不同，才能一个接得住键盘输入、一个接不住。" }
      ],
      selftest: {
        refs: [
          {q1: "一共 280 圈", q2: 1, q3: 1, q4: "expression", q5: [0, 1, 3], q6: "改"}],
        wrongs: [
          {q1: "一共 560 圈", q2: 3, q3: 2, q4: "declaration", q5: [0, 2], q6: "读"}],
        loose: [
          {q1: " 一共 280 圈 ", q2: "1", q3: 1, q4: "EXPRESSION", q5: [0, 1, 3], q6: "变"}]
      }
    },
    {
      cid: "c50", kind: "paper", mode: "code", authored: "6dc6f973", pass: 60, title: "第 50 课考试 · using 类型别名", task: "任务题目：给 double 起别名 Height，用它存身高并打印；给 vector<int> 起别名 ScoreList，装三个分数并用遍历逐个打印", hint: "想不起来就回看本课【演示 2】那两个别名怎么立起来，以及【演示 3】里别名救不了的那次赋值。",
      questions: [
        { id: "q1", type: "code", score: 24, coversTask: 1, stem: "（任务题）给 double 起一个别名叫 Height；用它声明一个变量存 1.75；再用 std::println 把身高打印出来。三处都要写。", acceptRegex: ["using\\s+Height\\s*=\\s*double\\s*;", "Height\\s+\\w+\\s*=\\s*1\\.75", "println"], sample: "using Height = double;\nHeight my_height = 1.75;\nstd::println(\"身高 {} 米\", my_height);", why: "骨架是 using Height = double; → Height my_height = 1.75; → std::println(\"身高 {} 米\", my_height);。别名右边必须选 double，因为身高带小数。" },
        { id: "q2", type: "code", score: 24, coversTask: 2, stem: "（任务题）给「一串整数分数」起别名叫 ScoreList（等号右边是 std::vector<int>）；用它声明一个装了三个分数的变量；再用 range-for 逐个打印。", acceptRegex: ["using\\s+ScoreList\\s*=\\s*std::vector\\s*<\\s*int\\s*>\\s*;", "ScoreList\\s+\\w+\\s*=\\s*\\{", "for\\s*\\("], sample: "using ScoreList = std::vector<int>;\nScoreList three = {95, 145, 88};\nfor (auto one : three) {\n    std::println(\"- {}\", one);\n}", why: "三行分工要清楚：using ScoreList = std::vector<int>; 立别名，ScoreList three = {95, 145, 88}; 用它声明并填三个数，for (auto one : three) 遍历 —— 别名的价值就体现在这一行短了。" },
        { id: "q3", type: "code", score: 24, coversTask: 1, stem: "（任务题）上一行已经写好 using Height = double;。写一行：用 Height 当类型，声明一个变量存 1.75。", acceptRegex: ["Height\\s+\\w+\\s*=\\s*1\\.75\\s*;"], sample: "Height my_height = 1.75;", why: "别名一旦立好，Height 就是 double 的另一个拼写，声明变量时直接把它写在类型那一格，小数那一截也留得住。" },
        { id: "q4", type: "code", score: 28, coversTask: 2, stem: "（任务题）上一行已经写好 using ScoreList = std::vector<int>;。写一行：用 ScoreList 当类型，声明一个变量，花括号里按顺序给三个整数分数。", acceptRegex: ["ScoreList\\s+\\w+\\s*=\\s*\\{\\s*-?\\d+\\s*,\\s*-?\\d+\\s*,\\s*-?\\d+\\s*\\}"], sample: "ScoreList three = {95, 145, 88};", why: "那一长串嵌套类型已经在 using 那行写完了，这里只需要把 ScoreList 当类型名用，花括号里三个数按顺序进容器。" }
      ],
      selftest: {
        refs: [
          {q1: "using Height = double;\nHeight my_height = 1.75;\nstd::println(\"身高 {} 米\", my_height);", q2: "using ScoreList = std::vector<int>;\nScoreList three = {95, 145, 88};\nfor (auto one : three) {\n    std::println(\"- {}\", one);\n}", q3: "Height my_height = 1.75;", q4: "ScoreList three = {95, 145, 88};"}],
        wrongs: [
          {q1: "using Height = int;\nHeight h = 1.75;", q2: "std::vector<int> three = {95, 145, 88};\nstd::println(\"{}\", three);", q3: "std::string my_height = 1.75;", q4: "std::vector<int> three = {95, 145};"}],
        loose: [
          {q1: "using  Height = double ;\nHeight h=1.75;\nstd::println(\"身高 {} 米\", h);", q2: "using ScoreList = std::vector < int > ;\nScoreList s = { 95 , 145 , 88 } ;\nfor(auto one : s){ println(\"- {}\", one) ; }", q3: "Height   h1  =  1.75  ;", q4: "ScoreList   s  =  {  95 , 145 ,  88  }  ;"}]
      }
    },
  ]
};
