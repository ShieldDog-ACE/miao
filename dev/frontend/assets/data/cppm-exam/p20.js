/* 喵站 · C++ 掌握 考卷分部 p20：第 151–152 课（第九轮）
 * 两份源稿各只有 1 条【任务】，所以 coversTask 一律是 [1]。
 * 契约：每题分数合计正好 100、任务题合计 ≥50 分、choice ≥2、output ≥1、每题带 why、
 * refs 判 100 / wrongs 判 <60 / loose 判 ≥60。
 * 卷面里所有数字（比较次数、交换次数、递归调用次数、最深层数、空容器上 size_t 的长相）
 * 都是本机 g++ -std=c++23 实跑出来的，与正文一致。
 */
window.MIAO_CPPM_EXAM_P20 = {
  papers: [
    {
      cid: "m151", kind: "paper", mode: "code", authored: "e2d59960", pass: 60, task: "任务题目：给冒泡加一个 swapped 标记，一整轮没发生交换就提前 break，然后拿 5 2 8 1 9 和已经排好的十个数各跑一遍，把比较次数打印出来证明它真的生效了", hint: "想不起来就回看本课【演示 4 · 本课任务：标记 + 封进一个带引用的函数】和【演示 2 · 逐轮打印】，那两组比较次数就写在【演示 4】那段里。",
      questions: [
        { id: "q1", type: "code", score: 30, coversTask: 1, stem: "（任务题）按本课任务给冒泡补上提前收手的标记。写出三处：每轮开头那个标记的声明与置假、发生交换时把它置真、以及一整轮没换就跳出外层的判断。", acceptRegex: ["bool\\s+swapped\\s*=\\s*false", "swapped\\s*=\\s*true", "if\\s*\\(\\s*!\\s*swapped\\s*\\)"], sample: "bool swapped = false;\n            if (v[j] > v[j + 1]) { std::swap(v[j], v[j + 1]); swapped = true; }\n        if (!swapped) break;", why: "三处缺一不可，而声明必须落在外层循环体里面 —— 实测写在外面只重置一次的话，标记永远是 true，break 再也不触发，等于白加一段代码。写成 break 那句用不用大括号、变量叫什么名字都不查，只看这三件事在不在。" },
        { id: "q2", type: "code", score: 12, stem: "把冒泡封成一个函数：参数收进调用者那一个容器，不许复制。写出函数头那一行。", acceptRegex: ["std::vector\\s*<\\s*int\\s*>\\s*&", "void\\s+bubble"], sample: "void bubble(std::vector<int>& v) {", why: "少一个 & 就收进一整份复制：函数里排得再对，调用者手里那一份还是原样，而且这回复制的是整个容器 —— 第 66 课那条结论在容器上被放大了。" },
        { id: "q3", type: "code", score: 29, coversTask: 1, stem: "写出内层那条 for 的循环头：j 从 0 起，每一轮只比到已排好区的前一格为止。只写 for 这一行，循环体不用写。", acceptRegex: ["for\\s*\\(\\s*size_t\\s+j\\s*=\\s*0\\s*;", "j\\s*\\+\\s*1\\s*<", "\\.\\s*size\\s*\\(\\s*\\)\\s*-\\s*i"], sample: "for (size_t j = 0; j + 1 < v.size() - i; ++j)", why: "每走完一轮，队尾就多一个排好的格子，下一轮比较的右边界就得往左挪一格，所以条件里是 v.size() 减 i；减掉的正是已经站对位置的那些，一轮也少比一次。" },
        { id: "q4", type: "code", score: 29, coversTask: 1, stem: "写一行：相邻两个格子比一比，前面那个更大就把这两个换到对方位置上去。", acceptRegex: ["v\\s*\\[\\s*j\\s*\\]\\s*>\\s*v\\s*\\[\\s*j\\s*\\+\\s*1\\s*\\]", "std\\s*::\\s*swap\\s*\\(\\s*v\\s*\\[\\s*j\\s*\\]\\s*,"], sample: "if (v[j] > v[j + 1]) std::swap(v[j], v[j + 1]);", why: "冒泡的全部机制就这一句：只问相邻两个，反了就换。std::swap 收的是引用，动的正是容器里那两格，所以换完调用者手里那份也跟着变了。" }
      ],
      selftest: {
        refs: [
          {q1: "bool swapped = false;\n            if (v[j] > v[j + 1]) { std::swap(v[j], v[j + 1]); swapped = true; }\n        if (!swapped) break;", q2: "void bubble(std::vector<int>& v) {", q3: "for (size_t j = 0; j + 1 < v.size() - i; ++j)", q4: "if (v[j] > v[j + 1]) std::swap(v[j], v[j + 1]);"}],
        wrongs: [
          {q1: "for (size_t j = 0; j < v.size(); ++j) std::swap(v[j], v[j + 1]);", q2: "void bubble(std::vector<int> v) {", q3: "for (size_t j = 0; j < v.size(); ++j)", q4: "if (v[j] > v[j + 1]) std::swap(v[i], v[j]);"}],
        loose: [
          {q1: "bool  swapped=false\n if(v[j]>v[j+1]){ std::swap(v[j],v[j+1]); swapped=true; }\n if(!swapped){ break; }", q2: "void   bubble ( std::vector < int > & v )", q3: "for  (  size_t j=0 ;  j+1  <  v . size ( ) - i  ; ++j  )", q4: "if  ( v[ j ]  >  v[ j + 1 ]  )  std  ::  swap (  v[j] ,  v [j + 1]  ) ;"}]
      }
    },
    {
      cid: "m152", kind: "paper", mode: "quiz", pass: 60, task: "任务题目：在每次 swap 以后打印整个数组，亲眼看它怎么被分成两堆；再对着打印说清哪几行的数组根本没变、以及每一堆是不是都比原段短", hint: "想不起来就回看本课【演示 2 · 本课任务：每次 swap 以后打印整个数组】和【演示 3 · 函数自己调自己，到底怎么停】，那棵调用树是按实测顺序写的。",
      questions: [
        { id: "q1", type: "choice", score: 10, stem: "第一行 if (lo >= hi) return; 拦住的是哪两种段？", options: ["只剩一个数的段，和一个数都没有的空段", "只有空段", "只有长度为一的段", "已经排好序的段"], answer: 0, why: "第 71 课那句「先想好出口」在这里照样是第一功课。分区收手后 j 完全可能比 lo 还小，于是 [lo..j] 是个空段，同一句 lo >= hi 一起挡掉。" },
        { id: "q2", type: "output", score: 50, coversTask: 1, stem: "（任务题）照演示 2 在每次 swap 后打印整个数组，输入 5 2 8 1 9 3，那五行 swap 打印是什么？（一行一次交换）", acceptLines: ["段 0..5 swap 后：5 2 3 1 9 8", "段 0..3 swap 后：1 2 3 5 9 8", "段 0..3 swap 后：1 2 3 5 9 8", "段 2..3 swap 后：1 2 3 5 9 8", "段 4..5 swap 后：1 2 3 5 8 9"], why: "实测五行，中间三行一模一样 —— 那是 i 与 j 停在同一格，换的是自己跟自己。所以这五步里只有三次是真正的重排，交换次数不等于有效重排次数。" },
        { id: "q3", type: "choice", score: 12, stem: "实测把出口改成 if (lo == hi) return;，六个数那一跑是什么下场？", options: ["照样排好，只是慢一点", "编译期就报错，拦下来", "空段拦不住，函数拿着同一个范围反复往下叫，实测瞬间段错误、核心已转储", "只多跑几轮，最后自己停"], answer: 2, why: "等于号漏掉 lo > hi 的空段，第 71 课那条「出口必须到得了」就断了。判定永远写 >=，别用 ==。" },
        { id: "q4", type: "multi", score: 14, stem: "关于这段快排，本机实测说对的是？（多选，错勾任何一项整题 0 分）", options: ["pivot 取的是下标中间那一格的值，不是这堆数的中位数", "已经排好的一千个数照样切得均匀，实测调用 1023 次", "把一千个数排成先偶数升序再接奇数升序，实测调用涨到 1925 次，这才是接近退化的输入", "分区一结束，基准就一定站在它的最终位置上"], answers: [0, 1, 2], why: "第四条是这段代码最容易误会的地方：实测第一段拿 8 当基准，分区完它落在最后一格，可它最终该站倒数第二 —— 双指针对撞只保证左边都不比它大、右边都不比它小。前三条都是本机跑出来的数。" },
        { id: "q5", type: "blank", score: 6, stem: "函数在自己的函数体里调用自己，这种写法叫____。第 71 课写过它，本课用它来排每一堆。", accept: ["递归", "递归调用", "recursion"], why: "快排的三步里第三步「对每一堆叫自己再来一遍」就是这个动作，源稿那句「先照抄体会分而治之」说的正是它。" },
        { id: "q6", type: "choice", score: 8, stem: "跟冒泡对照，快排买到的东西最准的说法是？", options: ["每做一趟，要处理的规模大约掉一半：一趟分区同时把整段切成两堆，堆里的元素再也不用跨过中间那条线", "快排不需要比较，所以比冒泡快", "冒泡只能排数字，快排什么都能排", "快排一次只把一个数送到最终位置"], answer: 0, why: "对照实测的六个数：冒泡 15 次比较、7 次交换；快排 5 次交换、9 次函数调用、最深第 4 层。代价也要认 —— 每次调用都留一份现场，切得不均匀时套得就深。" }
      ],
      selftest: {
        refs: [
          {q1: 0, q2: "段 0..5 swap 后：5 2 3 1 9 8\n段 0..3 swap 后：1 2 3 5 9 8\n段 0..3 swap 后：1 2 3 5 9 8\n段 2..3 swap 后：1 2 3 5 9 8\n段 4..5 swap 后：1 2 3 5 8 9", q3: 2, q4: [0, 1, 2], q5: "递归", q6: 0}],
        wrongs: [
          {q1: 1, q2: "5 2 3 1 9 8\n1 2 3 5 8 9\n1 2 3 5 8 9\n1 2 3 5 9 8\n1 2 3 5 9 8", q3: 1, q4: [3], q5: "循环", q6: 1}],
        loose: [
          {q1: "0", q2: " 段 0..5 swap 后：5 2 3 1 9 8 \n段 0..3 swap 后：1 2 3 5 9 8\n 段 0..3 swap 后：1 2 3 5 9 8\n段 2..3 swap 后：1 2 3 5 9 8\n段 4..5 swap 后：1 2 3 5 8 9 ", q3: "2", q4: [2, 1, 0], q5: "递归调用", q6: "0"}]
      }
    },
  ]
};
