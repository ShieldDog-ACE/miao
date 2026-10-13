/* 喵站 · C++ 掌握 正文分部 p14：第 129–132 课
 *
 * 源稿：129_variant几选一.cpp、130_visit自动分发.cpp、131_expected成功或失败.cpp、132_三兄弟怎么选.cpp
 * 这四课是「可选值三兄弟」的收官：variant 装几选一、visit 自动分发、expected 带原因成败、三兄弟对照选型。
 * 写法延续掌握课习惯：不只讲怎么写，更讲「它凭什么这么做」。
 * 号段自查：129 新拿到 variant、131 新拿到 expected；130/132 无新构造，visit 随 variant 一起来。
 */
window.MIAO_CPPM_P14 = {
  chapters: [
    {
      id: `m129`, title: `第 129 课 · variant：三格抽屉，同一时刻只开一格`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会用 std::variant 定义「几个类型里选一个」的盒子，能问出「现在装的是哪一种」、按类型把值取出来，并说清它比「啥都塞进 std::string 再猜格式」安全在哪。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `你被一个老问题磨过：一个格子里今天放整数、明天放小数、后天放一段文字。最土的办法是全塞进 std::string —— 于是 42 变成 "42"、3.14 变成 "3.14"，取的时候你得自己猜「这串到底是数还是字」，猜错就是 bug。还有一种是把几种类型都塞进一个 union，但那玩意儿不记得自己现在装的是谁，读错成员直接读出垃圾。std::variant 是这两条路的正经替代：它是一只**多格抽屉**，你在尖括号里把「能装哪几种」一次性写死，比如 std::variant<int, double, std::string> 就声明了三格 —— 整数、小数、字符串，同一时刻**只有一格是开着的**，而且它自己记着现在开的是哪一格。` },
        { t: `p`, text: `关键在这句「三种必居其一」：类型清单在编译期就钉死了，第四种东西**塞不进去**。你写 v = 'A' 想塞个 char，编译器当场拒绝 —— 因为 char 不在那张清单里。这就是它比「全塞 string」稳的第一层：不是运行时靠约定，是编译时把「能装什么」写成合同。想加一种就改尖括号，全项目重编一遍，漏改的地方直接编译失败，而不是等到上线才崩。` },
        { t: `p`, text: `取东西要两步：先**问**「现在这格是不是 int」，答案是就**取**。问的函数是 std::holds_alternative<int>(v)，取的函数是 std::get<int>(v)。为什么要先问再取？因为 std::get<T> 是你亲口告诉它「我要 int 那格」，它照办 —— 万一现在开的不是 int 那一格，它会当场终止程序。所以标准姿势是拿 holds_alternative 当门卫，问过了再 get，这样绝不会读到没开着的格子。第 127 课的 optional 只回答「有没有」，今天这把升级成「是这几种里的哪一种」。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `记两句话就够用：尖括号是「能装哪几种」的清单，写死就改不了；星号或 get 前的那个类型是「我要哪一格」，说错就出事。variant 把「类型」和「值」绑在一起存，所以你永远能问出「当前是谁」，这是 union 给不了的。它还额外提供一个 v.index()，返回当前开着的是第几格，从 0 数起 —— 清单里第一个类型是 0，第二个是 1，依此类推。` },
        { t: `code`, lang: `text`, code: `清单 std::variant<int, double, std::string>
   格 0：int     格 1：double     格 2：std::string
   v = 42      → 开第 0 格，index() 等于 0，holds_alternative<int> 真
   v = 3.14    → 开第 1 格，index() 等于 1，holds_alternative<double> 真
   v = string  → 开第 2 格，index() 等于 2，holds_alternative<std::string> 真

对比：std::optional<T> 只有「有 T / 什么都没有」两态；
      variant 是「A、B、C 里正好一个」多态，格子随你列。` },
        { t: `h2`, text: `怎么做` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <variant>
#include <string>
int main() {
    std::variant<int, double, std::string> v = 42;    // 三格抽屉，先开第 0 格
    std::println("现在装的是第 {} 格", v.index());      // 0
    if (std::holds_alternative<int>(v))                // 问：是 int 吗？
        std::println("整数 {}", std::get<int>(v));      // 是 → 取出来
    v = 3.14;                                          // 换成开第 1 格
    v = std::string("hi");                             // 再换成开第 2 格
    std::println("现在是第 {} 格，字符串是 {}",
                 v.index(), std::get<std::string>(v));  // 2 hi
    return 0;
}` },
        { t: `p`, text: `三处要点。**给 variant 赋值就等于换格子**：v = 3.14 直接把它切到 double 那一格，不用先清空。头文件是 <variant>，用了 std::string 就另包 <string>（第 15 课那条老规矩在这儿照样成立：用到谁的类型就请谁的头，别赌某个头顺手把别的带进来）。**清单里出现 std::string 时，赋值给字符串格要写成 std::string("hi")**，光写 "hi" 会被当成 const char 数组，那类型不在清单里，编译器不认 —— 这是新手最常见的第一脚空。` },
        { t: `h2`, text: `演示 1 · 先问再取，绝不读空着的格` },
        { t: `code`, lang: `c++`, code: `std::variant<int, double, std::string> v = 42;
if (std::holds_alternative<int>(v))                       // 门卫先问一句
    std::println("拿到整数 {}", std::get<int>(v));         // 才准取
std::println("换成小数之前是 int 吗: {}",
             std::holds_alternative<int>(v));              // 还是 true` },
        { t: `p`, text: `实测打印 拿到整数 42 和 换成小数之前是 int 吗 true。这个「先 holds 再 get」的顺序就是 variant 的安全带：holds_alternative 永远返回一个 bool 老实告诉你当前是不是这个类型，你据此决定要不要 get，就不会误开没亮着的格子。格子一多、类型一杂，这套问-取比什么都重要。` },
        { t: `h2`, text: `演示 2 · 换格子时 index 跟着走` },
        { t: `svg`, caption: `std::variant<int,double,string> 是三格抽屉：每次赋值只点亮一格，index() 报亮着的是第几格，从 0 数起`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240">
  <g font-size="13" fill="#142639">
    <text x="24" y="24" font-weight="700" fill="#00599c">清单：std::variant&lt;int, double, std::string&gt;</text>
  </g>
  <g font-size="12" text-anchor="middle">
    <rect x="40" y="44" width="170" height="46" fill="#e7f6ec" stroke="#1a7f42" stroke-width="2.5"/>
    <text x="125" y="66" fill="#1a7f42" font-weight="700">格 0 亮着</text>
    <text x="125" y="83" fill="#1a7f42">int → 42</text>
    <rect x="240" y="44" width="170" height="46" fill="#f5f6f8" stroke="#9aa6b5" stroke-dasharray="4 3"/>
    <text x="325" y="66" fill="#9aa6b5">格 1 关</text>
    <text x="325" y="83" fill="#9aa6b5">double</text>
    <rect x="440" y="44" width="160" height="46" fill="#f5f6f8" stroke="#9aa6b5" stroke-dasharray="4 3"/>
    <text x="520" y="66" fill="#9aa6b5">格 2 关</text>
    <text x="520" y="83" fill="#9aa6b5">string</text>
  </g>
  <g font-size="13" text-anchor="middle">
    <rect x="40" y="112" width="170" height="46" fill="#f5f6f8" stroke="#9aa6b5" stroke-dasharray="4 3"/>
    <text x="125" y="134" fill="#9aa6b5">格 0 关</text>
    <text x="125" y="151" fill="#9aa6b5">int</text>
    <rect x="240" y="112" width="170" height="46" fill="#e7f6ec" stroke="#1a7f42" stroke-width="2.5"/>
    <text x="325" y="134" fill="#1a7f42" font-weight="700">格 1 亮着</text>
    <text x="325" y="151" fill="#1a7f42">double → 3.14</text>
    <rect x="440" y="112" width="160" height="46" fill="#f5f6f8" stroke="#9aa6b5" stroke-dasharray="4 3"/>
    <text x="520" y="134" fill="#9aa6b5">格 2 关</text>
    <text x="520" y="151" fill="#9aa6b5">string</text>
  </g>
  <g font-size="13" fill="#33465e">
    <text x="24" y="184">换格子就是重新赋值：v = 3.14，绿灯从格 0 跳到格 1，别的格自动熄灭</text>
    <text x="24" y="208" font-weight="700" fill="#b8500f">v.index() 报的就是亮着那格的编号，从 0 起；换格子赋值时它跟着跳</text>
  </g>
</svg>` },
        { t: `p`, text: `看图说话：v = 42 时只有格 0 亮，index() 给 0；v = 3.14 后格 0 灭、格 1 亮，index() 给 1；再 v = std::string("hi")，亮的是格 2。抽屉**任何时刻恰好一格亮着**，这正是 variant 的核心承诺 —— 它不会同时开着两格，也不会一格都不开（默认构造时开的是清单第一个类型那一格）。用 if constexpr 配合 index 挑分支、或直接交给下一课的 visit，思路都从这张图来。` },
        { t: `h2`, text: `演示 3 · 清单外的类型塞不进` },
        { t: `code`, lang: `c++`, code: `std::variant<int, double, std::string> v = 42;
// v = 'A';                    // 编译不过：char 不在清单 int/double/string 里
// std::get<char>(v);          // 编译不过：清单里根本没有 char 这一格
v = 3.14;
// std::get<int>(v);           // 能编译，但运行时当场终止：现在开的是 double 格` },
        { t: `p`, text: `三行注释掉的写法各代表一类错误。**前两类是编译期就拦下**：塞 char、get char，清单里没有这一种，编译器直接不给过 —— 这是「安全」的来头。**第三类是运行期**：std::get<int>(v) 编译得过（int 确实是清单里的类型），但 v 现在开的是 double 格，get 要的是没亮着的那格，程序会当场终止。所以能用 holds_alternative 先问就问，别拿 get 赌运气。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `往带 std::string 的 variant 里塞裸字符串："hi" 的类型是 const char 数组，不在清单里，编译报错。写成 std::string("hi")，或用一条 using 起个名。`,
          `没先问就 get，且赌对了类型。小测试看着全过，等哪天数据顺序一变，get 要一格而亮的是另一格，程序直接终止。规矩是 holds_alternative 当门卫，或干脆用下一课的 visit 免掉手动 get。`,
          `忘包 <variant>。报错长相是 'variant' is not a member of 'std'，它不像 int 那样天生就在，得自己请进来。`,
          `把清单顺序不当回事，拿 index() 当业务含义硬编码。格 0 是 int、格 1 是 double 只是**你写进去的先后**，将来有人在前面加一种类型，所有下标整体后移，你写死的 0 就指错了。要按类型问（holds_alternative）而不是按数字猜。`,
          `想「同时装 int 和 string」。variant 的定义就是「恰好一个」，要并存得用别的东西（比如一个含两成员的 struct），variant 不是干这个的。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `定义 std::variant<int, std::string>：先存你的学号（整数那一格），再换成名字（字符串那一格），各打印一次，每次用 holds_alternative 先问再取。`,
          `给上面这只 variant 各打一次 index()，确认学号时是 0、换成名字后变成 1。`,
          `延伸：造 std::variant<int, double, std::string>，依次赋值 7、2.5、std::string("ok")，每次打印 index() 并用对应类型的 get 把值取出来验证。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：std::variant 是「清单写死、同刻只开一格、自己记着开的是谁」的抽屉 —— 清单外的塞不进，取的时候先 holds_alternative 问一句再 get，别赌。` }
      ]
    },
    {
      id: `m130`, title: `第 130 课 · visit：抽屉里是谁，就自动请谁上台`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用 std::visit 替掉一长串 holds_alternative 加 get 的 if —— 让「抽屉现在装的是哪种类型」自动决定跑哪段代码，并看懂那个泛型 lambda 加 if constexpr 的分发写法。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课取值是「先问再取」：holds_alternative<int> 问一句、get<int> 取一下，三种类型就得写三组 if。格子一多，这串 if 会长得没人愿意读，而且**新加一种类型时你必须记得把每一种都补全** —— 漏一个不报错，只是那条分支永远走不到。std::visit 是治这个的：它像一个**叫号器**，你给它一个「怎么处理值」的东西（通常是个 lambda）加一个 variant，它去查抽屉现在亮着的是哪一格，然后把那一格里的值**直接喂给 lambda**，自动就跑对了。` },
        { t: `p`, text: `妙处在 lambda 的参数写成 const auto& x —— 这叫**泛型 lambda**：同一份 lambda 源码，编译器会为 variant 里的**每一种类型各生成一个版本**。于是那个 lambda 同时「能接 int、能接 double、能接 string」，visit 只负责在运行时把当前那格的真实类型递进去。你要在 lambda 里区分「来的到底是哪一种」，就用 if constexpr 配合类型的比较：拿 decltype(x) 得到当前类型，跟 int 比、跟 double 比，各走各的 return。` },
        { t: `p`, text: `为什么是 if constexpr 而不是普通 if？普通 if 的三个分支都会被**编译**，那么「把字符串当整数加」这种分支即使运行时不走，编译时也照样报错。if constexpr 是**编译期**挑选：条件不成立的整段分支直接**不生成代码**，所以每个分支里写的话只要对**那一种类型**成立就行。这是泛型 lambda 能「一份源码多种类型」的关键配套 —— 运行时用不上 std::visit 去猜，编译期每种类型各留一条已经验过的路。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `code`, lang: `text`, code: `一长串 if（上一课写法）         叫号器 std::visit（本课写法）
--------------------------------   --------------------------------
if holds<int>   → get<int>         visit(lambda, v)：
if holds<double>→ get<double>        看 v 当前亮着哪格
if holds<string>→ get<string>         把那格的值喂给 lambda
   … 每加一种补一组，漏了不报错        lambda 用 if constexpr 分类型
                                      加一种类型，漏分支会编译失败` },
        { t: `p`, text: `最右列那句话是 visit 最值钱的性质：**它逼你把每种类型都处理干净**。variant 声明了几种，你的 lambda 就得能接住几种；接不住，编译器会在 visit 那一行报错，而不是留一条悄悄失效的分支。这份「穷尽检查」是手写 if 串给不了的。` },
        { t: `h2`, text: `怎么做` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <variant>
#include <string>
int main() {
    std::variant<int, double, std::string> v = 3.14;   // 现在亮着 double 格
    std::visit([](const auto& x) {                     // 泛型 lambda：谁来都能接
        std::println("visit 收到的值：{}", x);
    }, v);                                             // 把当前那格的值喂进去
    return 0;
}` },
        { t: `p`, text: `实测输出 visit 收到的值：3.14。三件事钉住：**第一个参数是 lambda、第二个参数是那个 variant**，顺序别写反；lambda 参数写 const auto& 让它「谁都接得住」；visit 会看 v 当前是 double 格，就把那个 double 递进去。头文件仍是 <variant>（visit 和 variant 同一个家），用了 std::string 就照旧包 <string>。` },
        { t: `h2`, text: `演示 1 · 用 if constexpr 把三种类型分开` },
        { t: `code`, lang: `c++`, code: `// 接上：需要额外包 <type_traits>（std::is_same_v、std::decay_t 住在这）
using Value = std::variant<int, double, std::string>;
std::string describe(const Value& v) {
    return std::visit([](const auto& x) -> std::string {
        using T = std::decay_t<decltype(x)>;               // 当前真正是哪一种
        if constexpr (std::is_same_v<T, int>)    return "整数 " + std::to_string(x);
        else if constexpr (std::is_same_v<T, double>) return "小数 " + std::to_string(x);
        else                                       return "字符串 " + x;
    }, v);
}` },
        { t: `p`, text: `这个 describe 把「按类型说人话」全包进一次 visit。逐行拆：**std::decay_t<decltype(x)>** 把参数脱掉引用和 const，得到干净的类型名 T；然后 if constexpr 拿 T 分别和 int、double 比，比中就 return 对应那串。注意最后的 else 不带 constexpr 条件 —— 它是「剩下全归它」，兜住 string。这段是**片段**，把它和上一课的 main 拼起来才完整跑；单独放这儿是为了把分发逻辑看清爽。` },
        { t: `h2`, text: `演示 2 · 叫号器按当前类型逐个走` },
        { t: `svg`, caption: `std::visit 的分发：它读 variant 当前亮着的格（就是上一课的 index），把那一格的值喂给 lambda，if constexpr 只保留类型对得上的那条分支`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250">
  <g font-size="13" fill="#142639">
    <text x="24" y="24" font-weight="700" fill="#00599c">std::visit( lambda, v )   —— v 当前亮 double 格</text>
  </g>
  <g font-size="13" text-anchor="middle">
    <rect x="30" y="46" width="120" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="90" y="70">v（variant）</text>
    <rect x="180" y="46" width="96" height="40" fill="#e7f6ec" stroke="#1a7f42"/><text x="228" y="70" fill="#1a7f42">亮着：double</text>
    <path d="M300 66 h50" stroke="#33465e" stroke-width="2"/>
    <polygon points="350,60 366,66 350,72" fill="#33465e"/>
    <rect x="368" y="46" width="118" height="40" fill="#fff3d6" stroke="#b8722b"/><text x="427" y="63">喂进的值</text><text x="427" y="80" fill="#b8722b">3.14</text>
    <path d="M506 66 h44" stroke="#33465e" stroke-width="2"/>
    <polygon points="550,60 566,66 550,72" fill="#33465e"/>
    <rect x="560" y="46" width="52" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="586" y="70">lambda</text>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="24" y="112">泛型 lambda 被编译器按 variant 里每一种类型各生成一份，运行时只调用当前类型那份</text>
  </g>
  <g font-size="13" text-anchor="middle">
    <rect x="30" y="130" width="180" height="34" fill="#e7f6ec" stroke="#1a7f42"/><text x="120" y="151" fill="#1a7f42">T=int → 保留「整数 …」</text>
    <rect x="230" y="130" width="180" height="34" fill="#e7f6ec" stroke="#1a7f42"/><text x="320" y="151" fill="#1a7f42">T=double → 保留「小数 …」</text>
    <rect x="430" y="130" width="180" height="34" fill="#e7f6ec" stroke="#1a7f42"/><text x="520" y="151" fill="#1a7f42">else → 保留「字符串 …」</text>
  </g>
  <g font-size="12" fill="#b8500f">
    <text x="24" y="188" text-anchor="start">if constexpr 在编译期把走不到的分支整段删掉，所以「字符串 + 整数」这类混写不会编译报错</text>
  </g>
  <g font-size="13" fill="#142639">
    <text x="24" y="214" text-anchor="start">加一种类型却在 lambda 里没接住它 → visit 那行编译失败（穷尽检查，手写 if 串没这待遇）</text>
    <text x="24" y="238" text-anchor="start" font-weight="700" fill="#00599c">运行结果顺序：整数 1 / 小数 2.500000 / 字符串 hi</text>
  </g>
</svg>` },
        { t: `p`, text: `把 describe 用在 {Value{1}, Value{2.5}, Value{std::string("hi")}} 上循环调用，实测三行是 **整数 1、小数 2.500000、字符串 hi**。留意第二行：std::to_string(2.5) 会补成固定六位小数 2.500000，这是 to_string 的脾气，不是 bug。想要 2.5 原样，可以改用格式化输出而不是 to_string，但那要绕回 std::format —— 这里为了把三种类型统一成字符串返回，用 to_string 最直白。` },
        { t: `h2`, text: `演示 3 · 给抽屉加第四格` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <variant>
#include <type_traits>
int main() {
    std::variant<int, char> v = 'A';               // 加一格 char，这里先只用两格演示
    std::visit([](const auto& x) {
        using T = std::decay_t<decltype(x)>;
        if constexpr (std::is_same_v<T, int>)  std::println("整数 {}", x);
        else                                   std::println("字符 {}", x);   // 新分支
    }, v);
    return 0;
}` },
        { t: `p`, text: `实测输出 字符 A。这就是本课任务要干的活：给 variant 的尖括号**多列一种类型**，再在 lambda 里**补一条对应分支**。补了这一条，v 装 char 时走 else 打印 字符 A；要是加了类型却忘了补分支，visit 那一行当场编译不过 —— 编译器替你把「漏处理」这件事兜住了，这正是它比上一课那串 if 让人放心的地方。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `忘包 <type_traits>。std::is_same_v 或 std::decay_t 找不到，报 'is_same_v' is not a member of 'std' —— 这俩不在 <variant> 里，得单独请。`,
          `lambda 参数写成具体类型（比如就写 int x）。那不是泛型 lambda，variant 里的 double、string 喂进来时接不住，visit 直接编译失败。要 const auto&。`,
          `把 if constexpr 写成普通 if，还想在字符串分支里对 x 做整数运算。普通 if 每个分支都编译，那条用不上的分支照样报错。挑分支请用 if constexpr。`,
          `忘了最后的兜底 else。前几条 constexpr 都没命中当前类型时，函数就没有 return 路径，返回值是垃圾或编译警告。用「剩下的全归 else」收尾最稳。`,
          `以为 visit 会帮你排序或挑「最像」的类型。它只认 variant **当前实际亮着那一格的真实类型**，跟你能不能转成别的类型无关 —— 装的是 int 就只会走 int 分支，绝不会被你「看成」double。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `给上一课那只 std::variant<int, double, std::string> 加第四格 char，并在 describe 的 lambda 里补一条对应分支：装 char 时返回「字符 加上那个字符」，用 if constexpr 判类型。`,
          `写一个用 std::visit 的泛型 lambda，参数用 const auto&，让同一只 variant 依次装 int、double、std::string 时各打印一行，确认走的是不同分支。`,
          `延伸：故意加一种类型却不补分支，看 visit 那一行的报错长什么样，再补回来 —— 亲手验证一次「穷尽检查」。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：std::visit 是叫号器 —— 看抽屉亮着哪格、把那格的值喂进泛型 lambda；配合 if constexpr 在编译期挑分支，逼你把每种类型都处理干净。` }
      ]
    },
    {
      id: `m131`, title: `第 131 课 · expected：成功拿结果，失败拿原因`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把 std::expected 当成函数的返回类型用起来 —— 成功时给一个 T、失败时给一个「为什么失败」的 E，用 if(r) 判侧、value 或 error 分别取值，说清它比 optional 多回答了什么。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 127 课的 std::optional 解决的是「有没有」：找到就装值、没找到就是空。可现实里「没有」常常不止一种原因 —— 除法失败是因为除数是 0、解析失败是因为「输入不是整数」。optional 只答「这里空着」，至于为什么空它一概说不出。**std::expected 就是把这一半补上**：一只**二合一盒子**，同一时刻要么装着成功结果 T、要么装着失败原因 E，绝不会两头都空、也绝不会两头都满。调用者一次判定，就把「成没成」和「没成为什么」一次全拿到。` },
        { t: `p`, text: `用起来分两头。**造盒子**（函数内部）：成功就 return 结果值，失败就 return std::unexpected(原因) —— std::unexpected 是个**包装器**，明确写「这不是成功值、是错误」；不套壳，编译器就以为你想把别的类型强转成 expected。**吃盒子**（调用处）：先 if (r) 判它成没成（expected 会被**隐式转成 bool**，成功真、失败假），成了就 *r 或 r.value() 取结果，没成就 r.error() 取原因。两个访问器不能乱用 —— 判侧永远在取值之前。` },
        { t: `p`, text: `不走异常那条路是有道理的。异常适合**真的意外**：磁盘坏了、内存不够了，那种不能预料、常态不该跑的事。除零、解析失败这种**你早就预料到、一百次里出现几次**的失败，用 try 包住再抛上去代价高、还把调用链搞隐晦 —— 光看函数签名根本不知道它会抛。expected 走另一条路：**把失败直接写进返回类型**。看到 std::expected<double, std::string> 就知道「这函数要么给你 double、要么给你一个字符串告诉你为什么没成」，**签名即文档**。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `code`, lang: `text`, code: `std::expected<T, E> 是一只开关，只有两个位置：
    if (r) 为真  →  r 是成功，*r 或 r.value() 拿到 T
    if (r) 为假  →  r 是失败，r.error() 拿到 E

造盒子（在函数 return 处）：
    return 结果值              → 装进成功那一侧（T）
    return std::unexpected(E) → 装进失败那一侧（E）

三种判法，等价：
    if (r)          → 靠 operator bool 隐式转
    if (r.has_value()) → 显式函数版
    r.value_or(默认)   → 成功拿值、失败拿默认，把失败当常规走完一行` },
        { t: `p`, text: `一句话记住：**T 和 E 是「互斥的一半」**，盒子永远只亮一侧。从第 127 课的 optional 走到 expected，只是把「空」这个信息位换成「失败原因」这个更值钱的信息位。` },
        { t: `h2`, text: `怎么做` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <expected>
#include <string>
std::expected<double, std::string> safe_div(double a, double b) {
    if (b == 0) return std::unexpected("除数不能为零");
    return a / b;
}
int main() {
    auto r = safe_div(10, 4);
    if (r) std::println("10/4 = {}", *r);
    else   std::println("失败: {}", r.error());
    return 0;
}` },
        { t: `p`, text: `实测输出 10/4 = 2.5。三处形状钉住。**返回类型 std::expected<double, std::string>** 尖括号里前一个成功类型、后一个错误类型。**成功那行 return a / b** 只写了个 double，编译器帮你**隐式**包成 expected，不用手动套壳。**失败那行必须套 std::unexpected(...)** —— 直接 return "除数不能为零" 会被当成想构造成功值，编译不过。头 <expected> 请上，用了 std::string 顺带 <string>。` },
        { t: `h2`, text: `演示 1 · 失败分支单独走一遍` },
        { t: `code`, lang: `c++`, code: `// 接上：safe_div 已经定义好，头 <expected> 也已经请进来
auto bad = safe_div(10, 0);                        // 除数是 0 → 走失败分支
if (bad)
    std::println("10/0 = {}", *bad);               // 成功进得来，这里不会执行
else
    std::println("10/0 失败: {}", bad.error());    // 实际打印这一行` },
        { t: `p`, text: `实测 bad.error() 拿到 std::string「除数不能为零」，整个 if/else 走 else 分支，输出 **10/0 失败: 除数不能为零**。这条分支在 safe_div 里 return std::unexpected(...) 那一刻就被选中 —— 盒子已经亮在「失败」那一侧；函数返回给调用方时，if(bad) 只是把这一侧的灯读出来。**判侧之前绝不要碰 value/error**，这是本课最硬的一条纪律。` },
        { t: `h2`, text: `演示 2 · parse_int：把任务原型走通` },
        { t: `code`, lang: `c++`, code: `// 接上：返回类型换成 std::expected<int, std::string>
std::expected<int, std::string> parse_int(const std::string& s) {
    for (char c : s)
        if (c < '0' || c > '9') return std::unexpected("输入不是整数");
    int n = 0;
    for (char c : s) n = n * 10 + (c - '0');
    return n;                                       // 一路数字：返回 int → 成功
}
auto ok  = parse_int("123");
auto bad = parse_int("12a");
std::println("{}", ok.value());                     // 123
std::println("{}", bad.error());                    // 输入不是整数` },
        { t: `p`, text: `这个 parse_int 是本课任务的直接对应：字符串里出现一个非数字字符，就地 std::unexpected("输入不是整数") 把失败**带原因**返回；一路都是数字就 return n，编译器包成成功。跑出来两行是 **123** 和 **输入不是整数**，成功走 value、失败走 error。对照第 127 课 optional 只能返回空、说不出为什么空，这里一个字符串把原因钉死。` },
        { t: `h2`, text: `演示 3 · 三种判法与 value_or 兜底` },
        { t: `code`, lang: `c++`, code: `// 接上：ok 是成功的 expected，bad 是失败的
std::println("有值吗: {} {}", ok.has_value(), bad.has_value());  // true false
std::println("兜底: {}", bad.value_or(-1));                       // -1
std::println("兜底: {}", ok.value_or(-1));                        // 123，走值不走默认
if (!bad) std::println("bad 是失败的");                            // operator bool 反向` },
        { t: `svg`, caption: `std::expected 是一只二合一盒子：同一时刻只亮一侧 —— 亮成功就 value 拿 T、亮失败就 error 拿 E；判侧永远在取值之前`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 264">
  <g font-size="13" fill="#142639">
    <text x="24" y="24" font-weight="700" fill="#00599c">std::expected&lt;T, E&gt; —— 成功装 T、失败装 E，绝不同时</text>
  </g>
  <g font-size="13" text-anchor="middle">
    <rect x="40" y="46" width="270" height="78" rx="6" fill="#e7f6ec" stroke="#1a7f42" stroke-width="2.5"/>
    <text x="175" y="70" fill="#1a7f42" font-weight="700">成功：盒子亮在 T 这一侧</text>
    <text x="175" y="92" fill="#1a7f42">r.value() 或 *r 拿到 T</text>
    <text x="175" y="112" fill="#1a7f42">if (r) 为真 / has_value() 为真</text>
    <rect x="330" y="46" width="270" height="78" rx="6" fill="#ffe1dd" stroke="#b8500f" stroke-width="2.5"/>
    <text x="465" y="70" fill="#b8500f" font-weight="700">失败：盒子亮在 E 这一侧</text>
    <text x="465" y="92" fill="#b8500f">r.error() 拿到 E（为什么没成）</text>
    <text x="465" y="112" fill="#b8500f">if (r) 为假 / has_value() 为假</text>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="24" y="150">造盒子：return 结果值 → 装左盒；return std::unexpected(原因) → 装右盒</text>
    <text x="24" y="172">兜底：r.value_or(默认) —— 成功拿值、失败拿默认，把失败当常规走完一行</text>
    <text x="24" y="194">对照：第 127 课 optional 只答「有没有」，expected 还答「没成为什么」</text>
  </g>
  <g font-size="13" text-anchor="middle">
    <rect x="40" y="206" width="560" height="46" rx="4" fill="#fff3d6" stroke="#b8722b"/>
    <text x="320" y="224" fill="#b8722b" font-weight="700">乱开合页 = 当场终止</text>
    <text x="320" y="242" fill="#b8722b">对失败盒子调 value() / 对成功盒子调 error()，程序立刻崩；判侧永远在取值之前</text>
  </g>
</svg>` },
        { t: `p`, text: `实测四行输出 **有值吗: true false** / **兜底: -1** / **兜底: 123** / **bad 是失败的**。has_value() 是显式函数版、if(r) 靠 operator bool 隐式转、if(!r) 判失败，三种写法效果一模一样。**value_or 只在失败时生效**：bad.value_or(-1) 走默认 -1，ok.value_or(-1) 依然走成功值 123 —— 别指望它做转换，它只管「没值就用默认」。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `对失败的盒子调 value()，或对成功的盒子调 error()。这是**判侧没做**的下游后果：程序会当场终止（bad_expected_access），比 optional 的没判 value() 还硬。规矩一句话 —— 先 if(r)，再碰 value 或 error。`,
          `函数体写了 std::unexpected(...)，返回类型却忘改成 std::expected。报错会长一整屏模板错，根子就这一句 —— return 类型和返回的东西两头必须对上。`,
          `std::unexpected 里塞错了 E。声明是 expected<int, std::string> 却 return std::unexpected(42)，字符串那一格塞 int，直接编译不过 —— 上一批 variant 那种「清单外塞不进」的脾气在 expected 这里同样成立。`,
          `判了一次就当永久的。r 本身不会被 if(r) 消耗掉，判完还是那个 r；传给别的函数最好让被调函数自己再判一次，读代码的人才不会被「外面判过了吗」绕晕。`,
          `把 expected 拿来当 optional 用。E 类型选成 std::monostate 之类「反正不用」的占位，编译器不拦，但你放弃了「带原因」这个 expected 唯一的红利 —— 真要用「只判有没有」的语义就回头用第 127 课的 optional，别在这里降级。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `写 parse_int(const std::string& s) 返回 std::expected<int, std::string>：字符串里出现非数字字符就 std::unexpected("输入不是整数")，一路数字就 return 那个 int；main 里分别拿 "123" 和 "12a" 各判一次，成功走 value()、失败走 error() 打印。`,
          `把上一题的两行结果，换成 bad.value_or(-1) 和 ok.value_or(-1) 的写法各打一次，观察「成功走值、失败走默认」的对照。`,
          `延伸：给 safe_div 再加一条失败原因 —— a 与 b 同时是 0 时返回 std::unexpected("0 除以 0 未定义")，让函数有**两种失败原因**可选，main 里三种输入各判一次。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：std::expected 是「成功装 T、失败装 E」的二合一盒子 —— if(r) 判侧、value 或 error 分别取值；optional 只答「有没有」，expected 答「成没成、没成为什么」。` }
      ]
    },
    {
      id: `m132`, title: `第 132 课 · 三兄弟怎么选：optional、variant、expected 一张桌`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把前两批学的 optional、variant、expected 摆到一张桌上对照，一句话说清各自管哪种「不普通」的返回值，拿到一个函数能当场判它最该用哪个、并记住三者接口不能串门。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 127 课到这一课，三兄弟你挨个用熟了，今天把它们并排比。它们出身相同：都在接替 C 语言那套**暗号返回** —— 函数出错就 return -1、return 空串、return 一个返回码，调用方忘了检查就出事，而 -1 到底是不是合法值全凭口头约定。三兄弟的共同主张只有一句：**把「特殊情况」写进返回类型本身**。于是编译器站到你这边：你想不判就直接拿值，它不答应。有没有、是哪一种、成没成，从此都是类型层面明摆着的事。` },
        { t: `p`, text: `差别就三句话，务必背下来：**可能没有 → optional；几选一 → variant；成败还要带原因 → expected**。展开讲 —— optional<T> 管「这个值可能有、也可能压根不存在」，查找、可能无解的解析归它；variant<A,B,C> 管「值一定有，只是它是这几种类型里的某一种」，一个格子今天装 int 明天装 string 归它（就是第 129 课那只三格抽屉）；expected<T,E> 管「这事可能失败，而且失败了得告诉你为什么」，除法、读文件、网络请求归它（第 131 课那只二合一盒子）。` },
        { t: `p`, text: `记它们**各自回答什么问题**最不容易混：optional 答「有没有」，variant 答「是哪一种」，expected 答「成没成、没成为什么」。三者的接口**不能串着用** —— variant 没有 value_or、也不能写 if(v)，它靠 index、holds_alternative、get、visit；optional 只有「有值 / 没值」两态，没有 error() 说不出原因；只有 expected 同时握着 value_or 和 error()。一个函数通常只用其中一个，别为显得高级把三种叠在一起。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `code`, lang: `text`, code: `先看返回值属于哪一种「不普通」，再挑盒子：
   只是「可能压根没有这个值」             → optional<T>
   值一定有，但「类型有好几种可能」        → variant<A, B, C>
   可能失败，而且「失败要带上为什么」      → expected<T, E>

拿不准就问两句：
   「没有」和「失败」是同一回事吗？
       是 → optional 就够；不是、还要说原因 → expected
   一个值会不会「有时是数、有时是字」？
       会 → variant；不会 → 回到上面在 optional / expected 里二选一` },
        { t: `h2`, text: `怎么做` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <optional>
#include <variant>
#include <expected>
#include <string>
int main() {
    std::optional<char> grade = 'A';              // 可能有，可能没有
    std::variant<int, std::string> who = 7;        // 学号或名字，二选一
    std::expected<int, std::string> r = 99;         // 成功的结果（或失败原因）
    std::println("optional 里: {}", grade.value_or('?'));
    std::println("variant 现在是 int 吗: {}", std::holds_alternative<int>(who));
    std::println("expected 里: {}", r.value_or(-1));
    return 0;
}` },
        { t: `p`, text: `实测三行 **optional 里: A / variant 现在是 int 吗: true / expected 里: 99**。同一只 main 里三只盒子各开各的：**value_or** 是 optional 和 expected 都有的兜底，**holds_alternative** 只有 variant 有，**error()** 只有 expected 有 —— 这张写法差异就是本课要你记住的东西。用了三只盒子就得把 <optional>、<variant>、<expected> 三个头都请齐，外加 std::string 的 <string>。` },
        { t: `h2`, text: `演示 1 · 三兄弟对照表` },
        { t: `svg`, caption: `optional / variant / expected 的选型对照：各自回答什么问题、怎么取值、典型场景；底部红框是三者接口不能串门的提醒`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320">
  <g font-size="13" fill="#142639">
    <text x="24" y="24" font-weight="700" fill="#00599c">三兄弟选型对照 —— 一个函数一般只挑一个</text>
  </g>
  <g font-size="13" text-anchor="middle" font-weight="700">
    <rect x="30" y="38" width="190" height="30" fill="#eaf3fb" stroke="#00599c"/><text x="125" y="58" fill="#00599c">optional&lt;T&gt;</text>
    <rect x="225" y="38" width="190" height="30" fill="#e7f6ec" stroke="#1a7f42"/><text x="320" y="58" fill="#1a7f42">variant&lt;A,B,C&gt;</text>
    <rect x="420" y="38" width="190" height="30" fill="#fff3d6" stroke="#b8722b"/><text x="515" y="58" fill="#b8722b">expected&lt;T,E&gt;</text>
  </g>
  <g font-size="12" text-anchor="middle">
    <rect x="30" y="70" width="190" height="34" fill="#f5f6f8" stroke="#9aa6b5"/><text x="125" y="91">回答：有 还是 没有</text>
    <rect x="225" y="70" width="190" height="34" fill="#f5f6f8" stroke="#9aa6b5"/><text x="320" y="91">回答：是 A/B/C 哪一种</text>
    <rect x="420" y="70" width="190" height="34" fill="#f5f6f8" stroke="#9aa6b5"/><text x="515" y="91">回答：成没成、没成为何</text>
  </g>
  <g font-size="12" text-anchor="middle">
    <rect x="30" y="106" width="190" height="34" fill="#f5f6f8" stroke="#9aa6b5"/><text x="125" y="120">取值：value / value_or</text><text x="125" y="134">判：has_value / if(r)</text>
    <rect x="225" y="106" width="190" height="34" fill="#f5f6f8" stroke="#9aa6b5"/><text x="320" y="120">取值：get&lt;T&gt; / visit</text><text x="320" y="134">判：holds_alternative / index</text>
    <rect x="420" y="106" width="190" height="34" fill="#f5f6f8" stroke="#9aa6b5"/><text x="515" y="120">取值：value / error / value_or</text><text x="515" y="134">判：if(r) / has_value</text>
  </g>
  <g font-size="12" text-anchor="middle">
    <rect x="30" y="142" width="190" height="34" fill="#f5f6f8" stroke="#9aa6b5"/><text x="125" y="163">场景：查找、可能无解</text>
    <rect x="225" y="142" width="190" height="34" fill="#f5f6f8" stroke="#9aa6b5"/><text x="320" y="163">场景：混合类型集合</text>
    <rect x="420" y="142" width="190" height="34" fill="#f5f6f8" stroke="#9aa6b5"/><text x="515" y="163">场景：除法、IO、网络</text>
  </g>
  <g font-size="13" fill="#33465e">
    <text x="24" y="196">共同点：把「特殊情况」写进返回类型，编译器逼你当场处理</text>
    <text x="24" y="218">再也不会「忘记检查 -1」—— 老式暗号被这三只盒子接管</text>
  </g>
  <g font-size="13" text-anchor="middle">
    <rect x="30" y="232" width="580" height="72" rx="6" fill="#fff3d6" stroke="#b8722b"/>
    <text x="320" y="254" fill="#b8722b" font-weight="700">一句口诀</text>
    <text x="320" y="276" fill="#b8722b">可能没有 → optional；几选一 → variant；成败还带原因 → expected</text>
    <text x="320" y="294" fill="#b8722b" font-size="12">variant 没有 value_or / if(v)；optional 没有 error() —— 接口别串门</text>
  </g>
</svg>` },
        { t: `p`, text: `这张表是全课的心脏，从上往下三行读：先看**回答什么问题**定位该用哪个盒子，再看**怎么取值**把接口记牢，最后看**典型场景**把眼熟的活儿对上号。最底下那行黄框是最容易出错的地方 —— variant 和 optional 的接口互不通用，串门就编译不过，这也是下一段任务要你亲手判的东西。` },
        { t: `h2`, text: `演示 2 · 现场选型：从返回类型反推意图` },
        { t: `code`, lang: `c++`, code: `// 三个真实需求，各挑一个盒子（光看返回类型就能反推它要表达哪种「不普通」）
std::optional<int>                 first_even(const std::vector<int>& v);   // 可能一个偶数都没有 → optional
std::variant<int, std::string>     cell_of(const std::string& s);            // 这格是数还是字，二选一 → variant
std::expected<double, std::string> parse_num(const std::string& s);          // 会失败，还要说为什么 → expected` },
        { t: `p`, text: `拿到函数先想它的「不普通」是哪一种：first_even 可能根本找不到偶数、但没有「为什么找不到」这层含义 → optional；cell_of 一定有值、只是类型会在数和字之间换 → variant；parse_num 会失败且失败原因要交给调用方 → expected。三条返回类型一旦写进签名，调用方不翻注释就知道该怎么判、取什么。这三只盒子谁也不比谁高级，只有**合不合当前那张脸**。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `用 optional 硬装「失败」，结果丢了原因：返回空你只知道「没有」，到底是「没找到」还是「文件读不了」一概不分。要能说清为什么失败就该上 expected，别降级用 optional。`,
          `给 variant 写 value_or 或 if(v)：编译不过 —— 这俩是 optional 和 expected 的接口。variant 只有 index、holds_alternative、get、visit 这一套，别串门。`,
          `把 expected 的成功与错误类型写反：std::expected 第一个尖括号是成功 T、第二个才是错误 E，写成 expected<string, int> 就把「成功给字符串、失败给 int」颠倒了。`,
          `拿 variant 只列一种类型（如 variant<int>）：那等于自带一格永远亮着的 int，不如直接写 int —— variant 的全部意义在「多种里恰好选一种」。`,
          `一个返回值又想表「没有」又想表「原因」，就叠成 optional<expected<...>>：能编能用，但读的人要剥两层。多数时候 expected<T,E> 已经够 —— 失败就是那个「没有」、E 就是原因；只有「可能压根没发起这次调用」才值得再套一层 optional。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `挑一个你写过的函数，判断它最该用三者中的哪个，写一句为什么 —— 说清它想表达的那种「不普通」到底是「没有」「换类型」还是「失败带原因」。`,
          `给演示 2 那三个需求各补一句调用处的正确处理：first_even 用 has_value 判、cell_of 用 holds_alternative<int> 判、parse_num 失败时用 error() 取原因。`,
          `延伸：把「找不到某个用户名」和「密码校验失败」两个需求分别选盒子并说明理由 —— 前者 optional 就够，后者更适合 expected，因为你要告诉用户到底哪里错了。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：把「不普通」分成三种 —— 可能没有用 optional、类型几选一用 variant、成败还要带原因用 expected；记接口别串门：value_or 归 optional 与 expected、holds_alternative 归 variant、error() 归 expected。` }
      ]
    }
  ]
};
