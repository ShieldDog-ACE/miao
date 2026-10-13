/* 喵站 · C++ 掌握 考卷分部 p32：第 183–186 课（笔试引擎，题型字段照 exam-paper.js）
 * 规矩与 cppm-exam/p01.js 完全一致：每场 7–8 题、score 合计 100、choice ≥2、output ≥1、
 * 源稿任务全覆盖（coversTask）、每题带 why、selftest refs 判满 / wrongs 不到及格 / loose 及格以上。
 */
window.MIAO_CPPM_EXAM_P32 = {
  papers: [
    {
      cid: "m183", kind: "paper", pass: 60,
      title: "第 183 课考试 · 链表是什么",
      task: "任务题目：用 make_unique 造出一条 10 → 20 → 30 → 40 的链，接上第 4 站 40，并顺着纸条把整条链打印出来",
      hint: "想不起来就回看本课【演示 1】（建链）与【演示 2】（接第 4 站）。",
      questions: [
        { id: "q1", type: "choice", score: 8,
          stem: "一个链表节点 Node 里装的是哪两样？",
          options: ["一个 value 和一张 next 纸条，纸上写着下一站的地址", "一个数组和一个下标", "两个宝藏", "一个 value 和前一个站的地址"],
          answer: 0,
          why: "链表节点 = 宝藏 value + 纸条 next；顺着纸条才能走到下一站。" },
        { id: "q2", type: "choice", score: 8,
          stem: "顺着链从头走到尾，走链循环的条件判断的是什么？",
          options: ["p 非空就继续，纸条空白就停", "p->next 非空就继续", "循环固定走 100 次", "数组的长度"],
          answer: 0,
          why: "条件写 p，判断的是「当前站存不存在」；写成 p->next 会把最后一站丢掉。" },
        { id: "q3", type: "code", score: 20, coversTask: 1,
          stem: "（任务题）链已建到 30，a 是头节点。写一行：把第 4 站 40 接上去。",
          acceptRegex: ["\\w+\\s*->\\s*next\\s*->\\s*next\\s*->\\s*next\\s*=\\s*(std::)?make_unique\\s*<\\s*Node\\s*>\\s*\\(\\s*40\\s*\\)"],
          why: "要接在 30 后面，得从 a 连穿三层 ->next 再赋值；少一层就把纸条接到队伍中间去了。" },
        { id: "q4", type: "output", score: 14, coversTask: 1,
          stem: "建好 10、20、30、40 四站后，跑完走链循环和收尾的 println，输出的完整一行是什么？",
          acceptLines: ["10 → 20 → 30 → 40 → null"],
          why: "每站打印「数 → 」，尽头补 null；本机实跑就是这一行。" },
        { id: "q5", type: "choice", score: 10,
          stem: "最后一站的 next 纸条上写的是什么？",
          options: ["下一站的下标", "null，也就是空", "自己的地址", "一个随机值"],
          answer: 1,
          why: "纸条空白就是尽头，走链循环全靠它停步。" },
        { id: "q6", type: "code", score: 16, coversTask: 1,
          stem: "（任务题）写出走链的 for 循环：p 从头出发、纸条空白就停、每步跳到下一站，循环体里打印 p->value。",
          acceptRegex: ["for\\s*\\(\\s*Node\\s*\\*\\s*p\\s*=\\s*\\w+\\.get\\s*\\(\\s*\\)\\s*;\\s*p\\s*;\\s*p\\s*=\\s*p\\s*->\\s*next\\.get\\s*\\(\\s*\\)\\s*\\)"],
          why: "三个分号段各管出发、停步、前进；停步条件是 p 本身非空。" },
        { id: "q7", type: "multi", score: 14,
          stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["链表节点在内存里一格挨着一格排", "unique_ptr 出了作用域会自动销毁它管的节点", "链表可以用下标一步跳到第 100 站", "make_unique 在堆上开一块节点内存"],
          answers: [1, 3],
          why: "链表是散装的、没有下标直达；自动销毁不漏内存正是智能指针存在的意义。" },
        { id: "q8", type: "blank", score: 10,
          stem: "造一个 value 为 7 的节点并接住它：auto solo = std::____<Node>(7); 填函数名（不带 std::）。",
          accept: ["make_unique"],
          why: "make_unique 造节点还自动管内存，本课从造链到走链没写过一个 delete。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: 0, q3: "a->next->next->next = std::make_unique<Node>(40);", q4: "10 → 20 → 30 → 40 → null", q5: 1, q6: "for (Node* p = a.get(); p; p = p->next.get()) std::print(\"{} → \", p->value);", q7: [1, 3], q8: "make_unique" }
        ],
        wrongs: [
          { q1: 2, q2: 1, q3: "a->next->next = std::make_unique<Node>(40);", q4: "10 20 30 40", q5: 0, q6: "for (Node* p = a.get(); p->next; p = p->next.get()) std::print(\"{} → \", p->value);", q7: [0, 2], q8: "make" }
        ],
        loose: [
          { q1: "0", q2: "0", q3: "a -> next -> next -> next = std::make_unique<Node>( 40 );", q4: "10 → 20 → 30 → 40 → null", q5: "1", q6: "for(Node* p=a.get(); p; p=p->next.get()) { std::print(\"{} → \", p->value); }", q7: [1, 3], q8: "make_unique" }
        ]
      }
    },
    {
      cid: "m184", kind: "paper", pass: 60,
      title: "第 184 课考试 · 链表插队：只改纸条",
      task: "任务题目：在 30 → 35 → 40 的链里，用两张纸条把 37 插到 35 和 40 中间，插完全程不挪其他节点",
      hint: "回看本课【演示 2】（插 37 的两行纸条）与【演示 3】（顺序反了的下场）。",
      questions: [
        { id: "q1", type: "choice", score: 10,
          stem: "链表中间插一个新节点，要动哪几张纸条？",
          options: ["两张：新节点的纸条指向后一站，前一站的纸条改指新节点", "一张：只改前一站的纸条", "所有节点的纸条都要改一遍", "先拆掉整条链再重建"],
          answer: 0,
          why: "「35 指向我，我指向 40」，两张纸条就完事，其他节点原地不动。" },
        { id: "q2", type: "choice", score: 10,
          stem: "newbie->next = head->next 这样直接赋值为什么编译不过？",
          options: ["head->next 是私有的", "unique_ptr 禁止复印，一块内存只能有一个主人", "newbie 还没造出来", "少了一个分号"],
          answer: 1,
          why: "独占指针不给复印；要移交得写 std::move 明说。" },
        { id: "q3", type: "code", score: 20, coversTask: 1,
          stem: "（任务题）链是 30 → 35 → 40，again 是造好的 37 节点。写两行改纸条，把 37 插进 35 和 40 中间。",
          acceptRegex: ["\\w+\\s*->\\s*next\\s*=\\s*std::move\\s*\\(\\s*head\\s*->\\s*next\\s*->\\s*next\\s*\\)", "head\\s*->\\s*next\\s*->\\s*next\\s*=\\s*std::move\\s*\\(\\s*\\w+\\s*\\)"],
          why: "纸条一 37 接上 40（移走 head->next->next 的管辖权），纸条二 35 改指 37；顺序反了 40 会凭空消失。" },
        { id: "q4", type: "output", score: 18, coversTask: 1,
          stem: "插完 37 后走一遍链并收尾 println，输出的完整一行是什么？",
          acceptLines: ["30 → 35 → 37 → 40 → null"],
          why: "本机实跑验证过；两张纸条一改，四站全数到齐。" },
        { id: "q5", type: "order", score: 12, coversTask: 1,
          stem: "把链表插队的四个动作排成正确顺序。",
          steps: ["newbie->next = std::move(head->next)", "用 make_unique 造出新节点", "head->next = std::move(newbie)", "遍历打印整条链验证"],
          answer: [1, 0, 2, 3],
          why: "先造人，再先接后断（新节点先接后一站，前一站再改指它），最后验证。" },
        { id: "q6", type: "choice", score: 12,
          stem: "把两张纸条顺序写反（先 head->next = std::move(newbie)），紧接着会发生什么？",
          options: ["40 的管辖权没人接手，节点被销毁", "40 会自动接到新链上", "编译器当场报错拦住你", "什么都不会发生"],
          answer: 0,
          why: "先断后接，40 变成孤儿被 unique_ptr 析构；输出里直接少一个数，还不报错。" },
        { id: "q7", type: "multi", score: 10,
          stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["std::move 移交后，原来的变量变成空纸条", "std::move 会把节点复印一份", "链表中间插入不用挪动其他节点", "std::move 住在 <utility> 里"],
          answers: [0, 2, 3],
          why: "移交不是复印；移完旧变量两手空空，再碰它就是解引用空指针。" },
        { id: "q8", type: "blank", score: 8,
          stem: "移交纸条用的那个函数叫 std::____。（填名字，不带 std::）",
          accept: ["move"],
          why: "move 就是「我放手了」的正式声明，读代码的人一眼看清所有权换人。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: 1, q3: "again->next = std::move(head->next->next); head->next->next = std::move(again);", q4: "30 → 35 → 37 → 40 → null", q5: [1, 0, 2, 3], q6: 0, q7: [0, 2, 3], q8: "move" }
        ],
        wrongs: [
          { q1: 1, q2: 0, q3: "again->next = std::move(head->next); head->next = std::move(again);", q4: "30 → 35 → 40 → null", q5: [0, 1, 2, 3], q6: 1, q7: [1], q8: "copy" }
        ],
        loose: [
          { q1: "0", q2: "1", q3: "again->next = std::move( head->next->next ); head->next->next = std::move( again );", q4: "30 → 35 → 37 → 40 → null", q5: [1, 0, 2, 3], q6: "0", q7: [0, 2, 3], q8: "move" }
        ]
      }
    },
    {
      cid: "m185", kind: "paper", pass: 60,
      title: "第 185 课考试 · 反转整条链",
      task: "任务题目：用三步舞把 1 → 2 → 3 整条倒成 3 → 2 → 1，并在纸上画清每轮循环后 prev 与 head 各指哪里",
      hint: "回看本课【演示 2】（每轮状态的实测打印），先画再核对。",
      questions: [
        { id: "q1", type: "choice", score: 10,
          stem: "每轮三步的第一步为什么是先记住下一站？",
          options: ["纸条一改指回去，通往后面的路就断了，得先抄在手里", "不记住会编译报错", "下一站马上要被销毁", "为了顺便数清链有多长"],
          answer: 0,
          why: "纸条改指 prev 之后原来的 next 就丢了，必须先抄进 next 变量。" },
        { id: "q2", type: "choice", score: 10,
          stem: "三步舞跳完（head 走空），新链的头在哪个变量里？",
          options: ["head", "next", "prev", "原链的第一个节点"],
          answer: 2,
          why: "每轮 prev 收编一个节点，head 空时它攥着全部，正是倒好后的头。" },
        { id: "q3", type: "output", score: 20, coversTask: 1,
          stem: "（画图题的电子版）链是 1 → 2 → 3。第 2 轮结束后，prev 这一段从头到尾依次是哪几个数？（照演示 2 的打印，只写数字，空格隔开）",
          acceptLines: ["2 1"],
          why: "第 2 轮收编的是节点 2，它的纸条指向已倒好的 1 —— 本机实跑 prev=2 1。" },
        { id: "q4", type: "output", score: 18, coversTask: 1,
          stem: "（画图题的电子版）最后一轮结束后，head 指什么？（照演示 2 的打印，写一个词）",
          acceptLines: ["空"],
          why: "head 走空就是全部处理完的信号，循环条件写 head 正是借用这一点。" },
        { id: "q5", type: "order", score: 16, coversTask: 1,
          stem: "把三步舞的三个动作排成正确顺序。",
          steps: ["纸条改指回上一站：head->next = std::move(prev)", "记住下一站：auto next = std::move(head->next)", "各前进一步：prev = std::move(head); head = std::move(next)"],
          answer: [1, 0, 2],
          why: "先记、再回头、再前进；顺序乱一次，后面整段就失联。" },
        { id: "q6", type: "code", score: 12,
          stem: "写出三步舞的第 1 步和第 2 步各一行（记住下一站、纸条改指回上一站）。",
          acceptRegex: ["auto\\s+next\\s*=\\s*std::move\\s*\\(\\s*head\\s*->\\s*next\\s*\\)", "head\\s*->\\s*next\\s*=\\s*std::move\\s*\\(\\s*prev\\s*\\)"],
          why: "第 1 步把下一站抄进 next，第 2 步把纸条改指 prev；next 忘了 std::move 编译直接报复印被删除。" },
        { id: "q7", type: "choice", score: 8,
          stem: "循环条件误写成 head->next 会怎样？",
          options: ["最后一个节点进不了 prev，输出停在 2 → 1", "跑不完，死循环", "编译不过", "输出还是对的"],
          answer: 0,
          why: "走到最后一站时它的纸条是空的，循环提前收工，3 被丢下。" },
        { id: "q8", type: "multi", score: 6,
          stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["prev 起初是空的，第一站的纸条正好被改成 null", "反转过程会 new 出一批新节点", "整条反转一个节点都没销毁，动的全是纸条", "循环结束后该用 head 接着走链"],
          answers: [0, 2],
          why: "反转零 new 零销毁；head 已空，新头在 prev。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: 2, q3: "2 1", q4: "空", q5: [1, 0, 2], q6: "auto next = std::move(head->next); head->next = std::move(prev);", q7: 0, q8: [0, 2] }
        ],
        wrongs: [
          { q1: 1, q2: 0, q3: "1 2", q4: "head", q5: [0, 1, 2], q6: "auto next = head->next; head->next = prev;", q7: 1, q8: [1, 3] }
        ],
        loose: [
          { q1: "0", q2: "2", q3: "2  1", q4: "空", q5: [1, 0, 2], q6: "auto  next = std::move( head->next );  head->next = std::move( prev );", q7: "0", q8: [0, 2] }
        ]
      }
    },
    {
      cid: "m186", kind: "paper", pass: 60,
      title: "第 186 课考试 · vector 和 list 谁更快",
      task: "任务题目：把 N 改成 1000000 再实测一遍 vector 和 list 的差距，并用三组实验说清谁在什么时候快",
      hint: "回看本课【演示 1】（掐表写法）与【演示 2】（三组实测）。",
      questions: [
        { id: "q1", type: "choice", score: 8,
          stem: "vector 从头走到尾快，根本原因是什么？",
          options: ["元素在内存里一格挨一格，CPU 顺路把旁边整块带进缓存", "vector 的名字短，编译得快", "list 的纸条写得潦草", "vector 不需要头文件"],
          answer: 0,
          why: "连续内存吃缓存红利；list 散装节点每走一步都要重新找门牌。" },
        { id: "q2", type: "choice", score: 8,
          stem: "掐表测耗时该用哪个时钟？",
          options: ["system_clock，挂墙上的钟", "steady_clock，只进不退的钟", "随便哪个都一样", "C 语言的 time 函数"],
          answer: 1,
          why: "system_clock 会被校时拨动，耗时可能算出负数；steady 不受对时影响。" },
        { id: "q3", type: "code", score: 20, coversTask: 1,
          stem: "（任务题）把 N 从 100000 改成 1000000 重跑，写出要改的那一行。",
          acceptRegex: ["constexpr\\s+int\\s+N\\s*=\\s*1000000\\s*;"],
          why: "一个常量一处改；本机实测差距从约 7 倍拉到约 10 倍。" },
        { id: "q4", type: "output", score: 16, coversTask: 1,
          stem: "改完 N 重跑，println 那行「尾部放 {} 个」的 {} 处打出的数字是多少？",
          acceptLines: ["1000000"],
          why: "{} 吃的是 N，改的就是它；耗时数字每次会抖，这个数字不会。" },
        { id: "q5", type: "choice", score: 14, coversTask: 1,
          stem: "本机实测：N=100000 时 vector 约 0.43 ms、list 约 2.9 ms；N=1000000 时 vector 约 2.9 ms、list 约 28.5 ms。差距怎么变的？",
          options: ["从约 7 倍拉大到约 10 倍", "基本不变", "缩小到约 2 倍", "list 反超了"],
          answer: 0,
          why: "规模越大，list 每节点申请内存与找门牌的亏吃得越多；本机连跑三次方向稳定。" },
        { id: "q6", type: "code", score: 16,
          stem: "头部插入的对照实验里，vector 往头部插 5 万个，循环体那一行怎么写？（fv 是 vector，i 是循环变量）",
          acceptRegex: ["\\w+\\.insert\\s*\\(\\s*\\w+\\.begin\\s*\\(\\s*\\)\\s*,\\s*i\\s*\\)"],
          why: "insert 到 begin，每插一个全员后挪一格，本机实测约 75–86 ms；list 的 push_front 只改纸条，约 0.9 ms。" },
        { id: "q7", type: "multi", score: 12,
          stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["list 每放一个数都要向系统申请一次节点内存", "list 任何操作都比 vector 慢", "头部插入实测 list 反赢约 80 倍", "选容器的口诀是默认无脑选 vector"],
          answers: [0, 2, 3],
          why: "list 输在缓存与申请、赢在不挪人；结论按操作分布算，不是背一句谁快。" },
        { id: "q8", type: "blank", score: 6,
          stem: "steady_clock 名字里 steady 的意思是这个钟____。（用本课的说法填）",
          accept: ["只进不退", "不受对时影响", "稳定"],
          why: "校时不会让它倒退，所以它才是掐表专用的钟。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: 1, q3: "constexpr int N = 1000000;", q4: "1000000", q5: 0, q6: "fv.insert(fv.begin(), i);", q7: [0, 2, 3], q8: "只进不退" }
        ],
        wrongs: [
          { q1: 1, q2: 0, q3: "constexpr int N = 100000;", q4: "100000", q5: 2, q6: "fv.push_front(i);", q7: [1], q8: "倒退" }
        ],
        loose: [
          { q1: "0", q2: "1", q3: "constexpr  int  N = 1000000 ;", q4: "1000000", q5: "0", q6: "fv.insert( fv.begin(), i );", q7: [0, 2, 3], q8: "不受对时影响" }
        ]
      }
    }
  ]
};
