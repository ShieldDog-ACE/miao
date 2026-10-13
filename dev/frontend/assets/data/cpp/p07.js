/* 喵站 · C++ 入门 正文分部 p07：第 31–34 课（三目 ?: / 带初始化的 if / while / do-while）
 *
 * 源稿：学习资料/C++入门/31_二选一快捷方式?:.cpp、32_带初始化的if.cpp、
 *       33_while循环.cpp、34_do-while循环.cpp
 * 款式照 p01 的六栏课式：tip(蓝) → 原理讲解 → 它被设计成什么样/怎么做 → 演示 N → 常见坑 → 任务 → tip(绿)
 *
 * 验收：node dev/tools/cpp-audit.cjs --part dev/frontend/assets/data/cpp/p07.js
 *       node dev/tools/cpp-exam-check.cjs --only c31,c32,c33,c34
 */
window.MIAO_CPP_P07 = {
  chapters: [
    {
      id: `c31`, title: `第 31 课 · 二选一快捷方式：三目运算符 ? :`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会用 (条件) ? 选A : 选B 一行完成「二选一再把结果存起来」，并知道它什么时候该让位给 if/else。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 27 课学的 if/else 是「分岔口」：走哪条路，路末端各写一段代码。可很多需求其实更简单 —— 两条路都只干同一件事，只是**塞进去的值不一样**：及格存「通过」，不及格存「未通过」，然后都装进同一个变量。为这种「二选一再存起来」写四行 if/else，纯属占地方。` },
        { t: `p`, text: `于是语言里留了一个快捷写法，因为它带三个操作数，中文叫**三目运算符**，符号是 ? 和 : 搭配用：` },
        { t: `code`, lang: `text`, code: `(条件) ? 选A : 选B\n\n   条件为真 → 整个式子的值就是 选A\n   条件为假 → 整个式子的值就是 选B` },
        { t: `p`, text: `读的时候把它念成一句人话：「如果条件成立，就取 A，否则取 B」。像一条**会分岔的传送带**：箱子（条件）过来，质检合格走 A 口，不合格走 B 口，两个口出来的都是**一个值**，接住它就行。` },
        { t: `p`, text: `这里有个关键区别要一次性说清：if/else 是**语句**，它干活，但它自己没有值，你写 int x = if (...) … 是行不通的；三目是**表达式**，它本身**就是一个值**。正因为它是值，它才能出现在任何「需要一个值」的位置上 —— 等号右边当初值、函数括号里当参数、打印语句的坑里当填充物。这就是它比 if/else 短的根本原因：if/else 得先把值「做」出来再存，三目直接**就是**那个值。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `设计上它是 if/else 赋值这一种特定用法的浓缩版，只保留「二选一取值」。所以它天生**只适合小场面**：两个分支各是一个值、逻辑一眼看完。一旦你想在某个分支里多干一件事（打印、改两个变量、再嵌套一层判断），就该老老实实回到 if/else —— 他给你短，是有代价的：读的人得先在脑子里把 ? : 展开成 if/else 才能看懂。` },
        { t: `p`, text: `还有一条藏在语法里的规矩：**先算 ?,再算 :**。条件写在括号里其实不是必须的，但**这门课建议永远加上括号** —— 加括号后一眼看出「条件到此为止」，也避免和第 32 条坑里的优先级问题纠缠。` },
        { t: `h2`, text: `演示 1 · 判定结果一行存好` },
        { t: `code`, lang: `c++`, code: `#include <print>\n#include <string>\n\nint main() {\n    int score = 85;\n\n    std::string result = (score >= 60) ? "通过" : "未通过";  // 真取"通过"\n    std::println("判定: {}", result);\n\n    return 0;\n}` },
        { t: `p`, text: `对照第 27 课的等价写法：声明 result，写 if (score >= 60) 里面赋值一次，else 里面再赋值一次 —— 五行变一行，而且**只有一个地方存值**，不容易出现「某条分支忘了赋值，result 还是空的」这种漏网。这就是它存在的理由：把「必然要赋值两次」的结构压缩成一次。` },
        { t: `h2`, text: `演示 2 · 谁大取谁：两个变量里挑一个` },
        { t: `code`, lang: `c++`, code: `int a = 7;\nint b = 3;\nint bigger = (a > b) ? a : b;            // 谁大取谁\nstd::println("较大值: {}", bigger);      // 较大值: 7` },
        { t: `p`, text: `注意两个分支这里都是 int 变量，类型完全一致，所以结果的类型也就是 int。三目最常干的就是这类活：**从两个候选里挑一个**，比大小、取正数、判断要不要打折后的价格。分支两边同类型的时候，它最好读。` },
        { t: `h2`, text: `演示 3 · 和 if/else 并排看一次` },
        { t: `code`, lang: `c++`, code: `int price = 30;\nint pay;\n\nif (price >= 20) {          // 写法一：if/else，六行\n    pay = price - 5;\n} else {\n    pay = price;\n}\n\nint pay2 = (price >= 20) ? price - 5 : price;   // 写法二：三目，一行` },
        { t: `p`, text: `两段结果一模一样。但你看清了三目的**形状限制**：两个分支各只能是一个值（可以是算式，比如 price - 5），不能是一整段代码。哪天你发现自己在三目的分支里想写大括号，那就是该换回 if/else 的信号。` },
        { t: `h2`, text: `演示 4 · 直接塞进打印里` },
        { t: `code`, lang: `c++`, code: `#include <print>\n\nint main() {\n    int x = 10;\n    std::println("{}", (x % 2 == 0) ? "even" : "odd");   // even\n    x = 7;\n    std::println("{}", (x % 2 == 0) ? "even" : "odd");   // odd\n    return 0;\n}` },
        { t: `p`, text: `println 的坑里需要一个值，三目刚好就是一个值，两者严丝合缝。x % 2 == 0 是「除以 2 余数为 0」，也就是偶数 —— 这里 == 是**比较**（第 27 课那位老演员），别和赋值的单个等号混了。这个写法顺手到你会很快开始依赖它。` },
        { t: `svg`, caption: `一条会分岔的传送带：条件把箱子送到 A 口或 B 口，两个口出来的都是一个值`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250">
  <text x="320" y="22" font-size="14" font-weight="700" fill="#142639" text-anchor="middle">(条件) ? 选A : 选B —— 整条线只产出「一个值」</text>
  <g font-size="13" fill="#142639">
    <rect x="24" y="76" width="150" height="46" rx="8" fill="#eef3fa" stroke="#2f6feb" stroke-width="2"/>
    <text x="99" y="96" text-anchor="middle" font-family="monospace">score &gt;= 60</text>
    <text x="99" y="114" text-anchor="middle" fill="#57677c">条件：真 / 假</text>
    <path d="M174 99 H206" stroke="#57677c" stroke-width="2.5"/>
    <polygon points="206,99 194,93 194,105" fill="#57677c"/>
    <polygon points="262,60 306,99 262,138 218,99" fill="#ffffff" stroke="#00599c" stroke-width="2"/>
    <text x="262" y="96" text-anchor="middle" fill="#00599c" font-weight="700">分岔</text>
    <text x="262" y="114" text-anchor="middle" fill="#57677c" font-size="12">? :</text>
    <polyline points="262,60 262,40 396,40" fill="none" stroke="#1b7482" stroke-width="2.5"/>
    <polygon points="396,40 384,34 384,46" fill="#1b7482"/>
    <text x="278" y="54" fill="#1b7482" font-weight="700">真</text>
    <polyline points="262,138 262,158 396,158" fill="none" stroke="#b8500f" stroke-width="2.5"/>
    <polygon points="396,158 384,152 384,164" fill="#b8500f"/>
    <text x="278" y="150" fill="#b8500f" font-weight="700">假</text>
    <rect x="402" y="18" width="214" height="44" rx="8" fill="#e6f2f4" stroke="#1b7482" stroke-width="2"/>
    <text x="509" y="38" text-anchor="middle" font-weight="700" fill="#1b7482">走 A 口：整式 = 选A</text>
    <text x="509" y="56" text-anchor="middle" fill="#26405a">"通过"</text>
    <rect x="402" y="136" width="214" height="44" rx="8" fill="#fbe9dc" stroke="#b8500f" stroke-width="2"/>
    <text x="509" y="156" text-anchor="middle" font-weight="700" fill="#b8500f">走 B 口：整式 = 选B</text>
    <text x="509" y="174" text-anchor="middle" fill="#5a4a41">"未通过"</text>
    <text x="509" y="14" text-anchor="middle" font-size="12" fill="#57677c">两个口都只交出一个值</text>
  </g>
  <line x1="24" y1="200" x2="616" y2="200" stroke="#c7d3e4" stroke-width="1.5"/>
  <text x="24" y="222" font-size="13" fill="#57677c">因为它「就是一个值」，所以能直接放在等号右边当初值 —— 这正是它比 if/else 短的原因。</text>
  <text x="24" y="242" font-size="13" fill="#57677c">代价：读的人得先在脑子里把 ? : 展开成 if/else，所以只用在一眼看完的小场面上。</text>
</svg>` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `忘写冒号。写成 (score >= 60) ? "通过" "未通过"; 或干脆漏掉 :，g++ 的报错长这样：error: expected ':' before ';' token —— 它找到问号却等不到冒号，一眼就能定位。`,
          `两个分支类型对不上。写成 (score >= 60) ? 1 : "通过"; 会报 error: operands to ?: have different types 'int' and 'const char*'，因为编译器必须在编译时就定下「这个式子是什么类型」，一个数字一个字符串它没法定。想混着给，就统一到同一类（都写字符串，或者都用 std::string）。`,
          `优先级坑：int r = (score >= 60) ? 1 : 0 + 5; 你以为算「先选再加拉」，实际 + 比 ?: 粘得紧，真值走时是 1，假值走时是 5。想要「选完再加 5」必须写成 ((score >= 60) ? 1 : 0) + 5。这就是建议给条件加括号的原因。`,
          `嵌套三目逞能。求成绩档位写成 (score >= 90) ? "A" : (score >= 60) ? "B" : "C" 这种，两层还勉强能读，三层以上人的眼睛要退回重看一遍。分支一多就用第 30 课的 switch 或 if/else 链，别让一行替十行负责。`,
          `拿三目当「有副作用的分支」。一边赋值、一边打印、一边什么都不干的写法，编译器可能放过，读代码的人会猜错你到底改了什么。三目只用来**取值**，改东西交给 if/else。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把 score 改成 50，看 result 变成什么。`,
          `用三目写：偶数打印 even，奇数打印 odd（提示：x % 2 == 0）。`,
          `延伸：把演示 1 改成「满分才显示 优秀，否则显示 良好」，再故意把一个分支改成数字 1，把报错第一行抄下来 —— 这条报错你以后还会见到。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：三目是一个「会分岔的值」—— (条件) ? A : B 只挑一个值出来，短是真短，逻辑一复杂就得还给 if/else。` }
      ]
    },
    {
      id: `c32`, title: `第 32 课 · 带初始化的 if：临时变量只在 if 里活着`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：认识现代写法 if (初始化; 条件)，让「只为这次判断而生的临时变量」用完就当场销毁，别弄脏外面的世界。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 27 课的 if，括号里只需要一个条件。可现实里判断之前常常得**先算一个数**：想知道这次氪金有没有超预算，得先算出「单价乘数量」；想判断双倍分数够不够 150，得先算 score * 2。这个数生下来只为这一次判断服务，判断完就再也没人需要它。` },
        { t: `p`, text: `老写法是提前在外面声明它，于是多出来一个只活两行的名字：` },
        { t: `code`, lang: `text`, code: `int answer = score * 2;       // 在外面出生\nif (answer > 150) { … }        // 只用这一次\nstd::println("{}", answer);   // 它居然还在，谁都可能误用` },
        { t: `p`, text: `这程序跑得通，问题不在对错，在**弄脏外面的世界**：main 的地盘里多了 answer 这个名字，读到后面几十行的人看见它还活着，以为另有用途，顺手拿它去算别的 —— 可它绑的是刚才那次判断的临时数据。名字一多又长寿，出错的地方就会离真正的原因很远。` },
        { t: `p`, text: `现代 C++ 让你把这个变量**直接塞进 if 的括号里**：` },
        { t: `code`, lang: `text`, code: `if (int answer = score * 2; answer > 150) { … }\n    └─────┬─────┘  └──────┬──────┘\n     分号前：临时声明    分号后：真正的条件\n\nanswer 只在这句 if 的地盘里可用，出了右半边大括号就不存在了。` },
        { t: `p`, text: `先把形状记成一句话：**分号前是「先准备」，分号后才是「问什么」**。准备那一句里声明的变量，寿命到 if（连同 else）结束为止，编译器连外面的 println 都懒得检查 —— 外面压根查不到这个名字。` },
        { t: `p`, text: `顺带把这门课一直在用、到这里才该点破的概念说清：一个变量「能被发现的地盘」，专业名词叫它的**作用域**；大括号 { } 就是地盘边界，在括号里声明的名字，出了右半边就查无此人。第 2 课那条「声明只许一次」在重叠的地盘里同样成立：外面的 answer 和 if 里的 answer 是**两个互不相干的变量**，这一点本课的坑里还要再撞一次。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `设计意图就一条：把变量的**生命线缩到最短** —— 生在最靠近使用的地方，死在用完的那一刻。三条收益都很实在：` },
        { t: `ul`, items: [
          `读的人只在判断那一处见到它，不用回头猜「这个 answer 后面还有没有人用」。`,
          `写错地方编译器当场拦：出了 if 再去打印 answer，报错直接说这个名字没声明过。名字泄漏这种事从此不可能悄悄发生。`,
          `名字不再全局抢地盘：两段各自独立的判断都可以叫 answer，互不打扰。`
        ]},
        { t: `p`, text: `代价也照实说。第一，这个形状比老写法密，括号里同时出现声明和条件，第一次读会打磕绊 —— 磕绊几次就顺了。第二，它只适合「临时变量只给这一次判断用」的情况。如果那个数后面还要用（打完这行日志还要拿它算找零），就别硬塞，老老实实在外面声明，这是正常需求不是妥协。` },
        { t: `h2`, text: `演示 1 · 源稿那段跑一遍` },
        { t: `code`, lang: `c++`, code: `#include <print>\n\nint main() {\n    int score = 85;\n\n    if (int answer = score * 2; answer > 150) {\n        std::println("双倍分数 {} 超过 150", answer);\n    } else {\n        std::println("双倍分数 {} 没超过 150", answer);   // else 里也能用\n    }\n\n    return 0;\n}` },
        { t: `p`, text: `score 是 85，answer 就是 170，170 大于 150，走 if 那一支，打出「双倍分数 170 超过 150」。这里要盯的是 else 那行注释：**answer 在 else 里照样可用**。因为 if 和 else 合起来算**一条语句**，初始化变量的地盘盖住整条 if-else。很多人以为它只活在左半边大括号里，这是本课最容易想当然的一点。` },
        { t: `h2`, text: `演示 2 · 老写法把名字留在了外面` },
        { t: `code`, lang: `c++`, code: `#include <print>\n\nint main() {\n    int score = 85;\n\n    int answer = score * 2;            // 在外面出生\n    if (answer > 150) {\n        std::println("超过 150");\n    }\n\n    std::println("answer 还活着: {}", answer);   // 打得出来，隐患就在这\n    return 0;\n}` },
        { t: `p`, text: `最后那行 println 能编译、能打印，看起来人畜无害。隐患是：**没人能一眼看出 answer 后面还有没有人用**，于是它一路活到 main 结束。真要判断的只有那一行，其余全是陪跑的名字。项目一大，陪跑名字堆成山，读代码的成本就是这么涨起来的。` },
        { t: `h2`, text: `演示 3 · 换成 auto 一样好使` },
        { t: `code`, lang: `c++`, code: `int score = 80;\n\nif (auto answer = score * 2; answer > 150) {   // 右边是整数 → 猜成 int\n    std::println("够了，双倍是 {}", answer);\n} else {\n    std::println("不够，双倍是 {}", answer);     // 80 * 2 = 160，其实还是够\n}` },
        { t: `p`, text: `第 4 课那条判断照用不误：右边 score * 2 是整数，auto 猜成 int，毫无悬念。分号前那半边也不限死必须是声明 —— 给一个**已有的**变量赋值再判断也是合法的一句。但它只能塞**一句**：想先干两件事，就提到 if 外面去写，别指望分号能当逗号使。` },
        { t: `svg`, caption: `两个地盘：if 里声明的 answer 生在大括号内，出界即失效`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250">
  <text x="320" y="22" font-size="14" font-weight="700" fill="#142639" text-anchor="middle">if (int answer = score * 2; answer &gt; 150) … else …</text>
  <g font-size="13" fill="#142639">
    <rect x="20" y="40" width="600" height="170" rx="12" fill="#f4f7fc" stroke="#8b98ab" stroke-width="2"/>
    <text x="40" y="64" font-weight="700" fill="#57677c">main 的世界（外面的名字一路活到这里结束）</text>
    <text x="40" y="86" font-family="monospace">int score = 85;</text>
    <circle cx="150" cy="80" r="5" fill="#00599c"/>
    <text x="162" y="86" fill="#26405a" font-size="12">score 在这里出生，管到最外层右括号</text>
    <rect x="60" y="100" width="440" height="86" rx="10" fill="#ffffff" stroke="#00599c" stroke-width="2.5"/>
    <text x="80" y="122" font-weight="700" fill="#00599c">if 的世界（大括号就是地盘边界）</text>
    <text x="80" y="146" font-family="monospace">int answer = score * 2;</text>
    <circle cx="238" cy="140" r="5" fill="#b8500f"/>
    <text x="250" y="146" fill="#5a4a41" font-size="12">answer 在这里出生</text>
    <text x="80" y="170" font-family="monospace" fill="#00599c">if 和 else 合起来是一条语句 → 两边都查得到它</text>
    <path d="M500 143 H560" stroke="#b8500f" stroke-width="2.5"/>
    <polygon points="560,143 548,137 548,149" fill="#b8500f"/>
    <text x="566" y="138" font-size="12" fill="#b8500f">出界</text>
    <text x="566" y="154" font-size="12" fill="#b8500f">即销毁</text>
    <text x="40" y="200" font-family="monospace">std::println("{}", answer);   // ← 编译器查不到这个名字</text>
  </g>
  <line x1="20" y1="222" x2="620" y2="222" stroke="#c7d3e4" stroke-width="1.5"/>
  <text x="20" y="242" font-size="13" fill="#57677c">报错不是惩罚，是它答应你的事：这个名字绝对不可能泄漏到外面被误用。</text>
</svg>` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `漏掉中间那个分号，写成 if (int answer = score * 2 answer > 150)。编译器会在条件开头那儿停下来，报错里带 expected ';' 字样 —— 这个形状的全部信息量就在那个分号上：它把「准备」和「提问」切开。`,
          `出了 if 还去用 answer：报错长得像 error: 'answer' was not declared in this scope（大意：这个名字在这一层地盘里没声明过）。这不是编译器坏了，正是本课的设计目标。想让那个数活着用，就回演示 2 的老写法。`,
          `以为 else 里用不到 answer，于是在 else 里又重算一遍 score * 2。白算，还多出一处以后要同步改的地方 —— 记住「if 和 else 是一条语句，init 变量两边都管」。`,
          `分号前塞两句，写成 if (int a = 1; int b = 2; a > b)。第二个分号后面必须是一个能判真假的**条件**，你再放一条声明进去，编译器当场拒绝。要准备两样东西，就在同一句声明里写完，或者提到 if 外面。`,
          `同名遮蔽：外面已经有一个 answer，if 里又声明一个 answer。里面那些读写只影响里面那个，出了大括号外面的值一个字没变 —— 于是写出「我明明改了怎么没生效」这种最难查的 bug。临时变量换个名字，比如 answer_now，省掉一整晚的疑惑。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把 score 改成 80，会走哪个分支。`,
          `取消最后那行注释，看编译器怎么报「answer 未定义」。`,
          `延伸：用演示 2 的老写法重写演示 1，在 if 结束后再打印一次 answer；然后用一句话分别写清两种写法里「answer 活多久」。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：if (准备; 条件) 把临时变量的生命线缩到最短 —— 生在大括号里，if 和 else 两边都管，出了右括号就查无此人。` }
      ]
    },
    {
      id: `c33`, title: `第 33 课 · while 循环：条件成立就一直重复`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会用 while 把「只要还没达标就再来一圈」写成代码，并且牢牢记住 —— 循环体里必须有人去改变条件。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `到这里为止你写的程序都是**一遍过**：从 main 第一行走到最后一行，走不完的事就再复制一行。可复制粘贴是有尽头的，而**重复**恰恰是计算机最拿手的活 —— 它不知疲倦、不会算到第两百行就烦。把「重复」写进程序的能力，就叫**循环**（loop）。` },
        { t: `p`, text: `先想一个你熟的场面：体育老师跑步打卡，规矩是「没跑够圈数不许走」。你每次面对的决定都长得一模一样：**先问**还差几圈 → 没跑够就**再跑一圈** → 跑完回到门口**再问一次**。while 就是这个流程的字面翻译：` },
        { t: `code`, lang: `text`, code: `while (条件) {\n    重复做的事        // 这一坨叫「循环体」\n}` },
        { t: `p`, text: `执行顺序里有本课**全部的精髓**，值得拆开慢慢念：第一步永远在括号里 —— 问条件；**条件为真**才迈进大括号；把循环体的最后一句干完，控制权**跳回括号再问一次**；某一次问出「假」，立刻从循环里出去，接着执行后面的代码。这样一圈一圈地重复，每一圈叫一次**迭代**。` },
        { t: `p`, text: `因为它是「**先问再干**」，所以有个新手不太习惯的推论：**条件一开始就是假的，循环体一次都不会执行**。这不是 bug，这是 while 的性格 —— 有些场合正是你要的安全阀（没活干就一行都别做）；有些场合你需要「无论如何先做一次」，那是下一课的形状。` },
        { t: `p`, text: `第二条更要命：**循环里必须有人去改变条件**。判据写在括号里，能改它的代码却在大括号里，两者隔着一段距离，写的时候极容易忘记。忘了会怎样？条件永远为真，程序跑到天荒地老 —— 这叫**死循环**，本课演示 3 亲手撞一次。` },
        { t: `h2`, text: `怎么做：循环三件套` },
        { t: `ul`, items: [
          `**进圈前**把状态准备好：计数器、累加器的初值。这一步最容易被跳过，一跳过就是「用没初始化的垃圾值当条件」。`,
          `**括号里**写什么时候停：注意边界是「小于」还是「小于等于」，两者差一整圈。`,
          `**循环体里**每圈都要推进那个状态（比如 n++、sum += n）：不推进就是死循环。这一句和「什么时候停」是配套的，写循环时把它们当一个整体看。`
        ]},
        { t: `h2`, text: `演示 1 · 攒到超过 50 为止` },
        { t: `code`, lang: `c++`, code: `#include <print>\n\nint main() {\n    int n = 1;                   // 第几圈\n    int sum = 0;                 // 已攒的总数\n    while (sum <= 50) {          // 总数没超 50 就继续\n        sum += n;                // 把这一圈的 n 加进去\n        std::println("加上 {} 后，总和 = {}", n, sum);\n        n++;                     // 推进：少了它这一圈就白干\n    }\n    std::println("一共跑了 {} 圈", n - 1);\n    return 0;\n}` },
        { t: `p`, text: `跟着跑一遍：sum 依次变成 1、3、6、10、15、21、28、36、45、55 —— 每圈把当前的 n 加进去，加完 n++。到第 10 圈时 sum 成了 55，回到门口一问「55 小于等于 50」是假，立刻收工。屏幕上是 10 行加和，最后一行报「一共跑了 10 圈」。` },
        { t: `p`, text: `那句 n - 1 值得单独说一句，很多新手在这儿绕不过来：循环结束的那一刻 n 是 11，不是 10。因为**最后一圈照样跑完了 n++**，只是它加完之后没能进门再问一次而已。所以圈数得减一 —— 循环变量的「出口值」常常比你要的数**多走一步**，这是循环里最常见的 off-by-one（差一个）来源。想少费点脑细胞，可以在进圈前另开一个圈数计数器，每圈只加它。` },
        { t: `h2`, text: `演示 2 · 条件是「进门前」问的` },
        { t: `code`, lang: `c++`, code: `int n = 1;\nint sum = 0;\nwhile (sum <= 10) {        // 把上限从 50 改成 10\n    sum += n;\n    std::println("加上 {} 后 sum = {}", n, sum);\n    n++;\n}\nstd::println("跑了 {} 圈", n - 1);   // 5 圈` },
        { t: `p`, text: `sum 走的是 1、3、6、10、15：第 5 圈开始时 sum 正好是 10，「10 小于等于 10」为真，于是这一圈**明知加完会超标**还是干完了，加出 15 才被拦在门外。看懂这条线，你就懂了 while 的判据只管**这一圈开始之前**的状态。真要「绝不超过 10」，条件得换成预判下一圈的形式，比如问 sum + n <= 10 再进 —— 这种边界功夫没有窍门，就是画几张轨迹表练出来的。` },
        { t: `h2`, text: `演示 3 · 死循环现场` },
        { t: `code`, lang: `c++`, code: `int sum = 0;\nwhile (sum <= 50) {\n    std::println("还在跑");    // 没有任何一句改 sum\n}\n// 屏幕刷字停不下来，风扇开始起飞 —— 按 Ctrl+C 杀掉它` },
        { t: `p`, text: `这三行是**真正的死循环**：sum 从头到尾是 0，条件永远是真。顺带把演示 1 那句「少了 n++ 就是死循环」验一遍 —— 你回去删掉 n++ 会看到什么？屏幕刷出 51 行「加上 1 后，总和 = 1 … 51」，然后**正常退出**，最后报「一共跑了 0 圈」。它没死：n 虽然冻在 1，sum 每圈还在加 1，迟早越过 50；真正的灾难是那行错误的圈数统计。教训比「死循环」三个字更值钱：**改条件的不一定只有那一处**，删代码前先把「谁在推动条件」想清楚。` },
        { t: `h2`, text: `演示 4 · 条件一开始就不成立` },
        { t: `code`, lang: `c++`, code: `#include <print>\n\nint main() {\n    int sum = 60;              // 已经超标\n    int n = 1;\n\n    while (sum <= 50) {        // 一进门就问出「假」\n        sum += n;\n        n++;\n    }\n    std::println("循环体一次没跑，sum 还是 {}", sum);\n    return 0;\n}` },
        { t: `p`, text: `输出是「循环体一次没跑，sum 还是 60」，圈数 0。别小看这条：它是 while 最实用的地方 —— 「没活干就什么都别做」。但反过来，如果你要的就是**先做一次再说**（先把菜单打出来再问要不要继续），拿 while 写就别扭了，这个需求下一课有专门的结构接住它。` },
        { t: `svg`, caption: `while 的动线：先问，答「真」才进去；干完跳回门口再问 —— 一次都不干是完全合法的`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 270">
  <text x="320" y="20" font-size="14" font-weight="700" fill="#142639" text-anchor="middle">先问再干</text>
  <g font-size="13" fill="#142639">
    <rect x="40" y="36" width="150" height="34" rx="8" fill="#eef3fa" stroke="#2f6feb" stroke-width="2"/>
    <text x="115" y="58" text-anchor="middle">进圈前备好状态</text>
    <path d="M115 70 V100" stroke="#57677c" stroke-width="2.5"/>
    <polygon points="115,100 109,88 121,88" fill="#57677c"/>
    <polygon points="115,104 200,145 115,186 30,145" fill="#ffffff" stroke="#00599c" stroke-width="2.5"/>
    <text x="115" y="141" text-anchor="middle" fill="#00599c" font-weight="700">条件成立?</text>
    <text x="115" y="160" text-anchor="middle" fill="#57677c" font-size="12">while ( … )</text>
    <polyline points="200,145 268,145" fill="none" stroke="#1b7482" stroke-width="2.5"/>
    <polygon points="268,145 256,139 256,151" fill="#1b7482"/>
    <text x="228" y="138" text-anchor="middle" fill="#1b7482" font-weight="700">真</text>
    <rect x="274" y="122" width="176" height="46" rx="8" fill="#e6f2f4" stroke="#1b7482" stroke-width="2"/>
    <text x="362" y="143" text-anchor="middle" font-weight="700" fill="#1b7482">循环体：干一圈的活</text>
    <text x="362" y="161" text-anchor="middle" fill="#26405a" font-size="12">必须在这里推进条件</text>
    <polyline points="362,122 362,90 115,90 115,100" fill="none" stroke="#1b7482" stroke-width="2.5"/>
    <polygon points="115,100 109,88 121,88" fill="#1b7482"/>
    <text x="240" y="82" text-anchor="middle" fill="#1b7482" font-size="12">干完跳回门口，再问一次</text>
    <polyline points="115,190 115,224" fill="none" stroke="#b8500f" stroke-width="2.5"/>
    <polygon points="115,224 109,212 121,212" fill="#b8500f"/>
    <text x="134" y="212" fill="#b8500f" font-weight="700">假</text>
    <rect x="34" y="228" width="162" height="34" rx="8" fill="#fbe9dc" stroke="#b8500f" stroke-width="2"/>
    <text x="115" y="250" text-anchor="middle" fill="#b8500f">出圈，接着走后面的代码</text>
    <text x="300" y="212" font-size="13" fill="#57677c">第一脚就踩到「假」?</text>
    <text x="300" y="232" font-size="13" fill="#142639" font-weight="700">循环体 0 次，一行都不做。</text>
    <text x="300" y="252" font-size="13" fill="#57677c">条件为真却没人改它 → 死循环。</text>
  </g>
</svg>` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `忘推进条件 → 死循环：屏幕卡住不动、风扇起飞、程序永远不退出。认出来就按 Ctrl+C。根因永远是同一句：括号里的判据和花括号里改判据的那句代码，隔着一段距离，你只写了前者。`,
          `边界想不清，多跑一圈或少跑一圈。sum <= 50 和 sum < 50 是两套轨迹；演示 1 那句 n - 1 就是边界差一步的样子。对付它没有捷径：拿张纸把每圈的 n 和 sum 记下来，跑三圈就明白了。`,
          `忘了给累加器初值。写 int sum; 就进圈，sum 装的是内存里的垃圾值，可能一进门就是「假」，于是循环一次都没跑，你还以为是自己条件写错了。声明时就给 0，是循环的基本功。`,
          `把条件写成赋值：while (sum = 50)。赋值表达式的值就是被赋的那个数，50 非零即为真，条件永远成立 → 死循环；而且 sum 每圈被重置成 50，累加白做。g++ 会好心提醒一句 warning: suggest parentheses around assignment used as truth value，见到这条就去查等号是不是少打了一个。`,
          `循环体只有一句时省掉大括号，回头补第二句忘了加回来。少大括号的话，只有紧跟着那一句在循环里，第二句变成「循环结束后才做一次」，行为和你想的完全两样，而它**能正常编译**。这门课的建议是：循环体永远写大括号。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把条件改成 sum <= 10，看看少跑几圈。`,
          `删掉 n++ 再运行（Ctrl+C 停），亲眼见识死循环。跑完把你看到的行数和最后一行报的圈数记下来，再对照演示 3 解释为什么它其实没有死。`,
          `延伸：用 while 算「1 加到 100」的和并打印（提示：初值 sum = 0，条件 n <= 100，循环体里 sum += n 然后 n++），答案应该是 5050。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：while 是「先问再干」—— 条件假就立刻停，一开始就假就一次都不干；循环体里必须有人推动条件，否则就是死循环。` }
      ]
    },
    {
      id: `c34`, title: `第 34 课 · do-while 循环：先干一次再看条件`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：记住 do-while 和 while 的唯一区别 —— 先干一次再判断，并知道什么活天生该用它。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课的 while 是「**先看条件再干活**」，条件一开始就不成立就一次都不干。这一课的 do-while 把顺序翻过来：「**先干一次，再看条件**」。像尝菜：菜端上来先尝一口，好不好吃（条件）都是尝过之后才说的 —— 你没法在尝之前就知道要不要尝。` },
        { t: `code`, lang: `text`, code: `do {\n    至少要做一次的事\n} while (条件);      ← 结尾这个分号是语法的一部分，别丢` },
        { t: `p`, text: `形状上只有三处和 while 不同：前面多了 do 这个关键字；大括号**后面**才出现 while（条件）；最后跟一个**分号**。那个分号不是装饰 —— while(条件) 单独看是个没头没尾的碎片，加上分号才表示「我这条语句说完了」。第 1 课那句「每条语句以分号收尾」在这儿第一次真的救了你的命，因为没人会在右括号后面想到要点分号。` },
        { t: `p`, text: `执行顺序照旧拆开念：进大括号，把循环体整圈干完；走到末尾问条件；条件为**真**就回到 do 再干一圈；为**假**就出圈。看清楚了？它**天生保证循环体至少执行一次** —— 因为问的时候，活已经干完了。而 while 的循环体可以是 0 次。这是两者唯一且全部的区别，其余部分（推进条件、边界、初值、死循环风险）和上一课一字不差。` },
        { t: `p`, text: `顺带一提：do-while 的循环体同样只有一句时可以省大括号，但同样**不建议**，理由和上一课那条完全一样。` },
        { t: `h2`, text: `什么时候该用它，而不是 while` },
        { t: `p`, text: `判据只有一条：**这件事是不是无论如何都得先做一次**。` },
        { t: `ul`, items: [
          `「先把菜单打出来，再问客人要不要点」—— 菜单必须先出现一次，不然问都没得问。`,
          `「先试一次，失败了再问要不要重试」—— 第一次尝试根本不需要条件。`,
          `倒数、发牌、读取第一轮输入这类「过程本身就是先做后看」的活。`
        ]},
        { t: `p`, text: `那这些活硬用 while 写会怎样？两种丑办法：把条件的初值设成「永远先真一次」（多一个专门骗进门用的变量），或者干脆把循环体**抄两遍**，第一遍在循环外面。抄两遍是 bug 温床 —— 以后需求变了你只改了一处，另一处还在按老逻辑跑。看到这两种写法，就该换成 do-while。反过来，「没活干就一行都别做」的场景仍然是 while 的，别顺手全写成 do-while。` },
        { t: `h2`, text: `演示 1 · 条件一开始就是假的那次` },
        { t: `code`, lang: `c++`, code: `#include <print>\n\nint main() {\n    int k = 100;\n\n    do {                             // 先干！\n        std::println("这行至少执行一次，k = {}", k);\n        k++;\n    } while (k < 100);               // 条件已不成立，这次跑完就停\n\n    std::println("换成 while 的话一次都不会跑");\n\n    return 0;\n}` },
        { t: `p`, text: `跟着走：k 从 100 出发，**不问条件直接进大括号**，打印一行「这行至少执行一次，k = 100」，然后 k++ 变成 101；这时才走到末尾问「101 小于 100」，假，出圈。总共**一次**，屏幕上两行（第二行是那句总结）。同样的初值、同样的条件写成 while，是**零次**。源稿最后那句 println 就是在替你说这句话。` },
        { t: `h2`, text: `演示 2 · 条件为真时它会连跑几圈` },
        { t: `code`, lang: `c++`, code: `int k = 97;\ndo {\n    std::println("跑一圈，k = {}", k);\n    k++;\n} while (k < 100);        // 打印 97、98、99 → 共 3 圈` },
        { t: `p`, text: `三圈：k 依次是 97、98、99，每圈末尾 k++ 后再问，第四圈没进门 —— 问「100 小于 100」为假，注意**等号在这儿生效了**（演示 1 里 k 正好卡在 100 也照样跑了一次，因为那次问的是 101）。把源稿的初值改成 5 就是这个规律的大号版本：从 5 一直打印到 99，共 **95 圈**，而不是 96 —— 「5 到 99 有 95 个数」这件事，正是上一课那条边界坑的孪生兄弟。想快速自检：圈数 = 上限 减 起点 = 100 减 5。` },
        { t: `h2`, text: `演示 3 · 倒计时（任务 2 的写法）` },
        { t: `code`, lang: `c++`, code: `#include <print>\n\nint main() {\n    int t = 3;\n\n    do {\n        std::println("{}", t);       // 先把数字打出来\n        t--;\n    } while (t > 0);                 // 再问还倒数吗\n\n    std::println("发射！");\n    return 0;\n}` },
        { t: `p`, text: `打出 3、2、1 三行，然后「发射！」。这里最能看出 do-while 的贴合：倒数这件事本来就是**先报数、再决定要不要继续**，第一声「3」本来就不该被条件拦。注意 t-- 之后 t 变成 0，末尾问「0 大于 0」为假，于是出圈 —— 想多打一个「0」就把条件放宽到 t >= 0，边界感就是这么用的。` },
        { t: `h2`, text: `演示 4 · 两个结构并排对照` },
        { t: `code`, lang: `c++`, code: `int a = 100;\nint b = 100;\n\nwhile (a < 100) {                 // 先问：假 → 0 次\n    std::println("while 里 {}", a);\n    a++;\n}\n\ndo {                              // 先干：1 次\n    std::println("do-while 里 {}", b);\n    b++;\n} while (b < 100);` },
        { t: `p`, text: `初值一样、条件一样、循环体一样，唯一的差别是**问的时机**，结果一个是 0 次、一个是 1 次。屏幕上只会打出「do-while 里 100」这一行。把这四行对照记牢，本课那句「唯一区别」就算真过关了；以后读到别人的循环，第一眼看的是「先问还是先干」，而不是里面写了什么。` },
        { t: `svg`, caption: `同一份条件，两种动线：while 先问再干（可能 0 次），do-while 先干再问（至少 1 次）`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300">
  <g font-size="13" fill="#142639">
    <rect x="20" y="20" width="292" height="248" rx="12" fill="#f2f7fb" stroke="#1b7482" stroke-width="2"/>
    <text x="166" y="46" text-anchor="middle" font-weight="700" fill="#1b7482">while：先问再干</text>
    <polygon points="166,60 236,96 166,132 96,96" fill="#ffffff" stroke="#1b7482" stroke-width="2"/>
    <text x="166" y="93" text-anchor="middle" fill="#1b7482" font-weight="700">条件?</text>
    <text x="166" y="112" text-anchor="middle" font-size="12" fill="#57677c">第一脚先问</text>
    <polyline points="236,96 286,96" fill="none" stroke="#1b7482" stroke-width="2.5"/>
    <polygon points="286,96 274,90 274,102" fill="#1b7482"/>
    <text x="262" y="88" text-anchor="middle" fill="#1b7482" font-size="12">真</text>
    <rect x="70" y="150" width="192" height="42" rx="8" fill="#e6f2f4" stroke="#1b7482" stroke-width="2"/>
    <text x="166" y="168" text-anchor="middle" fill="#1b7482" font-weight="700">循环体干一圈</text>
    <text x="166" y="184" text-anchor="middle" font-size="12" fill="#26405a">干完跳回上面再问</text>
    <polyline points="286,96 286,171 268,171" fill="none" stroke="#1b7482" stroke-width="2.5"/>
    <polyline points="70,171 46,171 46,118 100,110" fill="none" stroke="#1b7482" stroke-width="2" stroke-dasharray="5 4"/>
    <polyline points="166,132 166,144" fill="none" stroke="#1b7482" stroke-width="0"/>
    <line x1="166" y1="132" x2="166" y2="132" stroke="#1b7482" stroke-width="1"/>
    <polyline points="120,132 60,240" fill="none" stroke="#b8500f" stroke-width="2.5"/>
    <polygon points="60,240 60,227 67,232" fill="#b8500f"/>
    <text x="72" y="212" fill="#b8500f" font-size="12">假：直接出圈</text>
    <text x="150" y="246" font-size="13" fill="#142639" font-weight="700">一开始就假 → 0 次</text>
    <rect x="328" y="20" width="292" height="248" rx="12" fill="#fdf4ec" stroke="#b8500f" stroke-width="2"/>
    <text x="474" y="46" text-anchor="middle" font-weight="700" fill="#b8500f">do-while：先干再问</text>
    <rect x="382" y="62" width="184" height="42" rx="8" fill="#ffffff" stroke="#b8500f" stroke-width="2"/>
    <text x="474" y="80" text-anchor="middle" fill="#b8500f" font-weight="700">循环体先干一圈</text>
    <text x="474" y="96" text-anchor="middle" font-size="12" fill="#5a4a41">不问就进去</text>
    <polyline points="474,104 474,132" fill="none" stroke="#b8500f" stroke-width="2.5"/>
    <polygon points="474,132 468,120 480,120" fill="#b8500f"/>
    <polygon points="474,136 544,172 474,208 404,172" fill="#ffffff" stroke="#b8500f" stroke-width="2"/>
    <text x="474" y="169" text-anchor="middle" fill="#b8500f" font-weight="700">条件?</text>
    <text x="474" y="188" text-anchor="middle" font-size="12" fill="#57677c">干完才问</text>
    <polyline points="404,172 356,172 356,83 378,83" fill="none" stroke="#1b7482" stroke-width="2.5"/>
    <polygon points="378,83 366,77 366,89" fill="#1b7482"/>
    <text x="380" y="164" fill="#1b7482" font-size="12">真：再来一圈</text>
    <polyline points="474,212 474,236" fill="none" stroke="#b8500f" stroke-width="2.5"/>
    <polygon points="474,236 468,224 480,224" fill="#b8500f"/>
    <text x="500" y="228" fill="#b8500f" font-size="12">假：出圈</text>
    <text x="458" y="256" font-size="13" fill="#142639" font-weight="700">至少 1 次</text>
  </g>
  <text x="20" y="290" font-size="13" fill="#57677c">两边都要有人在循环体里推进条件；do-while 一样能死循环 —— 「至少一次」不等于「只有一次」。</text>
</svg>` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `忘了末尾的分号，写成 while (k < 100) 后面什么都不加。报错会指着右括号后面那一处说 expected ';' —— 五种结构里只有 do-while 的这个分号必须写，别的地方都是白捡的，所以忘得也最快。`,
          `以为「反正至少跑一次」，初值就可以随便不管。int k; 直接进 do，循环体照样执行一次，打印出一个内存里的垃圾数；更糟的是这个垃圾可能让末尾的条件一直为真，一路 k++ 到天荒地老。初值这一步在 do-while 里省不掉。`,
          `循环体里忘推进条件 → 真死循环，和上一课一模一样。「至少执行一次」说的是下限，不是上限；要不要停，仍然只看末尾那个条件。`,
          `眼睛一路划过末尾的 while(条件)，忘了它是判据。读 do-while 时把末尾那句念成人话：「要不要再来一圈？」—— 位置变了，它管的还是同一件事。`,
          `把所有循环都写成 do-while 图省事。空清单求和、没有任务时不该启动的流程，多跑的那一次会悄悄交出错的总数或多打的一行 —— 而这种「多干了一次的 bug」编译不报错、跑起来也像正常。选结构的唯一标准还是那句：这件事是不是必须先做一次。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把 k 初始值改成 5，看看会连跑几次。`,
          `用 do-while 写倒计时 3、2、1，最后输出「发射！」。`,
          `延伸：把演示 3 的倒计时改用 while 写一遍，再故意把 t 的初值改成 0，各数一下屏幕上「发射！」之前有几行数字 —— 这个对照做完，两者的区别你就再也不会记混了。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：do-while 与 while 的唯一区别是问的时机 —— 先干再问，所以循环体至少执行一次；末尾那个分号别忘了，条件照样得有人在循环体里推。` }
      ]
    }
  ]
};
