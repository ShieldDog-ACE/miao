/* 喵站 · C++ 入门 正文分部 p15：第 63–66 课（第九轮）
 *
 * 源稿：学习资料/C++入门/63_冒泡第1步只走一轮.cpp ~ 66_传值vs传引用一页分清.cpp。六栏课式照 p01/p10：
 *   tip(蓝·本课目标) → 原理讲解 → 它被设计成什么样 → 演示 N → 常见坑 → 任务 → tip(绿·本课一句话)
 *
 * 本分部守的几条：
 *   1. 字符串全用反引号做分隔符是别处的写法，这里正文、标题、代码里一个反引号都不出现；
 *      标代码名裸写或用「」。讲解段不用半角圆括号，补充说明一律换成中文括号。
 *   2. 课号线：std::sort 是第 65 课才第一次跟冒泡对照，所以 c63、c64 全章（正文与代码）不出现 sort 这个词；
 *      c65 用 std::sort 并补上头文件 algorithm。引用参数 60 起、const 引用 61 起，c66 才用。
 *   3. 交换：c63 手写三只盒子（备用盒 t），c64、c65 起改用现成的 std::swap，并把头文件 utility 请齐。
 *   4. 源稿每条【任务】原样进【任务】栏，考卷里每条都有题用 coversTask 对着。
 *   5. 四章各配一张内联 SVG：一轮沉底、逐轮归位、开关提前收工、两只盒子的送达方式。
 *   6. 带 int main 的块把头文件请齐（vector 要 <vector>、println 要 <print>、sort 要 <algorithm>），
 *      输出全程 std::println / std::print，不出现 std::cout 与左移输出流。
 *
 * 验收：node dev/tools/cpp-audit.cjs --part dev/frontend/assets/data/cpp/p15.js
 *       node dev/tools/cpp-exam-check.cjs --only c63,c64,c65,c66
 */
window.MIAO_CPP_P15 = {
  chapters: [
    {
      id: `c63`, title: `第 63 课 · 冒泡第 1 步：只走一轮`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把冒泡排序的第一轮走稳 —— 从 0 号格开始，相邻两格比一比，左边比右边大就交换；一趟走完，最大的那个一定站到了队尾。今天不想「整个排序」这件事，只把一轮走明白。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `体育课排队你见过：老师让一队人按身高从小到大排，最快的办法不是先把最矮的挑出来，而是**从队头开始，挨个跟旁边的人比一比**，谁高谁往后挪一位。一轮走下来，最高的那个人必然被一路顶到了队尾 —— 老师这一步只看「最后面站对了没有」，不管前面谁高谁低。冒泡排序干的就是这件事：**相邻两个比，大的往后挪一格**，一趟之后最大值归位。名字来自水里的气泡：往上冒的过程中越冒越大，最后浮出水面的就是最大的那一个。` },
        { t: `p`, text: `源稿这一篇的代码只有三行核心：for 走一遍格子的编号，if 问一句「左边比右边大吗」，大就交换。要盯住的是循环头里那个奇怪的边界条件：**j + 1 < v.size()**。为什么不写成常见的 j < v.size()？因为这一轮每次都要**同时摸两格** —— v[j] 和 v[j + 1]。如果 j 已经站在最后一格（编号 size() - 1），那么 j + 1 就是 size()，那是**盒子外面**，根本没有右边那个人给你比。把条件写成 j + 1 < v.size()，意思就变成「只有当右边那格存在时才继续」，最后一格自动被挡在门外，比较的次数正好是 size() - 1 次。` },
        { t: `p`, text: `拿源稿那串 5 2 8 1 手动走一遍，四格比三次：j 是 0，左边 5、右边 2，5 大，交换，变成 2 5 8 1；j 是 1，左边 5、右边 8，5 不比 8 大，**不动**；j 是 2，左边 8、右边 1，8 大，交换，变成 2 5 1 8。走完，屏幕上打出来是 [2, 5, 1, 8] —— 8 稳稳站在最后一格。请注意：**这一轮只保证了 8 归位**，前面的 2 5 1 还是乱的，2 号格还蹲着个 5。这就是「只走一轮」的意思，也是下一课要把一轮变成一轮又一轮的理由。` },
        { t: `p`, text: `为什么最大值一定被顶到队尾、不会中途停住？因为 **8 只要跟右边那个比就永远赢** —— 没人比它大，赢一次往后挪一格，下一轮比的是它自己和新右边那个，于是它继续赢、继续挪，一路挪到最右端，没有任何数能把它换回来。反过来，小的那个数一轮最多只能往前挪一格，这就是它冒得慢、要跑很多轮的原因。两个数字记牢：**n 个格子一轮比 n - 1 次**（比的是相邻的空隙，不是格子）；交换次数看数据有多乱，最多和比较次数一样多，最少一次都不用。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `code`, lang: `text`, code: `for (size_t j = 0; j + 1 < v.size(); j++)   一轮：把相邻两格比到底
       │            │            │
       │            │            └── 右边那格必须存在才继续 → 正好比 size() - 1 次
       │            └─────────────── 每轮看的是 j 与 j + 1 这两格
       └──────────────────────────── 编号从无符号的 0 起（size() 也是无符号）

比一比，大的往后挪（三只盒子）：
  int t = v[j];        左边那个先放进备用盒
  v[j] = v[j + 1];     右边的搬进左格
  v[j + 1] = t;        备用盒里那个旧左值放进右格

一轮后的保证：只有「最后一格是全场最大」这一件事是确定的` },
        { t: `svg`, caption: `一轮走到底：5 2 8 1 经过三次相邻比较、两次交换，最大值 8 沉到队尾，前面 2 5 1 仍是乱的`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320">
  <text x="20" y="24" font-size="14" font-weight="700" fill="#142639">std::vector&lt;int&gt; v = {5, 2, 8, 1};  一轮：相邻两个比，大的往后挪</text>
  <g font-size="15" fill="#142639" text-anchor="middle">
    <rect x="24" y="40" width="64" height="40" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="56" y="65">5</text>
    <rect x="88" y="40" width="64" height="40" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="120" y="65">2</text>
    <rect x="152" y="40" width="64" height="40" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="184" y="65">8</text>
    <rect x="216" y="40" width="64" height="40" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="248" y="65">1</text>
  </g>
  <g font-size="12" fill="#57677c" text-anchor="middle">
    <text x="56" y="94">j = 0</text><text x="120" y="94">j = 1</text><text x="184" y="94">j = 2</text><text x="248" y="94">最后一格</text>
  </g>
  <g font-size="12" text-anchor="middle">
    <path d="M96 104 V126" stroke="#b8722b" stroke-width="2"/><text x="96" y="142" fill="#b8722b">5 &gt; 2 换</text>
    <path d="M160 104 V126" stroke="#1a7f42" stroke-width="2"/><text x="160" y="142" fill="#1a7f42">5 不大于 8 不动</text>
    <path d="M224 104 V126" stroke="#b8722b" stroke-width="2"/><text x="224" y="142" fill="#b8722b">8 &gt; 1 换</text>
  </g>
  <text x="20" y="176" font-size="13" fill="#142639">中间状态：2 5 8 1 → 2 5 8 1 → 2 5 1 8</text>
  <text x="20" y="204" font-size="14" font-weight="700" fill="#142639">一轮后</text>
  <g font-size="15" fill="#142639" text-anchor="middle">
    <rect x="24" y="214" width="64" height="40" fill="#f2f2f2" stroke="#57677c" stroke-width="2"/><text x="56" y="239">2</text>
    <rect x="88" y="214" width="64" height="40" fill="#f2f2f2" stroke="#57677c" stroke-width="2"/><text x="120" y="239">5</text>
    <rect x="152" y="214" width="64" height="40" fill="#f2f2f2" stroke="#57677c" stroke-width="2"/><text x="184" y="239">1</text>
    <rect x="216" y="214" width="64" height="40" fill="#dff0e2" stroke="#1a7f42" stroke-width="3"/><text x="248" y="239">8</text>
  </g>
  <text x="300" y="60" font-size="13" fill="#57677c">比较次数 = 格子数 - 1 = 3</text>
  <text x="300" y="84" font-size="13" fill="#b8722b">交换次数 = 2（看数据有多乱）</text>
  <text x="300" y="230" font-size="13" fill="#1a7f42">绿色那格是本轮唯一的保证：</text>
  <text x="300" y="252" font-size="13" fill="#1a7f42">全场最大值已经站对位置</text>
  <text x="20" y="292" font-size="13" fill="#b8722b">前面 2 5 1 还是乱的 —— 所以一轮远远不够，下一课就一轮一轮排到底。</text>
</svg>` },
        { t: `h2`, text: `演示 1 · 一轮走完，只看结果（源稿这段）` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
int main() {
    std::vector<int> v = {5, 2, 8, 1};
    std::println("开始:   {}", v);
    for (size_t j = 0; j + 1 < v.size(); j++) {
        if (v[j] > v[j + 1]) {          // 左边比右边大？
            int t = v[j]; v[j] = v[j + 1];   // 三只盒子：先腾出备用盒
            v[j + 1] = t;                    // 再把旧左值放进右格
        }
    }
    std::println("一轮后: {}", v);       // 最大的 8 冒到末尾了
    return 0;
}` },
        { t: `p`, text: `输出是「开始: [5, 2, 8, 1]」和「一轮后: [2, 5, 1, 8]」。std::println 能把整只 vector 塞进一个占位坑：外面套一对方括号、格子之间用逗号隔开，排序课上这个写法特别好用，一眼就看得出**哪几格动了**。交换那两行是唯一的动手处：先用备用盒 t 接住左边的值，把右边搬进左格，再把 t 里的旧左值放进右格。为什么非要第三只盒子？因为赋值是**覆盖**：只写 v[j] = v[j + 1]; v[j + 1] = v[j]; 两行，第一行执行完左格那个数就已经没了，第二行读到的 v[j] 是刚搬过来的右值，结果两格变成同一个数、左边那个**凭空消失**。` },
        { t: `h2`, text: `演示 2 · 把每一次比较都念出来` },
        { t: `code`, lang: `c++`, code: `std::vector<int> v = {5, 2, 8, 1};
for (size_t j = 0; j + 1 < v.size(); j++) {
    if (v[j] > v[j + 1]) {
        std::println("第 {} 轮：{} 在左、{} 在右，换", j + 1, v[j], v[j + 1]);
        int t = v[j]; v[j] = v[j + 1];
        v[j + 1] = t;
    } else {
        std::println("第 {} 轮：{} 不大于 {}，不动", j + 1, v[j], v[j + 1]);
    }
}` },
        { t: `p`, text: `三行输出：「第 1 轮：5 在左、2 在右，换」「第 2 轮：5 不大于 8，不动」「第 3 轮：8 在左、1 在右，换」。看清楚第二轮：那一行里的 5 是**交换之后**的 5（它已经挪到 1 号格了），所以同一个数在一轮里能被连着比两次 —— 这正是气泡「一路往右冒」的过程。把每一步都打印出来，是查这类问题唯一靠得住的办法：只看最后那行，你分不清是逻辑错了还是数据本来就那样。这段没有 int main，是接在演示 1 里的片段。` },
        { t: `h2`, text: `演示 3 · 换一串数再跑一轮（源稿任务 1）` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
int main() {
    std::vector<int> v = {3, 1, 4, 2};
    for (size_t j = 0; j + 1 < v.size(); j++) {
        if (v[j] > v[j + 1]) {
            int t = v[j]; v[j] = v[j + 1];
            v[j + 1] = t;
        }
        std::println("j = {} 之后: {}", j, v);
    }
    return 0;
}` },
        { t: `p`, text: `三行输出，每行是「比完这一对之后」整串的样子：j = 0 之后 [1, 3, 4, 2]（3 和 1 换了），j = 1 之后还是 [1, 3, 4, 2]（3 不大于 4，不动），j = 2 之后 [1, 3, 2, 4]（4 和 2 换了）。一共两次交换，最大的 4 站到了队尾：它本来在 2 号格，只跟右边的 2 比了一次就换到最后一格 —— **它不需要连赢三场，只要赢掉右边那一个**。把这三行抄到纸上，跟任务 1 的那张草稿逐行对上，才算真懂了一轮。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `边界写成 j < v.size()。最后一次 j 停在最后一格，代码去读 v[j + 1]，那是盒子外面的内存 —— **vector 不会帮你拦**，你可能读到一段垃圾值然后跟它比、也可能直接崩掉，报错里连 v[j + 1] 这个名字都不提。根因一句：比较要动两格，右边那格得先存在。`,
          `改用 size() - 1 当上界又碰上空盒子。size() 是**无符号**整数，0 减 1 不会变成 -1，而是**翻成一个大得离谱的数**，循环条件看着仍然「小于上界」，于是程序跑进不存在的格子。源稿那个 j + 1 < v.size() 天生不怕这件事：空盒子第一轮 j 是 0，1 < 0 不成立，一轮都不跑，干干净净收工。`,
          `把 j 声明成 int 再跟 size() 比。编译器给一条警告，大意是「signed 与 unsigned 比较」，有的配置直接报错，常见那句是 -Wsign-compare。根因是 size() 回的是无符号的 size_t，两边类型不同。要么照源稿写 size_t j，要么全程用同一个类型。`,
          `交换只写两行，把左边那个数弄丢。v[j] = v[j + 1]; v[j + 1] = v[j]; 跑完两格都是原来右边的值。赋值是覆盖，不是传送 —— 交换必须先腾一只备用盒。`,
          `一轮走完就以为排好了，或者以为「一轮没换就说明全乱了」。5 2 8 1 走完一轮是 2 5 1 8，没排好；反过来，如果一轮下来**一次都没换**，那这一串本来就是有序的。这条线索很有用，今天先记住，等把每一轮都跑起来之后我们再拿它来省时间。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把盒子里的数换成 3 1 4 2 再跑一轮，在纸上写出每次交换之后的样子，跟屏幕上的三行逐行对照`,
          `延伸 1：把初始串换成 1 2 3 4（已经有序）跑一轮，数一数换了几次；再换成 4 3 2 1 跑一轮，看 4 挪到队尾用了几次交换。`,
          `延伸 2：把边界条件从 j + 1 < v.size() 改成 j < v.size()，只看代码说出会发生什么，再动手验证你的判断。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：一轮 = 相邻两格比一遍、大的往后挪，边界写 j + 1 < v.size() 才能保证右边那格存在；n 格比 n - 1 次，走完只保证「最大值站在最后一格」，前面照样是乱的。` }
      ]
    },
    {
      id: `c64`, title: `第 64 课 · 冒泡完整版：一轮一轮排到底`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把上一课那一轮套进外层循环，一轮一轮排到底 —— 每走完一轮，右边就多一个归位的大数，内层因此能少比一次；外层走满 n - 1 轮整串有序，并且确认空盒子与单元素跑起来不崩。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课走完一轮的 5 2 8 1 停在 [2, 5, 1, 8]：只有 8 站对了。那剩下的怎么办？答案很朴素：**再来一轮**。第二轮照样从 0 号格挨个比，这一次 5 一路赢下去，停在 8 左边 —— 倒数第二格也归位了。第三轮 2 和 1 抢完位置，整串就成了 [1, 2, 5, 8]。冒泡的完整形态就是这么回事：**同一个动作重复做，每轮多送一个数回家**。` },
        { t: `p`, text: `要抓住的关键是**内层能缩短**。既然每一轮都把当轮的最大值送到「还没归位那一段」的最右端，那右边那一截就已经排好了，下一轮根本不用再碰它：8 已经站在最后一格，第二轮的 j 没必要再去比那一对。于是外层那个 i 的身份很明确：**i = 已经归位的格子数**。内层上界从 v.size() 变成 **v.size() - i**，每轮少比一次，像下楼梯：五个格子第一轮比 4 次，接着 3 次、2 次、1 次。` },
        { t: `p`, text: `把这一串数字加一加：4 + 3 + 2 + 1 = 10 次比较。n 个格子就是 (n - 1) + (n - 2) + … + 1 = **n * (n - 1) / 2** 次。这个式子是冒泡的性格，也是它的软肋 —— **数据量翻一倍，活儿翻四倍**：一百个格子要 4950 次，一万个格子约五千万次。我们今天照样写它，不为快，而为**这是你能亲手造出来的第一个真算法**：往后用多快的现成工具，你都知道它在替你干什么。外层只要 **n - 1 轮**，不用 n 轮：前 n - 1 个数都回到位置之后，剩下的那一个只能站在唯一还空着的位置上，它**天然归位**，再跑一轮纯属白跑。` },
        { t: `p`, text: `源稿这次把它包成了一个函数：**void bubble_all(std::vector<int>& v)**。参数里那个 & 是第 60 课的引用参数，意思是「函数里的 v 和外面那只盒子是同一个东西」，所以函数内改的就是 main 里的那只 —— 排序这种**要动原数据**的活儿，少了这个 & 就什么都留不下来，再往后的课会用一整页把「传值」和「传引用」摆到一张桌子上分清。另一处省笔是 **std::swap**，它把上一课那三只盒子的活儿一行做完，住在 utility 里。` },
        { t: `p`, text: `最后回答源稿那句括号里的提醒：为什么外层写 i + 1 < v.size() 而不是 i < v.size() - 1？空盒子的 size() 是 **0**，而 size() 回的是无符号数，**0 减 1 不是 -1，而是翻成一个天文数字**（我实测在 64 位机器上打出来是 18446744073709551615）。这个数照样「大于」起点的 i，于是循环狂跑，内层那个 v.size() - i 跟着下溢，程序冲进出口气都没有的越界内存。而 i + 1 < v.size() 天生不会减谁：空盒子时 1 < 0 不成立，单元素时 1 < 1 也不成立，**一轮都不跑**，直接原样退出来。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `code`, lang: `text`, code: `外层  for (size_t i = 0; i + 1 < v.size(); i++)        走 n - 1 轮，i = 已经归位的个数
内层  for (size_t j = 0; j + 1 < v.size() - i; j++)     比到「还没归位那一段」的末尾就收

一轮一轮的比较次数，像下楼梯：
  n = 5   第 1 轮 4 次   第 2 轮 3 次   第 3 轮 2 次   第 4 轮 1 次   共 10 次
  合计 = (n - 1) + (n - 2) + … + 1 = n * (n - 1) / 2   ← 数据翻倍，活儿翻四倍

每一轮的保证：右边 i + 1 格已经是全场最大的那几个，而且已经排好` },
        { t: `svg`, caption: `下楼梯：五个数 64 25 12 22 11 逐轮排好，右边归位的那一截越垫越长，内层的比较次数从 4 缩到 1，一共十次`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300">
  <text x="20" y="24" font-size="14" font-weight="700" fill="#142639">void bubble_all：外层 4 轮，内层一轮比一轮短</text>
  <g font-size="13" fill="#57677c">
    <text x="20" y="56">出生</text><text x="20" y="106">第 1 轮后</text><text x="20" y="156">第 2 轮后</text><text x="20" y="206">第 3 轮后</text><text x="20" y="256">第 4 轮后</text>
  </g>
  <g font-size="14" fill="#142639" text-anchor="middle">
    <rect x="112" y="40" width="52" height="32" fill="#f2f2f2" stroke="#57677c" stroke-width="2"/><text x="138" y="61">64</text><rect x="164" y="40" width="52" height="32" fill="#f2f2f2" stroke="#57677c" stroke-width="2"/><text x="190" y="61">25</text><rect x="216" y="40" width="52" height="32" fill="#f2f2f2" stroke="#57677c" stroke-width="2"/><text x="242" y="61">12</text><rect x="268" y="40" width="52" height="32" fill="#f2f2f2" stroke="#57677c" stroke-width="2"/><text x="294" y="61">22</text><rect x="320" y="40" width="52" height="32" fill="#f2f2f2" stroke="#57677c" stroke-width="2"/><text x="346" y="61">11</text>

    <rect x="112" y="90" width="52" height="32" fill="#f2f2f2" stroke="#57677c" stroke-width="2"/><text x="138" y="111">25</text><rect x="164" y="90" width="52" height="32" fill="#f2f2f2" stroke="#57677c" stroke-width="2"/><text x="190" y="111">12</text><rect x="216" y="90" width="52" height="32" fill="#f2f2f2" stroke="#57677c" stroke-width="2"/><text x="242" y="111">22</text><rect x="268" y="90" width="52" height="32" fill="#f2f2f2" stroke="#57677c" stroke-width="2"/><text x="294" y="111">11</text><rect x="320" y="90" width="52" height="32" fill="#dff0e2" stroke="#1a7f42" stroke-width="3"/><text x="346" y="111">64</text>

    <rect x="112" y="140" width="52" height="32" fill="#f2f2f2" stroke="#57677c" stroke-width="2"/><text x="138" y="161">12</text><rect x="164" y="140" width="52" height="32" fill="#f2f2f2" stroke="#57677c" stroke-width="2"/><text x="190" y="161">22</text><rect x="216" y="140" width="52" height="32" fill="#f2f2f2" stroke="#57677c" stroke-width="2"/><text x="242" y="161">11</text><rect x="268" y="140" width="52" height="32" fill="#dff0e2" stroke="#1a7f42" stroke-width="3"/><text x="294" y="161">25</text><rect x="320" y="140" width="52" height="32" fill="#dff0e2" stroke="#1a7f42" stroke-width="3"/><text x="346" y="161">64</text>

    <rect x="112" y="190" width="52" height="32" fill="#f2f2f2" stroke="#57677c" stroke-width="2"/><text x="138" y="211">12</text><rect x="164" y="190" width="52" height="32" fill="#f2f2f2" stroke="#57677c" stroke-width="2"/><text x="190" y="211">11</text><rect x="216" y="190" width="52" height="32" fill="#dff0e2" stroke="#1a7f42" stroke-width="3"/><text x="242" y="211">22</text><rect x="268" y="190" width="52" height="32" fill="#dff0e2" stroke="#1a7f42" stroke-width="3"/><text x="294" y="211">25</text><rect x="320" y="190" width="52" height="32" fill="#dff0e2" stroke="#1a7f42" stroke-width="3"/><text x="346" y="211">64</text>

    <rect x="112" y="240" width="52" height="32" fill="#dff0e2" stroke="#1a7f42" stroke-width="3"/><text x="138" y="261">11</text><rect x="164" y="240" width="52" height="32" fill="#dff0e2" stroke="#1a7f42" stroke-width="3"/><text x="190" y="261">12</text><rect x="216" y="240" width="52" height="32" fill="#dff0e2" stroke="#1a7f42" stroke-width="3"/><text x="242" y="261">22</text><rect x="268" y="240" width="52" height="32" fill="#dff0e2" stroke="#1a7f42" stroke-width="3"/><text x="294" y="261">25</text><rect x="320" y="240" width="52" height="32" fill="#dff0e2" stroke="#1a7f42" stroke-width="3"/><text x="346" y="261">64</text>
  </g>
  <g font-size="13" fill="#b8722b">
    <text x="400" y="111">内层比 4 次</text><text x="400" y="161">内层比 3 次</text><text x="400" y="211">内层比 2 次</text><text x="400" y="261">内层比 1 次</text>
  </g>
  <text x="500" y="111" font-size="13" fill="#57677c">v.size() - 0</text>
  <text x="500" y="161" font-size="13" fill="#57677c">v.size() - 1</text>
  <text x="500" y="211" font-size="13" fill="#57677c">v.size() - 2</text>
  <text x="500" y="261" font-size="13" fill="#57677c">v.size() - 3</text>
  <text x="112" y="288" font-size="13" fill="#1a7f42">4 + 3 + 2 + 1 = 10 次比较 = n * (n - 1) / 2，绿色那一截每轮长一格</text>
</svg>` },
        { t: `h2`, text: `演示 1 · 一轮套进外层（源稿这段）` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <utility>
#include <vector>

void bubble_all(std::vector<int>& v) {                  // 带 &：改的是外面那只盒子
    for (size_t i = 0; i + 1 < v.size(); i++) {         // 一共 n - 1 轮
        for (size_t j = 0; j + 1 < v.size() - i; j++) { // 右边归位的那几个不用再比
            if (v[j] > v[j + 1]) std::swap(v[j], v[j + 1]);
        }
    }
}` },
        { t: `p`, text: `两层循环就是本课的全部内容，逐行对着上面那张楼梯图读：外层每转一圈等于「走完一轮」，内层那句 **v.size() - i** 是缩短的关键 —— i 已经归位了几个，右边就让开几个不碰。这个块只有函数、没有 main，抄进程序还要配一个 main（演示 2 就是完整的）。std::swap 住在 utility 里，别忘包。` },
        { t: `h2`, text: `演示 2 · 一轮一轮看着它归位` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <utility>
#include <vector>
int main() {
    std::vector<int> v = {64, 25, 12, 22, 11};
    for (size_t i = 0; i + 1 < v.size(); i++) {
        for (size_t j = 0; j + 1 < v.size() - i; j++) {
            if (v[j] > v[j + 1]) std::swap(v[j], v[j + 1]);
        }
        std::println("第 {} 轮后: {}", i + 1, v);
    }
    return 0;
}` },
        { t: `p`, text: `四行输出照抄给你：「第 1 轮后: [25, 12, 22, 11, 64]」「第 2 轮后: [12, 22, 11, 25, 64]」「第 3 轮后: [12, 11, 22, 25, 64]」「第 4 轮后: [11, 12, 22, 25, 64]」。每一行右边都多一个站对的数。源稿选 64 25 12 22 11 很讲究：64 第一轮连赢四场直接滑到底，而 11 要走满四场才爬回最前面，正好看清冒泡那个不对称：**大数下沉一场到底，小数上浮一步一格**。` },
        { t: `h2`, text: `演示 3 · 空盒子与单元素（源稿任务 1）` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <utility>
#include <vector>
int main() {
    std::vector<int> e = {};                 // 空盒子
    std::vector<int> one = {42};             // 只有一个数
    std::vector<int> v = {5, 2, 8, 1};
    bubble_all(e); bubble_all(one); bubble_all(v);
    std::println("空 {} 单 {} 四个 {}", e, one, v);
    return 0;
}` },
        { t: `p`, text: `跑出来是「空 [] 单 [42] 四个 [1, 2, 5, 8]」—— **不崩、不报错、不改坏**，前两只原样退出来。把演示 1 那个函数放在这个 main 前面就能直接编译。理由还是那句边界：空盒子时 1 < 0 不成立，单元素时 1 < 1 也不成立，外层一轮都不进。你要是改成 i < v.size() - 1，空盒子那一步的上界就变成 18446744073709551615，程序冲进去读根本不存在的格子 —— 两种写法，一种安静退出、一种当场出事。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `内层上界忘了减 i，写成 j + 1 < v.size()。这是最容易被放过的一条：**排序结果完全正确**，只是每轮把已经归位的右边那一截又白比一遍，五个格子从 10 次比较涨到 16 次，一百个格子从 4950 涨到 9801。查它不能靠看结果，只能靠数次数。`,
          `外层改成 i < v.size() - 1。空盒子时 size() 是 0，无符号的 0 减 1 翻成天文数字，外层狂跑，内层那句 v.size() - i 跟着下溢，最后写进根本不存在的内存 —— 症状可能是当场崩、可能是别的变量被悄悄改坏、也可能这次跑得挺好下次换个数据就炸。守住源稿那句 **i + 1 < v.size()**，全程不做减法就躲干净了。`,
          `少写参数里那个 &，变成 void bubble_all(std::vector<int> v)。编译通过、运行也正常，函数确实把复印件排好了，然后把它扔掉；main 里那只盒子打出来还是 [5, 2, 8, 1]。**排序没生效**这类怪事，八成就是这个 & 不见了。`,
          `用了 std::swap 却没包 utility，报错长相大致是「swap is not a member of std」，指着交换那一行。`,
          `把两层循环的变量名抄反：内层用 i、外层用 j。编译器不拦，但内层那句 v.size() - i 里的 i 本该是外层轮数，被内层改写之后上界乱跳，结果时对时错。两层循环里**外层管轮数、内层管格子**，名字固定下来别换。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `拿 bubble_all 试试排序空盒子 {} 和单元素 {42}，确认不崩；顺便想清楚 i + 1 < v.size() 为什么比 i < v.size() - 1 安全`,
          `延伸 1：把演示 2 那串换成 1 2 3 4 5（已经排好）跑一遍，逐轮打印，看看它是不是一轮一轮地把 5 个数全走满。`,
          `延伸 2：在内层加一句计数，把比较总次数数出来，跟 n * (n - 1) / 2 对一对。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：完整冒泡 = 外层 n - 1 轮乘内层逐轮缩短，i 是已经归位的个数、v.size() - i 就是楼梯的台阶；比较总数 n * (n - 1) / 2，而 i + 1 < v.size() 这种「不做减法」的写法让空盒子天然安全。` }
      ]
    },
    {
      id: `c65`, title: `第 65 课 · 冒泡优化：没交换就提前收工`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：给外层循环装一只开关 —— 每轮开始把 swapped 按成 false，交换过一次就记成 true；一轮走完它还是 false，说明已经排好，当场 break 收工。顺便认识 std::sort：实际开发用它。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课的完整冒泡有个不太好看的习惯：**不管你排没排好，它都要把 n - 1 轮走满**。1 2 3 4 5 已经站得整整齐齐，它照样一轮一轮比过去，十个比较一个不少 —— 全是白跑。源稿的说法很形象：队伍已经站齐，老师不必再喊口令。要省下这些轮次，得先让程序自己**知道现在已经有序了**。` },
        { t: `p`, text: `怎么知道？靠上一课那条观察：某一轮从头到尾**一次交换都没发生**，说明每一对相邻的数都是左边不大于右边，整串就是升序；反过来，只要还有一对是反的，那一轮就必然会换。「这轮换过没有」和「排好了没有」是**同一个问题的两面**。判断只需一只 bool，第 12 课那个真假盒子，三个动作凑成开关：每轮开始把 swapped **按成 false**，内层每交换一次就**记成 true**，一轮走完还是 false 就 **break** 收工。` },
        { t: `p`, text: `这里有个必须自己算清楚的数字，源稿的任务正好在考它：**排 1 2 3 5 4 会走几轮就提前停？** 我把代码跑实测过。第一轮内层比 4 次，前三对都不换，最后一对 5 与 4 反了，交换 —— 这轮的 swapped 是 true，继续。第二轮内层比 3 次，一对都没换，swapped 保持 false，**break**。答案是 **2 轮、7 次比较**，比不优化那版的 4 轮 10 次省下 2 轮、3 次比较。` },
        { t: `p`, text: `请盯住第二轮的性质：**它一次都没换，是专门来确认「真的好了吗」的**。本课最容易记错的就是这一句：优化版并不会「一发现有序就立刻停下」，它得先把一整轮比完，才知道这一轮换没换过。哪怕数据一开始就完全有序，也要老老实实走完**一整轮**才 break。省下来的是**后面的轮次**：最好的情况从 4 轮 10 次缩成 1 轮 4 次；最坏的情况 5 4 3 2 1 每轮都在换，4 轮 10 次一次都省不掉，只是每次多问一句 bool。这个开关只在「提前排好」时发威。` },
        { t: `p`, text: `最后认识真正的选手：**std::sort(w.begin(), w.end())**，住在头文件 algorithm 里，一行把整串从小到大排好。那两个参数不是「首格和尾格」，而是**一个区间的两端**：begin 指向 0 号格，end 指向**最后一格再往后的那个位置**，一个从来不装数据的哨兵，所以范围是「含头不含尾」，正好盖住全部格子。这条规矩标准库到处都用，现在记住，以后天天见。它内部用的不是冒泡，比那套下楼梯短得多 —— **日常开发写 std::sort，写冒泡是为了看懂它在替你干什么。**` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `code`, lang: `text`, code: `一轮一只开关，三个动作，位置各不同：
  bool swapped = false;      外层循环里、内层之前 —— 每轮都重新按下
  swapped = true;            内层里，紧跟在交换之后 —— 换过就记账
  if (!swapped) break;       内层结束之后、外层走完之前 —— 一轮没换就收工

实测三组数字：
  1 2 3 5 4    不优化 4 轮 10 次    优化 2 轮 7 次    ← 第二轮是确认轮，一次都没换
  1 2 3 4 5    不优化 4 轮 10 次    优化 1 轮 4 次    ← 最好命，也要走完一整轮才知道
  5 4 3 2 1    不优化 4 轮 10 次    优化 4 轮 10 次   ← 最坏情况一轮省不掉

std::sort(起点, 尾后)        右端那个位置不包含自己的数据` },
        { t: `svg`, caption: `开关决定要不要再来一轮：第一轮换过一次，swapped 亮成 true，继续；第二轮一次都没换，还是 false，当场 break，后面两轮就此省掉`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">
  <text x="20" y="24" font-size="14" font-weight="700" fill="#142639">冒泡加开关：v = {1, 2, 3, 5, 4}</text>
  <g font-size="13" fill="#57677c">
    <text x="20" y="52">出生</text><text x="20" y="150">第 1 轮</text><text x="20" y="248">第 2 轮</text>
  </g>
  <g font-size="14" fill="#142639" text-anchor="middle">
    <rect x="96" y="36" width="52" height="32" fill="#f2f2f2" stroke="#57677c" stroke-width="2"/><text x="122" y="57">1</text>
    <rect x="148" y="36" width="52" height="32" fill="#f2f2f2" stroke="#57677c" stroke-width="2"/><text x="174" y="57">2</text>
    <rect x="200" y="36" width="52" height="32" fill="#f2f2f2" stroke="#57677c" stroke-width="2"/><text x="226" y="57">3</text>
    <rect x="252" y="36" width="52" height="32" fill="#f2f2f2" stroke="#57677c" stroke-width="2"/><text x="278" y="57">5</text>
    <rect x="304" y="36" width="52" height="32" fill="#f2f2f2" stroke="#57677c" stroke-width="2"/><text x="330" y="57">4</text>
  </g>
  <g font-size="14" fill="#142639" text-anchor="middle">
    <rect x="96" y="134" width="52" height="32" fill="#f2f2f2" stroke="#57677c" stroke-width="2"/><text x="122" y="155">1</text>
    <rect x="148" y="134" width="52" height="32" fill="#f2f2f2" stroke="#57677c" stroke-width="2"/><text x="174" y="155">2</text>
    <rect x="200" y="134" width="52" height="32" fill="#f2f2f2" stroke="#57677c" stroke-width="2"/><text x="226" y="155">3</text>
    <rect x="252" y="134" width="52" height="32" fill="#f2f2f2" stroke="#57677c" stroke-width="2"/><text x="278" y="155">4</text>
    <rect x="304" y="134" width="52" height="32" fill="#dff0e2" stroke="#1a7f42" stroke-width="3"/><text x="330" y="155">5</text>
  </g>
  <g font-size="14" fill="#142639" text-anchor="middle">
    <rect x="96" y="232" width="52" height="32" fill="#dff0e2" stroke="#1a7f42" stroke-width="3"/><text x="122" y="253">1</text>
    <rect x="148" y="232" width="52" height="32" fill="#dff0e2" stroke="#1a7f42" stroke-width="3"/><text x="174" y="253">2</text>
    <rect x="200" y="232" width="52" height="32" fill="#dff0e2" stroke="#1a7f42" stroke-width="3"/><text x="226" y="253">3</text>
    <rect x="252" y="232" width="52" height="32" fill="#dff0e2" stroke="#1a7f42" stroke-width="3"/><text x="278" y="253">4</text>
    <rect x="304" y="232" width="52" height="32" fill="#dff0e2" stroke="#1a7f42" stroke-width="3"/><text x="330" y="253">5</text>
  </g>
  <text x="392" y="148" font-size="13" fill="#b8722b">比 4 次，换 1 次</text>
  <rect x="392" y="156" width="150" height="26" rx="6" fill="#ffe6cc" stroke="#b8722b" stroke-width="2"/>
  <text x="400" y="174" font-size="13" fill="#b8722b">swapped 为真 再来一轮</text>
  <text x="392" y="246" font-size="13" fill="#1a7f42">比 3 次，一次没换</text>
  <rect x="392" y="254" width="150" height="26" rx="6" fill="#dff0e2" stroke="#1a7f42" stroke-width="2"/>
  <text x="400" y="272" font-size="13" fill="#1a7f42">swapped 为假 break</text>
  <text x="20" y="304" font-size="13" fill="#b8722b">第 3、4 轮被省掉：不优化 4 轮 10 次比较，优化 2 轮 7 次</text>
  <text x="20" y="334" font-size="13" fill="#57677c">第二轮是确认轮：非走完不可 —— 省的是后面的轮次，一轮都省不掉</text>
</svg>` },
        { t: `h2`, text: `演示 1 · 加开关的冒泡（源稿这段）` },
        { t: `code`, lang: `c++`, code: `void bubble_all(std::vector<int>& v) {                // 引用：改的是外面那只盒子
    for (size_t i = 0; i + 1 < v.size(); i++) {
        bool swapped = false;                         // 这轮还没换过
        for (size_t j = 0; j + 1 < v.size() - i; j++) {
            if (v[j] > v[j + 1]) {
                std::swap(v[j], v[j + 1]);
                swapped = true;                       // 换过，记一笔
            }
        }
        if (!swapped) break;                          // 没换过 = 有序了，收工
    }
}` },
        { t: `p`, text: `代码跟上一课只差三行，但**位置**决定一切：swapped 的声明在外层花括号里、内层之前（每轮重新按下），记 true 那句紧跟交换，break 那句在内层结束之后（一轮才算数）。这段没有 int main，配上三个头文件和一个 main 就能跑。它排 5 2 8 1 得到的还是 [1, 2, 5, 8]，跟不优化时一模一样 —— 优化只改**跑多久**，不改**排成什么样**。` },
        { t: `h2`, text: `演示 2 · 把每轮的开关状态打出来（源稿任务 1）` },
        { t: `code`, lang: `c++`, code: `for (size_t i = 0; i + 1 < v.size(); i++) {          // 外层：一轮
    bool swapped = false;
    for (size_t j = 0; j + 1 < v.size() - i; j++) {   // 内层：一次比较
        if (v[j] > v[j + 1]) {
            std::swap(v[j], v[j + 1]);
            swapped = true;
        }
    }
    std::println("第 {} 轮后 {}，这轮换过吗？{}", i + 1, v, swapped);
    if (!swapped) break;
}` },
        { t: `p`, text: `把 v 换成 1 2 3 5 4，屏幕上只有两行：「第 1 轮后 [1, 2, 3, 4, 5]，这轮换过吗？true」「第 2 轮后 [1, 2, 3, 4, 5]，这轮换过吗？false」。**两行就是走了两轮**，第二行那句 false 就是 break 的理由。注意第一轮结束时已经排好了，可程序并不知道，它还得再走一轮去确认 —— 这正是任务 1 想让你算错的地方，很多人猜 1 轮。想要更硬的证据，就在外层加一只 rounds、内层加一只 comps 各自 ++：我实测是 2 轮 7 次比较。` },
        { t: `h2`, text: `演示 3 · 手写的冒泡对上 std::sort（源稿这段）` },
        { t: `code`, lang: `c++`, code: `#include <algorithm>
#include <print>
#include <utility>
#include <vector>
int main() {
    std::vector<int> v = {5, 2, 8, 1};
    std::vector<int> w = {64, 25, 12, 22, 11};
    bubble_all(v);                        // 演示 1 那个带开关的冒泡
    std::sort(w.begin(), w.end());        // 标准库排序，实际开发用它
    std::println("冒泡: {}", v);
    std::println("sort: {}", w);
    return 0;
}` },
        { t: `p`, text: `两行输出：「冒泡: [1, 2, 5, 8]」「sort: [11, 12, 22, 25, 64]」—— 两个函数各排各的盒子，结果都是升序，写法却差九行。头文件这次多请一个 **algorithm**，std::sort 住在里面（utility 管的是 swap、pair 这类小工具）。两个参数是**区间两端**：begin 指向 0 号格，end 指向最后一格再往后那个不装数据的哨兵，「含头不含尾」正好盖住全部格子。它也不用你写类型 —— 装 int 就排 int，装 string 就按字典序排，这套机制叫模板，以后再讲。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `bool swapped = false; 忘到外层循环**外面**，只按一次。只要第一轮换过，之后每轮开始时它都还是 true，break 永远不触发 —— 结果照样正确，优化彻底失效，症状是「明明加了开关，1 2 3 4 5 还是走满 4 轮」。`,
          `忘写 swapped = true;。开关一辈子按不下去，第 1 轮结束就 break，只走一轮就交卷：64 25 12 22 11 打出来是 [25, 12, 22, 11, 64] —— 只把 64 送到底就停了。凡是「排序对了一半」，先查记账那一句。`,
          `把 break 那句写进内层循环。它立刻变成「这一对没换就跳出全部」：内层第一对不换就收工，剩下的格子一个没比。break 只管**当前那一层**循环，位置决定语义，两层循环里尤其要想清楚你在打断谁。`,
          `用了 std::sort 却没包 algorithm，报错大致是「sort is not a member of std」；或者顺手写成 w.sort(...) —— vector 没这个成员，报错是「has no member named sort」。C++ 把算法放在容器外面当**函数**用，抄别的语言那套「列表自带排序方法」的写法就会错。`,
          `以为加了开关就一定省时间。最坏情况 5 4 3 2 1 每轮都在换，4 轮 10 次比较一次不少，还多问了 4 次 bool；完全有序的串也只是从 10 次变成 4 次。数一数 rounds 和 comps 再下结论，别凭直觉。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `排 {1, 2, 3, 5, 4}，想想它走了几轮就提前停了：先在心里猜一个数，再用演示 2 那句打印把轮数验证出来`,
          `延伸 1：换成 1 2 3 4 5 和 5 4 3 2 1 各跑一遍，报出轮数与比较次数，跟 2 轮 7 次比一比，说说开关什么时候发威、什么时候一轮都省不掉。`,
          `延伸 2：把手写的 bubble_all 换成 std::sort(v.begin(), v.end()) 跑同样三串，确认结果一致；再把 algorithm 那行注释掉，读一遍报错长什么样，然后还回去。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：每轮开始 swapped 按成 false、换过就记成 true、一轮走完还是 false 就 break —— 已经有序的串从 n - 1 轮缩到 1 轮，但那轮确认非走完不可；真正干活请 std::sort，写冒泡是为了看懂它。` }
      ]
    },
    {
      id: `c66`, title: `第 66 课 · 传值 vs 传引用：一页分清`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：一页分清两种传参 —— 参数里**没有 &** 就是复印件（改坏也不心疼，原稿没事），**有 &** 就是把原稿借出去（你写什么，原稿上就留什么），差别只在这一个符号上；还会用它写出交换两个数的函数。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `先把调用那一瞬间的画面装进脑子：你写 by_value(a)，编译器**新开一只 int 盒子**给函数参数 x，把 a 里的值**复印**一份塞进去。函数从此只跟 x 打交道，a 站在门外什么都不知道。这就是**传值**。源稿的比喻极准：**复印件给函数，改坏也不心疼，原稿没事**。函数里 x 被写成 999、还大声打印出来「函数里拿到: 999」，main 里的 a 依然是 10 —— 这不是 bug，这就是传值的**本职**。` },
        { t: `p`, text: `第二种：参数类型后面挂一个 &，**void by_ref(int& x)**。这个 & 读作「引用」，意思是「x 不是新盒子，它是外面那只盒子的**外号**」，函数里写 x = 999，写的就是 b 本身。源稿的比喻同样一句话：**原稿借给函数，你写什么，原稿上就留什么**。第 60 课你第一次用过它，第 64 课的 bubble_all(std::vector<int>& v) 也带着它 —— 今天一次讲透：**一个符号的差别，一个改了白改，一个一改就生效**。` },
        { t: `p`, text: `引用不是「更高级的写法」，它有条件也有代价。第一，**引用一出生就得绑定到一个已有的东西**：int& r; 不初始化，编译器当场报错，长相大致是「r 声明成了引用但没有初始化」。第二，绑定之后**改绑不了**：后面写 r = 5 改的是正主里的值，不是让 r 去当别人的外号。第三，正主得**活得比这次调用久**，拿临时值去绑引用，编译器直接拦住。` },
        { t: `p`, text: `那什么时候用哪个？问自己两句。**第一句：这趟要不要改外面那只盒子？** 不改就用传值或 const 引用；要改就非 & 不可，而且是不带 const 的 &。**第二句：不改的话，这东西大不大？** 一只 int、一只 bool，复印几个字节可以忽略，传值最省事也最安全；一只有几千个数的 vector、一段长 string，每调用一次就整份搬一遍，那就用 **const 引用**（第 61 课）：不复印、直接看原稿，还用 const 把「写」这条路堵死 —— 函数里敢写一句 v.push_back(9)，编译器当场报错，大意是「丢掉限定符 / 只读位置不能赋值」，这个报错是 const 在替你值班。` },
        { t: `p`, text: `三档排一起记：**要改 → 非 const 引用；只读又大 → const 引用；又小又只读 → 传值**。用反了的两种失败长相不同：该带 & 却没带，程序一声不吭、值没变，最难查；不该改却拿了引用，一不小心就改坏调用方的数据，好在 const 挡得住。上一课那个冒泡把 & 删掉就属于前者，本课演示 2 让你亲眼看见。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `code`, lang: `text`, code: `void by_value(int  x)   复印件：函数里新建一只盒子，把实参的值抄进去
void by_ref  (int& x)   外号：x 就是外面那只盒子本尊，写它 = 写原件

             参数写法              拿到什么        能不能改到外面      代价
 传值        int x                 一份复印件       不能，改了白改      每次调用都要复印
 非 const 引用 int& x              原件本尊         能                  不用复印
 const 引用   const int& x        原件，但只许看   不能，写了就报错     不用复印

一句话判断：要改 → 加 &；只读而且东西大 → 加 const &；小而只读 → 直接传值` },
        { t: `svg`, caption: `同一个 999 落在两种参数上：传值那一路写在每轮新建的复印件上，原稿一点没动；传引用那一路写的就是原稿本身`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 330">
  <text x="20" y="24" font-size="14" font-weight="700" fill="#142639">by_value(a) 与 by_ref(b)：只有参数里那个 & 不同</text>
  <text x="20" y="60" font-size="13" fill="#00599c">传值 int x</text>
  <g font-size="14" fill="#142639">
    <rect x="20" y="72" width="150" height="40" rx="6" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="36" y="97">main 里的 a = 10</text>
    <rect x="240" y="72" width="150" height="40" rx="6" fill="#f2f2f2" stroke="#57677c" stroke-width="2" stroke-dasharray="5 4"/><text x="256" y="97">x = 999 复印件</text>
    <rect x="20" y="212" width="150" height="40" rx="6" fill="#dff0e2" stroke="#1a7f42" stroke-width="2"/><text x="36" y="237">main 里的 b = 999</text>
    <rect x="240" y="212" width="150" height="40" rx="6" fill="#dff0e2" stroke="#1a7f42" stroke-width="2"/><text x="256" y="237">x 就是 b 本人</text>
  </g>
  <path d="M170 92 H240" stroke="#57677c" stroke-width="2"/>
  <text x="180" y="84" font-size="12" fill="#b8722b">抄一份进去</text>
  <path d="M240 232 H170" stroke="#1a7f42" stroke-width="2"/>
  <text x="176" y="266" font-size="12" fill="#1a7f42">没有抄：x 与 b 是同一只盒子</text>
  <g font-size="13" fill="#b8722b">
    <text x="410" y="80">函数里打印 999，</text><text x="410" y="100">出了花括号就扔掉</text>
  </g>
  <g font-size="13" fill="#57677c">
    <text x="410" y="128">a 自始至终是 10</text>
  </g>
  <g font-size="13" fill="#1a7f42">
    <text x="410" y="220">函数什么都没打印，</text><text x="410" y="240">外面却实实在在变了</text>
  </g>
  <text x="20" y="146" font-size="13" fill="#142639">x = 999;</text>
  <text x="20" y="292" font-size="13" fill="#57677c">两种失败长相：该带 & 却漏了 —— 安静地什么都没改；不该改却带了 & —— 改坏调用方的数据，const 能挡住这种</text>
  <text x="20" y="318" font-size="13" fill="#00599c">引用必须一出生就绑定：int&amp;r; 不初始化，编译器当场报错</text>
</svg>` },
        { t: `h2`, text: `演示 1 · 复印件与原稿（源稿这段）` },
        { t: `code`, lang: `c++`, code: `#include <print>

void by_value(int x) { x = 999; std::println("函数里拿到: {}", x); }   // 复印件
void by_ref(int& x)  { x = 999; }                                     // 原稿的外号

int main() {
    int a = 10, b = 10;
    by_value(a);
    by_ref(b);
    std::println("传值后   a = {}   ← 没变", a);
    std::println("传引用后 b = {}   ← 变了", b);
    return 0;
}` },
        { t: `p`, text: `三行输出：「函数里拿到: 999」「传值后 a = 10 ← 没变」「传引用后 b = 999 ← 变了」。两只盒子出生时都是 10，两个函数里写的也都是 999，结局却相反 —— 差别不在函数体，**只在参数类型里那一个 &**。细节值得看：by_value 里那句打印是真的，x 那一刻确实装着 999，只是那份 999 跟 a 没关系；by_ref 什么都没打印，外面反而变了。所以**函数里打印出来的值，证明不了外面的值变了** —— 这是查这类问题踩的第一个坑。` },
        { t: `h2`, text: `演示 2 · 把 & 删掉，先预测再跑（源稿任务 1）` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
void bubble_all(std::vector<int> v) {          // & 被删掉了：排的是复印件
    for (size_t i = 0; i + 1 < v.size(); i++) {
        for (size_t j = 0; j + 1 < v.size() - i; j++) {
            if (v[j] > v[j + 1]) { int t = v[j]; v[j] = v[j + 1]; v[j + 1] = t; }
        }
    }
}
int main() {
    std::vector<int> v = {5, 2, 8, 1};
    bubble_all(v); std::println("外面这只 {}", v);    // 还是 [5, 2, 8, 1]
    return 0;
}` },
        { t: `p`, text: `先预测再动手：**不报错、不警告、函数确实把整串排好了**，打印出来却是原样的 [5, 2, 8, 1] —— 它排的是复印件，出了花括号那份复印件就被扔掉。把 & 加回 std::vector<int>& v，同一行打印立刻变成 [1, 2, 5, 8]。这就是第 64 课那条坑的完整道理，也说明「要不要 &」既是**正确性**问题也是**性能**问题：四个数复印一下无所谓，一万个数的成绩单每次调用都整份搬一遍，光拷贝就白花时间。` },
        { t: `h2`, text: `演示 3 · 自己写一个交换两个数的函数（源稿任务 2）` },
        { t: `code`, lang: `c++`, code: `#include <print>

void swap_two(int& a, int& b) {        // 两个都得是引用
    int t = a;                         // 备用盒
    a = b;
    b = t;
}

int main() {
    int x = 1, y = 7;
    swap_two(x, y);
    std::println("x = {} y = {}", x, y);       // 7 1
    return 0;
}` },
        { t: `p`, text: `输出「x = 7 y = 1」，两个数真的换了。这个函数里**两个参数都必须是引用**。只给第一个带 &（写成 void swap_two(int& a, int b)）会怎样？我跑过实测：x 和 y 变成 **7 和 7** —— a = b 那一步把 x 写成了 y 的值，而 b = t 那一步写进的是 y 的复印件，原件一动没动，1 就这么丢了。症状比「什么都没换」更凶：两个变量变成同一个值。备用盒 t 用的还是第 63 课那三只盒子的动作。源稿把这个函数叫 swap，本课改名 swap_two：标准库里已经有一个现成的 std::swap，同名混着用容易看不清在叫谁。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `要改原件却没带 & —— 本课的主坑。症状是「程序跑得很成功，什么都没变」：不报错、不警告，函数里的值是对的，外面原封不动。查它只有一个办法：**调用前后各打印一次**同一只盒子，两行一对比，漏了 & 立刻现形。`,
          `写一只没绑定的引用：int& r;。编译不过，报错大意是「r 声明成了引用但没有初始化」。引用天生是「给已有的东西再起一个名字」，没有正主它就不成立；本课一律写成 int& r = a; 一步绑好。`,
          `给 swap_two 只加一个 &。实测 1 和 7 跑完变成 7 和 7：带 & 的那一个被写成了对方的值，没带 & 的那个原件一动没动，一个数凭空丢了。**一趟要改几只原件，就得挂几个 &**。`,
          `只读大盒子却用传值：void show(std::vector<int> v)。合法、结果也对，就是每次调用复印一整份，盒子越大越慢。只读就用 const std::vector<int>& v —— 既省拷贝，又让「不小心改了」当场报错。`,
          `拿着 const 引用硬要改，比如函数里写一句 v.push_back(9)，报错大致是「丢掉限定符 / 只读位置不能赋值」。别急着删 const 来「消错」—— 先想清楚这件事该不该动原数据；真要动，就把 const 换成普通引用，让意图写在参数里。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把 by_ref 的 & 删掉再跑一遍：先在纸上预测三行输出会变成什么，再跑起来对答案`,
          `写 swap(int&, int&)，交换两个数：本课给这个函数起名叫 swap_two，把 main 里的 x = 1 和 y = 7 换过来，打印验证`,
          `延伸 1：把演示 3 改成只给第一个参数带 &，跑一遍，看看两个数到底换了几个，解释为什么。`,
          `延伸 2：写一只只读函数 void show(const std::vector<int>& v)，把第 64 课那串数一行打出来；再加一句 v.push_back(9)，先预测再编译，把报错读一遍。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：参数里没 & 就是复印件（改了白改，原稿安然无恙），有 & 就是原稿的外号（写什么留什么），const & 是「看原稿但不许写」；要改几只原件就挂几个 &，而漏掉 & 的那种失败一声不吭。` }
      ]
    }
  ]
};
