/* 喵站 · C++ 掌握 考卷分部 p05：第 93–96 课（第九轮）
 * 契约与 p03/p04 完全一样：权重和 100、源稿每条任务都有题 coversTask 对着、
 * refs 判 100 / wrongs <60 / loose 必过、每题带 why。
 */
window.MIAO_CPPM_EXAM_P05 = {
  papers: [
    {
      cid: "m93", kind: "paper", mode: "quiz", pass: 60, title: "第 93 课考试 · take、drop、reverse 三个窗口", task: "任务题目：写出 take(3) 再接 reverse 的那条管道并说出输出；再用 drop 加 take 掐出第 4 到第 6 个元素", hint: "想不起来就回看本课【演示 2 · 换个接法就换个答案】与【演示 3 · drop 加 take：掐出中间一段】。",
      questions: [
        { id: "q1", type: "choice", score: 16, stem: "take、drop、reverse 这三段在管道里干的是哪件事？", options: ["把每个元素换成新的值", "只改「从哪看、看几个、朝哪边看」，元素本身不动", "把结果存成一份新的 vector", "把原容器真的重排一遍"], answer: 1, why: "加工是 filter 与 transform 的职责；这三个是窗口，底下一份数据一个字节都不改。" },
        { id: "q2", type: "output", score: 20, coversTask: 1, stem: "nums 是 1 到 10，这段打印什么？（一行）\nfor (int v : nums | std::views::take(3) | std::views::reverse) std::print(\"{} \", v);", acceptLines: ["3 2 1"], why: "先截断得到 1 2 3，再倒着读 —— take 问的是「此刻流里的头三个」，而流已被上一段改过。" },
        { id: "q3", type: "choice", score: 16, coversTask: 2, stem: "想「从第 4 个开始往后看」，drop 的参数该写几？", options: ["4", "3", "5", "写几都行，差一格不影响结果"], answer: 1, why: "drop 数的是扔掉几个而不是第几个；写 4 会从第 5 个开始，整个窗口往后挪一格。" },
        { id: "q4", type: "output", score: 19, coversTask: 1, stem: "还是 nums 是 1 到 10，这段打印什么？（一行）\nfor (int v : nums | std::views::reverse | std::views::take(3)) std::print(\"{} \", v);", acceptLines: ["10 9 8"], why: "先把整排倒过来变成 10 9 8 7 …，再取头三个 —— 与 q2、q3 那个接法结果完全不同，顺序就是语义。" },
        { id: "q5", type: "blank", score: 12, stem: "视图自己不装数据，它只是架在原数据上的一扇____。（填本课打的那个比方）", accept: ["窗", "窗户", "窗口"], why: "窗框可以搬来搬去，家具一件没动；这也解释了为什么构造一条管道几乎不花钱。" },
        { id: "q6", type: "multi", score: 17, stem: "关于这三个窗口视图，哪些说法对？（多选，错勾任何一项整题 0 分）", options: ["drop(7) 之后看到的第一个元素，是原数据里的第 8 个", "reverse 会把 vector 里的元素真的倒过来摆", "同一个视图遍历两遍结果一样，因为它不消耗数据", "把窗口接在一个临时容器上再留着以后用，是安全的"], answers: [0, 2], why: "视图不复制底层数据，房子没了窗框也就悬空 —— 临时容器那句是最阴的坑。" }
      ],
      selftest: {
        refs: [
          {q1: 1, q2: "3 2 1", q3: 1, q4: "10 9 8", q5: "窗户", q6: [0, 2]}],
        wrongs: [
          {q1: 0, q2: "1 2 3", q3: 0, q4: "8 9 10", q5: "副本", q6: [1, 3]},
          {q1: 2, q2: "10 9 8", q3: 0, q4: "3 2 1", q5: "指针", q6: [0]}],
        loose: [
          {q1: "1", q2: " 3  2 1 ", q3: "1", q4: "10  9  8 ", q5: "窗", q6: [2, 0]}]
      }
    },
    {
      cid: "m94", kind: "paper", mode: "quiz", authored: "5e333254", pass: 60, title: "第 94 课考试 · iota 与惰性求值", task: "任务题目：把无限流里的加工机换成立方并取前 5 个，写出输出；再说清如果视图不惰性，那条无限流管道会怎样", hint: "想不起来就回看本课【演示 2 · 无限流配 take】与【演示 3 · 给数数机装个喇叭】。",
      questions: [
        { id: "q1", type: "choice", score: 12, stem: "std::views::iota(1, 6) 产生的是哪一串？", options: ["1 2 3 4 5 6 —— 两端都取", "1 2 3 4 5 —— 右端是「还没到」，6 取不到", "0 1 2 3 4 5 —— 从 0 数起", "只有 1 和 6 两个端点"], answer: 1, why: "跟容器区间的口径一样是半开：右端写的是「数到哪儿停」，不是「含不含」。想含 6 就写 iota(1, 7)。" },
        { id: "q2", type: "output", score: 19, coversTask: 1, stem: "上面那条管道再续一段 take(5)，然后 for 圈逐个 std::print(\"{} \", v)，打印什么？（一行）", acceptLines: ["1 8 27 64 125"], why: "1 到 5 的立方；这台数数机总共只吐了 5 个数，第 6 个从未被造出来。" },
        { id: "q3", type: "choice", score: 9, coversTask: 2, stem: "写下「iota(1) 接 transform 接 take(8)」的那一刻，程序做了什么？", options: ["一路造到 8 个才算完，然后才返回这个视图", "什么都没造：只记下「怎么给下一个、怎么换算、要几个」", "把 1 到 8 的平方存进一份临时数组", "报错，无限流不能接加工段"], answer: 1, why: "惰性 —— 建立视图只是登记做法，真干活等到 for 圈来要的那一刻。" },
        { id: "q4", type: "output", score: 14, coversTask: 2, stem: "（任务题）演示 3 这段打印什么？（两行；方括号里是被造的数，标记与数字之间没有空格）\nauto sq = std::views::iota(1) | std::views::transform([](int n) { std::print(\"[造 {}]\", n); return n * n; }) | std::views::take(4);\nstd::println(\"视图建好了，上面一个字都没打印\");\nfor (int v : sq) std::print(\"{} \", v);", acceptLines: ["视图建好了，上面一个字都没打印", "[造 1]1 [造 2]4 [造 3]9 [造 4]16"], why: "提示句先出来，证明建视图时一个都没造；四个标记和四个平方交替出现，而且刚好四个 —— take 说好了要四个。" },
        { id: "q5", type: "choice", score: 14, coversTask: 2, stem: "要是视图不惰性 —— 接上管道就立刻把全部结果算好存起来 —— 演示 2 那段会怎样？", options: ["只是慢一点，照样打出那 8 个数", "根本走不完：它得在建立视图那一刻数完一个没有终点的序列", "自动只算 8 个，因为右边写了 take(8)", "编译就拦住，无限流必须配终点"], answer: 1, why: "不惰性时 take 就退化成「先造完再剪短」，而无限流造不完。惰性才让 take 成为刹车而不是剪刀。" },
        { id: "q6", type: "multi", score: 15, stem: "关于 iota 与惰性，哪些说法对？（多选，错勾任何一项整题 0 分）", options: ["只给一个参数的 iota 表示没有终点的序列", "同一个 iota 视图遍历两遍，数数机会从头再数两遍", "它保证能被一位一位要下去，但不保证有长度可问、也不保证能下标随机取", "右边的 take(5) 只是把已经造好的结果裁短，造多少跟它没关系"], answers: [0, 1, 2], why: "最后一项把惰性说反了：take(5) 决定上游最多只被要 5 次，省的就是那部分没被要的。" },
        { id: "q7", type: "match", score: 17, coversTask: 1, stem: "把左边这条立方管道的各段写法，和它真正的效果连起来（右边顺序是打乱的）。", answer: {"std::views::iota(1) 只给一个起点": "凭空起一条没有终点的流 1 2 3 …", "transform 里写 return n * n * n": "每个数换成立方，头五个是 1 8 27 64 125", "管道末尾再续一段 std::views::take(5)": "上游最多被要五次，第六个数从未被造出来", "整条管道写好的那一刻，for 还没开始圈": "一个字都没打印，一个数都没造，只登记下做法"}, left: ["std::views::iota(1) 只给一个起点", "transform 里写 return n * n * n", "管道末尾再续一段 std::views::take(5)", "整条管道写好的那一刻，for 还没开始圈"], right: ["每个数换成立方，头五个是 1 8 27 64 125", "凭空起一条没有终点的流 1 2 3 …", "一个字都没打印，一个数都没造，只登记下做法", "上游最多被要五次，第六个数从未被造出来"], why: "只给起点的 iota 是没有终点的流；立方要在 transform 里把同一个数连乘两次。take(5) 不是先造一堆再剪短，它让上游最多被要五次，第六个从未被造出来 —— 整条管道登记的是做法，for 来要的那一刻才现算。" }
      ],
      selftest: {
        refs: [
          {q1: 1, q2: "1 8 27 64 125", q3: 1, q4: "视图建好了，上面一个字都没打印\n[造 1]1 [造 2]4 [造 3]9 [造 4]16", q5: 1, q6: [0, 1, 2], q7: {"std::views::iota(1) 只给一个起点": "凭空起一条没有终点的流 1 2 3 …", "transform 里写 return n * n * n": "每个数换成立方，头五个是 1 8 27 64 125", "管道末尾再续一段 std::views::take(5)": "上游最多被要五次，第六个数从未被造出来", "整条管道写好的那一刻，for 还没开始圈": "一个字都没打印，一个数都没造，只登记下做法"}}],
        wrongs: [
          {q1: 0, q2: "1 4 9 16 25", q3: 2, q4: "[造 1]1 [造 2]4 [造 3]9 [造 4]16\n视图建好了，上面一个字都没打印", q5: 2, q6: [3], q7: {"std::views::iota(1) 只给一个起点": "每个数换成立方，头五个是 1 8 27 64 125", "transform 里写 return n * n * n": "一个字都没打印，一个数都没造，只登记下做法", "管道末尾再续一段 std::views::take(5)": "凭空起一条没有终点的流 1 2 3 …", "整条管道写好的那一刻，for 还没开始圈": "上游最多被要五次，第六个数从未被造出来"}},
          {q1: 2, q2: "1 8 27 64", q3: 0, q4: "视图建好了", q5: 0, q6: [0, 1], q7: {"std::views::iota(1) 只给一个起点": "每个数换成立方，头五个是 1 8 27 64 125", "transform 里写 return n * n * n": "一个字都没打印，一个数都没造，只登记下做法", "管道末尾再续一段 std::views::take(5)": "凭空起一条没有终点的流 1 2 3 …", "整条管道写好的那一刻，for 还没开始圈": "上游最多被要五次，第六个数从未被造出来"}}],
        loose: [
          {q1: "1", q2: " 1  8 27  64 125 ", q3: "1", q4: "视图建好了，上面一个字都没打印\n [造 1]1 [造 2]4 [造 3]9 [造 4]16 ", q5: "1", q6: [2, 1, 0], q7: {"0": 1, "1": 0, "2": 3, "3": 2}}]
      }
    },
    {
      cid: "m95", kind: "paper", mode: "code", authored: "e8753542", pass: 60, title: "第 95 课考试 · 学生数据管道", task: "任务题目：用一条 filter 加 transform 的水管取出不及格学生的名字；再用 std::ranges::count_if 统计 90 分以上有几人", hint: "想不起来就回看本课【演示 2 · 反着挑：不及格的名字】与【演示 3 · 数人头交给 count_if】。",
      questions: [
        { id: "q1", type: "code", score: 26, coversTask: 2, stem: "（任务题）写出这条视图：从 stu 出发，先挑不及格的（分数低于 60），再把人换成名字。可以挂到 auto 变量上，参数名随意。", acceptRegex: ["filter", "score\\s*<\\s*60", "transform", "name"], sample: "auto fail = stu | std::views::filter([](const Student& s) { return s.score < 60; }) | std::views::transform([](const Student& s) { return s.name; });", why: "两段一个都不能少：只 filter 出来的是学生，还得 transform 取 name 才是名字。" },
        { id: "q2", type: "code", score: 26, coversTask: 1, stem: "（任务题）写出统计「90 分以上有几人」那一句：容器是 stu，谓词比较 score 大于 90，结果收到一个 auto 变量里。", acceptRegex: ["count_if", "score", ">\\s*90"], sample: "auto above = std::ranges::count_if(stu, [](const Student& s) { return s.score > 90; });", why: "count_if 收「容器 + 谓词」，回的是个数；结果类型是无符号长度，用 auto 接最稳。" },
        { id: "q3", type: "code", score: 26, coversTask: 1, stem: "（任务题）统计 90 分以上有几人：写一行，用 ranges 版的 count_if 数 stu 这个容器，谓词就地写一把收 const Student& 的 lambda。", acceptRegex: ["ranges\\s*::\\s*count_if\\s*\\(\\s*stu\\s*,", "const\\s+Student\\s*&"], sample: "auto above = std::ranges::count_if(stu, [](const Student& s) { return s.score > 90; });", why: "ranges 版直接收整个容器，不用再递头和尾后；谓词收 const Student&，每要一个学生就少复制一张名片。" },
        { id: "q4", type: "code", score: 22, coversTask: 2, stem: "（任务题）视图 fail 已经接好了（里面流的是不及格同学的名字）。写一句：挨个把名字打印出来。", acceptRegex: ["for\\s*\\(", ":\\s*fail\\s*\\)", "print"], sample: "for (const auto& name : fail) std::print(\"{} \", name);", why: "视图是个看法，for 一圈它才真被算一遍；圈变量按 const 引用收，就不用每要一个名字复制一份 string。" }
      ],
      selftest: {
        refs: [
          {q1: "auto fail = stu | std::views::filter([](const Student& s) { return s.score < 60; }) | std::views::transform([](const Student& s) { return s.name; });", q2: "auto above = std::ranges::count_if(stu, [](const Student& s) { return s.score > 90; });", q3: "auto above = std::ranges::count_if(stu, [](const Student& s) { return s.score > 90; });", q4: "for (const auto& name : fail) std::print(\"{} \", name);"}],
        wrongs: [
          {q1: "stu | std::views::filter([](const Student& s) { return s.score >= 60; }) | std::views::transform([](const Student& s) { return s.score; })", q2: "auto above = std::ranges::count(stu, 90);", q3: "auto above = std::count_if(stu.begin(), stu.end(), [](const Student& s) { return s.score > 90; });", q4: "std::println(\"{}\", fail);"},
          {q1: "stu | std::views::filter([](auto s) { return s.score < 60; })", q2: "auto above = std::ranges::count_if(stu, [](const Student& s) { return s.score >= 90; });", q3: "auto above = std::count_if(stu.begin(), stu.end(), [](const Student& s) { return s.score > 90; });", q4: "std::println(\"{}\", fail);"}],
        loose: [
          {q1: "auto fail=stu|std::views::filter([](const Student& p){return p.score<60;})|std::views::transform([](const Student& p){return p.name;});", q2: "auto above = std::ranges::count_if( stu , [](const Student& s){return s.score>90;} );", q3: "auto above = std :: ranges :: count_if ( stu , [ ] ( const Student & s ) { return s.score > 90; } );", q4: "for( auto  name : fail )   print(\"{}\", name);"}]
      }
    },
    {
      cid: "m96", kind: "paper", mode: "quiz", authored: "628aee48", pass: 60, title: "第 96 课考试 · 视图不复制数据", task: "任务题目：写出把视图落地成一份独立容器的写法（C++23 的 std::ranges::to，外加不用它的老写法），并回答原数据被销毁之后窗户还能不能用", hint: "想不起来就回看本课【演示 2 · 想要独立副本，就落地】与【演示 3 · 反例：窗框比房子活得久】。",
      questions: [
        { id: "q1", type: "output", score: 16, stem: "这段打印什么？（两行）\nstd::vector<int> nums = {1, 2, 3, 4, 5, 6, 7};\nauto tail = nums | std::views::drop(5);\nfor (int v : tail) std::print(\"{} \", v);\nstd::println(\"\");\nnums[6] = 100;\nfor (int v : tail) std::print(\"{} \", v);", acceptLines: ["6 7", "6 100"], why: "tail 在两行之间一个字没动，看到的却变了 —— 证明它手里没有第二份数据，看的就是 nums。" },
        { id: "q2", type: "choice", score: 18, coversTask: 2, stem: "（任务题）nums 被销毁之后，还留着的那扇窗 tail 能看吗？", options: ["能，视图自己留了一份数据副本", "不能 —— 窗框记着的位置已经悬空，读它是未定义行为，而且不报错", "能读，但不能写", "编译器会当场拦住，根本编不过"], answer: 1, why: "视图不持有元素，命全挂在原数据上。标准库拦不住你，因为它不知道底下那份容器什么时候没。" },
        { id: "q3", type: "choice", score: 16, stem: "通过窗户去改元素 —— 圈变量写成 int&，在圈里给它赋值 —— 会发生什么？", options: ["改的就是原件，容器里的值真的变了", "什么也改不到，视图只读", "先复制一份再改副本", "编译报错"], answer: 0, why: "不复制的另一面：drop、take、reverse 递给你的是原元素的引用。想安全得自己落地一份，隔着窗不等于隔着玻璃。" },
        { id: "q4", type: "multi", score: 18, coversTask: 1, stem: "哪些场合该把视图落地成真容器？（多选，错勾任何一项整题 0 分）", options: ["加工很贵，而同一段结果要反复用好几遍", "要对处理后的结果重排 —— 排序是动存储的活，看法动不了", "结果要带到别的作用域去，函数返回之后还要用", "只是想打印一遍看看有数"], answers: [0, 1, 2], why: "打印一遍正好是视图最擅长的：一次遍历、零拷贝。前三条都在要求「有一份数据要活下来」，那必须落地。" },
        { id: "q5", type: "blank", score: 10, coversTask: 2, stem: "一句话记死本课：窗户的命挂在____上，所以它的寿命必须严格短于它。（填两个到四个字）", accept: ["原数据", "底层数据", "原来的数据", "数据"], why: "视图只是看法，元素一件不存；底下那份数据没了，窗框就是悬空的。" },
        { id: "q6", type: "match", score: 22, coversTask: 1, stem: "把左边的写法和它真正的效果连起来（右边顺序是打乱的）。", answer: {"nums | std::views::drop(5)": "只看到最后两个元素，数据仍住在 nums 里", "even | std::ranges::to<std::vector>()": "真复制出一份独立副本，此后改原件动不到它", "架好窗户之后写 nums[6] = 100": "窗户里的 7 跟着变成 100，看到的还是原件", "给 make_nums() 的结果架 take(3) 这扇窗": "底下的容器早没了，读这扇窗是未定义行为"}, left: ["nums | std::views::drop(5)", "even | std::ranges::to<std::vector>()", "架好窗户之后写 nums[6] = 100", "给 make_nums() 的结果架 take(3) 这扇窗"], right: ["真复制出一份独立副本，此后改原件动不到它", "窗户里的 7 跟着变成 100，看到的还是原件", "底下的容器早没了，读这扇窗是未定义行为", "只看到最后两个元素，数据仍住在 nums 里"], why: "视图只是窗户：drop 不改数据，原件变窗户里就跟着变；想留一份各走各的，得用 ranges::to 落地成真容器；窗框比房子活得久，读它就是悬空未定义。" }
      ],
      selftest: {
        refs: [
          {q1: "6 7\n6 100", q2: 1, q3: 0, q4: [0, 1, 2], q5: "原数据", q6: {"nums | std::views::drop(5)": "只看到最后两个元素，数据仍住在 nums 里", "even | std::ranges::to<std::vector>()": "真复制出一份独立副本，此后改原件动不到它", "架好窗户之后写 nums[6] = 100": "窗户里的 7 跟着变成 100，看到的还是原件", "给 make_nums() 的结果架 take(3) 这扇窗": "底下的容器早没了，读这扇窗是未定义行为"}}],
        wrongs: [
          {q1: "6 7\n6 7", q2: 0, q3: 1, q4: [3], q5: "副本", q6: {"nums | std::views::drop(5)": "真复制出一份独立副本，此后改原件动不到它", "even | std::ranges::to<std::vector>()": "窗户里的 7 跟着变成 100，看到的还是原件", "架好窗户之后写 nums[6] = 100": "底下的容器早没了，读这扇窗是未定义行为", "给 make_nums() 的结果架 take(3) 这扇窗": "只看到最后两个元素，数据仍住在 nums 里"}},
          {q1: "1 2 3 4 5 6 7\n1 2 3 4 5 6 100", q2: 2, q3: 3, q4: [0, 3], q5: "窗框", q6: {"nums | std::views::drop(5)": "真复制出一份独立副本，此后改原件动不到它", "even | std::ranges::to<std::vector>()": "窗户里的 7 跟着变成 100，看到的还是原件", "架好窗户之后写 nums[6] = 100": "底下的容器早没了，读这扇窗是未定义行为", "给 make_nums() 的结果架 take(3) 这扇窗": "只看到最后两个元素，数据仍住在 nums 里"}}],
        loose: [
          {q1: " 6  7 \n6  100 ", q2: "1", q3: "0", q4: [2, 1, 0], q5: "底层数据", q6: {"0": 3, "1": 0, "2": 1, "3": 2}}]
      }
    },
  ]
};
