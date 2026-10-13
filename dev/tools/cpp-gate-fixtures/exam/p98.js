/* cpp-exam-check 的自检样本：故意写坏的五处，用来证明考卷闸真的会红。
   ① 权重和 99（不是 100） ② 缺 coversTask（源稿两条任务一条都没对）
   ③ 只有一道 choice、没有 output ④ 参考解判不满 100 ⑤ 错解竟然判过。
   跑法：node dev/tools/cpp-exam-check.cjs --fixture */
window.MIAO_CPP_EXAM_P98 = {
  papers: [
    {
      cid: "c02", kind: "paper", pass: 60,
      title: "坏样本卷 · 权重不平、任务不对账",
      task: "任务题目：声明两个变量描述自己并打印",
      hint: "这一卷是闸的自检样本，读者看不到。",
      questions: [
        { id: "q1", type: "choice", score: 40, stem: "int 盒子能装哪个值？", options: ["3.14", "'你'", "200", "true"], answer: 2 },
        { id: "q2", type: "multi", score: 30, stem: "哪些说法对？", options: ["类型定死不能换", "名字大小写敏感", "bool 有三种值", "char 用双引号"], answers: [0, 1] },
        { id: "q3", type: "blank", score: 29, stem: "把值装进盒子的动作叫____。", accept: ["赋值"] }
      ],
      selftest: {
        refs: [{ q1: 2, q2: [0, 1], q3: "赋值" }],
        wrongs: [{ q1: 0, q2: [0, 1], q3: "赋值" }],
        loose: [{ q1: "2", q2: [0, 1], q3: "  赋 值  " }]
      }
    }
  ]
};
