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
      cid: "c67", kind: "paper", mode: "ide", authored: "cccb0ba6", file: "main.cpp", pass: 60, title: "第 67 课考试 · const 引用：读大对象的标准姿势", task: "任务题目：写一只 double average，参数是 const 引用的一串 int 分数，函数只读不写，把平均分算出来还回来并打印掉", hint: "想不起来就回看正文【演示 3】三种带法同框那一段、【任务】第 1 条，以及【常见坑】第一条。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 26, coversTask: 1, stem: "把 average 的函数头写出来：收一份只读不许动的 int 名单，还一个小数形式的平均分。函数体不用写。", acceptRegex: ["const\\s+std::vector\\s*<\\s*int\\s*>\\s*&"], acceptOn: "code", sample: "double average(const std::vector<int>& v) {", why: "关键是 const、std::vector<int>、& 三样一起出现：缺 & 就变成整本复印，缺 const 就写不了只递进来的临时名单，也保不住「我不动它」这句承诺。" },
        { id: "q2", type: "code", score: 37, coversTask: 1, stem: "写一行：把只读名单 v 从头到尾走一遍，这一轮那个数叫 x。", acceptRegex: ["for\\s*\\(\\s*(const\\s+int\\s*&|int)\\s+x\\s*:\\s*v"], acceptOn: "code", sample: "for (const int& x : v) {", why: "范围 for 念的是名单里的名字。循环变量前面挂上 const int&，一格值都不抄；名单本身是 const 引用，读它天经地义，写它才会被拦。" },
        { id: "q3", type: "code", score: 37, coversTask: 1, stem: "写一行：把平均分交回外面 —— 累计好的 sum 除以名单的长度。", acceptRegex: ["return\\s+sum\\s*/\\s*v\\s*\\.\\s*size\\s*\\(\\s*\\)"], acceptOn: "code", sample: "return sum / v.size();", why: "只有合计还不够，除以长度才是平均。名单长度用 size() 问出来，这一行交出去的小数才留得住。" }
      ],
      selftest: {
        refs: [
          "#include <vector>\ndouble average(const std::vector<int>& v) {\n}\nint main() {\n    for (const int& x : v) {\n    return sum / v.size();\n    return 0;\n}\n}\n"],
        wrongs: [
          "",
          "double average(std::vector<int> v) {",
          "for (int x = 0; x < 10; x++) {",
          "return sum;"],
        loose: [
          "#include <vector>\nint main() {\n    double  average ( const std::vector < int > & v )\n    for ( const  int &  x  :  v ){\n    return  sum /  v . size ( ) ;\n    return 0;\n}\n}\n"]
      }
    },
    {
      cid: "c68", kind: "paper", mode: "ide", authored: "04ec7a1f", file: "main.cpp", pass: 60, title: "第 68 课考试 · 默认参数：不传就用备用值", task: "任务题目：写一只 int power，收底数和指数，指数留一个备用值 2 —— 只递 5 就算平方得 25，递 2 和 10 就得 1024", hint: "想不起来就回看正文【演示 2】那三行输出、【演示 3】里被注释掉的那一句，以及【常见坑】第一条。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 17, coversTask: 1, stem: "把 power 的函数头写出来：一位底数、一位指数，指数带上备用值 2。", acceptRegex: ["exp\\s*=\\s*2"], acceptOn: "code", sample: "int power(int base, int exp = 2) {", why: "备用值直接跟在参数名后面写在函数头：int power(int base, int exp = 2)。写在调用处不但不行，还会把语法弄崩。" },
        { id: "q2", type: "code", score: 31, coversTask: 1, stem: "写一行循环：从 0 数到 exp，每轮把 r 乘上一个 base。", acceptRegex: ["for\\s*\\(\\s*int\\s+i\\s*=\\s*0\\s*;\\s*i\\s*<\\s*exp", "r\\s*=\\s*r\\s*\\*\\s*base"], acceptOn: "code", sample: "for (int i = 0; i < exp; i = i + 1) r = r * base;", why: "exp 无论来自实参还是备用值，在函数体里都只是一位普通的 int，循环照常数满它，r 就自乘了那么多回。" },
        { id: "q3", type: "code", score: 26, coversTask: 1, stem: "写一行调用：只递底数 5，指数那格不写，让备用值去补。", acceptRegex: ["power\\s*\\(\\s*5\\s*\\)"], acceptOn: "code", sample: "power(5);", why: "省略那一格不等于空着：实参表里只写一个 5，编译器在调用那一刻把备用值 2 塞进第二格，所以算出来是 25。" },
        { id: "q4", type: "code", score: 26, coversTask: 1, stem: "写一行调用：两位都递满 —— 底数 2、指数 10，这一声用不上备用值。", acceptRegex: ["power\\s*\\(\\s*2\\s*,\\s*10\\s*\\)"], acceptOn: "code", sample: "power(2, 10);", why: "你递了 10，函数收到的 exp 就是 10，函数头那句 = 2 一句都插不上嘴，所以算出 1024。" }
      ],
      selftest: {
        refs: [
          "int power(int base, int exp = 2) {\n}\nint main() {\n    for (int i = 0; i < exp; i = i + 1) r = r * base;\n    power(5);\n    power(2, 10);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "int power(int base, int exp) {",
          "int r = 1;\nfor (int i = 0; i < exp; i = i + 1) r = r + base;\nreturn r;",
          "power(5, 2);",
          "power(2);"],
        loose: [
          "int main() {\n    int power ( int base , int exp  =  2 )\n    int r = 1;\n    for ( int  i = 0 ;  i <  exp ;  i = i + 1 )  r =  r *  base ;\n    return r;\n    power ( 5 ) ;\n    power ( 2 ,  10 ) ;\n    return 0;\n}\n"]
      }
    },
    {
      cid: "c69", kind: "paper", mode: "ide", authored: "17192f99", file: "main.cpp", pass: 60, title: "第 69 课考试 · 函数重载：一名多用", task: "任务题目：给 twice 再开一扇文字窗 —— 加一版收 std::string 的 twice，让 ab 变成 abab，记得在文件顶部补 include string", hint: "想不起来就回看正文【演示 2】那三版 twice、【演示 3】那个歧义现场，以及【常见坑】第一条和第二条。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 22, coversTask: 1, stem: "写出字符串版 twice 的函数头：名字照旧叫 twice，收一串文字、还一串文字。", acceptRegex: ["std::string\\s+twice\\s*\\(\\s*std::string"], acceptOn: "code", sample: "std::string twice(std::string s) {", why: "名字必须和前两版一模一样，区分靠的是参数类型 std::string —— 返回类型也写成 std::string 没问题，但它不是挑版本的依据。" },
        { id: "q2", type: "code", score: 19, coversTask: 1, stem: "写出那一版的身体里那句 return：把收进来的串自己接自己一次。", acceptRegex: ["return\\s+s\\s*\\+\\s*s"], acceptOn: "code", sample: "return s + s;", why: "s + s 就够了，ab 变 abab。写成 s 加一个引号里的 s 会把字母 s 接上去，得到 abs —— 这类差别正是笔试要看的。" },
        { id: "q3", type: "code", score: 29, coversTask: 1, stem: "写一行：在文件顶部把标准库里的文字工具箱搬进来 —— 少了它，std::string 是没人认识的名字。", acceptRegex: ["#\\s*include\\s*<\\s*string\\s*>"], acceptOn: "code", sample: "#include <string>", why: "字符串版 twice 的返回值和参数都写的是 std::string，这个类型住在那个文件里，得先搬进来编译器才认得。" },
        { id: "q4", type: "code", score: 30, coversTask: 1, stem: "写一行：喊一声 twice 递进去文字 ab，把打出来的结果打印在一对花括号那一位上。", acceptRegex: ["twice\\s*\\(\\s*\"ab\""], acceptOn: "code", sample: "std::println(\"{}\", twice(\"ab\"));", why: "递进去的是带引号的一串文字，只有字符串版收得了，于是同名的三扇窗里编译器挑中这一扇，打出 abab。" }
      ],
      selftest: {
        refs: [
          "#include <string>\n#include <print>\nstd::string twice(std::string s) {\n}\nint main() {\n    return s + s;\n    std::println(\"{}\", twice(\"ab\"));\n    return 0;\n}\n"],
        wrongs: [
          "",
          "std::string twice(int s) {",
          "return s + \"s\";",
          "#include <print>",
          "std::println(\"{}\", twice(7));"],
        loose: [
          "#  include   < string >\n#include <print>\nint main() {\n    std::string twice ( std::string  s )\n    return s+s ;\n    std::println ( \"{}\" ,  twice ( \"ab\" ) ) ;\n    return 0;\n}\n"]
      }
    },
    {
      cid: "c70", kind: "paper", mode: "ide", authored: "9c57f919", file: "main.cpp", pass: 60, title: "第 70 课考试 · 多个结果：引用参数当答案格", task: "任务题目：给 stats 再添一张答案格 count，一次交出总分、最高分和及格人数 —— 分数大于等于 60 就算及格", hint: "想不起来就回看正文【演示 2】那三处手续、【演示 3】那个越喊越大的现场，以及【常见坑】第一条和第二条。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 22, coversTask: 1, stem: "把添了一张答案格之后的 stats 函数头写出来：一份只读名单，三只待填的 int 盒子，最后那只叫 count。", acceptRegex: ["int\\s*&\\s*count"], acceptOn: "code", sample: "void stats(const std::vector<int>& v, int& total, int& best, int& count) {", why: "答案格就是裸引用参数 int& count，和 total、best 一样排在名单之后；名单自己还得留在 const 引用那位上，一个都不许动。" },
        { id: "q2", type: "code", score: 19, coversTask: 1, stem: "写出数及格人数那一句里的比较条件：收到的分数够 60 才算过关。", acceptRegex: [">=\\s*60"], acceptOn: "code", sample: "if (x >= 60) count = count + 1;", why: "大于等于才把刚好 60 那位算进来；写成只有大于号就把及格线抬高了一分，人数会少算。命中之后给 count 加一笔。" },
        { id: "q3", type: "code", score: 29, coversTask: 1, stem: "写一行：在 main 里把三只答案格摆出来 —— total、best，再加上新添的那只 count，全部从 0 起步。", acceptRegex: ["int\\s+total\\s*=\\s*0", "count\\s*=\\s*0"], acceptOn: "code", sample: "int total = 0, best = 0, count = 0;", why: "答案格由调用处先声明好，函数才有一格真格子可写；count 站在裸引用位上，声明漏了它，递进去的就不是那格内存。" },
        { id: "q4", type: "code", score: 30, coversTask: 1, stem: "写一行：把名单 scores 和三只答案格一起递进 stats，最后那位是新增的 count。", acceptRegex: ["stats\\s*\\(\\s*scores\\s*,\\s*total\\s*,\\s*best\\s*,\\s*count\\s*\\)"], acceptOn: "code", sample: "stats(scores, total, best, count);", why: "签名多了一格，调用处就得多数一个名字，而且顺序要和参数表对上；递进去的是格子的名字，不是一个现成的数。" }
      ],
      selftest: {
        refs: [
          "#include <vector>\nvoid stats(const std::vector<int>& v, int& total, int& best, int& count) {\n}\nint main() {\n    if (x >= 60) count = count + 1;\n    int total = 0, best = 0, count = 0;\n    stats(scores, total, best, count);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "void stats(std::vector<int> v, int total, int best, int count) {",
          "if (x > 60) count = count + 1;",
          "int total = 0, best = 0;",
          "stats(scores, total, best);"],
        loose: [
          "#include <vector>\nint main() {\n    void stats ( const std::vector<int> & v , int & total , int & best , int & count )\n    if(x>=60) count++;\n    int  total = 0 , best = 0 , count  =  0 ;\n    stats ( scores , total ,  best ,  count ) ;\n    return 0;\n}\n"]
      }
    },
  ]
};
