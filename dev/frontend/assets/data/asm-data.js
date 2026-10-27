/* 喵站 · 汇编入门（x86-64）（2026-10-27 新建分类教程；单文件形态，与 go-data.js 同构）
 * 12 课写到字符串遍历：历史 / 装工具 / 第一个程序 / 寄存器 / 数据定义 / 寻址 / 条件跳转 / 分支 / 计数循环 / while / 函数 / 数组。
 * 本机没有 NASM，正文代码块只做结构与语法自查，未实际汇编运行。 */
window.MIAO_ASM = {
  tutorial: {
    id: "asm",
    title: "汇编入门（x86-64）",
    intro: "从机器码讲到字符串遍历：12 课把 x86-64 汇编的基础走完，每课都有能照敲的程序和一张机制图。",
    cat: "汇编",
    diff: "入门",
    tags: ["汇编", "x86-64", "NASM", "系统调用"],
    author: "喵站官方",
    cover: "/assets/img/covers/asm.svg",
    updated: "2026-10-27",
    chapters: [
      {
        id: "as01",
        title: "第 1 课 · 汇编的历史：从机器码到助记符",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：弄清机器码、助记符、汇编器三者的关系，知道 x86-64 这条路线是怎么来的。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "最早的计算机没有汇编语言。程序员把 0 和 1 写在纸带上，或者直接拨动机器面板上的开关，一条指令就是一组二进制数。这样做不仅慢，而且极易出错：改一个数就要重新核对整段编码，别人写的程序几乎没法读。" },
          { t: "p", text: "1949 年，EDSAC 团队做了一个程序，把人们写的短名字翻译成机器码，这个程序后来被称为汇编器。短名字就是助记符，例如用 mov 表示传送、用 add 表示加法。助记符和机器码基本一一对应，一条助记符换一条机器指令，所以汇编仍然贴着硬件。" },
          { t: "p", text: "x86 这条路线从 1978 年的 8086 开始，1985 年的 80386 进入 32 位，2003 年 AMD 推出 64 位扩展，也就是今天说的 x86-64。Linux 上的 NASM 用 Intel 风格语法，和 AT&T 语法的操作数顺序相反，读资料时要先看清是哪一种。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "学汇编最直接的收获是能看见 CPU 里的寄存器、内存地址和标志位。读反汇编、分析崩溃现场、写引导程序、给热点代码做优化，这些工作都要求你能把助记符和机器行为对上。" },
          { t: "h2", text: "演示：一段程序的外形" },
          { t: "p", text: "先看形状，不逐行解释。程序用 global _start 声明入口，用 syscall 请求内核退出进程，具体细节后面单独一课拆开。" },
          { t: "code", lang: "asm", code: "global _start\n\nsection .text\n_start:\n    mov eax, 60\n    xor edi, edi\n    syscall" },
          { t: "p", text: "这段代码只有七行，却已经包含汇编程序的三个固定部分：入口声明、代码段、系统调用。把它存成 .asm 文件，交给汇编器，就会变成 CPU 能执行的字节。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"30\" y=\"26\" width=\"580\" height=\"188\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"62\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">一条指令的两种写法</text><rect x=\"58\" y=\"88\" width=\"150\" height=\"72\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"133\" y=\"116\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">机器码</text><text x=\"133\" y=\"142\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">B8 3C 00 00 00</text><path d=\"M212 124H264\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"264,124 254,118 254,130\" fill=\"#2a8c78\"/><rect x=\"272\" y=\"88\" width=\"150\" height=\"72\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"347\" y=\"116\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">助记符</text><text x=\"347\" y=\"142\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">mov eax, 60</text><path d=\"M426 124H478\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"478,124 468,118 468,130\" fill=\"#2a8c78\"/><rect x=\"486\" y=\"88\" width=\"112\" height=\"72\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"542\" y=\"116\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">汇编器</text><text x=\"542\" y=\"142\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">逐条翻译</text><text x=\"320\" y=\"196\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">1949 年 EDSAC 用助记符代替二进制编码</text></svg>", caption: "机器码和助记符一一对应，汇编器负责把短名字换回字节。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "以为汇编可以跨平台。同一段助记符在不同 CPU 上含义不同，x86-64 的程序不能直接拿到 ARM 机器上跑。",
            "把汇编等同于快。手写汇编不一定比编译器生成的代码快，编译器的优化往往更全面。",
            "一上来就想用汇编写完整软件。汇编适合小段关键代码、教学和逆向，不适合承担大型工程。",
            "混淆 Intel 语法和 AT&T 语法。前者是 mov dest, src，后者顺序相反，还带百分号前缀。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用自己的话写下机器码、助记符、汇编器三者的区别，不看正文复述。",
            "查一查 EDSAC 是什么时候运行的，它的汇编器解决了什么麻烦。",
            "把演示里的退出码改成 3，说明你打算在哪里改，先不要动手编译。"
          ]},
          { t: "tip", color: "green", text: "一句话：汇编语言是机器码的可读写法，助记符和指令一一对应，x86-64 是这条路线今天的形态。" }
        ]
      },
      {
        id: "as02",
        title: "第 2 课 · 装 NASM、GCC 和 VS Code",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：装好 NASM、GCC 和 VS Code，用 nasm -v 看到版本号，并能说清汇编器和链接器各做什么。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "NASM 是汇编器，它把 .asm 文本逐行翻译成机器码，输出一个目标文件 .o。目标文件里的地址还没有最终确定，需要链接器把各个段拼起来，生成 Linux 能加载的 ELF 可执行文件。纯系统调用的程序用 ld 就能链接，涉及 C 库时再用 gcc 驱动链接。" },
          { t: "p", text: "GCC 在这里有两个用途：一是提供 ld 和整套构建工具，二是以后要把汇编和 C 写在一起时，用 gcc 负责链接和传参。只写汇编写系统调用时，GCC 不是必需，但装了能少很多麻烦。" },
          { t: "p", text: "VS Code 只是编辑器。装上汇编语法扩展后，关键字会高亮、括号会配对，但真正把代码变成程序的是命令行的 nasm 和 ld。安装顺序建议先装命令行工具，再装编辑器扩展。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "在终端里把任意 .asm 文件汇编成 .o，再链接成可执行文件。",
            "用编辑器高亮发现拼写错误，用终端看到真正的报错行号。",
            "为后面每节课准备好同一套工具链，不用反复折腾环境。"
          ]},
          { t: "h2", text: "演示：Ubuntu 上的安装与验证" },
          { t: "p", text: "下面几条命令按顺序执行。第一条刷新软件源，第二条装 NASM 和 GCC，第三条装 VS Code，最后两条验证版本。不同发行版的包名可能不同，命令后面会说明。" },
          { t: "code", lang: "bash", code: "sudo apt update\nsudo apt install -y nasm gcc\nsudo snap install code --classic\nnasm -v\ngcc --version" },
          { t: "p", text: "nasm -v 输出形如 NASM version 2.16.01，看到版本号就说明汇编器就绪。gcc --version 输出编译器版本。两个命令都能在任意目录执行，说明它们已经进入 PATH。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 260\"><rect x=\"24\" y=\"24\" width=\"592\" height=\"212\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"58\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">从源文件到可执行文件</text><rect x=\"36\" y=\"92\" width=\"96\" height=\"72\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"84\" y=\"120\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">.asm</text><text x=\"84\" y=\"146\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">源文件</text><path d=\"M136 128H154\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"154,128 144,122 144,134\" fill=\"#2a8c78\"/><rect x=\"158\" y=\"92\" width=\"96\" height=\"72\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"206\" y=\"120\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">nasm</text><text x=\"206\" y=\"146\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">汇编器</text><path d=\"M258 128H276\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"276,128 266,122 266,134\" fill=\"#2a8c78\"/><rect x=\"280\" y=\"92\" width=\"96\" height=\"72\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"328\" y=\"120\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">.o</text><text x=\"328\" y=\"146\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">目标文件</text><path d=\"M380 128H398\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"398,128 388,122 388,134\" fill=\"#2a8c78\"/><rect x=\"402\" y=\"92\" width=\"96\" height=\"72\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"450\" y=\"120\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">ld</text><text x=\"450\" y=\"146\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">链接器</text><path d=\"M502 128H520\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"520,128 510,122 510,134\" fill=\"#2a8c78\"/><rect x=\"524\" y=\"92\" width=\"96\" height=\"72\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"572\" y=\"120\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">ELF</text><text x=\"572\" y=\"146\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">可执行</text><text x=\"320\" y=\"208\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">nasm -f elf64 只翻译，ld 负责拼段和定地址</text></svg>", caption: "汇编器和链接器各管一段，缺一段都得不到可执行文件。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "汇编时忘了写 -f elf64。NASM 默认输出纯二进制格式，链接器读不懂。",
            "把 .o 当成可执行文件。目标文件还不能运行，必须先链接。",
            "用 ld 链接带 printf 的程序。C 库需要启动代码和库路径，这类程序交给 gcc 链接。",
            "用 snap 装 VS Code 时漏了 --classic。缺少这个参数，编辑器权限受限。",
            "装完不验证。先跑 nasm -v，确认终端找到的是你刚装的那一个。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "按演示装好三个工具，把 nasm -v 和 gcc --version 的输出各抄一行。",
            "新建一个空 .asm 文件，只用 nasm 汇编成 .o，再用 file 命令看它的类型。",
            "在 VS Code 里装一个汇编语法扩展，打开 .asm 文件，确认关键字有没有变色。"
          ]},
          { t: "tip", color: "green", text: "一句话：NASM 把文本变目标文件，链接器把目标文件变可执行文件，编辑器只负责让你写得舒服。" }
        ]
      },
      {
        id: "as03",
        title: "第 3 课 · 第一个程序：write 系统调用",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：写出并链接第一个 x86-64 程序，用 write 系统调用往终端打印一行字，再用 exit 正常退出。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "Linux 的系统调用是用户程序和内核之间的门。程序把调用号放进 rax，把参数依次放进 rdi、rsi、rdx、r10、r8、r9，然后执行 syscall 指令，CPU 切换到内核，完成后把结果放回 rax。write 的调用号是 1，参数是文件描述符、缓冲区地址、字节数。" },
          { t: "p", text: "程序分两个段。section .data 放要打印的字节，db 定义一个字节序列，末尾的 10 是换行符。section .text 放指令，global _start 告诉链接器入口在哪里，_start 这个标签就是第一条指令的地址。" },
          { t: "p", text: "len: equ $ - msg 在汇编时就算好了长度。$ 表示当前地址，减去 msg 的地址，得到两个标签之间的字节数。这个值不占用运行时内存，直接变成指令里的立即数。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "会写 write 和 exit，你就能让程序有可见的输出和明确的退出状态。后面调试时，把中间结果塞进退出码，再用 echo $? 读出来，是最轻量的观察手段。" },
          { t: "h2", text: "演示：打印一行字" },
          { t: "p", text: "把下面的代码保存为 hello.asm。注意字符串后面的 10 不能省，否则输出会和提示符粘在一行。" },
          { t: "code", lang: "asm", code: "global _start\n\nsection .data\nmsg:    db \"Hello, ASM!\", 10\nlen:    equ $ - msg\n\nsection .text\n_start:\n    mov eax, 1\n    mov edi, 1\n    mov rsi, msg\n    mov edx, len\n    syscall\n\n    mov eax, 60\n    xor edi, edi\n    syscall" },
          { t: "p", text: "再用两条命令汇编和链接。nasm 生成目标文件，ld 生成可执行文件，最后直接运行。" },
          { t: "code", lang: "bash", code: "nasm -f elf64 hello.asm -o hello.o\nld -o hello hello.o\n./hello" },
          { t: "p", text: "终端会输出 Hello, ASM! 并换行。如果没有任何输出，先检查 write 的三个参数，再检查 len 是不是 0。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 280\"><rect x=\"24\" y=\"24\" width=\"592\" height=\"232\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"58\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">write 的四个参数</text><rect x=\"44\" y=\"82\" width=\"286\" height=\"30\" rx=\"6\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"56\" y=\"102\" font-size=\"14\" fill=\"#173d36\">rax = 1（write 调用号）</text><rect x=\"44\" y=\"122\" width=\"286\" height=\"30\" rx=\"6\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"56\" y=\"142\" font-size=\"14\" fill=\"#173d36\">rdi = 1（标准输出）</text><rect x=\"44\" y=\"162\" width=\"286\" height=\"30\" rx=\"6\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"56\" y=\"182\" font-size=\"14\" fill=\"#173d36\">rsi = msg（缓冲区地址）</text><rect x=\"44\" y=\"202\" width=\"286\" height=\"30\" rx=\"6\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"56\" y=\"222\" font-size=\"14\" fill=\"#173d36\">rdx = len（字节数）</text><rect x=\"396\" y=\"94\" width=\"190\" height=\"124\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"491\" y=\"124\" font-size=\"16\" text-anchor=\"middle\" fill=\"#173d36\">Linux 内核</text><text x=\"491\" y=\"156\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">按调用号分发</text><text x=\"491\" y=\"182\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">把字节送到终端</text><path d=\"M334 171H388\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"388,171 378,165 378,177\" fill=\"#2a8c78\"/><text x=\"320\" y=\"248\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">syscall 指令切进内核，结果放回 rax</text></svg>", caption: "参数放好再执行 syscall，内核按调用号决定做什么。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把调用号写进 eax 以外的寄存器。系统调用只认 rax，写错寄存器会得到完全不同的调用。",
            "忘了写 syscall。参数都设好了，CPU 却继续往下执行，程序行为不可预测。",
            "rdx 的长度算错。长度多一个字节会打印出垃圾，少一个字节会截断。",
            "在 64 位程序里用 int 0x80。那是 32 位的入口，寄存器和调用号规则都不一样。",
            "直接让程序跑出 _start 末尾。没有 exit，CPU 会继续执行后面的数据，通常以段错误结束。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "把字符串换成你的名字，重新汇编链接，确认输出正确。",
            "把 len 改大 1，观察输出多了什么；再改小 1，观察少了什么。",
            "把退出码改成 7，运行后用 echo $? 验证。"
          ]},
          { t: "tip", color: "green", text: "一句话：write 把缓冲区地址和长度交给内核，exit 把控制权还给系统；两个调用都用 syscall 进门。" }
        ]
      },
      {
        id: "as04",
        title: "第 4 课 · 寄存器与数据宽度",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：认识 x86-64 的通用寄存器，分清 rax、eax、ax、al 的宽度关系，知道写 32 位会清零高半部分。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "x86-64 有十六个通用寄存器，名字是 rax、rbx、rcx、rdx、rsi、rdi、rbp、rsp，再加 r8 到 r15。它们都在 CPU 内部，读写比内存快得多。传参数时习惯用 rdi、rsi、rdx、rcx、r8、r9，返回值放在 rax，rsp 指向栈顶。" },
          { t: "p", text: "每个 64 位寄存器都能拆开用。rax 的低 32 位叫 eax，低 16 位叫 ax，低 8 位叫 al。写 eax 时，CPU 会自动把 rax 的高 32 位清零；只写 al 时，rax 的其余位保持不变。这个差异在调试时经常让人困惑。" },
          { t: "p", text: "数据宽度有四个常用名字：byte 是 8 位，word 是 16 位，dword 是 32 位，qword 是 64 位。指令两边的宽度要对得上，指针和地址必须用 64 位，计数用 32 位通常就够。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "知道宽度，你才能判断一条指令到底动了几个字节、退出码为什么只取最低 8 位、指针被截断后为什么会崩溃。寄存器图是后面读所有指令的基础。" },
          { t: "h2", text: "演示：写 32 位会清零高 32 位" },
          { t: "p", text: "下面的程序先给 rax 一个 64 位的值，再用 mov eax 覆盖低 32 位，最后把 eax 放进 edi 当退出码。" },
          { t: "code", lang: "asm", code: "global _start\n\nsection .text\n_start:\n    mov rax, 0x1122334455667788\n    mov eax, 0x99AABBCC\n    mov edi, eax\n    mov eax, 60\n    syscall" },
          { t: "p", text: "运行后 echo $? 得到 204，也就是十六进制的 CC。高 32 位的 11223344 已经被清零，退出码只保留最低 8 位，所以看不到 AA 或 BB。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 250\"><rect x=\"24\" y=\"24\" width=\"592\" height=\"202\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"58\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">rax 的四个名字</text><text x=\"80\" y=\"86\" font-size=\"14\" text-anchor=\"start\" fill=\"#4d6f67\">第 63 位</text><text x=\"560\" y=\"86\" font-size=\"14\" text-anchor=\"end\" fill=\"#4d6f67\">第 0 位</text><rect x=\"80\" y=\"96\" width=\"240\" height=\"52\" rx=\"6\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"200\" y=\"128\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">eax（低 32 位）</text><rect x=\"320\" y=\"96\" width=\"120\" height=\"52\" rx=\"6\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"380\" y=\"128\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">ax</text><rect x=\"440\" y=\"96\" width=\"60\" height=\"52\" rx=\"6\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"470\" y=\"128\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">al</text><rect x=\"500\" y=\"96\" width=\"60\" height=\"52\" rx=\"6\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"530\" y=\"128\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">ah</text><text x=\"320\" y=\"178\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">写 eax 会把高 32 位清零</text><text x=\"320\" y=\"204\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">只写 al 或 ax 时，其他位保持原样</text></svg>", caption: "同一块存储按宽度拆成四个名字，写 32 位和写 8 位的副作用不同。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "以为 mov eax, 1 只改低 32 位。它会清零 rax 的高 32 位，后面用 rax 当地址就会出错。",
            "把 al 当成独立的寄存器。al 只是 rax 的最低字节，写它不会影响其他字节。",
            "用 32 位寄存器存指针。地址被截断后，程序访问的是完全不同的内存。",
            "退出码写超过 255 的数。内核只取最低 8 位，1000 会变成 232。",
            "混淆 b、w、d、q 四个后缀。它们分别对应 8、16、32、64 位。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "画一张表，写出 rax、eax、ax、al 各占多少位，以及它们的最低字节在哪。",
            "把演示里的 0x99AABBCC 改成 0x11，重新推一遍退出码是多少。",
            "用 mov ax, 0x1234 改写 rax 的低 16 位，说明高 48 位会不会变。"
          ]},
          { t: "tip", color: "green", text: "一句话：寄存器是 CPU 里的命名存储，64 位寄存器可以按 32、16、8 位分段使用，写 32 位会顺手清零高半部分。" }
        ]
      },
      {
        id: "as05",
        title: "第 5 课 · 数据定义：db/dw/dd/dq",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：用 db、dw、dd、dq 在数据段里放不同宽度的值，知道它们在内存里按小端序排列。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "数据段用 section .data 声明，里面放已经初始化好的字节。db 定义一个字节，dw 定义两个字节，dd 定义四个字节，dq 定义八个字节。字符串本质上是连续的字节，用 db 加双引号就能写进去。" },
          { t: "p", text: "NASM 不记录类型，标签只代表地址。你在哪里读、读几个字节，完全由指令决定。想读一个字节用 byte，读四个字节用 dword，读八个字节用 qword。宽度写错，读到的就是相邻数据拼出来的数。" },
          { t: "p", text: "x86 用小端序：一个多字节数的低位字节放在低地址。0x1234 存成 34 12，0x1122334455667788 存成 88 77 66 55 44 33 22 11。看内存窗口时先确认字节顺序，否则很容易把数读反。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "保存程序的提示文本、查找表、配置常量。",
            "用 times 快速生成重复的填充字节或零。",
            "用 resb 在 .bss 段预留缓冲区，运行时不占文件体积。"
          ]},
          { t: "h2", text: "演示：四种宽度与小端序" },
          { t: "p", text: "下面的数据段各放一个值，代码只读取第一个字节，把它放进退出码。" },
          { t: "code", lang: "asm", code: "global _start\n\nsection .data\nbyte_v:  db 200\nword_v:  dw 0x1234\ndword_v: dd 0x89ABCDEF\nquad_v:  dq 0x1122334455667788\n\nsection .text\n_start:\n    movzx edi, byte [byte_v]\n    mov eax, 60\n    syscall" },
          { t: "p", text: "byte_v 的值是 200，movzx 把它零扩展成 32 位再送进 edi，运行后 echo $? 得到 200。另外三个标签没有参与运算，但你可以用调试器看它们占的字节。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 280\"><rect x=\"24\" y=\"24\" width=\"592\" height=\"232\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"56\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">dq 在内存里的字节顺序</text><text x=\"70\" y=\"92\" font-size=\"14\" text-anchor=\"start\" fill=\"#4d6f67\">低地址</text><text x=\"596\" y=\"92\" font-size=\"14\" text-anchor=\"end\" fill=\"#4d6f67\">高地址</text><rect x=\"70\" y=\"104\" width=\"60\" height=\"52\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"100\" y=\"137\" font-size=\"16\" text-anchor=\"middle\" fill=\"#173d36\">88</text><rect x=\"130\" y=\"104\" width=\"60\" height=\"52\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"160\" y=\"137\" font-size=\"16\" text-anchor=\"middle\" fill=\"#173d36\">77</text><rect x=\"190\" y=\"104\" width=\"60\" height=\"52\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"220\" y=\"137\" font-size=\"16\" text-anchor=\"middle\" fill=\"#173d36\">66</text><rect x=\"250\" y=\"104\" width=\"60\" height=\"52\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"280\" y=\"137\" font-size=\"16\" text-anchor=\"middle\" fill=\"#173d36\">55</text><rect x=\"310\" y=\"104\" width=\"60\" height=\"52\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"340\" y=\"137\" font-size=\"16\" text-anchor=\"middle\" fill=\"#173d36\">44</text><rect x=\"370\" y=\"104\" width=\"60\" height=\"52\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"400\" y=\"137\" font-size=\"16\" text-anchor=\"middle\" fill=\"#173d36\">33</text><rect x=\"430\" y=\"104\" width=\"60\" height=\"52\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"460\" y=\"137\" font-size=\"16\" text-anchor=\"middle\" fill=\"#173d36\">22</text><rect x=\"490\" y=\"104\" width=\"60\" height=\"52\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"520\" y=\"137\" font-size=\"16\" text-anchor=\"middle\" fill=\"#173d36\">11</text><text x=\"100\" y=\"180\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">+0</text><text x=\"160\" y=\"180\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">+1</text><text x=\"220\" y=\"180\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">+2</text><text x=\"280\" y=\"180\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">+3</text><text x=\"340\" y=\"180\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">+4</text><text x=\"400\" y=\"180\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">+5</text><text x=\"460\" y=\"180\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">+6</text><text x=\"520\" y=\"180\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">+7</text><text x=\"320\" y=\"218\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">低位字节放在低地址，读出来的顺序和书写相反</text><text x=\"320\" y=\"244\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">db、dw、dd 分别占 1、2、4 个字节</text></svg>", caption: "同一个 64 位数按字节摊开，低地址放的是最低位的字节。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "用 db 写字符串却忘了结尾的 0，后面按字符串遍历时会读过头。",
            "以为 dd 定义的是指针。64 位程序里的地址要占八个字节，应该用 dq。",
            "用 mov rax, [byte_v] 读一个字节。这样会读八个字节，把相邻数据也带进来。",
            "把 equ 当成变量。equ 是汇编期常量，程序运行时不能改。",
            "在 .data 里用 resb 预留空间。未初始化数据应该放 .bss。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 db、dw、dd、dq 各定义一个值，算出整个数据段占多少字节。",
            "把 0x1234 按小端序写成一串字节，再和调试器里的内存对照。",
            "用 times 生成 16 个 0xAA，说明它展开后是多少字节。"
          ]},
          { t: "tip", color: "green", text: "一句话：db、dw、dd、dq 决定每个值占几个字节，标签只是地址，读写宽度由指令自己声明。" }
        ]
      },
      {
        id: "as06",
        title: "第 6 课 · 寻址与算术指令",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：看懂 [基址 + 索引 * 比例 + 位移] 这种内存写法，会用 lea 算地址，会用 add、sub、imul 做算术。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "指令的操作数有三种：寄存器、立即数、内存。内存操作数写在方括号里，完整形状是 [基址 + 索引 * 比例 + 位移]。比例只能是 1、2、4、8，正好对应字节、字、双字、四字的下标步长。" },
          { t: "p", text: "lea 只算地址，不读内存。lea rbx, [nums] 把 nums 的地址放进 rbx；mov rbx, [nums] 则是把 nums 开头八个字节的内容读进 rbx。这两个写法只差一对方括号，结果完全不同。" },
          { t: "p", text: "算术指令采用两操作数形式：add 目标, 来源，结果写回目标。sub 做减法，inc 和 dec 加一减一，imul 做有符号乘法。它们都会更新标志位，后面的条件跳转就靠这些标志位工作。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "按固定步长遍历数组，把每个元素取出来参与计算。",
            "用基址加位移访问结构体里的不同字段。",
            "在不改指针的情况下算出某个元素的地址，再交给函数。"
          ]},
          { t: "h2", text: "演示：取数组元素并计算" },
          { t: "p", text: "数据段放四个双字，代码先用 lea 拿到首地址，再取第三个元素，加上第一个元素，最后乘二。" },
          { t: "code", lang: "asm", code: "global _start\n\nsection .data\nnums:   dd 10, 20, 30, 40\n\nsection .text\n_start:\n    lea rbx, [nums]\n    mov eax, [rbx + 8]\n    add eax, [rbx]\n    imul eax, 2\n    mov edi, eax\n    mov eax, 60\n    syscall" },
          { t: "p", text: "第三个元素的偏移是 8，因为每个 dd 占四个字节，下标 2 乘以 4 等于 8。结果是 30 加 10 再乘 2，等于 80，echo $? 能看到这个退出码。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 280\"><rect x=\"24\" y=\"20\" width=\"592\" height=\"240\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"52\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">地址 = 基址 + 索引 × 比例 + 位移</text><rect x=\"36\" y=\"76\" width=\"96\" height=\"48\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"84\" y=\"106\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">rbx</text><text x=\"152\" y=\"106\" font-size=\"18\" text-anchor=\"middle\" fill=\"#173d36\">+</text><rect x=\"168\" y=\"76\" width=\"120\" height=\"48\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"228\" y=\"106\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">索引 * 4</text><text x=\"306\" y=\"106\" font-size=\"18\" text-anchor=\"middle\" fill=\"#173d36\">+</text><rect x=\"322\" y=\"76\" width=\"100\" height=\"48\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"372\" y=\"106\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">位移 8</text><text x=\"438\" y=\"106\" font-size=\"18\" text-anchor=\"middle\" fill=\"#173d36\">=</text><rect x=\"458\" y=\"76\" width=\"120\" height=\"48\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"518\" y=\"106\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">地址</text><text x=\"64\" y=\"188\" font-size=\"14\" text-anchor=\"start\" fill=\"#4d6f67\">nums</text><rect x=\"120\" y=\"160\" width=\"60\" height=\"46\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"150\" y=\"189\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">10</text><rect x=\"180\" y=\"160\" width=\"60\" height=\"46\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"210\" y=\"189\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">20</text><rect x=\"240\" y=\"160\" width=\"60\" height=\"46\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"270\" y=\"189\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">30</text><rect x=\"300\" y=\"160\" width=\"60\" height=\"46\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"330\" y=\"189\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">40</text><path d=\"M518 124V146H270V156\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><polygon points=\"270,156 264,146 276,146\" fill=\"#2a8c78\"/><text x=\"320\" y=\"240\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">方括号里算地址，加号两边可以是寄存器、索引和常数</text></svg>", caption: "基址给起点，索引乘比例给第几个，位移补上字段位置。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把 mov rax, rbx 和 mov rax, [rbx] 当成一回事。前者复制寄存器，后者读内存。",
            "比例写成 3 或 5。CPU 只支持 1、2、4、8，其他倍数要先自己算好。",
            "遍历 dd 数组时指针每次加 1。应该加 4，否则会读到元素的中间。",
            "写 add [rax], [rbx] 这种内存对内存的指令。x86 不允许两个操作数都在内存。",
            "忽略宽度溢出。8 位寄存器装不下 200 加 100，结果会回绕。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 lea 取 nums 的首地址，再用 [rbx + 4] 读出第二个元素。",
            "把演示里的 imul 改成 add，重新推一遍退出码。",
            "写一条指令，把 rbx 加上 16 但不访问内存，说明你选哪条指令。"
          ]},
          { t: "tip", color: "green", text: "一句话：方括号表示访问内存，地址由基址、索引乘比例、位移三部分相加得到；lea 只算地址不读数据。" }
        ]
      },
      {
        id: "as07",
        title: "第 7 课 · cmp 与条件跳转（if）",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：用 cmp 比较两个值，用 je、jne、jg、jl 这类条件跳转实现 if，让程序只在条件成立时执行一段代码。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "cmp 做一次减法，但不保存结果，只更新标志位。两个数相等时零标志 ZF 变成 1；第一个数小于第二个数时，符号标志和溢出标志会给出线索。条件跳转就是读这些标志位，决定要不要改指令指针。" },
          { t: "p", text: "相等判断用 je 和 jne，前者在 ZF 为 1 时跳，后者在 ZF 为 0 时跳。大小比较分两组：jg、jge、jl、jle 按有符号数解释，ja、jae、jb、jbe 按无符号数解释。选错组，负数或大数就会给出相反的结论。" },
          { t: "p", text: "if 的汇编形状是反着写的：先 cmp，再用相反的条件跳过整段代码。条件成立就继续往下执行函数体，不成立就跳到标签后面。标签只是一个地址，跳过去之后程序照常顺序执行。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "有了条件跳转，程序才能根据输入走不同路径：分数够不够、指针是不是空、计数有没有到上限。所有高层语言里的 if，最终都会落成一条比较加一条条件跳转。" },
          { t: "h2", text: "演示：相等就改成 1" },
          { t: "p", text: "程序先把退出码设成 2，再比较 eax 和 7。相等时把退出码改成 1，不相等就跳过这条赋值。" },
          { t: "code", lang: "asm", code: "global _start\n\nsection .text\n_start:\n    mov eax, 7\n    mov edi, 2\n    cmp eax, 7\n    jne skip\n    mov edi, 1\nskip:\n    mov eax, 60\n    syscall" },
          { t: "p", text: "运行后 echo $? 得到 1。把 mov eax, 7 改成 8，再运行一次，退出码变成 2，说明 jne 跳过了赋值。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 280\"><rect x=\"24\" y=\"24\" width=\"592\" height=\"232\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"56\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">cmp 只留标志位</text><rect x=\"50\" y=\"88\" width=\"160\" height=\"54\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"130\" y=\"121\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">cmp eax, 7</text><path d=\"M214 115H268\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"268,115 258,109 258,121\" fill=\"#2a8c78\"/><rect x=\"276\" y=\"88\" width=\"150\" height=\"54\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"351\" y=\"112\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">只做减法</text><text x=\"351\" y=\"134\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">更新 ZF</text><path d=\"M430 115H488\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"488,115 478,109 478,121\" fill=\"#2a8c78\"/><rect x=\"496\" y=\"88\" width=\"114\" height=\"54\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"553\" y=\"121\" font-size=\"16\" text-anchor=\"middle\" fill=\"#173d36\">ZF = 1</text><path d=\"M553 142V164H185V184\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><polygon points=\"185,184 179,174 191,174\" fill=\"#2a8c78\"/><path d=\"M553 164H455V184\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><polygon points=\"455,184 449,174 461,174\" fill=\"#2a8c78\"/><rect x=\"80\" y=\"188\" width=\"210\" height=\"48\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"185\" y=\"218\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">je：跳到标签</text><rect x=\"340\" y=\"188\" width=\"230\" height=\"48\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"455\" y=\"218\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">jne：继续往下</text><text x=\"320\" y=\"252\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">条件跳转只读标志位，不再比较操作数</text></svg>", caption: "cmp 算完就丢结果，条件跳转按零标志决定走哪条路。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把 cmp eax, 7 的方向记反。它算的是 eax 减 7，jg 表示 eax 大于 7。",
            "对有符号数用 ja、jb。负数在无符号视角下是很大的正数，比较结果会反。",
            "以为 cmp 会改 eax。它只改标志位，两个操作数都保持原值。",
            "在 cmp 和条件跳转之间插了 mov。mov 不改标志位，但 add、sub 会，插入算术指令会毁掉比较结果。",
            "标签名拼错。汇编器会报未定义符号，链接阶段也可能找不到入口。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 cmp 和 jne 判断一个数是否等于 10，相等退出 1，不等退出 2。",
            "把演示改成大于等于判断，用 7 和 5 各推一次退出码。",
            "说明 jg 和 ja 在比较 0xFF 和 1 时结果为什么不同。"
          ]},
          { t: "tip", color: "green", text: "一句话：cmp 只留标志位，条件跳转按标志位决定去向；if 就是把不成立的情况提前跳走。" }
        ]
      },
      {
        id: "as08",
        title: "第 8 课 · 无条件跳转与分支（else）",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：用 jmp 控制程序去向，写出完整的 if 与 else 两条分支，并让两条分支在同一个标签处汇合。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "CPU 默认顺序执行：一条指令结束，指令指针自动指向下一条。jmp 打破这个顺序，把指令指针直接改成标签的地址。标签由汇编器记录，链接后换成真正的地址，程序运行时不需要再查名字。" },
          { t: "p", text: "if 只处理条件成立的一段，else 要补上条件不成立的一段。写法是先比较，条件成立就跳到 then 标签；不成立时顺序执行 else 段，再用一条 jmp 跳过 then 段，最后两段都落到 end 标签。" },
          { t: "p", text: "两条分支必须互斥，靠的就是那条 jmp。少了它，else 段执行完会直接掉进 then 段，两段代码都跑一遍。这种「顺序滑落」不是语法错误，汇编器不会提醒，只能靠人检查。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "根据分数打印及格或不及格，两条路只走一条。",
            "根据开关状态选择初始化路径，避免执行另一套逻辑。",
            "把错误处理放在一段，正常流程放在另一段，最后统一退出。"
          ]},
          { t: "h2", text: "演示：及格与不及格" },
          { t: "p", text: "程序比较 eax 和 60。大于等于 60 跳到 pass，把退出码设成 0；否则顺序执行，把退出码设成 1，再用 jmp 跳过 pass。" },
          { t: "code", lang: "asm", code: "global _start\n\nsection .text\n_start:\n    mov eax, 50\n    cmp eax, 60\n    jge pass\n    mov edi, 1\n    jmp done\npass:\n    mov edi, 0\ndone:\n    mov eax, 60\n    syscall" },
          { t: "p", text: "用 50 运行时，jge 不成立，退出码是 1；把 eax 改成 75，jge 成立，跳到 pass，退出码是 0。两次都只执行了一条分支。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 300\"><rect x=\"24\" y=\"20\" width=\"592\" height=\"260\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"52\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">两条路只走一条，最后汇合</text><rect x=\"250\" y=\"76\" width=\"140\" height=\"46\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"320\" y=\"104\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">cmp eax, 60</text><path d=\"M320 122V140H155V156\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><polygon points=\"155,156 149,146 161,146\" fill=\"#2a8c78\"/><path d=\"M320 140H485V156\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><polygon points=\"485,156 479,146 491,146\" fill=\"#2a8c78\"/><text x=\"235\" y=\"138\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">假</text><text x=\"400\" y=\"138\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">真</text><rect x=\"60\" y=\"160\" width=\"190\" height=\"56\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"155\" y=\"184\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">else 段</text><text x=\"155\" y=\"206\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">jmp done</text><rect x=\"400\" y=\"160\" width=\"180\" height=\"56\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"490\" y=\"184\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">then 段</text><text x=\"490\" y=\"206\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">退出码 0</text><path d=\"M155 216V234H246\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><polygon points=\"246,234 236,228 236,240\" fill=\"#2a8c78\"/><path d=\"M490 216V234H394\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><polygon points=\"394,234 404,228 404,240\" fill=\"#2a8c78\"/><rect x=\"250\" y=\"234\" width=\"140\" height=\"44\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"320\" y=\"261\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">end：退出</text></svg>", caption: "条件跳转分出去，jmp 把 else 段送回汇合点，两条路才互斥。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "else 段末尾忘了 jmp，结果两条分支都执行。",
            "标签重名。同一个文件里标签不能重复，否则汇编器直接报错。",
            "跳到另一个函数的中间。绕过入口的初始化，栈和寄存器状态都不对。",
            "把 jmp 写成条件跳转。jmp 无条件，写成 je 会把「否则」变成「相等才走」。",
            "标签紧贴指令导致可读性差。缩进和空行不会影响机器码，但会影响你查错。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 cmp、jge、jmp 写出及格与不及格两条分支，两个分数各跑一次。",
            "故意删掉 else 段末尾的 jmp，用 50 运行，观察退出码变成什么。",
            "画一张流程图，标出 then、else、end 三个标签的位置。"
          ]},
          { t: "tip", color: "green", text: "一句话：jmp 无条件改去向，if 与 else 靠一条条件跳转加一条 jmp 分成两路，最后在 end 汇合。" }
        ]
      },
      {
        id: "as09",
        title: "第 9 课 · 计数循环：dec 与 jnz（for）",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：用 dec 和 jnz 写计数循环，让一段代码重复执行固定次数，并能手推计数器每一轮的值。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "循环在机器层面就是一条往回跳的指令。先把计数器放进寄存器，循环体执行完减一，再判断计数器是不是零；不是零就跳回循环体开头，是零就继续往下走。整个循环没有专门的语法，只有初始化、循环体、减一、回跳四步。" },
          { t: "p", text: "dec 会把操作数减一，并根据结果更新零标志。减到零时 ZF 变成 1，jnz 看到 ZF 为 1 就不再跳，循环自然结束。jnz 和 jne 是同一条指令的两个名字，都表示零标志为 0 时跳转。" },
          { t: "p", text: "顺序很重要：先执行循环体，再 dec，再 jnz。如果把 dec 放在循环体前面，第一轮用的就是减过的值，总轮数会少一次。计数器放在 rcx 是惯例，因为字符串指令默认用它计数。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "重复处理固定数量的元素，例如数组的前 n 项。",
            "做倒计时，从 n 一直减到 0。",
            "把一段初始化代码执行指定次数，不需要下标参与计算。"
          ]},
          { t: "h2", text: "演示：累加 1 到 5" },
          { t: "p", text: "程序把 rcx 设为 5，用 rax 累加，每轮把 rcx 加进 rax，然后减一，直到 rcx 变成 0。" },
          { t: "code", lang: "asm", code: "global _start\n\nsection .text\n_start:\n    mov rcx, 5\n    xor eax, eax\nadd_loop:\n    add rax, rcx\n    dec rcx\n    jnz add_loop\n    mov edi, eax\n    mov eax, 60\n    syscall" },
          { t: "p", text: "五轮分别是 5、4、3、2、1，总和是 15，退出码就是 15。用 echo $? 能看到这个值，想看得更清楚可以在调试器里单步观察 rcx。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 280\"><rect x=\"24\" y=\"24\" width=\"592\" height=\"232\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"56\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">rcx 从 5 减到 0</text><rect x=\"60\" y=\"90\" width=\"70\" height=\"50\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"95\" y=\"121\" font-size=\"18\" text-anchor=\"middle\" fill=\"#173d36\">5</text><rect x=\"150\" y=\"90\" width=\"70\" height=\"50\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"185\" y=\"121\" font-size=\"18\" text-anchor=\"middle\" fill=\"#173d36\">4</text><rect x=\"240\" y=\"90\" width=\"70\" height=\"50\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"275\" y=\"121\" font-size=\"18\" text-anchor=\"middle\" fill=\"#173d36\">3</text><rect x=\"330\" y=\"90\" width=\"70\" height=\"50\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"365\" y=\"121\" font-size=\"18\" text-anchor=\"middle\" fill=\"#173d36\">2</text><rect x=\"420\" y=\"90\" width=\"70\" height=\"50\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"455\" y=\"121\" font-size=\"18\" text-anchor=\"middle\" fill=\"#173d36\">1</text><rect x=\"510\" y=\"90\" width=\"70\" height=\"50\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"545\" y=\"121\" font-size=\"18\" text-anchor=\"middle\" fill=\"#173d36\">0</text><path d=\"M130 115H146\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><polygon points=\"146,115 136,109 136,121\" fill=\"#2a8c78\"/><path d=\"M220 115H236\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><polygon points=\"236,115 226,109 226,121\" fill=\"#2a8c78\"/><path d=\"M310 115H326\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><polygon points=\"326,115 316,109 316,121\" fill=\"#2a8c78\"/><path d=\"M400 115H416\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><polygon points=\"416,115 406,109 406,121\" fill=\"#2a8c78\"/><path d=\"M490 115H506\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><polygon points=\"506,115 496,109 496,121\" fill=\"#2a8c78\"/><path d=\"M455 140V186H95V150\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><polygon points=\"95,150 89,160 101,160\" fill=\"#2a8c78\"/><text x=\"275\" y=\"176\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">jnz 跳回（rcx 不为 0）</text><path d=\"M545 140V210\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><polygon points=\"545,210 539,200 551,200\" fill=\"#2a8c78\"/><text x=\"545\" y=\"232\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">ZF=1 退出</text><text x=\"320\" y=\"252\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">每轮先把 rcx 加进 rax，再执行 dec</text></svg>", caption: "计数器每轮减一，减到零时零标志翻转，循环不再回跳。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "忘了 dec，计数器永远是 5，程序进入死循环。",
            "先 dec 再执行循环体，实际只处理了 n 减 1 轮。",
            "用 ecx 当计数器却按 rcx 读。写 ecx 会清零 rcx 的高 32 位，通常没问题，但要心里有数。",
            "在循环体里改掉计数器，轮数和你预期的不一样。",
            "用 jnz 之前又执行了一条会改标志位的指令，跳转依据已经变了。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "把演示改成累加 1 到 10，先手算总和，再推退出码。",
            "写一个从 5 倒数到 1 的循环，退出码设为循环轮数。",
            "把 dec 和 jnz 的顺序换一下，说明循环会执行几次。"
          ]},
          { t: "tip", color: "green", text: "一句话：计数循环靠 dec 把计数器减到零，jnz 依据零标志决定是否跳回开头。" }
        ]
      },
      {
        id: "as10",
        title: "第 10 课 · while 循环与比较",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：写出条件在顶部的 while 循环，分清有符号与无符号两组比较跳转，并能手推循环结束时寄存器的值。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "上一课的计数循环先执行循环体再判断，轮数一开始就定死了。while 把判断挪到顶部：每轮开头先比较，条件不成立就直接跳出，循环体可能一次都不执行。机器层面仍然只有标签和跳转，没有新的指令。" },
          { t: "p", text: "写法固定成四步：顶部放一个标签，用 cmp 把循环变量和界限相减，紧跟一条条件跳转跳到结束标签，循环体末尾再用 jmp 回到顶部。cmp 做减法但不保存结果，只更新标志位；条件跳转读的正是这些标志位。" },
          { t: "p", text: "比较跳转分成两套。jl、jle、jg、jge 按有符号数解释，负数比正数小；jb、jbe、ja、jae 按无符号数解释，最高位被当成数值的一部分。循环变量是人写的计数时用有符号那套，长度、地址、字节值用无符号那套，混用会把负数看成很大的正数。" },
          { t: "p", text: "循环体里修改循环变量是正常做法，但改完必须保证还能回到顶部再比较一次。如果条件在循环体内部被改掉，退出时机也跟着变。写完拿初值手推一遍，把每一轮的变量值列成表，比盯着代码猜要可靠。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "反复翻倍或减半，直到数值越过某个门槛，轮数事先并不知道。",
            "逐位处理一个整数，直到它被除到零为止。",
            "不停地读入、计算、再读下一批，条件满足就一直做下去。"
          ]},
          { t: "h2", text: "演示：翻倍到一百" },
          { t: "p", text: "程序从 1 开始不断翻倍，直到不小于 100 为止，用 rbx 记翻倍次数。条件放在顶部，第一次比较时 rax 还是 1，成立才进入循环体。" },
          { t: "code", lang: "asm", code: "global _start\n\nsection .text\n_start:\n    mov rax, 1\n    xor ebx, ebx\nwhile_top:\n    cmp rax, 100\n    jge while_end\n    add rax, rax\n    inc rbx\n    jmp while_top\nwhile_end:\n    mov edi, ebx\n    mov eax, 60\n    syscall" },
          { t: "p", text: "1 翻倍七次到 128，这时再比较已经不满足条件，循环结束，rbx 是 7，退出码就是 7。把初值改成 200，第一次比较就不成立，循环体一次也不执行，退出码是 0。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 300\"><rect x=\"24\" y=\"20\" width=\"592\" height=\"260\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"50\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">条件在顶部，假就跳出</text><rect x=\"210\" y=\"70\" width=\"220\" height=\"44\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"320\" y=\"98\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">顶部：cmp rax, 100</text><path d=\"M320 114V136\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><polygon points=\"320,136 314,126 326,126\" fill=\"#2a8c78\"/><rect x=\"210\" y=\"140\" width=\"220\" height=\"44\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"320\" y=\"168\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">rax 小于 100 吗</text><path d=\"M430 162H486\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><polygon points=\"486,162 476,156 476,168\" fill=\"#2a8c78\"/><text x=\"458\" y=\"154\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">假</text><rect x=\"490\" y=\"140\" width=\"126\" height=\"44\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"553\" y=\"168\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">退出，码 7</text><path d=\"M320 184V208\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><polygon points=\"320,208 314,198 326,198\" fill=\"#2a8c78\"/><text x=\"336\" y=\"202\" font-size=\"14\" fill=\"#4d6f67\">真</text><rect x=\"180\" y=\"210\" width=\"280\" height=\"48\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"320\" y=\"240\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">翻倍 rax，rbx 加一，jmp 回顶部</text><path d=\"M180 234H120V92H206\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><polygon points=\"206,92 196,86 196,98\" fill=\"#2a8c78\"/><text x=\"320\" y=\"274\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">条件不成立时，循环体一次也不执行</text></svg>", caption: "条件在顶部，成立才进循环体，循环体末尾的 jmp 把它送回比较处。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把判断放到循环体末尾，条件一开始就不成立时仍会多执行一次。",
            "循环体末尾忘了 jmp，程序顺着往下滑，循环只跑一遍。",
            "有符号与无符号跳转混用，负数被当成很大的正数，循环提前结束或停不下来。",
            "在 cmp 和条件跳转之间插入 add、inc 之类的指令，标志位被覆盖，跳转依据已经不是刚才那次比较。",
            "循环变量用 32 位寄存器写、却按 64 位读，高位是旧值，比较结果对不上。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 while 求 1 到 100 的和，先手算再写代码，说明退出码该怎么取。",
            "把演示改成每次乘 3，直到超过 1000，数一数循环体执行了几次。",
            "把比较和条件跳转挪到循环体末尾，说明初值 1 时结果差在哪里。",
            "画一张 while 流程图，标出条件为假时的出口和 jmp 的回边。"
          ]},
          { t: "tip", color: "green", text: "一句话：while 把条件放在顶部，不成立就跳出，循环体末尾用 jmp 回到顶部再比较。" }
        ]
      },
      {
        id: "as11",
        title: "第 11 课 · 函数：call / ret / 栈帧",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：用 call 与 ret 调用子程序，说清返回地址怎么进栈，并用 rbp 搭出一次完整的栈帧。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "函数在汇编里叫子程序，没有参数表也没有返回类型，只有一段带标签的代码和一条 ret。call 做两件事：把下一条指令的地址压进栈，再跳到目标标签。ret 从栈顶弹出这个地址装回指令指针，程序就回到调用点的下一行继续走。" },
          { t: "p", text: "栈从高地址往低地址长。push 先把 rsp 减 8 再写值，pop 先读值再把 rsp 加 8。所以每调用一次，rsp 就往下走一格，返回时再抬回来。调用前后 rsp 必须回到同一个位置，这是函数能正确返回的底线。" },
          { t: "p", text: "栈帧是函数自己划出的一块空间。进入函数先 push rbp 保存调用者的帧指针，再 mov rbp, rsp 把当前栈顶记成自己的帧底；需要局部变量就用 sub rsp 腾地方，变量放在 rbp 减 8、减 16 这些位置。收尾反过来：先 mov rsp, rbp 丢掉局部变量，再 pop rbp 恢复旧帧指针，最后 ret。" },
          { t: "p", text: "参数按顺序放 rdi、rsi、rdx、rcx、r8、r9，返回值放 rax。rbx、rbp、r12 到 r15 由被调用方保存，改了要还原；rax、rcx、rdx、rsi、rdi、r8 到 r11 由调用方自己负责。记不住约定时，先只用一个参数和一个返回值，把流程跑通再扩展。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "把重复出现的计算收进子程序，主流程只负责准备参数和调用。",
            "给一段代码配上明确的入口与出口，单步调试时容易看清边界。",
            "为以后与 C 代码互相调用打基础，参数和返回值走同一套寄存器。"
          ]},
          { t: "h2", text: "演示：调用加法子程序" },
          { t: "p", text: "主程序把 40 和 2 放进 edi 与 esi，然后 call add_two。子程序先建立栈帧，把两个参数相加放进 rax，恢复栈帧后 ret；主程序把结果搬进 edi 当退出码。" },
          { t: "code", lang: "asm", code: "global _start\n\nsection .text\n_start:\n    mov edi, 40\n    mov esi, 2\n    call add_two\n    mov edi, eax\n    mov eax, 60\n    syscall\n\nadd_two:\n    push rbp\n    mov rbp, rsp\n    mov rax, rdi\n    add rax, rsi\n    pop rbp\n    ret" },
          { t: "p", text: "运行时退出码是 42。在调试器里单步，call 之后能看到 rsp 减了 8，栈顶正是返回地址；执行 push rbp 后再减 8，rbp 指向的位置存着调用者的旧帧指针。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 320\"><rect x=\"24\" y=\"18\" width=\"592\" height=\"286\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"48\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">栈从高地址向低地址长</text><text x=\"92\" y=\"82\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">高地址</text><path d=\"M92 96V274\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><polygon points=\"92,278 86,268 98,268\" fill=\"#2a8c78\"/><text x=\"92\" y=\"298\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">低地址</text><rect x=\"150\" y=\"66\" width=\"300\" height=\"44\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"300\" y=\"94\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">调用者的栈帧</text><rect x=\"150\" y=\"120\" width=\"300\" height=\"44\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"300\" y=\"148\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">返回地址</text><rect x=\"150\" y=\"174\" width=\"300\" height=\"44\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"300\" y=\"202\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">保存的旧 rbp</text><rect x=\"150\" y=\"228\" width=\"300\" height=\"44\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"300\" y=\"256\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">局部变量 rbp-8</text><text x=\"462\" y=\"98\" font-size=\"14\" fill=\"#4d6f67\">call 先压返回地址</text><text x=\"462\" y=\"152\" font-size=\"14\" fill=\"#4d6f67\">rsp 每压一次减 8</text><path d=\"M452 192H474\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><text x=\"480\" y=\"196\" font-size=\"14\" fill=\"#4d6f67\">rbp 指向帧底</text><path d=\"M452 246H474\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><text x=\"480\" y=\"250\" font-size=\"14\" fill=\"#4d6f67\">rsp 指向栈顶</text><text x=\"320\" y=\"292\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">ret 弹出返回地址，rsp 抬回原位</text></svg>", caption: "call 压返回地址，push rbp 压旧帧指针；ret 按相反顺序把栈顶还回去。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "call 之后忘了 ret，执行会滑进下一个子程序，返回地址还压在栈上。",
            "ret 之前 rsp 没有回到调用时的位置，push 多 pop 少，弹出的就不是返回地址。",
            "把 rbp 当普通寄存器随手改，收尾时帧指针错位，局部变量全部读错。",
            "参数寄存器记反，第一个参数在 rdi 而不是 rax，子程序拿到的是垃圾值。",
            "以为子程序可以随便改 rbx、r12 到 r15，调用方原来的值被破坏。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "写一个子程序接收两个参数，返回其中较大的那个，用退出码验证。",
            "画出 call 前、call 后、push rbp 后三个时刻的栈内容与 rsp 位置。",
            "故意删掉收尾的 pop rbp 再运行，说明 ret 会弹到哪个地址。",
            "给 add_two 加一个局部变量放在 rbp 减 8，写出 sub rsp 与收尾的 mov rsp, rbp。"
          ]},
          { t: "tip", color: "green", text: "一句话：call 压返回地址并跳转，ret 弹回地址；栈帧用 rbp 定底、rsp 定顶，进出必须成对。" }
        ]
      },
      {
        id: "as12",
        title: "第 12 课 · 数组与字符串遍历",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：用基址加变址访问数组，按元素宽度算出偏移，并写出靠结尾零判断的字符串遍历。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "数组在汇编里就是一段连续内存，没有长度字段，也没有下标越界检查。元素地址等于基址加下标乘元素宽度。qword 数组每个元素 8 字节，所以下标为 2 的元素在基址加 16 处，而不是加 2。" },
          { t: "p", text: "x86-64 的寻址方式允许写 [rbx + rcx*8]，rbx 放基址，rcx 放下标，比例因子只能是 1、2、4、8。倍数不是这几个值时，先用 lea 或移位算出偏移，再单独加到基址上。" },
          { t: "p", text: "字符串是字节数组，每个字符 1 字节，结尾放一个 0 当结束标记。遍历时用 movzx 把字节零扩展进 32 位寄存器，再用 test 或 cmp 看它是不是 0；不是就处理并让下标加一，是就停下。长度不写在内存里，只能数出来或者由调用方传入。" },
          { t: "p", text: "遍历要守住两条边界：下标从 0 开始，最多走到长度减一；结束标记必须存在，否则扫描会越过缓冲区。数组和字符串都不会替你挡错误，越界读在汇编里通常不会立刻崩溃，只会悄悄读错数据。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "求一组整数的和、最大值或平均值，元素宽度固定，循环很好写。",
            "统计字符串长度、查找某个字符，或者把大写转成小写。",
            "按固定步长遍历结构体数组，一次取一个字段。"
          ]},
          { t: "h2", text: "演示：数出字符串长度" },
          { t: "p", text: "程序把字符串首地址装进 rbx，用 rcx 当下标。每轮读一个字节，等于 0 就跳到结束，否则下标加一继续。最后把下标当退出码。" },
          { t: "code", lang: "asm", code: "global _start\n\nsection .text\n_start:\n    lea rbx, [msg]\n    xor ecx, ecx\nscan:\n    movzx eax, byte [rbx + rcx]\n    test al, al\n    jz scan_done\n    inc rcx\n    jmp scan\nscan_done:\n    mov edi, ecx\n    mov eax, 60\n    syscall\n\nsection .data\nmsg: db 'asm demo', 0" },
          { t: "p", text: "字符串是 asm demo，八个字符，退出码就是 8。注意下标在比较前没有越界保护，靠的就是结尾那个 0；一旦漏写，循环会一直往后读。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 280\"><rect x=\"24\" y=\"20\" width=\"592\" height=\"232\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"50\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">每个元素占 8 字节</text><rect x=\"48\" y=\"70\" width=\"104\" height=\"62\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"100\" y=\"98\" font-size=\"18\" text-anchor=\"middle\" fill=\"#173d36\">10</text><text x=\"100\" y=\"120\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">base+0</text><rect x=\"190\" y=\"70\" width=\"104\" height=\"62\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"242\" y=\"98\" font-size=\"18\" text-anchor=\"middle\" fill=\"#173d36\">20</text><text x=\"242\" y=\"120\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">base+8</text><rect x=\"332\" y=\"70\" width=\"104\" height=\"62\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"384\" y=\"98\" font-size=\"18\" text-anchor=\"middle\" fill=\"#173d36\">30</text><text x=\"384\" y=\"120\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">base+16</text><rect x=\"474\" y=\"70\" width=\"104\" height=\"62\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"526\" y=\"98\" font-size=\"18\" text-anchor=\"middle\" fill=\"#173d36\">40</text><text x=\"526\" y=\"120\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">base+24</text><text x=\"100\" y=\"160\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">下标 0</text><text x=\"242\" y=\"160\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">下标 1</text><text x=\"384\" y=\"160\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">下标 2</text><text x=\"526\" y=\"160\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">下标 3</text><path d=\"M100 190H238\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><polygon points=\"238,190 228,184 228,196\" fill=\"#2a8c78\"/><text x=\"169\" y=\"182\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">加 8 字节</text><text x=\"320\" y=\"226\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">地址 = 基址 + 下标 乘 8，不是加 1</text></svg>", caption: "qword 数组按 8 字节一格往前走，下标乘 8 才是真正的偏移。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "忘了乘元素宽度，按 1 字节走，读到的只是半个 qword。",
            "以为数组自带长度，实际上长度要么由调用方传入，要么另存一个常量。",
            "字符串结尾漏掉 0，扫描不会停，越界读到别的段才可能出错。",
            "用 mov 读整个 qword 去比较字符，把后面七个字节也带了进来。",
            "下标用 rcx 计算却写成 [rbx + rcx]，偏移只有 rcx 字节，元素全错位。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 dq 定义一个四元素数组，循环求和，退出码取和对 256 取余的结果。",
            "写一段代码统计字符串里小写字母的个数，先说明怎么判断范围。",
            "把演示的结束标记换成换行符 10，写出判断条件该怎么改。",
            "画一张四元素 qword 数组的内存图，标出每个元素的地址与字节跨度。"
          ]},
          { t: "tip", color: "green", text: "一句话：数组按基址加下标乘元素宽度寻址，字符串靠结尾的 0 停下，边界要自己守。" }
        ]
      }
    ]
  }
};