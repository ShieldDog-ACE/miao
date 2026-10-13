/* 喵站 · C++ 掌握 正文分部 p18：第 145–148 课（第九轮）
 *
 * 源稿：145_枚举就是全试一遍.cpp、146_砍掉一层循环.cpp、147_模拟报数跳7.cpp、148_方向数组格子行走.cpp
 * 这四课是「自己写算法」的第一组：穷举、剪枝、模拟、方向数组。前面 60 多课教的零件在这里第一次成套派上用场。
 * 写法照 p10：讲「为什么这么想」，不只讲「语法长这样」；所有输出与计数都经本机 g++ -std=c++23 实跑核对。
 */
window.MIAO_CPPM_P18 = {
  chapters: [
    {
      id: `m145`, title: `第 145 课 · 枚举就是全试一遍：把每个候选都问一次，答案自己站出来`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：搭起「范围 + 拆位 + 判定」这三件套，把有限个候选挨个试一遍，并且能说清自己到底试了多少次、为什么是这个数。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `枚举还有个更直白的名字叫**穷举**：想不出聪明办法的时候，就把名单上每一个候选都敲一次门，总有一个会开门。它不是没办法的办法，它是有前提的办法，前提有两条 —— **候选总数有限**，以及**拿到任意一个候选，你能立刻判定它对不对**。这两条只要立不住，穷举就不是解题而是烧机器。` },
        { t: `p`, text: `源稿的例子是三位数里的水仙花数：各个数位上的数字立方相加，结果还等于自己。答案不知道在哪儿，但候选就摆在那儿：**100 到 999，一共 900 个**。于是要解决的其实只有两件事 —— 怎么把每个候选取出来，以及怎么把一个候选**拆成数字**。` },
        { t: `p`, text: `拆位这一手是第 8 课的整除和第 9 课的取余第一次联手：**整除砍掉低位，取余留下低位**。153 这个数，n / 100 就是 1，n % 10 就是 3，中间的十位要两步走 —— 先除以 10 把个位挤掉，再对 10 取余把高位砍掉，写成 n / 10 % 10。这套拆法记牢，以后处理数字全靠它。` },
        { t: `code`, lang: `text`, code: `百位  a = n / 100            ← 除以 100，小数部分直接扔掉：153 → 1
十位  b = n / 10 % 10        ← 先挤掉个位再取余：153 → 15 → 5
个位  c = n % 10             ← 只留最后一位：153 → 3
判定  a*a*a + b*b*b + c*c*c == n   ← 三个立方加起来还等于自己吗` },
        { t: `p`, text: `再看一下范围那句怎么写：for (int n = 100; n < 1000; ++n)。上界写 **n 小于 1000** 而不是 n 小于等于 999，两个数一样大，但前者讲的是「三位数的边界」，后者讲的是「最大的三位数」，写代码的人在数候选个数时更容易差一个。这不是语法问题，是**你在跟谁说话**的问题：下一行要数次数时，1000 减 100 等于 900 一眼就出来。` },
        { t: `p`, text: `顺带说一个名字的巧合：本课也正是 C++ 的 enum 关键字第一次出场的地方，它管的是另一件事 —— 把一个类型**能取的全部值列成一排名字**。枚举法是本课的正事，100 到 999 这 900 个候选挨个试；枚举类型是语法上的邻居，花色只有四种，名字先起好。两个说法都叫「把所有可能列出来」，区别在列完之后：一个拿去试，一个拿去用。` },
        { t: `code`, lang: `c++`, code: `enum Suit { Club, Diamond, Heart, Spade };   // 全部可能就这四个名字` },
        { t: `svg`, caption: `枚举的机器只有三个工位：取候选、拆位、判定。判定为真才打印，为假就把这个候选扔掉；跑一整趟的次数由范围说了算 —— 三位数这趟是 900 次`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 288">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">900 个候选排成一排，每个都过一遍判定</text>
  <g font-size="12" fill="#26405a">
    <rect x="16" y="36" width="118" height="34" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
    <text x="75" y="57" text-anchor="middle">取候选 n</text>
    <path d="M138 53 H166" stroke="#57677c" stroke-width="2.5"/><polygon points="166,53 156,47 156,59" fill="#57677c"/>
    <rect x="172" y="36" width="130" height="34" rx="8" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/>
    <text x="237" y="52" text-anchor="middle">拆位</text>
    <text x="237" y="66" text-anchor="middle">a = n/100，b、c</text>
    <path d="M306 53 H334" stroke="#57677c" stroke-width="2.5"/><polygon points="334,53 324,47 324,59" fill="#57677c"/>
    <rect x="340" y="36" width="150" height="34" rx="8" fill="#f2e9fb" stroke="#6b3fa0" stroke-width="2"/>
    <text x="415" y="57" text-anchor="middle">立方和 == n 吗</text>
    <path d="M494 45 H524" stroke="#1d7a3c" stroke-width="2.5"/><polygon points="524,45 514,39 514,51" fill="#1d7a3c"/>
    <rect x="530" y="30" width="94" height="28" rx="8" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/>
    <text x="577" y="49" text-anchor="middle">真：打印</text>
    <path d="M494 62 H524" stroke="#b8500f" stroke-width="2.5"/><polygon points="524,62 514,56 514,68" fill="#b8500f"/>
    <rect x="530" y="60" width="94" height="28" rx="8" fill="#fdece1" stroke="#b8500f" stroke-width="1.5"/>
    <text x="577" y="79" text-anchor="middle">假：扔掉</text>

    <text x="16" y="102" font-weight="700">范围一划，候选就分成 9 排，每排 100 个</text>
    <g>
      <rect x="76" y="112" width="200" height="12" rx="3" fill="#e8eef8" stroke="#8b98ab" stroke-width="1"/>
      <rect x="76" y="128" width="200" height="12" rx="3" fill="#e8eef8" stroke="#8b98ab" stroke-width="1"/>
      <rect x="76" y="144" width="200" height="12" rx="3" fill="#e8eef8" stroke="#8b98ab" stroke-width="1"/>
      <rect x="76" y="160" width="200" height="12" rx="3" fill="#e8eef8" stroke="#8b98ab" stroke-width="1"/>
      <rect x="76" y="176" width="200" height="12" rx="3" fill="#e8eef8" stroke="#8b98ab" stroke-width="1"/>
      <rect x="76" y="192" width="200" height="12" rx="3" fill="#e8eef8" stroke="#8b98ab" stroke-width="1"/>
      <rect x="76" y="208" width="200" height="12" rx="3" fill="#e8eef8" stroke="#8b98ab" stroke-width="1"/>
      <rect x="76" y="224" width="200" height="12" rx="3" fill="#e8eef8" stroke="#8b98ab" stroke-width="1"/>
      <rect x="76" y="240" width="200" height="12" rx="3" fill="#e8eef8" stroke="#8b98ab" stroke-width="1"/>
      <text x="16" y="122">百位 1</text>
      <text x="16" y="250">百位 9</text>
      <rect x="178" y="112" width="12" height="12" fill="#1d7a3c"/>
      <rect x="214" y="144" width="12" height="12" fill="#1d7a3c"/>
      <rect x="220" y="144" width="12" height="12" fill="#1d7a3c"/>
      <rect x="226" y="208" width="12" height="12" fill="#1d7a3c"/>
      <text x="290" y="122" fill="#1d7a3c">← 153 在这一格</text>
      <text x="290" y="154" fill="#1d7a3c">← 370、371 挨着</text>
      <text x="290" y="218" fill="#1d7a3c">← 407 在这一格</text>
    </g>
    <rect x="380" y="106" width="244" height="150" rx="8" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1"/>
    <text x="396" y="130" fill="#33465e" font-weight="700">这一趟的账</text>
    <text x="396" y="154">候选个数：900</text>
    <text x="396" y="174">判定次数：900</text>
    <text x="396" y="194">命中个数：4</text>
    <text x="396" y="216">153 370 371 407</text>
    <text x="396" y="240" fill="#b8500f">没命中也要把 900 次跑完</text>
    <text x="16" y="276" fill="#00599c" font-weight="700">穷举的本钱全在「判定」那一步：它会就快，它笨就整趟都笨。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `枚举干的事，是把一道**找**的题换成一道**验**的题。找很难 —— 你没法从 153 这个答案倒推出去哪儿找它；验很容易 —— 随便塞给你 407，拆三位、立方相加、比一下，两秒钟的活儿。凡是「答案验起来便宜、找起来贵」的题，都能用穷举兜底，这也是为什么它是最可靠的办法：**它不依赖你想到点子上。**` },
        { t: `p`, text: `代价也明明白白写在纸上：总开销 = 候选个数 × 单次判定成本。这两项里任何一项失控，程序就慢。本课先学会**把这两项数出来** —— 水仙花数这趟是 900 次候选、每次三个立方和；下一课要动的是第一项，把 900 那个量级往下砍。` },
        { t: `h2`, text: `演示 1 · 源稿这段：三位数里捞水仙花数` },
        { t: `code`, lang: `c++`, code: `#include <print>

int main() {
    for (int n = 100; n < 1000; ++n) {          // 三位数挨个试
        int a = n / 100;                        // 百位：153 → 1
        int b = n / 10 % 10;                    // 十位：153 → 5
        int c = n % 10;                         // 个位：153 → 3
        if (a*a*a + b*b*b + c*c*c == n)         // 各位立方和 = 自己？
            std::println("找到水仙花数：{}", n);
    }
    return 0;
}` },
        { t: `p`, text: `实测四行，顺序是从小到大：找到水仙花数：153、370、371、407。这一趟循环体执行 900 次，命中 4 次 —— 也就是说 896 次白跑，但白跑不是失败：**把不对的候选排除掉，正是穷举在干活。**` },
        { t: `h2`, text: `演示 2 · 把范围挪到 0 到 999，答案反而多出两个` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int tries = 0, hits = 0;
    for (int n = 0; n < 1000; ++n) {        // 边界一挪，候选从 900 个变 1000 个
        ++tries;
        int a = n / 100, b = n / 10 % 10, c = n % 10;
        if (a*a*a + b*b*b + c*c*c == n) { ++hits; std::println("命中 {}", n); }
    }
    std::println("试了 {} 个，中 {} 个", tries, hits);
}` },
        { t: `p`, text: `实测六行命中加一行总结：0、1、153、370、371、407，然后 试了 1000 个，中 6 个。多出来的 0 和 1 不是 bug —— 拆位时 n / 100 得 0，等于给这个数补了**前导零**，而 0 的立方还是 0、1 的立方还是 1，判定条件照样成立。所以题目说「三位数」，范围就得从 100 起：**边界是题意的一部分，不是随手填的两个数。**` },
        { t: `h2`, text: `演示 3 · 本课任务：枚举 1 到 1000 里的完数` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    for (int n = 1; n <= 1000; ++n) {
        int s = 0;
        for (int d = 1; d < n; ++d)         // 真因子：不含自己
            if (n % d == 0) s += d;
        if (s == n) std::println("完数：{}", n);
    }
}` },
        { t: `p`, text: `实测三行：完数：6、完数：28、完数：496。6 的真因子是 1、2、3，加起来正好 6；28 是 1、2、4、7、14。这一版的候选是外面的 1000 个，每个候选还要跑一遍内层循环去数因子 —— 判定本身变贵了，这就是前面那句「总开销等于两项相乘」的现场版本。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `上界差一个。for 那句写成 n 小于 100 或者 n 小于等于 999 各错一头，前者少试一整排，后者把 1000 也拖进来试一次。这种错**不报错、也不崩**，只是答案少一个或多一个，最坑的是有时候正好不影响本题输出。习惯是先把候选个数算出来再写循环：100 到 999 共 900 个，写完顺手核对一遍。`,
          `拆位拆错列。十位写成 n / 10 是「挤掉个位剩下的部分」，对 153 得 15，不是 5；个位写成 n / 10 更是直接串列。自检办法是拿一个数手算：153 拆出来必须是 1、5、3，写三行 println 先验一遍再往里加判定。`,
          `判定条件里把 == 写成 =。if (a*a*a + b*b*b + c*c*c = n) 在整数之间照样**编译得过**，它把 n 赋进左边然后拿这个值当真假，于是几乎每次都算真，输出 900 行。凡是 if 后面跟着一长串算式，先回头看一眼是不是两个等号。`,
          `忘掉循环体外还要初始化。演示 3 那个 s 必须每个候选都重新从 0 开始：写在 for 里面是每次一个新的 s，写在外面就成了越加越大的流水账，28 以后全都对不上。这个坑很典型 —— 累加器的位置决定它是「本题的账」还是「全场的账」。`,
          `把内层循环的起点写成 0。d 从 0 开始的话，第一句就是 n % 0，取余除数为零是**未定义行为**，实测本机 g++ 跑出来是当场崩掉（浮点异常，核心已转储）。范围下界不是风格问题，除法和取余的除数必须非零。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `枚举 1 到 1000 里的「完数」：真因子之和等于自己，如 6 = 1+2+3。跑出来应当是三个数，把它们和各自的真因子列出来核对。`,
          `给演示 1 加两个计数器，一个数循环体跑了几次、一个数命中几次，确认是 900 和 4；再把范围改成 0 到 999，看两个数字各变成多少。`,
          `延伸一：枚举 100 到 999 里的回文数 —— 百位和个位相同就算，先想清楚要拆几位、判定怎么写。`,
          `延伸二：把拆位那三行包成一个 lambda，参数是 n，返回三个数字的和；然后用它枚举「各位数字之和等于 15」的三位数有多少个。`,
          `延伸三：把候选范围改成 1000 到 9999，试把四位数的每一位都拆出来 —— 想想拆位的套路该怎么推广，别一个个手写成 1000 次除法。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：枚举 = 有限候选 + 会写判定，循环挨个敲门；范围把题意抄进代码，拆位靠整除砍低位、取余留低位；先学会数出「试了多少次」，才有资格谈下一课的少试几次。` }
      ]
    },
    {
      id: `m146`, title: `第 146 课 · 砍掉一层循环：题目给的等式，就是免费的答案`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：看见题目里的等式就动手消变量 —— 把要试的一层改成算出来的一行，并能报出砍之前、砍之后各跑了多少次。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课的账写在两处：**候选个数**乘**单次判定成本**。判定那一项没什么好动的，本课全程在砍前一项。最狠的一刀不是「少试几个」，而是**把一整层循环删掉** —— 前提是你肯承认题目早就告诉过你一句话。` },
        { t: `p`, text: `题目说 a + b + c = 100，正整数解有几组。老实办法是三重循环，a、b、c 各从 1 试到 99，实测里层跑 **970299 次**。可这里有个被忽略的事实：**c 根本不是自由变量。** a 和 b 一旦定下来，c 只能是一个值，别的值全都违犯题目。于是它没必要被试，只需要被算。` },
        { t: `p`, text: `源稿那个类比特别好用：你去买三样东西，知道总价，也知道了其中两样的价钱 —— 第三样是**减出来的**，不是把货架上的价签挨个试出来的。数学上这叫**约束**，代码上它就一行：int c = sum - a - b;。三重变两重，970299 次变成实测的 **4851 次**，两百倍的差距不是编译器给的，是你没让它白跑。` },
        { t: `code`, lang: `text`, code: `砍之前  a 试一遍 × b 试一遍 × c 试一遍     99 × 99 × 99 = 970299 次
                          ↓  题目给了等式 a + b + c = 100
砍之后  a 试一遍 × b 试一遍 × c 减出来      里层只跑 4851 次` },
        { t: `p`, text: `循环条件里还藏着第二刀，刀口小得多但同一套路：内层写成 for (int b = 1; a + b < sum; ++b)，而不是让 b 从 1 跑到 99。理由是**再试下去不可能对** —— a 加 b 已经到 100 了，c 只能是 0 或者负数，正整数解没它份。这一手有个名字叫**剪枝**：不砍答案，只砍「肯定不是答案」的那一片。实测 b 跑满是 9801 次，加了这道闸门是 4851 次，正好是阶梯形状里剩下的那一半格子。` },
        { t: `svg`, caption: `a 与 b 两张名单本来构成 99 × 99 的满方格，条件 a + b 小于 100 只留下左下角那个阶梯状的三角形 —— 被划掉的格子不是没答案，是它们的 c 已经不当正整数了`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 292">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">等式干掉第三维，条件把方格削成阶梯</text>
  <g font-size="12" fill="#26405a">
    <rect x="16" y="38" width="90" height="30" rx="6" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/>
    <text x="61" y="58" text-anchor="middle">a 循环</text>
    <rect x="112" y="38" width="90" height="30" rx="6" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/>
    <text x="157" y="58" text-anchor="middle">b 循环</text>
    <rect x="208" y="38" width="90" height="30" rx="6" fill="#fdece1" stroke="#b8500f" stroke-width="1.5" stroke-dasharray="4 3"/>
    <text x="253" y="58" text-anchor="middle">c 循环</text>
    <line x1="214" y1="64" x2="292" y2="42" stroke="#b8500f" stroke-width="2"/>
    <line x1="214" y1="42" x2="292" y2="64" stroke="#b8500f" stroke-width="2"/>
    <path d="M304 53 H338" stroke="#57677c" stroke-width="2.5"/><polygon points="338,53 328,47 328,59" fill="#57677c"/>
    <rect x="344" y="34" width="130" height="38" rx="6" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/>
    <text x="409" y="50" text-anchor="middle">c = 100 - a - b</text>
    <text x="409" y="66" text-anchor="middle">一行算出来</text>
    <text x="490" y="50">970299 次</text>
    <text x="490" y="66" fill="#1d7a3c" font-weight="700">4851 次</text>

    <text x="16" y="98" font-weight="700">a 从上到下、b 从左到右：白格是白跑，绿格是真跑</text>
    <g>
      <rect x="96" y="110" width="240" height="14" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1"/>
      <rect x="340" y="110" width="16" height="14" fill="#fdece1" stroke="#c9a28b" stroke-width="1"/>
      <rect x="360" y="110" width="16" height="14" fill="#fdece1" stroke="#c9a28b" stroke-width="1"/>
      <rect x="380" y="110" width="16" height="14" fill="#fdece1" stroke="#c9a28b" stroke-width="1"/>
      <rect x="400" y="110" width="16" height="14" fill="#fdece1" stroke="#c9a28b" stroke-width="1"/>
      <text x="60" y="122" text-anchor="end">a = 1</text>

      <rect x="96" y="128" width="220" height="14" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1"/>
      <rect x="320" y="128" width="96" height="14" fill="#fdece1" stroke="#c9a28b" stroke-width="1"/>
      <text x="60" y="140" text-anchor="end">a = 2</text>

      <rect x="96" y="146" width="200" height="14" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1"/>
      <rect x="320" y="146" width="96" height="14" fill="#fdece1" stroke="#c9a28b" stroke-width="1"/>
      <text x="60" y="158" text-anchor="end">a = 3</text>

      <rect x="96" y="164" width="160" height="14" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1"/>
      <rect x="280" y="164" width="136" height="14" fill="#fdece1" stroke="#c9a28b" stroke-width="1"/>
      <text x="60" y="176" text-anchor="end">a = 5</text>

      <rect x="96" y="182" width="80" height="14" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1"/>
      <rect x="200" y="182" width="216" height="14" fill="#fdece1" stroke="#c9a28b" stroke-width="1"/>
      <text x="60" y="194" text-anchor="end">a = 9</text>

      <rect x="96" y="200" width="16" height="14" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1"/>
      <rect x="136" y="200" width="280" height="14" fill="#fdece1" stroke="#c9a28b" stroke-width="1"/>
      <text x="60" y="212" text-anchor="end">a = 98</text>
      <text x="96" y="232">b 从小到大地排开，a 越大，b 能走的越短</text>
    </g>

    <rect x="440" y="100" width="184" height="146" rx="8" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1"/>
    <text x="454" y="122" font-weight="700" fill="#33465e">三本账</text>
    <text x="454" y="144">三重全试：970299</text>
    <text x="454" y="164">两重跑满：9801</text>
    <text x="454" y="184" fill="#1d7a3c">两重带闸门：4851</text>
    <text x="454" y="206">解的个数：4851</text>
    <text x="454" y="228" fill="#b8500f">砍掉的格 4950 个</text>
    <text x="16" y="260" fill="#00599c" font-weight="700">等式值一整层，条件值一小片 —— 先找等式，再抠边界。</text>
    <text x="16" y="282" fill="#33465e">闸门不能砍歪：被划掉的格子里必须一个解都没有，答案才会还是那个答案。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `顺序值得说清，因为多数人反着来。第一步永远是**翻题目**：把题面里的等式、不等式、范围全抄下来，看有没有哪个变量能被别的变量表示出来。能表示出来，就直接删掉一层循环，这是两百倍量级的收益。第二步才轮到**抠边界**：循环上下界能不能收紧、什么时候可以提前收工 —— 这是九千多次到四千八百多次那一档的收益，只有个位数倍。` },
        { t: `p`, text: `有一条底线：**闸门只能砍「肯定不对」的，不能砍「看着不像」的。** a + b 大于等于 sum 时 c 必然不是正整数，这条是逻辑推出来的，砍得；「a 一般比 b 小」这种想当然砍不得，砍了就把 200、375 那种解永远丢掉。` },
        { t: `h2`, text: `演示 1 · 源稿这段：c 用减法算出来` },
        { t: `code`, lang: `c++`, code: `#include <print>

int main() {
    int sum = 100, count = 0;
    for (int a = 1; a < sum; ++a)
        for (int b = 1; a + b < sum; ++b) {     // b 别大到让 a+b 超过 100
            int c = sum - a - b;                // ★ 关键：算出来，不循环
            if (c >= 1) ++count;                // c 是正整数才算一组解
        }
    std::println("a+b+c=100 的正整数解有 {} 组", count);
    return 0;
}` },
        { t: `p`, text: `实测一行：a+b+c=100 的正整数解有 4851 组。顺手在里面加了个计数器，里层循环体正好执行 4851 次 —— 因为每进一次就凑出一组解，一个都没被最后那句检查挡掉。` },
        { t: `p`, text: `这里有个细节值得单独看：那句 if (c >= 1) **此刻永远是成立的**。循环条件已经把 a + b 小于 sum 卡死了，c 减出来必然至少是 1。那它是不是废话？不是 —— 它是给你**放松循环条件那天**准备的保险。实测把条件写成 a + b 小于等于 sum，里层多跑 99 次，那 99 次减出来的 c 正好是 0，全靠这句检查没让它们混进答案。` },
        { t: `h2`, text: `演示 2 · 对照一下：把 c 也循环进去` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int sum = 100, count = 0, tries = 0;
    for (int a = 1; a < sum; ++a)
        for (int b = 1; b < sum; ++b)
            for (int c = 1; c < sum; ++c) {     // c 又变回要试的变量
                ++tries;
                if (a + b + c == sum) ++count;
            }
    std::println("试了 {} 次，解 {} 组", tries, count);
}` },
        { t: `p`, text: `实测：试了 970299 次，解 4851 组。**答案一模一样，代价两百倍。** 这版唯一正确的地方是它没忘了检查，唯一错误的地方是它把题目第一句话忘在了题面上。` },
        { t: `h2`, text: `演示 3 · 本课任务：勾股数组，两个等式叠着用` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int count = 0;
    for (int a = 1; a < 1000; ++a)
        for (int b = 1; a + b < 1000; ++b) {
            int c = 1000 - a - b;               // 还是减法算出来
            if (a*a + b*b == c*c) { ++count; std::println("找到 {} {} {}", a, b, c); }
        }
    std::println("一共 {} 组", count);
}` },
        { t: `p`, text: `实测四行：找到 200 375 425、找到 375 200 425，然后 一共 2 组。两个等式里 a + b + c = 1000 那条用来消 c，剩下的 a² + b² = c² 就是判定条件 —— 这题的本事全在「别把 c 再循环一遍」。` },
        { t: `p`, text: `2 组不是 bug，是**你数的是有序对**：200、375 和 375、200 是同一只三角形却被数了两遍。要「不重复的一组」就把内层起点从 1 改成 a + 1，实测剩 1 组，就是 200、375、425。砍之前先想清楚题目要什么，这比省循环次数更容易出错。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把算出来的变量直接当解，不验范围。c = sum - a - b 什么都有可能减出来：0、负数都算「减出来了」，但不是正整数解。实测把 a、b 的下界从 1 改成 0，答案从 4851 组变成 5050 组 —— 多出的 199 组里全是 0 混进了 a 或 b。题目里「正整数」三个字必须有一条代码去兑。`,
          `以为那句 c >= 1 在干活，就顺手改循环条件。源稿这一版它永远为真，是保险不是闸门。你把 a + b 小于 sum 改成小于等于，甚至改成 b 跑满 1 到 99，答案仍然对，但白跑的次数字会涨：4851、4950、9801 三个数字实测都在那儿。改边界要顺手看一眼里层跑了几次。`,
          `重复计数。a、b 各跑一遍就把 200、375 与 375、200 都算进账。要不要去重取决于题目问的是「有序三元组」还是「一个三角形」，实测差一倍。别在跑完之后才想起来除个 2 —— 遇到 a = b 的情形就会错。`,
          `剪枝砍过头，砍的是「不一定对」而不是「一定不对」。比如看答案里 a 都比 b 小，就把 a 的上界砍到 50：这一题碰巧没丢解，换一道 a 大到 600 的题就整片丢掉。规则只有一条 —— 每一刀都要能说出「这些格子为什么必然不是解」。`,
          `只有等式不用。这题给的是 a + b + c = 100，还有 a² + b² = c²，两条一起用能把三层砍成两层甚至一层；很多同学只抄第一条，第二条留在 if 里当判定，那就白留了。拿到题先把所有限制列成一排，再决定谁进循环、谁进 if、谁被消掉。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `用两重循环求 a² + b² = c² 且 a + b + c = 1000 的勾股数组数，c 仍然由减法算出。跑完再回答：为什么这里出现两个结果、题目要的是几个。`,
          `给演示 1 加一个计数器，实测里层跑了 4851 次；把内层条件从 a + b 小于 sum 改成 b 小于 sum，看次数变成多少、答案变不变，再说清是哪一行在替你挡。`,
          `延伸一：把内层 b 的起点改成 a + 1，重跑演示 3，确认只剩 1 组；然后回答：这一刀砍掉的到底是什么，它凭什么可以砍。`,
          `延伸二：枚举 1 到 999 里能写成两个平方数之和的数，先用等式把要试的量削掉一层，再报出你总共试了多少个候选。`,
          `延伸三：给「a + b + c + d = 100 的正整数解」设计循环层数 —— 别真写四重，用同样的思路想清楚该剩几层、每层边界取到哪。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：题目的等式是免费的答案 —— 能被别的变量表示出来的那个，就不要再用循环去试；先砍层，再抠边界；闸门只砍必然不是解的那一片，砍完的账要数得出来。` }
      ]
    },
    {
      id: `m147`, title: `第 147 课 · 模拟：把游戏规则逐句翻译成代码，你自己就是那台执行机器`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：分清「状态变量」和「推进动作」，把报数跳 7 的规则逐句写成代码，并说清循环条件为什么不许写成人家数到 20。` },
        { t: `p`, text: `前两课都在问「谁是答案」，本课换个问法：**题目给了一个过程，你把过程跑一遍**。这就是模拟 —— 你亲自当规则的执行者，题目说一步该怎么走，代码里就有一步照着推。它跟穷举的脾气正好相反：穷举可以不懂题，只要会验；模拟**必须懂题**，规则里每一条、每一个例外都得翻译成代码，漏一条就跑出别的剧情。` },
        { t: `p`, text: `写模拟永远从两个问题开始。**第一问：现在手上要记着什么？** 这些问题答案的集合叫状态，每个答案就是一个变量。报数游戏要记两件事 —— 现在轮到这个数是多少，以及已经正常报出几个了。源稿给第二个起的名字很老实：int reported = 0;。**第二问：一步怎么走？** 也就是这些变量按什么顺序改。改的顺序一旦错，状态就散架。` },
        { t: `p`, text: `规则翻成代码就两条。逢 7 的倍数要跳过 —— 第 9 课的取余，cur % 7 == 0。数字里带 7 也要跳过 —— 17 里有 7、70 里有 7、177 里有两个 7。第 23 课的「或」把它们并起来：**两条规则是并排的，任何一条命中就跳过**，所以是 或 而不是 且。` },
        { t: `p`, text: `「带 7」这一条源稿用了一个巧办法：**把数字变成文本再查**。std::to_string 把 17 变成 "17"，第 17 课的 find 在里面找字符 '7'，找到返回位置、找不到返回那个专门的值 std::string::npos，于是判据写成 find 不等于 npos。上一课我们还在手拆 n / 10 % 10，这一课直接把它外包给字符串 —— 两条路都对，用文本那条写得短，代价是要请对头文件。` },
        { t: `code`, lang: `text`, code: `规则一  逢 7 的倍数跳过        →  cur % 7 == 0
规则二  数字里带 7 跳过        →  std::to_string(cur).find('7') != std::string::npos
两条并排  任一命中就跳          →  A || B
停止条件  报满 20 个正常数      →  reported < 20     ← 注意：不是 cur <= 20` },
        { t: `p`, text: `最后那行是本课的全部技术含量。**进度和数到的数不是一回事。** 跳过的数不推进进度，却实实在在占掉了 cur 的一步，两个数字越走越歪。实测报满 20 个正常数，cur 已经跑到 25，最后一个真报出来的是 24；要是把条件写成 cur 小于等于 20，程序会老老实实停下，而实际只报出 17 个数 —— 题目要的 20 个没凑齐。` },
        { t: `svg`, caption: `上面那排是 cur 走过的格子，下面那排是真正报出来的数 —— 中间被 7、14、17、21 这四个洞错开了四格；报满 20 个的时候，上面已经走到 25`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 296">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">两条刻度：一条走数，一条走进度</text>
  <g font-size="12" fill="#26405a">
    <text x="16" y="42">cur 走过的格子 1 到 24</text>
    <rect x="16" y="50" width="24" height="24" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1"/>
    <text x="28" y="66" text-anchor="middle">1</text>
    <rect x="42" y="50" width="24" height="24" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1"/>
    <text x="54" y="66" text-anchor="middle">6</text>
    <rect x="68" y="50" width="24" height="24" fill="#fdece1" stroke="#b8500f" stroke-width="2"/>
    <text x="80" y="66" text-anchor="middle" fill="#b8500f">7</text>
    <rect x="94" y="50" width="24" height="24" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1"/>
    <text x="106" y="66" text-anchor="middle">8</text>
    <rect x="120" y="50" width="24" height="24" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1"/>
    <text x="132" y="66" text-anchor="middle">13</text>
    <rect x="146" y="50" width="24" height="24" fill="#fdece1" stroke="#b8500f" stroke-width="2"/>
    <text x="158" y="66" text-anchor="middle" fill="#b8500f">14</text>
    <rect x="172" y="50" width="24" height="24" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1"/>
    <text x="184" y="66" text-anchor="middle">16</text>
    <rect x="198" y="50" width="24" height="24" fill="#fdece1" stroke="#b8500f" stroke-width="2"/>
    <text x="210" y="66" text-anchor="middle" fill="#b8500f">17</text>
    <rect x="224" y="50" width="24" height="24" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1"/>
    <text x="236" y="66" text-anchor="middle">20</text>
    <rect x="250" y="50" width="24" height="24" fill="#fdece1" stroke="#b8500f" stroke-width="2"/>
    <text x="262" y="66" text-anchor="middle" fill="#b8500f">21</text>
    <rect x="276" y="50" width="24" height="24" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1"/>
    <text x="288" y="66" text-anchor="middle">24</text>
    <text x="310" y="66" fill="#57677c">← 报满 20 个，循环收在 cur = 25</text>

    <text x="16" y="106">报数进度 reported：跳过的那一格不占进度</text>
    <rect x="16" y="114" width="608" height="26" rx="8" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1"/>
    <rect x="24" y="120" width="120" height="14" rx="6" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1"/>
    <text x="84" y="131" text-anchor="middle">1 到 6 报出</text>
    <rect x="150" y="120" width="24" height="14" fill="#fdece1" stroke="#b8500f" stroke-width="1"/>
    <text x="162" y="131" text-anchor="middle" fill="#b8500f">7 跳</text>
    <rect x="180" y="120" width="120" height="14" rx="6" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1"/>
    <text x="240" y="131" text-anchor="middle">到 12</text>
    <rect x="306" y="120" width="26" height="14" fill="#fdece1" stroke="#b8500f" stroke-width="1"/>
    <text x="319" y="131" text-anchor="middle" fill="#b8500f">14</text>
    <rect x="338" y="120" width="90" height="14" rx="6" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1"/>
    <text x="383" y="131" text-anchor="middle">到 14</text>
    <rect x="434" y="120" width="26" height="14" fill="#fdece1" stroke="#b8500f" stroke-width="1"/>
    <text x="447" y="131" text-anchor="middle" fill="#b8500f">17</text>
    <rect x="466" y="120" width="90" height="14" rx="6" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1"/>
    <text x="511" y="131" text-anchor="middle">到 17</text>
    <rect x="562" y="120" width="26" height="14" fill="#fdece1" stroke="#b8500f" stroke-width="1"/>
    <text x="575" y="131" text-anchor="middle" fill="#b8500f">21</text>
    <text x="16" y="160" fill="#b8500f">四个洞：7、14、17、21 —— 前两个是 7 的倍数，17 是带 7，21 又是倍数</text>

    <rect x="16" y="176" width="300" height="76" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/>
    <text x="30" y="198" font-weight="700" fill="#00599c">状态</text>
    <text x="30" y="218">cur —— 现在轮到哪个数</text>
    <text x="30" y="238">reported —— 已经报出几个</text>
    <rect x="324" y="176" width="300" height="76" rx="8" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/>
    <text x="338" y="198" font-weight="700">推进</text>
    <text x="338" y="218">每轮 ++cur，谁都不例外</text>
    <text x="338" y="238">只有报出的那轮 ++reported</text>
    <text x="16" y="278" fill="#00599c" font-weight="700">两个计数器各走各的：拿 cur 当进度，是模拟最常见的错位。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `模拟代码有一个反复出现的三段形状，值得当成模板背下来：**声明状态** —— 把题目要求你记住的东西一个个起好名字；**推进循环** —— 循环条件写「目标达成没有」，循环体写「这一轮规则怎么说」；**收尾读状态** —— 答案从状态变量里读，而不是从循环计数器里猜。报数跳 7 这题里三段齐备，读一遍代码就能顺手把规则念出来，这就是写对了的样子。` },
        { t: `p`, text: `什么时候该想到模拟？题目给的是**流程**而不是**条件**。穷举的题目长这样：谁满足这条性质；模拟的题目长这样：先这样、再这样、然后那样，最后怎么样了。看到「第一个人报 1、第二个人报 2、逢 7 跳过、圈到底再从头」这种人话流程，就该停下来一句一句翻译成变量和 if，而不是急着写循环。` },
        { t: `h2`, text: `演示 1 · 源稿这段：报满 20 个正常数` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
int main() {
    int reported = 0;                       // 状态：已经正常报出几个数
    for (int cur = 1; reported < 20; ++cur) {
        bool skip = (cur % 7 == 0) || std::to_string(cur).find('7') != std::string::npos;
        if (!skip) {
            ++reported;                     // 正常报数，进度 +1
        } else {
            std::println("第 {} 个正常数之后，跳过了 {}", reported, cur);
        }
    }
    return 0;
}` },
        { t: `p`, text: `实测四行：第 6 个正常数之后跳过了 7、第 12 个之后跳过 14、第 14 个之后跳过 17、第 17 个之后跳过 21。注意每行打印的都是**跳之前**的进度，所以第一行是 6 而不是 7 —— 这正是模拟代码的样子：你写下的每一句 println 都在读那一刻的状态。` },
        { t: `h2`, text: `演示 2 · 本课任务：改成报 15 个正常数，列出被跳过的数` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
int main() {
    int reported = 0, cur = 1;
    for (; reported < 15; ++cur) {
        bool skip = (cur % 7 == 0) || std::to_string(cur).find('7') != std::string::npos;
        if (skip) std::println("被跳过的数：{}", cur);
        else ++reported;
    }
    std::println("报满 15 个，最后一个报出的是 {}", cur - 1);
}` },
        { t: `p`, text: `实测四行：被跳过的数：7、14、17，然后 报满 15 个，最后一个报出的是 18。为了在循环外面读 cur，我把它挪到了 for 的前面声明 —— 这一改本身就是任务的一部分，理由见常见坑最后一条。规则一行都没动，只把 20 换成 15、把打印挪了个位置。` },
        { t: `h2`, text: `演示 3 · 把「带 7」换回算术，顺便看清错位` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int reported = 0, cur = 1;
    auto hasSeven = [](int n) {              // 上一课的拆位回来了
        while (n > 0) { if (n % 10 == 7) return true; n /= 10; }
        return false;
    };
    for (; reported < 20; ++cur) {
        bool skip = cur % 7 == 0 || hasSeven(cur);
        if (skip) std::println("第 {} 个之后，跳过 {}", reported, cur);
        else ++reported;
    }
    std::println("报满 20 个：最后报出的是 {}，cur 停在 {}", cur - 1, cur);
}` },
        { t: `p`, text: `被跳过的四个数跟演示 1 一个都不差：7、14、17、21，最后多打一行：报满 20 个：最后报出的是 24，cur 停在 25。算术版逐位取余，文本版一次查串，两种写法在 1 到 25 这段跑出一样的结果；数字上千以后，文本版要先把每个数变成字符串，算术版省这一步 —— 模拟代码常在这种小地方选写法。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `循环条件写成数到几。for 里写 cur <= 20 看着最自然，实测只报出 17 个正常数就停了 —— 题目要报满 20 个，循环就该由进度说了算。判断办法：读一遍题目里的「直到」那句，它说的是什么，循环条件就写什么。`,
          `两个计数器混成一个。用 reported 去打印当前是几，或者用 cur 去判断报满没满，都错。跳过的时候 cur 动了而 reported 不动，两个数从 7 开始就永久错开，实测到 24 那一格已经差开 4 个。`,
          `「或」写成「且」。&& 要求既是 7 的倍数又带 7，1 到 60 里只剩 7 一个数被跳，后面 14、17、21 全被当成正常数报了出去。写规则翻译时逐条对照：题目说「都要跳过」，那就是并排的两条，用 或。`,
          `进度 ++ 放错分支。把 ++reported 挪到 if 外面，等于宣布「跳过也算报了一个」，实测循环在 cur 刚到 20 时就停下，真报出来的数只有 17 个；反过来忘了 ++cur，循环永远转不出来。写完模拟先用眼睛走一遍前 8 步，比对着输出对拍快。`,
          `不请 <string> 也能编译 —— 但别信这个。本机 g++ 上 <print> 顺手把 <string> 带进来了，去掉那一行照样过；换一台就报 'to_string' is not a member of 'std'，或者 find 那句直接看不懂 npos。用了什么就请什么头，这条第 142 课讲 include 的本质时说得很明白。`,
          `循环变量出了 for 就再也看不见。for 的初始化段里声明的 cur，在循环外面一句都用不上，实测报错是 'cur' was not declared in this scope。想在收尾处读「走到几了」，就得把声明提到 for 前面 —— 这也是本课任务里那个「最后一个报出的是 18」能打印出来的前提。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `改成报 15 个正常数，列出全部被跳过的数，并打印最后一个真正报出来的数。跑完核对：被跳过的是 7、14、17，最后报出的是 18。`,
          `把跳过的那句 println 改成打印「这个数是第几轮被跳的」，也就是说清 cur 和 reported 各自管什么，然后把两者的差打印出来。`,
          `延伸一：把「带 7」的判断换成纯算术 —— 一个 while 循环逐位取余看有没有 7，不请 <string>，确认输出跟演示 1 一样。`,
          `延伸二：改成「N 个人围一圈报数」的形状 —— 先不管出局，只用取余让座位号转圈，打印前 30 次报数各是几号座在报。`,
          `延伸三：再加一条规则「数字里带 4 的也跳」，把它翻译成判定里的第三栏，然后回答：报满 20 个正常数的时候 cur 走到几、被跳过的数一共有几个。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：模拟 = 先列状态、再写推进、循环条件听题目的「直到」；进度和数到的数是两把不同的尺，逢 7 与带 7 是并排的两条规则 —— 翻译对了，输出才会对。` }
      ]
    },
    {
      id: `m148`, title: `第 148 课 · 方向数组：把上下左右写成两个数组，走格子只剩两行代码`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用 dx、dy 两个数组表示四个朝向，把走一步压成两行；讲清撞墙右转那句里取余 4 为什么转得回来，并把源稿那张螺旋改成 5×5、改成从向下开始走。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课的棋盘是一列数，这一课把它摊开成格子，于是多出一个新问题：**代码怎么表达「往哪儿走」**。最直白的写法是四套 if —— 朝右列加一、朝下行加一、朝左列减一、朝上行减一，再加一个斜方向还得再补一套。方向数组把这件事收进两个数组：dx 记下每个朝向让**行**加减多少，dy 记下**列**加减多少，同一个下标拼起来就是一个朝向。` },
        { t: `code`, lang: `text`, code: `下标 dir      dx[dir] 让行 +/-      dy[dir] 让列 +/-      合起来的朝向
      0                0                      1            右
      1                1                      0            下
      2                0                     -1            左
      3               -1                      0            上
两个数组各四个数，按下标竖着对齐读：第 dir 列 = 一个朝向` },
        { t: `p`, text: `于是「走一步」缩成两行：x += dx[dir]，y += dy[dir]。想换朝向不用碰这两行，只改 dir 这一个整数 —— 这就是方向数组的全部价值：**把方向变成数据**。第 145 课我们让循环去试每一个候选，这一课让下标去试每一个朝向，其实是同一招：能进数组的东西，就能进循环。第 22 课那对花括号还是老用法，把四个数按顺序填进 dx。` },
        { t: `p`, text: `第二件事是撞墙就右转。dir 本来是 3，加一成 4，可 dx 只有 0 到 3 这四个位置，读 dx[4] 已经在数组外面 —— 拿到的值不保证是什么，编译器也不会拦你。第 9 课的取余在这里救场：**dir = (dir + 1) % 4** 让 4 折回 0，四个下标首尾接成一个圈。要往回转就 (dir + 3) % 4，同一个圈倒着走。` },
        { t: `svg`, caption: `一格一格走的全部机制：左边那张 4×4 标出前七步落子与填 4 那一次探到界外、右转继续，右边是方向数组和它的下标圈 —— dir 加一再对 4 取余，朝向就转一格，四个下标首尾相接；落子、探路、迈步是三拍，出界与踩到已填的格子都算撞墙`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 306">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">方向数组：一个下标管一个朝向，撞墙就把下标转一格</text>
  <g font-size="12" fill="#26405a">
    <text x="24" y="44">4×4 棋盘，前七步</text>
    <rect x="24" y="52" width="132" height="132" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1"/>
    <g fill="none" stroke="#8b98ab" stroke-width="1">
      <path d="M57 52 V184 M90 52 V184 M123 52 V184 M24 85 H156 M24 118 H156 M24 151 H156"/>
    </g>
    <g fill="#eaf7ec">
      <rect x="25" y="53" width="31" height="31"/><rect x="58" y="53" width="31" height="31"/>
      <rect x="91" y="53" width="31" height="31"/><rect x="124" y="53" width="31" height="31"/>
      <rect x="124" y="86" width="31" height="31"/><rect x="124" y="119" width="31" height="31"/>
      <rect x="124" y="152" width="31" height="31"/>
    </g>
    <g fill="#1d7a3c" font-weight="700">
      <text x="40" y="73" text-anchor="middle">1</text><text x="73" y="73" text-anchor="middle">2</text>
      <text x="106" y="73" text-anchor="middle">3</text><text x="139" y="73" text-anchor="middle">4</text>
      <text x="139" y="106" text-anchor="middle">5</text><text x="139" y="139" text-anchor="middle">6</text>
      <text x="139" y="172" text-anchor="middle">7</text>
    </g>
    <g fill="#00599c">
      <polygon points="66,69 58,63 58,75"/><polygon points="99,69 91,63 91,75"/>
      <polygon points="132,69 124,63 124,75"/>
      <polygon points="139,102 133,94 145,94"/><polygon points="139,135 133,127 145,127"/>
      <polygon points="139,168 133,160 145,160"/>
    </g>
    <path d="M156 69 H186" stroke="#b8500f" stroke-width="2" stroke-dasharray="5 3"/>
    <polygon points="186,69 176,63 176,75" fill="#b8500f"/>
    <text x="192" y="66" fill="#b8500f">填 4 时探到第 0 行第 4 列</text>
    <text x="192" y="82" fill="#b8500f">列界是 3 → 出界，算撞墙</text>
    <path d="M196 96 H226 V112" stroke="#b8500f" stroke-width="2" fill="none"/>
    <polygon points="226,112 220,102 232,102" fill="#b8500f"/>
    <text x="236" y="112" fill="#b8500f">dir = 0 + 1 % 4 = 1，改成朝下</text>

    <rect x="292" y="52" width="184" height="120" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/>
    <text x="306" y="74" font-weight="700" fill="#00599c">两个数组，四个下标</text>
    <text x="306" y="96">下标    dx    dy</text>
    <text x="306" y="114">0        0     1     右</text>
    <text x="306" y="132">1        1     0     下</text>
    <text x="306" y="150">2        0    -1     左</text>
    <text x="306" y="168">3       -1     0     上</text>

    <rect x="492" y="52" width="132" height="120" rx="8" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/>
    <text x="504" y="72" font-weight="700">一步的三拍</text>
    <text x="504" y="94">落子 m[x][y] = v</text>
    <text x="504" y="114">探路 看下一格</text>
    <text x="504" y="134">迈步 x += dx[dir]</text>
    <text x="504" y="154">     y += dy[dir]</text>

    <g>
      <rect x="36" y="212" width="72" height="30" rx="6" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/>
      <text x="72" y="231" text-anchor="middle">右 dir 0</text>
      <rect x="140" y="212" width="72" height="30" rx="6" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/>
      <text x="176" y="231" text-anchor="middle">下 dir 1</text>
      <rect x="244" y="212" width="72" height="30" rx="6" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/>
      <text x="280" y="231" text-anchor="middle">左 dir 2</text>
      <rect x="348" y="212" width="72" height="30" rx="6" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/>
      <text x="384" y="231" text-anchor="middle">上 dir 3</text>
      <g stroke="#57677c" stroke-width="2.5">
        <path d="M108 227 H134"/><path d="M212 227 H238"/><path d="M316 227 H342"/>
      </g>
      <g fill="#57677c">
        <polygon points="134,227 124,221 124,233"/><polygon points="238,227 228,221 228,233"/>
        <polygon points="342,227 332,221 332,233"/>
      </g>
      <path d="M384 208 V196 H72 V208" stroke="#6b3fa0" stroke-width="2" fill="none"/>
      <polygon points="72,210 66,200 78,200" fill="#6b3fa0"/>
      <text x="426" y="231" fill="#6b3fa0" font-weight="700">撞墙就 dir + 1 再 % 4</text>
      <text x="426" y="248">3 加一折回 0，圈转满</text>
    </g>
    <text x="24" y="272" fill="#b8500f">一次只转一个朝向：转完立刻迈步，不再检查新格子 —— 螺旋走位够用，迷宫就得改成循环转向。</text>
    <text x="24" y="292" fill="#00599c" font-weight="700">改朝向 = 改一个下标；改大小 = 连越界判定里的数一起改，两处漏一处就歪。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `这段代码的形状值得背下来。状态只有三个整数：行下标 x、列下标 y、朝向 dir；每一步固定三拍 —— **落子、探路、迈步**。探路探的是**下一格**而不是脚下这格，判定用第 23 课的「或」把四条越界检查和一条「已填」检查并排串起来：出界算撞墙，踩到填过的格子也算撞墙。因为撞一次只转一次，转完立刻迈步，走位才不会原地打圈。` },
        { t: `p`, text: `跟第 145 课的枚举、第 146 课的剪枝摆在一起看，方向数组管的是另一件事：**它管状态怎么推进，不管答案对不对**。题目里出现格子、行列、四个方向、走到边界，就先写这张朝向表，四行数组换掉四套 if；要扩成八个朝向，也只是数组各多两格、取余的数换成 8。` },
        { t: `h2`, text: `演示 1 · 源稿这段：撞墙就右转，把 1 到 16 旋进格子` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int m[4][4] = {}, x = 0, y = 0, dir = 0;                         // 全 0 = 还没填过
    int dx[] = {0, 1, 0, -1}, dy[] = {1, 0, -1, 0};                  // 右、下、左、上
    for (int v = 1; v <= 16; ++v) {
        m[x][y] = v;                                                 // 先填当前格
        int nx = x + dx[dir], ny = y + dy[dir];                      // 只探前面那一格
        if (nx < 0 || nx > 3 || ny < 0 || ny > 3 || m[nx][ny] != 0) dir = (dir + 1) % 4;
        x += dx[dir];  y += dy[dir];                                 // 再迈这一步
    }
    for (int i = 0; i < 4; ++i)
        std::println("{:3}{:3}{:3}{:3}", m[i][0], m[i][1], m[i][2], m[i][3]);
}` },
        { t: `p`, text: `实测四行：1 2 3 4 / 12 13 14 5 / 11 16 15 6 / 10 9 8 7，正是从外向内顺时针收的那张螺旋。全程撞墙 7 次：3 次探到界外、4 次踩到已填的格子；v 每轮加一、每轮只落一子，撞墙那一年不额外多占编号。` },
        { t: `h2`, text: `演示 2 · 一步拆成三拍：落子、探路、迈步` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int m[4][4] = {}, x = 0, y = 0, dir = 0;
    int dx[] = {0, 1, 0, -1}, dy[] = {1, 0, -1, 0};
    for (int v = 1; v <= 5; ++v) {                    // 只把前 5 步打出来看
        m[x][y] = v;                                  // 落子
        int nx = x + dx[dir], ny = y + dy[dir];       // 探路：看的是下一格
        if (nx < 0 || nx > 3 || ny < 0 || ny > 3 || m[nx][ny] != 0) {
            dir = (dir + 1) % 4;
            std::println("填 {}：第 {} 行第 {} 列走不通，右转成 {}", v, nx, ny, dir);
        } else std::println("填 {}：第 {} 行第 {} 列空着，照旧", v, nx, ny);
        x += dx[dir];  y += dy[dir];                  // 迈步
    }
}` },
        { t: `p`, text: `实测五行：填 1、填 2、填 3 探到的第 0 行第 1、2、3 列都空着，照旧走；填 4 探到第 0 行第 4 列 —— 这张牌只有第 0 到第 3 列，于是判定为真，dir 从 0 变成 1；填 5 那行探的已是第 2 行第 3 列，而人此刻站在第 1 行第 3 列。**打印 nx、ny 而不是 x、y**，是走格子代码最省事的自检法。` },
        { t: `h2`, text: `演示 3 · 本课任务一：把矩阵改成 5×5` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int m[5][5] = {}, x = 0, y = 0, dir = 0;                          // ★ 4 → 5
    int dx[] = {0, 1, 0, -1}, dy[] = {1, 0, -1, 0};                   // 右下左上，没动
    for (int v = 1; v <= 25; ++v) {                                   // ★ 16 → 25
        m[x][y] = v;
        int nx = x + dx[dir], ny = y + dy[dir];
        if (nx < 0 || nx > 4 || ny < 0 || ny > 4 || m[nx][ny] != 0) dir = (dir + 1) % 4;
        x += dx[dir];  y += dy[dir];                                  // ★ 两处 3 → 4
    }
    for (int i = 0; i < 5; ++i)
        std::println("{:3}{:3}{:3}{:3}{:3}", m[i][0], m[i][1], m[i][2], m[i][3], m[i][4]);
}` },
        { t: `p`, text: `实测五行：1 2 3 4 5 / 16 17 18 19 6 / 15 24 25 20 7 / 14 23 22 21 8 / 13 12 11 10 9。方向数组一个字没改 —— 走法与格子大小本是两件事，这就是它的红利。源稿提示的三处都得改：声明、上界、判定里那两个 3。实测只改前两处、判定仍写 nx > 3 与 ny > 3，程序一声不响跑完，第 5 行第 5 列却全是 0，13 到 21 这九个数干脆没落进棋盘：16 格填满后前面尽是死路，转一次向照样迈得出去；把边界收成 const int N = 5、三处读同一个 N 才是不会漏改的写法。` },
        { t: `h2`, text: `演示 4 · 本课任务二：让蛇从「向下」开始走` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int m[4][4] = {}, x = 0, y = 0, dir = 0;
    int dx[] = {1, 0, -1, 0}, dy[] = {0, 1, 0, -1};   // 下、右、上、左
    for (int v = 1; v <= 16; ++v) {
        m[x][y] = v;
        int nx = x + dx[dir], ny = y + dy[dir];
        if (nx < 0 || nx > 3 || ny < 0 || ny > 3 || m[nx][ny] != 0) dir = (dir + 1) % 4;
        x += dx[dir];  y += dy[dir];
    }
    for (int i = 0; i < 4; ++i)
        std::println("{:3}{:3}{:3}{:3}", m[i][0], m[i][1], m[i][2], m[i][3]);
}` },
        { t: `p`, text: `实测四行：1 12 11 10 / 2 13 16 9 / 3 14 15 8 / 4 5 6 7 —— 先沿最左列往下，再沿底边往右，一张逆时针收进去的螺旋。这里得拆穿源稿那句提示：**光把开头挪一挪不够**。dx、dy 的次序和「撞墙怎么转」是绑死的一套：右、下、左、上 配 dir 加一转的是顺时针那一圈，正好配得上从左上角先向右走；照字面挪成 下、左、上、右 而其余不动，撞第一次墙就拐到列的负数那一侧 —— 实测那一步直接写到数组外面，棋盘留下两个 0 的空位、1 到 16 少了两个数，程序照样不崩。配套的改法有两条：要么像上面这样换成 下、右、上、左，要么保住顺时针转向、把起点挪到右上角，x = 0、y = 3 配 下、左、上、右，实测打出 10 11 12 1 / 9 16 13 2 / 8 15 14 3 / 7 6 5 4，仍是完整的一张牌。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `改了格子大小忘了改判定。判定里那两个 3 是硬写的整数，跟 m 的声明没有任何关系；漏改不会报错，只会让走位按旧边界算 —— 实测新加的行列全空着，漏改的那一处永远不出声。`,
          `dx 与 dy 串了列。行下标 x 必须配 dx，列下标 y 必须配 dy；写成 x += dy[dir] 照样编译，走出来的路歪歪扭扭，很快就撞到界外。动手前把四个朝向手算一遍：站在第 0 格、dir 是 1 时该往哪儿走 —— 这比盯着屏幕猜快得多。`,
          `忘了取余就转圈。dir 到 3 再 +1 得 4，dx[4] 已经是数组外面的内存，读到什么值不保证；本机实测走位当场乱掉，棋盘上 6 和 8 两个数压根没落进去，而编译器一句警告也没有。% 4 不是花招，它是「下标永远落在数组里」的那道闸门，跟第 147 课让座位号转圈用的是同一个取余。`,
          `一次只转一个朝向，遇到死角就跨出去。源稿这套写法转完立刻迈步，不再检查新格子；螺旋里每条路都还有出口，所以够用。换成有障碍的迷宫，前面既出界又有墙时它照样往前迈 —— 那时得把那句 if 换成循环，转到能走为止。`,
          `把 m[nx][ny] != 0 排在四条越界检查前面。「或」是短路的：前面一条为真就不往后看，所以四个越界判定得打头，才能保证那次读格子永远在界内。实测把顺序反过来，输出跟正确写法一行不差 —— 这正是最阴的地方：越界读已经发生，只是这次没露馅。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把矩阵改成 5×5 —— 源稿提示的两件事：16 改成 25、判定里两处 3 改成 4，都要改。跑完核对五行螺旋，再回答：只改上界不改判定会打成什么样。`,
          `让蛇从「向下」开始走 —— 提示是调整 dx、dy 的开头。做完要说清：为什么光挪开头会把步子迈出格子，配套要动的是次序还是起点。`,
          `延伸一：把边界收成数据 —— 声明 const int N = 5，判定用 nx 大于等于 N 这种写法，然后一次改成 N = 6，看看还要动几个字。`,
          `延伸二：把朝向扩成八个，加上四个斜方向，取余的那个数跟着换成 8；站在左上角走一步，打印出行列各变了多少。`,
          `延伸三：把三拍写成走位脚本 —— 再配一张长度表 int len[]，按 右 1 格、下 2 格、左 1 格、上 1 格 走完，打印每一步落在第几行第几列，想想怎么用它走出一张回字。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：方向数组把「上下左右」从四套 if 变成两个数组一个下标 —— 走一步只有 x 加 dx[dir]、y 加 dy[dir] 两行，撞墙右转就是 dir 加一取余；朝向的次序跟起点、转向绑成一套，格子的大小要连越界判定一起改。` }
      ]
    }
  ]
};
