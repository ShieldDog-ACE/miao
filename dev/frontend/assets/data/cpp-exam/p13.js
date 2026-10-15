/* 喵站 · C++ 入门 考卷分部 p13：第 55–58 课（第九轮 · 函数喊函数 + lambda + 引用初见）
 *
 * 每场卷照 cpp-exam/p06.js 的形状与硬指标（cpp-exam-check 逐条对账）：
 *   1. kind:"paper"，题型只用笔试引擎认的六种；
 *   2. 各题 score 相加正好 100；
 *   3. 源稿每一条【任务】都有题用 coversTask 对着它；
 *   4. 带 coversTask 的题合计 >=50 分；choice >=2；output >=1；
 *   5. 每题带 why；selftest 的 refs 判 100、wrongs 判 <60、loose 判 >=60。
 *
 * 守的闸线：c55 卷面不出现 lambda、引用；c56、c57 卷面不出现引用参数与 const 引用；
 *           c58 只考「外号」这一层，指针不碰。读者看得见的字段一律用中文括号。
 *
 * 验收：node dev/tools/cpp-exam-check.cjs --only c55,c56,c57,c58
 */
window.MIAO_CPP_EXAM_P13 = {
  papers: [
    {
      cid: "c55", kind: "paper", mode: "ide", authored: "e056dbcc", file: "main.cpp", pass: 60, title: "第 55 课考试 · 函数调用函数", task: "任务题目：写一个收一整串分数、返回平均分的 average，把它接到 report 里用上；再给 grade_of 加一档：大于等于 95 返回「顶呱呱」", hint: "想不起来就回看正文【演示 2】那条分工链、【演示 3】里 report 喊 average 的那一行，以及【常见坑】第一条。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 18, coversTask: 1, stem: "把 average 的函数头写出来：它收一整串 int 分数，返回小数形式的平均分。", acceptRegex: ["double\\s+average\\s*\\("], acceptOn: "code", sample: "double average(std::vector<int> scores) {", why: "返回类型必须是 double —— 写成 int 会把小数位砍掉；参数写 std::vector<int> 才收得下一整串分数。函数体先累加再除以 size()。" },
        { id: "q2", type: "code", score: 17, coversTask: 2, stem: "写出加档的那一句：score 大于等于 95 时，返回文字「顶呱呱」。", acceptRegex: ["score\\s*>=\\s*95"], acceptOn: "code", sample: "if (score >= 95) return \"顶呱呱\";", why: "关键在于 >= 95 这个比较写法要对，并且这句要放在 90 那句前面，否则 96 分早被前面拦走了。" },
        { id: "q3", type: "code", score: 32, coversTask: 1, stem: "（任务题）average 的函数头已经写好。写出函数体里的三行：先备好一个小数格子 sum，初值 0；用 for 把 scores 里的分数逐个加进去；最后返回 sum 除以分数的个数。", acceptRegex: ["double\\s+sum\\s*=\\s*0\\s*;", "for\\s*\\(\\s*auto\\s+\\w+\\s*:\\s*scores\\s*\\)", "return\\s+sum\\s*/[\\s\\S]{0,40}size\\s*\\(\\s*\\)\\s*;"], acceptOn: "code", sample: "double sum = 0;\nfor (auto s : scores) sum += s;\nreturn sum / scores.size();", why: "累加的格子用 double 装，除法才不会把小数那一截砍掉；个数用 size() 现算，表长变了也不用改代码。" },
        { id: "q4", type: "code", score: 33, coversTask: 2, stem: "（任务题）把 grade_of 整个写一遍：收一个 int 分数，从上往下依次挡四档 —— 95 以上返回「顶呱呱」，90 以上返回「优秀」，80 以上返回「良好」，其余返回「及格」。", acceptRegex: ["string\\s+grade_of\\s*\\(\\s*int", ">=\\s*95[\\s\\S]{0,80}顶呱呱[\\s\\S]{0,80}>=\\s*90[\\s\\S]{0,80}>=\\s*80"], acceptOn: "code", sample: "std::string grade_of(int score) {\n    if (score >= 95) return \"顶呱呱\";\n    if (score >= 90) return \"优秀\";\n    if (score >= 80) return \"良好\";\n    return \"及格\";\n}", why: "命中就 return，函数当场结束，所以高一档必须写在低一档前面；夹在 90 后面，96 分早被前面拦走，新档永远轮不到。" }
      ],
      selftest: {
        refs: [
          "#include <vector>\n#include <string>\ndouble average(std::vector<int> scores) {\n}\nstd::string grade_of(int score) {\n    if (score >= 95) return \"顶呱呱\";\n    if (score >= 90) return \"优秀\";\n    if (score >= 80) return \"良好\";\n    return \"及格\";\n}\nint main() {\n    if (score >= 95) return \"顶呱呱\";\n    double sum = 0;\n    for (auto s : scores) sum += s;\n    return sum / scores.size();\n    return 0;\n}\n"],
        wrongs: [
          "",
          "int average(std::vector<int> scores) {",
          "if (score > 95) return score;",
          "int sum = 0;\nfor (auto s : scores) sum += s;\nreturn sum;",
          "std::string grade_of(int score) {\n    if (score >= 90) return \"优秀\";\n    if (score >= 95) return \"顶呱呱\";\n    if (score >= 80) return \"良好\";\n    return \"及格\";\n}"],
        loose: [
          "#include <vector>\nstring  grade_of ( int  s )  {  if ( s  >=  95 )  return  \"顶呱呱\" ;  if ( s  >=  90 )  return  \"优秀\" ;  if ( s  >=  80 )  return  \"良好\" ;  return  \"及格\" ;  }\nint main() {\n    double  average ( std::vector <int> scores )\n    if(score>=95){return \"顶呱呱\";}\n    double  sum  =  0  ;\n    for( auto  one  :  scores )  sum += one ;\n    return  sum /  scores . size ( ) ;\n    return 0;\n}\n"]
      }
    },
    {
      cid: "c56", kind: "paper", mode: "ide", authored: "d3638384", file: "main.cpp", pass: 60, title: "第 56 课考试 · lambda 临时小函数", task: "任务题目：写一把算平方的 lambda，拿 3、9、16 三个数试；再写一把判断及格的 lambda，分数大于等于 60 就返回 true", hint: "想不起来就回看正文【演示 1】那句 auto mul 开头、【演示 2】里写完立刻喊的那一行，还有【常见坑】第三条关于分号。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "补出求平方那把工具的开头：它收一个 int，用 auto 存起来。（只写关键的前半截就行）", acceptRegex: ["\\[\\s*\\]\\s*\\(\\s*int"], acceptOn: "code", sample: "auto sq = [](int x) { return x * x; };", why: "句式是 auto sq = [](int x) { return x * x; }; —— 中括号空着表示不拿外面的东西，紧跟的参数表收一个 int，句末那个分号不能少。" },
        { id: "q2", type: "code", score: 16, coversTask: 2, stem: "写出那把及格判断工具的身体：收到分数 x，把它和 60 比，够格就交还真。", acceptRegex: [">=\\s*60"], acceptOn: "code", sample: "return x >= 60;", why: "身体就一句 return x >= 60; —— 比较本身就是真假，不用再绕一层 if。用大于号不加等号会把刚好 60 分的人判出去。" },
        { id: "q3", type: "code", score: 34, coversTask: 1, stem: "（任务题）写完整的一句声明：用 auto 接住一把小工具，它收一个 int，返回这个数乘它自己。", acceptRegex: ["auto\\s+\\w+\\s*=\\s*\\[\\s*\\]\\s*\\(\\s*int\\s+\\w+\\s*\\)", "return\\s+\\w+\\s*\\*\\s*\\w+", "\\}\\s*;"], acceptOn: "code", sample: "auto sq = [](int x) { return x * x; };", why: "中括号空着表示不拿外面的东西，圆括号是参数表，花括号里那句 return 就是它的身体；整句是一条声明语句，右花括号后面那个分号不能少。" },
        { id: "q4", type: "code", score: 30, coversTask: 2, stem: "（任务题）写两行：先做一把判断及格的小工具，收一个 int 分数，大于等于 60 就交还真；再用 std::println 把 59 递给它、把还回来的结果打出来。", acceptRegex: ["auto\\s+\\w+\\s*=\\s*\\[\\s*\\]\\s*\\(\\s*int\\s+\\w+\\s*\\)", ">=\\s*60", "println[\\s\\S]{0,120}\\(\\s*\\d+\\s*\\)"], acceptOn: "code", sample: "auto pass = [](int x) { return x >= 60; };\nstd::println(\"{}\", pass(59));", why: "身体里直接 return 那句比较，比较的结果本来就是真假；加上圆括号把 59 递进去，这把工具才真跑起来。" }
      ],
      selftest: {
        refs: [
          "#include <print>\nint main() {\n    auto sq = [](int x) { return x * x; };\n    return x >= 60;\n    auto sq = [](int x) { return x * x; };\n    auto pass = [](int x) { return x >= 60; };\n    std::println(\"{}\", pass(59));\n    return 0;\n}\n"],
        wrongs: [
          "",
          "auto sq(int x) { return x * x; }",
          "return x > 60;",
          "auto sq = [](int x) {\n    return x + x;\n};",
          "auto pass = [](int x) { return x > 60; };\nstd::println(\"{}\", pass(59));"],
        loose: [
          "int main() {\n    auto sq = [ ] ( int x ) { return x * x; } ;\n    if (x >= 60) { return true; }\n    auto   sq  =  [ ]  (  int  v  )  {  return  v * v ;  }  ;\n    auto  out  =  [ ]  (  int  score  )  {  return  score  >=  60 ;  } ;\n    println ( \"{}\" ,  out ( 59 ) ) ;\n    return 0;\n}\n"]
      }
    },
    {
      cid: "c57", kind: "paper", mode: "ide", authored: "a10e9c02", file: "main.cpp", pass: 60, title: "第 57 课考试 · lambda 捕获变量", task: "任务题目：先在外面写 int bonus = 5，再做一把中括号里点上 bonus 的小工具，把一个分数递进去、拿回加上奖励分的结果；再想一想：要是想让这把工具永远用的是最新值，路子在哪儿", hint: "想不起来就回看正文【演示 1】那两行输出、【演示 2】一次抄两个名字那句，还有那张复印件示意图。",
      notes: ["中括号里点名，是在那一行被执行的这一刻复印一份带走：之后原件改成 200，跟包里那份没关系，算的还是抄下的 100 加 1。", "「抄」发生在程序跑到定义这把工具那一行的时候，不是编译器读源码时，也不是每次喊它时。", "抄进来的那份是只读的：在工具身体里给它赋值会被编译器拦下来，报错里带 captured by a copy 那几个字；想动它就在包里另开一个盒子（int inside = base + x;）。", "同一个工具喊两次用的还是同一份复印件，外面的原件后来被改掉也不会跟着变；申领单上点两个名字就各抄一份，连文字也一起抄。", "想让包里那份一直连着原件，要换的是带法（往后一课讲）；空着中括号只会让它压根看不见那个变量，把变量写成 const 或多喊几次都追不到最新值。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "在外面先把那个加成值声明好、赋上 5：一个 int，出生就给值。", acceptRegex: ["int\\s+\\w+\\s*=\\s*5\\s*;"], acceptOn: "code", sample: "int bonus = 5;", why: "变量得先存在，才能被中括号点名；先在外面把它声明好、赋上值，是这四步里的第一步。" },
        { id: "q2", type: "code", score: 25, coversTask: 1, stem: "写这把小工具并用 auto 接住：中括号里点上要带走的那个名字，圆括号里收一个 int，身体里用 return 把收到的值和带走的那份相加交回。", acceptRegex: ["auto\\s+\\w+\\s*=\\s*\\[\\s*\\w+\\s*\\]\\s*\\(\\s*int\\s+\\w+\\s*\\)", "return\\s+\\w+\\s*\\+\\s*\\w+\\s*;"], acceptOn: "code", sample: "auto add = [bonus](int s) {\n    return s + bonus;\n};", why: "申领单就写在中括号里：点了谁，定义那一行就把谁的值复印一份带在身上。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "喊它一次，把拿到的结果用一条 std::println 打出来：逗号后面直接写那次调用。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\(\\s*\\d+\\s*\\)\\s*\\)"], acceptOn: "code", sample: "std::println(\"80 + 5 = {}\", add(80));", why: "抄进来的 bonus 是 5，喊一次就把收到的分数加上包里那份 5：80 变 85。" },
        { id: "q4", type: "code", score: 20, coversTask: 2, stem: "任务第 2 条那个思考要从对照实验出发：定义之后把外面那个变量改成另一个三位数，再喊一次这把工具并打出结果，看它用的是新值还是抄下的那份。", acceptRegex: ["\\w+\\s*=\\s*(?:1[0-9]{2}|[2-9]\\d{2})\\s*;", "\\w+\\s*\\(\\s*\\d+\\s*\\)[\\s\\S]*\\w+\\s*\\(\\s*\\d+\\s*\\)"], acceptOn: "code", sample: "bonus = 200;\nstd::println(\"{}\", add(1));", why: "复印早就完成了：原件后来换成 200，跟包里那份没关系，喊它算的还是 100 加 1 —— 这一课最容易想歪的就是这个时机。" },
        { id: "q5", type: "code", score: 20, coversTask: 2, stem: "把你想到的出路用一行注释写在旁边：想永远用最新值，得换什么样的带法。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 出路是包里不存复印件，存能跟着原件走的东西 —— 往后一课的带 & 的写法", why: "这一条只能验你确实记了一行笔记，验不了笔记内容对不对；那一课还没讲，本场判不了代码。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint main() {\n    int bonus = 5;\n\n    auto add = [bonus](int s) {\n        return s + bonus;\n    };\n\n    std::println(\"{}\", add(80));\n    std::println(\"{}\", add(60));\n\n    bonus = 200;\n    std::println(\"外面的 bonus 换了衣服，用的还是抄下的 5：{}\", add(1));\n\n    // 想永远用最新值，得换一种带法：包里存能跟着原件走的东西，后面一课讲\n\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n\nint main() {\n    int bonus = 5;\n    auto add = [bonus](int s) {\n        return s + bonus;\n    };\n    return 0;\n}\n",
          "#include <print>\n\nint add(int s) {\n    return s + 5;\n}\n\nint main() {\n    std::println(\"{}\", add(80));\n    std::println(\"{}\", add(60));\n    return 0;\n}\n"],
        loose: [
          "#  include <print>\nint  main ( )\n{\n  int extra=5 ;\n  auto  f = [ extra ]( int x ) { return x + extra ; } ;\n  std::println( \"{}\" , f ( 10 ) ) ;\n  std::println( \"第二次 {}\" , f ( 20 ) ) ;\n  extra = 300 ;\n  std::println( \"{}\" , f ( 1 ) ) ;\n  // 出路是换一种带法，让包里一直连着原件，下一课再讲\n  return 0;\n}\n"]
      }
    },
    {
      cid: "c58", kind: "paper", mode: "ide", authored: "d84eb1f2", file: "main.cpp", pass: 60, title: "第 58 课考试 · 引用基础：给变量起外号", task: "任务题目：声明一个 int 变量 a、给它 10，再给它起一个外号；用这个外号把 a 改成 66，并且把 a 本身打印出来看看变了没有", hint: "想不起来就回看正文【演示 2】那三行，还有【演示 3】那场「两个盒子对两个名字」的对照实验。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 17, coversTask: 1, stem: "写这一行：给已经存在的 int 变量 score 起一个外号，外号叫 alias。", acceptRegex: ["int\\s*&\\s*alias\\s*=\\s*score"], acceptOn: "code", sample: "int& alias = score;", why: "句式是 int& alias = score; —— 类型那截带上 &，说明这一行起的是外号；等号右边必须摆一个已经存在、类型也对得上的变量当本人。" },
        { id: "q2", type: "code", score: 23, coversTask: 1, stem: "写一行：开出那个 int 变量 a，初始值给 10 —— 外号得挂在已经存在的盒子上。", acceptRegex: ["int\\s+a\\s*=\\s*10"], acceptOn: "code", sample: "int a = 10;", why: "引用不是新盒子，它必须有本人。先写 int a = 10; 把盒子开出来，后面那行起外号才有东西可指。" },
        { id: "q3", type: "code", score: 36, coversTask: 1, stem: "写两行：第一行给已经存在的 a 起外号 nickname，第二行用这个外号把本人那格改成 66。", acceptRegex: ["int\\s*&\\s*nickname\\s*=\\s*a", "nickname\\s*=\\s*66"], acceptOn: "code", sample: "int& nickname = a; nickname = 66;", why: "类型那截带上 &，这一行才是起外号；起好之后再写 nickname = 66;，等号落在外号身上，改的就是 a 那一格。" },
        { id: "q4", type: "code", score: 24, coversTask: 1, stem: "写一行：问一句 a 和 nickname 是不是同一个盒子 —— 比较两个地址，把答案打印出来。", acceptRegex: ["&\\s*a\\s*==\\s*&\\s*nickname"], acceptOn: "code", sample: "std::println(\"{}\", &a == &nickname);", why: "取地址符 & 摆在名字前面，问的是门牌号。外号和本人指的是同一格，所以两个地址相等，打出来是 true。" }
      ],
      selftest: {
        refs: [
          "#include <print>\nint main() {\n    int& alias = score;\n    int a = 10;\n    int& nickname = a; nickname = 66;\n    std::println(\"{}\", &a == &nickname);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "int alias = score;",
          "int a = 66;",
          "int a = 10;\nint nickname = a;\nnickname = 66;",
          "std::println(\"{}\", a == nickname);"],
        loose: [
          "#include <print>\nint main() {\n    int & alias  =  score ;\n    int   a  =  10 ;\n    int a = 10;\n    int &  nickname = a ;\n    nickname =  66 ;\n    std::println(\"{}\", & a  == &  nickname );\n    return 0;\n}\n"]
      }
    },
  ]
};
