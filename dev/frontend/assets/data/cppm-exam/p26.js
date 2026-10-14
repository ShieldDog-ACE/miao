/* 喵站 · C++ 掌握 考卷分部 p26：第 163–164 课（第九轮）
 * 源稿任务数：163 有 1 条、164 有 1 条，coversTask 均按序号 1 对上，两场各自任务题合计都过 50 分。
 * 契约：每题分数合计正好 100、choice ≥2、output ≥1、每题带 why、
 *       refs 判 100 / wrongs 判 <60 / loose 判 ≥60。
 * 卷面里所有数字（最短长度、五行轨迹、三种 target 的判决、pre 全表、15 个区间的错数、
 * 溢出后打印的 1410065408 与 -2147477296）都是本机 g++ -std=c++23 实跑出来的，与正文一致。
 */
window.MIAO_CPPM_EXAM_P26 = {
  papers: [
    {
      cid: "m163", kind: "paper", mode: "code", authored: "d25f5fc2", pass: 60, task: "任务题目：把 target 改成 100（无解），把打印改成 best == 100 时输出「无解」；做完再换成初值 n + 1、判据 best > n 的版本，说清这两种判决差在哪一句上", hint: "想不起来就回看本课【演示 1 · 源稿这段：六个数、target 是 7】和【演示 3 · 本课任务：target 改 100，无解要说「无解」】，五行轨迹在【演示 2 · 把每一步打到屏幕上】。",
      questions: [
        { id: "q1", type: "code", score: 34, coversTask: 1, stem: "（任务题的核心）写出达标之后 while 里面那两句：先记下当前窗口长度取 min，再把左端那个数吐出去、left 顺势往前挪一格。", acceptRegex: ["best\\s*=\\s*std::min\\s*\\(\\s*best\\s*,\\s*right\\s*-\\s*left\\s*\\+\\s*1\\s*\\)", "sum\\s*-=\\s*v\\s*\\[\\s*left\\s*\\+\\+\\s*\\]"], sample: "best = std::min(best, right - left + 1);\n            sum -= v[left++];", why: "两句的顺序就是本课的命门：达标是记答案的时机，不是缩手的时机，先记后吐。实测把记长度那句挪到 while 之后，target 给 7 会报出 1 —— 量的是已经不达标的窗口，而且不报错也不崩。大括号、变量名不查，只看这两句在不在。" },
        { id: "q2", type: "code", score: 33, coversTask: 1, stem: "写出外层那条 for 的循环头：right 从 0 起，一格一格走到数组末尾。容器长度是无符号的，条件里得把它转成整数再比。只写 for 这一行，循环体不用写。", acceptRegex: ["for\\s*\\(\\s*int\\s+right\\s*=\\s*0\\s*;", "right\\s*<", "static_cast\\s*<\\s*int\\s*>"], sample: "for (int right = 0; right < static_cast<int>(v.size()); ++right) {", why: "size() 给的是无符号数，直接拿 int 的 right 去比，右边会被整体提升成无符号；一旦 left 或长度算穿到负数，比较结果就整个翻掉。先转成 int，两边才在同一把尺子上。" },
        { id: "q3", type: "code", score: 33, coversTask: 1, stem: "写一行判决：窗口跑完之后，best 还站在初值 100 上就说明没有任何一段达标，打「无解」；否则把最短长度打出来。", acceptRegex: ["best\\s*==\\s*100", "无解", "std\\s*::\\s*println\\s*\\("], sample: "std::println(\"{}\", best == 100 ? \"无解\" : std::to_string(best));", why: "best 一辈子没被 min 动过，就说明 while 的门一次都没开过 —— 整串数的和都够不着 target。判决读的就是「初值还在不在」这件事。" }
      ],
      selftest: {
        refs: [
          {q1: "best = std::min(best, right - left + 1);\n            sum -= v[left++];", q2: "for (int right = 0; right < static_cast<int>(v.size()); ++right) {", q3: "std::println(\"{}\", best == 100 ? \"无解\" : std::to_string(best));"}],
        wrongs: [
          {q1: "best = right - left + 1;\n            sum -= v[left];", q2: "for (int right = 0; right < v.size(); ++right) {", q3: "std::println(\"和 ≥ {} 的最短长度 = {}\", target, best);"}],
        loose: [
          {q1: "best=std::min(best,right-left+1);\n sum -= v[left++];", q2: "for  (  int right=0 ;  right  <  static_cast  <int>  ( v.size ( )  )  ; ++right  )", q3: "std  ::  println  (  \"{}\" ,  best==100 ?  \"无解\"  :  std::to_string(best)  )  ;"}]
      }
    },
    {
      cid: "m164", kind: "paper", mode: "quiz", pass: 60, task: "任务题目：打印整个 pre 数组，照演示 2 每填一格就把整张表打一行，观察它怎么长出来，然后回答为什么填到第 i 行时后面全是 0", hint: "想不起来就回看本课【演示 2 · 本课任务：打印整个 pre，看它怎么长出来】和【演示 4 · 不多开一格会怎样】，五行全表与 15 个区间的对跑都是实跑打印。",
      questions: [
        { id: "q1", type: "choice", score: 12, stem: "pre 有 n + 1 格，pre[i] 存的到底是什么？", options: ["前 i 个数的和，它站在 v 的第 i - 1 格与第 i 格之间那条缝上", "第 i 格那个数自己", "从第 i 格加到最后一格的和", "v 的第 i 格加 1，好跟下标对齐"], answer: 0, why: "pre[3] = 8 是前三个数 3 加 1 加 4，不是第 3 格那个 1。默念「pre 站在缝上」，查询式 pre[r + 1] - pre[l] 就不用背了。" },
        { id: "q2", type: "output", score: 21, coversTask: 1, stem: "源稿那段（3 1 4 1 5）跑下来，打印两行，原样写出来。", acceptLines: ["到第 3 个为止共 8", "第 2~4 个的和 = 6"], why: "实测就这两行。注意数法：源稿注释里的「第 2~4 个」从 1 数起，换成下标是 v[1] 到 v[3]，代码写的是 pre[4] - pre[1] —— 右界加 1、左界原样。" },
        { id: "q3", type: "output", score: 17, coversTask: 1, stem: "（任务题的看表环节）照演示 2 把整张表一行一行打出来，写出第三行和最后一行「此刻整个 pre：」后面那串数（每行六个数，空格隔开）。", acceptLines: ["0 3 4 8 0 0", "0 3 4 8 9 14"], why: "本机实跑五行全表，这里取第三行与收尾。填到第 i 行时后面全是 0，因为表是从地基往右一格一格推出来的，任何时刻还没推到的格子都还是初始的 0 —— 这也解释了建表循环为什么不能倒着走。" },
        { id: "q4", type: "choice", score: 15, coversTask: 1, stem: "演示 4 里把两种开法对跑 15 个区间：多开一格的那版零错；只开 n 格又漏掉 l 为 0 的分支那版，实测错几个、根子在哪？", options: ["15 个全错：b[r] - b[l] 算的其实是「第 l + 1 格到第 r 格」，每条都少算左端那一格；l 为 0 那几条正确写法还得减一个不存在的 b[-1]", "只错 l 为 0 的那几条，其余全对", "一条都不错，只是每次查询慢一点", "编译器直接报错，根本跑不起来"], answer: 0, why: "实测 15 个区间错 15 个，查 [2,4] 得 6 而真值 10，查 [1,1] 干脆得 0。「不多开」不是不能写，而是必须自带一条分支；多开那一格，就是把这条分支焊死成「减 pre[0]，它等于 0」。" },
        { id: "q5", type: "multi", score: 15, stem: "关于用 int 存 pre 表的实测后果（一百万个一万），说法对的是？（多选，错勾任何一项整题 0 分）", options: ["int 版 pre[1000000] 打出 1410065408，真值是一万亿", "int 版第一次「越加越小」落在 pre[214749]，那格真值 2147490000，打印出来是负的", "查后十万个元素那条，int 版与 long 版都给 1000000000，看着完全对 —— 两端绕过的圈数相同，一减互相抵消", "溢出每次都会立刻报错，所以很好抓"], answers: [0, 1, 2], why: "三条都是本机实跑。第四条恰是反面：溢出不是每次都报错，有时会恰好给你一个正确的数 —— 第 50 万格到最后一格那条，int 版给 705032704、真值 5000000000。结论写死：pre 表一律用 64 位整数。" },
        { id: "q6", type: "blank", score: 10, stem: "pre[0] 存 0，表示「一个数都还没加」，整张表都站在这格上，正文管它叫____。", accept: ["地基", "地基格"], why: "有了这格，l 为 0 的查询减的就是它，一句减法对任何区间都成立，不需要额外判断；少了它就得去减一个不存在的 pre[-1]。" },
        { id: "q7", type: "choice", score: 10, stem: "把建表循环从右往左走，实测会怎样？", options: ["每格读到的是还没被写的 0，填出 0 3 1 4 1 5，编译运行一切正常，但整张表一条查询都不对", "编译器当场拒绝，推不出类型", "运行到中途越界崩溃", "只有第一条查询错，后面都对"], answer: 0, why: "实测填出 0 3 1 4 1 5，pre 退化成 v 右移一格，看着齐整、全是错的。这类错不报错，只能靠打印整张表去抓 —— 本课任务正是「打印整个 pre」。" }
      ],
      selftest: {
        refs: [
          {q1: 0, q2: "到第 3 个为止共 8\n第 2~4 个的和 = 6", q3: "0 3 4 8 0 0\n0 3 4 8 9 14", q4: 0, q5: [0, 1, 2], q6: "地基", q7: 0}],
        wrongs: [
          {q1: 1, q2: "到第 3 个为止共 9\n第 2~4 个的和 = 10", q3: "0 3 4 8 9 0\n0 3 4 8 9 14", q4: 1, q5: [0, 3], q6: "哨兵", q7: 2}],
        loose: [
          {q1: "0", q2: " 到第 3 个为止共 8 \n第 2~4 个的和 = 6 ", q3: "0  3  4  8  0  0 \n0 3 4 8 9 14", q4: "0", q5: [2, 1, 0], q6: " 地基 ", q7: "0"}]
      }
    },
  ]
};
