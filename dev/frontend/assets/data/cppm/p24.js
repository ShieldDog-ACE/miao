/* 喵站 · C++ 掌握 正文分部 p24：第 159–160 课（第九轮）
 *
 * 源稿：159_区间调度.cpp、160_双指针两数之和.cpp
 * 这两课是 L5-03 那一节的第 3、4 篇，前面的 157 找零钱、158 贪心会翻车已经把
 * 「每步拿当前最优」立起来又推倒一次，所以本课口径是「配上正确的排序，贪心才站得住」。
 * 本课没有新语法：struct、lambda 比较器、std::sort 全是第 85、105、154 课写过的手艺，
 * 双指针那对下标也是第 152 课快排分区里对撞过的 i 与 j —— 新的是「先排好序再单遍扫」这个套路。
 * 所有数字 —— 三种排序规则的 3/2/1 个、500 批随机对拍的错误批数、双指针走位步数与
 * 双重循环尝试对数 —— 均经本机 g++ -std=c++23 实跑核对。
 */
window.MIAO_CPPM_P24 = {
  chapters: [
    {
      id: `m159`, title: `第 159 课 · 区间调度：把会议按散场时刻排队，越早散场的越先收下`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把「一堆会议时间互相撞车，最多能参加几个」做成一段代码 —— 按结束时间排序、单遍扫描、能塞就塞，并用同一批区间实测三种排序规则的差距。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课第 158 课刚揭过贪心的短：每步拿当前最优，遇上不该拿的时候说翻车就翻车。这一课补上它的另一副面孔 —— 贪心一旦配上对的排序就强得很，区间调度是最干净的一个例子。场景很日常：一天里六个会的时段互相撞车，你最多能参加几个？` },
        { t: `p`, text: `动作只有两步。第一步，把所有会议按结束时间从早到晚排一遍，用的正是第 85 课那套「lambda 按 struct 成员排序」的手艺，第 105 课和第 154 课也各写过一遍。第二步，从头扫到尾，手里只记一个数 last_end —— 我手上的会散场在几点。每碰到一个会只问一句：它开场时我散场了没有？散了就参加，并把 last_end 换成这一场的结束时刻；没散就跳过。` },
        { t: `p`, text: `为什么偏偏是结束时间？关键在「腾地方」三个字。一个会真正占住的，是它散场之前那段日历；越早散场，把后面的时间还给你的时刻越早 —— 源稿那句「越早结束的会议，越早把时间腾出来」就是这个机制。反过来，开场最早的会可能一口气开到很晚，它第一个坐下就把后面全堵死；「谁短谁先来」更不是理由，短而开得晚的会照样挡掉你后面所有安排，下面实测会看到它多离谱。` },
        { t: `p`, text: `还差一步才敢说它对：贪心每步挑结束最早的那场，会不会漏掉一个更妙的组合？不会。任取一个方案，看它参加的第一场：如果不是「结束最早」那一场，就把两场对调 —— 换来的这场散得更早，剩下的会照样一场不冲突。一路换下去，任何方案都能变成贪心的方案而个数一个没少，所以它数出来的就是真正的上限。` },
        { t: `code`, lang: `text`, code: `三步骨架：1 按结束时间排序 → 2 从头扫，开场不早于 last_end 就参加 → 3 把 last_end 换成这一场的结束时刻
不变量　：扫到一半时，last_end 是已参加的会里最晚的散场时刻，且已选的会彼此都不撞
判据只有一句：if (m.start >= last_end) —— 整段的对错全压在这个 >= 上` },
        { t: `svg`, caption: `区间条上的贪心过程。上半按结束时刻排队，绿色是收下的三场，灰色是被撞车判据挡掉的三场；下半改成按开场时刻排队，第一场的 0~6 一坐下就把后面全挡了。时间轴一格一小时`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 404">
  <text x="16" y="18" font-size="13" font-weight="700" fill="#142639">按结束时间排队，能塞就塞：实测收下 3 场</text>
  <g font-size="12" fill="#26405a">
    <text x="14" y="49">1~4</text><text x="54" y="49" fill="#1d7a3c" font-weight="700">选</text>
    <rect x="141" y="34" width="159" height="21" rx="4" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/>
    <text x="308" y="49">散场最早，第一个收下</text>

    <text x="14" y="77">3~5</text><text x="54" y="77" fill="#8b98ab">跳</text>
    <rect x="247" y="62" width="106" height="21" rx="4" fill="#f2f4f7" stroke="#8b98ab" stroke-width="1.5"/>
    <text x="361" y="77">3 点开场，撞上 1~4</text>

    <text x="14" y="105">0~6</text><text x="54" y="105" fill="#8b98ab">跳</text>
    <rect x="88" y="90" width="318" height="21" rx="4" fill="#f2f4f7" stroke="#8b98ab" stroke-width="1.5"/>
    <text x="414" y="105">开场最早的，反而占掉大半天</text>

    <text x="14" y="133">5~7</text><text x="54" y="133" fill="#1d7a3c" font-weight="700">选</text>
    <rect x="353" y="118" width="106" height="21" rx="4" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/>
    <text x="467" y="133">5 不早于 4</text>

    <text x="14" y="161">5~9</text><text x="54" y="161" fill="#8b98ab">跳</text>
    <rect x="353" y="146" width="212" height="21" rx="4" fill="#f2f4f7" stroke="#8b98ab" stroke-width="1.5"/>
    <text x="96" y="161">撞上刚收下的 5~7</text>

    <text x="14" y="189">8~9</text><text x="54" y="189" fill="#1d7a3c" font-weight="700">选</text>
    <rect x="512" y="174" width="53" height="21" rx="4" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/>
    <text x="96" y="189">8 不早于 7，最后一场也塞进来</text>

    <line x1="88" y1="206" x2="568" y2="206" stroke="#8b98ab" stroke-width="1.5"/>
    <text x="88" y="222" text-anchor="middle">0</text><text x="141" y="222" text-anchor="middle">1</text>
    <text x="194" y="222" text-anchor="middle">2</text><text x="247" y="222" text-anchor="middle">3</text>
    <text x="300" y="222" text-anchor="middle">4</text><text x="353" y="222" text-anchor="middle">5</text>
    <text x="406" y="222" text-anchor="middle">6</text><text x="459" y="222" text-anchor="middle">7</text>
    <text x="512" y="222" text-anchor="middle">8</text><text x="565" y="222" text-anchor="middle">9</text>

    <text x="16" y="248" font-size="13" font-weight="700" fill="#b8500f">换按开始时间排队：同一批数据，只剩 2 场</text>
    <text x="14" y="273">0~6</text><text x="54" y="273" fill="#1d7a3c" font-weight="700">选</text>
    <rect x="88" y="258" width="318" height="15" rx="4" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/>
    <text x="414" y="270">它一坐下，3~5 与 5~7 全在门外</text>
    <text x="14" y="294">1~4</text><text x="54" y="294" fill="#8b98ab">跳</text>
    <rect x="141" y="282" width="159" height="15" rx="4" fill="#f2f4f7" stroke="#8b98ab" stroke-width="1.5"/>
    <text x="14" y="315">3~5</text><text x="54" y="315" fill="#8b98ab">跳</text>
    <rect x="247" y="303" width="106" height="15" rx="4" fill="#f2f4f7" stroke="#8b98ab" stroke-width="1.5"/>
    <text x="14" y="336">5~7</text><text x="54" y="336" fill="#8b98ab">跳</text>
    <rect x="353" y="324" width="106" height="15" rx="4" fill="#f2f4f7" stroke="#8b98ab" stroke-width="1.5"/>
    <text x="467" y="336">5 早于散场的 6</text>
    <text x="14" y="357">5~9</text><text x="54" y="357" fill="#8b98ab">跳</text>
    <rect x="353" y="345" width="212" height="15" rx="4" fill="#f2f4f7" stroke="#8b98ab" stroke-width="1.5"/>
    <text x="14" y="378">8~9</text><text x="54" y="378" fill="#1d7a3c" font-weight="700">选</text>
    <rect x="512" y="366" width="53" height="15" rx="4" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/>

    <text x="16" y="392" fill="#00599c" font-weight="700">数据一个字没改，只换了 std::sort 的第三个参数：3 场变 2 场。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `这段代码的形状是一次排序加一次扫描：代价全压在排序上，第 105 课说过 std::sort 是 n log n 量级，后面那个 for 循环只是零头，而它带的状态只有一个 int。这个「先排一次、之后一路走到底」的套路，和第 108 课「先 sort 再 unique」是同一个脾气。` },
        { t: `p`, text: `脾气也说死：它买的是「个数最多」这一件事。一旦给每场会加个权重 —— 老板在场那场算三分 —— 按结束时间排立刻不管用，那正是上一课第 158 课的翻车现场。带权的版本以后再讲，本课先把不撞车数最多个搞透。` },
        { t: `h2`, text: `演示 1 · 源稿这段：六个会最多参加三个` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <algorithm>
struct Meet { int start, end; };
int main() {
    std::vector<Meet> ms = {{1,4}, {3,5}, {0,6}, {5,7}, {5,9}, {8,9}};
    std::sort(ms.begin(), ms.end(), [](const Meet& a, const Meet& b) { return a.end < b.end; });
    int count = 0, last_end = -1;                    // 排的是 end 那一列
    for (const Meet& m : ms)
        if (m.start >= last_end) {                   // 开场不早于上个散场 → 不撞车
            ++count; last_end = m.end;               // 记下「占用到几点」
            std::println("参加 {}~{} 的会", m.start, m.end); }
    std::println("最多参加 {} 个", count);
}` },
        { t: `p`, text: `实测三行：参加 1~4 的会、参加 5~7 的会、参加 8~9 的会，最后一行 最多参加 3 个。有个细节值得停下来看：排序后的顺序是 1~4、3~5、0~6、5~7、5~9、8~9 —— 0~6 明明开场最早却屈居第三，因为排的是 end 那一列，跟 start 无关。这一处区别就是本课全部的戏肉。` },
        { t: `h2`, text: `演示 2 · 只换排序规则：少选一个，甚至少选两个` },
        { t: `code`, lang: `c++`, code: `// 其余照抄演示 1，只动 std::sort 的第三个参数
std::sort(ms.begin(), ms.end(),
          [](const Meet& a, const Meet& b) { return a.start < b.start; });   // 改按开场时间
// 再试一种看着最省事的，先开短会：
// [](const Meet& a, const Meet& b) { return a.end - a.start < b.end - b.start; }` },
        { t: `p`, text: `同一批区间本机实测三种排法：按结束时间 3 个，就是 1~4、5~7、8~9；按开始时间只剩 2 个 —— 排完第一个进来的是 0~6，它一坐下就把 3~5 和 5~7 挡在门外，最后只补上 8~9；按「会开得短」排只有 1 个 —— 8~9 只有一小时，偏它开在一天将尽，把 3~5、5~7 一起挤掉了。我又造了 500 批随机区间，每批三到八场，把所有选法全试一遍求出真正的最多值当标准答案：按结束时间一次没错，按开始时间错 100 批，按会短错 326 批、最多差 4 个。` },
        { t: `h2`, text: `演示 3 · 本课任务：把 {8,9} 改成 {4,5}` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <algorithm>
struct Meet { int start, end; };
int main() {
    std::vector<Meet> ms = {{1,4}, {3,5}, {0,6}, {5,7}, {5,9}, {4,5}};
    std::sort(ms.begin(), ms.end(), [](const Meet& a, const Meet& b) { return a.end < b.end; });
    int count = 0, last_end = -1;
    for (const Meet& m : ms)
        if (m.start >= last_end) { ++count; last_end = m.end;
            std::println("参加 {}~{} 的会", m.start, m.end); }
    std::println("最多参加 {} 个", count);
}` },
        { t: `p`, text: `先猜再跑是这题正确的练法，因为结果会骗人。实测排序后是 1~4、3~5、4~5、0~6、5~7、5~9，选中的三场换成 1~4、4~5、5~7 —— 个数还是 3，一场没多，只是参加哪些会换了一批。道理在 3~5 和 4~5 散场时刻都是 5：上一场 1~4 四点散场，三点开场的那场撞车被挡，四点开场的那场刚好接上。这里还藏着第 85 课那条平局警告 —— end 相同时 std::sort 不保证谁在前，实测这一版把 3~5 排在 4~5 前面，换一种顺序数出来还是 3 个，但打印出来的是哪一场就不一样了。` },
        { t: `h2`, text: `演示 4 · 两桩边界：散场即进场，和 last_end 那个 -1` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <algorithm>
struct Meet { int start, end; };
int main() {
    std::vector<Meet> ms = {{-2,0}, {1,3}};      // 起点带负数：最早那场开在 -2
    std::sort(ms.begin(), ms.end(), [](const Meet& a, const Meet& b) { return a.end < b.end; });
    int count = 0, last_end = -1;                // 源稿的哨兵
    for (const Meet& m : ms)
        if (m.start >= last_end) { ++count; last_end = m.end; }
    std::println("两场明明不撞车，last_end 从 -1 起只选到 {} 个", count);
}` },
        { t: `p`, text: `两桩边界。头一桩是撞车判据：四点散场、四点开场算不算撞车？源稿写 m.start >= last_end，等于号在内，意思是散场即进场，一个人连着赶两个会中间一秒不浪费。把等于号去掉再跑演示 3 那组，实测从 3 个掉到 2 个，被挡掉的正是 4~5 —— 口径从来不在算法里，就在你抄下来的这一行，第 150 课把边界列为头号杀手说的就是这种地方。第二桩是那个 -1：它是个暗号，表示还没开始挑会，而第 126 课刚说过这类魔法值靠一句没写在纸面上的假设 —— 起点都非负。` },
        { t: `p`, text: `实测把数据换成起点带负的两场 -2~0 和 1~3：用 -1 当哨兵只选到 1 个，因为最早的 -2 比 -1 还小，第一行判据直接把它否掉。改成先收下排完之后的第一场、从第二场扫，同一组数据实测 2 个。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `排错了列。改成按 start 或按会的长度排，程序不报错也不崩，只是答案从 3 个变成 2 个或 1 个。写完像演示 1 那样把选中的会逐行打印，再拿演示 2 三种排法各跑一遍对数。`,
          `撞车判据写成 m.start > last_end。实测演示 3 那组从 3 个掉到 2 个，被挡掉的是 4~5。到底是散场即进场，还是得留一分钟走过去，题目说了算，等于号就是这道题的口径。`,
          `把 last_end = m.end 写到 if 的花括号外面。看着只挪一行，实测六个会只剩 1 个 —— 被跳过的会也把自己的结束时刻顶了上去，等于把空会议室报成有人用。`,
          `last_end 的 -1 当成万能初值。数据允许负起点时它连吞一场，实测那个 1 对 2。写哨兵前先问这题最小值能到多少，问不清就先收下第一场。`,
          `在 std::println 的格式串里裸写一场会。实测 println 一句 "参加 {1,4} 的会" 编译不过，报错第一行是 call to consteval function std::basic_format_string is not a constant expression —— 花括号在格式串里是坑位记号，要打印就把值当参数递进去。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `源稿这条：把 {8,9} 改成 {4,5}，先猜结果再验证。猜的时候先说清你猜中哪三场，再跑演示 3 对答案，对不上就想清楚是哪一场把谁挡了。`,
          `照演示 2 把排序依据换成开始时间，把选中的会逐行打印，说出少掉那个会是被谁挡在门外的。`,
          `拿自己真实的一天造六个会，先手算最多能参加几场，再让程序说，看两个答案对不对得上。`,
          `延伸：撞车判据改成严格大于，重跑演示 3 报出个数变化；再把初值换成先收下排序后的第一场，用演示 4 那组负起点数据跑一次，说出为什么这样就不吞会了。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：诀窍不在扫描，在那一行排序规则 —— 按结束时间从早到晚排、能塞就塞；换成按开始时间或按会短，实测立刻少选一个到两个。而 last_end 什么时候更新、等于号留不留，是这套贪心仅有的两处刀口。` }
      ]
    },
    {
      id: `m160`, title: `第 160 课 · 双指针两数之和：先排好序，再让两个下标从两头往中间夹`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：在排好序的数组上用 lo 与 hi 两个下标从两头往中间夹着找一个和，讲清它凭什么一次排除一整列，并拿双重循环对拍两边的次数。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课第 159 课刚把「先排一次、之后一路扫」这个套路用过一遍，今天换一道题继续吃它：有序数组里找两个数凑出目标值。源稿那句讲法很准 —— 拿最小的和最大的试，和太小就是小的那个太不给力，左指针右移；和太大就是大的那个太猛，右指针左移。` },
        { t: `p`, text: `写成代码只有三行逻辑：初值 lo = 0、hi = 最后一个下标，判据 lo < hi；每一步算一次 v[lo] + v[hi]，等于目标就收工，小于目标就 ++lo，大于目标就 --hi。两只手各自朝中间走、谁也不倒退，所以最多 n-1 步就把整个数组夹完。` },
        { t: `p`, text: `值钱的地方在这里：它一步排除的不是一个候选，而是一整列。数组有序时，v[lo] 配上最大的 v[hi] 都还不够，那它配上 hi 左边的任何人都更不够 —— 这一整行搭配全废了，lo 直接抬一格，不必回头。和太大那侧同理：v[hi] 配上最小的 v[lo] 都超了，它配 lo 右边的任何人也全超。` },
        { t: `p`, text: `这对下标的姿势你不是第一次见：第 152 课快排分区里从两头对撞的 i 与 j 就是它，那时是两只手各找一个放错边的格子，这里是一只手配一只手凑一个和，能这么走的前提都是数组有序。至于排序本身，那是第 105 课的 std::sort，本课一点不新 —— 整套办法的成本就是「先排一次」。` },
        { t: `code`, lang: `text`, code: `两头往中间夹：初值 lo = 0、hi = 最后一个下标，判据 lo < hi
每步只算一次和：等于 target 收工，小于就 ++lo，大于就 --hi
敢一次排除一整列的理由：有序时 v[lo] 配不上 v[hi]，就配不上 hi 左边的任何人` },
        { t: `svg`, caption: `有序数组上的双指针走位。顶行是七个格子，下面四行是每一步 lo 与 hi 之间还没排除的窗口，窗口每步至少短一格；四行的和与动作都是本机实跑的打印`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300">
  <text x="16" y="18" font-size="13" font-weight="700" fill="#142639">target = 10：两头往中间夹，实测 4 步命中 2 + 8</text>
  <g font-size="12" fill="#26405a">
    <text x="92" y="38" text-anchor="middle">0</text><text x="162" y="38" text-anchor="middle">1</text>
    <text x="232" y="38" text-anchor="middle">2</text><text x="302" y="38" text-anchor="middle">3</text>
    <text x="372" y="38" text-anchor="middle">4</text><text x="442" y="38" text-anchor="middle">5</text>
    <text x="512" y="38" text-anchor="middle">6</text>
    <rect x="60" y="44" width="64" height="24" rx="4" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="92" y="60" text-anchor="middle">1</text>
    <rect x="130" y="44" width="64" height="24" rx="4" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="162" y="60" text-anchor="middle">2</text>
    <rect x="200" y="44" width="64" height="24" rx="4" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="232" y="60" text-anchor="middle">4</text>
    <rect x="270" y="44" width="64" height="24" rx="4" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="302" y="60" text-anchor="middle">6</text>
    <rect x="340" y="44" width="64" height="24" rx="4" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="372" y="60" text-anchor="middle">8</text>
    <rect x="410" y="44" width="64" height="24" rx="4" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="442" y="60" text-anchor="middle">11</text>
    <rect x="480" y="44" width="64" height="24" rx="4" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="512" y="60" text-anchor="middle">15</text>
    <text x="556" y="60" fill="#33465e">必须有序</text>

    <text x="8" y="86">第 1 步</text>
    <text x="92" y="86" fill="#00599c" font-weight="700">lo</text><text x="512" y="86" fill="#b8500f" font-weight="700">hi</text>
    <rect x="60" y="90" width="484" height="18" rx="5" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/>
    <text x="302" y="103" text-anchor="middle">1 + 15 = 16 和大 —— 压右，一步废掉 1 配左边六格</text>

    <text x="8" y="124">第 2 步</text>
    <text x="92" y="124" fill="#00599c" font-weight="700">lo</text><text x="442" y="124" fill="#b8500f" font-weight="700">hi</text>
    <rect x="60" y="128" width="414" height="18" rx="5" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/>
    <text x="267" y="141" text-anchor="middle">1 + 11 = 12 和大 —— 再压右</text>

    <text x="8" y="162">第 3 步</text>
    <text x="92" y="162" fill="#00599c" font-weight="700">lo</text><text x="372" y="162" fill="#b8500f" font-weight="700">hi</text>
    <rect x="60" y="166" width="344" height="18" rx="5" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/>
    <text x="232" y="179" text-anchor="middle">1 + 8 = 9 和小 —— 抬左</text>

    <text x="8" y="200">第 4 步</text>
    <text x="162" y="200" fill="#00599c" font-weight="700">lo</text><text x="372" y="200" fill="#1d7a3c" font-weight="700">hi</text>
    <rect x="130" y="204" width="274" height="18" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/>
    <text x="267" y="217" text-anchor="middle">2 + 8 = 10 命中，停</text>

    <text x="16" y="248" fill="#00599c" font-weight="700">窗口每步至少短一格，所以七个数最多走 6 步 —— 实测 target=100 走满 6 步答没有。</text>
    <text x="16" y="268" fill="#33465e">同一个 target 换成双重循环：试到命中要 9 对。换成 100：把 21 对全试完才敢说没有。</text>
    <text x="16" y="288" fill="#b8500f">每一步动的都是下标，不是数值；两只手永远不会倒退。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `双指针买到的是一步砍掉一整行。实测一万两千个数、答案不存在时，双重循环要把 71994000 对试完，双指针最多 11999 步 —— 差六个数量级。而它的本钱全押在「有序」上：拿打乱的数据硬跑，那句「配不上最大值就配不上左边任何人」当场失效，演示 4 实测有 11 个 target 判错。` },
        { t: `p`, text: `跟第 155 课那条路对照：对每个 lo 用第 106 课的 lower_bound 去查 target 减掉它的差值，总代价是 n log n，也远好过 n 的平方。双指针把查和排除合进同一趟，只用 n 步，代价是必须先排序，总账 n log n 加 n 与二分同量级 —— 但代码短得多，而且不用在外层再挂一个循环。` },
        { t: `h2`, text: `演示 1 · 源稿这段：七个有序数里凑 10` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
int main() {
    std::vector<int> v = {1, 2, 4, 6, 8, 11, 15};      // 必须有序
    int target = 10;
    int lo = 0, hi = static_cast<int>(v.size()) - 1;    // 两个下标站在两头
    bool found = false;
    while (lo < hi) {
        int sum = v[lo] + v[hi];
        if (sum == target) { found = true; break; }
        if (sum < target) ++lo;  else --hi;             // 和小抬左，和大压右
    }
    if (found) std::println("找到：{} + {} = {}", v[lo], v[hi], target); else std::println("没有两个数能凑出 {}", target);
}` },
        { t: `p`, text: `实测输出 找到：2 + 8 = 10，一共走了 4 步：1 加 15 得 16 和大、压右；1 加 11 得 12 还是和大、再压右；1 加 8 得 9 和小、抬左；2 加 8 得 10 命中。全程没有回头，两只手一格一格往里收 —— 上面那张图画的就是这四步。` },
        { t: `h2`, text: `演示 2 · 本课任务：target 换成 100 和 6` },
        { t: `code`, lang: `c++`, code: `// 在演示 1 的 while 循环里添两行，把每一步打出来，其余不动；循环外声明 int steps = 0;
        ++steps;
        std::println("第 {} 步 lo={} 值 {}，hi={} 值 {}，和 {}", steps, lo, v[lo], hi, v[hi], sum);` },
        { t: `p`, text: `实测两组走位正好对称。target=100：和一路都小，lo 一格一格往右爬，六步之后撞上 hi，判据 lo < hi 一假就退出，打印 没有两个数能凑出 100 —— 这六步同时也是证明不存在的六步。target=6：前四步 1+15、1+11、1+8、1+6 全是大，hi 一路压到下标 3；第五步 1+4 得 5 才终于和小、抬左；第六步 2+4 命中，退出时 lo=1、hi=2，两只手正好并排。源稿特意挑 6，就是让它落在中间。` },
        { t: `h2`, text: `演示 3 · 对拍：跟双重循环比次数` },
        { t: `code`, lang: `text`, code: `同一个数组、同一个 target，两遍实测：
target = 10　　双指针 4 步命中 2 + 8　　双重循环试到命中要 9 对
target = 6　　双指针 6 步命中 2 + 4　　双重循环试到命中要 7 对
target = 100　双指针 6 步说没有　　　　双重循环把 21 对全试完才说没有` },
        { t: `p`, text: `我把 target 从 1 换到 30 全跑一遍，两种办法对有没有的判断 30 个全一致；再拿 2000 个随机数配 200 个随机 target 对拍，判据一致 200 个、不一致 0 个，总次数是双指针 197190 步对双重循环 8909358 对 —— 差 45 倍。也别把它说成每一步都省：target=5 那一组，双重循环第 2 对就撞上 1+4，双指针却走了 5 步。它省下的是最坏情况。` },
        { t: `h2`, text: `演示 4 · 前提：必须先排好序，以及下标会被洗掉` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <algorithm>
#include <utility>
int main() {
    std::vector<int> v = {8, 1, 11, 4, 15, 2, 6};          // 打乱的一串
    std::vector<std::pair<int, int>> keep;                 // 值配上原来的位次
    for (int i = 0; i < static_cast<int>(v.size()); ++i) keep.push_back({v[i], i});
    std::sort(keep.begin(), keep.end(),
              [](const auto& a, const auto& b) { return a.first < b.first; });
    std::print("排完：");
    for (const auto& [val, at] : keep) std::print("{}(原下标 {}) ", val, at);
    std::println("");
}` },
        { t: `p`, text: `实测两件事。第一件：把这串打乱的数据直接交给双指针，再拿双重循环当标准答案核对 target 从 1 到 26 的每一种问法，有 11 个 target 判错 —— 3、5、6、7、8、12、15、16、19、23、26 明明凑得成，双指针却一口咬定没有。推理一句都没变，变的是那句前提。第二件：排序把原来的下标洗掉了，上面这段把位次跟值一起打包带走，用的是第 104 课的 pair 与结构化绑定，实测打印出 1(原下标 1)、2(原下标 5)、8(原下标 0) —— 值还是那七个值，位置全变了。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `数组没排序就上双指针。实测打乱那串有 11 个 target 判错，而且不报错也不崩，只是安静地答一句没有。要么先 std::sort，要么就老实写双重循环。`,
          `判据写成 lo <= hi。找两个不同的数必须是 lo < hi：实测 target=4 时那组数里只有一个 2，两只手停在同一格，程序照样报命中 2 + 2 —— 同一个元素被用了两次。`,
          `光打印 v[lo] 与 v[hi]，不判那个 found。实测 target=100 走完六步退出时 lo 和 hi 都是 6，不看 found 直接打印，就得到 15 + 15 = 100 这种漂亮的假答案。`,
          `hi 的初值写 v.size() - 1 又不转类型。size() 是无符号数，空容器上它绕回 18446744073709551615 —— 第 151 课数过这个数。照源稿先 static_cast 成 int 再减一，或者开头判 v.size() 小于 2 就返回。`,
          `以为它能把所有对都数出来。实测 target=10 在这组数里有 2+8 和 4+6 两对，双指针找到第一对就收手；要一共几对，得改成命中之后不退出、两头一起往里走。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `源稿这条：target 改成 100 和 6（6=2+4 在中间），观察指针怎么走。照演示 2 把每步的 lo、hi 与和打出来，各数一遍走了几步，再说出哪一组是一路和小、哪一组是一路和大。`,
          `把数组打乱、不排序再跑一遍，拿双重循环当标准答案核对 target 从 1 到 26，把判错的那些 target 全列出来。`,
          `给两种办法各加一个计数器，对同一批数据、同一个 target 把次数打印出来比一比，并说出双重循环在哪一种 target 上反而更快。`,
          `延伸：把命中即退出改成命中之后 lo 与 hi 各往里走一格继续夹，看 target=10 能不能把 2+8 和 4+6 两对都挖出来。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：双指针的全部本钱是「有序」二字 —— 一步排除一整列，所以最多 n-1 步就夹完，实测 2000 个数配 200 个 target 时它 197190 步、双重循环 8909358 对；而判据 lo < hi 和 found 那个 bool，一处都省不得。` }
      ]
    }
  ]
};
