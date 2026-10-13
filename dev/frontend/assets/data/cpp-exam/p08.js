/* 喵站 · C++ 入门 考卷分部 p08：第 35–38 课（第九轮）
 *
 * 源稿任务对账（cpp-exam-check 按 syllabus.json 逐条查 coversTask）：
 *   c35：1 改条件打印 10 到 15 · 2 用 for 求 1 到 100 所有偶数的和
 *   c36：1 写 10 秒倒计时 · 2 用 i += 5 打印 0 到 100 里所有 5 的倍数
 *   c37：1 换成自己的英文名数元音字母 · 2 遍历 hello 遇到 l 就打印找到了
 *   c38：1 把 break 条件改成 i == 3 · 2 用 continue 打印 1 到 20 中所有 3 的倍数
 * 硬指标：每场 6–10 题、score 合计正好 100、choice ≥2、output ≥1、任务题合计 ≥50、
 *         每题带 why；selftest 的 refs 判 100、wrongs 判不过、loose 仍过。
 */
window.MIAO_CPP_EXAM_P08 = {
  papers: [
    {
      cid: "c35", kind: "paper", pass: 60,
      title: "第 35 课考试 · for 循环：数数神器",
      task: "任务题目：改条件让 for 打印 10 到 15；用 for 求 1 到 100 所有偶数的和。",
      hint: "想不起来就回看本课【演示 1】的数数和【演示 2】的累加器。",
      questions: [
        { id: "q1", type: "choice", score: 12, coversTask: 1,
          stem: "要把循环改成「从 10 数到 15，两头都打出来」，for 的括号应该怎么写？",
          options: ["for (int i = 10; i <= 15; i++)", "for (int i = 10; i < 15; i++)", "for (int i = 1; i <= 15; i++)", "for (int i = 10; i <= 1; i++)"],
          answer: 0,
          why: "起点写 10，终点要包含 15 所以用 <=，步进每轮加一。B 少了 15，C 从 1 起多打一堆，D 条件一开始就假，一轮都不跑。" },
        { id: "q2", type: "choice", score: 8,
          stem: "for (初始化; 条件; 步进) 的三个格子里，哪一个整场只执行一次？",
          options: ["初始化", "条件", "步进", "三个都是一轮一次"],
          answer: 0,
          why: "初始化只在循环最开头做一次；条件每轮问一次，步进每轮循环体之后做一次。" },
        { id: "q3", type: "output", score: 14, coversTask: 1,
          stem: "这段代码在屏幕上打出什么？（一行一条，按顺序写全）\nfor (int i = 10; i <= 15; i++) {\n    std::println(\"{}\", i);\n}",
          acceptLines: ["10", "11", "12", "13", "14", "15"],
          why: "条件为真才进循环体：i 取 10 到 15 各打一行，共 6 行；i 变成 16 时 16 <= 15 为假，循环体不再进，所以没有 16。" },
        { id: "q4", type: "order", score: 10,
          stem: "把一个 for 循环「跑一轮」的四个动作按真实发生顺序排好。",
          steps: ["执行初始化格（只此一次）", "问一次条件，真才继续", "跑循环体", "做步进格，然后回到条件"],
          answer: [0, 1, 2, 3],
          why: "书写顺序是初始化、条件、步进，但跑法是初始化 → 条件 → 循环体 → 步进 → 回到条件；步进在循环体之后。" },
        { id: "q5", type: "code", score: 16, coversTask: 2,
          stem: "（任务题）写一个 for 循环，求 1 到 100 所有偶数的和，累加进已经存在的 int sum = 0;。循环变量名和步进方式自己定，但要真的只把偶数加进去。",
          acceptRegex: ["for\\s*\\(", "i\\s*\\+=\\s*2|i\\s*%\\s*2\\s*==\\s*0"],
          why: "两种都对：要么起点 2、步进 i += 2 只踩偶数，要么照旧 i++ 但在循环体里用 i % 2 == 0 筛掉奇数。关键是「只有偶数进 sum」。" },
        { id: "q6", type: "blank", score: 8, coversTask: 1,
          stem: "打印 10 到 15 那一题，一共要打 6 行；如果条件误写成 i < 15，就只打____行。（填一个数字）",
          accept: ["5", "五"],
          why: "< 是「到不了 15」，10 到 14 共 5 行；差的就是终点那一下 —— 数数前先定清终点要不要。" },
        { id: "q7", type: "multi", score: 16,
          stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["for 括号里声明的循环变量，出了循环就不存在了", "for 的右括号后面直接跟一个分号，等于循环体是空的", "忘写步进格会让条件永远为真，程序刷屏出不来", "循环变量在循环体里绝对不能再被打印"],
          answers: [0, 1, 2],
          why: "前三条都是本课的作用域与两个经典事故；D 说反了，循环体里照常能读 i，只是别去改它。" },
        { id: "q8", type: "code", score: 16, coversTask: 2,
          stem: "（任务题）接着上一题写：把累加器补完整 —— 一行在循环外面把 sum 起头成 0，一行在循环体里把 i 加进 sum。",
          acceptRegex: ["int\\s+sum\\s*=\\s*0", "sum\\s*(\\+=|=\\s*sum\\s*\\+)"],
          why: "累加器两段式：循环外 int sum = 0;（清零只做一次），循环内 sum += i;（或写成 sum = sum + i;）。清零写进循环体就每轮被抹掉。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: 0, q3: "10\n11\n12\n13\n14\n15", q4: [0, 1, 2, 3], q5: "for (int i = 2; i <= 100; i += 2) { sum += i; }", q6: "5", q7: [0, 1, 2], q8: "int sum = 0;\nfor (...) { sum += i; }" }
        ],
        wrongs: [
          { q1: 1, q2: 1, q3: "10\n11\n12\n13\n14\n15\n16", q4: [1, 0, 3, 2], q5: "for (int i = 1; i <= 100; i++) { sum += i; }", q6: "6", q7: [3], q8: "sum = 0; inside" }
        ],
        loose: [
          { q1: "0", q2: "0", q3: " 10 \n 11 \n 12 \n 13 \n 14 \n 15 ", q4: ["0", "1", "2", "3"], q5: "for(int i=1;i<=100;i++){ if(i%2==0) sum+=i; }", q6: "五", q7: [0, 1, 2], q8: "int  sum=0 ;\n sum  +=  i ;" }
        ]
      }
    },
    {
      cid: "c36", kind: "paper", pass: 60,
      title: "第 36 课考试 · for 倒着数与跳步",
      task: "任务题目：写 10 秒倒计时，每行输出「还剩 n 秒」；用 i += 5 打印 0 到 100 里所有 5 的倍数。",
      hint: "想不起来就回看本课【演示 3】的倒计时和【演示 4】的 5 的倍数。",
      questions: [
        { id: "q1", type: "choice", score: 12, coversTask: 1,
          stem: "要做 10 秒倒计时（从 10 打到 1），for 的括号应该怎么写？",
          options: ["for (int i = 10; i >= 1; i--)", "for (int i = 1; i <= 10; i--)", "for (int i = 10; i <= 1; i--)", "for (int i = 10; i >= 1; i++)"],
          answer: 0,
          why: "起点 10、每轮减一，条件就得问「还没到底吗」写成 >= 1。B 起点在 1 而条件是 <= 10，一上来就假，什么都不打；C 同病；D 方向和步进拧着来，死循环。" },
        { id: "q2", type: "output", score: 14, coversTask: 1,
          stem: "这段代码打出什么？（一行一条，按顺序写全）\nfor (int i = 3; i >= 1; i--) {\n    std::println(\"i = {}\", i);\n}",
          acceptLines: ["i = 3", "i = 2", "i = 1"],
          why: "倒数照样是「先问条件再进循环体」：i 取 3、2、1 各打一行，减到 0 时 0 >= 1 为假，所以没有 i = 0 那一行。" },
        { id: "q3", type: "code", score: 16, coversTask: 1,
          stem: "（任务题）写一个完整的 for 循环做 10 秒倒计时：循环变量自己起名，每轮用 std::println 打一行「还剩 几 秒」，从 10 数到 1。",
          acceptRegex: ["for\\s*\\([^)]*;\\s*\\w+\\s*>=", "\\-\\-"],
          why: "两个要点缺一不可：条件格用 >=（倒数方向的信号），步进格用 --。剩下的名字、起点、循环体内容随你写。" },
        { id: "q4", type: "blank", score: 10,
          stem: "把 i += 2 手滑写成 i =+ 2 之后，循环会变成____。（填四个字以内的后果）",
          accept: ["死循环", "一直循环", "不停循环", "卡住", "出不来"],
          why: "i =+ 2 是合法语句，意思是把 2 赋给 i；每轮 i 都被按回 2，条件永远为真 —— 而且编译器和运行时一声不吭。" },
        { id: "q5", type: "choice", score: 12, coversTask: 2,
          stem: "要打印 0 到 100 之间所有 5 的倍数（含 0 和 100），下面哪个 for 头正确？",
          options: ["for (int i = 0; i <= 100; i += 5)", "for (int i = 0; i < 100; i += 5)", "for (int i = 5; i <= 100; i += 1)", "for (int i = 1; i <= 100; i += 5)"],
          answer: 0,
          why: "起点 0（0 也是 5 的倍数），步长 5，终点 100 要包含所以用 <=。B 漏掉 100，C 步长是 1（全都打了），D 从 1 起跳打成 1 6 11。" },
        { id: "q6", type: "output", score: 12, coversTask: 2,
          stem: "这段代码打出一行，内容是什么？\nfor (int i = 1; i <= 9; i += 2) {\n    std::print(\"{} \", i);\n}\nstd::println(\"\");",
          acceptLines: ["1 3 5 7 9"],
          why: "起点 1、步长 2，落点全是奇数；i 变成 11 时条件为假退出，所以不会多出 11。std::print 不换行，五个数挤在一行。" },
        { id: "q7", type: "multi", score: 16,
          stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["条件格和步进格的方向必须配套：往下走就写 >= 那一侧", "循环会踩到哪几个数，由起点和步长一起决定", "第三格只能写 i++，写别的就不是 for 了", "倒数循环忘改条件方向，往往什么都不打且不报错"],
          answers: [0, 1, 3],
          why: "第三格是「每轮循环体之后做什么」，i--、i += 2、i *= 2 都能写；其余三条都是本课正文和演示里的原话。" },
        { id: "q8", type: "choice", score: 8, coversTask: 2,
          stem: "for (int i = 0; i <= 20; i += 5) 这个循环的循环体会跑几轮？",
          options: ["4 轮", "5 轮", "21 轮", "3 轮"],
          answer: 1,
          why: "落点是 0、5、10、15、20，共 5 个 —— 从 0 起跳也算一个，这是数个数最容易漏的那一下。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: "i = 3\ni = 2\ni = 1", q3: "for (int left = 10; left >= 1; left--) { std::println(\"还剩 {} 秒\", left); }", q4: "死循环", q5: 0, q6: "1 3 5 7 9", q7: [0, 1, 3], q8: 1 }
        ],
        wrongs: [
          { q1: 3, q2: "i = 1\ni = 2\ni = 3", q3: "for (int i = 1; i <= 10; i++) { std::println(i); }", q4: "编译报错", q5: 3, q6: "1 2 3 4 5", q7: [2], q8: 0 }
        ],
        loose: [
          { q1: "0", q2: " i = 3 \n i = 2 \n i = 1 ", q3: "for(int s=10;s>=1;s--){println(\"还剩 {} 秒\", s);}", q4: "卡住", q5: "0", q6: "1 3 5 7 9 ", q7: [0, 1, 3], q8: "1" }
        ]
      }
    },
    {
      cid: "c37", kind: "paper", pass: 60,
      title: "第 37 课考试 · range-for 遍历",
      task: "任务题目：把自己的英文名放进 std::string，用 range-for 数一数里面有几个元音字母；遍历 hello，遇到 l 就打印「找到了」。",
      hint: "想不起来就回看本课【演示 1】的逐个端出来和【演示 2】的数有几个 o。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          stem: "for (auto c : word) 里，冒号左边那半句写的是什么？",
          options: ["每轮接住一个元素的那个变量的声明", "要被遍历的那一串东西", "循环要跑几轮", "什么时候该停下来"],
          answer: 0,
          why: "冒号右边才是那一串东西（word）；左边是声明语句，类型交给 auto，每轮装一个元素进去。" },
        { id: "q2", type: "output", score: 14, coversTask: 1,
          stem: "这段代码打出什么？（一行一条，按顺序写全）\nstd::string word = \"cat\";\nfor (auto c : word) {\n    std::println(\"{}\", c);\n}",
          acceptLines: ["c", "a", "t"],
          why: "word 里有三个字符，容器自己排队递三次，所以三行；代码里没写长度也没写下标，循环跑完自己结束。" },
        { id: "q3", type: "code", score: 16, coversTask: 2,
          stem: "（任务题）word 里装着 hello。写一个 range-for，每轮拿到一个字符，如果是字母 l 就打印一行「找到了」。循环头和判断都要写出来。",
          acceptRegex: ["for\\s*\\(\\s*auto\\s+\\w+\\s*:\\s*\\w+\\s*\\)", "'l'"],
          why: "两格加一个冒号是 range-for 的身份证；判断一个字符必须用单引号 'l'。循环体里写 println 还是 print 不管，能挑出 l 就算对。" },
        { id: "q4", type: "choice", score: 12, coversTask: 1,
          stem: "要数「有几个元音字母」，循环体里那句判断该怎么写？（count 已经在循环外面清零）",
          options: ["if (c == 'a' || c == 'e') count++;", "if (c == \"a\") count++;", "count++;", "if (count == 'a') c++;"],
          answer: 0,
          why: "每轮问一句「这个字符是不是元音」，是就把计数器加一。B 用双引号是字符串，塞不进 char 比较；C 无条件加一会把所有字母都数进去；D 把两个角色颠倒了。" },
        { id: "q5", type: "blank", score: 10,
          stem: "for (auto c : word) 里，word 是 std::string，那么每轮接住的 c 是什么类型？（写类型名）",
          accept: ["char", "字符型", "char 类型"],
          why: "string 里每个元素都是一个字符，auto 就把 c 猜成 char —— 类型是编译器照右边抄的。" },
        { id: "q6", type: "output", score: 12, coversTask: 2,
          stem: "这段代码在屏幕上打出什么？（有几行就写几行）\nstd::string word = \"hello\";\nfor (auto c : word) {\n    if (c == 'l') {\n        std::println(\"找到了\");\n    }\n}",
          acceptLines: ["找到了", "找到了"],
          why: "hello 里有两个 l，遍历到那两轮各打一行，所以是两行「找到了」—— 遍历会把每一处都看到，不会只挑一个。" },
        { id: "q7", type: "multi", score: 16,
          stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["range-for 每轮拿到的是副本，改它改不到容器里那份", "range-for 拿不到「第几个」，需要序号就该换三格 for", "range-for 的括号里也要写满三个格子、用分号隔开", "遍历的时候不要往被遍历的那个容器里增删元素"],
          answers: [0, 1, 3],
          why: "它是两格、中间一个冒号，不是三格；另外三条都是本课正文的结论。" },
        { id: "q8", type: "choice", score: 8,
          stem: "下面哪个任务最适合用 range-for 来写？",
          options: ["把一句话里的每个字符逐个打印出来", "打印 1 到 100", "从 10 倒数到 1 做倒计时", "数出 1 到 50 里所有整数的个数"],
          answer: 0,
          why: "「逐个处理一串现成的东西」正是 range-for 的地盘；后面三个都是在数数，用三格 for 更顺手。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: "c\na\nt", q3: "for (auto c : word) { if (c == 'l') { std::println(\"找到了\"); } }", q4: 0, q5: "char", q6: "找到了\n找到了", q7: [0, 1, 3], q8: 0 }
        ],
        wrongs: [
          { q1: 1, q2: "c\na\nt\n", q3: "for (int i = 0; i < 5; i++) { std::println(\"{}\"); }", q4: 2, q5: "string", q6: "找到了", q7: [2], q8: 1 }
        ],
        loose: [
          { q1: "0", q2: " c \n a \n t ", q3: "for(auto x:word){ if(x=='l') println(\"找到了\"); }", q4: "0", q5: "CHAR", q6: " 找到了 \n 找到了 ", q7: [0, 1, 3], q8: "0" }
        ]
      }
    },
    {
      cid: "c38", kind: "paper", pass: 60,
      title: "第 38 课考试 · break 与 continue",
      task: "任务题目：把演示 1 的 break 条件改成 i == 3，说清还打印几个数；用 continue 打印 1 到 20 中所有 3 的倍数。",
      hint: "想不起来就回看本课【演示 1】的离场、【演示 2】的跳过偶数，和那张「跳出围栏」的图。",
      questions: [
        { id: "q1", type: "choice", score: 12, coversTask: 1,
          stem: "本课演示 1 里，if 条件从 i == 7 改成 i == 3。改完之后，循环体中那句 std::print(\"{} \", i); 一共被执行几次？",
          options: ["2 次", "3 次", "7 次", "10 次"],
          answer: 0,
          why: "i 是 1、2 时各打一个；i 到 3 时先撞进 if，打完「离场」就 break，本轮后面的 print 没轮到 —— 所以只打 2 个数。" },
        { id: "q2", type: "output", score: 14, coversTask: 1,
          stem: "这段代码打出什么？（一行一条）\nfor (int i = 1; i <= 5; i++) {\n    if (i == 3) break;\n    std::println(\"i = {}\", i);\n}",
          acceptLines: ["i = 1", "i = 2"],
          why: "break 让整场循环当场结束：i 为 3 那一轮还没走到 println 就跳出去了，3、4、5 全都不打。" },
        { id: "q3", type: "code", score: 16, coversTask: 2,
          stem: "（任务题）写一个 for 循环，用 continue 打印 1 到 20 中所有 3 的倍数。循环头、判断和打印都要写出来（打印用 println 还是 print 都行）。",
          acceptRegex: ["for\\s*\\(", "continue", "%\\s*3\\s*!=\\s*0"],
          why: "关键是把「不要的那一面」写进 continue：不是 3 的倍数（i % 3 != 0）就跳过，剩下的 3、6、9… 才会被打印。" },
        { id: "q4", type: "choice", score: 12,
          stem: "关于 break 和 continue，下面哪句话是对的？",
          options: ["break 结束整个循环，continue 只结束这一轮", "continue 结束整个循环，break 只结束这一轮", "两个效果一样，只是名字不同", "break 会直接结束整个程序，后面的代码都不跑"],
          answer: 0,
          why: "break 是「整场结束」，跳到循环后面那一行；continue 是「本轮作废」，进下一轮。程序在 break 之后照常往下走。" },
        { id: "q5", type: "output", score: 12, coversTask: 2,
          stem: "这段代码打出什么？（一行一条）\nfor (int i = 1; i <= 6; i++) {\n    if (i % 2 == 0) continue;\n    std::println(\"{}\", i);\n}",
          acceptLines: ["1", "3", "5"],
          why: "偶数那三轮被 continue 作废，println 没执行；奇数照常打印。步进格在 for 里跳不掉，所以循环稳稳跑到 i 为 7 才结束。" },
        { id: "q6", type: "blank", score: 10,
          stem: "在 for 循环里踩下 continue 之后，第三格（步进格）还会不会照常执行？（答会不会）",
          accept: ["会", "会执行", "照常执行", "会做", "yes"],
          why: "continue 跳的是循环体里剩下的语句，跳不到第三格；正因为这样 for 里用 continue 不会卡住。" },
        { id: "q7", type: "multi", score: 16,
          stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["while 里放 continue，容易因为步进被跳掉而变成死循环", "break 只离开紧挨着它的那一个循环", "break 之后，循环后面那行的代码照常执行", "continue 之后，本轮剩下的循环体语句也照样做完"],
          answers: [0, 1, 2],
          why: "continue 是「本轮到此为止」，它下面的语句本轮不再执行；其余三条都是本课正文里的结论。" },
        { id: "q8", type: "choice", score: 8, coversTask: 1,
          stem: "要在一个单词里找第一个字母 a，找到就报一句「有了」并且后面的字母不用再看了，应该用？",
          options: ["break", "continue", "把条件改成 i == 0", "没法做到"],
          answer: 0,
          why: "「再找下去也没意义」正是 break 的场合；continue 只会跳过本轮，后面的字母还是会被逐个看完。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: "i = 1\ni = 2", q3: "for (int i = 1; i <= 20; i++) { if (i % 3 != 0) continue; std::println(\"{}\", i); }", q4: 0, q5: "1\n3\n5", q6: "会", q7: [0, 1, 2], q8: 0 }
        ],
        wrongs: [
          { q1: 1, q2: "i = 1\ni = 2\ni = 3", q3: "for (int i = 1; i <= 20; i++) { if (i % 3 == 0) continue; std::println(\"{}\", i); }", q4: 1, q5: "2\n4\n6", q6: "不会", q7: [3], q8: 1 }
        ],
        loose: [
          { q1: "0", q2: " i = 1 \n i = 2 ", q3: "for(int i=1;i<=20;i++){if(i%3!=0){continue;} println(\"{}\",i);}", q4: "0", q5: "1 \n 3 \n 5", q6: "会执行", q7: [0, 1, 2], q8: "0" }
        ]
      }
    }
  ]
};
