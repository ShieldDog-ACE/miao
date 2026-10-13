/* 喵站 · C++ 入门 正文分部 p11：第 47–50 课（第九轮 · 结构化绑定 + constexpr + using 别名）
 *
 * 源稿：学习资料/C++入门/47_结构化绑定拆pair、48_绑定遍历成绩表、49_constexpr编译期常量、50_using类型别名。
 * 款式照 p06 / p01 样板：tip(蓝·本课目标) → 原理讲解 → 它被设计成什么样 → 演示 N → 常见坑 → 任务 → tip(绿·本课一句话)
 *
 * 闸线备忘（本分部守住的）：
 *   pair 教在 46、结构化绑定教在 47、constexpr 教在 49、using 别名教在 50；
 *   vector 40、range-for 37、for 35、if 27、break 30、continue 38、成员调用 13、字符串 19 —— 全在本分部之前，正常用。
 *   自定义函数定义（51）、lambda（56）、引用参数（60）：本分部四课一律不出现，注释里也不写。
 *   交叉引用只往回指（第 N 课，N ≤ 本课号）；指向后面的改写「下一课」「以后再讲」。
 *
 * 验收：node --check dev/frontend/assets/data/cpp/p11.js
 *       node dev/tools/cpp-audit.cjs --part dev/frontend/assets/data/cpp/p11.js
 *       node dev/tools/cpp-exam-check.cjs --only c47,c48,c49,c50
 */
window.MIAO_CPP_P11 = {
  chapters: [
    {
      id: `c47`, title: `第 47 课 · 结构化绑定：一箱两件货，当场拆成两个名字`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把上一课那只 pair 一次拆成两个有名有姓的变量 —— auto [name, age] = student;，从此不再写 .first 和 .second。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 46 课你认识了 std::pair<std::string, int>：一只只有两格的小盒子，取货靠 student.first 和 student.second。它能跑，但念起来像在读编号 —— 看到 std::println("{}", student.first)，读代码的人得先在脑子里翻译一遍「first 是姓名还是分数」；项目里 pair 一多，这笔翻译费你天天都在付。` },
        { t: `p`, text: `这一课的解药叫**结构化绑定**（structured binding），写法只有一种长相：**auto [name, age] = student;**。方括号里是**你给两格货起的新名字**，等号右边是**那只箱子**。编译器读这一行时干三件事：先数右边有几个成员（pair 恰好两个），再要求方括号里的名字也是两个，最后**按站位**把第一格绑给第一个名字、第二格绑给第二个名字。名字随你起，顺序由右边说了算。` },
        { t: `p`, text: `源稿的比喻是**拆快递**：一箱两件货，箱子本身你不关心，关心的是两件货各摆哪儿。也可以想成**一串钥匙**：整串挂门口，每次进门先翻「这把是 first 还是 second」；配两个口袋，一枚枚装进去写上「门」「车」，从此按名字拿。` },
        { t: `p`, text: `那为什么左边**必须**是 auto？因为「几个成员、各是什么类型」是右边那只箱子决定的，不由你指定。写 int [name, age] = student; 编译器会在方括号那儿拦你，报错大意是「这个声明不合法」—— 它不允许 int 后面跟一串方括号。` },
        { t: `ul`, items: [
          `**方括号里是名字，不是值**：它们站在声明的位置上，是两个新变量的名字。`,
          `**名字个数必须和格数一模一样**：pair 是 2 格，写 1 个或 3 个都是编译错误。`,
          `**按站位对应，不按名字含义**：第一个名字接第一格（也就是 .first），第二个名字接第二格。`,
          `**拆出来的就是普通变量**：读、写、比较、拿去算都行，从此和那只箱子再无语法关系。`
        ]},
        { t: `svg`, caption: `pair 是一只两格的箱子；auto [name, age] = student 把它当面拆开，第一格进口袋 name、第二格进口袋 age，之后 .first、.second 一次都不用写`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 250">
  <text x="16" y="26" font-size="14" font-weight="700" fill="#142639">第 46 课：只能念编号</text>
  <rect x="16" y="40" width="230" height="104" rx="12" fill="#f4f7fc" stroke="#57677c" stroke-width="2"/>
  <text x="131" y="62" font-size="13" font-weight="700" fill="#142639" text-anchor="middle">student（pair）</text>
  <rect x="34" y="74" width="194" height="28" rx="6" fill="#00599c"/>
  <text x="131" y="93" font-size="12" fill="#ffffff" text-anchor="middle">第一格 小明 ← .first</text>
  <rect x="34" y="108" width="194" height="28" rx="6" fill="#4a6f9c"/>
  <text x="131" y="127" font-size="12" fill="#ffffff" text-anchor="middle">第二格 15 ← .second</text>
  <text x="16" y="172" font-size="14" font-weight="700" fill="#1f7a3d">第 47 课：auto [name, age] = student</text>
  <path d="M246 122 C300 150 320 160 356 186" stroke="#1f7a3d" stroke-width="2.5" fill="none"/>
  <polygon points="356,186 344,182 350,174" fill="#1f7a3d"/>
  <rect x="366" y="150" width="140" height="62" rx="10" fill="#e6f6ea" stroke="#1f7a3d" stroke-width="2"/>
  <text x="436" y="172" font-size="13" font-weight="700" fill="#142639" text-anchor="middle">口袋 name</text>
  <text x="436" y="192" font-size="12" fill="#1f7a3d" text-anchor="middle">小明</text>
  <rect x="516" y="150" width="140" height="62" rx="10" fill="#e6f6ea" stroke="#1f7a3d" stroke-width="2"/>
  <text x="586" y="172" font-size="13" font-weight="700" fill="#142639" text-anchor="middle">口袋 age</text>
  <text x="586" y="192" font-size="12" fill="#1f7a3d" text-anchor="middle">15</text>
  <text x="366" y="132" font-size="12" fill="#57677c">名字由你起，站位由右边定</text>
  <text x="16" y="222" font-size="13" fill="#b8232f">注意：拆出来的是副本 —— 改 name，student.first 不动（本课演示 2）</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `最要紧的一句话：**它不创建新容器**。auto [name, age] = student; 本质上是**一条声明** —— 一口气声明两个变量，并把它们和右边那个东西的成员逐个对应。` },
        { t: `p`, text: `再划清一件容易混的事：用 auto 拆，拿到的是**副本**。name 和 student.first 是两份内存里的两个值，改一个另一个不动（演示 2 当场给你看）。想让口袋跟着箱子走得用带引用的写法 —— 下一课的遍历里我们会把每格直接绑到原件上，本课先把「拆出来的名字就是普通变量」跑熟。` },
        { t: `p`, text: `为什么设计成**按位置**而不是**按名字**？因为 pair 的两个成员在编译器眼里只有 first 和 second 这对通用名，本身带不了语义 —— 哪格是姓名、哪格是分数，全靠写代码的人记着。C++ 索性把「起名字」这件事外包给你：箱子里装什么，由你写的变量名替它记。这正好治了 .first / .second 干巴巴的病根；代价是名字一旦和格子写反，编译器不会响。` },
        { t: `p`, text: `能拆的不止 pair：C 风格的 struct、定长数组，以及**格数不止两个**的 tuple，用的都是同一套语法。源稿那句「三个值装一箱要用 tuple，先混个脸熟」说的就是这个：pair 天生两格，硬装三样就换 tuple，方括号里写三个名字，一一对上。` },
        { t: `h2`, text: `演示 1 · 源稿那份：一箱拆成两个人名` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <utility>

int main() {
    std::pair<std::string, int> student = {"小明", 15};

    auto [name, age] = student;          // 一次拆出两个变量

    std::println("{} 今年 {} 岁", name, age);

    return 0;
}` },
        { t: `p`, text: `跑起来打「小明 今年 15 岁」。三行头文件一行都不能少：<print> 管输出、<string> 管 std::string、<utility> 管 pair —— 第 46 课那条规矩没变。但**结构化绑定自己没有头文件**：它属于语言语法，编译器直接认，你搜也搜不到。` },
        { t: `h2`, text: `演示 2 · 拆出来的是副本：改 name，箱子不动` },
        { t: `code`, lang: `c++`, code: `std::pair<std::string, int> student = {"小明", 15};

auto [name, age] = student;      // name、age 各是一份拷贝
name = "小红";                    // 改副本
age  = age + 1;                   // 副本自己加 1

std::println("箱子里还是 {} / {}", student.first, student.second);
std::println("拆出来的是 {} / {}", name, age);` },
        { t: `p`, text: `输出是残忍的两行对照：箱子里还是 小明 / 15，拆出来的是 小红 / 16。拆完之后 name 和 student.first 各记各的账，别指望它们同步。很多人改完口袋里的名字发现箱子没变，就骂「绑定是假的吧」—— 绑定是真的，auto 的拷贝也是真的，两件事叠在一起就是这个结果。要么改完重新拆，要么干脆别拆。` },
        { t: `h2`, text: `演示 3 · 名字个数对不上，以及写反了没人管` },
        { t: `code`, lang: `c++`, code: `std::pair<std::string, int> student = {"小明", 15};

// auto [a, b, c] = student;      // 三个名字对两格：编译器说绑定的声明太多
// auto [only] = student;         // 一个名字对两格：编译器说绑定的声明太少

auto [score, name] = student;     // 合法！个数对了，可名字写反了
std::println("{}, {}", score, name);   // 打出来 小明, 15 —— score 里躺着姓名` },
        { t: `p`, text: `前两条是**硬错**：格子数和名字数不匹配，编译器当场拒绝，报错指在方括号那串声明上。真正可怕的是最后一组：score 接了姓名、name 接了分数，个数完全对、**语法完全合法**，于是不报错也不警告，只剩屏幕上那句荒诞的「小明, 15」。自查办法很土但有效：拆完先打一行看看，或拿 student.first 交叉对一次。名字起得好是本事，名字和格子对上是纪律。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `忘了 auto，写 int [name, age] = student;。长相：报错指在方括号上，大意是「这个声明不合法」。根因：类型和格数必须由右边那只箱子推，只有 auto 配得上这串方括号。`,
          `头文件没请齐。少 <utility> 报 pair 不是 std 的成员；少 <string> 时 std::string 成了没人认识的名字；少 <print> 就报 println 找不到。`,
          `名字顺序和格子顺序写反（演示 3）。长相：程序照跑、值互换了，屏幕上的输出荒诞却没有一行红字。`,
          `改完拆出来的名字，回头以为箱子也变了。根因是 auto 拆的是副本：name 和 student.first 是两份内存。要么重新拆，要么继续用 .first 写回去。`,
          `拿两只 pair 拼一个「三样东西」。能用，但读的人要拆两次才知道这一组是什么。三格以上换 tuple（源稿点的那件事，以后再讲）。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `建 pair 存"长 3 宽 4"，绑定后打印面积`,
          `三个值装一箱要用 tuple（后面会讲），先混个脸熟`,
          `延伸：照演示 2 把 name 改成"小红"、age 加 1，同时打印箱子里和拆出来的两组值，说清箱子为什么一动没动`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：结构化绑定就是一条「一次声明两个名字」的写法 —— auto [a, b] = 箱子;，按站位分货、个数必须对上、拆出来的是副本；它治的是 .first / .second 说不出人话这个病。` }
      ]
    },
    {
      id: `c48`, title: `第 48 课 · 绑定遍历成绩表：一排双格盒子，一轮拆一只`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把第 37 课的 range-for、第 40 课的 vector、第 46 课的 pair、第 47 课的结构化绑定拼成一句话 —— for (auto [科目, 分数] : 表)，一行拆一行地读完整张成绩表。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `这一课**没有新语法**，它把四件旧东西第一次拼成一个完整句子：第 37 课的 range-for（「对这个容器里的每一个元素，干一件事」）、第 40 课的 std::vector（一串同类型的格子）、第 46 课的 std::pair（一只固定两格的盒子）、上一课的 auto [a, b]。单看每一件都平平无奇，拼起来之后你的代码头一次读起来像人话：「对成绩表里的每一行，拆成科目和分数，然后打印」。` },
        { t: `p`, text: `先看那个吓人的类型：**std::vector<std::pair<std::string, int>>** —— 一串两格盒子。外层 vector 管「有几行」，内层 pair 管「每行有几格」。range-for 每轮把**一整只盒子**交到你手上，而上一课的拆解正好接得住它：方括号里两个名字，一左一右把这两格分掉。所以那行 for 的含义只有三件事：每轮拿一只盒子、拆成 subject 和 score、执行花括号。` },
        { t: `p`, text: `画面是**流水线上的双格礼盒**：传送带（vector）把盒子一只一只送过来，你站在拆包台（for 的花括号）前，来一只拆一只 —— 左手口袋写科目，右手口袋写分数，说完这一轮的话，下一只才进来。你**从不关心**现在拆到第几只，那是第 35 课下标遍历才操心的事。` },
        { t: `ul`, items: [
          `**每轮重新声明一次**：subject、score 在每轮开头是新生变量，装这一行的两个值，上一轮的不留。`,
          `**名字个数照样要对上**：pair 两格，方括号里就写两个。`,
          `**拆出来的是副本**：改 score 动不了表里的值（见演示 3）。`,
          `**出了花括号就不存在**：想在循环结束后还留着结果（比如最高分），必须在**循环外面**先声明那个变量。`,
          `**左边是声明不是赋值**：auto 不能省，写 for (subject, score : scores) 是没有门路的。`
        ]},
        { t: `svg`, caption: `传送带上每只盒子都是 pair：range-for 一轮递一只到拆包台，方括号里两个名字当面把两格分掉，说完这一轮才拆下一只`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 240">
  <text x="16" y="24" font-size="14" font-weight="700" fill="#142639">vector（成绩表）= 一排两格的盒子</text>
  <rect x="16" y="36" width="130" height="52" rx="8" fill="#f4f7fc" stroke="#57677c" stroke-width="2"/>
  <text x="81" y="56" font-size="12" fill="#142639" text-anchor="middle">英语 / 138</text>
  <text x="81" y="76" font-size="11" fill="#57677c" text-anchor="middle">first / second</text>
  <rect x="154" y="36" width="130" height="52" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
  <text x="219" y="56" font-size="12" font-weight="700" fill="#142639" text-anchor="middle">数学 / 145</text>
  <text x="219" y="76" font-size="11" fill="#57677c" text-anchor="middle">这一轮到它</text>
  <rect x="292" y="36" width="130" height="52" rx="8" fill="#f4f7fc" stroke="#57677c" stroke-width="2"/>
  <text x="357" y="56" font-size="12" fill="#142639" text-anchor="middle">C++ / 88</text>
  <text x="357" y="76" font-size="11" fill="#57677c" text-anchor="middle">还在传送带上</text>
  <path d="M219 92 V126 H150" stroke="#00599c" stroke-width="2.5" fill="none"/>
  <polygon points="150,126 160,121 160,131" fill="#00599c"/>
  <rect x="16" y="112" width="134" height="60" rx="10" fill="#fff6e0" stroke="#a26a00" stroke-width="2"/>
  <text x="83" y="134" font-size="12" font-weight="700" fill="#a26a00" text-anchor="middle">拆包台</text>
  <text x="83" y="154" font-size="11" fill="#142639" text-anchor="middle">for 的花括号</text>
  <path d="M150 142 H206" stroke="#1f7a3d" stroke-width="2.5"/><polygon points="206,142 196,137 196,147" fill="#1f7a3d"/>
  <rect x="212" y="118" width="120" height="48" rx="8" fill="#e6f6ea" stroke="#1f7a3d" stroke-width="2"/>
  <text x="272" y="138" font-size="12" font-weight="700" fill="#142639" text-anchor="middle">口袋 subject</text>
  <text x="272" y="156" font-size="11" fill="#1f7a3d" text-anchor="middle">数学</text>
  <rect x="342" y="118" width="120" height="48" rx="8" fill="#e6f6ea" stroke="#1f7a3d" stroke-width="2"/>
  <text x="402" y="138" font-size="12" font-weight="700" fill="#142639" text-anchor="middle">口袋 score</text>
  <text x="402" y="156" font-size="11" fill="#1f7a3d" text-anchor="middle">145</text>
  <text x="476" y="132" font-size="12" fill="#57677c">这一轮说完，下一轮</text>
  <text x="476" y="150" font-size="12" fill="#57677c">两个口袋重新来过</text>
  <path d="M470 166 C520 186 560 190 600 176" stroke="#57677c" stroke-width="2" fill="none" stroke-dasharray="6 4"/>
  <text x="16" y="200" font-size="13" font-weight="700" fill="#b8232f">要跨轮记的东西（比如最高分 best）必须摆在台子外面 —— 口袋里装不住</text>
  <text x="16" y="222" font-size="12" fill="#57677c">auto [subject, score] 拆的是复印件：改 score，传送带上的盒子不动</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `为什么 range-for 冒号左边**是一条声明**：它不是「把元素塞进一个已有变量」，而是「在这一轮的这个位置上新造一个变量」。正因为是声明，它天生配 auto（类型由 vector 的元素类型推），也天生配结构化绑定（名字个数由 pair 的格数推）。两种写法能叠在一行里，靠的就是它们本来就站在同一个语法位置上。` },
        { t: `p`, text: `不写 auto 也合法：for (std::pair<std::string, int> one : scores) 配 one.first、one.second 一样跑。但一行里既要念类型又要念编号，读的速度立刻掉下来 —— 这一整课的存在理由就是这么朴素：**类型交给 auto 推，编号交给名字说**。` },
        { t: `p`, text: `再看生命周期：循环变量只在循环体里活着。所以「顺便找最高分」在结构上必须拆成两处 —— 循环**外面**摆一只跨轮存活的格子（int best = 0;），循环**里面**每轮比较并更新（if (score > best) best = score;）。任务 2 考的不是 if 会不会写，而是这两处的分工：格子摆错了地方，程序照样跑完，只是答案永远停在最后一行。` },
        { t: `h2`, text: `演示 1 · 源稿那份：整张表逐行拆` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <utility>
#include <vector>
int main() {
    std::vector<std::pair<std::string, int>> scores = {
        {"英语", 138}, {"数学", 145}, {"C++", 88}
    };
    for (auto [subject, score] : scores) {
        std::println("{:<8} {}", subject, score);   // 左对齐占 8 格
    }
    return 0;
}` },
        { t: `p`, text: `跑起来三行，数字被 {:<8} 顶到同一列 —— 冒号后面是格式说明，< 是左对齐、8 是至少占 8 个字符宽，纯为排版，删掉照样跑。这一课的 include 请了四位：<print>、<string>、<utility>、<vector>，四件东西拼在一起，缺一个都编不过。表里那行 "C++" 只是个科目名字符串，跟语言本身没关系。` },
        { t: `h2`, text: `演示 2 · 顺便抓最高分（任务 2 的写法）` },
        { t: `code`, lang: `c++`, code: `int best = 0;                          // 跨轮存活的记数格，摆在循环外
std::string best_name = "";

for (auto [subject, score] : scores) {
    std::println("{:<8} {}", subject, score);
    if (score > best) {                    // 这一轮更高，就换人
        best = score;
        best_name = subject;
    }
}
std::println("最高分：{} 的 {} 分", best_name, best);   // 出了循环还记得` },
        { t: `p`, text: `关键就是两处分工：best、best_name 在 for 外面，是**跨轮存活**的格子；if 在里面，每轮拿刚拆出来的 score 比一次。跑完再打一行，屏幕上是「最高分：数学 145 分」。要是把 int best = 0; 挪进花括号里，它每轮都被重置，最后一轮比完停在 88 —— 你兴高采烈地宣布最高分是 88，编译器一句话都不会说。` },
        { t: `h2`, text: `演示 3 · 改 score 动不了表，出花括号 subject 就没了` },
        { t: `code`, lang: `c++`, code: `for (auto [subject, score] : scores) {
    score = score + 10;                     // 加在副本上
    std::println("{:<8} {} （加了 10）", subject, score);
}
for (auto [subject, score] : scores) {      // 再拆一遍同一张表
    std::println("表里还是 {:<8} {}", subject, score);
}
// std::println("{}", subject);   // 编译报错：subject 出了花括号不存在` },
        { t: `p`, text: `第一遍打出来的全是加过 10 的分，第二遍打出来的还是 138、145、88 —— 表一动没动。上一课那个「副本」毛病在遍历里更隐蔽：每轮都在拆新盒子，你很容易以为手里这对名字就是表里那一行。想让改动落到表上得换带引用的写法（以后再讲），本课先做到心里有数：**拆出来的是复印件，原件还躺在 vector 里**。最后那行注释是另一件事：subject 只活在花括号里，循环外再用它，编译器报的是「未声明的标识符」一类。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把记结果的格子写在循环里面（int best = 0; 放进花括号）。长相：程序正常跑完，最高分永远等于表的**最后一行**，或者永远是 0。根因：循环变量每轮重造，留不住东西。`,
          `只请了 <vector> 没请 <utility>。长相：报错大意是「pair 不是 std 的成员」。嵌套类型两头都得请：外层 vector 一头、内层 pair 一头，pair 里装的 string 还有一头。`,
          `想只要分数，写 for (auto score : scores)。不报错，但 score 装的是**整只 pair**，下一行拿它打印就出乱码或直接报错。pair 不能只拆一半，要拆就两个名字一起拆。`,
          `以为改了 score 就改了表（演示 3）。拆出来的是副本，原件不动。`,
          `拿 range-for 又想数「这是第几行」。那是第 35 课下标遍历的活；两种工具硬凑在一条 for 里，只会写成又长又绕的东西。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `加两行你自己的科目和分数`,
          `遍历时顺便找出最高分`,
          `延伸：加完那两行后，在循环外累一个总分，循环结束后打一行「一共 {} 分」；再想想平均分会不会丢掉小数`,
          `延伸：照演示 3 给每行临时加 10 分打印一遍，再原样拆一遍，说清第二遍为什么还是原始分数`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：vector<pair> 是一排两格盒子，range-for 一轮递一只到拆包台，auto [科目, 分数] 当面拆开 —— 拆的是复印件、名字只活在花括号里，所以要跨轮记的东西必须摆在循环外面。` }
      ]
    },
    {
      id: `c49`, title: `第 49 课 · constexpr：编译期就钉死的数`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会用 constexpr 定义「程序还没跑、值就已经算好并钉死」的常量，并说得清它和 const 差在哪一步。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `你之前写的普通变量是**运行时才有的盒子**：程序跑起来才分配内存、才装值。可有些数根本用不着等 —— 「一周七天」在你按下编译按钮之前就定了，让它等到运行时再算一遍，纯属白干活。` },
        { t: `p`, text: `**constexpr** 是 constant expression 的缩写，意思就一句：**这个值编译时就能算出来**。算完它不再是「要查的数」，而是被直接烧进程序里的结果。源稿的比喻很准：**考卷下发之前，答案已经印在卷底** —— 考生（运行时）打开卷子只是抄，不用再算。` },
        { t: `p`, text: `跟 const 分个家。**const** 承诺「**不许改**」，值什么时候知道它不管，写成 const int n = 键盘读来的数; 完全合法。**constexpr** 承诺「**现在就知道**」：编译器必须在编译期把右边算出来，算不出来当场报错。源稿那句「更早、更省，优先用它」说的就是这个分别 —— 一个管改不改，一个管什么时候定。` },
        { t: `p`, text: `多要这一层，换来两样实打实的好处。一是**零成本**：乘加在编译期做完，运行时一行机器代码都不执行。二是**早知早治**：写 constexpr int 一年字数 = 每天字数 * 365; 时编译器**真的会去算**这个乘法，右边只要有它算不出来的东西（比如还没读进来的数），当场拒绝 —— 错误落在编译期，而不是某天运行时给你一个看着挺正常的怪数字。` },
        { t: `ul`, items: [
          `**声明时必须给值**：constexpr int n; 不行，它必须当场就算出来。`,
          `**右边必须全是编译期已知的东西**：字面量、别的 constexpr，以及它们的运算结果。`,
          `**允许做运算**：源稿那份里 WORDS_PER_YEAR 就是 15 * 365 算出来的，不是手抄的数。`,
          `**类型不限整数**：double、字符都行 —— 源稿那个 constexpr double PI 就是小数。`
        ]},
        { t: `svg`, caption: `同一条时间轴上：constexpr 的值在编译期就被算出来并钉死，运行时只是拿来用；普通变量和 const 的值要等程序跑起来才定`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 232">
  <line x1="30" y1="120" x2="650" y2="120" stroke="#57677c" stroke-width="2.5"/>
  <polygon points="650,120 638,113 638,127" fill="#57677c"/>
  <circle cx="215" cy="120" r="8" fill="#00599c"/>
  <text x="215" y="98" font-size="13" font-weight="700" fill="#00599c" text-anchor="middle">编译期</text>
  <text x="215" y="145" font-size="11" fill="#57677c" text-anchor="middle">按下编译按钮</text>
  <circle cx="500" cy="120" r="8" fill="#1f7a3d"/>
  <text x="500" y="98" font-size="13" font-weight="700" fill="#1f7a3d" text-anchor="middle">运行时</text>
  <text x="500" y="145" font-size="11" fill="#57677c" text-anchor="middle">程序开始跑</text>
  <rect x="40" y="166" width="290" height="52" rx="10" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
  <text x="185" y="186" font-size="12" font-weight="700" fill="#142639" text-anchor="middle">constexpr int 一年 = 15 * 365;</text>
  <text x="185" y="206" font-size="12" fill="#00599c" text-anchor="middle">编译期算完，钉成 5475</text>
  <rect x="360" y="166" width="290" height="52" rx="10" fill="#e6f6ea" stroke="#1f7a3d" stroke-width="2"/>
  <text x="505" y="186" font-size="12" font-weight="700" fill="#142639" text-anchor="middle">int 今天 = 键盘读的数;</text>
  <text x="505" y="206" font-size="12" fill="#1f7a3d" text-anchor="middle">跑起来那一刻才知道值</text>
  <path d="M215 120 V162" stroke="#00599c" stroke-width="2"/><polygon points="215,162 210,152 220,152" fill="#00599c"/>
  <path d="M500 120 V162" stroke="#1f7a3d" stroke-width="2"/><polygon points="500,162 495,152 505,152" fill="#1f7a3d"/>
  <text x="40" y="46" font-size="13" font-weight="700" fill="#b8232f">constexpr 写「运行时才知道的值」→ 编译期就算不出来 → 当场报错</text>
  <text x="40" y="68" font-size="12" fill="#57677c">const 只说「之后不许改」，值什么时候定它不问，所以能接住键盘的输入</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `先破一个最常见的误解：**constexpr 不等于「只能写字面量」**。它要的是「编译期算得出来」，而算是一个过程。constexpr int 一年字数 = 每天字数 * 365; 里没有一个数是手抄的结果，只要「每天字数」本身也是 constexpr，这串乘法在编译期就完全确定，于是合法。源稿那份正是这么写的：WORDS_PER_YEAR 是算出来的，不是抄出来的。` },
        { t: `p`, text: `为什么语言要专门给这件事一个关键字，而不是让编译器自己看着办？因为**承诺的方向反了**。写 const，是向读代码的人承诺「我不改它」；写 constexpr，是**给编译器派一个任务**：「你现在、当场，把这个值算出来。」它接了活儿就必须交货，交不出（右边有它不掌握的东西）就报错。一个是装饰性的规矩，一个是硬性的合同，这就是两个关键字最深的分别。` },
        { t: `p`, text: `还有一个白捡的好处：编译器当场算，就**当场看见算错**。把 15 写成 1500、或者一串乘法超出 int 装得下的范围，它在编译期就把你揪出来；换成运行时才算的普通变量，同样的错会安静地跑成结果，你只能在输出里靠眼睛找。` },
        { t: `h2`, text: `演示 1 · 源稿那份：四个数，一个现算` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    constexpr int DAYS_PER_WEEK = 7;
    constexpr double PI = 3.14159;
    constexpr int WORDS_PER_DAY = 15;
    constexpr int WORDS_PER_YEAR = WORDS_PER_DAY * 365;  // 编译期算好

    std::println("一周 {} 天", DAYS_PER_WEEK);
    std::println("每天背 {} 个，一年能背 {} 个", WORDS_PER_DAY, WORDS_PER_YEAR);
    std::println("圆周率 ≈ {}", PI);
    return 0;
}` },
        { t: `p`, text: `输出三行，第三行那个 ≈ 只是字符串里的符号。要盯的是第四行声明：WORDS_PER_YEAR 右边是一次乘法，编译器在编译期就把它算成 5475 并钉死，程序运行时**没有这一次乘法**，拿到的直接是成品。改「每天背 20 个」时只动 WORDS_PER_DAY 一处，5475 自动变 7300 —— 常量还有个隐性好处：同一个数只写在**一个地方**。` },
        { t: `h2`, text: `演示 2 · 任务 1：每天 2 圈，20 周跑几圈` },
        { t: `code`, lang: `c++`, code: `constexpr int LAPS_PER_DAY = 2;
constexpr int DAYS_PER_WEEK = 7;
constexpr int WEEKS = 20;
constexpr int TOTAL_LAPS = LAPS_PER_DAY * DAYS_PER_WEEK * WEEKS;  // 编译期算完

std::println("一共跑 {} 圈", TOTAL_LAPS);` },
        { t: `p`, text: `答案是 280。这道题全部的诀窍是**别把结果写成 280**：把规则拆成三个小 constexpr，让编译器去算结果。以后「每天跑 3 圈」或者「跑 24 周」，你只改一个数字，TOTAL_LAPS 跟着变；当初要是直接抄了 280，现在就得回忆它是怎么来的、再手动改一遍，十有八九改漏一处。` },
        { t: `h2`, text: `演示 3 · 改成 const 也过；把键盘的数塞进 constexpr 就过不了` },
        { t: `code`, lang: `c++`, code: `// 需要 #include <iostream> 才能用 std::cin
int n = 0;
std::cin >> n;                          // 值要到运行时才知道

// constexpr int from_input = n * 2;     // 取消注释就报错：初始化不是常量表达式
const int ok_input = n * 2;             // 合法：const 只保证之后不许改

const int WORDS_PER_YEAR = WORDS_PER_DAY * 365;   // 源稿那行改成 const，一样过` },
        { t: `p`, text: `这就是任务 2 的现场。**两个都能编译**（源稿那行改成 const 一样过），差别在**谁能做什么**：const 允许右边是运行时才知道的数，因为它只管「之后不许改」；constexpr 不接受 —— 编译器现在算不出来，报错原话大意是「初始化这个 constexpr 变量的表达式不是常量表达式」，还会把 n 指给你看。所以选哪个不是审美问题：值来自键盘、来自文件，就只能 const（或普通变量）；值本来就是规则、是题目给的，就写 constexpr，白拿「提前算」和「提前查错」。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `忘了给初值：constexpr int max_score;。长相：报错大意是「constexpr 变量没有用常量表达式初始化」—— 它必须**声明当场**就算出来，不能先声明再赋值。`,
          `把键盘或文件读来的数交给 constexpr（演示 3）。长相：编译器说初始化表达式不是常量表达式。根因：你要求它「现在就算」，可那个数还没发生。`,
          `想改它，报「只读」一类错（assignment of read-only variable 这种话）。这说明你要的其实是普通变量 —— 常量不许改是它的本职，不是 bug。`,
          `拿它写超界的算式：constexpr int big = 100000 * 100000;。长相：编译期就报算术溢出。别当成坏事 —— 换成运行时算，同样的溢出会安静地给你一个错值。`,
          `constexpr 的数写成 lapsPerDay，跟普通变量长得一模一样，读的人哪个能动、哪个动了牵一发动全身。全大写加下划线是这一课的纪律。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `用 constexpr 算：每天跑 2 圈，20 周跑几圈`,
          `把 constexpr 改成 const 再编译，都能过——琢磨下区别`,
          `延伸：把源稿里的 WORDS_PER_DAY 从 15 改成 20，只改这一处，先心算一年是多少再运行验证；然后把 365 换成 cin 读进来的数，把报错原话抄下来`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：constexpr 是给编译器派的活儿 ——「当场把值算出来并钉死」；const 只承诺「之后不改」，值什么时候定它不管。算得出的写 constexpr，要等运行时的写 const，优先前者。` }
      ]
    },
    {
      id: `c50`, title: `第 50 课 · using 类型别名：给长类型起一个会说人话的名字`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用 using 给已有类型起外号 —— using Score = int; 之后 Score 就是 int；把上一课那一长串嵌套类型收进一个名字里。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课你写过这样一行：std::vector<std::pair<std::string, int>> scores; —— 声明一个变量，光念类型就要念两层嵌套。这个类型没有错，但「一张成绩表」在你脑子里是一个**有身份的概念**，语言却只能用一长串零件描述它。每写一次、每读一次，都要重新把零件在脑子里拼一遍。` },
        { t: `p`, text: `**using** 干的事就是给类型起外号：**using Score = int;** 读作「从今往后，Score 这个拼写代表 int」。注意它是**别名**，不是新类型 —— 编译器眼里 Score 和 int 是同一个东西，互相赋值毫无障碍，不存在任何转换。写 Score math = 145; 和写 int math = 145; 产生的程序完全一样，只是前者读起来知道这个整数是**分数**。` },
        { t: `p`, text: `类比：一串门牌号又长又难记，你在名片上印「我家」。名片换了名字，人还是那个人；地址没有被缩短，只是**你每次要说它的时候可以说两个字**。类型也一样：长的那个还在那儿，只是你有了个短的可写。` },
        { t: `p`, text: `位置也要交代：这一课的两句 using 写在 **main 外面**（文件作用域），所以 main 里到处都能用；写在函数里面也行，但只在那个函数里活着 —— 和第 48 课那个「出了花括号名字就不存在」是同一个规矩。` },
        { t: `ul`, items: [
          `**读法固定**：using 新名字 = 老类型 ;，等号在这里读「代表」，不是赋值。`,
          `**起完就直接当类型用**：Score math = 145; 与 int math = 145; 一模一样。`,
          `**长类型最值得起别名**：using ScoreTable = std::vector<std::pair<std::string, int>>; 一行收掉上一课那串嵌套。`,
          `**它是别名不是新盒子**：Score 和 int 之间随便赋值，编译器不拦（演示 3）。`,
          `**惯例是新名字大写字母开头**：Score、NameList、ScoreTable —— 一眼和变量名分开。`
        ]},
        { t: `svg`, caption: `using 不制造新类型，只是在一长串类型上贴一张便签：以后写便签上的短名字，编译器把它换回原件`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 210">
  <text x="16" y="24" font-size="14" font-weight="700" fill="#142639">using NameList = std::vector&lt;std::string&gt;;</text>
  <rect x="16" y="40" width="210" height="70" rx="10" fill="#fff6e0" stroke="#a26a00" stroke-width="2"/>
  <text x="121" y="70" font-size="14" font-weight="700" fill="#a26a00" text-anchor="middle">NameList</text>
  <text x="121" y="92" font-size="11" fill="#142639" text-anchor="middle">你写的短名字（便签）</text>
  <path d="M226 75 H296" stroke="#00599c" stroke-width="2.5"/><polygon points="296,75 286,70 286,80" fill="#00599c"/>
  <text x="261" y="62" font-size="11" fill="#00599c" text-anchor="middle">代表</text>
  <rect x="300" y="40" width="364" height="70" rx="10" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
  <text x="482" y="70" font-size="12" font-weight="700" fill="#142639" text-anchor="middle">std::vector&lt;std::string&gt;</text>
  <text x="482" y="92" font-size="11" fill="#57677c" text-anchor="middle">原件一直在那儿，长度一点没变</text>
  <text x="16" y="136" font-size="13" font-weight="700" fill="#1f7a3d">好处：声明变量时短、读起来会说意图（Score 是分数，Age 是年龄）</text>
  <text x="16" y="160" font-size="13" font-weight="700" fill="#b8232f">边界：编译器眼里 Score 和 Age 都是 int，把年龄赋给分数它一声不响</text>
  <text x="16" y="186" font-size="12" fill="#57677c">头文件不省：等号右边用到 vector 和 string，<vector> 和 <string> 照样得请进来</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `核心问题：为什么不直接写 int？因为**类型不告诉你意图**。年龄是 int、分数是 int、编号也是 int，编译器的类型系统区分不了它们，于是一行 int a = b; 到底干了件什么事，只有你知道（而且三天后你不知道了）。using 把这条信息**挂到声明本身**上：Score math = 145; 里那个 Score 就是写给下一个读代码的人 —— 常常就是你自己 —— 看的。这是本课最值钱的一句话：**别名的价值在可读，不在安全**。` },
        { t: `p`, text: `所以边界也来了：它**不提供新的检查**。Score 和 Age 都代表 int，它们之间赋值畅通无阻（演示 3 现场看）。别名是给人看的礼物，不是给编译器上的锁。真要「分数和年龄是两种东西、混用就报错」，得造出真正不同的类型来（以后的 struct 那一类），那是另一个话题。` },
        { t: `p`, text: `老代码里你可能撞见另一种写法：typedef int Score;，干的是同一件事，只是读起来别扭（新名字躲在最后面）。using 把它翻成了顺读的一句「新名字 代表 老类型」。见到 typedef 不用慌，一个项目里认一种就够。` },
        { t: `h2`, text: `演示 1 · 源稿那份：两个别名，一个用在小数一个用在容器` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <vector>
using Score = int;
using NameList = std::vector<std::string>;
int main() {
    Score math = 145;                    // 和 int math = 145 一样
    NameList subjects = {"英语", "数学", "C++"};
    std::println("数学分: {}", math);
    for (auto s : subjects) {
        std::println("- {}", s);
    }
    return 0;
}` },
        { t: `p`, text: `跑起来四行：一句分数，三行带短横线的科目名。NameList subjects = {"英语", "数学", "C++"}; 用的还是第 40 课那个初始化列表，只是左边换了个短名字；遍历照旧 range-for，auto s 每轮拿到一个 std::string。头文件一个都不能省 —— **别名不替你请头文件**：<string> 和 <vector> 是因为右边真的用到了才必须写。` },
        { t: `h2`, text: `演示 2 · 任务 1 与任务 2：Height 和 ScoreList` },
        { t: `code`, lang: `c++`, code: `using Height = double;                     // 任务 1：身高是小数
using ScoreList = std::vector<int>;        // 任务 2：一串整数分数

Height my_height = 1.75;
ScoreList three = {95, 145, 88};

std::println("身高 {} 米", my_height);
for (auto one : three) {
    std::println("- {}", one);
}` },
        { t: `p`, text: `两个任务的关键都在**别名右边选对类型**：身高 1.75 带小数点，所以 Height 必须代表 double，写成 int 的话 1.75 当场被削成 1（整数装小数会掉那一截，之前算除法时领教过这个脾气）；「一串分数」是容器，所以 ScoreList 代表 std::vector<int>。别名起得好，以后写函数时能省掉一大串字（以后再讲），今天先在 main 外面把它立起来。` },
        { t: `h2`, text: `演示 3 · 别名不是类型检查：分数被年龄顶掉了` },
        { t: `code`, lang: `c++`, code: `using Score = int;
using Age = int;                  // 它俩其实是同一个类型

Score math = 145;
Age xiaoming = 15;

math = xiaoming;                  // 合法！两边都是 int
std::println("分数变成了 {}", math);   // 打出来 15 —— 别名救不了这种错` },
        { t: `p`, text: `这一版编译过、运行正常，屏幕上是一份荒诞的「15 分」。这就是本课最该记牢的边界：编译器看穿别名，它只知道 math 和 xiaoming 都是 int，于是赋值毫无阻力。**用 using 把意图写下来，守住意图还得靠你自己** —— 别把别名当成两道城墙，它其实是一块牌子。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `等号两边写反：using int = Score;。长相：报错指在 int 那儿，大意是「声明说明符前后的东西不对」。读法背一句就够：using 新名字 代表 老类型。`,
          `以为起了别名就不用请头文件。用 std::vector 就要 <vector>，用 std::string 就要 <string> —— 别名只是右边那串类型的外号，右边写不出来，外号也白起。`,
          `指望别名帮你防错（演示 3）：Score 和 Age 都是 int，混用不报错。要防混用得用真正的不同类型（以后再讲）。`,
          `拼错别名：写了 Scroe math = 145;。长相：未声明的标识符 Scroe 一类，编译器不会替你猜你想写 Score。好消息是它至少会拦下来 —— 起别名反而让这类笔误有了一眼可见的形状。`,
          `别名和变量名只差大小写（Score 和 score 并存），读代码的人眼睛要来回纠错。惯例：**类型名大写字母开头，变量名小写开头**，一眼分层。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `给 double 起别名 Height，存身高并打印`,
          `给 vector<int> 起别名 ScoreList，装三个分数遍历打印`,
          `延伸：给上一课那张成绩表起别名 ScoreTable，用它重写一遍变量声明，比一比两行代码哪个短、哪个一眼看得出是张表`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：using 新名字 = 老类型; 只是贴一张便签 —— 短了、会说话了，但编译器看穿它，类型检查一点都没多；头文件照样得按右边真正用到的东西请齐。` }
      ]
    }
  ]
};
