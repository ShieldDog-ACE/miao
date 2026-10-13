/* 喵站 · C++ 掌握 正文分部 p12：第 121–124 课
 *
 * 源稿：121_unique_ptr独占.cpp、122_转移所有权.cpp、123_shared_ptr共享.cpp、124_三种持有方式怎么选.cpp
 * 这四课是「智能指针」的一整段：先学独占，再学过户，再学共享，最后把三种持有方式排个序。
 * 主线是第 119 课那句「把收尾绑在生命期上」—— 这一批把它落进标准库给的两个类型里。
 */
window.MIAO_CPPM_P12 = {
  chapters: [
    {
      id: `m121`, title: `第 121 课 · unique_ptr 独占：一张纸条替你 delete`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会用 make_unique 在堆上造对象并交给 unique_ptr 独占保管，说清「出了作用域就自动 delete」是怎么发生的，把第 119 课的 RAII 落到一个天天在用的类型上。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 119 课说过 RAII 的核心是**把收尾绑在对象的生命期上**，第 120 课你亲手写了一个这样的类。这一课是标准库的成品：std::unique_ptr，专管「堆上的一个对象」。它的语义只有一句话 —— 我独占这块内存，我死它就死。` },
        { t: `p`, text: `拿借书卡片打比方。库里最后一本绝版书配一张纸条，纸条上写着唯一保管人的名字。纸条本身轻得很，随手放在柜台上；书在库房。柜台上的纸被撕掉时，库房那本书就该处理掉。unique_ptr 就是那张纸条：它本身是个普通的栈对象，跟着作用域出生、跟着作用域销毁；它销毁时顺手把自己保管的那个对象 delete 掉。` },
        { t: `p`, text: `为什么这事值得专门学？因为手写 delete 有三类事故，编译器一声不吭：一是**忘写**，new 出来的东西离开作用域还在，程序跑着跑着内存涨到几个 G；二是**写在 return 后面**，那条路被提前 return 或 break 跳走了；三是**中途出错提前退出**，你排在后面的收尾根本不执行（这类跳出以后再细讲）。三条的共同根因是同一句：**释放这个动作离分配太远**，中间隔着别人写的代码。unique_ptr 把释放塞进析构函数里，而出作用域必然执行析构，三类事故一起消掉。` },
        { t: `p`, text: `手感上和裸指针几乎没区别：星号 p 取值，p 箭头 member 取成员，if (p) 判空，get 看一眼地址，reset 提前放手。它不给你自增，也不让你自己 delete —— 这份「少」不是缺功能，是这一课往下两课全部的道理。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `unique_ptr 的设计目标可以列三条：**独占**、**零开销**、**自己收尾**。独占是灵魂 —— 全宇宙只有一张纸条写着这个地址。所以它**禁止复制构造与复制赋值**：不是「不建议」，是把这两个成员显式删掉了，你一试就编译不过。理由很硬：如果能复印，两张纸条就会各自 delete 同一个对象，第二次的 delete 是未定义行为，轻则当场崩，重则「今天不崩明天崩」。禁止复印的另一面是允许**过户**，过户用 std::move 写，下一课整课讲它。` },
        { t: `p`, text: `零开销是说它跟裸指针一样大、一样快：里面就存一个地址，没有计数器、不多一层跳转，析构就是一句 delete。安全不收代价，这是标准库劝你别再手写 new 的底气。至于「好几个保管人一起管」的共享纸条，内部要挂一个引用计数，代价和适用场景都不一样，那是后面一课的事。` },
        { t: `code`, lang: `text`, code: `一张纸条，两半内存：

  栈                        堆
  ┌───────────────┐         ┌───────────────┐
  │ p             │         │ int 42        │
  │ unique_ptr    │────────▶│ 值就是 42     │
  │ 里面只有一个地址│  保管   └───────────────┘
  └───────────────┘
     出作用域 → 自动 delete     你一行 delete 都不用写

  能做的：*p   p->x   if (p)   p.get()   p.reset()
  不能做：p = q 复印   p 自增   delete p.get()` },
        { t: `p`, text: `最后那行「不能做」里，delete p.get() 最阴：纸条还活着，你又手动释放了一次，等 p 出作用域它再还一回，同一块内存被释放两遍。规矩记成一句：**get 只借不还** —— 把地址交给不认识智能指针的老接口时，保管权不动。` },
        { t: `svg`, caption: `栈上的纸条、堆上的东西：unique_ptr 跟着作用域销毁，销毁时把它保管的对象 delete 掉`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 268">
  <g font-size="13" fill="#142639" text-anchor="middle">
    <text x="160" y="26" font-weight="700" fill="#00599c">作用域内：两张纸条各管一件</text>
    <text x="500" y="26" font-weight="700" fill="#1a7f42">内层作用域结束</text>
  </g>
  <rect x="30" y="40" width="270" height="150" fill="none" stroke="#57677c" stroke-dasharray="5 4"/>
  <text x="44" y="58" font-size="12" fill="#57677c">main 的作用域</text>
  <rect x="52" y="70" width="120" height="38" fill="#eaf3fb" stroke="#00599c"/>
  <text x="112" y="94" font-size="13" text-anchor="middle">p 保管 int</text>
  <rect x="150" y="122" width="130" height="38" fill="#fff3d6" stroke="#b8722b" stroke-width="2.5"/>
  <text x="215" y="146" font-size="13" text-anchor="middle" font-weight="700">q 保管 string</text>
  <rect x="120" y="108" width="180" height="70" fill="none" stroke="#b8722b" stroke-dasharray="4 3"/>
  <text x="126" y="192" font-size="12" fill="#b8722b">内层大括号</text>
  <rect x="330" y="70" width="120" height="38" fill="#eaf3fb" stroke="#00599c"/>
  <text x="390" y="94" font-size="13" text-anchor="middle">堆：42</text>
  <rect x="330" y="122" width="120" height="38" fill="#fff3d6" stroke="#b8722b" stroke-width="2.5"/>
  <text x="390" y="146" font-size="13" text-anchor="middle">堆：临时对象</text>
  <g stroke="#00599c" stroke-width="2" fill="none">
    <path d="M172 89 L326 89"/>
    <polygon points="326,89 316,83 316,95" fill="#00599c" stroke="none"/>
  </g>
  <g stroke="#b8722b" stroke-width="2" fill="none">
    <path d="M280 141 L326 141"/>
    <polygon points="326,141 316,135 316,147" fill="#b8722b" stroke="none"/>
  </g>
  <rect x="470" y="122" width="130" height="38" fill="#f6f6f6" stroke="#9db4c8" stroke-dasharray="3 3"/>
  <text x="535" y="146" font-size="13" text-anchor="middle" fill="#57677c">已被 delete</text>
  <g stroke="#1a7f42" stroke-width="2" fill="none">
    <path d="M452 141 L466 141"/>
    <polygon points="466,141 456,135 456,147" fill="#1a7f42" stroke="none"/>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="40" y="212">q 的生命期在内层右大括号结束 → 编译器插入 q 的析构 → 析构里 delete 掉堆上那个 string</text>
    <text x="40" y="236">p 还在 main 的作用域里，保管权不受影响；main 结束时轮到它</text>
    <text x="40" y="260" font-weight="700" fill="#00599c">整段代码里一个 delete 都没有 —— 释放的位置由大括号决定，不由你决定</text>
  </g>
</svg>` },
        { t: `h2`, text: `怎么做` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <memory>
#include <string>
int main() {
    auto p = std::make_unique<int>(42);      // 堆上造一个 int，纸条 p 保管
    std::println("值 = {}", *p);             // 用 * 取值，和普通指针一样
    {                                        // 缩小作用域做实验
        auto q = std::make_unique<std::string>("临时对象");
        std::println("大括号里: {}", *q);
    }                                        // ← q 在这里销毁，东西自动 delete
    std::println("出了大括号，q 保管的东西已经被自动 delete 干净了");
    return 0;
}` },
        { t: `p`, text: `跟着走一遍。make_unique 的尖括号里写「堆上要造什么类型」，圆括号里的 42 原封不动交给那个类型的构造；返回值是一张管着 int 的纸条，用 auto 接住最省事。第二行取值打印 42，跟裸指针一模一样。第三块才是本课的重点：q 活在那对嵌套大括号里，出了括号它的作用域结束，编译器在结束点插入 q 的析构调用，于是堆上那个 string 被释放 —— 而这段代码里你找不到一个 delete。` },
        { t: `p`, text: `把「没有 delete」当成一条纪律：**用了 unique_ptr 就不要再写 delete**。老写法 std::unique_ptr<int>(new int(42)) 合法但更差：字多，还把「分配」和「接管」拆成两步，中间插进别的代码就留下一个没人管那块内存的窗口；make_unique 一行到位，没有这个窗口。` },
        { t: `h2`, text: `演示 1 · 数组版本：尖括号里写方括号` },
        { t: `code`, lang: `c++`, code: `// 接在上面 main 里：一串三个 int
auto arr = std::make_unique<int[]>(3);       // 三格，全 0
arr[0] = 1; arr[1] = 2; arr[2] = 3;          // 下标照用
std::println("arr[2] = {}", arr[2]);         // 3
for (size_t i = 0; i < 3; ++i) std::print("{} ", arr[i]);
std::println("");                            // 1 2 3
// 出作用域走的是 delete[]，不用你区分单对象还是数组` },
        { t: `p`, text: `make_unique 的尖括号里放方括号，得到的是管一串的纸条，下标写法照旧。值得记的是它**替你区分了 delete 和 delete 方括号**：new int[3] 配 delete 是错的，而且错了不一定当场崩 —— 手写最容易漏的一条，交给纸条就无所谓了。造出来的一串实测是**清零**的，任务里要填的 1 2 3 得自己写。` },
        { t: `h2`, text: `演示 2 · 亲眼看见销毁的顺序` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <memory>
struct Lamp {
    int id;
    Lamp(int v) : id(v) { std::println("{} 号亮了", id); }
    ~Lamp() { std::println("{} 号灭了", id); }
};
int main() {
    auto hall = std::make_unique<Lamp>(1);
    { auto desk = std::make_unique<Lamp>(2); std::println("两盏都亮着"); }
    std::println("2 号已经灭了");
    return 0;
}   // hall 在这里才灭` },
        { t: `p`, text: `输出六行，顺序是：1 号亮了、2 号亮了、两盏都亮着、2 号灭了、2 号已经灭了、1 号灭了。最后那两句「灭」的先后就是本段的全部意义：内层大括号结束时 desk 析构，它保管的 2 号被释放；main 结束时 hall 析构，1 号才轮到。**销毁顺序和建造顺序相反**，这是栈的规律，跟第 102 课那摞盘子是同一件事。你一行收尾代码都没写，编译器按大括号给你排好了。` },
        { t: `h2`, text: `演示 3 · reset 与判空：提前放手` },
        { t: `code`, lang: `c++`, code: `// 接上一段：hall 还管着 1 号
hall.reset();                                   // 主动松手：1 号当场灭，纸条变空
std::println("reset 之后是空纸条: {}", hall == nullptr);   // true
if (hall) std::println("这句不会打出来");        // 判空和裸指针一样
std::println("地址只借出去看，不还: {}", hall.get() == nullptr);` },
        { t: `p`, text: `reset 是「我现在就不要了」：保管的东西当场释放，纸条自己变成空。之后 if (hall) 就是假。第二行打印 true 说明**空纸条是合法状态**而不是事故 —— unique_ptr 默认构造出来就是空的，这一点比裸指针体面：裸指针不初始化是个随机地址，用它纯属碰运气；空纸条你随时能问出来，也能用 if 挡住。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `忘了包 memory 头文件。报错长相是「make_unique 不是 std 的成员」或者一长串「模板参数无法推导」，加一行 include 就好，别去改代码结构。`,
          `拿裸指针赋值给它：hall = new Lamp(3)。编译不过 —— 从裸指针到 unique_ptr 的构造是显式的，不许隐式接管，就是为了防止同一块内存被两个来源管。写 make_unique，或者写全 unique_ptr 加尖括号再显式构造。`,
          `对 get 的结果做 delete。纸条还在，出作用域它又 delete 一次，双重释放。get 借看可以，永远不还保管权。`,
          `以为 make_unique<int[]>(3) 里已经是 1 2 3。数组版本只负责分配并清零，内容要自己填；打印 arr[2] 之前不填就是 0。`,
          `把纸条塞进容器后随手传进函数：按值传参会试着复制，复制被禁，编译不过。要么按引用传，要么明确过户。这一条下一课正面解决。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `用 auto arr = std::make_unique<int[]>(3); 造数组，填 1、2、3 并打印 arr[2]`,
          `延伸一：把第 120 课你手写的那个 RAII 类改成用 unique_ptr 保管，删掉所有手动收尾的代码，再打印一次构造与析构的顺序`,
          `延伸二：在一个函数里造两张纸条，一张出作用域就 reset 掉、另一张不动，观察两次「灭」分别发生在哪一行之后`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：unique_ptr 把「谁来 delete」这个问题在类型上钉死 —— 独占一张纸条，出作用域自动收尾；从这一课起，new 和 delete 都不该再出现在你写的代码里。` }
      ]
    },
    {
      id: `m122`, title: `第 122 课 · 转移所有权：纸条只能过户，不许复印`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：说清 unique_ptr 为什么禁止复制、std::move 过户之后旧变量变成什么，并练熟三条最常见的过户路线 —— 函数交回、函数接手、装进容器。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课那张纸条上只写了一个名字。这一课的所有张力都来自这一句规矩：**一张纸条只能有一个保管人，所以不许复印**。能变的只有一件事 —— 把纸条交出去，名字换成别人。这就是「转移所有权」，代码里写成 std::move。` },
        { t: `p`, text: `为什么禁得这么死？因为纸条的收尾动作是 delete。两张写着同一个地址的纸条各自出作用域，同一块内存就被释放了两遍。双重释放是未定义行为，症状从当场段错误到跑十分钟才崩都有可能。标准库的做法是**在类型上把复印这条路堵死**：复制构造和复制赋值被显式写成 delete。把源码里注释掉的那行放开试一次，报错原文是 use of deleted function std::unique_ptr 的复制构造，紧跟一行 note 指着头文件里那句 = delete 的声明。` },
        { t: `p`, text: `move 做的事是**抢走加置空**两步：新变量拿走那个地址，旧变量被当场写成 nullptr。所以过户之后旧纸条是空的、不能再用 —— 这跟复印是两个性质完全不同的问题：复印会当场崩，用被抢走的旧纸条只是拿到一个空。拿接力棒打比方最贴：棒子递给别人，你手上就腾出来了，递的动作本身不会让两根棒子同时存在。` },
        { t: `p`, text: `还有一句容易被名字骗过去的话：**std::move 自己不搬任何东西**。它只是把一个变量标成「右值」，也就是在说「这堆东西我打算弃用了」，于是选中 unique_ptr 的移动构造；真正抢地址、置空的是那个构造函数。所以 std::move 是**许可**而不是**执行** —— 你不写它，编译器宁可报错也不会替你偷偷过户。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `把 unique_ptr 的四个口子按意图排一下：**过户**用 std::move，这是让第二个变量拿到保管权的唯一通路；**借用**用引用或裸指针传参，第 74 课那个裸指针在这儿降级成「看一眼」的身份，不带 delete 的义务；**放弃**用 release，它把地址从纸条里取出交给你，纸条当场变空，从此那块内存的收尾义务回到你手上。` },
        { t: `p`, text: `设计上的取舍要看清：复印是**编译期就拦**的，而「过户完还用旧名字」编译器不管，它只保证你不会同时有两张纸条。剩下的责任在人身上 —— 过户之后还想用原件，先判一次空，或者把旧名字当成已失效。` },
        { t: `code`, lang: `text`, code: `四条路，只有一条能换保管人：

  复印  auto b = a;              ✗ 编译不过：复制构造被 delete
  过户  auto b = std::move(a);   ✓ a 变空，b 接管
  借用  use(*hall);              ✓ 保管权不动，参数写 Lamp&
  放弃  auto raw = hall.release(); ✓ hall 变空，raw 由你 delete` },
        { t: `svg`, caption: `std::move 是过户不是复印：地址交给新变量，旧变量被写成空纸条`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 262">
  <g font-size="13" text-anchor="middle" fill="#142639">
    <text x="110" y="26" font-weight="700" fill="#00599c">过户前</text>
    <text x="320" y="26" font-weight="700" fill="#b8722b">std::move 那一步</text>
    <text x="540" y="26" font-weight="700" fill="#1a7f42">过户后</text>
  </g>
  <rect x="40" y="46" width="130" height="40" fill="#eaf3fb" stroke="#00599c"/>
  <text x="105" y="71" font-size="13" text-anchor="middle">p1 管着 7</text>
  <rect x="40" y="98" width="130" height="40" fill="#f6f6f6" stroke="#9db4c8" stroke-dasharray="4 3"/>
  <text x="105" y="123" font-size="13" text-anchor="middle" fill="#57677c">还没有 p2</text>
  <rect x="40" y="150" width="130" height="40" fill="#eaf3fb" stroke="#00599c"/>
  <text x="105" y="175" font-size="13" text-anchor="middle">堆上的 7</text>
  <path d="M105 148 L105 90" stroke="#00599c" stroke-width="2" fill="none"/>
  <polygon points="105,90 99,100 111,100" fill="#00599c"/>
  <path d="M190 66 L300 116" stroke="#b8722b" stroke-width="2.5" fill="none" stroke-dasharray="6 4"/>
  <polygon points="300,116 288,112 292,124" fill="#b8722b"/>
  <text x="248" y="82" font-size="12" text-anchor="middle" fill="#b8722b">地址交出去</text>
  <text x="248" y="102" font-size="12" text-anchor="middle" fill="#b8722b">原件置空</text>
  <rect x="355" y="46" width="130" height="40" fill="#f6f6f6" stroke="#9db4c8" stroke-dasharray="4 3"/>
  <text x="420" y="71" font-size="13" text-anchor="middle" fill="#57677c">p1 是空纸条</text>
  <rect x="355" y="98" width="130" height="40" fill="#e7f6ec" stroke="#1a7f42" stroke-width="2.5"/>
  <text x="420" y="123" font-size="13" text-anchor="middle" font-weight="700">p2 管着 7</text>
  <rect x="355" y="150" width="130" height="40" fill="#eaf3fb" stroke="#00599c"/>
  <text x="420" y="175" font-size="13" text-anchor="middle">堆上的 7</text>
  <path d="M420 148 L420 140" stroke="#1a7f42" stroke-width="2" fill="none"/>
  <polygon points="420,140 414,150 426,150" fill="#1a7f42"/>
  <g font-size="12" fill="#33465e">
    <text x="40" y="210">同一块内存全程只有一张纸条写着它 —— 这是 unique 的「独」</text>
    <text x="40" y="234">p1 被写成 nullptr：判空能问出来，解引用会当场出事；收尾义务只落在 p2 身上</text>
    <text x="40" y="258" font-weight="700" fill="#b8722b">std::move 只是许可，真正抢地址并置空的是 unique_ptr 的移动构造</text>
  </g>
</svg>` },
        { t: `h2`, text: `怎么做` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <memory>
#include <utility>
int main() {
    auto p1 = std::make_unique<int>(7);
    // auto p2 = p1;                        // ✗ 放开这一行就编译不过：不许复印
    auto p2 = std::move(p1);                // ✓ 过户：p1 交出保管权
    std::println("p1 空了吗: {}", p1 == nullptr);
    std::println("p2 的值: {}", *p2);
    return 0;
}` },
        { t: `p`, text: `实测输出两行：p1 空了吗: true、p2 的值: 7。过户就这两下 —— 等号右边套一层 std::move，新变量接管、旧变量变空。std::move 住在 utility 头文件里，规规矩矩包上它；靠别的头文件顺手带进来是运气，换台机器就没了。` },
        { t: `h2`, text: `演示 1 · 函数把纸条交回给你` },
        { t: `code`, lang: `c++`, code: `// 工厂函数放在 main 之前；下面两行接在 main 里
std::unique_ptr<int> make_number(int v) {
    return std::make_unique<int>(v);   // 返回纸条：转交给调用者
}
auto p3 = make_number(99);
std::println("函数返回的值: {}", *p3);      // 99` },
        { t: `p`, text: `这条路线是 unique_ptr 每天在用的一条：函数在堆上造对象，把保管权交给调用者。中间没有手动 delete，也没有「到底谁负责释放」这种口头约定 —— 义务写在返回类型上，跟着返回值走。调用处的 p3 一出作用域，那个 99 就被收掉。注意 return 那行不用写 std::move：返回局部对象时编译器自己会走移动这条路，硬写反而是老习惯，机制以后再讲。` },
        { t: `h2`, text: `演示 2 · 按值收参数的函数就是接手` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <memory>
#include <utility>
struct Lamp { int id; Lamp(int v) : id(v) { std::println("{} 号亮了", id); } ~Lamp() { std::println("{} 号灭了", id); } };
void take(std::unique_ptr<Lamp> p) { std::println("接手的人管着 {} 号", p->id); }
int main() {
    auto k = std::make_unique<Lamp>(20);
    take(std::move(k));                      // 不写 move 编译不过：按值参数要复制
    std::println("交出去之后 k 空了吗: {}", k == nullptr);
    return 0;
}` },
        { t: `p`, text: `实测四行，顺序是：20 号亮了、接手的人管着 20 号、20 号灭了、交出去之后 k 空了吗: true。那一盏灯是在 take 的右大括号里灭的，不是在 main 里 —— 保管权进了函数的口袋，函数结束就轮到它收尾。这也给出一条判断：**按值收 unique_ptr 的参数等于把东西送人**，函数名要配得上这个动作。只想让对方看一眼，参数就写 Lamp& 或裸指针 Lamp*，调用处写星号 k 传进去，谁也不用过户。` },
        { t: `h2`, text: `演示 3 · 容器养一排独占对象` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <memory>
#include <utility>
#include <vector>
int main() {
    std::vector<std::unique_ptr<int>> box;
    box.push_back(std::make_unique<int>(3));   // 现造的直接进，不用 move
    auto one = std::make_unique<int>(4);
    box.push_back(std::move(one));             // 已有纸条必须过户
    std::println("箱子里 {} 格，第一格 {}", box.size(), *box[0]);
    return 0;
}` },
        { t: `p`, text: `输出是 箱子里 2 格，第一格 3。vector 里放 unique_ptr 完全合法，因为容器要的正是「每个元素独占一格」；但它**不会替你做过户** —— 写 box.push_back(one) 用的是复制那条路，编译器拒绝，报错还藏在标准库内部（alloc_traits 里那句 no matching function for call to construct_at），一长屏模板错误，根因只有一句：不许复印。从箱子里把某盏灯拿走也一样要 std::move，剩下的格子不受影响；pop_back 则当场把那格的纸条销毁，上一课那种「灭了」的打印会立刻出现。` },
        { t: `code`, lang: `c++`, code: `// 接上一段，还在 main 里：release 把保管权讨回你手上
int* raw = box[0].release();
std::println("release 后 box[0] 空了吗: {}", box[0] == nullptr);
delete raw;                                    // 义务已经归你，必须自己还` },
        { t: `p`, text: `release 与 get 的区别就一句话：**get 借看，release 移交**。release 之后那张纸条是空的，箱子里那一格也在不再管那块内存，剩下的收尾全靠你写的 delete。标准库留这个口子是给「把所有权交给不认识智能指针的老接口」用的，日常代码里几乎不该出现它 —— 用了它，上一课那句「再也不用手写 delete」立刻作废。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `想复印：auto p2 = p1。报错是 use of deleted function 加一句 = delete 的 note，别去改类型、别去查半天，正确的下一步是 std::move。`,
          `过户之后继续用旧名字。编译器一声不吭，星号 p1 解引用的是空指针，属于未定义行为 —— 可能当场崩，也可能读到垃圾再算。过户完就把旧名字当失效，要用先判空。`,
          `往容器里塞纸条忘了 move。症状是一屏看不懂的模板错误，落点在标准库内部文件；定位方法是看最后那句「要求复制」，补 std::move 就通。`,
          `把 release 当成 get 用，release 完忘了自己 delete，于是那块内存谁都不管了 —— 恰好是这一章要消灭的那种漏。只是看一眼请用 get。`,
          `按值收 unique_ptr 参数，调用处又不写 move，编译不过；或者反过来，只是借看却按值收，把人家的东西顺走了一盏灯。借看写 Lamp& 或 Lamp*。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把源码里注释掉的那行 auto p2 = p1 放开，看看编译器怎么拦「复印」，把报错里 deleted function 那一句抄进你的笔记`,
          `延伸一：写一个返回 unique_ptr 灯的工厂函数，调用处接住它，再把它过户给一个按值收参数的函数；数一数「灭了」打印在第几行之后出现`,
          `延伸二：做一个装 unique_ptr 的 vector 箱子，放进去三个数（现造的走 push_back，已有的先 move），逐个打印再 pop_back，观察每格的保管权什么时候换人`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：unique_ptr 之间只有一条通路叫过户 —— std::move 抢走地址并把原件写成空；复印被类型堵死，借用交给引用与裸指针，release 是把收尾义务讨回你自己手上。` }
      ]
    },
    {
      id: `m123`, title: `第 123 课 · shared_ptr 共享：一张小卡片数着几个人在管`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会用 make_shared 造「可以一起保管」的对象，用 use_count 亲眼看引用计数怎么涨怎么落，并且说清 shared_ptr 什么时候开始漏内存。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课的规矩是「一张纸条一个保管人」，这一课把它松开：std::shared_ptr 允许**同一个对象有好几张纸条**。它靠的是内部一个计数器 —— 复制一次加一，销毁一次减一，减到 0 的那一刻才真正 delete。这套规矩的名字你听过：**引用计数**。` },
        { t: `p`, text: `合租房的比方比接力棒贴切：客厅里那台冰箱是公共的，四个室友各自有一把钥匙，谁都不能说「冰箱是我的」。最后一把钥匙被交回的那天，房子才清理冰箱。shared_ptr 就是配钥匙：配一把计数加一，退租一把计数减一，归零就打扫。` },
        { t: `p`, text: `计数器住在哪儿？不在对象里，也不在纸条里，而在**另一张小卡片**上：make_shared 会一次分配两样东西 —— 你的对象，加一张记数的卡片。每张纸条里存两个地址：对象在哪、卡片在哪，这也是它比 unique_ptr 胖的原因，实测 sizeof 一个 shared_ptr 是 16 字节，而 unique_ptr 和裸指针都是 8 字节。复制纸条的动作很便宜：抄两个地址、把卡片上那个数加一；代价花在**每次复制与销毁都要动那张卡片**上。` },
        { t: `p`, text: `数到 0 才 delete，这件事把上一课那条「谁来收尾」的口头难题自动化了 —— 你不用指定主人，最后离开的那个人自动是主人。这正是它的价值，也是它的价：谁都不用自己负责，于是没有人去数到底几个人在管，读代码的难度上来了。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `设计上 shared_ptr 是 unique_ptr 的**松弛版**：接口几乎一样（星号取值、箭头取成员、get 看地址、reset 放手、判空），差别全在两条上 —— **允许复制**，以及**多一个 use_count** 让你把计数打出来。它的适用场景也写在这两条里：只有当你说不清谁是唯一主人时才用它。` },
        { t: `code`, lang: `text`, code: `两种纸条放一起看：

              unique_ptr              shared_ptr
  复印        禁止，只能过户          允许，计数加一
  纸条大小    8 字节                 16 字节：一个对象地址加一个计数卡片地址
  收尾时机    那张纸条出作用域        计数减到 0 的那一刻
  看计数      没有这个需求            a.use_count()
  什么时候用  必须在堆上、主人只有一个  真的有几个人共同保管，且顺序说不清` },
        { t: `p`, text: `最后一行是本课的结论，也是下一课整课要展开的东西：**能用 unique_ptr 就别用 shared_ptr**。别把 shared_ptr 当「懒得想归属」的默认选项 —— 它把责任推给运行期，换来的是每次复制都要动卡片、以及下面演示 3 那种一整对都放不掉的环。` },
        { t: `svg`, caption: `引用计数跟着作用域涨落：三张纸条各算一份，减到 0 的那一刻才 delete`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 258">
  <g font-size="13" fill="#142639" text-anchor="middle">
    <text x="320" y="24" font-weight="700">一张卡片记着几个人在管</text>
  </g>
  <g font-size="12" fill="#57677c">
    <text x="36" y="56">① make_shared 造出来</text>
    <text x="36" y="96">② b、c 各复制一张</text>
    <text x="36" y="136">③ 内层大括号结束</text>
    <text x="36" y="176">④ a 也出作用域</text>
  </g>
  <g font-size="13" text-anchor="middle">
    <rect x="250" y="42" width="150" height="28" fill="#eaf3fb" stroke="#00599c"/><text x="325" y="61">a</text>
    <circle cx="470" cy="56" r="19" fill="#fff3d6" stroke="#b8722b" stroke-width="2.5"/><text x="470" y="61" font-weight="700">1</text>
    <rect x="250" y="82" width="150" height="28" fill="#eaf3fb" stroke="#00599c"/><text x="278" y="101">a</text>
    <rect x="300" y="82" width="100" height="28" fill="#eaf3fb" stroke="#00599c"/><text x="350" y="101">b  c</text>
    <circle cx="470" cy="96" r="19" fill="#fff3d6" stroke="#b8722b" stroke-width="2.5"/><text x="470" y="101" font-weight="700">3</text>
    <rect x="250" y="122" width="150" height="28" fill="#eaf3fb" stroke="#00599c"/><text x="325" y="141">a</text>
    <circle cx="470" cy="136" r="19" fill="#fff3d6" stroke="#b8722b" stroke-width="2.5"/><text x="470" y="141" font-weight="700">1</text>
    <rect x="250" y="162" width="150" height="28" fill="#f6f6f6" stroke="#9db4c8" stroke-dasharray="4 3"/><text x="325" y="181" fill="#57677c">没有纸条</text>
    <circle cx="470" cy="176" r="19" fill="#e7f6ec" stroke="#1a7f42" stroke-width="2.5"/><text x="470" y="181" font-weight="700" fill="#1a7f42">0</text>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="510" y="60">← 卡片上的数就是 use_count</text>
    <text x="510" y="180" fill="#1a7f42" font-weight="700">→ 此刻才 delete</text>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="40" y="214">复制一张加一，出作用域减一 —— 收尾时机由「最后一个走的人」决定，不用你指定主人</text>
    <text x="40" y="238" font-weight="700" fill="#b8722b">代价：纸条胖一倍，每步都要动卡片；两个 shared_ptr 互相指着，计数就永远回不到 0</text>
  </g>
</svg>` },
        { t: `h2`, text: `怎么做` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <memory>
#include <string>
int main() {
    auto a = std::make_shared<std::string>("共享数据");   // 计数 = 1
    std::println("刚创建，计数 = {}", a.use_count());
    {                                      // 内层作用域：两位朋友加入
        auto b = a; auto c = a;             // 各复印一张，计数加到 3
        std::println("两个朋友加入，计数 = {}", a.use_count());
    }                                      // b、c 销毁，计数 -2
    std::println("朋友走了，计数 = {}", a.use_count());
    std::println("数据还在: {}", *a);
    return 0;
}` },
        { t: `p`, text: `实测四行，顺序与数字都得记住：**刚创建 1、两个朋友加入 3、朋友走了 1、数据还在 共享数据**。中间那一步是 3 而不是 2 —— 计数算的是「此刻一共几张纸条」，a 自己那张也在数里，b 和 c 各自加一。这一条几乎每次考试都要考，别按「新增了几个」去数。` },
        { t: `p`, text: `最后两行说明 shared_ptr 的另一半性格：内层那两张销毁时**只减计数，不动对象**。计数还留着 1，说明 a 还在管，堆上那个 string 自然还在，星号 a 照样能读。真正 delete 的时刻是 a 也离开作用域、计数落到 0 的那一瞬间 —— 这段代码里同样一个 delete 都没写。` },
        { t: `h2`, text: `演示 1 · 从别人的纸条再复制一张` },
        { t: `code`, lang: `c++`, code: `// 接在上一段的 main 里，此时 a 的计数是 1
{
    auto b = a;                          // 计数 2
    auto d = b;                          // 计数 3：从 b 再抄一张
    std::println("三张在手，计数 = {}", d.use_count());
}                                        // b、d 一起销毁
std::println("他们走了，计数 = {}", a.use_count());` },
        { t: `p`, text: `实测两行：**三张在手 3、他们走了 1**。三张纸条里谁的计数都一样，use_count 是个共享的数字，用 d 问、用 b 问、用 a 问都是同一个答案 —— 它问的是卡片，不是纸条。也正因为这样，内层那两把钥匙退回时对象不会消失：计数只是从 3 掉回 1。要确认「归零才删」，就在类的析构里打一行字，然后看它到底有没有出现 —— 这是这一章最可靠的一种调试手法。` },
        { t: `h2`, text: `演示 2 · 传参与进容器都会悄悄加一` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <memory>
#include <vector>
void borrow(std::shared_ptr<int> p) { std::println("函数里计数 = {}", p.use_count()); }
int main() {
    auto a = std::make_shared<int>(7);
    std::vector<std::shared_ptr<int>> owners;
    owners.push_back(a);                        // 进箱子：多一张纸条
    std::println("进箱子后计数 = {}", a.use_count());    // 2
    borrow(a);                                  // 按值传参：临时多一张
    std::println("回来之后计数 = {}", a.use_count());    // 2
    return 0;
}` },
        { t: `p`, text: `实测三行：进箱子后 2、函数里 3、回来之后 2。两处细节值得停一下。第一，往容器里 push 一张 shared_ptr 是**复制**，容器那一格从此也是保管人，所以计数会长期挂着一个「箱子」；第二，按值传 shared_ptr 参数也是复制，函数里能数出 3，返回后自动掉回 2 —— 这一下加一下不影响正确性，但它说明：**只是看一眼根本不必多配一把钥匙**，参数写常引用更好。` },
        { t: `h2`, text: `演示 3 · 两个人互相牵着，就谁也走不了` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <memory>
struct Node {
    int id;
    std::shared_ptr<Node> peer;                 // 同伴也归我保管
    Node(int v) : id(v) { std::println("{} 号建造", id); }
    ~Node() { std::println("{} 号拆除", id); }
};
int main() {
    auto y = std::make_shared<Node>(2);
    auto z = std::make_shared<Node>(3);
    y->peer = z; z->peer = y;                   // 互相牵着
    return 0;                                   // 两个「拆除」都没打印
}` },
        { t: `p`, text: `实测输出只有两行：**2 号建造、3 号建造** —— 出了 main，一句「拆除」都没有。原因画出来就明白了：y 那张纸条除了被 main 拿着，还被 z 的同伴格拿着；z 也一样。main 结束时 y 与 z 各自减一，计数从 2 掉到 **1**，谁都不是 0，于是谁都不拆；而那两张留在对象里的纸条，本来要等对象拆除才会销毁 —— 互相等，永远等不到。这叫**循环引用**，是 shared_ptr 唯一常见的漏内存方式。` },
        { t: `p`, text: `把最后那行赋值删掉再跑一遍，建造与拆除就成对出现了，可见漏的根因正是那两句互相指。标准库里另有一张**只记地址、不参与计数**的纸条，专门用来剪断这种环（父看子、子指父那一类结构要用它），后面讲到时会正面处理；这一课的要求只有一条：写 shared_ptr 之前先画一下箭头，看会不会形成圈。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `数计数时把 a 自己漏掉：a 加两个朋友是 3，不是 2。use_count 问的是卡片上「现在一共几张纸条」。`,
          `拿 shared_ptr.get() 的地址再去 new 一张 shared_ptr。同一块地址被两张独立卡片各自管一遍，最后双重释放。要从已有纸条得到新纸条就复制纸条，别从裸指针重开一张。`,
          `把 shared_ptr 当默认选项，因为它「不用想谁负责」。代价实测在纸条本身：16 字节对 8 字节，外加每次复制与销毁都要动卡片。一个主人就回上一课。`,
          `忘了循环引用这一课：两个对象互相 shared_ptr 指着，计数停在一，析构不发生，编译器全程不提示。加一行析构打印就能当场抓出来。`,
          `想让「只有一个人能改」又到处发 shared_ptr。shared_ptr 只管活多久，不管谁能写：要独占改动权就发 const 的引用或裸指针去看，保管权留在一个 unique_ptr 里。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把 b 再复制给一个新变量 d，打印 use_count，再让 d 出作用域看计数怎么变；把每一步的数字先猜再验`,
          `延伸一：给一个类加上构造与析构的打印，把 shared_ptr 按值传进函数一次、再放进 vector 一次，把每次 use_count 的数字记下来`,
          `延伸二：造两个互相牵着的 shared_ptr 节点，确认析构那句「拆除」没有打印出来；再删掉互相赋值的那一行，看输出怎么变`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：shared_ptr 用一张计数卡片换掉「谁来收尾」这个问题 —— 复制加一、销毁减一、归零才 delete；代价是纸条更胖、箭头可能打结成环，所以主人说得清的时候别用它。` }
      ]
    },
    {
      id: `m124`, title: `第 124 课 · 三种持有方式怎么选：值、独占纸条、共享纸条`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把「拿一个东西」的四条路排成一条决策顺序 —— 先值、再 unique_ptr、再 shared_ptr，裸指针只当眼睛用；并说清每条路各自让谁负责收尾。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `三课下来你手上已经有四种拿东西的方式：值、裸指针、unique_ptr、shared_ptr。这一课不给新语法，只给一条顺序：**先值，再独占纸条，再共享纸条，裸指针只用来看一眼**。这条顺序不是风格偏好，是按「你还要额外操多少心」排的 —— 值类型自己扫尾，string 和 vector 本来就是现成的 RAII 类；unique_ptr 替你记着那一次 delete；shared_ptr 更进一步，替你算出「谁是最后一个走的人」。操心的量从少到多，顺序也就这么排。` },
        { t: `p`, text: `有一句容易漏掉的话要先说：**用值不等于不用堆**。string 里那些字符、vector 里那些元素，本来就躺在堆上，只是收尾工作被写进了类型的构造与析构里，你在栈上拿的是一个句柄。所以「默认选值」不是躲开堆，而是**把堆的麻烦交给类型自己管** —— 第 119 课那句「把收尾绑在生命期上」讲的正是这件事，而这一章的三个类型是它的成品。` },
        { t: `p`, text: `那什么时候真的非纸条不可？两类场合。一是**这一排里要装不同种类的东西**：容器一格只能放一个尺寸的元素，而派生类对象通常比基类大，于是让每个对象各自住堆上，排里放纸条，靠基类的虚函数统一发号施令 —— 第 116、117 课那套继承在这儿第一次真正派上用场。二是**要把一个大物件的「把手」递出去而不是整箱搬走**，比如一个对象要在好几个地方长期存在、又不许复制。这两类之外，习惯性的 new 基本都是多余的。` },
        { t: `p`, text: `裸指针的地位也得当场说死。从这一课起它不再是「管东西」的角色，只剩两个用途：**给对方看一眼**，以及**指向一个不属于我的东西**。它没有析构、不会 delete、不表态。所以借看的时候要在心里（最好也在注释里）写清一句话：我借给你看，你不许还。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `四种拿法的差别其实只有一个问题：**收尾义务落在谁身上**。把这一列写出来，选择就自动出来了 —— 谁负责得越清楚、越不需要运行期算数，方案就越靠前。` },
        { t: `code`, lang: `text`, code: `问自己这一句                     选谁          收尾义务在谁身上
东西在栈上活到作用域结束就够     值类型         类型自己，不用你操心
非要活得比作用域久 / 一排装不同类 unique_ptr    那张纸条出作用域
真的有几个人共同保管，说不清谁最后走 shared_ptr 计数落到 0 的那一刻
只是让对方看一眼                 裸指针或引用   不负责，谁也不许 delete

顺带把成本对齐（本机实测）：unique_ptr 纸条 8 字节、shared_ptr 纸条 16 字节、裸指针 8 字节。` },
        { t: `svg`, caption: `决策顺序三问：先问能不能用值，再问能不能独占，最后才允许共享`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 268">
  <g font-size="13" text-anchor="middle" fill="#142639">
    <text x="320" y="24" font-weight="700">从省事到费事，三问答完就定</text>
  </g>
  <rect x="40" y="44" width="200" height="46" fill="#eaf3fb" stroke="#00599c"/>
  <text x="140" y="63" font-size="12" text-anchor="middle">① 作用域内活得好好的</text>
  <text x="140" y="83" font-size="13" text-anchor="middle" font-weight="700">就写值</text>
  <rect x="270" y="44" width="180" height="46" fill="#fff3d6" stroke="#b8722b"/>
  <text x="360" y="63" font-size="12" text-anchor="middle">② 必须住堆上，主人只有一个</text>
  <text x="360" y="83" font-size="13" text-anchor="middle" font-weight="700">unique_ptr</text>
  <rect x="470" y="44" width="140" height="46" fill="#e7f6ec" stroke="#1a7f42"/>
  <text x="540" y="63" font-size="12" text-anchor="middle">③ 好几个保管人</text>
  <text x="540" y="83" font-size="13" text-anchor="middle" font-weight="700">shared_ptr</text>
  <g stroke="#57677c" stroke-width="2" fill="none">
    <path d="M240 67 L266 67"/><polygon points="266,67 256,61 256,73" fill="#57677c"/>
    <path d="M450 67 L466 67"/><polygon points="466,67 456,61 456,73" fill="#57677c"/>
  </g>
  <g font-size="12" fill="#57677c" text-anchor="middle">
    <text x="253" y="56">不够</text>
    <text x="458" y="56">说不清</text>
  </g>
  <rect x="40" y="112" width="570" height="42" fill="#f6f6f6" stroke="#9db4c8"/>
  <text x="325" y="132" font-size="13" text-anchor="middle">裸指针：不参与保管，只当眼睛 —— 参数里借看，永远不 delete</text>
  <text x="325" y="148" font-size="12" text-anchor="middle" fill="#57677c">上一课的 release 是把义务讨回自己手上，属于「交给老接口」的例外，日常代码里不该出现</text>
  <g font-size="12" fill="#33465e">
    <text x="40" y="182">三档的成本实测：值不收额外代价；unique 多一次堆分配、纸条 8 字节；shared 纸条 16 字节、还要一张计数卡片</text>
    <text x="40" y="206">shared 的两种代价：每次复制与销毁都动卡片；对象互相指成环时计数回不到 0，一对都拆不掉</text>
    <text x="40" y="238" font-weight="700" fill="#00599c">顺序反了的典型症状：满屏星号、谁都读不出对象什么时候没 —— 那不是安全，是把责任推给运行期</text>
  </g>
</svg>` },
        { t: `h2`, text: `怎么做` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <memory>
#include <string>
int main() {
    std::string best = "值类型";             // ① 九成场景：直接用值
    auto up = std::make_unique<int>(10);     // ② 单主人 + 堆分配
    auto sp = std::make_shared<int>(20);     // ③ 多主人共享
    std::println("① 值:         {}", best);
    std::println("② unique_ptr: {}", *up);
    std::println("③ shared_ptr: {}", *sp);
    return 0;
}` },
        { t: `p`, text: `实测三行：① 值: 值类型、② unique_ptr: 10、③ shared_ptr: 20。三行读法不同：值直接写名字；unique 与 shared 要星号或箭头穿过纸条。这个「多一层星号」的差别就是本课的判据之一 —— **如果多出来的那一层没换来任何东西，就不该套纸条**。这里给 int 套纸条其实都是浪费，真正需要纸条的是前面说的那两类场合。` },
        { t: `p`, text: `顺带把 make_shared 与 make_unique 的分工钉一下：两个都是「当场在堆上造、当场接管」，参数原封不动交给对象的构造。shared 这边几乎总是该用 make_shared，而不是先 new 再塞给 shared_ptr —— 前者把对象和计数卡片一次分配好，后者要走两趟分配，还多留一个没人管的裸指针窗口，就是第 121 课说过的那个窗口。` },
        { t: `h2`, text: `演示 1 · 函数交回一个东西：值就够` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <memory>
#include <string>
std::string tag_value(std::string who) { return "[" + who + "]"; }
std::shared_ptr<std::string> tag_shared(std::string who) {
    return std::make_shared<std::string>("[" + who + "]");
}
int main() {
    auto v = tag_value("小明");            // 值：直接交回调用者的变量
    auto s = tag_shared("小明");           // 纸条：多绕一趟堆
    std::println("① {} ② {} 计数 {}", v, *s, s.use_count());
    return 0;
}` },
        { t: `p`, text: `实测一行：① [小明] ② [小明] 计数 1。两个函数都正确，也都不会漏 —— 但左边那个没有纸条、没有计数、没有星号，调用者拿到的是一个普通 string，用完自己扫尾。这打掉一个很常见的误解：「函数要给我一个对象，就得返回指针」。返回值本来就会活到调用者那个变量出作用域，**纸条要等到「东西必须留在堆上」时才升级**。计数 1 也顺手说明 tag_shared 那边只有一个保管人，此刻它和 unique_ptr 干的是同一件事，却付了共享的钱。` },
        { t: `h2`, text: `演示 2 · 非纸条不可的一排不同形状` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <memory>
#include <vector>
struct Shape { virtual ~Shape() = default; virtual void draw() const = 0; };
struct Circle : Shape { void draw() const override { std::println("圆"); } };
struct Rect : Shape { void draw() const override { std::println("方"); } };
int main() {
    std::vector<std::unique_ptr<Shape>> art;
    art.push_back(std::make_unique<Circle>());
    art.push_back(std::make_unique<Rect>());
    for (const auto& s : art) s->draw();
    std::println("排里装的是 {} 张纸条", art.size());
    return 0;
}` },
        { t: `p`, text: `实测三行：圆、方、排里装的是 2 张纸条。这就是那条「非用不可」：vector 的每一格尺寸必须一样，装不进大小不同的两种对象；改成装 unique_ptr<Shape>，每个形状各自住在堆上，排里只是把手，一视同仁。第 116 课那句「基类析构要写 virtual」在这儿是保命的：销毁是通过 Shape 这个基类指针发生的，析构不是虚的话，派生类那半截不会被拆。` },
        { t: `p`, text: `这里选 unique 而不是 shared 也是有讲究的：每一格只有一个人保管，归属清清楚楚。等到你确实要让好几处同时持有同一个形状（比如画面列表和选中项指向同一个），才把它换成 shared_ptr —— 这一课的决策顺序，在这段代码里就走完了一遍。` },
        { t: `h2`, text: `演示 3 · 裸指针只当眼睛` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <memory>
void peek(const int* p) { if (p) std::println("看一眼: {}", *p); }
void show(const int& r) { std::println("看一眼: {}", r); }
int main() {
    int own = 5;                                 // 栈上的东西，没人保管
    auto up = std::make_unique<int>(8);
    peek(&own);                                  // 取地址：第 74 课那个 &
    peek(up.get());                              // 纸条借出去看，保管权不动
    show(*up);                                   // 或者直接把管着的东西给它
    peek(nullptr);                               // 空地址：if 挡掉，什么都不打
    return 0;
}` },
        { t: `p`, text: `实测打三行：看一眼: 5、看一眼: 8、看一眼: 8，最后那句 peek 传空地址什么都不打。三个要点：**传引用**是「借看」最干净的写法，函数里连空的可能都不用判；传 get 的结果适合那种「不接收空」的老接口；而 peek 里那句 if 是裸指针参数的保命符 —— 第 74 课那条「先判空再用」在这章一点没旧。反过来，peek 与 show 里都**绝对不许写 delete**：借来的东西不是你的，还也是它自己出事。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `一上来就 shared_ptr，理由是「省得想谁负责」。它把责任推到运行期，多付一次计数卡片，还可能埋下环。归属写得清就回 unique_ptr。`,
          `值类型明明够用还套纸条：拿 unique_ptr 管一个只在函数内用的 string。多一次堆分配、多一层星号，什么都没换来，读代码的人反而要问「这里是不是要跨作用域」。`,
          `继续裸 new：Shape* p = new Circle(); 塞进 vector，然后指望某个地方去 delete。这一章的目标就是让这种代码绝迹 —— 换成 make_unique 塞进装纸条的容器。`,
          `把借看来的裸指针存成成员长期用。纸条出作用域那一刻东西就没了，你留着的地址变成悬空地址，读它是未定义行为。借看只在**这一次调用**里有效，要长住就得真给保管权。`,
          `用某块地址又开一张新纸条，比如拿 get 的结果去构造 shared_ptr。两个控制块各自释放一次，双重释放。要新纸条就复制已有纸条，别从裸指针重开。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `检查你以前写过的代码：有裸 new 或 delete 吗？有就改成 unique_ptr，并把改完的段贴出来对比`,
          `延伸一：给「函数交回一个对象」写值版本和 shared_ptr 版本各一份，数一数第二份多付了什么，说明这里该选哪一个`,
          `延伸二：用装 unique_ptr 的 vector 复刻演示 2，再加一个派生类塞进去；然后把基类的 virtual 析构删掉，看编译器给你什么提示`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：拿东西按省事到费事排 —— 值、unique_ptr、shared_ptr，裸指针只当眼睛；写之前先问一句「这里有几个保管人」，答案是一个就用值或独占，说不清才用共享，并且随时检查箭头有没有打圈。` }
      ]
    }
  ]
};
