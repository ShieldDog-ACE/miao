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
      cid: "m163", kind: "paper", mode: "ide", authored: "d25f5fc2", file: "main.cpp", pass: 60, task: "任务题目：把 target 改成 100（无解），把打印改成 best == 100 时输出「无解」；做完再换成初值 n + 1、判据 best > n 的版本，说清这两种判决差在哪一句上", hint: "想不起来就回看本课【演示 1 · 源稿这段：六个数、target 是 7】和【演示 3 · 本课任务：target 改 100，无解要说「无解」】，五行轨迹在【演示 2 · 把每一步打到屏幕上】。",
      notes: [],
      questions: [
        { id: "q1", type: "code", score: 34, coversTask: 1, stem: "（任务题的核心）写出达标之后 while 里面那两句：先记下当前窗口长度取 min，再把左端那个数吐出去、left 顺势往前挪一格。", acceptRegex: ["best\\s*=\\s*std::min\\s*\\(\\s*best\\s*,\\s*right\\s*-\\s*left\\s*\\+\\s*1\\s*\\)", "sum\\s*-=\\s*v\\s*\\[\\s*left\\s*\\+\\+\\s*\\]"], acceptOn: "code", sample: "best = std::min(best, right - left + 1);\n            sum -= v[left++];", why: "两句的顺序就是本课的命门：达标是记答案的时机，不是缩手的时机，先记后吐。实测把记长度那句挪到 while 之后，target 给 7 会报出 1 —— 量的是已经不达标的窗口，而且不报错也不崩。大括号、变量名不查，只看这两句在不在。" },
        { id: "q2", type: "code", score: 33, coversTask: 1, stem: "写出外层那条 for 的循环头：right 从 0 起，一格一格走到数组末尾。容器长度是无符号的，条件里得把它转成整数再比。只写 for 这一行，循环体不用写。", acceptRegex: ["for\\s*\\(\\s*int\\s+right\\s*=\\s*0\\s*;", "right\\s*<", "static_cast\\s*<\\s*int\\s*>"], acceptOn: "code", sample: "for (int right = 0; right < static_cast<int>(v.size()); ++right) {", why: "size() 给的是无符号数，直接拿 int 的 right 去比，右边会被整体提升成无符号；一旦 left 或长度算穿到负数，比较结果就整个翻掉。先转成 int，两边才在同一把尺子上。" },
        { id: "q3", type: "code", score: 33, coversTask: 1, stem: "写一行判决：窗口跑完之后，best 还站在初值 100 上就说明没有任何一段达标，打「无解」；否则把最短长度打出来。", acceptRegex: ["best\\s*==\\s*100", "无解", "std\\s*::\\s*println\\s*\\("], acceptOn: "code", sample: "std::println(\"{}\", best == 100 ? \"无解\" : std::to_string(best));", why: "best 一辈子没被 min 动过，就说明 while 的门一次都没开过 —— 整串数的和都够不着 target。判决读的就是「初值还在不在」这件事。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <string>\nint main() {\n    best = std::min(best, right - left + 1);\n    sum -= v[left++];\n    for (int right = 0; right < static_cast<int>(v.size()); ++right) {\n    std::println(\"{}\", best == 100 ? \"无解\" : std::to_string(best));\n    return 0;\n}\n}\n"],
        wrongs: [
          "",
          "best = right - left + 1;\n            sum -= v[left];",
          "for (int right = 0; right < v.size(); ++right) {",
          "std::println(\"和 ≥ {} 的最短长度 = {}\", target, best);"],
        loose: [
          "#include <string>\nint main() {\n    best=std::min(best,right-left+1);\n    sum -= v[left++];\n    for  (  int right=0 ;  right  <  static_cast  <int>  ( v.size ( )  )  ; ++right  )\n    std  ::  println  (  \"{}\" ,  best==100 ?  \"无解\"  :  std::to_string(best)  )  ;\n    return 0;\n}\n"]
      }
    },
    {
      cid: "m164", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, task: "任务题目：打印整个 pre 数组，照演示 2 每填一格就把整张表打一行，观察它怎么长出来，然后回答为什么填到第 i 行时后面全是 0", hint: "想不起来就回看本课【演示 2 · 本课任务：打印整个 pre，看它怎么长出来】和【演示 4 · 不多开一格会怎样】，五行全表与 15 个区间的对跑都是实跑打印。",
      notes: ["pre[i] 存的是前 i 个数的和，它站在 v 的第 i 减 1 格与第 i 格之间那条缝上，所以查询式不用背。", "多开那一格，就是把左端为 0 的那条分支焊死成减 pre[0]，它等于 0；不多开也能写，但必须自带一条分支。", "建表 n 次加法、之后每条查询一次减法：两千条查询暴力要重扫上百万次加法，前缀和只花两千次减法加两千次建表。", "溢出不是每次都报错：查后十万个那一条，int 版与 64 位版都给 1000000000，因为两端绕过的圈数相同、一减互相抵消。", "第 111 课那句 std::partial_sum 配上 begin 加 1，一行就能把这张表填出来。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "先把地基建起来：开一张比元素个数多一格的表，初值全写 0。", acceptRegex: ["std\\s*::\\s*vector\\s*<\\s*(?:int|long\\s+long)\\s*>\\s+\\w+\\s*\\(\\s*\\w+\\s*\\.\\s*size\\s*\\(\\s*\\)\\s*\\+\\s*1\\s*,\\s*0\\s*\\)"], acceptOn: "code", sample: "std::vector<int> pre(v.size() + 1, 0);", why: "pre[0] 存 0，表示一个数都还没加，整张表都站在这格上；只开 n 格又照抄减法式，实测 15 个区间错 15 个。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "建表那一行递推：第 i 加一格那格，等于第 i 格那格加上 v 的第 i 个。", acceptRegex: ["\\w+\\s*\\[\\s*\\w+\\s*\\+\\s*1\\s*\\]\\s*=\\s*\\w+\\s*\\[\\s*\\w+\\s*\\]\\s*\\+\\s*\\w+\\s*\\["], acceptOn: "code", sample: "pre[i + 1] = pre[i] + v[i];", why: "每层记的是到这为止共多少：pre[3] = 8 是 3 加 1 加 4，不是第 3 格那个 1。" },
        { id: "q3", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：把整张表一格一格打出来 —— 一圈 for 从 0 起，里面用 std::print 把每一个格子按索引打一遍。", acceptRegex: ["for\\s*\\(\\s*int\\s+\\w+\\s*=\\s*0\\s*;[\\s\\S]{0,120}?std\\s*::\\s*print\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\[\\s*\\w+\\s*\\]\\s*\\)"], acceptOn: "code", sample: "for (int k = 0; k <= static_cast<int>(v.size()); ++k) std::print(\"{} \", pre[k]);", why: "本机实跑五行全表：填到第三行是 0 3 4 8 0 0 —— 还没推到的格子都还是初始的 0，所以建表循环不能倒着走。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "回答一个区间只剩一次减法：打一行，把表里两格相减的结果打出来。", acceptRegex: ["std\\s*::\\s*println\\s*\\([^;]*\\w+\\s*\\[\\s*\\w+\\s*\\]\\s*-\\s*\\w+\\s*\\[\\s*\\w+\\s*\\]"], acceptOn: "code", sample: "std::println(\"第 2~4 个的和 = {}\", pre[4] - pre[1]);", why: "右界加 1、左界原样：源稿注释里从 1 数起的第 2~4 个，代码写的是 pre[4] 减 pre[1]。" },
        { id: "q5", type: "code", score: 15, coversTask: 1, stem: "再开一张 64 位整数的同名表，用同一句递推填一遍：建表那圈里给 long long 那张表也算一次。", acceptRegex: ["std\\s*::\\s*vector\\s*<\\s*long\\s+long\\s*>\\s+\\w+\\s*\\(", "\\w+\\s*\\[\\s*\\w+\\s*\\+\\s*1\\s*\\]\\s*=\\s*\\w+\\s*\\[\\s*\\w+\\s*\\]\\s*\\+"], acceptOn: "code", sample: "std::vector<long long> pre64(v.size() + 1, 0);\npre64[i + 1] = pre64[i] + v[i];", why: "一百万个一万的和是一万亿：int 版那张表打出 1410065408，第一次越加越小落在 pre[214749] —— pre 表一律用 64 位整数。" },
        { id: "q6", type: "code", score: 15, coversTask: 1, stem: "观察到了什么，用一行注释记下来（把看到的几个数写进去）。", acceptRegex: ["//[^\\n]*[0-9][^\\n]*[0-9]", "//[^\\n]{6,}"], acceptOn: "buffer", sample: "// 一行行看下去：0 3 4 8 9 14，表是从地基往右一格一格推出来的", why: "判的是你确实记了一行；记得对不对这块编辑器核对不了 —— 实测收尾那一行是 0 3 4 8 9 14，第三行还是 0 3 4 8 0 0。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> v = {3, 1, 4, 1, 5};\n    std::vector<int> pre(v.size() + 1, 0);            // pre[0] = 0 当地基\n    std::vector<long long> pre64(v.size() + 1, 0);\n    for (int i = 0; i < static_cast<int>(v.size()); ++i) {\n        pre[i + 1] = pre[i] + v[i];\n        pre64[i + 1] = pre64[i] + v[i];\n        std::print(\"填完 pre[{}]={:2}  此刻整个 pre：\", i + 1, pre[i + 1]);\n        for (int k = 0; k <= static_cast<int>(v.size()); ++k) std::print(\"{} \", pre[k]);\n        std::println(\"\");\n    }\n    std::println(\"第 2~4 个的和 = {}\", pre[4] - pre[1]);\n    return 0;\n}\n// 一行行看下去：0 3 4 8 0 0 到 0 3 4 8 9 14，表是从地基往右一格一格推出来的\n"],
        wrongs: [
          "",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> v = {3, 1, 4, 1, 5};\n    std::vector<int> pre(v.size() + 1, 0);\n    for (int i = 0; i < static_cast<int>(v.size()); ++i)\n        pre[i + 1] = pre[i] + v[i];\n    std::println(\"到第 3 个为止共 {}\", pre[3]);\n    std::println(\"第 2~4 个的和 = {}\", pre[4] - pre[1]);\n    return 0;\n}\n",
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> v = {3, 1, 4, 1, 5};\n    int total = 0;\n    for (int x : v) total += x;\n    std::println(\"{}\", total);\n    return 0;\n}\n",
          "#include <print>\n#include <vector>\n#include <numeric>\n\nint main() {\n    std::vector<int> a = {1, 2, 3, 4, 5};\n    std::vector<int> pre(a.size() + 1, 0);\n    std::partial_sum(a.begin(), a.end(), pre.begin() + 1);\n    std::println(\"第 3~5 个 = {}\", pre[5] - pre[2]);\n    return 0;\n}\n"],
        loose: [
          "#  include < print >\n#  include < vector >\nint  main ( )\n{\n  std :: vector < int >  src  =  { 3 , 1 , 4 , 1 , 5 } ;\n  std :: vector < int >  sum ( src . size ( ) + 1 , 0 ) ;\n  std :: vector < long  long >  big ( src . size ( ) + 1 , 0 ) ;\n  for ( int  i  =  0 ;  i  <  static_cast < int > ( src . size ( ) ) ;  ++ i )\n  {\n    sum [ i + 1 ]  =  sum [ i ] + src [ i ] ;\n    big [ i + 1 ]  =  big [ i ] + src [ i ] ;\n    std :: print ( \" 填完第 {} 格 :\" , i + 1 ) ;\n    for ( int  j  =  0 ;  j  <=  static_cast < int > ( src . size ( ) ) ;  ++ j )  std :: print ( \"{} \" , sum [ j ] ) ;\n    std :: println ( \"\" ) ;\n  }\n  std :: println ( \" 一段的和 = {}\" , sum [ 4 ] - sum [ 1 ] ) ;\n  // 看到的行是 0 3 4 8 9 14 ，地基那一格始终是 0\n}\n"]
      }
    },
  ]
};
