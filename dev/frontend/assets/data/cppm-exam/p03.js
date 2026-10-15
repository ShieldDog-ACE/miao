/* 喵站 · C++ 掌握 考卷分部 p03：第 86–88 课（主控亲写）
 * 契约与前几场完全一样：权重和 100、任务逐条 coversTask、refs 判 100 / wrongs <60 / loose 过。
 */
window.MIAO_CPPM_EXAM_P03 = {
  papers: [
    {
      cid: "m86", kind: "paper", mode: "ide", authored: "4eb47ee2", file: "main.cpp", pass: 60, title: "第 86 课考试 · 素数筛", task: "任务题目：把 n 改成 100 数出素数个数；再说清「筛到根号 n 就够」为什么是对的", hint: "回看本课「怎么做」那段与【演示 1 · 把名单数出来】。",
      notes: ["筛法的核心思路是反过来划掉一定不是的数，活下来的就是素数；逐个数字试除、除不动就算素数那套叫试除法，两份账要对得上。", "vector<bool> 是标准库的特殊容器，按位存而不是一份 bool 数组。", "内层划掉的起点是 i 的平方，不是 2 乘 i；外层圈写到 i * i <= n 就够了，合数若有一个大于根号 n 的因子，必配一个更小的先把它划掉。", "100 以内素数的个数是数出来的，跑一遍看打印出来的 total 最靠得住；1 不是素数，2 是唯一的偶数素数。", "第 10 个素数是 29：把 break 挪到打印之前就会少报一个，顺序错了账就不对。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：把范围那一只 int 写成 100。", acceptRegex: ["\\bint\\s+\\w+\\s*=\\s*100\\s*;"], acceptOn: "code", sample: "int n = 100;", why: "范围一改，名单就多开几十格；100 以内有多少个素数，跑一遍数得出。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "开一张 bool 名单：std::vector<bool> 装 n + 1 格、初值全给 true，再把第 0 格明确划成 false。", acceptRegex: ["std::vector\\s*<\\s*bool\\s*>\\s+\\w+\\s*\\(\\s*\\w+\\s*\\+\\s*1\\s*,\\s*true\\s*\\)", "\\w+\\s*\\[\\s*0\\s*\\][^;]*false\\s*;"], acceptOn: "code", sample: "std::vector<bool> is_prime(n + 1, true);\nis_prime[0] = is_prime[1] = false;", why: "要装 0 到 n 就得 n + 1 格，差一格是很多翻车现场；0 和 1 不手动划掉会被当成素数报出来。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "外层圈筛到根号 n 就够：for 的中间那截写成 i 乘 i 小于等于 n。", acceptRegex: ["for\\s*\\(\\s*int\\s+(\\w+)\\s*=\\s*2\\s*;\\s*\\1\\s*\\*\\s*\\1\\s*<=\\s*\\w+\\s*;"], acceptOn: "code", sample: "for (int i = 2; i * i <= n; ++i) {", why: "这是精确边界不是近似：每个合数都有一个不超过根号 n 的质因子，那一轮就会划掉它；写成 i <= n 会白跑很多轮。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "内层从平方开始划：起点的 int 写成 i 乘 i，每圈给游标加上 i，把名单那一格写成 false。", acceptRegex: ["\\bint\\s+\\w+\\s*=\\s*(\\w+)\\s*\\*\\s*\\1\\s*;", "\\w+\\s*\\[\\s*\\w+\\s*\\]\\s*=\\s*false\\s*;"], acceptOn: "code", sample: "for (int k = i * i; k <= n; k += i)\n    is_prime[k] = false;", why: "更小的倍数早被前面的质数划过了，从平方起才是筛法的标准姿势；已被划掉的那些用 if (!is_prime[i]) continue; 跳过。" },
        { id: "q5", type: "code", score: 15, coversTask: 1, stem: "把名单数出来：声明一只 int 从 0 起，每遇到还活着的那个就给它加一，最后用一条 std::println 把个数打出来。", acceptRegex: ["\\bint\\s+\\w+\\s*=\\s*0\\s*;", "(\\+\\+\\s*\\w+|\\w+\\s*\\+\\+|\\w+\\s*\\+=\\s*1)", "std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "int total = 0;\nif (is_prime[i]) { std::print(\"{} \", i); ++total; }\nstd::println(\"\\n共 {} 个\", total);", why: "活下来的就是素数；先划再数，这两步分开写才看得清筛法在干什么。" },
        { id: "q6", type: "code", score: 15, coversTask: 2, stem: "任务第 2 条：数够 10 个就当场收工 —— 用一条 if 把计数器和 10 比，成立就 break，再打一行报出那一个素数。", acceptRegex: ["if\\s*\\(\\s*\\w+\\s*(==|>=)\\s*10\\s*\\)", "break\\s*;", "std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "if (total == 10) { std::println(\"第 10 个是 {}\", i); break; }", why: "数够就停是这一问的机关：顺着名单数到 2、3、5、7、11、13、17、19、23 才 9 个，再往前一个就是 29。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <vector>\n\nint main() {\n    int n = 100;                                   // 任务 1：把 50 改成 100\n    std::vector<bool> is_prime(n + 1, true);\n    is_prime[0] = is_prime[1] = false;\n    for (int i = 2; i * i <= n; ++i) {\n        if (!is_prime[i]) continue;\n        for (int k = i * i; k <= n; k += i)\n            is_prime[k] = false;\n    }\n\n    int total = 0;\n    for (int i = 2; i <= n; ++i) {\n        if (!is_prime[i]) continue;\n        ++total;\n        if (total == 10) { std::println(\"第 10 个是 {}\", i); break; }\n        std::print(\"{} \", i);\n    }\n    std::println(\"\\n共 {} 个\", total);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n\nbool trial(int x) {\n    if (x < 2) return false;\n    for (int d = 2; d * d <= x; ++d)\n        if (x % d == 0) return false;\n    return true;\n}\n\nint main() {\n    int n = 100;\n    int total = 0;\n    for (int x = 2; x <= n; ++x) if (trial(x)) ++total;\n    std::println(\"试除法：{} 个\", total);\n    return 0;\n}\n",
          "#include <print>\n#include <vector>\n\nint main() {\n    int n = 100;\n    std::vector<bool> is_prime(n, true);\n    for (int i = 2; i <= n; ++i) std::print(\"{} \", i);\n    return 0;\n}\n",
          "#include <print>\n#include <vector>\n\nint main() {\n    int n = 100;\n    std::vector<bool> is_prime(n + 1, true);\n    for (int i = 2; i <= n; ++i) {\n        for (int k = 2 * i; k <= n; k += i)\n            is_prime[k] = false;\n    }\n    int total = 0;\n    for (int i = 2; i <= n; ++i) if (is_prime[i]) ++total;\n    std::println(\"{}\", total);\n    return 0;\n}\n"],
        loose: [
          "# include <print>\n# include < vector >\n\nint  main ( )\n{\n    int  limit = 100;\n    std::vector < bool >  alive ( limit + 1 , true ) ;\n    alive [ 0 ] = false; alive [ 1 ] = false;\n    for (int p = 2; p * p <= limit; ++p) {\n        if (!alive[p]) continue;\n        for (int m = p * p; m <= limit; m += p) alive [ m ] = false;\n    }\n    int  count = 0;\n    for (int q = 2; q <= limit; q++) {\n        if (!alive[q]) continue;\n        count ++;\n        std::print( \"{} \", q );\n        if (count == 10) break;\n    }\n    std::println( \"一共 {}\" , count );\n    return 0;\n}\n"]
      }
    },
    {
      cid: "m87", kind: "paper", mode: "ide", authored: "a1421878", file: "main.cpp", pass: 60, title: "第 87 课考试 · 词频统计与热搜", task: "任务题目：把排序比较函数改成「先比次数、平局按字典序比单词」；并说清登记与累加这两步怎么写", hint: "回看【演示 1 · 登记与累加】与【演示 2 · 排成热搜】。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 27, coversTask: 1, stem: "（任务题）写出那段比较 lambda：次数高的在前，次数相同就按单词字典序（小的在前）。", acceptRegex: ["if\\s*\\(\\s*a\\.count\\s*!=\\s*b\\.count\\s*\\)\\s*return\\s*a\\.count\\s*>", "return\\s*a\\.word\\s*<"], acceptOn: "code", sample: "[](const WordCount& a, const WordCount& b) {\n    if (a.count != b.count) return a.count > b.count;\n    return a.word < b.word;\n}", why: "第一关键字比 count（大于＝高的在前），平局才比 word（小于＝字典序在前）。" },
        { id: "q2", type: "code", score: 24, coversTask: 2, stem: "（延伸题）仿照本课形状，写出「一行成绩单」的类型定义：struct Student，含 std::string name 与 int score，并带一个成员函数 bool passed() const 判断是否及格（60 及以上）。", acceptRegex: ["struct\\s+Student\\s*\\{", "std::string\\s+name", "int\\s+score", "bool\\s+passed\\s*\\(\\s*\\)\\s*const"], acceptOn: "code", sample: "struct Student {\n    std::string name;\n    int score;\n    bool passed() const { return score >= 60; }\n};", why: "四样齐了：struct 名、两个成员、结尾带 const 的成员函数。" },
        { id: "q3", type: "code", score: 21, coversTask: 1, stem: "（任务题）次数相同才轮到第二关键字：把比单词字典序、小的在前那一句单独写出来。", acceptRegex: ["return\\s+a\\s*\\.\\s*word\\s*<\\s*b\\s*\\.\\s*word"], acceptOn: "code", sample: "return a.word < b.word;", why: "std::string 自带字典序的小于比较，直接写 a.word < b.word 就是「小的在前」；比较函数里返回 true 的一直是「该排在前面」那一个。" },
        { id: "q4", type: "code", score: 28, coversTask: 2, stem: "（延伸题）仿本课形状给成绩单排名：写出比较 lambda，参数按 const Student& 收两张名片（叫 a 和 b），总分高的在前，总分靠调用成员函数 total() 拿到。", acceptRegex: ["\\(\\s*(const\\s+)?Student\\s*&\\s*a\\s*,\\s*(const\\s+)?Student\\s*&\\s*b\\s*\\)", "a\\s*\\.\\s*total\\s*\\(\\s*\\)\\s*>\\s*b\\s*\\.\\s*total\\s*\\(\\s*\\)"], acceptOn: "code", sample: "[](const Student& a, const Student& b) { return a.total() > b.total(); }", why: "成员函数就在名片自己身上，靠 a.total() 喊一声就能拿到总分；总分高的在前，所以返回的是大于 —— 大于小于写反，名次整个倒过来。" }
      ],
      selftest: {
        refs: [
          "#include <string>\nint main() {\n    [](const WordCount& a, const WordCount& b) {\n    if (a.count != b.count) return a.count > b.count;\n    return a.word < b.word;\n    }\n    struct Student {\n    std::string name;\n    int score;\n    bool passed() const { return score >= 60; }\n    };\n    return a.word < b.word;\n    [](const Student& a, const Student& b) { return a.total() > b.total(); }\n    return 0;\n}\n"],
        wrongs: [
          "",
          "[](const WordCount& a, const WordCount& b) { return a.count > b.count; }",
          "struct Student { std::string name; int score; };",
          "return a.count > b.count;",
          "[](const Student& a, const Student& b) { return a.total() < b.total(); }"],
        loose: [
          "#include <string>\nint main() {\n    []( const WordCount & a , const WordCount & b ) {\n    if ( a.count != b.count ) return a.count > b.count ;\n    return a.word < b.word ; }\n    struct Student{\n    std::string name; int score;\n    bool passed() const {return score>=60;}\n    };\n    return   a . word  <  b.word ;\n    [ ] ( const  Student &  a ,  const Student &  b ) {  return  a . total ( )  >  b . total ( ) ;  }\n    return 0;\n}\n"]
      }
    },
    {
      cid: "m88", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 88 课考试 · 二维 vector 与转置", task: "任务题目：说清两个下标各管什么，写出转置那一行；并判断一个矩阵转置后是否还等于自己", hint: "回看「怎么做」那段与【演示 1 · 不规则的表会怎样】。",
      notes: ["m[i] 是第 i 行那个 vector，m[i][2] 是第二行的第三格；m.size() 是行数，m[0].size() 是列数。", "方阵时行列数写错看不出来，长方形立刻越界或漏格；每一行的长度可以不同，取不规则的表里 m[0][3] 不报错，只是读到你不想读的地方。", "外层 range-for 写成 const std::vector<int>& row：按引用读行，别每圈复制整行。", "把 m 赋给 b 是整份复制，改副本不动原表：vector 是值类型。", "std::vector<int>(m.size()) 这种写法发出来的格子默认就是 0，正好当累加器的起点；有几列就发几个格子。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "给那张表起个短名字：一行 using，把 vector 套 vector 的 int 起成一个别名。", acceptRegex: ["\\busing\\s+\\w+\\s*=\\s*std::vector\\s*<\\s*std::vector\\s*<\\s*int\\s*>\\s*>"], acceptOn: "code", sample: "using Matrix = std::vector<std::vector<int>>;", why: "三层尖括号不必反复写；外层容器管行、内层管列。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "写出 multiply 的头部：两张表都按引用递给函数，还回来的是这张表那个类型。", acceptRegex: ["\\w+\\s+multiply\\s*\\(\\s*(const\\s+)?\\w+\\s*&\\s*\\w+\\s*,\\s*(const\\s+)?\\w+\\s*&\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "Matrix multiply(const Matrix& a, const Matrix& b) {", why: "按值递整张表就是每圈复印一遍：外层 range-for 都写成 const 引用读行，何况递函数。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "先备好结果表：按第一个数的行数、第二个数的列数发出格子，内层用 std::vector<int>(格数) 默认给 0。", acceptRegex: ["\\w+\\s+\\w+\\s*\\(\\s*[^,;]+\\s*,\\s*std::vector\\s*<\\s*int\\s*>\\s*\\("], acceptOn: "code", sample: "Matrix result(a.size(), std::vector<int>(b[0].size()));", why: "格子还没发出来就写 result[0][0] 是未定义行为；+= 更要那格本来有个 0 在等加。" },
        { id: "q4", type: "code", score: 20, coversTask: 1, stem: "三重循环里那一格这么算：result 的第 i 行第 j 格，累加 a[i][k] 乘 b[k][j]。", acceptRegex: ["\\w+\\s*\\[\\s*\\w+\\s*\\]\\s*\\[\\s*\\w+\\s*\\]\\s*\\+=\\s*\\w+\\s*\\[\\s*\\w+\\s*\\]\\s*\\[\\s*\\w+\\s*\\]\\s*\\*\\s*\\w+\\s*\\[\\s*\\w+\\s*\\]\\s*\\[\\s*\\w+\\s*\\]"], acceptOn: "code", sample: "for (size_t k = 0; k < b.size(); ++k)\n    result[i][j] += a[i][k] * b[k][j];", why: "行乘列：i 走第一个数的行，j 走第二个数的列，k 在中间把这一行与那一列对齐加起来。" },
        { id: "q5", type: "code", score: 20, coversTask: 2, stem: "任务第 2 条：比一比一张表和第 1 题那张转置表 —— 写一句把第 i 行第 j 格和第 j 行第 i 格对调比较的条件。", acceptRegex: ["(\\w+)\\s*\\[\\s*(\\w+)\\s*\\]\\s*\\[\\s*(\\w+)\\s*\\]\\s*(==|!=)\\s*\\1\\s*\\[\\s*\\3\\s*\\]\\s*\\[\\s*\\2\\s*\\]"], acceptOn: "code", sample: "if (m[i][j] != m[j][i]) return false;", why: "对称就是每个位置与自己转置后那一格相等；找出一处不等就不是对称矩阵。" },
        { id: "q6", type: "code", score: 15, coversTask: 2, stem: "把判断写成一个函数：返回 bool，参数是一张表的引用，里面既有 return false 也有 return true。", acceptRegex: ["\\bbool\\s+\\w+\\s*\\(\\s*(const\\s+)?\\w+(\\s*<[^>]*>)?\\s*&\\s*\\w+\\s*\\)", "\\breturn\\s+false\\s*;", "\\breturn\\s+true\\s*;"], acceptOn: "code", sample: "bool symmetric(const Matrix& m) {\n    for (size_t i = 0; i < m.size(); ++i)\n        if (m[i][0] != m[0][i]) return false;\n    return true;\n}", why: "转置后还等于自己这件事是个判断题，交给一个还回 bool 的函数最顺手；全程不换指向就不用写纸条。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <vector>\n\nusing Matrix = std::vector<std::vector<int>>;\n\nMatrix multiply(const Matrix& a, const Matrix& b) {\n    Matrix result(a.size(), std::vector<int>(b[0].size()));\n    for (size_t i = 0; i < a.size(); ++i)\n        for (size_t j = 0; j < b[0].size(); ++j)\n            for (size_t k = 0; k < b.size(); ++k)\n                result[i][j] += a[i][k] * b[k][j];\n    return result;\n}\n\nbool symmetric(const Matrix& m) {\n    for (size_t i = 0; i < m.size(); ++i)\n        for (size_t j = 0; j < m[i].size(); ++j)\n            if (m[i][j] != m[j][i]) return false;\n    return true;\n}\n\nint main() {\n    Matrix sq = {{1, 2}, {2, 1}};\n    std::println(\"对称吗 {}\", symmetric(sq));\n    for (const std::vector<int>& row : multiply(sq, sq)) {\n        for (int v : row) std::print(\"{} \", v);\n        std::println(\"\");\n    }\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <vector>\n\nstd::vector<std::vector<int>> multiply(std::vector<std::vector<int>> a, std::vector<std::vector<int>> b) {\n    std::vector<std::vector<int>> result;\n    result[0][0] = a[0][0] * b[0][0];\n    return result;\n}\n\nint main() { return 0; }\n",
          "#include <print>\n#include <vector>\n\nusing Matrix = std::vector<std::vector<int>>;\n\nMatrix multiply(const Matrix& a, const Matrix& b) {\n    Matrix result(a.size(), std::vector<int>(b[0].size()));\n    for (size_t i = 0; i < a.size(); ++i)\n        for (size_t j = 0; j < b[0].size(); ++j)\n            result[i][j] = a[i][j] + b[i][j];\n    return result;\n}\n\nint main() { return 0; }\n",
          "#include <print>\n#include <vector>\n\nusing Matrix = std::vector<std::vector<int>>;\n\nbool symmetric(const Matrix& m) {\n    for (size_t i = 0; i < m.size(); ++i)\n        for (size_t j = 0; j < m[i].size(); ++j)\n            if (m[i][j] != m[i][j]) return false;\n    return true;\n}\n\nint main() {\n    Matrix m = {{1, 2}, {2, 1}};\n    std::println(\"{}\", symmetric(m));\n    return 0;\n}\n"],
        loose: [
          "# include < vector >\n# include < print >\n\nusing  Grid = std::vector < std::vector < int > > ;\n\nGrid  multiply ( Grid &  left , Grid &  right )\n{\n    Grid  out ( left.size( ) , std::vector < int > ( right [ 0 ].size( ) ) ) ;\n    for (size_t r = 0; r < left.size(); r++)\n        for (size_t c = 0; c < right [ 0 ].size(); c++)\n            for (size_t t = 0; t < right.size(); t++)\n                out [ r ][ c ] += left [ r ][ t ] * right [ t ][ c ];\n    return out;\n}\n\nbool  same_after_flip ( const  Grid &  g )\n{\n    for (size_t r = 0; r < g.size(); r++)\n        for (size_t c = 0; c < g [ r ].size(); c++)\n            if (g [ r ][ c ] != g [ c ][ r ]) return false;\n    return true;\n}\n\nint  main ( )\n{\n    Grid  sq = { {1, 2}, {2, 1} } ;\n    std::println( \"对称 {}\" , same_after_flip(sq) );\n    for (const std::vector<int>& row : multiply(sq, sq)) {\n        for (int v : row) std::print(\"{} \", v);\n        std::println(\"\");\n    }\n    return 0;\n}\n"]
      }
    },
  ]
};
