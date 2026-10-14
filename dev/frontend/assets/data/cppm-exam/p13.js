/* 喵站 · C++ 掌握 考卷分部 p13：第 125–128 课
 * 契约与各场一致：权重和 100、任务逐条 coversTask、带任务的题合计过 50、
 * selftest 里 refs 判 100、wrongs 判不到 60、loose 判过 60。
 * 题干只用读者到对应课为止见过的东西：m125、m126 两场里不出现 std::optional —— 那是第 127 课才放行的。
 */
window.MIAO_CPPM_EXAM_P13 = {
  papers: [
    {
      cid: "m125", kind: "paper", mode: "quiz", pass: 60, title: "第 125 课考试 · unique_ptr 链表与自动释放", task: "任务题目：在尾部再接一个节点 4，重新编译运行，看遍历输出；并说清 reset 之后整条链是怎么被一格一格释放的", hint: "回看本课【演示 1 · 串起来，再走一遍】【演示 2 · 删头 = 整条链自动释放】和【演示 3 · 链太长会怎样】。",
      questions: [
        { id: "q1", type: "choice", score: 12, stem: "结构体里那一行 std::unique_ptr<Node> next 说的是哪件事？", options: ["这个节点指着下一个节点，但不负责任何释放", "这个节点拥有下一个节点，它被析构时把下一个也一并处置掉", "下一个节点就存在这个节点 body 里面，两者占同一格内存", "下一个节点由好几个指针共同持有，最后一个放手才释放"], answer: 1, why: "换成 unique_ptr 之后，next 不再是「指向」而是「拥有」，所有权沿链单向传下去，这正是第 121 课那条独占规矩用在结构里。" },
        { id: "q2", type: "output", score: 26, coversTask: [1], stem: "接好 4 号之后跑这段遍历，打印出来的是哪一行？\nfor (Node* c = head.get(); c != nullptr; c = c->next.get()) std::print(\"{} → \", c->value);\nstd::println(\"到头了\");", acceptLines: ["1 → 2 → 3 → 4 → 到头了"], why: "本机实测就是这一行：观察指针一格一格往前问，第四格的 next 是空的 unique_ptr，get() 交出 nullptr，循环自己收住。" },
        { id: "q3", type: "output", score: 24, coversTask: [1], stem: "四格链，~Node 里写的是 std::println(\"节点 {} 释放\", value)。执行 head.reset() 之后依次打印什么？一行一个。", acceptLines: ["节点 1 释放", "节点 2 释放", "节点 3 释放", "节点 4 释放"], why: "析构函数体先跑、成员后析构，所以顺序是头到尾 1 2 3 4；打印「节点 1 释放」那一刻，后面几格其实还在内存里，真正归还发生在递归往回收的路上。" },
        { id: "q4", type: "choice", score: 10, stem: "遍历开头那句 head.get() 干的是什么？", options: ["把 head 的所有权交给循环变量", "只借出一个用来观察的裸指针，所有权仍留在 head 里", "释放 head 指的那块内存", "复制一份节点出来"], answer: 1, why: "走链只需要看，不需要负责：get() 交出的是门牌号不是所有权，所以循环里绝不能 delete 它。" },
        { id: "q5", type: "multi", score: 16, stem: "本机实测：一百万个节点的链，head.reset() 把程序打崩（段错误，退出码 139）。关于这件事哪些说法对？（多选，错勾任何一项整题 0 分）", options: ["释放是一格套一格的递归，链有多长递归就有多深", "撑不住的是栈，栈的容量是几兆量级的硬上限", "把 next 换成 std::shared_ptr 就不会崩", "改成迭代式摘链，一边往前摘一边放手，栈深恒定"], answers: [0, 1, 3], why: "崩的不是 unique_ptr 本身而是「递归销毁」这个走法：shared_ptr 一样递归析构，换了等于没换；把递归改成循环才是解法。" },
        { id: "q6", type: "blank", score: 12, stem: "reset 头节点时，一个节点的析构引出下一个节点的析构，这种「函数自己一层层调用下去」的走法叫____。", accept: ["递归", "递归调用", "递归析构", "recursion"], why: "记住这个名词，才说得出演示 3 那条代价：递归深度等于链长，所以栈先撑爆。" }
      ],
      selftest: {
        refs: [
          {q1: 1, q2: "1 → 2 → 3 → 4 → 到头了", q3: "节点 1 释放\n节点 2 释放\n节点 3 释放\n节点 4 释放", q4: 1, q5: [0, 1, 3], q6: "递归"}],
        wrongs: [
          {q1: 0, q2: "1 → 2 → 3 → 到头了", q3: "节点 4 释放\n节点 3 释放\n节点 2 释放\n节点 1 释放", q4: 2, q5: [0, 1], q6: "循环"}],
        loose: [
          {q1: "1", q2: " 1 → 2 → 3 → 4 → 到头了 ", q3: "节点 1 释放\n\n节点 2 释放\n节点 3 释放\n节点 4 释放\n", q4: "1", q5: [0, 1, 3], q6: "RECURSION"}]
      }
    },
    {
      cid: "m126", kind: "paper", mode: "quiz", pass: 60, title: "第 126 课考试 · 魔法值与暗号的害处", task: "任务题目：想清楚编译器为什么不提醒「你忘了检查 -1」，它知不知道 -1 是暗号；再用「返回 bool 加引用参数」把两个信息分开", hint: "回看【演示 1 · 忘检查的人会走到哪一步】【演示 2 · 暗号撞上真数据】【演示 3 · 现有工具里最好的一步】。",
      questions: [
        { id: "q1", type: "choice", score: 19, coversTask: [1], stem: "find_index 返回 int，没找到时返回 -1。编译器为什么不提醒调用方「你忘了检查 -1」？", options: ["它不知道 -1 在这只函数里被约定成暗号 —— 签名里只有一个 int，没有任何关于「没有」的信息", "因为检查属于运行期，编译器一概不管运行期的事", "因为只要写了注释，它就当成已经检查过了", "因为它认为下标越界不算错误"], answer: 0, why: "「-1 表示没有」这条判决只存在于注释和人的脑子里，类型里没写；编译器能查的东西只有类型，所以它一声不吭。" },
        { id: "q2", type: "choice", score: 16, stem: "另一只函数带回的是「第一个负温度的值」，约定没找到时返回 -1。实测找 {3, -1, 5} 和找 {3, 5, 7} 打出来是同一个 -1。最准确的说明是哪一条？", options: ["-1 本来就是这只函数的合法答案，暗号和真结果共用一个数，调用方分不出来", "编译器本该拦住这种写法，这是标准库的漏洞", "只要在函数上面补一句注释，运行时就能分清这两种情况", "把暗号换成 -2 之后，调用方就再也不用记任何约定了"], answer: 0, why: "下标不会是负数，所以拿 -1 当「没有」勉强站得住；带回值本身时值域整个敞开着，撞车只是早晚的事。" },
        { id: "q3", type: "output", score: 15, stem: "a 是 3 -1 5，b 是 3 5 7，first_below_free 就是上面说的那只带回值的函数。下面两行打印什么？\nstd::println(\"{}\", first_below_free(a));\nstd::println(\"{}\", first_below_free(b));", acceptLines: ["-1", "-1"], why: "两行一模一样：第一行是「找到了，零下 1 度」，第二行是「一个负数都没找到」—— 这正是暗号的死处。" },
        { id: "q4", type: "multi", score: 16, coversTask: [1], stem: "关于这种数字暗号，哪些说法对？（多选，错勾任何一项整题 0 分）", options: ["约定写在注释里，而注释不参与编译", "调用方忘了检查，通常既不报编译错误也不给警告", "标准库会替你拦住拿 -1 当下标去读的那一行", "暗号越是可能在业务数据里出现的值，撞车风险越大"], answers: [0, 1, 3], why: "忘检查的后果是程序继续跑、把暗号当真数据用；本机越界被断言拦下只是运气好，换台机器它就安静给你一个陌生值。" },
        { id: "q5", type: "blank", score: 15, coversTask: [1], stem: "编译器能查的只有____，它读不到你脑子里那句「这个数另有所指」。", accept: ["类型", "返回类型", "type", "函数的类型", "签名"], why: "这句话就是上一题那个「为什么不提醒」的答案：信息不在类型里，检查就没人管。" },
        { id: "q6", type: "output", score: 19, stem: "pos 初值是 0。用上面那种 bool 加引用参数的写法跑两段：先找 55 成功，再找 99 失败。下面两行打印什么？\nif (find_index(scores, 55, pos)) std::println(\"找到 55，下标 {}\", pos);\nbool ok = find_index(scores, 99, pos);\nstd::println(\"找 99 成没成: {}，此时 pos = {}\", ok, pos);", acceptLines: ["找到 55，下标 1", "找 99 成没成: false，此时 pos = 1"], why: "实测第二行打印的 pos 是 1 而不是 0：失败时那个参数一动不动，留着上一次成功的陈值 —— 这是这套招式剩下的软肋。" }
      ],
      selftest: {
        refs: [
          {q1: 0, q2: 0, q3: "-1\n-1", q4: [0, 1, 3], q5: "类型", q6: "找到 55，下标 1\n找 99 成没成: false，此时 pos = 1"}],
        wrongs: [
          {q1: 1, q2: 1, q3: "-1\n0", q4: [0, 2], q5: "注释", q6: "找到 55，下标 1\n找 99 成没成: true，此时 pos = 1"},
          {q1: 3, q2: 3, q3: "3\n-1", q4: [2], q5: "sizeof", q6: "找到 55，下标 0\n找 99 成没成: false，此时 pos = 0"}],
        loose: [
          {q1: "0", q2: "0", q3: " -1 \n\n -1 ", q4: [0, 1, 3], q5: "SIGNATURE", q6: " 找到 55，下标 1 \n找 99 成没成: false，此时 pos = 1\n"}]
      }
    },
    {
      cid: "m127", kind: "paper", mode: "code", authored: "103f9fe1", pass: 60, title: "第 127 课考试 · std::optional 这只可能空着的盒子", task: "任务题目：写 find_max(v) 返回 optional<int> —— 空数组给 nullopt，否则给最大值；调用方先问一句再取值", hint: "回看【怎么做】【演示 1 · if 直接问盒子】【演示 3 · 不问就硬取会怎样】。",
      questions: [
        { id: "q1", type: "code", score: 26, coversTask: [1], stem: "（任务题）写出 find_max 的头一行：返回一只「可能装着 int 的盒子」，参数是 std::vector<int> 的常量引用 v。", acceptRegex: ["optional\\s*<\\s*int\\s*>"], sample: "std::optional<int> find_max(const std::vector<int>& v) {", why: "任务的关键就在返回类型：从 int 换成 optional<int>，「空表没有最大值」这件事才有地方放。" },
        { id: "q2", type: "code", score: 22, coversTask: [1], stem: "（任务题）接着上一题：v 是空表时那一条 return 写出来。", acceptRegex: ["return\\s+std\\s*::\\s*nullopt"], sample: "return std::nullopt;", why: "空表交还的是明确的空盒，不是 0、不是 -1 —— 不占用任何一个正经数值当暗号。" },
        { id: "q3", type: "code", score: 27, coversTask: 1, stem: "写出 find_max 找最大值那一段：开一个 int 变量 best 先记 0，用 for 挨个看 v 里的数，谁比 best 大就把它写进 best，最后把 best 还回去。", acceptRegex: ["int\\s+best\\s*=", "for\\s*\\(\\s*int\\s+\\w+\\s*:", "best\\s*=\\s*\\w+", "return\\s+best\\s*;"], sample: "int best = 0;\nfor (int s : v) if (s > best) best = s;\nreturn best;", why: "打擂台这一段跟 optional 无关，普通 int 就够；关键是最后那句 return best —— 交回去的数会被自动装进盒子，签名里那个 optional<int> 替你办这件事。" },
        { id: "q4", type: "code", score: 25, stem: "写一行：调用 find_max(v) 拿到盒子，先用 if 问一句盒里有没有货，有货才用星号把最大值取出来打印。", acceptRegex: ["if\\s*\\(\\s*auto\\s+\\w+\\s*=\\s*find_max\\s*\\(", "std\\s*::\\s*println\\s*\\(", "\\*\\s*\\w+"], sample: "if (auto r = find_max(v)) std::println(\"最大值 = {}\", *r);", why: "if 拿到的就是那只盒子本身：有货走前一条、空盒走后一条，星号只在确认有货之后才写 —— 这正是 optional 比 -1 暗号可靠的地方。" }
      ],
      selftest: {
        refs: [
          {q1: "std::optional<int> find_max(const std::vector<int>& v) {", q2: "return std::nullopt;", q3: "int best = 0;\nfor (int s : v) if (s > best) best = s;\nreturn best;", q4: "if (auto r = find_max(v)) std::println(\"最大值 = {}\", *r);"}],
        wrongs: [
          {q1: "int find_max(const std::vector<int>& v) {", q2: "return -1;", q3: "int best = 0;\nreturn best;", q4: "std::println(\"最大值 = {}\", find_max(v));"}],
        loose: [
          {q1: "std :: optional < int >  find_max ( const std :: vector < int > & v )  {", q2: "return  std :: nullopt ;", q3: "int  best = 0 ;\nfor ( int x : v ) { if ( x > best ) best = x ; }\nreturn best ;", q4: "if ( auto res = find_max ( v ) ) { std :: println ( \"最大值 {}\" , * res ) ; }"}]
      }
    },
    {
      cid: "m128", kind: "paper", mode: "code", authored: "4bb00613", pass: 60, title: "第 128 课考试 · value_or 的兜底值", task: "任务题目：给 nickname 加 2 号「小红」，再分别用 if 和 value_or 两种方式各取一次值，说清两种写法各自适合什么时候", hint: "回看【怎么做】【演示 2 · 同一条数据，if 与 value_or 各走一遍】【演示 3 · 兜底表达式每次都被算】。",
      questions: [
        { id: "q1", type: "code", score: 23, coversTask: [1], stem: "（任务题）nickname 查无此人时给空盒。写一行：打印 9 号的显示名，没有昵称就用「匿名用户」兜底，一行的 if 都不许写。", acceptRegex: ["value_or\\s*\\(", "匿名用户"], sample: "std::println(\"9 号昵称: {}\", nickname(9).value_or(\"匿名用户\"));", why: "value_or 括号里放的就是那条备注：查得到用查到的，查不到用备用的，一行收尾。" },
        { id: "q2", type: "code", score: 20, coversTask: [1], stem: "（任务题）给 nickname 补上 2 号「小红」：写那一条判断加返回，id 等于 2 就交「小红」。", acceptRegex: ["id\\s*==\\s*2", "小红"], sample: "if (id == 2) return \"小红\";", why: "返回一个 std::string 会自动装进盒子，这一句和 1 号那条形状一样 —— 盒子的构造是隐含的。" },
        { id: "q3", type: "code", score: 30, coversTask: 1, stem: "写一行：走 if 那条路 —— 拿 nickname(2) 交回来的盒子问一句有没有货，有货就用星号把真名取出来打印。", acceptRegex: ["if\\s*\\(\\s*auto\\s+\\w+\\s*=\\s*nickname\\s*\\(", "std\\s*::\\s*println\\s*\\(", "\\*\\s*\\w+"], sample: "if (auto n = nickname(2)) std::println(\"2 号真名: {}\", *n);", why: "if 分流这一边拿到的是盒子本身，所以能写星号取值；value_or 那一边只会交出一个拷贝，改不到盒里 —— 这就是两条路的分工界线。" },
        { id: "q4", type: "code", score: 27, coversTask: 1, stem: "写出 nickname 的头一行：返回一只「可能装着别名的盒子」，参数是一个 int。", acceptRegex: ["optional\\s*<\\s*std\\s*::\\s*string\\s*>", "nickname\\s*\\(\\s*int\\b"], sample: "std::optional<std::string> nickname(int id) {", why: "返回类型里的 optional 是这一课全部的起点：签名上写着可能没有，函数里那句 return 一个 std::string 才会被自动装进盒子。" }
      ],
      selftest: {
        refs: [
          {q1: "std::println(\"9 号昵称: {}\", nickname(9).value_or(\"匿名用户\"));", q2: "if (id == 2) return \"小红\";", q3: "if (auto n = nickname(2)) std::println(\"2 号真名: {}\", *n);", q4: "std::optional<std::string> nickname(int id) {"}],
        wrongs: [
          {q1: "std::println(\"9 号昵称: {}\", *nickname(9));", q2: "if (id == 3) return \"小红\";", q3: "std::println(\"2 号真名: {}\", nickname(2).value_or(\"匿名用户\"));", q4: "std::string nickname(int id) {"},
          {q1: "std::println(\"9 号昵称: {}\", nickname(9));", q2: "return \"小明\";", q3: "std::println(\"2 号真名: {}\", nickname(2).value_or(\"匿名用户\"));", q4: "std::string nickname(int id) {"}],
        loose: [
          {q1: "std::println ( \"9 号昵称: {}\" , nickname ( 9 ) . value_or ( \"匿名用户\" ) ) ;", q2: "if ( id == 2 )  return \"小红\" ;", q3: "if ( auto nm = nickname ( 2 ) ) { std :: println ( \"2 号真名：{}\" , * nm ) ; }", q4: "std :: optional < std :: string >  nickname ( int  who )  {"}]
      }
    },
  ]
};
