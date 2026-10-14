/* 喵站 · C++ 入门 考卷分部 p02：第 6–10 课（第九轮）
 *
 * 每场卷照 cpp-exam/p01.js 的形状与硬指标（cpp-exam-check 逐条对账）：
 *   1. kind:"paper"，题型只用笔试引擎认的六种（choice/multi/blank/code/output/order）；
 *   2. 各题 score 相加正好 100；
 *   3. 源稿每一条【任务】都有题用 coversTask 对着它（序号从 1 起，一条题可盖多条）；
 *   4. 带 coversTask 的题合计 ≥50 分；choice ≥2；output ≥1；
 *   5. 每题带 why；selftest 的 refs 判 100、wrongs 判 <60、loose 判 ≥60。
 *
 * 验收：node dev/tools/cpp-exam-check.cjs --only c06,c07,c08,c09,c10
 */
window.MIAO_CPP_EXAM_P02 = {
  papers: [
    {
      cid: "c06", kind: "paper", mode: "quiz", pass: 60, title: "第 6 课考试 · const 常量", task: "任务题目：亲眼看到改 const 常量会被编译器拦下；声明 const 常量 DAILY_WORDS = 15 并算出一年背多少单词", hint: "想不起来就回看本课【演示 2】的两条注释和【演示 3】的具名常量。",
      questions: [
        { id: "q1", type: "choice", score: 15, coversTask: 1, stem: "已经写了 const int MAX_SCORE = 750;，再来一行 MAX_SCORE = 800;，会怎样？", options: ["编译报错：往只读的盒子里写，编译器拦下", "悄悄改成 800，程序照跑", "编译能过，运行时才崩溃", "合法，但打印出来还是 750"], answer: 0, why: "const 的含义就是这只盒子上生只准赋值一次；写它是编译期就判定的错误，不会等到运行。" },
        { id: "q2", type: "choice", score: 13, coversTask: 1, stem: "把 const int DAYS; 单独一行写进程序（不给初值），编译器的意思是？", options: ["警告一下就好，DAYS 当成 0", "报错：const 变量声明时必须初始化", "合法，用的时候再补值", "自动当成 365"], answer: 1, why: "锁上的盒子必须当场交货：以后再也写不进去，现在又不给值，这种盒子 C++ 不允许存在。" },
        { id: "q3", type: "output", score: 18, coversTask: 2, stem: "这段代码打印什么？（一行一条）\nconst int DAILY_WORDS = 15;\nstd::println(\"一年 {}\", 365 * DAILY_WORDS);", acceptLines: ["一年 5475"], why: "365 乘 15 等于 5475；常量只是个名字，读的时候跟直接写数字一样参与运算。" },
        { id: "q4", type: "blank", score: 12, coversTask: 2, stem: "本项目的习惯：常量名用____加下划线写，比如 DAILY_WORDS、MAX_SCORE。（填一种大小写写法）", accept: ["全大写", "全部大写", "大写", "全是大写"], why: "全大写是给读代码的人看的信号：一眼知道这个值锁着、别碰。编译器不强制，但约定要守。" },
        { id: "q5", type: "choice", score: 12, stem: "「魔法数字」指的是什么？", options: ["直接写在代码里、没人知道含义的数字", "超出 int 上限的大数", "带小数的数字", "用 const 声明的常量"], answer: 0, why: "750、0.03 这种光秃秃写在代码里的数，过两天没人知道它是什么意思 —— 本课的对策是提成具名常量。" },
        { id: "q6", type: "multi", score: 18, stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）", options: ["满分变了，用具名常量只需要改一处", "const 会让盒子占的字节数变少", "判断该不该锁，看的是这个值在程序里会不会变", "常量用小写 max_score 命名，编译器会报错"], answers: [0, 2], why: "const 不改变大小（字节数照旧）；命名习惯没有强制力，小写也能编译，只是丢掉了给人看的信号。" },
        { id: "q7", type: "choice", score: 12, stem: "下面哪一处**最该**用 const？", options: ["游戏中当前的血量", "一周有 7 天这个事实", "用户从键盘输入的年龄", "循环里正在变化的计数"], answer: 1, why: "一周 7 天在整个程序里都不该变；血量、输入值、循环计数都天生要变，锁上就等于自缚。" }
      ],
      selftest: {
        refs: [
          {q1: 0, q2: 1, q3: "一年 5475", q4: "全大写", q5: 0, q6: [0, 2], q7: 1}],
        wrongs: [
          {q1: 1, q2: 0, q3: "一年 5475.0", q4: "小写", q5: 3, q6: [1, 3], q7: 0}],
        loose: [
          {q1: "0", q2: "1", q3: "一年  5475", q4: "全部大写", q5: "0", q6: [0, 2], q7: "1"}]
      }
    },
    {
      cid: "c07", kind: "paper", mode: "quiz", pass: 60, title: "第 7 课考试 · 命名规范", task: "任务题目：判出 int A、int x1、int price_r_m_b 三个名字的毛病并改成规范的；用你选的一种风格声明「班级人数」「上学方式」并打印", hint: "想不起来就回看本课【演示 3】的改名对照和「它被设计成什么样」那三问。",
      questions: [
        { id: "q1", type: "choice", score: 17, coversTask: 1, stem: "下面四个名字，哪个最符合本课的规范？", options: ["A", "x1", "class_count", "price_r_m_b"], answer: 2, why: "class_count 念出来就知道是班级数量，还守了小写加下划线；另外三个要么单字母、要么带数字尾巴、要么缩写叠三层。" },
        { id: "q2", type: "choice", score: 12, stem: "关于变量名，编译器的态度是什么？", options: ["不在乎名字的含义，只要符合标识符规则就照样编译", "会拒绝 a 这种单字母名字", "要求所有名字都用小写", "要求名字里带上单位"], answer: 0, why: "名字是给人看的：编译器只查底线（字母数字下划线、不能数字开头、不占关键字），含义对不对它管不了。" },
        { id: "q3", type: "output", score: 19, coversTask: 2, stem: "这段代码打印什么？（一行一条）\nint class_count = 42;\nstd::string school_way = \"bus\";\nstd::println(\"{} 人，坐 {}\", class_count, school_way);", acceptLines: ["42 人，坐 bus"], why: "两个占位坑按顺序填：先 class_count 的 42，再 school_way 里的 bus。名字好，读代码就不用猜。" },
        { id: "q4", type: "blank", score: 14, coversTask: 1, stem: "int A、int x1、int price_r_m_b 三个名字不合格的根子是同一个：都做不到见名知____。（填一个字）", accept: ["意"], why: "看见名字就知道它装的是什么，这是命名的唯一硬标准；风格、大小写都是为它服务的。" },
        { id: "q5", type: "multi", score: 16, stem: "下面关于命名风格的说法，哪些是对的？（多选，错勾任何一项整题 0 分）", options: ["snake_case 是全小写加下划线", "camelCase 要求第一个词的首字母也大写成 MyAge", "同一个项目里两种风格可以随便混着用", "常量按习惯写成全大写加下划线，比如 MAX_SCORE"], answers: [0, 3], why: "小驼峰是第一个词全小写（myAge）；混用风格会逼读代码的人反复判断「这两个是不是同一个变量」。" },
        { id: "q6", type: "choice", score: 11, stem: "「坏名字」的危害为什么容易被忽视？", options: ["因为程序照样编译通过、结果也正确，看不见的成本落在读的人身上", "因为编译器只在调试模式下检查", "因为坏名字会被自动重命名", "因为它一定会导致运行时崩溃"], answer: 0, why: "这正是它阴的地方：不出错，只是以后每次读这段代码的人都得多花三十秒猜。" },
        { id: "q7", type: "order", score: 11, stem: "把「给一个变量改名」的合理步骤排成正确顺序。", answer: [0, 1, 2, 3], steps: ["想清楚这个值到底是什么、干什么用", "问自己它带不带单位、会不会变", "按项目统一的那一种风格把名字写出来", "如果它不会变，升级成 const 常量并写成全大写"], why: "先弄清含义再命名，顺序反了就只是在换字母；最后一步接的是上一课的 const。" }
      ],
      selftest: {
        refs: [
          {q1: 2, q2: 0, q3: "42 人，坐 bus", q4: "意", q5: [0, 3], q6: 0, q7: [0, 1, 2, 3]}],
        wrongs: [
          {q1: 0, q2: 1, q3: "42", q4: "形", q5: [1, 2], q6: 3, q7: [3, 2, 1, 0]}],
        loose: [
          {q1: "2", q2: "0", q3: "42 人，坐  bus", q4: "意", q5: [0, 3], q6: "0", q7: ["0", "1", "2", "3"]}]
      }
    },
    {
      cid: "c08", kind: "paper", mode: "quiz", pass: 60, title: "第 8 课考试 · 整数与四则运算", task: "任务题目：改掉初值先心算再验证；新加一行打印 a * 2 + b 的结果", hint: "回看本课【演示 1】的三行运算和「它被设计成什么样」里表达式一步步塌成数的过程。",
      questions: [
        { id: "q1", type: "choice", score: 12, coversTask: 1, stem: "int a = 10; 改成 int a = 20; 之后，原本打印 a + b（b 仍是 3）的那一行会打出什么？", options: ["13", "20", "23", "还是 10"], answer: 2, why: "表达式每次用到都按盒子当下的值重算：20 加 3 得 23，改初值等于改了所有用到它的算式。" },
        { id: "q2", type: "choice", score: 10, stem: "C++ 里表示乘法用的是哪个符号？", options: ["×", "*", "x", "^"], answer: 1, why: "键盘上没有数学里的乘号，早期只能拿星号替；写 × 编译器认不出来，报错看着像文件坏了。" },
        { id: "q3", type: "blank", score: 24, coversTask: 2, stem: "（任务题）已有 int a = 10; 和 int b = 3;。写一行 std::println，把 a 乘 2 再加 b 的结果打出来（占位坑里放表达式）。", acceptRegex: ["println\\s*\\([^)]*a\\s*\\*\\s*2\\s*\\+\\s*b"], sample: "std::println(\"{}\", a * 2 + b);", why: "写法就是把算式直接放进占位坑：std::println(\"{}\", a * 2 + b); —— 先乘后加，塌成 23。" },
        { id: "q4", type: "output", score: 16, coversTask: 1, stem: "这段代码两行分别打印什么？（一行一条）\nint price = 7;\nint total = 6 * price;\nint paid = 50;\nstd::println(\"总价 {} 元\", total);\nstd::println(\"找回 {} 元\", paid - total);", acceptLines: ["总价 42 元", "找回 8 元"], why: "6 乘 7 得 42 存进 total；找回的钱是 50 减 42。第二行也是个表达式，用到时才算。" },
        { id: "q5", type: "blank", score: 10, stem: "两个 int 相减，结果的类型还是____。（填类型名）", accept: ["int", "整数", "int 类型"], why: "类型在声明那一刻定死（第 3 课），整数运算在整数范围里闭合，不会算出小数。" },
        { id: "q6", type: "multi", score: 14, stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）", options: ["星号 * 是乘号，数学里的 × 编译器不认", "写成 a + b 之后，a 和 b 盒子里的值会被改掉", "int triple = 3 * a; 里 triple 拿到的是一个算好的数，不是公式", "斜杠 / 本课还没正式讲"], answers: [0, 2, 3], why: "表达式只是「一个还没算出来的数」，读盒子不改盒子；除法下一课专讲，它比减法更会坑人。" },
        { id: "q7", type: "choice", score: 8, stem: "hp = hp - 30; 这一行发生了什么？", options: ["先算右边，再把结果装回 hp", "把 hp 删了重建", "hp 变成 30", "编译报错：等号两边都有 hp"], answer: 0, why: "等号是「把右边的值装进左边的盒子」，先右后左；数学里的相等在这里不成立。" },
        { id: "q8", type: "order", score: 6, stem: "把「a * 2 + b」算成结果的过程排成正确顺序。", answer: [0, 1, 2, 3], steps: ["把 a 换成它现在的值 10", "把 b 换成它现在的值 3", "先算乘法得 20", "再算加法得 23"], why: "先取盒子的值，再按先乘后加的规矩化简，最后塌成一个数交给 println。" }
      ],
      selftest: {
        refs: [
          {q1: 2, q2: 1, q3: "std::println(\"{}\", a * 2 + b);", q4: "总价 42 元\n找回 8 元", q5: "int", q6: [0, 2, 3], q7: 0, q8: [0, 1, 2, 3]}],
        wrongs: [
          {q1: 0, q2: 0, q3: "std::println(\"{}\", a);", q4: "总价 42 元", q5: "double", q6: [1], q7: 1, q8: [3, 2, 1, 0]}],
        loose: [
          {q1: "2", q2: "1", q3: "println ( \"{}\" ,  a*2+b ) ;", q4: "总价  42 元\n找回  8 元", q5: "整数", q6: [0, 2, 3], q7: "0", q8: ["0", "1", "2", "3"]}]
      }
    },
    {
      cid: "c09", kind: "paper", mode: "quiz", pass: 60, title: "第 9 课考试 · 整数除法与取余", task: "任务题目：用 / 和 % 各一次把 100 分钟换成一小时四十分钟；把 10.0 改成 10，说清输出为什么变了", hint: "回看本课【演示 2】的单位换算和【演示 3】里 10 / b 与 10.0 / b 的对照。",
      questions: [
        { id: "q1", type: "output", score: 26, coversTask: 1, stem: "这段代码打印什么？（一行一条）\nint minutes = 100;\nstd::println(\"{} 分钟 = {} 小时 {} 分\", minutes, minutes / 60, minutes % 60);", acceptLines: ["100 分钟 = 1 小时 40 分"], why: "100 除以 60 的整数部分是 1（凑出一个整小时），100 对 60 取余得 40（剩下的零头）—— 两个运算各司一半。" },
        { id: "q2", type: "choice", score: 24, coversTask: 2, stem: "原来写 std::println(\"{:.4f}\", 10.0 / b);（b 是 3）打出 3.3333。把 10.0 改成 10 之后会怎样？", options: ["还是 3.3333", "打出 3 这样的整数结果", "编译报错", "打出 4"], answer: 1, why: "两边都成了 int，就按整数除法算，小数部分当场被砍掉；编译器一声不响，这是最容易被忽略的改法。" },
        { id: "q3", type: "choice", score: 10, stem: "-7 / 2 的结果是多少？", options: ["-4", "-3.5", "-3", "运行才崩"], answer: 2, why: "截断是「向零」，不是「向小」：-3.5 砍成 -3；跟着 -7 % 2 会是 -1，余数符号跟被除数。" },
        { id: "q4", type: "blank", score: 8, stem: "10 块钱分给 3 个人，每人 3 块；想知道手里还剩几块，用____运算。（填一个运算符或它的名字）", accept: ["%", "取余", "求余", "mod", "余数"], why: "/ 管「分出去多少」，% 管「没分掉的零头」，两个合起来才是一次完整的分配。" },
        { id: "q5", type: "output", score: 9, stem: "这两行分别打印什么？（一行一条，按顺序写）\nstd::println(\"{}\", 17 / 5);\nstd::println(\"{}\", 17 % 5);", acceptLines: ["3", "2"], why: "17 块 5 个人：每人 3 块，剩 2 块。验算 3 * 5 + 2 == 17。" },
        { id: "q6", type: "multi", score: 16, stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）", options: ["两个 int 相除，结果还是 int", "(a / b) * b + a % b 的结果等于 a", "10.5 % 3 能正常编译运行", "除数是 0 时编译器会拦住你"], answers: [0, 1], why: "% 只服务整数，浮点会报错；除数为 0 是运行时才炸的严重错误，编译器不拦 —— 所以别写出来。" },
        { id: "q7", type: "choice", score: 7, stem: "算平均分（总分和人数都是 int）想保留小数，正确的做法是？", options: ["让参与除法的其中一边先变成带小数点的数", "在结果后面补 .0", "改用 % 来求", "整数除法没救，只能放弃小数"], answer: 0, why: "损失发生在除的那一刻，事后补不回来；只要有一边是 double，整个除法就按小数做。" }
      ],
      selftest: {
        refs: [
          {q1: "100 分钟 = 1 小时 40 分", q2: 1, q3: 2, q4: "%", q5: "3\n2", q6: [0, 1], q7: 0}],
        wrongs: [
          {q1: "100 分钟 = 1 小时 4 分", q2: 0, q3: 0, q4: "/", q5: "3.4", q6: [2, 3], q7: 1}],
        loose: [
          {q1: "100  分钟 = 1  小时 40 分", q2: "1", q3: "2", q4: "取余", q5: " 3 \n 2 ", q6: [0, 1], q7: "0"}]
      }
    },
    {
      cid: "c10", kind: "paper", mode: "quiz", pass: 60, title: "第 10 课考试 · 装不下的大数", task: "任务题目：把 400000000000LL 换成 int 看打出的鬼数字；再用 int 装 90 亿、换 long long 对比两行输出", hint: "回看本课【演示 2】的鬼数字、【演示 3】的两行对照，以及里程表那个类比。",
      questions: [
        { id: "q1", type: "choice", score: 17, coversTask: 1, stem: "把 long long big = 400000000000LL; 的类型改成 int（其余不动），编译运行会怎样？", options: ["编译直接报错，程序编不出来", "程序照样跑，打出一个绕回来的怪数（常见机器上是 568041472）", "值不变，还是 400000000000", "屏幕上打印 0"], answer: 1, why: "类型没错、只是数值超出格子数量，编译器通常只给警告；数从天花板绕回地面，照跑照错。" },
        { id: "q2", type: "output", score: 21, coversTask: 2, stem: "这段代码打印什么？（一行一条）\nlong long big = 9000000000LL;\nstd::println(\"{}\", big);", acceptLines: ["9000000000"], why: "90 亿超出 int 约 21 亿的上限，但 long long 装得下，尾巴的 LL 让它一开始就住对盒子。" },
        { id: "q3", type: "choice", score: 15, coversTask: 1, stem: "为什么这种「装不下」编译器一般只警告而不报错？", options: ["类型是对的，超出的是数值；盒子多大、你想要多大的数，编译器替你决定不了", "因为 g++ 检查不出来", "因为 int 其实装得下 4000 亿", "因为溢出在 C++ 里是合法的语法"], answer: 0, why: "第 3 课那条「类型对不上就拦下」管的是类型；本课类型匹配、只是值超范围，编译器只能提醒你不能替你拿主意。" },
        { id: "q4", type: "blank", score: 13, stem: "写很大的整数字面量时，尾巴上要加上____，明确告诉编译器按 long long 存。（填后缀）", accept: ["LL", "ll", "LL 后缀", "两个 L"], why: "不写后缀时类型由编译器先猜；写了 LL，这个数从一开始就住在大盒子里。" },
        { id: "q5", type: "multi", score: 17, stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）", options: ["int 的正数上限大约在 21 亿", "long long 至少 8 字节，正数能到约 9.2 乘以 10 的 18 次方", "两个 int 各自都不大，但乘积超出时结果照样会绕回来", "long long 想装多大就多大"], answers: [0, 1, 2], why: "long long 也会溢出（阶乘、指数增长一样爆）；乘法按操作数的类型算，两边都是 int 就先用 int 算。" },
        { id: "q6", type: "output", score: 9, stem: "这行打印什么？\nstd::println(\"{}\", sizeof(long long));", acceptLines: ["8"], why: "第 4 课那根探针：int 是 4 字节，long long 是 8 字节 —— 差距就是「21 亿」和「92 亿亿」。" },
        { id: "q7", type: "choice", score: 8, stem: "下面哪个量最该用 long long 而不是 int？", options: ["一个班的人数", "从 1970 年元旦算起的秒数", "一周有几天", "一次考试的分数"], answer: 1, why: "秒级时间戳的量级早已远超 21 亿；其余三个都远小于 int 的上限，用 int 足够。" }
      ],
      selftest: {
        refs: [
          {q1: 1, q2: "9000000000", q3: 0, q4: "LL", q5: [0, 1, 2], q6: "8", q7: 1}],
        wrongs: [
          {q1: 0, q2: "410065408", q3: 2, q4: "4", q5: [3], q6: "4", q7: 0}],
        loose: [
          {q1: "1", q2: " 9000000000 ", q3: "0", q4: "ll", q5: [0, 1, 2], q6: " 8 ", q7: "1"}]
      }
    },
  ]
};
