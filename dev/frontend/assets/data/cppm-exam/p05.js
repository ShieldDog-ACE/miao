/* 喵站 · C++ 掌握 考卷分部 p05：第 93–96 课（第九轮）
 * 契约与 p03/p04 完全一样：权重和 100、源稿每条任务都有题 coversTask 对着、
 * refs 判 100 / wrongs <60 / loose 必过、每题带 why。
 */
window.MIAO_CPPM_EXAM_P05 = {
  papers: [
    {
      cid: "m93", kind: "paper", pass: 60,
      title: "第 93 课考试 · take、drop、reverse 三个窗口",
      task: "任务题目：写出 take(3) 再接 reverse 的那条管道并说出输出；再用 drop 加 take 掐出第 4 到第 6 个元素",
      hint: "想不起来就回看本课【演示 2 · 换个接法就换个答案】与【演示 3 · drop 加 take：掐出中间一段】。",
      questions: [
        { id: "q1", type: "choice", score: 10,
          stem: "take、drop、reverse 这三段在管道里干的是哪件事？",
          options: ["把每个元素换成新的值", "只改「从哪看、看几个、朝哪边看」，元素本身不动", "把结果存成一份新的 vector", "把原容器真的重排一遍"],
          answer: 1,
          why: "加工是 filter 与 transform 的职责；这三个是窗口，底下一份数据一个字节都不改。" },
        { id: "q2", type: "code", score: 18, coversTask: 1,
          stem: "（任务题）写成一行：从 nums 出发，先取前 3 个，再倒过来，交给 for 遍历并打印。",
          acceptRegex: ["take\\s*\\(\\s*3\\s*\\)\\s*\\|\\s*(?:std::)?views::reverse"],
          why: "顺序写在纸上就定了：take(3) 在前、reverse 在后。写成 reverse 再接 take(3) 得到的是最后三个。" },
        { id: "q3", type: "output", score: 12, coversTask: 1,
          stem: "nums 是 1 到 10，这段打印什么？（一行）\nfor (int v : nums | std::views::take(3) | std::views::reverse) std::print(\"{} \", v);",
          acceptLines: ["3 2 1"],
          why: "先截断得到 1 2 3，再倒着读 —— take 问的是「此刻流里的头三个」，而流已被上一段改过。" },
        { id: "q4", type: "code", score: 20, coversTask: 2,
          stem: "（任务题）写成一行：用 drop 加 take 取出 nums 的第 4 到第 6 个，交给 for 遍历。",
          acceptRegex: ["views::drop\\s*\\(\\s*3\\s*\\)\\s*\\|\\s*(?:std::)?views::take\\s*\\(\\s*3\\s*\\)"],
          why: "从第 4 个开始＝扔掉前 3 个，所以 drop 里写 3；要 3 个，所以 take 里写 3。换算式是 drop(a-1) 配 take(b-a+1)。" },
        { id: "q5", type: "choice", score: 10, coversTask: 2,
          stem: "想「从第 4 个开始往后看」，drop 的参数该写几？",
          options: ["4", "3", "5", "写几都行，差一格不影响结果"],
          answer: 1,
          why: "drop 数的是扔掉几个而不是第几个；写 4 会从第 5 个开始，整个窗口往后挪一格。" },
        { id: "q6", type: "output", score: 12, coversTask: 1,
          stem: "还是 nums 是 1 到 10，这段打印什么？（一行）\nfor (int v : nums | std::views::reverse | std::views::take(3)) std::print(\"{} \", v);",
          acceptLines: ["10 9 8"],
          why: "先把整排倒过来变成 10 9 8 7 …，再取头三个 —— 与 q2、q3 那个接法结果完全不同，顺序就是语义。" },
        { id: "q7", type: "blank", score: 8,
          stem: "视图自己不装数据，它只是架在原数据上的一扇____。（填本课打的那个比方）",
          accept: ["窗", "窗户", "窗口"],
          why: "窗框可以搬来搬去，家具一件没动；这也解释了为什么构造一条管道几乎不花钱。" },
        { id: "q8", type: "multi", score: 10,
          stem: "关于这三个窗口视图，哪些说法对？（多选，错勾任何一项整题 0 分）",
          options: ["drop(7) 之后看到的第一个元素，是原数据里的第 8 个", "reverse 会把 vector 里的元素真的倒过来摆", "同一个视图遍历两遍结果一样，因为它不消耗数据", "把窗口接在一个临时容器上再留着以后用，是安全的"],
          answers: [0, 2],
          why: "视图不复制底层数据，房子没了窗框也就悬空 —— 临时容器那句是最阴的坑。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: "for (int v : nums | std::views::take(3) | std::views::reverse) std::print(\"{} \", v);", q3: "3 2 1", q4: "for (int v : nums | std::views::drop(3) | std::views::take(3)) std::print(\"{} \", v);", q5: 1, q6: "10 9 8", q7: "窗户", q8: [0, 2] }
        ],
        wrongs: [
          { q1: 0, q2: "nums | std::views::reverse | std::views::take(3)", q3: "1 2 3", q4: "nums | std::views::drop(4) | std::views::take(6)", q5: 0, q6: "8 9 10", q7: "副本", q8: [1, 3] },
          { q1: 2, q2: "std::views::take(3)", q3: "10 9 8", q4: "for (int v : nums | std::views::drop(3))", q5: 0, q6: "3 2 1", q7: "指针", q8: [0] }
        ],
        loose: [
          { q1: "1", q2: "for(int v:nums|std::views::take ( 3 ) |views::reverse){ std::print(\"{} \", v); }", q3: " 3  2 1 ", q4: "for (int v : nums | std::views::drop ( 3 ) | std::views::take ( 3 )) std::print(\"{} \", v);", q5: "1", q6: "10  9  8 ", q7: "窗", q8: [2, 0] }
        ]
      }
    },
    {
      cid: "m94", kind: "paper", pass: 60,
      title: "第 94 课考试 · iota 与惰性求值",
      task: "任务题目：把无限流里的加工机换成立方并取前 5 个，写出输出；再说清如果视图不惰性，那条无限流管道会怎样",
      hint: "想不起来就回看本课【演示 2 · 无限流配 take】与【演示 3 · 给数数机装个喇叭】。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          stem: "std::views::iota(1, 6) 产生的是哪一串？",
          options: ["1 2 3 4 5 6 —— 两端都取", "1 2 3 4 5 —— 右端是「还没到」，6 取不到", "0 1 2 3 4 5 —— 从 0 数起", "只有 1 和 6 两个端点"],
          answer: 1,
          why: "跟容器区间的口径一样是半开：右端写的是「数到哪儿停」，不是「含不含」。想含 6 就写 iota(1, 7)。" },
        { id: "q2", type: "code", score: 14, coversTask: 1,
          stem: "（任务题）写出这条管道的头两段：从 1 开始的无限流，接一段 transform，把每个数换成立方。参数名随意，写成一行也可以。",
          acceptRegex: ["iota\\s*\\(\\s*1\\s*\\)", "transform", "\\*\\s*\\w+\\s*\\*\\s*\\w+"],
          why: "无限流就是只给一个起点的 iota；立方要连乘两次同一个变量 —— 少写一个乘号就变成平方了。" },
        { id: "q3", type: "output", score: 20, coversTask: 1,
          stem: "上面那条管道再续一段 take(5)，然后 for 圈逐个 std::print(\"{} \", v)，打印什么？（一行）",
          acceptLines: ["1 8 27 64 125"],
          why: "1 到 5 的立方；这台数数机总共只吐了 5 个数，第 6 个从未被造出来。" },
        { id: "q4", type: "choice", score: 10,
          stem: "写下「iota(1) 接 transform 接 take(8)」的那一刻，程序做了什么？",
          options: ["一路造到 8 个才算完，然后才返回这个视图", "什么都没造：只记下「怎么给下一个、怎么换算、要几个」", "把 1 到 8 的平方存进一份临时数组", "报错，无限流不能接加工段"],
          answer: 1,
          why: "惰性 —— 建立视图只是登记做法，真干活等到 for 圈来要的那一刻。" },
        { id: "q5", type: "output", score: 14, coversTask: 2,
          stem: "（任务题）演示 3 这段打印什么？（两行；方括号里是被造的数，标记与数字之间没有空格）\nauto sq = std::views::iota(1) | std::views::transform([](int n) { std::print(\"[造 {}]\", n); return n * n; }) | std::views::take(4);\nstd::println(\"视图建好了，上面一个字都没打印\");\nfor (int v : sq) std::print(\"{} \", v);",
          acceptLines: ["视图建好了，上面一个字都没打印", "[造 1]1 [造 2]4 [造 3]9 [造 4]16"],
          why: "提示句先出来，证明建视图时一个都没造；四个标记和四个平方交替出现，而且刚好四个 —— take 说好了要四个。" },
        { id: "q6", type: "choice", score: 14, coversTask: 2,
          stem: "要是视图不惰性 —— 接上管道就立刻把全部结果算好存起来 —— 演示 2 那段会怎样？",
          options: ["只是慢一点，照样打出那 8 个数", "根本走不完：它得在建立视图那一刻数完一个没有终点的序列", "自动只算 8 个，因为右边写了 take(8)", "编译就拦住，无限流必须配终点"],
          answer: 1,
          why: "不惰性时 take 就退化成「先造完再剪短」，而无限流造不完。惰性才让 take 成为刹车而不是剪刀。" },
        { id: "q7", type: "multi", score: 16,
          stem: "关于 iota 与惰性，哪些说法对？（多选，错勾任何一项整题 0 分）",
          options: ["只给一个参数的 iota 表示没有终点的序列", "同一个 iota 视图遍历两遍，数数机会从头再数两遍", "它保证能被一位一位要下去，但不保证有长度可问、也不保证能下标随机取", "右边的 take(5) 只是把已经造好的结果裁短，造多少跟它没关系"],
          answers: [0, 1, 2],
          why: "最后一项把惰性说反了：take(5) 决定上游最多只被要 5 次，省的就是那部分没被要的。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: "std::views::iota(1) | std::views::transform([](int n) { return n * n * n; })", q3: "1 8 27 64 125", q4: 1, q5: "视图建好了，上面一个字都没打印\n[造 1]1 [造 2]4 [造 3]9 [造 4]16", q6: 1, q7: [0, 1, 2] }
        ],
        wrongs: [
          { q1: 0, q2: "std::views::iota(1, 5) | std::views::transform([](int n) { return n * n; })", q3: "1 4 9 16 25", q4: 2, q5: "[造 1]1 [造 2]4 [造 3]9 [造 4]16\n视图建好了，上面一个字都没打印", q6: 2, q7: [3] },
          { q1: 2, q2: "iota() | transform(n * n)", q3: "1 8 27 64", q4: 0, q5: "视图建好了", q6: 0, q7: [0, 1] }
        ],
        loose: [
          { q1: "1", q2: "std::views::iota ( 1 ) |std::views::transform ([](int n){ return n*n*n; })", q3: " 1  8 27  64 125 ", q4: "1", q5: "视图建好了，上面一个字都没打印\n [造 1]1 [造 2]4 [造 3]9 [造 4]16 ", q6: "1", q7: [2, 1, 0] }
        ]
      }
    },
    {
      cid: "m95", kind: "paper", pass: 60,
      title: "第 95 课考试 · 学生数据管道",
      task: "任务题目：用一条 filter 加 transform 的水管取出不及格学生的名字；再用 std::ranges::count_if 统计 90 分以上有几人",
      hint: "想不起来就回看本课【演示 2 · 反着挑：不及格的名字】与【演示 3 · 数人头交给 count_if】。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          stem: "这条水管里 filter 与 transform 的分工，哪句说对了？",
          options: ["两段都会换掉流里的元素类型", "filter 只决定谁能过去、过去的还是那个学生；transform 才把学生换成名字", "transform 会把一部分人筛掉", "两段都只是看法，谁都不影响流里的东西"],
          answer: 1,
          why: "filter 改人数不改内容，transform 改内容不改人数 —— 类型只在被加工那一段被换掉。" },
        { id: "q2", type: "output", score: 14, coversTask: 2,
          stem: "名单是小明 88、小强 72、小红 95、小刚 58。这段打印什么？（一行）\nfor (const auto& name : stu | std::views::filter([](const Student& s) { return s.score < 60; })\n                            | std::views::transform([](const Student& s) { return s.name; })) std::print(\"{} \", name);",
          acceptLines: ["小刚"],
          why: "只有 58 分那位通过小于 60 的筛子；顺序与名单一致，也不会额外打印分数。" },
        { id: "q3", type: "code", score: 18, coversTask: 2,
          stem: "（任务题）写出这条视图：从 stu 出发，先挑不及格的（分数低于 60），再把人换成名字。可以挂到 auto 变量上，参数名随意。",
          acceptRegex: ["filter", "score\\s*<\\s*60", "transform", "name"],
          why: "两段一个都不能少：只 filter 出来的是学生，还得 transform 取 name 才是名字。" },
        { id: "q4", type: "choice", score: 10,
          stem: "std::ranges::count_if 干的是哪件事？",
          options: ["数一数容器里有几个元素让谓词为真，回一个总数", "把满足条件的元素挑出来存成一份新容器", "找出第一个满足条件的元素", "检查是否所有元素都满足条件"],
          answer: 0,
          why: "「要一个总数」和「要一个个元素」是两种需求；挑出来另存是 filter 加落地，找第一个和判全部各有别的算法。" },
        { id: "q5", type: "code", score: 18, coversTask: 1,
          stem: "（任务题）写出统计「90 分以上有几人」那一句：容器是 stu，谓词比较 score 大于 90，结果收到一个 auto 变量里。",
          acceptRegex: ["count_if", "score", ">\\s*90"],
          why: "count_if 收「容器 + 谓词」，回的是个数；结果类型是无符号长度，用 auto 接最稳。" },
        { id: "q6", type: "output", score: 12, coversTask: 1,
          stem: "这段打印什么？（一行）\nauto above = std::ranges::count_if(stu, [](const Student& s) { return s.score > 90; });\nauto pass = std::ranges::count_if(stu, [](const Student& s) { return s.score >= 60; });\nstd::println(\"{} {}\", above, pass);",
          acceptLines: ["1 3"],
          why: "大于 90 的只有 95 那一位；大于等于 60 的是 88、72、95 三位，58 那位不算。" },
        { id: "q7", type: "multi", score: 16,
          stem: "关于这条管道，下列说法对的是？（多选，错勾任何一项整题 0 分）",
          options: ["lambda 参数写 const Student& 是为了每要一个元素就少复制一个学生", "圈变量按值写 std::string name，等于又复制一份名字", "在 filter 的谓词里把 s.score 偷偷改大是常规写法", "视图流出去的名字顺序由你现场决定，跟名单顺序没关系"],
          answers: [0, 1],
          why: "谓词拿到的是 const 引用，改不动也不该改；filter 与 transform 都不重排，输出顺序就是名单顺序。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: "小刚", q3: "auto fail = stu | std::views::filter([](const Student& s) { return s.score < 60; }) | std::views::transform([](const Student& s) { return s.name; });", q4: 0, q5: "auto above = std::ranges::count_if(stu, [](const Student& s) { return s.score > 90; });", q6: "1 3", q7: [0, 1] }
        ],
        wrongs: [
          { q1: 0, q2: "小明 小强", q3: "stu | std::views::filter([](const Student& s) { return s.score >= 60; }) | std::views::transform([](const Student& s) { return s.score; })", q4: 1, q5: "auto above = std::ranges::count(stu, 90);", q6: "3 1", q7: [2, 3] },
          { q1: 3, q2: "小刚 58", q3: "stu | std::views::filter([](auto s) { return s.score < 60; })", q4: 2, q5: "auto above = std::ranges::count_if(stu, [](const Student& s) { return s.score >= 90; });", q6: "1 4", q7: [0] }
        ],
        loose: [
          { q1: "1", q2: " 小刚 ", q3: "auto fail=stu|std::views::filter([](const Student& p){return p.score<60;})|std::views::transform([](const Student& p){return p.name;});", q4: "0", q5: "auto above = std::ranges::count_if( stu , [](const Student& s){return s.score>90;} );", q6: "1  3 ", q7: [1, 0] }
        ]
      }
    },
    {
      cid: "m96", kind: "paper", pass: 60,
      title: "第 96 课考试 · 视图不复制数据",
      task: "任务题目：写出把视图落地成一份独立容器的写法（C++23 的 std::ranges::to，外加不用它的老写法），并回答原数据被销毁之后窗户还能不能用",
      hint: "想不起来就回看本课【演示 2 · 想要独立副本，就落地】与【演示 3 · 反例：窗框比房子活得久】。",
      questions: [
        { id: "q1", type: "output", score: 14,
          stem: "这段打印什么？（两行）\nstd::vector<int> nums = {1, 2, 3, 4, 5, 6, 7};\nauto tail = nums | std::views::drop(5);\nfor (int v : tail) std::print(\"{} \", v);\nstd::println(\"\");\nnums[6] = 100;\nfor (int v : tail) std::print(\"{} \", v);",
          acceptLines: ["6 7", "6 100"],
          why: "tail 在两行之间一个字没动，看到的却变了 —— 证明它手里没有第二份数据，看的就是 nums。" },
        { id: "q2", type: "choice", score: 16, coversTask: 2,
          stem: "（任务题）nums 被销毁之后，还留着的那扇窗 tail 能看吗？",
          options: ["能，视图自己留了一份数据副本", "不能 —— 窗框记着的位置已经悬空，读它是未定义行为，而且不报错", "能读，但不能写", "编译器会当场拦住，根本编不过"],
          answer: 1,
          why: "视图不持有元素，命全挂在原数据上。标准库拦不住你，因为它不知道底下那份容器什么时候没。" },
        { id: "q3", type: "code", score: 20, coversTask: 1,
          stem: "（任务题）写成一行：把视图 even 落地成一份真正持有数据的 vector，变量名随意，用本课那条 C++23 的转换写法。",
          acceptRegex: ["ranges\\s*::\\s*to", "even", "vector"],
          why: "std::ranges::to<std::vector>() 接在视图后面，才是真的分配、真的复制 —— 从此跟原件各奔前程。" },
        { id: "q4", type: "choice", score: 14,
          stem: "通过窗户去改元素 —— 圈变量写成 int&，在圈里给它赋值 —— 会发生什么？",
          options: ["改的就是原件，容器里的值真的变了", "什么也改不到，视图只读", "先复制一份再改副本", "编译报错"],
          answer: 0,
          why: "不复制的另一面：drop、take、reverse 递给你的是原元素的引用。想安全得自己落地一份，隔着窗不等于隔着玻璃。" },
        { id: "q5", type: "code", score: 12, coversTask: 1,
          stem: "（任务题）不用那条转换，也写一份把 tail 落地成独立容器的老写法：开一个空的 vector 叫 keep，跑一圈把元素逐个收进去。",
          acceptRegex: ["vector\\s*<\\s*int\\s*>\\s*keep", "for\\s*\\(", "push_back\\s*\\("],
          why: "三样齐了才算真的复制：备好空容器 → 遍历视图 → 逐个 push_back。" },
        { id: "q6", type: "multi", score: 16,
          stem: "哪些场合该把视图落地成真容器？（多选，错勾任何一项整题 0 分）",
          options: ["加工很贵，而同一段结果要反复用好几遍", "要对处理后的结果重排 —— 排序是动存储的活，看法动不了", "结果要带到别的作用域去，函数返回之后还要用", "只是想打印一遍看看有数"],
          answers: [0, 1, 2],
          why: "打印一遍正好是视图最擅长的：一次遍历、零拷贝。前三条都在要求「有一份数据要活下来」，那必须落地。" },
        { id: "q7", type: "blank", score: 8, coversTask: 2,
          stem: "一句话记死本课：窗户的命挂在____上，所以它的寿命必须严格短于它。（填两个到四个字）",
          accept: ["原数据", "底层数据", "原来的数据", "数据"],
          why: "视图只是看法，元素一件不存；底下那份数据没了，窗框就是悬空的。" }
      ],
      selftest: {
        refs: [
          { q1: "6 7\n6 100", q2: 1, q3: "std::vector<int> keep = even | std::ranges::to<std::vector>();", q4: 0, q5: "std::vector<int> keep;\nfor (int v : tail) keep.push_back(v);", q6: [0, 1, 2], q7: "原数据" }
        ],
        wrongs: [
          { q1: "6 7\n6 7", q2: 0, q3: "std::vector<int> keep = {2, 4, 6};", q4: 1, q5: "std::vector<int> keep = tail;", q6: [3], q7: "副本" },
          { q1: "1 2 3 4 5 6 7\n1 2 3 4 5 6 100", q2: 2, q3: "auto keep = tail;   // 视图留着就够了", q4: 3, q5: "for (int v : tail) { std::print(v); }", q6: [0, 3], q7: "窗框" }
        ],
        loose: [
          { q1: " 6  7 \n6  100 ", q2: "1", q3: "std::vector<int>  keep=even|std::ranges::to<std::vector>();", q4: "0", q5: "vector < int > keep ;\nfor(int v : tail)\n    keep . push_back ( v ) ;", q6: [2, 1, 0], q7: "底层数据" }
        ]
      }
    }
  ]
};
