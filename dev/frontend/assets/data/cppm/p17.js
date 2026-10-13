/* 喵站 · C++ 掌握 正文分部 p17：第 141–144 课（第九轮）
 *
 * 源稿：141_从源码到程序的四步.cpp、142_头文件与源文件.cpp、143_防止重复包含.cpp、144_编译命令与CMake.cpp
 * 这四课是「编译链接与工程拆分」：代码不止一个文件，所以每个代码块块首都标清它属于哪个文件。
 * 本机 g++ 15.2.0 实跑核对；cmake 本机未安装，凡未实跑的构建输出正文里都明说了。
 */
window.MIAO_CPPM_P17 = {
  chapters: [
    {
      id: `m141`, title: `第 141 课 · 从源码到程序的四步：一条 g++ 命令其实是四站连跑`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：说清 .cpp 变成可执行文件中间经过的四站 —— 预处理、编译、汇编、链接，每站的产物是什么、报错长什么样子，以及为什么「少写一份实现」要到最后一站才报。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `前两课把动机讲完了：第 139 课说清「一个文件写天下」撑不住，第 140 课说清 #include 就是抄写员复制粘贴。本课回答紧跟其后的那个问题 —— 这些 .cpp 到底怎么变成一个能跑的程序。源稿那句类比很实在：.cpp 是给人看的菜谱，电脑只认做好的菜。菜谱不能当饭吃，中间必须有一条流水线。` },
        { t: `p`, text: `这条流水线有四站，平时被一条 g++ 命令打包在一起，所以你从没见过中间产物。**预处理**：抄写员干活，把 #include 的内容原样抄进来，把第 140 课那种 #define 宏机械替换掉，条件编译里该剪的分支剪掉。它不懂 C++，只碰文本。**编译**：真正的翻译官上场，把展开完的一大坨源代码翻译成汇编语言，你写的每一句 std::println 都在这站被检查合不合语法。**汇编**：把汇编指令变成机器码，写成 .o 文件 —— 这是半成品，函数体已经是指令，但「我调的那个 add 住在哪儿」它答不出来，格子留着空。**链接**：把所有 .o 凑到一起填上真实地址，再挂上标准库里现成的实现，输出可执行文件。` },
        { t: `code`, lang: `text`, code: `① 预处理   g++ -E   main.cpp → main.i   抄头文件、换宏，纯文本活
② 编译     g++ -S   main.i  → main.s   翻译成汇编，语法错误在这站报
③ 汇编     g++ -c   main.s  → main.o   变机器码，别人的符号留一个空格
④ 链接     g++      所有 .o → app      填空格 + 挂标准库，缺块就报错` },
        { t: `p`, text: `切成四站有什么好处？因为每站只管一件事，报错的长相就跟着分站。**语法写错了，第二站当场拦**：实测一句 std::println 的参数位置空着，编译器报 expected primary-expression before ')' token，行列都给你。**写了声明却没给实现，前三站一路绿灯**：实测 nm -C 那份 main.o，符号表里明明白白一行 U add(int, int)，那个 U 就是「欠着的一笔」；一直到第四站链接器翻遍所有 .o 找不到人，才报 undefined reference。这两句话的差别，从下一课起会天天遇到。` },
        { t: `p`, text: `还有一条只有四站模型才解释得通的事：**每个 .cpp 各自走完前三站，只有第四站要所有人到齐**。这正是第 139 课那句「改一处只重编那一处」的机制 —— 你动 student.cpp，main.o 一个字节都没变。而头文件根本不单独走流水线：它没有 .o，它被抄进每一个用到它的 .cpp 里，所以它在编译命令里不该露面。` },
        { t: `svg`, caption: `四站流水线：前三站按「一个源文件」各跑一次，第四站把所有半成品凑齐。实测七行的 main.cpp 预处理后展开成 65,785 行，欠着的 add 靠链接补上`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 306">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">一条 g++ 命令，其实是这四站连跑</text>
  <g font-size="12" fill="#26405a">
    <rect x="16" y="40" width="132" height="34" rx="6" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
    <text x="82" y="62" text-anchor="middle" font-weight="700">main.cpp</text>
    <rect x="176" y="40" width="132" height="34" rx="6" fill="#ffffff" stroke="#57677c" stroke-width="2"/>
    <text x="242" y="62" text-anchor="middle">① 预处理 -E</text>
    <rect x="336" y="40" width="132" height="34" rx="6" fill="#ffffff" stroke="#57677c" stroke-width="2"/>
    <text x="402" y="62" text-anchor="middle">② 编译 -S</text>
    <rect x="496" y="40" width="128" height="34" rx="6" fill="#ffffff" stroke="#57677c" stroke-width="2"/>
    <text x="560" y="62" text-anchor="middle">③ 汇编 -c</text>
    <path d="M148 57 H172" stroke="#57677c" stroke-width="2.5"/><polygon points="172,57 162,51 162,63" fill="#57677c"/>
    <path d="M308 57 H332" stroke="#57677c" stroke-width="2.5"/><polygon points="332,57 322,51 322,63" fill="#57677c"/>
    <path d="M468 57 H492" stroke="#57677c" stroke-width="2.5"/><polygon points="492,57 482,51 482,63" fill="#57677c"/>
    <text x="176" y="94" fill="#33465e">抄 include、换宏</text>
    <text x="176" y="112" fill="#1d7a3c">main.i 实测 65,785 行</text>
    <text x="336" y="94" fill="#33465e">语法在这站检查</text>
    <text x="336" y="112" fill="#1d7a3c">main.s 汇编文本</text>
    <text x="496" y="94" fill="#33465e">变机器码</text>
    <text x="496" y="112" fill="#1d7a3c">main.o 实测 488 KB</text>
    <text x="16" y="94" fill="#33465e">你的七行源码</text>
    <text x="16" y="112" fill="#b8500f">符号表里 U add</text>

    <path d="M560 122 V150 H380" stroke="#57677c" stroke-width="2.5" fill="none"/><polygon points="380,150 390,144 390,156" fill="#57677c"/>
    <rect x="16" y="132" width="132" height="34" rx="6" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
    <text x="82" y="148" text-anchor="middle">add.cpp 走同样</text>
    <text x="82" y="162" text-anchor="middle">三站，得 add.o</text>
    <path d="M148 149 H232" stroke="#57677c" stroke-width="2.5"/><polygon points="232,149 222,143 222,155" fill="#57677c"/>
    <rect x="238" y="132" width="140" height="34" rx="6" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/>
    <text x="308" y="154" text-anchor="middle" font-weight="700">④ 链接</text>
    <rect x="406" y="132" width="132" height="34" rx="6" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1.5" stroke-dasharray="4 3"/>
    <text x="472" y="148" text-anchor="middle">标准库里</text>
    <text x="472" y="162" text-anchor="middle">现成的实现</text>
    <path d="M538 149 H560" stroke="#57677c" stroke-width="2.5"/><polygon points="560,149 550,143 550,155" fill="#57677c"/>
    <rect x="566" y="132" width="58" height="34" rx="6" fill="#eaf3fb" stroke="#00599c" stroke-width="2"/>
    <text x="595" y="154" text-anchor="middle">app</text>

    <rect x="16" y="184" width="608" height="52" rx="8" fill="#fdece1" stroke="#b8500f" stroke-width="1.5"/>
    <text x="30" y="206" fill="#b8500f">第二站的报错：expected primary-expression —— 语法没写对，翻译官当场拦。</text>
    <text x="30" y="226" fill="#b8500f">第四站的报错：undefined reference to add —— 前三站全绿，链接器才翻脸。</text>

    <text x="16" y="264" fill="#00599c" font-weight="700">关键认知：每个 .cpp 各自走完前三站，只有第四站要所有人到齐。</text>
    <text x="16" y="288" fill="#33465e">头文件不单独走流水线 —— 它没有 .o，它被抄进每个用到它的 .cpp 里。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `这套模型是从 C 时代继承来的，前三站的工作单位叫**编译单元** —— 一个 .cpp 加上它被抄进来的全部内容。抓住这个词，以后一堆怪事都有了落脚处：为什么头文件里通常不写函数体（它会被抄进好几个编译单元，每个都生成一份实现）、为什么报错一会儿来自编译器一会儿来自 ld（那确实是两个人在说话）。` },
        { t: `p`, text: `半成品能缓存在磁盘上也是有意为之。.o 是真实文件，能留着复用。构建工具干的核心事情只有一件：算清哪些 .o 过期了，只重跑那几站，最后重新链接。make、ninja、CMake 名字不同，盘算的都是这张依赖图 —— 本号段最后一课正面讲它。` },
        { t: `h2`, text: `演示 1 · 源稿这段：四站各干什么，先记一遍` },
        { t: `code`, lang: `c++`, code: `#include <print>       // main.cpp：源稿原样，四行自我介绍
int main() {
    std::println("① 预处理  把 #include 的头文件抄进来");
    std::println("② 编译    翻译成汇编，语法错误在这步报出");
    std::println("③ 汇编    变成目标文件 main.o");
    std::println("④ 链接    把所有 .o 拼成可执行文件，缺块就报错");
    return 0;
}` },
        { t: `p`, text: `实测四行原样打出来。这份代码只有一个文件，所以第四站只用补标准库的账；下一课开始才有真正的多文件。注意第二行那句「语法错误在这步报出」——它是本课最实用的一条结论：报错第一行写着 error: 的是编译器，写着 ld 的是链接器，两者的修法完全不同。` },
        { t: `h2`, text: `演示 2 · 把四站拆开，亲手各跑一次` },
        { t: `code`, lang: `shell`, code: `# main.cpp 里只声明 int add(int, int)，实现住在 add.cpp
g++ -std=c++23 -E main.cpp -o main.i    # ① 抄写
g++ -std=c++23 -S main.cpp -o main.s    # ② 翻译
g++ -std=c++23 -c main.cpp -o main.o    # ③ 汇编成半成品
g++ -std=c++23 -c add.cpp -o add.o      # 另一个文件，同样三站
g++ -std=c++23 main.o add.o -o app      # ④ 链接：空格子在这里填上
./app` },
        { t: `p`, text: `实测最后一行打出 hello 3。三件值得记住的事：其一，②③两站的输入可以直接给 .cpp，那几个中间文件是给人看现场用的；其二，把最后一行换成 ./main.o 是跑不起来的，实测报权限不够 —— 半成品不是程序；其三，④那一行只列 .o，一个 .h 都不列。` },
        { t: `h2`, text: `演示 3 · 本课任务：抄写员干完活以后，你的代码在哪儿` },
        { t: `code`, lang: `shell`, code: `g++ -std=c++23 -E main.cpp | wc -l
g++ -std=c++23 -E main.cpp | tail -n 12` },
        { t: `code`, lang: `text`, code: `65785
    ...
}
# 2 "main.cpp" 2
# 3 "main.cpp"
int add(int a, int b);
int main() {
    std::string s = "hello";
    std::println("{} {}", s, add(1, 2));
    return 0;
}` },
        { t: `p`, text: `实测七行的 main.cpp 展开成 65,785 行，你那几行老老实实躺在**最后**。前面六万多行全是抄进来的标准库，而 tail 里那些 # 号开头的行是行标记：预处理器用它记住「下面这段来自哪个文件的第几行」。没有这些标记，编译器报的行号就会指到 print 头文件里去。这就是第 140 课那句「它不懂 C++，只会照抄」的现场照片。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `以为「忘了实现」会在编译期被发现。实测把 add.cpp 从命令里去掉，前三站全绿，最后是一句 /usr/bin/x86_64-linux-gnu-ld.bfd 开头的 undefined reference to add，后面还跟一句 collect2: error: ld returned 1 exit status。根因不在你写的那一行，而在**少列了一个文件** —— 看到 ld 就先数命令里有几份 .cpp。`,
          `-std=c++23 忘了写。本机 g++ 15.2 默认按 C++17 走，实测报错是 error: 'println' is not a member of 'std'，看着像「标准库坏了」，其实是这一站用的是老字典。同一条命令补上 -std=c++23 立刻过。`,
          `被预处理那六万行吓住，以为「我的代码丢了」。grep 一下你的函数名，它就在最后。反过来说，编译报错的行列号都是**展开后**的位置，读报错要看 file:line:col 那个前缀，别拿 -E 的输出数行数对号。`,
          `把 .h 也列进编译命令。实测本机 g++ 不拦，照样链接出 app —— 但这条命令的语义是「把这几份 .cpp 各编一遍再链接」，头文件不该露面，它在每个 .cpp 里已经被抄进去了。别的编译器口味不一，写成 .cpp 才到处一样。`,
          `手搓 .o 之后忘了重编。实测把 add.cpp 改成多返回 100，只重编 add.o、main.o 原封不动拿去链接，跑出来是 hello 103 —— 这正说明「改一处只重编那一处」；但反过来，你改了源码却拿旧的 .o 去链接，程序照跑，跑的还是旧逻辑，一句报错都没有。这也是最后要交给构建工具管的原因。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `运行 g++ -E L4-04-3_build_steps.cpp | tail -n 12 —— 看抄写员干完活后，你的代码出现在哪。本机把它存成 main.cpp，命令补上 -std=c++23 再跑；顺手用 wc -l 数数展开成了多少行。`,
          `把四站拆开各跑一次，产出 main.i、main.s、main.o，然后回答：哪一站的产物还是人能读的文本，哪一站开始变成机器码。`,
          `延伸一：拿一份只声明了 add、命令里却不给 add.cpp 的工程，把链接报错原样抄下来，说清它和第二站语法报错的长相差别。`,
          `延伸二：试试 ./main.o 看系统怎么说；再试试 g++ -std=c++23 -c main.cpp add.cpp -o app，看清 -c 和链接不能混在同一句里。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：.cpp 到可执行文件要过四站 —— 预处理抄文件、编译翻汇编并管语法、汇编出 .o 半成品并留下空格、链接补齐所有 .o；一个 .cpp 走前三站，第四站要所有人到齐，这就是后面三课拆文件、加锁、写构建命令的地基。` }
      ]
    },
    {
      id: `m142`, title: `第 142 课 · 头文件与源文件：菜单只写有什么菜，后厨才写怎么做`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把一个类拆成三份文件 —— student.h 只放声明、student.cpp 只放实现、main.cpp 只管点菜，并说清每种漏写各自会看到什么报错。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 141 课那条流水线里有个事实很扎眼：**流水线的原料只有 .cpp，头文件不上流水线，它被抄进 .cpp**。本课就把这个事实落到纸面上：既然一个 .cpp 是一个独立的工作单位，那「有什么功能」和「功能怎么写」就不该挤在同一个文件里。源稿给的是三句话的类比 —— 头文件是菜单，只写有什么菜，不写怎么做；源文件是后厨，菜到底怎么做全在这儿；main.cpp 是顾客，看菜单点菜就行。` },
        { t: `p`, text: `这个类比里最值钱的是「菜单为什么够顾客用」。菜单上写着菜名和配料数量，顾客据此就能点单，他不需要知道锅怎么颠。代码里这行菜名加配料就是**签名**：Student(std::string name, double score) 说的是「交给我两个东西，一个字符串一个数」，至于构造函数体内是把值存进成员还是先打个日志，顾客一辈子都不该知道。签名和实现分家之后，**改实现不用重印菜单，改菜单才惊动所有人** —— 这就是拆文件换来的东西。` },
        { t: `code`, lang: `text`, code: `student.h     菜单：只有声明。class 的样子、每个方法的签名
student.cpp   后厨：方法到底怎么写。第一行就 #include "student.h"
main.cpp      顾客：#include "student.h"，只管按签名调用
编译命令      g++ -std=c++23 -Wall -Wextra main.cpp student.cpp -o app` },
        { t: `p`, text: `拆完以后要认准一个新词：**编译单元**。main.cpp 和 student.cpp 是两个各走前三站的单位，它们**各自**把 student.h 抄进自己肚子里 —— 所以同一份头文件会被读两遍、检查两遍。由此得出一条铁律：**头文件必须能被好几个 .cpp 抄而不打架**。这句话听着像废话，等两个头文件同时抄第三份时就出事了，那是下一课的正事。` },
        { t: `p`, text: `声明与实现分家，也让上一课那两个报错分工显形：main.cpp 里用 Student，只要菜单上有这一行，编译那站就能翻译过去，它不关心实现在哪；实现的事归链接那站。第 141 课 main.o 里那个 U add 空格，到这里变成一排：Student::Student、Student::name、Student::is_passed 全欠着，等 student.o 来填。` },
        { t: `svg`, caption: `同一份 student.h 被抄进两个编译单元，各出一个 .o；链接把两半拼起来，菜单上没有的东西一个也找不到`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 296">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">三份文件、两个编译单元、一次链接</text>
  <g font-size="12" fill="#26405a">
    <rect x="16" y="40" width="132" height="34" rx="6" fill="#eaf3fb" stroke="#00599c" stroke-width="2"/>
    <text x="82" y="62" text-anchor="middle" font-weight="700">student.h 菜单</text>
    <rect x="16" y="86" width="132" height="34" rx="6" fill="#ffffff" stroke="#57677c" stroke-width="1.5"/>
    <text x="82" y="101" text-anchor="middle">student.cpp</text>
    <text x="82" y="115" text-anchor="middle">后厨：写实现</text>
    <rect x="16" y="132" width="132" height="34" rx="6" fill="#ffffff" stroke="#57677c" stroke-width="1.5"/>
    <text x="82" y="147" text-anchor="middle">main.cpp</text>
    <text x="82" y="161" text-anchor="middle">顾客：点菜</text>

    <rect x="188" y="70" width="212" height="46" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
    <text x="294" y="90" text-anchor="middle">编译单元一：main.cpp</text>
    <text x="294" y="108" text-anchor="middle">+ 抄进来的 student.h</text>
    <rect x="188" y="126" width="212" height="46" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
    <text x="294" y="146" text-anchor="middle">编译单元二：student.cpp</text>
    <text x="294" y="164" text-anchor="middle">+ 抄进来的 student.h</text>
    <path d="M148 57 H168 V93 H184" stroke="#00599c" stroke-width="2" fill="none"/><polygon points="184,93 176,88 176,98" fill="#00599c"/>
    <path d="M148 57 H168 V149 H184" stroke="#00599c" stroke-width="2" fill="none"/><polygon points="184,149 176,144 176,154" fill="#00599c"/>
    <path d="M148 103 H184" stroke="#57677c" stroke-width="2.5"/><polygon points="184,149 174,149 174,139" fill="#57677c"/>
    <path d="M148 149 H184" stroke="#57677c" stroke-width="2.5"/><polygon points="184,149 174,143 174,155" fill="#57677c"/>

    <path d="M400 93 H442" stroke="#57677c" stroke-width="2.5"/><polygon points="442,93 432,87 432,99" fill="#57677c"/>
    <path d="M400 149 H442" stroke="#57677c" stroke-width="2.5"/><polygon points="442,149 432,143 432,155" fill="#57677c"/>
    <rect x="448" y="76" width="80" height="34" rx="6" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/>
    <text x="488" y="98" text-anchor="middle">main.o</text>
    <rect x="448" y="132" width="80" height="34" rx="6" fill="#ffffff" stroke="#8b98ab" stroke-width="1.5"/>
    <text x="488" y="154" text-anchor="middle">student.o</text>
    <path d="M528 93 H556 V118 H572" stroke="#57677c" stroke-width="2.5" fill="none"/>
    <path d="M528 149 H556 V124 H572" stroke="#57677c" stroke-width="2.5" fill="none"/>
    <rect x="540" y="180" width="84" height="34" rx="6" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/>
    <text x="582" y="202" text-anchor="middle" font-weight="700">app</text>
    <path d="M576 118 H596 V176" stroke="#1d7a3c" stroke-width="2.5" fill="none"/><polygon points="596,176 590,168 602,168" fill="#1d7a3c"/>
    <text x="448" y="196" fill="#33465e">链接：补齐</text>
    <text x="448" y="212" fill="#33465e">三个欠账符号</text>

    <rect x="16" y="230" width="608" height="44" rx="8" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1"/>
    <text x="30" y="250" fill="#33465e">菜单只被读，不被执行：头文件里没有一句是「怎么做」，所以它抄几遍都不产生第二份实现。</text>
    <text x="30" y="268" fill="#b8500f">反过来说，头文件里真写了函数体，两个编译单元就各生成一份 —— 实测链接报 multiple definition。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `三行声明换来的第一件事是**重编范围变小**：改 student.cpp 的实现，只有编译单元二过期，main.o 原封不动，重新链接一次就完 —— 第 139 课那笔账在这里有了机制解释。第二件事是**分工**：别人要用你的类，只要拿走 student.h 和 student.o，他看不见你怎么写的，照样编译得动。这两条合起来就是「菜单 + 后厨」这套设计的收益。` },
        { t: `p`, text: `写法上两条习惯照源稿：include 系统头用尖括号，include 自己的头用双引号 —— 本机实测两种写法都能编过，但语义是「去库目录找」和「先在当前目录找」，别混。另一条更要紧：**用了什么就自己请什么**。你的 .cpp 靠 main.cpp 顺手包过 <string> 来救场是最坏的赌法，抄写员看不见隔壁文件。` },
        { t: `h2`, text: `演示 1 · 源稿这段：一个文件里模拟三份` },
        { t: `code`, lang: `c++`, code: `#include <print>       // main.cpp：源稿原样，用横线注释分出三个区
#include <string>
class Student {
public: Student(std::string name, double score);
    std::string name() const;
private: std::string name_;  double score_;
};
Student::Student(std::string name, double score) : name_(name), score_(score) {}
std::string Student::name() const { return name_; }
int main() {
    Student s("小明", 92.5);
    std::println("{} 报到", s.name());
    return 0;
}` },
        { t: `p`, text: `实测输出 小明 报到。这份代码里最值得抄走的是 Student::Student 这个写法：类外定义方法，名字前面必须带上 **类名加两个冒号**，编译器才知道你写的是哪个类的哪一个。源稿那三行横线注释就是本课的三份文件，只是它们暂时挤在一个编译单元里。` },
        { t: `h2`, text: `演示 2 · 真拆成三个文件，顺带完成本课任务` },
        { t: `code`, lang: `c++`, code: `#include <string>      // student.h —— 菜单：只有声明，一句实现都没有
class Student {
public:
    Student(std::string name, double score);
    std::string name() const;
    bool is_passed() const;          // 本课任务：≥60 算及格
private:
    std::string name_;
    double score_;
};` },
        { t: `code`, lang: `c++`, code: `#include "student.h"   // student.cpp —— 后厨：实现全在这儿
Student::Student(std::string name, double score)
    : name_(name), score_(score) {}
std::string Student::name() const { return name_; }
bool Student::is_passed() const { return score_ >= 60; }` },
        { t: `code`, lang: `c++`, code: `#include <print>       // main.cpp —— 顾客：只看菜单点菜
#include "student.h"
int main() {
    Student s("小明", 92.5);
    Student late("小刚", 59.0);
    std::println("{} 报到，及格了吗：{}", s.name(), s.is_passed());
    std::println("{} 报到，及格了吗：{}", late.name(), late.is_passed());
    return 0;
}` },
        { t: `code`, lang: `shell`, code: `g++ -std=c++23 -Wall -Wextra main.cpp student.cpp -o app
./app` },
        { t: `p`, text: `实测两行输出：小明 报到，及格了吗：true 和 小刚 报到，及格了吗：false。三份文件都按各自的名字存在，命令里**只列两个 .cpp** —— student.h 不在名单上，它已经被抄进那两个单位里了。这份头文件暂时没上锁，因为每个文件只抄它一遍，还轮不到重复包含出事；什么时候会抄两遍，下一课正面讲。` },
        { t: `h2`, text: `演示 3 · 三种漏写，报错长相各不相同` },
        { t: `code`, lang: `text`, code: `漏 1  头文件里忘了 #include <string>
      student.h:3:24: error: expected ‘)’ before ‘name’
      student.h:4:10: error: ‘string’ in namespace ‘std’ does not name a type
漏 2  main.cpp 忘了 #include "student.h"
      main.cpp:3:5: error: ‘Student’ was not declared in this scope
漏 3  命令里少列 student.cpp
      main.cpp:(.text+0x67): undefined reference to ‘Student::is_passed() const’` },
        { t: `p`, text: `三条都实测过，读法各不一样。漏 1 的报错**指向头文件**，可头文件不是编译单元，它是在被某个 .cpp 抄进去的瞬间炸的 —— 所以那句 In file included from student.cpp:1 才是线索。漏 2 是编译期，说「这个菜单我没见过」，一句话点到位。漏 3 才是上一课讲的链接期，注意它报出来的名字长成一个怪物，中间塞满 basic_string、char_traits、allocator 这一串编译后的内部名字 —— 那是 mangling，丑不是你的错；你只要数一下有几行 undefined reference，就知道欠了几份实现。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把实现写进头文件。头文件会被抄进每一个用到它的 .cpp，每个编译单元都据此生成一份实现，链接期就撞车。实测一个头文件里写着普通函数体、两个 .cpp 各自 include 它，链接报 multiple definition of body，后面还跟一句 first defined here 指出另一份在哪。规矩是：头文件写声明，实现归 .cpp。`,
          `声明写进 student.cpp 而不是 student.h。后果很安静：student.o 里实现得好好的，main.cpp 却看不见这个类，编译直接报 ‘Student’ was not declared in this scope。菜单漏印一道菜，顾客就是点不了，哪怕后厨其实会做。`,
          `改完头文件却只重编一个文件。菜单一变，抄过它的编译单元全都过期了，必须一起重编 —— 手工敲命令时最容易漏，这也是本号段最后一课要交给工具管的原因。`,
          `在 student.h 里 include 一大串它其实不需要的东西。抄写员会照单全抄，六万多行这笔账第 141 课量过了：头文件每多请一位客人，所有抄它的 .cpp 都跟着多等一遍。头文件里只留自己签名真正用到的。`,
          `成员名和参数名一样、又忘了带类名前缀。类外定义方法必须写成 Student::name，写成裸的 name 就变成另一个不相干的函数，你的成员还是没实现 —— 报错落到漏 3 那一类，很费时间。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `照样子给 Student 加声明 is_passed() 和对应实现，60 分算及格，然后在 main 里打印出来 —— 演示 2 那三块代码就是完整答案，重点是菜单一行、后厨一行、顾客一行分别写在哪个文件里。`,
          `把三份文件各存一份，跑一次那条两个 .cpp 的编译命令，然后依次做三次破坏：删掉 student.h 里的 include 行、删掉 main.cpp 里的 include 行、命令里少写 student.cpp，把三条报错原样抄下来分个类。`,
          `延伸一：把 name 的函数体直接写进 student.h，让两个 .cpp 各 include 一次，看链接怎么说，再把它挪回 student.cpp。`,
          `延伸二：给 Student 再加一个方法 score_gap，返回离及格线还差几分，体会一次「菜单加一行、后厨加一行、顾客才能调一行」的三步手续。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：菜单 .h 只写签名，后厨 .cpp 只写实现，顾客 main.cpp 照菜单点菜；一个 .cpp 是一个编译单元、各自把 .h 抄进去，所以头文件里不该有实现，编译命令里也不该有它。` }
      ]
    },
    {
      id: `m143`, title: `第 143 课 · 防止重复包含：头文件第一行为什么都写 #pragma once`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：看清同一份头文件会在一个编译单元里被抄两遍、抄两遍之后报错长什么样子，再弄明白那把锁 —— #pragma once 与 #ifndef 三件套 —— 凭什么能把第二遍整段跳过。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课埋的话头在这里兑现。第 142 课写过一句铁律：头文件必须能被好几个 .cpp 抄而不打架。那时候的「打架」发生在两个编译单元之间，链接站各管各拼起来，看着相安无事。本课处理更靠前的一种 —— **同一个编译单元里，一份头文件被抄了两遍**。源稿给的路径最典型：a.h 和 b.h 都抄了 common.h，main.cpp 又同时 include a 和 b，common.h 就顺着两条路各进来一次。工程一大就躲不掉这种菱形。` },
        { t: `p`, text: `为什么第二遍一定炸？因为预处理不认识「这一段刚才抄过了」，它只管照抄。抄进来的是定义，而 C++ 规定同一份源码里同一个类型只能定义一次 —— 同一个名字被占了两次，第二站翻译官当场拦。本机实测最小例子：common.h 里就一行 struct Point 的两个成员，a.h、b.h 各抄它一次，main.cpp 同时抄 a.h 和 b.h，报错全文长这样。` },
        { t: `code`, lang: `text`, code: `In file included from b.h:1,
                 from main.cpp:2:
common.h:1:8: error: redefinition of ‘struct Point’
    1 | struct Point { int x; int y; };
      |        ^~~~~
In file included from a.h:1,
                 from main.cpp:1:
common.h:1:8: note: previous definition of ‘struct Point’` },
        { t: `p`, text: `这条报错有两个读法要领。其一，它指向 common.h，可头文件不是编译单元，它是在 main.cpp 肚子里炸的 —— 那两行 In file included from 才是抄写路线图，它把这次展开走了哪两条路给你画了出来。其二，error 和 note 是配对的：error 说这里第二次定义，note 说第一次就在刚才那一行。成对的两条指向同一个头文件，基本可以断定是重复包含，不用回头怀疑自己把 struct 写错了。` },
        { t: `p`, text: `解法源稿讲得极准：给头文件上一把锁 —— 第一遍进去后留个「已开门」标记，第二遍看见标记就直接跳过整段。#ifndef 三件套是把这句话写成代码，#pragma once 是它的现代简写：一行字，记账的事交给编译器。锁上之后 common.h 在这个编译单元里只算一遍，菱形结构不再有害。` },
        { t: `svg`, caption: `菱形包含：左半是没上锁的展开结果，同一份 common.h 顺着 a.h 与 b.h 各抄一次，编译单元里出现两份 struct Point，第二站报 redefinition；右半是上了锁的，第二遍走到门口看见标记，整段跳过，只剩一份`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 312">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">一份 common.h 被抄两遍，会怎么样</text>
  <g font-size="12" fill="#26405a">
    <rect x="252" y="32" width="136" height="30" rx="6" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
    <text x="320" y="52" text-anchor="middle" font-weight="700">main.cpp</text>
    <rect x="120" y="86" width="112" height="30" rx="6" fill="#ffffff" stroke="#57677c" stroke-width="2"/>
    <text x="176" y="106" text-anchor="middle">a.h</text>
    <rect x="408" y="86" width="112" height="30" rx="6" fill="#ffffff" stroke="#57677c" stroke-width="2"/>
    <text x="464" y="106" text-anchor="middle">b.h</text>
    <path d="M288 62 V74 H176 V82" stroke="#57677c" stroke-width="2" fill="none"/><polygon points="176,86 170,78 182,78" fill="#57677c"/>
    <path d="M352 62 V74 H464 V82" stroke="#57677c" stroke-width="2" fill="none"/><polygon points="464,86 458,78 470,78" fill="#57677c"/>
    <path d="M176 116 V132 H288" stroke="#b8500f" stroke-width="2.5" fill="none"/><polygon points="288,132 278,126 278,138" fill="#b8500f"/>
    <path d="M464 116 V132 H352" stroke="#b8500f" stroke-width="2.5" fill="none"/><polygon points="352,132 362,126 362,138" fill="#b8500f"/>
    <rect x="252" y="118" width="136" height="34" rx="6" fill="#fdece1" stroke="#b8500f" stroke-width="2"/>
    <text x="320" y="134" text-anchor="middle">common.h</text>
    <text x="320" y="148" text-anchor="middle">两条路各抄一次</text>

    <rect x="16" y="172" width="296" height="70" rx="8" fill="#f4f6f9" stroke="#b8500f" stroke-width="1.5"/>
    <text x="30" y="192" fill="#b8500f" font-weight="700">没锁：展开后 main.cpp 肚子里</text>
    <text x="30" y="212">struct Point 第一遍</text>
    <text x="30" y="230" fill="#b8500f">struct Point 第二遍 ← 撞了</text>

    <rect x="328" y="172" width="296" height="70" rx="8" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="1.5"/>
    <text x="342" y="192" fill="#1d7a3c" font-weight="700">上锁：第二遍走到门口</text>
    <text x="342" y="212">第一遍：抄内容，写下标记</text>
    <text x="342" y="230" fill="#1d7a3c">第二遍：见标记在，整段跳过</text>

    <rect x="16" y="256" width="608" height="42" rx="8" fill="#fdece1" stroke="#b8500f" stroke-width="1.5"/>
    <text x="30" y="274" fill="#b8500f">实测报错成对出现：error: redefinition of ‘struct Point’ 与 note: previous definition。</text>
    <text x="30" y="292" fill="#33465e">锁只管「一个编译单元里抄两遍」；两个编译单元各抄一遍是正常事，不是病。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `这把锁妙在它一点不碰类型系统。「开门标记」是一个宏，而宏在预处理层是全局的：同一个编译单元里只要第一遍把它 #define 上了，第二遍走到文件第一行就能问出来。三件套的形状因此固定 —— 第一行问标记在不在，不在就当场把标记写上，中间放内容，最后一行收尾。第二遍进来时这问题早有答案，从 #ifndef 到 #endif 之间整段被剪掉，这个文件在那一遍等于空文件。` },
        { t: `p`, text: `两种写法有分工。#pragma once 只有一行、不会漏收尾，本机实测它和三件套同时挂在一份头文件上也不报警；三件套是标准里的写法，任何编译器都认，还能在命令行上用 -D 提前把标记定义好，强行决定第二遍走哪条岔路 —— 本课任务改名那一下玩的正是这个开关。现实工程里常见两种一起上：pragma once 求省事，三件套保兼容。` },
        { t: `h2`, text: `演示 1 · 源稿这段：标记在不在，走的是两条岔路` },
        { t: `code`, lang: `c++`, code: `#include <print>
#define COMMON_H_OPENED            // 模拟第一遍包含后留下的标记
#ifdef COMMON_H_OPENED             // 第二遍走到这里：标记在……
#define LOCKED_VERSION 1           // ……才走这条
#endif
#ifndef COMMON_H_OPENED            // 标记已在，下面整段跳过
#define LOCKED_VERSION 999
#endif
int main() {
    std::println("内容只被定义了一次，值 = {}", LOCKED_VERSION);
    return 0;
}` },
        { t: `p`, text: `实测打出 内容只被定义了一次，值 = 1。这份代码把锁拆成两段看得见的岔路：前一段问「标记在吗」，在就写 1；后一段问「标记不在吗」，不在才写 999。同一个 COMMON_H_OPENED 不可能既在又不在，所以只有一条路干活。本课任务那一下改名也在这儿：把第二行的标记定义换成别的名字，COMMON_H_OPENED 就再没被定义过，实测值变成 999，走的是第二条岔路。` },
        { t: `h2`, text: `演示 2 · 真出事的工程：四个文件，一份被抄两遍的头` },
        { t: `code`, lang: `text`, code: `common.h   struct Point { int x; int y; };        // 故意不写锁
a.h        #include "common.h"
           void use_a(Point p);
b.h        #include "common.h"
           void use_b(Point p);
main.cpp   #include "a.h"
           #include "b.h"
           int main() { Point p{3, 4}; use_a(p); use_b(p); return 0; }` },
        { t: `code`, lang: `shell`, code: `g++ -std=c++23 -c main.cpp        # 只走前三站就够：报错本来就出在第二站` },
        { t: `p`, text: `实测这条命令报的就是上面那段 redefinition，一句到不了链接站 —— **重复包含是编译期的事，跟 .o 齐不齐无关**。换成演示 3 上了锁的版本，同一条命令立刻安静通过：报错的有无只取决于那三行锁，你写的代码一个字没动。` },
        { t: `h2`, text: `演示 3 · 上锁：一行版与三件套版` },
        { t: `code`, lang: `c++`, code: `#pragma once                 // common.h —— 一行版
struct Point { int x; int y; };` },
        { t: `code`, lang: `c++`, code: `#ifndef COMMON_H             // common.h —— 三件套版
#define COMMON_H
struct Point { int x; int y; };
#endif` },
        { t: `code`, lang: `shell`, code: `g++ -std=c++23 -c main.cpp && echo 上锁后编译通过
ls main.o` },
        { t: `p`, text: `实测两版都把那条菱形压了下去，最后一行打出 上锁后编译通过 并列出一句 main.o。三件套那个宏名按惯例是文件名大写加 _H，它从不被读取，作用纯粹是占个名字 —— 名字撞车会出事，见常见坑第一条。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `两份不同的头文件用了同一个锁名。实测 x.h 和 y.h 都写 #ifndef COMMON_LOCK，x.h 先把标记占下，y.h 整段被跳过，报错是 main.cpp:3:26: error: ‘only_in_y’ was not declared in this scope; did you mean ‘only_in_x’? 根因是锁名必须全局唯一：一律按文件名大写再加 _H，别图省事复用。`,
          `三件套忘写最后那句 #endif。实测报的是 badendif.h:1: error: unterminated #ifndef —— 它指着第一行，看着莫名其妙，其实是三连没关门，预处理一路找到文件尾还没等到收尾。三行是一行都不能少的一副形状。`,
          `锁写在了内容后面。#pragma once 或 #ifndef 必须占第一行：实测把 struct Point 挪到标记之前，第二遍照样撞，报错原样回来 —— 抄到那一行时标记还没写上。`,
          `以为上了锁就天下太平。锁只管「同一个编译单元里抄两遍」这一种；两个编译单元各抄一遍是设计内的正常事，各自的标记互不相干。上一课那条 multiple definition 不吃锁，它的药方是头文件里别写实现。`,
          `半锁：加了锁却忘了往后盖。实测一份 common.h 里 #endif 之后就剩一行裸奔的 struct Label，a.h、b.h 各抄一次，报错是 common.h:5:8: error: redefinition of ‘struct Label’ —— 同一份文件里 Point 安稳、Label 撞车。加完内容回头扫一眼：锁要盖到文件末尾。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把 COMMON_H_OPENED 改名成别的，看值变成 999，体会「锁」如何放行第一遍 —— 就改演示 1 那份文件的第二行，改完重新编一次，两条命令各跑一遍对比。`,
          `把演示 2 那四个文件按名字建出来，先不加锁，把报错原样抄下来，数一数 In file included from 出现了几次；再给 common.h 加上 #pragma once 复跑同一条命令，确认报错消失。`,
          `延伸一：把 common.h 改成三件套版，然后故意让 a.h 也用上 COMMON_H 这个锁名，看那条 was not declared in this scope 是怎么来的。`,
          `延伸二：拿上一课那三份文件，给 student.h 同时挂上 #pragma once 和三件套，实测本机对这份头文件一句警告都不给，程序照跑 —— 说说两种写法各自的好处。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：头文件的第一行就是那把锁 —— 第一遍进来写下标记，第二遍看见标记整段跳过；重复包含报的是编译期那对 redefinition 与 previous definition，而两个编译单元各抄一遍从来不是病，别拿锁去治它。` }
      ]
    },
    {
      id: `m144`, title: `第 144 课 · 编译命令与 CMake：一条 g++ 怎么拼，四行 CMakeLists 又替你敲了哪条`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：逐项讲清多文件编译命令 —— 标准开关、警告开关、.cpp 名单、产物名，再对上 CMakeLists.txt 那四行。本机没装 cmake，没实跑的部分正文里点明了。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `前三课的账攒到今天这一条命令上。第 141 课说清流水线四站，第 142 课把类拆成菜单与后厨，第 143 课给头文件上了锁 —— 现在工程里有好几个 .cpp 了，得有人把它们凑成一个程序。源稿给的那条就是本机天天敲的写法：**g++ -std=c++23 -Wall -Wextra main.cpp student.cpp -o app**。每一段都在干活，写错哪一段都有一种固定的报错长相。` },
        { t: `code`, lang: `text`, code: `g++      用哪个工具：它一人管完四站
-std=c++23  字典版本：不写就按编译器默认走，本课的 std::println 就不认识
-Wall -Wextra  免费纠错老师：不开也能编过，开了才看得见暗坑
main.cpp student.cpp  要编译的编译单元，一人一份；头文件不在名单上
-o app   给最后一站的产物起名` },
        { t: `p`, text: `名单这一行最要紧：**列的是 .cpp，一个文件一个编译单元**，g++ 替每一份各走前三站，最后一起链接；头文件不露面，它早在每个 .cpp 里被抄进去了。名单写错有两副面孔，本机都实测过：少列一份 utils.cpp，前三站全绿，链接站报 undefined reference to tools::square(int)；多列一份、两份各写同一个 square，报 multiple definition 加一句 first defined here。` },
        { t: `p`, text: `那 -Wall -Wextra 换来什么？它不改编译结果，只把「能跑但可疑」的地方点名。实测两件：函数收了参数却不用它，报 unused parameter；unsigned 和 int 比相等，报 comparison of integer expressions of different signedness。两句都是 warning，程序照样编出来照跑 —— 这正是危险的地方。源稿那句「永远带上」就是这个意思。` },
        { t: `p`, text: `命令写到五个文件就没人愿意手敲：漏一个名字、忘了重编哪份 .o，报错就把你送回那两副面孔里。CMake 干的事只有一件 —— **把「有哪些源文件、用什么标准」写进一份 CMakeLists.txt，以后只敲两条固定命令**。它不是新编译器：配置阶段读那四行、生成构建脚本，构建阶段照脚本替你敲上面那条 g++。` },
        { t: `code`, lang: `text`, code: `# CMakeLists.txt —— 源稿那四行，一行不多
cmake_minimum_required(VERSION 3.15)
project(app CXX)
set(CMAKE_CXX_STANDARD 23)
add_executable(app main.cpp utils.cpp)` },
        { t: `svg`, caption: `一份 CMakeLists.txt 换掉整条命令：配置阶段读四行、生成 build 目录里的构建脚本，构建阶段替你逐个编译单元敲 g++，最后链接成 app`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">你写的四行，与它替你敲的那条命令</text>
  <g font-size="12" fill="#26405a">
    <rect x="16" y="38" width="200" height="112" rx="8" fill="#e8eef8" stroke="#00599c" stroke-width="2"/>
    <text x="28" y="58" font-weight="700" fill="#00599c">CMakeLists.txt 四行</text>
    <text x="28" y="78">cmake_minimum_required</text>
    <text x="28" y="96">project 名称与语言</text>
    <text x="28" y="114">CMAKE_CXX_STANDARD 23</text>
    <text x="28" y="132">add_executable 源文件名单</text>

    <rect x="248" y="52" width="130" height="34" rx="6" fill="#ffffff" stroke="#57677c" stroke-width="2"/>
    <text x="313" y="74" text-anchor="middle">配置：读那四行</text>
    <rect x="248" y="104" width="130" height="34" rx="6" fill="#ffffff" stroke="#57677c" stroke-width="2"/>
    <text x="313" y="126" text-anchor="middle">生成构建脚本</text>
    <path d="M216 94 H232 V69 H244" stroke="#57677c" stroke-width="2.5" fill="none"/><polygon points="248,69 238,63 238,75" fill="#57677c"/>
    <path d="M313 86 V100" stroke="#57677c" stroke-width="2.5"/><polygon points="313,104 307,96 319,96" fill="#57677c"/>

    <rect x="414" y="86" width="210" height="52" rx="8" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/>
    <text x="426" y="106" fill="#1d7a3c" font-weight="700">替你敲的那条命令</text>
    <text x="426" y="126">逐个 .cpp 编译，再一次链接</text>
    <path d="M378 121 H400 V112 H410" stroke="#57677c" stroke-width="2.5" fill="none"/><polygon points="414,112 404,106 404,118" fill="#57677c"/>

    <rect x="16" y="176" width="608" height="42" rx="8" fill="#f4f6f9" stroke="#8b98ab" stroke-width="1.5"/>
    <text x="30" y="196" fill="#33465e">中间产物一律落在 build 目录里：源码那一层不躺 .o，想推倒重来就删掉那一个文件夹。</text>
    <text x="30" y="212" fill="#33465e">源文件名单一改，配置阶段重算依赖，过期那几个才重编 —— 这就是第 141 课那张依赖图。</text>

    <rect x="16" y="232" width="608" height="52" rx="8" fill="#fdece1" stroke="#b8500f" stroke-width="1.5"/>
    <text x="30" y="254" fill="#b8500f">本机没装 cmake：这一层的设计讲得清，那两条命令的输出却没实跑，正文里明说了。</text>
    <text x="30" y="274" fill="#b8500f">实跑过的是它替你敲的那句话 —— 名单少一个文件、多一个文件，各自报错长相见演示 3。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `源稿那四行的分工照着读就清楚：第一行说这文件要用哪一版 CMake 才敢看，第二行给项目和语言挂号，第三行把标准定成 23，也就是命令里那个 -std=c++23，第四行 add_executable 写 app main.cpp utils.cpp 就是**名单**。换句话说，CMakeLists 里没有一个字讲「怎么编」，全是「有什么」；怎么编、先编谁、谁过期了，由工具自己算。这就是声明式与手敲命令的区别。` },
        { t: `p`, text: `两条命令分工明确：cmake -B build 是配置，把 build 目录建出来并写好转译清单；cmake --build build 才真干活，照清单替你敲编译器。**要说老实话**：本机没装 cmake，这两条命令的输出我没实跑过，正文只讲设计；实跑过的是它最后要敲的那句话，也就是本课所有演示用的那条 g++ —— 手敲都编不过的工程，交给 CMake 一样编不过。` },
        { t: `h2`, text: `演示 1 · 源稿这段：一个文件里假装两个` },
        { t: `code`, lang: `c++`, code: `#include <print>
namespace tools {                        // 假装这是 utils.cpp
    int square(int x) { return x * x; }
}
int main() {                             // 假装这是 main.cpp
    std::println("{}", tools::square(9));
    return 0;
}` },
        { t: `p`, text: `实测打出 81。这份代码里 tools::square 就在 main 隔壁，一个编译单元，谈不上拆。源稿那两句「假装」是全部的线索：真把 square 挪进 utils.cpp 会多出什么手续，就是本课任务第一条。` },
        { t: `h2`, text: `演示 2 · 本课任务 1：真拆三份，一条命令编过` },
        { t: `code`, lang: `c++`, code: `#pragma once                 // utils.h —— 上一课那把锁，第一行就戴上
namespace tools { int square(int x); }` },
        { t: `code`, lang: `c++`, code: `#include "utils.h"           // utils.cpp —— 后厨：实现搬到这里
namespace tools { int square(int x) { return x * x; } }` },
        { t: `code`, lang: `c++`, code: `#include <print>             // main.cpp —— 顾客：只认菜单
#include "utils.h"
int main() {
    std::println("{}", tools::square(9));
    return 0;
}` },
        { t: `code`, lang: `shell`, code: `g++ -std=c++23 -Wall -Wextra main.cpp utils.cpp -o app
./app` },
        { t: `p`, text: `实测最后一行打出 81，两句编译一次链接全在这一条命令里，-Wall -Wextra 一声没吭。数一下名单：两个 .cpp，零个头文件。utils.h 被两个 .cpp 各抄一遍，两边都有签名所以都翻译得动，实现却只在 utils.o 那一份里。` },
        { t: `h2`, text: `演示 3 · 名单写错的两种长相，与 -Wall 抓到的两件事` },
        { t: `code`, lang: `text`, code: `少列一个文件：g++ -std=c++23 main.cpp -o app
  /usr/bin/x86_64-linux-gnu-ld.bfd: /tmp/ccxSsCG1.o: in function ‘main’:
  main.cpp:(.text+0x21): undefined reference to ‘tools::square(int)’
  collect2: error: ld returned 1 exit status

各写一遍：g++ -std=c++23 main.cpp utils.cpp other.cpp -o app
  /usr/bin/x86_64-linux-gnu-ld.bfd: /tmp/ccdZ39C2.o: in function ‘tools::square(int)’:
  other.cpp:(.text+0x0): multiple definition of ‘tools::square(int)’;
  /tmp/ccxaOaMv.o:utils.cpp:(.text+0x0): first defined here

老师开口：g++ -std=c++23 -Wall -Wextra warn.cpp -o w
  warn.cpp:2:11: warning: unused parameter ‘a’ [-Wunused-parameter]
  warn.cpp:3:41: warning: comparison of integer expressions of different signedness: ‘unsigned int’ and ‘int’ [-Wsign-compare]` },
        { t: `p`, text: `三段都是本机实测原文，读法各不同。第一段行首是 ld，链接器在说话，修法是数名单；第二段带 first defined here，连另一份在哪都告诉你了，修法是删掉重复的那份实现 —— 上一课「头文件里别写函数体」就是为了不走到这一步。第三段只是 warning，一开 -Wall -Wextra 它就跑到眼前。中间那串 /tmp 名每次跑都不重样，别拿它对号。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把头文件也列进命令。实测本机不拦，utils.h 被当成一份翻译单元处理，app 照样出来 —— 做的是白活，而且不同编译器口味不一：名单里只该有 .cpp。`,
          `-o app 忘了写。实测产物默认叫 a.out，于是你改完代码跑的还是一天前的 a.out，「怎么跑都对」—— 这种错一句报错都没有。`,
          `以为 -Wall 开了就万事大吉。实测它俩只管可疑写法，不管语法错，也不管名单齐不齐；再往前加一个 -Werror，上面那两句 warning 会直接把工程编停 —— 实测最后是一句 cc1plus: all warnings being treated as errors。`,
          `CMakeLists 里的名单漏写一个 .cpp。按设计说，工具照抄你写的名单、不会替你补，最后仍以链接期 undefined reference 收场；这一层本机没装 cmake，没法跑给你看，但名单这件事和手敲命令是同一个病根。`,
          `两条命令的顺序倒了，或者还没配置就想构建。这一段同样没实跑，只能按设计说：构建阶段读的是配置阶段写出的那份脚本，没配置过就没有目标可打。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `新建 utils.cpp 把 square 挪进去，用上面的命令把两个 .cpp 一起编过 —— 演示 2 那三份文件和那条命令就是完整答案；跑通以后故意把 utils.cpp 从名单里删掉一次，把 undefined reference 那三行原样抄下来。`,
          `照下面四行写 CMakeLists.txt，试试 cmake -B build 和 cmake --build build：前两行声明最低版本与项目语言，第三行把标准定成 23，第四行 add_executable 写 app main.cpp utils.cpp。本机没装 cmake 的话，先把演示 2 那条命令跑熟，再逐行想清楚这四行各对应它的哪一段。`,
          `延伸一：给工程再加一份 stats.cpp，先手敲一条列三个 .cpp 的命令把它编过 —— 实测本机三个文件一起列照样通过，打出的还是 81；再改 add_executable 那一行加上它，体会一次「名单是唯一要动的东西」。`,
          `延伸二：把 -Wall -Wextra 换成再加一个 -Werror，看演示 3 那两句 warning 怎么把工程直接编停，然后决定你平时想开哪一档。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：编译命令看四段 —— 标准开关、警告开关、.cpp 名单、产物名，头文件永远不进名单；名单写错就是 undefined reference 与 multiple definition 两副面孔，CMake 那四行做的事只是把名单和标准写进文件，让工具替你敲命令。` }
      ]
    }
  ]
};
