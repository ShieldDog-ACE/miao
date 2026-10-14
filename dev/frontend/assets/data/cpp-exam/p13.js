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
      cid: "c55", kind: "paper", mode: "code", authored: "e056dbcc", pass: 60, title: "第 55 课考试 · 函数调用函数", task: "任务题目：写一个收一整串分数、返回平均分的 average，把它接到 report 里用上；再给 grade_of 加一档：大于等于 95 返回「顶呱呱」", hint: "想不起来就回看正文【演示 2】那条分工链、【演示 3】里 report 喊 average 的那一行，以及【常见坑】第一条。",
      questions: [
        { id: "q1", type: "code", score: 18, coversTask: 1, stem: "把 average 的函数头写出来：它收一整串 int 分数，返回小数形式的平均分。", acceptRegex: ["double\\s+average\\s*\\("], sample: "double average(std::vector<int> scores) {", why: "返回类型必须是 double —— 写成 int 会把小数位砍掉；参数写 std::vector<int> 才收得下一整串分数。函数体先累加再除以 size()。" },
        { id: "q2", type: "code", score: 17, coversTask: 2, stem: "写出加档的那一句：score 大于等于 95 时，返回文字「顶呱呱」。", acceptRegex: ["score\\s*>=\\s*95"], sample: "if (score >= 95) return \"顶呱呱\";", why: "关键在于 >= 95 这个比较写法要对，并且这句要放在 90 那句前面，否则 96 分早被前面拦走了。" },
        { id: "q3", type: "code", score: 32, coversTask: 1, stem: "（任务题）average 的函数头已经写好。写出函数体里的三行：先备好一个小数格子 sum，初值 0；用 for 把 scores 里的分数逐个加进去；最后返回 sum 除以分数的个数。", acceptRegex: ["double\\s+sum\\s*=\\s*0\\s*;", "for\\s*\\(\\s*auto\\s+\\w+\\s*:\\s*scores\\s*\\)", "return\\s+sum\\s*/[\\s\\S]{0,40}size\\s*\\(\\s*\\)\\s*;"], sample: "double sum = 0;\nfor (auto s : scores) sum += s;\nreturn sum / scores.size();", why: "累加的格子用 double 装，除法才不会把小数那一截砍掉；个数用 size() 现算，表长变了也不用改代码。" },
        { id: "q4", type: "code", score: 33, coversTask: 2, stem: "（任务题）把 grade_of 整个写一遍：收一个 int 分数，从上往下依次挡四档 —— 95 以上返回「顶呱呱」，90 以上返回「优秀」，80 以上返回「良好」，其余返回「及格」。", acceptRegex: ["string\\s+grade_of\\s*\\(\\s*int", ">=\\s*95[\\s\\S]{0,80}顶呱呱[\\s\\S]{0,80}>=\\s*90[\\s\\S]{0,80}>=\\s*80"], sample: "std::string grade_of(int score) {\n    if (score >= 95) return \"顶呱呱\";\n    if (score >= 90) return \"优秀\";\n    if (score >= 80) return \"良好\";\n    return \"及格\";\n}", why: "命中就 return，函数当场结束，所以高一档必须写在低一档前面；夹在 90 后面，96 分早被前面拦走，新档永远轮不到。" }
      ],
      selftest: {
        refs: [
          {q1: "double average(std::vector<int> scores) {", q2: "if (score >= 95) return \"顶呱呱\";", q3: "double sum = 0;\nfor (auto s : scores) sum += s;\nreturn sum / scores.size();", q4: "std::string grade_of(int score) {\n    if (score >= 95) return \"顶呱呱\";\n    if (score >= 90) return \"优秀\";\n    if (score >= 80) return \"良好\";\n    return \"及格\";\n}"}],
        wrongs: [
          {q1: "int average(std::vector<int> scores) {", q2: "if (score > 95) return score;", q3: "int sum = 0;\nfor (auto s : scores) sum += s;\nreturn sum;", q4: "std::string grade_of(int score) {\n    if (score >= 90) return \"优秀\";\n    if (score >= 95) return \"顶呱呱\";\n    if (score >= 80) return \"良好\";\n    return \"及格\";\n}"}],
        loose: [
          {q1: "double  average ( std::vector <int> scores )", q2: "if(score>=95){return \"顶呱呱\";}", q3: "double  sum  =  0  ;\n   for( auto  one  :  scores )  sum += one ;\n return  sum /  scores . size ( ) ;", q4: "string  grade_of ( int  s )  {  if ( s  >=  95 )  return  \"顶呱呱\" ;  if ( s  >=  90 )  return  \"优秀\" ;  if ( s  >=  80 )  return  \"良好\" ;  return  \"及格\" ;  }"}]
      }
    },
    {
      cid: "c56", kind: "paper", mode: "code", authored: "d3638384", pass: 60, title: "第 56 课考试 · lambda 临时小函数", task: "任务题目：写一把算平方的 lambda，拿 3、9、16 三个数试；再写一把判断及格的 lambda，分数大于等于 60 就返回 true", hint: "想不起来就回看正文【演示 1】那句 auto mul 开头、【演示 2】里写完立刻喊的那一行，还有【常见坑】第三条关于分号。",
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "补出求平方那把工具的开头：它收一个 int，用 auto 存起来。（只写关键的前半截就行）", acceptRegex: ["\\[\\s*\\]\\s*\\(\\s*int"], sample: "auto sq = [](int x) { return x * x; };", why: "句式是 auto sq = [](int x) { return x * x; }; —— 中括号空着表示不拿外面的东西，紧跟的参数表收一个 int，句末那个分号不能少。" },
        { id: "q2", type: "code", score: 16, coversTask: 2, stem: "写出那把及格判断工具的身体：收到分数 x，把它和 60 比，够格就交还真。", acceptRegex: [">=\\s*60"], sample: "return x >= 60;", why: "身体就一句 return x >= 60; —— 比较本身就是真假，不用再绕一层 if。用大于号不加等号会把刚好 60 分的人判出去。" },
        { id: "q3", type: "code", score: 34, coversTask: 1, stem: "（任务题）写完整的一句声明：用 auto 接住一把小工具，它收一个 int，返回这个数乘它自己。", acceptRegex: ["auto\\s+\\w+\\s*=\\s*\\[\\s*\\]\\s*\\(\\s*int\\s+\\w+\\s*\\)", "return\\s+\\w+\\s*\\*\\s*\\w+", "\\}\\s*;"], sample: "auto sq = [](int x) { return x * x; };", why: "中括号空着表示不拿外面的东西，圆括号是参数表，花括号里那句 return 就是它的身体；整句是一条声明语句，右花括号后面那个分号不能少。" },
        { id: "q4", type: "code", score: 30, coversTask: 2, stem: "（任务题）写两行：先做一把判断及格的小工具，收一个 int 分数，大于等于 60 就交还真；再用 std::println 把 59 递给它、把还回来的结果打出来。", acceptRegex: ["auto\\s+\\w+\\s*=\\s*\\[\\s*\\]\\s*\\(\\s*int\\s+\\w+\\s*\\)", ">=\\s*60", "println[\\s\\S]{0,120}\\(\\s*\\d+\\s*\\)"], sample: "auto pass = [](int x) { return x >= 60; };\nstd::println(\"{}\", pass(59));", why: "身体里直接 return 那句比较，比较的结果本来就是真假；加上圆括号把 59 递进去，这把工具才真跑起来。" }
      ],
      selftest: {
        refs: [
          {q1: "auto sq = [](int x) { return x * x; };", q2: "return x >= 60;", q3: "auto sq = [](int x) {\n    return x * x;\n};", q4: "auto pass = [](int x) { return x >= 60; };\nstd::println(\"{}\", pass(59));"}],
        wrongs: [
          {q1: "auto sq(int x) { return x * x; }", q2: "return x > 60;", q3: "auto sq = [](int x) {\n    return x + x;\n};", q4: "auto pass = [](int x) { return x > 60; };\nstd::println(\"{}\", pass(59));"}],
        loose: [
          {q1: "auto sq = [ ] ( int x ) { return x * x; } ;", q2: "if (x >= 60) { return true; }", q3: "auto   sq  =  [ ]  (  int  v  )  {  return  v * v ;  }  ;", q4: "auto  out  =  [ ]  (  int  score  )  {  return  score  >=  60 ;  } ;\nprintln ( \"{}\" ,  out ( 59 ) ) ;"}]
      }
    },
    {
      cid: "c57", kind: "paper", mode: "quiz", authored: "a10e9c02", pass: 60, title: "第 57 课考试 · lambda 捕获变量", task: "任务题目：先在外面写 int bonus = 5，再做一把中括号里点上 bonus 的小工具，把一个分数递进去、拿回加上奖励分的结果；再想一想：要是想让这把工具永远用的是最新值，路子在哪儿", hint: "想不起来就回看正文【演示 1】那两行输出、【演示 2】一次抄两个名字那句，还有那张复印件示意图。",
      questions: [
        { id: "q1", type: "choice", score: 13, coversTask: 2, stem: "int base = 100; 之后定义 auto add_base = [base](int x) { return base + x; }; 然后执行 base = 200; 再喊 add_base(1)，还回来的是几？", options: ["101，用的是定义那一刻抄下的 100", "201，它每次都回头去看外面的 base", "100，因为参数 x 没起作用", "编译不过，base 被改过就不能用了"], answer: 0, why: "中括号里点名，就是在那一行被执行的那一刻复印一份带走。之后原件改成 200 跟包里那份没关系，所以算的是 100 加 1。这正是源稿程序第二行打印的东西。" },
        { id: "q2", type: "output", score: 13, coversTask: 1, stem: "这段程序打印什么？（一行一条，两行）\nint bonus = 5;\nauto add = [bonus](int s) { return s + bonus; };\nstd::println(\"{}\", add(80));\nstd::println(\"{}\", add(60));", acceptLines: ["85", "65"], why: "抄进来的 bonus 是 5，两次喊各自把收到的分数加上包里那份 5：80 变 85，60 变 65。喊几次都不影响包里那份，也不影响外面的 bonus。" },
        { id: "q3", type: "choice", score: 15, stem: "「抄」这个动作发生在下面哪个时刻？", options: ["程序跑到定义那把工具那一行的时候", "每次喊这把工具的时候", "编译器读源码、还没运行的时候", "程序结束退出的时候"], answer: 0, why: "值捕获是运行时的复印，时机就是那条声明语句被执行的那一刻。所以源稿里 base 后来变了、包里不变 —— 复印早就完成了。" },
        { id: "q4", type: "choice", score: 12, coversTask: 2, stem: "源稿任务 2 留了个思考：想让这把工具用的永远是最新值，而不是出生那一刻的旧值。下面哪个说法最接近出路？", options: ["换一种带法：包里不存复印件，存能跟着原件走的东西 —— 这是往后一课要讲的", "把中括号空着，它就会自动去找最新值", "把那个变量写成 const，值就会自动更新", "每次多喊几次，喊到一定次数它就用新值"], answer: 0, why: "空着中括号只会让它压根看不见那个变量，只会报错，不会追最新；const 和喊的次数更是扯不上。真正要的是改变带法，让包里存的东西一直连着原件 —— 这一课先把复印件这条路走稳，另一条以后再讲。" },
        { id: "q5", type: "multi", score: 15, coversTask: [1, 2], stem: "关于中括号捕获，下面哪些说法是对的？（多选，错勾任何一项整题 0 分）", options: ["点了名的变量是在定义那一行被复印进包的", "抄进来的那份可以在工具里直接赋值改新", "同一个工具喊两次，用的还是同一份复印件", "外面的原件后来被改掉，包里那份不会跟着变"], answers: [0, 2, 3], why: "第二条错在「直接改」：那份复印件是只读的，身体里给它赋值会被编译器拦下来，报错里带 captured by a copy 那几个字。其余三条就是这一课的三块基石。" },
        { id: "q6", type: "order", score: 14, stem: "把「用上一个外面的变量做出小工具」这四步排成正确顺序。", answer: [3, 0, 1, 2], steps: ["用 auto 声明一个变量接住这把工具", "在中括号里点上要带走的变量名", "喊它，拿到用复印件算出来的结果", "先在外面把那个变量声明好、赋上值"], why: "变量得先存在，才能被点名；点名和身体都写完了才有 auto 那句声明；这些都跑过之后，喊它才谈得上结果。" },
        { id: "q7", type: "match", score: 18, coversTask: 1, stem: "把左边的写法和它真正的效果连起来（右边顺序是打乱的）。", answer: {"中括号里只写 [base]": "只抄 base 一个名字", "中括号里写 [base, tag]": "申领单上点了两个名字，两个各抄一份", "在 lambda 里给抄来的 base 重新赋值": "抄来的那份归你改，外面的原件一动不动", "定义之后把外面的 base 改成 200": "lambda 里的 base 仍是定义那一刻抄下的旧值"}, left: ["中括号里只写 [base]", "中括号里写 [base, tag]", "在 lambda 里给抄来的 base 重新赋值", "定义之后把外面的 base 改成 200"], right: ["lambda 里的 base 仍是定义那一刻抄下的旧值", "只抄 base 一个名字", "抄来的那份归你改，外面的原件一动不动", "申领单上点了两个名字，两个各抄一份"], why: "捕获永远是定义那一刻的复印件：抄谁就看中括号里点了谁，改复印件动不到原件，改原件也换不掉已经抄下的那份。" }
      ],
      selftest: {
        refs: [
          {q1: 0, q2: "85\n65", q3: 0, q4: 0, q5: [0, 2, 3], q6: [3, 0, 1, 2], q7: {"中括号里只写 [base]": "只抄 base 一个名字", "中括号里写 [base, tag]": "申领单上点了两个名字，两个各抄一份", "在 lambda 里给抄来的 base 重新赋值": "抄来的那份归你改，外面的原件一动不动", "定义之后把外面的 base 改成 200": "lambda 里的 base 仍是定义那一刻抄下的旧值"}}],
        wrongs: [
          {q1: 1, q2: "85", q3: 1, q4: 1, q5: [0, 1, 2], q6: [0, 1, 2, 3], q7: {"中括号里只写 [base]": "申领单上点了两个名字，两个各抄一份", "中括号里写 [base, tag]": "只抄 base 一个名字", "在 lambda 里给抄来的 base 重新赋值": "lambda 里的 base 仍是定义那一刻抄下的旧值", "定义之后把外面的 base 改成 200": "抄来的那份归你改，外面的原件一动不动"}}],
        loose: [
          {q1: "0", q2: " 85 \n 65 ", q3: "0", q4: "0", q5: [0, 2, 3], q6: [3, 0, 1, 2], q7: {"0": 1, "1": 3, "2": 2, "3": 0}}]
      }
    },
    {
      cid: "c58", kind: "paper", mode: "code", authored: "d84eb1f2", pass: 60, title: "第 58 课考试 · 引用基础：给变量起外号", task: "任务题目：声明一个 int 变量 a、给它 10，再给它起一个外号；用这个外号把 a 改成 66，并且把 a 本身打印出来看看变了没有", hint: "想不起来就回看正文【演示 2】那三行，还有【演示 3】那场「两个盒子对两个名字」的对照实验。",
      questions: [
        { id: "q1", type: "code", score: 17, coversTask: 1, stem: "写这一行：给已经存在的 int 变量 score 起一个外号，外号叫 alias。", acceptRegex: ["int\\s*&\\s*alias\\s*=\\s*score"], sample: "int& alias = score;", why: "句式是 int& alias = score; —— 类型那截带上 &，说明这一行起的是外号；等号右边必须摆一个已经存在、类型也对得上的变量当本人。" },
        { id: "q2", type: "code", score: 23, coversTask: 1, stem: "写一行：开出那个 int 变量 a，初始值给 10 —— 外号得挂在已经存在的盒子上。", acceptRegex: ["int\\s+a\\s*=\\s*10"], sample: "int a = 10;", why: "引用不是新盒子，它必须有本人。先写 int a = 10; 把盒子开出来，后面那行起外号才有东西可指。" },
        { id: "q3", type: "code", score: 36, coversTask: 1, stem: "写两行：第一行给已经存在的 a 起外号 nickname，第二行用这个外号把本人那格改成 66。", acceptRegex: ["int\\s*&\\s*nickname\\s*=\\s*a", "nickname\\s*=\\s*66"], sample: "int& nickname = a; nickname = 66;", why: "类型那截带上 &，这一行才是起外号；起好之后再写 nickname = 66;，等号落在外号身上，改的就是 a 那一格。" },
        { id: "q4", type: "code", score: 24, coversTask: 1, stem: "写一行：问一句 a 和 nickname 是不是同一个盒子 —— 比较两个地址，把答案打印出来。", acceptRegex: ["&\\s*a\\s*==\\s*&\\s*nickname"], sample: "std::println(\"{}\", &a == &nickname);", why: "取地址符 & 摆在名字前面，问的是门牌号。外号和本人指的是同一格，所以两个地址相等，打出来是 true。" }
      ],
      selftest: {
        refs: [
          {q1: "int& alias = score;", q2: "int a = 10;", q3: "int a = 10;\nint& nickname = a;\nnickname = 66;", q4: "std::println(\"{}\", &a == &nickname);"}],
        wrongs: [
          {q1: "int alias = score;", q2: "int a = 66;", q3: "int a = 10;\nint nickname = a;\nnickname = 66;", q4: "std::println(\"{}\", a == nickname);"}],
        loose: [
          {q1: "int & alias  =  score ;", q2: "int   a  =  10 ;", q3: "int a = 10;\nint &  nickname = a ;\n nickname =  66 ;", q4: "std::println(\"{}\", & a  == &  nickname );"}]
      }
    },
  ]
};
