/* 喵站 · C++ 掌握 正文分部 p01：第 82 课（第九轮 T-23 掌握课黄金样板）
 *
 * 源稿：学习资料/C++入门/82_算法三件套.cpp。款式与规矩同入门 p01.js（六栏课式、
 * 反引号里不许出现反引号、交叉引用只许往回指、构造首现闸 allowConstructs 点名例外）。
 *
 * 这一课是「掌握」课的第一课，有两个特别要交代的：
 *   1. 它是入门课 lambda（第 56–58 课）与 vector（第 40 课起）的第一次合流 —— 开篇就把这条线挑明；
 *   2. 算法的「范围 = 头 + 尾」这一套，是后面 100 多课的地基，讲细一点不亏。
 */
window.MIAO_CPPM_P01 = {
  chapters: [
    {
      id: `m82`, title: `第 82 课 · 算法三件套：count_if / find_if / transform`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把 lambda 当「条件」或「加工器」喂给标准算法 —— 从此数、找、改这三件事不用自己写循环。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `从这一课起你正式进「掌握」课。入门课里你已经会自己写 for 循环数东西、找东西、改东西了；这门课要教的是**别再自己写**——标准库早把这些活干好了，而且干得比你稳。分工记一句话：**算法负责干活，lambda 负责说「什么算数」**。` },
        { t: `p`, text: `std:: 开头的那一族函数统称**标准算法**（住在 algorithm 这个头文件里）。本课的三个是最高频的一组：` },
        { t: `ul`, items: [
          `**std::count_if** —— 数一数有几个满足条件的（if 就是「你来定条件」）。`,
          `**std::find_if** —— 找第一个满足条件的，找到给你个位置，找不到给你「_end 位置」当「没有」。`,
          `**std::transform** —— 把每个元素按规则加工一遍（加工规则也由你给）。`
        ]},
        { t: `p`, text: `三个的**喂法一模一样**：先给范围的头，再给范围的尾，最后给那个 lambda。为什么头尾都要给？因为 C++ 的规矩是「**尾后指向第一个不属于你的位置**」，取头不含尾。` },
        { t: `code`, lang: `text`, code: `std::count_if( nums.begin(),        nums.end(),          [](int v){ return v % 2 == 0; } );
            └ 范围的头     └ 范围尾后一位        └ 你给的条件：什么算数` },
        { t: `p`, text: `这个「头 + 尾后」的写法叫**迭代器**（iterator），你可以先当成「范围的起止两把尺子」来用。它背后是入门课第 73–77 课那套内存与指针的规矩，现在不必回头补课，用熟了再往后你会自然打通。` },
        { t: `svg`, caption: `六个数的范围：头指第一格，尾后指最后一格的下一格；那个虚线格子不属于这段数据`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 236">
  <g font-size="13" fill="#142639">
    <text x="24" y="24" font-weight="700">范围 = 头 + 尾后，取头不含尾</text>
  </g>
  <g font-size="12" text-anchor="middle">
    <text x="80" y="52" fill="#00599c" font-weight="700">头 ↓ nums.begin</text>
    <text x="440" y="52" fill="#b8722b" font-weight="700">尾后 ↓ nums.end</text>
  </g>
  <g font-size="13" text-anchor="middle">
    <rect x="50" y="64" width="60" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="80" y="90">5</text>
    <rect x="110" y="64" width="60" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="140" y="90">2</text>
    <rect x="170" y="64" width="60" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="200" y="90">8</text>
    <rect x="230" y="64" width="60" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="260" y="90">1</text>
    <rect x="290" y="64" width="60" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="320" y="90">9</text>
    <rect x="350" y="64" width="60" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="380" y="90">6</text>
    <rect x="410" y="64" width="60" height="40" fill="#fffdf5" stroke="#b8722b" stroke-dasharray="5 4"/><text x="440" y="90" fill="#b8722b">这一格</text>
    <text x="524" y="90" fill="#b8722b" font-size="12" text-anchor="start">不属于你</text>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="24" y="136">格子数 = 尾后 减 头 = 6，可最后一个能取的下标只到 5 —— 差的那一格正是「尾后」</text>
    <text x="24" y="162">空范围时头与尾后重合，格子数 0：这就是尾后那个位置绝不能取值的根本原因</text>
    <text x="24" y="188">标准算法全家都收这一对：先说从哪儿开始，再说到哪儿为止，而且不含止点</text>
    <text x="24" y="216" font-weight="700" fill="#1a7f42">喂法固定三段：头、尾后、你的规则 —— 中间永远是一段左闭右开的区间</text>
  </g>
</svg>` },
        { t: `p`, text: `为什么非要「不含尾」而不写「最后一个格子」？两个好处，这一课就能看见。一是**空范围有地方放**：头和尾后重合，长度天然就是 0，不用另写一个「有没有」的标记；二是**两段能接起来**：第一段给到某格为止，第二段正好从那格开始，边界不重不漏。C++ 的容器和算法全体按这一套说话，你习惯了它，后面几百课的函数签名都不用重新学。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `p`, text: `往实际场景想：成绩单里数有几个不及格、单词表里找第一个超过 8 个字母的、把一列价格全部打八折 —— 分别是 count_if、find_if、transform 的活。你以后写到的任何「对一堆东西做同一件事」的程序，底座都是这三件套的变体。` },
        { t: `h2`, text: `演示 1 · 三件套跑起来` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> nums = {5, 2, 8, 1, 9, 6};
    auto evens = std::count_if(nums.begin(), nums.end(),
                               [](int v) { return v % 2 == 0; });
    std::println("偶数 {} 个", evens);
    auto it = std::find_if(nums.begin(), nums.end(),
                           [](int v) { return v > 5; });
    if (it != nums.end()) std::println("第一个大于 5 的: {}", *it);
    return 0;
}` },
        { t: `p`, text: `输出两行：「偶数 3 个」（2、8、6）和「第一个大于 5 的: 8」。注意两处细节：count_if **返回一个数**，所以用 auto 接；find_if **返回一个位置**，所以拿它和 nums.end() 比 —— **等于 end 就是没找到**，这是标准算法全家通用的「没有」暗号，后面几百课都这么判。` },
        { t: `p`, text: `那句 *it 里的星号是**取值**：it 是「位置」，*it 才是「那个位置上的数」。入门课第 74 课指针那个星号，在这儿干的同一件事。` },
        { t: `h2`, text: `演示 2 · transform 把每个数加工一遍` },
        { t: `code`, lang: `c++`, code: `std::vector<int> nums = {5, 2, 8, 1, 9, 6};
std::vector<int> sq;                          // 放结果的盒子，先空着

std::transform(nums.begin(), nums.end(),       // 读哪段
               std::back_inserter(sq),          // 写去哪
               [](int v) { return v * v; });    // 怎么加工

for (int v : sq) std::print("{} ", v);          // 25 4 64 1 81 36
std::println("");` },
        { t: `p`, text: `transform 有**三头**：读的范围、写的去处、加工的规则。写去处这里用了 std::back_inserter(sq)，意思是「每次算出的结果都追加到 sq 尾巴上」—— 这样 sq 自己伸缩，不用先算好要几个格子。这是本课唯一一个新面孔，背下来就够用：**往空 vector 里灌结果，去处就写 std::back_inserter(那个盒子)**。` },
        { t: `p`, text: `std::print 和 std::println 的差别在入门课讲过：print 打完不换行，println 打完换一行。这里用 print 把六个数排成一行，最后补一个 println 收尾。` },
        { t: `h2`, text: `演示 3 · 三个返回三种东西` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> nums = {1, 3, 5};
    auto it = std::find_if(nums.begin(), nums.end(), [](int v) { return v > 100; });
    if (it == nums.end()) std::println("一个都没找到，先别取值");
    else std::println("找到了: {}", *it);
    return 0;
}` },
        { t: `p`, text: `这一版跑的是「全都不满足」的名单，走的是 if 上面那支。把 100 改成 4，才走 else 打出 5。看起来只是几行 if，其实它把本课最容易出事的一步钉死了：**find_if 给回来的「没有」长得很像「有」** —— 它不是空值、不是 -1、也不是 false，就是一个合法的尾后位置，类型和找到的时候一模一样，编译器一句都不会提醒你。能提醒你的只有你自己写下的那行比较。把三个的返回形状并排记一次，以后就不必猜了：` },
        { t: `ul`, items: [
          `**count_if** 返回一个**数**（几个满足条件），直接拿去打印、拿去比大小都行。`,
          `**find_if** 返回一个**位置**，必须先和 end 比一次才谈得上取值，取的时候前面加星号。`,
          `**transform** 返回**写到了哪儿**（也是位置），本课没用到它的返回值；结果在 sq 里，看 sq 就够了。`
        ]},
        { t: `p`, text: `还有一条贯穿整门课的性格，这里先挑明：**这三个算法都不碰容器本身**。count_if 只汇报数字，find_if 只告诉你在哪儿，transform 只把算出来的东西写到「去处」——nums 从头到尾没被改过一个数，也没多出一格。想真的往容器里加东西、删东西，得靠 std::back_inserter 那种「会自己伸缩的笔」，或者回到成员函数 push_back。为什么这么设计？因为容器怎么长、内存怎么挪，是容器自己的事；算法只管「把这段范围上的每个元素按规则过一遍」。分工清楚了，你以后换容器、换范围，同一套算法照样能用。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `忘 #include <algorithm>。count_if / find_if / transform 都住在这个头文件里，少了它编译报「名字找不到」—— 和少 #include <vector> 一个性质。`,
          `find_if 找到结果直接取值不判 end。nums 里一个都不满足条件时，it 等于 nums.end()，*it 取的是「尾后」那个不属于数组的位置 —— 程序可能给你一个乱数，也可能当场崩。**先比 end，再取值**，这是铁规矩。`,
          `transform 的去处给了 sq 本身却没先给它留够格子。写「读哪段」和「写去哪」是两个独立范围，长度不对齐就是越界；拿不准就用 back_inserter。`,
          `以为 count_if 会改动原容器。它只汇报数了几个，nums 一个数都没变；要变的是 transform，它把算出来的结果写到去处，原容器照样不动。`,
          `lambda 的括号里类型写漏。[](v){...} 不写 int，编译器不知道 v 是什么 —— 范围里元素的类型得由你标明（另一种自动推的写法以后再说）。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `用 transform 把 nums 里每个数变成平方，打印结果。`,
          `再用 count_if 数一数平方之后大于 50 的有几个；用 find_if 找第一个平方是两位数的数。`,
          `故意把 nums 换成 {1, 3, 5}，用 find_if 找「大于 100 的数」，验证它返回 end、if 那一行不打印。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：算法负责干活、lambda 说什么算数；喂法都是「头 + 尾后 + 你的规则」，find 回来先比 end 再取值。` }
      ]
    }
  ]
};
