/* 喵站 · C++ 掌握 正文分部 p16：第 137–140 课（第九轮）
 *
 * 源稿：137_自动移动与return.cpp、138_reserve预留容量.cpp、139_为什么要拆文件.cpp、140_include的本质.cpp
 * 前两课收束「复制与移动」这一段：编译器什么时候自己会移动、vector 什么时候偷偷搬家；
 * 后两课开「拆文件」这一段的第一枪：为什么要分成多个文件、#include 到底是什么东西在干活。
 * 写法照 p10：讲「为什么这么想」，不只讲「语法长这样」。演示输出一律经本机 g++ 15.2 -std=c++23 实跑核对。
 */
window.MIAO_CPPM_P16 = {
  chapters: [
    {
      id: `m137`, title: `第 137 课 · 自动移动与 return：局部变量直接 return，别加 std::move`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：说清哪些场合编译器自动替你移动，返回局部变量时直接写 return，并解释 return std::move(v) 为什么是画蛇添足。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 133 到 136 课把移动这件事讲透了：移动不抄内容，它把别人手里那块内存的地址接过来，再把对方的手松开。但那四课里每一次移动都是**你亲手写的** std::move。本课给一个更省事的真相：**该移动的地方，绝大多数编译器自己就会移动，不用你插手。**` },
        { t: `p`, text: `它凭什么敢这么干？因为它看得见「这东西马上就没了」。函数里的局部变量，函数一返回就要销毁；表达式里的临时结果，用完当前这句就要销毁。既然下一秒就拆掉，抄一份纯属浪费，那就不抄，直接把内存接过来用。**「马上就消失」这四个字，就是自动移动的全部判据。**` },
        { t: `p`, text: `于是 std::move 剩下的用处收缩成一句话：**把「还有名字的变量」明确交出去**。它自己不搬任何东西，它只是一句表态 —— 「这个变量我以后不要了」。编译器看得见的消失，它自己处理；编译器看不见的意图，才轮到你写。` },
        { t: `code`, lang: `text`, code: `return v;                       ← 局部变量马上销毁：自动移动，甚至根本不移动，就地造好
std::string b = "abc" + std::string("def");   ← 右边的临时结果：同样自动处理
vec.push_back(std::move(item));   ← item 有名字、函数结束后还要活着 → 只有这里该你开口` },
        { t: `p`, text: `别停在「自动移动就是省一次复制」这个理解上，return 那条路比这更省。很多人脑子里的画面是：函数里造一个 vector，复制一份交出去，再把函数里那个销毁。实测本机 g++ 是**零复制、零移动**，而且更硬的一个证据是 —— 外面那个变量的地址，跟函数里那个局部变量的地址一模一样。它不是「搬过去了」，它是**从一开始就长在调用者给它预留的格子里**。` },
        { t: `svg`, caption: `三条返回路线的实测差别。写 return 具名局部变量时，函数里那个对象就跟外面的变量共用一个地址；手写 std::move 反而把它拆成两个对象，中间补一次移动构造`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 268">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">return 的三条路，实测谁动了手</text>
  <g font-size="12" fill="#26405a">
    <text x="16" y="44" font-weight="700" fill="#1d7a3c">路线一：return v;  —— 具名局部变量</text>
    <rect x="16" y="52" width="196" height="32" rx="6" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/>
    <text x="114" y="72" text-anchor="middle">函数里那个 v</text>
    <path d="M216 68 H276" stroke="#1d7a3c" stroke-width="2.5"/><polygon points="276,68 266,62 266,74" fill="#1d7a3c"/>
    <rect x="282" y="52" width="196" height="32" rx="6" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/>
    <text x="380" y="72" text-anchor="middle">外面那个 data</text>
    <text x="486" y="72" fill="#1d7a3c" font-weight="700">同一个地址</text>

    <text x="16" y="112" font-weight="700" fill="#b8500f">路线二：return std::move(v);  —— 画蛇添足</text>
    <rect x="16" y="120" width="196" height="32" rx="6" fill="#fdece1" stroke="#b8500f" stroke-width="1.5"/>
    <text x="114" y="140" text-anchor="middle">函数里那个 v</text>
    <path d="M216 136 H276" stroke="#b8500f" stroke-width="2.5"/><polygon points="276,136 266,130 266,142" fill="#b8500f"/>
    <text x="246" y="128" text-anchor="middle" fill="#b8500f">移动构造 1 次</text>
    <rect x="282" y="120" width="196" height="32" rx="6" fill="#fdece1" stroke="#b8500f" stroke-width="1.5"/>
    <text x="380" y="140" text-anchor="middle">外面那个 data</text>
    <text x="486" y="140" fill="#b8500f" font-weight="700">两个地址</text>

    <rect x="16" y="168" width="608" height="58" rx="8" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1"/>
    <text x="30" y="188" fill="#33465e">路线三：return Blob(1000);  —— 交出去的是没有名字的临时值，C++17 规定这里必须就地构造。</text>
    <text x="30" y="208" fill="#33465e">实测计数：直接 return 时 复制 0 移动 0；加 std::move 后 复制 0 移动 1；交出去的是临时值时同样一次都不发生。</text>
    <text x="16" y="250" fill="#00599c" font-weight="700">编译器本来能省掉的那一次，被你那句 std::move 请回来了 —— 帮倒力的写法在这里长得最典型。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `这门课的口味是「**别替编译器做它已经会做的决定**」。第 121 课的智能指针教我们把所有权写出来，std::move 就是那张过户单；本课划的是另一条边界：过户单只在该过户的地方掏出来。判据不用背语法，问一句就够：**这东西是不是马上就不存在了？** 是 —— 编译器自己安排；否 —— 你写 std::move。` },
        { t: `h2`, text: `演示 1 · 源稿这段：直接 return 局部变量` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <vector>
std::vector<int> make_data() {
    std::vector<int> v(1000, 5);             // 局部变量：出了函数就销毁
    return v;                                // 直接 return，不写 std::move
}
int main() {
    std::vector<int> data = make_data();     // 函数里造的，直接落到 data 手里
    std::println("data.size() = {}", data.size());
    std::string b = "abc" + std::string("def");   // 右边是临时结果 → 自动处理
    std::println("b = {}", b);
}` },
        { t: `p`, text: `实测输出 data.size() = 1000、b = abcdef。最后一行那个加号右边是一个没有名字的临时 string，b 接它走的就是「自动那一套」：不用你写 std::move。` },
        { t: `h2`, text: `演示 2 · 给返回装上计数器，亲眼看见零复制零移动` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <utility>
int copyc = 0, movec = 0;                        // 两个计数器
struct Blob {
    std::string s_;
    explicit Blob(int n) : s_(n, 'x') {}
    Blob(const Blob& o) : s_(o.s_) { ++copyc; }
    Blob(Blob&& o) noexcept : s_(std::move(o.s_)) { ++movec; }
};
Blob make_plain() { Blob b(1000); return b; }        // 只写 return b;
Blob make_move()  { Blob b(1000); return std::move(b); }
int main() { Blob a = make_plain(); std::println("复制 {} 移动 {}", copyc, movec); }` },
        { t: `p`, text: `实测这一行是 复制 0 移动 0 —— 两个零说明这次返回一个字节都没搬。把 main 里换成 Blob a = make_move();，立刻变成 复制 0 移动 1。**多出来的那一次移动，就是那句 std::move 亲手请回来的。**` },
        { t: `p`, text: `再补一个更直观的证据：我在函数里打印局部变量的地址、在外面打印接收变量的地址。写 return b; 时两个地址**完全相同**，写 return std::move(b); 时两个地址不同 —— 前者是就地造好，后者确实造了两个对象。这就是「挡住一种编译器优化」落到机器上的样子。` },
        { t: `h2`, text: `演示 3 · 该你开口的时候长什么样` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <vector>
#include <utility>
int main() {
    std::string item = "整整一大段文字";
    std::vector<std::string> vec;
    vec.push_back(item);                       // 交副本：item 完好无损
    std::println("push_back(item) 之后 item 还剩 {} 个字符", item.size());
    vec.push_back(std::move(item));            // 交原件：item 被掏空
    std::println("push_back(std::move(item)) 之后 item 还剩 {} 个字符", item.size());
}` },
        { t: `p`, text: `实测两行：交副本之后 item 还剩 21 个字符，交原件之后还剩 0 个字符 —— 那个 21 是「整整一大段文字」这七个汉字占的字节数，size 数的就是字节。这两行正是本课的分界线：**item 有名字、这句之后还要用它**，就老老实实复制；后面确定不再碰它了，才轮到 std::move 出场。被掏空之后你再打印 item，得到空串，不报错 —— 这是第 134 课那条「被移走的变量只能重新赋值再用」在这里的具体长相。` },
        { t: `h2`, text: `演示 4 · 本课任务：返回一个拼好的 string` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
std::string summary() {
    int sum = 0;
    for (int i = 1; i <= 10; ++i) sum += i;
    std::string text = "1~10 的和 = " + std::to_string(sum);
    return text;                        // 直接 return 局部变量，一个字都不多写
}
int main() { std::println("{}", summary()); }` },
        { t: `p`, text: `实测输出 1~10 的和 = 55。std::to_string 是 std::string 一家的工具，请 <string> 就齐了。这段的写法本身就是任务的答案：把拼好的 string 当局部变量造出来，然后 return 它 —— 不要写 return std::move(text);。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `**给 return 加 std::move。** 对 vector 这种移动代价很小的容器，一次指针交接你从输出上看不出来，所以这个毛病最会藏。它真正咬人的地方在**只能复制的类型**上：实测给一个只有复制构造函数的类型写 return std::move(o);，复制次数从 0 变成 1 —— 整份数据重新抄一遍。判据背下来：返回**有名字的局部变量**，一律直接 return。`,
          `移完还在用。实测交原件之后 item 里剩 0 个字符，你接着打印它就得到空串，接着拿它去拼别的就得到一段缺字的结果。更坏的是这种代码常常不报错，只在某天数据莫名少一段。规矩：std::move 之后那个变量要么立刻重新赋值，要么就别再出现。`,
          `以为「自动移动」到处都有。它的判据是「马上就销毁」，所以**静态变量、全局变量、类的成员都不在其中** —— 它们出了函数还要活着，编译器不敢拆。实测一个函数返回自己留着的那个静态 vector，写 return cache; 就是货真价实的一整份复制，两次调用拿到的都是 1000 个元素。这种场合真想交原件必须你亲口写 std::move，而且要清楚家底就一份：实测写完 std::move 之后连续调用两次，第一次拿到 1000 个元素，第二次拿到 0 个。`,
          `用了 std::move 却不请 <utility>。本机实测只请 <string> 或 <vector> 一样编得过 —— libstdc++ 的内部头文件顺手把 move 带进来了。**这不表示写法对**：它靠的是别家实现的私有安排，换一套标准库就可能变成「std 里没有 move 这个成员」。头文件口径永远是「用了什么就请什么」，别把程序建在实现的好心上。`,
          `把「移动比复制快」当成无条件的话，于是到处补 std::move。第 136 课量过快慢，本课讲的是**时机**：移动只对确实不再被用的东西成立。多余的表态省不了什么，还让读代码的人以为这里有什么讲究 —— 而这里没有。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `写一个返回 std::string 的函数，拼出「1~10 的和 = 55」，直接 return 局部变量 —— 照演示 4 写完跑一遍，确认输出。`,
          `把演示 2 的 make_plain 里那句 return b; 改成 return std::move(b);，重跑看计数怎么变；再把两个地址各打印一次，确认从「相同」变成「不同」。`,
          `延伸一：给一个**只有复制构造函数、没有移动构造函数**的类型写两个返回函数，一个直接 return、一个加 std::move，各打印复制次数 —— 这一条看完你就明白那句多余的 move 到底值多少钱。`,
          `延伸二：把一个函数里留着的静态变量当返回值，分别写 return cache; 与 return std::move(cache);，各连续调用两次，比较第二次拿到的元素个数，然后回答：哪一种写法会让第二次调用拿到空东西。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：编译器看得见「马上就消失」，所以返回局部变量直接 return 就是最高效的写法 —— 实测连移动都不发生，对象一开始就长在调用者的格子里；std::move 只留给「有名字、以后还要不要它」这一件事。` }
      ]
    },
    {
      id: `m138`, title: `第 138 课 · reserve 预留容量：提前把地皮租够，一次家都不用搬`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：知道 vector 与 string 装不下时会「搬家式扩容」，会在规模已知的时候提前 reserve，并说清它买的是什么、不管的是什么。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 40 课请出 vector 的时候说过一句好话：**它是一块连着的内存**。连着，意味着第 0 个到第 999 个之间不许有别人住。所以当你要放第 1001 个、而后面的地皮已经被人占了，它只有一条路可走：**找一块更大的空地，把已有的一千个元素一个一个搬过去，再把旧地皮退掉**。这就是源稿那句「搬家式扩容」。` },
        { t: `p`, text: `搬家一次有多贵，跟「已经装了多少」成正比，这是它疼的地方。实测本机：往一个空 vector 里 push_back 一千个元素，它一共搬了 **11 次家**，容量台阶是 1、2、4、8、16、32、64、128、256、512、1024；一千个元素被重复搬动的总次数是 **1023 次**。换成 10 万个元素，搬家 17 次、元素搬迁 131071 次 —— 数字看着吓人，但注意它的**增长节奏**：元素多一千倍，人均被搬的次数并没有多一千倍。` },
        { t: `p`, text: `这就是每次翻倍的用心。如果每次装不下只多腾一个位置，那每加一个元素都要整批搬一次，一千万个元素的搬迁次数就冲到亿级；改成翻倍，前面的小块搬家都被后面那次大搬家**盖住了**，总量只跟最终规模成正比。所以「不 reserve」并不是慢得不能用，它已经是很便宜的策略了。` },
        { t: `p`, text: `那 reserve 买的是什么？源稿那句「一次租够 n 个位置」就是全部：**把 11 次搬家压成 1 次，把 1023 次元素搬迁压成 0 次**。代价是地皮要按你报的数一次付清，哪怕你最后只用上一半。它值不值，取决于一件事 —— **你事先知不知道要装多少个**。知道，就报给它；不知道，就别硬猜。` },
        { t: `code`, lang: `text`, code: `装不下   → 租一块更大的地皮 → 已有的元素全部搬过去 → 退掉旧地皮
reserve   → 现在就租够，之后的 push_back 一次家都不用搬
size 是「坐了几个人」，capacity 是「摆了几把椅子」—— reserve 只加椅子，不多坐人` },
        { t: `svg`, caption: `同样装一千个元素：不预留要沿容量台阶搬 11 次家、元素累计被搬 1023 次；先 reserve 就只租一次地、搬零次家。台阶图的每一格都是翻倍，所以总代价跟最终规模成正比，而不是平方`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 274">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">一千次 push_back 的两条路</text>
  <g font-size="12" fill="#26405a">
    <text x="16" y="44" font-weight="700" fill="#b8500f">不预留：容量沿台阶翻倍，每次跳一格就搬一次家</text>
    <rect x="16" y="52" width="56" height="26" rx="4" fill="#fdece1" stroke="#b8500f"/><text x="44" y="69" text-anchor="middle">1</text>
    <rect x="78" y="52" width="56" height="26" rx="4" fill="#fdece1" stroke="#b8500f"/><text x="106" y="69" text-anchor="middle">2</text>
    <rect x="140" y="52" width="56" height="26" rx="4" fill="#fdece1" stroke="#b8500f"/><text x="168" y="69" text-anchor="middle">4</text>
    <rect x="202" y="52" width="56" height="26" rx="4" fill="#fdece1" stroke="#b8500f"/><text x="230" y="69" text-anchor="middle">8</text>
    <rect x="264" y="52" width="56" height="26" rx="4" fill="#fdece1" stroke="#b8500f"/><text x="292" y="69" text-anchor="middle">…</text>
    <rect x="326" y="52" width="56" height="26" rx="4" fill="#fdece1" stroke="#b8500f"/><text x="354" y="69" text-anchor="middle">512</text>
    <rect x="388" y="52" width="96" height="26" rx="4" fill="#fdece1" stroke="#b8500f" stroke-width="2"/><text x="436" y="69" text-anchor="middle">1024</text>
    <text x="496" y="69" fill="#b8500f" font-weight="700">搬家 11 次 · 搬元素 1023 次</text>

    <text x="16" y="106" font-weight="700" fill="#1d7a3c">先 reserve：一次租够 1000 个位置</text>
    <rect x="16" y="114" width="468" height="26" rx="4" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/>
    <text x="250" y="131" text-anchor="middle">容量 1000，从头到尾没换过地皮</text>
    <text x="496" y="131" fill="#1d7a3c" font-weight="700">搬家 0 次 · 搬元素 0 次</text>

    <rect x="16" y="158" width="608" height="56" rx="8" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1"/>
    <text x="30" y="178" fill="#33465e">为什么翻倍已经够便宜：小台阶的搬家次数多，但每次搬的元素少，加起来被后面那次大的盖住了。</text>
    <text x="30" y="198" fill="#33465e">reserve 买的是「把 11 次压成 1 次」，卖的是「地皮按你报的数一次付清」—— 规模未知时这笔买卖不划算。</text>
    <text x="16" y="240" fill="#00599c" font-weight="700">判断口径只有一条：数量事先知道吗？知道就 reserve，不知道就让它自己翻倍。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `这里要说清一件容易误会的事：**不 reserve 不是错**。翻倍策略把总代价压到跟规模成正比，日常几百几千个元素你根本感觉不到搬家。reserve 是给「规模已知而且不小」那一类留的口子 —— 从文件里读出十万行、题目讲明有一万个数。这种场合报一个数过去，省下的是成串的分配调用和整批整批的元素搬迁。反过来报一个虚高的数也不要脸地贵：椅子摆一千把、只坐三个人，那块地皮就一直空着。` },
        { t: `h2`, text: `演示 1 · 源稿这段：跑出来两个都是 15` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
int main() {
    std::string s1;                          // 不预留：装不下就一次次搬家
    for (int i = 0; i < 5; ++i) s1 += "abc";
    std::println("不预留: 容量 = {}, 内容 = {}", s1.capacity(), s1);
    std::string s2;
    s2.reserve(15);                          // 预留 15 个字符的位置
    for (int i = 0; i < 5; ++i) s2 += "abc";
    std::println("预留后: 容量 = {}, 内容 = {}", s2.capacity(), s2);
}` },
        { t: `p`, text: `实测两行都是 容量 = 15 —— **这个演示在本机上看不出 reserve 的作用**。原因不是 reserve 失效，而是 std::string 自带一个小盒子：字符串短到十五个字符以内，它就不去堆上租地皮，容量天生是 15。源稿那五个 += 恰好拼出十五个字符，全程没出小盒子，租不租都一样。**想看见搬家，得先装满过 15 个字符** —— 这就是演示 2 换更大的量的原因。` },
        { t: `h2`, text: `演示 2 · 换成三十六个字符，搬家才现形` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
int main() {
    std::string s;
    std::print("不预留，每次拼进 6 个字符: 容量 {}", s.capacity());
    for (int i = 0; i < 6; ++i) { s += "abcdef"; std::print(" -> {}", s.capacity()); }
    std::println("");
    std::string t; t.reserve(36);
    std::print("先 reserve 36: 容量 {}", t.capacity());
    for (int i = 0; i < 6; ++i) { t += "abcdef"; std::print(" -> {}", t.capacity()); }
    std::println("");
}` },
        { t: `p`, text: `实测第一行是 容量 15 -> 15 -> 15 -> 30 -> 30 -> 30 -> 60：拼到第十八个字符容量跳到 30，拼到第三十六个跳到 60 —— 搬了两次家。第二行 reserve 三十六之后，六次拼接容量一路都是 36，一次没搬。判断搬家靠的就是「容量什么时候跳」：一跳，说明地皮换了。` },
        { t: `h2`, text: `演示 3 · 给元素装上计数器，数清被搬了多少次` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
int copies = 0, moves = 0;
struct Item {
    int v_;
    explicit Item(int v) : v_(v) {}
    Item(const Item& o) : v_(o.v_) { ++copies; }
    Item(Item&& o) noexcept : v_(o.v_) { ++moves; }
};
int main() {
    std::vector<Item> v;                     // 加一行 v.reserve(1000); 数字就变
    for (int i = 0; i < 1000; ++i) v.push_back(Item(i));
    std::println("复制 {} 移动 {}, 最终容量 {}", copies, moves, v.capacity());
}` },
        { t: `p`, text: `实测输出 复制 0 移动 2023, 最终容量 1024。在 push_back 那句前面加一行 v.reserve(1000);，同一份程序变成 **复制 0 移动 1000, 最终容量 1000**。这两个数字要拆开读：那一千次是 push_back 把临时 Item 交给容器时的自动移动，属于上一课的内容，reserve 管不着它；**被清零的是多出来的 1023 次 —— 那正是 11 次搬家攒下来的**：第一次搬 1 个、第二次搬 2 个、第四次搬 8 个，一路加到 512。` },
        { t: `p`, text: `复制始终是 0 这一条值得记：搬家走的是**移动**不是复制 —— 元素自己得能被移动，搬家才便宜。这也解释了为什么第 133 到 136 课要先讲移动：不懂它，这 1023 次你就不知道它疼在哪。` },
        { t: `h2`, text: `演示 4 · 本课任务：已知要装一万个 int` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
int main() {
    std::vector<int> data;
    data.reserve(10000);                 // 已知要装一万个：地皮一次租够
    for (int i = 0; i < 10000; ++i) data.push_back(i);
    std::println("size = {}, capacity = {}", data.size(), data.capacity());
}` },
        { t: `p`, text: `实测输出 size = 10000, capacity = 10000。任务那一行代码就是 data.reserve(10000);。顺手看两个数字的关系：push_back 满一万个之后 size 才追上 capacity；如果只塞三个元素，你会看到 size = 3 而 capacity = 10000 —— **椅子比人多，这不是 bug，这就是 reserve 的作用**。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `reserve 之后拿 v[0] 当「已经存在的元素」用。实测 v.reserve(10000) 之后 size 仍然是 0 —— 地皮租了，人还没坐下。此时 v[0] 是在没有元素的位置上读写：编译器不拦，运行时常常也不报，只是某天给你一个垃圾值，或者直接把程序按下去。想先有一万个能按下标写的格子，就用第 40 课那个带元素个数的构造；只想往里加，就交给 push_back。`,
          `以为 reserve 保证容量正好是你报的数。标准只承诺「不少于」，实测本机 g++ 给得正好（报 1000 得到 1000、报 10000 得到 10000），但这是实现的习惯不是保证。别拿 capacity 当契约写逻辑，要判断有没有元素只看 size。`,
          `一边搬家一边攥着旧地址不放。实测搬一次家之后 data 的地址就换了，这是 vector 的老规矩：**一旦扩容，之前拿到的引用、指针、以及你记住的那个位置全部作废**。留着「我先取一个 v[0] 存起来，再一路 push_back」的写法，攥着的可能就是拆掉的旧地皮。把 reserve 放在取引用之前，或者干脆记索引而不是记引用。`,
          `拿 string 那个源稿演示当结论。实测两个都是 15：短字符串本来就住在自带的小盒子里，十五个字符以内根本不谈搬家。想验证 reserve，量要够大 —— 本课换成三十六个字符才看见台阶。`,
          `什么规模都 reserve，或者顺手报一个虚高的数。搬家的钱确实省了，地皮的钱是实打实花掉的：报一百万个 int 的位置，就是几百 KB 一直押在那儿，哪怕只装三个。稳的口径是「数量已知、而且数量不算小」才报，几千以内的常规容器交给翻倍策略就好。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `已知要装 10000 个 int，写出给 vector<int> 预留容量的一行代码 —— 照演示 4 跑一遍，把 size 与 capacity 都打印出来。`,
          `把演示 2 的六次拼接改成二十次，观察容量什么时候跳、一次跳几格，再算算一共搬了几次家。`,
          `延伸一：在演示 3 里加上 v.reserve(1000); 重跑，确认多出来那 1023 次没了；然后把一万个元素换成十万个、去掉 reserve，看移动次数跳到多少，再跟最终容量对一对。`,
          `延伸二：只 reserve 不 push_back，把 size 与 capacity 各打印一次，然后回答：为什么这时候用 v[0] 是错的。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：vector 与 string 装不下就整块搬家，代价跟已装数量成正比；reserve 把「搬很多次」换成「搬一次」，值得用前提是数量事先知道 —— 它只加椅子，不多坐人，size 才是有元素的那个数。` }
      ]
    },
    {
      id: `m139`, title: `第 139 课 · 为什么要拆文件：一张图纸住 .h，一份零件住 .cpp`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：说清一个文件写天下为什么撑不住，会用 namespace 把功能分区预演拆分，并当场明白 .h、.cpp 与 #pragma once 各是干什么的。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `从第 1 课到今天，我们每份代码都写在一个文件里，这件事一直成立是因为文件还小。等你写到一个文件八百行，三个症状会一起上门：**找一个函数翻半天**、**改一行要等整个文件重编**、**别人想用你某个功能只能整份抄走**，连带一堆他用不着的东西。源稿那个类比很直白：课本、水壶、球鞋全塞一个书包。` },
        { t: `p`, text: `拆文件要做的第一件事，是把**「我这儿有什么」和「这些东西怎么做」分开**。前者写进 .h 文件，业内叫头文件，它是一份功能清单：只列函数长什么样 —— 名字、参数、返回类型，末尾一个分号，没有函数体。后者写进 .cpp，是真正干活的零件，函数体住在这里。谁要用你的功能，就 include 你的 .h —— 它到底凭什么干活，下一课整节讲，今天先记住它的作用：**把这份清单抄进我的文件里**。` },
        { t: `p`, text: `拆开的第二件事，是**给每块功能挂一个名字**。源稿先用 namespace 预演：它把一个文件切成几个区，调用时写成 区名::函数名，那个双冒号读作「里面的」。它买的东西很具体 —— 两个人都写了个叫 triple 的函数，挂在不同的区里就撞不了车，而且一眼看得出功能归谁管。真实项目里，**每一个区将来就是一个独立的 .h 加一个 .cpp**。` },
        { t: `p`, text: `「改一处只重编那一处」是能量出来的。实测本机：这个三文件工程里，单独编 main.cpp 要 1.29 秒，单独编 my_tools.cpp 要 0.30 秒。你改 main.cpp 一行再编，那 0.30 秒那份**根本不重跑**；代码全挤在一个文件里，改一个字就得重编整个文件。` },
        { t: `svg`, caption: `.h 是清单、.cpp 是零件、main 也只是另一个零件。三份各自编译，最后拼成一个可执行文件：清单缺了编译器当场不认识这个名字，零件缺了要到拼装时才报 undefined reference，同一份零件交两遍则报 multiple definition`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 276">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">一个功能拆成三份，各干各的</text>
  <g font-size="12" fill="#26405a">
    <rect x="16" y="36" width="180" height="46" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
    <text x="106" y="55" text-anchor="middle" font-weight="700">my_tools.h</text>
    <text x="106" y="73" text-anchor="middle">清单：签名加 pragma once</text>

    <rect x="222" y="36" width="190" height="46" rx="8" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/>
    <text x="317" y="55" text-anchor="middle" font-weight="700" fill="#1d7a3c">my_tools.cpp</text>
    <text x="317" y="73" text-anchor="middle">零件：函数体住这里</text>

    <rect x="438" y="36" width="186" height="46" rx="8" fill="#ffffff" stroke="#8b98ab" stroke-width="2"/>
    <text x="531" y="55" text-anchor="middle" font-weight="700">main.cpp</text>
    <text x="531" y="73" text-anchor="middle">使用者：include 那份清单</text>

    <path d="M317 86 V120" stroke="#57677c" stroke-width="2.5"/><polygon points="317,120 311,110 323,110" fill="#57677c"/>
    <path d="M531 86 V120" stroke="#57677c" stroke-width="2.5"/><polygon points="531,120 525,110 537,110" fill="#57677c"/>
    <text x="238" y="112" fill="#33465e">各自编译，改谁重编谁</text>
    <rect x="238" y="124" width="160" height="32" rx="6" fill="#f4f6f9" stroke="#8b98ab"/>
    <text x="318" y="145" text-anchor="middle">my_tools.o 零件</text>
    <rect x="452" y="124" width="160" height="32" rx="6" fill="#f4f6f9" stroke="#8b98ab"/>
    <text x="532" y="145" text-anchor="middle">main.o 零件</text>
    <path d="M402 158 H450" stroke="#57677c" stroke-width="2"/><polygon points="450,158 440,152 440,164" fill="#57677c"/>
    <rect x="238" y="172" width="374" height="30" rx="6" fill="#eaf3fb" stroke="#00599c" stroke-width="2"/>
    <text x="425" y="192" text-anchor="middle">两份零件拼成可执行文件</text>

    <rect x="16" y="214" width="608" height="46" rx="8" fill="#fdece1" stroke="#b8500f" stroke-width="1"/>
    <text x="30" y="232" fill="#b8500f">三种缺法实测各有各的长相：没 include 那份清单 —— my_tools has not been declared，编译期就拦；</text>
    <text x="30" y="250" fill="#b8500f">清单有了、零件没交 —— undefined reference，拼装阶段才报；同一份零件交两遍 —— multiple definition。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `拆文件的规矩可以浓缩成一句：**清单可以重复看，零件只能交一遍**。编译器一次只认一个 .cpp，把每份都单独编译成一块零件；到拼装那一步，同一块零件出现两次，谁也不知道该用哪一份，于是报 multiple definition。这条也解释了 .h 里为什么不写函数体 —— 函数体一旦写进清单，每个请了它的 .cpp 都带上一个一模一样的零件。` },
        { t: `p`, text: `代价也要说清：拆完之后「哪几份 .cpp 要一起编」得由你说 —— 命令里少写一个文件，编译器不在源码层面拦你，它一路放行到最后才报缺零件。` },
        { t: `h2`, text: `演示 1 · 源稿这段：先用 namespace 分区预演` },
        { t: `code`, lang: `c++`, code: `#include <print>
namespace math_tools {                    // 将来 = math_tools.h 加 math_tools.cpp
    int add(int a, int b) { return a + b; }
}
namespace greet_tools {                   // 将来 = greet_tools.h 加 greet_tools.cpp
    const char* hello() { return "你好，多文件世界"; }
}
int main() {
    std::println("{}", math_tools::add(3, 4));      // 像调用「别的文件」的功能
    std::println("{}", greet_tools::hello());
}` },
        { t: `p`, text: `实测两行：7、你好，多文件世界。整段还在一个文件里，但 main 已经是在「用别人的功能」了 —— 区名加双冒号这一层壳，就是将来文件之间的那道门。hello 的返回类型 const char* 是老式的一句话写法，源稿用的就是它，本课重点在区不在它。` },
        { t: `h2`, text: `演示 2 · 真的拆成三个文件` },
        { t: `code`, lang: `c++`, code: `#pragma once                             // 这份清单在每个 .cpp 里只被抄一遍
#include <string>
namespace my_tools {
    int triple(int x);                   // 只写签名：图纸不给看怎么做
    std::string banner(int sum);
}` },
        { t: `p`, text: `上面这份是 my_tools.h。第一行 #pragma once 要当场说明白：它说话的对象不是编译器，是**编译开始前那位照抄的抄写员**，意思是「这份文件已经抄进来过，就别再抄第二遍」。为什么需要它？因为你迟早会在两份清单里撞见同一份图纸，图纸上的东西被抄两遍就报重复定义；写在 .h 第一行，这麻烦就永远不用你管。` },
        { t: `code`, lang: `c++`, code: `#include "my_tools.h"                    // 零件也要看清单，签名得跟清单对上
namespace my_tools {
    int triple(int x) { return x * 3; }
    std::string banner(int sum) { return "1~10 的和 = " + std::to_string(sum); }
}` },
        { t: `p`, text: `这份是 my_tools.cpp。本机实跑的命令是把两份 .cpp 一起交上去：g++ -std=c++23 main.cpp my_tools.cpp -o app，输出是 21、1~10 的和 = 55。include 用双引号而不是尖括号，意思不一样：尖括号去标准库和 -I 指定的目录里找，双引号先在这个 .cpp 自己所在的目录找。实测把 my_tools.h 写成尖括号又没给 -I，报的是 fatal error: my_tools.h: 没有那个文件或目录。` },
        { t: `h2`, text: `演示 3 · 两种缺法，报错长在两个不同阶段` },
        { t: `code`, lang: `shell`, code: `g++ -std=c++23 main.cpp -o app             # 命令里漏交 my_tools.cpp
main.cpp:(.text+0x22): undefined reference to my_tools::triple(int)

g++ -std=c++23 x1.cpp x2.cpp -o xo          # 同一个 triple 在两份 .cpp 里各定义一次
x2.cpp:(.text+0x0): multiple definition of my_tools::triple(int)` },
        { t: `p`, text: `两段都是本机实测；报错原文里函数名两侧还裹着两个装饰符号，这份稿子里我把它们去掉了。两条的**位置**完全不同：undefined reference 是「图纸我看到了，零件你没交」，出现在最后拼装那一步，源码里挑不出毛病；multiple definition 是「同一块零件交了两遍」。认得这两句长相，以后少熬很多夜。` },
        { t: `h2`, text: `演示 4 · 本课任务：再加一个区，写 triple 并在 main 里调用` },
        { t: `code`, lang: `c++`, code: `#include <print>
namespace math_tools { int add(int a, int b) { return a + b; } }
namespace my_tools   { int triple(int x) { return x * 3; } }
int main() {
    std::println("{}", math_tools::add(3, 4));
    std::println("{}", my_tools::triple(7));
}` },
        { t: `p`, text: `实测输出 7、21。任务要的三件事都在里面：新加一个区 my_tools、里面 triple 返回三倍、main 用双冒号调它。顺带体会区的第二样本事：add 与 triple 谁也没挡住谁，因为它们的全名不同。` },        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把函数体写进 .h，然后两个 .cpp 都请了这份清单。实测报错是 redefinition of int helper(int)，另一条常见长相是 redefinition of struct 后面跟类名。根因就是「清单可以重复看，零件只能交一遍」：函数体是零件，抄进两份清单就成了两份。规矩：**.h 只放签名，函数体放 .cpp**。`,
          `新增一个 .cpp，忘了把它加进编译命令。实测报的是 undefined reference to my_tools::triple(int)，它长在链接器的消息里，跟「某某 has not been declared」那种源码报错不是一个长相 —— 你会去翻 main.cpp，可 main.cpp 是对的。修法：把缺的那份补进命令。`,
          `以为「清单被抄两遍一定报错」。实测不报：只有签名的 .h 在同一个 .cpp 里 include 两次，退出码是 0 —— **声明允许重复，定义不允许**。清单里一旦有类定义或函数体，第二次抄进来当场炸。`,
          `include 的位置随手挪。那位抄写员是**从上往下**照抄的：清单必须出现在用到它的语句之前，写在后面等同于没请，实测报错就是 my_tools has not been declared 那一句。区名也别随手起，人人都用 tools 这种词，代码越长越难找 —— 区是「这块功能归谁管」的门牌，按功能起名：math_tools 就是管数学那几件的。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `加一个 namespace my_tools，写个 triple 返回三倍，并在 main 里调用 —— 照演示 4 跑一遍，确认两行输出。`,
          `把演示 1 那个单文件真的拆成三个文件：math_tools.h、math_tools.cpp、main.cpp，再用一条 g++ 命令把两份 .cpp 一起编出来跑通。`,          `延伸一：从编译命令里删掉 my_tools.cpp，只留 main.cpp，看清那句 undefined reference 报在哪一行，补回来再跑。`,
          `延伸二：删掉 .h 里的 #pragma once，在 main.cpp 里把同一份清单 include 两遍，先猜会不会报错再跑；然后在清单里加一个类的定义，重跑一次，看报错怎么变。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：拆文件买的是三样东西 —— 找得到、改一处只重编一处、别人能只借他想要的那块；落法是「清单在 .h、零件在 .cpp」，第一行的 #pragma once 保证清单不被抄两遍，而哪几份 .cpp 要一起编，得由你说清楚。` }
      ]
    },
    {
      id: `m140`, title: `第 140 课 · include 的本质：编译开始之前，有一位只照抄的抄写员`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：知道 #include 干的是复制粘贴、#define 干的是机械换词，会用 -E 亲眼看见展开结果，并说清宏参数那对括号为什么保平安。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课留了一个问题：include 一句别人的 .h，到底是凭什么「用上」的？答案朴素得有点扫兴：**在编译器开始看懂 C++ 之前，先有一位抄写员把整份文件抄了一遍**。它不懂类型、不懂作用域、不认识 class 也不认识函数，它只会照字面办事，做两件事。` },
        { t: `p`, text: `第一件：**看到 include，就把那份文件的内容原样抄进你这一行的位置**。尖括号的去标准库目录和 -I 指定的目录里找，双引号的先在这个文件自己所在的目录找 —— 这是上一课那条规矩在下层的样子。第二件：**看到 define，就把那个名字换成它后面跟的那串字**，换完就完，不检查换出来的东西讲不讲道理。抄完之后，编译器才第一次睁开眼，看到的是一份已经没有 include、也没有宏名的巨大文本。` },
        { t: `code`, lang: `text`, code: `你写的文件   ： 两行代码，加一句 include 与一句 define
抄写员做完   ： 那一句 include 变成几万行，宏名全部就地换成字面
编译器看到的 ： 一份完整的巨大文本 —— 它从头到尾没做过「查找并借用」这件事` },
        { t: `p`, text: `「几万行」不是我吓你，是实测本机：一个只写了 include print 再加 main 的文件，抄完是 **65779 行**；换成 include vector 加 string，是 **39777 行**；什么都不 include 的同一份 main，只有 **7 行**。上一课算的那 1.29 秒，烧掉的正是这些抄进来的行数 —— 你现在应该能看懂那句话：**include 一行，代价是几万行的阅读**。` },
        { t: `svg`, caption: `抄写员只负责抄与换，编译器才负责懂。实测本机三个数字：不 include 展开 7 行，请 vector 加 string 是 39777 行，请 print 是 65779 行 —— 编译慢就慢在这里`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 268">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">一份文件在编译器睁眼之前的遭遇</text>
  <g font-size="12" fill="#26405a">
    <rect x="16" y="36" width="164" height="62" rx="8" fill="#ffffff" stroke="#8b98ab" stroke-width="2"/>
    <text x="98" y="56" text-anchor="middle" font-weight="700">你写的 .cpp</text>
    <text x="98" y="76" text-anchor="middle">include 一行</text>
    <text x="98" y="92" text-anchor="middle">define 一行</text>
    <path d="M184 67 H226" stroke="#57677c" stroke-width="2.5"/><polygon points="226,67 216,61 216,73" fill="#57677c"/>
    <rect x="232" y="42" width="150" height="50" rx="8" fill="#eaf3fb" stroke="#00599c" stroke-width="2"/>
    <text x="307" y="62" text-anchor="middle" font-weight="700" fill="#00599c">抄写员</text>
    <text x="307" y="82" text-anchor="middle">只照字面办，不懂 C++</text>
    <path d="M386 67 H428" stroke="#57677c" stroke-width="2.5"/><polygon points="428,67 418,61 418,73" fill="#57677c"/>
    <rect x="434" y="42" width="190" height="50" rx="8" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/>
    <text x="529" y="62" text-anchor="middle" font-weight="700" fill="#1d7a3c">展开后的巨大文本</text>
    <text x="529" y="82" text-anchor="middle">交给编译器，这时才讲类型</text>

    <text x="16" y="126" font-weight="700">本机实测：展开以后有多少行</text>
    <rect x="16" y="136" width="76" height="30" rx="6" fill="#f4f6f9" stroke="#8b98ab"/><text x="54" y="156" text-anchor="middle">7 行</text>
    <text x="100" y="156">什么都不 include</text>
    <rect x="232" y="136" width="110" height="30" rx="6" fill="#fdece1" stroke="#b8500f"/><text x="287" y="156" text-anchor="middle">39777 行</text>
    <text x="350" y="156">请 vector 加 string</text>
    <rect x="470" y="136" width="110" height="30" rx="6" fill="#fdece1" stroke="#b8500f" stroke-width="2"/><text x="525" y="156" text-anchor="middle">65779 行</text>
    <text x="434" y="156" text-anchor="end">请 print：</text>

    <rect x="16" y="184" width="608" height="44" rx="8" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1"/>
    <text x="30" y="202" fill="#33465e">看成品用的命令是 g++ -std=c++23 -E 你的文件 —— 它只干活到抄完为止，不进编译器。</text>
    <text x="30" y="220" fill="#33465e">展开结果里那些井号加行号加文件名的行不是代码，是门牌号：出事时告诉你这段是从哪份文件抄来的。</text>
    <text x="16" y="252" fill="#00599c" font-weight="700">所以 include 不是「借用」，是「复制粘贴」；宏不是「调用」，是「换词」。这两句是这一课的全部。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `为什么要留一位这么笨的抄写员？因为它**便宜到不需要理解任何东西**：一套语言要能在几十年里被无数工具、无数平台拼起来，靠的就是「先把文本拼好、再交给语言本身」这一步。C++ 到今天才慢慢有了真正的模块机制，那是后面的事；此外的年月里，包括你今天写的每一行 include，走的都是这条路。` },
        { t: `p`, text: `便宜的另一面是**它不给你兜底**。函数调用有类型检查、有作用域、名字查找讲规矩；宏什么保证都没有 —— 它把字换成另一串字，换出来的是什么它就负责什么。所以这一课的口诀是：**能用函数和常量就别用宏；非用宏不可时，参数两侧要括、整体外面还要括。**` },
        { t: `h2`, text: `演示 1 · 源稿这段：TRIPLE 干的就是换词` },
        { t: `code`, lang: `c++`, code: `#include <print>
#define TRIPLE(x) ((x) * 3)        // 抄写员把 TRIPLE(7) 抄成 ((7) * 3)
int main() {
    std::println("{}", TRIPLE(7));        // 编译器实际看到：((7) * 3)
    std::println("{}", TRIPLE(2 + 3));    // 抄成 ((2 + 3) * 3) = 15
}` },
        { t: `p`, text: `实测输出 21、15。第二行是本课的关键一眼：**参数 2 + 3 是原样搬进去的**，不是先算成 5 再乘 —— 那对把它整个括起来的括号，就是让它仍然先算加法的原因。这里的 x 没有任何类型，编译器看到的是一个乘法表达式，它压根不知道曾经有个叫 TRIPLE 的东西。` },
        { t: `h2`, text: `演示 2 · 用 -E 亲眼看见抄写员的成品` },
        { t: `code`, lang: `shell`, code: `g++ -std=c++23 -E mac.cpp | tail -5
# 3 "mac.cpp"
int main() {
    std::println("{}", ((7) * 3));
    std::println("{}", ((2 + 3) * 3));
}` },
        { t: `p`, text: `-E 的意思是「只请抄写员干活，不进编译器」。这份本机成品里能读到三件事：宏名已经全部消失，换成了字面文本；那句 include print 抄进来的几万行都在前面，被我的 tail 截掉了；开头那行井号 3 文件名的东西是门牌号，源码里报错时的行号靠它对上。注意第二行 —— 传进去的是 2 + 3 这三个字，抄出来还是这三个字，只是被那对括号保住了性命。` },
        { t: `h2`, text: `演示 3 · 本课任务：QUAD 与不给括号的那一版` },
        { t: `code`, lang: `c++`, code: `#include <print>
#define QUAD(x) ((x) * 4)
#define RAWQUAD(x) x * 4           // 故意：参数不括、整体也不括
int main() {
    std::println("QUAD(1 + 1) = {}", QUAD(1 + 1));
    std::println("RAWQUAD(1 + 1) = {}", RAWQUAD(1 + 1));
}` },
        { t: `p`, text: `实测两行：8、5。源稿任务那句「验证结果是 8 不是 5」说的就是这一对。差别全在括号：QUAD 抄成 ((1 + 1) * 4)，先算括号里的 2 再乘 4；RAWQUAD 抄成 1 + 1 * 4，先乘后加的规矩让它得 5 —— **同一个宏名，两种写法，差一个数字，而且编译一路绿灯，一个错都不报。**` },
        { t: `h2`, text: `演示 4 · 宏没有作用域，也不碰字符串` },
        { t: `code`, lang: `c++`, code: `#include <print>
#define LIMIT 100                  // 不带参数：名字换成后面那串字
int main() {
    std::println("上限是 {}", LIMIT);
    std::println("字符串里的 LIMIT 这五个字不动");
    // int LIMIT = 5;              // 取消注释：expected unqualified-id before numeric constant
}` },
        { t: `p`, text: `实测两行输出：上限是 100、字符串里的 LIMIT 这五个字不动。第二段那行注释是我要你亲手试的：**它不是「名字撞车」那么客气**，抄写员把 LIMIT 换成 100，那句声明就成了 int 100 = 5，编译器报 expected unqualified-id before numeric constant —— 它看到的根本不是一个名字，而是一个数字。宏从它被定义那一刻起，在这份文件剩下的每一处都换，没有哪个函数里才算数这回事。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `宏参数不括、整体不括。实测 RAWQUAD 那版给出 5 而正确答案是 8，编译一句不报。规矩背下来：**参数两侧要括，整个替换内容外面还要再括一层**，写成 ((x) * 4) 这个样子。少任何一层，你都在赌传进来的表达式里没有别的运算符。`,
          `宏的参数会被重复抄写，所以带副作用的实参要出钱。实测 DOUBLE 那个宏写成 ((x) + (x))，传 i++ 进去得到 3、跑完 i 变成了 3 —— x 被抄了两遍，那个加一也就被执行了两遍。函数只会把值算一次传进去，宏不做这件事；而且实测到的这个 3 还不可信，重复求值加改顺序在标准里没有保证，别拿它当规律。`,
          `宏名当了变量名。实测那句 int LIMIT = 5 报的是 expected unqualified-id before numeric constant。看着完全看不懂是为什么，因为报错发生在换词之后。宏不参与作用域，也别指望它只在你的常量里出现 —— **宏名一律写成全大写**，就是为了让它跟变量名一眼分得开。`,
          `宏名拼错，报错长得像「没声明」。实测把 QUAD 写成 QUD，报的是 QUD was not declared in this scope，后面还贴心地跟一句 did you mean QUAD。根因不神秘：抄写员只认识它见过的 define，没见过就原样交给编译器，编译器第一次见到这个词。看到「某某未声明」而你觉得明明写过，先去看 define 那行的拼写。`,
          `以为 include 是「借用」别人的功能，所以随手往 .h 里塞一堆 include。上一课那条 redefinition 报错、这一课那个 65779 行，两件事合起来才是完整答案：include 是**复制粘贴**，你在 .h 里请进来的每一行，都会被抄进每一个用了这份 .h 的 .cpp 里。清单上只写签名，需要的头文件请到自己那一份里，这是拆文件之后最要紧的一条卫生。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `写个宏 QUAD 返回四倍，打印 QUAD(1 + 1)，验证结果是 8 不是 5 —— 照演示 3 跑一遍，两行输出都对上。`,
          `把你上一课那个三文件工程里任意一份 .cpp 用 -E 展开，数一数一共抄出多少行；再把 include print 那行换成 include vector 换成 include string，各数一次，跟本课那三个实测数字对上。`,
          `延伸一：把 QUAD 改成不括号那一版（就是演示 3 里的 RAWQUAD），跑一遍看到 5，然后用展开结果解释这一步是怎么走歪的。`,
          `延伸二：定义一个不带参数的宏 LIMIT 等于 100，然后在 main 里写一句 int LIMIT = 5;，看清那句看不懂的报错；删掉它，改成同名的小写变量，想想为什么函数没有这种毛病。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：include 是复制粘贴、define 是机械换词，编译器看到的从来是一份已经抄好的巨大文本 —— 实测一个 print 就抄进 65779 行；宏不懂类型也不懂作用域，所以参数括、整体括，能用函数就别用宏。` }
      ]
    }
  ]
};
