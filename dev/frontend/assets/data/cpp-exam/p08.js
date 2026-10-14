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
      cid: "c35", kind: "paper", mode: "code", authored: "69d2789d", pass: 60, title: "第 35 课考试 · for 循环：数数神器", task: "任务题目：改条件让 for 打印 10 到 15；用 for 求 1 到 100 所有偶数的和。", hint: "想不起来就回看本课【演示 1】的数数和【演示 2】的累加器。",
      questions: [
        { id: "q1", type: "code", score: 28, coversTask: 2, stem: "（任务题）写一个 for 循环，求 1 到 100 所有偶数的和，累加进已经存在的 int sum = 0;。循环变量名和步进方式自己定，但要真的只把偶数加进去。", acceptRegex: ["for\\s*\\(", "i\\s*\\+=\\s*2|i\\s*%\\s*2\\s*==\\s*0"], sample: "for (int i = 2; i <= 100; i += 2) { sum += i; }", why: "两种都对：要么起点 2、步进 i += 2 只踩偶数，要么照旧 i++ 但在循环体里用 i % 2 == 0 筛掉奇数。关键是「只有偶数进 sum」。" },
        { id: "q2", type: "code", score: 28, coversTask: 2, stem: "（任务题）接着上一题写：把累加器补完整 —— 一行在循环外面把 sum 起头成 0，一行在循环体里把 i 加进 sum。", acceptRegex: ["int\\s+sum\\s*=\\s*0", "sum\\s*(\\+=|=\\s*sum\\s*\\+)"], sample: "int sum = 0;\nfor (...) { sum += i; }", why: "累加器两段式：循环外 int sum = 0;（清零只做一次），循环内 sum += i;（或写成 sum = sum + i;）。清零写进循环体就每轮被抹掉。" },
        { id: "q3", type: "code", score: 44, coversTask: 1, stem: "（任务题）写一个 for 循环：从 10 数到 15，两头都要打出来，每轮用 std::println 把当前的数打一行。起点、终点、步进三格全部自己写。", acceptRegex: ["for\\s*\\(\\s*int\\s+\\w+\\s*=\\s*10\\s*;", ";\\s*\\w+\\s*(<=|<)\\s*(15|16)\\s*;", "println\\s*\\("], sample: "for (int i = 10; i <= 15; i++) { std::println(\"{}\", i); }", why: "起点写 10；终点要含住 15，所以是 i <= 15（写成 i < 16 也一样含）；步进每轮加一。三格顺序不能换，初始化只做一次。" }
      ],
      selftest: {
        refs: [
          {q1: "for (int i = 2; i <= 100; i += 2) { sum += i; }", q2: "int sum = 0;\nfor (...) { sum += i; }", q3: "for (int i = 10; i <= 15; i++) {\n    std::println(\"{}\", i);\n}"}],
        wrongs: [
          {q1: "for (int i = 1; i <= 100; i++) { sum += i; }", q2: "sum = 0; inside", q3: "for (int i = 1; i <= 15; i++) {\n    std::println(\"{}\", i);\n}"}],
        loose: [
          {q1: "for(int i=1;i<=100;i++){ if(i%2==0) sum+=i; }", q2: "int  sum=0 ;\n sum  +=  i ;", q3: "for(int   i=10 ;i<16 ;i ++){ std :: println ( \"{}\" , i ) ; }"}]
      }
    },
    {
      cid: "c36", kind: "paper", mode: "code", authored: "30a0247b", pass: 60, title: "第 36 课考试 · for 倒着数与跳步", task: "任务题目：写 10 秒倒计时，每行输出「还剩 n 秒」；用 i += 5 打印 0 到 100 里所有 5 的倍数。", hint: "想不起来就回看本课【演示 3】的倒计时和【演示 4】的 5 的倍数。",
      questions: [
        { id: "q1", type: "code", score: 27, coversTask: 1, stem: "（任务题）写一个完整的 for 循环做 10 秒倒计时：循环变量自己起名，每轮用 std::println 打一行「还剩 几 秒」，从 10 数到 1。", acceptRegex: ["for\\s*\\([^)]*;\\s*\\w+\\s*>=", "\\-\\-"], sample: "for (int left = 10; left >= 1; left--) { std::println(\"还剩 {} 秒\", left); }", why: "两个要点缺一不可：条件格用 >=（倒数方向的信号），步进格用 --。剩下的名字、起点、循环体内容随你写。" },
        { id: "q2", type: "code", score: 41, coversTask: 2, stem: "（任务题）写一个完整的 for 循环：从 0 起跳，每轮加 5，一直打到 100（含 100），每轮用 std::print 打一个数再加一个空格。", acceptRegex: ["for\\s*\\(", "\\+\\s*=\\s*5", "<\\s*=\\s*100\\s*;"], sample: "for (int i = 0; i <= 100; i += 5) { std::print(\"{} \", i); }", why: "起点 0、步长 5、终点写成 <= 100 才把 100 这一格也收进来；三个格子合起来决定循环踩到的正好是 0、5、10 一直到 100。" },
        { id: "q3", type: "code", score: 32, coversTask: 1, stem: "只写 for 循环那一行头，三个格子写全：循环变量从 10 开始，每轮减 1，一直走到 1（含 1）。", acceptRegex: ["for\\s*\\(", "int\\s+\\w+\\s*=\\s*10", ">\\s*=\\s*1\\s*;", "-{2}"], sample: "for (int left = 10; left >= 1; left--)", why: "步进格往回走，条件格就得问「还没到底吗」写成 >= 1；方向不配套的话循环一次都不进，而且不报错。" }
      ],
      selftest: {
        refs: [
          {q1: "for (int left = 10; left >= 1; left--) { std::println(\"还剩 {} 秒\", left); }", q2: "for (int i = 0; i <= 100; i += 5) {\n    std::print(\"{} \", i);\n}", q3: "for (int left = 10; left >= 1; left--)"}],
        wrongs: [
          {q1: "for (int i = 1; i <= 10; i++) { std::println(i); }", q2: "for (int i = 0; i < 100; i += 1) {\n    std::print(\"{} \", i);\n}", q3: "for (int left = 1; left <= 10; left--)"}],
        loose: [
          {q1: "for(int s=10;s>=1;s--){println(\"还剩 {} 秒\", s);}", q2: "for(int x=0;x<=100 ;x+=5){std::print(\"{} \", x);}", q3: "for  (  int  s = 10 ;  s  >=  1 ;  s --  )"}]
      }
    },
    {
      cid: "c37", kind: "paper", mode: "quiz", pass: 60, title: "第 37 课考试 · range-for 遍历", task: "任务题目：把自己的英文名放进 std::string，用 range-for 数一数里面有几个元音字母；遍历 hello，遇到 l 就打印「找到了」。", hint: "想不起来就回看本课【演示 1】的逐个端出来和【演示 2】的数有几个 o。",
      questions: [
        { id: "q1", type: "choice", score: 13, stem: "for (auto c : word) 里，冒号左边那半句写的是什么？", options: ["每轮接住一个元素的那个变量的声明", "要被遍历的那一串东西", "循环要跑几轮", "什么时候该停下来"], answer: 0, why: "冒号右边才是那一串东西（word）；左边是声明语句，类型交给 auto，每轮装一个元素进去。" },
        { id: "q2", type: "output", score: 18, coversTask: 1, stem: "这段代码打出什么？（一行一条，按顺序写全）\nstd::string word = \"cat\";\nfor (auto c : word) {\n    std::println(\"{}\", c);\n}", acceptLines: ["c", "a", "t"], why: "word 里有三个字符，容器自己排队递三次，所以三行；代码里没写长度也没写下标，循环跑完自己结束。" },
        { id: "q3", type: "choice", score: 16, coversTask: 1, stem: "要数「有几个元音字母」，循环体里那句判断该怎么写？（count 已经在循环外面清零）", options: ["if (c == 'a' || c == 'e') count++;", "if (c == \"a\") count++;", "count++;", "if (count == 'a') c++;"], answer: 0, why: "每轮问一句「这个字符是不是元音」，是就把计数器加一。B 用双引号是字符串，塞不进 char 比较；C 无条件加一会把所有字母都数进去；D 把两个角色颠倒了。" },
        { id: "q4", type: "blank", score: 11, stem: "for (auto c : word) 里，word 是 std::string，那么每轮接住的 c 是什么类型？（写类型名）", accept: ["char", "字符型", "char 类型"], why: "string 里每个元素都是一个字符，auto 就把 c 猜成 char —— 类型是编译器照右边抄的。" },
        { id: "q5", type: "output", score: 16, coversTask: 2, stem: "这段代码在屏幕上打出什么？（有几行就写几行）\nstd::string word = \"hello\";\nfor (auto c : word) {\n    if (c == 'l') {\n        std::println(\"找到了\");\n    }\n}", acceptLines: ["找到了", "找到了"], why: "hello 里有两个 l，遍历到那两轮各打一行，所以是两行「找到了」—— 遍历会把每一处都看到，不会只挑一个。" },
        { id: "q6", type: "multi", score: 17, stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）", options: ["range-for 每轮拿到的是副本，改它改不到容器里那份", "range-for 拿不到「第几个」，需要序号就该换三格 for", "range-for 的括号里也要写满三个格子、用分号隔开", "遍历的时候不要往被遍历的那个容器里增删元素"], answers: [0, 1, 3], why: "它是两格、中间一个冒号，不是三格；另外三条都是本课正文的结论。" },
        { id: "q7", type: "choice", score: 9, stem: "下面哪个任务最适合用 range-for 来写？", options: ["把一句话里的每个字符逐个打印出来", "打印 1 到 100", "从 10 倒数到 1 做倒计时", "数出 1 到 50 里所有整数的个数"], answer: 0, why: "「逐个处理一串现成的东西」正是 range-for 的地盘；后面三个都是在数数，用三格 for 更顺手。" }
      ],
      selftest: {
        refs: [
          {q1: 0, q2: "c\na\nt", q3: 0, q4: "char", q5: "找到了\n找到了", q6: [0, 1, 3], q7: 0}],
        wrongs: [
          {q1: 1, q2: "c\na\nt\n", q3: 2, q4: "string", q5: "找到了", q6: [2], q7: 1}],
        loose: [
          {q1: "0", q2: " c \n a \n t ", q3: "0", q4: "CHAR", q5: " 找到了 \n 找到了 ", q6: [0, 1, 3], q7: "0"}]
      }
    },
    {
      cid: "c38", kind: "paper", mode: "quiz", pass: 60, title: "第 38 课考试 · break 与 continue", task: "任务题目：把演示 1 的 break 条件改成 i == 3，说清还打印几个数；用 continue 打印 1 到 20 中所有 3 的倍数。", hint: "想不起来就回看本课【演示 1】的离场、【演示 2】的跳过偶数，和那张「跳出围栏」的图。",
      questions: [
        { id: "q1", type: "choice", score: 15, coversTask: 1, stem: "本课演示 1 里，if 条件从 i == 7 改成 i == 3。改完之后，循环体中那句 std::print(\"{} \", i); 一共被执行几次？", options: ["2 次", "3 次", "7 次", "10 次"], answer: 0, why: "i 是 1、2 时各打一个；i 到 3 时先撞进 if，打完「离场」就 break，本轮后面的 print 没轮到 —— 所以只打 2 个数。" },
        { id: "q2", type: "output", score: 16, coversTask: 1, stem: "这段代码打出什么？（一行一条）\nfor (int i = 1; i <= 5; i++) {\n    if (i == 3) break;\n    std::println(\"i = {}\", i);\n}", acceptLines: ["i = 1", "i = 2"], why: "break 让整场循环当场结束：i 为 3 那一轮还没走到 println 就跳出去了，3、4、5 全都不打。" },
        { id: "q3", type: "choice", score: 15, stem: "关于 break 和 continue，下面哪句话是对的？", options: ["break 结束整个循环，continue 只结束这一轮", "continue 结束整个循环，break 只结束这一轮", "两个效果一样，只是名字不同", "break 会直接结束整个程序，后面的代码都不跑"], answer: 0, why: "break 是「整场结束」，跳到循环后面那一行；continue 是「本轮作废」，进下一轮。程序在 break 之后照常往下走。" },
        { id: "q4", type: "output", score: 14, coversTask: 2, stem: "这段代码打出什么？（一行一条）\nfor (int i = 1; i <= 6; i++) {\n    if (i % 2 == 0) continue;\n    std::println(\"{}\", i);\n}", acceptLines: ["1", "3", "5"], why: "偶数那三轮被 continue 作废，println 没执行；奇数照常打印。步进格在 for 里跳不掉，所以循环稳稳跑到 i 为 7 才结束。" },
        { id: "q5", type: "blank", score: 12, stem: "在 for 循环里踩下 continue 之后，第三格（步进格）还会不会照常执行？（答会不会）", accept: ["会", "会执行", "照常执行", "会做", "yes"], why: "continue 跳的是循环体里剩下的语句，跳不到第三格；正因为这样 for 里用 continue 不会卡住。" },
        { id: "q6", type: "multi", score: 18, stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）", options: ["while 里放 continue，容易因为步进被跳掉而变成死循环", "break 只离开紧挨着它的那一个循环", "break 之后，循环后面那行的代码照常执行", "continue 之后，本轮剩下的循环体语句也照样做完"], answers: [0, 1, 2], why: "continue 是「本轮到此为止」，它下面的语句本轮不再执行；其余三条都是本课正文里的结论。" },
        { id: "q7", type: "choice", score: 10, coversTask: 1, stem: "要在一个单词里找第一个字母 a，找到就报一句「有了」并且后面的字母不用再看了，应该用？", options: ["break", "continue", "把条件改成 i == 0", "没法做到"], answer: 0, why: "「再找下去也没意义」正是 break 的场合；continue 只会跳过本轮，后面的字母还是会被逐个看完。" }
      ],
      selftest: {
        refs: [
          {q1: 0, q2: "i = 1\ni = 2", q3: 0, q4: "1\n3\n5", q5: "会", q6: [0, 1, 2], q7: 0}],
        wrongs: [
          {q1: 1, q2: "i = 1\ni = 2\ni = 3", q3: 1, q4: "2\n4\n6", q5: "不会", q6: [3], q7: 1}],
        loose: [
          {q1: "0", q2: " i = 1 \n i = 2 ", q3: "0", q4: "1 \n 3 \n 5", q5: "会执行", q6: [0, 1, 2], q7: "0"}]
      }
    },
  ]
};
