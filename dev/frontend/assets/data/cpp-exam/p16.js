/* 喵站 · C++ 入门 考卷分部 p16：第 67–70 课（第九轮 · const 引用 + 默认参数 + 重载 + 引用当答案格）
 *
 * 每场卷照 cpp-exam/p13.js 的形状与硬指标（cpp-exam-check 逐条对账）：
 *   1. kind:"paper"，题型只用笔试引擎认的六种；
 *   2. 各题 score 相加正好 100；
 *   3. 源稿每一条【任务】都有题用 coversTask 对着它（本批四课各一条任务）；
 *   4. 带 coversTask 的题合计 >=50 分；choice >=2；output >=1；
 *   5. 每题带 why；selftest 的 refs 判 100、wrongs 判 <60、loose 判 >=60。
 *
 * 守的闸线：卷面不出现指针声明、new 与 delete、智能指针、struct、class 这些往后才教的写法；
 *           读者看得见的字段一律用中文括号，交叉引用只往回指。
 *
 * 验收：node dev/tools/cpp-exam-check.cjs --only c67,c68,c69,c70
 */
window.MIAO_CPP_EXAM_P16 = {
  papers: [
    {
      cid: "c67", kind: "paper", pass: 60,
      title: "第 67 课考试 · const 引用：读大对象的标准姿势",
      task: "任务题目：写一只 double average，参数是 const 引用的一串 int 分数，函数只读不写，把平均分算出来还回来并打印掉",
      hint: "想不起来就回看正文【演示 3】三种带法同框那一段、【任务】第 1 条，以及【常见坑】第一条。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          coversTask: 1,
          stem: "要写一只只求平均分的 average：名单读一遍就还回来，函数绝不改动它。下面哪一版参数表最贴本课的姿势？",
          options: ["const std::vector<int>& v　——　只读的外号", "std::vector<int> v　——　整本复印一份", "std::vector<int>& v　——　可写的外号", "int v　——　一个格子装不下一串数"],
          answer: 0,
          why: "只读大对象的标准姿势是 const 和 & 一起上：一个元素都不抄，还向编译器保证不写。第二版喊一次抄一整本；第三版开口承诺要改原件；第四版根本收不下一串分数。" },
        { id: "q2", type: "output", score: 14,
          coversTask: 1,
          stem: "这段程序打印什么？（一行一条，两行）\ndouble average(const std::vector<int>& v) {\n    double sum = 0;\n    for (const int& x : v) sum = sum + x;\n    return sum / v.size();\n}\nint main() {\n    std::vector<int> s = {85, 92, 58, 73};\n    std::println(\"平均 {:.1f} 分\", average(s));\n    std::println(\"名单里有 {} 个\", s.size());\n    return 0;\n}",
          acceptLines: ["平均 77.0 分", "名单里有 4 个"],
          why: "85 加 92 加 58 加 73 是 308，除以 4 得 77；格式串那位要求固定一位小数，所以印成 77.0。第二行读的是名单的长度 4。" },
        { id: "q3", type: "code", score: 14,
          coversTask: 1,
          stem: "把 average 的函数头写出来：收一份只读不许动的 int 名单，还一个小数形式的平均分。函数体不用写。",
          acceptRegex: ["const\\s+std::vector\\s*<\\s*int\\s*>\\s*&"],
          why: "关键是 const、std::vector<int>、& 三样一起出现：缺 & 就变成整本复印，缺 const 就写不了只递进来的临时名单，也保不住「我不动它」这句承诺。" },
        { id: "q4", type: "choice", score: 12,
          stem: "函数里顺手写了一句 v[0] = 99，被编译器拦下。报错最贴近下面哪一句？",
          options: ["error: no matching function for call to 'average'", "error: cannot assign to variable 'v' being const-referenced", "error: expected ';' after expression", "不报错，只是外面看不见这次改动"],
          answer: 1,
          why: "参数带 const，顺着这份外号看出去的每一格都只读。它不是配不上函数、也不是漏了分号，而是这个写动作压根不许发生 —— 这正是本课那条只读通道的用处。" },
        { id: "q5", type: "blank", score: 10,
          stem: "源稿那句口诀补全：只读就 const &，要改才用____引用，小整数随便传值。（填一个字）",
          accept: ["裸", "光"],
          why: "不带 const 的那个 & 就是可写外号，第 60 课拿它改原件；挂上 const 就成了只读通道，两个词换来两种权利。" },
        { id: "q6", type: "multi", score: 14,
          coversTask: [1],
          stem: "下面关于这只 average 的说法，哪些是对的？（多选，错勾任何一项整题 0 分）",
          options: ["参数带 & 表示整本名单一个元素都不抄", "参数带 const 表示函数里不许写这份名单", "const 漏掉之后，把临时造出来的名单递进去会被拦", "循环里写 auto x : v 比 const int& x 更省"],
          answers: [0, 1, 2],
          why: "第四条说反了：auto 每转一圈复制一个元素，const int& 才是念名字不抄名字。前三条就是本课的三块基石，第三条那种「临时名单配不上裸引用」最容易忘。" },
        { id: "q7", type: "order", score: 14,
          stem: "把「按本课姿势写一只只读名单的函数」这四步排成正确顺序。",
          steps: ["在函数头把参数写成 const std::vector<int>& 那一型", "先定性质：这份名单我只要读，一个格子都不写", "调用处把名单递进去，编译器给的是外号不是复印件", "函数体里用 const int& 作循环变量，逐个读"],
          answer: [1, 0, 3, 2],
          why: "先问只读还是要写，才谈得上怎么写函数头；参数表定完再写循环，最后才轮到调用处递东西。顺序调乱，代码就少一个 const 或者少一个 &。" },
        { id: "q8", type: "choice", score: 10,
          coversTask: 1,
          stem: "把 average 的参数从 const 引用改成按值收一整串 int。最贴切的说法是哪一句？",
          options: ["照样能编译、照样算得对，亏在每喊一次就整本复印一次", "返回值会被截成 int", "编译器直接拒绝，程序根本跑不起来", "循环里的元素会自动变成只读"],
          answer: 0,
          why: "按值传大对象不是错，是浪费：名单越大、被喊的次数越多，抄掉的份数越吓人。本课口诀治的就是这一笔。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: "平均 77.0 分\n名单里有 4 个", q3: "double average(const std::vector<int>& v) {", q4: 1, q5: "裸", q6: [0, 1, 2], q7: [1, 0, 3, 2], q8: 0 }
        ],
        wrongs: [
          { q1: 1, q2: "平均 77 分", q3: "double average(std::vector<int> v) {", q4: 0, q5: "整", q6: [0, 3], q7: [0, 1, 2, 3], q8: 2 }
        ],
        loose: [
          { q1: "0", q2: "  平均  77.0 分 \n 名单里有 4 个 ", q3: "double  average ( const std::vector < int > & v )", q4: "1", q5: "裸 ", q6: [0, 1, 2], q7: [1, 0, 3, 2], q8: "0" }
        ]
      }
    },
    {
      cid: "c68", kind: "paper", pass: 60,
      title: "第 68 课考试 · 默认参数：不传就用备用值",
      task: "任务题目：写一只 int power，收底数和指数，指数留一个备用值 2 —— 只递 5 就算平方得 25，递 2 和 10 就得 1024",
      hint: "想不起来就回看正文【演示 2】那三行输出、【演示 3】里被注释掉的那一句，以及【常见坑】第一条。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          coversTask: 1,
          stem: "power 的指数那位留了备用值 2。只递一个 5 进去就算出 25，为什么？",
          options: ["编译器把备用值 2 填进第二格，函数收到的 exp 就是 2", "函数里有一句 if 数了数实参的个数", "第二格整个空着，返回值被砍掉一半", "5 被当成两个参数读成了 5 和 2"],
          answer: 0,
          why: "备用值是在编译那一刻替你写好的实参，函数收到的永远是一位完整的值 —— 身体里没有任何「看有没有传」的分支。这一条是默认参数最要紧的观念。" },
        { id: "q2", type: "output", score: 14,
          coversTask: 1,
          stem: "这段程序打印什么？（一行一条，三行）\nint power(int base, int exp = 2) {\n    int r = 1;\n    for (int i = 0; i < exp; i = i + 1) r = r * base;\n    return r;\n}\nint main() {\n    std::println(\"{}\", power(5));\n    std::println(\"{}\", power(2, 10));\n    std::println(\"{}\", power(3));\n    return 0;\n}",
          acceptLines: ["25", "1024", "9"],
          why: "第一声只递底数，exp 用备用值 2，5 自乘两次得 25；第二声递满，2 的十次方是 1024；第三声同理得 9。" },
        { id: "q3", type: "code", score: 14,
          coversTask: 1,
          stem: "把 power 的函数头写出来：一位底数、一位指数，指数带上备用值 2。",
          acceptRegex: ["exp\\s*=\\s*2"],
          why: "备用值直接跟在参数名后面写在函数头：int power(int base, int exp = 2)。写在调用处不但不行，还会把语法弄崩。" },
        { id: "q4", type: "choice", score: 12,
          stem: "有人把带备用值的那位排在参数表最前面，后面那位却不带备用值。结果是什么？",
          options: ["编译不过：带备用值的必须排在最后", "能过，但调用处必须把每位都递满", "能过，第一位会被自动忽略", "能过，只是跑起来会崩"],
          answer: 0,
          why: "少给的那几格一律按最右边连续几位来算，中间插队就没法算 —— 报错里带 all parameters following 这个 declaration shall have default argument 那类字样。把带备用值的挪到最后即可。" },
        { id: "q5", type: "blank", score: 10,
          stem: "几位参数只有最后一位带备用值时，调用处要省就得从____边开始连着省。（填一个字）",
          accept: ["右"],
          why: "省略是「从右往左连着少写」，不能跳过中间那位 —— 实参表里留空位不是省略的写法。" },
        { id: "q6", type: "multi", score: 14,
          coversTask: [1],
          stem: "关于默认参数，下面哪些说法成立？（多选，错勾任何一项整题 0 分）",
          options: ["重复出现的那串值收进函数头，调用处只写要改的", "改一下函数头的备用值，所有省略这一位的调用跟着一起变", "实参表里空着一格不写，就能跳过中间那位", "新加一位并给它备用值，老调用一个字都不用改"],
          answers: [0, 1, 3],
          why: "第三条正是演示 3 里被注释掉的那一句：省略不靠空位表示，硬留空位得到 error: expected expression。其余三条是备用值省事的地方，第四条讲的是接口怎么长大。" },
        { id: "q7", type: "order", score: 14,
          stem: "把「靠备用值把 greet 喊短一截」这四步排成正确顺序。",
          steps: ["调用处只递名字，第二格干脆不写", "在函数头给 title 写上备用值 同学", "读到的 title 已经是填好的那一份", "编译器在调用那一刻把 同学 塞进第二格"],
          answer: [1, 0, 3, 2],
          why: "先有函数头的备用值，才谈得上调用处省略；省略由编译器在调用处填格，函数体读到的是已经填满的值 —— 它全程不知道自己走了备用值这条路。" },
        { id: "q8", type: "choice", score: 10,
          coversTask: 1,
          stem: "power 递一个 5 得 25，power 递 2 和 10 得 1024。这两声喊的差别在哪？",
          options: ["第二声两格都递满，备用值插不上嘴", "第二声绕过了函数头那句声明", "两声其实算的是同一件事，只是打印不同", "第二声里 exp 仍是 2，只是多乘了十回"],
          answer: 0,
          why: "备用值只在缺实参时出面：你递了 10，函数收到的 exp 就是 10，串里那句 = 2 一句都插不上。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: "25\n1024\n9", q3: "int power(int base, int exp = 2) {", q4: 0, q5: "右", q6: [0, 1, 3], q7: [1, 0, 3, 2], q8: 0 }
        ],
        wrongs: [
          { q1: 1, q2: "25\n100\n9", q3: "int power(int base, int exp) {", q4: 1, q5: "左", q6: [2], q7: [0, 1, 2, 3], q8: 2 }
        ],
        loose: [
          { q1: "0", q2: " 25 \n 1024 \n 9 ", q3: "int power ( int base , int exp  =  2 )", q4: "0", q5: "右 ", q6: [0, 1, 3], q7: [1, 0, 3, 2], q8: "0" }
        ]
      }
    },
    {
      cid: "c69", kind: "paper", pass: 60,
      title: "第 69 课考试 · 函数重载：一名多用",
      task: "任务题目：给 twice 再开一扇文字窗 —— 加一版收 std::string 的 twice，让 ab 变成 abab，记得在文件顶部补 include string",
      hint: "想不起来就回看正文【演示 2】那三版 twice、【演示 3】那个歧义现场，以及【常见坑】第一条和第二条。",
      questions: [
        { id: "q1", type: "output", score: 14,
          coversTask: 1,
          stem: "这段程序打印什么？（一行一条，三行）\nint twice(int x) { return x * 2; }\ndouble twice(double x) { return x * 2.0; }\nstd::string twice(std::string s) { return s + s; }\nint main() {\n    std::println(\"{}\", twice(7));\n    std::println(\"{:.1f}\", twice(2.5));\n    std::println(\"{}\", twice(\"ab\"));\n    return 0;\n}",
          acceptLines: ["14", "5.0", "abab"],
          why: "三声喊各走一扇窗：7 是 int 配整数版，2.5 是 double 配小数版（格式串固定一位小数所以是 5.0），文字串只有字符串版收得了，s 加 s 把 ab 拼成 abab。" },
        { id: "q2", type: "code", score: 14,
          coversTask: 1,
          stem: "写出字符串版 twice 的函数头：名字照旧叫 twice，收一串文字、还一串文字。",
          acceptRegex: ["std::string\\s+twice\\s*\\(\\s*std::string"],
          why: "名字必须和前两版一模一样，区分靠的是参数类型 std::string —— 返回类型也写成 std::string 没问题，但它不是挑版本的依据。" },
        { id: "q3", type: "code", score: 12,
          coversTask: 1,
          stem: "写出那一版的身体里那句 return：把收进来的串自己接自己一次。",
          acceptRegex: ["return\\s+s\\s*\\+\\s*s"],
          why: "s + s 就够了，ab 变 abab。写成 s 加一个引号里的 s 会把字母 s 接上去，得到 abs —— 这类差别正是笔试要看的。" },
        { id: "q4", type: "choice", score: 12,
          stem: "两版 twice 名字相同、参数表也相同，只有 return 的东西不一样。会发生什么？",
          options: ["编译不过，被判定义重复", "编译器改按返回类型挑版本", "能跑，两版随机选一版", "后写的那版自动盖掉前版"],
          answer: 0,
          why: "挑版本发生在配实参那一刻，返回类型还没登场，所以报错是 redefinition of 'twice'。要让两版分开，只能动参数表。" },
        { id: "q5", type: "choice", score: 10,
          stem: "greet 有一格版和两格版，两格版那位 title 又带了备用值。调用处只递一个名字时报 call to 'greet' is ambiguous，根因是什么？",
          options: ["两版都配得上这一声喊，编译器挑不出唯一的一版", "备用值不许出现在写过重载的文件里", "一格版必须写在两格版后面才行", "递进去的文字串类型对不上"],
          answer: 0,
          why: "一格版正好收一个实参，两格版靠备用值也收得下 —— 两条路都通就成了歧义。省事儿只能占一样：要么默认参数，要么重载。" },
        { id: "q6", type: "multi", score: 14,
          coversTask: [1],
          stem: "关于这一课的重载，下面哪些说法成立？（多选，错勾任何一项整题 0 分）",
          options: ["参数个数不同，就算不同的面孔", "参数类型的排列顺序换了，也算不同的面孔", "只有返回类型不同，也算不同的面孔", "几版函数都得写在调用它们的地方之前"],
          answers: [0, 1, 3],
          why: "第三条就是这道题考的那条硬规矩：只有返回类型不同会被判重定义。其余三条全都成立，第四条和第 55 课那句先见后喊是同一件事。" },
        { id: "q7", type: "blank", score: 10,
          stem: "编译器在几版同名函数里替你挑一版，凭的是参数表，而不是函数的____类型。（填两个字）",
          accept: ["返回", "返回值", "返回类型"],
          why: "配实参发生在进货那一刻，出货那一刻的返回类型没人看 —— 所以差返回类型的两版压根不能并存。" },
        { id: "q8", type: "order", score: 14,
          stem: "把「一声喊怎么找到它那版函数」这五步排成正确顺序。",
          steps: ["配对：先找参数表分毫不差的那一版", "看料：调用处数一数递了几个实参、各是什么类型", "落空：一版都配不上就报 no matching function", "登记：所有同名版本都写在调用之前", "退让：没有完全匹配时才考虑合法的自动转换"],
          answer: [3, 1, 0, 4, 2],
          why: "先把几版登记好，编译器才认得；再看你手上递的是什么料；先找完全匹配的，找不到才退一步做转换；全都配不上才报那句没有匹配函数。" }
      ],
      selftest: {
        refs: [
          { q1: "14\n5.0\nabab", q2: "std::string twice(std::string s) {", q3: "return s + s;", q4: 0, q5: 0, q6: [0, 1, 3], q7: "返回", q8: [3, 1, 0, 4, 2] }
        ],
        wrongs: [
          { q1: "14\n5\nab", q2: "std::string twice(int s) {", q3: "return s + \"s\";", q4: 1, q5: 1, q6: [2], q7: "参数", q8: [0, 1, 2, 3, 4] }
        ],
        loose: [
          { q1: " 14 \n5.0\n abab ", q2: "std::string twice ( std::string  s )", q3: "return s+s ;", q4: "0", q5: "0", q6: [0, 1, 3], q7: "返回类型", q8: [3, 1, 0, 4, 2] }
        ]
      }
    },
    {
      cid: "c70", kind: "paper", pass: 60,
      title: "第 70 课考试 · 多个结果：引用参数当答案格",
      task: "任务题目：给 stats 再添一张答案格 count，一次交出总分、最高分和及格人数 —— 分数大于等于 60 就算及格",
      hint: "想不起来就回看正文【演示 2】那三处手续、【演示 3】那个越喊越大的现场，以及【常见坑】第一条和第二条。",
      questions: [
        { id: "q1", type: "output", score: 14,
          coversTask: 1,
          stem: "这段程序打印什么？（一行一条，三行）\nvoid stats(const std::vector<int>& v, int& total, int& best, int& count) {\n    total = 0; best = v[0]; count = 0;\n    for (int x : v) { total += x; if (x > best) best = x; if (x >= 60) count = count + 1; }\n}\nint main() {\n    std::vector<int> scores = {85, 92, 58, 96};\n    int total = 0, best = 0, count = 0;\n    stats(scores, total, best, count);\n    std::println(\"总分 {}\", total);\n    std::println(\"最高 {}\", best);\n    std::println(\"及格 {}\", count);\n    return 0;\n}",
          acceptLines: ["总分 291", "最高 96", "及格 3"],
          why: "四只手相加是 291；比 96 大的没有，最高就是 96；85、92、96 都够 60，58 不够，所以及格 3 人。三份结果全靠往格子里写，return 全程闲着。" },
        { id: "q2", type: "code", score: 14,
          coversTask: 1,
          stem: "把添了一张答案格之后的 stats 函数头写出来：一份只读名单，三只待填的 int 盒子，最后那只叫 count。",
          acceptRegex: ["int\\s*&\\s*count"],
          why: "答案格就是裸引用参数 int& count，和 total、best 一样排在名单之后；名单自己还得留在 const 引用那位上，一个都不许动。" },
        { id: "q3", type: "code", score: 12,
          coversTask: 1,
          stem: "写出数及格人数那一句里的比较条件：收到的分数够 60 才算过关。",
          acceptRegex: [">=\\s*60"],
          why: "大于等于才把刚好 60 那位算进来；写成只有大于号就把及格线抬高了一分，人数会少算。命中之后给 count 加一笔。" },
        { id: "q4", type: "choice", score: 12,
          stem: "调用处想省事，在答案格那位上直接递了一个 0 进去，编译器甩来 cannot bind non-const lvalue reference of type 'int&' to an rvalue of type 'int'。为什么？",
          options: ["引用得有本人，一个临时的数不是盒子，外号挂不上去", "0 是保留字，不能当实参", "答案格只能递 double 的盒子", "参数太多，编译器直接罢工"],
          answer: 0,
          why: "第 58 课那条规矩在这儿照样成立：声明引用就得当场指认一只真实存在的盒子。想交答案，先在 main 里把 int total 这类声明好，再把名字递进去。" },
        { id: "q5", type: "choice", score: 12,
          stem: "把函数头那句 total = 0 删掉，同一组盒子连喊两遍 stats，总分涨成 582 而不是 291。根因是哪一句？",
          options: ["递进去的是调用处那只已经装着数的盒子，没擦就直接往上加", "编译器把那个 0 当注释跳过了", "名单被抄了两遍，所以每个数算了两回", "总分本该用 return 交，格子写法本身是错的"],
          answer: 0,
          why: "答案格是带旧账进场的：函数不许假定调用方给了 0。第一笔先擦干净 —— 少了这一笔就是这种编译得过、算错数的最坏情形。" },
        { id: "q6", type: "multi", score: 14,
          coversTask: [1],
          stem: "关于把引用参数当答案格，下面哪些说法成立？（多选，错勾任何一项整题 0 分）",
          options: ["只读的资料用 const 引用，会被写的格子用裸引用", "盒子由调用处先声明好，函数只管往里写", "格子初值可以省，反正 main 里给的都是 0", "看哪个参数站在裸引用位上，就知道谁会被改"],
          answers: [0, 1, 3],
          why: "第三条最典型：省掉初值就是拿调用方的运气当保证，演示 3 那个越喊越大的例子就是这么来的。其余三条是本课分工的三句话。" },
        { id: "q7", type: "blank", score: 8,
          stem: "源稿那句「return 只有一只手」的意思是：一次调用只能还____个值。（填一个字）",
          accept: ["一", "1"],
          why: "正因为一只手只拎得走一个，交多份结果才要么摆答案格，要么用以后那种把几份结果打包成一个整体的写法。" },
        { id: "q8", type: "output", score: 14,
          stem: "这段程序打印什么？（一行一条，两行）\nvoid sloppy_add(const std::vector<int>& v, int& total) {\n    for (int x : v) total += x;      // 忘了擦格子\n}\nint main() {\n    std::vector<int> scores = {85, 92};\n    int total = 1000;\n    sloppy_add(scores, total);\n    std::println(\"第一遍：{}\", total);\n    sloppy_add(scores, total);\n    std::println(\"第二遍：{}\", total);\n    return 0;\n}",
          acceptLines: ["第一遍：1177", "第二遍：1354"],
          why: "85 加 92 是 177。盒子里原本装着 1000，第一遍加完 1177；第二遍在这笔旧账上再加 177，得 1354 —— 每一声喊都往上摞一层。" }
      ],
      selftest: {
        refs: [
          { q1: "总分 291\n最高 96\n及格 3", q2: "void stats(const std::vector<int>& v, int& total, int& best, int& count) {", q3: "if (x >= 60) count = count + 1;", q4: 0, q5: 0, q6: [0, 1, 3], q7: "一", q8: "第一遍：1177\n第二遍：1354" }
        ],
        wrongs: [
          { q1: "总分 291\n最高 96", q2: "void stats(std::vector<int> v, int total, int best, int count) {", q3: "if (x > 60) count = count + 1;", q4: 1, q5: 2, q6: [2], q7: "两", q8: "第一遍：177\n第二遍：177" }
        ],
        loose: [
          { q1: " 总分  291 \n 最高 96 \n 及格 3 ", q2: "void stats ( const std::vector<int> & v , int & total , int & best , int & count )", q3: "if(x>=60) count++;", q4: "0", q5: "0", q6: [0, 1, 3], q7: "1", q8: "第一遍：1177 \n 第二遍：1354" }
        ]
      }
    }
  ]
};
