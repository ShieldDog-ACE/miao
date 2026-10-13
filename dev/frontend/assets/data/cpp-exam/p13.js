/* 喵站 · C++ 入门 考卷分部 p13：第 55–58 课（第九轮 · 函数喊函数 + lambda + 引用初见）
 *
 * 每场卷照 cpp-exam/p06.js 的形状与硬指标（cpp-exam-check 逐条对账）：
 *   1. kind:"paper"，题型只用笔试引擎认的六种；
 *   2. 各题 score 相加正好 100；
 *   3. 源稿每一条【任务】都有题用 coversTask 对着它；
 *   4. 带 coversTask 的题合计 >=50 分；choice >=2；output >=1；
 *   5. 每题带 why；selftest 的 refs 判 100、wrongs 判 <60、loose 判 >=60。
 *
 * 守的闸线：c55 卷面不出现 lambda、引用；c56、c57 卷面不出现引用参数与 const 引用；
 *           c58 只考「外号」这一层，指针不碰。读者看得见的字段一律用中文括号。
 *
 * 验收：node dev/tools/cpp-exam-check.cjs --only c55,c56,c57,c58
 */
window.MIAO_CPP_EXAM_P13 = {
  papers: [
    {
      cid: "c55", kind: "paper", pass: 60,
      title: "第 55 课考试 · 函数调用函数",
      task: "任务题目：写一个收一整串分数、返回平均分的 average，把它接到 report 里用上；再给 grade_of 加一档：大于等于 95 返回「顶呱呱」",
      hint: "想不起来就回看正文【演示 2】那条分工链、【演示 3】里 report 喊 average 的那一行，以及【常见坑】第一条。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          coversTask: 2,
          stem: "源稿的 grade_of 从前往后一路挡：先挡 90、再挡 80、最后挡 60。现在要加一档「大于等于 95 返回顶呱呱」。加在哪个位置会让 96 分仍然打印成「优秀」？",
          options: ["写在函数最上面，比那句 90 还靠前", "写在 90 那一句之后、80 那一句之前", "写在函数最后一句 return 之后，反正都会被读到", "第一种和第三种效果一样"],
          answer: 1,
          why: "命中就 return，函数当场结束，后面的句子再也读不到。夹在 90 后面，96 先撞上 90 那道墙、还回优秀，新档永远轮不到。最后一句 return 之后写的东西根本执行不到 —— 「都会被读到」是想当然。" },
        { id: "q2", type: "choice", score: 12,
          stem: "编译时冒出 use of undeclared identifier 'grade_of'。最可能的原因是哪一条？",
          options: ["grade_of 的定义写在了调用它的函数下面，编译器读到时还不认识它", "grade_of 里没有 return 语句", "调用时少写了一个分号", "程序里没有 include vector"],
          answer: 0,
          why: "C++ 一遍扫过去，先见到定义才算认识这个函数。被喊的零件必须写在喊人的那一层上面，main 放最底下。" },
        { id: "q3", type: "output", score: 14,
          coversTask: 1,
          stem: "这段程序打印什么？（一行一条，按顺序写全五线）\ndouble average(std::vector<int> scores) {\n    double sum = 0;\n    for (auto s : scores) sum += s;\n    return sum / scores.size();\n}\nvoid report(std::vector<int> scores) {\n    std::println(\"平均 {} 分\", average(scores));\n    for (auto s : scores) std::println(\"{} 分\", s);\n}\nint main() { report({85, 92, 58, 73}); return 0; }",
          acceptLines: ["平均 77 分", "85 分", "92 分", "58 分", "73 分"],
          why: "report 先喊 average：85+92+58+73 是 308，除以 4 得 77；然后自己转一圈，按串里的顺序把四个分数各印一行。" },
        { id: "q4", type: "code", score: 14,
          coversTask: 1,
          stem: "把 average 的函数头写出来：它收一整串 int 分数，返回小数形式的平均分。",
          acceptRegex: ["double\\s+average\\s*\\("],
          why: "返回类型必须是 double —— 写成 int 会把小数位砍掉；参数写 std::vector<int> 才收得下一整串分数。函数体先累加再除以 size()。" },
        { id: "q5", type: "code", score: 12,
          coversTask: 2,
          stem: "写出加档的那一句：score 大于等于 95 时，返回文字「顶呱呱」。",
          acceptRegex: ["score\\s*>=\\s*95"],
          why: "关键在于 >= 95 这个比较写法要对，并且这句要放在 90 那句前面，否则 96 分早被前面拦走了。" },
        { id: "q6", type: "blank", score: 8,
          coversTask: 1,
          stem: "report 想喊 average，average 就得写在 report 的____面。（填一个字）",
          accept: ["上", "前", "上面", "前面"],
          why: "先见后喊：编译器只认已经见过的名字，顺序摆错就报 use of undeclared identifier。" },
        { id: "q7", type: "multi", score: 14,
          stem: "关于「函数里喊函数」，下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["喊的时候必须写上那对括号，光写名字不算调用", "被喊的函数要写在喊人的函数前面，编译器才认识它", "递进去的原料类型要和参数类型配上，单个 int 配不上一整串 vector", "函数内部只能喊 main，不能喊自己写的函数"],
          answers: [0, 1, 2],
          why: "最后一条说反了：链条上想加几层都合法，main 只是最上面那一层。前三条正是这一课调用零件函数的三条硬规矩。" },
        { id: "q8", type: "order", score: 14,
          coversTask: [1, 2],
          stem: "把「用分工链印一张带表头的成绩单」这几步排成正确顺序。",
          steps: ["把每个分数递进 grade_of，拿回一个等级词", "在 average 里把整串分数累加、除以个数", "main 把整串分数交给 report", "report 先喊 average 印表头", "report 转循环，把「分数 → 等级」一行行印出来"],
          answer: [2, 1, 3, 0, 4],
          why: "链条从 main 起手，先算表头用的平均，再一行行判等级；grade_of 是被 report 一行行喊的，不是自己冒出来的。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: 0, q3: "平均 77 分\n85 分\n92 分\n58 分\n73 分", q4: "double average(std::vector<int> scores) {", q5: "if (score >= 95) return \"顶呱呱\";", q6: "上", q7: [0, 1, 2], q8: [2, 1, 3, 0, 4] }
        ],
        wrongs: [
          { q1: 0, q2: 1, q3: "平均 77 分\n优秀 85", q4: "int average(std::vector<int> scores) {", q5: "if (score > 95) return score;", q6: "后", q7: [1, 3], q8: [1, 0, 2, 3, 4] }
        ],
        loose: [
          { q1: "1", q2: "0", q3: "平均  77 分\n85 分\n92 分\n58 分\n73 分", q4: "double  average ( std::vector <int> scores )", q5: "if(score>=95){return \"顶呱呱\";}", q6: "前", q7: [0, 1, 2], q8: [2, 1, 3, 0, 4] }
        ]
      }
    },
    {
      cid: "c56", kind: "paper", pass: 60,
      title: "第 56 课考试 · lambda 临时小函数",
      task: "任务题目：写一把算平方的 lambda，拿 3、9、16 三个数试；再写一把判断及格的 lambda，分数大于等于 60 就返回 true",
      hint: "想不起来就回看正文【演示 1】那句 auto mul 开头、【演示 2】里写完立刻喊的那一行，还有【常见坑】第三条关于分号。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          coversTask: 2,
          stem: "有一把工具 auto pass = [](int x) { return x >= 60; };。喊 pass(59)，还回来的是什么？",
          options: ["false，因为 59 不小于 60", "true，因为它没写返回类型", "59", "0"],
          answer: 0,
          why: "身体里 return 的是那句比较的结果，比较的结果只有真和假两种（第 22 课那套）。59 >= 60 不成立，所以还回 false。返回类型不用写，是从这一句推出来的。" },
        { id: "q2", type: "output", score: 14,
          coversTask: 1,
          stem: "这段程序打印什么？（一行一条，三行）\nauto sq = [](int x) { return x * x; };\nstd::println(\"{}\", sq(3));\nstd::println(\"{}\", sq(9));\nstd::println(\"{}\", sq(16));",
          acceptLines: ["9", "81", "256"],
          why: "sq 干的活是把自己收到的数乘自己：3 的平方 9，9 的平方 81，16 的平方 256。一把工具可以被喊很多次，不必只喊一次。" },
        { id: "q3", type: "code", score: 14,
          coversTask: 1,
          stem: "补出求平方那把工具的开头：它收一个 int，用 auto 存起来。（只写关键的前半截就行）",
          acceptRegex: ["\\[\\s*\\]\\s*\\(\\s*int"],
          why: "句式是 auto sq = [](int x) { return x * x; }; —— 中括号空着表示不拿外面的东西，紧跟的参数表收一个 int，句末那个分号不能少。" },
        { id: "q4", type: "code", score: 12,
          coversTask: 2,
          stem: "写出那把及格判断工具的身体：收到分数 x，把它和 60 比，够格就交还真。",
          acceptRegex: [">=\\s*60"],
          why: "身体就一句 return x >= 60; —— 比较本身就是真假，不用再绕一层 if。用大于号不加等号会把刚好 60 分的人判出去。" },
        { id: "q5", type: "choice", score: 12,
          stem: "下面哪种情况最适合用 lambda，而不是老老实实定义一个函数？",
          options: ["只用一次、三行就写完的小逻辑", "五个程序都要用的打印工具", "别的文件里的函数也要喊的那段逻辑", "长到八九十行、还分好几条路的大活儿"],
          answer: 0,
          why: "lambda 的卖点是现做现用、紧挨着用的地方写；凡是被多处共享、或者本身很大的逻辑，都该有名字、有位置，写成正式函数。" },
        { id: "q6", type: "blank", score: 10,
          stem: "写 lambda 那一句，末尾的花括号收完之后，还要紧跟着写一个____，整句才成立。（填两个字）",
          accept: ["分号", ";", "英文分号"],
          why: "那是一整条声明语句的结尾，编译器会报 expected ';' after lambda expression。它和第 51 课那种函数定义不一样 —— 函数定义的结尾后面没有这个东西。" },
        { id: "q7", type: "multi", score: 14,
          stem: "关于这一课的 lambda，下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["存进变量之后，同一把工具可以被喊很多次", "返回类型不用自己写，编译器照着那句 return 推", "它必须写在所有函数的外面，跟函数一个位置", "光写变量名 mul 不算喊它，得再加上一对圆括号"],
          answers: [0, 1, 3],
          why: "第三条错得关键：lambda 就是写在函数肚子里的，靠函数活着；要写在外面、谁都能喊，那叫函数。其余三条正好是这一课的三个手感。" },
        { id: "q8", type: "order", score: 12,
          coversTask: [1, 2],
          stem: "把「做一把小工具并用上它」这五个动作排成正确顺序。",
          steps: ["加上圆括号、塞进原料，它才真跑起来", "写一对中括号，本课让它空着", "写参数表和花括号身体，身体里 return 结果", "用 auto 声明一个变量接住整句，句末加分号", "把还回来的结果打印掉或者存进变量"],
          answer: [1, 2, 3, 0, 4],
          why: "先有工具本体（中括号 + 参数表 + 身体），才有接住它的声明，然后才轮到喊它、用它的结果。顺序调乱了，代码就少一个分号或者少一次调用。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: "9\n81\n256", q3: "auto sq = [](int x) { return x * x; };", q4: "return x >= 60;", q5: 0, q6: "分号", q7: [0, 1, 3], q8: [1, 2, 3, 0, 4] }
        ],
        wrongs: [
          { q1: 1, q2: "3\n9\n16", q3: "auto sq(int x) { return x * x; }", q4: "return x > 60;", q5: 1, q6: "冒号", q7: [0, 2], q8: [1, 2, 3, 4, 0] }
        ],
        loose: [
          { q1: "0", q2: " 9 \n81\n256", q3: "auto sq = [ ] ( int x ) { return x * x; } ;", q4: "if (x >= 60) { return true; }", q5: "0", q6: "分 号", q7: [0, 1, 3], q8: [1, 2, 3, 0, 4] }
        ]
      }
    },
    {
      cid: "c57", kind: "paper", pass: 60,
      title: "第 57 课考试 · lambda 捕获变量",
      task: "任务题目：先在外面写 int bonus = 5，再做一把中括号里点上 bonus 的小工具，把一个分数递进去、拿回加上奖励分的结果；再想一想：要是想让这把工具永远用的是最新值，路子在哪儿",
      hint: "想不起来就回看正文【演示 1】那两行输出、【演示 2】一次抄两个名字那句，还有那张复印件示意图。",
      questions: [
        { id: "q1", type: "choice", score: 14,
          coversTask: 2,
          stem: "int base = 100; 之后定义 auto add_base = [base](int x) { return base + x; }; 然后执行 base = 200; 再喊 add_base(1)，还回来的是几？",
          options: ["101，用的是定义那一刻抄下的 100", "201，它每次都回头去看外面的 base", "100，因为参数 x 没起作用", "编译不过，base 被改过就不能用了"],
          answer: 0,
          why: "中括号里点名，就是在那一行被执行的那一刻复印一份带走。之后原件改成 200 跟包里那份没关系，所以算的是 100 加 1。这正是源稿程序第二行打印的东西。" },
        { id: "q2", type: "output", score: 14,
          coversTask: 1,
          stem: "这段程序打印什么？（一行一条，两行）\nint bonus = 5;\nauto add = [bonus](int s) { return s + bonus; };\nstd::println(\"{}\", add(80));\nstd::println(\"{}\", add(60));",
          acceptLines: ["85", "65"],
          why: "抄进来的 bonus 是 5，两次喊各自把收到的分数加上包里那份 5：80 变 85，60 变 65。喊几次都不影响包里那份，也不影响外面的 bonus。" },
        { id: "q3", type: "code", score: 14,
          coversTask: 1,
          stem: "补出那把工具的开头：它要把外面的 bonus 抄进自己包里，再收一个 int 当参数。（关键就是中括号那一段）",
          acceptRegex: ["\\[\\s*bonus\\s*\\]"],
          why: "写成 [bonus](int s) —— 中括号里点名叫 bonus，编译器才会在定义那一刻把它复印进包；空着的中括号等于声明「什么都不带」，里面一用就报 use of undeclared identifier。" },
        { id: "q4", type: "choice", score: 16,
          stem: "「抄」这个动作发生在下面哪个时刻？",
          options: ["程序跑到定义那把工具那一行的时候", "每次喊这把工具的时候", "编译器读源码、还没运行的时候", "程序结束退出的时候"],
          answer: 0,
          why: "值捕获是运行时的复印，时机就是那条声明语句被执行的那一刻。所以源稿里 base 后来变了、包里不变 —— 复印早就完成了。" },
        { id: "q5", type: "choice", score: 12,
          coversTask: 2,
          stem: "源稿任务 2 留了个思考：想让这把工具用的永远是最新值，而不是出生那一刻的旧值。下面哪个说法最接近出路？",
          options: ["换一种带法：包里不存复印件，存能跟着原件走的东西 —— 这是往后一课要讲的", "把中括号空着，它就会自动去找最新值", "把那个变量写成 const，值就会自动更新", "每次多喊几次，喊到一定次数它就用新值"],
          answer: 0,
          why: "空着中括号只会让它压根看不见那个变量，只会报错，不会追最新；const 和喊的次数更是扯不上。真正要的是改变带法，让包里存的东西一直连着原件 —— 这一课先把复印件这条路走稳，另一条以后再讲。" },
        { id: "q6", type: "multi", score: 16,
          coversTask: [1, 2],
          stem: "关于中括号捕获，下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["点了名的变量是在定义那一行被复印进包的", "抄进来的那份可以在工具里直接赋值改新", "同一个工具喊两次，用的还是同一份复印件", "外面的原件后来被改掉，包里那份不会跟着变"],
          answers: [0, 2, 3],
          why: "第二条错在「直接改」：那份复印件是只读的，身体里给它赋值会被编译器拦下来，报错里带 captured by a copy 那几个字。其余三条就是这一课的三块基石。" },
        { id: "q7", type: "order", score: 14,
          stem: "把「用上一个外面的变量做出小工具」这四步排成正确顺序。",
          steps: ["用 auto 声明一个变量接住这把工具", "在中括号里点上要带走的变量名", "喊它，拿到用复印件算出来的结果", "先在外面把那个变量声明好、赋上值"],
          answer: [3, 0, 1, 2],
          why: "变量得先存在，才能被点名；点名和身体都写完了才有 auto 那句声明；这些都跑过之后，喊它才谈得上结果。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: "85\n65", q3: "auto add = [bonus](int s) { return s + bonus; };", q4: 0, q5: 0, q6: [0, 2, 3], q7: [3, 0, 1, 2] }
        ],
        wrongs: [
          { q1: 1, q2: "85", q3: "auto add = [](int s) { return s + 5; };", q4: 1, q5: 1, q6: [0, 1, 2], q7: [0, 1, 2, 3] }
        ],
        loose: [
          { q1: "0", q2: " 85 \n 65 ", q3: "auto add = [ bonus ] ( int s ) { return s + bonus; } ;", q4: "0", q5: "0", q6: [0, 2, 3], q7: [3, 0, 1, 2] }
        ]
      }
    },
    {
      cid: "c58", kind: "paper", pass: 60,
      title: "第 58 课考试 · 引用基础：给变量起外号",
      task: "任务题目：声明一个 int 变量 a、给它 10，再给它起一个外号；用这个外号把 a 改成 66，并且把 a 本身打印出来看看变了没有",
      hint: "想不起来就回看正文【演示 2】那三行，还有【演示 3】那场「两个盒子对两个名字」的对照实验。",
      questions: [
        { id: "q1", type: "output", score: 14,
          coversTask: 1,
          stem: "这段程序打印什么？（一行一条，两行）\nint a = 10;\nint& nickname = a;\nnickname = 66;\nstd::println(\"{}\", a);\nstd::println(\"{}\", nickname);",
          acceptLines: ["66", "66"],
          why: "nickname 不是第二个盒子，它是 a 本人的另一个叫法。用外号写 66，改的就是那一个盒子，所以两次打印读同一格，都是 66。" },
        { id: "q2", type: "choice", score: 14,
          coversTask: 1,
          stem: "任务要求用引用把 a 从 10 改成 66。下面哪一组写法真做得到？",
          options: ["int& r = a; 然后写 r = 66;", "int r = a; 然后写 r = 66;", "int& r = 66;", "先写 r = 66; 再声明 int& r;"],
          answer: 0,
          why: "第二组是复制值：改 r 改的是自己的新盒子，a 还是 10。第三组没有本人可挂，编译器直接拦。第四组顺序反了，引用必须声明那一行就把本人指认出来。" },
        { id: "q3", type: "code", score: 14,
          coversTask: 1,
          stem: "写这一行：给已经存在的 int 变量 score 起一个外号，外号叫 alias。",
          acceptRegex: ["int\\s*&\\s*alias\\s*=\\s*score"],
          why: "句式是 int& alias = score; —— 类型那截带上 &，说明这一行起的是外号；等号右边必须摆一个已经存在、类型也对得上的变量当本人。" },
        { id: "q4", type: "choice", score: 16,
          stem: "int copy = original; 和 int& nickname = original; 这两行，差别在哪句里说对了？",
          options: ["前一行多造一个盒子装复印件，后一行只是给原来的盒子多挂一个名字", "两行都造了新盒子，只是一个大一个小", "前一行没造盒子，后一行造了一个", "两行都只是改名，谁也不造盒子"],
          answer: 0,
          why: "这一句判断就是本课的钥匙：这行让盒子变多了，还是让名字变多了？带 & 的那行名字变多，不带的盒子变多 —— 此后 copy 改成 77 时 original 毫无感觉，nickname 改成 88 时 original 立刻变 88。" },
        { id: "q5", type: "blank", score: 12,
          stem: "引用在声明那一行就必须把本人指认出来，不能先空着等以后补 —— 这条规矩一般叫作引用必须____。（填三个字）",
          accept: ["初始化", "被初始化", "当场初始化"],
          why: "写 int& r; 会得到 'r' declared as a reference but not initialized：外号不能挂在空气上，声明那一刻就得有本人。" },
        { id: "q6", type: "multi", score: 16,
          coversTask: 1,
          stem: "下面关于外号的说法，哪些是对的？（多选，错勾任何一项整题 0 分）",
          options: ["用外号赋值，改的就是本人那个盒子", "同一个盒子可以挂好几个名字，两个外号都合法", "外号起好之后，还能靠一句赋值把它改成指另一个盒子", "一个盒子只有一个门牌号，两个名字问出来的号是同一个"],
          answers: [0, 1, 3],
          why: "第三条是本课最贵的那个坑：引用身上的等号永远是「给本人赋值」，写了 r = b 只是把 b 的值灌进 a，外号没换人。其余三条正是这一课要留下的手感。" },
        { id: "q7", type: "order", score: 14,
          stem: "把「用外号把别人的值改掉」这四步排成正确顺序。",
          steps: ["之后每给它写一次值，本人就跟着变一次", "先声明那个 int 变量并赋上值", "这一行的等号右边，摆上那个已经存在的变量当本人", "再写一行声明：类型那截带上 &，名字随你起"],
          answer: [1, 3, 2, 0],
          why: "本人得先存在，才点得到名；声明那一行里，带 & 的类型在前、指认本人在后；这些都写完，才轮到用外号去改本人。" }
      ],
      selftest: {
        refs: [
          { q1: "66\n66", q2: 0, q3: "int& alias = score;", q4: 0, q5: "初始化", q6: [0, 1, 3], q7: [1, 3, 2, 0] }
        ],
        wrongs: [
          { q1: "10\n66", q2: 1, q3: "int alias = score;", q4: 1, q5: "声明", q6: [0, 1, 2], q7: [0, 1, 2, 3] }
        ],
        loose: [
          { q1: " 66 \n 66", q2: "0", q3: "int & alias  =  score ;", q4: "0", q5: "初 始 化", q6: [0, 1, 3], q7: [1, 3, 2, 0] }
        ]
      }
    }
  ]
};
