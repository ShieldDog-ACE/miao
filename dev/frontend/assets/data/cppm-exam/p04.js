/* 喵站 · C++ 掌握 考卷分部 p04：第 89–92 课（第九轮）
 * 契约与 p02/p03 完全一样：权重和 100、源稿每条任务都有题 coversTask 对着、
 * refs 判 100 / wrongs <60 / loose 必过、每题带 why。
 */
window.MIAO_CPPM_EXAM_P04 = {
  papers: [
    {
      cid: "m89", kind: "paper", mode: "code", authored: "c23ddeb6", pass: 60, task: "任务题目：把源稿里那两段几乎一样的循环抽成 to_base 函数，再写出反向的 from_base，把 FF 按 16 进制装回 255", hint: "想不起来就回看本课【演示 2 · 抽成 to_base】与【演示 3 · 反着走：from_base】。",
      questions: [
        { id: "q1", type: "code", score: 25, coversTask: 1, stem: "（任务题）把重复的拆位循环抽成函数 to_base，参数是 int n 和 int base，返回 std::string。写出函数体里那个圈：每轮把 digits 查到的字符插到 result 最前面，然后让商继续拆下一位。", acceptRegex: ["while\\s*\\(", "n\\s*%\\s*base", "digits\\s*\\[", "result", "n\\s*/=\\s*base"], sample: "std::string to_base(int n, int base) {\n    const std::string digits = \"0123456789ABCDEF\";\n    std::string result;\n    while (n > 0) { result = digits[n % base] + result; n /= base; }\n    return result;\n}", why: "圈守卫 n > 0；插法是 digits[n % base] + result，注意新位在前；最后一句 n /= base 让商降一位。" },
        { id: "q2", type: "code", score: 25, coversTask: 2, stem: "（任务题）写出 from_base 的核心那一句：从左往右扫字符串 s 的每个字符 c，把旧值升一位、再把查表得到的新数字并进个位。", acceptRegex: ["result\\s*\\*\\s*base\\s*\\+", "for\\s*\\("], sample: "int result = 0;\nfor (char c : s) result = result * base + digits.find(c);", why: "result = result * base + 值。乘 base 是把已经读过的位整体左移一格，加号后面那个值是刚查表读出的新个位。" },
        { id: "q3", type: "code", score: 25, coversTask: 1, stem: "（任务题）把重复的两段循环抽成函数：写出 to_base 的函数头 —— 返回 std::string，收一个整数 n 和一个整数 base。", acceptRegex: ["std\\s*::\\s*string\\s+to_base\\s*\\(\\s*int\\s+\\w+\\s*,\\s*int\\s+\\w+\\s*\\)"], sample: "std::string to_base(int n, int base) {", why: "还回来的是一串字符，所以返回值写 std::string；两个整数分别是要拆的数和进位制 —— 数字表是函数的私事，不用调用者递。" },
        { id: "q4", type: "code", score: 25, coversTask: 2, stem: "（任务题）from_base 里把字符 c 换成它的数字值那一步：查表用 digits.find(c)，把查到的值并进 result 的个位（旧值先升一位）。", acceptRegex: ["digits\\s*\\.\\s*find\\s*\\(\\s*c\\s*\\)", "result\\s*\\*\\s*base\\s*\\+"], sample: "for (char c : s) result = result * base + digits.find(c);", why: "digits 那张表里「0123456789ABCDEF」的下标就是数字值，find(c) 报出 c 排在第几格，正好是它代表的数；乘 base 把读过的位整体左移一格，加号后面接上新个位。" }
      ],
      selftest: {
        refs: [
          {q1: "std::string to_base(int n, int base) {\n    const std::string digits = \"0123456789ABCDEF\";\n    std::string result;\n    while (n > 0) { result = digits[n % base] + result; n /= base; }\n    return result;\n}", q2: "int result = 0;\nfor (char c : s) result = result * base + digits.find(c);", q3: "std::string to_base(int n, int base) {", q4: "for (char c : s) result = result * base + digits.find(c);"}],
        wrongs: [
          {q1: "void to_base(int n, int base) {\n    for (int i = 0; i < n; ++i) result += digits[n / base];\n}", q2: "result = result + base * digits[c];", q3: "void to_base(int n, int base) {", q4: "for (char c : s) result = result + base * c;"},
          {q1: "while (n > 0) { result = result + digits[n / base]; }", q2: "for (char c : s) result += c * base;", q3: "void to_base(int n, int base) {", q4: "for (char c : s) result = result + base * c;"}],
        loose: [
          {q1: "std::string  to_base(int n,int base){\n  std::string result; const std::string digits=\"0123456789ABCDEF\";\n  while(n>0){ result = digits[n%base] + result ;  n/=base ; }\n  return result; }", q2: "for (char c : s)\n    result  =  result * base  +  digits.find(c);", q3: "std :: string   to_base ( int   n , int   base ) {", q4: "for (char c : s) result  =  result*base + digits . find ( c ) ;"}]
      }
    },
    {
      cid: "m90", kind: "paper", mode: "quiz", pass: 60, task: "任务题目：把 filter 的条件改成「大于 5」并写出输出；再用手写循环挑偶数跑出同样的结果，并说清你更愿意维护哪一段", hint: "想不起来就回看本课【演示 2 · 老写法摆在一起比一比】与【演示 3 · 换个条件，原数据毫发无损】。",
      questions: [
        { id: "q1", type: "choice", score: 15, stem: "管道里那根竖线 | 该读成什么？", options: ["或者，两边挑一个", "然后：把左边的结果灌给右边那一段", "按位异或，这里借用一下", "等于，两边必须一样"], answer: 1, why: "它是从 shell 管道搬来的「然后」：nums，然后筛偶数，然后取前三个。每段只干一件事。" },
        { id: "q2", type: "output", score: 30, coversTask: 1, stem: "nums 是 5 2 8 1 9 3 7 4 6 10，这段打印什么？（一行）\nfor (int x : nums | std::views::filter([](int y) { return y > 5; })) std::print(\"{} \", x);", acceptLines: ["8 9 7 6 10"], why: "大于 5 的按原顺序放行：8、9、7、6、10；顺序不变，也不会留空洞。" },
        { id: "q3", type: "choice", score: 15, stem: "写下「nums 接上 filter 一个谓词」的那一刻，程序做了什么？", options: ["立刻把十个元素判断完，结果存进一个新数组", "什么都没判断，只造出一个记录着「怎么遍历」的视图", "把 nums 复制了一份，等下一课再筛", "报错，必须先赋给 auto 变量"], answer: 1, why: "视图是惰性的看法，不复制数据也不预先算；for 圈真去读的那一刻才逐个问谓词。" },
        { id: "q4", type: "blank", score: 10, stem: "std::views 这一族住在一个头文件里，只请 vector 和 print 两个头是拿不到它的。那个头文件的名字是什么？（只填名字，不带尖括号）", accept: ["ranges", "range", "std/ranges"], why: "忘包这个头的报错通常长成「std 里没有 views 这个成员」，后面拖一串模板噪音。" },
        { id: "q5", type: "multi", score: 20, coversTask: 2, stem: "把管道写法与手写循环对比，下列说法对的是？（多选，错勾任何一项整题 0 分）", options: ["手写那份多养了一个容器，它存在的唯一理由是把中间结果存下来", "管道写法里条件只出现在 lambda 里，不跟控制流缠在一起", "filter 出来的视图跟 vector 一样能用下标随机取", "想再叠一段「只取前三个」，管道只要多接一条竖线，手写得加计数器和 break"], answers: [0, 1, 3], why: "视图不是容器，它只保证能被从头到尾走一遍；其余三条正是管道比嵌套圈好维护的原因。" },
        { id: "q6", type: "choice", score: 10, stem: "把条件误写成 return !x % 2;，跑起来会怎样？", options: ["正常筛出奇数", "条件恒为假，一行都不输出", "编译报错，感叹号不能用于整数", "留下偶数、扔掉奇数"], answer: 1, why: "感叹号优先级高于取模：先对整数 x 取反得 0 或 1，再 % 2 恒为 0，转成 bool 永远假 —— 输出一个空行。" }
      ],
      selftest: {
        refs: [
          {q1: 1, q2: "8 9 7 6 10", q3: 1, q4: "ranges", q5: [0, 1, 3], q6: 1}],
        wrongs: [
          {q1: 0, q2: "2 8 4 6 10", q3: 0, q4: "vector", q5: [2], q6: 0},
          {q1: 2, q2: "5 2 8 1 9 3 7 4 6 10", q3: 2, q4: "algorithm", q5: [1, 2], q6: 2}],
        loose: [
          {q1: "1", q2: " 8 9 7 6 10 ", q3: "1", q4: "RANGES", q5: [3, 1, 0], q6: "1"}]
      }
    },
    {
      cid: "m91", kind: "paper", mode: "quiz", pass: 60, task: "任务题目：把加工机改成「乘 10」并写出输出；再用 transform 把一列名字变成每个名字的长度", hint: "想不起来就回看本课【演示 2 · 换一台机器：乘 10】与【演示 3 · 跨类型：名字变长度】。",
      questions: [
        { id: "q1", type: "choice", score: 13, stem: "filter 与 transform 的分工，哪一句说对了？", options: ["filter 改元素值，transform 改元素个数", "「有些元素不想要」用 filter，「每个元素都要换成别的东西」用 transform", "transform 必须回真假，filter 随便回", "两个是一回事，只是名字不同"], answer: 1, why: "filter 决定谁通过、过去的值不变；transform 决定过去的那个变成什么、一个都不会少。" },
        { id: "q2", type: "output", score: 20, coversTask: 1, stem: "nums 是 1 2 3 4 5，加工机换成乘 10，这段打印什么？（两行）\nfor (int v : times10) std::print(\"{} \", v);\nstd::println(\"\");\nfor (int v : times10) std::print(\"{} \", v);\nstd::println(\"\");", acceptLines: ["10 20 30 40 50", "10 20 30 40 50"], why: "视图记着「怎么加工」，每次遍历都现算，所以两行一样 —— 这也说明它能被反复读。" },
        { id: "q3", type: "choice", score: 12, stem: "跑完上面那段平方，nums 里是什么？", options: ["1 4 9 16 25，被就地改写了", "还是 1 2 3 4 5 —— transform 从不写回原容器", "空的，原数据被管道消耗掉了", "编译不通过，因为不能读原数组"], answer: 1, why: "视图是一层看法，不是新数据，也不动旧数据。要真的改原件得自己写赋值圈或收进新容器。" },
        { id: "q4", type: "blank", score: 12, coversTask: 2, stem: "管道里流出去的元素类型，是由 transform 那段 ____ 的返回类型决定的。（填这段东西的名字，一个词）", accept: ["lambda", "加工机", "transform 的 lambda"], why: "写 return x * x 就是 int，写 return s.size() 就是无符号长度，写 return 0.5 就是 double —— 类型跟着 return 走。" },
        { id: "q5", type: "multi", score: 17, stem: "关于 transform，下列说法对的是？（多选，错勾任何一项整题 0 分）", options: ["接上管道的那一刻一个都没算，遍历时才逐个套公式", "加工机的参数最好写成 const std::string& 这类引用，省掉逐个复制", "同一个视图遍历三遍，公式就被套三遍", "加工机里两条分支一个回 int 一个回 double 是完全合法的"], answers: [0, 1, 2], why: "惰性的另一面就是重复计算；参数按值收 string 等于每加工一个都复制一份；返回类型不一致编译器拦得住。" },
        { id: "q6", type: "choice", score: 8, stem: "把平方误写进 filter：nums | std::views::filter(回 x * x 的那个 lambda)，结果是什么？", options: ["照样得到 1 4 9 16 25", "0 被筛掉，其余元素原样流出去，一个平方都没算", "编译必然报错", "只剩最大的那个数"], answer: 1, why: "filter 那一格要的是真假，一个数被当成真假来看：只有 0 是假。两段管道的职责不能混。" },
        { id: "q7", type: "output", score: 18, coversTask: 2, stem: "这段打印什么？（一行）\nstd::vector<std::string> names = {\"Anna\", \"Bob\", \"Katherine\", \"Li\"};\nfor (auto n : names | std::views::transform([](const std::string& s) { return s.size(); })) std::print(\"{} \", n);", acceptLines: ["4 3 9 2"], why: "逐个求长度：Anna 4、Bob 3、Katherine 9、Li 2，顺序不变。" }
      ],
      selftest: {
        refs: [
          {q1: 1, q2: "10 20 30 40 50\n10 20 30 40 50", q3: 1, q4: "lambda", q5: [0, 1, 2], q6: 1, q7: "4 3 9 2"}],
        wrongs: [
          {q1: 0, q2: "1 4 9 16 25\n1 4 9 16 25", q3: 0, q4: "谓词", q5: [3], q6: 0, q7: "Anna Bob Katherine Li"},
          {q1: 2, q2: "10 20 30 40 50", q3: 2, q4: "vector", q5: [0, 3], q6: 2, q7: "3 3 9 2"}],
        loose: [
          {q1: "1", q2: " 10 20 30 40 50 \n10 20 30 40 50 ", q3: "1", q4: "LAMBDA", q5: [2, 0, 1], q6: "1", q7: "4 3 9 2 "}]
      }
    },
    {
      cid: "m92", kind: "paper", mode: "quiz", pass: 60, task: "任务题目：用 iota 起头求 1 到 100 里能被 3 整除的数、平方后取前 5 个；再回答把 filter 和 transform 的顺序调换结果是否一样、为什么", hint: "想不起来就回看本课【演示 3 · 连容器都不用造】与【演示 2 · 数一数谓词被问了几次】。",
      questions: [
        { id: "q1", type: "choice", score: 18, stem: "三段接好之后、for 圈还没去读的时候，程序算了些什么？", options: ["把整列筛完、平方完，只等打印", "什么都没算，只造出一个记着「怎么遍历」的视图对象", "只算了 take 要的那三个", "报错，必须先落地成 vector"], answer: 1, why: "管道是声明，执行在遍历那一刻。这是上一课惰性的规矩在整条链上的版本。" },
        { id: "q2", type: "output", score: 22, coversTask: 1, stem: "这段打印什么？（一行）\nauto out = std::views::iota(1, 101)\n         | std::views::filter([](int x) { return x % 3 == 0; })\n         | std::views::transform([](int x) { return x * x; })\n         | std::views::take(5);\nfor (int v : out) std::print(\"{} \", v);", acceptLines: ["9 36 81 144 225"], why: "3、6、9、12、15 的平方；够五个就停，后面的数连问都没问过。" },
        { id: "q3", type: "choice", score: 18, coversTask: 2, stem: "把「先筛偶数再平方」换成「先平方再筛偶数」，在这份数据上结果一样吗？为什么？", options: ["一样 —— 平方不改变奇偶，两段互不打扰，所以谁在前都一样", "一样 —— 任何两段管道都能随便换顺序", "不一样 —— 先平方会少算一个数", "不一样 —— 编译器不允许换"], answer: 0, why: "这是恰好巧上：filter 的条件只看元素自身，transform 一对一保序。把加工机换成「加 1」，偶数全变奇数，筛出来的立刻是另一批。" },
        { id: "q4", type: "choice", score: 12, stem: "下面哪种改动一定会改变结果？", options: ["把 lambda 的参数改名", "把 take 那一段挪到 filter 前面", "把整条管道存进一个 auto 变量", "把 print 换成 println 各打一行"], answer: 1, why: "先取三个再筛，问的是「头三个里合格的有几个」；先筛再取三个，问的是「合格的头三个」。两个问题。" },
        { id: "q5", type: "order", score: 15, stem: "把「遍历一条 filter | transform | take 管道」时真正发生的事排成正确顺序。", answer: [0, 1, 2, 3], steps: ["从底下的容器取下一个元素", "问 filter 的谓词：假就丢掉这个，回到第一步", "真就交给 transform 的公式，算出新值", "take 数一个，数够了整条链当场停手"], why: "逐元素推过整条链，而不是逐段扫完整列数据 —— 这正是 take 能提前收工的原因。" },
        { id: "q6", type: "blank", score: 15, coversTask: 1, stem: "std::views::iota 下界含、上界不含。要生成 1 到 100 这一百个数，第二个参数填 ____ 。", accept: ["101", "一百零一", "101 个"], why: "上界是「一到就停」的位置，上界减下界才等于个数：101 减 1 等于 100。" }
      ],
      selftest: {
        refs: [
          {q1: 1, q2: "9 36 81 144 225", q3: 0, q4: 1, q5: [0, 1, 2, 3], q6: "101"}],
        wrongs: [
          {q1: 0, q2: "3 6 9 12 15", q3: 1, q4: 0, q5: [3, 2, 1, 0], q6: "100"},
          {q1: 2, q2: "9 36 81", q3: 3, q4: 2, q5: [1, 0, 3, 2], q6: "99"}],
        loose: [
          {q1: "1", q2: " 9 36 81 144 225 ", q3: "0", q4: "1", q5: ["0", "1", "2", "3"], q6: " 101 "}]
      }
    },
  ]
};
