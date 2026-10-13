/* 喵站 · C++ 掌握 正文分部 p13：第 125–128 课
 *
 * 源稿：125_实战unique_ptr链表.cpp、126_魔法值的问题.cpp、127_optional可能没有.cpp、128_value_or兜底值.cpp
 * m125 是智能指针三兄弟的第一个实战；m126 起进 optional 这一族，但号段表里 optional 到 127 才放行，
 * 所以 126 的代码里一个字都不提它，只把「暗号」这件事的害讲透。
 */
window.MIAO_CPPM_P13 = {
  chapters: [
    {
      id: `m125`, title: `第 125 课 · 实战：用 unique_ptr 串一条链表，删头就放整条`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把前三课的 unique_ptr 第一次用在一个真结构上 —— 一条链表。写完你要能说清 head.reset() 为什么一行 delete 都不用写就把整条链还干净，以及这条自动释放的链在特别长时藏着什么代价。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `vector 是一排紧挨着的格子，中间插一个人，后面全得往后挪；链表不是这样。链表的节点散落在堆上各处，谁挨着谁都无所谓，关系全靠每一格随身带的一句话：「下一个在哪儿」。一个值加一个「下一张图在哪儿」，就是链表的全部。第 74 课那句「指针本质就是个门牌号」在这里第一次派上大用场 —— 整条链就是一串门牌号首尾相扣，攥住头就能一格一格问到尾。` },
        { t: `p`, text: `用裸指针写这种结构，麻烦是从释放开始的。每个节点都是 new 出来的，就得记着 new 了几个要 delete 几次，顺序错了还悬垂。漏掉中间一环，它后面那一整条全漏，漏得无声无息 —— 程序照跑，内存一路少，跑三天才崩给你看。` },
        { t: `p`, text: `把成员从 Node* 换成 std::unique_ptr<Node>，这件事的性质就变了：这一格不再是「指向」，而是「拥有」。所有权沿链一路传下去 —— 头拥有第二个，第二个拥有第三个，每格只有一个主人，正是第 121 课那条独占的规矩。第 119 课 RAII 那句「对象出了作用域，它管着的资源自己关」到这儿第一次成套生效：不需要收尾函数，也不需要「记得」做什么。` },
        { t: `p`, text: `释放的过程像推倒一排骨牌。head.reset() 触发头节点的析构：先执行 ~Node 自己的函数体，然后把成员一一析构。next 是个 unique_ptr，它析构时发现手里有货，就去处置那个节点；那个节点的析构又去处置它的 next…… 一路推到 next 为空才往回收。整条链一个 delete 都没写，全还干净 —— 「删头等于全链释放」不是技巧，是这条所有权链的必然结果。` },
        { t: `p`, text: `还有个角色分工值得点出来：链里存的是 unique_ptr，走链时用的却是裸指针，因为「走一遍」只需要看，不需要负责 —— 第 124 课那张「谁负责删」的表在这儿正好落地：拥有者是 head 和各格的 next，观察指针什么都不处置。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `设计意图是把所有权嵌进数据结构本身：谁能走到这一格，谁就负责这一格的生死 —— 这层关系写在类型里，而不是写在某个函数的注释里。` },
        { t: `code`, lang: `text`, code: `裸指针链表                        unique_ptr 链表
next 是 Node*                     next 是 std::unique_ptr<Node>
new 出来，必须记着逐个 delete     make_unique 出来，忘了也没人骂你
删中间节点后要手动补前一个的 next   对 next 赋值就是转移，旧的那条自动释放
delete 顺序错了就留悬垂指针        只有 reset 和整链销毁，谈不上顺序问题` },
        { t: `p`, text: `右边那句「赋值即转移」值得单独琢磨：写 head->next = std::make_unique<Node>(9) 时，赋值一次做完两件事 —— 先把手里原来那一整条安置掉，再接管新的，不留「我不管了但还没接手」的空隙。第 122 课那次转移，在这里成了每天在用的小动作。` },
        { t: `h2`, text: `怎么做` },
        { t: `code`, lang: `c++`, code: `#include <memory>
#include <print>
struct Node {
    int value;                        // 装的东西
    std::unique_ptr<Node> next;       // 下一张图在哪儿
    explicit Node(int v) : value(v) {}
};
int main() {
    auto head = std::make_unique<Node>(1);
    head->next = std::make_unique<Node>(2);
    head->next->next = std::make_unique<Node>(3);
    std::println("三节串好，全程没写一个 delete");
}` },
        { t: `p`, text: `三句就把链串起来：make_unique 造一个节点，返回值交给上一格的 next，所有权当场落定。第 117 课那个 explicit 仍然有用，它挡住「一个 int 悄悄变成一整个 Node」。整段没有 new、没有 delete，也不需要收尾函数。` },
        { t: `h2`, text: `演示 1 · 串起来，再走一遍` },
        { t: `code`, lang: `c++`, code: `// 接上一段：head 已经是 1 → 2 → 3，这段还写在 main 里
int count = 0;
for (Node* c = head.get(); c != nullptr; c = c->next.get()) {
    std::print("{} → ", c->value);
    ++count;
}
std::println("到头了，一共走过 {} 个节点", count);` },
        { t: `p`, text: `实测输出：1 → 2 → 3 → 到头了，一共走过 3 个节点。两处细节。**head.get()** 把所有权留在原地，只借出一个能比较、能解引用的裸指针，这是第 121 课讲过的「看一眼，不接管」。**循环条件 c != nullptr**：最后一格的 next 是空的 unique_ptr，get() 对它返回 nullptr，循环自己就收住了 —— 链表到头这件事是类型直接告诉你的，不需要 -1、不需要任何事先约好的暗号。下一课正好讲暗号的害处。` },
        { t: `h2`, text: `演示 2 · 删头 = 整条链自动释放` },
        { t: `code`, lang: `c++`, code: `#include <memory>
#include <print>
struct Node { int value; std::unique_ptr<Node> next;
    Node(int v) : value(v) {}
    ~Node() { std::println("节点 {} 释放", value); }
};
int main() {
    auto head = std::make_unique<Node>(1);
    head->next = std::make_unique<Node>(2);
    head->next->next = std::make_unique<Node>(3);
    head.reset();                       // 推倒第一张骨牌
    std::println("reset 已返回");
}` },
        { t: `p`, text: `本机实测输出四行：节点 1 释放、节点 2 释放、节点 3 释放、reset 已返回。两个要点。**三行释放全在 reset 已返回之前** —— reset 是同步的，它返回时整条链已经处置完毕，没有「等一下再收」的异步尾巴。**顺序是 1 2 3 而不是 3 2 1**：析构函数体先跑、成员后析构，所以打印「节点 1 释放」那一刻，节点 2 和 3 还在内存里。这行字该读作「轮到我交代后事了」，不是「我的内存已经还给系统了」。` },
        { t: `svg`, caption: `unique_ptr 链表的所有权是一条单向链；reset 推倒第一张骨牌，析构一格接一格往下递归，走到尾才往回收`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 270">
  <g font-size="13" fill="#142639">
    <text x="24" y="22" font-weight="700" fill="#00599c">堆上三个节点，所有权一路向下</text>
  </g>
  <g font-size="13" text-anchor="middle">
    <rect x="24" y="40" width="150" height="46" fill="#eaf3fb" stroke="#00599c"/><text x="99" y="60">Node</text><text x="99" y="78" font-size="12" fill="#57677c">value 1 · next</text>
    <rect x="245" y="40" width="150" height="46" fill="#eaf3fb" stroke="#00599c"/><text x="320" y="60">Node</text><text x="320" y="78" font-size="12" fill="#57677c">value 2 · next</text>
    <rect x="466" y="40" width="150" height="46" fill="#eaf3fb" stroke="#00599c"/><text x="541" y="60">Node</text><text x="541" y="78" font-size="12" fill="#57677c">value 3 · next 空</text>
  </g>
  <g stroke="#1a7f42" stroke-width="2" fill="none">
    <line x1="174" y1="63" x2="243" y2="63"/><polygon points="243,63 234,59 234,67" fill="#1a7f42" stroke="none"/>
    <line x1="395" y1="63" x2="464" y2="63"/><polygon points="464,63 455,59 455,67" fill="#1a7f42" stroke="none"/>
  </g>
  <g font-size="12" fill="#1a7f42">
    <text x="186" y="56">独占</text><text x="407" y="56">独占</text>
    <text x="24" y="106">head 是 std::unique_ptr，拥有第一个 Node；每格里的 next 拥有下一格。</text>
    <text x="24" y="126" fill="#57677c">走链用的是 Node* 裸指针：只看不拥有，get() 借个门牌号，一步都不接管。</text>
  </g>
  <g font-size="13" fill="#142639">
    <text x="24" y="158" font-weight="700" fill="#b8500f">head.reset() 之后：析构一格接一格往下递归</text>
  </g>
  <g font-size="12" fill="#33465e">
    <rect x="24" y="172" width="180" height="30" fill="#fff3d6" stroke="#b8722b"/><text x="36" y="191">~Node 值 1：先跑函数体</text>
    <rect x="230" y="172" width="180" height="30" fill="#fff3d6" stroke="#b8722b"/><text x="242" y="191">再析构 next → 处置 2</text>
    <rect x="436" y="172" width="180" height="30" fill="#ffe1dd" stroke="#b8500f"/><text x="448" y="191">一路推到 next 为空</text>
    <text x="24" y="224">实测顺序 1 2 3：函数体先跑、成员后析构，所以「节点 1 释放」时 2 和 3 还在。</text>
    <text x="24" y="248" font-weight="700" fill="#b8500f">代价：递归有多深就看链有多长 —— 链越长越危险，见演示 3</text>
  </g>
</svg>` },
        { t: `h2`, text: `演示 3 · 链太长会怎样` },
        { t: `code`, lang: `c++`, code: `#include <memory>
#include <print>
struct Node { int value; std::unique_ptr<Node> next; Node(int v) : value(v) {} };
int main() {
    std::unique_ptr<Node> head;
    for (int i = 1000000; i >= 1; --i) {      // 头插法造一百万个节点
        auto p = std::make_unique<Node>(i);
        p->next = std::move(head);
        head = std::move(p);
    }
    std::println("串好一百万个，准备 reset");
    head.reset();                              // 多米诺：递归深度等于链长
    std::println("这一行永远走不到");
}` },
        { t: `p`, text: `实测：程序死在 reset 那一句 —— 段错误，退出码 139，最后那句根本没被执行；把输出重定向到文件时，连「串好一百万个」那句也看不见，字还堵在缓冲区里，进程一死就跟着没了。规模换成 50000 就打得完也回得来；本机 g++ -std=c++23、八兆栈，分界实测落在 58000 与 100000 之间。原因就写在骨牌那三个字里：释放不是一趟循环，而是一次调用套一次调用，链多长递归就有多深，每层都占一份栈帧。栈是几兆的硬上限，堆是几百个 G —— 第 76 课那条栈与堆的分工，今天咬人了。` },
        { t: `p`, text: `这不是 unique_ptr 的缺点，是「用递归释放一条链」的代价。解法是把销毁改成迭代式：while 循环里写 head = std::move(head->next)，摘一个放一个。妙处在先后顺序 —— 赋值时 next 先被腾空交出来，旧的头节点才被处置，而它手里的 next 已经空了，递归链条当场剪断，栈深始终是 1。实测一百万个、乃至五千万个都能干净退场，这个改法也是本课任务之一。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `走链时顺手 delete cur。链是 unique_ptr 拥有的，观察指针无权处置，这么写等于同一块内存被处置两次，当场崩。规矩是「谁拥有谁放手」，观察的那只手什么都不做。`,
          `把 release() 当「看一眼」用。release 是交出所有权、从此不归它管，交出去又没人接就是漏。看一眼用 get，转所有权用 std::move —— 第 122 课那张对照表在这条链上照样成立。`,
          `想在中间接一段，直接 head->next = 新节点，然后奇怪「后面那一长串怎么没了」。赋值先处置旧值再接管新值，旧的那一整条从这一刻起没了主人。先把旧链 move 出来存着，接好新格再挂回去。`,
          `链太长崩了，于是换成 shared_ptr。shared_ptr 一样是递归析构，一样吃栈，换了等于没换；要么把链改短，要么把销毁改成迭代式。`,
          `要写双向链表，就前后各塞一个 unique_ptr 互指。两个独占者互相拥有，谁也等不到对方先放手，整条链一起漏。双向结构不再是独占的活儿，那是第 123 课 shared_ptr 加第 124 课那张表要解决的判断题。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `在尾部再接一个节点 4，重新编译运行，看遍历输出`,
          `给 Node 加上打印 value 的析构函数，把中间第二个节点从链上摘下来（两行就够），看哪些行被打印、顺序是什么`,
          `延伸：按本课说的迭代式销毁改一遍演示 3，确认一百万个节点也能平安 reset；再把你机器上「还能平安 reset」的最大长度试出来。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：把 next 的类型从指针换成 unique_ptr，所有权就嵌进了数据结构 —— 删头等于全链自动释放，一行 delete 都不用写；代价是这份释放靠递归完成，链特别长时先撑爆的是栈。` }
      ]
    },
    {
      id: `m126`, title: `第 126 课 · 魔法值的问题：-1 到底是不是一个数`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：看清「用 -1 表示没找到」这类暗号的三处害处，并说清为什么编译器对「你忘了检查 -1」一声不吭 —— 根子在类型里，不在语法里。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `老代码里遍地是数字暗号：-1 等于没找到，0 等于出错，空字符串等于查无此人。这么写不是笨，是被逼的 —— 第 53 课说过，一条 return 只有一个出口，一个出口只能带回一个值。可「这件事没成」也是一个信息，两个信息挤在同一个 int 里，就只能从数字的地盘上划出一块，给「没成」当暗号用。` },
        { t: `p`, text: `第一害：这条约定只活在你脑子里。find_index 的返回类型是 int，而 int 的值域里 -1 和 0、1、2 平起平坐，谁也不比谁特殊。「-1 表示没有」这句判决写在函数上方那行注释里，注释不参与编译 —— 编译器读的是类型，类型里没有这一句。于是这一条约定只能靠人记、靠口口相传、靠自觉。` },
        { t: `p`, text: `第二害最要命：调用方忘了检查，什么都不会发生。拿到 -1 直接当下标用下去，没有编译错误，也没有警告，程序照跑，暗号被当成真数据用。本机实测：越界那一步被 libstdc++ 的断言当场拦下，程序 abort，退出码 134；换一台没开这类断言的机器，它就安静地读回一块不认识的内存，还给你一个看着挺合理的数 —— 那才是最难查的 bug，它不崩，只是慢慢错。` },
        { t: `p`, text: `第三害：暗号撞上真数据。-1 当「下标」还勉强安全，因为下标本来就不会是负数；可一旦函数带回的是值本身，暗号就不讲理了 —— 零下 1 度是个正经温度，它和「一个负数都没找到」共用同一个答复。调用方拿到 -1，根本分辨不出自己看见的是哪一个。把「可能没有」这件事写进返回类型，让它在签名上就看得见，编译器才有东西可查；这正是下一课要正式登场的那个东西，这一课先把「为什么非得要它」钉牢。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `暗号这条路的问题不是写得丑，而是它把一条只有人知道的约定，塞进了一个所有人都当普通数字用的类型里。两栏对照看得最清楚：` },
        { t: `code`, lang: `text`, code: `暗号（约定在人脑里）              写进类型（约定在签名里）
-1 表示没有                       有 还是 没有，是返回值自带的两种状态
靠注释、靠自觉                    编译器看得见，不处理就过不去
每个函数各定一套暗号              一套形状到处通用
正常数据可能正好撞上暗号          数据的地盘和「没有」彼此分开` },
        { t: `p`, text: `右边那一栏是下一课的主题。这一课要求你先把左边读得懂：翻代码看见 return -1，脑子里要立刻跳出三句 —— 这里有个暗号，签名没写它，编译器不管它。这三句能在你手上生效，这一课就算到位了。` },
        { t: `h2`, text: `怎么做` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
int find_index(const std::vector<int>& v, int target) {
    for (std::size_t i = 0; i < v.size(); ++i)
        if (v[i] == target) return static_cast<int>(i);
    return -1;                       // 暗号：-1 等于没有
}
int main() {
    std::vector<int> scores = {60, 55};
    std::println("找 60 得 {}，找 99 得 {}", find_index(scores, 60), find_index(scores, 99));
    return 0;
}` },
        { t: `p`, text: `实测输出 找 60 得 0，找 99 得 -1。单看这一屏，它是一段「完全正常」的代码：函数短、注释也在、逻辑也没错。暗号的害从来不落在写函数的人身上，它落在每一个用它的人身上 —— 这只函数对调用方只交代了一句「我还你一个 int」，「可能没有」那四个字它压根没说出口。` },
        { t: `h2`, text: `演示 1 · 忘检查的人会走到哪一步` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
int find_index(const std::vector<int>& v, int target) {
    for (std::size_t i = 0; i < v.size(); ++i)
        if (v[i] == target) return static_cast<int>(i);
    return -1;
}
int main() {
    std::vector<int> scores = {60, 55};
    int idx = find_index(scores, 99);
    std::println("idx = {}", idx);
    std::println("拿它当下标读: {}", scores[idx]);
    return 0;
}` },
        { t: `p`, text: `本机实测屏幕上只有一句 stl_vector.h 的断言：Assertion '__n < this->size()' failed，然后 abort，退出码 134。上面那句 idx = -1 也跟着消失了 —— abort 不冲刷标准输出，缓冲区里的字随进程一起没了。这就是「忘了检查」的现场：编译器从头到尾一个字没提醒，报错发生在越界那一刻，而越界的那一行，离做出 -1 这个决定的那一行已经隔了一次函数调用，查的人只能顺着调用往回走，一路问「这个数从哪儿来」。` },
        { t: `h2`, text: `演示 2 · 暗号撞上真数据` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
int first_below_free(const std::vector<int>& v) {
    for (int t : v)
        if (t < 0) return t;                    // 带回的是值
    return -1;                                  // 暗号也叫 -1
}
int main() {
    std::vector<int> a = {3, -1, 5};            // 零下 1 度是正经读数
    std::vector<int> b = {3, 5, 7};             // 一个负数都没有
    std::println("a 里第一个负数: {}", first_below_free(a));
    std::println("b 里第一个负数: {}", first_below_free(b));
    return 0;
}` },
        { t: `p`, text: `实测两行长得一模一样：a 里第一个负数: -1、b 里第一个负数: -1。第一行的意思是「找到了，零下 1 度」，第二行的意思是「压根没找到」。同一个数、同一个类型、同一个调用姿势，含义是两回事，而这份区别只存在于写函数的人的脑子里。想分开只能再塞第二个暗号，比如约定 -2 表示没找到 —— 于是从现在起，每个调用点都要记住一份只属于这只函数的私约。` },
        { t: `h2`, text: `演示 3 · 现有工具里最好的一步` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
bool find_index(const std::vector<int>& v, int target, int& out) {
    for (std::size_t i = 0; i < v.size(); ++i)
        if (v[i] == target) { out = static_cast<int>(i); return true; }
    return false;
}
int main() {
    std::vector<int> scores = {60, 55};
    int pos = 0;
    if (find_index(scores, 55, pos)) std::println("找到 55，下标 {}", pos);
    bool ok = find_index(scores, 99, pos);
    std::println("找 99 成没成: {}，此时 pos = {}", ok, pos);
}` },
        { t: `p`, text: `这是第 54 课「返回 bool」加第 60 课「引用参数直接改原稿」拼出来的老招式，也正是第 62 课、第 70 课那条「一次带回多个结果」的标准用法。比暗号好在两处：胜负由 bool 明说，下标走第二条出口，两个信息不再挤同一个数。软肋还剩两条。第一，失败时 out 一动不动 —— 实测那句打印的是 1 而不是 0，它是上一次成功留下的陈值，读起来却像这次的成果。第二，调用方可以连返回值都不要：find_index(v, 77, pos) 一句扔掉，编译器照样一声不吭。招式修好了一半，另一半仍然系在人的自觉上。` },
        { t: `svg`, caption: `下标函数里 -1 落在数据地盘外，暗号勉强安全；值函数里 -1 既是合法数据又是暗号，两种含义挤在同一个数上`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250">
  <g font-size="13" fill="#142639">
    <text x="24" y="22" font-weight="700" fill="#00599c">情形一：带回的是下标</text>
  </g>
  <g font-size="12">
    <line x1="40" y1="60" x2="520" y2="60" stroke="#9aa6b5" stroke-width="2"/>
    <g text-anchor="middle" fill="#142639">
      <circle cx="80" cy="60" r="6" fill="#ffe1dd" stroke="#b8500f"/><text x="80" y="42" fill="#b8500f">-2</text>
      <circle cx="140" cy="60" r="7" fill="#ffe1dd" stroke="#b8500f" stroke-width="2"/><text x="140" y="40" fill="#b8500f" font-weight="700">-1 暗号</text>
      <circle cx="240" cy="60" r="6" fill="#e7f6ec" stroke="#1a7f42"/><text x="240" y="42" fill="#1a7f42">0</text>
      <circle cx="300" cy="60" r="6" fill="#e7f6ec" stroke="#1a7f42"/><text x="300" y="42" fill="#1a7f42">1</text>
      <circle cx="360" cy="60" r="6" fill="#e7f6ec" stroke="#1a7f42"/><text x="360" y="42" fill="#1a7f42">2</text>
      <circle cx="420" cy="60" r="6" fill="#e7f6ec" stroke="#1a7f42"/><text x="420" y="42" fill="#1a7f42">3</text>
      <circle cx="480" cy="60" r="6" fill="#e7f6ec" stroke="#1a7f42"/><text x="480" y="42" fill="#1a7f42">4</text>
    </g>
    <text x="330" y="86" fill="#1a7f42">合法下标 0 到 4，负数不在其中</text>
    <text x="24" y="112" fill="#33465e">-1 撞不上任何正经结果，暗号这条约定勉强站得住 —— 但它仍然只写在注释里。</text>
  </g>
  <g font-size="13" fill="#142639">
    <text x="24" y="146" font-weight="700" fill="#b8500f">情形二：带回的是值本身，比如第一个负温度</text>
  </g>
  <g font-size="12">
    <line x1="40" y1="184" x2="520" y2="184" stroke="#9aa6b5" stroke-width="2"/>
    <g text-anchor="middle" fill="#142639">
      <circle cx="140" cy="184" r="7" fill="#fff3d6" stroke="#b8722b" stroke-width="2.5"/><text x="140" y="164" fill="#b8722b" font-weight="700">-1</text>
      <circle cx="240" cy="184" r="6" fill="#e7f6ec" stroke="#1a7f42"/><text x="240" y="166" fill="#1a7f42">0</text>
      <circle cx="300" cy="184" r="6" fill="#e7f6ec" stroke="#1a7f42"/><text x="300" y="166" fill="#1a7f42">3</text>
      <circle cx="360" cy="184" r="6" fill="#e7f6ec" stroke="#1a7f42"/><text x="360" y="166" fill="#1a7f42">5</text>
    </g>
    <text x="140" y="208" text-anchor="start" fill="#b8500f">既是「零下 1 度」这个真答案，又是「没找到」这个暗号</text>
    <text x="24" y="234" fill="#33465e">一个数背两个含义 —— 调用方无从分辨，编译器也无从可查，因为类型里没写「可能没有」。</text>
  </g>
</svg>` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把注释当合同。函数上方写着「返回 -1 表示没找到」，就以为每个调用点都看得见。注释不会在你调用的那一刻跳出来，改代码的人也未必先读注释。`,
          `拿函数带回的值本身当暗号。零下温度、零分、空字符串、下标 0 —— 业务数据里越常见的值，越容易撞上你随手选的那个暗号；撞上了也不报错，只是两种含义合成一种。`,
          `检查只在写代码的当下做一次。项目里散落着上百处 == -1，哪天函数把暗号换成 -2，这上百处全成哑炮，而且没有一个编译器会提醒你。`,
          `以为忘检查一定当场崩。本机是被断言拦下的，别的机器、别的容器接口可能读出一块陌生内存，给你一个看着合理的数，错到结论里去。`,
          `把「没找到」和「找到了，但值是 0」写成同一条路径。0 是最容易被误当成失败的数：下标 0 是完全合法的位置，第 41 课那张按下标取图的表里它排第一。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `想一想：编译器为什么不提醒「你忘了检查 -1」？它知道 -1 是暗号吗？`,
          `把 find_index 改成演示 3 那种「返回 bool、下标走引用参数」的版本，实测失败时那个变量里留着的是新值还是旧值`,
          `延伸：给 first_below_free 造一个只有 -2 和 -1 两个负数的数组，看看两种情况各返回什么，再想想用暗号这条路要怎么把它们分开 —— 分不开的那个缺口，就是下一课要填的。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：暗号是把「可能没有」塞进数据里，它只活在人脑和注释中，类型看不见，所以编译器一声不吭；忘检查的人收不到报错，只会收到一个被当成真数据用掉的数字。` }
      ]
    },
    {
      id: `m127`, title: `第 127 课 · optional：把「可能没有」写进返回类型`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会写、会调用返回 std::optional 的函数，会用 if 和 has_value 先问一句再取值，并能说清它比上一课那个 -1 暗号到底强在哪。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课留的那个缺口是：一个 int 出口装不下「有没有」这条信息，只能借一个数字当暗号。std::optional 的做法是不再借 —— 它给你一只盒子，盒子里要么装着 T，要么明确地空着。返回类型写 std::optional<int>，读作「可能还你一个 int，也可能什么都不还」。「可能没有」这四个字第一次出现在签名上，任何人调用都瞒不住，这跟第 116 课把「可重写」写进 override 是同一个思路：能让类型说的，就别只写在注释里。` },
        { t: `p`, text: `空盒有自己的名字：std::nullopt。return std::nullopt 和 return 一个数，是代码里明摆着的两条路，谁都不用猜。对比上一课那句 return -1：暗号版本说的是「我还你一个 int，其中某个值请你当暗号读」；盒子版本说的是「我还你一个盒子，盒子自己会报有没有货」。同一个信息，前者靠约定，后者靠类型。` },
        { t: `p`, text: `if 为什么能直接问盒子？optional 内置了一个「转成真假」的开关，于是 if 那句条件位置上一向要的真假，盒子自己就能给 —— 这正是第 27 课那条老规矩的延续。想写得更明白，就问 has_value()，两者一回事。取值另有两式：星号打开盒子、交出里面那个 T；箭头替你去问里面那位自己的成员，第 74 课那个箭头在这里换了挂靠对象，读作「盒里那位，你来一下」。` },
        { t: `p`, text: `有一条要说白：optional 并不替你检查。它做的是让「有没有」变成一个可以问、也必须问才问得出的问题；你要是不问就硬取，它不会温和地给你一个默认值，而是当场停下 —— 这一点本课演示 3 会实测给你看。跟第 121 课的 unique_ptr 摆在一起看更清楚：两者都把「一件本来靠人自觉的事」交给了类型，一个管所有权，一个管有没有。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `先拆一件误会：optional 不是指针，也不去堆上另开一块。它就是一只值对象，盒子和数据放在一起，能搁在栈上、能塞进 vector、能当结构体成员。实测本机 sizeof 给的答案是：int 是 4 字节，optional<int> 是 8 字节；string 是 32 字节，optional<string> 是 40 字节。多出来的那份就是「有没有」这个标志位对齐之后的开销 —— 上一课那套暗号一分钱不花，是因为它把标志位赖在数据地盘里；现在把它正式搬出来，代价就是几个字节。` },
        { t: `code`, lang: `text`, code: `上一课的暗号                    这一课的盒子
return -1                        return std::nullopt
调用方比 == -1                   调用方问 if 或 has_value
-1 可能撞上正经数据              空盒和任何值都撞不上，它是另一种状态不是某个数
忘检查没人管                     忘检查会拿到盒子而不是数，交给收 int 的函数直接编译不过` },
        { t: `p`, text: `最后一行是本课最实在的一条进步。上一课的漏网之鱼 —— 拿着 -1 当正常数用下去 —— 在盒子版本里会撞上类型：收 int 的函数接到 optional<int>，编译器立刻拦下，实测给的报错是 cannot convert 'std::optional<int>' to 'int'。它不能保证你检查了，但它保证你「瞒不下去」。` },
        { t: `h2`, text: `怎么做` },
        { t: `code`, lang: `c++`, code: `#include <optional>                    // optional 和 nullopt 都住在这
#include <vector>
std::optional<int> find_score(const std::vector<int>& v, int target) {
    for (int s : v)
        if (s == target) return s;          // 找到：盒里装着这个数
    return std::nullopt;                    // 没找到：交还一只明确的空盒
}` },
        { t: `p`, text: `函数体跟上一课几乎一样长，改的只有两处：返回类型从 int 换成 std::optional<int>，末尾那句 return -1 换成 return std::nullopt。中间那句 return s 不用包什么，盒子的构造是隐含的，一个 T 能直接变成装了 T 的盒子 —— 这是它写起来顺手的地方。` },
        { t: `h2`, text: `演示 1 · if 直接问盒子` },
        { t: `code`, lang: `c++`, code: `#include <optional>
#include <print>
#include <vector>
std::optional<int> find_score(const std::vector<int>& v, int target) {
    for (int s : v) if (s == target) return s;
    return std::nullopt;
}
int main() {
    std::vector<int> scores = {85, 92, 78};
    if (auto r = find_score(scores, 92)) std::println("找到了 92，值 = {}", *r);
    else std::println("没找到 92");
    if (find_score(scores, 60)) std::println("找到了 60");
    else std::println("没找到 60 ← 空盒也有明确的出路");
}` },
        { t: `p`, text: `实测输出两行：找到了 92，值 = 92 和 没找到 60 ← 空盒也有明确的出路。第 32 课那种「带初始化的 if」在这里格外顺手：auto r 那只盒子就活在 if 的两条分支里，出了 if 就没了，想忘了检查都难 —— 它的活动范围正好等于「你需要它」的范围。第二行更值得看：没找到时走的是 else，一条明路，不是一个数字被硬用下去。` },
        { t: `h2`, text: `演示 2 · 三种问法，两种取法` },
        { t: `code`, lang: `c++`, code: `#include <optional>
#include <print>
#include <string>
int main() {
    std::optional<std::string> name = "小明";
    std::println("if 问: {}，has_value 问: {}", static_cast<bool>(name), name.has_value());
    std::println("星号打开盒子: {}，箭头问成员: {}", *name, name->size());
    std::optional<int> idx = 0;
    std::println("盒里装着 0，if 问它是: {}", static_cast<bool>(idx));
    std::println("它等于 nullopt 吗: {}", idx == std::nullopt);
    return 0;
}` },
        { t: `p`, text: `实测四行：if 问 true、has_value 问 true；星号交出 小明、箭头问到的 size 是 6；盒里装着 0，if 问它是 true；等于 nullopt 吗，false。后两行是重点。**装着 0 的盒子是「有货」的盒子**：第 12 课那种「0 就是假」的直觉在这里会把人带沟里 —— 盒子回答的是「里面有没有东西」，不是「里面的数是几」。上一课那种「0 表示没有」的旧习惯，到 optional 这儿必须换掉，这是最容易被旧习惯绊一次的地方。` },
        { t: `svg`, caption: `optional 是一只要么装着 T、要么明确空着的盒子：先用 if 或 has_value 问一句，再决定用星号打开还是用箭头去问里面的成员`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250">
  <g font-size="13" fill="#142639">
    <text x="24" y="22" font-weight="700" fill="#00599c">两只盒子：一只有货，一只明确空着</text>
  </g>
  <g font-size="13" text-anchor="middle">
    <rect x="40" y="40" width="150" height="66" fill="#eaf3fb" stroke="#00599c" stroke-width="2"/>
    <rect x="60" y="58" width="110" height="34" fill="#e7f6ec" stroke="#1a7f42"/><text x="115" y="80" font-weight="700" fill="#1a7f42">92</text>
    <rect x="240" y="40" width="150" height="66" fill="#f5f6f8" stroke="#9aa6b5" stroke-width="2" stroke-dasharray="5 4"/>
    <text x="315" y="78" fill="#9aa6b5" font-size="12">空着，不是装着 0</text>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="40" y="126">std::optional&lt;int&gt; r = 92</text>
    <text x="240" y="126">std::optional&lt;int&gt; e = std::nullopt</text>
  </g>
  <g font-size="12" fill="#142639">
    <text x="420" y="52" font-weight="700" fill="#00599c">先问一句：</text>
    <text x="420" y="72">if (r)</text>
    <text x="420" y="90">r.has_value()</text>
    <text x="420" y="108">r != std::nullopt</text>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="24" y="156">问到了货，才轮得到取值的两个姿势：</text>
  </g>
  <g font-size="12">
    <rect x="24" y="170" width="286" height="46" fill="#eaf3fb" stroke="#00599c"/>
    <text x="36" y="190" fill="#142639">*r     打开盒子，交出里面那个 int</text>
    <text x="36" y="208" fill="#57677c">r->size() 这类写法：替我问盒里那位</text>
    <rect x="330" y="170" width="286" height="46" fill="#ffe1dd" stroke="#b8500f"/>
    <text x="342" y="190" fill="#b8500f">不问就硬取：value() 撞 bad_optional_access</text>
    <text x="342" y="208" fill="#b8500f">星号硬取撞断言，两种都是当场停下</text>
  </g>
  <g font-size="12" fill="#1a7f42">
    <text x="24" y="240">装着 0 的盒子照样答 true —— 盒子管的是「有没有」，不是「里面的数是几」。</text>
  </g>
</svg>` },
        { t: `h2`, text: `演示 3 · 不问就硬取会怎样` },
        { t: `code`, lang: `c++`, code: `#include <optional>
#include <print>
int main() {
    std::optional<int> r;                        // 空盒
    std::println("先看有没有: {}", r.has_value());
    std::println("再硬取 value: {}", r.value());
    std::println("这一行永远走不到");
    return 0;
}` },
        { t: `p`, text: `本机实测：屏幕上只有一句 terminate called after throwing an instance of 'std::bad_optional_access'，退出码 134，前面那句「先看有没有」也一起没了 —— 进程是被打断的，缓冲区里的字没机会交出去。星号那条路也一样：空盒上写 *r，撞上的是 libstdc++ 那句断言 _M_is_engaged，同样是 134。两条路给的都不是「一个默认值」，而是「到此为止」。所以硬取不算 bug 的唯一条件是：你确信这里不可能空 —— 而「确信」在上一课那种暗号世界里，往往就是那个 -1。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `忘包 <optional>。报错长相是 'optional' does not name a type，而且 std::nullopt 也在同一个头里，漏一个就两处一起红。它不会被 <vector> 之类顺手带进来，得自己请。`,
          `把「盒里装着 0」当成空，或者反过来把「空盒」读成 0。实测装着 0 的盒子 if 答 true。上一课「0 等于没有」的习惯在这儿要彻底换掉：盒子问有没有，值本身是几跟有没有是两件事。`,
          `问都不问就 *r 或 r.value()。上一课忘检查的后果是悄悄用掉一个错数，这一课忘检查的后果是当场停下 —— 崩得响是好事，但你不能靠崩来发现逻辑没写完。`,
          `把 optional 当容器使：想 range-for 它、问它 size、拿它装好几个结果。它最多只有一个值，是「有或没有」不是「一段」。`,
          `拿盒子去喂收 T 的函数。f(int) 遇到 optional<int> 直接编译不过，实测报 cannot convert。这不是刁难你，是它在替你拦住上一课那种把 -1 一路用下去的事故 —— 想喂就自己问一句、拆一次盒。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `写 find_max(v) 返回 optional<int>：空数组给 nullopt，否则最大值`,
          `拿上一题的空数组去问一次 has_value、再硬取一次星号，把本机报出来的那一句原样抄下来`,
          `延伸：把第 126 课那只 find_index 改写成返回 optional<int> 的版本，调用方用 if 分两条路打印，确认「没找到」不再占用任何下标值。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：optional 是把「可能没有」从注释里搬进签名 —— 空盒叫 std::nullopt，取值之前先问 if 或 has_value，问到了才用星号或箭头；它不替你检查，但它让你瞒不下去。` }
      ]
    },
    {
      id: `m128`, title: `第 128 课 · value_or：空盒就给兜底值，一行落地`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会用 value_or 把一只盒子一行收成一个真值，说清它和 if 分流的分工界线，并实测两件容易忽略的事 —— 兜底表达式每次都被算，value_or 交出来的是拷贝。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课的写法是 if 加 else 两岔，可很多调用其实没那么讲究：有值就用，没值就用一个备用的，两条路的差别只是「换成哪个数」。为此每次写四行太啰嗦。value_or 就是给这种场合准备的：括号里放上兜底值，一行写完，像外卖备注「联系不上就放前台」—— 查得到用查到的，查不到用备用的。` },
        { t: `p`, text: `它的返回类型是 T，不再是 std::optional<T>，这一步很关键：value_or 是「把盒子拆成一个能直接用的值」的动作。上一课 if 那一岔，盒子的生命延续到分支里面；value_or 一过，手上只剩一个 int 或一个 string，跟普通函数返回值没两样。所以它天生适合「拿个值去用」，不适合「两种情况要做两件不同的事」—— 要做两件事，还得回 if。` },
        { t: `p`, text: `兜底值要能变成 T。盒子里装 std::string，括号里放字符串字面量就行，实测「匿名用户」四字原样落地；盒子里装 int，括号里塞个 std::string 就编译不过 —— 它不会替你换类型换到另一个语义上去。而空盒与有值这两条路，value_or 里只走一条：有货时它连看你给的兜底值一眼都不看，直接交出盒里那个。` },
        { t: `p`, text: `最后一句要留个神：「不看一眼」是就结果而言，不是就求值而言。value_or 是一个函数调用，括号里那个表达式是它的实参 —— 第 51 课就定过规矩，实参在调用发生之前算好。所以兜底即使最后没用上，它也照样算了。这一条听着像细节，放到「兜底是一次昂贵的查询」上就是性能账，本课演示 3 实测给你看。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `code`, lang: `text`, code: `同一只盒子，三种收尾姿势
if (r) 分流          两条路各干一件事，分支里能拿到盒子本身
r.value_or(兜底)     一行落地成一个 T，两条路汇成一条
*r 或 r.value()      不分支、不兜底，硬要盒里那个 —— 空盒就当场停下` },
        { t: `p`, text: `三行的选择标准就一条：**你需不需要区分这两种情况**。需要，用 if；不需要，只是要个值，用 value_or；确信不可能空 —— 才轮到硬取。上一课那个「0 到底是没有还是零分」的坑在这里仍然有效：兜底值选得不好，两种来源会在输出上长得一模一样，区分不开了。` },
        { t: `h2`, text: `怎么做` },
        { t: `code`, lang: `c++`, code: `#include <optional>
#include <print>
int main() {
    std::optional<int> volume;                 // 空盒：还没配置
    std::println("音量 = {}", volume.value_or(50));
    volume = 80;                               // 现在有值了
    std::println("音量 = {}", volume.value_or(50));
    return 0;
}` },
        { t: `p`, text: `实测输出两行：音量 = 50、音量 = 80。第一行是「盒里没东西，交兜底」，第二行是「盒里有 80，兜底那个 50 根本没被用」。这正是配置读取最常见的形状：读得到用读到的，读不到用出厂默认 —— 全程一个 if 都没写，也没有任何一只 -1 被拿来当暗号。给盒子补值用赋值就行，第 121 课那个 reset 在这里同样能把值抹回空盒。` },
        { t: `h2`, text: `演示 1 · 查无此人时给个显示名` },
        { t: `code`, lang: `c++`, code: `#include <optional>
#include <print>
#include <string>
std::optional<std::string> nickname(int id) {
    if (id == 1) return "小明";
    return std::nullopt;                       // 查无此人：空盒
}
int main() {
    std::println("1 号昵称: {}", nickname(1).value_or("匿名用户"));
    std::println("9 号昵称: {}", nickname(9).value_or("匿名用户"));
    return 0;
}` },
        { t: `p`, text: `实测：1 号昵称: 小明、9 号昵称: 匿名用户。注意这里 value_or 的括号里放的是字符串字面量，而盒子里装的是 std::string —— 兜底值被允许「变成 T」，实测这条转换一路顺畅，打出来的是六个字而不是野值。对比第 126 课那种「查无此人返回空字符串」的写法：空字符串在这里不再是暗号，它自己也可能是一个正经昵称；现在暗号和真数据各归各位。` },
        { t: `h2`, text: `演示 2 · 同一条数据，if 与 value_or 各走一遍` },
        { t: `code`, lang: `c++`, code: `#include <optional>
#include <print>
#include <string>
std::optional<std::string> nickname(int id) {
    if (id == 1) return "小明";
    if (id == 2) return "小红";
    return std::nullopt;
}
int main() {
    for (int id : {1, 2, 9}) {
        if (auto n = nickname(id)) std::println("{} 号真名: {}", id, *n);
        else std::println("{} 号查无此人，兜底: {}", id, nickname(id).value_or("匿名用户"));
    }
}` },
        { t: `p`, text: `实测三行：1 号真名: 小明、2 号真名: 小红、9 号查无此人，兜底: 匿名用户。同一个函数被两种方式伺候过：前两行走的是 if，第三条走的是 else 里的 value_or。这里用大括号初始化列表喂 range-for 只是为了把三个 id 一趟走完 —— 第 37 课那圈遍历的循环对象，写成花括号一串值就行。真正的界线是：前两行有「查到」和「没查到」两种外观，第三行只要一个能显示的名字 —— 需要区分就 if，不需要区分就 value_or。` },
        { t: `svg`, caption: `value_or 把盒子收成一条路：盒里有货就交出盒里的，空着就交出兜底值；但兜底那个表达式作为实参，每次都会被算一遍`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250">
  <g font-size="13" fill="#142639">
    <text x="24" y="22" font-weight="700" fill="#00599c">r.value_or(兜底) 的走法</text>
  </g>
  <g font-size="12" text-anchor="middle">
    <rect x="24" y="46" width="120" height="44" fill="#eaf3fb" stroke="#00599c" stroke-width="2"/><text x="84" y="66">std::optional&lt;T&gt;</text><text x="84" y="82" fill="#57677c">一只盒子</text>
  </g>
  <g stroke="#9aa6b5" stroke-width="2" fill="none">
    <path d="M 144 60 C 200 34 250 34 300 46"/>
    <path d="M 144 78 C 200 112 250 118 300 112"/>
  </g>
  <g font-size="12" text-anchor="middle">
    <rect x="300" y="30" width="180" height="40" fill="#e7f6ec" stroke="#1a7f42"/><text x="390" y="55" fill="#1a7f42">有货 → 交出盒里的 T</text>
    <rect x="300" y="96" width="180" height="40" fill="#fff3d6" stroke="#b8722b"/><text x="390" y="121" fill="#b8722b">空着 → 交出兜底值</text>
    <rect x="500" y="63" width="116" height="42" fill="#f5f6f8" stroke="#00599c" stroke-width="2"/><text x="558" y="81">结果是一个 T</text><text x="558" y="97" fill="#57677c">不再是盒子</text>
  </g>
  <g stroke="#00599c" stroke-width="2" fill="none">
    <line x1="480" y1="50" x2="498" y2="72"/><polygon points="498,72 490,66 496,62" fill="#00599c" stroke="none"/>
    <line x1="480" y1="116" x2="498" y2="96"/><polygon points="498,96 492,90 497,86" fill="#00599c" stroke="none"/>
  </g>
  <g font-size="12" fill="#b8500f">
    <text x="24" y="160" font-weight="700">但这条路之前还有一步：实参先算</text>
    <rect x="24" y="172" width="592" height="34" fill="#ffe1dd" stroke="#b8500f"/>
    <text x="320" y="194" text-anchor="middle">value_or(查一次数据库) —— 盒里有货时那一次查询照样发生了，只是结果被丢掉</text>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="24" y="228">实测：有值那次打印了「兜底函数被叫了」，交出的却是盒里的 80。</text>
    <text x="24" y="246">想要「空盒才算兜底」，就退回 if：只有 else 分支里才算它。</text>
  </g>
</svg>` },
        { t: `h2`, text: `演示 3 · 兜底表达式每次都被算` },
        { t: `code`, lang: `c++`, code: `#include <optional>
#include <print>
int default_volume() {                         // 假装这一步很贵
    std::println("兜底函数被叫了");
    return 50;
}
int main() {
    std::optional<int> has = 80;
    std::optional<int> empty;
    std::println("有值时: {}", has.value_or(default_volume()));
    std::println("空盒时: {}", empty.value_or(default_volume()));
    return 0;
}` },
        { t: `p`, text: `实测四行：兜底函数被叫了、有值时: 80、兜底函数被叫了、空盒时: 50。看见了吗 —— **盒里有货那一次，兜底函数照样被叫了**，只是它的返回值随后被丢掉。原因就是前面说的那条：value_or 是函数调用，实参先算再进函数，第 51 课那条求值规矩一个字节都没让过。平时兜底一个 50 无所谓，可要是兜底那一步是查表、读文件、发一次请求，这个「白做一次」就是真实的代价。想要「空盒才算它」，只能退回 if，把它放进 else 那一支。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `拿 value_or 的结果去改盒子里的东西。实测：value_or 交出来的是一个新的 T，改它改的是那份拷贝，盒里原样不动；要改盒子得用星号或箭头，第 127 课那两式才碰得到里面那位。`,
          `兜底那一步很贵却没意识到会被白算。有值时结果照样算完再丢，实测打印了两回「兜底函数被叫了」。贵就用 if 分流，别把贵东西写进实参。`,
          `兜底值和「真的就是这个值」撞车。find_max 后面接 value_or(0)，输出一个 0 的时候，你永远说不清是「最大分数真的是 0」还是「空表兜的底」。这等于把第 126 课的暗号从后门又请回来了 —— 需要区分这两种情况，就别用 value_or。`,
          `兜底值的类型变不成 T。optional<int> 后面塞 std::string，编译器给一整屏模板报错，根子只有 <optional> 里那一句 static assertion failed：值转换不过去。看清这一句就够了，别去读那一屏。`,
          `把 value_or 当成「检查」用。它跟 if 一样都是你主动去问一句，而不是它逼你问；区别只在于 value_or 保证了「不管有没有货，我手里都是一个能用的值」，而星号硬取不给这条保证。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `给 nickname 加 2 号「小红」，用 if 和 value_or 两种方式各取一次值`,
          `造一个会打印一句「兜底函数被叫了」的兜底函数，拿一只装了值的盒子去 value_or，确认它照样被叫，再解释为什么`,
          `延伸：把上一课的 find_max 用 value_or(0) 收成一个 int，喂它一张空表和一串真的最大值是 0 的数据，看看两次输出能不能分开；分不开就说明这里该用 if。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：value_or 是「有就用盒里的，没有就用你给的」，一行把盒子收成一个 T；记住两条 —— 兜底表达式每次都被算，结果只是被丢掉；兜底值和真值长得一样时，该退回 if。` }
      ]
    }
  ]
};

