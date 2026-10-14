/* 喵站 · C++ 掌握 考卷分部 p21：第 153–154 课（第九轮）
 * 两份源稿各只有 1 条【任务】，正文【任务】栏在它之外补了延伸，所以 coversTask 里
 * 1 是本课源稿那条，2 是正文的计数器条，3、4 是两条延伸；判满 50 分这件事由盖 1 的题撑起来。
 * 契约：每题分数合计正好 100、任务题合计 ≥50 分、choice ≥2、output ≥1、每题带 why、
 * refs 判 100 / wrongs 判 <60 / loose 判 ≥60。
 * 卷面里所有数字（比较次数、搬运格子数、调用次数、最深层数、比较器被问次数、崩溃现场、
 * 五行合并前打印、五人榜、同键顺序被打乱后的名单）都是本机 g++ -std=c++23 实跑出来的，与正文一致。
 */
window.MIAO_CPPM_EXAM_P21 = {
  papers: [
    {
      cid: "m153", kind: "paper", mode: "quiz", authored: "e743cb68", pass: 60, task: "任务题目：在合并前把 lo、hi 和两半内容打印出来，看拆到合的全过程 —— 拿 5 2 8 1 9 3 跑一遍，说明白最后一行的两半为什么已经是排好的", hint: "想不起来就回看本课【演示 2 · 本课任务：合并前把 lo、hi 和两半内容打出来】和【演示 3 · 数一数】，那五行打印和四种计数都在那两段里。",
      questions: [
        { id: "q1", type: "choice", score: 10, stem: "合并那三个 while 里，后面两个收尾循环管的是什么？", options: ["一半扫空之后，另一半剩下的本来就有序，整段抄进 tmp，一次比较也不做", "防止 i 或 j 冲出容器右边界", "把还没排好的两半再排一遍", "纯属保险，删掉结果照样对"], answer: 0, why: "两半都已经有序，剩下那段每个元素都不比已经进 tmp 的小，直接抄就是。实测删掉「左半剩下的」那个循环，六个数排成 1 2 0 3 0 0 —— 没抄的那些格子留着 tmp 里上一段的旧值。" },
        { id: "q2", type: "output", score: 50, coversTask: [1], stem: "（任务题）照演示 2 在合并前打印 lo、hi 和两半内容，输入 5 2 8 1 9 3，那五行打印分别是什么？一行一段，按出现的先后写。", acceptLines: ["段 0..1 合并前：左 0..0 = 5   右 1..1 = 2", "段 0..2 合并前：左 0..1 = 2 5   右 2..2 = 8", "段 3..4 合并前：左 3..3 = 1   右 4..4 = 9", "段 3..5 合并前：左 3..4 = 1 9   右 5..5 = 3", "段 0..5 合并前：左 0..2 = 2 5 8   右 3..5 = 1 3 9"], why: "实测五行，从最短的段开始冒出来 —— 打印插在两次递归之后，所以轮到谁的时候谁的两半已经排好了。最后一行左 2 5 8、右 1 3 9 就是本课的命门：两半各自有序，合并才只需往两头各看一眼。" },
        { id: "q3", type: "choice", score: 10, stem: "一千个数换三种输入实测：已经排好的、倒着排好的、固定伪随机造的。本机数字里唯一变了的是哪一项？", options: ["比较次数 —— 5044 次、4932 次、8710 次；搬运格子数 19952、调用 1999 次、最深 11 层三样一分没动", "搬运格子数变了，比较次数三种输入完全一样", "最深层数随数据从 11 层涨到几十层", "三项都在变，归并跟快排一样看数据脸色"], answer: 0, why: "怎么拆只看段长、跟数据长什么样无关，所以调用次数、搬运格子数、层数是定死的；比较那一头反而能省 —— 两段都有序时一半扫空，剩下的整段直接抄。" },
        { id: "q4", type: "multi", score: 12, stem: "关于归并这一课，本机实测说对的是？（多选，错勾任何一项整题 0 分）", options: ["合并全程一次都不交换格子，被写的是额外容器 tmp，最后再整段抄回 v", "tmp 如果当局部变量在函数里现造，实测一千个数要新建 999 次，正好等于合并的次数", "同一千个数，std::sort 问比较器 10877 次，归并只比了 8695 次，排出来的结果一模一样", "归并跟快排一样，输入已经排好就会退化，一千个数能套到一千层"], answers: [0, 1, 2], why: "前三条都是实跑的数：搬 19952 个格子是归并付的那笔钱；第四条不成立，倒着排的一千个数照样 11 层，因为拆的形状不看数据 —— 这是归并拿额外容器换来的确定性。" },
        { id: "q5", type: "blank", score: 9, stem: "平手时让左边先落座，同键元素的相对顺序就不会变 —— 排序算法有这个性质就叫____。归并天生有，靠的是 v[i] <= v[j] 里那个等号。", accept: ["稳定", "稳定性", "stable", "stable sort"], why: "实测把等号让给右边，键序列 2 1 2 1 2 1 里三个键 1 的原下标就从 1、3、5 翻成 5、3、1。等号在不在，决定的正是这个性质。" },
        { id: "q6", type: "choice", score: 9, stem: "main 里那句 static_cast 把 hi 定成 v.size() - 1，为什么不直接写 v.size() - 1？", options: ["size() 是无符号数，空容器上减一不会变负而是绕回类型最大值，上一课刚数过那个数", "因为 v.size() 返回 float，不能当整数用", "因为 merge_sort 的第三个参数只能收 char", "为了省一次除法运算"], answer: 0, why: "先转成 int 再减一，空容器上算出 -1，正好落进 lo >= hi 那句出口；实测空容器进来只调用 1 次、比较 0 次就收手。" }
      ],
      selftest: {
        refs: [
          {q1: 0, q2: "段 0..1 合并前：左 0..0 = 5   右 1..1 = 2\n段 0..2 合并前：左 0..1 = 2 5   右 2..2 = 8\n段 3..4 合并前：左 3..3 = 1   右 4..4 = 9\n段 3..5 合并前：左 3..4 = 1 9   右 5..5 = 3\n段 0..5 合并前：左 0..2 = 2 5 8   右 3..5 = 1 3 9", q3: 0, q4: [0, 1, 2], q5: "稳定", q6: 0}],
        wrongs: [
          {q1: 3, q2: "段 0..5 合并前：左 0..2 = 5 2 8   右 3..5 = 1 9 3", q3: 1, q4: [3], q5: "递归", q6: 3}],
        loose: [
          {q1: "0", q2: " 段 0..1 合并前：左 0..0 = 5 右 1..1 = 2 \n段 0..2 合并前：左 0..1 = 2 5 右 2..2 = 8\n 段 3..4 合并前：左 3..3 = 1 右 4..4 = 9\n段 3..5 合并前：左 3..4 = 1 9 右 5..5 = 3\n段 0..5 合并前：左 0..2 = 2 5 8 右 3..5 = 1 3 9 ", q3: "0", q4: [2, 1, 0], q5: "稳定性", q6: "0"}]
      }
    },
    {
      cid: "m154", kind: "paper", mode: "code", authored: "2917cf51", pass: 60, task: "任务题目：给那张比赛榜补第三条规则 —— 同分同罚时按名字字典序，提示就是 return a.name < b.name;。补完拿五个人跑一遍，把五行榜抄下来，说出哪两个人是靠第三条分出来的", hint: "想不起来就回看本课【演示 2 · 本课任务：补第三条规则，同分同罚时按名字】和【演示 1 · 源稿这段：两条规则】，五人榜的实测顺序就写在演示 2 那段里。",
      questions: [
        { id: "q1", type: "code", score: 21, coversTask: [1], stem: "（任务题）把第三条规则补进比较器：前两条都打平的时候，按名字的字典序定出谁在前。写出那一句 return。", acceptRegex: ["return\\s+a\\.name\\s*<\\s*b\\.name\\s*;"], sample: "return a.name < b.name;", why: "源稿那句提示原样落地就是这一行。注意顺序：它必须排在另外两条之后，而且前两条都得是「不同才定案」的写法，控制流才轮得到它。" },
        { id: "q2", type: "code", score: 9, stem: "写出比较器第一条规则的 return 那半句：分高的排在前头。", acceptRegex: ["a\\.score\\s*>\\s*b\\.score"], why: "它回答的是 a 在前吗，想要降序就得写 a.score > b.score。实测照冒泡的口径写成 a.score < b.score，榜整个反过来：小红 280 分排第一，两个 300 分的掉到最后。" },
        { id: "q3", type: "code", score: 17, coversTask: 1, stem: "写一行：给这张榜调排序，三个参数一个不能少 —— 从哪到哪，再加那条由比较器填进去的排序规则（规则体用注释省略就行）。", acceptRegex: ["std\\s*::\\s*sort\\s*\\(", "\\.\\s*begin\\s*\\(\\s*\\)\\s*,", "\\.\\s*end\\s*\\(\\s*\\)\\s*,", "\\[\\s*\\]"], sample: "std::sort(ps.begin(), ps.end(), [](const Player& a, const Player& b) { /* 规则 */ });", why: "只给两个参数的 sort 按默认大小排，榜会按字段声明顺序走。规则是第三个参数，位置错不了；那个空的中括号加一对圆括号就是 lambda，比较器就写在它的花括号里。" },
        { id: "q4", type: "code", score: 18, coversTask: 1, stem: "写整行：第二条规则 —— 分数打平的人里，罚时少的排在前头；只有罚时也不一样时才当场定案。", acceptRegex: ["a\\s*\\.\\s*penalty\\s*!=\\s*b\\s*\\.\\s*penalty", "return\\s+a\\s*\\.\\s*penalty\\s*<\\s*b\\s*\\.\\s*penalty"], sample: "if (a.penalty != b.penalty) return a.penalty < b.penalty;", why: "!= 是这条规则的开关：罚时不同才把结论交出去，一样就继续往后轮。写成 == 的话同罚时的人永远轮不到第三条名字规则，而把小于写成大于会让罚时多的压在前面。" },
        { id: "q5", type: "code", score: 18, stem: "把两条规则的先后调换：先比罚时，罚时打平才比分。在比较器的花括号里写满两行，第一行判罚时不同就 return，第二行直接 return 比分那句。", acceptRegex: ["if\\s*\\(\\s*a\\s*\\.\\s*penalty\\s*!=\\s*b\\s*\\.\\s*penalty\\s*\\)\\s*return\\s+a\\s*\\.\\s*penalty\\s*<\\s*b\\s*\\.\\s*penalty", "return\\s+a\\s*\\.\\s*score\\s*>\\s*b\\s*\\.\\s*score"], sample: "if (a.penalty != b.penalty) return a.penalty < b.penalty;\nreturn a.score > b.score;", why: "比较器从上往下走，先写的那条先判 —— 顺序本身就是优先级。两条规则的写法一个字没动，只是换了先后，小红 280 分却因为罚时少而挤到前面去。" },
        { id: "q6", type: "code", score: 17, stem: "同分的人想保住原来的先后：把记着原始位置的那个下标写成最后一条规则。写出那一句 return。", acceptRegex: ["return\\s+a\\s*\\.\\s*idx\\s*<\\s*b\\s*\\.\\s*idx\\s*;"], sample: "return a.idx < b.idx;", why: "下标互不相等，任何两个人都能判出胜负，排序就不会再随手把同键的人打乱；把它写在最后，等于只在前面几条都打平时才启用。" }
      ],
      selftest: {
        refs: [
          {q1: "return a.name < b.name;", q2: "a.score > b.score", q3: "std::sort(ps.begin(), ps.end(), [](const Player& a, const Player& b) { return a.score > b.score; });", q4: "if (a.penalty != b.penalty) return a.penalty < b.penalty;", q5: "if (a.penalty != b.penalty) return a.penalty < b.penalty;\nreturn a.score > b.score;", q6: "return a.idx < b.idx;"}],
        wrongs: [
          {q1: "return a.score > b.score;", q2: "a.score < b.score", q3: "std::sort(ps.begin(), ps.end());", q4: "if (a.penalty == b.penalty) return a.penalty > b.penalty;", q5: "if (a.score != b.score) return a.score > b.score;\nreturn a.penalty < b.penalty;", q6: "return a.score < b.score;"}],
        loose: [
          {q1: "return  a.name<b.name ;", q2: "a.score>b.score", q3: "std  ::  sort  (  ps . begin ( )  ,  ps . end ( )  ,  [ ] ( const Player & a ,  const Player & b )  {  }  )  ;", q4: "if  ( a.penalty  !=  b.penalty  )  return a . penalty< b . penalty ;", q5: "if ( a.penalty!=b.penalty )  return a.penalty  <  b.penalty ;\n   return a . score > b . score ;", q6: "return   a.idx<b.idx ;"}]
      }
    },
  ]
};
