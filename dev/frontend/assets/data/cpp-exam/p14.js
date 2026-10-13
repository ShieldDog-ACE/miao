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
      cid: "c59", kind: "paper", pass: 60,
      title: "第 59 课考试 · 传值：函数拿到复印件",
      task: "任务题目：先猜输出再运行 —— 调用 try_change 之后 a 最后是多少？为什么？",
      hint: "想不起来就回看本课【它被设计成什么样】那张三步表、【演示 1】的源稿这段和【演示 2】的两次复印。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          coversTask: 1,
          stem: "调用 try_change(a) 的那一刻，函数里的参数 x 拿到的是什么？",
          options: ["a 那一刻的值的一份复印件，装在函数自己新建的盒子里", "a 这只变量本身，写 x 就是写 a", "什么也没拿到，x 只是排版好看", "整只 a 的外号，跟 a 共用同一格内存"],
          answer: 0,
          why: "传值 = 复印。x 是一只独立的新盒子，出生时值和 a 相同，此后各走各路；「写 x 就是写 a」是带 & 的那种写法，这一课还没学。" },
        { id: "q2", type: "output", score: 16,
          coversTask: 1,
          stem: "这段代码打印什么？（一行一条，这两句都在 main 的花括号里跑）\nvoid try_change(int x) {\n    x = 999;\n    std::println(\"函数里 x = {}\", x);\n}\nint a = 10;\ntry_change(a);\nstd::println(\"调用后 a = {}\", a);",
          acceptLines: ["函数里 x = 999", "调用后 a = 10"],
          why: "副本被改成 999 并当场打印出来；原件 a 一个字节都没被碰过，所以第二行还是 10 —— 这两行数字不一样，就是传值的全部证据。" },
        { id: "q3", type: "code", score: 14,
          coversTask: 1,
          stem: "（任务题）写一行调用：把 main 里那只 a 递给函数 try_change。",
          acceptRegex: ["try_change\\s*\\(\\s*a\\s*\\)"],
          why: "答案形状是 try_change(a); —— 调用时递的是 a 那一刻的值。判分只看这个调用写法在不在，分号、空格都不计较。" },
        { id: "q4", type: "choice", score: 12,
          coversTask: 1,
          stem: "a 出生是 10，先调用一次 report(a)；接着 main 里写 a = 42，再调用一次 report(a)。两次调用里函数分别看到的数是？",
          options: ["第一次 10，第二次 42", "第一次 10，第二次还是 10", "两次都是 42", "第一次 42，第二次 10"],
          answer: 0,
          why: "每次调用都重新复印一次当前值。中间那次 a = 42 改的是原件，第一份旧复印件早就随上一轮调用作废了，不会跟着刷新。" },
        { id: "q5", type: "blank", score: 8,
          coversTask: 1,
          stem: "传值这套规矩，英文写作 pass by ____。（填一个英文单词）",
          accept: ["value", "值", "by value"],
          why: "名字里的 value 就是全部重点：递进去的是值的一份副本，而不是变量本身，也不是变量的地址。" },
        { id: "q6", type: "code", score: 14,
          coversTask: 1,
          stem: "（任务题）写一行函数头：定义 try_change，它收一只 int 的复印件参数 x，什么都不交回来。",
          acceptRegex: ["void\\s*try_change\\s*\\(\\s*int\\s+x\\s*\\)"],
          why: "答案形状是 void try_change(int x) —— void 表示不交回东西，参数写成 int x 就是复印件；这里多一个字符就变成能改原件的了。" },
        { id: "q7", type: "multi", score: 16,
          coversTask: [1],
          stem: "关于传值，下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["函数里对参数的修改，随函数结束一起消失", "同一只变量调用两次，函数会看到两次各自当时的值", "传值这种隔离是好脾气：调完函数不用担心自己的数据被偷偷改掉", "函数里改了参数，外面的变量会跟着一起变"],
          answers: [0, 1, 2],
          why: "第四条正是传值不会发生的事，而且它失败得很安静：编译过、跑得完，就是值不动。前三条凑齐传值的性格 —— 副本独立、每次重印、外面干净。" },
        { id: "q8", type: "order", score: 8,
          stem: "把「先猜输出再验证传值」这条任务的合理步骤排成正确顺序。",
          steps: ["在纸上写下你猜的那两行输出", "运行程序，逐行和自己猜的对照", "对不上的地方回去看参数类型", "用自己的话说清 a 为什么没变"],
          answer: [0, 1, 2, 3],
          why: "源稿这条任务的重点在「先猜」两个字 —— 没猜在前，跑完就只是看了一遍现成的结果，说不清为什么也就没人发现。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: "函数里 x = 999\n调用后 a = 10", q3: "try_change(a);", q4: 0, q5: "value", q6: "void try_change(int x) {", q7: [0, 1, 2], q8: [0, 1, 2, 3] }
        ],
        wrongs: [
          { q1: 1, q2: "函数里 x = 10\n调用后 a = 999", q3: "try_change;", q4: 1, q5: "reference", q6: "int try_change(int x)", q7: [3], q8: [1, 0, 3, 2] }
        ],
        loose: [
          { q1: "0", q2: "函数里 x =  999\n调用后 a = 10\n", q3: "try_change ( a ) ;", q4: "0", q5: "VALUE", q6: "void  try_change  (  int  x  )", q7: [2, 1, 0], q8: ["0", "1", "2", "3"] }
        ]
      }
    },
    {
      cid: "c60", kind: "paper", pass: 60,
      title: "第 60 课考试 · 传引用：函数直接改原稿",
      task: "任务题目：写一个函数把两个数交换，参数表里两只都带引用；调用完把两个数打印出来验证，看它们真的换了没有",
      hint: "想不起来就回看本课【演示 3】swap_two 那三行、【它被设计成什么样】的两行签名对照，还有那张复印件与外号的图。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          coversTask: 1,
          stem: "想让函数真的改到调用者那只变量，参数应当怎么写？",
          options: ["参数写 int x", "参数写 int& x", "参数写 int x，函数末尾再 return x", "参数表留空，函数里直接用 a"],
          answer: 1,
          why: "类型后面挂一个 &，参数就成了那只变量的外号，写它等于写原件。第一个还是复印件，第三个绕了半天只能带出一个值，第四个连名字都接不上。" },
        { id: "q2", type: "code", score: 16,
          coversTask: 1,
          stem: "（任务题）写一行函数头：定义 swap_two，参数是两只都能改原稿的 int 引用，分别叫 a 和 b，什么都不交回来。",
          acceptRegex: ["void\\s*swap\\w*\\s*\\(\\s*int\\s*&\\s*\\w+\\s*,\\s*int\\s*&\\s*\\w+\\s*\\)"],
          why: "答案形状是 void swap_two(int& a, int& b) —— 两只参数各带一个 &，少一只就只换得动一半。函数名后缀、空格与变量名都随你，判分只认这个写法。" },
        { id: "q3", type: "code", score: 14,
          coversTask: 1,
          stem: "（任务题）交换三行的第一步：把 a 的旧值临时存进一只起名叫 t 的新盒子。写这一行。",
          acceptRegex: ["int\\s+t\\s*=\\s*a"],
          why: "答案形状是 int t = a; —— 赋值是覆盖，不先把手挪开，a 的旧值就永久丢了。临时盒子必须在这儿新建，它不往外带东西。" },
        { id: "q4", type: "output", score: 14,
          coversTask: [1],
          stem: "这段代码打印什么？（一行一条）\nvoid real_change(int& x) {\n    x = 999;\n}\nint a = 10;\nreal_change(a);\nstd::println(\"调用后 a = {}\", a);",
          acceptLines: ["调用后 a = 999"],
          why: "源稿这段：参数是原稿的外号，函数里那句赋值直接落在 a 那一格内存上，所以外面打印出来就是 999，而不是上一课的 10。" },
        { id: "q5", type: "choice", score: 12,
          coversTask: 1,
          stem: "把 swap_two 的两只参数的 & 全删掉再编译运行，你会遇到什么？",
          options: ["跑得通、不报错，两个数一个也没换", "编译器当场拒绝，说少了 &", "只有第一个数被换成对方的值", "两个数都变成 0"],
          answer: 0,
          why: "复印件也是合法的盒子，往里写什么都行，只是没人把结果搬回原件 —— 所以症状是「很成功地什么都没做」，只能靠打印当场核对。" },
        { id: "q6", type: "blank", score: 10,
          coversTask: 1,
          stem: "参数类型后面那个 & 读作____（两个字），意思是这个名字直接接在原件身上，不再复印一份。",
          accept: ["引用", "reference"],
          why: "引用就是给已有的变量再起一个名字，写它就是写正主。它和第 44 课 range-for 里那个 & 是同一个字、同一件事，只是这次写在参数表上。" },
        { id: "q7", type: "multi", score: 16,
          coversTask: [1],
          stem: "关于引用参数，下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["交换两个数必须先拿临时盒子接住一个旧值", "调用时得递一只真实存在的变量，递一个现成的数字会被编译器拦住", "参数表里两只都要改就两只都带 &，只带一只就只改得动一只", "带 & 的参数没法读变量的值，只能往里写"],
          answers: [0, 1, 2],
          why: "第四条反了：外号当然能读，读和写都通着原件。第二条那条错的大意是「非常量引用只能绑定左值」，说的就是数字没有一格可写的内存。" },
        { id: "q8", type: "order", score: 6,
          stem: "把「用引用函数交换两个数并确认成功」的合理步骤排成正确顺序。",
          steps: ["写好两只参数都带 & 的函数头", "函数体里先存旧值、再覆盖、最后回填", "在 main 里调用，把两只变量递进去", "打印这两个变量，核对它们真的换了"],
          answer: [0, 1, 2, 3],
          why: "先定签名再写函数体，然后调用、验证。最后那步打印最容易省也最不能省 —— 这一课的失败全都是安静的，不打印就等于没检查。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: "void swap_two(int& a, int& b) {", q3: "int t = a;", q4: "调用后 a = 999", q5: 0, q6: "引用", q7: [0, 1, 2], q8: [0, 1, 2, 3] }
        ],
        wrongs: [
          { q1: 0, q2: "void swap_two(int a, int b) {", q3: "a = b;", q4: "调用后 a = 10", q5: 1, q6: "指针", q7: [3], q8: [3, 2, 1, 0] }
        ],
        loose: [
          { q1: "1", q2: "void  swap (  int  &  a ,  int  &  b  )", q3: "int  t  =  a  ;", q4: "调用后 a =  999", q5: "0", q6: "REFERENCE", q7: [2, 0, 1], q8: ["0", "1", "2", "3"] }
        ]
      }
    },
    {
      cid: "c61", kind: "paper", pass: 60,
      title: "第 61 课考试 · const 引用：只许看不许摸",
      task: "任务题目：在只读函数 total 里加一行 v[0] = 0，编译看看报什么错，并说清这条错为什么是在保护你",
      hint: "想不起来就回看本课【演示 3】那次手滑、【它被设计成什么样】的三种签名对照，还有那张戴手套逛博物馆的图。",
      questions: [
        { id: "q1", type: "choice", score: 14,
          coversTask: 1,
          stem: "total 的参数是 const 引用。在它的函数体里加一句 v[0] = 0;，会看到什么？",
          options: ["编译不通过，报错停在赋值那一行，说那个位置是只读的", "编译通过，运行后盒子里第一个数变成 0", "编译通过，程序照跑，外面的盒子其实没变", "只给一句警告，然后照常跑完"],
          answer: 0,
          why: "这正是 const 在保护你：想摸原件的那一步被当场拦下，错停在写它的那一行，不必等跑完再追查数据是怎么花的。" },
        { id: "q2", type: "code", score: 14,
          coversTask: 1,
          stem: "（任务题）写出那句「手滑想改原件第一格」的赋值，盒子叫 v，把它写进 0。",
          acceptRegex: ["v\\s*\\[\\s*0\\s*\\]\\s*=\\s*0"],
          why: "答案形状是 v[0] = 0; —— 单个等号是赋值，写成两个等号就变成比较、什么也不会发生。这句在只读函数里编译不过，那正是本课要你撞的错。" },
        { id: "q3", type: "output", score: 12,
          stem: "这段代码打印什么？（一行一条）\nint total(const std::vector<int>& v) {\n    int sum = 0;\n    for (int x : v) sum += x;\n    return sum;\n}\nstd::vector<int> scores = {85, 92, 78, 96};\nstd::println(\"总分 = {}\", total(scores));",
          acceptLines: ["总分 = 351"],
          why: "85 加 92 加 78 加 96 得 351。const 引用只是把盒子接过来看，函数体里的读法一个都没少：取格子、问个数、挨个遍历照旧能使。" },
        { id: "q4", type: "choice", score: 12,
          coversTask: 1,
          stem: "签名 const std::vector<int>& v 里，const 和 & 各自管什么？",
          options: ["& 管不复印，const 管不许改", "const 管不复印，& 管不许改", "两个都只管不复印", "两个都只管不许改"],
          answer: 0,
          why: "拆开最好记：写 & 是为了省下整份拷贝，写 const 是把这只把手上「能写」的权力收走。叠在一起就是又快又安全。" },
        { id: "q5", type: "blank", score: 10,
          coversTask: 1,
          stem: "那条报错出现的时间是____那一刻（填一个词），所以程序还没跑起来你就已经知道出事了。",
          accept: ["编译", "编译期", "compile"],
          why: "上一课那种丢 & 的失败要等到跑完看输出才发现，const 这类失败在编译就被拦下 —— 越早暴露的错越便宜。" },
        { id: "q6", type: "code", score: 12,
          stem: "写一行函数签名：定义 describe，收一只既不想复印也不打算改的 vector<int>，盒子叫 v。",
          acceptRegex: ["const[\\s\\S]{0,16}vector\\s*<\\s*int\\s*>\\s*&"],
          why: "答案形状是 void describe(const std::vector<int>& v) —— const 在最前、尖括号写元素类型、& 紧跟尖括号，三样缺一不可。" },
        { id: "q7", type: "multi", score: 16,
          coversTask: [1],
          stem: "关于 const 引用，下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["本来就不许改的那只盒子，只有 const 引用才接得住", "函数体里一句赋值给参数的话都没有，就该把 const 写上", "写上 const 之后，问 size、取格子、遍历这些读法就不能用了", "const 只挡写，不挡越界：空盒子里取 v[0] 照样出事"],
          answers: [0, 1, 3],
          why: "第三条想多了：只读的意思是不能写，读法一个都不少。第四条最容易被忽略 —— 判空得自己写一句，这件事 const 帮不了你。" },
        { id: "q8", type: "order", score: 10,
          stem: "把「给一个函数挑对参数写法」的判断顺序排成正确顺序。",
          steps: ["先问这个函数要不要改调用者的数据", "要改就把参数写成带 & 的引用", "不改，就再问一句盒子大不大", "大就补成 const 引用，小就照常传值"],
          answer: [0, 1, 2, 3],
          why: "两问定形态：改不改、大不大。int 那种一格就装下的小东西套 const 引用只是把签名写长，真正需要它的是装着几千个元素的盒子。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: "v[0] = 0;", q3: "总分 = 351", q4: 0, q5: "编译", q6: "void describe(const std::vector<int>& v) {", q7: [0, 1, 3], q8: [0, 1, 2, 3] }
        ],
        wrongs: [
          { q1: 1, q2: "v[0] == 0;", q3: "总分 = 85", q4: 1, q5: "运行", q6: "void describe(std::vector<int>& v) {", q7: [2], q8: [3, 2, 1, 0] }
        ],
        loose: [
          { q1: "0", q2: "v [ 0 ]  =  0 ;", q3: "总分 =  351", q4: "0", q5: "编译期", q6: "describe ( const  vector<int> & v )", q7: [3, 1, 0], q8: ["0", "1", "2", "3"] }
        ]
      }
    },
    {
      cid: "c62", kind: "paper", pass: 60,
      title: "第 62 课考试 · 引用妙用：一次带回多个结果",
      task: "任务题目：给 min_max 再加一个引用参数，顺带把总分也算出来带回 main，三个结果一次打印",
      hint: "想不起来就回看本课【演示 3】那只多出来的答案格、【它被设计成什么样】的三种出口对照，还有那张递答案格的图。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          coversTask: 1,
          stem: "为什么这个函数不靠 return 把最小值和最大值一起交回来？",
          options: ["return 一次只能拎一个值", "return 不能交整数", "带引用参数的函数不许写 return", "最小值和最大值不是值，是名字"],
          answer: 0,
          why: "一只手只能拎一个值，这是 return 的天生限制。要拎两个可以 return 一个第 46 课那种 pair，再多就别扭 —— 引用参数才是几格配几支笔的那条路。" },
        { id: "q2", type: "code", score: 16,
          coversTask: 1,
          stem: "（任务题）写函数头的参数表：把 min_max 扩成三只答案格，最后那只叫 sum，前两只还是 lo 和 hi，名单照旧只读递进来。",
          acceptRegex: ["int\\s*&\\s*sum"],
          why: "答案形状是 void min_max(const std::vector<int>& v, int& lo, int& hi, int& sum) —— 加一个结果就是加一格，判分只认新加那格的写法 int& sum。" },
        { id: "q3", type: "code", score: 14,
          coversTask: 1,
          stem: "（任务题）写一行：把这一轮走到的 x 累加进答案格 sum。",
          acceptRegex: ["sum\\s*\\+=\\s*x"],
          why: "答案形状是 sum += x; —— += 是第 24 课那个复合赋值，而 sum 是外面那只格子的外号，所以这一笔真的留得下来。" },
        { id: "q4", type: "output", score: 14,
          coversTask: [1],
          stem: "这段代码打印什么？（一行一条）\nstd::vector<int> nums = {85, 92, 58, 96, 73};\nint lo = 0, hi = 0;\nmin_max(nums, lo, hi);\nstd::println(\"最小 {}，最大 {}\", lo, hi);",
          acceptLines: ["最小 58，最大 96"],
          why: "函数起手把两只格子都写成 v[0]，也就是 85，走一遍把更小的 58、更大的 96 各自记下；结果写在 main 的变量上，所以当场就能打印出来。" },
        { id: "q5", type: "choice", score: 12,
          stem: "函数开头写 lo = v[0]、hi = v[0]，而不是让两只格子从 0 起步，为什么？",
          options: ["拿 0 当起点，它会冒充最小值，报出一个名单里根本没有的数", "v[0] 一定是名单里最小的那个数", "从 0 起步编译器会拦下来", "两只格子必须先写成同一个数字才能比较"],
          answer: 0,
          why: "全是正数的名单里 0 一定一路赢到底，函数就报「最小 0」，可这个 0 不在盒子里。找最值的起手式是：起点来自数据本身。" },
        { id: "q6", type: "blank", score: 8,
          coversTask: 1,
          stem: "本课的节奏是三步：先把答案格____（两个字，指在 main 里把它们写出来），再递进函数，最后用格子里的结果。",
          accept: ["摆好", "声明", "定义"],
          why: "格子不存在，函数就没有可写的那一格内存 —— 这也是为什么递一只现成的数字会被编译器拦住。" },
        { id: "q7", type: "multi", score: 16,
          coversTask: [1],
          stem: "关于用引用参数带回多个结果，下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["进来的材料带 const，出去的答案格不带 const，这条线别画反", "调用时实参顺序写反，最小和最大会互换，编译器不会提醒", "同一份结果既写进答案格又 return 一份，是更稳妥的做法", "一趟路可以同时填好几格，名单只需要走一遍"],
          answers: [0, 1, 3],
          why: "第三条恰恰是坑：两条出口迟早对不上，改的时候极易只改一边。第二条要当心 —— 传引用的顺序错误是安静的，屏幕上只会看到两个数调了个个儿。" },
        { id: "q8", type: "order", score: 8,
          stem: "把「给 min_max 添一只答案格带回总分」的改动顺序排成正确顺序。",
          steps: ["参数表末尾加一只 int& sum", "函数体开头把 sum 清成 0", "循环里补一句把 x 累加进 sum", "在 main 里摆好 sum 并把它递进调用"],
          answer: [0, 1, 2, 3],
          why: "先改签名、再改函数体，最后回到调用处补格子并递进去。漏了第四步就会出现「函数里明明加了，出来还是 0」那种怪结果。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: "void min_max(const std::vector<int>& v, int& lo, int& hi, int& sum) {", q3: "sum += x;", q4: "最小 58，最大 96", q5: 0, q6: "摆好", q7: [0, 1, 3], q8: [0, 1, 2, 3] }
        ],
        wrongs: [
          { q1: 1, q2: "void min_max(const std::vector<int>& v, int& lo, int& hi) {", q3: "sum = x;", q4: "最小 85，最大 85", q5: 1, q6: "打印", q7: [2], q8: [3, 1, 0, 2] }
        ],
        loose: [
          { q1: "0", q2: "min_max(const std::vector<int>& v, int& lo, int& hi, int & sum)", q3: "sum  +=  x  ;", q4: "最小 58，最大  96", q5: "0", q6: "声明", q7: [3, 1, 0], q8: ["0", "1", "2", "3"] }
        ]
      }
    }
  ]
};
