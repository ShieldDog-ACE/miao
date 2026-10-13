/* 喵站 · C++ 入门 正文分部 p16：第 67–70 课（第九轮 · const 引用 + 默认参数 + 重载 + 引用当答案格）
 *
 * 源稿：学习资料/C++入门/67_const引用读大对象的标准姿势、68_默认参数不传就用备用值、
 *       69_函数重载一名多用、70_多个结果引用参数当答案格。
 * 款式照 p13、p01 样板：tip 蓝·本课目标 → 原理讲解 → 它被设计成什么样 → 演示 1/2/3 → 常见坑 → 任务 → tip 绿·本课一句话
 *
 * 闸线备忘（本批必须守住的）：
 *   本课段已过：函数定义、调用链、引用基础、引用参数、const 引用、默认参数、重载。
 *   往后才教、一律不露：指针声明（74 课）、new 与 delete（76）、智能指针（78）、struct（83）、class（112）。
 *   正文一律不写半角圆括号：函数名裸写，补充说明用中文括号；交叉引用只往回指。
 *   输出统一走 std::println，头文件按 H 闸请齐。
 *
 * 验收：node dev/tools/cpp-audit.cjs --part dev/frontend/assets/data/cpp/p16.js
 *       node dev/tools/cpp-exam-check.cjs --only c67,c68,c69,c70
 */
window.MIAO_CPP_P16 = {
  chapters: [
    {
      id: `c67`, title: `第 67 课 · const 引用：读大对象的标准姿势`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把「只读一个大对象」写成标准姿势 —— 类型前面挂 const、后面挂 &，既不复印一整本书，又当场向编译器保证我不碰它一根手指头。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 58 课你认识了引用是给变量起外号，第 60 课把这只外号搬进了函数参数：形参是原件的外号，函数里一改，外面跟着变。两块拼起来还差一块：如果我只是想看一眼，不想改，也不想抄呢？先算算「看一眼」的代价。第 40 课那串 std::vector<std::string> 名单，或者第 13 课那一整只 std::string 文章，递进按值传参的函数时，编译器会照原样再复制一只 —— 里面有一千个名字就复制一千个，函数跑完复印件就地报废，下一声喊它再抄一遍。你只是请人看一眼名单，却每次都给对方复印一整本，这是最亏的一种开销。` },
        { t: `p`, text: `const 引用把这笔开销一笔勾销。拆开读就不玄了：& 那半是「我不造新盒子，把原件的外号给你」，一个字节都不抄；const 那半是「这份外号只许看，不许动」，你给它赋值、往里塞东西，编译器当场拦下。合起来就是那条能看不能摸的参观通道。源稿那句口诀讲得最干脆 —— 只读就 const &，要改才用裸 &，小整数随便传值。` },
        { t: `p`, text: `最后那半句和前半句同样重要。int、double、bool 本来就一个机器字大小，抄一份的代价跟递外号差不多；而且它天生干净 —— 传值进去，函数里怎么折腾都碰不到外面。所以别把 const 引用当万能写法：装得下几个字节的小东西，直接传值最省心。` },
        { t: `ul`, items: [
          `**什么时候用 const 引用**：参数是 std::vector、std::string 这类装得下一堆东西的盒子，而函数只读不写 —— 本课的主场。`,
          `**什么时候用裸引用**：函数要往原件上写结果，像第 60 课那样。这时候不能加 const，加了就是明说不许写，你的赋值会被拦。`,
          `**什么时候直接传值**：int、double、bool 这些小手头东西，或者你本来就想给对方一份能随便改的复印件。`,
          `**怎么读那一串**：const 贴着类型，& 也贴着类型，读作「一个只许看的、某类型的别名」。三个词是一块儿的，别拆开来记。`
        ]},
        { t: `svg`, caption: `上面一条路：按值传参，喊一声就复印一整本，用完报废；下面一条路：const 引用递过去的是外号，隔着玻璃看得清，就是摸不到`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 310" font-family="sans-serif">
  <text x="20" y="24" font-size="14" font-weight="700" fill="#b8232f">按值传参：只读也要抄一整本</text>
  <rect x="24" y="40" width="160" height="62" rx="8" fill="#eaf2fb" stroke="#00599c" stroke-width="2"/>
  <text x="104" y="62" font-size="12" font-weight="700" fill="#00599c" text-anchor="middle">外面的名单</text>
  <text x="104" y="84" font-size="12" fill="#142639" text-anchor="middle">1000 个名字</text>
  <line x1="184" y1="71" x2="256" y2="71" stroke="#b8232f" stroke-width="2"/>
  <polyline points="248,65 256,71 248,77" fill="none" stroke="#b8232f" stroke-width="2"/>
  <text x="220" y="60" font-size="12" fill="#b8232f" text-anchor="middle">复印</text>
  <rect x="262" y="40" width="170" height="62" rx="8" fill="#fdf0e6" stroke="#b8232f" stroke-width="2"/>
  <text x="347" y="62" font-size="12" font-weight="700" fill="#b8232f" text-anchor="middle">函数里的复印件</text>
  <text x="347" y="84" font-size="12" fill="#142639" text-anchor="middle">又是 1000 个名字</text>
  <rect x="452" y="40" width="164" height="62" rx="8" fill="#f4f7fc" stroke="#c3ccd8" stroke-width="1.5"/>
  <text x="534" y="62" font-size="12" fill="#57677c" text-anchor="middle">函数返回　报废</text>
  <text x="534" y="84" font-size="12" fill="#57677c" text-anchor="middle">下一声喊它　再抄</text>
  <text x="20" y="146" font-size="14" font-weight="700" fill="#2e7d32">const 引用：递过去一个只读外号</text>
  <rect x="24" y="162" width="160" height="62" rx="8" fill="#eaf2fb" stroke="#00599c" stroke-width="2"/>
  <text x="104" y="184" font-size="12" font-weight="700" fill="#00599c" text-anchor="middle">外面的名单</text>
  <text x="104" y="206" font-size="12" fill="#142639" text-anchor="middle">1000 个名字</text>
  <line x1="184" y1="193" x2="256" y2="193" stroke="#2e7d32" stroke-width="2" stroke-dasharray="6 4"/>
  <polyline points="248,187 256,193 248,199" fill="none" stroke="#2e7d32" stroke-width="2"/>
  <text x="220" y="182" font-size="12" fill="#2e7d32" text-anchor="middle">外号</text>
  <rect x="262" y="162" width="170" height="62" rx="8" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2.5"/>
  <text x="347" y="184" font-size="12" font-weight="700" fill="#2e7d32" text-anchor="middle">只读通道　抄 0 个</text>
  <text x="347" y="206" font-size="12" fill="#142639" text-anchor="middle">读每一格：合法</text>
  <rect x="452" y="162" width="164" height="62" rx="8" fill="#fdf0e6" stroke="#b8232f" stroke-width="2"/>
  <text x="534" y="184" font-size="12" fill="#b8232f" text-anchor="middle">写一下、塞一个</text>
  <text x="534" y="206" font-size="12" fill="#b8232f" text-anchor="middle">编译器当场拦下</text>
  <text x="20" y="252" font-size="12" font-weight="700" fill="#00599c">口诀</text>
  <text x="20" y="272" font-size="12" fill="#142639">只读就 const &amp;，要改才用裸 &amp;，小整数随便传值。</text>
  <text x="20" y="294" font-size="12" fill="#57677c">一句判断：这一声喊出去，究竟多造了几只盒子？按值多造一整本，const 引用一只都不多。</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `为什么把「我只看不改」这句话交给编译器盯着，而不是靠自觉？因为几百行的项目里这句承诺守不住：写着写着顺手往里塞一个元素，这种改动当时看着无害，出了错极难查。C++ 的取向是把约定写进类型里：const std::vector<std::string>& 这只参数一声明，读它合法、写它编译不过，口头承诺升级成编译期检查。调用的一方只看函数头就能放心：这个函数动不了我的名单。` },
        { t: `p`, text: `还有个设计味道在 const 的位置上：它贴着类型，说的是「顺着这份外号看过去，那一格不许写」，而不是外面那只盒子本身带不带 const。原件明明可写，函数却只拿到一份只读外号 —— 门锁着，钥匙仍在主人手里，这就是参观通道四个字的准确含义。` },
        { t: `h2`, text: `演示 1 · 源稿现场：名单只看、不抄` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <vector>
void show(const std::vector<std::string>& names) {   // 只读，不复制
    for (const std::string& n : names) {
        std::println("你好, {}", n);
    }
}
int main() {
    show({"小明", "小红", "小刚"});
    return 0;
}` },
        { t: `p`, text: `三行你好，一个名字也没抄。这一小段里两处 const 引用各司其职：外面那处管整本名单，函数拿到的是外号，复制量为零；里面那处管名单里每一只 std::string —— for 那句若写成 auto n : names，每转一圈就把一个名字完整复制一遍，换成 const std::string& 才是「念名字、不抄名字」。调用处那句花括号初值也留意一下：第 55 课讲过，编译器照着参数类型当场造出名单，用完就丢。` },
        { t: `h2`, text: `演示 2 · 伸手摸一下？当场被拦` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
void try_it(const std::vector<int>& v) {
    int sum = 0;
    for (int x : v) sum += x;        // 读：随便
    // v[0] = 99; 和 v.push_back(7); // 写和塞：都编译不过
    std::println("合计 {}", sum);
}
int main() {
    std::vector<int> scores = {85, 92};
    try_it(scores);
    std::println("外面还是 {} 和 {}", scores[0], scores[1]);
    return 0;
}` },
        { t: `p`, text: `输出是 合计 177 和 外面还是 85 和 92 —— 「只读」在这里不是美德，是被编译期钉死的事实。把注释里任一句放开，报错大致长这样：error: cannot assign to variable 'v' being const-referenced，或者带 read-only 那类措辞。根因不是找不到那个方法，而是这只外号天生带只读属性，写动作一律轮不到它。` },
        { t: `h2`, text: `演示 3 · 三种带法同框` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <vector>
int total_len(const std::vector<std::string>& names, int bonus) {
    return bonus + names.size();     // 名单只读：一个名字都不抄
}
void shout(std::string& name) { name = name + "！！"; }   // 要改原件才用裸引用
int main() {
    std::vector<std::string> names = {"小明", "小红"};
    std::println("格子数 {}", total_len(names, 10));
    shout(names[0]);
    std::println("第一位现在是 {}", names[0]);
    return 0;
}` },
        { t: `p`, text: `三句口诀在这里各有对应：bonus 是个 int，按值传，函数里爱怎么折腾怎么折腾；names 是名单，只取个数量，走 const 引用，零复制；真要改掉第一个名字的 shout 才用裸 std::string& —— 它写的就是名单第一格。跑出来是 格子数 12 和 第一位现在是 小明！！：传值的改不动外面，裸引用的一下就改到了，判题标准就是这么直白。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `**只读却漏了 const**：函数头写 std::vector<int>& v，能编译，可你把一只 const 名单递进去就报错 —— cannot bind non-const lvalue reference。根因：裸引用开口承诺「我要改原件」，只读的东西配不上这份承诺。`,
          `**外层带 const，循环里却写 auto n : names**：不报错，只是每转一圈抄一个名字，本课最隐蔽的浪费。根因：参数上那个 const 管不到你自己新造的盒子。循环变量也写成 const std::string&。`,
          `**类型对不上**：const std::vector<std::string>& 收不了 std::vector<int>，报 no matching function for call to 'show'。外号得同一种类型才挂得上，别以为只读就能将就。`,
          `**临时造出来的名单配不上裸引用**：当场用花括号造一只名单直接递过去，参数是裸引用就被拦 —— 临时的东西不许当可写原件的本人；带上 const 就通了。源稿那句 show 递花括号初值能跑，靠的正是这一点。`,
          `**给 int 也硬加 const 引用**：const int& x 合法，但便宜一点不占，还当自己多在意那点开销。一个机器字装得下的东西，老老实实传值。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `1. 写 double average（const std::vector<int>& v）求平均分，递一串分数进去打印出来`,
          `2. 延伸：把演示 1 里循环那句改成 auto n : names，看它报不报错，再回答自己：为什么「能跑」在这里反而不算过关？`,
          `3. 延伸：给 average 再加一个 int bonus 参数按值传进去，把奖励分算进平均分。写完想一想：如果这只函数除了平均分，还想同时告诉你最高分，return 一次只拎得走一个值 —— 这个麻烦再过两课就有解，先记在心里。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：只读大对象就写 const 引用 —— & 让你一份都不抄，const 让你一根手指都动不了，两个词一起才叫标准姿势。` }
      ]
    },
    {
      id: `c68`, title: `第 68 课 · 默认参数：不传就用备用值`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：在函数头里给参数预留一个备用值 —— 调用方不说就按默认来，说了才照他说的改；顺手记住那条硬规矩：带备用值的参数必须排在参数表最后。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 51 课起你写的函数，参数表里每一位都是「必须给」的：喊一声就得把每个格子填满，少一个就是 no matching function for call to。可现实里很多调用有一大半是重复的：greet 这只函数，十个学生里九个的称呼都是「同学」，你却要在每一处调用里把「同学」重打一遍，还打第十遍。默认参数治的就是这份啰嗦 —— 函数头那句 std::string title = "同学" 里，等号后面那位就是备用值：调用处递了就用他递的，没递，编译器把它填进那个格子。源稿的类比很准：像点奶茶默认正常糖，不说就按默认来，说了才照你改。` },
        { t: `p`, text: `这里有个观念要摆正：备用值不是函数身体里那句 if。你不需要在函数里判断「调用方到底给没给」，也不需要拿一个空串当哨兵去猜 —— 省略这件事在编译那一刻就办完了，编译器替你写好了那一份实参，函数收到的永远是一个完整的、有值的参数。所以函数体里读 title，读到 同学 和读到 王 是完全一样的两桩事，没有哪一路是「补救出来的」。这一点想通了，默认参数就从一个特性变成一种手感：调用处越写越短，函数体一行没多。` },
        { t: `p`, text: `省的位置有讲究：只能从右边开始连续省。参数表 甲 乙 丙，丙有备用值，你可以只递甲乙、也可以只递甲、还可以一个都不省，但不能「递甲和丙、跳过乙」—— 编译器按位置对齐格子，你少递一个它就认定你省的是最后那个。所以写函数时要把可有可无的那几位排到最后，必填的排在前面，这是接口设计里一个很小的规矩，用起来却是天天受益。` },
        { t: `ul`, items: [
          `**备用值写在函数头**：等号跟着参数，一次写好；调用处只管递或者不递，不要在那儿重复写等号。`,
          `**必须排在最后**：无备用值的在前，有备用值的在后，中间不许插队。`,
          `**省略只能连续从右往左**：想省中间那位，就得把右边几位一起给满，或者直接递到那一位。`,
          `**每位各自独立**：三个参数都带备用值时，可以省一个、省两个或者全省 —— 只要遵守从右往左那条。`
        ]},
        { t: `svg`, caption: `备用值住在函数头：调用处第二格空着，编译器就把「同学」填进去；两格都给满时，备用值就靠边站`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif">
  <text x="20" y="24" font-size="14" font-weight="700" fill="#142639">函数头：右边那位自带备用值</text>
  <rect x="24" y="40" width="196" height="58" rx="8" fill="#eaf2fb" stroke="#00599c" stroke-width="2"/>
  <text x="122" y="62" font-size="12" font-weight="700" fill="#00599c" text-anchor="middle">name</text>
  <text x="122" y="82" font-size="12" fill="#142639" text-anchor="middle">必须递　没有备用</text>
  <rect x="236" y="40" width="234" height="58" rx="8" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="353" y="62" font-size="12" font-weight="700" fill="#2e7d32" text-anchor="middle">title = 「同学」</text>
  <text x="353" y="82" font-size="12" fill="#142639" text-anchor="middle">备用值写在函数头</text>
  <text x="20" y="130" font-size="14" font-weight="700" fill="#b8232f">两种调用：同一只函数</text>
  <rect x="24" y="146" width="286" height="80" rx="8" fill="#fdf0e6" stroke="#b8232f" stroke-width="2"/>
  <text x="167" y="170" font-size="12" fill="#142639" text-anchor="middle">只递「小明」</text>
  <text x="167" y="190" font-size="12" fill="#b8232f" text-anchor="middle">第二格空着</text>
  <text x="167" y="212" font-size="12" font-weight="700" fill="#2e7d32" text-anchor="middle">填进「同学」→ 你好, 同学小明!</text>
  <rect x="330" y="146" width="286" height="80" rx="8" fill="#f4f7fc" stroke="#00599c" stroke-width="2"/>
  <text x="473" y="170" font-size="12" fill="#142639" text-anchor="middle">递「建国」和「王」</text>
  <text x="473" y="190" font-size="12" fill="#00599c" text-anchor="middle">两格都给满</text>
  <text x="473" y="212" font-size="12" font-weight="700" fill="#2e7d32" text-anchor="middle">备用值靠边站 → 你好, 王建国!</text>
  <text x="20" y="256" font-size="12" font-weight="700" fill="#00599c">一条硬规矩</text>
  <text x="20" y="276" font-size="12" fill="#142639">带备用值的必须排在参数表最后 —— 省略只能从右往左连续省。</text>
  <text x="20" y="294" font-size="12" fill="#57677c">想跳过中间那位？办不到：它右边的格子也得一起给满。</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `为什么不让调用方自己写全？因为「写全」的代价不是累，是吵。一个函数被喊两百处，其中一百八十处都在重复同一串字面量，读代码的人得在两百里反复确认那串是不是同一个意思；真要改默认口径，还得两百处翻一遍。备用值把这件事收拢成一处：改函数头那一句，所有省略了这一位的调用同时跟着变 —— 和第 55 课那句「要改门槛只碰 grade_of」是同一条思路。` },
        { t: `p`, text: `还有一层是接口的生长：你已经写好的函数被很多地方用着，现在想给它加一位「备注」，又不想让老调用全部编译不过 —— 给新加的那一位带上备用值，老代码一个字不改照样跑，需要备注的新代码再递上第三格。默认参数于是成了「函数会长大」的缓冲垫。它和下一课那种一名多用解决的是同一类麻烦，两把工具各有一处顺手，下一课摆在一起比。` },
        { t: `h2`, text: `演示 1 · 源稿现场：说不说都有得打` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
void greet(std::string name, std::string title = "同学") {
    std::println("你好, {}{}!", title, name);
}
int main() {
    greet("小明");              // 不指定 → title 用备用值 同学
    greet("建国", "王");         // 指定了 → 照你说的来
    return 0;
}` },
        { t: `p`, text: `两行输出：你好, 同学小明! 和 你好, 王建国!。第一句里编译器把 title 填成 同学；第二句你递满两格，备用值一句都插不上。name 没有备用值而 title 有 —— 顺序正好合规：必填的在前，可有可无的在后。` },
        { t: `h2`, text: `演示 2 · 本课任务：power 的备用次数` },
        { t: `code`, lang: `c++`, code: `#include <print>
int power(int base, int exp = 2) {
    int r = 1;
    for (int i = 0; i < exp; i = i + 1) r = r * base;
    return r;
}
int main() {
    std::println("平方：{}", power(5));
    std::println("十次方：{}", power(2, 10));
    std::println("再喊一次平方：{}", power(5));
    return 0;
}` },
        { t: `p`, text: `三行是 25、1024、25。power(5) 只递了一个数，exp 就用备用值 2，于是 5 自乘两次；power(2, 10) 递满了，就照你给的 10 次方算。这把函数喊了三次，备用值只在缺实参那两次出面 —— 前面说的「不是 if」在这里很好验证：函数体里压根没有「如果没传就怎样」那一句，它拿到的 exp 永远是实打实的 2 或者 10。平方是最高频的用法，所以把 2 留作备用；这正是选备用值的判断标准：哪个值最常被写第二遍，就让谁住进函数头。` },
        { t: `h2`, text: `演示 3 · 三位参数，省只能从右边省` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
void order(std::string dish, int count = 1, std::string note = "不要辣") {
    std::println("{} × {}，{}", dish, count, note);
}
int main() {
    order("包子");                      // 后两格都用备用值
    order("包子", 3);                   // 只省最右那格
    order("包子", 3, "多加醋");          // 一格都不省
    // order("包子", , "多加醋");        // 想跳中间：语法这关就过不了
    return 0;
}` },
        { t: `p`, text: `三行输出是 包子 × 1，不要辣、包子 × 3，不要辣、包子 × 3，多加醋。被注释掉的那一句值得你亲手放开跑一次：它不是「默认值不生效」，而是连语法都对不上 —— 实参表里不能留一个空位，编译器只认「从右往左连着少给几个」。所以如果你真心想让 note 可省而 count 必填，就把它俩在参数表里换个位置，规矩立刻顺了：接口怎么排，取决于哪一位更常被省略。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `**备用值排在必填的前面**：写 void f（int a = 1，int b），报错带 all parameters following this declaration shall have a default argument 那类字样。根因：编译器把「少给的」一律算成最右边那几个，中间插队就没法算。把带备用值的那位挪到最后。`,
          `**调用处想跳过中间那位**：把实参写成 递了第一个、空一格、再递第三个，得到 error: expected expression。根因：省略不是靠空位表示的，只能靠「少写」。要么把那一位居中改成必填，要么调整参数表顺序。`,
          `**在调用处又写一遍等号**：greet 那里写 小明, = "同学" 这类东西，语法直接崩。备用值属于函数头，调用处只能选「给」或者「不给」。`,
          `**以为备用值会跟着调用变**：不报错，纯想当然。备用值是函数头那一刻定的，两百处省略的调用用的都是同一串 —— 想因人而异就老实递实参，别指望它自己会看脸色。`,
          `**默认值和同名函数撞在一起**：同一件事写两套「能省」的接口，调用处一省略就两个都像能配，编译器报歧义。这个麻烦下一课开场正好遇到，本课先按下不表。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `1. 写 int power（int base，int exp = 2）：只递 base 就算平方，power 递一个 5 得 25；递 2 和 10 得 1024`,
          `2. 延伸：给 greet 再加第三格 int times = 1，让「喊几遍」也能省略；先写两遍调用，一遍只递名字、一遍把三格全递满。`,
          `3. 延伸：把演示 3 的 order 参数表调个顺序，让「备注」必填而「份数」可以省。调完之后用一句话说清：谁的备用值该排在更右边？`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：备用值住在函数头、必须排在最后 —— 调用方从右往左连着省略，编译器就照着填，函数体里一句 if 都不用写。` }
      ]
    },
    {
      id: `c69`, title: `第 69 课 · 函数重载：一名多用`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：让同一个名字管几套活儿 —— 编译器照你递进去的参数类型或者个数挑那一版，返回类型不参与挑选。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课末尾留了个没解决的麻烦：想让一只函数多接一位参数，又不想拆掉老调用，路不止一条。这一课给第二条 —— 重载。源稿那个类比先摆上：「打印」这个动词，打印照片、打印文档，做的事听上去一样，手里的材料不一样。你喊的时候不用先说「我要打印照片版」，打印机看你递进去的是胶卷还是纸，自己换路子。C++ 里写两遍 int twice 和 double twice，名字一模一样，参数表不一样，这就是重载：一个名字，几张面孔。` },
        { t: `p`, text: `编译器怎么挑？它只盯调用处那对实参：有几个、各是什么类型，然后到所有叫这个名字的函数里找能配上的。你递 7，那是个 int，整数版分毫不差，就选它；你递 2.5，那是 double，小数版才是正主。没有分毫不差的那一版，它才退一步做合法转换 —— 只有小数版时递个整数也收，整数会升到小数。挑的次序就两句：先找完全对得上的，再找勉强能转换的；两条都配不上，就是那句 no matching function for call to。` },
        { t: `p`, text: `有一条必须现在就钉牢：区分面孔的依据只有参数表，返回类型不算。你写 int twice（int x）和 double twice（int x），名字一样、参数也一样、只 return 的东西不同 —— 编译器在调用处根本还没走到看返回值那一步，无从分辨，直接报重定义。这条太符合直觉，所以错的人不少：明明两只函数还出来的东西不一样嘛。可惜挑活儿发生在进货那一刻，不在出货那一刻。` },
        { t: `ul`, items: [
          `**凭参数表认人**：类型不同、个数不同、或者顺序不同，都算不同的面孔；只有返回类型不同不算。`,
          `**名字要一模一样**：重载的意义就是让调用处只记一个动词，起两个名字就退回第 51 课那种手动分拣了。`,
          `**每一版都得先见后喊**：几套函数都写在调用它们的地方之前，编译器才有得挑 —— 规矩和第 55 课那条完全一样。`,
          `**头和上一课那条别混**：默认参数是「一张面孔，格子可以空着」；重载是「几张面孔，各收各的材料」。同一件麻烦，两种解法。`
        ]},
        { t: `svg`, caption: `同一个名字 twice 开三扇窗：整数递进来走整数窗，小数走小数窗，文字走字符串窗；挑哪扇看的是你手上拿的什么，不看它待会儿还什么`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320" font-family="sans-serif">
  <text x="20" y="24" font-size="14" font-weight="700" fill="#142639">一次调用：先看手上的东西，再挑活儿</text>
  <rect x="24" y="40" width="180" height="60" rx="8" fill="#eaf2fb" stroke="#00599c" stroke-width="2"/>
  <text x="114" y="62" font-size="12" font-weight="700" fill="#00599c" text-anchor="middle">调用处</text>
  <text x="114" y="82" font-size="12" fill="#142639" text-anchor="middle">递进去的几个实参</text>
  <line x1="204" y1="70" x2="262" y2="70" stroke="#57677c" stroke-width="2"/>
  <polyline points="254,64 262,70 254,76" fill="none" stroke="#57677c" stroke-width="2"/>
  <text x="233" y="60" font-size="12" fill="#57677c" text-anchor="middle">按类型配</text>
  <rect x="270" y="40" width="346" height="60" rx="8" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="443" y="62" font-size="12" font-weight="700" fill="#2e7d32" text-anchor="middle">名字都叫 twice 的几版函数</text>
  <text x="443" y="82" font-size="12" fill="#142639" text-anchor="middle">挑参数表完全对得上的那一版</text>
  <text x="20" y="132" font-size="12" font-weight="700" fill="#b8232f">三扇窗</text>
  <rect x="24" y="146" width="190" height="66" rx="8" fill="#fdf0e6" stroke="#b8232f" stroke-width="2"/>
  <text x="119" y="168" font-size="12" font-weight="700" fill="#b8232f" text-anchor="middle">整数窗</text>
  <text x="119" y="188" font-size="12" fill="#142639" text-anchor="middle">参数 int</text>
  <text x="119" y="204" font-size="12" fill="#57677c" text-anchor="middle">递 7　→ 还 14</text>
  <rect x="226" y="146" width="190" height="66" rx="8" fill="#f4f7fc" stroke="#00599c" stroke-width="2"/>
  <text x="321" y="168" font-size="12" font-weight="700" fill="#00599c" text-anchor="middle">小数窗</text>
  <text x="321" y="188" font-size="12" fill="#142639" text-anchor="middle">参数 double</text>
  <text x="321" y="204" font-size="12" fill="#57677c" text-anchor="middle">递 2.5　→ 还 5.0</text>
  <rect x="428" y="146" width="188" height="66" rx="8" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="522" y="168" font-size="12" font-weight="700" fill="#2e7d32" text-anchor="middle">文字窗</text>
  <text x="522" y="188" font-size="12" fill="#142639" text-anchor="middle">参数 std::string</text>
  <text x="522" y="204" font-size="12" fill="#57677c" text-anchor="middle">递 ab　→ 还 abab</text>
  <text x="20" y="244" font-size="12" font-weight="700" fill="#b8232f">不算数的那一条</text>
  <text x="20" y="264" font-size="12" fill="#142639">返回类型不参与挑窗：名字和参数表都一样、只是还出来的东西不同 —— 编译器认成重定义。</text>
  <text x="20" y="284" font-size="12" fill="#57677c">挑的次序：先找分毫不差的，再退一步做合法转换；都配不上就报 no matching function for call to。</text>
  <text x="20" y="306" font-size="12" fill="#57677c">上一课的默认参数是「一张面孔格子可以空」，本课是「几张面孔各收各的材料」。</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `为什么不逼你把名字起成 twice_int、twice_double？因为名字管的是意图，类型管的是材料。「把这份东西翻倍」是一个意图，三种材料 —— 硬要三个名字，读代码的人得先记住三张面孔其实是同一件事，这负担纯属白给。C++ 于是把「意图」交给名字、把「材料」交给参数表，调用处只写那个动词，材料自己会说话。这也是标准库里那些家伙都改名成一族统一动词的底气所在。` },
        { t: `p`, text: `至于编译器怎么做到不撞车：它在背后把名字和参数表编在一起，做成两个互不相干的内部符号，所以两版 twice 在机器里其实是两间不同的铺面，只是招牌一样。这套机制不用背，只要记住它的推论 —— 招牌一样，门面也必须一眼能看出不同，否则就是同一家铺子登记了两次，编译器当场判定重定义。` },
        { t: `h2`, text: `演示 1 · 源稿现场：整数版与小数版` },
        { t: `code`, lang: `c++`, code: `#include <print>
int twice(int x) { return x * 2; }        // 整数版
double twice(double x) { return x * 2.0; } // 小数版
int main() {
    std::println("twice 递 7 = {}", twice(7));
    std::println("twice 递 2.5 = {:.1f}", twice(2.5));
    return 0;
}` },
        { t: `p`, text: `两行是 14 和 5.0。同一个 twice 喊了两声，走的却是两间铺面：7 是个彻头彻尾的 int，配上整数版；2.5 天生是 double，配小数版。第二句那个格式串 {:.1f} 是让小数固定印一位，源稿原样留着 —— 你能看出它印的是 5.0 而不是 5，正好说明这一声走的是小数窗。` },
        { t: `h2`, text: `演示 2 · 本课任务：再加一扇文字窗` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
int twice(int x) { return x * 2; }
double twice(double x) { return x * 2.0; }
std::string twice(std::string s) { return s + s; }   // ab → abab
int main() {
    std::println("{}", twice(7));
    std::println("{:.1f}", twice(2.5));
    std::println("{}", twice("ab"));
    return 0;
}` },
        { t: `p`, text: `三行：14、5.0、abab。这就是源稿那条任务的答案，记得像它提醒的那样在文件顶部补一句 include string，否则 std::string 这个名字编译器压根不认识，报 no type named 'string' in namespace 'std'。第三声递的是一段文字，整数窗和小数窗都收不了文字，只有字符串窗配得上 —— 它按值收一只 std::string，把两只串拼一起还给你。顺带练一下第 67 课那条口诀：这里只读不写，参数换成 const std::string& 更划算。` },
        { t: `h2`, text: `演示 3 · 靠个数区分，顺便看看和默认参数撞车` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
void greet(std::string name) {                       // 一格
    std::println("你好, {}!", name);
}
void greet(std::string name, std::string title) {    // 两格
    std::println("你好, {}{}!", title, name);
}
int main() {
    greet("小明");
    greet("建国", "王");
    return 0;
}` },
        { t: `p`, text: `两行：你好, 小明! 和 你好, 王建国!。这两版名字相同、第一格也相同，靠的是个数不同 —— 同样合法，参数表不一样就算不同面孔。现在把上一课的钩子和这一课接上：如果你给第二版的 title 也加上备用值 同学，麻烦就来了 —— 喊 greet 只递一个名字时，一格的版本配得上，两格带备用值的版本也配得上，编译器挑不出唯一的，报 call to 'greet' is ambiguous。一句话记住：省事儿只能占一样，要么默认参数，要么重载，别叠在一起用。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `**只差返回类型**：两版名字和参数表完全一样，报错是 redefinition of 'twice'，或者那句说「只有返回类型不同不能重载」。根因：挑哪一版发生在配实参那一刻，返回类型还没登场。想让两版分开，改参数表。`,
          `**忘了补 include string**：写 std::string twice 那一版时报 no type named 'string' in namespace 'std'。源稿那句括号提醒就是这条 —— 用了什么头文件就得请进来，第 67 课那条 H 规矩在这儿照样生效。`,
          `**递进去的东西只有一版能勉强转换**：只有小数版时递个 int，能编译，值却悄悄升成了小数；你以为走的是整数逻辑，印出来带着小数点。根因：找不到完全匹配就退一步转换。要么补一版，要么在调用处把类型写明确。`,
          `**版本写在调用它的函数后面**：和 第 55 课 那个坑一个长相 —— use of undeclared identifier，编译器读到调用时还没登记过这个名字。几版全都摆到调用之前去。`,
          `**重载和默认参数叠着用**：call to 'greet' is ambiguous，报错只说「歧义」，不说哪一版多了备用值。根因见演示 3：一格版和两格带备用值的版，在只递一个名字时都能配上。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `1. 加一版 std::string twice（std::string s），让 ab 变 abab；记得在文件顶部补 include string`,
          `2. 延伸：再开一扇窗 —— 写一版 twice 收 const std::vector<int>& 名单，把每个数翻倍后返回成一串新名单，让 main 里三声喊各走一扇窗。`,
          `3. 延伸：把两版只差返回类型的 twice 写出来，亲眼看完那条 redefinition 报错，再改回靠参数区分。写完回答自己一句：为什么返回类型在这儿说不上话？`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：重载是同一个名字开几扇窗 —— 编译器按你递进去的类型和个数挑窗，返回类型不参与挑，所以两版必须靠参数表分出彼此。` }
      ]
    },
    {
      id: `c70`, title: `第 70 课 · 多个结果：引用参数当答案格`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：一份 return 只拎得走一个值，那就多备几只盒子递进去 —— 把裸引用参数当成答案格，函数往格子里写字，一次交出两份、三份结果。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 60 课你把引用搬进了参数表：形参是原件的外号，函数里一改，外面跟着变。当时用它改一个盒子，今天正式拿它交答案。源稿这只 stats 要交两份东西 —— 总分和最高分。return 只有一只手，一次只能拎一个值，你写两句 return 也没用，编译器执行到第一句就走了。老办法直接得很：调用处先把两只盒子摆好，把它们的「外号」一并递进去，函数负责往格子里写字。源稿那句「引用参数传进来的是原稿，爱写几份写几份」说的就是这件事。` },
        { t: `p`, text: `拿办事窗口类比最贴切：你递进去一份参考资料和两张空白单子，工作人员在单子上各写一个数，再一并还你；他嘴上报不报话无所谓 —— 源稿那只函数返回 void，不靠返回值交货，靠填单子交货。参数表里三种分工一眼可读：const std::vector<int>& v 是参考资料，只读、一个不抄；int& total 和 int& best 是答案格，裸引用、能写。以后看任何函数头都先问一句：哪个参数会被写？` },
        { t: `p`, text: `源稿开头那句 total = 0 和 best = v[0] 值得单独讲，别把它当摆设。递进来的盒子是调用处早已存在的那只，里面装的是旧东西 —— main 那句 int total = 0 只是碰巧给了 0，函数不许指望这份运气。答案格的第一笔永远是擦干净：要么写成 0 重起，要么像 best 那样先拿第一个数当基准，再逐个比大小。少了这一笔，你写的 total += x 就是在旧账上加一遍，喊两次函数数字翻一番 —— 演示 3 专门演这个。` },
        { t: `ul`, items: [
          `**盒子由调用处备**：引用得有本人（第 58 课那条），所以答案格必须是 main 里已经声明好的 int 变量，不能现造一个数递进去。`,
          `**进格子先擦干净**：函数头第一几句往往就是给每个答案格写初值，这是这套写法自带的义务。`,
          `**读的资料带 const，写的格子不带**：一个 & 上要不要挂 const，判断标准只有一个 —— 你打算不动它，还是打算往里写。`,
          `**返回值照样能留一只**：本课用 void 是因为要交两份；其实你可以 return 一个、同时填一个格子，只是读代码的人得两头看，平时尽量别这么绕。`
        ]},
        { t: `svg`, caption: `调用处备好三只盒子递进去：名单是只读的参考资料，total 与 best 是两张空白答案纸；函数往里写，回到 main 时两张纸已经填满`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 330" font-family="sans-serif">
  <text x="20" y="24" font-size="14" font-weight="700" fill="#142639">main 里先备好三只盒子</text>
  <rect x="24" y="40" width="180" height="66" rx="8" fill="#eaf2fb" stroke="#00599c" stroke-width="2"/>
  <text x="114" y="62" font-size="12" font-weight="700" fill="#00599c" text-anchor="middle">名单　只读</text>
  <text x="114" y="82" font-size="12" fill="#142639" text-anchor="middle">85 92 58 96</text>
  <text x="114" y="98" font-size="12" fill="#57677c" text-anchor="middle">参考资料　一个不抄</text>
  <rect x="226" y="40" width="180" height="66" rx="8" fill="#fdf0e6" stroke="#b8232f" stroke-width="2"/>
  <text x="316" y="62" font-size="12" font-weight="700" fill="#b8232f" text-anchor="middle">total　答案格</text>
  <text x="316" y="82" font-size="12" fill="#142639" text-anchor="middle">递进去时带着旧值</text>
  <text x="316" y="98" font-size="12" fill="#57677c" text-anchor="middle">裸引用　能写</text>
  <rect x="428" y="40" width="188" height="66" rx="8" fill="#fdf0e6" stroke="#b8232f" stroke-width="2"/>
  <text x="522" y="62" font-size="12" font-weight="700" fill="#b8232f" text-anchor="middle">best　答案格</text>
  <text x="522" y="82" font-size="12" fill="#142639" text-anchor="middle">同样带着旧值</text>
  <text x="522" y="98" font-size="12" fill="#57677c" text-anchor="middle">裸引用　能写</text>
  <line x1="114" y1="106" x2="114" y2="136" stroke="#00599c" stroke-width="2"/>
  <polyline points="108,128 114,136 120,128" fill="none" stroke="#00599c" stroke-width="2"/>
  <line x1="316" y1="106" x2="316" y2="136" stroke="#b8232f" stroke-width="2"/>
  <polyline points="310,128 316,136 322,128" fill="none" stroke="#b8232f" stroke-width="2"/>
  <line x1="522" y1="106" x2="522" y2="136" stroke="#b8232f" stroke-width="2"/>
  <polyline points="516,128 522,136 528,128" fill="none" stroke="#b8232f" stroke-width="2"/>
  <rect x="24" y="140" width="592" height="78" rx="8" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2.5"/>
  <text x="320" y="164" font-size="13" font-weight="700" fill="#2e7d32" text-anchor="middle">stats 肚子里：先擦格子，再往里写</text>
  <text x="320" y="186" font-size="12" fill="#142639" text-anchor="middle">total = 0　best = 名单第一个数　然后转一圈</text>
  <text x="320" y="206" font-size="12" fill="#142639" text-anchor="middle">每转一格：往 total 上加一笔，比 best 大就换掉 best</text>
  <line x1="320" y1="218" x2="320" y2="246" stroke="#57677c" stroke-width="2"/>
  <polyline points="314,238 320,246 326,238" fill="none" stroke="#57677c" stroke-width="2"/>
  <rect x="24" y="250" width="592" height="62" rx="8" fill="#f4f7fc" stroke="#c3ccd8" stroke-width="1.5"/>
  <text x="320" y="276" font-size="13" font-weight="700" fill="#142639" text-anchor="middle">回到 main：总分 291　最高 96</text>
  <text x="320" y="298" font-size="12" fill="#57677c" text-anchor="middle">名单一个数没变，两张答案纸被填满　return 那只手全程闲着</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `有人第一反应是：把两份结果装进一只 std::vector 还回来不就行了？能做，但语义丢了 —— 调用处拿到一串长度为 2 的数，得靠注释记住第 0 格是总分、第 1 格是最高分，换个接手的人就猜反。答案格这条路把结果的名字写在调用处：int total、int best，谁看了都知道往哪个格子读自己关心的那份。第 60 课那句「复印件碰不到原件」在这里反过来用：正因为外号碰得到原件，才能一次改写好几只盒子。` },
        { t: `p`, text: `再往远处看一步：几份结果本来就是一个整体，硬拆成三个参数确实有点糙。以后你会学到把自己的东西打包成一个整只递来递去的写法，那时交多份结果会更整齐 —— 本课先把「递答案格」这条路踩实，因为它是 C++ 里最古老、也最容易读懂的一种交活方式，标准库和大量老代码都在用它。` },
        { t: `h2`, text: `演示 1 · 源稿现场：两张答案纸` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
void stats(const std::vector<int>& v, int& total, int& best) {
    total = 0;                              // 先把答案格擦干净
    best = v[0];                            // 拿第一个数当基准
    for (int x : v) { total += x; if (x > best) best = x; }
}
int main() {
    std::vector<int> scores = {85, 92, 58, 96};
    int total = 0, best = 0;                // 两只待填的空盒子
    stats(scores, total, best);             // 函数把两格都填满
    std::println("总分 {}，最高 {}", total, best);
    return 0;
}` },
        { t: `p`, text: `一行：总分 291，最高 96。参数表那位 const std::vector<int>& 是上一课的口诀原样落地 —— 名单只读、一个不抄；后面两位裸引用才是本课的新东西。再盯一眼那句 return 缺席：stats 返回 void，它一个字都没「还」，两份结果全都写在递进去的格子里。所以读调用处时，光看左边没接返回值可不够，得看参数表里谁站在裸引用的位子上。` },
        { t: `h2`, text: `演示 2 · 本课任务：再加一张格子数及格` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
void stats(const std::vector<int>& v, int& total, int& best, int& count) {
    total = 0; best = v[0]; count = 0;      // 三只答案格先擦干净
    for (int x : v) { total += x; if (x > best) best = x; if (x >= 60) count = count + 1; }
}
int main() {
    std::vector<int> scores = {85, 92, 58, 96};
    int total = 0, best = 0, count = 0;
    stats(scores, total, best, count);
    std::println("总分 {}，最高 {}，及格 {}", total, best, count);
    return 0;
}` },
        { t: `p`, text: `总分 291、最高 96、及格 3 —— 58 那位没过关。加一张格子的手续一共三处：参数表末尾添一个 int& count，函数头给它写一句擦干净的 count = 0，调用处先声明 int count 再把它递进去。三处少一处都到不了你想要的效果，尤其中间那句：新格子最容易被忘，因为「反正 main 里给了 0」这句话在函数里一点保证都没有。这就是源稿那条任务的全部答案。` },
        { t: `h2`, text: `演示 3 · 不擦格子的现场：数字越喊越大` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
void sloppy_add(const std::vector<int>& v, int& total) {
    for (int x : v) total += x;      // 忘了擦：直接往旧值上加
}
int main() {
    std::vector<int> scores = {85, 92};
    int total = 1000;                // 盒子里带着旧账
    sloppy_add(scores, total);
    std::println("第一遍：{}", total);
    sloppy_add(scores, total);
    std::println("第二遍：{}", total);
    return 0;
}` },
        { t: `p`, text: `第一遍 1177，第二遍 1354 —— 每喊一声就往旧账上添 177。它不报任何错，是最典型的「编译过了但算错了」：累加那位用的是 +=，而答案格的初值是调用处随手给的那个 1000。把函数头补上 total = 0 那句，两遍都会是 177，这才是把格子当格子的写法。顺手记住对照：参考资料那只 v 为什么带 const，就是为了让这类越界改动压根写不出来。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `**拿一个数当答案格递进去**：在应该填格子的位子上直接写个 0 或者 1，报错 cannot bind non-const lvalue reference of type 'int&' to an rvalue of type 'int'。根因：引用必须有本人，一个临时数不是盒子，外号没处挂。`,
          `**忘了擦格子**：不报错，纯算错，长相见演示 3 —— 数字一次比一次大，或者压根是从旧值起算的。根因：递进去的是调用处那只已经装过东西的盒子。`,
          `**把要写的格子写成 const 引用**：cannot assign to variable 'total' being const-referenced。上一课那条只读通道照样拦你，哪怕你心里想的是「这里我要写」。想写就别挂 const。`,
          `**把 const 变量递进裸引用位**：调用处那只盒子自己声明成了 const int total，函数参数要可写外号，配不上，报错和第二条长得像但根因在调用处 —— 会被写的盒子，声明时别加 const。`,
          `**空名单喊 stats**：不报错，best = v[0] 却在一只什么都没有的名单上取第一个格子，结果离谱甚至当场崩。根因：基准值这一步有个隐含前提「名单非空」，先判 empty 再往下走。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `1. 给 stats 再加一个引用参数 count，顺带统计及格人数 —— 分数大于等于 60 就算过关，main 里把它打印出来`,
          `2. 延伸：再添一张答案格 worst 交出最低分，main 里一次喊完、四份结果一起打印。写完数一数：参数表里谁只读、谁会被写？`,
          `3. 延伸：把擦格子那句删掉，同一组盒子连喊两遍 stats，看看总分涨成什么样；再用一句话说清「为什么函数不能假定调用方给的是 0」。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：return 一只手只拎得走一个值，答案格却能摆好几张 —— 调用处备好盒子递外号进去，函数第一笔先擦干净，然后一格一格往里写。` }
      ]
    }
  ]
};
