/* 喵站 · C++ 掌握 正文分部 p02：第 83–85 课（第九轮，主控亲写，定掌握课的写法标准）
 *
 * 源稿：83_struct把相关数据打包.cpp、84_自定义打印教println认识struct.cpp、85_struct排序多关键字定名次.cpp
 * 这三课是「掌握」课里第一次把数据捏成形状 —— 后面 100 多课的类、容器、算法都站在这个地基上，
 * 所以写得更慢一点：每课都讲清「为什么要有这个东西」，不满足于「语法长这样」。
 */
window.MIAO_CPPM_P02 = {
  chapters: [
    {
      id: `m83`, title: `第 83 课 · struct：把相关的几样东西装进一张名片`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会定义 struct、按顺序填成员、用点号取出来，并给名片配一个自带技能（成员函数）。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课我们用算法三件套加工了一列数。但从这一课起要解决另一个问题：**一个东西往往有好几个属性，怎么办？**` },
        { t: `p`, text: `最土的办法是摆一排散变量：ids 装学号、names 装姓名、scores 装分数。三个 vector 各管各的，看着挺整齐，其实埋了雷 —— 三个盒子必须永远一样长，插一个就得同时插三个，删一个也得同时删三个；只要有一处忘了同步，第 2 个名字配的就不是第 2 个分数，而**程序不会报错**，它只是安静地给出错的答案。这类「数据错位」的 bug 比崩溃更难查，因为崩溃至少会喊。` },
        { t: `p`, text: `C++ 的解法很直白：**本来属于同一个东西的几样数据，就别拆开装。** 自己定一个新类型，把学号、姓名、分数订在一起，这就是 struct。定完之后，「一个学生」就是一个可以整体传来传去的单位，而**类型系统开始替你负责**：你没法只搬走一半学生。` },
        { t: `code`, lang: `text`, code: `struct Student {        ← 起名字，左花括号前不许空着
    int id;             ← 成员：这张名片上的一栏
    std::string name;
    double score;
};                      ← 注意结尾这个分号，它是语法的一部分` },
        { t: `p`, text: `三行形状像变量声明，含义却不同：变量声明是「造一个盒子」，struct 里这三行是「**画一张空白的名片版式**」，一个学生都还没造出来。造出来靠 main 里那句初始化。` },
        { t: `svg`, caption: `左边是三个盒子按位置强行配对（有一格已经错位），右边是一张名片（数据订在一起，走哪儿都在一起）`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 230">
  <text x="20" y="24" font-size="13" font-weight="700" fill="#b8500f">散着放：靠下标强行配对</text>
  <text x="360" y="24" font-size="13" font-weight="700" fill="#00599c">装成名片：整体传递</text>
  <g font-size="12" fill="#26405a">
    <rect x="20" y="40" width="120" height="26" rx="5" fill="#fdece1" stroke="#b8500f" stroke-width="1.5"/><text x="30" y="57">ids = 1001, 1002</text>
    <rect x="20" y="72" width="120" height="26" rx="5" fill="#fdece1" stroke="#b8500f" stroke-width="1.5"/><text x="30" y="89">names = 小明, 小红</text>
    <rect x="20" y="104" width="120" height="26" rx="5" fill="#fdece1" stroke="#b8500f" stroke-width="1.5"/><text x="30" y="121">scores = 88.5</text>
    <text x="30" y="150" fill="#b8500f" font-weight="700">scores 只有 1 个 —— 长度不等，下标 1 一取就越界</text>
    <rect x="360" y="40" width="180" height="88" rx="10" fill="#eaf3fb" stroke="#00599c" stroke-width="2"/>
    <text x="372" y="60" font-weight="700">Student</text>
    <text x="372" y="80">id    = 1001</text>
    <text x="372" y="98">name  = 小明</text>
    <text x="372" y="116">score = 88.5</text>
    <text x="360" y="152" fill="#00599c" font-weight="700">一个变量 = 一个学生，学号与姓名不可能被拆散</text>
    <path d="M300 84 H344" stroke="#8b98ab" stroke-width="2"/>
    <polygon points="344,84 334,78 334,90" fill="#8b98ab"/>
  </g>
  <text x="20" y="196" font-size="13" fill="#33465e">右边还留了一栏给技能：名片可以自带函数，见演示 2 的 passed 成员。</text>
</svg>` },
        { t: `h2`, text: `怎么做` },
        { t: `p`, text: `定义放在 main **外面**（成员函数要用到 std::string，所以 <string> 得先包）。用的时候填值、点号取用：` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>

struct Student { int id; std::string name; double score; };   // 三栏挤一行也行，看清结构更重要

int main() {
    Student s{1001, "小明", 88.5};        // 按声明顺序填进三个栏位
    std::println("学号 {} 姓名 {} 分数 {}", s.id, s.name, s.score);
    s.score = 92.0;                       // 改一栏，另两栏纹丝不动
    std::println("改完之后 {}", s.score);
    return 0;
}` },
        { t: `p`, text: `花括号里的值**按声明顺序**入座，第一个进 id、第二个进 name。这叫聚合初始化，是 struct 最省事的用法。取某个栏位用 **点号**：s.name 读出来就是一个 std::string，可以照旧拼接、求长度。` },
        { t: `h2`, text: `演示 1 · 名片上还能放技能` },
        { t: `code`, lang: `c++`, code: `struct Student {
    int id;
    std::string name;
    double score;
    bool passed() const {                 // 成员函数：它天然知道自己这张名片的 score
        return score >= 60.0;
    }
};
// 用法：s.passed()  —— 括号里什么都不用递，score 就站在自己家里` },
        { t: `p`, text: `那个**结尾的 const** 现在只需记意思：「这个技能只看不改，它承诺不动名片上的任何一栏」。写成 const 有三个好处 —— 表达意图、能用于只读的对象、少写一遍 score。它背后那条规矩（this 指针与 const 成员函数）以后专门有一课讲透，这里照抄就行。` },
        { t: `h2`, text: `演示 2 · 一屋子名片` },
        { t: `code`, lang: `c++`, code: `// 下面沿用上面那份 Student（含 passed 成员）
#include <print>
#include <vector>

int main() {
    std::vector<Student> klass = {
        {1001, "小明", 88.5}, {1002, "小强", 52.0}, {1003, "小红", 60.0},
    };
    for (const Student& s : klass) {
        std::println("{} {:.1f} {}", s.name, s.score, s.passed() ? "及格" : "没及格");
    }
    return 0;
}` },
        { t: `p`, text: `这一小段把你前面学的东西全串起来了：vector 装 struct 是**合法且常见**的（元素类型可以是任何类型，包括你自己造的）；const Student& 是第 61 课那个「只看不摸」的标准读法，避免每圈复制一份名片；{:.1f} 控制小数位。输出三行，小明及格、小强没及格、小红刚好 60 及格。` },
        { t: `p`, text: `再往深处说一句，这句话以后一直有用：**struct 是值类型。** 把 s 赋给 b、把 s 当参数按值递出去，动的都是**整张名片的复制品**，原件一根毛都不会掉。第 60 课那套「按引用传，直接改原件」的分别，到了自定义类型身上才真正开始值钱 —— 名片上栏位越多，按值递的代价越大，这也是为什么演示 2 的 range-for 要写 const Student&。` },
        { t: `h2`, text: `演示 3 · 名片里装名片` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>

struct Point { double x, y; };
struct City { std::string name; Point center; int pop; };

int main() {
    City c{"喵镇", {116.4, 39.9}, 12000};
    std::println("{} 的中心在 ({}, {})，人口 {}", c.name, c.center.x, c.center.y, c.pop);
    std::println("整张名片占 {} 字节：Point {}，int {}，string {}", sizeof(c), sizeof(Point), sizeof(int), sizeof(std::string));
    return 0;
}` },
        { t: `p`, text: `实跑两行：第一行是照常读点「点开的」字段（两个点连着写就穿透了两层，读起来像目录一样自然）；第二行用 sizeof 探针量了量这张名片 —— 这台机器上是 56 字节。` },
        { t: `p`, text: `这 56 值得看一眼：string 32 加 Point 16 加 int 4 是 52，可名片占了 56 —— 差的 4 个字节是编译器**为了让每样东西落在它喜欢的地址上而垫的空**。垫多少由字段类型和排列顺序决定，所以你换一台机器、换个编译器，这个数字可能就变，别把它写进任何依赖里。至于 string 那 32 字节：那是「装文本的盒子本身」的大小，盒子里记着文本在哪、多长、还能装多少，真正的文字在别处 —— 跟第 5 课那张「号牌与工具」的分别是同一件事。名片套名片合法且常用，一张 City 里放 Point 就是一张名片上的一个地址块，读的时候一层一层点过去就行。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `定义写完忘了结尾分号。}; 那个分号是语法要求的，少了它报错常常指向后面很远的地方，还会冒出「expected ';' before ...」这种看着不相干的话。`,
          `填值顺序搞反。Student s{88.5, "小明", 1001}; 会把 88.5 往 id 里塞 —— 类型对不上，编译器当场报错（好消息），但 Student s{1001, "小明", 88} 这种全对得上的顺序错，它就不管了。栏位多的时候改用「带栏位名」的写法更安全，那种写法以后再教。`,
          `以为 s.name 和 s 是同一回事。s.name 是一个 std::string，s 是整张名片；把 s 直接塞进 println 会报「没人认识怎么印 Student」—— 这正是下一课要解决的事。`,
          `成员函数里绕远路写 this->score。在成员函数内部直接写 score 就行，它自动指向当前这张名片。`,
          `两个 struct 变量赋值当引用。Student b = a; 是**整份复制**一份新名片，改 b.name 不动 a —— 想「不复制地操作原件」要写引用，那是第 60 课那套规矩。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `定义 struct Point { double x; double y; }; 存一个点并打印`,
          `给 Point 加一个成员函数 double length2() const，返回到原点的距离平方（不开根号），打印一下。`,
          `建一个 std::vector<Point>，装 3 个点，range-for 逐个打印；再按 const 引用读，别按值。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：struct 是「把本来就属于一个东西的数据订在一起」，从此类型替你把关；名片上还能挂函数，数据和操作数据的行为第一次待在同一处。` }
      ]
    },
    {
      id: `m84`, title: `第 84 课 · 自定义打印：教 println 认识你的 struct`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：给自创类型写一份 std::formatter 说明书，让它能直接放进 println 的坑里。今天不求懂每一行，先会照抄、会改格式。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课最后一个坑在这儿等着：std::println("{}", s) 印不出来。因为 println 认的是**类型**，不是字段 —— 它自带一本「哪些类型我会印」的名册，int、double、std::string 都在册上，你昨天才造的 Student 不在。` },
        { t: `p`, text: `两条路：一是每次都手写 s.id 和 s.name（能用，但你写的每一处打印都要重复一遍格式，改一次格式要满工程找）；二是**给这个类型登记一份说明书**：「见到 Student，就照这个格式印」。走第二条，此后 println 里 {} 直接放整个对象。这门课教第二条。` },
        { t: `p`, text: `说明书的正式名字叫 **std::formatter 的特化**。名字唬人，做的事很朴素：标准库预留了一个「每个类型怎么写」的空格，你可以往里填一份自己的写法，填一次全局生效。你会看到三个新面孔，先给一句话印象，往后都会常见：` },
        { t: `ul`, items: [
          `template <> —— 意思是「下面这份是**专门**为某个类型写的特例」。它是泛型机制的门面，往后有一整节专门讲它；今天当固定句式记。`,
          `struct std::formatter<Student> —— 要填的那个空格的标准名字。尖括号里放你的类型。`,
          `parse 与 format 两个成员函数 —— parse 管「格式说明符怎么读」，format 管「实际怎么写出去」。本课的 parse 一律照抄（表示我不接受特殊格式要求），只改 format。`
        ]},
        { t: `svg`, caption: `println 印一个对象时的三步查册：拿类型 → 查名册 → 命中就用你写的 format，没命中就在编译期被拦下`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 232">
  <g font-size="13" fill="#142639">
    <text x="24" y="24" font-weight="700">std::println("{}", s) 背后走的三步</text>
  </g>
  <g font-size="12" text-anchor="middle">
    <rect x="24" y="48" width="150" height="56" fill="#eaf3fb" stroke="#00599c"/>
    <text x="99" y="72" fill="#00599c" font-weight="700">第一步 · 看类型</text><text x="99" y="92">s 是 Student</text>
    <rect x="230" y="48" width="180" height="56" fill="#fff3d6" stroke="#b8722b"/>
    <text x="320" y="72" fill="#b8500f" font-weight="700">第二步 · 查名册</text><text x="320" y="92">std::formatter 里有 Student 吗</text>
    <rect x="460" y="48" width="156" height="56" fill="#e7f6ec" stroke="#1a7f42"/>
    <text x="538" y="72" fill="#1a7f42" font-weight="700">第三步 · 照册写</text><text x="538" y="92">调你写的 format</text>
  </g>
  <g stroke="#57677c" fill="none" stroke-width="1.5">
    <line x1="174" y1="76" x2="226" y2="76"/><line x1="410" y1="76" x2="456" y2="76"/>
    <text x="200" y="70" font-size="11" fill="#57677c" stroke="none" text-anchor="middle">→</text>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="24" y="140">名册命中：输出走你 format 里那句格式串，一次登记、全工程生效</text>
    <text x="24" y="166">名册没命中：编译阶段直接拒绝，报的是一长串模板内部名字 —— 忘包 &lt;format&gt; 也是这副阵仗</text>
    <text x="24" y="192">它是编译期查表，不是运行时兜圈：写下的类型没有说明书就多写一行手写打印，不会跑出乱码</text>
    <text x="24" y="218" font-weight="700" fill="#1a7f42">本课做的事只有一件：把你的类型登记进那本名册</text>
  </g>
</svg>` },
        { t: `h2`, text: `怎么做` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <format>
#include <string>

struct Student { int id; std::string name; };

template <>                        // 说明书：专管 Student 这一种类型
struct std::formatter<Student> {
    constexpr auto parse(std::format_parse_context& ctx) { return ctx.begin(); }
    auto format(const Student& s, std::format_context& ctx) const {
        return std::format_to(ctx.out(), "[{}] {}", s.id, s.name);
    }
};` },
        { t: `p`, text: `这一坨先当**固定骨架**抄走。整块里真正属于你的只有两处：花括号里那几行成员（照你的名片写），和 format 里那句格式串 "[{}] {}"。下面这段才是它换来的东西。` },
        { t: `code`, lang: `c++`, code: `#include <print>
// 接在上面那份说明书之后
int main() {
    Student s{1001, "小明"};
    std::println("{}", s);                    // 直接印整个对象：[1001] 小明
    std::println("候补 {}", Student{1002, "小红"});   // 临时造出来的也能印
    return 0;
}` },
        { t: `p`, text: `三个头文件一个都不能少：<print> 给 println、<format> 给 formatter 与 format_to、<string> 给成员类型。**要改的只有 format 里那句格式串** —— 方括号数字加名字是这份说明书现在长成的样子。parse 那行照抄别动，它是「我这份说明书不接受额外的格式选项」的意思， constexpr 也是那句照抄的一部分。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `为什么标准库不干脆反射出字段、自动帮你印？因为那需要运行时知道类型的内部结构，C++ 故意不做这种事：它宁可你**显式登记**一份写法，也不在背后猜。代价是多写这十几行，好处有两点 —— 打印格式由你定（学生印成「学号 姓名」还是「姓名（学号）」是你的事），而且这份说明书跟类型放在同一个头文件里，任何用到这个类型的文件都自动获得它。` },
        { t: `p`, text: `顺带纠正一个常见误会：这**不是**「给 println 加功能」，而是「给某个类型登记怎么写」。所以登记一次之后，println、format、以及以后你会见到的其他格式化场合，全都认它。` },
        { t: `h2`, text: `演示 1 · 换一种格式，只改一处` },
        { t: `code`, lang: `c++`, code: `    auto format(const Student& s, std::format_context& ctx) const {
        return std::format_to(ctx.out(), "学生{}:{}", s.id, s.name);
    }

// 于是 main 里这三句都跟着变，一处没漏：
std::println("{}", s);
std::println("名单：{}", s);
std::println("第二次：{} 又是 {}", s, s);` },
        { t: `p`, text: `这就是登记的收益：**格式的定义只有一份**。改完 format，所有打印点同时换样式，不存在「这三处改了那两处忘了」。` },
        { t: `p`, text: `什么时候值得登记，什么时候不必？三条判断：一、这个类型会在**三个以上**的地方被打印 → 登记，省下的是重复与不一致；二、它是这个工程里的「主角」（学生、订单、棋局）→ 登记，主角就该有好打印；三、只是临时算一把、打印一次 → 直接写 s.id 与 s.name 更快，别为了一点漂亮多养十几行。登记没有魔法，它就是一次「格式定义集中化」。` },
        { t: `h2`, text: `演示 2 · 一个类型一份说明书` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <format>

struct Point { double x, y; };

template <>
struct std::formatter<Point> {
    constexpr auto parse(std::format_parse_context& ctx) { return ctx.begin(); }
    auto format(const Point& p, std::format_context& ctx) const {
        return std::format_to(ctx.out(), "({:.1f}, {:.1f})", p.x, p.y);
    }
};
// Student 那份说明书还在上面，两份互不打扰
int main() { std::println("两点: {} {}", Point{0, 0}, Point{1.5, 2.25}); }` },
        { t: `p`, text: `打出来是「两点: (0.0, 0.0) (1.5, 2.3)」。注意两件小事。第一，说明书是**按类型各写一份**的：Student 那份管 Student，Point 这份管 Point，谁也不覆盖谁，一行 println 里同时放两种对象也没问题。第二，尖括号里放的必须是你自己的类型 —— 你不能给 int 重写一份，那是标准库在册的格子。` },
        { t: `p`, text: `那两份说明书该放哪？答案是**跟着类型走**：类型定义在哪个头文件里，它的说明书就写在同一个头文件里，紧挨着。道理很直白 —— 用到这个类型的人自动就拿到了它的写法；要是说明书写在某个 cpp 的角落，另一个文件包含了类型却没有说明书，打印照样编译不过，排查起来满工程找头文件。这一条今天先照做，等学到头文件分离那一课，你会明白它本来就是「声明和它的实现放一起」这个更大规矩的特例。` },
        { t: `p`, text: `顺带认一下 format 里那三样东西的名字，以后常见：ctx.out() 是「往哪儿写」的那支笔，std::format_to 是「按格式串把值灌进这支笔」的动作，返回它正是「写完之后笔停在哪儿」。这三样你这一课都不必改动，只要改格式串和坑里的字段顺序。真正要你负责的只有那一句格式串 —— 这也是本课反复说「只改 format」的原因。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `忘 #include <format>。报错长得非常离谱（一堆模板内部的名字刷屏），但根因常常就是少这个头文件。`,
          `说明书写在 main 里面。template <> struct std::formatter... 必须在**函数外面**，而且要在用到它之前 —— 放在 main 里编译器不认。`,
          `改坏了 parse。把那句照抄的东西改成 return ctx.end(); 或者删掉，会得到「格式说明符解析失败」一类怪错。这一行今天不需要理解，只需要别动。`,
          `给别的命名空间里的类型登记时位置写错。登记 std::formatter 必须写在**全局作用域**（像示例这样），写进别的命名空间里标准库找不到它。`,
          `以为登记完就能比大小。formatter 只教了「怎么写」，不教「谁大谁小」，那是下一课 sort 要处理的事。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把说明书里的格式改成 "学生{}:{}"，重跑看效果`,
          `给上一课的 Point 也登记一份 formatter，格式写成 "({x}, {y})" 那种样子（提示：两个 double 用两个 {} 坑，或 {:.1f} 控制小数）。`,
          `故意把 <format> 那行删掉编译一次，把报错的第一屏认一认 —— 以后你每次忘包头文件都会见到类似阵仗。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：给自创类型登记一份 std::formatter，是「教 println 认人」而不是「教 println 变强」—— 登记一次，全工程所有打印点同时生效。` }
      ]
    },
    {
      id: `m85`, title: `第 85 课 · struct 排序：多关键字定名次`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用 lambda 告诉 sort「看哪一栏比」，并且会处理平局 —— 第一关键字分不出胜负时，拿第二关键字接着比。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 65 课我们 sort 过一列数。可学生是名片：手里有分数、学号、姓名，「排好序」这句话得先说清**按什么排**。上一课我们让 println 认识了名片（登记怎么写）；这一课让 sort 认识名片（告诉它怎么比）。` },
        { t: `p`, text: `sort 的比较规则由你给一个 lambda（第 56 课那件工具）。它问的其实只有一句话：**「a 该排在 b 前面吗？」** 你返回 true 就是「该」，返回 false 就是「不该」。所以「分数高的在前」要写成 return a.score > b.score; —— 别看是大于号，它表达的是「a 排在前面」这件事。` },
        { t: `p`, text: `平局怎么办？这是真实比赛的常规问题：两个人同分，谁在前？不定第二条规则的话，同分两人的先后是**排序算法自己决定的**，不同编译器、不同数据规模可能不一样，你的输出就会时对时错。规矩是：**只要可能相等，就必须有下一条**，一直加到「任何两条都能分出先后」为止。` },
        { t: `code`, lang: `text`, code: `比分数  → 不同，就到此为止（高分在前）
       ↓ 相同
比学号  → 学号天生不重复，一定能分，链条结束` },
        { t: `h2`, text: `演示 1 · 先比分数，平局比学号` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <algorithm>        // sort 住在这里
int main() {
    std::vector<Student> ss = {                       // 沿用第 83 课那份 Student
        {1, "小明", 88.5}, {2, "小强", 95.0}, {3, "小红", 88.5},
    };
    std::sort(ss.begin(), ss.end(), [](const Student& a, const Student& b) {
        if (a.score != b.score) return a.score > b.score;   // 第一关键字：分数高在前
        return a.id < b.id;                                 // 平局：学号小在前
    });
    for (const Student& s : ss) std::println("{} {:.1f}", s.name, s.score);
    return 0;
}` },
        { t: `p`, text: `输出是 小强 95.0、小明 88.5、小红 88.5 —— 小明和小红同分，靠学号 1 与 3 定序，所以小明在前。两个参数写成 const Student& 是第 61 课的规矩：排序过程中比较次数很多（n 个元素大约 n log n 次），每次按值复制两张名片纯属浪费。` },
        { t: `p`, text: `还有一处细节值得停一下：**参数为什么写 const Student& 而不是 Student s。** 除了省复制，它还有第二层作用：把「在比较里顺手改数据」这条路从根上堵死。排序是比较最密集的场合，比较函数里偷偷改值，排出来的顺序就没有任何保证可言了 —— const 加上引用，既省钱又是「我只看不摸」的声明，一举两得。` },
        { t: `p`, text: `比完两层之后，把这条链的性质说透。你给 sort 的那个 lambda，标准库要求它满足一件叫**严格弱序**的事，名字玄，要求很实在：**同一个人不能排在自己前面**（a 对 a 必须返回 false），而且「a 该在 b 前」「b 该在 a 前」不能同时成立。为什么管这么宽？因为 sort 就是靠这两个性质来推断整列顺序的，你写出的判断一旦自相矛盾，它推出来的东西就不受任何保证 —— 轻则顺序乱，重则越界崩掉。最常见的破规矩写法，是把「分数高在前」写成 a.score >= b.score：分数相等时它返回 true，等于在说「我该排在我自己前面」，正是那条被禁止的事。所以比较函数里**平局一律交给下一层去分**，别在第一层用「大于等于」糊过去。` },
        { t: `h2`, text: `演示 3 · 先分组，再排组内` },
        { t: `code`, lang: `c++`, code: `// 规矩：及格的整组排前面；组内分数高在前；还平局就学号小在前
std::sort(ss.begin(), ss.end(), [](const Student& a, const Student& b) {
    bool pa = a.score >= 60, pb = b.score >= 60;          // 「及格」不是一栏，是算出来的
    if (pa != pb) return pa;                              // 第一层：及格的在前
    if (a.score != b.score) return a.score > b.score;     // 第二层：组内比分数
    return a.id < b.id;                                   // 第三层：唯一键收尾
});` },
        { t: `p`, text: `三层就是三句「先看不一样，再看下一样」。这种「先分组、再组内排」的需求特别常见（及格的在前、VIP 在前、今年的在前），写法的形状都一样：**分组那条放最前面**，因为它最粗。要检查链条合不合法，有个便宜的土办法：造两条**每个栏位都相同**的数据跑一遍 —— 如果顺序会变，说明最后那层「一定不等」的键没写或者不管用；如果程序直接崩，八成是哪里写成了「大于等于」。` },
        { t: `p`, text: `最后一个跟性能有关的习惯：**比较函数里只做判断，别干重活**。它会被调用很多次，一列一万个人就是十几万次量级；在里面打印一行、拼一个新字符串、甚至读一遍文件，都会被放大成看得见的卡顿。要用的值事先算好放进名片（比如「及格与否」存成一栏），比较的时候直接读那一栏，比现场算更快也更好读。真到了数据大到在乎这点开销的时候，会有专门的办法把重复计算省掉，那是以后几课的事，本课先把「比较函数要短要纯」这条当纪律。` },
        { t: `h2`, text: `演示 2 · 加第三个关键字：先比姓名长度` },
        { t: `code`, lang: `c++`, code: `std::sort(ss.begin(), ss.end(), [](const Student& a, const Student& b) {
    if (a.score != b.score) return a.score > b.score;
    if (a.id != b.id) return a.id < b.id;
    return a.name.size() < b.name.size();      // 真用不上；只是让你看清链条可以一直加
});` },
        { t: `p`, text: `加层的顺序**从粗到细**：先最关心的，最后一条必须是「保证不再平局」的那条（学号、时间戳、下标这类唯一值）。这里第三层其实永远走不到，因为学号已经把局分完了 —— 真实代码里多余的层要删掉，留着只会让人以为还会平。` },
        { t: `svg`, caption: `两条比较链：左边缺第二层（同分两人谁在前变成不确定），右边补齐到「一定能分」`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 216">
  <text x="20" y="24" font-size="13" font-weight="700" fill="#b8500f">只有一层：同分就听天由命</text>
  <text x="330" y="24" font-size="13" font-weight="700" fill="#1a7f42">两层：学号把平局钉死</text>
  <g font-size="12" fill="#26405a">
    <rect x="20" y="40" width="240" height="30" rx="6" fill="#fdece1" stroke="#b8500f" stroke-width="1.5"/><text x="32" y="60">比 score → 相等？</text>
    <text x="32" y="92" fill="#b8500f" font-weight="700">是 → 两条都算「不该换」</text>
    <text x="32" y="112">排序按它自己的内部决定排</text>
    <text x="32" y="132">换台机器、换个数据量，名次就变</text>
    <rect x="330" y="40" width="240" height="30" rx="6" fill="#e7f6ec" stroke="#1a7f42" stroke-width="1.5"/><text x="342" y="60">比 score → 相等？</text>
    <rect x="330" y="80" width="240" height="30" rx="6" fill="#e7f6ec" stroke="#1a7f42" stroke-width="1.5"/><text x="342" y="100">比 id → 一定不等</text>
    <text x="342" y="130" fill="#1a7f42" font-weight="700">链条终点保证能分出先后</text>
    <text x="342" y="150">→ 输出在任何机器上都一样</text>
    <path d="M250 60 H316" stroke="#8b98ab" stroke-width="2"/>
    <polygon points="316,60 306,54 306,66" fill="#8b98ab"/>
  </g>
</svg>` },
        { t: `p`, text: `同一副骨架能办无数种事，改的只是里面的判断：按姓名排（字典序）就比 a.name < b.name，第 19 课字符串比大小教的正是这个；要「及格的优先」就在最前面加一层「先比两人及格与否」，上面演示 3 写的正是这种。多关键字这条链，是这门课后半段反复要用的形状。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `平局不定第二条。症状是「名次时对时错」「本地好使，换个编译器就乱」—— 因为同分两人的顺序本就没被规定。补一条唯一键（学号、自增下标）才算写完。`,
          `把「a 在前」写成 a.score < b.score，排完发现是升序还找不到哪儿错。记法：lambda 回答的是「a 该在 b 前面吗」，要高分在前就写大于。`,
          `用 sort 但忘 #include <algorithm>。报错会甩一大串模板内部信息，第一行找 "sort" 这个词才认得出是它。`,
          `比较函数里改数据。有人图省事在 lambda 里 s.score = ... 之类，比较函数必须是**纯判断**，改数据会让排序结果不可预测（甚至当场崩）。参数写 const 引用正好从根上禁止。`,
          `以为「排过了就不用再管顺序」。多关键字排序的稳定性（同键保持原相对顺序）是 std::stable_sort 才给的保证；普通 sort 一旦平局没人负责。这一条先记住有这事，以后学排序那几课会撞见。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `改规则：分数升序，平局时学号大的在前`,
          `把比较函数拆成「先比 name.size()，平局再比 score」，然后打印前三行，看看跟原来差在哪。`,
          `故意把第二条 return a.id < b.id; 删掉，用同分的两人跑两遍，观察名次会不会变 —— 然后把它加回去。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：多关键字排序 = 一条「从粗到细、终点必须能分出胜负」的比较链；lambda 回答的永远是「a 该排在 b 前面吗」。` }
      ]
    }
  ]
};
