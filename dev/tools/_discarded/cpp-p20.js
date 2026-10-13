/* 喵站 · C++ 入门 正文分部 p20：第 64–66 课（第九轮 · 冒泡完整版 + 冒泡优化 + 传值 vs 传引用）
 *
 * 源稿：学习资料/C++入门/64_冒泡完整版一轮一轮排到底.cpp、65_冒泡优化没交换就提前收工.cpp、66_传值vs传引用一页分清.cpp
 * 款式照 p13、p01 样板：tip 蓝·本课目标 → 原理讲解 → 它被设计成什么样 → 演示 1/2/3 → 常见坑 → 任务 → tip 绿·本课一句话
 *
 * 闸线备忘（本批守住的）：
 *   c64 三处读者可见字段一律不提标准库那个排序函数 —— 它第 65 课才第一次和冒泡对照着讲。
 *   new、delete、智能指针、struct、class 都不在本批三课里，一律不碰。
 *   引用参数（60 课）、const 引用（61 课）已教过，c66 正是对比课，放心用。
 *   讲解正文不写半角圆括号：函数名裸写，补充说明用中文括号。
 *   交叉引用只往回指，往前看的统一写「下一课」「以后再讲」。
 *
 * 验收：node dev/tools/cpp-audit.cjs --part dev/frontend/assets/data/cpp/p20.js
 *       node dev/tools/cpp-exam-check.cjs --only c64,c65,c66
 */
window.MIAO_CPP_P20 = {
  chapters: [
    {
      id: `c64`, title: `第 64 课 · 冒泡完整版：一轮一轮排到底`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把上一课那一轮套进外层循环，写成一条完整的 bubble_sort —— 每走完一轮就有一个数在右边归位，归位的越多，下一轮要比的就越少，n 个数最多走 n-1 轮。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课你只把队伍过了一遍：从头到尾，相邻两个人比一比，谁大谁往后挪一步。这一遍走完，最右边那个一定是全班最高的 —— 它一路往后换，没人挡得住。可剩下的人里，第二高的还躲在中间。所以一轮只干成一件事：把最大的那个送到位置上。完整的排序就是把这一轮反复套下去，每轮结束右边多一个归位的，下一轮在剩下的人里再挑一个最大的。这就是冒泡这个名字的来处：最大的先浮到水面，第二大的跟着冒上来。` },
        { t: `p`, text: `代码上只多了一层循环，两层各管什么得说清。外层数轮数：i 从 0 起，走到 n-1 之前，一共 n-1 轮。内层数这一轮要比的一对对：j 也从 0 起，比到 n - i 之前停。右边为什么减掉 i？因为尾巴上已经有 i 个数归位了 —— 第 1 轮收工，最右那格已是全班最高，第 2 轮再拿它比是白费力气。i 这一个变量同时干两件事：记着这是第几轮，顺手当「尾巴上有几个不用比」的尺子。` },
        { t: `p`, text: `两行循环条件里还藏着一个细节：写的是 j + 1 < v.size，而不是 j < v.size - 1。看着等价，其实绕开了一个大坑。v.size 的类型 size_t 只能装非负数，串是空的时它是 0，0 减 1 不会给你 -1，而是翻成一串 1 的天文数字，条件永远成立，j 一路冲出数组末尾去读根本不属于自己的格子。写成加一比较就不做「零减一」这步减法，空串、单元素串因此平安走过 —— 这正是本课任务要你亲手试的。` },
        { t: `p`, text: `还有两处得停下来看一眼。函数头那个 & 千万别丢：第 60 课讲过，加 & 函数手里攥的就是外面那一串本身，不加 & 进去的是复印件，函数里排得整整齐齐，出来原串一动没动 —— 冒泡的全部意义就是改原数据。换两个数用现成的 std::swap，一行搞定两格对调；自己手写交换最容易出错，常见坑里留了现场。` },
        { t: `ul`, items: [
          `**外层管轮**：i 从 0 走到 n-1 之前，一共 n-1 轮；一轮只保证把当轮最大的那个送到右边归位。`,
          `**内层管比**：j 从 0 走到 n - i 之前，每步只看紧挨着的两格，前大后就 std::swap 对调。`,
          `**尾巴越来越短**：每轮多一个归位的数，内层上界跟着少一，比较次数从 n-1 一路降到 1。`,
          `**边界一律加一比较**：写 j + 1 < v.size 这种形状，空串与单元素串都天然安全。`
        ]},
        { t: `svg`, caption: `源稿那串 64 25 12 22 11 一轮一轮排到底：每行是一轮收工后的样子，右边涂绿的格子已归位，下一轮不再比它`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 288" font-family="sans-serif">
  <text x="16" y="22" font-size="14" font-weight="700" fill="#142639">五个人，最多四轮，每轮送一个到右边归位</text>
  <text x="16" y="58" font-size="12" font-weight="700" fill="#57677c">初始</text>
  <rect x="120" y="38" width="56" height="30" rx="6" fill="#ffffff" stroke="#57677c" stroke-width="1.5"/>
  <text x="148" y="58" font-size="13" fill="#142639" text-anchor="middle">64</text>
  <rect x="182" y="38" width="56" height="30" rx="6" fill="#ffffff" stroke="#57677c" stroke-width="1.5"/>
  <text x="210" y="58" font-size="13" fill="#142639" text-anchor="middle">25</text>
  <rect x="244" y="38" width="56" height="30" rx="6" fill="#ffffff" stroke="#57677c" stroke-width="1.5"/>
  <text x="272" y="58" font-size="13" fill="#142639" text-anchor="middle">12</text>
  <rect x="306" y="38" width="56" height="30" rx="6" fill="#ffffff" stroke="#57677c" stroke-width="1.5"/>
  <text x="334" y="58" font-size="13" fill="#142639" text-anchor="middle">22</text>
  <rect x="368" y="38" width="56" height="30" rx="6" fill="#ffffff" stroke="#57677c" stroke-width="1.5"/>
  <text x="396" y="58" font-size="13" fill="#142639" text-anchor="middle">11</text>
  <text x="16" y="96" font-size="12" font-weight="700" fill="#57677c">第 1 轮后</text>
  <rect x="120" y="76" width="56" height="30" rx="6" fill="#ffffff" stroke="#57677c" stroke-width="1.5"/>
  <text x="148" y="96" font-size="13" fill="#142639" text-anchor="middle">25</text>
  <rect x="182" y="76" width="56" height="30" rx="6" fill="#ffffff" stroke="#57677c" stroke-width="1.5"/>
  <text x="210" y="96" font-size="13" fill="#142639" text-anchor="middle">12</text>
  <rect x="244" y="76" width="56" height="30" rx="6" fill="#ffffff" stroke="#57677c" stroke-width="1.5"/>
  <text x="272" y="96" font-size="13" fill="#142639" text-anchor="middle">22</text>
  <rect x="306" y="76" width="56" height="30" rx="6" fill="#ffffff" stroke="#57677c" stroke-width="1.5"/>
  <text x="334" y="96" font-size="13" fill="#142639" text-anchor="middle">11</text>
  <rect x="368" y="76" width="56" height="30" rx="6" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="396" y="96" font-size="13" font-weight="700" fill="#2e7d32" text-anchor="middle">64</text>
  <text x="16" y="134" font-size="12" font-weight="700" fill="#57677c">第 2 轮后</text>
  <rect x="120" y="114" width="56" height="30" rx="6" fill="#ffffff" stroke="#57677c" stroke-width="1.5"/>
  <text x="148" y="134" font-size="13" fill="#142639" text-anchor="middle">12</text>
  <rect x="182" y="114" width="56" height="30" rx="6" fill="#ffffff" stroke="#57677c" stroke-width="1.5"/>
  <text x="210" y="134" font-size="13" fill="#142639" text-anchor="middle">22</text>
  <rect x="244" y="114" width="56" height="30" rx="6" fill="#ffffff" stroke="#57677c" stroke-width="1.5"/>
  <text x="272" y="134" font-size="13" fill="#142639" text-anchor="middle">11</text>
  <rect x="306" y="114" width="56" height="30" rx="6" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="334" y="134" font-size="13" font-weight="700" fill="#2e7d32" text-anchor="middle">25</text>
  <rect x="368" y="114" width="56" height="30" rx="6" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="396" y="134" font-size="13" font-weight="700" fill="#2e7d32" text-anchor="middle">64</text>
  <text x="16" y="172" font-size="12" font-weight="700" fill="#57677c">第 3 轮后</text>
  <rect x="120" y="152" width="56" height="30" rx="6" fill="#ffffff" stroke="#57677c" stroke-width="1.5"/>
  <text x="148" y="172" font-size="13" fill="#142639" text-anchor="middle">12</text>
  <rect x="182" y="152" width="56" height="30" rx="6" fill="#ffffff" stroke="#57677c" stroke-width="1.5"/>
  <text x="210" y="172" font-size="13" fill="#142639" text-anchor="middle">11</text>
  <rect x="244" y="152" width="56" height="30" rx="6" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="272" y="172" font-size="13" font-weight="700" fill="#2e7d32" text-anchor="middle">22</text>
  <rect x="306" y="152" width="56" height="30" rx="6" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="334" y="172" font-size="13" font-weight="700" fill="#2e7d32" text-anchor="middle">25</text>
  <rect x="368" y="152" width="56" height="30" rx="6" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="396" y="172" font-size="13" font-weight="700" fill="#2e7d32" text-anchor="middle">64</text>
  <text x="16" y="210" font-size="12" font-weight="700" fill="#57677c">第 4 轮后</text>
  <rect x="120" y="190" width="56" height="30" rx="6" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="148" y="210" font-size="13" font-weight="700" fill="#2e7d32" text-anchor="middle">11</text>
  <rect x="182" y="190" width="56" height="30" rx="6" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="210" y="210" font-size="13" font-weight="700" fill="#2e7d32" text-anchor="middle">12</text>
  <rect x="244" y="190" width="56" height="30" rx="6" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="272" y="210" font-size="13" font-weight="700" fill="#2e7d32" text-anchor="middle">22</text>
  <rect x="306" y="190" width="56" height="30" rx="6" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="334" y="210" font-size="13" font-weight="700" fill="#2e7d32" text-anchor="middle">25</text>
  <rect x="368" y="190" width="56" height="30" rx="6" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="396" y="210" font-size="13" font-weight="700" fill="#2e7d32" text-anchor="middle">64</text>
  <text x="16" y="244" font-size="12" fill="#142639">内层要比的对数依次是 4、3、2、1：越往右归位的越多，剩下要看的越短。</text>
  <text x="16" y="266" font-size="12" fill="#57677c">第 3 轮到第 4 轮：12 和 11 还挡在前头，一轮只挪一位 —— 相邻交换步子小，慢就慢在这儿。</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `为什么正好是 n-1 轮？因为每一轮都保证送一个数归位，n 个数送走 n-1 个，剩下的那一个自然落在最后一格 —— 全班都站好了，最后一个不用喊。少一轮不行：像倒序那种串，走 n-2 轮开头还会留个大的没挪窝；多一轮也不出错，只是白比一次。` },
        { t: `p`, text: `冒泡是被「只许比较相邻两格」这条规矩塑出来的：一次交换最多把一个大的值往右推一位，所以一轮走到底它必然已经推到最右 —— 归位这条保证就是这么来的，外层敢只走 n-1 轮全靠它。也正因为步子小，它慢：12 挡在 11 后头，也得一轮一轮往前挪。本课先把相邻交换写熟。` },
        { t: `h2`, text: `演示 1 · 源稿完整版：五个人排到底` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
void bubble_sort(std::vector<int>& v) {      // 引用：要改原数据
    for (size_t i = 0; i + 1 < v.size(); i++) {          // 一共 n-1 轮
        for (size_t j = 0; j + 1 < v.size() - i; j++) {  // 归位的不用再比
            if (v[j] > v[j + 1]) std::swap(v[j], v[j + 1]);
        }
    }
}
int main() {
    std::vector<int> v = {64, 25, 12, 22, 11};
    bubble_sort(v);                        // 原串被就地改好
    std::println("排序后: {}", v);          // [11, 12, 22, 25, 64]
}` },
        { t: `p`, text: `跑出来就是那行 11 12 22 25 64。整个函数十行不到，却一个 return 都没有 —— 返回类型写的是 void，它不交货，它改货。第 55 课那些零件靠 return 把结果还回来，这一课的零件靠引用参数把结果留在原盒子身上。两种风格各管一半：算出一个新东西就 return，改一整串就递引用。` },
        { t: `h2`, text: `演示 2 · 把每一轮收工的样子打出来` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
void bubble_sort(std::vector<int>& v) {
    for (size_t i = 0; i + 1 < v.size(); i++) {
        for (size_t j = 0; j + 1 < v.size() - i; j++)
            if (v[j] > v[j + 1]) std::swap(v[j], v[j + 1]);
        std::println("第 {} 轮后: {}", i + 1, v);     // 一轮排完看一眼
    }
}
int main() {
    std::vector<int> v = {5, 1, 4, 2, 8};
    bubble_sort(v);
}` },
        { t: `p`, text: `四行输出：第 1 轮后是 1 4 2 5 8，第 2 轮后是 1 2 4 5 8，第 3、第 4 轮后仍是 1 2 4 5 8。前三轮每轮尾巴上多一个归位的数，后两轮什么都没换来 —— 串在第 2 轮结束时就已经排好了，可外层不管，照样把轮数走满。这句「白走了两轮」就是本课留下的尾巴：你能看出哪里在白跑，下一课那个开关就不觉得是花招。打印那句放在外层花括号里、内层之外，位置一挪，输出就从一轮一行变成一步一行。` },
        { t: `h2`, text: `演示 3 · 空串、单元素串：一行都不跑` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
void bubble_sort(std::vector<int>& v) {
    for (size_t i = 0; i + 1 < v.size(); i++)
        for (size_t j = 0; j + 1 < v.size() - i; j++)
            if (v[j] > v[j + 1]) std::swap(v[j], v[j + 1]);
}
void show(std::vector<int> v) { bubble_sort(v); std::println("个数 {} → {}", v.size(), v); }
int main() {
    show({});                              // 空数组
    show({42});                            // 单元素
    show({3, 1});                          // 刚好两个
}` },
        { t: `p`, text: `三行都稳稳打出来：个数 0 → 一对空中括号、个数 1 → 42、个数 2 → 1 3，一次崩溃都没有。空串时外层那句 0 + 1 < 0 一上来就是 false，循环连一圈都不转，直接跳到函数末尾；单元素同理，0 + 1 < 1 也是 false；两个数时外层正好走一轮、内层一比就换。这里的 show 故意不带 & —— 它只要「拿一份复印件排给自己看」，看完就扔。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `**内层边界少了那个 1**：写成 j < v.size - i。它比的是 v[j] 和 v[j + 1]，j 取到 n - i - 1 时，j + 1 正好撞上不该碰的那一格，读越界。当场长相多半是 operator[] call out of bounds 那句断言，或者干脆一个 segmentation fault。`,
          `**外层写成 i < v.size - 1**：空串时 v.size 是 0，size_t 减一不会给你 -1 而是翻成巨大的数，循环一路转直到越界崩掉。根因是无符号整数不许为负、减法直接回绕。改成 i + 1 < v.size，一次减法都不做。`,
          `**参数把 & 丢了**：编译、运行一路绿灯，就是原串纹丝不动 —— 函数辛苦排的是复印件。这是纯逻辑错，编译器不会替你喊。抓现行就在函数末尾加一句打印：里面整整齐齐，外面乱七八糟。`,
          `**手写交换忘了临时盒子**：写成 v[j] = v[j + 1]; 紧跟 v[j + 1] = v[j];。前一句已经把 v[j] 的原值盖掉，后一句拿盖掉之后的值又还回去，两格变成同一个数，数据是真的丢了。要么先 int t = v[j]; 存一份，要么用 std::swap。`,
          `**轮数的账没算清**：i 的上界写大写小都不报错，写小了少一轮排不完，写大了白跑。冒泡靠的就是「轮数够 + 每轮送一个归位」，松一条结果就不平。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `1. 试试排序空数组 {} 和单元素 {42}，确认不崩；再想想循环条件写成 i + 1 < v.size 为什么比 i < v.size - 1 更安全`,
          `2. 把演示 2 那句打印挪进内层循环，看每一次交换长什么样，数一数 {5, 1, 4, 2, 8} 一共换了几次`,
          `3. 延伸：先用倒序串 {9, 7, 5, 3, 1} 跑一遍，确认它必须把 n-1 轮走满；再换已经排好的 {1, 2, 3, 4, 5} 跑一遍，先猜输出再看屏幕。跑完你会明白下一课为什么要给循环加一个开关`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：冒泡就是外层数轮、内层比相邻 —— 每轮送一个数到右边归位，n 个数最多 n-1 轮，边界统一写成加一比较，别让 size_t 的减法把你推进坑里。` }
      ]
    },
    {
      id: `c65`, title: `第 65 课 · 冒泡优化：没交换就提前收工`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：给外层循环装一个开关 —— 一轮走到底连一次交换都没发生，就说明已经排好，当场 break 收工；顺便认识真正干活时该用的 std::sort。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课那条冒泡有个不体面的地方：碰上早就站好的队伍，它照样把 n-1 轮走满，一次交换都不做，纯白跑。这一课给它装个开关，想法很符合直觉：一轮走到底连一次交换都没发生，说明每一对相邻的数都已经前小后大，整串自然排好了 —— 队伍站齐，老师不用再喊口令，直接收工。` },
        { t: `p`, text: `实现它只要一个 bool 变量 swapped，三条规矩。一：它写在外层每一轮开头的花括号里，被赋值成 false —— 一轮一块新黑板，不许把上一轮的笔记带过来。二：一旦发生交换，紧跟一句把它涂成 true，记一笔「这轮换过，还得再走」。三：本轮内层走完再看它，还是 false 就 break 跳出外层。最容易写歪的是第三句的位置：它必须落在内层花括号之外、外层花括号之内。写在最上头，一次都还没比，标志当然是 false，第一圈就收工，等于什么都没排；写进内层里面，第一对没交换就 break，剩下的队伍根本没看。` },
        { t: `p`, text: `凭什么一次没换就敢断定全排好了？冒泡的一轮会把相邻的格子从头到尾各看一遍，没交换的意思就是每一对都前小后大。相邻全都服帖，隔远的更不用提：想藏一个倒着走的对，它左右必然先撞出一对不服气的，那就必然换来一次交换。所以这个开关不是猜已经排好，是拿到了证据才收工。` },
        { t: `p`, text: `开关装好，最好情况从 n-1 轮降到 1 轮，最坏还是 n-1 轮 —— 倒序那种串每轮都得换，一步省不了。写冒泡是为了明白排序怎么一轮一轮长出来；真要干活，C++ 准备了另一条路：std::sort，算法住在 algorithm 这个头文件里。源稿那句用法就是它的全部门槛 —— 递进去一对边界，圈清「从哪儿到哪儿」，它原地把这一段排好，什么都不返回。它内部比冒泡聪明得多：n 个数大致比 n 乘以 log n 次，而不是 n 的平方次，两千个数就是几十万和四百几百万的差别。实际项目请它，学冒泡是为了知道它在替你干什么。` },
        { t: `ul`, items: [
          `**开关每轮重装**：bool swapped = false 待在外层花括号的第一行，一轮一块新黑板。`,
          `**换过就记一笔**：任何一次 std::swap 之后紧跟 swapped = true，别的一句不用改。`,
          `**break 放对位置**：那句判断在内层之外、外层之内 —— 一整轮比完，才有权收工。`,
          `**干活用 std::sort**：一对 begin、end 圈出范围，原地排好，不 return。冒泡懂机制，sort 管生产。`
        ]},
        { t: `svg`, caption: `排 1 2 3 5 4：第 1 轮换了一次所以继续，第 2 轮零交换、标志仍是 false，break 提前收工`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 268" font-family="sans-serif">
  <text x="16" y="22" font-size="14" font-weight="700" fill="#142639">带开关的外层：走两轮就停</text>
  <rect x="16" y="36" width="196" height="72" rx="8" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="114" y="56" font-size="12" font-weight="700" fill="#2e7d32" text-anchor="middle">第 1 轮</text>
  <text x="114" y="76" font-size="12" fill="#142639" text-anchor="middle">5 和 4 换了一次</text>
  <text x="114" y="96" font-size="12" fill="#142639" text-anchor="middle">swapped 涂成 true</text>
  <line x1="212" y1="72" x2="238" y2="72" stroke="#57677c" stroke-width="2"/>
  <polyline points="230,66 238,72 230,78" fill="none" stroke="#57677c" stroke-width="2"/>
  <rect x="244" y="36" width="196" height="72" rx="8" fill="#f4f7fc" stroke="#00599c" stroke-width="2"/>
  <text x="342" y="56" font-size="12" font-weight="700" fill="#00599c" text-anchor="middle">第 2 轮</text>
  <text x="342" y="76" font-size="12" fill="#142639" text-anchor="middle">三对全和气，零交换</text>
  <text x="342" y="96" font-size="12" fill="#142639" text-anchor="middle">swapped 仍是 false</text>
  <line x1="440" y1="72" x2="466" y2="72" stroke="#57677c" stroke-width="2"/>
  <polyline points="458,66 466,72 458,78" fill="none" stroke="#57677c" stroke-width="2"/>
  <rect x="472" y="36" width="152" height="72" rx="8" fill="#fdf0e6" stroke="#b8232f" stroke-width="2"/>
  <text x="548" y="60" font-size="12" font-weight="700" fill="#b8232f" text-anchor="middle">break 收工</text>
  <text x="548" y="80" font-size="12" fill="#142639" text-anchor="middle">第 3、4 轮</text>
  <text x="548" y="98" font-size="12" fill="#142639" text-anchor="middle">根本不跑了</text>
  <text x="16" y="136" font-size="12" font-weight="700" fill="#57677c">上一课：走满 n-1 轮</text>
  <rect x="120" y="120" width="120" height="22" rx="5" fill="#c9d3e0"/>
  <rect x="246" y="120" width="120" height="22" rx="5" fill="#c9d3e0"/>
  <rect x="372" y="120" width="120" height="22" rx="5" fill="#c9d3e0"/>
  <rect x="498" y="120" width="120" height="22" rx="5" fill="#c9d3e0"/>
  <text x="180" y="136" font-size="12" fill="#142639" text-anchor="middle">轮 1</text>
  <text x="306" y="136" font-size="12" fill="#142639" text-anchor="middle">轮 2</text>
  <text x="432" y="136" font-size="12" fill="#57677c" text-anchor="middle">轮 3 白跑</text>
  <text x="558" y="136" font-size="12" fill="#57677c" text-anchor="middle">轮 4 白跑</text>
  <text x="16" y="176" font-size="12" font-weight="700" fill="#2e7d32">这一课：两轮就到</text>
  <rect x="120" y="160" width="120" height="22" rx="5" fill="#dfeadd" stroke="#2e7d32" stroke-width="1.5"/>
  <rect x="246" y="160" width="120" height="22" rx="5" fill="#dfeadd" stroke="#2e7d32" stroke-width="1.5"/>
  <rect x="372" y="160" width="120" height="22" rx="5" fill="#ffffff" stroke="#c9d3e0" stroke-width="1.5" stroke-dasharray="5 4"/>
  <rect x="498" y="160" width="120" height="22" rx="5" fill="#ffffff" stroke="#c9d3e0" stroke-width="1.5" stroke-dasharray="5 4"/>
  <text x="432" y="176" font-size="12" fill="#8fa7c4" text-anchor="middle">省掉</text>
  <text x="558" y="176" font-size="12" fill="#8fa7c4" text-anchor="middle">省掉</text>
  <text x="16" y="214" font-size="12" fill="#142639">代价只有一个 bool：每轮开头写 false，换过一次就涂 true，一轮结束验收一下。</text>
  <text x="16" y="236" font-size="12" fill="#57677c">倒序串仍然是 n-1 轮 —— 开关只救已经排好的那一路，省不了最坏情况。</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `这个开关的设计点很朴素 —— 让循环自己去检查一件它本来就顺手知道的事：这轮换没换过。代价是一个 bool、一次赋值，收益是把最好情况从平方次比较砍到线性：一串已经排好的数，走一遍就收工，只比 n-1 对。它不改算法的形状，只是把一个本来就在你眼前的事实接了出来。` },
        { t: `p`, text: `还有一层要说清：swapped 是「一轮一份」的局部变量，出了外层这一圈就作废，它是每轮现擦干净的黑板，和第 57 课那个「包里存的复印件」不是一回事。挪到函数开头只声明一次的话，第一轮换过之后那个 true 就一直挂着，后面每轮验收都读老账，break 永远轮不到 —— 开关看着装上了，其实一直是通的。` },
        { t: `h2`, text: `演示 1 · 源稿：一个 bool 加一句 break` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
void bubble_sort(std::vector<int>& v) {
    for (size_t i = 0; i + 1 < v.size(); i++) {
        bool swapped = false;                        // 本轮还没换过
        for (size_t j = 0; j + 1 < v.size() - i; j++)
            if (v[j] > v[j + 1]) { std::swap(v[j], v[j + 1]); swapped = true; }
        if (!swapped) break;                         // 一次没换 = 已排好
    }
}
int main() {
    std::vector<int> v = {1, 2, 5, 3, 9};
    bubble_sort(v); std::println("冒泡: {}", v);   // [1, 2, 3, 5, 9]
}` },
        { t: `p`, text: `跑出来是 冒泡: [1, 2, 3, 5, 9]。第 1 轮 5 和 3 换了一次，标志涂成 true，外层接着转；第 2 轮三对看下来一次没换，标志还是本轮开头那个 false，break 收工 —— 五个数本该走四轮，它两轮就走完。源稿这个例子挑得准：一轮排好，第二轮纯验收。` },
        { t: `h2`, text: `演示 2 · 数一数到底走了几轮` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
int main() {
    std::vector<int> v = {1, 2, 3, 5, 4};
    size_t rounds = 0;                               // 走一轮记一笔
    for (size_t i = 0; i + 1 < v.size(); i++) {
        bool swapped = false;
        for (size_t j = 0; j + 1 < v.size() - i; j++)
            if (v[j] > v[j + 1]) { std::swap(v[j], v[j + 1]); swapped = true; }
        rounds++;
        if (!swapped) break;
    }
    std::println("走了 {} 轮，排成 {}", rounds, v);
}` },
        { t: `p`, text: `屏幕上那一行就是本课任务的答案：走了 2 轮，排成 [1, 2, 3, 4, 5]。这串只有一个 4 站错了位置，第 1 轮 5 和 4 一换，串就全对；第 2 轮三对全和气、零交换，break 当场收工。换回上一课的写法它得把四轮走满，多出来那两轮一次交换都没做 —— 开关省下的正是这种轮。rounds 只是给看现场用的，去掉它程序一样跑。` },
        { t: `h2`, text: `演示 3 · 同一串数，交给 std::sort` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <algorithm>                 // std::sort 住在这个头文件里
int main() {
    std::vector<int> v = {64, 25, 12, 22, 11};
    std::sort(v.begin(), v.end());   // 递进去一对边界，原地排好
    std::println("冒泡过的串交给它: {}", v);
    std::vector<int> w = {1, 2, 3, 4, 5};
    std::sort(w.begin(), w.end());   // 已经排好的，它一样只看一眼
    std::println("再排一个整齐的: {}", w);
}` },
        { t: `p`, text: `输出两行都是升序，一行循环都不用你写。它要的是两个边界：begin 指到第一格，end 指到最后一格之后那一格 —— 这种「左边含、右边不含」的圈法在 C++ 里到处在用，以后天天见到。排完还是原来那只 vector，什么都不还回来，改动直接落在你递进去的那一段上，和 bubble_sort 一样是改货不交货。用之前记得把 algorithm 请进来，编译器不会替你请。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `**swapped 声明在两层之外**：整个函数开头只写一次 bool swapped = false，第一轮换过之后那个 true 一直挂着，判断永不成立，开关形同虚设 —— 一句错都不报，只是白加。搬进外层花括号第一行，一轮一块新黑板。`,
          `**那句判断写进了内层**：编译通过，结果只排了一小截 —— 第一对没交换就 break，剩下整串根本没看。判据是「这一整轮都比完了」，它就得待在内层花括号外面。`,
          `**换了却忘了记一笔**：std::swap 后面漏掉 swapped = true，没排好的串被当成排好了，break 提前把循环拆走，出来是个半生不熟的顺序。这类错最阴：不报错，只给你一条看着差不多对的结果。`,
          `**用了 std::sort 却没 include algorithm**：报错长相是 use of undeclared identifier 'sort'，或者 no member named 'sort' in namespace 'std'。它不在 print、vector 那些头文件里，得单独请。`,
          `**一对边界写反了**：写成 std::sort(v.end(), v.begin())，圈出来的范围要么是空的、直接不排，要么非法、当场崩。begin 在前、end 在后，中间那段才是要排的。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `1. 排 {1, 2, 3, 5, 4}，想想它走了几轮就提前停了 —— 演示 2 那句打印就是它的回执`,
          `2. 把开关拆掉再拿同一串跑一遍，数数外层走满几轮；两个轮数摆在一起，优化的收益一眼就出来了`,
          `3. 延伸：已经排好的 {1, 2, 3, 4, 5} 和彻底倒序的 {5, 4, 3, 2, 1} 各跑一遍带开关的版本，看轮数分别是 1 和 4；再用 std::sort 排同样两串，想想它凭什么快得多`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：一轮零交换就是「已经排好」的现场证据 —— 一个 bool 加一句 break，把最好情况从 n-1 轮砍到 1 轮；懂冒泡是为了明白原理，真干活请 std::sort。` }
      ]
    },
    {
      id: `c66`, title: `第 66 课 · 传值 vs 传引用：一页分清`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把两条传参的路一次分清 —— 传值是把复印件交出去，改坏了也不心疼、原稿没事；传引用是把原稿借出去，写什么原稿就留什么。分界只在一个符号：参数那截类型里有没有 &。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 58 课给变量起过外号：int& alias = score; 之后，alias 和 score 是同一个盒子的两个名字，改外号就是改本人。这一课把那件事搬到函数参数上。你写 void by_ref(int& x)，喊 by_ref(b) 的时候，编译器不造新盒子，它把 x 认成 b 的第二个名字 —— 函数身体里那句 x = 999，写的就是 b 本人。你写 void by_value(int x)，喊 by_value(a) 的时候，编译器造出一只属于函数自己的盒子，把 a 的值抄进去，此后两条路各走各的。` },
        { t: `p`, text: `复印件那条路的终点也很关键：函数一返回，它自己那只盒子当场蒸发，里面的 999 跟着没了，外面的 a 从头到尾没被碰过。原稿那条路没有盒子可蒸发，改动落在 b 身上，函数结束了 b 还是 999。这就是源稿那三行打印的全部机关：函数里明明都写了 999，屏幕上传值那行是 10、传引用那行是 999。` },
        { t: `p`, text: `判断只要一眼，看函数头那截类型里有没有 &。没有 &，外面绝对安全，函数再怎么折腾都改不到你的变量，代价是递进去的东西得抄一份；有 &，函数碰的是本人，省掉了抄写的功夫，代价是多一处能改到你的地方。这一进一退就是全部：安全和代价是一枚硬币的两面，选哪一面取决于你到底想让函数干什么。` },
        { t: `p`, text: `抄这份账在小东西上根本不叫事：一个 int 就几个字节，抄它比什么都便宜，所以传值是绝大多数小参数的默认选择。可一整只 std::string、一整串 vector 就不同了，抄一次是真抄一整摞。第 60 课讲过要改原物就加 &，第 61 课又补了第三档：只读大东西写 const 引用 —— 不抄，也不许改，鱼和熊掌都要。本课就是把这三档并排放到一张纸上看。` },
        { t: `ul`, items: [
          `**传值 int x**：抄一份进函数，改不到外面。int、double、bool 这类小东西用它，省心。`,
          `**传引用 int& x**：不抄，x 就是外面那只盒子的外号。要改原物只能走这条，前两课的 bubble_sort 就是靠它把数据留在外面。`,
          `**传 const 引用 const std::string& x**：不抄、也改不动，专门用来读大的东西 —— 第 61 课讲的这一档，本课摆出来对照。`,
          `**一眼判据**：先看那截类型里有没有 &，再看有没有 const。两个符号，就能读出这个函数能不能碰到你。`
        ]},
        { t: `svg`, caption: `左右两条路：左边 by_value 拿到的是一只新盒子，函数结束它就蒸发，a 全程没被碰；右边 by_ref 里的 x 就是 b 的外号，一句赋值直接落在 b 身上`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 286" font-family="sans-serif">
  <text x="16" y="22" font-size="14" font-weight="700" fill="#142639">同一个 999，两条路两种结局</text>
  <text x="16" y="52" font-size="12" font-weight="700" fill="#b8232f">by_value：交出去的是复印件</text>
  <rect x="16" y="62" width="150" height="46" rx="8" fill="#eaf2fb" stroke="#00599c" stroke-width="2"/>
  <text x="91" y="82" font-size="12" font-weight="700" fill="#00599c" text-anchor="middle">外面的 a</text>
  <text x="91" y="100" font-size="13" font-weight="700" fill="#142639" text-anchor="middle">10</text>
  <line x1="166" y1="85" x2="232" y2="85" stroke="#57677c" stroke-width="2"/>
  <polyline points="224,79 232,85 224,91" fill="none" stroke="#57677c" stroke-width="2"/>
  <text x="199" y="76" font-size="12" fill="#57677c" text-anchor="middle">抄一份</text>
  <rect x="240" y="62" width="170" height="46" rx="8" fill="#fdf0e6" stroke="#b8232f" stroke-width="2"/>
  <text x="325" y="82" font-size="12" font-weight="700" fill="#b8232f" text-anchor="middle">函数自己的盒子 x</text>
  <text x="325" y="100" font-size="12" fill="#142639" text-anchor="middle">写进 999</text>
  <text x="430" y="82" font-size="12" fill="#b8232f">函数一返回</text>
  <text x="430" y="100" font-size="12" fill="#b8232f">这只盒子蒸发</text>
  <text x="16" y="140" font-size="12" fill="#142639">结果：a 还是 10 —— 改了白改，原稿一点事没有。</text>
  <text x="16" y="172" font-size="12" font-weight="700" fill="#2e7d32">by_ref：借出去的是原稿</text>
  <rect x="16" y="182" width="150" height="46" rx="8" fill="#eaf2fb" stroke="#00599c" stroke-width="2"/>
  <text x="91" y="202" font-size="12" font-weight="700" fill="#00599c" text-anchor="middle">外面的 b</text>
  <text x="91" y="220" font-size="13" font-weight="700" fill="#2e7d32" text-anchor="middle">10 → 999</text>
  <rect x="240" y="182" width="170" height="46" rx="8" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="325" y="202" font-size="12" font-weight="700" fill="#2e7d32" text-anchor="middle">参数 x，b 的外号</text>
  <text x="325" y="220" font-size="12" fill="#142639">x = 999 就是 b = 999</text>
  <line x1="166" y1="205" x2="240" y2="205" stroke="#2e7d32" stroke-width="2.5"/>
  <text x="430" y="202" font-size="12" fill="#2e7d32">没有第二个盒子，</text>
  <text x="430" y="220" font-size="12" fill="#2e7d32">所以没有蒸发这回事。</text>
  <text x="16" y="266" font-size="12" fill="#57677c">分界只在函数头那截类型里：int x 是复印件，int& x 是原稿的外号，const int& x 是只许看的原稿。</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `C++ 默认传值，是有意的：写代码的人不该在没打招呼的情况下被改到。你喊一个函数，看见递进去的是个普通的 int，就可以假定它不会回头动你的变量 —— 这条默认给整份代码省下一大块心智。想打破默认，就得明写在类型上：那截 & 不是给编译器看的建议，是写给读代码的人看的告示，说明「这个函数会碰原件」。` },
        { t: `p`, text: `为什么不用 return 代替引用？因为 return 一次只能还一样东西，而有些活儿要同时改好几个：交换两个数，两个都得变。让函数还回一只装了两个数的盒子，又重又绕；给两个参数都带上 &，一句调用改两处，直白得多。代价也在同一处 —— 屏幕上的值悄悄变了，读代码的人得回去翻函数头才知道。这就是为什么后面几课会反复要求：只读的东西一律加 const，把「我不会动它」也写进类型里。` },
        { t: `h2`, text: `演示 1 · 源稿现场：同一个 999，两种结局` },
        { t: `code`, lang: `c++`, code: `#include <print>
void by_value(int x) { x = 999; std::println("函数里拿到: {}", x); }   // 复印件
void by_ref(int& x)  { x = 999; }                                     // 原稿的外号
int main() {
    int a = 10, b = 10;
    by_value(a);
    by_ref(b);
    std::println("传值后   a = {}   ← 没变", a);
    std::println("传引用后 b = {}   ← 变了", b);
}` },
        { t: `p`, text: `三行输出按顺序是：函数里拿到: 999，传值后 a = 10，传引用后 b = 999。最容易被误读的是第一行 —— 它打了 999，看着像改成功了，可那只是复印件身上的 999，第二行把真相摊开：a 一动没动。两个函数身体里写的是同一句 x = 999，差别全在函数头那一个 &。这个例子中 a 和 b 一开始都是 10，就是为了让你没处可躲：唯一不同的只有参数类型。` },
        { t: `h2`, text: `演示 2 · 亲手把 & 删掉：先预测再跑` },
        { t: `code`, lang: `c++`, code: `#include <print>
void by_ref(int& x)  { x = 999; }        // 原件
void by_no_amp(int x) { x = 999; }       // 只是把上面那行的 & 删掉
void double_it(int& x) { x = x * 2; }    // 带 & 的算术：改的是本人
int main() {
    int b = 10, c = 10, d = 10;
    by_ref(b);
    by_no_amp(c);
    double_it(d);
    std::println("b = {} c = {} d = {}", b, c, d);
}` },
        { t: `p`, text: `先把预测写在纸上再跑：答案是 b = 999 c = 10 d = 20。by_no_amp 和 by_ref 的身体一字不差，只少了那个 &，c 就稳稳留在 10 —— 这一条对照做完，「加了 & 才改得动」就从知识变成了手感。double_it 顺带说明另一件事：带 & 的参数不只是赋值，任何对 x 的修改都直接落在外面那只盒子上，x 和 d 是同一个格子。` },
        { t: `h2`, text: `演示 3 · 用两个引用参数写 swap` },
        { t: `code`, lang: `c++`, code: `#include <print>
void swap(int& x, int& y) {    // 两个都要改，两个都带 &
    int t = x;                 // 备用盒：先把 x 的原值存住
    x = y;
    y = t;
}
int main() {
    int a = 1, b = 2;
    int big = 100, small = 5;
    swap(a, b);
    swap(big, small);
    std::println("a = {} b = {}", a, b);              // 2 1
    std::println("big = {} small = {}", big, small);   // 5 100
}` },
        { t: `p`, text: `输出是 a = 2 b = 1 和 big = 5 small = 100，两对都真换了。这里三行赋值一行都不能省：t 存住 x 的原值，然后 x 接住 y，最后 y 才从 t 里拿回原来那个 x。写成两行互相赋值 —— x = y; 紧跟 y = x; —— 编译照过，跑出来两个格子变成同一个数，前者的原值丢了，正是上一课常见坑里那场事故。返回值在这里帮不上忙：一次 return 只能还一个 int，可交换要改两处，所以两个参数都得是 int&。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `**忘了 & 还指望函数改到外面**：不报错、不警告，值就是不变。根因：进去的是复印件。修法是把那截类型补成 int& —— 但补之前先确认你真想让别人碰原件，别一路把 & 加满。`,
          `**把字面量或临时值递给引用参数**：写 by_ref(10) 会报 cannot bind non-const lvalue reference of type 'int&' to an rvalue of type 'int'。根因：外号得有本人可挂，10 只是个值、不是那只盒子；递变量名，别递数字。`,
          `**给 const 引用参数赋值**：函数头写 const int& x，身体里 x = 999，报 error: cannot assign to variable 'x' const。根因：const 就是「只许看」，读它、拿它算都行，写它就是违反你自己打的告示。`,
          `**引用参数当保密手段**：a 被函数悄悄改了，读代码的人只看调用处看不出来。规矩是写出来的：函数名或注释里说明白它会改哪几个参数，不改的统统加 const，让类型替你说话。`,
          `**以为外号能换人**：函数里 x 是 a 的外号，写 x = b 不是把 x 改挂到 b 上，而是把 b 的值灌进 a。第 58 课那条最贵的坑搬到参数上照样成立，一个字母都没变。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `1. 把 by_ref 的 & 删掉再跑，先预测输出，再跟屏幕对答案`,
          `2. 写 swap(int&, int&)，交换两个数 —— 备用盒 t 一行都不能省`,
          `3. 延伸：给 swap 加一档只读版本 show_pair，参数写成 const int& 和 const int&，只打印不改；然后手滑在里面加一句 x = 0，看看编译器怎么拦你`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：那个 & 就是复印件与原稿的分界线 —— 要改原物就 int&，只想读大东西就 const int&，小东西图省心就传值；判据永远写在函数头那截类型上。` }
      ]
    }
  ]
};
