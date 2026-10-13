/* 喵站 · C++ 入门 正文分部 p12：第 51–54 课（第九轮 · 自己写函数）
 *
 * 源稿：学习资料/C++入门/51_第一个函数 ~ 54_返回bool的函数。
 * 款式照 p06 / p01 样板：tip(蓝·本课目标) → 原理讲解 → 它被设计成什么样 → 演示 N → 常见坑 → 任务 → tip(绿·本课一句话)
 *
 * 闸线备忘（本分部必须守住的）：
 *   自定义函数定义教在 51，参数与返回值教在 52–53，返回 bool 的函数教在 54；
 *   一律不出现 lambda（56）、引用参数（60）、默认参数（68）、函数重载（69）、递归（71），
 *   也不提前用「函数里调用另一个自己写的函数」（那是 55 课）。
 *   正文（h2 / p / tip / ul）不带圆括号：函数名裸写，参数说明改用中文括号。
 *   交叉引用只往回指，第 N 课的 N 一律小于本课课号。
 *
 * 验收：node dev/tools/cpp-audit.cjs --part dev/frontend/assets/data/cpp/p12.js
 *       node dev/tools/cpp-exam-check.cjs --only c51,c52,c53,c54
 */
window.MIAO_CPP_P12 = {
  chapters: [
    {
      id: `c51`, title: `第 51 课 · 第一个函数：给一段代码起个名字`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会用 void 定义一个不带参数、不交回值的函数，分清「定义只是备案」和「写名字加括号才叫调用」，并且第一次看清执行流从 main 跳出去、办完再跳回来的那条线。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `到上一课为止，你的代码都住在 int main 那一对花括号里：从第一行走到底，程序就结束。这种写法有个躲不掉的麻烦 —— **重复**。想把「检查分数是否合法」这段逻辑在三个地方都用一遍，只能抄三遍；将来及格线从 60 挪到 65，你得记全三个位置，漏改一处，程序的两半就开始互相矛盾。` },
        { t: `p`, text: `函数解决的就是这件事：**给一段代码起个名字，想用几次喊几次**。源稿的比方很准 —— 值日表。打扫步骤只写在表上一次，谁值日照着走一遍；表自己不会动，必须有人走上前执行。写下 **void say_hello** 那一段是做一张表贴在墙上，在别处写「名字加一对括号」才是那个走上前来的人。` },
        { t: `p`, text: `所以「函数」这两个字其实包着两件完全不同的事，入门阶段九成晕头都出自把它们揉在一起：` },
        { t: `ul`, items: [
          `**定义**：最前面写返回类型，接着写名字、一对圆括号，最后一对花括号圈出要重复做的事。定义站在别的函数外面，它只负责把名字和代码**登记在册**。`,
          `**调用**：在需要它的地方写「名字 + 一对圆括号」，末尾加分号。只有走到这一行，程序才真的跳进花括号里一行行执行。`,
          `**次数**：定义一次，调用可以零次、一次、一万次。一次都没被喊过的函数安静地躺在程序里，屏幕上不会多出一个字。`,
          `**你早就在用它**：int main 不是什么特殊咒语，它就是**由系统帮你调用的那个函数** —— 程序一启动就跳进 main 的花括号第一行，走到 return 0 就交差离场。所谓「主程序」，只是第一个被喊的名字。`
        ]},
        { t: `svg`, caption: `一次调用的完整来回：从 main 那一行跳进函数，花括号走完，沿来路回到调用行的下一行`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 276">
  <text x="16" y="24" font-size="14" font-weight="700" fill="#142639">定义 = 把值日表贴在墙上；调用 = 有人照着做一遍</text>
  <rect x="16" y="40" width="300" height="84" rx="10" fill="#f4f7fc" stroke="#57677c" stroke-width="1.5"/>
  <text x="166" y="62" font-size="13" font-weight="700" fill="#57677c" text-anchor="middle">定义区：备案，不执行</text>
  <text x="166" y="86" font-size="13" fill="#142639" text-anchor="middle">void say_hello</text>
  <text x="166" y="108" font-size="12" fill="#57677c" text-anchor="middle">打印一句「你好，欢迎学 C++！」</text>
  <rect x="360" y="40" width="304" height="84" rx="10" fill="#fff6e0" stroke="#a26a00" stroke-width="1.5"/>
  <text x="512" y="62" font-size="13" font-weight="700" fill="#a26a00" text-anchor="middle">编译器从上往下读</text>
  <text x="512" y="86" font-size="12" fill="#142639" text-anchor="middle">先登记名字，再往下看见 main</text>
  <text x="512" y="108" font-size="12" fill="#142639" text-anchor="middle">没登记过就调用 → 当场报错</text>
  <text x="16" y="152" font-size="13" font-weight="700" fill="#00599c">main 的执行轨道：一行接一行，顺序从不乱跳</text>
  <rect x="16" y="164" width="150" height="44" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
  <text x="91" y="182" font-size="12" fill="#57677c" text-anchor="middle">第 1 行</text>
  <text x="91" y="200" font-size="12" font-weight="700" fill="#142639" text-anchor="middle">say_hello 加括号</text>
  <rect x="182" y="164" width="150" height="44" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
  <text x="257" y="182" font-size="12" fill="#57677c" text-anchor="middle">第 2 行</text>
  <text x="257" y="200" font-size="12" font-weight="700" fill="#142639" text-anchor="middle">say_hello 加括号</text>
  <rect x="348" y="164" width="150" height="44" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
  <text x="423" y="182" font-size="12" fill="#57677c" text-anchor="middle">第 3 行</text>
  <text x="423" y="200" font-size="12" font-weight="700" fill="#142639" text-anchor="middle">return 0</text>
  <rect x="510" y="164" width="154" height="44" rx="8" fill="#e6f6ea" stroke="#1f7a3d" stroke-width="2"/>
  <text x="587" y="182" font-size="12" fill="#1f7a3d" text-anchor="middle">屏幕上两行</text>
  <text x="587" y="200" font-size="12" font-weight="700" fill="#142639" text-anchor="middle">内容一模一样</text>
  <path d="M91 164 V130" stroke="#00599c" stroke-width="2.5"/>
  <polygon points="91,124 86,134 96,134" fill="#00599c"/>
  <text x="98" y="146" font-size="12" font-weight="700" fill="#00599c">调用：跳进去</text>
  <path d="M200 124 V146 H257 V156" stroke="#1f7a3d" stroke-width="2.5" fill="none"/>
  <polygon points="257,164 252,154 262,154" fill="#1f7a3d"/>
  <text x="268" y="146" font-size="12" font-weight="700" fill="#1f7a3d">办完：回到下一行</text>
  <path d="M332 186 H344" stroke="#57677c" stroke-width="2"/>
  <polygon points="348,186 338,181 338,191" fill="#57677c"/>
  <text x="16" y="236" font-size="12" fill="#57677c">花括号里的内容从头走到尾，右花括号就是「交差走人」的那一步。</text>
  <text x="16" y="258" font-size="12" fill="#57677c">函数不会打乱 main 的顺序：喊两次就执行两次，顺序和书写顺序完全一致。</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `先说最前面那个 **void**。定义函数时，第一个位置留给「返回类型」，说明它办完事交回什么东西。本课的函数谁都不交：打印一句话，说完就完，那个位置就写 **void**，读作「无返回」。它不是装饰 —— C++ 要求每个定义都先亮出返回类型，空着不写编译器当场拦你。交回一个数、交回一个真假值长什么样，是下一课和再下一课的正题。` },
        { t: `p`, text: `再说**为什么定义必须写在调用它之前**。编译器从上往下一路读下来，读到 main 里那句调用时，必须已经见过这个名字 —— 否则它没法回答「有这么个函数吗、要几个输入」。没登记就调用，你会拿到入门期最常见的一条报错：say_hello was not declared in this scope。所以本阶段的纪律只有一条：**所有定义放在 main 上面**。` },
        { t: `p`, text: `第三件是**执行流**：程序现在正站在哪一行。函数加了一个新动作 —— 从调用那一行**跳出去**，进入被调函数的花括号，从第一行走到最后一行，撞到右花括号就**沿来路回到调用行的下一行**。这一跳一回是原子的：函数没跑完，main 后面那行绝不偷跑，所以连写三句调用就是三遍同样的内容。` },
        { t: `p`, text: `最后一条处处要用：**函数体是一个新的小世界**。main 里声明的变量，函数里看不见；函数体里的变量，一出花括号就烟消云散，下次调用是全新的一份。这和前面讲变量那条「花括号圈出名字的活动范围」是同一件事，只是今天第一次有了代价：函数想拿到 main 手里的数据，光靠名字够不着，得从**参数**那扇窗递进去。` },
        { t: `h2`, text: `演示 1 · 定义一次，调用两次` },
        { t: `code`, lang: `c++`, code: `#include <print>

void say_hello() {                       // 定义：备案，不执行
    std::println("你好，欢迎学 C++！");
}

int main() {
    say_hello();                         // 调用：这时才真正执行
    say_hello();                         // 想喊几次喊几次

    return 0;
}` },
        { t: `p`, text: `跑出来是两行一模一样的「你好，欢迎学 C++！」。请盯住这个反差：**代码里只写了一句打印，屏幕上却有两行** —— 第二行不是定义自己跑了，而是第二次调用又把函数体从头执行了一遍。值日表只贴了一张，值日的人来了两趟。顺带看清骨架：头文件属于整个文件，不属于某个函数，say_hello 里用了 std::println，文件开头就得请进 print。` },
        { t: `h2`, text: `演示 2 · 换调用顺序，就是换输出顺序` },
        { t: `code`, lang: `c++`, code: `#include <print>

void say_hello() {
    std::println("你好");
}
void say_goodbye() {                      // 又一张值日表
    std::println("下次再聊");
}
int main() {
    say_hello();
    say_goodbye();                        // 先 hello 后 goodbye
    say_hello();                          // 同一张表还能再喊一次
    return 0;
}` },
        { t: `p`, text: `输出三行：你好、下次再聊、你好。两个函数各守自己的花括号，互不打扰；谁被喊、什么时候被喊，全由 main 那一列说了算。这条「**调用顺序等于执行顺序**」是以后所有多函数程序的调试起点：结果不对，先按顺序把自己喊过的名字念一遍。它也正是任务 1 的成品形态。` },
        { t: `h2`, text: `演示 3 · 只写名字不写括号：它安静地不干活` },
        { t: `code`, lang: `c++`, code: `#include <print>

void say_hello() {
    std::println("你好");
}

int main() {
    say_hello;              // ← 少了括号：这不是调用，只是提了一下名字
    say_hello();            // 这才是调用
    return 0;
}` },
        { t: `p`, text: `屏幕上只有一行「你好」。第一句没出声，而且它**不报错** —— 编译器最多甩一句警告，大意是「这个表达式的值没人用」。根因在这儿：say_hello 这个名字本身就代表那个函数，光写出来只是**引用**了它；**那对空括号才是「现在执行它」的指令**，哪怕不需要任何输入也必须写。它的讨厌之处就在症状：正常编译、正常运行、就是少输出，而少掉的偏偏是你最想要那段。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `只定义、没调用。长相：程序正常退出、屏幕一片空白，你以为打印那句写错了。根因：定义只是备案，永远不会自己执行。`,
          `把定义写在 main 下面。长相：编译红字 say_hello was not declared in this scope，箭头指着 main 里那句调用。修法：整个定义挪到 main 上面。`,
          `返回类型漏写，开头只有名字加括号和花括号。编译器报的是「函数声明缺返回类型」那一类。每个定义最前面必须站一个类型，什么都不交就写 void。`,
          `函数体里直接用 main 的变量。长相还是 was not declared in this scope，但箭头指在你函数里面那行，很容易看糊涂：变量明明声明了呀。根因是作用域，想递东西进来要用参数，下一课。`,
          `花括号少配一对，第二个函数的定义被关在第一个函数肚子里。长相：a function definition is not allowed here，或者末尾冒出 expected '}' at end of input。C++ 不允许在函数里定义函数。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `再写一个 say_goodbye，在 main 里先 hello 后 goodbye`,
          `把 say_hello 改成输出三行自我介绍`,
          `延伸：把自我介绍函数连喊三次，数一数 —— 让它多说一句话你改了几行；不用函数、把三行抄三遍你要改几处`,
          `延伸：把 main 里某一次调用的括号删掉只写 say_hello，先猜屏幕出几行再编译运行，看一眼那句警告`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：函数就是一张值日表 —— 定义只是把它贴在墙上，只有「名字加一对括号」才是有人照着做一遍；定义写在 main 上面，不交东西也要把返回类型写成 void。` }
      ]
    },
    {
      id: `c52`, title: `第 52 课 · 带参数的函数：给函数开一个进料口`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会在定义时声明参数、在调用时按位置把值递进去，分清形参与实参，并牢牢记住一件事 —— 递进去的是复印件，不是原件。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课的函数有个限制：它谁都不理。不问输入、不交输出，只会把同一段动作原地重复。可你想要的是「对不同的人说不同的话」—— 函数必须能从外面拿到材料。第 51 课那句「函数体是个小世界」的代价，今天由**参数**来赎：定义时在名字后面那对括号里留一个空位，调用时把值塞进去。` },
        { t: `p`, text: `源稿的说法最形象：参数是函数的**进料口**。写 **void greet（std::string name）** 的时候，name 就是那个空位，而且它带着类型 —— 等于在机器上贴了张「只收 string 规格的材料」。调用 greet（递进「小明」）那一刻，程序做的事非常朴素：**造一个叫 name 的 std::string，把「小明」装进去**，然后才开始执行花括号。所以参数在函数眼里就是一个普通的局部变量，只不过它的初值由外面递进来。` },
        { t: `ul`, items: [
          `**定义里写的叫形参**：greet 括号里的 name 是个空位，此刻还没有值，它的活儿是把材料接住、并在函数内部给它一个名字。`,
          `**调用里写的叫实参**：真正递进去的那个值 —— 可以是一个字面量，也可以是一个变量。`,
          `**数量和顺序必须对齐**：几个进料口就倒几份料，不多不少；而且靠**位置**认领，不靠名字 —— 第二个值进第二个空位。`,
          `**类型也必须对上**：空位标了 std::string，就不能往里倒一个 int。这一条编译器提前替你拦，报错长相是「不能把 int 转成 std::string」那类。`
        ]},
        { t: `svg`, caption: `进料口只有一个，三个调用递进三种料：每次调用都新造一个 name，把值复印进去`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 250">
  <text x="16" y="24" font-size="14" font-weight="700" fill="#142639">同一段代码，喂不同的料，出不同的活</text>
  <rect x="16" y="42" width="196" height="36" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
  <text x="114" y="66" font-size="13" fill="#142639" text-anchor="middle">greet 递「小明」</text>
  <rect x="16" y="92" width="196" height="36" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
  <text x="114" y="116" font-size="13" fill="#142639" text-anchor="middle">greet 递「小强」</text>
  <rect x="16" y="142" width="196" height="36" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
  <text x="114" y="166" font-size="13" fill="#142639" text-anchor="middle">greet 递 your_name</text>
  <text x="16" y="196" font-size="12" fill="#57677c">your_name 里装着「同学」</text>
  <path d="M212 60 H262 V110 H300" stroke="#57677c" stroke-width="2" fill="none"/>
  <polygon points="306,110 296,105 296,115" fill="#57677c"/>
  <path d="M212 110 H300" stroke="#57677c" stroke-width="2"/>
  <polygon points="306,110 296,105 296,115" fill="#57677c"/>
  <path d="M212 160 H262 V110 H300" stroke="#57677c" stroke-width="2" fill="none"/>
  <polygon points="306,110 296,105 296,115" fill="#57677c"/>
  <path d="M330 92 L392 92 L366 132 L356 132 Z" fill="#fff6e0" stroke="#a26a00" stroke-width="2"/>
  <text x="366" y="86" font-size="12" font-weight="700" fill="#a26a00" text-anchor="middle">进料口</text>
  <rect x="400" y="72" width="264" height="86" rx="10" fill="#f4f7fc" stroke="#57677c" stroke-width="1.5"/>
  <text x="532" y="94" font-size="13" font-weight="700" fill="#57677c" text-anchor="middle">每次调用新造一个 name</text>
  <text x="532" y="116" font-size="13" fill="#142639" text-anchor="middle">std::string name = 「这一次的料」</text>
  <text x="532" y="138" font-size="12" fill="#57677c" text-anchor="middle">函数体里只管用它，不管它是谁</text>
  <path d="M532 158 V186" stroke="#1f7a3d" stroke-width="2.5"/>
  <polygon points="532,194 527,184 537,184" fill="#1f7a3d"/>
  <rect x="380" y="196" width="284" height="40" rx="10" fill="#e6f6ea" stroke="#1f7a3d" stroke-width="2"/>
  <text x="522" y="222" font-size="13" fill="#142639" text-anchor="middle">你好，这一位！今天也要加油哦</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `先回答**为什么参数要写类型**。函数内部要把 name 当字符串用，那它就得真是一个 std::string 变量，而不是什么都能塞的黑洞。声明类型一次换来两样东西：调用点上编译器替你核对规格，递错了当场红字；函数体里 name 的那些功能（第 13 课那种点号后面跟名字的成员调用）才全都使得出。` },
        { t: `p`, text: `再回答**多个参数怎么排**。它们写在同一对括号里、逗号隔开，比如 void introduce（std::string name、int age）。调用时按位置对号：introduce（「王小明」、18）里，第一个空位收到「王小明」，第二个空位收到 18。C++ 不看你的变量声明顺序、也不看名字像不像，它只按位置数。这条规矩的代价很实在：**两个类型相同的参数写反，编译器一个字都不会说** —— 那是纯人祸，只能靠读调用点自查。` },
        { t: `p`, text: `最关键的是**复印件**这条设计选择。调用时程序把实参的值**复制**一份交给形参，函数此后只碰这份副本：函数里给 name 换内容、给 age 加一岁，调用者手上那个变量纹丝不动。好处是可以放心在任何地方喊它，不必担心它顺手把桌子搬走；代价是「想让函数替我改一个变量」得走别的路。想让函数把算出来的东西交回来，用的是**返回值**，下一课正好讲这个。` },
        { t: `code`, lang: `text`, code: `调用 greet(your_name) 的那一瞬间：
    main 里的 your_name    →  "同学"     原件留在原地，谁也拿不走
    函数里的 name          →  "同学"     新造的一份副本
    函数里把 name 改成别的 →  your_name 依然是「同学」` },
        { t: `p`, text: `还有个时间问题：进料口只在**这一次调用**期间存在。函数一交差副本就被销毁，下次调用重新造一份 —— 它记不住你上一回喂了什么，每一次都是白纸。` },
        { t: `h2`, text: `演示 1 · 一个进料口，喂三种料` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
void greet(std::string name) {                // 进料口：一个 std::string
    std::println("你好，{}！今天也要加油哦", name);
}
int main() {
    greet("小明");                            // 递「小明」进去
    greet("小强");                            // 同一个函数，换一份料

    std::string your_name = "同学";
    greet(your_name);                         // 变量也能递
    return 0;
}` },
        { t: `p`, text: `输出三行，只有名字那一格在换。三句调用的差别只在递进去的东西：前两句写的是字面量，第三句递的是一个 std::string 变量 —— 在编译器眼里这两件事完全等价，**它只看值的类型合不合规格，不看这个值是你现写的还是从变量里取的**。这就是「同一个函数，喂不同的料，出不同的活」。` },
        { t: `h2`, text: `演示 2 · 两个进料口，按位置对号` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>

void introduce(std::string name, int age) {
    std::println("我叫{}，今年{}岁", name, age);
}

int main() {
    introduce("王小明", 18);
    int years = 20;
    introduce("李华", years);
    return 0;
}` },
        { t: `p`, text: `输出「我叫王小明，今年18岁」「我叫李华，今年20岁」。第一份料进 name、第二份进 age，位置说了算。你把 introduce（18、「王小明」）这么写就会红字，因为规格对不上；但如果两个空位都是 std::string，你怎么换顺序它都笑着跑完 —— 记住这条差别。` },
        { t: `h2`, text: `演示 3 · 任务 1 的形状：print_stars（int n）` },
        { t: `code`, lang: `c++`, code: `#include <print>

void print_stars(int n) {              // 一个 int 进料口
    for (int i = 0; i < n; i++) {      // 第 35 课的 for：数着走 n 步
        std::print("*");               // print 不换行，星号才排成一串
    }
    std::println();                    // 数完了补一个换行
}

int main() {
    print_stars(3);
    print_stars(8);
    return 0;
}` },
        { t: `p`, text: `输出两行：三个星号、八个星号。留意 n 只是**这一次**递进来的料 —— 喊 3 它数三步，喊 8 它数八步，函数体一个字没改。参数换来的正是这件事：连「做几次」这种数字都能现场递进去，函数于是从「复读机」升级成「按你给的数办事的机器」。` },
        { t: `p`, text: `顺便一提分工：std::print 打一个星号不换行，循环结束后再用 std::println 收尾。要是循环里直接用 println，n 个星号就散成 n 行 —— 第 26 课那对搭档在函数里照样好使。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `定义了参数、调用时忘了递。长相：编译红字说参数太少，箭头指着那句调用。根因：形参不是可选项，几个空位就必须递几份料。`,
          `递错规格。长相：cannot convert 一类，报错里会把你递的 int 和它想要的 std::string 并列写出来。改调用，或者把空位的类型改成你要的那种。`,
          `两个同类型参数顺序写反。长相：不报错、不警告，输出里两样内容互换位置。编译器只按位置认领，它不知道哪个位置「应该」放名字。`,
          `想替调用者改变量。函数里老老实实写了 age = age + 1，出来还是原值。根因：值传递只给复印件。要改结果就用返回值把新数交回去，那是下一课。`,
          `参数是 std::string 却忘了请头文件。长相：报错说 string 不是 std 里的成员，而且位置常常落在函数定义那一行，看着莫名其妙。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `写 void print_stars(int n)，打印 n 个 *`,
          `写 void print_age(int age)，输出「我 X 岁了」`,
          `延伸：给 print_stars 再加一个进料口，改成 void print_chars（char ch、int n），打 n 个你指定的字符；先想清哪个位置放字符、哪个放次数`,
          `延伸：写 void greet_times（std::string name、int times），用第 35 课的 for 把那句你好打印 times 遍；再分别喂 0、1、5，看看 times 是 0 时屏幕上该出现什么`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：参数是进料口 —— 定义时留空位并写明类型，调用时按位置把值复印一份递进去；函数里改的是复印件，改不动你手上的原件。` }
      ]
    },
    {
      id: `c53`, title: `第 53 课 · 返回值：函数把算好的作业交回来`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：给函数开第二个口 —— 进料口之外还有出料口。看懂 return 干的三件事：算出值、把值递回调用处、当场结束函数。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课解决了材料怎么进去，这一课解决结果怎么出来。**参数是进料口，返回值是出料口**。看签名 **int add（int a、int b）**：最前面那个 int 是一份承诺 —— 办完事交回一个 int；函数体里 **return a + b** 才是交货的动作。void 于是有了对照物：它说的是「谁都不交」，你去写「int x = say_hello（）」这种句子，编译器立刻拦下，大意是 void 表达式不能当一个值用。` },
        { t: `p`, text: `要用上返回值，得先完成一次心智转换：**调用处那一整串，从值上看就等于交回来的那个数**。add（3、5）出现在哪，8 就出现在哪 —— 能赋给变量、能塞进 std::println 的占位符、能跟别的数继续相加。源稿那句 int total = add（3、5）+ add（10、20）就是这么读的：先各自算出 8 和 30，相加得 38，再装进 total。` },
        { t: `ul`, items: [
          `**开头那个位置是返回类型**：int、bool、std::string 都能写；什么都不交就写 void。它写在名字前面，一眼就看见。`,
          `**return 带一个值**：它的类型要和开头的承诺对得上（或能安全转成那个类型），对不上编译器就红字。`,
          `**return 一执行，函数立刻收工**：它后面哪怕还写着语句，也永远轮不到执行；函数体里的花括号于是有了两个出口 —— return 和右花括号。`,
          `**调用处拿到的是一个值**，不是一段「已经跑完的过程」。值可以被存起来、被打印、被继续运算 —— 这是函数能当积木用的全部理由。`
        ]},
        { t: `svg`, caption: `投进两份料，机器内部算一遍，出料口掉出一个值：调用处接住的就是这个值`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 264">
  <text x="16" y="24" font-size="14" font-weight="700" fill="#142639">int add 是一台机器：进料口收 a 和 b，出料口交回一个 int</text>
  <rect x="200" y="40" width="270" height="160" rx="14" fill="#f4f7fc" stroke="#57677c" stroke-width="2"/>
  <text x="335" y="64" font-size="13" font-weight="700" fill="#57677c" text-anchor="middle">int add（int a、int b）</text>
  <rect x="226" y="80" width="218" height="44" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
  <text x="335" y="98" font-size="12" fill="#142639" text-anchor="middle">机器内部：a + b</text>
  <text x="335" y="116" font-size="12" font-weight="700" fill="#00599c" text-anchor="middle">3 + 5 = 8</text>
  <rect x="252" y="140" width="166" height="34" rx="8" fill="#fff6e0" stroke="#a26a00" stroke-width="2"/>
  <text x="335" y="162" font-size="12" font-weight="700" fill="#a26a00" text-anchor="middle">return a + b；交货并收工</text>
  <rect x="16" y="80" width="120" height="34" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
  <text x="76" y="102" font-size="12" fill="#142639" text-anchor="middle">实参 3 → a</text>
  <rect x="16" y="126" width="120" height="34" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
  <text x="76" y="148" font-size="12" fill="#142639" text-anchor="middle">实参 5 → b</text>
  <path d="M136 97 H188 V100 H196" stroke="#00599c" stroke-width="2"/>
  <polygon points="200,100 190,95 190,105" fill="#00599c"/>
  <path d="M136 143 H188 V130 H196" stroke="#00599c" stroke-width="2"/>
  <polygon points="200,130 190,125 190,135" fill="#00599c"/>
  <path d="M335 200 V222" stroke="#1f7a3d" stroke-width="2.5"/>
  <polygon points="335,230 330,220 340,220" fill="#1f7a3d"/>
  <rect x="290" y="232" width="90" height="28" rx="8" fill="#e6f6ea" stroke="#1f7a3d" stroke-width="2"/>
  <text x="335" y="251" font-size="13" font-weight="700" fill="#1f7a3d" text-anchor="middle">8</text>
  <text x="410" y="251" font-size="12" fill="#57677c">← 调用处 add（3、5）整个就变成 8</text>
  <path d="M380 246 H520 V224" stroke="#1f7a3d" stroke-width="2" fill="none" stroke-dasharray="6 4"/>
  <polygon points="520,218 515,228 525,228" fill="#1f7a3d"/>
  <rect x="440" y="150" width="224" height="66" rx="10" fill="#f4f7fc" stroke="#57677c" stroke-width="1.5"/>
  <text x="552" y="172" font-size="12" font-weight="700" fill="#57677c" text-anchor="middle">你可以拿这个 8 做三件事</text>
  <text x="552" y="192" font-size="12" fill="#142639" text-anchor="middle">存进变量 · 塞进打印 · 继续运算</text>
  <text x="552" y="210" font-size="12" fill="#142639" text-anchor="middle">add（3、5）+ add（10、20）= 38</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `先解释那条最让人意外的规矩：**return 一执行，函数当场结束**。为什么不许「交完货再把剩下的事做完」？因为一个函数承诺交回**一个**值 —— 语言必须保证交货这个动作是明确的终点，不能出现「交了两次、后一次覆盖前一次」这种含糊。这条规矩顺手给了你一个极好用的写法：碰到不该继续的情况，**当场 return 走人**，把正常路径留在最外层，缩进就不用一层层往里钻。` },
        { t: `p`, text: `于是产生一条本课最重要的纪律：**每条路径都得交货**。函数开头写了 int，就意味着「无论走哪条岔路，最后都必须交回一个 int」。如果某条路走到右花括号还没 return，编译器会警告你一句「非 void 函数没有返回语句」，而这句警告**绝不能忽略**：那种情况下调用处拿到的是一个没人负责的垃圾值，同一个程序今天打 3、明天打一堆乱码，是最难查的病。` },
        { t: `p`, text: `再看关键字本身：你其实天天在写它 —— main 末尾那个 return 0 就是 main 向系统交差，「我正常跑完了」。今天只是把同一个关键字用在自己的函数上，交的东西从 0 换成算出来的结果。含义没变，变的只是交给谁。` },
        { t: `p`, text: `最后是设计口味：**为什么交回值，而不是让函数自己打印**。打印只能给人眼看，值能被继续运算、能进条件、能存起来 —— 只有能当值用，函数才搭得成积木。顺手记住一句：同一个计算要用两次，先接进变量再复用；写两遍不但多算一次，将来改规则还得改两处。` },
        { t: `h2`, text: `演示 1 · 一行 return，把两次调用接成一句` },
        { t: `code`, lang: `c++`, code: `#include <print>

int add(int a, int b) {
    return a + b;                         // 交货：把和递回调用处
}

int main() {
    int total = add(3, 5) + add(10, 20);  // 返回值能接着算
    std::println("3 + 5 = {}", add(3, 5));
    std::println("两次相加 = {}", total);

    return 0;
}` },
        { t: `p`, text: `输出两行：3 + 5 = 8、两次相加 = 38。请把注意力放在那句 add（3、5）+ add（10、20）上：add 出现两次，每次都是**独立的一台机器**，各自收料、各自算、各自交货，算完的两个数才被加号连起来。函数不记得上一回算过什么，要几份就算几份。` },
        { t: `h2`, text: `演示 2 · 任务 1 的形状：square（int x）` },
        { t: `code`, lang: `c++`, code: `#include <print>

int square(int x) {          // 承诺：交回一个 int
    return x * x;            // 算完立刻交货、立刻结束
}

int main() {
    std::println("5 的平方 = {}", square(5));
    std::println("12 的平方 = {}", square(12));

    int s = square(9);       // 先接住，再拿它继续算
    std::println("9 的平方翻倍 = {}", s * 2);
    return 0;
}` },
        { t: `p`, text: `输出：25、144、288。任务 2 的 sub 更短 —— 一行 return a - b; 就完事，调用 sub（10、4）打出来正是 6。留意两个例子里函数体都没有一句打印，打印全在 main：这就是本课想要的分工 —— **函数负责算，调用处决定这个结果怎么用**。把打印写死在函数里，它就再也没法把数交给你做别的用处。` },
        { t: `h2`, text: `演示 3 · return 走人：把坏情况当场挡掉` },
        { t: `code`, lang: `c++`, code: `#include <print>
int safe_div(int a, int b) {
    if (b == 0) {
        return 0;                        // 挡住除 0，顺手结束函数
    }
    return a / b;                        // 正常路径：走到这里才交货
}
int main() {
    std::println("{}", safe_div(10, 2));
    std::println("{}", safe_div(5, 2));
    std::println("{}", safe_div(7, 0));
    return 0;
}` },
        { t: `p`, text: `输出是 5、2、0。第一个数好懂；第二个数请回想第 8 课那条**整数相除** —— 5 和 2 只商 2，小数部分被砍掉，返回值是 int 就只交回整数。第三行是本课的重点：b 是 0，函数在 if 里就 return 走人了，**下面那句 return a / b 根本没被执行到** —— 于是你永远不会拿 7 去除 0。` },
        { t: `p`, text: `这种「先挡坏情况、再走正常路」的写法行话叫**提前返回**，价值全在 return 的两件事上：既交货、又收工，两条路互不干扰。反过来说，如果 if 里只打印一句「除数不能为 0」却没 return，程序会**继续往下**跑去算 a / b —— 根本没挡住。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `函数只打印、不 return。长相：编译时一句「非 void 函数没有返回语句」的警告，运行时调用处打出一个莫名其妙的数。根因：承诺了 int 却没交货，那个值是哪块内存谁也不知道。`,
          `调用完就把结果丢了。长相：明明算了，屏幕上什么也没有。写成 square（5）; 只是一次运算没人接；要么打印进去，要么赋给变量。`,
          `想接住 void 函数的「结果」：int n = say_hello（）; 报错大意是 void 表达式不能当值用。想让函数给出数，开头的类型就得改成 int。`,
          `return 后面还写了一串代码。长相：那段一次都不执行，而编译器不一定提醒你这行到不了。自查：凡是 return 之后的语句，问一句「它还有机会被走到吗」。`,
          `返回类型和交回的数不匹配。int 的函数 return 一个小数，小数部分当场被砍（还是第 8 课那件事）；开头的承诺要对得上手里的货。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `写 int square(int x) 返回平方，打印 5 和 12 的平方`,
          `写 int sub(int a, int b) 返回差，验证 10 - 4 = 6`,
          `延伸：把 square（5）写进更大的算式，比如 square（5）+ 1 和 square（5 + 1），先猜两个结果各是多少再跑 —— 想清楚「括号里先算完才递进机器」这条`,
          `延伸：把 square 的函数体改成只有一句 std::println 而没有 return，先编译看那句警告长什么样，再跑一遍看看打出来的是什么鬼东西，最后改回来`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：参数是进料口、返回值是出料口 —— 开头那个 int 是承诺，return 交货并当场结束函数；调用处那一整串于是变成那个值，能存、能打、能接着算。` }
      ]
    },
    {
      id: `c54`, title: `第 54 课 · 返回 bool 的函数：只回答「是」或「否」的裁判`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会写「提问型」函数 —— 开头是 bool，只交回 true 或 false；看懂 return 后面直接放一个比较表达式，以及这个返回值怎么钻进 if 的括号里当条件。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课的函数交回一个数，这一课交回**真假**。这类函数的用途很固定：把「判断」打包成一个名字。回想第 27 课那位门卫 —— 它要的正好是一张 bool；那时候你只能现场把条件写全，规则一复杂，if 的括号里就挤成一团。现在你能把整条规则**藏进一个名字里**，门卫只看答案纸，不问过程。` },
        { t: `p`, text: `机制上没有一样是新东西：**bool** 是第 12 课那个只有两种值的盒子，比较表达式是第 22 课学的，&& 和 || 是第 23 课的，取余是第 9 课的。本课只做一件事 —— 把它们从 main **搬进 return 后面**。源稿那台裁判 **bool is_leap_year（int year）** 函数体只有一行，把闰年规则（四年一闰、百年不闰、四百年再闰）一次讲完，交回的就是「是」或「否」。` },
        { t: `p`, text: `命名是这一课唯一值得背的东西：**is_ 开头**。is_even、is_pass、is_leap_year 读起来就是一句问话，if 后面跟着「是闰年吗」，逻辑一眼见底，注释都省了。同类前缀还有 has_、can_、should_，性格一样：只回答问题，不干活、不打印。` },
        { t: `ul`, items: [
          `**开头写 bool**：承诺交回真或假，只此两种，没有第三种答案。`,
          `**return 后面直接跟判断**：一个比较表达式，或者用 && 和 || 拼起来的大条件 —— 它本来就是 bool，不必再套 if。`,
          `**调用处拿到一张 bool**：能进 if 的括号、能赋给 bool 变量、也能直接打印 —— 打出来是 true 和 false 这两个词。`,
          `**它是问问题，不是算数据**：同一条规则问一百次，答案只由你递进去的材料决定；函数自己不记上一问，也不顺手改什么。`
        ]},
        { t: `svg`, caption: `裁判型函数只按一个开关：材料进去，true 或 false 出来，直接送到 if 门口`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 250">
  <text x="16" y="24" font-size="14" font-weight="700" fill="#142639">把规则藏进名字里：调用处只看答案，不问过程</text>
  <rect x="16" y="52" width="132" height="36" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
  <text x="82" y="76" font-size="12" fill="#142639" text-anchor="middle">材料：59 分</text>
  <path d="M148 70 H184" stroke="#00599c" stroke-width="2"/>
  <polygon points="190,70 180,65 180,75" fill="#00599c"/>
  <rect x="192" y="44" width="212" height="96" rx="12" fill="#f4f7fc" stroke="#57677c" stroke-width="2"/>
  <text x="298" y="66" font-size="13" font-weight="700" fill="#57677c" text-anchor="middle">bool is_pass</text>
  <text x="298" y="90" font-size="12" fill="#142639" text-anchor="middle">里面只有一条规则</text>
  <text x="298" y="112" font-size="13" font-weight="700" fill="#00599c" text-anchor="middle">score 大于等于 60 ?</text>
  <text x="298" y="132" font-size="12" fill="#57677c" text-anchor="middle">及格线一改，只改这里</text>
  <path d="M404 78 H452" stroke="#b8232f" stroke-width="2"/>
  <polygon points="458,78 448,73 448,83" fill="#b8232f"/>
  <text x="530" y="74" font-size="12" fill="#b8232f" text-anchor="middle">false</text>
  <path d="M404 108 H452" stroke="#1f7a3d" stroke-width="2"/>
  <polygon points="458,108 448,103 448,113" fill="#1f7a3d"/>
  <text x="530" y="112" font-size="12" fill="#1f7a3d" text-anchor="middle">true</text>
  <rect x="460" y="60" width="70" height="34" rx="8" fill="#ffe9e9" stroke="#b8232f" stroke-width="2"/>
  <text x="495" y="82" font-size="13" font-weight="700" fill="#b8232f" text-anchor="middle">否</text>
  <rect x="460" y="92" width="70" height="34" rx="8" fill="#e6f6ea" stroke="#1f7a3d" stroke-width="2"/>
  <text x="495" y="114" font-size="13" font-weight="700" fill="#1f7a3d" text-anchor="middle">是</text>
  <rect x="16" y="168" width="240" height="60" rx="10" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
  <text x="136" y="192" font-size="12" font-weight="700" fill="#00599c" text-anchor="middle">if 门口：门卫只看这张纸</text>
  <text x="136" y="212" font-size="12" fill="#142639" text-anchor="middle">true 放行，false 跳过</text>
  <path d="M256 198 H320 V126" stroke="#57677c" stroke-width="2" fill="none" stroke-dasharray="6 4"/>
  <polygon points="320,120 315,130 325,130" fill="#57677c"/>
  <rect x="330" y="168" width="334" height="60" rx="10" fill="#fff6e0" stroke="#a26a00" stroke-width="2"/>
  <text x="497" y="192" font-size="12" font-weight="700" fill="#a26a00" text-anchor="middle">规则和选择分开写</text>
  <text x="497" y="212" font-size="12" fill="#142639" text-anchor="middle">is_pass 管「及不及格」，if 管「及格了说什么」</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `先想清楚**为什么值得为一个是非题专门写一个函数**。因为规则会变，而调用它的地方往往有好几处。及格线从 60 挪到 65，你只改函数体那一行；main 里那些 is_pass 调用一个字都不用动。反过来把 score >= 60 抄在五处，你就得记全五个位置 —— 第 51 课开头那个「重复」的老毛病，今天换了个更隐蔽的形式回来。` },
        { t: `p`, text: `再看 return 后面那行为什么**不用 if**。很多人会写成：条件成立就 return true，否则 return false —— 逻辑没错，却把一句话能干的事摊成了三行。真相是**比较表达式自己就是 bool**，score >= 60 算出来就是 true 或 false，直接交货就行。也正因如此，分工特别清爽：**is_pass 管回答**，它对「及格之后该说什么」毫无意见；**if 管选择**，它对「及格线是多少」毫无意见。两边都能单独改、单独读 —— 这就是这类函数存在的意义。` },
        { t: `p`, text: `最后交代一个源稿留白的地方：**「60 分以上」到底含不含 60**。第 28 课分档时把 60 归进了及格档，本课保持一致。这种边界在真实需求里十有八九写得含糊，正确动作不是猜而是问清楚，然后把它**写进 is_pass 那一行**，让所有人共用同一个答案。` },
        { t: `h2`, text: `演示 1 · 一台装着完整规则的裁判` },
        { t: `code`, lang: `c++`, code: `#include <print>
bool is_leap_year(int year) {
    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
}
int main() {
    std::println("2028 是闰年吗？{}", is_leap_year(2028));
    std::println("2026 是闰年吗？{}", is_leap_year(2026));

    if (is_leap_year(2024)) {                // 返回值直接当条件
        std::println("2024 是闰年，2 月有 29 天");
    }
    return 0;
}` },
        { t: `p`, text: `输出三行：true、false、2024 那句。动手验一下前两行就明白 return 那行在忙什么：2028 除 4 余 0、除 100 余 28，前半条已经成立；2026 连 4 都除不尽，两个括号双双落空，于是交回 false。注意第三行 —— if 的括号里**没有比较号**，装的就是那张答案纸，门卫只看它是 true 还是 false。` },
        { t: `h2`, text: `演示 2 · 任务 1：is_even 与三个测试数` },
        { t: `code`, lang: `c++`, code: `#include <print>

bool is_even(int n) {
    return n % 2 == 0;          // 除 2 余 0 → 答案就是 true
}

int main() {
    std::println("4 是偶数吗？{}", is_even(4));
    std::println("7 是偶数吗？{}", is_even(7));
    std::println("0 是偶数吗？{}", is_even(0));
    return 0;
}` },
        { t: `p`, text: `三行输出 true、false、true。函数体只有一行，比第 27 课写在括号里的那串条件还短 —— 这就是把判断提成函数的手感：**规则只写一遍，问它一百次**。第三个数是特意留的：0 除 2 余 0，按规则它是偶数；「测 3 个数」这种任务里，最有价值的往往是那个不合常规的数。` },
        { t: `h2`, text: `演示 3 · 任务 2：is_pass 的两种用法` },
        { t: `code`, lang: `c++`, code: `#include <print>
bool is_pass(int score) {
    return score >= 60;         // 比较表达式本身就是 bool，直接交货
}
int main() {
    bool ok = is_pass(59);      // 用法一：存进 bool 变量
    std::println("59 分及格了吗？{}", ok);

    if (is_pass(60)) {          // 用法二：直接进 if 的括号
        std::println("60 分：及格，恭喜！");
    }
    return 0;
}` },
        { t: `p`, text: `输出两行：59 分那句打 false，60 分那道门被放行。两种用法值得对比 —— 存进 ok 是为了**反复用或晚点用**（同一个答案要判断三次，存起来比调用三次诚实）；直接塞进 if 是为了**当场做决定**，多一个变量反而碍事。` },
        { t: `p`, text: `还有一种你会常听人劝的写法：在 if 里再加一句「结果等于 true」。它没错，但多余 —— 交回来的已经是 bool，门卫要的也正是 bool，不必再比一次。更糟的是它容易让人手滑把两个等号写成一个，直接掉回第 27 课那个「永远放行」的老坑。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `return 写成了赋值：return score = 60; 能编译，交回的是「60 转成 bool」—— 非 0 一律 true，于是**所有人都及格**。长相：不报错、结论全反。第 27 课那个老坑搬进函数里更隐蔽。`,
          `只打印、没 return。长相：编译时一句「非 bool 函数没有返回语句」的警告，调用处拿到垃圾值，if 有时进有时不进。承诺了 bool 就必须交货。`,
          `把判断拆成一串 if 加 return true、return false，结果漏掉某条出口。长相还是那句警告。解法：直接 return 那个拼好的大条件。`,
          `返回类型写成 int、交回 true。能编译（true 被转成 1），但调用处开始拿 1 当真假用，早晚有人写下「等于 1 才算及格」。说 bool 就交 bool，别说假话。`,
          `在函数里连写区间：return 60 <= score <= 90; 能编译、永远为 true —— 先算 60 <= score 得 true，再拿 true 当 1 去比。正确拼法还是第 23 课那套 &&。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `写 bool is_even(int n) 判断偶数，测 3 个数`,
          `写 bool is_pass(int score)，60 分以上返回 true`,
          `延伸：给 is_even 换一条规则 return n % 2 != 0;，先猜 7 会交回什么再跑；再递一个负数进去，想想取余碰到负数会算出什么（第 9 课留过这道题）`,
          `延伸：写一个 bool is_adult（int age），先把它赋给 bool 变量再打印，再直接塞进 if 的括号打印一句「能看这部电影吗」；比较一下哪种写法最好读`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：bool 函数是裁判 —— 开头写 bool，return 后面直接放那张判断题的答案；调用处拿到 true 或 false，能进 if、能存进变量、能直接打印，唯独不需要再跟 true 比一次。` }
      ]
    }
  ]
};
