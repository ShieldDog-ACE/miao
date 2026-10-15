/* 喵站 · C++ 掌握 考卷分部 p09：第 109–112 课
 * 契约照 p07：每场权重和正好 100，源稿每一条【任务】都有题的 coversTask 对着它，
 * refs 判 100、wrongs 判不满 60、loose 判得过 60。output 题的 acceptLines 全部在本机 g++ 实跑核对过。
 * 号段纪律：题面只出现本课及以前讲过的写法，交叉引用一律往回指。
 */
window.MIAO_CPPM_EXAM_P09 = {
  papers: [
    {
      cid: "m109", kind: "paper", mode: "ide", authored: "6ff7a57c", file: "main.cpp", pass: 60, title: "第 109 课考试 · 集合运算：交集、并集、差集", task: "任务题目：用 set_difference 求 a 减 b 的差集，先预测输出再验证（1 2 3 4 5 减掉 3 4 5 6 7 该剩 1 2）；再拿本课那份乱序名单说清楚这套算法为什么把「输入已排序」当前置条件、失效之后程序为什么不报错", hint: "想不起来就回看本课【演示 2 · 差集与对称差集】与【演示 3 · 故意不给有序名单，看它怎么骗你】。",
      notes: ["std::set_intersection、std::set_union、std::set_difference 是住在 algorithm 里的自由算法，收两对迭代器表示的区间，结果写进第三个容器，跟 std::set 那个容器只是撞名。", "输出位置一般写 std::back_inserter，等于每产生一个值就替你 push_back 一次；递空容器的 begin 去接是越界。", "乱序时少掉的是被误杀的元素，不是顺序：i 停在 3、j 停在 4，3 被当场判死，而 b 的尾巴里还躺着一个 3 没读到。", "名单里有重复项时，交集按两边出现次数取小的那个收，不是有就算。", "要算 b 减 a，靠的是交换两对区间的先后，跟输出位置无关；拿名单自己的 begin 去接结果还会把它写脏。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "把这份程序写成能跑的形：把算法工具箱（#include <algorithm>）和插口工具箱（#include <iterator>）都搬进来，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*algorithm\\s*>", "#\\s*include\\s*<\\s*iterator\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <algorithm>\n#include <iterator>\n\nint main() {", why: "这三样运算是 algorithm 里的自由算法，back_inserter 住在 iterator 里，缺一个都编译不过。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：备好两份已经排好序的名单（装 int 的 vector，初值从小到大），再开一个空的装 int 的 vector 专门接结果。", acceptRegex: ["vector\\s*<\\s*int\\s*>\\s+\\w+\\s*=\\s*\\{[^{}]*\\}", "vector\\s*<\\s*int\\s*>\\s+\\w+\\s*(?:;|=\\s*\\{\\s*\\})"], acceptOn: "code", sample: "std::vector<int> a = {1, 2, 3, 4, 5}, b = {3, 4, 5, 6, 7};\nstd::vector<int> diff;", why: "算法落下第一个结果之前不知道会有几个，所以接结果的容器先是空的，靠输出位置自己长大。" },
        { id: "q3", type: "code", score: 25, coversTask: 1, stem: "任务第 1 条：算 a 减 b —— 调 std::set_difference，两对区间按顺序给全，输出位置写 std::back_inserter 交给那个空容器。", acceptRegex: ["set_difference\\s*\\(", "back_inserter\\s*\\(\\s*\\w+\\s*\\)", "\\.begin\\s*\\(\\s*\\)\\s*,\\s*\\w+\\.end\\s*\\(\\s*\\)\\s*,\\s*\\w+\\.begin\\s*\\(\\s*\\)\\s*,\\s*\\w+\\.end\\s*\\(\\s*\\)"], acceptOn: "code", sample: "std::set_difference(a.begin(), a.end(), b.begin(), b.end(), std::back_inserter(diff));", why: "形状就是 a 的区间、b 的区间、结果请追加到尾巴；直接递 diff.begin() 是照着一段长度为 0 的区间往外写，属于越界。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：用一条 for 把算出的差集逐个打出来，再用一条 println 收尾（预测先写在心里，跑完对一遍）。", acceptRegex: ["for\\s*\\(\\s*int\\s+\\w+\\s*:\\s*\\w+\\s*\\)", "std\\s*::\\s*print"], acceptOn: "code", sample: "for (int v : diff) std::print(\"{} \", v);\nstd::println(\"← a 减 b\");", why: "差集只收 a 这边落单的那几个：1 2 3 4 5 减 3 4 5 6 7 就剩 1 和 2。" },
        { id: "q5", type: "code", score: 15, coversTask: 2, stem: "任务第 2 条：动手试一次乱序现场 —— 另开两份故意没排序的名单，把 std::set_intersection 的结果也写进一个空容器并打出来。", acceptRegex: ["set_intersection\\s*\\(", "back_inserter\\s*\\(\\s*\\w+\\s*\\)", "\\bfor\\s*\\("], acceptOn: "code", sample: "std::vector<int> p = {3, 1, 5, 2, 4}, q = {4, 5, 1, 7, 3};\nstd::vector<int> inter;\nstd::set_intersection(p.begin(), p.end(), q.begin(), q.end(), std::back_inserter(inter));\nfor (int v : inter) std::println(\"{}\", v);", why: "这一步要的是你亲眼看见：编译和运行都没意见，答案却少了好几个元素。" },
        { id: "q6", type: "code", score: 15, coversTask: 2, stem: "任务第 2 条：用一行注释写清为什么这两个算法要求输入已排序（至少四个字，正则只验你写了注释，验不了内容）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 双指针靠「对面剩下的只会更大」才敢当场判掉较小那格，乱序时这个推断失效，元素被误杀", why: "这是这块编辑器判不动的部分：结论得你自己跑出来对照 —— 先 sort，或者改用天生有序的 set。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <algorithm>\n#include <iterator>\n#include <vector>\n\nint main() {\n    std::vector<int> a = {1, 2, 3, 4, 5}, b = {3, 4, 5, 6, 7};\n    std::vector<int> diff;\n    std::set_difference(a.begin(), a.end(), b.begin(), b.end(), std::back_inserter(diff));\n    for (int v : diff) std::print(\"{} \", v);\n    std::println(\"← a 减 b\");\n    std::vector<int> p = {3, 1, 5, 2, 4}, q = {4, 5, 1, 7, 3};\n    std::vector<int> inter;\n    std::set_intersection(p.begin(), p.end(), q.begin(), q.end(), std::back_inserter(inter));\n    for (int v : inter) std::println(\"{}\", v);\n    // 不排序时双指针敢把 3 当场判死，对面尾巴里那个 3 就没读到\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> a = {5, 3, 1}, b = {4, 2};\n    std::vector<int> inter;\n    std::set_intersection(a.begin(), a.end(), b.begin(), b.end(), inter.begin());\n    return 0;\n}\n",
          "#include <print>\n#include <algorithm>\n#include <iterator>\n#include <set>\n\nint main() {\n    std::set<int> a = {1, 2, 3}, b = {3, 4};\n    for (int v : a) if (!b.contains(v)) std::print(\"{} \", v);\n    std::println(\"\");\n    return 0;\n}\n"],
        loose: [
          "#  include < print >\n#  include < algorithm >\n#  include < iterator >\n#  include < vector >\n\nint  main ( )\n{\n  std :: vector < int >  left = { 1 , 2 , 3 , 4 } , right = { 3 , 4 , 5 } ;\n  std::vector<int> out;\n  std::set_difference(left.begin(), left.end(), right.begin(), right.end(), std::back_inserter(out));\n  for (int v : out) std::print(\"{} \", v);\n  std::println(\"← 差集\");\n  std::vector<int> x = {2, 1, 4}, y = {4, 2, 9};\n  std::vector<int> mix = { };\n  std::set_intersection(x.begin(), x.end(), y.begin(), y.end(), std::back_inserter(mix));\n  for (auto v : mix) std::println(\"{}\", v);\n  // 乱序时它提前把公共元素判死，结果少了人\n  return 0;\n}\n"]
      }
    },
    {
      cid: "m110", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 110 课考试 · 下一个排列：枚举全排列", task: "任务题目：把起点换成 1 2 3 4，数出一共几个排列、屏幕上最后两行长什么样；再把起点改成 3 2 1，用那句「跑了 1 轮」解释清楚为什么只打印一行、圈结束时数组为什么变成了 1 2 3", hint: "想不起来就回看本课【演示 2 · 数一数四个数有几个排列】与【演示 3 · 起点换成 3 2 1，翻车现场】。",
      notes: ["起点本身就是一个合法排列，得先处理它再问能不能变：写成 while 会先叫一次 next_permutation，把最小的那个排列跳过去。", "按字典序，1 2 3 的下一个排列是 1 3 2：从左往右第一个不同的位置决定谁在前，永远是最右边的两位先换。", "变不出下一个时它返回 false，并顺手把区间重排回最小，所以 3 2 1 起跑只打一行，收尾却是 1 2 3。", "四个位置依次有 4、3、2、1 种选法，一共 24 个排列；字典序的最大者就是从大到小那一个。", "它内部三步走：从右往左找第一个上升点，在右边的降尾里挑刚好比它大的一位交换，再把那段尾巴倒成升序。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "把这份程序写成能跑的形：把排列工具箱（#include <algorithm>）搬进来，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*algorithm\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <algorithm>\n\nint main() {", why: "next_permutation 住在 algorithm 里；没有 main，链接器找不到入口。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：起点必须是最小的那个排列 —— 开一个装 int 的 vector，初值正好是 1 2 3 4 按从小到大写。", acceptRegex: ["vector\\s*<\\s*int\\s*>\\s+\\w+\\s*=\\s*\\{\\s*1\\s*,\\s*2\\s*,\\s*3\\s*,\\s*4\\s*\\}"], acceptOn: "code", sample: "std::vector<int> a = {1, 2, 3, 4};", why: "从最小排列起步才谈得上不重不漏：起点是 3 2 1 时它已经是字典序最大者，一步都变不出去。" },
        { id: "q3", type: "code", score: 25, coversTask: 1, stem: "任务第 1 条：用 do 先进圈、再用 while 问能不能变 —— 圈里用一条 for 把当前排列打出来，while 的条件位上写 std::next_permutation，区间给 begin 与 end。", acceptRegex: ["do\\s*\\{", "while\\s*\\([^;]{0,40}next_permutation\\s*\\(\\s*\\w+\\.begin\\s*\\(\\s*\\)\\s*,\\s*\\w+\\.end\\s*\\(\\s*\\)", "for\\s*\\(\\s*int\\s+\\w+\\s*:\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "do {\n    for (int v : a) std::print(\"{} \", v);\n    std::println(\"\");\n} while (std::next_permutation(a.begin(), a.end()));", why: "顺序不能倒：写成 while 会先叫一次 next_permutation，最小的那个排列就被跳过去了，六个变五个、二十四个变二十三个。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：数数一共几个 —— 备一个从 0 起步的 int 计数器，每轮先加一，退出圈以后用一条 println 把总数打出来。", acceptRegex: ["int\\s+\\w+\\s*=\\s*0\\s*;", "\\+\\+\\s*\\w+\\s*;", "std\\s*::\\s*println\\s*\\("], acceptOn: "code", sample: "int n = 0;\n++n;\nstd::println(\"一共 {} 个排列\", n);", why: "拿计数器代替手点数屏幕；四个位置依次有 4、3、2、1 种选法，乘法原理给的正是 24。" },
        { id: "q5", type: "code", score: 15, coversTask: 2, stem: "任务第 2 条：另开一个初值是 3 2 1 的 vector，照同样的 do-while 再跑一次，看它还能不能枚举全排列。", acceptRegex: ["vector\\s*<\\s*int\\s*>\\s+\\w+\\s*=\\s*\\{\\s*3\\s*,\\s*2\\s*,\\s*1\\s*\\}", "next_permutation\\s*\\("], acceptOn: "code", sample: "std::vector<int> b = {3, 2, 1};\nint m = 0;\ndo { ++m; for (int v : b) std::print(\"{} \", v); std::println(\"\"); }\nwhile (std::next_permutation(b.begin(), b.end()));", why: "这一步要的是你亲手跑一次：它变不出下一个，返回 false 并顺手把区间重排回最小。" },
        { id: "q6", type: "code", score: 15, coversTask: 2, stem: "任务第 2 条：用一行注释写下你看到的情况 —— 打出来几行、收尾时那个 vector 变成了什么（至少四个字）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 只打了 3 2 1 一行，收尾时 b 却是 1 2 3", why: "正则只能验你写了观察记录，内容判不了；这一处的反直觉要靠你自己看见。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> a = {1, 2, 3, 4};\n    int n = 0;\n    do {\n        ++n;\n        for (int v : a) std::print(\"{} \", v);\n        std::println(\"\");\n    } while (std::next_permutation(a.begin(), a.end()));\n    std::println(\"一共 {} 个排列\", n);\n    std::vector<int> b = {3, 2, 1};\n    int m = 0;\n    do {\n        ++m;\n        for (int v : b) std::print(\"{} \", v);\n        std::println(\"\");\n    } while (std::next_permutation(b.begin(), b.end()));\n    std::println(\"跑了 {} 轮\", m);\n    // 只打了一行 3 2 1，收尾时 b 被重排回 1 2 3\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> a = {1, 2, 3, 4};\n    while (std::next_permutation(a.begin(), a.end())) {\n        for (int v : a) std::print(\"{} \", v);\n        std::println(\"\");\n    }\n    return 0;\n}\n",
          "#include <print>\n#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> a = {1, 2, 3, 4};\n    std::sort(a.begin(), a.end());\n    for (int v : a) std::print(\"{} \", v);\n    std::println(\"\");\n    return 0;\n}\n"],
        loose: [
          "#  include < algorithm >\n#  include < print >\n#  include < vector >\n\nint  main ( )\n{\n  std :: vector < int >  arr = { 1 , 2 , 3 , 4 } ;\n  int  count = 0 ;\n  do {\n      ++ count ;\n      for ( int v : arr ) std::print(\"{} \", v);\n      std::println(\"\");\n  } while ( std :: next_permutation ( arr.begin ( ) , arr.end ( ) ) ) ;\n  std::println(\"一共 {} 个\", count);\n  std::vector<int> back = {3, 2, 1};\n  int round = 0;\n  do {\n      ++round;\n      for (int v : back) std::print(\"{} \", v);\n      std::println(\"\");\n  } while (std::next_permutation(back.begin(), back.end()));\n  // 这一趟只打了一行，收尾却是升序\n  return 0;\n}\n"]
      }
    },
    {
      cid: "m111", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 111 课考试 · 数值算法与前缀和", task: "任务题目：把 1 2 3 4 5 那张前缀和表整个打印出来，说清每一格存的是什么；再只许用一次减法求出「第 3 到第 5 个元素的和」", hint: "想不起来就回看本课【演示 2 · 把整张表摊开看】与【演示 3 · 一次减法对老老实实加一遍】。",
      notes: ["整张前缀和表只有一种读法：下标 i 那格是前 i 个数加完的结果；表有 n+1 格，最后一格等于全部数的总和。", "partial_sum 从 pre.begin() + 1 起往外写 n 个结果，所以表必须比元素多开一格。", "通用式：第 l 到第 r 个等于 pre[r] 减 pre[l-1]，下标比第几个多 1，别记混。", "先花一遍加法建表、之后每次查询只做一次减法 —— 这笔买卖在查很多次时才划算。", "std::gcd 靠辗转相除：能同时整除两个数就能整除它们的差，换成除数与余数这一对时公因子集合一个没变。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "把这份程序写成能跑的形：把数值工具箱（#include <numeric>）搬进来，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*numeric\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <numeric>\n\nint main() {", why: "partial_sum、gcd、lcm 都住在 numeric 里；没有 main，链接器找不到入口。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：先把表建起来 —— 开一个装 int 的 vector 当 pre，长度给元素个数加一（a.size() + 1）、初值 0，再用 std::partial_sum 从 pre.begin() + 1 起往外写。", acceptRegex: ["vector\\s*<\\s*int\\s*>\\s+\\w+\\s*\\(\\s*\\w+\\.size\\s*\\(\\s*\\)\\s*\\+\\s*1\\s*,\\s*0\\s*\\)", "partial_sum\\s*\\(", "begin\\s*\\(\\s*\\)\\s*\\+\\s*1\\s*\\)"], acceptOn: "code", sample: "std::vector<int> pre(a.size() + 1, 0);\nstd::partial_sum(a.begin(), a.end(), pre.begin() + 1);", why: "第 0 格留给哨兵，代表一个数都没加；表只开 n 格就是越界写，程序可能照跑，然后崩在一脸无辜的地方。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：把整张表摊开打印一遍 —— 用一条按下标走的 for，条件比到 pre.size()，圈里用 print 把每格打出来。", acceptRegex: ["for\\s*\\(\\s*(size_t|int)\\s+\\w+\\s*=", "\\.size\\s*\\(\\s*\\)", "std\\s*::\\s*print"], acceptOn: "code", sample: "for (size_t i = 0; i < pre.size(); ++i) std::print(\"pre[{}]={} \", i, pre[i]);", why: "一格一格数是 0、1、1加2、1加2加3……最后一格恰好等于全部数的总和，两个不一样就是偏移写错了。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：在旁边用一行注释说说每个位置存的是什么（至少四个字，正则只验你写了注释，验不了内容）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// pre[i] 存的是前 i 个数加完的结果，第 0 格是 0", why: "这一档只能确认你把读表口径写下来了；判分器读不懂注释内容，说法对不对要看你自己写的。" },
        { id: "q5", type: "code", score: 30, coversTask: 2, stem: "任务第 2 条：只许用一次减法求第 3 到第 5 个元素的和 —— 用一条 println 把 pre[5] 减 pre[2] 那个式子和结果一起打出来。", acceptRegex: ["std\\s*::\\s*println\\s*\\(", "\\w+\\s*\\[\\s*5\\s*\\]\\s*-\\s*\\w+\\s*\\[\\s*2\\s*\\]"], acceptOn: "code", sample: "std::println(\"第 3~5 个的和 = {} - {} = {}\", pre[5], pre[2], pre[5] - pre[2]);", why: "下标比第几个多 1：第 l 到第 r 个等于 pre[r] 减 pre[l-1]；要铲掉的头一段是前 2 个，写成 pre[3] 就连第 3 个一起铲掉了。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <numeric>\n#include <vector>\n\nint main() {\n    std::vector<int> a = {1, 2, 3, 4, 5};\n    std::vector<int> pre(a.size() + 1, 0);\n    std::partial_sum(a.begin(), a.end(), pre.begin() + 1);\n    for (size_t i = 0; i < pre.size(); ++i) std::print(\"pre[{}]={} \", i, pre[i]);\n    std::println(\"\");\n    std::println(\"第 3~5 个：{} - {} = {}\", pre[5], pre[2], pre[5] - pre[2]);\n    // pre[i] 存的是前 i 个数加完的结果，第 0 格是 0 那个哨兵\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <numeric>\n#include <vector>\n\nint main() {\n    std::vector<int> a = {1, 2, 3, 4, 5};\n    std::vector<int> pre(a.size(), 0);\n    std::partial_sum(a.begin(), a.end(), pre.begin());\n    std::println(\"{}\", pre[4]);\n    return 0;\n}\n",
          "#include <print>\n#include <numeric>\n#include <vector>\n\nint main() {\n    std::vector<int> a = {1, 2, 3, 4, 5};\n    int sum = 0;\n    for (int i = 2; i < 5; ++i) sum += a[i];\n    std::println(\"{}\", sum);\n    return 0;\n}\n"],
        loose: [
          "#  include < numeric >\n#  include < print >\n#  include < vector >\n\nint  main ( )\n{\n  std :: vector < int >  data = { 4 , 6 , 2 , 1 , 8 } ;\n  std::vector<int> ps(data.size() + 1, 0);\n  std::partial_sum(data.begin(), data.end(), ps.begin() + 1);\n  for (int k = 0; k < ps.size(); ++k) std::print(\"ps[{}]={} \", k, ps[k]);\n  std::println(\"\");\n  std::println(\"3 到 5 {} - {} = {}\", ps[5], ps[2], ps[5] - ps[2]);\n  // 第 k 格就是前 k 个数加起来的和\n  return 0;\n}\n"]
      }
    },
    {
      cid: "m112", kind: "paper", mode: "ide", authored: "9642a3b6", file: "main.cpp", pass: 60, title: "第 112 课考试 · 类的骨架：private 是零件，public 是按钮", task: "任务题目：把 private 改成 public，在 main 里直接写 s.done_ = 9999，看编译能不能过，并说清哪种写法更安全、按钮为什么比注释靠得住；再给类补一个只读按钮 left()，用 add(999) 验证进度被夹在满分上", hint: "想不起来就回看本课【演示 2 · 伸手进箱子，看编译器怎么拦】与【演示 3 · 把规矩写进按钮，两台机器互不干扰】。",
      notes: ["类定义本身是一条语句：右花括号后面必须跟一个分号；函数定义不要分号、类定义要分号，这两件事正好相反。", "按钮是唯一的改值入口，规矩只要写在一处就永远成立；一旦绕过按钮，这台机器之后给出的每个数字都不再可信。", "private 不是防坏人，是防自己：它把不许这样写进编译期，而不是写在注释里求人别碰。", "int done() const 名字后面那个 const 承诺这个按钮只让看、不让改。", "类是图纸，对象是照图纸造出来的机器：两台机器各有一套 done_ 和 total_，互不干扰。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "把这份程序写成能跑的形：把打印工具箱（#include <print>）搬进来，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n\nint main() {", why: "类定义要放在 main 外面；没有 main，链接器找不到入口。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：开一个类 —— class 起头，public 段和 private 段都要有，右花括号后面补上那个不是装饰的分号。", acceptRegex: ["class\\s+\\w+", "public\\s*:", "private\\s*:", "\\}\\s*;"], acceptOn: "code", sample: "class Score {\npublic:\nprivate:\n    int done_ = 0;\n};", why: "类定义本身是一条语句，漏了分号会报 expected ';' after class definition 这一类话；函数定义不要分号，这两件事正好相反。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：在 public 段里开出两个按钮 —— 一个收 int 的 void 函数负责改值，一个名字后面带 const 的 int 函数只让看。", acceptRegex: ["void\\s+\\w+\\s*\\(\\s*int\\s+\\w+\\s*\\)", "int\\s+\\w+\\s*\\(\\s*\\)\\s*const"], acceptOn: "code", sample: "void add(int n) { done_ += n; }\nint done() const { return done_; }", why: "const 承诺这个按钮只让看、不让改；改值只有那一个入口，规矩才只用写在一处。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：在 private 段里锁住数据 —— 至少一个 int 成员在声明处直接给默认值，名字按正文那样以下划线结尾。", acceptRegex: ["int\\s+\\w+_\\s*=\\s*\\d+\\s*;"], acceptOn: "code", sample: "private:\n    int total_ = 100;\n    int done_ = 0;", why: "对象一出生就带着这些值，不用另写构造的活；零件藏在 private 里，外面只能通过按钮碰。" },
        { id: "q5", type: "code", score: 25, coversTask: 1, stem: "任务第 1 条：造一个这个类的对象，先按一次按钮，再绕过按钮直接把那个带下划线的私有成员写成 9999 —— 这一行就是要编译不过。", acceptRegex: ["\\w+\\s+\\w+\\s*;", "\\.\\w+_\\s*=\\s*9999\\s*;"], acceptOn: "code", sample: "Score s;\ns.add(30);\ns.done_ = 9999;", why: "把 private 改成 public 这一行就过了，但满分才 100 的机器从此每个数字都不再可信 —— 编译器拦下它，正是锁起来要买的东西。" },
        { id: "q6", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：在那一行旁边用注释回答哪种更安全、为什么（至少四个字，正则只验你写了注释，验不了内容）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 编译不过：绕过按钮之后，这台机器之后给出的每个数字都不再可信，锁起来更安全", why: "这一档判不了内容，只能确认你把结论写下来；结论本身要靠你跑那两步试出来。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <string>\n\nclass Score {\npublic:\n    void add(int n) {\n        if (n < 0) return;\n        done_ += n;\n        if (done_ > total_) done_ = total_;\n    }\n    int done() const { return done_; }\n    int left() const { return total_ - done_; }\nprivate:\n    std::string subject_ = \"未命名\";\n    int total_ = 100;\n    int done_ = 0;\n};\n\nint main() {\n    Score s;\n    s.add(30);\n    std::println(\"进度 = {}\", s.done());\n    s.done_ = 9999;   // 编译不过：绕过按钮之后每个数字都不再可信，锁起来更安全\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n\nint total = 100;\nint done = 0;\n\nint main() {\n    done = 9999;\n    std::println(\"{}\", done);\n    return 0;\n}\n",
          "#include <print>\n\nclass Score {\npublic:\n    int total = 100;\n    int done = 0;\n    void add(int n) { done += n; }\n};\n\nint main() {\n    Score s;\n    s.add(30);\n    std::println(\"{}\", s.done);\n    return 0;\n}\n"],
        loose: [
          "#  include < print >\n#  include < string >\n\nclass  Score\n{\n  public :\n      void  bump ( int n ) { done_ += n; }\n      int  read ( )  const { return done_; }\n  private :\n      int cap_ = 100;\n      int done_ = 0;\n};\n\nint  main ( )\n{\n  Score  one ;\n  one.bump(20);\n  std::println(\"进度 {}\", one.read());\n  one.cap_ = 9999;   // 这一步被编译器拦下：锁起来更安全，按钮才是唯一入口\n  return 0;\n}\n"]
      }
    },
  ]
};
