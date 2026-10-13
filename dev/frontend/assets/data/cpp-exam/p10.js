/* 喵站 · C++ 入门 考卷分部 p10：第 43–46 课（第九轮）
 *
 * 每场卷照 cpp-exam/p01.js、p04.js 的形状与硬指标（cpp-exam-check 逐条对账）：
 *   1. kind:"paper"，题型只用笔试引擎认的六种（choice/multi/blank/code/output/order）；
 *   2. 各题 score 相加正好 100；choice ≥2、output ≥1；
 *   3. 源稿每一条【任务】都有题用 coversTask 对着它（序号从 1 起，一条题可盖多条）；
 *   4. 带 coversTask 的题合计 ≥50 分；每题带 why；
 *   5. selftest 的 refs 判 100、wrongs 判 <60、loose 判 ≥60。
 *
 * 本分部三处特殊交代：
 *   · 四课都在 vector（第 40 课）之后、pair（第 46 课）之前，题面只用已学的 range-for、下标、
 *     +=、if、整数相除这些写法；c43/c44/c45 三场完全不出现 pair。
 *   · 第 44 课的 auto& 那个 & 是本章要教的东西，题面直接写；判分器对题面只查
 *     lambda/智能指针/模板/异常/线程/cout 六样，这个写法不在其列。
 *   · 第 46 课考 pair 的 first / second，取值一律走 .first、.second 的写法，
 *     不提「当场把两格拆成两个名字」那种语法（那是后面的课）。
 *
 * 验收：node dev/tools/cpp-exam-check.cjs --only c43,c44,c45,c46
 */
window.MIAO_CPP_EXAM_P10 = {
  papers: [
    {
      cid: "c43", kind: "paper", pass: 60,
      title: "第 43 课考试 · 遍历求和与平均分",
      task: "任务题目：往 vector 里装 5 个自己的分数，用 range-for 走一遍算出总分和平均分；同一趟路上顺便数一数有几个分数 ≥ 90",
      hint: "想不起来就回看本课【它被设计成什么样】的累加三件套、那张逐格累加的图，和【演示 2】【演示 3】。",
      questions: [
        { id: "q1", type: "choice", score: 10,
          coversTask: 1,
          stem: "算总分时，int total = 0; 这一句必须写在哪里？",
          options: ["for 的花括号外面，循环开始前", "for 的花括号里面，第一行", "跟在 println 的后面", "写在 return 前面就行"],
          answer: 0,
          why: "账本在循环外诞生并清零，每轮往上记。写进花括号里，每轮都会重新诞生并被抹成 0，走完只剩最后一个数 88 —— 而且编译和运行都不报错。" },
        { id: "q2", type: "code", score: 16,
          coversTask: 1,
          stem: "（任务题）循环里每一轮的分数装在 s 里。写一行：把 s 累加进账本 total。",
          acceptRegex: ["total\\s*\\+=\\s*s"],
          why: "答案形状是 total += s; —— += 是第 24 课的复合赋值，跟 total = total + s 一回事。变量名随便起，判分只看这个累加写法在不在。" },
        { id: "q3", type: "output", score: 14,
          coversTask: 1,
          stem: "这段代码打印什么？（一行一条）\nstd::vector<int> scores = {85, 92, 78, 96, 88};\nint total = 0;\nfor (auto s : scores) {\n    total += s;\n}\nstd::println(\"总分 = {}\", total);\nstd::println(\"平均 = {:.2f}\", total * 1.0 / scores.size());",
          acceptLines: ["总分 = 439", "平均 = 87.80"],
          why: "五格相加 85+92+78+96+88 = 439；乘了 1.0 就是小数除法，439 / 5 = 87.8，{:.2f} 让它补足两位显示成 87.80。" },
        { id: "q4", type: "choice", score: 12,
          coversTask: 2,
          stem: "scores 里是 85 92 78 96 88，一趟路数「有几个分数 ≥ 90」，答案是几个？",
          options: ["1 个", "2 个", "3 个", "4 个"],
          answer: 1,
          why: "够 90 的只有 92 和 96 两个。这类题靠的就是「走一遍、顺便记一笔」：循环外放第二本账本，循环里用 if 决定记不记。" },
        { id: "q5", type: "code", score: 16,
          coversTask: 2,
          stem: "（任务题）写一行：判断这一轮的分数 s 不小于 90，条件成立才执行 good++。",
          acceptRegex: ["if\\s*\\(\\s*s\\s*>=\\s*90\\s*\\)"],
          why: "答案形状是 if (s >= 90) { good++; } —— 判断用第 27 课的 if，「不小于 90」就是 >= 90，别写成 > 90（那样 90 分本身会被漏掉）。" },
        { id: "q6", type: "blank", score: 8,
          coversTask: 1,
          stem: "算平均分时把 total 乘以 1.0，目的是让这一步____，而不是把小数部分砍掉。（说意思就行）",
          accept: ["变成小数除法", "小数除法", "变成小数", "按小数算", "别截断"],
          why: "total 和 size() 都是整数，整数之间相除会砍掉小数（第 8 课那条），439 / 5 得 87。乘 1.0 把一边升级成 double，除法才走小数那条路。" },
        { id: "q7", type: "multi", score: 14,
          coversTask: [1, 2],
          stem: "下面关于「range-for 走 vector 顺便算数」的说法，哪些是对的？（多选，错勾任何一项整题 0 分）",
          options: ["同一趟路可以带好几本账本，总分、人数各记各的", "total += s 与 total = total + s 是一回事", "把 int total = 0; 写进花括号里，总分照样算得对", "两个整数相除会把小数部分砍掉"],
          answers: [0, 1, 3],
          why: "第三条正是本课最大的坑：花括号里的账本每轮清零，最后只剩最后一个元素。其余三条都是本课的原话，第三条错得很安静，所以最要记住。" },
        { id: "q8", type: "order", score: 10,
          stem: "把「走一遍 vector 算总分和平均分」的合理步骤排成正确顺序。",
          steps: ["把分数装进 vector", "循环外声明 int total = 0;", "循环里每轮 total += s", "走完用 total * 1.0 / size() 算平均"],
          answer: [0, 1, 2, 3],
          why: "顺序不能乱：没有盒子就没得走（第一步），账本在循环外才不清零（第二步），累加在循环里（第三步），除法留到最后并记得乘 1.0（第四步）。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: "total += s;", q3: "总分 = 439\n平均 = 87.80", q4: 1, q5: "if (s >= 90) {", q6: "变成小数除法", q7: [0, 1, 3], q8: [0, 1, 2, 3] }
        ],
        wrongs: [
          { q1: 1, q2: "scores += total;", q3: "总分 = 88\n平均 = 88.00", q4: 2, q5: "if (s > 90) {", q6: "让程序跑得快一点", q7: [1, 2], q8: [3, 2, 1, 0] }
        ],
        loose: [
          { q1: "0", q2: "total  +=  s ;", q3: "总分 =  439\n平均 = 87.80\n", q4: "1", q5: "if  (  s  >=  90  )", q6: "小数除法", q7: [3, 1, 0], q8: ["0", "1", "2", "3"] }
        ]
      }
    },
    {
      cid: "c44", kind: "paper", pass: 60,
      title: "第 44 课考试 · 修改元素：下标与 auto&",
      task: "任务题目：把 vector 里所有分数改成原来的 2 倍；再把循环头上 auto& 的那个 & 删掉跑一遍，看看分数加不加得动、程序会不会报提示",
      hint: "想不起来就回看本课【它被设计成什么样】那张对照表、【演示 2】的带 & 循环和【演示 3】故意删掉 & 的那一段。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          coversTask: 1,
          stem: "想把 scores 里每个分数都改成原来的 2 倍，下面哪一行真的改得动原件？",
          options: ["for (auto s : scores) { s *= 2; }", "for (auto& s : scores) { s *= 2; }", "for (auto s : scores) { scores *= 2; }", "auto& s = scores; s *= 2;"],
          answer: 1,
          why: "只有冒号左边带 & 的那个 s 才是原件本尊。第一个写法每轮改的是刚复印出来的小盒子，出了花括号就被扔掉；整只 vector 也不能当一只盒子去乘。" },
        { id: "q2", type: "code", score: 16,
          coversTask: 1,
          stem: "（任务题）写一行的循环头：走 scores 这一趟，拿到的必须是原件（能改的那种）。",
          acceptRegex: ["for\\s*\\(\\s*auto\\s*&\\s*\\w+\\s*:\\s*scores\\s*\\)"],
          why: "答案形状是 for (auto& s : scores) —— & 紧跟 auto 还是紧跟变量名、空格怎么排都不影响，编译器只认「有没有这个 &」。" },
        { id: "q3", type: "output", score: 14,
          coversTask: [1, 2],
          stem: "这段代码打印什么？（一行一条）\nstd::vector<int> scores = {85, 92, 78};\nfor (auto s : scores) {\n    s += 5;\n}\nfor (auto s : scores) {\n    std::print(\"{} \", s);\n}",
          acceptLines: ["85 92 78"],
          why: "第一个循环没有 &，改的全是复印件，原件一个没动，所以第二个循环照原样打出来。「程序跑完了、什么也没变」就是本课要认出来的那种安静失败。" },
        { id: "q4", type: "choice", score: 12,
          coversTask: 2,
          stem: "把 auto& 的 & 删掉之后重新编译运行，你会遇到什么？",
          options: ["编译通过、运行到底，值一个都没变，也不报错", "编译器当场拒绝，提示少了 &", "只有第一个元素加了 5", "vector 被清空"],
          answer: 0,
          why: "这是它阴的地方：复印件也是合法的盒子，往里加 5 完全没问题，只是没人把副本搬回原件。所以症状是「很成功地什么都没做」，只能靠打印当场核对。" },
        { id: "q5", type: "blank", score: 10,
          coversTask: 2,
          stem: "auto& 里那个 & 读作____（两个字），意思是这个名字直接接在原件身上，不再复印一份。",
          accept: ["引用", "reference"],
          why: "引用就是给已有的东西再起一个名字，写它、就是写原件。完整机理以后再讲，本课先记「有 & 摸原件，没 & 摸复印件」。" },
        { id: "q6", type: "code", score: 10,
          coversTask: 1,
          stem: "（任务题）不用 range-for，改用门牌号写：把 0 号格的分数改成 90。",
          acceptRegex: ["scores\\s*\\[\\s*0\\s*\\]\\s*=\\s*90"],
          why: "答案形状是 scores[0] = 90; —— 方括号站在等号左边就是「写」，跟站在右边「读」用的是同一个门牌号。" },
        { id: "q7", type: "multi", score: 16,
          coversTask: [1, 2],
          stem: "关于改元素，下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["只读用 auto，要改就必须 auto&", "scores[编号] 读和写用的是同一个门牌号", "只有 3 个元素的盒子写 scores[10] = 1，编译器会当场拦住", "带 & 的循环在空盒子里一轮都不执行"],
          answers: [0, 1, 3],
          why: "第三条错得最危险：越界写不报「超出范围」那种好话，而是直接往盒子外面写内存，可能崩、可能改坏别的变量、也可能表面正常。第四条是真的 —— 空的嘛，走完零轮。" },
        { id: "q8", type: "order", score: 10,
          stem: "把「给全员改值并确认改成功了」的合理步骤排成正确顺序。",
          steps: ["先打印一次，看清出生值", "写 for (auto& s : scores) 的循环去改", "改完再打印一次", "对照两次输出，确认值真的变了"],
          answer: [0, 1, 2, 3],
          why: "本课这类改动失败时和成功时看起来一样，所以「改前打一次、改后打一次、两个对照」是唯一靠得住的自查流程。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: "for (auto& s : scores) {", q3: "85 92 78", q4: 0, q5: "引用", q6: "scores[0] = 90;", q7: [0, 1, 3], q8: [0, 1, 2, 3] }
        ],
        wrongs: [
          { q1: 0, q2: "for (auto s : scores) {", q3: "90 97 83", q4: 1, q5: "指针", q6: "scores[90] = 0;", q7: [2], q8: [2, 0, 3, 1] }
        ],
        loose: [
          { q1: "1", q2: "for  (  auto  &  s  :  scores  )", q3: "85  92  78", q4: "0", q5: "reference", q6: "scores [ 0 ]  =  90 ;", q7: [1, 0, 3], q8: ["0", "1", "2", "3"] }
        ]
      }
    },
    {
      cid: "c45", kind: "paper", pass: 60,
      title: "第 45 课考试 · 清空与判空",
      task: "任务题目：把一只装着 1 2 3 的盒子 clear() 倒空，再 push_back(7) 看它能不能复活；另外从一只空盒子出发，用循环把 1 到 5 装进去，最后遍历打印",
      hint: "想不起来就回看本课【演示 1】的清空前后两行、【演示 2】的复活那一段和【演示 3】的循环装盒子。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          coversTask: 1,
          stem: "std::vector<int> temp = {1, 2, 3}; 先 temp.clear(); 再 temp.push_back(7);，结果是？",
          options: ["剩 1 个，0 号格是 7", "剩 4 个，7 排在 3 后面", "还是 3 个，7 顶替了 1", "编译报错：倒空的盒子不能再用"],
          answer: 0,
          why: "倒空不等于报废：盒子还在、还能装，但编号从 0 重新发，它不记得自己曾经有过三个数。所以第一次 push_back 装的是 0 号格。" },
        { id: "q2", type: "output", score: 14,
          coversTask: 1,
          stem: "这段代码打印什么？（一行一条）\nstd::vector<int> temp = {1, 2, 3};\nstd::println(\"清空前空吗？{}\", temp.empty());\ntemp.clear();\nstd::println(\"清空后空吗？{}，剩 {} 个\", temp.empty(), temp.size());",
          acceptLines: ["清空前空吗？false", "清空后空吗？true，剩 0 个"],
          why: "empty() 打出来是 true / false 这种真假字，不是 1 / 0；倒空之后 empty() 变 true，size() 同时归 0，两个说法必须一起成立。" },
        { id: "q3", type: "code", score: 14,
          coversTask: 2,
          stem: "（任务题）写一行：把计数变量 i 当前那个值装到盒子 box 的尾部。",
          acceptRegex: ["push_back\\s*\\(\\s*i\\s*\\)"],
          why: "答案形状是 box.push_back(i); —— 往尾部添一个，编号自动往后排，不需要自己算现在有几格。" },
        { id: "q4", type: "choice", score: 12,
          stem: "关于 temp.empty()，下面说法正确的是？",
          options: ["它回答真假：盒子空的时候给 true", "它回答整数：空的时候给 0", "它回答还有几个元素", "它什么都不回，只是看一眼"],
          answer: 0,
          why: "empty() 是问句，回的是第 12 课那个 bool 盒子装的东西。要数个数问 size()，要判有没有问 empty()，两个别混着用。" },
        { id: "q5", type: "blank", score: 10,
          coversTask: [1, 2],
          stem: "clear() 倒空之后再 push_back，第一个装进去的元素站在____号格。（填一个数字）",
          accept: ["0", "零", "第0号"],
          why: "倒空后编号重新发，第一次装的就是 0 号格。这条也是任务 1 里那句「能不能复活」的真正答案：能，而且是从头开始。" },
        { id: "q6", type: "code", score: 12,
          coversTask: 2,
          stem: "（任务题）写一行的循环头：用计数循环让 i 从 1 一直取到 5（每轮都要装一个）。",
          acceptRegex: ["for\\s*\\(\\s*int\\s+i\\s*=\\s*1\\s*;\\s*i\\s*<=\\s*5"],
          why: "答案形状是 for (int i = 1; i <= 5; ++i) —— 起点写 1 是因为要装的就是 1 到 5，边界用 <= 才把 5 收进来。往空盒子里装东西得用这种计数循环，range-for 在空盒子里一轮都不跑。" },
        { id: "q7", type: "multi", score: 16,
          coversTask: [1, 2],
          stem: "下面关于 empty() 与 clear() 的说法，哪些是对的？（多选，错勾任何一项整题 0 分）",
          options: ["empty() 回答真假，size() 回答个数，两个互相印证", "clear() 之后同一只盒子还能继续 push_back", "clear() 把变量本身也删了，出了花括号就不能再用", "对空盒子取 temp[0] 编译器不会拦，后果自负"],
          answers: [0, 1, 3],
          why: "第三条是记反了：倒空只是把里面清干净，变量活得好好的，真正的「变量没了」要等它所在的花括号走完。第四条是真危险，所以要判空再取。" },
        { id: "q8", type: "order", score: 10,
          stem: "把「从空盒子出发装东西并确认成功」的合理步骤排成正确顺序。",
          steps: ["声明一只不给初值的盒子，它出生就是空的", "问一句 empty()，确认现在是 true", "用计数循环 push_back 把 1 到 5 装进去", "再问 empty() 并遍历打印，确认装到位"],
          answer: [0, 1, 2, 3],
          why: "先确认起点（true），再动手装，最后再确认终点（false 加 5 个）—— 这一头一尾两句 empty() 就是本课的自查表，中间出错一眼就能看出来。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: "清空前空吗？false\n清空后空吗？true，剩 0 个", q3: "box.push_back(i);", q4: 0, q5: "0", q6: "for (int i = 1; i <= 5; ++i) {", q7: [0, 1, 3], q8: [0, 1, 2, 3] }
        ],
        wrongs: [
          { q1: 1, q2: "清空前空吗？0\n清空后空吗？1，剩 3 个", q3: "box.push_back(1);", q4: 1, q5: "3", q6: "for (int i = 1; i <= 3; ++i) {", q7: [2], q8: [3, 1, 0, 2] }
        ],
        loose: [
          { q1: "0", q2: "清空前空吗？false\n\n清空后空吗？true，剩 0 个 ", q3: "box . push_back ( i ) ;", q4: "0", q5: "零", q6: "for  ( int  i = 1 ;  i <= 5 ;  i ++ )", q7: [3, 1, 0], q8: ["0", "1", "2", "3"] }
        ]
      }
    },
    {
      cid: "c46", kind: "paper", pass: 60,
      title: "第 46 课考试 · pair 两个值捆一起",
      task: "任务题目：用一个 pair 存下「数学 + 145」这两格并把两格都打印出来；再把第二格改成 16 重新打印，验证盒子里的值确实能换",
      hint: "想不起来就回看本课【演示 1】的 first / second、【演示 2】的「两格各按各的类型说话」和【演示 3】换值那三行，还有那张一束钥匙的图。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          coversTask: 1,
          stem: "想存「科目名 + 分数」这一对，下面哪一行声明得对？",
          options: ["std::pair<std::string, int> p = {\"数学\", 145};", "std::pair<int, std::string> p = {\"数学\", 145};", "std::pair<std::string, int> p = (\"数学\", 145);", "std::pair<std::string> p = {\"数学\"};"],
          answer: 0,
          why: "尖括号里的两个类型有顺序：第一个管第一格、第二个管第二格，必须跟花括号里给值的顺序一一对应。第二行顺序反了编译就过不去，第三行圆括号不是这套给值写法。" },
        { id: "q2", type: "code", score: 14,
          coversTask: 1,
          stem: "（任务题）第一格是科目名、第二格是分数。写一行用 std::println 把两格都打出来。",
          acceptRegex: ["\\.first[\\s\\S]{0,120}\\.second"],
          why: "答案形状是 std::println(\"{} 考了 {} 分\", subject.first, subject.second); —— 取格子的部件名只有 first 和 second 两个，两个占位坑按顺序填。" },
        { id: "q3", type: "output", score: 14,
          coversTask: 2,
          stem: "这段代码打印什么？（一行一条）\nstd::pair<std::string, int> student = {\"小明\", 15};\nstudent.second = 16;\nstd::println(\"{} {} 岁\", student.first, student.second);",
          acceptLines: ["小明 16 岁"],
          why: "第二格被换成 16，第一格纹丝不动，束也没散 —— 这就是任务 2 要验的「盒子里的值能换」。" },
        { id: "q4", type: "choice", score: 12,
          coversTask: [1, 2],
          stem: "关于 pair 的两格，下面说法正确的是？",
          options: ["格子名是定死的 first 和 second，只有这两格", "格子名可以由你自己起，写 p.score 也行", "要第三格就写 p.third", "两格的类型必须一样"],
          answer: 0,
          why: "pair 天生两格，名字写死；写 p.score 或 p.third 编译器都回你一句「没有这个名字」。两格类型可以完全不同，这正是它跟 vector 的分工。" },
        { id: "q5", type: "blank", score: 8,
          coversTask: 2,
          stem: "要取一个 pair 的第二格，写的部件名是____。（填英文那个名字）",
          accept: ["second", ".second", "pair 的第二格"],
          why: "first 是第一格、second 是第二格，两个名字配对使用；这套「加点再点部件」的写法跟 length()、size() 一脉相承。" },
        { id: "q6", type: "code", score: 16,
          coversTask: 2,
          stem: "（任务题）写一行：把 student 的第二格改成 16。",
          acceptRegex: ["\\.second\\s*=\\s*16"],
          why: "答案形状是 student.second = 16; —— 带点号、单个等号赋值，脾气跟普通变量一样。写成 == 就变成比较，什么也没改。" },
        { id: "q7", type: "multi", score: 16,
          stem: "下面关于 pair 和 vector 的说法，哪些是对的？（多选，错勾任何一项整题 0 分）",
          options: ["pair 把两个（可以不同类型）的值捆成一束，vector 装的是同一种类型的一串", "vector 的元素类型可以写成 pair，一行就是一格", "开两只平行 vector、靠同一个下标把名字和分数对上，比捆在一起更保险", "忘写头文件 utility 一样能编译通过"],
          answers: [0, 1],
          why: "第三条恰恰是 pair 要解决的问题：靠下标对上的关系只活在你脑子里，删一边漏一边就全体错位，而且不报错。第四条不行，pair 住在 utility 里，漏包会报「std 里没有叫 pair 的名字」。" },
        { id: "q8", type: "order", score: 8,
          stem: "把「用 pair 存一条记录并改掉其中一格」排成正确顺序。",
          steps: ["尖括号里按顺序写两格的类型", "花括号里按同一顺序给出两个值", "用 .first 和 .second 分别取值来打印", "要换哪格就直接给哪格赋值"],
          answer: [0, 1, 2, 3],
          why: "类型顺序和给值顺序必须对上，这是 pair 唯一会当场编译报错的地方；取值和改值都用点号，改完束不散。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: "std::println(\"{} 考了 {} 分\", subject.first, subject.second);", q3: "小明 16 岁", q4: 0, q5: "second", q6: "student.second = 16;", q7: [0, 1], q8: [0, 1, 2, 3] }
        ],
        wrongs: [
          { q1: 1, q2: "std::println(\"{}\", subject);", q3: "小明 15 岁", q4: 1, q5: "third", q6: "student.third = 16;", q7: [2, 3], q8: [2, 0, 3, 1] }
        ],
        loose: [
          { q1: "0", q2: "println ( \"{} {}\" , subject . first , subject . second ) ;", q3: "小明  16 岁", q4: "0", q5: "SECOND", q6: "student . second  =  16 ;", q7: [1, 0], q8: ["0", "1", "2", "3"] }
        ]
      }
    }
  ]
};
