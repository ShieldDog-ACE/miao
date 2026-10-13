/* 喵站 · C++ 掌握 考卷分部 p14：第 129–132 课
 * 契约与其他各场一致：权重和 100、任务逐条 coversTask、带任务的题合计过 50、
 * selftest 里 refs 判 100、wrongs 判不到 60、loose 判过 60。
 * 题干只用读者到对应课为止见过的东西；每场各自只包自己那课。
 */
window.MIAO_CPPM_EXAM_P14 = {
  papers: [
    {
      cid: "m129", kind: "paper", pass: 60,
      title: "第 129 课考试 · variant 几选一",
      task: "任务题目：定义 std::variant<int, std::string>，先存学号那一格、再换成名字那一格，各打印一次，并且每次先问再取",
      hint: "想不起来就回看本课【怎么做】和【演示 2 · 换格子时 index 跟着走】。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          stem: "std::variant<int, double, std::string> 声明的东西是哪一句？",
          options: ["一个变量能先后塞过任何类型的值，取时靠猜格式", "写死几种类型，同一时刻恰好开着其中一格，并自己记着开的是哪格", "同时装着 int、double、string 三份值", "只能装一种类型，装别的就编译不过"],
          answer: 1,
          why: "variant 是「清单写死、同刻只开一格、自报当前类型」的抽屉；清单外的塞不进，这才是它比塞字符串再猜安全的地方。" },
        { id: "q2", type: "output", score: 16, coversTask: 1,
          stem: "下面两段各打印 index() 的值，输出是什么？\nstd::variant<int, std::string> v = 20250001;\nstd::println(\"{}\", v.index());\nv = std::string(\"xiaoming\");\nstd::println(\"{}\", v.index());",
          acceptLines: ["0", "1"],
          why: "清单里 int 是第 0 格、string 是第 1 格；存学号开 int 格得 0，换成名字开 string 格得 1。" },
        { id: "q3", type: "code", score: 16, coversTask: 1,
          stem: "（任务题）写出「先确认现在是不是 std::string、是就把这格取出来」的判定加取值两行（v 是那只 variant）。",
          acceptRegex: ["holds_alternative\\s*<\\s*std::string", "get\\s*<\\s*std::string"],
          why: "先 std::holds_alternative<std::string>(v) 问一句，为真再 std::get<std::string>(v) 取，标准姿势是问过了再取。" },
        { id: "q4", type: "choice", score: 12,
          stem: "往 std::variant<int, double, std::string> 里写 v = 'A' 会发生什么？",
          options: ["自动转成 int 存进第 0 格", "编译不过，char 不在清单 int/double/string 里", "运行时抛异常但程序继续跑", "被存进去，覆盖原来的值"],
          answer: 1,
          why: "类型清单在编译期钉死，char 不是清单里的三种之一，编译器直接拒绝 —— 这正是 variant 的第一层安全。" },
        { id: "q5", type: "blank", score: 8,
          stem: "std::get<int>(v) 只有在确认 variant 当前开着的正是____那一格时才安全（先问再取）。",
          accept: ["int", "整数", "整数格", "第一格"],
          why: "get<T> 照你说的取，取错格会当场终止；所以只能对当前亮着的格用对应的 get，先 holds_alternative 问明白。" },
        { id: "q6", type: "multi", score: 16,
          stem: "关于 std::variant，哪些说法对？（多选，错勾任何一项整题 0 分）",
          options: ["同一时刻只开着一格，不会两格同时亮", "清单之外的类型塞不进，编译期就拦下", "它的含义是恰好一个，不能同时并存两种值", "它会把 double 自动变成 int 来匹配当前格"],
          answers: [0, 1, 2],
          why: "variant 存「类型加值」的组合，绝不隐式换类型去凑某一格；想并存得另用一个含多成员的 struct。" },
        { id: "q7", type: "output", score: 20, coversTask: 1,
          stem: "std::variant<int, double, std::string> v = 42，下面两行打印什么？\nstd::println(\"{} {}\", v.index(), std::holds_alternative<double>(v));\nv = 3.14;\nstd::println(\"{} {}\", v.index(), std::holds_alternative<double>(v));",
          acceptLines: ["0 false", "1 true"],
          why: "装 42 时开 int 格（index 0，不是 double）；赋值 3.14 后开 double 格（index 1，holds 为真）。换格子，index 跟着跳。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: "0\n1", q3: "if (std::holds_alternative<std::string>(v))\n    std::println(\"{}\", std::get<std::string>(v));", q4: 1, q5: "int", q6: [0, 1, 2], q7: "0 false\n1 true" }
        ],
        wrongs: [
          { q1: 0, q2: "1\n0", q3: "std::println(\"{}\", v);", q4: 0, q5: "char", q6: [0, 1, 2], q7: "42 true\n3.14 true" }
        ],
        loose: [
          { q1: "1", q2: " 0 \n\n 1 ", q3: "if ( std :: holds_alternative < std::string > ( v ) ) std::get < std::string > ( v ) ;", q4: "1", q5: "INT", q6: [0, 1, 2], q7: " 0  false \n 1  true " }
        ]
      }
    },
    {
      cid: "m130", kind: "paper", pass: 60,
      title: "第 130 课考试 · visit 自动分发",
      task: "任务题目：给那只 std::variant<int, double, std::string> 加第四格 char，并在 describe 的 lambda 里用 if constexpr 补一条对应的 char 分支",
      hint: "想不起来就回看本课【怎么做】、【演示 2 · 叫号器按当前类型逐个走】与【演示 3 · 给抽屉加第四格】。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          stem: "std::visit(lambda, v) 真正干的事是哪一句？",
          options: ["永远调用 lambda 里第一条分支", "看 v 当前亮着哪格，把那格里的值直接喂给 lambda", "把 v 里每一格依次清空一遍", "把 v 转成清单里第一个类型再交给 lambda"],
          answer: 1,
          why: "visit 是叫号器：它读 variant 当前实际亮着的那格（也就是 index 报的那个），只把那格的真实值递进 lambda。" },
        { id: "q2", type: "output", score: 16, coversTask: 1,
          stem: "给 variant 加了 char 格后，v 装 'A' 时下面这段打印什么？\nstd::variant<int, char> v = 'A';\nstd::visit([](const auto& x) {\n    using T = std::decay_t<decltype(x)>;\n    if constexpr (std::is_same_v<T, int>) std::println(\"整数 {}\", x);\n    else std::println(\"字符 {}\", x);\n}, v);",
          acceptLines: ["字符 A"],
          why: "v 当前开 char 格，T 就是 char，if constexpr 命中 else 那条新分支，打印 字符 A。" },
        { id: "q3", type: "code", score: 14, coversTask: 1,
          stem: "（任务题）std::visit 的第一个参数要写成能接住 variant 里每一种类型的泛型 lambda，它的参数那半句怎么声明？只写 lambda 的形参部分。",
          acceptRegex: ["const\\s+auto"],
          why: "泛型 lambda 用 const auto& 作形参，编译器才按每种类型各生成一版；写成具体 int 就接不住别的格，visit 编译失败。" },
        { id: "q4", type: "choice", score: 12,
          stem: "为什么分类型要用 if constexpr，而不是普通 if？",
          options: ["普通 if 运行时太慢", "普通 if 的每条分支都会被编译，走不到的分支里对错误类型的操作照样报错；if constexpr 在编译期把不成立的分支整段丢掉", "if constexpr 能自动补上缺失的类型", "两者完全等价，只是新旧写法不同"],
          answer: 1,
          why: "只有 if constexpr 才让「字符串那格却写整数运算」这类分支不参与编译，泛型 lambda 才能一份源码适配多种类型。" },
        { id: "q5", type: "multi", score: 16,
          stem: "关于 std::visit 与泛型 lambda，哪些说法对？（多选，错勾任何一项整题 0 分）",
          options: ["泛型 lambda 的参数用 const auto&", "if constexpr 条件不成立的分支不会生成代码", "给 variant 加了一种类型却在 lambda 里没接住它，visit 那一行会编译失败", "visit 会挑一个最匹配的类型来分发，而不是当前实际亮着的那格"],
          answers: [0, 1, 2],
          why: "最后一句错：visit 只认当前实际亮着那一格的真实类型，绝不做「最像哪个」的隐式匹配；穷尽检查才是它逼你的地方。" },
        { id: "q6", type: "code", score: 20, coversTask: 1,
          stem: "（任务题）写出两处：一是把 char 加进清单的 variant 声明行，二是在 describe 的 lambda 里那条判当前类型是不是 char 的 if constexpr 行（拿 std::is_same_v 比对 T）。",
          acceptRegex: ["variant<[^>]*char", "is_same_v\\s*<[^>]*char"],
          why: "清单要在 std::variant<int, double, std::string, char> 里补 char；再用 if constexpr (std::is_same_v<T, char>) 接住它，两条缺一不可。" },
        { id: "q7", type: "blank", score: 10, coversTask: 1,
          stem: "std::visit 逼你把 variant 里每一种类型都处理干净，漏一种就编译失败，这种性质叫对类型的____检查。",
          accept: ["穷尽", "全覆盖", "完全", "exhaustive"],
          why: "叫穷尽检查：手写一串 if 漏一种会悄悄失效，而 visit 会在编译期直接拦住，这正是它比一长串 holds_alternative 让人放心的地方。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: "字符 A", q3: "[](const auto& x) {", q4: 1, q5: [0, 1, 2], q6: "using Value = std::variant<int, double, std::string, char>;\n        if constexpr (std::is_same_v<T, char>) return std::string(\"字符 \") + x;", q7: "穷尽" }
        ],
        wrongs: [
          { q1: 3, q2: "字符 65", q3: "[](int x) {", q4: 0, q5: [0, 1, 2, 3], q6: "using Value = std::variant<int, double, std::string>;", q7: "随机" }
        ],
        loose: [
          { q1: "1", q2: "  字符 A  ", q3: "[ ] (  const  auto &  x ) {", q4: "1", q5: [0, 1, 2], q6: "std::variant<int , double , std::string , char>\nif constexpr ( std::is_same_v<T , char> ) return ...", q7: "全覆盖" }
        ]
      }
    },
    {
      cid: "m131", kind: "paper", pass: 60,
      title: "第 131 课考试 · expected 成功或失败",
      task: "任务题目：写 parse(s) 返回 std::expected<int, std::string>，字符串里出现非数字字符就报「输入不是整数」，一路数字就返回解析出来的 int",
      hint: "想不起来就回看本课【怎么做】、【演示 1 · 失败分支单独走一遍】与【演示 2 · parse_int】。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          stem: "在 std::expected<int, std::string> 里，尖括号中两个类型分别代表什么？",
          options: ["第一个是失败原因、第二个是成功结果", "第一个是成功结果 int、第二个是失败原因 std::string", "两个必须是同一个类型", "只有第一个有用"],
          answer: 1,
          why: "expected 的约定是前一个成功类型 T、后一个错误类型 E；写反就成了「成功给字符串、失败给整数」。" },
        { id: "q2", type: "code", score: 18, coversTask: 1,
          stem: "（任务题）parse 扫到 c 是「0 到 9 之外」的字符时，写一行把失败连着原因「输入不是整数」返回出去。",
          acceptRegex: ["std::unexpected\\s*\\("],
          why: "失败必须 return std::unexpected(...)，把原因装进盒子失败那一侧；不套壳直接 return 字符串会被当成想构造成功值。" },
        { id: "q3", type: "output", score: 16, coversTask: 1,
          stem: "parse_int 已按任务写好（非数字就 std::unexpected(\"输入不是整数\")）。下面两行打印什么？\nauto ok = parse_int(\"123\");\nauto bad = parse_int(\"12a\");\nstd::println(\"{}\", ok.value());\nstd::println(\"{}\", bad.error());",
          acceptLines: ["123", "输入不是整数"],
          why: "123 一路是数字，成功侧取到 123；12a 里出现 a，失败侧 error() 拿到「输入不是整数」。" },
        { id: "q4", type: "choice", score: 12,
          stem: "函数里直接 return 一个正常结果值（没套 std::unexpected），表示什么？",
          options: ["表示失败", "表示成功，编译器帮你把结果值隐式包成 expected", "是未定义行为", "表示盒子是空的"],
          answer: 1,
          why: "成功路径就是直接 return 值，编译器自动包成 expected 的成功那一侧；只有失败才需要你显式 std::unexpected。" },
        { id: "q5", type: "multi", score: 14,
          stem: "关于 expected 的判侧与取值，哪些说法对？（多选，错勾任何一项整题 0 分）",
          options: ["if (r) 判侧靠的是把 expected 隐式转成 bool", "r.error() 只在失败那一侧使用", "对失败的盒子调 value() 会当场出问题", "r.value() 对失败的盒子会悄悄返回一个默认值且不报错"],
          answers: [0, 1, 2],
          why: "最后一句错：对失败盒子调 value() 会抛 bad_expected_access 直接终止，所以判侧永远在取值之前；想要默认值请用 value_or。" },
        { id: "q6", type: "code", score: 14, coversTask: 1,
          stem: "（任务题）调用处写两行：成功那一侧把结果取出来、失败那一侧把原因取出来，各自 println（一行用 value 或 value_or，另一行用 error）。",
          acceptRegex: ["\\.error\\s*\\(", "\\.value\\s*\\(|value_or"],
          why: "成功侧走 value()/value_or 拿 T、失败侧走 error() 拿 E；两个访问器各管一半，别在同一侧乱用。" },
        { id: "q7", type: "blank", score: 14, coversTask: 1,
          stem: "想造一只「失败那一侧亮着」的盒子，就用____这个包装器把错误原因包一下再 return（填它的名字）。",
          accept: ["std::unexpected", "unexpected"],
          why: "std::unexpected(...) 是明确的「这是失败、这是原因」的信号；直接 return 一个别的类型会被编译器当成想构造成功值。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: "if (c < '0' || c > '9') return std::unexpected(\"输入不是整数\");", q3: "123\n输入不是整数", q4: 1, q5: [0, 1, 2], q6: "std::println(\"{}\", ok.value());\nstd::println(\"{}\", bad.error());", q7: "std::unexpected" }
        ],
        wrongs: [
          { q1: 0, q2: "return std::nullopt;", q3: "123\n12a", q4: 2, q5: [1, 2, 3], q6: "std::println(\"{}\", ok.error());", q7: "nullopt" }
        ],
        loose: [
          { q1: "1", q2: "return  std::unexpected ( \"输入不是整数\" ) ;", q3: " 123 \n\n 输入不是整数 ", q4: "1", q5: [0, 1, 2], q6: "std::println(\"{}\" , ok.value ( ) ) ;\nstd::println(\"{}\" , bad.error ( ) ) ;", q7: "unexpected" }
        ]
      }
    },
    {
      cid: "m132", kind: "paper", pass: 60,
      title: "第 132 课考试 · 三兄弟怎么选",
      task: "任务题目：挑一个你写过的函数，判断它最该用 optional、variant、expected 三者中的哪一个，并说清它想表达的那种「不普通」是什么",
      hint: "想不起来就回看本课【演示 1 · 三兄弟对照表】与【演示 2 · 现场选型】。",
      questions: [
        { id: "q1", type: "choice", score: 12, coversTask: 1,
          stem: "一个查找函数：找到就返回下标，找不到就是「压根没有」，也没有别的原因要交代。最该用哪个盒子？",
          options: ["std::variant", "std::optional", "std::expected", "老式返回码 -1"],
          answer: 1,
          why: "只需要区分「有 / 没有」、不追问原因，正是 optional 的活；用 expected 反而要硬凑一个没意义的错误类型。" },
        { id: "q2", type: "choice", score: 12, coversTask: 1,
          stem: "一格数据一定存在，只是它可能是整数、也可能是字符串。最该用哪个盒子？",
          options: ["std::optional", "std::expected", "std::variant", "全塞进 std::string 再猜"],
          answer: 2,
          why: "值一定有、只是类型在几种里二选一，是 variant 的定义；optional 管有没有、expected 管成败，都不对应「换类型」。" },
        { id: "q3", type: "output", score: 16, coversTask: 1,
          stem: "下面三段各打印什么？\nstd::optional<char> grade = 'A';\nstd::variant<int, std::string> who = 7;\nstd::expected<int, std::string> r = 99;\nstd::println(\"optional 里: {}\", grade.value_or('?'));\nstd::println(\"variant 现在是 int 吗: {}\", std::holds_alternative<int>(who));\nstd::println(\"expected 里: {}\", r.value_or(-1));",
          acceptLines: ["optional 里: A", "variant 现在是 int 吗: true", "expected 里: 99"],
          why: "value_or 是 optional 和 expected 的兜底；holds_alternative 是 variant 那套。三者各开一格：A、true、99。" },
        { id: "q4", type: "multi", score: 18,
          stem: "关于三兄弟的接口，哪些说法对？（多选，错勾任何一项整题 0 分）",
          options: ["value_or 是 optional 和 expected 都有的兜底写法", "holds_alternative 是 variant 那一套里的函数", "error() 只有 expected 才有，用来取失败原因", "variant 也能写 if (v) 来判断它到底有没有值"],
          answers: [0, 1, 2],
          why: "最后一句错：variant 没有 operator bool、也不能写 if(v)，它靠 index、holds_alternative、get、visit；接口别串门。" },
        { id: "q5", type: "choice", score: 12, coversTask: 1,
          stem: "一个安全除法：除数是 0 就失败，而且要把「为什么失败」交给调用者。最该用哪个？",
          options: ["optional，没有值就是失败", "variant，因为除数可能有不同类型", "expected，成功给结果、失败带原因", "返回码，出错就 return -1"],
          answer: 2,
          why: "既要结果又要失败原因，正是 expected 的两半；optional 说不出原因、返回码把原因压成一个数容易撞车。" },
        { id: "q6", type: "blank", score: 10, coversTask: 1,
          stem: "把选型口诀补全：可能没有用 optional、类型几选一用 variant、成败还要带原因用____。",
          accept: ["expected", "std::expected"],
          why: "第三句就是 expected —— 它同时握着成功 T 和失败 E，专门接替「失败了还得说清楚为什么」的返回值。" },
        { id: "q7", type: "code", score: 20, coversTask: 1,
          stem: "（任务题）一个登录校验：成功返回用户名（std::string）、失败返回「为什么错」（也是 std::string）。只写它的返回类型。",
          acceptRegex: ["expected\\s*<\\s*std::string\\s*,\\s*std::string"],
          why: "要能说清失败原因就得用 expected，第一个成功类型、第二个错误类型都是 std::string：std::expected<std::string, std::string>。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: 2, q3: "optional 里: A\nvariant 现在是 int 吗: true\nexpected 里: 99", q4: [0, 1, 2], q5: 2, q6: "expected", q7: "std::expected<std::string, std::string>" }
        ],
        wrongs: [
          { q1: 0, q2: 1, q3: "optional 里: A\nvariant 现在是 int 吗: false\nexpected 里: 99", q4: [0, 1, 3], q5: 0, q6: "optional", q7: "std::optional<std::string>" }
        ],
        loose: [
          { q1: "1", q2: "2", q3: " optional 里: A \n variant 现在是 int 吗: true \n expected 里: 99 ", q4: [0, 1, 2], q5: "2", q6: "std::expected", q7: "std :: expected<std::string , std::string>" }
        ]
      }
    }
  ]
};
