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
      cid: "c16", kind: "paper", mode: "code", authored: "dcbdc046", pass: 60, title: "第 16 课考试 · substr 截取一段", task: "任务题目：从 id 里剪出中间那个横杠（把起点数对），再把 substr(0, 4) 改成 substr(0, 100) 跑一遍，确认它不报错、自动取到结尾为止", hint: "想不起来就回看本课【它被设计成什么样】那张下标窗口图和【演示 3】的剪过头。",
      questions: [
        { id: "q1", type: "code", score: 29, coversTask: 2, stem: "（任务题）已有 std::string id = \"2026-0315\"; 请写一行：把 substr(0, 4) 那个长度改成 100，用 std::println 打印出来，验证它不报错。", acceptRegex: ["substr\\s*\\(\\s*0\\s*,\\s*100\\s*\\)"], sample: "std::println(\"{}\", id.substr(0, 100));", why: "答案形状是 std::println(\"{}\", id.substr(0, 100)); —— 要 100 个但只剩 9 个，substr 就把整串给你，安静收住不报错。" },
        { id: "q2", type: "code", score: 36, coversTask: 1, stem: "（任务题）已有 std::string id = 2026-0315; 请写一行：用 substr 从中间剪出那个横杠「-」，交给 std::println 打印出来。想清楚横杠在第几号格、要剪几格。", acceptRegex: ["substr\\s*\\(\\s*4\\s*,\\s*1\\s*\\)"], sample: "std::println(\"{}\", id.substr(4, 1));", why: "门牌号从 0 数：2、0、2、6 站在 0 到 3，横杠就在 4 号格；第二个数字是「拿几格」，只要一格就写 1。" },
        { id: "q3", type: "code", score: 35, coversTask: 1, stem: "（任务题）同一个 std::string id = 2026-0315; 请写一行：只给起点，从 5 号格一路剪到结尾，用一个 std::string 变量接住这份复印件。", acceptRegex: ["std\\s*::\\s*string\\s+\\w+\\s*=\\s*id\\s*\\.\\s*substr\\s*\\(\\s*5\\s*\\)"], sample: "std::string tail = id.substr(5);", why: "第二个参数省略就是「一路取到结尾」，剩下的四格全给你；复印件要用一个 std::string 变量接住，原件 id 一个字不少。" }
      ],
      selftest: {
        refs: [
          {q1: "std::println(\"{}\", id.substr(0, 100));", q2: "std::println(\"{}\", id.substr(4, 1));", q3: "std::string tail = id.substr(5);"}],
        wrongs: [
          {q1: "std::println(\"{}\", id.substr(0, 4));", q2: "std::println(\"{}\", id.substr(5, 1));", q3: "std::string tail = id.substr(5, 4);"}],
        loose: [
          {q1: "id . substr ( 0 ,  100 ) ;", q2: "std::println(\"{}\", id . substr ( 4 ,  1 ) );", q3: "std::string   head2=id . substr ( 5 ) ;"}]
      }
    },
    {
      cid: "c17", kind: "paper", mode: "quiz", pass: 60, title: "第 17 课考试 · find 查找位置", task: "任务题目：在 I love C++ 里找出 love 的返回值并把 l 的门牌号数清楚；再说清「找到了」和「没找到」这两种结果各自长什么样（源稿把判断那一步标成预习，这里只考结论）", hint: "想不起来就回看本课【演示 1】的三行对照和那张「find 的两个出口」机制图。",
      questions: [
        { id: "q1", type: "choice", score: 15, coversTask: 1, stem: "std::string text = \"I love C++\"; 那么 text.find(\"love\") 的返回值是几？", options: ["2", "3", "1", "7"], answer: 0, why: "I 占 0 号格、空格占 1 号格，l 就在 2 号格。find 报的是起点门牌，而门牌从 0 数。" },
        { id: "q2", type: "output", score: 17, coversTask: 1, stem: "这段代码打印什么？（一行一条）\nstd::string text = \"I love C++\";\nstd::println(\"{}\", text.find(\"love\"));\nstd::println(\"{}\", text.find(\"C++\"));", acceptLines: ["2", "7"], why: "love 从 2 号格起，C++ 从 7 号格起（数完前面的 I、空格、love、空格就是 7）。" },
        { id: "q3", type: "choice", score: 14, coversTask: 2, stem: "用 find 找一段文字，结果这段文字根本不在串里，程序会怎样？", options: ["返回一个极大的数字，它就是 std::string::npos，程序照跑", "返回 -1，所以很好认", "编译就过不去", "当场终止并报一行错"], answer: 0, why: "找不到不报错也不返回 -1：npos 是那个编号类型里的最大值，打印出来是一串几十位的数字，认长相比背定义靠谱。" },
        { id: "q4", type: "blank", score: 11, coversTask: 2, stem: "想把「找到」和「没找到」分开处理，正确做法是把 find 的返回值跟 std::string::____ 比一比。（填三个字母）", accept: ["npos", "std::string::npos", "string::npos"], why: "npos 就是 no position。判断这一步要等学会判断那一课才写得出来，但结论现在就得记住：跟 npos 比，不是跟 0 比、也不是跟 -1 比。" },
        { id: "q5", type: "multi", score: 17, coversTask: [1, 2], stem: "下面关于 find 的说法，哪些是对的？（多选，错勾任何一项整题 0 分）", options: ["它报回来的是匹配段的起点编号", "它会把所有出现的位置一次全列出来", "找不到时打印返回值，会看到一串极大的数字", "把返回值当起点喂给 substr，是它最常见的用法之一"], answers: [0, 2, 3], why: "find 只报最靠前那一处，要往后的得再问一次；「起点交给 substr」正是第 16、17 两课接起来的地方。" },
        { id: "q6", type: "choice", score: 11, stem: "std::string word = \"banana\"; 那么 word.find(\"na\") 返回几？", options: ["2", "4", "1", "0"], answer: 0, why: "\"na\" 在 2 号格和 4 号格都出现过，find 只报最靠前的 2。想要 4 得写 word.find(\"na\", 3)，从 3 号格往后找。" },
        { id: "q7", type: "order", score: 15, stem: "把「用 find 找出某段文字、再把它后面的内容剪出来」的合理步骤排成正确顺序。", answer: [0, 1, 2, 3], steps: ["用 find 问一次，把返回的编号存进变量", "先看这串数字是不是 npos（也就是到底找到没有）", "没找到就按没找到处理，别拿它当下剪刀的位置", "找到了就把这个编号交给 substr，剪到结尾或剪定长度"], why: "第 2、3 步是本课的分水岭：npos 看着像个数字，一旦当成起点喂给 substr，程序当场终止，报错还会指着 substr 说话。" }
      ],
      selftest: {
        refs: [
          {q1: 0, q2: "2\n7", q3: 0, q4: "npos", q5: [0, 2, 3], q6: 0, q7: [0, 1, 2, 3]}],
        wrongs: [
          {q1: 1, q2: "3\n7", q3: 1, q4: "-1", q5: [1, 2], q6: 1, q7: [0, 3, 1, 2]}],
        loose: [
          {q1: "0", q2: "2\n\n 7 ", q3: "0", q4: "string::npos", q5: [3, 2, 0], q6: "0", q7: ["0", "1", "2", "3"]}]
      }
    },
    {
      cid: "c18", kind: "paper", mode: "code", authored: "bd4f9fcd", pass: 60, title: "第 18 课考试 · replace / insert / erase 改造字符串", task: "任务题目：把 I love math 里的 love 换成 hate（起点和长度要自己数出来）；再用 insert 给自己的英文名前后各加一个星号", hint: "想不起来就回看本课【演示 2】的换词和【演示 3】的插到末尾，还有那张三台手术前后对比图。",
      questions: [
        { id: "q1", type: "code", score: 27, coversTask: 2, stem: "（任务题）已有 std::string name = \"Mika\"; 请写两行：第一行用 insert 在名字最前面加一个星号，第二行用 insert 在名字最后面再加一个星号。", acceptRegex: ["insert\\s*\\(\\s*0[\\s\\S]*insert\\s*\\("], sample: "name.insert(0, \"*\");\nname.insert(name.length(), \"*\");", why: "两处 insert 缺一不可：前面那处起点写 0；末尾那处起点写 name.length() 最稳（也可以手工数：加完第一个星号之后是 5）。" },
        { id: "q2", type: "code", score: 41, coversTask: 1, stem: "（任务题）已有 std::string s = I love math; 请写一行：用 replace 把里面的 love 换成 hate。起点和长度都要自己数出来，别照抄题面。", acceptRegex: ["replace\\s*\\(\\s*2\\s*,\\s*4\\s*,\\s*\"hate\"\\s*\\)"], sample: "s.replace(2, 4, \"hate\");", why: "I 占 0 号格、空格占 1 号格，love 从 2 号起占 2、3、4、5 共 4 格，所以起点 2、长度 4；改完的就是 s 自己，不用变量接。" },
        { id: "q3", type: "code", score: 32, coversTask: 1, stem: "（任务题）还是 std::string s = I love math; 请写一行：这次用 erase 把 love 那 4 格直接挖掉，不补任何东西。起点同样要自己数。", acceptRegex: ["erase\\s*\\(\\s*2\\s*,\\s*4\\s*\\)"], sample: "s.erase(2, 4);", why: "erase 是 replace 的删除版：起点 2、长度 4 数的是同一段，只是第三个参数没有，挖完不补，后面的字符全体往左挪。" }
      ],
      selftest: {
        refs: [
          {q1: "name.insert(0, \"*\");\nname.insert(name.length(), \"*\");", q2: "s.replace(2, 4, \"hate\");", q3: "s.erase(2, 4);"}],
        wrongs: [
          {q1: "name.insert(0, \"*\");", q2: "s.replace(1, 4, \"hate\");", q3: "s.erase(2, 5);"}],
        loose: [
          {q1: "name . insert ( 0 ,  \"*\" ) ;\nname . insert ( 5 ,  \"*\" ) ;", q2: "s . replace ( 2 ,4 ,  \"hate\"  ) ;", q3: "s.erase (  2 ,  4  ) ;"}]
      }
    },
    {
      cid: "c19", kind: "paper", mode: "quiz", pass: 60, title: "第 19 课考试 · 字符串比大小", task: "任务题目：先猜 apple 和 banana 谁大、写代码验证；再比一比 Zoo 和 apple，看清结果跟直觉不一样的地方并说出为什么", hint: "想不起来就回看本课【演示 1】那四行输出、【演示 3】的大小写搅局，以及那张逐格比编号的图。",
      questions: [
        { id: "q1", type: "choice", score: 14, coversTask: 1, stem: "按本课的规则，\"apple\" 和 \"banana\" 谁大？", options: ["banana 大：第一格 b 的编号比 a 大", "apple 大：它字母少，短的占上风", "一样大：都是水果", "不能比：字符串没有大小"], answer: 0, why: "从第 0 格就开始比编号，a 是 97、b 是 98，第一格已经分出胜负，后面看都不看，也轮不到长度说话。" },
        { id: "q2", type: "choice", score: 14, coversTask: 2, stem: "\"Zoo\" 和 \"apple\" 相比，程序给的结果是什么？", options: ["\"Zoo\" 小于 \"apple\"，因为 'Z' 的编号 90 比 'a' 的 97 小", "\"apple\" 小于 \"Zoo\"，因为字典里 a 开头的词排在前面", "两者相等", "\"Zoo\" 和 \"apple\" 没法比，编译过不去"], answer: 0, why: "编号表把大写整段排在小写之前（A 到 Z 是 65 到 90，a 到 z 是 97 到 122），所以人的「字典直觉」在这里正好反。" },
        { id: "q3", type: "output", score: 16, coversTask: [1, 2], stem: "这段代码打印什么？（一行一条）\nstd::string a = \"Zoo\";\nstd::string b = \"apple\";\nstd::println(\"{}\", a < b);\nstd::println(\"{}\", a == b);\nstd::println(\"{}\", b < a);", acceptLines: ["true", "false", "true"], why: "第一格 Z(90) 对 a(97)，Zoo 小；== 要求每格一样且长度一样，这里两格就不一样；第三行反过来比自然也是 Zoo 小。" },
        { id: "q4", type: "blank", score: 12, coversTask: 2, stem: "字符串这套「逐格比编号」的比法有个名字，叫____序。（填两个字）", accept: ["字典", "字典顺", "词典"], why: "字典序：逻辑跟翻英文词典排词一样，只不过比的是字符编号，所以大小写混在一起时结果会跟词典不一样。" },
        { id: "q5", type: "choice", score: 12, stem: "\"abz\" 和 \"ac\" 相比，哪个小？", options: ["\"abz\" 小：第二格 b(98) 已经赢了 c(99)", "\"ac\" 小：它长度短", "\"abz\" 小：里面有字母 z", "两个一样大"], answer: 0, why: "先分胜负的那格说了算，尾巴上的 z 编号再大也救不回来；长度只在「前面一路都一样」时才派上用场。" },
        { id: "q6", type: "multi", score: 20, coversTask: [1, 2], stem: "下面这些比较，结果为真的是哪些？（多选，错勾任何一项整题 0 分）", options: ["\"abc\" < \"abd\"", "\"abc\" < \"abcd\"", "\"Zoo\" < \"apple\"", "\"apple\" < \"apple\""], answers: [0, 1, 2], why: "第二条是一路平、短的算小；第四条一模一样时 < 不成立，那种情况要问的是 ==（它才是 true）。" },
        { id: "q7", type: "order", score: 12, stem: "把「逐格比出两个字符串谁小」的过程排成正确顺序。", answer: [0, 1, 2, 3], steps: ["从第 0 格开始，两边各取一个字符", "比这两个格子的字符编号", "一旦分出大小就下结论，后面的格子不再看", "一路都一样的话，先看谁走到末尾：短的算小"], why: "第 3 步那句「先分胜负先收兵」是全部推论的来源，q3 和 q6 都是它的直接结果；第 4 步才是长度唯一发言的机会。" }
      ],
      selftest: {
        refs: [
          {q1: 0, q2: 0, q3: "true\nfalse\ntrue", q4: "字典", q5: 0, q6: [0, 1, 2], q7: [0, 1, 2, 3]}],
        wrongs: [
          {q1: 1, q2: 1, q3: "false\ntrue\ntrue", q4: "笔画", q5: 1, q6: [3], q7: [0, 1, 3, 2]}],
        loose: [
          {q1: "0", q2: "0", q3: " true\nfalse\n true \n", q4: "字典顺序", q5: "0", q6: [2, 1, 0], q7: ["0", "1", "2", "3"]}]
      }
    },
    {
      cid: "c20", kind: "paper", mode: "quiz", pass: 60, title: "第 20 课考试 · cin 从键盘读数", task: "任务题目：把程序跑起来，输入 7 和 8，确认打印出的和是 15；再故意输入 hello，看清两个变量最后是什么值（数读不进去时 a、b 还是 0）", hint: "想不起来就回看本课【演示 1】的两行输入、【演示 3】喂 hello 的那一段，和「它被设计成什么样」那张键盘到盒子的图。",
      questions: [
        { id: "q1", type: "choice", score: 15, coversTask: 1, stem: "程序里有 std::cin >> a >> b;（a、b 都是 int），运行时敲「7 空格 8」再按回车，结果是？", options: ["a 装 7，b 装 8", "a 装 78，b 还是 0", "a 装 7，b 还是 0，因为一次只能读一个", "编译报错：一行不能问两个数"], answer: 0, why: ">> 可以连着写，程序按「个数」收：两个数用空格或回车分开都行，各灌进一只盒子。" },
        { id: "q2", type: "output", score: 17, coversTask: 1, stem: "运行这段代码、按提示输入 7 和 8，屏幕最后打出什么？（一行一条，不必写那句提示）\nint a = 0;\nint b = 0;\nstd::cin >> a >> b;\nstd::println(\"你输入的是 {} 和 {}\", a, b);\nstd::println(\"它们的和是 {}\", a + b);", acceptLines: ["你输入的是 7 和 8", "它们的和是 15"], why: "两个占位坑按顺序填 a、b，所以是「7 和 8」；第二行是那次加法，7 加 8 得 15。" },
        { id: "q3", type: "choice", score: 14, coversTask: 2, stem: "同一程序，运行到要输入时故意敲 hello 再回车，会看到什么？", options: ["两个数都读不进去，a、b 保持 0，程序照样往下跑完", "程序当场崩溃，一行输出也没有", "编译阶段就报错，根本跑不起来", "cin 自己重新问一遍，直到你输入数字"], answer: 0, why: "读失败是「安静」的：cin 不崩溃、不报错、不重问，盒子保持原来的值，后面的代码继续执行，于是你会看到 0 和 0。" },
        { id: "q4", type: "blank", score: 11, coversTask: 2, stem: "输入的东西读不进去时，变量的值保持的是____。（填「初值」「随机垃圾」或「上一次输入的值」之一）", accept: ["初值", "声明时给的值", "出生时的值", "原来的值"], why: "这就是为什么本课要求声明时写 int a = 0;：有初值才能认出「读失败」长什么样，否则里面是内存里的垃圾。" },
        { id: "q5", type: "multi", score: 17, coversTask: [1, 2], stem: "下面关于 std::cin 的说法，哪些是对的？（多选，错勾任何一项整题 0 分）", options: ["箭头右边必须是已经声明好的变量", "你敲的内容要按下回车才交给程序", "一次只能读一个数，想读两个就得写两行 cin", "输入的不是数字时程序会报错并终止"], answers: [0, 1], why: "cin 只往现成的盒子里灌，且攒一行才交；>> 能连着写（第三错），读不进去时它安静地保持初值（第四错）。" },
        { id: "q6", type: "choice", score: 11, stem: "问用户要输入的那句提示，为什么建议用 std::print 而不是 std::println？", options: ["println 打完会换行，光标掉到下一行，看着像程序卡住了", "print 比 println 跑得快", "cin 必须在同一行，否则读不进去", "提示语里没有数字，不能用 println"], answer: 0, why: "提示不换行，用户就在冒号后面敲数，像一句完整对话；换成 println 就成「提示孤零零一行 + 空行等光标」。" },
        { id: "q7", type: "order", score: 15, stem: "把「问用户要两个数并把和打出来」的合理步骤排成正确顺序。", answer: [0, 1, 2, 3], steps: ["声明两只 int 盒子并给上初值 0", "用不带换行的 std::print 打出提示语", "std::cin >> a >> b; 等用户敲完回车", "用 std::println 打印 a、b 和它们的和"], why: "没有盒子就没法灌（第 1 步），没提示用户不知道要敲什么（第 2 步），读失败时靠初值认得出来（第 1 步的另一层意义）。" }
      ],
      selftest: {
        refs: [
          {q1: 0, q2: "你输入的是 7 和 8\n它们的和是 15", q3: 0, q4: "初值", q5: [0, 1], q6: 0, q7: [0, 1, 2, 3]}],
        wrongs: [
          {q1: 1, q2: "你输入的是 7 和 0\n它们的和是 7", q3: 1, q4: "随机垃圾", q5: [2, 3], q6: 2, q7: [1, 0, 3, 2]}],
        loose: [
          {q1: "0", q2: "你输入的是  7 和  8\n它们的和是 15\n", q3: "0", q4: "出生时的值", q5: [1, 0], q6: "0", q7: ["0", "1", "2", "3"]}]
      }
    },
  ]
};
