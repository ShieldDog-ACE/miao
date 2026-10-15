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
      cid: "c39", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 39 课考试 · 嵌套循环", task: "任务题目：把九九表内层的条件改成 j <= 9，看清它变成完整方阵；再用嵌套循环打印 5 行星号，第 i 行有 i 个星号", hint: "想不起来就回看本课【演示 1】的次数对照、【演示 3】的方阵改造和【演示 4】的星号三角。",
      notes: ["「外层走一步，内层跑满一圈」的准确意思：内层的初始化就写在外层的循环体里，外层每挪一格它都从自己的初值完整跑一遍，所以每一行的内容一模一样。", "总执行次数 = 外层步数 × 每步内层圈数；外层 3 步、内层每步 4 次，内层那一行共执行 12 次。", "j 到 i 时内层总次数是 1+2+……+9 = 45。", "换行那句 std::println 空串应该写在内层的花括号外面，否则每个算式各占一行。", "内外层用同一个变量名会编译报错；内层的计数器每轮都从它的初值重新开始。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "写外层 for：int i 从 1 起，条件走到 9 为止，每轮加一 —— 它管第几行。", acceptRegex: ["for\\s*\\(\\s*int\\s+i\\s*=\\s*1\\s*;\\s*i\\s*<=\\s*9\\s*;"], acceptOn: "code", sample: "for (int i = 1; i <= 9; i++) {", why: "外层走 9 步就是 9 行；它每挪一格，塞在它循环体里的内层就重新从初值跑一遍。" },
        { id: "q2", type: "code", score: 25, coversTask: 1, stem: "把内层 for 的上限写死成 9（原来是 j <= i），外层的花括号里再塞这一个完整的 for。", acceptRegex: ["for\\s*\\(\\s*int\\s+j\\s*=\\s*1\\s*;\\s*j\\s*<=\\s*9\\s*;"], acceptOn: "code", sample: "for (int j = 1; j <= 9; j++) {", why: "内层的上限决定这一行有几个：跟着 i 走是下三角共 45 个，写死 9 就每行都满，成 9 行 9 列的长方形共 81 个。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "内层里用 std::print 往同一行贴一个算式：格式串里留三个占位坑，逗号后面按顺序给 j、i，再给 i 乘 j 的积。", acceptRegex: ["std::print\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\\{\\}[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\*\\s*\\w+"], acceptOn: "code", sample: "std::print(\"{}×{}={}  \", j, i, i * j);", why: "std::print 不换行，几个算式才贴得成一行；三个坑就三个值，顺序错了乘法表就串位。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "一行打完换行：用 std::println 只给一个空串，位置要在内层花括号的外面、外层花括号的里面。", acceptRegex: ["std::println\\s*\\(\\s*\"\\s*\"\\s*\\)"], acceptOn: "code", sample: "        std::println(\"\");", why: "换行那句待在内层之外才一行贴完才另起一行；误写进内层，每个星号各占一行、共 15 行，而且不会有任何报错。" },
        { id: "q5", type: "code", score: 25, coversTask: 2, stem: "任务第 2 条：再写一坨嵌套，外层 i 从 1 走到 5，内层 j 从 1 走到 i，内层里用 std::print 贴一个星号 —— 第 i 行正好 i 个。", acceptRegex: ["for\\s*\\(\\s*int\\s+i\\s*=\\s*1\\s*;\\s*i\\s*<=\\s*5\\s*;", "for\\s*\\(\\s*int\\s+j\\s*=\\s*1\\s*;\\s*j\\s*<=\\s*i\\s*;", "std::print\\s*\\(\\s*\"\\s*\\*"], acceptOn: "code", sample: "for (int i = 1; i <= 5; i++) {\n    for (int j = 1; j <= i; j++) {\n        std::print(\"*\");\n    }\n    std::println(\"\");\n}", why: "内层上限用外层的计数器 i，星号数就自动等于行号；写成固定数字就不再是三角形。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint main() {\n    for (int i = 1; i <= 9; i++) {\n        for (int j = 1; j <= 9; j++) {\n            std::print(\"{}×{}={}  \", j, i, i * j);\n        }\n        std::println(\"\");\n    }\n\n    for (int i = 1; i <= 5; i++) {\n        for (int j = 1; j <= i; j++) {\n            std::print(\"*\");\n        }\n        std::println(\"\");\n    }\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n\nint main() {\n    for (int i = 1; i <= 9; i++) {\n        for (int j = 1; j <= i; j++) {\n            std::print(\"{}×{}={}  \", j, i, i * j);\n        }\n        std::println(\"\");\n    }\n\n    return 0;\n}\n",
          "#include <print>\n\nint main() {\n    for (int i = 1; i <= 5; i++) {\n        for (int j = 1; j <= i; j++) {\n            std::print(\"*\");\n        }\n        std::println(\"\");\n    }\n\n    return 0;\n}\n"],
        loose: [
          "#  include <print>\nint main ( )\n{\n  for(int i=1; i <= 9; i ++)\n  {\n    for(int j=1; j<=9; j++)\n    {\n      std::print( \"{} {}={}  \" , j , i , i*j ) ;\n    }\n    std::println ( \"\" ) ;\n  }\n\n  for ( int i=1; i<=5; i++ )\n  {\n    for ( int j=1; j<=i; j++ ) { std::print (\"*\") ; }\n    std::println(\"\") ;\n  }\n  return 0;\n}\n"]
      }
    },
    {
      cid: "c40", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 40 课考试 · 初识 vector", task: "任务题目：建一个装 double 的盒子放三门课的分数并打印 size；再把 zeros 那两个数字换成 3 和 9，看清盒子变成什么样", hint: "想不起来就回看本课「它被设计成什么样」那三条造法、【演示 2】的小数盒和【演示 3】的个数与内容。",
      notes: ["尖括号里写的是类型，不是值也不是个数：它规定这一整盒每格装什么，装几个由花括号里的内容决定。", "圆括号那条的顺序是「先几格、后每格放什么」；把两个数字说反成 (0, 5) 会得到一只空盒子。", "一格不装的空盒子是合法状态，size() 得 0。", "房型必须整盒统一：往装 int 的盒子里塞小数会被编译期的 narrowing 拦下，编译器不会自己调和 int 和 double。", "看到「std 里没有 vector 这个名字」先回去请头文件，别去改尖括号；size 后面那对圆括号也不能省略。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "把 vector 这只盒子请进来：文件顶上写一行 include vector 的头文件（打印那个头文件不算）。", acceptRegex: ["#\\s*include\\s*<\\s*vector\\s*>"], acceptOn: "code", sample: "#include <vector>", why: "盒子不住在打印那个头文件里；少了这一行编译报错，大意是命名空间 std 里没有叫 vector 的名字。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "造一只装小数的盒子：尖括号里定房型为 double，名字后面用花括号列出三门课的分数，三个值都带小数点。", acceptRegex: ["std::vector\\s*<\\s*double\\s*>\\s*\\w+\\s*=\\s*\\{[^}]*\\.[^}]*,[^}]*\\.[^}]*,[^}]*\\.[^}]*\\}"], acceptOn: "code", sample: "std::vector<double> homework = {92.5, 88.0, 79.5};", why: "尖括号里写的是类型，不是值也不是个数；格子数跟着花括号里的内容自动定下来。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "用一条 std::println 问出这只盒子现在装了几个：格式串里留一个占位坑，逗号后面给它的 size()。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\.\\s*size\\s*\\(\\s*\\)\\s*\\)"], acceptOn: "code", sample: "std::println(\"一共 {} 门课\", homework.size());", why: "size 是盒子自己的动作，点、名字、后面那对空圆括号一样不能少，写成 size 会被当成别的名字。" },
        { id: "q4", type: "code", score: 15, coversTask: 2, stem: "把源稿那行圆括号造法照写出来：一只装 int 的盒子，括号里先写 5 再写 0。", acceptRegex: ["std::vector\\s*<\\s*int\\s*>\\s*\\w+\\s*\\(\\s*5\\s*,\\s*0\\s*\\)"], acceptOn: "code", sample: "std::vector<int> zeros(5, 0);", why: "圆括号那条的口诀是「先几格、后每格放什么」，所以这一行是 5 个 0。" },
        { id: "q5", type: "code", score: 15, coversTask: 2, stem: "按任务把那两个数字换成 3 和 9，再造一只盒子：括号里先写 3 再写 9。", acceptRegex: ["std::vector\\s*<\\s*int\\s*>\\s*\\w+\\s*\\(\\s*3\\s*,\\s*9\\s*\\)"], acceptOn: "code", sample: "std::vector<int> nines(3, 9);", why: "个数改 3、内容改 9，得到的是 3 格每格 9；写成 (9, 3) 就变成 9 个 3，完全是另一只盒子。" },
        { id: "q6", type: "code", score: 15, coversTask: 2, stem: "用两格的 range-for 把新造的这只盒子挨个端出来打一遍，亲眼看看它变成什么样。", acceptRegex: ["for\\s*\\(\\s*(?:int|auto|double)\\s+\\w+\\s*:\\s*\\w+\\s*\\)", "std::print(?:ln)?\\s*\\(\\s*\"[^\"]*\\{\\}"], acceptOn: "code", sample: "for (int one : nines) {\n    std::print(\"{} \", one);\n}", why: "盒子能直接遍历，每轮递上来一格的内容；打出来是 9 9 9，一共三格。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<double> homework = {92.5, 88.0, 79.5};\n    std::println(\"一共 {} 门课\", homework.size());\n\n    std::vector<int> zeros(5, 0);\n    std::vector<int> nines(3, 9);\n    for (int one : nines) {\n        std::print(\"{} \", one);\n    }\n    std::println(\"   ← 共 {} 格\", nines.size());\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<double> homework = {92.5, 88.0, 79.5};\n    std::println(\"一共 {} 门课\", homework.size());\n    return 0;\n}\n",
          "#include <print>\n\nint main() {\n    std::vector<int> zeros(5, 0);\n    std::vector<int> nines(3, 9);\n    return 0;\n}\n"],
        loose: [
          "#  include <print>\n#  include < vector >\n\nint main ( )\n{\n  std::vector<double>  fs = {92.5, 88.0, 79.5} ;\n  std::println( \"共 {} 门\" , fs.size ( ) ) ;\n\n  std::vector<int> old_box ( 5 , 0 ) ;\n  std::vector<int>  new_box ( 3 , 9 ) ;\n  for ( auto one : new_box ) { std::print ( \"{} \" , one ) ; }\n  return 0;\n}\n"]
      }
    },
    {
      cid: "c41", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 41 课考试 · 下标取元素与越界", task: "任务题目：打印盒子里第 2 个和第 4 个元素（下标该写几要自己数出来）；再拿 scores[5] 去撞一只只有 0 到 4 号的盒子，看清越界是怎么回事", hint: "想不起来就回看本课那张「5 个格子的编号是 0 到 4」的图、【演示 2】的做减法，还有【演示 3】方括号与 at() 的两种下场。",
      notes: ["「第 N 个元素」和方括号里的编号永远是差一：编号写 N 减 1，跟盒子大小无关；循环里不用减，是因为计数器本来就从 0 数。", "5 格的盒子编号是 0 到 4：scores[4] 取到的是最后一格 88，scores[scores.size()] 天生越界。", "front() 等于 scores[0]，back() 等于最后一格但不用你自己拿 size() 去减；空盒子既没有头也没有尾，front 和 back 都无处可取。", "at() 越界会当场终止并把 out_of_range 说清楚，方括号越界则闷声不响地把程序弄坏 —— 调试期该用 at()。", "用循环安全走完整只盒子：计数器从 0 起，条件写 i 小于 size() 不带等于号；带上等于号就多走一步，那一步正是越界。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "用花括号造一只装 int 的盒子，往里列五个数。", acceptRegex: ["std::vector\\s*<\\s*int\\s*>\\s*\\w+\\s*=\\s*\\{[^}]*,[^}]*,[^}]*,[^}]*\\}"], acceptOn: "code", sample: "std::vector<int> scores = {85, 92, 78, 96, 88};", why: "花括号那条是「列内容」，格子数跟着内容自动定下来，这盒是 5 格。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "用一条 std::println 打印第 2 个元素：方括号里写的编号要减一。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\[\\s*1\\s*\\]"], acceptOn: "code", sample: "std::println(\"第 2 个: {}\", scores[1]);", why: "编号是「离起点差几格」，第一格在 0 号，所以第 2 个在 1 号格，值是 92。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "再用一条 std::println 打印第 4 个元素。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\[\\s*3\\s*\\]"], acceptOn: "code", sample: "std::println(\"第 4 个: {}\", scores[3]);", why: "第 N 个写 N 减 1，这条换算跟盒子多大无关；写 scores[4] 取到的是第 5 个（88），不是第 4 个。" },
        { id: "q4", type: "code", score: 10, stem: "把这份程序写成能跑的形：请进 vector 的头文件，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*vector\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <vector>\n\nint main() {", why: "盒子不住在打印那个头文件里；少了这一行编译就报错，大意是 std 里没有叫 vector 的名字。" },
        { id: "q5", type: "code", score: 20, coversTask: 2, stem: "任务第 2 条：故意取一格不存在的门牌 —— 写一行用 at 取 5 号格（这盒只有 0 到 4 号）。", acceptRegex: ["\\.\\s*at\\s*\\(\\s*5\\s*\\)"], acceptOn: "code", sample: "std::println(\"{}\", scores.at(5));", why: "size() 是「几格」不是「最大编号」，5 格的最后一格在 4 号，5 号格不存在。" },
        { id: "q6", type: "code", score: 15, coversTask: 2, stem: "程序会当场停下来：在它旁边用一行注释写下报错信息里带的那个字样。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 报错信息里带着 out_of_range 这个字样", why: "at() 先查门牌存不存在，查不到就立刻停下来把话说清楚；这一条只能验你确实记了一行笔记，验不了笔记内容对不对。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> scores = {85, 92, 78, 96, 88};\n\n    std::println(\"第 2 个: {}\", scores[1]);\n    std::println(\"第 4 个: {}\", scores[3]);\n\n    std::println(\"{}\", scores.at(5));   // 报错信息里带着 out_of_range 这个字样\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> scores = {85, 92, 78, 96, 88};\n    std::println(\"第一个: {}\", scores[0]);\n    return 0;\n}\n",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> scores = {85, 92, 78, 96, 88};\n    std::println(\"第 2 个: {}\", scores[1]);\n    return 0;\n}\n"],
        loose: [
          "#  include <print>\n#  include <vector>\nint main ( )\n{\n  std::vector<int>  ss = {85,92,78,96,88} ;\n  std::println(\"第二个 {}\" , ss [ 1 ] ) ;\n  std::println( \"第四个 {}\" , ss[3] ) ;\n  std::println( \"{}\" , ss . at ( 5 ) ) ;  // 程序当场终止，说的是 out_of_range\n  return 0;\n}\n"]
      }
    },
    {
      cid: "c42", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 42 课考试 · 尾部添加与删除", task: "任务题目：从一只空盒子出发连续 push_back 三个数字并逐个打印，看清 size 与 back 怎么跟着变；再回答对空盒子 pop_back 会怎样、动手前该先问哪一句", hint: "想不起来就回看本课【演示 2】的空盒起手式、【演示 3】的 if 守卫，还有那张队尾进出的图。",
      notes: ["push_back 永远在尾巴加一格：size() 多 1，back() 换成刚进来的那个值。", "pop_back 请走的是最近一次 push_back 进来的那一格，它没有参数，只请尾巴那一个；想删掉第一个元素不是这一对动作管的活。", "空盒子（0 格）没有尾巴，pop_back 和 back() 都无处可取，属于未定义行为，不该去试；它不会返回被删掉的那个值，也不会自动补一个 0 占位。", "动手删之前先问一句 size() 是不是大于 0，这是本课唯一的护身符；空盒子能加不能删，所以「来一条加一条」才是安全方向。", "push_back 60 紧接着 pop_back 会互相抵消：还是 3 格、back() 回到 78，前面那些格从头到尾没动过。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "把这份程序写成能跑的形：请进 vector 的头文件，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*vector\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <vector>\n\nint main() {", why: "盒子不住在打印那个头文件里；没有 main 链接器也找不到入口。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "声明一只一格都不装的空盒子：尖括号里写 int，名字后面什么都不填。", acceptRegex: ["std::vector\\s*<\\s*int\\s*>\\s*\\w+\\s*;"], acceptOn: "code", sample: "std::vector<int> fav;", why: "空盒子是合法状态，size() 得 0；它能加不能删，正是「来一条加一条」的起手式。" },
        { id: "q3", type: "code", score: 30, coversTask: 1, stem: "往这只空盒子尾部连排进三个你喜欢的数字：三行 push_back，每行各带一个数。", acceptRegex: ["\\.\\s*push_back\\s*\\(\\s*-?\\d+\\s*\\)\\s*;[\\s\\S]*\\.\\s*push_back\\s*\\(\\s*-?\\d+\\s*\\)\\s*;[\\s\\S]*\\.\\s*push_back\\s*\\(\\s*-?\\d+\\s*\\)\\s*;"], acceptOn: "code", sample: "fav.push_back(7);\nfav.push_back(42);\nfav.push_back(100);", why: "push_back 永远在尾巴加一格，格子数跟着加一；它不接受位置参数，也不动前面那些格，两句话改的都是盒子自己，不用拿变量接结果。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "每动一下就重新看一眼：用一条 std::println 把尾上那一格打出来，值的位置给 back()。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\.\\s*back\\s*\\(\\s*\\)"], acceptOn: "code", sample: "std::println(\"最后是 {}\", fav.back());", why: "加完之后 back() 就是刚进来的那个值 —— size() 和 back() 是跟着同步变的。" },
        { id: "q5", type: "code", score: 25, coversTask: 2, stem: "任务第 2 条：请出去之前先看有没有人 —— 用 if 问 size() 是不是大于 0 才 pop_back，再用 else 打一句不能碰。", acceptRegex: ["if\\s*\\(\\s*[^)]*\\.\\s*size\\s*\\(\\s*\\)[^)]*>\\s*0", "\\.\\s*pop_back\\s*\\(\\s*\\)", "\\belse\\b"], acceptOn: "code", sample: "if (box.size() > 0) {\n    box.pop_back();\n} else {\n    std::println(\"现在 0 格，pop_back 不能碰\");\n}", why: "0 格没有尾巴可请，对空盒子 pop_back 是越界级别的错、标准不作保证；正确做法是先用 size() 守卫，而不是指望它提醒你。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> fav;\n\n    fav.push_back(7);\n    fav.push_back(42);\n    fav.push_back(100);\n\n    std::println(\"最后是 {}\", fav.back());\n\n    std::vector<int> box;\n    if (box.size() > 0) {\n        box.pop_back();\n        std::println(\"请出去一个，剩 {} 格\", box.size());\n    } else {\n        std::println(\"现在 0 格，pop_back 不能碰\");\n    }\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> fav;\n    fav.push_back(7);\n    fav.push_back(42);\n    std::println(\"最后是 {}\", fav.back());\n    return 0;\n}\n",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> box;\n    if (box.size() > 0) {\n        box.pop_back();\n    } else {\n        std::println(\"现在 0 格，pop_back 不能碰\");\n    }\n    return 0;\n}\n"],
        loose: [
          "#  include <vector>\nint  main ( )\n{\n  std::vector< int >  my ;\n  my.push_back( 3 ) ;\n  my . push_back ( 9 ) ;\n  my.push_back(11);\n  std::println( \"尾巴 {}\" , my.back ( ) ) ;\n\n  if ( my.size() > 0 ) { my.pop_back ( ) ; }\n  else { std::println(\"空盒别碰\") ; }\n  return 0;\n}\n"]
      }
    },
  ]
};
