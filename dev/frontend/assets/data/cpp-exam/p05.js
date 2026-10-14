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
      cid: "c21", kind: "paper", mode: "quiz", pass: 60, title: "第 21 课考试 · 算术运算符上场", task: "任务题目：对输入的数用 + - * / % 做一次完整运算；亲眼确认取余不收小数", hint: "想不起来就回看正文【演示 1】的四个问法和【演示 3】那条报错。",
      questions: [
        { id: "q1", type: "choice", score: 15, coversTask: 1, stem: "int price = 8; int count = 3; int total = price * count; 那么 std::println(\"{}\", 100 - total); 打出多少？", options: ["100", "76", "24", "8"], answer: 1, why: "total 是 24，100 - 24 得 76。运算符两边算完会塌成一个值，直接进占位坑。" },
        { id: "q2", type: "output", score: 16, coversTask: 1, stem: "这段程序（单价 8、数量 3）四行打印分别是什么？（一行一条，按顺序写）\nint total = price * count;\nstd::println(\"总价 = {}\", total);\nstd::println(\"付 100 找零 = {}\", 100 - total);\nstd::println(\"总价里有几个 10 = {}\", total / 10);\nstd::println(\"不满 10 的零头 = {}\", total % 10);", acceptLines: ["总价 = 24", "付 100 找零 = 76", "总价里有几个 10 = 2", "不满 10 的零头 = 4"], why: "同一个总价的四种问法：乘法、减法、整除（装得下几个 10）、取余（剩几块）。" },
        { id: "q3", type: "choice", score: 12, coversTask: 2, stem: "把取余左边的数换成小数：double money = 10.5; 然后写 money % 4，会怎样？", options: ["打出 2.5", "打出 2", "编译就过不去，报 invalid operands 之类", "能编译，运行时才崩"], answer: 2, why: "余数的定义依赖整除，% 只在整数之间成立；类型对不上，编译器在编译阶段就拦下。" },
        { id: "q4", type: "blank", score: 11, coversTask: 2, stem: "五个算术符号里，只有 % 要求两边都必须是____。（填一个词）", accept: ["整数", "整数之间", "int", "都是整数"], why: "+ - * / 都能收小数，唯独 % 只收整数 —— 这是本课唯一的硬性类型限制。" },
        { id: "q5", type: "choice", score: 12, stem: "std::println(\"{}\", 25 / 2); 打出什么？", options: ["12.5", "12", "13", "1"], answer: 1, why: "两边都是 int，整数除法砍尾巴不四舍五入，12.5 变成 12。" },
        { id: "q6", type: "multi", score: 17, stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）", options: ["对 10 取余可以拿到一个数的个位数字", "两个整数相除，结果还是整数", "除数是 0 时会得到无穷大", "想按小数除，至少有一边得是小数"], answers: [0, 1, 3], why: "除 0 不给无穷大，那是未定义行为，程序常直接异常终止；其余三条都是本课正文的原话。" },
        { id: "q7", type: "order", score: 17, coversTask: 1, stem: "把「用程序说清 205 秒是几分几秒」的三步排成正确顺序。", answer: [0, 1, 2], steps: ["先写出 205 秒这个总数", "用 205 / 60 整除得到分钟数", "用 205 % 60 取余得到零头秒数"], why: "先有总数，再用一对搭档符号各问一半：/ 问装得下几个 60，% 问不够一个 60 的剩多少。" }
      ],
      selftest: {
        refs: [
          {q1: 1, q2: "总价 = 24\n付 100 找零 = 76\n总价里有几个 10 = 2\n不满 10 的零头 = 4", q3: 2, q4: "整数", q5: 1, q6: [0, 1, 3], q7: [0, 1, 2]}],
        wrongs: [
          {q1: 0, q2: "总价 = 24\n付 100 找零 = 76", q3: 0, q4: "小数", q5: 0, q6: [2], q7: [2, 1, 0]}],
        loose: [
          {q1: "1", q2: " 总价  =  24 \n付 100 找零 = 76 \n 总价里有几个 10 = 2\n不满 10 的零头 = 4 ", q3: "2", q4: "整数之间", q5: "1", q6: [0, 1, 3], q7: ["0", "1", "2"]}]
      }
    },
    {
      cid: "c22", kind: "paper", mode: "quiz", pass: 60, title: "第 22 课考试 · 比较运算：结果是真是假", task: "任务题目：输入 60 和 90 逐行对照比较运算的输出；输入两个相等的数，看清 == 与 != 各打出什么", hint: "回看正文【演示 1】的六行问法、【演示 2】那个不报错的等号，以及【常见坑】里连写两个比较那条。",
      questions: [
        { id: "q1", type: "choice", score: 15, coversTask: 1, stem: "int a = 60; int b = 90; 那么 a >= b 的结果是什么？", options: ["true", "false", "60", "90"], answer: 1, why: ">= 问的是「a 不小于 b 吗」，60 比 90 小，所以是 false；结果是一个 bool 值，不是数字。" },
        { id: "q2", type: "output", score: 17, coversTask: 2, stem: "输入两个相等的数（比如 88 和 88），这三行打印什么？（一行一条，按顺序写）\nstd::println(\"a > b 是 {}\", a > b);\nstd::println(\"a == b 是 {}\", a == b);\nstd::println(\"a != b 是 {}\", a != b);", acceptLines: ["a > b 是 false", "a == b 是 true", "a != b 是 false"], why: "两个数一样时：大于不成立，== 点头，!= 摇头 —— 这就是任务里要你看清的那一组对照。" },
        { id: "q3", type: "choice", score: 15, stem: "本来想写 a == 5，手滑写成 a = 5。会发生什么？", options: ["编译器报错，让你改", "不报错：把 5 装进 a，a 的值被改了", "打出 true", "a 变成 0"], answer: 1, why: "赋值本身也是个表达式、也算得出值，所以这行合法；后果是盒子的值被悄悄换掉，后面全乱。" },
        { id: "q4", type: "blank", score: 12, coversTask: 2, stem: "想问「a 和 b 一样吗」，中间该填的符号是____。（填一个符号）", accept: ["==", "等号", "两个等号"], sample: "==", why: "单个 = 是装进去，双等号才是问一句；!= 问的是不一样。" },
        { id: "q5", type: "choice", score: 12, coversTask: 2, stem: "照数学课的写法写 60 <= score <= 90，这行在 C++ 里的意思是？", options: ["score 落在 60 到 90 之间才 true", "不管 score 是多少都是 true", "不管 score 是多少都是 false", "编译不过"], answer: 1, why: "它先算 60 <= score 得一个 bool，再拿这个 bool（当成 1 或 0）去和 90 比，永远小于 90，所以恒为 true。" },
        { id: "q6", type: "multi", score: 17, stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）", options: ["60 >= 60 是 true，>= 带等号所以正好卡边界时也过线", "比较算完得到的是一个 bool 值，可以打印也可以存起来", "在 C++ 里单个 = 和 == 是同一个意思", "std::println 打 bool 会印出 true 或 false"], answers: [0, 1, 3], why: "= 是装进去、== 是问一句，差一个字符意思完全不同；其余三条都是本课正文的原话。" },
        { id: "q7", type: "order", score: 12, coversTask: 1, stem: "把「程序读一行 a == b 并打印结果」的四步排成正确顺序。", answer: [0, 1, 2, 3], steps: ["分别取出 a 和 b 现在装的值", "拿两个值比一下，看是不是一样", "把得到的 bool 填进 println 的占位坑", "屏幕上出现 true 或 false"], why: "比较式先算成值，再交给外面那句话 —— 和填一个变量名进去是同一回事。" }
      ],
      selftest: {
        refs: [
          {q1: 1, q2: "a > b 是 false\na == b 是 true\na != b 是 false", q3: 1, q4: "==", q5: 1, q6: [0, 1, 3], q7: [0, 1, 2, 3]}],
        wrongs: [
          {q1: 0, q2: "a > b 是 false\na == b 是 false", q3: 0, q4: "=", q5: 0, q6: [2], q7: [3, 2, 1, 0]}],
        loose: [
          {q1: "1", q2: "a > b 是  false\n a == b 是 true\na != b 是 false ", q3: "1", q4: "等号", q5: "1", q6: [0, 1, 3], q7: ["0", "1", "2", "3"]}]
      }
    },
    {
      cid: "c23", kind: "paper", mode: "quiz", pass: 60, title: "第 23 课考试 · 且、或、非", task: "任务题目：输入 16 和 1 自己判断三行输出再对照程序；把且改成或再跑一遍，体会两者的差别", hint: "回看正文【演示 1】的两行问法、【演示 2】感叹号管多远，以及那张短路求值走向图。",
      questions: [
        { id: "q1", type: "output", score: 18, coversTask: 1, stem: "输入的年龄是 16、有没有票填 1（有票）。这三行打印什么？（一行一条，按顺序写）\nstd::println(\"年龄够 且 有票 = {}\", age >= 18 && has_ticket);\nstd::println(\"是小孩 或 没票 = {}\", age < 18 || !has_ticket);\nstd::println(\"!has_ticket = {}\", !has_ticket);", acceptLines: ["年龄够 且 有票 = false", "是小孩 或 没票 = true", "!has_ticket = false"], why: "16 岁不够 18，且的那句左边假，整句 false；或的那句左边 age < 18 已真，直接 true；有票取反就是 false。" },
        { id: "q2", type: "choice", score: 15, coversTask: 2, stem: "还是 16 岁、有票。把第一行的 && 改成 ||，这一行的输出会怎么变？", options: ["从 false 变成 true", "从 true 变成 false", "完全不变", "编译不过了"], answer: 0, why: "或是一边真就真：age >= 18 是 false，可 has_ticket 是 true，所以整句变 true —— 这一改正好看出且与或的分界。" },
        { id: "q3", type: "choice", score: 12, stem: "bool a 是 true，bool b 是 false。下面哪个式子的结果是 true？", options: ["a && b", "!a", "a || b", "!(a || b)"], answer: 2, why: "或只要一边真；a && b 被 b 拖成真不了，!a 是 false，!(a || b) 是 false 翻面后的假。" },
        { id: "q4", type: "blank", score: 11, coversTask: 1, stem: "&& 的左边已经是 false 时，右边根本不被计算 —— 这个脾气叫____求值。（填两个字）", accept: ["短路", "短路求值", "short circuit"], why: "能提前定案就不再往下看：且看左边假、或看左边真，右边那一坨整个被跳过。" },
        { id: "q5", type: "multi", score: 17, stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）", options: ["!has_ticket 翻的只是 has_ticket 这一小块，要翻整句得给它套括号", "或 || 的意思是至少一个成立，两边都真结果还是 true", "&& 左边是 false 时，右边照样会被算一遍", "&& 的优先级比 || 高"], answers: [0, 1, 3], why: "第三条错在右边根本不被算 —— 这正是短路；其余三条都是本课正文的原话。" },
        { id: "q6", type: "choice", score: 15, stem: "式子 a || b && a 该按哪种方式算？", options: ["先算 (a || b)，再 && a", "先算 (b && a)，再和 a 或", "严格从左往右一个个算", "混用了，编译报错"], answer: 1, why: "且比或紧：|| 右边那一坨 b && a 先折成一个值，或才开始算。" },
        { id: "q7", type: "order", score: 12, coversTask: 1, stem: "把「程序算 age >= 18 && has_ticket」的走法按先后排好。", answer: [0, 1, 2, 3], steps: ["先算左边的 age >= 18", "左边是 false：整句直接 false，右边不看", "左边是 true：这才去看 has_ticket", "has_ticket 的真假就是整句的真假"], why: "且是左往右读的一句话：左边一假就收工，左边真才轮得到右边。" }
      ],
      selftest: {
        refs: [
          {q1: "年龄够 且 有票 = false\n是小孩 或 没票 = true\n!has_ticket = false", q2: 0, q3: 2, q4: "短路", q5: [0, 1, 3], q6: 1, q7: [0, 1, 2, 3]}],
        wrongs: [
          {q1: "年龄够 且 有票 = true\n是小孩 或 没票 = false\n!has_ticket = true", q2: 1, q3: 0, q4: "顺序", q5: [2], q6: 0, q7: [3, 2, 1, 0]}],
        loose: [
          {q1: "年龄够 且有票 = false\n是小孩 或 没票  =  true\n !has_ticket = false ", q2: "0", q3: "2", q4: "短路求值", q5: [0, 1, 3], q6: "1", q7: ["0", "1", "2", "3"]}]
      }
    },
    {
      cid: "c24", kind: "paper", mode: "quiz", pass: 60, title: "第 24 课考试 · 让变量自己变：++ -- += -=", task: "任务题目：给记分板加一行 score *= 2 先猜结果再运行；把 score++ 写成完整的啰嗦版赋值语句", hint: "回看正文【演示 1】的三次变动、【演示 2】累计盒和【演示 3】那个旧值新值之差。",
      questions: [
        { id: "q1", type: "output", score: 18, coversTask: 1, stem: "这四行跑完，最后一行打印什么？（写一行）\nint score = 100;\nscore++;\nscore += 10;\nscore *= 2;\nstd::println(\"score = {}\", score);", acceptLines: ["score = 222"], why: "在自己身上一步步变：100 加 1 得 101，并上 10 得 111，翻倍数 *= 2 得 222。" },
        { id: "q2", type: "choice", score: 14, coversTask: 2, stem: "关于 total += score; 和 total = total + score; 这两行，说法正确的是？", options: ["两者结果完全一样，前者只是少打一遍变量名", "前者会把 score 加两次", "后者是错的写法，编译不过", "前者不改变 total 的值"], answer: 0, why: "复合赋值就是「左边那个盒子参与运算再装回左边」的缩写，语义完全等价。" },
        { id: "q3", type: "blank", score: 13, coversTask: 1, stem: "score *= 2 展开成完整写法是 score = score ____ 2;（填一个运算符号）", accept: ["*", "乘", "乘号", "×"], why: "* 是乘法那一层的缩写版：*= 就是「自己乘上右边那个数再装回自己」。" },
        { id: "q4", type: "choice", score: 12, stem: "单独占一行时，score++ 和 ++score 的区别是什么？", options: ["没有区别，都是把 score 加 1", "前者加 1，后者加 2", "前者报错", "只有小数类型的变量才能用后者"], answer: 0, why: "交出去的那个值没人接，所以先后顺序看不出来；差别要塞进更大的表达式里才露脸。" },
        { id: "q5", type: "output", score: 15, coversTask: 2, stem: "这三行打印什么？（一行一条，按顺序写）\nint score = 10;\nstd::println(\"{}\", score++);\nstd::println(\"{}\", score);", acceptLines: ["10", "11"], why: "后置的 score++ 先交出旧值 10 给打印，然后自己才加 1；第二行读到的就是 11。" },
        { id: "q6", type: "multi", score: 17, stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）", options: ["累计用的盒子要先写成 int total = 0; 清零", "想一次加 2 可以写 score++ 2;", "-= 是在自己身上减", "在同一行里既用 score 的旧值又改 score，是不可靠的写法"], answers: [0, 2, 3], why: "第二条不行：++ 只加 1，多出来那个数编译器不认识，会报 expected ';' 之类；加 2 就写 score += 2;。" },
        { id: "q7", type: "order", score: 11, stem: "把「用 += 攒总分」的三步按先后排好。", answer: [0, 1, 2], steps: ["声明累计盒并清零：int total = 0;", "每拿到一个新分数就走一行 total += 那个分数;", "全部加完之后，再打印 total"], why: "先有清零的盒子，再一步步往里并，最后才读 —— 顺序颠倒就会读到没算完的值。" }
      ],
      selftest: {
        refs: [
          {q1: "score = 222", q2: 0, q3: "*", q4: 0, q5: "10\n11", q6: [0, 2, 3], q7: [0, 1, 2]}],
        wrongs: [
          {q1: "score = 111", q2: 1, q3: "+", q4: 1, q5: "11\n11", q6: [1], q7: [2, 1, 0]}],
        loose: [
          {q1: "score  = 222", q2: "0", q3: "乘", q4: "0", q5: " 10\n11 ", q6: [0, 2, 3], q7: ["0", "1", "2"]}]
      }
    },
    {
      cid: "c25", kind: "paper", mode: "quiz", pass: 60, title: "第 25 课考试 · 先乘除后加减", task: "任务题目：心算 5 + 2 * 3 % 4 再运行验证；用括号改写它，让加法先算", hint: "回看正文那张优先级阶梯与算式树，以及【演示 2】那个忘了括号的平均分。",
      questions: [
        { id: "q1", type: "choice", score: 12, stem: "std::println(\"{}\", 2 + 3 * 4); 打出什么？", options: ["20", "14", "9", "24"], answer: 1, why: "乘号比加号优先级高：3 * 4 先折成 12，再 2 + 12。" },
        { id: "q2", type: "output", score: 17, coversTask: [1, 2], stem: "这两行打印什么？（一行一条，按顺序写）\nstd::println(\"{}\", 5 + 2 * 3 % 4);\nstd::println(\"{}\", (5 + 2) * 3 % 4);", acceptLines: ["7", "1"], why: "第一行：乘和取余同层，从左往右 —— 2 * 3 得 6，6 % 4 得 2，最后 5 + 2 得 7。第二行括号让加法先算，7 * 3 得 21，21 % 4 余 1。" },
        { id: "q3", type: "choice", score: 12, coversTask: 1, stem: "一个式子里 * 和 % 优先级相同，C++ 规定怎么决定谁先算？", options: ["从左往右，谁在左边谁先算", "从右往左", "永远先算 %", "由编译器随机决定"], answer: 0, why: "同层之间是从左到右，所以 5 + 2 * 3 % 4 里先 2 * 3，再拿那个结果去 % 4。" },
        { id: "q4", type: "blank", score: 11, coversTask: 2, stem: "想让加法先于乘法算，唯一可靠的办法是给加法套上____。（填一个两个字的名词）", accept: ["括号", "小括号", "圆括号", "()"], why: "别指望记全整张优先级表，括号最优先这一条永远不会错，多余的括号也不额外生成代码。" },
        { id: "q5", type: "output", score: 15, stem: "这两行打印什么？（一行一条，按顺序写）\nint avg = (85 + 92 + 78) / 3;\nstd::println(\"平均分 = {}\", avg);\nint wrong = 85 + 92 + 78 / 3;\nstd::println(\"去掉括号 = {}\", wrong);", acceptLines: ["平均分 = 85", "去掉括号 = 203"], why: "带括号：255 / 3 得 85。去掉括号：除号抢先，78 / 3 得 26，再加 85 和 92 得 203 —— 编译器一个字都不说。" },
        { id: "q6", type: "multi", score: 16, stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）", options: ["100 - 20 - 5 的结果是 75", "(10 - 4) / 2 的结果是 3", "int total = 0; total += 10 + 4 * 2; 跑完 total 是 18", "赋值号的优先级比加号高，所以先算等号"], answers: [0, 1, 2], why: "赋值排在整条阶梯的最底下：先把等号右边整个算完（10 + 8 = 18），才并进 total。" },
        { id: "q7", type: "order", score: 17, coversTask: 1, stem: "把 5 + 2 * 3 % 4 折成算式树的三步按先后排好。", answer: [0, 1, 2], steps: ["先算 2 * 3，得 6", "再算 6 % 4，得 2", "最后算 5 + 2，得 7"], why: "第 2 层（乘、除、取余）先把自己旁边的数搂成包，同层里从左往右，最后才轮到加号。" }
      ],
      selftest: {
        refs: [
          {q1: 1, q2: "7\n1", q3: 0, q4: "括号", q5: "平均分 = 85\n去掉括号 = 203", q6: [0, 1, 2], q7: [0, 1, 2]}],
        wrongs: [
          {q1: 0, q2: "7\n7", q3: 1, q4: "等号", q5: "平均分 = 203\n去掉括号 = 85", q6: [3], q7: [2, 1, 0]}],
        loose: [
          {q1: "1", q2: " 7\n 1 ", q3: "0", q4: "小括号", q5: "平均分  =  85\n去掉括号 = 203 ", q6: [0, 1, 2], q7: ["0", "1", "2"]}]
      }
    },
  ]
};
