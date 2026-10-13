/* 喵站 · C++ 掌握 正文分部 p10：第 113–116 课（第九轮）
 *
 * 源稿：113_构造函数与初始化列表.cpp、114_const成员函数.cpp、115_运算符重载.cpp、116_继承与override.cpp
 * 第 112 课把类的骨架立起来，这四课是骨架上先长出来的四件东西：
 * 出生那一刻怎么把数据装好、只读方法怎么向编译器自证清白、对象怎么学会比大小、类怎么长出下一代。
 * 写法照 p04：讲「为什么这么想」，不只讲「语法长这样」。演示输出一律经本机 g++ -std=c++23 实跑核对。
 */
window.MIAO_CPPM_P10 = {
  chapters: [
    {
      id: `m113`, title: `第 113 课 · 构造函数与初始化列表：对象出生那一刻就装好数据`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会写构造函数，用冒号后的初始化列表让对象一出生就带着完整数据，并说清它比「先生成再赋值」好在哪。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 112 课留了个尾巴：类是图纸，对象是照着图纸造出来的实物，数据锁在 private，按钮摆在 public。但那节课的写法得**先生一个空对象，再一个一个往里填** —— 这条路上埋着一个谁都踩过的坑：填到一半就用了。本课把它堵死：**让对象在出生那一刻就是完整的。**` },
        { t: `p`, text: `干这件事的叫**构造函数**。它有两处反常：名字必须跟类**一模一样**，而且**不写返回类型**。这两条不是语法怪癖，它们说出了构造函数的身份 —— 它不是「算出一个 Score 交给你」，而是「这块内存刚分下来，由你填成合法状态」的出生手续。名字同名，编译器才知道它管哪张图纸；不写返回类型，是因为它压根不返回什么，它就地改造手里那个对象。` },
        { t: `code`, lang: `text`, code: `Score(std::string subject, int total)   ← 同名、无返回类型：这是构造函数
    : subject_(std::move(subject)),     ← 冒号后面这一段叫初始化列表
      total_(total) {}                  ← 一个成员一行，出生时就装进去` },
        { t: `p`, text: `冒号后面那一串就是**初始化列表**。它的语义不是「生完再补」，而是**带着出生** —— 成员在这个对象存在的第一秒钟就已经有值，从来没有过空着的那一刻。于是 main 里那句 Score s("英语词汇", 5500) 一行干完两件事：造出来、装满。` },
        { t: `p`, text: `那「更规矩、更高效」省在哪？对 int total_ 这种成员，两条路几乎没差别：先填 0 再改成 5500，跟一步到位，机器活儿差不多。**差别在 std::string 这种自己管内存的成员上。** 走「进门再赋值」，subject_ 必须先成为**一个合法的空串**——不然你那句赋值是给谁赋的？然后新值搬进来、空串的内存扔掉。走初始化列表，造壳和扔壳这两步根本不发生。所以「更规矩」和「更高效」是同一个原因：**中间那个没用的状态被取消了。**` },
        { t: `svg`, caption: `有冒号那条路，成员从「不存在」直接跳到「带着值存在」；没冒号那条路多走一步「先造空壳、再往里填」，自己管内存的成员为此白造一次、白扔一次`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 262">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">同一个对象的两种出生路线</text>
  <g font-size="12" fill="#26405a">
    <text x="16" y="44" font-weight="700" fill="#1d7a3c">路线一：冒号后写初始化列表</text>
    <rect x="16" y="52" width="132" height="30" rx="6" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/>
    <text x="82" y="71" text-anchor="middle">实参递进构造函数</text>
    <path d="M152 67 H188" stroke="#57677c" stroke-width="2.5"/><polygon points="188,67 178,61 178,73" fill="#57677c"/>
    <rect x="194" y="52" width="176" height="30" rx="6" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/>
    <text x="282" y="71" text-anchor="middle">每个成员就地装好</text>
    <path d="M374 67 H410" stroke="#57677c" stroke-width="2.5"/><polygon points="410,67 400,61 400,73" fill="#57677c"/>
    <rect x="416" y="52" width="120" height="30" rx="6" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/>
    <text x="476" y="71" text-anchor="middle">s 一存在就完整</text>

    <text x="16" y="112" font-weight="700" fill="#b8500f">路线二：不写冒号，进函数体再赋值</text>
    <rect x="16" y="120" width="132" height="30" rx="6" fill="#e8eef8" stroke="#00599c" stroke-width="1.5"/>
    <text x="82" y="139" text-anchor="middle">实参递进构造函数</text>
    <path d="M152 135 H188" stroke="#57677c" stroke-width="2.5"/><polygon points="188,135 178,129 178,141" fill="#57677c"/>
    <rect x="194" y="120" width="176" height="30" rx="6" fill="#fdece1" stroke="#b8500f" stroke-width="2"/>
    <text x="282" y="139" text-anchor="middle">成员先各自默认造好</text>
    <path d="M374 135 H410" stroke="#57677c" stroke-width="2.5"/><polygon points="410,135 400,129 400,141" fill="#57677c"/>
    <rect x="416" y="120" width="120" height="30" rx="6" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/>
    <text x="476" y="139" text-anchor="middle">函数体逐个赋值</text>
    <text x="194" y="168" fill="#b8500f">空串壳子在这里被造出来，又在这里被扔掉</text>

    <rect x="16" y="182" width="608" height="36" rx="8" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1"/>
    <text x="30" y="205" fill="#33465e">另一条不看文档就得自己踩的规矩：成员装载顺序只认类里的声明顺序，列表里谁写在前不算数。</text>
    <text x="16" y="238" fill="#00599c" font-weight="700">两处反常不是怪癖：同名 —— 它认图纸；无返回类型 —— 它就地改造，不交新东西。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `这门课的口味是「让非法状态写不出来」。你把成员需要的值列成参数，「没填就想用」这种代码就在编译期过不去，而不是等某天跑出一堆乱数据。第 112 课靠 private 把「外面乱改」挡在门外，本课靠构造函数把「里面半空」挡在出生之前 —— 两道闸门一起，一个类才谈得上自己守自己的规矩。` },
        { t: `h2`, text: `演示 1 · 源稿这段：一行完成出生加装数据` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <utility>
class Score {
public:
    Score(std::string subject, int total) : subject_(std::move(subject)), total_(total) {}
    void show() const { std::println("{}：共 {} 个", subject_, total_); }
private:
    std::string subject_;
    int total_;
};
int main() {
    Score s("英语词汇", 5500); s.show();
}` },
        { t: `p`, text: `跑出来是 英语词汇：共 5500 个。三行 include 一行不能少：std::string 要 <string>，std::println 要 <print>，std::move 要 <utility>。那个 std::move 是**转交而不是抄一份** —— 参数 subject 手里那块内存直接给成员，省一次复制，代价是参数之后不能再用了，细节以后再讲。方法名后面那个 const 先照抄，它说「这个方法只看不改」，**下一课整节讲它**。` },
        { t: `p`, text: `再看那个构造函数的形状：参数表后面紧跟冒号，冒号后面每项写成「成员名（值）」、用逗号隔开，最后 {} 收尾 —— **函数体是空的**。空不是没写完，恰恰是它最标准的样子：该干的活全在冒号后面干完了。` },
        { t: `h2`, text: `演示 2 · 把冒号整段删掉，走另一条路` },
        { t: `code`, lang: `c++`, code: `class Score {
public:
    Score(std::string subject, int total) {        // 没有冒号：先进门，再赋值
        subject_ = std::move(subject);
        total_ = total;
    }
    void show() const { std::println("{}：共 {} 个", subject_, total_); }
private:
    std::string subject_;    // 进门那一刻它已经是个空串
    int total_;              // 进门那一刻它只是块没人管的内存
};` },
        { t: `p`, text: `接上演示 1 的 main，输出仍然是那个 英语词汇：共 5500 个 —— 结果对，代价不同。注意末尾两行注释的不对称：string 成员有默认构造，进门时是个正经空串，随后被填、被扔的也是它；int 成员没有默认构造这回事，没装之前只是内存里的残留值。` },
        { t: `h2`, text: `演示 3 · 声明处给默认值，构造函数可以不管它` },
        { t: `code`, lang: `c++`, code: `class Score {
public:
    Score(std::string subject, int total)
        : subject_(std::move(subject)), total_(total) {}   // 列表里没有 done_
    void show() const {
        std::println("{}：{} / {} 个", subject_, done_, total_);
    }
private:
    std::string subject_;
    int total_;
    int done_ = 0;        // 声明处给默认值：出生时它自己就是 0
};` },
        { t: `p`, text: `这就是本课任务 1 的答案形状。造两个对象 Score a("英语词汇", 5500) 和 Score b("数学", 30)，打印出来是 英语词汇：0 / 5500 个 与 数学：0 / 30 个。done_ 既不在参数表也不在冒号后面，但它一出生就是 0：**声明处那个 = 0 本身也是一份初始化**，只是它由所有构造函数共享 —— 以后你再加第二个构造函数，不用在每个列表里重写一遍 done_(0)。` },
        { t: `p`, text: `一条底线记住：每个成员都必须有一条自己的初始化路，要么进列表，要么有声明处默认值。缺了不是 0，是垃圾，而垃圾通常不报错。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `构造函数这一处有两个方向相反的错，都实测过。**写多了**：给 Score 加上返回类型写成 void Score(std::string s)，编译器当场拦住，报 return type specification for constructor invalid —— 类里不许存在跟类同名却不是构造函数的东西，这条错直白，好修。**名字差一个字母**：写成 Socre，它立刻降级成一个普通成员函数，一声不响地合法，你调它才填数据；这时 main 里那句 Score s("英语词汇", 5500) 报 no matching function for call to Score::Score，你会盯着 main 看，问题却在类里的名字上。结论：构造函数不写返回类型，连 void 都不写；名字跟类一字不差。`,
          `初始化列表漏了成员，也没有声明处默认值。实测一个只在 if 分支里赋值的 int total_，跑出来是 669728191、-1507115585 这类每跑一次换一个数。编译不报、运行不报，只是结果错，而且常在你机器上碰巧是 0、在别人机器上是一百三十七。`,
          `把装载顺序当成列表的书写顺序。成员初始化永远按类里的**声明顺序**走，让后一项去读前面还没装的成员就是错。这份错很会藏：不开 -Wall 编译一路绿灯、运行也不报，只是安静地读到垃圾；开了 -Wall 才甩出 will be initialized after 与 used uninitialized。稳的习惯是列表照声明顺序写，里面只做「成员 ← 实参」，别做算术。`,
          `用了 std::move 却没请 <utility>。报错是「std 里没有 move 这个成员」。有些实现里 <string> 顺手把它带进来了，于是同一份代码在这个编译器上过、在那个上过不了 —— 头文件按「用了什么就请什么」写，别赌运气。`,
          `参数名和成员名图省事写成同一个。规矩照源稿：参数用光名、成员带下划线，subject 配 subject_，一眼就知道谁交给谁。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `加第三个成员 int done_ = 0;（声明处给默认值），构造函数不用管它 —— 然后把它打印出来，确认新对象一出生 done_ 就是 0。`,
          `把演示 1 那段冒号整段删掉，改成进门以后逐行赋值，跑一遍确认输出完全一样，然后说清 std::string 成员多付出了什么。`,
          `延伸一：拿掉 int total_ 的初始化 —— 既不在冒号后面也不给声明处默认值 —— 造两个对象各读一次，看看未初始化的值长什么样。`,
          `延伸二：写一句不带参数的 Score s;，看清编译器的报错，再补一行 Score() = default; 把它请回来；然后回答：这样划不划算。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：构造函数是出生手续 —— 名字跟类同名、不写返回类型；冒号后的初始化列表让成员「一存在就带着值」，省掉造空壳再扔的那一步；成员装载顺序只认声明顺序，每个成员都必须有一条自己的初始化路。` }
      ]
    },
    {
      id: `m114`, title: `第 114 课 · const 成员函数：向编译器发誓「我只看，不动手」`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：分清只读方法与会改对象的方法，给只读的挂上 const，并说清这份承诺由编译器在哪个时刻兑现、不兑现会看到什么报错。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 113 课管的是出生那一刻，本课管出生之后：**谁能动它**。类里的方法默认人人可以改成员 —— 一个叫 remaining 的「查剩余」方法想顺手写一下 done_，编译器不会拦。方法名后面加 const，就把「我只看，绝不动手」从口头承诺变成编译器验收的契约。源稿那个类比很准：银行柜员，「查询余额」永远不动你的钱，「取钱」才会 —— 问题是这两种窗口在代码里长得一模一样，直到你写下 const。` },
        { t: `code`, lang: `text`, code: `int remaining() const   ← const 在参数表后面：修饰这个方法，承诺不动成员
void add(int n)         ← 不加：它要写 done_，加了反而编译不过
const int total() const ← 返回值前那个 const 管的是别的事，后面这个才是本课的` },
        { t: `p`, text: `位置很要紧。const 写在参数表**后面**才叫 const 成员函数；写在返回值前面是另一回事，它修饰返回的那个值，对调用者几乎没意义，实测照样编译。那后面的 const 到底改了点什么？它改的是这个方法隐式拿到的那个「我自己」：方法体里写的 total_、done_，其实都是「我自己的成员」，加上 const，编译器就把这个「自己」当成只读对象看。于是任何写成员的语句当场报错 assignment of member ... in read-only object，直译是「往只读对象的成员里赋值」。` },
        { t: `svg`, caption: `同一个对象、同一个成员，走带 const 的门只能看，走不带 const 的门才能写。差别不在成员是否可见，在这个方法有没有把「自己」签成只读`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 258">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">方法名后面那个 const，是给这扇门配的钥匙</text>
  <g font-size="12" fill="#26405a">
    <rect x="16" y="36" width="150" height="74" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
    <text x="91" y="56" text-anchor="middle" font-weight="700">对象 s</text>
    <text x="91" y="78" text-anchor="middle">total_ = 10</text>
    <text x="91" y="98" text-anchor="middle">done_ = 4</text>

    <path d="M170 56 H232" stroke="#1d7a3c" stroke-width="2.5"/><polygon points="232,56 222,50 222,62" fill="#1d7a3c"/>
    <path d="M170 96 H232" stroke="#b8500f" stroke-width="2.5"/><polygon points="232,96 222,90 222,102" fill="#b8500f"/>

    <rect x="238" y="36" width="180" height="34" rx="8" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/>
    <text x="328" y="52" text-anchor="middle" font-weight="700" fill="#1d7a3c">remaining() const</text>
    <text x="328" y="66" text-anchor="middle">读 total_、读 done_ —— 过</text>
    <rect x="238" y="82" width="180" height="34" rx="8" fill="#fdece1" stroke="#b8500f" stroke-width="2"/>
    <text x="328" y="98" text-anchor="middle" font-weight="700" fill="#b8500f">add(n)</text>
    <text x="328" y="112" text-anchor="middle">done_ += n —— 允许</text>

    <rect x="446" y="36" width="176" height="34" rx="8" fill="#ffffff" stroke="#b8500f" stroke-width="1.5" stroke-dasharray="4 3"/>
    <text x="534" y="52" text-anchor="middle" fill="#b8500f" font-weight="700">在这扇门里写成员</text>
    <text x="534" y="66" text-anchor="middle">read-only 报错，当场拦下</text>
    <path d="M422 53 H442" stroke="#b8500f" stroke-width="2" stroke-dasharray="4 3"/>
    <text x="430" y="42" fill="#b8500f">×</text>

    <rect x="16" y="132" width="606" height="58" rx="8" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1"/>
    <text x="30" y="152" fill="#33465e">第二道门更硬：参数写成 const Score&amp; 时，函数里只有带 const 的方法能调，</text>
    <text x="30" y="170" fill="#33465e">不带 const 的 add 当场被拦 —— 只读对象的可用接口由方法签名的这一列决定。</text>
    <text x="16" y="212" fill="#00599c" font-weight="700">所以 const 不是注释：它同时管住「方法里能写什么」和「只读对象上能调什么」。</text>
    <text x="16" y="238" fill="#33465e">判断口径只有一句：函数体里没写成员、也没调不带 const 的方法，那就该挂 const。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `三条收益按实在程度排。第一，**写错的时刻提前**：在只读方法里手滑写了赋值，编译期就拦住，而不是等某天数据莫名其妙对不上。第二，**读代码的人不必再读函数体**：方法名后面有没有 const，一眼把接口分成「查」和「改」两类，类一大这个差别非常值钱。第三最硬：**const 是接口的一部分，不是装饰** —— 只读的对象只能调 const 方法，没标的在它身上根本调不动。` },
        { t: `p`, text: `第三条值得展开。第 61 课学的 const 引用参数，是把对象交给别人看时的标准写法：你不希望 report 改你的数据，就写 const Score& 收着。但光在参数上写 const 不够 —— 被交出去那一侧必须有一批明确标了只读的方法可用，否则 report 里连 remaining 都敲不开。**「给只读方法标 const」不是个人卫生习惯，它是别人能安全地拿着你的对象写代码的前提。**` },
        { t: `h2`, text: `演示 1 · 源稿这段：查与改分成两拨` },
        { t: `code`, lang: `c++`, code: `#include <print>
class Score {
public:
    Score(int total) : total_(total), done_(0) {}
    int remaining() const { return total_ - done_; }
    double progress() const { return static_cast<double>(done_) / total_; }
    void add(int n) { done_ += n; }
private:
    int total_, done_;
};
int main() {
    Score s(10); s.add(4);
    std::println("进度 {:.0f}%，还剩 {} 个", s.progress() * 100, s.remaining());
}` },
        { t: `p`, text: `输出 进度 40%，还剩 6 个。remaining 与 progress 只读，挂 const；add 要动 done_，不挂。构造函数那行的初始化列表是上一课的手艺，static_cast 把整数除法换成小数 —— 这两处今天都不是主角。` },
        { t: `h2`, text: `演示 2 · 本课任务：在 remaining 里手滑一行` },
        { t: `code`, lang: `c++`, code: `    int remaining() const {        // 号称只读的方法
        done_ = 0;                 // 手滑：想「顺手清一下」
        return total_ - done_;
    }` },
        { t: `p`, text: `接上演示 1 的类，编译器一行到位：error: assignment of member 'Score::done_' in read-only object。根因不是 done_ 是 private —— 在类里它当然可见 —— 而是这个方法的「自己」被签成了只读。把这句赋值挪进 add 立刻合法：同一个动作，写在哪个方法里决定它能不能做。看完就删掉，这正是任务 1 要的效果。` },
        { t: `h2`, text: `演示 3 · const 引用只能敲带 const 的门` },
        { t: `code`, lang: `c++`, code: `#include <print>          // 接演示 1 的类，同一个文件
void report(const Score& s) {                // 交给你一个对象，只看不摸
    std::println("还剩 {} 个", s.remaining());     // 带 const —— 过
    s.add(1);                                    // 不带 const —— 编译不过
}
int main() {
    Score s(10); s.add(4);
    report(s);                                 // 删掉上面那行 add，输出：还剩 6 个
}` },
        { t: `p`, text: `删掉那行 s.add(1) 就跑出 还剩 6 个。留着它，报错是 passing 'const Score' as 'this' argument discards qualifiers —— 你拿一个只读对象去调不带 const 的方法，等于要把只读这层抹掉。同一句话也会出现在类内部：peek() const 里写 add(0) 照样被拦。` },
        { t: `p`, text: `于是「有没有 const」在编译期把方法分成两个世界，只读那个世界里只有挂了 const 的方法能用。想给某个方法开后门只能改它的签名，而一改就等于向所有人宣布：这个方法会动状态。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `该标的没标，结果自己的类把自己锁在外面。最典型的长相是你写了个 report(const Score& s)，里面连 remaining 都调不动，报错就是那句 discards qualifiers。修法朴素：把「读完就走」的方法一律挂上 const。判断口径背下来 —— 函数体里没写成员、也没调不带 const 的方法，那就该有 const。`,
          `只把 const 写在返回值前面。实测 int total() 前面加个 const 一样合法，但它管的是返回的那个值，方法内部照样能写成员 —— 你以为发了誓，其实什么都没承诺。这条最坑，因为编译一路绿灯，只有读代码的人被骗。承诺只写在参数表后面。`,
          `把参数上的 const 和方法后的 const 混为一谈：void add(const int n) 说的是「n 这个副本在函数里不许改」，跟方法动不动成员毫无关系。位置不同，管的东西不同。`,
          `以为挂了 const 就保证对象在整个程序里不变。不是。const 方法只承诺**这个方法**不动成员，同一个对象别的时刻照样被 add 改。要「进了函数就不变」，靠的是把参数写成 const 引用，两件事配合才成环。`,
          `真有个「只读但其实记了一笔」的方法，比如返回被调用过几次。它写了成员，就不能挂 const —— 硬挂上就报错，绕开报错的那条专门的后门不属于本课，以后再讲。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `在 remaining() 里偷偷加一行 done_ = 0;，看编译器怎么拦你，然后删掉 —— 把报错那句话读顺，知道它在说什么。`,
          `给这个类再加一个方法 double rate() const 返回 done_ 除以 total_，然后写一个收 const Score& 的函数调用它，确认能编译过。`,
          `延伸一：把演示 3 的 report 参数从 const Score& 改成 Score&，看 s.add(1) 是否立刻合法，再想想你交出去的还是不是「只读」。`,
          `延伸二：把 remaining 的 const 删掉，再编译演示 3 那个收 const Score& 的 report，看清报错指向哪一行 —— 不是你调用写错了，是接口少标了 const，坑的是拿你对象的人。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：const 写在参数表后面才管用，它把方法里的「我自己」签成只读；这份承诺由编译器兑现，兑现的地方有两处 —— 方法里写不了成员，只读对象也只敲得开带 const 的门。` }
      ]
    },
    {
      id: `m115`, title: `第 115 课 · 运算符重载：教对象学会比大小，算法就全认识它`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：给类写一个 operator<，把「谁该排前面」这条规则交给类型自己，让 sort、max、set 那一族算法不用你每次重复交代。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `vector<int> 能排序，不是因为 sort 里藏了一张表写着 3 比 5 小，而是因为 **int 自己回答得出「谁在前面」**。排序算法的本事其实只有一句：拿两个元素，问 a 是否小于 b；答案是真，就把 a 往前放。它问的这句话在代码里就写成 a < b。` },
        { t: `p`, text: `换成你自己造的 Score，a < b 这一句默认**不存在** —— 编译器不知道两个背单词进度该怎么比，于是 sort 直接编译不过。运算符重载干的就是把这句翻译出来：写成函数，名字固定是 operator 后面跟那个符号。教会一次，凡是只会问「小于吗」的算法就全都认识它了。` },
        { t: `code`, lang: `text`, code: `bool operator<(const Score& o) const { return rate() < o.rate(); }
 ↑        ↑          ↑          ↑
 只答真假  这就是 <    右边那个   上一课的只读承诺：比较当然不改对象` },
        { t: `p`, text: `四个位置各有各的道理。返回 bool，因为算法要的是一个是非判断，不是分数。参数是右边那个对象的引用：比较不该复制整个对象，更不该改它，所以写成 const Score&。函数后面挂 const —— 那是上一课的规矩在这里正好用上，比较只看不摸。` },
        { t: `p`, text: `还有一条规矩不写在语法书目录里，却最要命：**你的回答得讲道理**。算法假设「一个东西不小于它自己」，也假设「比出来的先后能传递」。你写成 a <= b，那么 a < a 就成了真，规矩当场塌掉。这条不是理论洁癖，实测过：两百个元素交给 sort，程序直接段错误 —— 编译一路绿灯，运行才崩。` },
        { t: `svg`, caption: `算法只会问一句「a 小于 b 吗」。int 天生答得出，自定义类默认答不出而编译不过，写了 operator< 就是给这一句接上你自己定的规矩`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 268">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">sort 的全部本领，就是反复问这一句</text>
  <g font-size="12" fill="#26405a">
    <rect x="16" y="36" width="150" height="40" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
    <text x="91" y="53" text-anchor="middle" font-weight="700">std::sort</text>
    <text x="91" y="69" text-anchor="middle">只会问 a &lt; b</text>
    <path d="M170 56 H214" stroke="#57677c" stroke-width="2.5"/><polygon points="214,56 204,50 204,62" fill="#57677c"/>
    <text x="220" y="52">这一句谁来回？</text>

    <rect x="222" y="66" width="132" height="34" rx="8" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/>
    <text x="288" y="82" text-anchor="middle" fill="#1d7a3c">int：语言自带</text>
    <text x="288" y="96" text-anchor="middle">3 &lt; 5 真</text>
    <rect x="366" y="66" width="132" height="34" rx="8" fill="#fdece1" stroke="#b8500f" stroke-width="1.5"/>
    <text x="432" y="82" text-anchor="middle" fill="#b8500f">Score：没人答</text>
    <text x="432" y="96" text-anchor="middle">编译不过</text>
    <rect x="500" y="66" width="124" height="34" rx="8" fill="#eaf3fb" stroke="#00599c" stroke-width="2"/>
    <text x="562" y="82" text-anchor="middle" fill="#00599c">写了 operator&lt;</text>
    <text x="562" y="96" text-anchor="middle">按 rate 定先后</text>

    <text x="16" y="128" font-weight="700">写完之后，这一列数据在 sort 眼里就成了这样</text>
    <rect x="16" y="138" width="150" height="28" rx="6" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/>
    <text x="91" y="157" text-anchor="middle">英语 5% · 数学 100% · C++ 83%</text>
    <path d="M170 152 H212" stroke="#57677c" stroke-width="2.5"/><polygon points="212,152 202,146 202,158" fill="#57677c"/>
    <rect x="218" y="138" width="200" height="28" rx="6" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/>
    <text x="318" y="157" text-anchor="middle">英语 5% → C++ 83% → 数学 100%</text>
    <text x="430" y="157" fill="#1d7a3c" font-weight="700">谁排前面由你的规则说了算</text>

    <rect x="16" y="184" width="608" height="42" rx="8" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1"/>
    <text x="30" y="202" fill="#33465e">同一句问话，max 要问、红黑树容器要问、二分查找也要问 —— 规则跟着类型走一次，它们全都认。</text>
    <text x="30" y="220" fill="#33465e">代价是回答必须讲道理：a 不小于 a，先后要能传递。写反了不报编译错，运行时才崩。</text>
    <text x="16" y="252" fill="#00599c" font-weight="700">一句话记法：sort 不认识你的类，它只认识你交给它的那句「小于吗」。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `教一次、全体受益，这句话在这门课里是有具体名单的：第 105 课的 sort 问它，第 107 课的 max 与 minmax_element 问它，第 100 课的 set 靠它决定谁在前谁算重复，第 106 课的二分查找也要它来划左右。你不必在任何一处再补一句「请按完成率排」—— 规则钉在类型上，走到哪儿跟到哪儿。` },
        { t: `p`, text: `代价也得摊开：**一类只有一份规矩**。哪天你想按名字长度排、按还剩多少个排，这份 operator< 就不合用了，那种场合回头给 sort 传第 105 课那种 lambda 比较器才对。取舍一句话：这个口径就是这个类型的默认顺序，就写 operator<；只是这一处想换个说法，就传 lambda。源稿那句「教会一次，所有要比的算法全都自动认识它」，说的正是前一半。` },
        { t: `h2`, text: `演示 1 · 源稿这段：写一次，sort 直接能用` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <string>
#include <algorithm>
#include <utility>
class Score {
public:
    Score(std::string name, int done, int total)
        : name_(std::move(name)), done_(done), total_(total) {}
    double rate() const { return static_cast<double>(done_) / total_; }
    bool operator<(const Score& o) const { return rate() < o.rate(); }   // 教它比大小
    std::string name_;                     // 演示用：先放 public
    int done_, total_;
};` },
        { t: `code`, lang: `c++`, code: `#include <print>       // 与上一段是同一个文件，这里只列 main 要用的
#include <vector>
#include <algorithm>
int main() {                          // 接上一段的 Score
    std::vector<Score> v = {{"英语", 300, 5500}, {"数学", 30, 30}, {"C++", 10, 12}};
    std::sort(v.begin(), v.end());
    for (const auto& s : v) std::println("{:<4} 完成率 {:.0f}%", s.name_, s.rate() * 100);
}` },
        { t: `p`, text: `实测三行输出是：英语 5%、C++ 83%、数学 100%，按完成率升序。main 里没有一个字节提到「按什么排」，sort 就是会。顺手看一眼对齐：那个 {:<4} 给 C++ 那行补出了两个空格，而两个汉字的英语只补了一个 —— 这台编译器上的宽度是按**字节**算的，汉字一个占 3 字节，早就超过 4 了。想让汉字真对齐是后面讲文本处理的课的正事，今天先把注意力放在重载上。` },
        { t: `p`, text: `再看 operator< 的函数体：它调的是 rate()，一个只读方法。这句能成立，靠的是上一课那条规矩 —— const 方法里只能调 const 方法。类内部这几行处处都在用第 114 课，你会发现它不是可选项。` },
        { t: `h2`, text: `演示 2 · 把算法问的那一句拿到明面上` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <algorithm>
#include <string>
#include <utility>
int main() {                          // 接演示 1 的 Score
    Score a("英语", 300, 5500), b("数学", 30, 30);
    std::println("a < b 是 {}", a < b);
    std::println("大的那个是 {}", std::max(a, b).name_);
}` },
        { t: `p`, text: `输出 a < b 是 true，然后 大的那个是 数学。第二行值得多看一眼：std::max 完全不知道什么是完成率，它只是把两个对象拿去问「小于吗」。你在 main 里亲手写下 a < b 时，调起的跟 max 里用的是同一个函数 —— 这就是「规则跟着类型走」的全部秘密，算法和你的代码问的是同一张嘴。` },
        { t: `h2`, text: `演示 3 · 本课任务：再写一个 operator==` },
        { t: `code`, lang: `c++`, code: `    bool operator==(const Score& o) const { return name_ == o.name_; }   // 名字相同就算相等` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <algorithm>
int main() {                          // 接上段：类里已加 operator==
    std::vector<Score> v = {{"英语", 300, 5500}, {"数学", 30, 30}, {"C++", 10, 12}};
    std::sort(v.begin(), v.end());
    std::println("排完 v0 == v1 是 {}", v[0] == v[1]);
    Score again("英语", 100, 100);
    std::println("同名的两个对象：{}", v[0] == again);
}` },
        { t: `p`, text: `实测输出：排完 v0 == v1 是 false，同名的两个对象 true。第一行别当成 bug —— 排完之后 v[0] 是英语、v[1] 是 C++，名字不同自然不等；要看到 true 得拿两个同名的对象比，源稿那句任务写的正是「打印 v[0] == v[1]」，跑一遍你会顺手记住排序后的顺序长什么样。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把 operator< 写成 <=，或者写成任何让「a < a」成立的样子。这是本课唯一会**运行时才炸**的坑：实测两百个含重复值的元素交给 sort，直接段错误，核心已转储。根子在算法信了你的回答有道理。写完自检两句：自己跟自己比必须是假；如果 a 在 b 前、b 在 c 前，那 a 必须在 c 前。`,
          `后面的 const 忘了标。sort 实测照样编译过 —— 它拿到的对象不是只读的。坑在别处：一旦你想在收 const Score& 的函数里比两个对象，报错立刻来，passing 'const Score' as 'this' argument discards qualifiers，正是上一课那句话。比较当然不改对象，标上 const 天经地义。`,
          `写了一个 operator< 就以为 >、>= 全送。实测本机 g++ 不会送：a > b 报 no match for operator>。!= 确实由 operator== 合成出来，实测可用。但别把程序建在编译器的好心上 —— 要别的口径就明写，或者干脆只在算法里用「小于吗」这一个问句。`,
          `< 和 == 用的是两套标准。源稿就是这个形状：小于比的是完成率，相等比的是名字。后果实测得很具体：英语 300/5500 和英语 7/10 按名字算相等，按小于的规则却是两个不同的位置 —— 进 set 存了两个，unique 又只挨着才去得掉。一个类型的「相等」和「排在前后」必须说同一件事，不然每一样算法都按自己的理解跑偏。`,
          `在 operator< 里顺手打印、改状态、或者返回一个不是真假的东西。比较函数是被人反复调用的，它一次只该回答一个问题；里面任何副作用都会在排序过程中出现几十次，你会得到一个跑起来莫名奇怪的程序。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `再写一个 operator==：科目名相同就算相等，然后打印 v[0] == v[1] —— 先想想排完序之后 v[0] 和 v[1] 分别是谁，再跑。`,
          `把 operator< 里的规则换成「按还剩的个数少者在前」，重跑演示 1，看三行顺序怎么变，并确认 sort、max 都不用改一个字。`,
          `延伸一：故意把 operator< 写成 <=，用两百个元素跑一次 sort，看清它是怎么崩的；然后改回来，把「自己不小于自己」这句自检记牢。`,
          `延伸二：把演示 1 的 vector 换成 std::set<Score> 再遍历一次，确认是同一个 operator< 在决定顺序；然后回答：这个 set 会按名字把同名对象当成重复吗？`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：运算符重载就是把 a < b 这一句翻译成你自己的一段函数；规则交给类型一次，sort、max、set、二分全跟着走 —— 前提是回答要讲道理，a 不小于 a，且和 operator== 用同一套标准。` }
      ]
    },
    {
      id: `m116`, title: `第 116 课 · 继承与 override：孩子说「父亲有的我全有，再改一部分」`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会用 class Circle : public Shape 继承一个类，用 virtual 让方法可以被改写，用 override 让编译器替你确认「真的改对了」。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `前三课都在把**一个**类写好。本课换个问题：手上已经有 Shape，现在要一个 Circle，怎么办？最省事的做法是把 Shape 复制一份改两行 —— 代价是从此两份代码各改各的，同一件事能在两个地方错出两种样子。继承说的是另一件事：**Circle 是一个 Shape**，父亲有的我全有，再改一部分。写下来只有几个字：class Circle : public Shape。` },
        { t: `p`, text: `冒号后面那个 public 是继承方式，读作「Circle 对外就是个 Shape」：拿住一个 Circle，就能用 Shape 公开的接口。别的继承方式以后再讲，今天见到的都写 public。` },
        { t: `code`, lang: `text`, code: `class Shape  { public: virtual double area() const { return 0.0; } };   ← 父亲：欢迎孩子改写
class Circle : public Shape {                                          ← 孩子：我就是一个 Shape
    double area() const override { return 3.14159265 * r_ * r_; }      ← 改写 + 请编译器查账
};` },
        { t: `p`, text: `两个关键字各管一头。基类的 virtual 说「这个方法允许被改写」；孩子的 override 说「我这一行就是在改写，请你检查」。为什么非要检查？因为 C++ 判「改写」的办法很朴素：**名字、参数、const 全部对得上才算**，差一点就只是你新写了一个方法，父亲那份签名还站在原地。程序照样编译、照样跑，只是没人调用你写的那份。` },
        { t: `svg`, caption: `容器里存的是一张张 Shape 的手，循环里只有一句 s-&gt;area()。编译期这一句只认 Shape 的名字，运行时每张卡走的是自己那一族的算法 —— 这就是 virtual 买到的东西`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 272">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">同一句问话，两个实现各自作答</text>
  <g font-size="12" fill="#26405a">
    <rect x="16" y="36" width="240" height="66" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
    <text x="136" y="54" text-anchor="middle" font-weight="700">shapes：一排指向 Shape 的手</text>
    <rect x="30" y="64" width="100" height="28" rx="6" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/>
    <text x="80" y="83" text-anchor="middle">Circle 半径 2</text>
    <rect x="140" y="64" width="100" height="28" rx="6" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/>
    <text x="190" y="83" text-anchor="middle">Square 边长 3</text>
    <text x="136" y="120" text-anchor="middle">循环里只有一句 s 指着的 area()</text>

    <path d="M262 79 H316" stroke="#57677c" stroke-width="2.5"/><polygon points="316,79 306,73 306,85" fill="#57677c"/>
    <rect x="322" y="52" width="150" height="54" rx="8" fill="#f2e9fb" stroke="#6b3fa0" stroke-width="2"/>
    <text x="397" y="72" text-anchor="middle" font-weight="700" fill="#6b3fa0">查这张卡自己的</text>
    <text x="397" y="92" text-anchor="middle">virtual 说：等运行时再定</text>

    <path d="M478 66 H520" stroke="#1d7a3c" stroke-width="2.5"/><polygon points="520,66 510,60 510,72" fill="#1d7a3c"/>
    <path d="M478 92 H520" stroke="#b8500f" stroke-width="2.5"/><polygon points="520,92 510,86 510,98" fill="#b8500f"/>
    <rect x="526" y="52" width="98" height="28" rx="6" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/>
    <text x="575" y="71" text-anchor="middle">派 3.14 r r</text>
    <rect x="526" y="78" width="98" height="28" rx="6" fill="#fdece1" stroke="#b8500f" stroke-width="1.5"/>
    <text x="575" y="97" text-anchor="middle">派 边长平方</text>

    <rect x="16" y="150" width="608" height="60" rx="8" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1"/>
    <text x="30" y="170" fill="#33465e">加第三个图形：新写一个类、往 shapes 里塞一个 —— 循环、打印、容器声明，一个字都不动。</text>
    <text x="30" y="190" fill="#33465e">反过来，孩子那一行没改对签名，父亲的实现就还在原地等着被调用，而编译器不拦。</text>
    <text x="16" y="234" fill="#b8500f" font-weight="700">override 就是补上「拦」这一下：它不改任何行为，只把「我以为改了」变成一句报错。</text>
    <text x="16" y="258" fill="#33465e">代价也要说清：父亲的方法一改，所有孩子跟着受影响，所以只有「孩子确实是一个父亲」时才继承。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `继承要买的东西是「一段代码管一批长得像的类型」。源稿 main 的形状就是这个：容器存 Shape，循环里只有 s->area() 一句，你再加一个 Square，容器、循环、打印一个字都不动。同一句问话、各答各的，业内叫多态，本课先把它用起来。` },
        { t: `p`, text: `virtual 与 override 不是为省事而生的，是为**改代码的那个人**生的。基类哪天把 area 改了名、孩子忘了跟，写了 override 的那一行当场报错，你立刻看见；没写的，程序一路绿灯跑出 0.00。第 113 课不让对象半空着出生，第 114 课让只读的方法不能动手，本课让「我以为改了」这件事在编译期露馅 —— 三课是同一种口味的三件工具。` },
        { t: `h2`, text: `演示 1 · 源稿这段：一个父亲、一个孩子、一排指针` },
        { t: `code`, lang: `c++`, code: `class Shape {
public:
    virtual ~Shape() = default;                    // 基类析构要 virtual，见常见坑
    virtual double area() const { return 0.0; }    // virtual：欢迎孩子改写
};
class Circle : public Shape {                      // Circle 是一个 Shape
public:
    Circle(double r) : r_(r) {}
    double area() const override { return 3.14159265 * r_ * r_; }
private:
    double r_;
};` },
        { t: `code`, lang: `c++`, code: `#include <print>       // 接上一段那两个类
#include <memory>
#include <vector>
int main() {
    std::vector<std::unique_ptr<Shape>> shapes;          // 存的是指向 Shape 的手
    shapes.push_back(std::make_unique<Circle>(2.0));
    shapes.push_back(std::make_unique<Circle>(1.0));
    for (const auto& s : shapes) std::println("圆的面积 = {:.2f}", s->area());
}` },
        { t: `p`, text: `实测两行：圆的面积 = 12.57，圆的面积 = 3.14。第 78 课学过的智能指针在这里干一件新事 —— 容器装的是 unique_ptr<Shape>，而 make_unique<Circle> 造出来的是 Circle，一个 Circle 可以交给 Shape 的手。s->area() 那句在编译期只知道自己手里是 Shape，运行时跑的却是 Circle 那份 —— 这个「等到运行时再定」就是 virtual 买到的东西。` },
        { t: `h2`, text: `演示 2 · 本课任务：把 override 删掉，再故意拼错名字` },
        { t: `code`, lang: `c++`, code: `class Circle : public Shape {
public:
    Circle(double r) : r_(r) {}
    double aer() const override { return 3.14159265 * r_ * r_; }   // area 拼成 aer
private:
    double r_;
};` },
        { t: `p`, text: `两种结局都实测过。**留着 override**，编译器一句话点穿：'double Circle::aer() const' marked 'override', but does not override。**把 override 删掉**，编译一路通过，跑出来是两行 圆的面积 = 0.00 —— 你写的那个 aer 没人调用，s->area() 拿到的还是基类那句 return 0.0。源稿说「老写法没这层保险」，一点没夸张。把参数写成 area(int) const override 也是同一句话报错：改写要名字、参数、const 三项全对上，缺一个就不算。` },
        { t: `h2`, text: `演示 3 · 第二个孩子：循环一个字都不改` },
        { t: `code`, lang: `c++`, code: `class Square : public Shape {                 // 再接一个正方形
public:
    Square(double side) : side_(side) {}
    double area() const override { return side_ * side_; }
private:
    double side_;
};` },
        { t: `code`, lang: `c++`, code: `#include <print>       // 接前面三个类
#include <memory>
#include <vector>
int main() {
    std::vector<std::unique_ptr<Shape>> shapes;
    shapes.push_back(std::make_unique<Circle>(2.0));
    shapes.push_back(std::make_unique<Square>(3.0));
    for (const auto& s : shapes) std::println("面积 = {:.2f}", s->area());
}` },
        { t: `p`, text: `实测输出 面积 = 12.57 然后 面积 = 9.00。同一次遍历、同一句 s->area()，第一个格子走到 Circle 的 π r 平方，第二个走到 Square 的边长平方。以后要加 Triangle，动的只有 Triangle 那一个类和那一句 push_back —— 这就是本课开头说的「一段代码管一批类型」到手的样子。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `孩子改写方法却不写 override。实测后果很安静：拼错的 aer 让程序照跑，两行面积全是 0.00，报错一个都没有。习惯只有一条：**孩子动父亲的方法，一律在后面写 override**，让编译器替你盯签名。`,
          `基类方法忘了标 virtual，孩子又没写 override —— 这个组合是静悄悄的。实测把 Shape 的 area 去掉 virtual、Circle 那句照旧不带 override，两个圆都算出 面积 = 0.00：没有 virtual，实现就在编译期按「手里是什么类型」定死，Shape 的手只问得到 Shape 那一份。好消息是 override 把这条也顺手堵上了：父亲不 virtual 而孩子在签名里写了 override，编译器照样报 marked 'override', but does not override；孩子自己漏了那个 const，报的还是同一句。`,
          `基类析构不带 virtual —— 源稿那行注释点的是这件事，也是继承里最贵的一个坑。实测：析构不带 virtual 时，把 Circle 交给 unique_ptr<Shape> 收着，程序只打印 清理 Shape，孩子那句 清理 Circle 根本没跑；带上 virtual 就是先 清理 Circle 再 清理 Shape。而且连 -Wall 都没给一句提示。规矩背下来：**打算被继承的类，析构写 virtual。**`,
          `以为孩子能看见父亲的 private。源稿把 Shape 整个摆在 public 下，那是演示的偷懒写法：正经类里数据照第 112 课锁 private，只把方法开放。基类的 private 成员，孩子在类里直接写是报错的。真要让孩子用，就通过父亲留下的公开方法走。`,
          `把继承当「省几行复制」用。父亲的行为一改，所有孩子一起受影响，这可不是省事的买卖。判断只问一句：这个关系是不是「孩子是一个父亲」？Circle 是 Shape —— 该继承；Circle 里有个「颜色」—— 那叫把成员放进去，不是继承。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把 override 删掉再故意把 area 拼成 aer，对比有无 override 时编译器的反应，然后跑一次看输出，说清那两行 0.00 是从哪句来的。`,
          `照演示 3 再加一个 Triangle：两条直角边当参数，area() const override 算直角三角形面积，塞进同一个 shapes 里遍历，确认循环一行没改。`,
          `延伸一：把 Shape 的 area 前面的 virtual 删掉，看 Circle 那行 override 的报错长相；再加回来，确认面积数字恢复。`,
          `延伸二：把基类析构的 virtual 删掉，在两个类的析构里各打印一句话，跑一遍数清哪句没打出来；改回来再跑一次。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：class Circle : public Shape 说的是「孩子是一个父亲」；virtual 让方法等到运行时才定实现，override 让「我以为改了」当场报错；打算被继承的类，析构必须 virtual。` }
      ]
    }
  ]
};
