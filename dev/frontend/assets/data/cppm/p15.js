/* 喵站 · C++ 掌握 正文分部 p15：第 133–136 课（第九轮）
 *
 * 源稿：133_复制与移动.cpp、134_亲眼看见复制和移动.cpp、135_传参的代价.cpp、136_移动到底快多少.cpp
 * 第 118 课列过五件套的名单，第 122 课已经用过 std::move 转交所有权。这四课把「抄一份」和
 * 「整屋搬走」摊开看：先分清两件事，再让类自己喊出走了哪条门，然后算传参的账，最后上秒表实测。
 * 写法照 p10：讲「为什么这么想」，不只讲「语法长这样」。所有输出与耗时都经本机
 * g++ -std=c++23 实跑核对；计时那一组不加优化与 -O2 各跑过，数字以正文标注的为准。
 */
window.MIAO_CPPM_P15 = {
  chapters: [
    {
      id: `m133`, title: `第 133 课 · 复制与移动：抄一份，还是整屋搬走`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：分清复制与移动这两种交接方式，会写 std::move，并能说清移动之后原对象处在什么状态、为什么大对象才值得搬。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 118 课那份五件套名单里，有两位是搬家手续：拷贝构造与移动构造。那节课讲怎么写，本课只问一件事：**对象交出去的那一刻走的到底是哪扇门，两扇门后面机器干的活差多少。**` },
        { t: `p`, text: `源稿那对类比已经把答案说完了。复制 = 把家里每样东西再买一份放进新家，旧房子照旧住着 —— 慢，而且占双倍地方。移动 = 直接把家当搬过去，旧房子当场空下来 —— 快，交接的其实只是「这堆东西现在归谁」。` },
        { t: `p`, text: `落到机器上，这个「只是所有权」特别具体。一个 std::vector 或 std::string 对象，本身在栈上只占很小一格：它手里攥着**指向堆上那块数据的指针**，外加长度、容量几个数。真正的几十万个元素**不在它身上，在堆上**。于是两条路的账单立刻拉开：复制要再申请一块同样大的内存，把元素一个一个抄过去；移动只把「数据在哪、有多长」抄给对方，再把对方手里那几个数抹成空。**一边按元素个数花钱，一边固定花三下。**` },
        { t: `code`, lang: `text`, code: `std::vector<int> a(3, 7);        a 手里：指针 + 长度 + 容量；数据在堆上那一块

复制  std::vector<int> b = a;
  a 手里 ──> 原有那块 [7 7 7]        照旧用
  b 手里 ──> 新买一块 [7 7 7]        一次分配 + 逐个抄

移动  std::vector<int> c = std::move(a);
  c 手里 ──> 原有那块 [7 7 7]        换主人，一格数据都没动
  a 手里 ──> 什么都不指向            被抹成空壳` },
        { t: `p`, text: `最容易被名字带偏的是第二件事：**std::move 一个字节都不搬。**它是一句声明，把后面那个对象标成「这东西我可以不要了」，真把内存交接过去的仍然是移动构造函数 —— 第 122 课你交 unique_ptr 时写的也是这句话。所以要不要写 std::move，问的不是性能，是语义：**这个对象后面我还用不用？**照旧要用就只能抄，打算再也不碰才可以搬。` },
        { t: `svg`, caption: `同一条赋值形状，两条路线的机器活：复制按元素个数花钱，还要多占一块内存；移动只交接「数据在哪」这几个数，原件被抹空，堆上那一块一格没动`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">一手数据，两种交接</text>
  <g font-size="12" fill="#26405a">
    <rect x="16" y="34" width="110" height="34" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
    <text x="71" y="55" text-anchor="middle" font-weight="700">a 手里的数</text>
    <path d="M132 51 H174" stroke="#57677c" stroke-width="2.5"/><polygon points="174,51 164,45 164,57" fill="#57677c"/>
    <rect x="180" y="34" width="150" height="34" rx="8" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/>
    <text x="255" y="55" text-anchor="middle">堆上那块 [7 7 7]</text>
    <text x="352" y="55" fill="#57677c">起点：一个 vector，数据在别处</text>

    <text x="16" y="96" font-weight="700" fill="#b8500f">路线一 · 复制：std::vector&lt;int&gt; b = a</text>
    <rect x="16" y="104" width="110" height="32" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/>
    <text x="71" y="124" text-anchor="middle">a 照旧</text>
    <path d="M132 120 H174" stroke="#57677c" stroke-width="2.5"/><polygon points="174,120 164,114 164,126" fill="#57677c"/>
    <rect x="180" y="104" width="150" height="32" rx="8" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/>
    <text x="255" y="124" text-anchor="middle">原块 [7 7 7]</text>
    <rect x="360" y="104" width="110" height="32" rx="8" fill="#fdece1" stroke="#b8500f" stroke-width="2"/>
    <text x="415" y="124" text-anchor="middle" fill="#b8500f">b 手里新数</text>
    <path d="M474 120 H516" stroke="#b8500f" stroke-width="2.5"/><polygon points="516,120 506,114 506,126" fill="#b8500f"/>
    <rect x="522" y="104" width="102" height="32" rx="8" fill="#fdece1" stroke="#b8500f" stroke-width="1.5"/>
    <text x="573" y="124" text-anchor="middle" fill="#b8500f">新买一块</text>
    <text x="16" y="152" fill="#b8500f">花的活：再申请一块 + 逐个抄。一百万个元素就是一百万次抄写，还多占一倍地方。</text>

    <text x="16" y="176" font-weight="700" fill="#1d7a3c">路线二 · 移动：std::vector&lt;int&gt; c = std::move(a)</text>
    <rect x="16" y="184" width="110" height="32" rx="8" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/>
    <text x="71" y="204" text-anchor="middle" fill="#1d7a3c">c 手里接来的数</text>
    <path d="M132 200 H174" stroke="#1d7a3c" stroke-width="2.5"/><polygon points="174,200 164,194 164,206" fill="#1d7a3c"/>
    <rect x="180" y="184" width="150" height="32" rx="8" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/>
    <text x="255" y="204" text-anchor="middle" fill="#1d7a3c">原块，一格没动</text>
    <rect x="360" y="184" width="110" height="32" rx="8" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5" stroke-dasharray="4 3"/>
    <text x="415" y="204" text-anchor="middle">a 手里的数</text>
    <path d="M474 200 H516" stroke="#8b98ab" stroke-width="2" stroke-dasharray="4 3"/><polygon points="516,200 506,194 506,206" fill="#8b98ab"/>
    <rect x="522" y="184" width="102" height="32" rx="8" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1.5"/>
    <text x="573" y="204" text-anchor="middle">什么都不指</text>
    <text x="16" y="232" fill="#1d7a3c">花的活：把几个数抄过去、把原件那几个数抹成空。与元素个数完全无关。</text>

    <rect x="16" y="244" width="608" height="46" rx="8" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1"/>
    <text x="30" y="264" fill="#33465e">std::move 不搬任何东西：它只把对象标成「我可以不要了」，动手的是移动构造函数。</text>
    <text x="30" y="282" fill="#00599c" font-weight="700">所以这道题的正确问法不是「哪个快」，而是「原件后面还要不要用」。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `不少语言里对象变量本来就是句柄，赋值天然是「换个人拿着同一个对象」，旧内存交给垃圾回收去收拾。C++ 没有那层回收，**一块堆上内存必须随时有唯一的主人**，否则谁负责释放就成了悬案。所以交接被写成明面上的二选一，由你在这一行当场定 —— 这条线你在第 119 课的 RAII、第 121 课的 unique_ptr 那里已经见过。` },
        { t: `p`, text: `另一个设计选择同样要紧：**搬家手续不写，就自动退回复制**。vector、string、智能指针这些自己管内存的类型都写好了，std::move 递到它们手上是真搬；而你自己攒的类如果没写移动构造，std::move 递过去什么也搬不成，照样抄一份 —— 而且编译一路绿灯。下一课就给类装上喇叭，让它自己喊出走的是哪条门。` },
        { t: `h2`, text: `演示 1 · 源稿这段：一个 vector 的两次交接` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <utility>
int main() {
    std::vector<int> a(3, 7);                // {7, 7, 7}
    std::vector<int> b = a;                  // 复制：抄一份，a 照旧
    std::println("复制后: a 有 {} 个, b 有 {} 个", a.size(), b.size());
    std::vector<int> c = std::move(a);       // 移动：家当全搬给 c，a 变空壳
    std::println("移动后: a 有 {} 个, c 有 {} 个", a.size(), c.size());
}` },
        { t: `p`, text: `本机实测两行：复制后: a 有 3 个, b 有 3 个，然后 移动后: a 有 0 个, c 有 3 个。第一行 b 与 a 各是三，因为它们背后是两块内存；第二行 a 从三掉到零，那块内存只有一份 —— c 手里就是 a 原来那一块。` },
        { t: `p`, text: `再盯一眼这两句的形状：类型 名字 = 一个表达式，两句话只差 std::move 三个字。C++ 不替你猜「这人大概是想搬」，它照你写的办。这跟第 122 课把 unique_ptr 交出去时是同一个动作。` },
        { t: `h2`, text: `演示 2 · 本课任务：换成 std::string 重做，打印原件内容` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <utility>
int main() {
    std::string a(5000, 'x');            // 五千个字符，自己管一块内存
    std::string b = a;                   // 复制：再造五千个字符
    std::string c = std::move(a);        // 移动：那块内存换个主人
    std::println("b 有 {} 个，前三个是「{}」", b.size(), b.substr(0, 3));
    std::println("c 有 {} 个，前三个是「{}」", c.size(), c.substr(0, 3));
    std::println("a 剩 {} 个，内容是「{}」", a.size(), a);
}` },
        { t: `p`, text: `实测三行：b 有 5000 个，前三个是 xxx；c 有 5000 个，前三个也是 xxx；最后 a 剩 0 个，内容是「」—— 空的。这就是本课任务要你看清的东西：搬空之后的原件是**一个合法的空串**，不是垃圾。它是第 13 课那位老朋友，能拼、能问长度、能拿去比较，只是内容没了。substr 是第 16 课的手艺，这里用它只为别让打印刷出五千个字符。` },
        { t: `p`, text: `反过来说，这条也是移动最容易埋祸的地方：a 被搬空**不会报错**，它只是安静地给你一个空值。要出乱子，得等某天有人拿着这个空串当业务数据往下算。` },
        { t: `h2`, text: `演示 3 · 空壳不是报废：它可以重新装` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <utility>
int main() {
    std::vector<int> a(3, 7);
    std::vector<int> c = std::move(a);            // a 被搬空
    std::println("搬完 a 有 {} 个，c 有 {} 个", a.size(), c.size());
    a.push_back(1); a.push_back(2);               // 空壳重新装东西
    std::println("重新装 a 有 {} 个，第一个是 {}", a.size(), a[0]);
    std::println("c 有 {} 个，第一个是 {}", c.size(), c[0]);
}` },
        { t: `p`, text: `实测四行：搬完 a 有 0 个 c 有 3 个；重新装 a 有 2 个 第一个是 1；c 有 3 个 第一个是 7。a 装回来的两个跟 c 那三个已经是两块内存 —— 搬走时 a 手里已经空了，重新装必然新申请。` },
        { t: `p`, text: `但别把这段读成「被搬走的对象还能用」。标准给的承诺只有一句：**有效但未指定**。有效，指它可以安全地析构、赋值、重新装；未指定，指它里面是什么没保证 —— 本机 g++ 上是空，换个实现可能留着别的东西。「未指定」不等于「空」，所以搬完只许重新装，不许读旧内容。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `该写 std::move 的地方漏了，于是悄悄复制。交一个百万元素的 vector 写成「新对象 = 原对象」，四百多万字节真抄一遍；编译不报、运行不报，只是慢。下一课那种让类自己喊出来的计数器是唯一靠得住的查法。`,
          `搬完还去读原件的内容。本机实测：把 a 搬空之后打印 a[0]，程序当场中止、核心已转储，报的一句是 assertion __n < this->size() failed —— 空 vector 的 size 是 0，下标越界了。换成别的类型可能不中止、只给你一个垃圾值，那也一样是错：你要的东西已经在 c 手里了。`,
          `对 const 对象写 std::move，结果还是复制。实测：const 的三元素 vector 用 std::move 交给新对象，跑完原件仍有 3 个，一个都没搬走。根因是 std::move 给出的是「只读的、可搬走的」样子，移动构造要的是能把原件抹空的非常量引用，够不着就退回拷贝构造。语言不报错，你白花一次力气还不知道。`,
          `用了 std::move 却没请 <utility>。报错跟第 113 课那次一模一样：std 里没有 move 这个成员。有些实现里 <string> 顺手把它带进来了，于是同一份代码在这个编译器上过、在那个上过不了。用了什么就请什么。`,          `以为移动一定比复制快。对 int、double、第 104 课那种 pair<int, int>，搬家手续就是把那八个字节抄一遍，跟复制一模一样，还多一道抹空的活。移动划算的前提是**对象自己管着一大块内存**，比如 vector、string、第 121 课那个只能搬不能抄的 unique_ptr。到底快多少，等上秒表那节课量。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `用 std::string 重做一遍实验：复制/移动后打印原字符串内容 —— 照演示 2 那样先想「a 被搬空以后打印出来会是什么」，再跑，别反过来。`,
          `延伸一：把一个装了三万个字符串的 vector 各做一次复制和移动，然后回答：移动那一侧为什么连一个字符串都不用碰？复制那一侧又要花多少次字符串复制？`,
          `延伸二：把演示 3 里那两句 push_back 删掉，改成直接打印 a[0]，看本机给你什么脸色；再想想标准为什么只肯承诺「有效但未指定」而不是「一定是空」。`,
          `延伸三：拿第 113 课那个 Score 类写一句 Score 另一个 = std::move(s); —— 它真搬了吗？这个类可没写搬家手续，下一课有办法亲眼看见。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：复制是再造一份、原件照旧；移动是把「这块内存归谁」交给下家、原件被抹成有效的空。std::move 一个字节都不搬，它只是「我可以不要了」这句声明；只有自己管大块内存的对象才搬得划算，搬完的原件只能重新装、不能读旧内容。` }
      ]
    },
    {
      id: `m134`, title: `第 134 课 · 亲眼看见复制和移动：给类装上喇叭`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会给类写拷贝构造 Tracker(const Tracker&) 与移动构造 Tracker(Tracker&&)，用打印数清哪扇门被走过；并说清源稿那句「noexcept 别省」在容器里值多少钱。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课那笔账是**推**出来的：移动只抄三根指针。推理不算证据 —— 编译器选了哪个构造函数，它一个字都不打印；你写错了它也不报，程序照跑。本课的办法朴素得可爱：**让类自己喊出来**。每扇门里放一句 println，跑一遍数行数。` },
        { t: `code`, lang: `text`, code: `Tracker(const Tracker& o)   ← 拷贝构造：递给我一只只读的手，我照着抄一份
Tracker(Tracker&& o)        ← 移动构造：&& 读作右值引用，专接「可以搬走」的东西
       ↑ 必须有 const                 ↑ 恰恰不能有 const
         原件要完好                 它要把原件手里那块内存抹空` },
        { t: `p`, text: `两个签名只差一个词，含义正相反。拷贝构造的参数带 const，是因为它只**读**原件；移动构造的参数不带 const，是因为它要写原件 —— 把 o.name_ 手里那块内存抽走、把 o 抹成空壳。给移动构造也加上 const，它就抹不动，于是悄悄退回去调拷贝构造：第 133 课那条「白花一次力气还不知道」的坑，根子就在这两个 const 上。至于 std::move 递过去的东西为什么算「可以搬走」，以后有专门一节课细讲，今天把它当一句**声明**用就够。` },
        { t: `p`, text: `第三件事是源稿那行注释「noexcept 别省」。noexcept 读作「我保证这一步绝不会中途失败」，它不影响这一行能不能编译，却影响**别人敢不敢用这扇门**。容器换内存时就靠这句话做决定，本课演示 3 实测给你看：少一个词，搬家变成抄家。` },
        { t: `svg`, caption: `同一个原件，两扇门：走拷贝就再造一份、原件完好；走移动就把原件的内存接过来、原件抹空。每扇门里都埋了一句打印，喊话的次数就是调用次数`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">Tracker a("A") 之后，b 和 c 各走一扇门</text>
  <g font-size="12" fill="#26405a">
    <rect x="16" y="36" width="130" height="34" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
    <text x="81" y="57" text-anchor="middle" font-weight="700">a，名叫 A</text>

    <text x="16" y="100" font-weight="700" fill="#b8500f">Tracker b = a;</text>
    <rect x="176" y="86" width="200" height="32" rx="8" fill="#fdece1" stroke="#b8500f" stroke-width="2"/>
    <text x="276" y="106" text-anchor="middle" fill="#b8500f">Tracker(const Tracker&amp;)</text>
    <path d="M152 96 H172" stroke="#b8500f" stroke-width="2.5"/><polygon points="172,96 162,90 162,102" fill="#b8500f"/>
    <text x="386" y="106">喊一声 [拷贝] 抄了一份 A；b 是 A的复印件，a 照旧</text>

    <text x="16" y="152" font-weight="700" fill="#1d7a3c">Tracker c = std::move(a);</text>
    <rect x="176" y="138" width="200" height="32" rx="8" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/>
    <text x="276" y="158" text-anchor="middle" fill="#1d7a3c">Tracker(Tracker&amp;&amp;) noexcept</text>
    <path d="M152 148 H172" stroke="#1d7a3c" stroke-width="2.5"/><polygon points="172,148 162,142 162,154" fill="#1d7a3c"/>
    <text x="386" y="158">喊一声 [移动] 整屋搬走 A；c 是 A，a 空了</text>

    <rect x="16" y="184" width="608" height="52" rx="8" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1"/>
    <text x="30" y="204" fill="#33465e">编译器挑门只看一件事：这一行的表达式允不允许被抹空。允许才走右边那扇，抹不动就退回左边那扇。</text>
    <text x="30" y="222" fill="#33465e">右边那扇的参数没有 const —— 它必须写 o；给它加上 const 就等于宣布「我不抹」，门自动换成左边。</text>

    <text x="16" y="262" fill="#00599c" font-weight="700">把这两句 println 留在类里，以后任何一段代码，跑一次就知道它抄了几份、搬了几回。</text>
    <text x="16" y="286" fill="#b8500f">代价是类里多写十行；好处是这笔账从此不用猜。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `这套「让类型自己交代」的手法不是本课才有：第 116 课在两个析构里各打印一句，才看清父亲的手收着孩子时谁没跑；本课在两个构造里各打印一句，才看清一句赋值走的是哪扇门。理由都一样 —— **重载的抉择全在编译期做完，运行时不留痕迹**，你唯一的证人只能是自己埋在类里的那句话。` },
        { t: `p`, text: `另一条设计事实：**你写得越少，编译器补得越多**。第 118 课那份五件套名单在这里显形 —— 只写移动构造、不写拷贝构造，编译器就不再送你默认拷贝，反而把它标成已删除，一句 Tracker b = a; 当场报错。本课把两扇门都明写，是不想让编译器的默认决定替你做主。` },
        { t: `h2`, text: `演示 1 · 源稿这段：两声喊话对上一行结果` },
        { t: `code`, lang: `c++`, code: `class Tracker {
public:
    explicit Tracker(std::string name) : name_(std::move(name)) {}
    Tracker(const Tracker& o) : name_(o.name_ + "的复印件") {
        std::println("  [拷贝] 抄了一份 {}", o.name_);
    }
    Tracker(Tracker&& o) noexcept : name_(std::move(o.name_)) {   // noexcept 别省
        std::println("  [移动] 整屋搬走 {}", name_);
    }
    const std::string& name() const { return name_; }
private:
    std::string name_;
};` },
        { t: `code`, lang: `c++`, code: `#include <print>      // 接上一段的 Tracker
#include <string>
#include <utility>
int main() {
    Tracker a("A");
    Tracker b = a;                           // 复制：a 完好
    Tracker c = std::move(a);                // 移动：a 被搬空
    std::println("b = {}, c = {}", b.name(), c.name());
}` },
        { t: `p`, text: `本机实测三行：先 [拷贝] 抄了一份 A，再 [移动] 整屋搬走 A，最后一行 b = A的复印件, c = A。两声喊话分别对应 b 和 c 的出生，一句没多、一句没少 —— 这就是「亲眼看见」。再逐字看两句打印打的对象不一样：拷贝那句打的是 **o.name_**，即原件的名字 A；移动那句打的是 **name_**，是自己刚接过来的 A。实测把移动那句改成打 o.name_，跑出来 [移动] 整屋搬走 后面一片空白 —— 那时 o 手里已经被 std::move 抽干了。` },
        { t: `h2`, text: `演示 2 · 本课任务：加一句析构，数清打扫顺序` },
        { t: `code`, lang: `c++`, code: `class Tracker {
public:
    explicit Tracker(std::string name) : name_(std::move(name)) {}
    ~Tracker() { std::println("  [打扫] 「{}」", name_); }
    Tracker(const Tracker& o) : name_(o.name_ + "的复印件") {
        std::println("  [拷贝] 抄了一份 {}", o.name_);
    }
    Tracker(Tracker&& o) noexcept : name_(std::move(o.name_)) {
        std::println("  [移动] 整屋搬走 {}", name_);
    }
    const std::string& name() const { return name_; }
private:
    std::string name_;
};` },
        { t: `p`, text: `main 照演示 1 不动，跑完多出来三行打扫，顺序是 c、b、a：[打扫] 「A」、[打扫] 「A的复印件」、[打扫] 「」。局部对象按出生的**反序**打扫，这条栈上的老规矩第 119 课讲过，在这里正好用它验一遍所有权落到了谁手上。` },
        { t: `p`, text: `第三行那个空名字是本课最值钱的一行：a 早在 main 结束之前就被搬空了，轮到它打扫时手里**没有任何内存要还**。所以「搬空」和「销毁」是两件事 —— a 依然活着、依然会被正常打扫，只是那块堆内存的主人早在第二声喊话时就换成 c 了。` },
        { t: `h2`, text: `演示 3 · 那句「noexcept 别省」：把 Tracker 装进 vector` },
        { t: `code`, lang: `c++`, code: `#include <print>      // 类照演示 1，这出戏再多请一个 vector
#include <vector>
int main() {
    std::vector<Tracker> v;
    v.push_back(Tracker("甲"));
    v.push_back(Tracker("乙"));
    v.push_back(Tracker("丙"));
    std::println("容器 {} 个：", v.size());
    for (const auto& t : v) std::println("  {}", t.name());
}` },
        { t: `code`, lang: `text`, code: `带 noexcept 跑出来，六次全是移动：
  [移动] 甲
  [移动] 乙
  [移动] 甲
  [移动] 丙
  [移动] 甲
  [移动] 乙
容器 3 个：甲   乙   丙` },
        { t: `code`, lang: `text`, code: `把 noexcept 那两个字删掉，同一个 main 再跑：
  [移动] 甲
  [移动] 乙
  [拷贝] 甲
  [移动] 丙
  [拷贝] 甲的复印件
  [拷贝] 乙
容器 3 个：甲的复印件的复印件   乙的复印件   丙` },
        { t: `p`, text: `六次跟 push_back 有关的调用一次都没少，走的路却完全不同：带 noexcept 全是移动，容器里三个名字干干净净；删掉那两个字，凡是「把已有元素挪进新内存」的动作统统退回拷贝，名字上还留了疤 —— 甲被抄了一遍又一遍，成了 甲的复印件的复印件。` },
        { t: `p`, text: `容器为什么这么挑？它装满了要换一块更大的内存，把老元素一个个挪过去。挪到一半万一某个元素的搬家手续**中途失败**，新内存里已经堆了一半、老内存又不能要 —— 整个容器成了烂账。所以它只敢用有保证的那扇门：noexcept 就是那张保证书，有它就搬，没有就抄一份保平安。源稿括号里那四个字，扛的是一整容器的钱。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `拷贝构造漏了 const，写成 Tracker(Tracker& o)。它不是「也能用」，是**接不住只读的东西**：实测拿一个 const Tracker 来复制，编译器报 binding reference of type 'Tracker&' to 'const Tracker' discards qualifiers —— 想把一只只读的手绑到一双要干活的手上。收 const 引用参数、把只读对象交给别人抄，都撞这一句。`,
          `只写了移动构造，就以为拷贝构造还白送。实测：类里只有 Tracker(Tracker&& o) 时，一句 Tracker b = a; 报 use of deleted function 'constexpr Tracker::Tracker(const Tracker&)'。手写移动会**取消**默认拷贝 —— 这就是第 118 课那句「几件套要成套写」的实际长相。`,
          `移动构造里忘了抹空原件，写成 name_(o.name_)。照样编译、照样跑，只是**搬完原件还留着**：两块内存存着同一份内容，而你以为所有权已经交了。自证办法还是本课这套 —— 析构里打印一句，看那块内存被还了几回。`,
          `打印和实现没逐字对上，日志反过来骗你。上面那条「移动里打 o.name_ 打出空白」就是现成的例子：语句确实跑了，内容却不等于你以为的东西。往类里埋日志，得先想清楚这一句读的是原件还是自己。`,
          `忘了 noexcept，慢了一大截还找不到原因。演示 3 那种退回拷贝是**静悄悄**的：编译过、结果对、只是慢。习惯只有一条 —— 自己管内存的类，移动构造一律挂 noexcept。这笔钱有多贵，下一节课之后的秒表课有数字。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `给 Tracker 补写析构函数打印「打扫」，观察 a、b、c 的打扫顺序 —— 先写下你猜的顺序再跑，顺便解释最后一行为为什么是空的。`,
          `延伸一：把 main 里那句 Tracker c = std::move(a); 的 std::move 删掉，重跑，数一数 [拷贝] 和 [移动] 各响了几声，说明这一行为什么不但没搬成、还多出一份复印件。`,
          `延伸二：照演示 3 再跑一遍，把移动构造上的 noexcept 删掉，对比两组输出；然后回答：最后一次 push_back 之后，甲这个名字为什么已经被抄了两遍。`,
          `延伸三：在第 113 课那个 Score 类上照本课的样子补两句构造、各打印一声，然后写一句 Score 另一个 = std::move(那一个);。它响的是哪一声？如果 Score 里这两个构造函数都不写，又会响哪一声？`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：拷贝构造的参数带 const —— 只读原件；移动构造的参数不带 const —— 它要把原件抹空。类里各埋一句 println，抄了几份搬几回就不用猜；移动构造挂上 noexcept，容器才敢在换内存时真的搬你。` }
      ]
    },
    {
      id: `m135`, title: `第 135 课 · 传参的代价：只读就递一扇窗，别递一整间房`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：分清传值与传 const 引用各自花多少钱，按「只读 / 要改原件 / 不要原件了」三种意图给函数挑参数写法，并说清编译器为什么不拦那个昂贵的写法。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 61 课定过一条规矩：把对象交出去给人看，就写 const std::string&。当时给的理由是「避免复制」。本课把这张账单摊开说：**传值不是免费的，它按字节收费，而且每次调用都收一遍。**` },
        { t: `p`, text: `void by_value(std::string s) 这一句里的 s 是**一个新对象**。每调一次，都要申请一块内存、把整串抄进去，函数返回时再把它打扫掉。第 133 课那本账在这里原样重演，只是记账单位从「一行赋值」换成了「一次调用」：调一万次，抄一万次。**你的代码里没有一个字写过复制。**` },
        { t: `p`, text: `const 引用传的是「东西在哪」。函数体里 s.size()、s[0] 读的都是**原件那一块内存**，零申请、零抄写。代价在另一头：引用不是保险箱，是望远镜 —— 原件在函数期间被别人改了，你读到的就是改过的。想「进函数那一刻把样子定住」，就得自己抄一份，那笔钱又回到传值。` },
        { t: `code`, lang: `text`, code: `void show(std::string s);              show(text);              抄一份，text 照旧
void show(std::string s);              show(std::move(text));   整屋搬走，text 空了
void show(const std::string& s);       show(text);              零抄写，只看不改
void show(std::string& s);             show(text);              零抄写，改的就是原件` },
        { t: `p`, text: `源稿那三句口诀，其实是三个不同的问题：**只是看不看**（不看 → const 引用）、**要不要动原件**（要 → 普通引用）、**原件之后还要不要**（不要 → 传值配 std::move，函数收下所有权）。第三种最容易被漏掉：当一个函数正是要把这个值存下来，收 const 引用还是得自己抄一份进容器，不如直接收下 —— 第 122 课那种「把 unique_ptr 交给下家」的函数，签名写的就是传值。` },
        { t: `svg`, caption: `同一个函数调用，两种参数写法背后的内存归属：传值在函数那一侧多出一间独立的房间，函数返回就连夜拆掉；const 引用只是把原件的地址递过去，一间房都不新建`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">一次调用，两条路线的账单</text>
  <g font-size="12" fill="#26405a">
    <rect x="16" y="36" width="140" height="34" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
    <text x="86" y="57" text-anchor="middle" font-weight="700">main 里的 long_text</text>

    <text x="16" y="100" font-weight="700" fill="#b8500f">传值：void by_value(std::string s)</text>
    <rect x="176" y="86" width="150" height="32" rx="8" fill="#fdece1" stroke="#b8500f" stroke-width="2"/>
    <text x="251" y="106" text-anchor="middle" fill="#b8500f">s：一个全新对象</text>
    <path d="M160 96 H172" stroke="#b8500f" stroke-width="2.5"/><polygon points="172,96 162,90 162,102" fill="#b8500f"/>
    <text x="338" y="106">申请一块内存 + 整串抄过去；返回时打扫掉</text>

    <text x="16" y="152" font-weight="700" fill="#1d7a3c">传 const 引用：void by_const_ref(const std::string&amp; s)</text>
    <rect x="176" y="138" width="150" height="32" rx="8" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/>
    <text x="251" y="158" text-anchor="middle" fill="#1d7a3c">s：只是原件的另一个名字</text>
    <path d="M160 148 H172" stroke="#1d7a3c" stroke-width="2.5"/><polygon points="172,148 162,142 162,154" fill="#1d7a3c"/>
    <text x="338" y="158">一次都不抄；想写它，编译器立刻拦下</text>

    <rect x="16" y="184" width="608" height="66" rx="8" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1"/>
    <text x="30" y="204" fill="#33465e">两条路线在输出上一模一样：函数里读到的字是同一串。差别只在堆上多没多一块内存。</text>
    <text x="30" y="222" fill="#33465e">调一次看不出，调一万次就是两万块内存的申请与归还 —— 而且没有任何一行你的代码写着「复制」。</text>
    <text x="30" y="242" fill="#b8500f">所以口诀不看「哪个能跑」，只看意图：只读、要改原件、还是原件不要了。</text>

    <text x="16" y="278" fill="#00599c" font-weight="700">小东西反过来：int、double 传值就是八个字节，比绕一层引用更省事，别一律加 &amp;。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `C++ 让你**用参数的类型写意图**：const T& 是「我只看」，T& 是「我要改它」，T 配 std::move 是「我收下」。这份信息编译器全拿去用 —— 前两种写反了当场报错，只有第三种（该收下的白抄了一份）静悄悄，因为「多抄一份」永远合法。**语言把两种错拦在编译期，剩那一种只能自己盯。**` },
        { t: `p`, text: `值不值得抄，要看类型多大。第 12 课那种 int、double 传值就是抄八个字节，比绕一层引用还快；本课这条规矩是给**自己管内存的类型**准备的：std::string、std::vector、以及第 121 课那种只能搬不能抄的 unique_ptr。把「参数一律写 const 引用」当教条，对小东西反而是负担。` },
        { t: `h2`, text: `演示 1 · 源稿这段：一句之差，两份钱` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
void by_value(std::string s) {               // 又抄了一份
    std::println("  传值:   收到「{}」", s);
}
void by_const_ref(const std::string& s) {    // 零抄写，只看不改
    std::println("  传引用: 收到「{}」", s);
}
int main() {
    std::string long_text = "这是一条很长的弹幕……";
    by_value(long_text);                     // 原件无恙，但悄悄多出一份副本
    by_const_ref(long_text);                 // 原件无恙，也没有副本
    std::println("原件还在: {}", long_text);
}` },
        { t: `p`, text: `本机实测三行：传值: 收到「这是一条很长的弹幕……」、传引用: 收到「这是一条很长的弹幕……」、原件还在: 这是一条很长的弹幕……。前两条的内容一字不差 —— **从输出上你完全看不出第一个函数多抄了一份**。这正是本课要治的病：贵，却不在任何一行代码里显形。` },
        { t: `h2`, text: `演示 2 · 本课任务：往两个函数里各改一句` },
        { t: `code`, lang: `c++`, code: `void by_value(std::string s) {              // 接演示 1 的两个函数
    s += "再加一句";                        // 合法：改的是这份副本
    std::println("  传值改完: {}", s);
}
void by_const_ref(const std::string& s) {
    s += "再加一句";                        // 编译不过：只读的手不许写
    std::println("  传引用改完: {}", s);
}` },
        { t: `code`, lang: `text`, code: `实跑的报错，关键就这两句（原文里每个名字后面还跟着 aka 的长展开，这里省掉）：
error: no match for 'operator+=' (operand types are 'const std::string' and 'const char [13]')
note: passing 'const std::string*' as 'this' argument discards qualifiers` },
        { t: `p`, text: `第一段改得动：s 是副本，改完 main 里的原件一个字没变；实测另一个函数 void shout(std::string& s) 里写 s += "！！！"，原件才真的变成 开会！！！ —— 普通引用是「改原件」的唯一正门。第二段被拦，报错那两行的意思是同一个：operator+= 要把「我自己」当成可写的，而你递过去的是 const 的，qualifiers 被丢弃了。这套说法跟第 114 课那条「const 方法里写不了成员」是**同一条规矩的两个方向**。` },
        { t: `p`, text: `注意拦你的是**写**这个动作，不是**读**：读 s.size()、s[0]、拿去比较都合法。「只读」不是建议，是编译期验收的承诺，这一点比性能重要。` },
        { t: `h2`, text: `演示 3 · 三种传法各调一次，让类自己数` },
        { t: `code`, lang: `c++`, code: `class Counter {                        // 上一课那个会喊话的类，去掉名字后缀
public:
    explicit Counter(std::string name) : name_(std::move(name)) {}
    Counter(const Counter& o) : name_(o.name_) { std::println("    [拷贝]"); }
    Counter(Counter&& o) noexcept : name_(std::move(o.name_)) { std::println("    [移动]"); }
    const std::string& name() const { return name_; }
private:
    std::string name_;
};` },
        { t: `code`, lang: `c++`, code: `#include <print>      // 接上一段的 Counter
#include <string>
#include <utility>
void by_value(Counter c) { std::println("  函数里收到 {}", c.name()); }
void by_const_ref(const Counter& c) { std::println("  函数里收到 {}", c.name()); }
int main() {
    Counter a("报表");
    std::println("传值：");            by_value(a);
    std::println("传 const 引用：");   by_const_ref(a);
    std::println("传值加 std::move："); by_value(std::move(a));
    std::println("原件现在剩：「{}」", a.name());
}` },
        { t: `code`, lang: `text`, code: `传值：
    [拷贝]
  函数里收到 报表
传 const 引用：
  函数里收到 报表
传值加 std::move：
    [移动]
  函数里收到 报表
原件现在剩：「」` },
        { t: `p`, text: `三次调用打出的「函数里收到」一模一样，喊话却各不相同：传值响一声拷贝，传引用**一声不响**（零抄写的证据就是没有声音），传值配 std::move 响一声移动 —— 而最后一行把空着的原件摆在你面前。第 133 课那条「搬完别读原件」到了这里换了主角：函数收下之后你还拿 a 干活，就是你自己的错了。` },
        { t: `p`, text: `再补一笔量的：把传值那次调用放进循环跑一千次，实测屏幕上刷出一千行一模一样的输出，一共抄了一千份两万字符的串。要是这段循环在程序里每秒跑一遍，**这就是一个查不出来源的卡顿**。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `该写 const 引用却写了传值。它不会错，只会慢，而且慢得看不出来 —— 输出完全相同。查法只有两个：把类型换成上一课那种会喊话的类数行数，或者干脆按口诀写：只要函数体里没有赋值，参数就带 const 与 &。`,
          `收了 const 引用却想改它，硬把 const 去掉来「解决报错」。报错确实没了，但你也把「我只看」这个承诺扔了：调用者从此没法交只读对象，第 114 课那条「只读对象只敲得开带 const 的门」在这里同样成立。真要改原件就明写普通引用，让签名说实话。`,
          `以为 const 引用能保证原件在整个调用期间不变。它保证的是**你这个函数**不改，管不住别人改。函数里读两次拿到不同的值是完全可能的；需要「定住一份」，就自己抄 —— 那时候这一份钱是必须花的。`,
          `传值配 std::move 之后继续用原件。实测打印出来是空串，程序一声不吭。这一条比第 133 课那条更常见，因为「交出去」这个动作在代码里看起来人畜无害；决定收下所有权，就在函数名或注释里写明它会被搬空。`,
          `给八个字节的小东西也一律写 const T&。int、double、第 104 课那种 pair 传值就是抄寄存器，绕一层引用反而多一次间接；而且 const 引用参数**不能配 std::move 收下**，将来要把值存起来还得再抄。小东西传值，大对象才讲究写法。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `在 by_value 里改 s 试试能过；再到 by_const_ref 里改 s，看编译器拦不拦 —— 把报错那两行读顺，说出它点的是哪个动作。`,
          `延伸一：写一个 void shout(std::string& s)，函数体里给 s 末尾加三个感叹号，main 里调用后打印原件，确认改动落在原件身上。`,
          `延伸二：把演示 3 那个 by_value 调用放进一个跑一千次的循环，数一数屏幕上行数；然后把参数改成 const 引用重跑，说说少了什么。`,
          `延伸三：拿第 121 课那个 unique_ptr 写一个函数，参数分别写成 std::unique_ptr<int> p 与 const std::unique_ptr<int>& p，试着在函数体里调用它指向的对象的方法，回答：哪一种写法能收下所有权，哪一种只能看。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：参数是传值还是传 const 引用，回答的是「这个函数跟原件什么关系」—— 只读就递一扇窗，要改就走正门，不要原件了就 std::move 收下。传值永远合法，所以它贵得静悄悄，只能靠你按口诀写。` }
      ]
    },
    {
      id: `m136`, title: `第 136 课 · 移动到底快多少：上秒表，别让直觉算账`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用 chrono 给一段代码计时，跑出百万元素复制与移动的实测差；并说清这些数字为什么只是「同一台机器上的一次实测」，不能当常数抄走。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `前三课的账都按**次数**算：抄了几份、搬了几回。本课换成按**时间**算。源稿说 chrono 是标准库的秒表、用法照抄即可，这是真话 —— 它只有四步。` },
        { t: `code`, lang: `text`, code: `auto t1 = std::chrono::steady_clock::now();                       ① 按下秒表：取一个时刻
        ...  只把要量的那一段夹在这里 ...                                                    ② 夹住的必须是「活儿」本身
auto t2 = std::chrono::steady_clock::now();                       ③ 再取一次时刻
duration_cast<microseconds>(t2 - t1).count()                      ④ 两时刻相减，换算成微秒` },
        { t: `p`, text: `两个细节值得先讲。第一，这个钟叫 steady_clock，steady 的意思是**它只朝前走、不会因为改系统时间而倒退**，专门用来量「隔了多久」，不适合问「现在几点」。第二，尺子要选对：微秒是百万分之一秒，纳秒是十亿分之一 —— 尺子选粗了会把小的一段直接量成 0，本课就撞上过一次，见演示 3。` },
        { t: `p`, text: `源稿那张账摆在前面：复制一百万个 int 就是真搬四百万字节；移动只把「数据在哪、有多长」这几个数交给对方，是纳秒级。差多少？本机 g++ -std=c++23 实测：**复制 2018 到 2464 微秒，移动每次都是 0 微秒。**` },
        { t: `p`, text: `那个 0 要读对：它不等于「没有成本」，只等于**低于这把尺子的最小刻度**。换成纳秒重测，移动是 66 到 129 纳秒，复制是 195 万到 244 万纳秒 —— 差两万倍上下。而「同一台机器连跑三次」这件事也不是客套：三次分别是 2018、2021、2464 微秒，摆差接近两成。所以本课这几个数的正确用法是**读数量级**，不是当常数抄进报告里。` },
        { t: `svg`, caption: `三档元素个数下的实测对照：复制那根条子跟着元素个数疯长，移动那根一直是同一档高度 —— 这笔账的形状本身就是结论`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">本机实测：复制按时长花钱，移动按次数花钱</text>
  <g font-size="12" fill="#26405a">
    <text x="16" y="46" font-weight="700">三个 int</text>
    <rect x="120" y="34" width="40" height="18" rx="3" fill="#fdece1" stroke="#b8500f" stroke-width="1.5"/>
    <text x="166" y="48" fill="#b8500f">复制 370 到 447 纳秒</text>
    <rect x="120" y="58" width="6" height="18" rx="3" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/>
    <text x="134" y="72" fill="#1d7a3c">移动 42 到 64 纳秒</text>

    <text x="16" y="102" font-weight="700">一百万个 int</text>
    <rect x="120" y="90" width="470" height="18" rx="3" fill="#fdece1" stroke="#b8500f" stroke-width="1.5"/>
    <text x="126" y="104" fill="#b8500f">复制 2018 到 2464 微秒</text>
    <rect x="120" y="114" width="6" height="18" rx="3" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/>
    <text x="134" y="128" fill="#1d7a3c">移动 0 微秒，纳秒刻度下 66 到 129</text>

    <text x="16" y="158" font-weight="700">一百万个 std::string</text>
    <rect x="120" y="146" width="504" height="18" rx="3" fill="#fdece1" stroke="#b8500f" stroke-width="1.5"/>
    <text x="126" y="160" fill="#b8500f">复制 60181 到 61873 微秒</text>
    <rect x="120" y="170" width="6" height="18" rx="3" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/>
    <text x="134" y="184" fill="#1d7a3c">移动 0 微秒</text>

    <rect x="16" y="200" width="608" height="58" rx="8" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1"/>
    <text x="30" y="220" fill="#33465e">条子只表意、不按比例画，数字才是实测。一百万个字符串那笔比 int 贵近三十倍，</text>
    <text x="30" y="238" fill="#33465e">因为复制要替**每一个字符串**各申请一次内存，而移动只是交接 vector 手里那三根指针。</text>
    <text x="16" y="278" fill="#00599c" font-weight="700">读法：复制的价格跟着元素个数与元素大小涨，移动的价格永远是那三根指针。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `三档数字连起来看，形状很干净：三个元素时复制比移动贵三百纳秒，一次函数调用都不止这点钱，搬不搬根本不值得计较；一百万个元素时差到两万倍；元素自己还管内存时，六万微秒对上一个量不出格的数。**「移动快」从来不是一句全称判断，它是一句关于规模的判断。**` },
        { t: `p`, text: `这也解释了为什么 C++ 把 std::move 写成「你说」而不是「库猜」：猜错的代价两边不对等 —— 对三个 int 猜错，多绕一层间接；对一百万个字符串猜错，白等几十毫秒还得占一倍内存。既然只有写代码的人知道自己后面还要不要用这个原件，那就把这句话交给你写。第 133 课那句「问的不是性能，是语义」，到本课有了具体的价钱。` },
        { t: `h2`, text: `演示 1 · 源稿这段：百万元素的两笔账` },
        { t: `code`, lang: `c++`, code: `#include <chrono>                            // 下面 main 里用它的秒表
long diff_us(std::chrono::steady_clock::time_point a,
             std::chrono::steady_clock::time_point b) {
    return std::chrono::duration_cast<std::chrono::microseconds>(b - a).count();
}` },
        { t: `code`, lang: `c++`, code: `#include <print>      // 接上一段的 diff_us
#include <vector>
#include <chrono>
#include <utility>
int main() {
    std::vector<int> big(1'000'000, 1);            // 百万元素，源稿那句 for 换成初值 1
    auto t1 = std::chrono::steady_clock::now();
    std::vector<int> copy = big;                   // 复制：真搬四百万字节
    auto t2 = std::chrono::steady_clock::now();
    std::vector<int> moved = std::move(big);       // 移动：只交接指针
    auto t3 = std::chrono::steady_clock::now();
    std::println("复制 {} 个元素耗时 {} 微秒", copy.size(), diff_us(t1, t2));
    std::println("移动 {} 个元素耗时 {} 微秒", moved.size(), diff_us(t2, t3));
}` },
        { t: `code`, lang: `text`, code: `不加优化，连跑三次：
复制 1000000 个元素耗时 2018 微秒        移动 1000000 个元素耗时 0 微秒
复制 1000000 个元素耗时 2021 微秒        移动 1000000 个元素耗时 0 微秒
复制 1000000 个元素耗时 2464 微秒        移动 1000000 个元素耗时 0 微秒

同一份代码加 -O2 再跑两次：
复制 1939 微秒 / 1911 微秒               移动依旧 0 微秒 / 0 微秒` },
        { t: `p`, text: `这一组数字里最该记住的是**加不加优化几乎没变**：2018 到 2464 对 1911 到 1939，同一个档。原因在第 133 课那条路上 —— 钱花在申请四百万字节的内存和把字节一段段搬过去，这两件事是指令级的体力活，编译器优化不掉。换个程序可就不一定了：纯算的循环加 -O2 能差好几倍，所以「跑一次就报数」这种习惯在任何计时里都靠不住。量之前先想清楚「这段活儿到底是内存的事还是指令的事」，这句才是本课真正的收获。` },
        { t: `h2`, text: `演示 2 · 本课任务：把元素改成一千个再跑` },
        { t: `code`, lang: `c++`, code: `std::vector<int> big(1'000, 1);             // 接演示 1 的 main，只改这一行` },
        { t: `code`, lang: `text`, code: `不加优化跑三次，六行原样抄下来：
复制 1000 个元素耗时 2 微秒      移动 1000 个元素耗时 0 微秒
复制 1000 个元素耗时 1 微秒      移动 1000 个元素耗时 0 微秒
复制 1000 个元素耗时 2 微秒      移动 1000 个元素耗时 0 微秒

-O2 跑三次：复制 1 微秒 / 1 微秒 / 1 微秒，移动 0 微秒 / 0 微秒 / 0 微秒` },
        { t: `p`, text: `任务的答案是「依旧几乎是 0」，但要看得准：一千个元素时复制落到 1 到 2 微秒，跟着元素个数一起缩；移动**一动不动** —— 它从来没看过元素个数。于是两千倍的差距在这一档已经挤进同一把尺子的两格里，读数只剩 1 和 0。想看清小规模的差，得把尺子换成纳秒，这就是演示 3。` },
        { t: `h2`, text: `演示 3 · 换成纳秒：0 不见了，边界也露出来` },
        { t: `code`, lang: `c++`, code: `#include <chrono>                            // 把 diff_us 里的 microseconds 换成纳秒
long diff_ns(std::chrono::steady_clock::time_point a,
             std::chrono::steady_clock::time_point b) {
    return std::chrono::duration_cast<std::chrono::nanoseconds>(b - a).count();
}` },
        { t: `code`, lang: `c++`, code: `#include <print>      // 接上一段的 diff_ns
#include <vector>
#include <chrono>
#include <utility>
int main() {
    std::vector<int> small(3, 7);
    auto t1 = std::chrono::steady_clock::now();
    std::vector<int> copy = small;                // 三个元素也要新申请一块内存
    auto t2 = std::chrono::steady_clock::now();
    std::vector<int> moved = std::move(small);    // 移动：只交接那三根指针
    auto t3 = std::chrono::steady_clock::now();
    std::println("三个元素：复制 {} 纳秒，移动 {} 纳秒", diff_ns(t1, t2), diff_ns(t2, t3));
}` },
        { t: `code`, lang: `text`, code: `三个元素，连跑三次：
复制 447 / 422 / 370 纳秒          移动 64 / 42 / 45 纳秒

把同一个程序里的 3 改成一百万，用同一把纳秒尺子再跑三次：
复制 2443625 / 2007948 / 1949883 纳秒      移动 96 / 129 / 66 纳秒` },
        { t: `p`, text: `两件事一眼看穿。第一，微秒那个 0 是尺子的分辨率不够，不是移动免费 —— 纳秒下它是几十到一百多纳秒，跟一次函数调用同档。第二，三个元素这一档复制也才四百纳秒上下，比移动贵的部分不到三百五十纳秒，**为了这点钱把原件搬空、再在别处踩一个「读搬空原件」的坑，是赔本买卖**。这就是第 133 课那条「小对象别迷信移动」的数字依据。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把 0 读成「零成本」。微秒刻度下移动量不出来，是因为它比一格还短。汇报时该说「实测低于一微秒，纳秒刻度下一百纳秒上下」，而不是「移动不花时间」。`,
          `只跑一次就下结论。本机同一份代码三次是 2018、2021、2464 微秒，最后一回比第一回高两成；一千个元素那档 1 到 2 微秒，比例上照样摆一倍。正确做法是跑三五次，报中间那个，并把摆差一起说出口。`,
          `把不相干的活夹进秒表里。t1 与 t2 之间只要多放一句 println，量出来的就是「打印到屏幕」的时间，比复制还贵。夹在里面的必须只有要量那一件事，两个 now 也要紧贴它的前后。`,
          `第一次跑的数字当真。头一回要把内存从零开始申请、要把代码页读进来，实测这种「冷跑」常常明显偏高。要么丢弃第一次，要么像本课那样连跑三次看它们挤不挤在同一档。`,
          `拿本课这四个数当常数用。它们只在**这台机器、这一版 g++ 15.2.0、这个负载状态**下成立：换个笔记本、旁边开着浏览器、内存快满的时候，都能挪开一大截。要给别人报数，就在别人那台机器上重跑 —— 秒表四步照抄就行。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把元素改成 1000 个再跑一次，看移动是不是依旧几乎是 0 —— 先猜一下复制那行会从几千微秒掉到多少，再跑。`,
          `延伸一：把 duration_cast 里的微秒换成纳秒，重跑百万元素那一版，把移动那个「0」读出一个真实的数；再算算它跟复制差几个数量级。`,
          `延伸二：把 vector<int> 换成 vector<std::string>（元素用同一个短字符串填满），重跑一次。复制那行为什么贵了三十倍？移动那行为什么一点没动？`,
          `延伸三：同一份程序连跑五次，把五个数字抄下来，算出最大最小差多少；然后回答：为什么这些数字不能当常数写进文档。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：chrono 量时间就四步 —— 取时刻、夹住活儿、再取时刻、换算相减；实测百万元素复制两千微秒上下而移动量不出格，纳秒下是一百纳秒上下。这些数是同一台机器的一次实测，读它为了看清数量级，不是为了抄走常数。` }
      ]
    }
  ]
};
