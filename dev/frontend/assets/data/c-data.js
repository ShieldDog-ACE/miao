/* 喵站 · C 入门（2026-10-27 补全分类教程；12 课单文件）
 * 代码块由代理起草后用 gcc -std=c11 实测；超长块只做了大括号合行与去空行，语义未改。 */
window.MIAO_C = {
  "tutorial": {
    "id": "c",
    "title": "C 入门",
    "intro": "从贝尔实验室的 Unix 讲到字符数组：12 课把 C 的基础语法走完，每课都有能照敲的程序和一张机制图。",
    "cat": "c",
    "diff": "入门",
    "tags": [
      "C",
      "GCC",
      "入门",
      "编程"
    ],
    "author": "喵站官方",
    "cover": "/assets/img/covers/c.svg",
    "updated": "2026-10-27",
    "chapters": [
      {
        "id": "c01",
        "title": "第 1 课 · C 的历史：从贝尔实验室到 Unix",
        "blocks": [
          {
            "t": "tip",
            "color": "blue",
            "text": "本课目标：知道 C 从哪里来、为什么它和 Unix 绑在一起，以及它今天还活在哪些地方。"
          },
          {
            "t": "h2",
            "text": "原理讲解"
          },
          {
            "t": "p",
            "text": "1969 年前后，贝尔实验室的 Ken Thompson 和 Dennis Ritchie 在一台闲置的 PDP-7 上做操作系统实验，那个系统后来叫 Unix。他们很快发现一个麻烦：用汇编写的系统，换一台机器就要从头重写一遍。"
          },
          {
            "t": "p",
            "text": "1972 年，Ritchie 在 B 语言的基础上做出 C，最早的用途就是重写 Unix 内核。C 的取舍很明确：语法小、贴近硬件、编译出来的指令快，但不提供垃圾回收、不检查数组越界、也不管一块内存什么时候该还回去。这些决定全部交给写代码的人。"
          },
          {
            "t": "p",
            "text": "正因为它不替你做决定，同一份源码可以搬到小型机、个人电脑和单片机上编译，Unix 也因此能被移植到各种机器。1978 年 Kernighan 和 Ritchie 出了那本白皮书，C 从实验室走进大学课堂；1989 年有了 C89 标准，之后是 C99、C11、C17。"
          },
          {
            "t": "h2",
            "text": "假设它能干什么"
          },
          {
            "t": "p",
            "text": "C 几乎出现在所有需要贴着硬件跑的地方：操作系统内核、驱动程序、数据库引擎、编译器和解释器、单片机固件、高性能网络服务。它也是很多语言的地基，理解 C 之后再去看别的语言的运行时，会容易很多。"
          },
          {
            "t": "h2",
            "text": "演示：一段 C 程序长什么样"
          },
          {
            "t": "p",
            "text": "先看形状，不急着装环境。C 程序由一个或多个函数组成，入口固定叫 main，输出用标准库里的 printf。下面这段现在不用逐词看懂，后面单独一课会把它拆开讲。"
          },
          {
            "t": "code",
            "lang": "c",
            "code": "#include <stdio.h>\n\nint main(void)\n{\n    printf(\"hello, world\\n\");\n    return 0;\n}"
          },
          {
            "t": "p",
            "text": "三个外形特征先记住：每条语句以分号结尾；大括号圈出一段代码的范围；printf 圆括号里那串字符末尾的反斜杠 n 表示换行，它不会原样打印出来。这些规则在编译期就会被检查，写错一个分号程序根本编不过。"
          },
          {
            "t": "svg",
            "code": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"78\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">C 的四个时间点</text><line x1=\"96\" y1=\"148\" x2=\"544\" y2=\"148\" stroke=\"#2a8c78\" stroke-width=\"3\"/><circle cx=\"120\" cy=\"148\" r=\"7\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"3\"/><text x=\"120\" y=\"126\" font-size=\"16\" text-anchor=\"middle\" fill=\"#173d36\">1972</text><text x=\"120\" y=\"178\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">C 诞生</text><circle cx=\"264\" cy=\"148\" r=\"7\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"3\"/><text x=\"264\" y=\"126\" font-size=\"16\" text-anchor=\"middle\" fill=\"#173d36\">1973</text><text x=\"264\" y=\"178\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">重写 Unix</text><circle cx=\"408\" cy=\"148\" r=\"7\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"3\"/><text x=\"408\" y=\"126\" font-size=\"16\" text-anchor=\"middle\" fill=\"#173d36\">1989</text><text x=\"408\" y=\"178\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">C89 标准</text><circle cx=\"536\" cy=\"148\" r=\"7\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"3\"/><text x=\"536\" y=\"126\" font-size=\"16\" text-anchor=\"middle\" fill=\"#173d36\">2011</text><text x=\"536\" y=\"178\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">C11 标准</text></svg>",
            "caption": "C 诞生一年后就用来重写 Unix，语言和系统互相成就。"
          },
          {
            "t": "h2",
            "text": "常见坑"
          },
          {
            "t": "ul",
            "items": [
              "把 C 当成过时的语言。它的语法确实老，但操作系统、数据库这些底座仍然靠它。",
              "以为学会 C 就能直接写大型项目。C 不提供现成工具，工程组织要自己搭。",
              "把 C 和 C++ 混为一谈。C++ 从 C 出发，却加了类、模板、异常，是另一门语言。",
              "听说 C 快就忽略安全。越界、野指针这类问题编译器不会拦，全靠写的人小心。"
            ]
          },
          {
            "t": "h2",
            "text": "任务"
          },
          {
            "t": "ul",
            "items": [
              "用自己的话写下 C 被造出来的两个直接原因。",
              "列出你机器上三个可能由 C 写成的程序，说明它们属于哪一类软件。",
              "观察演示里的程序，数一数分号出现了几次，分别在哪几行。"
            ]
          },
          {
            "t": "tip",
            "color": "green",
            "text": "一句话：C 是为写 Unix 而生的小语言，它不替写代码的人兜底，所以能跑遍几乎所有平台。"
          }
        ]
      },
      {
        "id": "c02",
        "title": "第 2 课 · 装 GCC 和 VS Code",
        "blocks": [
          {
            "t": "tip",
            "color": "blue",
            "text": "本课目标：在终端里装好 GCC 和 VS Code，用 gcc --version 看到版本号，再确认编辑器能调用编译器。"
          },
          {
            "t": "h2",
            "text": "原理讲解"
          },
          {
            "t": "p",
            "text": "GCC 是 GNU 编译器集合里负责 C 的那一个。你写的是文本源码，gcc 把它翻译成机器能执行的指令。安装 build-essential 这个包会一次装好 gcc、make 和标准库头文件，省得你一个个补齐。"
          },
          {
            "t": "p",
            "text": "VS Code 只是编辑器，负责写文件和显示报错。装上 C/C++ 扩展之后，它会去调用你本机的 gcc 做语法检查和补全。所以顺序不能反：先有 gcc，扩展开箱才有效。"
          },
          {
            "t": "p",
            "text": "PATH 是系统找命令时依次翻的目录清单。gcc 装进 /usr/bin 这类已经在清单里的目录，终端就直接认得；用压缩包解压到别处，就得自己把那个 bin 目录加进 PATH，再让终端重新读一次配置。"
          },
          {
            "t": "h2",
            "text": "假设它能干什么"
          },
          {
            "t": "p",
            "text": "工具链就绪之后，你可以在任意目录写 .c 文件，一条命令编译，一条命令运行；编辑器会在你打字时就标出漏掉的分号和类型不匹配，不必等到编译才发现。"
          },
          {
            "t": "h2",
            "text": "演示：在 Ubuntu 上装好工具链"
          },
          {
            "t": "p",
            "text": "下面几条命令按顺序敲：第一条刷新软件索引，第二条装编译工具，第三条装编辑器，第四条给编辑器装扩展，最后一条验证编译器。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "sudo apt update\nsudo apt install -y build-essential\nsudo snap install code --classic\ncode --install-extension ms-vscode.cpptools\ngcc --version"
          },
          {
            "t": "p",
            "text": "gcc --version 的第一行形如 gcc (Ubuntu 13.2.0-23ubuntu4) 13.2.0，看到版本号就说明编译器可用。扩展装完重开 VS Code，打开一个 .c 文件，右下角会显示当前用的编译器。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "# Fedora 系用 dnf 装同一套工具\nsudo dnf install -y gcc make\ngcc --version"
          },
          {
            "t": "svg",
            "code": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">安装链：包装进清单才认得出</text><rect x=\"56\" y=\"104\" width=\"118\" height=\"58\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"115\" y=\"128\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">安装包</text><text x=\"115\" y=\"149\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">build-essential</text><path d=\"M178 133H216\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"216,133 206,127 206,139\" fill=\"#2a8c78\"/><rect x=\"224\" y=\"104\" width=\"108\" height=\"58\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"278\" y=\"128\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">gcc</text><text x=\"278\" y=\"149\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">/usr/bin</text><path d=\"M336 133H374\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"374,133 364,127 364,139\" fill=\"#2a8c78\"/><rect x=\"382\" y=\"104\" width=\"104\" height=\"58\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"434\" y=\"128\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">PATH</text><text x=\"434\" y=\"149\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">命令清单</text><path d=\"M490 133H518\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"518,133 508,127 508,139\" fill=\"#2a8c78\"/><rect x=\"526\" y=\"104\" width=\"96\" height=\"58\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"574\" y=\"128\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">版本号</text><text x=\"574\" y=\"149\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">安装成功</text></svg>",
            "caption": "装好的判据不是「装完了」，而是终端能执行 gcc --version。"
          },
          {
            "t": "h2",
            "text": "常见坑"
          },
          {
            "t": "ul",
            "items": [
              "装完敲 gcc 提示 command not found。多数是 PATH 没刷新，关掉终端重开即可。",
              "只装了 gcc 没装头文件。编译时找不到 stdio.h，补装 build-essential 或 libc6-dev。",
              "同时装了系统仓库版和自编译版，终端跑的不是你以为的那一个。用 which gcc 看实际路径。",
              "把 VS Code 的报错当成编译器报错。扩展用的是内置检查器，最终要以 gcc 的输出为准。",
              "用 root 身份在项目目录里编译。生成的文件归 root，后面普通用户改不动。"
            ]
          },
          {
            "t": "h2",
            "text": "任务"
          },
          {
            "t": "ul",
            "items": [
              "按演示装好 GCC 和 VS Code，把 gcc --version 的输出抄下来。",
              "用 which gcc 确认命令的实际路径，再说出它为什么能被终端找到。",
              "在 VS Code 里新建一个 .c 文件，故意漏掉一个分号，看编辑器有没有立刻标红。"
            ]
          },
          {
            "t": "tip",
            "color": "green",
            "text": "一句话：GCC 负责翻译源码，VS Code 负责写源码；判断装好没有，只看 gcc --version 有没有吐出数字。"
          }
        ]
      },
      {
        "id": "c03",
        "title": "第 3 课 · 第一个程序：printf",
        "blocks": [
          {
            "t": "tip",
            "color": "blue",
            "text": "本课目标：写出第一个 .c 文件，用 gcc 编译成可执行文件并运行，看懂 include、main、printf、return 各自在做什么。"
          },
          {
            "t": "h2",
            "text": "原理讲解"
          },
          {
            "t": "p",
            "text": "C 程序的执行入口是 main 函数。程序启动后，操作系统找到 main，从它的第一行开始执行。int 写在 main 前面，表示这个函数会返回一个整数；结尾的 return 0 把这个整数交给系统，0 约定为正常结束。"
          },
          {
            "t": "p",
            "text": "#include <stdio.h> 是预处理指令，作用是在编译前把标准输入输出的声明原样抄进来。printf 的声明就在这个头文件里，没有它编译器会抱怨不认识 printf，链接时也可能找不到函数。"
          },
          {
            "t": "p",
            "text": "printf 的第一个参数叫格式串，里面的 %d 是占位符，按顺序接收后面的整数；%c 接字符，%f 接小数，%s 接字符串。反斜杠 n 是换行符，它让输出另起一行，而不是原样打印两个字符。"
          },
          {
            "t": "h2",
            "text": "假设它能干什么"
          },
          {
            "t": "p",
            "text": "会打印就能观察程序内部：变量现在是多少、循环走到第几轮、函数返回了什么。后面每节课的演示都靠 printf 把结果拿出来看，它是最小也最可靠的调试工具。"
          },
          {
            "t": "h2",
            "text": "演示：写文件、编译、运行"
          },
          {
            "t": "p",
            "text": "新建一个目录，在里面建 hello.c，内容如下。文件名随意，扩展名必须是 .c，否则 gcc 不会把它当 C 源码处理。"
          },
          {
            "t": "code",
            "lang": "c",
            "code": "#include <stdio.h>\n\nint main(void)\n{\n    printf(\"你好，C\\n\");\n    printf(\"一年有 %d 个月\\n\", 12);\n    return 0;\n}"
          },
          {
            "t": "p",
            "text": "保存后回到终端，用 gcc 编译。这一行做了三件事：读源码、检查语法、生成可执行文件。加 -o hello 是把输出命名为 hello，不加时 Linux 上默认叫 a.out。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "gcc hello.c -o hello\n./hello"
          },
          {
            "t": "p",
            "text": "运行 ./hello，终端会打印两行：第一行是问候，第二行把 12 填进 %d 的位置。./ 不能省，它表示「当前目录下的这个文件」，否则系统会去 PATH 里找同名命令。"
          },
          {
            "t": "svg",
            "code": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">从文本到输出</text><rect x=\"56\" y=\"100\" width=\"132\" height=\"72\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"122\" y=\"126\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">hello.c</text><text x=\"122\" y=\"148\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">纯文本源码</text><text x=\"122\" y=\"164\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">人能读懂</text><path d=\"M192 136H236\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"236,136 226,130 226,142\" fill=\"#2a8c78\"/><rect x=\"244\" y=\"100\" width=\"132\" height=\"72\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"310\" y=\"126\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">gcc</text><text x=\"310\" y=\"148\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">检查语法</text><text x=\"310\" y=\"164\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">翻译成指令</text><path d=\"M380 136H424\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"424,136 414,130 414,142\" fill=\"#2a8c78\"/><rect x=\"432\" y=\"100\" width=\"132\" height=\"72\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"498\" y=\"126\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">hello</text><text x=\"498\" y=\"148\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">可执行文件</text><text x=\"498\" y=\"164\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">机器能执行</text></svg>",
            "caption": "编译器是中间那一步：进去是文本，出来是机器指令。"
          },
          {
            "t": "h2",
            "text": "常见坑"
          },
          {
            "t": "ul",
            "items": [
              "把 #include 后面的尖括号写成圆括号。尖括号表示到系统目录里找头文件。",
              "main 写成 mian。拼错之后链接器会报找不到入口，报错里不会直接说拼错了。",
              "格式串里写了 %d 却没给后面的值，或者给了值却没写占位符，输出会错位。",
              "把反斜杠 n 敲成斜杠 n。这样打印出来的是两个字面字符，不会换行。",
              "在 Windows 上编译出的 hello.exe，拷到 Linux 上跑不了。可执行文件跟平台绑定。"
            ]
          },
          {
            "t": "h2",
            "text": "任务"
          },
          {
            "t": "ul",
            "items": [
              "照演示跑通 hello.c，把问候改成你的名字，重新编译再运行。",
              "用 printf 一次打印三个数，格式串里写三个 %d，观察输出顺序。",
              "删掉 #include <stdio.h> 这一行再编译，把报错原文抄下来，然后加回去。"
            ]
          },
          {
            "t": "tip",
            "color": "green",
            "text": "一句话：include 借来声明，main 是入口，printf 往终端写字，return 0 告诉系统一切正常。"
          }
        ]
      },
      {
        "id": "c04",
        "title": "第 4 课 · 变量与声明",
        "blocks": [
          {
            "t": "tip",
            "color": "blue",
            "text": "本课目标：会声明变量、给变量赋值、用 printf 打印变量的值，并知道没初始化的局部变量不能直接用。"
          },
          {
            "t": "h2",
            "text": "原理讲解"
          },
          {
            "t": "p",
            "text": "变量是内存里一块起了名字的空间。声明变量时要给出两样东西：类型和名字，例如 int age。类型决定这块空间有多大、里面的二进制按什么规则解释；名字让你后面能反复找到它。"
          },
          {
            "t": "p",
            "text": "声明的同时可以赋初值，写成 int age = 18。也可以先声明再赋值：先写 int count，后面写 count = 3。第一次出现要带类型，之后再改值只写名字和等号，不要重复写类型。"
          },
          {
            "t": "p",
            "text": "名字由字母、数字、下划线组成，不能以数字开头，区分大小写，也不能是 int、return 这类关键字。函数内部的局部变量如果不赋初值，里面是上一次留下的残留数据，读它属于未定义行为。"
          },
          {
            "t": "h2",
            "text": "假设它能干什么"
          },
          {
            "t": "ul",
            "items": [
              "保存用户输入、计算结果、循环计数这类会变的值。",
              "给一段数据起个能读懂的名字，后面的代码不用重复写一长串表达式。",
              "先声明占位，等程序跑到某一步再填真正的值。",
              "把中间结果存下来，避免同一个式子算两遍。"
            ]
          },
          {
            "t": "h2",
            "text": "演示：声明、赋值、打印"
          },
          {
            "t": "p",
            "text": "下面四个变量用了三种类型，count 故意先声明后赋值，用来对比两种写法的顺序。"
          },
          {
            "t": "code",
            "lang": "c",
            "code": "#include <stdio.h>\nint main(void) {\n    int age = 18;\n    double price = 9.9;\n    char grade = 'A';\n    int count;\n    count = 3;\n    printf(\"%d\\n\", age);\n    printf(\"%f\\n\", price);\n    printf(\"%c\\n\", grade);\n    printf(\"%d\\n\", count);\n    return 0;\n}"
          },
          {
            "t": "p",
            "text": "输出是 18、9.900000、A、3。double 用 %f 打印时默认保留六位小数；char 用单引号包一个字符，用 %c 打印。把类型和占位符对上，是 printf 不出错的前提。"
          },
          {
            "t": "svg",
            "code": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"78\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">变量是带类型的盒子</text><rect x=\"72\" y=\"104\" width=\"132\" height=\"78\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"138\" y=\"130\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">age</text><text x=\"138\" y=\"152\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">类型 int</text><text x=\"138\" y=\"170\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">占 4 字节</text><text x=\"226\" y=\"150\" font-size=\"22\" text-anchor=\"middle\" fill=\"#2a8c78\">=</text><rect x=\"248\" y=\"104\" width=\"120\" height=\"78\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"308\" y=\"134\" font-size=\"24\" text-anchor=\"middle\" fill=\"#173d36\">18</text><text x=\"308\" y=\"164\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">盒子里的值</text><path d=\"M376 143H440\" stroke=\"#7fa99f\" stroke-width=\"3\"/><polygon points=\"440,143 430,137 430,149\" fill=\"#7fa99f\"/><text x=\"502\" y=\"132\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">换个值</text><text x=\"502\" y=\"156\" font-size=\"20\" text-anchor=\"middle\" fill=\"#173d36\">19</text><text x=\"502\" y=\"180\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">名字与类型不变</text></svg>",
            "caption": "赋值只换盒子里的内容，盒子的名字和类型在声明时就定下了。"
          },
          {
            "t": "h2",
            "text": "常见坑"
          },
          {
            "t": "ul",
            "items": [
              "局部变量没赋初值就直接打印。读到的是残留数据，每次运行都可能不一样。",
              "把变量名写成中文或拼音缩写。语法上可能通过，但读代码的人要多猜一层。",
              "用 %d 打印 double，或用 %f 打印 int。占位符和类型不匹配，输出是乱的。",
              "把字符写成双引号。双引号是字符串，单引号才是单个字符。",
              "在同一作用域里重复声明同名变量。编译器会报重定义。"
            ]
          },
          {
            "t": "h2",
            "text": "任务"
          },
          {
            "t": "ul",
            "items": [
              "声明三个变量分别存名字的首字母、年龄、身高，用三条 printf 各打印一次。",
              "先声明一个 int 变量不赋值，打印它；再赋一个新值打印第二次，比较两次结果。",
              "把 printf 里的 %d 换成 %f，看输出变成什么，再改回来。"
            ]
          },
          {
            "t": "tip",
            "color": "green",
            "text": "一句话：声明给出类型和名字，赋值往里放值；局部变量不初始化就是残留数据，用之前必须先写。"
          }
        ]
      },
      {
        "id": "c05",
        "title": "第 5 课 · 数据类型与 sizeof",
        "blocks": [
          {
            "t": "tip",
            "color": "blue",
            "text": "本课目标：认识 C 的基本数据类型，会用 sizeof 量出每种类型占几个字节，知道这些宽度并不完全固定。"
          },
          {
            "t": "h2",
            "text": "原理讲解"
          },
          {
            "t": "p",
            "text": "C 的基本类型有 char、short、int、long、float、double 这几种。char 最小，通常占一个字节；int 是日常计算的主力；double 装双精度小数。C 标准只规定每种类型的最小范围，没有规定它必须是多少位。"
          },
          {
            "t": "p",
            "text": "sizeof 是运算符，不是函数。它给出某个类型或某个变量占用的字节数，结果类型是 size_t，printf 要用 %zu 接。sizeof 在编译期就能算出来，不会真的去读变量的值。"
          },
          {
            "t": "p",
            "text": "每种整数类型默认有符号，加上 unsigned 就只表示非负数，正数范围整体上移。有符号整数超出范围再运算属于未定义行为，结果不可预测，编译器不会在运行时替你拦下来。"
          },
          {
            "t": "h2",
            "text": "假设它能干什么"
          },
          {
            "t": "ul",
            "items": [
              "估算一组数据要占多少内存，决定用哪种类型。",
              "挑够用又不浪费的宽度：人数用 int，金额用 double。",
              "用 sizeof 打印各平台的差异，排查移植时写死的假设。",
              "判断一个变量在内存里到底占几个格子。"
            ]
          },
          {
            "t": "h2",
            "text": "演示：量出六种类型的宽度"
          },
          {
            "t": "p",
            "text": "这段程序把六种类型的 sizeof 打印出来，最后一行量的是一个变量而不是类型。两种写法都合法，括号只在跟类型名时才必须写。"
          },
          {
            "t": "code",
            "lang": "c",
            "code": "#include <stdio.h>\nint main(void) {\n    printf(\"char %zu\\n\", sizeof(char));\n    printf(\"short %zu\\n\", sizeof(short));\n    printf(\"int %zu\\n\", sizeof(int));\n    printf(\"long %zu\\n\", sizeof(long));\n    printf(\"float %zu\\n\", sizeof(float));\n    printf(\"double %zu\\n\", sizeof(double));\n    int count = 5;\n    printf(\"count %zu\\n\", sizeof count);\n    return 0;\n}"
          },
          {
            "t": "p",
            "text": "在常见的 64 位 Linux 上，输出是 1、2、4、8、4、8，最后一行是 4。换到别的平台，int 可能是 2 也可能是 8，所以代码里不要写死字节数；需要固定宽度时，用 stdint.h 里的 int32_t 这类名字。"
          },
          {
            "t": "svg",
            "code": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"78\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">一个字节一格，宽度不一样</text><text x=\"78\" y=\"112\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">char</text><rect x=\"112\" y=\"94\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#d9efe9\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"184\" y=\"112\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">1 字节</text><text x=\"78\" y=\"150\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">short</text><rect x=\"112\" y=\"132\" width=\"68\" height=\"26\" rx=\"4\" fill=\"#d9efe9\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"218\" y=\"150\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">2 字节</text><text x=\"78\" y=\"188\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">int</text><rect x=\"112\" y=\"170\" width=\"136\" height=\"26\" rx=\"4\" fill=\"#d9efe9\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"286\" y=\"188\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">4 字节</text><text x=\"370\" y=\"112\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">long</text><rect x=\"410\" y=\"94\" width=\"204\" height=\"26\" rx=\"4\" fill=\"#d9efe9\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"502\" y=\"140\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">8 字节</text><text x=\"370\" y=\"176\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">double</text><rect x=\"410\" y=\"158\" width=\"204\" height=\"26\" rx=\"4\" fill=\"#d9efe9\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"502\" y=\"200\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">8 字节</text></svg>",
            "caption": "同样叫 int，在不同平台上可能占不同格数，sizeof 就是拿尺子量一次。"
          },
          {
            "t": "h2",
            "text": "常见坑"
          },
          {
            "t": "ul",
            "items": [
              "认定 int 一定是 4 个字节。C 标准只保证它至少 2 个字节。",
              "用 %d 打印 sizeof 的结果。size_t 是无符号类型，应该用 %zu。",
              "无符号变量相减得到负数。结果会绕回一个很大的正数，判断条件就失效了。",
              "以为 char 只能存字母。它本质是小整数，存 65 也能用 %c 打印成 A。",
              "把整数算到超出范围。有符号溢出是未定义行为，不是简单地变成负数。"
            ]
          },
          {
            "t": "h2",
            "text": "任务"
          },
          {
            "t": "ul",
            "items": [
              "照演示打印六种类型的 sizeof，把结果和你猜的数字对照。",
              "声明一个 double 变量，分别用 sizeof 量类型和量变量，确认两个结果相同。",
              "把 int 换成 unsigned int，写出它能表示的最大值是多少，并说明为什么。"
            ]
          },
          {
            "t": "tip",
            "color": "green",
            "text": "一句话：类型决定占几格、能表示多大范围；宽度由平台决定，拿不准就用 sizeof 量一次。"
          }
        ]
      },
      {
        "id": "c06",
        "title": "第 6 课 · 运算符",
        "blocks": [
          {
            "t": "tip",
            "color": "blue",
            "text": "本课目标：掌握算术、比较、逻辑三类运算符，知道整数除法会截断、等号有两个、优先级不确定就加括号。"
          },
          {
            "t": "h2",
            "text": "原理讲解"
          },
          {
            "t": "p",
            "text": "算术运算符有加、减、乘、除、取余：+ - * / %。两个整数相除，结果还是整数，小数部分直接丢掉，10 / 3 得 3；想得到小数，先把其中一个转成 double。% 只能用于整数，10 % 3 得 1。"
          },
          {
            "t": "p",
            "text": "比较运算符 == != > < >= <= 的结果是 0 或 1，0 表示假，非零表示真。一个等号是赋值，两个等号才是判断相等，这两个符号写混是初学者最常见的错误之一。"
          },
          {
            "t": "p",
            "text": "逻辑运算符 && || ! 用来组合条件，并且带短路行为：&& 左边为假时右边不再计算，|| 左边为真时右边不再计算。优先级从高到低大致是 !、算术、比较、&&、||，记不清就直接加括号。"
          },
          {
            "t": "h2",
            "text": "假设它能干什么"
          },
          {
            "t": "ul",
            "items": [
              "算总价、平均分、余数，把数值结果算出来。",
              "比较两个值的大小，得到一个 0 或 1 的结论。",
              "把多个条件组合成一个判断，例如年龄够而且有票。",
              "用 += 这类复合赋值少写一遍变量名。"
            ]
          },
          {
            "t": "h2",
            "text": "演示：五条表达式的结果"
          },
          {
            "t": "p",
            "text": "这段程序把除法、取余、比较、逻辑、强制转换放在一起，输出可以直接对照。"
          },
          {
            "t": "code",
            "lang": "c",
            "code": "#include <stdio.h>\nint main(void) {\n    int a = 10;\n    int b = 3;\n    printf(\"%d\\n\", a / b);\n    printf(\"%d\\n\", a % b);\n    printf(\"%d\\n\", a > b);\n    printf(\"%d\\n\", a > b && b > 0);\n    printf(\"%f\\n\", (double)a / b);\n    return 0;\n}"
          },
          {
            "t": "p",
            "text": "输出依次是 3、1、1、1、3.333333。a / b 丢掉小数；a % b 是余数；比较表达式打印出 1 表示真；最后一行先把 a 转成 double 再除，才保住小数部分。"
          },
          {
            "t": "svg",
            "code": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">优先级：从上往下算</text><rect x=\"196\" y=\"92\" width=\"248\" height=\"34\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"320\" y=\"115\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">圆括号 ( )</text><rect x=\"196\" y=\"134\" width=\"248\" height=\"34\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"320\" y=\"157\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">乘除取余 * / %</text><rect x=\"196\" y=\"176\" width=\"248\" height=\"34\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"320\" y=\"199\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">加减 + -</text><text x=\"470\" y=\"115\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">先算</text><text x=\"470\" y=\"199\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">后算</text><path d=\"M470 126V130\" stroke=\"#2a8c78\" stroke-width=\"2\"/><path d=\"M470 168V172\" stroke=\"#2a8c78\" stroke-width=\"2\"/></svg>",
            "caption": "同一层从左到右算，跨层按优先级；拿不准就加圆括号。"
          },
          {
            "t": "h2",
            "text": "常见坑"
          },
          {
            "t": "ul",
            "items": [
              "把 5 / 2 当成 2.5。两个整数相除只留整数部分。",
              "条件里写一个等号。x = 1 是赋值，结果永远为真。",
              "对整数除以零。运行时会直接崩溃，编译器不会提前报错。",
              "用 == 比较两个 double。二进制小数有误差，应该比较差值是否足够小。",
              "把逻辑表达式写得很长还不加括号。&& 比 || 先算，混用时极易读错。"
            ]
          },
          {
            "t": "h2",
            "text": "任务"
          },
          {
            "t": "ul",
            "items": [
              "用两个整数变量算加减乘除和取余，把五个结果打印出来。",
              "把其中一个操作数转成 double 再做除法，比较结果和整数除法差多少。",
              "写一个条件：年龄大于等于 18 而且有票，打印结果，再分别改两个变量看变化。"
            ]
          },
          {
            "t": "tip",
            "color": "green",
            "text": "一句话：算术管数值、比较出 0 或 1、逻辑组合条件；整数相除会截断，混算先转换。"
          }
        ]
      },
      {
        "id": "c07",
        "title": "第 7 课 · if 条件",
        "blocks": [
          {
            "t": "tip",
            "color": "blue",
            "text": "本课目标：会写 if 让程序按条件执行，知道 C 里非零为真、大括号不能省、条件后面不加分号。"
          },
          {
            "t": "h2",
            "text": "原理讲解"
          },
          {
            "t": "p",
            "text": "if 的作用是「条件成立才执行这一段」。条件写在圆括号里，C 没有单独的布尔类型，整数 0 算假，任何非零值都算真。比较表达式的结果正好是 0 或 1，所以可以直接放进 if。"
          },
          {
            "t": "p",
            "text": "即使大括号里只有一条语句，也建议把大括号写上。不写时 if 只控制紧跟其后的那一条语句，后面多写一行就会无条件执行，这种错误编译器不会提醒。"
          },
          {
            "t": "p",
            "text": "条件后面不能加分号。写成 if (score >= 60); 等于「条件成立就执行一条空语句」，下面的大括号变成普通代码块，永远都会跑。这个分号很难靠肉眼发现。"
          },
          {
            "t": "h2",
            "text": "假设它能干什么"
          },
          {
            "t": "ul",
            "items": [
              "分数够不够及格线，够就打印一句通过。",
              "用户有没有登录，登录了才显示资料。",
              "库存够不够，够才允许下单。",
              "输入是否合法，合法才继续往下算。"
            ]
          },
          {
            "t": "h2",
            "text": "演示：条件成立才打印"
          },
          {
            "t": "p",
            "text": "这段程序把分数设成 72，先判断是否及格，再打印一行与判断无关的结束语。"
          },
          {
            "t": "code",
            "lang": "c",
            "code": "#include <stdio.h>\nint main(void) {\n    int score = 72;\n    if (score >= 60) {\n        printf(\"及格\\n\");\n    }\n    printf(\"检查结束\\n\");\n    return 0;\n}"
          },
          {
            "t": "p",
            "text": "score 是 72，条件成立，打印「及格」，然后打印「检查结束」。把 72 改成 50，第一行不打印，但「检查结束」照样打印，因为它在 if 的大括号外面。"
          },
          {
            "t": "svg",
            "code": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 260\"><rect x=\"40\" y=\"36\" width=\"560\" height=\"192\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"72\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">if 只决定走不走这一段</text><polygon points=\"320,92 404,132 320,172 236,132\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><text x=\"320\" y=\"137\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">score &gt;= 60 ?</text><path d=\"M408 132H470\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"470,132 460,126 460,138\" fill=\"#2a8c78\"/><text x=\"438\" y=\"120\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">真</text><rect x=\"478\" y=\"106\" width=\"92\" height=\"52\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"524\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">执行</text><text x=\"524\" y=\"148\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">大括号内</text><path d=\"M320 172V204H120\" stroke=\"#7fa99f\" stroke-width=\"2.5\"/><text x=\"240\" y=\"196\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">假：跳过</text><text x=\"88\" y=\"210\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">继续执行</text></svg>",
            "caption": "条件为真进右边那段，为假就绕过它，程序继续往下走。"
          },
          {
            "t": "h2",
            "text": "常见坑"
          },
          {
            "t": "ul",
            "items": [
              "条件里用赋值号。if (x = 1) 会先赋值再判断，结果永远为真。",
              "只写 if 不写大括号，又在后面补了一行。那一行不管条件真假都会跑。",
              "在 if 的圆括号后面加分号。循环体或语句块会变成无条件执行。",
              "以为非零就是 1。C 把任何非零值都当真，包括负数。",
              "把浮点数和 0 直接比较。误差会让本该相等的情况判成不等。"
            ]
          },
          {
            "t": "h2",
            "text": "任务"
          },
          {
            "t": "ul",
            "items": [
              "写一个 if，分数大于等于 60 时打印「及格」，分别用 72 和 50 各跑一次。",
              "把条件改成 if (score = 60)，运行看结果，再抄下编译器的警告。",
              "故意在 if 的圆括号后加分号，观察输出和你预期差在哪。"
            ]
          },
          {
            "t": "tip",
            "color": "green",
            "text": "一句话：if 是「条件真才走这一段」，非零都算真，大括号写上、分号别乱加。"
          }
        ]
      },
      {
        "id": "c08",
        "title": "第 8 课 · else 与分支",
        "blocks": [
          {
            "t": "tip",
            "color": "blue",
            "text": "本课目标：用 else 补上条件不成立时走哪条路，用 else if 排出多档分支，并知道顺序为什么重要。"
          },
          {
            "t": "h2",
            "text": "原理讲解"
          },
          {
            "t": "p",
            "text": "if 只处理条件为真的情况。要处理其余情况，就在 if 的大括号后面接 else。else 不能单独出现，它必须跟着一个 if，中间不能插别的语句。"
          },
          {
            "t": "p",
            "text": "多档判断用 else if 串起来。程序从上往下依次检查，哪一条先为真就执行哪一段，执行完直接跳出整条链，后面的条件不再看。所以顺序要从严格写到宽松。"
          },
          {
            "t": "p",
            "text": "如果先把「大于等于 60」放在「大于等于 90」前面，95 分的人会先命中 60 那条，被判成及格，优秀分支永远轮不到。分支的书写顺序就是判断的优先级。"
          },
          {
            "t": "h2",
            "text": "假设它能干什么"
          },
          {
            "t": "ul",
            "items": [
              "成绩分优秀、及格、不及格三档。",
              "登录状态分已登录和未登录，显示不同页面。",
              "订单按金额落到不同的折扣区间。",
              "把「其余情况怎么办」写完整，不留没处理的分支。"
            ]
          },
          {
            "t": "h2",
            "text": "演示：三档判定"
          },
          {
            "t": "p",
            "text": "把分数设成 85，让它依次经过 90、60 两道门槛，最后落到 else。"
          },
          {
            "t": "code",
            "lang": "c",
            "code": "#include <stdio.h>\nint main(void) {\n    int score = 85;\n    if (score >= 90) {\n        printf(\"优秀\\n\");\n    } else if (score >= 60) {\n        printf(\"及格\\n\");\n    } else {\n        printf(\"不及格\\n\");\n    }\n    return 0;\n}"
          },
          {
            "t": "p",
            "text": "85 和 90 比不成立，再和 60 比成立，打印「及格」，后面的 else 不再执行。把 85 换成 95 会命中第一档，换成 40 会落到 else。"
          },
          {
            "t": "svg",
            "code": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 260\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"180\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">从上往下，命中一条就停</text><rect x=\"56\" y=\"104\" width=\"118\" height=\"50\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"115\" y=\"134\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">&gt;= 90</text><path d=\"M178 129H208\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><polygon points=\"208,129 198,123 198,135\" fill=\"#2a8c78\"/><rect x=\"212\" y=\"104\" width=\"118\" height=\"50\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"271\" y=\"134\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">&gt;= 60</text><path d=\"M334 129H364\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><polygon points=\"364,129 354,123 354,135\" fill=\"#2a8c78\"/><rect x=\"368\" y=\"104\" width=\"112\" height=\"50\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"424\" y=\"134\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">else</text><path d=\"M484 129H514\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><polygon points=\"514,129 504,123 504,135\" fill=\"#2a8c78\"/><rect x=\"518\" y=\"104\" width=\"70\" height=\"50\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"553\" y=\"134\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">结束</text><text x=\"115\" y=\"182\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">优秀</text><text x=\"271\" y=\"182\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">及格</text><text x=\"424\" y=\"182\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">不及格</text><text x=\"553\" y=\"182\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">跳出</text></svg>",
            "caption": "条件依次判断，第一条命中的分支执行完就跳出整条链。"
          },
          {
            "t": "h2",
            "text": "常见坑"
          },
          {
            "t": "ul",
            "items": [
              "在 if 的右大括号后面加分号，再接 else。编译器会报 else 没有对应的 if。",
              "把宽松条件写在前面。后面的严格条件永远轮不到。",
              "以为 else if 会逐条全部判断。命中第一条之后，其余条件都不再计算。",
              "嵌套层数太多，缩进看花眼。超过三层就该把内层单独拆出去，读起来才不费劲。",
              "把 else 当异常处理。它只处理条件不成立，不接收错误值。"
            ]
          },
          {
            "t": "h2",
            "text": "任务"
          },
          {
            "t": "ul",
            "items": [
              "写 if / else，让 50 打印不及格、60 打印及格，两组都跑一遍。",
              "写三档分支，分别用 95、75、40 跑，确认各走哪一条。",
              "把 60 那档挪到 90 前面，用 95 跑一次，说明结果错在哪。"
            ]
          },
          {
            "t": "tip",
            "color": "green",
            "text": "一句话：else 是「其余情况」，多档判断从上往下排队，谁先为真谁执行，顺序要从严到宽。"
          }
        ]
      },
      {
        "id": "c09",
        "title": "第 9 课 · for 循环",
        "blocks": [
          {
            "t": "tip",
            "color": "blue",
            "text": "本课目标：用 for 让一段代码重复执行，掌握三段式的执行顺序，知道从 1 数到几该写什么条件。"
          },
          {
            "t": "h2",
            "text": "原理讲解"
          },
          {
            "t": "p",
            "text": "for 的圆括号里有三段，用分号隔开：初始化、条件、步进。初始化只在进入循环前执行一次；每轮先判断条件，为真就执行循环体，再执行步进，然后回到条件。"
          },
          {
            "t": "p",
            "text": "计数通常从 0 或 1 开始，看你要数什么。想走 n 次，条件写 i < n 或 i <= n，取决于起点；差一位就会少走或多走一次，这类差一错误是循环里最常见的 bug。"
          },
          {
            "t": "p",
            "text": "循环体里不要手动改循环变量。i 由 for 的第三段推进，你在里面再改一次，很可能跳过某些值，或者让条件永远成立，程序就停不下来。"
          },
          {
            "t": "h2",
            "text": "假设它能干什么"
          },
          {
            "t": "ul",
            "items": [
              "把一句话打印五次。",
              "从 1 数到 100，逐个处理。",
              "把一组数累加，算出总和。",
              "找到第一个满足条件的数就停下。"
            ]
          },
          {
            "t": "h2",
            "text": "演示：计数、累加与提前退出"
          },
          {
            "t": "p",
            "text": "第一段从 1 数到 5，每轮加 1；第二段先把和设成 0，再累加 1 到 100，最后用 break 提前收尾。"
          },
          {
            "t": "code",
            "lang": "c",
            "code": "#include <stdio.h>\n\nint main(void)\n{\n    for (int i = 1; i <= 5; i++)\n    {\n        printf(\"%d\\n\", i);\n    }\n    return 0;\n}"
          },
          {
            "t": "p",
            "text": "输出是 1 到 5 各一行。把条件改成 i < 5，最后一行就是 4，循环只走四次。"
          },
          {
            "t": "code",
            "lang": "c",
            "code": "#include <stdio.h>\nint main(void) {\n    int sum = 0;\n    for (int i = 1; i <= 100; i++) {\n        sum += i;\n    }\n    printf(\"%d\\n\", sum);\n    for (int i = 1; i <= 10; i++) {\n        if (i == 4) break;\n        printf(\"%d\\n\", i);\n    }\n    return 0;\n}"
          },
          {
            "t": "p",
            "text": "累加段输出 5050。第二段打印到 3 就停，因为 i 等于 4 时 break 直接结束循环。把 break 换成 continue，4 不打印，但 5 到 10 会继续。"
          },
          {
            "t": "svg",
            "code": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 260\"><rect x=\"40\" y=\"36\" width=\"560\" height=\"188\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"72\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">for 的三段与回路</text><rect x=\"56\" y=\"98\" width=\"112\" height=\"50\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"112\" y=\"128\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">int i = 1</text><path d=\"M172 123H204\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><polygon points=\"204,123 194,117 194,129\" fill=\"#2a8c78\"/><rect x=\"208\" y=\"98\" width=\"122\" height=\"50\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"269\" y=\"128\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">i &lt;= 5 ?</text><path d=\"M334 123H366\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><polygon points=\"366,123 356,117 356,129\" fill=\"#2a8c78\"/><rect x=\"370\" y=\"98\" width=\"104\" height=\"50\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"422\" y=\"128\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">循环体</text><path d=\"M478 123H510\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><polygon points=\"510,123 500,117 500,129\" fill=\"#2a8c78\"/><rect x=\"514\" y=\"98\" width=\"74\" height=\"50\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"551\" y=\"128\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">i++</text><path d=\"M551 148V192H269V152\" stroke=\"#7fa99f\" stroke-width=\"2.5\"/><polygon points=\"269,152 263,162 275,162\" fill=\"#7fa99f\"/><text x=\"410\" y=\"184\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">回到条件</text><text x=\"112\" y=\"184\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">只执行一次</text></svg>",
            "caption": "初始化只走一次；条件每轮判一次；循环体和步进每轮各走一次。"
          },
          {
            "t": "h2",
            "text": "常见坑"
          },
          {
            "t": "ul",
            "items": [
              "条件写错一位。从 1 数到 5 要写 i <= 5，写 i < 5 只会到 4。",
              "忘了 i++。条件永远成立，程序卡在死循环里。",
              "在循环体里改 i。循环的推进交给第三段，手动改容易跳过值。",
              "把累加变量声明在循环里。每轮都会重置成 0，最后的结果永远不对。",
              "break 和 continue 搞混。break 结束整个循环，continue 只跳过本轮。"
            ]
          },
          {
            "t": "h2",
            "text": "任务"
          },
          {
            "t": "ul",
            "items": [
              "用 for 打印 1 到 10，再改成只打印偶数。",
              "用循环算 1 到 100 的和，打印结果，确认是 5050。",
              "写一个从 1 数到 10 的循环，遇到 4 就 break；再把 break 换成 continue，对比两次输出。"
            ]
          },
          {
            "t": "tip",
            "color": "green",
            "text": "一句话：for 的三段管初始化、条件、推进；条件差一位就多走或少走，推进那一步不能忘。"
          }
        ]
      },
      {
        "id": "c10",
        "title": "第 10 课 · while 循环",
        "blocks": [
          {
            "t": "tip",
            "color": "blue",
            "text": "本课目标：用 while 写「条件成立就一直重复」的循环，知道它和 for 各自适合什么场合，避开死循环。"
          },
          {
            "t": "h2",
            "text": "原理讲解"
          },
          {
            "t": "p",
            "text": "while 的圆括号里只放条件，没有初始化也没有步进。每轮开始先判断条件，为真就执行循环体，为假就退出；如果第一次判断就是假，循环体一次都不执行。"
          },
          {
            "t": "p",
            "text": "条件里的变量必须在循环外初始化，而且循环体里要有让它变假的动作。忘了这一步，条件永远成立，程序进入死循环，只能按 Ctrl+C 结束。"
          },
          {
            "t": "p",
            "text": "次数确定的循环用 for 更紧凑；次数不确定、要靠条件决定什么时候停的循环用 while 更自然。两者能互相改写，挑读起来更清楚的那个。"
          },
          {
            "t": "h2",
            "text": "假设它能干什么"
          },
          {
            "t": "ul",
            "items": [
              "从某个数倒数到 0，再执行收尾动作。",
              "把整数的每一位拆开，逐位处理。",
              "一直读输入，直到读到结束标记。",
              "反复尝试某个操作，直到条件满足。"
            ]
          },
          {
            "t": "h2",
            "text": "演示：倒数与拆数字"
          },
          {
            "t": "p",
            "text": "第一段让 n 从 3 开始，每轮打印后减 1；第二段用取余和整除，把 1234 的各位数字加起来。"
          },
          {
            "t": "code",
            "lang": "c",
            "code": "#include <stdio.h>\nint main(void) {\n    int n = 3;\n    while (n > 0) {\n        printf(\"%d\\n\", n);\n        n--;\n    }\n    printf(\"起飞\\n\");\n    return 0;\n}"
          },
          {
            "t": "p",
            "text": "输出 3、2、1 三行，然后是「起飞」。n-- 写在循环体里，这一步就是让条件最终变假的关键。"
          },
          {
            "t": "code",
            "lang": "c",
            "code": "#include <stdio.h>\nint main(void) {\n    int x = 1234;\n    int sum = 0;\n    while (x > 0) {\n        sum += x % 10;\n        x /= 10;\n    }\n    printf(\"%d\\n\", sum);\n    return 0;\n}"
          },
          {
            "t": "p",
            "text": "每轮用 % 10 取最后一位加到 sum，用 / 10 把它去掉，x 最终变成 0，循环结束。1234 的结果是 10。注意 x /= 10 必须在循环体里，否则 x 永远是 1234。"
          },
          {
            "t": "svg",
            "code": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 280\"><rect x=\"40\" y=\"32\" width=\"560\" height=\"212\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"68\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">while 每轮先看条件</text><rect x=\"64\" y=\"88\" width=\"112\" height=\"46\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"120\" y=\"116\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">n = 3</text><text x=\"120\" y=\"156\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">循环前初始化</text><path d=\"M180 111H216\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><polygon points=\"216,111 206,105 206,117\" fill=\"#2a8c78\"/><rect x=\"220\" y=\"88\" width=\"128\" height=\"46\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"284\" y=\"116\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">n &gt; 0 ?</text><path d=\"M352 111H388\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><polygon points=\"388,111 378,105 378,117\" fill=\"#2a8c78\"/><rect x=\"392\" y=\"88\" width=\"176\" height=\"88\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"480\" y=\"114\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">循环体</text><text x=\"480\" y=\"136\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">打印 n</text><text x=\"480\" y=\"158\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">n-- 让条件变假</text><path d=\"M480 176V212H284V138\" stroke=\"#7fa99f\" stroke-width=\"2.5\"/><polygon points=\"284,138 278,148 290,148\" fill=\"#7fa99f\"/><text x=\"402\" y=\"204\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">回到条件</text><text x=\"284\" y=\"232\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">条件为假就退出，执行循环后面的语句</text></svg>",
            "caption": "条件在顶部；循环体里必须有人把条件推向假，否则永远出不去。"
          },
          {
            "t": "h2",
            "text": "常见坑"
          },
          {
            "t": "ul",
            "items": [
              "忘了在循环体里改条件变量。条件一直为真，程序卡死。",
              "在 while 的圆括号后面加分号。循环体变成空语句，循环空转。",
              "在循环体里重新声明计数变量。每轮都重置，条件永远不会变假。",
              "把 while 当 for 用，却在里面漏了初始化。变量带着不确定的值进入判断。",
              "写 while (1) 却没有 break 出口。这是标准的死循环写法，要有意为之。"
            ]
          },
          {
            "t": "h2",
            "text": "任务"
          },
          {
            "t": "ul",
            "items": [
              "用 while 从 3 倒数到 1，打印完再打印一行结束语。",
              "用 while 求 1 到 10 的和，打印结果，和 for 版本对照。",
              "用 while 拆一个四位数，把各位数字打印出来，再说出循环为什么能停。"
            ]
          },
          {
            "t": "tip",
            "color": "green",
            "text": "一句话：while 每轮先看条件，条件为假就退出；循环体里必须有人把条件推向假。"
          }
        ]
      },
      {
        "id": "c11",
        "title": "第 11 课 · 函数",
        "blocks": [
          {
            "t": "tip",
            "color": "blue",
            "text": "本课目标：会把一段逻辑写成函数，知道参数怎么传、返回值怎么接，以及函数为什么要先声明。"
          },
          {
            "t": "h2",
            "text": "原理讲解"
          },
          {
            "t": "p",
            "text": "函数是有名字的一段代码。定义时写返回类型、函数名、参数列表和函数体；调用时写函数名加实参，执行完把 return 后面的值交回调用处。返回类型写 void 表示不返回任何值。"
          },
          {
            "t": "p",
            "text": "C 要求先声明后使用。把函数定义写在 main 前面是最省事的做法；如果写在后面，就要在 main 前面补一行函数原型，把返回类型、名字和参数类型再写一遍。"
          },
          {
            "t": "p",
            "text": "C 的参数是值传递：调用时把实参的值复制一份给形参，函数里改形参不会影响外面的变量。想让函数改动外面的值，需要传地址，这属于更后面的内容。"
          },
          {
            "t": "h2",
            "text": "假设它能干什么"
          },
          {
            "t": "ul",
            "items": [
              "把算平方、算平均值这类计算抽出来重复使用。",
              "给一段复杂逻辑起个能读懂的名字。",
              "把很长的 main 拆小，每段只做一件事。",
              "同一段代码要在多个地方出现时，只维护一份。"
            ]
          },
          {
            "t": "h2",
            "text": "演示：两个小函数"
          },
          {
            "t": "p",
            "text": "square 接收一个整数返回它的平方，add 接收两个整数返回和，两个都写在 main 前面。"
          },
          {
            "t": "code",
            "lang": "c",
            "code": "#include <stdio.h>\nint square(int x) {\n    return x * x;\n}\nint add(int a, int b) {\n    return a + b;\n}\nint main(void) {\n    printf(\"%d\\n\", square(5));\n    printf(\"%d\\n\", add(2, 3));\n    return 0;\n}"
          },
          {
            "t": "p",
            "text": "main 里调用 square(5) 得到 25，调用 add(2, 3) 得到 5，返回值直接交给 printf。形参 x、a、b 只在各自函数体内可见，和 main 里的变量互不干扰。"
          },
          {
            "t": "svg",
            "code": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 260\"><rect x=\"40\" y=\"36\" width=\"560\" height=\"188\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"72\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">调用：实参进去，返回值出来</text><rect x=\"60\" y=\"100\" width=\"140\" height=\"76\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"130\" y=\"126\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">main</text><text x=\"130\" y=\"150\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">square(5)</text><text x=\"130\" y=\"168\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">实参 5</text><path d=\"M204 122H280\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"280,122 270,116 270,128\" fill=\"#2a8c78\"/><text x=\"242\" y=\"112\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">传值</text><rect x=\"288\" y=\"100\" width=\"164\" height=\"76\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"370\" y=\"126\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">square</text><text x=\"370\" y=\"150\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">形参 x 复制到 5</text><text x=\"370\" y=\"168\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">return x * x</text><path d=\"M456 160H520\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"520,160 510,154 510,166\" fill=\"#2a8c78\"/><rect x=\"528\" y=\"134\" width=\"64\" height=\"52\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"560\" y=\"158\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">25</text><text x=\"560\" y=\"176\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">返回值</text><text x=\"370\" y=\"204\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">形参是副本，改它不影响 main</text></svg>",
            "caption": "实参复制成形参，函数体算完把结果交回调用处，原件不动。"
          },
          {
            "t": "h2",
            "text": "常见坑"
          },
          {
            "t": "ul",
            "items": [
              "有返回类型却漏了 return。函数的返回值变成不确定的内容。",
              "return 的类型和声明的返回类型不一致。小数会被悄悄截断成整数。",
              "函数写在 main 后面又没写原型。编译器会按旧规则猜参数类型。",
              "以为函数里改了形参，外面的变量也会变。C 的参数是复制。",
              "把 printf 当成返回值。打印只是输出，不会把值交给调用处。"
            ]
          },
          {
            "t": "h2",
            "text": "任务"
          },
          {
            "t": "ul",
            "items": [
              "写 int square(int x) 并在 main 里调用，打印 5 的平方。",
              "写 int max(int a, int b) 返回较大的那个数，用两组数各调一次。",
              "把 square 挪到 main 后面，先不写原型编译一次，再补上原型编译一次。"
            ]
          },
          {
            "t": "tip",
            "color": "green",
            "text": "一句话：函数把一段逻辑起名、收参数、返结果；参数是复制进来的，改了不影响调用方。"
          }
        ]
      },
      {
        "id": "c12",
        "title": "第 12 课 · 数组与字符串",
        "blocks": [
          {
            "t": "tip",
            "color": "blue",
            "text": "本课目标：会声明数组、用下标读写元素、用循环遍历，并知道 C 的字符串就是末尾带结束符的字符数组。"
          },
          {
            "t": "h2",
            "text": "原理讲解"
          },
          {
            "t": "p",
            "text": "数组是一串同类型的元素，声明写 int scores[3]，方括号里是元素个数。下标从 0 开始，三个元素的下标是 0、1、2；C 不会检查越界，写下标 3 会读写到数组外面的内存。"
          },
          {
            "t": "p",
            "text": "数组可以在声明时初始化，写成 int a[3] = {1, 2, 3}，也可以省略长度让编译器自己数。求元素个数用 sizeof(a) / sizeof(a[0])，前者是整个数组的字节数，后者是单个元素的字节数。"
          },
          {
            "t": "p",
            "text": "C 没有独立的字符串类型，字符串就是末尾多一个结束符的 char 数组。双引号写出的字面量会自动补上这个结束符，printf 的 %s 一直打印到它为止；strlen 数的是结束符之前的字符数。"
          },
          {
            "t": "h2",
            "text": "假设它能干什么"
          },
          {
            "t": "ul",
            "items": [
              "存一组分数、一批编号，按位置读写。",
              "用循环遍历整组数据，求和或找最大值。",
              "存名字、标题这类短文本并打印出来。",
              "量出字符串占多少字节，做长度检查。"
            ]
          },
          {
            "t": "h2",
            "text": "演示：数组与字符串"
          },
          {
            "t": "p",
            "text": "先用循环打印三个分数，再打印一个字符串占用的字节数和它的字符长度，两者会差一。"
          },
          {
            "t": "code",
            "lang": "c",
            "code": "#include <stdio.h>\n#include <string.h>\nint main(void) {\n    int scores[3] = {90, 85, 77};\n    for (int i = 0; i < 3; i++) {\n        printf(\"%d\\n\", scores[i]);\n    }\n    char name[] = \"miao\";\n    printf(\"%s\\n\", name);\n    printf(\"sizeof %zu\\n\", sizeof(name));\n    printf(\"strlen %zu\\n\", strlen(name));\n    return 0;\n}"
          },
          {
            "t": "p",
            "text": "sizeof(name) 是 5，因为末尾的结束符也占一个字节；strlen(name) 是 4，只数可见字符。把 name 改成中文，sizeof 会更大，因为一个汉字通常占三个字节。"
          },
          {
            "t": "svg",
            "code": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 280\"><rect x=\"40\" y=\"32\" width=\"560\" height=\"216\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"68\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">数组按下标排，字符串多一个结束符</text><text x=\"86\" y=\"100\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">scores</text><rect x=\"120\" y=\"82\" width=\"80\" height=\"34\" rx=\"4\" fill=\"#d9efe9\" stroke=\"#2a8c78\" stroke-width=\"2\"/><rect x=\"200\" y=\"82\" width=\"80\" height=\"34\" rx=\"4\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><rect x=\"280\" y=\"82\" width=\"80\" height=\"34\" rx=\"4\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"160\" y=\"105\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">90</text><text x=\"240\" y=\"105\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">85</text><text x=\"320\" y=\"105\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">77</text><text x=\"160\" y=\"136\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">下标 0</text><text x=\"240\" y=\"136\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">下标 1</text><text x=\"320\" y=\"136\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">下标 2</text><text x=\"86\" y=\"186\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">name</text><rect x=\"120\" y=\"168\" width=\"64\" height=\"34\" rx=\"4\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><rect x=\"184\" y=\"168\" width=\"64\" height=\"34\" rx=\"4\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><rect x=\"248\" y=\"168\" width=\"64\" height=\"34\" rx=\"4\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><rect x=\"312\" y=\"168\" width=\"64\" height=\"34\" rx=\"4\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><rect x=\"376\" y=\"168\" width=\"64\" height=\"34\" rx=\"4\" fill=\"#f3d8b0\" stroke=\"#b5761f\" stroke-width=\"2\"/><text x=\"152\" y=\"191\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">m</text><text x=\"216\" y=\"191\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">i</text><text x=\"280\" y=\"191\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">a</text><text x=\"344\" y=\"191\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">o</text><text x=\"408\" y=\"191\" font-size=\"15\" text-anchor=\"middle\" fill=\"#b5761f\">结束符</text><text x=\"488\" y=\"136\" font-size=\"14\" fill=\"#4d6f67\">sizeof 数到结束符</text><text x=\"488\" y=\"191\" font-size=\"14\" fill=\"#4d6f67\">strlen 数到 o</text><text x=\"320\" y=\"232\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">越界访问下标 3 会读到数组外面的内存</text></svg>",
            "caption": "下标从 0 起；字符串多出的那一格是结束符，strlen 不数它。"
          },
          {
            "t": "h2",
            "text": "常见坑"
          },
          {
            "t": "ul",
            "items": [
              "下标从 1 开始数。三元素数组的合法下标只有 0、1、2。",
              "越界写入。C 不检查范围，可能改坏别的变量甚至直接崩溃。",
              "用 = 给整个数组赋值。数组不能整体赋值，要逐个元素写。",
              "把 sizeof 当成字符串长度。sizeof 把结束符也算进去。",
              "手写字符数组时忘了补结束符。printf 会一直往后读到遇见 0 为止。"
            ]
          },
          {
            "t": "h2",
            "text": "任务"
          },
          {
            "t": "ul",
            "items": [
              "声明一个三元素 int 数组并初始化，用循环把它倒着打印出来。",
              "写一个 char 数组存你的英文名，分别打印 sizeof 和 strlen 的结果，解释差在哪。",
              "故意访问下标 3，观察程序输出或崩溃情况，然后改回合法下标。"
            ]
          },
          {
            "t": "tip",
            "color": "green",
            "text": "一句话：数组按下标存同类型元素，下标从 0 起且不查越界；字符串是末尾带结束符的字符数组。"
          }
        ]
      }
    ]
  }
};
