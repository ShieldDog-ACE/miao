/* 喵站 · C++ 掌握 正文分部 p23：第 157–158 课（第九轮）
 *
 * 源稿：157_贪心找零钱.cpp、158_贪心会翻车.cpp
 * 这一节是「贪心」在这门课里第一次登场。写法上先把动作写熟 —— 每步拿当前还能拿的最大、拿完就剪掉、绝不回头；
 * 再立刻拿一组坑人的面额把它打穿，并用第 145 课那套全试一遍的枚举当尺子，量出贪心偏了多少。
 * 所有输出、张数、翻车的金额清单、枚举找到的最优张数，均经本机 g++ -std=c++23 实跑核对。
 */
window.MIAO_CPPM_P23 = {
  chapters: [
    {
      id: `m157`, title: `第 157 课 · 贪心找零钱：每步只问一句「此刻能拿的最大面值是几」`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把「每步拿当前最优、绝不回头」这一句写成七行代码，算清 186 元与 443 元各要几张，并亲手验一面值顺序倒过来之后它给出的张数有多离谱。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `找零 186 元，你的手会先摸一张 100，再摸一张 50，剩 36 元再摸一张 20 —— 每一步摸多大只看此刻还差多少，不回头想「我刚那张是不是换一张更好」。这种每步都选眼前最优、选完绝不反悔的策略，就叫贪心。源稿这七行把两件事都写到了：每步拿当前还能拿的最大面值，拿完把已经凑上的部分一刀剪掉。` },
        { t: `p`, text: `代码里没有任何比较，也没有 if 在问「这张该不该拿」，干活的是两个运算符：amount / c 用整数除法算出这个面值能拿几张，amount %= c 把凑走的部分一次剪掉，剩下的零头交给下一个更小的面值。整数除法天生向下取整，拿不到的那档自动算出 0 张，所以面额表只要从大到小写下来，整个循环就是一句「能拿几张拿几张」，不需要别的大脑。` },
        { t: `code`, lang: `text`, code: `186 元 · 面对 100：186 / 100 = 1 张，186 % 100 = 86      拿 1 张 100
 86 元 · 面对  50： 86 /  50 = 1 张， 86 %  50 = 36      拿 1 张 50
 36 元 · 面对  20： 36 /  20 = 1 张， 36 %  20 = 16      拿 1 张 20
 16 元 · 面对  10： 16 /  10 = 1 张， 16 %  10 =  6      拿 1 张 10
  6 元 · 面对   5：  6 /   5 = 1 张，  6 %   5 =  1      拿 1 张 5
  1 元 · 面对   1：  1 /   1 = 1 张，  1 %   1 =  0      拿 1 张 1
合计 6 张：100 + 50 + 20 + 10 + 5 + 1` },
        { t: `p`, text: `把这六行拿手指点一遍：每一行开头的金额都是上一行剪完剩下的，六次之后归零，一共拿掉 6 张。「贪心」两个字在这里的长相就是 —— 一次遍历，每个面值只被问一次，问完就翻篇，后面五个面值谁也不知道自己前面那个人拿得对不对。` },
        { t: `svg`, caption: `贪心的一步步：每一行只看「此刻还差多少」，用整数除法拿满这一档，再用取余把凑走的一刀剪掉，余额交给下一个更小的面值；六步之后归零，共 6 张。下半截是同一笔钱把顺序倒过来先拿 1 元的实测结果。数字全部来自本机实跑`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 336">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">186 元 · 面额从大到小：一步一档，拿完就剪</text>
  <g font-size="12" fill="#26405a">
    <text x="20" y="44" font-weight="700">此刻余额</text>
    <text x="132" y="44" font-weight="700">面对面值</text>
    <text x="244" y="44" font-weight="700">拿几张</text>
    <text x="344" y="44" font-weight="700">剪完剩下</text>
    <text x="464" y="44" font-weight="700">这一档拿掉的</text>

    <rect x="12" y="52" width="104" height="26" rx="5" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="64" y="70" text-anchor="middle">186</text>
    <rect x="124" y="52" width="104" height="26" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="176" y="70" text-anchor="middle">100</text>
    <rect x="236" y="52" width="96" height="26" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="284" y="70" text-anchor="middle">1</text>
    <rect x="336" y="52" width="104" height="26" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="388" y="70" text-anchor="middle">86</text>
    <text x="464" y="70" fill="#1d7a3c">100 × 1</text>

    <rect x="12" y="82" width="104" height="26" rx="5" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="64" y="100" text-anchor="middle">86</text>
    <rect x="124" y="82" width="104" height="26" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="176" y="100" text-anchor="middle">50</text>
    <rect x="236" y="82" width="96" height="26" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="284" y="100" text-anchor="middle">1</text>
    <rect x="336" y="82" width="104" height="26" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="388" y="100" text-anchor="middle">36</text>
    <text x="464" y="100" fill="#1d7a3c">50 × 1</text>

    <rect x="12" y="112" width="104" height="26" rx="5" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="64" y="130" text-anchor="middle">36</text>
    <rect x="124" y="112" width="104" height="26" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="176" y="130" text-anchor="middle">20</text>
    <rect x="236" y="112" width="96" height="26" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="284" y="130" text-anchor="middle">1</text>
    <rect x="336" y="112" width="104" height="26" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="388" y="130" text-anchor="middle">16</text>
    <text x="464" y="130" fill="#1d7a3c">20 × 1</text>

    <rect x="12" y="142" width="104" height="26" rx="5" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="64" y="160" text-anchor="middle">16</text>
    <rect x="124" y="142" width="104" height="26" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="176" y="160" text-anchor="middle">10</text>
    <rect x="236" y="142" width="96" height="26" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="284" y="160" text-anchor="middle">1</text>
    <rect x="336" y="142" width="104" height="26" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="388" y="160" text-anchor="middle">6</text>
    <text x="464" y="160" fill="#1d7a3c">10 × 1</text>

    <rect x="12" y="172" width="104" height="26" rx="5" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="64" y="190" text-anchor="middle">6</text>
    <rect x="124" y="172" width="104" height="26" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="176" y="190" text-anchor="middle">5</text>
    <rect x="236" y="172" width="96" height="26" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="284" y="190" text-anchor="middle">1</text>
    <rect x="336" y="172" width="104" height="26" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="388" y="190" text-anchor="middle">1</text>
    <text x="464" y="190" fill="#1d7a3c">5 × 1</text>

    <rect x="12" y="202" width="104" height="26" rx="5" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="64" y="220" text-anchor="middle">1</text>
    <rect x="124" y="202" width="104" height="26" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="176" y="220" text-anchor="middle">1</text>
    <rect x="236" y="202" width="96" height="26" rx="5" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/><text x="284" y="220" text-anchor="middle">1</text>
    <rect x="336" y="202" width="104" height="26" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="388" y="220" text-anchor="middle" fill="#1d7a3c">0</text>
    <text x="464" y="220" fill="#1d7a3c">1 × 1 —— 共 6 张</text>

    <path d="M12 246 H620" stroke="#c3ccd8" stroke-width="1.5"/>
    <text x="20" y="266" fill="#b8500f" font-weight="700">同一笔钱，把面额顺序倒过来先拿 1 元</text>
    <text x="20" y="286" fill="#b8500f">第一档 186 / 1 = 186 张，186 % 1 = 0 —— 余额当场清零，后面五个面值再也进不来</text>
    <text x="20" y="306" fill="#33465e">贪心不回头：每一行只看此刻的最大，它不知道也不关心后面会不会更划算。</text>
    <text x="20" y="326" fill="#00599c">顺序就是它的「最优」定义 —— 这一条是下一课反例的入口。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `贪心省下来的东西多到可疑：它不做计划、不留候选、不撤销，所以一个循环走到底。代价是它对「这样是不是最优」毫无验证能力 —— 它只是在执行你给它的那个「眼前最优」的定义。用贪心时脑子里要过一句话：在这个问题里，先拿大的那一步是不是永远不亏？面值 100/50/20/10/5/1 上，一张 100 顶十张 10，能拿大的时候拿小的只会让剩下的零头更多，所以敢闭眼写。` },
        { t: `p`, text: `本课的定位是把这套动作写熟：顺序怎么影响结果、除法与取余怎么配对、总张数从哪冒出来。至于「换一组面值它就开始给错」，下一课会拿第 145 课那套全试一遍的枚举当尺子，量出贪心到底偏了几张。今天手里的材料够了：第 40 课的 vector、第 43 课的 range-for、第 105 课的 std::sort 都已经在。` },
        { t: `h2`, text: `演示 1 · 源稿这段：186 元` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int amount = 186;
    int coins[] = {100, 50, 20, 10, 5, 1};  // 面额从大到小
    for (int c : coins) {
        int n = amount / c;                 // 这个面额能拿几张
        if (n > 0) std::println("{}元 × {}张", c, n);
        amount %= c;                        // 剩下还没凑上的零头
    }
    return 0;
}` },
        { t: `p`, text: `实测六行：100元 × 1张、50元 × 1张、20元 × 1张、10元 × 1张、5元 × 1张、1元 × 1张，合计 6 张。那行 if 大于 0 只是一件外衣，它把「这次一张都没拿到」的档位从打印里滤掉，张数一点没变。顺手数一件事：六档面值全用上了，因为 186 每一步的余额都恰好不为零；演示 2 的 443 就会出现三档空转。` },
        { t: `h2`, text: `演示 2 · 本课任务前半：443 元要几张` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int amount = 443;
    int coins[] = {100, 50, 20, 10, 5, 1};
    int total = 0;
    for (int c : coins) {
        int n = amount / c;
        if (n > 0) { std::println("{}元 × {}张", c, n); total += n; }
        amount %= c;
    }
    std::println("合计 {} 张，剩余零头 {}", total, amount);
    return 0;
}` },
        { t: `p`, text: `实测四行加一句合计：100元 × 4张、20元 × 2张、1元 × 3张，合计 9 张，剩余零头 0。50、10、5 三档一次都没露脸 —— 4 张 100 之后只剩 43，塞不进 50；43 拿掉两张 20 剩 3，而 3 又塞不进 10 和 5，只能靠三张 1 元收尾。这就是贪心的脾气：它不跳过谁，是余额不允许。` },
        { t: `h2`, text: `演示 3 · 本课任务后半：把 coins 顺序反过来` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int coins[] = {1, 5, 10, 20, 50, 100};        // 把源稿那行反过来：从小到大
    int amounts[] = {186, 443};
    for (int amount : amounts) {
        int left = amount, total = 0;
        for (int c : coins) {
            total += left / c;
            left %= c;                             // 凑走的剪掉
        }
        std::println("{} 元：先拿小面额，给出 {} 张，剩 {}", amount, total, left);
    }
    return 0;
}` },
        { t: `p`, text: `实测两行：186 元给出 186 张、443 元给出 443 张，而且全是 1 元。代码一行都没写错，它照样是「每步拿当前还能拿的最大」，只不过「当前」被数组顺序定义成了「手里第一个碰到的」—— 第一个面值 1 就把金额除尽，left %= 1 之后永远是 0，后面五个面值连门都进不来。**贪心只认你给的顺序，不认面值本身多大。** 这一跑就是本课任务要的那一眼。` },
        { t: `h2`, text: `演示 4 · 两种猛拿写法：除一下，还是减一张看一张` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int coins[] = {100, 50, 20, 10, 5, 1};
    int a = 186, b = 186, total = 0, used = 0, steps = 0;
    for (int c : coins) {
        total += a / c;  a %= c;                    // 写法 A：一次算出几张、一次剪掉
        while (b >= c) { b -= c;  ++used;  ++steps; }  // 写法 B：一张一张减
    }
    std::println("A 除法版：{} 张，剩 {}", total, a);
    std::println("B 减法版：{} 张，剩 {}，while 进了 {} 次", used, b, steps);
    return 0;
}` },
        { t: `p`, text: `实测两行都是 6 张、剩 0，这一笔上两种写法等价，区别在工作量：写法 B 的 while 一共进了 6 次，一次只减一张；写法 A 用六次除法一次剪掉一整档。B 慢一点，但每一步都摆在台面上 —— 下一课的反例就用它，因为「这一步走错了」得看得见。拿 1 元那一档去减 443，循环次数就等于张数，这正是演示 3 里那个 443 的来历。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `面额没按从大到小写就进循环。这段代码不排序、不检查，只照顺序拿。实测把 coins 反过来写，186 元的答案从 6 张变成 186 张，编译一路绿灯、警告一个不给。躲法两条：数组写死降序，或者先用 std::sort 排好再从最后一格往前遍历，那是第 105 课和第 154 课的手艺。`,
          `写了 n = amount / c 却忘了 amount %= c。实测 186 会报出 1 张 100、3 张 50、9 张 20、18 张 10、37 张 5、186 张 1，合计 254 张，而余额压根没动过。反过来的错更隐蔽：先 %= 再除，每一档都算出 0 张，程序一行都不打印。这两句必须成对出现，而且顺序不能换。`,
          `面额数组里混进一个 0。整数除以 0 不是编译期能抓住的事，实测程序跑到那一档当场挂掉，连一行输出都没来得及打完。写死数组时最容易多打一个逗号、或者把注释当成值留在表里。`,
          `把 if 大于 0 当成算法的一部分。它只是打印外衣：删掉它，443 那一跑会多出 50元 × 0张、10元 × 0张、5元 × 0张 三行，张数照旧 9 张。真正决定对错的是顺序和那两个运算符，别在这件外衣上找 bug。`,
          `把「贪心给出的张数」直接当成「最少张数」。在 1/5/10/20/50/100 上它确实最少，但那是这套面值给的保证，不是贪心自己的本事。换一组面值它就是错的 —— 下一课当场给出金额、张数和最优张数三个数。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `算 443 元要几张；把 coins 顺序反过来，从小拿，看看会怎样。两跑各把总张数打印出来，别只用眼睛看。`,
          `给源稿那段加一个 total 计数器，把 186 与 443 各跑一遍，然后说一句：443 那一跑里 50、10、5 三档为什么一次都没被用上。`,
          `延伸一：把演示 4 的写法 B 单独跑 186 与 443，给 while 的进入次数计数，把两个数报出来，说清它为什么等于张数。`,
          `延伸二：面额换成 1、5、10、25 这一套，拿 30 元跑一遍写下张数；再用第 145 课那种全试一遍的想法，穷举四种面值各拿几张凑成 30，看有没有更少的组合。敢不敢担保贪心一定最少，用你自己的实测回答。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：贪心就是「每步拿当前还能拿的最大，拿完就剪掉、绝不回头」，代码短到只剩除法与取余两句，但它对自己的错一无所知 —— 结果好不好，全在你那张面额表和它的顺序上。` }
      ]
    },
    {
      id: `m158`, title: `第 158 课 · 贪心会翻车：拿 4 的那一步，把 6 元的路走死了`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用面额 4、3、1 找 6 元把贪心当场打穿，拿第 145 课那套全试一遍当尺子量出「贪心给几张、最优几张」，并把 1 到 60 元里翻车的金额一笔一笔数出来。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课贪心活得好好的，是因为面值恰好是人民币这一套。现在只换一张面额表：4 元、3 元、1 元，要找 6 元。贪心第一步就抓 4 元，余额剩 2，比 4 小的面值里 3 又塞不下，只能一张 1 元、再一张 1 元 —— 一共 3 张。可 3 元加 3 元只要 2 张。同一笔钱、同一个循环，贪心输了，而且它输得心安理得，因为它每一步拿的确实都是「此刻最大」。` },
        { t: `p`, text: `根因只有一句话：贪心保证的是每一步最大，不保证「这一步之后剩下的钱最好凑」。抓走 4 以后余额落到 2，那两张 1 元是它后面怎么努力都抹不掉的。它从来不问「我第一张不拿 4，改拿 3 会怎样」—— 不回头是它的定义，也正是它的死穴。上一课那句「绝不反悔」在这里第一次有了代价。` },
        { t: `code`, lang: `text`, code: `贪心那条：6 → 拿 4 剩 2 → 拿 1 剩 1 → 拿 1 剩 0        共 3 张
回头那条：6 → 拿 3 剩 3 → 拿 3 剩 0                    共 2 张  ← 贪心走不到这一步` },
        { t: `p`, text: `那怎么知道自己错了？手里已经有一把尺子：第 145 课的全试一遍。4 元拿几张、3 元拿几张，剩下的全给 1 元，每一种组合都试一遍，记下最少张数。枚举比贪心慢得多，但它不会骗人 —— 今天要拿这个慢的，给那个快的定分。` },
        { t: `svg`, caption: `同一笔 6 元、同一张面额表 4、3、1：上半是贪心走的三步，每一步都是此刻的最大面值，可余额落到 2 之后只能用 1 元填；下半是枚举试出来的两张拿法，它第一步就没拿 4。最下面是 1 到 60 元实测的翻车清单，全部数字来自本机实跑`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 340">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">6 元 · 面额 4 / 3 / 1：两条路并排走</text>

  <text x="20" y="50" font-size="12" font-weight="700" fill="#b8500f">贪心：每步拿面值最大的那张</text>
  <g font-size="12" fill="#26405a">
    <rect x="20" y="60" width="110" height="30" rx="6" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="75" y="80" text-anchor="middle">余额 6</text>
    <path d="M132 75 H188" stroke="#b8500f" stroke-width="2"/><polygon points="196,75 186,70 186,80" fill="#b8500f"/>
    <text x="140" y="68" fill="#b8500f">拿 4</text>
    <rect x="198" y="60" width="110" height="30" rx="6" fill="#fdece1" stroke="#b8500f" stroke-width="2"/><text x="253" y="80" text-anchor="middle">余额 2</text>
    <path d="M310 75 H366" stroke="#b8500f" stroke-width="2"/><polygon points="374,75 364,70 364,80" fill="#b8500f"/>
    <text x="318" y="68" fill="#b8500f">拿 1</text>
    <rect x="376" y="60" width="110" height="30" rx="6" fill="#fdece1" stroke="#b8500f" stroke-width="1.5"/><text x="431" y="80" text-anchor="middle">余额 1</text>
    <path d="M488 75 H544" stroke="#b8500f" stroke-width="2"/><polygon points="552,75 542,70 542,80" fill="#b8500f"/>
    <text x="496" y="68" fill="#b8500f">拿 1</text>
    <rect x="554" y="60" width="72" height="30" rx="6" fill="#fdece1" stroke="#b8500f" stroke-width="2"/><text x="590" y="80" text-anchor="middle">0</text>
    <text x="20" y="106" fill="#b8500f" font-weight="700">共 3 张：4 + 1 + 1 —— 3 元那一档从头到尾没被用上</text>

    <text x="20" y="140" font-size="12" font-weight="700" fill="#1d7a3c">枚举：4 元拿几张、3 元拿几张，全试一遍，记下最少</text>
    <rect x="20" y="150" width="110" height="30" rx="6" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/><text x="75" y="170" text-anchor="middle">余额 6</text>
    <path d="M132 165 H258" stroke="#1d7a3c" stroke-width="2"/><polygon points="266,165 256,160 256,170" fill="#1d7a3c"/>
    <text x="150" y="158" fill="#1d7a3c">拿 3 —— 放弃更大的 4</text>
    <rect x="268" y="150" width="110" height="30" rx="6" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="323" y="170" text-anchor="middle">余额 3</text>
    <path d="M380 165 H446" stroke="#1d7a3c" stroke-width="2"/><polygon points="454,165 444,160 444,170" fill="#1d7a3c"/>
    <text x="392" y="158" fill="#1d7a3c">再拿 3</text>
    <rect x="456" y="150" width="110" height="30" rx="6" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="511" y="170" text-anchor="middle">余额 0</text>
    <text x="20" y="196" fill="#1d7a3c" font-weight="700">共 2 张：3 + 3 —— 贪心第一步就把这条路封死了</text>

    <path d="M12 216 H620" stroke="#c3ccd8" stroke-width="1.5"/>
    <text x="20" y="238" font-weight="700">本机实测 · 拿这两种答案逐笔对了一遍</text>
    <text x="20" y="258">面额 4 / 3 / 1，1 到 60 元：翻车 14 笔 —— 6、10、14、18、22、26、30、34、38、42、46、50、54、58</text>
    <text x="20" y="276" fill="#33465e">这 14 笔每一笔都只多 1 张：6 元 3 对 2，58 元 16 对 15。全是「除以 4 余 2」的金额。</text>
    <text x="20" y="294" fill="#1d7a3c">对照：面值 100/50/20/10/5/1 扫 1 到 200 元，不一致 0 笔；面额 25/10/5/1 扫 1 到 40 元，也是 0 笔。</text>
    <text x="20" y="312" fill="#b8500f">同一套代码，换个面额表就从「全对」变成「一路错」—— 错在面额表，不在循环。</text>
    <text x="20" y="332" fill="#00599c" font-weight="700">贪心的对错不由它自己保证，由你给的那张表保证；不敢担保，就拿第 145 课的枚举再跑一遍对照。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `本课不是来推翻贪心的，是来给它装一道闸门。上一课那七行代码一个字节都没改，改的是输入的面额表 —— 所以「这段代码对不对」这个问题，从这一刻起不能只读代码，得连数据一起读。闸门就两条：要么拿枚举在你真实会遇到的金额范围里逐笔验过，要么你能说出「大的那张永远不亏」的理由。两条都拿不出来，就别把贪心的输出当最优解交上去。` },
        { t: `p`, text: `举反例这个动作本身也值得学：一个小金额、一组面额、两个数字，比任何「听说贪心不一定对」都管用。这门课后面还会再用到贪心 —— 下一课它会换一类问题重新站住脚，那时第一句话还是今天这句：先问它会不会翻车，再问代码怎么写。` },
        { t: `h2`, text: `演示 1 · 源稿这段：6 元的贪心` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int amount = 6;
    int coins[] = {4, 3, 1};                // 换一组「坑人」的面额
    int used = 0;
    for (int c : coins)
        while (amount >= c) {               // 能拿就猛拿
            amount -= c;
            ++used;
        }
    std::println("贪心用了 {} 张（最优只要 2 张：3+3）", used);
    return 0;
}` },
        { t: `p`, text: `实测打印：贪心用了 3 张（最优只要 2 张：3+3）。这一版用的是上一课演示 4 的写法 B，一张一张减，所以 used 就是「拿了几次」：4 元那次、1 元两次，共 3 次，while 一共进了 3 回。括号里那句「最优只要 2 张」是源稿口算的，本课不认口算 —— 演示 2 就把它跑成一个数字来核对。` },
        { t: `h2`, text: `演示 2 · 拿第 145 课的枚举当尺子：最少到底几张` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int amount = 6, best = amount + 1, tried = 0;       // best 先记一个一定更差的值
    for (int a = 0; a * 4 <= amount; ++a)               // 4 元拿 a 张
        for (int b = 0; b * 3 <= amount; ++b) {         // 3 元拿 b 张
            ++tried;
            int rem = amount - a * 4 - b * 3;           // 剩下的全用 1 元填
            if (rem < 0) continue;                      // 超了：这个组合不存在
            int tot = a + b + rem;
            if (tot < best) best = tot;
        }
    std::println("6 元：试了 {} 种组合，枚举给出的最优是 {} 张", tried, best);
    return 0;
}` },
        { t: `p`, text: `实测输出：试了 6 种组合，枚举给出的最优是 2 张。a 只能取 0 或 1，b 只能取 0、1、2，两个一圈就是六组，最少的那组是 a = 0、b = 2、rem = 0 —— 正是源稿口算的 3 + 3。两个数并排一放，贪心 3 张对最优 2 张，多花 1 张，反例成立。注意那句 continue：它挡住的是「4 元拿 1 张再 3 元拿 1 张就已经 7 元」这种不可能的组合。` },
        { t: `h2`, text: `演示 3 · 扫一遍：1 到 60 元里它翻了几回车` },
        { t: `code`, lang: `c++`, code: `int greedy(int n) {                               // 上一课的写法 A
    int coins[] = {4, 3, 1}, used = 0;
    for (int c : coins) { used += n / c; n %= c; }
    return used;
}
int best(int n) {                                 // 第 145 课：4、3 各拿几张全试
    int r = n + 1;
    for (int a = 0; a * 4 <= n; ++a)
        for (int b = 0; b * 3 <= n - a * 4; ++b) {
            int tot = a + b + (n - a * 4 - b * 3);
            if (tot < r) r = tot;
        }
    return r;
}` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
int main() {                                  // greedy 与 best 用上面那两个函数
    std::vector<int> bad;
    for (int n = 1; n <= 60; ++n)
        if (greedy(n) != best(n)) bad.push_back(n);
    std::println("面额 4/3/1，1 到 60 元：贪心翻车 {} 笔", bad.size());
    for (int n : bad) std::print("{} 元贪 {} 优 {}；", n, greedy(n), best(n));
    std::println("");
    return 0;
}` },
        { t: `p`, text: `实测 14 笔，正好是那句「每一笔都只多 1 张」：6 元贪 3 优 2、10 元贪 4 优 3、14 元贪 5 优 4，一路到 58 元贪 16 优 15。清单本身比笔数更有意思 —— 6、10、14、一直到 58，全是除以 4 余 2 的金额。原因就在贪心第一步之后：余额一旦落到 2，3 元塞不下、只能两张 1 元；而少拿一张 4 换两张 3，同样的钱就少花一张。第二层循环把上界写成 n - a * 4，是把不存在的组合直接挡在门外，比在里面判 rem 更省。` },
        { t: `h2`, text: `演示 4 · 反过来再验两把：哪套面值它不翻车` },
        { t: `code`, lang: `c++`, code: `int greedy(int n, int x, int y, int z) {      // 三档面值，1 元兜底
    int coins[] = {x, y, z, 1}, used = 0;
    for (int c : coins) { used += n / c; n %= c; }
    return used;
}
int best(int n, int x, int y, int z) { int r = n + 1;   // 三个上界一路收紧
    for (int i = 0; i * x <= n; ++i)
        for (int j = 0; j * y <= n - i * x; ++j)
            for (int k = 0; k * z <= n - i * x - j * y; ++k) {
                int tot = i + j + k + (n - i * x - j * y - k * z);
                if (tot < r) r = tot;
            }
    return r;
}` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int bad1 = 0, bad2 = 0;
    for (int n = 1; n <= 40; ++n) {
        if (greedy(n, 25, 10, 5) != best(n, 25, 10, 5)) ++bad1;
        if (greedy(n, 5, 4, 3)   != best(n, 5, 4, 3))   ++bad2;
    }
    std::println("面额 25/10/5/1，1 到 40 元：翻车 {} 笔", bad1);
    std::println("面额 5/4/3/1，1 到 40 元：翻车 {} 笔", bad2);
    std::println("5/4/3/1 找 7 元：贪心 {} 张，最优 {} 张", greedy(7, 5, 4, 3), best(7, 5, 4, 3));
    return 0;
}` },
        { t: `p`, text: `实测三行：25/10/5/1 翻车 0 笔，5/4/3/1 翻车 7 笔，7 元那一笔贪心 3 张、最优 2 张 —— 最优就是 4 + 3，跟 6 元那次一模一样的毛病：第一张大的拿下去，余额掉进一个更小面值填不满的坑。上一课的 100/50/20/10/5/1 我也扫过，1 到 200 元同样 0 笔不一致。三组数摆在一起，那句判据就说得出嘴了：**不是「贪心行不行」，是「这张面额表让不行」**。大面值能不能被小面值顶掉、余额会不会落进填不满的坑，才是那个要看的东西。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把贪心的输出直接当成「最少张数」。实测 4/3/1 找 6 元，贪心 3 张、枚举最优 2 张，程序一行警告都不会给 —— 多出来的那一张只写在纸上，不写在报错里。交答案之前先问一句：这套输入我验过没有。`,
          `删掉 1 元兜底，贪心凑不满还装作成功了。实测把面额写成 4、3 找 6 元：它拿一张 4，剩 2，3 塞不下，循环干干净净走完，打印「贪心用了 1 张」，可余额还是 2。找零没找开这件事，这段代码永远不会主动告诉你，得你自己把最后的余额打出来看。`,
          `枚举的上界或判负漏了，把最优算成一个不可能的数。实测把演示 2 那句 rem 小于 0 就 continue 删掉：a = 1、b = 2 时 rem 是 -4，tot 算成 -1，程序立刻宣布「最优只要 -1 张」。第 150 课刚把边界列为头号杀手，这一课它换了个样子又来一遍 —— 负数不会崩、也不会警告，它给你一个更好看的错答案。`,
          `把「没排序」和「贪心错了」混成一件事。上一课顺序反过来那个 186 张是顺序病，改法是排好序；本课这 14 笔里 coins 已经是降序，排得整整齐齐照样翻车，改法是换策略或换算法。两种病的药不一样，先分清得的是哪一种。`,
          `找不到反例就当它一定对。25/10/5/1 我只扫到 40 元，那是 40 笔证据，不是一纸证明。真要担保，要么把范围扫到你实际会遇到的金额，要么把「大的那张永远不亏」这句话的理由说出来。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `只用眼睛找出 6 元那个 2 张的拿法，再用演示 2 的枚举把「最优 2 张」跑成一个数字核对；然后想一句话：什么时候敢用贪心，什么时候不敢 —— 把这句答案写在程序最上面当注释。`,
          `把金额从 1 扫到 60，把贪心与枚举不一致的那几笔全打印出来，数一数共几笔，再说清它们为什么全都是「除以 4 余 2」的那几个数。`,
          `延伸一：面额换成 5、4、3、1，拿 7 元把本课重做一遍，两个张数都跑出来，并说出它是哪一步走坏的。`,
          `延伸二：把面额表里的 1 元删掉，拿 6 元跑一次源稿那段，把打印和最后余额都写下来 —— 这一跑除了「张数不是最少」，还暴露出贪心的哪一个毛病？`,
          `延伸三：回到上一课延伸二的那套 25/10/5/1，把金额扫到 1 到 40，把不一致的笔数报出来，跟你交卷前猜的那个数字对一对。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：贪心只保证每步拿最大，不保证全局最省 —— 面额 4/3/1 找 6 元，本机实测它 3 张、枚举最优 2 张，1 到 60 元里 14 笔翻车；敢不敢用，要么拿第 145 课的枚举验过，要么把理由说出来。` }
      ]
    }
  ]
};
