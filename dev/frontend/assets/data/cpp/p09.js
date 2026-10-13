/* 喵站 · C++ 入门 正文分部 p09：第 39–42 课（第九轮）
 *
 * 源稿：学习资料/C++入门/39_嵌套循环.cpp ~ 42_尾部添加与删除.cpp。六栏课式照 p01/p04：
 *   tip(蓝·本课目标) → 原理讲解 → 它被设计成什么样 → 演示 N → 常见坑 → 任务 → tip(绿·本课一句话)
 *
 * 本分部守的几条：
 *   1. 字符串全用反引号做分隔符，正文、标题、代码里不出现反引号；标代码名裸写或用「」。
 *   2. 交叉引用只往回指：c39 引到第 20、33、35、37、38 课，c40 引到第 13、33、35、37 课，
 *      c41 引到第 15、33、35、40 课，c42 引到第 35、40、41 课，全部不越过本课课号。
 *      vector 是第 40 课的东西，所以 c39 的代码与正文一律不提它（往后指只说「下一课」）。
 *   3. 代码块只用本课及以前教过的构造：for（35）、range-for（37）、break/continue（38）、
 *      成员调用（13 起）、vector 与 size/at/back（40 起）。不碰 pair、constexpr、
 *      自定义函数定义、lambda、引用参数这些后面的课。
 *   4. 源稿每条【任务】原样进【任务】栏（每课 2 条 + 延伸 1 条），考卷里每条都有 coversTask 对着。
 *   5. 输出统一 std::print / std::println，带 int main 的块把头文件请齐（<print>、<vector>）。
 *   6. 配图三张：c39 的九九表格子、c40 的会自动伸缩的收纳盒、c41 的下标窗口与越界。
 *
 * 验收：node --check 两份文件
 *       node dev/tools/cpp-audit.cjs --part dev/frontend/assets/data/cpp/p09.js
 *       node dev/tools/cpp-exam-check.cjs --only c39,c40,c41,c42
 */
window.MIAO_CPP_P09 = {
  chapters: [
    {
      id: `c39`, title: `第 39 课 · 嵌套循环：分针转满一圈，时针才走一格`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把两层 for 摞起来写，看懂「外层走一步、内层跑满一圈」这个节奏，能用它打完一整张九九乘法表；顺带把执行次数算清楚 —— 内层到底跑了多少回，是这一课最容易考也最容易想歪的地方。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 35 课你写的循环只有一层：一个计数器从 1 走到 9，每走一步干一件事。今天把它**摞成两层** —— 在一个循环的循环体里，再放一整个 for。这不是语法上的炫技，而是因为你要处理的东西本身就有两个维度：表格有行也有列，屏幕有上下也有左右，一圈圈地数东西要数「几轮、每轮几个」。一层循环只能描出一条线，两层才铺得开一个面。` },
        { t: `p`, text: `打钟表的比方最贴切：**分针（内层）转满一圈，时针（外层）才挪一格**。具体的次序是这样：外层先取 i = 1，接着把**内层从头到尾完整跑一遍**（j 从它自己的初值一路走到条件不成立为止），跑完了控制权才回到外层；外层把 i 加 1，然后让内层**重新从初值开始**再跑一遍。这里最要紧的一句话是：**内层每一轮都是重新初始化**。你在这一轮看到 j 停在 9，下一轮它又变回 1 —— 因为 int j = 1 那个动作就写在外层的循环体里，外层每走一步它就被执行一次。` },
        { t: `p`, text: `把这个节奏自己数一遍就不神秘了：外层从 1 到 9 共 9 步，第 i 步里内层从 1 跑到 i，也就是跑 i 次。总次数是 1 + 2 + 3 + …… + 9 = 45，所以这张下三角一共打 45 个算式；两层都跑满 9 的话就是 9 × 9 = 81 个。**嵌套的真实代价是相乘**，这是这个词最实在的收获：内层遍数乘以外层遍数，就是你程序真正干活的次数。` },
        { t: `p`, text: `那为什么是外层管行、内层管列？答案在一句打印上：**换行动作写在外层的循环体里、内层的花括号外面**。内层只负责往同一行上贴东西（用不带 ln 的 std::print），贴满一圈回到外层，才由 std::println("") 把这一行收尾。谁管换行，谁就在外面 —— 位置一放反，九九表立刻塌成一条竖线，而编译器一声不吭。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `code`, lang: `text`, code: `外层 for（i 从 1 走到 9）        ← 管「第几行」，共走 9 步
   循环体里塞进一整个内层：
      内层 for（j 从 1 走到 i）   ← 管「这一行打几个」
         每步贴一个算式，不换行
      —— 内层跑满一圈，回到外层 ——
      std::println("")           ← 一行结束才换行
      外层 i 加 1，内层重新从 1 开始

总执行次数 = 外层步数 × 每步内层圈数（j 到 i 时是 1+2+……+9 = 45）` },
        { t: `p`, text: `图上缩进不是好看而已：嵌套的全部秘密就是**内层那对花括号被完整包在外层的花括号里**。写的时候别心疼空格，两级一档排清楚。看错缩进就会以为那句 println("") 也在内层里，而编译器按花括号算、不按缩进算 —— 于是你的表格变成一条竖线，还得从头找起。` },
        { t: `svg`, caption: `上限跟着 i 走就打出一个三角：外层挪一格，内层把这一行填满`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300">
  <text x="20" y="26" font-size="14" font-weight="700" fill="#142639">外层管行，内层管列：外层走一步，内层跑满一圈</text>
  <g font-size="13" fill="#57677c">
    <text x="20" y="66">外层第 1 步</text>
    <text x="20" y="106">外层第 2 步</text>
    <text x="20" y="146">外层第 3 步</text>
    <text x="20" y="186">外层第 4 步</text>
  </g>
  <g font-size="13" fill="#142639" text-anchor="middle">
    <rect x="150" y="50" width="74" height="26" rx="4" fill="#dff0e2" stroke="#1a7f42" stroke-width="2"/><text x="187" y="68">1×1</text>
    <rect x="150" y="90" width="74" height="26" rx="4" fill="#dff0e2" stroke="#1a7f42" stroke-width="2"/><text x="187" y="108">1×2</text>
    <rect x="230" y="90" width="74" height="26" rx="4" fill="#dff0e2" stroke="#1a7f42" stroke-width="2"/><text x="267" y="108">2×2</text>
    <rect x="150" y="130" width="74" height="26" rx="4" fill="#dff0e2" stroke="#1a7f42" stroke-width="2"/><text x="187" y="148">1×3</text>
    <rect x="230" y="130" width="74" height="26" rx="4" fill="#dff0e2" stroke="#1a7f42" stroke-width="2"/><text x="267" y="148">2×3</text>
    <rect x="310" y="130" width="74" height="26" rx="4" fill="#dff0e2" stroke="#1a7f42" stroke-width="2"/><text x="347" y="148">3×3</text>
    <rect x="150" y="170" width="74" height="26" rx="4" fill="#dff0e2" stroke="#1a7f42" stroke-width="2"/><text x="187" y="188">1×4</text>
    <rect x="230" y="170" width="74" height="26" rx="4" fill="#dff0e2" stroke="#1a7f42" stroke-width="2"/><text x="267" y="188">2×4</text>
    <rect x="310" y="170" width="74" height="26" rx="4" fill="#dff0e2" stroke="#1a7f42" stroke-width="2"/><text x="347" y="188">3×4</text>
    <rect x="390" y="170" width="74" height="26" rx="4" fill="#dff0e2" stroke="#1a7f42" stroke-width="2"/><text x="427" y="188">4×4</text>
  </g>
  <path d="M500 63 H560" stroke="#00599c" stroke-width="2"/>
  <text x="500" y="56" font-size="12" fill="#00599c">内层往右填满</text>
  <path d="M130 205 V215" stroke="#b8722b" stroke-width="2"/>
  <text x="120" y="232" font-size="13" fill="#142639">上限写成 j 到 i → 4 行共 1+2+3+4 = 10 格</text>
  <text x="120" y="256" font-size="13" fill="#b8722b">上限写死成 j 到 9 → 每行都满，9 行 81 格</text>
  <text x="20" y="284" font-size="13" fill="#57677c">换行那句在内层花括号外面，所以一行打完才另起一行</text>
</svg>` },
        { t: `h2`, text: `演示 1 · 先把节奏打出来：谁跑了多少回` },
        { t: `code`, lang: `c++`, code: `#include <print>

int main() {
    for (int i = 1; i <= 3; i++) {
        std::println("外层第 {} 步", i);
        for (int j = 1; j <= 4; j++) {
            std::print("    j = {}  ", j);
        }
        std::println("");
    }

    return 0;
}` },
        { t: `p`, text: `屏幕上是这样：「外层第 1 步」一行，紧跟着四个 j 一行，再「外层第 2 步」，又是四个 j。**三行 j 的内容一模一样，全是 1 2 3 4** —— 这就是「内层每轮重新从 1 开始」的现场证据，也是这段程序最值得盯的地方。数一遍次数：外层走 3 步，内层每步跑 4 回，内层那一行一共执行了 12 次，而收尾那句 println("") 只执行了 3 次。把这个对应关系看懂，九九表那 45 次不用别人告诉你。` },
        { t: `h2`, text: `演示 2 · 九九乘法表（源稿这段）` },
        { t: `code`, lang: `c++`, code: `#include <print>

int main() {
    for (int i = 1; i <= 9; i++) {         // 外层：第 i 行
        for (int j = 1; j <= i; j++) {     // 内层：打 i 个算式
            std::print("{}×{}={}  ", j, i, i * j);
        }
        std::println("");                  // 一行结束，换行
    }

    return 0;
}` },
        { t: `p`, text: `门道全在内层的条件 **j <= i** 上：第 1 行只打 1 个，第 9 行打满 9 个，所以出来的是**下半三角**而不是整张表。这是设计上的取舍 —— 3×5 和 5×3 得数相同，下半张表把重复的那一半省掉了，45 个算式已经覆盖全部乘法。再看三处细节：外层用 i 当「行号」，内层用 j 当「这一行的第几项」，得数 i * j 当场算出来、不查表；每个算式后面故意写两个空格当间隔，因为 std::print 不换行；最后那句 std::println("") 的参数是一个空串，它唯一的作用是换行 —— 这种「只为换行而写的 println」以后会常见到。` },
        { t: `h2`, text: `演示 3 · 只改一个数字，塌成完整方阵（源稿任务 1）` },
        { t: `code`, lang: `c++`, code: `for (int i = 1; i <= 9; i++) {
    for (int j = 1; j <= 9; j++) {     // 把 j <= i 改成 j <= 9
        std::print("{}×{}={}  ", j, i, i * j);
    }
    std::println("");
}` },
        { t: `p`, text: `内层的上限从「跟着 i 走」变成「写死 9」，形状立刻从三角变成长方形：每行 9 个、共 81 个算式。这一改是本课最好的实验，因为它让你亲眼看见**内层的边界决定了这一行的长度**。反过来玩更有意思：把内层写成 j 从 i 走到 9，出来是个上三角；把外层改成 9 到 1 递减，整张表就倒了过来。一个数字换来几种形状，「嵌套」这两个字的意思就在这里 —— 你动的不是某个字符，是一整圈的边界。` },
        { t: `h2`, text: `演示 4 · 五行星号：第 i 行有 i 个（源稿任务 2）` },
        { t: `code`, lang: `c++`, code: `#include <print>

int main() {
    for (int i = 1; i <= 5; i++) {
        for (int j = 1; j <= i; j++) {
            std::print("*");
        }
        std::println("");              // 每行打完换行
    }

    return 0;
}` },
        { t: `p`, text: `输出是五行，星号个数依次 1、2、3、4、5。它跟九九表是**同一个骨架换了里面的内容**：外层管几行，内层管这一行几个字符，外面那句 println("") 负责收尾。能把九九表删剩这三行、再把算式换成一个星号，你就真的会写嵌套了 —— 因为这时你抄的不是代码，是一个模式。想再练一手：把内层上限改成 6 - i，倒三角就出来了；把 std::print("*") 换成打印 j，每格数字跟着列号走，你会立刻看清「内层变量管列」这句话是什么意思。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把换行那句塞进内层。std::println("") 一旦落进内层的花括号，每贴一个算式就换一行，九九表塌成一条竖线。**一个报错都没有**，纯形状错，只能靠读输出反推 —— 所以「谁管换行谁在外面」这句话要背下来。`,
          `内外层用同一个变量名：两层都写 int i。编译器当场拦下，报错那行大意是「i 重复声明」。这不是刁难，是救你：两个圈共用一个计数器根本走不动，外层会被内层改乱。`,
          `把内层的 j 声明到外层前面去（先写 int j = 1，再套两个 for）。第二圈 j 不再从 1 开始，而是接着上一轮的尾巴往下走，表格只剩第一行齐的，后面全空 —— 内层要每轮重新初始化，声明就得写在内层里。`,
          `次数算漏或边界差一格。外层 n 步、内层每步 m 次，总共是 n × m 次不是 m 次；而 i <= 9 是 9 步、i < 9 只有 8 步，九九表少最后一行你未必看得出来。`,
          `贪层数。三层各 10 圈是一千次还能跑，层数再加就往十万、百万跳，屏幕刷不完，程序看着像死掉了。以后写排序会碰到两层扫一整排数，那时**动手之前先把乘出来的遍数算一遍**。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把内层条件改成 j <= 9，看看变成完整方阵`,
          `用嵌套循环打印 5 行星号：第 i 行有 i 个 *`,
          `延伸：再打一个 5 行的倒三角（第 1 行 5 个星号，逐行少一个）。先在内层上限的式子里把「6 - i」算出来，再动手，跑完对照你纸上写的形状。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：嵌套循环 = 外层管行、内层管列，外层挪一格内层跑满一整圈且每轮都从头开始；换行那句要在内层的花括号外面，总遍数是两层次数相乘。` }
      ]
    },
    {
      id: `c40`, title: `第 40 课 · 初识 vector：一只格子数会自己伸缩的收纳盒`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会造一只 std::vector，认得尖括号里那个「房型」，并用 size() 问出现在装了几个 —— 顺便把三种造法的分工分清：花括号列内容、圆括号写个数、什么都不写的盒子是合法的零格状态。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `到这里为止你手里的盒子一次只装一个数：int a 装一个，double b 装一个。可真实的问题从来不是一次一个 —— 一个班几十次成绩、一周七天气温、购物车里不知道几件货。你当然可以声明四十个变量再编号取名，但那不叫编程，叫抄表格。C++ 给「一排同类型的东西」准备了 **std::vector**：一只**格子数会自己伸缩的收纳盒**。第 13 课学 string 时你已经见过「一个东西里排着一串格子」，vector 是同一个思路，只不过格子里装的不限字符，int、double、string 都能排成一排。` },
        { t: `p`, text: `写法上唯一的新东西是**尖括号**：std::vector<int> 念作「装 int 的盒子」，尖括号里写的是**这一整只盒子的房型**，不是某个值。装小数就写 std::vector<double>，装名字就写 std::vector<std::string>。房型后面照常跟盒子名和初值：std::vector<int> scores = {85, 92, 78}; 等号后面那对花括号是「出生时就装好的内容」，逗号隔开，想写几个写几个，格子数也跟着内容自动定成 3。` },
        { t: `p`, text: `为什么反复强调「会自动伸缩」？因为一只 vector **自己知道自己现在有几格**，而格子数可以在程序跑起来之后变多变少。问它装了几个的动作叫 **size()**：scores.size() 得 5。这个写法从第 13 课就熟了 —— 一个数据后面加点、再点一个动词，读作「问这只盒子办一件事」，所以 size 后面那对圆括号一个都不能少。` },
        { t: `p`, text: `造盒子有三条路，各配各的场景。**第一条**是花括号列内容，内容你已知、就三五个，最直观。**第二条**是 std::vector<int> zeros(5, 0)，圆括号里两个数字：**先说几格，再说每格放什么**，5 个 0 一键生成，适合「先把坑挖好、东西以后再填」。**第三条**是 std::vector<int> empty_box; 什么都不装，size() 得 0，格子等以后往尾部添。三条路记成一句话就够用：**花括号管内容，圆括号管个数**。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `code`, lang: `text`, code: `std::vector<int> scores = {85, 92, 78, 96, 88};
   └─ 尖括号：房型，整盒统一装 int
                     └─ 盒子名        └─ 花括号：出生时装好的内容

std::vector<int> zeros(5, 0);     圆括号版：先「几格」，后「每格放什么」
std::vector<int> empty_box;       一格不装，size() 得 0（合法状态）

scores.size()                     问一句：现在装了几个 → 5` },
        { t: `p`, text: `顺手把第二行那句「合法状态」说清楚：很多人以为盒子空着算出错，其实完全不是 —— 空盒子真实存在，只是里面还没有格子，size() 老实回你 0。真正危险的是**拿编号去取一个不存在的格子**，那是下一课的头号事故，今天只要记住「空是允许的，取空盒子里的东西不允许」这条分界。` },
        { t: `svg`, caption: `同一族的三种盒子：列内容的、按个数生成的、还空着的，size() 各报各的`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300">
  <text x="20" y="26" font-size="14" font-weight="700" fill="#142639">std::vector 装 int 的三只盒子</text>
  <text x="20" y="56" font-size="13" fill="#57677c">scores 用花括号列内容</text>
  <g font-size="14" fill="#142639" text-anchor="middle">
    <rect x="20" y="64" width="70" height="38" fill="#dff0e2" stroke="#1a7f42" stroke-width="2"/><text x="55" y="89">85</text>
    <rect x="92" y="64" width="70" height="38" fill="#dff0e2" stroke="#1a7f42" stroke-width="2"/><text x="127" y="89">92</text>
    <rect x="164" y="64" width="70" height="38" fill="#dff0e2" stroke="#1a7f42" stroke-width="2"/><text x="199" y="89">78</text>
    <rect x="236" y="64" width="70" height="38" fill="#dff0e2" stroke="#1a7f42" stroke-width="2"/><text x="271" y="89">96</text>
    <rect x="308" y="64" width="70" height="38" fill="#dff0e2" stroke="#1a7f42" stroke-width="2"/><text x="343" y="89">88</text>
  </g>
  <text x="400" y="89" font-size="14" font-weight="700" fill="#1a7f42">scores.size() = 5</text>
  <text x="20" y="132" font-size="13" fill="#57677c">nines 用圆括号生成：3 格，每格放 9</text>
  <g font-size="14" fill="#142639" text-anchor="middle">
    <rect x="20" y="140" width="70" height="38" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="55" y="165">9</text>
    <rect x="92" y="140" width="70" height="38" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="127" y="165">9</text>
    <rect x="164" y="140" width="70" height="38" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="199" y="165">9</text>
  </g>
  <text x="256" y="165" font-size="14" font-weight="700" fill="#00599c">nines.size() = 3</text>
  <text x="20" y="208" font-size="13" fill="#57677c">empty_box 一格不装</text>
  <rect x="20" y="216" width="150" height="38" fill="none" stroke="#b8722b" stroke-width="2" stroke-dasharray="6 4"/>
  <text x="95" y="241" font-size="13" fill="#b8722b" text-anchor="middle">（还没有格子）</text>
  <text x="200" y="241" font-size="14" font-weight="700" fill="#b8722b">empty_box.size() = 0</text>
  <text x="20" y="284" font-size="13" fill="#142639">格子数由盒子自己记着，能变多也能变少 —— 这是它跟一只 int 盒子最大的分别</text>
</svg>` },
        { t: `h2`, text: `演示 1 · 三只盒子站在一起（源稿这段）` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>

int main() {
    std::vector<int> scores = {85, 92, 78, 96, 88};
    std::vector<int> zeros(5, 0);        // 5 个格子，全放 0
    std::vector<int> empty_box;          // 空盒子

    std::println("scores 装了 {} 个", scores.size());
    std::println("zeros  装了 {} 个", zeros.size());
    std::println("empty_box 装了 {} 个", empty_box.size());

    return 0;
}` },
        { t: `p`, text: `三行输出是 5、5、0。三只盒子同族（房型都是装 int），里面却各不相同：第一只你手工点了五个数，第二只让盒子自己造五格再统一填 0，第三只一格都没有。那个 **0 是 size() 老实报给你的答案**，不是错误码 —— 空盒子存在得很好，只是现在谁也没有。` },
        { t: `h2`, text: `演示 2 · 换个房型装小数（源稿任务 1）` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>

int main() {
    std::vector<double> homework = {92.5, 88.0, 79.5};

    std::println("一共 {} 次作业", homework.size());
    for (double one : homework) {         // 第 37 课的 range-for，盒子能直接遍历
        std::print("{}  ", one);
    }
    std::println("");

    return 0;
}` },
        { t: `p`, text: `尖括号里的 int 换成 double，整盒的房型就改了，92.5 这种小数一格装一个，size() 报 3。另一半看点是那句 range-for：它天生就是为「一串东西，一个一个拿」准备的，喂给它一只盒子完全合拍 —— 不用写计数器，不用问长度，也不会越界，这在你还不会用下标的今天尤其好用。输出是一行 3、一行三个数 92.5 88 79.5（第 11 课说过 double 打印会把末尾的 0 省掉，88.0 打成 88 是正常的）。` },
        { t: `h2`, text: `演示 3 · 把 5 和 0 换成 3 和 9（源稿任务 2）` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>

int main() {
    std::vector<int> zeros(5, 0);        // 5 个格子，全放 0
    std::vector<int> nines(3, 9);        // 源稿任务 2：个数改 3，内容改 9

    for (int one : nines) {
        std::print("{} ", one);          // 9 9 9
    }
    std::println("   ← 共 {} 格", nines.size());

    return 0;
}` },
        { t: `p`, text: `圆括号里**前一个数字是个数，后一个数字是每格放什么**，所以 (3, 9) 出来是三格、每格一个 9。顺序颠倒就完全是另一回事：写成 (9, 3) 得到 9 个 3，写成 (0, 5) 得到一只空盒子（0 格），程序一声不响、循环一次也不执行。这一课先把顺序刻进肌肉记忆，因为下一课要开始按编号取格子，到那时「盒子比想象的小」就再也不是安静的问题了。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `忘写 #include <vector>。报错指着 std::vector 那一行，大意是「命名空间 std 里没有叫 vector 的东西」。看见这条先去请头文件，别去动尖括号 —— print 那个头文件只管打印，盒子不住在那儿。`,
          `尖括号里写成值：std::vector<5>。尖括号要的是**类型名**（int、double、std::string），塞数字进去编译器当场看不懂。房型只能由类型决定，跟装几个毫无关系。`,
          `圆括号那条把两个数字说反。zeros(5, 0) 是 5 个 0，zeros(0, 5) 是 0 个格子 —— 它照样编译、照样跑、size() 老实地回 0，只是你后面的循环一次都没进。「程序安静地什么都没干」是最难查的一类 bug，这条坑一定要亲手跑一遍。`,
          `想往一盒里混两种房型。std::vector<int> 的初值里写 {1, 2, 3.5}，编译期就被拦下，报错里那句 narrowing conversion 说的正是「小数塞进 int 格子要掉小数部分，我不干」。房型统一是 vector 的本钱：格子一模一样，它才搬得动、扩得开。`,
          `把 size() 写成 size，或者写成 size(0)。它是「盒子自己的动作」，加点、名字、空圆括号三样齐全才算一次询问 —— 跟第 13 课那句 length() 是同一套规矩。`,
          `拿 size() 当「最后一格的编号」。5 个格子的编号是 0 到 4，最大那个**比 size() 少 1**；这条差一的规矩今天先记住结论，下一课整课就在收拾它。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `建一个 vector<double> 装三门课的分数，打印 size`,
          `把 5 和 0 换成 3 和 9，看 zeros 变成什么样`,
          `延伸：再造一只 std::vector<std::string> 装三个名字，用 range-for 一行一个打出来并打印 size()；然后把初值整个去掉换成空盒子，再看 size() 变成几、循环有没有执行一次。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：std::vector 房型 是一排房型统一的格子 —— 花括号列内容、圆括号写「几格 + 每格放什么」，size() 报现在有几个；格子数盒子自己管，这是收纳盒跟一只 int 盒子的根本区别。` }
      ]
    },
    {
      id: `c41`, title: `第 41 课 · 下标取元素：编号从 0 数，最后一格永远比 size() 少 1`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会用 scores[i] 按编号取一只盒子里的某一格，把「第 N 个写 N-1」和「5 个格子最大编号是 4」这两条刻进手指；再认清 at() 和方括号的差别 —— 一个越界会当场告诉你，一个越界闷声不响地把程序弄坏。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课你会造盒子了，可造出来不取用等于没造。盒子里每一格都有**编号**（正式名字叫**下标**，因为它写在方括号里），而编号**从 0 开始数**：scores 那五个数里，85 站在 0 号格，92 在 1 号，78 在 2 号。取一格的写法是**盒子名加方括号**：scores[0] 得 85，scores[2] 得 78。这条规矩你在第 15 课按门牌号取字符时撞见过，盒子和字符串用的是同一套门牌。` },
        { t: `p`, text: `为什么要从 0 数？因为编号的真实含义是**离起点差几格**，不是「第几个」：第一格跟起点差 0 格，所以它是 0 号。理解成「偏移量」比理解成「序号」更贴近机器的做法，也顺手解释了那件反直觉的事 —— **你脑子里想的第 N 个，手上要写 N-1**。` },
        { t: `p`, text: `第二件事全课最要紧：5 个格子的盒子，编号是 0、1、2、3、4，**最大编号比 size() 少 1**，写成公式就是「最后一格 = size() - 1」。很多人顺手写 scores[scores.size()]，那一格根本不存在 —— 门牌只数到 4 的巷子，你偏去敲 5 号的门。这个错的名字叫**越界**，本课第二个任务就是专门去踩一次，让你以后每次写方括号都先数一遍。` },
        { t: `p`, text: `不想自己算最后一格，就问盒子：**back()** 直接给你尾上一格，**front()** 给你头上一格，写法沿用上一课的 size()：加点、动词、空圆括号，scores.back() 得 88。它好在**跟格子数无关** —— 盒子从 5 格变成 3 格，back() 照样给当时最后一格，而 scores[4] 立刻越界。能用 back() 和 front() 就别手写编号，这是唯一防得住「差一」的偷懒。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `code`, lang: `text`, code: `scores[编号]      按门牌取一格：编号是「差几格」，从 0 数
scores.front()    头一格（等于 scores[0]）
scores.back()     尾上一格（等于 scores[size() - 1]，但不用你算）
scores.at(编号)   同样取一格，但先查门牌存不存在

共 size() 格 → 编号 0 到 size()-1 →「第 N 个」写 N-1` },
        { t: `p`, text: `方括号和 at() 取到的是同一格，区别只在**查不查**：方括号信任你，编号递过去它就直接开门，不存在也不问；at() 先看一眼这格在不在，不在就当场停下把话说明白。所以老手的分法是：**编号没把握时用 at()，编号由循环算稳了才用方括号**。` },
        { t: `svg`, caption: `5 个格子的编号是 0 到 4；5 号格不存在，递过去就是越界`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280">
  <text x="20" y="26" font-size="14" font-weight="700" fill="#142639">std::vector 装 int 的 scores = 85, 92, 78, 96, 88</text>
  <g font-size="15" fill="#142639" text-anchor="middle">
    <rect x="20" y="48" width="74" height="44" fill="#dfe8f6" stroke="#00599c" stroke-width="3"/><text x="57" y="76">85</text>
    <rect x="96" y="48" width="74" height="44" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="133" y="76">92</text>
    <rect x="172" y="48" width="74" height="44" fill="#dff0e2" stroke="#1a7f42" stroke-width="3"/><text x="209" y="76">78</text>
    <rect x="248" y="48" width="74" height="44" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="285" y="76">96</text>
    <rect x="324" y="48" width="74" height="44" fill="#f6e7d8" stroke="#b8722b" stroke-width="3"/><text x="361" y="76">88</text>
    <rect x="400" y="48" width="74" height="44" fill="none" stroke="#b8722b" stroke-width="2" stroke-dasharray="6 4"/><text x="437" y="76" fill="#b8722b">没有</text>
  </g>
  <g font-size="12" fill="#57677c" text-anchor="middle">
    <text x="57" y="112">0</text><text x="133" y="112">1</text><text x="209" y="112">2</text>
    <text x="285" y="112">3</text><text x="361" y="112">4</text><text x="437" y="112">5</text>
  </g>
  <text x="57" y="40" font-size="12" fill="#00599c" text-anchor="middle">front / 方括号 0</text>
  <text x="209" y="40" font-size="12" fill="#1a7f42" text-anchor="middle">方括号 2 是第三个</text>
  <text x="361" y="40" font-size="12" fill="#b8722b" text-anchor="middle">back 免算长度</text>
  <text x="437" y="140" font-size="13" font-weight="700" fill="#b8722b" text-anchor="middle">越界</text>
  <text x="20" y="164" font-size="13" fill="#142639">共 5 格 → 编号 0 到 4，也就是 size() 减 1；第 N 个要写 N 减 1</text>
  <rect x="20" y="180" width="600" height="84" rx="10" fill="#f6e7d8" stroke="#b8722b" stroke-width="2"/>
  <text x="40" y="206" font-size="13" font-weight="700" fill="#8a4f16">递一个不存在的编号，两种写法两种下场</text>
  <text x="40" y="230" font-size="13" fill="#8a4f16">方括号：一声不响，拿到垃圾值或者把程序弄坏，报错可能到很久以后才出现</text>
  <text x="40" y="254" font-size="13" fill="#8a4f16">at 版本：当场终止，报错里带 out_of_range 字样，位置就在你写错的那一行</text>
</svg>` },
        { t: `h2`, text: `演示 1 · 头、中、尾各取一格（源稿这段）` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>

int main() {
    std::vector<int> scores = {85, 92, 78, 96, 88};

    std::println("第一个: {}", scores[0]);
    std::println("第三个: {}", scores[2]);
    std::println("最后一个: {}", scores.back());   // 免算长度

    return 0;
}` },
        { t: `p`, text: `三行输出 85、78、88。第二行是本课的验算题：**「第三个」写的是 scores[2]**，因为 0 号被第一个占了。第三行走的是 back()，它比 scores[4] 好的地方不是短，而是**它跟着盒子变** —— 你把初值改成三个数，back() 照样给最后一个，而 scores[4] 立刻越界。三行连起来读就是图上那三处标注：头、按编号、尾。` },
        { t: `h2`, text: `演示 2 · 第 2 个和第 4 个（源稿任务 1）` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>

int main() {
    std::vector<int> scores = {85, 92, 78, 96, 88};

    std::println("第 2 个: {}", scores[1]);        // 92
    std::println("第 4 个: {}", scores[3]);        // 96
    std::println("共 {} 格，最后一格的编号是 {}", scores.size(), scores.size() - 1);
    std::println("front 是 {}，back 是 {}", scores.front(), scores.back());

    return 0;
}` },
        { t: `p`, text: `输出是 92、96、共 5 格最后一格 4、front 85 back 88。这个源稿任务看着最笨，其实是全课最值钱的一行练习：写方括号之前先在脑子里做一次减法 —— **第 2 个 → 编号 1，第 4 个 → 编号 3**。至于那句 size() 减 1：它就是「最后一个编号」的正规算法，方括号里直接写出来效果等于 back()，不过既然盒子已经给了 back()，就不必自己减这一刀。` },
        { t: `h2`, text: `演示 3 · 数到 5 号格：越界就是这么吓人（源稿任务 2）` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>

int main() {
    std::vector<int> scores = {85, 92, 78, 96, 88};   // 只有 0 到 4 号格

    std::println("{}", scores.at(4));    // 88：4 号格在，正常
    std::println("{}", scores.at(5));    // 5 号格不存在：程序当场终止

    return 0;
}` },
        { t: `p`, text: `先跑 at(4) 那一行，再跑 at(5)：程序会在第二句 println 上**当场停下**，屏幕上留一行终止信息，里面带 **out_of_range** 这个字样，大意是「编号 5 超出范围」。这种「宁可炸给你看，也不递给你一个错值」的性格就是 at() 的全部价值。真正的坑在另一个写法：把 scores.at(5) 换成 **scores[5]**，它**不保证报什么错** —— 你可能拿到一个莫名其妙的数字，可能在很远的一行才崩，也可能这次跑得好好的、明天换台机器就坏。C++ 管这叫未定义行为，翻译成人话是：**标准不管，编译器想怎样就怎样**。所以入门阶段的硬规矩：编号来自计算、来自输入、来自别的变量的，先用 at() 走一遍，确认它老实了再谈方括号。` },
        { t: `h2`, text: `演示 4 · 用循环把一整盒走完` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>

int main() {
    std::vector<int> scores = {85, 92, 78, 96, 88};

    for (int i = 0; i < scores.size(); i++) {
        std::println("第 {} 个是 {}", i + 1, scores[i]);
    }
    std::println("一共 {} 格", scores.size());

    return 0;
}` },
        { t: `p`, text: `这是第 35 课的 for 第一次派上真用场：计数器 **i 从 0 起**、条件是 **i 小于 size()**（不是小于等于），一圈走 5 步，编号正好 0 到 4，一格不越界。两个细节：打印里用 i + 1，是把机器的编号换算回人说的「第几件」；条件要是写成小于等于就会多走一步，而多走的那一步正好读到不存在的地方 —— 那种错往往不炸，只是尾巴上多出一个谁也没写过的怪数字，你现在知道它从哪来了。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `编号从 1 开始数，于是 scores[1] 当成第一个。5 个格子的盒子，第一个在 0 号、最后一个只有 4 号；这条不亲手错一次记不住，所以任务 1 必须真跑。`,
          `循环条件写成「小于等于 size()」。size() 是「几格」不是「最大编号」，等于号让循环多走一步，多走那一步正好读到不存在的地方。**它不一定报错**，最常见的现象是最后一行打出一个谁也没写过的怪数字。`,
          `拿 scores[size()] 当最后一个。这个编号天生越界：5 格盒子的 size() 是 5，最后一格在 4 号。要么写 size() - 1，要么直接问 back()。`,
          `以为 at() 和方括号可以随便换。at() 越界当场终止并留下 out_of_range 字样，方括号越界**什么都不保证**。调试期用 at()，编号来源可靠了才用方括号。`,
          `对空盒子调用 front() 或 back()。0 格的盒子没有头也没有尾，这两句都是越界级别的错误 —— 上一课说过空盒子是合法状态，但**合法的盒子不等于任何编号都合法**。`,
          `被一行编译器警告唬住，说比较两边一边有符号一边无符号。i 小于 size() 这个形状在入门阶段照常用，警告不是错误；别为了消警告把编号改成从 1 数，那才是真出事。类型那一层以后再讲。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `打印第 2 个和第 4 个元素（下标该写几？）`,
          `试试 scores[5] 会发生什么——越界就是这么吓人`,
          `延伸：把演示 4 改成倒着走（编号从 size() 减 1 递减到 0），打出 88 96 78 92 85；再用第 37 课的 range-for 把这五个数加起来打总分，比较两种写法哪种要你亲手数格子。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：编号是「差几格」，从 0 数 —— 第 N 个写 N-1，最后一格是 size() 减 1；方括号信任你、越界闷声坏事，at() 会查门牌、越界当场终止并报 out_of_range。` }
      ]
    },
    {
      id: `c42`, title: `第 42 课 · push_back / pop_back：只在队尾进出`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会用 push_back 往尾部排进一个、用 pop_back 把尾部请出去，并且每动一下就重新看一眼 size() 和 back() —— 它们是同步变的；再搞清一件事：对空盒子 pop_back 是闯祸级别的错，动手前先问一句有没有人。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `前两课造好的盒子，格子数在出生那一刻就定了：花括号列了几个就几格，圆括号说了几个就几格。可真实场景里的数量事先根本不知道 —— 作业是一次一次交上来的，订单是一条一条进来的，菜单是一道一道加的。**「会自动伸缩」这句承诺，到这一课才真的兑现**：vector 给了两个动作，全都发生在尾部 —— **push_back 排到队尾（盒子自动多一格）**，**pop_back 把队尾请出去（盒子自动少一格）**。` },
        { t: `p`, text: `名字的钥匙就在上一课：那个 back 跟 scores.back() 说的是**同一个位置**，也就是盒子的尾巴。所以「加到尾巴」「删尾巴那一个」这两个动作，从名字上就能读出它动哪一格，不用猜。反过来也别乱造词：今天这一对只管尾部，头部和中间都插不进去（往中间塞东西是以后的课），你能做的就是把人来排队尾、或者让队尾那个离队。` },
        { t: `p`, text: `为什么设计成只在尾部快？因为格子是**连着排**的：往最前面塞一个，后面每一格都得整体往右挪一位；往最后面加一个，后面没有人，直接站下就行。删同理。这个不对称就是 vector 性格的来源 —— 尾部进出便宜，越往前越贵。你以后会看到有人为了避开「整体挪动」改用别的数据结构，那是很后面的事了，今天只要记住：**能排在尾巴上解决的，就别往前面塞**。` },
        { t: `p`, text: `最该盯住的是**动作之后的三个变化**：push_back 之后 size() 多 1、back() 换成刚进来的那个；pop_back 之后 size() 少 1、back() 退回前一格。而**前面那些格子的编号一个都没变** —— 请走的正好是最大编号那一格，剩下的人原地不动。这就是尾部进出比手工数格子安全的地方：你不需要重算任何东西，盒子自己把账结清了。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `code`, lang: `text`, code: `box.push_back(x)    队尾排进一个 x：格子数加一，back 换成 x
box.pop_back()      队尾那一个离队：格子数减一，back 退回前一格

两句话都改的是 box 自己 —— 不需要拿变量接结果
动完重新问：box.size()（几格）、box.back()（尾上是哪个）
空盒子（0 格）没有尾巴，pop_back 与 back() 都无处可取` },
        { t: `p`, text: `这一对动作还有个常被忽略的性格：**push_back 什么盒子都能接**，包括上一课那种一只格子都没有的空盒子。所以「先声明一只空盒，来一条加一条」是最常见的一起手式，比先猜个大小再手工填要稳。而 pop_back 恰恰相反，它对空盒子无能为力 —— 请谁走呢？这个不对称是今天全部风险所在。` },
        { t: `svg`, caption: `队尾进出：push_back 多一格、pop_back 少一格，size 与 back 跟着一起变`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300">
  <text x="20" y="26" font-size="14" font-weight="700" fill="#142639">std::vector 装 int 的 scores 从头到尾只有尾巴在动</text>
  <g font-size="14" fill="#142639" text-anchor="middle">
    <rect x="20" y="44" width="66" height="38" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="53" y="69">85</text>
    <rect x="88" y="44" width="66" height="38" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="121" y="69">92</text>
    <rect x="156" y="44" width="66" height="38" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="189" y="69">78</text>
  </g>
  <text x="240" y="69" font-size="13" fill="#57677c">size 3，back 78（编号 0、1、2）</text>
  <text x="20" y="112" font-size="13" font-weight="700" fill="#1a7f42">scores.push_back(100)</text>
  <g font-size="14" fill="#142639" text-anchor="middle">
    <rect x="20" y="122" width="66" height="38" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="53" y="147">85</text>
    <rect x="88" y="122" width="66" height="38" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="121" y="147">92</text>
    <rect x="156" y="122" width="66" height="38" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="189" y="147">78</text>
    <rect x="224" y="122" width="66" height="38" fill="#dff0e2" stroke="#1a7f42" stroke-width="3"/><text x="257" y="147">100</text>
  </g>
  <text x="310" y="147" font-size="13" fill="#1a7f42">size 4，back 100，前面三格编号一个没变</text>
  <text x="20" y="190" font-size="13" font-weight="700" fill="#b8722b">scores.pop_back()</text>
  <g font-size="14" fill="#142639" text-anchor="middle">
    <rect x="20" y="200" width="66" height="38" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="53" y="225">85</text>
    <rect x="88" y="200" width="66" height="38" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="121" y="225">92</text>
    <rect x="156" y="200" width="66" height="38" fill="#f6e7d8" stroke="#b8722b" stroke-width="3"/><text x="189" y="225">78</text>
    <rect x="224" y="200" width="66" height="38" fill="none" stroke="#b8722b" stroke-width="2" stroke-dasharray="6 4"/><text x="257" y="225" fill="#b8722b">空</text>
  </g>
  <text x="310" y="225" font-size="13" fill="#b8722b">size 3，back 退回 78</text>
  <text x="20" y="266" font-size="13" font-weight="700" fill="#8a4f16">0 格的盒子没有尾巴：pop_back 无处可请，back 无处可取 —— 都是越界级别的错</text>
  <text x="20" y="288" font-size="13" fill="#57677c">规矩：动一下就重新问一次 size 和 back，别拿上一轮的编号当依据</text>
</svg>` },
        { t: `h2`, text: `演示 1 · 加一个、再加一个再删掉（源稿这段）` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>

int main() {
    std::vector<int> scores = {85, 92, 78};

    scores.push_back(100);               // 尾部加一个 100
    std::println("加后：{} 个，最后是 {}", scores.size(), scores.back());
    scores.push_back(60);
    scores.pop_back();                   // 把刚加的 60 请出去
    std::println("删后：{} 个，最后是 {}", scores.size(), scores.back());

    return 0;
}` },
        { t: `p`, text: `两行输出：「加后 4 个，最后是 100」「删后 3 个，最后是 78」。这里藏着一个必须现在就看清楚的现象 —— **pop_back 请走的是最近进来的那个 60，不是它前面的 100**。盒子记的是顺序，删的永远是尾巴，所以你连着加三个再删一个，走的是最后那位。源稿这段故意把 push_back(60) 和 pop_back() 挨着写，效果等于「什么都没发生」，但这一趟把两个动作各跑了一遍，值得照着敲一次。` },
        { t: `h2`, text: `演示 2 · 从空盒子攒出一整盒（源稿任务 1）` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>

int main() {
    std::vector<int> fav;                        // 空盒子，0 格
    fav.push_back(7);
    std::println("{} 格，最后是 {}", fav.size(), fav.back());
    fav.push_back(42);
    std::println("{} 格，最后是 {}", fav.size(), fav.back());
    fav.push_back(100);
    std::println("{} 格，最后是 {}", fav.size(), fav.back());

    return 0;
}` },
        { t: `p`, text: `输出是 1 格 7、2 格 42、3 格 100。这段的分量在**第一行**：fav 出生时是空的，一格都没有，push_back 却照样能接住 —— 盒子当场多出一格，尾巴就是它。上一课那个 size() 得 0 的合法空盒，今天有了用法：**声明时不填，来一条加一条**。这才是收纳盒四个字的完整意思，也是你以后写「收集一类东西」的标准起手式。另外注意 back() 每次都跟着变，这就是「动一下看一眼」的实际写法。` },
        { t: `h2`, text: `演示 3 · 请出去之前先看有没有人（源稿任务 2）` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>

int main() {
    std::vector<int> box;                        // 空的，0 格
    if (box.size() > 0) {                        // 有人才请
        box.pop_back();
        std::println("请出去一个，剩 {} 格", box.size());
    } else {
        std::println("现在 0 格，pop_back 不能碰");
    }

    return 0;
}` },
        { t: `p`, text: `跑起来走的是 else 那支，打出「现在 0 格，pop_back 不能碰」。源稿任务 2 让你猜对空盒子 pop_back 会怎样 —— 答案是：**它不给你体面的报错**。0 格里没有尾巴可请，这句属于上一课讲过的未定义行为，标准不作保证：可能当场终止、可能什么都没发生继续跑、也可能把盒子内部改坏，等你下一次取元素时才炸出来。所以别去试「会不会提示我」，要试就用 if 加一句 size() 的守卫，把危险挡在门外 —— 第 27 课那套判断在这里第一次变成保护动作。「先问有几个，再决定动不动」是这一课最该带走的习惯。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `对空盒子 pop_back()。上一段已经写了正确做法：先问 size()。这条不是洁癖，是因为**它的后果不一定立刻出现** —— 有时程序跑到十行之后才崩，你回头查那十行都是清白的。`,
          `对空盒子 back()。0 格没有尾上那一格，取出来的东西没有任何保证。它跟 pop_back 是同一类错误，但更容易写出来，因为 back() 看着只是个「读」。`,
          `以为 pop_back 会返回被删的那个值。它删掉就完事，什么都不交回来；想留一份，**先打印或存进变量再删**：先取 back()，后 pop_back()，顺序不能反。`,
          `拿旧的编号当依据。删尾巴时前面的编号确实不动，但只要你 push 过或 pop 过，size() 就已经换了，凡是「最后一格」的位置都得重问一遍 back() 或 size() 减 1。`,
          `以为 push_back 能指定插到第几格。push_back 只有一个参数，就是要排队尾的那个值，位置由盒子决定。想插中间是后面课里的动作，今天写不出来不是你的错。`,
          `把 push_back 写成 push 或 push_back 少一对圆括号。它是盒子自己的动作，加点、动词、圆括号，一样不缺 —— 跟 size、back、at 同一套写法，报错都是「没找到这个名字」那一类。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `连续 push_back 三个你喜欢的数字，逐个打印`,
          `猜猜：对空盒子 pop_back() 会怎样？`,
          `延伸：从空盒子出发，push_back 进四个数，然后连着 pop_back 四次，每删一次都打印 size() 和剩下的格数，最后再加一次 if 守卫确认盒子确实是 0 格；观察 back() 退回的顺序，说出它是「先进的那位」还是「后进的那位」。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：push_back 排队尾、pop_back 请队尾，两个动作改的都是盒子自己，size() 与 back() 跟着同步变，前面的编号不动；空盒子没有尾巴，删之前先问 size()。` }
      ]
    }
  ]
};
