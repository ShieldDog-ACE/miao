/* 喵站 · C++ 掌握 考卷分部 p08：第 105–108 课
 * 契约与前面各场一致：权重和 100、任务逐条 coversTask、带任务的题合计过 50、
 * selftest 里 refs 判 100、wrongs 判不到 60、loose 判过 60。
 * 题干只用读者到第 108 课为止见过的东西。
 */
window.MIAO_CPPM_EXAM_P08 = {
  papers: [
    {
      cid: "m105", kind: "paper", mode: "quiz", authored: "70089f1b", pass: 60, title: "第 105 课考试 · sort 与自定义比较器", task: "任务题目：给一张成绩单按分数降序排、同分再按名字升序排；然后把 sort 换成 std::stable_sort，说清同分者的先后有什么变化", hint: "回看本课【演示 3 · 两个关键字排成绩单】和「它被设计成什么样」那两段。",
      questions: [
        { id: "q1", type: "choice", score: 15, stem: "std::sort 的第三个参数（比较器）回答的是哪一个问句？", options: ["a 是不是比 b 大", "a 该不该排在 b 前面", "a 和 b 相不相等", "b 该不该被丢掉"], answer: 1, why: "读成「谁排前面」而不是「谁更大」，升序、降序、自定义就全通了；写成 a 大于 b 只在降序时碰巧对。" },
        { id: "q2", type: "output", score: 17, coversTask: 1, stem: "成绩单是 Ann 88、Bob 72、Cid 88、Dot 95，按上一题的比较器排完，只打印名字，一行一个，顺序是什么？", acceptLines: ["Dot", "Ann", "Cid", "Bob"], why: "95 最高先出；两个 88 分平局时比名字，Ann 在 Cid 前；72 的 Bob 垫底。" },
        { id: "q3", type: "choice", score: 15, stem: "把比较器写成带等号的形式，也就是相等时也返回 true，最准确的后果是哪一条？", options: ["只是慢一点，结果照样对", "相等的两格互相答「我该在你前面」，破坏严格弱序，可能乱序甚至越界崩掉", "编译器直接拒绝", "重复的元素会被自动删掉"], answer: 1, why: "严格弱序要求相等时两个方向都答 false；否则 sort 收到自相矛盾的答复，会去访问不该访问的位置。" },
        { id: "q4", type: "multi", score: 21, coversTask: 2, stem: "关于 std::stable_sort 和普通 std::sort，哪些说法对？（多选，错勾任何一项整题 0 分）", options: ["stable_sort 保证平局的元素保持原来的先后", "调用形状和 sort 一样，只是换个函数名", "stable_sort 一般要多付一份内存或一点时间", "stable_sort 会把相等的元素合并成一个"], answers: [0, 1, 2], why: "买 stable_sort 买的是「相等绝不互换」这个承诺；去重是另一课的事，跟它没关系。" },
        { id: "q5", type: "blank", score: 10, stem: "两个元素完全相当时，比较器必须答____（填一个 bool 字面量），这才叫合法的严格弱序。", accept: ["false", "假", "否"], why: "相等时两个方向都得答 false，也就是「不必排在前面」；谁先出现 sort 不保证。" },
        { id: "q6", type: "match", score: 22, coversTask: 1, stem: "把左边成绩单比较器里的写法，和它真正定下的先后连起来（右边顺序是打乱的）。", answer: {"if (a.score != b.score) 这一问写在最前面": "主键先问：分数不同就轮不到名字说话", "a.score > b.score": "分数高的一方排在前面，这是降序", "a.name < b.name": "分数打平的那一批里，名字按字典序从小到大", "把第二个返回改成 a.score < b.score": "分数低的排前面，整张榜单整个反过来"}, left: ["if (a.score != b.score) 这一问写在最前面", "a.score > b.score", "a.name < b.name", "把第二个返回改成 a.score < b.score"], right: ["分数高的一方排在前面，这是降序", "分数打平的那一批里，名字按字典序从小到大", "分数低的排前面，整张榜单整个反过来", "主键先问：分数不同就轮不到名字说话"], why: "两把关键字先后有讲究：主键分不出胜负，才轮到次键。比较器答的永远是「a 该不该排在 b 前面」，所以把小于号换到分数那一问上，整张榜单就整个倒过来。" }
      ],
      selftest: {
        refs: [
          {q1: 1, q2: "Dot\nAnn\nCid\nBob", q3: 1, q4: [0, 1, 2], q5: "false", q6: {"if (a.score != b.score) 这一问写在最前面": "主键先问：分数不同就轮不到名字说话", "a.score > b.score": "分数高的一方排在前面，这是降序", "a.name < b.name": "分数打平的那一批里，名字按字典序从小到大", "把第二个返回改成 a.score < b.score": "分数低的排前面，整张榜单整个反过来"}}],
        wrongs: [
          {q1: 0, q2: "Dot\nCid\nAnn\nBob", q3: 0, q4: [0, 3], q5: "true", q6: {"if (a.score != b.score) 这一问写在最前面": "分数打平的那一批里，名字按字典序从小到大", "a.score > b.score": "分数低的排前面，整张榜单整个反过来", "a.name < b.name": "主键先问：分数不同就轮不到名字说话", "把第二个返回改成 a.score < b.score": "分数高的一方排在前面，这是降序"}},
          {q1: 2, q2: "Ann\nCid\nDot\nBob", q3: 2, q4: [2, 3], q5: "0", q6: {"if (a.score != b.score) 这一问写在最前面": "分数打平的那一批里，名字按字典序从小到大", "a.score > b.score": "分数低的排前面，整张榜单整个反过来", "a.name < b.name": "主键先问：分数不同就轮不到名字说话", "把第二个返回改成 a.score < b.score": "分数高的一方排在前面，这是降序"}}],
        loose: [
          {q1: "1", q2: " Dot \n\n Ann \nCid\n  Bob ", q3: "1", q4: [0, 1, 2], q5: "FALSE", q6: {"0": 3, "1": 0, "2": 1, "3": 2}}]
      }
    },
    {
      cid: "m106", kind: "paper", mode: "quiz", pass: 60, title: "第 106 课考试 · lower_bound 与 upper_bound", task: "任务题目：造一个有重复的有序数组，用 upper_bound 减 lower_bound 数出 7 有几个；再验证数组没排序就二分会出什么错", hint: "回看【演示 2 · 数出一共有几个 7】与【演示 3 · 数组没排序会怎样】。",
      questions: [
        { id: "q1", type: "choice", score: 14, stem: "二分每比一次就敢扔掉一半，靠的是哪一条？", options: ["数组长度是 2 的整数次幂", "数据已经排好序，所以看一眼中间那格就能断定另一半没答案", "标准库会先偷偷帮你排序", "查找的目标一定在数组里"], answer: 1, why: "「左边都比它小」这个推断只在有序时成立；铁律的执行者是写代码的你，标准库不报警。" },
        { id: "q2", type: "output", score: 20, coversTask: 1, stem: "d 的内容是 3 5 7 7 7 9 11。下面两行各打印什么？\nstd::println(\"{}\", std::upper_bound(d.begin(), d.end(), 7) - std::lower_bound(d.begin(), d.end(), 7));\nstd::println(\"{}\", std::lower_bound(d.begin(), d.end(), 7) - d.begin());", acceptLines: ["3", "2"], why: "三个 7 被两个 bound 一夹得 3；下标 2 同时也是「比 7 小的有两个」，位置语义白送的答案。" },
        { id: "q3", type: "choice", score: 16, stem: "在 a 是 1 3 5 7 9 11 时，std::lower_bound(a.begin(), a.end(), 100) 返回的是？", options: ["a.begin()", "a.end()", "-1", "编译不过，因为 100 不在表里"], answer: 1, why: "它给的是「该插在最后」那个位置，也就是 end；找不到的答案是一个位置而不是错误码，解引用前先判它等不等于 end。" },
        { id: "q4", type: "multi", score: 21, coversTask: 2, stem: "关于「数组没排序就做二分」，哪些说法对？（多选，错勾任何一项整题 0 分）", options: ["结果可能是错的，但没有编译错误也没有运行警告", "binary_search 可能对确实存在的数返回 false", "标准库会先把这段排序再查", "想二分就必须自己先 sort，或者靠来路保证有序"], answers: [0, 1, 3], why: "这是逻辑错误不是编译错误：它安静地给你一个错答案，只能靠看输出对不对来查。" },
        { id: "q5", type: "blank", score: 13, stem: "lower_bound 找的是第一个____目标的那个位置（含等于），upper_bound 找的是第一个严格大于目标的位置。", accept: ["不小于", "大于等于", "大于或等于"], why: "口诀：lower 含等号，upper 不含等号；记反了数重复个数就会少算或多算。" },
        { id: "q6", type: "output", score: 16, coversTask: 2, stem: "u 的内容是 5 2 8 1 9 3，故意没排序。下面打印什么？\nstd::println(\"{}\", std::binary_search(u.begin(), u.end(), 8));", acceptLines: ["false"], why: "8 明明在第 3 格，二分却说没有 —— 它砍掉的那一半里正好装着答案，这就是本课那条铁律的现场证据。" }
      ],
      selftest: {
        refs: [
          {q1: 1, q2: "3\n2", q3: 1, q4: [0, 1, 3], q5: "不小于", q6: "false"}],
        wrongs: [
          {q1: 2, q2: "7\n3", q3: 0, q4: [2], q5: "小于", q6: "true"},
          {q1: 3, q2: "5\n7", q3: 2, q4: [1, 2], q5: "等于", q6: "8"}],
        loose: [
          {q1: "1", q2: " 3 \n\n 2 ", q3: "1", q4: [0, 1, 3], q5: "大于等于", q6: " false "}]
      }
    },
    {
      cid: "m107", kind: "paper", mode: "quiz", authored: "a5776b73", pass: 60, title: "第 107 课考试 · minmax_element、accumulate、count_if", task: "任务题目：用「总和除以 size」求平均分，别让它被整数除法砍掉小数；再查出 accumulate 的第四个参数是什么，拿 std::multiplies<> 连乘一串数", hint: "回看【演示 1 · 求平均分：整除这个坑】与【演示 2 · accumulate 的第四个参数】。",
      questions: [
        { id: "q1", type: "choice", score: 15, stem: "std::accumulate 住在哪个头文件里？", options: ["algorithm", "numeric", "vector", "functional"], answer: 1, why: "名字听着像算法，家在 <numeric>；包错了会得到一句 'accumulate' is not a member of 'std'。" },
        { id: "q2", type: "output", score: 17, coversTask: 1, stem: "sc 的内容是 88 72 95 60 79，总分 394。下面两行打印什么？\nstd::println(\"{}\", std::accumulate(sc.begin(), sc.end(), 0) / sc.size());\nstd::println(\"{}\", static_cast<double>(std::accumulate(sc.begin(), sc.end(), 0)) / sc.size());", acceptLines: ["78", "78.8"], why: "第一行整数除法当场截断，看着「差不多」其实是坑；转成 double 之后才是真的 78.8。" },
        { id: "q3", type: "choice", score: 15, stem: "std::count_if 交给你的那个谓词，形状是哪一种？", options: ["两个元素进去、bool 出来", "一个元素进去、bool 出来", "一个元素进去、那个元素出来", "没有参数，返回个数"], answer: 1, why: "谓词回答「这一格算不算」；两个参数那是 sort 的比较器，写成那样会撞一整屏模板报错。" },
        { id: "q4", type: "multi", score: 21, coversTask: 2, stem: "关于 std::accumulate，哪些说法对？（多选，错勾任何一项整题 0 分）", options: ["第三个参数是起点，整条累计链用它那个类型", "第四个参数决定每一格怎么并进累计值", "不写第四个参数就是按加法累加", "起点必须写 0，写 1 会算错"], answers: [0, 1, 2], why: "求积就得让起点是 1 —— 0 乘任何数都是 0；「必须写 0」这条正好是 accumulate 最坑人的误会。" },
        { id: "q5", type: "blank", score: 10, stem: "在一只空的 vector 上调用 accumulate，它返回的是____值，所以空表求和天然是 0。", accept: ["起点", "起点值", "初值", "初始值", "第三个参数"], why: "起点既是第一次累计的底座，也是空区间唯一合理的答案 —— 这就是标准库要你给起点的原因之一。" },
        { id: "q6", type: "match", score: 22, coversTask: 2, stem: "把左边 accumulate 的写法，和它真正的后果连起来（右边顺序是打乱的）。", answer: {"第三个参数写 0": "累计链是 int，总和除以人数照样把小数砍掉", "第三个参数写 0.0": "整条累计链换成 double，平均分不再被砍掉小数", "第四个参数写成 std::multiplies<>()": "每一格改成乘进累计值，起点得从 1 起步", "第四个参数干脆不写": "每格照旧相加，返回的还是起点那种类型"}, left: ["第三个参数写 0", "第三个参数写 0.0", "第四个参数写成 std::multiplies<>()", "第四个参数干脆不写"], right: ["每一格改成乘进累计值，起点得从 1 起步", "累计链是 int，总和除以人数照样把小数砍掉", "每格照旧相加，返回的还是起点那种类型", "整条累计链换成 double，平均分不再被砍掉小数"], why: "起点决定整条累计链的类型，也决定空表时返回什么；第四个参数决定每一格怎么并进累计值，不写就是相加。想换成乘，起点必须连 0 一起换成 1 —— 起点是 0 时乘什么都还是 0。" }
      ],
      selftest: {
        refs: [
          {q1: 1, q2: "78\n78.8", q3: 1, q4: [0, 1, 2], q5: "起点", q6: {"第三个参数写 0": "累计链是 int，总和除以人数照样把小数砍掉", "第三个参数写 0.0": "整条累计链换成 double，平均分不再被砍掉小数", "第四个参数写成 std::multiplies<>()": "每一格改成乘进累计值，起点得从 1 起步", "第四个参数干脆不写": "每格照旧相加，返回的还是起点那种类型"}}],
        wrongs: [
          {q1: 0, q2: "78.8\n78", q3: 0, q4: [1, 3], q5: "0", q6: {"第三个参数写 0": "整条累计链换成 double，平均分不再被砍掉小数", "第三个参数写 0.0": "每格照旧相加，返回的还是起点那种类型", "第四个参数写成 std::multiplies<>()": "累计链是 int，总和除以人数照样把小数砍掉", "第四个参数干脆不写": "每一格改成乘进累计值，起点得从 1 起步"}},
          {q1: 3, q2: "394\n78.8", q3: 2, q4: [3], q5: "空", q6: {"第三个参数写 0": "整条累计链换成 double，平均分不再被砍掉小数", "第三个参数写 0.0": "每格照旧相加，返回的还是起点那种类型", "第四个参数写成 std::multiplies<>()": "累计链是 int，总和除以人数照样把小数砍掉", "第四个参数干脆不写": "每一格改成乘进累计值，起点得从 1 起步"}}],
        loose: [
          {q1: "1", q2: " 78 \n\n 78.8 ", q3: "1", q4: [0, 1, 2], q5: "初值", q6: {"0": 1, "1": 3, "2": 0, "3": 2}}]
      }
    },
    {
      cid: "m108", kind: "paper", mode: "quiz", pass: 60, title: "第 108 课考试 · unique 与 erase 两步走", task: "任务题目：只跑 sort 加 unique、不跑 erase，把全部元素打出来看看尾巴里藏着什么；再动手验证不排序能不能去重，解释为什么", hint: "回看【演示 1 · 不 erase，尾巴里藏着什么】与【演示 2 · 不排序能不能去重】。",
      questions: [
        { id: "q1", type: "choice", score: 16, stem: "std::unique 真正干的事是哪一句？", options: ["把重复元素从容器里删掉，容器变短", "把重复的往后搬，长度不变，返回「不重复的前一段到哪儿结束」的位置", "把整段排序", "只统计有多少个重复，一个元素都不动"], answer: 1, why: "算法只搬不删：它手里只有两个迭代器，改容器大小是容器自己的活，所以下一步要 erase。" },
        { id: "q2", type: "output", score: 19, coversTask: 1, stem: "a 的内容是 3 1 3 2 1 5 2，只跑了 sort 和 unique、没跑 erase。下面两行打印什么？\nfor (int v : a) std::print(\"{} \", v);\nstd::println(\"\");\nstd::println(\"{}\", a.size());", acceptLines: ["1 2 3 5 3 3 5", "7"], why: "前四格是去重结果，尾巴上的 3 3 5 是被搬走的旧值；size 一格没少，这就是「没真删」的现场。" },
        { id: "q3", type: "choice", score: 14, stem: "这套去重为什么第一步要 sort？", options: ["因为 unique 不接受乱序的迭代器，会编译失败", "因为 unique 只跟相邻的上一格比，相同的必须先成为邻居", "因为 sort 会顺手把重复删掉", "因为不 sort 的话 erase 会越界"], answer: 1, why: "它一趟扫描、不借额外内存，代价就是只认邻居；中间隔了一个别的数，那两个重复它就看不见。" },
        { id: "q4", type: "multi", score: 19, coversTask: 2, stem: "关于「不排序直接 unique」，哪些说法对？（多选，错勾任何一项整题 0 分）", options: ["只有本来就挨着的重复会被处理", "对 3 1 3 2 1 5 2 这只表，unique 一格都不会搬动", "标准库会报错提醒你先排序", "想要去重又保留第一次出现的先后，得走另一条登记表的路子"], answers: [0, 1, 3], why: "没有报错也没有警告：它只是什么重复都没发现，然后安静地返回 end。" },
        { id: "q5", type: "output", score: 17, coversTask: 2, stem: "b 的内容同样是 3 1 3 2 1 5 2，这次**不 sort**，直接 unique 再 erase 到 end。下面两行打印什么？\nauto last = std::unique(b.begin(), b.end());\nb.erase(last, b.end());\nfor (int v : b) std::print(\"{} \", v);\nstd::println(\"\");\nstd::println(\"{}\", b.size());", acceptLines: ["3 1 3 2 1 5 2", "7"], why: "没有一对相同的挨着，unique 一格没搬、边界落在 end，erase 收到空区间 —— 去重等于没发生。" },
        { id: "q6", type: "blank", score: 15, stem: "unique 改的是容器里的内容，erase 改的是容器的____；判断有没有真删，就看它有没有变小。", accept: ["长度", "大小", "size", "元素个数"], why: "一个动内容、一个动长度，两步缺一不可 —— 这就是「两步走」这个词的全部含义。" }
      ],
      selftest: {
        refs: [
          {q1: 1, q2: "1 2 3 5 3 3 5\n7", q3: 1, q4: [0, 1, 3], q5: "3 1 3 2 1 5 2\n7", q6: "长度"}],
        wrongs: [
          {q1: 0, q2: "1 2 3 5\n4", q3: 0, q4: [2], q5: "1 2 3 5\n4", q6: "顺序"},
          {q1: 2, q2: "1 1 2 2 3 3 5\n7", q3: 3, q4: [1, 2], q5: "1 2 3 5\n4", q6: "容量"}],
        loose: [
          {q1: "1", q2: " 1  2  3  5  3  3  5 \n\n 7 ", q3: "1", q4: [0, 1, 3], q5: "3 1 3 2 1 5 2 \n 7", q6: "SIZE"}]
      }
    },
  ]
};
