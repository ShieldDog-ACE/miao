/* 喵站 · C++ 掌握 正文分部 p05：第 93–96 课（第九轮）
 *
 * 源稿：93_常用视图速查.cpp、94_iota与惰性求值.cpp、95_实战学生数据管道.cpp、96_视图不复制数据.cpp
 * 这四课是 ranges 这一组的收尾：三个窗口视图、凭空造序列的 iota、拿 struct 列表跑一条真管道、
 * 最后把「视图只是窗户」这条设计钉进骨头里。写法照 p03/p04：讲「为什么这么想」，不只讲「语法长这样」。
 */
window.MIAO_CPPM_P05 = {
  chapters: [
    {
      id: `m93`, title: `第 93 课 · 常用视图速查：take、drop、reverse 只管「看哪一段」`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把 take、drop、reverse 这三个最常用的视图钉牢 —— 它们只改「从哪儿开始看、看几个、朝哪个方向看」，底层数据一个字节都不动。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 90 课的 filter 管「挑」，第 91 课的 transform 管「变」，第 92 课你已经把两段串成一整条水管，尾巴上还顺手接了一段 take 三个。这一课把三件最常用的「看范围」的工具正式摆到桌面：**take(n) 只看前 n 个、drop(n) 跳过前 n 个、reverse 倒着看。** 它们在管道里的角色跟筛子、滤镜完全不是一回事 —— 后两者动的是元素本身，这三个动的只是**窗口**。` },
        { t: `p`, text: `拿一本书打比方最贴切。数据是印在纸上的字；take(3) 是「只读前三页」的纸条，drop(7) 是夹在第 7 页的书签，reverse 是「从最后一页往前翻」的那根手指。字一个都没被抄走，纸条拿走以后书还是那本书；你把书签往后挪一格，看到的内容立刻就变了 —— 因为看的从来就是同一份纸。` },
        { t: `p`, text: `「速查」这两个字是刻意的。views 这一族名字有十几个，按字母硬背一定记不住；按**动作**分就三堆：窗口堆 take、drop、reverse；筛子堆 filter；滤镜堆 transform。查东西时先问「我要的动作是哪个」，再想这一堆里有几个名字，比反过来快得多。窗口堆里还有两个按条件收尾的近亲，以后再讲；今天先把这三个用熟。` },
        { t: `p`, text: `三个里面唯一要反复提醒的是**顺序**。管道是从左往右一段一段传的，同样的零件换个接法答案就换：nums 是 1 到 10 时，先 take 三个得 1 2 3，再 reverse 得 3 2 1；先 reverse 得 10 9 8 7 一路往下，再 take 三个得 10 9 8。读别人的管道别扫一眼看到「取三个、倒序」就自己在脑子里随便排序 —— 这是本课最容易看走眼的一处。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `视图对象的体积小到可以忽略：里面装的是「底下那份数据」加上几个参数（要几个、跳过几个、朝哪个方向走）。构造它不遍历、不分配内存，所以你随手写一条管道挂到 auto 变量上，代价约等于给数组起个别名。这一点和「复制一份再改」是两种世界观：复制是把活先干完存起来，视图是把活推到**你真正去读的那一刻**。` },
        { t: `p`, text: `名字也被设计成方向词而不是动词。take 是「就取这么多个」，drop 是「先扔掉这么多个」，reverse 是「反着走」，三个都不回答问题、不产出新值，只改变**你问问题的范围**。真正动元素的那两个 —— filter 与 transform —— 才叫加工。把六段分成「窗口」与「加工」两组，以后遇到再长水管你也能一眼拆出结构。` },
        { t: `svg`, caption: `同一排数据上开三扇窗：take(3) 框住左边三格，drop(7) 只挡住左边七格，reverse 只是换从右往左读的方向。格子始终是那十个，一个字节都没搬`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 262">
  <text x="20" y="22" font-size="13" font-weight="700" fill="#142639">同一排数据，三扇窗 —— 窗框会动，家具不动</text>
  <g font-size="13" fill="#26405a" text-anchor="middle">
    <rect x="20" y="40" width="46" height="30" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="43" y="60">1</text>
    <rect x="66" y="40" width="46" height="30" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="89" y="60">2</text>
    <rect x="112" y="40" width="46" height="30" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="135" y="60">3</text>
    <rect x="158" y="40" width="46" height="30" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="181" y="60">4</text>
    <rect x="204" y="40" width="46" height="30" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="227" y="60">5</text>
    <rect x="250" y="40" width="46" height="30" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="273" y="60">6</text>
    <rect x="296" y="40" width="46" height="30" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="319" y="60">7</text>
    <rect x="342" y="40" width="46" height="30" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="365" y="60">8</text>
    <rect x="388" y="40" width="46" height="30" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="411" y="60">9</text>
    <rect x="434" y="40" width="46" height="30" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="457" y="60">10</text>
  </g>
  <g fill="none" stroke-width="2.5" stroke-dasharray="5 4">
    <rect x="16" y="36" width="146" height="38" stroke="#b8500f"/>
    <rect x="338" y="36" width="146" height="38" stroke="#1d7a3c"/>
  </g>
  <text x="89" y="88" font-size="12" fill="#b8500f" text-anchor="middle" font-weight="700">take(3) 的窗框</text>
  <text x="411" y="88" font-size="12" fill="#1d7a3c" text-anchor="middle" font-weight="700">drop(7) 之后露出的</text>
  <path d="M486 108 H26" stroke="#00599c" stroke-width="2"/><polygon points="26,108 36,102 36,114" fill="#00599c"/>
  <text x="500" y="112" font-size="12" fill="#00599c">reverse：从右往左读</text>
  <g font-size="12" fill="#26405a">
    <rect x="20" y="128" width="150" height="28" rx="6" fill="#fdece1" stroke="#b8500f" stroke-width="1.5"/><text x="95" y="146" text-anchor="middle">1 2 3</text>
    <rect x="230" y="128" width="150" height="28" rx="6" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="305" y="146" text-anchor="middle">8 9 10</text>
    <rect x="440" y="128" width="150" height="28" rx="6" fill="#eaf3fb" stroke="#00599c" stroke-width="1.5"/><text x="515" y="146" text-anchor="middle">10 9 8 … 1</text>
  </g>
  <rect x="20" y="182" width="600" height="62" rx="8" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1"/>
  <text x="34" y="202" font-size="12" fill="#33465e">三段都没有新容器：框里流出去的还是原来那十个格子，取几个、跳几个只是把窗框挪了位置。</text>
  <text x="34" y="222" font-size="12" fill="#33465e">顺序是语义的一部分：take(3) 再接 reverse 得 3 2 1；reverse 再接 take(3) 得 10 9 8。</text>
  <text x="34" y="238" font-size="12" fill="#33465e">drop 的数说的是「扔掉几个」，不是「第几个」—— 想从第 4 个开始看，得写 drop(3)。</text>
</svg>` },
        { t: `h2`, text: `演示 1 · 三个视图各开一扇窗` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <vector>
#include <ranges>

void show(std::string label, auto view) {        // 小工具：给一扇窗起名字，逐个打出来
    std::print("{:<10}", label);                 // 冒号后是宽度与对齐：< 是左对齐占 10 格
    for (int v : view) std::print("{} ", v);     // 窗被"问"了才给数
    std::println("");
}` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <vector>
#include <ranges>

int main() {
    std::vector<int> nums = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    show("take(3):", nums | std::views::take(3));    // 前 3 个
    show("drop(7):", nums | std::views::drop(7));    // 跳过前 7 个
    show("reverse:", nums | std::views::reverse);    // 倒着看
    return 0;
}` },
        { t: `p`, text: `两块拼起来就是源稿那段，跑出来三行：take(3) 后面是 1 2 3，drop(7) 后面是 8 9 10，reverse 后面是 10 9 8 一路到 1。三行里**没有任何一行是新数据**，show 的参数类型写成 auto 是因为视图的真实类型是一串没法读的嵌套名字，让编译器去推；按值传它也不心疼 —— 复制的是窗框，不是家具，这一点最后一课会正面讲。` },
        { t: `h2`, text: `演示 2 · 换个接法就换个答案` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <ranges>

int main() {
    std::vector<int> nums = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    std::print("先 take 再 reverse：");
    for (int v : nums | std::views::take(3) | std::views::reverse) std::print("{} ", v);
    std::println("");
    std::print("先 reverse 再 take：");
    for (int v : nums | std::views::reverse | std::views::take(3)) std::print("{} ", v);
    std::println("");
    return 0;
}` },
        { t: `p`, text: `第一行 3 2 1，第二行 10 9 8。差别出在 take 问的是「**此刻**流里的头三个」，而流在到达它之前已经被上一段改过：先截断再倒过来，截的是 1 2 3；先倒过来再截断，截的是 10 9 8。顺带把第 92 课任务里那个问题答一半 —— 筛偶数与算平方那两段换来换去结果一样，是因为奇数的平方还是奇数，属于**碰巧**；窗口段与重排段这一对是**一定**不一样。顺序能不能换，取决于两段动作是否互相看得见。` },
        { t: `h2`, text: `演示 3 · drop 加 take：掐出中间一段` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <ranges>

int main() {
    std::vector<int> nums = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    std::print("第 4 到第 6 个：");
    for (int v : nums | std::views::drop(3) | std::views::take(3)) std::print("{} ", v);
    std::println("");                            // 4 5 6
    return 0;
}` },
        { t: `p`, text: `输出 4 5 6。这里藏着本课最实用的一条换算：**想从第 a 个看到第 b 个，写 drop(a - 1) 再 take(b - a + 1)。** 从第 4 个开始，意味着前面 3 个不要，所以是 drop(3) 而不是 drop(4)；要 3 个而不是「到 6 为止」。这跟 vector 的下标从 0 数起是同一件事的两副面孔 —— 数「跳过几个」和数「第几个」这两个口径，你以后写分页、写窗口截取会一遍遍地撞上，早一天亲手差一格就记住了。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `drop 里写成「第几个」。drop(4) 是从第 5 个开始看，结果整体往后差一格；症状是「数字看着都对，就是少了一个、多了一个」。口径记死：drop 数的是**扔掉几个**。`,
          `指望 reverse 真的把 vector 倒过来。跑完打印 nums，还是 1 到 10 —— 视图只改读的方向，不改存储。想让原件的顺序真的变过来，得动手改容器本身（以后学排序那一族才是真改数据）。`,
          `管道接的顺序随手换。take 与 reverse 这对一定换结果；filter 与 transform 那对这次碰巧不换，就把「反正都一样」当成规律记 —— 换个条件立刻翻车。接完读一遍，问自己「这一段拿到的是上一段剩下的什么」。`,
          `把窗口接在一个临时容器上，再挂到 auto 变量里留着以后用。等号右边那个 vector 语句一结束就销毁了，视图里记着的那份「底下数据」随之失效，之后遍历读到的是已经不存在的东西 —— 不报错，只是给乱七八糟的值。这是这一族最阴的坑，本课先记住：**窗框可以留着，房子必须先活着。**`,
          `忘包 <ranges>。报错长相通常跟本课无关：「std 里没有 views 这个成员」，或者甩出几十行模板噪音。窗口这一族全住在 <ranges> 里，<vector> 和 <print> 都带不来它。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `加一行 show：take(3) 再接 reverse，输出什么？先猜再跑，验证自己「从左往右一段一段读」的习惯建立起来没有。`,
          `用 drop 加 take 取出第 4 到第 6 个元素。写之前先答一句：drop 里为什么是 3 而不是 4。`,
          `延伸一：把窗口段和 filter 混着接两条不同顺序的管道 —— 先筛偶数再取前三个，与先取前三个再筛偶数，把两行输出并排比一比，说清哪一段先动手。`,
          `延伸二：拿第 88 课那张二维表的外层当数据，用 take(2) 只打印前两行。你会发现窗口对「流的是数还是一整行」毫不在意 —— 这正是管道好用的地方。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：take、drop、reverse 只搬窗框不搬家具，改的是「看哪一段、朝哪边看」；而窗口段与加工段接的顺序，就是结果本身。` }
      ]
    },
    {
      id: `m94`, title: `第 94 课 · iota 与惰性求值：要多少造多少`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用 std::views::iota 凭空造出序列（有界的和无界的两种），并亲眼确认「你不去读它，它就一个都不造」这条惰性 —— 它是整个 ranges 设计的承重墙。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `前面四课的管道都得先有一份现成的 vector 才开得动。iota 不要：它**自己就是数据源**。两个参数 iota(1, 6) 是「从 1 数到 6 之前」，出来 1 2 3 4 5；只给一个起点 iota(1) 就是**没有终点的流**，1 2 3 一直数下去。` },
        { t: `p`, text: `先别被「无限」吓住。想想 iota 该怎么做这件事：它不可能真造出一筐数不完的苹果，标准库也没这么干。它造的是一台**数数机** —— 里面只记着「下一个是几」，你每要一个，它就把当前的值递给你、再把计数器加一。所以「无限」的意思不是「内存里有一亿个」，而是「**你永远没把它要完**」。` },
        { t: `p`, text: `这背后是同一条第 90 课就埋下的规矩：**惰性**。你写下「nums 接上 filter 某谓词」的那一刻，一个元素都没被判断；同理，写下 iota(1) 的那一刻一个数都没造出来。真正干活的时间点被推迟到 for 圈去读它的时候 —— 读多少个，就造多少个。于是管道右端那段 take(8) 就有了决定性作用：它数到第 8 个就喊停，上游那台数数机立刻关门，一共只造了 8 个。**「取前几个」这句话，在惰性世界里是省内存的指令，不是事后的剪裁。**` },
        { t: `p`, text: `为什么要费这个劲？因为它换来的是一种新的想法方式：**把「数据源」和「数据的形状」分开。** 以前你必须先决定开多大的容器、先把值装满，才能开始加工；现在你可以直接声明「从 1 开始每个的平方，我要前 8 个」，而不必先回答「那得开多大的数组」。凡是「结果很长、但我只要开头一小截」的活 —— 前 N 个素数、前 N 个完全平方、字典里前 N 个符合某规则的词 —— 都能照这个形状写。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `iota 是最小的一种「生成式数据源」：一个状态（当前值）加一条推进规则（加一）。它没有 size 可问 —— 无限时问长度没有意义；它也不提供随机下标，只保证「能一位一位往前走」。这是惰性结构的共同脾气：**能要，不能问总量。**` },
        { t: `p`, text: `顺手记一个兄弟用法：拿 iota 造下标去遍历已有容器。写「从 0 数到容器长度」这一串下标，本身就是个视图，可以像别的视图一样往后续 filter、续 transform，而不用先把下标存进一个 vector。等你想把「第几个」当成数据来筛，这个写法会救你一次。` },
        { t: `p`, text: `还有一条界限要划清：惰性**不等于缓存**。视图不记事，同一个 iota 视图你遍历两遍，它就从头再数两遍；上一课那个 transform 视图遍历三遍，公式就套三遍。所以「惰性」省的是**没被要的那部分**，不是全部。要重复用、而且加工很贵时，就得把结果落地成一份真的 vector —— 这是以后讲性能时会给的判据，今天先埋个印象。` },
        { t: `svg`, caption: `iota(1) 不是一筐数，是一台数数机：只有被读到的那一格才真的被造出来，take(8) 数够 8 个就关门，第 9 个之后从未存在过`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 264">
  <text x="20" y="22" font-size="13" font-weight="700" fill="#142639">无限流 + take(8)：要一个造一个</text>
  <g font-size="12" fill="#26405a">
    <rect x="20" y="60" width="140" height="52" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
    <text x="90" y="80" text-anchor="middle" font-weight="700" fill="#00599c">std::views::iota(1)</text>
    <text x="90" y="100" text-anchor="middle">记着「下一个是几」</text>
    <path d="M164 86 H192" stroke="#57677c" stroke-width="2.5"/><polygon points="192,86 182,80 182,92" fill="#57677c"/>
    <text x="178" y="54" text-anchor="middle" fill="#57677c">被要时才给</text>
  </g>
  <g font-size="12" text-anchor="middle">
    <rect x="196" y="66" width="34" height="34" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="213" y="88" fill="#1d7a3c">1</text>
    <rect x="232" y="66" width="34" height="34" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="249" y="88" fill="#1d7a3c">2</text>
    <rect x="268" y="66" width="34" height="34" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="285" y="88" fill="#1d7a3c">3</text>
    <rect x="304" y="66" width="34" height="34" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="321" y="88" fill="#1d7a3c">4</text>
    <rect x="340" y="66" width="34" height="34" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="357" y="88" fill="#1d7a3c">5</text>
    <rect x="376" y="66" width="34" height="34" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="393" y="88" fill="#1d7a3c">6</text>
    <rect x="412" y="66" width="34" height="34" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="429" y="88" fill="#1d7a3c">7</text>
    <rect x="448" y="66" width="34" height="34" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="465" y="88" fill="#1d7a3c">8</text>
    <rect x="490" y="66" width="34" height="34" rx="5" fill="none" stroke="#8b98ab" stroke-width="1.5" stroke-dasharray="4 3"/><text x="507" y="88" fill="#8b98ab">9</text>
    <rect x="526" y="66" width="34" height="34" rx="5" fill="none" stroke="#8b98ab" stroke-width="1.5" stroke-dasharray="4 3"/><text x="543" y="88" fill="#8b98ab">10</text>
    <text x="580" y="88" font-size="14" fill="#8b98ab">…</text>
  </g>
  <path d="M484 46 V112" stroke="#b8500f" stroke-width="2.5" stroke-dasharray="5 4"/>
  <text x="484" y="40" font-size="12" fill="#b8500f" text-anchor="middle" font-weight="700">take(8) 关门</text>
  <g font-size="12" fill="#33465e">
    <text x="20" y="140" fill="#1d7a3c" font-weight="700">实线 8 格：真的被造出来过，用完就丢，没有存</text>
    <text x="20" y="162" fill="#8b98ab">虚线格：从头到尾没被造出来 —— 不是造了又删，是压根没造</text>
    <text x="20" y="188">换掉中间那段加工机，流的形状跟着换，数数机一个字没改：</text>
    <text x="40" y="208" fill="#00599c" font-weight="700">iota(1) | transform 平方 | take(8)   →   1 4 9 16 25 36 49 64</text>
    <text x="40" y="228" fill="#00599c" font-weight="700">iota(1) | transform 立方 | take(5)   →   1 8 27 64 125</text>
  </g>
</svg>` },
        { t: `h2`, text: `演示 1 · 有界的 iota：数到终点之前停` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <ranges>

int main() {
    for (int v : std::views::iota(1, 6)) std::print("{} ", v);   // 数到 6 前停
    std::println("");
    return 0;
}` },
        { t: `p`, text: `输出 1 2 3 4 5 —— **那个 6 取不到**，写法和 vector 的区间口径一致：右端是「还没到」。这段连 <vector> 都不用请，因为压根没有容器；数据源就是「从 1 数到 6」这句话本身。想数到 6 为止含 6，就把右端写成品 7。` },
        { t: `h2`, text: `演示 2 · 无限流配 take：只要前 8 个平方` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <ranges>

int main() {
    for (int v : std::views::iota(1)                              // 无限流 1 2 3 …
                | std::views::transform([](int n) { return n * n; })
                | std::views::take(8)) {                          // 取够 8 个收工
        std::print("{} ", v);
    }
    std::println("");
    return 0;
}` },
        { t: `p`, text: `输出 1 4 9 16 25 36 49 64。三段的读法还是「然后」：从 1 开始数，然后每个取平方，然后数够 8 个就停。**如果去掉那段 take，这个圈就永远跑不完** —— 不是崩，是它一直在给你造下一个；数字大到超出 int 之后会回绕成负数，那是溢出问题，不是惰性问题，本课先按下不表。` },
        { t: `h2`, text: `演示 3 · 给数数机装个喇叭：惰性看得见` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <ranges>

int main() {
    auto sq = std::views::iota(1)
            | std::views::transform([](int n) { std::print("[造 {}]", n); return n * n; })
            | std::views::take(4);
    std::println("视图建好了，上面一个字都没打印");
    for (int v : sq) std::print("{} ", v);
    std::println("");
    return 0;
}` },
        { t: `p`, text: `跑一遍，屏幕上先是那句提示，然后才是「[造 1]1 [造 2]4 [造 3]9 [造 4]16」。**这两句话的先后顺序就是本课的全部道理**：如果视图是「接上管道时先把结果算好存起来」，那四个 [造 n] 就该出现在提示句之前；而如果底下的源是无限流，那种做法根本建不完视图 —— 程序会卡在那一行不返回。它还顺手告诉你另一件事：只造了 4 个，因为 take 说好了要 4 个，数数机一个多余的数都没吐。` },
        { t: `p`, text: `这套「先登记、后被要」的性格你其实已经见过一次：第 56 课的 lambda 写下来的那一刻没执行，被调用时才执行。视图就是同一性格在数据上的版本 —— 写下来的是「怎么给下一个」，被遍历才真的给。想通这一层，ranges 这一族的很多设计就不再奇怪了。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把右端当成包含。iota(1, 6) 只有五个数，差一格的 bug 在「正好要 n 个」的时候特别隐蔽 —— 写完先跑一次数个数，别看公式猜。`,
          `无限流忘了在右边接 take。表现是程序安安静静地一直跑、什么都不打印（因为你没遍历它时它确实什么都不做；一遍历就停不下来）。凡是 iota 只写一个参数，就顺手检查这条管最后被谁截断。`,
          `把「惰性」记成「算过一次会存着」。同一个视图遍历两圈，数数机就从头再数两圈；加工贵时这就是成倍的开销。要复用结果就落地成 vector。`,
          `拿无限流的视图去问长度，或者指望它能下标随机取。它答应你的只有「能被从头一位一位要下去」，别的接口一概不保证 —— 报错长相通常是一串关于 concept 不满足的模板噪音。`,
          `忘包 <ranges>，报错「std 里没有 views 这个成员」。本课连容器都没有，只需要 <print> 和 <ranges> 两个头，这也是个提醒：请什么头取决于你用了什么，不是照抄上一课的清单。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把无限流里的加工机改成「立方」，取前 5 个：预期 1 8 27 64 125。写完再想想 —— 这台数数机这次一共吐了几个数？`,
          `回答源稿那道思考题：如果视图不惰性，第 2 段代码会怎样？写三句话说清 —— 建立那一刻要做什么、内存里要装下什么、右边的 take 还有没有意义。`,
          `延伸一：用 iota 造下标，遍历一列名字并把「第几个」和名字一起打印出来 —— 体会「序列本身也是数据源」，以及下标也能进管道。`,
          `延伸二：把 iota、filter、take 三段接起来，只要「前 5 个能被 7 整除的平方数」。写完解释一句：为什么这段不需要先把候选全部算出来。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：iota 是一台记着「下一个是几」的数数机，无限只是你没要完；惰性把「先装满再加工」换成「边要边造」，而右边那段 take 就是这个世界的刹车。` }
      ]
    },
    {
      id: `m95`, title: `第 95 课 · 实战：把管道接到一列学生身上`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：拿 struct 列表跑一条真水管 —— filter 按成员挑人、transform 把人换成名字，并想清楚 lambda 参数为什么写 const Student&、两段为什么不能倒着接。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `前几课的水管里流的是整数，那是练手。真实程序里流的是一行一行**记录**：学生、订单、日志行。这一课把管道接到第 87 课那种 struct 列表上，看看它换不换汤 —— 答案是**不换**，只是成员名多了个点号。` },
        { t: `p`, text: `读这段代码只有一个姿势：从左往右，每过一段就问一次「此刻流里是什么」。最左边是四个 Student；过了 filter 还是 Student，只是少了那个 58 分的；过了 transform，流的已经不是人了，是四个 string 里的三个；圈里拿到的是名字。**类型在中途被换掉，而你的 for 圈写法一个字都不用变** —— 这就是管道处理记录类数据的爽点。` },
        { t: `p`, text: `再看两段的分工：filter 只决定**谁能过去**，过去的那个还是原封不动的学生；transform 才动**内容**，把学生换成他的名字。谁都不改 stu 本体。这一点和第 91 课一模一样，只是元素从 int 变成了带栏位的记录。` },
        { t: `p`, text: `顺序在这里不是「碰巧一样」，而是被语义**钉死**的：先 transform 取名字，流里就再也没有 score 可问了，filter 那段会当场编译不过。更通用的一条心法是 —— **把便宜的筛子放前面，把贵的加工放后面**：先按分数挑掉一半，再给剩下的人做加工，加工次数就少一半。这条判断在你加工成本变高（要拼串、要查表）时会开始省钱。` },
        { t: `p`, text: `lambda 的参数写 const Student& 而不是 Student，理由是惰性的账：视图每被要一个元素，就要把那个元素递给加工机一次。按值收，等于每递一次就复制一个学生、连姓名的字符串一起复制；按 const 引用收，是「把原件指给你看，看完不许改」。第 61 课那条规矩在管道里照样成立 —— **惰性不会替你省掉复制**。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `这条形状值得背下来：**数据源 → 挑 → 换 → 用**。挑是 filter 写一个关于成员的谓词，换是 transform 取一个字段或算一个派生值，用是把流交给 for 打印、或者交给 std::ranges::count_if 数人头。日志、订单、成绩单全是这四步，你以后写的绝大多数数据处理代码都是它换个名字。` },
        { t: `p`, text: `顺带说一句「为什么它这么通用」：视图对元素类型几乎一无所知，它只管把这一个递给下一段。所以同一条水管的骨架，今天挑学生、明天挑订单，改的只是成员名和条件。这种「不关心具体是什么类型也能成立」的写法，正是模板那一路思想的前身，以后你会在函数模板里正面遇到它。` },
        { t: `svg`, caption: `四个学生从左边流进来：filter 把 58 分那位挡在门外，transform 把人换成名字，圈里拿到的只是名字 —— 每一段只干一件事，学生本体一个都没被复制`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 268">
  <text x="20" y="22" font-size="13" font-weight="700" fill="#142639">stu → filter 挑人 → transform 换面孔 → 用</text>
  <g font-size="12" fill="#26405a">
    <rect x="20" y="38" width="96" height="26" rx="5" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="68" y="56" text-anchor="middle">小明 88</text>
    <rect x="20" y="68" width="96" height="26" rx="5" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="68" y="86" text-anchor="middle">小强 72</text>
    <rect x="20" y="98" width="96" height="26" rx="5" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="68" y="116" text-anchor="middle">小红 95</text>
    <rect x="20" y="128" width="96" height="26" rx="5" fill="#ffffff" stroke="#b8500f" stroke-width="1.5"/><text x="68" y="146" text-anchor="middle" fill="#b8500f">小刚 58</text>
    <text x="20" y="34" fill="#57677c">四个 Student</text>

    <path d="M120 86 H168" stroke="#57677c" stroke-width="2.5"/><polygon points="168,86 158,80 158,92" fill="#57677c"/>
    <rect x="174" y="52" width="120" height="68" rx="10" fill="#fdece1" stroke="#b8500f" stroke-width="2"/>
    <text x="234" y="76" text-anchor="middle" font-weight="700" fill="#b8500f">filter</text>
    <text x="234" y="96" text-anchor="middle">s.score ≥ 60 ?</text>
    <text x="234" y="112" text-anchor="middle">参数：const Student&amp;</text>
    <path d="M234 120 V150" stroke="#b8500f" stroke-width="2" stroke-dasharray="4 3"/><polygon points="234,150 228,140 240,140" fill="#b8500f"/>
    <text x="252" y="166" fill="#b8500f">58 那位掉出去</text>

    <path d="M298 86 H346" stroke="#57677c" stroke-width="2.5"/><polygon points="346,86 336,80 336,92" fill="#57677c"/>
    <rect x="352" y="52" width="126" height="68" rx="10" fill="#eaf3fb" stroke="#00599c" stroke-width="2"/>
    <text x="415" y="76" text-anchor="middle" font-weight="700" fill="#00599c">transform</text>
    <text x="415" y="96" text-anchor="middle">回 s.name</text>
    <text x="415" y="112" text-anchor="middle">Student 变 string</text>

    <path d="M482 86 H530" stroke="#57677c" stroke-width="2.5"/><polygon points="530,86 520,80 520,92" fill="#57677c"/>
    <rect x="536" y="52" width="84" height="68" rx="8" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/>
    <text x="578" y="76" text-anchor="middle" font-weight="700" fill="#1d7a3c">for 圈</text>
    <text x="578" y="96" text-anchor="middle">小明 小强</text>
    <text x="578" y="112" text-anchor="middle">小红</text>

    <rect x="20" y="186" width="600" height="66" rx="8" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1"/>
    <text x="34" y="206" font-size="12" fill="#33465e">流里的东西一路变样：4 个学生 → 3 个学生 → 3 个名字；顺序不变，stu 一个字节没动。</text>
    <text x="34" y="226" font-size="12" fill="#33465e">顺序被语义钉死：先取名字就没有分数可筛，两段倒过来直接编译不过。</text>
    <text x="34" y="244" font-size="12" fill="#33465e">数人头别找视图，交给 std::ranges::count_if —— 它要的就是「容器 + 谓词」，回一个总数。</text>
  </g>
</svg>` },
        { t: `h2`, text: `演示 1 · 及格的同学，把名字流出来` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <vector>
#include <ranges>
struct Student { std::string name; int score; };
int main() {
    std::vector<Student> stu = {{"小明", 88}, {"小强", 72}, {"小红", 95}, {"小刚", 58}};
    for (const auto& name : stu | std::views::filter([](const Student& s) { return s.score >= 60; })
                               | std::views::transform([](const Student& s) { return s.name; }))
        std::print("{} ", name);
    std::println("");
    return 0;
}` },
        { t: `p`, text: `输出 小明 小强 小红，58 那位没出现，而且顺序和名单里一模一样 —— filter 不重排，transform 也不重排。圈变量写 const auto& 是同一个念头的延续：视图递给你的是一个 string，按值接就又复制一份名字。**每多一段就多一次交接，每一次交接都该问一句「我拿到的是原件还是副本」。**` },
        { t: `h2`, text: `演示 2 · 反着挑：不及格的名字` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <vector>
#include <ranges>
struct Student { std::string name; int score; };
int main() {
    std::vector<Student> stu = {{"小明", 88}, {"小强", 72}, {"小红", 95}, {"小刚", 58}};
    auto fail = stu | std::views::filter([](const Student& s) { return s.score < 60; })
                      | std::views::transform([](const Student& s) { return s.name; });
    std::print("不及格：");
    for (const auto& name : fail) std::print("{} ", name);
    std::println("");
    return 0;
}` },
        { t: `p`, text: `输出 小刚。整条水管只改了一个符号 —— 把大于等于换成小于，问的就是完全相反的问题。这就是分段的价值：**条件是唯一变化的部分，骨架一个字不动。** 把视图存进变量 fail 还能反复遍历，代价是每次重新跑一遍谓词，这是惰性的老账。` },
        { t: `p`, text: `顺手划一条边界：别想在谓词里偷偷把分数改高。filter 与 transform 递给你的是 const 引用或者副本，改不动，也不该改 —— 视图是**看法**，不是编辑界面。真要修数据就写普通圈逐个赋值，那是另一件事。` },
        { t: `h2`, text: `演示 3 · 数人头交给 count_if` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <vector>
#include <ranges>
#include <algorithm>
struct Student { std::string name; int score; };
int main() {
    std::vector<Student> stu = {{"小明", 88}, {"小强", 72}, {"小红", 95}, {"小刚", 58}};
    auto above = std::ranges::count_if(stu, [](const Student& s) { return s.score > 90; });
    auto pass = std::ranges::count_if(stu, [](const Student& s) { return s.score >= 60; });
    std::println("90 分以上 {} 人，及格 {} 人", above, pass);
    return 0;
}` },
        { t: `p`, text: `打印「90 分以上 1 人，及格 3 人」。为什么这一步不走管道？因为「要一个总数」和「要一个个元素」是两种需求：视图只答应后者，它不保证自己有长度可问。真要数视图里有几个，只能自己跑一圈累加，或者把结果落地成一份真的容器 —— 最后一课正面讲落地这件事。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `lambda 参数写成 Student s 按值收。每问一次复制一个学生，姓名串也跟着复制；名单小没感觉，上千条就明显变慢。只读就写 const Student&，这是第 61 课的规矩，管道不是例外。`,
          `两段倒过来接：先 transform 取名字、再 filter 筛分数，报错长相是「string 里没有叫 score 的成员」。这类报错反而友好 —— 它直接告诉你流里的类型已经被上一段换掉了。`,
          `及格线的等号口径写错。60 分到底算不算及格，需求里要问清；本课用大于等于 60，写成大于 60 就少一个人。差一个等号是数据处理里最常见的事故，而且它不报错，只给你错答案。`,
          `拿视图去问长度，或者指望它有 size 可用。视图只保证「能被从头一位一位要下去」，无限流那种连总量都没有 —— 编译器会甩一串关于约束不满足的模板噪音。`,
          `以为遍历过一遍视图，结果就存在某处了。视图不记事：再遍历一次，谓词再问一遍、名字再取一遍。要反复用又贵，就老老实实收进一个新 vector。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `加一段：统计 90 分以上有几人（提示：std::ranges::count_if），把人数打印出来。`,
          `取出不及格学生的名字 —— 也就是分数低于 60 的那几位，用一条 filter 加 transform 的水管写完。`,
          `延伸一：再接一层，只要「90 分以上同学的名字」。写完数一数：这台机器一共访问了几个学生、取了几次名字？和只筛一遍比，多花了多少？`,
          `延伸二：想让及格名单按分数从高到低排一下再取名字 —— 先别急着写，回答一句：排序该接在管道里，还是先把容器排好？（提示：排序要动原件，看法动不了。）`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：真实数据是一行行记录，管道照用不误 —— 挑、换、用四步走；顺序常被语义钉死，而「原件还是副本」这个问题要从 lambda 的参数一路问到圈变量。` }
      ]
    },
    {
      id: `m96`, title: `第 96 课 · 视图不复制数据：窗户与房子`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把「视图手里没有数据」这条钉死 —— 它不复制，所以又快又省；也正因为它不复制，它跟着原件一起变、跟着原件一起死，要留一份就得落地成真容器。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `这一课没有新语法。它讲的是前五课一直在暗示、但没说透的那件事：**视图手里没有数据。** 源稿那个比喻最好用 —— 视图是窗户。你在 nums 上开一扇 drop(5) 的窗，窗里看到 6 7；家具一件没搬，房间没变，你只是换了个站位。` },
        { t: `p`, text: `于是会发生一件很有意思的事：把 nums 的第 7 格改成 100，再遍历同一扇窗，看到的就是 6 100。请把这句话讲准确 —— **不是「视图被同步更新了」，而是从头到尾只有一份数据。** 视图里连一个元素的副本都没有，所以没有任何东西需要通知、需要刷新、需要失效。你想「让视图更新一下」这个动作，压根不存在。` },
        { t: `p`, text: `对照一下你已经熟悉的另一极：把一个 vector 赋给另一个 vector，那是彻头彻尾的第二份，改这头不动那头。所以读代码时要一眼分得清「这是一扇窗」还是「这是一份仓库」—— 前者跟原件同生共死，后者各奔前程。**同样一行 for 圈，底下差着这一层，程序的性质就完全不同。**` },
        { t: `p`, text: `这条设计换来什么？换来「组合不要钱」：开一扇窗不遍历、不分配，一条十段的水管也不产生任何中间容器；把视图挂到 auto 变量上、当参数递进函数，复制的都是窗框那几个字节。代价只有一条，但很重 —— **窗户的命挂在原数据上**。原数据一销毁，或者那个 vector 中途扩容搬了家，窗框里记着的位置就成了悬空引用，读它是未定义行为：不报错、不警告，只是给你乱七八糟的值。` },
        { t: `p`, text: `那什么时候该把窗户变成仓库？三种场合记住就够：**结果要反复用而且加工很贵**（惰性的老账，遍历几次就重算几次）；**要重排**（排序是动原件的活，看法动不了）；**要跨作用域**（函数要返回它、或者要存起来以后再用）。落地写成一行的办法，是 C++23 给的那把转换：std::ranges::to<std::vector>()，把视图变成真容器。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `标准库故意让视图「小、廉价、不持有元素」。这不是偷懒，是一种刻意的分工：**持有数据是容器的工作，怎么看待数据是视图的工作。** 一句话把两件事分开的代价，就是你现在必须自己负责一件事 —— 保证底下那份数据活得比窗户久。第 61 课讲引用参数时那句「别把会消失的东西递出去」，在视图这里升级成了一条硬规矩：谁不拥有数据，谁就得靠别人的寿命过日子。` },
        { t: `svg`, caption: `同一份 nums 上开两扇窗：改原件时两扇窗里的景象一起变，因为没有第二份数据；只有落地成副本之后，才真的多出一份谁也不影响谁的容器`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 272">
  <text x="20" y="22" font-size="13" font-weight="700" fill="#142639">窗户 vs 仓库</text>
  <g font-size="12" fill="#26405a">
    <text x="20" y="48">std::vector&lt;int&gt; nums</text>
    <rect x="150" y="34" width="40" height="28" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="170" y="53" text-anchor="middle">1</text>
    <rect x="190" y="34" width="40" height="28" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="210" y="53" text-anchor="middle">2</text>
    <rect x="230" y="34" width="40" height="28" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="250" y="53" text-anchor="middle">3</text>
    <rect x="270" y="34" width="40" height="28" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="290" y="53" text-anchor="middle">4</text>
    <rect x="310" y="34" width="40" height="28" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="330" y="53" text-anchor="middle">5</text>
    <rect x="350" y="34" width="40" height="28" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="370" y="53" text-anchor="middle">6</text>
    <rect x="390" y="34" width="40" height="28" fill="#fdece1" stroke="#b8500f" stroke-width="2.5"/><text x="410" y="53" text-anchor="middle" font-weight="700" fill="#b8500f">7 → 100</text>
    <rect x="346" y="30" width="130" height="36" rx="6" fill="none" stroke="#1d7a3c" stroke-width="2.5" stroke-dasharray="5 4"/>
    <text x="490" y="48">tail = drop(5)</text>
    <text x="490" y="64" fill="#1d7a3c">看到的：6 100</text>
    <path d="M300 84 V64" stroke="#b8500f" stroke-width="2"/><polygon points="300,64 294,74 306,74" fill="#b8500f"/>
    <text x="20" y="100">nums 的第 7 格被改了 —— tail 什么都没做，看到的却立刻变了：被改的就是它正在看的那一格</text>

    <rect x="20" y="118" width="600" height="1" fill="#8b98ab"/>
    <text x="20" y="140" fill="#00599c" font-weight="700">落地成副本之后，才是第二份数据：</text>
    <text x="20" y="164">auto keep = tail | std::ranges::to&lt;std::vector&gt;();   // 到这里才真的分配、真的复制</text>
    <rect x="20" y="178" width="124" height="28" rx="6" fill="#eaf3fb" stroke="#00599c" stroke-width="1.5"/>
    <text x="82" y="197" text-anchor="middle">6 100</text>
    <text x="160" y="197">再改 nums？keep 一动不动 —— 它自己养着这几个格子</text>
  </g>
  <rect x="20" y="214" width="600" height="44" rx="8" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1"/>
  <text x="34" y="232" font-size="12" fill="#b8500f" font-weight="700">规矩只有一条：窗户的命挂在原数据上。房子拆了，窗框就是悬空的 —— 读它不报错，只给你垃圾值。</text>
  <text x="34" y="250" font-size="12" fill="#33465e">持有数据是容器的活，怎么看待数据是视图的活；谁不拥有谁，就得由谁来保证寿命。</text>
</svg>` },
        { t: `h2`, text: `演示 1 · 源稿这段：改原件，窗户里跟着变` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <ranges>

int main() {
    std::vector<int> nums = {1, 2, 3, 4, 5, 6, 7};
    auto tail = nums | std::views::drop(5);      // 架窗户：只看最后两个
    for (int v : tail) std::print("{} ", v);     // 6 7
    std::println("");
    nums[6] = 100;                               // 改的是原数组
    for (int v : tail) std::print("{} ", v);     // 窗户里的 7 变成了 100
    std::println("← 视图没复制数据，看到的还是 nums");
    return 0;
}` },
        { t: `p`, text: `两行输出：6 7，然后 6 100。第二行是本课的全部道理。请特别注意 tail 这行代码**在两次打印之间一个字都没动过** —— 如果视图自己存了一份，第二次打印就该还是 6 7；它变了，恰恰证明那份数据从来没被复制过。` },
        { t: `h2`, text: `演示 2 · 想要独立副本，就落地` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <ranges>

int main() {
    std::vector<int> nums = {1, 2, 3, 4, 5, 6, 7};
    auto even = nums | std::views::filter([](int x) { return x % 2 == 0; });
    std::vector<int> keep = even | std::ranges::to<std::vector>();   // C++23：视图变容器
    nums[1] = 100;                               // 改原件
    for (int v : keep) std::print("{} ", v);     // 副本不动
    std::println("");
    return 0;
}` },
        { t: `p`, text: `打印 2 4 6。那行 to 就是「把窗户改成仓库」的开关：它**真的分配、真的逐个复制**，所以之后 nums 再怎么改都跟 keep 无关。手边没有 C++23 的话，两条老路一样能用 —— 开一个空 vector 跑一圈 push_back，或者用范围构造把 begin、end 递进去。别嫌这行字多，**这里花的钱正是前面几课省下的钱**，什么时候该花就是本课的判断点。` },
        { t: `h2`, text: `演示 3 · 反例：窗框比房子活得久` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <ranges>

std::vector<int> make_nums() { return {1, 2, 3, 4, 5}; }    // 回一份新数据

int main() {
    auto view = make_nums() | std::views::take(3);   // ✗ 临时 vector 语句一结束就销毁
    for (int v : view) std::print("{} ", v);         // 读的是已经不存在的容器
    std::println("");
    return 0;
}` },
        { t: `p`, text: `这段是**错误示范**，请当反面教材读：可能给你 1 2 3，可能给你一堆垃圾值，也可能当场崩 —— 三种都算「正常表现」，因为它是未定义行为。修法是让数据先有个名字、活得比窗久：先把 make_nums() 的结果收到一个 vector 变量里，再在它上面开一扇窗。源稿那道思考题的答案就在这儿：**nums 被销毁之后 tail 不能看了**，窗框还记着那些位置，可房子已经拆了。` },
        { t: `p`, text: `同款坑还有两个常见的：把视图存进结构体成员、或者从函数里把一个视图 return 出去，而底下那份容器在别处析构；以及开完窗之后继续往 vector 里加元素，它一扩容就搬了家，窗框记着的老位置全成了别人的地盘。合起来就一句：**视图的寿命必须严格短于它底下那份数据。**` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `以为遍历过一遍，结果就存在某处了。视图不记事也不存货；要留一份就 to 成新容器，或者跑一圈 push_back。这是「跑通了但第二次遍历值变了」这类怪事的第一嫌疑。`,
          `把窗户开在临时容器上（本课演示 3 那种）。症状是「有时候对、有时候乱」，最难查的一类 bug —— 因为它不报错。规矩：先给数据起个名字，再开窗户。`,
          `想对视图排序、resize、或者往里塞元素。这些动作都要改存储本身，而视图不持有存储，动不了；真要重排就先把落地的那份容器排好，再在它上面开窗户。`,
          `隔着窗户以为安全。反向的规矩也得记：通过视图写，写的就是原件 —— drop、take、reverse 递给你的都是原元素的引用，圈变量写成 int& 并赋值，nums 立刻真的变。想安全就得自己落地一份。`,
          `原数据扩容之后还接着用旧窗户。vector 一搬家，之前记下的位置全部失效，这是同一口井的另一个方向；以后学容器扩容那几课会正面讲「谁失效、为什么不报错」。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `想要独立副本怎么办？把源稿那条查出来并写出来：用 std::ranges::to<std::vector> 把视图落地成一份新容器，然后改一下原数据，验证副本真的不动。`,
          `回答源稿那道思考题：如果 nums 被销毁了，tail 还能看吗？写下你的判断和理由，再照演示 3 造一段「最小能崩」的代码跑给同事看，亲眼确认它不报错。`,
          `延伸一：用 for 圈通过 tail 把窗里看到的每个数都改成 999（圈变量写 int&），然后打印 nums 全表 —— 想清楚你到底改了几格、改在谁身上。`,
          `延伸二：把「该落地的三种场合」各写一行代码：结果要反复用而且加工贵、要重排、要跨作用域。写完答一句：这三件事为什么都不能只靠一扇窗办成？`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：视图是窗户不是仓库 —— 不复制，所以便宜；也因为不复制，它跟着原件一起变、跟着原件一起死。要留一份、要重排、要跨过作用域，就把它落地成真容器。` }
      ]
    }
  ]
};
