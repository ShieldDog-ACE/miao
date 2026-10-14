/* 喵站 · C++ 掌握 考卷分部 p07：第 101–104 课
 * 契约与前面几场一样：权重和 100、任务逐条 coversTask、refs 判 100 / wrongs <60 / loose 过。
 * 号段纪律：这一批只写 queue 与 stack 与 pair，题面里不出现下一课才教的容器名。
 */
window.MIAO_CPPM_EXAM_P07 = {
  papers: [
    {
      cid: "m101", kind: "paper", mode: "quiz", authored: "4909ece7", pass: 60, title: "第 101 课考试 · queue 队列", task: "任务题目：说清 queue 有没有 back、它返回谁；再用 queue 模拟银行窗口，来一个客人 push、服务完 pop，把每一步打印出来", hint: "想不起来就回看本课【演示 1 · 队首与队尾各是谁】与【演示 2 · 模拟银行窗口】。",
      questions: [
        { id: "q1", type: "choice", score: 14, stem: "queue 的规矩是下面哪一条？", options: ["从队尾进、从队首出，先来的人先办事", "从队尾进、也从队尾出，后来的人先办事", "任意位置都能插队，只要下标写对", "只能放一次，取完就作废"], answer: 0, why: "先进先出是 queue 的定义：push 在队尾，front 与 pop 在队首，中间不许碰。" },
        { id: "q2", type: "blank", score: 12, coversTask: 1, stem: "（任务题）queue 里负责回答「队尾是谁」的那个成员函数叫____，它返回最后被放进队伍的那个元素。", accept: ["back", "back()", "q.back()", "line.back()"], why: "front 管队首、back 管队尾，两边各一个只看不拿的访问器。" },
        { id: "q3", type: "output", score: 17, coversTask: 1, stem: "（任务题）下面这段打印三行，分别是什么？\nstd::queue<std::string> line;\nline.push(\"甲\"); line.push(\"乙\"); line.push(\"丙\");\nstd::println(\"{}\", line.front());\nstd::println(\"{}\", line.back());\nline.pop();\nstd::println(\"{}\", line.front());", acceptLines: ["甲", "丙", "乙"], why: "front 是最早进来的甲，back 是最后进来的丙；pop 送走队首的甲，剩下的排头变成乙。" },
        { id: "q4", type: "choice", score: 14, stem: "pop 的返回类型是 void，最贴切的解释是哪一句？", options: ["纯粹为了省事，返回值不重要", "如果 pop 要返回元素，就得先复制再删；复制中途失败会让数据既删了又没送到，所以标准库把看和删拆开", "因为 queue 不能装复杂类型", "因为 front 已经返回过了，重复返回会报错"], answer: 1, why: "这是异常安全的取舍：拿走和交付分成两步，任何一步失败都不会让元素凭空消失。" },
        { id: "q5", type: "multi", score: 20, stem: "关于 queue 的说法，哪些对？（多选，错一项整题 0 分）", options: ["每次 front 或 pop 之前先判 !q.empty()，空队伍上做这些是未定义行为", "queue 没有下标运算符，也不能用 range-for 遍历", "q 是值类型，把它赋给另一条队伍得到的是整份复制", "q.pop() 会把被送走的那个值返回给你"], answers: [0, 1, 2], why: "pop 只负责删队首，返回 void；想拿值得靠 front。" },
        { id: "q6", type: "output", score: 23, coversTask: 2, stem: "这段代码打印什么？（一行一条，按顺序写，共 7 行） ⏎ std::queue<int> hall; ⏎ for (int i = 1; i <= 5; ++i) { ⏎     hall.push(i); ⏎     std::println(\"{} 号进门，厅内 {} 人\", i, hall.size()); ⏎     if (i % 2 == 0) { ⏎         std::println(\"窗口办理 {} 号\", hall.front()); ⏎         hall.pop(); ⏎     } ⏎ }", acceptLines: ["1 号进门，厅内 1 人", "2 号进门，厅内 2 人", "窗口办理 1 号", "3 号进门，厅内 2 人", "4 号进门，厅内 3 人", "窗口办理 2 号", "5 号进门，厅内 3 人"], why: "push 进队尾、pop 走队首：每来一位先报人数，办完的永远是厅里等最久的那位 —— 2 号进门时送走 1 号，4 号进门时送走 2 号。" }
      ],
      selftest: {
        refs: [
          {q1: 0, q2: "back", q3: "甲\n丙\n乙", q4: 1, q5: [0, 1, 2], q6: "1 号进门，厅内 1 人\n2 号进门，厅内 2 人\n窗口办理 1 号\n3 号进门，厅内 2 人\n4 号进门，厅内 3 人\n窗口办理 2 号\n5 号进门，厅内 3 人"}],
        wrongs: [
          {q1: 1, q2: "top", q3: "丙\n甲\n甲", q4: 0, q5: [1, 3], q6: "1 号进门，厅内 1 人\n2 号进门，厅内 2 人\n窗口办理 2 号\n3 号进门，厅内 1 人\n4 号进门，厅内 2 人\n窗口办理 4 号\n5 号进门，厅内 2 人"}],
        loose: [
          {q1: "0", q2: "back( )", q3: " 甲 \n丙\n乙 ", q4: "1", q5: [0, 1, 2], q6: " 1 号进门，厅内 1 人 \n2 号进门，厅内 2 人\n 窗口办理 1 号\n3 号进门，厅内  2 人\n 4 号进门，厅内 3 人 \n窗口办理 2 号\n 5 号进门，厅内 3 人 "}]
      }
    },
    {
      cid: "m102", kind: "paper", mode: "quiz", authored: "a87c41d9", pass: 60, title: "第 102 课考试 · stack 栈", task: "任务题目：用栈判断括号是否匹配（左括号压栈、右括号和栈顶配对）；再用栈把十进制数转成二进制（余数依次压栈，最后一起弹出）", hint: "想不起来就回看本课【演示 1 · 括号匹配：左压右配】与【演示 3 · 十进制转二进制】。",
      questions: [
        { id: "q1", type: "choice", score: 14, stem: "top 和 pop 的分工是哪一条？", options: ["top 拿走顶上并返回它，pop 只看不拿", "top 只看不拿走（还能直接改它），pop 只负责删且返回 void", "两个都能拿走，随便用哪个", "top 看的是栈底，pop 删的是栈顶"], answer: 1, why: "跟第 101 课的 front 与 pop 一样：交出值和删掉元素拆成两步，中途不会丢东西。想「拿走并使用」得先读 top 再 pop。" },
        { id: "q2", type: "choice", score: 15, coversTask: 1, stem: "判断括号匹配为什么非用栈不可，光数左右括号各几个不够？", options: ["因为字符串太长数不过来", "因为要的不只是数量相等，还要「最后打开的那一只最先闭合」这个顺序，栈记住的正是顺序", "因为栈能顺便把括号打印出来", "数个数在语法上写不出来"], answer: 1, why: "反例就是 \"())(\"：左右各两只、数量完全相等，但顺序错了不匹配。嵌套结构天然是后进先出。" },
        { id: "q3", type: "output", score: 16, coversTask: 1, stem: "（任务题）用本课那个三种括号的 ok3 判断下面三个串，各打印「匹配」还是「不匹配」，一行一个：\n([])\n[()\n((", acceptLines: ["匹配", "不匹配", "不匹配"], why: "([]) 层层配对干净；[() 的圆括号要跟方括号配对，栈顶对不上；(( 没有右括号来配，循环结束时栈不空。" },
        { id: "q4", type: "blank", score: 9, coversTask: 2, stem: "（任务题）要让 n 等于 0 时也压进一个 0 再输出，取余数的循环得写成____循环（填一种循环的写法）。", accept: ["do-while", "do while", "dowhile", "do…while"], why: "while 的条件一次不满足就整圈跳过，0 会什么都不输出；do 先跑一遍再判条件，0 % 2 那位就压进去了。" },
        { id: "q5", type: "multi", score: 24, coversTask: 1, stem: "关于栈与本课这几段代码，哪些说法对？（多选，错一项整题 0 分）", options: ["括号匹配函数最后要 return left.empty()，否则 \"((\" 这种「没报错但没配完」的会被判成匹配", "空栈上调用 top 或 pop 是未定义行为，不会抛异常也不会返回 -1", "栈不能遍历也不能按下标取，硬要遍历得先复制一份", "把左右括号各计数再比相等，效果和栈完全一样"], answers: [0, 1, 2], why: "计数法判的是总量，判不了顺序，\"())(\" 就被它放过去了；这正是栈不可替代的地方。" },
        { id: "q6", type: "match", score: 22, coversTask: 2, stem: "把左边十进制转二进制里的写法，和它真正的效果连起来（右边顺序是打乱的）。", answer: {"bits.push(n % 2) 压进去的那一位": "是当前最低位，也就是二进制的个位", "余数先一只只压栈，最后一起弹出": "先产生的是最低位，栈帮你把它挪到最后一位去", "取余数的循环写成 while (n > 0)": "n 本来就是 0 时一圈都不跑，屏幕上什么都不打", "弹出的循环写成 while (!bits.empty())": "弹到栈空为止，最先压进去的最低位最后一个打出来"}, left: ["bits.push(n % 2) 压进去的那一位", "余数先一只只压栈，最后一起弹出", "取余数的循环写成 while (n > 0)", "弹出的循环写成 while (!bits.empty())"], right: ["先产生的是最低位，栈帮你把它挪到最后一位去", "弹到栈空为止，最先压进去的最低位最后一个打出来", "是当前最低位，也就是二进制的个位", "n 本来就是 0 时一圈都不跑，屏幕上什么都不打"], why: "除二取余是从最低位开始算的，可打印要高位在前；栈的后进先出正好把这段顺序倒回来。取余数的循环要用 do-while，因为 while 条件一次不满足就整圈跳过，n 为 0 时一位都不会输出。" }
      ],
      selftest: {
        refs: [
          {q1: 1, q2: 1, q3: "匹配\n不匹配\n不匹配", q4: "do-while", q5: [0, 1, 2], q6: {"bits.push(n % 2) 压进去的那一位": "是当前最低位，也就是二进制的个位", "余数先一只只压栈，最后一起弹出": "先产生的是最低位，栈帮你把它挪到最后一位去", "取余数的循环写成 while (n > 0)": "n 本来就是 0 时一圈都不跑，屏幕上什么都不打", "弹出的循环写成 while (!bits.empty())": "弹到栈空为止，最先压进去的最低位最后一个打出来"}}],
        wrongs: [
          {q1: 0, q2: 0, q3: "匹配\n匹配\n匹配", q4: "while", q5: [1, 3], q6: {"bits.push(n % 2) 压进去的那一位": "先产生的是最低位，栈帮你把它挪到最后一位去", "余数先一只只压栈，最后一起弹出": "n 本来就是 0 时一圈都不跑，屏幕上什么都不打", "取余数的循环写成 while (n > 0)": "弹到栈空为止，最先压进去的最低位最后一个打出来", "弹出的循环写成 while (!bits.empty())": "是当前最低位，也就是二进制的个位"}}],
        loose: [
          {q1: "1", q2: "1", q3: " 匹配 \n不匹配\n不匹配 ", q4: "DO WHILE", q5: [0, 1, 2], q6: {"0": 2, "1": 0, "2": 3, "3": 1}}]
      }
    },
    {
      cid: "m103", kind: "paper", mode: "quiz", authored: "7c820b69", pass: 60, title: "第 103 课考试 · priority_queue 优先队列", task: "任务题目：用优先队列算出重量 1 2 3 4 的四堆石头「每次合并最轻两堆」的总代价；再用优先队列维护随时可查的实时前三名", hint: "想不起来就回看本课【演示 1 · 合并石子】与【演示 2 · 实时前三名】。",
      questions: [
        { id: "q1", type: "choice", score: 13, stem: "priority_queue 和第 101 课那条 queue 最根本的差别在哪？", options: ["一个用 vector 一个用 list", "谁先出去不再看来的先后，只看谁的优先级高", "queue 能遍历，priority_queue 不能", "priority_queue 只能装整数"], answer: 1, why: "队列按到达顺序办事，优先队列按分量排队：急诊分诊、任务调度要的就是「眼下最要紧的先走」。" },
        { id: "q2", type: "choice", score: 12, stem: "想要「最小的先出来」，正确的写法是哪一条？", options: ["什么也不用改，pop 出来自然是小的", "第三个模板参数写成 greater，并补上 functional 头文件，底层容器 vector 也要明写", "把 push 改成 push_front", "第二个参数写 greater，第三个留空"], answer: 1, why: "默认是 less（大的先走）。换成 greater 才是小顶堆；greater 住在 functional 里，三个模板参数按位置不能空着。" },
        { id: "q3", type: "blank", score: 10, stem: "只写 std::priority_queue<int> 不填后两个参数时，top 给出的是这批数里最____的那一个。", accept: ["大", "最大", "最大值", "大的那个"], why: "默认大顶 —— 这是本课必须记住的一句话，写反方向要显式换规则。" },
        { id: "q4", type: "output", score: 20, coversTask: 1, stem: "（任务题）四堆重量 1 2 3 4，循环里每次打印本次合并的代价，循环结束后打印总代价，一共四行，写出来。", acceptLines: ["3", "6", "10", "19"], why: "1 加 2 得 3；桌上 3 3 4，取 3 加 3 得 6；桌上 4 6，合出 10；三段代价相加 3 加 6 加 10 等于 19。" },
        { id: "q5", type: "multi", score: 15, stem: "关于优先队列，哪些说法对？（多选，错一项整题 0 分）", options: ["堆里只有父亲不小于孩子这一条规矩，整体并不是排好序的，也不能按下标读", "pop 返回 void，想拿值要先 top", "要维护「最大的 k 个」，养一个大小为 k 的小顶堆最省事", "想知道第 3 小，必须把整个堆弹空再数"], answers: [0, 1, 2], why: "第 k 小只要在小顶堆里弹 k 减 1 次，再看一次 top，剩下的根本不用动。" },
        { id: "q6", type: "output", score: 30, coversTask: 2, stem: "这段代码打印什么？（一行） ⏎ std::priority_queue<int, std::vector<int>, std::greater<int>> top3; ⏎ for (int score : {88, 95, 72, 91, 60, 83}) { ⏎     top3.push(score); ⏎     if (top3.size() > 3) top3.pop(); ⏎ } ⏎ std::print(\"前三名从小到大弹出: \"); ⏎ while (!top3.empty()) { std::print(\"{} \", top3.top()); top3.pop(); } ⏎ std::println(\"\");", acceptLines: ["前三名从小到大弹出: 88 91 95"], why: "小顶堆只养三个格子：91 进来时垫底的 72 被挤掉，60 自己一进来就垫底被挤掉，83 同样被挤掉 —— 最后留下 88、91、95，从小到大弹出。" }
      ],
      selftest: {
        refs: [
          {q1: 1, q2: 1, q3: "最大", q4: "3\n6\n10\n19", q5: [0, 1, 2], q6: "前三名从小到大弹出: 88 91 95"}],
        wrongs: [
          {q1: 2, q2: 0, q3: "小", q4: "10\n6\n3\n19", q5: [1, 3], q6: "前三名从小到大弹出: 95 91 88"}],
        loose: [
          {q1: "1", q2: "1", q3: "大的那个", q4: " 3\n6\n10\n 19 ", q5: [0, 1, 2], q6: " 前三名从小到大弹出:  88  91  95 "}]
      }
    },
    {
      cid: "m104", kind: "paper", mode: "quiz", pass: 60, title: "第 104 课考试 · pair 与结构化绑定", task: "任务题目：给一排 pair 写出「分数降序、同分名字升序」的比较 lambda；并用结构化绑定遍历 map，把每个键和它的值打印出来", hint: "想不起来就回看本课【演示 3 · 名次要分数降序，同分按名字】那两段。",
      questions: [
        { id: "q1", type: "choice", score: 13, stem: "std::sort 不带比较规则去排一排 pair，默认按什么比？", options: ["只比 first，first 相同就随机会不会换序", "先比 first，first 相等时再比 second", "只比 second", "按两个成员地址的先后"], answer: 1, why: "pair 的比较是字典序：第一格分出胜负就停，平了才看第二格。所以想让谁优先排，就把谁摆在 first。" },
        { id: "q2", type: "choice", score: 12, stem: "已经有 std::pair<std::string, int> p; 那么 auto [a, b] = p; 之后写 a = \"x\";，p 会跟着变吗？", options: ["会，绑定就是给 p 的两格起了新名字", "不会，绑定出来的是两份复制；要能改原件得写 auto& [a, b] = p;", "不会，因为字符串本来就不能赋值", "要看 p 是不是 const 才知道"], answer: 1, why: "带等号的初始化绑定按值复制；引用版要显式写 auto&，只读遍历则用 const auto& —— 第 60 课那条引用规矩在绑定里照样成立。" },
        { id: "q3", type: "output", score: 21, coversTask: 1, stem: "（任务题）按 q3 那条规则排序后，逐行打印 name 与 score（中间一个空格），四行分别是什么？\nstd::vector<std::pair<int, std::string>> ranked = {{95, \"小红\"}, {95, \"小明\"}, {88, \"小强\"}, {72, \"小美\"}};", acceptLines: ["小明 95", "小红 95", "小强 88", "小美 72"], why: "95 有两人，平局比名字：源文件是 UTF-8，字符串按字节序比，小明的明排在小红前面；随后 88、72 依次落下。" },
        { id: "q4", type: "blank", score: 29, coversTask: 2, stem: "（任务题）字典叫 freq，类型是 std::map<std::string, int>，写出那个「一次拆成两个变量」的 for 循环头（按 const 引用读，别复制）。", acceptRegex: ["for\\s*\\(\\s*const\\s+auto\\s*&?\\s*\\[\\s*\\w+\\s*,\\s*\\w+\\s*\\]\\s*:\\s*freq"], sample: "for (const auto& [word, count] : freq)", why: "map 的每一项本来就是一张 pair：first 是键、second 是值；绑定写成两个名字，比 it->first 与 it->second 好读得多。" },
        { id: "q5", type: "blank", score: 8, stem: "结构化绑定写在 auto 后面的一对____里（填一个符号部位的中文名），方括号里的名字个数必须和 pair 的格数一致。", accept: ["方括号", "中括号", "[]"], why: "auto 加方括号才是绑定；只写 auto x = p; 会得到一个 pair，而不是两个变量。" },
        { id: "q6", type: "multi", score: 17, stem: "关于 pair 与绑定，哪些说法对？（多选，错一项整题 0 分）", options: ["绑定的名字个数对不上格数，编译器会直接拒绝", "map 的每个元素就是一张 pair，first 存键、second 存值", "auto& [a, b] = p; 里的 a 与 b 改得动 p", "想让分数优先排，就该把名字放 first、分数放 second"], answers: [0, 1, 2], why: "反了：谁优先排谁占 first。默认比较先看 first，所以分数要放前面那一格。" }
      ],
      selftest: {
        refs: [
          {q1: 1, q2: 1, q3: "小明 95\n小红 95\n小强 88\n小美 72", q4: "for (const auto& [word, count] : freq)", q5: "方括号", q6: [0, 1, 2]}],
        wrongs: [
          {q1: 0, q2: 0, q3: "小红 95\n小明 95\n小美 72\n小强 88", q4: "for (auto it = freq.begin(); it != freq.end(); ++it)", q5: "花括号", q6: [1, 3]}],
        loose: [
          {q1: "1", q2: "1", q3: "小明  95 \n小红 95\n小强 88\n 小美 72", q4: "for (const auto & [word , count] : freq)", q5: " [ ] ", q6: [0, 1, 2]}]
      }
    },
  ]
};
