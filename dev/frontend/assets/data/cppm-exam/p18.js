/* 喵站 · C++ 掌握 考卷分部 p18：第 145–148 课（第九轮）
 * 契约与 p10 一样：每题分数合计正好 100、源稿每条任务都有题 coversTask 对着、
 * 带 coversTask 的题合计 ≥50 分、每题带 why、refs 判 100 / wrongs 判 <60 / loose 判 ≥60。
 * 145 与 146、147 各 1 条【任务】，148 有 2 条，coversTask 按源稿序号从 1 起。
 * 所有 output 题的 acceptLines 都是本机 g++ -std=c++23 实跑出来的行。
 */
window.MIAO_CPPM_EXAM_P18 = {
  papers: [
    {
      cid: "m145", kind: "paper", mode: "ide", authored: "a9ffd6ac", file: "main.cpp", pass: 60, task: "任务题目：枚举 1 到 1000 里的完数 —— 真因子之和等于自己的那些数，比如 6 = 1+2+3；写出判定那句、跑出来并把候选总数数清楚", hint: "想不起来就回看本课【演示 3 · 本课任务：枚举 1 到 1000 里的完数】与【原理讲解】里拆位那三行。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 26, coversTask: 1, stem: "（任务题）枚举完数靠内层把真因子一个个加起来。写出内层那句判断：如果 d 是 n 的因子，就把 d 加进累加器 s。", acceptRegex: ["n\\s*%\\s*d\\s*==\\s*0", "s\\s*\\+=\\s*d"], acceptOn: "code", sample: "for (int d = 1; d < n; ++d)\n            if (n % d == 0) s += d;", why: "整除判「除得尽吗」是第 9 课的取余；d 是 n 的因子就是 n 除以 d 余 0，除得尽就把这个 d 记进 s。" },
        { id: "q2", type: "code", score: 17, stem: "写出枚举「100 到 999 每一个三位数」的那句 for 头：初值、条件、递增三段都要有。", acceptRegex: ["for\\s*\\(\\s*int\\s+n\\s*=\\s*100\\s*;", "n\\s*<\\s*1000", "\\+\\+n"], acceptOn: "code", sample: "for (int n = 100; n < 1000; ++n)", why: "候选个数写在范围里：从 100 起、到 1000 前停，正好 900 个。上界写 n 小于 1000 比写 n 小于等于 999 更贴近题意。" },
        { id: "q3", type: "code", score: 29, coversTask: 1, stem: "（任务题）写出外层那句 for 头：候选从 1 起，把 1000 也试到，每轮加一。初值、条件、递增三段都要有。", acceptRegex: ["for\\s*\\(\\s*int\\s+\\w+\\s*=\\s*1\\s*;", "\\w+\\s*<=\\s*1000|\\w+\\s*<\\s*1001", "\\+\\+\\s*\\w+|\\w+\\s*\\+\\+"], acceptOn: "code", sample: "for (int n = 1; n <= 1000; ++n)", why: "范围是题意的一部分：1 到 1000 含两头就是 1000 个候选。上界写成小于等于 1000 或小于 1001 都对，写成小于 1000 就漏掉 1000 自己。" },
        { id: "q4", type: "code", score: 28, coversTask: 1, stem: "（任务的最后一步）写出判定与打印那一行：累加器 s 和候选 n 相等，就把 n 当完数打出去。", acceptRegex: ["if\\s*\\(\\s*(\\w+\\s*==\\s*\\w+)\\s*\\)", "std\\s*::\\s*println\\s*\\(\\s*\"", "println[^\n]*\\{\\}"], acceptOn: "code", sample: "if (s == n) std::println(\"完数：{}\", n);", why: "判定就是拿因子和跟自己比一句；花括号占位符把命中的那个候选填进打印，穷举的结果才看得见。" }
      ],
      selftest: {
        refs: [
          "#include <print>\nint main() {\n    for (int d = 1; d < n; ++d)\n    if (n % d == 0) s += d;\n    for (int n = 100; n < 1000; ++n)\n    for (int n = 1; n <= 1000; ++n)\n    if (s == n) std::println(\"完数：{}\", n);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "s += n % d;",
          "for (int n = 100; n <= 999; n = n * 2)",
          "for (int n = 100; n < 1000; ++n)",
          "if (s = n) std::println(\"完数\");"],
        loose: [
          "int main() {\n    for(int d=1;d<n;++d){ if ( n % d == 0 ) { s += d; } }\n    for(int n=100; n<1000; ++n )\n    for( int  k = 1 ;  k  <  1001 ;  ++  k )\n    if  (  n == s  )  std :: println (  \"完数：{}\" , n ) ;\n    return 0;\n}\n"]
      }
    },
    {
      cid: "m146", kind: "paper", mode: "ide", authored: "5a49b147", file: "main.cpp", pass: 60, task: "任务题目：用两重循环求 a²+b²=c² 且 a+b+c=1000 的勾股数组数，c 仍然由减法算出来；跑完还要说清你数到的是几个、题目要的是几个", hint: "想不起来就回看本课【演示 3 · 本课任务：勾股数组，两个等式叠着用】与【原理讲解】里那本三层的账。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 34, coversTask: 1, stem: "（任务题）在两层循环里补上关键两行：先用等式把 c 减出来，再判这组是不是勾股数组。", acceptRegex: ["int\\s+c\\s*=\\s*1000\\s*-\\s*a\\s*-\\s*b", "a\\s*\\*\\s*a\\s*\\+\\s*b\\s*\\*\\s*b\\s*==\\s*c\\s*\\*\\s*c"], acceptOn: "code", sample: "int c = 1000 - a - b;\n            if (a*a + b*b == c*c) { ++count; std::println(\"找到 {} {} {}\", a, b, c); }", why: "第一条等式负责把 c 消掉，第二条只留一个判定。两行一起才是这道题的正解：少写一层循环，条件一个都不放松。" },
        { id: "q2", type: "code", score: 33, coversTask: 1, stem: "写出内层那条 for 的循环头：b 从 1 开始，只要 a 加 b 还没到 sum 就继续。只写 for 这一行，循环体不用写。", acceptRegex: ["for\\s*\\(\\s*int\\s+b\\s*=\\s*1\\s*;", "a\\s*\\+\\s*b\\s*<\\s*sum"], acceptOn: "code", sample: "for (int b = 1; a + b < sum; ++b)", why: "b 的上界不用另算：a 定下来之后，a 加 b 一到 sum，减出来的 c 就不是正整数，后面每一格都必然无解，所以循环条件直接写成 a + b 小于 sum。" },
        { id: "q3", type: "code", score: 33, coversTask: 1, stem: "写一行：把数好的组数打出来，格式串里留一个值槽，槽由 count 填。", acceptRegex: ["std\\s*::\\s*println\\s*\\(", "\\{\\}", "count"], acceptOn: "code", sample: "std::println(\"一共 {} 组\", count);", why: "值槽和实参是按顺序配对的：格式串里写 {}，括号里就得给出填它的变量。只在格式串里写组数这个词，屏幕上不会自己长出数字。" }
      ],
      selftest: {
        refs: [
          "#include <print>\nint main() {\n    int c = 1000 - a - b;\n    if (a*a + b*b == c*c) { ++count; std::println(\"找到 {} {} {}\", a, b, c); }\n    for (int b = 1; a + b < sum; ++b)\n    std::println(\"一共 {} 组\", count);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "for (int c = 1; c < 1000; ++c) if (a+b+c==1000) count++;",
          "for (int b = 1; b < sum; ++b) {",
          "std::println(\"一共 {} 组\", tries);"],
        loose: [
          "int main() {\n    int  c =  1000 -  a  -  b ;\n    if ( a * a + b * b == c * c ) { ++count ; }\n    for  (  int b=1 ;  a+ b  <sum  ; ++b )\n    {\n    std  ::  println  (  \"一共 {} 组\"  ,  count  ) ;\n    return 0;\n}\n}\n"]
      }
    },
    {
      cid: "m147", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, task: "任务题目：把报数跳 7 改成报满 15 个正常数，列出全部被跳过的数，并打印最后一个真正报出来的数", hint: "想不起来就回看本课【演示 2 · 本课任务：改成报 15 个正常数，列出被跳过的数】与【原理讲解】最后那段「进度和数到的数不是一回事」。",
      notes: ["循环条件听题目里那句直到：跳过的数也占掉 cur 的一步，用 cur 当进度就报不满，实测只报出 17 个。", "动手前先问两件事：手上要记什么状态、一步怎么推进；模拟不像穷举，不懂题目就翻不成代码。", "把进度加一挪到 if 外面，跳过也算报了一个，等于自定 20 轮而不是 20 个真数。", "for 的初始化段有自己的作用域，出了那对花括号变量就不存在。", "实测这一版打印四行：被跳过的是 7、14、17，最后一个报出的是 18。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "把进度记在循环外面：先有一个用 int 声明、用来数报了几个的变量，循环条件比的是它和 15。", acceptRegex: ["\\bint\\s+\\w+\\s*=", "\\w+\\s*<\\s*15\\s*;"], acceptOn: "code", sample: "int reported = 0, cur = 1;\nfor (; reported < 15; ++cur) {", why: "停止条件听题目里那句报满：声明提到 for 前面，循环结束后才读得到它。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "规则一写成代码：逢 7 的倍数，用取余比 0。", acceptRegex: ["\\w+\\s*%\\s*7\\s*==\\s*0"], acceptOn: "code", sample: "cur % 7 == 0", why: "这一条是纯算术：除以 7 余数为 0 就是 7 的倍数。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "规则二用文本判：把当前这个数变成字符串，找字符 7，判它没等于那个找不到的专门值。", acceptRegex: ["std\\s*::\\s*to_string\\s*\\(", "\\.\\s*find\\s*\\(\\s*'7'\\s*\\)", "!\\s*=\\s*(?:std\\s*::\\s*)?string\\s*::\\s*npos"], acceptOn: "code", sample: "std::to_string(cur).find('7') != std::string::npos", why: "find 的返回值是下标，没地方可给就返回 npos，所以判找到了要写成不等于 npos，而不是直接放进 if。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "两条规则并排放进一个 bool：中间用表示任一命中的那个双竖线。", acceptRegex: ["\\bbool\\s+\\w+\\s*=\\s*[^;]*\\|\\|"], acceptOn: "code", sample: "bool skip = (cur % 7 == 0) || std::to_string(cur).find('7') != std::string::npos;", why: "两条是并排关系：实测把双竖线写成双与号，1 到 60 里只剩 7 一个数被跳。" },
        { id: "q5", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：命中跳过时，用一条 std::println 把那个被跳过的数列出来（格式串里带上跳过的字样，一个占位坑给那个数）。", acceptRegex: ["std\\s*::\\s*println\\s*\\(\\s*\"[^\"]*跳过[^\"]*\"\\s*,\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "if (skip) std::println(\"被跳过的数：{}\", cur);", why: "这一步只打印、不加进度：跳过的数不占报数的名额，实测 15 个正常数要在 18 那里才凑齐。" },
        { id: "q6", type: "code", score: 15, coversTask: 1, stem: "收尾用一条 std::println 打最后一个报出来的数：参数给那个变量减 1。", acceptRegex: ["std\\s*::\\s*println\\s*\\([^;]*\\w+\\s*-\\s*1\\s*\\)"], acceptOn: "code", sample: "std::println(\"报满 15 个，最后一个报出的是 {}\", cur - 1);", why: "循环退出时 cur 已经往前多走了一步，所以要减一才是真正报出的最后一个。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <string>\n\nint main() {\n    int reported = 0, cur = 1;\n    for (; reported < 15; ++cur) {\n        bool skip = (cur % 7 == 0) || std::to_string(cur).find('7') != std::string::npos;\n        if (skip) {\n            std::println(\"被跳过的数：{}\", cur);\n        } else {\n            ++reported;\n        }\n    }\n    std::println(\"报满 15 个，最后一个报出的是 {}\", cur - 1);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <string>\n\nint main() {\n    int reported = 0;\n    for (int cur = 1; reported < 20; ++cur) {\n        bool skip = (cur % 7 == 0) || std::to_string(cur).find('7') != std::string::npos;\n        if (!skip) {\n            ++reported;\n        } else {\n            std::println(\"第 {} 个正常数之后，跳过了 {}\", reported, cur);\n        }\n    }\n    return 0;\n}\n",
          "#include <print>\n\nint main() {\n    for (int i = 1; i <= 15; ++i) std::println(\"{}\", i);\n    return 0;\n}\n"],
        loose: [
          "#  include < print >\n#  include < string >\nint  main ( )\n{\n  int  done  =  0 ,  n  =  1 ;\n  for ( ;  done  <  15 ;  ++ n )\n  {\n    bool  hit  =  n % 7 == 0 || std :: to_string ( n ) . find ( '7' ) != std :: string :: npos ;\n    if ( hit )  std :: println ( \" 这个数跳过 {}\" , n ) ;\n    else  ++ done ;\n  }\n  std :: println ( \" 报满十五个，最后一个是 {}\" , n - 1 ) ;\n}\n"]
      }
    },
    {
      cid: "m148", kind: "paper", mode: "ide", authored: "12fd65e1", file: "main.cpp", pass: 60, task: "任务题目：两件一起做 —— 把源稿那张 4×4 的螺旋格子改成 5×5，再让蛇从「向下」开始走；交卷时要说清 5×5 到底改了哪几处，以及向下走的朝向次序为什么不能只挪开头", hint: "想不起来就回看本课【演示 3 · 本课任务一：把矩阵改成 5×5】与【演示 4 · 本课任务二：让蛇从向下开始走】，再看一眼【原理讲解】里那张下标对照表。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 24, coversTask: 1, stem: "（任务题）把 4×4 改成 5×5，源稿提示有两处都要改。补出这两行：一是循环上界改成填 25 格，二是撞墙判定里的行列上界改成新格子的最后一行最后一列。", acceptRegex: ["v\\s*<=\\s*25", "nx\\s*>\\s*4", "ny\\s*>\\s*4"], acceptOn: "code", sample: "for (int v = 1; v <= 25; ++v) {\n        if (nx < 0 || nx > 4 || ny < 0 || ny > 4 || m[nx][ny] != 0) dir = (dir + 1) % 4;", why: "16 换成 25 才填得满；5×5 的下标是 0 到 4，所以越界判定里那两个 3 必须换成 4。只改声明与上界、判定不动，实测第 5 行第 5 列全是空格，13 到 21 这九个数直接写飞。" },
        { id: "q2", type: "code", score: 22, coversTask: 2, stem: "（任务题）让蛇从「向下」开始走，而且撞墙仍按 dir 加一 再 % 4 来转。写出新的方向数组那两行：第一个朝向是向下，四个朝向排成一圈。", acceptRegex: ["dx\\s*\\[\\s*\\]\\s*=\\s*\\{\\s*1\\s*,\\s*0\\s*,\\s*-1\\s*,\\s*0\\s*\\}", "dy\\s*\\[\\s*\\]\\s*=\\s*\\{\\s*0\\s*,\\s*1\\s*,\\s*0\\s*,\\s*-1\\s*\\}"], acceptOn: "code", sample: "int dx[] = {1, 0, -1, 0}, dy[] = {0, 1, 0, -1};", why: "dx 管行、dy 管列：向下是行加一列不动，所以 dx 打头是 1；接下来要贴着底边往右走，dy 排成 0、1、0、-1。照字面把原来的 右、下、左、上 挪成 下、左、上、右，撞第一次墙就拐到列的负数那一侧。" },
        { id: "q3", type: "code", score: 27, coversTask: 1, stem: "写出棋盘声明那一行：开一张 5 行 5 列的整型格子，名字叫 m，一开出来就全是 0。", acceptRegex: ["int\\s+m\\s*\\[\\s*5\\s*\\]\\s*\\[\\s*5\\s*\\]", "=\\s*\\{\\s*\\}"], acceptOn: "code", sample: "int m[5][5] = {}, x = 0, y = 0, dir = 0;", why: "两个中括号一个是行数一个是列数，5 乘 5 才装得下 25 个数；后面的初值对子是给全表铺 0，程序靠 0 认哪个格子还没填过。" },
        { id: "q4", type: "code", score: 27, coversTask: 2, stem: "写出探路那一行：拿当前朝向 dir，从 x、y 算出下一格的行下标 nx 和列下标 ny。", acceptRegex: ["int\\s+nx\\s*=\\s*x\\s*\\+\\s*dx\\s*\\[\\s*dir\\s*\\]", "ny\\s*=\\s*y\\s*\\+\\s*dy\\s*\\[\\s*dir\\s*\\]"], acceptOn: "code", sample: "int nx = x + dx[dir], ny = y + dy[dir];", why: "探的是下一格，所以要另开两个名字，不能直接改 x、y。行下标配 dx、列下标配 dy，同一个 dir 竖着读一对数，串了就往错的轴上走。" }
      ],
      selftest: {
        refs: [
          "int main() {\n    for (int v = 1; v <= 25; ++v) {\n    if (nx < 0 || nx > 4 || ny < 0 || ny > 4 || m[nx][ny] != 0) dir = (dir + 1) % 4;\n    int dx[] = {1, 0, -1, 0}, dy[] = {0, 1, 0, -1};\n    int m[5][5] = {}, x = 0, y = 0, dir = 0;\n    int nx = x + dx[dir], ny = y + dy[dir];\n    return 0;\n}\n}\n"],
        wrongs: [
          "",
          "for (int v = 1; v <= 16; ++v)\n    if (nx < 0 || nx > 3 || ny < 0 || ny > 3) dir = (dir + 1) % 4;",
          "int dx[] = {1, 0, -1, 0}, dy[] = {0, -1, 0, 1};",
          "int m[4][4] = {};",
          "int nx = x + dir, ny = y + dir;"],
        loose: [
          "int main() {\n    for (int v = 1; v  <=  25; ++v) {\n    if (nx < 0 || nx >  4 || ny >  4 || nx < 0 || m[nx][ny] != 0)\n    dir = (dir + 1) % 4;\n    int  dx[ ] = { 1 , 0 , -1 , 0 } ;\n    int  dy[ ] = { 0 , 1 , 0 , -1 } ;\n    int  m [ 5 ][ 5 ]  =  {  } ;\n    int  nx  =  x+dx [ dir ] ,\n    ny  =  y +  dy[dir] ;\n    return 0;\n}\n}\n"]
      }
    },
  ]
};
