/* 喵站 · C++ 掌握 考卷分部 p04：第 89–92 课（第九轮）
 * 契约与 p02/p03 完全一样：权重和 100、源稿每条任务都有题 coversTask 对着、
 * refs 判 100 / wrongs <60 / loose 必过、每题带 why。
 */
window.MIAO_CPPM_EXAM_P04 = {
  papers: [
    {
      cid: "m89", kind: "paper", mode: "ide", authored: "c23ddeb6", file: "main.cpp", pass: 60, task: "任务题目：把源稿里那两段几乎一样的循环抽成 to_base 函数，再写出反向的 from_base，把 FF 按 16 进制装回 255", hint: "想不起来就回看本课【演示 2 · 抽成 to_base】与【演示 3 · 反着走：from_base】。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 25, coversTask: 1, stem: "（任务题）把重复的拆位循环抽成函数 to_base，参数是 int n 和 int base，返回 std::string。写出函数体里那个圈：每轮把 digits 查到的字符插到 result 最前面，然后让商继续拆下一位。", acceptRegex: ["while\\s*\\(", "n\\s*%\\s*base", "digits\\s*\\[", "result", "n\\s*/=\\s*base"], acceptOn: "code", sample: "std::string to_base(int n, int base) {\n    const std::string digits = \"0123456789ABCDEF\";\n    std::string result;\n    while (n > 0) { result = digits[n % base] + result; n /= base; }\n    return result;\n}", why: "圈守卫 n > 0；插法是 digits[n % base] + result，注意新位在前；最后一句 n /= base 让商降一位。" },
        { id: "q2", type: "code", score: 25, coversTask: 2, stem: "（任务题）写出 from_base 的核心那一句：从左往右扫字符串 s 的每个字符 c，把旧值升一位、再把查表得到的新数字并进个位。", acceptRegex: ["result\\s*\\*\\s*base\\s*\\+", "for\\s*\\("], acceptOn: "code", sample: "int result = 0;\nfor (char c : s) result = result * base + digits.find(c);", why: "result = result * base + 值。乘 base 是把已经读过的位整体左移一格，加号后面那个值是刚查表读出的新个位。" },
        { id: "q3", type: "code", score: 25, coversTask: 1, stem: "（任务题）把重复的两段循环抽成函数：写出 to_base 的函数头 —— 返回 std::string，收一个整数 n 和一个整数 base。", acceptRegex: ["std\\s*::\\s*string\\s+to_base\\s*\\(\\s*int\\s+\\w+\\s*,\\s*int\\s+\\w+\\s*\\)"], acceptOn: "code", sample: "std::string to_base(int n, int base) {", why: "还回来的是一串字符，所以返回值写 std::string；两个整数分别是要拆的数和进位制 —— 数字表是函数的私事，不用调用者递。" },
        { id: "q4", type: "code", score: 25, coversTask: 2, stem: "（任务题）from_base 里把字符 c 换成它的数字值那一步：查表用 digits.find(c)，把查到的值并进 result 的个位（旧值先升一位）。", acceptRegex: ["digits\\s*\\.\\s*find\\s*\\(\\s*c\\s*\\)", "result\\s*\\*\\s*base\\s*\\+"], acceptOn: "code", sample: "for (char c : s) result = result * base + digits.find(c);", why: "digits 那张表里「0123456789ABCDEF」的下标就是数字值，find(c) 报出 c 排在第几格，正好是它代表的数；乘 base 把读过的位整体左移一格，加号后面接上新个位。" }
      ],
      selftest: {
        refs: [
          "#include <string>\nstd::string to_base(int n, int base) {\n    const std::string digits = \"0123456789ABCDEF\";\n    std::string result;\n    while (n > 0) { result = digits[n % base] + result; n /= base; }\n    return result;\n}\nstd::string to_base(int n, int base) {\n}\nint main() {\n    int result = 0;\n    for (char c : s) result = result * base + digits.find(c);\n    for (char c : s) result = result * base + digits.find(c);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "void to_base(int n, int base) {\n    for (int i = 0; i < n; ++i) result += digits[n / base];\n}",
          "result = result + base * digits[c];",
          "void to_base(int n, int base) {",
          "for (char c : s) result = result + base * c;"],
        loose: [
          "#include <string>\nstd::string  to_base(int n,int base){\n  std::string result; const std::string digits=\"0123456789ABCDEF\";\n  while(n>0){ result = digits[n%base] + result ;  n/=base ; }\n  return result; }\nstd :: string   to_base ( int   n , int   base ) {\n}\nint main() {\n    for (char c : s)\n    result  =  result * base  +  digits.find(c);\n    for (char c : s) result  =  result*base + digits . find ( c ) ;\n    return 0;\n}\n"]
      }
    },
    {
      cid: "m90", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, task: "任务题目：把 filter 的条件改成「大于 5」并写出输出；再用手写循环挑偶数跑出同样的结果，并说清你更愿意维护哪一段", hint: "想不起来就回看本课【演示 2 · 老写法摆在一起比一比】与【演示 3 · 换个条件，原数据毫发无损】。",
      notes: ["竖线是从 shell 管道搬来的「然后」：nums，然后筛偶数，然后取前 3 个；每段只干一件事。", "视图是惰性的看法，不复制数据也不预先算；筛完之后原数据毫发无损，还是原来那份。", "filter 出来的视图不是容器，不能像 vector 那样用下标随机取，它只保证能被从头到尾走一遍。", "std::views::filter(p) 单写是筛子本身，还没接上数据，想接几列就接几列；数据加筛子才等于一个视图。", "条件误写成 return !x % 2; 会一行都不输出：感叹号优先级高于取模，先取反得 0 或 1，再模 2 恒为 0。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "把那段数据接上第一段筛子：写一竖线，右边是 std::views::filter 递进去一把 lambda。", acceptRegex: ["\\w+\\s*\\|\\s*std::views::filter\\s*\\(\\s*\\["], acceptOn: "code", sample: "nums | std::views::filter([](int x) { return x > 5; })", why: "竖线读作「然后」：数据，然后筛，一次只干一件事；这一刻还没算，只是把看法定下来。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条那一改：谓词里现在放行的是大于 5 的数（return 一个数大于 5）。", acceptRegex: ["return\\s+\\w+\\s*>\\s*5\\s*;"], acceptOn: "code", sample: "[](int x) { return x > 5; }", why: "进来一个数、出来一个 bool，只干判断这一件事；大于 5 的按原顺序放行，顺序不变也不留空洞。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "请进这一族住的那个头文件：#include <ranges>。", acceptRegex: ["#\\s*include\\s*<\\s*ranges\\s*>"], acceptOn: "code", sample: "#include <ranges>", why: "只请 vector 和 print 两个头是拿不到 std::views 的，报错通常长成 std 里没有 views 这个成员。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "用一个 range-for 走那个带竖线的视图，把每个放行的数用 std::print 打出来。", acceptRegex: ["for\\s*\\(\\s*int\\s+\\w+\\s*:\\s*\\w+\\s*\\|", "std::print\\s*\\("], acceptOn: "code", sample: "for (int v : nums | std::views::filter([](int x) { return x > 5; }))\n    std::print(\"{} \", v);", why: "for 圈真去读的那一刻才逐个问谓词；这一步一停，筛子等于没干活。" },
        { id: "q5", type: "code", score: 20, coversTask: 2, stem: "任务第 2 条的手写那份：先开一只空的 std::vector<int> 当中间容器，再用 push_back 把挑中的搬进去。", acceptRegex: ["std::vector\\s*<\\s*int\\s*>\\s+\\w+\\s*;", "\\w+\\.push_back\\s*\\("], acceptOn: "code", sample: "std::vector<int> even;\neven.push_back(v);", why: "手写那份多养了一个容器，它存在的唯一理由是把中间结果存下来；管道那份不存，只现读。" },
        { id: "q6", type: "code", score: 15, coversTask: 2, stem: "手写那份挑的是偶数：if 里把这个数模 2 跟 0 比相等。", acceptRegex: ["if\\s*\\(\\s*\\w+\\s*%\\s*2\\s*==\\s*0\\s*\\)"], acceptOn: "code", sample: "if (v % 2 == 0) even.push_back(v);", why: "判断与搬运缠在同一行 —— 这就是要摆在一起比的那份；条件挪进 lambda 就只剩判断。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <ranges>\n#include <vector>\n\nint main() {\n    std::vector<int> nums = {5, 2, 8, 1, 9, 3, 7, 4, 6, 10};\n\n    for (int v : nums | std::views::filter([](int x) { return x > 5; }))\n        std::print(\"{} \", v);\n    std::println(\"\");\n\n    std::vector<int> even;\n    for (int v : nums) {\n        if (v % 2 == 0) even.push_back(v);\n    }\n    for (int v : even) std::print(\"{} \", v);\n    std::println(\"\");\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> nums = {5, 2, 8, 1, 9, 3, 7, 4, 6, 10};\n    std::vector<int> even;\n    for (int v : nums) {\n        if (v % 2 == 0) even.push_back(v);\n    }\n    for (int v : even) std::print(\"{} \", v);\n    return 0;\n}\n",
          "#include <print>\n#include <ranges>\n#include <vector>\n\nint main() {\n    std::vector<int> nums = {5, 2, 8, 1, 9, 3, 7, 4, 6, 10};\n    for (int v : nums | std::views::filter([](int x) { return x % 2 == 0; })) std::print(\"{} \", v);\n    return 0;\n}\n",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> nums = {5, 2, 8, 1, 9, 3, 7, 4, 6, 10};\n    for (int v : nums) if (v % 2 == 0) std::print(\"{} \", v);\n    return 0;\n}\n"],
        loose: [
          "# include < vector >\n# include < ranges >\n# include < print >\n\nint  main ( )\n{\n    std::vector<int> data = {5, 2, 8, 1, 9, 3, 7, 4, 6, 10};\n\n    for (int  n : data  | std::views::filter ( []( int  y ) {  return  y > 5 ; } ) )\n        std::print( \"{} \", n );\n    std::println(\"\");\n\n    std::vector< int >  keep ;\n    for (int n : data) {\n        if ( n % 2 == 0 )  keep . push_back ( n ) ;\n    }\n    for (int n : keep) std::print(\"{} \", n);\n    return 0;\n}\n"]
      }
    },
    {
      cid: "m91", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, task: "任务题目：把加工机改成「乘 10」并写出输出；再用 transform 把一列名字变成每个名字的长度", hint: "想不起来就回看本课【演示 2 · 换一台机器：乘 10】与【演示 3 · 跨类型：名字变长度】。",
      notes: ["filter 决定谁通过、过去的值不变；transform 决定过去的那个变成什么、一个都不会少 —— 两段管道的职责不能混。", "把平方误写进 filter：那一格要的是真假，一个数被当成真假来看，只有 0 是假，于是 0 被筛掉、其余原样流出去，一个平方都没算。", "接上管道的那一刻一个都没算，遍历时才逐个套公式；同一个视图遍历三遍，公式就被套三遍。", "加工机的返回类型就是流的元素类型：写 return x * x 是 int，写 return s.size() 是无符号长度，写 return 0.5 是 double。", "两条 return 一条回 int 一条回 double 是不合法的，编译器拦得住；transform 从不写回原容器。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "给这串数装一台加工机：写一竖线，右边是 std::views::transform 递进去一把 lambda。", acceptRegex: ["\\w+\\s*\\|\\s*std::views::transform\\s*\\(\\s*\\["], acceptOn: "code", sample: "nums | std::views::transform([](int x) { return x * x; })", why: "「有些元素不想要」用 filter，「每个元素都要换成别的东西」用 transform；某些实现里它还会用到 algorithm 那里的东西，只包 <ranges> 会挑灯。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条那一改：加工机里 return 的是这个数乘 10。", acceptRegex: ["return\\s+\\w+\\s*\\*\\s*10\\s*;"], acceptOn: "code", sample: "[](int x) { return x * 10; }", why: "公式只写在这一处；流出去的元素类型就是这条 return 决定的。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "把这个看法交给自己一只 auto 变量接住，再用 range-for 走它一遍，每个元素用 std::print 打出来。", acceptRegex: ["auto\\s+\\w+\\s*=\\s*\\w+\\s*\\|", "for\\s*\\(\\s*int\\s+\\w+\\s*:\\s*\\w+\\s*\\)", "std::print\\s*\\("], acceptOn: "code", sample: "auto times10 = nums | std::views::transform([](int x) { return x * 10; });\nfor (int v : times10) std::print(\"{} \", v);", why: "视图记着「怎么加工」，同一个看法能反复走；走一遍就把公式套一遍。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "证明加工不写回原件：用一条 std::println 打原容器的两格，格式串里两个占位坑。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\[\\s*\\w+\\s*\\]\\s*,\\s*\\w+\\s*\\[\\s*\\w+\\s*\\]"], acceptOn: "code", sample: "std::println(\"原数组没变: {} {}\", nums[0], nums[4]);", why: "视图是一层看法，不是新数据，也不动旧数据；要真改原件得自己写赋值圈或收进新容器。" },
        { id: "q5", type: "code", score: 15, coversTask: 2, stem: "任务第 2 条：开一只装 std::string 的 vector 摆几个名字，再用 transform 让加工机 return 那个名字的长度。", acceptRegex: ["std::vector\\s*<\\s*std::string\\s*>", "return\\s+\\w+\\.size\\s*\\(\\s*\\)\\s*;"], acceptOn: "code", sample: "std::vector<std::string> names = {\"Anna\", \"Bob\", \"Katherine\", \"Li\"};\nreturn s.size();", why: "跨类型照样走：写 return s.size() 之后，这条流里流的就是长度而不是名字，类型跟着 return 走。" },
        { id: "q6", type: "code", score: 15, coversTask: 2, stem: "那台跨类型的加工机参数按 const 引用收一个 string，然后用一条 for (auto 变量 : 那个看法) 把流打出来。", acceptRegex: ["\\(\\s*const\\s+std::string\\s*&\\s*\\w+\\s*\\)", "for\\s*\\(\\s*auto\\s+\\w+\\s*:"], acceptOn: "code", sample: "[](const std::string& s) { return s.size(); }\nfor (auto n : lens) std::print(\"{} \", n);", why: "按值收一个 string 等于每加工一个都复制一份；流里是长度，类型由加工机定了，就用 auto 接。" }
      ],
      selftest: {
        refs: [
          "#include <algorithm>\n#include <print>\n#include <ranges>\n#include <string>\n#include <vector>\n\nint main() {\n    std::vector<int> nums = {1, 2, 3, 4, 5};\n    auto times10 = nums | std::views::transform([](int x) { return x * 10; });\n    for (int v : times10) std::print(\"{} \", v);\n    std::println(\"\");\n    for (int v : times10) std::print(\"{} \", v);\n    std::println(\"\");\n    std::println(\"原数组没变: {} {}\", nums[0], nums[4]);\n\n    std::vector<std::string> names = {\"Anna\", \"Bob\", \"Katherine\", \"Li\"};\n    auto lens = names | std::views::transform(\n                    [](const std::string& s) { return s.size(); });\n    for (auto n : lens) std::print(\"{} \", n);\n    std::println(\"\");\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <algorithm>\n#include <print>\n#include <ranges>\n#include <vector>\n\nint main() {\n    std::vector<int> nums = {1, 2, 3, 4, 5};\n    for (int v : nums | std::views::transform([](int x) { return x * x; })) std::print(\"{} \", v);\n    return 0;\n}\n",
          "#include <print>\n#include <ranges>\n#include <vector>\n\nint main() {\n    std::vector<int> nums = {1, 2, 3, 4, 5};\n    auto picked = nums | std::views::filter([](int x) { return x * 10; });\n    for (int v : picked) std::print(\"{} \", v);\n    return 0;\n}\n",
          "#include <print>\n#include <vector>\n#include <string>\n\nint main() {\n    std::vector<std::string> names = {\"Anna\", \"Bob\"};\n    std::vector<int> lens;\n    for (const std::string& s : names) lens.push_back(s.size());\n    for (auto n : lens) std::print(\"{} \", n);\n    return 0;\n}\n"],
        loose: [
          "# include < print >\n# include < ranges >\n# include < vector >\n# include < string >\n# include < algorithm >\n\nint  main ( )\n{\n    std::vector<int> data = {1, 2, 3, 4, 5};\n    auto  ten_times = data | std::views::transform ( []( int  n ) {  return n * 10 ; } ) ;\n    for (int  t : ten_times) std::print( \"{} \", t );\n    for (int  t : ten_times) std::print( \"{} \", t );\n    std::println( \"原件 {} {}\", data[0], data[3] );\n\n    std::vector< std::string >  people = { \"Anna\" , \"Bob\" } ;\n    auto  lengths = people | std::views::transform( []( const std::string &  one ) { return  one.size( ) ; } ) ;\n    for (auto  len : lengths) std::print(\"{} \", len);\n    return 0;\n}\n"]
      }
    },
    {
      cid: "m92", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, task: "任务题目：用 iota 起头求 1 到 100 里能被 3 整除的数、平方后取前 5 个；再回答把 filter 和 transform 的顺序调换结果是否一样、为什么", hint: "想不起来就回看本课【演示 3 · 连容器都不用造】与【演示 2 · 数一数谓词被问了几次】。",
      notes: ["三段接好、for 圈还没去读的时候，程序什么都没算，只造出一个记着怎么遍历的视图对象：先声明要什么，执行在遍历那一刻。", "真正发生的事是逐元素推过整条链：取下一个、问谓词、假就丢掉、真就交给公式、take 数够了当场停手 —— 这就是谓词只被问了几次的原因。", "先取三个再筛，问的是头三个里合格的有几个；先筛再取三个，问的是合格的头三个：take 挪位置一定改变结果。", "把 lambda 的参数改名、把整条管道存进一个 auto 变量都不改变结果；加工机换成加 1，偶数全变奇数，筛出来的立刻是另一批。", "够五个就停：9 36 81 144 225 就是 3、6、9、12、15 的平方，后面的数连问都没问过。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "连容器都不用造：用 std::views::iota 生成 1 到 100 这一百个数（下界含、上界不含）。", acceptRegex: ["std::views::iota\\s*\\(\\s*1\\s*,\\s*101\\s*\\)"], acceptOn: "code", sample: "std::views::iota(1, 101)", why: "上界是「一到就停」的位置，上界减下界才等于个数：101 减 1 等于 100。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "接上第一段筛子：一竖线后面 std::views::filter 递一把 lambda，放行的是能被 3 整除的数。", acceptRegex: ["\\|\\s*std::views::filter\\s*\\(\\s*\\[", "return\\s+\\w+\\s*%\\s*3\\s*==\\s*0\\s*;"], acceptOn: "code", sample: "| std::views::filter([](int x) { return x % 3 == 0; })", why: "谁过去由这一段说了算；一行读作「然后只放能被 3 整除的过去」。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "接上第二段加工机：一竖线后面 std::views::transform，return 这个数自己的平方（自己乘自己）。", acceptRegex: ["\\|\\s*std::views::transform\\s*\\(\\s*\\[", "return\\s+(\\w+)\\s*\\*\\s+\\1\\s*;"], acceptOn: "code", sample: "| std::views::transform([](int x) { return x * x; })", why: "过去的那个变成什么由这一段说了算，一个都不会少。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "接上第三段：一竖线后面 std::views::take，只要前 5 个。", acceptRegex: ["\\|\\s*std::views::take\\s*\\(\\s*5\\s*\\)"], acceptOn: "code", sample: "| std::views::take(5);", why: "数够了整条链当场停手，后面的数连问都没问过。" },
        { id: "q5", type: "code", score: 15, coversTask: 1, stem: "把整条链交给一只 auto 变量接住，再用 range-for 走它，每个元素用 std::print 打出来。", acceptRegex: ["auto\\s+\\w+\\s*=", "for\\s*\\(\\s*int\\s+\\w+\\s*:\\s*\\w+\\s*\\)", "std::print\\s*\\("], acceptOn: "code", sample: "auto out = std::views::iota(1, 101) | std::views::filter([](int x) { return x % 3 == 0; });\nfor (int v : out) std::print(\"{} \", v);", why: "三段接好之后什么都没算，管道是声明；for 圈真去读的那一刻才逐段执行。" },
        { id: "q6", type: "code", score: 20, coversTask: 2, stem: "任务第 2 条：另接一条把 transform 写在 filter 前面的管道，再跑一遍，用一行注释写下结果一样还是不一样。", acceptRegex: ["\\|\\s*std::views::transform[\\s\\S]{0,300}\\|\\s*std::views::filter", "//[^\\n]*(一样|不一样|顺序|结果)"], acceptOn: "buffer", sample: "auto swapped = std::views::iota(1, 101) | std::views::transform([](int x) { return x * x; })\n             | std::views::filter([](int x) { return x % 3 == 0; }) | std::views::take(5);\n// 这一对恰好一样：平方不改变能被 3 整除的性质；换成加 1 就筛出另一批", why: "filter 的条件只看元素自身、transform 一对一保序，所以这一组谁在前都一样 —— 是恰好巧上，不是规矩。正则只能验你写了那一条反序管道和一行结论，道理对不对得人来读。" }
      ],
      selftest: {
        refs: [
          "#include <algorithm>\n#include <print>\n#include <ranges>\n\nint main() {\n    auto out = std::views::iota(1, 101)\n             | std::views::filter([](int x) { return x % 3 == 0; })\n             | std::views::transform([](int x) { return x * x; })\n             | std::views::take(5);\n    for (int v : out) std::print(\"{} \", v);\n    std::println(\"\");\n\n    auto swapped = std::views::iota(1, 101)\n                 | std::views::transform([](int x) { return x * x; })\n                 | std::views::filter([](int x) { return x % 3 == 0; })\n                 | std::views::take(5);\n    for (int v : swapped) std::print(\"{} \", v);\n    std::println(\"\");\n    // 这一对换顺序结果一样：平方不改变能不能被 3 整除，两段都一对一保序；take 挪到前面就不一样了\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <algorithm>\n#include <print>\n#include <ranges>\n#include <vector>\n\nint main() {\n    std::vector<int> nums = {1, 2, 3, 4, 5};\n    auto out = nums | std::views::filter([](int x) { return x % 3 == 0; })\n                    | std::views::transform([](int x) { return x * x; });\n    for (int v : out) std::print(\"{} \", v);\n    return 0;\n}\n",
          "#include <algorithm>\n#include <print>\n#include <ranges>\n\nint main() {\n    auto out = std::views::iota(1, 100)\n             | std::views::filter([](int x) { return x % 3 == 0; })\n             | std::views::transform([](int x) { return x * x; });\n    std::println(\"{}\", 1);\n    return 0;\n}\n",
          "#include <algorithm>\n#include <print>\n#include <ranges>\n\nint main() {\n    auto out = std::views::iota(1, 101) | std::views::take(5);\n    for (int v : out) std::print(\"{} \", v);\n    return 0;\n}\n"],
        loose: [
          "# include < ranges >\n# include < print >\n# include < algorithm >\n\nint  main ( )\n{\n    auto  first = std::views::iota ( 1 , 101 )\n        | std::views::filter ( []( int  n ) { return  n % 3 == 0 ; } )\n        | std::views::transform ( []( int  n ) { return  n * n ; } )\n        | std::views::take ( 5 ) ;\n    for (int  x : first) std::print( \"{} \", x );\n    std::println(\"\");\n\n    auto  second = std::views::iota(1, 101) | std::views::transform([](int n) { return n * n; })\n                 | std::views::filter([](int n) { return n % 3 == 0; }) | std::views::take(5);\n    for (int x : second) std::print(\"{} \", x);\n    // 这两条结果一样：平方不改变能不能被 3 整除，顺序在这里不换结果；take 换了就不同\n    return 0;\n}\n"]
      }
    },
  ]
};
