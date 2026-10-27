/* 喵站 · 算法入门（单文件形态，与 go-data.js 同构）
 * 12 课：历史 / 装工具 / 线性查找 / 复杂度 / 数组与链表 / 栈与队列 / 哈希表 / 冒泡与插入 / 分治排序 / 二分查找 / 递归 / 树与图。
 * 代码块为 Python 3 标准库写法，按语法自查；不写依赖机器路径的输出。 */
window.MIAO_ALGORITHMS = {
  tutorial: {
    id: "algorithms",
    title: "算法入门",
    intro: "算法不是计算机的专利：从欧几里得求最大公约数，到哈希表与二分查找，12 课把最常用的算法逐个拆开，每个概念都配一段能照敲的 Python 代码和一张机制图。",
    cat: "算法",
    diff: "入门",
    tags: ["算法", "Python", "入门", "数据结构"],
    author: "喵站官方",
    cover: "/assets/img/covers/algorithms.svg",
    updated: "2026-10-27",
    chapters: [
      {
        id: "al01",
        title: "第 1 课 · 算法的历史：从欧几里得到计算机",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：知道算法这个词从哪来、古人用什么办法解决计算问题，以及图灵给算法下了一个什么定义。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "算法这个词来自九世纪波斯数学家花拉子米的名字。他写的算术书把印度数字和计算步骤带到欧洲，书名被音译成算法一词。可见算法最早的意思很朴素：一套写下来、照着做就能得到答案的步骤，而不是什么高深理论。" },
          { t: "p", text: "公元前三百年，欧几里得在几何原本里写下求最大公约数的办法：两个数反复相除取余，余数变成新的除数，直到余数为零。这个办法用了两千多年，今天还叫欧几里得算法，是现存最古老的算法之一。" },
          { t: "p", text: "中国古代也有成体系的算法。九章算术按问题类型给出计算步骤，用算筹摆出数字和中间结果；秦九韶在高次方程求根上给出了一套可执行的迭代步骤。这些步骤有共同特征：有明确的输入，有有限的步骤，最后一定停下并给出结果。" },
          { t: "p", text: "1936 年，图灵为了回答「什么问题是可计算的」，提出了一种假想的机器：一条无限长的纸带、一个读写头、一张状态转移表。能在这台机器上按规则一步步算出来的问题，就叫可计算。这个模型把算法从手艺变成了数学对象，也为后来的电子计算机定下了基本形状。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "把这段历史放在心里，你再看今天的排序、查找、压缩、路径规划，会发现它们都是同一种东西：在有限步内把输入变成输出。判断一段代码算不算算法，就看它会不会停、答案对不对、步骤是不是有限。" },
          { t: "h2", text: "演示：欧几里得算法写成程序" },
          { t: "p", text: "下面这段程序把辗转相除写成循环。输入两个正整数，输出它们的最大公约数。五行函数体里没有任何魔法，全是上面说的那条规则。" },
          { t: "code", lang: "python", code: `def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a

print(gcd(48, 18))
print(gcd(1071, 462))` },
          { t: "p", text: "把 a 设为 1071、b 设为 462，前两轮会得到 147 和 21，最后一轮余数为零，函数返回 21。纸上算一遍，再和程序输出对一对，能最快建立「算法就是步骤」的直觉。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260"><rect x="24" y="18" width="592" height="224" rx="14" fill="#f3f0ff"/><text x="320" y="52" font-size="20" font-weight="700" text-anchor="middle" fill="#2b2350">辗转相除：gcd(48, 18)</text><rect x="56" y="74" width="528" height="44" rx="9" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><text x="76" y="102" font-size="16" fill="#2b2350">48 除以 18，余 12</text><text x="376" y="102" font-size="14" fill="#5a5480">问题变成 gcd(18, 12)</text><rect x="56" y="130" width="528" height="44" rx="9" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><text x="76" y="158" font-size="16" fill="#2b2350">18 除以 12，余 6</text><text x="376" y="158" font-size="14" fill="#5a5480">问题变成 gcd(12, 6)</text><rect x="56" y="186" width="528" height="44" rx="9" fill="#ded6ff" stroke="#4a3f9e" stroke-width="2"/><text x="76" y="214" font-size="16" fill="#2b2350">12 除以 6，余 0</text><text x="376" y="214" font-size="14" fill="#2b2350">余数为 0，答案是 6</text></svg>`, caption: "每除一次，两个数都变小，余数为零时除数就是最大公约数。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把算法等同于代码。算法是步骤本身，同一个算法可以用纸笔、用 Python、用汇编实现。",
            "以为算法一定要很快。先保证能停、答案正确，速度是下一步才谈的事。",
            "把编程语言当成算法。语言只是表达工具，换语言不会让平方量级变成线性。",
            "忽略「有限步」。没有终止条件的步骤不算算法，哪怕它每一步都算得很对。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用一句话写下欧几里得算法的规则，不看书复述，再对照正文检查有没有漏掉「余数为零」这个停止条件。",
            "在纸上手算 gcd(84, 36)，把每一轮的除数和余数都写出来，数一数一共几轮。",
            "举一个你身边「照着步骤就能做完」的例子，说明它的输入、步骤和输出分别是什么。"
          ]},
          { t: "tip", color: "green", text: "一句话：算法是有限步内把输入变成输出的步骤，图灵机让这件事变成了可以严格讨论的数学对象。" }
        ]
      },
      {
        id: "al02",
        title: "第 2 课 · 装工具：Python 和 VS Code",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：用三条命令装好 Python 和 VS Code，跑通第一个 .py 文件，并让终端自己报出版本号。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "Python 是解释型语言。.py 文件不需要先编译成可执行文件，python3 会读一段、翻译一段、执行一段。改一行就能立刻看到结果，这种节奏特别适合边写边验证算法。" },
          { t: "p", text: "python3 命令自带解释器和标准库。标准库里已经有列表、字典、排序、随机数、计时这些常用工具，入门阶段不需要装任何第三方包。看到教程里写 pip install，那多半是装扩展库，不是必需品。" },
          { t: "p", text: "VS Code 是编辑器，负责写代码、看目录、开终端。它自己不会运行 Python，要装 Python 扩展，扩展再去调用你系统里的 python3。所以顺序很重要：先确认终端能执行 python3，再装编辑器扩展。" },
          { t: "p", text: "版本号是排错的第一条线索。Python 3.8 之后语法趋于稳定，本教程的示例在 3.9 及以上都能跑。如果版本命令报出 2.7，说明系统里还留着旧解释器，调用时要显式写 python3 而不是 python。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "装好之后，你能在任何目录新建一个 .py 文件，用 python3 加文件名直接运行；也能在 VS Code 里点运行按钮，让扩展替你敲这条命令。后面每节课的演示都假设这两个入口可用。" },
          { t: "h2", text: "演示：在 Ubuntu 上装 Python 和 VS Code" },
          { t: "p", text: "下面一组命令按顺序执行。第一条刷新软件源清单，第二条装解释器和 pip，第三条装编辑器，最后一条验证版本。装完再关掉终端重开一次，让 PATH 生效。" },
          { t: "code", lang: "bash", code: `sudo apt update
sudo apt install -y python3 python3-pip
sudo snap install code --classic
python3 --version` },
          { t: "p", text: "版本命令输出形如 Python 3.12.3，看到这一行就说明解释器就绪。接着在 VS Code 里装 Python 扩展，新建 hello.py，写一个小函数并保存，在终端里执行 python3 hello.py。" },
          { t: "code", lang: "python", code: `def greet(name):
    return "你好，" + name + "，环境就绪"

print(greet("同学"))` },
          { t: "p", text: "看到「你好，同学，环境就绪」这行字，工具链就算通了。它同时证明了三件事：文件能被找到、解释器能启动、字符串拼接没有语法错误。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250"><rect x="24" y="18" width="592" height="214" rx="14" fill="#f3f0ff"/><text x="320" y="54" font-size="20" font-weight="700" text-anchor="middle" fill="#2b2350">安装链：命令 → 解释器 → 编辑器</text><rect x="40" y="82" width="150" height="72" rx="10" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><text x="115" y="110" font-size="16" text-anchor="middle" fill="#2b2350">python3 命令</text><text x="115" y="134" font-size="14" text-anchor="middle" fill="#5a5480">已在 PATH 里</text><path d="M194 118H232" stroke="#6b5bd2" stroke-width="3"/><polygon points="232,118 222,112 222,124" fill="#6b5bd2"/><rect x="238" y="82" width="164" height="72" rx="10" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><text x="320" y="110" font-size="16" text-anchor="middle" fill="#2b2350">解释器与标准库</text><text x="320" y="134" font-size="14" text-anchor="middle" fill="#5a5480">读一行执行一行</text><path d="M406 118H444" stroke="#6b5bd2" stroke-width="3"/><polygon points="444,118 434,112 434,124" fill="#6b5bd2"/><rect x="450" y="82" width="150" height="72" rx="10" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><text x="525" y="110" font-size="16" text-anchor="middle" fill="#2b2350">VS Code 扩展</text><text x="525" y="134" font-size="14" text-anchor="middle" fill="#5a5480">调用 python3</text><text x="320" y="194" font-size="15" text-anchor="middle" fill="#2b2350">验证标准：python3 --version 打印出 3.x</text></svg>`, caption: "编辑器只是壳，真正的执行者是终端里的 python3；验证点是版本号。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "装完立刻敲 python 提示 command not found。先重开终端，再用 which python3 看命令到底在哪。",
            "系统里同时有 2.7 和 3.x，敲 python 跑到了旧版本。养成显式写 python3 的习惯。",
            "以为 VS Code 装上就会跑 Python。编辑器要装扩展，扩展还要指向正确的解释器路径。",
            "用 root 身份在项目目录里跑脚本。生成的文件归 root，普通用户后面改不动。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "按演示装好 Python 和 VS Code，把 python3 --version 的输出原样抄下来。",
            "用 which python3 和 python3 -c \"import sys; print(sys.executable)\" 分别看命令位置与解释器路径，两者是否一致？",
            "在 VS Code 里把 hello.py 改成接收你的名字再问候，运行一次并截图保存输出。"
          ]},
          { t: "tip", color: "green", text: "一句话：Python 装完是一个能执行 python3 的终端，VS Code 只是调用它的界面，判据永远是版本号。" }
        ]
      },
      {
        id: "al03",
        title: "第 3 课 · 第一个算法：线性查找",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：写出生平第一个真正的算法函数：输入一个列表和一个目标值，输出目标的下标或者 -1。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "线性查找的做法很直白：从第一个元素开始，逐个和目标比较。相等就返回当前下标，扫到末尾都不相等就返回 -1。它不要求列表有序，这是它最大的优点，也是它常被当成兜底方案的原因。" },
          { t: "p", text: "为什么用 -1 表示没找到？因为 0 是合法下标，用 0 表示「不存在」会分不清。约定一个不可能出现的下标值当信号，是算法里很常见的做法，函数的说明里必须写清楚。" },
          { t: "p", text: "比较次数取决于目标在哪：第一个就命中只要 1 次，最后一个才命中要 n 次，平均大约 n 除以 2。这里的 n 是列表长度，这个「最坏要看完全部」的直觉，是后面讨论复杂度的起点。" },
          { t: "p", text: "线性查找还有一个容易忽略的性质：它对数据的排布没有任何要求，因此可以边读边查。数据从网络一段段到达时，你不必等全部收齐就能开始找，这一点是很多高级查找方法做不到的。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "数据量在几千以内、只查一两次时，线性查找完全够用，代码短到几乎不用调试。它还是分块查找、图遍历的最后一步：大结构筛完，小范围里再用它扫一遍。" },
          { t: "h2", text: "演示：写函数并验证" },
          { t: "p", text: "函数接收列表和目标值，返回下标或 -1。下面三次调用分别覆盖三种情况：目标在开头、在末尾、根本不在列表里。" },
          { t: "code", lang: "python", code: `def linear_search(items, target):
    for index in range(len(items)):
        if items[index] == target:
            return index
    return -1

numbers = [7, 3, 9, 5]
print(linear_search(numbers, 7))
print(linear_search(numbers, 5))
print(linear_search(numbers, 4))` },
          { t: "p", text: "输出是 0、3、-1。第一次命中就立刻返回，后面的元素不会再被看到；在循环里加一句 print(index) 就能亲眼看到它提前停下，这是理解「提前返回」最快的方式。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 270"><rect x="24" y="18" width="592" height="234" rx="14" fill="#f3f0ff"/><text x="320" y="52" font-size="20" font-weight="700" text-anchor="middle" fill="#2b2350">线性查找：从左往右逐个比较</text><rect x="58" y="84" width="96" height="58" rx="8" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><text x="106" y="120" font-size="18" text-anchor="middle" fill="#2b2350">7</text><text x="106" y="164" font-size="14" text-anchor="middle" fill="#5a5480">下标 0</text><rect x="166" y="84" width="96" height="58" rx="8" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><text x="214" y="120" font-size="18" text-anchor="middle" fill="#2b2350">3</text><text x="214" y="164" font-size="14" text-anchor="middle" fill="#5a5480">下标 1</text><rect x="274" y="84" width="96" height="58" rx="8" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><text x="322" y="120" font-size="18" text-anchor="middle" fill="#2b2350">9</text><text x="322" y="164" font-size="14" text-anchor="middle" fill="#5a5480">下标 2</text><rect x="382" y="84" width="96" height="58" rx="8" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><text x="430" y="120" font-size="18" text-anchor="middle" fill="#2b2350">5</text><text x="430" y="164" font-size="14" text-anchor="middle" fill="#5a5480">下标 3</text><rect x="490" y="84" width="96" height="58" rx="8" fill="#ded6ff" stroke="#4a3f9e" stroke-width="2"/><text x="538" y="120" font-size="18" text-anchor="middle" fill="#2b2350">4</text><text x="538" y="164" font-size="14" text-anchor="middle" fill="#2b2350">下标 4</text><path d="M58 196H410" stroke="#8a84a8" stroke-width="2"/><polygon points="410,196 400,190 400,202" fill="#8a84a8"/><text x="58" y="222" font-size="15" fill="#5a5480">前 4 个都比较过，第 5 个才命中</text><text x="474" y="222" font-size="15" text-anchor="middle" fill="#2b2350">返回 4</text></svg>`, caption: "命中就返回，没命中就返回 -1；比较次数由目标的位置决定。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "用 0 表示没找到。0 是合法下标，调用方无法分辨「第一个元素」和「不存在」。",
            "找到后忘了 return，循环继续跑，最后函数返回 None 或最后一个匹配项。",
            "循环里直接写 for item in items，却还需要下标。用 range 或 enumerate 才能拿到位置。",
            "以为列表重复元素也只有一个答案。线性查找返回的是第一个匹配项，这一点要写在说明里。",
            "对已排序数据也只用线性查找。有序意味着可以用更省事的办法，后面单独一课会讲。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "把函数改成返回全部匹配下标组成的列表，用 [2, 5, 2] 这种含重复值的输入验证。",
            "在函数里加一个计数器，统计比较了多少次，分别测目标在开头、末尾、不存在三种情况。",
            "写一个 count_missing 函数，输入两个列表，返回第一个列表中不在第二个列表里的元素个数。"
          ]},
          { t: "tip", color: "green", text: "一句话：线性查找是逐个比较的兜底方案，不要求有序，代价是最坏情况下要看完整个列表。" }
        ]
      },
      {
        id: "al04",
        title: "第 4 课 · 时间复杂度",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：学会数一个算法做了多少次基本操作，并用大写 O 记下这个次数随输入规模增长的趋势。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "同一段代码在同一台机器上跑，时间也会有波动；换台机器差距更大。所以比较算法时不看秒数，而是数基本操作的次数，例如比较了几次、加了几次，再看这个次数随输入规模 n 怎么变。" },
          { t: "p", text: "数的时候只保留增长最快的一项，并丢掉系数。3n 加 5 和 100n 加 7 都记作 O(n)，因为 n 变大之后常数和低次项可以忽略；平方量级的算法迟早会超过任何线性算法，不管常数多小。" },
          { t: "p", text: "常见量级从小到大排：常数 O(1)、对数 O(log n)、线性 O(n)、线性对数 O(n log n)、平方 O(n^2)。线性查找是 O(n)，冒泡排序是 O(n^2)，哈希表的平均查找是 O(1)。" },
          { t: "p", text: "复杂度的价值在于预测。n 从一千涨到一百万，O(n^2) 的操作次数涨了一百万倍，O(n) 只涨一千倍。量级选错了，靠优化常数是补不回来的；量级对了，再谈常数才有意义。记录数据量、估算量级、再决定要不要换算法，是排查性能问题的常规顺序。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "你能在动手之前判断方案撑不撑得住数据量，也能在程序变慢时先问「瓶颈在哪个量级」，而不是盲目改代码。面试和评审里，这一句话往往比跑一次计时更有说服力。" },
          { t: "h2", text: "演示：数一数嵌套循环" },
          { t: "p", text: "外层跑 n 次，内层每次也跑 n 次，计数器一共加 n 乘 n 次。把 n 翻一倍，结果变成四倍，这就是平方量级最直观的样子。" },
          { t: "code", lang: "python", code: `def count_pairs(n):
    steps = 0
    for i in range(n):
        for j in range(n):
            steps += 1
    return steps

for n in (10, 20, 40):
    print(n, count_pairs(n))` },
          { t: "p", text: "输出 100、400、1600。n 每翻一倍，结果乘四，比值很稳定。若把内层改成 range(i)，总数变成 n 乘 n 减一除以二，仍然按平方量级记，因为系数二分之一会被丢掉。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="24" y="18" width="592" height="264" rx="14" fill="#f3f0ff"/><text x="320" y="50" font-size="20" font-weight="700" text-anchor="middle" fill="#2b2350">三种量级的增长</text><line x1="82" y1="244" x2="586" y2="244" stroke="#6b5bd2" stroke-width="2"/><line x1="82" y1="244" x2="82" y2="70" stroke="#6b5bd2" stroke-width="2"/><text x="92" y="66" font-size="15" fill="#5a5480">操作次数</text><text x="590" y="266" font-size="15" text-anchor="end" fill="#5a5480">输入规模 n</text><line x1="82" y1="232" x2="570" y2="232" stroke="#8a84a8" stroke-width="3"/><text x="520" y="220" font-size="16" fill="#5a5480">O(1)</text><line x1="84" y1="240" x2="560" y2="152" stroke="#4a8f7a" stroke-width="3"/><text x="512" y="140" font-size="16" fill="#2f6b59">O(n)</text><path d="M86 242C300 238 420 204 556 78" stroke="#b05a86" stroke-width="3" fill="none"/><text x="470" y="96" font-size="16" fill="#8c3e66">O(n^2)</text><text x="320" y="278" font-size="15" text-anchor="middle" fill="#2b2350">横轴越长差距越大，量级决定上限</text></svg>`, caption: "常数和系数只影响起点，量级决定曲线最后跑到哪里。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把 O 当成精确时间。它描述的是增长趋势，同一量级的两个算法实际速度可能差十倍。",
            "看到两个循环就写 O(n^2)。两个并列的循环仍是 O(n)，只有嵌套且都跑 n 次才是平方。",
            "以为 O(1) 就一定快。常数极大的 O(1) 也可能比小规模的 O(n) 慢。",
            "忽略最好与最坏。冒泡排序的有序输入接近 O(n)，但复杂度通常按最坏情况记。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "写一个双重循环做计数，把 n 取 100、200、400，记录结果并算出相邻两次的比值。",
            "判断下面三段代码的量级：单层循环、两层嵌套、每次把 n 减半的循环。",
            "用一句话说明为什么 5n 加 100 和 2n 都记作 O(n)，并举一个反例说明系数不能改变量级。"
          ]},
          { t: "tip", color: "green", text: "一句话：复杂度不看秒数，只看基本操作次数随 n 增长的量级，量级错了优化常数也救不回来。" }
        ]
      },
      {
        id: "al05",
        title: "第 5 课 · 数组与链表",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：看清数组和链表在内存里怎么排布，知道按下标取和第 k 个位置上插入各自贵在哪里。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "数组是一块连续的内存，元素紧挨着放。知道起始地址和每个元素占多大，第 i 个元素的地址可以直接算出来，所以按下标访问是常数时间，这是数组最强的能力。" },
          { t: "p", text: "缺点是插入和删除。在中间插入一个元素，它后面所有元素都要往后挪一格；在开头插入，整块都要动。删除同理，留下空洞就得把后面的元素往前补。" },
          { t: "p", text: "链表把元素散放在内存各处，每个节点除了存值，还存一个指向下一个节点的引用。访问第 k 个节点必须从头一个个跳过去，是线性时间；插入和删除只要改两个引用，不用挪动任何数据。" },
          { t: "p", text: "两种结构对应两种使用习惯：查得多、改得少，用数组；频繁在中间插入删除、又不需要随机访问，用链表。Python 的列表底层是动态数组，装不下时会重新申请一块更大的内存再整体复制过去。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "知道这个区别，你看到「按学号查成绩」会想到数组，看到「任务不断从头部加入」会想到链表；也能解释为什么 Python 列表在头部插入很慢，从而改用 deque。" },
          { t: "h2", text: "演示：用字典搭一条链" },
          { t: "p", text: "每个节点是一个字典：value 存值，next 存下一个节点，最后一个节点的 next 是 None。下面先建链，再把链上的值依次收集成列表。" },
          { t: "code", lang: "python", code: `def build_chain(values):
    head = None
    for value in reversed(values):
        head = {"value": value, "next": head}
    return head

def chain_to_list(head):
    out = []
    while head is not None:
        out.append(head["value"])
        head = head["next"]
    return out

print(chain_to_list(build_chain([10, 20, 30])))` },
          { t: "p", text: "输出 [10, 20, 30]。注意循环里那句把 head 换成 next 的赋值，其实是在沿着指针走，走一步看一个节点。要取第 30 个值，就得先走 30 步，这就是链表为省下挪动数据的开销所付的代价。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="24" y="16" width="592" height="268" rx="14" fill="#f3f0ff"/><text x="320" y="46" font-size="19" font-weight="700" text-anchor="middle" fill="#2b2350">数组连续，链表靠指针串联</text><text x="60" y="78" font-size="15" fill="#5a5480">数组：一块连续内存</text><rect x="60" y="90" width="94" height="46" rx="6" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><text x="107" y="120" font-size="17" text-anchor="middle" fill="#2b2350">7</text><rect x="156" y="90" width="94" height="46" rx="6" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><text x="203" y="120" font-size="17" text-anchor="middle" fill="#2b2350">3</text><rect x="252" y="90" width="94" height="46" rx="6" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><text x="299" y="120" font-size="17" text-anchor="middle" fill="#2b2350">9</text><rect x="348" y="90" width="94" height="46" rx="6" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><text x="395" y="120" font-size="17" text-anchor="middle" fill="#2b2350">5</text><text x="107" y="156" font-size="14" text-anchor="middle" fill="#5a5480">下标 0</text><text x="203" y="156" font-size="14" text-anchor="middle" fill="#5a5480">下标 1</text><text x="299" y="156" font-size="14" text-anchor="middle" fill="#5a5480">下标 2</text><text x="395" y="156" font-size="14" text-anchor="middle" fill="#5a5480">下标 3</text><text x="470" y="120" font-size="15" fill="#2b2350">地址可直接算</text><text x="60" y="196" font-size="15" fill="#5a5480">链表：节点分散，next 指向下一个</text><rect x="60" y="208" width="118" height="52" rx="8" fill="#ffffff" stroke="#4a8f7a" stroke-width="2"/><text x="119" y="231" font-size="16" text-anchor="middle" fill="#2b2350">值 10</text><text x="119" y="250" font-size="14" text-anchor="middle" fill="#4a8f7a">next →</text><path d="M182 234H222" stroke="#4a8f7a" stroke-width="3"/><polygon points="222,234 212,228 212,240" fill="#4a8f7a"/><rect x="226" y="208" width="118" height="52" rx="8" fill="#ffffff" stroke="#4a8f7a" stroke-width="2"/><text x="285" y="231" font-size="16" text-anchor="middle" fill="#2b2350">值 20</text><text x="285" y="250" font-size="14" text-anchor="middle" fill="#4a8f7a">next →</text><path d="M348 234H388" stroke="#4a8f7a" stroke-width="3"/><polygon points="388,234 378,228 378,240" fill="#4a8f7a"/><rect x="392" y="208" width="118" height="52" rx="8" fill="#ffffff" stroke="#4a8f7a" stroke-width="2"/><text x="451" y="231" font-size="16" text-anchor="middle" fill="#2b2350">值 30</text><text x="451" y="250" font-size="14" text-anchor="middle" fill="#4a8f7a">next = None</text></svg>`, caption: "数组按下标一步到位，链表要顺着 next 一步步走。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "以为 Python 的列表是链表。它是动态数组，按下标访问很快，头部插入很慢。",
            "在循环里反复 pop(0)。每次都要挪动全部元素，整体退化成平方量级。",
            "遍历链表时弄丢头节点。用一个临时变量往前走，保留 head 才能回头。",
            "对链表做按下标访问。那要线性时间，写起来还容易越界。",
            "以为插入一定便宜。链表插入便宜的前提是已经站在那个位置，找位置本身要走路。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用比较计数的方式体会成本：分别统计数组按下标取值和链表走到第 5 个节点各做了多少次操作。",
            "给链表加一个 prepend 函数，在头部插入一个值，返回新的头节点，并打印整条链。",
            "在 10 万条数据上分别测一次头部插入和尾部追加，记录耗时差异并解释原因。"
          ]},
          { t: "tip", color: "green", text: "一句话：数组用连续内存换随机访问，链表用指针换插入删除，选哪个取决于你更常做哪种操作。" }
        ]
      },
      {
        id: "al06",
        title: "第 6 课 · 栈与队列",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：用 Python 列表实现栈，用 deque 实现队列，并说清后进先出与先进先出各自适合什么场景。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "栈只允许在一端进出，这一端叫栈顶。最后放进去的元素最先被取出，规则叫后进先出。想象一摞盘子，你只能拿最上面那个，想拿下面的必须先挪开上面的。" },
          { t: "p", text: "队列从一端进、另一端出。先进去的先出来，规则叫先进先出。排队买饭就是队列：窗口那一头叫队头，新来的人站在队尾，办完事的人从队头离开。" },
          { t: "p", text: "两者的单次操作都很便宜。栈的进出都在末尾，列表的 append 和 pop 正好是常数时间；队列如果也用列表在头部 pop(0)，每次都要挪动全部元素，所以标准库提供 deque，两端进出都是常数时间。这也是双端队列被单独做成一个类型的原因。" },
          { t: "p", text: "用途分工明确：栈处理嵌套与回退，比如括号匹配、撤销操作、函数调用；队列处理排队与逐层扩散，比如任务调度、消息缓冲、按层遍历一棵树。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "你能用栈检查一段表达式里的括号是否配对，用队列按到达顺序处理一批任务，也能在看到深度优先、广度优先这两个词时立刻对应到栈和队列。" },
          { t: "h2", text: "演示：用栈把顺序倒过来" },
          { t: "p", text: "依次压入三个值，打印栈当前的内容，再从栈顶逐个弹出。弹出的顺序和压入的顺序正好相反，这就是栈的全部机制。" },
          { t: "code", lang: "python", code: `def reverse_with_stack(items):
    stack = []
    for item in items:
        stack.append(item)
        print("push", item, stack)
    out = []
    while stack:
        out.append(stack.pop())
    return out

print(reverse_with_stack([1, 2, 3]))` },
          { t: "p", text: "输出里能看到栈的变化：先是 [1]，再是 [1, 2]，再是 [1, 2, 3]，随后逐个弹出得到 [3, 2, 1]。栈顶永远是列表的最后一个元素，push 和 pop 都只碰这个位置。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 290"><rect x="24" y="16" width="592" height="258" rx="14" fill="#f3f0ff"/><text x="320" y="46" font-size="19" font-weight="700" text-anchor="middle" fill="#2b2350">栈：只在一端进出，后进先出</text><rect x="200" y="80" width="180" height="52" rx="8" fill="#ded6ff" stroke="#4a3f9e" stroke-width="2"/><text x="290" y="113" font-size="18" text-anchor="middle" fill="#2b2350">3</text><rect x="200" y="138" width="180" height="52" rx="8" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><text x="290" y="171" font-size="18" text-anchor="middle" fill="#2b2350">2</text><rect x="200" y="196" width="180" height="52" rx="8" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><text x="290" y="229" font-size="18" text-anchor="middle" fill="#2b2350">1</text><text x="396" y="112" font-size="16" fill="#4a3f9e">← 栈顶</text><text x="396" y="228" font-size="16" fill="#5a5480">← 栈底</text><path d="M470 96H404" stroke="#4a8f7a" stroke-width="3"/><polygon points="404,96 414,90 414,102" fill="#4a8f7a"/><text x="476" y="102" font-size="15" fill="#2f6b59">push 进</text><path d="M404 128H470" stroke="#b05a86" stroke-width="3"/><polygon points="470,128 460,122 460,134" fill="#b05a86"/><text x="476" y="134" font-size="15" fill="#8c3e66">pop 出</text><text x="290" y="272" font-size="15" text-anchor="middle" fill="#5a5480">最后进来的 3，最先离开</text></svg>`, caption: "push 和 pop 都只动栈顶，中间的元素碰不到。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "用列表当队列，在头部 pop(0)。每次都要挪动全部元素，数据一多就明显变慢。",
            "对空栈执行 pop。要么先用 if 判断，要么用 try 捕获 IndexError，别让它静默失败。",
            "以为栈能随机访问。栈只暴露栈顶，按下标取元素就破坏了这个结构的意义。",
            "把队列的队头和队尾搞反。入队在一端，出队在另一端，两端是分开的。",
            "用栈做需要按到达顺序处理的任务。顺序会整体倒过来，结果往往对不上。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用栈写一个函数，判断只含圆括号的字符串是否配对，返回 True 或 False。",
            "用 deque 写一个任务队列，依次放入三段任务名，再逐个取出并打印。",
            "用两个栈实现一个队列，说明入队和出队分别在哪个栈上操作。"
          ]},
          { t: "tip", color: "green", text: "一句话：栈在顶端进出、后进先出，队列两头分工、先进先出；列表配栈，deque 配队列。" }
        ]
      },
      {
        id: "al07",
        title: "第 7 课 · 哈希表",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：理解键是怎么变成一个下标的，写一个用字典统计词频的小程序，并知道冲突为什么躲不掉。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "哈希表先用一个哈希函数把键算成一个整数，再对这个整数取余，得到一个桶的下标，把值放进那个桶。查找时用同样的办法算出同一个下标，直接跳过去，不用从头找。" },
          { t: "p", text: "好的哈希函数会把键尽量均匀地撒开，让每个桶里的元素数量接近。桶多、元素少时，查找接近常数时间；桶少、元素多时，桶内要逐个比较，就退化成线性查找。" },
          { t: "p", text: "冲突是指两个不同的键算出了同一个下标。它躲不掉，因为键的可能取值远多于桶的数量。常见处理办法是同一个桶里挂一条链，或者顺着表继续往后找第一个空位。" },
          { t: "p", text: "哈希表牺牲了顺序。它擅长「给定键找值」，不擅长按大小遍历、找最小值、取一段连续区间。需要有序结果时，要么把键取出来另排一遍，要么换一种本身就有序的结构。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "统计词频、判断元素是否出现过、缓存计算结果、给对象建索引，都是哈希表的主场。Python 的字典和集合就是哈希表，平均查找是常数时间，代价是额外的内存。" },
          { t: "h2", text: "演示：统计词频" },
          { t: "p", text: "遍历列表，用 get 取旧计数再加一。键第一次出现时 get 返回默认值 0，所以不必先判断键在不在，一行就完成了累加。" },
          { t: "code", lang: "python", code: `def count_words(words):
    counts = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    return counts

result = count_words(["甲", "乙", "甲"])
for key in sorted(result):
    print(key, result[key])` },
          { t: "p", text: "输出两行：甲 2、乙 1。字典的键唯一，重复写入只会覆盖值，不会产生第二个同名键，这也是它天然适合去重的原因。sorted 只是为了输出稳定，字典本身不保证顺序。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320"><rect x="24" y="16" width="592" height="290" rx="14" fill="#f3f0ff"/><text x="320" y="46" font-size="19" font-weight="700" text-anchor="middle" fill="#2b2350">哈希：键算成下标，同桶挂成链</text><rect x="330" y="64" width="180" height="76" rx="8" fill="#ded6ff" stroke="#4a3f9e" stroke-width="2"/><text x="350" y="94" font-size="16" fill="#2b2350">桶 0</text><text x="462" y="94" font-size="16" text-anchor="middle" fill="#2b2350">甲</text><text x="462" y="120" font-size="14" text-anchor="middle" fill="#2b2350">丙（冲突）</text><rect x="330" y="150" width="180" height="46" rx="8" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><text x="350" y="178" font-size="16" fill="#2b2350">桶 1</text><text x="462" y="178" font-size="16" text-anchor="middle" fill="#2b2350">乙</text><rect x="330" y="206" width="180" height="46" rx="8" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><text x="350" y="234" font-size="16" fill="#2b2350">桶 2</text><text x="462" y="234" font-size="15" text-anchor="middle" fill="#5a5480">空</text><rect x="330" y="262" width="180" height="46" rx="8" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><text x="350" y="290" font-size="16" fill="#2b2350">桶 3</text><text x="462" y="290" font-size="16" text-anchor="middle" fill="#2b2350">丁</text><rect x="70" y="74" width="110" height="42" rx="8" fill="#ffffff" stroke="#4a8f7a" stroke-width="2"/><text x="125" y="101" font-size="16" text-anchor="middle" fill="#2b2350">键 甲</text><rect x="70" y="158" width="110" height="42" rx="8" fill="#ffffff" stroke="#4a8f7a" stroke-width="2"/><text x="125" y="185" font-size="16" text-anchor="middle" fill="#2b2350">键 乙</text><rect x="70" y="266" width="110" height="42" rx="8" fill="#ffffff" stroke="#4a8f7a" stroke-width="2"/><text x="125" y="293" font-size="16" text-anchor="middle" fill="#2b2350">键 丁</text><path d="M184 95H322" stroke="#4a8f7a" stroke-width="3"/><polygon points="322,95 312,89 312,101" fill="#4a8f7a"/><path d="M184 179H322" stroke="#4a8f7a" stroke-width="3"/><polygon points="322,179 312,173 312,185" fill="#4a8f7a"/><path d="M184 287H322" stroke="#4a8f7a" stroke-width="3"/><polygon points="322,287 312,281 312,293" fill="#4a8f7a"/><text x="70" y="232" font-size="14" fill="#5a5480">键 丙 也算出 0</text></svg>`, caption: "桶数固定时，两个键撞进同一个桶就是冲突，链上多挂一个节点即可。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "以为哈希表永远 O(1)。那只是平均情况，冲突多、桶太少时会退化成线性。",
            "用可变对象当字典的键。Python 要求键可哈希，列表这类可变对象不行。",
            "指望字典保持插入顺序以外的顺序。需要按大小遍历时，得自己排序。",
            "把哈希函数写得太简单。直接取字符串长度当哈希，几乎所有键都会挤进几个桶。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用字典统计一段文本里每个字符出现的次数，再按次数从大到小打印前三个。",
            "手写一个简单哈希函数，把五个字符串映射到四个桶，记录每个桶里落了几项。",
            "用两个列表实现一个简易哈希表，说明为什么删除元素比插入更麻烦。"
          ]},
          { t: "tip", color: "green", text: "一句话：哈希表用哈希函数把键换成下标，查找快是以牺牲顺序和额外内存换来的。" }
        ]
      },
      {
        id: "al08",
        title: "第 8 课 · 排序入门：冒泡与插入",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：手写冒泡排序，看清相邻元素怎么交换，并用提前退出的标记让有序数据只扫一轮。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "冒泡排序每一轮从头扫到尾，比较相邻两个元素，顺序不对就交换。一轮下来，最大的元素被一步步换到末尾，像气泡浮上水面。下一轮只扫前面的部分，因为末尾已经排好。" },
          { t: "p", text: "比较次数的总和大约是 n 乘 n 减一再除以二，属于平方量级。它几乎是最慢的排序之一，但交换过程全摆在眼前，用来理解「有序」是怎么一点点长出来的非常合适。" },
          { t: "p", text: "插入排序换个思路：把左边当成已经排好的牌，每拿起一张新牌，就从右往左找它该待的位置，把比它大的牌依次右移一格，再把新牌放进去。手里的牌始终有序。" },
          { t: "p", text: "两种排序都是原地排序，不需要额外的大块空间，代码短、常数小。数据量几千以内它们并不慢；真正的短板在量级，规模上去之后必须换成更快的办法。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "你能在几十行内把一份名单排好，也能在调试更复杂的排序时拿它们做对照：结果不一致，就用几个数一步步打印中间状态，很快能定位是哪一步错了。" },
          { t: "h2", text: "演示：冒泡排序" },
          { t: "p", text: "外层控制每一轮的终点，内层负责相邻比较。加一个 swapped 标记，某一轮一次交换都没发生，说明已经有序，直接跳出。" },
          { t: "code", lang: "python", code: `def bubble_sort(nums):
    data = list(nums)
    for end in range(len(data) - 1, 0, -1):
        swapped = False
        for i in range(end):
            if data[i] > data[i + 1]:
                data[i], data[i + 1] = data[i + 1], data[i]
                swapped = True
        if not swapped:
            break
    return data

print(bubble_sort([4, 1, 3, 2]))
print(bubble_sort([1, 2, 3, 4]))` },
          { t: "p", text: "第一个输出 [1, 2, 3, 4]，第二个也是，但第二个只扫一轮就退出。想把过程看清楚，可以在每轮结束时打印 data，观察最大的数怎么一步步挪到末尾。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="24" y="16" width="592" height="248" rx="14" fill="#f3f0ff"/><text x="320" y="46" font-size="19" font-weight="700" text-anchor="middle" fill="#2b2350">冒泡：相邻比较，逆序就交换</text><rect x="70" y="170" width="64" height="80" rx="6" fill="#ded6ff" stroke="#4a3f9e" stroke-width="2"/><rect x="152" y="230" width="64" height="20" rx="6" fill="#ded6ff" stroke="#4a3f9e" stroke-width="2"/><rect x="234" y="190" width="64" height="60" rx="6" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><rect x="316" y="210" width="64" height="40" rx="6" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><rect x="398" y="150" width="64" height="100" rx="6" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><text x="102" y="212" font-size="18" text-anchor="middle" fill="#2b2350">4</text><text x="184" y="247" font-size="18" text-anchor="middle" fill="#2b2350">1</text><text x="266" y="222" font-size="18" text-anchor="middle" fill="#2b2350">3</text><text x="348" y="236" font-size="18" text-anchor="middle" fill="#2b2350">2</text><text x="430" y="200" font-size="18" text-anchor="middle" fill="#2b2350">5</text><line x1="60" y1="250" x2="490" y2="250" stroke="#6b5bd2" stroke-width="2"/><text x="102" y="272" font-size="14" text-anchor="middle" fill="#5a5480">下标 0</text><text x="184" y="272" font-size="14" text-anchor="middle" fill="#5a5480">下标 1</text><text x="500" y="130" font-size="15" fill="#2b2350">高亮的一对</text><text x="500" y="154" font-size="15" fill="#2b2350">正在比较</text><text x="500" y="190" font-size="15" fill="#8c3e66">4 比 1 大</text><text x="500" y="214" font-size="15" fill="#8c3e66">交换位置</text></svg>`, caption: "每一轮只比较相邻两个数，把大的往右推，一轮结束最右端就定了。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "内层循环的边界写成 len(data)。会访问到 i 加一，越界报错；边界要随轮数收缩。",
            "忘了写提前退出。已经有序的数据仍然白扫 n 轮，白白浪费。",
            "直接在传入的列表上交换。想要保留原数据就先复制一份，否则调用方会看到被改动。",
            "以为冒泡和插入效果一样。随机数据差不多，接近有序时插入排序要快得多。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "给冒泡排序加上每轮打印，写出 [4, 1, 3, 2] 三轮之后数组的样子。",
            "把冒泡排序改成从大到小排序，只改一处比较符号，说明改的是哪一个。",
            "用插入排序排同样五个乱序数字，数一数总共移动了几次，和冒泡的交换次数比一比。"
          ]},
          { t: "tip", color: "green", text: "一句话：冒泡每轮把最大值推到末尾，插入每次把新牌插进有序区，两者都是平方量级的入门排序。" }
        ]
      },
      {
        id: "al09",
        title: "第 9 课 · 分治排序：归并与快速",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：看清分治的拆开、分别处理、合并三步，并亲手写出归并的合并段与快排的划分段。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "分治的思路是：一个大问题拆成两个规模差不多的小问题，分别解决，再把结果拼起来。排序里，一直拆到只剩一个元素时天然有序，剩下的工作全在怎么拼回去。" },
          { t: "p", text: "归并排序从中间切开，左右各自排好，再用两个指针从头比较，谁小就先取谁，合并成一个有序段。合并两段有序数据只需要线性时间，总耗时是 n 乘 log n。" },
          { t: "p", text: "快速排序选一个基准值，把比它小的放左边，大的放右边，这一步叫划分。划分完成后基准值落在最终位置，再对左右两段重复同样的动作，直到每段只剩一个元素。两者的平均量级都是 n log n，比平方量级快得多；归并要多一块临时空间，快排原地交换，但基准选得不好会退化。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "数据上万之后，平方量级的排序开始吃力，换成这两个思路就能顶住；理解划分还能帮你解决「找出第 k 小的元素」这类不需要完整排序的问题。" },
          { t: "h2", text: "演示 1 · 合并两个有序段" },
          { t: "p", text: "两个指针分别指向左右两段开头，每次取较小的一个放进结果，指针后移；一段取完后，把另一段剩下的整体接上。" },
          { t: "code", lang: "python", code: `def merge(left, right):
    out = []
    i = 0
    j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            out.append(left[i])
            i += 1
        else:
            out.append(right[j])
            j += 1
    return out + left[i:] + right[j:]

print(merge([2, 5], [1, 8]))` },
          { t: "p", text: "输出 [1, 2, 5, 8]。这段代码是归并排序的核心，左右两半各自排好后反复调用它，整个列表就有序了。函数调用自己的写法后面单独一课会讲。" },
          { t: "h2", text: "演示 2 · 划分" },
          { t: "p", text: "取最后一个元素当基准，用 i 记录「小于基准区」的右边界。扫描时遇到比基准小的元素，就把它换到边界处，边界右移一格。" },
          { t: "code", lang: "python", code: `def partition(nums, low, high):
    pivot = nums[high]
    i = low
    for j in range(low, high):
        if nums[j] < pivot:
            nums[i], nums[j] = nums[j], nums[i]
            i += 1
    nums[i], nums[high] = nums[high], nums[i]
    return i

data = [5, 3, 8, 1, 4]
print(partition(data, 0, 4))
print(data)` },
          { t: "p", text: "返回的下标是基准值 4 的最终位置，此时它左边的数都小于 4，右边的数都大于等于 4。左右两段再各自划分一次，整段就有序了。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="24" y="12" width="592" height="278" rx="14" fill="#f3f0ff"/><text x="320" y="42" font-size="19" font-weight="700" text-anchor="middle" fill="#2b2350">归并：两段各有指针，每次取较小值</text><text x="60" y="80" font-size="15" fill="#5a5480">左段已有序</text><rect x="60" y="90" width="58" height="44" rx="6" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><text x="89" y="118" font-size="17" text-anchor="middle" fill="#2b2350">2</text><rect x="122" y="90" width="58" height="44" rx="6" fill="#ded6ff" stroke="#4a3f9e" stroke-width="2"/><text x="151" y="118" font-size="17" text-anchor="middle" fill="#2b2350">5</text><text x="420" y="80" font-size="15" fill="#5a5480">右段已有序</text><rect x="420" y="90" width="58" height="44" rx="6" fill="#ded6ff" stroke="#4a3f9e" stroke-width="2"/><text x="449" y="118" font-size="17" text-anchor="middle" fill="#2b2350">1</text><rect x="482" y="90" width="58" height="44" rx="6" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><text x="511" y="118" font-size="17" text-anchor="middle" fill="#2b2350">8</text><path d="M158 138L266 170" stroke="#8a84a8" stroke-width="2"/><path d="M484 138L378 170" stroke="#8a84a8" stroke-width="2"/><polygon points="320,146 384,180 320,214 256,180" fill="#ded6ff" stroke="#4a3f9e" stroke-width="2"/><text x="320" y="185" font-size="14" text-anchor="middle" fill="#2b2350">取较小</text><path d="M320 216V232" stroke="#4a8f7a" stroke-width="3"/><polygon points="320,236 314,226 326,226" fill="#4a8f7a"/><rect x="178" y="240" width="58" height="42" rx="6" fill="#ffffff" stroke="#4a8f7a" stroke-width="2"/><text x="207" y="267" font-size="17" text-anchor="middle" fill="#2b2350">1</text><rect x="240" y="240" width="58" height="42" rx="6" fill="#ffffff" stroke="#4a8f7a" stroke-width="2"/><text x="269" y="267" font-size="17" text-anchor="middle" fill="#2b2350">2</text><rect x="302" y="240" width="58" height="42" rx="6" fill="#ffffff" stroke="#4a8f7a" stroke-width="2"/><text x="331" y="267" font-size="17" text-anchor="middle" fill="#2b2350">5</text><rect x="364" y="240" width="58" height="42" rx="6" fill="#ffffff" stroke="#4a8f7a" stroke-width="2"/><text x="393" y="267" font-size="17" text-anchor="middle" fill="#2b2350">8</text><text x="120" y="268" font-size="15" fill="#2b2350">结果</text></svg>`, caption: "两段各自有序，合并时只比较两个指针所指的元素，一次搬一个。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "合并时漏掉剩余元素。一段先取完，另一段剩下的必须整体接上。",
            "比较写成严格小于。相等元素会因此改变相对次序，归并就不再稳定。",
            "划分时把基准也放进比较范围。循环应在 high 之前停下，基准最后单独归位。",
            "以为快排永远更快。基准取到极值时，每次划分只减少一个元素，会退化成平方量级。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 merge 函数把 [1, 4, 9] 和 [2, 3, 10] 合并，手算每一步两个指针的位置。",
            "把 partition 改成以第一个元素为基准，说明需要改动哪几行。",
            "给定 [3, 1, 4, 1, 5]，写出第一次划分后的数组和返回的下标。"
          ]},
          { t: "tip", color: "green", text: "一句话：分治把大排序拆成小排序，归并的功夫在合并，快排的功夫在划分，平均都是 n log n。" }
        ]
      },
      {
        id: "al10",
        title: "第 10 课 · 二分查找",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：在有序列表上用折半的方式查数，把最坏情况的比较次数从 n 次压到 log n 次。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "二分查找的前提是列表有序。每次取中间元素和目标比较：相等就返回；目标更大，说明答案只可能在右半；目标更小，答案只可能在左半。每比较一次，候选范围就少一半。" },
          { t: "p", text: "n 个元素最多比较 log2(n) 再加一次。一千个元素最多十次左右，一百万个最多二十次。这个增长速度极慢，所以数据量越大，二分相对线性查找的优势越明显。查一次只要几毫秒，在线性查找那里可能要几秒，百万级数据上这就是能不能用的差别。" },
          { t: "p", text: "边界是两个下标 low 和 high。循环条件是 low 不大于 high；更新时必须是 mid 加一或 mid 减一，否则范围不再缩小，程序会在原地打转。把这两个下标画在纸上，mid 的位置一目了然。" },
          { t: "p", text: "代价是必须先排序。只查一次的话，排完再二分不如直接线性扫一遍；如果要在同一份数据上反复查很多次，排序的一次性成本很快就被摊平。所以二分的正确用法是：先排一次序，再在同一份数据上反复查。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "查字典、按时间找日志、在配置表里找最接近的档位，都属于「有序数据上反复查找」，二分是标准答案。标准库里的 bisect 模块就是二分的现成实现，前提同样是数据有序。" },
          { t: "h2", text: "演示：手写二分" },
          { t: "p", text: "函数返回下标，找不到返回 -1。三次调用分别命中最右端、命中中间、查一个不存在的值，覆盖三种主要分支。" },
          { t: "code", lang: "python", code: `def binary_search(nums, target):
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

data = [1, 3, 5, 7, 9]
print(binary_search(data, 9), binary_search(data, 5), binary_search(data, 4))` },
          { t: "p", text: "输出 4、2、-1。在循环里加一句打印 low、high、mid，能看到区间每次怎么收缩；这是理解二分最快的方式，比盯着代码想有效得多。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250"><rect x="24" y="12" width="592" height="226" rx="14" fill="#f3f0ff"/><text x="320" y="42" font-size="19" font-weight="700" text-anchor="middle" fill="#2b2350">二分：看中间，砍一半</text><rect x="60" y="62" width="58" height="48" rx="6" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><rect x="126" y="62" width="58" height="48" rx="6" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><rect x="192" y="62" width="58" height="48" rx="6" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><rect x="258" y="62" width="58" height="48" rx="6" fill="#ded6ff" stroke="#4a3f9e" stroke-width="2"/><rect x="324" y="62" width="58" height="48" rx="6" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><rect x="390" y="62" width="58" height="48" rx="6" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><rect x="456" y="62" width="58" height="48" rx="6" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><rect x="522" y="62" width="58" height="48" rx="6" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><text x="89" y="93" font-size="17" text-anchor="middle" fill="#2b2350">1</text><text x="155" y="93" font-size="17" text-anchor="middle" fill="#2b2350">3</text><text x="221" y="93" font-size="17" text-anchor="middle" fill="#2b2350">5</text><text x="287" y="93" font-size="17" text-anchor="middle" fill="#2b2350">7</text><text x="353" y="93" font-size="17" text-anchor="middle" fill="#2b2350">9</text><text x="419" y="93" font-size="17" text-anchor="middle" fill="#2b2350">11</text><text x="485" y="93" font-size="17" text-anchor="middle" fill="#2b2350">13</text><text x="551" y="93" font-size="17" text-anchor="middle" fill="#2b2350">15</text><path d="M287 114V136" stroke="#4a3f9e" stroke-width="2"/><text x="287" y="154" font-size="15" text-anchor="middle" fill="#4a3f9e">mid</text><line x1="324" y1="172" x2="580" y2="172" stroke="#b05a86" stroke-width="3"/><line x1="324" y1="164" x2="324" y2="180" stroke="#b05a86" stroke-width="3"/><line x1="580" y1="164" x2="580" y2="180" stroke="#b05a86" stroke-width="3"/><text x="452" y="200" font-size="15" text-anchor="middle" fill="#8c3e66">目标更大，只留右半</text><text x="120" y="200" font-size="15" fill="#5a5480">左半丢弃</text><text x="320" y="228" font-size="15" text-anchor="middle" fill="#2b2350">候选范围每轮减半</text></svg>`, caption: "中间值比目标小，左半连同 mid 一起丢掉，下一步只看右半。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "在无序数据上用二分。前提不成立，结果会随机地错，而且很难发现。",
            "循环条件写成 low 小于 high。会漏掉区间里只剩一个元素的情况。",
            "更新边界时写成 low = mid。范围可能原地不动，循环无法结束。",
            "用 (low + high) / 2 得到浮点数。Python 要用 // 取整，其他语言还要防溢出。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "在 [2, 4, 6, 8, 10, 12] 上手工模拟查找 10，写出每轮的 low、mid、high。",
            "把函数改成查找目标第一次出现的位置，输入含重复值的有序列表验证。",
            "统计二分和线性查找各比较了多少次，在 1 到 1000 的有序表里查 999，记录结果。"
          ]},
          { t: "tip", color: "green", text: "一句话：二分靠有序这个前提，每轮砍掉一半，代价是先排序，收益是查找从 n 次降到 log n 次。" }
        ]
      },
      {
        id: "al11",
        title: "第 11 课 · 递归",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：写出带终止条件的递归函数，并看清每次调用在调用栈上留下了什么。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "递归是函数在自己的函数体里调用自己。要让它停下来，必须有终止条件：规模小到可以直接回答时，就返回结果，不再往下调用。没有这一条，程序会一直往下走，直到栈被压满。终止条件通常对应问题的最小规模，比如空列表、零、一棵空树。" },
          { t: "p", text: "每次调用都把参数、局部变量和返回地址压到调用栈上，返回时再一层层弹出。所以递归的深度就是栈的深度，层数太多会栈溢出，Python 默认上限在一千层左右。" },
          { t: "p", text: "写递归只问两件事：最小的情况怎么答；规模为 n 的问题，能不能用规模更小的同类问题的答案拼出来。这两件事写清楚，展开的过程交给计算机，不用在脑子里跟完每一层。" },
          { t: "p", text: "递归和循环能互相改写。阶乘、斐波那契、目录遍历、树的遍历都适合递归；但同样的子问题被反复计算时，要加缓存或改成循环，否则调用次数会指数级膨胀。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "你能把「处理一棵树」「拆开一个嵌套结构」这类问题写成几行干净的代码，而不是手写一堆栈和下标。读别人写的解析器、遍历器时，也能顺着递归结构看下去。" },
          { t: "h2", text: "演示：阶乘与倒数" },
          { t: "p", text: "factorial 的终止条件是 n 不大于 1，count_down 的终止条件是 n 等于 0。两个函数都在每次调用时把规模减一，保证最终能碰到终止条件。" },
          { t: "code", lang: "python", code: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

def count_down(n):
    if n == 0:
        return []
    return [n] + count_down(n - 1)

print(factorial(5))
print(count_down(4))` },
          { t: "p", text: "factorial(5) 展开成 5 乘 4 乘 3 乘 2 乘 1，返回 120。count_down(4) 返回 [4, 3, 2, 1]，注意列表是在一层层返回的路上拼起来的，最先完成的是最内层。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 290"><rect x="24" y="12" width="592" height="266" rx="14" fill="#f3f0ff"/><text x="320" y="42" font-size="19" font-weight="700" text-anchor="middle" fill="#2b2350">factorial(3) 的调用栈</text><rect x="56" y="62" width="300" height="58" rx="8" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><text x="76" y="88" font-size="16" fill="#2b2350">factorial(3)</text><text x="76" y="110" font-size="14" fill="#5a5480">还要 3 × 下一层的结果</text><rect x="56" y="128" width="300" height="58" rx="8" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><text x="76" y="154" font-size="16" fill="#2b2350">factorial(2)</text><text x="76" y="176" font-size="14" fill="#5a5480">还要 2 × 下一层的结果</text><rect x="56" y="194" width="300" height="58" rx="8" fill="#ded6ff" stroke="#4a3f9e" stroke-width="2"/><text x="76" y="220" font-size="16" fill="#2b2350">factorial(1)</text><text x="76" y="242" font-size="14" fill="#2b2350">终止条件，直接返回 1</text><path d="M392 92V188" stroke="#b05a86" stroke-width="3"/><polygon points="392,192 386,182 398,182" fill="#b05a86"/><text x="404" y="142" font-size="15" fill="#8c3e66">调用向下压栈</text><path d="M540 196V96" stroke="#4a8f7a" stroke-width="3"/><polygon points="540,92 534,102 546,102" fill="#4a8f7a"/><text x="552" y="142" font-size="15" fill="#2f6b59">返回向上弹栈</text><text x="56" y="272" font-size="15" fill="#2b2350">回到最外层得到 3 × 2 × 1 = 6</text></svg>`, caption: "每层调用都停在自己那行乘法上，等下一层返回后才继续算。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "忘了写终止条件。递归会一直往下调用，最后抛出递归深度超限的错误。",
            "终止条件写错，无法被触发。比如用 n 等于 0 判断，但每次减二。",
            "以为递归比循环快。函数调用有开销，深度大时循环通常更划算。",
            "用朴素递归算斐波那契。同一个值被反复展开，n 稍大就要等很久。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "写出递归版的求列表元素之和，终止条件是空列表返回 0，并用三组数据验证。",
            "画出 factorial(4) 的调用过程，标出每一层压栈和弹栈的先后顺序。",
            "把阶乘改成循环版本，比较两个版本在 n 等于 900 时的表现并解释差异。"
          ]},
          { t: "tip", color: "green", text: "一句话：递归就是终止条件加规模缩小，每层调用在栈上留一帧，返回时再一层层收回来。" }
        ]
      },
      {
        id: "al12",
        title: "第 12 课 · 树与图入门",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：认识树的分叉结构和图的连接关系，写出一棵二叉查找树的插入与中序遍历。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "树由节点和边组成，每个节点最多有一个父节点，最上面那个叫根，没有子节点的叫叶子。二叉树每个节点最多两个孩子，分别叫左孩子和右孩子，画出来就是不断分叉的形状。" },
          { t: "p", text: "二叉查找树额外要求：左子树上的值都小于节点，右子树上的值都大于节点。查找时每比较一次就能排除一整棵子树，理想情况下深度是 log n，查找和插入都很快。" },
          { t: "p", text: "图比树更一般：节点之间可以任意连接，可以有环，边还可以带方向。树其实是「没有环、连成一片」的特殊图。画图时先看有没有环，就能判断它是不是树。" },
          { t: "p", text: "遍历有深度优先与广度优先两大路子。深度优先顺着一条路走到底再回头，中序遍历二叉查找树能从小到大输出；广度优先一层层扫，用队列保存待访问的节点。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "文件目录、表达式、网页的节点结构都是树；社交关系、地图路线、任务依赖都是图。能把问题画成树或图，往往就已经找到一半解法，剩下的只是照着图写遍历。" },
          { t: "h2", text: "演示：建一棵小树并中序遍历" },
          { t: "p", text: "先是插入：按大小决定往左还是往右，遇到空位就建一个新节点。再把节点画出来看形状，最后用中序把值取出来。" },
          { t: "code", lang: "python", code: `def insert(node, value):
    if node is None:
        return {"value": value, "left": None, "right": None}
    side = "left" if value < node["value"] else "right"
    node[side] = insert(node[side], value)
    return node` },
          { t: "code", lang: "python", code: `def inorder(node, out):
    if node is None:
        return out
    inorder(node["left"], out)
    out.append(node["value"])
    inorder(node["right"], out)
    return out

root = None
for v in [5, 3, 8, 1]:
    root = insert(root, v)
print(inorder(root, []))` },
          { t: "p", text: "输出 [1, 3, 5, 8]。中序的顺序是先左子树、再自己、最后右子树，对二叉查找树来说，这个顺序恰好是从小到大，因此它也被用来检查一棵树有没有建对。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="24" y="12" width="592" height="276" rx="14" fill="#f3f0ff"/><text x="320" y="42" font-size="19" font-weight="700" text-anchor="middle" fill="#2b2350">二叉查找树：左小右大</text><line x1="320" y1="70" x2="200" y2="150" stroke="#6b5bd2" stroke-width="2"/><line x1="320" y1="70" x2="440" y2="150" stroke="#6b5bd2" stroke-width="2"/><line x1="200" y1="150" x2="130" y2="230" stroke="#6b5bd2" stroke-width="2"/><line x1="200" y1="150" x2="270" y2="230" stroke="#6b5bd2" stroke-width="2"/><circle cx="320" cy="70" r="26" fill="#ded6ff" stroke="#4a3f9e" stroke-width="2"/><text x="320" y="77" font-size="17" text-anchor="middle" fill="#2b2350">5</text><circle cx="200" cy="150" r="26" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><text x="200" y="157" font-size="17" text-anchor="middle" fill="#2b2350">3</text><circle cx="440" cy="150" r="26" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><text x="440" y="157" font-size="17" text-anchor="middle" fill="#2b2350">8</text><circle cx="130" cy="230" r="26" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><text x="130" y="237" font-size="17" text-anchor="middle" fill="#2b2350">1</text><circle cx="270" cy="230" r="26" fill="#ffffff" stroke="#6b5bd2" stroke-width="2"/><text x="270" y="237" font-size="17" text-anchor="middle" fill="#2b2350">4</text><text x="240" y="112" font-size="14" fill="#5a5480">左</text><text x="390" y="112" font-size="14" fill="#5a5480">右</text><text x="60" y="164" font-size="14" fill="#5a5480">都小于 5</text><text x="490" y="164" font-size="14" fill="#5a5480">都大于 5</text><text x="320" y="282" font-size="15" text-anchor="middle" fill="#2b2350">中序输出：1 → 3 → 4 → 5 → 8</text></svg>`, caption: "每个节点左边的值都更小、右边的值都更大，中序遍历就得到升序结果。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把插入顺序当成无所谓。有序数据依次插入会让树退化成一条链，深度变成 n。",
            "中序遍历写成先访问自己。输出就不再是升序，检查树时会被这个错误误导。",
            "以为树一定有根且只有一个。图可以没有明确的根，也可以有多个连通块。",
            "用列表存图的关系却忘了双向。无向图的每条边要往两个方向都记一次。",
            "遍历时不记录已访问的节点。图里有环，程序会在环上无限绕圈。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "依次插入 6、2、9、1、4，画出这棵二叉查找树并写出中序遍历的结果。",
            "给树加一个 height 函数，返回树的高度，用只有根和空树两种情况验证终止条件。",
            "用字典表示一个无向图，写出节点 A 的所有邻居，并说明每条边为什么要存两次。"
          ]},
          { t: "tip", color: "green", text: "一句话：树是分层分叉的结构，二叉查找树靠左小右大换查找速度，图则用边描述任意连接。" }
        ]
      }
    ]
  }
};
