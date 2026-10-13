/* 喵站 · C++ 掌握 考卷分部 p03：第 86–88 课（主控亲写）
 * 契约与前几场完全一样：权重和 100、任务逐条 coversTask、refs 判 100 / wrongs <60 / loose 过。
 */
window.MIAO_CPPM_EXAM_P03 = {
  papers: [
    {
      cid: "m86", kind: "paper", pass: 60,
      title: "第 86 课考试 · 素数筛",
      task: "任务题目：把 n 改成 100 数出素数个数；再说清「筛到根号 n 就够」为什么是对的",
      hint: "回看本课「怎么做」那段与【演示 1 · 把名单数出来】。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          stem: "筛法的核心思路是哪一句？",
          options: ["逐个数字试除，除不动就是素数", "反过来划掉「一定不是」的数，活下来的就是素数", "只检查奇数", "把数排序后取中间"],
          answer: 1,
          why: "不找「谁是素数」，只划「谁肯定不是」—— 这是筛法与试除的分水岭。" },
        { id: "q2", type: "code", score: 18, coversTask: 1,
          stem: "（任务题）写出把名单准备好、并把 0 与 1 划掉的那两句：n 已经是 int 变量，名单叫 is_prime，类型用 vector 装 bool。",
          acceptRegex: ["vector<\\s*bool\\s*>\\s*is_prime\\s*\\(\\s*n\\s*\\+\\s*1\\s*,\\s*true", "is_prime\\s*\\[\\s*0\\s*\\]\\s*=\\s*(?:is_prime\\s*\\[\\s*1\\s*\\]\\s*=\\s*)?false"],
          why: "格子数要 n + 1（把 n 本身留在名单里），默认 true；0 和 1 手动划掉。" },
        { id: "q3", type: "choice", score: 14,
          stem: "外层圈为什么写到 i * i <= n 就够了？",
          options: ["为了跑得快点，差一点没关系", "合数若有一个大于根号 n 的因子，必配一个小于根号 n 的因子，那个会更早把它划掉", "因为 vector 只能开这么大", "因为 i 乘 i 会溢出"],
          answer: 1,
          why: "这是精确边界不是近似：每个合数都有一个不超过根号 n 的质因子，那一轮就会划掉它。" },
        { id: "q4", type: "output", score: 14, coversTask: 1,
          stem: "名单筛完后，这段打印什么？（一行）\nfor (int i = 2; i <= 10; ++i)\n    if (is_prime[i]) std::print(\"{} \", i);",
          acceptLines: ["2 3 5 7"],
          why: "10 以内素数是 2、3、5、7；每个后面跟一个空格。" },
        { id: "q5", type: "code", score: 18, coversTask: 2,
          stem: "（任务题）按名单从头数，数到第 10 个素数就停下来（把计数与停止那几行写出来，变量名随意，count 或 total 都行）。",
          acceptRegex: ["for\\s*\\(", "is_prime\\s*\\[", "(\\+\\+|\\+=\\s*1)", ">=?\\s*10", "break"],
          why: "扫名单 → 活着就计数 → 数够 10 个 break 跳出。" },
        { id: "q6", type: "blank", score: 8, coversTask: 1,
          stem: "内层划掉时，起点应写成 i 的____（填一个词），而不是 2 乘 i。",
          accept: ["平方", "2次方", "自乘", "i*i"],
          why: "更小的倍数早被前面的质数划过了，从平方起才是筛法的标准姿势。" },
        { id: "q7", type: "multi", score: 16,
          stem: "关于这段代码的说法，哪些对？（多选，错一项整题 0 分）",
          options: ["vector<bool> 是标准库的特殊容器，按位存而不是一份 bool 数组", "名单开成 n 格也够用", "0 和 1 不手动划掉会被当成素数报出来", "外层圈写成 i <= n 会白跑很多轮"],
          answers: [0, 2, 3],
          why: "要装 0 到 n 就得 n + 1 格，差一格是很多翻车现场。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: "std::vector<bool> is_prime(n + 1, true);\nis_prime[0] = is_prime[1] = false;", q3: 1, q4: "2 3 5 7", q5: "int total = 0;\nfor (int i = 2; i <= n; ++i) {\n    if (is_prime[i]) {\n        ++total;\n        if (total >= 10) { std::println(\"{}\", i); break; }\n    }\n}", q6: "平方", q7: [0, 2, 3] }
        ],
        wrongs: [
          { q1: 0, q2: "std::vector<bool> is_prime(n, true);", q3: 0, q4: "2 3 5 7 9", q5: "for (int i = 2; i <= n; ++i) std::println(\"{}\", i);", q6: "两倍", q7: [1, 2] },
          { q1: 3, q2: "std::vector<int> is_prime(n + 1, false);\nis_prime[0] = true;", q3: 2, q4: "1 2 3 5 7", q5: "int total = 0;", q6: "立方", q7: [0, 1] }
        ],
        loose: [
          { q1: "1", q2: "vector < bool > is_prime ( n+1 , true ) ;\nis_prime [ 0 ] = false ; is_prime[1]=false;", q3: "1", q4: "2  3  5  7 ", q5: "int c=0; for(int i=2;i<=n;i++){ if(is_prime[i]){ c=c+1; if(c>=10) break; } }", q6: "i*i", q7: [0, 2, 3] }
        ]
      }
    },
    {
      cid: "m87", kind: "paper", pass: 60,
      title: "第 87 课考试 · 词频统计与热搜",
      task: "任务题目：把排序比较函数改成「先比次数、平局按字典序比单词」；并说清登记与累加这两步怎么写",
      hint: "回看【演示 1 · 登记与累加】与【演示 2 · 排成热搜】。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          stem: "统计词频的通用骨架是哪一句？",
          options: ["先排序再数相邻相同的", "来一个词：表里有就次数加一，没有就登记一行", "给每个词建一个 vector", "用一个大数组按下标存"],
          answer: 1,
          why: "「查有没有 → 有就加、没有就登记」是统计类程序的通用形状，换容器也只是换那一步查法。" },
        { id: "q2", type: "code", score: 20, coversTask: 1,
          stem: "（任务题）写出那段比较 lambda：次数高的在前，次数相同就按单词字典序（小的在前）。",
          acceptRegex: ["if\\s*\\(\\s*a\\.count\\s*!=\\s*b\\.count\\s*\\)\\s*return\\s*a\\.count\\s*>", "return\\s*a\\.word\\s*<"],
          why: "第一关键字比 count（大于＝高的在前），平局才比 word（小于＝字典序在前）。" },
        { id: "q3", type: "output", score: 14, coversTask: 1,
          stem: "词表是 cat dog cat bird cat dog fish，登记完按「次数高的在前」排序，只打印每行的单词，顺序是什么？（一行一个）",
          acceptLines: ["cat", "dog", "bird", "fish"],
          why: "cat 3 次最高；dog 2 次；bird 与 fish 各 1 次，按登记先后出现（没补第二条比较键时顺序不由你定）。" },
        { id: "q4", type: "choice", score: 12,
          stem: "find_word 用 table.size() 当「没找到」的暗号，最贴切的原因是？",
          options: ["它是最小的数", "它正好是一个不存在的行号，拿它当哨兵不会误命中真实行", "它等于 0", "因为 vector 规定这么做"],
          answer: 1,
          why: "行号下标最大是 size 减 1，size 本身天然表示「没有这一行」—— 和 find_if 返回 end 是一个路子。" },
        { id: "q5", type: "multi", score: 16,
          stem: "关于本课这段代码，哪些说法对？（多选，错一项整题 0 分）",
          options: ["成员写成 int count = 0; 是为了不依赖调用处记得初始化", "遍历 text 时往 table 里 push_back 是安全的（两个不同容器）", "只比 count 的话，同次的两个词先后没被规定", "find_word 应该改成按值收 vector 参数，省内存"],
          answers: [0, 1, 2],
          why: "参数该按 const 引用收（第 61 课那条），按值传等于每次复制整张表。" },
        { id: "q6", type: "code", score: 18, coversTask: 2,
          stem: "（延伸题）仿照本课形状，写出「一行成绩单」的类型定义：struct Student，含 std::string name 与 int score，并带一个成员函数 bool passed() const 判断是否及格（60 及以上）。",
          acceptRegex: ["struct\\s+Student\\s*\\{", "std::string\\s+name", "int\\s+score", "bool\\s+passed\\s*\\(\\s*\\)\\s*const"],
          why: "四样齐了：struct 名、两个成员、结尾带 const 的成员函数。" },
        { id: "q7", type: "blank", score: 8,
          stem: "要让「同一个词第二次出现」不再新建一行，靠的是先做一次____（填两个字，指 find_word 干的那件事）。",
          accept: ["查找", "查找行号", "找行号", "查询"],
          why: "先查有没有，再决定加一行还是加一笔 —— 换 map 时省掉的正是这一步的线性扫描。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: "[](const WordCount& a, const WordCount& b) {\n    if (a.count != b.count) return a.count > b.count;\n    return a.word < b.word;\n}", q3: "cat\ndog\nbird\nfish", q4: 1, q5: [0, 1, 2], q6: "struct Student {\n    std::string name;\n    int score;\n    bool passed() const { return score >= 60; }\n};", q7: "查找" }
        ],
        wrongs: [
          { q1: 0, q2: "[](const WordCount& a, const WordCount& b) { return a.count > b.count; }", q3: "bird\nfish\ndog\ncat", q4: 0, q5: [1, 3], q6: "struct Student { std::string name; int score; };", q7: "排序" },
          { q1: 2, q2: "[](WordCount a, WordCount b) { return a.word < b.word; }", q3: "cat\ndog\nfish\nbird", q4: 2, q5: [0, 3], q6: "struct Student { int score; bool passed() { return score > 60; } };", q7: "遍历" }
        ],
        loose: [
          { q1: "1", q2: "[]( const WordCount & a , const WordCount & b ) {\n if ( a.count != b.count ) return a.count > b.count ;\n return a.word < b.word ; }", q3: "cat \n\n dog \n bird \n fish \n", q4: "1", q5: [0, 1, 2], q6: "struct Student{\n std::string name; int score;\n bool passed() const {return score>=60;}\n};", q7: "查找" }
        ]
      }
    },
    {
      cid: "m88", kind: "paper", pass: 60,
      title: "第 88 课考试 · 二维 vector 与转置",
      task: "任务题目：说清两个下标各管什么，写出转置那一行；并判断一个矩阵转置后是否还等于自己",
      hint: "回看「怎么做」那段与【演示 1 · 不规则的表会怎样】。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          stem: "Matrix m; 那么 m[i][j] 的规矩是哪一条？",
          options: ["i 是列、j 是行", "i 是第几行、j 是这一行的第几格", "i 与 j 都是行号", "i 是整张表的格子总数"],
          answer: 1,
          why: "外层容器管行、内层管列；顺序颠倒就会漏格或越界。" },
        { id: "q2", type: "code", score: 20, coversTask: 1,
          stem: "（任务题）写出行列互换那一整句（在双重圈里，把 m 的第 i 行第 j 列搬到 t 的第 j 行第 i 列）。",
          acceptRegex: ["t\\s*\\[\\s*j\\s*\\]\\s*\\[\\s*i\\s*\\]\\s*=\\s*m\\s*\\[\\s*i\\s*\\]\\s*\\[\\s*j\\s*\\]"],
          why: "就一句：两个下标对调。写反了就是自己抄回自己。" },
        { id: "q3", type: "output", score: 14, coversTask: 1,
          stem: "m 是 {{1,2,3},{4,5,6}}。转置后按行打印（每行数字间一个空格），两行分别是什么？",
          acceptLines: ["1 4", "2 5", "3 6"],
          why: "2 行 3 列转成 3 行 2 列：原来的列变成行。" },
        { id: "q4", type: "choice", score: 12,
          stem: "列数应该从哪儿取？",
          options: ["m.size()", "m[0].size()", "两个都一样", "table 的总长度"],
          answer: 1,
          why: "m.size() 是行数。方阵时写错看不出来，长方形立刻越界或漏格。" },
        { id: "q5", type: "multi", score: 16,
          stem: "关于二维 vector，哪些说法对？（多选，错一项整题 0 分）",
          options: ["每一行的长度可以不同（编译器不管）", "Matrix t; 之后直接写 t[0][0] = 1 是未定义行为", "外层 range-for 应写成 const std::vector<int>& 免得每圈复制一行", "把 m 赋给 b 之后，改 b 会连着改 m"],
          answers: [0, 1, 2],
          why: "vector 是值类型，赋的是整份复制，改副本不动原表。" },
        { id: "q6", type: "code", score: 18, coversTask: 2,
          stem: "（任务题）写出判断「是否对称」的核心一句：比较 m 的第 i 行第 j 格与它的转置位置那一格（用两个下标对调写成条件即可）。",
          acceptRegex: ["m\\s*\\[\\s*i\\s*\\]\\s*\\[\\s*j\\s*\\]\\s*!=\\s*m\\s*\\[\\s*j\\s*\\]\\s*\\[\\s*i\\s*\\]"],
          why: "对称 = 每个位置与自己转置后那一格相等；找出一处不等就不是对称。" },
        { id: "q7", type: "blank", score: 8,
          stem: "为了少写三层尖括号，本课用了一行 ____ Matrix = std::vector<std::vector<int>>; 给类型起短名字。（填一个关键字）",
          accept: ["using"],
          why: "using 别名，第 50 课学的东西在复杂类型上开始省事了。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: "t[j][i] = m[i][j];", q3: "1 4\n2 5\n3 6", q4: 1, q5: [0, 1, 2], q6: "if (m[i][j] != m[j][i]) { std::println(\"不对称\"); return false; }", q7: "using" }
        ],
        wrongs: [
          { q1: 0, q2: "t[i][j] = m[i][j];", q3: "1 2 3\n4 5 6", q4: 0, q5: [1, 3], q6: "m[i][j] == m[i][j]", q7: "typedef" },
          { q1: 2, q2: "m[j][i] = t[i][j];", q3: "1 2\n3 4\n5 6", q4: 2, q5: [0, 3], q6: "m[i] != m[j]", q7: "define" }
        ],
        loose: [
          { q1: "1", q2: "t[  j ][ i ]  =  m[ i ][ j ] ;", q3: " 1  4 \n2 5\n 3 6", q4: "1", q5: [0, 1, 2], q6: "if(m [i][j]!=m[j][i]) return false;", q7: "USING" }
        ]
      }
    }
  ]
};
