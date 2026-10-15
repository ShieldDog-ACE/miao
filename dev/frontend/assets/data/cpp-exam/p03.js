/* 喵站 · C++ 入门 考卷分部 p03：第 11–15 课（第九轮）
 *
 * 款式照 cpp-exam/p01.js：每场卷 score 合计正好 100，源稿每条【任务】都有题用 coversTask 对着，
 * 任务题合计 ≥50 分，choice ≥2、output ≥1，每题带 why，selftest 的 refs 判 100、wrongs <60、loose ≥60。
 *
 * 验收：node dev/tools/cpp-exam-check.cjs --only c11,c12,c13,c14,c15
 */
window.MIAO_CPP_EXAM_P03 = {
  papers: [
    {
      cid: "c11", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 11 课考试 · 小数盒 double", task: "任务题目：用 double 打印自己的体重并保留 1 位小数；把格式里的 2 位改成 5 位，看输出多出什么", hint: "想不起来就回看本课【演示 1】的四行打印和【演示 3】的除法升级。",
      notes: ["带小数点的数归 double：int 会砍成 1，char 只装一个字符，bool 只有真和假。", "{:.1f} 这类格式说明只管打印时留几位，末尾四舍五入，盒子里的近似值一个字都没改。", "要求的位数比实际多时末尾补 0，不截断：double x = 1.5 用 {:.3f} 打出来是 1.500。", "double 存的十进制小数往往是近似值：0.1 加 0.2 打出来是 0.30000000000000004。", "两个 int 相除尾巴蒸发：1 / 2 得 0；让一边带上小数点（1 / 2.0）才得 0.5，平均分 271 / 3 同理。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "写一行：用一个 double 装你的体重，值要带小数点。", acceptRegex: ["\\bdouble\\s+\\w+\\s*=\\s*\\d+\\.\\d+\\s*;"], acceptOn: "code", sample: "double weight = 63.4567;", why: "带小数点的数归 double；同一个数写进 int 盒会被砍成 1，尾巴当场蒸发。" },
        { id: "q2", type: "code", score: 25, coversTask: 1, stem: "用一条 std::println 把体重打出来，占位坑写成 {:.1f}：小数点后只留 1 位。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{:\\.1f\\}[^\"]*\"\\s*,\\s*\\w+"], acceptOn: "code", sample: "std::println(\"体重 {:.1f}\", weight);", why: "{:.1f} 表示留 1 位并四舍五入：63.4567 圆成 63.5 —— 但它只管打印，盒子里的值一个字都没改。" },
        { id: "q3", type: "code", score: 20, coversTask: 2, stem: "任务 2 的主角：再用一个 double 装一个小数点后有一长串位数的数（小数点后至少 5 位）。", acceptRegex: ["\\bdouble\\s+\\w+\\s*=\\s*\\d+\\.\\d{5,}\\s*;"], acceptOn: "code", sample: "double pi = 3.14159265358979;", why: "位数给够，才看得出「留 2 位」和「留 5 位」打出来的差别。" },
        { id: "q4", type: "code", score: 20, coversTask: 2, stem: "先用 {:.2f} 把这个数打一遍。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{:\\.2f\\}[^\"]*\"\\s*,\\s*\\w+"], acceptOn: "code", sample: "std::println(\"pi 保留 2 位 = {:.2f}\", pi);", why: "留几位就把小数点后打出几位：这里打出 3.14。" },
        { id: "q5", type: "code", score: 15, coversTask: 2, stem: "再把同一个数用 {:.5f} 打一遍，亲眼看到多出来的是第 3 到第 5 位。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{:\\.5f\\}[^\"]*\"\\s*,\\s*\\w+"], acceptOn: "code", sample: "std::println(\"pi 保留 5 位 = {:.5f}\", pi);", why: "3.14159 是多打了三位而不是补零；要求的位数比实际多时才末尾补 0（1.5 用 {:.3f} 打出 1.500）。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint main() {\n    double weight = 63.4567;\n    std::println(\"体重 {:.1f}\", weight);\n\n    double pi = 3.14159265358979;\n    std::println(\"pi 默认打印 = {}\", pi);\n    std::println(\"pi 保留 2 位 = {:.2f}\", pi);\n    std::println(\"pi 保留 5 位 = {:.5f}\", pi);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\nint main() {\n    double weight = 63.4567;\n    std::println(\"{}\", weight);\n    return 0;\n}\n",
          "#include <print>\nint main() {\n    int weight = 63;\n    std::println(\"{:.1f}\", weight);\n    return 0;\n}\n"],
        loose: [
          "#  include   < print >\nint  main ( )\n{\n  double  my_weight = 55.23814;\n  std::println( \"{:.1f}\",  my_weight );\n  double  e_value = 2.718281828;\n  std::println( \"{:.2f}\" , e_value );\n  std::println( \"{:.5f}\" , e_value );\n}\n"]
      }
    },
    {
      cid: "c12", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 12 课考试 · 字符盒 char 与真假盒 bool", task: "任务题目：把 grade 换成 'C'，先猜编号再运行验证；把 true 改成 false，看输出变成什么", hint: "想不起来就回看本课【演示 1】的两种问法和【演示 3】的开关那一段。",
      notes: ["'A' 的编号是 65、'a' 是 97：大小写编号差 32，绝不是同一个值；字母表里相邻字符的编号连着。", "编号加 1 就是字母表往后挪一格：char next = grade + 1，'C' 打出来是 'D'。", "'7' 当字符打是 7，它的编号是 55；digit - '0' 得到的才是它代表的数值 7。", "char 是 1 字节的迷你盒，装不下一个汉字：单引号圈一个字符，双引号圈的是一串文本。", "bool 只占 1 个字节，只有两种值；想看清编号要用 static_cast 把它当 int，sizeof 量不出来。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "任务 1：写一行 char 声明，右边给单引号圈住的 C（把原来的 'A' 换成它）。", acceptRegex: ["\\bchar\\s+\\w+\\s*=\\s*'C'\\s*;"], acceptOn: "code", sample: "char grade = 'C';", why: "char 是只装一个字符的迷你盒，单引号圈它；'C' 在字母表里的编号是 67。" },
        { id: "q2", type: "code", score: 25, coversTask: 1, stem: "用一条 std::println 打出这个字符的真身编号：用 static_cast 把同一个 char 盒子当 int 来看再打印。", acceptRegex: ["\\bchar\\s+(\\w+)\\s*=\\s*'C'\\s*;[\\s\\S]*std::println\\s*\\([^)]*static_cast\\s*<\\s*int\\s*>\\s*\\(\\s*\\1\\s*\\)"], acceptOn: "code", sample: "std::println(\"grade 的编号 = {}\", static_cast<int>(grade));", why: "直接打印得到的是字符；当 int 来看才露出编号。先在心里猜一个数，运行对上了才算真懂。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "写一行：把那个 char 盒子加 1 存进另一个 char 盒子 —— 编号加一就是字母表往后挪一格。", acceptRegex: ["\\bchar\\s+\\w+\\s*=\\s*\\w+\\s*\\+\\s*1\\s*;"], acceptOn: "code", sample: "char next = grade + 1;", why: "char 参与加法时是按编号来算的：'C' 的 67 加 1 得 68，打出来是 'D'。" },
        { id: "q4", type: "code", score: 15, coversTask: 2, stem: "任务 2：写一行 bool 声明，值给 false（把原来的 true 改成它）。", acceptRegex: ["\\bbool\\s+\\w+\\s*=\\s*false\\s*;"], acceptOn: "code", sample: "bool is_student = false;", why: "bool 是开关不是分数，只有 true 和 false 两个值；写 1 或 0 编译器勉强接受，但那不是本课要的形状。" },
        { id: "q5", type: "code", score: 20, coversTask: 2, stem: "用一条 std::println 把这个 bool 盒子打出来：坑后面逗号跟的就是它，屏幕上出现的是 false 这两个人话字样。", acceptRegex: ["\\bbool\\s+(\\w+)\\s*=\\s*false\\s*;[\\s\\S]*std::println\\s*\\([^)]*\\1\\s*\\)"], acceptOn: "code", sample: "std::println(\"是学生吗 = {}\", is_student);", why: "println 认得 bool，打的是 true / false 而不是 1 和 0；把 true 换成 false，屏幕上跟着换。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint main() {\n    char grade = 'C';\n    std::println(\"grade = {}\", grade);\n    std::println(\"grade 的编号 = {}\", static_cast<int>(grade));\n    char next = grade + 1;\n    std::println(\"下一个 = {}\", next);\n\n    bool is_student = false;\n    std::println(\"是学生吗 = {}\", is_student);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\nint main() {\n    char grade = 'A';\n    std::println(\"{}\", grade);\n    bool is_student = true;\n    std::println(\"{}\", is_student);\n    return 0;\n}\n",
          "#include <print>\nint main() {\n    char grade = \"C\";\n    int n = grade + 1;\n    return 0;\n}\n"],
        loose: [
          "#  include   < print >\nint  main ( )\n{\n  char  mark = 'C';\n  std::println( \"编号 {}\", static_cast < int > ( mark ) );\n  char  later = mark + 1;\n  bool  light_on  =  false;\n  std::println( \"{}\", light_on );\n}\n"]
      }
    },
    {
      cid: "c13", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 13 课考试 · 文本盒 std::string 初见", task: "任务题目：把 name 换成你自己的名字再运行；把双引号改成单引号 '小明' 编译，看报什么错", hint: "想不起来就回看本课【演示 1】的三截绳子和「常见坑」第 2 条。",
      notes: ["一段文字用 std::string 加双引号；char 只装一个字符，单引号只能圈一个字符，双引号圈的是一串文本。", "用 std::string 之前先写 #include <string> 把工具箱请进来，否则编译器不认这个名字。", "拼接造的是新盒子：std::string b = a + \"同学\"; 之后 a 一个字没变；想让 a 变长得把结果存回它自己。", "两段文本换个先后接，结果就变了：同学小明 不等于 小明同学 —— 文本的意义长在顺序里。", "两边都只是双引号时那个 + 是号牌加号牌，编译器不给你拼；得有一边是真 string。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "任务 1：写一行 std::string 声明，右边用双引圈住一段文字，内容换成你自己的名字。", acceptRegex: ["std::string\\s+\\w+\\s*=\\s*\"[^\"]+\"\\s*;"], acceptOn: "code", sample: "std::string name = \"小明\";", why: "一段文字用 std::string 加双引号：char 只装一个字符，int 那个盒子跟文本没关系。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "用 + 把几段文字接成一句完整的话，存进一个新的 std::盒子。", acceptRegex: ["std::string\\s+\\w+\\s*=\\s*\\w+\\s*\\+\\s*\""], acceptOn: "code", sample: "std::string full = name + \"在\" + school + \"上学\";", why: "加号在这里是拼接：得有一边是真 string，两边都只是双引号时那是号牌加号牌，编译器不给你拼。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "用一条 std::println 把刚拼好的那一句打出来：逗号后面跟的就是那个新盒子。", acceptRegex: ["std::string\\s+(\\w+)\\s*=\\s*\\w+\\s*\\+[^;]*;[\\s\\S]*std::println\\s*\\([^)]*\\1\\s*\\)"], acceptOn: "code", sample: "std::println(\"{}\", full);", why: "拼接造的是新盒子，原来那个名字原地不动；长大的是新盒子，所以打印的是它。" },
        { id: "q4", type: "code", score: 20, coversTask: 2, stem: "任务 2：把那一行的双引号换成单引号写出来（'小明' 这种），这一行编译不过，就是要你亲手撞一次。", acceptRegex: ["std::string\\s+\\w+\\s*=\\s*'[^']+'\\s*;"], acceptOn: "code", sample: "std::string name = '小明';", why: "单引号是 char 的身份证，圈的是恰好一个字符；一段文字必须用双引号，这个错在编译阶段就被拦下。" },
        { id: "q5", type: "code", score: 10, coversTask: 2, stem: "在这一行旁边留一行注释（至少四个字），写下报错里的说法。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 报错说 单引号只能装一个字符", why: "正则只能验你写了注释，抄得对不对要复盘核对 —— 这块编辑器判不了注释内容。" },
        { id: "q6", type: "code", score: 15, stem: "把两个工具箱都请进来：打印用的 #include 和 string 用的 #include 各写一行，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "#\\s*include\\s*<\\s*string\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n#include <string>\n\nint main() {", why: "std::string 住在标准库的 string 工具箱里，不先请进来编译器就不认这个名字。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <string>\n\nint main() {\n    std::string name = \"阿明\";\n    std::string school = \"职高\";\n    std::string full = name + \"在\" + school + \"上学\";\n    std::println(\"{}\", full);\n\n    std::string broken = '小明';   // 报错说 单引号只能装一个字符\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\nint main() {\n    std::string name = \"小明\";\n    std::println(\"{}\", name);\n    return 0;\n}\n",
          "std::string a = \"a\";\n"],
        loose: [
          "# include < string >\n#  include  < print >\nint  main ( )\n{\n  std::string  myName = \"Fuka\";\n  std::string  place = \"school\";\n  std::string   sentence = myName + \" is at \" + place;\n  std::println( \"{}\", sentence );\n  std::string one = 'a b';   // 报错提到 single quotes\n}\n"]
      }
    },
    {
      cid: "c14", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 14 课考试 · 字符串的拼接与长度", task: "任务题目：把 name 换成你的拼音，先数数新句子多长，再用 length() 验证；声明空字符串 std::string s = \"\"; 打印 s.empty() 是 true 还是 false", hint: "想不起来就回看本课【演示 1】的三行输出和【演示 2】的汉字 3 字节。",
      notes: ["length() 数的是字节数不是字数：UTF-8 里一个汉字占 3 字节，所以「小明」的 length() 是 6。", "空格和标点跟字母一样占位：\"Hi, \" 加 LiLei 加感叹号，数出来是 10 位。", "empty() 只认账本上是 0 位：盒子存在不等于装了东西；装一个空格就不算空了。", "加号造的是新盒子：message + 一段文本 不会把 message 自己撑长，要改自己得把结果写回等号左边。", "「盒子名字、一个点、要它做的事」这种句式叫成员调用：点号左边是那个东西，右边是它自己的动作。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "任务 1：拼出一句新句子 —— 一个 std::string 声明，右边用 + 把两段接起来，其中一段换成你的拼音。", acceptRegex: ["std::string\\s+\\w+\\s*=\\s*\\w+\\s*\\+", "std::string\\s+\\w+\\s*=\\s*\"[^\"]*\"\\s*\\+"], acceptOn: "code", sample: "std::string message = greeting + \", \" + name + \"!\";", matchAny: true, why: "加号在这里是拼接：得有一边是真 string；两段接完交出一整句，原来那两个盒子一个字没变。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "用一条 std::println 打出这句新句子的长度：逗号后面写「盒子.length()」这种点号句式。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\.length\\s*\\(\\s*\\)\\s*\\)"], acceptOn: "code", sample: "std::println(\"长度 = {}\", message.length());", why: "问内容长度是叫盒子自己做事：点号后面写 length 加括号；sizeof 量的是盒子本身占几字节，跟内容多少无关。" },
        { id: "q3", type: "code", score: 10, coversTask: 1, stem: "在这一行旁边留一行注释（至少四个字），写下你先用手指数出来的位数。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 先数到 18，再让 length() 验证", why: "正则只能验你写了注释，数得对不对要拿 length() 的输出对 —— 数数这一步这块编辑器判不动。" },
        { id: "q4", type: "code", score: 20, coversTask: 2, stem: "任务 2：声明一个空字符串 —— std::string 盒子，右边给挨在一起的一对双引号，里面什么都没有。", acceptRegex: ["std::string\\s+\\w+\\s*=\\s*\"\"\\s*;"], acceptOn: "code", sample: "std::string s = \"\";", why: "空字符串是合法的：账本上 0 位；它跟「装了一个空格」不是一回事。" },
        { id: "q5", type: "code", score: 20, coversTask: 2, stem: "用一条 std::println 打印这个空盒子的 empty()，亲眼看到它答 true 还是 false。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\.empty\\s*\\(\\s*\\)\\s*\\)"], acceptOn: "code", sample: "std::println(\"是空的吗 = {}\", s.empty());", why: "empty() 只认「账本上是 0 位」：盒子存在不等于装了东西，所以这里打出 true。" },
        { id: "q6", type: "code", score: 15, stem: "把两个工具箱都请进来：打印用的 #include 和 string 用的 #include 各写一行，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "#\\s*include\\s*<\\s*string\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n#include <string>\n\nint main() {", why: "std::string 住在标准库的 string 工具箱里，不先请进来编译器就不认这个名字。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <string>\n\nint main() {\n    std::string greeting = \"Hello\";\n    std::string name = \"FuKai\";\n    std::string message = greeting + \", \" + name + \"!\";\n    message = message + \" Welcome\";\n\n    std::println(\"{}\", message);\n    // 先数到 26，再让 length() 验证\n    std::println(\"长度 = {}\", message.length());\n\n    std::string s = \"\";\n    std::println(\"是空的吗 = {}\", s.empty());\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <string>\nint main() {\n    std::string name = \"LiLei\";\n    std::println(\"{}\", name);\n    return 0;\n}\n",
          "std::string a = \"a\";\nint n = a.length();\n"],
        loose: [
          "#  include   < print >\n# include < string >\nint  main ( )\n{\n  std::string head = \"Hi\";\n  std::string  py = \"XiaoMing\";\n  std::string  line = py + \" ok\";\n  std::println( \"{}\", line.length() );   // 我数到 11 个字节\n  std::string  note  =  \"\";\n  std::println( \"{}\", note.empty() );\n}\n"]
      }
    },
    {
      cid: "c15", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 15 课考试 · 按门牌号取字符", task: "任务题目：打印 s 的第 4 个字符（想一想门牌号该填几）；把 s[1] 改成 'X'，运行看输出", hint: "想不起来就回看本课【演示 2】那张床位表和【演示 1】的最后一个门牌号。",
      notes: ["门牌号从 0 数起：第 n 个字符的门牌号是 n 减 1，所以第 4 个要填 3。", "最后一个字符的门牌号等于长度减一：s.length() 报 5 时最后一号是 4，写 s[5] 那个床位根本没有。", "方括号里那个数说的不是「第几个」，而是离起点多远：起点本身离起点 0 步，所以从 0 数起。", "按门牌号取出来是一个 char，不是一整段：s[3] 是 D，不是 ABCD；想要字符的编号就用 static_cast 当 int 看。", "这一版下标不做检查：越界时编译器当场不拦，程序会读到不该读的地方 —— 「没报错」不等于「对了」。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "写一行 std::string 声明，右边给一段至少四个字符的文字 —— 后面要按门牌号取床位，床位得先存在。", acceptRegex: ["std::string\\s+\\w+\\s*=\\s*\"[^\"]{4,}\"\\s*;"], acceptOn: "code", sample: "std::string s = \"ABCDE\";", why: "方括号取的是盒子里现成的床位：先有一段文字，才谈得上第 0 号、第 1 号。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "任务 1：用一条 std::println 打出这段文字的第 4 个字符 —— 方括号里填的门牌号要比 4 小一号。", acceptRegex: ["std::string\\s+(\\w+)\\s*=\\s*\"[^\"]{4,}\"\\s*;[\\s\\S]*std::println\\s*\\([^)]*\\1\\s*\\[\\s*3\\s*\\]"], acceptOn: "code", sample: "std::println(\"第 4 个 = {}\", s[3]);", why: "门牌号从 0 数起：第 4 个字符的门牌号是 4 减 1 等于 3，取出来是单个字符 D。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "再用一条 std::println 打最后一个字符：方括号里放「长度减一」这个算式，别手写成死的数字。", acceptRegex: ["std::println\\s*\\(", "\\[[^\\]]*\\.length\\s*\\(\\s*\\)\\s*-\\s*1[^\\]]*\\]"], acceptOn: "code", sample: "std::println(\"最后一个 = {}\", s[s.length() - 1]);", why: "最后一个门牌号等于长度减一；方括号里可以放算式，文字变长变短它都跟着走。" },
        { id: "q4", type: "code", score: 20, coversTask: 2, stem: "任务 2：写一行赋值，把 1 号床位换成 'X' —— 盒子和方括号写在等号左边。", acceptRegex: ["\\w+\\s*\\[\\s*1\\s*\\]\\s*=\\s*'X'\\s*;"], acceptOn: "code", sample: "s[1] = 'X';", why: "门牌号写在等号左边就是换那个床位上的人：1 号是第二个字符，其余一个字没动。" },
        { id: "q5", type: "code", score: 15, coversTask: 2, stem: "用一条 std::println 把改过之后的整串打出来，看看是不是 AXCDE。", acceptRegex: ["(\\w+)\\s*\\[\\s*1\\s*\\]\\s*=\\s*'X'\\s*;[\\s\\S]*std::println\\s*\\([^)]*\\1\\s*\\)"], acceptOn: "code", sample: "std::println(\"改过后 = {}\", s);", why: "打印整个盒子打的是那一整段文字；上一行只动了 1 号床位那一个字符。" },
        { id: "q6", type: "code", score: 15, stem: "把两个工具箱都请进来：打印用的 #include 和 string 用的 #include 各写一行，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "#\\s*include\\s*<\\s*string\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n#include <string>\n\nint main() {", why: "std::string 住在 string 工具箱里，std::println 住在 print 工具箱里，缺一个都不认。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <string>\n\nint main() {\n    std::string s = \"ABCDE\";\n\n    std::println(\"第一个 s[0] = {}\", s[0]);\n    std::println(\"第 4 个 = {}\", s[3]);\n    std::println(\"最后一个 s[{}] = {}\", s.length() - 1, s[s.length() - 1]);\n\n    s[1] = 'X';\n    std::println(\"改过后 = {}\", s);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <string>\nint main() {\n    std::string s = \"ABCDE\";\n    std::println(\"{}\", s);\n    return 0;\n}\n",
          "std::string s = \"ABC\";\nstd::println(\"{}\", s[4]);\n"],
        loose: [
          "#  include  < print >\n# include < string >\nint  main ( )\n{\n  std::string  word = \"abcdef\";\n  std::println( \"{}\", word[3] );\n  std::println( \"{}\", word[word.length() - 1] );\n  word[ 1 ]  =  'X';\n  std::println( \"{}\", word );\n}\n"]
      }
    },
  ]
};
