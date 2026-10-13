/* 喵站 · C++ 掌握 考卷分部 p01：第 82 课（第九轮 T-23 掌握课黄金样板）
 * 规矩与入门 p01.js 完全一致（契约 / coversTask 对账 / 结构 / selftest / 读者可见字段），
 * 由 dev/tools/cpp-exam-check.cjs 逐条判。
 */
window.MIAO_CPPM_EXAM_P01 = {
  papers: [
    {
      cid: "m82", kind: "paper", pass: 60,
      title: "第 82 课考试 · 算法三件套",
      task: "任务题目：用 transform 把 nums 里每个数变成平方并打印结果；说清 count_if / find_if 各自的分工",
      hint: "回看本课【演示 1】（三件套的喂法）与【演示 2】（transform 的三头）。",
      questions: [
        { id: "q1", type: "choice", score: 10,
          stem: "std::count_if 的职责是什么？",
          options: ["数一数有几个元素满足条件", "找到第一个满足条件的元素", "把每个元素加工一遍", "把容器排好序"],
          answer: 0,
          why: "count_if 只汇报「数了几个」，原容器一个数都不变。" },
        { id: "q2", type: "choice", score: 10,
          stem: "三个算法的喂法都一样，是下面哪一种？",
          options: ["范围头、范围尾后、你的 lambda", "先给容器名，再给条件", "只给一个 lambda", "给下标 0 和长度"],
          answer: 0,
          why: "「头 + 尾后 + 规则」是标准算法全家的通用套路；尾后指的是第一个不属于你的位置。" },
        { id: "q3", type: "code", score: 20, coversTask: 1,
          stem: "（任务题）nums 是 std::vector<int>，sq 是空的同类容器。写一行：用 transform 把 nums 的每个数变成平方，结果灌进 sq。",
          acceptRegex: ["transform\\s*\\(", "back_inserter\\s*\\(\\s*sq\\s*\\)", "v\\s*\\*\\s*v"],
          why: "三头都要给：读的范围、写的去处（back_inserter(sq)）、加工规则 v * v。" },
        { id: "q4", type: "output", score: 14, coversTask: 1,
          stem: "nums 是 {5, 2, 8}，sq 装着它们的平方。这一行打印什么？\nfor (int v : sq) std::print(\"{} \", v);",
          acceptLines: ["25 4 64"],
          why: "print 打完不换行、每个数后面跟一个空格，所以是一行三个数。" },
        { id: "q5", type: "choice", score: 12,
          stem: "find_if 没找到任何满足条件的元素时，它返回什么？",
          options: ["容器第一个位置", "容器的 end（尾后位置）", "0", "一个空 lambda"],
          answer: 1,
          why: "「等于 end 就是没找到」是标准算法全家通用的暗号，后面几百课都这么判。" },
        { id: "q6", type: "code", score: 16, coversTask: 1,
          stem: "（任务题）写出安全取值的那一步：it 是 find_if 的返回值，只有在「不是没找到」的时候才打印 *it。把 if 那一行写出来。",
          acceptRegex: ["if\\s*\\(\\s*it\\s*!=\\s*\\w+\\.end\\s*\\(\\s*\\)\\s*\\)"],
          why: "先比 end 再取值；直接 *it 在没找到时取的是不属于数组的位置，可能崩。" },
        { id: "q7", type: "multi", score: 14,
          stem: "下面哪些说法是对的？（多选，错一项整题 0 分）",
          options: ["count_if 会改动原来的容器", "transform 不改动原容器，结果写到去处", "find_if 返回的是一个位置", "用这三个算法不需要 #include <algorithm>"],
          answers: [1, 2],
          why: "count_if 只汇报数字；algorithm 这个头文件必须包，少了编译就报名字找不到。" },
        { id: "q8", type: "blank", score: 4, coversTask: 1,
          stem: "往一个空的 vector 里灌 transform 的结果，去处那一站通常写 std::____(容器名)。（填函数名，不带 std::）",
          accept: ["back_inserter"],
          why: "back_inserter 让容器自己伸缩，不用先算好格子数。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: 0, q3: "std::transform(nums.begin(), nums.end(), std::back_inserter(sq), [](int v){ return v * v; });", q4: "25 4 64", q5: 1, q6: "if (it != nums.end())", q7: [1, 2], q8: "back_inserter" }
        ],
        wrongs: [
          { q1: 2, q2: 1, q3: "std::transform(nums.begin(), nums.end(), sq.begin(), [](int v){ return v; });", q4: "25 4 64 ", q5: 0, q6: "std::cout << *it;", q7: [0, 1], q8: "inserter_back" },
          { q1: 3, q2: 3, q3: "for (int v : nums) sq.push_back(v);", q4: "5 2 8", q5: 2, q6: "if (it == nums.end())", q7: [3], q8: "" }
        ],
        loose: [
          { q1: "0", q2: "0", q3: "transform( nums.begin() , nums.end() , back_inserter( sq ) , [](int v){return v*v;} );", q4: "25  4  64", q5: "1", q6: "if(it!=nums.end()){ }", q7: [1, 2], q8: "back_inserter" }
        ]
      }
    }
  ]
};
