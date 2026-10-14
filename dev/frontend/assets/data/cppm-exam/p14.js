/* 喵站 · C++ 掌握 考卷分部 p14：第 129–132 课
 * 契约与其他各场一致：权重和 100、任务逐条 coversTask、带任务的题合计过 50、
 * selftest 里 refs 判 100、wrongs 判不到 60、loose 判过 60。
 * 题干只用读者到对应课为止见过的东西；每场各自只包自己那课。
 */
window.MIAO_CPPM_EXAM_P14 = {
  papers: [
    {
      cid: "m129", kind: "paper", mode: "code", authored: "ff5aee63", pass: 60, title: "第 129 课考试 · variant 几选一", task: "任务题目：定义 std::variant<int, std::string>，先存学号那一格、再换成名字那一格，各打印一次，并且每次先问再取", hint: "想不起来就回看本课【怎么做】和【演示 2 · 换格子时 index 跟着走】。",
      questions: [
        { id: "q1", type: "code", score: 29, coversTask: 1, stem: "（任务题）写出「先确认现在是不是 std::string、是就把这格取出来」的判定加取值两行（v 是那只 variant）。", acceptRegex: ["holds_alternative\\s*<\\s*std::string", "get\\s*<\\s*std::string"], sample: "if (std::holds_alternative<std::string>(v))\n    std::println(\"{}\", std::get<std::string>(v));", why: "先 std::holds_alternative<std::string>(v) 问一句，为真再 std::get<std::string>(v) 取，标准姿势是问过了再取。" },
        { id: "q2", type: "code", score: 36, coversTask: 1, stem: "写一行声明：开一只只能在 int 和 std::string 之间选一格开的抽屉，名叫 v，先装上学号 20250001。", acceptRegex: ["std\\s*::\\s*variant\\s*<\\s*int\\s*,\\s*std\\s*::\\s*string\\s*>\\s+\\w+\\s*=\\s*20250001"], sample: "std::variant<int, std::string> v = 20250001;", why: "尖括号里那张清单是编译期钉死的：int 是第 0 格、std::string 是第 1 格；先上学号，index() 就是 0。" },
        { id: "q3", type: "code", score: 35, coversTask: 1, stem: "接着上一题：写一行把那只 v 换成开 std::string 那一格，装进名字 xiaoming。", acceptRegex: ["v\\s*=\\s*std\\s*::\\s*string\\s*\\(", "xiaoming"], sample: "v = std::string(\"xiaoming\");", why: "赋值就是换格子：旧那一格的内容被销毁、新那一格被打开，index() 跟着从 0 跳到 1；清单外的类型会在这里被编译器拦下。" }
      ],
      selftest: {
        refs: [
          {q1: "if (std::holds_alternative<std::string>(v))\n    std::println(\"{}\", std::get<std::string>(v));", q2: "std::variant<int, std::string> v = 20250001;", q3: "v = std::string(\"xiaoming\");"}],
        wrongs: [
          {q1: "std::println(\"{}\", v);", q2: "std::variant<int, std::string> v = \"xiaoming\";", q3: "v = 42;"}],
        loose: [
          {q1: "if ( std :: holds_alternative < std::string > ( v ) ) std::get < std::string > ( v ) ;", q2: "std :: variant < int , std :: string >  who = 20250001 ;", q3: "v  =  std :: string ( \"xiaoming\" ) ;"}]
      }
    },
    {
      cid: "m130", kind: "paper", mode: "code", authored: "0395dad5", pass: 60, title: "第 130 课考试 · visit 自动分发", task: "任务题目：给那只 std::variant<int, double, std::string> 加第四格 char，并在 describe 的 lambda 里用 if constexpr 补一条对应的 char 分支", hint: "想不起来就回看本课【怎么做】、【演示 2 · 叫号器按当前类型逐个走】与【演示 3 · 给抽屉加第四格】。",
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "（任务题）std::visit 的第一个参数要写成能接住 variant 里每一种类型的泛型 lambda，它的参数那半句怎么声明？只写 lambda 的形参部分。", acceptRegex: ["const\\s+auto"], sample: "[](const auto& x) {", why: "泛型 lambda 用 const auto& 作形参，编译器才按每种类型各生成一版；写成具体 int 就接不住别的格，visit 编译失败。" },
        { id: "q2", type: "code", score: 27, coversTask: 1, stem: "（任务题）写出两处：一是把 char 加进清单的 variant 声明行，二是在 describe 的 lambda 里那条判当前类型是不是 char 的 if constexpr 行（拿 std::is_same_v 比对 T）。", acceptRegex: ["variant<[^>]*char", "is_same_v\\s*<[^>]*char"], sample: "using Value = std::variant<int, double, std::string, char>;\n        if constexpr (std::is_same_v<T, char>) return std::string(\"字符 \") + x;", why: "清单要在 std::variant<int, double, std::string, char> 里补 char；再用 if constexpr (std::is_same_v<T, char>) 接住它，两条缺一不可。" },
        { id: "q3", type: "code", score: 25, stem: "泛型 lambda 里要先探明「这一回喂进来的到底是哪一种类型」：写一行，把当前真正的类型记进一个叫 T 的类型别名（拿 std::decay_t 包住 decltype 问 x）。", acceptRegex: ["std\\s*::\\s*decay_t\\s*<\\s*decltype\\s*\\(\\s*\\w+\\s*\\)\\s*>"], sample: "using T = std::decay_t<decltype(x)>;", why: "decltype(x) 问出来的是带引用的类型，直接拿去和 int、char 比会不成立；decay_t 把参考那些包装脱掉，剩下的清单里那一种才是能比的名字。" },
        { id: "q4", type: "code", score: 28, coversTask: 1, stem: "给 describe 补上接住 char 那一格的分支：写一行 if constexpr，条件是用 std::is_same_v 问 T 是不是 char，成立就打印「字符」加这个值。", acceptRegex: ["if\\s+constexpr\\s*\\(", "is_same_v\\s*<[^>]*char\\s*>"], sample: "if constexpr (std::is_same_v<T, char>) std::println(\"字符 {}\", x);", why: "清单里多了一格，分发里就多一条必须写到的分支：这条漏了，std::visit 会在编译期直接拦下 —— 这就是它逼人的穷尽检查。" }
      ],
      selftest: {
        refs: [
          {q1: "[](const auto& x) {", q2: "using Value = std::variant<int, double, std::string, char>;\n        if constexpr (std::is_same_v<T, char>) return std::string(\"字符 \") + x;", q3: "using T = std::decay_t<decltype(x)>;", q4: "if constexpr (std::is_same_v<T, char>) std::println(\"字符 {}\", x);"}],
        wrongs: [
          {q1: "[](int x) {", q2: "using Value = std::variant<int, double, std::string>;", q3: "using T = decltype(x);", q4: "if constexpr (std::is_same_v<T, int>) std::println(\"整数 {}\", x);"}],
        loose: [
          {q1: "[ ] (  const  auto &  x ) {", q2: "std::variant<int , double , std::string , char>\nif constexpr ( std::is_same_v<T , char> ) return ...", q3: "using  T  =  std :: decay_t < decltype ( x ) > ;", q4: "if  constexpr ( std :: is_same_v < T ,  char > ) std :: println ( \"字符 {}\" , x ) ;"}]
      }
    },
    {
      cid: "m131", kind: "paper", mode: "code", authored: "5cc88447", pass: 60, title: "第 131 课考试 · expected 成功或失败", task: "任务题目：写 parse(s) 返回 std::expected<int, std::string>，字符串里出现非数字字符就报「输入不是整数」，一路数字就返回解析出来的 int", hint: "想不起来就回看本课【怎么做】、【演示 1 · 失败分支单独走一遍】与【演示 2 · parse_int】。",
      questions: [
        { id: "q1", type: "code", score: 25, coversTask: 1, stem: "（任务题）parse 扫到 c 是「0 到 9 之外」的字符时，写一行把失败连着原因「输入不是整数」返回出去。", acceptRegex: ["std::unexpected\\s*\\("], sample: "if (c < '0' || c > '9') return std::unexpected(\"输入不是整数\");", why: "失败必须 return std::unexpected(...)，把原因装进盒子失败那一侧；不套壳直接 return 字符串会被当成想构造成功值。" },
        { id: "q2", type: "code", score: 21, coversTask: 1, stem: "（任务题）调用处写两行：成功那一侧把结果取出来、失败那一侧把原因取出来，各自 println（一行用 value 或 value_or，另一行用 error）。", acceptRegex: ["\\.error\\s*\\(", "\\.value\\s*\\(|value_or"], sample: "std::println(\"{}\", ok.value());\nstd::println(\"{}\", bad.error());", why: "成功侧走 value()/value_or 拿 T、失败侧走 error() 拿 E；两个访问器各管一半，别在同一侧乱用。" },
        { id: "q3", type: "code", score: 29, coversTask: 1, stem: "写出 parse 的头一行：成功时给一个 int、失败时给一句 std::string 的原因，参数是那个待解析的字符串（常量引用，名叫 s）。", acceptRegex: ["expected\\s*<\\s*int\\s*,\\s*std\\s*::\\s*string\\s*>", "parse\\w*\\s*\\(\\s*const\\s+std\\s*::\\s*string\\s*&"], sample: "std::expected<int, std::string> parse(const std::string& s) {", why: "尖括号里前一个类型是成功侧的 int、后一个是失败侧的 std::string，写反了就成了「成功给句子、失败给数」；上一课 optional 只有一个类型，这里要多交代一个。" },
        { id: "q4", type: "code", score: 25, coversTask: 1, stem: "写出把一串数字攒成整数的那三行：int 变量 n 先记 0，用 for 挨个取 s 里的字符，把 n 乘 10 再加上这一位（字符减掉零那个字符），最后一行把 n 直接交回去。", acceptRegex: ["int\\s+n\\s*=\\s*0", "for\\s*\\(\\s*char\\s+\\w+\\s*:\\s*s\\s*\\)", "n\\s*\\*\\s*10", "return\\s+n\\s*;"], sample: "int n = 0;\nfor (char c : s) n = n * 10 + (c - '0');\nreturn n;", why: "最后那句 return n 不套任何壳：直接 return 一个 int 就被装进成功那一侧 —— 只有失败才需要 std::unexpected 明说。" }
      ],
      selftest: {
        refs: [
          {q1: "if (c < '0' || c > '9') return std::unexpected(\"输入不是整数\");", q2: "std::println(\"{}\", ok.value());\nstd::println(\"{}\", bad.error());", q3: "std::expected<int, std::string> parse(const std::string& s) {", q4: "int n = 0;\nfor (char c : s) n = n * 10 + (c - '0');\nreturn n;"}],
        wrongs: [
          {q1: "return std::nullopt;", q2: "std::println(\"{}\", ok.error());", q3: "std::expected<int, std::string> parse(int s) {", q4: "int n = 0;\nreturn n;"}],
        loose: [
          {q1: "return  std::unexpected ( \"输入不是整数\" ) ;", q2: "std::println(\"{}\" , ok.value ( ) ) ;\nstd::println(\"{}\" , bad.error ( ) ) ;", q3: "std :: expected < int , std :: string >  parse_int ( const  std :: string &  s )  {", q4: "int  n = 0 ;\nfor ( char ch : s ) { n = n *  10 + ( ch - '0' ) ; }\nreturn n ;"}]
      }
    },
    {
      cid: "m132", kind: "paper", mode: "quiz", pass: 60, title: "第 132 课考试 · 三兄弟怎么选", task: "任务题目：挑一个你写过的函数，判断它最该用 optional、variant、expected 三者中的哪一个，并说清它想表达的那种「不普通」是什么", hint: "想不起来就回看本课【演示 1 · 三兄弟对照表】与【演示 2 · 现场选型】。",
      questions: [
        { id: "q1", type: "choice", score: 16, coversTask: 1, stem: "一个查找函数：找到就返回下标，找不到就是「压根没有」，也没有别的原因要交代。最该用哪个盒子？", options: ["std::variant", "std::optional", "std::expected", "老式返回码 -1"], answer: 1, why: "只需要区分「有 / 没有」、不追问原因，正是 optional 的活；用 expected 反而要硬凑一个没意义的错误类型。" },
        { id: "q2", type: "choice", score: 15, coversTask: 1, stem: "一格数据一定存在，只是它可能是整数、也可能是字符串。最该用哪个盒子？", options: ["std::optional", "std::expected", "std::variant", "全塞进 std::string 再猜"], answer: 2, why: "值一定有、只是类型在几种里二选一，是 variant 的定义；optional 管有没有、expected 管成败，都不对应「换类型」。" },
        { id: "q3", type: "output", score: 20, coversTask: 1, stem: "下面三段各打印什么？\nstd::optional<char> grade = 'A';\nstd::variant<int, std::string> who = 7;\nstd::expected<int, std::string> r = 99;\nstd::println(\"optional 里: {}\", grade.value_or('?'));\nstd::println(\"variant 现在是 int 吗: {}\", std::holds_alternative<int>(who));\nstd::println(\"expected 里: {}\", r.value_or(-1));", acceptLines: ["optional 里: A", "variant 现在是 int 吗: true", "expected 里: 99"], why: "value_or 是 optional 和 expected 的兜底；holds_alternative 是 variant 那套。三者各开一格：A、true、99。" },
        { id: "q4", type: "multi", score: 22, stem: "关于三兄弟的接口，哪些说法对？（多选，错勾任何一项整题 0 分）", options: ["value_or 是 optional 和 expected 都有的兜底写法", "holds_alternative 是 variant 那一套里的函数", "error() 只有 expected 才有，用来取失败原因", "variant 也能写 if (v) 来判断它到底有没有值"], answers: [0, 1, 2], why: "最后一句错：variant 没有 operator bool、也不能写 if(v)，它靠 index、holds_alternative、get、visit；接口别串门。" },
        { id: "q5", type: "choice", score: 15, coversTask: 1, stem: "一个安全除法：除数是 0 就失败，而且要把「为什么失败」交给调用者。最该用哪个？", options: ["optional，没有值就是失败", "variant，因为除数可能有不同类型", "expected，成功给结果、失败带原因", "返回码，出错就 return -1"], answer: 2, why: "既要结果又要失败原因，正是 expected 的两半；optional 说不出原因、返回码把原因压成一个数容易撞车。" },
        { id: "q6", type: "blank", score: 12, coversTask: 1, stem: "把选型口诀补全：可能没有用 optional、类型几选一用 variant、成败还要带原因用____。", accept: ["expected", "std::expected"], why: "第三句就是 expected —— 它同时握着成功 T 和失败 E，专门接替「失败了还得说清楚为什么」的返回值。" }
      ],
      selftest: {
        refs: [
          {q1: 1, q2: 2, q3: "optional 里: A\nvariant 现在是 int 吗: true\nexpected 里: 99", q4: [0, 1, 2], q5: 2, q6: "expected"}],
        wrongs: [
          {q1: 0, q2: 1, q3: "optional 里: A\nvariant 现在是 int 吗: false\nexpected 里: 99", q4: [0, 1, 3], q5: 0, q6: "optional"}],
        loose: [
          {q1: "1", q2: "2", q3: " optional 里: A \n variant 现在是 int 吗: true \n expected 里: 99 ", q4: [0, 1, 2], q5: "2", q6: "std::expected"}]
      }
    },
  ]
};
