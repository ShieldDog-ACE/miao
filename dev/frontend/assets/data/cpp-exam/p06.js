/* 喵站 · C++ 入门 考卷分部 p06：第 26–30 课（第九轮 · 整行输入 + 分支结构）
 *
 * 每场卷照 cpp-exam/p01.js 的形状与硬指标（cpp-exam-check 逐条对账）：
 *   1. kind:"paper"，题型只用笔试引擎认的六种（choice/multi/blank/code/output/order）；
 *   2. 各题 score 相加正好 100；
 *   3. 源稿每一条【任务】都有题用 coversTask 对着它（序号从 1 起，一条题可盖多条）；
 *   4. 带 coversTask 的题合计 ≥50 分；choice ≥2；output ≥1；
 *   5. 每题带 why；selftest 的 refs 判 100、wrongs 判 <60、loose 判 ≥60。
 *
 * 守的闸线：三目 ? : 是第 31 课的东西，本分部五张卷一律不出现在读者看得见的字段里；
 *           if 只在 c27 起的卷里出现，else 从 c28 起，switch 从 c30 起。
 *
 * 验收：node dev/tools/cpp-exam-check.cjs --only c26,c27,c28,c29,c30
 */
window.MIAO_CPP_EXAM_P06 = {
  papers: [
    {
      cid: "c26", kind: "paper", mode: "quiz", pass: 60, title: "第 26 课考试 · 一行文字整段读", task: "任务题目：先输入 hello 再输入 I am a student，说清两个变量各装了什么；删掉 std::cin.ignore(); 再跑，解释第二句为什么没等你打字就结束了", hint: "想不起来就回看本课【演示 1】的勺子、【演示 3】的事故现场，还有那张缓冲区示意图。",
      questions: [
        { id: "q1", type: "choice", score: 14, coversTask: 1, stem: "程序里只有一句 std::cin >> word;（word 是 std::string）。你敲 I am a student 回车，word 里装的是什么？", options: ["I am a student", "I", "student", "空字符串"], answer: 1, why: ">> 是勺子：它只舀到下一个空白为止，碰到空格立刻停嘴，剩下的 am a student 全留在缓冲区里。" },
        { id: "q2", type: "output", score: 16, coversTask: 1, stem: "按顺序输入两行：第一行敲 hello 回车，第二行敲 I am a student 回车。这段程序打印什么？（一行一条）\nstd::cin >> word;\nstd::cin.ignore();\nstd::getline(std::cin, line);\nstd::println(\"单词 = {}\", word);\nstd::println(\"整句 = {}\", line);", acceptLines: ["单词 = hello", "整句 = I am a student"], why: ">> 拿走第一个词，ignore 擦掉残留的回车，getline 才能安心把第二行整段（空格照收）端走。" },
        { id: "q3", type: "choice", score: 14, coversTask: 2, stem: "把上面那行 std::cin.ignore(); 删掉，同样两个输入，会出现什么现象？", options: ["卡在第二句那里一直等你输入", "第二句根本不等输入，line 打出来是空的", "编译报错，要求补上 ignore", "getline 自动把残留的回车跳过，结果不变"], answer: 1, why: "getline 一个空白都不跳过。缓冲区里第一个待读字符还是上一任 >> 留下的回车，它一读就满足了结束条件，交出一个空字符串。" },
        { id: "q4", type: "blank", score: 12, coversTask: 2, stem: "上一题那个事故的根子，是 >> 用完之后在输入缓冲区里留下了一个____，被 getline 当成了一整行。（填两个字最贴切）", accept: ["回车", "换行符", "换行", "回车符", "空格回车"], why: ">> 把内容舀走、把结束那行的换行符留在原地；不擦掉它，下一个 getline 就会撞上空行。" },
        { id: "q5", type: "choice", score: 12, stem: ">> 为什么要设计成「遇空白就停」？", options: ["为了让一行里能连着读好几个数，空白当分隔符", "因为空格不能进字符串", "因为它读不了英文", "纯粹是实现上的疏忽"], answer: 0, why: "cin >> a >> b >> c; 能把三个数分开装进三个变量，靠的就是把空白当终点。这套规矩对数字是好事，对整句文本才成了坑。" },
        { id: "q6", type: "multi", score: 17, stem: "下面关于 >> 和 getline 的说法，哪些是对的？（多选，错勾任何一项整题 0 分）", options: ["getline 读到换行符为止，那个换行符不会进字符串", "getline 的第二个参数必须是 std::string", "同一次运行里 >> 之后直接 getline，通常要先 ignore", "getline 会先跳过前面所有空白再开始读"], answers: [0, 1, 2], why: "最后一条正好说反了：getline 一点空白都不跳，这是它和 >> 脾气上最大的不同，也是那起空行事故的根因。" },
        { id: "q7", type: "order", score: 15, coversTask: [1, 2], stem: "把「先读一个单词、再读一整句话」这件事的四个动作排成正确顺序。", answer: [0, 1, 2, 3], steps: ["用 >> 舀出第一个词", "缓冲区内留下一个回车没人管", "用 ignore 把那个回车擦掉", "getline 端走后面那一整行"], why: "顺序不能调：擦回车这一步必须夹在两次读之间，否则第二步留下的回车就把第三步的 getline 顶掉了。" }
      ],
      selftest: {
        refs: [
          {q1: 1, q2: "单词 = hello\n整句 = I am a student", q3: 1, q4: "回车", q5: 0, q6: [0, 1, 2], q7: [0, 1, 2, 3]}],
        wrongs: [
          {q1: 0, q2: "单词 = hello\n整句 = ", q3: 0, q4: "单词", q5: 1, q6: [1, 3], q7: [1, 0, 3, 2]}],
        loose: [
          {q1: "1", q2: "单词  =  hello\n整句 = I am a student ", q3: "1", q4: "换行符", q5: "0", q6: [0, 1, 2], q7: [0, 1, 2, 3]}]
      }
    },
    {
      cid: "c27", kind: "paper", mode: "quiz", pass: 60, title: "第 27 课考试 · 第一次 if", task: "任务题目：把 score 改成 100，说清哪几段被放行；再把 == 故意写成 =（if (score = 100)），说明编译器的警告是什么、运行后果是什么", hint: "想不起来就回看本课【演示 1】【演示 2】的放行对照，以及【演示 3】的赋值事故。",
      questions: [
        { id: "q1", type: "output", score: 19, coversTask: 1, stem: "score 是 85，这段程序打印什么？（一行一条，按顺序写）\nint score = 85;\nif (score >= 60) {\n    std::println(\"{} 分，及格，恭喜！\", score);\n}\nif (score == 100) {\n    std::println(\"满分！\");\n}\nstd::println(\"程序照常走到最后一行\");", acceptLines: ["85 分，及格，恭喜！", "程序照常走到最后一行"], why: "85 >= 60 为 true，第一段放行；85 == 100 为 false，第二段整段跳过；if 之外的最后一行照常执行。" },
        { id: "q2", type: "output", score: 17, coversTask: 1, stem: "把上面的 score 改成 100，这段程序打印什么？（一行一条，按顺序写）", acceptLines: ["100 分，及格，恭喜！", "满分！", "程序照常走到最后一行"], why: "两个条件同时为 true，两段都被放行 —— 两个 if 是两位各自站岗的门卫，互不影响。" },
        { id: "q3", type: "choice", score: 14, coversTask: 2, stem: "原意是判断满分，却写成 if (score = 100) { …… }。结果是什么？", options: ["编译报错，根本过不了", "条件永远成立，那段代码每次都执行，而且 score 已经被改成 100", "条件永远不成立，那段永远不执行", "score 保持原值，只有等于 100 时才执行"], answer: 1, why: "赋值表达式自己带值（就是被装进去的那个数），100 非 0 就一律当 true；副作用是 score 被改了，后面的运算全乱。" },
        { id: "q4", type: "blank", score: 12, coversTask: 2, stem: "写错成 if (score = 100) 时，编译器的态度是：不报错，只给一条____，提醒你把赋值当成真假值用了。（填两个字）", accept: ["警告", "warning", "告警"], why: "这条写法在 C++ 里语法合法，所以编译器只能警告不能拦死；也正因为它不报红字，很多人会把警告直接忽略 —— 那才是事故源头。" },
        { id: "q5", type: "blank", score: 12, stem: "if 的括号里放的是一张____类型的值（比较表达式天生就是它）。", accept: ["bool", "布尔", "布尔类型", "真假"], why: "第 12 课那只只有 true 和 false 的盒子，到这里就是门卫手里那张判断题的答案纸。" },
        { id: "q6", type: "choice", score: 12, stem: "if (score >= 60); { std::println(\"及格\"); } —— 右括号后面多了个分号，会怎样？", options: ["编译报错，分号不能放在这里", "不报错也不警告：条件成立时只执行那条空语句，打印变成无条件执行", "打印被彻底跳过，永远不执行", "分号被编译器自动忽略，行为和没写一样"], answer: 1, why: "if 只管紧跟的**一条语句**，而分号本身就是一条空语句；花括号于是脱离了 if 的管辖，每次都用 —— 这是本课最阴的一个坑。" },
        { id: "q7", type: "multi", score: 14, stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）", options: ["条件为 false 时，花括号那段整段被跳过，程序继续往后走", "if 后面的条件必须用括号圈起来", "省掉花括号时，if 只能管住紧跟它的一条语句", "60 <= score <= 90 是判断分数在 60 到 90 之间的正确写法"], answers: [0, 1, 2], why: "最后一条不成立：60 <= score 先算出 true（当 1），再比 1 <= 90，结果永远为真；正确的拼法是用 && 把两个条件连起来。" }
      ],
      selftest: {
        refs: [
          {q1: "85 分，及格，恭喜！\n程序照常走到最后一行", q2: "100 分，及格，恭喜！\n满分！\n程序照常走到最后一行", q3: 1, q4: "警告", q5: "bool", q6: 1, q7: [0, 1, 2]}],
        wrongs: [
          {q1: "85 分，及格，恭喜！\n满分！\n程序照常走到最后一行", q2: "100 分，及格，恭喜！", q3: 3, q4: "错误", q5: "int", q6: 0, q7: [1, 3]}],
        loose: [
          {q1: "85 分，及格，恭喜！\n 程序照常走到最后一行 ", q2: "100 分，及格，恭喜！\n满分！\n程序照常走到最后一行", q3: "1", q4: "WARNING", q5: "布尔", q6: "1", q7: [0, 1, 2]}]
      }
    },
    {
      cid: "c28", kind: "paper", mode: "quiz", pass: 60, title: "第 28 课考试 · 多岔路口 else if", task: "任务题目：把 score 依次改成 95 / 60 / 59 / 3，说出各打出什么档；再把 >=60 那个分支挪到最上面跑 85，解释为什么被打成及格", hint: "想不起来就回看本课【演示 1】后面那张逐档走位表和【演示 3】的顺序事故。",
      questions: [
        { id: "q1", type: "output", score: 19, coversTask: 1, stem: "score 是 95，这段程序打印什么？（一行一条）\nif (score >= 90) {\n    std::println(\"{} 分：优秀\", score);\n} else if (score >= 80) {\n    std::println(\"{} 分：良好\", score);\n} else if (score >= 60) {\n    std::println(\"{} 分：及格\", score);\n} else {\n    std::println(\"{} 分：不及格\", score);\n}", acceptLines: ["95 分：优秀"], why: "第一道门就成立，当场进门并终止：后面两条 else if 连条件都不计算，只打印一行。" },
        { id: "q2", type: "output", score: 17, coversTask: 1, stem: "同一段代码，score 分别改成 60、59、3，各打印什么？（一行一条，按这个顺序写三行）", acceptLines: ["60 分：及格", "59 分：不及格", "3 分：不及格"], why: "60 满足大于等于所以落在及格档；59 和 3 三档全不成立，落到 else 兜底门 —— 边界值就看那一个等号。" },
        { id: "q3", type: "choice", score: 14, coversTask: 2, stem: "把 >=60 那一条整个挪到链的最上面，score 还是 85，会发生什么？", options: ["照样打出 85 分：优秀，顺序不影响结果", "打出 85 分：及格，>=90 那一档再也走不到", "编译报错，要求从严到松排列", "三档条件全问一遍，取最严格的那个"], answer: 1, why: "85 满足 >=60，第一道就命中并终止；>=90 被前面的宽条件整个罩住，成了永远执行不到的死代码。编译器不报错，因为它语法完全正确。" },
        { id: "q4", type: "blank", score: 12, coversTask: 2, stem: "上一条里那条被前面的宽条件整个挡住、从此再也走不到的分支，行话叫____代码。（填两个字）", accept: ["死", "死代码", "不可达", "永不执行"], why: "自查办法：写完一条链从上往下问一遍「这一档成立的范围，会不会把下面某一档整个罩住」，被罩住的就是死代码。" },
        { id: "q5", type: "choice", score: 12, stem: "什么时候该用一串独立 if，而不是把它们串成 else if 链？", options: ["几条规则可以同时成立的时候", "规则条数超过三条的时候", "条件里带 && 的时候", "分数是负数的时候"], answer: 0, why: "链的语义是排他：命中一个就终止。几件事互不相干、可以一起为真，就用独立 if，否则后一件会被前一件吞掉。" },
        { id: "q6", type: "multi", score: 14, stem: "下面关于 else if 链的说法，哪些是对的？（多选，错勾任何一项整题 0 分）", options: ["第二个分支只写 score >= 80 就够了，因为能走到它就说明小于 90", "链里最多执行一段，一段都不执行也有可能", "else 后面可以写条件，写成 else (score < 60)", "命中第一个 true 之后，后面的条件不再计算"], answers: [0, 1, 3], why: "else 天生不带条件，想带条件就写 else if；其余三条都是本课「顺序替你写条件」和「命中即停」的正面结论。" },
        { id: "q7", type: "order", score: 12, stem: "把「写一条分档链」的四个动作排成合理顺序。", answer: [0, 1, 2, 3], steps: ["列出各档范围，确认它们互斥", "把最严的那一档写在最上面", "最后补一个 else 接住没人要的输入", "用边界值逐个试跑（比如 60 和 59）"], why: "顺序是逻辑的一部分：先排从严到松，再用 else 兜底，最后专挑边界值验证 —— 分档 bug 几乎全出在边界和顺序上。" }
      ],
      selftest: {
        refs: [
          {q1: "95 分：优秀", q2: "60 分：及格\n59 分：不及格\n3 分：不及格", q3: 1, q4: "死", q5: 0, q6: [0, 1, 3], q7: [0, 1, 2, 3]}],
        wrongs: [
          {q1: "95 分：优秀\n95 分：及格", q2: "60 分：良好\n59 分：及格\n3 分：不及格", q3: 0, q4: "冗余", q5: 1, q6: [1, 2], q7: [2, 0, 1, 3]}],
        loose: [
          {q1: "95 分： 优秀 ", q2: "60 分：及格 \n59 分：不及格\n 3 分：不及格", q3: "1", q4: "死代码", q5: "0", q6: [0, 1, 3], q7: [0, 1, 2, 3]}]
      }
    },
    {
      cid: "c29", kind: "paper", mode: "quiz", authored: "cba782c6", pass: 60, title: "第 29 课考试 · 套娃 if", task: "任务题目：把 age 改成 20、is_student 改成 false，分别说出输出是什么；再在「未成年学生」分支里加一道门，grade 是 'A' 时多打印一行「还是学霸」（先声明 char grade = 'A';）", hint: "想不起来就回看本课【演示 1】后面那张四行走位表，以及【演示 3】的第三道门。",
      questions: [
        { id: "q1", type: "output", score: 17, coversTask: 1, stem: "is_student 是 true、age 是 20，这段程序打印什么？（一行一条）\nif (is_student) {\n    if (age < 18) {\n        std::println(\"未成年学生\");\n    } else {\n        std::println(\"成年学生\");\n    }\n} else {\n    std::println(\"不是学生\");\n}", acceptLines: ["成年学生"], why: "第一道门放行（是学生），第二道门 20 < 18 不成立，走内层的 else —— 成年学生。" },
        { id: "q2", type: "output", score: 14, coversTask: 1, stem: "把 is_student 改成 false，age 仍是 20，同一段程序打印什么？（一行一条）", acceptLines: ["不是学生"], why: "第一道门就关了，外层 else 接手；里面那道关于年龄的门一次都没被问。" },
        { id: "q3", type: "choice", score: 15, coversTask: 1, stem: "接着上一题：is_student 为 false、age 为 16 时，下面哪种说法准确？", options: ["内层条件 age < 18 照样会算，只是结果没人用", "内层条件根本不会被计算，因为它所在的那一段被整体跳过", "两个条件同时计算，最后取更严格的那个", "编译器会直接报错，因为 age 没被使用"], answer: 1, why: "嵌套的运行事实就是这样：能被执行到内层那一行，说明外层的条件已经成立；外层关了门，内层连问都不问 —— 所以内层不必再重复写 is_student。" },
        { id: "q4", type: "blank", score: 12, stem: "C++ 编译器完全不看____，它只认花括号；所以嵌套时省花括号，代码的层次就可能和你以为的不一样。", accept: ["缩进", "缩进格式", "空格", "对齐"], why: "缩进是给人看的信号，编译器一律无视；本课的纪律是嵌套一律写花括号，让两者说的是同一句话。" },
        { id: "q5", type: "choice", score: 14, stem: "if (a) { if (b) { …… } else { …… } } 里那个 else 归谁？", options: ["归最近的、还没有配对的那个 if，也就是内层", "归最外层的 if，因为它先出现", "归同一列写的那个 if，跟缩进无关", "谁都不归，这是个语法错误"], answer: 0, why: "这就是悬挂 else：规则是 else 认领最近未配对的 if。花括号写全，认领关系就一眼可见，不用背这条规则。" },
        { id: "q6", type: "multi", score: 15, stem: "下面关于嵌套与把条件拼起来的说法，哪些是对的？（多选，错勾任何一项整题 0 分）", options: ["只要挑出同时满足两个条件的一群人，用一条带并且关系的 if 更平", "进了门还要按下一个条件走不同的路，这时嵌套更贴合", "把内层的前提在外层里再写一遍是多余的做法", "嵌套每加一层，需要验证的组合数就翻一倍"], answers: [0, 1, 3], why: "第三条说反了：内层能被执行就说明外层前提已经成立，重复写一遍前提反而容易两处对不齐；其余三条都是本课的正面结论。" },
        { id: "q7", type: "output", score: 13, coversTask: 2, stem: "is_student 为 true、age 为 16、grade 为 char 的 A，第三道门加好之后打印什么？（一行一条，按顺序两行）", acceptLines: ["未成年学生", "还是学霸"], why: "三道门一路放行：先落进未成年学生那段，再在里面命中 grade 等于 A，多打一行 —— 顺序也是输出顺序。" }
      ],
      selftest: {
        refs: [
          {q1: "成年学生", q2: "不是学生", q3: 1, q4: "缩进", q5: 0, q6: [0, 1, 3], q7: "未成年学生\n还是学霸"}],
        wrongs: [
          {q1: "未成年学生", q2: "成年学生", q3: 2, q4: "分号", q5: 1, q6: [1, 2], q7: "未成年学生"}],
        loose: [
          {q1: " 成年学生 ", q2: "不是学生 ", q3: "1", q4: "缩进格式", q5: "0", q6: [0, 1, 3], q7: "未成年学生 \n 还是学霸"}]
      }
    },
    {
      cid: "c30", kind: "paper", mode: "quiz", pass: 60, title: "第 30 课考试 · switch 点菜单", task: "任务题目：把 case 2 里的 break 注释掉再运行，说清穿透现场的输出；再加一个 case 3，打印「你选了数学」", hint: "想不起来就回看本课【演示 2】的两行输出和【演示 3】的号码牌并排挂法。",
      questions: [
        { id: "q1", type: "output", score: 16, coversTask: 1, stem: "choice 是 2，这张菜单已经挂好 case 3，只是 case 2 的 break 被注释掉了。程序打印什么？（一行一条，按顺序写）\nswitch (choice) {\n    case 2:\n        std::println(\"你选了 C++\");\n        // break;\n    case 3:\n        std::println(\"你选了数学\");\n        break;\n    default:\n        std::println(\"没有这个选项\");\n        break;\n}", acceptLines: ["你选了 C++", "你选了数学"], why: "case 只是停车位置不是围栏：跳进 ② 办完没离场，就顺着滑进 ③ 继续执行，直到 ③ 的 break 才离开整块 switch。" },
        { id: "q2", type: "output", score: 14, coversTask: 2, stem: "同样这张菜单（case 2 的 break 已经补回来），choice 改成 3，打印什么？（一行一条）", acceptLines: ["你选了数学"], why: "对上报 3 就从 case 3 进场，打印一句、break 离场；default 那张兜底牌一次都没轮到。" },
        { id: "q3", type: "choice", score: 15, coversTask: 1, stem: "关于穿透（fallthrough），下面哪句话最准确？", options: ["它是编译错误，编译器会拦住", "它是设计好的机制：分支办完不写 break 就继续往下执行，直到碰到 break 或整块结束", "它只在 default 分支里会发生", "它是编译器版本不同造成的兼容问题"], answer: 1, why: "C++ 有意留这个口子，好让几张牌共用同一段代码；代价是忘写 break 不会被拦，只会多执行几行 —— 所以它同时是头号 bug 来源。" },
        { id: "q4", type: "choice", score: 12, stem: "下面哪种 switch 写法能正常编译？", options: ["switch (price) 里 price 是 double", "case 3: 这样的整数常量牌", "case score >= 90: 这样的区间", "case name: 其中 name 是一个 int 变量"], answer: 1, why: "牌面必须是编译期就能定下来的整数（或字符）常量：小数不收、区间语法错、变量也没法提前排成跳转表。要判断区间还得用第 28 课那条 else if 链。" },
        { id: "q5", type: "blank", score: 11, stem: "switch 里那张「前面所有号都对不上时才走」的兜底牌，关键字写作____。", accept: ["default", "default:", "兜底牌"], why: "default 可写可不写、位置也能放前放后；漏了它，非法输入就静悄悄地什么也不做。它自己底下同样要配 break。" },
        { id: "q6", type: "multi", score: 17, stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）", options: ["switch 是拿值去对号码牌、对上就跳进去，不是从上往下挨个问条件", "连着写 case 1: case 2: 再只配一句打印，是让两个值共用同一段代码的正经写法", "default 分支忘了 break，也可能被前面漏 break 的分支顺路执行掉", "一个 switch 里最多只能有一个 case"], answers: [0, 1, 2], why: "最后一条不成立：case 想挂几张挂几张，这正是 switch 比一长串 else if 省事的地方。" },
        { id: "q7", type: "order", score: 15, coversTask: 1, stem: "把 switch 运行时的四个动作排成正确顺序。", answer: [0, 1, 2, 3], steps: ["算出 switch 括号里的值", "拿这个值去对号码牌，找到匹配的那张", "从那张牌底下开始一行行往下执行", "遇到 break 就离开整块 switch"], why: "对号是跳进去的、不是挨个问的；进去之后执行流一路往下，break 才是唯一的离场口令（没写就穿透到下一张牌）。" }
      ],
      selftest: {
        refs: [
          {q1: "你选了 C++\n你选了数学", q2: "你选了数学", q3: 1, q4: 1, q5: "default", q6: [0, 1, 2], q7: [0, 1, 2, 3]}],
        wrongs: [
          {q1: "你选了 C++", q2: "没有这个选项", q3: 0, q4: 0, q5: "else", q6: [1, 3], q7: [1, 0, 3, 2]}],
        loose: [
          {q1: "你选了 C++ \n 你选了 数学", q2: "你选了数学 ", q3: "1", q4: "1", q5: "default:", q6: [0, 1, 2], q7: [0, 1, 2, 3]}]
      }
    },
  ]
};
