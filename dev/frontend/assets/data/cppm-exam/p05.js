/* 喵站 · C++ 掌握 考卷分部 p05：第 93–96 课（第九轮）
 * 契约与 p03/p04 完全一样：权重和 100、源稿每条任务都有题 coversTask 对着、
 * refs 判 100 / wrongs <60 / loose 必过、每题带 why。
 */
window.MIAO_CPPM_EXAM_P05 = {
  papers: [
    {
      cid: "m93", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 93 课考试 · take、drop、reverse 三个窗口", task: "任务题目：写出 take(3) 再接 reverse 的那条管道并说出输出；再用 drop 加 take 掐出第 4 到第 6 个元素", hint: "想不起来就回看本课【演示 2 · 换个接法就换个答案】与【演示 3 · drop 加 take：掐出中间一段】。",
      notes: ["take、drop、reverse 是窗口：只改从哪看、看几个、朝哪边看，元素本身不动；加工是 filter 与 transform 的职责。", "先 take 再 reverse 得 3 2 1，先 reverse 再 take 得 10 9 8 —— 顺序就是语义，把 lambda 的参数改名才不影响结果。", "视图自己不装数据，它只是架在原数据上的一扇窗：构造一条管道几乎不花钱，同一个视图遍历两遍结果一样，因为它不消耗数据。", "reverse 不会把 vector 里的元素真的倒过来摆；把窗口接在一个临时容器上再留着以后用是最阴的坑，房子没了窗框也就悬空。", "drop(7) 之后看到的第一个元素，是原数据里的第 8 个：想从第几个开始看，参数就写它减一。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条那条窗：先把那串数接 take(3)，再接 reverse，一竖线一竖线写下来。", acceptRegex: ["\\w+\\s*\\|\\s*std::views::take\\s*\\(\\s*3\\s*\\)\\s*\\|\\s*std::views::reverse"], acceptOn: "code", sample: "nums | std::views::take(3) | std::views::reverse", why: "take 问的是此刻流里的头三个，而流已被上一段改过：先截断得 1 2 3，再倒着读就是 3 2 1。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "备好被看的那串数：一只 std::vector<int>，花括号里按顺序给上初值。", acceptRegex: ["std::vector\\s*<\\s*int\\s*>\\s+\\w+\\s*=\\s*\\{"], acceptOn: "code", sample: "std::vector<int> nums = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};", why: "窗框可以搬来搬去，家具一件没动：底下这一份就是全部数据。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "任务要你加的那一行 show：第一个格子给个名字，第二个格子递上那条带竖线的窗。", acceptRegex: ["\\bshow\\s*\\(\\s*\"[^\"]*\"\\s*,\\s*\\w+\\s*\\|"], acceptOn: "code", sample: "show(\"take(3):\", nums | std::views::take(3));", why: "小工具收的第二个参数是 auto 的窗，窗被问了才给数 —— 一行就把一扇窗打印完。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "把 show 这把小工具本体写出来：收一个 std::string 的名字加一个 auto 的窗，体里用 range-for 逐个 std::print。", acceptRegex: ["\\bvoid\\s+show\\s*\\(\\s*std::string\\s+\\w+\\s*,\\s*auto\\s+\\w+\\s*\\)", "for\\s*\\(\\s*int\\s+\\w+\\s*:\\s*\\w+\\s*\\)", "std::print\\s*\\("], acceptOn: "code", sample: "void show(std::string label, auto view) {\n    std::print(\"{:<10}\", label);\n    for (int v : view) std::print(\"{} \", v);\n    std::println(\"\");\n}", why: "冒号后是宽度与对齐：左对齐占 10 格，几行标签才站齐。" },
        { id: "q5", type: "code", score: 20, coversTask: 2, stem: "任务第 2 条：掐出第 4 到第 6 个 —— 先接 drop 扔掉三个，再接 take 只要三个。", acceptRegex: ["\\|\\s*std::views::drop\\s*\\(\\s*3\\s*\\)\\s*\\|\\s*std::views::take\\s*\\(\\s*3\\s*\\)"], acceptOn: "code", sample: "nums | std::views::drop(3) | std::views::take(3)", why: "drop 数的是扔掉几个而不是第几个：写 4 会从第 5 个开始，整个窗口往后挪一格。" },
        { id: "q6", type: "code", score: 15, stem: "把这份程序写成能跑的形：视图那一族的头请进来（#include <ranges>），打印工具箱也请进来，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*ranges\\s*>", "#\\s*include\\s*<\\s*print\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n#include <ranges>\n\nint main() {", why: "只包 vector 和 print 拿不到 std::views，报错通常长成 std 里没有 views 这个成员。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <ranges>\n#include <string>\n#include <vector>\n\nvoid show(std::string label, auto view) {\n    std::print(\"{:<10}\", label);\n    for (int v : view) std::print(\"{} \", v);\n    std::println(\"\");\n}\n\nint main() {\n    std::vector<int> nums = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};\n    show(\"take(3):\", nums | std::views::take(3));\n    show(\"reverse:\", nums | std::views::reverse);\n    show(\"前三再倒过来:\", nums | std::views::take(3) | std::views::reverse);   // 3 2 1\n    show(\"第 4 到 6:\", nums | std::views::drop(3) | std::views::take(3));     // 4 5 6\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <ranges>\n#include <vector>\n\nint main() {\n    std::vector<int> nums = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};\n    for (int v : nums | std::views::reverse) std::print(\"{} \", v);\n    std::println(\"\");\n    return 0;\n}\n",
          "#include <print>\n#include <ranges>\n#include <vector>\n\nint main() {\n    std::vector<int> nums = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};\n    for (int v : nums | std::views::reverse | std::views::take(3)) std::print(\"{} \", v);\n    std::println(\"\");\n    return 0;\n}\n",
          "#include <print>\n#include <ranges>\n#include <vector>\n\nint main() {\n    std::vector<int> nums = {1, 2, 3, 4, 5};\n    std::println(\"{}\", nums[0]);\n    for (int v : nums | std::views::drop(4) | std::views::take(3)) std::print(\"{} \", v);\n    return 0;\n}\n"],
        loose: [
          "# include < vector >\n# include < ranges >\n# include < print >\n# include < string >\n\nvoid  show ( std::string  name , auto  win )\n{\n    std::print( \"{:<10}\", name );\n    for (int  one : win) std::print( \"{} \", one );\n    std::println(\"\");\n}\n\nint  main ( )\n{\n    std::vector< int >  data = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};\n    show( \"前三再倒过来:\", data | std::views::take ( 3 ) | std::views::reverse ) ;\n    show( \"中间一段:\", data | std::views::drop( 3 ) | std::views::take( 3 ) );\n    return 0;\n}\n"]
      }
    },
    {
      cid: "m94", kind: "paper", mode: "ide", authored: "5e333254", file: "main.cpp", pass: 60, title: "第 94 课考试 · iota 与惰性求值", task: "任务题目：把无限流里的加工机换成立方并取前 5 个，写出输出；再说清如果视图不惰性，那条无限流管道会怎样", hint: "想不起来就回看本课【演示 2 · 无限流配 take】与【演示 3 · 给数数机装个喇叭】。",
      notes: ["std::views::iota(1, 6) 是半开口径：右端写的是数到哪儿停，6 取不到，打出来是 1 2 3 4 5；想含 6 就写 iota(1, 7)。", "建立视图只是登记做法：写下 iota 接 transform 接 take 的那一刻什么都没造，只记下怎么给下一个、怎么换算、要几个。", "提示句先出来，证明建视图时一个都没造；四个标记和四个平方交替出现，而且刚好四个。", "同一个 iota 视图遍历两遍，数数机会从头再数两遍；它不消耗数据，也不留下一份结果。", "右端的 take(5) 不是把已经造好的结果裁短：造多少由被要多少次决定，没被要的那部分压根没存在过。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "凭空起一条没有终点的流：只给一个起点的 std::views::iota，并把视图那一族的头请进来（#include <ranges>）。", acceptRegex: ["std::views::iota\\s*\\(\\s*1\\s*\\)", "#\\s*include\\s*<\\s*ranges\\s*>"], acceptOn: "code", sample: "std::views::iota(1)                       // 无限流 1 2 3 …", why: "只给一个参数的 iota 表示没有终点：它保证能被一位一位要下去，但不保证有长度可问，也不保证能下标随机取。" },
        { id: "q2", type: "code", score: 25, coversTask: 1, stem: "任务第 1 条那一改：加工机把这个数连乘自己两次，return 它的立方。", acceptRegex: ["return\\s+(\\w+)\\s*\\*\\s*\\1\\s*\\*\\s*\\1\\s*;"], acceptOn: "code", sample: "[](int n) { return n * n * n; }", why: "同一个名字连写三次才是立方；写 n * n 是平方，头五个会变成 1 4 9 16 25。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "给无限流踩一脚刹车：管道末尾再续一段 std::views::take，只要前 5 个。", acceptRegex: ["\\|\\s*std::views::take\\s*\\(\\s*5\\s*\\)"], acceptOn: "code", sample: "| std::views::take(5);", why: "take 决定上游最多被要五次，第六个数从未被造出来 —— 惰性才让它成为刹车而不是剪刀。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "把整条流交给一只 auto 变量，再用 range-for 走它，每个数用 std::print 打出来。", acceptRegex: ["auto\\s+\\w+\\s*=", "for\\s*\\(\\s*int\\s+\\w+\\s*:\\s*\\w+\\s*\\)", "std::print\\s*\\("], acceptOn: "code", sample: "auto cube = std::views::iota(1) | std::views::transform([](int n) { return n * n * n; }) | std::views::take(5);\nfor (int v : cube) std::print(\"{} \", v);", why: "整条管道写好的那一刻一个字都没打印、一个数都没造，只登记下做法；for 来要的那一刻才现算。" },
        { id: "q5", type: "code", score: 15, coversTask: 2, stem: "任务第 2 条那双眼睛：在加工机的花括号里，return 之前先 std::print 一句标记，看清这个数是被谁要出来的。", acceptRegex: ["std::views::transform\\s*\\(\\s*\\[[^\\]]*\\]\\s*\\([^)]*\\)\\s*\\{\\s*std::print"], acceptOn: "code", sample: "std::views::transform([](int n) { std::print(\"[造 {}]\", n); return n * n; })", why: "标记只在 for 圈真来要的时候才打印：造几个打几个，take 说要四个就只打四行标记。" },
        { id: "q6", type: "code", score: 15, coversTask: 2, stem: "用一行注释回答任务第 2 条：要是视图不惰性，接上管道就立刻把全部结果算好存起来，那段无限流会怎样。", acceptRegex: ["//[^\\n]*(惰性|走不完|造完|算完|终点|刹车|剪刀)"], acceptOn: "buffer", sample: "// 不惰性就根本走不完：建立视图那一刻得数完一个没有终点的序列，take 退化成先造完再剪短", why: "这一条为什么这么出：正则只能验注释里点到了这些说法，推得对不对得人来读，判不严格。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <ranges>\n\nint main() {\n    auto cube = std::views::iota(1)\n              | std::views::transform([](int n) { std::print(\"[造 {}]\", n); return n * n * n; })\n              | std::views::take(5);\n    std::println(\"视图建好了，上面一个字都没打印\");\n    for (int v : cube) std::print(\"{} \", v);\n    std::println(\"\");\n    // 不惰性就根本走不完：建立视图那一刻得数完一个没有终点的序列，take 退化成先造完再剪短\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <ranges>\n\nint main() {\n    auto sq = std::views::iota(1, 6)\n            | std::views::transform([](int n) { return n * n; })\n            | std::views::take(5);\n    for (int v : sq) std::print(\"{} \", v);\n    return 0;\n}\n",
          "#include <print>\n#include <ranges>\n\nint main() {\n    for (int v : std::views::iota(1) | std::views::transform([](int n) { return n * n * n; })) std::print(\"{} \", v);\n    return 0;\n}\n",
          "#include <print>\n#include <ranges>\n\nint main() {\n    auto noisy = std::views::iota(1) | std::views::transform([](int n) { std::print(\"[造 {}]\", n); return n + n; });\n    std::println(\"建好了\");\n    for (int v : noisy) std::print(\"{} \", v);\n    return 0;\n}\n"],
        loose: [
          "# include <ranges>\n# include < print >\n\nint  main ( )\n{\n    auto  third = std::views::iota ( 1 )\n        | std::views::transform ( []( int  k ) { std::print( \"造 {}\", k ); return  k * k * k ; } )\n        | std::views::take ( 5 ) ;\n    std::println( \"视图建好，上面还没打印任何东西\" );\n    for (int  one : third) std::print(\"{} \", one);\n    // 不惰性的话这一段根本走不完：上游是一条没有终点的流，take 就成了剪刀而不是刹车\n    return 0;\n}\n"]
      }
    },
    {
      cid: "m95", kind: "paper", mode: "ide", authored: "e8753542", file: "main.cpp", pass: 60, title: "第 95 课考试 · 学生数据管道", task: "任务题目：用一条 filter 加 transform 的水管取出不及格学生的名字；再用 std::ranges::count_if 统计 90 分以上有几人", hint: "想不起来就回看本课【演示 2 · 反着挑：不及格的名字】与【演示 3 · 数人头交给 count_if】。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 26, coversTask: 2, stem: "（任务题）写出这条视图：从 stu 出发，先挑不及格的（分数低于 60），再把人换成名字。可以挂到 auto 变量上，参数名随意。", acceptRegex: ["filter", "score\\s*<\\s*60", "transform", "name"], acceptOn: "code", sample: "auto fail = stu | std::views::filter([](const Student& s) { return s.score < 60; }) | std::views::transform([](const Student& s) { return s.name; });", why: "两段一个都不能少：只 filter 出来的是学生，还得 transform 取 name 才是名字。" },
        { id: "q2", type: "code", score: 26, coversTask: 1, stem: "（任务题）写出统计「90 分以上有几人」那一句：容器是 stu，谓词比较 score 大于 90，结果收到一个 auto 变量里。", acceptRegex: ["count_if", "score", ">\\s*90"], acceptOn: "code", sample: "auto above = std::ranges::count_if(stu, [](const Student& s) { return s.score > 90; });", why: "count_if 收「容器 + 谓词」，回的是个数；结果类型是无符号长度，用 auto 接最稳。" },
        { id: "q3", type: "code", score: 26, coversTask: 1, stem: "（任务题）统计 90 分以上有几人：写一行，用 ranges 版的 count_if 数 stu 这个容器，谓词就地写一把收 const Student& 的 lambda。", acceptRegex: ["ranges\\s*::\\s*count_if\\s*\\(\\s*stu\\s*,", "const\\s+Student\\s*&"], acceptOn: "code", sample: "auto above = std::ranges::count_if(stu, [](const Student& s) { return s.score > 90; });", why: "ranges 版直接收整个容器，不用再递头和尾后；谓词收 const Student&，每要一个学生就少复制一张名片。" },
        { id: "q4", type: "code", score: 22, coversTask: 2, stem: "（任务题）视图 fail 已经接好了（里面流的是不及格同学的名字）。写一句：挨个把名字打印出来。", acceptRegex: ["for\\s*\\(", ":\\s*fail\\s*\\)", "print"], acceptOn: "code", sample: "for (const auto& name : fail) std::print(\"{} \", name);", why: "视图是个看法，for 一圈它才真被算一遍；圈变量按 const 引用收，就不用每要一个名字复制一份 string。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <ranges>\nint main() {\n    auto fail = stu | std::views::filter([](const Student& s) { return s.score < 60; }) | std::views::transform([](const Student& s) { return s.name; });\n    auto above = std::ranges::count_if(stu, [](const Student& s) { return s.score > 90; });\n    auto above = std::ranges::count_if(stu, [](const Student& s) { return s.score > 90; });\n    for (const auto& name : fail) std::print(\"{} \", name);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "stu | std::views::filter([](const Student& s) { return s.score >= 60; }) | std::views::transform([](const Student& s) { return s.score; })",
          "auto above = std::ranges::count(stu, 90);",
          "auto above = std::count_if(stu.begin(), stu.end(), [](const Student& s) { return s.score > 90; });",
          "std::println(\"{}\", fail);"],
        loose: [
          "#include <ranges>\nint main() {\n    auto fail=stu|std::views::filter([](const Student& p){return p.score<60;})|std::views::transform([](const Student& p){return p.name;});\n    auto above = std::ranges::count_if( stu , [](const Student& s){return s.score>90;} );\n    auto above = std :: ranges :: count_if ( stu , [ ] ( const Student & s ) { return s.score > 90; } );\n    for( auto  name : fail )   print(\"{}\", name);\n    return 0;\n}\n"]
      }
    },
    {
      cid: "m96", kind: "paper", mode: "ide", authored: "628aee48", file: "main.cpp", pass: 60, title: "第 96 课考试 · 视图不复制数据", task: "任务题目：写出把视图落地成一份独立容器的写法（C++23 的 std::ranges::to，外加不用它的老写法），并回答原数据被销毁之后窗户还能不能用", hint: "想不起来就回看本课【演示 2 · 想要独立副本，就落地】与【演示 3 · 反例：窗框比房子活得久】。",
      notes: ["视图不持有元素：它不复制，所以又快又省；也正因为它不复制，它跟着原件一起变、跟着原件一起死。", "架好窗户之后写 nums[6] = 100，窗户里那个 7 跟着变成 100 —— 看到的还是 nums，两行之间 tail 一个字没动。", "通过窗户去改元素是办得到的：圈变量写成 int& 再给它赋值，改的就是原件；隔着窗不等于隔着玻璃。", "该落地的三个场合：加工很贵而同一段结果要反复用、要对结果重排（排序是动存储的活）、结果要带到别的作用域去。", "加工完只打印一遍就别落地：想留一份各走各的，才用 std::ranges::to 落地成真容器，那是 C++23 的东西。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "先在原件上架一扇窗：一竖线后面接 std::views 那族里的任意一段（drop、take、filter 都行）。", acceptRegex: ["\\w+\\s*\\|\\s*std::views::(filter|drop|take|reverse)"], acceptOn: "code", sample: "auto even = nums | std::views::filter([](int x) { return x % 2 == 0; });", why: "打印一遍正是视图最擅长的：一次遍历、零拷贝；要留一份各走各的才得落地。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条的答案：把那扇窗落地成真容器 —— 交给 std::ranges::to 后面跟尖括号里的 std::vector，再补一对圆括号，用一只 std::vector<int> 接住。", acceptRegex: ["std::vector\\s*<\\s*int\\s*>\\s+\\w+\\s*=\\s*\\w+\\s*\\|\\s*std::ranges::to\\s*<\\s*std::vector\\s*>\\s*\\(\\s*\\)"], acceptOn: "code", sample: "std::vector<int> keep = even | std::ranges::to<std::vector>();", why: "C++23 这一句把看法变成数据：真复制出一份独立副本，此后改原件动不到它。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "证明副本真的独立：落地之后再改原件某一格（下标赋值），再用 range-for 把副本走一遍打出来。", acceptRegex: ["\\w+\\s*\\[\\s*\\w+\\s*\\]\\s*=\\s*\\d+\\s*;", "for\\s*\\(\\s*int\\s+\\w+\\s*:\\s*\\w+\\s*\\)", "std::print\\s*\\("], acceptOn: "code", sample: "nums[1] = 100;\nfor (int v : keep) std::print(\"{} \", v);", why: "副本不动、原件跟着窗一起变，这两件事摆在一起才看得清谁复制了谁没复制。" },
        { id: "q4", type: "code", score: 15, coversTask: 2, stem: "任务第 2 条的反例：写一个回一份新数据的函数（还 std::vector<int>），再把它的调用结果直接架一扇窗，跑一遍看读的是什么，然后注释掉留在文件里。", acceptRegex: ["std::vector\\s*<\\s*int\\s*>\\s+\\w+\\s*\\(\\s*\\)\\s*\\{[^}]*return", "auto\\s+\\w+\\s*=\\s*\\w+\\s*\\(\\s*\\)\\s*\\|"], acceptOn: "buffer", sample: "std::vector<int> make_nums() { return {1, 2, 3, 4, 5}; }\n// auto view = make_nums() | std::views::take(3);   临时 vector 语句一结束就销毁", why: "窗框比房子活得久：底下的容器早没了，读这扇窗是未定义行为，而且标准库拦不住，因为它不知道底下那份什么时候没。" },
        { id: "q5", type: "code", score: 20, coversTask: 2, stem: "用一行注释回答任务第 2 条：nums 被销毁之后，还留着的那扇窗能不能看。", acceptRegex: ["//[^\\n]*(不能|悬空|未定义|没了|早没|销毁)"], acceptOn: "buffer", sample: "// 不能：窗户的命挂在原数据上，它的寿命必须严格短于原件，读它就是悬空", why: "这一条为什么这么出：正则只验注释里点到了这些说法，答得对不对得人来读，判不严格。" },
        { id: "q6", type: "code", score: 15, stem: "把这份程序写成能跑的形：视图那一族的头和 vector 的头都请进来，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*ranges\\s*>", "#\\s*include\\s*<\\s*vector\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <ranges>\n#include <vector>\n\nint main() {", why: "std::ranges::to 住在 ranges 那一族里，只包 vector 拿不到它。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <ranges>\n#include <vector>\n\nstd::vector<int> make_nums() { return {1, 2, 3, 4, 5}; }    // 回一份新数据\n\nint main() {\n    std::vector<int> nums = {1, 2, 3, 4, 5, 6, 7};\n    auto even = nums | std::views::filter([](int x) { return x % 2 == 0; });\n    std::vector<int> keep = even | std::ranges::to<std::vector>();   // C++23：视图变容器\n    nums[1] = 100;                              // 改原件\n    for (int v : keep) std::print(\"{} \", v);     // 副本不动\n    std::println(\"\");\n    for (int v : even) std::print(\"{} \", v);      // 窗里看到的跟着变\n    std::println(\"\");\n    // auto view = make_nums() | std::views::take(3);   临时 vector 语句一结束就销毁\n    // nums 被销毁之后 tail 不能看：窗户的命挂在原数据上，读它是未定义行为，而且不报错\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <ranges>\n#include <vector>\n\nint main() {\n    std::vector<int> nums = {1, 2, 3, 4, 5, 6, 7};\n    auto tail = nums | std::views::drop(5);\n    for (int v : tail) std::print(\"{} \", v);\n    nums[6] = 100;\n    for (int v : tail) std::print(\"{} \", v);\n    return 0;\n}\n",
          "#include <print>\n#include <ranges>\n#include <vector>\n\nint main() {\n    std::vector<int> nums = {1, 2, 3, 4};\n    auto view = nums | std::views::take(2);\n    std::vector<int> keep = view | std::ranges::to<std::vector>();\n    for (int v : keep) std::print(\"{} \", v);\n    return 0;\n}\n",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> nums = {1, 2, 3, 4};\n    std::vector<int> copy = nums;\n    nums[0] = 100;\n    for (int v : copy) std::print(\"{} \", v);\n    return 0;\n}\n"],
        loose: [
          "# include < ranges >\n# include < vector >\n# include < print >\n\nstd::vector< int >  make_list ( ) { return {1, 2, 3, 4, 5}; }\n\nint  main ( )\n{\n    std::vector<int> data = {1, 2, 3, 4, 5, 6, 7};\n    auto  picked = data | std::views::filter ( []( int  x ) { return x % 2 == 0; } ) ;\n    std::vector< int >  saved = picked | std::ranges::to < std::vector > ( ) ;\n    data [ 5 ] = 200;\n    for (int  one : saved) std::print( \"{} \", one );\n    std::println(\"\");\n    // auto  dangling = make_list() | std::views::take(3);   房子早没了\n    // 原件被销毁之后 tail 不能看：窗框记着的位置已经悬空，读它是未定义行为，编译器拦不住\n    return 0;\n}\n"]
      }
    },
  ]
};
