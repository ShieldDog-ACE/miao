/* 喵站 · C++ 掌握 正文分部 p25：第 161–162 课（第九轮）
 *
 * 源稿：161_三数之和为零.cpp、162_滑动窗口最长不重复段.cpp
 * 161 是第 160 课那双指针的第二个用法：三个数没法两头收，先固定一个、剩下两个再收。
 * 162 是滑动窗口第一次登场：右端只管吃，左端只管吐，谁都不回头。
 * 所有输出、判定次数、指针步数、重复组数均经本机 g++ -std=c++23 实跑核对。
 */
window.MIAO_CPPM_P25 = {
  chapters: [
    {
      id: `m161`, title: `第 161 课 · 三数之和为零：固定一个数，剩下的交给上一课那双指针`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把第 160 课那双指针从「找两个数」升级成「先固定一个、再找两个」，说清排序在这里买到了什么、两处「跳过重复」各自拦住哪一种重复，并把打印组数、内层判定次数、被跳过的 i 个数亲手数出来。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课找的是两个数：排好序以后左手贴最左、右手贴最右，看一眼和，偏小左手进、偏大右手退，一路对撞。今天要多用**三个**数，手上只有两个指针，怎么都不够分 —— 这是本课真正要解决的问题，不是「再加一层循环」那么轻描淡写。` },
        { t: `p`, text: `办法是**降一维**：三个自由度砍成一个。把第一个数 v[i] 钉死，剩下的任务就变成「在 i 右边那一段里找两个数，凑出 -v[i]」，这正是第 160 课那道题，一个字都不用改。所以本课的形状是**外面一个 for 固定、里面一对指针收口**，一共三层，每层各司其职。` },
        { t: `code`, lang: `text`, code: `第 1 层 排序     -4  -1  -1   0   1   2      ← 排好以后「偏小就左手进」才成立
第 2 层 固定 i    i = 1，v[i] = -1             ← 三个自由度当场砍成一个
第 3 层 两头收    lo = 2 ──►   ◄── hi = 5      ← 目标不再是 0，而是 -v[i] = 1` },
        { t: `p`, text: `为什么必须先排序？因为那双指针的全部推理是**单调性**：左手往右只会让和变大，右手往左只会让和变小。没排过的数组上这两句话都不成立，指针一收就把答案漏掉了。排一次是第 105 课那句 std::sort，实测六个数不到一微秒，换来后面每个 i 只走一趟线性收口。` },
        { t: `p`, text: `然后是重复。这组数据 {-1, 0, 1, 2, -1, -4} 排好是 -4 -1 -1 0 1 2，**两个 -1 挨在一起**，这正是源稿要教的东西：答案「-1、0、1」用第一个 -1 能找到，用第二个 -1 还能找到同一组。源稿写了**两处**跳重复，管的不是同一件事 —— 一处跳 i，实测这一跑跳掉 1 次；一处跳 lo 与 hi，命中以后把并排的相同值一起收掉。我把两处都注释掉跑了一遍：**打出 3 行，其中「-1 + 0 + 1 = 0」出现了两次**；留着跳重复就只剩 2 行。` },
        { t: `svg`, caption: `三层结构一张图：排序把数组变成单调的，for 把第一个数钉死，剩下的那段交给 lo 与 hi 对撞。图里的下标、和值、判定次数全部来自本机实跑的逐次打印`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 336">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">固定 i = 1 那一趟：v[i] = -1，目标 -v[i] = 1</text>
  <g font-size="12" fill="#26405a">
    <text x="16" y="52" font-weight="700">第 1 层 排序</text>
    <rect x="150" y="32" width="66" height="30" rx="5" fill="#eef2f8" stroke="#57677c" stroke-width="1.5"/><text x="183" y="52" text-anchor="middle">-4</text>
    <rect x="218" y="32" width="66" height="30" rx="5" fill="#e8eef8" stroke="#00599c" stroke-width="2"/><text x="251" y="52" text-anchor="middle" fill="#00599c">-1</text>
    <rect x="286" y="32" width="66" height="30" rx="5" fill="#fdece1" stroke="#b8500f" stroke-width="2"/><text x="319" y="52" text-anchor="middle" fill="#b8500f">-1</text>
    <rect x="354" y="32" width="66" height="30" rx="5" fill="#eef2f8" stroke="#57677c" stroke-width="1.5"/><text x="387" y="52" text-anchor="middle">0</text>
    <rect x="422" y="32" width="66" height="30" rx="5" fill="#eef2f8" stroke="#57677c" stroke-width="1.5"/><text x="455" y="52" text-anchor="middle">1</text>
    <rect x="490" y="32" width="66" height="30" rx="5" fill="#eef2f8" stroke="#57677c" stroke-width="1.5"/><text x="523" y="52" text-anchor="middle">2</text>
    <text x="150" y="76" fill="#8b98ab">0</text><text x="218" y="76" fill="#8b98ab">1</text><text x="286" y="76" fill="#8b98ab">2</text><text x="354" y="76" fill="#8b98ab">3</text><text x="422" y="76" fill="#8b98ab">4</text><text x="490" y="76" fill="#8b98ab">5</text>
    <text x="16" y="112" font-weight="700">第 2 层 固定</text>
    <text x="150" y="112">i = 1 钉死 v[i] = -1，i = 2 那个 -1 被跳过 —— 实测跳掉 1 次</text>
    <text x="16" y="146" font-weight="700">第 3 层 收口</text>
    <path d="M319 130 L319 158" stroke="#b8500f" stroke-width="2"/><polygon points="319,166 313,154 325,154" fill="#b8500f"/>
    <text x="332" y="150" fill="#b8500f">同一个值不该再当一次第一个数</text>
    <rect x="286" y="172" width="66" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="319" y="192" text-anchor="middle" fill="#1d7a3c">lo 2</text>
    <rect x="490" y="172" width="66" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="523" y="192" text-anchor="middle" fill="#1d7a3c">hi 5</text>
    <text x="16" y="222">第 1 步：-1 + -1 + 2 = 0 → 命中，打印第一组，两只手一起往里走</text>
    <text x="16" y="246">第 2 步：lo = 3、hi = 4，-1 + 0 + 1 = 0 → 命中，打印第二组</text>
    <text x="16" y="270">第 3 步：lo = 4、hi = 3，交叉了，while 的 lo &lt; hi 不成立 —— 这一趟收手</text>
    <text x="16" y="298" fill="#00599c" font-weight="700">全程实测：内层判定 7 次、打印 2 组；lo 一共走了 6 步、hi 走了 3 步，两只手加起来不到 2n。</text>
    <text x="16" y="320" fill="#b8500f">把两处跳重复都注释掉，同样这组数据打出 3 行：-1 + 0 + 1 = 0 那一行出现了两次。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `这套「排序 + 固定 + 双指针」的设计目标只有一个：**把三层循环砍成两层**。三重循环要枚举每一个三元组，六个数是 20 个组合、八个数是 56 个；本课后每个 i 只跑一趟线性收口，实测六个数**内层只判了 7 次**。省下来的不是常数，是「n 的三次方变成 n 的平方」这一整级。` },
        { t: `p`, text: `跳重复那两句也有讲究：判断写成 v[i] == v[i - 1] 并带 i > 0 的守卫，意思是**留第一个、跳后面的** —— 每组答案只由最小的那个下标生产一次。改成往前看 v[i] == v[i + 1] 就得连最后一格一起跳掉，而外层上界只有 n - 2，这个守卫很容易写歪，做变形题时立刻翻车。` },
        { t: `h2`, text: `演示 1 · 源稿这段：三层结构各就各位` },
        { t: `code`, lang: `c++`, code: `std::vector<int> v = {-1, 0, 1, 2, -1, -4};
std::sort(v.begin(), v.end());                  // 第一步：排序，头文件请 <print> <vector> <algorithm>
int n = static_cast<int>(v.size());             // size() 是无符号，先转 int 再做减法
for (int i = 0; i < n - 2; ++i) {               // 第二步：固定第一个数，只剩两个数要凑
    if (i > 0 && v[i] == v[i - 1]) continue;    // 同一个值不当两次第一个数
    int lo = i + 1, hi = n - 1;                 // 第三步：i 右边那段，两头各一只手
    while (lo < hi) {
        int s = v[i] + v[lo] + v[hi];
        if (s == 0) {
            std::println("{} + {} + {} = 0", v[i], v[lo], v[hi]);
            ++lo; --hi;                         // 命中：两只手一起往里，别停在原地
        } else if (s < 0) ++lo; else --hi;      // 偏小左手进，偏大右手退
    }
}` },
        { t: `p`, text: `实跑输出两行：-1 + -1 + 2 = 0、-1 + 0 + 1 = 0。注意 lo 的起点是 **i + 1** 而不是 0 —— 它保证三个下标互不相同，也保证「每组答案只被生产一次」：i 从小到大走，lo 与 hi 永远在 i 右边，所以 (-1, -1, 2) 这组不会因为换了个顺序又被当成新的一组。` },
        { t: `h2`, text: `演示 2 · 本课任务：把两处跳重复注释掉` },
        { t: `code`, lang: `c++`, code: `if (s == 0) {
    std::println("{} + {} + {} = 0", v[i], v[lo], v[hi]);
    // while (lo < hi && v[lo] == v[lo + 1]) ++lo;   // 左手跳过并排的相同值
    // while (lo < hi && v[hi] == v[hi - 1]) --hi;   // 右手同理
    ++lo; --hi;                                       // 只留最朴素的一步往里
}` },
        { t: `code`, lang: `c++`, code: `for (int i = 0; i < n - 2; ++i) {
    // if (i > 0 && v[i] == v[i - 1]) continue;      // 这一处也注释掉
    int lo = i + 1, hi = n - 1;
    while (lo < hi) { /* 同上，跳重复两句注释掉 */ }
}` },
        { t: `p`, text: `实测三行：-1 + -1 + 2 = 0、-1 + 0 + 1 = 0、-1 + 0 + 1 = 0。**多出来的那行是 i = 2 那个 -1 干的** —— 它和 i = 1 是同一个值，右边那段却也装着 0 和 1，于是同一组答案被生产了两遍。换一组更挤的数据实测三种写法：{-2, -2, 0, 1, 1, 2, 2, 3} 上，两处都跳是 **2 组**，只跳 i 不跳 lo 与 hi 也是 **2 组**（这组的重复全在 i 上），两处都不跳是 **4 组**。所以那两句不是装饰：跳 i 管「第一个数重复上岗」，跳 lo 与 hi 管「命中之后同值的第二个、第三个还留在窗口里」。` },
        { t: `h2`, text: `演示 3 · 把答案收进容器：pair 记下两个下标` },
        { t: `code`, lang: `c++`, code: `std::vector<std::pair<int, int>> got;              // 第 46 课：两个值捆一起
// 命中那一段里改成：
got.push_back({lo, hi});                          // 记下是哪两个下标凑出来的
// 循环都走完以后，用第 47 课的结构化绑定拆开打印：
for (auto [a, b] : got) std::println("下标 {} 与 {}，值 {} 与 {}", a, b, v[a], v[b]);` },
        { t: `p`, text: `实测两组答案收下两条记录，打印是「下标 2 与 5，值 -1 与 2」和「下标 3 与 4，值 0 与 1」。为什么要收而不是当场打印：现场调试时你想知道**是谁凑出来的**，而不只是凑成了 0；而收进容器以后，去重这一步还可以换成「收之前查一下有没有见过」，思路比跳重复更通用 —— 那正是第 100 课 set 的用法。` },
        { t: `h2`, text: `演示 4 · 跟三重循环对账：省掉的到底是多少` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <algorithm>
int main() {
    std::vector<int> v = {-4, -1, -1, 0, 1, 2};   // 已经排好
    int checks = 0, hits = 0, n = static_cast<int>(v.size());
    for (int a = 0; a < n; ++a)
        for (int b = a + 1; b < n; ++b)
            for (int c = b + 1; c < n; ++c) {
                ++checks;                         // 每枚举一个三元组记一笔
                if (v[a] + v[b] + v[c] == 0) ++hits;
            }
    std::println("三重循环：判 {} 次，命中 {} 次", checks, hits);
}` },
        { t: `p`, text: `本机实测：六个数三重循环判 **20 次、命中 3 次**（同一组 -1、0、1 被两个不同的 -1 各凑出来一次，正是演示 2 那个重复），双指针版**内层只判 7 次、打印 2 组**。八个数那组更夸张：三重 **56 次判定、命中 6 行**，双指针全跳之后只剩 **2 组**。数字摆在这里，「先固定一个」这笔交易就说得清了。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `忘了排序就上双指针。指针收口的全部依据是单调性，乱序时 s 偏小并不保证左手进就能变大。实测四组同样数字的不同排法，不排序分别只命中 2 组、0 组、0 组、1 组，把同一批数排好再跑是 3 组 —— 少掉的不是重复，是答案本身，而且它一行错都不报。`,
          `lo 写成 0 而不是 i + 1，同一个格子会被用两次。实测这一跑打出 3 行，第一行 -1 + -1 + 2 = 0 里后面那个 -1 取的正是 i 自己那一格；第三行 0 + -1 + 1 = 0 又是同一组值换了个顺序，跳重复那两句也拦不住它 —— 因为重复是从下标重合来的，不是从值相邻来的。规矩：固定的那个在左边，两只手只在它右边活动。`,
          `上界写 i < n - 2 却拿 size() 直接减。size() 是无符号数，空容器上 n - 2 绕回天文数字，一路越界读内存 —— 第 151 课刚数过那个 18446744073709551615。先 static_cast 成 int 再减，或者开头判 v.size() < 3 就 return。`,
          `命中以后只动一只手，或者两只手都不动。while 条件一直成立，程序卡在这一趟里出不来 —— 实测就是回车以后什么都不打印。命中说明这两个值都已经被用掉了，lo 与 hi 必须一起往里。`,
          `跳重复那两句写成不带 lo < hi 守卫。v[lo + 1] 在 lo 已经是最后一格时就读出容器外面了，实测同样的数据上它不一定当场崩，可能安静地多吐一行或少吐一行。第 150 课把边界列为头号杀手，这里就是那个边界。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `注释掉两处「跳过重复」再跑，看看为什么会输出重复答案。跑完把行数、以及重复那一行是哪一个 i 打出来的写下来 —— 本机实测是 3 行、重复行来自 i = 2。`,
          `延伸一：把 lo 的起点从 i + 1 改成 0，跑一次，说出多出来的是哪些组合、为什么它们不在数组里。`,
          `延伸二：加两句提前收手 —— v[i] 已经大于 0 就 break（三个正数凑不出 0），v[i] + v[i + 1] + v[i + 2] 大于 0 也 break，v[i] + v[n - 2] + v[n - 1] 小于 0 就 continue。拿 {-4, -1, -1, 0, 1, 2} 数一下内层判定次数从 7 变成几次。`,
          `延伸三：把打印换成演示 3 那对 pair，再数一遍 got.size() 是不是 2 —— 顺手体会「先记下来再处理」比「当场打印」好在哪儿。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：三个数不是一层循环的事，是「先固定一个、剩下两个交给第 160 课那双指针」；排序买的是单调性，两处跳重复买的是「同一组答案只生产一次」，实测判定次数从三重的 20 次掉到 7 次。` }
      ]
    },
    {
      id: `m162`, title: `第 162 课 · 滑动窗口：右端只管吃，左端只管吐，谁都不回头`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把「窗口」这个工具第一次立起来 —— 右端一格一格吃进来，一旦窗内撞见重复，左端就一格一格吐出去，两只手都只往右走；用第 97 课的 map 数清窗内有没有重复，并把两手各走了几步、少了守卫会错在哪几个数上实测出来。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `题目要的是**一段连续的**字符里最长的那串「互不相同」。注意是子串不是子序列：中间断一格就不算，所以「挑哪些字符」这种枚举思路用不上。老实办法是把每一对起点终点都试一遍，八个字符的串就有 36 段，每段还得逐个字符查一遍有没有重复 —— 试过的段里绝大多数一眼看出去就废了，白算。` },
        { t: `p`, text: `窗口换掉的是「重来」这两个字。手里捏着一段 **[left, right]**，它随时保持一个规矩：**窗内没有重复**。right 往右吃一格，规矩可能破；破了就 left 往右吐，吐到规矩重新成立为止。全程只有两个动作，而且**两只手都只往右走，从不后退** —— 这就是它从 36 段降到 15 步的全部原因。` },
        { t: `code`, lang: `text`, code: `右扩 →   吃进一个字符，窗口宽一格，先不管合不合规：   a b c [a]   ← 窗内 a 成了 2 个
左缩 ←   吐掉最左边那个，窗口窄一格，直到不违规：   [a] b c a  →  b c a   ← a 回到 1 个，合规
量一把   只有合规的时候才量宽度：                 right - left + 1
两只手各自最多走 n 步：right 每轮 +1，left 只 +1 从不 --   → 总共不超过 2n` },
        { t: `p`, text: `「窗内有没有重复」这件事必须有个地方记着，所以需要一个**计数容器**：本课用第 97 课的 std::map，键是字符、值是「这个字符现在在窗里有几个」。吃进来就 ++，吐出去就 --，问一句窗里那个字符还有没有 2 个 —— 这就是全部。第 100 课的 set 在这儿也能用，因为窗口的规矩天生保证每个字符最多 1 个；但要记「几个」就必须回到 map 或者数组。` },
        { t: `svg`, caption: `一对相反方向的箭头就是滑动窗口的全部：右扩到违规、左缩到合规。图中每个 right、left、best 与窗口内容都来自本机实跑的逐格打印，输入 abcabcbb`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 348">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">输入 abcabcbb：right 从 0 走到 7，left 只往右，答案 3</text>
  <g font-size="12" fill="#26405a">
    <text x="16" y="52" font-weight="700">吃进 s[2]</text>
    <rect x="120" y="32" width="46" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="143" y="52" text-anchor="middle">a</text>
    <rect x="170" y="32" width="46" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="193" y="52" text-anchor="middle">b</text>
    <rect x="220" y="32" width="46" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="243" y="52" text-anchor="middle">c</text>
    <rect x="270" y="32" width="46" height="30" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="293" y="52" text-anchor="middle">a</text>
    <rect x="320" y="32" width="46" height="30" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="343" y="52" text-anchor="middle">b</text>
    <rect x="370" y="32" width="46" height="30" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="393" y="52" text-anchor="middle">c</text>
    <rect x="420" y="32" width="46" height="30" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="443" y="52" text-anchor="middle">b</text>
    <rect x="470" y="32" width="46" height="30" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="493" y="52" text-anchor="middle">b</text>
    <text x="16" y="78">left = 0　right = 2　窗口 abc　best = 3　合规，量一把</text>
    <path d="M243 66 L293 96" stroke="#00599c" stroke-width="2"/><polygon points="293,96 281,94 287,84" fill="#00599c"/>
    <text x="300" y="102" fill="#00599c">右扩：再吃一个 s[3] = a</text>

    <text x="16" y="136" font-weight="700">吃进 s[3]</text>
    <rect x="120" y="116" width="46" height="30" rx="5" fill="#fdece1" stroke="#b8500f" stroke-width="2"/><text x="143" y="136" text-anchor="middle" fill="#b8500f">a</text>
    <rect x="170" y="116" width="46" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="193" y="136" text-anchor="middle">b</text>
    <rect x="220" y="116" width="46" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="243" y="136" text-anchor="middle">c</text>
    <rect x="270" y="116" width="46" height="30" rx="5" fill="#fdece1" stroke="#b8500f" stroke-width="2"/><text x="293" y="136" text-anchor="middle" fill="#b8500f">a</text>
    <text x="330" y="136" fill="#b8500f">map 里 a 的计数从 1 变 2 —— 违规</text>
    <text x="16" y="166" fill="#b8500f">规矩破了：窗里有两个 a。此时不量宽度。</text>
    <path d="M150 150 L150 186" stroke="#b8500f" stroke-width="2"/><polygon points="150,192 144,180 156,180" fill="#b8500f"/>
    <text x="164" y="182" fill="#b8500f">左缩：吐掉最左边的 s[0]</text>

    <text x="16" y="232" font-weight="700">吐完再量</text>
    <rect x="170" y="212" width="46" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="193" y="232" text-anchor="middle">b</text>
    <rect x="220" y="212" width="46" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="243" y="232" text-anchor="middle">c</text>
    <rect x="270" y="212" width="46" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="293" y="232" text-anchor="middle">a</text>
    <text x="330" y="232">left = 1　right = 3　窗口 bca　best 仍是 3</text>
    <text x="16" y="270" fill="#00599c" font-weight="700">实测整条轨迹：left 依次是 0 0 0 1 2 3 5 7，best 从第 2 格起就定在 3；right 走 8 步、left 走 7 步，合计 15 步。</text>
    <text x="16" y="294">同一串换成「把 s[left] 的计数减掉」这句都不写：while 出不来，left 一路跑到 40 而串只有 5 格。</text>
    <text x="16" y="318" fill="#b8500f">把 left 的守卫 last[ch] &gt; left 去掉：abba 报 3、pwwkew 报 5，而 abcabcbb 与 bbbbb 照样对 —— 错一半最阴。</text>
    <text x="16" y="340" fill="#33465e">老实枚举每一段要试 36 段；窗口只用 15 步，靠的是两只手都不回头。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `这是这门课里**第三种双指针**，值得摆一摆：第 160 课两只手从两头对撞，区间一路变短；第 161 课一只手固定、另两只手对撞；本课两只手**同向**，间距就是窗口宽度。三种形态的共通点只有一个 —— 靠的是「指针不会往回走」所以总步数是线性的，区别只在往回走的那条路被谁堵住了。` },
        { t: `p`, text: `设计上的另一个讲究是**只在合规时量**。窗口的规矩是「里面没有重复」，一旦 right 吃进来破了规矩，这段宽度就是假的，必须等 left 吐够了再量。写反这个顺序的代价实测过：bbbbb 报 2、abcabcbb 报 4，两个数都虚高，而程序一声不响。` },
        { t: `h2`, text: `演示 1 · 计数容器版：吃进来、吐出去、量一把` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <map>
int main() {
    std::string s = "abcabcbb";
    std::map<char, int> cnt;                     // 窗内每个字符现在有几个
    int left = 0, best = 0;
    for (int right = 0; right < static_cast<int>(s.size()); ++right) {
        ++cnt[s[right]];                         // 右端吃进一个字符
        while (cnt[s[right]] > 1) { --cnt[s[left]]; ++left; }  // 撞了就从左端吐
        if (right - left + 1 > best) best = right - left + 1;  // 合规了才量宽度
    }
    std::println("最长不重复段 = {}", best);
}` },
        { t: `p`, text: `本机实测输出 3。这个 while 是滑动窗口的**招牌形状**：外层 for 只管推进 right，内层 while 负责把 left 追回到合规。注意 ++cnt[s[right]] 用的是 map 的下标写法，没见过这个字符时它先新建一个值为 0 的格子再加一 —— 第 98 课把这条列为陷阱，这里正好**明知故用**：我要的就是「没出现过也算 0」。吐的时候 --cnt[s[left]] 把计数真减回去，窗口才真的变小。` },
        { t: `h2`, text: `演示 2 · 本课任务：把 right、left、best 打成一张表` },
        { t: `code`, lang: `c++`, code: `// 接在演示 1 的循环里，把最后那句量宽度换成打印
        int w = right - left + 1;
        if (w > best) best = w;
        std::println("  {}     {}     {}     {}     {}", right, s[right], left, best, s.substr(left, w));` },
        { t: `code`, lang: `text`, code: `right 吃进 left best 窗口        ← 本机实跑，输入 abcabcbb
  0     a     0     1     a
  1     b     0     2     ab
  2     c     0     3     abc
  3     a     1     3     bca
  4     b     2     3     cab
  5     c     3     3     abc
  6     b     5     3     cb
  7     b     7     3     b` },
        { t: `p`, text: `源稿任务 2 要的那张纸就长这样，跑一遍对着核。三件事全在表里：**best 从第 2 格起就定在 3，之后再没动过**；left 那一列 0 0 0 1 2 3 5 7 一路单调往上，第 6 格一次跳两格是因为 c 和 b 都要吐；而 right 那一列就是 0 到 7，每格进一 —— 表里没有一次 --left、也没有一次 --right，这就是「不用回头重来」的凭证。` },
        { t: `h2`, text: `演示 3 · 本课任务一：换两组数据` },
        { t: `code`, lang: `c++`, code: `for (std::string s : {std::string("bbbbb"), std::string("pwwkew"), std::string("abba")}) {
    std::map<char, int> cnt;
    int left = 0, best = 0;
    for (int right = 0; right < static_cast<int>(s.size()); ++right) {
        ++cnt[s[right]];
        while (cnt[s[right]] > 1) { --cnt[s[left]]; ++left; }
        if (right - left + 1 > best) best = right - left + 1;
    }
    std::println("{} 最长不重复段 = {}", s, best);
}` },
        { t: `p`, text: `本机实测三行：bbbbb = **1**、pwwkew = **3**，跟源稿给的答案对上；abba = **2**，我特意加它是因为它是演示 4 那个守卫的照妖镜 —— 后面会看到把它写错就报 3。` },
        { t: `h2`, text: `演示 4 · 源稿那份：128 张格子表，左端一步跳过去` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <algorithm>
int main() {
    std::string s = "abcabcbb";
    int last[128] = {};                          // 每个字符「上次出现的位置 + 1」
    int best = 0, left = 0;
    for (int right = 0; right < static_cast<int>(s.size()); ++right) {
        unsigned char ch = s[right];             // 下标必须非负：char 可能是带符号的
        if (last[ch] > left) left = last[ch];    // 撞见旧的 → 左端一步跳过去
        last[ch] = right + 1; best = std::max(best, right - left + 1);
    }
    std::println("\"{}\" 最长不重复子串长度 = {}", s, best);
}` },
        { t: `p`, text: `实测输出同样是 3，但它把「一格一格吐」换成了「一步跳过去」：既然那个字符上次站在哪我都记着，left 直接跳到它后面就行，省掉中间的吐。代价是**守卫不能少**。把 if 那句改成无条件 left = last[ch]，本机实测 abba 报 **3**、pwwkew 报 **5**（正确答案是 2 与 3），而 abcabcbb 和 bbbbb 照样对 —— 因为这两串里不会出现「上次的位置已经在 left 左边」的情况。abba 走到最后一个 a 时，那个 a 早就被 left 吐在窗外了，还拿它往左拽，窗口就倒着变宽。另一处讲究是那句 unsigned char：实测一个带重音的字符的字节按 char 读出来是 **-61**、按 unsigned char 读是 **195**，前者直接跑出那 128 张格子，把栈上别的变量当计数表用。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `吐字符只挪 left 不减计数。内层写成 while 里 ++left 而没有 --cnt[s[left]]，窗口的账永远平不掉：实测在 abcbd 上出不来那个 while，left 一路跑到 40 而字符串只有 5 格，程序挂住不返回；给它加一根保险丝，best 靠运气凑成 3。`,
          `量宽度的时机放错。把 best 那句挪到 while 之前，实测 bbbbb 得 2、abcabcbb 得 4 —— 报的都是「带着重复的宽度」，比正确值 1 与 3 都大。顺序只有一个：先吐到合规，再量。`,
          `格子表的下标不转 unsigned char。实测带重音的字节按 char 读是 -61，last[-61] 落在哪没人知道，结果可能是答案错、可能是当场段错误，也可能什么都没错只是这次运气好。源稿那行 unsigned char 是保命的一句。`,
          `map 用 find 或 count 先查一遍再读，生怕它凭空造格子。第 98 课那条陷阱讲的是顺手写 cnt[c] 会给没见过的键新建一个值为 0 的格子，可本课恰恰要利用它：++ 之前那个格子不存在、当成 0，正是想要的语义。真不想让 map 造格子就照第 97、98 两课的查法先问一遍，别一半一半。`,
          `把窗口的规矩弄丢了：改了 left 之后没保证「窗内仍然没有重复」就继续往下走。本课 left 只 +1、从不 --，任何让你往回撤 left 的「聪明改法」都会把线性变成平方 —— 上一课那种两头对撞的写法在这里不适用，因为 right 一直在往前走。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `换 bbbbb 和 pwwkew 试试，答案应是 1 和 3。跑完多说一句：这两串里 left 各走了几步？本机实测 bbbbb 是 4 步、pwwkew 是 3 步。`,
          `在纸上画 right、left、best 三行表，跟一遍 abcabcbb 的移动。照演示 2 那张表核对自己的答案，然后回答：best 是在第几格定下来的，之后为什么没再变过。`,
          `延伸一：把演示 4 那句守卫去掉，跑 abba 与 pwwkew，把两个错数报出来，并说清「上次的位置为什么可能已经在窗口左边了」。`,
          `延伸二：给演示 1 加两个计数器，数出 right 与 left 各自走了几步，验证「两只手各自不超过 n 步」这句；再数一下老实枚举每一段要试多少段（八个字符是 36 段）。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：滑动窗口只有两个动作 —— 右扩到违规、左缩到合规，只在合规时量宽度；窗内有没有重复靠一个计数容器记着，而 O(n) 这笔账全押在「两只手都不往回走」上，实测八个字符只走 15 步。` }
      ]
    }
  ]
};
