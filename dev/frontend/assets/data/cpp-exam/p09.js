/* 喵站 · C++ 入门 考卷分部 p09：第 39–42 课（第九轮）
 *
 * 每场卷照 cpp-exam/p01.js、p04.js 的形状与硬指标（cpp-exam-check 逐条对账）：
 *   1. kind:"paper"，题型只用笔试引擎认的六种（choice/multi/blank/code/output/order）；
 *   2. 各题 score 相加正好 100；
 *   3. 源稿每一条【任务】都有题用 coversTask 对着它（序号从 1 起，一条题可盖多条）；
 *   4. 带 coversTask 的题合计 ≥50 分；choice ≥2；output ≥1；
 *   5. 每题带 why；selftest 的 refs 判 100、wrongs 判 <60、loose 判 ≥60。
 *
 * 本分部两处口径：
 *   · c39 是第 39 课，vector 到第 40 课才教，所以这场卷的题目全部只用循环与打印，不出现盒子。
 *   · c40/c41/c42 三场按各自课号出题：c40 只到 size() 与三种造法（不考下标，那是第 41 课），
 *     c41 只到下标与 at/back（不考 push_back，那是第 42 课）。
 *   · selftest 里的串只喂判分器，读者看不到；题面里出现的代码写法不越过本课课号。
 *
 * 验收：node dev/tools/cpp-exam-check.cjs --only c39,c40,c41,c42
 */
window.MIAO_CPP_EXAM_P09 = {
  papers: [
    {
      cid: "c39", kind: "paper", pass: 60,
      title: "第 39 课考试 · 嵌套循环",
      task: "任务题目：把九九表内层的条件改成 j <= 9，看清它变成完整方阵；再用嵌套循环打印 5 行星号，第 i 行有 i 个星号",
      hint: "想不起来就回看本课【演示 1】的次数对照、【演示 3】的方阵改造和【演示 4】的星号三角。",
      questions: [
        { id: "q1", type: "choice", score: 14,
          coversTask: 1,
          stem: "源稿九九表的内层写的是 j 小于等于 i。把它改成 j 小于等于 9，屏幕上的形状会变成什么？",
          options: ["每行都打满 9 个算式，成 9 行 9 列的长方形", "形状不变，只是得数变大", "只打第九行，其余行空着", "程序当场终止"],
          answer: 0,
          why: "内层的上限决定这一行有几个算式：跟着 i 走是下三角（共 45 个），写死 9 就每行都满，共 81 个。" },
        { id: "q2", type: "choice", score: 12,
          stem: "「外层走一步，内层跑满一圈」这句话的准确意思是？",
          options: ["外层每执行一次，内层都从自己的初值完整跑一遍", "内层跑满一圈之后整个程序就结束了", "内外层交替各走一步", "内层只在外层的第一步才跑，后面几轮不再跑"],
          answer: 0,
          why: "内层的初始化就写在外层的循环体里，外层每挪一格它就重新来一遍 —— 所以三行 j 的内容是一模一样的。" },
        { id: "q3", type: "output", score: 14,
          coversTask: 2,
          stem: "这段代码打印什么？（一行一条）\nfor (int i = 1; i <= 5; i++) {\n    for (int j = 1; j <= i; j++) {\n        std::print(\"*\");\n    }\n    std::println(\"\");\n}",
          acceptLines: ["*", "**", "***", "****", "*****"],
          why: "内层上限是 i，所以第 i 行贴 i 个星号；换行那句在内层外面，一行贴完才另起一行。" },
        { id: "q4", type: "code", score: 16,
          coversTask: 1,
          stem: "（任务题）写一行 for 语句的括号部分：让计数器 j 从 1 起、一直走到 9 为止（含 9），用来把九九表的每一行打满。",
          acceptRegex: ["j\\s*<=\\s*9"],
          why: "答案形状是 for (int j = 1; j <= 9; j++) —— 上限用小于等于才包含 9，写成 j 小于 9 只有 8 个，方阵会缺最右一列。" },
        { id: "q5", type: "blank", score: 10,
          coversTask: 2,
          stem: "要打印「第 i 行有 i 个星号」，内层的上限应该写成 j 小于等于 ____。（填那个跟着外层走的变量名）",
          accept: ["i", "j<=i", "i（外层变量）"],
          why: "内层上限用外层的计数器 i，行数就自动等于每行的星号数；写成固定数字就不再是三角形。" },
        { id: "q6", type: "multi", score: 14,
          coversTask: [1, 2],
          stem: "下面关于嵌套循环的说法，哪些是对的？（多选，错勾任何一项整题 0 分）",
          options: ["内层的计数器每轮都从它的初值重新开始", "内外层用同一个变量名会编译报错", "换行那句 std::println(\"\") 应该写在内层的花括号里面", "外层 3 步、内层每步 4 次，内层那一行共执行 12 次"],
          answers: [0, 1, 3],
          why: "换行必须待在内层之外，否则每个算式各占一行；其余三条正是本课的三条结论，总次数是两层相乘。" },
        { id: "q7", type: "order", score: 10,
          coversTask: 2,
          stem: "把「用嵌套循环打出第 i 行 i 个星号的三角」的步骤排成正确顺序。",
          steps: ["外层 for 管行数：i 从 1 走到 5", "内层 for 管每行几个：j 从 1 走到 i", "内层里用 std::print 往同一行贴一个星号", "内层跑完之后用 std::println 空串换行"],
          answer: [0, 1, 2, 3],
          why: "先定行、再定每行几个、然后贴、最后换行；第 4 步的位置就是九九表那条「谁管换行谁在外面」。" },
        { id: "q8", type: "choice", score: 10,
          stem: "如果把 std::println(\"\") 误写进内层的花括号里，5 行星号会变成什么？",
          options: ["每个星号各占一行，一共 15 行", "一行都不打", "照旧 5 行，只是跑得慢一点", "编译报错，根本跑不起来"],
          answer: 0,
          why: "内层总共执行 1+2+3+4+5 = 15 次，每次贴一个星号就换行，三角就塌成一竖条，而且没有任何报错。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: 0, q3: "*\n**\n***\n****\n*****", q4: "for (int j = 1; j <= 9; j++) {", q5: "i", q6: [0, 1, 3], q7: [0, 1, 2, 3], q8: 0 }
        ],
        wrongs: [
          { q1: 1, q2: 2, q3: "*\n**\n***\n****", q4: "for (int j = 1; j <= i; j++) {", q5: "5", q6: [2, 3], q7: [1, 0, 3, 2], q8: 1 }
        ],
        loose: [
          { q1: "0", q2: "0", q3: " * \n ** \n *** \n **** \n ***** ", q4: "for ( int j = 1 ;  j  <=  9 ;  j ++ )", q5: "  i  ", q6: [3, 1, 0], q7: ["0", "1", "2", "3"], q8: "0" }
        ]
      }
    },
    {
      cid: "c40", kind: "paper", pass: 60,
      title: "第 40 课考试 · 初识 vector",
      task: "任务题目：建一个装 double 的盒子放三门课的分数并打印 size；再把 zeros 那两个数字换成 3 和 9，看清盒子变成什么样",
      hint: "想不起来就回看本课「它被设计成什么样」那三条造法、【演示 2】的小数盒和【演示 3】的个数与内容。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          coversTask: 1,
          stem: "std::vector<double> homework = {92.5, 88.0, 79.5}; 这一行里尖括号中的 double 是什么意思？",
          options: ["这只盒子的房型：每一格统一装一个 double", "盒子里现在装着三个小数", "格子数由 double 的大小决定", "打印时保留两位小数"],
          answer: 0,
          why: "尖括号里写的是类型，不是值，也不是个数；它规定这一整盒每格装什么，装几个由花括号里的内容决定。" },
        { id: "q2", type: "choice", score: 12,
          stem: "std::vector<int> zeros(5, 0); 造出来的盒子长什么样？",
          options: ["5 个格子，每格里都是 0", "0 个格子，每格是 5", "5 个格子，每格是 5", "1 个格子，里面同时放着 5 和 0"],
          answer: 0,
          why: "圆括号那条的顺序是「先几格、后每格放什么」，所以是 5 个 0；把两个数字说反会得到一只空盒子。" },
        { id: "q3", type: "code", score: 16,
          coversTask: 1,
          stem: "（任务题）写两行：第一行声明一只装 double 的盒子 chinese，把三门课的分数 85.5、92、78.5 一次列进去；第二行用 std::println 打印它装了几个。",
          acceptRegex: ["vector\\s*<\\s*double\\s*>[\\s\\S]*size\\s*\\(\\s*\\)"],
          why: "答案形状是 std::vector<double> chinese = {85.5, 92, 78.5}; 然后 std::println(\"{}\", chinese.size()); —— 房型在尖括号里，问个数用加点 size 加一对空括号。" },
        { id: "q4", type: "output", score: 14,
          coversTask: 2,
          stem: "这段代码打印什么？（一行一条）\nstd::vector<int> zeros(5, 0);\nstd::vector<int> nines(3, 9);\nfor (int one : nines) { std::print(\"{} \", one); }\nstd::println(\"\");\nstd::println(\"{}\", zeros.size());",
          acceptLines: ["9 9 9", "5"],
          why: "nines 是 3 格、每格 9，range-for 挨个打出来；zeros 按第一个数字算，5 格，size() 报 5。" },
        { id: "q5", type: "blank", score: 10,
          coversTask: 2,
          stem: "std::vector<int> a(3, 9); 里两个数字的顺序是：先写____，再写每格放什么。",
          accept: ["格子数", "个数", "有几个格子", "格数"],
          why: "圆括号版本的口诀就是「先几个，后什么」；写成 (9, 3) 得到 9 个 3，写成 (0, 5) 得到空盒。" },
        { id: "q6", type: "multi", score: 14,
          coversTask: [1, 2],
          stem: "下面关于 std::vector 的说法，哪些是对的？（多选，错勾任何一项整题 0 分）",
          options: ["花括号那条是「列内容」，格子数跟着内容自动定下来", "空盒子的 size() 是 0，这是一种合法状态", "想装小数就在尖括号里写 double，一盒里混着写 int 和 double 编译器会自己调和", "size 后面的那对圆括号可以省略不写"],
          answers: [0, 1],
          why: "第三、第四条都是坑：房型必须统一，往装 int 的盒子里塞小数会被编译期的 narrowing 拦下；size 是盒子自己的动作，加点、名字、空括号一样不能少。" },
        { id: "q7", type: "order", score: 12,
          coversTask: 1,
          stem: "把「用一只盒子装三门课分数并问出有几门」的步骤排成正确顺序。",
          steps: ["请进头文件：include vector", "尖括号定房型：std::vector<double>", "花括号列出三门分数并起名字", "打印它的 size() 问有几个"],
          answer: [0, 1, 2, 3],
          why: "少了头文件第一行就编译不过；房型定在名字之前；内容决定格子数；最后才问 size()。" },
        { id: "q8", type: "choice", score: 10,
          stem: "程序里用了 std::vector，却只写了 include print 那一行头文件，会发生什么？",
          options: ["编译报错，大意是命名空间 std 里没有叫 vector 的名字", "能编译，但 size() 永远给 0", "运行时会得到一只空盒子", "编译器自动把头文件补上，什么也不说"],
          answer: 0,
          why: "盒子不住在打印那个头文件里；看到「std 里没有 vector 这个名字」先回去请头文件，别去改尖括号。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: 0, q3: "std::vector<double> chinese = {85.5, 92, 78.5};\nstd::println(\"{}\", chinese.size());", q4: "9 9 9\n5", q5: "格子数", q6: [0, 1], q7: [0, 1, 2, 3], q8: 0 }
        ],
        wrongs: [
          { q1: 1, q2: 2, q3: "std::vector<int> chinese = {85, 92, 78};", q4: "5 5 5 5 5\n3", q5: "内容", q6: [2, 3], q7: [1, 0, 3, 2], q8: 1 }
        ],
        loose: [
          { q1: "0", q2: "0", q3: "std . vector <  double  >  chinese = { 85.5 ,  92 ,  78.5 } ;\nstd::println ( \"{}\" , chinese . size ( ) ) ;", q4: "9  9  9\n\n 5 ", q5: "个数", q6: [1, 0], q7: ["0", "1", "2", "3"], q8: "0" }
        ]
      }
    },
    {
      cid: "c41", kind: "paper", pass: 60,
      title: "第 41 课考试 · 下标取元素与越界",
      task: "任务题目：打印盒子里第 2 个和第 4 个元素（下标该写几要自己数出来）；再拿 scores[5] 去撞一只只有 0 到 4 号的盒子，看清越界是怎么回事",
      hint: "想不起来就回看本课那张「5 个格子的编号是 0 到 4」的图、【演示 2】的做减法，还有【演示 3】方括号与 at() 的两种下场。",
      questions: [
        { id: "q1", type: "choice", score: 14,
          coversTask: 1,
          stem: "std::vector<int> scores = {85, 92, 78, 96, 88}; 想打印第 2 个元素，方括号里该写几？",
          options: ["1", "2", "0", "3"],
          answer: 0,
          why: "编号是「离起点差几格」，第一格在 0 号，所以第 N 个要写 N 减 1：第 2 个就在 1 号格，值是 92。" },
        { id: "q2", type: "choice", score: 12,
          stem: "同一只盒子，scores[4] 取到的是什么？",
          options: ["88：最后一格", "96：第四格", "越界，那一格不存在", "0：盒子补的空格"],
          answer: 0,
          why: "5 格的盒子编号是 0 到 4，4 号正是最后一格，等于 back()；写成 5 才越界。" },
        { id: "q3", type: "output", score: 14,
          coversTask: 1,
          stem: "这段代码打印什么？（一行一条）\nstd::vector<int> scores = {85, 92, 78, 96, 88};\nstd::println(\"{}\", scores[1]);\nstd::println(\"{}\", scores[3]);",
          acceptLines: ["92", "96"],
          why: "第 2 个在 1 号格是 92，第 4 个在 3 号格是 96 —— 源稿任务 1 考的就是这一道减法。" },
        { id: "q4", type: "code", score: 16,
          coversTask: 2,
          stem: "（任务题）写一行代码：用方括号去取这只盒子根本不存在的那一格（盒子只有 0 到 4 号），并把它交给 std::println 打印出来，亲手看看越界是什么现象。",
          acceptRegex: ["scores\\s*\\[\\s*5\\s*\\]"],
          why: "答案形状是 std::println(\"{}\", scores[5]); —— 5 号格不存在，而方括号不查门牌，这一下属于未定义行为。" },
        { id: "q5", type: "blank", score: 12,
          coversTask: 2,
          stem: "把 scores[5] 换成 scores.at(5)，程序会当场终止，报错信息里带着____这个字样。（填那段英文）",
          accept: ["out_of_range", "out of range", "越界"],
          why: "at() 会先查门牌存不存在，查不到就立刻停下来把话说清楚；这正是它比方括号可靠的地方，也是调试期该用它的原因。" },
        { id: "q6", type: "multi", score: 14,
          coversTask: [1, 2],
          stem: "下面这些写法里，哪些会碰到越界？（多选，错勾任何一项整题 0 分。盒子初值是那五个数，另一只是空盒）",
          options: ["5 格的盒子里写 scores[5]", "5 格的盒子里写 scores[scores.size()]", "5 格的盒子里写 scores.back()", "空盒子里写 front() 或 back()"],
          answers: [0, 1, 3],
          why: "size() 是「几格」不是「最大编号」，5 格的最后一格在 4 号，所以第二条天生越界；0 格的盒子既没有头也没有尾，front 和 back 都无处可取。" },
        { id: "q7", type: "order", score: 10,
          stem: "把「用循环安全地走完整只盒子」的步骤排成正确顺序。",
          steps: ["计数器 i 从 0 起", "条件写 i 小于 size()，不带等于号", "循环体里用方括号取当前这一格", "要最后一格时改问 back()，别自己拿 size() 去减"],
          answer: [0, 1, 2, 3],
          why: "从 0 起、小于 size()，正好走 5 步、编号 0 到 4；一旦带上等于号就多走一步，那一步正是越界。" },
        { id: "q8", type: "choice", score: 8,
          stem: "「第 N 个元素」和方括号里要写的编号，关系是哪种？",
          options: ["编号写 N 减 1", "编号照写 N", "编号写 N 加 1", "要看盒子多大才能定"],
          answer: 0,
          why: "这条换算跟盒子大小无关，永远是减一；循环里之所以不用减，是因为计数器本来就从 0 数。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: 0, q3: "92\n96", q4: "std::println(\"{}\", scores[5]);", q5: "out_of_range", q6: [0, 1, 3], q7: [0, 1, 2, 3], q8: 0 }
        ],
        wrongs: [
          { q1: 1, q2: 1, q3: "85\n92", q4: "std::println(\"{}\", scores[4]);", q5: "-1", q6: [2], q7: [1, 0, 3, 2], q8: 1 }
        ],
        loose: [
          { q1: "0", q2: "0", q3: " 92 \n\n  96 ", q4: "std :: println ( \"{}\" , scores [  5  ] ) ;", q5: "out of range", q6: [3, 1, 0], q7: ["0", "1", "2", "3"], q8: "0" }
        ]
      }
    },
    {
      cid: "c42", kind: "paper", pass: 60,
      title: "第 42 课考试 · 尾部添加与删除",
      task: "任务题目：从一只空盒子出发连续 push_back 三个数字并逐个打印，看清 size 与 back 怎么跟着变；再回答对空盒子 pop_back 会怎样、动手前该先问哪一句",
      hint: "想不起来就回看本课【演示 2】的空盒起手式、【演示 3】的 if 守卫，还有那张队尾进出的图。",
      questions: [
        { id: "q1", type: "choice", score: 10,
          stem: "scores.push_back(100); 这一句做了什么？",
          options: ["在队尾排进一格 100，size() 多 1，back() 变成 100", "把 100 插到最前面，后面的往后挪", "把第 100 格写成 100", "把队尾那一格的旧值改成 100，格子数不变"],
          answer: 0,
          why: "push_back 永远在尾巴加一格，格子数跟着加一；它不接受位置参数，也不动前面那些格。" },
        { id: "q2", type: "choice", score: 12,
          coversTask: 2,
          stem: "对一只 size() 为 0 的空盒子调用 pop_back()，最准确的说明是哪个？",
          options: ["越界级别的错误：0 格没有尾巴可请，属于未定义行为，不该去试", "什么也不会发生，程序绝对安全", "它会返回被删掉的那个值", "它会自动补一个 0 进去占位"],
          answer: 0,
          why: "空盒子没有尾部，请谁走都无从谈起；标准不作保证，所以正确做法是先用 size() 守卫，而不是指望它提醒你。" },
        { id: "q3", type: "output", score: 14,
          coversTask: 1,
          stem: "这段代码打印什么？（一行一条）\nstd::vector<int> fav;\nfav.push_back(7);\nstd::println(\"{}\", fav.size());\nfav.push_back(42);\nstd::println(\"{}\", fav.back());\nfav.pop_back();\nstd::println(\"{}\", fav.back());",
          acceptLines: ["1", "42", "7"],
          why: "空盒加一个就是 1 格；再加一个尾巴换成 42；把 42 请出去之后 back() 退回 7 —— 后加的先走。" },
        { id: "q4", type: "code", score: 16,
          coversTask: 1,
          stem: "（任务题）写三行：往一只已经声明好的空盒子 fav 里，连续排进 3、5、7 三个数字，一行一个动作。",
          acceptRegex: ["fav\\s*\\.\\s*push_back\\s*\\(", "push_back\\s*\\(\\s*7\\s*\\)"],
          why: "答案形状是 fav.push_back(3); 三行各排一个数，必须真的写三次；一行只塞一个动作最清楚。" },
        { id: "q5", type: "blank", score: 12,
          coversTask: 2,
          stem: "想在删之前先确认盒子里还有人，if 里应该问一句这只盒子的____（填那个报格子数的成员动作名）。",
          accept: ["size()", "size", "size() 的返回值", "格子数"],
          why: "size() 是盒子自己报的格数，判它大于 0 再 pop_back，就是本课唯一的护身符。" },
        { id: "q6", type: "multi", score: 14,
          coversTask: [1, 2],
          stem: "下面关于 push_back 与 pop_back 的说法，哪些是对的？（多选，错勾任何一项整题 0 分）",
          options: ["pop_back 请走的是最近一次 push_back 进来的那一格", "加完之后 back() 就是刚进来的那个值", "想删掉第一个元素就写 pop_back(0)", "空盒子也能 push_back，这是「来一条加一条」的起手式"],
          answers: [0, 1, 3],
          why: "pop_back 没有参数，只请尾巴那一个；要动头部是以后课里的动作，今天这一对只管队尾。" },
        { id: "q7", type: "order", score: 12,
          coversTask: 1,
          stem: "把「从空盒子攒出一串数，再安全地把它清空」的步骤排成正确顺序。",
          steps: ["声明一只空盒子，一格都不填", "每来一个数就 push_back 一次", "想删之前先看 size() 是不是大于 0", "连着 pop_back 到 size() 报 0 就停手"],
          answer: [0, 1, 2, 3],
          why: "空盒能加不能删；第 3 步那道守卫正是第 4 步能安全收尾的前提。" },
        { id: "q8", type: "choice", score: 10,
          stem: "盒子里本来是 {85, 92, 78}，跑完 push_back(60) 再紧接着 pop_back() 之后是什么状态？",
          options: ["还是 3 格，back() 回到 78", "4 格，back() 是 60", "2 格，back() 是 92", "0 格，成了空盒子"],
          answer: 0,
          why: "一加一删互相抵消，而且删掉的正是刚加进去那个 60，前面三格从头到尾没动过。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: 0, q3: "1\n42\n7", q4: "fav.push_back(3);\nfav.push_back(5);\nfav.push_back(7);", q5: "size()", q6: [0, 1, 3], q7: [0, 1, 2, 3], q8: 0 }
        ],
        wrongs: [
          { q1: 3, q2: 1, q3: "0\n42\n7", q4: "fav.push_back(3);", q5: "back()", q6: [2, 3], q7: [2, 1, 0, 3], q8: 1 }
        ],
        loose: [
          { q1: "0", q2: "0", q3: " 1 \n\n 42 \n 7 ", q4: "fav . push_back ( 3 ) ;\nfav.push_back( 5 );\nfav . push_back (  7  ) ;", q5: "size ( )", q6: [1, 0, 3], q7: ["0", "1", "2", "3"], q8: "0" }
        ]
      }
    }
  ]
};
