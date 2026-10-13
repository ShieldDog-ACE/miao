/* 喵站 · C++ 入门 正文分部 p18：第 75–78 课（第九轮 · 指针篇收尾：指针 vs 引用、栈与堆、裸指针四大坑、智能指针）
 *
 * 源稿：学习资料/C++入门/75_指针vs引用、76_栈与堆、77_裸指针的四大坑、78_智能指针。
 * 款式照 p13、p01 样板：tip 蓝·本课目标 → 原理讲解 → 它被设计成什么样 → 演示 1/2/3 → 常见坑 → 任务 → tip 绿·本课一句话
 *
 * 闸线备忘（本批必须守住的）：
 *   new / delete 首现于 76 课 —— c75 整章不出现这两个词，只用栈上的普通变量。
 *   智能指针首现于 78 课 —— c75、c76、c77 连注释里都不提那个词，77 的坑③解法只写「下一课专治」。
 *   struct、class 首现于 83、112 课 —— 四章一律不出现。模板同理往后放。
 *   异常首现于 176 课 —— c77 源稿任务 2 要用 try 与 catch，正文靠 allowConstructs 点名豁免并当场讲明白；
 *   考卷那边没有这个豁免口子，读者看得见的字段一律绕开那两个关键字，只在 selftest 的参考解里写全。
 *   引用与 & 在第 58 课已教，指针在第 74 课已教，本批往回指不越线。
 *   正文一律不写半角圆括号：函数名裸写，补充说明用中文括号。
 *   交叉引用只往回指，往前看的统一写「下一课」「以后再讲」。
 *
 * 验收：node --check dev/frontend/assets/data/cpp/p18.js
 *       node dev/tools/cpp-audit.cjs --part dev/frontend/assets/data/cpp/p18.js
 *       node dev/tools/cpp-exam-check.cjs --only c75,c76,c77,c78
 */
window.MIAO_CPP_P18 = {
  chapters: [
    {
      id: `c75`, title: `第 75 课 · 指针 vs 引用：纸条与外号`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把「外号」和「纸条」这两样东西彻底分开 —— 引用绑死一个人、一辈子不换；指针记一个门牌号、能空能换。三大区别说得出，日常该用哪个也就定下来了。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 58 课你给变量起过外号：int& alias = score;，之后 alias 就是 score 本人，改它等于改本人，取地址两个名字问出同一个门牌号。上一课我们认下了指针 —— 一张写着地址的纸条，纸条本身可以换：今天抄着张三的号，明天涂掉改成李四的，两个盒子谁都没动。这两样东西长得很像，都能「不复制值就碰到原件」，所以初学阶段最容易搅成一团。这一课不学新语法，只做一件事：把它们掰开，认清三大区别，顺便把「日常写代码到底选哪个」一次答掉。` },
        { t: `p`, text: `第一个区别：出生。引用声明那一行必须当场指认本人，写 int& ref = a; 才成立；想先写 int& ref; 空着待补，编译器直接拦下 —— 引用必须先有本人才能存在。纸条就自由得多：int* p; 单独一句合法，纸条先捏在手里、上面一个字没写；int* p = nullptr; 也合法，等于写明「目前没有指向」。这份自由正是后面两课所有麻烦的源头 —— 空着的纸条你也能硬去读它。` },
        { t: `p`, text: `第二个区别：能不能改绑。这是本课最反直觉的一处，源稿的实验 1 专门演它。int& ref = a; 之后写 ref = b;，你以为外号换主人了？没有。引用身上的等号永远是「给本人赋值」，不是「重新指认」，所以这句真正的意思是：把 b 的值抄进 a。跑完 a 变成 20、b 还是 20 —— 变的是盒子 a，ref 从生到死只拴着 a。想让纸条换指向？写 p = &d;，门牌号涂掉重填，c 和 d 一个字节都没动。` },
        { t: `p`, text: `第三个区别：用起来像什么。引用用起来就是本人，读写它跟读写原变量完全一样，不加任何符号。指针要多两个动作：往纸条上写号用 & 问地址，读纸条指着的值用 * 解引用。所以读代码时判断很省事 —— 类型里带 &，那是外号；类型后面挂星号，那是纸条，而纸条随时可能空着或者写错号。` },
        { t: `ul`, items: [
          `**出生**：引用必须当场绑定本人；纸条可以先空着，也能写明 nullptr。`,
          `**改绑**：引用认了就一辈子，赋值只给本人换内容；纸条随时能换指向，原盒子不受牵连。`,
          `**长相**：引用用起来像本人，不加符号；指针要 & 问地址、* 取值，各管一头。`,
          `**日常选择**：能用引用就用引用 —— 它不可能为空、不可能指错人；确实需要「可空」或「可换」，才轮到指针。`
        ]},
        { t: `svg`, caption: `左边：引用是同一个盒子上的两块名牌，赋值改的是盒子里的值，名牌不会掉。右边：指针是一张写着门牌号的纸条，涂掉重填就换了指向，也能空着`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 290" font-family="sans-serif">
  <text x="20" y="24" font-size="14" font-weight="700" fill="#2e7d32">引用：一块盒子挂两个名字</text>
  <rect x="20" y="40" width="280" height="100" rx="10" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <rect x="42" y="56" width="110" height="28" rx="6" fill="#ffffff" stroke="#8fa7c4" stroke-width="1.5"/>
  <text x="97" y="75" font-size="12" fill="#142639" text-anchor="middle">名牌 ref</text>
  <rect x="170" y="56" width="110" height="28" rx="6" fill="#ffffff" stroke="#8fa7c4" stroke-width="1.5"/>
  <text x="225" y="75" font-size="12" fill="#142639" text-anchor="middle">名牌 a</text>
  <rect x="96" y="94" width="128" height="38" rx="8" fill="#ffffff" stroke="#2e7d32" stroke-width="2"/>
  <text x="160" y="110" font-size="12" fill="#142639" text-anchor="middle">盒子 a</text>
  <text x="160" y="126" font-size="13" font-weight="700" fill="#b8232f" text-anchor="middle">10 → 20</text>
  <text x="36" y="170" font-size="12" fill="#57677c">ref = b;　→　改的是 a 的值，外号不换人</text>
  <text x="20" y="204" font-size="14" font-weight="700" fill="#00599c">指针：一张能涂改的纸条</text>
  <rect x="340" y="40" width="280" height="100" rx="10" fill="#eaf2fb" stroke="#00599c" stroke-width="2"/>
  <rect x="362" y="56" width="120" height="40" rx="6" fill="#ffffff" stroke="#00599c" stroke-width="2"/>
  <text x="422" y="72" font-size="12" fill="#00599c" text-anchor="middle">纸条 p</text>
  <text x="422" y="90" font-size="12" fill="#142639" text-anchor="middle">&amp;d</text>
  <line x1="482" y1="76" x2="532" y2="102" stroke="#57677c" stroke-width="2"/>
  <polyline points="524,96 532,102 521,106" fill="none" stroke="#57677c" stroke-width="2"/>
  <rect x="494" y="94" width="110" height="38" rx="8" fill="#ffffff" stroke="#57677c" stroke-width="2"/>
  <text x="549" y="110" font-size="12" fill="#142639" text-anchor="middle">盒子 d</text>
  <text x="549" y="126" font-size="12" fill="#142639" text-anchor="middle">44</text>
  <text x="356" y="170" font-size="12" fill="#57677c">p = &amp;d;　→　涂掉旧号填新号，盒子不动</text>
  <text x="356" y="204" font-size="12" fill="#57677c">纸条还能空着：int* q = nullptr;</text>
  <rect x="20" y="222" width="600" height="46" rx="8" fill="#f4f7fc" stroke="#c3ccd8" stroke-width="1.5"/>
  <text x="34" y="242" font-size="12" font-weight="700" fill="#b8232f">自由与代价</text>
  <text x="34" y="260" font-size="12" fill="#142639">引用三样都办不到，所以不可能为空、不可能指错人；指针能空能换，这份灵活正是所有指针 bug 的出生地。</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `C++ 明明能用一种东西解决「碰到原件」，为什么留两套？因为这两套规矩对应两种意图。引用是对「这里必然有个东西，而且不许中途变卦」的表达：既然语义上不许空、不许换，编译器就把这两条焊死，你连写错的机会都没有。纸条是对「我还没定，或者以后要改主意」的表达：能空着、能换号，也能指到不属于它的地方去。所以两者不是新旧之分，而是意图之分 —— 你写下的类型，就是在替以后读代码的人标注这段有没有「可能没有」。` },
        { t: `p`, text: `日常那条准则不是口味问题：能用引用就用引用。传参数想改原件，参数的类型带上 &；要还回「原件本身」让人接着改，返回类型带上 &。需要「可空」—— 比如一个查找函数可能什么都没找到 —— 引用表达不出来，这时才让纸条上场。判断标准背下来就一句：这段会不会出现「没有」和「换人」？都不会，就用引用。` },
        { t: `h2`, text: `演示 1 · 实验 1：ref = b 到底干了什么` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int a = 10, b = 20;
    int& ref = a;              // ref 从此永远是 a 的外号
    ref = b;                   // 不是「改绑到 b」，是把 b 的值抄给 a
    std::println("实验1: a={}, b={}", a, b);   // a=20, b=20
    std::println("变的是 a 吗? {}", a == 20);
    return 0;
}` },
        { t: `p`, text: `输出第一行是 实验1: a=20, b=20。这一行值得在脑子里过两遍：等号左边的 ref 走「外号」这条道，落到的是盒子 a；b 在右边，只被读了一次值。整件事跟「外号」两个字完全不冲突 —— 你要是把 ref 想成一根拴着 a 的绳子，就会以为这句是绳子松手改拴 b，而 C++ 压根不给你这个动作。第 58 课的坑里写过这条：引用身上的等号永远是给本人赋值。这里第一次用程序把它钉死。` },
        { t: `h2`, text: `演示 2 · 实验 2：纸条真的能换指向` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int c = 30, d = 40;
    int* p = &c;               // 纸条上写 c 的门牌号
    p = &d;                    // 涂掉旧号，填 d 的号：c 毫发无损
    *p = 44;                   // 解引用：改的是纸条现在指着的 d
    std::println("实验2: c={}, d={}", c, d);   // c=30, d=44
    return 0;
}` },
        { t: `p`, text: `跑出来 c=30, d=44，正是源稿那句「只有 d 被改」。三行各管一段：int* p = &c; 是造纸条并填第一个号；p = &d; 只动纸条，两个盒子的值一点没变；*p = 44 才真动值，动的是纸条当前指着的那个。对比着看更清楚 —— 引用那里赋值改的是盒子的内容，纸条这里赋值改的是纸条自己的内容。同一个等号，因为左边的类型不同，做的是两件事。读别人代码时看到左边是带星号的变量，先问一句：这句在改纸条，还是在改纸条指着的盒子？` },
        { t: `h2`, text: `演示 3 · 实验 3：纸条能空着，外号不行` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int x = 7;
    int* p = &x;
    int* p2 = nullptr;          // 合法：纸条先空着，写明「目前没有指向」
    std::println("p 空吗? {}", p == nullptr);
    std::println("p2 空吗? {}", p2 == nullptr);
    if (p2 != nullptr) std::println("{}", *p2);   // 判断在先，这句跑不到
    // int& bad_ref;            // 解开注释：报错，引用必须出生就绑定
    return 0;
}` },
        { t: `p`, text: `两个布尔一个是 false、一个是 true，if 里那句打印一次都没跑。那个 if 不是装饰，是「纸条可能空着」带来的必修课：先用 == nullptr 验一遍，再决定要不要解引用。最后那行注释掉的声明建议你亲手解开跑一次，报错是 'bad_ref' declared as a reference but not initialized —— 外号不能悬空挂在没人身上。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `**以为 ref = b; 是把外号改拴到 b**：不报错，纯算错。跑出来 a 成了 20，你预期 b 成了 10。根因：引用上的赋值永远给本人赋内容，改绑这个动作在 C++ 里不存在。`,
          `**声明引用不指认本人**：写 int& r; 得 error: 'r' declared as a reference but not initialized。根因：引用没有「先空着」这一档。`,
          `**空纸条硬解引用**：int* p = nullptr; 再写 *p = 1;，编译能过，运行当场 segfault 段错误。根因：nullptr 指不到任何盒子，解引用是未定义行为。用之前那句 != nullptr 就是护身符。`,
          `**星号和 & 漏了一个**：写 int* p = c; 报 cannot initialize a variable of type 'int *' with an lvalue of type 'int'。根因：纸条上填的是地址，得写 &c；星号说类型，& 问地址，谁也不能省。`,
          `**该用引用的地方用了纸条**：不报错，但纯属给自己找罪受 —— 参数明明不可能为空，却到处补 != nullptr 判断，还白留一个能写错号的口子。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `1. 写 int& max_of（int& x, int& y）返回较大者的引用，然后在外面 max_of（x, y）= 0; 直接把较大者清零（体会引用的「外号」威力）`,
          `2. 写 void reverse（std::vector<int>& v），原地反转一个 vector（不返回新容器）（这就是「日常用引用」的典型场景）`,
          `3. 思考：实验 1 里想「改绑」引用办不到，那指针实验 2 为什么就做得到？`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：外号绑死一个人、纸条能涂能空 —— 引用是「这里必然有个东西」的写法，指针是「可能还没有、以后会换」的写法，日常能用引用就用引用。` }
      ]
    },
    {
      id: `c76`, title: `第 76 课 · 栈与堆：盒子住哪块地`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：知道变量住在哪 —— 栈是食堂餐盘，函数一结束自动收走；堆是仓库，自己 new、自己 delete。会用 new 和 delete 这对关键字，并且明白为什么它们总跟指针一起出现。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `前面几十课里，你声明一个变量就是「要一个盒子」，从来没问过它从哪儿来、什么时候还。其实程序一直在替你管，而且管法只有一种：函数进来时在栈上摆好，函数返回时整层一并撤走。第 53 课讲过函数调用是一层一层摞起来的 —— 栈这个名字就是从「摞盘子」来的：谁最后摆上去谁最先被拿走，机器只用一小块地方、移动一下指针就能完成，快到几乎不要钱。代价是那块地方很小，通常只有几 MB，而且盘子跟着函数一起消失。` },
        { t: `p`, text: `另一块地叫堆，规矩完全反过来：程序启动时操作系统给一大片空白，谁想要就往里申请，申请到的自己负责归还。归还靠 delete，申请靠 new —— 这两个词今天第一次见面，也是本课唯一的新语法。省心程度上两者正好相反：栈全自动、你什么都不能做；堆全手动、你必须记得还，忘了还就是内存泄漏，编译器一声不响，机器只会越跑越慢。源稿那句「忘了还 = 内存泄漏」，分量要等你写完下一课那四个坑才掂得出来。` },
        { t: `p`, text: `什么时候必须去仓库？源稿给了三条，三条都是「栈办不到」：第一，东西太大 —— 一个装一百万个 int 的数组约 4 MB，栈那几 MB 加上别的盘子当场就溢了。第二，函数结束后还得活着 —— 栈上的盒子跟着那一层一起撤走，你想在 main 里继续用某个函数造出来的东西，它必须住在堆上。第三，大小要运行时才知道 —— 栈上摆盘子得先知道摆几个，int arr[n]; 里的 n 必须是编译期就能算出来的常量；用户输入几位数、文件里读几行，编译器哪里知道。堆不看这个，它按你当场报的数字划地方。` },
        { t: `ul`, items: [
          `**栈**：局部变量、函数参数、每层调用的现场。自动申请、自动归还，快、省心，但地方只有几 MB，出函数就没了。`,
          `**堆**：new 出来的东西。大小随你要、活到你 delete 为止，代价是全靠自己记性。`,
          `**new 还给你的是地址** —— 所以「堆」和「指针」总是一起讲：你手上只有一张写着门牌号的纸条，仓库那块地本身你搬不走。`,
          `**归还写法分两种**：new 单个对象用 delete，new 数组用 delete[]，那个方括号是告诉运行时「这是一整排，全还」。`
        ]},
        { t: `svg`, caption: `两块地：左边是栈，函数进来摞一个盘子、返回就整层撤走；右边是堆，new 申请一格、delete 归还，纸条上写的就是那一格的位置`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 310" font-family="sans-serif">
  <text x="20" y="24" font-size="14" font-weight="700" fill="#00599c">栈：食堂餐盘，自动收走</text>
  <rect x="20" y="36" width="270" height="200" rx="10" fill="#eaf2fb" stroke="#00599c" stroke-width="2"/>
  <rect x="44" y="60" width="222" height="34" rx="6" fill="#ffffff" stroke="#8fa7c4" stroke-width="1.5"/>
  <text x="155" y="82" font-size="12" fill="#142639" text-anchor="middle">main 的盒子</text>
  <rect x="44" y="102" width="222" height="34" rx="6" fill="#ffffff" stroke="#8fa7c4" stroke-width="1.5"/>
  <text x="155" y="124" font-size="12" fill="#142639" text-anchor="middle">report 的现场</text>
  <rect x="44" y="144" width="222" height="34" rx="6" fill="#fdf0e6" stroke="#b8232f" stroke-width="2"/>
  <text x="155" y="166" font-size="12" fill="#b8232f" text-anchor="middle">grade_of 的现场 ← 最新</text>
  <text x="155" y="198" font-size="12" fill="#57677c" text-anchor="middle">函数返回 → 整层撤走</text>
  <text x="36" y="228" font-size="12" fill="#2e7d32">几 MB 大小 · 自动回收 · 零操心</text>
  <text x="350" y="24" font-size="14" font-weight="700" fill="#b8232f">堆：仓库，自己申请自己还</text>
  <rect x="350" y="36" width="270" height="200" rx="10" fill="#fdf6f0" stroke="#b8232f" stroke-width="2"/>
  <rect x="372" y="60" width="80" height="34" rx="6" fill="#ffffff" stroke="#c3ccd8" stroke-width="1.5"/>
  <text x="412" y="82" font-size="12" fill="#57677c" text-anchor="middle">空</text>
  <rect x="464" y="60" width="80" height="34" rx="6" fill="#ffffff" stroke="#2e7d32" stroke-width="2"/>
  <text x="504" y="82" font-size="12" fill="#2e7d32" text-anchor="middle">10 20 30</text>
  <rect x="556" y="60" width="50" height="34" rx="6" fill="#ffffff" stroke="#c3ccd8" stroke-width="1.5"/>
  <text x="581" y="82" font-size="12" fill="#57677c" text-anchor="middle">空</text>
  <rect x="372" y="106" width="80" height="34" rx="6" fill="#ffffff" stroke="#c3ccd8" stroke-width="1.5"/>
  <text x="412" y="128" font-size="12" fill="#57677c" text-anchor="middle">空</text>
  <rect x="464" y="106" width="80" height="34" rx="6" fill="#ffffff" stroke="#b8232f" stroke-width="2"/>
  <text x="504" y="128" font-size="12" fill="#b8232f" text-anchor="middle">42</text>
  <rect x="556" y="106" width="50" height="34" rx="6" fill="#ffffff" stroke="#c3ccd8" stroke-width="1.5"/>
  <text x="581" y="128" font-size="12" fill="#57677c" text-anchor="middle">空</text>
  <text x="366" y="166" font-size="12" fill="#57677c">new int[3] 拿到一格 → 纸条上写它的号</text>
  <text x="366" y="188" font-size="12" fill="#57677c">delete[] 归还 → 号还写在纸上，地却不是你的了</text>
  <text x="366" y="216" font-size="12" fill="#b8232f">不 delete = 泄漏，编译器一声不响</text>
  <rect x="20" y="248" width="600" height="44" rx="8" fill="#f4f7fc" stroke="#c3ccd8" stroke-width="1.5"/>
  <text x="34" y="266" font-size="12" font-weight="700" fill="#142639">三条必须上仓库的理由</text>
  <text x="34" y="284" font-size="12" fill="#142639">① 太大，栈那几 MB 放不下　② 函数结束后还得活着　③ 大小运行时才知道 —— 栈数组的长度得是编译期常量</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `为什么不干脆只用一种？因为「快」和「自由」不可兼得。栈的申请归还只是把一根指针往上挪、往下挪，一条机器指令的事，所以 C++ 让普通变量默认全走栈 —— 你写了这么多课从没为内存操过心，靠的就是这个默认值。堆要在一整片空地上找地方、记账、归还，慢得多，但它是唯一能跨过函数寿命、能按现场数字定大小的地。C++ 的态度是把选择权交给你，同时把责任也交给你：它不替你 delete，也不检查你有没有漏。这份「你负责」的哲学，正是本课那句「裸 new 危险」的来处。` },
        { t: `p`, text: `还有一处设计值得点破：new 为什么不直接给你盒子，而给你地址？因为那块地的位置是运行时才定的，编译器无法给你一个「编译期就存在」的变量名。于是标准做法就是还你一个指针 —— 你手上永远是一张纸条，用完 delete 之后纸条还留着，这就是下一课「悬垂」的伏笔。也正因为如此，源稿那句提醒才重要：还完顺手把纸条写成 nullptr，撕掉旧号，免得以后误用。` },
        { t: `h2`, text: `演示 1 · 栈：普通局部变量都住这里` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int stack_arr[5] = {1, 2, 3, 4, 5};    // 出了 main 自动消失，不用管
    for (int v : stack_arr) std::print("{} ", v);
    std::println(" ← 自动回收，零操心");
    int big = 0;                            // 也在栈上，一个字节没多花
    std::println("big 也住在同一层：{}", big);
    return 0;
}` },
        { t: `p`, text: `第一行那五个格子是你在第 42 课就写过的栈上数组：长度 5 是写在代码里的常量，编译器当场就能算出「这一层要占 20 字节」，于是函数进来摆好、函数返回整层撤走，一句回收代码都不用你写。std::print 不换行、std::println 换行，是第 13 课那对老朋友，这里用它们把一行拼出来。跑出来是 1 2 3 4 5 ← 自动回收，零操心 和 big 也住在同一层：0。这种「什么都不用管」的舒服，正是接下来要失去的东西。` },
        { t: `h2`, text: `演示 2 · 堆：new 申请，delete 归还` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int* heap_arr = new int[5]{10, 20, 30, 40, 50};   // 向仓库要 5 个 int
    for (int i = 0; i < 5; ++i) std::print("{} ", heap_arr[i]);
    std::println("");
    std::println("第 3 格改成 99：{}", heap_arr[2] = 99);
    delete[] heap_arr;      // ★ 数组用 delete[]，单个对象用 delete
    heap_arr = nullptr;     // 还完顺手撕掉纸条，防止之后误用
    return 0;
}` },
        { t: `p`, text: `new int[5]{…} 这一行的读法：向仓库要 5 个连着摆的 int，并且用花括号里那串初值当场填好；它还回来的是这一排的起点地址，所以左边必须是一张纸条来接。heap_arr[2] 和栈数组的用法一模一样 —— 下标从 0 数起，编译器照样不知道你在数堆还是栈。跑出来 10 20 30 40 50、然后第 3 格改成 99。最后两行是本课的仪式：delete[] 把那一排地还回去，接着立刻把纸条写成 nullptr。要是漏掉 delete[]，程序照样正常结束、照样一行不少 —— 只是那 20 字节没人收，这正是「看不到的错误」。` },
        { t: `h2`, text: `演示 3 · 大小运行时才知道，栈给不出` },
        { t: `code`, lang: `c++`, code: `#include <iostream>
#include <print>
int main() {
    std::print("要几个格子？");
    int n = 0;
    std::cin >> n;                  // 这个数编译时根本不知道
    int* box = new int[n];          // 堆不在乎 n 是几
    for (int i = 0; i < n; ++i) box[i] = i * i;
    for (int i = 0; i < n; ++i) std::print("{} ", box[i]);
    std::println("");
    delete[] box;
    box = nullptr;
    return 0;
}` },
        { t: `p`, text: `输入 5，得到 0 1 4 9 16。这里唯一的看点是那句声明的对比：同样的 n 换成栈上写法 int stack_only[n]; 就是不合规的 —— 栈要在进函数那一刻知道占多少地方，而 n 是用户敲下去的。把 box 换成 new int[n]，编译器就不管了，划地盘是运行时的事。这里没有给初值，格子里是垃圾值，所以两个循环一个填、一个读，别把顺序写倒 —— 这也是堆和栈的一处手感差别：仓库的地不会替你准备任何东西。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `**delete 和 delete[] 用混**：new int[5] 却写 delete heap_arr;，clang 报 warning: 'delete' applied to a pointer that was allocated with 'new[]'。轻则行为未定义，重则只还了第一格。口诀：成对记 —— 带方括号申请的就带方括号还。`,
          `**还完还在用**：delete[] 之后读 heap_arr[i]，不报错，读出的是垃圾，也可能当场崩。根因：还的是那块地，不是你的纸条。所以 delete 完立刻写成 nullptr，让误用变成明确崩溃而不是脏数据。`,
          `**忘了 delete**：跑一百遍也看不出问题，任务管理器里内存一点点涨。根因：堆不会自动收，编译器只查语法不管运行时边界。这是本课最难发现的一类错误，下一课专门收拾它。`,
          `**把大数组硬塞进栈**：int arr[5000000]; 编译能过，运行直接崩，报错常见是 segment fault 或者堆栈溢出。根因：栈只有几 MB，装不下就得走仓库。`,
          `**拿 new 的结果当变量名传出去，之后再没有 delete 的机会**：纸条复印了几份、或者根本没接住，归还就无从谈起。根因：手上没地址就没法还 —— 这也是裸 new 最容易漏的一层。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `1. 用 new 创建 10 个 int 的数组，填 1~10，求和后 delete[]`,
          `2. 注释掉 delete[] 再运行 —— 程序表面正常，但内存已经漏了（这种「看不到的错误」正是裸 new 危险的地方）`,
          `3. 思考：为什么大数组建议放堆上？（提示：栈只有几 MB）`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：栈跟着函数活、堆跟着你的一句话活 —— new 给你的是地址，delete 之后地址还在你手上，谁负责归还，决定了这块地最后是不是垃圾。` }
      ]
    },
    {
      id: `c77`, title: `第 77 课 · 裸指针的四大坑：野、悬垂、漏、越界`,
      allowConstructs: [`异常`],   // 源稿任务 2 要求 at 越界时用 try-catch 接住 std::out_of_range，演示 3 与原理讲解当场讲明白「试着跑、接住它」
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把裸纸条的四种错法一次看全 —— 野指针、悬垂指针、内存泄漏、越界访问。四种编译器一句都不报，运行起来轻则输出垃圾、重则崩溃。每种记一句防护口诀。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课你刚领到 new 和 delete 这把自由：想申请就申请，想还就还。这一课来看自由的账单。源稿那句写得极准 —— 下面四种错误编译器都不报错，运行起来轻则输出垃圾数据，重则崩溃。为什么不报错？因为编译器的职责只到「这句合不合语法」：它知道你声明了一张纸条、也对纸条解了引用，但那串号此刻指着哪块地、那块地还是不是你的，只有运行时才说得清，而 C++ 从不替你花那道检查的钱。` },
        { t: `p`, text: `坑① 野指针：纸条没填号就拿来读。int* p; 单独一句合法，可里面的值是那块地上随便什么残留，读 *p 等于照着个随机号找房子。口诀两句：要么当场指向谁，要么先写 nullptr；真正要用之前，再判一次 != nullptr。nullptr 的好处是它是个「明确的空」，误用会当场崩、你立刻看见；未初始化的垃圾号最坏会指向真的存在的地，程序不崩，只是从此算错。` },
        { t: `p`, text: `坑② 悬垂指针：delete 之后纸条还在，这才是本课的新东西。delete p; 还掉的是那块地，纸条上一个字不会少 —— 于是你手里攥着一个「门牌号还在、房子已拆」的地址。读写它都不报错，因为那串号格式完全合法；后果叫未定义行为：可能崩、可能读出脏值、也可能你写进去的 9 在那块地重新租出去之后被覆盖掉，事故由别人承担。口诀：还完立刻把纸条写成 nullptr，让误用变成当场明确的崩溃。` },
        { t: `p`, text: `坑③ 内存泄漏：new 了不还。源稿那个注释掉的循环最说明问题 —— 每圈漏 4 字节，一百万圈就是 4 MB 收不回来，程序表面照常跑，只是内存曲线一路上坡。这种错最难发现，因为它没有任何一次「当场发作」。` },
        { t: `p`, text: `坑④ 越界访问：下标数过头。v 的 size 是 3，合法下标只有 0、1、2，你写 v[10] —— 编译器和运行时都不拦，它就去第 10 格读，读到什么都算你的。想有人拦，就走另一扇门：at。at 每次先查边界，越界就抛出 std::out_of_range —— 所谓抛出，是这一句当场停住、把那只东西扔出来；你用 try 和 catch 接住它，就能打印消息继续活，接不住程序就直接终止。这是本课唯一一处「C++ 肯替你查」的写法，代价也在这儿：at 多一道检查，方括号一次不查。` },
        { t: `ul`, items: [
          `**坑① 野指针**：没初始化就解引用。口诀 —— 要么立刻指向谁，要么先置 nullptr；用之前先判断。`,
          `**坑② 悬垂指针**：指向已经还掉的地。口诀 —— delete 完立刻把纸条写成 nullptr。`,
          `**坑③ 内存泄漏**：new 了不还，长期跑的服务被一点点拖垮。`,
          `**坑④ 越界访问**：[] 不拦、at 拦。口诀 —— 不确定就用 at，用 at 就得准备好接住它抛出来的东西。`
        ]},
        { t: `svg`, caption: `悬垂指针：地已经还给仓库，纸条上那串号照旧写着。房子拆了、门牌号还在 —— 照着它找过去，撞见什么全凭运气`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif">
  <text x="20" y="24" font-size="14" font-weight="700" fill="#2e7d32">t1　delete 之前：纸条与房子都对得上</text>
  <rect x="20" y="36" width="130" height="40" rx="6" fill="#ffffff" stroke="#00599c" stroke-width="2"/>
  <text x="85" y="52" font-size="12" fill="#00599c" text-anchor="middle">纸条 p</text>
  <text x="85" y="70" font-size="12" fill="#142639" text-anchor="middle">#0x7f3c</text>
  <line x1="150" y1="56" x2="228" y2="56" stroke="#57677c" stroke-width="2"/>
  <polyline points="220,50 228,56 220,62" fill="none" stroke="#57677c" stroke-width="2"/>
  <rect x="232" y="36" width="120" height="40" rx="6" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="292" y="52" font-size="12" fill="#2e7d32" text-anchor="middle">你的房子</text>
  <text x="292" y="70" font-size="12" fill="#142639" text-anchor="middle">值 5</text>
  <text x="380" y="52" font-size="12" fill="#142639">读 *p → 5，一切正常</text>
  <text x="380" y="70" font-size="12" fill="#57677c">这块地还在你名下</text>
  <text x="20" y="126" font-size="14" font-weight="700" fill="#b8232f">t2　delete 之后：号还在，房子已拆</text>
  <rect x="20" y="140" width="130" height="40" rx="6" fill="#ffffff" stroke="#00599c" stroke-width="2"/>
  <text x="85" y="156" font-size="12" fill="#00599c" text-anchor="middle">纸条 p</text>
  <text x="85" y="174" font-size="12" fill="#b8232f" text-anchor="middle">#0x7f3c</text>
  <line x1="150" y1="160" x2="228" y2="160" stroke="#b8232f" stroke-width="2" stroke-dasharray="6 4"/>
  <polyline points="220,154 228,160 220,166" fill="none" stroke="#b8232f" stroke-width="2"/>
  <rect x="232" y="140" width="120" height="40" rx="6" fill="#fdf0e6" stroke="#b8232f" stroke-width="2" stroke-dasharray="5 4"/>
  <text x="292" y="158" font-size="12" fill="#b8232f" text-anchor="middle">已还给仓库</text>
  <text x="292" y="174" font-size="12" fill="#57677c" text-anchor="middle">随时租给别人</text>
  <text x="380" y="156" font-size="12" fill="#b8232f">读 *p → 不报错，读到什么凭运气</text>
  <text x="380" y="174" font-size="12" fill="#b8232f">写 *p = 9 → 未定义行为，可能写坏别人</text>
  <rect x="20" y="204" width="600" height="46" rx="8" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="34" y="224" font-size="12" font-weight="700" fill="#2e7d32">防护口诀：还完立刻撕纸条</text>
  <text x="34" y="242" font-size="12" fill="#142639">delete p; 紧跟一句 p = nullptr; —— 之后再误用，程序当场崩给你看，比让你揣着一个假号跑三天强得多。</text>
  <text x="20" y="278" font-size="12" fill="#57677c">四种坑的共性：格式合法、语义错。编译器只看格式，所以一声不响。</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `C++ 的规矩叫「你不用为你不写的东西付钱」。边界检查、归还检查、纸条有效性检查，每一项都要在运行时花钱；你写的那些循环快就快在没人替你查。于是标准给的分工是：方括号交给你裸用，at 交给你带检查地用，两个都在，选哪个是你的事。源稿那句「v 下标 10 不拦、at 会抛出来还能接住」讲的就是这道岔路。` },
        { t: `p`, text: `那 delete 之后为什么不自动把纸条写成 nullptr？因为纸条和地是两样东西：delete 只管还地，它不知道外面有几份纸条抄着同一个号 —— 你要是写过 int* q = p;，那 q 怎么办？C++ 拒绝猜，把这个动作留给你手动补。所以那三句口诀不是语法要求，是人给自己补的护栏。至于根治泄漏和悬垂，靠的是另一套「作用域一结束自动归还」的工具，那是下一课的全部内容。` },
        { t: `h2`, text: `演示 1 · 坑① 野指针：判断在先才解引用` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int* wild = nullptr;          // 口诀一：没指向谁就先写 nullptr
    if (wild != nullptr) {        // 口诀二：用之前先判断
        std::println("{}", *wild);
    } else {
        std::println("坑① 空纸条不能解引用");
    }
    int x = 7;
    wild = &x;                    // 现在填上真号，才敢用
    std::println("填好号之后 *wild = {}", *wild);
    return 0;
}` },
        { t: `p`, text: `跑出来两行：坑① 空纸条不能解引用、填好号之后 *wild = 7。重点是把 else 那条去掉、直接 *wild 试试 —— 程序当场停，调试器里写着 Program received signal SIGSEGV，终端里常见那句是段错误，英文 segfault。这个信号是操作系统发来的：你指的那块地压根不在你的进程名下。见一次就记住了，而这种崩溃其实是运气好：至少它立刻告诉你出事了。` },
        { t: `h2`, text: `演示 2 · 坑② 悬垂指针：还完立刻置空` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int* p = new int(5);
    std::println("还没还: *p = {}", *p);
    delete p;                     // 房子拆了，地还给仓库
    // *p = 9;                    // 解开注释：未定义行为，可能崩、也可能写坏别人
    p = nullptr;                  // 口诀：还完立刻撕掉纸条
    std::println("还完之后 p 是空的吗? {}", p == nullptr);
    return 0;
}` },
        { t: `p`, text: `第一行的 5 是源稿那句「还没还，能用」；最后一行 true，因为纸条被自己涂成了空号。中间那行注释掉的赋值才是本课最贵的一处：它十有八九能跑，还会「看起来成功」—— 用带检查的运行方式能抓到一句很直白的诊断：heap-use-after-free。纪律只有一条：delete 和那句置空永远成对出现，中间不插任何东西。` },
        { t: `h2`, text: `演示 3 · 坑③ 泄漏与坑④ 越界：at 加上 try、catch` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <stdexcept>
#include <vector>
int main() {
    std::vector<int> v = {1, 2, 3};
    std::println("size={}, 合法下标 0..{}", v.size(), v.size() - 1);
    try {
        std::println("{}", v.at(10));       // at 查了边界，当场抛出
    } catch (const std::out_of_range& e) {  // 接住它
        std::println("抓住了: {}", e.what());
    }
    std::println("程序还活着");              // 没接住就直接终止
    return 0;
}` },
        { t: `p`, text: `三行输出：size=3 合法下标 0..2、抓住了后面跟着那句越界消息、程序还活着。新东西只有三块：try 花括号是「这段替我盯着」；at 一发现 10 不在范围内就抛出 std::out_of_range 并跳到 catch；catch 的括号里写「我接哪种类型」，e 就是那只被扔出来的东西，e 点 what 还回一句人话消息。没有 try，程序会在抛出那行直接终止。坑③ 这里没写进代码，因为它正是你要亲手试的那个：new 一百万次、归还零次，进程只会安静地涨内存，一声不响 —— 怎么根治，下一课给答案。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `**声明纸条不填号就读**：常见长相是那句 warning: 'p' is uninitialized when used here，跑出来一个天文数字般的垃圾值。根因：那块地上留着别人用过的残留，没人替你清零。`,
          `**对 nullptr 解引用**：终端里那句是段错误，调试器写 SIGSEGV。根因：空号指不到任何盒子。根除办法就是演示 1 那两句口诀。`,
          `**delete 之后接着读或者写**：不报错，可能读出 5、也可能读出 0 或脏值；写了更糟，可能覆盖别人刚租下的地。根因：还的是地，不是纸条。带检查的运行方式会报 heap-use-after-free。`,
          `**new 了却找不回该归还的那句**：常见于纸条被抄了好几份，或者从函数里递出去之后没人负责，表现是内存只涨不降。根因：堆只认地址，不认主人。`,
          `**以为 at 和方括号是一回事**：换成 at 之后越界不当场崩了，改成一句 terminate called after throwing an instance of std::out_of_range，程序还是停。根因：at 只把「悄悄错」变成「明确报错」，还得你接住它才算真处理。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `1. 把坑① 的解引用挪出 if 之外（即对 nullptr 解引用），看程序怎么崩（崩溃信息里找 segfault / 段错误 字样，见一次就记住了）`,
          `2. 用 v.at（10）放进 try-catch，捕获 std::out_of_range 并打印异常信息`,
          `3. 思考：坑③④ 为什么编译器不报错？（提示：编译器只查语法，不管运行时边界）`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：四种坑全都是「格式合法、语义错」，编译器管不着 —— 初始化、用前判断、还完置空、越界用 at 并接住，四句口诀就是人给自己补的护栏。` }
      ]
    },
    {
      id: `c78`, title: `第 78 课 · 智能指针：会自动归还的纸条`,
      allowConstructs: [`move / 转发动`],   // unique_ptr 的全部意义就是「钥匙只有一把，要给别人得移交」，演示 2 与图注当场讲清 std::move 干什么
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把上一课那四句口诀换成一套不用背的东西 —— 用 std::unique_ptr 和 std::shared_ptr 接住堆上的地，作用域一结束自动归还，从此几乎不写 new 和 delete。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课你抄了四句护栏，全凭自觉，而靠自觉的东西总有一天会漏抄一句。这一课的解法很聪明：把「归还」绑到纸条本身 —— 纸条活着，地归它管；纸条一死，地自动还回仓库。纸条什么时候死？作用域结束那一刻。你在第 53 课就见过这套自动：栈上的盒子跟着函数一起撤走。智能指针就是把这份自动推广到堆上的地，一个字不用你多写。` },
        { t: `p`, text: `标准给的第一张纸条叫 unique_ptr，独占。这块地同一时刻只有一张纸条指着它，所以它不许被复制 —— 复制出两张纸条，谁先归还都会让另一张悬垂，干脆编译阶段就不给你抄。想让它归别人？只能移交：钥匙从 p 递到 q 那一刻，p 自动变成空纸条，天下仍然只有一把钥匙。独占是默认选择，因为它的代价几乎为零 —— 一个指针的大小、一句析构。` },
        { t: `p`, text: `第二张叫 shared_ptr，合租。它心里记着一个数：现在有几张纸条指着这块地。每多一张抄手加一，每死一张减一，减到零那一刻才真归还 —— 源稿那句「最后一个走的关灯」就是它。代价是计数表要现造、每次抄手都得动它，比独占慢一点，也更容易出错：两块地互相指对方时谁都不会先死，计数永远归不了零，那是以后再讲的一课。` },
        { t: `p`, text: `造它们一律走 std::make_unique 和 std::make_shared 这两扇门，后面写类型和初值，不用你碰 new。为什么不写 std::unique_ptr 等于 new 那种形式？因为 new 一旦出现在你眼里，就说明归还这件事又被你想成「将来某句」了 —— 上一课那 4 MB 就是这么漏掉的。` },
        { t: `ul`, items: [
          `**make_unique**：造独占纸条，数组另有专门写法 make_unique 后带方括号类型，归还时它自己知道该用哪一种。`,
          `**独占**：不许复制，只能移交；移交完原来那张就空了，误用会当场崩，比悬垂着跑三天强。`,
          `**shared_ptr**：多人合租，用 use_count 能看现在有几个人在，归零才还。`,
          `**选择顺序**：先用值，大对象用 const 引用；真要上堆，默认 unique_ptr；确实要多处共享，才轮到 shared_ptr。`
        ]},
        { t: `svg`, caption: `unique_ptr 的移交：钥匙只有一把，递出去那一刻原主手里就空了。左边是复制纸条的危险，右边是移交之后唯一的钥匙`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif">
  <text x="20" y="24" font-size="14" font-weight="700" fill="#b8232f">如果纸条能复制：两张都想归还</text>
  <rect x="20" y="36" width="120" height="36" rx="6" fill="#ffffff" stroke="#00599c" stroke-width="2"/>
  <text x="80" y="58" font-size="12" fill="#00599c" text-anchor="middle">纸条 p</text>
  <rect x="20" y="82" width="120" height="36" rx="6" fill="#ffffff" stroke="#b8232f" stroke-width="2" stroke-dasharray="5 4"/>
  <text x="80" y="104" font-size="12" fill="#b8232f" text-anchor="middle">抄来的纸条</text>
  <rect x="180" y="56" width="130" height="46" rx="8" fill="#fdf0e6" stroke="#b8232f" stroke-width="2"/>
  <text x="245" y="76" font-size="12" fill="#b8232f" text-anchor="middle">那块地</text>
  <text x="245" y="94" font-size="12" fill="#142639" text-anchor="middle">42</text>
  <line x1="140" y1="54" x2="178" y2="70" stroke="#57677c" stroke-width="2"/>
  <line x1="140" y1="100" x2="178" y2="88" stroke="#b8232f" stroke-width="2"/>
  <text x="330" y="66" font-size="12" fill="#b8232f">两份都到期 → 同一块地还两次</text>
  <text x="330" y="86" font-size="12" fill="#b8232f">或者先还的那份让另一份悬垂</text>
  <text x="330" y="106" font-size="12" fill="#57677c">所以 unique_ptr 直接禁止复制</text>
  <text x="20" y="152" font-size="14" font-weight="700" fill="#2e7d32">移交：钥匙只有一把，递出去就空了</text>
  <rect x="20" y="164" width="120" height="40" rx="6" fill="#f4f7fc" stroke="#c3ccd8" stroke-width="2"/>
  <text x="80" y="180" font-size="12" fill="#57677c" text-anchor="middle">p 交出之后</text>
  <text x="80" y="198" font-size="12" fill="#b8232f" text-anchor="middle">nullptr</text>
  <line x1="146" y1="184" x2="212" y2="184" stroke="#2e7d32" stroke-width="2.5"/>
  <polyline points="204,178 212,184 204,190" fill="none" stroke="#2e7d32" stroke-width="2.5"/>
  <text x="179" y="176" font-size="12" fill="#2e7d32" text-anchor="middle">std::move</text>
  <rect x="216" y="164" width="120" height="40" rx="6" fill="#ffffff" stroke="#2e7d32" stroke-width="2.5"/>
  <text x="276" y="180" font-size="12" fill="#2e7d32" text-anchor="middle">q 现在拿着</text>
  <text x="276" y="198" font-size="12" fill="#142639" text-anchor="middle">唯一钥匙</text>
  <line x1="336" y1="184" x2="394" y2="184" stroke="#57677c" stroke-width="2"/>
  <polyline points="386,178 394,184 386,190" fill="none" stroke="#57677c" stroke-width="2"/>
  <rect x="398" y="164" width="130" height="40" rx="8" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="463" y="180" font-size="12" fill="#2e7d32" text-anchor="middle">那块地 42</text>
  <text x="463" y="198" font-size="12" fill="#142639" text-anchor="middle">仍只有一位主人</text>
  <rect x="20" y="222" width="600" height="52" rx="8" fill="#f4f7fc" stroke="#c3ccd8" stroke-width="1.5"/>
  <text x="34" y="242" font-size="12" font-weight="700" fill="#142639">对照：shared_ptr 是合租，抄手不算错，但计数要有人减</text>
  <text x="34" y="262" font-size="12" fill="#142639">s1 递给 s2 → 计数 2；两人各自出作用域 → 计数 1、0；归零那一刻才真归还，谁都不必写 delete。</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `这套「活到作用域结尾自动收尾」的做法有个正式名字叫 RAII，本课先用、以后再深挖。眼熟很正常：std::vector 早就在替你干同样的事 —— 你从没为一串 int 的地操过心，容器一死地把也还了。能装进 vector 的东西压根轮不到你碰 new 和 delete；智能指针补的是剩下那一小块：确实要在堆上造一个对象，而且它的寿命得自己说。` },
        { t: `p`, text: `为什么分两张纸条而不是只给一种？因为「独占」和「共享」是两种真意图，代价也不同：独占在大括号那一行准确无误地归还，一个字节不多占；共享要现造计数表，每次抄手都动它一次。C++ 的规矩是别为你不需要的东西付钱 —— 所以默认 unique_ptr，确实多处共享才换 shared_ptr。选择顺序也就定了：能用值就用值，大对象用 const 引用，必须上堆才用智能指针，裸 new 和 delete 只留给理解原理用。` },
        { t: `h2`, text: `演示 1 · 出大括号自动归还` },
        { t: `code`, lang: `c++`, code: `#include <memory>
#include <print>
int main() {
    {
        auto p = std::make_unique<int>(42);      // 相当于 new int(42)，但不写 delete
        std::println("unique_ptr: {}（出了大括号自动还）", *p);
    }   // ← 这里自动归还：无泄漏、无悬垂，全靠作用域
    {
        auto arr = std::make_unique<int[]>(5);   // 数组的专门写法
        for (int i = 0; i < 5; ++i) arr[i] = i * i;
        std::println("数组第 3 格：{}", arr[2]);
    }
    return 0;
}` },
        { t: `p`, text: `跑出来 unique_ptr: 42（出了大括号自动还）和 数组第 3 格：4。读法三处：make_unique 后面那对尖括号写「这块地装什么」，圆括号里的 42 是初值；用它跟用纸条一样，星号取值、下标访问都行；花括号一合，归还就发生了 —— 你翻遍这段找不出 delete 两个字。数组版要写成带方括号的类型，它自己知道整排怎么还。` },
        { t: `h2`, text: `演示 2 · 钥匙只有一把：移交，顺手治掉坑③` },
        { t: `code`, lang: `c++`, code: `#include <memory>
#include <print>
int main() {
    auto p = std::make_unique<int>(7);
    auto q = std::move(p);          // 移交：钥匙给 q，p 当场变空纸条
    std::println("p 空了吗? {}", p == nullptr);
    std::println("q 指着的是原物：{}", *q);
    // auto copy = p;               // 解开注释：编译报错，独占的不许复制
    for (int i = 0; i < 1000000; ++i) {
        auto one = std::make_unique<int>(i);   // 每圈出大括号就还
    }
    std::println("这一百万圈跑完，一格都没漏");
    return 0;
}` },
        { t: `p`, text: `输出是 p 空了吗? true、q 指着的是原物：7、这一百万圈跑完，一格都没漏。std::move 读成「我这份不要了，给你」就够：它不复制东西，只把唯一那把钥匙挪过去，原主自动空掉。最后那个循环是上一课坑③ 的改写版 —— 当初 new 一百万次、归还零次，现在一句 delete 都不必写。独占性还在替你捉错：想复制就报 call to implicitly-deleted copy constructor，意思是这张纸条抄不得。` },
        { t: `h2`, text: `演示 3 · 多人合租：shared_ptr 与计数` },
        { t: `code`, lang: `c++`, code: `#include <memory>
#include <print>
#include <string>
int main() {
    auto s1 = std::make_shared<std::string>("共享数据");
    auto s2 = s1;                   // 合租：直接赋值就行，计数加一
    std::println("几个人在用? {}", s1.use_count());
    {
        auto s3 = s1;               // 再拉一个人进来
        std::println("里头三位: {}", s1.use_count());
    }                               // s3 出作用域，计数减回二
    std::println("出来了还是: {}", s1.use_count());
    return 0;
}` },
        { t: `p`, text: `三行输出是 几个人在用? 2、里头三位: 3、出来了还是: 2。这里第一次出现「可以复制」的智能指针：shared_ptr 的赋值就是加一位合租人，因为它靠计数而不是独占来管归还 —— 这正是上一课源稿任务里那句「多处共享」的正解。用 *s1 读到的是那串「共享数据」。真正要记的是那条纪律：每加一位合租人都看得见，每一位的离场也都算数；等到最后一位走出去，地当场还掉，全程没人写过 delete。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `**想复制独占纸条**：auto copy = p; 报 call to implicitly-deleted copy constructor of 'std::unique_ptr<int>'。根因：两张纸条指同一块地，归还就会重复。要给别人就写 std::move，或者直接给函数参数收引用、让它只借看。`,
          `**移交之后还用原纸条**：p 已是空号，*p 当场段错误。根因：钥匙真的只有一把，给出去就没了。这不是 bug，是它在替你指出「这里还有人以为自己有」。`,
          `**拿 get 那一下取到裸地址、再自己 delete 一次**：智能指针到期时又还一遍，重复归还直接崩。根因：get 只是给人看一眼，所有权从没转出去。口诀：谁造的纸条谁负责，绝不手动还。`,
          `**两张 shared_ptr 互相指对方**：计数永不归零，地还不回来 —— 报错没有、崩溃没有，纯漏。这是这套机制唯一治不了的漏，以后再讲解法，本课你只要知道「共享别绕成圈」就够。`,
          `**明明该用容器却去 new 一串**：为了存十个 int 去管纸条，归还、越界、异常路径全得自己扛。vector 自己管内存，根本轮不到你操心 —— 源稿那句 99% 就是这条。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `1. 把 L2-02e 坑③ 的泄漏循环改成 unique_ptr 版本，确认不用写 delete（L2-02e 就是上一课那四个坑里的坑③，正文【演示 2】末尾那个循环是答案的样子）`,
          `2. 用 make_unique<int[]> 建 10 个元素填 1~10 求和，对比 L2-02d 任务 1 的手写 delete 版（L2-02d 是第 76 课）`,
          `3. 思考：为什么说 vector + 智能指针消灭了你 99% 的 new/delete 需求？`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：把「记得归还」换成「纸条一死地自动还」—— 独占用 unique_ptr、要给人就移交，共享用 shared_ptr、数到零才关灯，而绝大多数时候你真正该用的是 vector。` }
      ]
    }
  ]
};
