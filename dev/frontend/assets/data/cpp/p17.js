/* 喵站 · C++ 入门 正文分部 p17：第 71–74 课（第九轮 · 递归 + 前向声明 + 内存地址 + 指针初见）
 *
 * 源稿：学习资料/C++入门/71_递归函数调用自己、72_先声明后定义函数的预告片、73_内存与地址、74_指针基础。
 * 款式照 p13、p01 样板：tip 蓝·本课目标 → 原理讲解 → 它被设计成什么样 → 演示 1/2/3 → 常见坑 → 任务 → tip 绿·本课一句话
 *
 * 闸线备忘（本批必须守住的）：
 *   指针声明 int* p 是第 74 课才拿到的：c71、c72、c73 一律不出现指针声明，第 73 课只讲地址概念与 & 取地址。
 *   new / delete（76）、智能指针（78）、struct（83）、class（112）这四课都不碰。
 *   取地址 &名字 与引用都是 58 课教过的，可以用。
 *   讲解正文一律不写半角圆括号：函数名裸写，补充说明用中文括号。
 *   交叉引用只往回指，往前看的统一写「下一课」「以后再讲」。
 *
 * 验收：node dev/tools/cpp-audit.cjs --part dev/frontend/assets/data/cpp/p17.js
 *       node dev/tools/cpp-exam-check.cjs --only c71,c72,c73,c74
 */
window.MIAO_CPP_P17 = {
  chapters: [
    {
      id: `c71`, title: `第 71 课 · 递归：函数调用自己`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：让链条拐个弯压回自己身上 —— 函数在自己肚子里喊它自己。装好两个零件就够：一个出口、一句「规模小一号的自己喊自己」，剩下的交给逐层回话。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 55 课你把大活拆给别的函数，main 在上、零件在下。这一课链条拐了个弯：factorial 在里面喊 factorial。第一眼看像自己咬自己尾巴，可你平常说话就是这么办的 —— 想知道一摞书有多厚，先问下面那摞；问到底只剩一本，那一本多厚眼睛一扫就知道，再把数一本本加回去。活儿从「一大件」变成「小一号的同一件」，剩下那一点自己顺手做掉 —— 这就是递归全部的想法。` },
        { t: `p`, text: `阶乘这个例子最能说明它省了什么。5! 是 5×4×3×2×1，硬算要写循环一路乘下来。换个角度看：5! 就是 5 乘以 4!，而 4! 又是 4 乘以 3!。于是「算 5 的阶乘」这件事，除了手里那个 5 要乘，剩下的跟「算 4 的阶乘」一模一样 —— 同一件活儿、规模小了一号，那正好可以喊自己。一路问到 1!，答案 1 是现成的，谁也不用再问别人。这个「不用再问」的位置，就叫出口。` },
        { t: `p`, text: `为什么非要出口不可？注意喊人的那一层其实还没算完：它手里攥着一张欠条，写着「等下面把 4! 还上来，我乘 5」。第 51 课讲过，函数在 return 之前不许散场，它那一份盒子得留着。自己喊自己时，这种欠条会一层叠一层，越叠越高。出口就是「最里面那层谁也不欠」：它当场交出一个 1，上面那层销掉欠条还回 2，再上面还回 6、24、120 —— 欠条从里往外一张张销掉。没有出口，欠条永远叠下去，盒子堆到内存不够用，程序当场崩溃 —— 这叫栈溢出。` },
        { t: `ul`, items: [
          `**先写出口，再写递**：出口那句 if 放在函数最前面，一进门先问「这一步是不是已经小到能直接答」，能答就直接 return，绝不喊自己。`,
          `**每一层都得让问题变小**：n - 1 就是变小。写反成 n + 1，或者压根没变，出口永远撞不上。`,
          `**出口要够得着**：n <= 1 同时接住 1 和 0；只写 n == 1 的话，把 0 递进去就漏网，它接着喊 factorial 负一，越喊越远。`,
        ]},
        { t: `svg`, caption: `套娃往下问、逐层回话：factorial 5 一路问到 1，出口交出一个 1，乘积再一层层带回来`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 330" font-family="sans-serif">
  <text x="20" y="24" font-size="14" font-weight="700" fill="#142639">factorial(5) 的一次运行：左边往下问，右边往上还</text>
  <text x="30" y="52" font-size="12" font-weight="700" fill="#00599c">往下问</text>
  <text x="430" y="52" font-size="12" font-weight="700" fill="#2e7d32">逐层回话</text>
  <rect x="30" y="62" width="200" height="40" rx="8" fill="#eaf2fb" stroke="#00599c" stroke-width="2"/>
  <text x="130" y="80" font-size="12" fill="#142639" text-anchor="middle">factorial(5)</text>
  <text x="130" y="96" font-size="12" fill="#57677c" text-anchor="middle">欠条：等下层 × 5</text>
  <rect x="30" y="114" width="200" height="40" rx="8" fill="#eaf2fb" stroke="#00599c" stroke-width="2"/>
  <text x="130" y="132" font-size="12" fill="#142639" text-anchor="middle">factorial(4)</text>
  <text x="130" y="148" font-size="12" fill="#57677c" text-anchor="middle">欠条：等下层 × 4</text>
  <rect x="30" y="166" width="200" height="40" rx="8" fill="#eaf2fb" stroke="#00599c" stroke-width="2"/>
  <text x="130" y="184" font-size="12" fill="#142639" text-anchor="middle">factorial(3)</text>
  <text x="130" y="200" font-size="12" fill="#57677c" text-anchor="middle">欠条：等下层 × 3</text>
  <rect x="30" y="218" width="200" height="40" rx="8" fill="#eaf2fb" stroke="#00599c" stroke-width="2"/>
  <text x="130" y="236" font-size="12" fill="#142639" text-anchor="middle">factorial(2)</text>
  <text x="130" y="252" font-size="12" fill="#57677c" text-anchor="middle">欠条：等下层 × 2</text>
  <rect x="30" y="270" width="200" height="40" rx="8" fill="#fdf0e6" stroke="#b8232f" stroke-width="2.5"/>
  <text x="130" y="288" font-size="12" font-weight="700" fill="#b8232f" text-anchor="middle">factorial(1) 是出口</text>
  <text x="130" y="304" font-size="12" fill="#142639" text-anchor="middle">谁也不欠，直接还 1</text>
  <line x1="115" y1="102" x2="115" y2="112" stroke="#00599c" stroke-width="2"/>
  <polyline points="109,106 115,112 121,106" fill="none" stroke="#00599c" stroke-width="2"/>
  <line x1="115" y1="154" x2="115" y2="164" stroke="#00599c" stroke-width="2"/>
  <polyline points="109,158 115,164 121,158" fill="none" stroke="#00599c" stroke-width="2"/>
  <line x1="115" y1="206" x2="115" y2="216" stroke="#00599c" stroke-width="2"/>
  <polyline points="109,210 115,216 121,210" fill="none" stroke="#00599c" stroke-width="2"/>
  <line x1="115" y1="258" x2="115" y2="268" stroke="#00599c" stroke-width="2"/>
  <polyline points="109,262 115,268 121,262" fill="none" stroke="#00599c" stroke-width="2"/>
  <rect x="430" y="270" width="180" height="40" rx="8" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="520" y="294" font-size="12" fill="#142639" text-anchor="middle">还回 1</text>
  <rect x="430" y="218" width="180" height="40" rx="8" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="520" y="242" font-size="12" fill="#142639" text-anchor="middle">还回 2</text>
  <rect x="430" y="166" width="180" height="40" rx="8" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="520" y="190" font-size="12" fill="#142639" text-anchor="middle">还回 6</text>
  <rect x="430" y="114" width="180" height="40" rx="8" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="520" y="138" font-size="12" fill="#142639" text-anchor="middle">还回 24</text>
  <rect x="430" y="62" width="180" height="40" rx="8" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2.5"/>
  <text x="520" y="86" font-size="12" font-weight="700" fill="#2e7d32" text-anchor="middle">还回 120</text>
  <line x1="505" y1="270" x2="505" y2="260" stroke="#2e7d32" stroke-width="2"/>
  <polyline points="499,266 505,260 511,266" fill="none" stroke="#2e7d32" stroke-width="2"/>
  <line x1="505" y1="218" x2="505" y2="208" stroke="#2e7d32" stroke-width="2"/>
  <polyline points="499,214 505,208 511,214" fill="none" stroke="#2e7d32" stroke-width="2"/>
  <line x1="505" y1="166" x2="505" y2="156" stroke="#2e7d32" stroke-width="2"/>
  <polyline points="499,162 505,156 511,162" fill="none" stroke="#2e7d32" stroke-width="2"/>
  <line x1="505" y1="114" x2="505" y2="104" stroke="#2e7d32" stroke-width="2"/>
  <polyline points="499,110 505,104 511,110" fill="none" stroke="#2e7d32" stroke-width="2"/>
  <text x="248" y="150" font-size="12" fill="#57677c">每一层都要等到</text>
  <text x="248" y="168" font-size="12" fill="#57677c">下层还上来才动</text>
  <text x="248" y="286" font-size="12" fill="#b8232f">只有最里层不等任何人</text>
  <text x="30" y="326" font-size="12" fill="#57677c">没有出口，左边的盒子就永远叠下去 —— 栈溢出。</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `C++ 对递归没有任何特殊照顾，也不需要。编译器管喊函数只看三样：这个名字认不认识、参数对不对得上、返回类型是什么。被喊的那位恰好是正在写的这一位，规矩照旧 —— 所以递归在语法上跟第 55 课那条分工链一字不差，新的只是你的想法：动手之前先回答两个问题，最小那一步的答案是什么，这一步怎么把活儿变成小一号的同一件活儿。两个问题答上来，代码基本就写完了。` },
        { t: `p`, text: `还要把话说在前面：递归不是非用不可的技巧。递归能干的事，循环基本都能干，而且循环更省 —— 它不叠欠条，一层盒子都不多留。递归真正顺手的地方，是那些本身自己套着自己的结构：一个文件夹里还装着文件夹、一棵树的分叉、把一堆数分成两半各查一半。那种活儿硬用循环写，就得自己拿数组去模拟那叠欠条；用递归则是白捡。本课先把两个零件装对，手感练出来。` },
        { t: `h2`, text: `演示 1 · 源稿现场：5! 与 10!` },
        { t: `code`, lang: `c++`, code: `#include <print>

long long factorial(int n) {
    if (n <= 1) return 1;              // 出口：套到头了，停！
    return n * factorial(n - 1);       // 5! = 5 × 4!，自己叫自己
}

int main() {
    std::println("5!  = {}", factorial(5));    // 120
    std::println("10! = {}", factorial(10));   // 3628800
    return 0;
}` },
        { t: `p`, text: `函数体就两行，分工极干净：第一行只管「能不能直接答」，第二行才喊自己。看那句 return：乘号左边是你手里已经攥着的 5，右边是 factorial 喊 n 减 1 之后、等下层还上来的 4!。返回类型写 long long 而不是 int，是因为阶乘涨得极凶，13! 就把 int 那个盒子撑爆了 —— 装不下的整数会变负数，这跟递归无关。跑出来是 120 和 3628800，两行都对。` },
        { t: `h2`, text: `演示 2 · 把「往下问、逐层回话」印出来` },
        { t: `code`, lang: `c++`, code: `#include <print>

void count_down(int n) {
    if (n <= 0) return;                 // 出口：什么都不干，直接散场
    std::println("进一层：{}", n);       // 喊之前干的活
    count_down(n - 1);
    std::println("回一层：{}", n);       // 喊完之后还有一件
}

int main() {
    count_down(3);
    return 0;
}` },
        { t: `p`, text: `跑出来的六行顺序很值得盯：进一层 3、进一层 2、进一层 1、回一层 1、回一层 2、回一层 3。前三行是往地下走，后三行是原路回来，中间那句 count_down 就是楼梯口。关键在最后一行打印的位置：它写在递归调用之后，所以必须等下面那一整层彻底干完才轮到它 —— 这个「喊之前」和「喊之后」的差别，是递归里最值钱的一个开关，挪个位置就换一套顺序，往后这个开关还会反复出来烦你。这里出口是 void 版的：一句光秃秃的 return 就是散场，什么也不还。` },
        { t: `h2`, text: `演示 3 · sum_to：递归把 1+2+…+n 加起来` },
        { t: `code`, lang: `c++`, code: `#include <print>

int sum_to(int n) {
    if (n == 1) return 1;               // 出口：只有 1 个数时，和就是 1
    return n + sum_to(n - 1);           // 5 + (4 + 3 + 2 + 1)
}

int main() {
    std::println("1 加到 5 = {}", sum_to(5));
    std::println("1 加到 1 = {}", sum_to(1));
    return 0;
}` },
        { t: `p`, text: `输出是 15 和 1。结构跟 factorial 一模一样，只把乘号换成加号、把 1 的阶乘换成 1 本身。第二句只把 1 递进去，走的正是出口那句 return 1，压根没喊自己 —— 一层就散场，这是递归最短的一趟。再试试把 0 递进去：0 不等于 1，它转去喊 sum_to 负一，一路减到天上也碰不到出口，程序当场崩给你看。要兜住 0，出口得写成 n <= 0 return 0；只把 return 1 改成 return 0，接得住 0 却把答案算错了。出口不只是有没有的问题，还得接得对。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `**忘写出口**：编译一句不错，跑起来当场死给你看 —— 终端打 Segmentation fault，有的编译器还补一句 Stack overflow。根因：欠条叠到栈用完，程序被系统强行抬走。`,
          `**出口条件被绕过**：if 里写 n == 1 才 return，结果递进去一个 0 或负数，n 越来越小、永远不等于 1，照样崩。根因：出口只写了「正好那一步」，没兜住旁边的路。`,
          `**递归那一句前面漏了 return**：error: non-void function does not return a value in all control paths，或者更阴 —— 编译过了，结果是个乱数。根因：返回类型不是 void 就有义务交货，你喊了下层却没把答案带上头，上头拿到的是空。`,
          `**递的方向写反**：每层把 n 加 1 而不是减 1，编译器一声不吭，一跑必崩。规模必须每层变小，这是递归的第二条命。`,
          `**层数太深或结果太大**：把 50 递进 factorial，打出来是个莫名其妙的负数；真想套几万层，还没算完就先栈溢出。前者是盒子装不下，后者是那叠欠条把栈吃光了 —— 两种都不是语法错，只能换类型或换循环。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `1. 写递归 sum_to（n）求 1+2+…+n（先想好出口：n 等于 1 时返回啥？）`,
          `2. 延伸：把演示 2 里「进一层」那句打印挪到那次递归调用后面，跑一遍，看六行的顺序变成什么样，再想想为什么。`,
          `3. 延伸：用递归写 fib（n），第 n 个斐波那契数等于前两个之和，出口是 fib（1）和 fib（2）都返回 1。拿 30 测一下，感受一下它慢 —— 慢在哪，以后再讲。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：递归就是把活儿切成小一号的同一件活儿交给下一次自己 —— 出口保证有底，规模递减保证走得到底，剩下的交给逐层回话。` }
      ]
    },
    {
      id: `c72`, title: `第 72 课 · 先声明后定义：函数的预告片`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把第 55 课那条「零件必须写在上面」的死规矩松开一道缝 —— 一行只回头、不带身体的声明当预告片，编译器先在本子上记下这个名字，正片爱放哪儿放哪儿。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 55 课留过一条顺序规矩：被喊的函数要写在喊人的函数上面，否则编译器报 use of undeclared identifier。规矩的来源很朴素：编译器一路往下扫源码，扫到调用那行时还没见过这个名字，就压根不知道有这号函数。可这条规矩写起来很别扭：main 是程序的门面，读的人最想第一眼看到它，你却只能把它沉到文件最底下，一开门先进仓库。这一课给的缝叫预告片。` },
        { t: `p`, text: `声明就是这么一行：把函数头原样抄一遍 —— bool、名字 is_prime、一对圆括号里写 int n，末尾紧跟着一个分号，花括号身体一个字都不带。它的口气非常直白：「有这个人，收一个 int，还一个 bool，身体我稍后给你。」编译器读到这一行，就在本子上登记这个名字和它的形状。之后 main 里喊 is_prime，它翻本子：名字有、参数对得上、返回类型是 bool，放行。至于身体在哪儿，这一遍它根本不管。` },
        { t: `p`, text: `把声明和定义的分工说透：声明管「认不认识」，定义管「有没有真东西」。源稿那句「正片可以放在后面甚至别的地方」就是靠这个分工撑起来的。声明可以出现很多次，只要形状一致没人拦；带身体的定义只能有一份 —— 写两份，接线那一步就分不清该用哪份，翻脸报错。所以这一课的正确姿势是：形状提前说，身体往后放，最后由编译器把两边接上头。` },
        { t: `ul`, items: [
          `**写法**：返回类型 + 名字 + 参数表 + 分号，四个零件一个不能少，中间不许有花括号。`,
          `**位置**：写在所有函数外面、第一次调用它之前，习惯上摆在文件上方一排。`,
          `**参数名可以省**：那对圆括号里只留一个 int、连名字都不写，再补上分号，照样合法 —— 名字只是占位，编译器核对的全是类型。`,
          `**必须和定义对得上**：返回类型、参数的个数与类型这三样要一字不差；名字则各写各的，两边不同也合法。`
        ]},
        { t: `svg`, caption: `编译器干两件事：读声明那一行时先在本子上登记形状，读定义那一行时收下身体，最后把 main 里的调用接到身体上`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 290" font-family="sans-serif">
  <text x="20" y="22" font-size="14" font-weight="700" fill="#142639">预告片与正片：一份源码，编译器分两次用</text>
  <rect x="20" y="36" width="200" height="56" rx="8" fill="#fdf0e6" stroke="#b8232f" stroke-width="2"/>
  <text x="120" y="56" font-size="12" font-weight="700" fill="#b8232f" text-anchor="middle">声明：bool is_prime(int n);</text>
  <text x="120" y="76" font-size="12" fill="#142639" text-anchor="middle">只有头，末尾是分号</text>
  <rect x="20" y="106" width="200" height="56" rx="8" fill="#eaf2fb" stroke="#00599c" stroke-width="2"/>
  <text x="120" y="126" font-size="12" font-weight="700" fill="#00599c" text-anchor="middle">main</text>
  <text x="120" y="146" font-size="12" fill="#142639" text-anchor="middle">喊 is_prime 的那个循环</text>
  <rect x="20" y="176" width="200" height="70" rx="8" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="120" y="196" font-size="12" font-weight="700" fill="#2e7d32" text-anchor="middle">定义：带花括号的身体</text>
  <text x="120" y="216" font-size="12" fill="#142639" text-anchor="middle">放在 main 后面</text>
  <text x="120" y="236" font-size="12" fill="#57677c" text-anchor="middle">正片在这儿</text>
  <rect x="300" y="36" width="320" height="126" rx="10" fill="#f4f7fc" stroke="#c3ccd8" stroke-width="1.5"/>
  <text x="316" y="58" font-size="12" font-weight="700" fill="#142639">编译器的小本子</text>
  <text x="316" y="80" font-size="12" fill="#142639">is_prime　收 int　还 bool</text>
  <text x="316" y="100" font-size="12" fill="#57677c">读第一行就登记：形状有了</text>
  <text x="316" y="120" font-size="12" fill="#57677c">读 main 那行：照本子核对调用</text>
  <text x="316" y="140" font-size="12" fill="#57677c">读到最后：身体收下，两边接上</text>
  <line x1="220" y1="64" x2="298" y2="64" stroke="#b8232f" stroke-width="2"/>
  <polyline points="290,58 298,64 290,70" fill="none" stroke="#b8232f" stroke-width="2"/>
  <line x1="220" y1="134" x2="298" y2="134" stroke="#00599c" stroke-width="2"/>
  <polyline points="290,128 298,134 290,140" fill="none" stroke="#00599c" stroke-width="2"/>
  <line x1="220" y1="211" x2="298" y2="211" stroke="#2e7d32" stroke-width="2"/>
  <path d="M298 211 L298 162" stroke="#2e7d32" stroke-width="2" fill="none"/>
  <polyline points="292,170 298,162 304,170" fill="none" stroke="#2e7d32" stroke-width="2"/>
  <text x="300" y="252" font-size="12" fill="#142639">一句判断：这一段是只说「有这个人」，还是连他干什么活儿都写清楚了？</text>
  <text x="300" y="272" font-size="12" fill="#57677c">前者是声明，以分号结尾；后者是定义，以花括号收尾。</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `为什么不干脆让编译器多扫几遍，非得先见后喊？因为「先把形状讲清楚、身体另算」这件事对编译器是省力的，对你也是 —— 它扫一遍就能对每个调用做类型检查，不用回头翻。声明正是把「形状」和「身体」拆开的最小代价：形状先给外面的人看，身体爱放哪放哪，甚至可以不在这一份源码里。以后你会见到把这一排声明单挪出去、让别处源码去取的写法，那是这块小砖头的放大版，以后再讲。` },
        { t: `p`, text: `再提醒一个长相：声明结尾那个分号是这条声明语句的结尾，不是函数定义的结尾。第 51 课那种带身体的函数，花括号后面是不加分号的；到第 56 课的 lambda，因为整句是一条声明，分号又回来了。现在你多了一条判据：一行只写「有这个人」，它以分号收；写了这个人干什么活儿，花括号就是它的句号。` },
        { t: `h2`, text: `演示 1 · 源稿现场：is_prime 的预告片` },
        { t: `code`, lang: `c++`, code: `#include <print>
bool is_prime(int n);                  // 声明：预告片，注意分号
int main() {
    for (int n : {2, 9, 17, 21}) {
        std::println("{} {}", n, is_prime(n) ? "是素数" : "不是");
    }
    return 0;
}
bool is_prime(int n) {                 // 定义：正片放在 main 后面
    if (n < 2) return false;
    for (int i = 2; i * i <= n; ++i)
        if (n % i == 0) return false;
    return true;
}` },
        { t: `p`, text: `跑出来四行：2 是素数、9 不是、17 是素数、21 不是。这一版最顺眼的是顺序：声明在第一行，门面回到了最上面，算法细节沉到底下。判素数那截本身也值得看一眼：i 只试到 i 乘 i 不超过 n 为止，也就是试到平方根，因为 n 如果有因子，小的那个一定不超过平方根；21 撞上 i 等于 3 就 return false，压根不用试到 20。` },
        { t: `h2`, text: `演示 2 · 非用声明不可的现场：两个函数互相喊` },
        { t: `code`, lang: `c++`, code: `#include <print>
bool even(int n);                      // 两行预告片，先互相登记
bool odd(int n);
bool even(int n) {
    if (n == 0) return true;
    return odd(n - 1);                 // 我喊你
}
bool odd(int n) {
    if (n == 0) return false;
    return even(n - 1);                // 你喊我
}
int main() { std::println("4 偶？{}　7 奇？{}", even(4), odd(7)); return 0; }` },
        { t: `p`, text: `这场是排顺序排不出来的：even 喊 odd，odd 又喊 even，谁写在前面都得喊一个还没见过的名字。上一课刚学的递归在这儿帮了忙 —— 一个数是不是偶数，等于「少 1 之后是不是奇数」，一路减到 0 就是出口。两行声明把两个人的形状都提前登记好，这段代码才立得住。跑出来是 4 偶？true　7 奇？true。把上面两行声明删掉一行试试，报错立刻回到 use of undeclared identifier —— 这正是本课任务要你亲手撞的事。` },
        { t: `h2`, text: `演示 3 · 声明可以重复，参数名可以只留类型` },
        { t: `code`, lang: `c++`, code: `#include <print>
int twice(int x);                      // 声明第一次出现
int twice(int);                        // 再来一次：参数名可以省
int twice(int n) { return n + n; }     // 定义：参数名换成 n 也合法
int main() {
    std::println("twice(21) = {}", twice(21));
    std::println("twice(twice(3)) = {}", twice(twice(3)));
    return 0;
}` },
        { t: `p`, text: `输出 42 和 12。三件事一起摊开：第一，同一个形状声明两遍没人管，编译器只要它们不打架；第二，声明里的参数名可以省成只有类型，因为核对调用靠的全是类型；第三，定义那行把名字写成 n 而声明写 x，完全合法 —— 两个作用域里各自的名字，互不相干。最容易做的一种错法是：给那句声明也加上花括号，哪怕里面空着 —— 花括号一开它就升级成定义，而且是空身体，编译器立刻追一句 non-void function does not return a value in all control paths。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `**声明整行删了**：error: use of undeclared identifier 'is_prime'，红线正指在 main 里那次调用上。根因：本子上没登记过这个名字，编译器压根不知道有这个人 —— 这正是本课任务让你亲手看的那条错。`,
          `**声明末尾的分号漏了**：报错往往不指在你改的那一行，而是往下跑一两行，来一句 expected expression，或者翻脸说后面那个定义和前面的声明冲突。根因：编译器把下一行的开头当成了这一句的续写。`,
          `**声明和定义形状不一致**：声明那行的参数写 int，定义那行写成 long —— 报 declaration of is_prime 这一句与声明冲突，或者调用处来一句 no matching function for call to 'is_prime'。返回类型和参数的类型必须一字不差。`,
          `**只有声明、没有定义**：编译一路放行，卡在最后接线那一步 —— 报 undefined reference to is_prime，末尾还跟着 ld 那句找不到符号。根因：预告片说得漂亮，正片一部都没拍。这一条最懵，因为它根本不是语法错。`,
          `**把声明写进函数肚子里**：语法能过，读的人懵。本课一律摆在文件上方一排，谁想找谁抬头。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `1. 删掉声明那行再编译，看看报什么错（体会声明的作用）`,
          `2. 延伸：再把声明留着、只把它的分号删掉，看报错长什么样、红线画在哪一行，和上一条对一对：为什么这两个错的长相差那么远？`,
          `3. 延伸：给演示 2 那场互喊再加第三个函数，比如 is_positive，三个函数绕着喊一圈，把需要的声明补齐。写完想想：什么时候你宁可退回第 55 课那种「老老实实排顺序」的写法？`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：声明是分号收尾的预告片，只讲形状不讲身体；编译器先照形状放行调用，最后再把调用接到身体上。` }
      ]
    },
    {
      id: `c73`, title: `第 73 课 · 内存与地址：变量住在哪一号柜子`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把「变量到底在哪儿」这件事看清楚 —— 内存是一排编了号的柜子，编号就叫地址；一句 & 取地址问出这个变量的门牌号。这一课只问号，先不学拿纸条把号记下来，那是下一课的事。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `前面七十课你打交道的全是值：一个 15、一串文字、一整串分数。可值不会飘在空中，它一定装在某个具体的地方 —— 你机器上的内存里。把内存想成一排长得吓人的柜子：每格装 1 字节，每格刷了个编号，编号就是所谓「地址」。int age = 15; 这一行，机器干的是两件事：找 4 个连续的柜子腾出来，把 15 按某种方式摊进去，然后记住这一组的起始编号。名字 age 你写得舒服，编译器则在背后把这个名字一直翻译成那个编号。` },
        { t: `p`, text: `类型在这套账里管两件非常具体的事：占几格，以及怎么解读这几格。char 占 1 格，int 通常 4 格，double 通常 8 格 —— 同样一堆 0 和 1，用 int 的方式读出来是 15，用 double 的方式读出来可能是某个很小的数。所以「一个变量」= 一段连续的柜子 + 起始编号 + 一个读法。少了读法，光有编号和格子，谁也不知道里面装的是什么东西。` },
        { t: `p`, text: `&age 问的是「你住几号柜」。这个 & 读作取地址，站在变量前面，只问不动 —— 问完之后 age 里的值一点没变，你还得到一个很大的数。第 58 课你已经见过另一个 &：它站在类型后面，int& alias 那种，是给人起外号。同一个符号打两份工，认的时候只看它站在哪儿：站类型后面是外号，站变量前面是一问，问门牌号。` },
        { t: `p`, text: `打出来的地址长得像 0x7ffd1234，开头那个 0x 是十六进制的记号，就像 0b 表示二进制。为什么非用十六进制？因为你的内存有几十亿格，编号写成正好十进制要七八位数字，写成十六进制只要一半长度，而且每 1 个十六进制位正好对应 4 个二进制位，换算不打架。看到 0x 开头别慌，那只是个短一点的大数。` },
        { t: `ul`, items: [
          `**&age 是位置，age 是内容**：一个是门牌号，一个是柜子里摊着的东西，两码事。`,
          `**一次运行之内，一个变量的号不会变**：盒子腾好了就不再挪窝，问一百次都是同一个号。`,
          `**两次运行之间，号多半不一样**：程序每次被放到内存的哪个位置，是操作系统临场决定的。`,
          `**复制值就是造新盒子**：int age2 = age; 摊出来一组新柜子，起始编号当然不同 —— 这也是「地址不同就是两家」的凭据。`
        ]},
        { t: `svg`, caption: `门牌号与柜子里的东西：age 占 4 格、起始号 0x7ffd1234，score 另起一组、号不同，所以各住各家`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif">
  <text x="20" y="24" font-size="14" font-weight="700" fill="#142639">内存 = 一排编号的柜子，每个柜子 1 字节</text>
  <rect x="20" y="44" width="76" height="52" rx="6" fill="#eaf2fb" stroke="#00599c" stroke-width="2"/>
  <text x="58" y="66" font-size="12" font-weight="700" fill="#00599c" text-anchor="middle">age</text>
  <text x="58" y="84" font-size="12" fill="#142639" text-anchor="middle">15</text>
  <rect x="100" y="44" width="76" height="52" rx="6" fill="#eaf2fb" stroke="#8fa7c4" stroke-width="1.5"/>
  <rect x="176" y="44" width="76" height="52" rx="6" fill="#eaf2fb" stroke="#8fa7c4" stroke-width="1.5"/>
  <rect x="252" y="44" width="76" height="52" rx="6" fill="#eaf2fb" stroke="#8fa7c4" stroke-width="1.5"/>
  <text x="138" y="116" font-size="12" fill="#57677c" text-anchor="middle">4 格连在一起</text>
  <rect x="380" y="44" width="76" height="52" rx="6" fill="#fdf0e6" stroke="#b8232f" stroke-width="2"/>
  <text x="418" y="66" font-size="12" font-weight="700" fill="#b8232f" text-anchor="middle">score</text>
  <text x="418" y="84" font-size="12" fill="#142639" text-anchor="middle">92.5</text>
  <rect x="460" y="44" width="76" height="52" rx="6" fill="#fdf0e6" stroke="#d8a98f" stroke-width="1.5"/>
  <text x="498" y="116" font-size="12" fill="#57677c" text-anchor="middle">double 另占一组</text>
  <text x="20" y="146" font-size="12" font-weight="700" fill="#00599c">起始编号就是地址</text>
  <text x="20" y="166" font-size="12" fill="#142639">&amp;age → 0x7ffd1234　　&amp;score → 0x7ffd1240</text>
  <text x="20" y="186" font-size="12" fill="#57677c">两个号不一样 → 完全独立的两家；改 score 不会碰着 age。</text>
  <rect x="20" y="200" width="290" height="72" rx="8" fill="#f4f7fc" stroke="#c3ccd8" stroke-width="1.5"/>
  <text x="36" y="222" font-size="12" font-weight="700" fill="#142639">值与地址，两次不同的问</text>
  <text x="36" y="242" font-size="12" fill="#142639">age　　柜子里摊着的东西　内容是 15</text>
  <text x="36" y="262" font-size="12" fill="#142639">&amp;age　这组柜子的起始号　位置是 0x…</text>
  <rect x="330" y="200" width="290" height="72" rx="8" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="346" y="222" font-size="12" font-weight="700" fill="#2e7d32">类型管两件事</text>
  <text x="346" y="242" font-size="12" fill="#142639">占几格：char 1、int 4、double 8</text>
  <text x="346" y="262" font-size="12" fill="#142639">怎么读：同样一堆位，读法不同值就不同</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `为什么 C++ 非要把地址这件事摊到桌面上给你看？因为这门语言的根就在这里 —— 它不打算替你藏住内存。C++ 直接把硬件那一层的账本翻开：变量就是若干格内存，名字是这些格子的人类可读写法，而 & 让你亲眼看一次这行翻译。看着麻烦，换来的是你能算清「这句占多少地方、动的是哪一块」，后面所有关于内存的活儿都建立在这套图上。` },
        { t: `p`, text: `还有一处值得先说明白：地址不是一个可以被你「存进变量」的普通值 —— 它有自己的去处，那是下一课要给的盒子类型。这一课你能做的就是把号问出来、打出来、拿它比一比大小是否相同。真要把号记在纸上带着走，得再学一样东西；先把「位置」和「内容」这两层在脑子里彻底分开，下一课就是一层窗户纸。` },
        { t: `h2`, text: `演示 1 · 源稿现场：问一次 age 的门牌号` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int age = 15;
    double score = 92.5;
    // & 读作「取地址」，写在变量前面
    std::println("age   的值  : {}", age);
    std::println("age   的地址: {:p}", &age);
    std::println("score 的地址: {:p}", &score);
    return 0;
}` },
        { t: `p`, text: `打出来第一行是 15，后两行是 0x 开头的一大串，比如 age 的地址: 0x7ffd3a2b1c4c、score 的地址: 0x7ffd3a2b1c54。同一只盒子，问内容拿到 15，问位置拿到一串编号；两个编号互不相同，说明 int 和 double 各占自家的格子。格式串里的 {:p} 是专门给地址留的格子，写成 {:} 也能打出来，只是格式不同 —— 记住你打出来的永远是一个位置，不是柜子里摊着的东西。` },
        { t: `h2`, text: `演示 2 · 各住各家：复制的是值，不是柜子` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int age = 15;
    int age2 = age;                          // 复制的是「值 15」，不是柜子本身
    std::println("age  的地址: {:p}", &age);
    std::println("age2 的地址: {:p}", &age2);
    std::println("同一个柜子吗？{}", &age == &age2);
    age2 = 16;
    std::println("age = {}, age2 = {}", age, age2);
    return 0;
}` },
        { t: `p`, text: `输出里第三行是 false，最后一行是 age = 15, age2 = 16 —— 这两句合起来就是这一课的全部结论：给一个变量起外号的时候，两个名字问出同一个号、改哪个都是改本人；而复制出一个新变量，号不同、盒子不同，此后各走各路。这正是本课任务 2 让你加的那行打印：多打一个 &age2，两家的界线立刻在屏幕上显出来。` },
        { t: `h2`, text: `演示 3 · 从地址里读出「占几格」` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    char c = 'A';
    int age = 15;
    double score = 92.5;
    std::println("char 占 {} 格", sizeof c);
    std::println("int 占 {} 格", sizeof age);
    std::println("double 占 {} 格", sizeof score);
    std::println("自己问自己同号吗？{}", &age == &age);
    std::println("age 和 score 同号吗？{}", &age == &score);
    return 0;
}` },
        { t: `p`, text: `四行输出：1、4、8，然后是 true 和 false。sizeof 问的是「这个盒子占几格」，它是编译时就定好的数，跟盒子里装什么值无关 —— 装 15 的 int 和装一百万的 int 一样占 4 格。后面那两句更有意思：同一个变量问两次号一样，说明盒子腾好之后不挪窝；两个不同变量号不同，说明它们各占各的格子。把三个声明的顺序调换一下再跑，看看谁挨着谁 —— 谁先要地方谁先挑位置，这正是下一课的引子。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `**拿 & 去问一个算式的地址**：给 age 加 1 那个算式取地址，编译器报 cannot take the address of an rvalue，或者一句取地址的对象不是左值。根因：只有「真的住在某格里的东西」才有门牌号，加完得出来的那个临时值压根没落脚。`,
          `**把地址当值来算**：不报错，纯发懵。把那串 0x7ffd… 拿去加减比大小 —— 它只是位置，位置之间比大小毫无意义。`,
          `**指望两次运行地址一样**：你写「这次跑是 0x7ffd1234，那我下次拿这个号去比对」—— 下次多半变了。程序被放到内存哪儿是系统临场定的，号能变是正常的，别把号写死在逻辑里。`,
          `**以为 &age 会把 age 改掉**：不会，一句错都不会报，因为 & 只是问话的那张嘴，它不动柜子。跑完再打 age，仍是 15。`,
          `**两种 & 分不清**：站在类型后面是起外号，站在变量前面是问地址。写成 int & r = age 你想问地址，结果造了个引用；写成 &int age 你想起外号，编译器报 expected expression 之类。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `1. 编译运行两次，对比地址是否相同（不同是正常的，每次运行位置不一样）`,
          `2. 自己加一行打印 &age2，验证它和 &age 不是同一个柜子`,
          `3. 思考：为什么地址用 0x 开头？（提示：十六进制写大数更短，1 个十六进制位顶 4 个二进制位）`,
          `4. 延伸：给演示 1 再添一个 char 变量和一个 long long 变量，把四个门牌号一起打出来，看看它们各自占几格、号与号之间差多少。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：变量住在内存里一排编号的柜子中，类型决定占几格怎么读；age 是柜子里的东西，&age 是这一组柜子的起始编号 —— 号不同就是两家。` }
      ]
    },
    {
      id: `c74`, title: `第 74 课 · 指针基础：一张写着门牌号的纸条`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把上一课问到的门牌号存下来 —— int* p = &age; 是一张写着 age 家号的纸条，*p 就是顺着这个号找上门。两个符号方向相反：& 从东西拿到号，* 从号拿到东西。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课你已经会问「age 住几号柜」了，可那个号问出来就打掉，没地方搁。这一课给你搁号的地方：指针。它还是一个盒子，只不过装的不是 15、不是 92.5，而是一串门牌号。源稿那个比方最准：指针就是一张写着门牌号的纸条。int* p = &age; 这一行干的事，是把 &age 问出来的号抄到纸条 p 上 —— 抄的是号，不是柜子里的东西，age 那 4 格一个字节都没动。` },
        { t: `p`, text: `纸条有了，怎么用？顺着号找上门：写 *p，读作「p 记的那号柜里是啥」。于是这一课有两个方向相反的符号，长得都不凶，但千万别搞混 —— & 站在变量前面，从东西拿到号；* 站在这个语境里，从号拿到东西。*p 出现在等号左边就是往那格里写，所以 *p = 100 等价于 age = 100，因为 p 记的正好是 age 的家。` },
        { t: `p`, text: `还有一个 * 在别的地方干活：int* p 里那个星号属于类型那一截，读作「一个指向 int 的指针」，它什么动作都不做，只是声明这张纸条准备装哪一类门牌。源稿任务 3 问的就是这个 —— 两个 * 不是一回事：一个是户口，一个是动作。判据还是那句看位置：挨着类型写的属于类型，挨着变量写的在做解引用。` },
        { t: `p`, text: `为什么要专门造一张纸条？第 55 课留过一句天花板：把值递进函数，函数里改得再欢，外面一点动静没有，因为进去的是复印件。第 58 课的引用摸到了原件，可那外号规矩硬：声明那一刻就得指认本人，认了不换。纸条比外号自由得多 —— 可以先发一张空白的、可以中途换号、可以塞进数组、可以当成参数递出去。后面那些「到哪儿弄一块地方」「把活儿交给别人管」的活儿，全踩在这一课上。` },
        { t: `ul`, items: [
          `**纸条自己也是盒子**：它住在某格柜子里，也有地址，&p 照样问得出来；p 里装的是号，不是 age 的值。`,
          `**类型必须配对**：int* 的纸条记的是「一格 int 的家」，*p 才知道要读 4 格、按 int 的读法解。装 double 的号往 int* 的纸条上抄，编译器当场拦。`,
          `**顺着号改的就是本人**：*p = 100 之后打 age，屏幕上就是 100 —— 中间没有任何同步动作，因为改的是同一格。`,
          `**纸条可以换号**：p = &other; 之后 *p 改的就是 other；换号这一句不带 *，也不带 & 在左边。`
        ]},
        { t: `svg`, caption: `指针就是装着门牌号的纸条：&age 把号抄到 p 上，*p 再顺着号找回 age 那一组柜子；纸条自己也想有一格`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 310" font-family="sans-serif">
  <text x="20" y="24" font-size="14" font-weight="700" fill="#142639">两个方向相反的动作：取地址与解引用</text>
  <rect x="40" y="46" width="200" height="66" rx="10" fill="#eaf2fb" stroke="#00599c" stroke-width="2"/>
  <text x="140" y="70" font-size="12" font-weight="700" fill="#00599c" text-anchor="middle">age 这一组柜子</text>
  <text x="140" y="90" font-size="14" font-weight="700" fill="#142639" text-anchor="middle">内容 15</text>
  <text x="140" y="106" font-size="12" fill="#57677c" text-anchor="middle">起始号 0x7ffd1234</text>
  <rect x="40" y="184" width="200" height="66" rx="10" fill="#fdf0e6" stroke="#b8232f" stroke-width="2"/>
  <text x="140" y="208" font-size="12" font-weight="700" fill="#b8232f" text-anchor="middle">纸条 p</text>
  <text x="140" y="228" font-size="13" font-weight="700" fill="#142639" text-anchor="middle">装着 0x7ffd1234</text>
  <text x="140" y="244" font-size="12" fill="#57677c" text-anchor="middle">它自己的号是 0x7ffd1240</text>
  <path d="M240 90 C300 90 300 200 240 210" stroke="#00599c" stroke-width="2" fill="none"/>
  <polyline points="248,204 240,210 250,216" fill="none" stroke="#00599c" stroke-width="2"/>
  <text x="300" y="140" font-size="12" font-weight="700" fill="#00599c">&amp;age　抄号上纸</text>
  <path d="M240 220 C320 220 320 100 240 100" stroke="#2e7d32" stroke-width="2" fill="none"/>
  <polyline points="248,106 240,100 250,94" fill="none" stroke="#2e7d32" stroke-width="2"/>
  <text x="300" y="164" font-size="12" font-weight="700" fill="#2e7d32">*p　顺号找内容</text>
  <rect x="330" y="46" width="290" height="80" rx="8" fill="#f4f7fc" stroke="#c3ccd8" stroke-width="1.5"/>
  <text x="346" y="68" font-size="12" font-weight="700" fill="#142639">三句问话，三种答案</text>
  <text x="346" y="88" font-size="12" fill="#142639">age → 15　　内容是柜子里摊着的东西</text>
  <text x="346" y="108" font-size="12" fill="#142639">&amp;age 与 p → 同一个号　　*p → 又是 15</text>
  <rect x="330" y="140" width="290" height="80" rx="8" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="346" y="162" font-size="12" font-weight="700" fill="#2e7d32">往柜子里写</text>
  <text x="346" y="182" font-size="12" fill="#142639">*p = 100;　等价于 age = 100;</text>
  <text x="346" y="202" font-size="12" fill="#57677c">改的就是本人，不用回头同步</text>
  <text x="20" y="278" font-size="12" fill="#b8232f">纸条上没抄号就顺着 *p 找上门 —— 编译器不拦，运行时崩给你看。</text>
  <text x="20" y="298" font-size="12" fill="#57677c">口诀：& 从东西拿到号，* 从号拿到东西。</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `为什么指针必须带类型？号本身只是一串数字，内存并不知道自己哪一段归谁。让纸条带上「我记的是一格 int 的家」，编译器才敢替你算出该读几格、该怎么解读、*p 能不能放等号左边。这也是这张纸条比一串裸数字有用的原因 —— 号 + 读法，才凑成一件能干活的东西。` },
        { t: `p`, text: `至于星号写在哪儿：int* p、int *p 这两种排版都合法，含义一样，因为那个 * 说的是类型。C++ 里更靠得住的习惯是让它挨着类型走，读成「int 指针一个」。不过一个声明句里连写两个名字就不那么听话了 —— 这个坑我在常见坑里单独摆出来，它是最经典的一种「看着像指针、其实不是」。` },
        { t: `h2`, text: `演示 1 · 源稿现场：三行打印看穿 & 与 *` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int age = 15;
    int* p = &age;                 // p 的类型是 int*，读作「指向 int 的指针」
    std::println("age 的值    : {}", age);
    std::println("p 记的地址  : {:p}", p);
    std::println("*p 顺藤摸瓜 : {}", *p);
    return 0;
}` },
        { t: `p`, text: `三行输出分别是 15、一串 0x 开头的号、又是 15。第二行和第三行的关系最有意思：p 里装的号跟 &age 打出来的一模一样，而 *p 打出来的 15 跟 age 一模一样 —— 一次抄号，一次顺号，绕了一圈回到同一个盒子。跟上一课对一下：那时号只能临问临打，这一课它被稳稳记在 p 里，能留着、能递出去、能比一比 —— 这就是「存地址的变量」带来的新权力。` },
        { t: `h2`, text: `演示 2 · 通过纸条写回去，再换一张指向` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int age = 15;
    int* p = &age;
    *p = 100;                      // 等价于 age = 100，因为 p 指着 age
    std::println("*p = 100 之后，age = {}", age);
    int other = 7;
    p = &other;                    // 纸条换个号，age 完全不受影响
    *p = 70;                       // 这一次改的是 other
    std::println("age = {}, other = {}", age, other);
    return 0;
}` },
        { t: `p`, text: `跑出来两行：*p = 100 之后，age = 100 和 age = 100, other = 70。第七行那句 p = &other; 是全课最容易写错的一句 —— 换号就是给纸条本身赋值，左边光秃秃一个 p；手滑写成 *p = &other，意思立刻变成「把一串号当成内容灌进 age 那 4 格」，编译器会拦你一句类型对不上。顺手结掉上一课的账：&p 问的是纸条自己的号 —— 它住在另一格柜子里。` },
        { t: `h2`, text: `演示 3 · 纸条递进函数：交换两个数的真身` },
        { t: `code`, lang: `c++`, code: `#include <print>
void swap_ptr(int* a, int* b) {
    int tmp = *a;                  // 先把 a 那格的内容抄下来
    *a = *b;                       // b 的内容写进 a 的柜子
    *b = tmp;                      // 抄下来的那份写进 b 的柜子
}
int main() {
    int x = 1, y = 9;
    swap_ptr(&x, &y);              // 递进去的是门牌号，不是值
    std::println("换完：x = {}, y = {}", x, y);
    return 0;
}` },
        { t: `p`, text: `输出是 换完：x = 9, y = 1。这一版才是第 55 课那句天花板的正面解答：那时函数收到的复印件改不动原件，这次 main 递进去的是两个号，函数里的 a、b 各自记着 x、y 的家，*a、*b 写的就是本人。中间那句 int tmp = *a; 也别省 —— 直接 *a = *b 会把 x 原来的值冲掉，就没法还回 b 了；先抄一份到自家的格子里，是三句话的规矩。要是参数写成 int a、int b，结果原地不动 —— 那就是复印件那一版。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `**声明时忘了星号**：写 int p = &age;，编译器报 cannot initialize a variable of type int with an lvalue of type int 指针那种 —— 它不肯把一串号塞进装整数的盒子。少的星号就是类型那一截。`,
          `**纸条还没抄号就顺着找**：只写 int* p; 接着 *p = 5; —— 编译一路放行，一跑就 Segmentation fault。根因：p 里是这一格柜子留下的旧数字，顺着一个乱写的号找上门，那块地根本不归你。`,
          `**换指向时多写了星号**：*p = &other; 要么被拦一句类型对不上，要么真把一串号当成值灌进原来那格。换号请写 p = &other;，左边不带星。`,
          `**一行里声明两个指针**：int* a, b; 看着像两个都是纸条，其实星号只跟着 a，b 是个老老实实的 int。后面拿 b 去记号就报类型对不上。规矩就一条：一行只声明一个指针，或者写成 int *a, *b;。`,
          `**打印时把 p 和 *p 弄反**：不报错，纯看错 —— 想看号打了 *p，想看值打了 p。心里过一遍口诀：& 从东西拿到号，* 从号拿到东西。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `1. 声明 double d = 1.5;，用 double* 指向它，再通过指针把 d 改成 9.9`,
          `2. 写 void swap_ptr（int* a、int* b），通过两个指针交换两数的值（提示：int tmp = *a; *a = *b; *b = tmp;）`,
          `3. 思考：int* p 里的 * 和 *p = 100 里的 * 是一回事吗？（第一个是类型的一部分，第二个是顺着地址取内容）`,
          `4. 延伸：给演示 2 加一句打印 &p —— 纸条自己也住柜子、也有号。想清楚 p、&p、*p 三个写法各是什么。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：指针是装着门牌号的纸条 —— & 把号抄上去，* 顺着号找上门；改 *p 就是改本人，给 p 赋值就是换一家。` }
      ]
    }
  ]
};



