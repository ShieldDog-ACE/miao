/* 喵站 · C++ 掌握 正文分部 p04：第 89–92 课（第九轮）
 *
 * 源稿：89_进制转换.cpp、90_管道思想filter筛选.cpp、91_transform转换.cpp、92_管道组合.cpp
 * 前两课一个往「数怎么表示」里钻，一个往「数据怎么流水加工」里开新章；
 * 后两课是 ranges 管道的第二、第三段。写法照 p02/p03：讲「为什么这么想」，不只讲「语法长这样」。
 */
window.MIAO_CPPM_P04 = {
  chapters: [
    {
      id: `m89`, title: `第 89 课 · 进制转换：把一个数换一套写法`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：吃透「除 base 取余、余数倒着读」这套短除法，会写 to_base，也会反着走回 from_base。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `先钉住一件事：**进制不是另一种数，是同一个数的另一种写法。** 内存里那个 255 从头到尾没变过，变的只是你拿什么单位去量它、用什么字符把它记下来。` },
        { t: `p`, text: `你写「255」的时候，其实写的是一句压缩过的算式：2×100 + 5×10 + 5×1。规则永远是同一句 —— **每一位代表 base 的几次方，位上的数字告诉你这个单位有几个**。你觉得十进制天经地义，只因为人恰好有十根手指。计算机只有通与断，它的 base 是 2；十六进制则是程序员的速记法：一位顶四位二进制，写 FF 比写 11111111 省力，也不容易数错过一位。` },
        { t: `p`, text: `所以「进制转换」不是某种数学运算，它是**换一套写法**：手里有一个真实的数，要把它表示成 base 进制的数字串。怎么换？回想你小时候怎么把 255 拆成 2 个百、5 个十、5 个一 —— 那就是一直在除 10、一直取余数。换成任意 base，动作一模一样：**拿 base 去除，余数就是当前最低位，商是还没拆完的部分。**` },
        { t: `p`, text: `250 拆十六进制：250 除以 16 得商 15 余 10，个位定了，是 10 号数字，也就是 A；再把 15 除以 16，商 0 余 15，下一位是 F；商成了 0，没东西可拆了，结束。把两轮余数**倒过来读**，就是 FA。` },
        { t: `p`, text: `这里有两个必须想通的点。第一个：**为什么先拆出来的偏偏是最低位？** 因为 n % base 干的就是「把凑不满一个 base 的零头剩下来」，而零头按定义就是个位；配套的 n /= base 则是「砍掉个位，剩下的高位整体降一格」。整除与取余正好是「丢掉最低位」与「读出最低位」这一对操作，所以它们天生就是拆位的两把刀。` },
        { t: `p`, text: `第二个：**为什么余数要倒着读？** 你先拿到个位，最后才拿到最高位，而人写数是高位在左。代码里两条路：按顺序把各位攒进串里、最后翻过来；或者每算出一位就**插到串的最前面**。源稿走第二条 —— result = digits[n % base] + result，新来的那位永远压在左边。` },
        { t: `code`, lang: `text`, code: `while (n > 0) {                          ← 商为 0 就是拆完了，圈停
    result = digits[n % base] + result;  ← 余数查表变字符，插到最前面
    n /= base;                           ← 商继续拆下一位
}` },
        { t: `p`, text: `还差一小步：余数是 0 到 base-1 之间的整数，可 base 一旦超过 10，10 到 15 这几个值不能写成「10」「11」两个字符（那样串就没法读了）。标准做法是摆一张**数字表** "0123456789ABCDEF"，把余数直接当下标去取字符 —— 0 配 '0'，10 配 'A'，15 配 'F'。查表把「值」翻成「形」，它比一大串 if 干净得多。` },
        { t: `svg`, caption: `短除法逐行往下走：每一行的商是下一行的被除数，余数落进右侧的串时总是插在最前面，所以读的顺序和算的顺序相反`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260">
  <text x="20" y="22" font-size="13" font-weight="700" fill="#142639">把 250 拆成 16 进制 —— 算的顺序自上而下，读的顺序自下而上</text>
  <g font-size="12" fill="#26405a">
    <rect x="20" y="40" width="92" height="28" rx="6" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="66" y="59" text-anchor="middle">被除数 250</text>
    <text x="124" y="59" font-size="13">÷ 16</text>
    <path d="M162 54 H196" stroke="#57677c" stroke-width="2"/><polygon points="196,54 186,48 186,60" fill="#57677c"/>
    <rect x="200" y="40" width="76" height="28" rx="6" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="238" y="59" text-anchor="middle">商 15</text>
    <rect x="288" y="40" width="112" height="28" rx="6" fill="#fdece1" stroke="#b8500f" stroke-width="1.5"/><text x="344" y="59" text-anchor="middle">余 10 → 表得 A</text>
    <text x="414" y="59" font-size="12">result = "A"</text>

    <path d="M238 68 V100" stroke="#00599c" stroke-width="2"/><polygon points="238,100 232,90 244,90" fill="#00599c"/>
    <text x="248" y="88">商挪下来当被除数</text>

    <rect x="20" y="102" width="92" height="28" rx="6" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="66" y="121" text-anchor="middle">被除数 15</text>
    <text x="124" y="121" font-size="13">÷ 16</text>
    <path d="M162 116 H196" stroke="#57677c" stroke-width="2"/><polygon points="196,116 186,110 186,122" fill="#57677c"/>
    <rect x="200" y="102" width="76" height="28" rx="6" fill="#ffffff" stroke="#b8500f" stroke-width="1.5"/><text x="238" y="121" text-anchor="middle">商 0</text>
    <rect x="288" y="102" width="112" height="28" rx="6" fill="#fdece1" stroke="#b8500f" stroke-width="1.5"/><text x="344" y="121" text-anchor="middle">余 15 → 表得 F</text>
    <text x="414" y="121" font-size="12">result = "FA"</text>
    <text x="200" y="146" fill="#b8500f" font-weight="700">商为 0 —— 圈停，没东西可拆了</text>

    <rect x="20" y="164" width="380" height="30" rx="6" fill="#eaf3fb" stroke="#00599c" stroke-width="2"/>
    <text x="210" y="184" text-anchor="middle">F 在左是个高位，A 在右是个位 —— 拼的时候是倒着插的</text>
    <text x="20" y="218" font-size="12" fill="#33465e">同一张表换 base 就换 divisor：base 2 只用得上 0 和 1，base 16 要一路查到 F。</text>
    <text x="20" y="240" font-size="12" fill="#33465e">反过来装回去时不查余数，改用「旧值乘 base，把新数字并进个位」，一行圈就走完。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `这套「反复除、每轮把余数记下来」的形状，通用形式是：**一个整体，用固定单位逐层拆成一位一位，读的顺序和拆的顺序相反。** 以后你会遇到一堆长得一模一样的问题 —— 把一秒数拆成时分秒、把一个编号摊平成行列下标。凡是「大单位换小单位、换到底」的活都能照抄这个骨架，只是把 base 换成 60 或者换成列数。` },
        { t: `p`, text: `顺带拆掉一个误解：内存里的 int 本来就是二进制，有人觉得「转二进制直接看内存就行」。对了一半 —— 你能**看到**那串比特，但要把它**印成人能读的字符**，仍然得走同一套拆位流程。进制转换的难点从来不在算，在「把值翻成字符」和「把顺序摆正」这两件小事上。` },
        { t: `h2`, text: `演示 1 · 先照源稿跑一遍` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>

int main() {
    const std::string digits = "0123456789ABCDEF";   // 数字表：下标就是余数
    int n = 255, base = 16;
    std::string result;
    while (n > 0) {
        result = digits[n % base] + result;          // 余数查表，插到最前面
        n /= base;                                    // 商继续拆下一位
    }
    std::println("255 的 16 进制是 {}", result);      // FF
    return 0;
}` },
        { t: `p`, text: `跑一遍你会得到 FF，跟手算对得上：两次余数都是 15 号数字 F。源稿紧接着又把 n 复位成 255、base 改成 2、result 清空，把同样的五行抄了一遍去转二进制，得到 11111111。**注意它必须手动复位这几个变量** —— 圈跑完时 n 已经是 0、result 里还留着上一轮的 FF，不清空就会接着往后拼。这种「做两次就得手动抹两次状态」的地方，正是程序在提醒：该抽函数了。` },
        { t: `h2`, text: `演示 2 · 抽成 to_base，一次拆两个 base` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>

std::string to_base(int n, int base) {        // 数字表是函数的私事，调用者不用递
    const std::string digits = "0123456789ABCDEF";
    std::string result;
    while (n > 0) { result = digits[n % base] + result; n /= base; }
    return result;
}
int main() {
    std::println("255 = {} （base 16）", to_base(255, 16));
    std::println("255 = {} （base 2）", to_base(255, 2));
    return 0;
}` },
        { t: `p`, text: `抽完之后有两件事值得说。第一，**n 和 base 是参数，每调一次就是新的**，复位问题自动消失。第二，digits 我放进函数体而不是当第三个参数递进去：这张表是「值怎么变字符」这件私事的实现细节，哪后要支持小写字母，只改函数内部一行，所有调用点一个字不动。**参数越少的接口越好用**，这条判断比语法值钱。` },
        { t: `h2`, text: `演示 3 · 反着走：from_base` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>

int from_base(const std::string& s, int base) {
    const std::string digits = "0123456789ABCDEF";
    int result = 0;
    for (char c : s) result = result * base + digits.find(c);   // 旧值升一位，新数字进个位
    return result;
}
int main() {
    std::println("FF （16 进制） = {}", from_base("FF", 16));
    std::println("11111111 （2 进制） = {}", from_base("11111111", 2));
    return 0;
}` },
        { t: `p`, text: `反向为什么是「旧值乘 base 再加」而不是「每位乘 base 的幂再求和」？因为写数时最高位在左，你从左边读起，已读过的部分**每来一个新字符就要整体左移一位**（乘 base 就是左移），再把新数字塞进空出的个位。读 FF：result 起于 0，来 F 得 15；再来 F，15×16 + 15 = 255。这套走法叫 Horner 法则，每步只剩一次乘一次加，而且不用先知道串有多长。` },
        { t: `p`, text: `对照着看，正反两个方向是镜像的：去的时候用除和余、从低位往高位攒；回的时候用乘和加、从高位往低位扫。镜像能对上，说明你写的不是两段技巧，而是同一套表示法的两面。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `n 等于 0 时转出来是空串。圈的守卫是 n > 0，一进门就不成立，result 从来没被填过。修法是在函数开头特判 n == 0 直接返回 "0"。这是最容易被漏掉的一个边界，源稿那段正好没管它。`,
          `负数进去同样返回空串。就算把守卫改成 n != 0，C++ 的取余对负数给的余数也可能是负的，负下标一取就越界。规矩是：先记下符号、把 n 取正再拆、最后把负号贴回串头。`,
          `base 超过 16 就查表越界。digits 只有 16 格，余数 17、18 拿去当下标是越界访问 —— 编译不报错、运行也不报错，它只是给你一些不认识的字符或者干脆崩。要转更大的 base，先把表加长（36 进制用 0-9A-Z），并在入口先判一下 base。`,
          `忘了 result 清空或 n 复位，第二次就转出一长串莫名其妙的东西 —— 这正是抽函数的动机：**别在两份复制粘贴之间维护状态**。`,
          `digits[n % base] + result 写成 result = result + digits[n % base]，结果就反了。字符串加法有方向，左边是前面、右边是后面；想要倒序读就得往头部插。顺带说一句，每轮从头插其实要整体搬一次串，位数最多 64 时无所谓，但「先按低位顺序 push_back、最后从后往前印」更省 —— 先记着，学到 vector 那一族会自然用上。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `两段循环几乎一样 —— 把它们抽成 to_base(int n, int base) 函数，main 里连调两次分别转 16 进制和 2 进制，确认不用再手动复位。`,
          `反向操作 from_base("FF", 16)：查表，每读一个字符就 result = result * base + 值，把 FF 变回 255。`,
          `延伸一：给 to_base 补上 n == 0 返回 "0" 这条特判，再用 n = 0、1、16 三个数验证。`,
          `延伸二：用这两个函数互转一批数，验证 from_base 能把 to_base 的结果原样装回 n —— 这叫往返测试，是检查「正解与反解都写对」最省事的办法。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：进制只是写法，不是数；除 base 取余拆出来的是最低位，所以拼时要往前插；反向组装用「旧值乘底、新值入位」，一拆一装互为镜像。` }
      ]
    },
    {
      id: `m90`, title: `第 90 课 · 管道思想：filter 是给数据装的第一段筛子`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：第一次见到竖线管道，会用 std::views::filter 把「只放行满足条件的」这段接在数据后面，并记住视图是看法、不是新容器。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `从这一课起换一片战场。前面那些课在造数据、拆一个数；接下来一整组课处理的是另一类活：**手里有一整列数据，要挑出一些、改写成另一些、只看前几个。** 日志里筛出报错行、名单里挑出及格的人、传感器读数里去掉异常值 —— 真实程序绝大部分代码都在干这个。` },
        { t: `p`, text: `你已有的写法是这样的：开一个 for 圈，圈里一个 if，条件成立就 push_back 进另一个 vector。它能跑，但你注意它把三件事搅在了一起 —— **取元素、判断、搬结果**。数据一多、条件一复杂，读代码的人就得自己在脑子里把这三层分开；想再叠一个条件，就得再套一层圈或者把 if 写成一片 &&，越写越像绳子打结。` },
        { t: `p`, text: `C++20 往标准库里搬了一个从 Unix 世界学来的想法：**处理数据像接水管。** 数据从左边流进来，中间一段一段筛子，每段只干一件事，右边流出来的是处理后的结果。写法就是用竖线把段连起来：` },
        { t: `code`, lang: `text`, code: `nums | std::views::filter(是偶数) | std::views::take(3)
 ↑         ↑                      ↑
 数据     这一段只干「筛」         这一段只干「取前几个」

读法：nums，然后筛偶数，然后取前 3 个。竖线就是「然后」。` },
        { t: `p`, text: `这个竖线不是 C++ 发明的，它是 shell 管道的移植：在终端里 ls | grep txt | sort 就是把前一个命令的输出灌给下一个命令。C++ 把同一套「一段只干一件事，用竖线串起来」搬进了 std::views 这一族。` },
        { t: `p`, text: `filter 是其中最常用的一段：**只放行条件为真的元素，其余的直接跳过。** 它要的参数是「给一个元素、回一个真假」的东西，圈子里叫**谓词**。第 56 课学的 lambda 正好是写谓词最顺手的工具：` },
        { t: `code`, lang: `text`, code: `[](int x) { return x % 2 == 0; }     ← 进来一个数，出来一个 bool，只干判断这一件事` },
        { t: `p`, text: `现在说本课最要紧、也最容易误解的一条设计：**filter 不生成新数组，它生成的是一层「看法」。** 官方名字叫**视图**，view，ranges 这一族因此叫 views。你写下「nums 接上 filter 某个谓词」的时候，一个元素都没被检查、一点内存都没多占 —— 它只是造出一个小对象，里面记着「我底下是 nums，遍历我的时候每个先过一遍这个谓词」。真正挨个判断，是等你 for 圈去读它的那一刻才发生的。这种「先记下要做的事，等被要结果时才动手」的性格叫**惰性**，是 ranges 全部设计的地基，下一课的 transform、后面几课的 take 全都建在它上面。` },
        { t: `svg`, caption: `数据一格一格从左往右流，filter 这一段只做一个动作：看得上的放行到右边，看不上的当场掉出去。右边的串里没有空洞，顺序也不变`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 236">
  <text x="20" y="22" font-size="13" font-weight="700" fill="#142639">nums | std::views::filter 偶数放行</text>
  <g font-size="12" fill="#26405a">
    <text x="24" y="52">原数据</text>
    <rect x="24" y="60" width="184" height="28" rx="6" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/>
    <text x="116" y="79" text-anchor="middle">5 2 8 1 9 3 7 4 6 10</text>
    <path d="M214 74 H262" stroke="#57677c" stroke-width="2.5"/><polygon points="262,74 252,68 252,80" fill="#57677c"/>
    <rect x="268" y="52" width="118" height="44" rx="10" fill="#fdece1" stroke="#b8500f" stroke-width="2"/>
    <text x="327" y="70" text-anchor="middle" font-weight="700" fill="#b8500f">filter</text>
    <text x="327" y="88" text-anchor="middle">x % 2 == 0 ?</text>
    <path d="M390 74 H438" stroke="#57677c" stroke-width="2.5"/><polygon points="438,74 428,68 428,80" fill="#57677c"/>
    <rect x="444" y="60" width="150" height="28" rx="6" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/>
    <text x="519" y="79" text-anchor="middle">2 8 4 6 10</text>
    <text x="446" y="104" font-size="12" fill="#1d7a3c" font-weight="700">放行：顺序不变，没有空洞</text>

    <path d="M327 96 V126" stroke="#b8500f" stroke-width="2" stroke-dasharray="4 3"/>
    <polygon points="327,126 321,116 333,116" fill="#b8500f"/>
    <rect x="252" y="130" width="150" height="26" rx="6" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5" stroke-dasharray="4 3"/>
    <text x="327" y="148" text-anchor="middle" fill="#8b98ab">5 1 9 3 7 掉出去</text>

    <rect x="20" y="176" width="600" height="42" rx="8" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1"/>
    <text x="34" y="194" font-size="12" fill="#33465e">注意右边那格不是新容器：它是「按这个规则遍历 nums」的一层看法，原数据一个字节都没改。</text>
    <text x="34" y="212" font-size="12" fill="#33465e">惰性 —— 接上管道的那一刻谁都没算，for 圈真去读的时候才逐个问谓词。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `这套形状的价值不在「少打几个字」，在于**每段都能单独看懂、单独复用、单独换掉**。你想把条件从偶数改成大于 5，只动 lambda 那一行；想再加一段「只要前三个」，只在后面续一条竖线。数据、判断、搬运被拆到不同的格子里，这就是它比嵌套圈好读的根本原因 —— 圈是**控制流**，你得在脑子里模拟执行；管道是**声明**，你只在读「要什么」。代价也要摆在桌面上：视图不是容器，不保证能下标访问、也不保证有 size；而且因为惰性，**你遍历它几次，谓词就跑几次**，谓词很贵时就该把结果落地成一份真的 vector。` },
        { t: `h2`, text: `演示 1 · 源稿这段，接上第一段筛子` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <ranges>

int main() {
    std::vector<int> nums = {5, 2, 8, 1, 9, 3, 7, 4, 6, 10};
    for (int v : nums) std::print("{} ", v);
    std::println("");
    for (int v : nums | std::views::filter([](int x) { return x % 2 == 0; }))
        std::print("{} ", v);                          // 只剩偶数
    std::println("");
    return 0;
}` },
        { t: `p`, text: `两行输出：第一行是原样十个数，第二行是 2 8 4 6 10。**遍历的写法一个字没变**，变的只是「遍历的东西」—— 从 nums 换成了 nums 过一遍筛子之后的看法。这一点很关键：管道不改造你已有的代码，它只替换 for 冒号左边那个可遍历对象。` },
        { t: `h2`, text: `演示 2 · 老写法摆在一起比一比` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>

int main() {
    std::vector<int> nums = {5, 2, 8, 1, 9, 3, 7, 4, 6, 10};
    std::vector<int> even;
    for (int v : nums) {
        if (v % 2 == 0) even.push_back(v);      // 判断与搬运缠在一行
    }
    for (int v : even) std::print("{} ", v);
    std::println("");
    return 0;
}` },
        { t: `p`, text: `两种写法输出完全一样，但差别在三处。一、老写法多养了一个容器 even，它存在的唯一理由是「把中间结果存下来」；管道没有中间容器。二、老写法里 if 和 push_back 绑在一起，你要改逻辑就动控制流；管道里条件只出现在 lambda 里。三、老写法若要再叠「并且只取前三个」，得加计数器、加 break，圈越来越厚；管道只是多接一段。**读哪个更省力，你把两段并排放十分钟就有答案了** —— 这正是本课任务 2 要你亲手做的事。` },
        { t: `h2`, text: `演示 3 · 换个条件，原数据毫发无损` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <ranges>

int main() {
    std::vector<int> nums = {5, 2, 8, 1, 9, 3, 7, 4, 6, 10};
    auto greater5 = nums | std::views::filter([](int x) { return x > 5; });
    for (int x : greater5) std::print("{} ", x);
    std::println("");
    std::println("nums 还是原来那份: {} {} {}", nums[0], nums[1], nums[2]);
    return 0;
}` },
        { t: `p`, text: `8 9 7 6 10 打出来，然后 nums 的头三个仍是 5 2 8。这里第一次用到 **auto**：视图的真实类型是一长串嵌套模板名字，写全了没法读，让编译器去推。推出来的东西你只当「一个可以 for 的对象」用 —— 这也是本课任务 1 的答案：改条件只动 lambda 里那一句。` },
        { t: `p`, text: `再往前一小步，筛子本身也能存下来复用（lambda 只写一次）：` },
        { t: `code`, lang: `c++`, code: `auto evens = std::views::filter([](int x) { return x % 2 == 0; });   // 这是「筛子」本身，还没接上数据
for (int v : nums | evens) std::print("{} ", v);              // 想接几个数组就接几个` },
        { t: `code`, lang: `text`, code: `nums | std::views::filter(p)   ← 数据 + 筛子 = 一个视图，看法已定但还没算
std::views::filter(p)          ← 只有筛子本身，可以贴到任何一列数据上` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `忘包 <ranges>。报错长得跟本课无关：「std 里没有 views 这个成员」，或者甩出几十行模板噪音。根因就一行 —— 头文件没请。这一族的东西全在 <ranges> 里，<vector> 和 <print> 都带不来它。`,
          `把视图当容器用。filter 出来的看法不支持 x[i] 这种随机下标，也别指望它有可靠的 size() —— 它答应你的只有「能从头到尾走一遍」。想要一份真的新 vector，就再写个圈把结果 push_back 进去；别指望视图本身能当数组切。`,
          `lambda 的参数名跟外面 range-for 的变量撞名。源稿两处都叫 v：圈变量是 v，lambda 的参数也叫 v。这合法，lambda 里的 v 把外面的遮蔽了，程序照跑，但读到第二遍就说不清手里这个 v 是谁。写 x 立刻清爽。`,
          `把「惰性」理解成「反正不算，随便套几层」。视图每次被遍历都真的重新跑一遍谓词：同一个 greater5 for 三圈，谓词就被问三遍全部元素。数据小无所谓，谓词贵（要查表、要读文件）时就得把结果落地。`,
          `条件写反或写歪。filter 留的是「真」。想筛掉偶数就写 x % 2 != 0，别写成 !x % 2 —— 感叹号优先级比取模高，先对整数 x 取反得到 0 或 1，再 % 2，结果恒为 0，条件永远假，输出一个空行。这类「跑通了但什么都不输出」的 bug，第一处该看的就是谓词。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把条件改成「大于 5」，看看输出：预期是 8 9 7 6 10，并确认 nums 本身一个字都没变。`,
          `手写循环挑偶数，和管道比比哪个好读：两段都要跑对同样的输出，然后并排放着读一遍，写清你自己更愿意维护哪一段、为什么。`,
          `延伸一：把 lambda 的参数从 v 改成 x，再看一遍演示 1，体会遮蔽带来的那点别扭。`,
          `延伸二：把「偶数筛子」存进一个变量 evens，分别接到 nums 和另一列数上各遍历一次 —— 这就是筛子与数据解耦的意思。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：管道是「然后」，filter 是「只放行真」，视图是「看法」不是「新容器」；把判断从控制流里拔出来单独成段，代码就从「怎么执行」变成「要什么」。` }
      ]
    },
    {
      id: `m91`, title: `第 91 课 · transform：filter 挑人，transform 加工`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用 std::views::transform 给每个元素装一台加工机，看懂它跟 filter 的分工，并搞清「加工机的返回类型就是流的元素类型」。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课的 filter 管的是**挑人**：十个元素进来，五个出去，出去的那些一模一样。本课的 transform 管的是**加工**：十个进来，十个出去，但每一个都变成了新值。一句判断标准先记住 —— 你的活是「有些元素我不想要」就用 filter，是「每个元素都要换成别的东西」就用 transform。` },
        { t: `p`, text: `它的形状跟 filter 完全对称：递给你一个 lambda，遍历的时候对**每个**元素调一次，**lambda 回什么，流出去的就是什么**。差别就在「回什么」这三个字上。filter 的 lambda 必须回真假，因为它只负责开门或关门；transform 的 lambda 想回什么就回什么 —— 回 int、回 double、回一个 std::string，甚至回一个你自己造的 struct（第 83 课那张名片）。这就是它比 filter 自由的地方：**管道里的元素类型，可以被这一段换掉。**` },
        { t: `p`, text: `源稿那段是平方：进来的 1 2 3 4 5 出去变成 1 4 9 16 25，而最后一行 std::println 印出 nums[0] 和 nums[4] 证明原数组毫发无损 —— 还是 1 和 5。**transform 从不写回原容器**，它只是在你读的那一刻把公式套上去。这条规矩是上一课「惰性看法」的延续：视图里根本没有一份加工后的数据，只有「怎么加工」这件事。` },
        { t: `p`, text: `为什么标准库要把它设计成「不改原件」？因为只有这样才能安全地组合。加工不动原数据，你就可以：同一列数据接不同的看法、同一个看法遍历任意多次结果都一样、要换公式只换那一个 lambda。反过来想，如果 transform 当场把 nums 改成一堆平方值，那么第二段管道就没法再用原始数据了，一个「看看」的动作会变成「毁掉」—— 这是数据处理里最招人嫌的副作用。C++ 选的是**声明怎么变换，而不是立刻执行变换**。` },
        { t: `svg`, caption: `上排 filter：进去五个，出来两个，掉出去的是没通过的；下排 transform：进去五个，出来还是五个，但每个都换了一副面孔。元素个数与元素类型，就是这两段管的三件事`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">挑人 vs 加工</text>
  <g font-size="12" fill="#26405a">
    <rect x="20" y="34" width="130" height="26" rx="6" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="85" y="52" text-anchor="middle">1 2 3 4 5</text>
    <path d="M154 47 H192" stroke="#57677c" stroke-width="2.5"/><polygon points="192,47 182,41 182,53" fill="#57677c"/>
    <rect x="198" y="30" width="120" height="34" rx="8" fill="#fdece1" stroke="#b8500f" stroke-width="2"/>
    <text x="258" y="45" text-anchor="middle" font-weight="700" fill="#b8500f">filter</text>
    <text x="258" y="60" text-anchor="middle">x 是奇数？</text>
    <path d="M322 47 H360" stroke="#57677c" stroke-width="2.5"/><polygon points="360,47 350,41 350,53" fill="#57677c"/>
    <rect x="366" y="34" width="96" height="26" rx="6" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="414" y="52" text-anchor="middle">1 3 5</text>
    <text x="480" y="52" fill="#1d7a3c" font-weight="700">少三个，值不变</text>

    <rect x="20" y="104" width="130" height="26" rx="6" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="85" y="122" text-anchor="middle">1 2 3 4 5</text>
    <path d="M154 117 H192" stroke="#57677c" stroke-width="2.5"/><polygon points="192,117 182,111 182,123" fill="#57677c"/>
    <rect x="198" y="100" width="120" height="34" rx="8" fill="#eaf3fb" stroke="#00599c" stroke-width="2"/>
    <text x="258" y="115" text-anchor="middle" font-weight="700" fill="#00599c">transform</text>
    <text x="258" y="130" text-anchor="middle">x * x</text>
    <path d="M322 117 H360" stroke="#57677c" stroke-width="2.5"/><polygon points="360,117 350,111 350,123" fill="#57677c"/>
    <rect x="366" y="104" width="150" height="26" rx="6" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/><text x="441" y="122" text-anchor="middle">1 4 9 16 25</text>
    <text x="20" y="152" fill="#00599c" font-weight="700">一个不少，个个变样 —— 想改元素类型也在这儿改</text>

    <rect x="20" y="168" width="600" height="62" rx="8" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1"/>
    <text x="34" y="188" font-size="12" fill="#33465e">filter 的 lambda 回真假：它只决定这扇门开不开，流出去的还是原来那个值。</text>
    <text x="34" y="208" font-size="12" fill="#33465e">transform 的 lambda 回新值：它回什么类型，管道里就流什么类型 —— 视图的元素类型由它定。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `transform 干的事，数学里叫**映射**：一个元素对一个元素，一进一出，必须对每个元素都算得出。所以写它的 lambda 时脑子里只该有一句话：「手里这一个，我要换成什么。」不要在里面偷偷攒状态（比如「每两个才变一次」），也不要在里面改外面的变量 —— 那既违背这一段只干一件事的精神，也会让反复遍历时给出不同的结果。` },
        { t: `p`, text: `跟 filter 一样，加工这一段也**不是立刻执行**的：你写下视图的时候一个平方都没算。等你 for 圈去读，它才现取现算。这样带来的好处是省内存、能无限长地接下去；坏处是同一个视图遍历三遍就套三遍公式。什么时候该把加工结果落地成真的 vector，以后讲性能那几课会给判据。` },
        { t: `h2`, text: `演示 1 · 源稿这段：给每个数算平方` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <ranges>
#include <algorithm>   // 某些实现里 views::transform 会用到那里的东西，只包 <ranges> 会挑灯

int main() {
    std::vector<int> nums = {1, 2, 3, 4, 5};
    for (int v : nums | std::views::transform([](int x) { return x * x; }))
        std::print("{} ", v);                          // 1 4 9 16 25
    std::println("");
    std::println("原数组没变: {} {}", nums[0], nums[4]);
    return 0;
}` },
        { t: `p`, text: `注意加工机里那个 x 是**唯一的新东西** —— 它是 lambda 自己的局部参数，拿到的是元素的一份拷贝，改它也不会动原数组。最后一行是这段代码真正想说的：nums[0] 仍然是 1。` },
        { t: `h2`, text: `演示 2 · 换一台机器：乘 10` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <ranges>
#include <algorithm>

int main() {
    std::vector<int> nums = {1, 2, 3, 4, 5};
    auto times10 = nums | std::views::transform([](int x) { return x * 10; });
    for (int v : times10) std::print("{} ", v);
    std::println("");
    for (int v : times10) std::print("{} ", v);         // 同一看法再走一遍
    std::println("");
    return 0;
}` },
        { t: `p`, text: `输出两行一样的 10 20 30 40 50。第二圈想让你亲眼确认：视图是可以反复遍历的，而且每次结果一致，因为「怎么加工」这件事被记在视图里，不依赖任何中间状态。顺手把加工机存进变量也说明另一件事 —— **视图是个普通对象**，能命名、能传来传去、能当参数递进函数。` },
        { t: `h2`, text: `演示 3 · 跨类型：名字变长度` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <vector>
#include <ranges>
#include <algorithm>

int main() {
    std::vector<std::string> names = {"Anna", "Bob", "Katherine", "Li"};
    auto lens = names | std::views::transform(
                    [](const std::string& s) { return s.size(); });
    for (auto n : lens) std::print("{} ", n);
    return 0;
}` },
        { t: `p`, text: `左边流的是 string，右边流的是数 —— **元素类型被这一段换掉了**，而这行代码里没有一处声明过这个新类型：它由 lambda 的 return 推出来。两处细节值得学：参数写 const std::string& 而不是 std::string，否则每加工一个名字就复制一份；遍历用 auto n 而不是 int n，因为 size 返回的是无符号的 size_t，用 int 接住是收窄，小数字上看不出问题，坑在远处。` },
        { t: `p`, text: `最后说一句源稿没提但你迟早会碰到的：汉字占好几个字节，所以 std::string 的 size 对「小明」给的是 6 而不是 2。本课故意用英文名字，是为了让你把注意力全放在 transform 上，不踩到编码那口井 —— 那是后面讲文本处理的课的正事。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `拿 transform 当 filter 用，或者反过来。把平方写进 filter 里，编译器要的是能转成真假的东西，于是一个数被当成真假看：0 被筛掉，其余原样流出去 —— 一个平方都没算。混用不会总报错，但它给的结果跟你想要的完全是两回事。`,
          `lambda 里两条分支回不同类型：if 里 return x，else 里 return 0.5 —— 一个 int 一个 double，推不出统一类型，编译器会甩一句关于返回类型不一致的错。修法是把两边写成同一类型，比如都回 double。`,
          `遍历加工结果时用 int 接 size_t、用 char 接 int 之类，值被悄悄截断。视图的元素类型跟着 lambda 的 return 走，接不住就用 auto。`,
          `以为 transform 会把新值写回原 vector。跑完一看 nums 还是 1 2 3 4 5 —— 这是设计如此，不是 bug。真要让原数据变成平方值，就老老实实写一个圈逐个赋值，或者把结果收进一个新容器。`,
          `忘了包 <ranges>（views 全族都在里面），或者加工 string 时忘了 <string>。报错长相通常是「size 不是 std::basic_string 的成员」或者一长串模板噪音，根因都是头没请齐。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把机器改成「乘 10」，看看输出：预期 10 20 30 40 50，并确认原数组仍是 1 2 3 4 5。`,
          `进阶：vector 装 std::string，用 transform 把每个名字变成它的长度 —— 想清楚这一段之后，管道里流的已经不是字符串了。`,
          `延伸一：把两段 transform 串起来，先平方再乘 10，体会「每段只管一件事」；再试试把两段顺序调换，看结果是否一样。`,
          `延伸二：把加工机的参数从 std::string 改成 const std::string&，说清省掉了什么。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：filter 决定谁能过去，transform 决定过去的那个变成什么；加工机的 return 类型就是管道里的元素类型，而原数组永远站在原地不动。` }
      ]
    },
    {
      id: `m92`, title: `第 92 课 · 管道组合：三段接起来，圈只写一个`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把 filter、transform、take 三段串成一条管道，看懂它是「先声明要什么、遍历时才逐段执行」，并搞清哪些段能换顺序、哪些不能。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `前两课各接了一段：filter 挑人，transform 加工。本课把它们接下去，再加一段 take —— **只取前几个，取够就收工**。源稿那句需求很典型：从一列数里筛偶数、算平方、只要前三个。` },
        { t: `p`, text: `用老写法，这一件事要三个圈：一个圈筛偶数进中间容器，一个圈算平方进第二个中间容器，一个圈打印到第三个就 break。三个容器、三处状态、三份「谁喂给谁」的接线，读的人得自己把它们串起来。管道写法是三行声明，一行一段，从上往下正好是干的三件事：` },
        { t: `code`, lang: `text`, code: `nums  |  filter 偶数  |  transform 平方  |  take 取 3
 ↑          ↑                ↑                ↑
 数据      谁过去         过去的变成什么      要几个

一行读作：nums，然后只放偶数过去，然后每个平方，然后只要前三个。` },
        { t: `p`, text: `这里藏着 ranges 最值钱的一条性质。因为每一段都是**惰性**的，整条链不是「先算完一整列、再砍成三个」，而是**逐元素推过去**：从 nums 取一个，问 filter，假就丢；真就交给 transform 算平方，take 记一个数；数够三个，整条链当场停手 —— **后面的元素根本没人碰过**。这不是微优化，这是思维方式的差别：你在声明一张「加工图纸」，执行是遍历那一刻才发生的事，而且只发生在你真正需要的那几个元素上。` },
        { t: `p`, text: `所以 take 该放哪一段，是个**设计问题**而不是格式问题。「一百万个候选里我要 5 个合格的」，把 take 放在筛子之后（正确）意味着最多算出 5 个就停；把 take 放在筛子之前，就成了「先看前 5 个候选里有几个合格」，八成只剩一两个 —— **结果不一样，代价更不一样**。` },
        { t: `svg`, caption: `一条管道逐元素推进：每段只对当前这一个元素负责，take 数够三个立刻让整条链停手，尾巴上的元素一个都没被看过`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 232">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">filter 偶数 | transform 平方 | take 取 3</text>
  <g font-size="12" fill="#26405a">
    <rect x="16" y="34" width="140" height="26" rx="6" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/>
    <text x="86" y="52" text-anchor="middle">5 2 8 1 9 3 7 4 6 10</text>
    <path d="M160 47 H188" stroke="#57677c" stroke-width="2.5"/><polygon points="188,47 178,41 178,53" fill="#57677c"/>
    <rect x="194" y="30" width="96" height="34" rx="8" fill="#fdece1" stroke="#b8500f" stroke-width="2"/>
    <text x="242" y="45" text-anchor="middle" font-weight="700" fill="#b8500f">filter</text>
    <text x="242" y="60" text-anchor="middle">偶？</text>
    <path d="M294 47 H322" stroke="#57677c" stroke-width="2.5"/><polygon points="322,47 312,41 312,53" fill="#57677c"/>
    <rect x="328" y="30" width="104" height="34" rx="8" fill="#eaf3fb" stroke="#00599c" stroke-width="2"/>
    <text x="380" y="45" text-anchor="middle" font-weight="700" fill="#00599c">transform</text>
    <text x="380" y="60" text-anchor="middle">x * x</text>
    <path d="M436 47 H464" stroke="#57677c" stroke-width="2.5"/><polygon points="464,47 454,41 454,53" fill="#57677c"/>
    <rect x="470" y="30" width="76" height="34" rx="8" fill="#f2e9fb" stroke="#6b3fa0" stroke-width="2"/>
    <text x="508" y="45" text-anchor="middle" font-weight="700" fill="#6b3fa0">take</text>
    <text x="508" y="60" text-anchor="middle">数 3 个</text>
    <path d="M550 47 H576" stroke="#57677c" stroke-width="2.5"/><polygon points="576,47 566,41 566,53" fill="#57677c"/>
    <rect x="562" y="86" width="62" height="26" rx="6" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/>
    <text x="470" y="104" fill="#1d7a3c" font-weight="700">输出 4 64 16</text>

    <rect x="16" y="126" width="608" height="44" rx="8" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1"/>
    <text x="30" y="145" font-size="12" fill="#33465e">实际走过的元素：5 假 → 2 真 → 8 真 → 1 假 → 9 假 → 3 假 → 7 假 → 4 真，够三个，当场停。</text>
    <text x="30" y="163" font-size="12" fill="#33465e">尾巴上的 6 和 10 没被判断、没被平方 —— 谓词只被问了 8 次，不是 10 次；平方只算了 3 次。</text>
    <text x="16" y="196" font-size="12" fill="#6b3fa0" font-weight="700">整条链是一台机器：进一个、走三段、出来要么没有要么一个，绝不缓存中间结果。</text>
    <text x="16" y="218" font-size="12" fill="#33465e">代价：同一个管道遍历第二遍，上面这些数字会重来一遍 —— 惰性从不替你存东西。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `三段能接起来，靠的是一条统一规矩：**每一段的输入是「一个可遍历的东西」，输出还是「一个可遍历的东西」。** 于是段与段之间随便接，长短随意，甚至可以拆成几条小管道再拼。这就是为什么源稿把整条链先存进一个名叫 pipeline 的 auto 变量 —— 视图是个普通对象，可以命名、可以当参数递给函数、可以遍历好几遍。想复用一个筛子时，把「只有加工、还没接数据」的那半截单独存成变量也行，前一课已经见过。` },
        { t: `p`, text: `还有一件更省事的事：管道的**最左边不一定得是容器**。std::views::iota 能凭空造出一列连续整数，1 到 100 一个数都不必存。于是「求 1 到 100 里能被 3 整除的数，平方后取前 5 个」这种题，从头到尾没有 vector —— 数据是**现生成的**，加工是**按需做的**。` },
        { t: `h2`, text: `演示 1 · 源稿那条三段管道` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <ranges>
#include <algorithm>
int main() {
    std::vector<int> nums = {5, 2, 8, 1, 9, 3, 7, 4, 6, 10};
    auto pipeline = nums
                  | std::views::filter([](int v) { return v % 2 == 0; })
                  | std::views::transform([](int v) { return v * v; })
                  | std::views::take(3);
    for (int v : pipeline) std::print("{} ", v);
    std::println("");
    return 0;
}` },
        { t: `p`, text: `输出 4 64 16。三行管道，一行一件事，改哪件事就动哪一行 —— 对比一下三个圈加两个中间容器的写法，你会同意「声明式」这三个字不是虚的。` },
        { t: `h2`, text: `演示 2 · 数一数谓词被问了几次` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <ranges>
#include <algorithm>
int main() {
    std::vector<int> nums = {5, 2, 8, 1, 9, 3, 7, 4, 6, 10};
    int asked = 0;
    auto p = nums | std::views::filter([&](int v) { ++asked; return v % 2 == 0; })
                  | std::views::transform([](int v) { return v * v; }) | std::views::take(3);
    for (int v : p) std::print("{} ", v);
    std::println("");
    std::println("只问了 {} 次判断", asked);
    return 0;
}` },
        { t: `p`, text: `这段跑完会打印 4 64 16，然后告诉你 asked 是 **8** 而不是 10：take 一满，链就断了，最后的 6 和 10 连问都没被问过。这种「在 lambda 里偷偷计数」的招数值得学会 —— 它是亲手验证惰性求值最便宜的办法，以后遇到「这段到底跑了几遍」的疑问，加个计数器一跑就清楚。` },
        { t: `h2`, text: `演示 3 · 连容器都不用造` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <ranges>
#include <algorithm>

int main() {
    auto out = std::views::iota(1, 101)
             | std::views::filter([](int x) { return x % 3 == 0; })
             | std::views::transform([](int x) { return x * x; })
             | std::views::take(5);
    for (int v : out) std::print("{} ", v);
    std::println("");
    return 0;
}` },
        { t: `p`, text: `输出 9 36 81 144 225，也就是 3、6、9、12、15 的平方。注意 iota 的两个数：**下界含、上界不含**，要 1 到 100 就得写 1 跟 101。这条规矩跟 vector 的下标、跟圈里的 i < n 是同一套半开区间思路，C++ 里到处是它，习惯之后反而省心 —— 上界减下界就是元素个数。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把管道当「可以随便换顺序」的东西。filter 与 transform 之间在很多情况下能换（本课任务 2 会让你亲眼看到一次能换的），但 take 跟谁都换不得：先取三个再筛，和先筛再取三个，是两个完全不同的问题。`,
          `iota 的上界少写一个 —— 想要 1 到 100，上界必须填 101，因为它是「一到就停」的那个位置。半开区间这套规矩跟 vector 的下标、跟圈里的 i 小于 n 是一回事，习惯之后反而省心：上界减下界就是个数。`,
          `视图活得比它看的对象久。把临时 vector 接出来的视图存进变量，函数一返回，视图底下指的就是已经不存在的容器 —— 遍历时读到的是垃圾，而且往往不报错。规矩：底层数据必须比视图活得长。`,
          `以为 take 之前那段已经白算了一遍全表，于是手动先算一整个平方数组再切。恰恰相反，惰性等的是你：需要几个才算几个。真正该操心的是另一头 —— 同一条视图遍历两遍就重算两遍。`,
          `想写全 pipeline 的类型。它是三四层套起来的模板名字，长到没法读，也没法手写。用 auto，或者干脆不命名、直接写在 for 圈里 —— 这是全课唯一一处「auto 不是偷懒而是正确做法」的地方。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `求 1 到 100 里能被 3 整除的数，平方后取前 5 个 —— 用 iota 起头，一行 vector 都不必写，预期输出 9 36 81 144 225。`,
          `调换 filter 和 transform 的顺序，结果一样吗？想想为什么：先筛偶数再平方，跟先平方再筛偶数，在这份数据上各得到什么，为什么这次巧上了；再把加工机换成「加 1」，看看还巧不巧。`,
          `延伸一：把演示 2 的 take 从 3 改成 5，注意 asked 变成多少，验证「够数就停」。`,
          `延伸二：把这条管道存进变量，遍历两遍，同时在 filter 与 transform 的 lambda 里各放一个计数器，看清第二遍的所有数字都重来一次。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：每段只干一件事，用竖线接起来就是一台机器；惰性让「要三个就只算三个」成立，而段的顺序是语义的一部分 —— 尤其 take，放前放后是两个问题。` }
      ]
    }
  ]
};
