/* 喵站 · C++ 掌握 考卷分部 p01：第 82 课（第九轮 T-23 掌握课黄金样板）
 * 规矩与入门 p01.js 完全一致（契约 / coversTask 对账 / 结构 / selftest / 读者可见字段），
 * 由 dev/tools/cpp-exam-check.cjs 逐条判。
 */
window.MIAO_CPPM_EXAM_P01 = {
  papers: [
    {
      cid: "m82", kind: "paper", mode: "code", authored: "dcba1cfb", pass: 60, title: "第 82 课考试 · 算法三件套", task: "任务题目：用 transform 把 nums 里每个数变成平方并打印结果；说清 count_if / find_if 各自的分工", hint: "回看本课【演示 1】（三件套的喂法）与【演示 2】（transform 的三头）。",
      questions: [
        { id: "q1", type: "code", score: 28, coversTask: 1, stem: "（任务题）nums 是 std::vector<int>，sq 是空的同类容器。写一行：用 transform 把 nums 的每个数变成平方，结果灌进 sq。", acceptRegex: ["transform\\s*\\(", "back_inserter\\s*\\(\\s*sq\\s*\\)", "v\\s*\\*\\s*v"], sample: "std::transform(nums.begin(), nums.end(), std::back_inserter(sq), [](int v){ return v * v; });", why: "三头都要给：读的范围、写的去处（back_inserter(sq)）、加工规则 v * v。" },
        { id: "q2", type: "code", score: 22, coversTask: 1, stem: "（任务题）写出安全取值的那一步：it 是 find_if 的返回值，只有在「不是没找到」的时候才打印 *it。把 if 那一行写出来。", acceptRegex: ["if\\s*\\(\\s*it\\s*!=\\s*\\w+\\.end\\s*\\(\\s*\\)\\s*\\)"], sample: "if (it != nums.end())", why: "先比 end 再取值；直接 *it 在没找到时取的是不属于数组的位置，可能崩。" },
        { id: "q3", type: "code", score: 28, coversTask: 1, stem: "（任务题）sq 里已经灌好了平方。写一句：把 sq 里每个数挨个打印出来，用 range-for 和 std::print。", acceptRegex: ["for\\s*\\(\\s*int\\s+\\w+\\s*:\\s*sq\\s*\\)", "print"], sample: "for (int v : sq) std::print(\"{} \", v);", why: "range-for 那对圆括号里写的是「每圈拿出来的那个元素」和「从哪个容器拿」；std::print 打完不换行，正好把六个数摊成一行。" },
        { id: "q4", type: "code", score: 22, coversTask: 1, stem: "（任务题）transform 第一头要给「读哪段」：把 nums 整段的头和尾后写出来，两个位置用逗号排在一起。", acceptRegex: ["nums\\s*\\.\\s*begin\\s*\\(\\s*\\)\\s*,\\s*nums\\s*\\.\\s*end\\s*\\(\\s*\\)"], sample: "std::transform(nums.begin(), nums.end(), std::back_inserter(sq), [](int v){ return v * v; });", why: "头是第一个属于 nums 的位置，尾后是第一个不属于它的位置 —— 「头 + 尾后」这对范围是标准算法全家的通用喂法，写成 nums.end() 在前就倒着读了。" }
      ],
      selftest: {
        refs: [
          {q1: "std::transform(nums.begin(), nums.end(), std::back_inserter(sq), [](int v){ return v * v; });", q2: "if (it != nums.end())", q3: "for (int v : sq) std::print(\"{} \", v);", q4: "std::transform(nums.begin(), nums.end(), std::back_inserter(sq), [](int v){ return v * v; });"}],
        wrongs: [
          {q1: "std::transform(nums.begin(), nums.end(), sq.begin(), [](int v){ return v; });", q2: "std::cout << *it;", q3: "for (int v : nums) std::print(\"{} \", v);", q4: "std::transform(nums.begin(), sq.end(), std::back_inserter(sq), [](int v){ return v * v; });"},
          {q1: "for (int v : nums) sq.push_back(v);", q2: "if (it == nums.end())", q3: "for (int v : nums) std::print(\"{} \", v);", q4: "std::transform(nums.begin(), sq.end(), std::back_inserter(sq), [](int v){ return v * v; });"}],
        loose: [
          {q1: "transform( nums.begin() , nums.end() , back_inserter( sq ) , [](int v){return v*v;} );", q2: "if(it!=nums.end()){ }", q3: "for( int  q : sq ){   std :: print ( \"{}\", q ) ; }", q4: "transform( nums . begin ( ) ,  nums . end ( ) , back_inserter(sq), [](int v){return v*v;} );"}]
      }
    },
  ]
};
