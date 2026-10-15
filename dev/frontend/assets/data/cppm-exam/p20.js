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
      cid: "m151", kind: "paper", mode: "ide", authored: "e2d59960", file: "main.cpp", pass: 60, task: "任务题目：给冒泡加一个 swapped 标记，一整轮没发生交换就提前 break，然后拿 5 2 8 1 9 和已经排好的十个数各跑一遍，把比较次数打印出来证明它真的生效了", hint: "想不起来就回看本课【演示 4 · 本课任务：标记 + 封进一个带引用的函数】和【演示 2 · 逐轮打印】，那两组比较次数就写在【演示 4】那段里。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 30, coversTask: 1, stem: "（任务题）按本课任务给冒泡补上提前收手的标记。写出三处：每轮开头那个标记的声明与置假、发生交换时把它置真、以及一整轮没换就跳出外层的判断。", acceptRegex: ["bool\\s+swapped\\s*=\\s*false", "swapped\\s*=\\s*true", "if\\s*\\(\\s*!\\s*swapped\\s*\\)"], acceptOn: "code", sample: "bool swapped = false;\n            if (v[j] > v[j + 1]) { std::swap(v[j], v[j + 1]); swapped = true; }\n        if (!swapped) break;", why: "三处缺一不可，而声明必须落在外层循环体里面 —— 实测写在外面只重置一次的话，标记永远是 true，break 再也不触发，等于白加一段代码。写成 break 那句用不用大括号、变量叫什么名字都不查，只看这三件事在不在。" },
        { id: "q2", type: "code", score: 12, stem: "把冒泡封成一个函数：参数收进调用者那一个容器，不许复制。写出函数头那一行。", acceptRegex: ["std::vector\\s*<\\s*int\\s*>\\s*&", "void\\s+bubble"], acceptOn: "code", sample: "void bubble(std::vector<int>& v) {", why: "少一个 & 就收进一整份复制：函数里排得再对，调用者手里那一份还是原样，而且这回复制的是整个容器 —— 第 66 课那条结论在容器上被放大了。" },
        { id: "q3", type: "code", score: 29, coversTask: 1, stem: "写出内层那条 for 的循环头：j 从 0 起，每一轮只比到已排好区的前一格为止。只写 for 这一行，循环体不用写。", acceptRegex: ["for\\s*\\(\\s*size_t\\s+j\\s*=\\s*0\\s*;", "j\\s*\\+\\s*1\\s*<", "\\.\\s*size\\s*\\(\\s*\\)\\s*-\\s*i"], acceptOn: "code", sample: "for (size_t j = 0; j + 1 < v.size() - i; ++j)", why: "每走完一轮，队尾就多一个排好的格子，下一轮比较的右边界就得往左挪一格，所以条件里是 v.size() 减 i；减掉的正是已经站对位置的那些，一轮也少比一次。" },
        { id: "q4", type: "code", score: 29, coversTask: 1, stem: "写一行：相邻两个格子比一比，前面那个更大就把这两个换到对方位置上去。", acceptRegex: ["v\\s*\\[\\s*j\\s*\\]\\s*>\\s*v\\s*\\[\\s*j\\s*\\+\\s*1\\s*\\]", "std\\s*::\\s*swap\\s*\\(\\s*v\\s*\\[\\s*j\\s*\\]\\s*,"], acceptOn: "code", sample: "if (v[j] > v[j + 1]) std::swap(v[j], v[j + 1]);", why: "冒泡的全部机制就这一句：只问相邻两个，反了就换。std::swap 收的是引用，动的正是容器里那两格，所以换完调用者手里那份也跟着变了。" }
      ],
      selftest: {
        refs: [
          "#include <vector>\n#include <utility>\nvoid bubble(std::vector<int>& v) {\n}\nint main() {\n    bool swapped = false;\n    if (v[j] > v[j + 1]) { std::swap(v[j], v[j + 1]); swapped = true; }\n    if (!swapped) break;\n    for (size_t j = 0; j + 1 < v.size() - i; ++j)\n    if (v[j] > v[j + 1]) std::swap(v[j], v[j + 1]);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "for (size_t j = 0; j < v.size(); ++j) std::swap(v[j], v[j + 1]);",
          "void bubble(std::vector<int> v) {",
          "for (size_t j = 0; j < v.size(); ++j)",
          "if (v[j] > v[j + 1]) std::swap(v[i], v[j]);"],
        loose: [
          "#include <vector>\n#include <utility>\nint main() {\n    bool  swapped=false\n    if(v[j]>v[j+1]){ std::swap(v[j],v[j+1]); swapped=true; }\n    if(!swapped){ break; }\n    void   bubble ( std::vector < int > & v )\n    for  (  size_t j=0 ;  j+1  <  v . size ( ) - i  ; ++j  )\n    if  ( v[ j ]  >  v[ j + 1 ]  )  std  ::  swap (  v[j] ,  v [j + 1]  ) ;\n    return 0;\n}\n"]
      }
    },
    {
      cid: "m152", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, task: "任务题目：在每次 swap 以后打印整个数组，亲眼看它怎么被分成两堆；再对着打印说清哪几行的数组根本没变、以及每一堆是不是都比原段短", hint: "想不起来就回看本课【演示 2 · 本课任务：每次 swap 以后打印整个数组】和【演示 3 · 函数自己调自己，到底怎么停】，那棵调用树是按实测顺序写的。",
      notes: ["出口那句拦的是只剩一个数的段和一个数都没有的空段。", "实测把出口写成 lo == hi，空段拦不住，函数拿着同一个范围反复往下叫，瞬间段错误、核心已转储。", "双指针对撞只保证左边都不比基准大、右边都不比基准小，分区一结束基准不一定站在它最终的位置上。", "那五行 swap 打印里只有三次是真正的重排：交换次数不等于有效重排次数。", "对照实测：六个数的冒泡 15 次比较、7 次交换；快排 5 次交换、9 次函数调用、最深第 4 层，切得不均匀时套得就深。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "先把出口写上：第一行就判断这段还剩几个，0 个或 1 个直接 return。", acceptRegex: ["if\\s*\\(\\s*\\w+\\s*>=\\s*\\w+\\s*\\)\\s*return\\s*;"], acceptOn: "code", sample: "if (lo >= hi) return;", why: "分区收手后左端完全可能比右端还大，那个空段也得被同一句挡住；判定写 >=，别用 ==。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "取基准：开一个 int，值写成这段下标中间那一格。", acceptRegex: ["int\\s+\\w+\\s*=\\s*\\w+\\s*\\[\\s*\\(\\s*\\w+\\s*\\+\\s*\\w+\\s*\\)\\s*/\\s*2\\s*\\]"], acceptOn: "code", sample: "int pivot = v[(lo + hi) / 2];", why: "取的是下标中间那一格的值，不是这堆数的中位数。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "两只手都卡住时换一次：用 std::swap，两边的下标一个当场加一、一个当场减一。", acceptRegex: ["std\\s*::\\s*swap\\s*\\(\\s*\\w+\\s*\\[\\s*\\w+\\s*\\+\\s*\\+\\s*\\]\\s*,\\s*\\w+\\s*\\[\\s*\\w+\\s*-\\s*-\\s*\\]"], acceptOn: "code", sample: "std::swap(v[i++], v[j--]);", why: "换完两只手都往中间挪一格，循环才走得下去。" },
        { id: "q4", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：紧跟在交换后面，用一圈范围 for 把整个数组打一遍。", acceptRegex: ["for\\s*\\(\\s*int\\s+\\w+\\s*:\\s*\\w+\\s*\\)\\s*std\\s*::\\s*print"], acceptOn: "code", sample: "for (int x : v) std::print(\"{} \", x);", why: "这一句就是任务要的：实测六个数会打五行，中间三行一模一样 —— 那是 i 与 j 停在同一格，换的是自己跟自己。" },
        { id: "q5", type: "code", score: 20, coversTask: 1, stem: "分区收手后对每一堆叫自己再来一遍：连着两句自调，参数各取切出来的那两段。", acceptRegex: ["\\w+\\s*\\(\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*;[\\s\\S]{0,120}?\\w+\\s*\\(\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*;"], acceptOn: "code", sample: "quick_sort(v, lo, j);\nquick_sort(v, i, hi);", why: "j 小于 i，两堆都比原段短，这就是变小；函数在自己的体里调用自己叫递归。" },
        { id: "q6", type: "code", score: 15, coversTask: 1, stem: "在 main 里开出那一串数并调用一次：上界用 static_cast 把元素个数变成 int 再减 1。", acceptRegex: ["std\\s*::\\s*vector\\s*<\\s*int\\s*>\\s+\\w+\\s*=\\s*\\{", "static_cast\\s*<\\s*int\\s*>\\s*\\("], acceptOn: "code", sample: "std::vector<int> v = {5, 2, 8, 1, 9, 3};\nquick_sort(v, 0, static_cast<int>(v.size()) - 1);", why: "元素个数是个无符号的数，直接减 1 在空容器上会绕到最远处；先变成 int 再减才安全。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <vector>\n#include <utility>\n\nvoid quick_sort(std::vector<int>& v, int lo, int hi) {\n    if (lo >= hi) return;\n    int pivot = v[(lo + hi) / 2];\n    int i = lo, j = hi;\n    while (i <= j) {\n        while (v[i] < pivot) ++i;\n        while (v[j] > pivot) --j;\n        if (i <= j) {\n            std::swap(v[i++], v[j--]);\n            std::print(\"段 {}..{} swap 后：\", lo, hi);\n            for (int x : v) std::print(\"{} \", x);\n            std::println(\"  此刻 i={} j={}\", i, j);\n        }\n    }\n    quick_sort(v, lo, j);\n    quick_sort(v, i, hi);\n}\n\nint main() {\n    std::vector<int> v = {5, 2, 8, 1, 9, 3};\n    quick_sort(v, 0, static_cast<int>(v.size()) - 1);\n    for (int x : v) std::print(\"{} \", x);\n    std::println(\"\");\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> v = {5, 2, 8, 1, 9, 3};\n    for (int a = 0; a < 6; ++a)\n        for (int b = 0; b < 5; ++b)\n            if (v[b] > v[b + 1]) std::swap(v[b], v[b + 1]);\n    for (int x : v) std::print(\"{} \", x);\n    return 0;\n}\n",
          "#include <print>\n#include <vector>\n#include <utility>\n\nvoid part(std::vector<int>& v, int lo, int hi) {\n    if (lo >= hi) return;\n    int i = lo, j = hi;\n    while (i <= j) { std::swap(v[i++], v[j--]); }\n    std::println(\"这一段过完了\");\n}\n\nint main() {\n    std::vector<int> v = {3, 1, 2};\n    part(v, 0, 2);\n    return 0;\n}\n"],
        loose: [
          "#  include < print >\n#  include < vector >\n#  include < utility >\n\nvoid  qs ( std :: vector < int > &  arr , int  low , int  high )\n{\n  if ( low >= high ) return ;\n  int  piv  =  arr [ ( low + high ) / 2 ] ;\n  int  l  =  low ,  r  =  high ;\n  while ( l <= r )\n  {\n    while ( arr [ l ] < piv )  ++ l ;\n    while ( arr [ r ] > piv )  -- r ;\n    if ( l <= r )\n    {\n      std :: swap ( arr [ l ++ ] , arr [ r -- ] ) ;\n      std :: print ( \" 一趟之后 \" ) ;\n      for ( int  one : arr )  std :: print ( \" {} \" , one ) ;\n      std :: println ( \"\" ) ;\n    }\n  }\n  qs ( arr , low , r ) ;\n  qs ( arr , l , high ) ;\n}\n\nint  main ( )\n{\n  std :: vector < int >  data  =  { 5 , 2 , 8 , 1 , 9 , 3 } ;\n  qs ( data , 0 , static_cast < int > ( data . size ( ) ) - 1 ) ;\n}\n"]
      }
    },
  ]
};
