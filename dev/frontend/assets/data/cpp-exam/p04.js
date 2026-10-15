/* 喵站 · C++ 入门 考卷分部 p04：第 16–20 课（第九轮）
 *
 * 每场卷照 cpp-exam/p01.js、p02.js 的形状与硬指标（cpp-exam-check 逐条对账）：
 *   1. kind:"paper"，题型只用笔试引擎认的六种（choice/multi/blank/code/output/order）；
 *   2. 各题 score 相加正好 100；
 *   3. 源稿每一条【任务】都有题用 coversTask 对着它（序号从 1 起，一条题可盖多条）；
 *   4. 带 coversTask 的题合计 ≥50 分；choice ≥2；output ≥1；
 *   5. 每题带 why；selftest 的 refs 判 100、wrongs 判 <60、loose 判 ≥60。
 *
 * 本分部两处特殊交代：
 *   · 第 17 课源稿任务 2 是「学完 if 回来补判断」，if 到第 27 课才教，所以这条只用
 *     笔试口径考「该拿什么跟 npos 比」这个结论，不要求写 if。
 *   · 第 19 课的题面必然出现比较运算符；exam-check 对题面只查 lambda/智能指针/模板/异常/
 *     线程/cout 六样，比较运算符不在其列，所以题面照写不误（正文侧的 allowConstructs 见 cpp/p04.js）。
 *
 * 验收：node dev/tools/cpp-exam-check.cjs --only c16,c17,c18,c19,c20
 */
window.MIAO_CPP_EXAM_P04 = {
  papers: [
    {
      cid: "c16", kind: "paper", mode: "ide", authored: "dcbdc046", file: "main.cpp", pass: 60, title: "第 16 课考试 · substr 截取一段", task: "任务题目：从 id 里剪出中间那个横杠（把起点数对），再把 substr(0, 4) 改成 substr(0, 100) 跑一遍，确认它不报错、自动取到结尾为止", hint: "想不起来就回看本课【它被设计成什么样】那张下标窗口图和【演示 3】的剪过头。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 29, coversTask: 2, stem: "（任务题）已有 std::string id = \"2026-0315\"; 请写一行：把 substr(0, 4) 那个长度改成 100，用 std::println 打印出来，验证它不报错。", acceptRegex: ["substr\\s*\\(\\s*0\\s*,\\s*100\\s*\\)"], acceptOn: "code", sample: "std::println(\"{}\", id.substr(0, 100));", why: "答案形状是 std::println(\"{}\", id.substr(0, 100)); —— 要 100 个但只剩 9 个，substr 就把整串给你，安静收住不报错。" },
        { id: "q2", type: "code", score: 36, coversTask: 1, stem: "（任务题）已有 std::string id = 2026-0315; 请写一行：用 substr 从中间剪出那个横杠「-」，交给 std::println 打印出来。想清楚横杠在第几号格、要剪几格。", acceptRegex: ["substr\\s*\\(\\s*4\\s*,\\s*1\\s*\\)"], acceptOn: "code", sample: "std::println(\"{}\", id.substr(4, 1));", why: "门牌号从 0 数：2、0、2、6 站在 0 到 3，横杠就在 4 号格；第二个数字是「拿几格」，只要一格就写 1。" },
        { id: "q3", type: "code", score: 35, coversTask: 1, stem: "（任务题）同一个 std::string id = 2026-0315; 请写一行：只给起点，从 5 号格一路剪到结尾，用一个 std::string 变量接住这份复印件。", acceptRegex: ["std\\s*::\\s*string\\s+\\w+\\s*=\\s*id\\s*\\.\\s*substr\\s*\\(\\s*5\\s*\\)"], acceptOn: "code", sample: "std::string tail = id.substr(5);", why: "第二个参数省略就是「一路取到结尾」，剩下的四格全给你；复印件要用一个 std::string 变量接住，原件 id 一个字不少。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <string>\nint main() {\n    std::println(\"{}\", id.substr(0, 100));\n    std::println(\"{}\", id.substr(4, 1));\n    std::string tail = id.substr(5);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "std::println(\"{}\", id.substr(0, 4));",
          "std::println(\"{}\", id.substr(5, 1));",
          "std::string tail = id.substr(5, 4);"],
        loose: [
          "#include <print>\n#include <string>\nint main() {\n    id . substr ( 0 ,  100 ) ;\n    std::println(\"{}\", id . substr ( 4 ,  1 ) );\n    std::string   head2=id . substr ( 5 ) ;\n    return 0;\n}\n"]
      }
    },
    {
      cid: "c17", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 17 课考试 · find 查找位置", task: "任务题目：在 I love C++ 里找出 love 的返回值并把 l 的门牌号数清楚；再说清「找到了」和「没找到」这两种结果各自长什么样（源稿把判断那一步标成预习，这里只考结论）", hint: "想不起来就回看本课【演示 1】的三行对照和那张「find 的两个出口」机制图。",
      notes: ["find 报回来的是起点门牌号，不是内容也不是真假；门牌从 0 开始数。", "找不到时返回 std::string::npos，打印出来是一串几十位的数字，认长相比背定义靠谱。", "想把找到和没找到分开处理，就把 find 的返回值跟 npos 比，不跟 0 比、也不跟 -1 比。", "find 只报最靠前那一处：banana 里的 na 在 2 号格和 4 号格都出现过，find 返回 2；想要 4 得写 word.find(\"na\", 3)，从 3 号格往后才找。", "把返回值交给 substr 剪出后面一段是最常见的用法；但 npos 一旦当起点喂给 substr，程序当场终止，报错还指着 substr 说话。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "开一个 std::string 装 I love C++，再用一条 std::println 把 find 找 love 的返回值打出来。", acceptRegex: ["std::string\\s+\\w+\\s*=\\s*\"[^\"]*love[^\"]*\"", "\\.find\\s*\\(\\s*\"love\"\\s*\\)"], acceptOn: "code", sample: "std::string text = \"I love C++\";\nstd::println(\"love 的起点 {}\", text.find(\"love\"));", why: "find 报回来的是匹配段的起点门牌，门牌从 0 数：I 占 0 号格、空格占 1 号格，love 的 l 在 2 号格。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "再问一次：用 find 找 C++，把它的起点门牌也打出来。", acceptRegex: ["std::println\\s*\\([^;]*\\.find\\s*\\(\\s*\"C\\+\\+\"\\s*\\)"], acceptOn: "code", sample: "std::println(\"C++ 的起点 {}\", text.find(\"C++\"));", why: "数完前面的 I、空格、love、空格就是 7；要找的东西写成双引号是一段文字，单引号是一个字符。" },
        { id: "q3", type: "code", score: 20, coversTask: 2, stem: "把「到底找到没有」写成一次比较：拿 find 的返回值和 std::string::npos 比一比（不是跟 0 比，也不是跟 -1 比）。", acceptRegex: ["\\.find\\s*\\([^)]*\\)\\s*[!=]=\\s*(std::)?string::npos"], acceptOn: "code", sample: "text.find(\"java\") == std::string::npos", why: "找不到不报错也不返回 -1：回来的是 std::string::npos，一串极大的数字，它是那个编号类型里的最大值。" },
        { id: "q4", type: "code", score: 20, coversTask: 2, stem: "按那条比较的结果分两头打：一条 std::println 里写找到了，另一条里写没找到。", acceptRegex: ["std::println\\s*\\([^)]*找到了", "std::println\\s*\\([^)]*没找到"], acceptOn: "code", sample: "if (text.find(\"java\") == std::string::npos) { std::println(\"没找到\"); } else { std::println(\"找到了\"); }", why: "这一条要的是「找到 / 没找到」两头各有一行打印；把它接成真的分支要等判断那一课，这里判不出你比完有没有分岔，只能看两条打印在不在。" },
        { id: "q5", type: "code", score: 20, stem: "把这份程序写成能跑的形：把打印和字符串两个工具箱都搬进来（两行 #include），再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "#\\s*include\\s*<\\s*string\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n#include <string>\n\nint main() {", why: "缺 #include <print> 就没人认识 std::println，缺 #include <string> 就没人认识 std::string；没有 main，链接器找不到入口。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <string>\n\nint main() {\n    std::string text = \"I love C++\";\n\n    std::println(\"love 的起点 {}\", text.find(\"love\"));\n    std::println(\"C++ 的起点 {}\", text.find(\"C++\"));\n\n    if (text.find(\"java\") == std::string::npos) {\n        std::println(\"没找到\");\n    } else {\n        std::println(\"找到了\");\n    }\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <string>\nint main() {\n    std::string text = \"I love C++\";\n    std::println(\"{}\", text.find(\"love\"));\n    std::println(\"{}\", text.find(\"java\"));\n    return 0;\n}\n",
          "#include <print>\nint main() {\n    std::string s = \"I love C++\";\n    std::println(\"{}\", s.find(\"java\"));\n    if (s.find(\"java\") == -1) { std::println(\"not found\"); }\n    return 0;\n}\n"],
        loose: [
          "#  include  < string >\n#  include <print>\n\nint main ( )\n{\n  std::string  sentence = \"I love C++ today\";\n  auto a = sentence.find( \"love\" );\n  std::println( \"起点 {}\", a );\n  auto b = sentence.find( \"C++\" );\n  std::println( \"第二个起点 {}\", b );\n  bool missing = sentence.find( \"java\" ) != std::string::npos;\n  if ( missing ) { std::println( \"这里是没找到\" ); }\n  else { std::println( \"这里找到了\" ); }\n}\n"]
      }
    },
    {
      cid: "c18", kind: "paper", mode: "ide", authored: "bd4f9fcd", file: "main.cpp", pass: 60, title: "第 18 课考试 · replace / insert / erase 改造字符串", task: "任务题目：把 I love math 里的 love 换成 hate（起点和长度要自己数出来）；再用 insert 给自己的英文名前后各加一个星号", hint: "想不起来就回看本课【演示 2】的换词和【演示 3】的插到末尾，还有那张三台手术前后对比图。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 27, coversTask: 2, stem: "（任务题）已有 std::string name = \"Mika\"; 请写两行：第一行用 insert 在名字最前面加一个星号，第二行用 insert 在名字最后面再加一个星号。", acceptRegex: ["insert\\s*\\(\\s*0[\\s\\S]*insert\\s*\\("], acceptOn: "code", sample: "name.insert(0, \"*\");\nname.insert(name.length(), \"*\");", why: "两处 insert 缺一不可：前面那处起点写 0；末尾那处起点写 name.length() 最稳（也可以手工数：加完第一个星号之后是 5）。" },
        { id: "q2", type: "code", score: 41, coversTask: 1, stem: "（任务题）已有 std::string s = I love math; 请写一行：用 replace 把里面的 love 换成 hate。起点和长度都要自己数出来，别照抄题面。", acceptRegex: ["replace\\s*\\(\\s*2\\s*,\\s*4\\s*,\\s*\"hate\"\\s*\\)"], acceptOn: "code", sample: "s.replace(2, 4, \"hate\");", why: "I 占 0 号格、空格占 1 号格，love 从 2 号起占 2、3、4、5 共 4 格，所以起点 2、长度 4；改完的就是 s 自己，不用变量接。" },
        { id: "q3", type: "code", score: 32, coversTask: 1, stem: "（任务题）还是 std::string s = I love math; 请写一行：这次用 erase 把 love 那 4 格直接挖掉，不补任何东西。起点同样要自己数。", acceptRegex: ["erase\\s*\\(\\s*2\\s*,\\s*4\\s*\\)"], acceptOn: "code", sample: "s.erase(2, 4);", why: "erase 是 replace 的删除版：起点 2、长度 4 数的是同一段，只是第三个参数没有，挖完不补，后面的字符全体往左挪。" }
      ],
      selftest: {
        refs: [
          "int main() {\n    name.insert(0, \"*\");\n    name.insert(name.length(), \"*\");\n    s.replace(2, 4, \"hate\");\n    s.erase(2, 4);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "name.insert(0, \"*\");",
          "s.replace(1, 4, \"hate\");",
          "s.erase(2, 5);"],
        loose: [
          "int main() {\n    name . insert ( 0 ,  \"*\" ) ;\n    name . insert ( 5 ,  \"*\" ) ;\n    s . replace ( 2 ,4 ,  \"hate\"  ) ;\n    s.erase (  2 ,  4  ) ;\n    return 0;\n}\n"]
      }
    },
    {
      cid: "c19", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 19 课考试 · 字符串比大小", task: "任务题目：先猜 apple 和 banana 谁大、写代码验证；再比一比 Zoo 和 apple，看清结果跟直觉不一样的地方并说出为什么", hint: "想不起来就回看本课【演示 1】那四行输出、【演示 3】的大小写搅局，以及那张逐格比编号的图。",
      notes: ["这套比法叫字典序：从前往后逐格比字符编号，先分出大小的那一格说了算。", "大写整段排在小写之前，所以 Zoo 小于 apple，人的字典直觉在这里正好反。", "长度只在前面一路都一样的时候才派得上用场：abc 小于 abcd；abz 和 ac 比，第二格 b 已经赢了 c，尾巴上的 z 救不回来。", "一模一样时 < 不成立，那种情况要问的是 ==；== 还要长度也一样才 true。", "比较不改任何串，它只是回答一个问题，回答是一个真假值，可以交给 bool 盒子装。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "开两个 std::string，一个装 apple，一个装 banana，用一条 std::println 把「前者小于后者」这个比较的结果打出来。", acceptRegex: ["std::string\\s+\\w+\\s*=\\s*\"apple\"", "std::string\\s+\\w+\\s*=\\s*\"banana\"", "std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*<\\s*\\w+"], acceptOn: "code", sample: "std::string x = \"apple\";\nstd::string y = \"banana\";\nstd::println(\"apple < banana ? {}\", x < y);", why: "从第 0 格就开始比字符编号，a 是 97、b 是 98，第一格已经分出胜负，后面看都不看，轮不到长度说话。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "同一对串再问一次：用一条 std::println 打出它们 == 的结果。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*==\\s*\\w+"], acceptOn: "code", sample: "std::println(\"apple == banana ? {}\", x == y);", why: "== 要求每一格都一样、长度也一样才 true；比的动作不改任何串，它只是回答一个是真是假的问题。" },
        { id: "q3", type: "code", score: 25, coversTask: 2, stem: "开第三个串装 Zoo，用一条 std::println 把 Zoo 和 apple 比大小打出来。", acceptRegex: ["std::string\\s+\\w+\\s*=\\s*\"Zoo\"", "std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*<\\s*\\w+"], acceptOn: "code", sample: "std::string z = \"Zoo\";\nstd::println(\"{}\", z < x);", why: "编号表把大写整段排在小写之前（A 到 Z 是 65 到 90，a 到 z 是 97 到 122），Z 的 90 比 a 的 97 小，所以这行打出 true。" },
        { id: "q4", type: "code", score: 15, coversTask: 2, stem: "在 Zoo 那一行旁边写一行注释，记下你看到的和字典直觉是不是一回事（至少写四个字）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "std::println(\"{}\", z < x);   // 反直觉，Zoo 竟然更小", why: "这一条只能判「你写了一行像样的注释」，写没想通判不了 —— 这是这块编辑器判不动的部分。" },
        { id: "q5", type: "code", score: 25, stem: "把这份程序写成能跑的形：把打印和字符串两个工具箱都搬进来（两行 #include），再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "#\\s*include\\s*<\\s*string\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n#include <string>\n\nint main() {", why: "缺 #include <print> 就没人认识 std::println，缺 #include <string> 就没人认识 std::string；没有 main，链接器找不到入口。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <string>\n\nint main() {\n    std::string x = \"apple\";\n    std::string y = \"banana\";\n    std::string z = \"Zoo\";\n\n    std::println(\"apple < banana ? {}\", x < y);\n    std::println(\"apple == banana ? {}\", x == y);\n    std::println(\"Zoo < apple ? {}\", z < x);   // 反直觉，Zoo 竟然更小\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <string>\nint main() {\n    std::string x = \"apple\";\n    std::string y = \"banana\";\n    std::println(\"{}\", x.length());\n    std::println(\"{}\", y.length());\n    return 0;\n}\n",
          "std::string x = \"apple\";\nstd::string y = \"banana\";\nstd::println(\"{}\", x + y);\n"],
        loose: [
          "#  include < string >\n#  include <print>\n\nint main ( )\n{\n  std::string  a = \"apple\";\n  std::string  b = \"banana\";\n  auto c = std::string( \"Zoo\" );\n  std::println( \"谁小 {}\", a < b );\n  std::println( \"相等吗 {}\", a == b );\n  std::println( \"大写 {}\", c < a );\n  // 大写的编号比小写还小，和直觉不一样\n}\n"]
      }
    },
    {
      cid: "c20", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 20 课考试 · cin 从键盘读数", task: "任务题目：把程序跑起来，输入 7 和 8，确认打印出的和是 15；再故意输入 hello，看清两个变量最后是什么值（数读不进去时 a、b 还是 0）", hint: "想不起来就回看本课【演示 1】的两行输入、【演示 3】喂 hello 的那一段，和「它被设计成什么样」那张键盘到盒子的图。",
      notes: [">> 右边必须是已经声明好的变量：cin 只往现成的盒子里灌，它不负责造盒子。", "分隔符空格和回车都算，程序按个数收不按行数收：一次敲 7 空格 8 和分两行敲，效果一样。", "你敲的内容要按下回车才整行交给程序，在那之前程序就在等。", "读失败是安静的：不崩溃、不报错、也不重问一遍，盒子保持原来的值，后面的代码继续执行。", "声明时就写 int a = 0; 是有意的：有初值才认得出读失败长什么样，否则盒子里是内存留下的垃圾。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "先声明两只 int 盒子并给上初值 0，再用一条 std::cin 连着读进两个数（一行写完，两个 >>）。", acceptRegex: ["int\\s+\\w+\\s*=\\s*0\\s*;[\\s\\S]*int\\s+\\w+\\s*=\\s*0\\s*;", "std::cin\\s*>>\\s*\\w+\\s*>>\\s*\\w+"], acceptOn: "code", sample: "int a = 0;\nint b = 0;\nstd::cin >> a >> b;", why: ">> 可以连着写，程序按个数收：两个数用空格或回车分开都行，各灌进一只盒子；箭头指向谁，谁就被灌满。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "用一条 std::println 把这两个数的和打出来（格式串里一个占位坑，逗号后面给那次加法）。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\+\\s*\\w+"], acceptOn: "code", sample: "std::println(\"它们的和是 {}\", a + b);", why: "输入 7 和 8 时这一行打出 15；把和直接写在打印的参数里，就不用再多开一只盒子装结果。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "问用户要输入的那句提示，用不带换行的 std::print 写一行。", acceptRegex: ["std::print\\s*\\(\\s*\""], acceptOn: "code", sample: "std::print(\"请输入两个整数（空格隔开）: \");", why: "提示不换行，光标停在冒号后面，用户就在同一行敲数；换成 std::println 就成提示孤零零一行加一个空行，看着像程序卡住了。" },
        { id: "q4", type: "code", score: 20, coversTask: 2, stem: "读完把两只盒子里的东西一起打出来看看：一条 std::println，格式串里两个占位坑，逗号后面按顺序给那两个变量。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*,\\s*\\w+"], acceptOn: "code", sample: "std::println(\"a = {}, b = {}\", a, b);", why: "这一行就是那台照妖镜：故意敲 hello 时它打出 a = 0, b = 0，读没读进去一眼就看出来。" },
        { id: "q5", type: "code", score: 15, coversTask: 2, stem: "在这一行旁边写一行注释，记下你敲 hello 之后看到的两个数（至少写四个字）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "std::println(\"a = {}, b = {}\", a, b);   // 敲 hello 之后两个都还是 0", why: "这一条只能判「你写了一行像样的注释」，写没写对现象这块编辑器判不了 —— 这是它判不动的部分。" },
        { id: "q6", type: "code", score: 15, stem: "把这份程序写成能跑的形：把键盘和打印两个工具箱都搬进来（两行 #include），再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*iostream\\s*>", "#\\s*include\\s*<\\s*print\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <iostream>\n#include <print>\n\nint main() {", why: "std::cin 和 std::print 住在 iostream 里，std::println 住在 print 里，缺一个就没人认识它们；没有 main，链接器找不到入口。" }
      ],
      selftest: {
        refs: [
          "#include <iostream>\n#include <print>\n\nint main() {\n    int a = 0;\n    int b = 0;\n\n    std::print(\"请输入两个整数（空格隔开）: \");\n    std::cin >> a >> b;\n\n    std::println(\"a = {}, b = {}\", a, b);   // 敲 hello 之后两个都还是 0\n    std::println(\"它们的和是 {}\", a + b);\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <iostream>\n#include <print>\nint main() {\n    int a;\n    std::println(\"{}\", a);\n    return 0;\n}\n",
          "#include <print>\nint main() {\n    int a = 0;\n    int b = 0;\n    std::println(\"请输入两个整数: \");\n    std::cin >> a;\n    return 0;\n}\n"],
        loose: [
          "#  include < iostream >\n#  include <print>\n\nint main ( )\n{\n  int  first = 0;\n  int second = 0;\n  std::print ( \"给两个数 : \" );\n  std::cin >> first >> second ;\n  std::println( \"读回来 {} 和 {}\", first , second );\n  std::println( \"合计 {}\", first + second );\n  // 输入 hello 时两个都是 0\n}\n"]
      }
    },
  ]
};
