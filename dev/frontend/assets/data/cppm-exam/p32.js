/* 喵站 · C++ 掌握 考卷分部 p32：第 183–186 课（笔试引擎，题型字段照 exam-paper.js）
 * 规矩与 cppm-exam/p01.js 完全一致：每场 7–8 题、score 合计 100、choice ≥2、output ≥1、
 * 源稿任务全覆盖（coversTask）、每题带 why、selftest refs 判满 / wrongs 不到及格 / loose 及格以上。
 */
window.MIAO_CPPM_EXAM_P32 = {
  papers: [
    {
      cid: "m183", kind: "paper", mode: "code", authored: "684ee4eb", pass: 60, title: "第 183 课考试 · 链表是什么", task: "任务题目：用 make_unique 造出一条 10 → 20 → 30 → 40 的链，接上第 4 站 40，并顺着纸条把整条链打印出来", hint: "想不起来就回看本课【演示 1】（建链）与【演示 2】（接第 4 站）。",
      questions: [
        { id: "q1", type: "code", score: 29, coversTask: 1, stem: "（任务题）链已建到 30，a 是头节点。写一行：把第 4 站 40 接上去。", acceptRegex: ["\\w+\\s*->\\s*next\\s*->\\s*next\\s*->\\s*next\\s*=\\s*(std::)?make_unique\\s*<\\s*Node\\s*>\\s*\\(\\s*40\\s*\\)"], sample: "a->next->next->next = std::make_unique<Node>(40);", why: "要接在 30 后面，得从 a 连穿三层 ->next 再赋值；少一层就把纸条接到队伍中间去了。" },
        { id: "q2", type: "code", score: 22, coversTask: 1, stem: "（任务题）写出走链的 for 循环：p 从头出发、纸条空白就停、每步跳到下一站，循环体里打印 p->value。", acceptRegex: ["for\\s*\\(\\s*Node\\s*\\*\\s*p\\s*=\\s*\\w+\\.get\\s*\\(\\s*\\)\\s*;\\s*p\\s*;\\s*p\\s*=\\s*p\\s*->\\s*next\\.get\\s*\\(\\s*\\)\\s*\\)"], sample: "for (Node* p = a.get(); p; p = p->next.get()) std::print(\"{} → \", p->value);", why: "三个分号段各管出发、停步、前进；停步条件是 p 本身非空。" },
        { id: "q3", type: "code", score: 26, coversTask: 1, stem: "写出这个节点长什么样的声明：名字是 Node，里面装一个整数宝藏 value，再加一张写着下一站地址的纸条 next（纸条由独占的智能指针打理，类型指向 Node 自己）。", acceptRegex: ["struct\\s+Node\\s*\\{", "int\\s+value\\s*;", "std\\s*::\\s*unique_ptr\\s*<\\s*Node\\s*>\\s+next\\s*;"], sample: "struct Node { int value; std::unique_ptr<Node> next; };", why: "链表节点的全部家当就这两行：一个值、一张指向同类型节点的纸条。纸条用独占指针管，所以下一站销毁时不会漏内存，也不用自己写释放。" },
        { id: "q4", type: "code", score: 23, coversTask: 1, stem: "a 已经是装着 10 的头节点。写一行：在堆上造一个装着 20 的新节点，并把 a 的纸条指向它。", acceptRegex: ["a\\s*->\\s*next\\s*=", "make_unique\\s*<\\s*Node\\s*>\\s*\\(\\s*20\\s*\\)"], sample: "a->next = std::make_unique<Node>(20);", why: "箭头是纸条的用法：a->next 就是「a 那张纸条」，右边造出新节点交进去，所有权随之过户；这一跳接上了，后面才能一路穿到 30、40。" }
      ],
      selftest: {
        refs: [
          {q1: "a->next->next->next = std::make_unique<Node>(40);", q2: "for (Node* p = a.get(); p; p = p->next.get()) std::print(\"{} → \", p->value);", q3: "struct Node {\n    int value;\n    std::unique_ptr<Node> next;\n};", q4: "a->next = std::make_unique<Node>(20);"}],
        wrongs: [
          {q1: "a->next->next = std::make_unique<Node>(40);", q2: "for (Node* p = a.get(); p->next; p = p->next.get()) std::print(\"{} → \", p->value);", q3: "struct Node {\n    int value;\n    Node* next;\n};", q4: "a->next->next = std::make_unique<Node>(20);"}],
        loose: [
          {q1: "a -> next -> next -> next = std::make_unique<Node>( 40 );", q2: "for(Node* p=a.get(); p; p=p->next.get()) { std::print(\"{} → \", p->value); }", q3: "struct  Node\n{\n  int  value  ;\n  std  ::  unique_ptr < Node >  next  ;\n}  ;", q4: "a  ->  next  =  std  ::  make_unique <  Node  >(  20  )  ;"}]
      }
    },
    {
      cid: "m184", kind: "paper", mode: "code", authored: "e2197017", pass: 60, title: "第 184 课考试 · 链表插队：只改纸条", task: "任务题目：在 30 → 35 → 40 的链里，用两张纸条把 37 插到 35 和 40 中间，插完全程不挪其他节点", hint: "回看本课【演示 2】（插 37 的两行纸条）与【演示 3】（顺序反了的下场）。",
      questions: [
        { id: "q1", type: "code", score: 36, coversTask: 1, stem: "（任务题）链是 30 → 35 → 40，again 是造好的 37 节点。写两行改纸条，把 37 插进 35 和 40 中间。", acceptRegex: ["\\w+\\s*->\\s*next\\s*=\\s*std::move\\s*\\(\\s*head\\s*->\\s*next\\s*->\\s*next\\s*\\)", "head\\s*->\\s*next\\s*->\\s*next\\s*=\\s*std::move\\s*\\(\\s*\\w+\\s*\\)"], sample: "again->next = std::move(head->next->next); head->next->next = std::move(again);", why: "纸条一 37 接上 40（移走 head->next->next 的管辖权），纸条二 35 改指 37；顺序反了 40 会凭空消失。" },
        { id: "q2", type: "code", score: 32, coversTask: 1, stem: "链现在是 30 → 40，newbie 是造好的 35 节点。写一行先接的那张纸条：让 newbie 指向 40，管辖权必须明说移交。", acceptRegex: ["newbie\\s*->\\s*next\\s*=", "std\\s*::\\s*move\\s*\\(\\s*head\\s*->\\s*next\\s*\\)"], sample: "newbie->next = std::move(head->next);", why: "插队是两张纸条的事，而顺序要「先接后断」：先让新节点接住后面那一站的管辖权，前面那站才敢改指新节点。少了 move 就是想给独占指针复印，编译器当场拦下。" },
        { id: "q3", type: "code", score: 32, coversTask: 1, stem: "插完之后验一遍：写一行 for，从头节点出发，当前站存在就继续，每步顺着纸条跳到下一站。循环体里把这一站的数值打成「数 → 」的样子（也可以只写 for 这一行）。", acceptRegex: ["for\\s*\\(\\s*Node\\s*\\*\\s*p\\s*=\\s*\\w+\\s*\\.\\s*get\\s*\\(\\s*\\)", ";\\s*p\\s*;", "p\\s*=\\s*p\\s*->\\s*next\\s*\\.\\s*get\\s*\\(\\s*\\)"], sample: "for (Node* p = head.get(); p; p = p->next.get()) std::print(\"{} → \", p->value);", why: "get() 是「我只看一眼、不抢所有权」：借一个裸指针来走路，链的归属还在 head 手里。停步条件写 p 本身，最后一站的纸条是空的，走到它就自然停下。" }
      ],
      selftest: {
        refs: [
          {q1: "again->next = std::move(head->next->next); head->next->next = std::move(again);", q2: "newbie->next = std::move(head->next);", q3: "for (Node* p = head.get(); p; p = p->next.get()) std::print(\"{} → \", p->value);"}],
        wrongs: [
          {q1: "again->next = std::move(head->next); head->next = std::move(again);", q2: "newbie->next = head->next;", q3: "for (Node* p = head.get(); p->next; p = p->next.get()) std::print(\"{} → \", p->value);"}],
        loose: [
          {q1: "again->next = std::move( head->next->next ); head->next->next = std::move( again );", q2: "newbie  ->  next  =  std  ::  move  (  head -> next  )  ;", q3: "for  (  Node  *  p  =  head . get ( )  ;  p  ;  p = p -> next . get ( )  )\n{  std::print(\"{} → \", p->value);  }"}]
      }
    },
    {
      cid: "m185", kind: "paper", mode: "quiz", authored: "811de87e", pass: 60, title: "第 185 课考试 · 反转整条链", task: "任务题目：用三步舞把 1 → 2 → 3 整条倒成 3 → 2 → 1，并在纸上画清每轮循环后 prev 与 head 各指哪里", hint: "回看本课【演示 2】（每轮状态的实测打印），先画再核对。",
      questions: [
        { id: "q1", type: "choice", score: 10, stem: "每轮三步的第一步为什么是先记住下一站？", options: ["纸条一改指回去，通往后面的路就断了，得先抄在手里", "不记住会编译报错", "下一站马上要被销毁", "为了顺便数清链有多长"], answer: 0, why: "纸条改指 prev 之后原来的 next 就丢了，必须先抄进 next 变量。" },
        { id: "q2", type: "choice", score: 10, stem: "三步舞跳完（head 走空），新链的头在哪个变量里？", options: ["head", "next", "prev", "原链的第一个节点"], answer: 2, why: "每轮 prev 收编一个节点，head 空时它攥着全部，正是倒好后的头。" },
        { id: "q3", type: "output", score: 18, coversTask: 1, stem: "（画图题的电子版）链是 1 → 2 → 3。第 2 轮结束后，prev 这一段从头到尾依次是哪几个数？（照演示 2 的打印，只写数字，空格隔开）", acceptLines: ["2 1"], why: "第 2 轮收编的是节点 2，它的纸条指向已倒好的 1 —— 本机实跑 prev=2 1。" },
        { id: "q4", type: "output", score: 17, coversTask: 1, stem: "（画图题的电子版）最后一轮结束后，head 指什么？（照演示 2 的打印，写一个词）", acceptLines: ["空"], why: "head 走空就是全部处理完的信号，循环条件写 head 正是借用这一点。" },
        { id: "q5", type: "order", score: 15, coversTask: 1, stem: "把三步舞的三个动作排成正确顺序。", answer: [1, 0, 2], steps: ["纸条改指回上一站：head->next = std::move(prev)", "记住下一站：auto next = std::move(head->next)", "各前进一步：prev = std::move(head); head = std::move(next)"], why: "先记、再回头、再前进；顺序乱一次，后面整段就失联。" },
        { id: "q6", type: "choice", score: 7, stem: "循环条件误写成 head->next 会怎样？", options: ["最后一个节点进不了 prev，输出停在 2 → 1", "跑不完，死循环", "编译不过", "输出还是对的"], answer: 0, why: "走到最后一站时它的纸条是空的，循环提前收工，3 被丢下。" },
        { id: "q7", type: "multi", score: 5, stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）", options: ["prev 起初是空的，第一站的纸条正好被改成 null", "反转过程会 new 出一批新节点", "整条反转一个节点都没销毁，动的全是纸条", "循环结束后该用 head 接着走链"], answers: [0, 2], why: "反转零 new 零销毁；head 已空，新头在 prev。" },
        { id: "q8", type: "blank", score: 18, coversTask: 1, stem: "三步舞的第 1 步写成 auto next = head->next，漏掉 std::move 就编译过不去：unique_ptr 独占手里那份所有权，它不能被____。（填一个词）", accept: ["复制", "拷贝", "复印", "copy", "克隆"], why: "move 交出去的是所有权：下一站被搬进 next 这个变量，head->next 那一处就不再攥着它了。直接复印会造出两个都以为 owns 同一个节点的 unique_ptr，语言层面就禁止，所以每往手里接一次都必须写 std::move。" }
      ],
      selftest: {
        refs: [
          {q1: 0, q2: 2, q3: "2 1", q4: "空", q5: [1, 0, 2], q6: 0, q7: [0, 2], q8: "拷贝"}],
        wrongs: [
          {q1: 1, q2: 0, q3: "1 2", q4: "head", q5: [0, 1, 2], q6: 1, q7: [1, 3], q8: "移动"}],
        loose: [
          {q1: "0", q2: "2", q3: "2  1", q4: "空", q5: [1, 0, 2], q6: "0", q7: [0, 2], q8: " COPY "}]
      }
    },
    {
      cid: "m186", kind: "paper", mode: "quiz", pass: 60, title: "第 186 课考试 · vector 和 list 谁更快", task: "任务题目：把 N 改成 1000000 再实测一遍 vector 和 list 的差距，并用三组实验说清谁在什么时候快", hint: "回看本课【演示 1】（掐表写法）与【演示 2】（三组实测）。",
      questions: [
        { id: "q1", type: "choice", score: 12, stem: "vector 从头走到尾快，根本原因是什么？", options: ["元素在内存里一格挨一格，CPU 顺路把旁边整块带进缓存", "vector 的名字短，编译得快", "list 的纸条写得潦草", "vector 不需要头文件"], answer: 0, why: "连续内存吃缓存红利；list 散装节点每走一步都要重新找门牌。" },
        { id: "q2", type: "choice", score: 11, stem: "掐表测耗时该用哪个时钟？", options: ["system_clock，挂墙上的钟", "steady_clock，只进不退的钟", "随便哪个都一样", "C 语言的 time 函数"], answer: 1, why: "system_clock 会被校时拨动，耗时可能算出负数；steady 不受对时影响。" },
        { id: "q3", type: "output", score: 26, coversTask: 1, stem: "改完 N 重跑，println 那行「尾部放 {} 个」的 {} 处打出的数字是多少？", acceptLines: ["1000000"], why: "{} 吃的是 N，改的就是它；耗时数字每次会抖，这个数字不会。" },
        { id: "q4", type: "choice", score: 24, coversTask: 1, stem: "本机实测：N=100000 时 vector 约 0.43 ms、list 约 2.9 ms；N=1000000 时 vector 约 2.9 ms、list 约 28.5 ms。差距怎么变的？", options: ["从约 7 倍拉大到约 10 倍", "基本不变", "缩小到约 2 倍", "list 反超了"], answer: 0, why: "规模越大，list 每节点申请内存与找门牌的亏吃得越多；本机连跑三次方向稳定。" },
        { id: "q5", type: "multi", score: 18, stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）", options: ["list 每放一个数都要向系统申请一次节点内存", "list 任何操作都比 vector 慢", "头部插入实测 list 反赢约 80 倍", "选容器的口诀是默认无脑选 vector"], answers: [0, 2, 3], why: "list 输在缓存与申请、赢在不挪人；结论按操作分布算，不是背一句谁快。" },
        { id: "q6", type: "blank", score: 9, stem: "steady_clock 名字里 steady 的意思是这个钟____。（用本课的说法填）", accept: ["只进不退", "不受对时影响", "稳定"], why: "校时不会让它倒退，所以它才是掐表专用的钟。" }
      ],
      selftest: {
        refs: [
          {q1: 0, q2: 1, q3: "1000000", q4: 0, q5: [0, 2, 3], q6: "只进不退"}],
        wrongs: [
          {q1: 1, q2: 0, q3: "100000", q4: 2, q5: [1], q6: "倒退"}],
        loose: [
          {q1: "0", q2: "1", q3: "1000000", q4: "0", q5: [0, 2, 3], q6: "不受对时影响"}]
      }
    },
  ]
};
