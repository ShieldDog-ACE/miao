/* 喵站 · C++ 掌握 考卷分部 p08：第 105–108 课
 * 契约与前面各场一致：权重和 100、任务逐条 coversTask、带任务的题合计过 50、
 * selftest 里 refs 判 100、wrongs 判不到 60、loose 判过 60。
 * 题干只用读者到第 108 课为止见过的东西。
 */
window.MIAO_CPPM_EXAM_P08 = {
  papers: [
    {
      cid: "m105", kind: "paper", mode: "ide", authored: "70089f1b", file: "main.cpp", pass: 60, title: "第 105 课考试 · sort 与自定义比较器", task: "任务题目：给一张成绩单按分数降序排、同分再按名字升序排；然后把 sort 换成 std::stable_sort，说清同分者的先后有什么变化", hint: "回看本课【演示 3 · 两个关键字排成绩单】和「它被设计成什么样」那两段。",
      notes: ["比较器回答的是「a 该不该排在 b 前面」，不是「a 是不是比 b 大」；读成前者，升序、降序、自定义就全通了。", "两个元素完全相当时，比较器必须两个方向都答 false；用 true 来表达平局会破坏严格弱序，可能乱序甚至越界崩掉。", "a 与 b 平局时，普通 sort 不保证谁先出现；想遍历顺序稳定，就得换 stable_sort。", "stable_sort 一般要多付一份内存或一点时间，它不会把相等的元素合并成一个。", "两把关键字先后有讲究：主键分不出胜负，才轮到次键说话。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "把这份程序写成能跑的形：把排序工具箱（#include <algorithm>）搬进来，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*algorithm\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <algorithm>\n\nint main() {", why: "std::sort 住在 algorithm 里，不包这一行编译器不认识它。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：写一个自定义规则交给 std::sort —— 那个 lambda 收两个 const Student 引用当参数。", acceptRegex: ["sort\\s*\\(", "\\]\\s*\\(", "const\\s+Student\\s*&?\\s*\\w+"], acceptOn: "code", sample: "std::sort(v.begin(), v.end(), [](const Student& a, const Student& b) {", why: "第三个参数就是自定义规则；按 const 引用收两个元素，既不复制也不必怕改坏原件。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：主键先问分数 —— 分数不相等就按分数排，让分数高的那一位排在前面。", acceptRegex: ["\\.score\\s*!=", "\\.score\\s*>"], acceptOn: "code", sample: "if (a.score != b.score) return a.score > b.score;", why: "比较器答的是「a 该不该排在 b 前面」，所以分数降序要用大于号；主键分不出胜负，才轮到次键。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：次键接着问名字 —— 同分的那几个人按名字字典序从小到大，把那句 return 补进来。", acceptRegex: ["\\.name\\s*<"], acceptOn: "code", sample: "return a.name < b.name;", why: "分数打平时两个方向都答 false 就没人保证先后；写上名字这一问，同分的名次才定得下来。" },
        { id: "q5", type: "code", score: 15, coversTask: 2, stem: "任务第 2 条：把排同一张表的那句调用换成 std::stable_sort，区间参数照旧给 begin 与 end。", acceptRegex: ["stable_sort\\s*\\([^;]{0,80}begin\\s*\\(\\s*\\)\\s*,\\s*\\w+\\.end\\s*\\(\\s*\\)"], acceptOn: "code", sample: "std::stable_sort(v.begin(), v.end(), [](const Student& a, const Student& b) {\n    return a.score > b.score;\n});", why: "stable_sort 的调用形状和 sort 一模一样，只是换个函数名 —— 买的是相等绝不互换这个承诺。" },
        { id: "q6", type: "code", score: 15, coversTask: 2, stem: "任务第 2 条：把排完的成绩单一行一条打出来，再在旁边用一行注释写下你观察到同分的那两位先后换没换。", acceptRegex: ["std\\s*::\\s*print", "//[^\\n]{4,}"], acceptOn: "buffer", sample: "for (const Student& s : v) std::println(\"{} {}\", s.name, s.score);\n// 同分的两人排完还是原来的顺序", why: "这一步只能验你写了注释，验不了注释的内容 —— 换序与否要你自己跑出来看：普通 sort 不保证，stable_sort 保证不相换。" }
      ],
      selftest: {
        refs: [
          "#include <algorithm>\n#include <print>\n#include <string>\n#include <vector>\n\nstruct Student {\n    std::string name;\n    int score;\n};\n\nint main() {\n    std::vector<Student> v = {{\"Ann\", 88}, {\"Bob\", 72}, {\"Cid\", 88}, {\"Dot\", 95}};\n    std::sort(v.begin(), v.end(), [](const Student& a, const Student& b) {\n        if (a.score != b.score) return a.score > b.score;\n        return a.name < b.name;\n    });\n    for (const Student& s : v) std::println(\"{} {}\", s.name, s.score);\n    std::stable_sort(v.begin(), v.end(), [](const Student& a, const Student& b) {\n        return a.score > b.score;\n    });\n    std::println(\"stable_sort 之后:\");   // 同分的两位仍然保持原来的先后\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <algorithm>\n#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> nums = {5, 2, 8, 1};\n    std::sort(nums.begin(), nums.end());\n    for (int v : nums) std::print(\"{} \", v);\n    return 0;\n}\n",
          "#include <algorithm>\n#include <print>\n#include <vector>\n#include <string>\n\nint main() {\n    std::vector<Student> v = {{\"Ann\", 88}, {\"Bob\", 72}};\n    std::sort(v.begin(), v.end(), [](const Student& a, const Student& b) {\n        return a.score >= b.score;\n    });\n    for (const Student& s : v) std::println(\"{}\", s.name);\n    return 0;\n}\n"],
        loose: [
          "#  include < algorithm >\n#  include < print >\n#  include < vector >\n#  include < string >\n\nstruct  Student\n{\n  std :: string  name ;\n  int score ;\n} ;\n\nint  main ( )\n{\n  std :: vector < Student >  rows = { { \"Ann\" , 88 } , { \"Cid\" , 88 } , { \"Dot\" , 95 } } ;\n  std :: sort ( rows.begin ( ) , rows.end ( ) , [ ] ( const  Student & x , const Student & y ) {\n      if (x.score != y.score) return x.score > y.score;\n      return x.name < y.name;\n  } );\n  std::stable_sort(rows.begin(), rows.end(), [](const Student& x, const Student& y) {\n      return x.score > y.score;\n  });\n  for (const Student& one : rows) std::println(\"{} {}\", one.name, one.score);\n  // 同分的 Ann 与 Cid 排完仍然没换位置\n  return 0;\n}\n"]
      }
    },
    {
      cid: "m106", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 106 课考试 · lower_bound 与 upper_bound", task: "任务题目：造一个有重复的有序数组，用 upper_bound 减 lower_bound 数出 7 有几个；再验证数组没排序就二分会出什么错", hint: "回看【演示 2 · 数出一共有几个 7】与【演示 3 · 数组没排序会怎样】。",
      notes: ["二分每比一次就敢扔掉一半，靠的是数据已经排好序：看一眼中间那格就能断定另一半没答案，而标准库不报警。", "口诀：lower_bound 含等号找第一个不小于目标的，upper_bound 不含等号找第一个严格大于目标的。", "找不到的答案是一个位置而不是错误码：一个都不满足时它走到 end，解引用之前要先判它等不等于 end。", "数组没排序就二分是逻辑错误不是编译错误，binary_search 可能对确实存在的数返回 false；想二分就必须自己先 sort，或者靠来路保证有序。", "把 std::lower_bound 的位置交给 insert，插完整表仍然有序 —— 位置语义是白送的。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "把这份程序写成能跑的形：把查找工具箱（#include <algorithm>）搬进来，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*algorithm\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <algorithm>\n\nint main() {", why: "lower_bound、upper_bound、binary_search 三兄弟都住在 algorithm 里。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：造一段有序但带重复的数组 —— 用一个装 int 的 vector，初值里让 7 至少出现两次。", acceptRegex: ["vector\\s*<\\s*int\\s*>\\s+\\w+\\s*=\\s*\\{[^{}]*7[^{}]*7[^{}]*\\}"], acceptOn: "code", sample: "std::vector<int> d = {3, 5, 7, 7, 7, 9, 11};", why: "二分的前提是有序：这一列数已经从小到大排好，重复的那几只正好留给两个 bound 去夹。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：对同一个 7 各调一次 std::lower_bound 和 std::upper_bound，区间照旧给 begin 与 end，两个结果各用一个 auto 接住。", acceptRegex: ["lower_bound\\s*\\(", "upper_bound\\s*\\(", "\\.begin\\s*\\(\\s*\\)\\s*,\\s*\\w+\\.end\\s*\\(\\s*\\)"], acceptOn: "code", sample: "auto lo = std::lower_bound(d.begin(), d.end(), 7);\nauto hi = std::upper_bound(d.begin(), d.end(), 7);", why: "lower 含等号，找第一个不小于 7 的；upper 不含等号，找第一个严格大于 7 的 —— 记反了个数就会算错。" },
        { id: "q4", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：用一条 println 把这两个位置相减的结果打出来，那就是 7 的个数。", acceptRegex: ["std\\s*::\\s*println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*-\\s*\\w+"], acceptOn: "code", sample: "std::println(\"7 有 {} 个\", hi - lo);", why: "两个位置之间夹着的正好是那一串 7；减法直接给你个数，下标还白送「比 7 小的有几个」。" },
        { id: "q5", type: "code", score: 15, coversTask: 2, stem: "任务第 2 条：故意再备一段没排序的数组，对里面确实存在的那个数调一次 std::binary_search，并把返回值用一条 println 打出来。", acceptRegex: ["binary_search\\s*\\(", "\\.begin\\s*\\(\\s*\\)\\s*,\\s*\\w+\\.end\\s*\\(\\s*\\)", "std\\s*::\\s*println\\s*\\("], acceptOn: "code", sample: "std::vector<int> u = {5, 2, 8, 1, 9, 3};\nstd::println(\"没排序找 8: {}\", std::binary_search(u.begin(), u.end(), 8));", why: "这一步只能验你真把那次查找写出来了；它安静地给你一个错答案，没有编译错误也没有运行警告。" },
        { id: "q6", type: "code", score: 15, coversTask: 2, stem: "任务第 2 条：在旁边用一行注释写下你看到的结果和原因（至少四个字，正则只验你写了注释，验不了内容）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 8 明明在第 3 格，二分却说没有，因为它砍掉的那一半里正好装着答案", why: "这是这块编辑器判不动的部分：正则只能确认你记下了观察，结论要你自己跑出来对照。" }
      ],
      selftest: {
        refs: [
          "#include <algorithm>\n#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> d = {3, 5, 7, 7, 7, 9, 11};\n    auto lo = std::lower_bound(d.begin(), d.end(), 7);\n    auto hi = std::upper_bound(d.begin(), d.end(), 7);\n    std::println(\"7 有 {} 个\", hi - lo);\n    std::vector<int> u = {5, 2, 8, 1, 9, 3};\n    std::println(\"没排序找 8: {}\", std::binary_search(u.begin(), u.end(), 8));\n    // 8 明明在第 3 格，二分却说没有：它砍掉的那一半里正好装着答案\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <algorithm>\n#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> d = {3, 5, 7, 7, 9};\n    int n = 0;\n    for (int v : d) if (v == 7) n++;\n    std::println(\"{}\", n);\n    return 0;\n}\n",
          "#include <algorithm>\n#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> a = {1, 3, 5, 7, 9, 11};\n    auto lb = std::lower_bound(a.begin(), a.end(), 6);\n    std::println(\"{}\", *lb);\n    return 0;\n}\n"],
        loose: [
          "#  include < algorithm >\n#  include < print >\n#  include < vector >\n\nint  main ( )\n{\n  std :: vector < int >  data = { 2 , 7 , 7 , 7 , 9 } ;\n  auto  first7 = std::lower_bound(data.begin(), data.end(), 7);\n  auto  after7 = std::upper_bound(data.begin(), data.end(), 7);\n  std::println(\"几个 7 {}\", after7 - first7);\n  std::vector<int> mess = {9, 4, 7, 1};\n  std::println(\"找 4 的结果 {}\", std::binary_search(mess.begin(), mess.end(), 4));\n  // 表没排序时它说没有，其实 4 就在第 2 格\n  return 0;\n}\n"]
      }
    },
    {
      cid: "m107", kind: "paper", mode: "ide", authored: "a5776b73", file: "main.cpp", pass: 60, title: "第 107 课考试 · minmax_element、accumulate、count_if", task: "任务题目：用「总和除以 size」求平均分，别让它被整数除法砍掉小数；再查出 accumulate 的第四个参数是什么，拿 std::multiplies<> 连乘一串数", hint: "回看【演示 1 · 求平均分：整除这个坑】与【演示 2 · accumulate 的第四个参数】。",
      notes: ["minmax_element 返回一对位置，最小那格在前、最大那格在后，用 auto [mn, mx] 拆开来正好。", "accumulate 的第三个参数是起点，整条累计链用它那个类型；不写第四个参数就是按加法累加。", "求积就得让起点是 1 —— 起点写 0 时乘什么都还是 0，「第三个参数必须写 0」是 accumulate 最坑人的误会。", "count_if 交出去的谓词是一个元素进去、bool 出来。", "在空的区间上调用 accumulate，返回的就是起点值，所以空表求和天然是 0；空表上的 minmax_element 两个位置都等于 begin。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "把这份程序写成能跑的形：把求和工具箱（#include <numeric>）搬进来，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*numeric\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <numeric>\n\nint main() {", why: "accumulate 名字听着像算法，家却在 numeric；包错了会得到一句 accumulate is not a member of std。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：用 std::accumulate 把一列分数的总和求出来 —— 区间给 begin 与 end，第三个参数（起点）写 0。", acceptRegex: ["std\\s*::\\s*accumulate\\s*\\(", "\\.begin\\s*\\(\\s*\\)\\s*,\\s*\\w+\\.end\\s*\\(\\s*\\)", ",\\s*0\\s*[,)]"], acceptOn: "code", sample: "int sum = std::accumulate(sc.begin(), sc.end(), 0);", why: "起点既是第一次累计的底座，也是空区间唯一合理的答案；它的类型决定整条累计链的类型。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：把总和除以人数得到平均分 —— 用 static_cast<double> 先把总和转成 double 再除以 size，并用一条 println 打出来。", acceptRegex: ["static_cast\\s*<\\s*double\\s*>", "/\\s*\\w+\\.size\\s*\\(\\s*\\)", "std\\s*::\\s*println\\s*\\("], acceptOn: "code", sample: "std::println(\"强转再除 {}\", static_cast<double>(sum) / sc.size());", why: "不转就是整数除整数，小数当场被砍掉；转成 double 之后才是真的 78.8。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：换个办法再做一次 —— 把 accumulate 的起点直接写成 0.0，让整条累计链变成 double。", acceptRegex: ["accumulate\\s*\\([^;]*,\\s*0\\.0\\s*\\)"], acceptOn: "code", sample: "std::println(\"换个起点 {}\", std::accumulate(sc.begin(), sc.end(), 0.0) / sc.size());", why: "起点是 0.0 这一类小数，累计链就顺着它是 double，平均分不再被砍掉小数 —— 跟强转是同一件事的两条路。" },
        { id: "q5", type: "code", score: 20, coversTask: 2, stem: "任务第 2 条：用上 accumulate 的第四个参数 —— 把它写成 std::multiplies<>() 求这一列数的连乘，起点同时要改成 1。", acceptRegex: ["accumulate\\s*\\(", "multiplies\\s*<\\s*>?\\s*\\(", ",\\s*1\\s*,"], acceptOn: "code", sample: "std::println(\"连乘 {}\", std::accumulate(a.begin(), a.end(), 1, std::multiplies<>()));", why: "第四个参数决定每一格怎么并进累计值，不写就是相加；想换成乘，起点必须连着 0 一起换成 1，因为 0 乘任何数都是 0。" },
        { id: "q6", type: "code", score: 15, stem: "顺手把统计也做一遍：用 std::count_if 数一数列里有几个偶数，谓词写成只收一个 int、返回 bool 的 lambda。", acceptRegex: ["count_if\\s*\\(", "\\]\\s*\\(\\s*int\\s+\\w+\\s*\\)"], acceptOn: "code", sample: "std::println(\"偶数 {} 个\", std::count_if(a.begin(), a.end(), [](int v) { return v % 2 == 0; }));", why: "谓词回答的是这一格算不算；两个参数那是 sort 的比较器，写成那样会撞一整屏模板报错。" }
      ],
      selftest: {
        refs: [
          "#include <algorithm>\n#include <numeric>\n#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> sc = {88, 72, 95, 60, 79};\n    int sum = std::accumulate(sc.begin(), sc.end(), 0);\n    std::println(\"总和 {}\", sum);\n    std::println(\"直接除 {}\", sum / sc.size());\n    std::println(\"强转再除 {}\", static_cast<double>(sum) / sc.size());\n    std::println(\"换个起点 {}\", std::accumulate(sc.begin(), sc.end(), 0.0) / sc.size());\n    std::vector<int> a = {5, 2, 8, 1, 9, 3};\n    std::println(\"连乘 {}\", std::accumulate(a.begin(), a.end(), 1, std::multiplies<>()));\n    std::println(\"偶数 {} 个\", std::count_if(a.begin(), a.end(), [](int v) { return v % 2 == 0; }));\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> sc = {88, 72};\n    int sum = 0;\n    for (int v : sc) sum += v;\n    std::println(\"{}\", sum / sc.size());\n    return 0;\n}\n",
          "#include <algorithm>\n#include <numeric>\n#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> sc = {88, 72, 95};\n    int sum = std::accumulate(sc.begin(), sc.end(), 0);\n    std::println(\"{}\", sum / sc.size());\n    return 0;\n}\n"],
        loose: [
          "#  include < numeric >\n#  include < print >\n#  include < vector >\n#  include < algorithm >\n\nint  main ( )\n{\n  std :: vector < int >  marks = { 88 , 72 , 95 , 60 } ;\n  int  total = std :: accumulate ( marks.begin ( ) , marks.end ( ) , 0 ) ;\n  std::println(\"整除 {}\", total / marks.size());\n  std::println(\"平均 {}\", static_cast<double>(total) / marks.size());\n  double by_seed = std::accumulate(marks.begin(), marks.end(), 0.0) / marks.size();\n  std::println(\"起点换成小数 {}\", by_seed);\n  std::vector<int> nums = {2, 3, 4, 5};\n  std::println(\"乘积 {}\", std::accumulate(nums.begin(), nums.end(), 1, std::multiplies<>()));\n  std::println(\"偶数 {}\", std::count_if(nums.begin(), nums.end(), [](int x) { return x % 2 == 0; }));\n}\n"]
      }
    },
    {
      cid: "m108", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 108 课考试 · unique 与 erase 两步走", task: "任务题目：只跑 sort 加 unique、不跑 erase，把全部元素打出来看看尾巴里藏着什么；再动手验证不排序能不能去重，解释为什么", hint: "回看【演示 1 · 不 erase，尾巴里藏着什么】与【演示 2 · 不排序能不能去重】。",
      notes: ["std::unique 只搬不删：它手里只有两个迭代器，改容器大小是容器自己的活，所以下一步要 erase。", "第一步要 sort，因为 unique 只跟相邻的上一格比：相同的必须先成为邻居，中间隔了一个别的数它就看不见。", "unique 改的是容器里的内容，erase 改的是容器的长度；判断有没有真删，就看它有没有变小。", "想要去重又保留第一次出现的先后，得走另一条登记表的路子，不是 sort 加 unique。", "第三个参数可以自定义什么算重复，比如 [](int a, int b) { return a / 10 == b / 10; } 就把十位数相同的当作一家。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "把这份程序写成能跑的形：把去重工具箱（#include <algorithm>）搬进来，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*algorithm\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <algorithm>\n\nint main() {", why: "sort 与 unique 都住在 algorithm 里；没有 main，链接器找不到入口。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：给一列有重复的数先 std::sort，再 std::unique —— 并把 unique 给的边界用一个 auto 接住。", acceptRegex: ["std\\s*::\\s*sort\\s*\\([^;]{0,40}begin\\s*\\(\\s*\\)", "auto\\s+\\w+\\s*=\\s*std\\s*::\\s*unique\\s*\\("], acceptOn: "code", sample: "std::sort(a.begin(), a.end());\nauto last = std::unique(a.begin(), a.end());", why: "sort 让相同的挨在一起，unique 才看得见它们；它把重复的往后搬，返回不重复那一段到哪儿结束。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：这一步先不要 erase —— 用一条 for 把所有元素（含尾巴）全打出来，再用一条 println 把 size 和边界到 begin 的距离打出来。", acceptRegex: ["for\\s*\\(\\s*int\\s+\\w+\\s*:\\s*\\w+\\s*\\)", "std\\s*::\\s*print", "\\.size\\s*\\(\\s*\\)"], acceptOn: "code", sample: "for (int v : a) std::print(\"{} \", v);\nstd::println(\"边界下标 {}，size {}\", last - a.begin(), a.size());", why: "前四格是去重结果，尾巴上的旧值还在；size 一格没少，这就是没真删的现场。" },
        { id: "q4", type: "code", score: 20, coversTask: 2, stem: "任务第 2 条：另开一列没排序的数，跳过 sort 直接对它调 std::unique，再用一条 println 打出它现在的 size。", acceptRegex: ["vector\\s*<\\s*int\\s*>\\s+\\w+\\s*=\\s*\\{[^{}]*\\}", "std\\s*::\\s*unique\\s*\\(\\s*\\w+\\.begin\\s*\\(\\s*\\)", "\\.size\\s*\\(\\s*\\)"], acceptOn: "code", sample: "std::vector<int> b = {3, 1, 3, 2, 1, 5, 2};\nauto last2 = std::unique(b.begin(), b.end());\nstd::println(\"没排序 size {}\", b.size());", why: "没有报错也没有警告：它只跟相邻的上一格比，一对都不挨着时就什么也没发现，安静地返回 end。" },
        { id: "q5", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：在旁边用一行注释写下你看到尾巴里藏着什么（至少四个字）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 尾巴里的 3 3 5 是被搬走的旧值，容器一格没少", why: "这一句只能验你确实写了观察，内容判不了 —— 结论要靠你自己跑出来对照。" },
        { id: "q6", type: "code", score: 15, coversTask: 2, stem: "任务第 2 条：再在第二次尝试旁边用一行注释解释为什么一格都没搬动（至少四个字）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// unique 只认相邻的重复，不排序时一对都不挨着，去重等于没发生", why: "同样是判不了内容的观察档；它盯的是你有没有把第二次尝试的结论记下来。" }
      ],
      selftest: {
        refs: [
          "#include <algorithm>\n#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> a = {3, 1, 3, 2, 1, 5, 2};\n    std::sort(a.begin(), a.end());\n    auto last = std::unique(a.begin(), a.end());\n    for (int v : a) std::print(\"{} \", v);\n    std::println(\"边界下标 {}，size {}\", last - a.begin(), a.size());\n    // 尾巴里的 3 3 5 是被搬走的旧值，size 一格没少\n    std::vector<int> b = {3, 1, 3, 2, 1, 5, 2};\n    auto last2 = std::unique(b.begin(), b.end());\n    for (int v : b) std::print(\"{} \", v);\n    std::println(\"没排序 size {}\", b.size());\n    // 没有一对相同的挨着，一格都没搬动，边界就落在 end\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <algorithm>\n#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> a = {3, 1, 3, 2, 1, 5};\n    std::sort(a.begin(), a.end());\n    a.erase(std::unique(a.begin(), a.end()), a.end());\n    for (int v : a) std::print(\"{} \", v);\n    std::println(\"{}\", a.size());\n    return 0;\n}\n",
          "#include <algorithm>\n#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> v = {1, 1, 2, 2, 3};\n    auto last = std::unique(v.begin(), v.end());\n    v.erase(last, v.end());\n    std::println(\"{}\", v.size());\n    return 0;\n}\n"],
        loose: [
          "#  include < algorithm >\n#  include < print >\n#  include < vector >\n\nint  main ( )\n{\n  std :: vector < int >  names = { 4 , 2 , 4 , 1 , 2 } ;\n  std :: sort ( names.begin ( ) , names.end ( ) ) ;\n  auto  edge = std :: unique ( names.begin ( ) , names.end ( ) ) ;\n  for ( int x : names ) std::print(\"{} \", x);\n  std::println(\"边界 {} size {}\", edge - names.begin(), names.size());\n  // 后头那几格还是被搬走的旧值，长度一点没少\n  std::vector<int> raw = {4, 2, 4, 1, 2};\n  auto edge2 = std::unique(raw.begin(), raw.end());\n  std::println(\"没排序 size {}\", raw.size());\n  // 不排序时它一对都没看见，去重等于没发生\n  return 0;\n}\n"]
      }
    },
  ]
};
