/* 喵站 · C++ 掌握 正文分部 p21：第 153–154 课（第九轮）
 *
 * 源稿：153_归并排序.cpp、154_自定义排序规则.cpp
 * 归并是这门课第三个手写排序：冒泡（151）只动相邻两格，快排（152）靠基准切两堆，归并换一条路 ——
 * 先对半拆到只剩一个数，再把两摞「已经排好的牌」按大小合回来。递归不是新东西（第 71 课写过 sum_to），
 * 额外容器就是第 40 课起的 vector；自定义比较器也不是新东西，第 85 课、第 105 课都把 lambda 喂给过 std::sort，
 * 本课讲的是「规则按优先级一句句写」这件事本身，以及它凭什么不能随便写。
 * 所有输出、比较次数、搬运格子数、调用次数、最深层数、崩溃现场均经本机 g++ -std=c++23 实跑核对。
 */
window.MIAO_CPPM_P21 = {
  chapters: [
    {
      id: `m153`, title: `第 153 课 · 归并排序：把两摞已经排好的牌，按大小合回一摞`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：看懂「对半拆到只剩一个、再把两摞排好的牌按大小合回来」这两步怎么落在代码上，说清合并那三个 while 各自伺候谁，并亲手数出一趟归并比冒泡、比快排多花了多少搬运。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `拿一副扑克试一个动作：把牌对半分成两摞，**每一摞你自己先排好**，然后合回一副。合的时候两只手各按住一摞最上面那张，比一下，把小的那张抽出来放到桌面上，被抽空的那摞再露出下一张。桌面这摞摆完就是有序的 —— 关键不在你比了几次，而在**每次进桌面的都是当下全场最小的那张**。归并排序干的就是这件事，只不过那两摞牌不用你手动排，递归去排。` },
        { t: `p`, text: `于是代码分成两截，而顺序很反直觉：**先拆到底，再从底往上合**。拆的部分只有三行 —— mid 取段中间，对左半和右半各叫一次自己，跟第 152 课快排末尾那两行是同一个零件，也就是第 71 课的递归，出口照样是「只剩一个数就不用排」。新东西是合并：走进这一段时两半**已经是排好的**，所以只从两头往尾各扫一遍，不回头，也不交换任何格子。` },
        { t: `code`, lang: `text`, code: `拆：mid = (lo + hi) / 2，对左半、右半各叫一次自己     出口 if (lo >= hi) return;
合：i 盯左半的当前最小，j 盯右半的当前最小，小的那张写进 tmp[k++]
收：有一半边先扫空，另一半剩下的整段抄进 tmp，一次比较也不做
回：把 tmp[lo..hi] 整段抄回 v[lo..hi]` },
        { t: `p`, text: `那三个 while 常被当成冗余的三份代码，其实是三种责任：第一个是**正面对决**，两半都还有牌才比得了大小；第二、第三个是**收尾**，一旦有一半边先空，剩下的全都比已经进 tmp 的大，而且自己就是有序的 —— 整段抄过去就行。实测六个数全程只比了 11 次，却写了 32 个格子：**比较是比较，搬运是搬运，两笔账是分开的。**` },
        { t: `svg`, caption: `归并的三拍：先把整段对半拆到每段只剩一个数，两两各自排好，再把两摞按大小合回来。图上每一行的数字都是本机实跑打印出来的`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 356">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">5 2 8 1 9 3 这一趟：拆成单格 → 各自排好 → 合回来</text>
  <g font-size="12" fill="#26405a">
    <text x="16" y="52" font-weight="700">第 0 拍</text>
    <rect x="150" y="36" width="52" height="26" rx="4" fill="#f2f5fa" stroke="#8b98ab" stroke-width="1.2"/><text x="176" y="54" text-anchor="middle">5</text>
    <rect x="206" y="36" width="52" height="26" rx="4" fill="#f2f5fa" stroke="#8b98ab" stroke-width="1.2"/><text x="232" y="54" text-anchor="middle">2</text>
    <rect x="262" y="36" width="52" height="26" rx="4" fill="#f2f5fa" stroke="#8b98ab" stroke-width="1.2"/><text x="288" y="54" text-anchor="middle">8</text>
    <rect x="330" y="36" width="52" height="26" rx="4" fill="#f2f5fa" stroke="#8b98ab" stroke-width="1.2"/><text x="356" y="54" text-anchor="middle">1</text>
    <rect x="386" y="36" width="52" height="26" rx="4" fill="#f2f5fa" stroke="#8b98ab" stroke-width="1.2"/><text x="412" y="54" text-anchor="middle">9</text>
    <rect x="442" y="36" width="52" height="26" rx="4" fill="#f2f5fa" stroke="#8b98ab" stroke-width="1.2"/><text x="468" y="54" text-anchor="middle">3</text>
    <text x="508" y="54" fill="#33465e">拆到每格一段</text>

    <text x="16" y="104" font-weight="700">第 1 拍</text>
    <rect x="150" y="88" width="108" height="26" rx="4" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="204" y="106" text-anchor="middle">2 5</text>
    <rect x="262" y="88" width="52" height="26" rx="4" fill="#f2f5fa" stroke="#8b98ab" stroke-width="1.2"/><text x="288" y="106" text-anchor="middle">8</text>
    <rect x="330" y="88" width="108" height="26" rx="4" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="384" y="106" text-anchor="middle">1 9</text>
    <rect x="442" y="88" width="52" height="26" rx="4" fill="#f2f5fa" stroke="#8b98ab" stroke-width="1.2"/><text x="468" y="106" text-anchor="middle">3</text>
    <text x="508" y="106" fill="#33465e">两两合，4 次比较</text>

    <text x="16" y="152" font-weight="700">第 2 拍</text>
    <rect x="150" y="136" width="164" height="26" rx="4" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="232" y="154" text-anchor="middle">2 5 8</text>
    <rect x="330" y="136" width="164" height="26" rx="4" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="412" y="154" text-anchor="middle">1 3 9</text>
    <text x="508" y="154" fill="#33465e">三格一段</text>

    <text x="16" y="200" font-weight="700">第 3 拍</text>
    <rect x="150" y="184" width="344" height="26" rx="4" fill="#e8eef8" stroke="#00599c" stroke-width="2"/><text x="322" y="202" text-anchor="middle" fill="#00599c" font-weight="700">1 2 3 5 8 9</text>
    <text x="508" y="202" fill="#00599c">合成一整段</text>

    <path d="M322 216 L322 236" stroke="#57677c" stroke-width="2"/>
    <polygon points="322,244 316,234 328,234" fill="#57677c"/>

    <text x="16" y="266" font-weight="700" fill="#142639">最后一次合并的现场，本机实跑的打印</text>
    <text x="24" y="288">左半 0..2 = 2 5 8　右半 3..5 = 1 3 9</text>
    <text x="24" y="308">2 对 1 → 落 1；2 对 3 → 落 2；再落 3、5、8；左半扫空，右半剩一个 9 整段抄过去</text>
    <text x="16" y="330" fill="#00599c" font-weight="700">全程实测：11 次调用、5 次合并、11 次比较、搬 32 个格子，最深套到第 4 层。</text>
    <text x="16" y="348" fill="#b8500f">归并不交换任何格子，它只把两边的当前最小按顺序写进额外容器 tmp。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `跟前面两课对照，三家的脾气就分开了。冒泡每轮只把**一个**数送到最终位置；快排一趟分区把整段切成两堆；归并**一趟只负责合**，切的动作全在递归那两行里。它最特别的一点是从不交换：v 里的格子没被挪动过，被写的是 tmp，合完再整段抄回 v。这个选择决定了它全部的脾气 —— 多一个跟原段一样长的容器、天生保序，动作集中在写 tmp 和整段抄回 v 这两笔上。` },
        { t: `p`, text: `定位也说死：本课不是拿它替换第 105 课的 std::sort，是把两笔账分开数。本机拿同一千个数实测，值在 0 到 499 之间的固定伪随机序列：std::sort 问比较器 10877 次，归并比了 8695 次，结果一字不差；归并这边另外写了 19952 个格子进 tmp、又整段抄回来。**问话的次数和抄格子的次数，是两笔分开的账。**` },
        { t: `h2`, text: `演示 1 · 源稿这段：六个数排完` },
        { t: `code`, lang: `c++`, code: `void merge_sort(std::vector<int>& v, int lo, int hi, std::vector<int>& tmp) {   // 头文件请 <print> <vector>
    if (lo >= hi) return;                        // 只剩 1 个：不用排
    int mid = (lo + hi) / 2;                     // 对半拆
    merge_sort(v, lo, mid, tmp);  merge_sort(v, mid + 1, hi, tmp);
    int i = lo, j = mid + 1, k = lo;             // i 盯左半的当前最小，j 盯右半的
    while (i <= mid && j <= hi)
        tmp[k++] = (v[i] <= v[j]) ? v[i++] : v[j++];    // 小的那张先落座
    while (i <= mid) tmp[k++] = v[i++];          // 左半剩下的整段抄过去
    while (j <= hi)  tmp[k++] = v[j++];          // 右半剩下的整段抄过去
    for (int t = lo; t <= hi; ++t) v[t] = tmp[t];       // 抄回原位，全程没交换过一次
}` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
int main() {
    std::vector<int> v = {5, 2, 8, 1, 9, 3}, tmp(v.size());
    merge_sort(v, 0, static_cast<int>(v.size()) - 1, tmp);
    for (int x : v) std::print("{} ", x);
    std::println("");
}` },
        { t: `p`, text: `实测输出 1 2 3 5 8 9。三个细节先记下。第一，tmp 是**在外面开好、按引用传进来的**，长度跟 v 一样，全程只用这一份；第二，那句出口跟第 152 课一模一样，空段也一并挡得住 —— 实测空容器进来只调用 1 次、比较 0 次；第三，那句 static_cast 是被无符号减一逼的，上一课数过的绕回在这里照样成立。` },
        { t: `h2`, text: `演示 2 · 本课任务：合并前把 lo、hi 和两半内容打出来` },
        { t: `code`, lang: `c++`, code: `    int mid = (lo + hi) / 2;
    merge_sort(v, lo, mid, tmp);  merge_sort(v, mid + 1, hi, tmp);   // 先把两半各自排好
    std::print("段 {}..{} 合并前：左 {}..{} = ", lo, hi, lo, mid);
    for (int t = lo; t <= mid; ++t) std::print("{} ", v[t]);
    std::print("  右 {}..{} = ", mid + 1, hi);
    for (int t = mid + 1; t <= hi; ++t) std::print("{} ", v[t]);
    std::println("");                        // 打印插在两次递归之后、合并之前` },
        { t: `p`, text: `拿六个数实测，五行「合并前」是**从最短的段开始冒出来的**：先来 段 0..1，左 5 右 2；再来 段 0..2，左 0..1 已经是 2 5、右 2..2 是 8；右边那半先来 段 3..4 = 1 和 9，再来 段 3..5，左 3..4 = 1 9、右 5..5 = 3；最后一行才是 段 0..5，左 0..2 = 2 5 8、右 3..5 = 1 3 9。这最后一行就是本课的命门：两半各自已经排好了，合并才只用往两头各看一眼。打印必须插在递归之后也是这个道理 —— 递归之前两半还没排好，打出来什么也看不出来。` },
        { t: `h2`, text: `演示 3 · 数一数：比较、搬运、调用、层数` },
        { t: `code`, lang: `c++`, code: `int calls = 0, cmp_n = 0, copy_n = 0, depth = 0, deepest = 0;   // 只为测量，排序本身用不到
void merge_sort(std::vector<int>& v, int lo, int hi, std::vector<int>& tmp) {
    ++calls;  ++depth;  if (depth > deepest) deepest = depth;
    if (lo >= hi) { --depth; return; }
    int mid = (lo + hi) / 2;
    merge_sort(v, lo, mid, tmp);  merge_sort(v, mid + 1, hi, tmp);
    int i = lo, j = mid + 1, k = lo;
    while (i <= mid && j <= hi) { ++cmp_n; tmp[k++] = (v[i] <= v[j]) ? v[i++] : v[j++]; ++copy_n; }
    while (i <= mid) { tmp[k++] = v[i++]; ++copy_n; }
    while (j <= hi)  { tmp[k++] = v[j++]; ++copy_n; }
    for (int t = lo; t <= hi; ++t) { v[t] = tmp[t]; ++copy_n; }
    --depth;
}` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
int main() {
    std::vector<int> v = {5, 2, 8, 1, 9, 3}, tmp(v.size());
    merge_sort(v, 0, static_cast<int>(v.size()) - 1, tmp);
    std::println("六个数：调用 {} 次，比较 {} 次，搬运 {} 个格子，最深 {} 层", calls, cmp_n, copy_n, deepest);
    std::vector<int> big(1000);
    for (int k = 0; k < 1000; ++k) big[k] = k;              // 换成 1000 - k 就是倒着排
    std::vector<int> t2(1000);
    calls = cmp_n = copy_n = depth = deepest = 0;
    merge_sort(big, 0, 999, t2);
    std::println("一千个数：调用 {} 次，比较 {} 次，搬运 {} 个格子，最深 {} 层", calls, cmp_n, copy_n, deepest);
}` },
        { t: `p`, text: `实测六个数：调用 11 次、真在做合并的 5 次、比较 11 次、搬运 32 个格子、最深第 4 层。一千个数换三种输入各跑一遍，得到一组很说明问题的数：**已经排好的比较 5044 次，倒着排好的 4932 次，固定伪随机造的 8710 次**，而三次搬运一模一样都是 19952 个格子，调用 1999 次，层数 11 层。这就是归并的脾气 —— 怎么拆只看段长、跟数据长什么样无关，那笔搬运谁也躲不掉；比较那一头的次数反而少，两段都有序，一半扫空之后剩下的整段直接抄。` },
        { t: `h2`, text: `演示 4 · 那个等号：归并为什么天生保序` },
        { t: `code`, lang: `c++`, code: `void ms(std::vector<std::pair<int, int>>& v, int lo, int hi,   // 第一列是键，第二列是原下标
        std::vector<std::pair<int, int>>& tmp, bool left_first) {
    if (lo >= hi) return;
    int mid = (lo + hi) / 2;
    ms(v, lo, mid, tmp, left_first);  ms(v, mid + 1, hi, tmp, left_first);
    int i = lo, j = mid + 1, k = lo;
    while (i <= mid && j <= hi) {
        bool take_left = (v[i].first != v[j].first) ? (v[i].first < v[j].first) : left_first;
        tmp[k++] = take_left ? v[i++] : v[j++];
    }
    while (i <= mid) tmp[k++] = v[i++];   while (j <= hi) tmp[k++] = v[j++];
    for (int t = lo; t <= hi; ++t) v[t] = tmp[t];
}` },
        { t: `p`, text: `pair 是第 104 课的：第一列当键，第二列记它原来站在第几个。输入键序列 2 1 2 1 2 1，实测两种写法都把键排对了，同键的顺序却完全反过来：平手时先取左，三个键 1 按 第1个、第3个、第5个 落地；平手让给右边，就翻成 第5个、第3个、第1个，先来的排到后面去了。源稿那句 v[i] <= v[j] 里的 = 就是「平手时左边先落座」，正是它保证同键顺序不动 —— 这个性质叫**稳定**。下一课写排名规则时要靠它。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `tmp 当局部变量在函数里现造。功能照样对，但每次合并都新建一个跟段一样长的容器，实测一千个数有 999 次合并，就是 999 次新建。源稿把它做成第四个参数、外面开好传进来，全程只用一份。`,
          `k 忘了从 lo 起、而从 0 起，抄回却仍按 tmp 的下标读。实测六个数排成 0 0 0 2 5 8，八个数排成 0 0 0 0 0 0 2 5 —— 前面那些格子压根没被写过，抄回来就是初始的零。写 tmp 和抄回 v 必须用同一套下标。`,
          `收尾那两个 while 删掉一个。少写「左半剩下的抄回去」，实测六个数得到 1 2 0 3 0 0：没抄的那些格子在 tmp 里留着上一段的旧值。那两个循环不是保险，是必需 —— 一半扫空、另一半还没写完，每次合并都会走到这里。`,
          `出口写成 if (lo == hi) return;。实测两种下场：空容器上 lo 是 0、hi 是 -1，等号拦不住，函数拿着同一个范围反复往下叫，跑到栈崩，报段错误、核心已转储；范围少减一的那种则安静地跑回来，实测打印 1 2 5 8 9 3，结果错了却不崩。判定永远写 >=。`,
          `把 mid 写成 (lo + hi + 1) / 2 当风格试。实测 lo 是 0、hi 是 1 时 mid 算出 1，左半跟原段一样长，递归根本没变小，第 71 课那条「每次要把问题变小」当场断掉，程序直接段错误。(lo + hi) / 2 向下取整，才是两半都严格变短的那一半原因。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `在合并前打印 lo、hi 和两半内容，看「拆→合」的全过程。照演示 2 把打印插在两次递归之后，拿 5 2 8 1 9 3 跑一遍，然后回答两件事：为什么最后一行的两半都已经是排好的？为什么打印是从最短的段开始出现的？`,
          `把演示 3 的计数器接上，报出六个数的调用次数、比较次数、搬运格子数、最深层数；再换一千个数的「已经排好」「倒着排好」「固定伪随机」各跑一遍，说出哪个数变了、哪个数一分没动。`,
          `延伸一：把 v[i] <= v[j] 的等号删掉，跑一遍演示 4 那组同键序列，把两种输出的同键顺序抄下来，说清为什么不保序了。`,
          `延伸二：把 tmp 改成在合并里现造，拿一千个数跑一遍，把新建次数跟实测的 999 次合并对上，说清多出来的是哪一步。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：归并 = 拆到只剩一个，再把两摞排好的牌按大小合回来；它一次都不交换，靠一个全程共用的 tmp 来回搬，所以比较次数会跟着数据变、搬运次数恒定一分不少，而那句 v[i] <= v[j] 里的等号就是它天生保序的原因。` }
      ]
    },
    {
      id: `m154`, title: `第 154 课 · 自定义排序规则：把「谁该排在谁前面」一句句写清楚`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把 std::sort 的第三参数讲透 —— 它问的是「a 该不该排在 b 前面」，规则要按优先级一句句写；补上第三条「同分同罚时按名字」，并搞清一条规则写错时排序算法会怎么翻脸。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 105 课你已经在 std::sort 上用过这个第三参数，第 85 课也写过一次，所以它不是新东西；本课把它**当规格来读**。std::sort 不问你「要不要交换这两个」，它只反复问一句：**a 严格排在 b 前面吗？** 回 true 就是把 a 放前面，回 false 就是「没排在前面，别动」。这跟第 151 课冒泡那句 if 不是一回事 —— 冒泡判相邻两格反没反，这里判任意两个的先后关系，而且它会被问上千次。` },
        { t: `p`, text: `规则按优先级写，靠的是 if 加 return 的短路：先比分，**只有分数不同才当场定案**；分数打平，控制流才落到下一行去比罚时；再打平，才轮到第三条。谁在前不靠写得多，靠**先写的那条先判**。实测一千个人这一跑把比较器问了 8543 次，三个人只问 4 次 —— 你写的这三行会被反复念，所以每一行的口径都必须稳。` },
        { t: `code`, lang: `text`, code: `比较器只回答一个问题：a 严格排在 b 前面吗？
第一优先：分数不同的 → 分高的在前          return a.score > b.score
第二优先：分数打平的 → 罚时少的在前        return a.penalty < b.penalty
第三优先：两条都打平 → 按名字定个先后      return a.name < b.name   ← 本课任务` },
        { t: `p`, text: `这条链上有个硬条件：**任何两个元素不能互相都说对方在前**。分数打平时你如果写 return a.penalty >= b.penalty;，同分同罚的两人就两边都答 true，等于 a 在 b 前面、b 也在 a 前面。std::sort 相信你的话，按这个前提去挑主元、划区间 —— 实测两千个人的全等价数据它还能跑完，500 个人、分数取 i % 17 的那组直接**段错误、核心已转储**，连一行输出都来不及刷出来。这不是排得不好，是排序算法的前提塌了。` },
        { t: `svg`, caption: `三条规则怎么裁决一张榜：从上往下问，谁先不同谁定案；本机实跑的五人榜就按这条链排出来`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 344">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">比较器被问一次，就走一遍这条链</text>
  <g font-size="12" fill="#26405a">
    <rect x="16" y="40" width="196" height="40" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
    <text x="114" y="58" text-anchor="middle" font-weight="700">第一条：比分</text>
    <text x="114" y="74" text-anchor="middle">不同就定案，分高在前</text>
    <path d="M212 60 L262 60" stroke="#57677c" stroke-width="2"/><polygon points="270,60 258,54 258,66" fill="#57677c"/>
    <rect x="274" y="40" width="196" height="40" rx="8" fill="#f2f5fa" stroke="#8b98ab" stroke-width="1.5"/>
    <text x="372" y="58" text-anchor="middle" font-weight="700">第二条：比罚时</text>
    <text x="372" y="74" text-anchor="middle">只有前一条打平才轮到它</text>
    <path d="M470 60 L520 60" stroke="#57677c" stroke-width="2"/><polygon points="528,60 516,54 516,66" fill="#57677c"/>
    <rect x="532" y="40" width="92" height="40" rx="8" fill="#fdece1" stroke="#b8500f" stroke-width="1.5"/>
    <text x="578" y="58" text-anchor="middle" font-weight="700">第三条</text>
    <text x="578" y="74" text-anchor="middle">按名字</text>

    <text x="16" y="106" fill="#00599c" font-weight="700">五条数据实跑出来的榜：</text>
    <text x="16" y="128">第1名 小强 300分 罚时90</text>
    <text x="16" y="148">第2名 阿强 300分 罚时90</text>
    <text x="16" y="168">第3名 小明 300分 罚时120</text>
    <text x="16" y="188">第4名 小红 280分 罚时100</text>
    <text x="16" y="208">第5名 艾红 280分 罚时100</text>

    <text x="300" y="128" fill="#1d7a3c">小强 与 阿强：前两条全打平 → 第三条定案</text>
    <text x="300" y="148" fill="#1d7a3c">名字比的是字节，小 排在 阿 之前</text>
    <text x="300" y="168" fill="#33465e">小明 罚时 120，被第二条判到第三</text>
    <text x="300" y="188" fill="#33465e">小红 分数低，第一条就判下去了</text>
    <text x="300" y="208" fill="#b8500f">艾红 与 小红 同分同罚 → 也交给第三条</text>

    <text x="16" y="244" fill="#b8500f" font-weight="700">平手那一行如果两边都答 true：std::sort 会信你，然后崩 —— 实测 500 人一组段错误、核心已转储。</text>
    <text x="16" y="266" fill="#33465e">规则顺序就是优先级：本机把前两条调换，榜变成 小强、小红、小明，分数不再是第一优先。</text>
    <text x="16" y="288" fill="#33465e">六个中文名按 a &lt; b 排出来是 小强 张明 李华 王芳 艾红 阿强 —— 不是拼音序。</text>
    <text x="16" y="310" fill="#00599c">想保住同分原顺序：把「原来站在第几个」写成最后一条规则，这条链才算判完。</text>
    <text x="16" y="332" fill="#b8500f">std::sort 不保证稳定：64 个全等价的实测排完成了 G48 开头，原顺序没了。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `为什么规则要写成「谁在前」而不是「谁大」？因为只有这样，升序降序、多关键字、按长度、按绝对值这些完全不同的诉求才是同一个接口：把那句问题答对就行。第 153 课归并那边同键保序靠代码里的等号，std::sort 这边不给你这个便宜 —— 它明确不保证同键维持原始顺序，所以真用的榜，规则得写到**没有任何两个人完全等价**为止。` },
        { t: `p`, text: `本课的定位就一句：不是学一个新函数，是学会把优先级写成一段能被千次追问的代码。源稿给的是比赛排名，分高在前、同分罚时少在前，两条一串就出来了；第三条归你补。` },
        { t: `h2`, text: `演示 1 · 源稿这段：两条规则` },
        { t: `code`, lang: `c++`, code: `#include <algorithm>
#include <print>
#include <string>
#include <vector>
struct Player { std::string name; int score; int penalty; };
int main() {
    std::vector<Player> ps = {{"小明", 300, 120}, {"小强", 300, 90}, {"小红", 280, 100}};
    std::sort(ps.begin(), ps.end(), [](const Player& a, const Player& b) {
        if (a.score != b.score) return a.score > b.score;   // 先比分，不同就定案
        return a.penalty < b.penalty;                        // 平手才比罚时
    });
    for (size_t i = 0; i < ps.size(); ++i)
        std::println("第{}名 {} {}分", i + 1, ps[i].name, ps[i].score);
}` },
        { t: `p`, text: `实测三行：第1名 小强 300分、第2名 小明 300分、第3名 小红 280分。小强 和 小明 都是 300 分，把两人分开的是第二行那句罚时 —— 第一条规则只回答了一次，剩下的定案权全在第二条。第三参数收的是一个 lambda，两个参数都带 const 引用是因为 std::sort 只看不改；这里的 struct 是第 83 课那一套，名字比较用的是 std::string 自带的 &lt;。` },
        { t: `h2`, text: `演示 2 · 本课任务：补第三条规则，同分同罚时按名字` },
        { t: `code`, lang: `c++`, code: `std::sort(ps.begin(), ps.end(), [](const Player& a, const Player& b) {
    if (a.score != b.score) return a.score > b.score;          // 第一条：分高在前
    if (a.penalty != b.penalty) return a.penalty < b.penalty;  // 第二条：罚时少在前
    return a.name < b.name;                                    // 第三条：名字字典序
});` },
        { t: `p`, text: `数据加两个人再跑：小强 与 阿强 同为 300 分、罚时都是 90，前两条全打平，第三条一锤定音。实测五人榜是 第1名 小强、第2名 阿强、第3名 小明、第4名 小红、第5名 艾红。这里有个真实长相要说清：字符串那个 &lt; 比的是**字节**，不是拼音 —— 本机把 阿强 小强 张明 李华 王芳 艾红 排一遍，得到 小强 张明 李华 王芳 艾红 阿强，而拼音序该是 阿强 艾红 打头。英文和数字混排才是你直觉那个字典序，中文名别指望它。` },
        { t: `h2`, text: `演示 3 · 规则顺序就是优先级` },
        { t: `code`, lang: `c++`, code: `std::sort(ps.begin(), ps.end(), [](const Player& a, const Player& b) {
    if (a.penalty != b.penalty) return a.penalty < b.penalty;  // 把两条调换
    return a.score > b.score;
});` },
        { t: `p`, text: `源稿那三个人，实测榜变成 小强、小红、小明 —— 小红只有 280 分，却因罚时 100 比 小明的 120 少而排到第二。每一行的写法一个字没变，只是先后换了，榜就换了：先写的那条先判。再给一个数感受它的分量 —— 同样这段规则，实测一千个人时把比较器问了 8543 次，三个人只问 4 次。往规则里多塞一句 if，那八千多次每次都要多走一遍；写得啰嗦要付钱，写得自相矛盾是要崩的。` },
        { t: `h2`, text: `演示 4 · 同分想保住原顺序：把下标写成最后一条规则` },
        { t: `code`, lang: `c++`, code: `struct Row { std::string name; int score; int idx; };   // idx 记它原来站在第几个
std::sort(r.begin(), r.end(), [](const Row& a, const Row& b) {
    if (a.score != b.score) return a.score > b.score;
    return a.idx < b.idx;                                 // 分数相同就按原顺序，永远判得出胜负
});` },
        { t: `p`, text: `输入 甲9、乙5、丙9、丁5，实测得到 甲 9分 原第0个、丙 9分 原第2个、乙 5分 原第1个、丁 5分 原第3个，同分的维持原序。为什么需要这一手？本机实测：64 个同分同罚时的人喂给 std::sort，排完从 G48 开头；200 个人按分数分三档，46 个同分那一档原来是 N7 N10 N14 打头，排完成了 N124 N54 N176 打头。std::sort 从没承诺过同键保序，上一课归并那种「平手先取左」的规矩它不给；要这个行为，就自己把分得出胜负的东西写进最后一条。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `平手时返回 true。把第二条写成 return a.penalty >= b.penalty;，同分同罚的两人就互相都说对方在前。实测 500 个人、分数取 i % 17 的那组直接段错误、核心已转储，一行输出都没刷出来；换两千个全同分的反而能跑完 —— 这种错**时有时无**，比必错更难查。凡是可能打平的那一行，等号都不能给。`,
          `把比较器写成「要不要交换」。有人照第 151 课冒泡那句 if 的口径写 a.score &lt; b.score 就返回 true，指望它把小的往后挪 —— 实测排出来整个反了：小红 280 分排第一，两个 300 分的掉到最后。它回答的是 a 在前吗，要降序就老实写 a.score > b.score。`,
          `规则链写漏一条，留出一堆完全等价的元素。不报错，分数也对，只是同分的人每次跑的先后都可能变，见演示 4 那两组实测。判据很简单：两个方向都答 false 的那些对，就是顺序还没定下来的对。`,
          `以为 a.name &lt; b.name 排出来是拼音序。实测中文名按 UTF-8 字节走，得到 小强 张明 李华 王芳 艾红 阿强。真需要别的口径，就把排序键自己算出来再比，别赌字节。`,
          `在比较器里改数据或做重活。参数是 const 引用、又被问上千次，往里塞打印、塞计数行得通，塞修改会让同一个人不同时刻被判成不一样，规则就自相矛盾了。要预处理，就在 std::sort 之前把字段准备好。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `补第三条规则：同分同罚时按名字字典序，提示就是 return a.name &lt; b.name;。按演示 2 加进比较器，拿演示 2 那五个人跑一遍，把五行榜抄下来，说出哪两个人是靠第三条分出来的。`,
          `再往数据里塞一个人，让「前两条平手、第三条也平手」真出现，说出你的规则对这两人给出什么结果 —— 两个方向都答 false，就是还没判完，再决定要不要补第四条。`,
          `延伸一：照演示 3 把两条规则的先后调换，用源稿那三个人跑一遍，把新榜跟演示 1 的三行对比，说清是哪一行的优先级变了。`,
          `延伸二：按演示 4 给 struct 加一个 idx 当最后一条规则，先跑 甲乙丙丁 那组确认同分维持原序，再把最后一条删掉重跑，看同分顺序变不变。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：std::sort 只反复问一句「a 严格排在 b 前面吗」，规则按优先级一句句写、先写的先判；平手那一行绝不能返回 true，而且规则要写到没有任何两个元素完全等价，否则同分顺序就是它自己的事，不是你的事。` }
      ]
    }
  ]
};
