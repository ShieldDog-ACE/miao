/* 喵站 · C++ 入门 正文分部 p10：第 43–46 课（第九轮）
 *
 * 源稿：学习资料/C++入门/43_遍历求和.cpp ~ 46_pair两个值捆一起.cpp。六栏课式照 p01/p04：
 *   tip(蓝·本课目标) → 原理讲解 → 它被设计成什么样 → 演示 N → 常见坑 → 任务 → tip(绿·本课一句话)
 *
 * 本分部守的几条：
 *   1. 字符串全用反引号做分隔符，正文、标题、代码里不出现反引号；标代码名裸写或用「」。
 *   2. 交叉引用只往回指（第 40 课的 vector、第 37 课的 range-for、第 27 课的 if、第 24 课的 +=、
 *      第 12 课的 bool、第 8 课的整数相除）；往后的（pair 是第 46 课、结构化绑定是第 47 课）
 *      一律改写成「以后再讲」「下一课」这种人话。
 *   3. 课号线：vector 40、range-for 37、pair 46、结构化绑定 47。所以 c43/c44/c45 三个代码块里
 *      不出现 pair，c46 用 pair 但遍历一律走 p.first / p.second，绝不写 auto[a, b]，
 *      本分部因此不需要 allowConstructs。
 *   4. 源稿每条【任务】原样进【任务】栏，考卷里每条都有题用 coversTask 对着。
 *   5. 配图两章：c43「逐格累加」、c46「两个值捆一束钥匙」；c44/c45 用 lang 为 text 的 ASCII 图。
 *   6. 每个带 int main 的块把头文件请齐（vector 要 <vector>、print/println 要 <print>、
 *      pair 要 <utility>），片段块不写 main 也不越界；输出全程 std::println / std::print。
 *
 * 验收：node dev/tools/cpp-audit.cjs --part dev/frontend/assets/data/cpp/p10.js
 *       node dev/tools/cpp-exam-check.cjs --only c43,c44,c45,c46
 */
window.MIAO_CPP_P10 = {
  chapters: [
    {
      id: `c43`, title: `第 43 课 · 遍历求和：range-for 配一只账本`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把第 37 课的 range-for 接到第 40 课那只 vector 上走完全程，用一只「账本变量」把总分加出来，再躲开平均分那一步的整数相除 —— 439 除以 5 在整数世界里是 87，不是你预期的 87.8。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 37 课你第一次见到 range-for，今天把它接到第 40 课那只 vector 上，一句话就够：**「把盒子里每个东西挨个端给我」**。for (auto s : scores) 里冒号左边是一只**每轮都新建的小盒子**，右边是要走完的那只 vector；五个分数就转五轮，第一轮 s 装 85、第二轮装 92……走到头自动收工。门牌号、上界、每轮自加一，这些第 35 课 for 要操心的事，这里统统不用写。` },
        { t: `p`, text: `挨个打印只是热身，真正常干的活儿是**边走边算**。算总分要第二样东西：一只**账本变量**。它在循环**外面**诞生并且清零（int total = 0;），在循环**里面**每轮记一笔（total += s;）。这个「外面 / 里面」的分界是全课最要紧的一行：你要是把 int total = 0; 写进花括号里，每一轮都会重新诞生一只 total 并立刻被抹成 0，五轮走完你手里只剩最后一个数 88 —— **编译不报错，运行也不报错**，只有数字是错的，这类错最难查。那个 += 是第 24 课的复合赋值，total += s 与 total = total + s 一回事。` },
        { t: `p`, text: `平均分那一步藏着第二个坑。total 是整数，scores.size() 也是整数，**两个整数相除会把小数部分直接砍掉**（第 8 课那条老规矩）：439 除以 5 给你 87，不是 87.8。源稿的解法是在除法前先把一边变成小数 —— 写 total * 1.0。整数乘一个带小数点的 1 就升级成 double，除法立刻变成小数除法，得到 87.8。后面那句占位坑里写的 {:.2f} 是告诉 println「保留两位小数」，所以打印出来是 87.80 而不是 87.8。` },
        { t: `p`, text: `你可能注意到源稿那段代码把 scores **走了两遍**：第一遍打印，第二遍累加。这不是浪费 —— 里面只有五个数，走两遍的成本可以忽略；更重要的是两件事性质不同，分开写读的人一眼看得懂。什么时候能合成一遍？要办的事彼此不打架（一边打印一边往账本里记）就尽管塞进同一个花括号，本课演示 3 就是这种「一趟顺手办两件事」。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `code`, lang: `text`, code: `for (auto 名字 : 容器) { 每一轮要做的事 }
        │      │
        │      └── scores：要走完的那只 vector（挨个往外端）
        └───────── 每轮新建的一份「复印件」，本轮那个值装在它里面

累加三件套，顺序不能乱：
  1. 循环外备账本   int total = 0;      ← 写在花括号里就每轮清零，全课最大的坑
  2. 循环里记一笔   total += s;         ← 第 24 课的复合赋值
  3. 走完用账本     总分、平均分都从这来` },
        { t: `svg`, caption: `逐格累加：total 在循环外从 0 起步，每轮加一个分数，走完停在 439`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 296">
  <text x="20" y="26" font-size="14" font-weight="700" fill="#142639">std::vector&lt;int&gt; scores = {85, 92, 78, 96, 88};</text>
  <g font-size="15" fill="#142639" text-anchor="middle">
    <rect x="20" y="42" width="76" height="42" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="58" y="68">85</text>
    <rect x="96" y="42" width="76" height="42" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="134" y="68">92</text>
    <rect x="172" y="42" width="76" height="42" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="210" y="68">78</text>
    <rect x="248" y="42" width="76" height="42" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="286" y="68">96</text>
    <rect x="324" y="42" width="76" height="42" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="362" y="68">88</text>
  </g>
  <g font-size="12" fill="#57677c" text-anchor="middle">
    <text x="58" y="102">s = 第0格</text><text x="134" y="102">第1格</text><text x="210" y="102">第2格</text><text x="286" y="102">第3格</text><text x="362" y="102">第4格</text>
  </g>
  <text x="20" y="136" font-size="14" font-weight="700" fill="#142639">int total = 0; 之后每轮 total += s</text>
  <g font-size="15" fill="#142639" text-anchor="middle">
    <rect x="20" y="148" width="76" height="42" fill="#f2f2f2" stroke="#57677c" stroke-width="2"/><text x="58" y="174">0</text>
    <rect x="96" y="148" width="76" height="42" fill="#dff0e2" stroke="#1a7f42" stroke-width="2"/><text x="134" y="174">85</text>
    <rect x="172" y="148" width="76" height="42" fill="#dff0e2" stroke="#1a7f42" stroke-width="2"/><text x="210" y="174">177</text>
    <rect x="248" y="148" width="76" height="42" fill="#dff0e2" stroke="#1a7f42" stroke-width="2"/><text x="286" y="174">255</text>
    <rect x="324" y="148" width="76" height="42" fill="#dff0e2" stroke="#1a7f42" stroke-width="2"/><text x="362" y="174">351</text>
    <rect x="400" y="148" width="76" height="42" fill="#f6e7d8" stroke="#b8722b" stroke-width="3"/><text x="438" y="174">439</text>
  </g>
  <g font-size="12" fill="#57677c" text-anchor="middle">
    <text x="58" y="208">循环前</text><text x="134" y="208">1 轮后</text><text x="210" y="208">2 轮后</text><text x="286" y="208">3 轮后</text><text x="362" y="208">4 轮后</text><text x="438" y="208">走完</text>
  </g>
  <path d="M478 169 H556" stroke="#b8722b" stroke-width="2"/>
  <text x="500" y="162" font-size="12" fill="#b8722b">账本</text>
  <text x="20" y="244" font-size="13" fill="#142639">总分 = 439　　平均 = 439 * 1.0 / 5 = 87.80</text>
  <text x="20" y="272" font-size="13" fill="#b8722b">那个 1.0 是把整数除法换成小数除法的开关；不乘就是 87。</text>
</svg>` },
        { t: `h2`, text: `演示 1 · 先空手走一遍，把每轮端到的打出来` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>

int main() {
    std::vector<int> scores = {85, 92, 78, 96, 88};
    for (auto s : scores) {              // 挨个端出来，一轮一个
        std::print("{} ", s);
    }
    std::println("");                     // 收尾补一个换行

    return 0;
}` },
        { t: `p`, text: `输出是「85 92 78 96 88」。这里打印用的是不带 ln 的 std::print，五个数才挤在同一行；最后单独一句 std::println("") 是「只换行、不打字」，把光标送回行首 —— 源稿这个收尾动作很值得学：不带换行的打印用完，一定要自己补一次换行，不然下一句输出会接在同一行屁股后面。` },
        { t: `h2`, text: `演示 2 · 配上账本：总分与平均分（源稿这段）` },
        { t: `code`, lang: `c++`, code: `std::vector<int> scores = {85, 92, 78, 96, 88};

int total = 0;                        // 账本：循环外清零
for (auto s : scores) {
    total += s;                       // 每轮累加一个
}
std::println("总分 = {}", total);
std::println("平均 = {:.2f}", total * 1.0 / scores.size());` },
        { t: `p`, text: `跑出来是「总分 = 439」「平均 = 87.80」。四行加法：85 → 177 → 255 → 351 → 439，跟上面那张图一格一格对得上。第二行除法里我特意没写 scores.size() 的替身变量：**账本用 total，个数问 size()**，两个数各司其职，这是求平均的标准句式，抄下来以后一直用。想验证整数相除那个坑，把 * 1.0 删掉再跑一次，平均分立刻变成 87，程序一声不吭。` },
        { t: `h2`, text: `演示 3 · 顺便数一数：有几个分数够 90` },
        { t: `code`, lang: `c++`, code: `std::vector<int> scores = {85, 92, 78, 96, 88};

int good = 0;                         // 第二本账本：人数
for (auto s : scores) {
    if (s >= 90) {
        good++;                       // 这一轮够 90，记一笔
    }
}
std::println("90 分以上的有 {} 个", good);` },
        { t: `p`, text: `答案是 2 个（92 和 96）。这一段的重点是**一趟路可以带好几本账本**：total 记总分，good 记人数，两只都在循环外清零、都在循环里改，互不打扰。if 是第 27 课的老朋友，这里它只做一件事 —— 问一句「这个分数够不够 90」，够才记一笔。这种「走一遍顺便分类统计」的写法就是以后处理成绩单、日志、购物车的原型。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `账本没在循环外清零。写进花括号里就每轮重新诞生、立刻被抹成 0，五轮走完只剩最后一个数 88；干脆不给初值（int total;）更糟 —— 盒子里是内存留下的垃圾，总分一上来就离谱，而且每次跑还不一样。规则背死：**账本在循环外、声明就写 = 0、记账在循环内**。`,
          `平均数写成 total / scores.size()。两个整数相除砍掉小数，439 除以 5 得 87。要么乘 1.0 把被除数升级成 double，要么把 total 本身声明成 double。`,
          `{:.2f} 写成 {:.2} 或干脆忘了。前者是「保留两位小数」的格式说明，写错了 println 会照原样把花括号打出来或者报一行格式相关的错；它只管显示，不管数值本身是不是小数。`,
          `拿 auto s 去改分数。本课只做累加，读值用复印件正好；一旦在循环里写 s += 5，你改的是那份每轮新建的复印件，原件一个字没动 —— 这正是下一课要解决的事。`,
          `对空的 vector 求平均。size() 是 0，除数是 0，程序当场出事（报错大意是「除以零」/整数陷阱）。动手算平均之前先确认里面确实有东西 —— 怎么正规地问一句「空了吗」，以后再讲，本课先用 if 挡一下：if (scores.size() > 0) 才去算。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `装 5 个自己的分数，算总分和平均分`,
          `遍历时顺便数：有几个分数 ≥ 90？`,
          `延伸：在演示 3 那个循环里再加第三本账本，记下这五个数里最大的是多少（提示：循环前把 max 设成第一个分数，每轮问一句 s 比 max 大吗）。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：range-for 负责挨个端、账本变量负责记数 —— 账本在循环外清零、循环里 +=，平均分记得乘 1.0 把整数除法换成小数除法，439 才能是 87.80 而不是 87。` }
      ]
    },
    {
      id: `c44`, title: `第 44 课 · 修改元素：下标改一个，auto& 改全员`,
      // 本章三个 c++ 代码块里的【演示 2】必须写 for (auto& s : scores)：这正是源稿第 44 课要教的东西
      // （「想全员都改要注意：range-for 里默认拿到的是复印件，加个 &」）。闸把「auto&」这种写法登记成
      // 「引用参数 &」，课号排在第 60 课，正常写法必被判违规。正文【原理讲解】第三、四段已经当面向读者
      // 讲清 & 是引用、有它摸到原件、没它摸到复印件，故按规矩第 5 条在闸上点名，不改闸。
      
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会用门牌号改单个元素（scores[0] = 90），更要把 range-for 那个 & 讲明白 —— 不写它，你改的是每轮新建的复印件，原件一个字都不会动；写了它，你手里就是原件本尊。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `先说改一个。vector 的**读和写用的是同一个门牌号**：scores[2] 站在等号右边是「把 2 号格的东西问我拿」，站在等号左边就成了「把右边的值换进 2 号格」。这跟第 15 课给字符串按编号取字符是同一套语法，也是第 40 课建好盒子之后你最自然的下一步 —— 门牌号从 0 数，一共 size() 格，最大合法编号是 size() - 1。改完立刻能打印出来核对，别攒到最后。` },
        { t: `p`, text: `麻烦在「全员都改」，比如每人加 5 分、每个价格打个八折。上一课刚学会的 range-for 看着正好合适，但它有一个**默认性格**：冒号左边那只 auto s 是**每轮新建的复印件**。第 43 课拿它来读分数毫无问题，因为读不需要动原件；可你要是写 for (auto s : scores) { s += 5; }，加的那个 5 落进了复印件里，一轮结束这份复印件就被扔掉，原件 scores 从头到尾没被碰过。**程序不报错，运行也正常，只是值没变** —— 这是入门阶段最难自己看出来的一类错。` },
        { t: `p`, text: `解法就是加一个 &：**for (auto& s : scores)**。& 的意思是「引用」，说白了就是**把名字直接接回原件身上**，不再复印一份。这时候 s += 5 等价于 scores[0] += 5、scores[1] += 5……一轮一个，改在正主身上。引用这个词的完整机理以后再讲（源稿的说法是「先照着用」，很实在），本课你只要守住一条判断：**这趟路要不要改东西？要改，auto 后面必须挂 &。**` },
        { t: `p`, text: `顺带还有一个真实的收益：不复印就省下一趟拷贝。五个 int 无所谓，等盒子里装的是长字符串或者以后那些大对象，几万个元素每轮复印一遍是实打实的开销。所以行家的习惯很固定 —— **只读就 auto，要改就 auto&**，两头都不亏。写代码时空格位置随意，auto& s、auto &s、auto & s 在编译器眼里是同一句话，别被排版吓到。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `code`, lang: `text`, code: `改一个：scores[门牌] = 新值;        ← 方括号在等号左边就是「写」
改全员：for (auto& 名字 : scores) { 名字 = 新算法; }
                 │
                 └── 这个 & 是开关：有它 = 原件本尊，没它 = 每轮一份复印件

同一件事的两种写法，结果天差地别：
  for (auto  s : scores) { s += 5; }   跑完什么都没变（复印件被扔掉）
  for (auto& s : scores) { s += 5; }   真的每人加了 5` },
        { t: `p`, text: `上面那张对照表值得贴在显示器边上。它把本课的全部信息压缩成一行：**只有一个字符的差别，一个改得动、一个改不动**。很多人体力活写顺了以后会忘掉这条，然后花半小时查「为什么我的分数没涨」，最后发现 & 不见了。` },
        { t: `h2`, text: `演示 1 · 下标指到哪就改哪（源稿前半）` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>

int main() {
    std::vector<int> scores = {85, 92, 78};
    scores[0] = 90;                     // 0 号格直接换掉
    std::println("第一个变成 {}", scores[0]);
    std::println("第二个没动：{}", scores[1]);

    return 0;
}` },
        { t: `p`, text: `输出「第一个变成 90」「第二个没动：92」。赋值这一步只碰了 0 号格，旁边的格子不受牵连 —— 这跟第 18 课字符串那三台手术的性格一致：**改的是盒子本身**，不需要拿变量去接结果。顺手多打一行「没动的那个」不是啰嗦，是为了确认真的只改了一格，越界改动这类问题常常就是这样被撞出来的。` },
        { t: `h2`, text: `演示 2 · 全员加 5：& 才是原件（源稿后半）` },
        { t: `code`, lang: `c++`, code: `std::vector<int> scores = {85, 92, 78};

for (auto& s : scores) {                // 带 &：拿到原件本尊
    s += 5;
}
for (auto s : scores) {                 // 只读，复印件就够
    std::print("{} ", s);
}
std::println("");                       // 90 97 83` },
        { t: `p`, text: `注意两个循环的分工：第一个带 & 且**只有它在改**，第二个不带 & 且**只负责读**。这不是巧合，是标准配搭：一趟要动东西，一趟只看结果。这段代码开头重新声明了一遍 scores，所以 85 92 78 各加 5 得 90 97 83。要是你把它接在演示 1 那个程序后面（0 号格已经被改成 90 了），第一个数就会是 95 —— 同一只盒子连着改，**加的是当前值，不是出生值**，这一点在多段代码拼起来时最容易算错。` },
        { t: `h2`, text: `演示 3 · 故意把 & 删掉（源稿任务 2）` },
        { t: `code`, lang: `c++`, code: `std::vector<int> scores = {85, 92, 78};

for (auto s : scores) {        // 少了那个 &
    s *= 2;                    // 加在复印件身上
}
for (auto s : scores) {        // 原件仍是出生时那几个数
    std::print("{} ", s);
}
std::println("");` },
        { t: `p`, text: `跑完打印出来是「85 92 78」，**一个都没翻倍**，而且编译器一句警告都没有 —— 这就是源稿让你亲手做这个实验的原因：只有亲眼看过「程序很成功地什么都没做」，以后才不会把「值没变」当成「循环没执行」去乱查。把 & 加回去，也就是 for (auto& s : scores)，s *= 2 立刻生效，得到 170 184 156，这正好就是任务 1 要的「全部改成原来的 2 倍」。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `以为循环里改了值，原件就跟着变了。for (auto s : ...) 里那个 s 每轮新建，出了花括号就作废，加多少个 5 都带不出去。改东西必须 auto&。`,
          `下标越界：只有 3 个元素的盒子写 scores[10] = 1。**它不报「超出范围」这种好话**，而是直接往盒子外面的内存写，可能当场崩、可能改坏别的变量、可能表面一切正常 —— 写之前先拿 size() 确认编号合法。`,
          `把 & 写成孤立的一只盒子：int& r; 编译直接报错，大意是「引用必须初始化」—— 引用天生是「给已有的东西再起一个名字」，没有正主它就不成立。本课的场景交给 auto& 让编译器自己推，别手搓。`,
          `读的时候也强行加 &，然后在循环里不小心改了值。纯读用 auto 反而更安全：复印件怎么折腾都伤不到原件，这是「默认复印」这个设计真正在保护你的地方。`,
          `改完不打印就往下走。本课两个工具的失败都长得很安静：「值没变」和「循环没执行」在屏幕上一模一样，三处改动叠在一起才去看结果就查不动了。空盒子也是同一类陷阱 —— 里面一个元素都没有，auto& 的循环一轮都不执行，先拿 size() 看一眼是不是空的，再去怀疑语法。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把所有分数改成原来的 2 倍`,
          `把 auto& 的 & 删掉再跑，看看分数加得动吗`,
          `延伸：只用下标写法（不许用 auto&）把盒子里**前两个**分数改成 100 和 0，跑完遍历打印整串，确认第三个没被你牵连。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：改一个用门牌号 scores[编号] = 新值，改全员用 for (auto& s : scores) —— 有 & 摸到的是原件，没 & 摸到的是每轮新建的复印件，而后者**失败时一声不吭**。` }
      ]
    },
    {
      id: `c45`, title: `第 45 课 · 清空与判空：empty() 问一句，clear() 一键倒空`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会用 empty() 问「这只盒子空了吗」（回答是真假值，不是数字），会用 clear() 一键倒空（size 归 0 但盒子还在），并把「动手取元素之前先问一句 empty()」变成本能。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `前几课你一直在往盒子里装、从盒子里取。今天这两个是**管理盒子**的动作，都不涉及具体某个格子：一个是问句 empty()，一个是倒空 clear()。名字就是它们的说明书 —— empty 是「空吗」，clear 是「清干净」。` },
        { t: `p`, text: `先说 empty()。它回答的是**真假**，也就是第 12 课那只 bool 盒子装的东西：里面有东西给你 false，一个都没有给你 true。有人会问：我写 temp.size() == 0 不也一样吗？逻辑上一样，两种都算对，但 empty() 有两个好处 —— 读的人一眼看到意图（「这儿在判空」），而且在很多别的容器上 size() 得数一遍、empty() 只看一眼边界，所以判空这件事的「正规问法」就是它。**数个数用 size()，判有没有用 empty()**，各干各的活。` },
        { t: `p`, text: `再说 clear()：一键倒空，所有元素全没，size() 归 0。这里最要紧的一句话是 —— **倒空不等于报废**。盒子还是原来那只盒子，变量名还能用，push_back 照样能往里装，任务 1 让你亲手验的就是这件事。类比一个纸箱：把里面的东西全倒在地板上，纸箱还站在墙角，你随时能再往里放东西；真正「纸箱没了」是出了那个花括号、变量寿命结束才发生的事，那是另一课的话题。` },
        { t: `p`, text: `为什么取东西之前要先问 empty()？因为空盒子里**没有 0 号格**。你去取 temp[0]，编译器不会替你拦下，程序要么当场崩、要么读到内存里的垃圾值，报错信息还常常指着别的那一行 —— 这是最难查的错。同理，上一课那句「总分除以个数」在空盒子上就是**除以 0**，同样会出事。所以源稿那句「动手取元素前先问 empty() 是好习惯」，翻译成人话是：**先确认有没有，再决定拿不拿**。至于 vector 还能一行排序，那要用另一套现成的算法工具，以后再讲。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `code`, lang: `text`, code: `temp.empty()   问句：空了吗 → 回答 true / false（不是数字）
temp.size()    问句：几个     → 回答一个整数，空的时候是 0
temp.clear()   动作：一键倒空 → 元素全没、size 归 0，盒子本身还在

倒空之后照样能使：temp.push_back(7) 又能装一个 —— 清空不等于报废
判空的正规问法：先 empty()（有没有），再 size()（几个），最后才碰格子` },
        { t: `p`, text: `三个名字里有两个带括号、一个不带？不，三个都带括号 —— 它们是「动词」，属于盒子自己的本事，写法沿用第 13 课那套「数据后面加点再点动词」。这一点很多人初学会漏：写成 temp.empty 少了括号，编译器会报一条大意是「布尔值不能这样用 / 未调用函数」的错，指着你那一行说「你要干什么」。看见这条错，先去看括号。` },
        { t: `h2`, text: `演示 1 · 清空前后各问一句（源稿这段）` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>

int main() {
    std::vector<int> temp = {1, 2, 3};

    std::println("清空前空吗？{}", temp.empty());   // false = 不空
    temp.clear();                                   // 一键倒空
    std::println("清空后空吗？{}，剩 {} 个", temp.empty(), temp.size());

    return 0;
}` },
        { t: `p`, text: `两行输出：「清空前空吗？false」和「清空后空吗？true，剩 0 个」。把 empty() 和 size() 打在**同一行**里对照，是源稿这段最值得学的地方 —— 一个告诉你有没有，一个告诉你几个，两个说法必须同时成立（true 配 0、false 配非 0）；哪天它们打架了，说明你改坏了什么。也顺便确认 empty() 打出来的是 true/false 这种字，而不是 1/0。` },
        { t: `h2`, text: `演示 2 · 倒空之后 push_back，盒子复活（源稿任务 1）` },
        { t: `code`, lang: `c++`, code: `std::vector<int> temp = {1, 2, 3};

temp.clear();                         // 全倒掉
std::println("空吗？{}，剩 {} 个", temp.empty(), temp.size());

temp.push_back(7);                    // 同一只盒子，重新装
std::println("复活后剩 {} 个，0 号格是 {}", temp.size(), temp[0]);` },
        { t: `p`, text: `输出先是「空吗？true，剩 0 个」，再是「复活后剩 1 个，0 号格是 7」。看清楚后半句：**门牌号是从 0 重新发的**。倒空之后第一次 push_back 装的是 0 号格，不是 4 号格 —— 它不会记得自己曾经有过三个数。这个性质让 clear() 成了「重来一遍」的标准做法：成绩单要重算，先 clear() 再从头装，不用重新声明变量。` },
        { t: `h2`, text: `演示 3 · 用循环把 1 到 5 装进空盒子（源稿任务 2）` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
int main() {
    std::vector<int> box;                  // 出生就是空的
    std::println("一开始空吗？{}", box.empty());
    for (int i = 1; i <= 5; ++i) {
        box.push_back(i);                  // 一轮装一个
    }
    for (auto v : box) std::print("{} ", v);
    std::println("");
    std::println("现在空吗？{}，共 {} 个", box.empty(), box.size());
    return 0;
}` },
        { t: `p`, text: `第一行声明 box 的时候没有给初值，得到的就是一只空盒子 —— 这是**故意空着**的写法，专门配合 push_back 往里装东西。三行输出连起来是一个完整的故事：true（一开始没有）→ 「1 2 3 4 5」（循环装进去了）→ false，共 5 个。这里的 for 是第 35 课那个计数循环，range-for 在这里不合适，因为**你现在是要往盒子里加东西，不是要走完它** —— 里面还是空的，range-for 一轮都不会跑，这个坑我在下面专门列了一条。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `拿 empty() 的返回值当数字。它给你的是真假，std::println 打出来是 true / false；写 if (temp.empty() == 3) 这种话毫无意义，要问有没有就 if (temp.empty())，要问几个就 if (temp.size() == 0)。`,
          `以为 clear() 之后这只盒子就不能用了。变量还在、还能 push_back，只是编号从 0 重新发。真「不能用了」要等到它所在的花括号走完。`,
          `没判空就动手取格子或算平均。空盒子里没有 0 号格，temp[0] 编译器不拦，运行时要么当场崩、要么读到内存里的垃圾值，报错还常常指着别的那一行；上一课那句除以 size() 在空盒子上就是除以 0，同样出事。取之前一句 if (temp.empty()) 就能全部挡掉 —— 判空、再算，是求平均不可省的第一步。`,
          `往空盒子里加东西却用了 range-for：for (auto v : box) { box.push_back(v); } 一轮都不跑，或者在走的途中改盒子（更糟）。**加东西用第 35 课那个计数循环或者干脆连着 push_back，走完现存的才用 range-for**。`,
          `把 clear() 放进循环里当「重置」。如果每次循环都倒空，前面装的统统白干，最后只剩最后一轮那一个。重置账本用 = 0，重置盒子才用 clear()，别混。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `清空后再 push_back(7)，看看盒子能不能复活`,
          `用循环往空盒子里加 1 到 5，再遍历打印`,
          `延伸：给演示 3 那只盒子算平均分，但先用 if 判空 —— 空的时候打印「还没有成绩」，不空的时候才去除 size()；然后把 clear() 加在第一句前面，再跑一次，看你那句提示到底生不生效。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：empty() 是问句、回真假，clear() 是动作、倒空但盒子还在；取格子之前、除 size() 之前先问一句 empty()，这一句能替你挡掉大半的当场出事。` }
      ]
    },
    {
      id: `c46`, title: `第 46 课 · pair：把两个值捆成一束钥匙`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会用 std::pair<第一格类型, 第二格类型> 造一只「双格盒子」，用 .first 和 .second 取出两格、也能换掉其中一格；并且说清它和第 40 课 vector 的分工 —— vector 是同类型的很多格，pair 是可能不同型的**只有两格**。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 40 课那只 vector 有个硬规矩：**里面清一色是同一种类型**，装 int 就全是 int。可现实里很多数据天生成对：姓名配年龄、科目配分数、商品配价格。最朴办的做法是开两只 vector 平行着放，names[i] 和 scores[i] 靠同一个 i 对上。这么写**能跑**，但这对关系全靠你脑子里记着 —— 删掉一个元素忘了删另一个，从那一格往后全体错位，程序一句错都不报，打出来的却是「小明 132 分」这种张冠李戴的话。这是入门阶段最经典的一类 bug。` },
        { t: `p`, text: `C++ 给这件事的正式答案是 **pair**（英语「一对、一双」）：**把两个值捆成一束，从此同进同退**。声明长这样 —— std::pair<std::string, int> student = {"小明", 15}; 尖括号里那两个类型是**格子说明书**：第一个管第一格、第二个管第二格，顺序跟花括号里给值的顺序严格一一对应。写反了编译就过不去，因为「小明」不是 int、15 也不是 string。注意它跟 vector 的差别：vector 的尖括号里只写**一个**类型，pair 写**两个**，而且这两个可以完全不同。` },
        { t: `p`, text: `取值只有两个名字：**.first（第一格）**和 **.second（第二格）**。这套「数据后面加点再点一个部件」的写法，你从第 13 课的 length()、第 40 课的 size() 一路用到现在，pair 完全沿用。为什么叫 first/second 而不是 0/1、也不叫 name/age？因为 pair 天生**只有两格，格子数目写死在类型里**：写 p.third 编译器直接回你一句「pair 里没有这个名字」；写 p.name 它也不认 —— pair 只管「捆在一起」，不管「这两格各自代表什么」，「第一格是科目名」这条语义得靠你自己记，这也是它换来的代价。` },
        { t: `p`, text: `两格里的值都能换，脾气跟普通变量一模一样：student.second = 16; 就是把第二格换个数，第一格纹丝不动，束也没散。而 pair 最能打的地方是**当 vector 的元素**：一摞成绩单写成 vector 装 pair，一行就是一格，科目和分数从此锁在一起，再不怕两个盒子错位。这正是下面演示 3 那几行，也是这一章往后（比如一堆学生名单）真正的使用场景。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `code`, lang: `text`, code: `std::pair<第一格类型, 第二格类型> 名字 = {第一个值, 第二个值};
          │          │                        │          │
        string       int                    "小明"       15
        └── 说明书的顺序必须对上花括号给值的顺序，反了编译过不去

取值：p.first → 第一格      p.second → 第二格
改值：p.second = 16;        跟普通变量一个脾气，束不松
只有两格：写不出 p.third，也不认 p.score` },
        { t: `svg`, caption: `一束钥匙两个格：.first 装姓名（string）、.second 装年龄（int），换一格不散一束`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300">
  <text x="20" y="26" font-size="14" font-weight="700" fill="#142639">std::pair&lt;std::string, int&gt; student = {"小明", 15};</text>
  <circle cx="66" cy="106" r="22" fill="none" stroke="#b8722b" stroke-width="4"/>
  <text x="66" y="60" font-size="13" fill="#b8722b" text-anchor="middle">一个环</text>
  <path d="M88 96 H150" stroke="#b8722b" stroke-width="2"/>
  <path d="M88 116 C122 116 122 160 150 160" stroke="#b8722b" stroke-width="2" fill="none"/>
  <g font-size="14" fill="#142639">
    <rect x="150" y="74" width="300" height="44" rx="8" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/>
    <text x="166" y="102">第一格 .first = "小明"</text>
    <rect x="150" y="138" width="300" height="44" rx="8" fill="#dff0e2" stroke="#1a7f42" stroke-width="2"/>
    <text x="166" y="166">第二格 .second = 15</text>
  </g>
  <text x="470" y="98" font-size="13" fill="#00599c">string 那格</text>
  <text x="470" y="162" font-size="13" fill="#1a7f42">int 那格</text>
  <text x="470" y="182" font-size="12" fill="#57677c">两格类型可以不同</text>
  <text x="20" y="212" font-size="13" fill="#57677c">格子名只有 first 与 second：写不出 third，也不认 score —— 语义靠你自己记</text>
  <text x="20" y="242" font-size="14" font-weight="700" fill="#1a7f42">student.second = 16;</text>
  <text x="250" y="242" font-size="13" fill="#142639">环没松、束还在，只换第二格</text>
  <text x="20" y="278" font-size="12" fill="#142639">一摞：std::vector&lt;std::pair&lt;std::string, int&gt;&gt; sheet = {{"数学", 145}, {"英语", 132}};</text>
</svg>` },
        { t: `h2`, text: `演示 1 · 一造一取（源稿这段）` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <utility>

int main() {
    std::pair<std::string, int> student = {"小明", 15};

    std::println("第一格 .first  = {}", student.first);
    std::println("第二格 .second = {}", student.second);

    return 0;
}` },
        { t: `p`, text: `输出两行：「第一格 .first = 小明」「第二格 .second = 15」。这里请了**三个**头文件，一个都不能省：println 住在 print，std::string 住在 string，而 **pair 住在 utility**（utility 意为「工具」，专门装这类小工具）。忘包 utility 的报错长得挺唬人，大意是「std 里没有叫 pair 的名字」，指着声明那一行 —— 看见这条先回头查头文件，别去改尖括号里的类型。` },
        { t: `h2`, text: `演示 2 · 存「数学 + 145」，两个占位坑一次填满` },
        { t: `code`, lang: `c++`, code: `std::pair<std::string, int> subject = {"数学", 145};

std::println("{} 考了 {} 分", subject.first, subject.second);
std::println("科目名 {} 个字", subject.first.length());
std::println("加 5 分之后是 {}", subject.second + 5);` },
        { t: `p`, text: `第一行就是任务 1 的答案：科目名进第一格、分数进第二格，打印时两个占位坑按顺序填 first、second，出来是「数学 考了 145 分」。后面两行是本课最该留的一句话：**两格各按各的类型说话** —— first 是 string，所以第 13 课的 length() 照用；second 是 int，所以能直接加 5（145 变 150，格子里的值可没变，只是这次临时算了一遍）。pair 不是把两个值搅成一团，它是**捆在一起的两只独立盒子**，这点跟「一个字符串里塞两个信息」那种土办法有本质区别。` },
        { t: `h2`, text: `演示 3 · 换值，再把它装进 vector` },
        { t: `code`, lang: `c++`, code: `std::pair<std::string, int> student = {"小明", 15};
student.second = 16;                    // 只换第二格
std::println("{} 现在 {} 岁", student.first, student.second);

std::vector<std::pair<std::string, int>> sheet = {{"数学", 145}, {"英语", 132}};
for (auto row : sheet) {                // 一轮拿到一整行
    std::println("{}：{} 分", row.first, row.second);
}` },
        { t: `p`, text: `前三行是任务 2：把年龄从 15 换成 16，姓名那格不受牵连，打出来「小明 现在 16 岁」。后三行是本课的压轴：**vector 的元素类型写成一个 pair**，初始化时每一对花括号就是**一行**，所以 sheet 里有两格，每格里装着一个「科目 + 分数」。range-for 走它，一轮端出来的 row 就是完整的一行，取内容还是 row.first、row.second。以后你要存名单、价格表、单词本，这套「vector 装 pair」能顶掉一大半本来该写结构体的活儿。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `尖括号里的类型顺序和花括号里的值顺序没对上：std::pair<std::string, int> p = {15, "小明"};。编译报错会写一大串模板相关的长话，核心意思就一句：**这一格要 string，你给了 int**。照着顺序数一遍就好。`,
          `忘写 #include <utility>。报错指着 pair 说「std 里没有叫 pair 的名字」，跟第 20 课忘包 iostream 是同一类错，先回头查头文件，别改语法。`,
          `写 p.third 或者 p.score、p.name。pair 只有 first 和 second 两格，第三个不存在，格子名也不由你起；「第一格是科目」这种语义得靠脑子记，要三格以上的成组数据那是以后的课。`,
          `想把整个 pair 直接塞进一个占位坑打印，像 std::println("{}", subject)。pair 没有现成的格式，编译器会报一条大意是「无法格式化这个类型 / 找不到对应的 formatter」的长错。分开写 first、second 才对，两格各按各的类型说话。`,
          `走一摞 pair 时想当场把两格拆成两个名字（那种写法是下一课要讲的东西），本课统一 row.first、row.second。另外 range-for 端出来的是复印件，改 row 改不动 sheet 里的原件 —— 第 44 课那条老规矩对 pair 一样生效，真要改就 auto&。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `用 pair 存「数学 + 145」，打印两格`,
          `把第二格改成 16 再打印 —— 盒子里的值能换`,
          `延伸：用 vector 装三行 pair 成绩单（科目名 + 分数），range-for 逐行打印，再顺手算出平均分（提示：总分照样用第 43 课那本账本，别忘了 size()）。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：pair 是把两个（可以不同类型的）值捆成一束的双格盒子 —— 尖括号按顺序写两格类型，取值只有 .first 和 .second，两格都能换而束不散；装进 vector 就是一摞成对的数据。` }
      ]
    }
  ]
};
