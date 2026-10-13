/* 喵站 · C++ 掌握 正文分部 p22：第 155–156 课（第九轮）
 *
 * 源稿：155_折半猜数.cpp、156_二分答案.cpp
 * 折半不是新面孔：第 106 课已经用过 std::lower_bound 找「第一个不小于 target 的位置」，
 * 那时手里有算法库；这一课回到「自己把区间攥在手里一刀一刀砍」，把 <=、+1、-1 这三处边界
 * 一处一处理清。二分答案再把区间里装的东西从「格子下标」换成「答案的取值」，是本课的自然延伸。
 * 所有输出、轮数、循环次数、收手时的 lo 与 hi、除零的退出码、溢出时的中点值均经本机 g++ -std=c++23 实跑核对。
 */
window.MIAO_CPPM_P22 = {
  chapters: [
    {
      id: `m155`, title: `第 155 课 · 折半猜数：每问一次砍掉一半，八个格子最多问四回`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把「对方一说大了、你绝不回头从 1 猜起」这个天生动作写成 while 循环，说清 lo <= hi、lo = mid + 1、hi = mid - 1 这三处边界各拦住什么，并实测 1 到 100 最坏问几次、条件写成 lo < hi 会漏掉哪几个数。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `源稿的开场很准：猜 1 到 100，你先猜 50，对方说「大了」，你绝不会回头从 1 猜起 —— 你会在剩下那一半的正中间再问一刀。本课就是把这天生的动作写成代码：手里始终攥着一个「还没被排除的范围」，每问一次，砍掉一半。第 150 课刚把边界列为模拟的头号杀手，这段代码一口气塞了三处边界，写错哪一处编译器都一言不发。` },
        { t: `p`, text: `砍半的凭据只有一条：这些数已经排好序。v[mid] 比 target 小，才推得出「mid 和它左边一整段都比 target 小」，那半边于是整段作废、不必再看第二眼；有序一破，这条推理当场断掉。本机实测：只把第一个数 1 换成 21、其余七格不动，target 设成 1，折半打印「没有这个数」，而另外七个照旧命中。乱序的下场不是全错，是「大部分时候对」，这才是最难查的那一种。` },
        { t: `p`, text: `把前两段压成一句契约：lo 到 hi 是还没排除的范围，两端都算在内；lo 左边的格子全部比 target 小，hi 右边的全部比 target 大。每轮问 lo + (hi - lo) / 2 那一格，它跟 (lo + hi) / 2 在数组下标上完全等价 —— 实测八个 target 逐个跑，pos 与轮数一模一样，差别只在会不会溢出。那个 +1 也不是风格：mid 已经被问过，留它在区间里就是让它再被问一遍；实测写成 lo = mid，找 15 时 lo 与 hi 一起卡在 7，同一个 mid 反复问。` },
        { t: `svg`, caption: `一刀砍一半：手里攥着还没排除的范围 lo 到 hi，问一次中间那格，就把含 mid 在内的半边整段作废。图上每一步都是本机实跑的中间量 —— 第 1 问 mid=3 看见 7，小了，lo 跳到 4；第 2 问 mid=5 正好命中下标 5`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 302">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">1 3 5 7 9 11 13 15 里找 11：两问命中</text>
  <g font-size="12" fill="#26405a">
    <text x="16" y="98" font-weight="700">第 1 问</text>
    <text x="16" y="116" fill="#57677c">lo=0</text>
    <text x="288" y="72" text-anchor="middle" fill="#b8500f">mid=3 问 v[3]</text>
    <polygon points="288,78 282,66 294,66" fill="#b8500f"/>
    <rect x="150" y="80" width="44" height="30" rx="4" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="172" y="100" text-anchor="middle">1</text>
    <rect x="202" y="80" width="44" height="30" rx="4" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="224" y="100" text-anchor="middle">3</text>
    <rect x="254" y="80" width="44" height="30" rx="4" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="276" y="100" text-anchor="middle">5</text>
    <rect x="306" y="80" width="44" height="30" rx="4" fill="#fdece1" stroke="#b8500f" stroke-width="2"/><text x="328" y="100" text-anchor="middle" fill="#b8500f">7</text>
    <rect x="358" y="80" width="44" height="30" rx="4" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="380" y="100" text-anchor="middle">9</text>
    <rect x="410" y="80" width="44" height="30" rx="4" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="432" y="100" text-anchor="middle">11</text>
    <rect x="462" y="80" width="44" height="30" rx="4" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="484" y="100" text-anchor="middle">13</text>
    <rect x="514" y="80" width="44" height="30" rx="4" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="536" y="100" text-anchor="middle">15</text>
    <text x="572" y="100" fill="#57677c">hi=7</text>
    <text x="150" y="126" fill="#b8500f">7 比 11 小 → 下标 0 到 3 整段作废，lo = mid + 1 = 4</text>

    <text x="16" y="176" font-weight="700">第 2 问</text>
    <text x="16" y="194" fill="#57677c">lo=4</text>
    <text x="432" y="150" text-anchor="middle" fill="#1d7a3c">mid=5 命中</text>
    <polygon points="432,156 426,144 438,144" fill="#1d7a3c"/>
    <rect x="150" y="160" width="200" height="30" rx="4" fill="none" stroke="#98a2b0" stroke-width="1.5" stroke-dasharray="4 3"/>
    <rect x="150" y="160" width="44" height="30" rx="4" fill="#f2f4f7" stroke="#b8b8c4" stroke-width="1.5"/><text x="172" y="180" text-anchor="middle" fill="#98a2b0">1</text>
    <rect x="202" y="160" width="44" height="30" rx="4" fill="#f2f4f7" stroke="#b8b8c4" stroke-width="1.5"/><text x="224" y="180" text-anchor="middle" fill="#98a2b0">3</text>
    <rect x="254" y="160" width="44" height="30" rx="4" fill="#f2f4f7" stroke="#b8b8c4" stroke-width="1.5"/><text x="276" y="180" text-anchor="middle" fill="#98a2b0">5</text>
    <rect x="306" y="160" width="44" height="30" rx="4" fill="#f2f4f7" stroke="#b8b8c4" stroke-width="1.5"/><text x="328" y="180" text-anchor="middle" fill="#98a2b0">7</text>
    <rect x="358" y="160" width="44" height="30" rx="4" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="380" y="180" text-anchor="middle">9</text>
    <rect x="410" y="160" width="44" height="30" rx="4" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="432" y="180" text-anchor="middle" fill="#1d7a3c">11</text>
    <rect x="462" y="160" width="44" height="30" rx="4" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="484" y="180" text-anchor="middle">13</text>
    <rect x="514" y="160" width="44" height="30" rx="4" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="536" y="180" text-anchor="middle">15</text>
    <text x="572" y="180" fill="#57677c">hi=7</text>
    <text x="150" y="206" fill="#1d7a3c">区间长度 8 → 4，第二问就撞上 v[5] = 11，break</text>

    <text x="16" y="234" fill="#33465e">挨个比到 11 要问 6 次，折半实测 2 次；八个格子最多问 4 次，一百万个格子最多问 20 次。</text>
    <text x="16" y="256" fill="#00599c" font-weight="700">lo 敢写成 mid + 1，是因为 mid 自己已经被问过一轮 —— 那个 +1 是把它一起扔出去。</text>
    <text x="16" y="278" fill="#b8500f">条件必须是 lo <= hi：区间只剩最后一格时 lo == hi，那一格还没被问过，写成 lo &lt; hi 就白扔。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `设计点只有一句：用一次比较换掉一半工作量。挨个问的笨办法，n 个数最坏问 n 次；折半问的次数是把 n 砍到剩 1 所需的刀数再加最后一问。本机实测：8 个数最坏 4 次，100 个最坏 7 次，1000 个最坏 10 次，一百万个最坏 20 次 —— 数据翻一万倍，次数只多 10 次，这就是源稿那句「威力」。定位也认清：本课是**等于版**，撞上就 break，区间砍空就报没有；第 106 课的 std::lower_bound 问的是「第一个不小于 target 的是哪一格」，上界写成 hi = mid。两种目标别混着背，好消息是它们收手时站的位置相同，演示 3 会逐个数字对上。` },
        { t: `h2`, text: `演示 1 · 源稿这段：八个格子里找 11` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
int main() {
    std::vector<int> v = {1, 3, 5, 7, 9, 11, 13, 15};  // 必须有序！
    int target = 11;
    int lo = 0, hi = static_cast<int>(v.size()) - 1, pos = -1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;                  // 中间位置（防溢出写法）
        if (v[mid] == target) { pos = mid; break; }    // 撞上就收工
        if (v[mid] < target) lo = mid + 1; else hi = mid - 1;   // 小→扔左半，大→扔右半
    }
    if (pos >= 0) std::println("找到了，在下标 {}", pos);
    else          std::println("没有这个数");
}` },
        { t: `p`, text: `实测一行：找到了，在下标 5。循环只走两轮：第一问 mid=3 看见 7，比 11 小，lo 跳到 4；第二问 mid=5 正好撞上，break。hi 那行的 static_cast 是第 151 课数过的坑：v.size() 是无符号数，空容器上直接减一会绕回天文数字。pos 的初值 -1 是被「找不到」逼出来的：自然退出循环时它还是初值，if (pos >= 0) 一下把两种结局分开。` },
        { t: `h2`, text: `演示 2 · 本课任务：把 target 换成 8 和 1，各数几轮` },
        { t: `code`, lang: `c++`, code: `int steps = 0;                                 // 接在演示 1 的 pos = -1 后面声明
while (lo <= hi) {
    ++steps;                                   // 只为本课任务：数这一趟问了几轮
    int mid = lo + (hi - lo) / 2;
    if (v[mid] == target) { pos = mid; break; }
    if (v[mid] < target) lo = mid + 1; else hi = mid - 1;
}
std::println("target={} 循环 {} 次 pos={} 收手 lo={} hi={}", target, steps, pos, lo, hi);` },
        { t: `p`, text: `实测五个 target：11 用 2 轮，pos=5，收手 lo=4、hi=7，是被 break 踢出循环的；8 用 3 轮，pos=-1，收手 lo=4、hi=3，是砍空才退的；1 用 3 轮，pos=0；15 用 4 轮，pos=7，这是八个格子能问出的最多轮数，区间长度一路 8、4、2、1；16 也是 4 轮，pos=-1，收手 lo=8。对着源稿要的那两个数说结论：找不到的 8 比找得到的 11 多问一轮，因为它得把区间砍到一无所有才敢说「没有」；而 1 明明躺在头一格，也要问满 3 轮 —— 折半从不偏向左边。` },
        { t: `h2`, text: `演示 3 · 差一现场：三处边界各拦住什么` },
        { t: `code`, lang: `c++`, code: `int lo = 0, hi = static_cast<int>(v.size()) - 1, pos = -1;
while (lo < hi) {                              // A：只把 <= 改成 < ，其余一个字没动
    int mid = lo + (hi - lo) / 2;
    if (v[mid] == target) { pos = mid; break; }
    if (v[mid] < target) lo = mid + 1; else hi = mid - 1;
}` },
        { t: `code`, lang: `c++`, code: `int lo = 0, hi = static_cast<int>(v.size()) - 1;
while (lo <= hi) {                             // B：把「撞上就 break」那行删掉
    int mid = lo + (hi - lo) / 2;
    if (v[mid] < target) lo = mid + 1; else hi = mid - 1;
}
std::println("target={} 收手 lo={}", target, lo);` },
        { t: `p`, text: `A 拿容器里那八个原值挨个试，实测漏掉 1、5、9、15 四个，全打印「没有这个数」，3、7、11、13 照旧命中。道理在区间长度上：lo < hi 让循环在只剩一格时提前退场，那一格从没被问过，而头一格尾一格最容易留到最后；数据一多就表现成「偶尔找不到」，你还会怀疑是数据错了。B 更彻底：删掉等于与 break，循环只剩收缩，收手那一刻 lo 恒比 hi 大一，而 lo 指的正是「第一个不小于 target 的格子」。实测把 target 从 0 扫到 17 共 18 个值，每次的 lo 终值都等于「从头挨个数过去、第一个不比它小的下标」：target=8 时 lo=4，那格是 9；target=16 时 lo=8，等于 v.size()。A 版找不到时收手的 lo 也是同一个数 —— 这就是第 106 课 std::lower_bound 交到你手里的那个下标。` },
        { t: `h2`, text: `演示 4 · 猜 1 到 100 到底问几次，中点会不会爆` },
        { t: `code`, lang: `c++`, code: `#include <print>
int steps_for(int n, int secret) {         // 秘密数是 secret，候选范围 1..n
    int lo = 1, hi = n, s = 0;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2; ++s;
        if (mid == secret) break;
        if (mid < secret) lo = mid + 1; else hi = mid - 1;
    }
    return s;
}
int main() {
    for (int n = 1; n <= 100; ++n) if (steps_for(100, n) == 7) std::print("{} ", n);
    std::println("");
}` },
        { t: `p`, text: `实测把 1 到 100 每个秘密数都猜一遍：最坏 7 次、平均 5.80 次，用满 7 次的恰好 37 个，2、5、8、11 一路排到 100，其余 63 个在 6 次以内就撞上。源稿那句「7 次必中」是真的，但它是**最坏值**。换个规模：n=31 最坏 5 次、n=32 最坏 6 次、n=128 最坏 8 次 —— 2 的整次幂反而多问一刀。至于中点：数组下标上 (lo + hi) / 2 爆不了，下标超不过容器长度；可一旦 lo 与 hi 装的是「答案的值」就能上二十亿 —— 实测 lo=1600000000、hi=2000000000 时它打印 -347483648，而 lo + (hi - lo) / 2 打印 1800000000。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `丢掉那个 +1：写成 lo = mid 或 hi = mid，同一个 mid 就被每轮重问。实测找 15 时 lo 与 hi 一起卡在 7 —— 不报错、不退出、一行输出都没有。`,
          `条件写 lo < hi。演示 3 实测：容器里明明有 1、5、9、15，程序却报「没有这个数」。等于版的区间两端都要问，收手判据只能是 lo > hi。`,
          `忘了必须先排序。实测把第一个数换成 21，只有 1 找不到、其余七个照旧命中 —— 错得局部，因而更难被怀疑。要么先用第 105 课的 std::sort 排好，要么直接上第 106 课的 std::lower_bound。`,
          `拿错收手的那个数：想知道该插在哪却取了 hi 的终值。实测收手那一刻恒有 lo == hi + 1，要的是 lo —— target=8 时 lo=4 指着 9，hi=3 指着 7，就差一格。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把 target 改成 8 和 1 各跑一次；数数各循环了几次。对照演示 2 的实测：8 是不是 3 轮且打印「没有这个数」，1 是不是 3 轮命中下标 0。`,
          `再把 target 换成 15 和 16，说出为什么它们都要 4 轮 —— 区间长度 8、4、2、1 这一路就是你手里的刀数。`,
          `延伸一：把 lo <= hi 改成 lo < hi，拿八个原值挨个跑，报出哪几个不见了；再只把 v[0] 换成 21 跑一遍，报出哪个找不到 —— 这两次分别验证「最后一格也得问」和「必须有序」。`,
          `延伸二：把 1 到 100 每个秘密数的提问次数打出来，数出用满 7 次的有几个；再拿 n=32 与 n=128 各跑一遍，说出为什么 2 的整次幂要多问一刀。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：靠「已经排序」这一条凭据，每问一次 mid 就把含 mid 在内的半边整段扔掉；+1 与 -1 是把问过的那格扔出去，lo <= hi 是「最后一格也得问」，三处少一处都是不报错的错。` }
      ]
    },
    {
      id: `m156`, title: `第 156 课 · 二分答案：算不出就别算，猜一个长度去验证，在取值区间里找那条分界线`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把上一课那把刀从「格子下标」搬到「答案的取值」上，说清那个判定函数凭什么比直接求解好写、单调性凭什么决定能不能砍半，并实测一趟二分答案验证了几次、ans 是在哪一轮被记下的。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `源稿那个反转很实在：问「每段最长几厘米」，手里没有公式；改成问「猜一个长度，剪不剪得出 6 段」，一句话就写完了 —— 每根绳除以这个候选、向下取整、加起来跟 6 比。**求解难、验证易**，本课吃的就是这一口。第 155 课那套原样搬来：lo、hi、mid 都在，一句 if 把区间砍掉一半；变的只有一件事 —— 区间里装的内容从下标换成了答案的候选值。` },
        { t: `p`, text: `「答案区间可以二分」得落到一个能检验的条件上：ok 的返回值必须一段真、一段假，中间只有**一条**分界线。这里的道理是「绳子越短越容易凑够 k 段」，所以真话一路排在左边。本机实测把候选从 1 数到 8，四根绳 8、5、3、2 剪出的段数依次是 18、8、4、3、2、1、1、1 —— 长度变长，段数只可能更少；拿它跟 6 一比就成了「真真、假假假假假假」。源稿那句「2 厘米能行，1 厘米必然也行」说的就是这个形状：分界线只有一条，问一次 mid 才敢扔一半。` },
        { t: `p`, text: `三个变量的分工也换了含义。lo 与 hi 圈住还在竞争的候选值，mid 是这一轮试的长度，ans 是上一课没有的零件：它记下最后一次验证通过的那个长度。上一课撞上就 break，这一课**没有「撞上」这回事** —— ok 说「行」之后你还想知道更长的那个行不行，所以它不停手，只把 ans 挪一格、再 lo = mid + 1 去问更长的。` },
        { t: `svg`, caption: `答案空间里找那条分界线：横排八格是候选长度 1 到 8 各自剪出的段数，够 6 段的涂绿 —— 绿的两格、灰的六格，中间只有一条线。下面三行是本机实跑的三轮验证，长条是还在竞争的候选区间，三角是这一轮问的中点`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 380">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">绳长 8 5 3 2、要剪 6 段：候选 1 到 8 里只有一条真假分界线</text>
  <text x="20" y="40" font-size="12" fill="#57677c">每格里写的是「用这个长度能剪出几段」，够 6 段才算成立</text>
  <g font-size="12" fill="#26405a">
    <rect x="150" y="50" width="44" height="30" rx="4" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="172" y="70" text-anchor="middle" fill="#1d7a3c">18</text>
    <rect x="202" y="50" width="44" height="30" rx="4" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="224" y="70" text-anchor="middle" fill="#1d7a3c">8</text>
    <rect x="254" y="50" width="44" height="30" rx="4" fill="#f2f4f7" stroke="#98a2b0" stroke-width="1.5"/><text x="276" y="70" text-anchor="middle" fill="#98a2b0">4</text>
    <rect x="306" y="50" width="44" height="30" rx="4" fill="#f2f4f7" stroke="#98a2b0" stroke-width="1.5"/><text x="328" y="70" text-anchor="middle" fill="#98a2b0">3</text>
    <rect x="358" y="50" width="44" height="30" rx="4" fill="#f2f4f7" stroke="#98a2b0" stroke-width="1.5"/><text x="380" y="70" text-anchor="middle" fill="#98a2b0">2</text>
    <rect x="410" y="50" width="44" height="30" rx="4" fill="#f2f4f7" stroke="#98a2b0" stroke-width="1.5"/><text x="432" y="70" text-anchor="middle" fill="#98a2b0">1</text>
    <rect x="462" y="50" width="44" height="30" rx="4" fill="#f2f4f7" stroke="#98a2b0" stroke-width="1.5"/><text x="484" y="70" text-anchor="middle" fill="#98a2b0">1</text>
    <rect x="514" y="50" width="44" height="30" rx="4" fill="#f2f4f7" stroke="#98a2b0" stroke-width="1.5"/><text x="536" y="70" text-anchor="middle" fill="#98a2b0">1</text>
    <text x="172" y="96" text-anchor="middle">1 厘米</text><text x="224" y="96" text-anchor="middle">2</text>
    <text x="276" y="96" text-anchor="middle">3</text><text x="328" y="96" text-anchor="middle">4</text>
    <text x="380" y="96" text-anchor="middle">5</text><text x="432" y="96" text-anchor="middle">6</text>
    <text x="484" y="96" text-anchor="middle">7</text><text x="536" y="96" text-anchor="middle">8</text>
    <line x1="250" y1="44" x2="250" y2="102" stroke="#b8500f" stroke-width="2" stroke-dasharray="5 3"/>
    <text x="150" y="122" fill="#b8500f">答案就是分界线左边最后一格：2 厘米 —— 换成 3 厘米只剩 4 段，一步就跨不过去</text>

    <text x="16" y="160" font-weight="700">第 1 问</text>
    <rect x="150" y="142" width="408" height="24" rx="4" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/>
    <polygon points="328,140 322,128 334,128" fill="#00599c"/><text x="328" y="124" text-anchor="middle" fill="#00599c">mid=4</text>
    <text x="150" y="186">试 4 厘米：剪出 3 段，不够 6 → 不行，hi = mid - 1 = 3</text>

    <text x="16" y="228" font-weight="700">第 2 问</text>
    <rect x="150" y="210" width="148" height="24" rx="4" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/>
    <polygon points="224,208 218,196 230,196" fill="#00599c"/><text x="224" y="192" text-anchor="middle" fill="#00599c">mid=2</text>
    <text x="150" y="254">试 2 厘米：剪出 8 段，够了 → 记 ans=2，lo = mid + 1 = 3，还想试试更长的</text>

    <text x="16" y="296" font-weight="700">第 3 问</text>
    <rect x="254" y="278" width="44" height="24" rx="4" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/>
    <polygon points="276,276 270,264 282,264" fill="#00599c"/><text x="276" y="260" text-anchor="middle" fill="#00599c">mid=3</text>
    <text x="312" y="296">试 3 厘米：4 段，不够 → hi=2；此刻 lo=3 已越过 hi，循环收手，答案就是 ans=2</text>

    <text x="16" y="330" fill="#33465e">三轮筛完 8 个候选，ok 被调用 3 次、每次做 4 次除法。把上界换成 100，实测涨到 7 次调用 —— 区间宽十倍多，只多问 4 刀。</text>
    <text x="16" y="352" fill="#00599c" font-weight="700">上一课的 lo 与 hi 装的是格子下标，这一课装的是答案的取值：机制一个字没改，改的是区间里躺着什么。</text>
    <text x="16" y="372" fill="#b8500f">这套只认单调。把判定换成「段数恰好等于 k」，绿色就不再连着排在左边，砍半立刻没了道理 —— 实测会把唯一成立的 5 厘米整个跳过。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `设计点就一句：**把求标题改写成判定题**。正面求解得把各种剪法都过一遍，而给定一个长度，一个循环就验完。总代价是「容器大小 × 答案宽度的对数」—— 实测 k=6 这趟 ok 被调用 3 次、一共 12 次除法；把上界从 8 换成 100，调用涨到 7 次而答案照旧是 2。` },
        { t: `p`, text: `什么时候想到它：源稿那句「最大值最小、最小值最大」是招牌 —— 最长的最短距离、最少要几个仓库、每页至少放几字，答案是个能比较大小的量，而「给定一个值做不做得到」往往比「最好的值是多少」好写几十倍。形状上它跟第 106 课的 std::lower_bound 会合：拆掉 ans、改问「第一个不成立的长度是哪一格」，写法就成了 lo < hi 配上 hi = mid —— 实测 k 取 3、6、8、9、18、19 六种，两个版本的答案逐个相同。` },
        { t: `h2`, text: `演示 1 · 源稿这段：剪成 6 段` },
        { t: `code`, lang: `c++`, code: `bool ok(const std::vector<int>& rope, int len, int k) {   // 头文件请 <vector>
    int cnt = 0;
    for (int r : rope) cnt += r / len;   // 整数除法：不够一段的零头直接扔掉
    return cnt >= k;                     // 这个长度剪不剪得出 k 段？
}` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
int main() {
    std::vector<int> rope = {8, 5, 3, 2};
    int k = 6, ans = 0;
    int lo = 1, hi = 8;                  // 答案一定在 1~8 厘米之间
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (ok(rope, mid, k)) { ans = mid; lo = mid + 1; }  // 行！试试更长
        else                  hi = mid - 1;                // 不行，缩短
    }
    std::println("剪成 {} 段，每段最长 {} 厘米", k, ans);
}` },
        { t: `p`, text: `实测一行：剪成 6 段，每段最长 2 厘米。手工验一遍才算数：len=2 是 4+2+1+1=8 段，够；len=3 是 2+1+1+0=4 段，不够 —— 2 确实是「还成立」里最长的那个。两个边界都不是拍出来的：hi 取 8 是**最长那根绳的长度**，只要至少剪一段，任何一段都不可能比整根长；lo 取 1 而不是 0，因为 0 厘米不是一个长度，而且它会走进除法里 —— 演示 3 让它露一次脸。` },
        { t: `h2`, text: `演示 2 · 本课任务：把 k 改成 3 和 8 各跑一次，再手工验证` },
        { t: `code`, lang: `c++`, code: `int lo = 1, hi = 8, ans = 0, steps = 0;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    int cnt = 0; for (int r : rope) cnt += r / mid;    // 自己数一遍段数，只为打印
    std::println("第 {} 问 lo={} hi={} mid={} 剪出 {} 段 {}", ++steps, lo, hi, mid, cnt, cnt >= k ? "够" : "不够");
    if (ok(rope, mid, k)) { ans = mid; lo = mid + 1; } else hi = mid - 1;
}
std::println("收手 lo={} hi={} ans={} 共问 {} 次", lo, hi, ans, steps);` },
        { t: `p`, text: `实测 k=3：三轮的 mid 依次是 4、6、5。4 厘米剪出 3 段正好够，记下 ans=4 往更长试；6 厘米只剩 1 段，退回；5 厘米 1+1+0+0=2 段，差一口气 —— 收手 ans=4。手工验证：len=4 是 2+1+0+0=3 段刚好，len=5 只剩 2 段，所以 4 对。实测 k=8：mid 依次 4、2、3，4 厘米 3 段不够、2 厘米 8 段正好、3 厘米 4 段不够，收手 ans=2 —— 和 k=6 走的是**同一条路径**，因为 6 段与 8 段都夹在「len=2 成立、len=3 就崩」这条线的同一侧。` },
        { t: `h2`, text: `演示 3 · 把下界写成 0：本课最响的一次报错` },
        { t: `code`, lang: `c++`, code: `std::vector<int> rope = {1, 1};        // 两根一厘米的绳
int k = 1, lo = 0, hi = 1, ans = 0;    // 下界手滑写成 0
while (lo <= hi) {
    int mid = (lo + hi) / 2;           // 第一问就算出 mid = 0
    if (ok(rope, mid, k)) { ans = mid; lo = mid + 1; } else hi = mid - 1;
}` },
        { t: `p`, text: `本机实测：先打一行 lo=0 hi=1 mid=0，程序当场停住 —— 终端报「浮点异常，核心已转储」，退出码 136。这是 x86 上整数除以零的长相，不是段错误，也不是编译期报错。上一课的 lo 是下标，0 完全合法；这一课的 lo 是长度，0 一进 ok 那句除法就死。同一段代码还有更阴的一种错法：**上界拍小**。实测把 k=3 那趟的 hi 从 8 改成 3，程序安静地答 3，而真答案是 4 —— 不崩、不报警、还少问一轮，比崩溃难查十倍。` },
        { t: `h2`, text: `演示 4 · 单调性一断，它连「无解」都敢告诉你` },
        { t: `code`, lang: `c++`, code: `int cut(const std::vector<int>& rope, int len) {   // 这个长度能剪出几段
    int cnt = 0;
    for (int r : rope) cnt += r / len;
    return cnt;
}
bool ok_eq(const std::vector<int>& rope, int len, int k) {
    return cut(rope, len) == k;      // 改成「恰好 k 段」：真话不再连着排在左边
}` },
        { t: `p`, text: `段数表还是 18、8、4、3、2、1、1、1，把判定从「够 k 段」换成「恰好 k 段」，形状全乱。实测 k=2：len=5 明明正好剪出 2 段，可它左边 1 到 4 厘米分别是 18、8、4、3 段，一个都不成立 —— 二分照旧先问 mid=4，看见 3 段判假，把 hi 收到 3，5 那一格从此走不到，实测收手 ans=0，程序一本正经打印「每段最长 0 厘米」。这就是「十有八九是它」的前半条件：**二分买的不是快，是单调**。顺带把真无解跑一遍：k=19，实测三轮 ok 全是假、ans 停在初值 0，输出「剪成 19 段，每段最长 0 厘米」—— 0 不是答案，是「没人回答」；要么先问一句 ok 在 len=1 时成不成立，要么把 ans 初值设成 -1。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `下界写成 0。实测 rope = {1, 1}、lo=0、hi=1，第一轮 mid 就是 0，ok 里的除法当场炸：终端「浮点异常，核心已转储」、退出码 136。长度这类答案空间的下界几乎都是 1。`,
          `条件写成 lo < hi。实测 k=9 与 k=18 的正确答案都是 1 厘米，这个写法两轮就收手、ans 停在初值 0，收手时 lo 与 hi 都还是 1 —— 最左那一格从没被问过。`,
          `上界比真答案小，或者判定压根不单调。前者实测 k=3 把 hi 改成 3 就答 3；后者实测换成「恰好 k 段」，len=5 明明成立却被整段跳过。动手前先把段数表打出来，亲眼看到绿色连成左边一截再砍。`,
          `中点沿用 (lo + hi) / 2。本题候选才到 8，爆不了；可答案空间动辄上二十亿：实测 lo=1600000000、hi=2000000000 时它打印 -347483648，而 lo + (hi - lo) / 2 打印 1800000000。上一课那句「防溢出写法」正是为这一课准备的。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把 k 改成 3 和 8 分别跑，再手工验证答案对不对 —— 每根绳除以候选长度、向下取整、加起来数一遍。对照实测：k=3 该问 4、6、5 三轮答 4，k=8 该问 4、2、3 三轮答 2。`,
          `照演示 2 把每轮的 lo、hi、mid 与段数都打出来，然后回答：为什么 k=6 和 k=8 走的是同一条路径？答案就在那条分界线的位置上。`,
          `延伸一：把 ans 这个零件拆掉，改问「第一个不成立的长度是哪一格」—— 条件写 lo < hi、上界收缩写 hi = mid，最后答 lo - 1。拿 k=3、6、8、9、18、19 各跑一遍，跟原版本逐个核对。`,
          `延伸二：把下界改成 0、拿 rope = {1, 1} 跑一次，把报错长相原话抄下来；再把 k 改成 19 跑一次，说清为什么「每段最长 0 厘米」不能当成答案。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：把「求最长」换成「给定一个长度问行不行」，判定一旦单调，答案空间就排成一串真真假假，上一课那一刀照旧砍半 —— 只多带一个 ans 记住最后一格真话；单调不在，这套一次都不该上。` }
      ]
    }
  ]
};
