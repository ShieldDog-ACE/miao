/* 喵站 · C++ 掌握 考卷分部 p36：第 199–202 课（L6-04 图与遍历）
 * 规矩与 cppm-exam/p01.js 完全一致（契约 / coversTask 对账 / 结构 / selftest / 读者可见字段），
 * 由 dev/tools/cpp-exam-check.cjs 逐条判。输出与访问序均为本机 g++ -std=c++23 实测。
 */
window.MIAO_CPPM_EXAM_P36 = {
  papers: [
    {
      cid: "m199", kind: "paper", pass: 60,
      title: "第 199 课考试 · 图与邻接表",
      task: "任务题目：给邻接表加一对好友 2-3，运行看名单变化",
      hint: "想不起来就回看本课【演示 1】（建名单）与【演示 2】（无向边记两笔）。",
      questions: [
        { id: "q1", type: "choice", score: 10,
          stem: "邻接表的形象说法是哪一句？",
          options: ["给每个点挂一张「我的好友名单」", "把所有边抄成一张大表按行去扫", "只记每个点有几个朋友，不记是谁", "按点的编号排队访问"],
          answer: 0,
          why: "邻接表给每个点存一张名单，装的是朋友的编号；只记个数就丢掉了「连着谁」这个关键信息。" },
        { id: "q2", type: "choice", score: 10,
          stem: "无向图里 0 和 1 是好友，这条边在邻接表里要记几笔？",
          options: ["1 笔，记在编号小的那头", "2 笔，两头的名单各记一次", "4 笔", "0 笔，靠数组下标自动成立"],
          answer: 1,
          why: "无向边双向通行：0 的名单里有 1，1 的名单里也要有 0，漏一笔这条路就少一半。" },
        { id: "q3", type: "code", score: 20, coversTask: 1,
          stem: "（任务题）adj 已按本课办法建好 4 个点。补两行：把 2 和 3 记成好友。",
          acceptRegex: ["adj\\s*\\[\\s*2\\s*\\]\\s*\\.\\s*push_back\\s*\\(\\s*3\\s*\\)", "adj\\s*\\[\\s*3\\s*\\]\\s*\\.\\s*push_back\\s*\\(\\s*2\\s*\\)"],
          why: "两头的名单各追加一次对方编号；只写一行就是单行道，遍历会走不过去。" },
        { id: "q4", type: "output", score: 16, coversTask: 1,
          stem: "（任务题）加上好友 2-3 之后重跑打印，写出关于 2 和 3 的那两行。",
          acceptLines: ["2 的好友: 1 3", "3 的好友: 2"],
          why: "push_back 排队尾：2 的名单在原有 1 后面追加 3；3 的名单从空变成只有 2。均为实测输出。" },
        { id: "q5", type: "choice", score: 10,
          stem: "std::vector<std::vector<int>> adj(4); 这一句建出了什么？",
          options: ["4 个点，每人一张空名单", "4 行 4 列全是 0 的表格", "一个装着数字 4 的向量", "4 条边"],
          answer: 0,
          why: "外层开 4 个格子就是 4 个点，每格自带一张空名单；它不会自动填任何 0。" },
        { id: "q6", type: "multi", score: 14,
          stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["名单的长度等于这个点的朋友个数", "加一对无向好友要写两行 push_back", "adj(4) 建出来的名单里已经装好了各自的编号", "念名单用范围 for 直接走 adj[i] 就行"],
          answers: [0, 1, 3],
          why: "adj(4) 开出来的是空名单，编号要靠你 push_back 亲手记进去。" },
        { id: "q7", type: "blank", score: 4,
          stem: "想往名单末尾追加一个朋友的编号，用的成员函数叫 ____。（填函数名，不带 std::）",
          accept: ["push_back"],
          why: "push_back 永远把新编号排到队尾。" },
        { id: "q8", type: "output", score: 16, coversTask: 1,
          stem: "（任务题）看变化之前先记住原样。没加 2-3 时，本课程序完整打印的四行是什么？",
          acceptLines: ["0 的好友: 1", "1 的好友: 0 2", "2 的好友: 1", "3 的好友:"],
          why: "3 一笔边都没记，这一行照样打出来——空名单也是名单。均实测。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: 1, q3: "adj[2].push_back(3);\nadj[3].push_back(2);", q4: "2 的好友: 1 3\n3 的好友: 2", q5: 0, q6: [0, 1, 3], q7: "push_back", q8: "0 的好友: 1\n1 的好友: 0 2\n2 的好友: 1\n3 的好友:" }
        ],
        wrongs: [
          { q1: 2, q2: 0, q3: "adj[2].push_back(3);", q4: "2 的好友: 1 3\n3 的好友: 3", q5: 1, q6: [0, 3], q7: "append", q8: "0 的好友: 1\n1 的好友: 0 2\n2 的好友: 1 3\n3 的好友: 2" }
        ],
        loose: [
          { q1: "0", q2: "1", q3: "adj[ 2 ].push_back( 3 );\nadj[ 3 ].push_back( 2 );", q4: "2 的好友: 1 3\n3 的好友: 2", q5: "0", q6: [0, 1, 3], q7: "push_back", q8: "0 的好友: 1\n1 的好友: 0 2\n2 的好友: 1\n3 的好友:" }
        ]
      }
    }
  ]
};
