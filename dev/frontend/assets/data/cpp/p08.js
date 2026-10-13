/* 喵站 · C++ 入门 正文分部 p08：第 35–38 课（第九轮）
 *
 * 源稿：学习资料/C++入门/35_for循环数数神器.cpp、36_for倒着数与跳步.cpp、
 *       37_range-for遍历.cpp、38_break与continue.cpp
 * 款式照 p01 的六栏课式；字数照 p03（每章 2,200–2,500）。
 * 课号线：for 35、range-for 37、break/continue 38；+= 与 ++/-- 是 24 课的东西，可直接用。
 *
 * 验收：node dev/tools/cpp-audit.cjs --part dev/frontend/assets/data/cpp/p08.js
 *       node dev/tools/cpp-exam-check.cjs --only c35,c36,c37,c38
 */
window.MIAO_CPP_P08 = {
  chapters: [
    {
      id: `c35`, title: `第 35 课 · for 循环：数数神器`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把「循环三件事」——从哪儿起、什么时候停、每轮走多大一步——收进 for 的一行括号里，并搞清它真实的执行顺序。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 33、34 课的 while 和 do-while 已经能干所有重复的活了，但你大概也尝到一个麻烦：只要任务是「数着来」，计数器就得在循环外面先声明、循环体里手动加一、条件里还得再写一遍。三件事散落在三个地方，读代码的人要来回找，写代码的人漏掉「加一」那一条就当场死循环。**for 不是新能力，它是把这三件事收拢到同一行的写法** —— 一眼看完，想漏都难。` },
        { t: `p`, text: `句式就一行：**for (初始化; 条件; 步进) { 循环体 }**。两个分号把括号切成三格，各管一件事。用楼梯打个比方：初始化是「我站在第几级台阶上」，条件是「还在不在楼梯上」（每上一个台阶之前先朝前看一眼），步进是「这一轮我迈几级」，循环体是「站在这级台阶上要干的活」。` },
        { t: `code`, lang: `text`, code: `for (int i = 1;   i <= 5;   i++)  {  循环体  }
       └──┬───┘  └──┬───┘  └┬┘
       从哪儿起   什么时候停  每轮走一步
       只跑 1 次   每轮问 1 次  每轮跑完才做` },
        { t: `p`, text: `要真正会用，必须记住一件事：**for 的执行顺序和它的书写顺序不是一回事**。你以为是从左到右念一遍，机器其实是「初始化 → 条件 → 循环体 → 步进 → 回到条件」这么绕圈跑的。下面这张图就是它绕的圈，你在本课之后所有 for 都在这条轨道上跑。` },
        { t: `svg`, caption: `for 的三个部分怎么配合：初始化一次、条件每轮问、步进跑完才做`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250">
  <text x="20" y="24" font-size="14" font-weight="700" fill="#142639">for (初始化; 条件; 步进) 的真实跑法</text>
  <g font-size="13" fill="#142639">
    <rect x="16" y="44" width="126" height="56" rx="10" fill="#eef3fa" stroke="#2f6feb" stroke-width="2"/>
    <text x="79" y="66" text-anchor="middle" font-weight="700">1 初始化</text>
    <text x="79" y="86" text-anchor="middle" font-family="monospace" fill="#57677c">int i = 1</text>
    <text x="79" y="116" text-anchor="middle" fill="#57677c">整场只跑一次</text>
    <path d="M142 72 H166" stroke="#57677c" stroke-width="2.5"/>
    <polygon points="166,72 156,66 156,78" fill="#57677c"/>
    <rect x="170" y="44" width="126" height="56" rx="10" fill="#00599c"/>
    <text x="233" y="66" text-anchor="middle" font-weight="700" fill="#ffffff">2 条件</text>
    <text x="233" y="86" text-anchor="middle" font-family="monospace" fill="#cfe0f2">i &lt;= 5</text>
    <text x="233" y="116" text-anchor="middle" fill="#57677c">每轮循环体之前问</text>
    <path d="M296 72 H320" stroke="#57677c" stroke-width="2.5"/>
    <polygon points="320,72 310,66 310,78" fill="#57677c"/>
    <text x="308" y="58" font-size="12" fill="#1b7482" font-weight="700">真</text>
    <rect x="324" y="44" width="140" height="56" rx="10" fill="#eef3fa" stroke="#2f6feb" stroke-width="2"/>
    <text x="394" y="66" text-anchor="middle" font-weight="700">3 循环体</text>
    <text x="394" y="86" text-anchor="middle" fill="#57677c">这一轮的活</text>
    <path d="M464 72 H488" stroke="#57677c" stroke-width="2.5"/>
    <polygon points="488,72 478,66 478,78" fill="#57677c"/>
    <rect x="492" y="44" width="126" height="56" rx="10" fill="#eef3fa" stroke="#2f6feb" stroke-width="2"/>
    <text x="555" y="66" text-anchor="middle" font-weight="700">4 步进</text>
    <text x="555" y="86" text-anchor="middle" font-family="monospace" fill="#57677c">i++</text>
    <text x="555" y="116" text-anchor="middle" fill="#57677c">循环体跑完才做</text>
    <polyline points="555,100 555,158 233,158 233,104" fill="none" stroke="#1b7482" stroke-width="2.5"/>
    <polygon points="233,104 227,116 239,116" fill="#1b7482"/>
    <text x="400" y="176" font-size="12" fill="#1b7482" font-weight="700">回到第 2 步再问一次</text>
    <path d="M186 100 V198" stroke="#b8500f" stroke-width="2.5"/>
    <polygon points="186,198 180,186 192,186" fill="#b8500f"/>
    <text x="60" y="216" font-size="13" fill="#b8500f" font-weight="700">条件为假：整场循环到此结束</text>
  </g>
  <text x="16" y="240" font-size="13" fill="#57677c">第一次就假的话，循环体一次都不会跑 —— for 天生是「先问再走」。</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `三个格子语法上都是**可选**的，但语义各不代替：初始化格里的东西只在最开头做一次，条件格每轮问一次，步进格在每轮循环体之后做一次。第三格写 i++ 就是每轮加一（第 24 课学过，i++ 等价于 i = i + 1）。` },
        { t: `p`, text: `另一个看不见但很实用的设计：写在括号里的 int i，**它的作用域就是这整个 for**。右花括号一合上，i 就不存在了 —— 你不用负责清理它，它也不会污染外面的名字。循环变量是干活的临时工，活干完就走，这在长代码里能省掉大量「这个 i 到底是哪来的」的麻烦。` },
        { t: `p`, text: `顺手把三种循环的分工钉在墙上，以后选型不用犹豫：**知道要跑几次的，写 for**（三格收一行，最不容易漏）；**不知道跑几次、靠某个条件说了算的，写 while**（比如「一直读到用户输入空行为止」，第 33 课那种）；**必须先干一次再判断的，写 do-while**（第 34 课那种，菜单重输）。它们能互相改写，一个 for 能干的事 while 全能干，反过来也一样 —— 选哪个纯看「哪种写法让读代码的人一眼看懂你要跑几轮」。` },
        { t: `h2`, text: `演示 1 · 数到 5` },
        { t: `code`, lang: `c++`, code: `#include <print>

int main() {
    for (int i = 1; i <= 5; i++) {
        std::println("i = {}", i);      // 循环体每轮打一个 i
    }

    return 0;
}` },
        { t: `p`, text: `跟着图走一遍：先做 int i = 1（就这一次）；问 1 <= 5，真，进循环体打出 i = 1；做 i++，i 变 2；再问 2 <= 5……一路到 i 变成 6，问 6 <= 5，假，立刻收工，循环体一次也不再进。所以输出正好是 1 到 5 共五行，**不会出现 i = 6**。新手常担心「i++ 之后 i 已经是 6 了，会不会多打一行」，看图就明白：打完的是循环体，而循环体在条件之前，条件是假的时候循环体根本进不去。` },
        { t: `h2`, text: `演示 2 · 1 加到 100（累加器）` },
        { t: `code`, lang: `c++`, code: `#include <print>

int main() {
    int sum = 0;                        // 累加器：必须在循环外面
    for (int i = 1; i <= 100; i++) {
        sum += i;                       // 每轮把 i 收进袋子里
    }
    std::println("1 到 100 的和 = {}", sum);   // 5050

    return 0;
}` },
        { t: `p`, text: `这是循环里最经典的一个模式，名字值得记住：**累加器**。它由两半凑成——循环外一句 sum = 0（给袋子清零），循环体里一句 sum += i（每轮往里装）。为什么初始化必须在外面？你要是把 sum = 0 写进循环体，每轮先清零再加，最后剩下的就只有 100，前面 99 轮全被抹掉了。**「循环外起头、循环内累积、循环外交答案」这个三段结构，往后你写几乎所有统计类程序都是这个骨架。**` },
        { t: `h2`, text: `演示 3 · 循环变量出了 for 就没了` },
        { t: `code`, lang: `c++`, code: `for (int i = 1; i <= 5; i++) {
    std::println("{}", i);
}
// std::println("最后 i = {}", i);   // ← 解开注释：编译报错` },
        { t: `p`, text: `报错的核心一行长成这样：error: 'i' was not declared in this scope —— 直译是「这个范围里没有叫 i 的东西」，根因就是上面那句：i 的生命线只到右花括号。想在外头继续用那个数，就把声明提到 for 外面（int i = 1; for (; i <= 5; i++)），但一般没这个必要，别为了留个变量把结构搞乱。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `for 的右括号后面手滑加了分号：for (int i = 1; i <= 5; i++); —— 这行合法，编译器一声不吭，但那个分号就是**空循环体**，五轮什么也不干，后面那段花括号变成和循环无关的普通代码块，屏幕上什么都不打印。找了半天「循环没跑」，其实跑了，跑的是空。`,
          `第三格忘写 i++，或者写成 i + 1（没赋值回去）：条件永远为真，屏幕疯狂刷屏出不来。这是死循环最常见的一种长相，先查步进格有没有真的把循环变量改动。`,
          `<= 和 < 差一个：要 1 到 100 写成 i < 100，结果少算一轮，和是 4950。数数前先想清楚「终点那一下要不要」，要就 <=，不要就 <。`,
          `初始化格和外部的同名变量混用：外面已经有个 i，for 里再写 int i 会另起一个内部的 i，两个 i 互不相干，改里面那个外面看不出来。初学阶段一个函数里别让同名变量套两遍。`,
          `在循环体里手动改 i：for 里写着 i++，循环体里又 i = 10 —— 你不会报错，但轮次立刻失控（这一轮结束 i 先被改 10，步进再加成 11，条件马上假，循环提前收工）。循环变量交给三个格子管，别在里面对它动手。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `改条件，打印 10 到 15（把演示 1 的初始值和条件都动一下，注意终点 15 要不要打出来）。`,
          `用 for 求 1 到 100 所有偶数的和（思路：步进格写 i += 2 从 2 起跳，或者照旧 i++ 但循环体里判断 i % 2 == 0 再累加）。`,
          `把演示 2 的 100 换成 1 到 n（n 自己定一个），算完和你的口算结果对一下；再用同一个 for 顺手求出「一共加了几个数」，加一个计数器变量。`,
          `故意把步进格删空写成 for (int i = 1; i <= 5;) 跑一次，亲眼看看死循环是什么长相，然后用 Ctrl+C 中止它。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：for = 把「起头、停在哪、每轮走一步」收进一行；跑法是初始化 → 条件 → 循环体 → 步进 → 回到条件，循环变量出了右花括号就不存在。` }
      ]
    },
    {
      id: `c36`, title: `第 36 课 · for 倒着数与跳步`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：动手改第三格 —— i-- 倒数、i += 2 跳步，并且明白「步进改了方向，条件格子必须跟着改方向」。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课那张图里，第四格（步进）的内容看起来天生就是 i++，其实它跟你写的任何一句话都一样：**每轮循环体跑完之后，机器就执行这一格，你写什么它做什么**。写 i++ 就加一，写 i-- 就减一，写 i += 2 就跳两格，写 i *= 2 就翻倍（这种叫「指数增长」，跑得快得很，一会儿你就见到）。三个格子只有「什么时候做」是定死的，做**什么**完全是你填的。` },
        { t: `p`, text: `拿爬楼梯打比方最贴切：一级一级往上走是 i++；一步跨两级是 i += 2，你永远只踩在单数那几级上；转身往下走就是 i--，这时候你关心的条件也从「还没到顶」变成「还没到底」。源稿里那句「只剩奇数 1 3 5 7 9」说的就是这个：**踩到哪几个数，由起点和步长两件事一起决定** —— 起点是 1、步长 2，落点全是奇数；起点换成 2、步长还是 2，落点立刻全变偶数。` },
        { t: `p`, text: `倒着数真正要小心的不是 i-- 那一格，而是**条件格子必须跟着反过来**。上一课写 i <= 5 是「还在楼梯上半截吗」；现在你从 5 往下走，要问的变成「还没走到底吗」，于是写 i >= 1。方向和步进必须配套：一个往下走、一个还朝上看，两边一拧，循环要么一轮都不跑，要么永远跑不完。这是本课全部事故的根源，下面逐个见。` },
        { t: `code`, lang: `text`, code: `上楼梯：  1 → 2 → 3 → 4 → 5      for (int i = 1; i <= 5; i++)
跨两级：  1 → 3 → 5 → 7 → 9      for (int i = 1; i <= 9; i += 2)
下楼梯：  5 → 4 → 3 → 2 → 1      for (int i = 5; i >= 1; i--)
五格一迈：0 → 5 → 10 → … → 100   for (int i = 0; i <= 100; i += 5)` },
        { t: `svg`, caption: `同一条数轴上的三种走法：步长决定跨多大，方向决定朝哪边走`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260">
  <text x="20" y="24" font-size="14" font-weight="700" fill="#142639">第三格写什么，循环变量就走成什么样</text>
  <line x1="30" y1="150" x2="610" y2="150" stroke="#8b98ab" stroke-width="2"/>
  <g font-size="12" fill="#57677c" text-anchor="middle">
    <line x1="60" y1="142" x2="60" y2="158" stroke="#8b98ab" stroke-width="2"/><text x="60" y="176">0</text>
    <line x1="160" y1="142" x2="160" y2="158" stroke="#8b98ab" stroke-width="2"/><text x="160" y="176">25</text>
    <line x1="260" y1="142" x2="260" y2="158" stroke="#8b98ab" stroke-width="2"/><text x="260" y="176">50</text>
    <line x1="360" y1="142" x2="360" y2="158" stroke="#8b98ab" stroke-width="2"/><text x="360" y="176">75</text>
    <line x1="460" y1="142" x2="460" y2="158" stroke="#8b98ab" stroke-width="2"/><text x="460" y="176">100</text>
  </g>
  <g stroke-width="2.5" fill="none">
    <path d="M60 138 Q70 118 80 138" stroke="#2f6feb"/>
    <path d="M80 138 Q90 118 100 138" stroke="#2f6feb"/>
    <path d="M100 138 Q110 118 120 138" stroke="#2f6feb"/>
    <polygon points="124,138 116,132 116,144" fill="#2f6feb"/>
    <path d="M200 138 Q230 106 260 138" stroke="#1b7482"/>
    <path d="M260 138 Q290 106 320 138" stroke="#1b7482"/>
    <polygon points="324,138 316,132 316,144" fill="#1b7482"/>
    <path d="M540 138 Q510 106 480 138" stroke="#b8500f"/>
    <path d="M480 138 Q450 106 420 138" stroke="#b8500f"/>
    <polygon points="416,138 424,132 424,144" fill="#b8500f"/>
  </g>
  <g font-size="13">
    <text x="42" y="106" fill="#2f6feb" font-weight="700">i++ 每轮 1</text>
    <text x="42" y="124" fill="#57677c">细密、慢</text>
    <text x="196" y="88" fill="#1b7482" font-weight="700">i += 2 每轮跳 2</text>
    <text x="196" y="106" fill="#57677c">只踩单数：1 3 5 7 9</text>
    <text x="430" y="88" fill="#b8500f" font-weight="700">i-- 倒着走</text>
    <text x="430" y="106" fill="#57677c">条件要写成 &gt;=</text>
  </g>
  <text x="30" y="212" font-size="13" fill="#142639" font-weight="700">落点 = 起点 + 步长的整数倍；起点挪一格，整串落点跟着挪一格。</text>
  <text x="30" y="238" font-size="13" fill="#57677c">倒计时、隔行输出、只取某倍数，全都是这一句话的三种用法。</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `第二格和第三格是一套的，设计者没替你锁死方向，所以「方向配平」是你自己的责任。读一段 for 的时候，养成一个习惯：**先看步进是加还是减，再看条件的不等号朝哪边**，两个对上了才谈得上正确。至于 += 和 --，都是第 24 课见过的老朋友：i += 2 就是 i = i + 2 的紧凑写法，i-- 就是 i = i - 1。` },
        { t: `h2`, text: `演示 1 · 倒计时：从 5 走到 1` },
        { t: `code`, lang: `c++`, code: `#include <print>

int main() {
    for (int i = 5; i >= 1; i--) {     // 从 5 开始，每轮 -1
        std::print("{} ", i);
    }
    std::println("");

    return 0;
}` },
        { t: `p`, text: `输出是 5 4 3 2 1。跟着图走：i 是 5 时问 5 >= 1，真，打一个 5；步进 i-- 让 i 变 4……到 i 变成 0，问 0 >= 1，假，收工。所以**打出来的最后一个数是 1，那个 0 只存在于条件被问的那一瞬间**，没进循环体。这一轮顺便用了 std::print：它和 std::println 一样能把东西打到屏幕，区别是不补换行，所以五个数挤在同一行；最后 std::println("") 打一个空串，作用是换行收尾 —— 不换行的话，后面别的输出会粘在这一行尾巴上。` },
        { t: `h2`, text: `演示 2 · 跳步：只要奇数` },
        { t: `code`, lang: `c++`, code: `for (int i = 1; i <= 9; i += 2) {     // 每轮 +2
    std::print("{} ", i);
}
std::println("");                      // 1 3 5 7 9` },
        { t: `p`, text: `1 起步、每次加 2，落点就是 1 3 5 7 9；i 变成 11 时条件 11 <= 9 为假，退出，所以 9 之后不会多出个 11。把起点改成 2 就是 2 4 6 8（终点也得跟着改成 <= 10，不然丢掉 10）—— 同一个步长，起点不同，整串数平移一格。这个「起点 + 步长」的组合拳，就是下一节任务里挑倍数的那把钥匙。` },
        { t: `h2`, text: `演示 3 · 10 秒倒计时，每行一句人话` },
        { t: `code`, lang: `c++`, code: `for (int left = 10; left >= 1; left--) {
    std::println("还剩 {} 秒", left);
}
std::println("发射！");` },
        { t: `p`, text: `这里循环变量改名叫 left（还剩），因为它已经不只是「第几个」，而是一个有含义的数。**倒数配一句人话模板，比一个干巴巴的数字好读得多**，这类语句写出来就像真的在喊倒计时。循环结束后那句「发射！」在循环外面，只打一次 —— 如果你把它写在循环体里，就会得到十行「发射！」，这在图形界面里其实是另一种效果，自己试一次很有好处。` },
        { t: `h2`, text: `演示 4 · 5 的倍数：从 0 起跳` },
        { t: `code`, lang: `c++`, code: `for (int i = 0; i <= 100; i += 5) {
    std::print("{} ", i);
}
std::println("");` },
        { t: `p`, text: `起点写 0 是因为 0 也是 5 的倍数（0 乘 5 就是 0），落点是 0 5 10 … 100，共 21 个。终点 100 能不能被踩到，取决于起点到它是不是正好差 5 的整数倍 —— 0 到 100 差 100，是 5 的 20 倍，所以踩得到。要是起点写成 1，序列变成 1 6 11 …，最后一个不超过 100 的落点是 96，**你打算数的东西和步长不整除时，终点就会「滑过去」**，这种时候用 <= 还是 < 就不再是差一行的问题，而是整串都不对。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `方向只改了一半：for (int i = 5; i <= 1; i--) —— 步进是往下，条件还在朝上比，5 <= 1 第一轮就假，屏幕上什么都没有，且不报任何错。这是倒数题里最常见的「循环没跑」，看到「一声不吭什么都不打」先去核对条件的不等号方向。`,
          `反过来漏改步进：for (int i = 5; i >= 1; i++) 条件永远为真，屏幕疯狂刷同一个数字出不来。条件和步进必须成对检查，改一个就顺手看另一个。`,
          `i += 2 手滑写成 i =+ 2。C++ 里 i =+ 2 是完全合法的语句（意思是 i = (+2)，把 2 装进去），于是每轮 i 都是 2、条件永远真，直接死循环。报错信息一条都不会有，只能靠肉眼盯等号的位置。`,
          `倒数到 0 那一下想不清：要打到「还剩 0 秒」就写 i >= 0，不要就写 i > 0。倒数和顺数的边界感是反的，顺数怕终点被漏，倒数怕 0 被漏。`,
          `拿浮点数累加当步长（比如 i += 0.1 数到 1），第 11 课说过 double 存的是近似值，一路加下去会飘，最后可能多一轮或少一轮。要精确数数就用 int 步长，需要小数就把循环变量当整数、打印时再除以 10。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `写 10 秒倒计时：每行输出「还剩 n 秒」（照演示 3 改），最后一行另外打印「发射！」。`,
          `用 i += 5 打印 0 到 100 里所有 5 的倍数，并数一数一共打了几个数（另开一个计数器变量，每轮加一）。`,
          `延伸：把演示 2 改成打印 100 到 1 里所有 5 的倍数，倒着数 —— 想清楚起点该写 100 还是 95，不等号写哪个方向。`,
          `延伸：用 i *= 2 从 1 起跳打印（1 2 4 8…），条件设成不超过 1024，看看它几轮就跑完了；再和 i += 2 比一比谁爬得快。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：第三格「每轮做什么」随你填，i-- 是倒数、i += 2 是跳步；倒数时条件格子的不等号必须跟着反方向，落点由「起点 + 步长」共同决定。` }
      ]
    },
    {
      id: `c37`, title: `第 37 课 · range-for 遍历：一个一个端给你`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：学会 for (auto c : 一串东西) 这种两格写法，把「挨个处理」这件事交给容器自己报数，你只负责接住每一轮递上来的那一个。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `前两课的 for 都是**按序号干活**：i 从几到几、每轮走一步，你手里握着的是「第几个」。可很多任务根本不关心第几个 —— 「把名字里的每个字母都看一遍」「把这些数统统加起来」，你要的是**那一个东西本身**。用上一课的写法干这活，得先声明 i、再问 i 到不到长度、再从容器里按下标取，三格里有两格都在为「数数」这套脚手架服务。range-for 就是把脚手架整个拆掉：**for (auto c : word)**，读作「对 word 里的每一个 c」，每轮从 word 里取出一个元素放进 c，取完自动结束。` },
        { t: `p`, text: `注意它的形状变了：括号里**只有两格，中间是一个冒号**，没有分号。冒号左边是「这一轮我要接住的东西」，是一个声明语句（类型写 auto，让它跟着右边的元素走）；冒号右边是**那一串东西**本身 —— 本课用的是 std::string，往后你还会在别的容器上见到同一招。三格 for 有的起点、终点、步进，这里一个都不写，因为「走到头」这件事只有容器自己知道，让它自己说比你数靠谱。` },
        { t: `p`, text: `auto 是第 4 课的老朋友：右边的类型一眼看得出来，就让编译器替你抄过来。word 里每个元素都是 char，所以 auto c 里的 c 就是一个 char 变量，每轮被重新装一个字符。名字也别被「循环变量」这三个字骗了 —— **它不是计数器，它是一个一个换人的演员**，i 那种「我知道我是第几个」的心态在这里用不上。` },
        { t: `code`, lang: `text`, code: `三格 for（按序号）              两格 range-for（按元素）
for (int i = 0; i < n; i++)     for (auto c : word)
     └ 自己数、自己取下标            └ 容器自己排队，每轮递一个给你` },
        { t: `svg`, caption: `range-for 的画面：容器里的元素自己排成一队，一个一个递到 c 手上`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250">
  <text x="20" y="24" font-size="14" font-weight="700" fill="#142639">for (auto c : word)   其中 word 装着 code</text>
  <g font-size="13">
    <text x="40" y="52" fill="#57677c">word 里的四个元素</text>
    <rect x="40" y="62" width="66" height="46" rx="8" fill="#eef3fa" stroke="#2f6feb" stroke-width="2"/>
    <text x="73" y="92" text-anchor="middle" font-family="monospace" font-size="16" fill="#142639">c</text>
    <rect x="112" y="62" width="66" height="46" rx="8" fill="#eef3fa" stroke="#2f6feb" stroke-width="2"/>
    <text x="145" y="92" text-anchor="middle" font-family="monospace" font-size="16" fill="#142639">o</text>
    <rect x="184" y="62" width="66" height="46" rx="8" fill="#eef3fa" stroke="#2f6feb" stroke-width="2"/>
    <text x="217" y="92" text-anchor="middle" font-family="monospace" font-size="16" fill="#142639">d</text>
    <rect x="256" y="62" width="66" height="46" rx="8" fill="#eef3fa" stroke="#2f6feb" stroke-width="2"/>
    <text x="289" y="92" text-anchor="middle" font-family="monospace" font-size="16" fill="#142639">e</text>
    <rect x="420" y="56" width="150" height="58" rx="10" fill="#00599c"/>
    <text x="495" y="80" text-anchor="middle" font-weight="700" fill="#ffffff">这一轮接住的 c</text>
    <text x="495" y="102" text-anchor="middle" font-family="monospace" fill="#cfe0f2">char</text>
    <path d="M322 85 H412" stroke="#1b7482" stroke-width="2.5"/>
    <polygon points="412,85 400,79 400,91" fill="#1b7482"/>
    <text x="330" y="72" font-size="12" fill="#1b7482" font-weight="700">递过来</text>
    <path d="M73 108 V140 H495 V114" fill="none" stroke="#c7d3e4" stroke-width="2" stroke-dasharray="4 4"/>
    <path d="M145 108 V152 H495" fill="none" stroke="#c7d3e4" stroke-width="2" stroke-dasharray="4 4"/>
    <path d="M217 108 V164 H495" fill="none" stroke="#c7d3e4" stroke-width="2" stroke-dasharray="4 4"/>
    <path d="M289 108 V176 H495" fill="none" stroke="#c7d3e4" stroke-width="2" stroke-dasharray="4 4"/>
  </g>
  <g font-size="13" fill="#142639">
    <text x="40" y="200">第 1 轮 c 拿到 'c'，第 2 轮 'o'，第 3 轮 'd'，第 4 轮 'e'</text>
    <text x="40" y="222" fill="#b8500f" font-weight="700">队里没人可递了 —— 循环自己结束，你不用写终点</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `设计意图很直白：**把「遍历」这件事的默认姿势定成不碰下标**。下标是新手 bug 的温床 —— 少写一个等号差一格、多写一个越界，而 range-for 从原理上就没这些坑：你不知道也不用知道有几个元素，起点终点都在容器自己肚子里。代价是**你失去了序号**：一旦任务里带「第几个」「隔一个」「和下一个配对」这种意思，range-for 就不顺手了，得回到第 35 课那种三格 for。选哪个的判断就这一句：**只关心「这一个」，用 range-for；关心「第一个」，用三格 for。**` },
        { t: `h2`, text: `演示 1 · 把 code 一个一个端出来` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>

int main() {
    std::string word = "code";

    for (auto c : word) {              // 每轮从 word 取一个字符
        std::println("取出字符: {}", c);
    }

    return 0;
}` },
        { t: `p`, text: `输出四行，依次取出 c、o、d、e。注意 word 一共 4 个字符这件事，代码里一个字都没写 —— 你既没数长度，也没写 i < 4，循环跑四轮就自己停了。第 15 课那种「按门牌号取字符」的活儿在这里被彻底省掉，这就是「一个一个端给你」的意思。头文件请了 <string>，因为 std::string 住在里面（H 闸会盯着这一点）。` },
        { t: `h2`, text: `演示 2 · 数一数有几个 o` },
        { t: `code`, lang: `c++`, code: `std::string word = "code";
int count = 0;

for (auto c : word) {
    if (c == 'o') count++;             // 是 o 就记一笔
}

std::println("o 出现了 {} 次", count);   // 1（code 里只有一个 o）` },
        { t: `p`, text: `这是遍历最常用的一个套路：**每轮问一句「是不是我要的那个」，是就记一笔**。count = 0 那句必须写在循环外面，原因和第 35 课的累加器一模一样 —— 放进循环体就每轮被抹平。另外盯着点比较那一句：c 是一个字符，所以右边用**单引号** 'o'；写成 "o" 就变成字符串，编译器当场拒绝（第 12 课那堵墙又出现了）。想数元音、数空格、数大写，全都在这套骨架上改一个字。` },
        { t: `h2`, text: `演示 3 · 拿到手的是副本` },
        { t: `code`, lang: `c++`, code: `std::string word = "code";

for (auto c : word) {
    c = 'x';                           // 只改了手上那份副本
}

std::println("word 还是: {}", word);    // code，纹丝不动` },
        { t: `p`, text: `这一条是 range-for 最容易忽略的性格：每轮递到你手上的是**复制出来的一份**，你在手上怎么揉捏都不影响容器里那一个。所以「把每个字母都改成大写」这类**要写回原件**的活儿，range-for 用 auto 那种接法干不成（要干得有专门的接法，以后再讲）；而统计、查找、逐个打印这类**只看不改**的活儿，它是最顺手的。读代码时看到 for (auto c : …) 就该明白这是「只读」的语气，看到需要改原件，就是另一种工具出场的时候。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `冒号左边忘了声明：for (c : word) —— 报错核心是 error: 'c' was not declared in this scope。左边是声明语句，auto 或类型名一个都不能省。`,
          `冒号右边塞一个数字区间：for (auto i : 5) 不存在这种东西。range-for 的右边必须是「一串东西」（本课是 std::string），想数 0 到 4 就用第 35 课的三格 for。`,
          `以为能拿到序号：range-for 里没有 i，写 i 就是没声明的名字。需要位置就换三格 for，或者自己另开一个计数器变量每轮加一。`,
          `想改原件却用 auto 接：就像演示 3 那样，改了个副本，程序跑完一切照旧，还很难查。这是「静悄悄的错误」，比报错更麻烦。`,
          `边遍历边往那个容器里加东西或删东西：手里那份队列的长度被你临时改了，递到哪儿、还剩几个都说不清。本课先记一条铁规：**遍历的时候不要动容器本身**，真要边找边删有专门的招。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `换成自己的英文名，数一数元音字母有几个（a、e、i、o、u 都算，条件里多写几个 c == 什么，用「或」串起来）。`,
          `遍历 "hello"，遇到 l 就打印「找到了」（照演示 2 改比较的那个字母 —— 留意 hello 里有两个 l，所以你会看到两行「找到了」，下一课学了只停一次的手段再来收拾它）。`,
          `延伸：把 word 换成你自己的名字，用 range-for 数一数里面有几个字符（另开一个计数器，每轮加一），再和第 14 课学的求长度方法对一对结果一样不一样。`,
          `延伸：把演示 1 的 auto c 改成 char c，跑一遍，确认输出完全相同；再删掉 auto 试试报什么错，把报错第一行抄下来。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：range-for 两格、中间一个冒号，右边那串东西自己排队、自己报结束，每轮递一个副本到你手上；只看不改用它，要序号或要改原件就另想办法。` }
      ]
    },
    {
      id: `c38`, title: `第 38 课 · break 与 continue：循环的两个刹车`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：分清两种刹车 —— break 让整场循环立刻结束，continue 只把这一轮作废、直接进下一轮。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `前三课的循环都老老实实跑完每一轮：条件为假之前，循环体一轮都不会少。可真实任务里常常是「一找到就别找了」「这个不合格，跳过看下一个」。C++ 给循环装了两个踏板，都在循环体里踩，踩下去的效果完全不同。` },
        { t: `p`, text: `**break**：**当场跳出整个循环**。这一轮循环体里剩下的语句不做了，条件也不再问，程序直接接着**循环后面那一行**往下走。注意它不是「退出程序」，只是「退出这一层循环」。` },
        { t: `p`, text: `**continue**：**这一轮到此为止**，剩下的循环体语句不做了，直接进下一轮。放在 for 里时它跳过循环体剩余部分，但**第三格（步进）照做**，然后照旧问条件；放在 while 里就只跳回条件那一行 —— 这个小差别待会儿是本课最大的一颗雷。` },
        { t: `p`, text: `源稿那个打饭的比方很好用：**break 是「不吃了，回家」**——队伍里剩下的窗口跟你无关，取餐、找座位也跟你无关，你直接出了食堂。**continue 是「这个菜不要，打下一个」**——人还在队伍里，只是眼前这一格被跳过。共同前提是「你已经在循环里」，在循环外面写这两个词，编译器会当场告诉你它们只能待在循环体内。` },
        { t: `code`, lang: `text`, code: `for (int i = 1; i <= 10; i++) {
    语句 A
    if (…) break;       → 整个循环结束，跳到循环下面的语句 B
    语句 C              ← break 之后这行本轮不做了
    if (…) continue;    → 语句 C 及本轮剩下的不做了，去做步进格，再问条件
}
语句 B                ← break 和循环自然跑完，都会回到这里` },
        { t: `svg`, caption: `break 是跳出围栏，continue 是绕过这一轮`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 268">
  <text x="20" y="24" font-size="14" font-weight="700" fill="#142639">循环这道围栏：一个踏板翻出去，一个踏板绕过去</text>
  <text x="28" y="48" font-size="12" fill="#57677c">break：整场结束</text>
  <rect x="28" y="56" width="410" height="76" rx="12" fill="#f7f9fd" stroke="#8b98ab" stroke-width="2" stroke-dasharray="7 5"/>
  <g font-size="13" font-family="monospace">
    <rect x="44" y="74" width="34" height="42" rx="6" fill="#eef3fa" stroke="#2f6feb" stroke-width="1.5"/><text x="61" y="100" text-anchor="middle" fill="#142639">1</text>
    <rect x="88" y="74" width="34" height="42" rx="6" fill="#eef3fa" stroke="#2f6feb" stroke-width="1.5"/><text x="105" y="100" text-anchor="middle" fill="#142639">2</text>
    <rect x="132" y="74" width="34" height="42" rx="6" fill="#eef3fa" stroke="#2f6feb" stroke-width="1.5"/><text x="149" y="100" text-anchor="middle" fill="#142639">3</text>
    <rect x="176" y="74" width="34" height="42" rx="6" fill="#eef3fa" stroke="#2f6feb" stroke-width="1.5"/><text x="193" y="100" text-anchor="middle" fill="#142639">4</text>
    <rect x="220" y="74" width="34" height="42" rx="6" fill="#eef3fa" stroke="#2f6feb" stroke-width="1.5"/><text x="237" y="100" text-anchor="middle" fill="#142639">5</text>
    <rect x="264" y="74" width="34" height="42" rx="6" fill="#eef3fa" stroke="#2f6feb" stroke-width="1.5"/><text x="281" y="100" text-anchor="middle" fill="#142639">6</text>
    <rect x="308" y="74" width="34" height="42" rx="6" fill="#fdece1" stroke="#b8500f" stroke-width="2"/><text x="325" y="100" text-anchor="middle" fill="#b8500f" font-weight="700">7</text>
    <rect x="352" y="74" width="34" height="42" rx="6" fill="#f4f6f9" stroke="#c7d3e4" stroke-width="1.5"/><text x="369" y="100" text-anchor="middle" fill="#98a3b2">8</text>
  </g>
  <path d="M325 70 Q370 10 468 66" fill="none" stroke="#b8500f" stroke-width="2.5"/>
  <polygon points="472,70 460,60 466,74" fill="#b8500f"/>
  <rect x="478" y="52" width="142" height="58" rx="10" fill="#00599c"/>
  <text x="549" y="76" font-size="13" text-anchor="middle" font-weight="700" fill="#ffffff">循环后面那行</text>
  <text x="549" y="96" font-size="12" text-anchor="middle" fill="#cfe0f2">8、9、10 轮不到了</text>
  <text x="28" y="152" font-size="12" fill="#57677c">continue：只作废这一轮</text>
  <rect x="28" y="160" width="410" height="70" rx="12" fill="#f7f9fd" stroke="#8b98ab" stroke-width="2" stroke-dasharray="7 5"/>
  <g font-size="13" font-family="monospace">
    <rect x="44" y="182" width="34" height="40" rx="6" fill="#eef3fa" stroke="#2f6feb" stroke-width="1.5"/><text x="61" y="208" text-anchor="middle" fill="#142639">1</text>
    <rect x="88" y="182" width="34" height="40" rx="6" fill="#eef3fa" stroke="#2f6feb" stroke-width="1.5"/><text x="105" y="208" text-anchor="middle" fill="#142639">2</text>
    <rect x="132" y="182" width="34" height="40" rx="6" fill="#f4f6f9" stroke="#c7d3e4" stroke-width="1.5"/><text x="149" y="208" text-anchor="middle" fill="#98a3b2">3</text>
    <rect x="176" y="182" width="34" height="40" rx="6" fill="#eef3fa" stroke="#2f6feb" stroke-width="1.5"/><text x="193" y="208" text-anchor="middle" fill="#142639">4</text>
    <rect x="220" y="182" width="34" height="40" rx="6" fill="#eef3fa" stroke="#2f6feb" stroke-width="1.5"/><text x="237" y="208" text-anchor="middle" fill="#142639">5</text>
  </g>
  <path d="M122 180 Q149 156 180 180" fill="none" stroke="#1b7482" stroke-width="2.5"/>
  <polygon points="182,180 172,172 170,184" fill="#1b7482"/>
  <text x="230" y="176" font-size="12" fill="#1b7482" font-weight="700">3 这一轮被跳过，人还在队伍里</text>
  <text x="28" y="252" font-size="13" fill="#142639">for 里 continue 之后第三格（步进）照做，所以不会卡住；while 里没有那一格，这才是雷。</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `设计意图很直白：**「结束整场」一个踏板，「结束本轮」一个踏板**，合起来覆盖了循环里绝大多数「提前走人」的需求，而且都不用你去改条件表达式。它们对第 33、34、35、37 课那几种循环一视同仁，踩下去的那一刻就切断了。多说一句：break 以后还会在别的地方露脸，现在先记住它在循环里的行为就够了。` },
        { t: `p`, text: `用哪个踏板的判断也不复杂：**「再往下找也没有意义」→ break**（找到了、够了、超了、坏数据出现了）；**「这一个不算，后面还有」→ continue**（不符合条件的样本、要跳过的空行）。想清楚这一点，代码读起来就是「一句话说得清的走人理由」，而不是把整个循环体裹进五层 if 里。` },
        { t: `h2`, text: `演示 1 · break：找到 7 就离场` },
        { t: `code`, lang: `c++`, code: `#include <print>

int main() {
    for (int i = 1; i <= 10; i++) {
        if (i == 7) {
            std::println("找到 7，离场！");
            break;                 // 整个循环到此为止
        }
        std::print("{} ", i);
    }
    std::println("");
    std::println("循环外面的代码照常跑");
    return 0;
}` },
        { t: `p`, text: `屏幕上是这样两行：第一行 1 2 3 4 5 6 找到 7，离场！，第二行 循环外面的代码照常跑。三件事值得看。第一，**7 没被当成数字打出来** —— i == 7 那一轮先进了 if，打完那句话就踩 break，本轮后面的 std::print 根本没轮到。第二，8、9、10 三轮完全不存在，条件不再被问。第三，「找到 7，离场！」接在上一行 std::print 后面出现在同一行，因为 print 不补换行 —— 这是输出粘行的真实长相，先认一下，它不是 bug。最后那两行在循环外面，break 之后照常执行，这就是「break 不是退出程序」。` },
        { t: `h2`, text: `演示 2 · continue：偶数不要` },
        { t: `code`, lang: `c++`, code: `for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) continue;          // 偶数跳过，直接下一轮
    std::print("{} ", i);
}
std::println("");                       // 1 3 5 7 9` },
        { t: `p`, text: `输出 1 3 5 7 9。i 是偶数的那几轮，std::print 被 continue 跳过了，但**第三格 i++ 照常执行**，所以循环稳稳地走到 i 变 11 才结束 —— 这就是 for 里用 continue 安全的原因：步进写在格子里，谁也跳不掉它。` },
        { t: `h2`, text: `演示 3 · break 的拿手活：一够就收` },
        { t: `code`, lang: `c++`, code: `#include <print>

int main() {
    int sum = 0, stop_at = 0;
    for (int i = 1; i <= 100; i++) {
        sum += i;
        if (sum > 100) {
            stop_at = i;
            break;
        }
    }
    std::println("加到 {} 时和是 {}，超过 100 了", stop_at, sum);
    return 0;
}` },
        { t: `p`, text: `答案是加到 14 时和是 105。这个套路叫「**累加到超过某个值为止**」，用条件表达式根本写不出来 —— 你的停止条件不是「i 到几」，而是「sum 有没有超」，这种「跑几轮事先不知道」的活儿，第 33 课的 while 也能干，但 for 加 break 写出来更短，因为它自带「最多跑 100 轮」的安全网：万一逻辑写错，i 到 100 也就停了，不至于永远出不来。另外注意 **stop_at 这个记号变量**：i 出了循环就不存在了（第 35 课那条），想在外头知道「是在第几轮跳出来的」，就得在 break 之前把它抄到一个循环外的变量里。` },
        { t: `h2`, text: `演示 4 · 收拾上一课的尾巴：range-for 里用 break` },
        { t: `code`, lang: `c++`, code: `std::string word = "hello";

for (auto c : word) {
    if (c == 'l') {
        std::println("找到了");
        break;                         // 只报第一个 l，然后整场结束
    }
}` },
        { t: `p`, text: `上一课留了个尾巴：遍历 hello 时两个 l 各打一行「找到了」。这一课一个 break 就收工 —— **break 不管你是三格 for 还是 range-for，也不管你已经跑了多少轮**，它只认「我现在离开这个循环」。「找到第一个就停」是 break 用得最多的场合，好处不只是干净：字符串一长，剩下的字符一个都不用再看。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `while 里放 continue 忘了手动步进：while (i <= 10) { if (…) continue; i++; } —— i 永远不变，条件永远为真，**死循环**。for 里没这问题是因为步进在第三格；while 的步进写在循环体里，而 continue 恰好把循环体后面的语句全跳了。要么把 ++ 挪到 continue 之前，要么改用 for。`,
          `把 break 当 return 用：以为 break 之后 main 里剩下的代码也不跑了。实际只离开当前这一层循环，循环后面的语句一条不少地执行；想结束整个函数用的是 return（第 1 课就写过 return 0）。`,
          `以为 break 能一次跳出好几层循环：它只离开**紧挨着它的那一个**循环，外面那层下一轮照常开始。真要从深处一次脱身得靠标志变量，那是以后的事。`,
          `continue 的位置放错，把该干的活一起跳了：它之下的本轮所有语句都不执行，包括你后来才补进去的那几句。写完 continue 当场问一句「这一轮我还剩什么没做」。`,
          `筛条件写反：要 3 的倍数却写 if (i % 3 == 0) continue;，留下的是全部非倍数 —— 不报错、输出还挺像样，很难察觉。先把中文写清：「不要的那一面进 continue 的条件」。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把 break 条件改成 i == 3，看还打印几个数（先在纸上写下你预期的输出，再跑，对答案）。`,
          `用 continue 打印 1 到 20 中所有 3 的倍数（想清楚 continue 的条件要写「是 3 的倍数」还是「不是 3 的倍数」）。`,
          `延伸：把演示 3 的 100 换成 1000，看加到几的时候超；顺便体会为什么这种循环不能用条件表达式直接写。`,
          `延伸：拿演示 1 去掉那行 std::println("")，对比两次输出，看清 print 和 println 在换行上的区别怎么影响版面。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：break 是「整场结束」，跳到循环后面那行；continue 是「本轮作废」，for 里步进照做、while 里步进容易被跳掉 —— 那正是死循环的源头。` }
      ]
    }
  ]
};
