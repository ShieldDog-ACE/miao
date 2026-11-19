/* 喵站 · Python 掌握 正文分部 p1：第 1–12 课
 *
 * 导出 window.MIAO_PYDS_P1 = { chapters: [...] }，由 pyds-data.js 按章 id 装配。
 * 六栏固定：目标 tip → 原理讲解 → 假设它能干什么 → 演示 → 常见坑 → 任务 → 一句话 tip。
 * 正文与代码里不出现反引号与模板插值符号；交叉引用只往回指；Python 片段都在 python3 下实跑过。 */
window.MIAO_PYDS_P1 = {
  chapters: [
    {
      id: "p01",
      title: "第 1 课 · 为什么自己写一遍：容器是程序的手脚",
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：知道这门课要手写哪几种容器、每种容器解决什么问题，以及为什么不能只靠现成的 list 和 dict 交差。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `程序里的容器，就是「能存一组数据，并按某种规则取用」的东西。Python 的 list、dict、set、deque 都是 C 层写好的容器，调用只要一行，但数据怎么摆、一次操作动几个元素，全被藏在外壳后面。这门课把这些外壳拆开，用 Python 类把同样的规则重新写一遍。` },
        { t: `p`, text: `手写不等于禁用 list。list 在课里只当一块连续空间使用，真正要写的是它上面的规则：长度和容量怎么记、满了往哪里搬、节点之间怎么连、栈顶和队头在哪、键怎么变成下标。每写一种容器，都要回答三个问题：数据放在哪，一次操作动几个元素，边界情况怎么处理。` },
        { t: `p`, text: `整门课的地图按依赖排：先写动态数组，再写链表；有了这两种底层，栈和队列可以架在上面；队列放宽成双端队列，双端队列再加一条单调规则，就是滑动窗口用的单调队列；最后写哈希表，把键变成下标。树、堆、图后面单独几课讲。后面的结构会反复借用前面的零件：哈希表的每个桶可以是一条链表，单调队列本身就是一个双端队列。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `p`, text: `写完之后，看到 list.append 会想到容量和搬家，看到 dict 会想到哈希和冲突，看到「取中间节点」会想到快慢指针。面试里被问「手写一个缓存」或「判断链表有没有环」，你手里有零件，不用背答案。更实际的好处是调试：数据结构的 bug 大多是指针指错、下标算错、边界漏掉，自己写过一遍，再看别人的实现，能很快找到问题出在哪。` },
        { t: `h2`, text: `演示：先看看现成容器替我们做了什么` },
        { t: `p`, text: `下面这段把三种内置容器各用一次。每个操作都只有一行，但每一行背后都有一份布局和一套代价，这正是后面要拆开的部分。` },
        { t: `code`, lang: `python`, code: `from collections import deque\nsamples = {"list": [1, 2, 3], "deque": deque([1, 2, 3]), "dict": {"a": 1}}\nfor name, obj in samples.items():\n    print(name, len(obj))\nprint(samples["list"][-1], samples["deque"][0], samples["dict"]["a"])` },
        { t: `p`, text: `输出里 list 按位置取了最后一个，deque 取了两端，dict 按键取到了值。这门课会给这三种取法各配一套自己写的实现，先让它们能跑，再算清每一步的代价。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="16" y="16" width="608" height="268" rx="16" fill="#eef6f4"/><text x="320" y="48" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">这门课的手写路线</text><rect x="40" y="72" width="120" height="56" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="100" y="96" font-size="16" text-anchor="middle" fill="#173d36">动态数组</text><text x="100" y="118" font-size="14" text-anchor="middle" fill="#4d6f67">连续格子</text><rect x="190" y="72" width="120" height="56" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="250" y="96" font-size="16" text-anchor="middle" fill="#173d36">链表</text><text x="250" y="118" font-size="14" text-anchor="middle" fill="#4d6f67">next 指针</text><rect x="340" y="72" width="120" height="56" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="400" y="96" font-size="16" text-anchor="middle" fill="#173d36">栈</text><text x="400" y="118" font-size="14" text-anchor="middle" fill="#4d6f67">后进先出</text><rect x="490" y="72" width="120" height="56" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="550" y="96" font-size="16" text-anchor="middle" fill="#173d36">队列</text><text x="550" y="118" font-size="14" text-anchor="middle" fill="#4d6f67">先进先出</text><path d="M162 100H188" stroke="#2a8c78" stroke-width="3"/><polygon points="188,100 178,94 178,106" fill="#2a8c78"/><path d="M312 100H338" stroke="#2a8c78" stroke-width="3"/><polygon points="338,100 328,94 328,106" fill="#2a8c78"/><path d="M462 100H488" stroke="#2a8c78" stroke-width="3"/><polygon points="488,100 478,94 478,106" fill="#2a8c78"/><path d="M550 130V184" stroke="#2a8c78" stroke-width="3"/><polygon points="550,184 544,174 556,174" fill="#2a8c78"/><rect x="490" y="186" width="120" height="56" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="550" y="210" font-size="16" text-anchor="middle" fill="#173d36">双端队列</text><text x="550" y="232" font-size="14" text-anchor="middle" fill="#4d6f67">两头进出</text><rect x="340" y="186" width="120" height="56" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="400" y="210" font-size="16" text-anchor="middle" fill="#173d36">单调队列</text><text x="400" y="232" font-size="14" text-anchor="middle" fill="#4d6f67">窗口最大值</text><rect x="190" y="186" width="120" height="56" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="250" y="210" font-size="16" text-anchor="middle" fill="#173d36">哈希表</text><text x="250" y="232" font-size="14" text-anchor="middle" fill="#4d6f67">键变下标</text><path d="M488 214H462" stroke="#2a8c78" stroke-width="3"/><polygon points="462,214 472,208 472,220" fill="#2a8c78"/><path d="M338 214H312" stroke="#2a8c78" stroke-width="3"/><polygon points="312,214 322,208 322,220" fill="#2a8c78"/><text x="320" y="274" font-size="14" text-anchor="middle" fill="#4d6f67">先写底层，再拿底层拼上层；树、堆、图后面单独几课。</text></svg>`, caption: `先有连续空间和节点两种底层，栈、队列、双端队列、哈希表才有地方搭。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `以为手写就是不能用 list。list 是最底层的连续空间，动态数组、栈、队列都要拿它当仓库。`,
          `一开始就追求和内置容器一样快。内置容器是 C 写的，Python 手写版慢几十倍很正常；这门课算步骤数，不跑分。`,
          `把几种容器当成孤立的知识点。它们互相嵌套：哈希桶是链表，单调队列是双端队列。`,
          `只抄代码不画图。指针一多，脑子里没有图，改一行错一行。`,
          `跳过复杂度直接写。不知道一次操作动多少元素，就会写出看着对、数据一大就卡死的代码。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `用一句话写出容器和普通变量的区别，再举一个你代码里常见的容器例子。`,
          `把这门课的七种容器按底层是连续空间还是节点分成两类，各写一行理由。`,
          `用 help(list) 或官方文档找出 list 的五个方法，标出哪些是这门课要手写的。`,
          `画一张你自己的课程地图，标出你觉得最难的一种，写一句为什么。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：容器就是「数据怎么放」加「操作怎么走」的一套约定，这门课把七种约定各写一遍。` }
      ]
    },
    {
      id: "p02",
      title: "第 2 课 · 复杂度：数一数代码跑了几步",
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：学会用「跑了几步」而不是「跑了几秒」比较两段代码，认得 O(1)、O(n)、O(log n)、O(n^2) 四种增长。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `同一段代码在不同机器上跑的时间不一样，用秒数比较没有意义。复杂度数的不是时间，是**基本操作的次数**随输入规模 n 怎么变。把 n 翻倍，看步数翻几倍，就能判断这段代码属于哪一类。` },
        { t: `p`, text: `O(1) 是步数不随 n 变：按下标取数组元素、往栈顶压一个。O(n) 是步数和 n 成正比：把列表求和、从头到尾遍历链表。O(log n) 是每轮把问题砍一半：二分查找、平衡树的高度。O(n^2) 是两层循环各跑 n 次：冒泡排序、两两比较。` },
        { t: `p`, text: `写复杂度时丢掉常数和低阶项：3n 加 5 记成 O(n)，n^2 加 n 记成 O(n^2)。不是它们不重要，而是 n 很大时决定增长趋势的是最高阶那一项。还要看最坏情况：哈希表平均 O(1)，但所有键撞进一个桶就退化成 O(n)。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `看到一段代码，能估出数据量翻十倍时大概慢多少。`,
          `选容器时知道哪种操作会成为瓶颈，例如频繁在头部插入就别用数组。`,
          `读别人的实现时，能对上它声明的复杂度，不被「很快」这种词糊弄。`,
          `面试里被问「这里为什么不用 list」，能答出代价而不是凭感觉。`
        ]},
        { t: `h2`, text: `演示 1 · 数步数` },
        { t: `p`, text: `下面两个函数，一个单层循环，一个双层循环。n 取 10、100、1000，观察第三列和第四列的差距怎么拉大；第二列 n 乘 2 只算一次，用来对照。` },
        { t: `code`, lang: `python`, code: `def linear(n):\n    steps = 0\n    for i in range(n): steps += 1\n    return steps\ndef quadratic(n):\n    steps = 0\n    for i in range(n):\n        for j in range(n): steps += 1\n    return steps\nfor n in (10, 100, 1000):\n    print(n, n * 2, linear(n), quadratic(n))` },
        { t: `p`, text: `n 从 10 到 1000 涨了 100 倍，单层循环的步数涨 100 倍，双层循环的步数涨了 10000 倍。这就是 O(n) 和 O(n^2) 的差别：不是慢一点，是增长曲线不同。` },
        { t: `h2`, text: `演示 2 · 用秒表验证趋势` },
        { t: `p`, text: `步数是理论账，秒表是实测。下面用 time.perf_counter 量同一段 O(n) 代码在三个规模下的耗时。你机器上的数字会不同，要看的是比例，不是绝对值。` },
        { t: `code`, lang: `python`, code: `from time import perf_counter\ndef work(n):\n    total = 0\n    for i in range(n):\n        total += i\n    return total\nfor n in (10000, 20000, 40000):\n    t0 = perf_counter()\n    work(n)\n    print(n, round(perf_counter() - t0, 4))` },
        { t: `p`, text: `如果 n 每次翻倍、耗时也大致翻倍，这段代码就是线性增长。计时受缓存和后台进程影响，单次测量会抖，每个规模多跑几次取平均更稳。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="16" y="16" width="608" height="248" rx="16" fill="#eef6f4"/><text x="320" y="44" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">四种增长曲线</text><path d="M70 230H590" stroke="#9db8b0" stroke-width="2"/><path d="M70 230V50" stroke="#9db8b0" stroke-width="2"/><text x="590" y="252" font-size="14" text-anchor="end" fill="#4d6f67">输入规模 n</text><text x="40" y="50" font-size="14" text-anchor="middle" fill="#4d6f67">步数</text><path d="M72 208H560" stroke="#2a8c78" stroke-width="3"/><text x="566" y="204" font-size="15" fill="#2a8c78">O(1)</text><path d="M72 222C210 190 390 160 560 138" stroke="#4a7bd0" stroke-width="3" fill="none"/><text x="566" y="134" font-size="15" fill="#4a7bd0">O(log n)</text><path d="M72 228L560 92" stroke="#c98a2b" stroke-width="3"/><text x="566" y="90" font-size="15" fill="#c98a2b">O(n)</text><path d="M72 228C150 226 210 200 250 60" stroke="#c0504d" stroke-width="3" fill="none"/><text x="266" y="70" font-size="15" fill="#c0504d">O(n^2)</text></svg>`, caption: `横轴是输入规模，纵轴是步数；O(n^2) 抬头最快，O(log n) 几乎贴着横轴。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把 O(1) 当成很快。O(1) 只是步数不随 n 变，单步本身可能很贵。`,
          `用一次计时结果下结论。计时会抖，至少跑三次看趋势。`,
          `把 O(2n) 保留下来。常数要丢掉，写成 O(n)。`,
          `忽略 n 很小时常数项占主导。n 小于几十时，O(n^2) 完全可能比 O(n) 快。`,
          `只看平均不看最坏。哈希冲突、链表退化都发生在最坏情况。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `写一个 O(n) 的函数求列表最大值，再写一个 O(n^2) 的两两比较版本，用 n 等于 1000 各跑一次，记下耗时比例。`,
          `判断三种操作的复杂度：list 尾部 append、list 头部 insert(0)、dict 按键取值。`,
          `用 perf_counter 测二分查找和线性查找在 n 等于 100000 时的差距，写出你观察到的比例。`,
          `把你上周写的一段代码里嵌套最深的循环找出来，标出它的复杂度。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：复杂度数的是步数随 n 的增长趋势，丢掉常数、看最坏情况，才能预判数据变大后会不会卡死。` }
      ]
    },
    {
      id: "p03",
      title: "第 3 课 · 动态数组（一）：一块连续的内存",
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用 Python 类写一个定长数组，能记长度、按下标读写、在尾部追加，并分清「长度」和「容量」。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `数组是一块连续的内存，被切成等宽的小格子，每个格子放一个元素。连续的好处是地址能算：第 i 个格子的位置等于起始地址加 i 乘格子宽度，所以按下标读写不用从头找，一步就到，代价 O(1)。` },
        { t: `p`, text: `连续也有代价：整块空间必须一次申请好，容量固定。容量是这块地能放多少格，长度是已经放了多少个。往尾部追加时，只要长度小于容量，就写进下标 length 的格子，再把长度加一；长度等于容量时，这块地满了，新元素装不下。` },
        { t: `p`, text: `Python 的 list 本身就是一块会自己扩容的连续空间，这门课拿它当「内存」用：初始化时申请固定长度，元素只写到 length 之前，length 之后的格子留空。这样能清楚看到「已用」和「未用」的分界，也能解释为什么按下标访问快、往中间插元素慢。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `按下标随机访问成绩、像素、矩阵元素这类定长数据。`,
          `给栈和队列当底层仓库，只在末尾进出。`,
          `理解为什么尾部追加便宜，而头部插入要搬整块数据。`,
          `给后面要写的链表提供对照：同样一组操作，两种布局各贵在哪。`
        ]},
        { t: `h2`, text: `演示 1 · 按下标读写` },
        { t: `p`, text: `下面这个类只有三个动作：初始化时申请 cap 个格子，set 改一格，get 读一格。length 先手动写成 2，表示前两格有效。` },
        { t: `code`, lang: `python`, code: `class Array:\n    def __init__(self, cap):\n        self.data = [None] * cap\n        self.length = 0\n    def get(self, i):\n        return self.data[i]\n    def set(self, i, v):\n        self.data[i] = v\na = Array(3)\na.set(0, "甲"); a.set(1, "乙"); a.length = 2\nprint(a.get(0), a.get(1), a.length)` },
        { t: `p`, text: `get 和 set 都没有循环，直接按下标取 data 里的值。这就是连续空间最大的好处：下标就是偏移量，访问一步到位。` },
        { t: `h2`, text: `演示 2 · 尾部追加与容量上限` },
        { t: `p`, text: `容量 3，依次追加甲乙丙丁四个元素。append 先看 length 有没有撞到容量，撞到就返回 False，不覆盖也不越界。` },
        { t: `code`, lang: `python`, code: `class Array:\n    def __init__(self, cap):\n        self.data = [None] * cap\n        self.length = 0\n    def append(self, v):\n        if self.length == len(self.data):\n            return False\n        self.data[self.length] = v\n        self.length += 1\na = Array(3)\nfor ch in "甲乙丙丁": a.append(ch)\nprint(a.length, len(a.data), a.data)` },
        { t: `p`, text: `输出里 length 停在 3，第四个「丁」被拒绝。真实实现遇到满容量会扩容，那是后面单独一课的事；这一课先把「长度不能超过容量」这条线守住。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260"><rect x="16" y="16" width="608" height="228" rx="16" fill="#eef6f4"/><text x="320" y="44" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">长度 3，容量 6</text><rect x="50" y="80" width="80" height="52" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="90" y="112" font-size="16" text-anchor="middle" fill="#173d36">甲</text><rect x="140" y="80" width="80" height="52" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="180" y="112" font-size="16" text-anchor="middle" fill="#173d36">乙</text><rect x="230" y="80" width="80" height="52" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="270" y="112" font-size="16" text-anchor="middle" fill="#173d36">丙</text><rect x="320" y="80" width="80" height="52" rx="8" fill="#ffffff" stroke="#9db8b0" stroke-width="2"/><text x="360" y="112" font-size="16" text-anchor="middle" fill="#9db8b0">空</text><rect x="410" y="80" width="80" height="52" rx="8" fill="#ffffff" stroke="#9db8b0" stroke-width="2"/><text x="450" y="112" font-size="16" text-anchor="middle" fill="#9db8b0">空</text><rect x="500" y="80" width="80" height="52" rx="8" fill="#ffffff" stroke="#9db8b0" stroke-width="2"/><text x="540" y="112" font-size="16" text-anchor="middle" fill="#9db8b0">空</text><text x="90" y="158" font-size="14" text-anchor="middle" fill="#4d6f67">0</text><text x="180" y="158" font-size="14" text-anchor="middle" fill="#4d6f67">1</text><text x="270" y="158" font-size="14" text-anchor="middle" fill="#4d6f67">2</text><text x="360" y="158" font-size="14" text-anchor="middle" fill="#4d6f67">3</text><text x="450" y="158" font-size="14" text-anchor="middle" fill="#4d6f67">4</text><text x="540" y="158" font-size="14" text-anchor="middle" fill="#4d6f67">5</text><path d="M315 66V172" stroke="#c0504d" stroke-width="3" stroke-dasharray="6 5"/><text x="315" y="194" font-size="15" text-anchor="middle" fill="#c0504d">length = 3</text><path d="M50 214H580" stroke="#4a7bd0" stroke-width="2"/><path d="M50 208V220" stroke="#4a7bd0" stroke-width="2"/><path d="M580 208V220" stroke="#4a7bd0" stroke-width="2"/><text x="315" y="238" font-size="15" text-anchor="middle" fill="#4a7bd0">capacity = 6</text></svg>`, caption: `前 3 格是有效数据，后 3 格只是预留；length 卡在有效区和空区之间。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把 len(data) 当成长度，遍历到容量尽头，读到一串 None。`,
          `追加前不检查 length 是否等于容量，直接写就越界。`,
          `按下标访问也写成循环，白白把 O(1) 做成 O(n)。`,
          `初始化时用同一个空列表乘容量，几行格子指向同一个列表，改一行全变。`,
          `下标从 1 开始数，第一格空着，最后一格越界。`,
          `append 之后忘了把 length 加一，下一次写覆盖同一格。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `给 Array 加一个 pop 方法：length 大于 0 时返回最后一格的值，把那一格改回 None，length 减一。`,
          `写一个 contains 方法，从头到尾比较，返回布尔值，并说明它的复杂度。`,
          `把容量设为 5，先追加 5 个元素，再追加第 6 个，打印每次的 length 和返回值。`,
          `画一张 6 格数组，标出下标、length、capacity，并指出哪几格是有效数据。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：数组用一块连续空间按下标直达，长度是已用格数，容量是总格数，两者不能混。` }
      ]
    },
    {
      id: "p04",
      title: "第 4 课 · 动态数组（二）：扩容时怎么搬家",
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：给动态数组加上扩容，弄清「容量翻倍、复制旧元素」这两步，算清一次扩容的代价和摊到每次追加的代价。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `容量满了怎么办？申请一块更大的连续空间，把旧元素逐个复制过去，再把新元素写进去，最后丢掉旧块。新空间通常是原来的两倍，因为每次只加一格的话，每追加一个都要搬家，总代价会变成 O(n^2)。` },
        { t: `p`, text: `一次扩容要复制 length 个元素，代价 O(n)；但扩容不是每次都发生。容量按 1、2、4、8 翻倍，n 次追加里大约只扩容 log n 次，总复制次数 1 加 2 加 4 一直加到 n，小于 2n。把总代价摊到 n 次追加上，每次平均 O(1)，这叫均摊 O(1)。` },
        { t: `p`, text: `均摊不是「每次都快」。某一次 append 正好撞上扩容，它就是要复制 n 个元素；只是这种时刻越来越少。写程序时要能区分单次最坏和摊还平均：前者决定会不会卡一下，后者决定总吞吐。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `p`, text: `知道为什么往列表尾部连续追加几百万个元素不会越来越慢；知道预估容量能省掉多次搬家；看到别人预留 capacity 时明白省的是复制；也能解释为什么在头部插入没有这种均摊好运。` },
        { t: `h2`, text: `演示 1 · 一次扩容的搬家` },
        { t: `p`, text: `这段不用类，只把一个长度为 2 的旧块扩成 4 格，再把旧元素复制过去。看清楚复制发生在哪一步。` },
        { t: `code`, lang: `python`, code: `old = ["甲", "乙"]\nnew = [None] * (len(old) * 2)\nfor i in range(len(old)):\n    new[i] = old[i]\nprint("新块", new)\nnew[2] = "丙"\nprint("追加后", new, len(new))` },
        { t: `p`, text: `新块后两格是 None，表示还没用。复制只碰前两个有效元素，旧块 old 还留在变量里，但新数组已经不再引用它。` },
        { t: `h2`, text: `演示 2 · 容量翻倍与复制次数` },
        { t: `p`, text: `下面这个类维护 data、length 和 copies。容量不够就翻倍，复制一个有效元素 copies 加一；每追加一个就打印当前容量和累计复制次数。` },
        { t: `code`, lang: `python`, code: `class Dyn:\n    def __init__(self):\n        self.data = [None]; self.n = 0; self.copies = 0\n    def append(self, v):\n        if self.n == len(self.data):\n            self.copies += self.n\n            self.data = self.data[:self.n] + [None] * len(self.data)\n        self.data[self.n] = v; self.n += 1\nd = Dyn()\nfor i in range(8):\n    d.append(i); print(i, len(d.data), d.copies)` },
        { t: `p`, text: `8 次追加只搬了 1 加 2 加 4 共 7 个元素，容量从 1 长到 8。继续加到 16 次，复制总数是 15，仍然小于 16；均摊到每次追加不到 1 次复制。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="16" y="16" width="608" height="268" rx="16" fill="#eef6f4"/><text x="320" y="44" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">扩容：申请两倍空间，再逐个复制</text><text x="60" y="68" font-size="15" fill="#4d6f67">旧块，容量 4，已满</text><rect x="60" y="76" width="80" height="44" rx="8" fill="#ffffff" stroke="#c0504d" stroke-width="2"/><text x="100" y="104" font-size="16" text-anchor="middle" fill="#173d36">甲</text><rect x="150" y="76" width="80" height="44" rx="8" fill="#ffffff" stroke="#c0504d" stroke-width="2"/><text x="190" y="104" font-size="16" text-anchor="middle" fill="#173d36">乙</text><rect x="240" y="76" width="80" height="44" rx="8" fill="#ffffff" stroke="#c0504d" stroke-width="2"/><text x="280" y="104" font-size="16" text-anchor="middle" fill="#173d36">丙</text><rect x="330" y="76" width="80" height="44" rx="8" fill="#ffffff" stroke="#c0504d" stroke-width="2"/><text x="370" y="104" font-size="16" text-anchor="middle" fill="#173d36">丁</text><path d="M100 122L74 196" stroke="#c98a2b" stroke-width="2"/><polygon points="74,196 82,186 70,188" fill="#c98a2b"/><path d="M190 122L146 196" stroke="#c98a2b" stroke-width="2"/><polygon points="146,196 154,186 142,188" fill="#c98a2b"/><path d="M280 122L218 196" stroke="#c98a2b" stroke-width="2"/><polygon points="218,196 226,186 214,188" fill="#c98a2b"/><path d="M370 122L290 196" stroke="#c98a2b" stroke-width="2"/><polygon points="290,196 298,186 286,188" fill="#c98a2b"/><text x="595" y="194" font-size="15" text-anchor="end" fill="#4d6f67">新块，容量 8</text><rect x="40" y="204" width="60" height="42" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="70" y="231" font-size="15" text-anchor="middle" fill="#173d36">甲</text><rect x="110" y="204" width="60" height="42" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="140" y="231" font-size="15" text-anchor="middle" fill="#173d36">乙</text><rect x="180" y="204" width="60" height="42" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="210" y="231" font-size="15" text-anchor="middle" fill="#173d36">丙</text><rect x="250" y="204" width="60" height="42" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="280" y="231" font-size="15" text-anchor="middle" fill="#173d36">丁</text><rect x="320" y="204" width="60" height="42" rx="8" fill="#ffffff" stroke="#9db8b0" stroke-width="2"/><text x="350" y="231" font-size="15" text-anchor="middle" fill="#9db8b0">空</text><rect x="390" y="204" width="60" height="42" rx="8" fill="#ffffff" stroke="#9db8b0" stroke-width="2"/><text x="420" y="231" font-size="15" text-anchor="middle" fill="#9db8b0">空</text><rect x="460" y="204" width="60" height="42" rx="8" fill="#ffffff" stroke="#9db8b0" stroke-width="2"/><text x="490" y="231" font-size="15" text-anchor="middle" fill="#9db8b0">空</text><rect x="530" y="204" width="60" height="42" rx="8" fill="#ffffff" stroke="#9db8b0" stroke-width="2"/><text x="560" y="231" font-size="15" text-anchor="middle" fill="#9db8b0">空</text><text x="320" y="272" font-size="14" text-anchor="middle" fill="#4d6f67">复制 4 个有效元素，容量从 4 变成 8；旧块之后不再使用。</text></svg>`, caption: `扩容分三步：申请新块、复制有效元素、把新元素接在后面。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `每次扩容只加一格，n 次追加的总代价变成 O(n^2)。`,
          `扩容后忘记把 length 之前的数据复制过去，旧元素全丢。`,
          `扩容后还拿着旧块的引用，以为写新块会同步到旧变量。`,
          `把均摊 O(1) 说成每次 O(1)，遇到扩容那一次仍然是 O(n)。`,
          `容量一次翻四倍看似更快，但会浪费更多空槽；翻倍是空间和复制次数的折中。`,
          `每次用 data 加一个单元素列表来追加，等于每次都在新建列表、搬家。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `给课上的 Dyn 加一个 pop 方法，从尾部删一个元素并返回它，长度减一，容量不变。`,
          `把翻倍改成翻三倍，跑 20 次追加，记录复制总次数，和翻倍版本比较。`,
          `用 perf_counter 比较每次追加都新建列表和容量翻倍两种写法在 n 等于 20000 时的耗时。`,
          `画一张 1 到 2 到 4 到 8 的扩容图，标出每次复制了几个元素。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：满了就申请两倍大的新块、把旧元素搬过去，单次扩容 O(n)，摊到每次追加是 O(1)。` }
      ]
    },
    {
      id: "p05",
      title: "第 5 课 · 链表（一）：节点串成一条链",
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用 Node 和 next 把元素串成链表，能从头遍历到尾、在尾部追加，并说清它和数组各自贵在哪。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `链表不要求连续空间。每个元素住在一个节点里，节点装两样东西：值，和指向下一个节点的引用。知道第一个节点 head，就能顺着 next 一路走到底；最后一个节点的 next 是 None，表示到头了。` },
        { t: `p`, text: `第 3 课的数组靠算地址一步跳到第 i 个，链表没有地址可算，只能从头走 i 步，所以按下标访问是 O(n)。但链表插入和删除只改几个引用，不用搬整块数据；代价是每个节点多存一个 next 引用，空间不紧凑，访问也不如数组快。` },
        { t: `p`, text: `尾部追加要先找到最后一个节点。只记 head 的话，每次追加都要从头走到尾，代价 O(n)；多记一个 tail 指针，追加就变成改 tail.next 和更新 tail，两步 O(1)。这是用一点额外状态换时间的典型。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `存频繁在中间插入删除、长度变化大的数据，例如撤销记录、播放列表。`,
          `给栈和队列当底层，push 和 pop 只动头部。`,
          `理解引用怎么把散落的节点串起来，而不是靠下标找位置。`,
          `为后面的快慢指针、反转、环检测打底。`
        ]},
        { t: `h2`, text: `演示 1 · 手工串三个节点` },
        { t: `p`, text: `先不用类包装链表，只建三个节点，手动把 next 接起来，再从头走一遍。注意最后一步 cur = cur.next 是沿着引用跳，不是下标加一。` },
        { t: `code`, lang: `python`, code: `class Node:\n    def __init__(self, value):\n        self.value = value\n        self.next = None\na = Node("甲"); b = Node("乙"); c = Node("丙")\na.next = b; b.next = c\ncur = a\nwhile cur is not None:\n    print(cur.value)\n    cur = cur.next` },
        { t: `h2`, text: `演示 2 · head 和 tail` },
        { t: `p`, text: `下面把 Node 和链表类放在一起。append 分两种情况：空链表让新节点同时当 head 和 tail；非空链表挂到 tail.next 后面，再更新 tail。最后打印头、尾和长度。` },
        { t: `code`, lang: `python`, code: `class Node:\n    def __init__(self, v): self.v = v; self.next = None\nclass List:\n    def __init__(self): self.head = None; self.tail = None; self.size = 0\n    def append(self, v):\n        node = Node(v)\n        if self.head is None: self.head = node\n        else: self.tail.next = node\n        self.tail = node; self.size += 1\nlst = List()\nfor ch in "甲乙丙": lst.append(ch)\nprint(lst.head.v, lst.tail.v, lst.size)` },
        { t: `p`, text: `空链表那一步最容易漏：如果只写 tail.next = node，第一次追加时 tail 还是 None，会直接报 AttributeError。先判空，再分两路。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="16" y="16" width="608" height="268" rx="16" fill="#eef6f4"/><text x="320" y="42" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">数组靠下标，链表靠 next</text><text x="50" y="72" font-size="15" fill="#4d6f67">数组：下标 2，算地址一步到</text><rect x="60" y="82" width="90" height="46" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="105" y="111" font-size="16" text-anchor="middle" fill="#173d36">甲</text><rect x="158" y="82" width="90" height="46" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="203" y="111" font-size="16" text-anchor="middle" fill="#173d36">乙</text><rect x="256" y="82" width="90" height="46" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="301" y="111" font-size="16" text-anchor="middle" fill="#173d36">丙</text><rect x="354" y="82" width="90" height="46" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="399" y="111" font-size="16" text-anchor="middle" fill="#173d36">丁</text><text x="105" y="148" font-size="14" text-anchor="middle" fill="#4d6f67">0</text><text x="203" y="148" font-size="14" text-anchor="middle" fill="#4d6f67">1</text><text x="301" y="148" font-size="14" text-anchor="middle" fill="#4d6f67">2</text><text x="399" y="148" font-size="14" text-anchor="middle" fill="#4d6f67">3</text><path d="M500 105H354" stroke="#c0504d" stroke-width="3"/><polygon points="354,105 364,99 364,111" fill="#c0504d"/><text x="510" y="110" font-size="15" fill="#c0504d">下标直达</text><text x="50" y="190" font-size="15" fill="#4d6f67">链表：每个节点带一个 next</text><rect x="60" y="202" width="86" height="48" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="103" y="231" font-size="16" text-anchor="middle" fill="#173d36">甲</text><rect x="206" y="202" width="86" height="48" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="249" y="231" font-size="16" text-anchor="middle" fill="#173d36">乙</text><rect x="352" y="202" width="86" height="48" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="395" y="231" font-size="16" text-anchor="middle" fill="#173d36">丙</text><rect x="498" y="202" width="86" height="48" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="541" y="231" font-size="16" text-anchor="middle" fill="#173d36">丁</text><path d="M148 226H202" stroke="#2a8c78" stroke-width="3"/><polygon points="202,226 192,220 192,232" fill="#2a8c78"/><path d="M294 226H348" stroke="#2a8c78" stroke-width="3"/><polygon points="348,226 338,220 338,232" fill="#2a8c78"/><path d="M440 226H494" stroke="#2a8c78" stroke-width="3"/><polygon points="494,226 484,220 484,232" fill="#2a8c78"/><path d="M586 226H612" stroke="#9db8b0" stroke-width="2" stroke-dasharray="5 4"/><text x="618" y="231" font-size="14" text-anchor="end" fill="#9db8b0">None</text><text x="60" y="168" font-size="14" fill="#c0504d">head</text><text x="584" y="196" font-size="14" text-anchor="middle" fill="#c0504d">tail</text><text x="320" y="276" font-size="14" text-anchor="middle" fill="#4d6f67">数组按下标一步到；链表要从 head 沿 next 走，但改指针就能插入。</text></svg>`, caption: `同样是四个元素，数组的格子挨着，链表的节点靠 next 箭头连起来。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `遍历时写 while cur.next，最后一个节点不会被处理；应该写 while cur is not None。`,
          `空链表直接取 head.value，报 AttributeError；先判 head is None。`,
          `追加时只改 tail.next 不更新 tail，下一次还挂在旧尾巴上。`,
          `以为链表按下标访问和数组一样快；链表要从头走。`,
          `把节点当值。比较两个节点用 is，比值用 node.value。`,
          `忘记最后一个节点的 next 要保持 None，遍历会跑飞或提前断。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `给链表类加一个 to_list 方法，把值按顺序收进 Python 列表返回。`,
          `写一个 length 方法，从头数节点，不许用 self.size，和 size 对一遍。`,
          `把 append 改成不维护 tail 的版本，统计追加 1000 个元素时一共走了多少步。`,
          `画三个节点，标出 head、tail、每个 next 指向谁。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：链表用节点里的 next 串数据，按下标走是 O(n)，记住 tail 能让尾部追加变成 O(1)。` }
      ]
    },
    {
      id: "p06",
      title: "第 6 课 · 链表（二）：插入，删除，反转",
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：在链表上按下标插入、删除节点，再把整条链反转，重点是改指针的顺序不能反。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `插入分两步：先让新节点的 next 指向原来的下一个，再让前一个节点的 next 指向新节点。顺序反了会怎样？如果先改前一个节点的 next，它原来指向的后半条链就丢了，新节点接上去，后面的节点全断。所以口诀是先接后，再断前。` },
        { t: `p`, text: `删除更简单：让前一个节点直接跳过要删的节点，prev.next = prev.next.next。被跳过的节点没有引用指向它，Python 的引用计数会回收它。删除头节点是特殊情况，要直接改 head。` },
        { t: `p`, text: `反转要把每个节点的 next 从指向后改成指向前。用三个变量：prev 是已经反转好的前一段，cur 是当前节点，nxt 先存住 cur.next，免得改完指针找不到后面。每轮做四步：存 nxt、翻 cur.next、prev 前移、cur 前移。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `在播放列表中间插一首歌、删一条聊天记录。`,
          `实现撤销栈时从头部压入和弹出。`,
          `反转链表是面试里高频的手写题，步骤少但顺序容易错。`,
          `理解先保存再修改这个套路，后面树的遍历、图的搜索都用得上。`
        ]},
        { t: `h2`, text: `演示 1 · 插入与删除` },
        { t: `p`, text: `下面在甲和乙之间插入「新」，再把它删掉。insert_after 里两行的顺序就是关键：先 node.next = prev.next，再 prev.next = node。` },
        { t: `code`, lang: `python`, code: `class Node:\n    def __init__(self, v): self.v = v; self.next = None\ndef insert_after(prev, v):\n    node = Node(v); node.next = prev.next; prev.next = node\ndef remove_after(prev):\n    prev.next = prev.next.next\na = Node("甲"); b = Node("乙"); c = Node("丙")\na.next = b; b.next = c\ninsert_after(a, "新")\nprint(a.next.v, a.next.next.v)\nremove_after(a)\nprint(a.next.v)` },
        { t: `p`, text: `输出先显示「新 乙」，说明新节点接在甲后面、乙还在；删除后又显示「乙」，说明甲直接跳过了新节点。按下标插入，只要先从头走 i-1 步找到 prev，剩下的两步完全一样。` },
        { t: `h2`, text: `演示 2 · 整条反转` },
        { t: `p`, text: `三个节点甲乙丙，反转后从头读是丙乙甲。盯着 while 里的四行：nxt 先保存，cur.next 翻向 prev，然后 prev 和 cur 各前进一步。` },
        { t: `code`, lang: `python`, code: `class Node:\n    def __init__(self, v): self.v = v; self.next = None\na = Node("甲"); b = Node("乙"); c = Node("丙")\na.next = b; b.next = c\nprev = None; cur = a\nwhile cur:\n    nxt = cur.next\n    cur.next = prev\n    prev = cur\n    cur = nxt\nprint(prev.v, prev.next.v, prev.next.next.v)` },
        { t: `p`, text: `循环结束时 cur 是 None，prev 停在原来的最后一个节点，也就是新的头。函数写法最后要返回 prev，而不是原来的 head。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260"><rect x="16" y="16" width="608" height="228" rx="16" fill="#eef6f4"/><text x="320" y="42" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">反转一轮：先存 nxt，再翻指针</text><rect x="120" y="110" width="86" height="50" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="163" y="141" font-size="16" text-anchor="middle" fill="#173d36">甲</text><rect x="280" y="110" width="86" height="50" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="323" y="141" font-size="16" text-anchor="middle" fill="#173d36">乙</text><rect x="440" y="110" width="86" height="50" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="483" y="141" font-size="16" text-anchor="middle" fill="#173d36">丙</text><path d="M208 135H276" stroke="#2a8c78" stroke-width="3"/><polygon points="276,135 266,129 266,141" fill="#2a8c78"/><path d="M368 135H436" stroke="#9db8b0" stroke-width="3"/><polygon points="436,135 426,129 426,141" fill="#9db8b0"/><path d="M280 152C240 180 206 168 208 142" stroke="#c0504d" stroke-width="3" fill="none"/><polygon points="208,142 218,148 216,136" fill="#c0504d"/><text x="244" y="194" font-size="14" fill="#c0504d">改指向 prev</text><text x="163" y="100" font-size="15" text-anchor="middle" fill="#4a7bd0">prev</text><text x="323" y="100" font-size="15" text-anchor="middle" fill="#4a7bd0">cur</text><text x="483" y="100" font-size="15" text-anchor="middle" fill="#4a7bd0">nxt</text><text x="323" y="226" font-size="14" text-anchor="middle" fill="#4d6f67">乙的 next 从丙改成甲，然后 prev 移到乙，cur 移到丙。</text></svg>`, caption: `反转只改 next 的方向；nxt 是临时保存的后继，不然改完就找不到丙。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `插入时先改 prev.next，再找原来的下一个，后半条链已经丢了。`,
          `删除后忘了处理被删节点的 next，或者还拿着它的引用继续遍历。`,
          `删除头节点还去找 prev，头节点没有前一个，要单独改 head。`,
          `反转时忘了先存 nxt，cur.next 一改就找不到后续节点。`,
          `反转结束后返回了原来的 head，应该返回 prev，也就是新的头。`,
          `下标从 1 开始数，走到 i-1 时多走或少走一步。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `写一个 insert_at(head, i, value) 函数，在下标 i 处插入，i 等于 0 时改 head，i 超长时抛 IndexError。`,
          `写一个 remove_at(head, i) 函数，删除下标 i 的节点并返回新的 head。`,
          `把反转演示改成返回新头的函数 reverse(head)，再用遍历打印整条链验证。`,
          `画出三个节点反转第一轮前后 prev、cur、nxt 各指哪里。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：插入先接后断前，删除让前一个跳过当前，反转要先存 next 再翻指针。` }
      ]
    },
    {
      id: "p07",
      title: "第 7 课 · 链表（三）：快慢指针与环",
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用一快一慢两个指针找链表中点、判断有没有环、找到环的入口，理解 Floyd 判圈为什么两次相遇。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `快慢指针是两个速度不同的游标：slow 每次走一步，fast 每次走两步。fast 走到头时，slow 正好在中间。节点数是奇数时 slow 落在正中间，偶数时落在后半段的第一个；具体停在哪取决于循环条件，写的时候要固定一种约定。` },
        { t: `p`, text: `如果链表有环，fast 不会走到 None，而是一直在环里转。slow 进环后，fast 每轮追上一步，两者距离每轮缩小一，所以一定会在环内某处相遇。相遇就说明有环；如果 fast 先碰到 None，说明无环。` },
        { t: `p`, text: `找入口要用一点算术：设头到入口长 a，入口到相遇点长 b，环长 L。相遇时 slow 走了 a 加 b，fast 走了 a 加 b 再加 kL，k 是 fast 多转的圈数，而 fast 是 slow 的两倍，所以 a 加 b 等于 kL，也就是 a 等于 (k-1)L 加 (L-b)。把一个指针放回头，两个都每次走一步，走 a 步后正好在入口相遇。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `判断链表是否有环、找环入口，排查引用成环导致的内存泄漏。`,
          `一次遍历找中点，把链表对半分做归并排序。`,
          `找倒数第 k 个节点：快指针先走 k 步，再和慢指针同步走。`,
          `判断两个链表是否相交，先对齐长度再同速走。`
        ]},
        { t: `h2`, text: `演示 1 · 找中点` },
        { t: `p`, text: `五个节点，slow 一步、fast 两步。循环条件是 fast 和 fast.next 都不为空，少判一个就会在偶数长度时对 None 取 next。` },
        { t: `code`, lang: `python`, code: `class Node:\n    def __init__(self, v): self.v = v; self.next = None\na = Node(1); b = Node(2); c = Node(3); d = Node(4); e = Node(5)\na.next = b; b.next = c; c.next = d; d.next = e\nslow = fast = a\nwhile fast and fast.next:\n    slow = slow.next\n    fast = fast.next.next\nprint(slow.v)` },
        { t: `p`, text: `输出 3。把节点改成四个再跑一次，slow 会停在第 3 个，不是第 2 个；这就是偶数长度停在后半段第一个的约定。` },
        { t: `h2`, text: `演示 2 · 判环与找入口` },
        { t: `p`, text: `四个节点，最后一个指回第二个，形成入口在 2 的环。第一段循环让两个指针相遇，第二段把一个指针放回头，再同速走，相遇处就是入口。` },
        { t: `code`, lang: `python`, code: `class Node:\n    def __init__(self, v): self.v = v; self.next = None\na = Node(1); b = Node(2); c = Node(3); d = Node(4)\na.next = b; b.next = c; c.next = d; d.next = b; slow = fast = a\nwhile fast and fast.next:\n    slow = slow.next; fast = fast.next.next\n    if slow is fast:\n        slow = a\n        while slow is not fast:\n            slow = slow.next; fast = fast.next\n        print("入口", slow.v)\n        break` },
        { t: `p`, text: `输出「入口 2」。如果最后一个节点的 next 是 None，循环条件会让它正常结束；无环时不会打印入口，可以在循环后面补一个无环分支。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="16" y="16" width="608" height="268" rx="16" fill="#eef6f4"/><text x="320" y="34" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">快慢指针在环里一定相遇</text><circle cx="100" cy="92" r="30" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="100" y="99" font-size="17" text-anchor="middle" fill="#173d36">1</text><circle cx="230" cy="92" r="30" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="230" y="99" font-size="17" text-anchor="middle" fill="#173d36">2</text><circle cx="360" cy="92" r="30" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="360" y="99" font-size="17" text-anchor="middle" fill="#173d36">3</text><circle cx="490" cy="92" r="30" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="490" y="99" font-size="17" text-anchor="middle" fill="#173d36">4</text><path d="M132 92H198" stroke="#2a8c78" stroke-width="3"/><polygon points="198,92 188,86 188,98" fill="#2a8c78"/><path d="M262 92H328" stroke="#2a8c78" stroke-width="3"/><polygon points="328,92 318,86 318,98" fill="#2a8c78"/><path d="M392 92H458" stroke="#2a8c78" stroke-width="3"/><polygon points="458,92 448,86 448,98" fill="#2a8c78"/><path d="M490 124V206H230V126" stroke="#4a7bd0" stroke-width="3" fill="none"/><polygon points="230,126 224,136 236,136" fill="#4a7bd0"/><text x="360" y="228" font-size="15" text-anchor="middle" fill="#4a7bd0">环长 L</text><text x="100" y="146" font-size="14" text-anchor="middle" fill="#4d6f67">head</text><text x="230" y="52" font-size="15" text-anchor="middle" fill="#c0504d">入口</text><text x="490" y="52" font-size="15" text-anchor="middle" fill="#c0504d">相遇点</text><text x="165" y="72" font-size="15" text-anchor="middle" fill="#c98a2b">a</text><text x="425" y="72" font-size="15" text-anchor="middle" fill="#c98a2b">b</text><text x="320" y="264" font-size="14" text-anchor="middle" fill="#4d6f67">相遇后一个指针回 head，同速走 a 步，两人在入口再见。</text></svg>`, caption: `头到入口是 a，入口到相遇点是 b，环长 L；a 加 b 正好是 L 的整数倍。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `循环条件只写 fast，fast 走到最后一个节点时 fast.next 是 None，再取 next 报错。`,
          `fast 每次走两步，但链表长度是偶数时停在 None，slow 的位置和你想的中间差一个。`,
          `找到相遇点就以为找到了入口；相遇点在环内，不一定是入口。`,
          `第二段同速走时又让 fast 走两步，永远追不上。`,
          `把节点值相等当成相遇；要用 is 比较节点身份。`,
          `空链表和单节点链表没处理，slow 和 fast 的初值就出错。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `用快慢指针找倒数第 2 个节点，写出代码并验证。`,
          `把中点演示改成四个节点，打印 slow 的值，再改成六个节点，观察停在哪。`,
          `给判环演示加一个无环版本，确认第一段循环能正常结束并输出无环。`,
          `用纸笔推导 a 加 b 等于 kL 这一步，写出为什么从相遇点再走 L-b 步能到入口。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：快慢指针靠速度差找中点，靠环内追及判环，再靠 a 等于 kL 减 b 从相遇点找回入口。` }
      ]
    },
    {
      id: "p08",
      title: "第 8 课 · 栈：后进先出的盘子",
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：写一个后进先出的栈，支持 push、pop、peek，用数组和链表各实现一次，并用它判断括号是否配对。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `栈只在一头进出，这一头叫栈顶。push 把元素压到栈顶，pop 把栈顶取走，peek 只看不取。最后压进去的最先出来，这叫后进先出。栈的规则少，所以实现只要抓住栈顶在哪。` },
        { t: `p`, text: `数组实现把列表末尾当栈顶：append 和 pop 都在末尾，不用搬元素，单次 O(1)。链表实现把 head 当栈顶：push 新建节点指向原 head，再改 head；pop 把 head 后移一格，也是 O(1)。两种实现都行，数组版空间更紧凑，链表版不用预先估容量。` },
        { t: `p`, text: `括号配对是栈的经典用法：遇到左括号就压栈，遇到右括号就弹出栈顶看是否配对。配对失败、弹空、或者扫完后栈里还有左括号，都算不合法。为什么用栈？因为最近一个没配对的左括号，必须最先被右括号消掉，这正是后进先出。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `括号、标签、表达式的配对检查。`,
          `函数调用栈、撤销操作、浏览器后退。`,
          `深度优先搜索用栈保存待访问节点。`,
          `把递归改成循环时，用栈手动保存现场。`
        ]},
        { t: `h2`, text: `演示 1 · 数组栈与括号配对` },
        { t: `p`, text: `数组版只用列表末尾：append 是 push，pop 是出栈。这段代码的循环扫一遍字符串，左括号入栈，右括号和栈顶比对，最后还要看栈是不是空的。` },
        { t: `code`, lang: `python`, code: `pairs = {")": "(", "]": "[", "}": "{"}\nfor text in ("{[()]}", "([)]"):\n    stack = []\n    bad = False\n    for ch in text:\n        if ch in "([{":\n            stack.append(ch)\n        elif not stack or stack.pop() != pairs[ch]:\n            bad = True\n    print(text, not bad and not stack)` },
        { t: `p`, text: `输出第一行 True，第二行 False。([)] 的左右括号数量一样多，但右括号来的时候栈顶不是它要配的左括号，所以照样失败。` },
        { t: `h2`, text: `演示 2 · 链表栈` },
        { t: `p`, text: `链表栈把 head 当栈顶。push 让新节点指向原栈顶，再把 top 移到新节点；pop 先取值，再把 top 后移。最后一行弹出两个之后，top 变成 None。` },
        { t: `code`, lang: `python`, code: `class Node:\n    def __init__(self, v): self.v = v; self.next = None\nclass Stack:\n    def __init__(self): self.top = None\n    def push(self, v): node = Node(v); node.next = self.top; self.top = node\n    def pop(self):\n        v = self.top.v; self.top = self.top.next; return v\n    def peek(self): return self.top.v\ns = Stack()\nfor ch in "甲乙丙": s.push(ch)\nprint(s.peek(), s.pop(), s.peek())\nprint(s.pop(), s.pop(), s.top)` },
        { t: `p`, text: `空栈时 top 是 None，peek 和 pop 都要先判空，否则报 AttributeError。链表栈不用预估容量，代价是每个节点多一个 next 引用。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="16" y="16" width="608" height="248" rx="16" fill="#eef6f4"/><text x="320" y="36" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">栈只在一头进出</text><path d="M120 154H490" stroke="#9db8b0" stroke-width="3"/><path d="M120 100V154" stroke="#9db8b0" stroke-width="3"/><path d="M490 100V154" stroke="#9db8b0" stroke-width="3"/><rect x="120" y="100" width="66" height="54" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="153" y="134" font-size="16" text-anchor="middle" fill="#173d36">甲</text><rect x="196" y="100" width="66" height="54" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="229" y="134" font-size="16" text-anchor="middle" fill="#173d36">乙</text><rect x="272" y="100" width="66" height="54" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="305" y="134" font-size="16" text-anchor="middle" fill="#173d36">丙</text><rect x="348" y="100" width="66" height="54" fill="#ffffff" stroke="#9db8b0" stroke-width="2"/><rect x="424" y="100" width="66" height="54" fill="#ffffff" stroke="#9db8b0" stroke-width="2"/><path d="M305 100V70" stroke="#c0504d" stroke-width="3"/><polygon points="305,70 299,80 311,80" fill="#c0504d"/><text x="305" y="58" font-size="15" text-anchor="middle" fill="#c0504d">pop 丙</text><path d="M381 64V96" stroke="#c98a2b" stroke-width="3"/><polygon points="381,96 375,86 387,86" fill="#c98a2b"/><text x="381" y="58" font-size="15" text-anchor="middle" fill="#c98a2b">push 丁</text><path d="M305 210V158" stroke="#4a7bd0" stroke-width="3"/><polygon points="305,158 299,168 311,168" fill="#4a7bd0"/><text x="305" y="230" font-size="15" text-anchor="middle" fill="#4a7bd0">top</text><text x="320" y="258" font-size="14" text-anchor="middle" fill="#4d6f67">push 压到栈顶，pop 从栈顶取，最后进来的丙最先走。</text></svg>`, caption: `栈顶是唯一开口；数组版用它当末尾，链表版用它当 head。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把栈底当栈顶，pop 时从头上取，变成了队列。`,
          `空栈直接 pop 或 peek，列表版报 IndexError，链表版报 AttributeError。`,
          `括号配对只数左右数量，不看顺序；([)] 数量相等但不合法。`,
          `扫完字符串忘了检查栈是否为空，剩下左括号也算失败。`,
          `链表栈 push 时先改 top 再连旧栈顶，旧栈顶丢了。`,
          `用 insert(0) 做栈顶，每次 O(n)。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `写一个 is_empty 判断，再给数组版加一个 peek 函数，用同一组 push 和 pop 验证。`,
          `给括号配对加上出错位置：不合法时打印第一个出错的字符下标。`,
          `用链表栈实现撤销：输入一串操作，遇到 undo 就弹一次，最后打印剩下的操作。`,
          `画一张 3 个元素的栈，标出 push 和 pop 各改哪个位置。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：栈只在栈顶进出，数组用末尾、链表用 head，括号配对靠它让最近的先消。` }
      ]
    },
    {
      id: "p09",
      title: "第 9 课 · 队列：先进先出的队伍",
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：写一个先进先出的队列，弄清为什么 list.pop(0) 是 O(n)，并用循环数组把队头出队变成 O(1)。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `队列从一头进、另一头出：enqueue 加到队尾，dequeue 从队头取。先来的先走，这叫先进先出。和栈的区别只在出口：栈从入口出，队列从另一头出。` },
        { t: `p`, text: `用 Python 列表直接 dequeue，最直观的写法是 pop(0)，但 pop(0) 删掉第一个元素后，后面所有元素都要往前挪一格，代价 O(n)。数据一多，每次出队都在搬整个队列，队列越长越慢。` },
        { t: `p`, text: `循环数组把队头记成一个下标，而不是靠搬元素。申请 cap 个格子，head 指向队头，size 记元素个数，队尾位置就是 (head + size) % cap。出队只把 head 往后移一格，到尾了就回到 0；入队写到队尾位置。两个下标绕圈走，格子重复使用，单次 O(1)。代价是容量固定，满了要拒绝或扩容。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `任务排队、打印任务、消息缓冲。`,
          `广度优先搜索用队列保存待访问节点。`,
          `生产者消费者模型里的缓冲区。`,
          `任何先来先处理的调度场景。`
        ]},
        { t: `h2`, text: `演示 1 · pop(0) 到底搬了什么` },
        { t: `p`, text: `下面手动模拟一次头部删除：把后一个元素往前覆盖，再删掉末尾。moves 数出一共搬了几次。四个元素搬三次，n 个元素搬 n-1 次。` },
        { t: `code`, lang: `python`, code: `items = list("甲乙丙丁")\nmoves = 0\nfirst = items[0]\nfor i in range(len(items) - 1):\n    items[i] = items[i + 1]\n    moves += 1\nitems.pop()\nprint(first, items, moves)` },
        { t: `p`, text: `输出里 first 是甲，剩下的三个元素整体左移，moves 等于 3。这就是 pop(0) 藏在背后的事：取走一个，搬走后面所有。` },
        { t: `h2`, text: `演示 2 · 循环数组队列` },
        { t: `p`, text: `head 和 size 是全部状态。入队算 (head + size) % cap，出队取 data 里 head 那一格，再让 head 绕圈，size 增减。注意 cap 为 3 时，入队四次会用到下标 0，这就是绕回。` },
        { t: `code`, lang: `python`, code: `class Queue:\n    def __init__(self, cap): self.data = [None] * cap; self.head = 0; self.size = 0\n    def enqueue(self, v):\n        i = (self.head + self.size) % len(self.data)\n        self.data[i] = v; self.size += 1\n    def dequeue(self):\n        v = self.data[self.head]; self.head = (self.head + 1) % len(self.data)\n        self.size -= 1; return v\nq = Queue(3); q.enqueue("甲"); q.enqueue("乙")\nprint(q.dequeue())\nq.enqueue("丙"); q.enqueue("丁")\nprint(q.dequeue(), q.dequeue(), q.size)` },
        { t: `p`, text: `入队丁时，(1 加 2) 对 3 取模等于 0，写回了下标 0；此时队列里是乙、丙、丁，队头在 1，队尾绕回 0。出队乙和丙后 size 剩 1，队头在 0，正好是丁。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="16" y="16" width="608" height="268" rx="16" fill="#eef6f4"/><text x="320" y="40" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">循环数组：下标到尾就回 0</text><rect x="50" y="78" width="76" height="54" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="88" y="112" font-size="16" text-anchor="middle" fill="#173d36">丙</text><rect x="140" y="78" width="76" height="54" rx="8" fill="#ffffff" stroke="#9db8b0" stroke-width="2"/><text x="178" y="112" font-size="15" text-anchor="middle" fill="#9db8b0">空</text><rect x="230" y="78" width="76" height="54" rx="8" fill="#ffffff" stroke="#9db8b0" stroke-width="2"/><text x="268" y="112" font-size="15" text-anchor="middle" fill="#9db8b0">空</text><rect x="320" y="78" width="76" height="54" rx="8" fill="#ffffff" stroke="#9db8b0" stroke-width="2"/><text x="358" y="112" font-size="15" text-anchor="middle" fill="#9db8b0">空</text><rect x="410" y="78" width="76" height="54" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="448" y="112" font-size="16" text-anchor="middle" fill="#173d36">甲</text><rect x="500" y="78" width="76" height="54" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="538" y="112" font-size="16" text-anchor="middle" fill="#173d36">乙</text><text x="88" y="160" font-size="14" text-anchor="middle" fill="#4d6f67">0</text><text x="178" y="160" font-size="14" text-anchor="middle" fill="#4d6f67">1</text><text x="268" y="160" font-size="14" text-anchor="middle" fill="#4d6f67">2</text><text x="358" y="160" font-size="14" text-anchor="middle" fill="#4d6f67">3</text><text x="448" y="160" font-size="14" text-anchor="middle" fill="#4d6f67">4</text><text x="538" y="160" font-size="14" text-anchor="middle" fill="#4d6f67">5</text><path d="M538 180V236H88V170" stroke="#4a7bd0" stroke-width="3" fill="none"/><polygon points="88,170 82,180 94,180" fill="#4a7bd0"/><text x="320" y="252" font-size="15" text-anchor="middle" fill="#4a7bd0">越过 5 之后回到 0</text><path d="M448 176V196" stroke="#c0504d" stroke-width="3"/><polygon points="448,196 442,186 454,186" fill="#c0504d"/><text x="448" y="216" font-size="15" text-anchor="middle" fill="#c0504d">head</text><text x="178" y="196" font-size="15" text-anchor="middle" fill="#c98a2b">tail 下次写这里</text><text x="320" y="274" font-size="14" text-anchor="middle" fill="#4d6f67">逻辑顺序是甲、乙、丙；物理位置绕了一圈，head 加 size 取模还原。</text></svg>`, caption: `队头在 4、队尾在下标 1，中间绕过了数组末尾；出队只移动 head。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `用 list.pop(0) 出队，队列一长就慢。`,
          `循环数组只移 head 不更新 size，队满判断错。`,
          `取模用错方向，队尾算成 head - size。`,
          `忘了容量固定，size 等于 cap 还继续写，覆盖队头。`,
          `空队列 dequeue 不判空，取到 None 或越界。`,
          `以为 head 一定小于 tail；绕圈后 head 可以大于 tail。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `给循环队列加 is_empty 和 is_full，并写一段代码把容量 3 的队列填满再出队一次。`,
          `把容量改成可扩容：满了申请两倍空间，按从 head 开始的顺序把元素复制到新数组。`,
          `用队列模拟银行叫号：三个窗口，按到达顺序服务，打印每个窗口服务了谁。`,
          `用 perf_counter 比较 list.pop(0) 和循环队列在 n 等于 20000 次出队时的耗时。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：队列从尾进从头出，循环数组用 head 加 size 取模绕圈，把出队从 O(n) 降到 O(1)。` }
      ]
    },
    {
      id: "p10",
      title: "第 10 课 · 双端队列：两头都能进出",
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：写一个两头都能进出的双端队列，用循环数组实现四个操作，并说清它适合哪些场景。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `双端队列是队列的放宽版：队头和队尾都能入队、都能出队。四个操作分别是 push_front、push_back、pop_front、pop_back。栈只在一头动，队列从一头进另一头出，双端队列两头都开放。` },
        { t: `p`, text: `循环数组实现的关键是两头都能绕圈。push_back 写在 (head + size) % cap；push_front 先把 head 往前退一格，减一后取模，再写进去；pop_front 取 head 再让 head 前进；pop_back 取 (head + size - 1) % cap 再把 size 减一。四个操作都只改下标，不搬元素。` },
        { t: `p`, text: `双端队列常被当成两边都能用的栈或队列。它比单端队列多一个约束：要同时维护 head 和 size，任何一边操作后都要把 size 更新对，否则下一次取模算出的位置会错位。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `浏览器的前进后退历史。`,
          `编辑器的撤销和重做。`,
          `滑动窗口、单调队列的底层容器。`,
          `需要从两端取任务的调度器。`,
          `判断回文时两头各取一个字符比较。`
        ]},
        { t: `h2`, text: `演示：循环数组双端队列` },
        { t: `p`, text: `容量 4，先 push_back 乙，再 push_front 甲，再 push_back 丙。此时从队头读是甲、乙、丙。接着从两头各弹一次，看四个操作是不是都只改下标。` },
        { t: `code`, lang: `python`, code: `class Deque:\n    def __init__(self, cap): self.data = [None] * cap; self.head = 0; self.size = 0\n    def push_front(self, v):\n        self.head = (self.head - 1) % len(self.data); self.data[self.head] = v; self.size += 1\n    def push_back(self, v):\n        i = (self.head + self.size) % len(self.data); self.data[i] = v; self.size += 1\n    def pop_front(self):\n        v = self.data[self.head]; self.head = (self.head + 1) % len(self.data); self.size -= 1; return v\n    def pop_back(self):\n        i = (self.head + self.size - 1) % len(self.data); self.size -= 1; return self.data[i]\nd = Deque(4); d.push_back("乙"); d.push_front("甲"); d.push_back("丙")\nprint(d.pop_back(), d.pop_front(), d.pop_back(), d.size)` },
        { t: `p`, text: `甲能插到乙前面，是因为 head 从 0 退到了 3；丙接在队尾，用的是 (3 加 2) 对 4 取模等于 1。物理顺序是甲在下标 3、乙在下标 0、丙在下标 1，逻辑顺序靠 head 和 size 还原。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320"><rect x="16" y="16" width="608" height="288" rx="16" fill="#eef6f4"/><text x="320" y="40" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">两头都能进出</text><circle cx="320" cy="160" r="96" fill="none" stroke="#9db8b0" stroke-width="2" stroke-dasharray="7 6"/><circle cx="320" cy="80" r="30" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="320" y="75" font-size="14" text-anchor="middle" fill="#4d6f67">0</text><text x="320" y="95" font-size="16" text-anchor="middle" fill="#173d36">乙</text><circle cx="400" cy="160" r="30" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="400" y="155" font-size="14" text-anchor="middle" fill="#4d6f67">1</text><text x="400" y="175" font-size="16" text-anchor="middle" fill="#173d36">丙</text><circle cx="320" cy="240" r="30" fill="#ffffff" stroke="#c98a2b" stroke-width="2"/><text x="320" y="235" font-size="14" text-anchor="middle" fill="#4d6f67">2</text><text x="320" y="255" font-size="15" text-anchor="middle" fill="#9db8b0">空</text><circle cx="240" cy="160" r="30" fill="#ffffff" stroke="#c0504d" stroke-width="2"/><text x="240" y="155" font-size="14" text-anchor="middle" fill="#4d6f67">3</text><text x="240" y="175" font-size="16" text-anchor="middle" fill="#173d36">甲</text><path d="M180 160H206" stroke="#c0504d" stroke-width="3"/><polygon points="206,160 196,154 196,166" fill="#c0504d"/><text x="174" y="154" font-size="15" text-anchor="end" fill="#c0504d">front</text><path d="M320 300V274" stroke="#c98a2b" stroke-width="3"/><polygon points="320,274 314,284 326,284" fill="#c98a2b"/><text x="360" y="296" font-size="15" fill="#c98a2b">back</text><text x="320" y="128" font-size="14" text-anchor="middle" fill="#4d6f67">head 在 3，tail 在 2</text></svg>`, caption: `甲从队头插入，占了 3 号格；乙、丙还在 0、1；队尾下一格是 2，两头都只移动 head 或 size。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `push_front 写成 head + 1，方向反了，队头跑到队尾。`,
          `取模前忘了先加 cap：Python 的 -1 % 4 是 3，别的语言不一定是，写通用逻辑时先 (head - 1 + cap) % cap。`,
          `pop_back 用 size 当下标，忘了减一。`,
          `只更新 head 不更新 size，下一次 push_back 覆盖已有元素。`,
          `容量满了还继续 push，覆盖另一头的元素。`,
          `把双端队列当成两个栈拼起来，中间的元素其实共享同一块空间。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `给 Deque 加 is_empty 和 is_full，把容量 4 的队列从两头填满再全部弹出。`,
          `用双端队列判断一个字符串是不是回文：两头各取一个字符比较，不等就失败。`,
          `实现浏览器历史：访问新页面 push_back，后退 pop_back 并存到另一个双端队列，前进再从另一个队列取回。`,
          `画一张 head 从 0 退到 3 的图，标出 push_front 前后每个元素的下标。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：双端队列把队头和队尾都开放，循环数组靠 head 前后取模让四个操作都不搬元素。` }
      ]
    },
    {
      id: "p11",
      title: "第 11 课 · 单调队列：窗口里的最大值",
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用双端队列维护一个单调递减的窗口，在 O(n) 时间里求出每个滑动窗口的最大值，并说清为什么队列里存的是下标。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `滑动窗口最大值的问题是：数组长度 n，窗口大小 k，窗口每次右移一格，输出每个窗口里的最大值。暴力做法每个窗口扫 k 个元素，总代价 O(nk)；窗口一长就慢。` },
        { t: `p`, text: `单调队列维护一个候选最大值的双端队列，队列里的值从队头到队尾单调递减。新元素进来时，从队尾把比它小或相等的元素全部弹掉。它们比新元素早过期，又不可能成为最大值，留着没用；然后新元素入队尾。` },
        { t: `p`, text: `队列里存的是下标而不是值：靠下标判断队头有没有滑出窗口，下标小于等于 i 减 k 就弹出；也靠下标取到原数组的值。每个下标最多入队一次、出队一次，所以整个循环是 O(n)。队头始终是当前窗口最大值的下标。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `实时数据流的滑动最大值、最小值。`,
          `股票最近 k 天的最高价。`,
          `限流器统计最近一段时间的请求峰值。`,
          `把 O(nk) 的窗口扫描降到 O(n)。`
        ]},
        { t: `h2`, text: `演示 1 · 单调队列求窗口最大值` },
        { t: `p`, text: `数组 1、3、-1、-3、5、3、6、7，窗口 3。dq 存下标，head 指向队头。while 里用的是小于等于，相等时也弹掉旧下标，避免队列里堆一串相同的值。` },
        { t: `code`, lang: `python`, code: `def window_max(nums, k):\n    dq = []; head = 0; out = []\n    for i, x in enumerate(nums):\n        while len(dq) > head and nums[dq[-1]] <= x:\n            dq.pop()\n        dq.append(i)\n        if dq[head] <= i - k:\n            head += 1\n        if i >= k - 1: out.append(nums[dq[head]])\n    return out\nprint(window_max([1, 3, -1, -3, 5, 3, 6, 7], 3))` },
        { t: `p`, text: `输出 3、3、5、5、6、7。第一个窗口 1、3、-1 的最大值是 3；窗口滑到 5、3、6 时，6 把前面的 5 和 3 都弹掉，队头直接变成 6。` },
        { t: `h2`, text: `演示 2 · 看一眼队列里的下标` },
        { t: `p`, text: `把窗口缩到 3，逐轮打印 i、当前值、队列里的下标和对应的值。队列长度通常远小于窗口，因为被弹掉的元素不会再回来。` },
        { t: `code`, lang: `python`, code: `nums = [1, 3, -1, -3, 5]\ndq = []\nfor i, x in enumerate(nums):\n    while dq and nums[dq[-1]] <= x:\n        dq.pop()\n    dq.append(i)\n    if dq[0] <= i - 3:\n        dq.pop(0)\n    print(i, x, dq, [nums[j] for j in dq])` },
        { t: `p`, text: `i 等于 4、值为 5 时，队列里只剩 4 一个下标；前面那些比 5 小的元素都被从队尾弹掉了，它们不可能再成为后面任何窗口的最大值。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="16" y="16" width="608" height="248" rx="16" fill="#eef6f4"/><text x="320" y="40" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">5 进来，比它小的都从队尾弹掉</text><rect x="60" y="62" width="84" height="46" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="102" y="91" font-size="16" text-anchor="middle" fill="#173d36">1</text><rect x="164" y="62" width="84" height="46" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="206" y="91" font-size="16" text-anchor="middle" fill="#173d36">3</text><rect x="268" y="62" width="84" height="46" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="310" y="91" font-size="16" text-anchor="middle" fill="#173d36">-1</text><rect x="372" y="62" width="84" height="46" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="414" y="91" font-size="16" text-anchor="middle" fill="#173d36">-3</text><rect x="476" y="62" width="84" height="46" rx="8" fill="#ffffff" stroke="#c0504d" stroke-width="2"/><text x="518" y="91" font-size="16" text-anchor="middle" fill="#173d36">5</text><path d="M268 124H560" stroke="#4a7bd0" stroke-width="2"/><path d="M268 118V130" stroke="#4a7bd0" stroke-width="2"/><path d="M560 118V130" stroke="#4a7bd0" stroke-width="2"/><text x="414" y="146" font-size="14" text-anchor="middle" fill="#4a7bd0">当前窗口</text><text x="160" y="176" font-size="15" fill="#4d6f67">处理 5 之前的队列，存的是下标</text><rect x="160" y="186" width="80" height="44" rx="8" fill="#ffffff" stroke="#9db8b0" stroke-width="2"/><text x="200" y="205" font-size="14" text-anchor="middle" fill="#4d6f67">1</text><text x="200" y="223" font-size="15" text-anchor="middle" fill="#173d36">3</text><rect x="250" y="186" width="80" height="44" rx="8" fill="#ffffff" stroke="#9db8b0" stroke-width="2"/><text x="290" y="205" font-size="14" text-anchor="middle" fill="#4d6f67">2</text><text x="290" y="223" font-size="15" text-anchor="middle" fill="#173d36">-1</text><rect x="340" y="186" width="80" height="44" rx="8" fill="#ffffff" stroke="#9db8b0" stroke-width="2"/><text x="380" y="205" font-size="14" text-anchor="middle" fill="#4d6f67">3</text><text x="380" y="223" font-size="15" text-anchor="middle" fill="#173d36">-3</text><path d="M170 190L370 226" stroke="#c0504d" stroke-width="3"/><path d="M370 190L170 226" stroke="#c0504d" stroke-width="3"/><path d="M518 112V182" stroke="#c0504d" stroke-width="3"/><polygon points="518,182 512,172 524,172" fill="#c0504d"/><rect x="470" y="186" width="100" height="44" rx="8" fill="#ffffff" stroke="#c0504d" stroke-width="2"/><text x="520" y="205" font-size="14" text-anchor="middle" fill="#4d6f67">4</text><text x="520" y="223" font-size="15" text-anchor="middle" fill="#173d36">5</text><text x="320" y="258" font-size="14" text-anchor="middle" fill="#4d6f67">每个下标只进一次、出一次，总代价 O(n)，队头就是窗口最大值。</text></svg>`, caption: `处理 5 时，3、-1、-3 从队尾被弹掉，队列只剩 4 号下标。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `队列里存值不存下标，窗口滑出时不知道该弹谁。`,
          `新元素进来只比队头，不清理队尾，队列不再单调，队头不是最大。`,
          `判断过期用 i - k 写成 i - k + 1 或漏掉等号，窗口多留一个元素。`,
          `用 list.pop(0) 维护队头，单次 O(n)，整体退化成 O(nk)。`,
          `相等元素不弹，队列里堆一串相同值，浪费空间。`,
          `窗口大小 k 大于数组长度或 k 等于 0，没做边界处理。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把演示 1 改成求窗口最小值，只需要改一个比较符号，跑同一组数据验证。`,
          `给 window_max 加一个 k 大于 n 的检查，返回空列表并说明理由。`,
          `用暴力双重循环写一个 O(nk) 版本，和单调队列版对同一组随机数据比对结果。`,
          `画出数组 1、3、-1、-3、5 在 i 等于 4 时的窗口、队列和已被弹掉的下标。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：单调队列存下标、保持值递减，队头就是窗口最大值，每个下标只进出一次，总代价 O(n)。` }
      ]
    },
    {
      id: "p12",
      title: "第 12 课 · 哈希表（一）：把键变成下标",
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把任意键变成 0 到 capacity-1 的下标，写一个稳定的字符串哈希，看清冲突和负载因子是怎么来的。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `哈希表想用 O(1) 时间按键取值，做法是先把键算成一个整数，也就是哈希值，再对容量取模，得到数组下标。理想情况下每个键落在不同格子，取一次就找到；但格子数有限、键无限多，冲突一定存在。` },
        { t: `p`, text: `字符串哈希要自己定规则。Python 内置的 hash 对字符串加了随机种子，每次启动结果不同，不适合教学演示；可以自己写多项式哈希：把每个字符的编码乘上 31 的幂再加起来。31 是常用的小质数，计算快，分布也还行。同样的字符串每次算出来一样，方便复现。` },
        { t: `p`, text: `冲突指两个不同的键算出同一个下标。解决办法有链地址法和开放寻址，后面单独一课讲。这一课先记住两个指标：桶的数量，也就是容量，和已经放进去的键数。负载因子等于键数除以容量；它越大，桶越挤，冲突越多，查找越慢。常见做法是超过 0.7 左右就扩容，并重新分配所有键。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `用字符串键快速查配置、缓存、计数。`,
          `判断一个用户名是否出现过。`,
          `实现集合、映射、缓存淘汰表。`,
          `理解为什么 dict 的键必须可哈希，而列表不行。`
        ]},
        { t: `h2`, text: `演示 1 · 把字符串变成下标` },
        { t: `p`, text: `自己写一个 h 函数：从左到右，每次把当前结果乘 31 再加字符编码。四个键对容量 8 取模，打印哈希值和下标。` },
        { t: `code`, lang: `python`, code: `def h(s):\n    total = 0\n    for ch in s:\n        total = total * 31 + ord(ch)\n    return total\nfor key in ("apple", "banana", "cat", "act"):\n    print(key, h(key), h(key) % 8)` },
        { t: `p`, text: `apple 和 act 都落在下标 2，这就是冲突；cat 和 act 字母相同、顺序不同，哈希值不同，说明乘法把位置信息带进去了。如果只用字符编码相加，这两个词会撞在一起。` },
        { t: `h2`, text: `演示 2 · 数一数桶里挤了几个` },
        { t: `p`, text: `十二个键，容量 8。每个键算下标后追加到对应的桶里，最后打印每个桶的下标、键数和键。键数除以容量就是负载因子 1.5，已经超过常见的 0.7 上限。` },
        { t: `code`, lang: `python`, code: `def h(s):\n    total = 0\n    for ch in s:\n        total = total * 31 + ord(ch)\n    return total\nkeys = ["k" + str(i) for i in range(12)]\nbuckets = {}\nfor k in keys:\n    i = h(k) % 8\n    buckets.setdefault(i, []).append(k)\nfor i in sorted(buckets):\n    print(i, len(buckets[i]), buckets[i])` },
        { t: `p`, text: `下标 2 和 3 各挤了两个键，其余桶只有一个。链地址法把同一个桶的键串成一条链，查找时先定位桶，再在链里逐个比。桶越挤，链越长，O(1) 就越接近 O(n)。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="16" y="16" width="608" height="268" rx="16" fill="#eef6f4"/><text x="320" y="40" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">键变整数，整数取模变下标</text><rect x="40" y="64" width="88" height="42" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="84" y="91" font-size="15" text-anchor="middle" fill="#173d36">cat</text><rect x="40" y="116" width="88" height="42" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="84" y="143" font-size="15" text-anchor="middle" fill="#173d36">act</text><path d="M132 85H174" stroke="#2a8c78" stroke-width="2"/><polygon points="174,85 164,79 164,91" fill="#2a8c78"/><path d="M132 137H174" stroke="#2a8c78" stroke-width="2"/><polygon points="174,137 164,131 164,143" fill="#2a8c78"/><rect x="178" y="85" width="130" height="54" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="243" y="108" font-size="15" text-anchor="middle" fill="#173d36">多项式哈希</text><text x="243" y="128" font-size="14" text-anchor="middle" fill="#4d6f67">乘 31 再加编码</text><path d="M312 112H338" stroke="#2a8c78" stroke-width="2"/><polygon points="338,112 328,106 328,118" fill="#2a8c78"/><rect x="342" y="85" width="116" height="54" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="400" y="108" font-size="15" text-anchor="middle" fill="#173d36">对 8 取模</text><text x="400" y="128" font-size="14" text-anchor="middle" fill="#4d6f67">98262 和 96402</text><path d="M462 112H488" stroke="#2a8c78" stroke-width="2"/><polygon points="488,112 478,106 478,118" fill="#2a8c78"/><rect x="492" y="85" width="88" height="54" rx="8" fill="#ffffff" stroke="#c0504d" stroke-width="2"/><text x="536" y="108" font-size="15" text-anchor="middle" fill="#173d36">下标 2</text><text x="536" y="128" font-size="14" text-anchor="middle" fill="#c0504d">冲突</text><path d="M536 142V176H214V206" stroke="#c0504d" stroke-width="3" fill="none"/><polygon points="214,206 208,196 220,196" fill="#c0504d"/><rect x="40" y="210" width="60" height="46" rx="6" fill="#ffffff" stroke="#9db8b0" stroke-width="2"/><text x="70" y="239" font-size="14" text-anchor="middle" fill="#4d6f67">0</text><rect x="112" y="210" width="60" height="46" rx="6" fill="#ffffff" stroke="#9db8b0" stroke-width="2"/><text x="142" y="239" font-size="14" text-anchor="middle" fill="#4d6f67">1</text><rect x="184" y="210" width="60" height="46" rx="6" fill="#ffffff" stroke="#c0504d" stroke-width="2"/><text x="214" y="230" font-size="14" text-anchor="middle" fill="#173d36">cat</text><text x="214" y="248" font-size="14" text-anchor="middle" fill="#173d36">act</text><rect x="256" y="210" width="60" height="46" rx="6" fill="#ffffff" stroke="#9db8b0" stroke-width="2"/><text x="286" y="239" font-size="14" text-anchor="middle" fill="#4d6f67">3</text><rect x="328" y="210" width="60" height="46" rx="6" fill="#ffffff" stroke="#9db8b0" stroke-width="2"/><text x="358" y="239" font-size="14" text-anchor="middle" fill="#4d6f67">4</text><rect x="400" y="210" width="60" height="46" rx="6" fill="#ffffff" stroke="#9db8b0" stroke-width="2"/><text x="430" y="239" font-size="14" text-anchor="middle" fill="#4d6f67">5</text><rect x="472" y="210" width="60" height="46" rx="6" fill="#ffffff" stroke="#9db8b0" stroke-width="2"/><text x="502" y="239" font-size="14" text-anchor="middle" fill="#4d6f67">6</text><rect x="544" y="210" width="60" height="46" rx="6" fill="#ffffff" stroke="#9db8b0" stroke-width="2"/><text x="574" y="239" font-size="14" text-anchor="middle" fill="#4d6f67">7</text><text x="320" y="278" font-size="14" text-anchor="middle" fill="#4d6f67">桶 2 里挂了两个键；负载因子是键数 12 除以容量 8，等于 1.5。</text></svg>`, caption: `两个不同的键可以算出同一个下标；桶里挂几条链，查找就要比几次。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `直接用 Python 的 hash 做演示，忘了字符串哈希每次启动会变，输出对不上。`,
          `取模遇到负数或容量为 0，下标会越界；容量取质数通常分布更好。`,
          `以为哈希函数能消灭冲突；只要键比桶多，冲突必然发生。`,
          `只看哈希值不看负载因子，桶里链太长，查找退化成 O(n)。`,
          `扩容后忘了重新计算所有键的下标，旧位置全错。`,
          `用可变对象当键，例如列表、字典，内容一变哈希就变，再也找不到。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把 h 的乘数从 31 改成 17 和 131，各跑一遍演示 2，比较 12 个键落在几个桶里。`,
          `写一个函数，统计 100 个随机字符串在容量 16 的表中每个桶的长度，算出最长桶。`,
          `给演示 2 加一行负载因子输出，保留两位小数。`,
          `用字符编码相加写一个劣质哈希，找出两个会冲突的单词，解释为什么。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：哈希表先用哈希函数把键变整数、再对容量取模变下标，冲突必然存在，负载因子决定桶有多挤。` }
      ]
    }
  ]
};
