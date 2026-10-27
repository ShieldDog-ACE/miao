/* 喵站 · IDE 入门（VS Code）（2026-10-27 补全分类教程；12 课单文件）
 * 课式：是什么 → 装工具 → 第一个可验证动作 → 一课一个概念。
 * 快捷键按 VS Code 默认键位写；不同系统把 Ctrl 换成 Cmd 即可。 */
window.MIAO_IDE = {
  tutorial: {
    id: "ide",
    title: "IDE 入门（VS Code）",
    intro: "从编辑器的历史讲到调试与远程开发：12 课把 VS Code 的常用功能走完，每课都有能照着按的快捷键和一张界面图。",
    cat: "IDE",
    diff: "入门",
    tags: ["VS Code", "编辑器", "IDE", "入门"],
    author: "喵站官方",
    cover: "/assets/img/covers/ide.svg",
    updated: "2026-10-27",
    chapters: [
      {
        id: "ide01",
        title: "第 1 课 · 编辑器与 IDE 的历史",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：分清编辑器和 IDE，知道 VS Code 站在哪条历史线上，以及它为什么流行。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "最早的编辑器是行编辑器，一次只能改一行。1976 年的 vi 和 1976 年前后的 Emacs 把编辑搬进全屏，加入了模式、快捷键和脚本扩展。它们到今天还在用，原因是同一条：手不用离开键盘。" },
          { t: "p", text: "IDE 是集成开发环境，把编辑器、编译器、调试器、项目内容放进一个窗口。Visual Studio、Eclipse、IntelliJ IDEA 都属于这一类。它们功能全，但启动慢、占内存，适合大型项目；写一个小脚本时，很多人更愿意用轻量编辑器。" },
          { t: "p", text: "2015 年微软发布 VS Code。它用 Electron 做界面，启动比传统 IDE 快；核心是开源的，扩展生态开放；最重要的是它推动了 LSP（语言服务器协议）：语言支持不再写死在编辑器里，而是由各语言的服务器提供补全、跳转、诊断。于是同一款编辑器能同时写好几种语言。" },
          { t: "p", text: "今天 VS Code 既不是最轻的编辑器，也不是功能最全的 IDE。它的位置在中间：装一个语言扩展就能写，装一套调试配置就能调，装 Remote 扩展就能连服务器。这个「按需加装」的设计是它流行的核心。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "写代码时自动补全、跳转定义、看类型提示。",
            "在编辑器里直接打开终端、跑构建、看测试结果。",
            "打断点、单步执行、看变量和调用栈。",
            "用扩展把 Git、Docker、数据库、远程服务器接进来。"
          ]},
          { t: "h2", text: "演示：认清三个层次" },
          { t: "p", text: "下面这三行不是代码，是一条历史线。看的时候注意：每一层解决的是上一层的哪个麻烦。" },
          { t: "code", lang: "text", code: "编辑器：只管改文本，快，但不懂代码\nIDE：懂代码、会编译、能调试，但重\nVS Code：编辑器内核 + 扩展 + LSP，按需加装" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef2fb\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#17233d\">编辑器与 IDE 的一条线</text><rect x=\"58\" y=\"104\" width=\"120\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"118\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#17233d\">vi / Emacs</text><text x=\"118\" y=\"151\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">全屏 + 快捷键</text><rect x=\"196\" y=\"104\" width=\"120\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"256\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#17233d\">传统 IDE</text><text x=\"256\" y=\"151\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">编译 + 调试</text><rect x=\"334\" y=\"104\" width=\"120\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"394\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#17233d\">VS Code</text><text x=\"394\" y=\"151\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">扩展 + LSP</text><rect x=\"472\" y=\"104\" width=\"110\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"527\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#17233d\">远程开发</text><text x=\"527\" y=\"151\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">连服务器</text><path d=\"M178 136H192\" stroke=\"#4f46e5\" stroke-width=\"2.5\"/><path d=\"M316 136H330\" stroke=\"#4f46e5\" stroke-width=\"2.5\"/><path d=\"M454 136H468\" stroke=\"#4f46e5\" stroke-width=\"2.5\"/></svg>", caption: "VS Code 站在编辑器与 IDE 中间：内核轻，能力靠扩展补。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把 VS Code 当成 Visual Studio。两者名字像，但是不同产品，快捷键和配置都不通用。",
            "以为装得越多越好。扩展装太多会拖慢启动，按语言和项目需要装。",
            "把 VS Code 当成编译器。它只是编辑器，代码要靠本机的编译器或解释器跑。",
            "以为 VS Code 只写前端。装对应扩展后，C、C++、Go、Python、Java 都能写。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用一句话分别解释编辑器和 IDE，指出 VS Code 更靠近哪一边。",
            "列出你目前写代码时最常用的三个动作，判断哪些属于编辑、哪些属于运行或调试。",
            "说出 LSP 解决了什么问题：为什么同一款编辑器能同时支持多种语言。"
          ]},
          { t: "tip", color: "green", text: "一句话：编辑器管文本，IDE 管整套工具链，VS Code 用扩展和 LSP 把两者折中。" }
        ]
      },
      {
        id: "ide02",
        title: "第 2 课 · 装 VS Code",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：装好 VS Code，用 code --version 验证，并用 code . 在终端打开一个目录。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "VS Code 的安装包分两类：系统安装包和用户安装包。系统安装包装到公共目录，所有用户都能用；用户安装包装在个人目录，不需要系统权限。Linux 的 snap 包属于前一类，Windows 的 User Installer 属于后一类。" },
          { t: "p", text: "装完之后，命令行里会多一个 code 命令。它有两个常用用法：code 文件名 打开一个文件，code . 把当前目录作为项目打开。把当前目录作为项目打开很重要，因为 VS Code 的搜索、Git、调试都围绕「工作区」工作。" },
          { t: "p", text: "第一次打开会看到欢迎页。可以关掉，也可以从欢迎页点「打开文件夹」。不要直接拖一个单独的文件进来就以为打开了项目；项目是一个目录，目录里通常有 .git、源码、配置文件。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "装好之后，后面每节课的界面、扩展、调试、Git 都在这一个程序里完成。命令行和图形界面两条路都能打开同一个项目。" },
          { t: "h2", text: "演示 1 · Ubuntu / Debian 安装" },
          { t: "code", lang: "bash", code: "sudo snap install code --classic\ncode --version\n\n# 也可以从官网下载 .deb 包后安装：\n# sudo apt install ./code_*.deb\ncode ." },
          { t: "p", text: "第一条装 snap 版，第二条看版本，最后一条把当前目录作为项目打开。Windows 和 macOS 从官网下载安装包，安装时勾选「添加到 PATH」，之后同样能在终端用 code 命令。" },
          { t: "h2", text: "演示 2 · 打开一个项目目录" },
          { t: "code", lang: "bash", code: "mkdir demo-vscode\ncd demo-vscode\necho \"hello\" > README.md\ncode ." },
          { t: "p", text: "VS Code 打开后，左侧文件树会显示 demo-vscode 目录，README.md 在列表里。点一下就能编辑。以后再打开同一目录，用「文件 → 打开最近的文件」更快。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef2fb\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#17233d\">安装后的三个验证</text><rect x=\"62\" y=\"104\" width=\"150\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"137\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#17233d\">code --version</text><text x=\"137\" y=\"151\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">命令存在</text><path d=\"M216 136H264\" stroke=\"#4f46e5\" stroke-width=\"3\"/><polygon points=\"264,136 254,130 254,142\" fill=\"#4f46e5\"/><rect x=\"272\" y=\"104\" width=\"150\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"347\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#17233d\">code .</text><text x=\"347\" y=\"151\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">打开目录</text><path d=\"M426 136H474\" stroke=\"#4f46e5\" stroke-width=\"3\"/><polygon points=\"474,136 464,130 464,142\" fill=\"#4f46e5\"/><rect x=\"482\" y=\"104\" width=\"100\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"532\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#17233d\">文件树</text><text x=\"532\" y=\"151\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">看到目录</text></svg>", caption: "装完不是看桌面图标，而是终端里 code 命令能用、code . 能打开目录。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "装完终端里 code 命令找不到。Windows 安装时没勾选添加到 PATH，或 Linux 没重开终端。",
            "用 code 打开单个文件，结果搜索只搜这一个文件。项目要打开目录。",
            "在 root 身份下打开项目，之后生成的文件普通用户改不动。用日常账号。",
            "同时装 snap 版和 .deb 版，终端里跑的不是你以为的那个。用 which code 看路径。",
            "把 VS Code 当编译器，装完就想直接跑 C 或 Java。语言工具链要另外装。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "装好 VS Code，把 code --version 的输出抄下来。",
            "建一个空目录，用 code . 打开，确认左侧文件树显示的是这个目录。",
            "在终端里用 code README.md 打开单个文件，再对比 code . 打开目录，说明两者差别。"
          ]},
          { t: "tip", color: "green", text: "一句话：装完的判据是 code --version 能用、code . 能打开目录；项目按目录打开，不按单个文件打开。" }
        ]
      },
      {
        id: "ide03",
        title: "第 3 课 · 界面：打开文件夹、编辑区、终端",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：认清 VS Code 的五个区域，知道每个区域负责什么，不再在一堆按钮里乱点。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "VS Code 的窗口分成五块：最左边是活动栏，从上到下依次是文件树、搜索、源代码面板、运行和调试、扩展；活动栏右边是侧边栏，显示当前选中的那一项；中间是编辑区，可以并排多个标签；底部是面板，默认放终端、输出、问题；最底下是状态栏，显示分支、编码、语言、错误数。" },
          { t: "p", text: "这些区域都能隐藏和拖动。Ctrl+B 开关侧边栏，Ctrl+反引号 开关终端，Ctrl+J 开关面板。记不住快捷键也没关系，命令面板里搜「Toggle」就能找到对应命令。" },
          { t: "p", text: "编辑区支持分屏：把标签拖到右边，或者按 Ctrl+反斜杠 把当前编辑器切成两栏。左边看源码，右边看测试或文档，是很常用的布局。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "左边看目录，中间改代码，底部跑命令，不用切换窗口。",
            "把两个文件并排，对照着改。",
            "从状态栏一眼看到当前分支和有没有报错。",
            "用命令面板找任何功能，不用背菜单位置。"
          ]},
          { t: "h2", text: "演示：用命令面板找三个区域" },
          { t: "p", text: "按 Ctrl+Shift+P 打开命令面板，输入下面的词，看它给出的命令。命令面板是所有功能的入口，菜单里找不到的东西这里通常有。" },
          { t: "code", lang: "text", code: "Toggle Sidebar      开关侧边栏\nToggle Terminal     开关终端\nToggle Panel        开关底部面板\nView: Split Editor  把编辑区切成两栏" },
          { t: "p", text: "命令面板的输入框支持模糊匹配，输入 toggle term 也能命中 Toggle Terminal。选中后回车执行，右边会显示对应的快捷键。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 300\"><rect x=\"20\" y=\"20\" width=\"600\" height=\"260\" rx=\"10\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><rect x=\"20\" y=\"20\" width=\"52\" height=\"230\" fill=\"#eef2fb\"/><text x=\"46\" y=\"52\" font-size=\"11\" text-anchor=\"middle\" fill=\"#17233d\">活动栏</text><rect x=\"72\" y=\"20\" width=\"128\" height=\"230\" fill=\"#f7f8fc\"/><text x=\"136\" y=\"52\" font-size=\"11\" text-anchor=\"middle\" fill=\"#17233d\">侧边栏</text><rect x=\"200\" y=\"20\" width=\"420\" height=\"150\" fill=\"#ffffff\"/><text x=\"410\" y=\"100\" font-size=\"13\" text-anchor=\"middle\" fill=\"#17233d\">编辑区</text><rect x=\"200\" y=\"170\" width=\"420\" height=\"80\" fill=\"#f7f8fc\"/><text x=\"410\" y=\"215\" font-size=\"13\" text-anchor=\"middle\" fill=\"#17233d\">面板：终端 / 输出 / 问题</text><rect x=\"20\" y=\"250\" width=\"600\" height=\"30\" fill=\"#eef2fb\"/><text x=\"320\" y=\"270\" font-size=\"12\" text-anchor=\"middle\" fill=\"#17233d\">状态栏：分支 · 编码 · 语言 · 错误数</text></svg>", caption: "五块区域：活动栏、侧边栏、编辑区、面板、状态栏；每块都能用命令面板开关。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "以为关掉侧边栏就是关掉项目。侧边栏只是视图，项目还开着。",
            "把终端面板拖到右边后找不到。命令面板搜 Toggle Terminal 能叫回来。",
            "编辑区标签太多，找不到当前文件。Ctrl+W 关掉不用的，或右键关闭其他。",
            "状态栏的分支名看成文件夹名。它是 Git 分支，点一下能切分支。",
            "在错误的窗口里改文件。多开几个 VS Code 窗口时，先看标题栏的目录名。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "打开一个项目，依次用 Ctrl+B、Ctrl+反引号、Ctrl+J 开关三个区域，记住各自的位置。",
            "用命令面板执行 View: Split Editor，把编辑区切成两栏，再拖一个文件到右栏。",
            "从状态栏读出当前分支名和语言模式，写在纸上。"
          ]},
          { t: "tip", color: "green", text: "一句话：VS Code 是五块区域的组合，命令面板是总入口；记不住菜单位置就按 Ctrl+Shift+P。" }
        ]
      },
      {
        id: "ide04",
        title: "第 4 课 · 编辑与快捷键",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：掌握十个最常用的编辑快捷键，让手不用离开键盘。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "快捷键不是炫技，它把「移动鼠标、找菜单、点一下」这三步压成一个组合键。用得最多的不是复杂的重构，而是移动光标、选中、复制行、注释、格式化这些每天重复几百次的小动作。" },
          { t: "p", text: "VS Code 的快捷键有两条规律：Ctrl 管文档和文件，Alt 管行和选择，Shift 管扩展选择。比如 Ctrl+C 复制，Ctrl+Shift+K 删行，Alt+上/下 移动行，Shift+Alt+上/下 复制行。记住规律比死记每个组合更容易。" },
          { t: "p", text: "多光标是 VS Code 的招牌功能。按住 Alt 点几个位置，可以同时改多处；选中一个词按 Ctrl+D，会依次选中下一个相同的词；Ctrl+Shift+L 把当前文件里所有相同的词都选中。批量改名、改参数时非常快。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "一次改十几处相同的变量名，不用逐个找。",
            "整行上下移动，不用剪切粘贴。",
            "快速跳到某个文件或某一行。",
            "保存时自动格式化，不用手动对齐。"
          ]},
          { t: "h2", text: "演示 1 · 十个常用键" },
          { t: "code", lang: "text", code: "Ctrl+P            按文件名跳转\nCtrl+Shift+P      命令面板\nCtrl+D            选中下一个相同的词\nCtrl+Shift+K      删除整行\nAlt+上/下          整行上下移动\nShift+Alt+上/下    复制整行\nCtrl+/            注释或取消注释\nShift+Alt+F       格式化文档\nCtrl+S            保存\nCtrl+Shift+F      全项目搜索" },
          { t: "p", text: "先在练习文件里每个键按一遍，看光标和文本怎么变。不用一次记全，先挑三个最常用的练到不用想。" },
          { t: "h2", text: "演示 2 · 多光标改一批值" },
          { t: "p", text: "把下面三行里的 10 改成 20：选中第一个 10，按 Ctrl+D 选中下一个，再按一次选中第三个，然后直接输入 20。三个位置会同时变。" },
          { t: "code", lang: "text", code: "let a = 10;\nlet b = 10;\nlet c = 10;" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef2fb\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#17233d\">Ctrl+D：选中下一个相同的词</text><rect x=\"62\" y=\"102\" width=\"150\" height=\"40\" rx=\"8\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"137\" y=\"128\" font-size=\"14\" text-anchor=\"middle\" fill=\"#17233d\">let a = 10;</text><rect x=\"226\" y=\"102\" width=\"150\" height=\"40\" rx=\"8\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"301\" y=\"128\" font-size=\"14\" text-anchor=\"middle\" fill=\"#17233d\">let b = 10;</text><rect x=\"390\" y=\"102\" width=\"150\" height=\"40\" rx=\"8\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"465\" y=\"128\" font-size=\"14\" text-anchor=\"middle\" fill=\"#17233d\">let c = 10;</text><rect x=\"112\" y=\"110\" width=\"50\" height=\"24\" rx=\"4\" fill=\"#c7d2fe\"/><rect x=\"276\" y=\"110\" width=\"50\" height=\"24\" rx=\"4\" fill=\"#c7d2fe\"/><rect x=\"440\" y=\"110\" width=\"50\" height=\"24\" rx=\"4\" fill=\"#c7d2fe\"/><text x=\"320\" y=\"184\" font-size=\"13\" text-anchor=\"middle\" fill=\"#5a6880\">三个位置同时出现光标，输入一次就改三处</text></svg>", caption: "Ctrl+D 每按一次多选一个相同词，适合批量改参数或变量名。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把 Ctrl+D 当成删除行。VS Code 默认是选中下一个相同词，删除行是 Ctrl+Shift+K。",
            "在中文输入法状态下按快捷键，部分组合被输入法吃掉。切到英文再按。",
            "改了快捷键却忘了改了什么。命令面板里搜命令，右侧会显示当前绑定。",
            "用 Alt+上/下 移动代码时没看缩进，移动后层级乱了。移动完再格式化一次。",
            "多光标选多了，输入后到处都变。按 Esc 退出多光标，再撤销。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "把十个常用键各按一遍，挑三个记到便签上。",
            "用 Ctrl+D 把一段代码里三个相同的变量名一次改掉。",
            "用 Alt+上/下 移动一行代码，再用 Shift+Alt+上/下 复制一行，观察区别。"
          ]},
          { t: "tip", color: "green", text: "一句话：快捷键按 Ctrl 文档、Alt 行、Shift 扩展来记；Ctrl+D 多选相同词是批量修改的入口。" }
        ]
      },
      {
        id: "ide05",
        title: "第 5 课 · 搜索与替换",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：会用全项目搜索、替换、正则和包含/排除规则，找东西不再靠翻目录。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "VS Code 有两种搜索：Ctrl+F 在当前文件里找，Ctrl+Shift+F 在整个项目里找。全项目搜索默认跳过 .gitignore 里列出的目录，比如 node_modules、dist；这是它比 grep 省事的地方。" },
          { t: "p", text: "搜索框下面有「包含」和「排除」两个输入框，可以写 glob，比如 src/**/*.ts 或 *.min.js。正则按钮是 .* 图标，打开后可以用括号、字符组、锚点。替换框用 Ctrl+H 打开，替换全部之前先看清命中数量。" },
          { t: "p", text: "搜索结果按文件分组，点一条就跳到对应行。替换全部会改动所有命中文件，改完记得看源代码面板面板的 diff，确认没有误改。搜索和替换都是文本操作，不理解语法，变量名和字符串里相同的内容会一起被改。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "找出某个函数在哪些文件里被调用。",
            "把旧变量名批量改成新名字，再逐个看 diff。",
            "只在一个目录里搜，排除构建产物。",
            "用正则找形如 TODO: 的注释。"
          ]},
          { t: "h2", text: "演示 1 · 全项目搜索" },
          { t: "p", text: "按 Ctrl+Shift+F，输入要搜的词。下面三个输入框分别控制搜索词、包含范围、排除范围。" },
          { t: "code", lang: "text", code: "搜索词：console.log\n包含：src/**/*.ts\n排除：**/*.test.ts\n\n结果按文件分组，点一条跳到对应行" },
          { t: "h2", text: "演示 2 · 用正则找 TODO" },
          { t: "p", text: "打开正则按钮，输入下面的表达式，只找行首注释里的 TODO。替换时用 1 美元符号这种反向引用要小心，站内正文不展开，先学会找就够用。" },
          { t: "code", lang: "text", code: "^\\s*//\\s*TODO[:：]?\\s*(.*)$" },
          { t: "p", text: "这个表达式匹配行首若干空格、两个斜杠、TODO 和后面的内容。正则写错时先缩小范围，只搜一个文件，确认命中再放到全项目。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef2fb\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#17233d\">搜索的三层范围</text><rect x=\"62\" y=\"104\" width=\"150\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"137\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#17233d\">当前文件</text><text x=\"137\" y=\"151\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">Ctrl+F</text><rect x=\"246\" y=\"104\" width=\"150\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"321\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#17233d\">整个项目</text><text x=\"321\" y=\"151\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">Ctrl+Shift+F</text><rect x=\"430\" y=\"104\" width=\"150\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"505\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#17233d\">加规则</text><text x=\"505\" y=\"151\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">包含 / 排除 / 正则</text><path d=\"M216 136H242\" stroke=\"#4f46e5\" stroke-width=\"2.5\"/><path d=\"M400 136H426\" stroke=\"#4f46e5\" stroke-width=\"2.5\"/></svg>", caption: "范围越大越要加规则；替换全部之前先确认命中数量。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "在全项目替换前不看命中数量，把不该改的字符串也改了。",
            "正则里的反斜杠写少了，匹配不到。先用小范围试。",
            "以为搜索会理解语义。它只做文本匹配，同名变量和字符串都会命中。",
            "排除规则写错，构建目录仍被搜到。用 **/dist/** 这种 glob。",
            "改完不看 diff 就提交。源代码面板面板能逐行看改动，别跳过。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "在一个项目里搜一个函数名，记下它出现在几个文件里。",
            "用包含框只搜 src 目录，再用排除框排除测试文件，对比结果数量。",
            "用正则找出行首的 TODO 注释，把命中条数抄下来。"
          ]},
          { t: "tip", color: "green", text: "一句话：Ctrl+F 搜当前文件，Ctrl+Shift+F 搜全项目；包含、排除、正则三件套把范围收紧，替换前先看命中数。" }
        ]
      },
      {
        id: "ide06",
        title: "第 6 课 · 扩展：装一个语言支持",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：会从扩展市场装语言支持，知道扩展装在哪、怎么禁用、怎么给项目推荐。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "VS Code 本体只提供文本编辑、搜索、Git 这些通用能力。语言相关的补全、跳转、诊断由扩展提供。装一个 Python 扩展，编辑器就会调用本机的 Python 解释器和语言服务器，给你补全和报错。" },
          { t: "p", text: "扩展面板在活动栏最下面，图标是四个方块。搜索扩展名，点安装。装完有的扩展需要重新加载窗口，有的直接生效。扩展装多了会拖慢启动，可以在扩展面板里按「已启用」筛选，把不用的禁用。" },
          { t: "p", text: "项目可以带一份推荐清单：在 .vscode/extensions.json 里写 recommendations，别人打开这个项目时，VS Code 会提示安装这几个扩展。这样团队不用口头传「你装一下那个插件」。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "让编辑器认识你用的语言，补全、跳转、报错才有。",
            "用 Prettier 或 ESLint 统一代码风格。",
            "装 GitLens 看每一行是谁改的。",
            "给项目推荐扩展，新同事打开就能装齐。"
          ]},
          { t: "h2", text: "演示 1 · 装一个语言扩展" },
          { t: "p", text: "按 Ctrl+Shift+X 打开扩展面板，搜索 Python，选微软发布的那一个，点安装。装完打开一个 .py 文件，右下角会显示 Python 版本，编辑器开始给补全。" },
          { t: "code", lang: "text", code: "Ctrl+Shift+X       打开扩展面板\n搜索：Python\n发布者：Microsoft\n安装后打开 .py 文件验证补全" },
          { t: "h2", text: "演示 2 · 给项目写推荐清单" },
          { t: "p", text: "在项目根目录建 .vscode/extensions.json，写入下面内容。别人打开项目时，VS Code 会在扩展面板提示安装。" },
          { t: "code", lang: "json", code: "{\n  \"recommendations\": [\n    \"ms-python.python\",\n    \"esbenp.prettier-vscode\"\n  ]\n}" },
          { t: "p", text: "扩展的完整 id 是「发布者.扩展名」，在扩展详情页能复制。推荐清单只提示，不强制安装；团队要统一，还得配一份 settings.json。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef2fb\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#17233d\">扩展补上本体没有的能力</text><rect x=\"60\" y=\"104\" width=\"150\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"135\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#17233d\">VS Code 本体</text><text x=\"135\" y=\"151\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">编辑 / 搜索 / Git</text><path d=\"M214 136H262\" stroke=\"#4f46e5\" stroke-width=\"3\"/><polygon points=\"262,136 252,130 252,142\" fill=\"#4f46e5\"/><rect x=\"270\" y=\"104\" width=\"150\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"345\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#17233d\">语言扩展</text><text x=\"345\" y=\"151\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">补全 / 跳转 / 诊断</text><path d=\"M424 136H472\" stroke=\"#4f46e5\" stroke-width=\"3\"/><polygon points=\"472,136 462,130 462,142\" fill=\"#4f46e5\"/><rect x=\"480\" y=\"104\" width=\"104\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"532\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#17233d\">本机工具链</text><text x=\"532\" y=\"151\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">编译器 / 解释器</text></svg>", caption: "扩展不是语言本身；它把你的代码转给本机的解释器或语言服务器。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "装了扩展就以为语言环境装好了。扩展只负责编辑器这一侧，解释器或编译器还要另装。",
            "装两个同语言的扩展，补全打架。留一个，另一个禁用。",
            "扩展装太多，启动变慢。定期在扩展面板清理不用的。",
            "推荐清单里写扩展名不写发布者，可能装到同名的另一个。用完整 id。",
            "在不受信任的工作区里随便装扩展。先看工作区信任提示，再决定。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "从扩展面板装一个你所用语言的官方扩展，打开对应文件确认补全出现。",
            "在 .vscode/extensions.json 里写两个推荐扩展，重新打开项目看提示。",
            "禁用其中一个扩展，观察补全或格式化有什么变化，再启用回来。"
          ]},
          { t: "tip", color: "green", text: "一句话：VS Code 本体只管通用编辑，语言能力靠扩展；扩展要配本机工具链，推荐清单能让团队装齐。" }
        ]
      },
      {
        id: "ide07",
        title: "第 7 课 · 调试：断点与单步",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：会建一份 launch.json，打断点、启动调试、单步走，并看懂变量面板。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "调试不是「加一堆 print」。调试器让你在程序跑到某一行时暂停，然后一步一步执行，随时看变量的值。断点是暂停的位置，单步是往前走的方式：Step Over 走下一行、Step Into 进函数、Step Out 出函数。" },
          { t: "p", text: "VS Code 的调试配置写在 .vscode/launch.json。每种语言有自己的调试器扩展，配置字段也不同。最常见的字段是 name（配置名）、type（调试器类型）、request（launch 启动还是 attach 附加）、program（入口文件）。" },
          { t: "p", text: "启动调试后，左边会出现变量、监视、调用栈、断点四个面板。黄色高亮是当前停住的行；按 F10 单步跳过，F11 单步进入，Shift+F11 跳出，F5 继续到下一个断点。调试完按 Shift+F5 停止。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "看循环每一轮变量到底是多少，不用猜。",
            "看函数调用顺序，知道是谁传了错参数。",
            "在异常抛出的那一刻暂停，检查现场。",
            "条件断点只在满足条件时停，避免手动按几百次。"
          ]},
          { t: "h2", text: "演示 1 · 一份 Node 调试配置" },
          { t: "code", lang: "json", code: "{\n  \"version\": \"0.2.0\",\n  \"configurations\": [\n    {\n      \"name\": \"启动当前文件\",\n      \"type\": \"node\",\n      \"request\": \"launch\",\n      \"program\": \"index.js\",\n      \"skipFiles\": [\"<node_internals>/**\"]\n    }\n  ]\n}" },
          { t: "p", text: "program 里的入口文件路径表示当前打开的文件。按 F5 启动，编辑器会在调试控制台里显示程序输出。其他语言把 type 换成对应调试器，program 换成入口路径，思路一样。" },
          { t: "h2", text: "演示 2 · 打断点并单步" },
          { t: "p", text: "在行号左边点一下，出现红点就是断点。启动调试后程序停在这一行，变量面板会列出当前作用域的变量。" },
          { t: "code", lang: "text", code: "F5          启动 / 继续\nF9          开关断点\nF10         单步跳过（Step Over）\nF11         单步进入（Step Into）\nShift+F11   单步跳出（Step Out）\nShift+F5    停止调试" },
          { t: "p", text: "单步时看两处：当前行的黄色高亮，和变量面板里值的变化。如果变量是对象，展开箭头能看到字段。监视面板可以手动输入表达式，比如 nums.length。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef2fb\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#17233d\">调试循环：停 → 看 → 走</text><circle cx=\"130\" cy=\"140\" r=\"34\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"3\"/><text x=\"130\" y=\"145\" font-size=\"14\" text-anchor=\"middle\" fill=\"#17233d\">断点</text><path d=\"M168 140H232\" stroke=\"#4f46e5\" stroke-width=\"3\"/><polygon points=\"232,140 222,134 222,146\" fill=\"#4f46e5\"/><rect x=\"240\" y=\"112\" width=\"140\" height=\"56\" rx=\"10\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"310\" y=\"136\" font-size=\"14\" text-anchor=\"middle\" fill=\"#17233d\">变量面板</text><text x=\"310\" y=\"156\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">当前作用域的值</text><path d=\"M384 140H448\" stroke=\"#4f46e5\" stroke-width=\"3\"/><polygon points=\"448,140 438,134 438,146\" fill=\"#4f46e5\"/><rect x=\"456\" y=\"112\" width=\"120\" height=\"56\" rx=\"10\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"516\" y=\"136\" font-size=\"14\" text-anchor=\"middle\" fill=\"#17233d\">单步</text><text x=\"516\" y=\"156\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">F10 / F11</text><path d=\"M310 168V196H130V174\" stroke=\"#5a6880\" stroke-width=\"2.5\" stroke-dasharray=\"5 5\"/><text x=\"220\" y=\"212\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">每走一步，值都会更新</text></svg>", caption: "断点停住，变量面板告诉你现在是什么，单步让你看它怎么变。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "没装对应语言的调试器扩展，launch.json 里的 type 识别不了。",
            "program 路径写错，启动就报找不到模块。用相对路径或 工作区根目录。",
            "断点打在空行或注释上，程序不会停。断点要落在可执行的语句上。",
            "在循环里打普通断点，要按几百次 F5。改用条件断点，右键断点选条件。",
            "调试完忘了停止，端口被占。按 Shift+F5 收尾。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "建一份 launch.json，用 F5 启动当前脚本，确认调试控制台有输出。",
            "在循环里打一个断点，用 F10 走三轮，抄下每轮循环变量的值。",
            "把普通断点改成条件断点，只在 i 等于 3 时停。"
          ]},
          { t: "tip", color: "green", text: "一句话：断点停、变量看、F10/F11 走；调试配置写在 launch.json，program 指对入口。" }
        ]
      },
      {
        id: "ide08",
        title: "第 8 课 · Git 集成",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：在 VS Code 里完成 stage、commit、看 diff、切分支、push，知道界面背后还是 Git 命令。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "VS Code 的源代码面板面板是 Git 的一层图形界面。它调用的是你本机装的 git 命令，所以 Git 没装或没配 user.name，面板也用不了。左边活动栏第三个图标就是它，图标上会显示改动文件数。" },
          { t: "p", text: "面板分成三块：Changes 是工作区改动，Staged Changes 是已经 add 的内容，下面是提交信息框。点文件能看到左右对比的 diff：左边是旧版，右边是新版。加号是 stage，减号是取消 stage。" },
          { t: "p", text: "提交信息写完后按 Ctrl+Enter 提交。分支名在状态栏左下角，点一下能切换或新建分支。推送和拉取在「...」菜单里，也可以直接用命令面板搜 Git: Push。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "改完代码在同一个窗口里看 diff、提交，不用切终端。",
            "逐行看自己改了什么，避免把调试代码一起提交。",
            "在状态栏切分支，不用记 git switch 的参数。",
            "冲突时用编辑器里的合并界面选保留哪一边。"
          ]},
          { t: "h2", text: "演示 1 · 改一行并看 diff" },
          { t: "p", text: "打开一个 Git 仓库，改一行文件，保存。源代码面板图标出现数字。点开改动文件，编辑器进入 diff 视图：绿色是新增，红色是删除。" },
          { t: "code", lang: "text", code: "活动栏第三个图标       源代码面板\nChanges                工作区改动\nStaged Changes         已 add 的内容\n+ 号                   暂存这个文件\nCtrl+Enter             提交" },
          { t: "h2", text: "演示 2 · 切分支与推送" },
          { t: "p", text: "点状态栏左下角的分支名，选择已有分支或「创建新分支」。推送用命令面板：按 Ctrl+Shift+P，输入 Git: Push。拉取同理，搜 Git: Pull。" },
          { t: "code", lang: "text", code: "Ctrl+Shift+P\n> Git: Push\n> Git: Pull\n> Git: Create Branch\n> Git: Checkout to..." },
          { t: "p", text: "界面只是入口，出问题时仍然要看懂终端里的 Git 输出。冲突时 VS Code 会在文件里显示「当前更改 / 传入更改 / 两者都保留」三个按钮，选完保存，再 stage 并提交。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef2fb\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#17233d\">源代码面板面板的三格</text><rect x=\"62\" y=\"104\" width=\"150\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"137\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#17233d\">Changes</text><text x=\"137\" y=\"151\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">工作区改动</text><path d=\"M216 136H262\" stroke=\"#4f46e5\" stroke-width=\"3\"/><polygon points=\"262,136 252,130 252,142\" fill=\"#4f46e5\"/><rect x=\"270\" y=\"104\" width=\"150\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"345\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#17233d\">Staged</text><text x=\"345\" y=\"151\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">下次提交的内容</text><path d=\"M424 136H470\" stroke=\"#4f46e5\" stroke-width=\"3\"/><polygon points=\"470,136 460,130 460,142\" fill=\"#4f46e5\"/><rect x=\"478\" y=\"104\" width=\"106\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"531\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#17233d\">Commit</text><text x=\"531\" y=\"151\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">钉成一个版本</text></svg>", caption: "先看 diff，再 stage，最后 commit；三步和命令行的 add、commit 一一对应。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "没装 Git 就打开源代码面板，面板提示找不到 git。先装 Git。",
            "把调试用的 console.log 一起提交。提交前逐个看 diff。",
            "在面板里点了「丢弃更改」，以为只是取消暂存。丢弃会真删工作区改动。",
            "冲突时只点一边，没看另一边。合并前把两边的意图都读一遍。",
            "在巨大的仓库里打开自动 fetch，后台一直跑。按需关闭或调低频率。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "改一个文件，在源代码面板面板里看 diff，分别 stage 和取消 stage 一次。",
            "写一条提交信息并提交，然后用 git log --oneline 在终端确认。",
            "从状态栏新建一条分支，切回 main，再用命令面板执行一次 Git: Push。"
          ]},
          { t: "tip", color: "green", text: "一句话：源代码面板面板是 Git 的图形壳；看 diff、stage、commit 三步和命令行一一对应。" }
        ]
      },
      {
        id: "ide09",
        title: "第 9 课 · 终端与任务",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：会用集成终端、分屏终端和 tasks.json，把常用命令固定成任务。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "VS Code 的终端是嵌在窗口里的真实 shell，不是模拟器。它继承当前工作目录，打开项目后默认落在项目根目录。Ctrl+反引号 开关终端，Ctrl+Shift+反引号 新建一个终端，终端面板右上角的分裂按钮可以并排开多个。" },
          { t: "p", text: "tasks.json 把一条命令变成可重复执行的任务。按 Ctrl+Shift+P 搜 Tasks: Configure Task，选择「使用模板创建」，会生成 .vscode/tasks.json。任务可以绑定快捷键，也可以设成「构建任务」，之后按 Ctrl+Shift+B 直接跑。" },
          { t: "p", text: "任务和终端的区别：终端是自由输入，任务是把固定命令和参数记下来，减少重复。构建、测试、启动开发服务器都适合做成任务。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "不用切窗口，在编辑器底部跑构建和测试。",
            "同时开一个前端和一个后端终端，日志并排看。",
            "把 npm run dev 固定成任务，按一次快捷键就启动。",
            "任务失败时点问题面板，直接跳到报错文件。"
          ]},
          { t: "h2", text: "演示 1 · 开关与分屏终端" },
          { t: "code", lang: "text", code: "Ctrl+反引号           开关终端\nCtrl+Shift+反引号     新建终端\n终端右上角的分裂按钮   并排开第二个\n终端下拉菜单          切换 bash / zsh / pwsh" },
          { t: "p", text: "终端里跑的命令和你系统终端里一样。cd、ls、git、npm 都能用。关掉面板不等于结束进程，后台服务可能还在跑；要停就在终端里按 Ctrl+C。" },
          { t: "h2", text: "演示 2 · 写一个构建任务" },
          { t: "p", text: "在 .vscode/tasks.json 写入下面内容。它定义一个名为 build 的任务，执行 npm run build，并把输出显示在终端。" },
          { t: "code", lang: "json", code: "{\n  \"version\": \"2.0.0\",\n  \"tasks\": [\n    {\n      \"label\": \"build\",\n      \"type\": \"shell\",\n      \"command\": \"npm run build\",\n      \"group\": \"build\",\n      \"problemMatcher\": []\n    }\n  ]\n}" },
          { t: "p", text: "写完后按 Ctrl+Shift+B，选择 build，任务就在终端里跑。group 设为 build 的任务会成为默认构建任务，以后按一次键就能跑。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef2fb\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#17233d\">终端与任务的分工</text><rect x=\"62\" y=\"104\" width=\"170\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"147\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#17233d\">集成终端</text><text x=\"147\" y=\"151\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">自由输入命令</text><rect x=\"266\" y=\"104\" width=\"170\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"351\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#17233d\">tasks.json</text><text x=\"351\" y=\"151\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">固定命令 + 快捷键</text><rect x=\"470\" y=\"104\" width=\"114\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"527\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#17233d\">问题面板</text><text x=\"527\" y=\"151\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">点报错跳转</text><path d=\"M236 136H262\" stroke=\"#4f46e5\" stroke-width=\"2.5\"/><path d=\"M440 136H466\" stroke=\"#4f46e5\" stroke-width=\"2.5\"/></svg>", caption: "终端负责临时命令，任务负责每天重复的那几条；构建任务可以绑到 Ctrl+Shift+B。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "关掉终端面板就以为进程结束了。后台服务还在跑，用 Ctrl+C 或进程命令停。",
            "任务里的相对路径按编辑器目录算，不是按文件目录算。用 工作区根目录 更稳。",
            "tasks.json 的 JSON 多一个逗号，任务面板不显示。保存后看问题面板。",
            "在错误的终端里跑命令，比如进了子目录还跑根目录的脚本。先 pwd 确认。",
            "把密码写在任务参数里。任务文件会进仓库，改用环境变量或交互输入。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用快捷键开关终端，再新建一个终端，并排开两个。",
            "写一个 tasks.json，把一条你每天都要跑的命令做成任务，用 Ctrl+Shift+B 跑一次。",
            "故意让任务命令失败，看问题面板和终端各报什么。"
          ]},
          { t: "tip", color: "green", text: "一句话：终端跑临时命令，tasks.json 固化重复命令；关面板不等于停进程。" }
        ]
      },
      {
        id: "ide10",
        title: "第 10 课 · 工作区与设置",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：分清用户设置和工作区设置，会用 settings.json 把格式化、排除目录这类规则固定下来。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "VS Code 的设置分两层：用户设置对你所有项目生效，工作区设置在 .vscode/settings.json 里，只对当前项目生效。两层冲突时，工作区优先。这样你可以全局用一套习惯，给某个项目单独开严格模式。" },
          { t: "p", text: "设置界面按 Ctrl+逗号 打开，顶部有「用户」和「工作区」两个标签。每个设置右侧的齿轮可以选「复制到工作区」，把这一项写进项目文件。工作区设置会进 Git，团队可以共享同一套规则。" },
          { t: "p", text: "两个最常用的设置：editor.formatOnSave 让保存时自动格式化，files.exclude 把 dist、node_modules 这类目录从文件树里藏起来。后者只影响显示，不影响搜索和 Git。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "团队统一缩进、换行、格式化规则，减少无意义的 diff。",
            "把构建产物从侧边栏藏起来，目录看起来干净。",
            "给不同项目配不同的解释器路径。",
            "用设置同步把用户设置带到另一台电脑。"
          ]},
          { t: "h2", text: "演示 · 一份工作区设置" },
          { t: "p", text: "在项目根目录建 .vscode/settings.json，写入下面内容。保存后打开一个源码文件，按 Ctrl+S 看是否自动格式化；再看文件树，dist 目录应该不见了。" },
          { t: "code", lang: "json", code: "{\n  \"editor.formatOnSave\": true,\n  \"editor.tabSize\": 2,\n  \"files.exclude\": {\n    \"**/dist\": true,\n    \"**/node_modules\": true\n  },\n  \"files.trimTrailingWhitespace\": true\n}" },
          { t: "p", text: "这五项分别管：保存格式化、缩进两格、隐藏构建目录与依赖、去掉行尾空格。每一项都能在设置界面里搜到对应说明，不确定字段名就先在界面改，再点「复制到工作区」。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef2fb\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#17233d\">设置的两层优先级</text><rect x=\"80\" y=\"104\" width=\"200\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"180\" y=\"130\" font-size=\"15\" text-anchor=\"middle\" fill=\"#17233d\">用户设置</text><text x=\"180\" y=\"151\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">所有项目</text><rect x=\"360\" y=\"104\" width=\"200\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"460\" y=\"130\" font-size=\"15\" text-anchor=\"middle\" fill=\"#17233d\">工作区设置</text><text x=\"460\" y=\"151\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">只对当前项目，优先</text><path d=\"M284 136H356\" stroke=\"#4f46e5\" stroke-width=\"3\"/><polygon points=\"356,136 346,130 346,142\" fill=\"#4f46e5\"/><text x=\"320\" y=\"196\" font-size=\"13\" text-anchor=\"middle\" fill=\"#5a6880\">同名设置冲突时，工作区覆盖用户</text></svg>", caption: "用户设置是习惯，工作区设置是项目规则；冲突时后者赢。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "改了半天设置才发现改的是用户设置，换项目还在。看清顶部标签。",
            "工作区设置写错字段名，VS Code 画波浪线但不影响启动。看问题面板。",
            "把 files.exclude 当成删除。它只是隐藏，文件还在磁盘上。",
            "把个人路径写进工作区设置再提交，同事打开全是波浪线。用相对路径或变量。",
            "同时开 formatOnSave 和保存时跑 lint 修复，两个扩展互相改。留一个。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "打开设置界面，分别看用户和工作区两个标签，找一项你想改的设置。",
            "在工作区设置里开 formatOnSave，保存一个文件看是否自动格式化。",
            "用 files.exclude 隐藏一个目录，确认它只是从侧边栏消失，磁盘上还在。"
          ]},
          { t: "tip", color: "green", text: "一句话：用户设置管所有项目，工作区设置管当前项目且优先；settings.json 进 Git，团队能共享。" }
        ]
      },
      {
        id: "ide11",
        title: "第 11 课 · 代码片段与重构",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：会写用户代码片段，会用重命名、提取变量、提取函数三个重构动作。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "代码片段（snippet）是一段可复用的模板。输入一个前缀，按 Tab，编辑器把模板展开，光标停在第一个可填位置，再按 Tab 跳到下一个。它适合写重复的测试骨架、日志格式、组件结构。" },
          { t: "p", text: "片段文件是 JSON。每个片段有 prefix（触发词）、body（内容数组，一行一个字符串）、description（说明）。body 里的 $1、$2 是光标停留点，$0 是最后停留点。片段可以按语言绑，也可以做成全局片段。" },
          { t: "p", text: "重构是「不改变行为，只改变结构」。VS Code 自带三个最常用的：F2 重命名符号（会改所有引用）、Ctrl+Shift+R 提取变量/函数、Ctrl+Alt+O 组织导入（语言扩展提供）。重构前先提交一次，改坏了能退回。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "一条 log 前缀展开成带时间、级别、模块的日志模板。",
            "一键生成测试用例的 describe / it 骨架。",
            "把重复表达式提取成变量，把一段逻辑提取成函数。",
            "重命名变量时一次改完所有引用，不漏。"
          ]},
          { t: "h2", text: "演示 1 · 写一个日志片段" },
          { t: "p", text: "按 Ctrl+Shift+P 搜 Configure User Snippets，选当前语言，写入下面内容。保存后在 .js 文件里输入 logi 再按 Tab，模板展开。" },
          { t: "code", lang: "json", code: "{\n  \"log info\": {\n    \"prefix\": \"logi\",\n    \"body\": [\n      \"console.log('[$1] $2', $3);\",\n      \"$0\"\n    ],\n    \"description\": \"带模块名的日志\"\n  }\n}" },
          { t: "p", text: "body 里的 $1、$2、$3 是可填位置，按 Tab 依次跳。$0 是最后落点。片段只负责展开，不会替你检查语法。" },
          { t: "h2", text: "演示 2 · 三个重构动作" },
          { t: "code", lang: "text", code: "F2              重命名符号（所有引用一起改）\nCtrl+Shift+R    重构菜单：提取变量 / 提取函数\nCtrl+Alt+O      组织导入（语言扩展提供）\nShift+Alt+O     整理 import（部分扩展）" },
          { t: "p", text: "把光标放在变量名上按 F2，输入新名字回车，当前文件里所有引用会一起改。选中一段表达式按 Ctrl+Shift+R，选「提取到常量」，编辑器会在上方插入一个新变量。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef2fb\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#17233d\">片段展开：前缀 → 模板 → 逐格填</text><rect x=\"64\" y=\"104\" width=\"150\" height=\"58\" rx=\"10\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"139\" y=\"130\" font-size=\"15\" text-anchor=\"middle\" fill=\"#17233d\">logi + Tab</text><text x=\"139\" y=\"150\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">触发词</text><path d=\"M218 133H276\" stroke=\"#4f46e5\" stroke-width=\"3\"/><polygon points=\"276,133 266,127 266,139\" fill=\"#4f46e5\"/><rect x=\"284\" y=\"96\" width=\"180\" height=\"74\" rx=\"10\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"374\" y=\"120\" font-size=\"13\" text-anchor=\"middle\" fill=\"#17233d\">console.log(</text><text x=\"374\" y=\"140\" font-size=\"13\" text-anchor=\"middle\" fill=\"#17233d\">'[模块] 消息', 值)</text><text x=\"374\" y=\"160\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">$1 / $2 / $3</text><path d=\"M468 133H518\" stroke=\"#4f46e5\" stroke-width=\"3\"/><polygon points=\"518,133 508,127 508,139\" fill=\"#4f46e5\"/><text x=\"556\" y=\"130\" font-size=\"13\" text-anchor=\"middle\" fill=\"#17233d\">Tab 跳格</text><text x=\"556\" y=\"150\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">$0 收尾</text></svg>", caption: "片段把重复结构存成模板，Tab 依次填占位符，最后落到 $0。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "片段 JSON 多一个逗号，整份不生效。保存后看问题面板。",
            "body 里用了未转义的双引号，JSON 解析失败。用单引号或转义。",
            "把片段当成代码生成器。它只展开文本，不检查变量是否存在。",
            "重构前没提交，改坏了退不回去。先 commit 再动手。",
            "F2 重命名跨文件没生效，因为语言扩展没装或项目没索引完。等索引完再试。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "写一个代码片段，前缀自定，展开后至少有两个可填位置。",
            "把一段重复表达式用 Ctrl+Shift+R 提取成变量，再用 F2 改一次变量名。",
            "把一段逻辑提取成函数，确认调用处和定义处都更新。"
          ]},
          { t: "tip", color: "green", text: "一句话：片段把重复结构存成模板，Tab 填空；重构先提交，F2 改名、Ctrl+Shift+R 提取。" }
        ]
      },
      {
        id: "ide12",
        title: "第 12 课 · 远程开发与后续路线",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：知道远程开发的三种形态，能把 VS Code 连到服务器或容器，并清楚入门之后该往哪走。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "远程开发的意思是：代码和运行环境在另一台机器上，VS Code 只负责界面。你本机敲字，扩展和终端跑在远端。VS Code 通过 SSH、容器或 WSL 把两边接起来，文件不往本机拷。" },
          { t: "p", text: "三种常见形态：Remote - SSH 连一台 Linux 服务器；Dev Containers 把项目放进 Docker 容器，环境随项目走；WSL 在 Windows 上直接连 Linux 子系统。GitHub Codespaces 则是把远程机器放到云端，打开浏览器就能写。" },
          { t: "p", text: "远程开发适合「本机装不动环境」和「团队要统一环境」两种情况。代价是网络延迟、扩展要分本地和远程两套、密钥和端口要配好。第一次连建议先用 SSH 的默认配置，跑通再改。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "在本机写代码，实际跑在远程服务器的 GPU 或大数据环境上。",
            "用 Dev Containers 让每个项目自带一套依赖，换电脑不用重装。",
            "在 Windows 上通过 WSL 用 Linux 工具链。",
            "用 Codespaces 在平板或临时电脑上打开完整项目。"
          ]},
          { t: "h2", text: "演示 · 用 SSH 连一台服务器" },
          { t: "p", text: "先装 Remote - SSH 扩展，按 F1 或 Ctrl+Shift+P 打开命令面板，输入 Remote-SSH: Connect to Host。第一次要填 user@host，之后会写进 SSH 配置。" },
          { t: "code", lang: "bash", code: "# 本机先确认能 SSH 登录\nssh user@example.com\n\n# VS Code 命令面板：\n# Remote-SSH: Connect to Host...\n# 输入 user@example.com\n# 连上后左下角显示 SSH: example.com" },
          { t: "p", text: "连上之后，打开远程目录，终端里跑的是远端 shell。扩展面板会分成「本地」和「SSH: 主机」两组，语言扩展通常要装在远端。断开用命令面板的 Remote: Close Remote Connection。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef2fb\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#17233d\">远程开发：界面在本地，环境在远端</text><rect x=\"60\" y=\"104\" width=\"170\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"145\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#17233d\">本机 VS Code</text><text x=\"145\" y=\"151\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">界面 / 键盘</text><path d=\"M234 136H310\" stroke=\"#4f46e5\" stroke-width=\"3\"/><polygon points=\"310,136 300,130 300,142\" fill=\"#4f46e5\"/><text x=\"272\" y=\"124\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">SSH</text><rect x=\"318\" y=\"104\" width=\"170\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#4f46e5\" stroke-width=\"2\"/><text x=\"403\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#17233d\">远端机器</text><text x=\"403\" y=\"151\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">代码 / 终端 / 扩展</text><path d=\"M492 136H536\" stroke=\"#4f46e5\" stroke-width=\"3\"/><polygon points=\"536,136 526,130 526,142\" fill=\"#4f46e5\"/><text x=\"568\" y=\"130\" font-size=\"12\" text-anchor=\"middle\" fill=\"#17233d\">环境</text><text x=\"568\" y=\"150\" font-size=\"12\" text-anchor=\"middle\" fill=\"#5a6880\">不拷回本机</text></svg>", caption: "远程开发把界面和环境拆开：本机负责显示，远端负责运行。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "以为连上远程后代码会自动同步到本机。文件在远端，本机不保存副本。",
            "语言扩展只装在本机，远端没有补全。看扩展面板的分组，把语言扩展装到远端。",
            "SSH 密钥没配，VS Code 反复弹密码。先把命令行 ssh 跑通。",
            "在远程终端里跑需要图形界面的命令，没有显示器。用命令行版本或端口转发。",
            "把私钥提交进仓库。远程配置和密钥都不该进 Git。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "装 Remote - SSH 扩展，连一台你能登录的 Linux 机器，打开一个目录。",
            "在远程窗口里装一个语言扩展，确认它出现在「SSH: 主机」分组而不是本地分组。",
            "写下你下一步想深入的方向：语言工具链、调试、容器、还是远程开发，并列出三个要练的动作。"
          ]},
          { t: "tip", color: "green", text: "一句话：远程开发把界面留在本机、环境放到远端；先跑通命令行 SSH，再让 VS Code 连上去。" }
        ]
      }
    ]
  }
};
