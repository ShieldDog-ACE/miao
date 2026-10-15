/* 喵站 · C++ 掌握 考卷分部 p27：第 165–166 课（第九轮）
 * 两份源稿各只有 1 条【任务】，所以 coversTask 一律是 1。
 * 契约：每题分数合计正好 100、任务题合计 ≥50 分、choice ≥2、output ≥1、每题带 why、
 * refs 判 100 / wrongs 判 <60 / loose 判 ≥60。
 * 卷面里所有输出行、桩表数值、错版个数、溢出后的负数，都是本机 g++ -std=c++23 实跑出来的，
 * 与正文 cppm/p27.js 的演示一致。
 */
window.MIAO_CPPM_EXAM_P27 = {
  papers: [
    {
      cid: "m165", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, task: "任务题目：再给第 1 到第 5 人每人减 3 元，想想两根桩该打在哪两格；写完把桩表和还原表都打印出来对一遍，确认第 1 人是 -3、第 5 人是 2", hint: "想不起来就回看本课【演示 3 · 本课任务：再给第 1~5 人各减 3，桩打在哪两格】，桩表那一行和还原那一行都写在它的实测里；退场桩落在哪一格看【常见坑】第二条。",
      notes: ["桩记的是变化量不是钱数：+10 从第二格起进累计值，此后每格都带着它，到第五格那根 -10 累进来正好抵掉。", "打桩是多次打桩、一次还原；前缀和是一次构造、多次查询 —— 两课共用同一个从左往右累加的动作。", "没跑累加那一遍就把桩表打印出来当答案看，看到的全是假数字：第三格那个 5 是变化量，第三人身上其实是 15。", "演示 2 的对拍实测五行全是一致：打桩是等价改写而不是近似，三条指令谁先谁后都不影响结果。", "1000 条指令每条覆盖 5 万格时，打桩法只写 2000 个数，逐格法要写 5000 万格：区间越长、指令越多这道账越划算。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "开出桩表：五个人就开六格，初值全写 0，多出来的那一格是刹车位。", acceptRegex: ["std\\s*::\\s*vector\\s*<\\s*int\\s*>\\s+\\w+\\s*\\(\\s*6\\s*,\\s*0\\s*\\)"], acceptOn: "code", sample: "std::vector<int> d(6, 0);", why: "退场桩落在 r 加 1：整段减到最后一人时它正好要落在刹车位上；只开五格就要写下标 5，而方括号不做边界检查，编译器一声不响。" },
        { id: "q2", type: "code", score: 25, coversTask: 1, stem: "任务第 1 条：再给第 1 到第 5 人各减 3 元 —— 把那两根桩打下去：一根在下标 0 那格减 3，一根在下标 5 那格加回 3。", acceptRegex: ["\\w+\\s*\\[\\s*0\\s*\\]\\s*-=\\s*3\\s*;", "\\w+\\s*\\[\\s*5\\s*\\]\\s*\\+=\\s*3\\s*;"], acceptOn: "code", sample: "d[0] -= 3;   d[5] += 3;", why: "起点那根减 3 会被累加一路带着走，到第五人之后那格再加回 3 才抵干净；同一格上叠第二根桩不用先清成 0，两句都写在同一格会合并。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "原有那两条指令的桩照打：一根加 10 落在下标 1 那格，一根减 10 落在下标 4 那格。", acceptRegex: ["\\w+\\s*\\[\\s*1\\s*\\]\\s*\\+=\\s*10\\s*;", "\\w+\\s*\\[\\s*4\\s*\\]\\s*-=\\s*10\\s*;"], acceptOn: "code", sample: "d[1] += 10;  d[4] -= 10;", why: "给第 2 到第 4 人各加 10，内存里只动两格：中间三格是累加那一遍自己亮起来的。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "还原一遍：一圈 for 从 0 走到 4，把桩表那一格一路累加进当前值。", acceptRegex: ["for\\s*\\(\\s*int\\s+\\w+\\s*=\\s*0\\s*;\\s*\\w+\\s*<\\s*5\\s*;", "\\w+\\s*\\+=\\s*\\w+\\s*\\[\\s*\\w+\\s*\\]\\s*;"], acceptOn: "code", sample: "for (int i = 0; i < 5; ++i) { cur += d[i]; std::print(\"第{}人={} \", i + 1, cur); }", why: "打标记是编码，把桩表还原成答案表靠的就是上一课那句从左往右累加。" },
        { id: "q5", type: "code", score: 15, coversTask: 1, stem: "先把桩表整行打出来看：用 std::print 连着索引和那一格的值打一遍。", acceptRegex: ["std\\s*::\\s*print\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\[\\s*\\w+\\s*\\]"], acceptOn: "code", sample: "for (int i = 0; i < 6; ++i) std::print(\"d[{}]={} \", i, d[i]);", why: "实测这一行是 d[0]=-3 d[1]=10 d[2]=5 d[3]=0 d[4]=-10 d[5]=-2：第五格是两根退场桩合并成的 -2。桩表本身不是答案，看着挺合理的假数字最难查。" },
        { id: "q6", type: "code", score: 15, coversTask: 1, stem: "用一行注释记下你看到的：还原之后第一人和第五人各是多少（把两个数写出来）。", acceptRegex: ["//[^\\n]*[0-9][^\\n]*[0-9]", "//[^\\n]{6,}"], acceptOn: "buffer", sample: "// 还原后第 1 人 = -3，第 5 人 = 2；桩在 0 和 5 这两格", why: "判的是你确实把结果记下来了；记的对不对这块编辑器核对不了 —— 实测还原行是 -3、7、12、12、2。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> d(6, 0);                     // 5 个人，多开 1 格当刹车位\n    d[1] += 10;  d[4] -= 10;                      // 第 2~4 人各 +10\n    d[2] += 5;   d[5] -= 5;                       // 第 3~5 人各 +5\n    d[0] -= 3;   d[5] += 3;                       // 第 1~5 人各 -3：桩在 0 和 5\n    for (int i = 0; i < 6; ++i) std::print(\"d[{}]={} \", i, d[i]);\n    std::println(\"\");\n    int cur = 0;\n    for (int i = 0; i < 5; ++i) { cur += d[i]; std::print(\"第{}人={} \", i + 1, cur); }\n    std::println(\"\");\n    return 0;\n}\n// 还原后第 1 人 = -3，第 5 人 = 2；两根桩落在 0 和 5 这两格\n"],
        wrongs: [
          "",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> d(6, 0);\n    d[1] += 10;  d[4] -= 10;\n    d[2] += 5;   d[5] -= 5;\n    int cur = 0;\n    for (int i = 0; i < 5; ++i) {\n        cur += d[i];\n        std::println(\"第 {} 人身上有 {}\", i + 1, cur);\n    }\n    return 0;\n}\n",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> a(5, 0);\n    for (int i = 1; i <= 4; ++i) a[i] += 10;\n    int total = 0;\n    for (int x : a) total += x;\n    std::println(\"{}\", total);\n    return 0;\n}\n"],
        loose: [
          "#  include < print >\n#  include < vector >\nint  main ( )\n{\n  std :: vector < int >  diff ( 6 , 0 ) ;\n  diff [ 1 ] += 10 ;  diff [ 4 ] -= 10 ;\n  diff [ 2 ] += 5 ;\n  diff [ 0 ] -= 3 ;\n  diff [ 5 ] += 3 ;\n  diff [ 5 ] -= 5 ;\n  for ( int  i  =  0 ;  i  <  6 ;  ++ i )  std :: print ( \" {} : {} \" , i , diff [ i ] ) ;\n  std :: println ( \"\" ) ;\n  int  now  =  0 ;\n  for ( int  i  =  0 ;  i  <  5 ;  ++ i ) { now  +=  diff [ i ] ;  std :: print ( \" {} \" , now ) ; }\n  // 第 1 人是 -3 ，第 5 人是 2\n}\n"]
      }
    },
    {
      cid: "m166", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, task: "任务题目：用四角公式算左上那一块的和，对上 1+2+3 = 6 —— 源稿坐标（0,0）~（0,1）只盖前两格，按「行 0、列 0 到 2」补全再算，顺手把只覆盖前两格的读法也算一遍", hint: "想不起来就回看本课【演示 3 · 本课任务：四角公式算左上那一块，对照 1+2+3 = 6】，三行实测都在它的解读里；错版差几个矩形看【演示 4】，p 表长相看【演示 2】。",
      notes: ["上面一整块加左边一整块，这两块在斜上角那一格重叠了一次，所以加完必须减掉一遍，最后再把这一格自己补上。", "写任务前先把坐标和对照值对齐：1+2+3 是整行三格，得读成行 0、列 0 到 2；照字面只覆盖前两格算出来是 3，公式没错答案也差一截。", "p 表要多开一圈：行数、列数各加一，第 0 行第 0 列全是 0，这样下标碰到 0 时四角公式一行都不用改。", "少加回重角那版实测 60 个矩形只错 18 个，其余贴着上边或左边、重角落在地基 0 上，大半输入看不出问题。", "矩阵改了一格，它右下方所有 p 值统统作废，只能整张重建 —— 这套办法的边界就是矩阵不改、反复问矩形；面积类的和还得换成更宽的整数盒子，只有 6 个数的小例题永远试不出绕回负数。"],
      questions: [
        { id: "q1", type: "code", score: 20, stem: "把 p 表开出来：a 是 2 行 3 列，p 就多开一圈 —— 3 行 4 列，第 0 行第 0 列全填 0。", acceptRegex: ["std\\s*::\\s*vector\\s*<\\s*std\\s*::\\s*vector\\s*<\\s*int\\s*>\\s*>\\s*\\w+\\s*\\(\\s*3\\s*,\\s*std\\s*::\\s*vector\\s*<\\s*int\\s*>\\s*\\(\\s*4\\s*,\\s*0\\s*\\)\\s*\\)"], acceptOn: "code", sample: "std::vector<std::vector<int>> p(3, std::vector<int>(4, 0));", why: "那一圈 0 是地基：问到贴着上边或左边的块时，公式里那个第 0 行第 0 列的项落在现成的 0 上，一行都不用改；少了它就得写 p[-1]，方括号不查边界，读到什么全看运气。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "把表一格的递推写出来：上面那一整块加左边那一整块，减掉斜上角那块被算了两遍的，再把这一格自己补上。", acceptRegex: ["(\\w+)\\s*\\[[^\\]\\n]*\\]\\s*\\[[^\\]\\n]*\\]\\s*=\\s*\\1\\s*\\[[^\\]\\n]*\\]\\s*\\[[^\\]\\n]*\\]\\s*\\+\\s*\\1\\s*\\[[^\\]\\n]*\\]\\s*\\[[^\\]\\n]*\\]\\s*-\\s*\\1\\s*\\[[^\\]\\n]*\\]\\s*\\[[^\\]\\n]*\\]\\s*\\+\\s*\\w+\\s*\\[[^\\]\\n]*\\]\\s*\\[[^\\]\\n]*\\]"], acceptOn: "code", sample: "p[i][j] = p[i-1][j] + p[i][j-1] - p[i-1][j-1] + a[i-1][j-1];", why: "上面一整块和左边一整块在斜上角那一格重叠了一次，各自都把它算进去了，加完得减掉一遍，全课只有这一个道理：多算的减掉。" },
        { id: "q3", type: "code", score: 30, coversTask: 1, stem: "写出四角公式那一句：右下角那格减掉上面那格、减掉左边那格，最后加回斜上角那一格。", acceptRegex: ["(\\w+)\\s*\\[[^\\]\\n]*\\]\\s*\\[[^\\]\\n]*\\]\\s*-\\s*\\1\\s*\\[[^\\]\\n]*\\]\\s*\\[[^\\]\\n]*\\]\\s*-\\s*\\1\\s*\\[[^\\]\\n]*\\]\\s*\\[[^\\]\\n]*\\]\\s*\\+\\s*\\1\\s*\\[[^\\]\\n]*\\]"], acceptOn: "code", sample: "p[x2 + 1][y2 + 1] - p[x1][y2 + 1] - p[x2 + 1][y1] + p[x1][y1]", why: "减两遍把斜上角那块整个减没了，末尾那个加回项就是把它补回来；行 0 列 0 到 2 这一块代进去得 6，正是 1+2+3。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "用一条 std::println 把左上那一块的和打出来：格式串里一个占位坑，逗号后面的实参就写那条四角相加减的式子。", acceptRegex: ["std\\s*::\\s*println\\s*\\(\\s*\"[^\"\\n]*\\{\\}[^\"\\n]*\"\\s*,\\s*[^;\\n]*-"], acceptOn: "code", sample: "std::println(\"行 0 列 0~2 的和 = {}\", p[1][3] - p[0][3] - p[1][0] + p[0][0]);", why: "式子放进实参就会当场算出来：这一行打的是 6。任务把坐标写成到 (0,1) 却对照 1+2+3，得按整行三格补全成列 0 到 2 才对得上，先把坐标和对照值对齐再动公式。" },
        { id: "q5", type: "code", score: 15, stem: "把少加回斜上角那一格的那版也跑一遍，再用一行注释记下你看到的：一共问到多少个矩形、其中错多少个。", acceptRegex: ["//[^\\n]*[0-9][^\\n]*[0-9]", "//[^\\n]{8,}"], acceptOn: "buffer", sample: "// 3 行 4 列共 60 个矩形，少加回重角错 18 个", why: "判的是你确实把这次观察记下来了：记的数字对不对这块编辑器核对不了 —— 实测 60 个只错 18 个，贴着上边或左边的块重角落在地基 0 上照样对，抽查十次能过九次，这类错最难被发现。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<std::vector<int>> a = {{1, 2, 3}, {4, 5, 6}};\n    std::vector<std::vector<int>> p(3, std::vector<int>(4, 0));\n    for (int i = 1; i <= 2; ++i)\n        for (int j = 1; j <= 3; ++j)\n            p[i][j] = p[i-1][j] + p[i][j-1] - p[i-1][j-1] + a[i-1][j-1];\n    std::println(\"整块 = {}\", p[2][3]);\n    std::println(\"行 0 列 0~2 的和 = {}\", p[1][3] - p[0][3] - p[1][0] + p[0][0]);\n    return 0;\n}\n// 一共问到 60 个矩形，少加回重角那一版错了 18 个\n"],
        wrongs: [
          "",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<std::vector<int>> a = {{1, 2, 3}, {4, 5, 6}};\n    std::vector<std::vector<int>> p(2, std::vector<int>(3, 0));\n    for (int i = 0; i < 2; ++i)\n        for (int j = 0; j < 3; ++j)\n            p[i][j] = a[i][j] + a[i][j];\n    std::println(\"行 0 列 0~2 的和 = {}\", p[1][2]);\n    return 0;\n}\n"],
        loose: [
          "#  include < print >\n#  include < vector >\nint  main ( )\n{\n  std :: vector < std :: vector < int > >  a = { { 1 , 2 , 3 } , { 4 , 5 , 6 } } ;\n  std :: vector < std :: vector < int > >  pre ( 3 , std :: vector < int > ( 4 , 0 ) ) ;\n  for ( int  i  =  1 ;  i  <=  2 ;  ++ i )\n      for ( int  j  =  1 ;  j  <=  3 ;  ++ j )\n          pre [ i ] [ j ] = pre [ i - 1 ] [ j ] + pre [ i ] [ j - 1 ] - pre [ i - 1 ] [ j - 1 ] + a [ i - 1 ] [ j - 1 ] ;\n  std :: println ( \"左上这块 = {} \" , pre [ 1 ] [ 3 ] - pre [ 0 ] [ 3 ] - pre [ 1 ] [ 0 ] + pre [ 0 ] [ 0 ] ) ;\n  // 问到 60 个矩形 ， 错的有 18 个\n  return 0 ;\n}\n"]
      }
    },
  ]
};
