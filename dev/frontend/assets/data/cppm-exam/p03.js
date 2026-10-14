/* 喵站 · C++ 掌握 考卷分部 p03：第 86–88 课（主控亲写）
 * 契约与前几场完全一样：权重和 100、任务逐条 coversTask、refs 判 100 / wrongs <60 / loose 过。
 */
window.MIAO_CPPM_EXAM_P03 = {
  papers: [
    {
      cid: "m86", kind: "paper", mode: "quiz", authored: "4eb47ee2", pass: 60, title: "第 86 课考试 · 素数筛", task: "任务题目：把 n 改成 100 数出素数个数；再说清「筛到根号 n 就够」为什么是对的", hint: "回看本课「怎么做」那段与【演示 1 · 把名单数出来】。",
      questions: [
        { id: "q1", type: "choice", score: 15, stem: "筛法的核心思路是哪一句？", options: ["逐个数字试除，除不动就是素数", "反过来划掉「一定不是」的数，活下来的就是素数", "只检查奇数", "把数排序后取中间"], answer: 1, why: "不找「谁是素数」，只划「谁肯定不是」—— 这是筛法与试除的分水岭。" },
        { id: "q2", type: "choice", score: 16, stem: "外层圈为什么写到 i * i <= n 就够了？", options: ["为了跑得快点，差一点没关系", "合数若有一个大于根号 n 的因子，必配一个小于根号 n 的因子，那个会更早把它划掉", "因为 vector 只能开这么大", "因为 i 乘 i 会溢出"], answer: 1, why: "这是精确边界不是近似：每个合数都有一个不超过根号 n 的质因子，那一轮就会划掉它。" },
        { id: "q3", type: "output", score: 18, coversTask: 1, stem: "名单筛完后，这段打印什么？（一行）\nfor (int i = 2; i <= 10; ++i)\n    if (is_prime[i]) std::print(\"{} \", i);", acceptLines: ["2 3 5 7"], why: "10 以内素数是 2、3、5、7；每个后面跟一个空格。" },
        { id: "q4", type: "blank", score: 10, coversTask: 1, stem: "内层划掉时，起点应写成 i 的____（填一个词），而不是 2 乘 i。", accept: ["平方", "2次方", "自乘", "i*i"], why: "更小的倍数早被前面的质数划过了，从平方起才是筛法的标准姿势。" },
        { id: "q5", type: "multi", score: 19, stem: "关于这段代码的说法，哪些对？（多选，错一项整题 0 分）", options: ["vector<bool> 是标准库的特殊容器，按位存而不是一份 bool 数组", "名单开成 n 格也够用", "0 和 1 不手动划掉会被当成素数报出来", "外层圈写成 i <= n 会白跑很多轮"], answers: [0, 2, 3], why: "要装 0 到 n 就得 n + 1 格，差一格是很多翻车现场。" },
        { id: "q6", type: "blank", score: 22, coversTask: 2, stem: "名单筛好后，从 2 开始顺着 is_prime 一个一个数素数，数够 10 个就停：第 10 个素数是____。", accept: ["29"], why: "顺着名单数：2、3、5、7、11、13、17、19、23 才 9 个，再往前数一个就是 29 —— 数够 10 个当场停，打印的就是它。" }
      ],
      selftest: {
        refs: [
          {q1: 1, q2: 1, q3: "2 3 5 7", q4: "平方", q5: [0, 2, 3], q6: "29"}],
        wrongs: [
          {q1: 0, q2: 0, q3: "2 3 5 7 9", q4: "两倍", q5: [1, 2], q6: "23"},
          {q1: 3, q2: 2, q3: "1 2 3 5 7", q4: "立方", q5: [0, 1], q6: "23"}],
        loose: [
          {q1: "1", q2: "1", q3: "2  3  5  7 ", q4: "i*i", q5: [0, 2, 3], q6: " 29 "}]
      }
    },
    {
      cid: "m87", kind: "paper", mode: "code", authored: "a1421878", pass: 60, title: "第 87 课考试 · 词频统计与热搜", task: "任务题目：把排序比较函数改成「先比次数、平局按字典序比单词」；并说清登记与累加这两步怎么写", hint: "回看【演示 1 · 登记与累加】与【演示 2 · 排成热搜】。",
      questions: [
        { id: "q1", type: "code", score: 27, coversTask: 1, stem: "（任务题）写出那段比较 lambda：次数高的在前，次数相同就按单词字典序（小的在前）。", acceptRegex: ["if\\s*\\(\\s*a\\.count\\s*!=\\s*b\\.count\\s*\\)\\s*return\\s*a\\.count\\s*>", "return\\s*a\\.word\\s*<"], sample: "[](const WordCount& a, const WordCount& b) {\n    if (a.count != b.count) return a.count > b.count;\n    return a.word < b.word;\n}", why: "第一关键字比 count（大于＝高的在前），平局才比 word（小于＝字典序在前）。" },
        { id: "q2", type: "code", score: 24, coversTask: 2, stem: "（延伸题）仿照本课形状，写出「一行成绩单」的类型定义：struct Student，含 std::string name 与 int score，并带一个成员函数 bool passed() const 判断是否及格（60 及以上）。", acceptRegex: ["struct\\s+Student\\s*\\{", "std::string\\s+name", "int\\s+score", "bool\\s+passed\\s*\\(\\s*\\)\\s*const"], sample: "struct Student {\n    std::string name;\n    int score;\n    bool passed() const { return score >= 60; }\n};", why: "四样齐了：struct 名、两个成员、结尾带 const 的成员函数。" },
        { id: "q3", type: "code", score: 21, coversTask: 1, stem: "（任务题）次数相同才轮到第二关键字：把比单词字典序、小的在前那一句单独写出来。", acceptRegex: ["return\\s+a\\s*\\.\\s*word\\s*<\\s*b\\s*\\.\\s*word"], sample: "return a.word < b.word;", why: "std::string 自带字典序的小于比较，直接写 a.word < b.word 就是「小的在前」；比较函数里返回 true 的一直是「该排在前面」那一个。" },
        { id: "q4", type: "code", score: 28, coversTask: 2, stem: "（延伸题）仿本课形状给成绩单排名：写出比较 lambda，参数按 const Student& 收两张名片（叫 a 和 b），总分高的在前，总分靠调用成员函数 total() 拿到。", acceptRegex: ["\\(\\s*(const\\s+)?Student\\s*&\\s*a\\s*,\\s*(const\\s+)?Student\\s*&\\s*b\\s*\\)", "a\\s*\\.\\s*total\\s*\\(\\s*\\)\\s*>\\s*b\\s*\\.\\s*total\\s*\\(\\s*\\)"], sample: "[](const Student& a, const Student& b) { return a.total() > b.total(); }", why: "成员函数就在名片自己身上，靠 a.total() 喊一声就能拿到总分；总分高的在前，所以返回的是大于 —— 大于小于写反，名次整个倒过来。" }
      ],
      selftest: {
        refs: [
          {q1: "[](const WordCount& a, const WordCount& b) {\n    if (a.count != b.count) return a.count > b.count;\n    return a.word < b.word;\n}", q2: "struct Student {\n    std::string name;\n    int score;\n    bool passed() const { return score >= 60; }\n};", q3: "return a.word < b.word;", q4: "[](const Student& a, const Student& b) { return a.total() > b.total(); }"}],
        wrongs: [
          {q1: "[](const WordCount& a, const WordCount& b) { return a.count > b.count; }", q2: "struct Student { std::string name; int score; };", q3: "return a.count > b.count;", q4: "[](const Student& a, const Student& b) { return a.total() < b.total(); }"},
          {q1: "[](WordCount a, WordCount b) { return a.word < b.word; }", q2: "struct Student { int score; bool passed() { return score > 60; } };", q3: "return a.count > b.count;", q4: "[](const Student& a, const Student& b) { return a.total() < b.total(); }"}],
        loose: [
          {q1: "[]( const WordCount & a , const WordCount & b ) {\n if ( a.count != b.count ) return a.count > b.count ;\n return a.word < b.word ; }", q2: "struct Student{\n std::string name; int score;\n bool passed() const {return score>=60;}\n};", q3: "return   a . word  <  b.word ;", q4: "[ ] ( const  Student &  a ,  const Student &  b ) {  return  a . total ( )  >  b . total ( ) ;  }"}]
      }
    },
    {
      cid: "m88", kind: "paper", mode: "quiz", pass: 60, title: "第 88 课考试 · 二维 vector 与转置", task: "任务题目：说清两个下标各管什么，写出转置那一行；并判断一个矩阵转置后是否还等于自己", hint: "回看「怎么做」那段与【演示 1 · 不规则的表会怎样】。",
      questions: [
        { id: "q1", type: "choice", score: 13, stem: "Matrix m; 那么 m[i][j] 的规矩是哪一条？", options: ["i 是列、j 是行", "i 是第几行、j 是这一行的第几格", "i 与 j 都是行号", "i 是整张表的格子总数"], answer: 1, why: "外层容器管行、内层管列；顺序颠倒就会漏格或越界。" },
        { id: "q2", type: "output", score: 21, coversTask: 1, stem: "m 是 {{1,2,3},{4,5,6}}。转置后按行打印（每行数字间一个空格），两行分别是什么？", acceptLines: ["1 4", "2 5", "3 6"], why: "2 行 3 列转成 3 行 2 列：原来的列变成行。" },
        { id: "q3", type: "choice", score: 12, stem: "列数应该从哪儿取？", options: ["m.size()", "m[0].size()", "两个都一样", "table 的总长度"], answer: 1, why: "m.size() 是行数。方阵时写错看不出来，长方形立刻越界或漏格。" },
        { id: "q4", type: "multi", score: 17, stem: "关于二维 vector，哪些说法对？（多选，错一项整题 0 分）", options: ["每一行的长度可以不同（编译器不管）", "Matrix t; 之后直接写 t[0][0] = 1 是未定义行为", "外层 range-for 应写成 const std::vector<int>& 免得每圈复制一行", "把 m 赋给 b 之后，改 b 会连着改 m"], answers: [0, 1, 2], why: "vector 是值类型，赋的是整份复制，改副本不动原表。" },
        { id: "q5", type: "blank", score: 29, coversTask: 2, stem: "（任务题）写出判断「是否对称」的核心一句：比较 m 的第 i 行第 j 格与它的转置位置那一格（用两个下标对调写成条件即可）。", acceptRegex: ["m\\s*\\[\\s*i\\s*\\]\\s*\\[\\s*j\\s*\\]\\s*!=\\s*m\\s*\\[\\s*j\\s*\\]\\s*\\[\\s*i\\s*\\]"], sample: "if (m[i][j] != m[j][i]) { std::println(\"不对称\"); return false; }", why: "对称 = 每个位置与自己转置后那一格相等；找出一处不等就不是对称。" },
        { id: "q6", type: "blank", score: 8, stem: "为了少写三层尖括号，本课用了一行 ____ Matrix = std::vector<std::vector<int>>; 给类型起短名字。（填一个关键字）", accept: ["using"], why: "using 别名，第 50 课学的东西在复杂类型上开始省事了。" }
      ],
      selftest: {
        refs: [
          {q1: 1, q2: "1 4\n2 5\n3 6", q3: 1, q4: [0, 1, 2], q5: "if (m[i][j] != m[j][i]) { std::println(\"不对称\"); return false; }", q6: "using"}],
        wrongs: [
          {q1: 0, q2: "1 2 3\n4 5 6", q3: 0, q4: [1, 3], q5: "m[i][j] == m[i][j]", q6: "typedef"},
          {q1: 2, q2: "1 2\n3 4\n5 6", q3: 2, q4: [0, 3], q5: "m[i] != m[j]", q6: "define"}],
        loose: [
          {q1: "1", q2: " 1  4 \n2 5\n 3 6", q3: "1", q4: [0, 1, 2], q5: "if(m [i][j]!=m[j][i]) return false;", q6: "USING"}]
      }
    },
  ]
};
