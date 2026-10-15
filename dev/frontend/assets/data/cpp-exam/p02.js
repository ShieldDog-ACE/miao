/* 喵站 · C++ 入门 考卷分部 p02：第 6–10 课（第九轮）
 *
 * 每场卷照 cpp-exam/p01.js 的形状与硬指标（cpp-exam-check 逐条对账）：
 *   1. kind:"paper"，题型只用笔试引擎认的六种（choice/multi/blank/code/output/order）；
 *   2. 各题 score 相加正好 100；
 *   3. 源稿每一条【任务】都有题用 coversTask 对着它（序号从 1 起，一条题可盖多条）；
 *   4. 带 coversTask 的题合计 ≥50 分；choice ≥2；output ≥1；
 *   5. 每题带 why；selftest 的 refs 判 100、wrongs 判 <60、loose 判 ≥60。
 *
 * 验收：node dev/tools/cpp-exam-check.cjs --only c06,c07,c08,c09,c10
 */
window.MIAO_CPP_EXAM_P02 = {
  papers: [
    {
      cid: "c06", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 6 课考试 · const 常量", task: "任务题目：亲眼看到改 const 常量会被编译器拦下；声明 const 常量 DAILY_WORDS = 15 并算出一年背多少单词", hint: "想不起来就回看本课【演示 2】的两条注释和【演示 3】的具名常量。",
      notes: ["const 的含义就是这只盒子上生只准赋值一次；往只读的盒子里写，错误在编译期就判定，不会等到运行。", "const 变量声明时必须初始化：没有初值的锁盒子，C++ 不允许存在。", "常量名按习惯全大写加下划线，比如 DAILY_WORDS、MAX_SCORE；编译器不强制，但那是给人看的信号。", "「魔法数字」是直接写在代码里、没人知道含义的数字；提成具名常量后，满分变了只需要改一处。", "const 不会让盒子占的字节数变少；该不该锁，看的是这个值在整个程序里会不会变。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "先锁上一只盒子：写一行 const 的 int 常量，名字全大写，值当场给出来。", acceptRegex: ["const\\s+int\\s+[A-Z][A-Z0-9_]*\\s*=\\s*\\d+\\s*;"], acceptOn: "code", sample: "const int MAX_SCORE = 750;", why: "锁上的盒子必须当场交货：const 没有初值编译器不放行；名字全大写是本项目给读代码的人的信号。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "任务 1 那一行：把「往锁上的盒子再写一次」那个赋值写出来（值给 800），并在它旁边留一行至少四个字的注释记下报错里的说法。", acceptRegex: ["[A-Z][A-Z0-9_]{2,}\\s*=\\s*800\\s*;", "//[^\\n]{4,}"], acceptOn: "buffer", sample: "// MAX_SCORE = 800;   // 报错说 expression must be a modifiable lvalue", why: "往只读的盒子里写，编译期就被拦下；任务要求看完报错再注释回去，所以这一行落在注释里也算 —— 正则只能验你写了注释，抄得对不对要复盘核对。" },
        { id: "q3", type: "code", score: 20, coversTask: 2, stem: "任务 2：声明你选的常量「每天背单词数」，const 的 int，值给 15，名字全大写。", acceptRegex: ["const\\s+int\\s+[A-Z][A-Z0-9_]*\\s*=\\s*15\\s*;"], acceptOn: "code", sample: "const int DAILY_WORDS = 15;", why: "一个值整个程序都不该变，就锁起来给它起名字；以后要改每天 20 个，只改这一处。" },
        { id: "q4", type: "code", score: 25, coversTask: 2, stem: "用一条 std::println 打出一年背多少个：让 365 乘上你那个常量，别把 15 又光秃秃写一遍。", acceptRegex: ["365\\s*\\*|\\*\\s*365", "std::println\\s*\\("], acceptOn: "code", sample: "std::println(\"一年能背 {} 个单词\", 365 * DAILY_WORDS);", why: "常量只是个名字，读的时候跟直接写数字一样参与运算：365 乘 15 等于 5475。" },
        { id: "q5", type: "code", score: 20, stem: "把这份程序写成能跑的形：把打印工具箱搬进来（#include），再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n\nint main() {", why: "缺 #include 就没人认识 std::println；没有 main，链接器找不到入口。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint main() {\n    const int MAX_SCORE = 750;\n    // MAX_SCORE = 800;   // 报错说 expression must be a modifiable lvalue\n    // const int DAYS;    // 也报错：const 没有初值\n\n    const int DAILY_WORDS = 15;\n    std::println(\"一年能背 {} 个单词\", 365 * DAILY_WORDS);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\nint main() {\n    int daily_words = 15;\n    std::println(\"{}\", daily_words);\n    return 0;\n}\n",
          "#include <print>\nint main() {\n    const int MAX_SCORE = 750;\n    MAX_SCORE = 800;\n    return 0;\n}\n"],
        loose: [
          "#  include   < print >\nint  main ( )\n{\n  const  int   LIMIT = 750;\n  LIMIT = 800;      // 编译器说不让往只读盒子里写\n  const int WORDS_PER_DAY = 15;\n  std::println( \"{}\", WORDS_PER_DAY * 365 );\n}\n"]
      }
    },
    {
      cid: "c07", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 7 课考试 · 命名规范", task: "任务题目：判出 int A、int x1、int price_r_m_b 三个名字的毛病并改成规范的；用你选的一种风格声明「班级人数」「上学方式」并打印", hint: "想不起来就回看本课【演示 3】的改名对照和「它被设计成什么样」那三问。",
      notes: ["编译器不在乎名字的含义：只要符合标识符规则（字母数字下划线、不能数字开头、不占关键字）就照样编译。", "见名知意是命名的唯一硬标准，风格、大小写都是为它服务的。", "snake_case 是全小写加下划线；camelCase 是第一个词全小写、后面每个词首字母大写，写成 myAge 而不是 MyAge。", "同一个项目里两种风格别混着用：混用会逼读代码的人反复判断这两个名字是不是同一个变量。", "坏名字阴在程序照样编译、结果也正确，看不见的成本落在以后每次读这段代码的人身上。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "任务 1：把那几个不合格的名字改成规范的写出来 —— 一个 int 变量，名字由两个词组成（小写加下划线，或者小驼峰），值当场给。", acceptRegex: ["\\bint\\s+(?:[a-z]{2,}(?:_[a-z]{2,})+|[a-z]{2,}(?:[A-Z][a-z]+)+)\\s*=\\s*\\d+\\s*;"], acceptOn: "code", sample: "int magazine_price = 45;", why: "单字母、字母加数字尾巴、缩写叠三层都做不到见名知意；名字由两个词组成，念出来就知道它装的是什么。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "在改好的那一行旁边留一行注释（至少四个字），记下它原来那个不合格的名字长什么样。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 原来写的是 int price_r_m_b; 三个缩写叠一起没人能还原", why: "演示 3 就是把反面教材注释掉留着对照；正则只能验你写了注释，写得对不对要复盘核对。" },
        { id: "q3", type: "code", score: 15, coversTask: 2, stem: "任务 2：声明「班级人数」这个变量 —— 一个 int，名字照样由两个词组成，值给一个人数。", acceptRegex: ["\\bint\\s+(?:[a-z]{2,}(?:_[a-z]{2,})+|[a-z]{2,}(?:[A-Z][a-z]+)+)\\s*=\\s*\\d+\\s*;"], acceptOn: "code", sample: "int class_count = 42;", why: "班级人数会变小但一眼知道是什么：见名知意比风格统一更要紧，风格是为它服务的。" },
        { id: "q4", type: "code", score: 20, coversTask: 2, stem: "声明「上学方式」这个变量：用 std::string 装一段双引号里的文字，名字也由两个词组成。", acceptRegex: ["\\bstd::string\\s+(?:[a-z]{2,}(?:_[a-z]{2,})+|[a-z]{2,}(?:[A-Z][a-z]+)+)\\s*=\\s*\"[^\"]*\"\\s*;"], acceptOn: "code", sample: "std::string school_way = \"bus\";", why: "方式是一段文字，就得用字符串盒子；名字照样要念得出含义。" },
        { id: "q5", type: "code", score: 20, coversTask: 2, stem: "用一条 std::println 把这两个一起打出来：格式串里两个占位坑，逗号后面按顺序给这两个变量。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*,\\s*\\w+"], acceptOn: "code", sample: "std::println(\"{} 人，坐 {}\", class_count, school_way);", why: "两个坑就给两个值，顺序对上；名字起得好，读代码的人不用回头数。" },
        { id: "q6", type: "code", score: 15, stem: "把这份程序写成能跑的形：打印和字符串两个工具箱都搬进来，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "#\\s*include\\s*<\\s*string\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n#include <string>\n\nint main() {", why: "缺 #include <print> 就没人认识 std::println；std::string 这个工具来自 #include <string>。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <string>\n\nint main() {\n    int magazine_price = 45;   // 原来写的是 int price_r_m_b; 三个缩写叠一起\n    int days_per_week = 7;       // 原来那个 x1 装的如果是 7，它就是「一周几天」\n    int class_count = 42;\n    std::string school_way = \"bus\";\n\n    std::println(\"{} 人，坐 {}\", class_count, school_way);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\nint main() {\n    int a = 15;\n    int x1 = 700;\n    std::println(\"{}\", a);\n    return 0;\n}\n",
          "#include <print>\nint main() {\n    int price_r_m_b = 45;\n    return 0;\n}\n"],
        loose: [
          "#  include   < print >\n# include < string >\nint  main ( )\n{\n  int daysPerWeek = 7;   // 原名 x1 等于没起名字\n  int  goSchoolWayCount = 3;\n  std::string  wayToSchool = \"bus\";\n  std::println( \"{} {}\" ,  goSchoolWayCount , wayToSchool );\n}\n"]
      }
    },
    {
      cid: "c08", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 8 课考试 · 整数与四则运算", task: "任务题目：改掉初值先心算再验证；新加一行打印 a * 2 + b 的结果", hint: "回看本课【演示 1】的三行运算和「它被设计成什么样」里表达式一步步塌成数的过程。",
      notes: ["乘号在这里是星号：键盘上没有数学里的 ×，写 × 编译器认不出来。", "表达式是「一个还没算出来的数」：读盒子不改盒子，a + b 不会把 a、b 的值改掉。", "先乘后加：a * 2 + b 先把 a 换成值，算乘法得 20，再加 3 得 23。", "等号是「右算左装」：hp = hp - 30 先把右边算成 70，再装回 hp。", "int triple = 3 * a; 里 triple 拿到的是一个算好的数，不是公式；斜杠除法下一课才讲。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "存两个数：写出至少一行 int 声明，右边的值随你挑（别照抄 10），当场给上。", acceptRegex: ["\\bint\\s+\\w+\\s*=\\s*\\d+\\s*;"], acceptOn: "code", sample: "int a = 20;", why: "表达式每次用到都按盒子当下的值重算：改了初值，等于改了所有用到它的算式。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "用一条 std::println 把两个盒子的和打出来：占位坑里放 a + b 这种加法表达式，别先把结果手算成数字写进去。", acceptRegex: ["std::println\\s*\\([^)]*\\w+\\s*\\+\\s*\\w+"], acceptOn: "code", sample: "std::println(\"a + b = {}\", a + b);", why: "表达式就是一个还没算出来的数，交给打印那一刻才塌成 23。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "用一条 std::println 把两个盒子的差打出来：占位坑里放减法表达式。", acceptRegex: ["std::println\\s*\\([^)]*\\w+\\s*-\\s*\\w+"], acceptOn: "code", sample: "std::println(\"应找 {} 元\", paid - total);", why: "两个 int 相减，结果的类型还是 int：整数运算在整数范围里闭合，不会算出小数。" },
        { id: "q4", type: "code", score: 30, coversTask: 2, stem: "任务 2 那一行：新加一条 std::println，把「某个盒子乘 2 再加另一个盒子」的结果打出来 —— 乘号写星号。", acceptRegex: ["std::println\\s*\\([^)]*\\w+\\s*\\*\\s*2\\s*\\+\\s*\\w+"], acceptOn: "code", sample: "std::println(\"{}\", a * 2 + b);", why: "星号才是乘号，写 × 编译器认不出来；先乘后加，20 加 3 塌成 23。" },
        { id: "q5", type: "code", score: 15, stem: "把这份程序写成能跑的形：把打印工具箱搬进来（#include），再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n\nint main() {", why: "缺 #include 就没人认识 std::println；没有 main，链接器找不到入口。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint main() {\n    int a = 20;\n    int b = 3;\n\n    std::println(\"a = {}, b = {}\", a, b);\n    std::println(\"a + b = {}\", a + b);\n    std::println(\"a - b = {}\", a - b);\n    std::println(\"a * 2 + b = {}\", a * 2 + b);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\nint main() {\n    int a = 10;\n    std::println(\"{}\", a);\n    return 0;\n}\n",
          "#include <print>\nint main() {\n    int a = 10;\n    int b = 3;\n    std::println(\"{}\", 13);\n    std::println(\"{}\", a × 2 + b);\n    return 0;\n}\n"],
        loose: [
          "#  include   < print >\nint  main ( )\n{\n  int  first = 9;   int  second = 4;\n  std::println( \"和 {}\", first + second );\n  std::println( \"差 {}\", first-second );\n  std::println( \"{}\" , first  *  2 + second );\n}\n"]
      }
    },
    {
      cid: "c09", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 9 课考试 · 整数除法与取余", task: "任务题目：用 / 和 % 各一次把 100 分钟换成一小时四十分钟；把 10.0 改成 10，说清输出为什么变了", hint: "回看本课【演示 2】的单位换算和【演示 3】里 10 / b 与 10.0 / b 的对照。",
      notes: ["10 / 3 得 3：两边都是 int 就按整数除，小数部分在除的那一刻被砍掉，事后补 .0 补不回来。", "% 管没分掉的零头：10 % 3 得 1；验算规矩是 商 * 除数 + 余数 == 被除数。", "截断是向零不是向小：-7 / 2 得 -3，跟着 -7 % 2 得 -1，余数的符号跟着被除数。", "想要小数结果就主动给一个 double：10.0 / 3 才是 3.3333。", "% 只服务整数，10.5 % 3 编译就报错；除数是 0 编译器不拦，那是运行时才炸的严重错误。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "任务 1 的第一半：写一行赋值，用一个盒子（或直接一个数）除以 60，算出能凑出几个整小时。", acceptRegex: ["=\\s*\\w+\\s*/\\s*60\\s*;"], acceptOn: "code", sample: "int hours = minutes / 60;", why: "两个 int 相除结果还是 int：100 / 60 得 1，小数尾巴当场被砍掉。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "任务 1 的第二半：再写一行赋值，对 60 取余，把凑不满一小时的零头取出来。", acceptRegex: ["=\\s*\\w+\\s*%\\s*60\\s*;"], acceptOn: "code", sample: "int rest = minutes % 60;", why: "/ 管分出去多少，% 管没分掉的零头：100 % 60 得 40，两个合起来才是一次完整的换算。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "用一条 std::println 把换算结果打出来：格式串里至少两个占位坑，逗号后面按顺序给小时和余数。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\\{\\}[^\"]*\""], acceptOn: "code", sample: "std::println(\"{} 分钟 = {} 小时 {} 分\", minutes, hours, rest);", why: "验算一下就知道两个各司一半：商乘 60 加余数正好回到 100。" },
        { id: "q4", type: "code", score: 20, coversTask: 2, stem: "任务 2 那一改：写一条 std::println，占位坑里放「10 除以一个 int 盒子」—— 两边都是整数的那种写法。", acceptRegex: ["std::println\\s*\\([^)]*\\b10\\s*/\\s*\\w+"], acceptOn: "code", sample: "std::println(\"{}\", 10 / b);", why: "把 10.0 改成 10，两边都成了 int，就按整数除法算，打出 3 这样的整数结果 —— 编译器一声不响。" },
        { id: "q5", type: "code", score: 15, coversTask: 2, stem: "留一行对照：再写一条 std::println，把上面那个除法用 10.0 写一遍，看到它按小数除。", acceptRegex: ["std::println\\s*\\([^)]*10\\.0\\s*/\\s*\\w+"], acceptOn: "code", sample: "std::println(\"{:.4f}\", 10.0 / b);", why: "只要有一边是 double，整个除法就按小数做；:.4f 是只保留 4 位小数。" },
        { id: "q6", type: "code", score: 10, coversTask: 2, stem: "在这两行旁边留一行注释（至少四个字），写下你看到的输出变化。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 10.0 改成 10 之后从 3.3333 变成 3", why: "正则只能验你写了注释，写得对不对要复盘核对 —— 「观察输出」这一步这块编辑器判不动。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint main() {\n    int minutes = 100;\n    int hours = minutes / 60;\n    int rest = minutes % 60;\n    std::println(\"{} 分钟 = {} 小时 {} 分\", minutes, hours, rest);\n\n    int b = 3;\n    // 10.0 改成 10 之后输出从 3.3333 变成 3\n    std::println(\"{}\", 10 / b);\n    std::println(\"{:.4f}\", 10.0 / b);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\nint main() {\n    int a = 100;\n    std::println(\"{}\", a / 60);\n    return 0;\n}\n",
          "#include <print>\nint main() {\n    int b = 3;\n    std::println(\"{}\", 10.0 / b);\n    return 0;\n}\n"],
        loose: [
          "#  include   < print >\nint  main ( )\n{\n  int  total_min = 100;\n  int  h = total_min/60;\n  int  r = total_min%60;\n  std::println( \"小时 {} 分 {}\", h, r );\n  int n = 3;\n  // 换成整数除法以后从 3.3333 掉到 3\n  std::println(\"{}\",  10 /n );\n  std::println( \"{}\", 10.0 / n );\n}\n"]
      }
    },
    {
      cid: "c10", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 10 课考试 · 装不下的大数", task: "任务题目：把 400000000000LL 换成 int 看打出的鬼数字；再用 int 装 90 亿、换 long long 对比两行输出", hint: "回看本课【演示 2】的鬼数字、【演示 3】的两行对照，以及里程表那个类比。",
      notes: ["装爆之后程序不报错：类型匹配、只是值超范围，编译器一般只给警告，盒子多大它替你决定不了。", "第 3 课那条「类型对不上就拦下」管的是类型，本课是数值超出，两道关卡不是一回事。", "int 的正数上限大约在 21 亿；从 1970 年元旦算起的秒级时间戳早已超过它，那种量就该用 long long。", "long long 也会溢出：阶乘、指数增长照样爆，「想装多大就多大」是错觉。", "两个 int 相乘先按 int 算，乘积超出照样绕回来；把一边写成 100000LL，才按 long long 算。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "任务 1 那一改：把一个 int 盒子的初值直接写成 400000000000（别加 LL），硬塞给它。", acceptRegex: ["\\bint\\s+\\w+\\s*=\\s*400000000000\\s*;"], acceptOn: "code", sample: "int broken = 400000000000;", why: "类型对得上（都是整数），超出的只是数值：编译器通常只警告不拦，数从天花板绕回地面。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "用一条 std::println 把这只装爆的盒子原样打出来，看看打出什么鬼数字。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "std::println(\"本应 400000000000，实际打出: {}\", broken);", why: "程序照跑照错，常见机器上打出 568041472 —— 这就是「不报错的错误」最阴的地方。" },
        { id: "q3", type: "code", score: 10, coversTask: 1, stem: "在这一行旁边留一行注释（至少四个字），记下屏幕上那个实际打出来的数。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 打出来是 568041472，不是 400000000000", why: "正则只能验你写了注释，抄下来的数对不对要复盘核对 —— 看输出这一步这块编辑器判不动。" },
        { id: "q4", type: "code", score: 20, coversTask: 2, stem: "任务 2 的第一半：用 int 装 90 亿 —— 写一行 int 声明，右边是 9000000000，不带后缀。", acceptRegex: ["\\bint\\s+\\w+\\s*=\\s*9000000000\\s*;"], acceptOn: "code", sample: "int bad = 9000000000;", why: "int 的正数上限大约在 21 亿（2147483647）：90 亿早就翻过天花板，绕回来的数很多机器上是 410065408。" },
        { id: "q5", type: "code", score: 25, coversTask: 2, stem: "任务 2 的第二半：同一个数给 long long 作对照 —— 写一行 long long 声明，数字尾巴上带上 LL。", acceptRegex: ["long\\s+long\\s+\\w+\\s*=\\s*9000000000\\s*LL\\s*;"], acceptOn: "code", sample: "long long big = 9000000000LL;", why: "不写后缀时类型由编译器先猜；写了 LL，这个数从一开始就住在大盒子里，90 亿轻松装下。" },
        { id: "q6", type: "code", score: 10, stem: "用一条 std::println 把 sizeof 打出来，看清两只盒子的字节数差距。", acceptRegex: ["std::println\\s*\\([^)]*sizeof\\s*\\("], acceptOn: "code", sample: "std::println(\"long long 占 {} 字节\", sizeof(long long));", why: "int 是 4 字节、long long 是 8 字节 —— 差距就是「21 亿」和「92 亿亿」的区别。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint main() {\n    int broken = 400000000000;   // 打出来是 568041472，不是 400000000000\n    std::println(\"本应 400000000000，实际打出: {}\", broken);\n\n    int bad = 9000000000;\n    long long big = 9000000000LL;\n    std::println(\"int      : {}\", bad);\n    std::println(\"long long: {}\", big);\n\n    std::println(\"int 占 {} 字节\", sizeof(int));\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\nint main() {\n    long long big = 400000000000LL;\n    std::println(\"{}\", big);\n    return 0;\n}\n",
          "int x = 100;\nstd::println(\"{}\", x);\n"],
        loose: [
          "#  include   < print >\nint  main ( )\n{\n  int  x = 400000000000;   // 屏幕上是个 568041472 这样的怪数\n  std::println( \"{}\", x );\n  int  y = 9000000000;\n  long  long   z = 9000000000 LL;\n  std::println( \"{}\",  y );\n  std::println( \"{}\", sizeof( int ) );\n}\n"]
      }
    },
  ]
};
