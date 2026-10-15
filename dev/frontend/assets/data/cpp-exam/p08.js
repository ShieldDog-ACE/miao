/* 喵站 · C++ 入门 考卷分部 p08：第 35–38 课（第九轮）
 *
 * 源稿任务对账（cpp-exam-check 按 syllabus.json 逐条查 coversTask）：
 *   c35：1 改条件打印 10 到 15 · 2 用 for 求 1 到 100 所有偶数的和
 *   c36：1 写 10 秒倒计时 · 2 用 i += 5 打印 0 到 100 里所有 5 的倍数
 *   c37：1 换成自己的英文名数元音字母 · 2 遍历 hello 遇到 l 就打印找到了
 *   c38：1 把 break 条件改成 i == 3 · 2 用 continue 打印 1 到 20 中所有 3 的倍数
 * 硬指标：每场 6–10 题、score 合计正好 100、choice ≥2、output ≥1、任务题合计 ≥50、
 *         每题带 why；selftest 的 refs 判 100、wrongs 判不过、loose 仍过。
 */
window.MIAO_CPP_EXAM_P08 = {
  papers: [
    {
      cid: "c35", kind: "paper", mode: "ide", authored: "69d2789d", file: "main.cpp", pass: 60, title: "第 35 课考试 · for 循环：数数神器", task: "任务题目：改条件让 for 打印 10 到 15；用 for 求 1 到 100 所有偶数的和。", hint: "想不起来就回看本课【演示 1】的数数和【演示 2】的累加器。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 28, coversTask: 2, stem: "（任务题）写一个 for 循环，求 1 到 100 所有偶数的和，累加进已经存在的 int sum = 0;。循环变量名和步进方式自己定，但要真的只把偶数加进去。", acceptRegex: ["for\\s*\\(", "i\\s*\\+=\\s*2|i\\s*%\\s*2\\s*==\\s*0"], acceptOn: "code", sample: "for (int i = 2; i <= 100; i += 2) { sum += i; }", why: "两种都对：要么起点 2、步进 i += 2 只踩偶数，要么照旧 i++ 但在循环体里用 i % 2 == 0 筛掉奇数。关键是「只有偶数进 sum」。" },
        { id: "q2", type: "code", score: 28, coversTask: 2, stem: "（任务题）接着上一题写：把累加器补完整 —— 一行在循环外面把 sum 起头成 0，一行在循环体里把 i 加进 sum。", acceptRegex: ["int\\s+sum\\s*=\\s*0", "sum\\s*(\\+=|=\\s*sum\\s*\\+)"], acceptOn: "code", sample: "int sum = 0;\nfor (...) { sum += i; }", why: "累加器两段式：循环外 int sum = 0;（清零只做一次），循环内 sum += i;（或写成 sum = sum + i;）。清零写进循环体就每轮被抹掉。" },
        { id: "q3", type: "code", score: 44, coversTask: 1, stem: "（任务题）写一个 for 循环：从 10 数到 15，两头都要打出来，每轮用 std::println 把当前的数打一行。起点、终点、步进三格全部自己写。", acceptRegex: ["for\\s*\\(\\s*int\\s+\\w+\\s*=\\s*10\\s*;", ";\\s*\\w+\\s*(<=|<)\\s*(15|16)\\s*;", "println\\s*\\("], acceptOn: "code", sample: "for (int i = 10; i <= 15; i++) { std::println(\"{}\", i); }", why: "起点写 10；终点要含住 15，所以是 i <= 15（写成 i < 16 也一样含）；步进每轮加一。三格顺序不能换，初始化只做一次。" }
      ],
      selftest: {
        refs: [
          "#include <print>\nint main() {\n    for (int i = 2; i <= 100; i += 2) { sum += i; }\n    int sum = 0;\n    for (...) { sum += i; }\n    for (int i = 10; i <= 15; i++) { std::println(\"{}\", i); }\n    return 0;\n}\n"],
        wrongs: [
          "",
          "for (int i = 1; i <= 100; i++) { sum += i; }",
          "sum = 0; inside",
          "for (int i = 1; i <= 15; i++) {\n    std::println(\"{}\", i);\n}"],
        loose: [
          "int main() {\n    for(int i=1;i<=100;i++){ if(i%2==0) sum+=i; }\n    int  sum=0 ;\n    sum  +=  i ;\n    for(int   i=10 ;i<16 ;i ++){ std :: println ( \"{}\" , i ) ; }\n    return 0;\n}\n"]
      }
    },
    {
      cid: "c36", kind: "paper", mode: "ide", authored: "30a0247b", file: "main.cpp", pass: 60, title: "第 36 课考试 · for 倒着数与跳步", task: "任务题目：写 10 秒倒计时，每行输出「还剩 n 秒」；用 i += 5 打印 0 到 100 里所有 5 的倍数。", hint: "想不起来就回看本课【演示 3】的倒计时和【演示 4】的 5 的倍数。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 27, coversTask: 1, stem: "（任务题）写一个完整的 for 循环做 10 秒倒计时：循环变量自己起名，每轮用 std::println 打一行「还剩 几 秒」，从 10 数到 1。", acceptRegex: ["for\\s*\\([^)]*;\\s*\\w+\\s*>=", "\\-\\-"], acceptOn: "code", sample: "for (int left = 10; left >= 1; left--) { std::println(\"还剩 {} 秒\", left); }", why: "两个要点缺一不可：条件格用 >=（倒数方向的信号），步进格用 --。剩下的名字、起点、循环体内容随你写。" },
        { id: "q2", type: "code", score: 41, coversTask: 2, stem: "（任务题）写一个完整的 for 循环：从 0 起跳，每轮加 5，一直打到 100（含 100），每轮用 std::print 打一个数再加一个空格。", acceptRegex: ["for\\s*\\(", "\\+\\s*=\\s*5", "<\\s*=\\s*100\\s*;"], acceptOn: "code", sample: "for (int i = 0; i <= 100; i += 5) { std::print(\"{} \", i); }", why: "起点 0、步长 5、终点写成 <= 100 才把 100 这一格也收进来；三个格子合起来决定循环踩到的正好是 0、5、10 一直到 100。" },
        { id: "q3", type: "code", score: 32, coversTask: 1, stem: "只写 for 循环那一行头，三个格子写全：循环变量从 10 开始，每轮减 1，一直走到 1（含 1）。", acceptRegex: ["for\\s*\\(", "int\\s+\\w+\\s*=\\s*10", ">\\s*=\\s*1\\s*;", "-{2}"], acceptOn: "code", sample: "for (int left = 10; left >= 1; left--)", why: "步进格往回走，条件格就得问「还没到底吗」写成 >= 1；方向不配套的话循环一次都不进，而且不报错。" }
      ],
      selftest: {
        refs: [
          "#include <print>\nint main() {\n    for (int left = 10; left >= 1; left--) { std::println(\"还剩 {} 秒\", left); }\n    for (int i = 0; i <= 100; i += 5) { std::print(\"{} \", i); }\n    for (int left = 10; left >= 1; left--)\n    return 0;\n}\n"],
        wrongs: [
          "",
          "for (int i = 1; i <= 10; i++) { std::println(i); }",
          "for (int i = 0; i < 100; i += 1) {\n    std::print(\"{} \", i);\n}",
          "for (int left = 1; left <= 10; left--)"],
        loose: [
          "#include <print>\nint main() {\n    for(int s=10;s>=1;s--){println(\"还剩 {} 秒\", s);}\n    for(int x=0;x<=100 ;x+=5){std::print(\"{} \", x);}\n    for  (  int  s = 10 ;  s  >=  1 ;  s --  )\n    return 0;\n}\n"]
      }
    },
    {
      cid: "c37", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 37 课考试 · range-for 遍历", task: "任务题目：把自己的英文名放进 std::string，用 range-for 数一数里面有几个元音字母；遍历 hello，遇到 l 就打印「找到了」。", hint: "想不起来就回看本课【演示 1】的逐个端出来和【演示 2】的数有几个 o。",
      notes: ["range-for 每轮拿到的是副本：在循环体里改那个变量，容器里那份纹丝不动。", "std::string 里每个元素都是一个字符，所以 auto 把接住的变量猜成 char —— 类型是编译器照冒号右边抄的。", "括号里没写长度也没写下标，容器自己排队递，遍历完循环自己结束。", "range-for 拿不到「第几个」，需要序号就该换三格 for；「把一串现成的东西逐个处理」才是它的地盘，纯数数用三格 for 更顺手。", "遍历的时候不要往被遍历的那个容器里增删元素。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "用一个 std::string 装你自己的英文名（值用双引号写）。", acceptRegex: ["std::string\\s+\\w+\\s*=\\s*\"[^\"]*\""], acceptOn: "code", sample: "std::string name = \"fukase\";", why: "串要 std::string 才装得住，char 盒只能装一个字符；双引号才是串，单引号是字符。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "用两格的 range-for 把这个名字挨个字符端出来：冒号左边声明接住元素的变量，冒号右边给那个串。", acceptRegex: ["for\\s*\\(\\s*auto\\s+\\w+\\s*:\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "for (auto c : name) {", why: "range-for 括号里只有两格、中间一个冒号：左边是每轮接住一个元素的声明，右边才是要遍历的那一串。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "在循环外面把一个计数器清零，循环体里判断手上这个字符是不是元音，是就把计数器加一。", acceptRegex: ["int\\s+\\w+\\s*=\\s*0\\s*;", "if\\s*\\(\\s*\\w+\\s*==\\s*'[aeiouAEIOU]'", "\\w+\\s*\\+\\+\\s*;"], acceptOn: "code", sample: "int count = 0;\nfor (auto c : name) {\n    if (c == 'a' || c == 'e') count++;\n}", why: "每轮问一句「这个字符是不是元音」，是才加一；无条件加一会把所有字母都数进去，拿计数器去比字符则把两个角色颠倒了。" },
        { id: "q4", type: "code", score: 20, coversTask: 1, stem: "遍历结束之后，用一条 std::println 把数到的个数打到屏幕上：格式串里留一个占位坑，逗号后面按顺序给那个计数器。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "std::println(\"元音出现了 {} 次\", count);", why: "打印放在循环外面才只打一次总数；一个坑给一个值，坑和值对不上编译期就报错。" },
        { id: "q5", type: "code", score: 25, coversTask: 2, stem: "任务第 2 条：遍历 \"hello\" 这一串，遇到字符 l 就用一条 std::println 打出「找到了」，格式串里不要留占位坑。", acceptRegex: ["=\\s*\"hello\"", "if\\s*\\(\\s*\\w+\\s*==\\s*'l'\\s*\\)", "std::println\\s*\\(\\s*\"找到了\""], acceptOn: "code", sample: "std::string word = \"hello\";\nfor (auto c : word) {\n    if (c == 'l') {\n        std::println(\"找到了\");\n    }\n}", why: "单引号 l 是一个字符，能跟遍历到的元素比；遍历会把每一处都看到，hello 里两个 l 就打两行，不会只挑一个。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <string>\n\nint main() {\n    std::string name = \"fukase\";\n    int count = 0;\n\n    for (auto c : name) {\n        if (c == 'a' || c == 'e' || c == 'i') count++;\n    }\n\n    std::println(\"元音出现了 {} 次\", count);\n\n    std::string word = \"hello\";\n    for (auto ch : word) {\n        if (ch == 'l') {\n            std::println(\"找到了\");\n        }\n    }\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <string>\n\nint main() {\n    std::string name = \"fukase\";\n\n    for (auto c : name) {\n        std::println(\"{}\", c);\n    }\n\n    return 0;\n}\n",
          "#include <print>\n#include <string>\n\nint main() {\n    std::string name = \"fukase\";\n    int count = 0;\n\n    for (auto c : name) {\n        if (c == 'a') count++;\n    }\n\n    return 0;\n}\n"],
        loose: [
          "#  include <print>\n#  include <string>\n\nint main ( )\n{\n  std::string  my_name = \"ming\";\n  int  n =0 ;\n  for ( auto x : my_name )\n  {\n    if ( x=='e' ) n ++ ;\n  }\n  std::println( \"元音 {}\" , n ) ;\n\n  std::string w = \"hello\";\n  for (auto q : w) { if (q == 'l') std::println(\"找到了\"); }\n  return 0;\n}\n"]
      }
    },
    {
      cid: "c38", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 38 课考试 · break 与 continue", task: "任务题目：把演示 1 的 break 条件改成 i == 3，说清还打印几个数；用 continue 打印 1 到 20 中所有 3 的倍数。", hint: "想不起来就回看本课【演示 1】的离场、【演示 2】的跳过偶数，和那张「跳出围栏」的图。",
      notes: ["break 结束整个循环、跳到循环下面那一行；continue 只结束这一轮、直接进下一轮 —— 程序在 break 之后照常往下走。", "break 之后本轮剩下的循环体语句不做了；continue 之后本轮剩下的语句同样不做了。", "while 里放 continue 容易因为步进那一格被跳掉而变成死循环，for 里用就没这个坑。", "break 只离开紧挨着它的那一个循环，不会把整个程序停掉。", "在一串东西里找第一个目标、找到就不必再往下看，是 break 的场合；continue 只能跳过这一轮，后面的元素照样被逐个看完。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "写一个三格 for：第一格让 i 从 1 起，第二格数到 10 为止，第三格每轮加一。", acceptRegex: ["for\\s*\\(\\s*int\\s+\\w+\\s*=\\s*1\\s*;[^\\n]*<=\\s*10\\s*;[^\\n]*\\+\\+"], acceptOn: "code", sample: "for (int i = 1; i <= 10; i++) {", why: "三格 for 是自己数、自己取下标：初值、条件、步进三格都在括号里，用分号隔开。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "在循环体里加一句：i 等于 3 就踩 break，让整场循环当场结束。", acceptRegex: ["if\\s*\\(\\s*\\w+\\s*==\\s*3\\s*\\)", "\\bbreak\\s*;"], acceptOn: "code", sample: "if (i == 3) {\n    break;\n}", why: "break 是「整场结束」，跳到循环下面那一行；i 为 3 这一轮还没走到后面的打印语句就跳出去了。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "用一条 std::println 把每一轮的 i 打出来，让屏幕上几个数一目了然。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "std::println(\"{}\", i);", why: "打印写在 break 那一句后面，撞进 if 的那一轮就轮不到它 —— 这正是 break 之后本轮剩下的语句不再执行。" },
        { id: "q4", type: "code", score: 20, coversTask: 2, stem: "再写一个三格 for：i 从 1 数到 20。", acceptRegex: ["for\\s*\\(\\s*int\\s+\\w+\\s*=\\s*1\\s*;[^\\n]*<=\\s*20\\s*;[^\\n]*\\+\\+"], acceptOn: "code", sample: "for (int i = 1; i <= 20; i++) {", why: "任务 2 要 1 到 20 全过一遍，还是自己数数，用三格 for。" },
        { id: "q5", type: "code", score: 25, coversTask: 2, stem: "在这个循环体开头用一句 if 配 continue：用取余判断能不能被 3 整除，不能整除的那一轮直接作废、进下一轮，把 3 的倍数留给后面的打印。", acceptRegex: ["%\\s*3", "continue\\s*;"], acceptOn: "code", sample: "if (i % 3 != 0) continue;", why: "continue 只是本轮作废：它跳的是循环体里剩下的语句，跳不到 for 的第三格，步进格照常执行，所以循环不会卡住。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint main() {\n    for (int i = 1; i <= 10; i++) {\n        if (i == 3) {\n            break;\n        }\n        std::println(\"{}\", i);\n    }\n\n    for (int i = 1; i <= 20; i++) {\n        if (i % 3 != 0) continue;\n        std::println(\"3 的倍数: {}\", i);\n    }\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n\nint main() {\n    for (int i = 1; i <= 10; i++) {\n        if (i == 3) {\n            break;\n        }\n        std::println(\"{}\", i);\n    }\n\n    return 0;\n}\n",
          "#include <print>\n\nint main() {\n    for (int i = 1; i <= 20; i++) {\n        if (i % 3 == 0) {\n            std::println(\"3 的倍数: {}\", i);\n        }\n    }\n\n    return 0;\n}\n"],
        loose: [
          "#  include <print>\nint main ( )\n{\n  for( int k = 1; k<=10; k++ )\n  {\n    if (k==3) break ;\n    std::println( \"i = {}\" , k ) ;\n  }\n  for ( int k = 1 ; k <= 20 ; k ++ )\n  {\n    if ( k % 3 != 0 ) continue ;\n    std::println( \"{}\" , k ) ;\n  }\n}\n"]
      }
    },
  ]
};
