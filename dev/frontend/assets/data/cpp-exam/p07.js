/* 喵站 · C++ 入门 考卷分部 p07：第 31–34 课（三目 ?: / 带初始化的 if / while / do-while）
 *
 * 形状与硬指标照 cpp-exam/p01.js、p02.js（cpp-exam-check 逐条对账）：
 *   1. kind:"paper"，题型只用笔试引擎认的六种（choice/multi/blank/code/output/order）；
 *   2. 各题 score 相加正好 100；
 *   3. 源稿每一条【任务】都有题用 coversTask 对着它（序号从 1 起，一条题可盖多条）；
 *   4. 带 coversTask 的题合计 ≥50 分；choice ≥2；output ≥1；
 *   5. 每题带 why；selftest 的 refs 判 100、wrongs 判 <60、loose 判 ≥60。
 *
 * 验收：node dev/tools/cpp-exam-check.cjs --only c31,c32,c33,c34
 */
window.MIAO_CPP_EXAM_P07 = {
  papers: [
    {
      cid: "c31", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 31 课考试 · 二选一快捷方式 ? :", task: "任务题目：把 score 改成 50 看 result 变成什么；用三目写「偶数打印 even，奇数打印 odd」（提示 x % 2 == 0）", hint: "想不起来就回看本课【演示 1】的判定行和【演示 4】把三目塞进打印里那段。",
      notes: ["三目运算符是表达式不是语句：它本身就是一个值，可以当初始值、当参数、当打印坑里的内容；if/else 是语句，自己没有值。", "条件部分建议永远加上一对括号，一眼看出条件到哪里结束，也避开加法这类优先级更高的运算符带来的误会。", "int r = (score >= 60) ? 1 : 0 + 5; 走假分支时 r 是 5，不是 1 或 6：加法的优先级比 ?: 高，0 + 5 先算成 5。", "两个分支一个给数字一个给字符串，编译器会因为定不下类型而报错，两头得是同一种类型。", "从两个候选值里挑一个、逻辑一眼看完时用三目最省；某个分支要连着做三件事，或者分支里要打印两行不同内容，就不该硬塞。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "开一只 int 盒子装分数，值就给 50。", acceptRegex: ["int\\s+\\w+\\s*=\\s*50\\s*;"], acceptOn: "code", sample: "int score = 50;", why: "任务 1 就是要把 85 换成 50 再看走哪一头：50 不小于 60，条件为假，于是走冒号那一头。" },
        { id: "q2", type: "code", score: 25, coversTask: 1, stem: "一行搞定判定：开一只 std::string 盒子，右边用三目写，条件用括号圈起来，问号后面一个值、冒号后面另一个值。", acceptRegex: ["std::string\\s+\\w+\\s*=\\s*\\(\\s*\\w+\\s*(>=|<=|>|<|==|!=)\\s*\\d+\\s*\\)\\s*\\?\\s*\"[^\"]*\"\\s*:\\s*\"[^\"]*\""], acceptOn: "code", sample: "std::string result = (score >= 60) ? \"通过\" : \"未通过\";", why: "三目永远交出一个值，不存在空的：问号后面是真那头的值，冒号后面是假那头的值，两个都得写；正因为它是个值，才能直接放在等号右边当初始值。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "用一条 std::println 把判定结果打出来：格式串里一个占位坑，逗号后面给那只字符串盒子。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "std::println(\"判定: {}\", result);", why: "这一行就是拿来对照你预判的结果的：score 是 50 时它打未通过。" },
        { id: "q4", type: "code", score: 25, coversTask: 2, stem: "任务第 2 条：把奇偶判断直接塞进打印：一条 std::println 的坑里放一个三目，条件写某个数 % 2 == 0，两头一边给 even、一边给 odd。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\(\\s*\\w+\\s*%\\s*2\\s*==\\s*0\\s*\\)\\s*\\?", "\"even\"", "\"odd\""], acceptOn: "code", sample: "std::println(\"{}\", (x % 2 == 0) ? \"even\" : \"odd\");", why: "三目可以直接当打印坑里的内容，不用先开一只盒子接；条件是 x % 2 == 0，偶数走问号那头，奇数走冒号那头。" },
        { id: "q5", type: "code", score: 15, stem: "再写一行谁大取谁：开一只 int 盒子，右边用三目在两只 int 盒子中间挑一个大的。", acceptRegex: ["int\\s+\\w+\\s*=\\s*\\(\\s*\\w+\\s*>\\s*\\w+\\s*\\)\\s*\\?\\s*\\w+\\s*:\\s*\\w+\\s*;"], acceptOn: "code", sample: "int bigger = (a > b) ? a : b;", why: "它的定位就是二选一再存起来这种小场面；分支里要干的不止取值这一件事，就该回到 if/else 或 switch。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <string>\n\nint main() {\n    int score = 50;\n    std::string result = (score >= 60) ? \"通过\" : \"未通过\";\n    std::println(\"判定: {}\", result);\n\n    int a = 7;\n    int b = 3;\n    int bigger = (a > b) ? a : b;\n    std::println(\"较大值: {}\", bigger);\n\n    int x = 10;\n    std::println(\"{}\", (x % 2 == 0) ? \"even\" : \"odd\");\n    x = 7;\n    std::println(\"{}\", (x % 2 == 0) ? \"even\" : \"odd\");\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\nint main() {\n    int score = 50;\n    if (score >= 60) {\n        std::println(\"通过\");\n    } else {\n        std::println(\"未通过\");\n    }\n    return 0;\n}\n",
          "#include <print>\nint main() {\n    int score = 50;\n    std::string result = score >= 60 ? \"通过\" : \"未通过\";\n    std::println(\"{}\", result);\n    return 0;\n}\n"],
        loose: [
          "#  include < string >\n#  include <print>\n\nint main ( )\n{\n  int  pts = 50 ;\n  std::string  pan = ( pts >= 60 ) ? \"过\" : \"没过\" ;\n  std::println( \"判定是 {}\", pan );\n  int m = 2, n = 9;\n  int  max2 = ( m > n ) ? m : n ;\n  int k = 8;\n  std::println( \"奇偶 {}\" , ( k % 2 == 0 ) ?  \"even\" : \"odd\" );\n}\n"]
      }
    },
    {
      cid: "c32", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 32 课考试 · 带初始化的 if", task: "任务题目：把 score 改成 80 判断走哪个分支；取消 if 之后那行注释，看编译器怎么报「answer 未定义」", hint: "想不起来就回看本课【演示 1】的整段和「它被设计成什么样」那三条收益。",
      notes: ["一个变量能被发现的地盘，专业名词叫它的作用域；大括号就是地盘边界，出界即查无此人。", "这种临时变量出了地盘是真的销毁了，不是活着但被编译器禁掉。", "外面已有一个 answer，if 的括号里再声明一个同名 answer，里面那个是独立的新变量，改它不动外面那个。", "换成 auto answer = score * 2 一样好使：右边是整数，它就猜成 int。", "带初始化的写法把寿命缩到最短，代价是出界不能用；那个数在 if 结束之后还要接着用，就该退回在外面声明的老写法。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "开一只 int 盒子装分数，值就给 80。", acceptRegex: ["int\\s+\\w+\\s*=\\s*80\\s*;"], acceptOn: "code", sample: "int score = 80;", why: "任务 1 要的就是把 85 换成 80 再看走哪一支：80 的两倍是 160，大于 150，走 if 那一支。" },
        { id: "q2", type: "code", score: 25, coversTask: 1, stem: "写一条带初始化的 if：括号里分号前声明一只 int 临时盒子，名字就叫 answer，右边是分数乘 2；分号后才是真正的条件，问 answer 大不大于 150。", acceptRegex: ["if\\s*\\(\\s*int\\s+answer\\s*=[^;]*;\\s*answer\\s*>\\s*150\\s*\\)"], acceptOn: "code", sample: "if (int answer = score * 2; answer > 150) {", why: "形状的全部信息量就在那个分号上：分号前是临时准备，分号后是真正的条件，两件事由分号分工。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "给它补上 else 一支：写 } else { ，两支里各用一条 std::println 把 answer 打进占位坑。", acceptRegex: ["\\}\\s*else\\s*\\{", "std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*answer\\s*\\)"], acceptOn: "code", sample: "} else {\n        std::println(\"双倍分数 {} 没超过 150\", answer);", why: "answer 在 else 分支里照样能用：if 和 else 合起来是一条语句，同一块地盘。" },
        { id: "q4", type: "code", score: 25, coversTask: 2, stem: "任务第 2 条：在这整段 if 的右花括号后面，再写一条 std::println 也用 answer —— 这一行编译不过，要的就是你亲眼见它。", acceptRegex: ["\\}\\s*std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*answer\\s*\\)\\s*;"], acceptOn: "code", sample: "    }\n\n    std::println(\"出界还想用它: {}\", answer);", why: "名字绝对不可能泄漏到外面被误用：出界使用被当场抓住，而不是悄悄跑出一个怪数。" },
        { id: "q5", type: "code", score: 15, coversTask: 2, stem: "编译一次，用一行注释抄下报错里那个说法（至少写四个字）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 报错说 answer 在这一层地盘里没声明过", why: "这一条只能判「你写了一行像样的注释」，抄的报错对不对这块编辑器判不了 —— 这是它判不动的部分。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint main() {\n    int score = 80;\n\n    if (int answer = score * 2; answer > 150) {\n        std::println(\"双倍分数 {} 超过 150\", answer);\n    } else {\n        std::println(\"双倍分数 {} 没超过 150\", answer);\n    }\n\n    std::println(\"出界还想用它: {}\", answer);   // 报错说 answer 在这一层地盘里没声明过\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\nint main() {\n    int score = 80;\n    int answer = score * 2;\n    if (answer > 150) {\n        std::println(\"超过 {}\", answer);\n    }\n    return 0;\n}\n",
          "#include <print>\nint main() {\n    int score = 80;\n    if (int answer = score * 2; answer > 150) {\n        std::println(\"超过 {}\", answer);\n    }\n    return 0;\n}\n"],
        loose: [
          "#  include <print>\n\nint main ( )\n{\n  int  pts = 80 ;\n  if ( int answer = pts * 2 ; answer > 150 )\n  {\n    std::println( \"够了 {}\", answer ) ;\n  }\n  else {\n    std::println( \"不够 {}\", answer ) ;\n  }\n  std::println ( \"外面再用 {}\" , answer ) ;\n  // 编译器说这个名字没声明过\n}\n"]
      }
    },
    {
      cid: "c33", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 33 课考试 · while 循环", task: "任务题目：把条件改成 sum <= 10 看看少跑几圈；删掉 n++ 再运行（Ctrl+C 停），亲眼见识死循环", hint: "想不起来就回看本课【演示 2】的 sum 轨迹和【演示 3】的死循环现场。",
      notes: ["while 的执行顺序是问、进、干、再问：判据永远在门口等着，答真才迈进大括号。", "条件一开始就不成立时，循环体一次都不会执行，程序直接从大括号后面接着走。", "判据只管这一圈开始之前的状态，所以超标的那一圈照样干完了才被打断。", "while (sum = 50) 这种写法编译器不一定拦在门外：赋值表达式的值就是 50，非零即为真，条件永远成立，顶多一句警告，程序照跑照死。", "删掉推进那一句并不一定立刻死循环：如果总数还在每圈变，它迟早越过上限，坏掉的是圈数统计 —— 删代码前先想清楚谁在推动条件。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "先把循环三件套的两只盒子摆好：一只装第几圈，初值 1；一只装已攒的总数，初值 0。", acceptRegex: ["int\\s+\\w+\\s*=\\s*1\\s*;", "int\\s+\\w+\\s*=\\s*0\\s*;"], acceptOn: "code", sample: "int n = 1;\nint sum = 0;", why: "累计盒先清零是老规矩；忘了给初值，里面是内存留下的垃圾，可能一进门条件就是假，一圈都没跑。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：把上限换成 10 —— 写一条 while，括号里的条件就是总数小于等于 10，后面跟上花括号。", acceptRegex: ["while\\s*\\(\\s*\\w+\\s*<=\\s*10\\s*\\)\\s*\\{"], acceptOn: "code", sample: "while (sum <= 10) {", why: "条件是进门前问的：10 那一圈开始时问「10 小于等于 10」仍为真，于是明知会超标还是把 5 加了进去。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "在循环体里写一句 +=：把这一圈的圈数并进总数那只盒子。", acceptRegex: ["\\w+\\s*\\+=\\s*\\w+\\s*;"], acceptOn: "code", sample: "sum += n;", why: "循环体里干的事就是这一句并加；sum 的轨迹因此是 1、3、6、10、15。" },
        { id: "q4", type: "code", score: 20, coversTask: 2, stem: "再写一句推进：单独一行的 ++（这一句就是你待会儿要删掉、亲眼去看死循环的那一句）。", acceptRegex: ["\\w+\\s*\\+\\+\\s*;"], acceptOn: "code", sample: "n++;", why: "循环体里必须有人推进条件，否则就是死循环；少了这一句，这一圈就白干。" },
        { id: "q5", type: "code", score: 15, coversTask: 1, stem: "跳出循环之后再打一行：一条 std::println，格式串里两个占位坑，逗号后面按顺序给总数和圈数（圈数就是那只计数器减一）。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*-\\s*1"], acceptOn: "code", sample: "std::println(\"一共跑了 {} 圈，总数是 {}\", n - 1, sum);", why: "n 出口时已经多走一步，所以报圈数要减一；这一行在循环的大括号之外，只执行一次。" },
        { id: "q6", type: "code", score: 15, coversTask: 2, stem: "删掉那一句 ++ 再跑一遍（屏幕刷不停就按 Ctrl+C 停），然后用一行注释写下你看到的现象（至少写四个字）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 没有 n++ 之后屏幕一直刷，非 Ctrl+C 停不下来", why: "这一条只能判「你写了一行像样的注释」，写没写对现场这块编辑器判不了 —— 这是它判不动的部分。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint main() {\n    int n = 1;\n    int sum = 0;\n\n    while (sum <= 10) {\n        sum += n;\n        std::println(\"加上 {} 后 sum = {}\", n, sum);\n        n++;\n    }\n\n    std::println(\"总数 {} 一共跑了 {} 圈\", sum, n - 1);\n    // 把 n++ 删掉再跑，屏幕刷不停，只能 Ctrl+C\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\nint main() {\n    int sum = 0;\n    while (sum <= 50) {\n        sum += 1;\n    }\n    std::println(\"{}\", sum);\n    return 0;\n}\n",
          "int n = 1;\nint sum = 0;\nwhile (sum <= 10) {\n    sum += n;\n}\nstd::println(\"{}\", sum);\n"],
        loose: [
          "#  include <print>\n\nint main ( )\n{\n  int  round = 1;\n  int  total = 0 ;\n  while ( total <= 10 )\n  {\n    total += round ;\n    round ++ ;\n  }\n  std::println( \"{} 和 {}\", total, round - 1 );\n  // 少一句推进就一直刷字\n}\n"]
      }
    },
    {
      cid: "c34", kind: "paper", mode: "ide", authored: "ffb07c56", file: "main.cpp", pass: 60, title: "第 34 课考试 · do-while 循环", task: "任务题目：把 k 的初始值改成 5，说出会连跑几次；用 do-while 写倒计时 3、2、1，最后输出「发射！」", hint: "想不起来就回看本课【演示 2】的圈数算法和【演示 3】的倒计时写法。",
      notes: ["do-while 和 while 的唯一区别是问的时机：条件挪到末尾，循环体因此至少执行一次。", "至少一次不等于只有一次：条件为真就一圈圈继续，do-while 一样可能死循环。", "int k 不初始化是不能省的：垃圾初值照样进圈做一次，还可能让末尾条件一直为真而停不下来。", "「先把菜单打出来，再问要不要继续」这类天生要做一次的活最适合 do-while，换成 while 得先在圈外重复写一遍。", "k 从 5 一路打到 99、每圈末尾 k++ 再问，圈数是上限减起点：5 到 99 一共 95 圈。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "开一只 int 盒子当计数器，初值给 5，然后用 do 和一对花括号起头写一条先干再问的循环。", acceptRegex: ["int\\s+\\w+\\s*=\\s*5\\s*;", "\\bdo\\s*\\{"], acceptOn: "code", sample: "int k = 5;\ndo {", why: "同样的初值、条件、循环体，while 先问是 0 次，do-while 先干是 1 次；差别全在问的时机。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "在循环体里干两件事：用一条 std::println 把计数器打进占位坑，再来一句单独的 ++ 推进它。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\)", "\\w+\\s*\\+\\+\\s*;"], acceptOn: "code", sample: "std::println(\"跑一圈，k = {}\", k);\nk++;", why: "推进条件这件事 do-while 和 while 一字不差：循环体里必须有人动那只盒子，否则末尾的条件永远为真。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "给这条循环收尾：写 } while (计数器小于 100)，右括号后面那个分号别丢。", acceptRegex: ["\\}\\s*while\\s*\\(\\s*\\w+\\s*<\\s*100\\s*\\)\\s*;"], acceptOn: "code", sample: "} while (k < 100);", why: "结尾这个分号是语法的一部分：大括号后面的 while(条件) 单独看是句没说完的话，忘写是本课最快的报错来源。" },
        { id: "q4", type: "code", score: 20, coversTask: 2, stem: "任务第 2 条：再写一条倒计时循环：一只 int 盒子初值 3，循环体里先把它打进一条 std::println，再单独一句 --，末尾条件问它还大于 0 吗，右括号后带分号。", acceptRegex: ["int\\s+\\w+\\s*=\\s*3\\s*;", "std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\)", "\\w+\\s*--\\s*;", "\\}\\s*while\\s*\\(\\s*\\w+\\s*>\\s*0\\s*\\)\\s*;"], acceptOn: "code", sample: "int t = 3;\ndo {\n    std::println(\"{}\", t);\n    t--;\n} while (t > 0);", why: "先干再问：打印 3 后 t 变 2，条件为真再来一圈；打印 1 后 t 变 0，问到 0 大于 0 为假出圈，0 不会被打印。" },
        { id: "q5", type: "code", score: 15, coversTask: 2, stem: "倒计时跑完之后，在循环外面再打一行 std::println，内容就是发射！。", acceptRegex: ["std::println\\s*\\(\\s*\"发射！\"\\s*\\)"], acceptOn: "code", sample: "std::println(\"发射！\");", why: "这一行在 do-while 的大括号之外，整趟只执行一次，正好接在 3、2、1 后面。" },
        { id: "q6", type: "code", score: 15, stem: "把这份程序写成能跑的形：把打印工具箱搬进来（#include），再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n\nint main() {", why: "缺 #include <print> 就没人认识 std::println；没有 main，链接器找不到入口。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint main() {\n    int k = 5;\n\n    do {\n        std::println(\"跑一圈，k = {}\", k);\n        k++;\n    } while (k < 100);\n\n    int t = 3;\n    do {\n        std::println(\"{}\", t);\n        t--;\n    } while (t > 0);\n\n    std::println(\"发射！\");\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\nint main() {\n    int k = 5;\n    while (k < 100) {\n        std::println(\"{}\", k);\n        k++;\n    }\n    std::println(\"发射！\");\n    return 0;\n}\n",
          "int k = 5;\ndo {\n    std::println(\"{}\", k);\n    k++;\n} while (k < 100)\n"],
        loose: [
          "#  include <print>\n\nint main ( )\n{\n  int  cnt = 5 ;\n  do\n  {\n    std::println( \"第 {} 次\", cnt );\n    cnt ++ ;\n  }\n  while ( cnt < 100 ) ;\n\n  int  left = 3;\n  do { std::println(\"{}\", left); left --; } while ( left > 0 ) ;\n  std::println( \"发射！\" ) ;\n}\n"]
      }
    },
  ]
};
