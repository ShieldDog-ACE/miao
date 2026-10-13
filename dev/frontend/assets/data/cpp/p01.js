/* 喵站 · C++ 入门 正文分部 p01：第 1–5 课（第九轮 T-23 黄金样板）
 *
 * 源稿：学习资料/C++入门/1_…~5_….cpp。款式照 python 的六栏课式：
 *   tip(蓝·本课目标) → 原理讲解 → 它被设计成什么样/怎么做 → 演示 N → 常见坑 → 任务 → tip(绿·本课一句话)
 *
 * 规矩（cpp-audit 会逐条查）：
 *   1. 所有字符串用反引号做分隔符，所以**正文与代码里不许出现反引号**；标代码名裸写或用「」。
 *   2. 正文交叉引用只许往回指；指后面的课用「下一课」「以后」。课号按源稿 1–213 连续编号。
 *   3. 代码块里只出现本课及以前教过的东西；教构造的课号以源稿为准（cpp-audit 的构造首现闸）。
 *   4. 梗词零容忍；句尾不许出现「喵」。
 *   5. 每章正文 ≤2,800 字、块 ≤30、单段演示 ≤14 行（他说要比 python 更详细，口径见 D-56）。
 *   6. 源稿的每条【任务】原样进【任务】栏（至少保留要点原话），考试也从这里出。
 *
 * 验收：node dev/tools/cpp-audit.cjs --part dev/frontend/assets/data/cpp/p01.js
 *       node dev/tools/cpp-exam-check.cjs --part dev/frontend/assets/data/cpp-exam/p01.js
 */
window.MIAO_CPP_P01 = {
  chapters: [
    {
      id: `c01`, title: `第 1 课 · 第一个程序：现代 C++ 的 Hello World`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：跑通人生第一个 C++ 程序，认识 main 函数、头文件和编译命令这三样每份代码都要有的东西。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `C++ 和 Python 有个根本差别要先说清：Python 是**解释执行**的，写完直接交给解释器就能跑；C++ 是**编译执行**的，你写的是文本，机器一个字都看不懂，中间必须有一位翻译 —— **编译器**（compiler），把你的源码整体翻译成机器能直接执行的文件。这份翻译后的文件叫**可执行文件**，真正的程序是它，不是你写的那个 .cpp。` },
        { t: `p`, text: `所以每个 C++ 程序的完整生命周期都是同一条流水线：写源码 → 编译 → 运行。写错了不要紧，编译器会**当场把每一处它看不懂的地方报出来**，一处都不放过 —— 这在 Python 那边是运行到一半才炸的事，在 C++ 这边编译阶段就全拦住了。这门课往后你会逐渐爱上这种「错误提前暴露」的性格。` },
        { t: `p`, text: `流水线长这样，你在本课之后做的一切事都在这条线上：` },
        { t: `svg`, caption: `从源码到屏幕：一次编译就是走一遍这条线`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 170">
  <rect x="20" y="52" width="118" height="52" rx="10" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
  <text x="79" y="74" font-size="15" font-weight="700" fill="#142639" text-anchor="middle">main.cpp</text>
  <text x="79" y="94" font-size="12" fill="#57677c" text-anchor="middle">你写的源码</text>
  <path d="M148 78 H206" stroke="#57677c" stroke-width="2.5"/>
  <polygon points="206,78 196,72 196,84" fill="#57677c"/>
  <rect x="212" y="42" width="132" height="72" rx="10" fill="#00599c"/>
  <text x="278" y="70" font-size="15" font-weight="700" fill="#ffffff" text-anchor="middle">编译器</text>
  <text x="278" y="92" font-size="12" fill="#cfe0f2" text-anchor="middle">g++ / clang</text>
  <path d="M352 78 H410" stroke="#57677c" stroke-width="2.5"/>
  <polygon points="410,78 400,72 400,84" fill="#57677c"/>
  <rect x="416" y="52" width="112" height="52" rx="10" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
  <text x="472" y="74" font-size="15" font-weight="700" fill="#142639" text-anchor="middle">可执行文件</text>
  <text x="472" y="94" font-size="12" fill="#57677c" text-anchor="middle">机器直接执行</text>
  <path d="M534 78 H568" stroke="#57677c" stroke-width="2.5"/>
  <polygon points="568,78 558,72 558,84" fill="#57677c"/>
  <rect x="574" y="58" width="52" height="40" rx="8" fill="#142639"/>
  <text x="600" y="83" font-size="13" font-weight="700" fill="#ffffff" text-anchor="middle">屏幕</text>
</svg>` },
        { t: `h2`, text: `怎么做` },
        { t: `p`, text: `装编译器：Windows 装 **MSYS2** 或 Visual Studio（本课命令按 g++ 写，MSYS2 里 pacman -S mingw-w64-ucrt-x86_64-gcc 一条装齐）；macOS 终端里 xcode-select --install；Ubuntu 系 sudo apt install g++。装完敲 g++ --version，有版本号就是成了。` },
        { t: `p`, text: `然后新建一个文本文件，改名叫 main.cpp，把下面这段原样敲进去（别复制粘贴，第一份代码手敲一遍，肌肉记忆值回票价）：` },
        { t: `code`, lang: `c++`, code: `#include <print>

int main() {
    std::println("Hello, World!");
    return 0;
}` },
        { t: `p`, text: `四个部件各说一句。**#include <print>**：井号开头的行是给编译器预处理器看的，意思是「把标准库里那个叫 print 的工具箱整个搬进来」，std::println 就住在里面；少了这一行，下面那句打印就是没人认识的野名字，编译直接报错。**int main() { … }**：每个 C++ 程序有且只有一个 main 函数，它是整台机器的**入口** —— 操作系统把可执行文件装进内存后，就是从这里开始执行的。**std::println("…")**：把引号里的文字打到屏幕上，并自动补一个换行；std:: 是它的「姓氏」，说明它住在标准库这个大家族里，第 1 课先照着写，姓氏的规矩后面有专门一课。**return 0**：main 结束时向操作系统交回一个数，0 是约定俗成的「一切正常」，出错的程序可以交别的数，脚本就靠这个数判断你成功没成功。` },
        { t: `p`, text: `在 main.cpp 所在的目录打开终端，两步走：` },
        { t: `code`, lang: `shell`, code: `$ g++ -std=c++23 main.cpp -o main
$ ./main
Hello, World!` },
        { t: `p`, text: `第一条是编译：-std=c++23 指定按 C++23 这套标准来翻译（这门课全程用它，因为 std::println 是 C++23 才正式进标准库的），-o main 给产物起名叫 main（不写这条的话 Linux 上默认叫 a.out）。第二条 ./main 是**运行**它 —— 注意要带 ./ 前缀，意思是「当前目录下的这个文件」，不带前缀系统只去 PATH 里找，找不到你的。以后每次改完源码，都要重新编译一次再运行，改了不重编，跑的还是上一版。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `语句结尾忘了分号。C++ 每条语句以分号收尾，忘了的话编译器报一大串 error，且报错位置常常在下一行 —— 先看报错行的**上一行**结尾。`,
          `中文标点混进去。全角引号、全角分号、全角括号，编译器一律不认，报 error: stray '￥' 之类的怪话。写代码时把输入法切成英文半角，能省掉新手一半的报错。`,
          `大括号不配对。main 的 { 和 } 是一对，少了右半边，报错指到文件末尾 error: expected '}' at end of input，别慌，缺的就是那半个。`,
          `跑了旧程序。源码改了但没重新编译，屏幕上还是老结果，还以为自己的修改被无视了 —— 记住改一次编一次。`,
          `main 写成 Main 或 mian。main 是小写、一个字母都不能错，入口名字拼错等于没有入口。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `用 std::println 输出一行文字（内容自己定），编译并运行成功。`,
          `把 Hello, World! 改成两行输出：第一行你的名字，第二行今天日期。改完重新编译再跑。`,
          `故意删掉行尾的分号编译一次，把报错第一行抄下来 —— 以后你还会见到它很多次，提前混个脸熟。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：C++ 程序 = 源码交给编译器翻译成可执行文件再运行；main 是入口，分号收尾，改完必须重编。` }
      ]
    },
    {
      id: `c02`, title: `第 2 课 · 声明变量：向编译器要盒子`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会写「类型 名字 = 初值」这个基本句式，认识 int、double、char、bool 四种最常用的盒子。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课的程序只会说话，这一课让它开始**记东西**。变量就是内存里的一块空间，起个名字方便你引用；「声明变量」这个动作，本质是**向编译器要一个盒子**，并且第一句话就要说清三件事：这盒子装什么类型的东西、叫什么名字、先装什么进去。` },
        { t: `code`, lang: `text`, code: `int   age  = 15;
 │     │     │
 │     │     └── 先装进去的值（初始值）
 │     └──────── 盒子的名字
 └────────────── 盒子的类型（int = 只装整数的盒子）` },
        { t: `p`, text: `和 Python 想装就装不同，C++ 的盒子在造出来那一刻就**定死了类型**，int 盒子从生到死只装整数。类型是承诺，也是保护：编译器拿着承诺替你检查每一次赋值，装错了当场报错，而不是等到程序跑了一半莫名其妙崩掉。常用类型先记四个：` },
        { t: `ul`, items: [
          `**int** —— 整数。15、-3、0 都是；装不下小数，这一点下一课专门讲。`,
          `**double** —— 小数（双精度浮点数）。92.5、3.14 这种；整数也能装，15 装进去变成 15.0。`,
          `**char** —— 单个字符，用**单引号**：'A'、'+'。注意是一个字符，'AB' 就装不下了。`,
          `**bool** —— 布尔，只有 true 和 false 两种值，专管「是 / 否」。`
        ]},
        { t: `p`, text: `名字（专业名词叫**标识符**）的规矩：由字母、数字、下划线组成，数字不能开头，大小写敏感 —— age 和 Age 是两个变量。名字给人看的，起得能读懂比短更重要：height 比 h 强，is_student 比 flag 强。传统上 C++ 用蛇形命名（is_student），这门课沿用。` },
        { t: `h2`, text: `什么时候用得上` },
        { t: `p`, text: `别把「声明变量」当成教学里的脚手架，它是你跟程序要东西的唯一方式。你以后写的每个程序，起点都是这一句：**先想清楚要记哪几件事，每件事是什么类型，取什么名字。** 一张小票要记店名、单价、数量、有没有打折；一个成绩条要记姓名、分数、是否及格。想不清这几样，代码写得再花也没用 —— 新手代码里一大半的别扭，其实不是语法错，是「该记的东西没记下来」或者「拿错了类型去记」。` },
        { t: `p`, text: `类型选错还有代价：拿 int 记金额（单位是元）就把小数抹了，拿 double 记「第几名」会出现 3.0000001 这种鬼东西。定型的顺序建议是：先问这件事**是整数、是小数、是一个字符、还是是/否**，四类对上就顺手了；文字句子是另一类（std::string），往后有一课专门讲，今天先不碰。` },
        { t: `h2`, text: `演示 1 · 四种盒子各来一个` },
        { t: `code`, lang: `c++`, code: `#include <print>

int main() {
    int age = 15;            // 整数
    double score = 92.5;     // 小数
    char grade = 'A';        // 字符：装一个字符，用单引号
    bool is_student = true;  // 布尔：只有 true / false 两种
    std::println("age = {}", age);
    std::println("score = {}", score);
    std::println("grade = {}", grade);
    std::println("is_student = {}", is_student);   // 打出来就是 true

    return 0;
}` },
        { t: `p`, text: `std::println 的引号里那些 **{}** 是**占位坑**：println 打字的时候，把后面括号里的值按顺序一个个填进坑里。几个坑就给几个值，少给多给都会在编译期报错 —— 这比老式的 printf 安全得多，坑和值的对不上在编译阶段就被抓住。` },
        { t: `h2`, text: `演示 2 · 声明和赋值可以分开` },
        { t: `code`, lang: `c++`, code: `int hp;
hp = 100;          // 先声明，后赋值，两步走
hp = hp - 30;      // 盒子里的值可以随时换，类型不变
std::println("hp = {}", hp);   // hp = 70` },
        { t: `p`, text: `声明只许一次，赋值随便多少次。最后一行 hp = hp - 30 值得盯两秒：右边先算（拿 hp 现在的值减 30，得 70），再把结果装回 hp —— 等号不是数学里的「相等」，是**把右边的值装进左边的盒子**，所以先右后左。` },
        { t: `p`, text: `还有一个看不见但真实存在的差别：这四种盒子在内存里占的地方不一样大。int 占 4 个字节、double 占 8 个、char 占 1 个、bool 也只占 1 个 —— 字节就是内存的最小格子，一个格子装 8 个二进制位。盒子越大能装的数范围越宽，这也是为什么后面要专门有一课讲「装不下的大数」。` },
        { t: `svg`, caption: `四种盒子各占几个字节（格子宽度按真实字节数画）`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 210">
  <text x="20" y="26" font-size="14" font-weight="700" fill="#142639">声明时写的类型，决定内存里圈多大地方</text>
  <g font-size="13" fill="#142639">
    <rect x="20" y="46" width="112" height="34" rx="6" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/>
    <text x="76" y="68" text-anchor="middle" font-weight="700">int</text>
    <rect x="20" y="88" width="112" height="16" rx="3" fill="#00599c"/>
    <text x="76" y="122" text-anchor="middle" fill="#57677c">4 字节</text>
    <rect x="176" y="46" width="112" height="34" rx="6" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/>
    <text x="232" y="68" text-anchor="middle" font-weight="700">double</text>
    <rect x="176" y="88" width="224" height="16" rx="3" fill="#00599c"/>
    <text x="288" y="122" text-anchor="middle" fill="#57677c">8 字节（正好是 int 的两倍）</text>
    <rect x="428" y="46" width="96" height="34" rx="6" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/>
    <text x="476" y="68" text-anchor="middle" font-weight="700">char</text>
    <rect x="428" y="88" width="28" height="16" rx="3" fill="#00599c"/>
    <text x="476" y="122" text-anchor="middle" fill="#57677c">1 字节</text>
    <rect x="540" y="46" width="80" height="34" rx="6" fill="#dfe8f6" stroke="#00599c" stroke-width="2"/>
    <text x="580" y="68" text-anchor="middle" font-weight="700">bool</text>
    <rect x="540" y="88" width="28" height="16" rx="3" fill="#00599c"/>
    <text x="580" y="122" text-anchor="middle" fill="#57677c">1 字节</text>
  </g>
  <line x1="20" y1="150" x2="620" y2="150" stroke="#c7d3e4" stroke-width="1.5"/>
  <text x="20" y="176" font-size="13" fill="#57677c">下一课用 sizeof 亲手把这四个数打出来，眼见为实。</text>
</svg>` },
        { t: `h2`, text: `演示 3 · 两个盒子换东西，要第三个帮忙` },
        { t: `code`, lang: `c++`, code: `int left = 1;
int right = 2;
int hold = left;     // 先把左边的东西借放一下
left = right;        // 左边拿来右边的值 —— 原来的 1 此刻已经没了
right = hold;        // 右边接回那份备份

std::println("left = {}, right = {}", left, right);   // left = 2, right = 1` },
        { t: `p`, text: `这段是变量最基本的肌肉记忆：**一个盒子同一时刻只装一个值，写进去新的，旧的当场没了。** 所以互换必须借第三个盒子（术语叫临时变量）中转一次。你要是直接写 left = right; 再 right = left; 就会得到两个一样的值 —— 因为第二步时 left 已经不是原来那个了。这个坑跟语法无关，纯粹是没把「等号是装东西，不是相等」当真。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `单引号双引号混用。char 用单引号 'A'；双引号 "A" 是字符串（一种不同的东西），塞给 char 盒子编译器报 invalid conversion —— 下一课末尾还会撞见它。`,
          `用了没初始化的变量。int x; std::println("{}", x); 里 x 装的是内存里的随机垃圾值，打出来每次都不一样。声明时顺手给初值，是这条课的基本功。`,
          `名字用拼音缩写还大小写乱来：Xm、xM、xm 三个名字编译器当三个变量。统一小写加下划线，能少走很多回头路。`,
          `把 true 写成 True。C++ 的布尔值是小写 true / false，Python 那套大写开头在这里是没声明的名字。`,
          `同一个名字声明两次。int age = 15; 后面再写 int age = 20; 会报 redeclaration —— 第二次只要 age = 20; 别带类型，带了类型就是又要一个新盒子。`,
          `一行里塞好几个同名不同类型。int a = 1; double a = 2; 编译器会拦下来，但报错位置看着莫名其妙 —— 名字撞车，改名字比改类型实在。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `声明两个变量描述自己：身高（小数）、是否住校（布尔），打印出来。`,
          `把 grade 的 'A' 换成 "A"（双引号），编译看报什么错 —— 单引号是一个字符，双引号是字符串，别混。`,
          `声明一个 int 变量装你的零花钱，模拟花掉 8 块、又收到 20 块，每步都打印当前值。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：声明变量 = 类型 + 名字 + 初值三件套；类型定死不能换，名字大小写敏感，声明时就给初值。` }
      ]
    },
    {
      id: `c03`, title: `第 3 课 · 强类型：类型定了就不能改`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：亲眼看到编译器拦下什么、放过什么 —— 强类型是保护，但「悄悄丢数据」的口子要心里有数。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `C++ 是**强类型**语言：int 盒子造好后只能装整数，想装别的，编译器当场拒绝。试着写 age = "十五";，编译直接报错，核心意思就一句：**类型对不上，拦下**。看着麻烦，其实是保护 —— Python 要等运行到那一行才炸，C++ 在编译阶段就把问题拍在你脸上，程序还没跑就少了一整类事故。` },
        { t: `p`, text: `但强类型不等于刀枪不入。有一种「类型勉强对得上」的情况，编译器会**悄悄帮你转换**，转的过程丢数据也不吭声 —— 这才是本课真正要盯紧的东西。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `C++ 的类型系统的取向是这样的：**能在编译期确定的错，就别留到运行期**。所以它要求每个盒子先定类型、赋值时核对类型、类型八竿子打不着就直接拒绝（int 装不下字符串就是这么一回事）。同时它又留了一条缝：类型「有点像」的时候不强拦，而是按一套固定规矩自动换 —— 小数换成整数就砍尾巴。这条缝不是疏忽，是有意留的：算坐标、算页数、算「整除后剩几」这类活儿，你天天要「只取整数部分」，每次都得写一遍转换反而吵。` },
        { t: `p`, text: `看清楚这里的取舍：拦下错类型 = 帮你少踩坑；放过砍尾巴 = 给你顺手，但要你自己负责。所以本课的落点不是背规矩，而是练一种警觉 —— **看到赋值，就条件反射地问一句：左边盒子的类型，装右边的值会不会丢东西。** 会丢，就换类型或换写法；不会丢，再往下写。` },
        { t: `h2`, text: `演示 1 · 拦下的与放过的` },
        { t: `code`, lang: `c++`, code: `#include <print>

int main() {
    int age = 15;

    // age = "十五";     // ← 解开注释：编译报错！int 盒拒绝装字符串
    // 报错核心：类型对不上，拦下

    age = 3.7;          // ← 这行却不报错！int 盒"勉强"收下小数
    std::println("age = {}", age);   // 打出来是 3，不是 3.7，也不是 4

    return 0;
}` },
        { t: `p`, text: `为什么 age = 3.7 不报错，打出来还是 3？int 没有小数位，3.7 装进来时**直接砍掉尾巴**变成 3 —— 不是四舍五入，是拦腰截断，3.9 进来也是 3，-3.7 进来是 -3。编译器最多警告一声（也可能悄悄放过），数据就这么没了。` },
        { t: `p`, text: `什么时候这是好事？有时你就是故意只想要整数部分：算屏幕坐标、算页数、算「几岁」不看月份。什么时候是事故？算平均分、算钱的时候 —— 差的那 0.7 会一路滚成大错。规矩记这条：**小数进 int，编译器砍尾巴不商量；你要的不是砍尾巴，就别让小数进 int 盒。**` },
        { t: `h2`, text: `演示 2 · 砍尾巴的三兄弟` },
        { t: `code`, lang: `c++`, code: `int n = 0;

n = 3.2;  std::println("{}", n);   // 3 —— 砍掉 .2
n = 3.9;  std::println("{}", n);   // 3 —— 同样砍，不是四舍五入进位成 4
n = -2.9; std::println("{}", n);   // -2 —— 朝 0 那一侧砍，不是 -3` },
        { t: `p`, text: `第三条特别容易想当然：-2.9 数学上离 -3 更近，可**截断是向零**砍，得 -2。三种情况记成一句话：**小数进 int，一律砍掉小数部分，朝 0 看齐，跟四舍五入没半点关系。**（整与整相除也会砍尾巴，那是第 8、9 课的正事，这儿不抢它的活儿。）` },
        { t: `svg`, caption: `截断的方向：小数进 int、整数相除，都是朝 0 那一侧砍`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 220">
  <line x1="40" y1="120" x2="600" y2="120" stroke="#8b98ab" stroke-width="2"/>
  <polygon points="600,120 588,114 588,126" fill="#8b98ab"/>
  <g font-size="13" fill="#57677c" text-anchor="middle">
    <line x1="120" y1="112" x2="120" y2="128" stroke="#8b98ab" stroke-width="2"/><text x="120" y="148">-4</text>
    <line x1="240" y1="112" x2="240" y2="128" stroke="#8b98ab" stroke-width="2"/><text x="240" y="148">-2</text>
    <line x1="320" y1="106" x2="320" y2="134" stroke="#142639" stroke-width="3"/><text x="320" y="154" font-weight="700" fill="#142639">0</text>
    <line x1="400" y1="112" x2="400" y2="128" stroke="#8b98ab" stroke-width="2"/><text x="400" y="148">2</text>
    <line x1="520" y1="112" x2="520" y2="128" stroke="#8b98ab" stroke-width="2"/><text x="520" y="148">4</text>
  </g>
  <g font-size="13">
    <circle cx="150" cy="120" r="7" fill="#b8500f"/>
    <text x="150" y="98" text-anchor="middle" fill="#b8500f" font-weight="700">-3.5</text>
    <path d="M150 120 Q230 120 306 120" fill="none" stroke="#b8500f" stroke-width="2.5" stroke-dasharray="5 4"/>
    <polygon points="306,120 294,114 294,126" fill="#b8500f"/>
    <text x="300" y="176" text-anchor="middle" fill="#142639" font-weight="700">-7 / 2 = -3（不是 -4）</text>
    <circle cx="452" cy="120" r="7" fill="#1b7482"/>
    <text x="452" y="98" text-anchor="middle" fill="#1b7482" font-weight="700">3.7</text>
    <path d="M452 120 Q400 120 366 120" fill="none" stroke="#1b7482" stroke-width="2.5" stroke-dasharray="5 4"/>
    <polygon points="366,120 378,114 378,126" fill="#1b7482"/>
    <text x="430" y="176" text-anchor="middle" fill="#142639" font-weight="700">double 3.7 进 int 盒 = 3</text>
  </g>
  <text x="40" y="206" font-size="13" fill="#57677c">箭头一律指向 0：这就是「砍尾巴」而不是「四舍五入」。</text>
</svg>` },
        { t: `p`, text: `顺手把这条也记进脑子：**编译器报不报错，跟「你会不会丢数据」是两件事**。类型完全对不上（int 装字符串）它拦下；类型勉强对得上（double 装进 int）它放行，哪怕这一放就把 0.7 弄丢了。所以看代码时别只问「能编译吗」，要多问一句「这一步谁的手艺会把数弄掉」。` },
        { t: `h2`, text: `演示 3 · 同一句话，两种盒子两种下场` },
        { t: `code`, lang: `c++`, code: `#include <print>

int main() {
    int    wrong = 92.5;     // int 盒：小数被砍
    double right = 92.5;     // double 盒：原样收下

    std::println("wrong = {}", wrong);   // wrong = 92
    std::println("right = {}", right);   // right = 92.5

    right = 7;               // double 盒装整数：可以，变成 7.0
    std::println("right 换成整数之后 = {}", right);   // 7

    return 0;
}` },
        { t: `p`, text: `两条规则合起来记：**往窄盒子里装宽东西，会丢（砍小数）；往宽盒子里装窄东西，安全（整数变 .0）。** 所以「盒子选宽一点」在拿不准的时候是保守做法 —— 代价是占的内存大些（double 占 8 字节，int 占 4 字节，上一课那张图就是这个差别）。反过来说，明知是整数却图省事用 double，就会打出 7 而不是 7.0 这种看着对、拼字符串时又不对的东西，也别干。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `以为 age = 3.7 会四舍五入成 4。不会，是砍尾巴成 3；想四舍五入得自己写（以后教）。`,
          `平均分写成 sum / n，sum 和 n 都是 int，小数部分全没了 —— 两个整数相除永远是整数。先把一边换成 double 再除。`,
          `看到类型不匹配的报错就用强制转换硬糊过去。转换是「我确认要丢数据」的宣言，不是遮羞布；每写一个，都要能说出为什么这里丢得起。`,
          `编译器警告（warning）不当回事。警告不拦你编译，但它说的往往就是本课这种「悄悄转换」，警告清零再谈别的。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `解开 age = "十五"; 的注释，读一读报错信息第一行说了什么。`,
          `试试 age = 3.2; 和 age = 3.9;，确认都是砍尾巴成 3，不是四舍五入。`,
          `思考：为什么 age = 3.7 编译器不报错？（提示：有时你就是故意只想要整数部分）`,
          `再试一个负数：age = -0.9; 打印出来是几？用一句话说清「向零砍」和「向下砍」的差别。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：类型对不上编译器拦下；但小数进 int 是砍尾巴的「悄悄转换」，编译不报错 —— 丢不丢数据，得你自己把关。` }
      ]
    },
    {
      id: `c04`, title: `第 4 课 · auto：让编译器猜类型`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会用 auto 少写一遍类型，会用 sizeof 亲眼验证编译器猜成了什么 —— 以及记住 auto 猜完照样定死。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `写 int a = 10; 的时候，右边 10 一看就是整数，左边再写一遍 int 纯属重复劳动。**auto** 的意思就是：右边是什么类型，左边就当什么类型，编译器替你写。` },
        { t: `p`, text: `两句话先把边界划清。第一，auto **不是「没有类型」**，是「让编译器替你写类型」：猜完之后类型照样定死，跟手写没有任何区别，后面塞别的类型照样报错。第二，auto 只有在**右边一眼能看出类型**时才好用；右边看不出来的时候（下一课就是个反面教材），老实手写。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `auto 这个关键字 2011 年才进标准，动机很实际：C++ 的类型名可以长到没法写 —— 以后你会见到形如「某个容器里某个位置的迭代器」这种类型，手写几十个字母，还容易记错。auto 让编译器去抄，抄得比人准。顺带它还管另一件小事：**声明和初值天生配对**，你写 auto 就必须给初值（不给初值编译器无从猜起），于是上一课那个「忘了初始化装了一盒子垃圾」的坑，auto 帮你天然堵住一半。` },
        { t: `p`, text: `但它不是「自由类型」。请把 auto 理解成**抄写员**：它抄右边的类型，抄完就定死，不参与你后面任何决定。想清楚这一点，下面那条字节数对照表就不难理解 —— 猜的结果是一个真实类型，不是一个模糊状态。` },
        { t: `h2`, text: `演示 1 · 三个 auto` },
        { t: `code`, lang: `c++`, code: `#include <print>

int main() {
    auto count = 10;        // 右边是整数 → 猜成 int
    auto height = 172.5;    // 右边是小数 → 猜成 double
    auto flag = true;       // 右边是布尔 → 猜成 bool

    std::println("count = {}, height = {}, flag = {}", count, height, flag);

    return 0;
}` },
        { t: `p`, text: `猜是猜了，凭什么信它？**sizeof** 给你一双眼睛：sizeof(x) 返回 x 在内存里占几个字节（字节是内存计量单位，1 字节 = 8 个二进制位）。类型不同占的字节数不同，一看字节数就知道编译器把它当成了什么。` },
        { t: `h2`, text: `演示 2 · 用 sizeof 验证猜测` },
        { t: `code`, lang: `c++`, code: `auto count = 10;
auto height = 172.5;
auto flag = true;
std::println("count  占 {} 字节（int 是 4）", sizeof(count));
std::println("height 占 {} 字节（double 是 8）", sizeof(height));
std::println("flag   占 {} 字节（bool 是 1）", sizeof(flag));` },
        { t: `p`, text: `三个字节数对上三种类型，猜测坐实。sizeof 是个很好用的探针，以后学到更复杂的类型，怀疑「这玩意到底多大」，sizeof 一下就有答案。` },
        { t: `h2`, text: `演示 3 · 猜完定死` },
        { t: `code`, lang: `c++`, code: `auto height = 172.5;
// height = "高";    // ← 解开注释照样报错：height 已被猜成 double，int 盒规矩全适用` },
        { t: `p`, text: `auto 声明的变量和手写类型的变量从这一刻起**没有任何区别** —— 该拦的照拦，该砍尾巴的照砍。auto 不是法外之地。` },
        { t: `p`, text: `那什么时候值得写 auto？记这条够用很久的判断：**右边的类型一眼看得出来，就写 auto；看不出来，就手写。** auto count = 10 属于前者（10 就是整数，没什么可猜）；而以后你会遇到右边是一长串计算结果、或者类型名字比变量名还长的时候，那才是 auto 真正省下事的地方 —— 那时它的价值不是「少打几个字」，是「不用抄一遍你自己也记不住的长类型」。` },
        { t: `svg`, caption: `auto 的工作时序：编译器看一眼右边，把类型抄到左边，然后这张纸就烧掉了`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 200">
  <g font-size="13" fill="#142639">
    <rect x="20" y="52" width="150" height="60" rx="10" fill="#eef3fa" stroke="#2f6feb" stroke-width="2"/>
    <text x="95" y="78" text-anchor="middle" font-weight="700">你写的这一行</text>
    <text x="95" y="98" text-anchor="middle" fill="#57677c" font-family="monospace">auto x = 10;</text>
    <path d="M180 82 H236" stroke="#57677c" stroke-width="2.5"/>
    <polygon points="236,82 224,76 224,88" fill="#57677c"/>
    <rect x="244" y="46" width="152" height="72" rx="10" fill="#00599c"/>
    <text x="320" y="72" text-anchor="middle" font-weight="700" fill="#ffffff">编译器看右边</text>
    <text x="320" y="92" text-anchor="middle" fill="#cfe0f2">10 是整数</text>
    <text x="320" y="110" text-anchor="middle" fill="#cfe0f2">→ 抄成 int</text>
    <path d="M406 82 H462" stroke="#57677c" stroke-width="2.5"/>
    <polygon points="462,82 450,76 450,88" fill="#57677c"/>
    <rect x="470" y="52" width="150" height="60" rx="10" fill="#eef3fa" stroke="#2f6feb" stroke-width="2"/>
    <text x="545" y="78" text-anchor="middle" font-weight="700">从此定死</text>
    <text x="545" y="98" text-anchor="middle" fill="#57677c" font-family="monospace">int x = 10;</text>
  </g>
  <text x="20" y="150" font-size="13" fill="#57677c">这一步只发生在编译时，运行时没有任何「猜测」；所以 auto 既不慢也不松。</text>
  <text x="20" y="176" font-size="13" font-weight="700" fill="#142639">想验它到底抄成了什么：sizeof(x) 打字节数（int 4、double 8、bool 1）。</text>
</svg>` },
        { t: `h2`, text: `演示 4 · 不写变量，直接探字面量` },
        { t: `code`, lang: `c++`, code: `std::println("{}", sizeof(10));      // 4 —— 整数字面量是 int
std::println("{}", sizeof(10.0));    // 8 —— 带小数点的字面量是 double
std::println("{}", sizeof(true));    // 1 —— 布尔字面量是 bool
std::println("{}", sizeof(1e3));     // 8 —— 科学计数法也是 double` },
        { t: `p`, text: `这一手在排错时特别省事：怀疑某个表达式被猜成了什么类型，直接 sizeof 一下。注意最后那行 —— 1e3 就是 1000，可它写成了带 e 的形式，字面量类型就是 double 而不是 int。以后你会撞上「值看起来是整数，类型却是 double」的情况，根源常常就在这儿：**类型跟着写法走，不跟着数值走。**` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把 auto 当成 Python 的「随便装」。auto 只在声明那一刻看右边的类型，之后就焊死了；想要一个能换类型的盒子，C++ 里没有这种东西。`,
          `右边是整数就猜 int，可你想要小数。auto x = 10 得到 int 盒，后面 x / 4 整除砍尾巴 —— 想要小数，右边写成 10.0，别指望 auto 帮你升级。`,
          `到处都是 auto。类型一眼能看出来才值得 auto；满屏 auto 读代码的人反而要猜来猜去，可读性是给自己攒的。`,
          `以为 sizeof 返回的是「字符个数」。它返回**字节数**，跟内容的长度没关系，中文一个字占几字节这类问题后面专门讲。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `用 auto 声明 3 个变量描述自己，先猜类型，再用 sizeof 验证。`,
          `把 172.5 改成 172（整数），sizeof 变成几？为什么？`,
          `故意给 auto 声明的整数变量塞一个字符串，把报错第一行抄下来，确认 auto 猜完真的定死。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：auto = 让编译器把右边的类型抄到左边；猜完定死，sizeof 是你验证猜测的探针。` }
      ]
    },
    {
      id: `c05`, title: `第 5 课 · auto 的字符串坑：号牌不是工具`,
      /* length() 是第 13 课才系统教的东西，这章只是演示 std::string 有功能、正文当场讲明白 ——
         例外必须在闸上点名（cpp-audit 的 allowConstructs），不许整体放松。 */
      allowConstructs: [`member-call`],
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：分清双引号字符串的两种拿法 —— auto 接到的是 8 字节号牌，std::string 才是字符串工具。这一坑新手必踩，提前踩明白。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `"小明" 这种双引号直接写出来的东西，是 C 语言时代传下来的写法，专业名词叫**字符串字面量**。它的真身不是「一串字」，而是一个**地址号牌**：8 个字节的数字，记着「这一串字符在内存里的起点在哪」。你能顺着号牌找到那串字、能把它打印出来，但号牌本身只是一张纸条。` },
        { t: `p`, text: `现代 C++ 另有一套正经的字符串工具：**std::string**。它能求长度、能拼接、能增删改，内存自己管 —— 你把它当一个「会自己长大的文本盒」用就行。两者打印出来一模一样，功能天差地别，而 **auto 只认右边的字面类型**：右边写的是字面量，auto 就给你号牌，绝不会好心地给你工具。这就是本课标题里那个坑。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `为什么不是一种字符串，而是一张号牌？历史原因：C++ 要兼容 C，而 C 语言里没有「字符串类型」，只有一条约定 —— 一串字符排在一起，末尾放一个 0 当结束记号，谁要处理字符串就把「起点地址」递来递去。这套约定快、省内存，至今还在底层接口里用，所以 C++ 留着它；但它太容易出事（不知道长度、忘了结束记号就越界读到别人的内存），于是标准库又造了 std::string 这个工具盒，把长度、内存、拷贝全管起来。**现代 C++ 写业务代码用 std::string，号牌只在你要跟底层接口打交道时才需要。** 这就是为什么第 4 课学的 auto 在这里会咬人：auto 抄的是字面量的类型，而字面量的类型恰恰是那个老号牌。` },
        { t: `p`, text: `顺带说清一件事：**这不是编译器抽风，是它在忠实汇报。** auto 的规矩只有一条 —— 右边是什么就抄什么。「小明」这个字面量的类型就是号牌，所以抄来的就是号牌。你觉得它「应该」是字符串，那是你的意图，编译器不知道意图；要表达意图就把它写出来：std::string。这个「想要就说清楚」的取向，整门课都会一遍遍撞见。` },
        { t: `h2`, text: `演示 1 · 同一个双引号，两种拿法` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>

int main() {
    auto name = "小明";          // ← 坑：拿到 8 字节号牌
    std::string name2 = "小明";  // ← 对：拿到字符串工具

    std::println("auto 接双引号 占 {} 字节", sizeof(name));
    std::println("std::string     占 {} 字节", sizeof(name2));
    std::println("打印效果一样: {} / {}", name, name2);

    return 0;
}` },
        { t: `p`, text: `sizeof 上一课学的探针立刻见效：name 是 8 字节（号牌的大小），name2 是 std::string 这个工具自身的大小（几十字节，装着文本和一肚子功能）。打印效果一样，身份完全不同。` },
        { t: `h2`, text: `演示 2 · 功能差在哪` },
        { t: `code`, lang: `c++`, code: `std::string name2 = "小明";
std::println("name2 能求长度: {}", name2.length());
// ↑ 6 是字节数：UTF-8 里一个汉字占 3 字节（细节以后再说，先知道 length() 能用）

// name.length();   // ← 解开注释：编译报错！号牌上没有这些功能
// name2 = name2 + "同学";  // 工具能拼接，号牌不能` },
        { t: `p`, text: `name2.length() 是「工具上的功能」：问它这串文本有多长，答 6 —— UTF-8 编码里一个汉字占 3 字节，两个汉字就是 6。注意这是**字节数不是字数**，中文场景里要心里有数。name 那张号牌上没有任何功能可调，编译器直接报「号牌没有这个东西」。` },
        { t: `h2`, text: `演示 3 · 工具的用法长什么样` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>

int main() {
    std::string first = "小明";
    std::string second = "同学";
    std::string both = first + second;        // 拼接：交出一份新的
    std::println("both = {}", both);          // both = 小明同学
    std::println("both 占 {} 字节", both.length());   // 12：四个汉字 × 3
    first = first + second;                   // 也可以写回自己
    std::println("first = {}", first);        // first = 小明同学

    return 0;
}` },
        { t: `p`, text: `三条要点都在这一段里：**加号拼两个工具盒，结果是新的一个**；**length() 报的是字节数**，UTF-8 下一个汉字占 3 字节，所以「小明同学」是 12 不是 4；**写回自己要用 first = first + ...**，等号左边不接，拼出来的那份就被扔掉了。以后你会看到 += 这种省事写法，那是后面一课的正事，今天先老实地写回去。` },
        { t: `h2`, text: `结论` },
        { t: `p`, text: `要拿双引号字符串当**字符串工具**用，老实写 std::string，别用 auto 接。什么时候 auto 接字符串不踩坑？等学到指针、看懂号牌到底是什么的那一课，你自然会知道什么时候号牌也有用 —— 在那之前，字符串一律 std::string。` },
        { t: `p`, text: `顺便把两件容易混的事分开：**号牌照样能打印**（std::println 会顺着它把字符找出来念给你听），所以「打出来一样」骗过了很多新手；差别在你想**做点什么**的时候才露出来 —— 求长度、拼接、比较、增删，这些都在工具上，号牌上一个都没有。` },
        { t: `svg`, caption: `同一段双引号，两种拿法的真实身份`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 230">
  <text x="320" y="24" font-size="14" font-weight="700" fill="#142639" text-anchor="middle">源码里写的都是同一段："小明"</text>
  <g font-size="13">
    <rect x="24" y="44" width="290" height="150" rx="12" fill="#fdece1" stroke="#b8500f" stroke-width="2"/>
    <text x="169" y="68" text-anchor="middle" font-weight="700" fill="#b8500f">auto name = "小明";</text>
    <text x="169" y="90" text-anchor="middle" fill="#5a4a41">拿到的是一张 8 字节号牌</text>
    <rect x="115" y="104" width="108" height="26" rx="4" fill="#ffffff" stroke="#b8500f" stroke-width="1.5"/>
    <text x="169" y="122" text-anchor="middle" font-family="monospace" fill="#b8500f">0x…（起点）</text>
    <text x="40" y="156" fill="#5a4a41">能：打印出来看</text>
    <text x="40" y="176" fill="#b8500f" font-weight="700">不能：.length() 、+ 拼接</text>
    <rect x="326" y="44" width="290" height="150" rx="12" fill="#eaf3fb" stroke="#00599c" stroke-width="2"/>
    <text x="471" y="68" text-anchor="middle" font-weight="700" fill="#00599c">std::string name2 = "小明";</text>
    <text x="471" y="90" text-anchor="middle" fill="#26405a">拿到的是会自己长大的文本盒</text>
    <rect x="386" y="104" width="170" height="26" rx="4" fill="#ffffff" stroke="#00599c" stroke-width="1.5"/>
    <text x="471" y="122" text-anchor="middle" font-family="monospace" fill="#00599c">小明 + 一肚子功能</text>
    <text x="342" y="156" fill="#26405a">能：打印、求长度、拼接、比较</text>
    <text x="342" y="176" fill="#00599c" font-weight="700">内存它自己管，你不用操心</text>
  </g>
  <text x="24" y="216" font-size="13" fill="#57677c">sizeof 一探就露馅：号牌固定 8 字节，工具盒子几十字节 —— 跟装了几个字没关系。</text>
</svg>` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `auto name = "小明"; 然后调 name.length()，报一大串 error。根因是号牌没功能；改成 std::string 就好。`,
          `以为报错是编译器坏了或版本不对。不是，这是类型系统在正确地工作 —— 看懂这条报错，你对「号牌 vs 工具」的理解就过关了。`,
          `拿 sizeof(string) 和 sizeof(auto 变量) 的差值当「文本长度」。std::string 那几十字节是工具自身的开销，跟装了几个字基本无关。`,
          `两个号牌用 + 拼接。号牌是数字，加法是数字加法，就算碰巧编译过也完全不是你想要的意思 —— 拼接请用 std::string。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `给 name2 拼接：name2 = name2 + "同学"; 打印结果。`,
          `试着给 name 拼接，看看报什么错。`,
          `背住这句：auto s = "abc" 得到的不是 string。`,
          `用 std::string 装一句自己的签名，用 length() 看它占几字节，除以汉字个数验证「一个汉字 3 字节」。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：双引号字面量是地址号牌，std::string 是工具；auto 只认字面类型，接字符串拿到的永远是号牌。` }
      ]
    }
  ]
};
