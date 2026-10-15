/* 喵站 · C++ 掌握 考卷分部 p19：第 149–150 课（第九轮）
 * 契约照 p10：每题分数合计正好 100、源稿每条任务都有题 coversTask 对着、
 * 带 coversTask 的题合计 ≥50 分、每题带 why、refs 判 100 / wrongs 判 <60 / loose 判 ≥60。
 * 两份源稿各只有 1 条【任务】，所以 coversTask 一律是 1。
 * 卷面上的数字全部经本机 g++ -std=c++23 实跑核对：365 / 366、92、1316134912、18446744073709551615。
 */
window.MIAO_CPPM_EXAM_P19 = {
  papers: [
    {
      cid: "m149", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, task: "任务题目：算 2026-12-31 和 2028-12-31 各是当年第几天，说清差在哪里、差的那一天是代码里哪一句加进去的", hint: "想不起来就回看本课【演示 2 · 本课任务：两个 12 月 31 日差在哪里】与【原理讲解】里那张表的两套编号。",
      notes: ["查表的价值在分工：会变的全在表里，逻辑只剩累加，排查面被压成数表和特判两处。", "十二个数抄完就加一遍是当场验收：平年应为 365，不等就知道表抄错了。", "days 的下标从 0 起，一月住在 days[0]，而口头说的月份从 1 起，两套编号差 1。", "把闰日特判挪到循环外写成 if (leap && month > 2) total += 1;，实跑每个日期都一致，但月份比较得你自己写对，别一处一半。", "边界的错不一定只差一格：多算整个三月差的是 31 而不是 1。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "把十二个月的天数抄成一张表：一个 int 数组，初值十二个数，二月那一格写 28。", acceptRegex: ["int\\s+\\w+\\s*\\[\\s*\\]\\s*=\\s*\\{\\s*31\\s*,\\s*28\\s*,"], acceptOn: "code", sample: "int days[] = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};", why: "十二个数摆到明处就能被肉眼数一遍：抄完加总是 365，出错当场能验；会变的全在表里，逻辑只剩累加。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "把闰年那句判据写成三段的 bool：能被 4 整除、不被 100 整除、还能被 400 整除。", acceptRegex: ["%\\s*4\\s*==\\s*0", "%\\s*100\\s*!=\\s*0", "%\\s*400\\s*==\\s*0"], acceptOn: "code", sample: "bool leap = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;", why: "口诀三句一句不能少：四年一闰，百年不闰，四百年再闰；只写第一段，实测 1900-3-1 会算成 61 天。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "开一个从下标 0 起、只走到上个月的循环：条件里要带那个减 1。", acceptRegex: ["for\\s*\\(\\s*int\\s+\\w+\\s*=\\s*0\\s*;\\s*\\w+\\s*<\\s*\\w+\\s*-\\s*1"], acceptOn: "code", sample: "for (int m = 0; m < month - 1; ++m) {", why: "本月没过完，所以不加本月；下标从 0 起而口头月份从 1 起，两套编号差 1。少写这个减 1，实测三月 1 日从 61 天变成 92 天。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "总数从当天起步，循环里把表上那一格加进来：一句从某个变量取初值的 int，一句对方括号里那一格的累加。", acceptRegex: ["int\\s+\\w+\\s*=\\s*\\w+\\s*;", "\\w+\\s*\\+=\\s*\\w+\\s*\\[\\s*\\w+\\s*\\]"], acceptOn: "code", sample: "int total = day;\ntotal += days[m];", why: "起点写成 0 而不是当天，实测三月 1 日少算整整一天；问 1 月 5 日时循环一圈都不转，total 就是 5。" },
        { id: "q5", type: "code", score: 15, coversTask: 1, stem: "二月逢闰年补一天：那句 if 比的那一格是 1，条件里带上闰年那个 bool，体里给总数加 1。", acceptRegex: ["if\\s*\\(\\s*\\w+\\s*==\\s*1\\s*&&\\s*\\w+\\s*\\)\\s*\\w+\\s*\\+=\\s*1\\s*;"], acceptOn: "code", sample: "if (m == 1 && leap) total += 1;", why: "闰日只在二月那一格补：问十二月时循环必然经过 m == 1，所以 2028 年比 2026 年多出这 1 天。" },
        { id: "q6", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：用 std::println 把 2026 年 12 月 31 日和 2028 年 12 月 31 日各算一次打出来，两个数并排看得见。", acceptRegex: ["std\\s*::\\s*println\\s*\\([^;]*\\(\\s*2026\\s*,\\s*12\\s*,\\s*31\\s*\\)", "std\\s*::\\s*println\\s*\\([^;]*\\(\\s*2028\\s*,\\s*12\\s*,\\s*31\\s*\\)"], acceptOn: "code", sample: "std::println(\"2026-12-31 = {}，2028-12-31 = {}\", dayOfYear(2026, 12, 31), dayOfYear(2028, 12, 31));", why: "本机实测是 365 和 366：前十一月那张表加总 334，平年 334 加 31，闰年多补那 1 天成 335 加 31。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint dayOfYear(int year, int month, int day) {\n    int days[] = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};\n    bool leap = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;\n    int total = day;\n    for (int m = 0; m < month - 1; ++m) {\n        total += days[m];\n        if (m == 1 && leap) total += 1;\n    }\n    return total;\n}\n\nint main() {\n    std::println(\"2026-12-31 = {}，2028-12-31 = {}\", dayOfYear(2026, 12, 31), dayOfYear(2028, 12, 31));\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n\nint days[] = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};\nint main() {\n    bool leap = (2028 % 4 == 0 && 2028 % 100 != 0) || 2028 % 400 == 0;\n    std::println(\"{} {}\", leap, days[1]);\n    return 0;\n}\n",
          "#include <print>\n\nint main() {\n    int days[] = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};\n    int month = 12, day = 31;\n    int total = day;\n    for (int m = 0; m < month; ++m) total += days[m];\n    std::println(\"{}\", total);\n    return 0;\n}\n"],
        loose: [
          "#  include < print >\nint  ordinal ( int  y , int  mo , int  dd )\n{\n  int  md [ ]  =  { 31 , 28 , 31 , 30 , 31 , 30 , 31 , 31 , 30 , 31 , 30 , 31 } ;\n  bool  run  =  ( y % 4 == 0 && y % 100 != 0 ) || y % 400 == 0 ;\n  int  sum  =  dd ;\n  for ( int  k  =  0 ;  k  <  mo - 1 ;  ++ k )\n  {\n    sum  +=  md [ k ] ;\n    if ( k == 1 && run )  sum  +=  1 ;\n  }\n  return  sum ;\n}\nint  main ( )\n{\n  std :: println ( \" 先看 2026 年 {}\" , ordinal ( 2026 , 12 , 31 ) ) ;\n  std :: println ( \" 再看 2028 年 {}\" , ordinal ( 2028 , 12 , 31 ) ) ;\n}\n"]
      }
    },
    {
      cid: "m150", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, task: "任务题目：给 v 装上 3、9、4 再跑一遍求最大值，再把那段 long long 换成 int，看看 10 的 13 次方打印成什么、并说清那个数为什么比负数更危险", hint: "想不起来就回看本课【演示 2 · 本课任务：装上三个数，再把 long long 换成 int】与【演示 3 · 三处各错一格的实测下场】。",
      notes: ["一问格数：i 小于 size 走 size 圈，i 小于等于 size 多走一整圈，下标越界。", "二问空：容器可能是 0 个吗？是的话取 v[0] 之前先问一句 empty。", "空容器上 size 减 1 不等于 -1：无符号数减过头绕到最远处，本机打的是 18446744073709551615，循环上界当场没了。", "溢出给你的是一个像样的错数，比当场崩掉难查得多：估到会超就从第一个变量起一路用 long long。", "本机那句断言中止是编译配置给的额外保护，不是语言保证；自查的口径要按没人替我拦来定。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条前半：给那一格 vector<int> 装上三个数，初值写成 3、9、4。", acceptRegex: ["std\\s*::\\s*vector\\s*<\\s*int\\s*>\\s+\\w+\\s*=\\s*\\{\\s*3\\s*,\\s*9\\s*,\\s*4\\s*\\}"], acceptOn: "code", sample: "std::vector<int> v = {3, 9, 4};", why: "上一段这里是空的，这一跑要它有元素；三个元素的最大值是 9。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "取第一个元素当起点：开一个 int，值写成方括号里下标 0 那一格。", acceptRegex: ["int\\s+\\w+\\s*=\\s*\\w+\\s*\\[\\s*0\\s*\\]\\s*;"], acceptOn: "code", sample: "int best = v[0];", why: "取元素之前先问容器是不是空的；空容器上这一句没有元素可给。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "开扫描循环：从下标 1 起，上界是元素个数，条件用小于号、不多写那个等号。", acceptRegex: ["for\\s*\\(\\s*size_t\\s+\\w+\\s*=\\s*1\\s*;\\s*\\w+\\s*<\\s*\\w+\\s*\\.\\s*size\\s*\\(\\s*\\)\\s*;"], acceptOn: "code", sample: "for (size_t i = 1; i < v.size(); ++i)\n    if (v[i] > best) best = v[i];", why: "size 是个数，最后一个元素住在个数减 1；多写一个等号就走整圈到墙外那一格。" },
        { id: "q4", type: "code", score: 20, coversTask: 1, stem: "开一格 long long 起累乘：初值 1，循环里用乘等于同一个数。", acceptRegex: ["long\\s+long\\s+\\w+\\s*=\\s*1\\s*;", "\\w+\\s*\\*=\\s*\\w+\\s*;"], acceptOn: "code", sample: "long long big = 1;\nfor (int i = 0; i < 13; ++i) big *= 10;", why: "10 的 13 次方是十万亿量级，早在 21 亿之上，long long 才装得住。" },
        { id: "q5", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条后半：同一个累乘再开一格 int 的算一遍（初值也是 1，乘同一个数）。", acceptRegex: ["int\\s+\\w+\\s*=\\s*1\\s*;", "\\w+\\s*\\*=\\s*\\w+\\s*;"], acceptOn: "code", sample: "int small = 1;\nfor (int i = 0; i < 13; ++i) small *= 10;", why: "这就是那一步换盒子实验：累乘过程本身在 int 里翻，最后再宽的容器也救不回来。" },
        { id: "q6", type: "code", score: 15, coversTask: 1, stem: "用两条 std::println 把这两档各打一行：一行带上 long long 字样，一行带上 int 字样。", acceptRegex: ["std\\s*::\\s*println\\s*\\([^;]*long\\s+long", "std\\s*::\\s*println\\s*\\([^;]*\\bint\\b"], acceptOn: "code", sample: "std::println(\"long long = {}\", big);\nstd::println(\"int 换上去 = {}\", small);", why: "本机实测两行是 10000000000000 和 1316134912：后者是个看着挺合理的正数，溢出既不报警也不报错。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> v = {3, 9, 4};\n    int best = v[0];\n    for (size_t i = 1; i < v.size(); ++i)\n        if (v[i] > best) best = v[i];\n    std::println(\"最大值是 {}\", best);\n    long long big = 1;\n    int small = 1;\n    for (int i = 0; i < 13; ++i) { big *= 10; small *= 10; }\n    std::println(\"long long = {}\", big);\n    std::println(\"int 换上去 = {}\", small);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> v;\n    if (!v.empty()) {\n        int best = v[0];\n        for (size_t i = 1; i < v.size(); ++i)\n            if (v[i] > best) best = v[i];\n    }\n    long long big = 1;\n    for (int i = 0; i < 13; ++i) big *= 10;\n    std::println(\"{}\", big);\n    return 0;\n}\n",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> v = {3, 9, 4};\n    int best = v[0];\n    for (size_t i = 1; i < v.size(); ++i)\n        if (v[i] > best) best = v[i];\n    std::println(\"最大值是 {}\", best);\n    return 0;\n}\n"],
        loose: [
          "#  include < print >\n#  include < vector >\nint  main ( )\n{\n  std :: vector < int >  nums  =  { 3 , 9 , 4 } ;\n  int  top  =  nums [ 0 ] ;\n  for ( size_t  k  =  1 ;  k  <  nums . size ( ) ;  ++ k )\n      if ( nums [ k ]  >  top )  top  =  nums [ k ] ;\n  long  long  wide  =  1 ;\n  int  narrow  =  1 ;\n  for ( int  j  =  0 ;  j  <  13 ;  ++ j )\n  {  wide  *=  10 ;  narrow  *=  10 ;  }\n  std :: println ( \" long long 那一档 {}\" , wide ) ;\n  std :: println ( \" int 换上去 {}\" , narrow ) ;\n}\n"]
      }
    },
  ]
};
