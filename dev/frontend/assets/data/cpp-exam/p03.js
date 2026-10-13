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
      cid: "c11", kind: "paper", pass: 60,
      title: "第 11 课考试 · 小数盒 double",
      task: "任务题目：用 double 打印自己的体重并保留 1 位小数；把格式里的 2 位改成 5 位，看输出多出什么",
      hint: "想不起来就回看本课【演示 1】的四行打印和【演示 3】的除法升级。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          coversTask: 1,
          stem: "要装身高 1.72，下面哪一行声明是对的？",
          options: ["int height = 1.72;", "double height = 1.72;", "char height = 1.72;", "bool height = 1.72;"],
          answer: 1,
          why: "带小数点的数归 double；int 盒会把它砍成 1，char 只装一个字符，bool 只有真和假两种值。" },
        { id: "q2", type: "output", score: 14,
          coversTask: 1,
          stem: "这两行跑完打印什么？\ndouble weight = 63.4567;\nstd::println(\"{:.1f}\", weight);",
          acceptLines: ["63.5"],
          why: "{:.1f} 表示小数点后留 1 位，末尾四舍五入：63.4567 圆成 63.5。" },
        { id: "q3", type: "choice", score: 12,
          coversTask: 2,
          stem: "double pi = 3.14159265358979; 原来用 {:.2f} 打的是 3.14，改成 {:.5f} 会打出什么？",
          options: ["还是 3.14，多出来的位数被忽略", "3.14159，多打了第 3 到第 5 位", "3.14000，末尾补三个 0", "编译报错，位数只能写 2"],
          answer: 1,
          why: "留几位就把小数点后打出几位，位数够用就直接往下取：3.14159265358979 取 5 位是 3.14159。" },
        { id: "q4", type: "blank", score: 10,
          stem: "double x = 1.5; 用 {:.3f} 打印，屏幕上是什么？（填输出）",
          accept: ["1.500", "1.500 后面带空格也算", "1.5 末尾补两个 0"],
          why: "要求的位数比实际多时末尾补 0，不截断 —— 打出来是 1.500。" },
        { id: "q5", type: "code", score: 18,
          coversTask: 1,
          stem: "（任务题）写一行代码：用 std::println 打印 double 变量 weight，要求小数点后保留 1 位。",
          acceptRegex: ["println\\s*\\(", "\\{\\s*:\\s*\\.\\s*1\\s*f\\s*\\}", "weight"],
          why: "句式是 std::println(\"{:.1f}\", weight); —— 位数写在坑里的冒号后面，f 表示定点小数。" },
        { id: "q6", type: "output", score: 14,
          stem: "这两行打印什么？\ndouble half = 1 / 2.0;\nstd::println(\"{}\", half);",
          acceptLines: ["0.5"],
          why: "分母 2.0 是 double，编译器把分子 1 升级成 1.0 再除，商保住小数，得 0.5。" },
        { id: "q7", type: "multi", score: 14,
          stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["double 存的十进制小数往往是近似值", "0.1 加 0.2 打出来可能带一长串尾巴", "{:.1f} 会把盒子里的值真的改成 1 位小数", "日常算小数用 double 就够，float 省的那点内存不值得"],
          answers: [0, 1, 3],
          why: "格式说明只管打印，盒子里的近似值一个字都没改；其余三条都是本课正文原话。" },
        { id: "q8", type: "choice", score: 6,
          stem: "三门课总分 271、都是 int，直接写 271 / 3 打印平均分，会得到什么结果？",
          options: ["90.33", "90", "91", "编译报错"],
          answer: 1,
          why: "两个整数相除是整除，小数尾巴当场蒸发 —— 想让一边带小数点才保得住小数。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: "63.5", q3: 1, q4: "1.500", q5: 'std::println("{:.1f}", weight);', q6: "0.5", q7: [0, 1, 3], q8: 1 }
        ],
        wrongs: [
          { q1: 0, q2: "63.4", q3: 0, q4: "1.5", q5: 'std::println("{}", weight);', q6: "0", q7: [1, 2], q8: 0 },
          { q1: 2, q2: "63.4567", q3: 2, q4: "1.50", q5: "double weight;", q6: "0.5 ", q7: [0, 2], q8: 2 }
        ],
        loose: [
          { q1: "1", q2: " 63.5 ", q3: "1", q4: "1.500", q5: 'println ( "{: . 1 f }" , weight ) ;', q6: "0.5", q7: [0, 1, 3], q8: "1" }
        ]
      }
    },
    {
      cid: "c12", kind: "paper", pass: 60,
      title: "第 12 课考试 · 字符盒 char 与真假盒 bool",
      task: "任务题目：把 grade 换成 'C'，先猜编号再运行验证；把 true 改成 false，看输出变成什么",
      hint: "想不起来就回看本课【演示 1】的两种问法和【演示 3】的开关那一段。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          coversTask: 1,
          stem: "char grade = 'A'; 里 'A' 的编号是 65。把 grade 换成 'C'，它的编号应该是几？",
          options: ["63", "66", "67", "97"],
          answer: 2,
          why: "字母表相邻字符的编号连着：A 是 65，B 是 66，C 是 67。先猜再运行，猜对了才算真懂。" },
        { id: "q2", type: "output", score: 14,
          coversTask: 1,
          stem: "这三行打印什么？\nchar g = 'C';\nchar next = g + 1;\nstd::println(\"{}\", next);",
          acceptLines: ["D"],
          why: "编号加 1 就是字母表往后挪一格：'C' 的编号 67 加 1 得 68，对应 'D'。" },
        { id: "q3", type: "choice", score: 12,
          coversTask: 2,
          stem: "bool is_student = true; 打印时打的是 true。把它改成 false 之后，屏幕上是什么？",
          options: ["0", "空的一行", "false", "编译报错，false 不能打印"],
          answer: 2,
          why: "println 认得 bool，打的是 true / false 这两个人话字样，不是 1 和 0。" },
        { id: "q4", type: "code", score: 18,
          coversTask: 2,
          stem: "（任务题）写两行：声明一个 bool 变量，记录「今天作业交了吗」，初值 true；再用 std::println 把它打印出来。变量名自取。",
          acceptRegex: ["bool\\s+\\w+\\s*=\\s*true", "println\\s*\\("],
          why: "声明句式是「类型 名字 = 初值;」，bool 的初值只能是 true 或 false（小写）；打印还是 std::println 那个坑。" },
        { id: "q5", type: "blank", score: 10,
          stem: "一个 char 在内存里占 ____ 个字节。（填数字）",
          accept: ["1", "一", "1 个"],
          why: "char 是 1 字节的迷你盒，这是它比 int 省地方的地方；也正因如此装不下一个汉字。" },
        { id: "q6", type: "output", score: 12,
          stem: "这两行打印什么？（一行一条，按顺序写）\nchar digit = '7';\nstd::println(\"{}\", static_cast<int>(digit));\nstd::println(\"{}\", digit - '0');",
          acceptLines: ["55", "7"],
          why: "第一行打的是编号（'7' 是 55），第二行打的是「跟 '0' 的间距」，也就是它代表的数值 7。" },
        { id: "q7", type: "multi", score: 14,
          stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["bool 只有 true 和 false 两种值", "'A' 和 'a' 的编号相同", "单引号圈一个字符，双引号圈的是一串文本", "char 参与加法时是按编号来算的"],
          answers: [0, 2, 3],
          why: "'A' 是 65、'a' 是 97，大小写编号差 32，绝不是同一个值；其余三条都是本课正文与演示的结论。" },
        { id: "q8", type: "choice", score: 8,
          coversTask: 1,
          stem: "你想知道一个 char 盒里存的编号，最清楚的写法是？",
          options: ["直接 println 打印它", "用 static_cast 把它当 int 来看再打印", "用 sizeof 量它", "给它换成双引号"],
          answer: 1,
          why: "直接打印得到的是字符；sizeof 量的是盒子占几字节（永远是 1）；双引号那段是文本，跟编号无关。" }
      ],
      selftest: {
        refs: [
          { q1: 2, q2: "D", q3: 2, q4: "bool homework_done = true;\nstd::println(\"{}\", homework_done);", q5: "1", q6: "55\n7", q7: [0, 2, 3], q8: 1 }
        ],
        wrongs: [
          { q1: 1, q2: "B", q3: 0, q4: "char homework = 'true';", q5: "4", q6: "7\n55", q7: [1, 2], q8: 0 },
          { q1: 3, q2: "68", q3: 1, q4: "bool homework_done = true;", q5: "2", q6: "55", q7: [0, 1, 3], q8: 3 }
        ],
        loose: [
          { q1: "2", q2: " D ", q3: "2", q4: "bool  ok= true ; println( \"{}\" , ok ) ;", q5: "一", q6: "55\n 7 ", q7: [0, 2, 3], q8: "1" }
        ]
      }
    },
    {
      cid: "c13", kind: "paper", pass: 60,
      title: "第 13 课考试 · 文本盒 std::string 初见",
      task: "任务题目：把 name 换成你自己的名字再运行；把双引号改成单引号 '小明' 编译，看报什么错",
      hint: "想不起来就回看本课【演示 1】的三截绳子和「常见坑」第 2 条。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          coversTask: 1,
          stem: "要装「小明」这两个字，下面哪一行写得对？",
          options: ["std::string name = \"小明\";", "char name = \"小明\";", "std::string name = '小明';", "int name = \"小明\";"],
          answer: 0,
          why: "一段文字用 std::string 加双引号；char 只装一个字符，单引号只能圈一个字符，int 那个盒子跟文本没关系。" },
        { id: "q2", type: "choice", score: 12,
          coversTask: 2,
          stem: "把 std::string name = \"小明\"; 里的双引号改成单引号，编译会怎样？",
          options: ["照样运行，打出 小明", "编译报错：单引号只能装一个字符", "存成两个字符，末位补空", "把 小明 变成拼音"],
          answer: 1,
          why: "单引号是 char 的身份证，圈的是恰好一个字符；一段文字必须用双引号 —— 这正是本课任务 2 要你亲眼撞的错。" },
        { id: "q3", type: "choice", score: 12,
          coversTask: 1,
          stem: "std::string a = \"小明\"; 然后写 std::string b = a + \"同学\"; 之后，a 里装的是什么？",
          options: ["还是 小明，一个字没变", "变成 小明同学", "变空了", "报错，a 不能再被引用"],
          answer: 0,
          why: "拼接造的是新盒子，长大的是 b；旧盒子 a 原地不动。想让 a 变长得自己把结果存回它。" },
        { id: "q4", type: "code", score: 24,
          coversTask: 1,
          stem: "（任务题）写四行：引入 string 那个工具箱；声明两个 std::string，一个装你的名字、一个装你的学校；用 + 把它们接成「名字在学校上学」存进第三个 string；用 std::println 打印它。",
          acceptRegex: ["include\\s*<\\s*string\\s*>", "std::string\\s+\\w+\\s*=", "\\+", "println\\s*\\("],
          why: "四步缺一不可：先 include，再声明两个盒子，然后用 + 从左往右接（两段双引号之间夹着 string 才叫拼接），最后 println 打出来。" },
        { id: "q5", type: "blank", score: 8,
          stem: "用 std::string 之前要先写的那一行叫____。（说它的作用，或写那一行都行）",
          accept: ["include string 头文件", "引入 string 工具箱", "include 那一行", "把 string 搬进来"],
          why: "std::string 住在标准库的 string 那个工具箱里，不先请进来编译器就不认这个名字。" },
        { id: "q6", type: "output", score: 12,
          stem: "这四行打印什么？\nstd::string city = \"北京\";\nstd::string tag = \"我在\" + city;\nstd::println(\"{}\", tag);",
          acceptLines: ["我在北京"],
          why: "左边那段双引号被真 string 接住了，拼接成立，结果是两段首尾相接的一整句。" },
        { id: "q7", type: "order", score: 10,
          stem: "把「拼出一句话并打印」的四步排成正确顺序。",
          steps: ["写 #include <string> 把工具箱请进来", "声明 name 和 school 两个 string", "用 + 从左往右把几段接成一句，存进 full", "用 std::println 把 full 打出来"],
          answer: [0, 1, 2, 3],
          why: "顺序就是编译器的接受顺序：先认名字，再有盒子，再拼，最后打印。" },
        { id: "q8", type: "multi", score: 10,
          stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["双引号里的内容是原样装进去的", "两段文本换个先后接，结果一样", "std::string 自己管内存，接东西时自己腾地方", "两段双引号之间放 + 就能直接拼接"],
          answers: [0, 2],
          why: "文本的意义长在顺序里，交换位置结果就变了（同学小明 不等于 小明同学）；两边都只是双引号时那个 + 不是拼接，是号牌相加。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: 1, q3: 0, q4: "#include <string>\nstd::string name = \"李雷\";\nstd::string school = \"职高\";\nstd::string full = name + \"在\" + school + \"上学\";\nstd::println(\"{}\", full);", q5: "include string 头文件", q6: "我在北京", q7: [0, 1, 2, 3], q8: [0, 2] }
        ],
        wrongs: [
          { q1: 1, q2: 0, q3: 1, q4: "std::string name = '李雷';\nstd::println(\"{}\", name);", q5: "编译命令", q6: "北京我在", q7: [1, 0, 2, 3], q8: [1, 3] },
          { q1: 2, q2: 2, q3: 2, q4: "std::string name;", q5: "", q6: "我在", q7: [3, 2, 1, 0], q8: [0, 3] }
        ],
        loose: [
          { q1: "0", q2: "1", q3: "0", q4: "# include  < string >\nstring 名字= \"李雷\" ; // 老师按 std::string 认\ndouble x=1;\nfull = name + school;\nprintln ( \"{}\" , full ) ;", q5: "把 string 搬进来", q6: " 我在北京 ", q7: ["0", "1", "2", "3"], q8: [0, 2] }
        ]
      }
    },
    {
      cid: "c14", kind: "paper", pass: 60,
      title: "第 14 课考试 · 字符串的拼接与长度",
      task: "任务题目：把 name 换成你的拼音，先数数新句子多长，再用 length() 验证；声明空字符串 std::string s = \"\"; 打印 s.empty() 是 true 还是 false",
      hint: "想不起来就回看本课【演示 1】的三行输出和【演示 2】的汉字 3 字节。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          coversTask: 1,
          stem: "想知道一个 string 盒子里装了几字节，下面哪个写法对？",
          options: ["s.length()", "sizeof(s)", "s 的长度", "length(s)"],
          answer: 0,
          why: "问内容长度是叫盒子自己做事：点号后面写 length 加括号。sizeof 量的是盒子本身占几字节，跟内容多少无关。" },
        { id: "q2", type: "output", score: 14,
          coversTask: 1,
          stem: "这三行打印什么？\nstd::string name = \"LiLei\";\nstd::string message = \"Hi, \" + name + \"!\";\nstd::println(\"{}\", message.length());",
          acceptLines: ["10"],
          why: "把每一位数进去：H i 逗号 空格 共 4 位，LiLei 5 位，感叹号 1 位，4 加 5 加 1 得 10 —— 空格和标点一样占位。" },
        { id: "q3", type: "choice", score: 12,
          coversTask: 2,
          stem: "声明一个 std::string s，初值是那对挨在一起的双引号（里面什么都没有）。打印 s.empty() 得到什么？",
          options: ["false，因为盒子存在", "true，因为里面一个字节都没有", "0", "编译报错，空的不许打印"],
          answer: 1,
          why: "empty() 只认「账本上是 0 位」；盒子存在不等于装了东西。装一个空格就不算空了。" },
        { id: "q4", type: "code", score: 18,
          coversTask: 1,
          stem: "（任务题）写两行：用 + 把 greeting 和 name 两个 string 接成一句话存进 message；再用 std::println 打印 message 的长度。",
          acceptRegex: ["message\\s*=\\s*[\\w\"]+\\s*\\+", "length\\s*\\(", "println\\s*\\("],
          why: "两个要点：接的时候左边得是真 string 才叫拼接；打印长度是 message.length() 那个点号句式。" },
        { id: "q5", type: "blank", score: 10,
          stem: "UTF-8 编码里，一个汉字占 ____ 个字节。（填数字）",
          accept: ["3", "三", "3 个"],
          why: "所以「小明」的 length() 是 6 而不是 2 —— 它报的是字节数，不是字数。" },
        { id: "q6", type: "output", score: 12,
          stem: "这四行打印什么？（一行一条，按顺序写）\nstd::string note = \"\";\nstd::println(\"{}\", note.empty());\nnote = note + \"x\";\nstd::println(\"{}\", note.empty());",
          acceptLines: ["true", "false"],
          why: "一开始是空字符串，empty() 答 true；接了一个字符进去就不空了，同一句话改口答 false。" },
        { id: "q7", type: "multi", score: 14,
          stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["空字符串的 length() 报 0", "装了一个空格的字符串不算空", "length() 数的是字节数", "message + 一段文本 会把 message 自己撑长"],
          answers: [0, 1, 2],
          why: "加号造的是新盒子，旧盒子一个字不变；要改自己得把结果写回等号左边。" },
        { id: "q8", type: "choice", score: 8,
          stem: "「盒子名字、一个点、要它做的事」这种句式，本课叫它什么？",
          options: ["成员调用", "变量声明", "头文件引入", "强制换身份"],
          answer: 0,
          why: "点号左边是那个东西，右边是它自己的动作 —— full.length() 就是这么一句。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: "10", q3: 1, q4: "std::string message = greeting + name;\nstd::println(\"{}\", message.length());", q5: "3", q6: "true\nfalse", q7: [0, 1, 2], q8: 0 }
        ],
        wrongs: [
          { q1: 1, q2: "9", q3: 0, q4: "std::println(\"{}\", message);", q5: "2", q6: "false\ntrue", q7: [2, 3], q8: 1 },
          { q1: 3, q2: "8", q3: 2, q4: "message = greeting name", q5: "", q6: "true\ntrue", q7: [0, 3], q8: 3 }
        ],
        loose: [
          { q1: "0", q2: " 10 ", q3: "1", q4: "message = greeting  +  name ;\nprintln ( \"{}\" , message . length ( ) ) ;", q5: "三", q6: "true \n false", q7: [0, 1, 2], q8: "0" }
        ]
      }
    },
    {
      cid: "c15", kind: "paper", pass: 60,
      title: "第 15 课考试 · 按门牌号取字符",
      task: "任务题目：打印 s 的第 4 个字符（想一想门牌号该填几）；把 s[1] 改成 'X'，运行看输出",
      hint: "想不起来就回看本课【演示 2】那张床位表和【演示 1】的最后一个门牌号。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          coversTask: 1,
          stem: "std::string s = \"ABCDE\"; 想打印 s 的**第 4 个**字符，方括号里该填几？",
          options: ["4", "3", "5", "长度"],
          answer: 1,
          why: "门牌号从 0 数起：第 4 个字符的门牌号是 4 减 1 等于 3，那是 D。" },
        { id: "q2", type: "output", score: 14,
          coversTask: 2,
          stem: "这三行打印什么？\nstd::string s = \"ABCDE\";\ns[1] = 'X';\nstd::println(\"{}\", s);",
          acceptLines: ["AXCDE"],
          why: "1 号床位是第二个字符，把它换成 'X'，其余一个字没动 —— 门牌号写在等号左边就是换人。" },
        { id: "q3", type: "choice", score: 10,
          coversTask: 1,
          stem: "s.length() 报 5。最后一个字符的门牌号是几？",
          options: ["5", "4", "0", "6"],
          answer: 1,
          why: "最后一个等于长度减一。写 s[5] 是这个床位根本没有，编译器还不拦你。" },
        { id: "q4", type: "code", score: 20,
          coversTask: 1,
          stem: "（任务题）写两行：声明一个 std::string 变量 s，里面装 ABCDE；再用 std::println 打印它的第 4 个字符。",
          acceptRegex: ["std::string\\s+s\\s*=\\s*\"ABCDE\"", "s\\s*\\[\\s*3\\s*\\]"],
          why: "两行考两件事：声明文本盒的句式，以及「第 4 个」要换算成门牌号 3。" },
        { id: "q5", type: "blank", score: 10,
          stem: "方括号里那个数说的不是「第几个」，而是「离起点____」，所以门牌号从 0 开始数。（填一个词）",
          accept: ["多远", "几步", "多少步", "距离"],
          why: "起点本身离起点 0 步 —— 用「距离」这套眼光看，0 开头就一点不古怪了。" },
        { id: "q6", type: "output", score: 12,
          stem: "这两行打印什么？（一行一条，按顺序写）\nstd::string s = \"ABCDE\";\nstd::println(\"{}\", s[0]);\nstd::println(\"{}\", s[s.length() - 1]);",
          acceptLines: ["A", "E"],
          why: "s[0] 是第一个床位；方括号里可以放算式，长度减一算出来的正是最后一号。" },
        { id: "q7", type: "multi", score: 14,
          stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["按门牌号取出来的是一个 char", "第 n 个字符的门牌号是 n 减 1", "s[长度] 越界时编译器会当场拦下", "把 s[i] 写在等号左边是在换那个位置的字符"],
          answers: [0, 1, 3],
          why: "这一版下标不做检查，越界不报错，程序会读到不该读的地方 —— 「没报错」不等于「对了」。" },
        { id: "q8", type: "choice", score: 8,
          coversTask: 2,
          stem: "std::string s = \"ABCDE\"; 打印 s[3] 会得到什么？",
          options: ["ABCD", "D", "E", "空字符串"],
          answer: 1,
          why: "3 号床位是第 4 个字符，取出来是单个字符 D，不是一整段。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: "AXCDE", q3: 1, q4: "std::string s = \"ABCDE\";\nstd::println(\"{}\", s[3]);", q5: "多远", q6: "A\nE", q7: [0, 1, 3], q8: 1 }
        ],
        wrongs: [
          { q1: 0, q2: "ABCDE", q3: 0, q4: "std::string s = \"ABCDE\";\nstd::println(\"{}\", s[4]);", q5: "第几个", q6: "E\nA", q7: [1, 2], q8: 0 },
          { q1: 2, q2: "XBCDE", q3: 2, q4: "std::println(\"{}\", s);", q5: "", q6: "A", q7: [0, 2, 3], q8: 2 }
        ],
        loose: [
          { q1: "1", q2: " AXCDE ", q3: "1", q4: "std::string s=\"ABCDE\" ; println(\"{}\",s [ 3 ]);", q5: "几步", q6: "A \n E", q7: [0, 1, 3], q8: "1" }
        ]
      }
    }
  ]
};
