/* 喵站 · C++ 入门 正文分部 p04：第 16–20 课（第九轮）
 *
 * 源稿：学习资料/C++入门/16_截取一段substr.cpp ~ 20_从键盘读数.cpp。六栏课式照 p01/p02：
 *   tip(蓝·本课目标) → 原理讲解 → 它被设计成什么样/怎么做 → 演示 N → 常见坑 → 任务 → tip(绿·本课一句话)
 *
 * 本分部守的几条：
 *   1. 字符串全用反引号做分隔符，正文、标题、代码里不出现反引号；标代码名裸写或用「」。
 *   2. 交叉引用只往回指（第 N 课的 N ≤ 本课课号），往后的改用「以后再讲」。
 *   3. 代码块只用本课及以前教过的构造。第 19 课整章就在讲比较，比较运算符的正经教学课号是 22，
 *      所以 c19 点名 allowConstructs: ["cmp"]；cin 教在第 20 课，正好是它自己的课。
 *   4. 源稿每条【任务】原样进【任务】栏，考卷里每条都有题用 coversTask 对着。
 *   5. 第 17 课源稿任务 2 要 if，if 教在第 27 课，正文里只留「以后再讲」，代码块不出现 if。
 *
 * 验收：node dev/tools/cpp-audit.cjs --part dev/frontend/assets/data/cpp/p04.js
 *       node dev/tools/cpp-exam-check.cjs --only c16,c17,c18,c19,c20
 */
window.MIAO_CPP_P04 = {
  chapters: [
    {
      id: `c16`, title: `第 16 课 · substr：一把剪刀加一把尺子`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会用 substr(起点, 长度) 从一串文字里剪出自家需要的那一段，并且说清它剪出来的是「复印件」而不是「剪完剩下的原串」—— 顺带搞懂为什么剪过头了编译器一声不吭。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 15 课你学会按门牌号取**一个**字符：s[5] 只给你一格。可现实里我们要的往往是**一段**：身份证号里的出生年月、文件名里的后缀、订单号里的日期。一格一格地取再拼起来当然可以，但太笨。C++ 给这件事准备了一把现成的剪刀：**substr**，名字就是 sub-string（子串）的缩写，一个字符串里被截出来的那一小段。` },
        { t: `p`, text: `它的用法可以背成一句话：**「从几号门牌开始剪，剪多长」**。id.substr(5, 4) 的意思是「从 5 号格起，往后拿 4 格」。两个数字都从 0 数 —— 这一点是第 15 课那条老规矩的延续，也是初学阶段最容易算错的地方：脑子里想的是「第 6 个字符」，手上要写的是 5。第二个数字是**长度**，不是结束位置，这是全课最大的坑：substr(0, 4) 剪的是 0、1、2、3 四格，不是剪到 4 号为止。想要「从 0 号到 4 号」那一段，长度得写 5。` },
        { t: `p`, text: `还有一件事必须现在就分清楚：**substr 不碰原来那串字**。它剪出一段新的、复印出来交给你的字符串，原件完好如初。这跟很多人对「剪切」这个词的直觉正相反 —— 编辑器里的剪切是把东西搬走，这里的剪切是拿复印件。所以「剪完再打印 id」你会看到 id 一个字没少；想要那个剪下来的片段，必须把它接住：用一个 string 变量装，或者直接当值用。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `code`, lang: `text`, code: `id.substr( 起点 , 长度 )
  │    │    │      │
  │    │    │      └── 拿几格（不是「停在哪一格」）
  │    │    └───────── 从几号门牌开始（从 0 数）
  │    └────────────── 剪刀：属于 id 这个字符串的动作
  └─────────────────── 原件：它自己一个字都不会变

返回：一个新的 std::string（复印件）` },
        { t: `p`, text: `图里「属于 id 的动作」这一行值得多说两句。第 13 课起你见过 length() 那种写法：**一个数据后面加点、再点一个动词**，读法就是「问这个字符串办一件事」。substr 走的是同一个通道 —— 它不是「谁都能调的函数」，而是「某个 string 自己的本事」，所以必须先有主语（id），才有 id.substr(...)。你写成光秃秃的 substr(0, 4)，编译器会瞪着你：这个标识符我没见过。` },
        { t: `svg`, caption: `下标窗口：substr(5, 4) 从 5 号格起，往后罩住 4 格`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250">
  <text x="20" y="28" font-size="14" font-weight="700" fill="#142639">std::string id = "2026-0315";</text>
  <g font-size="15" fill="#142639" text-anchor="middle">
    <rect x="20" y="52" width="60" height="46" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="50" y="82">2</text>
    <rect x="80" y="52" width="60" height="46" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="110" y="82">0</text>
    <rect x="140" y="52" width="60" height="46" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="170" y="82">2</text>
    <rect x="200" y="52" width="60" height="46" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="230" y="82">6</text>
    <rect x="260" y="52" width="60" height="46" fill="#f6e7d8" stroke="#b8722b" stroke-width="2"/><text x="290" y="82">-</text>
    <rect x="320" y="52" width="60" height="46" fill="#dff0e2" stroke="#1a7f42" stroke-width="3"/><text x="350" y="82">0</text>
    <rect x="380" y="52" width="60" height="46" fill="#dff0e2" stroke="#1a7f42" stroke-width="3"/><text x="410" y="82">3</text>
    <rect x="440" y="52" width="60" height="60" fill="#dff0e2" stroke="#1a7f42" stroke-width="3" transform="translate(0,-7)"/><text x="470" y="82">1</text>
    <rect x="500" y="52" width="60" height="46" fill="#dff0e2" stroke="#1a7f42" stroke-width="3"/><text x="530" y="82">5</text>
  </g>
  <g font-size="12" fill="#57677c" text-anchor="middle">
    <text x="50" y="118">0</text><text x="110" y="118">1</text><text x="170" y="118">2</text><text x="230" y="118">3</text>
    <text x="290" y="118">4</text><text x="350" y="118">5</text><text x="410" y="118">6</text><text x="470" y="118">7</text><text x="530" y="118">8</text>
  </g>
  <path d="M320 140 H530" stroke="#1a7f42" stroke-width="2.5"/>
  <path d="M320 133 V147 M530 133 V147" stroke="#1a7f42" stroke-width="2.5"/>
  <text x="425" y="164" font-size="13" font-weight="700" fill="#1a7f42" text-anchor="middle">长度 4：占 5、6、7、8 格</text>
  <text x="350" y="192" font-size="13" fill="#142639" text-anchor="middle">起点 = 5</text>
  <path d="M350 198 V212" stroke="#b8722b" stroke-width="2" stroke-dasharray="4 3"/>
  <text x="360" y="232" font-size="14" font-weight="700" fill="#142639">id.substr(5, 4) 得到 "0315"，而 id 自己仍是 "2026-0315"</text>
</svg>` },
        { t: `h2`, text: `演示 1 · 一个订单号拆两半` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>

int main() {
    std::string id = "2026-0315";

    std::println("年份 = {}", id.substr(0, 4));   // 从 0 号起取 4 个
    std::println("序号 = {}", id.substr(5, 4));   // 从 5 号起取 4 个

    return 0;
}` },
        { t: `p`, text: `跑出来是「年份 = 2026」「序号 = 0315」，中间那个 4 号格的横杠谁也没碰 —— 因为两段都刚好绕开它。你看第一个调用 substr(0, 4)：起点 0 意味着「从头一格不落地拿」，长度 4 意味着「拿四格就走」，所以拿的是 0、1、2、3。要是你顺手写成 substr(0, 5)，就会把横杠一起剪进去，得到 2026-。这种「差一格」的错在 substr 上特别常见，因为**它不报错**：剪错是内容错，编译器管不着。` },
        { t: `h2`, text: `演示 2 · 只给起点：一路剪到结尾` },
        { t: `code`, lang: `c++`, code: `std::string id = "2026-0315";

std::string tail = id.substr(5);      // 只给起点：取到结尾
std::println("tail = {}", tail);      // 0315` },
        { t: `p`, text: `第二个参数可以省掉，省掉的意思就是「后面全都要」。这个版本在真活儿里比带长度的还好用：你往往只知道「前面那段有多长」，剩下的不管几个字符统统要 —— 比如从路径里去掉目录名、从编号里去掉前缀。注意这里我把结果**接进了一个叫 tail 的变量**，原因前面说过：substr 交的是复印件，你不去接它，它就原地被扔掉。` },
        { t: `h2`, text: `演示 3 · 剪过头了：不报错，只是自动收住` },
        { t: `code`, lang: `c++`, code: `std::string id = "2026-0315";      // 总共 9 格

std::println("{}", id.length());            // 9：先量一下原件多长
std::println("{}", id.substr(5, 100));      // 0315：想要 100 个，只剩 4 个
std::println("{}", id.substr(0, 100));      // 2026-0315：整串复印一遍` },
        { t: `p`, text: `这一段的重点是**它什么事都没有**。你要求 100 个字符，串里只剩 4 个，substr 就把能给的都给你，安静地剪到结尾为止。设计上的理由是「宁可给你少一点，也别在你的程序里炸一颗雷」；副作用是**你把长度写错也不会被发现** —— 于是很多人把 substr(0, 4) 一路写成 substr(0, 40)，程序照样跑，输出照样对，直到某天换了一条更短的编号才露馅。真要稳妥，就多用「起点 + 省略长度」或者拿第 15 课那个 s[起点] 先确认边界，别靠记忆里的长度。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把第二个数字当成「结束位置」。substr(0, 4) 不是「第 0 格到第 4 格」，是「从 0 起 4 格」，拿到的是 2026 而不是 2026-。想覆盖到 4 号格，长度写 5。`,
          `以为原串被剪短了。substr 交的是复印件，id 一个字符都不会少；结果没接住就等于白算一遍。要留就 std::string 变量接住，不留就直接当值打印。`,
          `起点写成 1 表示第一个字符。门牌号从 0 数，这是第 15 课的老规矩，substr 完全沿用。差一格的 bug 有一半是这么来的。`,
          `起点真的越界了 —— 比如 9 个字符的串写 substr(20)。这时候**是会出事**的，程序当场终止，报错里那句 basically 大意是「string::substr 的 pos 超出范围」。长度越界不管，起点越界很严重，这两件事别混。`,
          `拿 substr 的结果去跟长度做加减算下一个起点，公式在纸上行、换个串就崩。起点尽量来自「我确知的位置」：常量、find 的返回值（下一课正好讲它）。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `取出 id 中间那个「-」（起点该填几？）`,
          `把 substr(0, 4) 改成 substr(0, 100) 运行 —— 不会报错，长度超出时自动取到结尾为止`,
          `延伸：把「2026-0315」拆成三段（年、横杠、序号）各打印一行，其中横杠那段用 substr(起点, 1) 取，验证你数的门牌号对不对。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：substr(起点, 长度) = 从几号门牌剪、剪多长，都从 0 数；它交复印件不动原件，长度剪过头会自动收住，起点剪过头才真出事。` }
      ]
    },
    {
      id: `c17`, title: `第 17 课 · find：它在哪一格（找不到就给你一张空条）`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会用 find 问一个字符串「你要找的那段文字从第几格开始」，并且把「找不到」这件事从一个巨大数字里读出来 —— 那个数字有个专名，string::npos，它是本课真正要记住的东西。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课剪字符串，起点得你自己数门牌。可很多串的「第几格」根本数不出来：一段用户填的地址、一行日志、一个文件名，你要的是「横杠在哪儿」「点号在哪儿」「有没有 http 这几个字」。**find 就是替你去数的**：把要找的那段文字交给它，它从头往后一格一格对，对上了就把**那一格的编号**报回来。` },
        { t: `p`, text: `所以 find 的返回值是一个**位置**，不是内容，也不是「有没有」的真假。text.find("C++") 得 7，意思是「从 7 号格开始的那三格正好是 C++」。想知道内容还是得回去剪 —— 这正是 find 和 substr 天生一对的原因：find 告诉你从哪儿下剪刀，substr 负责剪。` },
        { t: `p`, text: `现在说最要紧的：**找不到怎么办**。C++ 没有让程序崩，没有抛异常，也没有返回一个看着像 0 的小数字，它返回一个**大到离谱的数字**，并且给这个值起了个专名：**string::npos**（npos = no position，「没有位置」）。为什么要用巨大数字而不是 -1？因为位置的编号是「只准往大数、不准往小数」的那一类整数，你硬要塞一个 -1 进去，它会立刻变成这一类数的最大值 —— 于是「没找到」在屏幕上的长相就是一串几十位的数字，比如 18446744073709551615。这不是坑你的怪事，而是一条**信号**：看到这么长一串，就等于听到「查无此条」。` },
        { t: `p`, text: `打个比方：你去图书馆问一本书在几号书架，前台的人翻完目录抬头说「没有这本书」。他不会给你编一个「负一号书架」，也不会因为找不到就当场晕倒，他只是在申请单上盖一个「无记录」章。npos 就是那个章。你的活儿是**认得这个章**，别把它的数字当成一个真的书架号拿去用 —— 那才是 find 最贵的错。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `code`, lang: `text`, code: `编号 = text.find("要找的那段")
  │       │    │
  │       │    └── 要找的东西：一段文字（双引号）或一个字符（单引号）
 │       └──────── 主语：在哪个串里找
  └─────────────── 回来的是「起点门牌号」，不是内容，也不是真假

对不上时：编号 = std::string::npos（一串极大的数字）
只找最靠前的那一处；第二处开始在哪，要再问一次` },
        { t: `p`, text: `最后那行容易忽略：**find 只报第一次出现**。在 "banana" 里找 "na"，它给你 2 而不是 4，因为 2 号格那次更靠前。想找后面的出现，find 还留了第二个参数（从几号格开始找），比如 text.find("a", 3) 表示「3 号格往后再说」，这个用法等你要在一段文字里反复找同类东西时才会真用上。` },
        { t: `svg`, caption: `find 的两个出口：对上给起点编号，对不上给 npos`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 270">
  <text x="20" y="26" font-size="14" font-weight="700" fill="#142639">std::string text = "I love C++";</text>
  <g font-size="15" fill="#142639" text-anchor="middle">
    <rect x="20" y="46" width="46" height="42" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="43" y="72">I</text>
    <rect x="66" y="46" width="46" height="42" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="89" y="72">空</text>
    <rect x="112" y="46" width="46" height="42" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="135" y="72">l</text>
    <rect x="158" y="46" width="46" height="42" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="181" y="72">o</text>
    <rect x="204" y="46" width="46" height="42" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="227" y="72">v</text>
    <rect x="250" y="46" width="46" height="42" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="273" y="72">e</text>
    <rect x="296" y="46" width="46" height="42" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="319" y="72">空</text>
    <rect x="342" y="46" width="46" height="42" fill="#dff0e2" stroke="#1a7f42" stroke-width="3"/><text x="365" y="72">C</text>
    <rect x="388" y="46" width="46" height="42" fill="#dff0e2" stroke="#1a7f42" stroke-width="3"/><text x="411" y="72">+</text>
    <rect x="434" y="46" width="46" height="42" fill="#dff0e2" stroke="#1a7f42" stroke-width="3"/><text x="457" y="72">+</text>
  </g>
  <g font-size="12" fill="#57677c" text-anchor="middle">
    <text x="43" y="106">0</text><text x="89" y="106">1</text><text x="135" y="106">2</text><text x="181" y="106">3</text>
    <text x="227" y="106">4</text><text x="273" y="106">5</text><text x="319" y="106">6</text><text x="365" y="106">7</text><text x="411" y="106">8</text><text x="457" y="106">9</text>
  </g>
  <path d="M342 126 H457" stroke="#1a7f42" stroke-width="2.5"/>
  <path d="M342 120 V132 M457 120 V132" stroke="#1a7f42" stroke-width="2.5"/>
  <text x="400" y="152" font-size="13" font-weight="700" fill="#1a7f42" text-anchor="middle">find("C++") 得 7 —— 报的是起点</text>
  <rect x="20" y="180" width="290" height="70" rx="10" fill="#f6e7d8" stroke="#b8722b" stroke-width="2"/>
  <text x="165" y="206" font-size="13" font-weight="700" fill="#8a4f16" text-anchor="middle">find("java") 呢？</text>
  <text x="165" y="232" font-size="13" fill="#8a4f16" text-anchor="middle">一格也对不上，回 std::string::npos</text>
  <text x="340" y="206" font-size="13" fill="#142639">打印出来像这样（一串极长的数字）：</text>
  <text x="340" y="230" font-size="14" font-weight="700" fill="#b8722b">18446744073709551615</text>
</svg>` },
        { t: `h2`, text: `演示 1 · 找到与找不到，摆在一起看` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>

int main() {
    std::string text = "I love C++";

    std::println("找 \"C++\" : {}", text.find("C++"));   // 7，门牌号
    std::println("找 \"java\": {}", text.find("java"));  // 巨大数 = 没找到

    std::println("npos 本尊 = {}", std::string::npos);   // 对照看

    return 0;
}` },
        { t: `p`, text: `三行输出连起来读才是本课的完整句子：第一行 7，是「C」那格的编号（I 占 0、空格占 1、love 占 2 到 5、又一个空格占 6，所以 C 在 7）。第二行那串长数字，就是第三行**亲手打印出来的 npos** —— 两行一模一样的时候，你就再也不会被它唬住了。这个「把标尺单独打出来对照」的习惯值得留着：以后凡是遇到「返回一个特殊数字表示没有」的接口，先把它本尊打出来看一眼，比背文档靠谱。` },
        { t: `h2`, text: `演示 2 · 找到之后接 substr` },
        { t: `code`, lang: `c++`, code: `std::string text = "I love C++";

auto pos = text.find("C++");        // 7：起点交给变量存着
std::println("起点 {}", pos);
std::println("剪出来 {}", text.substr(pos));      // 从起点一路到结尾` },
        { t: `p`, text: `这里我把上一课和这一课**接上了**：find 报位置，substr 用位置。注意 substr 我故意省掉第二个参数 —— 因为你手里只有起点，硬要算长度的话就得再知道「要找的那段有几个字符」，那是给自己找麻烦。写 substr(pos) 表示「从它开始往后全都要」，在很多场合（去掉前缀、取后缀）正是你要的。` },
        { t: `h2`, text: `演示 3 · 只报最靠前那一处` },
        { t: `code`, lang: `c++`, code: `std::string word = "banana";

std::println("{}", word.find("a"));        // 1：第一个 a 就赢了
std::println("{}", word.find("na"));       // 2：不是 4
std::println("{}", word.find("na", 3));    // 4：从 3 号格往后才找` },
        { t: `p`, text: `banana 里 a 出现在 1、3、5，find("a") 只给你 1；"na" 出现在 2 和 4，find("na") 只给你 2。第三行用上了第二个参数：**从 3 号格开始往后找**，于是绕过前面那一处，拿到 4。三行合起来的说法就是「find 只管眼前最近的一处，你要往后的自己说清楚从哪儿开始」。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `找不到就以为会报错或返回 -1。它谁也不得罪，安静地回一个 npos。你要是把这个数字当成起点接着喂 substr，程序当场终止 —— 报错大意是「substr 的 pos 超出范围」，看着像 substr 的错，根子在 find 没查脸色。`,
          `拿 find 的返回值当长度用。它是**起点**，剪的时候长度要另外定，或者干脆省掉长度参数（substr(pos) 一路到结尾）。`,
          `记不住那个名字。写不出来时可以先用 text.find("java") 打一遍看看长相，但正式写法是 std::string::npos，一个字符都不能少；「npos」单独当普通变量使是不存在的。`,
          `以为 find 会把所有出现都找出来。它只报最靠前的一处，循环往后找那种写法要等以后学会重复执行再说。`,
          `把要找的内容用单引号和双引号混着来。find("C++") 找一段文字，find('C') 找单个字符，两样都能用；但别把一段文字塞进单引号 —— 第 13 课那条「单引号只装一个字符」的老规矩在这儿一样生效。`,
          `想「找到就打印找到了，没找到就打印没找到」，这一句需要程序会做判断。判断不是本课的东西（源稿也把它标成预习），先把 npos 认熟，学过判断再回来补这一段。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `找 "love"：返回值是几？（数一数 l 是第几个门牌）`,
          `（预习）等后面学会判断那一课再回来：加个判断，找到就打印「找到了」，没找到就打印「没找到」`,
          `延伸：把 text 换成 "hello world"，分别找 "world"、"o"、"xyz" 三个，把三个返回值抄下来，指出哪一个是 npos，并解释 "o" 为什么只给你 4。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：find 报的是**起点门牌**，最靠前那一处；对不上就给你 std::string::npos 那张「查无此条」的空条 —— 认得这串巨大数字，才算真的会用 find。` }
      ]
    },
    {
      id: `c18`, title: `第 18 课 · replace / insert / erase：给字符串动三台手术`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会用 replace 换一段、insert 塞一段、erase 挖一段，并且牢牢记住它们跟上一课 substr 的**根本区别** —— 这三个是真动手术，动完原串就变了，而 substr 只是给你复印件。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `前三课你手里的工具都在「读」：s[i] 取一格、substr 剪一段、find 问一个位置，原串始终没被碰过。今天这三件是「写」：**replace 换掉一段、insert 插入一段、erase 删掉一段**。它们的共同性格是**动完它本身就变了** —— 不需要拿变量去接结果，手术刀落下去，串自己就改了模样。这一字之差是本课全部内容的地基，也是从这三课的作业里最常翻车的地方：很多人写完 s.replace(7, 4, "C++") 之后再去打印 substr 的结果，一脸茫然。` },
        { t: `p`, text: `好消息是**位置的说法完全沿用上一课**：replace(起点, 长度, 新内容) 里的两个数字还是「从几号门牌开始、动几格」，还是从 0 数。erase(起点, 长度) 少一个参数，挖掉就完事，不补东西。insert(起点, 新内容) 只有起点没有长度 —— 因为它不占地盘，它是在那一格**前面**塞进去，原来那格和它后面的统统往后挪。` },
        { t: `p`, text: `为什么要把这三件事做成「原地改」，而不是像 substr 那样交复印件？因为字符串的长度是**自己管自己**的（第 13 课说过它跟 int 不一样，不是固定几个字节；第 14 课你见过它接上一个串就变长）。既然它本来就能变长，那变短、中间换一段也是同一套本事，不用另立门户。这一点带来的**副作用才是重点**：改完之后，你脑子里那套门牌号全部要重算。"I love math" 里 math 在 7 号格，replace 成 "C++" 之后串短了一格，再往后插个 "modern "，7 号格上就换人了。**每动一次，重新数一次**，这是三台手术唯一的安全守则。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `code`, lang: `text`, code: `s.replace(起点, 长度, 新内容)   挖掉这一段，补新的进去
s.insert(起点, 新内容)        在这一格之前塞进去，原样的往后挪
s.erase(起点, 长度)           挖掉这一段，不补

三样都是：起点从 0 数，长度是「动几格」不是「停在哪格」
改完的是 s 自己 —— 不用变量接，接了也只是把同一个它再接一遍` },
        { t: `p`, text: `顺带一提，这三件工具动完手术还会顺手把改好的串再交回你一次，所以你能看到有人连着写两行不重提 s 的名字。那种连写看着潇洒，但**读的人得自己数它到底改了几处**，入门阶段建议老老实实一行一个动作，后面紧跟一行打印，眼睛盯着结果走 —— 反正调试期你最缺的就是「它现在到底长什么样」。` },
        { t: `svg`, caption: `三台手术的前后对比：每动一次，门牌号就得重数一遍`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300">
  <text x="20" y="26" font-size="14" font-weight="700" fill="#142639">std::string s = "I love math";   格子编号：0 1 2 ... 10</text>
  <rect x="20" y="40" width="300" height="34" rx="6" fill="#f6f2ea" stroke="#57677c" stroke-width="2"/>
  <text x="34" y="63" font-size="14" fill="#142639">I | ␣ | l o v e | ␣ | m a t h</text>
  <text x="345" y="63" font-size="13" fill="#57677c">math 从 7 号起，共 4 格</text>
  <path d="M320 60 H358" stroke="#b8722b" stroke-width="2"/>
  <text x="30" y="94" font-size="13" font-weight="700" fill="#1a7f42">s.replace(7, 4, "C++")</text>
  <rect x="20" y="102" width="270" height="34" rx="6" fill="#dff0e2" stroke="#1a7f42" stroke-width="2"/>
  <text x="34" y="125" font-size="14" fill="#142639">I | ␣ | l o v e | ␣ | C + +</text>
  <text x="315" y="125" font-size="13" fill="#1a7f42">s 自己变了，短了一格</text>
  <text x="30" y="160" font-size="13" font-weight="700" fill="#00599c">s.insert(7, "modern ")</text>
  <rect x="20" y="168" width="380" height="34" rx="6" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/>
  <text x="34" y="191" font-size="14" fill="#142639">I | ␣ | l o v e | ␣ | m o d e r n ␣ | C + +</text>
  <text x="415" y="191" font-size="13" fill="#00599c">7 号格前塞进去，C++ 被推到 14</text>
  <text x="30" y="226" font-size="13" font-weight="700" fill="#b8722b">s.erase(7, 7)</text>
  <rect x="20" y="234" width="270" height="34" rx="6" fill="#f6e7d8" stroke="#b8722b" stroke-width="2"/>
  <text x="34" y="257" font-size="14" fill="#142639">I | ␣ | l o v e | ␣ | C + +</text>
  <text x="315" y="257" font-size="13" fill="#b8722b">从 7 号起挖掉 7 格，不补</text>
  <text x="20" y="288" font-size="13" fill="#57677c">结论：三次动作之后 s 仍是那个 s，只是里面换了三回内容</text>
</svg>` },
        { t: `h2`, text: `演示 1 · 三台手术连着做（源稿这段）` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>

int main() {
    std::string s = "I love math";
    s.replace(7, 4, "C++");              // 从 7 号起 4 个字符 "math" → "C++"
    std::println("replace 后: {}", s);    // I love C++
    s.insert(7, "modern ");              // 在 7 号前插入
    std::println("insert 后: {}", s);     // I love modern C++
    s.erase(7, 7);                       // 从 7 号起删 7 个 "modern "
    std::println("erase 后: {}", s);      // I love C++

    return 0;
}` },
        { t: `p`, text: `先数门牌：I 在 0、空格在 1、love 占 2 到 5、空格在 6、math 是 7 到 10。所以 replace(7, 4, "C++") 挖的正好是 math 那四格，补上三个字符的 C++，整串短了一格。紧接着 insert(7, "modern ") 又落在 7 号格**前面** —— 这时候 7 号格上站的已经是那个 C 了，插进去就把 C++ 整体往后推，得到 I love modern C++。最后 erase(7, 7) 删掉 "modern "（七个字符，含尾部那个空格），恰好退回上一台手术的样子。这段代码最好看的地方是**每一步都靠上一步的结果重新数**：7 这个数字被用了三次，含义却三次都不同。` },
        { t: `h2`, text: `演示 2 · 换个词，自己动手数` },
        { t: `code`, lang: `c++`, code: `std::string s = "I love math";

s.replace(2, 4, "hate");                 // love 从 2 号起，4 格
std::println("{}", s);                   // I hate math
std::println("长度 {}", s.length());      // 11：跟原来一样长，因为换的也是 4 个字符` },
        { t: `p`, text: `这一台手术换的是等长的词（love 四个字母、hate 也是四个），所以串总长没变，后面的门牌一个都不用重算 —— 这是最舒服的一种改法。要是你把 hate 换成 like（五个字母），后面的 math 就整体右移一格，再想动它就别沿用 2+4 算出来的 7 了。顺手用 length() 复核一下，比在脑子里数快得多也稳得多。` },
        { t: `h2`, text: `演示 3 · insert 想插到末尾` },
        { t: `code`, lang: `c++`, code: `std::string name = "Mika";

name.insert(0, "*");                     // 插在最前面：*Mika
name.insert(name.length(), "*");         // 起点给到「最后一格后面」：*Mika*
std::println("{}", name);
std::println("{}", name.substr(1, 4));    // Mika：复印件照旧，原串没被这次读动作影响` },
        { t: `p`, text: `「往末尾加」这个动作的起点不能写 4、5、6 里的哪一个很含糊，所以干脆写 name.length()：现在几个字符，就插在第几号格之前，也就是**排到队尾**。这样写还有个好处 —— 名字换成长短不一的别的串，这行照样对，不必重数。第二台手术前串的编号已经变了（原来是 0 到 4，现在 M 站在 1 号），这就是前面那句「动一次、重数一次」的现场版。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `拿 substr 的思路来做手术：std::string r = s.replace(2, 4, "hate"); 然后打印 s，发现 s 明明已经变了，以为自己写错了。这三个动作**改的就是 s 自己**，不需要接，也接不出「原样保留」的效果。`,
          `replace 的第二个数字当成终点。replace(7, 4, "C++") 动的是 7、8、9、10 四格；想动到 7 号为止只有一格，长度写 1。`,
          `动完一次继续沿用老的门牌号。插入会让后面全体右移、删除会让后面全体左移，换成更长的词也照样右移。报错不一定出现，多半只是**内容悄悄错了**，这种错最难查。`,
          `erase 的第二个参数省掉了还指望它只删一个字符。省略长度的意思是「删到结尾」，s.erase(2) 会把 love math 整个抹掉，只剩 "I "。要精确删一个字符就写 erase(起点, 1)。`,
          `起点给得比串还长。比如 11 个字符的串写 insert(30, "x")，程序当场终止，报错大意是「位置超出范围」。跟第 16 课一样：长度超了温柔，起点超了致命。`,
          `想「改而不留痕」，动完又想要原来那串。做法是先复印一份再动刀：std::string copy = s; 然后对 copy 做手术，s 就还是原样。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把 "I love math" 里的 love 换成 hate（先数出起点和长度）`,
          `用 insert 给自己的英文名前后各加一个星号 *`,
          `延伸：对同一个串先 erase 再 insert，把 "I love math" 直接改成 "I like C++"，动手前先把每一步改完应该长什么样写在纸上，跑完逐行对照。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：replace 换、insert 塞、erase 挖，起点照旧从 0 数、长度照旧是「动几格」，但三者改的都是原串 —— 每动一次，后面的门牌全部重算。` }
      ]
    },
    {
      id: `c19`, title: `第 19 课 · 字符串比大小：像查字典那样一格一格比编号`,
      // 本章整章讲比较，比较运算符的正经教学课号在后面，故在闸上点名例外（规矩第 5 条）。
      allowConstructs: [`cmp`],
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：知道字符串可以直接用 < 和 == 比，规则是**从前往后逐格比字符编号**（字典序），谁先分出大小谁就赢；并且记住那个反直觉的大坑 —— 大写字母的编号比小写字母小，所以 "Zoo" 竟然小于 "apple"。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `比数字你会：10 比 9 大，一眼看穿。比文字呢？两个名字谁「大」？这个问题在现实里没意义，但在程序里**极其有用**：排序要它、判重的依据要它、把一堆名字按前后排好也要它。C++ 给的答案是「别把文字当文字，把文字当成一串编号」。第 12 课学过 char 盒子装的其实是一个数字编号（'A' 就是 65 那格），第 13 课说过 string 就是这些格子的排队 —— 那么比两个字符串，顺理成章就变成**逐格比编号**。` },
        { t: `p`, text: `规则可以背成三句。**第一句：从第 0 格开始比，谁的编号小谁就小。** 两边一样，就一起往右移一格再比。**第二句：谁先比出胜负，胜负就归谁，后面的格子一律不看。** "abc" 和 "abd"，前两格一样，第三格 c(99) 小于 d(100)，所以 "abc" < "abd" 成立 —— 后面还有多少格都不管。**第三句：一路一样、但有一边先走到头，短的那个算小。** "abc" < "abcd"，就像词典里 app 排在 apple 前面。` },
        { t: `p`, text: `这就是所谓的**字典序**（lexicographical order）：跟英文词典排词的逻辑一模一样，只不过词典是按字母表顺序编号，程序按字符编号表顺序比。所以你直觉里「字典上谁在前」的结论，对纯小写英文串基本成立。` },
        { t: `p`, text: `坏消息藏在编号表里：**表上大写字母整段排在小写字母前面**（'A' 到 'Z' 是 65 到 90，'a' 到 'z' 是 97 到 122，中间还夹着别的字符）。于是 "Zoo" 的第一格是 'Z'(90)，"apple" 的第一格是 'a'(97)，90 小 —— **"Zoo" 小于 "apple"**，跟「apple 在字典里靠前」的直觉正好相反。这不是 bug，是编号表的设计。类似的还有数字排在字母前面（'0' 是 48），所以 "2cats" 小于 "cats"。要按人的习惯排（忽略大小写），得先把两边统一改成小写再比 —— 那套改法以后再讲，本课先把「比的是编号，不是字母表」这句话说牢。` },
        { t: `p`, text: `顺带说一个中文的坑：串里装汉字时，比的是**存进去的那几个字节**（一个汉字要占好几格），跟拼音顺序没关系。"小明" 和 "小红" 谁大，取决于它们各自那几个字节的编号，不取决于笔画，也不取决于拼音。所以**别拿这套比较给中文名单排序**，排出来的顺序没人认得。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `code`, lang: `text`, code: `x < y      逐格比编号，先分胜负的那格定输赢（x 的编号小 → true）
x == y     每一格都一样、且长度也一样，才 true
x > y      反过来：x 的编号大 → true

比的动作不改任何串：它只是回答一个问题，回答是「真」或「假」
返回的是一个真假值（第 12 课那个 bool 盒子装的东西）` },
        { t: `p`, text: `这里有个容易滑过去的点：**比较的结果本身是个值**，跟数字一样可以打印、可以存进 bool 变量。std::println("{}", x < y) 打出来的是 true 或 false —— 别觉得怪，第 12 课学的真假盒子就是干这个的。` },
        { t: `svg`, caption: `逐格比编号：先分胜负的那一格说了算，后面再看都不看`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250">
  <text x="20" y="26" font-size="14" font-weight="700" fill="#142639">"abc" 跟 "abd" 比：前两格平，第三格定胜负</text>
  <g font-size="14" fill="#142639" text-anchor="middle">
    <rect x="30" y="44" width="52" height="40" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="56" y="70">a 97</text>
    <rect x="82" y="44" width="52" height="40" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="108" y="70">b 98</text>
    <rect x="134" y="44" width="52" height="40" fill="#dff0e2" stroke="#1a7f42" stroke-width="3"/><text x="160" y="70">c 99</text>
    <rect x="30" y="96" width="52" height="40" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="56" y="122">a 97</text>
    <rect x="82" y="96" width="52" height="40" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/><text x="108" y="122">b 98</text>
    <rect x="134" y="96" width="52" height="40" fill="#f6e7d8" stroke="#b8722b" stroke-width="3"/><text x="160" y="122">d 100</text>
    <rect x="186" y="44" width="52" height="40" fill="#f2f2f2" stroke="#c9ccd1" stroke-width="2"/><text x="212" y="70" fill="#57677c">（不比）</text>
  </g>
  <text x="260" y="70" font-size="14" font-weight="700" fill="#1a7f42">99 小于 100，所以 "abc" 小于 "abd"</text>
  <text x="260" y="122" font-size="13" fill="#57677c">第一格平、第二格平、第三格分胜负</text>
  <text x="20" y="166" font-size="14" font-weight="700" fill="#142639">另一组：'Z' 跟 'a' 比 —— 编号表把大写排在小写前面</text>
  <g font-size="14" fill="#142639" text-anchor="middle">
    <rect x="30" y="180" width="80" height="40" fill="#f6e7d8" stroke="#b8722b" stroke-width="3"/><text x="70" y="206">Z  90</text>
    <rect x="140" y="180" width="80" height="40" fill="#dff0e2" stroke="#1a7f42" stroke-width="3"/><text x="180" y="206">a  97</text>
  </g>
  <text x="250" y="206" font-size="14" font-weight="700" fill="#b8722b">90 小于 97，所以 "Zoo" 小于 "apple"</text>
</svg>` },
        { t: `h2`, text: `演示 1 · 四行比较（源稿这段）` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>

int main() {
    std::string x = "abc";
    std::string y = "abd";
    std::println("abc < abd  ? {}", x < y);      // true，比到第三个字符
    std::println("abc == abd ? {}", x == y);     // 一模一样才相等
    std::println("abc == abc? {}", x == "abc");  // true：右边换个写法也一样
    std::println("'Z' < 'a' ? {}", 'Z' < 'a');   // true！大小写编号不同

    return 0;
}` },
        { t: `p`, text: `四行输出：true、false、true、true。第三行值得停一下：== 两边一个是 string 变量、一个是双引号写的一串字，照样能比 —— 因为比较的规矩是「逐格比编号」，格子从哪儿来的它不管。最后一行比的是**两个字符**而不是两个串，字符本来就是编号（第 12 课那个盒子），所以 'Z' < 'a' 就是 90 < 97，跟串的规则是同一件事。` },
        { t: `h2`, text: `演示 2 · 先分胜负的那格说了算` },
        { t: `code`, lang: `c++`, code: `std::string p1 = "apple";
std::string p2 = "banana";
std::string p3 = "abc";
std::string p4 = "abcd";
std::string p5 = "abz";
std::string p6 = "ac";

std::println("{}", p1 < p2);   // true：第一格 a 就比 b 小
std::println("{}", p3 < p4);   // true：前面全平，短的那边算小
std::println("{}", p5 < p6);   // true：比到第二格 b 已经赢了` },
        { t: `p`, text: `第三行是本课最该动手验的一行："abz" 和 "ac"，第二格 b(98) 对 c(99)，b 小 —— 于是 "abz" 小，哪怕它尾巴上还挂着个 z(122)、哪怕它比对方多一个字符。**先见胜负先收兵**，后面那格再大也救不回来。谁要是以为「z 开头的一定排在后面、长的字符串一定大」，写出来的排序就会在这里翻车。` },
        { t: `h2`, text: `演示 3 · 三个名字，大小写搅局` },
        { t: `code`, lang: `c++`, code: `std::string a = "Zoo";
std::string b = "apple";
std::string c = "Cat";

std::println("{}", a < b);   // true：Z(90) 比 a(97) 小，反直觉
std::println("{}", c < b);   // true：C(67) 更小，大写全线排前
std::println("{}", a < c);   // false：同为大写，Z 比 C 大` },
        { t: `p`, text: `按人的直觉，apple 该排第一；程序给的顺序是 Cat、Zoo、apple。三条输出把规则钉死了：**先比第一格**，大写编号小就先赢；两边都是大写时才回到字母表直觉（C 在 Z 前面，所以 a < c 是 false）。将来你要给名字排序，只要名单里混着大小写，就一定撞这个 —— 别改比较规则，改输入：把两边先统一成同一种大小写。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `拿 == 之外的符号比「差不多」。字符串没有「近似」这回事：多个空格、多个换行、大小写不同，== 都是 false。查出来不相等时先别怀疑编译器，把两个串各自用 length() 量一遍，多半是长度已经不一样。`,
          `以为大写字母排在后面。编号表是 'A'(65) 到 'Z'(90) 在前、'a'(97) 到 'z'(122) 在后，所以 "Zoo" < "apple"。数字更在前（'0' 是 48），"2cats" 也小于 "cats"。`,
          `以为长的字符串就大。长度只在「前面所有格都一样」时才起作用，那种情况下短的算小。"abz" 小于 "ac"，第二格就定了。`,
          `拿它给中文名单排序。汉字在串里是多个字节，比的是字节编号，跟拼音、笔画都不搭，排出来的顺序没人认得。`,
          `把 == 写成赋值的毛病（本课先埋个照面：以后写判断语句时会遇到 = 和 == 天差地别的那种错）。本课只用 == 提问，记住它问的是「一模一样吗」，而单个等号是「把右边灌进左边」，两回事。`,
          `比之前没想清楚比的是**编号**这个事实，于是每次结果反直觉都要重新推一遍。做法是把第一条规则背下来：从第 0 格起逐格比编号，先分胜负者定论。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `猜 "apple" 和 "banana" 谁大，写代码验证`,
          `比一比 "Zoo" 和 "apple"，结果和直觉一样吗？想想为什么`,
          `延伸：把 "apple"、"Banana"、"cherry"、"2" 四个串两两比，找出**最小**的那一个并打印，说明它是靠哪一格赢的。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：字符串比较 = 从第 0 格起逐格比字符编号，先分胜负的那格定论、一路平则短的小；大写编号在小写前面，所以 "Zoo" 小于 "apple"。` }
      ]
    },
    {
      id: `c20`, title: `第 20 课 · cin：让程序开口问你，而不是你替它写死`,
      /* 例外点名（照 p01 第 5 课那条 member-call 的做法）：本章三个 c++ 代码块都要写 std::cin >> a >> b，
         里面的 >> 被 cpp-audit 的 cmpHit 当成「比较运算符」（它遮了 #include <…> 和模板尖括号，唯独没遮流的 >>），
         而 cin 教在第 20 课、比较运算符教在第 22 课，正常写法必被判违规。正文【演示 1】后已经当面向读者讲清
         「>> 这个箭头跟比大小的单个 < 、== 是两回事」，故按规矩在闸上点名，不改闸、不放松正则。 */
      allowConstructs: [`cmp`],
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会用 std::cin >> 把你敲的数字装进变量，一次问两个也行；并且看懂两件事 —— 它为什么要等你按回车，以及你敲了「hello」这种读不进去的东西时，变量里到底发生了什么。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `回看前十九课，你所有程序的数字都是**写死在源码里**的：int a = 15; 那个 15 是你敲键盘时想好的，跑起来之后用户什么也决定不了。这种程序只能算一道「你提前把答案填好的例题」。要让它变成真工具 —— 输入价格算总价、输入身高给出建议 —— 就得让程序在**跑起来的那一刻**去问人。C++ 给这件事的入口就是 **cin**（console input 的缩写，标准输入）。` },
        { t: `p`, text: `写法只有一个新符号：**两个大于号 >>**，读法很直观，跟着箭头走：std::cin >> a; 意思是「把输入的东西**灌进** a 这只盒子」。方向感是这里的核心 —— 输出是把盒子里的东西搬到屏幕上，输入是往盒子里搬。所以箭头右边必须是一只**你已经声明好的盒子**：cin 不负责创造变量，它只负责往现成的盒子里装东西。你写 std::cin >> 15; 或者忘了声明 a，编译器当场拦下。` },
        { t: `p`, text: `第二件必须懂的事：**它会停下来等你**。看到 std::cin >> a;，程序就卡在那一行，屏幕上光标闪，什么都不动 —— 这不是死机，是在等人。你敲的字会先显示在屏幕上，但**程序一个字符都还没拿到**；只有你按下回车那一整行才被交出去。这个「攒一行再给」的规矩解释了两件常见现象：一是敲的时候删错了字别慌，还没进程序；二是你连按好几个回车、或者把两个数写在两行，程序也只是安静地等它要的东西齐了才往下走。` },
        { t: `p`, text: `第三件：**一次可以问好几个**，接着写就行 —— std::cin >> a >> b;。它俩用**空格**或者**回车**分开都可以，程序不在乎哪种，只要隔开。这就是源稿里那句「两个数用空格隔开」的由来，也是你以后写「先问几个数」的基本句式。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `code`, lang: `text`, code: `你的键盘                     程序里
  │                            │
  │  敲 7 空格 8 再按回车       │
  ▼                            ▼
"7"  "8"  ──── >> ───▶  int a │ int b
                        装 7   装 8

std::cin >> a >> b;     箭头指向谁，谁就被灌满
分隔符：空格、回车都算，程序按「个数」收，不按行数收
注意： >> 右边必须是已经声明好的变量` },
        { t: `p`, text: `顺便解释一句代码开头为什么要多写一行 #include <iostream>：第 1 课讲过，头文件就是把「别人写好的东西」请进你的文件。println 住在 print 那个头文件里，cin 住在另一个头文件里，所以要**两个都请**。忘写它，报错会指着 cin 那一行说「这个标识符我没见过」—— 这是 cin 相关报错里最最常见的第一条。` },
        { t: `h2`, text: `演示 1 · 问两个数，把和算出来（源稿这段）` },
        { t: `code`, lang: `c++`, code: `#include <iostream>
#include <print>

int main() {
    int a = 0;
    int b = 0;
    std::print("请输入两个整数（空格隔开）: ");
    std::cin >> a >> b;                  // 等你输入，空格或回车分隔都行
    std::println("你输入的是 {} 和 {}", a, b);
    std::println("它们的和是 {}", a + b);

    return 0;
}` },
        { t: `p`, text: `注意那两句打印的分工：提示语用的是 **std::print**（不带 ln），它打完不换行，光标就停在冒号后面，你的数字敲在同一行，看着像一句完整对话。要是这里用了 std::println，它会先换行，屏幕上就成了「提示语孤零零一行 + 空行 + 光标」，用户会以为程序卡住了。带 ln 的那句留给**结果**用，因为它该另起一行。另外两个变量都给了初值 0 —— 这既是第 2 课的基本功，也是本课演示 3 那个现象能被看出来的前提。还有人在扫代码时会把 >> 看成比大小的符号，这里说清：**上一课比大小用的是单个 < 和 ==，本课这个箭头是双写的大于号，两回事**，它后面跟的永远是盒子而不是「拿来比的两个值」。` },
        { t: `h2`, text: `演示 2 · 盒子是什么类型，就要什么类型的数` },
        { t: `code`, lang: `c++`, code: `#include <iostream>
#include <print>

int main() {
    int count = 0;
    double price = 0.0;
    std::print("买几个？: ");
    std::cin >> count;                    // 敲 3
    std::print("单价多少？: ");
    std::cin >> price;                    // 敲 4.5
    std::println("总价 {}", count * price);

    return 0;
}` },
        { t: `p`, text: `两问分两行写，效果跟连着问一样，好处是每次只敲一个数，不容易漏。这里有个值得实验的现象：**int 盒子遇到 4.5，只收 4** —— 它按整数去读，读到小数点就停，小数部分被留在输入里、不报错、不四舍五入。所以「买几个」这种问题用 int 是对的，「多少钱」就得用 double（第 11 课那只小数盒）。反过来在 double 盒子里敲整数也毫无问题，4 会被当成 4.0 收下。` },
        { t: `h2`, text: `演示 3 · 故意喂它一个 hello（源稿任务 2 的现象）` },
        { t: `code`, lang: `c++`, code: `int a = 0;
int b = 0;

std::print("请输入两个整数（空格隔开）: ");
std::cin >> a >> b;          // 这里敲 hello 再回车
std::println("a = {}, b = {}", a, b);    // a = 0, b = 0` },
        { t: `p`, text: `跑一遍你会看到：程序**不崩溃、不报错、不重新问你**，a 和 b 还是原来的 0，然后继续往下执行，把「它们的和是 0」一本正经地打出来。这就是本课最该记住的现象 —— 读不进去的时候，cin 什么也不做，盒子保持**出生时的值**。这个现象有两层含义：第一，别把「打出来 0」当成「用户真的输了 0」，你分不清；第二，那些没被读走的东西还留在输入里，后面的读取会踩到它。要真正处理这种输入，得让程序会「判断」才行 —— 那是以后的课，本课先把现象刻进脑子里：**cin 读失败是很安静的**。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `忘写 #include <iostream>。报错指着 cin 那一行，大意是「cin 不在作用域里 / 不认识这个标识符」；看见这条先回头看头文件，别去改 cin 那行的写法。`,
          `箭头右边没盒子：std::cin >> 42; 或者拿一个根本没声明的变量去接。cin 只往现成的盒子里灌，编译器不会替你变出一只。`,
          `提示语用了 std::println。程序看着像卡住（光标在下一行干闪），其实是提示被换行推走了。问人的那句用不带 ln 的 print，答完再换行。`,
          `拿 int 接小数。4.5 只会进去 4，小数点后面的部分被剩下，不报错也不四舍五入。要收小数就换 double 盒子。`,
          `敲了字却迟迟不回车，以为程序在读。它是攒一行才交，回车之前你敲的内容还在屏幕上排队。`,
          `以为输入错了程序会提醒。前面演示 3 已经跑过：读不进去就保持初值 0，程序照跑到底。所以拿别人的输出反推「他输了 0」是不成立的 —— 这条坑以后靠判断来解决。`,
          `想用 cin >> 读一整句带空格的话（比如全名）。它以空格为边界，一句「Liu Yang」只会进 Liu，后半句留给下一次读取。收整句是另一个工具的活儿，以后再讲。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `运行后输入 7 和 8，看和是不是 15`,
          `故意输入 hello，看程序打出什么（数读不进去，a、b 还是 0，记住这现象）`,
          `延伸：把演示 2 改成问三个数（个数、单价、付了多少钱），打印总价和应找的钱；再输入一次带小数的个数（比如 2.9），看看 int 盒子收下了几。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：std::cin >> 变量 —— 箭头指向谁就灌进谁，变量得先声明好；它停下来等你回车，敲错了字它安静地保持初值，不报错也不重问。` }
      ]
    }
  ]
};
