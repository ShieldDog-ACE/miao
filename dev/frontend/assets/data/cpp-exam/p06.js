/* 喵站 · C++ 入门 考卷分部 p06：第 26–30 课（第九轮 · 整行输入 + 分支结构）
 *
 * 每场卷照 cpp-exam/p01.js 的形状与硬指标（cpp-exam-check 逐条对账）：
 *   1. kind:"paper"，题型只用笔试引擎认的六种（choice/multi/blank/code/output/order）；
 *   2. 各题 score 相加正好 100；
 *   3. 源稿每一条【任务】都有题用 coversTask 对着它（序号从 1 起，一条题可盖多条）；
 *   4. 带 coversTask 的题合计 ≥50 分；choice ≥2；output ≥1；
 *   5. 每题带 why；selftest 的 refs 判 100、wrongs 判 <60、loose 判 ≥60。
 *
 * 守的闸线：三目 ? : 是第 31 课的东西，本分部五张卷一律不出现在读者看得见的字段里；
 *           if 只在 c27 起的卷里出现，else 从 c28 起，switch 从 c30 起。
 *
 * 验收：node dev/tools/cpp-exam-check.cjs --only c26,c27,c28,c29,c30
 */
window.MIAO_CPP_EXAM_P06 = {
  papers: [
    {
      cid: "c26", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 26 课考试 · 一行文字整段读", task: "任务题目：先输入 hello 再输入 I am a student，说清两个变量各装了什么；删掉 std::cin.ignore(); 再跑，解释第二句为什么没等你打字就结束了", hint: "想不起来就回看本课【演示 1】的勺子、【演示 3】的事故现场，还有那张缓冲区示意图。",
      notes: [">> 设计成遇空白就停，是为了让一行里连着读好几个数：std::cin >> a >> b >> c; 靠的就是把空白当终点。", "getline 一点空白都不跳，这是它和 >> 脾气上最大的不同，也是那起空行事故的根因。", "同一次运行里 >> 之后直接 getline，通常要先 ignore；擦回车这一步必须夹在两次读之间，顺序不能调。", "删掉 ignore 之后程序不会卡住等你：getline 读到那个残留回车就满足结束条件，交出一个空字符串。", "std::string 盒子也可以一次开两只：std::string word = \"??\", line = \"??\"; 逗号接着写下去。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "把这份程序写成能跑的形：把键盘、打印、字符串三个工具箱都搬进来（三行 #include），再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*iostream\\s*>", "#\\s*include\\s*<\\s*print\\s*>", "#\\s*include\\s*<\\s*string\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <iostream>\n#include <print>\n#include <string>\n\nint main() {", why: "std::cin 和 std::cin.ignore 住在 iostream 里，std::println 住在 print 里，std::string 和 std::getline 住在 string 里，缺一个就没人认识它们。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "开两只 std::string 盒子（一只装单词、一只装整句），然后用一条 std::cin >> 舀第一个词。", acceptRegex: ["std::string\\s+\\w+[\\s\\S]*std::string\\s+\\w+", "std::cin\\s*>>\\s*\\w+\\s*;"], acceptOn: "code", sample: "std::string word = \"??\";\nstd::string line = \"??\";\nstd::cin >> word;", why: ">> 是勺子，只舀到下一个空白为止：打 I am a student 它只拿走 I，剩下的 am a student 全留在缓冲区里。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "再用 std::getline 端走一整行：第一个参数写 std::cin，第二个参数给那只装整句的盒子。", acceptRegex: ["std::getline\\s*\\(\\s*std::cin\\s*,\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "std::getline(std::cin, line);", why: "getline 空格照收，读到换行符为止，而且那个换行符不会进字符串；第二个参数必须是一只 std::string 盒子。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "用一条 std::println 把这两样一起打出来：格式串里两个占位坑，逗号后面按顺序给那两只盒子。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*,\\s*\\w+"], acceptOn: "code", sample: "std::println(\"单词 = {} / 整句 = {}\", word, line);", why: "两个坑按顺序填两个值，这一行就是任务 1 要你看的那张对照表：先输 hello 再输 I am a student，出来正好一个是单词一个是整句。" },
        { id: "q5", type: "code", score: 15, coversTask: 2, stem: "在两次读中间夹一句擦回车：std::cin.ignore(); 单独占一行（这一句就是你待会儿要删掉重跑的那一行）。", acceptRegex: ["std::cin\\s*\\.\\s*ignore\\s*\\(\\s*\\)\\s*;"], acceptOn: "code", sample: "std::cin.ignore();", why: ">> 把内容舀走，却把结束那行的回车留在缓冲区；ignore 就是擦掉它，否则 getline 一睁眼撞上的就是这个回车。" },
        { id: "q6", type: "code", score: 15, coversTask: 2, stem: "删掉那一行再跑一遍，然后用一行注释写下第二句打出来的东西（至少写四个字）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 没等你输入，整句打出来是一对空中括号", why: "这一条只能判「你写了一行像样的注释」，写没写对现象这块编辑器判不了 —— 这是它判不动的部分。" }
      ],
      selftest: {
        refs: [
          "#include <iostream>\n#include <print>\n#include <string>\n\nint main() {\n    std::string word = \"??\";\n    std::string line = \"??\";\n\n    std::print(\"输入一个单词: \");\n    std::cin >> word;\n    std::cin.ignore();\n    std::print(\"再输入一句话: \");\n    std::getline(std::cin, line);\n\n    std::println(\"单词 = {} / 整句 = {}\", word, line);\n    // 把 ignore 那行删掉再跑，整句打出来是一对空中括号\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <iostream>\n#include <print>\n#include <string>\nint main() {\n    std::string word = \"??\";\n    std::cin >> word;\n    std::println(\"{}\", word);\n    return 0;\n}\n",
          "std::string s = \"??\";\nstd::string t = \"??\";\nstd::cin >> s;\nstd::getline(std::cin, t);\n"],
        loose: [
          "#  include < string >\n#  include <iostream>\n#  include <print>\n\nint main ( )\n{\n  std::string  one = \"??\",  whole = \"??\";\n  std::print ( \"单词 : \" );\n  std::cin >> one ;\n  std::cin . ignore ( ) ;\n  std::print ( \"整句 : \" );\n  std::getline ( std::cin , whole );\n  std::println( \"{} 配 {}\", one , whole );\n  // 少了 ignore 那句就跳过去，整句是空的\n}\n"]
      }
    },
    {
      cid: "c27", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 27 课考试 · 第一次 if", task: "任务题目：把 score 改成 100，说清哪几段被放行；再把 == 故意写成 =（if (score = 100)），说明编译器的警告是什么、运行后果是什么", hint: "想不起来就回看本课【演示 1】【演示 2】的放行对照，以及【演示 3】的赋值事故。",
      notes: ["条件为 false 时花括号那段整段被跳过，程序继续往后走，被跳过不影响后面那一行照常执行。", "把 score 改成 100 时两个条件同时为 true，两段都被放行，屏幕上会出现三行。", "if (score = 100) 的代价不只是多打一行：score 已经被改掉，后面所有拿它做的运算全乱。", "if (score >= 60); 后面那个分号本身就是一条空语句，花括号于是脱离 if 的管辖，打印变成无条件执行，编译器既不报错也不警告。", "60 <= score <= 90 判断区间是错的写法，它永远为真；要判区间得用 && 把两个条件连起来。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "开一只 int 盒子装 100 当分数，再写第一位门卫：if 的括号里判它大于等于 60，跟上一对花括号。", acceptRegex: ["int\\s+\\w+\\s*=\\s*100\\s*;", "if\\s*\\(\\s*\\w+\\s*>=\\s*60\\s*\\)\\s*\\{"], acceptOn: "code", sample: "int score = 100;\nif (score >= 60) {", why: "if 的括号里放的是一张真假值，比较表达式天生就是它；100 >= 60 是 true，这段就被放行。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "写第二位门卫：另一个 if 用 == 问这只盒子是不是 100，也跟上花括号。", acceptRegex: ["if\\s*\\(\\s*\\w+\\s*==\\s*100\\s*\\)\\s*\\{"], acceptOn: "code", sample: "if (score == 100) {", why: "两个 if 是两位各自站岗的门卫，互不影响；把 score 改成 100 之后两段同时被放行。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "在第二位门卫的花括号里写一条 std::println，打出来的话里带上满分两个字。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*满分"], acceptOn: "code", sample: "std::println(\"满分！\");", why: "这一行就是任务 1 要你对照的那句：改之前的 85 它整段跳过，改成 100 才轮到它执行。" },
        { id: "q4", type: "code", score: 20, coversTask: 2, stem: "任务第 2 条：再写一段 if，把里面的 == 故意写成一个等号（左边是那只盒子，右边装 100），后面照样跟花括号；这一句要真写进代码里，不许留成注释。", acceptRegex: ["if\\s*\\(\\s*\\w+\\s*=\\s*100\\s*\\)\\s*\\{"], acceptOn: "code", sample: "if (score = 100) {\n    std::println(\"满分！\");\n}", why: "它语法合法，所以编译器不报错；赋值表达式自己带值，100 非 0 一律当 true，那段每次都执行，而且 score 已经被改成 100。" },
        { id: "q5", type: "code", score: 15, coversTask: 2, stem: "编译一次，用一行注释写下编译器给的态度和你看到的后果（至少写四个字）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 只有一条警告，没拦下来，这段每次都执行", why: "这一条只能判「你写了一行像样的注释」，抄的到底是警告还是错误这块编辑器判不了 —— 这是它判不动的部分。" },
        { id: "q6", type: "code", score: 15, stem: "把这份程序写成能跑的形：把打印工具箱搬进来（#include），再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n\nint main() {", why: "缺 #include <print> 就没人认识 std::println；没有 main，链接器找不到入口。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint main() {\n    int score = 100;\n\n    if (score >= 60) {\n        std::println(\"{} 分，及格，恭喜！\", score);\n    }\n    if (score == 100) {\n        std::println(\"满分！\");\n    }\n    if (score = 100) {\n        std::println(\"又进了一次满分！\");   // 只有一条警告，这段每次都执行\n    }\n\n    std::println(\"程序照常走到最后一行\");\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\nint main() {\n    int score = 85;\n    if (score >= 60) {\n        std::println(\"及格\");\n    }\n    return 0;\n}\n",
          "int score = 100;\nif (score = 100) {\n    std::println(\"满分\");\n}\n"],
        loose: [
          "#  include <print>\n\nint main ( )\n{\n  int  pts = 100;\n  if ( pts >= 60 ) { std::println( \"{} 分过了\", pts ); }\n  if ( pts == 100 )\n  {\n    std::println( \"这次是真满分\" );\n  }\n  if ( pts = 100 ) { std::println( \"每次都进来\" ); }\n  // 编译只警告了一句，分数也被改成 100 了\n}\n"]
      }
    },
    {
      cid: "c28", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 28 课考试 · 多岔路口 else if", task: "任务题目：把 score 依次改成 95 / 60 / 59 / 3，说出各打出什么档；再把 >=60 那个分支挪到最上面跑 85，解释为什么被打成及格", hint: "想不起来就回看本课【演示 1】后面那张逐档走位表和【演示 3】的顺序事故。",
      notes: ["链的语义是排他：第一个成立的进门，后面的看都不看，链里最多执行一段，一段都不执行也有可能。", "score 是 95 时只打一行优秀，后面两条 else if 连条件都不计算。", "边界就看那一个等号：60 满足大于等于，落在及格这一档；59 才掉进 else。", "几条规则可以同时成立时该用一串独立 if 而不是链，否则后一件事会被前一件事吞掉，一张卷被贴两个档。", "写分档链的合理顺序：列出各档范围确认互斥，最严的写最上面，补一个 else 接住没人要的输入，再用边界值逐个试跑。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "开一只 int 盒子装分数，右边给一个整数初值。", acceptRegex: ["int\\s+\\w+\\s*=\\s*\\d+\\s*;"], acceptOn: "code", sample: "int score = 85;", why: "分档靠这一只盒子被依次改成 95、60、59、3 来试；先有盒子才谈得上往里面装分数。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "写最严的那一档：if 的括号里判它大于等于 90，花括号里用一条 std::println 打出优秀两个字。", acceptRegex: ["if\\s*\\(\\s*\\w+\\s*>=\\s*90\\s*\\)\\s*\\{", "std::println\\s*\\(\\s*\"[^\"]*优秀"], acceptOn: "code", sample: "if (score >= 90) {\n    std::println(\"{} 分：优秀\", score);", why: "写完一条链要从上往下问一遍：这一档成立的范围会不会把下面某一档整个罩住 —— 所以最严的排最上面。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "往下接档：写一条 else if，判这只盒子大于等于 60，后面跟上花括号。", acceptRegex: ["else\\s+if\\s*\\(\\s*\\w+\\s*>=\\s*(60|80)\\s*\\)\\s*\\{"], acceptOn: "code", sample: "} else if (score >= 60) {", why: "能走到这一条就说明前面那档都不成立，小于 90 这件事已经被顺序替你写好了，不用再补一遍。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "最后补一个不带条件的 else 兜底，花括号里用一条 std::println 打出不及格。", acceptRegex: ["\\}\\s*else\\s*\\{", "std::println\\s*\\(\\s*\"[^\"]*不及格"], acceptOn: "code", sample: "} else {\n    std::println(\"{} 分：不及格\", score);", why: "else 天生不带条件，想带条件就得写 else if；这一道门接住前面全不成立的输入，比如 59 和 3。" },
        { id: "q5", type: "code", score: 20, coversTask: 2, stem: "任务第 2 条：再写一条顺序挪位子的链，把判大于等于 60 那一条整个放到最上面，>= 90 那一档跟在它后面当 else if。", acceptRegex: ["if\\s*\\(\\s*\\w+\\s*>=\\s*60\\s*\\)\\s*\\{[\\s\\S]*?else\\s+if\\s*\\(\\s*\\w+\\s*>=\\s*90"], acceptOn: "code", sample: "if (score >= 60) {\n    std::println(\"{} 分：及格\", score);\n} else if (score >= 90) {", why: "85 一进第一道就命中并终止，>= 90 被前面的宽条件整个罩住，成了永远执行不到的死代码；编译器不报错，因为语法完全正确。" },
        { id: "q6", type: "code", score: 15, coversTask: 2, stem: "拿 85 跑一遍这条挪了顺序的链，用一行注释写下它被打成了哪一档、为什么（至少写四个字）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 85 被打成及格，>=90 那一档再也走不到", why: "这一条只能判「你写了一行像样的注释」，写没写对原因这块编辑器判不了 —— 这是它判不动的部分。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint main() {\n    int score = 95;\n\n    if (score >= 90) {\n        std::println(\"{} 分：优秀\", score);\n    } else if (score >= 80) {\n        std::println(\"{} 分：良好\", score);\n    } else if (score >= 60) {\n        std::println(\"{} 分：及格\", score);\n    } else {\n        std::println(\"{} 分：不及格\", score);\n    }\n\n    int trial = 85;\n    if (trial >= 60) {\n        std::println(\"{} 分：及格\", trial);\n    } else if (trial >= 90) {\n        std::println(\"{} 分：优秀\", trial);\n    }\n    // 85 被打成及格，>=90 那一档再也走不到\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\nint main() {\n    int score = 95;\n    if (score >= 90) {\n        std::println(\"优秀\");\n    }\n    return 0;\n}\n",
          "int score = 50;\nif (score >= 60) {\n    std::println(\"及格\");\n} else {\n    std::println(\"不及格\");\n}\n"],
        loose: [
          "#  include <print>\n\nint main ( )\n{\n  int  points = 60;\n  if ( points >= 90 ) { std::println( \"优秀\" ); }\n  else if ( points >= 60 ) { std::println( \"及格\" ); }\n  else { std::println( \"不及格\" ); }\n\n  int x = 85;\n  if (x >= 60) { std::println(\"{} 档\", x); }\n  else if (x >= 90) { std::println(\"高的那档\"); }\n  // 顺序错了，宽的挡在前面\n}\n"]
      }
    },
    {
      cid: "c29", kind: "paper", mode: "ide", authored: "cba782c6", file: "main.cpp", pass: 60, title: "第 29 课考试 · 套娃 if", task: "任务题目：把 age 改成 20、is_student 改成 false，分别说出输出是什么；再在「未成年学生」分支里加一道门，grade 是 'A' 时多打印一行「还是学霸」（先声明 char grade = 'A';）", hint: "想不起来就回看本课【演示 1】后面那张四行走位表，以及【演示 3】的第三道门。",
      notes: ["C++ 编译器完全不看缩进，它只认花括号；嵌套时省掉花括号，代码的层次就可能和你以为的不一样，一律写花括号最稳。", "外层关了门，里面那道门一次都不会被问：is_student 为 false 时只打一行不是学生，age 根本没被看过。", "只挑同时满足两个条件的一群人，用一条 if (is_student && (age < 18)) 更平；进了门还要按下一个条件走不同的路，嵌套更贴合。", "嵌套每加一层，需要验证的组合数就翻一倍：身份两种乘年龄两种，一共四条路都要试一遍。", "外层兜底只有一句话时也可以写成一行：else { std::println(\"不是学生\"); }，花括号照样不能省。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "开两只盒子：一只 bool 装是不是学生，一只 int 装年龄，都直接给上值。", acceptRegex: ["bool\\s+\\w+\\s*=\\s*(true|false)\\s*;", "int\\s+\\w+\\s*=\\s*\\d+\\s*;"], acceptOn: "code", sample: "bool is_student = true;\nint age = 16;", why: "两道门各问一件事：身份是一只 bool 盒子，年龄是一只 int 盒子，先把它们装好才谈得上放行还是跳过。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "写第一道门：if 的括号里就放那只 bool 盒子，后面跟上花括号。", acceptRegex: ["bool\\s+(\\w+)\\s*=\\s*(true|false)\\s*;[\\s\\S]*if\\s*\\(\\s*\\1\\s*\\)\\s*\\{"], acceptOn: "code", sample: "if (is_student) {", why: "if 的括号里要是一对括号圈起来的真假值；把盒子名直接放进去就够了，不用再写 == true。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "在第一道门的花括号里面再写第二道门：if 判年龄小于 18，跟上花括号。", acceptRegex: ["if\\s*\\(\\s*\\w+\\s*<\\s*18\\s*\\)\\s*\\{"], acceptOn: "code", sample: "    if (age < 18) {", why: "能被执行到内层这一行，说明外层的条件已经成立，所以内层不必再把 is_student 重复写一遍。" },
        { id: "q4", type: "code", score: 20, coversTask: 1, stem: "给第二道门补一条 else：用 } else { 开头，里面用一条 std::println 打出成年学生。", acceptRegex: ["\\}\\s*else\\s*\\{", "std::println\\s*\\(\\s*\"[^\"]*成年学生"], acceptOn: "code", sample: "} else {\n            std::println(\"成年学生\");", why: "else 认领的是最近的、还没有配对的那个 if，也就是内层那一道；花括号写全，认领关系一眼可见。" },
        { id: "q5", type: "code", score: 20, coversTask: 2, stem: "任务第 2 条：先声明 char grade = 'A';，再在未成年学生那一段里加第三道门：if 判这只 char 盒子等于 'A'。", acceptRegex: ["char\\s+\\w+\\s*=\\s*'A'\\s*;", "if\\s*\\(\\s*\\w+\\s*==\\s*'A'\\s*\\)\\s*\\{"], acceptOn: "code", sample: "char grade = 'A';\nif (grade == 'A') {", why: "char 盒子装一个字符，用单引号；第三道门套在第二道里面，只有未成年学生那拨人才会被问到它。" },
        { id: "q6", type: "code", score: 15, coversTask: 2, stem: "在第三道门里多打印一行：一条 std::println，话里带上还是学霸四个字。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*还是学霸"], acceptOn: "code", sample: "std::println(\"还是学霸\");", why: "三道门一路放行时输出是两行：先落进未成年学生那段，再在里面命中 grade 等于 A，顺序也是输出顺序。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint main() {\n    bool is_student = true;\n    int age = 16;\n    char grade = 'A';\n\n    if (is_student) {\n        if (age < 18) {\n            std::println(\"未成年学生\");\n            if (grade == 'A') {\n                std::println(\"还是学霸\");\n            }\n        } else {\n            std::println(\"成年学生\");\n        }\n    } else {\n        std::println(\"不是学生\");\n    }\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\nint main() {\n    bool is_student = true;\n    int age = 20;\n    if (is_student) {\n        std::println(\"是学生\");\n    }\n    return 0;\n}\n",
          "#include <print>\nint main() {\n    bool ok = true;\n    int age = 16;\n    if (age < 18) {\n        std::println(\"未成年学生\");\n    } else {\n        std::println(\"成年学生\");\n    }\n    return 0;\n}\n"],
        loose: [
          "#  include <print>\n\nint main ( )\n{\n  bool  is_pupil = true;\n  int   years = 15 ;\n  char  level = 'A';\n  if ( is_pupil )\n  {\n    if ( years < 18 ) {\n      std::println( \"未成年学生\" );\n      if ( level == 'A' ) { std::println( \"还是学霸一只\" ); }\n    }\n    else { std::println( \"成年学生啦\" ); }\n  }\n}\n"]
      }
    },
    {
      cid: "c30", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 30 课考试 · switch 点菜单", task: "任务题目：把 case 2 里的 break 注释掉再运行，说清穿透现场的输出；再加一个 case 3，打印「你选了数学」", hint: "想不起来就回看本课【演示 2】的两行输出和【演示 3】的号码牌并排挂法。",
      notes: ["穿透（fallthrough）是设计好的机制，不是编译错误：C++ 有意留这个口子让几张牌共用同一段代码，代价是忘写 break 不会被拦，只会多执行几行。", "牌面必须是编译期就能定下来的整数或字符常量：小数不收、case score >= 90 这种区间语法错、拿变量当牌面也不行，要判区间得用 else if 链。", "连着写 case 1: case 2: 底下不配语句再只写一句打印，是让两个值共用同一段代码的正经写法。", "运行顺序是：算出 switch 括号里的值，拿它对号码牌找到匹配那张，从那张牌底下开始一行行往下执行，遇到 break 才离开整块 switch。", "default 忘了 break，也可能被前面漏 break 的分支顺路执行掉，兜底牌同样要收尾。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "开一只 int 盒子装选项，值给 2，再用 switch 拿它对号码牌。", acceptRegex: ["int\\s+\\w+\\s*=\\s*2\\s*;", "switch\\s*\\(\\s*\\w+\\s*\\)\\s*\\{"], acceptOn: "code", sample: "int choice = 2;\nswitch (choice) {", why: "switch 是拿值去对号码牌、对上就跳进去，不是从上往下挨个问条件；括号里放的就是那只盒子。" },
        { id: "q2", type: "code", score: 15, stem: "先挂两张号码牌：case 1 和 case 2，各自底下一句 std::println，末尾配 break。", acceptRegex: ["case\\s+1\\s*:", "case\\s+2\\s*:", "std::println\\s*\\(\\s*\"[^\"]*Python\"\\s*\\)\\s*;?\\s*break\\s*;"], acceptOn: "code", sample: "case 1:\n            std::println(\"你选了 Python\"); break;\ncase 2:\n            std::println(\"你选了 C++\"); break;", why: "case 想挂几张挂几张，这正是 switch 比一长串 else if 省事的地方；牌面必须是编译期就定得下来的整数常量。" },
        { id: "q3", type: "code", score: 20, coversTask: 2, stem: "任务第 2 条：再加一张 case 3，底下用一条 std::println 打出你选了数学，再配 break。", acceptRegex: ["case\\s+3\\s*:", "std::println\\s*\\(\\s*\"[^\"]*你选了数学"], acceptOn: "code", sample: "case 3:\n            std::println(\"你选了数学\"); break;", why: "对上报 3 就从 case 3 进场，打印一句、break 离场，default 那张兜底牌一次都没轮到。" },
        { id: "q4", type: "code", score: 15, stem: "补上兜底牌：写一张 default，底下一句 std::println，也别漏了它自己的 break。", acceptRegex: ["default\\s*:", "break\\s*;"], acceptOn: "code", sample: "default:\n            std::println(\"没有这个选项\"); break;", why: "default 可写可不写、位置也能放前放后，但漏了它，非法输入就静悄悄地什么也不做；它自己底下同样要配 break。" },
        { id: "q5", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：让穿透发生 —— case 2 底下只留一句 std::println，把那句 break 注释掉或删掉，让执行流直接滑到 case 3。", acceptRegex: ["case\\s+2\\s*:\\s*std::println\\s*\\(\\s*\"[^\"]*\"\\s*\\)\\s*;?\\s*case\\s+3\\s*:"], acceptOn: "code", sample: "case 2:\n            std::println(\"你选了 C++\");\n            // break;\n        case 3:", why: "case 只是停车位置不是围栏：跳进 case 2 办完没离场，就顺着滑进 case 3 继续执行，直到那里的 break 才离开整块 switch。" },
        { id: "q6", type: "code", score: 15, coversTask: 1, stem: "跑一遍，用一行注释写下这一趟你多看到了哪一行（至少写四个字）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 多看到一行 你选了数学，两行一起打出来", why: "这一条只能判「你写了一行像样的注释」，抄的那一行对不对这块编辑器判不了 —— 这是它判不动的部分。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint main() {\n    int choice = 2;\n\n    switch (choice) {\n        case 1:\n            std::println(\"你选了 Python\"); break;\n        case 2:\n            std::println(\"你选了 C++\");\n            // break; 注释掉它，看穿透现场\n        case 3:\n            std::println(\"你选了数学\"); break;\n        default:\n            std::println(\"没有这个选项\"); break;\n    }\n    // 这一次打了两行，你选了数学是顺路滑出来的\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\nint main() {\n    int choice = 2;\n    switch (choice) {\n        case 1: std::println(\"你选了 Python\"); break;\n        case 2: std::println(\"你选了 C++\"); break;\n        default: std::println(\"没有这个选项\"); break;\n    }\n    return 0;\n}\n",
          "#include <print>\nint main() {\n    int choice = 3;\n    switch (choice) {\n        case 2: std::println(\"你选了 C++\"); break;\n        case 3: std::println(\"你选了数学\"); break;\n        default: std::println(\"没有这个选项\"); break;\n    }\n    return 0;   // 每张牌都要 break\n}\n"],
        loose: [
          "#  include <print>\n\nint main ( )\n{\n  int  pick = 2 ;\n  switch ( pick )\n  {\n    case 1 : std::println( \"你选了 Python\" ) ; break ;\n    case 2 : std::println( \"你选了 C++\" ) ;\n    // 这里把 break 拿掉了\n    case 3 : std::println( \"你选了数学\" ) ; break ;\n    default : std::println( \"没有这个选项\" ) ; break ;\n  }\n  // 顺路多打了一行数学\n}\n"]
      }
    },
  ]
};
