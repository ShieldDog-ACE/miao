/* 喵站 · C++ 掌握 考卷分部 p31：第 179–182 课（L6-01 动态数组四连）
 * 规矩与 cppm-exam/p01.js 黄金样板一致（结构 / coversTask 对账 / selftest / 读者可见字段），
 * 由 dev/tools/cpp-exam-check.cjs 逐条判。
 */
window.MIAO_CPPM_EXAM_P31 = {
  papers: [
    {
      cid: "m179", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 179 课考试 · 动态数组是什么", task: "任务题目：跑一遍放 8 件的观察程序，弄清容量什么时候跳、一次跳几格，并说清 size 与 capacity 各管什么", hint: "想不起来就回看本课【演示 1】的九行输出与【演示 2】的地址观察。",
      notes: ["size 数放过的实格，capacity 数包括空格在内的全部格子，从放入第 3 件起两个数就分家。", "从空盒子开始连放，本机实测台阶是 0、1、2、4、8、16、32，每次翻倍，不是每放一件涨一格。", "容量够不等于住得进：装了 5 件、容量 8 时写 v[5] = 99 是越界，没登记的格子不能住人，放东西走 push_back。", "搬家那一刻旧盒整块归还，之前记下的盒子地址全部作废。", "用初始化列表一次装 8 件就只占 8 格，第 9 件挤不下才又搬一次家。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "把这份程序写成能跑的形：把打印工具箱和动态数组工具箱都搬进来（两行 #include），再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "#\\s*include\\s*<\\s*vector\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n#include <vector>\n\nint main() {\n    ...\n}", why: "std::println 在 print 里，std::vector 在 vector 里，少一行编译器就不认这个名字；没有 main 就没有入口。" },
        { id: "q2", type: "code", score: 15, stem: "写一行：先造一个空的 int 动态数组，一件也不放。", acceptRegex: ["std::vector\\s*<\\s*int\\s*>\\s+\\w+\\s*(=\\s*\\{\\s*\\})?\\s*;"], acceptOn: "code", sample: "std::vector<int> v;", why: "空盒子才有得看：刚创建时容量和元素个数都是 0，两个数还没分家。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "写一个循环，在循环体里用 push_back 一件一件往里放。", acceptRegex: ["\\bfor\\s*\\(", "\\.push_back\\s*\\("], acceptOn: "code", sample: "for (int i = 1; i <= 8; ++i) {\n    v.push_back(i * 10);\n}", why: "一件一件放才看得见涨的过程；一次塞八件就跳过了所有中间那一轮。" },
        { id: "q4", type: "code", score: 20, coversTask: 1, stem: "每放完一件打一行：同一条 std::println 里先给容量再给元素个数，两个成员函数都真调用到。", acceptRegex: ["std::println\\s*\\([^;]*\\.capacity\\s*\\(\\s*\\)[^;]*\\.size\\s*\\("], acceptOn: "code", sample: "std::println(\"放入 {} 后: 容量 {}，元素 {}\", i * 10, v.capacity(), v.size());", why: "capacity 报现在有几格，size 报实际放了几件；两个数并排打出来，哪一轮跳一眼就看出来。" },
        { id: "q5", type: "code", score: 20, stem: "再打一行盒子地址：调用 data() 拿到盒子所在地，用 const void 指针的形式打出来。", acceptRegex: ["\\.data\\s*\\(", "const\\s+void"], acceptOn: "code", sample: "std::println(\"盒子在 {}\", static_cast<const void*>(v.data()));", why: "搬家就是换了一块地皮：地址换了说明这次放入触发搬家，没换就说明格子还够。" },
        { id: "q6", type: "code", score: 15, coversTask: 1, stem: "跑完之后，在代码里用一行注释写下你看到的容量台阶（至少四个字，把跳到的那几档写出来）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 容量台阶 0 1 2 4 8，每次翻倍", why: "这一步只判你确实留了一行注释，注释内容这块编辑器判不了；台阶落在放不下的那一件上，一次翻倍。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> v;\n    for (int i = 1; i <= 8; ++i) {\n        v.push_back(i * 10);\n        std::println(\"放入 {} 后: 容量 {}，元素 {}\", i * 10, v.capacity(), v.size());\n    }\n    std::println(\"盒子在 {}\", static_cast<const void*>(v.data()));\n    // 容量台阶 0 1 2 4 8，每次翻倍\n    return 0;\n}\n"],
        wrongs: [
          "",
          "std::vector<int> v;\nv.push_back(10);\n",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> v;\n    v.push_back(10);\n    v.push_back(20);\n    std::println(\"有几件 {}\", v.size());\n    return 0;\n}\n"],
        loose: [
          "# include <print>\n# include <vector>\n\nint main ()\n{\n  std::vector<int> box ;\n  for (int k=1; k<=9; ++k) {\n    box.push_back(k);\n    std::println(\"第 {} 件: 容量 {} 元素 {}\", k, box.capacity(), box.size());\n  }\n  std::println(\"地址 {}\", static_cast<const void *>(box.data()));\n  // 看到容量在 1 2 4 8 16 上跳\n}\n"]
      }
    },
    {
      cid: "m180", kind: "paper", mode: "ide", authored: "1007fdf8", file: "main.cpp", pass: 60, title: "第 180 课考试 · 手写一次扩容搬家", task: "任务题目：旧盒装满 4 件时，亲手把它搬进 8 格新盒——开新盒、一件件搬、move 过户一步不少", hint: "想不起来就回看本课【演示 1】的三步代码与【演示 3】的过户下落。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 27, coversTask: 1, stem: "（任务题）box 是装满 4 件的旧盒。写出两行：开一个 8 格的 int 数组新盒 bigger；用 for 循环把旧盒 4 件一件件搬过去（i 从 0 到 3）。", acceptRegex: ["make_unique\\s*<\\s*int\\s*\\[\\s*\\]\\s*>\\s*\\(\\s*8\\s*\\)", "for\\s*\\(\\s*int\\s+i\\s*=\\s*0\\s*;\\s*i\\s*<\\s*4"], acceptOn: "code", sample: "auto bigger = std::make_unique<int[]>(8); for (int i = 0; i < 4; ++i) bigger[i] = box[i];", why: "开盒用 make_unique，格数翻倍成 8；搬运循环 i 从 0 到 3，bigger[i] = box[i] 一件件抄。" },
        { id: "q2", type: "code", score: 23, coversTask: 1, stem: "（任务题）搬完 4 件、新盒 8 格已就位。写出过户那一行：把新盒 bigger 交给 box。", acceptRegex: ["box\\s*=\\s*std::move\\s*\\(\\s*bigger\\s*\\)"], acceptOn: "code", sample: "box = std::move(bigger);", why: "box = std::move(bigger)；少了 move 就是想复印盒子，编译器当场拦下。" },
        { id: "q3", type: "code", score: 27, coversTask: 1, stem: "搬家完成、盒子已过户。写一行 for：从第 5 格（下标 4）起填到第 8 格，每格放 (i + 1) * 10。这些格子正是翻倍出来的新盒多出来的空格。", acceptRegex: ["for\\s*\\(\\s*int\\s+i\\s*=\\s*4\\s*;", "i\\s*<\\s*8\\s*;", "box\\s*\\[\\s*i\\s*\\]\\s*="], acceptOn: "code", sample: "for (int i = 4; i < 8; ++i) box[i] = (i + 1) * 10;", why: "旧盒的 4 件已经占住前 4 格，扩容多出来的就是下标 4 到 7 这四格；起点写成 0 会把刚搬过来的旧件覆盖掉，终点少写一格就还留着一格没放东西。" },
        { id: "q4", type: "code", score: 23, coversTask: 1, stem: "写一行：把「过户之后 bigger 手里还剩没剩盒子」这件事打到屏幕上 —— 判的是它等于不等于那个空指针。", acceptRegex: ["bigger\\s*==\\s*nullptr", "std\\s*::\\s*println\\s*\\("], acceptOn: "code", sample: "std::println(\"{}\", bigger == nullptr);", why: "move 是换手不是复印：所有权交出去以后，bigger 只剩空指针，屏幕上打出来的是 true。旧盒子的内存由 unique_ptr 自己归还，全程不用写 delete。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <memory>\nint main() {\n    auto bigger = std::make_unique<int[]>(8); for (int i = 0; i < 4; ++i) bigger[i] = box[i];\n    box = std::move(bigger);\n    for (int i = 4; i < 8; ++i) box[i] = (i + 1) * 10;\n    std::println(\"{}\", bigger == nullptr);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "auto bigger = std::make_unique<int[]>(4);",
          "box = bigger;",
          "for (int i = 0; i < 4; ++i) box[i] = (i + 1) * 10;",
          "std::println(\"bigger 手里还有盒子吗: {}\", bigger != nullptr);"],
        loose: [
          "#include <memory>\nint main() {\n    auto bigger = std::make_unique < int[] > ( 8 ) ;  for ( int i = 0 ; i < 4 ; ++i ) bigger [ i ] = box [ i ] ;\n    box =std::move( bigger ) ;\n    for  (  int i=4  ;i  <  8  ;  ++i  )  box [ i ]  =  ( i + 1 ) * 10 ;\n    std  ::  println  (  \"{}\"  ,  bigger==nullptr  )  ;\n    return 0;\n}\n"]
      }
    },
    {
      cid: "m181", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 181 课考试 · 手写迷你 vector", task: "任务题目：把 6 换成 100 再跑迷你 vector，算出「每次只扩 1 格」比 2 倍扩容多搬多少倍", hint: "想不起来就回看本课【演示 2】的对账与【演示 3】的同台实测。",
      notes: ["三本库存账 d、n、cap 加一本流水账 moves，push 的每条分支都在维护它们。", "n 是已放件数、cap 是格子数，n 小于 cap 才有下一格可放；cap 从 0 起步时第一条路走不通，自动落到搬家分支。", "2 倍扩容装到 100 件，搬家发生在放第 1、3、5、9、17、33、65 件时，各搬 0、2、4、8、16、32、64 件，合计 126 件。", "每次只多买 1 格时装 100 件累计搬运 0+1+2+…+99 = 4950 件，约是 2 倍策略的 39 倍。", "搬完家忘了把新来的那件放进去，东西会悄悄丢；moves 记的是累计搬运件数，不是容量。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "写出 struct MiniVec 的骨架：盒子 d 用 unique_ptr 管一段 int 数组，再配上 n、cap、moves 三本 int 账，都从 0 起。", acceptRegex: ["struct\\s+MiniVec", "unique_ptr\\s*<\\s*int\\s*\\[\\s*\\]\\s*>\\s+d\\s*;", "\\bint\\s+n\\s*=\\s*0", "\\bcap\\s*=\\s*0", "\\bmoves\\s*=\\s*0"], acceptOn: "code", sample: "std::unique_ptr<int[]> d;\nint n = 0, cap = 0, moves = 0;", why: "三本库存账 d、n、cap 加一本流水账 moves，push 的每条分支都在维护它们；缺哪本都算不清这笔账。" },
        { id: "q2", type: "code", score: 15, stem: "把 push 里格子没满那条路写出来：判断 n 小于 cap 就放在第 n 格、n 往后挪一格，然后直接返回。", acceptRegex: ["if\\s*\\(\\s*n\\s*<\\s*cap\\s*\\)", "d\\s*\\[\\s*n\\s*\\+\\+\\s*\\]", "\\breturn\\b"], acceptOn: "code", sample: "if (n < cap) { d[n++] = v; return; }", why: "n 是已放件数、cap 是格子数，n 小于 cap 才有下一格可放；没满就搬家是白干活。" },
        { id: "q3", type: "code", score: 15, stem: "写满了那条路：按现在容量的 2 倍造一个新盒，再把旧东西一件一件搬过去。", acceptRegex: ["make_unique\\s*<\\s*int\\s*\\[\\s*\\]\\s*>\\s*\\(", "cap\\s*\\*\\s*2", "\\w+\\s*\\[\\s*\\w+\\s*\\]\\s*=\\s*d\\s*\\[\\s*\\w+\\s*\\]"], acceptOn: "code", sample: "auto nd = std::make_unique<int[]>(cap ? cap * 2 : 2);\nfor (int i = 0; i < n; ++i) nd[i] = d[i];", why: "cap 为 0 时 cap * 2 还是 0，起步那两格要靠三元表达式给；搬家必须逐件搬，抄漏一件就丢了数据。" },
        { id: "q4", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：把连放 6 件改成连放 100 件，跑完用一条 std::println 把件数、容量、累计搬运三本账一起打出来。", acceptRegex: ["<=\\s*100\\s*;", "std::println\\s*\\([^;]*\\.moves\\s*\\)"], acceptOn: "code", sample: "for (int i = 1; i <= 100; ++i) v.push(i * 10);\nstd::println(\"装了 {} 个，容量 {} 格，搬运 {} 次\", v.n, v.cap, v.moves);", why: "装到 100 件才看得见策略的差距：2 倍扩容这时累计搬运 126 件，容量停在 128 格。" },
        { id: "q5", type: "code", score: 20, coversTask: 1, stem: "把坏版本也写成能跑的形：新盒长度只比现在多 1 格，cap 也按多买 1 格来记，其余照旧。", acceptRegex: ["make_unique\\s*<\\s*int\\s*\\[\\s*\\]\\s*>\\s*\\(\\s*cap\\s*\\+\\s*1\\s*\\)", "cap\\s*=\\s*cap\\s*\\+\\s*1"], acceptOn: "code", sample: "auto nd = std::make_unique<int[]>(cap + 1);\nmoves += n; d = std::move(nd); cap = cap + 1;", why: "只多买 1 格就意味着每放一件都要搬一次家，这份代码就是让账本自己说出来差多少。" },
        { id: "q6", type: "code", score: 15, coversTask: 1, stem: "两版各跑到 100 件之后，在旁边用一行注释写下你看到的搬运件数和大概倍数（至少四个字）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 坏版本搬 4950 件，2 倍版本搬 126 件，差约 39 倍", why: "这一步只判你确实留了一行注释，注释里写的倍数这块编辑器判不了；本机实测是 4950 对 126。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <memory>\n#include <utility>\n\nstruct MiniVec {\n    std::unique_ptr<int[]> d;\n    int n = 0, cap = 0, moves = 0;\n    void push(int v) {\n        if (n < cap) { d[n++] = v; return; }\n        auto nd = std::make_unique<int[]>(cap ? cap * 2 : 2);\n        for (int i = 0; i < n; ++i) nd[i] = d[i];\n        moves += n; d = std::move(nd); cap = cap ? cap * 2 : 2;\n        d[n++] = v;\n    }\n};\n\nstruct SlowVec {\n    std::unique_ptr<int[]> d;\n    int n = 0, cap = 0, moves = 0;\n    void push(int v) {\n        if (n < cap) { d[n++] = v; return; }\n        auto nd = std::make_unique<int[]>(cap + 1);\n        for (int i = 0; i < n; ++i) nd[i] = d[i];\n        moves += n; d = std::move(nd); cap = cap + 1;\n        d[n++] = v;\n    }\n};\n\nint main() {\n    MiniVec v;\n    SlowVec s;\n    for (int i = 1; i <= 100; ++i) {\n        v.push(i * 10);\n        s.push(i * 10);\n    }\n    std::println(\"装了 {} 个，容量 {} 格，累计搬运 {} 次\", v.n, v.cap, v.moves);\n    std::println(\"坏版本装了 {} 个，容量 {} 格，累计搬运 {} 次\", s.n, s.cap, s.moves);\n    // 坏版本搬 4950 件，2 倍版本搬 126 件，差约 39 倍\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\nstruct MiniVec {\n    int n = 0, cap = 0, moves = 0;\n};\nint main() { std::println(\"{}\", 1); return 0; }\n",
          "#include <print>\n#include <memory>\n#include <utility>\n\nstruct MiniVec {\n    std::unique_ptr<int[]> d;\n    int n = 0, cap = 0, moves = 0;\n    void push(int v) {\n        if (n < cap) { d[n++] = v; return; }\n    }\n};\n\nint main() {\n    MiniVec v;\n    for (int i = 1; i <= 6; ++i) v.push(i);\n    std::println(\"{}\", v.n);\n    return 0;\n}\n"],
        loose: [
          "# include <print>\n# include <memory>\n# include <utility>\n\nstruct MiniVec\n{\n  std::unique_ptr<int [ ] > d;\n  int n = 0; int cap = 0; int moves = 0;\n  void push ( int v )\n  {\n    if ( n < cap ) { d[n ++] = v; return; }\n    auto fresh = std::make_unique<int[]>(cap ? cap*2 : 2);\n    for (int k = 0; k < n; ++k) fresh[k] = d[k];\n    moves += n; d = std::move(fresh); cap = cap ? 2*cap : 2;\n    d[n++] = v;\n  }\n};\n\nstruct AddOneVec\n{\n  std::unique_ptr<int[]> d;\n  int n = 0, cap = 0, moves = 0;\n  void push (int v)\n  {\n    if (n < cap) { d[n++] = v; return; }\n    auto fresh = std::make_unique<int[]>(cap + 1);\n    for (int k = 0; k < n; ++k) fresh[k] = d[k];\n    moves += n; d = std::move(fresh);\n    cap = cap + 1;\n    d[n++] = v;\n  }\n};\n\nint main ()\n{\n  MiniVec v; AddOneVec w;\n  for (int i = 1; i <= 100; i ++) { v.push(i); w.push(i); }\n  std::println(\"快 {} 格 {} 搬 {}\", v.n, v.cap, v.moves);\n  std::println(\"慢 {} 格 {} 搬 {}\", w.n, w.cap, w.moves);\n  // 搬运次数 4950 比 126，大约 39 倍\n  return 0;\n}\n"]
      }
    },
    {
      cid: "m182", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 182 课考试 · 中间插队为什么要挪人", task: "任务题目：在最开头 insert 一个数，弄清谁挪动的格子最多，并说清插在几号位要挪几件", hint: "想不起来就回看本课【演示 1】的两行输出与【演示 3】的实测账本。",
      notes: ["插在 1 号位，右边原有 4 件全体右移一格；插队者的左边不用动。", "插在 k 号位就挪 size 减 k 件：k 是 0 时 5 减 0 等于 5，全员无一幸免。", "erase 删掉中间那一件后，右边全体左移一格补位，被删的是那一件而不是后面的人。", "尾后插入不用挪任何一件；erase 只把装了几件收回去，格子数照旧 —— 人走座位不还。", "格子连成一片既是下标一步直达的原因，也是中间插删要挪人的原因。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "写一行：造一个 int 动态数组，用初始化列表一次装进 10、20、30、40、50 五件。", acceptRegex: ["std::vector\\s*<\\s*int\\s*>\\s+\\w+\\s*=\\s*\\{\\s*10\\s*,\\s*20\\s*,\\s*30\\s*,\\s*40\\s*,\\s*50\\s*\\}\\s*;"], acceptOn: "code", sample: "std::vector<int> v = {10, 20, 30, 40, 50};", why: "先有一排坐满的人，才看得见插队时谁被挪走；空盒子插人不挪任何人。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：把 999 塞进最前排 —— 用 insert 配 begin() 那个位置，中间不写加号偏移。", acceptRegex: ["\\.insert\\s*\\(\\s*\\w+\\.begin\\s*\\(\\s*\\)\\s*,"], acceptOn: "code", sample: "v.insert(v.begin(), 999);", why: "begin() 就是 0 号位，插在这里右边的五件一个都躲不掉；插进几号位就要挪 size 减几件。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "插完把整支队伍挨个打出来：用一条范围 for 配 std::print 逐个打，一行写完即可。", acceptRegex: ["for\\s*\\(\\s*int\\s+\\w+\\s*:", "std::print\\s*\\("], acceptOn: "code", sample: "for (int x : v) std::print(\"{} \", x);", why: "打印出来的顺序就是挪完之后的顺序：999 坐到 0 号位，原来那五件全体往后挪一格。" },
        { id: "q4", type: "code", score: 15, stem: "再走一个人：用 erase 把 begin() 那一位（或 begin() 加一个号位）撤掉。", acceptRegex: ["\\.erase\\s*\\(\\s*\\w+\\.begin\\s*\\(\\s*\\)\\s*(\\+\\s*\\d+\\s*)?\\)"], acceptOn: "code", sample: "v.erase(v.begin());", why: "撤队和插队是同一笔账的反面：走一个人，右边全体左移一格补位。" },
        { id: "q5", type: "code", score: 15, stem: "换个号位再插一次队：用 insert 配 begin() 加一个偏移，看看这次几个人被挪。", acceptRegex: ["\\.insert\\s*\\(\\s*\\w+\\.begin\\s*\\(\\s*\\)\\s*\\+\\s*\\d+"], acceptOn: "code", sample: "u.insert(u.begin() + 4, 999);", why: "插在靠后的位置只挪左边那一两个人，账就清楚多了 —— 尾后插入甚至一件都不用挪。" },
        { id: "q6", type: "code", score: 15, coversTask: 1, stem: "跑完之后，用一行注释写下哪个号位插队挪动的人最多（至少四个字）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 最开头插队挪得最多：5 件全体右移", why: "这一步只判你确实留了一行注释，注释内容这块编辑器判不了；本机实测 0 号位要挪 5 件。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> v = {10, 20, 30, 40, 50};\n    v.insert(v.begin(), 999);\n    for (int x : v) std::print(\"{} \", x);\n    std::println(\"← 5 件全被右挪\");\n\n    v.erase(v.begin());\n    for (int x : v) std::print(\"{} \", x);\n    std::println(\"← 0 号位走了，右边全体左挪补位\");\n\n    std::vector<int> u = {10, 20, 30, 40, 50};\n    u.insert(u.begin() + 4, 999);\n    for (int x : u) std::print(\"{} \", x);\n    std::println(\"← 插在 4 号位只有 50 要挪\");\n    // 最开头插队挪得最多：5 件全体右移\n    return 0;\n}\n"],
        wrongs: [
          "",
          "std::vector<int> v = {10, 20, 30, 40, 50};\n",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> v = {10, 20, 30, 40, 50};\n    v.insert(v.begin(), 999);\n    v.erase(v.begin());\n    return 0;\n}\n"],
        loose: [
          "# include <print>\n# include <vector>\n\nint main ( )\n{\n  std::vector<int> row = {10,20,30,40,50};\n  row.insert ( row.begin ( ) , 999 );\n  for (int each : row) std::print(\"{} \", each);\n  std::println(\"前排全体右挪\");\n  row.erase(row.begin() + 1);\n  std::vector<int> tail = {10, 20, 30, 40, 50};\n  tail.insert(tail.begin()+2, 7);\n  for (int each : tail) std::print(\"{} \", each);\n  std::println(\"\");\n  // 0 号位插队挪动的人最多，五件\n  return 0;\n}\n"]
      }
    },
  ]
};
