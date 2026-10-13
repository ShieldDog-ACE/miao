/* 喵站 · C++ 掌握 考卷分部 p15：第 133–136 课（第九轮）
 * 契约照 p10：每题分数合计正好 100、源稿每条任务都有题 coversTask 对着、
 * 带 coversTask 的题合计 ≥50 分、每题带 why、refs 判 100 / wrongs 判 <60 / loose 判 ≥60。
 * 四份源稿各只有 1 条【任务】，所以 coversTask 一律是 1。
 * 所有 output 题的 acceptLines 都是本机 g++ -std=c++23 实跑抄下来的行；
 * 第 136 课的耗时行只在「打印移动耗时」这一档是稳定的 0，复制那行受负载影响，
 * 所以任务题出在「改哪一行」与「怎么读那个 0」上，不出在背数字上。
 */
window.MIAO_CPPM_EXAM_P15 = {
  papers: [
    {
      cid: `m133`, kind: `paper`, pass: 60,
      task: `任务题目：用 std::string 重做一遍复制与移动的实验 —— 搬空之后把原字符串的内容打印出来；先猜 a 会打印成什么，再跑`,
      hint: `想不起来就回看本课【演示 2 · 本课任务：换成 std::string 重做，打印原件内容】与【演示 3 · 空壳不是报废】。`,
      questions: [
        { id: `q1`, type: `choice`, score: 12,
          stem: `std::move 这个调用本身做了什么动作？`,
          options: [`把对象的数据搬到一块新内存里`, `它一个字节都不搬，只是把对象标成「我可以不要了」，真搬的仍是移动构造函数`, `把这个对象销毁`, `命令编译器把所有复制都改成移动`],
          answer: 1,
          why: `名字带 move 却不是搬运工：它只是一句声明，交给移动构造函数去动手。第 122 课把 unique_ptr 交出去时写的也是这句话。` },
        { id: `q2`, type: `code`, score: 20, coversTask: 1,
          stem: `（任务题）写出这两句：把 std::string a 复制给 b，再把 a 整个搬给 c。`,
          acceptRegex: [`b\\s*=\\s*a`, `c\\s*=\\s*std::move\\s*\\(\\s*a\\s*\\)`],
          why: `复制那句原件照旧，搬走那句原件被抹空 —— 这两句就是任务要跑的实验本体。` },
        { id: `q3`, type: `output`, score: 14, coversTask: 1,
          stem: `演示 2 那个程序（a 是五千个字符 x）跑出来三行打印什么？（一行一个结果）\nstd::string b = a;\nstd::string c = std::move(a);\n然后三句 println 分别打 b 的个数与前三个字符、c 的个数与前三个字符、a 剩下的个数与内容。`,
          acceptLines: [`b 有 5000 个，前三个是「xxx」`, `c 有 5000 个，前三个是「xxx」`, `a 剩 0 个，内容是「」`],
          why: `b 和 c 各有各的来源所以都是五千；a 被搬空之后是一个合法的空串，不是垃圾值 —— 这正是任务要你亲眼确认的事。` },
        { id: `q4`, type: `choice`, score: 10,
          stem: `std::vector<int> c = std::move(a); 之后 a 有 0 个。标准给这个 0 的承诺是什么？`,
          options: [`a 已经报废，再碰它一句都是错的`, `只承诺「有效但未指定」：可以安全析构、可以重新装，内容不能当回事`, `任何实现里移动之后一定保证是空`, `a 的内存被立刻填成一堆 0`],
          answer: 1,
          why: `本机 g++ 上是空，但那是实现给的，不是标准保证的。「有效但未指定」不等于「一定是空」。` },
        { id: `q5`, type: `multi`, score: 12,
          stem: `下列说法对的是？（多选，错勾任何一项整题 0 分）`,
          options: [`对 const 对象写 std::move，实测还是会走复制`, `vector 移动时只交接手里那几个数，跟元素个数无关`, `std::move 之后原件的内容还完整留着，只是多了一份`, `移动 int 这种小东西，通常并不比复制省`],
          answers: [0, 1, 3],
          why: `第三条把移动当成了复制。实测那一版跑完 const 的原件仍有 3 个，一个字节都没搬走。` },
        { id: `q6`, type: `code`, score: 12, coversTask: 1,
          stem: `（任务题）写一句打印：把搬空之后的 a 还剩多少个、里面是什么，一次打出来。`,
          acceptRegex: [`println`, `a\\.size\\s*\\(`],
          why: `任务要的是「打印原字符串内容」，个数和内容都交代上才算做完；这门课的输出只走 std::println。` },
        { id: `q7`, type: `blank`, score: 8, coversTask: 1,
          stem: `标准给被搬空那个对象的承诺是六个字：有效但未____。`,
          accept: [`指定`, `确定`, `没有规定`],
          why: `有效 —— 能析构、能重新赋值；未指定 —— 里面是什么没保证，所以搬完只许重新装，不许读旧内容。` },
        { id: `q8`, type: `choice`, score: 12,
          stem: `下面哪种交接最该写成移动，而不是复制？`,
          options: [`把一个 int 交给一个函数`, `把一个装着一百万个元素的 vector 交出去，而且以后再也不碰它`, `拿两个 Score 比大小`, `把一个 const std::string 交给函数`],
          answer: 1,
          why: `移动划算的前提是对象自己管着一大块内存，并且原件确实不再用。第四个搬不动，只能抄。` }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: `std::string b = a;\n    std::string c = std::move(a);`, q3: `b 有 5000 个，前三个是「xxx」\nc 有 5000 个，前三个是「xxx」\na 剩 0 个，内容是「」`, q4: 1, q5: [0, 1, 3], q6: `std::println("a 剩 {} 个，内容是「{}」", a.size(), a);`, q7: `指定`, q8: 1 }
        ],
        wrongs: [
          { q1: 0, q2: `std::string b = std::move(a);\n    std::string c = a;`, q3: `b 有 0 个，前三个是「」\nc 有 5000 个，前三个是「xxx」\na 剩 5000 个，内容是「xxxxx」`, q4: 2, q5: [1, 2], q6: `std::cout << a << std::endl;`, q7: `空`, q8: 3 }
        ],
        loose: [
          { q1: `1`, q2: `string  b  =  a ;\nstd::string  c = std::move ( a ) ;`, q3: ` b 有 5000 个，前三个是「xxx」 \n  c 有 5000 个，前三个是「xxx」\na 剩 0 个，内容是「」 `, q4: `1`, q5: [3, 1, 0], q6: `std::println("{}", a.size());`, q7: ` 未指定 `, q8: `1` }
        ]
      }
    },
    {
      cid: `m134`, kind: `paper`, pass: 60,
      task: `任务题目：给 Tracker 补写析构函数打印「打扫」，跑一遍看 a、b、c 的打扫顺序，并说清最后一行为为什么是空的`,
      hint: `想不起来就回看本课【演示 2 · 本课任务：加一句析构，数清打扫顺序】与【演示 3】那两组输出。`,
      questions: [
        { id: `q1`, type: `choice`, score: 12,
          stem: `移动构造的参数为什么不能写成带 const 的那种？`,
          options: [`带了 const 就抹不动原件，这一行只能退回拷贝构造，等于什么都没搬`, `语法上不允许这么写`, `移动构造不许改任何内存`, `const 只能写在返回值前面`],
          answer: 0,
          why: `移动要写原件、把它手里那块内存抹空。第 133 课实测过：对 const 对象 std::move，跑完原件仍有 3 个。` },
        { id: `q2`, type: `code`, score: 18, coversTask: 1,
          stem: `（任务题）写出你按本课任务补的那个析构函数：打印一句「打扫」，并带上成员 name_。`,
          acceptRegex: [`~\\s*Tracker`, `打扫`],
          why: `析构是波浪号加类名、不带参数也不写返回类型。这一句的作用就是把「谁被打扫、按什么顺序」打印出来。` },
        { id: `q3`, type: `output`, score: 14, coversTask: 1,
          stem: `带析构那一版跑完一共六行，把它们原样写出来（一行一个）。main 是：Tracker a("A"); Tracker b = a; Tracker c = std::move(a); 然后打印 b.name() 与 c.name()。`,
          acceptLines: [`[拷贝] 抄了一份 A`, `[移动] 整屋搬走 A`, `b = A的复印件, c = A`, `[打扫] 「A」`, `[打扫] 「A的复印件」`, `[打扫] 「」`],
          why: `打扫按出生的反序走：先 c、再 b、最后 a；轮到 a 时它手里已经没有内存，名字也就是空的。` },
        { id: `q4`, type: `choice`, score: 12,
          stem: `类里只写移动构造、完全不写拷贝构造，一句 Tracker b = a; 会怎样？`,
          options: [`静悄悄地走复制`, `报 use of deleted function 'constexpr Tracker::Tracker(const Tracker&)' —— 手写移动会取消默认拷贝`, `自动把 a 搬空给 b`, `合法，但 b 里面是空的`],
          answer: 1,
          why: `这是第 118 课那句「几件套要成套写」的实际长相，实测报错原话就是这一句。` },
        { id: `q5`, type: `multi`, score: 12,
          stem: `关于演示 3 那两组输出，说法对的是？（多选，错勾任何一项整题 0 分）`,
          options: [`带 noexcept 时，容器换那块更大的内存走的是移动`, `把 noexcept 删掉，换内存就退回到拷贝`, `把 noexcept 删掉会让程序算错结果`, `noexcept 管的是别人敢不敢用这扇门，不管这一行能不能编译`],
          answers: [0, 1, 3],
          why: `删掉之后结果仍然正确，只是慢：甲被抄了两遍，容器里成了 甲的复印件的复印件。` },
        { id: `q6`, type: `code`, score: 12, coversTask: 1,
          stem: `写出 Tracker 移动构造那一行的签名部分：参数接住「可以搬走」的那个对象，并挂上那句保证。`,
          acceptRegex: [`Tracker\\s*\\(\\s*Tracker\\s*&&`, `noexcept`],
          why: `两个 & 连写、参数不带 const、再挂 noexcept —— 三者齐了，容器才敢在换内存时真的搬你。` },
        { id: `q7`, type: `blank`, score: 10, coversTask: 1,
          stem: `a 被搬空之后照样会被正常打扫，所以「搬空」不等于____。`,
          accept: [`销毁`, `析构`, `回收`, `删除`],
          why: `搬走的是那块内存的所有权，对象本身还活着，退出作用域时它的析构照跑一遍。` },
        { id: `q8`, type: `output`, score: 10,
          stem: `不带 noexcept 那一版跑完，「容器 3 个」后面那三行是什么？（一行一个）`,
          acceptLines: [`甲的复印件的复印件`, `乙的复印件`, `丙`],
          why: `甲被抄了两遍（两次换内存都轮到你）、乙一遍、丙最后一次才进去所以没被抄 —— 名字上的疤就是路径的证据。` }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: `~Tracker() { std::println("  [打扫] 「{}」", name_); }`, q3: `  [拷贝] 抄了一份 A\n  [移动] 整屋搬走 A\nb = A的复印件, c = A\n  [打扫] 「A」\n  [打扫] 「A的复印件」\n  [打扫] 「」`, q4: 1, q5: [0, 1, 3], q6: `Tracker(Tracker&& o) noexcept : name_(std::move(o.name_)) {}`, q7: `销毁`, q8: `甲的复印件的复印件\n乙的复印件\n丙` }
        ],
        wrongs: [
          { q1: 2, q2: `Tracker() { std::println("打扫"); }`, q3: `[拷贝] 抄了一份 A\n[移动] 整屋搬走 A\nb = A, c = A的复印件\n[打扫] 「」\n[打扫] 「A的复印件」\n[打扫] 「A」`, q4: 0, q5: [0, 2], q6: `Tracker(const Tracker& o) noexcept { }`, q7: `搬走`, q8: `甲\n乙\n丙` }
        ],
        loose: [
          { q1: `0`, q2: `~ Tracker ( ) {  std::println ( "打扫 {}", name_ ) ; }`, q3: ` [拷贝] 抄了一份 A \n[移动]   整屋搬走 A\n  b = A的复印件, c = A\n[打扫] 「A」\n  [打扫] 「A的复印件」\n[打扫] 「」 `, q4: `1`, q5: [3, 1, 0], q6: `Tracker  (  Tracker && other )  noexcept  {  }`, q7: ` 销毁 `, q8: ` 甲的复印件的复印件 \n乙的复印件 \n 丙` }
        ]
      }
    },
    {
      cid: `m135`, kind: `paper`, pass: 60,
      task: `任务题目：在 by_value 里改 s 试试能不能过；再到 by_const_ref 里改同一句，看编译器拦不拦，把报错那两句读顺`,
      hint: `想不起来就回看本课【演示 2 · 本课任务：往两个函数里各改一句】与【演示 3 · 三种传法各调一次，让类自己数】。`,
      questions: [
        { id: `q1`, type: `choice`, score: 12,
          stem: `void by_value(std::string s) 每被调用一次，机器多干了什么？`,
          options: [`什么都没多，s 只是原件的另一个名字`, `申请一块内存把整串抄进去，函数返回时再把它打扫掉`, `只是多写一个指针`, `把原件搬进函数，调用者之后不能再用它`],
          answer: 1,
          why: `传值那个 s 是一个新对象。第 133 课那本账在这里换了记账单位：从「一行赋值」变成「一次调用」，调一万次就抄一万次。` },
        { id: `q2`, type: `code`, score: 20, coversTask: 1,
          stem: `（任务题）在 by_value 的函数体里加一句：往那份副本 s 的末尾追加一段文字。写出那一句。`,
          acceptRegex: [`s\\s*\\+=`],
          why: `这一句在传值那侧合法，改的是副本；跑完 main 里的原件一个字没变，这就是任务要你亲手确认的事。` },
        { id: `q3`, type: `choice`, score: 14, coversTask: 1,
          stem: `同一句追加写进 by_const_ref，实测报 no match for 'operator+='，紧跟的 note 是 passing 'const std::string*' as 'this' argument discards qualifiers。这句报错说明什么？`,
          options: [`const 引用只读不写，这个承诺由编译器在编译期验收`, `s 在这里已经出了作用域`, `std::string 根本不支持追加`, `把追加换成拼接就能改动了`],
          answer: 0,
          why: `拦的是「写」这个动作，读 s.size()、拿去比较都合法。这跟第 114 课那条 const 方法里写不了成员是同一条规矩的另一头。` },
        { id: `q4`, type: `output`, score: 12,
          stem: `源稿那段跑出来三行打印什么？（一行一个）main 里 long_text 是那串弹幕，先 by_value(long_text)，再 by_const_ref(long_text)，最后打印原件。`,
          acceptLines: [`传值:   收到「这是一条很长的弹幕……」`, `传引用: 收到「这是一条很长的弹幕……」`, `原件还在: 这是一条很长的弹幕……`],
          why: `前两行内容一字不差 —— 从输出上你根本看不出第一个函数多抄了一份，这正是本课要治的病。` },
        { id: `q5`, type: `multi`, score: 10,
          stem: `按源稿那条口诀，参数搭配正确的是？（多选，错勾任何一项整题 0 分）`,
          options: [`只读原件 → 参数写 const std::string&`, `要改原件 → 参数写 std::string&`, `明确不要原件了 → 参数写值，调用处配 std::move`, `不分大小，所有参数一律写 const 引用最省`],
          answers: [0, 1, 2],
          why: `八个字节的小东西传值更快，绕一层引用反而多一道间接；那条口诀管的是自己管内存的大对象。` },
        { id: `q6`, type: `code`, score: 14, coversTask: 1,
          stem: `写一个专门改原件的函数 shout：参数是 std::string 的普通引用，函数体里往末尾追加文字。写出参数那一处和函数体里那句追加。`,
          acceptRegex: [`std::string\\s*&`, `\\+=`],
          why: `普通引用是改原件的唯一正门。实测这么写完调用一次，main 里的原件真变成了 开会！！！ —— 改动落在原件身上。` },
        { id: `q7`, type: `blank`, score: 8, coversTask: 1,
          stem: `演示 3 里传值那一档那个会喊话的类响了一声拷贝，传 const 引用那一档一声不响 —— 没有声音就是没有____。`,
          accept: [`复制`, `拷贝`, `抄写`],
          why: `零抄写的证据不是「看起来快」，而是类里那一嗓子根本没响 —— 这就是第 134 课那套装喇叭的用场。` },
        { id: `q8`, type: `output`, score: 10,
          stem: `演示 3 跑完，最后一行打印什么？（一行）`,
          acceptLines: [`原件现在剩：「」`],
          why: `by_value(std::move(a)) 把原件搬空了。交出去之后还拿 a 干活，就是第 133 课那条坑换到调用者身上。` }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: `s += "再加一句";`, q3: 0, q4: `  传值:   收到「这是一条很长的弹幕……」\n  传引用: 收到「这是一条很长的弹幕……」\n原件还在: 这是一条很长的弹幕……`, q5: [0, 1, 2], q6: `void shout(std::string& s) { s += "！！！"; }`, q7: `复制`, q8: `原件现在剩：「」` }
        ],
        wrongs: [
          { q1: 0, q2: `std::string s;`, q3: 3, q4: `传值: 收到「」\n传引用: 收到「」\n原件还在: `, q5: [2, 3], q6: `void shout(std::string s) { std::println(s); }`, q7: `声音`, q8: `原件现在剩：「报表」` }
        ],
        loose: [
          { q1: `1`, q2: `s  +=  "后面还想加的话" ;`, q3: `0`, q4: ` 传值: 收到「这是一条很长的弹幕……」 \n  传引用:  收到「这是一条很长的弹幕……」\n  原件还在: 这是一条很长的弹幕…… `, q5: [1, 2, 0], q6: `void shout( std::string &  s ){\n  s  +=  "!!" ;\n}`, q7: ` 拷贝 `, q8: ` 原件现在剩：「」 ` }
        ]
      }
    },
    {
      cid: `m136`, kind: `paper`, pass: 60,
      task: `任务题目：把演示 1 里的元素从一百万个改成一千个再跑一次，看移动那一行是不是依旧几乎是 0，并说清复制那行为什么跟着缩`,
      hint: `想不起来就回看本课【演示 2 · 本课任务：把元素改成一千个再跑】与【演示 3 · 换成纳秒：0 不见了】。`,
      questions: [
        { id: `q1`, type: `choice`, score: 12,
          stem: `这段计时为什么要用 steady_clock 取时刻？`,
          options: [`因为它是走得最准的那个钟`, `因为 steady 说的是它只朝前走、不会因为系统时间被调而倒退，专管「隔了多久」`, `因为它能直接返回微秒数`, `因为标准库里只有这一个钟`],
          answer: 1,
          why: `量时长要一个不会倒退的参照。问「现在几点」是另一件事，那个钟可以被人为拨。` },
        { id: `q2`, type: `code`, score: 18, coversTask: 1,
          stem: `（任务题）按本课任务把演示 1 的元素个数改小一千倍：写出 main 里那一行 vector 的声明，其余一个字都不动。`,
          acceptRegex: [`vector<int>\\s+big\\s*\\(\\s*1'?000`],
          why: `任务只改这一行。元素个数从一百万掉到一千，复制那笔账立刻跟着掉，移动那行纹丝不动。` },
        { id: `q3`, type: `output`, score: 12, coversTask: 1,
          stem: `演示 1 那个程序（百万元素）跑出来，第二行打印什么？（一行）`,
          acceptLines: [`移动 1000000 个元素耗时 0 微秒`],
          why: `本机每一跑这一行都是 0。那个 0 是尺子的分辨率不够，不是零成本 —— 换成纳秒就是 66 到 129 纳秒。` },
        { id: `q4`, type: `choice`, score: 12, coversTask: 1,
          stem: `把元素改成一千个再跑，实测复制落到 1 到 2 微秒。哪句解释得对？`,
          options: [`移动那一行会变成 0.001 微秒`, `复制的账按元素个数走，个数缩一千倍它就跟着缩；移动从不看元素个数，所以一动不动`, `两个数都会缩一千倍`, `复制变小是因为编译器把活儿优化没了`],
          answer: 1,
          why: `移动只交接手里那几个数。而且加不加 -O2 数字都在同一档，也说明主角不是指令优化。` },
        { id: `q5`, type: `multi`, score: 12,
          stem: `关于这段计时，做法靠得住的是？（多选，错勾任何一项整题 0 分）`,
          options: [`同一份程序连跑几次，报中间那个，并把摆差一起说出来`, `两个 now 紧贴着要量的活儿，别把 println 夹在中间`, `把本机这组数字当常数抄进文档`, `第一次跑的数字先丢掉，冷跑往往偏高`],
          answers: [0, 1, 3],
          why: `本机三次实测是 2018、2021、2464 微秒，摆差接近两成；换机器、换负载还得重跑。` },
        { id: `q6`, type: `blank`, score: 8, coversTask: 1,
          stem: `微秒刻度下移动是 0。这个 0 不等于没有成本，只等于它低于这把尺子的最小____。`,
          accept: [`刻度`, `格`, `分辨率`],
          why: `汇报该说「实测低于一微秒，纳秒下是一百纳秒上下」，而不是「移动不花时间」。` },
        { id: `q7`, type: `choice`, score: 10,
          stem: `三个元素那一档实测复制 400 纳秒上下、移动 50 纳秒上下。该不该为了省这点钱把原件搬空？`,
          options: [`该，移动永远比复制快`, `不该 —— 不到四百纳秒的差价比不上一句函数调用，而搬空之后读原件是个真坑`, `无所谓，这两个数完全一样`, `不该，因为三个元素的 vector 根本没法移动`],
          answer: 1,
          why: `第 133 课那条「小对象别迷信移动」到这里有了数字：划不划算看的是对象自己管不管一大块内存，不是看有没有 std::move 这三个字。` },
        { id: `q8`, type: `code`, score: 16,
          stem: `写出计时的关键两句：用 steady_clock 取一个时刻，以及把两个时刻之差换算成微秒再取出数值。`,
          acceptRegex: [`steady_clock::now`, `duration_cast`],
          why: `chrono 那四步里最容易写坏的就是换算那一句：两个 time_point 相减，再用 duration_cast 换成要的单位。` }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: `std::vector<int> big(1'000, 1);`, q3: `移动 1000000 个元素耗时 0 微秒`, q4: 1, q5: [0, 1, 3], q6: `刻度`, q7: 1, q8: `auto t1 = std::chrono::steady_clock::now();\nstd::chrono::duration_cast<std::chrono::microseconds>(t2 - t1).count();` }
        ],
        wrongs: [
          { q1: 0, q2: `std::vector<int> big(1'000'000, 1);`, q3: `移动 1000000 个元素耗时 2018 微秒`, q4: 3, q5: [1, 2], q6: `成本`, q7: 0, q8: `auto t1 = time(NULL);` }
        ],
        loose: [
          { q1: `1`, q2: `std::vector<int>  big ( 1000 , 1 ) ;`, q3: ` 移动 1000000 个元素耗时 0 微秒 `, q4: `1`, q5: [3, 0, 1], q6: ` 分辨率 `, q7: `1`, q8: `auto a=std::chrono:: steady_clock :: now ( ) ;\nreturn std::chrono::duration_cast<std::chrono::microseconds>(b-a).count() ;` }
        ]
      }
    }
  ]
};
