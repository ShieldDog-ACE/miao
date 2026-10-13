/* 喵站 · C++ 掌握 正文分部 p30：第 175–178 课（第九轮）
 *
 * 源稿：175_最大子数组和.cpp、176_0-1背包.cpp、177_完全背包零钱兑换.cpp、178_最长公共子序列.cpp
 * 这四课是线性 DP 的四个台阶：一维扫描、一维背包、可以重复拿的背包、二维双串。
 * 所有输出、每步 cur、dp 表逐行数值、错版差值均经本机 g++ -std=c++23 实跑核对。
 */
window.MIAO_CPPM_P30 = {
  chapters: [
    {
      id: `m175`, title: `第 175 课 · 最大子数组和：一边扫一边维护「以当前数结尾的最优」`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：在九个数的数组上只扫一遍，每个数只纠结一件事 —— 是接上前面的队伍，还是自己另起一队 —— 把「必须以当前数结尾的最大和」一路传下去，随手记下历史最高，最后报出 6，并把全是负数的情形也跑对。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `先看清这道题难在哪。一段子数组是数组里**连续**的一截，可能的开头有 9 种、结尾也有 9 种，老实枚举所有开头结尾再逐段求和，是九九八十一个段、每段还要再花时间加一遍。要快，就得找到一种「只看眼前」的拆法，而这一课的关键就是那个词：**以当前数结尾**。` },
        { t: `p`, text: `把问题拆成一串小问题：以第 0 个数结尾的最大和、以第 1 个数结尾的最大和……一路问到以第 8 个数结尾的最大和。这九个小问题有一条链：**必须以 a[i] 结尾的和，只有两种来历** —— 要么它自己单独一队，从 a[i] 起头；要么接在「以 a[i-1] 结尾的最大和」后面，把 a[i] 挂上去。两种来历取大的那个，这一格就定了。整条链问完，其中最大的那格就是全场的答案，因为任何一段总得在某个位置结尾。` },
        { t: `p`, text: `为什么两种来历就够了？接着挂可能被前面的负数拖累 —— 前一支队伍背着一屁股债，接上去还不如单干；另起一队又可能错过好底子 —— 前面那支明明是正资产，扔了可惜。哪样大选哪样，就是那句 cur = std::max(a[i], cur + a[i])。这不是贪心碰运气：每一步的 cur 都是「以 a[i] 结尾」这件事的**精确最优**，一步都不糊弄，所以整条链合起来也是精确的。` },
        { t: `code`, lang: `text`, code: `a    -2    1   -3    4   -1    2    1   -5    4
cur  -2    1   -2    4    3    5    6    1    5   ← 以这个数结尾的最大和
best -2    1    1    4    4    5    6    6    6   ← 历史最高，只升不降
                                   ↑
                        答案 6 = 4 + (-1) + 2 + 1，在第 7 个数上诞生` },
        { t: `svg`, caption: `上排是数组 a 的九个数，下排是每一步的 cur，也就是以这个数结尾的最大和，数值全部本机实跑。带绿圈的四格是 best 被刷新的位置：i 等于 1 时换到 1、i 等于 3 时到 4、i 等于 5 时到 5、i 等于 6 时到 6。从第 8 格起 a 自己是 -5，cur 掉到 1，队伍缩水但 best 不回头；最后一步 a 是 4，cur 只回到 5，也盖不过 6`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250">
  <text x="18" y="20" font-size="13" font-weight="700" fill="#142639">每格只管「以我结尾」，best 负责记住全场最高</text>
  <g font-size="12" fill="#26405a">
    <text x="18" y="58" font-weight="700">a</text>
    <text x="18" y="112" font-weight="700">cur</text>
    <text x="18" y="166" font-weight="700">best</text>

    <rect x="60" y="36" width="56" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="88" y="56" text-anchor="middle">-2</text>
    <rect x="122" y="36" width="56" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="150" y="56" text-anchor="middle">1</text>
    <rect x="184" y="36" width="56" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="212" y="56" text-anchor="middle">-3</text>
    <rect x="246" y="36" width="56" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="274" y="56" text-anchor="middle">4</text>
    <rect x="308" y="36" width="56" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="336" y="56" text-anchor="middle">-1</text>
    <rect x="370" y="36" width="56" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="398" y="56" text-anchor="middle">2</text>
    <rect x="432" y="36" width="56" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="460" y="56" text-anchor="middle">1</text>
    <rect x="494" y="36" width="56" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="522" y="56" text-anchor="middle">-5</text>
    <rect x="556" y="36" width="56" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="584" y="56" text-anchor="middle">4</text>

    <rect x="60" y="90" width="56" height="30" rx="5" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1.5"/><text x="88" y="110" text-anchor="middle">-2</text>
    <rect x="122" y="90" width="56" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="150" y="110" text-anchor="middle" fill="#1d7a3c" font-weight="700">1</text>
    <circle cx="150" cy="82" r="9" fill="none" stroke="#1d7a3c" stroke-width="1.5"/>
    <rect x="184" y="90" width="56" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="212" y="110" text-anchor="middle">-2</text>
    <rect x="246" y="90" width="56" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="274" y="110" text-anchor="middle" fill="#1d7a3c" font-weight="700">4</text>
    <circle cx="274" cy="82" r="9" fill="none" stroke="#1d7a3c" stroke-width="1.5"/>
    <rect x="308" y="90" width="56" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="336" y="110" text-anchor="middle">3</text>
    <rect x="370" y="90" width="56" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="398" y="110" text-anchor="middle" fill="#1d7a3c" font-weight="700">5</text>
    <circle cx="398" cy="82" r="9" fill="none" stroke="#1d7a3c" stroke-width="1.5"/>
    <rect x="432" y="90" width="56" height="30" rx="5" fill="#e8f1fb" stroke="#00599c" stroke-width="2"/><text x="460" y="110" text-anchor="middle" fill="#00599c" font-weight="700">6</text>
    <circle cx="460" cy="82" r="9" fill="none" stroke="#1d7a3c" stroke-width="1.5"/>
    <rect x="494" y="90" width="56" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="522" y="110" text-anchor="middle">1</text>
    <rect x="556" y="90" width="56" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="584" y="110" text-anchor="middle">5</text>

    <rect x="60" y="144" width="56" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="88" y="164" text-anchor="middle">-2</text>
    <rect x="122" y="144" width="56" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="150" y="164" text-anchor="middle">1</text>
    <rect x="184" y="144" width="56" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="212" y="164" text-anchor="middle">1</text>
    <rect x="246" y="144" width="56" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="274" y="164" text-anchor="middle">4</text>
    <rect x="308" y="144" width="56" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="336" y="164" text-anchor="middle">4</text>
    <rect x="370" y="144" width="56" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="398" y="164" text-anchor="middle">5</text>
    <rect x="432" y="144" width="56" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="460" y="164" text-anchor="middle" fill="#1d7a3c" font-weight="700">6</text>
    <rect x="494" y="144" width="56" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="522" y="164" text-anchor="middle">6</text>
    <rect x="556" y="144" width="56" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="584" y="164" text-anchor="middle">6</text>

    <text x="18" y="204" fill="#33465e">i 等于 2 那步：接上得 -2、另起是 -3，取 -2 —— 负的 a[i - 1] 把队伍拖瘦了，但好歹比单干强。</text>
    <text x="18" y="224" fill="#b8500f">i 等于 7 那步 a 是 -5，cur 从 6 掉到 1；best 不跟着掉 —— 它只记历史最高，从不回退。</text>
    <text x="18" y="244" fill="#00599c" font-weight="700">一趟扫完，九个小问题各答一次，全场答案就藏在 best 里。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `这份设计是一台**一次成型的流水线**：数组从头扫到尾，每个数进门时只做一次比较、一次加法，出门时历史最高已经更新完。它不需要第二遍扫描，也不需要任何额外表格 —— 两个变量 cur 和 best 就是全部家当。这跟第 164 课的前缀和是同一个家族的活法：数据只进来一次，答案在路过时顺手就攒出来了。` },
        { t: `p`, text: `它换来的东西叫线性时间：数组翻一倍长，时间只翻一倍。而它守住的边界也在这两个变量里 —— cur 管「现在这支队伍」，best 管「所有队伍里最强的那支」。少了 best，你只知道以每个数结尾的最优，却答不出「整段里哪一段最强」；少了 cur 的「必须以我结尾」这个死规定，best 就会提前偷看未来。两个变量各守一半，谁也不能省。` },
        { t: `h2`, text: `演示 1 · 源稿那段：一边扫一边记历史最高` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <algorithm>
int main() {
    std::vector<int> a = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    long long cur = a[0], best = a[0];    // cur = "必须以当前数结尾"的最大和
    for (int i = 1; i < (int)a.size(); ++i) {
        cur = std::max((long long)a[i], cur + a[i]);  // 另起一队 vs 接着排
        if (cur > best) best = cur;       // 随手记下历史最高
    }
    std::println("最大子数组和 = {}", best);   // 4 + (-1) + 2 + 1 = 6
    return 0;
}` },
        { t: `p`, text: `实测打印一行：最大子数组和 = 6。这一段就是 4 加 -1 加 2 加 1，对应 cur 在 i 等于 6 时到达的那个 6。注意 if 那句的位置：它写在 cur 更新之后，所以 best 不会漏掉每一个新队伍；要是把它挪到循环外只看最终的 cur，答案会错成 5 —— 最后一步的 cur 只是「以最后一个数结尾」的成绩，不是全场最高。` },
        { t: `h2`, text: `演示 2 · 本课任务一：把每步的 cur 打出来，看队伍怎么换人` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <algorithm>
int main() {
    std::vector<int> a = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    long long cur = a[0], best = a[0];
    std::println("i=0 cur={} best={}", cur, best);
    for (int i = 1; i < (int)a.size(); ++i) {
        long long keep = cur + a[i], fresh = (long long)a[i];
        cur = std::max(fresh, keep);
        if (cur > best) best = cur;
        std::println("i={} a={} 接={} 另起={} cur={} best={}", i, a[i], keep, fresh, cur, best);
    }
}` },
        { t: `p`, text: `实测九行，挑换人最凶的四步看。i 等于 1：接上得 -1、另起是 1，选了另起 —— 前面那个 -2 是负资产，甩掉。i 等于 2：接上得 -2、另起是 -3，两个都难看，但接着排还是强一点，选了接。i 等于 3：a 自己是 4，接上只有 2，另起 —— 新队伍从 4 起步，这一队最后长成 6。i 等于 6：接上正好 6，best 同步刷到 6，此后再没被超过。` },
        { t: `h2`, text: `演示 3 · 本课任务二：全是负数，答案是多少、为什么 cur 从 a[0] 起步` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <algorithm>
int main() {
    std::vector<int> b = {-5, -2, -8};   long long cur = b[0], best = b[0];
    for (int i = 1; i < 3; ++i) {
        cur = std::max((long long)b[i], cur + b[i]);
        if (cur > best) best = cur;
    }
    std::println("全负数组答案 = {}", best);
    long long cur0 = 0, best0 = 0;       // 错版：cur 从 0 起步，空段混进来
    for (int x : b) cur0 = std::max((long long)x, cur0 + x), best0 = std::max(best0, cur0);
    std::println("cur 从 0 起步的错版 = {}", best0);
}` },
        { t: `p`, text: `实测全负版打印 -2：三步的 cur 是 -5、-2、-8，best 停在 -2，也就是单拿 -2 那一个数 —— 每个数都是负的，队伍越长越亏，最优解干脆只站一个人。而 cur 从 0 起步的错版打印 0：0 不在数组里，却因为起步占了便宜一路当背景板，最后把一个不存在的空段当成了答案。**cur 从 a[0] 起步，就是把「空段不算答案」这条规矩焊死在起点上。**` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `cur 从 0 起步。全负数组 {-5, -2, -8} 上实测答 0，正确答案 -2 —— 0 是空段的和，可这道题要求至少拿一个数。认法：只要题目说「子数组非空」，起步就得用 a[0]，不是 0。`,
          `best 只在循环结束后取 cur。实测把 if 那句挪出循环，九个数这组答 5 而不是 6 —— 最后一步的 cur 是 5，可全场最高 6 早就出现过了。best 必须在 cur 每次更新之后立刻比一遍。`,
          `用 int 攒大数组的和。源稿用 long long 不是摆样子：十万个 100000 的段和是 10000000000，int 早就溢出成负数。本题每个 cur 都可能是一长段的和，容器装 long long、比较时把 a[i] 转上去，才稳。`,
          `把「子数组」当成「子序列」做。子序列可以挑着跳格，这题不行 —— 4 和 2 和 1 中间隔着 -1 也必须把 -1 一起吃进去。要是按子序列做，答案会是 4 加 2 加 1 加 4 等于 11，看着更大，题却答错了。`,
          `忘了 empty 的数组。源稿直接 cur = a[0]，数组要是空的，a[0] 就是越界读 —— operator[] 不查边界，崩不崩全看运气。自己写时先判 a.empty() 再动手，这行在源稿里省了，你抄作业时不能省。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `在循环里打印每步的 cur，看「队伍」怎么换人。演示 2 已给出带接、另起两列的完整版本，九步数值都在解读里，自己跑一遍对表。`,
          `全是负数的 {-5, -2, -8} 答案是多少？想想为什么 cur 从 a[0] 起步。实测答案是 -2，演示 3 还附了 cur 从 0 起步的错版对照，实测它答 0。`,
          `延伸：把 if (cur > best) best = cur 这句删掉，循环结束后用 std::max(best, cur) 补一次，看看哪几组数据答对、哪几组答错 —— 答案是只对「最优段恰好在末尾结尾」的数据碰巧对，比如 {-5, -2, 8}。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：把「最大子数组」拆成九个「以我结尾」的小问题，每个只用 max 接上或另起一次就定案，best 记住历史最高 —— 一趟扫描，线性时间收工。` }
      ]
    },
    {
      id: `m176`, title: `第 176 课 · 0-1 背包：一张一维表，每件物品来时整表升级一次`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：四件物品、容量 8 的背包，每件只有装或不装两条路，用一张一维 dp 表从右往左升级，报出最大价值 12；再把容量改成 7 验证 11；最后亲手把内层循环改成从小到大，看同一件物品被偷偷装两次时中间格子错成什么样。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `背包问题的舞台很简单：每件物品有自己的重量和价值，背包容量有限，每件物品**要么整件装进来、要么完全不碰** —— 没有切一半这回事，这就是名字里那个 0-1。要回答的问题是：容量给定时，怎么挑能让总价值最大。暴力做法是每件物品二选一，四件物品 16 种组合，四十件就是一万亿种 —— 得换一条聪明的路。` },
        { t: `p`, text: `聪明的路从定义一张表开始：dp[j] 表示**只用容量 j 能装出的最大价值**。来了一件新物品 i，就挨个容量问一句话：不装它，价值维持 dp[j] 原样；装它，腾出 w[i] 的地方给前一批货，价值是 dp[j - w[i]] + v[i]。两个数取大，这一格就升级完了。整张表过完最后一件物品，dp[W] 就是答案。` },
        { t: `p`, text: `整段话里藏着一个生死攸关的细节：dp[j - w[i]] 必须是**还没见过这件物品**的旧值，否则同一件东西会被装两次。正着走做不到 —— j 从小到大，轮到 j 时 dp[j - w[i]] 早被这一轮改过了；倒着走正好 —— j 从大到小，j 左边的格子一个都没动过，dp[j - w[i]] 永远是上一件物品时代的值。一句「内层倒着走」，背的就是 0-1 这两个字。` },
        { t: `code`, lang: `text`, code: `只过物品 1（重 2 价值 3），两种走法的一张表：
下标 j     0    1    2    3    4    5    6    7    8
正着走     0    0    3    3    6    6    9    9   12   ← dp[4]=6：装了两次！
倒着走     0    0    3    3    3    3    3    3    3   ← 一件就一件，谁也装不了第二回` },
        { t: `svg`, caption: `同一件物品、同一张表、两种走法。上排正着走：dp[4] 抄的是 dp[2] 加 3，可 dp[2] 三步前刚被这件物品自己改过，于是 2 公斤的东西在 4 公斤容量里被装了两回，dp[8] 一路虚涨到 12。下排倒着走：dp[4] 抄 dp[2] 时 dp[2] 还是旧值 0 加 3 等于 3，每格最多吃进这一件一次。两组数都是本机 g++ -std=c++23 实跑`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240">
  <text x="18" y="20" font-size="13" font-weight="700" fill="#142639">只过物品 1，重 2 价值 3：走的方向决定它装几次</text>
  <g font-size="12" fill="#26405a">
    <text x="18" y="56" font-weight="700">正着走</text>
    <text x="18" y="136" font-weight="700">倒着走</text>

    <rect x="90" y="34" width="52" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="116" y="54" text-anchor="middle">0</text>
    <rect x="148" y="34" width="52" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="174" y="54" text-anchor="middle">0</text>
    <rect x="206" y="34" width="52" height="30" rx="5" fill="#fbeee6" stroke="#b8500f" stroke-width="1.5"/><text x="232" y="54" text-anchor="middle" fill="#b8500f">3</text>
    <rect x="264" y="34" width="52" height="30" rx="5" fill="#fbeee6" stroke="#b8500f" stroke-width="1.5"/><text x="290" y="54" text-anchor="middle" fill="#b8500f">3</text>
    <rect x="322" y="34" width="52" height="30" rx="5" fill="#b8500f"/><text x="348" y="54" text-anchor="middle" fill="#ffffff" font-weight="700">6</text>
    <rect x="380" y="34" width="52" height="30" rx="5" fill="#fbeee6" stroke="#b8500f" stroke-width="1.5"/><text x="406" y="54" text-anchor="middle" fill="#b8500f">6</text>
    <rect x="438" y="34" width="52" height="30" rx="5" fill="#fbeee6" stroke="#b8500f" stroke-width="1.5"/><text x="464" y="54" text-anchor="middle" fill="#b8500f">9</text>
    <rect x="496" y="34" width="52" height="30" rx="5" fill="#fbeee6" stroke="#b8500f" stroke-width="1.5"/><text x="522" y="54" text-anchor="middle" fill="#b8500f">9</text>
    <rect x="554" y="34" width="52" height="30" rx="5" fill="#fbeee6" stroke="#b8500f" stroke-width="1.5"/><text x="580" y="54" text-anchor="middle" fill="#b8500f" font-weight="700">12</text>

    <line x1="348" y1="34" x2="232" y2="64" stroke="#b8500f" stroke-width="1.8"/>
    <text x="268" y="30" text-anchor="middle" fill="#b8500f">dp[4] 抄 dp[2]，可 dp[2] 刚被自己改过</text>

    <rect x="90" y="114" width="52" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="116" y="134" text-anchor="middle">0</text>
    <rect x="148" y="114" width="52" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="174" y="134" text-anchor="middle">0</text>
    <rect x="206" y="114" width="52" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="232" y="134" text-anchor="middle" fill="#1d7a3c">3</text>
    <rect x="264" y="114" width="52" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="290" y="134" text-anchor="middle" fill="#1d7a3c">3</text>
    <rect x="322" y="114" width="52" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="348" y="134" text-anchor="middle" fill="#1d7a3c">3</text>
    <rect x="380" y="114" width="52" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="406" y="134" text-anchor="middle" fill="#1d7a3c">3</text>
    <rect x="438" y="114" width="52" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="464" y="134" text-anchor="middle" fill="#1d7a3c">3</text>
    <rect x="496" y="114" width="52" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="522" y="134" text-anchor="middle" fill="#1d7a3c">3</text>
    <rect x="554" y="114" width="52" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="580" y="134" text-anchor="middle" fill="#1d7a3c">3</text>

    <line x1="348" y1="114" x2="232" y2="144" stroke="#1d7a3c" stroke-width="1.8"/>
    <text x="300" y="110" text-anchor="middle" fill="#1d7a3c">dp[4] 抄 dp[2]，dp[2] 还是旧值，只装一次</text>

    <text x="18" y="180" fill="#33465e">方向一反，抄到的版本就不一样：正着走等于允许同一件反复拿，倒着走才守得住 0-1。</text>
    <text x="18" y="202" fill="#b8500f">这组数据里正着走 dp[8] 也是 12 —— 凑巧，中间格 dp[4] 已经从 3 错成了 6。</text>
    <text x="18" y="224" fill="#00599c" font-weight="700">下一课完全背包要的恰恰是「可以反复拿」，到时候方向再倒回来。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `这张表是**一维滚动数组**：最老实的写法开二维表 dp[i][j] 记「只看前 i 件物品、容量 j 的最大价值」，但你盯着公式看会发现第 i 行只抄第 i-1 行 —— 那就没必要存两行，一行够用，抄的时候管住方向别抄到自己就行。四件物品、九个容量，整个程序只用 9 个 int。省下的不只是内存，更是脑子：状态只剩一个下标 j。` },
        { t: `p`, text: `它也是**只答价值的账本**：表里只有「最多值多少钱」，没有「到底装了哪几件」。容量 8 的答案是 12，来自物品 2 加物品 4，可光看 dp 表推不出这句话 —— 要还原方案，得另开一个「记不记装」的表。这一课先不管方案，把「一维、倒着走、整表升级」这三个词焊牢，方案还原以后再讲。` },
        { t: `h2`, text: `演示 1 · 源稿那段：四件物品，倒着走升级四遍` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <algorithm>
int main() {
    std::vector<int> w = {2, 3, 4, 5}, v = {3, 4, 5, 8};  // 重量 / 价值
    int W = 8;
    std::vector<int> dp(W + 1, 0);        // dp[j] = 容量 j 的最大价值
    for (int i = 0; i < 4; ++i)
        for (int j = W; j >= w[i]; --j)   // 倒着走，保证每件只装一次
            dp[j] = std::max(dp[j], dp[j - w[i]] + v[i]);

    std::println("容量 {} 的背包最多装出价值 {}", W, dp[W]);
    return 0;
}` },
        { t: `p`, text: `实测打印：容量 8 的背包最多装出价值 12。最优组合是物品 2 加物品 4 —— 重量 3 加 5 正好压满 8，价值 4 加 8 等于 12。这个数源稿没写在注释里，是本机跑出来的；顺带一提，物品 1 加物品 2 加物品 3 价值也是 12，可重量要 9，装不下 —— 同分的组合里，表替你挑了装得进的那个。` },
        { t: `h2`, text: `演示 2 · 把每件物品装完后的整张表打出来` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <algorithm>
int main() {
    std::vector<int> w = {2, 3, 4, 5}, v = {3, 4, 5, 8};
    int W = 8;  std::vector<int> dp(W + 1, 0);
    for (int i = 0; i < 4; ++i) {
        for (int j = W; j >= w[i]; --j)
            dp[j] = std::max(dp[j], dp[j - w[i]] + v[i]);
        std::print("装完 i={} :", i);
        for (int j = 0; j <= W; ++j) std::print(" {}", dp[j]);
        std::println("");
    }
}` },
        { t: `p`, text: `实测四行：装完物品 1 是 0 0 3 3 3 3 3 3 3，容量 1 装不下 2 公斤的东西所以 dp[1] 还是 0，容量 2 起全停在最贵的单件 3。装完物品 2 是 0 0 3 4 4 7 7 7 7，容量 5 起 3 加 4 等于 7 冒头。装完物品 3 变 0 0 3 4 5 7 8 9 9。最后一件装完是 0 0 3 4 5 8 8 11 12 —— dp[8] 独占最高点，dp[7] 只有 11，正好就是演示 3 要验证的数。` },
        { t: `h2`, text: `演示 3 · 本课任务二：容量改成 7，答案该是 11` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <algorithm>
int main() {
    std::vector<int> w = {2, 3, 4, 5}, v = {3, 4, 5, 8};
    std::vector<int> dp(8, 0);            // 容量 7，开 8 格
    for (int i = 0; i < 4; ++i)
        for (int j = 7; j >= w[i]; --j)
            dp[j] = std::max(dp[j], dp[j - w[i]] + v[i]);
    std::println("容量 7 的背包最多装出价值 {}", dp[7]);
}` },
        { t: `p`, text: `实测打印：容量 7 的背包最多装出价值 11，和源稿任务给的对上了。11 来自物品 1 加物品 4 —— 重量 2 加 5 正好 7，价值 3 加 8 等于 11。有趣的对照是物品 2 加物品 4 价值 12 更高，可它要 8 公斤，容量 7 装不下 —— 这就是背包题的常态：最值钱的组合未必装得进，表替你把这笔账算得干干净净。` },
        { t: `h2`, text: `演示 4 · 本课任务一：内层改成正着走，看错成什么样` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <algorithm>
int main() {
    std::vector<int> w = {2, 3, 4, 5}, v = {3, 4, 5, 8};
    std::vector<int> bad(9, 0);
    for (int i = 0; i < 4; ++i)
        for (int j = w[i]; j <= 8; ++j)   // 正着走：错版
            bad[j] = std::max(bad[j], bad[j - w[i]] + v[i]);
    std::print("正着走的错版:");
    for (int j = 0; j <= 8; ++j) std::print(" {}", bad[j]);
    std::println("");
}` },
        { t: `p`, text: `实测错版是 0 0 3 4 6 8 9 11 12，跟正解一比：dp[4] 从 5 错成 6、dp[6] 从 8 错成 9 —— 中间格子先烂。根因在图里画过：正着走时 dp[j - w[i]] 是这一轮刚改过的新值，等于允许同一件反复装。**但要说一句公道话：这组数据 dp[8] 凑巧还是 12，源稿说「看看答案错成多少」，实测最终答案恰好没变，变的是中间格。** 想看最终答案也错，把容量改成 6 再跑：正解 8，错版 9 —— 物品 1 被装了三回。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `内层正着走。演示 4 实测：中间格 dp[4]、dp[6] 先错，极端数据下最终答案也虚高。认法：0-1 背包内层必须 for (int j = W; j >= w[i]; --j)，方向就是这道题的命。`,
          `dp 少开一格。容量 8 要开 9 格，dp[8] 才有地方住；只开 8 格的话最右那格根本不存在，读写 dp[W] 全凭 operator[] 不查边界的坏脾气。规矩：dp 开 W + 1 格。`,
          `j 的下界忘了卡在 w[i]。写成 j >= 0 时 dp[j - w[i]] 会拿负下标 —— j 小于 w[i] 时 j - w[i] 是负数，operator[] 不报错，读出来是垃圾。源稿那句 j >= w[i] 一石二鸟：既防负下标，又省掉装不下的空转。`,
          `价值表和重量表对错位。w 与 v 是按下标配对的，w[2] 对 v[2]；要是排序时只排了一个数组，账就全乱了。这两张表要么不动，要么搬 std::pair 绑在一起再排。`,
          `拿 size_t 当 j 用还往下减。j 从 W 往 0 走、类型又是无符号 size_t 时，j 减到负一那一瞬不会变 -1，而是绕回天文数字（第 151 课数过的那个），循环条件反而永远成立。下标参与减法的循环，一律用 int 并把 size() 转上去。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把内层循环改成从小到大，看看答案错成多少。演示 4 已实跑：中间格 dp[4] 从 5 错成 6、dp[6] 从 8 错成 9，dp[8] 这组数据凑巧还是 12 —— 把容量改成 6 就能看到最终答案也错成正解 8 对错版 9。`,
          `容量改成 7，答案应该是 11（物品 1 + 物品 4），验证一下。演示 3 实测 11，重量 2 加 5 正好压满容量 7。`,
          `延伸：盯住演示 2 打出的最后一行，容量 5 和 6 都是 8 —— 多出的那 1 公斤什么也装不进；想想为什么「价值最大」不等于「把容量塞满」，再找出表里 dp 值原地踏步的全部位置。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：dp[j] 记「容量 j 能装出的最大价值」，每来一件物品整表从右往左升级一遍 —— 倒着走守 0-1，正着走就把同一件装两回。` }
      ]
    },
    {
      id: `m177`, title: `第 177 课 · 完全背包零钱兑换：东西可以无限拿，方向反过来就行`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用 1、4、5 三种硬币凑 8 元，每种随便拿几枚，问最少几枚 —— 表从左往右升级，报出 2 枚（4 加 4）；再试加一枚 3 元硬币、把「最少几枚」改成「有几种凑法」，亲眼看看方向一换、加法一换，表就换了脾气。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课的背包规矩是每件只拿一次；这一课的硬币随便拿 —— 1 元想拿几枚拿几枚，这叫**完全背包**。换到零钱的语言里，问题是「凑出 target 元最少用几枚硬币」。表面上换了个题目，骨子里还是那张 dp 表：dp[j] 表示凑出 j 元最少几枚，每来一种面值 c，就挨个金额问：不拿它维持 dp[j]，多拿一枚就是 dp[j - c] + 1，谁小听谁的。` },
        { t: `p`, text: `和 0-1 背包唯一的区别在**方向**：内层循环从小到大走。算 dp[j] 时，dp[j - c] 是这一轮刚更新过的新值 —— 意思是凑 j - c 元时这种硬币可能已经用过了，再多拿一枚也无妨。上一课拼了命要防的「同一件装两次」，在这一课恰恰是**要买的功能**：方向一反，防重复就变成了允许重复。两课连读，一句话就记全了：倒着走每件一次，正着走随便拿。` },
        { t: `p`, text: `还有两块地基得说清。其一，dp 一开始全填 1000 当「凑不出来」的记号，dp[0] 单独设成 0 —— 凑 0 元要 0 枚，这一格是所有递推的起跳板，忘了它整张表就死在 1000 上。其二，别信贪心：见 8 就先拿最大的 5，剩下 3 只能用 1 元补三枚，一共 4 枚；而 4 加 4 只要 2 枚。局部最划算的先拿，总价反而更贵 —— 这正是要请 dp 表出面管账的原因。` },
        { t: `svg`, caption: `三种面值各过一遍表，dp 从左往右被刷新，数值全部本机实跑。第一行走完 1 元币，dp[j] 就等于 j；第二行走完 4 元币，dp[4] 从 4 枚 1 元降到 1 枚、dp[8] 从 8 枚降到 2 枚（4 加 4）；第三行走完 5 元币，dp[5] 和 dp[6]、dp[7] 又被 5 元币牵头压低，唯独 dp[8] 停在 2 纹丝不动 —— 5 加 3 枚 1 元要 4 枚，输给 4 加 4`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 252">
  <text x="18" y="20" font-size="13" font-weight="700" fill="#142639">凑 8 元最少几枚：每种面值把表从左往右刷一遍</text>
  <g font-size="12" fill="#26405a">
    <text x="18" y="58" font-weight="700">过完 1 元</text>
    <text x="18" y="118" font-weight="700">过完 4 元</text>
    <text x="18" y="178" font-weight="700">过完 5 元</text>

    <rect x="100" y="36" width="52" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="126" y="56" text-anchor="middle">0</text>
    <rect x="158" y="36" width="52" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="184" y="56" text-anchor="middle">1</text>
    <rect x="216" y="36" width="52" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="242" y="56" text-anchor="middle">2</text>
    <rect x="274" y="36" width="52" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="300" y="56" text-anchor="middle">3</text>
    <rect x="332" y="36" width="52" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="358" y="56" text-anchor="middle">4</text>
    <rect x="390" y="36" width="52" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="416" y="56" text-anchor="middle">5</text>
    <rect x="448" y="36" width="52" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="474" y="56" text-anchor="middle">6</text>
    <rect x="506" y="36" width="52" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="532" y="56" text-anchor="middle">7</text>
    <rect x="564" y="36" width="52" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="590" y="56" text-anchor="middle">8</text>

    <rect x="100" y="96" width="52" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="126" y="116" text-anchor="middle">0</text>
    <rect x="158" y="96" width="52" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="184" y="116" text-anchor="middle">1</text>
    <rect x="216" y="96" width="52" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="242" y="116" text-anchor="middle">2</text>
    <rect x="274" y="96" width="52" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="300" y="116" text-anchor="middle">3</text>
    <rect x="332" y="96" width="52" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="358" y="116" text-anchor="middle" fill="#1d7a3c" font-weight="700">1</text>
    <rect x="390" y="96" width="52" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="416" y="116" text-anchor="middle" fill="#1d7a3c" font-weight="700">2</text>
    <rect x="448" y="96" width="52" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="474" y="116" text-anchor="middle" fill="#1d7a3c" font-weight="700">3</text>
    <rect x="506" y="96" width="52" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="532" y="116" text-anchor="middle" fill="#1d7a3c" font-weight="700">4</text>
    <rect x="564" y="96" width="52" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="590" y="116" text-anchor="middle" fill="#1d7a3c" font-weight="700">2</text>

    <rect x="100" y="156" width="52" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="126" y="176" text-anchor="middle">0</text>
    <rect x="158" y="156" width="52" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="184" y="176" text-anchor="middle">1</text>
    <rect x="216" y="156" width="52" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="242" y="176" text-anchor="middle">2</text>
    <rect x="274" y="156" width="52" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="300" y="176" text-anchor="middle">3</text>
    <rect x="332" y="156" width="52" height="30" rx="5" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="358" y="176" text-anchor="middle">1</text>
    <rect x="390" y="156" width="52" height="30" rx="5" fill="#e8f1fb" stroke="#00599c" stroke-width="1.5"/><text x="416" y="176" text-anchor="middle" fill="#00599c">1</text>
    <rect x="448" y="156" width="52" height="30" rx="5" fill="#e8f1fb" stroke="#00599c" stroke-width="1.5"/><text x="474" y="176" text-anchor="middle" fill="#00599c">2</text>
    <rect x="506" y="156" width="52" height="30" rx="5" fill="#e8f1fb" stroke="#00599c" stroke-width="1.5"/><text x="532" y="176" text-anchor="middle" fill="#00599c">3</text>
    <rect x="564" y="156" width="52" height="30" rx="5" fill="#00599c"/><text x="590" y="176" text-anchor="middle" fill="#ffffff" font-weight="700">2</text>

    <text x="18" y="214" fill="#33465e">第二行 dp[6] 原本 6，被 4 加 1 加 1 压到 3；第三行又被 5 加 1 压到 2 —— 每种面值都有机会再改一遍表。</text>
    <text x="18" y="234" fill="#00599c" font-weight="700">dp[8] 终值 2：5 元币入场也赢不了 4 加 4，这就是最少硬币不归贪心管的铁证。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `这张表答的是「**最少几枚**」，所以比较符是小于、更新是取小；把加一枚的代价从 1 换成面值本身，它就是「最少多少钱」；把取小换成取大，它又变回背包。同一副骨架，换一个比较符就换一道题 —— 这是 DP 最值钱的地方。而它的边界也写得明明白白：1000 只是个「凑不出来」的记号，不是真答案，题目保证有解时它才敢当无穷大用；真碰上凑不出的金额，dp[j] 会原样端着 1000 出来见人。` },
        { t: `p`, text: `它和上一课还是**同一个模子的两个朝向**：表一样、转移式一样，唯独内层方向相反。所以读这一课最好的姿势是拿上一课当对照组 —— 你已经知道倒着走是什么下场，现在正着走的一切行为都是它的镜像。` },
        { t: `h2`, text: `演示 1 · 源稿那段：三种面值刷一遍表` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
int main() {
    int target = 8;
    std::vector<int> coins = {1, 4, 5};
    std::vector<int> dp(target + 1, 1000);   // dp[j] = 凑出 j 元最少几枚
    dp[0] = 0;                               // 凑 0 元要 0 枚
    for (int c : coins)
        for (int j = c; j <= target; ++j)    // 正着走，同一枚可反复用
            if (dp[j - c] + 1 < dp[j]) dp[j] = dp[j - c] + 1;
    std::println("凑 {} 元最少 {} 枚硬币（4+4）", target, dp[target]);
    return 0;
}` },
        { t: `p`, text: `实测打印：凑 8 元最少 2 枚硬币（4+4）。整张表只有三行代码在干活：for (int c : coins) 挨个面值过，内层正着走，一句 if 做取小更新。对比上一课那个 0-1 背包，两段代码长得像双胞胎，差别只有方向和比较符 —— 方向一反，同一种东西就从「只许一件」变成「随便几枚」。` },
        { t: `h2`, text: `演示 2 · 把每种面值过完后的表打出来` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
int main() {
    int target = 8;  std::vector<int> coins = {1, 4, 5};
    std::vector<int> dp(target + 1, 1000);
    dp[0] = 0;
    for (int c : coins) {
        for (int j = c; j <= target; ++j)
            if (dp[j - c] + 1 < dp[j]) dp[j] = dp[j - c] + 1;
        std::print("过完 {} 元币:", c);
        for (int j = 0; j <= target; ++j) std::print(" {}", dp[j]);
        std::println("");
    }
}` },
        { t: `p`, text: `实测三行：过完 1 元币是 0 1 2 3 4 5 6 7 8 —— 只有 1 元可拿时几元就几枚，这张行是所有后面的对照基线。过完 4 元币变 0 1 2 3 1 2 3 4 2：dp[4] 从 4 枚砍到 1 枚，dp[8] 从 8 枚砍到 2 枚，两枚 4 元正好压线。过完 5 元币是 0 1 2 3 1 1 2 3 2：dp[5] 和 dp[6]、dp[7] 又被 5 元币牵头压低，唯独 dp[8] 停在 2 —— 5 加三枚 1 元要 4 枚，输给 4 加 4，图里那格蓝底就是它。` },
        { t: `h2`, text: `演示 3 · 本课任务一：加一枚 3 元硬币，答案变几` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
int main() {
    int target = 8;
    std::vector<int> coins = {1, 3, 4, 5};   // 加了一枚 3 元
    std::vector<int> dp(target + 1, 1000);
    dp[0] = 0;
    for (int c : coins)
        for (int j = c; j <= target; ++j)
            if (dp[j - c] + 1 < dp[j]) dp[j] = dp[j - c] + 1;
    std::println("凑 {} 元最少 {} 枚", target, dp[target]);
}` },
        { t: `p`, text: `实测还是 2。乍一听意外，算一下就服气：3 加 5 也是 2 枚，跟 4 加 4 打了平手 —— 加这枚硬币没把总数压下去，只是多铺了一条并列的最短路。真正的收获在表的下沿：dp[3] 从 3 枚降到 1 枚，dp[6] 走 3 加 3 也只要 2 枚。**加币不帮主问题帮忙，不等于白加 —— 整张表的下半段全都松动了。**` },
        { t: `h2`, text: `演示 4 · 本课任务二：把「最少几枚」改成「有几种凑法」` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
int main() {
    int target = 8;  std::vector<int> coins = {1, 4, 5};
    std::vector<long long> cnt(target + 1, 0);   // cnt[j] = 凑出 j 元的凑法数
    cnt[0] = 1;                                  // 凑 0 元有 1 种：什么都不拿
    for (int c : coins)                          // 外层硬币：数的是组合数
        for (int j = c; j <= target; ++j)
            cnt[j] += cnt[j - c];
    std::print("凑法数表:");
    for (int j = 0; j <= target; ++j) std::print(" {}", cnt[j]);
    std::println("");
}` },
        { t: `p`, text: `实测凑法数表是 1 1 1 1 2 3 3 3 4 —— 凑 8 元共 4 种：八个 1 元；4 加四个 1 元；5 加三个 1 元；4 加 4。和「最少几枚」就差两处：初值从 0 换成 1（凑 0 元有 1 种凑法，就是什么都不拿），更新从取小换成加法（每种凑法都算数，不是只留最省的）。**还有一句要钉死：外层必须是硬币。** 把两层循环换过来，同一段代码数出来是 11 —— 那是排列数，5 加 1 加 1 加 1 和 1 加 1 加 1 加 5 被当成了两种凑法。本机实测两种写法就是 4 对 11。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `内层倒着走，把完全背包写成 0-1。实测表变成 0 1 1000 1000 1 1 2 1000 1000 —— dp[8] 端着 1000 出来：每种面值只许一枚，1 加 4 加 5 是 10 越过了 8，8 根本凑不出。方向就是这两课的分界线。`,
          `忘了 dp[0] = 0。实测整张表死在 1000 上，dp[8] 还是 1000 —— 递推的每一格都在抄「前一枚硬币之后的余款」，起跳板是 0 格，没有它第一枚硬币都迈不出去。`,
          `把 1000 当真答案打印。凑不出的金额上程序会老实打印 1000，看着像个正经数 —— 打印前先判一句 dp[target] 是否还等于初值，是就报「凑不出来」。`,
          `贪心先拿最大的。实测 8 元按 5 加三枚 1 元要 4 枚，dp 表给的是 4 加 4 两枚 —— 贪心在这道题上不是差一点，是差一倍。`,
          `数凑法时外层写成金额。实测同样的递推 4 对 11：外层硬币数组合（4 加 4 一种），外层金额数排列（先 4 后 1 和先 1 后 4 分家）。考题里这两个数是判断写反没写反的指纹。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `加一枚 3 元硬币，答案会变成几？实测仍是 2（3 加 5 与 4 加 4 打平），演示 3 已给出完整代码与解读。`,
          `把「最少几枚」改成「有几种凑法」。实测凑 8 元共 4 种，凑法数表 1 1 1 1 2 3 3 3 4，演示 4 已实跑；把两层循环换序再跑一遍，对照那个 11。`,
          `延伸：把硬币改成只有 1 元一种跑原程序，实测凑 8 元要 8 枚 —— 表退化成几元几枚；再想想这一版跟过完 1 元币那一行为什么是同一行。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：完全背包与 0-1 背包只差内层方向 —— 正着走让同一枚硬币能反复进场；数凑法时再记住外层管口径：外层硬币数组合，外层金额数排列。` }
      ]
    },
    {
      id: `m178`, title: `第 178 课 · 最长公共子序列：两根指针各盯一个字符串，一张二维表定输赢`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：拿 abcde 和 ace 两个词，把「公共子序列最长能留多长」铺成一张 6 行 4 列的二维 dp 表，尾巴相同就抄左上角加 1、不同就扔掉一个尾巴取较好那格，实测答案是 3；再把两个词换成 dynamic 和 programming，亲眼看着容器跟着长度一起长大。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `先把名词掰开。子序列是**挑着删字**后剩下的东西：ace 是 abcde 的子序列，因为 a、c、e 按顺序都在，中间隔着什么都不计较 —— 它不要求连续，这一点和第 175 课的子数组正好相反。两个词的公共子序列，就是同时在两个词里当子序列的串，要找最长的那个。暴力枚举一个词的全部子序列是 2 的 5 次方 32 种，词一长就爆炸，还得请出递推。` },
        { t: `p`, text: `递推的抓手还是**尾巴**。设 dp[i][j] 表示「a 的前 i 个字和 b 的前 j 个字」的最长公共子序列长度，那要看两个词各自的尾巴 a[i-1] 和 b[j-1]（表从 1 数起、字符串从 0 数起，所以差一）。尾巴相同，这个字放心留进公共子序列，剩下的活是「两边都去掉尾巴」的小问题，答案 dp[i-1][j-1] 加 1；尾巴不同，这个字至少不属于其中一边的最优解，试着扔掉 a 的尾巴或扔掉 b 的尾巴，取较好的那个，也就是 max(dp[i-1][j], dp[i][j-1])。` },
        { t: `p`, text: `为什么尾巴相同时不用再比较扔尾巴的选项？因为留下这个匹配只会赚不会亏 —— 它是两边现成的一对，任何不使用它的方案都能改成使用它的方案而长度不缩水。这句「加 1」就是整张表的发动机；而「不同时取两边扔尾巴的最大值」是它的方向盘。表格还多了一圈第 0 行第 0 列，全填 0 —— 空串和谁都没有公共子序列，这一圈地基让 i 减 1、j 减 1 永远踩在合法格子上，跟第 176 课 dp 表多开一格是同一个心思。` },
        { t: `svg`, caption: `abcde 对 ace 的整张 dp 表，数值全部本机实跑。三个绿格是「尾巴相同」的落点：第 1 行第 1 列的 a、第 3 行第 2 列的 c、第 5 行第 3 列的 e，每格都抄左上角加 1；其余格子全部走「扔一个尾巴取较大」的横竖通道。右下角 3 就是答案，顺着一串绿格往回走，走出来的正是 ace`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 292">
  <text x="18" y="20" font-size="13" font-weight="700" fill="#142639">dp 表：尾巴相同抄左上角加 1，不同就取左格、上格的较大者</text>
  <g font-size="12" fill="#26405a">
    <text x="196" y="46" text-anchor="middle" fill="#8b98ab">空</text>
    <text x="248" y="46" text-anchor="middle" fill="#8b98ab">a</text>
    <text x="300" y="46" text-anchor="middle" fill="#8b98ab">c</text>
    <text x="352" y="46" text-anchor="middle" fill="#8b98ab">e</text>
    <text x="158" y="80" text-anchor="middle" fill="#8b98ab">空</text>
    <text x="158" y="116" text-anchor="middle" fill="#8b98ab">a</text>
    <text x="158" y="152" text-anchor="middle" fill="#8b98ab">b</text>
    <text x="158" y="188" text-anchor="middle" fill="#8b98ab">c</text>
    <text x="158" y="224" text-anchor="middle" fill="#8b98ab">d</text>
    <text x="158" y="260" text-anchor="middle" fill="#8b98ab">e</text>

    <rect x="196" y="58" width="48" height="30" rx="4" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="220" y="78" text-anchor="middle">0</text>
    <rect x="248" y="58" width="48" height="30" rx="4" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="272" y="78" text-anchor="middle">0</text>
    <rect x="300" y="58" width="48" height="30" rx="4" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="324" y="78" text-anchor="middle">0</text>
    <rect x="352" y="58" width="48" height="30" rx="4" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="376" y="78" text-anchor="middle">0</text>

    <rect x="196" y="94" width="48" height="30" rx="4" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="220" y="114" text-anchor="middle">0</text>
    <rect x="248" y="94" width="48" height="30" rx="4" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2.5"/><text x="272" y="114" text-anchor="middle" fill="#1d7a3c" font-weight="700">1</text>
    <rect x="300" y="94" width="48" height="30" rx="4" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="324" y="114" text-anchor="middle">1</text>
    <rect x="352" y="94" width="48" height="30" rx="4" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="376" y="114" text-anchor="middle">1</text>

    <rect x="196" y="130" width="48" height="30" rx="4" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="220" y="150" text-anchor="middle">0</text>
    <rect x="248" y="130" width="48" height="30" rx="4" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="272" y="150" text-anchor="middle">1</text>
    <rect x="300" y="130" width="48" height="30" rx="4" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="324" y="150" text-anchor="middle">1</text>
    <rect x="352" y="130" width="48" height="30" rx="4" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="376" y="150" text-anchor="middle">1</text>

    <rect x="196" y="166" width="48" height="30" rx="4" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="220" y="186" text-anchor="middle">0</text>
    <rect x="248" y="166" width="48" height="30" rx="4" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="272" y="186" text-anchor="middle">1</text>
    <rect x="300" y="166" width="48" height="30" rx="4" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2.5"/><text x="324" y="186" text-anchor="middle" fill="#1d7a3c" font-weight="700">2</text>
    <rect x="352" y="166" width="48" height="30" rx="4" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="376" y="186" text-anchor="middle">2</text>

    <rect x="196" y="202" width="48" height="30" rx="4" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="220" y="222" text-anchor="middle">0</text>
    <rect x="248" y="202" width="48" height="30" rx="4" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="272" y="222" text-anchor="middle">1</text>
    <rect x="300" y="202" width="48" height="30" rx="4" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="324" y="222" text-anchor="middle">2</text>
    <rect x="352" y="202" width="48" height="30" rx="4" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="376" y="222" text-anchor="middle">2</text>

    <rect x="196" y="238" width="48" height="30" rx="4" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="220" y="258" text-anchor="middle">0</text>
    <rect x="248" y="238" width="48" height="30" rx="4" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="272" y="258" text-anchor="middle">1</text>
    <rect x="300" y="238" width="48" height="30" rx="4" fill="#f4f6f9" stroke="#c3ccd8" stroke-width="1.5"/><text x="324" y="258" text-anchor="middle">2</text>
    <rect x="352" y="238" width="48" height="30" rx="4" fill="#00599c"/><text x="376" y="258" text-anchor="middle" fill="#ffffff" font-weight="700">3</text>

    <text x="432" y="88" fill="#1d7a3c">三个绿格都在「尾巴相同」的位置，</text>
    <text x="432" y="108" fill="#1d7a3c">各抄左上角加 1：0 加 1、1 加 1、2 加 1。</text>
    <text x="432" y="140" fill="#33465e">第 3 行第 2 列那格是 c 对上 c，</text>
    <text x="432" y="160" fill="#33465e">它左上角的 1 来自 a 对上 a。</text>
    <text x="432" y="192" fill="#00599c">蓝格 dp[5][3] = 3 是答案，</text>
    <text x="432" y="212" fill="#00599c">它的 3 来自 2 加 1，那一对是 e。</text>
    <text x="432" y="244" fill="#8b98ab">顺绿格回走：e、c、a，</text>
    <text x="432" y="264" fill="#8b98ab">倒过来正是 ace。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `这是一张**二维表**，也是这一批四课里第一个真正铺开的二维 dp：一维管 a 的前缀、一维管 b 的前缀，两个下标各盯一个字符串。每格的答案只抄左上、左、上三个邻居 —— 这类「只看少数邻居」的性质叫无后效性，它保证填表顺序随便你，从左到右一行行刷就行。代价也明摆着：时间和空间都是两串长度的乘积，dynamic 对 programming 是 7 乘 11 共 77 格。` },
        { t: `p`, text: `它还把「第 0 行第 0 列」设计成**地基**：空串的公共子序列长度是 0，这一圈 0 让所有 i 减 1、j 减 1 都有格子可踩。少了它，第 1 行第 1 列的左上角就是 dp[0][0] 变成 dp[-1][-1] —— operator[] 不查边界，崩不崩看运气。这是第 166 课二维前缀和多开一圈、第 176 课 dp 开 W 加 1 格的第三次重演：**dp 表永远比问题多一圈。**` },
        { t: `h2`, text: `演示 1 · 源稿那段：abcde 对 ace` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <vector>
#include <algorithm>
int main() {
    std::string a = "abcde", b = "ace";
    std::vector<std::vector<int>> dp(6, std::vector<int>(4, 0)); // 行=长度+1 列=长度+1
    for (int i = 1; i <= 5; ++i)
        for (int j = 1; j <= 3; ++j)
            if (a[i-1] == b[j-1]) dp[i][j] = dp[i-1][j-1] + 1;  // 尾巴相同，接上
            else                  dp[i][j] = std::max(dp[i-1][j], dp[i][j-1]);
    std::println("LCS(\"{}\", \"{}\") 长度 = {}", a, b, dp[5][3]);
    return 0;
}` },
        { t: `p`, text: `实测打印：LCS("abcde", "ace") 长度 = 3。这条公共子序列就是 ace 本身 —— b 的每个字都能在 a 里按顺序找到家。容器开 6 行 4 列而不是 5 行 3 列，多出的那一行一列就是地基；循环从 1 起，字符串下标却从 0 起，所以格子 dp[i][j] 对话的是字符 a[i-1] 和 b[j-1]，这个差一在源稿的两处 a[i-1]、b[j-1] 里各出现一次。` },
        { t: `h2`, text: `演示 2 · 本课任务一：把整张 dp 表打出来，看每个格子从哪来` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <vector>
#include <algorithm>
int main() {
    std::string a = "abcde", b = "ace";
    std::vector<std::vector<int>> dp(6, std::vector<int>(4, 0));
    for (int i = 1; i <= 5; ++i)
        for (int j = 1; j <= 3; ++j)
            if (a[i-1] == b[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
            else                  dp[i][j] = std::max(dp[i-1][j], dp[i][j-1]);
    for (auto& row : dp) { for (int x : row) std::print("{:3}", x); std::println(""); }
}` },
        { t: `p`, text: `实测六行：0 0 0 0、0 1 1 1、0 1 1 1、0 1 2 2、0 1 2 2、0 1 2 3。挑几格验货：第 1 行第 1 列是 1，a 对上 a，抄左上 0 加 1；第 3 行第 2 列是 2，c 对上 c，抄左上那格的 1 加 1；第 2 行第 2 列是 1，b 对不上 c，取左格 1 和上格 1 的较大者 —— 注意它没有跌回 0，因为 a 对 a 那一步赚到的 1 还留在表里。最右下角的 3 就是答案，图上顺绿格回走，出来的是 e、c、a。` },
        { t: `h2`, text: `演示 3 · 本课任务二：换成 dynamic 和 programming` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <vector>
#include <algorithm>
int main() {
    std::string x = "dynamic", y = "programming";
    std::vector<std::vector<int>> dp(x.size() + 1, std::vector<int>(y.size() + 1, 0));
    for (int i = 1; i <= (int)x.size(); ++i)
        for (int j = 1; j <= (int)y.size(); ++j)
            if (x[i-1] == y[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
            else                  dp[i][j] = std::max(dp[i-1][j], dp[i][j-1]);
    std::println("LCS(dynamic, programming) = {}", dp[x.size()][y.size()]);
}` },
        { t: `p`, text: `实测打印：LCS(dynamic, programming) = 3。这条公共子序列是 ami —— a、m、i 在两个词里都按顺序排着。源稿任务提醒的「把 6、4 改成长度加 1」就在第二行：容器大小直接用 size() 加 1 算出来，7 行 12 列，循环上界也跟着 size() 走，以后换任何两个词都不用再手工改数字。顺带把 size() 转成 int 再比较，无符号数直接减的坑第 151 课数过，这里照规矩绕开。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `尾巴相同忘了加 1。实测把那句改成 dp[i][j] = dp[i-1][j-1]，整张表全是 0，答案 0 —— 表里没有任何格子能凭空长出 1，加 1 是全表唯一的发动机。认法：匹配格的值一定比左上角恰好多 1。`,
          `把子序列当子串做。子串要求连续，abcde 和 ace 的最长公共子串实测只有 1（单个 a 或 c 或 e），而子序列是 3 —— 中间隔着的 b、d 正是子序列的合法跳格。两词一字之差，答案差三倍。`,
          `表少开一圈地基。开 5 行 3 列的话，递推要写的最后那格 dp[5][3] 本身就在界外 —— operator[] 不报错，写进去的值和下一步崩在哪全看运气。规矩不变：行列各比串长多 1。`,
          `字符串下标差一写错。dp 的 i、j 从 1 起，字符串从 0 起，递推里必须是 a[i-1]、b[j-1]；顺手写成 a[i] 时整张表错位，abcde 对 ace 会答出别的数。写之前在草稿上标一句「dp[i][j] 管 a 的前 i 个字」。`,
          `换字符串忘改容器和上界。源稿那两个 6、4 是为 abcde、ace 量身的，换成 dynamic、programming 不改就是 7 行 12 列的数据挤在 6 行 4 列的表里 —— 越界写。演示 3 的 size() 加 1 写法是根治。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `打印整张 dp 表，看每个格子的数从哪来。演示 2 已给出六行实测值，对照图上三个绿格，亲手验一遍「左上角加 1」和「取左右上较大」各发生在哪格。`,
          `换成 dynamic 和 programming（记得把 6、4 改成长度加 1）。实测答案 3，公共子序列 ami，演示 3 用 size() 加 1 的写法把两个手工数字都根治了。`,
          `延伸：从 dp[5][3] 往回走把公共子序列本身打印出来 —— 尾巴相同时收下这个字往左上走，不同时朝值较大的邻居退，实测走出来的是 ace。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：二维 dp 表一行管一个词的前缀，尾巴相同抄左上角加 1、不同取上左较大 —— 而第 0 行第 0 列那圈地基，又一次证明 dp 表永远比问题多一圈。` }
      ]
    }
  ]
};
