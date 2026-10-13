/* 喵站 · C++ 入门 正文分部 p06：第 26–30 课（第九轮 · 输入整行 + 分支结构）
 *
 * 源稿：学习资料/C++入门/26_一行文字整段读 ~ 30_switch点菜单。
 * 款式照 p01 样板：tip(蓝·本课目标) → 原理讲解 → 它被设计成什么样/怎么做 → 演示 N → 常见坑 → 任务 → tip(绿·本课一句话)
 *
 * 闸线备忘（本轮我这几课必须守住的）：
 *   if 教在 27、else 教在 28、switch 教在 30；三目 ? : 教在 31，本分部一律不出现。
 *   getline / cin.ignore() 走的是成员调用与 string，第 13 课已教，第 26 课正常用。
 *   交叉引用只往回指（第 N 课，N ≤ 本课号）；指后面的一律写「下一课」「以后再讲」。
 *
 * 验收：node dev/tools/cpp-audit.cjs --part dev/frontend/assets/data/cpp/p06.js
 *       node dev/tools/cpp-exam-check.cjs --only c26,c27,c28,c29,c30
 */
window.MIAO_CPP_P06 = {
  chapters: [
    {
      id: `c26`, title: `第 26 课 · 一行文字整段读：getline 与它的前任留下的回车`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：看到 cin >> 遇空格就停手，改用 std::getline 端走一整行；搞懂那句看着多余、其实在擦回车的 std::cin.ignore()。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 20 课学过用 std::cin >> 从键盘取数。那时候你敲的全是数字，它的脾气没机会暴露。这一课让它读一句话，毛病立刻现形：>> 干的事不是「把你打的字收下」，而是「舀一个词」—— 碰到空格、Tab 或者回车就立刻停嘴，后面剩下的一概不管。所以你满怀诚意地敲下 I am a student，它只把最前面的 I 装进变量，剩下的全部晾在原处。` },
        { t: `p`, text: `先别急着骂它设计得烂，这套规矩是**为数字服务**的。一行里连读三个整数 cin >> a >> b >> c;，靠的正是「遇空白就停」—— 空格和回车就是三个数的分隔符。要是 >> 肯把空格也吞进去，你压根没办法把一行里的三个数分开装进三个变量。同一段空白，对数字是切分的刀，对句子是字缝里的肉，两种身份撞在一起，冲突就来了。` },
        { t: `p`, text: `你真正要的其实是另一件事：把一整行原样收下，空格一个不留地都算数。标准库给了把大勺子 —— **std::getline(std::cin, s)**。它的规矩很直白：从当前位置一直读，空格照收，普通字符照收，直到撞上一个换行符才罢手；而且那个换行符会被它**吃掉、不进字符串**。所以记住这个画面：>> 是饭勺，一次舀一勺；getline 是汤碗，一次端一整行。` },
        { t: `ul`, items: [
          `**读到哪里为止**：>> 到下一个空白为止；getline 到下一个换行符为止。`,
          `**空白怎么处理**：>> 把空白当终点、自己不留；getline 把空格当普通内容收下，只在末尾把换行符吃掉。`,
          `**装进什么东西**：>> 右边可以是 int、double、std::string；getline 第二个参数必须是 std::string，塞 int 编译器当场拦你。`,
          `**要不要打招呼**：>> 会先跳过所有空白再开始读；getline 一点不跳，第一个字符是换行符就立刻交出一个空字符串 —— 这条是本课最大的坑，现场看。`
        ]},
        { t: `svg`, caption: `键盘敲进去的字先排在缓冲区里；>> 只取走第一个词，把回车原样留在原地`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 250">
  <text x="20" y="28" font-size="15" font-weight="700" fill="#142639">你敲的：hello 回车 I am a student 回车</text>
  <rect x="20" y="44" width="640" height="46" rx="8" fill="#f4f7fc" stroke="#57677c" stroke-width="1.5"/>
  <text x="34" y="73" font-size="14" fill="#142639">h e l l o ⏎ I ␣ a m ␣ a ␣ s t u d e n t ⏎</text>
  <text x="34" y="112" font-size="13" font-weight="700" fill="#00599c">第一步：std::cin >> word;  ——  遇空格/回车就停</text>
  <rect x="20" y="122" width="60" height="34" rx="6" fill="#00599c"/>
  <text x="50" y="144" font-size="13" font-weight="700" fill="#ffffff" text-anchor="middle">hello</text>
  <text x="92" y="144" font-size="13" fill="#57677c">← word 拿走这一个词</text>
  <text x="20" y="180" font-size="13" font-weight="700" fill="#b8232f">第二步：⏎ 还躺在缓冲区里，没人管</text>
  <rect x="20" y="192" width="34" height="34" rx="6" fill="#ffe9e9" stroke="#b8232f" stroke-width="2"/>
  <text x="37" y="214" font-size="14" font-weight="700" fill="#b8232f" text-anchor="middle">⏎</text>
  <text x="66" y="214" font-size="13" fill="#142639">← 这时直接上 getline，它一眼看见换行符，立刻交出一个空字符串</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `getline 是个**自由函数** —— 不挂在某个对象身上，是站在外面等着被调用的一个函数，住在头文件 string 里。第一个参数写 std::cin，意思是「从标准输入这条水管里接」；第二个参数写你要装满的那只小桶。本课先用一句一行的老实写法。` },
        { t: `p`, text: `那 std::cin.ignore() 是哪来的？它是输入流对象自带的功能（第 13 课那种「点号后面跟名字」的成员调用，规矩一样）：**从缓冲区里丢掉一个字符**。默认丢一个，正好对付 >> 留下的那个回车 —— 意思就是「上一把勺子用完了，把桌上那个回车擦掉再上汤碗」。` },
        { t: `h2`, text: `演示 1 · 一把勺子只舀一个词` },
        { t: `code`, lang: `c++`, code: `#include <iostream>
#include <print>
#include <string>

int main() {
    std::string word = "??";

    std::print("输入一句话: ");
    std::cin >> word;                     // 遇空格就停手

    std::println("word = {}", word);      // 打 I am a student → 只拿到 I
    return 0;
}` },
        { t: `p`, text: `你打 I am a student 回车，屏幕上只有 word = I。剩下的「am a student 回车」去哪了？还留在缓冲区里排队。这个程序只读一次就退出，残留跟着进程一起消失，你察觉不到。但只要同一次运行里还要再读第二次，残留就会出来咬人 —— 那是演示 3 的戏码。` },
        { t: `h2`, text: `演示 2 · getline 端走一整行` },
        { t: `code`, lang: `c++`, code: `#include <iostream>
#include <print>
#include <string>
int main() {
    std::string word = "??", line = "??";
    std::print("输入一个单词: ");
    std::cin >> word;              // 只读空格前的一个词
    std::cin.ignore();             // 吃掉残留的那个回车
    std::print("再输入一句话: ");
    std::getline(std::cin, line);  // 一整行，空格照收

    std::println("单词 = {} / 整句 = {}", word, line);
    return 0;
}` },
        { t: `p`, text: `这就是源稿那份代码。按规矩跑：先敲 hello 回车，再敲 I am a student 回车，打出「单词 = hello」「整句 = I am a student」。第二段能带着空格完整落进 line，靠的就是 getline 不把空格当终点。顺带留意分工：提示语用 std::print（不换行，光标留在原处等你打字），结果用 std::println。` },
        { t: `h2`, text: `演示 3 · 把 ignore 那行删掉，事故现场` },
        { t: `code`, lang: `c++`, code: `std::cin >> word;              // 敲 hello 回车 → word = hello，⏎ 留在缓冲区
// std::cin.ignore();        // ← 把这行删掉
std::getline(std::cin, line);  // 它一睁眼就是 ⏎，当场交差
std::println("整句 = [{}]", line);   // 打出来是空的中括号` },
        { t: `p`, text: `跑起来的样子最气人：程序不给你打第二句的机会，提示语刚出就打印「整句 = []」，像自己提前收工。原因就在前面那张图里 —— 缓冲区里第一个待读的字符还是上一任留下的回车，而 getline 的规矩是见换行即止、空白一个都不跳。它忠实地读完了「一行零个字符」，交差走人。` },
        { t: `p`, text: `怎么治？三条按场景挑：一是 std::cin.ignore()，丢一个字符，刚好是那个回车（前提是残留确实只剩回车；上一行还有半句没读完，丢一个就不够）；二是 std::cin.ignore(1000, '\\n')，一路丢到换行符为止，更保险；三是干脆别混用 —— 整份输入全用 getline 读成字符串，要数字再自己转（以后再讲）。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `用了 >> 之后紧跟 getline，第二句被「跳过」。长相是：不报错、不卡住，就是没等你打字，屏幕上直接给出空结果。根因是缓冲区里残留的换行符被 getline 当成了那一行的全部内容。`,
          `头文件漏了。少 #include <string> 报 error: getline is not a member of std；少 #include <iostream> 就报 std::cin 是个没人认识的名字。getline 住在 string 里，cin 住在 iostream 里，两个都得请进来。`,
          `想让 getline 读进 int：第二个参数塞个 int，编译报 no matching function —— 它只收 std::string。读数字还是老实用 >>。`,
          `以为 ignore() 是万能的。括号里什么都不写时它只丢**一个**字符，万一上一行输入尾巴还挂着一串字，就得写成 ignore(1000, '\\n') 这种「丢到换行为止」的形式。`,
          `把 >> 和 getline 的分工记反。背这句：读**词和数**用 >>，读**整行文本**用 getline；两种之间换班，中间必须擦回车。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `先输入 hello 回车，再输入 I am a student，看两个变量各装了什么`,
          `删掉 std::cin.ignore(); 再跑：第二句还没等你打就结束了，因为 getline 把残留的回车当成了"空行"`,
          `延伸：把 ignore 换成 std::cin.ignore(1000, '\\n')，第一次输入故意打 hello world 回车，看第二次还能不能正常读到一整句`,
          `延伸：写个程序，先用 getline 读姓名（可能带空格），再用 getline 读座右铭，两行都打印 —— 全程不用 >>，一行 ignore 都不需要，想想为什么`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：>> 是勺子只舀一个词，getline 是汤碗端走整行；勺子用完会在缓冲区留下一个回车，换汤碗之前必须先 ignore 掉它。` }
      ]
    },
    {
      id: `c27`, title: `第 27 课 · 第一次 if：给程序装一道门卫`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会写 if (条件) { 放行的代码 }，看懂「条件为 true 才执行、为 false 整段跳过」，并且认清楚 = 和 == 在 if 里造成的那类事故。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `到上一课为止，你写的每个程序都是**一条道走到黑**：从 main 第一行起一行接一行往下执行，谁也拦不住谁。这叫顺序结构，能算数、能打字，却做不了任何「看情况」的事 —— 你没法让程序只在及格时才说恭喜。` },
        { t: `p`, text: `今天加的东西叫**分支**（branch），具体长相是 **if**。把 if 想成门口的一位**门卫**：他手里只有一张判断题，括号里那个条件式的答案只有两种 —— true 就侧身放行，花括号里的代码整段被执行；false 就抬手拦住，那一整段被跳过，程序直接从花括号后面继续走。门卫不会跟你商量，也不会「执行一半」，所以你要做的只有一件事：**把那道判断题写对。**` },
        { t: `code`, lang: `text`, code: `if ( 条件 ) {          // 条件必须是一对括号里的「真 / 假」
    放行的代码       // 条件为 true：这一段整段执行
}                    // 条件为 false：这一段整段跳过
往下走的代码            // 不管放行还是跳过，这行都会执行` },
        { t: `p`, text: `括号里那个「条件」不是新东西，它就是第 22 课学过的**比较表达式**（score >= 60、age == 18、name != "guest"），或者是第 23 课用 && || ! 拼起来的大条件。它们的类型本来就是 bool —— 第 12 课那只只有 true 和 false 两种值的盒子，到这里终于派上了正经用场。所以你可以这样记：**if 的括号里放的是一张 bool，别的都不是它的本职。**` },
        { t: `svg`, caption: `if 就是一个岔路口：条件 true 走侧门里那条小路，false 直接绕过去`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 230">
  <circle cx="60" cy="115" r="26" fill="#00599c"/>
  <text x="60" y="112" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">if</text>
  <text x="60" y="128" font-size="11" fill="#cfe0f2" text-anchor="middle">条件?</text>
  <path d="M86 115 H180" stroke="#57677c" stroke-width="2.5"/>
  <polygon points="180,115 170,109 170,121" fill="#57677c"/>
  <rect x="186" y="88" width="170" height="56" rx="10" fill="#e6f6ea" stroke="#1f7a3d" stroke-width="2"/>
  <text x="271" y="112" font-size="13" font-weight="700" fill="#142639" text-anchor="middle">花括号里的代码</text>
  <text x="271" y="132" font-size="12" fill="#1f7a3d" text-anchor="middle">true 才放行</text>
  <path d="M356 116 H440" stroke="#1f7a3d" stroke-width="2.5"/>
  <polygon points="440,116 430,110 430,122" fill="#1f7a3d"/>
  <path d="M60 89 C60 34 400 34 448 100" stroke="#b8232f" stroke-width="2.5" fill="none" stroke-dasharray="7 5"/>
  <polygon points="448,102 440 92,458 94" fill="#b8232f"/>
  <text x="250" y="30" font-size="13" font-weight="700" fill="#b8232f" text-anchor="middle">false：整段跳过，绕过去走</text>
  <rect x="446" y="92" width="170" height="50" rx="10" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
  <text x="531" y="114" font-size="13" font-weight="700" fill="#142639" text-anchor="middle">花括号后面的行</text>
  <text x="531" y="132" font-size="12" fill="#57677c" text-anchor="middle">两条路在这里合流</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `先看**为什么条件要写在括号里**。C++ 需要一个明确的边界告诉门卫「你的判断题到这儿为止」，括号就是那个边界；没有它，if score >= 60 { 里的边界会含糊不清（表达式什么时候结束？）。这条规矩带来一个副作用：**if 后面紧跟的必须是 (**，写成 if (score) >= 60 意思完全变了，编译器还可能觉得一切正常。` },
        { t: `p`, text: `再看**花括号**。它圈出的是「归这个 if 管的代码范围」，业内叫这个范围**分支体**或代码块。语法上当里面只有一条语句时，花括号可以省（if (a > b) max = a;），但省下之后范围就只剩紧跟着的那**一条**语句 —— 本课和接下来的所有例子都老老实实写花括号，一条也照写：多两个字符，换来范围一目了然，非常值。` },
        { t: `p`, text: `最后是**它和顺序执行的关系**：if 不会「跳走不回来」，两条路最终合流到同一行。也就是说被跳过的那段代码不是被删除了，只是这一次没轮到它 —— 你的程序还是从头走到尾，只是中间选择了一下走哪条。这个「选完还得汇合」的性格，是后面所有分支写法的底子。` },
        { t: `h2`, text: `演示 1 · 两个 if，一个放行一个跳过` },
        { t: `code`, lang: `c++`, code: `#include <print>

int main() {
    int score = 85;
    if (score >= 60) {                       // 85 >= 60 是 true，进门
        std::println("{} 分，及格，恭喜！", score);
    }
    if (score == 100) {                      // false，花括号整段跳过
        std::println("满分！");
    }
    std::println("程序照常走到最后一行");     // 被跳过不影响后面
    return 0;
}` },
        { t: `p`, text: `跑出来两行：85 分那句和「程序照常走到最后一行」。满分那句没有出现 —— 不是出错了，是它压根没被执行。注意两个 if 是**两个独立的门卫**，第一个放行与否跟第二个毫无关系，每个都各自问一遍自己的条件。这一点下一课会变得关键。` },
        { t: `h2`, text: `演示 2 · 改成 100，看哪几段被放行` },
        { t: `code`, lang: `c++`, code: `int score = 100;

if (score >= 60) {          // 100 >= 60 → true，放行
    std::println("{} 分，及格，恭喜！", score);
}
if (score == 100) {         // 100 == 100 → true，这次也放行
    std::println("满分！");
}` },
        { t: `p`, text: `这次三行全打出来（含最后那行照常执行的）。顺手把 score 改成 59 再跑一次：两条 if 都关门，屏幕上只剩「程序照常走到最后一行」—— 一段代码都没被执行，程序依然正常运行完毕。这就是分支的基本盘：**放行与跳过都是合法结局。**` },
        { t: `h2`, text: `演示 3 · 把 == 写成 =，事故现场` },
        { t: `code`, lang: `c++`, code: `int score = 85;

// if (score == 100) {       // 对的写法：问「它等不等于 100」
if (score = 100) {           // 错的写法：把 100 装进 score，然后拿 100 当条件
    std::println("满分！");   // 永远打印，跟原始分数无关
}` },
        { t: `p`, text: `这行代码**能编译**，编译器最多警告你一句（g++ 的原话大意是：把赋值当成了判断真假，建议你加括号）。为什么能过？因为一个赋值表达式自己也有值：**它等于被装进去的那个数**。所以 score = 100 干了两件事 —— 先把 100 塞进 score，再把 100 交给 if。而 if 只看「这数是不是 0」：非 0 一律当 true，0 才当 false。100 永远非 0，这位门卫就永远放行，而且 score 已经被你偷偷改掉了，后面的分数全乱。` },
        { t: `p`, text: `什么时候会真的撞上这一坑？两种：一是手滑（少打一个等号）；二是有些语言里 if (x = 读出来的值) 是合法的写法，抄来的代码带着这个习惯。防它有三个动作：**警告别关掉**（这条警告就是为你准备的）、条件里用 == 时心里默念「我在问它等不等」、以及以后再讲的「带初始化的 if」那类更严的写法。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `if (score >= 60); —— 右括号后面多打了一个分号。长相最阴：不报错、不警告，那个分号成了「条件成立时执行的一条空语句」，花括号里的打印变成无条件执行，判断像是彻底失效。根因就是 if 只管紧跟的那一条语句，而分号本身就是一条语句。`,
          `if (score = 100)。不报错，永远放行，还把 score 改了。看警告，别只看有没有红字。`,
          `省掉花括号又想管两行：if (a > b) std::println("甲"); std::println("乙"); —— 只有甲归 if 管，乙每次都打。花括号是范围，不是装饰。`,
          `条件忘了括号：if score >= 60 { 。编译器报 expected '(' 一类，这条报错很友好，照它补上就行。`,
          `把范围写成 60 <= score <= 90。它能编译、永远为 true：先算 60 <= score 得 true，再把 true 当 1 去比 1 <= 90。正确的拼法是第 23 课那套 &&：score >= 60 && score <= 90。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把 score 改成 100，看哪段被放行`,
          `把 == 故意写成 =（if (score = 100)），编译看警告、运行看后果`,
          `延伸：再加一个 if (score < 0)，条件里填上「分数低于 0」该说的话，然后输入一个负分跑一遍`,
          `延伸：用第 23 课的 && 写一个条件：score >= 60 && score < 90（及格但不优秀）时打印一句话；先心算 85 和 95 各会不会放行，再运行验证`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：if 是门卫，括号里放一张 bool；true 整段放行、false 整段跳过，两条路最后都要合流 —— 判断用 ==，右括号后面别甩分号。` }
      ]
    },
    {
      id: `c28`, title: `第 28 课 · 多岔路口 else if：排成一列，命中即停`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会用 if / else if / else 把多种情况排成一列，理解「第一个成立的进门、后面的看都不看」，并搞清为什么正确的顺序能帮你省掉一半条件。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课那个程序里站着两位各自岗哨的门卫：第一位管「及格没」，第二位管「满分没」。他们互不通气，各问各的。这在「几件事互相没有关系」时正合适，可一旦碰到**互斥的分类**就别扭了 —— 优秀、良好、及格、不及格这四个档，一个分数只该落进一个档。用一串独立 if 去写，score 是 95 时「>=90」和「>=60」两条同时成立，两行都打出来，一个学生被贴了两张档；写成 59 分呢，四条如果范围没兜住就一条都不打，屏幕上什么都不说。` },
        { t: `p`, text: `C++ 给的解法是把门卫**排成一列**：**else if**。它的读法非常像人话 —— 「如果……；否则再如果……；否则……」。整列只有一个动作规则：**从最上面那行开始挨个问条件，第一个问到 true 的进门，剩下的整列（包括它们还没算的条件）一律不看**。最后那个不带条件的 **else** 是兜底门：前头全都 false 才轮到它，它不需要条件，因为能走到它面前这件事本身就说明了「前面全不成立」。` },
        { t: `ul`, items: [
          `**整条链最多执行一段**，一段都不执行也有可能（前提是没有 else 兜底）。`,
          `**问的顺序就是代码从上往下的书写顺序**，不是条件谁更严。第一个 true 出现即终止，链尾的那些条件连算都不会被算。`,
          `**else 不写条件**，它必须紧跟在某一段后面单独站岗；写 else (score < 60) 是错的，编译器要么报错、要么把括号里那截当成一条全新的独立语句。`,
          `**链条可以无限拉长**，一个 if 后面能接任意多个 else if，最后可选地来一个 else。反过来说，else if 不能脱离 if 单独存在 —— 没有第一个 if，就没有「否则」。`
        ]},
        { t: `svg`, caption: `一条 else if 链就是一串连排的岔路口：往下走是「这条不成立」，往右走就是命中，链条当场结束`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 268">
  <text x="16" y="22" font-size="14" font-weight="700" fill="#142639">从上往下挨个问；第一个成立就向右出门，剩下的岔口不再问</text>
  <rect x="16" y="38" width="176" height="34" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
  <text x="104" y="60" font-size="13" fill="#142639" text-anchor="middle">① score 大于等于 90 ?</text>
  <rect x="330" y="38" width="120" height="34" rx="8" fill="#e6f6ea" stroke="#1f7a3d" stroke-width="2"/>
  <text x="390" y="60" font-size="13" font-weight="700" fill="#1f7a3d" text-anchor="middle">优秀</text>
  <path d="M192 55 H324" stroke="#1f7a3d" stroke-width="2"/><polygon points="324,55 314,50 314,60" fill="#1f7a3d"/>
  <path d="M104 72 V96" stroke="#57677c" stroke-width="2"/><polygon points="104,96 99,86 109,86" fill="#57677c"/>
  <text x="118" y="88" font-size="12" fill="#57677c">否</text>
  <rect x="16" y="100" width="176" height="34" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
  <text x="104" y="122" font-size="13" fill="#142639" text-anchor="middle">② score 大于等于 80 ?</text>
  <rect x="330" y="100" width="120" height="34" rx="8" fill="#e6f6ea" stroke="#1f7a3d" stroke-width="2"/>
  <text x="390" y="122" font-size="13" font-weight="700" fill="#1f7a3d" text-anchor="middle">良好</text>
  <path d="M192 117 H324" stroke="#1f7a3d" stroke-width="2"/><polygon points="324,117 314,112 314,122" fill="#1f7a3d"/>
  <path d="M104 134 V158" stroke="#57677c" stroke-width="2"/><polygon points="104,158 99,148 109,148" fill="#57677c"/>
  <text x="118" y="150" font-size="12" fill="#57677c">否</text>
  <rect x="16" y="162" width="176" height="34" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
  <text x="104" y="184" font-size="13" fill="#142639" text-anchor="middle">③ score 大于等于 60 ?</text>
  <rect x="330" y="162" width="120" height="34" rx="8" fill="#e6f6ea" stroke="#1f7a3d" stroke-width="2"/>
  <text x="390" y="184" font-size="13" font-weight="700" fill="#1f7a3d" text-anchor="middle">及格</text>
  <path d="M192 179 H324" stroke="#1f7a3d" stroke-width="2"/><polygon points="324,179 314,174 314,184" fill="#1f7a3d"/>
  <path d="M104 196 V220" stroke="#b8232f" stroke-width="2"/><polygon points="104,220 99,210 109,210" fill="#b8232f"/>
  <text x="118" y="212" font-size="12" fill="#b8232f">全否</text>
  <rect x="16" y="224" width="176" height="34" rx="8" fill="#ffe9e9" stroke="#b8232f" stroke-width="2"/>
  <text x="104" y="246" font-size="13" fill="#142639" text-anchor="middle">④ else（不问条件）</text>
  <rect x="330" y="224" width="120" height="34" rx="8" fill="#e6f6ea" stroke="#1f7a3d" stroke-width="2"/>
  <text x="390" y="246" font-size="13" font-weight="700" fill="#1f7a3d" text-anchor="middle">不及格</text>
  <path d="M192 241 H324" stroke="#1f7a3d" stroke-width="2"/><polygon points="324,241 314,236 314,246" fill="#1f7a3d"/>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `最有味道的一点是：**顺序能替你写条件**。第二行只写了 score >= 80，可它真正覆盖的区间是「80 到 89」。为什么？因为代码能走到第二行，就意味着第一行问过、答案是 false，也就是 score 必然小于 90 —— 「小于 90」这个信息已经被顺序**白白送你**了，不需要再写一遍。整条链写成从严到松（90、80、60），每一档只问一个边界，读起来干净、也不容易漏缝。反过来如果你把每一档都写成完整的区间（score >= 80 && score <= 89），逻辑没错，但你开始用顺序做排除、又同时自己写排除，两处一旦对不齐就会出现「哪个档都不成立」的空隙，分数掉进缝里悄悄没人管。` },
        { t: `p`, text: `那为什么设计成「命中即停」而不是「全都问一遍再挑最合适的」？因为这条链服务的是**互斥分类**：分诊台按危重程度喊号，只要有一个成立，后面的判断就没有意义了。命中即停省下了后面的条件计算，更重要的是给了你一个明确承诺：**这条链最多产出一次结果**。代价完全相反 —— **先后顺序成了逻辑的一部分**，写错顺序不是报错，而是安静地给出错误答案，那正是演示 3 要现场演的事故。` },
        { t: `h2`, text: `演示 1 · 四档排成一列` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int score = 85;
    if (score >= 90) {
        std::println("{} 分：优秀", score);
    } else if (score >= 80) {          // 走到这说明已经小于 90
        std::println("{} 分：良好", score);
    } else if (score >= 60) {          // 再排除小于 80 的，这里实际是 60 到 79
        std::println("{} 分：及格", score);
    } else {                           // 前面全不成立，兜底：小于 60
        std::println("{} 分：不及格", score);
    }
    return 0;
}` },
        { t: `p`, text: `源稿这份代码只有一行被打印：85 分走的是第二道门。第一道不成立、第二道成立，于是第三道和 else 连问都不问。` },
        { t: `code`, lang: `text`, code: `score = 95   ①成立                → 95 分：优秀
score = 85   ①否 ②成立            → 85 分：良好
score = 60   ①否 ②否 ③成立        → 60 分：及格
score = 59   ①②③全否，落到 else   → 59 分：不及格
score = 3    同上                  → 3 分：不及格
边界记两个：60 落在「及格」这一档（条件写的是大于等于）；59 才掉进 else。` },
        { t: `p`, text: `这张表就是本课任务 1 的答卷，建议你真的把 score 逐个改成这四个值跑一遍，特别是 60 和 59 这一对：分档的 bug 十有八九不在中间值上，全在**边界**上 —— 一个 >= 写成 >，60 分的人就被打到不及格，而这种事编译器一个字都不会说。` },
        { t: `h2`, text: `演示 2 · 独立 if 与 else if 的分工` },
        { t: `code`, lang: `c++`, code: `int score = 100;

// 版本 A：上一课的两位独立门卫
if (score >= 90) { std::println("优秀"); }
if (score >= 60) { std::println("及格"); }
// 打两行：优秀、及格 —— 一张卷被贴了两个档

// 版本 B：排成一列
if (score >= 90) {
    std::println("优秀");
} else if (score >= 60) {          // 上面已经命中，这里连算都不算
    std::println("及格");
}
// 只打一行：优秀` },
        { t: `p`, text: `两个版本都对，只是它们回答的是不同的问题。**互斥的归类**用 else if（只该有一个结果）；**几件可以同时成立的事**用独立 if（既要提示优秀、又要提示有进步）。判断标准就一句：这几条规则能不能同时为真？能，就别把它们串成一条链。` },
        { t: `h2`, text: `演示 3 · 顺序挪一位，85 被打成及格` },
        { t: `code`, lang: `c++`, code: `int score = 85;

if (score >= 60) {                   // 把它挪到最上面
    std::println("{} 分：及格", score);
} else if (score >= 90) {            // 85 早在第一道就进门了
    std::println("{} 分：优秀", score);
} else {
    std::println("{} 分：不及格", score);
}
// 输出：85 分：及格 —— 明明够优秀，被前面那道松条件挡死` },
        { t: `p`, text: `这就是任务 2 的现场。程序不报错、不警告，输出看着也「像个档次」，只有你我都清楚它是错的。根因一句话：**这一列里挡在前面的条件宽，就把它下面所有更严的条件都吃掉了**。顺手记两条自查：写完一条链，从上往下逐档问一句「这一档成立的范围，会不会把下面某一档整个罩住」；被罩住的那一档就是死代码，写跟没写一样。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `顺序写反，宽条件挡在前面（把 >=60 放在 >=90 之上）。长相：程序正常输出、值却永远偏低，后面几档形同虚设。这是 else if 的头号 bug，也是编译器唯一帮不上你的那种。`,
          `忘了写最后的 else。长相：某些输入什么都不打印，你以为是程序卡住了。没有兜底门，落进缝里的值就无人接待；实在不想处理也要加一个 else 打印「异常值」，把问题暴露在屏幕上而不是心里。`,
          `既靠顺序排除、又自己写全区间（score >= 80 && score <= 89 与上一条写成 score >= 80 && score < 90 混用）。一处边界写成 < 与 <= 不一致，89 分和 90 分就从缝里掉出去。二选一，全链统一。`,
          `给 else 加条件：else (score < 60) { …… }。编译器会报类似 expected ';' before '(' 的话，或者干脆让括号那段自成一句。else 天生无条件，想带条件就写 else if。`,
          `以为链越长越省钱。二十个档一路点下来，每个都要问一遍；如果这些档其实是「一个变量对上一堆固定值」，下一课之外还有更合适的写法 —— 先想清分类的性质，再选结构。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把 score 依次改成 95 / 60 / 59 / 3，各打出什么档`,
          `把 >=60 那个分支挪到最上面再运行 85——为什么被打成"及格"？（体会：条件顺序错了，挡路的就是它）`,
          `延伸：给这条链加一档「满分单独表扬」。想一想它必须放在 >=90 的**上面**还是**下面**才拦得住 100 分，先说理由再改代码验证`,
          `延伸：用第 20 课的 std::cin >> 把 score 改成键盘输入，然后喂 100 / 90 / 80 / 60 / 59 / -1 六个数跑一遍，专挑边界值，看有没有哪个值掉进档与档之间的缝里`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：else if 是一列排他的门卫，从上往下问到第一个 true 就进门并终止；顺序本身就是条件的一部分，而 else 负责把没人要的输入接住。` }
      ]
    },
    {
      id: `c29`, title: `第 29 课 · 套娃 if：门里面还有一道门`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会在一个 if 的花括号里再写一个 if，处理「先满足 A，才需要看 B」这种有先后依赖的判断，并且看清嵌套和把条件拼起来各自适合什么场合。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `前两课的门卫都站在同一个大厅里：条件往里一放，行就放行、不行就跳过。可现实里的判断常常是**有层次的**：办会员卡吗？是 —— 那再看你满 18 了没有；未成年 —— 再看你是几年级。第二个问题只在第一个答案为「是」的时候才有意义，这种结构叫**嵌套**，源稿给它起的名字更形象：**套娃**。` },
        { t: `p`, text: `机制上没有任何新东西要学，靠的是 C++ 的一条**组合性**：花括号里放的是「若干条语句」，而 if 本身也是一条语句，所以花括号里可以整整齐齐再放一个 if；那个内层 if 的花括号里还能再放一个，想套多深就套多深。语言不拦你，拦你的是自己的眼睛。` },
        { t: `code`, lang: `text`, code: `if (是学生) {                  ← 第一道门：先看身份
    if (年龄小于 18) {         ← 第二道门：只有站在第一道门里面才会问这行
        ... 未成年学生
    } else {
        ... 成年学生
    }
} else {
    ... 不是学生               ← 第一道门就关了，里面那道门根本不会被问
}` },
        { t: `p`, text: `于是嵌套给你两件独立 if 和 else if 链都给不了的东西：一是**省掉重复的前提**，内层不用再写一遍「是学生」这个条件，因为它能被执行到就说明前提已经成立（这一点和上一课「顺序替你写条件」是同一个道理，只是从「一列」变成了「一层」）；二是**在每个大格子里继续细分**，外层分两拨，内层各分两拨，一共四个结局 —— 这种「先分大类，再分小类」的树形结构，用一列 else if 表达就得把每个末端都写成一长串 &&，读的人要自己在脑子里重建树。` },
        { t: `svg`, caption: `嵌套 if 长成一棵树：每一道门开两条岔，叶子才是要执行的那句话`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 276">
  <rect x="14" y="104" width="150" height="44" rx="10" fill="#00599c"/>
  <text x="89" y="124" font-size="13" font-weight="700" fill="#ffffff" text-anchor="middle">第一道门</text>
  <text x="89" y="140" font-size="12" fill="#cfe0f2" text-anchor="middle">if (is_student)</text>
  <path d="M164 116 H250" stroke="#1f7a3d" stroke-width="2.5"/><polygon points="250,116 240,111 240,121" fill="#1f7a3d"/>
  <text x="196" y="110" font-size="12" font-weight="700" fill="#1f7a3d">true</text>
  <path d="M164 136 H250" stroke="#b8232f" stroke-width="2.5" stroke-dasharray="6 4"/><polygon points="250,136 240,131 240,141" fill="#b8232f"/>
  <text x="198" y="156" font-size="12" font-weight="700" fill="#b8232f">false</text>
  <rect x="256" y="94" width="150" height="44" rx="10" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
  <text x="331" y="114" font-size="13" font-weight="700" fill="#142639" text-anchor="middle">第二道门</text>
  <text x="331" y="130" font-size="12" fill="#57677c" text-anchor="middle">if (age 小于 18)</text>
  <rect x="256" y="176" width="150" height="40" rx="10" fill="#e6f6ea" stroke="#1f7a3d" stroke-width="2"/>
  <text x="331" y="201" font-size="13" fill="#142639" text-anchor="middle">不是学生</text>
  <path d="M406 106 H492" stroke="#1f7a3d" stroke-width="2.5"/><polygon points="492,106 482,101 482,111" fill="#1f7a3d"/>
  <text x="430" y="100" font-size="12" fill="#1f7a3d">true</text>
  <path d="M406 126 H492" stroke="#b8232f" stroke-width="2.5" stroke-dasharray="6 4"/><polygon points="492,126 482,121 482,131" fill="#b8232f"/>
  <text x="432" y="146" font-size="12" fill="#b8232f">false</text>
  <rect x="498" y="84" width="148" height="40" rx="10" fill="#e6f6ea" stroke="#1f7a3d" stroke-width="2"/>
  <text x="572" y="109" font-size="13" fill="#142639" text-anchor="middle">未成年学生</text>
  <rect x="498" y="136" width="148" height="40" rx="10" fill="#e6f6ea" stroke="#1f7a3d" stroke-width="2"/>
  <text x="572" y="161" font-size="13" fill="#142639" text-anchor="middle">成年学生</text>
  <rect x="498" y="196" width="148" height="44" rx="10" fill="#fff6e0" stroke="#a26a00" stroke-width="2" stroke-dasharray="6 4"/>
  <text x="572" y="214" font-size="12" font-weight="700" fill="#a26a00" text-anchor="middle">门里面还能再开一道</text>
  <text x="572" y="231" font-size="12" fill="#a26a00" text-anchor="middle">看 grade 是不是 A</text>
  <path d="M572 176 V192" stroke="#a26a00" stroke-width="2" stroke-dasharray="5 4"/><polygon points="572,192 567,183 577,183" fill="#a26a00"/>
  <text x="14" y="30" font-size="14" font-weight="700" fill="#142639">只有走进第一道门，第二道门才会被问；</text>
  <text x="14" y="50" font-size="13" fill="#57677c">叶子（绿框）只有一个会被执行 —— 从根到那片叶子的一串答案。</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `先划一条边界：**什么时候用嵌套，什么时候用 &&**。如果你的目的只是「把同时满足 A 和 B 的那一群人挑出来」，那 && 一行更平：if (is_student && age < 18) { …… }，一条链都不用套，读的人也不用爬树。反过来，如果 A 成立之后你还要**按 B 分好几拨走不同的路**，或者 B 只在 A 成立时才有意义（比如先判「有没有登录」再判「是不是会员」，没登录的用户压根没有会员这个字段），嵌套才对。判断口诀：**只是加限定，就用 &&；进了门还要分流，才套娃。**` },
        { t: `p`, text: `再说一件必须提前知道的事：**C++ 完全不看缩进**。缩进是给人看的，编译器眼里只有花括号。平时两者一致所以没事，一旦你把内层的 if 缩进了两格、却把花括号放错位置，程序的行为和屏幕上画出的层次就分家了 —— 这类代码能编译、能跑，只是跑的不是你以为的那个逻辑。所以本课的纪律只有一条：**嵌套一律写花括号，一条语句也不省**，让缩进和花括号说的完全是同一句话。` },
        { t: `p`, text: `套多深算过界？经验值是三到四层。再深下去，你会开始分不清「现在站在哪一层」，改一处要顺着括号线找半天，而且每加一层，测试的组合数就翻一倍。真到了那种地步，通常说明该把里面那一层提成一个函数或者换一种写法（这属于以后的内容，本课先记住：**深到需要靠数缩进才能看懂，就该拆了**）。` },
        { t: `h2`, text: `演示 1 · 两道门的套娃` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    bool is_student = true;
    int age = 16;
    if (is_student) {                          // 第一道门：先看身份
        if (age < 18) {                        // 第二道门，就在第一道里面
            std::println("未成年学生");
        } else {
            std::println("成年学生");
        }
    } else { std::println("不是学生"); }       // 外层兜底只有一句话，写成一行
    return 0;
}` },
        { t: `p`, text: `这版输出「未成年学生」。注意最外面那个 else 只包一条打印，所以我把它挤成一行 —— 这是全课唯一一处省花括号的地方，因为里面没有第二层可以搞混；一旦 else 里要放 if，就必须老老实实把花括号写全。` },
        { t: `code`, lang: `text`, code: `is_student   age    走的路                 输出
true         16     第一道 true → 第二道 true   未成年学生
true         20     第一道 true → 第二道 false  成年学生
false        20     第一道 false，里面那道没问   不是学生
false        16     同上                       不是学生（age 根本没被看过）` },
        { t: `p`, text: `这张表就是任务 1 的全部答案，值得盯一眼最后两行：is_student 为 false 的时候，**内层那个 if 连条件都不计算**，age 是 16 还是 20 都无所谓 —— 这就是嵌套的「先满足 A 才看 B」在运行机制上的真实样子，不是修辞。` },
        { t: `h2`, text: `演示 2 · 同一件事，两种写法` },
        { t: `code`, lang: `c++`, code: `// 写法 A：套娃 —— 进门之后按年龄分两拨
if (is_student) {
    if (age < 18) { std::println("未成年学生"); }
    else { std::println("成年学生"); }
} else { std::println("不是学生"); }

// 写法 B：扁平 && —— 只挑「未成年学生」这一群
if (is_student && (age < 18)) { std::println("未成年学生"); }

// 写法 C：链 —— 三个末端全用 && 写全
if (is_student && (age < 18))    { std::println("未成年学生"); }
else if (is_student && (age >= 18)) { std::println("成年学生"); }
else                              { std::println("不是学生"); }` },
        { t: `p`, text: `三种都能跑，区别在**你脑子里那棵树长什么样**。要三个结局，A 最贴合，而且 is_student 只写一遍；只要一个结局，B 最短，套娃反而多一层；C 看着工整，但前提 is_student 被抄了两遍 —— 手改的时候漏掉一处，逻辑立刻自相矛盾。这个「同一个前提抄两处」的毛病，就是嵌套和扁平最典型的分水岭。（B 和 C 里那个多余的小括号只是把第二个条件圈清楚，不加也完全一样。）` },
        { t: `h2`, text: `演示 3 · 第三道门：在未成年学生里再挑学霸` },
        { t: `code`, lang: `c++`, code: `char grade = 'A';
if (is_student) {
    if (age < 18) {
        std::println("未成年学生");
        if (grade == 'A') {                    // 第三道门，套在第二道里面
            std::println("还是学霸");
        }
    } else {
        std::println("成年学生");
    }
} else {
    std::println("不是学生");
}` },
        { t: `p`, text: `这是任务 2 的成品：三层门，输出两行 —— 「未成年学生」和「还是学霸」。三层以后每加一层，你要验的组合就多一倍（这里已经有 2×2×2 八种），所以每次加门都记得把表跑满，别只试自己那一种。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `缩进骗人：if (a) if (b) std::println("甲"); std::println("乙"); —— 看着甲乙都在 b 里面，其实只有甲归 b 管，乙是 main 里的无条件语句。根因还是那条：if 只管紧跟它的一条语句，缩进不算数。`,
          `else 认领了错误的 if（悬挂 else）。规则是 else 跟**最近那个还没配对**的 if，不是跟缩进对齐的那个。长相：外层加了个 if，兜底那段悄悄被内层抢走。唯一的解药就是老老实实写花括号，让 else 紧跟在哪一层写得明明白白。`,
          `该用 && 的地方硬套娃，或者该分流的地方硬写一串 &&。判断标准回到那句口诀：进了门还要按下一个条件走不同路，才套；只是给同一个结果多加限定，就 &&。`,
          `内层忘了兜底：外层问「是学生吗」，内层只写 if (age < 18) 不写 else，成年学生就悄悄什么也不打。层数越多越容易漏，逐层检查每个 if 有没有配 else。`,
          `拿 == 比字符时忘了单引号：if (grade = "A") 或 if (grade == "A")。前者是赋值，永远为真；后者是字符对上字符串，类型对不上直接编译报错。char 一律单引号。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把 age 改成 20、is_student 改成 false，各输出什么`,
          `在"未成年学生"分支里再加一道门：如果 grade 是 'A' 多打印一行"还是学霸"（需要先声明 char grade = 'A';）`,
          `延伸：把演示 1 改写成 && 的扁平版（只输出「未成年学生」），再数一数你的版本里 is_student 被写了几遍`,
          `延伸：把三层门那张 8 种组合的表填满并逐条跑一遍，看看有没有哪种组合同时打出两行互相矛盾的话`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：花括号里能再放 if，门里开门就是套娃；内层能被执行到就说明外层的前提已经成立，所以不必重复写条件 —— 但缩进不作数，每一层都把花括号写全。` }
      ]
    },
    {
      /* break 作为「循环里跳出」是第 38 课的内容，但它是 switch 语法的组成部分：
         第 30 课不写 break 就等于教一个必然出 bug 的结构。正文里已当场讲清两种用法的区别，
         所以按规矩在章对象上点名（cpp-audit 的 allowConstructs）。 */
      allowConstructs: [`break`],
      id: `c30`, title: `第 30 课 · switch 点菜单：一个值对上一排号码牌`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会用 switch / case / break / default 处理「同一个变量对比好几个固定值」的分支，并且亲眼看懂穿透（fallthrough）到底是机制还是 bug。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课的链写熟了会察觉一处累：判断 choice 等于 1、等于 2、等于 3，每行都得把**同一个变量名重写一遍**。变量只有一个、候选值却排成一排时，这种重复纯属体力活；而且这些条件全是「等于某个**具体值**」，用不到 else if 那种任意条件的自由度 —— 于是 C++ 给了一个更窄也更合适的结构：**switch**。` },
        { t: `p`, text: `把它读成**点菜**最贴切：switch 括号里那个值是「你报的号」，往下每一张 **case 就是挂在墙上的号码牌**。程序做的事是：拿你报的号去对牌，**对上就跳到那张牌底下开始执行**，对不上的牌直接跳过 —— 这不是「从上往下挨个问」（那是 else if 的脾气），是**一次跳转**。所有牌都不匹配就走 **default**（没挂 default 就整块什么都不做）。` },
        { t: `p`, text: `关键在 **break**。case 那张牌**只是个停车位置，不是围栏**：跳进来以后执行流一行一行往下走，走完这张牌底下的语句，它会**继续走进下一张牌的地盘** —— 除非半路撞到 break。**break 的意思就是「我从这块 switch 里离场」**（以后在循环里见到的那个 break 是同一个关键字，管的都是立刻跳出当前这一块）。忘写 break 不报错，只会让你的分支顺手把后面几档也做了：这行为正式名字叫**穿透**（fallthrough）。` },
        { t: `ul`, items: [
          `**匹配靠跳，不靠挨个问**：值对上哪张牌，就从哪儿进场；牌与牌之间的上下位置只决定「穿透时会经过谁」。`,
          `**执行到 break 或整块结束才停**：没有 break 的分支会顺路把后面分支的语句也执行掉。`,
          `**default 是兜底牌**：可有可无，位置可以放最后（惯例）也可以放最前，语义不变；它同样需要 break。`,
          `**穿透是特性不是漏洞**：连着摆几张牌、底下只写一句（case 1: case 2: 一起办）靠的就是它；真要靠穿透时写句注释，别人才分得清你是故意的。`
        ]},
        { t: `svg`, caption: `报的号是 2：直接跳到 ② 那张牌；写了 break 就离场，没写就顺着滑进 ③`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 268">
  <rect x="14" y="96" width="150" height="52" rx="10" fill="#00599c"/>
  <text x="89" y="118" font-size="13" font-weight="700" fill="#ffffff" text-anchor="middle">switch (choice)</text>
  <text x="89" y="136" font-size="12" fill="#cfe0f2" text-anchor="middle">choice = 2</text>
  <path d="M164 122 H200 V78 H236" stroke="#1f7a3d" stroke-width="2.5" fill="none"/>
  <polygon points="236,78 226,73 226,83" fill="#1f7a3d"/>
  <text x="150" y="60" font-size="12" font-weight="700" fill="#1f7a3d">对上号，一步跳进来</text>
  <rect x="240" y="18" width="96" height="34" rx="8" fill="#f4f7fc" stroke="#57677c" stroke-width="1.5"/>
  <text x="288" y="40" font-size="13" fill="#57677c" text-anchor="middle">case 1:</text>
  <rect x="240" y="60" width="96" height="34" rx="8" fill="#e6f6ea" stroke="#1f7a3d" stroke-width="2"/>
  <text x="288" y="82" font-size="13" font-weight="700" fill="#142639" text-anchor="middle">case 2:</text>
  <rect x="240" y="102" width="96" height="34" rx="8" fill="#f4f7fc" stroke="#57677c" stroke-width="1.5"/>
  <text x="288" y="124" font-size="13" fill="#57677c" text-anchor="middle">case 3:</text>
  <rect x="240" y="144" width="96" height="34" rx="8" fill="#fff6e0" stroke="#a26a00" stroke-width="1.5"/>
  <text x="288" y="166" font-size="13" fill="#a26a00" text-anchor="middle">default:</text>
  <text x="356" y="38" font-size="12" fill="#57677c">牌只是停车位置，不是围栏</text>
  <text x="356" y="80" font-size="12" fill="#1f7a3d">打印「你选了 C++」，然后 break —— 离场</text>
  <text x="356" y="122" font-size="12" fill="#57677c">打印「你选了数学」，然后 break</text>
  <text x="356" y="164" font-size="12" fill="#a26a00">前面的牌全不匹配才走这张</text>
  <path d="M310 94 V99" stroke="#b8232f" stroke-width="2"/><polygon points="310,99 305,91 315,91" fill="#b8232f"/>
  <path d="M310 94 C310 108 300 108 300 118" stroke="#b8232f" stroke-width="2.5" fill="none" stroke-dasharray="6 4"/>
  <polygon points="300,118 295,109 305,110" fill="#b8232f"/>
  <text x="356" y="200" font-size="12" font-weight="700" fill="#b8232f">漏掉 break：办完 ② 不收工，接着往下办 ③ —— 这就是穿透</text>
  <path d="M40 160 V228 H120" stroke="#57677c" stroke-width="2" fill="none" stroke-dasharray="5 5"/>
  <text x="46" y="248" font-size="12" fill="#57677c">break 之后：整块 switch 结束，继续走后面的代码</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `switch 有一道硬门槛：**括号里的值必须是整数或字符那一类**（int、char、bool 都行，double 不行），而每张 **case 牌上必须是编译期就能定下来的常量** —— 数字、字符，不能是变量、区间、字符串。写 case 1..5: 编译器直接报错，大意是 case 标签不是整数常量表达式；case x:（x 是变量）同样不收。` },
        { t: `p`, text: `为什么这么严？因为 switch 的「一步跳进来」是靠编译器**提前把号码牌排成一张跳转表**实现的：它得在编译时就确切知道一共有哪些号、每个号对应哪段代码，运行时才能拿你的值直接算出入口。要是牌面上允许写区间、写变量、写小数，这张表当场就排不出来。所以这不是故意刁难，而是**用表达力换速度和清晰**：只要你的分支本质是「一个离散值对应一串动作」，switch 就比一列 else if 更贴近意图。反过来，判断的是**区间**（分数分档）或者**多个变量混合**，就还得回第 28 课那条链 —— 口诀一句：**数得清的号用 switch，量得出的范围用 else if。**` },
        { t: `h2`, text: `演示 1 · 三张号码牌` },
        { t: `code`, lang: `c++`, code: `#include <print>

int main() {
    int choice = 2;
    switch (choice) {
        case 1:
            std::println("你选了 Python"); break;     // 打印 + break 挤在一行，省版面
        case 2:
            std::println("你选了 C++"); break;
        default:                                      // 谁都不匹配时的兜底牌
            std::println("没有这个选项"); break;
    }
    return 0;
}` },
        { t: `p`, text: `choice 是 2，输出只有一行「你选了 C++」。程序没问过 case 1 那张牌，它是**跳着进的**；办完立刻 break 离场，default 碰都不碰。这里把打印和 break 挤成一行是省版面，你一行一句也完全一样，但**两样都得有**：只写打印不写 break，就是这个结构的头号 bug。` },
        { t: `h2`, text: `演示 2 · 把 break 注释掉，看穿透现场` },
        { t: `code`, lang: `c++`, code: `// 接在上面那段里：choice 仍是 2，现在多挂一张 case 3
case 2:
    std::println("你选了 C++");
    // break;                          ← 注释掉它
case 3:
    std::println("你选了数学");
    break;
default:
    std::println("没有这个选项");
    break;

// 输出两行：
// 你选了 C++
// 你选了数学` },
        { t: `p`, text: `这就是任务 1 要你亲手制造的事故。看清一点：case 3 那张牌**根本没被对号**（choice 是 2），它却被执行了 —— 执行流办完 ② 没离场，顺着滑进 ③ 的地盘继续念稿。default 同理：只要前面某张牌漏了 break，它也会被顺路执行。这个「往下滑」是 C++ 有意留的口子，不是编译器坏了。` },
        { t: `h2`, text: `演示 3 · 故意的穿透：几张牌共用一句话` },
        { t: `code`, lang: `c++`, code: `int day = 6;
switch (day) {
    case 1: case 2: case 3: case 4: case 5:      // 五张牌底下不写语句，直接滑到下一张
        std::println("工作日");
        break;
    case 6: case 7:
        std::println("周末");
        break;
    default:                                     // 兜底牌也别忘了 break
        std::println("这个日子不存在");
        break;
}
// day = 6 → 从 case 6 进场，打印「周末」，break 离场` },
        { t: `p`, text: `同一句话要在好几个值上都执行，用 else if 就得写成 day == 1 或者 day == 2 一路串下去；switch 只要把牌并排挂上去，读起来跟菜单一样整齐。**规矩**：牌底下故意留空、让它滑下去，是清楚的写法；牌底下写了语句却忘了 break 而滑下去，就是 bug —— 这两种情况你得每天分得清。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `忘写 break，穿透到下一档。长相：不报错不警告，输出比预期多几行，而多出来的正是你没选的选项。最省事的做法：每张牌底下先把 break 写满，要穿透再删。`,
          `拿 switch 写区间：case score >= 90: 或者 case 1..5:。编译器报 case 标签不是整数常量表达式一类的错。区间是 else if 的活，号才是 switch 的活。`,
          `用 double 当开关值：switch (money) 报错，大意是 switch 的表达式不是整数类型。字符串也不能当开关值，靠名字选菜就还得用 else if 链（第 19 课那套字符串比较）。`,
          `在 case 底下直接声明变量：编译器报「跳转跨越了初始化」那类错 —— 别的分支会跳进这块却绕过那句，n 的存在没法交代。解法：牌底下的代码用一对花括号圈起来。`,
          `漏了 default，非法输入静悄悄什么都不做，你以为程序卡住了。加一张 default 把没对上的号念出来，问题就摆在屏幕上；default 也能写在最前面，但习惯放末尾，一眼扫完号码牌。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把 case 2 里的 break 注释掉再运行，亲眼看"穿透"现场`,
          `加一个 case 3，打印"你选了数学"`,
          `延伸：把 choice 换成 5（一张牌都没挂的号），看 default 有没有接住；再把 default 那行 break 也注释掉，输出会变吗？想清楚理由再动手`,
          `延伸：用 switch 写一个「按 1 查余额、按 2 转账、按 3 退出、其他号码提示无效」的小菜单；三张牌都写全 break，最后补 default`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：switch 是点菜报号 —— case 是号码牌、匹配靠跳转、break 是办完离场；牌底下没有围栏，忘写 break 就会穿透，这是机制也是最常见的那个 bug。` }
      ]
    }
  ]
};
