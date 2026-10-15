/* 喵站 · C++ 掌握 考卷分部 p23：第 157–158 课（第九轮）
 * 两份源稿各只有 1 条【任务】，所以 coversTask 一律是 1。
 * 契约：每题分数合计正好 100、任务题合计 ≥50 分、choice ≥2、output ≥1、每题带 why、
 * refs 判 100 / wrongs 判 <60 / loose 判 ≥60。
 * 卷面里所有数字（186 与 443 的张数、升序那一跑的 186 张、忘剪零头的 254 张、
 * 4/3/1 在 1 到 60 元的 14 笔翻车、5/4/3/1 的 7 笔、标准面值 1 到 200 元的 0 笔）
 * 都是本机 g++ -std=c++23 实跑出来的，与正文一致。
 */
window.MIAO_CPPM_EXAM_P23 = {
  papers: [
    {
      cid: "m157", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, task: "任务题目：算出 443 元要几张，再把 coins 的顺序反过来、从小拿，看看会怎样 —— 两跑各把总张数打印出来，别只用眼睛看", hint: "想不起来就回看本课【演示 2 · 本课任务前半：443 元要几张】和【演示 3 · 本课任务后半：把 coins 顺序反过来】，那两个张数就写在对应段落里。",
      notes: ["贪心的关键是绝不回头：每步拿当前还能拿的最大面值，拿完就把凑走的部分剪掉，不留候选、不撤销。", "先做取余再除，每一档都算出 0 张，程序一行都不打印；两句的顺序换一下就变成另一回事。", "面额表里混进一个 0，整数除以它不是编译期能抓住的事，实测跑到那一档当场挂掉、核心已转储。", "把 if 大于 0 那行删掉，总张数照旧：那行只是打印的外衣，不是算法。", "贪心给出的张数在本课这套面值上确实最少，但那是面额表给的保证，不是贪心自己的本事；换一张表它当场多花一张。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条前半：把要凑的金额写成 443。", acceptRegex: ["int\\s+\\w+\\s*=\\s*443\\s*;"], acceptOn: "code", sample: "int amount = 443;", why: "源稿算的是 186 元六张；换成 443 元实测是 9 张。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "把面额表按从大到小写出来：一个 int 数组，六个面值，100 打头、1 收尾。", acceptRegex: ["int\\s+\\w+\\s*\\[\\s*\\]\\s*=\\s*\\{\\s*100\\s*,\\s*50\\s*,\\s*20\\s*,\\s*10\\s*,\\s*5\\s*,\\s*1\\s*\\}"], acceptOn: "code", sample: "int coins[] = {100, 50, 20, 10, 5, 1};", why: "面对 100：186 / 100 = 1 张，186 % 100 = 86 —— 表序就是每步的当前最大。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "每一档两步：开一个 int 用除法算出这个面额能拿几张，再用取余把凑走的部分剪掉。", acceptRegex: ["int\\s+\\w+\\s*=\\s*\\w+\\s*/\\s*\\w+\\s*;", "\\w+\\s*%=\\s*\\w+\\s*;"], acceptOn: "code", sample: "int n = amount / c;\namount %= c;", why: "这两个运算符配成一对：除法给出几张，取余给出还剩多少零头。只写除法忘了取余，实测 186 元合计 254 张、余额压根没动。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "把每档的张数累加进一个总数，并用一条 std::println 打出合计。", acceptRegex: ["\\w+\\s*\\+=\\s*\\w+\\s*;", "std\\s*::\\s*println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*张[^\"]*\""], acceptOn: "code", sample: "total += n;\nstd::println(\"合计 {} 张，剩余零头 {}\", total, amount);", why: "实测 443 元是 9 张：100 四张、20 两张、1 元三张；50、10、5 三档是被那行 if 滤掉的，余额不允许。" },
        { id: "q5", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条后半：再写一张面额表，把源稿那行反过来，从小到大排。", acceptRegex: ["int\\s+\\w+\\s*\\[\\s*\\]\\s*=\\s*\\{\\s*1\\s*,\\s*5\\s*,\\s*10\\s*,\\s*20\\s*,\\s*50\\s*,\\s*100\\s*\\}"], acceptOn: "code", sample: "int small_first[] = {1, 5, 10, 20, 50, 100};", why: "这一张表就是本课要的那一眼：代码一行都没写错，只是当前被数组顺序定义成了手里第一个碰到的。" },
        { id: "q6", type: "code", score: 15, coversTask: 1, stem: "对那张升序表也走一遍：一圈里先用除法把张数累加进去，再用取余把凑走的剪掉。", acceptRegex: ["\\w+\\s*\\+=\\s*\\w+\\s*/\\s*\\w+\\s*;", "\\w+\\s*%=\\s*\\w+\\s*;"], acceptOn: "code", sample: "for (int c : small_first) {\n    total += left / c;\n    left %= c;\n}", why: "实测 186 元这一跑给出 186 张，全是 1 元；443 元那一跑同样离谱 —— 先拿小面额就把每一块钱数一遍。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint main() {\n    int coins[] = {100, 50, 20, 10, 5, 1};\n    int small_first[] = {1, 5, 10, 20, 50, 100};\n\n    int amount = 443;\n    int total = 0;\n    for (int c : coins) {\n        int n = amount / c;\n        if (n > 0) std::println(\"{}元 × {}张\", c, n);\n        total += n;\n        amount %= c;\n    }\n    std::println(\"合计 {} 张，剩余零头 {}\", total, amount);\n\n    int left = 443, wrong = 0;\n    for (int c : small_first) {\n        wrong += left / c;\n        left %= c;\n    }\n    std::println(\"从小拿的话给出 {} 张\", wrong);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n\nint main() {\n    int amount = 443;\n    int coins[] = {100, 50, 20, 10, 5, 1};\n    for (int c : coins) std::println(\"{}\", c);\n    std::println(\"合计还没算\");\n    return 0;\n}\n",
          "#include <print>\n\nint main() {\n    int amount = 186;\n    int coins[] = {100, 50, 20, 10, 5, 1};\n    int total = 0;\n    for (int c : coins) {\n        int n = amount / c;\n        total += n;\n        amount %= c;\n    }\n    std::println(\"合计 {} 张\", total);\n    return 0;\n}\n"],
        loose: [
          "#  include < print >\nint  main ( )\n{\n  int  big []  =  { 100 , 50 , 20 , 10 , 5 , 1 } ;\n  int  rev []  =  { 1 , 5 , 10 , 20 , 50 , 100 } ;\n  int  rest  =  443 ;\n  int  all  =  0 ;\n  for ( int  d : big )\n  {\n    int  get  =  rest / d ;\n    all  +=  get ;\n    rest  %=  d ;\n  }\n  std :: println ( \" 一共 {} 张\" , all ) ;\n  int  back  =  443 ,  cnt  =  0 ;\n  for ( int  d : rev )\n  {\n    cnt  +=  back / d ;\n    back  %=  d ;\n  }\n  std :: println ( \" 反过来 {} 张\" , cnt ) ;\n}\n"]
      }
    },
    {
      cid: "m158", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, task: "任务题目：只用眼睛找出 6 元那个 2 张的拿法，再拿枚举跑一遍核对；然后想一句话：什么时候敢用贪心，什么时候不敢 —— 把这句话写进程序注释", hint: "想不起来就回看本课【演示 2 · 拿第 145 课的枚举当尺子：最少到底几张】和【演示 4 · 反过来再验两把：哪套面值它不翻车】，翻车清单在【演示 3】那段里。",
      notes: ["不回头是贪心的定义，也正是它的死穴：除法版一次就把 4 元拿满，同样落到余额 2。", "面额 5/4/3/1 找 7 元：贪心 3 张，枚举最优 2 张；25/10/5/1 扫 1 到 40 元实测 0 笔不对。", "删掉 1 元兜底，程序照样跑完并说用了 1 张，可余额还是 2 —— 那段代码从不主动报告余额。", "眼睛找出来之后，还要像枚举那把尺子一样把它跑成一个数字核对，本课不认口算。", "代码够短、跑得够快都不是判据；证据要么来自逐笔验证，要么来自你说得出的理由。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "把这套坑人的面额摆出来：一个 int 数组写 4、3、1，再用一圈范围 for 挨个拿它凑 6 元。", acceptRegex: ["int\\s+\\w+\\s*\\[\\s*\\]\\s*=\\s*\\{\\s*4\\s*,\\s*3\\s*,\\s*1\\s*\\}", "for\\s*\\(\\s*int\\s+\\w+\\s*:\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "int coins[] = {4, 3, 1};\nfor (int c : coins) { used += n / c; n %= c; }", why: "实测它给 3 张，就是 4 + 1 + 1：第一步抓了 4，余额落到 2，3 元塞不下，只能两张 1 元收尾。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "拿枚举当尺子：两层循环各试 4 元和 3 元拿几张，一路用小于号把最少张数记下来。", acceptRegex: ["\\w+\\s*\\*\\s*4\\s*<=\\s*\\w+", "if\\s*\\(\\s*\\w+\\s*<\\s*\\w+\\s*\\)\\s*\\w+\\s*=\\s*\\w+\\s*;"], acceptOn: "code", sample: "for (int a = 0; a * 4 <= n; ++a)\n    for (int b = 0; b * 3 <= n - a * 4; ++b) {\n        int tot = a + b + (n - a * 4 - b * 3);\n        if (tot < r) r = tot;\n    }", why: "best 先记一个一定更差的值，剩下的全用 1 元填；跑出来 6 元的最优确实是 2 张。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "任务前半：只用眼睛找出那个两张的拿法，把它写在注释里（两个面值都写出来）。", acceptRegex: ["//[^\\n]*3[^\\n]*3[^\\n]*"], acceptOn: "buffer", sample: "// 只用眼睛找出：3 + 3 = 6，两张", why: "判的是你写出了这一对面值；是不是真的 3 + 3 这块编辑器核对不了 —— 上一条例可以把张数跑出来对一遍。" },
        { id: "q4", type: "code", score: 20, coversTask: 1, stem: "任务后半：用一行注释写下什么时候敢用贪心、什么时候不敢（一句话，八个字以上）。", acceptRegex: ["//[^\\n]{8,}"], acceptOn: "buffer", sample: "// 要么拿枚举在真实金额范围里逐笔验过，要么能说出大的那张永远不亏的理由；两条都拿不出来就别把它的输出当最优解交上去", why: "这一条判不出道理对不对，只判你确实写下了一句话；本机两组证据：100/50/20/10/5/1 扫 1 到 200 元与枚举 0 笔不一致，4/3/1 在 1 到 60 元有 14 笔不对。" },
        { id: "q5", type: "code", score: 20, stem: "把翻车的金额一笔一笔数出来：一个循环让金额从 1 走到 60，里头比较两个函数给出的张数不相等。", acceptRegex: ["for\\s*\\(\\s*int\\s+\\w+\\s*=\\s*1\\s*;\\s*\\w+\\s*<=\\s*60\\s*;", "if\\s*\\(\\s*\\w+\\s*\\(\\s*\\w+\\s*\\)\\s*!=\\s*\\w+\\s*\\(\\s*\\w+\\s*\\)\\s*\\)"], acceptOn: "code", sample: "for (int n = 1; n <= 60; ++n)\n    if (greedy(n) != best(n)) bad.push_back(n);", why: "实测 14 笔，全是除以 4 余 2 的金额，每一笔只多 1 张 —— 数字要比口号管用。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <vector>\n\nint greedy(int n) {\n    int coins[] = {4, 3, 1};\n    int used = 0;\n    for (int c : coins) { used += n / c; n %= c; }\n    return used;\n}\n\nint best(int n) {\n    int r = n + 1;\n    for (int a = 0; a * 4 <= n; ++a)\n        for (int b = 0; b * 3 <= n - a * 4; ++b) {\n            int tot = a + b + (n - a * 4 - b * 3);\n            if (tot < r) r = tot;\n        }\n    return r;\n}\n\nint main() {\n    std::vector<int> bad;\n    for (int n = 1; n <= 60; ++n)\n        if (greedy(n) != best(n)) bad.push_back(n);\n    std::println(\"面额 4/3/1，1 到 60 元：贪心翻车 {} 笔\", bad.size());\n    std::println(\"6 元：贪心 {} 张，最优 {} 张\", greedy(6), best(6));\n    // 只用眼睛找出的两张拿法：3 + 3 = 6\n    // 敢用贪心的时候：拿枚举在真实金额范围里逐笔验过，或说得出大的那张永远不亏的理由\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n\nint main() {\n    int coins[] = {4, 3, 1};\n    int amount = 6, used = 0;\n    for (int c : coins)\n        while (amount >= c) { amount -= c; ++used; }\n    std::println(\"贪心用了 {} 张\", used);\n    return 0;\n}\n",
          "#include <print>\n\nint main() {\n    int n = 6, r = 7;\n    for (int a = 0; a * 4 <= n; ++a)\n        for (int b = 0; b * 3 <= n; ++b) {\n            int tot = a + b;\n            if (tot < r) r = tot;\n        }\n    std::println(\"最优 {} 张\", r);\n    int coins[] = {4, 3, 1};\n    int used = 0;\n    for (int c : coins) used += 1;\n    return 0;\n}\n"],
        loose: [
          "#  include < print >\n#  include < vector >\n\nint  take_greedy ( int  n )\n{\n  int  face [ ]  =  { 4 , 3 , 1 } ;\n  int  got  =  0 ;\n  for ( int  f : face ) { got  +=  n / f ;  n  %=  f ; }\n  return  got ;\n}\nint  take_best ( int  n )\n{\n  int  r  =  n + 1 ;\n  for ( int  i  =  0 ;  i  *  4  <=  n ;  ++ i )\n    for ( int  j  =  0 ;  j  *  3  <=  n ;  ++ j )\n    {\n      int  sum  =  i + j + ( n - i * 4 - j * 3 ) ;\n      if ( sum < r )  r = sum ;\n    }\n  return  r ;\n}\nint  main ( )\n{\n  std :: vector < int >  bad ;\n  for ( int  v  =  1 ;  v  <=  60 ;  ++ v )\n      if ( take_greedy ( v ) != take_best ( v ) )  bad . push_back ( v ) ;\n  std :: println ( \" 翻车 {} 笔\" , bad . size ( ) ) ;\n  // 那两张是 3 和 3 凑出来的\n  // 不敢用贪心的时候：没拿枚举逐笔验过也说不出理由\n}\n"]
      }
    },
  ]
};
