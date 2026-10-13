/* 喵站 · C++ 掌握 正文分部 p09：第 109–112 课（第九轮）
 *
 * 源稿：109_集合运算.cpp、110_下一个排列.cpp、111_数值算法与前缀和.cpp、112_类的骨架.cpp
 * 前三课是标准算法这一族的收尾：集合运算、下一个排列、数值算法与前缀和；
 * 第四课翻开新的一章 —— 类第一次登场。写法照 p04：讲「为什么这么想」，不只讲「语法长这样」。
 */
window.MIAO_CPPM_P09 = {
  chapters: [
    {
      id: `m109`, title: `第 109 课 · 集合运算：交集、并集、差集一次算完`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会用 std::set_intersection、std::set_union、std::set_difference 算两份名单的交集、并集、差集，并说清「输入必须已排序」和「结果写进第三个容器」这两条规矩各自的原因。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `手里两份名单：A 组选了哪些课，B 组选了哪些课。三个问题马上冒出来 —— 两组都选的有哪些（交集）、一共涉及哪些（并集）、只在 A 组出现的有哪些（差集）。这三件事在真实代码里出现得极频繁：两次扫描的公共部分、白名单减黑名单、新老版本的差集。手写就是两个套起来的圈，一个元素一个元素去对面找。` },
        { t: `p`, text: `先把一个容易混的钉开：第 100 课的 std::set 是**容器**，本课这套 std::set_xxx 是**算法**，住在 <algorithm> 里，两者除了都叫 set 没有半点关系。算法收的是「一对迭代器表示的区间」，递 vector、递 set、递普通数组都行。容器写的是 set 尖括号 int，算法写的是 set_intersection 加参数 —— 脑子里别搅成一团。` },
        { t: `p`, text: `为什么标准库敢把这三件事一次做完？靠的是**双指针归并**。两份名单都已排序，于是可以各配一个游标，从头往尾扫，每一步只比「两个人当前手里这一格」：` },
        { t: `code`, lang: `text`, code: `i 走 a，j 走 b，两边都从小到大：
  a[i] == b[j]   交集收下这个值，i 和 j 一起前进
  a[i] <  b[j]   a 这一格 b 里没有，只让 i 前进
  a[i] >  b[j]   b 这一格 a 里没有，只让 j 前进
谁先到尾巴，另一边的剩余就是差集；并集则把剩余原样抄走。` },
        { t: `p`, text: `关键就在「只让小的那个前进」这一句。它成立的前提是**另一边剩下的都更大**：a[i] 比 b[j] 小，而 b 从 j 往后的值只增不减，所以 a[i] 绝不可能再出现在 b 里 —— 直接判掉它，一次比较砍掉一整段搜索。这就是「必须先排序」的真正原因：不排序，这个推理塌了，程序却不会拦你，它照样跑完，只是给你一份**看着挺像答案的错误结果**。顺带还赚了复杂度：每步至少一个指针前进，最多走「两个长度相加」步，双重圈却要比「两个长度相乘」次。` },
        { t: `svg`, caption: `两个游标各守一份有序名单：相等就收进结果并同时前进，不等就只让较小的那个前进。并集和差集共用这副指针，只改「不等」那两行的收法`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250">
  <text x="20" y="22" font-size="13" font-weight="700" fill="#142639">双指针逐格比 —— 谁小谁先走，撞上就收进结果</text>
  <g font-size="12" fill="#26405a">
    <text x="20" y="72">a 已排序</text>
    <polygon points="196,48 208,48 202,56" fill="#b8500f"/><text x="202" y="44" text-anchor="middle" fill="#b8500f" font-weight="700">i</text>
    <rect x="90" y="58" width="40" height="26" rx="5" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="110" y="76" text-anchor="middle">1</text>
    <rect x="136" y="58" width="40" height="26" rx="5" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="156" y="76" text-anchor="middle">2</text>
    <rect x="182" y="58" width="40" height="26" rx="5" fill="#fdece1" stroke="#b8500f" stroke-width="2"/><text x="202" y="76" text-anchor="middle">3</text>
    <rect x="228" y="58" width="40" height="26" rx="5" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="248" y="76" text-anchor="middle">4</text>
    <rect x="274" y="58" width="40" height="26" rx="5" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="294" y="76" text-anchor="middle">5</text>

    <text x="20" y="126">b 已排序</text>
    <rect x="90" y="112" width="40" height="26" rx="5" fill="#fdece1" stroke="#b8500f" stroke-width="2"/><text x="110" y="130" text-anchor="middle">3</text>
    <rect x="136" y="112" width="40" height="26" rx="5" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="156" y="130" text-anchor="middle">4</text>
    <rect x="182" y="112" width="40" height="26" rx="5" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="202" y="130" text-anchor="middle">5</text>
    <rect x="228" y="112" width="40" height="26" rx="5" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="248" y="130" text-anchor="middle">6</text>
    <rect x="274" y="112" width="40" height="26" rx="5" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="294" y="130" text-anchor="middle">7</text>
    <polygon points="104,146 116,146 110,138" fill="#00599c"/><text x="110" y="158" text-anchor="middle" fill="#00599c" font-weight="700">j</text>
    <text x="136" y="156" fill="#b8500f" font-weight="700">两边都是 3 —— 收进结果，i 与 j 一起走</text>

    <text x="20" y="192">结果</text>
    <rect x="90" y="176" width="40" height="26" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="110" y="194" text-anchor="middle">3</text>
    <rect x="136" y="176" width="40" height="26" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="156" y="194" text-anchor="middle">4</text>
    <rect x="182" y="176" width="40" height="26" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="202" y="194" text-anchor="middle">5</text>

    <rect x="336" y="54" width="288" height="120" rx="8" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1"/>
    <text x="350" y="76">a 等 b → 收进结果，两个都走</text>
    <text x="350" y="98">a 小 → 这个值 b 里绝无，只走 i</text>
    <text x="350" y="120">b 小 → 这个值 a 里绝无，只走 j</text>
    <text x="350" y="146">这三条能成立，全靠「剩下的只增」</text>
    <text x="350" y="166">—— 排序不是格式要求，是正确性前提</text>
    <text x="20" y="222" fill="#1d7a3c" font-weight="700">每步至少一个指针前进：最多 m 加 n 步，双重圈却要 m 乘 n 次比较。</text>
    <text x="20" y="242" fill="#33465e">算法只读输入、只写输出区间，两份名单从头到尾不会被改动。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `这套形状可以一句话概括：**两条有序流水汇成一条，汇的过程中顺手做判断。** 你已经见过它的兄弟 —— 第 105 课 sort 里归并的那一半、第 106 课在有序数组上跑的二分，靠的都是「有序」换来的便宜。本课三个算法是同一副骨架换了三种收法：交集只收相等的，并集谁都收（相等只收一次），差集只收 a 这边落单的。骨架一个字没动。` },
        { t: `p`, text: `再看签名：**输入两个区间，再加一个输出位置。** 为什么输出要额外递一个位置，而不是直接回一个新容器？因为算法写下第一个结果之前，根本不知道会有几个 —— 交集可能一个都没有，也可能有五个。它需要一个「能往后面无限长出去」的口子，这就是**输出迭代器**；std::back_inserter 正好把这个口子接到你的空 vector 上：每写一个值就翻译成一次 push_back，容器自己长。` },
        { t: `code`, lang: `text`, code: `std::set_intersection(a.begin(), a.end(), b.begin(), b.end(), std::back_inserter(inter));
        ↑ 输入区间一        ↑ 输入区间二                   ↑ 输出位置：写哪儿
读法：a 的区间、b 的区间、结果请追加到 inter 尾巴。凡是产结果的标准算法都是这个形状。` },
        { t: `h2`, text: `演示 1 · 源稿这段：先算交集和并集` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <algorithm>
#include <iterator>
#include <vector>
int main() {
    std::vector<int> a = {1, 2, 3, 4, 5}, b = {3, 4, 5, 6, 7};
    std::vector<int> inter, uni;                       // 空的，等着自己长大
    std::set_intersection(a.begin(), a.end(), b.begin(), b.end(),
                          std::back_inserter(inter));   // 结果自动追加到尾部
    std::set_union(a.begin(), a.end(), b.begin(), b.end(), std::back_inserter(uni));
    for (int v : inter) std::print("{} ", v);   std::println("← 交集");
    for (int v : uni) std::print("{} ", v);     std::println("← 并集");
    return 0;
}` },
        { t: `p`, text: `跑出来两行：3 4 5 后面跟着「← 交集」，1 2 3 4 5 6 7 后面跟着「← 并集」，跟手算完全一致。值得停下来看一眼的是**没有一行找相同的 for 圈** —— 你以前写的「遍历两个容器找相同」全都收进了一个函数名。这就是这一族算法的意义：把「双指针怎么挪」这件极易写错的事交给标准库，你只负责说清要哪种收法。` },
        { t: `h2`, text: `演示 2 · 差集与对称差集` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <algorithm>
#include <iterator>
#include <vector>
int main() {
    std::vector<int> a = {1, 2, 3, 4, 5}, b = {3, 4, 5, 6, 7};
    std::vector<int> diff, sym;
    std::set_difference(a.begin(), a.end(), b.begin(), b.end(), std::back_inserter(diff));
    std::set_symmetric_difference(a.begin(), a.end(), b.begin(), b.end(), std::back_inserter(sym));
    for (int v : diff) std::print("{} ", v);    std::println("← a 减 b");
    for (int v : sym) std::print("{} ", v);     std::println("← 对称差集");
    return 0;
}` },
        { t: `p`, text: `a - b 得 1 2：只在 A 里的两个。反过来 b - a 得 6 7，所以**差集不讲对称**，减法顺序就是问题本身 —— 你要问的是「我独有」还是「他独有」。最后那段 set_symmetric_difference 收的是「只属于一边」的 1 2 6 7，也就是并集减交集：两次快照各自多出来什么，问的正是这个问题。四个算法共用一副指针，换个算法名就换个收法，这便宜就是当初「每段只管一件事」换来的。` },
        { t: `h2`, text: `演示 3 · 故意不给有序名单，看它怎么骗你` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <algorithm>
#include <iterator>
#include <vector>
int main() {
    std::vector<int> a = {3, 1, 5, 2, 4};   // 故意乱序：公共元素本该是 1 3 4 5
    std::vector<int> b = {4, 5, 1, 7, 3};   // 两边都没排序，算法照跑不误
    std::vector<int> inter;
    std::set_intersection(a.begin(), a.end(), b.begin(), b.end(), std::back_inserter(inter));
    for (int v : inter) std::print("{} ", v);
    std::println("← 乱序输入的答案：只剩一个数，编译和运行都没意见");
    return 0;
}` },
        { t: `p`, text: `实测只输出一个 5。手算该有 1、3、4、5 四个，程序一声不吭地只给你一个。跟着指针走一遍就知道它在哪一步塌的：i 停在 3、j 停在 4，比较完觉得 a 这边小，于是**把 3 判死、i 前进** —— 可 b 的尾巴上还藏着一个 3 没读到。「谁小谁先走」这条推理依赖「对面剩下的只会更大」，乱序把前提抽掉了，剩下的行为就不是错，而是**没人负责的随机结果**。两边 sort 完再算，输出立刻变回 1 3 4 5。第 106 课「没排序就二分」是同一根病，本课它一次发作在三个算法上：**排序不是可选的美化，是这类算法的入场券** —— 这正是任务 2 要写清楚的东西。` },
        { t: `p`, text: `还有一种省事的做法：把名单交给第 100 课那个天生有序的容器，前置条件就不必自己维护 —— 下面这段实测给出 3 4 5，跟 vector 那份一模一样，四个参数一个字没改。算法认的是「能从头走到尾的区间」，不认容器类型；换成 set 之后你再也不用记「先排序」，因为容器替你盯着。` },
        { t: `code`, lang: `c++`, code: `std::set<int> a = {1, 2, 3, 4, 5}, b = {3, 4, 5, 6, 7};   // 装进去那一刻就排好了
std::vector<int> inter;
std::set_intersection(a.begin(), a.end(), b.begin(), b.end(), std::back_inserter(inter));` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `输入没排序 —— 最危险的一个，因为**它不报错**。程序给出一份看起来完全正常的结果，只是缺了几个元素、偶尔还多出几个。防线只有一条：算之前先 sort，或者干脆用第 100 课那个天生有序的 std::set 装名单。`,
          `忘写 std::back_inserter，直接递 inter.begin()。inter 是空的，begin 指向一个长度为 0 的区间，算法照着它往外写就是越界。debug 模式下你会撞见一句关于迭代器不可解析的断言，release 下更糟：段错误，或者把别的变量写脏。`,
          `递普通迭代器接结果时，容器必须已经够大。有人把 inter 预先塞了 10 个 0 去接 begin，交集只有 3 个，尾巴上 7 个 0 还留着，打印出来一片莫名其妙。要么用 back_inserter，要么接住算法返回的「写完了的位置」把多余长度砍掉 —— 这套手感跟第 108 课 unique 之后必须 erase 是同一件事。`,
          `把 std::set_intersection 当成 std::set 的成员函数，写成 a.set_intersection(...)，或者只请 <set> 就动手。它们是 <algorithm> 里的自由函数，back_inserter 还另住在 <iterator>。本课三个头一个都别少。`,
          `名单里有重复项时结果不按直觉走：交集给的是「两边出现次数取小的那个」，3 在你这边两次、对面一次，就收一个 3。这不是 bug，是带重数的定义；要纯集合语义，先把名单丢进 std::set 过一遍再算。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `求 a - b 差集（set_difference），先预测输出再验证：1 2 3 4 5 减掉 3 4 5 6 7 应该剩 1 2。`,
          `想想：为什么这两个算法要求输入已排序？拿演示 3 那份乱序名单当反例，写清「哪一个判断先失效」、失效之后程序为什么不报错。`,
          `延伸一：加一句 std::set_symmetric_difference，验证它等于并集减交集，输出 1 2 6 7。`,
          `延伸二：把 a、b 换成 std::set 装同样数据，三个算法照旧跑一遍 —— 体会「容器天生有序」替你把前置条件做掉了。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：集合运算是双指针归并，排序是它的前提而不是风格；结果个数事先不知道，所以要用 back_inserter 把输出接成一个能自己长大的尾巴。` }
      ]
    },
    {
      id: `m110`, title: `第 110 课 · 下一个排列：next_permutation 枚举全排列`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会用 std::next_permutation 加一个 do-while 不重不漏地枚举全部排列，说清为什么起点必须是最小的那个排列，也看得懂它内部那三步走。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `1、2、3 三个数能排出几种队形？六个。要是有 8 个皇后、10 个城市、一叠要试的顺序，你需要的不是灵感，是**把所有排列一个一个走一遍**的机器。本课这台机器就是 std::next_permutation：给它当前排列，它回你**字典序里的下一个**；变不出下一个（已经是最大那个）就回 false。从最小的排列出发一路叫「下一个」，就把全部排列走完了 —— 这叫「全排列神器」，也是这一族算法里最不显然、最值得拆开来看的的一个。` },
        { t: `p`, text: `先说**字典序**：把排列当字符串比，从左往右找第一个不同的位置，谁在那一位上更小谁就排在前面。所以 1 2 3 后面是 1 3 2，再后面是 2 1 3。有了「谁在前谁在后」这个次序，「下一个」才谈得上，也才谈得上**最后一个** —— 完全不降不升的、也就是从大到小排好的那个。` },
        { t: `p`, text: `它怎么做到「刚好大一点」而不是随便大一点？三步，全在尾巴上做文章。拿 1 3 6 4 2 举例（数字取自 1、2、3、4、6 这五个）：` },
        { t: `code`, lang: `text`, code: `第一步 从右往左找第一个「上升点」：a[i] 小于 a[i+1] 的那个 i
        1 3 6 4 2 里，6>4、4>2 都在往下走，撞见 3 < 6 才停 —— i 就是 3 那一格
第二步 在 i 右边的降尾里，挑「刚好比 a[i] 大」的那一位，跟 a[i] 交换
        降尾 6 4 2 里比 3 大的有 6 和 4，取小的那个 4 —— 换成 1 4 6 3 2
第三步 把 i 右边那段尾巴倒过来（降序翻成升序）
        1 4 6 3 2 → 1 4 2 3 6   ← 这就是 1 3 6 4 2 的下一个排列` },
        { t: `p`, text: `三步里最妙的是第一步。尾巴 6 4 2 已经是**降序**，意味着这一段已经排到它能排的最大样子了，光在尾巴里折腾再也变不出更大的排列 —— 必须往左动一位。而 3 换成 4 之后，前面那段（这里是 1）完全不必再碰；剩下的位置怎么排最小？把已经降序的尾巴**整个倒过来**就得了升序，也就是最小排法。三句话合起来：**该动的最小一位动一点点，动完之后尾巴摆成最小**。这正是「刚好大一点」的定义。` },
        { t: `svg`, caption: `从 1 3 6 4 2 到 1 4 2 3 6：降尾说明「这一段已经最大」，于是往左借一位；换成能换的最小增量，再把尾巴倒成升序取最小排法`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 246">
  <text x="20" y="22" font-size="13" font-weight="700" fill="#142639">next_permutation 的三步走</text>
  <g font-size="12" fill="#26405a">
    <text x="20" y="52">当前</text>
    <rect x="70" y="38" width="40" height="26" rx="5" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="90" y="56" text-anchor="middle">1</text>
    <rect x="116" y="38" width="40" height="26" rx="5" fill="#fdece1" stroke="#b8500f" stroke-width="2"/><text x="136" y="56" text-anchor="middle">3</text>
    <rect x="162" y="38" width="40" height="26" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="182" y="56" text-anchor="middle">6</text>
    <rect x="208" y="38" width="40" height="26" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="228" y="56" text-anchor="middle">4</text>
    <rect x="254" y="38" width="40" height="26" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="274" y="56" text-anchor="middle">2</text>
    <text x="136" y="80" text-anchor="middle" fill="#b8500f" font-weight="700">i</text>
    <text x="308" y="56">降尾 6 4 2 已是最大 → 只能往左动一位</text>

    <text x="20" y="120">交换</text>
    <rect x="70" y="106" width="40" height="26" rx="5" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="90" y="124" text-anchor="middle">1</text>
    <rect x="116" y="106" width="40" height="26" rx="5" fill="#fdece1" stroke="#b8500f" stroke-width="2"/><text x="136" y="124" text-anchor="middle">4</text>
    <rect x="162" y="106" width="40" height="26" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="182" y="124" text-anchor="middle">6</text>
    <rect x="208" y="106" width="40" height="26" rx="5" fill="#fdece1" stroke="#b8500f" stroke-width="2"/><text x="228" y="124" text-anchor="middle">3</text>
    <rect x="254" y="106" width="40" height="26" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="274" y="124" text-anchor="middle">2</text>
    <text x="308" y="124">降尾里「刚好比 3 大」的是 4，换它 —— 增量最小</text>

    <text x="20" y="188">尾巴反转</text>
    <rect x="70" y="174" width="40" height="26" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="90" y="192" text-anchor="middle">1</text>
    <rect x="116" y="174" width="40" height="26" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="136" y="192" text-anchor="middle">4</text>
    <rect x="162" y="174" width="40" height="26" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="182" y="192" text-anchor="middle">2</text>
    <rect x="208" y="174" width="40" height="26" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="228" y="192" text-anchor="middle">3</text>
    <rect x="254" y="174" width="40" height="26" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="274" y="192" text-anchor="middle">6</text>
    <text x="308" y="192" fill="#1d7a3c" font-weight="700">1 4 2 3 6 —— 就是下一个排列</text>

    <rect x="20" y="212" width="600" height="26" rx="6" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1"/>
    <text x="32" y="229">前缀 1 一个字没动；第 2 位只涨一点点；涨完之后剩下的位置摆成最小 —— 三件合起来才叫「刚好大一点」</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `注意它的接口形状：**就地改容器，回一个真假**。改完的容器就是新的排列，真假告诉你「还能不能再变」。这两条凑在一起，就自然而然地导出一个固定的圈形状 —— do-while：` },
        { t: `code`, lang: `text`, code: `do { 打印当前排列 } while (还能变出下一个);
 ↑ 先进圈打印，再问能不能变 —— 顺序不能倒` },
        { t: `p`, text: `为什么必须是 do-while 而不是 while？因为**起点本身就是一个合法排列**，它得被打印出来。写成 while 的话，进圈前就先叫了一次 next_permutation，最小的那个排列被跳过了 —— 六个只输出五个。这个 off-by-one 是本课最经典的错法，坑栏里第一条就是它。` },
        { t: `p`, text: `另一个设计选择值得夸一句：变不出下一个的时候它**不装作失败就走**，而是顺手把容器重排回最小那个排列。于是「绕回原点」是标准行为，连着跑两遍 do-while 结果一致，不用你手动 sort。` },
        { t: `h2`, text: `演示 1 · 源稿这段：三个数的全部排列` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <algorithm>
#include <vector>
int main() {
    std::vector<int> a = {1, 2, 3};
    std::println("1 2 3 的全部排列:");
    do {
        for (int v : a) std::print("{} ", v);
        std::println("");
    } while (std::next_permutation(a.begin(), a.end()));  // 变不出下一个时返回 false
    return 0;
}` },
        { t: `p`, text: `实测输出六行：1 2 3、1 3 2、2 1 3、2 3 1、3 1 2、3 2 1。数一数正好是 3×2×1 —— 第一个位置三种选法，剩下两个位置两种，最后一个位置没得选。乘法原理就在这儿：**n 个不同元素的排列数是 n 的阶乘**。所以本课任务 1 让你换成四个数，你应该能在跑之前先猜出 24。` },
        { t: `h2`, text: `演示 2 · 数一数四个数有几个排列` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <algorithm>
#include <vector>
int main() {
    std::vector<int> a = {1, 2, 3, 4};
    int n = 0;                                   // 拿计数器代替手点数屏幕
    do {
        ++n;
        for (int v : a) std::print("{} ", v);
        std::println("");
    } while (std::next_permutation(a.begin(), a.end()));
    std::println("一共 {} 个排列", n);
    return 0;
}` },
        { t: `p`, text: `24 行，最后一行是 4 3 2 1 —— 最大的那个排列，下一句打印「一共 24 个排列」。看到「最后一个排列恰好是降序」别当成巧合：字典序的最大者当然是从大到小排好那一个，而这也正是 next_permutation 回 false 的那个位置。加个计数器比数屏幕可靠得多，这种「用一行代码把直觉变成可验证的事实」的习惯，比算法本身更值得带走。` },
        { t: `h2`, text: `演示 3 · 起点换成 3 2 1，翻车现场` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <algorithm>
#include <vector>
int main() {
    std::vector<int> a = {3, 2, 1};              // 起点已经是最大排列
    int n = 0;
    do { ++n; for (int v : a) std::print("{} ", v); std::println(""); }
    while (std::next_permutation(a.begin(), a.end()));
    std::println("跑了 {} 轮，收尾时 a 是 {} {} {}", n, a[0], a[1], a[2]);
    return 0;
}` },
        { t: `p`, text: `实测只跑一轮：打印 3 2 1，然后 next_permutation 发现已是最大，回 false 并**把 a 重排成 1 2 3**，最后一句就是「跑了 1 轮，收尾时 a 是 1 2 3」。所以「起点改成 3 2 1 还能枚举全排列吗」的答案是：这个 do-while 不能，它只给你一个排列。这也解释了「绕回最小」那条设计的用处 —— 此时再跑一遍演示 1 那个圈，六个排列一个不少。想要从任意起点走完全部排列，老实先 sort 一下再进圈。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `用 while 代替 do-while，最小的那个排列凭空消失 —— 六个变五个、二十四个变成二十三个。圈里那句「先做事再问能不能变」不是风格，是**当前排列必须被处理一次**这件事本身。`,
          `起点不是最小排列，于是只枚举到「从起点往后」的那一段，前面的全漏了，而且**一个错都不报**。这坑阴在它跑起来完全正常：圈照跑、输出照有，只是少了一半。要么从 sort 好的序列起步，要么先确认你确实只要后半段。`,
          `圈跑完后拿 a 当「原来的排列」用。圈退出时 a 已经绕回最小了 —— 你那份顺序早被吞掉。需要在圈里用原始排列的，先复制一份留底。`,
          `元素有重复时以为该有 n 的阶乘个。实测 1 1 2 只给 3 个排列（1 1 2、1 2 1、2 1 1），因为 next_permutation 走的是**值**的字典序，两个 1 互换不算新排列。想要「不同位置的排列」得改成给元素编号。`,
          `把它当「排序」用。next_permutation 只往前走一格，不是把容器整理成有序；容器乱序时它照样给你一个「下一个」，只是那已经不是你以为的那个序列的下一个了 —— 又是第 109 课那条「字典序这套东西建立在有序之上」的老规矩。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `换成 1 2 3 4，数数一共几个排列（应该是 24）。先在纸上按乘法原理算一遍 4×3×2×1，再跑代码核对，最后一行输出应该是 4 3 2 1。`,
          `把初始值改成 3 2 1 还能枚举全排列吗？试试看，并用「跑了 1 轮」那句输出解释清楚：为什么只打印一行、以及圈结束时数组为什么变成了 1 2 3。`,
          `延伸一：试试 std::prev_permutation，起点用 3 2 1，看它是不是照着字典序往回走，走的顺序恰好是演示 1 那六行的倒序。`,
          `延伸二：拿 0 0 1 1 这种「掩码」当排列来枚举 —— 每次把值为 1 的下标打出来，就是「从 4 个里选 2 个」的全部组合，实测给出 6 组。这套招数是把组合问题塞进全排列机器的标准做法。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：next_permutation 用「降尾往左借一位、换成最小增量、尾巴倒序取最小」造出刚好大一点的排列；起点必须是最小的那个，圈必须是 do-while。` }
      ]
    },
    {
      id: `m111`, title: `第 111 课 · 数值算法与前缀和：把加法换成一次减法`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会用 std::gcd、std::lcm 和 std::partial_sum，理解前缀和「先花一遍加法建表、之后每次查询只做一次减法」这笔买卖为什么划算。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `这一族算法住在 <numeric> 里 —— 第 107 课你从那里领走了 accumulate，本课领 gcd、lcm 和 partial_sum。名字有点骗人：numeric 听着像「数学函数库」，其实它是「在一段区间上做累计/求公共因子」这类算法的家。` },
        { t: `p`, text: `**最大公约数**靠辗转相除，快得离谱。求 24 和 36 的公因子：36 除以 24 余 12，问题就变成「24 和 12 的公因子」；24 除以 12 余 0，停 —— 答案 12。凭什么能这样换？因为 a 和 b 的任何一个公因子，必然也能整除「a 减去若干个 b」剩下的余数：能同时整除两个数，就能整除它们的差。所以换完之后**公因子的集合一个没变**，而数字每轮至少掉一半量级，几步就见底了。std::lcm 是它搭着卖的：最小公倍数 = 一个数除以 gcd 再乘另一个 —— 注意**先除后乘**，先乘再除在 int 里很容易溢出去。` },
        { t: `p`, text: `前缀和是本课的正主，思路只有一句：**先把「从头到这里一共多少」全部算好存进表，之后问任何区间的和，一律用两次查表加一次减法。** 表叫 pre，规矩是 pre 的第 i 格存「前 i 个元素的和」，而 pre 有 n+1 格、第 0 格放 0。` },
        { t: `code`, lang: `text`, code: `a  =        1   2   3   4   5
pre =  0   1   3   6  10  15      ← pre[i] = 前 i 个的和，多出来的第 0 格是 0
      ↑哨兵

问「第 2 到第 4 个的和」：pre[4] - pre[1] = 10 - 1 = 9   ← 就是 2 + 3 + 4
通用式：第 l 到第 r 个 = pre[r] - pre[l-1]              ← 下标比元素号大 1，别记混` },
        { t: `p`, text: `为什么「减」能代替「加」？因为 pre[r] 里已经把第 1 到第 r 个全加进去了，而 pre[l-1] 恰好是其中「不该要的那段」—— 前 l-1 个。把多出来的头一段铲掉，剩下的就是你要的区间。**减法在这里不是技巧，它是加法的逆运算在起作用。**` },
        { t: `p`, text: `那格 pre[0] = 0 看着多余，其实是这张表最值钱的一格。有了它，「从第 1 个开始问」这种查询也能套同一个式子：pre[r] - pre[0]，不用写 if。少一个特判就少一个出错的地方 —— 这类「摆一个空哨兵，把边界情况并进通用情况」的手法你在第 86 课的筛法里已经见过一次，以后还会反复遇到。` },
        { t: `svg`, caption: `pre 的每一格是「从头到这格末尾」的累计量。要中间一段，就拿右端点的累计减去左端点之前那一格的累计 —— 多算的头一段被整段铲掉`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240">
  <text x="20" y="22" font-size="13" font-weight="700" fill="#142639">前缀和：问第 2 到第 4 个，pre[4] 减 pre[1]</text>
  <g font-size="12" fill="#26405a">
    <text x="20" y="60">a</text>
    <rect x="70" y="46" width="44" height="26" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="92" y="64" text-anchor="middle">1</text>
    <rect x="116" y="46" width="44" height="26" rx="5" fill="#fdece1" stroke="#b8500f" stroke-width="2"/><text x="138" y="64" text-anchor="middle">2</text>
    <rect x="162" y="46" width="44" height="26" rx="5" fill="#fdece1" stroke="#b8500f" stroke-width="2"/><text x="184" y="64" text-anchor="middle">3</text>
    <rect x="208" y="46" width="44" height="26" rx="5" fill="#fdece1" stroke="#b8500f" stroke-width="2"/><text x="230" y="64" text-anchor="middle">4</text>
    <rect x="254" y="46" width="44" height="26" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="276" y="64" text-anchor="middle">5</text>
    <text x="184" y="86" text-anchor="middle" fill="#b8500f" font-weight="700">要这一段 = 9</text>

    <text x="20" y="124">pre</text>
    <rect x="70" y="110" width="44" height="26" rx="5" fill="#eaf3fb" stroke="#00599c" stroke-width="2"/><text x="92" y="128" text-anchor="middle">0</text>
    <rect x="116" y="110" width="44" height="26" rx="5" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="138" y="128" text-anchor="middle">1</text>
    <rect x="162" y="110" width="44" height="26" rx="5" fill="#e8eef8" stroke="#8b98ab" stroke-width="1.5"/><text x="184" y="128" text-anchor="middle">3</text>
    <rect x="208" y="110" width="44" height="26" rx="5" fill="#e8eef8" stroke="#8b98ab" stroke-width="1.5"/><text x="230" y="128" text-anchor="middle">6</text>
    <rect x="254" y="110" width="44" height="26" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="276" y="128" text-anchor="middle">10</text>
    <rect x="300" y="110" width="44" height="26" rx="5" fill="#e8eef8" stroke="#8b98ab" stroke-width="1.5"/><text x="322" y="128" text-anchor="middle">15</text>
    <text x="92" y="150" text-anchor="middle" fill="#00599c" font-weight="700">哨兵</text>
    <text x="138" y="166" text-anchor="middle" fill="#00599c">pre[1] —— 不要的头一段</text>
    <text x="276" y="166" text-anchor="middle" fill="#1d7a3c">pre[4] —— 前四个全在里面</text>

    <rect x="376" y="46" width="248" height="120" rx="8" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1"/>
    <text x="390" y="70">建表：一遍加法，n 次</text>
    <text x="390" y="92">查询：一次减法，不看区间多长</text>
    <text x="390" y="118">问一次：圈加 3 个数，够了</text>
    <text x="390" y="140">问一千次：圈要加三千个数</text>
    <text x="390" y="160">前缀和：三千次减法变一千次</text>
    <text x="20" y="200" fill="#1d7a3c" font-weight="700">代价只有两点：多养一张 n+1 格的表，以及数据一改就得重算表。</text>
    <text x="20" y="222" fill="#33465e">所以这套「预处理」专治「数据不动、查询很多」的活 —— 报表、统计、区间题。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `这是一笔**用空间换时间**的买卖：先花一遍加法把答案存起来，把每次查询的代价从「区间长度」压成常数。它跟第 97 课那种「先建一张 map，之后查起来一句话」是同一种思路 —— 把重复劳动一次性做完，之后只付查表的钱。判据也很清楚：**数据不变、查询很多**就值得建表；数据一改就得重算，那就亏。` },
        { t: `p`, text: `std::partial_sum 的签名正好把这件事说透了：源区间、加上**写到哪里**。源和目标不许重叠，这一点跟第 108 课那些算法一样 —— 你要结果跟原数据并存，就得给它一个自己的容器。源稿那句 partial_sum(a.begin(), a.end(), pre.begin() + 1) 里的 **+ 1 不是笔误**：pre 的第 0 格要让给哨兵，所以累计结果从第 1 格开始写。` },
        { t: `h2`, text: `演示 1 · 源稿这段：gcd、lcm 和第一张表` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <numeric>
#include <vector>
int main() {
    std::println("gcd(24, 36) = {}", std::gcd(24, 36));
    std::println("lcm(4, 6)   = {}", std::lcm(4, 6));
    std::vector<int> a = {1, 2, 3, 4, 5};
    std::vector<int> pre(a.size() + 1, 0);              // pre[i] = 前 i 个的和
    std::partial_sum(a.begin(), a.end(), pre.begin() + 1);
    std::println("第 2~4 个的和 = {} - {} = {}",
                 pre[4], pre[1], pre[4] - pre[1]);      // 一减出答案
    return 0;
}` },
        { t: `p`, text: `实测四行：12、12、然后「第 2~4 个的和 = 10 - 1 = 9」。那个 9 就是 2 + 3 + 4，你数三个数要三次加法，这里只减了一次。注意 pre 声明成 n+1 格、初值全 0 —— 少给一格，partial_sum 就会写到别人的地盘上去。` },
        { t: `h2`, text: `演示 2 · 把整张表摊开看（任务 1）` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <numeric>
#include <vector>
int main() {
    std::vector<int> a = {1, 2, 3, 4, 5};
    std::vector<int> pre(a.size() + 1, 0);
    std::partial_sum(a.begin(), a.end(), pre.begin() + 1);
    for (size_t i = 0; i < pre.size(); ++i) std::print("pre[{}]={} ", i, pre[i]);
    std::println("");
    std::println("第 1~3 个：{} - {} = {}", pre[3], pre[0], pre[3] - pre[0]);
    std::println("第 4~5 个：{} - {} = {}", pre[5], pre[3], pre[5] - pre[3]);
    return 0;
}` },
        { t: `p`, text: `输出是 pre[0]=0 pre[1]=1 pre[2]=3 pre[3]=6 pre[4]=10 pre[5]=15，两笔查询分别是 6 和 9。这张表读法只有一句：**下标 i 那一格是「前 i 个数加完的结果」。** 所以 pre[5] 是全部五个数的和，pre[0] 是「一个数都没加」= 0。顺带一句自检招数：表最后一格应该等于 accumulate 的总和，两个不一样就是偏移写错了 —— 这种拿另一条路算一遍再对账的习惯，在数值代码里比测试还便宜。` },
        { t: `h2`, text: `演示 3 · 一次减法 vs 老老实实加一遍（任务 2）` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <numeric>
#include <vector>
int main() {
    std::vector<int> a = {1, 2, 3, 4, 5};
    std::vector<int> pre(a.size() + 1, 0);
    std::partial_sum(a.begin(), a.end(), pre.begin() + 1);
    std::println("前缀和：pre[5] - pre[2] = {} - {} = {}", pre[5], pre[2], pre[5] - pre[2]);
    int sum = 0, steps = 0;                          // 老办法：从第 3 个加到第 5 个
    for (int i = 2; i < 5; ++i) { sum += a[i]; ++steps; }
    std::println("老办法：加了 {} 个数才拿到 {}", steps, sum);
    return 0;
}` },
        { t: `p`, text: `两行都是 12，一行只做了 1 次减法，另一行做了 3 次加法。五个数看不出差别，把 a 换成一千个数、查询换成一千笔，老办法就是**一百万次加法**，前缀和是一千次减法加一遍建表 —— 这就是源稿那句「问 1 次：循环划算；问 1000 次：前缀和碾压」。盈亏点也很朴素：查询次数乘区间长度明显大于数据长度时，建表。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `pre 只开了 n 格。partial_sum 从 pre.begin() + 1 开始写 n 个结果，最后一个是写到第 n 格 —— 表只有 n 格就是越界写。症状飘忽：程序可能照跑，然后在一脸无辜的地方崩。规矩背死：**pre 的长度永远是 n+1，第 0 格留给哨兵。**`,
          `下标偏移一格搞反，把「第 2 到第 4 个」写成 pre[4] - pre[2]，少算了第 2 个。口诀是 **pre 的下标比「第几个」多 1**：第 l 到第 r 个 = pre[r] - pre[l-1]。写完拿一个手算得过的小区间验一次，比盯代码管用。`,
          `区间和用 int 存，数据一大就翻负数。一百万个一万一的数加起来早就超出 int 的范围，而且不报错，只是给你个负数。表声明成 long long，累加时留意 partial_sum 用的是元素类型 —— 想按 64 位累加，就把源数据本身放进去。`,
          `以为 std::gcd 会约分、std::lcm 会通分，其实是两个纯整数运算，且对 0 有约定：gcd 传两个 0 得 0，lcm 只要有一边是 0 就得 0。程序里拿 lcm 当分母用的时候，这个 0 会变成除零。`,
          `数据中途改了还继续用旧表。前缀和是**快照**，插一个元素、改一个值，整张表从那个位置往后全错，而程序一声不吭。要么改完重建表，要么承认这题不适合前缀和 —— 那类「边改边问」的活属于以后再讲的树状数组和线段树。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `打印整个 pre 数组，说说每个位置存的什么：a 是 1 2 3 4 5 时，pre 从 0 到 15 六格各自的含义，用一句话讲清「前 i 个」这个读法。`,
          `求「第 3 到第 5 个元素的和」，只许用一次减法 —— pre[5] - pre[2]，跑出 12，并解释为什么左边减的是 pre[2] 而不是 pre[3]。`,
          `延伸一：用 accumulate 求 a 的总和，跟 pre 的最后一格对账，确认两者相等。`,
          `延伸二：把 a 换成 2 4 6 8 10，问三笔查询（第 1~2、第 2~4、第 4~5），全部只用一次减法完成，再拿手算逐个验证。`,
          `延伸三：手写一个 gcd 的圈 —— while 里「老的 b 变成 a，a 除以 b 的余变成 b」，跑出来跟 std::gcd 一致。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：前缀和把「区间和」变成「两个前缀相减」，多花一张 n+1 格的表，换每次查询常数时间；哨兵那格 0 是让边界情况不用特判的关键。` }
      ]
    },
    {
      id: `m112`, title: `第 112 课 · 类的骨架：private 是锁住的零件，public 是按钮`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：写出第一个类 —— 把数据锁进 private、只在 public 开放几个按钮，并说清「别人只能通过按钮操作我」这条设计到底买到了什么。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `到这里为止的一百一十一课，你的程序一直是**两堆东西**：一堆数据（变量、vector、第 83 课那张 struct 名片），一堆函数（怎么加工它们）。两堆并排放着，谁都能伸手改任何数据。今天换一种组织方式：**把数据和「唯一被允许动它的函数」打包成一个东西**，外面的人只准通过那几个函数跟它打交道。这个东西叫 class，类。` },
        { t: `p`, text: `源稿的比喻很准：**一台自动售货机。** 货道和钱箱是它的家底，铁皮箱把它们锁住 —— 那是 private，你在机器外面碰不到。投币口、选择键、取货口是 public，是你唯一能操作它的方式。你按下「B3」，机器内部怎么找零不用你知道，也**不允许**你伸手进去自己扒拉货道。` },
        { t: `p`, text: `语法上就三条新东西：class 类名 开始、结尾**必须带一个分号**；public: 与 private: 不是形容词而是**分界线**，下面写的东西都归这个区，直到遇见下一个标签；写在类里面的函数叫**成员函数**，它能直接用同一个类里的成员变量，不需要谁把它递给谁。` },
        { t: `code`, lang: `text`, code: `class Score {
public:                                  ← 这一段是按钮，外面能碰
    void add(int n) { done_ += n; }       直接用成员变量，不用递
    int done() const { return done_; }    ← const 承诺：这个按钮只让看，不让改
private:                                 ← 这一段是锁住的零件，外面碰不到
    std::string subject_ = "未命名";       声明处直接给默认值
    int total_ = 100;
    int done_ = 0;
};                                       ← 这个分号不是装饰，漏了编译不过` },
        { t: `p`, text: `三处细节得单独说。成员变量后面的等号是**默认值** —— 对象一诞生这几个格子就已经是「未命名」、100、0，本课因此能先只写「一台出厂就配置好的机器」，把「出生时怎么定制」留到下一课。函数名后面那个 **const** 不只是注释：标了它才允许在只读的对象上调用。名字尾部那条下划线是规矩：done 是按钮、done_ 是零件，一眼分清对外承诺与内部家底。` },
        { t: `svg`, caption: `铁皮箱就是访问边界：外面的代码只能通过 public 那三个按钮递消息进去，改数据的路径只剩一条，所以校验规则也只需要写一处`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 244">
  <text x="20" y="22" font-size="13" font-weight="700" fill="#142639">一台 Score：外面只有按钮，里面才是零件</text>
  <rect x="150" y="40" width="300" height="164" rx="12" fill="#eaf3fb" stroke="#00599c" stroke-width="2.5"/>
  <text x="300" y="60" text-anchor="middle" font-size="12" font-weight="700" fill="#00599c">public 区 —— 按钮</text>
  <g font-size="12" fill="#26405a">
    <rect x="170" y="70" width="260" height="24" rx="5" fill="#ffffff" stroke="#00599c" stroke-width="1.5"/><text x="300" y="86" text-anchor="middle">add(int n) —— 记 n 个</text>
    <rect x="170" y="98" width="260" height="24" rx="5" fill="#ffffff" stroke="#00599c" stroke-width="1.5"/><text x="300" y="114" text-anchor="middle">done() const —— 只看</text>
    <text x="300" y="146" text-anchor="middle" font-size="12" fill="#8b98ab">· · · · · ·  访问边界  · · · · · ·</text>
    <text x="300" y="166" text-anchor="middle" font-size="12" font-weight="700" fill="#b8500f">private 区 —— 锁住的零件</text>
    <rect x="170" y="174" width="260" height="22" rx="5" fill="#fdece1" stroke="#b8500f" stroke-width="1.5"/><text x="300" y="190" text-anchor="middle">subject_ = 未命名</text>
    <rect x="170" y="200" width="126" height="0" fill="none"/>
    <text x="30" y="86">main</text>
    <path d="M88 82 H146" stroke="#1d7a3c" stroke-width="2.5"/><polygon points="146,82 136,76 136,88" fill="#1d7a3c"/>
    <text x="24" y="108" fill="#1d7a3c" font-weight="700">s.add(30)</text>
    <text x="24" y="126">s.done() 可以</text>
    <path d="M86 122 H146" stroke="#1d7a3c" stroke-width="2" stroke-dasharray="4 3"/><polygon points="146,122 136,116 136,128" fill="#1d7a3c"/>
    <text x="24" y="150" fill="#b8500f" font-weight="700">s.done_ = 9999</text>
    <text x="24" y="168" fill="#b8500f">编译当场拦住</text>
    <path d="M86 146 H134" stroke="#b8500f" stroke-width="2.5"/><polygon points="140,148 130,142 130,154" fill="#b8500f"/>
    <text x="112" y="176" font-size="16" fill="#b8500f" font-weight="700">×</text>
    <text x="470" y="86">改 done_ 的路径</text>
    <text x="470" y="104">只剩 add 一条</text>
    <text x="470" y="122">→ 规则写在函数里</text>
    <text x="470" y="140">→ 别人改不动你的规矩</text>
    <text x="470" y="186" fill="#33465e">外壳是承诺，内部是私事：</text>
    <text x="470" y="204" fill="#33465e">换一套零件，按钮一个不用改。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `先破一个误解：private **不是防坏人，是防自己**。你在 main 里写 s.done_ = 9999 没人罚你，编译器拦你恰恰是因为 —— 那一刻你绕过了一切规则，这台机器之后给出的每个数字都不再可信。封装买到的是「**这个类的状态永远不会自相矛盾**」：只要 done_ 只能被 add 改，add 里那条「不许超过满分」就永远成立，写 done() 的人可以放心依赖它。` },
        { t: `p`, text: `于是划分 public 和 private 的问题不是「写起来方不方便」，而是「**别人依赖了它，我以后改内部会不会伤到他**」。按钮是承诺，要少而稳；零件是私事，随时能换。源稿把三个字段全锁起来只留两个按钮，就是在说：想知道进度，问 done() 就够了 —— 至于进度用一个 int 存还是将来换成两个，那是机器的私事。` },
        { t: `p`, text: `顺手把第 87 课那个 struct 摆正位置：struct 和 class **只差默认访问级别** —— struct 不写标签时默认全 public，class 默认全 private，其余语法一模一样。所以你早就写过类的另一半，只是没锁门而已。` },
        { t: `h2`, text: `演示 1 · 源稿这段：一台售货机诞生` },
        { t: `code`, lang: `c++`, code: `class Score {                               // 头文件请了 <print> 和 <string>
public:
    void add(int n) { done_ += n; }        // 按钮：让进度 +n
    int done() const { return done_; }     // 按钮：只让看，不让改
private:
    std::string subject_ = "未命名";        // 声明处直接给默认值
    int total_ = 100;                       // 对象一出生就带这些值
    int done_ = 0;
};` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
int main() {
    Score s;                                // 一台售货机诞生，三个零件都是默认值
    s.add(30);                              // 按按钮，而不是伸手进箱子改 done_
    std::println("进度 = {}", s.done());
    return 0;
}` },
        { t: `p`, text: `实测输出「进度 = 30」。三行主戏值得逐个看：**Score s;** 造出一台机器，此刻 done_ 已经是 0、total_ 已经是 100，你一行初始化都没写；**s.add(30);** 是唯一一次改动，走的是按钮；**s.done()** 读回来 30。注意 Score 跟 int、std::string 一样能声明变量 —— 但它是**你自己造的类型**，这是这门课到此为止最大的一步：以前你在语言给的世界里写程序，现在开始往里添新类型。` },
        { t: `h2`, text: `演示 2 · 伸手进箱子，看编译器怎么拦（任务 1）` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    Score s;                                // 上一段那个类
    s.done_ = 9999;                         // 想绕过按钮，直接改零件
    std::println("进度 = {}", s.done());
    return 0;
}` },
        { t: `p`, text: `实测 g++ 的原文是：**error: 'int Score::done_' is private within this context**，后面还跟一句 note: declared private here，指着那行 int done_ = 0; 给你看。把 private 改成 public 就编得过，s.done() 会打印 9999。哪种更安全，答案不在「9999 是不是你想要的数字」里，而在**这台机器已经不再保证任何事**：满分 total_ 才 100，进度却 9999，之后拿 done() 去除以 total() 算完成率的每一行代码都跟着胡说。按钮的意义就是把「不许这样」写进编译期，而不是写在注释里求人别碰。` },
        { t: `h2`, text: `演示 3 · 把规矩写进按钮，两台机器互不干扰` },
        { t: `code`, lang: `c++`, code: `class Score {                       // 接在 include 之后，配合上一段的 main
public:
    void add(int n) {                          // 唯一的改值入口，规矩只写这一处
        if (n < 0) return;                      // 倒退一律拒绝
        done_ += n; if (done_ > total_) done_ = total_;   // 加完夹住，不许超满分
    }
    int done() const { return done_; }
    int left() const { return total_ - done_; }
private:
    int total_ = 100;
    int done_ = 0;
};` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    Score a; Score b;                 // 两台独立的机器，各有一套零件
    a.add(30); b.add(999); b.add(-5);
    std::println("甲：已记 {}，还差 {}", a.done(), a.left());
    std::println("乙：已记 {}，还差 {}", b.done(), b.left());
    return 0;
}` },
        { t: `p`, text: `实测输出「甲：已记 30，还差 70」和「乙：已记 100，还差 0」。两件事同时被验证：**b 按 999 也只到 100**，因为夹住这条规则在 add 里面，而 add 是唯一入口；**a 完全没被 b 影响**，因为每个对象自带一套 done_ 和 total_ —— 类是图纸，对象是照图纸造出来的那台机器。后面那句 b.add(-5) 被 return 直接挡在门外：你可以把「进度不会倒退、不会超满分」当成事实来依赖，这就是把校验写进类里、而不是写进八个调用点的差别。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `class 结尾那个分号漏了。实测报错是 **expected ';' after class definition**，位置指着右花括号那一行；有时候它还会把错推到你后面第一句莫名其妙的代码上。类定义是一条**语句**，语句要有分号 —— 跟函数定义不要分号这件事正好相反，最容易记混。`,
          `把 public 和 private 放反，或者零件写在 public 区。程序照样跑，封装直接归零：外面谁都能 s.done_ = 9999。判断标准很简单 —— **凡是能让对象变得自相矛盾的字段，一律锁起来。**`,
          `只读的按钮忘写 const。给函数递一个 const 的对象时，编译器不让你调没标 const 的成员函数，报错长相是 passing 'const Score' as 'this' argument discards qualifiers 这一类。反过来，在标了 const 的函数里改 done_ 也会当场被拦 —— 这个承诺是双向的。`,
          `给每个零件都开一个 get 和一个 set。看着像封装，实际是把 private 的门又拆了一遍：别人照样能 set 出任何值，规矩还是没人守。按钮要按**业务动作**开（add、left），不是按字段开。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把 private 改成 public 试试：直接写 s.done_ = 9999 编译能过吗？想想哪种更安全 —— 说清「哪种情况会让 9999 这种数字悄悄毁掉后面所有计算」，并解释按钮为什么比注释靠得住。`,
          `延伸一：给类加一个只读按钮 left()，再用 add(999) 验证进度被夹在满分上、left() 返回 0，全过程一行赋值都没写在类外面。`,
          `延伸二：造两个 Score 分别 add 不同的数，打印各自的 done()，确认它们互不干扰 —— 这就是「图纸与机器」的区别。`,
          `延伸三：在 main 里试着读 subject_ 和 total_，看清报错原文，然后给它们各开一个带 const 的按钮，比较两种写法的可读性。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：类 = 数据 + 唯一被允许动它的那些函数；private 保证外面造不出矛盾状态，public 是你向使用者做的承诺，而 const 按钮是「只让看不让改」的承诺。` }
      ]
    }
  ]
};



