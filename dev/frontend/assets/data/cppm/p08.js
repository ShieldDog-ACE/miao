/* 喵站 · C++ 掌握 正文分部 p08：第 105–108 课
 *
 * 源稿：105_sort排序.cpp、106_二分查找.cpp、107_最值与统计.cpp、108_unique去重两步走.cpp
 * 这四课是「标准库算法」的第一批正式登场：sort 排、bound 查、统计三件套、unique 去重。
 * 写法上接着掌握课的习惯：不只讲怎么写，更讲「它凭什么这么做」。
 */
window.MIAO_CPPM_P08 = {
  chapters: [
    {
      id: `m105`, title: `第 105 课 · sort：标准库送的高速排序，规矩由你定`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把 std::sort 当成一件正式工具用熟 —— 升序、降序、自定义规则三种排法都会写，并能说清比较器到底在回答什么问题。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `排序这件事你手写过了：两层圈、比一比、换一换，一圈一圈把大的往后赶。标准库把这套动作打包成了一个函数 std::sort，一句调用就把整段排好。而且它用的不是你那种两层圈的慢办法：内部在快排、堆排、插入排序之间自己挑，数据量小的时候切插入排序，快排递归太深就换堆排兜底，所以你既拿到平均 n log n 的速度，又不会被「最坏情况退化成平方」阴到。` },
        { t: `p`, text: `sort 收的不是容器，是**区间** —— 两个「位置」框出一段：起点、终点。写法是 nums.begin() 到 nums.end()，约定是**左闭右开**：begin 那一格要排，end 那一格不动。end 指向的是「最后一格后面的那个空位」，它是门牌号不是住户。这条约定在标准库里到处都是，今天先把它记死：区间长度等于 end 减 begin，而不是「包含 end」。` },
        { t: `p`, text: `默认排法是升序，小的在前。想换规矩就给第三个参数 —— 一个「谁排前面」的 lambda。第 87 课你已经写过它了（先比次数、平局再比单词），所以**自定义比较器不是今天的新内容**；今天新的是 sort 这个函数本身被正式请出来当工具用。比较器的工作方式很笨也很干净：排序过程中 sort 随时抽两格 a 和 b 问你「a 该排在 b 前面吗」，你只答 true 或 false，谁站在哪个位置、怎么搬、搬几次，全是 sort 的事。` },
        { t: `p`, text: `于是「排序规矩」被压成了一个问句的答案：返回 true 就是 a 在前。所以分数从高到低写 a.score > b.score，名字按字典序靠前写 a.name < b.name。很多人在这儿卡住，是因为脑子里把比较器读成了「谁比谁大」—— 不是，它读作「谁该排在前面」。这两个读法在降序时正好相反，想明白这一句，三种排法就统一了。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `sort 对比较器只提一条要求：**严格弱序**。拆成人话是三条：自己不该排在自己前面，cmp 同元素必须答 false；a 在 b 前、b 在 c 前，那 a 也得在 c 前，规矩不能自相矛盾；如果 a 该在 b 前，b 就不许也该在 a 前。最容易踩坏的是第三条 —— 把小于等于或大于等于写进比较器，两个相等的元素就会互相举报「我该在你前面」，sort 在这种矛盾的答复里会去访问根本不存在的位置，轻则乱序重则直接崩。一句话记住：**相等的时候永远答 false**。` },
        { t: `code`, lang: `text`, code: `cmp(a, b) 等于 true   →   a 要排在 b 前面，sort 照办
cmp(a, b) 等于 false  →   只说明「a 不必在 b 前」，不等于 a 在后面

a 与 b 平局时正确写法：两个方向都答 false
   cmp(a, b) 是 false 且 cmp(b, a) 也是 false   →   合法，但谁先出现 sort 不保证
   想用 true 来表达平局                          →   破坏严格弱序，后果自负` },
        { t: `h2`, text: `怎么做` },
        { t: `code`, lang: `c++`, code: `#include <algorithm>
#include <functional>
#include <print>
#include <vector>

std::vector<int> nums = {5, 2, 8, 1, 9, 3};

std::sort(nums.begin(), nums.end());                    // 默认升序
std::sort(nums.begin(), nums.end(), std::greater<>());  // 降序：大的在前

// 自定义：a 该排在 b 前面就返回 true
std::sort(nums.begin(), nums.end(),
          [](int a, int b) { return a % 2 == 1 && b % 2 == 0; });` },
        { t: `p`, text: `三行调用，形状一模一样，只有第三个参数在变。头文件各有各的活：<algorithm> 是 sort 的家，写了 sort 不包它，编译器会抱怨 'sort' is not a member of std；<functional> 供 std::greater 这类预置比较器；<vector> 与 <print> 是老熟人。std::greater<>() 后面那对**空尖括号**是「类型你自己看着办」，编译器按元素类型推出来，比写 std::greater<int>() 少一处要维护的地方。` },
        { t: `h2`, text: `演示 1 · 升序与降序` },
        { t: `code`, lang: `c++`, code: `#include <algorithm>
#include <functional>
#include <print>
#include <vector>
int main() {
    std::vector<int> nums = {5, 2, 8, 1, 9, 3};
    std::sort(nums.begin(), nums.end());                   // 升序
    for (int v : nums) std::print("{} ", v);
    std::println("");
    std::sort(nums.begin(), nums.end(), std::greater<>()); // 降序
    for (int v : nums) std::print("{} ", v);
    std::println("");
    return 0;
}` },
        { t: `p`, text: `输出两行：1 2 3 5 8 9 和 9 8 5 3 2 1。留意第二次 sort 排的是**已经排过一次的同一只 vector**，区间还是那两个端点 —— 排第二次不需要先还原，sort 只关心当前这段格子。另外 nums.end() 那个位置从头到尾没被读过：整段是「含头不含尾」，这点在下面那张图里画得比话说得清楚。` },
        { t: `svg`, caption: `sort 排的是左闭右开的区间：begin 指第一格，end 指最后一格后面的空位；第三个参数决定「谁排前面」`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 220">
  <g font-size="13" fill="#142639" text-anchor="middle">
    <text x="24" y="26" text-anchor="start" font-weight="700" fill="#00599c">std::sort(nums.begin(), nums.end(), 规矩)</text>
  </g>
  <g font-size="13">
    <rect x="40" y="52" width="56" height="42" fill="#eaf3fb" stroke="#00599c"/><text x="68" y="78" text-anchor="middle">5</text>
    <rect x="96" y="52" width="56" height="42" fill="#eaf3fb" stroke="#00599c"/><text x="124" y="78" text-anchor="middle">2</text>
    <rect x="152" y="52" width="56" height="42" fill="#eaf3fb" stroke="#00599c"/><text x="180" y="78" text-anchor="middle">8</text>
    <rect x="208" y="52" width="56" height="42" fill="#eaf3fb" stroke="#00599c"/><text x="236" y="78" text-anchor="middle">1</text>
    <rect x="264" y="52" width="56" height="42" fill="#eaf3fb" stroke="#00599c"/><text x="292" y="78" text-anchor="middle">9</text>
    <rect x="320" y="52" width="56" height="42" fill="#eaf3fb" stroke="#00599c"/><text x="348" y="78" text-anchor="middle">3</text>
    <rect x="376" y="52" width="56" height="42" fill="#f5f6f8" stroke="#9aa6b5" stroke-dasharray="4 3"/><text x="404" y="78" text-anchor="middle" fill="#9aa6b5">空位</text>
  </g>
  <g font-size="12" text-anchor="middle">
    <text x="68" y="112" fill="#1a7f42" font-weight="700">begin ↑</text>
    <text x="404" y="112" fill="#b8500f" font-weight="700">end ↑ 不排它</text>
    <text x="236" y="132" fill="#33465e">六格参与排序，长度等于 end 减 begin 等于 6</text>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="24" y="160" text-anchor="start">比较器只回答一个问句：a 该排在 b 前面吗？</text>
    <text x="24" y="182" text-anchor="start">true 就 a 在前；false 只表示「不必在前」；平局两边都答 false 才安全</text>
    <text x="24" y="206" text-anchor="start" font-weight="700" fill="#b8500f">把 小于等于 写进比较器 → 相等的两格互相举报 → 越界</text>
  </g>
</svg>` },
        { t: `h2`, text: `演示 2 · 自定义规则：奇数在前` },
        { t: `code`, lang: `c++`, code: `// 接演示 1 之后，nums 现在是 9 8 5 3 2 1
std::sort(nums.begin(), nums.end(),
          [](int a, int b) { return a % 2 == 1 && b % 2 == 0; });

for (int v : nums) std::print("{} ", v);
std::println("");` },
        { t: `p`, text: `这个 lambda 只认一件事：a 是奇数**而且** b 是偶数，才答「a 在前」。它是严格弱序吗？是 —— 奇数对奇数答 false，偶数对偶数也答 false，两个方向都是 false 就是「平局」，合法。但代价是**平局谁先谁后不由你定**：实测本机跑出来是 9 5 3 1 8 2，换台机器、换个编译器可能就是 5 9 1 3 2 8，两次都不算 bug。想连平局也钉死，就补第二条比较 —— 这正是第 87 课那条比较链的来路。` },
        { t: `h2`, text: `演示 3 · 两个关键字排成绩单` },
        { t: `code`, lang: `c++`, code: `// 结构体在前，sort 与 print 的头也都包好了
std::sort(v.begin(), v.end(), [](const Student& a, const Student& b) {
    if (a.score != b.score) return a.score > b.score;   // 主键：分数高的在前
    return a.name < b.name;                             // 次键：同分按名字字典序
});` },
        { t: `p`, text: `比较链的读法是自上而下的「先问主键，问不出胜负再问次键」，一条比到能分出胜负为止。它的副产品是**结果唯一**：只要两个学生的分数和名字不完全一样，全表顺序就被钉死了，换机器跑也是同一份榜。这里参数用 const Student& 而不是 Student，是第 61 课那条老规矩 —— 比较器会被调用很多次，按值传等于每次复制一个字符串。` },
        { t: `p`, text: `如果平局你想让它「保持登记时的先后」，那就别补次键，改用 std::stable_sort：调用形状一模一样，只是它多付一份内存和一点时间，买的是「相等元素绝不互换」这个承诺。什么时候买？榜单要求「同分的按录入顺序」时。什么时候不买？只要一个总序能定胜负时，普通 sort 更快也更省。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `忘包 <algorithm>。报错长相是 'sort' is not a member of 'std'，或者干脆提示 std::sort 未声明 —— 它不像 vector 那样会被别的头顺手带进来，sort 得自己请。`,
          `比较器写成小于等于或大于等于。症状最坑：小数据看着全对，规模一大就乱序或直接段错误， sanitizer 会喊 heap-buffer-overflow。根因是相等的两格互相答 true，破坏了严格弱序。`,
          `把容器整个递进去：std::sort(nums)。编译不过 —— 标准库算法收的是**区间**（两个迭代器），不是容器对象。想只排一半就写 begin 到 begin 加 k，这恰恰是区间的好处。`,
          `拿 end 当数据用。nums.end() 那一格根本不存在，解引用读到的是垃圾或越界；要最后一格写 *std::prev(nums.end()) 或者直接 nums.back()。`,
          `排 std::string 时以为得到「字典序」。std::string 的比较按**字节序**，大写在小写前面，Z 在 a 前面。想忽略大小写得自己写比较器（第 19 课那个字符串比大小只会帮你确认「不等」，不会帮你忽略大小写）。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `排 struct：一个含 std::string name 与 int score 的结构体，按分数降序、同分按名字升序，比较两个关键字`,
          `把上一题换成 std::stable_sort，故意造两行同名同分或同分不同名，观察同分者是否保持原顺序，再和普通 sort 的输出对比`,
          `延伸：只排前半段 —— 对一只 6 格的 vector 调用 std::sort 的区间写成 begin 到 begin 加 3，打印整只表，确认后半段一个字节都没动。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：sort 收「左闭右开的区间」加「一个谁排前面的问句」；把比较器读成「a 该排在 b 前面吗」而不是「谁更大」，升序降序自定义就全通了。` }
      ]
    },
    {
      id: `m106`, title: `第 106 课 · 二分查找：猜价格式的闪电定位`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：认识 lower_bound / upper_bound / binary_search 这三兄弟，会拿它们在有序数组里一次砍一半地定位，并说清「找不到」时它们给的是什么。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 87 课找词的时候你是一格一格扫过去的，那叫线性查找：N 格就得准备走 N 步。但查字典你不会从第一页翻起 —— 直接中间翻开，看目标在前面还是在后面，把另一半整页扔掉。这就是**二分查找**：每次比较砍掉一半范围，100 万格最多问 20 次就到位。省下来的不是常数，是量级。` },
        { t: `p`, text: `它凭什么敢扔掉一半？靠一条铁律：**数据必须先排好序**。因为只看中间那一格的值，你要能断定「左边那半整片都不可能有答案」。这个推断只在有序时成立 —— 数组乱着摆的时候，中间那格比目标大，说明不了它左边有没有答案，你可能正好把装着答案的那半扔了。标准库不会替你把数组排序，也不会警告你「这段没排序」，它会一脸平静地返回一个错得离谱的位置。所以这条铁律的执行者只有你。` },
        { t: `p`, text: `标准库把二分做成了三个函数，全都收**区间**，参数形状和上一课的 sort 一模一样。lower_bound 找「第一个 大于等于 x 的位置」，upper_bound 找「第一个 严格大于 x 的位置」，binary_search 只回答「有没有」。注意它们的返回值是**位置**不是值 —— 找不到时不会返回 -1，而是返回 a.end()，也就是「该插在末尾」那个空位。想拿它当值打印，得先确认它不等于 end，否则你解引用的是一个不存在的格子。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `为什么标准库给的是「位置」而不是「值或 -1」？因为**位置比值能干更多活**：知道第一个 大于等于 x 的格在哪，等于同时知道了三件事 —— x 在不在、x 该插在哪、以及比 x 小的有几个。你以后写「插入一个数并保持整表有序」，只需要 lower_bound 拿位置再插进去，全程不用自己写圈。而 -1 那种约定只能回答「在不在」，别的一概不管。这也是标准库的通用心法：**算法回答尽量信息量大的问题，让调用方用减法或比较去提取自己那份答案**。` },
        { t: `code`, lang: `text`, code: `同一个 x 在这段数据里，三兄弟各看到什么
   a = 1  3  5  7  9  11
   lower_bound(6)  → 下标 3，那格的值是 7   第一个 >= 6
   upper_bound(7)  → 下标 4，那格的值是 9   第一个 >  7
   binary_search(7)→ true                   只回答「在不在」
   lower_bound(100)→ 下标 6，等于 end       一个都不满足，走到门外` },
        { t: `p`, text: `最后那行值得多看一眼：找 100 时返回的下标是 6，正好等于 a.size()，也就是 a.end()。它不是「查无此人」的错误码，而是一个诚实的位置 —— 「100 该排在所有数后面」。upper_bound 减 lower_bound 得到「有几个相等」，lower_bound 减 begin 得到「有几个比它小」，这些都是**位置语义白送的**。` },
        { t: `h2`, text: `怎么做` },
        { t: `code`, lang: `c++`, code: `#include <algorithm>
#include <print>
#include <vector>
int main() {
    std::vector<int> a = {1, 3, 5, 7, 9, 11};
    auto lb = std::lower_bound(a.begin(), a.end(), 6);   // 第一个 >= 6
    std::println("第一个 >= 6: {}（下标 {}）", *lb, lb - a.begin());
    auto ub = std::upper_bound(a.begin(), a.end(), 7);   // 第一个 >  7
    std::println("第一个 > 7 : {}（下标 {}）", *ub, ub - a.begin());
    std::println("7 存在吗: {}", std::binary_search(a.begin(), a.end(), 7));
    return 0;
}` },
        { t: `p`, text: `三处细节。**auto** 是必须的姿势：lower_bound 返回的是迭代器类型，写出来长得不想写，交给编译器推。**lb - a.begin()** 是迭代器相减，得到的数字正好是下标 —— 同一个「第几格」的意思，这里换成了两个位置相减的写法。头文件是 <algorithm>，和 sort 同一个家 —— 三个函数全在里面，别再去找什么 <binary_search>。` },
        { t: `h2`, text: `演示 1 · 三次砍半怎么走位` },
        { t: `svg`, caption: `在 1 3 5 7 9 11 里 lower_bound 找 6：三次探测，每次砍掉一半，最后停在第一个不小于 6 的格子`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250">
  <g font-size="13" fill="#142639">
    <text x="24" y="24" font-weight="700" fill="#00599c">第 1 次：中间看第 3 格 7 —— 7 已经不小于 6，右边两格整片扔掉</text>
  </g>
  <g font-size="13" text-anchor="middle">
    <rect x="60" y="36" width="52" height="34" fill="#eaf3fb" stroke="#00599c"/><text x="86" y="58">1</text>
    <rect x="112" y="36" width="52" height="34" fill="#eaf3fb" stroke="#00599c"/><text x="138" y="58">3</text>
    <rect x="164" y="36" width="52" height="34" fill="#eaf3fb" stroke="#00599c"/><text x="190" y="58">5</text>
    <rect x="216" y="36" width="52" height="34" fill="#fff3d6" stroke="#b8722b" stroke-width="2.5"/><text x="242" y="58" font-weight="700">7</text>
    <rect x="268" y="36" width="52" height="34" fill="#f5f6f8" stroke="#9aa6b5"/><text x="294" y="58" fill="#9aa6b5">9</text>
    <rect x="320" y="36" width="52" height="34" fill="#f5f6f8" stroke="#9aa6b5"/><text x="346" y="58" fill="#9aa6b5">11</text>
    <text x="392" y="58" text-anchor="start" fill="#57677c" font-size="12">候选 6 格 → 3 格</text>
  </g>
  <g font-size="13" fill="#142639">
    <text x="24" y="104" font-weight="700" fill="#00599c">第 2 次：只剩 1 3 5，中间看第 1 格 3 —— 3 小于 6，左边整片扔掉</text>
  </g>
  <g font-size="13" text-anchor="middle">
    <rect x="60" y="116" width="52" height="34" fill="#f5f6f8" stroke="#9aa6b5"/><text x="86" y="138" fill="#9aa6b5">1</text>
    <rect x="112" y="116" width="52" height="34" fill="#fff3d6" stroke="#b8722b" stroke-width="2.5"/><text x="138" y="138" font-weight="700">3</text>
    <rect x="164" y="116" width="52" height="34" fill="#eaf3fb" stroke="#00599c"/><text x="190" y="138">5</text>
    <text x="392" y="138" text-anchor="start" fill="#57677c" font-size="12">候选 3 格 → 1 格</text>
  </g>
  <g font-size="13" fill="#142639">
    <text x="24" y="184" font-weight="700" fill="#00599c">第 3 次：只剩 5，5 还是小于 6 → 区间空了，停在第 3 格</text>
  </g>
  <g font-size="13" text-anchor="middle">
    <rect x="60" y="196" width="52" height="34" fill="#f5f6f8" stroke="#9aa6b5"/><text x="86" y="218" fill="#9aa6b5">1</text>
    <rect x="112" y="196" width="52" height="34" fill="#f5f6f8" stroke="#9aa6b5"/><text x="138" y="218" fill="#9aa6b5">3</text>
    <rect x="164" y="196" width="52" height="34" fill="#e7f6ec" stroke="#1a7f42"/><text x="190" y="218">5</text>
    <rect x="216" y="196" width="52" height="34" fill="#e7f6ec" stroke="#1a7f42" stroke-width="3"/><text x="242" y="218" font-weight="700" fill="#1a7f42">7</text>
    <text x="392" y="218" text-anchor="start" fill="#1a7f42" font-size="12" font-weight="700">返回下标 3，那格里是 7</text>
  </g>
</svg>` },
        { t: `p`, text: `看图别看结论：**每次探测都是「拿中间那格和目标比大小」，比完就有一整片被排除**。6 本身不在这段里，但 lower_bound 照样给了一个明确答复 —— 第一个 不小于 6 的位置是 7。这正是它比「找到就返回、没找到返回 -1」更好用的地方：它回答的是「门槛在哪」，而不是「有没有踩到」。` },
        { t: `h2`, text: `演示 2 · 数出一共有几个 7` },
        { t: `code`, lang: `c++`, code: `std::vector<int> d = {3, 5, 7, 7, 7, 9, 11};      // 有序，有重复
auto lo = std::lower_bound(d.begin(), d.end(), 7);  // 第一个 >= 7 → 下标 2
auto hi = std::upper_bound(d.begin(), d.end(), 7);  // 第一个 >  7 → 下标 5
std::println("7 有 {} 个", hi - lo);
d.insert(std::lower_bound(d.begin(), d.end(), 6), 6);
std::println("插完第 2 格是 {}", d[2]);               // 整表仍然有序` },
        { t: `p`, text: `两件事。**数重复个数就是 upper 减 lower**：下标 5 减 2 等于 3，实测输出 7 有 3 个 —— 不用写一个圈。**插入并保持有序**：6 的 lower_bound 是下标 2，插在那里，插完全表还是排好的，实测第 2 格就是 6。这两个套路是「位置语义」的直接红利：你以前要用圈数一遍才能做到的事，现在两次二分加一次减法。顺手还能问「比 7 小的有几个」，答案就是 lower_bound 的下标 3。` },
        { t: `h2`, text: `演示 3 · 数组没排序会怎样` },
        { t: `code`, lang: `c++`, code: `std::vector<int> u = {5, 2, 8, 1, 9, 3};           // 乱序！
std::println("binary_search 找 8: {}", std::binary_search(u.begin(), u.end(), 8));
auto x = std::lower_bound(u.begin(), u.end(), 1);
std::println("lower_bound 找 1 的下标: {}", x - u.begin());` },
        { t: `p`, text: `实测输出是 **false 和 0** —— 8 明明就在第 3 格，binary_search 却说没有；1 明明在第 4 格，lower_bound 报的是下标 0。没有报错、没有警告，只有安静地给出错答案。原因是二分每步都在赌「这格左边都比它小」，乱序时这个赌局五五开，它砍掉的那一半里往往就装着答案。这是本课最需要动手确认的一条：**不排序就二分，是逻辑错误不是编译错误**，查这类 bug 靠看输出对不对，编译器帮不了你。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `拿返回值直接解引用不验 end。找 100 时 lower_bound 返回 end，写成 *lb 打印是越界读，读到的值随机。规矩是先用 it == a.end() 判一次，再碰它指的东西。`,
          `忘了排序，或者排序用的比较器和二分给的不是同一套规矩。这是最阴的一类：数据是排过的，但按名字排的表你按分数去 lower_bound，结果照样安静地错。`,
          `把 lower_bound 和 upper_bound 记反。口诀：lower 含等号，找第一个 不小于；upper 不含等号，找第一个 严格大于。数重复个数才需要两个一起用，只问在不在用 binary_search 或直接比 lower 那一格。`,
          `区间写成 a.begin(), a.begin()。左闭右开意味着这种写法排的是空段，二分立刻返回 begin，很多人在这查半天「为什么永远找不到」。`,
          `把二分用在「没法一步跳到中间」的容器上。二分的快全靠随机访问：给定一个下标立刻就能到那一格。只能顺着一格一格往前走的容器，跳一次比扫一遍还费劲，二分那点便宜一分都占不到，反而更慢。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `造一个有重复的有序数组，用 upper_bound 减 lower_bound 数出 7 有几个`,
          `想一想：数组没排序就二分，会出什么错？动手用一个能骗过二分的例子把错误结果打印出来`,
          `延伸：拿 std::lower_bound 返回的下标减 begin，算出「这段里有多少个数 小于 7」，再用圈数一遍对答案。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：二分是「拿中间那格赌半边」的查找，赌注是**必须先有序**；标准库给的不是值而是位置，位置能减、能插、能判存在，比 -1 有用得多。` }
      ]
    },
    {
      id: `m107`, title: `第 107 课 · 最值与统计：minmax、accumulate、count_if`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把「找最小最大、求总和、数满足条件的有几个」这三件天天要写的活交给标准库，一个圈都不自己写，并搞清 accumulate 那个起点参数为什么是它的命门。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `从第 86 课起你已经在写同一种圈了：一个累计变量放在圈外，圈里每格进来就动它一笔 —— 数个数、求和、记当前最小值。这种圈写十遍之后你会发现，**每遍变的只有「这笔怎么动」**，遍历本身一字不变。标准库干脆把遍历这一层收走了，给你三个函数：minmax_element 一趟找齐最小和最大，accumulate 从某个起点开始把每一格累计进去，count_if 数满足条件的有几个。` },
        { t: `p`, text: `minmax_element 一次返回**一对**位置，写法是 auto 后跟一对方括号把两个名字接住 —— 这叫结构化绑定，读作「把这一对拆成 mn 和 mx 两个名字」。它比分别调 min_element 和 max_element 省一趟遍历，而它的返回值仍然是**迭代器**，要用星号取值，和上一课那个 lower_bound 是一个脾气。` },
        { t: `p`, text: `accumulate 是这三件里最容易被用错的一个，先把两件事钉住。**第一，它的头文件不是 <algorithm> 而是 <numeric>**，很多人在这卡半天，因为名字听起来完全像个算法。**第二，它的第三个参数是起点**，而且**累计值用的类型就是这个起点的类型**。起点写 0，全程按 int 加；起点写 0.0，全程按 double 加。标准库为什么要你给起点而不自己从 0 开始？因为「加法从 0 开始、乘法从 1 开始、拼字符串从空串开始」+「结果要不要小数」这几件事它不敢替你猜，于是把决定权一次交清。` },
        { t: `p`, text: `count_if 收的是一个**一元**谓词：一个参数、返回 bool，意思是「这一格算不算」。别和上一课 sort 的**二元**比较器搞混 —— 那是两个参数回答「谁在前」，这是一个参数回答「是不是」。参数个数写错，编译器给的是一整屏模板报错，看着很凶，其实就这一句事。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `这套形状的统一律是：**算法只负责走一遍，怎么判断和怎么累计由你给的那个小函数决定**。所以标准库不给你「求平均分」这种现成函数 —— 平均等于和除以个数，两个零件都已经在货架上，拼一下就是。这么设计还带来一个好处：同一套遍历，换个 lambda 或换个运算，答案就换了件事。数偶数个数换一句取模，求连乘换一个运算对象，什么都不用重写。` },
        { t: `code`, lang: `text`, code: `minmax_element(区间)            →  一对位置 {最小那格, 最大那格}
accumulate(区间, 起点)        →  一个值，类型等于起点的类型
accumulate(区间, 起点, 运算)  →  第四个参数：每格怎么并进累计值
count_if(区间, 一元谓词)      →  一个数，谓词说 true 的格数` },
        { t: `h2`, text: `怎么做` },
        { t: `code`, lang: `c++`, code: `#include <algorithm>
#include <numeric>
#include <print>
#include <vector>
int main() {
    std::vector<int> a = {5, 2, 8, 1, 9, 3};
    auto [mn, mx] = std::minmax_element(a.begin(), a.end());
    std::println("最小 {} 最大 {}", *mn, *mx);
    std::println("总和 {}", std::accumulate(a.begin(), a.end(), 0));
    std::println("偶数 {} 个", std::count_if(a.begin(), a.end(),
                           [](int v) { return v % 2 == 0; }));
    return 0;
}` },
        { t: `p`, text: `实测三行输出：最小 1 最大 9、总和 28、偶数 2 个。注意 accumulate 那句只有三个参数 —— 没给运算时默认就是加，起点 0 加进去一点不影响结果，这叫 0 是加法的单位元。count_if 那个 lambda 只吃一个 int、吐一个 bool，形状和 sort 的比较器完全不同。` },
        { t: `h2`, text: `演示 1 · 求平均分：整除这个坑` },
        { t: `code`, lang: `c++`, code: `std::vector<int> sc = {88, 72, 95, 60, 79};
int sum = std::accumulate(sc.begin(), sc.end(), 0);
std::println("直接除   {}", sum / sc.size());              // 小数被砍掉
std::println("强转再除 {}", static_cast<double>(sum) / sc.size());
std::println("换个起点 {}", std::accumulate(sc.begin(), sc.end(), 0.0) / sc.size());` },
        { t: `p`, text: `五个人总分 394，真平均是 78.8。实测三行分别是 **78、78.8、78.8** —— 第一行不是算错，是 int 除以整数**本来就只留整数部分**，这是整数除法的规矩，只是不适合这里。两条修法都靠谱：除的那一刻把分子转成 double，或者干脆把起点写成 0.0 让总和一路用 double 加。后者更短，但记住它是**换了累计类型**才起效的，不是魔法。想打两位小数就写 {:.2f}，实测 78.80。` },
        { t: `svg`, caption: `accumulate 是一条流水线：起点当初始累计值，每格进来按运算并进去；起点是 0 就全程整数，起点是 0.0 就全程小数`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 236">
  <g font-size="13" fill="#142639">
    <text x="24" y="24" font-weight="700" fill="#00599c">std::accumulate(a.begin(), a.end(), 0)   起点 0 → 累计类型是 int</text>
  </g>
  <g font-size="13" text-anchor="middle">
    <rect x="24" y="40" width="60" height="36" fill="#fff3d6" stroke="#b8722b" stroke-width="2.5"/><text x="54" y="63" font-weight="700">0</text>
    <rect x="126" y="40" width="52" height="36" fill="#eaf3fb" stroke="#00599c"/><text x="152" y="63">5</text>
    <rect x="178" y="40" width="52" height="36" fill="#eaf3fb" stroke="#00599c"/><text x="204" y="63">2</text>
    <rect x="230" y="40" width="52" height="36" fill="#eaf3fb" stroke="#00599c"/><text x="256" y="63">8</text>
    <rect x="282" y="40" width="52" height="36" fill="#eaf3fb" stroke="#00599c"/><text x="308" y="63">1</text>
    <rect x="334" y="40" width="52" height="36" fill="#eaf3fb" stroke="#00599c"/><text x="360" y="63">9</text>
    <rect x="386" y="40" width="52" height="36" fill="#eaf3fb" stroke="#00599c"/><text x="412" y="63">3</text>
    <text x="470" y="63" text-anchor="start" fill="#1a7f42" font-weight="700">累计 28</text>
  </g>
  <g font-size="12" fill="#57677c">
    <text x="24" y="96">一路加：0 → 5 → 7 → 15 → 16 → 25 → 28，每步都是整数，没有小数可藏</text>
  </g>
  <g font-size="13" fill="#142639">
    <text x="24" y="128" font-weight="700" fill="#b8500f">28 除以 6 —— 整数除整数，小数当场被砍：得 4</text>
    <text x="24" y="156" font-weight="700" fill="#1a7f42">起点换成 0.0 → 累计一路是 double，28.0 除以 6 → 4.666666666666667</text>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="24" y="188">第四个参数管「怎么并」：不写就是加；写 std::multiplies<>() 就是连乘，这一串得到 2160</text>
    <text x="24" y="212" font-weight="700" fill="#00599c">起点决定类型，第四个参数决定运算 —— 这两格填对，遍历就白送</text>
  </g>
</svg>` },
        { t: `h2`, text: `演示 2 · accumulate 的第四个参数` },
        { t: `code`, lang: `c++`, code: `std::vector<int> a = {5, 2, 8, 1, 9, 3};
std::println("连乘 {}", std::accumulate(a.begin(), a.end(), 1, std::multiplies<>()));
std::string s = "abc";
std::println("拼起来 {}", std::accumulate(s.begin(), s.end(), std::string{}, std::plus<>()));` },
        { t: `p`, text: `实测 **2160** 和 **abc** —— 同一套遍历，第四个参数一换，求和变求积；起点换成空串、元素换成字符，还能把字符一段段拼成字符串。std::multiplies<>() 和 std::plus<>() 都是标准库预置的运算对象，来自 <functional>，空尖括号同样交给编译器推类型。要自己写规则，第四格换成一个 lambda 也行 —— 两个参数，一个是累计值、一个是本格元素，返回新的累计值。` },
        { t: `h2`, text: `演示 3 · 空表和三件套的脾气` },
        { t: `code`, lang: `c++`, code: `std::vector<int> e;                       // 空的
auto [n1, n2] = std::minmax_element(e.begin(), e.end());
std::println("空表求和 {}", std::accumulate(e.begin(), e.end(), 0));
std::println("最小那格就是 begin? {}", n1 == e.begin());` },
        { t: `p`, text: `实测输出 空表求和 0、最小那格就是 begin? true。**空表上 accumulate 直接还你起点值**，这个行为很合理也最有用的用法是「空表求和等于 0」；但 minmax_element 在空表上返回的两个位置都等于 begin，也就是 end —— 去解引用它就是读不存在的格子。所有统计前加一句 e.empty() 的判断，是三件套共同的护身符。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `accumulate 忘包 <numeric>。报错长相是 'accumulate' is not a member of 'std'，而且它不像 sort 那样能被别的头顺手带进来 —— 名字骗人，家在 <numeric>。`,
          `起点写 0 又想要小数平均值。整数除法当场截断，得到 78 这种看着「差不多」的答案，比直接崩难查十倍。要么起点 0.0，要么除的时候 static_cast。`,
          `count_if 的谓词写成两个参数。那是比较器的形状，谓词只吃一格、答一个是非。编译器的错屏很长，根子就这一句。`,
          `空表上不判空就 *n1。minmax_element 给的两个位置都是 end，解引用越界；极差这种「最大减最小」的算法，先 empty 再算。`,
          `连乘用 int 起点 1 求阶乘。13 的阶乘就已经超过 int 上限，乘到一半值开始乱跳甚至变负 —— 求积的起点写 1LL 之类的长整型，或者干脆用 double。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `用「总和 / size」求平均分，注意把总和转成 double，别让小数被整除掉`,
          `查一查：accumulate 的第四个参数是什么？试试 std::multiplies<>，用它把一串数连乘起来`,
          `延伸：用 count_if 数出班里「及格但不到优秀」的人数（60 到 89 这一档），再把这句谓词换成 lambda 写法的等价形式。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：统计三件套只负责走一遍，判断和累计全由你给；记两件事 —— accumulate 的头是 <numeric> 且**累计类型等于起点类型**，谓词是一元而比较器是二元。` }
      ]
    },
    {
      id: `m108`, title: `第 108 课 · unique 去重两步走：它不删，只是搬到尾巴`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把「一份名单去掉重复」写成标准库的两步走 —— 先 sort 让相同的挨在一起，再 unique 加 erase 才真正少掉格子，并说清 unique 为什么不自己动手删。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `去重这活你第 87 课已经干过一次了：来一个词就在登记表里查有没有，没有才登记。那条路是对的，今天走另一条 —— 标准库给的那条。但这条路上有一个**几乎所有新手都踩空的事实**：std::unique 一个元素都不会删除。它只是把「重复的那些」往后挪，挪到还没处理的位置上，容器的长度**一格都没变**，尾巴上还挂着搬过来的旧值。它真正的产出是**一个位置**，意思是「不重复的前一段到这儿为止」。要变小，必须你自己拿这个位置去调 erase。` },
        { t: `p`, text: `第二件事：unique **只认相邻的重复**。它内部是一趟扫描，每格只跟「上一个被留下的」比一下，不同就把这格往前放。正因为只看邻居，它能做到一趟走完、不借额外内存；也正因为只看邻居，相同的两个数中间隔了一个别的数就看不见。所以套路的第一步永远是 sort —— 把相同的凑成邻居。` },
        { t: `p`, text: `第三件事，也是这套设计最值得琢磨的地方：**为什么标准库不把这一步做成一个函数直接删干净**？因为算法手里只有两个迭代器，它只被授权「重排这一段里的元素」，没有权利去改容器的大小 —— 它压根不知道自己服务的是一只 vector 还是别的什么，也不知道还能不能腾出格子。整条标准库都守这条规矩：**算法只搬不删，删是容器自己的活**。于是 unique 和 erase 这对搭档就成了教科书级的样本：算法负责给出「新边界」，容器负责把边界之外真剁掉。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `code`, lang: `text`, code: `第一步 sort    让相同的挨在一起        →  1 1 2 2 3 3 5   size 7
第二步 unique  把重复的往后搬，给边界  →  1 2 3 5 3 3 5   size 还是 7，边界在下标 4
第三步 erase   剁掉边界到 end         →  1 2 3 5         size 4，这才叫真删了` },
        { t: `p`, text: `读这三行只要记住一个对照：**unique 改的是「内容」，erase 改的是「长度」**。少了第三步，你的表看着像去好重了，range-for 一打却看见旧值还在 —— 而且它们随时可能在下一次插入时被覆盖掉，属于那种「今天不崩、下周崩」的雷。` },
        { t: `h2`, text: `怎么做` },
        { t: `code`, lang: `c++`, code: `#include <algorithm>
#include <print>
#include <vector>
int main() {
    std::vector<int> a = {3, 1, 3, 2, 1, 5, 2};
    std::sort(a.begin(), a.end());               // 1. 让相同的挨在一起
    auto last = std::unique(a.begin(), a.end()); // 2. 重复的搬到尾部
    a.erase(last, a.end());                      // 3. 剁掉尾部，才是真删除
    for (int v : a) std::print("{} ", v);
    std::println("");
    return 0;
}` },
        { t: `p`, text: `实测输出 1 2 3 5。三句连着看：**sort 用默认升序**就够了，因为 unique 后面按 == 比相等；**auto 接住那个边界位置**，它是个迭代器，别去猜类型；**erase 收两个位置**，还是左闭右开 —— 又是第 105 课那条区间约定，从 begin 到 end 这套「含头不含尾」在标准库里一以贯之。头文件仍是 <algorithm>，和 sort、lower_bound 同一个家。` },
        { t: `svg`, caption: `去重三步走：sort 凑邻居，unique 只搬不改长度并给出一条新边界，erase 才把边界后面真删掉`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250">
  <g font-size="13" fill="#142639">
    <text x="24" y="22" font-weight="700" fill="#00599c">原始  3 1 3 2 1 5 2        size 7</text>
  </g>
  <g font-size="13" text-anchor="middle">
    <rect x="24" y="32" width="46" height="32" fill="#eaf3fb" stroke="#00599c"/><text x="47" y="53">3</text>
    <rect x="70" y="32" width="46" height="32" fill="#eaf3fb" stroke="#00599c"/><text x="93" y="53">1</text>
    <rect x="116" y="32" width="46" height="32" fill="#eaf3fb" stroke="#00599c"/><text x="139" y="53">3</text>
    <rect x="162" y="32" width="46" height="32" fill="#eaf3fb" stroke="#00599c"/><text x="185" y="53">2</text>
    <rect x="208" y="32" width="46" height="32" fill="#eaf3fb" stroke="#00599c"/><text x="231" y="53">1</text>
    <rect x="254" y="32" width="46" height="32" fill="#eaf3fb" stroke="#00599c"/><text x="277" y="53">5</text>
    <rect x="300" y="32" width="46" height="32" fill="#eaf3fb" stroke="#00599c"/><text x="323" y="53">2</text>
  </g>
  <g font-size="13" fill="#142639">
    <text x="24" y="92" font-weight="700" fill="#00599c">sort 后  1 1 2 2 3 3 5            相同的成了邻居</text>
  </g>
  <g font-size="13" text-anchor="middle">
    <rect x="24" y="102" width="46" height="32" fill="#eaf3fb" stroke="#00599c"/><text x="47" y="123">1</text>
    <rect x="70" y="102" width="46" height="32" fill="#ffe1dd" stroke="#b8500f"/><text x="93" y="123" fill="#b8500f">1</text>
    <rect x="116" y="102" width="46" height="32" fill="#eaf3fb" stroke="#00599c"/><text x="139" y="123">2</text>
    <rect x="162" y="102" width="46" height="32" fill="#ffe1dd" stroke="#b8500f"/><text x="185" y="123" fill="#b8500f">2</text>
    <rect x="208" y="102" width="46" height="32" fill="#eaf3fb" stroke="#00599c"/><text x="231" y="123">3</text>
    <rect x="254" y="102" width="46" height="32" fill="#ffe1dd" stroke="#b8500f"/><text x="277" y="123" fill="#b8500f">3</text>
    <rect x="300" y="102" width="46" height="32" fill="#eaf3fb" stroke="#00599c"/><text x="323" y="123">5</text>
    <text x="380" y="123" text-anchor="start" fill="#b8500f" font-size="12">淡红这几格是待搬走的重复</text>
  </g>
  <g font-size="13" fill="#142639">
    <text x="24" y="162" font-weight="700" fill="#b8500f">unique 后  1 2 3 5 3 3 5      size 仍是 7，边界在下标 4</text>
    <text x="24" y="196" font-weight="700" fill="#1a7f42">erase 后    1 2 3 5            size 4，尾巴上的旧值这才没了</text>
  </g>
  <g font-size="13" text-anchor="middle">
    <rect x="24" y="206" width="46" height="30" fill="#e7f6ec" stroke="#1a7f42"/><text x="47" y="226">1</text>
    <rect x="70" y="206" width="46" height="30" fill="#e7f6ec" stroke="#1a7f42"/><text x="93" y="226">2</text>
    <rect x="116" y="206" width="46" height="30" fill="#e7f6ec" stroke="#1a7f42"/><text x="139" y="226">3</text>
    <rect x="162" y="206" width="46" height="30" fill="#e7f6ec" stroke="#1a7f42"/><text x="185" y="226">5</text>
  </g>
  <text x="240" y="226" text-anchor="start" font-size="12" fill="#33465e">算法只搬不删，删是容器自己的活</text>
</svg>` },
        { t: `h2`, text: `演示 1 · 不 erase，尾巴里藏着什么` },
        { t: `code`, lang: `c++`, code: `std::vector<int> a = {3, 1, 3, 2, 1, 5, 2};
std::sort(a.begin(), a.end());
auto last = std::unique(a.begin(), a.end());
for (int v : a) std::print("{} ", v);                     // 1 2 3 5 3 3 5
std::println("");
std::println("边界下标 {}，size {}", last - a.begin(), a.size());` },
        { t: `p`, text: `实测打印 1 2 3 5 3 3 5，边界下标 4、size 还是 7。看清楚了：**尾巴上的 3 3 5 就是被搬走的旧值**，它们还活着，range-for 照样走到，只是不再属于「去重结果」。这也是为什么很多人写完 unique 发现「程序看着对、输出一打全是多的」—— 他信了 unique 的名字，没信它的返回值。` },
        { t: `h2`, text: `演示 2 · 不排序能不能去重` },
        { t: `code`, lang: `c++`, code: `std::vector<int> b = {3, 1, 3, 2, 1, 5, 2};      // 故意不 sort
auto last = std::unique(b.begin(), b.end());
for (int v : b) std::print("{} ", v);             // 一个都没搬动
std::println("");
std::println("边界下标 {}，size {}", last - b.begin(), b.size());` },
        { t: `p`, text: `实测输出 3 1 3 2 1 5 2，边界下标 7、size 7 —— **一格都没动**。原因就在「只看邻居」：3 和 3 中间夹着 1，1 和 1 中间夹着 2，谁都不是谁的邻居，unique 一个重复都没发现。所以「不排序能去重吗」的答案是：**不能，除非重复本来就是挨着的**。挨着这一条你要么用 sort 造出来，要么靠数据本身的来路保证 —— 想要「保留第一次出现的顺序」那种去重，得回到第 87 课那张登记表的路子，本课这套做不到。` },
        { t: `h2`, text: `演示 3 · 自定义「什么算重复」` },
        { t: `code`, lang: `c++`, code: `std::vector<int> v = {21, 11, 22, 31, 12};
std::sort(v.begin(), v.end());                              // 11 12 21 22 31
auto last = std::unique(v.begin(), v.end(),
                        [](int a, int b) { return a / 10 == b / 10; });
v.erase(last, v.end());
for (int x : v) std::print("{} ", x);                       // 11 21 31` },
        { t: `p`, text: `unique 还有第二个形态：最后收一个**二元谓词**，回答「这两格算不算同一个」。默认版本比的是 ==，这里改成「十位相同就算同一个」，于是 11 和 12 归成一类、21 和 22 归成一类，实测留下 11 21 31。注意参数形状 —— 是**两个**元素进来、一个 bool 出去，和上一课那个 count_if 的一元谓词不同，倒和第 105 课的比较器像。但别搞错职责：比较器说的是「谁在前」，这个谓词说的是「是不是一回事」，后者必须让相同的两格答 true。` },
        { t: `h2`, text: `常见坑` },
        { t: `p`, text: `落坑之前先把这条路线的**代价**称一下，判断才有依据。sort 加 unique 加 erase 整体是 n log n 量级，而第 87 课那种「每来一个元素就把登记表从头扫一遍」的写法在最坏情况下是 n 方量级：一万行名单，前者跑完你还能喝口水，后者要扫上亿次，是能不能等的区别。它换掉的代价是**原来的顺序没了** —— 整张表被重排过。所以选路的口诀是：只要一份「不重复的集合」，走本课这两步；既要不重复又要保留第一次出现的先后，走第 87 课那张登记表。两条路都对，别拿一条去硬套另一种需求。` },
        { t: `ul`, items: [
          `跑了 unique 没跑 erase，然后奇怪 size 怎么没变。更麻烦的是尾巴那些旧值会被下一次 push_back 覆盖，中间某段时间你以为表里还有七个东西。判据只有一条：**看 size 有没有变小**，unique 之后 size 一定不变。`,
          `忘了 sort。症状是最坑的一种：数据碰巧有几组挨着的重复，看着像生效了，实际漏掉一半。`,
          `拿 unique 想「按大小写无关」或「按业务上算同一个人」去重，却只喂了默认版本。默认只认 ==，别的规矩得走第三个参数那个二元谓词，而且 sort 的比较口径要和谓词的口径配套。`,
          `在遍历的过程中 erase。range-for 走到一半把容器缩了，手里的位置当场作废，属于典型的未定义行为。正确姿势是先算出边界，遍历结束后再一次性 erase。`,
          `对别的容器照抄这套写法。unique 本身各容器都能用，但 erase 收迭代器这一手不是所有容器都给 —— 遇到不给的容器要用它自己的成员函数删。这也是标准库那条「容器和算法各管一段」规矩的另一面。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `只跑 sort 加 unique，不 erase，打印全部元素，看看"尾巴"里藏着什么，再说清 size 为什么没变`,
          `不排序能去重吗？动手试试，解释为什么`,
          `延伸：给一串 std::string 名单去重，用第三个参数把「完全相同才算重复」改成「只看前三个字母相同就算重复」，先 sort 再走两步。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：去重是两步走 —— unique 只把相邻的重复往后搬、给你一条新边界，erase 才真把边界后面剁掉；想让相同的成为邻居，先 sort。` }
      ]
    }
  ]
};
