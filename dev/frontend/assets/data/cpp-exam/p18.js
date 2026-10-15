/* 喵站 · C++ 入门 考卷分部 p18：第 75–78 课（第九轮 · 指针篇收尾）
 *
 * 每场卷照 cpp-exam/p13.js 的形状与硬指标（cpp-exam-check 逐条对账）：
 *   1. kind:"paper"，题型只用笔试引擎认的六种；
 *   2. 各题 score 相加正好 100；
 *   3. 源稿每一条【任务】都有题用 coversTask 对着它；
 *   4. 带 coversTask 的题合计 >=50 分；choice >=2；output >=1；
 *   5. 每题带 why；selftest 的 refs 判 100、wrongs 判 <60、loose 判 >=60。
 *
 * 守的闸线：c75 卷面不出现 new / delete（76 课首现）、不出现智能指针（78 课首现）；
 *           c76、c77 卷面同样不出现智能指针那三个词；struct / class 一律不出现。
 *           异常是 176 课才教的东西，闸按词面拦读者可见字段，所以 c77 那两场涉及捕获的题
 *           一律写「被盯着的那块花括号」「按类型接住」，try 与 catch 只出现在 selftest 的参考解里。
 * 读者看得见的字段一律用中文括号，代码原文里才出现半角括号。
 *
 * 验收：node --check dev/frontend/assets/data/cpp-exam/p18.js
 *       node dev/tools/cpp-exam-check.cjs --only c75,c76,c77,c78
 */
window.MIAO_CPP_EXAM_P18 = {
  papers: [
    {
      cid: "c75", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 75 课考试 · 指针 vs 引用", task: "任务题目：写一个返回「较大者引用」的 max_of，在外面一句 max_of(x, y) = 0; 就把较大者清零；再写一个原地反转 vector 的 reverse，不返回新容器。顺带回答：想改绑引用办不到，指针为什么办得到", hint: "想不起来就回看正文【演示 1】那句 ref = b 落在哪个盒子、【演示 2】三行各自的分工，以及【任务】那三条的原话。",
      notes: ["int& ref = a; 之后写 ref = b; 不是改绑到 b，是把 b 的值抄进 a，跑完 a 和 b 都是 20 —— 改绑这个动作对引用压根不存在，加星号也救不了。", "三大区别：引用出生那一行就必须指认本人，指针可以先声明后指认；指针能换指向且不牵连原盒子，引用不能；用起来的长相也不同。", "纸条可以空着：int* p = nullptr; 合法，用之前先跟 nullptr 比一次；硬去解引用一张没抄号的纸条，编译放行，跑起来当场段错误。", "引用不能空着：int& bad_ref; 解开注释就报错，外号不能悬空挂在没人身上。", "必然有个东西、也不许换的场景就交给引用；只有「可空」这一件事引用办不到，才轮到纸条上场。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "写 int& max_of(int& x, int& y) 这一类函数：返回类型带 &，两个参数也各带一个 &，体里用 return 把其中一个人还出去。", acceptRegex: ["\\bint\\s*&\\s*\\w+\\s*\\(\\s*int\\s*&\\s*\\w+\\s*,\\s*int\\s*&\\s*\\w+\\s*\\)", "\\breturn\\s+\\w+\\s*;"], acceptOn: "code", sample: "int& max_of(int& x, int& y) {\n    if (x > y) return x;\n    return y;\n}", why: "还回来的不是值而是本人的外号，所以调用方拿到的是那只盒子本身，而不是复印件。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "在外面一句直接把较大者清零：给 max_of(a, b) 这个调用结果赋值 0。", acceptRegex: ["\\w+\\s*\\(\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*=\\s*\\d+\\s*;"], acceptOn: "code", sample: "max_of(a, b) = 0;", why: "调用结果是个引用，等号右边写的就是本人那格的新值 —— 这就是外号的威力。" },
        { id: "q3", type: "code", score: 15, coversTask: 2, stem: "写 void reverse(std::vector<int>& v) 这一类的头部：参数是 vector 的外号，带上 &，函数不返回新容器。", acceptRegex: ["\\bvoid\\s+\\w+\\s*\\(\\s*std::vector\\s*<\\s*int\\s*>\\s*&\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "void reverse(std::vector<int>& v) {", why: "带上 & 才是外号，能原地改；漏掉 & 就把整串复印一份进去折腾，外面一点感觉没有。" },
        { id: "q4", type: "code", score: 15, coversTask: 2, stem: "在 reverse 的体里把两头配成对换过来：先 int 一只备用盒抄下某一头，再两格互写，最后把备用盒那份填回去。", acceptRegex: ["\\bint\\s+\\w+\\s*=\\s*\\w+\\s*\\[[^\\]]+\\]\\s*;\\s*\\w+\\s*\\[[^\\]]+\\]\\s*=\\s*\\w+\\s*\\[[^\\]]+\\]\\s*;\\s*\\w+\\s*\\[[^\\]]+\\]\\s*=\\s*\\w+\\s*;"], acceptOn: "code", sample: "int t = v[0];\nv[0] = v[3];\nv[3] = t;", why: "两个格子换东西照样要第三个帮忙；写 v[位置] 就是直接改外面那串里的第几格。" },
        { id: "q5", type: "code", score: 15, coversTask: 3, stem: "换指向的实验：写一句把纸条涂掉重填另一个变量的号（左边不带 *），再写一句 * 纸条名 = 一个数，改现在指着的本人。", acceptRegex: ["[;}][ \\t\\r\\n]*\\w+\\s*=\\s*&\\s*\\w+\\s*;", "\\*\\s*\\w+\\s*=\\s*\\d+\\s*;"], acceptOn: "code", sample: "p = &d;\n*p = 44;", why: "纸条上记的是号，涂掉重填就行，原来的盒子毫发无损；左边带 * 才写进别人那格。" },
        { id: "q6", type: "code", score: 20, coversTask: 3, stem: "任务第 3 条：用一行注释写清楚，为什么引用想改绑办不到而纸条做得到（点到号和盒子谁拴着谁）。", acceptRegex: ["//[^\\n]*(号|拴|绑|指|地址)"], acceptOn: "buffer", sample: "// 引用是本人的外号，出生那一行就绑死，赋值只是给本人换内容；纸条上写的是号，换个号填上就行", why: "这一条为什么这么出：正则只能验注释里点到了这些词，说理对不对得人来读，这块编辑器判不严格。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <vector>\n\nint& max_of(int& x, int& y) {\n    if (x > y) return x;\n    return y;\n}\n\nvoid reverse(std::vector<int>& v) {\n    int t = v[0];\n    v[0] = v[3];\n    v[3] = t;\n    int u = v[1];\n    v[1] = v[2];\n    v[2] = u;\n}\n\nint main() {\n    int a = 30, b = 70;\n    max_of(a, b) = 0;\n    std::println(\"a={}, b={}\", a, b);\n\n    std::vector<int> v = {1, 2, 3, 4};\n    reverse(v);\n    std::println(\"{}\", v);\n\n    int c = 30, d = 40;\n    int* p = &c;\n    p = &d;\n    *p = 44;\n    std::println(\"c={}, d={}\", c, d);\n    // 引用是本人的外号，出生那一行就绑死；纸条上记的是号，涂掉重填就行，c 毫发无损\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n\nint max_of(int x, int y) {\n    if (x > y) return x;\n    return y;\n}\n\nint main() {\n    int a = 30, b = 70;\n    std::println(\"{}\", max_of(a, b));\n    return 0;\n}\n",
          "#include <print>\n#include <vector>\n\nvoid reverse(std::vector<int> v) {\n    int t = v[0];\n    v[0] = v[3];\n    v[3] = t;\n}\n\nint main() {\n    std::vector<int> v = {1, 2, 3, 4};\n    reverse(v);\n    std::println(\"{}\", v);\n    return 0;\n}\n",
          "#include <print>\n\nint main() {\n    int c = 30, d = 40;\n    int* p = &c;\n    *p = 44;\n    std::println(\"c={}, d={}\", c, d);\n    return 0;\n}\n"],
        loose: [
          "# include <print>\n# include <vector>\n\nint & bigger ( int &  m , int &  n )\n{\n    if (m > n)\n        return m;\n    return n;\n}\n\nvoid  flip ( std::vector <int> &  box )\n{\n    int  hold = box [ 0 ] ;\n    box [ 0 ] = box [ 3 ] ;\n    box [ 3 ] = hold ;\n}\n\nint  main ( )\n{\n    int  p1 = 30 ,  p2 = 70;\n    bigger ( p1 , p2 ) = 0;\n    std::println( \"p1 {} p2 {}\" , p1 , p2 );\n    std::vector<int> nums = {1, 2, 3, 4};\n    flip(nums);\n    std::println(\"{}\", nums);\n    int  c = 30 , d = 40;\n    int*  q = &c;\n    q = &d;\n    * q = 44;\n    // 纸条记的是号，换个号填上就行；外号出生就拴死，赋值只换本人兜里的东西\n    return 0;\n}\n"]
      }
    },
    {
      cid: "c76", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 76 课考试 · 栈与堆", task: "任务题目：用 new 申请一个装 10 个 int 的数组，往里填 1 到 10，求和打印，然后用 delete[] 归还；再把归还那句注释掉跑一遍，说说为什么程序表面一切正常、内存却漏了；最后答一句：大数组为什么建议放堆上", hint: "想不起来就回看正文【演示 2】那两行收尾的仪式、【演示 3】里 int 数组长度为什么不能是现场才知道的数，还有那张两块地的示意图。",
      notes: ["函数一进来就摆盒子、一返回就整层自动收走的那块地叫栈：后摆的先收，全靠机器移动一根指针。", "栈上数组的长度必须是编译期就能定下来的数；想让一个东西在函数结束之后还活着，就得让它住堆上。", "delete[] 之后纸条上的地址不会自动变成 nullptr，误用就成了悬垂 —— 赋 nullptr 那是人写的，不是机器做的。", "堆上的数组读起来并不比栈上快，栈更省更快；小数组放栈上照样合法。", "大小运行时才知道的数组只能问堆要：先 std::cin 读进一个 n，再 new int[n]，栈给不出。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "向仓库申请一整排格子：用 new 要 10 个 int，把还回来的地址交给一张 int* 纸条。", acceptRegex: ["\\bint\\s*\\*\\s*\\w+\\s*=\\s*new\\s+int\\s*\\[\\s*\\w+\\s*\\]"], acceptOn: "code", sample: "int* arr = new int[10];", why: "new 还回来的是地址，所以堆和指针总是一起讲；长度写在这儿，编译期不知道也行。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "用下标把格子里填上数：一行写 arr[i] 等于什么，把 1 到 10 铺进去。", acceptRegex: ["\\w+\\s*\\[\\s*\\w+\\s*\\]\\s*=[^=]"], acceptOn: "code", sample: "arr[i] = i + 1;", why: "堆上的数组照样用下标访问，第 i 格写谁就是写谁。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "算总和：先声明一只 int 累加器从 0 起，用 += 把每一格加进去，最后用一条 std::println 把和打出来。", acceptRegex: ["\\bint\\s+\\w+\\s*=\\s*0\\s*;", "\\w+\\s*\\+=\\s*\\w+\\s*\\[", "std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "int sum = 0;\nfor (int i = 0; i < 10; ++i) sum += arr[i];\nstd::println(\"和 = {}\", sum);", why: "先算完再归还：算的这一步读的就是那块地里的内容。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "还地并撕纸条：用 delete[] 把整排地归还，紧跟一句把那张纸条写成 nullptr。", acceptRegex: ["delete\\s*\\[\\s*\\]\\s*\\w+\\s*;", "\\w+\\s*=\\s*nullptr\\s*;"], acceptOn: "code", sample: "delete[] arr;\narr = nullptr;", why: "数组用 delete[]，单个对象用 delete；归还的是那块地，纸条上那串号照旧写着，所以撕纸条得人自己写。" },
        { id: "q5", type: "code", score: 20, coversTask: 2, stem: "任务第 2 条：把归还那行注释掉再跑一次，让那行以注释的形式留在文件里（// delete[] 纸条名），看清屏幕上一行都不缺。", acceptRegex: ["//[^\\n]*delete\\s*\\["], acceptOn: "buffer", sample: "// delete[] arr;   跑一遍：结果照样对，漏的是那块地", why: "这种看不到的错误编译器不拦、运行不崩，长期跑的服务会被一点点拖垮。正则只能验那行真被注释掉了，你观察到什么得靠注释本身，判不严格。" },
        { id: "q6", type: "code", score: 20, coversTask: 3, stem: "任务第 3 条：用注释写清楚大数组为什么要放堆上：点到栈和堆各自的容量，或者装不下的后果。", acceptRegex: ["//[^\\n]*(栈|堆)", "//[^\\n]*(MB|溢出|装不下|几兆|仓库)"], acceptOn: "buffer", sample: "// 栈只有几 MB，一百万个 int 是 4 MB 左右，硬放会堆栈溢出当场崩；堆是仓库，自己 new 自己 delete", why: "栈跟着函数一起消失、快到几乎不要钱，但只有几 MB；堆的大小运行时才定也行。正则只验点到关键词，道理对不对得人来读。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n\nint main() {\n    int* arr = new int[10];\n    for (int i = 0; i < 10; ++i)\n        arr[i] = i + 1;\n\n    int sum = 0;\n    for (int i = 0; i < 10; ++i)\n        sum += arr[i];\n    std::println(\"和 = {}\", sum);\n\n    delete[] arr;\n    arr = nullptr;\n    // delete[] arr;        刚才把这行注释掉跑了一遍：屏幕上一行不缺，那块地却没还\n    // 栈只有几 MB，一百万个 int 是 4 MB 左右，硬放会堆栈溢出当场崩；堆是仓库，大小运行时才定也行\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n\nint main() {\n    int arr[10] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};\n    int sum = 0;\n    for (int i = 0; i < 10; ++i) sum += arr[i];\n    std::println(\"和 = {}\", sum);\n    return 0;\n}\n",
          "#include <print>\n\nint main() {\n    int* arr = new int[10];\n    for (int i = 0; i < 10; ++i) arr[i] = i + 1;\n    int sum = 0;\n    for (int i = 0; i < 10; ++i) sum += arr[i];\n    std::println(\"{}\", sum);\n    return 0;\n}\n",
          "#include <print>\n\nint main() {\n    int* arr = new int[10];\n    delete[] arr;\n    return 0;\n}\n"],
        loose: [
          "# include <print>\nint  main ( )\n{\n    int *  cells = new int [ 10 ] ;\n    for (int k = 0; k < 10; k++)\n        cells [k] = k + 1;\n\n    int  total = 0;\n    for (int k = 0; k < 10; k++)\n        total += cells [k];\n    std::println( \"总共 {}\" , total );\n\n    delete []  cells ;\n    cells = nullptr;\n    // delete[] cells;   任务 2 那一行，跑完再还回来\n    // 表面上一切正常，其实那块地一直没还\n    // 栈只有几 MB，堆是仓库；一百万个 int 大约 4 MB，放栈上当场溢出\n    return 0;\n}\n"]
      }
    },
    {
      cid: "c77", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 77 课考试 · 裸指针的四大坑", task: "任务题目：把坑① 里那句解引用挪到 if 外面，对 nullptr 硬来一次，看清崩溃信息里的 segfault 或段错误字样；再用带边界检查的那扇门取一次越界的格子，把抛出来的那只东西接住、打印它的消息；最后答一句：坑③ 泄漏和坑④ 越界，编译器为什么不报错", hint: "想不起来就回看正文【演示 1】那个 else、【演示 2】delete 后面紧跟的那句置空，还有【演示 3】里那两块花括号各管哪一段。",
      notes: ["解引用一个没指向任何东西的指针是未定义行为，最常见的下场是段错误（segfault）—— 见一次就记住了。", "方括号 [] 不查边界，at() 查：越界时 at() 当场报错停下，[] 继续把那块内存里的垃圾读给你看。", "编译器只查语法，运行时边界它不管：这就是「能编过」和「结果对」是两件事。", "坑③④（拿过期的指针、给错了类型）为什么编译器不提醒？因为它只看这一句写得合不合语法。", "先猜结果，再把合法那部分单独跑一遍对：这一课的四条坑都是这么抓出来的。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "写一份能跑的形：把打印工具箱搬进来，开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*(print|iostream|vector)\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <print>\n#include <vector>\n\nint main() {", why: "这一课开始碰容器和指针，先把入口和要用的东西摆齐。" },
        { id: "q2", type: "code", score: 25, coversTask: 1, stem: "任务第 1 条：造一个只有三个数的名单，再对那个空指针（或者还没指向任何东西的指针）动手 —— 写出你会踩坑的那一行。", acceptRegex: ["std::vector<\\s*\\w+\\s*>\\s*\\w+\\s*[({=]", "\\b\\w+\\s*(->|\\*)\\s*\\w+|\\*\\s*(\\w+)\\s*="], acceptOn: "buffer", sample: "std::vector<int> v = {1, 2, 3};\n    int* p = nullptr;\n    *p = 7;", why: "空指针不知道自己指向哪儿，一解引用就是段错误（segfault）—— 这一课要你亲眼见一次。" },
        { id: "q3", type: "code", score: 25, coversTask: 2, stem: "任务第 2 条：去拿名单里第 10 个位置 —— 用 at 写，别用方括号，这样程序会在越界那一刻当场停下来说话。", acceptRegex: ["\\.\\s*at\\s*\\(\\s*10\\s*\\)"], acceptOn: "code", sample: "v.at(10);", why: "方括号 [] 不查边界，越界了也照读，看到的是垃圾；at() 会当场报位置不对。本课要记的就是这两种取法的差别。" },
        { id: "q4", type: "code", score: 10, coversTask: 2, stem: "在那一行旁边用注释写下：这一越界是按方括号那种取法会看到什么、按 at 这种取法会看到什么。", acceptRegex: ["\\/\\/[^\\n]{6,}"], acceptOn: "buffer", sample: "// [] 会读出垃圾值，at(10) 会当场报 out of range 停下", why: "正则只能验你写了这行注释，验不了里面的话对不对 —— 这一条的实质要回看【常见坑】那一段自己核对。" },
        { id: "q5", type: "code", score: 15, coversTask: 3, stem: "任务第 3 条：坑③④那种「编译器只查语法、不管运行时边界」的写法，写一条能编过但结果不对的：把一个下标给到名单末尾之外。", acceptRegex: ["\\[\\s*\\w+\\s*\\.\\s*size\\s*\\(\\s*\\)\\s*\\]|\\[\\s*3\\s*\\]"], acceptOn: "code", sample: "std::println(\"{}\", v[3]);", why: "编译器只看语法对不对：v[3] 形状合法，越界不越界它不管 —— 这就是本课说的「运行时边界没人查」。" },
        { id: "q6", type: "code", score: 10, stem: "收尾：把这条程序允许编过的部分打印出来（拿那个合法的第一个数），再 return 0。", acceptRegex: ["std::(println|print)\\s*\\(", "return\\s+0\\s*;"], acceptOn: "code", sample: "std::println(\"first = {}\", v[0]);\n    return 0;", why: "先让合法的那部分跑通，才看得清是哪一行把程序带崩的。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <vector>\n\nint main() {\n    std::vector<int> v = {1, 2, 3};\n    int* p = nullptr;\n    *p = 7;   // 空指针一解引用就段错误\n    v.at(10);  // [] 会读出垃圾值，at(10) 会当场报 out of range 停下\n    std::println(\"{}\", v[3]);\n    std::println(\"first = {}\", v[0]);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "int main() { return 0; }\n",
          "std::vector<int> v = {1, 2, 3};\nstd::println(\"{}\", v[1]);\n"],
        loose: [
          "#  include < vector >\n#include <print>\nint  main ( ) {\n  std::vector<int>  v {1,2,3};\n  int * p = nullptr;\n  * p = 7;  // 空指针\n  v . at ( 10 );   // 这一行会当场停下\n  std::println(\"{}\", v [ 3 ] );\n  std::println( \"first = {}\" , v[0] );\n  return 0;\n}\n"]
      }
    },
    {
      cid: "c78", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 78 课考试 · 智能指针", task: "任务题目：把上一课坑③ 那个「new 一百万次、归还零次」的循环改成 unique_ptr 版本，确认自己一句归还都不用写；再用 make_unique 造一个能装 10 个 int 的数组、填 1 到 10 求和，跟第 76 课手写 delete 那一版比一比；最后答一句：为什么说 vector 加智能指针消灭了你 99% 的 new 和 delete 需求", hint: "想不起来就回看正文【演示 1】那两个大括号、【演示 2】末尾那个一百万圈的循环，还有【演示 3】那三行计数。",
      notes: ["auto q = std::move(p); 跑完之后 p 是一张空纸条：独占的钥匙只有一把，递出去原主当场空掉；直接复制 unique_ptr 压根编译不过。", "shared_ptr 是合租：赋值给新人计数加一，每位合租人出作用域计数减一，数到零那一刻才真的归还那块地。", "两张 shared_ptr 互相牵着就谁都不肯先松手，计数永不归零，地还不回来 —— 这套机制唯一治不了的漏，没有报错也没有崩溃。", "一串会长的东西交给 vector；只借看不复制交给 const 引用；要原地改外面那只就交引用 —— 这三样都轮不到智能指针。", "在堆上造一个对象、而且它的寿命要跨过大括号活到外面，这一小块才真的该交给智能指针。"],
      questions: [
        { id: "q1", type: "code", score: 20, coversTask: 1, stem: "治掉那个泄漏循环：把智能指针工具箱请进来（#include <memory>），再在循环里每一圈用 make_unique 造一只 int，交给 auto 接住。", acceptRegex: ["#\\s*include\\s*<\\s*memory\\s*>", "\\bfor\\s*\\(", "auto\\s+\\w+\\s*=\\s*(std::)?make_unique\\s*<\\s*int\\s*>\\s*\\("], acceptOn: "code", sample: "for (int i = 0; i < 1000000; ++i) {\n    auto one = std::make_unique<int>(i);   // 每圈出大括号就还\n}", why: "归还被绑在纸条的寿命上：作用域一结束，它的收尾动作自动执行，全段一句 delete 都不用写。" },
        { id: "q2", type: "code", score: 15, coversTask: 1, stem: "跑完那一百万圈，用一行注释写下你确认了哪件事（点到没漏、自动归还或不用写 delete 都行）。", acceptRegex: ["//[^\\n]*(没漏|漏|自动|归还|不用写|delete)"], acceptOn: "buffer", sample: "// 这一百万圈跑完，一格都没漏：既无泄漏也无悬垂，全靠作用域", why: "确认这件事本身得靠跑和读，正则只能验注释里点到了这些词，句子对不对得人来读，这一条判不严格。" },
        { id: "q3", type: "code", score: 20, coversTask: 2, stem: "向仓库要一整排：用 make_unique 造一个能装 10 个 int 的数组 —— 尖括号里 int 后面跟一对空方括号，圆括号里给出个数，交给 auto 接住。", acceptRegex: ["auto\\s+\\w+\\s*=\\s*(std::)?make_unique\\s*<\\s*int\\s*\\[\\s*\\]\\s*>\\s*\\(\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "auto arr = std::make_unique<int[]>(10);", why: "数组有专门的类型写法；归还时它自己知道整排怎么还，你不用去记 delete 带不带方括号那件事。" },
        { id: "q4", type: "code", score: 15, coversTask: 2, stem: "用下标把这一排格子填上 1 到 10。", acceptRegex: ["\\w+\\s*\\[\\s*\\w+\\s*\\]\\s*=[^=]"], acceptOn: "code", sample: "for (int i = 0; i < 10; ++i) arr[i] = i + 1;", why: "unique_ptr 造出来之后，下标访问照旧跟裸数组一样写。" },
        { id: "q5", type: "code", score: 15, coversTask: 2, stem: "求和：声明一只 int 累加器从 0 起，用 += 把每一格加进去，最后用一条 std::println 把和打出来。", acceptRegex: ["\\bint\\s+\\w+\\s*=\\s*0\\s*;", "\\w+\\s*\\+=\\s*\\w+\\s*\\[", "std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "int sum = 0;\nfor (int i = 0; i < 10; ++i) sum += arr[i];\nstd::println(\"和 = {}\", sum);", why: "跟手写 new 那一版算的是同一笔账；两版差的就是要不要自己写归还那一句。" },
        { id: "q6", type: "code", score: 15, coversTask: 3, stem: "任务第 3 条：用一行注释说清 vector 加智能指针凭什么消灭了 99% 的 new 和 delete（点到谁来管内存）。", acceptRegex: ["//[^\\n]*(vector|容器|智能指针|自己管|自动)"], acceptOn: "buffer", sample: "// 要一串东西就交给 vector，容器一死地就还；单个对象要在堆上、还得活得比花括号久，才轮到智能指针", why: "这一条为什么这么出：99% 与 1% 的分界是判断，不是写法；正则只验注释点到过那几样东西，判不严格。" }
      ],
      selftest: {
        refs: [
          "#include <memory>\n#include <print>\n\nint main() {\n    for (int i = 0; i < 1000000; ++i) {\n        auto one = std::make_unique<int>(i);   // 每圈出大括号就还，一句 delete 都不用写\n    }\n    // 这一百万圈跑完，一格都没漏：无泄漏、无悬垂，全靠作用域\n\n    auto arr = std::make_unique<int[]>(10);\n    for (int i = 0; i < 10; ++i) arr[i] = i + 1;\n\n    int sum = 0;\n    for (int i = 0; i < 10; ++i) sum += arr[i];\n    std::println(\"和 = {}\", sum);\n    // 要一串东西就交给 vector 自己管内存，单个对象要活得比花括号久才轮到智能指针，这就是那 99%\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n\nint main() {\n    int* arr = new int[10];\n    for (int i = 0; i < 10; ++i) arr[i] = i + 1;\n    int sum = 0;\n    for (int i = 0; i < 10; ++i) sum += arr[i];\n    std::println(\"和 = {}\", sum);\n    delete[] arr;\n    return 0;\n}\n",
          "#include <memory>\n#include <print>\n\nint main() {\n    for (int i = 0; i < 1000000; ++i) {\n        auto one = std::make_unique<int>(i);\n    }\n    // 一格都没漏\n    return 0;\n}\n",
          "#include <memory>\n#include <print>\n#include <string>\n\nint main() {\n    auto s1 = std::make_shared<std::string>(\"共享数据\");\n    auto s2 = s1;\n    std::println(\"几个人在用? {}\", s1.use_count());\n    return 0;\n}\n"],
        loose: [
          "# include <memory>\n# include <print>\nint  main ( )\n{\n    for (int k = 0; k < 50; k++) {\n        auto  single = std::make_unique < int > ( k );\n    }\n    // 跑完这五十圈不用写 delete，出大括号自动归还，一点没漏\n\n    auto  box = std::make_unique< int []>( 10 ) ;\n    for (int k = 0; k < 10; k++)\n        box [ k ] = k + 1 ;\n\n    int  total = 0;\n    for (int k = 0; k < 10; k++)\n        total += box [ k ];\n    std::println( \"总共 {}\", total );\n    // 一串东西交给 vector 自己管内存，单个对象才用智能指针，这就是那 99%\n    return 0;\n}\n"]
      }
    },
  ]
};
