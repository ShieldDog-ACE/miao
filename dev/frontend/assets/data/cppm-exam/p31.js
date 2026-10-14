/* 喵站 · C++ 掌握 考卷分部 p31：第 179–182 课（L6-01 动态数组四连）
 * 规矩与 cppm-exam/p01.js 黄金样板一致（结构 / coversTask 对账 / selftest / 读者可见字段），
 * 由 dev/tools/cpp-exam-check.cjs 逐条判。
 */
window.MIAO_CPPM_EXAM_P31 = {
  papers: [
    {
      cid: "m179", kind: "paper", mode: "quiz", pass: 60, title: "第 179 课考试 · 动态数组是什么", task: "任务题目：跑一遍放 8 件的观察程序，弄清容量什么时候跳、一次跳几格，并说清 size 与 capacity 各管什么", hint: "想不起来就回看本课【演示 1】的九行输出与【演示 2】的地址观察。",
      questions: [
        { id: "q1", type: "choice", score: 11, stem: "同一个 vector 里，size 和 capacity 各是什么？", options: ["size 是实际放了几件，capacity 是现在有几格", "size 是现在有几格，capacity 是实际放了几件", "两个数永远相等", "size 是格子的字节数"], answer: 0, why: "size 数放过的实格，capacity 数包括空格在内的全部格子；从放入第 3 件起两个数就分家了。" },
        { id: "q2", type: "choice", score: 11, stem: "本机实测：从空 vector 开始用 push_back 连放 3 件，容量依次怎么变？", options: ["0→1→2→4", "0→3→3→3", "0→1→2→3", "0→4→4→4"], answer: 0, why: "台阶落在放入第 1、2、3 件之后，每次翻倍；「每放一件涨一格」是错觉。" },
        { id: "q3", type: "output", score: 31, coversTask: 1, stem: "从空 vector 开始连放 10、20、30、40、50。放入 50 的那一轮，这一行打印什么？\nstd::println(\"放入 {} 后: 容量 {}，元素 {}\", 50, v.capacity(), v.size());", acceptLines: ["放入 50 后: 容量 8，元素 5"], why: "放入第 5 件时容量从 4 跳到 8，元素是 5 个——这正是第 3 件之后两数分家的延续。" },
        { id: "q4", type: "choice", score: 14, stem: "v 装了 5 件、容量 8。执行 v[5] = 99 会怎样？", options: ["没事，第 5 格是容量里现成的空格", "越界：容量够但 size 不够，没登记的格子不能住人", "编译直接报错", "自动把 size 变成 6"], answer: 1, why: "capacity 是地皮，size 是登记了几户；往 size 之外的格子下标读写是未定义行为，放东西请走 push_back。" },
        { id: "q5", type: "multi", score: 14, stem: "下面哪些说法对？（多选，错勾任何一项整题 0 分）", options: ["容量只在放不下的那一件上跳，平时只涨 size", "size 永远不超过 capacity", "每放入一件，capacity 恰好加 1", "搬家时旧盒整块归还，之前记下的盒子地址全部作废"], answers: [0, 1, 3], why: "本机实测台阶 0→1→2→4→8→16→32，翻倍跳；搬家的瞬间地址会换，旧地址作废。" },
        { id: "q6", type: "blank", score: 19, coversTask: 1, stem: "打印盒子的格子数要调用成员函数：v.____()。（填函数名，不带 v. 和括号）", accept: ["capacity"], why: "capacity 报现在有几格；size 报放了几件，别混。" }
      ],
      selftest: {
        refs: [
          {q1: 0, q2: 0, q3: "放入 50 后: 容量 8，元素 5", q4: 1, q5: [0, 1, 3], q6: "capacity"}],
        wrongs: [
          {q1: 1, q2: 2, q3: "放入 50 后: 容量 5，元素 5", q4: 0, q5: [0, 2], q6: "size"}],
        loose: [
          {q1: "0", q2: "0", q3: "放入 50 后:  容量 8，元素 5", q4: "1", q5: [0, 1, 3], q6: "capacity"}]
      }
    },
    {
      cid: "m180", kind: "paper", mode: "code", authored: "1007fdf8", pass: 60, title: "第 180 课考试 · 手写一次扩容搬家", task: "任务题目：旧盒装满 4 件时，亲手把它搬进 8 格新盒——开新盒、一件件搬、move 过户一步不少", hint: "想不起来就回看本课【演示 1】的三步代码与【演示 3】的过户下落。",
      questions: [
        { id: "q1", type: "code", score: 27, coversTask: 1, stem: "（任务题）box 是装满 4 件的旧盒。写出两行：开一个 8 格的 int 数组新盒 bigger；用 for 循环把旧盒 4 件一件件搬过去（i 从 0 到 3）。", acceptRegex: ["make_unique\\s*<\\s*int\\s*\\[\\s*\\]\\s*>\\s*\\(\\s*8\\s*\\)", "for\\s*\\(\\s*int\\s+i\\s*=\\s*0\\s*;\\s*i\\s*<\\s*4"], sample: "auto bigger = std::make_unique<int[]>(8); for (int i = 0; i < 4; ++i) bigger[i] = box[i];", why: "开盒用 make_unique，格数翻倍成 8；搬运循环 i 从 0 到 3，bigger[i] = box[i] 一件件抄。" },
        { id: "q2", type: "code", score: 23, coversTask: 1, stem: "（任务题）搬完 4 件、新盒 8 格已就位。写出过户那一行：把新盒 bigger 交给 box。", acceptRegex: ["box\\s*=\\s*std::move\\s*\\(\\s*bigger\\s*\\)"], sample: "box = std::move(bigger);", why: "box = std::move(bigger)；少了 move 就是想复印盒子，编译器当场拦下。" },
        { id: "q3", type: "code", score: 27, coversTask: 1, stem: "搬家完成、盒子已过户。写一行 for：从第 5 格（下标 4）起填到第 8 格，每格放 (i + 1) * 10。这些格子正是翻倍出来的新盒多出来的空格。", acceptRegex: ["for\\s*\\(\\s*int\\s+i\\s*=\\s*4\\s*;", "i\\s*<\\s*8\\s*;", "box\\s*\\[\\s*i\\s*\\]\\s*="], sample: "for (int i = 4; i < 8; ++i) box[i] = (i + 1) * 10;", why: "旧盒的 4 件已经占住前 4 格，扩容多出来的就是下标 4 到 7 这四格；起点写成 0 会把刚搬过来的旧件覆盖掉，终点少写一格就还留着一格没放东西。" },
        { id: "q4", type: "code", score: 23, coversTask: 1, stem: "写一行：把「过户之后 bigger 手里还剩没剩盒子」这件事打到屏幕上 —— 判的是它等于不等于那个空指针。", acceptRegex: ["bigger\\s*==\\s*nullptr", "std\\s*::\\s*println\\s*\\("], sample: "std::println(\"{}\", bigger == nullptr);", why: "move 是换手不是复印：所有权交出去以后，bigger 只剩空指针，屏幕上打出来的是 true。旧盒子的内存由 unique_ptr 自己归还，全程不用写 delete。" }
      ],
      selftest: {
        refs: [
          {q1: "auto bigger = std::make_unique<int[]>(8); for (int i = 0; i < 4; ++i) bigger[i] = box[i];", q2: "box = std::move(bigger);", q3: "for (int i = 4; i < 8; ++i) box[i] = (i + 1) * 10;", q4: "std::println(\"bigger 手里还有盒子吗: {}\", bigger == nullptr);"}],
        wrongs: [
          {q1: "auto bigger = std::make_unique<int[]>(4);", q2: "box = bigger;", q3: "for (int i = 0; i < 4; ++i) box[i] = (i + 1) * 10;", q4: "std::println(\"bigger 手里还有盒子吗: {}\", bigger != nullptr);"}],
        loose: [
          {q1: "auto bigger = std::make_unique < int[] > ( 8 ) ;  for ( int i = 0 ; i < 4 ; ++i ) bigger [ i ] = box [ i ] ;", q2: "box =std::move( bigger ) ;", q3: "for  (  int i=4  ;i  <  8  ;  ++i  )  box [ i ]  =  ( i + 1 ) * 10 ;", q4: "std  ::  println  (  \"{}\"  ,  bigger==nullptr  )  ;"}]
      }
    },
    {
      cid: "m181", kind: "paper", mode: "quiz", pass: 60, title: "第 181 课考试 · 手写迷你 vector", task: "任务题目：把 6 换成 100 再跑迷你 vector，算出「每次只扩 1 格」比 2 倍扩容多搬多少倍", hint: "想不起来就回看本课【演示 2】的对账与【演示 3】的同台实测。",
      questions: [
        { id: "q1", type: "choice", score: 15, stem: "MiniVec 的四本账各记什么？", options: ["d 记盒子在哪，n 记放了几件，cap 记有几格，moves 记累计搬运件数", "d 记放了几件，n 记有几格，cap 记盒子在哪，moves 记搬家次数", "四个都是容量", "d 记下标，n 记容量，cap 记件数，moves 没用"], answer: 0, why: "三本库存账 d/n/cap 加一本流水账 moves，push 的每条分支都在维护它们。" },
        { id: "q2", type: "choice", score: 15, stem: "push 里「没满、直接放」的判断条件是哪个？", options: ["n < cap", "n <= cap", "cap < n", "d == nullptr"], answer: 0, why: "n 是已放件数、cap 是格子数，n 小于 cap 才有下一格可放；cap 从 0 起步时第一条路走不通，自动落到搬家分支。" },
        { id: "q3", type: "output", score: 22, coversTask: 1, stem: "照源稿把 MiniVec 连放 6 件（10 到 60），这一行打印什么？\nstd::println(\"装了 {} 个，容量 {} 格，扩容累计搬运 {} 次\", v.n, v.cap, v.moves);", acceptLines: ["装了 6 个，容量 8 格，扩容累计搬运 6 次"], why: "搬家发生在第 1、3、5 件：0→2 搬 0 件、2→4 搬 2 件、4→8 搬 4 件，累计 6 件，容量停在 8。" },
        { id: "q4", type: "choice", score: 18, coversTask: 1, stem: "同一套 2 倍扩容的 MiniVec 装到 100 件，本机实测累计搬运多少件？", options: ["126", "4950", "100", "64"], answer: 0, why: "搬家发生在放第 1、3、5、9、17、33、65 件时，各搬 0、2、4、8、16、32、64 件，合计 126；4950 是「每次只加 1 格」的成绩。" },
        { id: "q5", type: "blank", score: 18, coversTask: 1, stem: "（任务题）把扩容改成每次只多买 1 格，装 100 件本机实测累计搬运 ____ 件。", accept: ["4950"], why: "0+1+2+…+99 = 4950，是 2 倍策略 126 件的约 39 倍——翻倍的省钱效果全在这道题里。" },
        { id: "q6", type: "multi", score: 12, stem: "下面哪些说法对？（多选，错勾任何一项整题 0 分）", options: ["cap 为 0 时 cap * 2 还是 0，起步格数要靠三元表达式", "搬完家忘了放新件，东西会悄悄丢", "moves 这本账记的是容量", "2 倍扩容装 100 件要搬 4950 件"], answers: [0, 1], why: "moves 记的是累计搬运件数；4950 是每次加 1 格的成绩，2 倍策略是 126。" }
      ],
      selftest: {
        refs: [
          {q1: 0, q2: 0, q3: "装了 6 个，容量 8 格，扩容累计搬运 6 次", q4: 0, q5: "4950", q6: [0, 1]}],
        wrongs: [
          {q1: 2, q2: 1, q3: "装了 6 个，容量 6 格，扩容累计搬运 6 次", q4: 1, q5: "495", q6: [0, 2]}],
        loose: [
          {q1: "0", q2: "0", q3: " 装了 6 个，容量 8 格，扩容累计搬运 6 次 ", q4: "0", q5: "4950", q6: [0, 1]}]
      }
    },
    {
      cid: "m182", kind: "paper", mode: "quiz", pass: 60, title: "第 182 课考试 · 中间插队为什么要挪人", task: "任务题目：在最开头 insert 一个数，弄清谁挪动的格子最多，并说清插在几号位要挪几件", hint: "想不起来就回看本课【演示 1】的两行输出与【演示 3】的实测账本。",
      questions: [
        { id: "q1", type: "choice", score: 11, stem: "v 装着 10 20 30 40 50，执行 v.insert(v.begin() + 1, 999)，谁要挪动？", options: ["只有 20 挪一格", "20、30、40、50 四件各右挪一格", "五件全体右挪", "没人要挪"], answer: 1, why: "插在 1 号位，右边原有 4 件全体右移一格；插队者的左边不用动。" },
        { id: "q2", type: "choice", score: 11, stem: "5 件的 vector 在最开头插入一个数（v.begin()），要挪动几件？", options: ["5 件", "4 件", "1 件", "0 件"], answer: 0, why: "插在 k 号位就挪 size 减 k 件：k 是 0，5 减 0 等于 5，全员无一幸免——本机实测作准。" },
        { id: "q3", type: "output", score: 31, coversTask: 1, stem: "照本课【演示 2】，在装着 10 20 30 40 50 的 v 最开头插入 999 后，这两行一共打印什么？\nfor (int x : v) std::print(\"{} \", x);\nstd::println(\"← 5 件全被右挪\");", acceptLines: ["999 10 20 30 40 50 ← 5 件全被右挪"], why: "999 坐进 0 号位，原 5 件全体右挪一格，队伍从 5 件变 6 件。" },
        { id: "q4", type: "choice", score: 14, stem: "v 装着 10 20 30 40 50 999，执行 v.erase(v.begin() + 1) 之后，原来在 3 号位的 40 现在在几号位？", options: ["3 号位，没变", "2 号位，全体左移补位", "4 号位，全体右移", "40 被删掉了"], answer: 1, why: "erase 删的是 1 号位的 20，右边全体左移一格补位；被删的是 999，不是 40。" },
        { id: "q5", type: "multi", score: 14, stem: "下面哪些说法对？（多选，错勾任何一项整题 0 分）", options: ["尾后插入不用挪任何一件", "erase 会把容量一起缩回去", "插在几号位就挪 size 减几件", "格子连成一片，报个号下标一步直达"], answers: [0, 2, 3], why: "本机实测 erase 后 size 回 5、容量照旧 10——人走座位不还；连续既是下标直达的因，也是中间插删要挪人的因。" },
        { id: "q6", type: "blank", score: 19, coversTask: 1, stem: "对账：5 个座位插在 2 号位，挪动件数 = 5 − ____（本机实测 3 件）。", accept: ["2"], why: "插在 k 号位就挪 size 减 k 件；2 号位右边只剩 30 40 50 三件。" }
      ],
      selftest: {
        refs: [
          {q1: 1, q2: 0, q3: "999 10 20 30 40 50 ← 5 件全被右挪", q4: 1, q5: [0, 2, 3], q6: "2"}],
        wrongs: [
          {q1: 0, q2: 1, q3: "10 999 20 30 40 50 ← 后面 4 个全被右挪", q4: 0, q5: [0, 1], q6: "3"}],
        loose: [
          {q1: "1", q2: "0", q3: "999 10 20 30 40 50  ← 5 件全被右挪", q4: "1", q5: [0, 2, 3], q6: "2"}]
      }
    },
  ]
};
