/* 喵站 · C++ 入门 考卷分部 p15：第 63–66 课（第九轮）
 *
 * 每场卷照 cpp-exam/p10.js 的形状与硬指标（cpp-exam-check 逐条对账）：
 *   1. kind:"paper"，题型只用笔试引擎认的六种；各题 score 相加正好 100；choice ≥2、output ≥1；
 *   2. 源稿每一条【任务】都有题用 coversTask 对着（c63、c64、c65 各 1 条任务，c66 有 2 条）；
 *   3. 带 coversTask 的题合计 ≥50 分；每题带 why；selftest 的 refs 判 100、wrongs <60、loose ≥60。
 *
 * 本分部三处交代：
 *   · 课号线：sort 排序是第 65 课第一次跟冒泡对照，所以 c63、c64 两场卷子里不出现 sort 这个词；
 *     c65 才考 std::sort（配 algorithm 头文件），c66 考引用参数（60 起可用）与 const 引用（61 起）。
 *   · 所有 output 题的答案都是本机 g++ 15 实跑出来的：vector 用 {} 打出来带方括号和逗号，
 *     冒泡逐轮的轮数、比较次数、开关轮数都逐个验过（含「排 1 2 3 5 4 走 2 轮」这个反直觉的数字）。
 *   · 手写交换一律用三只盒子（备用盒 t），标准库那个 std::swap 只在题面里作为对照提到名字。
 *
 * 验收：node dev/tools/cpp-exam-check.cjs --only c63,c64,c65,c66
 */
window.MIAO_CPP_EXAM_P15 = {
  papers: [
    {
      cid: "c63", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 63 课考试 · 冒泡第 1 步：只走一轮", task: "任务题目：把盒子里的数换成 3 1 4 2 再走一轮，在纸上写出每一次交换之后的样子，并跟屏幕上一行一行对上", hint: "想不起来就回看本课【演示 3】那段代码和它的三行输出、【它被设计成什么样】里三只盒子的三行，还有那张一轮走到底的图。",
      notes: ["n 个格子一轮比 n - 1 次，因为比的是相邻的空隙而不是格子本身，最后一格没有右边那个可以跟它比。", "一轮后的保证只有一条：全场最大值被一路顶到队尾。3 1 4 2 走完一轮是 1 3 2 4，4 站到最后面，前面的 1 3 2 仍然是乱的。", "交换两格必须有一只备用盒：先腾出备用盒、右边的搬进左格、备用盒里那个旧左值放进右格，顺序不能换。", "一轮里同一个数可以被连着比较两次：5 换到 1 号格之后马上又跟 8 比了一次，这就是气泡一路往右冒。", "5 2 8 1 走完一轮是 2 5 1 8，8 到位了前面还乱着；一轮下来一次都没换，说明这一串本来就有序 —— 那是下一课那个开关的原理。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "把盒子里的内容换成任务给的那一串：花括号里按顺序写 3、1、4、2。", acceptRegex: ["std::vector\\s*<\\s*int\\s*>\\s*\\w+\\s*=\\s*\\{\\s*3\\s*,\\s*1\\s*,\\s*4\\s*,\\s*2\\s*\\}"], acceptOn: "code", sample: "std::vector<int> v = {3, 1, 4, 2};", why: "换一串数再跑一轮，正是这一课要你看清「一轮只保证一件事」的那次实验。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "写走一轮的那个 for：编号从无符号的 0 起，条件写成右边那格必须存在（j 加 1 还小于 size()）。", acceptRegex: ["for\\s*\\(\\s*(?:size_t|int)\\s+\\w+\\s*=\\s*0\\s*;[^\\n]*\\+\\s*1\\s*<[^\\n]*\\.\\s*size\\s*\\(\\s*\\)"], acceptOn: "code", sample: "for (size_t j = 0; j + 1 < v.size(); j++) {", why: "比的是相邻的空隙而不是格子本身，n 格一轮比 n - 1 次；这个停止条件保证不会去摸盒子外面。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "循环体里问一句：左边那格是不是比右边那格大。", acceptRegex: ["if\\s*\\(\\s*\\w+\\s*\\[\\s*\\w+\\s*\\]\\s*>\\s*\\w+\\s*\\[\\s*\\w+\\s*\\+\\s*1\\s*\\]"], acceptOn: "code", sample: "if (v[j] > v[j + 1]) {", why: "相邻两格比一比，左边比右边大才动手；比完这一对就往后挪一格。" },
        { id: "q4", type: "code", score: 20, coversTask: 1, stem: "大就交换，三只盒子按顺序来：先用一只临时 int 接住左边的旧值，再把右格搬进左格，最后把接住的那份放进右格。", acceptRegex: ["int\\s+(\\w+)\\s*=[^;]*;[\\s\\S]{0,200}?[^;\\n]*=\\s*\\1\\s*;"], acceptOn: "code", sample: "int t = v[j];\nv[j] = v[j + 1];\nv[j + 1] = t;", why: "只写两行赋值不行：赋值是覆盖，第一行跑完左格原来的值就不在了，第二行读到的已经是刚搬过来的右值，两格变成同一个数。" },
        { id: "q5", type: "code", score: 15, coversTask: 1, stem: "把每一步念出来：在 for 的花括号里、if 的外面写一条 std::println，两个占位坑按顺序给当前的 j 和整盒。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "std::println(\"j = {} 之后: {}\", j, v);", why: "打印写在 if 外面，三次比较各打一行，一共三行；写在 if 里就只看得到换了几次，看不见没换的那一轮。" },
        { id: "q6", type: "code", score: 15, coversTask: 1, stem: "纸上那份过程抄进注释：用一行注释写下每次交换后盒子长什么样。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 纸上抄的：1 3 4 2、1 3 4 2、1 3 2 4，一轮后 4 站到最后面", why: "这一条只能验你确实写了一行记录，验不了纸上那三行推得对不对 —— 那是这块编辑器判不动的部分。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> v = {3, 1, 4, 2};\n\n    for (size_t j = 0; j + 1 < v.size(); j++) {\n        if (v[j] > v[j + 1]) {\n            int t = v[j];\n            v[j] = v[j + 1];\n            v[j + 1] = t;\n        }\n        std::println(\"j = {} 之后: {}\", j, v);   // 纸上抄的：1 3 4 2、1 3 4 2、1 3 2 4，一轮后 4 站到最后面\n    }\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> v = {3, 1, 4, 2};\n    for (size_t j = 0; j + 1 < v.size(); j++) {\n        if (v[j] > v[j + 1]) {\n            v[j] = v[j + 1];\n        }\n    }\n    return 0;\n}\n",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> v = {5, 2, 8, 1};\n    for (size_t j = 0; j + 1 < v.size(); j++) {\n        if (v[j] > v[j + 1]) {\n            int t = v[j];\n            v[j] = v[j + 1];\n            v[j + 1] = t;\n        }\n    }\n    return 0;\n}\n"],
        loose: [
          "#  include <print>\n#  include <vector>\nint  main ( )\n{\n  std::vector< int > a = { 3 , 1 , 4 , 2 } ;\n  for( int p = 0; p + 1 < a.size ( ) ; p ++ )\n  {\n    if ( a[p] > a [ p + 1 ] )\n    {\n      int tmp = a[p];\n      a[p] = a[p+1];\n      a[p+1] = tmp ;\n    }\n    std::println( \"第 {} 步 {}\" , p , a ) ;   // 纸上：1 3 4 2，1 3 4 2，1 3 2 4\n  }\n  return 0;\n}\n"]
      }
    },
    {
      cid: "c64", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 64 课考试 · 冒泡完整版：一轮一轮排到底", task: "任务题目：用带引用参数的 bubble_all 给空盒子 {} 和单元素 {42} 各排一次，确认程序不崩，并说清 i + 1 < v.size() 为什么比 i < v.size() - 1 安全", hint: "想不起来就回看本课【演示 3】的空盒子与单元素那段、那张下楼梯的图和【它被设计成什么样】里每轮比较次数那一行。",
      notes: ["空盒子传给 bubble_all：外层条件是 i + 1 < v.size()，空盒子时是 1 < 0，不成立，所以一轮都不进、安静地原样退出来。", "size() 回的是无符号整数，一个元素都没有时 0 减 1 不会变成 -1，而是绕回最大值附近（实测打印是 18446744073709551615），循环条件看着仍然成立，程序就冲进不存在的格子里了。", "五个格子四个空隙：每轮的比较数是 4、3、2、1，加起来 10 次，也就是 n * (n - 1) / 2 —— 数据量翻一倍、活儿翻四倍。", "每一轮的保证：右边 i + 1 格已经是全场最大的那几个，而且已经排好；外层走满 n - 1 轮就够，最后剩的那个数天然归位。", "参数里少写那个 & 编译不报错：那是排复印件，跑到底外面那只盒子一动不动，是本课最难查的坑；内层上界忘了减 i 不影响结果，只把 10 次比较变成 16 次。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "备好两种边界数据：一只花括号里什么都不写的空盒子，和一只只装 42 的盒子。", acceptRegex: ["std::vector\\s*<\\s*int\\s*>\\s*\\w+\\s*=\\s*\\{\\s*\\}", "std::vector\\s*<\\s*int\\s*>\\s*\\w+\\s*=\\s*\\{\\s*42\\s*\\}"], acceptOn: "code", sample: "std::vector<int> e = {};\nstd::vector<int> one = {42};", why: "边界数据 + 调用 + 打印对照，是查任何函数是否安全的通用套路；空盒子和单元素正是排序最容易翻车的两种。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "写外层 for：编号从无符号的 0 起，条件写成 i 加 1 还小于 size() —— 一共走 n - 1 轮。", acceptRegex: ["for\\s*\\(\\s*(?:size_t|int)\\s+\\w+\\s*=\\s*0\\s*;[^\\n]*\\+\\s*1\\s*<[^\\n]*\\.\\s*size\\s*\\(\\s*\\)"], acceptOn: "code", sample: "for (size_t i = 0; i + 1 < v.size(); i++) {", why: "空盒子时这一句是 1 < 0，不成立，所以一轮都不进、安静地原样退出来；写成 i < size() - 1 就等着 0 减 1 绕回一个极大的数。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "在外层的花括号里再套内层 for：j 从 0 起，上界写成 size() 减去 i，比到还没归位那一段的末尾就收。", acceptRegex: ["for\\s*\\(\\s*(?:size_t|int)\\s+\\w+\\s*=\\s*0\\s*;[^\\n]*<[^\\n]*\\.\\s*size\\s*\\(\\s*\\)\\s*-\\s*\\w+\\s*;"], acceptOn: "code", sample: "for (size_t j = 0; j + 1 < v.size() - i; j++) {", why: "每走完一轮右边就多一个归位的大数，内层因此能少比一次：五格走 4、3、2、1 次共 10 次，忘了减 i 结果照样对，只是白比成 16 次。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "内层里比一比再换：if 问左边那格是不是比右边大，大就调用 std::swap 换这两格 —— 别忘了请进 std::swap 住的那个头文件 utility。", acceptRegex: ["if\\s*\\(\\s*\\w+\\s*\\[\\s*\\w+\\s*\\]\\s*>\\s*\\w+\\s*\\[\\s*\\w+\\s*\\+\\s*1\\s*\\]", "std::swap\\s*\\(", "#\\s*include\\s*<\\s*utility\\s*>"], acceptOn: "code", sample: "if (v[j] > v[j + 1]) std::swap(v[j], v[j + 1]);", why: "相邻两格比一比、大的往后挪，上一课那三只盒子的活这里用 std::swap 一句话替掉；它住在 utility 里。" },
        { id: "q5", type: "code", score: 15, coversTask: 1, stem: "把两只边界盒子各传给排序的那把工具一次，再用一条 std::println 三个占位坑把它们的此刻内容一起打出来对照。", acceptRegex: ["\\w+\\s*\\(\\s*\\w+\\s*\\)\\s*;[\\s\\S]*\\w+\\s*\\(\\s*\\w+\\s*\\)\\s*;", "std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\\{\\}[^\"]*\\{\\}"], acceptOn: "code", sample: "bubble_all(e); bubble_all(one);\nstd::println(\"空 {} 单 {} 四个 {}\", e, one, v);", why: "对照出生时的值，确认没崩也没被改坏：空盒子照旧空，那只 42 照旧是 42。" },
        { id: "q6", type: "code", score: 15, coversTask: 1, stem: "用一行注释写下你想明白的那件事：i + 1 < size() 为什么比 i < size() - 1 安全。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 空盒子时 1 < 0 不成立；0 减 1 是无符号下溢，翻成一个极大的数，条件看着还成立就冲进盒子外面了", why: "这一条只能验你确实写了一行想法，验不了写得对不对 —— 无符号下溢这种事得你自己跑出来看见。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <utility>\n#include <vector>\n\nvoid bubble_all(std::vector<int>& v) {\n    for (size_t i = 0; i + 1 < v.size(); i++) {\n        for (size_t j = 0; j + 1 < v.size() - i; j++) {\n            if (v[j] > v[j + 1]) std::swap(v[j], v[j + 1]);\n        }\n    }\n}\n\nint main() {\n    std::vector<int> e = {};\n    std::vector<int> one = {42};\n    std::vector<int> v = {5, 2, 8, 1};\n\n    bubble_all(e);\n    bubble_all(one);\n    bubble_all(v);\n\n    std::println(\"空 {} 单 {} 四个 {}\", e, one, v);\n\n    // 空盒子时 1 < 0 不成立，一轮都不进；0 减 1 是无符号下溢，翻成极大的数，条件看着还成立就冲进盒子外面了\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <utility>\n#include <vector>\n\nint main() {\n    std::vector<int> v = {5, 2, 8, 1};\n    for (size_t i = 0; i + 1 < v.size(); i++) {\n        for (size_t j = 0; j + 1 < v.size(); j++) {\n            if (v[j] > v[j + 1]) std::swap(v[j], v[j + 1]);\n        }\n    }\n    return 0;\n}\n",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> e = {};\n    std::vector<int> one = {42};\n    std::println(\"空 {} 单 {}\", e, one);\n    return 0;\n}\n"],
        loose: [
          "#  include <print>\n#  include < utility >\n#  include <vector>\nvoid  sort_it ( std::vector<int> & box )\n{\n  for ( size_t a = 0 ; a + 1 < box.size ( ) ; a ++ )\n  {\n    for ( size_t b = 0 ; b + 1 < box.size ( ) - a ; b ++ )\n    {\n      if ( box[b] > box[b+1] ) std::swap ( box[b] , box[b+1] ) ;\n    }\n  }\n}\nint main ( )\n{\n  std::vector<int> zero = {} ;\n  std::vector<int> single = { 42 } ;\n  sort_it(zero);\n  sort_it(single);\n  std::println( \"零 {} 单 {} 完 {}\" , zero , single , single ) ;  // 空盒子时 1 < 0 不成立，一轮都不进\n  return 0;\n}\n"]
      }
    },
    {
      cid: "c65", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 65 课考试 · 冒泡优化：没交换就提前收工", task: "任务题目：排 {1, 2, 3, 5, 4}，先猜它走几轮就提前停下，再用每轮打印开关状态或者计数器把答案验出来", hint: "想不起来就回看本课【演示 2】那两行输出、那张开关决定的图，还有【它被设计成什么样】里三组实测数字。",
      notes: ["1 2 3 5 4 加了开关走 2 轮 7 次比较就停：第一轮比 4 次、换 1 次（5 与 4 那对），第二轮比 3 次一次都没换，打印 false 然后 break。", "不优化那版是 4 轮 10 次；完全有序的 1 2 3 4 5 优化后 1 轮 4 次就收工，最坏情况 5 4 3 2 1 一轮都省不掉。", "已经有序的串也得走完一整轮才能停，因为「这轮一次都没换」这件事只有走完一轮才知道。", "开关的四个动作有固定顺序：内层之前按成 false，交换之后记成 true，内层走完之后看一眼，还是 false 就 break。", "std::sort 是放在 algorithm 里的函数，写 std::sort(v.begin(), v.end())，右端那个位置不包含自己的数据；v.sort() 报的是没有这个名字的成员。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "把要排的那一串数装进一只整型 vector：值按源稿给的就是 1、2、3、5、4。", acceptRegex: ["std::vector\\s*<\\s*int\\s*>\\s+\\w+\\s*=\\s*\\{\\s*1\\s*,\\s*2\\s*,\\s*3\\s*,\\s*5\\s*,\\s*4\\s*\\}"], acceptOn: "code", sample: "std::vector<int> v = {1, 2, 3, 5, 4};", why: "vector 是整串数据的盒子，花括号里按顺序把初值写全；排的就是这一串。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "给外层循环装一只开关：每一轮开始、进内层之前，用一个 bool 变量把它按成 false。", acceptRegex: ["\\bbool\\s+\\w+\\s*=\\s*false\\s*;"], acceptOn: "code", sample: "bool swapped = false;", why: "开关表示这轮还没换过，所以每轮都要重新按下一次；写在两层循环之外只按一次，之后每轮开头它都还是 true。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "内层里相邻两个前面比后面大就交换，换完紧跟一句把那只开关记成 true。", acceptRegex: ["std::swap\\s*\\(\\s*\\w+\\s*\\[\\s*\\w+\\s*\\]\\s*,\\s*\\w+\\s*\\[\\s*\\w+\\s*\\+\\s*1\\s*\\]\\s*\\)", "\\b\\w+\\s*=\\s*true\\s*;"], acceptOn: "code", sample: "std::swap(v[j], v[j + 1]);\nswapped = true;", why: "交换用 std::swap 一句办妥；换过必须记账，否则程序不知道这轮动过，已经有序时也不肯停。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "内层走完、这一轮结束之前看一眼开关：还是 false 就 break，不再开下一轮。", acceptRegex: ["if\\s*\\(\\s*!\\s*\\w+\\s*\\)\\s*\\{?\\s*break\\s*;"], acceptOn: "code", sample: "if (!swapped) break;", why: "一轮一次都没换就说明已经排好，当场收工；这一步搬进内层会变成这一对没换就跳出全部。" },
        { id: "q5", type: "code", score: 15, coversTask: 1, stem: "每轮结束用一条 std::println 把第几轮和这轮的开关状态一起打出来：格式串里至少两个占位坑，按顺序给对应的值。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\\{\\}[^\"]*\"\\s*,"], acceptOn: "code", sample: "std::println(\"第 {} 轮后 {}，这轮换过吗？{}\", i + 1, v, swapped);", why: "开关是 bool，打出来就是 true 或 false；坑和值的个数对不上在编译期就被拦下。" },
        { id: "q6", type: "code", score: 15, stem: "把这份程序写成能跑的形：把打印工具箱和 vector 头搬进来（两条 #include），再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "#\\s*include\\s*<\\s*vector\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n#include <vector>\n\nint main() {", why: "缺头文件就没人认识 std::println 和 std::vector；没有 main，链接器找不到入口。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <utility>\n#include <vector>\n\nint main() {\n    std::vector<int> v = {1, 2, 3, 5, 4};\n    for (size_t i = 0; i + 1 < v.size(); i++) {\n        bool swapped = false;\n        for (size_t j = 0; j + 1 < v.size() - i; j++) {\n            if (v[j] > v[j + 1]) {\n                std::swap(v[j], v[j + 1]);\n                swapped = true;\n            }\n        }\n        std::println(\"第 {} 轮后 {}，这轮换过吗？{}\", i + 1, v, swapped);\n        if (!swapped) break;\n    }\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <vector>\nint main() {\n    std::vector<int> v = {1, 2, 3, 5, 4};\n    for (size_t i = 0; i + 1 < v.size(); i++) {\n        for (size_t j = 0; j + 1 < v.size(); j++) {\n            if (v[j] > v[j + 1]) {\n                std::swap(v[j], v[j + 1]);\n            }\n        }\n    }\n    std::println(\"{}\", v);\n    return 0;\n}\n",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> data = {1, 2, 3, 5, 4};\n    for (size_t i = 0; i + 1 < data.size(); i++) {\n        bool changed = false;\n        for (size_t j = 0; j + 1 < data.size(); j++) {\n            if (data[j] < data[j + 1]) {\n                std::swap(data[j], data[j + 1]);\n            }\n        }\n    }\n    return 0;\n}\n",
          "#include <print>\nint main() {\n    return 0;\n}\n"],
        loose: [
          "#  include < vector >\n#  include < print >\nint  main ( )\n{\n  std::vector<int> nums = {1, 2, 3, 5, 4};\n  for (size_t r = 0; r + 1 < nums.size(); r++) {\n    bool flag = false;\n    for (size_t k = 0; k + 1 < nums.size() - r; k++) {\n      if (nums[k] > nums[k + 1]) {\n        std::swap( nums[k], nums[k + 1] );\n        flag = true;\n      }\n    }\n    std::println( \"round {} now {} flag {}\" , r + 1 , nums , flag );\n    if (!flag) { break; }\n  }\n  return 0;\n}\n"]
      }
    },
    {
      cid: "c66", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 66 课考试 · 传值与传引用：一页分清", task: "任务题目：把 by_ref 参数里的 & 删掉再跑，先在纸上预测输出会变成什么；再写一个 swap(int&, int&)，把两个数交换过来", hint: "想不起来就回看本课【演示 1】的三行输出、【演示 2】那张复印件排好的冒泡和【演示 3】的 swap_two，还有那张复印件与原稿对照的图。",
      notes: ["把 by_ref 的 & 删掉写成 int x，跑完外面的 b 还是 10：999 写在复印件上，编译通过、运行正常，只是什么都没变。", "一句话判断：要改就加 &；只读而且东西大就加 const &；小而只读直接传值。", "const 引用里写操作是编译期就拦住的，报错大意是丢掉限定符、只读位置不能赋值，那种报错是好事。", "写 int& r; 不给初值，编译直接报错：引用必须初始化。", "传值一只大 vector 每次调用都要整份搬一遍；std::sort 那类标准库函数收 vector 时也照这条办。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "写一个只收复印件的函数：参数就写 int 后面跟名字，中间不许有 &。", acceptRegex: ["\\bvoid\\s+\\w+\\s*\\(\\s*int\\s+\\w+\\s*\\)"], acceptOn: "code", sample: "void by_value(int x) {", why: "参数里没有 & 就是传值：函数里新建一只盒子，把实参的值抄进去。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "在这个函数体里给那个参数写一个新值（复印件上留字，比如 x = 999）。", acceptRegex: ["void\\s+\\w+\\s*\\(\\s*int\\s+(\\w+)\\s*\\)\\s*\\{[^}]*\\b\\1\\s*="], acceptOn: "code", sample: "void by_value(int x) { x = 999; }", why: "这一句确实执行了，但写的是副本；出了花括号副本被扔掉，原件一点不动。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "在 main 里调用它，之后用一条 std::println 打印外面那只 int 变量：格式串里一个占位坑，逗号后面给那只变量。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "std::println(\"传值后   a = {}\", a);", why: "漏 & 的失败一声不吭，屏幕上一行都不报，只能靠调用前后各打一次同一只盒子来自查；光看函数里打印的值会被骗。" },
        { id: "q4", type: "code", score: 20, coversTask: 2, stem: "写交换两个数那个函数的头部：两个参数都得能改到外面的原件，各挂一个 &。", acceptRegex: ["\\bvoid\\s+\\w+\\s*\\(\\s*int\\s*&\\s*\\w+\\s*,\\s*int\\s*&\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "void swap_two(int& a, int& b) {", why: "要改几只原件就挂几个 &；只给第一个带 &，两个数会变成同一个值，另一个数被弄丢。" },
        { id: "q5", type: "code", score: 20, coversTask: 2, stem: "在这个交换函数的体里用一只备用盒把两个数倒过来：先 int 一个临时变量装走一个，再互相赋值，最后把临时的倒回去。", acceptRegex: ["\\bint\\s+\\w+\\s*=\\s*\\w+\\s*;\\s*\\w+\\s*=\\s*\\w+\\s*;\\s*\\w+\\s*=\\s*\\w+\\s*;"], acceptOn: "code", sample: "int t = a;\na = b;\nb = t;", why: "两个盒子换东西要第三个帮忙：先借放一份，再互相接；直接 a = b 会先把 a 的值冲掉。" },
        { id: "q6", type: "code", score: 15, stem: "把这份程序写成能跑的形：搬进打印工具箱（#include <print>），再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n\nint main() {", why: "缺 #include 就没人认识 std::println；没有 main，链接器找不到入口。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nvoid by_value(int x) { x = 999; std::println(\"函数里拿到: {}\", x); }\n\nvoid swap_two(int& a, int& b) {\n    int t = a;\n    a = b;\n    b = t;\n}\n\nint main() {\n    int a = 10;\n    by_value(a);\n    std::println(\"传值后 a = {}\", a);\n\n    int x = 1, y = 7;\n    swap_two(x, y);\n    std::println(\"x = {} y = {}\", x, y);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n\nvoid swap_two(int a, int b) {\n    int t = a;\n    a = b;\n    b = t;\n}\n\nint main() {\n    int x = 1, y = 7;\n    swap_two(x, y);\n    std::println(\"x = {} y = {}\", x, y);\n    return 0;\n}\n",
          "#include <print>\n\nint main() {\n    int a = 10;\n    a = 999;\n    std::println(\"{}\", a);\n    return 0;\n}\n",
          "#include <vector>\n\nint main() {\n    std::vector<int> v = {5, 2, 8, 1};\n    return 0;\n}\n"],
        loose: [
          "#  include < print >\nvoid  copy_only ( int  n )\n{\n    n = 42;\n    std::println( \"inside {}\" , n );\n}\n\nvoid  trade ( int &  p , int &  q )\n{\n    int  hold = p;\n    p = q;\n    q = hold;\n}\n\nint  main ( )\n{\n    int  a = 10;\n    copy_only(a);\n    std::println(\"a 变了吗 {}\", a);\n    int  x = 1 ,  y = 7;\n    trade(x, y);\n    std::println(\"x {} y {}\", x, y);\n    return 0;\n}\n"]
      }
    },
  ]
};
