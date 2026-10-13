/* 喵站 · C++ 入门 考卷分部 p20：第 64–66 课（第九轮 · 冒泡完整版 + 冒泡优化 + 传值 vs 传引用）
 *
 * 形状与硬指标照 cpp-exam/p13.js（cpp-exam-check 逐条对账）：
 *   1. kind:"paper"，题型只用笔试引擎认的六种；score 相加正好 100；
 *   2. 源稿每一条【任务】都有题用 coversTask 对着它，带 coversTask 的题合计 >=50 分；
 *   3. choice >=2；output >=1；每题带 why；
 *   4. selftest 的 refs 判 100、wrongs 判 <60、loose 判 >=60。
 *
 * 守的闸线：c64 卷面不出现标准库那个排序函数（它第 65 课才第一次和冒泡对照）；
 *           c65 卷面可以出现它，但 new、delete、智能指针、struct、class 三课都不碰；
 *           c66 只考传值与传引用的对照，指针不碰。
 *           读者看得见的字段一律用中文括号，函数名裸写。
 *
 * 验收：node dev/tools/cpp-exam-check.cjs --only c64,c65,c66
 */
window.MIAO_CPP_EXAM_P20 = {
  papers: [
    {
      cid: "c64", kind: "paper", pass: 60,
      title: "第 64 课考试 · 冒泡完整版：一轮一轮排到底",
      task: "任务题目：用写好的 bubble_sort 分别排空数组 {} 和单元素 {42}，确认程序不崩，再说清循环条件写成 i + 1 < v.size 为什么比写成 i < v.size - 1 安全",
      hint: "想不起来就回看正文【演示 3】那三行不崩的输出、【常见坑】前两条关于边界，还有那张一轮一行的示意图。",
      questions: [
        { id: "q1", type: "output", score: 16,
          coversTask: 1,
          stem: "这段程序打印什么？（一行一条，两行）\nvoid bubble_sort(std::vector<int>& v) {\n    for (size_t i = 0; i + 1 < v.size(); i++)\n        for (size_t j = 0; j + 1 < v.size() - i; j++)\n            if (v[j] > v[j + 1]) std::swap(v[j], v[j + 1]);\n}\nint main() {\n    std::vector<int> a = {};\n    std::vector<int> b = {42};\n    bubble_sort(a);\n    bubble_sort(b);\n    std::println(\"a 的个数 {} b 的个数 {}\", a.size(), b.size());\n    std::println(\"b = {}\", b);\n}",
          acceptLines: ["a 的个数 0 b 的个数 1", "b = [42]"],
          why: "空数组时外层那句 0 + 1 < 0 一上来就是 false，循环一圈都不转，函数直接结束；单元素同理，外层 0 + 1 < 1 也是 false，b 里那个 42 一动没动。两行都正常打出来，一次崩溃都没有 —— 这就是任务要的「确认不崩」。" },
        { id: "q2", type: "choice", score: 14,
          coversTask: 1,
          stem: "同样是空数组，把外层条件改成 i < v.size - 1 就出问题。最下面的说法哪一条讲对了根因？",
          options: ["v.size 的类型是无符号的 size_t，0 减 1 不等于 -1 而是翻成一个巨大的数，条件一直成立，循环一路越界", "空数组不能取地址，编译器会直接拒绝这行代码", "v.size - 1 里的减号必须写成空格包着的形式", "空数组会让 std::swap 罢工，报错里带 swap 那几个字"],
          answer: 0,
          why: "无符号整数不许为负，减法回绕成天文数字，于是 i 的循环转到天荒地老，直到读越界崩溃。写成 i + 1 < v.size 是左边加一、右边不动，全程不做那步减法，空串自然安全。" },
        { id: "q3", type: "choice", score: 10,
          stem: "五个数交给本课这段 bubble_sort，外层最多走几轮？",
          options: ["4 轮", "5 轮", "3 轮", "要看数据乱成什么样才知道"],
          answer: 0,
          why: "外层是 i + 1 < v.size，i 取 0 到 3，正好 n-1 轮。走完 n-1 轮就送走 n-1 个归位的数，剩下那一个自然落在最后一格，所以最少的轮数跟数据长什么样无关 —— 这一点到下一课才会被改动。" },
        { id: "q4", type: "code", score: 12,
          coversTask: 1,
          stem: "补出内层循环的判断条件那一段：它要比紧挨着的两格 v[j] 和 v[j + 1]，并且一条加一减法都不做。",
          acceptRegex: ["j\\s*\\+\\s*1\\s*<"],
          why: "写成 j + 1 < v.size - i：上界是「加一的那个下标」跟长度比，减法留在左边。要是嫌麻烦写成 j < v.size - i，j + 1 就会撞上归位区外面那一格，读越界。" },
        { id: "q5", type: "blank", score: 8,
          stem: "v.size 拿到的是那种只能装非负数的整数，它的类型名写作____。（写标准库给的那个名字）",
          accept: ["size_t", "size_t类型", "std::size_t"],
          why: "size() 的返回类型就是 size_t。记住它是无符号的，才能在每一次减法前面停一秒：这个 0 减下去会变成什么。" },
        { id: "q6", type: "order", score: 14,
          coversTask: 1,
          stem: "把外层某一轮里依次发生的事排成正确顺序。",
          steps: ["一路比到本轮的最后一对，也就是内层上界之前的那两格", "先比最靠左的一对：v[0] 和 v[1]，前大后就 std::swap", "本轮最大的那个已经停在归位区的最左一格，内层上界就此少一", "j 每次加一，接着比 v[1] 和 v[2]、v[2] 和 v[3]"],
          answer: [1, 3, 0, 2],
          why: "一轮就是从最左那对开始，相邻两格一路往右推；推到本轮上界为止，本轮最大值刚好落到归位区的第一格，下一轮就少比一格。第三条那句「上界少一」是本轮结束才成立的事，不能提前。" },
        { id: "q7", type: "multi", score: 14,
          stem: "关于本课这个完整的 bubble_sort，下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["参数那个 & 去掉之后，函数里排好了，外面的串却一动没动", "内层条件里的减 i 是为了跳过右边已经归位的那些数", "函数返回类型是 void，因为它改的是递进去的那一串本身，不另外交货", "手写交换时不必准备临时盒子，两个格子互相赋值一次就够了"],
          answers: [0, 1, 2],
          why: "第四条正是丢数据的那条错路：第一句赋值就把原值盖掉了，第二句还回去的是已经改过的值，两格变成同一个数。前三条说的是引用参数、归位区、void 这三件本课的关键事。" },
        { id: "q8", type: "choice", score: 12,
          stem: "有人把 bubble_sort 写完，喊完之后打印原串，发现一个顺序都没变。编译器和运行都没报过错。最可能的原因是哪一条？",
          options: ["参数写成了 std::vector<int> v，函数辛苦排的是复印件", "内层循环的上界少写了一个数", "忘记在文件顶上 include vector", "空数组那条分支没写 if 保护"],
          answer: 0,
          why: "少了 & 就是传值：语法完全合法，编译器没有理由拦你，可改动出不了那个函数。这一条是纯逻辑错，只能靠「函数里加一句打印」这种现场手段抓出来。" }
      ],
      selftest: {
        refs: [
          { q1: "a 的个数 0 b 的个数 1\nb = [42]", q2: 0, q3: 0, q4: "for (size_t j = 0; j + 1 < v.size() - i; j++)", q5: "size_t", q6: [1, 3, 0, 2], q7: [0, 1, 2], q8: 0 }
        ],
        wrongs: [
          { q1: "a 的个数 1 b 的个数 1\nb = [42]", q2: 3, q3: 1, q4: "for (size_t j = 0; j < v.size() - i; j++)", q5: "int", q6: [1, 0, 2, 3], q7: [0, 3], q8: 1 }
        ],
        loose: [
          { q1: " a 的个数 0 b 的个数 1\nb = [42]\n", q2: "0", q3: "0", q4: "j+1 < v.size()-i", q5: "SIZE_T", q6: [1, 3, 0, 2], q7: [2, 1, 0], q8: "0" }
        ]
      }
    },
    {
      cid: "c65", kind: "paper", pass: 60,
      title: "第 65 课考试 · 冒泡优化：没交换就提前收工",
      task: "任务题目：给冒泡装上 swapped 开关，然后拿 {1, 2, 3, 5, 4} 排一遍，想想它走了几轮就提前停了；同一串再交给 std::sort 排一次，对比两件事各干什么",
      hint: "想不起来就回看正文【演示 2】那行数轮的打印、【演示 1】里那句 break 站的位置，还有【常见坑】头两条。",
      questions: [
        { id: "q1", type: "output", score: 16,
          coversTask: 1,
          stem: "这段程序打印什么？（就一行）\nstd::vector<int> v = {1, 2, 3, 5, 4};\nsize_t rounds = 0;\nfor (size_t i = 0; i + 1 < v.size(); i++) {\n    bool swapped = false;\n    for (size_t j = 0; j + 1 < v.size() - i; j++)\n        if (v[j] > v[j + 1]) { std::swap(v[j], v[j + 1]); swapped = true; }\n    rounds++;\n    if (!swapped) break;\n}\nstd::println(\"走了 {} 轮，排成 {}\", rounds, v);",
          acceptLines: ["走了 2 轮，排成 [1, 2, 3, 4, 5]"],
          why: "第 1 轮只有最后一对 5 和 4 是倒着的，换完串就已经全对，标志是 true 所以继续；第 2 轮三对全和气、一次没换，标志还是本轮开头的 false，break 收工。上一课的写法在这里要走满四轮。" },
        { id: "q2", type: "choice", score: 14,
          coversTask: 1,
          stem: "下面四种把 swapped 放位置的写法，哪一种真的能让程序提前收工？",
          options: ["写在外层的花括号里第一行，每一轮重新赋值成 false", "写在函数开头，整个循环只声明并赋值一次", "写在内层的花括号里，每比一对就重新赋值成 false", "写在 break 那句后面，反正一轮结束才用得上"],
          answer: 0,
          why: "开关是「一轮一份」的账：每轮开头擦干净，本轮换过就涂 true，一轮结束验收。写在函数开头会一直挂着第一轮那个 true；写在内里则每比一对就抹掉证据，永远查不出「整轮零交换」；写在 break 后面根本来不及。" },
        { id: "q3", type: "choice", score: 10,
          stem: "为什么「这一轮一次交换都没发生」就能断定整串已经排好？",
          options: ["因为冒泡的一轮会把相邻的每一对都看一遍，全都前小后大，就再也藏不住倒着的对", "因为没交换就说明数组是空的", "因为外层已经走满了 n-1 轮", "因为 std::swap 失败了会返回 false"],
          answer: 0,
          why: "关键在「一轮看完所有相邻对」这件事。相邻全服帖，隔远的更服帖：想藏一个倒着的对，它左右必然先撞出一对不服气的，那就必然换来一次交换。所以零交换不是猜测，是证据。" },
        { id: "q4", type: "code", score: 12,
          coversTask: 1,
          stem: "补出那句提前收工：本轮一次都没换，就跳出外层循环。",
          acceptRegex: ["if\\s*\\(\\s*!\\s*swapped"],
          why: "写法是 if (!swapped) break; —— 叹号读作「非」，标志还是 false 才收工。这句要在内层花括号之外、外层花括号之内，一轮比完才有验收的资格。" },
        { id: "q5", type: "blank", score: 8,
          stem: "想用 std::sort，就得在文件顶上先把____这个头文件请进来。（填头文件名，不带尖括号）",
          accept: ["algorithm", "include algorithm", "头文件 algorithm"],
          why: "std::sort 住在 algorithm 里，不在 print 或 vector 那些头文件中。漏了它，报错长相是 use of undeclared identifier 'sort'，或者 no member named 'sort' in namespace 'std'。" },
        { id: "q6", type: "choice", score: 12,
          stem: "std::sort(v.begin(), v.end()) 排完之后，排好的数在哪里？",
          options: ["还在原来那只 vector 里，它改的是你递进去的那一段", "还回来一只全新的 vector，得用 auto 接住", "只存在 begin 指的那一格", "还回来一个 bool，告诉你有没有动过"],
          answer: 0,
          why: "它和 bubble_sort 一样是「改货不交货」：返回类型是 void，两个边界只是圈出范围，改动直接落在原容器上。这一点跟第 55 课那种靠 return 交货的零件正好是两种风格。" },
        { id: "q7", type: "multi", score: 14,
          stem: "关于这一课的开关和 std::sort，下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["开关把最好情况砍到一轮，最坏情况仍然是 n-1 轮", "已经排好的那一串，交给带开关的冒泡只需一轮就收工", "swapped 只要在外层出现过一次就够了，不必每轮重新写 false", "内层里任何一次 std::swap 之后都得紧跟一句 swapped = true"],
          answers: [0, 1, 3],
          why: "第三条正是那个不报错的陷阱：一轮一份新黑板，沿用老账会让判断永远不成立。其余三条说的是开关的收益边界、最好情况的收益，以及记笔记的那一笔。" },
        { id: "q8", type: "order", score: 14,
          coversTask: 1,
          stem: "把「外层带着开关走一轮」里依次发生的事排成正确顺序。",
          steps: ["换过一次，就紧跟着把标志涂成 true", "本轮开头，先写 bool swapped = false", "一轮比完再看标志：还是 false 就 break，否则进入下一轮", "内层一路比相邻两格，前大后就 std::swap"],
          answer: [1, 3, 0, 2],
          why: "先擦黑板，再一路比相邻，每换一次记一笔，整轮比完才有资格验收 —— 验收那句必须落在内层之外，顺序一乱，开关就查不出「整轮零交换」。" }
      ],
      selftest: {
        refs: [
          { q1: "走了 2 轮，排成 [1, 2, 3, 4, 5]", q2: 0, q3: 0, q4: "if (!swapped) break;", q5: "algorithm", q6: 0, q7: [0, 1, 3], q8: [1, 3, 0, 2] }
        ],
        wrongs: [
          { q1: "走了 4 轮，排成 [1, 2, 3, 4, 5]", q2: 1, q3: 3, q4: "if (swapped) break;", q5: "vector", q6: 1, q7: [0, 2], q8: [1, 0, 3, 2] }
        ],
        loose: [
          { q1: "走了  2 轮， 排成 [1, 2, 3, 4, 5]", q2: "0", q3: 0, q4: "if(!swapped){break;}", q5: "ALGORITHM", q6: 0, q7: [3, 1, 0], q8: [1, 3, 0, 2] }
        ]
      }
    }
  ]
};
