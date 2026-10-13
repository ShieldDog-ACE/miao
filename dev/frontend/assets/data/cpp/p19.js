/* 喵站 · C++ 入门 正文分部 p19：第 79–81 课（第九轮 · 入门收官：lambda 三件套 —— 一次性小函数、捕获、配 sort）
 *
 * 源稿：学习资料/C++入门/79_lambda一次性的小函数.cpp、80_捕获让lambda记住外面的变量.cpp、81_lambda配sort自定义排队规则.cpp
 * 款式照 p13（第 56、57 课就是 lambda 的首发）、六栏照 p01：
 *   tip 蓝·本课目标 → 原理讲解 → 它被设计成什么样 → 演示 1/2/3 → 常见坑 → 任务 → tip 绿·本课一句话
 *
 * 这三课的定位：回收 + 进阶，不当新东西重教。
 *   c79 回收第 56 课的长相，重点换成「一次性」这三个字的判断力，并把「lambda 是个值」点破，为 c81 递出去铺路。
 *   c80 兑现第 57 课【任务】2 欠的那句话 —— & 捕获。新东西只有「按引用带原件」这一层。
 *   c81 回收第 65 课的 sort，新东西是「把 lambda 递给 sort 当裁判」：第一次把一段行为交出去。
 *
 * 闸线备忘（本批守住的）：struct 83、模板 84、map 96、set 100、class 112 一个不出现；
 *   其他标准算法（count_if、find_if、transform 一族）82 课才教，本批一律不碰，只用 sort。
 *   正文与图注一律中文括号（），函数名裸写；交叉引用只往回指，往前看统一写「下一课」。
 *
 * 验收：node dev/tools/cpp-audit.cjs --part dev/frontend/assets/data/cpp/p19.js
 *       node dev/tools/cpp-exam-check.cjs --only c79,c80,c81
 */
window.MIAO_CPP_P19 = {
  chapters: [
    {
      id: `c79`, title: `第 79 课 · lambda：一次性的小函数`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把第 56 课那把手边的小工具重新捡起来，这次练的不是新语法，而是「一次性」那三个字 —— 什么活儿值得现场捏一把、不收参数的 lambda 长什么样、以及它为什么有资格被递给别人。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 56 课你已经见过它的长相：空中括号、圆括号里两个 int、花括号里一句 return，最后拿分号收口，整套东西装进一个 auto 变量。这三截你早会读了，这一课不重讲语法，讲的是源稿那句大白话：「只是想算个小账，犯不着正儿八经写一个函数」。走到入门快收尾，你手里装活儿的地方一共两处：正式函数有名有姓、写在所有函数外面、从头活到尾；lambda 写在函数肚子里、那一层一结束就跟着没了。判断力就压在这一问上：这段活儿是只在这里要一次，还是迟早会有别人来喊？` },
        { t: `p`, text: `源稿给了两把工具，第二把才是新东西。第一把 add 收两个 int、还一个和，跟第 56 课那把 mul 是一回事。第二把 hi 连参数表都不要 —— 中括号后面直接跟花括号。这里有个容易看漏的分别：定义那一截的参数表可以整个省掉，调用那一截的那对圆括号却一个都不能少。写 hi() 才算喊它，光写 hi 只是提到名字。参数表可省、调用不可省，两件事不矛盾 —— 前者是「我不收原料」，后者是「机器得有人按下开关才转」。` },
        { t: `p`, text: `还有一处值得这一课点破：lambda 是个值。它能被 auto 接住，能被赋给另一个名字，能被塞进参数里递出去 —— 第 56 课我们只把它当「装在变量里的工具」用，那还只是半扇门。真正的好戏是把它整个交出去，让别人的函数拿着它去算、去比、去决定顺序。这一课先把「它是一个能拿在手里的东西」坐实，递出去那一回在后面：下一课先讲怎么把外面的变量带进门，再往后的 sort 那一课才是把它交给别人的现场。` },
        { t: `ul`, items: [
          `**什么时候用它**：只用一次、三五行见底、挪走就没人要的小活儿 —— 现场捏一把，用完随那一层作用域丢掉，不占文件的位置。`,
          `**什么时候别用**：两处以上都要用、身体长到十行开外、或者别的函数也得喊 —— 名字和位置本来就是省心的东西，写成正式函数。`,
          `**三截各自能不能省**：中括号不能省，它是 lambda 的身份证；参数表可以整个不写；花括号必须写；句末的分号必须写。`,
          `**返回类型照样不用写**：编译器照身体里那句 return 反推，只留一条出货口最稳。`
        ]},
        { t: `svg`, caption: `一把 lambda 拆成三截：中括号是「带谁进门」的申领单，圆括号是收原料的窗口，花括号是真正干活的身体；调用那对括号是按下开关的手`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250" font-family="sans-serif">
  <text x="20" y="24" font-size="14" font-weight="700" fill="#142639">源稿那一行拆成三截看</text>
  <text x="30" y="72" font-size="15" font-weight="700" fill="#142639">auto add = </text>
  <rect x="160" y="48" width="60" height="38" rx="6" fill="#eaf2fb" stroke="#00599c" stroke-width="2"/>
  <text x="190" y="72" font-size="14" font-weight="700" fill="#00599c" text-anchor="middle">[ ]</text>
  <rect x="228" y="48" width="150" height="38" rx="6" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="303" y="72" font-size="14" font-weight="700" fill="#2e7d32" text-anchor="middle">(int a, int b)</text>
  <rect x="386" y="48" width="220" height="38" rx="6" fill="#fdf0e6" stroke="#b8232f" stroke-width="2"/>
  <text x="496" y="72" font-size="13" font-weight="700" fill="#b8232f" text-anchor="middle">{ return a + b; };</text>
  <line x1="190" y1="90" x2="190" y2="118" stroke="#00599c" stroke-width="2"/>
  <text x="190" y="136" font-size="12" fill="#00599c" text-anchor="middle">申领单：本课一律空着</text>
  <text x="190" y="152" font-size="12" fill="#57677c" text-anchor="middle">空着就是不拿外面的东西</text>
  <line x1="303" y1="90" x2="303" y2="118" stroke="#2e7d32" stroke-width="2"/>
  <text x="303" y="136" font-size="12" fill="#2e7d32" text-anchor="middle">参数表：收原料的窗口</text>
  <text x="303" y="152" font-size="12" fill="#57677c" text-anchor="middle">不收原料时整截可以省</text>
  <line x1="496" y1="90" x2="496" y2="118" stroke="#b8232f" stroke-width="2"/>
  <text x="496" y="136" font-size="12" fill="#b8232f" text-anchor="middle">身体：真正干活的那几行</text>
  <text x="496" y="152" font-size="12" fill="#57677c" text-anchor="middle">return 那一行决定还什么</text>
  <rect x="20" y="176" width="600" height="56" rx="8" fill="#f4f7fc" stroke="#c3ccd8" stroke-width="1.5"/>
  <text x="34" y="198" font-size="12" fill="#142639">调用处：add(3, 5) —— 那对圆括号是按下开关的手，光写 add 只是提到名字。</text>
  <text x="34" y="218" font-size="12" fill="#57677c">定义处的参数表可省，调用处的括号不可省：一个是「不收原料」，一个是「谁来触发」。</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `为什么允许函数不起名字？因为「逻辑」和「名字」本来就没绑死。你从第 4 课起就在写没名字的值 —— 一个 85、一串文字，都是当场写出来递给别人。C++ 把这件事推广到了「行为」上：以前递出去的是数字和文字，现在递出去的是一段计算。既然是值，它就有值的一切待遇：能被 auto 接住、能被赋值、能被复制，也就能被递进别人的参数里。` },
        { t: `p`, text: `而「一次性」这层意思来自它的寿命：工具的名字和它所在那一层作用域同生死，花括号一收，那个名字就没了，别的函数想喊也喊不到。这不是缺陷，是设计给你的提示 —— 你不用为一段只用一次的逻辑负责起名、摆放、日后维护。` },
        { t: `h2`, text: `演示 1 · 源稿现场：一把收原料，一把不收` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    auto add = [](int a, int b) { return a + b; };
    std::println("add(3, 5) = {}", add(3, 5));

    auto hi = [] { return "你好"; };       // 连参数表都省了
    std::println("{}", hi());
    return 0;
}` },
        { t: `p`, text: `跑出来是 add(3, 5) = 8 和 你好 两行。第一把跟第 56 课那把 mul 完全同构，闭着眼都写得出来；新的是第二把：中括号后面直接跟花括号，一句 return 还出一串文字。注意 hi 的调用 —— 那对括号还是得写，因为没有原料可塞，不等于没有开关要按。源稿把这两把摆在一起很有心：一个演示「参数表照常写」，一个演示「参数表可以整个没有」，哪一截软、哪一截硬一次说清。` },
        { t: `h2`, text: `演示 2 · 本课任务现场：一把 square` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    auto square = [](int x) { return x * x; };
    std::println("square(9) = {}", square(9));

    for (int i = 1; i <= 4; i++) {         // 同一把工具喊四次
        std::println("{} 的平方 = {}", i, square(i));
    }
    return 0;
}` },
        { t: `p`, text: `任务是源稿那一条：「写 lambda 收一个 int，返回它的平方，打印 square(9)」，两行代码就交代完了，屏幕上先出 square(9) = 81，接着是 1、4、9、16 四行。这一课要练的判断藏在这里头 —— 求平方这件事小得可怜，可如果第三个、第四个函数都要用它，你还会写成 lambda 吗？我多半不会，那时候它值得有个正式的名字、写在所有函数外面，谁都喊得到。一次性不是省事，是对「这段逻辑能活多久」下的一句判断。` },
        { t: `h2`, text: `演示 3 · 它是个值：换个名字照样喊` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    auto shout = [](int times) {
        std::println("开课啦，一共 {} 声！", times);
    };
    shout(3);
    auto again = shout;                    // 把工具本身赋给另一个名字
    again(7);                              // 新名字照喊不误
    std::println("再喊一次原来的：");
    shout(1);
    return 0;
}` },
        { t: `p`, text: `三行打印：一共 3 声、一共 7 声、一共 1 声。中间那一句 auto again = shout; 是这一课真正想给你的手感 —— 等号右边那个 shout 不是某个数、也不是一串文字，它是一整段行为，而它照样能被赋给另一个名字、照样能被喊。你第 4 课用 auto 接的是值，今天用它接的是「会做事的东西」，语法上它们是同一句话。这件事却是后面那出戏的地基：既然行为能拿在手里，它就能被递出去，塞进别的函数的参数里 —— 标准库里有一批函数正等着收这种东西，第 65 课那位排队的 sort 就是最典型的一个。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `**花括号后面丢了分号**：报错很直白 —— expected ';' after lambda expression。它是一条声明语句的尾巴，和第 51 课那种函数定义不同，函数定义的结尾后面没有这个东西。`,
          `**光写名字当调用**：std::println("{}", shout) 得 no matching function for call to 'println'，或者说这个类型没法格式化。根因：你递的是那把工具本身，不是它跑出来的结果；必须加上那对圆括号、原料给够。`,
          `**把中括号一起省了**：写 auto add = 后面直接跟圆括号参数表和花括号身体，编译器报 expected expression。那对空括号是 lambda 的身份证，省了它整句就成了对不上号的括号。`,
          `**身体里几条路还出不同形状的东西**：一条 return 文字、一条 return 数字，报错是 inconsistent types in return type deduction —— 返回类型由那句 return 反推，两条路推出两种它就没法定下来。每条路只留一个出货口。`,
          `**身体越写越长**：不报错，纯难读。二十行的匿名块读的人得在脑子里同时维护两层上下文，这跟第 55 课「大活拆小活」正好反着走 —— 长到这个地步就该提成正式函数，起名字、放到外面去。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `1. 写 lambda 收一个 int，返回它的平方，打印 square(9)`,
          `2. 延伸：再做一把不收任何参数、只 return 一句「今天也要加油」的 lambda，喊它三次 —— 一次直接喊，一次先存进变量再喊，一次写完立刻加括号喊掉。跑完说说「定义处的参数表可省、调用处的括号不可省」这句话你信了没有。`,
          `3. 延伸：把演示 2 那把 square 改成正式函数写在 main 上面，两个版本都跑一遍。然后回答自己一句话：这段逻辑只用在这一层，还是别处也要用？你的答案决定你该选哪一版 —— 这不是语法问题，是寿命问题。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：lambda 是一段能被拿在手里的行为 —— 参数表可以整个省掉，调用那对括号一个都不能少；它是个值，所以今天能赋给第二个名字，明天就能被递给别人。` }
      ]
    },
    {
      id: `c80`, title: `第 80 课 · 捕获：让 lambda 记住外面的变量`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把第 57 课【任务】里欠下的那句「& 捕获后面会讲」兑现 —— 同一个中括号，这次讲清两种装法：按值带走一张照片，按引用留一根线，以及它们各自是为了干什么活。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `捕获这件事你第 57 课就学过了：中括号里点上 base，lambda 就在定义那一刻把 base 复印一份塞进自己口袋，外面怎么改都不关它的事 —— 那句 base 已是 200、算出来还是 101 的现场你多半还记得。那一课的任务里我留了一句软话：想用最新值，提示是 & 捕获，后面会讲。这一课就是那个「后面」，别当新语法从头学，它只是一件事换了个装法。` },
        { t: `p`, text: `两种装法各写各的。写 [x]，叫按值捕获，包里是复印件，改它不动原件。写 [&x]，叫按引用捕获，包里根本没有第二个盒子 —— 那是通往 x 本人的路，你在 lambda 里给它赋值，改的就是外面那个 x。源稿那句类比最准：这跟函数传值、传引用是一个道理，第 58 课起外号那套规矩在这儿原样生效。` },
        { t: `p`, text: `源稿那个程序把两套路子摆在同一张纸上。base 按值带，add_base 收一个数、还你和 base 的和。counter 按引用带，bump 不收参数、身体里只有一句 counter++；喊它两次，main 里打印 counter 得 2 —— 真改了。这是入门到现在第一次看见 lambda 把外面的世界改动：第 57 课演示 3 那把喊两次也攒不出累积，因为每次用的都是同一份旧复印件。一句话分开这两门活儿：要留住出生那一刻的记性，用按值；要守一个会动的状态，用按引用。` },
        { t: `ul`, items: [
          `**怎么写**：[x] 复印件；[&x] 一根线；带好几个就逗号排开，也能 [&calls, &open] 这样逐个加 &。`,
          `**能不能改**：复印件只读，拿它做加减拼字符串随便，给它赋值就被拦；线那头的盒子是你的，写它写的是本人。`,
          `**看到的是几点钟的值**：复印件停在定义那一刻；线读到的永远是眼前这一瞬间的最新值。`,
          `**一把全带**：还有个 [&] 的写法，等于「外面谁我用谁，全按引用」。能跑，但读的人看不出你动了几个盒子，本课建议点名。`
        ]},
        { t: `svg`, caption: `同一个中括号的两种装法：按值带走一张照片，之后原件换衣服它也不管；按引用留一根线牵着，原件一动，这头立刻跟着动`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 286" font-family="sans-serif">
  <text x="20" y="24" font-size="14" font-weight="700" fill="#142639">包里放的是什么，决定这把工具能干什么活</text>
  <rect x="20" y="40" width="290" height="206" rx="10" fill="#eaf2fb" stroke="#00599c" stroke-width="2"/>
  <text x="165" y="62" font-size="13" font-weight="700" fill="#00599c" text-anchor="middle">[x]　按值：带走一张照片</text>
  <rect x="46" y="78" width="238" height="40" rx="6" fill="#ffffff" stroke="#8fa7c4" stroke-width="1.5"/>
  <text x="165" y="96" font-size="12" fill="#142639" text-anchor="middle">定义那一刻复印完就断了线</text>
  <text x="165" y="112" font-size="12" fill="#57677c" text-anchor="middle">原件后来怎么改，包里还是那份</text>
  <rect x="46" y="128" width="238" height="40" rx="6" fill="#ffffff" stroke="#8fa7c4" stroke-width="1.5"/>
  <text x="165" y="146" font-size="12" fill="#142639" text-anchor="middle">包里那份是只读的复印件</text>
  <text x="165" y="162" font-size="12" fill="#b8232f" text-anchor="middle">给它赋值 → 编译器当场拦</text>
  <rect x="46" y="178" width="238" height="48" rx="6" fill="#ffffff" stroke="#8fa7c4" stroke-width="1.5"/>
  <text x="165" y="196" font-size="12" fill="#142639" text-anchor="middle">适合干什么：留住记性</text>
  <text x="165" y="214" font-size="12" fill="#57677c" text-anchor="middle">算出来稳、可复现，不怕外面变</text>
  <rect x="330" y="40" width="290" height="206" rx="10" fill="#fdf0e6" stroke="#b8232f" stroke-width="2"/>
  <text x="475" y="62" font-size="13" font-weight="700" fill="#b8232f" text-anchor="middle">[&amp;x]　按引用：留一根线</text>
  <line x1="475" y1="118" x2="475" y2="150" stroke="#2e7d32" stroke-width="2.5"/>
  <polyline points="469,142 475,150 481,142" fill="none" stroke="#2e7d32" stroke-width="2.5"/>
  <rect x="356" y="78" width="238" height="40" rx="6" fill="#ffffff" stroke="#d8a98f" stroke-width="1.5"/>
  <text x="475" y="96" font-size="12" fill="#142639" text-anchor="middle">包里没有第二个盒子</text>
  <text x="475" y="112" font-size="12" fill="#57677c" text-anchor="middle">只有通向外面的那条路</text>
  <rect x="356" y="150" width="238" height="40" rx="6" fill="#ffffff" stroke="#d8a98f" stroke-width="1.5"/>
  <text x="475" y="168" font-size="12" fill="#142639" text-anchor="middle">赋值就是写原件，读就是读最新</text>
  <text x="475" y="184" font-size="12" fill="#2e7d32" text-anchor="middle">counter++ 攒得出 1、2、3</text>
  <rect x="356" y="196" width="238" height="40" rx="6" fill="#ffffff" stroke="#d8a98f" stroke-width="1.5"/>
  <text x="475" y="214" font-size="12" fill="#b8232f" text-anchor="middle">代价：那根线指着盒子还得活着</text>
  <text x="20" y="272" font-size="12" fill="#57677c">一句判断：这段逻辑要的是稳（留住那一刻），还是要跟着动（守一个状态）？</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `为什么默认给你的是复印件，而不是一根线？第 57 课那个理由在这儿照样成立：lambda 常常活得比那一行长 —— 被存进变量、被递出去、晚一点再喊，等它真跑起来，出生那一层的盒子可能已经散了。复印件永远安全；线则把风险攥在你手里。C++ 把不安全的那一档做成要你亲手加 & 才生效 —— 那一笔等于签字认领：我知道外面那个盒子归别人活着，我保证它还活着的时候才喊这把工具。` },
        { t: `p`, text: `还要认一个长相：同一个 & 号第三回露面了。第 58 课那句 int& alias = score; 里它属于类型，说的是外号；表达式里 &a 是问地址；中括号里 [&x] 这个 & 是「按引用带」的记号，紧挨着名字写。三处三份工，认法都一样 —— 看它站在哪儿。源稿那句「改它就是改变量本身」靠的正是第三种。` },
        { t: `h2`, text: `演示 1 · 源稿现场：一把复印，一把引线` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int base = 100;
    int counter = 0;
    auto add_base = [base](int x) { return base + x; };   // 复印 base
    std::println("add_base(5) = {}", add_base(5));

    auto bump = [&counter] { counter++; };                // 带原件进去
    bump();
    bump();
    std::println("counter = {}", counter);                // 2，真改了
    return 0;
}` },
        { t: `p`, text: `屏幕上是 add_base(5) = 105 和 counter = 2 两行。两把工具、两种带法摆在一起，正好是这一课的对照实验。注意 bump 的样子：中括号里一根线，参数表整个没有（上一课那句「参数表可以省」在这儿用上了），身体里就一句 counter++，连 return 都不要 —— 它的全部工作就是去动外面那个盒子。要是把 [&counter] 写成 [counter]，那两行 bump() 就白喊了：其实编译器当场拦你，本课任务就是去撞这一下。` },
        { t: `h2`, text: `演示 2 · 任务现场：把那个 & 抹掉` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int counter = 0;
    auto bump = [counter] { counter++; };   // 只改了中括号：改成复印件
    bump();
    std::println("counter = {}", counter);
    return 0;
}` },
        { t: `p`, text: `报错是这一课最该背下来的一句：cannot assign to variable 'counter' in lambda capture of type 'const int'，clang 还会补一句 captured by a copy。根因说透：按值带进来的那份是只读复印件，而 counter++ 是三步 —— 读出来、加一、写回去，最后那一步要把新值灌进包里那个盒子，那个盒子却被标成了 const。第 57 课你撞过同一堵墙，那时我们绕开它、在身体里另开一个盒子；这一课的解法是换装法：加回 &，包里不再是盒子而是通往原件的路，写它就是在写 counter 本人。` },
        { t: `p`, text: `顺带一句更阴的版本：把身体里那句换成 std::println("{}", counter)，不但不报错，还给你打一个 0 —— 复印件照读没问题，只是那个 0 停在定义那一刻。报错是仁慈，读到旧值才是难查的那种，这一组对照值得亲手改两回去跑。` },
        { t: `h2`, text: `演示 3 · 守一个会动的状态` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int calls = 0;
    bool open = true;
    auto log = [&calls, &open] {
        calls++;
        std::println("第 {} 次喊，门开着吗：{}", calls, open);
    };
    log();
    log();
    open = false;                            // 外面的原件动了
    log();
    return 0;
}` },
        { t: `p`, text: `三行输出：第 1 次喊、门开着吗 true；第 2 次 true；第 3 次 false。这一把同时牵着两根线，各演一遍独门本事。calls 那根是「攒」：包里没有第二个盒子，calls++ 写的就是外面那个 0，所以 1、2、3 数得起来 —— 第 57 课那种复印件做不到这件事。open 那根是「实时」：main 自己在中途把它改成 false，下一喊立刻读到新值 —— 按值那条路永远只给你出生那一刻的 true。一句提醒留着：带 & 的 lambda 别活得比它指的那些盒子久，本课它和 main 同生死，很安全；哪天你把它存久一点、递远一点，就得回头查一眼那些盒子还在不在。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `**复印件偏要写**：[counter] 配 counter++，得 cannot assign to variable 'counter' in lambda capture of type 'const int'。根因：按值带的那份只读；要么加 & 换按引用，要么在身体里另开一个盒子。`,
          `**以为复印件会自己更新**：不报错，纯算错。外面 base 已改成 200，包里还是那份 100，屏幕给你 101。根因：抄的时机就在定义那一行，不是喊它那一行。`,
          `**想给线换个本人**：[&x] 的身体里写 x = y;，你以为线挪到 y 上了 —— 其实那是把 y 的值灌进 x。第 58 课那句「引用身上的等号永远是给本人赋值」在这儿一字不改地成立。`,
          `**图省事一把 [&] 全带上**：能编过，但读的人看不出你动了外面几个盒子；哪天其中一个先没了，踩的是查半天的坑。本课的规矩：要谁写谁，带 & 的更要点名。`,
          `**变量声明在 lambda 后面**：int counter 写在那句 auto 之后，中括号里点名点不到，报错还是 use of undeclared identifier。先见后带，顺序不能反。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `1. 把 [&counter] 改成 [counter]，编译器会拦你——想想为什么`,
          `2. 延伸：把演示 3 那把 log 的中括号写成 [&]，一个名字都不点，跑一遍看输出是不是一样。再想想：读代码的人怎么知道你动了外面几个盒子？`,
          `3. 延伸：给演示 1 的 bump 加一个 int 参数，身体里写成 counter += x，喊它两次、每次递 3 进去，猜猜 counter 是几再跑。跑完用一句话说清：参数管现场递进来的新原料，中括号管留住的东西。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：中括号里加不加那个 &，决定包里是一张照片还是一根线 —— 照片留住出生那一刻、只能读；线能改原件、能追最新值，代价是它指着的那个盒子必须还活着。` }
      ]
    },
    {
      id: `c81`, title: `第 81 课 · lambda 配 sort：自定义排队规则`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把上一课那句「lambda 是个能被递出去的值」真用掉 —— 给第 65 课的 sort 派一个裁判：收两个元素、还一句谁该站前面，从此排队这件事你说了算。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 65 课你写过 std::sort 收 nums.begin() 和 nums.end() 那两截，一喊下去一串数就从小到大理得服服帖帖。默认规矩只有一个方向；想换排法 —— 从大到小、按名字长短、按谁更接近某个数 —— 就得把你那条规矩交出去。标准库留的口子是第三个参数：头尾之后还能再塞一个东西进去，那东西得「能被它喊」。上一课末尾那句话在这儿兑现 —— lambda 是个值，能拿在手里就能递给别人。这是入门阶段第一次真把一段行为交出去，让别人的代码来喊它。` },
        { t: `p`, text: `递过去的那把工具长相固定：两个参数、一个真假。sort 需要判断谁先谁后时，从串里挑两个元素递给你，参数 a 和 b 就是这两位；它读你那句 return —— 真 表示「a 该排在 b 前面」，假 表示「不，a 不该在 b 前面」。源稿那句 a > b 于是翻译成一行人话：a 比 b 大的时候 a 站前面，全场读下来就是从大到小。记住你的身份：你不是在给整串排名次，你是在回答 sort 提出的一次次两两比较。` },
        { t: `p`, text: `还有一件事必须提前说破：这把裁判会被喊很多次，而且不是把每一对都比一遍才交差 —— 挑哪两位来问、问多少回，都由 sort 决定。你能保证的只有一件事：答案自洽。所以规矩只能用 > 和 <，绝不能用 >= 或者 <=。a 和 b 一样大的时候，老实的回答是「a 不该排在 b 前面」（假）；写 a >= b 就会回答「该」。两位互相说该自己站前面，sort 的判断就乱套 —— 轻则顺序莫名其妙，重则当场崩掉。这条听着玄，它是本课最贵的一条，常见坑里再演一次。` },
        { t: `ul`, items: [
          `**参数三截**：头、尾、裁判。前两截第 65 课就会写了，这一课只多了第三截。`,
          `**裁判收的是元素，不是序号**：a 和 b 是串里那两个值本身，跟它们站第几格无关。`,
          `**真 的意思不是「a 更大」**：是「a 该排在 b 前面」。想降序就写 a > b，想升序就写 a < b，方向是被这句话定下来的。`,
          `**裁判改不动那个串**：递进去的是复印件，第 55 课那条天花板一字没变 —— 裁判只负责回答，不负责动手。`,
          `**排完是原地生效**：sort 改的就是 nums 自己，不用接返回值，喊完再看那个串。`
        ]},
        { t: `svg`, caption: `sort 每需要判断一次，就从串里挑两位递给裁判；裁判只回一句「a 该不该排在 b 前面」，串的最终顺序由这一次次回答拼出来`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif">
  <text x="20" y="22" font-size="14" font-weight="700" fill="#142639">一次排队：裁判在场边被反复喊</text>
  <rect x="20" y="38" width="250" height="66" rx="8" fill="#eaf2fb" stroke="#00599c" stroke-width="2"/>
  <text x="145" y="58" font-size="12" font-weight="700" fill="#00599c" text-anchor="middle">nums　5 2 8 1 9</text>
  <text x="145" y="78" font-size="12" fill="#142639" text-anchor="middle">sort 挑两位出来问一次</text>
  <text x="145" y="94" font-size="12" fill="#57677c" text-anchor="middle">问够了，串被原地重排</text>
  <rect x="300" y="38" width="150" height="66" rx="8" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="375" y="62" font-size="12" font-weight="700" fill="#2e7d32" text-anchor="middle">std::sort</text>
  <text x="375" y="84" font-size="12" fill="#142639" text-anchor="middle">管怎么排</text>
  <rect x="480" y="38" width="140" height="66" rx="8" fill="#fdf0e6" stroke="#b8232f" stroke-width="2"/>
  <text x="550" y="62" font-size="12" font-weight="700" fill="#b8232f" text-anchor="middle">裁判：lambda</text>
  <text x="550" y="84" font-size="12" fill="#142639" text-anchor="middle">管按什么排</text>
  <line x1="300" y1="71" x2="272" y2="71" stroke="#57677c" stroke-width="2"/>
  <polyline points="280,65 272,71 280,77" fill="none" stroke="#57677c" stroke-width="2"/>
  <line x1="480" y1="71" x2="452" y2="71" stroke="#b8232f" stroke-width="2"/>
  <polyline points="460,65 452,71 460,77" fill="none" stroke="#b8232f" stroke-width="2"/>
  <text x="20" y="130" font-size="13" font-weight="700" fill="#142639">裁判桌上的三张问答（规矩写的是 a &gt; b）</text>
  <line x1="20" y1="140" x2="620" y2="140" stroke="#c3ccd8" stroke-width="1.5"/>
  <text x="30" y="162" font-size="12" fill="#142639">问：5 和 9，5 该排在 9 前面吗？</text>
  <text x="330" y="162" font-size="12" font-weight="700" fill="#b8232f">5 &gt; 9 是假 → 不该，9 走前面</text>
  <text x="30" y="188" font-size="12" fill="#142639">问：9 和 5，9 该排在 5 前面吗？</text>
  <text x="330" y="188" font-size="12" font-weight="700" fill="#2e7d32">9 &gt; 5 是真 → 该，9 站前面</text>
  <text x="30" y="214" font-size="12" fill="#142639">问：8 和 8，谁该在前面？</text>
  <text x="330" y="214" font-size="12" font-weight="700" fill="#57677c">8 &gt; 8 是假 → 平手，谁也不插队</text>
  <rect x="20" y="232" width="600" height="44" rx="8" fill="#f4f7fc" stroke="#c3ccd8" stroke-width="1.5"/>
  <text x="34" y="252" font-size="12" fill="#142639">排完：nums 变成 9 8 5 2 1 —— 从大到小。</text>
  <text x="34" y="268" font-size="12" fill="#b8232f">要是规矩写成 a &gt;= b，平手那次会答「该」，两次互相插队，sort 就散了。</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `为什么把「规矩」做成一个参数？因为 sort 只该管怎么排，不该管按什么排。比较这一步一交出去，一个算法就服务了无数种需求，标准库里一大半能收行为的函数都是这个套路。C++ 能让这件事写成一行、就地捏、就地递，靠的正是上一课那半步 —— 行为是个值，可以出现在任何需要值的地方，包括函数参数的第三个格子里。` },
        { t: `p`, text: `第三截那张口子开得极宽：任何「收两个元素、还一个真假」的东西都塞得进去，有名函数也行，现场捏的 lambda 也行。选 lambda 的理由很实在 —— 这条排队规矩通常只在这一处要用，写完就丢，不值得为它起一个名字、放到所有函数外面去。要按什么排的门槛写在你手里，怎么排的聪明办法写在标准库里，两边各管一半。` },
        { t: `h2`, text: `演示 1 · 源稿现场：给 sort 派一个降序裁判` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <algorithm>
int main() {
    std::vector<int> nums = {5, 2, 8, 1, 9};
    std::sort(nums.begin(), nums.end(), [](int a, int b) {
        return a > b;        // a 比 b 大 → a 站前面：从大到小
    });
    std::println("{}", nums);
    return 0;
}` },
        { t: `p`, text: `屏幕上打出 [9, 8, 5, 2, 1] —— 一串数倒着排好了。三件事同时在这儿：头尾两截照第 65 课那么写；第三截那把 lambda 就写在调用现场，连名字都没起（这叫「写完立刻递」，上一课演示里见过一次）；身体里一句 return a > b，整条规矩就交代完了。要多说一句那个花括号后的收尾：它是那条 lambda 声明的尾巴，逗号跟着补上，整个 sort 调用才算写完。` },
        { t: `h2`, text: `演示 2 · 任务现场：把大于号换成小于号` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <algorithm>
int main() {
    std::vector<int> nums = {5, 2, 8, 1, 9};
    std::sort(nums.begin(), nums.end(), [](int a, int b) {
        return a < b;        // 任务：把 > 改成 <
    });
    std::println("派裁判：{}", nums);
    std::sort(nums.begin(), nums.end());
    std::println("不派裁判：{}", nums);   // 默认也是从小到大
    return 0;
}` },
        { t: `p`, text: `两行输出一模一样，都是 [1, 2, 5, 8, 9]。这就是这一课最该有的成就感：a < b 说的是「a 比 b 小就让它站前面」，串于是从前往后长上去 —— 而第 65 课那个只给头尾的 sort 走的正是这条路，默认规矩本来就是 a < b。第三截不是魔法开关，它只是把你原先要问「能不能改成那样」的事，改成你自己写一句话。建议你再加一个版本：身体写成 return false; —— 逢问就答「谁也不比谁前」，串原样不动，这一步能把「方向是被返回值定的」钉死。` },
        { t: `h2`, text: `演示 3 · 规矩可以有两层：先短后长` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <vector>
#include <algorithm>
int main() {
    std::vector<std::string> names = {"li", "wang", "zhao", "qian"};
    std::sort(names.begin(), names.end(),
        [](const std::string& a, const std::string& b) {
            if (a.size() != b.size()) return a.size() < b.size();
            return a < b;                  // 一样长，按字面比
        });
    for (const auto& s : names) std::println("{}", s);
    return 0;
}` },
        { t: `p`, text: `四行输出：li、qian、wang、zhao —— 短的在前，三个四个字的按字面先后跟上。这把裁判分两次回答：先比长度，长度不等就据此定先后；相等再拿文字本身比。规矩复杂到需要好几层，都是这个写法 —— 一层一条 return，从前往后挡，跟第 55 课那个 grade_of 一个套路。顺带回收第 61 课那句：参数写成 const std::string&，一整串文字不抄第二份，裁判被喊那么多次，省下的全是白抄的工夫。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `**规矩写成 >= 或 <=**：最阴的一条。可能一句错都不报，跑出的顺序乱七八糟；运气不好当场崩在 sort 里面，报错里带着 operator 和 strictly weak ordering 那类词。根因：平手那次你答了「该站前面」，两边互相插队，sort 的前提被破坏。平手永远答假。`,
          `**裁判只收一个参数**：写成 [](int a) { return a > 3; }，得 no matching function for call to 'sort'。根因：第三截要的是能收两个元素的东西，它每次问的是「这两位谁在前」，不是「这一位合不合格」。`,
          `**忘了头尾两截**：只写 std::sort(nums, 那把 lambda) 或者写成 sort(nums)，同样是 no matching function for call to 'sort'。这个算法要的是范围，从 begin 到 end，一个都不能少。`,
          `**忘了请 algorithm 这个头文件**：报错和上一条长得一样，很容易被误导去改 lambda。先检查有没有 include 那三个尖括号。`,
          `**在裁判里给 a 赋值**：想顺手把元素改掉，报 assignment to operator parameter 'a' is deprecated 之类的警告，而且改了也没用 —— 递进去的是复印件。裁判只回答，不动手。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `1. 把 a > b 改成 a < b，运行看顺序变成什么样`,
          `2. 延伸：把身体改成 return false; 再跑一次，看看顺序动没动。用一句话说清：裁判答假的时候，sort 是怎么理解这两位的？`,
          `3. 延伸：换成 std::vector<std::string> 装四个名字，按长度从长到短排（提示：先比长度，长度一样再按字面）。写完顺手把第 65 课那版只给头尾的 sort 跑一遍，两个版本对照着说说：第三截到底改了哪一件事。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：sort 管怎么排，你写的 lambda 管按什么排 —— 收两个元素、还一句「该不该站前面」，平手答假，方向由那句 return 定，入门这段路正好在这儿收了个尾。` }
      ]
    }
  ]
};
