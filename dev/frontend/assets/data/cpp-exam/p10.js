/* 喵站 · C++ 入门 考卷分部 p10：第 43–46 课（第九轮）
 *
 * 每场卷照 cpp-exam/p01.js、p04.js 的形状与硬指标（cpp-exam-check 逐条对账）：
 *   1. kind:"paper"，题型只用笔试引擎认的六种（choice/multi/blank/code/output/order）；
 *   2. 各题 score 相加正好 100；choice ≥2、output ≥1；
 *   3. 源稿每一条【任务】都有题用 coversTask 对着它（序号从 1 起，一条题可盖多条）；
 *   4. 带 coversTask 的题合计 ≥50 分；每题带 why；
 *   5. selftest 的 refs 判 100、wrongs 判 <60、loose 判 ≥60。
 *
 * 本分部三处特殊交代：
 *   · 四课都在 vector（第 40 课）之后、pair（第 46 课）之前，题面只用已学的 range-for、下标、
 *     +=、if、整数相除这些写法；c43/c44/c45 三场完全不出现 pair。
 *   · 第 44 课的 auto& 那个 & 是本章要教的东西，题面直接写；判分器对题面只查
 *     lambda/智能指针/模板/异常/线程/cout 六样，这个写法不在其列。
 *   · 第 46 课考 pair 的 first / second，取值一律走 .first、.second 的写法，
 *     不提「当场把两格拆成两个名字」那种语法（那是后面的课）。
 *
 * 验收：node dev/tools/cpp-exam-check.cjs --only c43,c44,c45,c46
 */
window.MIAO_CPP_EXAM_P10 = {
  papers: [
    {
      cid: "c43", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 43 课考试 · 遍历求和与平均分", task: "任务题目：往 vector 里装 5 个自己的分数，用 range-for 走一遍算出总分和平均分；同一趟路上顺便数一数有几个分数 ≥ 90", hint: "想不起来就回看本课【它被设计成什么样】的累加三件套、那张逐格累加的图，和【演示 2】【演示 3】。",
      notes: ["把 int total = 0; 写进循环的花括号里，总分只剩最后一个元素 88，编译和运行都不报错 —— 这是本课最大的坑。", "range-for 每轮拿到的是新建的一份复印件，本轮那个值装在它里面；把它接到 vector 上就能走完全程，不用自己数格子。", "同一趟路可以带好几本账本，总分、人数各记各的；total += s 与 total = total + s 是一回事。", "两个整数相除会把小数部分砍掉：439 除以 5 是 87 而不是 87.8；乘 1.0 把一边升级成 double，除法才走小数那条路，{:.2f} 会把它补足两位显示成 87.80。", "85 92 78 96 88 里够 90 的只有 92 和 96 两个，所以「有几个分数 ≥ 90」的答案是 2 个。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "用花括号造一只装 int 的盒子，往里列你自己的五个分数。", acceptRegex: ["std::vector\\s*<\\s*int\\s*>\\s*\\w+\\s*=\\s*\\{[^}]*,[^}]*,[^}]*,[^}]*\\}"], acceptOn: "code", sample: "std::vector<int> scores = {85, 92, 78, 96, 88};", why: "花括号那条是「列内容」，格子数跟着内容自动定下来；没有盒子就没得走。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "在花括号外面先备一本账本：一个 int，出生就清零。", acceptRegex: ["int\\s+\\w+\\s*=\\s*0\\s*;"], acceptOn: "code", sample: "int total = 0;", why: "账本必须在循环外诞生并清零；写进循环的花括号里，每轮都会重新被抹成 0，走完只剩最后一个数 —— 而且编译和运行都不报错。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "用两格的 range-for 走完整只盒子，每轮把端到的那个值累加进账本。", acceptRegex: ["for\\s*\\(\\s*(?:auto|int|double)\\s+\\w+\\s*:\\s*\\w+\\s*\\)", "\\w+\\s*\\+=\\s*\\w+\\s*;"], acceptOn: "code", sample: "for (auto s : scores) {\n    total += s;\n}", why: "range-for 挨个往外端，一轮一个；total += s 与 total = total + s 是一回事。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "走完用账本：一条 std::println 把总分打出来，逗号后面给那个账本变量。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "std::println(\"总分 = {}\", total);", why: "总分、平均分都从这本账本来；打印放在循环外面才只打一次。" },
        { id: "q5", type: "code", score: 15, coversTask: 1, stem: "算平均分那一步别让整数相除砍掉小数：把账本乘上 1.0 再除以盒子的 size()，用一条 std::println 打出来。", acceptRegex: ["1\\.0[\\s\\S]{0,40}?/", "\\w+\\s*\\.\\s*size\\s*\\(\\s*\\)", "std::println"], acceptOn: "code", sample: "std::println(\"平均 = {:.2f}\", total * 1.0 / scores.size());", why: "total 和 size() 都是整数，439 / 5 在整数世界里是 87；乘 1.0 把一边升级成 double，除法才走小数那条路。" },
        { id: "q6", type: "code", score: 20, coversTask: 2, stem: "任务第 2 条：同一趟路再带一本账本数人数 —— 循环里用 if 问这一轮的分数是不是大于等于 90，够就在循环里记一笔。", acceptRegex: ["if\\s*\\(\\s*\\w+\\s*>=\\s*90\\s*\\)", "\\w+\\s*(?:\\+\\+|\\+=\\s*1)\\s*;"], acceptOn: "code", sample: "int good = 0;\nfor (auto s : scores) {\n    if (s >= 90) {\n        good++;\n    }\n}", why: "「走一遍、顺便记一笔」：第二本账本也在循环外清零，循环里用 if 决定记不记，无条件加一把每个分数都数进去了。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> scores = {85, 92, 78, 96, 88};\n\n    int total = 0;\n    for (auto s : scores) {\n        total += s;\n    }\n    std::println(\"总分 = {}\", total);\n    std::println(\"平均 = {:.2f}\", total * 1.0 / scores.size());\n\n    int good = 0;\n    for (auto s : scores) {\n        if (s >= 90) {\n            good++;\n        }\n    }\n    std::println(\"90 分以上的有 {} 个\", good);\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> scores = {85, 92, 78, 96, 88};\n\n    for (auto s : scores) {\n        std::print(\"{} \", s);\n    }\n    std::println(\"总分 = {}\", s);\n\n    return 0;\n}\n",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> scores = {85, 92, 78, 96, 88};\n\n    for (auto s : scores) {\n        total += s;\n    }\n\n    return 0;\n}\n"],
        loose: [
          "#  include <print>\n#  include < vector >\nint  main ( )\n{\n  std::vector< int > my = {60,95,100,72,88} ;\n  int sum =0 ;\n  for( auto v : my ) { sum += v ; }\n  std::println( \"总 {}\" , sum ) ;\n  std::println( \"平 {}\" , sum * 1.0 / my.size ( ) ) ;\n\n  int n = 0 ;\n  for ( auto v : my ) { if ( v >= 90 ) n += 1 ; }\n  std::println( \"够 90 的 {} 个\" , n ) ;\n  return 0;\n}\n"]
      }
    },
    {
      cid: "c44", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 44 课考试 · 修改元素：下标与 auto&", task: "任务题目：把 vector 里所有分数改成原来的 2 倍；再把循环头上 auto& 的那个 & 删掉跑一遍，看看分数加不加得动、程序会不会报提示", hint: "想不起来就回看本课【它被设计成什么样】那张对照表、【演示 2】的带 & 循环和【演示 3】故意删掉 & 的那一段。",
      notes: ["方括号在等号左边就是「写」：scores[门牌] = 新值 换掉那一格，读和写用的是同一个门牌号。", "「很成功地什么都没做」是本课要认出来的那种安静失败：复印件也是合法的盒子，往里加 5 完全没问题，只是没人把副本搬回原件，所以不报错、也不见效。", "auto& 里那个 & 读作引用，意思是这个名字直接接在原件身上，不再复印一份；本课先记「有 & 摸原件，没 & 摸复印件」。", "只读用 auto，要改就必须 auto&；带 & 的循环在空盒子里一轮都不执行。", "只有 3 个元素的盒子写 scores[10] = 1，编译器不会当场拦住 —— 那是直接往盒子外面写内存，可能崩、可能改坏别的变量、也可能表面正常。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "用花括号造一只装 int 的分数盒子，至少列三个数。", acceptRegex: ["std::vector\\s*<\\s*int\\s*>\\s*\\w+\\s*=\\s*\\{[^}]*,[^}]*\\}"], acceptOn: "code", sample: "std::vector<int> scores = {85, 92, 78};", why: "花括号那条是「列内容」，格子数跟着内容自动定下来；先有盒子才谈得上改它。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "写一个全员改值的 range-for：冒号左边要带上那个 &，这样手里才是原件本尊。", acceptRegex: ["for\\s*\\(\\s*auto\\s*&\\s*\\w+\\s*:\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "for (auto& s : scores) {", why: "那个 & 是开关：有它 = 原件本尊，没它 = 每轮新建一份复印件。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "在这个带 & 的循环里把每一格改成原来的 2 倍。", acceptRegex: ["\\w+\\s*(?:\\*=\\s*2|=\\s*\\w+\\s*\\*\\s*2)\\s*;"], acceptOn: "code", sample: "s *= 2;", why: "带 & 的那一句才是真的写进原件；同样的算式写在不带 & 的循环里，结果一个字都不变。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "改完再打印一次核对：用一个只读的 range-for（不带 & 就够）把每一格打出来。", acceptRegex: ["for\\s*\\(\\s*auto\\s+\\w+\\s*:\\s*\\w+\\s*\\)", "std::print(?:ln)?\\s*\\(\\s*\"[^\"]*\\{\\}"], acceptOn: "code", sample: "for (auto s : scores) {\n    std::print(\"{} \", s);\n}", why: "本课改动失败时和成功时看起来一样，「改前打一次、改后打一次、两个对照」是唯一靠得住的自查流程；只读的时候复印件就够。" },
        { id: "q5", type: "code", score: 20, coversTask: 2, stem: "任务第 2 条：把 & 删掉再跑 —— 写一个冒号左边只有 auto 的 range-for，在它的花括号里给手上那份副本乘 2。", acceptRegex: ["for\\s*\\(\\s*auto\\s+\\w+\\s*:\\s*\\w+\\s*\\)\\s*\\{[^}]*\\*="], acceptOn: "code", sample: "for (auto s : scores) {\n    s *= 2;\n}", why: "少了 &，这个乘 2 加在复印件身上，出了花括号就被扔掉，原件还是出生时那几个数。" },
        { id: "q6", type: "code", score: 15, coversTask: 2, stem: "看一眼屏幕：在旁边用一行注释写下你观察到的 —— 分数到底加没加动。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 编译通过、运行到底，值一个都没变，也不报错", why: "这一条只能验你确实记了一行笔记，验不了笔记内容对不对 —— 那是这块编辑器判不动的部分。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> scores = {85, 92, 78};\n\n    for (auto& s : scores) {\n        s *= 2;\n    }\n    for (auto s : scores) {\n        std::print(\"{} \", s);\n    }\n    std::println(\"\");\n\n    for (auto s : scores) {\n        s *= 2;   // 少了 &，原件一点没加动，只有手上那份副本被改了\n    }\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> scores = {85, 92, 78};\n    for (auto s : scores) {\n        std::print(\"{} \", s);\n    }\n    return 0;\n}\n",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> scores = {85, 92, 78};\n    for (auto& s : scores) {\n        s *= 2;\n    }\n    return 0;\n}\n"],
        loose: [
          "#  include < print >\n#  include <vector>\nint  main ( )\n{\n  std::vector<int>  fs = {60, 70, 80} ;\n  for ( auto& v : fs ) { v = v * 2 ; }\n  for ( auto v : fs ) std::print( \"{} \" , v ) ;\n  std::println( \"\" ) ;\n\n  for( auto v : fs ) { v *= 2 ; }   // 把 & 删掉之后原件纹丝不动\n  return 0;\n}\n"]
      }
    },
    {
      cid: "c45", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 45 课考试 · 清空与判空", task: "任务题目：把一只装着 1 2 3 的盒子 clear() 倒空，再 push_back(7) 看它能不能复活；另外从一只空盒子出发，用循环把 1 到 5 装进去，最后遍历打印", hint: "想不起来就回看本课【演示 1】的清空前后两行、【演示 2】的复活那一段和【演示 3】的循环装盒子。",
      notes: ["empty() 是问句，回答真假：盒子空的时候给 true；要数个数问 size()，要判有没有问 empty()，两个别混着用。", "clear() 只是把里面清干净，变量活得好好的；真正的「变量没了」要等它所在的花括号走完。", "倒空之后同一只盒子照样能 push_back，第一个装进去的元素站在 0 号格。", "判空的正规问法：先 empty()（有没有），再 size()（几个），最后才碰格子；对空盒子取 temp[0] 编译器不会拦，后果自负。", "从空盒子出发装东西的自查表：先问一句 empty() 确认真是空的，再动手装，最后再问 empty() 并遍历打印 —— 一头一尾两句中间出错一眼就能看出来。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "用花括号造一只装 int 的盒子，先给它三个数。", acceptRegex: ["std::vector\\s*<\\s*int\\s*>\\s*\\w+\\s*=\\s*\\{[^}]*,[^}]*\\}"], acceptOn: "code", sample: "std::vector<int> temp = {1, 2, 3};", why: "花括号那条是「列内容」：先装满三格，才看得出倒空把什么带走了。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "一键倒空：写一行问句之外的动作，用 clear()。", acceptRegex: ["\\.\\s*clear\\s*\\(\\s*\\)\\s*;"], acceptOn: "code", sample: "temp.clear();", why: "clear() 让元素全没、size 归 0，但盒子本身还在 —— 它不把变量删掉。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：倒空之后再往同一只盒子排进一个 7，看它能不能复活。", acceptRegex: ["\\.\\s*push_back\\s*\\(\\s*7\\s*\\)\\s*;"], acceptOn: "code", sample: "temp.push_back(7);", why: "倒空不等于报废：盒子还能装，但编号从 0 重新发，这个 7 站的是 0 号格，它不记得自己曾经有过三个数。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "动手前后各问一句：用一条 std::println 同时打出这只盒子的 empty() 和 size()，格式串里留两个占位坑。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\\{\\}", "\\.\\s*empty\\s*\\(\\s*\\)", "\\.\\s*size\\s*\\(\\s*\\)"], acceptOn: "code", sample: "std::println(\"清空后空吗？{}，剩 {} 个\", temp.empty(), temp.size());", why: "empty() 回的是 true / false 这种真假字，不是数字；size() 才回个数，两个说法必须一起成立。" },
        { id: "q5", type: "code", score: 15, coversTask: 2, stem: "任务第 2 条：再声明一只出生就是空的盒子 —— 名字后面什么初值都不给。", acceptRegex: ["std::vector\\s*<\\s*int\\s*>\\s*\\w+\\s*;"], acceptOn: "code", sample: "std::vector<int> box;", why: "空盒子是合法状态，size() 得 0、empty() 为 true，而且能加不能删。" },
        { id: "q6", type: "code", score: 20, coversTask: 2, stem: "用三格 for 让 i 从 1 走到 5，一轮往空盒子里装一个；装完再用 range-for 把整盒遍历打印出来。", acceptRegex: ["for\\s*\\(\\s*int\\s+\\w+\\s*=\\s*1\\s*;[^\\n]*<=\\s*5\\s*;", "\\.\\s*push_back\\s*\\(", "for\\s*\\(\\s*auto\\s+\\w+\\s*:\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "for (int i = 1; i <= 5; ++i) {\n    box.push_back(i);\n}\nfor (auto v : box) std::print(\"{} \", v);", why: "「来一条加一条」是空盒子的起手式；走完再遍历打印，确认 1 到 5 真的装到位了。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> temp = {1, 2, 3};\n\n    std::println(\"清空前空吗？{}\", temp.empty());\n    temp.clear();\n    std::println(\"清空后空吗？{}，剩 {} 个\", temp.empty(), temp.size());\n    temp.push_back(7);\n    std::println(\"复活后剩 {} 个，0 号格是 {}\", temp.size(), temp[0]);\n\n    std::vector<int> box;\n    for (int i = 1; i <= 5; ++i) {\n        box.push_back(i);\n    }\n    for (auto v : box) std::print(\"{} \", v);\n    std::println(\"\");\n    std::println(\"现在空吗？{}，共 {} 个\", box.empty(), box.size());\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> temp = {1, 2, 3};\n    temp.clear();\n    std::println(\"清空后空吗？{}，剩 {} 个\", temp.empty(), temp.size());\n    return 0;\n}\n",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> temp = {1, 2, 3};\n    temp.push_back(7);\n    std::println(\"剩 {} 个\", temp.size());\n    return 0;\n}\n"],
        loose: [
          "#  include <print>\n#  include <vector>\nint  main ( )\n{\n  std::vector< int > t = { 1 , 2 , 3 } ;\n  t . clear ( ) ;\n  std::println( \"空吗 {} 几个 {}\" , t.empty ( ) , t.size ( ) ) ;\n  t.push_back(7);\n\n  std::vector<int> b ;\n  for( int i=1; i<=5; i++ ) { b.push_back(i) ; }\n  for ( auto v : b ) { std::println( \"{}\" , v ) ; }\n  return 0;\n}\n"]
      }
    },
    {
      cid: "c46", kind: "paper", mode: "ide", authored: "295152d9", file: "main.cpp", pass: 60, title: "第 46 课考试 · pair 两个值捆一起", task: "任务题目：用一个 pair 存下「数学 + 145」这两格并把两格都打印出来；再把第二格改成 16 重新打印，验证盒子里的值确实能换", hint: "想不起来就回看本课【演示 1】的 first / second、【演示 2】的「两格各按各的类型说话」和【演示 3】换值那三行，还有那张一束钥匙的图。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 2, stem: "（任务题）写一行：把 student 的第二格改成 16。", acceptRegex: ["\\.second\\s*=\\s*16"], acceptOn: "code", sample: "student.second = 16;", why: "答案形状是 student.second = 16; —— 带点号、单个等号赋值，脾气跟普通变量一样。写成 == 就变成比较，什么也没改。" },
        { id: "q2", type: "code", score: 31, coversTask: 1, stem: "（任务题）写一行声明：用 std::pair 存「数学 + 145」这一对，尖括号里按顺序写两格的类型，花括号里按同一顺序给出两个值。", acceptRegex: ["pair\\s*<", "string\\s*,\\s*int\\s*>", "\\{\\s*\"数学\"\\s*,\\s*145\\s*\\}"], acceptOn: "code", sample: "std::pair<std::string, int> subject = {\"数学\", 145};", why: "尖括号里第一个类型管第一格、第二个管第二格，必须跟花括号里给值的顺序一一对应，反了编译过不去。" },
        { id: "q3", type: "code", score: 27, coversTask: 1, stem: "（任务题）subject 的第一格是科目名、第二格是分数。写一行：用 std::println 把两格都打出来。", acceptRegex: ["println\\s*\\(", "\\.\\s*first", "\\.\\s*second"], acceptOn: "code", sample: "std::println(\"{} 考了 {} 分\", subject.first, subject.second);", why: "取格子的部件名只有 first 和 second 两个，写在点号后面，跟 println 的占位坑按顺序一一对应。" },
        { id: "q4", type: "code", score: 22, coversTask: 2, stem: "（任务题）student 的第一格是名字。写一行：只把 student 的第一格换成「小红」。", acceptRegex: ["\\.\\s*first\\s*=\\s*\"小红\"\\s*;"], acceptOn: "code", sample: "student.first = \"小红\";", why: "两格都是普通成员，点号后面写谁就换谁，赋的是新值 —— 整只盒子不用重新造，另一格纹丝不动。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <string>\n#include <utility>\nint main() {\n    student.second = 16;\n    std::pair<std::string, int> subject = {\"数学\", 145};\n    std::println(\"{} 考了 {} 分\", subject.first, subject.second);\n    student.first = \"小红\";\n    return 0;\n}\n"],
        wrongs: [
          "",
          "student.third = 16;",
          "std::pair<int, std::string> subject = {145, \"数学\"};",
          "std::println(\"{}\", subject);",
          "student.second = \"小红\";"],
        loose: [
          "#include <string>\nint main() {\n    student . second  =  16 ;\n    std :: pair<   std::string  ,  int   >   s = {  \"数学\"  ,  145 }  ;\n    println ( \"{} {}\" , subject . first , subject . second ) ;\n    student  .  first   =   \"小红\"  ;\n    return 0;\n}\n"]
      }
    },
  ]
};
