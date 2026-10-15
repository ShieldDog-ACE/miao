/* 喵站 · C++ 掌握 考卷分部 p32：第 183–186 课（笔试引擎，题型字段照 exam-paper.js）
 * 规矩与 cppm-exam/p01.js 完全一致：每场 7–8 题、score 合计 100、choice ≥2、output ≥1、
 * 源稿任务全覆盖（coversTask）、每题带 why、selftest refs 判满 / wrongs 不到及格 / loose 及格以上。
 */
window.MIAO_CPPM_EXAM_P32 = {
  papers: [
    {
      cid: "m183", kind: "paper", mode: "ide", authored: "684ee4eb", file: "main.cpp", pass: 60, title: "第 183 课考试 · 链表是什么", task: "任务题目：用 make_unique 造出一条 10 → 20 → 30 → 40 的链，接上第 4 站 40，并顺着纸条把整条链打印出来", hint: "想不起来就回看本课【演示 1】（建链）与【演示 2】（接第 4 站）。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 29, coversTask: 1, stem: "（任务题）链已建到 30，a 是头节点。写一行：把第 4 站 40 接上去。", acceptRegex: ["\\w+\\s*->\\s*next\\s*->\\s*next\\s*->\\s*next\\s*=\\s*(std::)?make_unique\\s*<\\s*Node\\s*>\\s*\\(\\s*40\\s*\\)"], acceptOn: "code", sample: "a->next->next->next = std::make_unique<Node>(40);", why: "要接在 30 后面，得从 a 连穿三层 ->next 再赋值；少一层就把纸条接到队伍中间去了。" },
        { id: "q2", type: "code", score: 22, coversTask: 1, stem: "（任务题）写出走链的 for 循环：p 从头出发、纸条空白就停、每步跳到下一站，循环体里打印 p->value。", acceptRegex: ["for\\s*\\(\\s*Node\\s*\\*\\s*p\\s*=\\s*\\w+\\.get\\s*\\(\\s*\\)\\s*;\\s*p\\s*;\\s*p\\s*=\\s*p\\s*->\\s*next\\.get\\s*\\(\\s*\\)\\s*\\)"], acceptOn: "code", sample: "for (Node* p = a.get(); p; p = p->next.get()) std::print(\"{} → \", p->value);", why: "三个分号段各管出发、停步、前进；停步条件是 p 本身非空。" },
        { id: "q3", type: "code", score: 26, coversTask: 1, stem: "写出这个节点长什么样的声明：名字是 Node，里面装一个整数宝藏 value，再加一张写着下一站地址的纸条 next（纸条由独占的智能指针打理，类型指向 Node 自己）。", acceptRegex: ["struct\\s+Node\\s*\\{", "int\\s+value\\s*;", "std\\s*::\\s*unique_ptr\\s*<\\s*Node\\s*>\\s+next\\s*;"], acceptOn: "code", sample: "struct Node { int value; std::unique_ptr<Node> next; };", why: "链表节点的全部家当就这两行：一个值、一张指向同类型节点的纸条。纸条用独占指针管，所以下一站销毁时不会漏内存，也不用自己写释放。" },
        { id: "q4", type: "code", score: 23, coversTask: 1, stem: "a 已经是装着 10 的头节点。写一行：在堆上造一个装着 20 的新节点，并把 a 的纸条指向它。", acceptRegex: ["a\\s*->\\s*next\\s*=", "make_unique\\s*<\\s*Node\\s*>\\s*\\(\\s*20\\s*\\)"], acceptOn: "code", sample: "a->next = std::make_unique<Node>(20);", why: "箭头是纸条的用法：a->next 就是「a 那张纸条」，右边造出新节点交进去，所有权随之过户；这一跳接上了，后面才能一路穿到 30、40。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <memory>\nint main() {\n    a->next->next->next = std::make_unique<Node>(40);\n    for (Node* p = a.get(); p; p = p->next.get()) std::print(\"{} → \", p->value);\n    struct Node { int value; std::unique_ptr<Node> next; };\n    a->next = std::make_unique<Node>(20);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "a->next->next = std::make_unique<Node>(40);",
          "for (Node* p = a.get(); p->next; p = p->next.get()) std::print(\"{} → \", p->value);",
          "struct Node {\n    int value;\n    Node* next;\n};",
          "a->next->next = std::make_unique<Node>(20);"],
        loose: [
          "#include <print>\n#include <memory>\nint main() {\n    a -> next -> next -> next = std::make_unique<Node>( 40 );\n    for(Node* p=a.get(); p; p=p->next.get()) { std::print(\"{} → \", p->value); }\n    struct  Node\n    {\n    int  value  ;\n    std  ::  unique_ptr < Node >  next  ;\n    }  ;\n    a  ->  next  =  std  ::  make_unique <  Node  >(  20  )  ;\n    return 0;\n}\n"]
      }
    },
    {
      cid: "m184", kind: "paper", mode: "ide", authored: "e2197017", file: "main.cpp", pass: 60, title: "第 184 课考试 · 链表插队：只改纸条", task: "任务题目：在 30 → 35 → 40 的链里，用两张纸条把 37 插到 35 和 40 中间，插完全程不挪其他节点", hint: "回看本课【演示 2】（插 37 的两行纸条）与【演示 3】（顺序反了的下场）。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 36, coversTask: 1, stem: "（任务题）链是 30 → 35 → 40，again 是造好的 37 节点。写两行改纸条，把 37 插进 35 和 40 中间。", acceptRegex: ["\\w+\\s*->\\s*next\\s*=\\s*std::move\\s*\\(\\s*head\\s*->\\s*next\\s*->\\s*next\\s*\\)", "head\\s*->\\s*next\\s*->\\s*next\\s*=\\s*std::move\\s*\\(\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "again->next = std::move(head->next->next); head->next->next = std::move(again);", why: "纸条一 37 接上 40（移走 head->next->next 的管辖权），纸条二 35 改指 37；顺序反了 40 会凭空消失。" },
        { id: "q2", type: "code", score: 32, coversTask: 1, stem: "链现在是 30 → 40，newbie 是造好的 35 节点。写一行先接的那张纸条：让 newbie 指向 40，管辖权必须明说移交。", acceptRegex: ["newbie\\s*->\\s*next\\s*=", "std\\s*::\\s*move\\s*\\(\\s*head\\s*->\\s*next\\s*\\)"], acceptOn: "code", sample: "newbie->next = std::move(head->next);", why: "插队是两张纸条的事，而顺序要「先接后断」：先让新节点接住后面那一站的管辖权，前面那站才敢改指新节点。少了 move 就是想给独占指针复印，编译器当场拦下。" },
        { id: "q3", type: "code", score: 32, coversTask: 1, stem: "插完之后验一遍：写一行 for，从头节点出发，当前站存在就继续，每步顺着纸条跳到下一站。循环体里把这一站的数值打成「数 → 」的样子（也可以只写 for 这一行）。", acceptRegex: ["for\\s*\\(\\s*Node\\s*\\*\\s*p\\s*=\\s*\\w+\\s*\\.\\s*get\\s*\\(\\s*\\)", ";\\s*p\\s*;", "p\\s*=\\s*p\\s*->\\s*next\\s*\\.\\s*get\\s*\\(\\s*\\)"], acceptOn: "code", sample: "for (Node* p = head.get(); p; p = p->next.get()) std::print(\"{} → \", p->value);", why: "get() 是「我只看一眼、不抢所有权」：借一个裸指针来走路，链的归属还在 head 手里。停步条件写 p 本身，最后一站的纸条是空的，走到它就自然停下。" }
      ],
      selftest: {
        refs: [
          "#include <print>\nint main() {\n    again->next = std::move(head->next->next); head->next->next = std::move(again);\n    newbie->next = std::move(head->next);\n    for (Node* p = head.get(); p; p = p->next.get()) std::print(\"{} → \", p->value);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "again->next = std::move(head->next); head->next = std::move(again);",
          "newbie->next = head->next;",
          "for (Node* p = head.get(); p->next; p = p->next.get()) std::print(\"{} → \", p->value);"],
        loose: [
          "#include <print>\nint main() {\n    again->next = std::move( head->next->next ); head->next->next = std::move( again );\n    newbie  ->  next  =  std  ::  move  (  head -> next  )  ;\n    for  (  Node  *  p  =  head . get ( )  ;  p  ;  p = p -> next . get ( )  )\n    {  std::print(\"{} → \", p->value);  }\n    return 0;\n}\n"]
      }
    },
    {
      cid: "m185", kind: "paper", mode: "ide", authored: "811de87e", file: "main.cpp", pass: 60, title: "第 185 课考试 · 反转整条链", task: "任务题目：用三步舞把 1 → 2 → 3 整条倒成 3 → 2 → 1，并在纸上画清每轮循环后 prev 与 head 各指哪里", hint: "回看本课【演示 2】（每轮状态的实测打印），先画再核对。",
      notes: ["纸条一改指回去，通往后面的路就断了，得先抄在手里，这是三步舞第一步的理由。", "每轮 prev 收编一个节点，head 走空时它攥着全部，正是倒好后的头；这时再用 head 接着走链已经晚了。", "循环条件误写成 head->next，走到最后一站时它的纸条是空的，循环提前收工，输出停在 2 到 1。", "整条反转一个新节点都不造、一个都不销毁，动的全是纸条。", "unique_ptr 独占手里那份所有权，不能拷贝；直接复印会造出两个都以为攥着同一个节点的 unique_ptr，语言层面就禁止。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "先有一个节点的样子：写一个 struct Node，里面装一个 int value，再装一张指向下一站的纸条（用 unique_ptr 管下一个 Node）。", acceptRegex: ["struct\\s+Node", "\\bint\\s+value", "unique_ptr\\s*<\\s*Node\\s*>\\s+next"], acceptOn: "code", sample: "struct Node {\n    int value;\n    std::unique_ptr<Node> next;\n};", why: "纸条就是 next：整条链靠它一节挂一节，反转动的全是这些纸条，节点本身一个也不挪。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条的主体：开出 prev 这个空盒子装已倒好的部分，再用 while (head) 一路走完；每一轮第一步先把下一站抄进一个变量，抄的时候必须用 std::move。", acceptRegex: ["std::unique_ptr\\s*<\\s*Node\\s*>\\s+prev", "while\\s*\\(\\s*head\\s*\\)", "auto\\s+\\w+\\s*=\\s*std::move\\s*\\(\\s*head\\s*->\\s*next\\s*\\)"], acceptOn: "code", sample: "std::unique_ptr<Node> prev;\nwhile (head) {\n    auto next = std::move(head->next);", why: "纸条一改指回去，通往后面的路就断了，所以第一步必须先把它抄在手里；head 走空就是全部处理完的信号。" },
        { id: "q3", type: "code", score: 15, stem: "第二步：把当前节点那张纸条改成指回已倒好的那一段。", acceptRegex: ["head\\s*->\\s*next\\s*=\\s*std::move\\s*\\(\\s*prev\\s*\\)"], acceptOn: "code", sample: "head->next = std::move(prev);", why: "这一步就是倒着接上：当前节点从此指向已经倒好的那头，prev 起初为空，第一站的纸条正好变成空。" },
        { id: "q4", type: "code", score: 15, stem: "第三步：prev 收编当前节点，head 再前进到刚抄在手里的那一站，两处都用 std::move 交接。", acceptRegex: ["prev\\s*=\\s*std::move\\s*\\(\\s*head\\s*\\)", "head\\s*=\\s*std::move\\s*\\(\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "prev = std::move(head); head = std::move(next);", why: "unique_ptr 独占手里那份所有权，不能被拷贝，所以每往手里接一次都必须写 std::move。" },
        { id: "q5", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条的电子版：每轮跳完，从 prev 那头开始把已倒好的这一段挨个打出来（用 Node 指针 p 沿 next.get() 往前走），再把 head 这一轮指着多少也打出来。", acceptRegex: ["for\\s*\\(\\s*Node\\s*\\*\\s*\\w+\\s*=\\s*prev\\.get\\s*\\(\\s*\\)", "->\\s*next\\.get\\s*\\(\\s*\\)", "head\\s*->\\s*value"], acceptOn: "code", sample: "for (Node* p = prev.get(); p; p = p->next.get()) std::print(\"{} \", p->value);\nif (head) std::println(\"{}\", head->value); else std::println(\"空\");", why: "本机实跑三行是 prev=1 head=2、prev=2 1 head=3、prev=3 2 1 head=空 —— 画上那两张箭头图，打出来就是同一份账。" },
        { id: "q6", type: "code", score: 15, coversTask: 1, stem: "走完之后再补一行注释，写下最后一轮 head 指的是什么、新链的头落在哪个变量里（至少四个字）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 最后一轮 head 走空，新头在 prev", why: "这一步只判你确实留了一行注释，注释内容这块编辑器判不了；每轮 prev 收编一个节点，head 空时它攥着全部。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <memory>\n#include <utility>\n\nstruct Node {\n    int value;\n    std::unique_ptr<Node> next;\n};\n\nstd::unique_ptr<Node> make_node(int v) {\n    auto p = std::make_unique<Node>();\n    p->value = v;\n    return p;\n}\n\nint main() {\n    auto head = make_node(1);\n    head->next = make_node(2);\n    head->next->next = make_node(3);\n\n    std::unique_ptr<Node> prev;\n    while (head) {\n        auto next = std::move(head->next);\n        head->next = std::move(prev);\n        prev = std::move(head);\n        head = std::move(next);\n\n        std::print(\"本轮后 prev=\");\n        for (Node* p = prev.get(); p; p = p->next.get()) std::print(\"{} \", p->value);\n        std::print(\" head=\");\n        if (head) std::println(\"{}\", head->value); else std::println(\"空\");\n    }\n\n    for (Node* p = prev.get(); p; p = p->next.get()) std::print(\"{} -> \", p->value);\n    std::println(\"null\");\n    // 最后一轮 head 走空，新头在 prev\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <memory>\nstruct Node {\n    int value;\n    std::unique_ptr<Node> next;\n};\n",
          "#include <print>\n#include <memory>\n#include <utility>\n\nstruct Node {\n    int value;\n    std::unique_ptr<Node> next;\n};\n\nint main() {\n    auto head = std::make_unique<Node>();\n    head->value = 1;\n    std::unique_ptr<Node> prev;\n    while (head) {\n        prev = std::move(head);\n        head->next = std::move(prev);\n    }\n    for (Node* p = prev.get(); p; p = p->next.get()) std::print(\"{} \", p->value);\n    return 0;\n}\n"],
        loose: [
          "# include <print>\n# include <memory>\n# include <utility>\n\nstruct Node\n{\n  int value;\n  std::unique_ptr<Node> next;\n};\n\nint main ()\n{\n  std::unique_ptr<Node> head = std::make_unique<Node>();\n  head -> value = 1;\n  head->next = std::make_unique<Node>();\n  head->next->value = 2;\n  head->next->next = std::make_unique<Node>();\n  head->next->next->value = 3;\n\n  std::unique_ptr<Node> prev;\n  while ( head )\n  {\n    auto nxt = std::move ( head -> next );\n    head->next = std::move( prev );\n    prev = std::move(head); head = std::move(nxt);\n    std::print(\"prev 这一段：\");\n    for ( Node * walk = prev.get ( ) ; walk ; walk = walk -> next.get ( ) ) std::print(\"{} \", walk->value);\n    std::println(\" head 现在: {}\", head ? head->value : 0);\n  }\n  // 走完时 head 是空，倒好的头交给 prev\n  return 0;\n}\n"]
      }
    },
    {
      cid: "m186", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 186 课考试 · vector 和 list 谁更快", task: "任务题目：把 N 改成 1000000 再实测一遍 vector 和 list 的差距，并用三组实验说清谁在什么时候快", hint: "回看本课【演示 1】（掐表写法）与【演示 2】（三组实测）。",
      notes: ["vector 从头走到尾快，是因为元素在内存里一格挨一格，CPU 顺路把旁边整块带进缓存；list 是散装节点，每走一步都要重新找门牌。", "掐表测耗时要用只进不退的 steady_clock，system_clock 会被校时拨动。", "本机实测 N=100000 时 vector 约 0.43 ms、list 约 2.9 ms；N=1000000 时约 2.9 ms 对 28.5 ms，差距从约 7 倍拉大到约 10 倍。", "list 每放一个数都要向系统申请一次节点内存，但头部插入它不用挪人，实测反赢约 80 倍 —— 不是任何操作都比 vector 慢。", "选容器的口诀是默认无脑选 vector，结论按操作分布算，不是背一句谁快。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "把这份程序写成能跑的形：打印、动态数组、链表、计时四样工具箱都搬进来（四行 #include），再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*print\\s*>", "#\\s*include\\s*<\\s*vector\\s*>", "#\\s*include\\s*<\\s*list\\s*>", "#\\s*include\\s*<\\s*chrono\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n#include <vector>\n#include <list>\n#include <chrono>\n\nint main() {", why: "std::list 在 list 里，std::chrono 里的秒表在 chrono 里，少一行编译器就不认那个名字。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：把件数 N 定成一百万（写成 1000000 或 1'000'000 都行），后面两组实验都按它来放。", acceptRegex: ["\\bN\\s*=\\s*1'?0'?0'?0'?0'?0'?0\\s*;"], acceptOn: "code", sample: "constexpr int N = 1000000;", why: "十万的时候差距只有约 7 倍，规模再上一个台阶才看得出 list 每节点申请内存、找门牌的亏越吃越大。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "写一个循环，让 std::vector 和 std::list 这两位选手各用 push_back 往尾部放同样多件。", acceptRegex: ["std::vector\\s*<\\s*int\\s*>\\s+\\w+", "std::list\\s*<\\s*int\\s*>\\s+\\w+", "\\.push_back\\s*\\(", "\\bfor\\s*\\("], acceptOn: "code", sample: "std::vector<int> v;\nstd::list<int> lst;\nfor (int i = 0; i < N; ++i) v.push_back(i);", why: "同一件事做两遍才叫对照：只测一位选手，那叫记录，不叫比较。" },
        { id: "q4", type: "code", score: 15, stem: "掐表：从标准秒表里借一个只进不退的钟（steady_clock），每组实验前后各取一次时刻存进变量。", acceptRegex: ["steady_clock", "std::chrono::steady_clock::now", "=\\s*now\\s*\\(\\s*\\)"], acceptOn: "code", sample: "auto now = std::chrono::steady_clock::now;\nauto t0 = now();", why: "挂墙上的那个钟会被校时拨动，耗时可能算出负数；只进不退的钟才是掐表专用的。" },
        { id: "q5", type: "code", score: 20, coversTask: 1, stem: "用一条 std::println 把两边的毫秒数打出来：格式串里给耗时留 {:.2f} 这样的坑，件数那个坑照旧用花括号。", acceptRegex: ["std::println\\s*\\(", "\\{\\s*:\\s*\\.\\s*2\\s*f\\s*\\}"], acceptOn: "code", sample: "std::println(\"尾部放 {} 个: vector {:.2f} ms，list {:.2f} ms\", N, ms(t0, t1), ms(t1, t2));", why: "耗时是带小数的秒表读数，两位小数刚好看得清差距；坑和值按顺序一个一个对上。" },
        { id: "q6", type: "code", score: 15, coversTask: 1, stem: "跑完之后，用一行注释写下把 N 拉到一百万之后两边的差距是拉大了还是没变（至少四个字）。", acceptRegex: ["//[^\\n]{4,}"], acceptOn: "buffer", sample: "// 差距从约 7 倍拉大到约 10 倍", why: "这一步只判你确实留了一行注释，注释内容这块编辑器判不了；本机连跑三次方向稳定，是拉大了。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <vector>\n#include <list>\n#include <chrono>\n\nint main() {\n    constexpr int N = 1000000;\n    std::vector<int> v;\n    std::list<int> lst;\n\n    auto now = std::chrono::steady_clock::now;\n    auto ms = [](auto a, auto b) {\n        return std::chrono::duration<double, std::milli>(b - a).count();\n    };\n\n    auto t0 = now();\n    for (int i = 0; i < N; ++i) v.push_back(i);\n    auto t1 = now();\n    for (int i = 0; i < N; ++i) lst.push_back(i);\n    auto t2 = now();\n\n    std::println(\"尾部放 {} 个: vector {:.2f} ms，list {:.2f} ms\", N, ms(t0, t1), ms(t1, t2));\n    // 差距从约 7 倍拉大到约 10 倍\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <vector>\nint main() {\n    std::vector<int> v;\n    for (int i = 0; i < 100; ++i) v.push_back(i);\n    return 0;\n}\n",
          "#include <print>\n#include <vector>\n#include <list>\n\nint main() {\n    constexpr int N = 100000;\n    std::vector<int> v;\n    std::list<int> lst;\n    for (int i = 0; i < N; ++i) v.push_back(i);\n    for (int i = 0; i < N; ++i) lst.push_back(i);\n    std::println(\"放完了\");\n    return 0;\n}\n"],
        loose: [
          "# include <print>\n# include <list>\n# include <vector>\n# include <chrono>\n\nint main ( )\n{\n  const int N = 1'000'000;\n  std::vector<int> vec;\n  std::list<int> lin;\n  auto now = std::chrono::steady_clock::now;\n  auto a0 = now();\n  for (int i = 0; i < N; i ++) vec.push_back(i);\n  auto a1 = now();\n  for (int i = 0; i < N; i ++) lin.push_back(i);\n  auto a2 = now();\n  auto ms = [](auto x, auto y) { return std::chrono::duration<double, std::milli>(y - x).count(); };\n  std::println(\"一百万件: vector {:.2f} 毫秒, list {:.2f} 毫秒\", ms(a0,a1), ms(a1,a2));\n  // 拉到一百万，差距明显更大，约十倍\n  return 0;\n}\n"]
      }
    },
    {
      cid: "m191", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 191 课考试 · 两个栈倒出一个队列", task: "任务题目：用两个栈拼出一个队列 —— 先把 1、2、3 依次放进入口那头的栈，再倒到出口那头的栈取人；取到一半往入口补一个 4，看看名单怎么变；最后反过来玩一遍，用两条队列拼出一个栈。", hint: "卡住了先回看本课「原理讲解」那一节和课末【任务】那两条 —— 这一课的演示代码还没落稿（正文里那三段还是占位），家什暂时只在源稿的任务里。",
      notes: ["两个栈拼队列：in 只管收人，out 只管放人，倒一次水顺序就正好翻回来，先进先出是这么拼出来的。", "必须等 out 空了才倒：out 里还压着人就去动 in，倒进来的新人会插到还没放出去的人前面，队伍顺序就乱了。", "出到一半再入队 4，4 排在最后 —— 前面没放出去的人照样先走，这一步就是要你亲手验一遍。", "用两条队列拼栈：栈顶是最后进来的那个，队列只会从队首拿人，得把除了最后一个以外的人先挪到另一条队列。", "报完栈顶还得把那批人挪回原来那条队列，它才接着当栈用。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "写两行：开出两个装 int 的栈，一个当入口那头的 in，一个当出口这头的 out。", acceptRegex: ["std\\s*::\\s*stack\\s*<\\s*int\\s*>\\s+in\\s*;", "std\\s*::\\s*stack\\s*<\\s*int\\s*>\\s+out\\s*;"], acceptOn: "code", sample: "std::stack<int> in;\nstd::stack<int> out;", why: "两个栈各管一扇门：in 只管收人，out 只管放人，先进先出就是从这一倒一拿拼出来的。" },
        { id: "q2", type: "code", score: 15, stem: "把 1、2、3 三个人依次请进 in 这一头：三次 push，一个接一个。", acceptRegex: ["in\\s*\\.\\s*push\\s*\\(\\s*1\\s*\\)", "in\\s*\\.\\s*push\\s*\\(\\s*2\\s*\\)", "in\\s*\\.\\s*push\\s*\\(\\s*3\\s*\\)"], acceptOn: "code", sample: "in.push(1);\nin.push(2);\nin.push(3);", why: "在栈这头人是倒着摞的：最后放的 3 压在最上面，所以必须靠倒水把它翻回 1、2、3。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "倒水：先看 out 空不空，只有它空着才动手；趁 in 还没空，把 in 顶上那个接过来压进 out，再把 in 的顶上拿走。", acceptRegex: ["out\\s*\\.\\s*empty\\s*\\(", "in\\s*\\.\\s*empty\\s*\\(", "out\\s*\\.\\s*push\\s*\\(\\s*in\\s*\\.\\s*top\\s*\\(\\s*\\)\\s*\\)", "in\\s*\\.\\s*pop\\s*\\("], acceptOn: "code", sample: "if (out.empty()) {\n    while (!in.empty()) {\n        out.push(in.top());\n        in.pop();\n    }\n}", why: "out 里还压着人就去动 in，倒进来的新人会插到还没放出去的人前面 —— 这就是必须等 out 空了才倒的道理。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "取人：从 out 这一头顶上把那个人报出来，再把他送走（top 和 pop 都得用上）。", acceptRegex: ["out\\s*\\.\\s*top\\s*\\(", "out\\s*\\.\\s*pop\\s*\\("], acceptOn: "code", sample: "std::println(\"出队 {}\", out.top());\nout.pop();", why: "倒过一次水之后 out 的顶上正是最早进来的那个，从这头拿人就是队首出队。" },
        { id: "q5", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：出到一半再来新人 —— 往 in 里 push 一个 4，然后再打一行看看 out 这头顶上是谁。", acceptRegex: ["in\\s*\\.\\s*push\\s*\\(\\s*4\\s*\\)", "std\\s*::\\s*println\\s*\\("], acceptOn: "code", sample: "in.push(4);\nstd::println(\"补进 4 之后，out 顶上还是 {}\", out.top());", why: "4 落在 in 那一头排到最后，out 里还没放出去的人照旧先走；顺序没乱，就是这一条要你亲眼看到的。" },
        { id: "q6", type: "code", score: 20, coversTask: 2, stem: "任务第 2 条：反过来玩 —— 开两条队列，把第一条里除了最后一个人以外的都挪到第二条，露在队首的那个就是栈顶，报出来再送走。", acceptRegex: ["std\\s*::\\s*queue\\s*<\\s*int\\s*>\\s+\\w+\\s*;[\\s\\S]{0,80}?std\\s*::\\s*queue\\s*<\\s*int\\s*>", "\\bwhile\\s*\\(", "\\.\\s*front\\s*\\(\\s*\\)", "\\.\\s*pop\\s*\\("], acceptOn: "code", sample: "while (a.size() > 1) {\n    b.push(a.front());\n    a.pop();\n}\nstd::println(\"栈顶是 {}\", a.front());\na.pop();", why: "队列只会从队首放人，栈顶却是最后进来的那个，所以只能把前面的人都腾到另一条队列里，才露得出栈顶那一个。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <stack>\n#include <queue>\n\nint main() {\n    std::stack<int> in;\n    std::stack<int> out;\n    in.push(1);\n    in.push(2);\n    in.push(3);\n\n    if (out.empty()) {\n        while (!in.empty()) {\n            out.push(in.top());\n            in.pop();\n        }\n    }\n    std::println(\"出队 {}\", out.top());\n    out.pop();\n\n    in.push(4);\n    std::println(\"补进 4 之后，out 顶上还是 {}\", out.top());\n\n    std::queue<int> a;\n    std::queue<int> b;\n    a.push(1);\n    a.push(2);\n    a.push(3);\n    while (a.size() > 1) {\n        b.push(a.front());\n        a.pop();\n    }\n    std::println(\"栈顶是 {}\", a.front());\n    a.pop();\n    while (!b.empty()) {\n        a.push(b.front());\n        b.pop();\n    }\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <stack>\nint main() {\n    std::stack<int> in;\n    std::stack<int> out;\n    in.push(1);\n    return 0;\n}\n",
          "#include <print>\n#include <stack>\n\nint main() {\n    std::stack<int> in;\n    std::stack<int> out;\n    in.push(1);\n    in.push(2);\n    in.push(3);\n    std::println(\"出队 {}\", out.top());\n    out.pop();\n    return 0;\n}\n"],
        loose: [
          "# include <print>\n# include <stack>\n# include <queue>\n\nint main ( )\n{\n  std::stack<int> in;\n  std::stack<int> out;\n  in . push ( 1 );\n  in.push(2);\n  in.push(3);\n  if ( ! out.empty ( ) )\n  {\n    while ( in.empty() == false )\n    {\n      out.push( in.top() );\n      in.pop();\n    }\n  }\n  std::println( \"拿走 {}\", out.top() );\n  out.pop ( ) ;\n  in.push ( 4 );\n  std::println(\"看看顶上：{}\", out.top());\n  std::queue<int> q1;\n  std::queue<int> q2;\n  q1.push(1); q1.push(2); q1.push(3);\n  while ( q1.size() > 1 ) { q2.push(q1.front()); q1.pop(); }\n  std::println(\"栈顶 {}\", q1.front());\n  q1.pop();\n  while (!q2.empty()) { q1.push(q2.front()); q2.pop(); }\n  return 0;\n}\n"]
      }
    },
  ]
};
