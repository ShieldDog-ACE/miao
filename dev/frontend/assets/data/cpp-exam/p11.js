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
      cid: "c47", kind: "paper", pass: 60,
      title: "第 47 课考试 · 结构化绑定拆 pair",
      task: "任务题目：建一只 pair 存「长 3 宽 4」，用结构化绑定拆开后打印面积；再说清三个值装一箱该换哪种箱子",
      hint: "想不起来就回看本课【演示 1】的源稿写法、【演示 2】的副本对照，以及【演示 3】的名字写反现场。",
      questions: [
        { id: "q1", type: "output", score: 18,
          coversTask: 1,
          stem: "已有 std::pair<int, int> rect = {3, 4};（第一格是长、第二格是宽）。这段程序打印什么？（一行一条）\nauto [chang, kuan] = rect;\nstd::println(\"面积 = {}\", chang * kuan);",
          acceptLines: ["面积 = 12"],
          why: "结构化绑定按站位分货：第一个名字拿第一格 3，第二个名字拿第二格 4，相乘得 12 —— 全程没写一次 .first / .second。" },
        { id: "q2", type: "code", score: 18,
          coversTask: 1,
          stem: "（任务题）声明一只装整数长和宽的 pair，值是 3 和 4；用 auto 加方括号一次拆成两个名字；最后用 std::println 打印这两个名字的乘积。三处都要写出来。",
          acceptRegex: ["pair\\s*<\\s*int\\s*,\\s*int\\s*>", "auto\\s*\\[\\s*\\w+\\s*,\\s*\\w+\\s*\\]\\s*=", "\\*"],
          why: "骨架是 std::pair<int, int> rect = {3, 4}; → auto [a, b] = rect; → std::println(\"{}\", a * b);。类型交给 auto 推，名字自己起，乘积用星号。" },
        { id: "q3", type: "choice", score: 16,
          coversTask: 2,
          stem: "现在一只箱子要装三样东西（科目名、得分、满分）。按本课的说法，正确的做法是？",
          options: ["换 tuple：格数不止两个的箱子归它管，拆的时候方括号里写三个名字", "再拉一只 pair 拼在后面，用两只箱子凑三样", "把第二格写成 \"语文,90,100\" 这样一整串文本塞进去", "pair 想装几格装几格，方括号里多写一个名字就行"],
          answer: 0,
          why: "pair 天生固定两格，名字个数必须和格数严丝合缝；三样东西归 tuple（源稿点的那件事，以后再讲，先混个脸熟）。B、C 是能跑但把三件事拆散，D 直接编译不过。" },
        { id: "q4", type: "choice", score: 10,
          stem: "auto [name, age] = student; 之后写了一句 name = \"小红\";。此时 student.first 是什么？",
          options: ["也变成 小红，因为它们是绑在一起的", "还是原来的值 —— auto 拆出来的是副本", "编译报错，绑定出来的变量不许赋值", "变成空字符串"],
          answer: 1,
          why: "绑定是真的，auto 的拷贝也是真的：name 和 student.first 是两份内存里的两个值，改口袋不动箱子。想同步得用别的写法（以后再讲）。" },
        { id: "q5", type: "blank", score: 8,
          stem: "结构化绑定左边那串方括号，必须跟在____这个关键字后面（几个成员、各是什么类型，全由右边那只箱子推出来）。",
          accept: ["auto", "auto 关键字", "自动推导"],
          why: "写 int [name, age] = student; 会被编译器在方括号处当场拦下，报错大意是「这个声明不合法」—— 只有 auto 这一类才配得上这串方括号。" },
        { id: "q6", type: "multi", score: 12,
          stem: "下面关于结构化绑定的说法，哪些是对的？（多选，错勾任何一项整题 0 分）",
          options: ["名字个数必须和被拆的东西的格数一致，多一个少一个都编译不过", "第一个名字拿的是第一格（也就是 .first 那个值），第二个名字拿第二格", "方括号里的名字必须沿用原来的成员名，不能自己起", "结构化绑定自己不需要额外的头文件，要头文件的是 pair"],
          answers: [0, 1, 3],
          why: "第三条正好说反了：名字随便起，这正是它治「.first 说不出人话」的地方；其余三条都是本课的正面结论，pair 住的头文件是 utility。" },
        { id: "q7", type: "output", score: 8,
          stem: "student 的第一格是 \"小明\"、第二格是 15。这段程序打印什么？（一行一条）\nauto [score, name] = student;\nstd::println(\"{}, {}\", score, name);",
          acceptLines: ["小明, 15"],
          why: "个数对得上就合法，编译器不看名字的含义：score 接住第一格（姓名）、name 接住第二格（分数），屏幕上是一句荒诞的话，却没有一行红字。" },
        { id: "q8", type: "order", score: 10,
          stem: "把「用结构化绑定拆 pair」这件事的四个动作排成正确顺序。",
          steps: ["声明一只 pair，把两个值按顺序装进去", "写 auto [名字1, 名字2] = 那只箱子;", "核对名字个数和格数一致（pair 是两格）", "直接用这两个名字读写，不再写 .first / .second"],
          answer: [0, 1, 2, 3],
          why: "先有箱子再拆；拆的时候个数必须对上，这一步是编译器替你把关；核对完才敢用名字干活 —— 顺序换成先拆再核，报错就晚了。" }
      ],
      selftest: {
        refs: [
          { q1: "面积 = 12", q2: "std::pair<int, int> rect = {3, 4};\nauto [chang, kuan] = rect;\nstd::println(\"面积 = {}\", chang * kuan);", q3: 0, q4: 1, q5: "auto", q6: [0, 1, 3], q7: "小明, 15", q8: [0, 1, 2, 3] }
        ],
        wrongs: [
          { q1: "面积 = 7", q2: "std::pair<int, int> rect = {3, 4};\nstd::println(\"面积 = {}\", rect.first + rect.second);", q3: 3, q4: 0, q5: "pair", q6: [0, 1, 2], q7: "15, 小明", q8: [0, 2, 1, 3] }
        ],
        loose: [
          { q1: " 面积 = 12 ", q2: "std::pair< int , int > rect = {3,4};\nauto [width, height]  =  rect ;\nstd::println(\"面积 = {}\", width * height);", q3: "0", q4: "1", q5: "AUTO", q6: [0, 1, 3], q7: "小明, 15 ", q8: [0, 1, 2, 3] }
        ]
      }
    },
    {
      cid: "c48", kind: "paper", pass: 60,
      title: "第 48 课考试 · 绑定遍历成绩表",
      task: "任务题目：给成绩表再加两行你自己的科目和分数，说出整张表逐行拆出来的输出；再在遍历的时候顺便找出最高分（说清记最高分的那个格子为什么必须在循环外面）",
      hint: "想不起来就回看本课【演示 2】的两处分工，以及【演示 3】的「改的是复印件」现场。",
      questions: [
        { id: "q1", type: "output", score: 16,
          coversTask: 1,
          stem: "表里一共五行：原有的三行（英语 138、数学 145、C++ 88），加上你自己补的两行 {\"体育\", 100} 和 {\"历史\", 92}。这段程序打印什么？（一行一条，按顺序五行）\nfor (auto [subject, score] : scores) {\n    std::println(\"{} {}\", subject, score);\n}",
          acceptLines: ["英语 138", "数学 145", "C++ 88", "体育 100", "历史 92"],
          why: "range-for 一轮递一只 pair 到拆包台，auto [subject, score] 当面拆成两个名字；你加的两行排在表尾，所以五行按表里的顺序全部打出来。" },
        { id: "q2", type: "code", score: 14,
          coversTask: 1,
          stem: "（任务题）在已有的那张成绩表的初始化列表里，照原有格式再补两行你自己的科目和分数：花括号里写「字符串、逗号、整数」，两行之间用逗号隔开。",
          acceptRegex: ['\\{\\s*"[^"]+"\\s*,\\s*[0-9]+\\s*\\}'],
          why: "一行一个 {\"科目\", 分数}，整串塞在 = { …… }; 里就行；你写的先后顺序，就是以后遍历时的输出顺序。" },
        { id: "q3", type: "code", score: 18,
          coversTask: 2,
          stem: "（任务题）循环外面已经备好 int best = 0; 和 std::string best_name = \"\";。请写在 for (auto [subject, score] : scores) 的花括号里：这一轮的分数比 best 高时，把分数记进 best、把科目记进 best_name。",
          acceptRegex: ["if\\s*\\(\\s*score\\s*>\\s*best\\s*\\)", "best\\s*=\\s*score", "best_name\\s*="],
          why: "骨架就是 if (score > best) { best = score; best_name = subject; }。比较用刚拆出来的 score，两个格子要一起换 —— 只换分数不换科目，就会打出「145 分，但不知道是哪一科」。" },
        { id: "q4", type: "choice", score: 12,
          coversTask: 2,
          stem: "把 int best = 0; 挪进 for 的花括号里（其余一行不改），跑完再打印 best，结果是？",
          options: ["还是 145，循环里声明的变量会一直留着", "只剩最后一行那只盒子的分数（这里是 88），因为 best 每轮一开头就被重新归零", "一定是 0，因为循环一结束变量就销毁了", "编译报错：循环的花括号里不许声明变量"],
          answer: 1,
          why: "循环里的声明每轮重来一次，best 每轮开头都被抹回 0，于是它只保得住最后一轮的比较结果。要跨轮记东西，格子必须摆在循环外面 —— 这正是本课那两处分工的意义。" },
        { id: "q5", type: "choice", score: 8,
          stem: "std::println(\"{:<8} {}\", subject, score); 里那个 {:<8} 起什么作用？",
          options: ["把科目名左对齐、至少占 8 个字符宽，好让右边那列数字排成一条线", "名字超过 8 个字符的部分被截掉", "只打印前 8 行表", "它是对循环次数的限制"],
          answer: 0,
          why: "冒号后面是格式说明：< 是左对齐、8 是最少占几格，纯排版。它跟截断、跟循环都没关系，删掉照样跑，只是表看着歪。" },
        { id: "q6", type: "output", score: 12,
          stem: "表里还是原来那三行（英语 138、数学 145、C++ 88）。这段程序打印什么？（一行一条，共三行）\nfor (auto [subject, score] : scores) {\n    score = score + 10;\n    std::println(\"{} {}\", subject, score);\n}",
          acceptLines: ["英语 148", "数学 155", "C++ 98"],
          why: "那 10 分加在副本上，表里的原件一点没动；打印用的正是改过的副本，所以看着全都涨了 10 —— 再拆一遍表就现原形。" },
        { id: "q7", type: "multi", score: 12,
          stem: "下面关于这张成绩表的说法，哪些是对的？（多选，错勾任何一项整题 0 分）",
          options: ["std::vector<std::pair<std::string, int>> 读作「一串两格的盒子」：外层管有几行，内层管每行几格", "每轮交给循环的是整只 pair，方括号里两个名字正好接住", "想把改动写回表里，改 score 就够了", "头文件清单里 vector 和 pair 各要请一个，pair 里装的 string 还要再请一个"],
          answers: [0, 1, 3],
          why: "第三条不成立：auto 拆出来的是复印件，想让原件跟着变得换带引用的写法（以后再讲）。其余三条都是本课的正面结论。" },
        { id: "q8", type: "blank", score: 8,
          stem: "在 for 的花括号外面直接用 subject，编译器报「未声明的标识符」一类 —— 因为这个名字的____到右花括号就结束了。（填两个字最准，填「花括号」也算对）",
          accept: ["作用域", "生命周期", "花括号"],
          why: "循环变量只在循环体里活着；范围一结束名字就不存在了，想留住结果得在循环外面另备格子。" }
      ],
      selftest: {
        refs: [
          { q1: "英语 138\n数学 145\nC++ 88\n体育 100\n历史 92", q2: "{\"体育\", 100}, {\"历史\", 92}", q3: "if (score > best) {\n    best = score;\n    best_name = subject;\n}", q4: 1, q5: 0, q6: "英语 148\n数学 155\nC++ 98", q7: [0, 1, 3], q8: "作用域" }
        ],
        wrongs: [
          { q1: "英语 138\n数学 145\nC++ 88", q2: "{\"体育\", 100}", q3: "best = score;", q4: 0, q5: 1, q6: "英语 138\n数学 145\nC++ 88", q7: [0, 2], q8: "变量名" }
        ],
        loose: [
          { q1: "英语  138 \n 数学 145\nC++  88\n体育 100\n历史 92 ", q2: "{ \"历史\", 92 } , { \"体育\", 100 }", q3: "if(score>best){ best=score; best_name=subject ; }", q4: "1", q5: 0, q6: "英语 148 \n数学 155\n C++ 98", q7: [0, 1, 3], q8: "生命周期" }
        ]
      }
    },
    {
      cid: "c49", kind: "paper", pass: 60,
      title: "第 49 课考试 · constexpr 编译期常量",
      task: "任务题目：用 constexpr 算出「每天跑 2 圈、20 周共跑几圈」并把结果也写成 constexpr；再把源稿那行 constexpr 改成 const 编译一遍，说清两个都能过时它们的区别在哪",
      hint: "想不起来就回看本课【演示 2】的三行规则加一行计算，以及【演示 3】那个键盘输入被当场拒绝的对照。",
      questions: [
        { id: "q1", type: "code", score: 20,
          coversTask: 1,
          stem: "（任务题）用 constexpr 写出「每天 2 圈」「一周 7 天」「20 周」三个整数，再写一个 constexpr 变量，用乘法把总圈数算出来，最后用 std::println 打印它。",
          acceptRegex: ["constexpr\\s+int\\s+\\w+\\s*=\\s*2\\s*;", "constexpr\\s+int\\s+\\w+\\s*=[^;]*\\*[^;]*;", "println"],
          why: "骨架是 constexpr int LAPS_PER_DAY = 2; 这样的三行规则，加一行 constexpr int TOTAL = LAPS_PER_DAY * DAYS_PER_WEEK * WEEKS; —— 结果让编译器算，别自己抄成 280。" },
        { id: "q2", type: "output", score: 16,
          coversTask: 1,
          stem: "这段程序打印什么？（一行）\nconstexpr int LAPS_PER_DAY = 2;\nconstexpr int WEEKS = 20;\nconstexpr int TOTAL = LAPS_PER_DAY * 7 * WEEKS;\nstd::println(\"一共 {} 圈\", TOTAL);",
          acceptLines: ["一共 280 圈"],
          why: "2 乘 7 乘 20 等于 280；这一次乘法在编译期就做完了，程序运行时拿到的已经是成品数，没有一行计算的机器代码。" },
        { id: "q3", type: "choice", score: 12,
          coversTask: 2,
          stem: "把源稿那行 constexpr int WORDS_PER_YEAR = WORDS_PER_DAY * 365; 改成 const，编译能过吗？区别在哪？",
          options: ["过不了：const 不能参与乘法运算", "照样过；区别是 constexpr 要求编译期就把值算出来，const 只保证之后不许改，值可以晚一点才知道", "过不了：const 只能配字面量，不能配运算", "照样过，而且两者完全等价，没有任何区别"],
          answer: 1,
          why: "15 乘 365 什么时候算都算得出来，所以两种写法都能编译。差别在承诺的方向：constexpr 是给编译器派活儿（当场交货），const 只是不让你改。" },
        { id: "q4", type: "choice", score: 12,
          stem: "下面哪种写法会被编译器当场拒绝？",
          options: ["constexpr int n = 15 * 365;", "constexpr int n;（只声明，先不给值）", "const int n = 键盘读来的数;", "constexpr double pi = 3.14;"],
          answer: 1,
          why: "constexpr 必须声明当场就能算出值，先声明再赋值的路子不通。C 是合法的 —— const 只管「之后不许改」，值来自运行时完全没问题；A 和 D 都是编译期算得出来的写法。" },
        { id: "q5", type: "blank", score: 8,
          stem: "constexpr 这个关键字是 constant ____ 的缩写，意思是「这个值是编译期就能算出来的表达式」。",
          accept: ["expression", "表达式", "constant expression"],
          why: "名字本身就是说明书：constant（常量）+ expression（表达式），重点不在于「不能改」，而在于「现在就算得出来」。" },
        { id: "q6", type: "multi", score: 12,
          stem: "下列关于 constexpr 的说法，哪些是对的？（多选，错勾任何一项整题 0 分）",
          options: ["右边只要全是编译期已知的东西，就可以做运算，不必写成字面量", "把键盘读来的数交给 constexpr，编译器会说「初始化表达式不是常量表达式」", "constexpr 的值虽然编译期算过，运行时还得再算一遍", "命名用全大写加下划线，是让人一眼看出这是钉死的数、别去动它"],
          answers: [0, 1, 3],
          why: "第三条说反了：编译期算完就烧进程序里，运行时只是拿来用，这正是「零成本」的来历；其余三条都是本课的正面结论。" },
        { id: "q7", type: "code", score: 10,
          coversTask: 2,
          stem: "（任务题）只改一个地方：把 constexpr int WORDS_PER_YEAR = WORDS_PER_DAY * 365; 这一行改成 const 写法，其余不动。",
          acceptRegex: ["const\\s+int\\s+WORDS_PER_YEAR"],
          why: "写成 const int WORDS_PER_YEAR = WORDS_PER_DAY * 365; 就行。注意 constexpr 这个整体不算 —— 关键字是连写的，中间没有空格。" },
        { id: "q8", type: "blank", score: 10,
          stem: "一句话记两个关键字：const 承诺「之后不许____」，constexpr 承诺「现在就算得出来」。",
          accept: ["改", "修改", "改变", "变"],
          why: "const 管的是改不改（人的规矩），constexpr 管的是什么时候定（编译器的活儿）。方向不同，才能一个接得住键盘输入、一个接不住。" }
      ],
      selftest: {
        refs: [
          { q1: "constexpr int LAPS_PER_DAY = 2;\nconstexpr int DAYS_PER_WEEK = 7;\nconstexpr int WEEKS = 20;\nconstexpr int TOTAL = LAPS_PER_DAY * DAYS_PER_WEEK * WEEKS;\nstd::println(\"一共 {} 圈\", TOTAL);", q2: "一共 280 圈", q3: 1, q4: 1, q5: "expression", q6: [0, 1, 3], q7: "const int WORDS_PER_YEAR = WORDS_PER_DAY * 365;", q8: "改" }
        ],
        wrongs: [
          { q1: "int total = 280;\nstd::println(\"一共 {} 圈\", total);", q2: "一共 560 圈", q3: 3, q4: 2, q5: "declaration", q6: [0, 2], q7: "constexpr int WORDS_PER_YEAR = WORDS_PER_DAY * 365;", q8: "读" }
        ],
        loose: [
          { q1: "constexpr int laps_per_day = 2 ;\nconstexpr int weeks=20;\nconstexpr int days=7;\nconstexpr int total = laps_per_day * days * weeks ;\nprintln(\"一共 {} 圈\", total);", q2: " 一共 280 圈 ", q3: "1", q4: 1, q5: "EXPRESSION", q6: [0, 1, 3], q7: "const  int   WORDS_PER_YEAR = WORDS_PER_DAY*365;", q8: "变" }
        ]
      }
    },
    {
      cid: "c50", kind: "paper", pass: 60,
      title: "第 50 课考试 · using 类型别名",
      task: "任务题目：给 double 起别名 Height，用它存身高并打印；给 vector<int> 起别名 ScoreList，装三个分数并用遍历逐个打印",
      hint: "想不起来就回看本课【演示 2】那两个别名怎么立起来，以及【演示 3】里别名救不了的那次赋值。",
      questions: [
        { id: "q1", type: "code", score: 18,
          coversTask: 1,
          stem: "（任务题）给 double 起一个别名叫 Height；用它声明一个变量存 1.75；再用 std::println 把身高打印出来。三处都要写。",
          acceptRegex: ["using\\s+Height\\s*=\\s*double\\s*;", "Height\\s+\\w+\\s*=\\s*1\\.75", "println"],
          why: "骨架是 using Height = double; → Height my_height = 1.75; → std::println(\"身高 {} 米\", my_height);。别名右边必须选 double，因为身高带小数。" },
        { id: "q2", type: "code", score: 18,
          coversTask: 2,
          stem: "（任务题）给「一串整数分数」起别名叫 ScoreList（等号右边是 std::vector<int>）；用它声明一个装了三个分数的变量；再用 range-for 逐个打印。",
          acceptRegex: ["using\\s+ScoreList\\s*=\\s*std::vector\\s*<\\s*int\\s*>\\s*;", "ScoreList\\s+\\w+\\s*=\\s*\\{", "for\\s*\\("],
          why: "三行分工要清楚：using ScoreList = std::vector<int>; 立别名，ScoreList three = {95, 145, 88}; 用它声明并填三个数，for (auto one : three) 遍历 —— 别名的价值就体现在这一行短了。" },
        { id: "q3", type: "output", score: 14,
          coversTask: 2,
          stem: "已有 using ScoreList = std::vector<int>;。这段程序打印什么？（一行一条，共三行）\nScoreList three = {95, 145, 88};\nfor (auto one : three) {\n    std::println(\"- {}\", one);\n}",
          acceptLines: ["- 95", "- 145", "- 88"],
          why: "ScoreList 就是 std::vector<int>，初始化列表里三个数按顺序进容器；range-for 一轮拿一个 int，短横线是格式里写死的。" },
        { id: "q4", type: "choice", score: 10,
          coversTask: 1,
          stem: "把别名写成 using Height = int;，然后 Height h = 1.75;。h 的值是多少？",
          options: ["1.75，别名会自己想办法留住小数", "1 —— 别名右边是 int，小数那一截被削掉了", "编译报错，int 的别名不许装小数", "0.75，整数部分被丢掉"],
          answer: 1,
          why: "别名不改变类型的脾气：Height 就是 int，装 1.75 得到 1。起别名之前先把**右边的类型选对**，这比名字好听要紧得多。" },
        { id: "q5", type: "choice", score: 10,
          stem: "写好 using Score = int; 之后，下面哪句话最准确？",
          options: ["Score 是一个新类型，和 int 之间不能互相赋值", "Score 只是 int 的另一个拼写，编译器看穿它，两者随便赋值", "Score 是 int 的大号版本，占的内存更多", "这行的意思是把 145 赋给 Score"],
          answer: 1,
          why: "别名不制造新盒子，也不占内存：等号在这里读「代表」，不是赋值。写 Score math = 145; 和写 int math = 145; 生成的程序完全一样。" },
        { id: "q6", type: "blank", score: 8,
          stem: "这一课的语法形状是「using 新名字 = 老类型 ;」，其中等号要读作「____」，而不是赋值。（填两个字最贴切）",
          accept: ["代表", "相当于", "就是"],
          why: "读法决定你会不会写反：using 新名字 代表 老类型。反过来写 using int = Score; 编译器当场拒绝，报错指在 int 那儿。" },
        { id: "q7", type: "multi", score: 14,
          stem: "下面关于 using 别名的说法，哪些是对的？（多选，错勾任何一项整题 0 分）",
          options: ["惯例是新名字大写字母开头，跟变量名一眼分开", "别名让代码更好读，但不会带来任何新的类型检查", "起了 ScoreTable 这个别名之后，每次声明变量还得把那一长串类型重新写一遍", "起了别名就不用请头文件了，因为类型已经有名字了"],
          answers: [0, 1],
          why: "第三条正好说反：别名存在的意义就是让你**不必**再写那一长串；第四条也不成立 —— 右边用到 vector 和 string，<vector> 和 <string> 照样得请进来。第二条是这一课最该记住的边界。" },
        { id: "q8", type: "choice", score: 8,
          stem: "using NameList = std::vector<std::string>; 这一行本身，要求你请齐哪些头文件？",
          options: ["<vector> 和 <string> 都要", "只要 <vector>", "只要 <string>", "都不用请"],
          answer: 0,
          why: "别名只是右边那串类型的外号：右边写了 std::vector 就得请 <vector>，写了 std::string 就得请 <string>，一个都不能少。" }
      ],
      selftest: {
        refs: [
          { q1: "using Height = double;\nHeight my_height = 1.75;\nstd::println(\"身高 {} 米\", my_height);", q2: "using ScoreList = std::vector<int>;\nScoreList three = {95, 145, 88};\nfor (auto one : three) {\n    std::println(\"- {}\", one);\n}", q3: "- 95\n- 145\n- 88", q4: 1, q5: 1, q6: "代表", q7: [0, 1], q8: 0 }
        ],
        wrongs: [
          { q1: "using Height = int;\nHeight h = 1.75;", q2: "std::vector<int> three = {95, 145, 88};\nstd::println(\"{}\", three);", q3: "95 145 88", q4: 0, q5: 0, q6: "赋值", q7: [0, 1, 2], q8: 3 }
        ],
        loose: [
          { q1: "using  Height = double ;\nHeight h=1.75;\nstd::println(\"身高 {} 米\", h);", q2: "using ScoreList = std::vector < int > ;\nScoreList s = { 95 , 145 , 88 } ;\nfor(auto one : s){ println(\"- {}\", one) ; }", q3: " - 95\n- 145 \n-  88", q4: "1", q5: "1", q6: "相当于", q7: [0, 1], q8: "0" }
        ]
      }
    }
  ]
};
