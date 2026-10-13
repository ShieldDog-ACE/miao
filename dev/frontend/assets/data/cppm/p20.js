/* 喵站 · C++ 掌握 正文分部 p20：第 151–152 课（第九轮）
 *
 * 源稿：151_冒泡排序.cpp、152_快速排序.cpp
 * 排序这一节的起点不是「第一次学排序」：第 63–65 课已经手写过冒泡（含 swapped 优化），第 105 课又用过 std::sort。
 * 这两课的写法是「手里的工具齐了，回头算旧账」—— 当年用数组和 int 抄下来的那两遍循环，
 * 今天有 vector（40 课）、引用（66 课）、std::swap 之后重写，干净在哪一行、边界为什么翻车，都说得出来。
 * 所有输出、比较次数、交换次数、递归次数均经本机 g++ -std=c++23 实跑核对。
 */
window.MIAO_CPPM_P20 = {
  chapters: [
    {
      id: `m151`, title: `第 151 课 · 冒泡排序：工具齐了，回头看当年自己写的那两遍循环`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用现在的手艺重写第 63–65 课手写过的那段冒泡，说清 std::swap 凭什么能改动原容器、size_t 的边界在哪种输入上绕回，并把每轮到底跑了多少次比较与交换亲手数出来。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `这一节是回头算旧账。第 63 课你只走了一轮冒泡，第 64 课补成一层一轮排到底、还试过空容器和单元素，第 65 课加过 swapped 提前收工。当时手里的材料是数组、int 和一个手动记着的长度 n；今天你手里有第 40 课起的 vector、第 66 课的引用、第 105 课的标准算法。同一段逻辑再抄一遍，它明显短了 —— 本课要说清的就是**短在哪三行**，以及你当年那种写法**其实一直藏着什么**。` },
        { t: `p`, text: `机制本身一个字没变，还是排队比身高：只问相邻两个人「你俩是不是反了」，反了就换，没反就往前走一格。一轮走到底，最高的那个被一路换着往后送，最后必然站在队尾 —— 不是「大概」，是**必然**：它每碰到一个比自己矮的就往前挪一格，没人拦得住。于是下一轮只需要走到倒数第二个位置，已排好区从右边一格一格长出来。剩下的写法全是在伺候这一句话。` },
        { t: `code`, lang: `text`, code: `if (v[j] > v[j + 1]) std::swap(v[j], v[j + 1]);
         ↑ 只问相邻两个         ↑ 当年手打的三行 tmp 换成一句` },
        { t: `p`, text: `那句 std::swap 是本课的主角。第 66 课的任务就是写 swap(int&, int&)，你亲手验证过把 & 删掉之后两个数纹丝不动 —— 按值传进去的是复制品。今天这句话原样长在排序里：std::swap 收的仍是引用，所以动的确实是容器里那两个格子。第 63 课你手打 tmp 三行时躲过了这一关，因为赋值直接落在原地；一旦封装成函数，引用这一关就躲不掉。**能封装，是因为你终于看懂了它在动谁的东西。**` },
        { t: `svg`, caption: `冒泡的「一轮」到底是什么：每一轮只在相邻两格之间问一句，走到头就把该轮最大的那格送到右边站定；已排好区从右往左长，内层的终点每轮短一格。数字全部是本机实跑的每轮状态与次数`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 316">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">一轮一行：5 2 8 1 9 走完四轮</text>
  <g font-size="12" fill="#26405a">
    <text x="16" y="58" font-weight="700">起始</text>
    <text x="16" y="102" font-weight="700">第 1 轮</text>
    <rect x="170" y="82" width="62" height="30" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="201" y="102" text-anchor="middle">2</text>
    <rect x="234" y="82" width="62" height="30" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="265" y="102" text-anchor="middle">5</text>
    <rect x="298" y="82" width="62" height="30" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="329" y="102" text-anchor="middle">1</text>
    <rect x="362" y="82" width="62" height="30" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="393" y="102" text-anchor="middle">8</text>
    <rect x="426" y="82" width="62" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="457" y="102" text-anchor="middle" fill="#1d7a3c">9</text>
    <text x="500" y="102" fill="#1d7a3c">4 次比较 2 换 —— 9 站定</text>

    <text x="16" y="146" font-weight="700">第 2 轮</text>
    <rect x="170" y="126" width="62" height="30" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="201" y="146" text-anchor="middle">2</text>
    <rect x="234" y="126" width="62" height="30" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="265" y="146" text-anchor="middle">1</text>
    <rect x="298" y="126" width="62" height="30" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="329" y="146" text-anchor="middle">5</text>
    <rect x="362" y="126" width="62" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="393" y="146" text-anchor="middle" fill="#1d7a3c">8</text>
    <rect x="426" y="126" width="62" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="457" y="146" text-anchor="middle" fill="#1d7a3c">9</text>
    <text x="500" y="146" fill="#1d7a3c">3 次比较 1 换 —— 8 站定</text>

    <text x="16" y="190" font-weight="700">第 3 轮</text>
    <rect x="170" y="170" width="62" height="30" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="201" y="190" text-anchor="middle">1</text>
    <rect x="234" y="170" width="62" height="30" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="265" y="190" text-anchor="middle">2</text>
    <rect x="298" y="170" width="62" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="329" y="190" text-anchor="middle" fill="#1d7a3c">5</text>
    <rect x="362" y="170" width="62" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="393" y="190" text-anchor="middle" fill="#1d7a3c">8</text>
    <rect x="426" y="170" width="62" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="457" y="190" text-anchor="middle" fill="#1d7a3c">9</text>
    <text x="500" y="190" fill="#1d7a3c">2 次比较 1 换 —— 已全好</text>

    <text x="16" y="234" font-weight="700">第 4 轮</text>
    <rect x="170" y="214" width="62" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="201" y="234" text-anchor="middle" fill="#1d7a3c">1</text>
    <rect x="234" y="214" width="62" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="265" y="234" text-anchor="middle" fill="#1d7a3c">2</text>
    <rect x="298" y="214" width="62" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="329" y="234" text-anchor="middle" fill="#1d7a3c">5</text>
    <rect x="362" y="214" width="62" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="393" y="234" text-anchor="middle" fill="#1d7a3c">8</text>
    <rect x="426" y="214" width="62" height="30" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="457" y="234" text-anchor="middle" fill="#1d7a3c">9</text>
    <text x="500" y="234" fill="#b8500f">1 次比较 0 换 —— 白走</text>

    <text x="16" y="272" fill="#33465e">全程 10 次比较、4 次交换。4 恰好是这串数的逆序对个数：相邻交换一次只能消掉一个逆序对，实测换成 9 3 7 1 就要 5 次交换、6 次比较。</text>
    <text x="16" y="292" fill="#00599c" font-weight="700">看这一列比较次数：4、3、2、1。内层每轮短一格，靠的就是 j + 1 &lt; v.size() - i 里那个 i。</text>
    <text x="16" y="310" fill="#b8500f">第 4 轮一次交换都没发生 —— 那一轮就是 swapped 标记要砍掉的。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `冒泡被留下的理由不是快，是**每一步都能拿手指点着看**：只做一个动作 —— 相邻两格比一比、必要时换一下。没有下标跳跃、没有额外容器、没有函数自己调自己。这门课后面的排序一个比一个聪明，聪明换来的是「你没法一眼看穿它」，所以先把最朴素这个算法定清楚，之后才知道别人究竟省掉了什么。` },
        { t: `p`, text: `定位也说死：第 105 课的 std::sort 不是冒泡的升级版，本课不比谁快。它留在这里是因为边界最密 —— 上一课第 150 课刚把「边界」列为头号杀手，而这两层循环里就有两处 j + 1、一处减 i、一个无符号 size()，练手正好。` },
        { t: `h2`, text: `演示 1 · 源稿这段：五行 vector 上的冒泡` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <utility>
#include <vector>
int main() {
    std::vector<int> v = {5, 2, 8, 1, 9};
    for (size_t i = 0; i + 1 < v.size(); ++i)          // 一共排 n-1 轮
        for (size_t j = 0; j + 1 < v.size() - i; ++j)  // 每轮比到已排好区前
            if (v[j] > v[j + 1])
                std::swap(v[j], v[j + 1]);             // 前面更大就往后换
    for (int x : v) std::print("{} ", x);
    std::println("");
    return 0;
}` },
        { t: `p`, text: `实测输出 1 2 5 8 9。我给它加了计数器跑一遍：**10 次比较、4 次交换**。这四个交换不是巧合：这串数的逆序对正好是 5/2、5/1、2/1、8/1 四对，相邻交换每次只能修好一对，所以不可能少于 4 次 —— 冒泡正好 4 次，一次不浪费。` },
        { t: `h2`, text: `演示 2 · 逐轮打印：看清已排好区怎么长出来` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <utility>
#include <vector>
int main() {
    std::vector<int> v = {5, 2, 8, 1, 9};
    for (size_t i = 0; i + 1 < v.size(); ++i) {
        for (size_t j = 0; j + 1 < v.size() - i; ++j)
            if (v[j] > v[j + 1]) std::swap(v[j], v[j + 1]);
        std::print("第 {} 轮后：", i + 1);
        for (size_t k = 0; k < v.size(); ++k) std::print("{} ", v[k]);
        std::println("");
    }
}` },
        { t: `p`, text: `实测四行：2 5 1 8 9、2 1 5 8 9、1 2 5 8 9、1 2 5 8 9，各轮比较次数 4、3、2、1。**最后两行一模一样** —— 第 3 轮结束时数组已经好了，第 4 轮纯属白走，这就是 swapped 标记要抓的那一轮。右边每轮站定一格，所以内层短一格：那句 v.size() - i 里的 i 就是已经站定的格数。` },
        { t: `h2`, text: `演示 3 · 第 64 课让你试过空容器，今天说清为什么安全` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
int main() {
    std::vector<int> v;                        // 空容器：size() 是 0
    std::size_t minus = v.size() - 1;          // 无符号数减一：绕到最大
    std::println("v.size() - 1 = {}", minus);
    std::println("0 + 1 < v.size() 是 {}", 0 + 1 < v.size());
}` },
        { t: `p`, text: `实测第一行 18446744073709551615，第二行 0 + 1 &lt; v.size() 是 false。当年 n 是 int，空数组时 n - 1 是 -1，循环条件直接假，代码**碰巧**安全。今天 v.size() 是 size_t —— 无符号，减穿零不报错也不变负，而是绕回类型最大值。谁把内层写成 j < v.size() - i - 1，空容器和单元素容器都能让它一路越界：运气好段错误，运气差把隔壁内存当数据读进来。源稿那句 i + 1 < v.size() 不是风格偏好：**左边是加法，加法永远不会绕。**` },
        { t: `h2`, text: `演示 4 · 本课任务：标记 + 封进一个带引用的函数` },
        { t: `code`, lang: `c++`, code: `void bubble(std::vector<int>& v) {            // 引用：动的就是调用者那一份
    for (size_t i = 0; i + 1 < v.size(); ++i) {
        bool swapped = false;                 // 在轮内声明：每轮自动重置
        for (size_t j = 0; j + 1 < v.size() - i; ++j)
            if (v[j] > v[j + 1]) {
                std::swap(v[j], v[j + 1]);
                swapped = true;
            }
        if (!swapped) break;                  // 一整轮没换：后面不用跑了
    }
}` },
        { t: `p`, text: `接在演示 1 的 main 前面调用，实测三组数字：已经排好的十个数，**带标记 9 次比较，不带 45 次**；近乎有序的 1 到 8 再接 30 和 9，带标记 17 次、不带 45 次；而 5 2 8 1 9 带不带都是 10 次 —— 它的最后一轮正好就是那轮没换的，省不下什么。「基本有序时飞快」这句话的实测长相就是这样：优化只在你能**提前知道已经好了**的时候生效。参数那个 & 也别当装饰：写成 std::vector<int> v 就收进一整份复制，排得再对调用者手里还是原样，而这回复制的不再是四个 int，是整个容器。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `封装交换时把 & 弄丢。实测 void swap_bad(int a, int b) 收两份副本，三行换完函数一退副本就没了，容器一个格子都没动，编译一路绿灯连警告都不给。这正是第 66 课那条结论；认法朴素 —— 参数表里有 & 才叫「我要动你的东西」，标准库的 std::swap 签名里两个 T& 都带着。`,
          `无符号减法绕回。空容器或单元素容器上写 v.size() - 1 或 v.size() - i - 1，实测得到 18446744073709551615，条件一路为真、下标跑出容器外面。两条躲法：全改成加法形态 i + 1 < v.size()，或者函数开头判 v.size() < 2 就 return。`,
          `swapped 声明在外层循环外面、只在进外层前重置一次。实测第一轮换了以后标记永远是 true，break 再也不触发，等于白加一段代码。它必须每轮重新置 false，最稳就是把声明写进外层循环体内，作用域和重置一次解决。`,
          `内层把减 i 丢了。结果照样对 —— 多余那些比较只是把已经站定的最大值又往后送或原地不动 —— 但实测五个元素的比较次数从 10 涨到 16。不报错、不崩，只有计数器里看得见，所以本课让你数。`,
          `比划半天没交换，或者交换了却没比较：手滑写成无条件 swap，跑出来一串没排好的数字还看不出哪错。写完先跑演示 2 那种逐轮打印，看第一行末尾是不是最大的那个数；不是，说明内层根本没走到头。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `加个 swapped 标记：一整轮没发生交换就提前 break，数据基本有序时飞快。跑两组输入确认它真生效 —— 一组 5 2 8 1 9，一组已经排好的十个数，各把比较次数打印出来。`,
          `照演示 2 给每轮末尾打一行，肉眼确认「第 k 轮之后右边 k 格已经站定」，然后回答：为什么第 3 轮和第 4 轮打印出来的数组一模一样。`,
          `延伸一：把 bubble 的参数从 std::vector<int>& 改成 std::vector<int>，跑一遍看调用者手里的数组变不变，说清这次多付了一次什么。`,
          `延伸二：把内层的 i + 1 < v.size() 换成 i < v.size() - 1，拿空容器跑一次，看它是编译报错、运行崩溃，还是安静地越界 —— 说出你观察到哪一个。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：机制还是那句「相邻比一比，反了就换」，但今天写得更短更稳，靠的是三件新武器 —— 边界一律写成加法形态躲开 size_t 绕回，封装成函数就带 &，比较交换交给收引用的 std::swap。` }
      ]
    },
    {
      id: `m152`, title: `第 152 课 · 快速排序：抽一本书当基准，分成两堆，再叫自己来排每一堆`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：看懂「选基准、分两边、递归排」这三步怎么在一段代码里落地，把 if (lo >= hi) return; 那句出口讲明白，并亲手数出一趟快排到底调了几次函数、最深套了几层。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `源稿那个类比很准：整理一摞书，随手抽一本平摊在桌上当基准，比它薄的全部挪到左边、比它厚的挪到右边，然后**对左右两摞各做一遍同样的事**。第三步是关键：不是再排一遍整体，而是把同一个办法用在更小的两摞上。代码里它就是**函数调用自己**，即第 71 课写过 sum_to 的那个递归 —— 快排的正确性天生是这个形状，所以它是递归第一次真派上用场的地方。` },
        { t: `p`, text: `递归只有两个零件，第 71 课那句话一个字没变：**出口**和**每次把问题变小**。出口是第一行那句 if (lo >= hi) return; —— 范围里只剩一个数、或一个都没有，天然有序，直接返回不再往下叫。变小靠分区：收手后 lo 到 j 与 i 到 hi 两段，长度都严格比传进来的小。少任何一件就是无限递归 —— 编译一路绿灯，运行到栈崩掉才告诉你。` },
        { t: `code`, lang: `text`, code: `三步：1 选基准 → 2 分区成两堆 → 3 对每一堆叫自己再来一遍
出口：if (lo >= hi) return;     ← 只剩 0 个或 1 个数：不用排
变小：quick_sort(v, lo, j) 与 quick_sort(v, i, hi)   ← j < i，两堆都比原段短` },
        { t: `p`, text: `分区这一步是这段代码最耐看的地方，它用两只手从两头往中间摸：i 从左边往右找**第一个不该待在左边的**（比基准大的），j 从右边往左找**第一个不该待在右边的**（比基准小的）。两只手都停住，说明这两本书放反了，一次 swap 把它们各送回该去的一边。继续摸到 i 越过 j，中间再没有放反的，「左边一堆、右边一堆」就成形了。基准本身**不需要单独归位**，这是它跟后面的归并、堆排最不一样的一点。` },
        { t: `svg`, caption: `一棵递归树：根节点是整段，分区收手时 j 与 i 把这段切成左右两堆，两堆各自成为新的节点；叶子是长度 0 或 1 的段，被第一行那句出口直接挡回去。全部数字来自本机实跑的逐次打印`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 344">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">5 2 8 1 9 3 这一趟：9 次调用、最深套到第 4 层</text>
  <g font-size="12" fill="#26405a">
    <rect x="212" y="34" width="216" height="42" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
    <text x="320" y="52" text-anchor="middle" font-weight="700">段 0..5 = 5 2 8 1 9 3</text>
    <text x="320" y="70" text-anchor="middle">基准取 v[2] = 8</text>

    <path d="M258 76 L150 112" stroke="#57677c" stroke-width="2"/><polygon points="150,112 162,110 156,100" fill="#57677c"/>
    <path d="M382 76 L490 112" stroke="#57677c" stroke-width="2"/><polygon points="490,112 478,110 484,100" fill="#57677c"/>
    <text x="228" y="98" fill="#1d7a3c">左堆都比 8 小</text>
    <text x="392" y="98" fill="#b8500f">右堆都比 8 大</text>

    <rect x="46" y="116" width="200" height="42" rx="8" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/>
    <text x="146" y="134" text-anchor="middle" font-weight="700">段 0..3 = 5 2 3 1</text>
    <text x="146" y="152" text-anchor="middle">基准取 v[1] = 2</text>
    <rect x="396" y="116" width="196" height="42" rx="8" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/>
    <text x="494" y="134" text-anchor="middle" font-weight="700">段 4..5 = 9 8</text>
    <text x="494" y="152" text-anchor="middle">基准取 v[4] = 9</text>

    <path d="M104 158 L74 194" stroke="#57677c" stroke-width="1.5"/><polygon points="74,194 86,193 80,183" fill="#57677c"/>
    <path d="M188 158 L228 194" stroke="#57677c" stroke-width="1.5"/><polygon points="228,194 216,193 222,183" fill="#57677c"/>
    <path d="M452 158 L422 194" stroke="#57677c" stroke-width="1.5"/><polygon points="422,194 434,193 428,183" fill="#57677c"/>
    <path d="M536 158 L566 194" stroke="#57677c" stroke-width="1.5"/><polygon points="566,194 554,193 560,183" fill="#57677c"/>

    <rect x="14" y="198" width="112" height="34" rx="8" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/>
    <text x="70" y="220" text-anchor="middle">段 0..0 出口</text>
    <rect x="160" y="198" width="150" height="34" rx="8" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/>
    <text x="235" y="213" text-anchor="middle">段 2..3 = 3 5</text>
    <text x="235" y="228" text-anchor="middle">基准 v[2] = 3</text>
    <rect x="356" y="198" width="112" height="34" rx="8" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/>
    <text x="412" y="220" text-anchor="middle">段 4..4 出口</text>
    <rect x="504" y="198" width="112" height="34" rx="8" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/>
    <text x="560" y="220" text-anchor="middle">段 5..5 出口</text>

    <path d="M212 232 L186 262" stroke="#57677c" stroke-width="1.5"/><polygon points="186,262 198,262 192,252" fill="#57677c"/>
    <path d="M258 232 L286 262" stroke="#57677c" stroke-width="1.5"/><polygon points="286,262 274,262 280,252" fill="#57677c"/>
    <rect x="118" y="266" width="140" height="30" rx="8" fill="#fdece1" stroke="#b8500f" stroke-width="1.5"/>
    <text x="188" y="285" text-anchor="middle">段 2..1 空段，也走出口</text>
    <rect x="272" y="266" width="96" height="30" rx="8" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/>
    <text x="320" y="285" text-anchor="middle">段 3..3 出口</text>

    <text x="392" y="285" fill="#33465e">最终：1 2 3 5 8 9</text>
    <text x="16" y="318" fill="#00599c" font-weight="700">数一下叶子：长度 1 的四段加上一个空段，五次被调用后立刻 return —— 出口不是装饰，它是让这棵树能长到头的那一条。</text>
    <text x="16" y="338" fill="#b8500f">分区收手的判据是 i 越过 j；此时基准左边的都不比它大、右边的都不比它小，但基准自己在哪一堆是不定的。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `跟冒泡对照着看，差别就一句话：冒泡每轮只把**一个**数送到最终位置，快排一趟分区**同时**把整段切成两堆，两堆里没有一个元素需要再跨过中间那条线。这就是「分而治之」买到的东西 —— 每做一趟，要处理的规模大约掉一半。实测六个数这一趟：冒泡要 15 次比较、7 次交换；快排全程 5 次交换、9 次函数调用就收了手，最深套到第 4 层。` },
        { t: `p`, text: `代价两处。一处是**栈**：每次调用都要留一份现场，套得深就吃内存。另一处是**基准选不好就白切**：基准恰好是这堆里最大或最小的，一边就被切空，规模只减一，实测能退化得很惨。源稿那行注释说的「中间值」其实是**取下标中间那一格**，不是这堆数的中位数 —— 这个区别正是下面实测的关键。` },
        { t: `h2`, text: `演示 1 · 源稿这段：六个数排完` },
        { t: `code`, lang: `c++`, code: `void quick_sort(std::vector<int>& v, int lo, int hi) {   // 头文件请 <print> <vector> <utility>
    if (lo >= hi) return;                        // 只剩 0 或 1 个数：天然有序，这就是出口
    int pivot = v[(lo + hi) / 2];                // 取「下标中间那一格」的值当基准
    int i = lo, j = hi;
    while (i <= j) {
        while (v[i] < pivot) ++i;                // 左边找「不该待在左」的
        while (v[j] > pivot) --j;                // 右边找「不该待在右」的
        if (i <= j) std::swap(v[i++], v[j--]);   // 两只手都卡住：一起换到该去的一边
    }
    quick_sort(v, lo, j);                        // 左堆：叫自己再来一遍
    quick_sort(v, i, hi);                        // 右堆：同上
}` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
int main() {
    std::vector<int> v = {5, 2, 8, 1, 9, 3};
    quick_sort(v, 0, static_cast<int>(v.size()) - 1);
    for (int x : v) std::print("{} ", x);
    std::println("");
}` },
        { t: `p`, text: `实测输出 1 2 3 5 8 9。参数那个 static_cast 是被 size_t 逼出来的：hi 要传 v.size() - 1，而 size() 是无符号数，上一课那条绕回在这里照样成立，所以先把长度转成 int 再减一 —— 空容器上它算出 -1，正好落进 lo >= hi 那句出口。` },
        { t: `h2`, text: `演示 2 · 本课任务：每次 swap 以后打印整个数组` },
        { t: `code`, lang: `c++`, code: `    while (i <= j) {
        while (v[i] < pivot) ++i;
        while (v[j] > pivot) --j;
        if (i <= j) {
            std::swap(v[i++], v[j--]);
            std::print("段 {}..{} swap 后：", lo, hi);
            for (int x : v) std::print("{} ", x);          // 打印整个数组：任务要的这句
            std::println("  此刻 i={} j={}", i, j);
        }
    }
    std::println("段 {}..{} 收手：切成 [{}..{}] 与 [{}..{}]", lo, hi, lo, j, i, hi);` },
        { t: `p`, text: `替换进演示 1 那个函数，实测五行 swap：段 0..5 是 5 2 3 1 9 8；接着段 0..3 连着两行 1 2 3 5 9 8；段 2..3 又一行 1 2 3 5 9 8；最后段 4..5 是 1 2 3 5 8 9。中间那三行**一模一样**，别当成 bug —— 那是 i 与 j 停在同一格，swap 换的是自己跟自己，数组当然不动，这是双指针对撞收口时的正常动作：交换次数不等于有效重排次数。每段末尾那句收手打印才是真信息，它摆出 i 与 j 交叉之后的两个范围，也就是演示 3 那棵树的每一条分叉。` },
        { t: `h2`, text: `演示 3 · 函数自己调自己，到底怎么停` },
        { t: `code`, lang: `text`, code: `quick_sort(0..5)  基准 8  → 分区收手 j=3 i=4 → 切出 [0..3] 与 [4..5]
  quick_sort(0..3) 基准 2  → j=0 i=2        → 切出 [0..0] 与 [2..3]
    quick_sort(0..0)  lo>=hi 成立：return，一个数不用排
    quick_sort(2..3) 基准 3  → j=1 i=3      → 切出 [2..1] 与 [3..3]
      quick_sort(2..1) 空段，lo>hi：照样被第一行挡住
      quick_sort(3..3) 出口
  quick_sort(4..5) 基准 9  → j=4 i=5        → 切出 [4..4] 与 [5..5]，两次都是出口` },
        { t: `p`, text: `这段是实测的调用顺序。看两件事：第一，出口拦住的**不只是「剩一个」**，[2..1] 那段一个数都没有，lo 是 2、hi 是 1，靠同一句 lo >= hi 挡回去。第二，每一层的段长都严格比上一层小，所以这棵树必然长到头 —— 第 71 课那句「先想好出口」到这里还是第一功课。` },
        { t: `h2`, text: `演示 4 · 拿计数器实测：哪种输入会退化` },
        { t: `code`, lang: `c++`, code: `int calls = 0, deepest = 0, depth = 0;        // 三个计数器，只为测量，排序本身用不到
void quick_sort(std::vector<int>& v, int lo, int hi) {
    ++calls;  ++depth;  if (depth > deepest) deepest = depth;
    if (lo >= hi) { --depth;  return; }
    int pivot = v[(lo + hi) / 2], i = lo, j = hi;
    while (i <= j) {
        while (v[i] < pivot) ++i;
        while (v[j] > pivot) --j;
        if (i <= j) std::swap(v[i++], v[j--]);
    }
    quick_sort(v, lo, j);  quick_sort(v, i, hi);
    --depth;
}` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
int main() {
    std::vector<int> v;
    for (int k = 1; k <= 1000; ++k) v.push_back(k);     // 已经排好的一千个数
    quick_sort(v, 0, static_cast<int>(v.size()) - 1);
    std::println("已排好一千个：调用 {} 次，最深 {} 层", calls, deepest);
}` },
        { t: `p`, text: `本机实测五种输入。一千个数：已排好的 —— 调用 1023 次、最深第 10 层；**倒着排的 —— 同样 1023 次、第 10 层**。这不推翻「快排最坏会退化」那句教科书话，而是说明源稿这行取基准的办法**天生不怕有序输入**：中间那一格正好是这堆数的中位数，切得刀刀均匀。真把它切废的是「中间那格每次都最差」的排法 —— 实测把一千个数排成先偶数升序再接奇数升序，调用涨到 1925 次、最深第 65 层；同样形状换成一万个数，最深第 931 层。第 105 课的 std::sort 会防这一手，所以工程上永远先用它；本课自己写，是为了看懂它防的是什么。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `出口只写 lo == hi，漏掉空段。分区收手时 j 完全可能比 lo 还小，[lo..j] 是个空段；写成等于就拦不住它，函数会拿同一个范围反复往下叫，实测表现为程序瞬间挂掉，报错是段错误，栈溢出，一点提示都不给。判定永远写 >=。`,
          `传的 hi 是 v.size() - 1 而 size() 是无符号。空容器上它就是演示 3 那个 18446744073709551615 —— 上一课刚数过这个数。要么像源稿那样 static_cast 成 int 再减一，要么在开头判 v.size() < 2 就 return。`,
          `两个内层 while 不带上界。外层保证这一段非空且有基准时确实不会越界，可一旦改 pivot 的取法，比如改成取 v[lo]，v[i] 一路 ++ 就可能冲出右边界。改写法之前先给 while 补上边界，别指望注释里的推理。`,
          `以为分区完基准就站进了最终位置。实测第一段拿 8 当基准，分区收手时它被换到最后一格，可它最终该站的是倒数第二 —— 后面还得再换一次才对上；拿 3 当基准那段更干脆，左边切成一个空段、右边只剩一格。双指针对撞只保证「左边的都不比它大、右边的都不比它小」，不保证基准归位 —— 拿这条去做「找第 k 小」那类题时会算错边界。`,
          `看到 swap 以后打印出来的数组没动就怀疑人生 —— 演示 2 实测就有三行一模一样，那是两只手停在同一格，换的是自己跟自己。判断分区有没有在推进，看的是 i 与 j 交叉没有，不是数组变没变。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `在每次 swap 后打印整个数组，亲眼看它怎么被「分成两堆」—— 照演示 2 那样把段范围 lo、hi 也打出来，然后对着演示 3 那棵调用树数一遍：五行里哪几行是同一格自己跟自己换？`,
          `把打印改成只输出 lo 与 j、i 与 hi，跑一遍确认每一层切出来的两堆都比原段短，并且空段确实被第一行挡回去了。`,
          `延伸一：把 if (lo >= hi) 改成 if (lo == hi)，拿六个数跑一次，说出你看到的现象，再改回来。`,
          `延伸二：把基准改成 v[lo]，分别用「已经排好的一千个数」和「倒序的一千个数」跑演示 4 那两个计数器，把调用次数与最深层数报出来 —— 这才是教科书那句「已排序输入会退化」真正成立的写法。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：快排只有三步 —— 抽一本当基准、两头对撞分成两堆、对每堆叫自己再来一遍；递归的两个零件一个都不能少，出口要写成 lo >= hi 好把空段一起挡住，而「最坏退化」取决于基准怎么取，不取决于数据是否有序。` }
      ]
    }
  ]
};
