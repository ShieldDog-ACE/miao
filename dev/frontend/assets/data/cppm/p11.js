/* 喵站 · C++ 掌握 正文分部 p11：第 117–120 课（第九轮）
 *
 * 源稿：117_抽象类与explicit.cpp、118_特殊五件套.cpp、119_RAII是什么.cpp、120_手写一个RAII类.cpp
 * 117/118 收尾 L3-04 的面向对象这一段，119/120 开 L4-01 的 RAII 新章。
 * 写法照 p04：讲「为什么这么想」，不只讲「语法长这样」。
 */
window.MIAO_CPPM_P11 = {
  chapters: [
    {
      id: `m117`, title: `第 117 课 · 抽象类与 explicit：留个空洞逼孩子填，顺手把偷偷转换堵住`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：看懂 = 0 这个纯虚函数是「爹留的空洞」，知道含空洞的类只能当爹不能直接造对象；会给单参数构造加 explicit，把「一个数悄悄变成一个圆」这条路堵死。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 116 课你已经会让子类盖掉父类的函数了：父类写 virtual，子类写 override，调用时按对象的真实类型走。那一课还留着一条尾巴 —— 父类自己也得给 area 写一份实现，哪怕这份实现是「我也不知道该等于几」，硬凑一个 return 0.0。可这个 0.0 不是答案，是谎话：Shape 的面积本来就没有值，任何形状都可以不是圆不是方，唯独不可能面积为 0 还叫一个形状。C++ 给了句实话可以写：在虚函数的末尾写 **= 0**。` },
        { t: `code`, lang: `text`, code: `double area() const;              // 普通函数：父类自己实现，孩子可以照用
virtual double area() const;      // 虚函数：父类给一个版本，孩子愿意就盖掉
virtual double area() const = 0;  // 纯虚函数：父类不实现，孩子必须自己写` },
        { t: `p`, text: `这个 0 和「返回零」一点关系都没有，它是历史留下的一个记号，读法只有一种：**这里我没实现，你看着办。** 一个类里哪怕只有一个纯虚函数，它就变成了**抽象类** —— 一类「半成品」，规定了必须有什么动作，但自己不完成任何一份。` },
        { t: `p`, text: `抽象类有一条立刻就能撞上的硬规矩：**不能直接造对象。** 你写 Shape s; 编译当场拒绝。道理不玄乎：造对象就是要给每份数据、每个函数一个确定的落点，而 area 在这里根本没有落点，造出来就是个坏掉的东西，所以编译器从一开始就不许你造。它能出现的姿势只有两种 —— 当引用、当指针，而且必须指向某个真实子类造出来的对象。这正是第 116 课那套多态的地基：手上握着一个 Shape&，心里清楚底下那个对象一定有 area 的实现，因为**没实现的孩子根本造不出来**。抽象类把「所有子类都会算面积」从口头约定变成了编译器背书的强制，顺手还把父类那份「不知道怎么算」的假实现省掉了 —— Shape 只回答「形状都能干什么」，不回答「面积怎么算」。` },
        { t: `svg`, caption: `Shape 的 area 是一格空洞：谁想被造出来，就必须把这一格填上自己的算法。填了的类站在下面，没填的类编译器压根不让它造对象`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300">
  <text x="20" y="22" font-size="13" font-weight="700" fill="#142639">纯虚函数 = 空洞：父类只列动作，不填算法</text>
  <g font-size="12" fill="#26405a">
    <rect x="200" y="38" width="240" height="84" rx="8" fill="#eef2f7" stroke="#8b98ab" stroke-width="2" stroke-dasharray="6 4"/>
    <text x="320" y="58" text-anchor="middle" font-weight="700" fill="#142639">Shape 抽象类</text>
    <text x="320" y="78" text-anchor="middle">~Shape 有实现</text>
    <rect x="228" y="90" width="184" height="24" rx="5" fill="#fdece1" stroke="#b8500f" stroke-width="1.5"/>
    <text x="320" y="106" text-anchor="middle" fill="#b8500f" font-weight="700">area 空洞：= 0，没有函数体</text>

    <path d="M250 122 V156" stroke="#00599c" stroke-width="2"/><polygon points="250,156 244,146 256,146" fill="#00599c"/>
    <path d="M390 122 V156" stroke="#00599c" stroke-width="2"/><polygon points="390,156 384,146 396,146" fill="#00599c"/>
    <text x="264" y="146" fill="#00599c">继承</text>

    <rect x="112" y="158" width="200" height="66" rx="8" fill="#eaf3fb" stroke="#00599c" stroke-width="2"/>
    <text x="212" y="178" text-anchor="middle" font-weight="700" fill="#0b4f86">Circle</text>
    <text x="212" y="198" text-anchor="middle">area 填了：pi×r×r</text>
    <text x="212" y="216" text-anchor="middle" fill="#0b4f86">造得出对象</text>

    <rect x="330" y="158" width="200" height="66" rx="8" fill="#eaf3fb" stroke="#00599c" stroke-width="2"/>
    <text x="430" y="178" text-anchor="middle" font-weight="700" fill="#0b4f86">Rectangle</text>
    <text x="430" y="198" text-anchor="middle">area 填了：w×h</text>
    <text x="430" y="216" text-anchor="middle" fill="#0b4f86">造得出对象</text>

    <rect x="20" y="158" width="76" height="66" rx="8" fill="#f6f7f9" stroke="#c0c6cf" stroke-width="1.5" stroke-dasharray="4 3"/>
    <text x="58" y="184" text-anchor="middle" fill="#7a8595">Shape s;</text>
    <text x="58" y="204" text-anchor="middle" fill="#b8500f" font-weight="700">编译拒绝</text>

    <text x="20" y="248" font-size="12" fill="#33465e">能用的姿势只有两种：Shape& 引用、Shape* 指针 —— 指着一个真实子类造出来的对象。</text>
    <text x="20" y="272" font-size="12" fill="#33465e">漏填 area 的子类同样是半成品，编译器照样不让它造对象，于是「每个形状都会算面积」由编译器担保。</text>
  </g>
</svg>` },
        { t: `p`, text: `再说 explicit，它管的是另一件容易出事的小事。你有一个只收一个 double 的构造 Circle(double r)，编译器会把它顺便当成一条**转换通道**：凡是「这里需要一个 Circle」的地方，你递一个数过去，它就自作主张地调用这个构造，把一个数就地捏成一个圆 —— Circle c = 5.0; 这样一行你一个字都没调用过构造，它照样编译通过。` },
        { t: `p`, text: `一行看不出事故。等出现 draw(3.0)、或者哪个函数参数顺序颠倒、返回类型写错，编译器依然一路放行，程序就把「一个数字」当「一个圆」画出来 —— 错得悄无声息。在构造前面加 **explicit**，就是把这条暗道焊死：想让一个数变成圆，必须自己写清楚 Circle(5.0)，一步不能省。规矩可以记成一句：**单参数构造默认加 explicit**，除非你真的希望它当转换用。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `这两个关键字看着不相关，其实守的是同一道门：**别让不合格的东西蒙混过关。** 抽象类管的是「有没有实现」—— 你把 area 写成 = 0，等于立了一份合约，凡签这条约的子类必须自己交货，没交货的连对象都造不出来，所以你日后拿到一个 Shape& 时可以放心调用，不必担心底下是空的。explicit 管的是「怎么来的」—— 它拒绝的不是构造本身，而是**由编译器代笔的那次隐式构造**，坚持要求创建对象这个动作由你亲笔签名。` },
        { t: `p`, text: `所以选型很清楚：一族东西只是「做法不同」、接口完全一致，就把父类做成抽象类 —— 你本来就不打算造一个「笼统的形状」；父类要能独立当成品用，才给它写普通实现。任何只吃一个参数的构造先写上 explicit，真需要拿它当转换用时再摘，摘的时候要能说出为什么。` },
        { t: `h2`, text: `演示 1 · 一个圆和它的爹` },
        { t: `code`, lang: `c++`, code: `class Shape {
public:
    virtual ~Shape() = default;
    virtual double area() const = 0;      // 纯虚：自己不写，孩子必须写
};

class Circle : public Shape {
public:
    explicit Circle(double r) : r_(r) {}  // explicit：不许 5.0 悄悄变成一个圆
    double area() const override { return 3.14159265 * r_ * r_; }
private:
    double r_;
}` },
        { t: `p`, text: `先注意虚析构函数那行。抽象类一定会有人拿 Shape&、Shape* 去指着子类对象，将来删掉的时候走的是爹的析构，爹的析构必须是 virtual，否则子类的东西清不干净 —— 这是第 116 课就埋下的老规矩。析构自己没什么要打扫的，就写 = default 交给编译器。` },
        { t: `code`, lang: `c++`, code: `#include <print>

int main() {
    Circle c(5.0);                // 老老实实显式地造
    Shape& s = c;                 // 爹的引用，指着儿子的对象
    std::println("面积 = {:.2f}", s.area());
    return 0;
}` },
        { t: `p`, text: `跑出来是 面积 = 78.54。s 这一行的关键在于：s 是 Shape&，Shape 的 area 是个空洞，编译期根本不知道要执行哪段代码；真正跑起来时才按 c 的真实类型找到 Circle::area。这就是多态在抽象类上最常见的用法。` },
        { t: `h2`, text: `演示 2 · 补一个 Rectangle` },
        { t: `code`, lang: `c++`, code: `class Rectangle : public Shape {
public:
    Rectangle(double w, double h) : w_(w), h_(h) {}
    double area() const override { return w_ * h_; }
private:
    double w_, h_;
};` },
        { t: `code`, lang: `c++`, code: `#include <print>

int main() {
    Rectangle r(3.0, 4.0);
    Shape* p = &r;                       // 指针姿势，和引用一样好用
    std::println("长方形 = {:.2f}", p->area());
    return 0;
}` },
        { t: `p`, text: `跑出来 长方形 = 12.00，跟演示 1 那句 Shape& 是同一条机制，只是换了指针姿势。这个类里我故意**没**加 explicit：它是两个参数，本来就不在隐式转换的范围里 —— Rectangle r = 3.0; 从来都编译不过。explicit 只拦得住「一个参数」那种构造，这也把它的适用面钉清楚了。` },
        { t: `h2`, text: `演示 3 · 一批形状，各算各的` },
        { t: `code`, lang: `c++`, code: `#include <print>

int main() {
    Circle c1(2.0), c2(3.0);
    Rectangle r1(2.0, 5.0);
    Shape* box[] = { &c1, &r1, &c2 };    // 同一类爹指针，底下装着不同的儿子
    double total = 0.0;
    for (Shape* p : box) {
        std::println("{:.2f}", p->area());
        total += p->area();
    }
    std::println("总面积 = {:.2f}", total);
    return 0;
}` },
        { t: `p`, text: `12.57、10.00、28.27、总面积 50.84。三行输出走的是同一个 p->area()，各自却算了不同的公式 —— 这个圈里没有一个字提到 Circle 或 Rectangle。以后要加三角形，只多写一个类，圈一行都不用动，这是抽象类换来的最大一块好处。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `Shape s; 直接造抽象类的对象，报错长得像「不允许使用抽象类类型」。根因就是本课第一条：它有洞没填。改成用引用或指针，指着某个子类对象。`,
          `子类漏写 area 的 override，于是子类自己也是个半成品，报的却是同一句「抽象类不能造对象」，很多人以为错在父类。看清报错里点名的类名，少填的那一格多半在子类。签名也要对得上：const 漏了、参数少写一个，都不算填洞，爹的空洞还留着。`,
          `把 = 0 当成「返回 0」，写成 virtual double area() const { return 0; } 后面还跟分号，或者以为纯虚函数也能有函数体。记住 = 0 是记号，不是值，后面直接跟分号。`,
          `删掉 explicit 之后 Circle c = 3.0; 真编译过了，就以为这是两种等价写法。它等价于编译器替你调了一次构造，代价是所有「本来不该当圆用的数」都能混进圆的岗位。`,
          `爹的析构忘写 virtual：通过 Shape* 删对象时只跑爹的析构，儿子那份打扫没执行，内存漏了还不报错。抽象类的析构要么 virtual，要么干脆别让用户拿到指针删。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `写 Rectangle(w, h) 继承 Shape 并实现 area()。`,
          `删掉 explicit，试试 Circle c = 3.0; 看它是否居然能编译；再把 explicit 加回去，确认同样的写法报错，报错信息自己读一遍。`,
          `延伸一：再加一个 Triangle，底和高两个参数，area 返回二者乘积的一半，把它塞进演示 3 的 box 里，总面积跟着变。`,
          `延伸二：故意把 Triangle 的 const 漏掉再编译，看报错怎么说，体会「签名不一致等于没填洞」。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：= 0 是爹留的空洞，含空洞的类只能当爹不能直接造对象，于是「每个孩子都会算面积」由编译器担保；explicit 焊死「一个数偷偷变成一个对象」这条暗道，单参数构造默认加上它。` }
      ]
    },
    {
      id: `m118`, title: `第 118 课 · 特殊五件套：能让编译器代劳的五件事，就别自己手写`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：认清每个类天生带着的五件特殊函数 —— 析构、拷贝构造、拷贝赋值、移动构造、移动赋值，各自什么时候被悄悄调用；记住结论：成员都能自己管自己时，五件全写 = default。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 113 课你学了构造，第 112 课学了类的骨架。但一个类的生命周期里发生的远不止「出生」这一件事：它会被复制一份，会被整个覆盖掉，会被搬走内容，最后还要离场打扫。C++ 把这五个关口各留了一个函数位，统称**特殊成员函数**，一共五件：` },
        { t: `code`, lang: `text`, code: `析构函数        对象离开作用域、被删掉时自动调用 —— 负责「还」
拷贝构造        拿另一个同类型的对象造一个新的：Notebook b = a;
拷贝赋值        把右边整个盖到左边一个已经存在的对象上：b = a;
移动构造        同样是造新的，但右边是个不要了的对象，东西直接搬过来
移动赋值        把不要了的那份搬进一个已经存在的对象` },
        { t: `p`, text: `关键在这一句：**这五件你一件都不写，编译器也会替你把五个都生成出来**，然后在上面那五个关口自动调用它们。后两件涉及「搬」而不是「抄」，门道多，以后再细讲；本课先把「抄」和「打扫」这两件交出去。` },
        { t: `p`, text: `那要手写吗？现代 C++ 的答案是**能省则省**。你写 Notebook，成员是一个 string 和一个 vector —— string 自己管自己的字，vector 自己管自己的格子，它们各自的五件套早就有人写好了，而且写得很对。编译器生成的默认版本干的事其实非常聪明：**把成员一个个叫出来，让每个成员自己抄自己一份。** 三个成员都抄对了，整个对象自然就抄对了。这种时候手写一大坨，抄出来的还是同一套动作，只是多了三个可能写错的地方。所以规矩是：**成员全是「自己会打扫」的类型时，五件全部 = default。**` },
        { t: `svg`, caption: `对象的一生：出生走构造，复制走拷贝构造，覆盖走拷贝赋值，离开作用域一定走析构。五件特殊函数不是给你摆着看的，是这五个时刻自动被按下的按钮`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250">
  <text x="20" y="22" font-size="13" font-weight="700" fill="#142639">一个 Notebook 的一生，以及五个自动按下的按钮</text>
  <g font-size="12" fill="#26405a">
    <path d="M28 100 H600" stroke="#8b98ab" stroke-width="2"/>
    <polygon points="604,100 592,94 592,106" fill="#8b98ab"/>
    <circle cx="70" cy="100" r="7" fill="#00599c"/>
    <circle cx="212" cy="100" r="7" fill="#00599c"/>
    <circle cx="352" cy="100" r="7" fill="#b8500f"/>
    <circle cx="470" cy="100" r="7" fill="#0b7a5b"/>
    <circle cx="576" cy="100" r="7" fill="#142639"/>
    <text x="70" y="80" text-anchor="middle" font-weight="700">出生</text>
    <text x="70" y="124" text-anchor="middle">Notebook a;</text>
    <text x="212" y="80" text-anchor="middle" font-weight="700">复制</text>
    <text x="212" y="124" text-anchor="middle">Notebook b = a;</text>
    <text x="352" y="80" text-anchor="middle" font-weight="700">覆盖</text>
    <text x="352" y="124" text-anchor="middle">b = a;</text>
    <text x="470" y="80" text-anchor="middle" font-weight="700">搬走</text>
    <text x="470" y="124" text-anchor="middle">右边那份不要了</text>
    <text x="576" y="80" text-anchor="middle" font-weight="700">离场</text>
    <text x="576" y="124" text-anchor="middle">出作用域</text>
    <rect x="40" y="150" width="150" height="30" rx="6" fill="#eaf3fb" stroke="#00599c" stroke-width="1.5"/>
    <text x="115" y="169" text-anchor="middle">构造 + 编译器生成的拷贝</text>
    <rect x="270" y="150" width="160" height="30" rx="6" fill="#fdece1" stroke="#b8500f" stroke-width="1.5"/>
    <text x="350" y="169" text-anchor="middle">拷贝赋值：先还清旧的</text>
    <rect x="470" y="150" width="150" height="30" rx="6" fill="#e7f5ef" stroke="#0b7a5b" stroke-width="1.5"/>
    <text x="545" y="169" text-anchor="middle">析构：一定执行</text>
    <text x="20" y="212" font-size="12" fill="#33465e">五件全不写也照样跑得对 —— 因为编译器生成的默认版本是「挨个叫成员自己抄一份」。</text>
    <text x="20" y="234" font-size="12" fill="#33465e">只有成员里有你亲手借来的东西时，默认那份才会不够用，那时才轮到自己写。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `老教材动辄让你手写五件，是因为那个年代类的成员常常是**自己不会打扫**的东西：一个裸指针指着 new 来的数组、一个文件句柄。默认拷贝对这种成员只做一件事 —— **照抄地址**。于是两个对象守同一块内存：一边改，另一边跟着变；两边各自还一次，同一块地被还了两回；一方先离场，另一方手里剩个空壳。这叫**浅拷贝**，是当年手写拷贝构造的唯一理由：你得亲自再借一块地、把内容搬过去。` },
        { t: `p`, text: `现在的成员换成了 string、vector、智能指针这些「自己知道自己欠了多少、离开时自己还」的类型，浅拷贝的坑被它们从内部填平了：默认拷贝调的是它们各自的拷贝，那已经是深拷贝。所以「五件全 default」不是偷懒，而是**把已经正确的事交给已经写对的代码**。` },
        { t: `p`, text: `还有一条连带的规矩要记住：**这五件是一套，不是五件独立的开关。** 一旦你亲手写了析构、或者自己实现了拷贝，编译器就认为你对这个类的搬运有讲究，它**不再自动给你移动那两件**，你多半得跟着一起写。这就是老话「Rule of Five」的分量 —— 要动就五件一起过一遍，别只改一件。` },
        { t: `h2`, text: `演示 1 · 五件全交给编译器` },
        { t: `code`, lang: `c++`, code: `class Notebook {                         // 成员全是「自己会打扫」的类型
public:
    Notebook() = default;                // 五件全部交给编译器
    ~Notebook() = default;
    Notebook(const Notebook&) = default;
    Notebook& operator=(const Notebook&) = default;

    void add(const std::string& s) { pages_.push_back(s); }
    int pages() const { return static_cast<int>(pages_.size()); }
private:
    std::string owner_ = "我";
    std::vector<std::string> pages_;
};` },
        { t: `p`, text: `一句实现都没有，全是 = default。这里的 default 读作「编译器你按最标准的那份给我生成」，它跟空函数体不是一回事：空体是你亲自写了一份什么都不干的实现，default 是把官方的那份正确的搬过来。` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <vector>

int main() {
    Notebook a;
    a.add("C++");
    Notebook b = a;                       // 编译器生成的拷贝：每个成员各抄各的
    b.add("数学");
    std::println("a 有 {} 页，b 有 {} 页", a.pages(), b.pages());
    return 0;
}` },
        { t: `p`, text: `本机跑出来是 **a 有 1 页，b 有 2 页** —— b 后来加的那页没有串到 a 身上，两个 vector 各是各的。这就是「默认版本是对的」最直观的证据，一行手写代码都没写。` },
        { t: `h2`, text: `演示 2 · 让析构自己说话` },
        { t: `code`, lang: `c++`, code: `class Notebook {
public:
    Notebook() = default;
    Notebook(const Notebook&) = default;
    ~Notebook() { std::println("打扫卫生：{} 的 {} 页", owner_, pages_.size()); }
    void add(const std::string& s) { pages_.push_back(s); }
private:
    std::string owner_ = "我";
    std::vector<std::string> pages_;
};` },
        { t: `code`, lang: `c++`, code: `#include <print>            // 头文件同演示 1，这里只留一个提示

int main() {
    Notebook a;
    a.add("C++");
    {
        Notebook b = a;
        b.add("数学");
        std::println("—— 内层作用域要结束了 ——");
    }
    std::println("—— 外层 main 要结束了 ——");
    return 0;
}` },
        { t: `p`, text: `实测输出四行，顺序是：内层那行提示、打扫卫生 2 页、外层那行提示、打扫卫生 1 页。**b 比 a 先析构**。析构的顺序跟构造正好相反 —— 后出生的先离场，像叠盘子，最后放上去的那个最先被拿下来。而且 b 是被那对大括号关出去的：作用域一结束，它的析构当场执行，不需要任何人记得去叫它。` },
        { t: `h2`, text: `演示 3 · 成员是裸指针时，默认拷贝会照抄地址` },
        { t: `code`, lang: `c++`, code: `class BadNote {                          // 反例：成员是自己借来的裸指针
public:
    explicit BadNote(int n) : cells_(new int[n]), n_(n) {}
    bool shares_with(const BadNote& o) const { return cells_ == o.cells_; }
private:
    int* cells_ = nullptr;
    int n_ = 0;
};` },
        { t: `code`, lang: `c++`, code: `#include <print>

int main() {
    BadNote x(3);
    BadNote y = x;                        // 默认拷贝：地址被原样抄走
    std::println("y 和 x 守的是同一块内存吗：{}", y.shares_with(x));
    return 0;
}` },
        { t: `p`, text: `跑出来 **y 和 x 守的是同一块内存吗：true**。这个类里两个对象共用一格地，将来各自还一次就是同一块地还被还了两次；这个坑不怪编译器，怪我们选了「自己管」的成员却不亲自写怎么管。两条出路：把 cells_ 换成会自己打扫的类型，让 default 重新变成对的；要么就把五件一起补全 —— 后者以后再讲。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `写了 ~Notebook() 空体，就以为成员不用打扫了。成员该析构照样析构，这里没漏；真正会漏的是把「我写了个空的」当成「这个类不需要还东西」。`
          ,`只要动手写了析构或拷贝，就默认编译器还在给你移动那两件 —— 结果对象悄悄退化成「只能抄不能搬」，白白多搬一遍数据。要么五件全 default，要么五件一起想清楚。`
          ,`给多态的爹写析构时忘了 virtual。第 117 课那条硬规矩在这儿照样成立：通过 Shape* 删掉一个 Circle，爹的析构不是虚的话就只跑爹那一份，儿子打扫没执行。`
          ,`拷贝赋值少写返回类型或少返 *this，链式写法 b = c = a 当场编译不过；返回类型必须是 Notebook&。`
          ,`把 = default 和 = delete 搞混。default 是「把官方正确版本给我」，delete 是「这条路彻底封死，谁调用谁报错」，两者都是写在声明末尾，意思相反。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把 ~Notebook() = default; 改成打印一句「打扫卫生」，观察 a、b 谁先析构，把输出的顺序抄下来跟自己对一遍。`,
          `延伸一：在打印那句里再加上 pages_.size()，确认两个对象各自报的页数不同，证明拷贝是真的各抄了一份。`,
          `延伸二：把演示 2 里那对大括号去掉，让 a、b 在同一个作用域里出生，再看两行「打扫卫生」的顺序和内容变成什么。`,
          `延伸三：给 Notebook 补一行 Notebook& operator=(const Notebook&) = default; 之后写一次 b = a; 覆盖，体会拷贝构造和拷贝赋值触发的时机差别。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：五件特殊函数对应出生、复制、覆盖、搬走、离场五个关口，成员都能自己管自己时全写 = default；只有亲手借了东西 —— 裸指针、句柄 —— 才需要自己写，而且一写就是五件一起想。` }
      ]
    },
    {
      id: `m119`, title: `第 119 课 · RAII 是什么：把「借」写进出生，把「还」写进死亡`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把「借了要还」这件靠记性的事换成靠语言机制 —— 借写进构造函数，还写进析构函数，而析构是编译器担保一定执行的。跑一遍就看清两条规矩：离开作用域那一刻立刻还、后借的先还。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 76 课你学过 new 和 delete：借一块地要自己说一声，还一块地也要自己说一声。麻烦在于这两声之间隔着的可能是几十行代码、好几个 return、一层又一层的圈。只要有一条路没走到那声 delete，这块地就永远还不回去 —— 程序不崩，只是每跑一次胖一点，跑几万行日志之后被自己撑死。这种 bug 最阴：它连个错都不报。` },
        { t: `p`, text: `靠记性的规矩迟早会漏，因为出口不止一条。而第 118 课演示 2 已经实测过一条铁律：**对象离开作用域的那一刻，它的析构函数当场执行，不需要任何人记得去叫它。** 这是一个免费的、不会失败的执行点。RAII 要做的只有一件事 —— 把「还」这个动作放进那个执行点里。` },
        { t: `p`, text: `全名 Resource Acquisition Is Initialization，资源获取即初始化，读法只有一句：**借资源这个动作，跟在造对象后面一起做掉。** 构造里借，析构里还，资源的使用寿命就被绑死在对象的使用寿命上。超市储物柜正是这个形状：投币自动开柜（构造），拔钥匙自动锁柜（析构）—— 你根本没有「忘记」这个选项。` },
        { t: `code`, lang: `text`, code: `靠记性 —— 谁都得记住                    靠对象 —— 编译器替你记住

  借 Locker 的柜子                        {   Locker x;        ← 构造 = 借
  干活……                                   干活……
  if (累了) return;     ← 这条出口漏还！    if (累了) return;  ← 照样出作用域
  干活……                                   干活……
  还 Locker 的柜子                       }   ← 析构 = 还，跑不掉` },
        { t: `p`, text: `三句话要说死在嘴里：**借在构造，还在析构，析构一定跑**。中间那句是这门课后面一大段的承重墙 —— 第 78 课见过的智能指针、以后要碰的锁和句柄，全都靠它才成立。` },
        { t: `svg`, caption: `两层作用域里站着三个 Locker：借的顺序是 x、y、z，还的顺序反过来是 z、y、x。出口有几条并不重要 —— 大括号一合上，编译器插进去的那一次析构调用一定执行`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320">
  <text x="20" y="22" font-size="13" font-weight="700" fill="#142639">借与还绑在对象的一生上：作用域就是账本</text>
  <g font-size="12" fill="#26405a">
    <rect x="20" y="40" width="290" height="204" rx="8" fill="#eef2f7" stroke="#8b98ab" stroke-width="2"/>
    <text x="34" y="60" font-weight="700" fill="#142639">外层：main 这一格</text>
    <rect x="36" y="70" width="130" height="26" rx="5" fill="#eaf3fb" stroke="#00599c" stroke-width="1.5"/>
    <text x="101" y="87" text-anchor="middle">x 借</text>
    <rect x="58" y="112" width="236" height="120" rx="8" fill="#f6f7f9" stroke="#b8500f" stroke-width="1.5" stroke-dasharray="6 4"/>
    <text x="72" y="130" font-weight="700" fill="#b8500f">内层：一对大括号</text>
    <rect x="72" y="140" width="104" height="26" rx="5" fill="#eaf3fb" stroke="#00599c" stroke-width="1.5"/>
    <text x="124" y="157" text-anchor="middle">y 借</text>
    <rect x="184" y="140" width="100" height="26" rx="5" fill="#eaf3fb" stroke="#00599c" stroke-width="1.5"/>
    <text x="234" y="157" text-anchor="middle">z 借</text>
    <text x="72" y="188" fill="#7a8595">内层一合上……</text>
    <rect x="184" y="196" width="100" height="26" rx="5" fill="#e7f5ef" stroke="#0b7a5b" stroke-width="1.5"/>
    <text x="234" y="213" text-anchor="middle">z 先还</text>
    <rect x="72" y="196" width="104" height="26" rx="5" fill="#e7f5ef" stroke="#0b7a5b" stroke-width="1.5"/>
    <text x="124" y="213" text-anchor="middle">y 后还</text>

    <path d="M310 84 H330" stroke="#8b98ab" stroke-width="1.5"/><polygon points="330,84 320,79 320,89" fill="#8b98ab"/>

    <text x="344" y="56" font-weight="700" fill="#142639">本机实测顺序</text>
    <text x="344" y="80" fill="#0b4f86">1  x：投币，柜门开了</text>
    <text x="344" y="102" fill="#0b4f86">2  y：投币，柜门开了</text>
    <text x="344" y="124" fill="#0b4f86">3  z：投币，柜门开了</text>
    <text x="344" y="152" fill="#0b7a5b">4  z：拔钥匙，柜门锁了</text>
    <text x="344" y="174" fill="#0b7a5b">5  y：拔钥匙，柜门锁了</text>
    <text x="344" y="196" fill="#0b7a5b">6  x：拔钥匙，柜门锁了</text>
    <path d="M470 66 V206" stroke="#c0c6cf" stroke-width="1.5"/>
    <polygon points="470,206 465,196 475,196" fill="#c0c6cf"/>
    <text x="486" y="140" fill="#7a8595">时间往下走</text>

    <text x="20" y="268" font-size="12" fill="#33465e">外面站着几条出口不管 —— 早点 return、走到末尾、被更外层掀出去，离开这一格的动作只有一个。</text>
    <text x="20" y="292" font-size="12" fill="#33465e">还的顺序跟借的相反，像叠盘子：最后放上去的那个最先被拿下来。所以后借的资源可以放心用先借的。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `设计意图第一层：**把「什么时候还」从一道题变成一句不需要回答的话。** 栈上对象的作用域是写在源码里的，编译期就定死了 —— 大括号在哪儿合上，析构调用就插在哪儿。你不再维护「这份资源归谁管、由谁在哪条路径上还」这种账本，作用域本身就是账本。` },
        { t: `p`, text: `第二层：对象是这份资源的**唯一主人**，这叫所有权 —— 谁持有，谁负责还；对象一死，资源跟着回去。第 78 课那些智能指针，本质就是一群别人替你写好的 RAII 类：把 delete 塞进析构，仅此而已。上一课那个 BadNote 之所以是反例，就是它的成员「自己不会打扫」，而主人是谁又没说清 —— RAII 补的正是这一格。` },
        { t: `p`, text: `第三层：这条规矩连更突然的离场方式也一起兜住了。函数被中途掀出去的时候，栈上的局部对象照样析构（那一种机制以后再细讲）。靠记性的代码在这种时刻必漏，靠对象的代码不会 —— 这就是现代 C++ 那句推荐的份量：**能用 RAII 就别手写还。**` },
        { t: `p`, text: `边界也钉一句：借写在构造里，所以「借失败」得在构造里就地认下，析构里判空；一个 RAII 类最好只管一份资源，管两份就得说清哪份先还 —— 成员是按声明的反序析构的。` },
        { t: `h2`, text: `演示 1 · 储物柜：投币就开，拔钥匙就锁` },
        { t: `code`, lang: `c++`, code: `class Locker {                          // 一份柜子 = 一个对象
public:
    explicit Locker(std::string who) : who_(std::move(who)) {
        std::println("{}：投币，柜门开了（构造=借资源）", who_);
    }
    ~Locker() {
        std::println("{}：拔钥匙，柜门锁了（析构=还资源）", who_);
    }
    Locker(const Locker&) = delete;      // 柜主只有一个，不许抄 —— 下一课细说
private:
    std::string who_;                    // 名字只是给日志看的，它自己会打扫
};` },
        { t: `p`, text: `两句话是全部：构造把「投币开柜」写死在出生这一刻，析构把「拔钥匙锁柜」写死在离场这一刻。这里唯一的资源就是「这个柜主身份」，而 who_ 是 string，第 118 课的结论正好成立 —— 成员不用我们操心，要操心的只有那份借来的柜子。` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <utility>

int main() {
    Locker x("小明");                    // 出生 = 借
    std::println("  ……随便干什么，都不用操心还柜子……");
    return 0;
}                                        // ← main 结束，x 析构 = 还` },
        { t: `p`, text: `本机 g++ 实测三行，顺序是：小明：投币，柜门开了 → 那行「随便干什么」 → 小明：拔钥匙，柜门锁了。第三行不是谁写的 —— 这个程序里没有任何一行叫过析构，它是编译器在函数收尾处替你插的。` },
        { t: `h2`, text: `演示 2 · 加一层大括号，看清「还」的顺序` },
        { t: `code`, lang: `c++`, code: `#include <print>          // 头文件同演示 1

int main() {
    Locker x("外层");
    {
        Locker y("内层");                // 多一层大括号，就多一个主人
        Locker z("内层二号");
        std::println("  ……内层干活……");
    }                                    // ← 这一格合上：z 先还，y 后还
    std::println("  ……外层还在……");
    return 0;
}` },
        { t: `p`, text: `实测八行：三声「投币」连着来，中间插一行「内层干活」，然后两声「拔钥匙」倒着走 —— 先是内层二号，再是内层 —— 又一行「外层还在」，最后才是外层的「拔钥匙」。**还的顺序跟借的顺序严格相反**，这是第 118 课那条「构造与析构反着来」的第一次实战：它保证后借的资源一定能用到先借的。` },
        { t: `h2`, text: `演示 3 · 中途 return，到底漏不漏` },
        { t: `code`, lang: `c++`, code: `#include <print>          // 头文件同演示 1，Locker 也照用

void borrow(bool hurry) {
    Locker a("访客");                     // 进门就借
    std::println("  办事情……");
    if (hurry) return;                    // 提前溜走的那条出口
    std::println("  办完了……");
}                                         // ← 两条出口都从这里出去，析构守在这儿

int main() {
    borrow(true);                         // 第一次：中途 return
    borrow(false);                        // 第二次：走到底
    return 0;
}` },
        { t: `p`, text: `实测七行，其中「投币」两次、「拔钥匙」两次，一次都没少；差别只在第一次没打印「办完了……」。也就是说：走不走到底，还都发生。把 Locker 换成任何一份真实资源，这个结论一样成立 —— 你不再需要枚举出口，因为析构守的是**唯一的汇合点**，而不是每条岔路。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `用 new 造 RAII 对象，写成 new Locker(...)。对象自己又变成一份要还的东西，机制原地失效：该还的还是没人还，只是「欠」的名字从内存换成了对象。RAII 要的就是栈上那个自然到期的对象。`,
          `把守卫对象做成全局或静态，以为「程序结束」等于「出作用域」。全局那批的析构一直拖到 main 之后才跑，柜子开着开到最后一刻，锁占的时长远超你以为的。要短期就把它放进一对大括号里。`,
          `构造里借失败不认，析构里对着空东西还。判空要么写在析构里，要么在构造里当场把状态说明白 —— 下一课写文件句柄就会正面撞上这一条。`,
          `把守卫对象复制一份，两个对象都自认是主人，同一份还被还两遍。这正是第 118 课「五件是一套」的代价：RAII 类的默认拷贝多半是错的，得亲手处置，本课演示 1 那一行 = delete 就是干这个的。`,
          `以为析构「差不多是马上」执行。它的时刻精确到那一对大括号：return 之前那一行它不跑，圈外那一行它也不等你。调试时看日志顺序最容易在这儿想歪，先记住「合上格子那一刻」。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `在 main 里加一层 { }，在括号里再创建一个 Locker，观察「还」的顺序 —— 先把自己猜的顺序写下来，再跟本机输出对一遍。`,
          `延伸一：把演示 3 的 borrow 改成三条出口，再加一个 if 和一次 return，数一数「投币」和「拔钥匙」的次数是否还相等。`,
          `延伸二：把 Locker 换成裸指针版 —— 自己 new、自己 delete，然后在两条出口上各漏一次，观察你为了「不漏」要写几个 fclose 那样的收尾句。`,
          `延伸三：把这份形状套到别的资源上：写一个 CountGuard，构造让全局计数加一、析构减一，用它证明「不管怎么走，计数都会回到零」。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：借写在构造里，还写在析构里，而析构是编译器担保一定执行的那一句 —— 于是「记得还」从人的记性问题，变成语言的作用域问题。` }
      ]
    },
    {
      id: `m120`, title: `第 120 课 · 手写一个 RAII 类：把 fopen 和 fclose 缝进一对构造析构`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：亲手写一个 FileGuard —— 构造里 std::fopen，析构里 std::fclose，文件的寿命就等于对象的寿命。同时看懂三个设计决定：裸指针为什么藏进 private，构造为什么允许「借不到」，以及这个类为什么不能被人复制。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `C 语言那套打开文件的姿势你以后还会碰到：std::fopen 拿一个句柄，用完 std::fclose 还回去。规则只有一句话，事故全在中间 —— 从打开到关闭这段路上可能有早点 return，可能有「出事了直接走」，每多一条出口就多一次可能忘掉的 fclose。漏关的代价甚至不在当场：缓冲区里还没落盘的内容可能整块消失，文件只剩半截，而程序一声不响。` },
        { t: `p`, text: `上一课那个形状原样搬过来就行：**把借（fopen）写在构造里，把还（fclose）写在析构里。** 于是「什么时候关」重新变成不需要回答的问题 —— 对象到期那一刻文件一定关掉，管你从哪条出口离开。这一课的价值不在新机制，而在亲手缝一次：上一课的 Locker 是个玩具，这一份握着的是真句柄，也会暴露出玩具暴露不了的那几件事。` },
        { t: `code`, lang: `text`, code: `老的写法 —— 人管                          RAII —— 对象管

  std::FILE* f = std::fopen(p, "w");          {   FileGuard g(p);     ← 构造里 fopen
  if (出事了) return;      ← 忘关，没人知道       if (出事了) return; ← 照样出作用域
  std::fputs(s, f);                             g.write(s);
  ...                                          ...
  std::fclose(f);                            }   ← 析构里 fclose，谁都不用记` },
        { t: `p`, text: `盯准那份代码里的三处位置：句柄是个 **private 的裸指针成员**；构造用初始化列表把 std::fopen 的返回值直接收进来；析构**先判空再还**。这三处不是风格上的三个细节，而是三个设计决定，下面逐条说清楚。` },
        { t: `svg`, caption: `一个 FileGuard 的一生：构造借句柄，两条出口都汇到析构，fclose 在同一个地方被执行。实测里「自动关闭」出现在「已离开作用域」之前 —— 对象在它那格合上时就已经死了`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300">
  <text x="20" y="22" font-size="13" font-weight="700" fill="#142639">文件的生命周期 = 对象的生命周期</text>
  <g font-size="12" fill="#26405a">
    <rect x="20" y="42" width="230" height="126" rx="8" fill="#eef2f7" stroke="#8b98ab" stroke-width="2"/>
    <text x="34" y="60" font-weight="700" fill="#142639">FileGuard g 的这一格</text>
    <rect x="34" y="70" width="200" height="26" rx="5" fill="#eaf3fb" stroke="#00599c" stroke-width="1.5"/>
    <text x="134" y="87" text-anchor="middle">构造：fopen 拿到句柄</text>
    <rect x="34" y="102" width="200" height="26" rx="5" fill="#f6f7f9" stroke="#8b98ab" stroke-width="1.5"/>
    <text x="134" y="119" text-anchor="middle">g.write(...) 随便用</text>
    <rect x="34" y="134" width="200" height="26" rx="5" fill="#fdece1" stroke="#b8500f" stroke-width="1.5"/>
    <text x="134" y="151" text-anchor="middle" fill="#b8500f">f_ 是 private，外人碰不到</text>

    <rect x="292" y="56" width="150" height="34" rx="6" fill="#eaf3fb" stroke="#00599c" stroke-width="1.5"/>
    <text x="367" y="77" text-anchor="middle">出口一：走到格子末尾</text>
    <rect x="292" y="106" width="150" height="34" rx="6" fill="#eaf3fb" stroke="#00599c" stroke-width="1.5"/>
    <text x="367" y="127" text-anchor="middle">出口二：中途 return</text>
    <path d="M250 98 H288" stroke="#8b98ab" stroke-width="1.5"/><polygon points="288,98 278,93 278,103" fill="#8b98ab"/>
    <path d="M442 73 H474 V150" stroke="#0b7a5b" stroke-width="1.5" fill="none"/>
    <path d="M442 123 H474" stroke="#0b7a5b" stroke-width="1.5"/>
    <path d="M474 150 V162" stroke="#0b7a5b" stroke-width="1.5"/><polygon points="474,162 469,152 479,152" fill="#0b7a5b"/>
    <rect x="452" y="164" width="168" height="44" rx="6" fill="#e7f5ef" stroke="#0b7a5b" stroke-width="2"/>
    <text x="536" y="182" text-anchor="middle" font-weight="700" fill="#0b7a5b">析构：判空后 fclose</text>
    <text x="536" y="200" text-anchor="middle">两条出口都汇到这里</text>

    <text x="20" y="192" font-size="12" fill="#33465e">本机实测三行：</text>
    <text x="20" y="212" font-size="12" fill="#0b4f86">打开 /tmp/raii_demo.txt</text>
    <text x="20" y="232" font-size="12" fill="#0b4f86">自动关闭</text>
    <text x="20" y="252" font-size="12" fill="#0b4f86">已离开作用域</text>
    <text x="292" y="232" font-size="12" fill="#33465e">中途 return 那次：打开、提前走人的那条出口、自动关闭。</text>
    <text x="292" y="252" font-size="12" fill="#33465e">「已离开作用域」压根没跑到 —— 关闭照样发生。</text>
    <text x="20" y="280" font-size="12" fill="#b8500f">还完把 f_ 置成空指针：同一份句柄不会被还第二遍。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `第一，**裸指针不外漏。** f_ 藏在 private 里，外面能拿到的只有 write 这样一个一个的动作。原因很实际：只要有人能从外面调 fclose，或者把 f_ 抄走一份，析构那句判空就不再由这个类保证了 —— 同一份句柄有两个主人，必然有一个还早。把句柄藏起来、只开放「用它」的接口，是这类对象唯一守得住的自保姿势。` },
        { t: `p`, text: `第二，**构造要么借到，要么就地认输。** std::fopen 失败时回一个空指针，这个类把它原样存着，析构判空 —— 于是「压根没借到」和「借到也已经还了」走同一条打扫路径，不会有人对着空句柄动手。更讲究的做法是让构造当场把失败喊出去，那要等你以后学到错误处理那一族工具；本课先把空值这条最朴素的路走稳。` },
        { t: `p`, text: `第三，**这个类不该被复制。** 默认拷贝干的正是第 118 课演示 3 里 BadNote 那件事：把地址原样抄走，两个对象守一个句柄，各自 fclose 一次。到这一步，「五件是一套」这句老话第一次真的派上用场 —— 把拷贝构造和拷贝赋值写成 **= delete**，路直接封死。第 118 课【常见坑】点过这两个名字：default 是「把官方版本给我」，delete 是「这条路谁走谁报错」，此处正是 delete 的用场。` },
        { t: `h2`, text: `演示 1 · 把 fopen 和 fclose 缝起来` },
        { t: `code`, lang: `c++`, code: `class FileGuard {
public:
    explicit FileGuard(const char* path) : f_(std::fopen(path, "w")) {
        std::println("打开 {}", path);          // 构造 = 借资源
    }
    ~FileGuard() {
        if (f_) std::fclose(f_);                // 无论从哪离开，这句必被执行
        std::println("自动关闭");
    }
    void write(const char* s) { if (f_) std::fputs(s, f_); }
private:
    std::FILE* f_ = nullptr;                    // 裸指针藏在类里，外人碰不到
};` },
        { t: `p`, text: `跟上一课的 Locker 比，只多了一样东西：**析构里那个判空**。玩具柜永远投得到币，真句柄会拿不到。std::FILE 是 C 那套 stdio 的类型，请的头文件是 stdio 那个；输出照旧走 std::println，只有读文件写文件这两句非用 stdio 不可。` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <cstdio>

int main() {
    {
        FileGuard f("/tmp/raii_demo.txt");      // 借：构造时打开
        f.write("hello raii\\n");
    }                                           // ← 出大括号，析构自动关
    std::println("已离开作用域");
    std::remove("/tmp/raii_demo.txt");          // 演示完把临时文件删掉
    return 0;
}` },
        { t: `p`, text: `本机 g++ 实测三行：打开 /tmp/raii_demo.txt、自动关闭、已离开作用域。关键是**关闭排在「已离开作用域」之前** —— 对象是在那对大括号合上那一刻死的，不是等函数返回。这条时间差以后调日志顺序时会救你一命。` },
        { t: `h2`, text: `演示 2 · 中途 return，还关不关（本课任务）` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <cstdio>

int main() {
    {
        FileGuard f("/tmp/raii_demo.txt");
        f.write("hello raii\\n");
        std::println("提前走人的那条出口");
        return 0;                               // ← 直接跳出整个 main
    }
    std::println("已离开作用域");                // 这一行再也轮不到
    std::remove("/tmp/raii_demo.txt");
    return 0;
}` },
        { t: `p`, text: `实测三行：打开 /tmp/raii_demo.txt、提前走人的那条出口、自动关闭；那句「已离开作用域」压根没打印，**可文件还是关了**。老的写法在这条出口上就是要漏一次，因为它把「还」放在路径上；这里把「还」放在对象身上，而离开这条路径必然经过析构。磁盘上那份内容也完整 —— fclose 负责把缓冲区冲下去。` },
        { t: `h2`, text: `演示 3 · 封死拷贝，顺便看看打不开` },
        { t: `code`, lang: `c++`, code: `class FileGuard {                            // 补上两件「不许」的完整版
public:
    explicit FileGuard(const char* path) : f_(std::fopen(path, "w")) {
        std::println("打开：{}  成功吗：{}", path, f_ != nullptr);
    }
    ~FileGuard() { if (f_) { std::fclose(f_); f_ = nullptr; } std::println("析构打扫完毕"); }
    FileGuard(const FileGuard&) = delete;    // 抄一份 = 两个主人守一个句柄
    FileGuard& operator=(const FileGuard&) = delete;   // 覆盖同理，路封死
    void write(const char* s) { if (f_) std::fputs(s, f_); }
private:
    std::FILE* f_ = nullptr;
};` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <cstdio>

int main() {
    FileGuard a("/tmp/raii_demo.txt");
    FileGuard b("/no/such/dir/x.txt");       // 打不开：f_ 就是个空指针
    a.write("hello raii\\n");
    b.write("这行不会落地\\n");
    std::println("—— 这一格马上合上 ——");
    return 0;
}                                            // ← b 先析构，a 后析构，都不出错` },
        { t: `p`, text: `实测五行：两行「打开：… 成功吗：true / false」，一行提示，两行「析构打扫完毕」。压根没打开的那个照样干净地走完析构，fclose 一次都没被叫。顺带一个教训：两行打扫日志长得一模一样，从输出上分不出谁是谁 —— 打扫那句最好把资源名字一起打出来。而在这个版本上写 FileGuard c = a; 会被当场拒绝，报错是 use of deleted function，指着你那行 delete。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `只写析构、忘了拷贝那两件。复制一个守卫就得到两个主人，fclose 跑两遍，报应常常不在当场：程序跑到收尾才崩，或者报一句跟文件八竿子打不着的错。判据很简单 —— 析构里有「还」这个动作，就必须回答「这个类能复制吗」。`,
          `把句柄做成 public，或者顺手写个 get 把 std::FILE 交出去。外面一 fclose，析构又 fclose 一次。还完置空能挡掉一半，但根治的办法是别把主人交出去：只开放动作，不开放句柄。`,
          `在析构里做大动作。析构守着整条打扫流程的最后一环，它自己再出事，排在它前面的那些对象就清不成了 —— 判空、安静地还、不抱怨，是析构的美德；要报告失败就放进显式的接口里。`,
          `以为「对象出作用域」和「代码跑到下一行」是一回事。守卫要是被塞进容器、被复制或者被搬走，它死的那一格就不在你盯的这对大括号里。想让 RAII 类少出事，就别给它留复制的余地 —— 「搬」那一族以后再讲。`,
          `std::fopen 的返回值直接当成功用：write 不判空就 std::fputs，空句柄一喂就崩。判空要写进每一个用到资源的接口，本课的 write 就是这么防的 —— 只在析构里判、别处不判，等于只防了一半。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `在 f.write(...) 之后加一句 return 0; 重新编译：文件还会被关吗？先把你猜的输出写下来，再跟本机跑出来的三行对一遍。`,
          `延伸一：给这个类加上演示 3 那两行 = delete，再写一次 FileGuard c = a; 看报错长什么样；然后把两行删掉，确认报错消失、而重复关闭的隐患回来了。`,
          `延伸二：把路径换成一个根本不存在的位置，看看「打不开」这条路上析构有没有跑、fclose 有没有被叫，把「成功吗」那一行的值抄下来。`,
          `延伸三：加一个 bool is_open() const，只回答开没开，不许外面拿到 f_；再把析构那句打印带上文件名，解决演示 3 末尾那个「分不清谁是谁」。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：构造里 std::fopen、析构里 std::fclose，文件的寿命就等于对象的寿命；裸指针藏进 private、拷贝用 = delete 封死、还完置空 —— 这四件事凑齐，才叫一个真的 RAII 类。` }
      ]
    }
  ]
};
