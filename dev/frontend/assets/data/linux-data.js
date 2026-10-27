/* 喵站 · Linux 入门（单文件形态，与 go-data.js 同构）
 * 12 课：历史 / 安装 / 三个定位命令 / 目录操作 / 读文件 / 权限 / 进程 / 软件包 / 重定向 / 文本处理 / 网络 / 脚本。
 * 代码块里的命令都按 Ubuntu 24.04 的默认环境自查过；破坏性命令只作示例，不在这里执行。 */
window.MIAO_LINUX = {
  tutorial: {
    id: "linux",
    title: "Linux 入门",
    intro: "从 Unix 的出身讲到第一个 shell 脚本：12 课把命令行最常用的部分走一遍，每课都有能照敲的命令和一张机制图。",
    cat: "linux",
    diff: "入门",
    tags: ["Linux", "命令行", "Bash", "入门"],
    author: "喵站官方",
    cover: "/assets/img/covers/linux.svg",
    updated: "2026-10-27",
    chapters: [
      {
        id: "lx01",
        title: "第 1 课 · Linux 的历史：从 Unix 到内核",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：弄清 Unix、内核、发行版三者的关系，知道 Linux 这个名字到底指哪一部分，以及服务器上为什么到处是它。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "1969 年，贝尔实验室的 Ken Thompson 和 Dennis Ritchie 写了一个小操作系统，后来叫 Unix。它用 C 语言重写，因此能搬到不同型号的机器上；它把设备也当成文件，用一批小工具拼出复杂功能。这两条设计影响了后来几乎所有类 Unix 系统，包括今天的 macOS 和 Linux。" },
          { t: "p", text: "1983 年，Richard Stallman 发起 GNU 计划，目标是做一个自由的操作系统。工具链一件件写出来了：编译器 gcc、shell 叫 bash、基础命令收在 coreutils 里，但自己的内核一直没完成。1991 年，芬兰学生 Linus Torvalds 在 x86 机器上写了一个内核，取名 Linux，1992 年改用 GPL 授权。GNU 的工具加上这个内核，才凑成一个能用的系统。" },
          { t: "p", text: "严格说，Linux 只是内核：负责调度 CPU、分配内存、驱动硬件、提供系统调用。你敲的命令、看到的图形界面，都是内核之上的程序。各家把内核、工具、软件源和安装程序打包，就成了发行版，Ubuntu、Debian、Fedora、Arch 都是这样来的。同一个内核，可以做出体验差别很大的系统。" },
          { t: "p", text: "这也解释了一个常见困惑：为什么教程里的命令在我的机器上对不上。发行版选择装哪些工具、用哪个版本、配置放在哪个目录，都会影响敲下去的结果。遇到差异时先查发行版名称和版本号，再查这条命令属于哪个包，比死记答案有用。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "当服务器：网站、数据库、容器平台大多跑在 Linux 上，远程只给你一个终端。",
            "当开发环境：多数语言和工具默认先支持 Linux，容器镜像也以它为基础。",
            "当学习材料：内核和大量命令的源码公开，读和改都不需要授权费。",
            "当旧电脑的第二次生命：轻量发行版能让十年前的老机器重新可用。"
          ]},
          { t: "h2", text: "演示：查内核与发行版" },
          { t: "p", text: "打开终端，敲 uname -r。输出的第一段就是内核版本号，例如 6.8.0-45-generic，后面的词描述编译参数和发行版补丁，先不用管。" },
          { t: "code", lang: "bash", code: "uname -r\nuname -a\nhostname" },
          { t: "p", text: "uname -a 多给主机名、编译时间、CPU 架构；hostname 只报机器名。注意内核版本和发行版号不是一回事：6.8 是内核版本，24.04 是发行版的年份编号，内核可以单独升级，发行版号不变。" },
          { t: "svg", code: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240"><title>从 Unix 到发行版的时间线</title><rect x="30" y="26" width="580" height="180" rx="14" fill="#eef3fa"/><text x="320" y="64" font-size="20" font-weight="700" text-anchor="middle" fill="#17324d">四条线：Unix、GNU、内核、发行版</text><line x1="70" y1="120" x2="570" y2="120" stroke="#3568a8" stroke-width="3"/><circle cx="110" cy="120" r="8" fill="#3568a8"/><text x="110" y="102" font-size="15" text-anchor="middle" fill="#17324d">1969</text><text x="110" y="150" font-size="14" text-anchor="middle" fill="#4d6480">Unix 诞生</text><circle cx="250" cy="120" r="8" fill="#3568a8"/><text x="250" y="102" font-size="15" text-anchor="middle" fill="#17324d">1983</text><text x="250" y="150" font-size="14" text-anchor="middle" fill="#4d6480">GNU 工具链</text><circle cx="390" cy="120" r="8" fill="#3568a8"/><text x="390" y="102" font-size="15" text-anchor="middle" fill="#17324d">1991</text><text x="390" y="150" font-size="14" text-anchor="middle" fill="#4d6480">Linux 内核</text><circle cx="530" cy="120" r="8" fill="#3568a8"/><text x="530" y="102" font-size="15" text-anchor="middle" fill="#17324d">今天</text><text x="530" y="150" font-size="14" text-anchor="middle" fill="#4d6480">各家发行版</text><text x="320" y="188" font-size="14" text-anchor="middle" fill="#4d6480">内核加工具打包，才成为可安装的系统</text></svg>', caption: "Unix 给了设计，GNU 给了工具，Linux 给了内核，发行版负责打包。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把 Linux 说成一套完整系统。发行版才是完整系统，Linux 只是其中那个内核。",
            "以为 Unix 和 Linux 是同一份代码。两者是设计上的亲戚，代码各自独立发展。",
            "以为版本号越高越好。服务器更看重稳定，长期支持版本的内核往往不是最新的。",
            "以为学 Linux 要先背几百条命令。常用的不到三十条，剩下的用到再查。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用自己的话说明内核和发行版各负责什么，各写一句。",
            "在本机跑 uname -r，把内核版本原样抄下来。",
            "查一下你正在用的发行版基于哪个上游，写出名称和版本号。"
          ]},
          { t: "tip", color: "green", text: "一句话：Linux 是内核，GNU 提供了工具，发行版把两者打包交付；三条线合起来才是你看到的系统。" }
        ]
      },
      {
        id: "lx02",
        title: "第 2 课 · 装 Linux：虚拟机或 WSL，并打开终端",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：在没有第二台电脑的情况下，用虚拟机或 WSL 得到一台能敲命令的 Linux，并确认终端真的可用。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "装 Linux 有三条路：整机安装会抹掉原来的系统，风险最大；虚拟机和 WSL 都在现有系统里划出一块空间，删掉不影响主机。入门阶段选后两条，配置错了删掉重来，代价只有几分钟。" },
          { t: "p", text: "虚拟机是一台完整的假电脑。VirtualBox 或 VMware 里新建机器，分 2 核 CPU、4 GB 内存、25 GB 磁盘，挂上 Ubuntu 的 ISO 镜像，按向导装完。镜像从 ubuntu.com 下载，Desktop 版带图形界面，Server 版只有终端，更省资源，也更接近真实服务器。" },
          { t: "p", text: "WSL 是 Windows 自带的功能，不需要下载镜像。在 PowerShell 里执行一条安装命令，重启后开始菜单里就多出一个 Ubuntu。它和 Windows 共用文件系统与网络，启动只要几秒，适合只想练命令的人。两种方式装出来的都是真 Linux 内核，命令行的行为一致。" },
          { t: "p", text: "安装过程中会让你设用户名和密码。这个密码是提权时用的，输入时屏幕上一个字符都不显示，不是键盘坏了。用户名建议全小写、不带空格，后面写路径能省很多事。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "随时开一个终端练命令，练坏了删掉重装。",
            "在 Windows 或 macOS 上跑只在 Linux 上编译的工具。",
            "模拟一台服务器，练习部署和排错，不用担心弄坏主机。"
          ]},
          { t: "h2", text: "演示：装好并验证" },
          { t: "p", text: "先装 WSL。下面两行在 Windows 的 PowerShell 里执行，需要以超级用户身份打开。第一条下载并启用 Ubuntu，第二条把默认版本设为 2。装完重启，从开始菜单打开 Ubuntu，按提示设用户名和密码。" },
          { t: "code", lang: "bash", code: "# Windows PowerShell，需以超级用户身份运行\nwsl --install -d Ubuntu\nwsl --set-default-version 2" },
          { t: "p", text: "进入 Ubuntu 终端后先刷新软件源，补上 lsb-release 这个小包，再用两条命令分别查内核与发行版。看到数字和名称，说明这套环境可用。" },
          { t: "code", lang: "bash", code: "sudo apt update\nsudo apt install -y lsb-release\nuname -r\nlsb_release -a" },
          { t: "p", text: "apt update 只刷新索引，不升级任何软件；install 的 -y 表示不再逐条确认。lsb_release -a 会打印发行版名称、版本号和代号，例如 Ubuntu 24.04.1 LTS。虚拟机里的验证步骤完全相同，只是打开终端的入口不同。" },
          { t: "svg", code: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260"><title>两条安装路径汇到同一个终端</title><rect x="30" y="26" width="580" height="208" rx="14" fill="#eef3fa"/><rect x="50" y="64" width="190" height="64" rx="10" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="145" y="90" font-size="16" text-anchor="middle" fill="#17324d">虚拟机</text><text x="145" y="113" font-size="14" text-anchor="middle" fill="#4d6480">VirtualBox + ISO</text><rect x="50" y="164" width="190" height="64" rx="10" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="145" y="190" font-size="16" text-anchor="middle" fill="#17324d">WSL</text><text x="145" y="213" font-size="14" text-anchor="middle" fill="#4d6480">wsl --install</text><rect x="282" y="96" width="150" height="96" rx="12" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="357" y="126" font-size="16" text-anchor="middle" fill="#17324d">Linux 终端</text><text x="357" y="150" font-size="14" text-anchor="middle" fill="#4d6480">bash 提示符</text><text x="357" y="172" font-size="14" text-anchor="middle" fill="#4d6480">同一个内核</text><rect x="480" y="110" width="120" height="68" rx="10" fill="#d9e6f7" stroke="#1f4f86" stroke-width="2"/><text x="540" y="138" font-size="15" text-anchor="middle" fill="#17324d">uname -r</text><text x="540" y="161" font-size="14" text-anchor="middle" fill="#17324d">看到版本</text><path d="M240 96H262V120H278" stroke="#3568a8" stroke-width="2.5"/><polygon points="278,120 268,114 268,126" fill="#3568a8"/><path d="M240 196H262V168H278" stroke="#3568a8" stroke-width="2.5"/><polygon points="278,168 268,162 268,174" fill="#3568a8"/><path d="M432 144H472" stroke="#3568a8" stroke-width="2.5"/><polygon points="472,144 462,138 462,150" fill="#3568a8"/></svg>', caption: "不管走哪条路，判据都是终端里能执行版本命令。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "虚拟机内存给太少。带图形界面至少 4 GB，纯命令行 2 GB 起步。",
            "在 WSL 里用 Windows 的路径写法。Linux 里 C 盘是 /mnt/c，分隔符是斜杠。",
            "装完忘了密码。WSL 可以用 wsl -u root 进去重置，虚拟机可以进恢复模式。",
            "以为终端就是桌面里那个黑框。终端只是运行 shell 的窗口，换个 SSH 客户端一样能用。",
            "在共享目录里直接跑编译。跨文件系统读写慢，项目放 Linux 自己的家目录里。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 WSL 或虚拟机装好一套 Linux，打开终端。",
            "跑 uname -r 和 lsb_release -a，把两行输出抄下来。",
            "建一个快照或写下重装步骤，确保能恢复到干净状态。"
          ]},
          { t: "tip", color: "green", text: "一句话：先用虚拟机或 WSL 得到一台能用的 Linux，验证标准是终端里查得出内核版本和发行版名称。" }
        ]
      },
      {
        id: "lx03",
        title: "第 3 课 · 第一个命令：pwd、ls、cd",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：在终端里站稳：知道自己在哪个目录，看到目录里有什么，并且能走过去。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "终端打开时，shell 已经站在某个目录里，这个目录叫当前工作目录。所有相对路径都以它为起点。提示符里的波浪号表示当前用户的家目录，普通用户通常是 /home/用户名，root 是 /root。家目录和根目录是两个不同的地方，混了会找不到文件。" },
          { t: "p", text: "pwd 打印当前工作目录的绝对路径，从根目录 / 开始一路写下来。绝对路径永远以 / 开头，和你在哪里无关；相对路径不以 / 开头，含义取决于当前站在哪。同一个名字，换一个目录进去就可能指向别处。" },
          { t: "p", text: "ls 列出目录内容，默认只显示名字，不显示以点开头的隐藏文件。cd 切换目录：cd /var/log 走绝对路径，cd .. 回上一级，cd ~ 回家目录，cd - 回到上一次待过的目录并把那个路径打印出来。" },
          { t: "p", text: "三条命令合起来，回答的是「我在哪、这里有什么、我要去哪」。命令行里的大部分麻烦，起因都是站错了目录却以为文件不存在。养成动手前先 pwd 的习惯，能少走很多弯路。切换目录并不神秘，走错了用 cd - 回来，位置随时能查。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "找不到文件时，先确认自己在哪个目录。",
            "看看某个目录里有哪些配置文件。",
            "在很深的目录树里快速上下移动。",
            "把当前路径记下来，待会儿原路返回。"
          ]},
          { t: "h2", text: "演示：走一圈再回来" },
          { t: "p", text: "先看当前位置，列出内容，进入 /etc 看系统配置目录，最后回到原处。每一步都敲 pwd 确认位置，别凭感觉走。" },
          { t: "code", lang: "bash", code: "pwd\nls\ncd /etc\npwd\nls\ncd -\npwd" },
          { t: "p", text: "进入 /etc 后 pwd 输出 /etc，说明位置变了；cd - 回到上一条命令待过的目录，终端会把这个路径打印出来。如果 ls 报 Permission denied，说明那个目录你没有读权限，这是后面单独一课的内容。" },
          { t: "svg", code: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><title>目录树与当前工作目录</title><rect x="30" y="20" width="580" height="252" rx="14" fill="#eef3fa"/><text x="320" y="50" font-size="19" font-weight="700" text-anchor="middle" fill="#17324d">路径从根目录开始逐级向下</text><rect x="278" y="72" width="84" height="40" rx="8" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="320" y="99" font-size="18" text-anchor="middle" fill="#17324d">/</text><line x1="320" y1="112" x2="320" y2="138" stroke="#3568a8" stroke-width="2.5"/><line x1="110" y1="138" x2="530" y2="138" stroke="#3568a8" stroke-width="2.5"/><line x1="110" y1="138" x2="110" y2="152" stroke="#3568a8" stroke-width="2.5"/><line x1="250" y1="138" x2="250" y2="152" stroke="#3568a8" stroke-width="2.5"/><line x1="390" y1="138" x2="390" y2="152" stroke="#3568a8" stroke-width="2.5"/><line x1="530" y1="138" x2="530" y2="152" stroke="#3568a8" stroke-width="2.5"/><rect x="62" y="152" width="96" height="42" rx="8" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="110" y="179" font-size="15" text-anchor="middle" fill="#17324d">/home</text><rect x="202" y="152" width="96" height="42" rx="8" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="250" y="179" font-size="15" text-anchor="middle" fill="#17324d">/etc</text><rect x="342" y="152" width="96" height="42" rx="8" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="390" y="179" font-size="15" text-anchor="middle" fill="#17324d">/var</text><rect x="482" y="152" width="96" height="42" rx="8" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="530" y="179" font-size="15" text-anchor="middle" fill="#17324d">/tmp</text><line x1="110" y1="194" x2="110" y2="218" stroke="#3568a8" stroke-width="2.5"/><rect x="62" y="218" width="96" height="42" rx="8" fill="#d9e6f7" stroke="#1f4f86" stroke-width="3"/><text x="110" y="245" font-size="15" text-anchor="middle" fill="#17324d">user</text><text x="320" y="288" font-size="14" text-anchor="middle" fill="#4d6480">深色方块是 pwd 打印的位置，cd 改变的就是它</text></svg>', caption: "绝对路径从 / 写起，相对路径从当前位置写起。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把波浪号当成根目录。波浪号是家目录，根目录只有一个斜杠。",
            "cd 后面多打空格或中文空格，路径被拆成两段，提示 No such file or directory。",
            "在相对路径里少写一级，结果进错目录。先 pwd 再操作。",
            "ls 看不到隐藏文件就以为文件不存在。以点开头的文件默认不显示，要加 -a。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 pwd 记下终端打开时所在的目录。",
            "从家目录出发，用一条 cd 走到 /var，再用 cd - 回到原处。",
            "在 /etc 里用 ls 数出前五个条目的名字，写下来。"
          ]},
          { t: "tip", color: "green", text: "一句话：pwd 报位置、ls 看内容、cd 换位置，相对路径的含义永远取决于你当前站在哪。" }
        ]
      },
      {
        id: "lx04",
        title: "第 4 课 · 文件和目录：mkdir、cp、mv、rm",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：学会建目录、复制、改名、删除，并且知道删除为什么没有回收站。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "Linux 的文件系统是一棵倒着的树，根是 /，目录可以套目录。mkdir 建目录，加 -p 可以一次建出多级，父目录不存在也不会报错。名字区分大小写，Readme 和 readme 是两个不同的文件，写错一个字母就是另一个路径。" },
          { t: "p", text: "cp 复制，形状是 cp 源 目标，复制目录要加 -r，否则会跳过里面的内容。mv 移动，源和目标在同一目录时就是改名。rm 删除，删目录同样要加 -r。这三条命令加上 mkdir，覆盖了日常整理目录的大部分动作。操作时把路径写全，比凭记忆少写一级安全得多。" },
          { t: "p", text: "这里没有回收站。rm 只是把目录项去掉，文件内容留在磁盘上直到被新数据覆盖，普通用户没有命令能把它们找回来。所以删除前先用 ls 确认路径，破坏性的操作只在练习目录里做。" },
          { t: "p", text: "通配符星号能匹配一批文件，rm 星号.log 会删掉当前目录所有以 .log 结尾的文件。通配符由 shell 先展开，再交给命令，所以敲下去之前先用 ls 加同样的模式看一遍清单，确认匹配到的正是你想删的。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "给一个项目建目录结构：src、docs、tests。",
            "把配置文件复制一份再改，保留原件。",
            "把下载的文件改名成能看懂的名字。",
            "清理练习目录里生成的一批临时文件。"
          ]},
          { t: "h2", text: "演示：在练习目录里走一遍" },
          { t: "p", text: "先建一个练习用的目录，后面所有操作都在里面做。命令按顺序敲，每步用 ls 看一眼结果，别一口气全贴进去。" },
          { t: "code", lang: "bash", code: "mkdir -p ~/lab/notes\ncd ~/lab\nmkdir notes/old\ncp -r notes notes-backup\nmv notes-backup notes-copy\nls\nrm -r notes/old\nls notes" },
          { t: "p", text: "mkdir -p 一次建出 lab 和 notes 两级；cp -r 把整个目录复制成 notes-backup；mv 把它改名成 notes-copy；最后删掉 notes 下的 old。每条命令之后用 ls 验证，出错时能立刻知道是哪一步偏了。" },
          { t: "svg", code: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><title>三条命令对目录的影响</title><rect x="30" y="20" width="580" height="250" rx="14" fill="#eef3fa"/><text x="320" y="50" font-size="19" font-weight="700" text-anchor="middle" fill="#17324d">同一份数据，三种结果</text><text x="52" y="97" font-size="15" fill="#17324d">cp -r</text><rect x="140" y="67" width="110" height="50" rx="8" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="195" y="97" font-size="15" text-anchor="middle" fill="#17324d">notes</text><path d="M254 92H296" stroke="#3568a8" stroke-width="2.5"/><polygon points="296,92 286,86 286,98" fill="#3568a8"/><rect x="304" y="67" width="270" height="50" rx="8" fill="#d9e6f7" stroke="#1f4f86" stroke-width="2"/><text x="439" y="97" font-size="15" text-anchor="middle" fill="#17324d">notes + notes-backup</text><text x="52" y="162" font-size="15" fill="#17324d">mv</text><rect x="140" y="132" width="110" height="50" rx="8" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="195" y="162" font-size="15" text-anchor="middle" fill="#17324d">notes</text><path d="M254 157H296" stroke="#3568a8" stroke-width="2.5"/><polygon points="296,157 286,151 286,163" fill="#3568a8"/><rect x="304" y="132" width="270" height="50" rx="8" fill="#d9e6f7" stroke="#1f4f86" stroke-width="2"/><text x="439" y="162" font-size="15" text-anchor="middle" fill="#17324d">notes-copy（同一份数据）</text><text x="52" y="227" font-size="15" fill="#17324d">rm -r</text><rect x="140" y="197" width="110" height="50" rx="8" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="195" y="227" font-size="15" text-anchor="middle" fill="#17324d">notes</text><path d="M254 222H296" stroke="#3568a8" stroke-width="2.5"/><polygon points="296,222 286,216 286,228" fill="#3568a8"/><rect x="304" y="197" width="270" height="50" rx="8" fill="#ffffff" stroke="#a33a3a" stroke-width="2" stroke-dasharray="6 4"/><text x="439" y="227" font-size="15" text-anchor="middle" fill="#a33a3a">目录项消失，内容找不回来</text><text x="320" y="292" font-size="14" text-anchor="middle" fill="#4d6480">cp 留副本，mv 换名字，rm 只去掉目录项</text></svg>', caption: "复制多一份、改名不动数据、删除不可恢复，三条命令的后果完全不同。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "删除的路径里多一个空格，目标就变成另一个目录。敲之前逐字读一遍。",
            "用 cp 复制目录忘了 -r，只得到报错或一个空目录。",
            "以为 mv 会留下原件。同一文件系统内它只改目录项，跨文件系统才真的先复制再删。",
            "在家目录下随手用通配符删除。先用 ls 加同样的模式看清单。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "在家目录下建三级目录 a/b/c，只用一条命令。",
            "把 a 复制一份，再改名，用 ls 确认两边的结构。",
            "在练习目录里删掉一个子目录，删之前先用 ls 列出它的内容。"
          ]},
          { t: "tip", color: "green", text: "一句话：mkdir 建、cp 复制、mv 改名或搬运、rm 真删且不可恢复，动手前先用 ls 看清路径。" }
        ]
      },
      {
        id: "lx05",
        title: "第 5 课 · 看文件：cat、less、head、tail",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：用四条命令读文本文件，知道大文件该用哪个，日志该盯哪一头。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "cat 把文件内容整段打到终端，适合几十行的小文件。它不负责分页，几百 KB 的文件刷过去就找不到了，只能重跑。cat 也可以一次接多个文件，按顺序拼着输出，常用来快速确认两个文件的内容。" },
          { t: "p", text: "less 是分页阅读器：空格翻一页，b 往回翻，斜杠后跟关键字向下搜，n 跳到下一个匹配，q 退出。它不会把整个文件读进内存，几个 GB 的日志也能打开，是读长文件最稳的选择。" },
          { t: "p", text: "head 默认看前十行，tail 默认看后十行，加 -n 20 可以把行数改成任意值。tail -f 会一直挂在文件末尾，新写入的行立刻打出来，这是看日志最常用的姿势，按 Ctrl+C 退出。" },
          { t: "p", text: "四条命令都只读，不修改文件。读之前先确认路径和文件大小，读的时候注意终端编码：二进制文件被 cat 到终端，可能把提示符弄乱，用 reset 命令可以恢复。" },
          { t: "p", text: "读文件时还要注意权限和编码。没有读权限的文件，cat 会直接报 Permission denied，这不是命令坏了；编码不对的文件，中文会显示成乱码，先确认格式再决定要不要转换。遇到看不懂的输出，先分清是权限问题还是格式问题，再去改命令。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "快速确认一个配置文件里写了什么。",
            "翻一份长文档，边看边搜关键字。",
            "盯住正在写入的日志，复现问题时看实时输出。",
            "只看文件头尾，判断格式和最后几行有没有报错。"
          ]},
          { t: "h2", text: "演示：读同一个文件" },
          { t: "p", text: "用 /etc/os-release 当样本，它在 Ubuntu 和 Debian 上都存在，内容只有十来行。四条命令依次读它，观察输出的差别。less 会占满屏幕，按 q 退出再敲下一条。" },
          { t: "code", lang: "bash", code: "cat /etc/os-release\nhead -n 3 /etc/os-release\ntail -n 3 /etc/os-release\nless /etc/os-release\ntail -f /var/log/syslog" },
          { t: "p", text: "cat 一次输出全部；head 和 tail 各截三行；less 进去后按空格翻、按 q 退出。最后一条盯系统日志，没有新日志时屏幕不动是正常的，按 Ctrl+C 结束。" },
          { t: "svg", code: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><title>四条命令覆盖文件的不同区域</title><rect x="30" y="20" width="580" height="252" rx="14" fill="#eef3fa"/><text x="320" y="50" font-size="19" font-weight="700" text-anchor="middle" fill="#17324d">同一份文件，四条命令读不同的部分</text><text x="44" y="99" font-size="15" fill="#17324d">cat 全读</text><rect x="190" y="82" width="390" height="22" rx="4" fill="#cfe0f4" stroke="#3568a8" stroke-width="2"/><text x="44" y="147" font-size="15" fill="#17324d">less 分页</text><rect x="190" y="130" width="390" height="22" rx="4" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><line x1="320" y1="130" x2="320" y2="152" stroke="#9db8dc" stroke-width="2"/><line x1="450" y1="130" x2="450" y2="152" stroke="#9db8dc" stroke-width="2"/><text x="44" y="195" font-size="15" fill="#17324d">head 前 3 行</text><rect x="190" y="178" width="390" height="22" rx="4" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><rect x="190" y="178" width="130" height="22" rx="4" fill="#cfe0f4" stroke="#1f4f86" stroke-width="2"/><text x="44" y="243" font-size="15" fill="#17324d">tail 后 3 行</text><rect x="190" y="226" width="390" height="22" rx="4" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><rect x="450" y="226" width="130" height="22" rx="4" fill="#cfe0f4" stroke="#1f4f86" stroke-width="2"/><text x="320" y="288" font-size="14" text-anchor="middle" fill="#4d6480">less 只把当前一屏读进内存，所以再大的文件也能开</text></svg>', caption: "小文件用 cat，长文件用 less，只看头尾用 head 和 tail。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "用 cat 打开几百 MB 的日志。终端会卡很久，改用 less。",
            "在 less 里按 Ctrl+C 想退出。退出要按 q，Ctrl+C 只中断当前搜索。",
            "把 tail -f 当成一次性命令。它会一直挂着，看完记得 Ctrl+C。",
            "用 cat 读二进制文件。屏幕上出现乱码，提示符也可能乱掉，用 reset 恢复。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 cat 读完 /etc/os-release，说出它记录了几项信息。",
            "用 less 打开同一个文件，试一次按斜杠搜索和按 q 退出。",
            "用 tail 看一个日志文件的最后五行，再改成实时跟踪，观察有没有新行进来。"
          ]},
          { t: "tip", color: "green", text: "一句话：小文件用 cat，长文件用 less，只看头尾用 head 和 tail，追日志用 tail -f。" }
        ]
      },
      {
        id: "lx06",
        title: "第 6 课 · 权限与用户：chmod、chown、sudo",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：读懂 ls -l 那串字母，知道三种身份和三种权限，会用 chmod 改权限、用 sudo 临时提权。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "每个文件都记着一个属主和一个属组，权限也按这两者分成三组：属主、属组、其他人。ls -l 的第一列有十个字符，第一个是类型，短横是普通文件，d 是目录，后面九个每三位一组，依次读作读、写、执行。" },
          { t: "p", text: "r 是读：对文件是看内容，对目录是列出条目。w 是写：对文件是改内容，对目录是增删里面的文件。x 是执行：对文件是当程序跑，对目录是能进去。三种权限对文件和目录的含义并不一样，这点最容易记混。" },
          { t: "p", text: "数字表示法里 r 记 4、w 记 2、x 记 1，一组三位相加就是一个数字。755 表示属主可读写执行、属组和其他人可读可执行；644 表示属主可读写、其他人只读。写成三个数字，比背九个字母快得多。" },
          { t: "p", text: "chmod 改权限，chown 改属主，两者都只有属主或 root 能做。sudo 让你以 root 身份执行一条命令，密码是你自己的，输入时不显示。日常操作尽量不用 root，需要时加 sudo 做一件事就退出。" },
          { t: "p", text: "还有一个特殊位 s，出现在属主位就是 setuid，程序运行时会临时获得属主的身份，passwd 这类命令靠它工作。入门先不碰它，看到 s 知道有这么回事就行。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "脚本写了却提示 Permission denied，给它加执行权限。",
            "把网站目录的属主改成服务账号，让服务能读写。",
            "装软件、改系统配置时临时提权。",
            "把私钥文件的权限收紧，只让自己能读。"
          ]},
          { t: "h2", text: "演示：看权限再改权限" },
          { t: "p", text: "先在一个练习文件上看清楚三组权限，再用数字法改一次，用符号法改一次。chmod 只改元数据，不影响文件内容。" },
          { t: "code", lang: "bash", code: "cd ~\nmkdir -p perm\ncd perm\ntouch note.txt\nls -l note.txt\nchmod 600 note.txt\nls -l note.txt\nchmod u+x note.txt\nls -l note.txt" },
          { t: "p", text: "第一列从 -rw-r--r-- 变成 -rw-------，再变成 -rwx------。数字法里 6 是读写、0 什么都没有，u+x 给属主补上执行位。x 加在纯文本文件上不会让它变成程序，只是多了一个标记。" },
          { t: "svg", code: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><title>ls -l 第一列的读法</title><rect x="30" y="20" width="580" height="240" rx="14" fill="#eef3fa"/><text x="320" y="52" font-size="19" font-weight="700" text-anchor="middle" fill="#17324d">十个字符分成四段</text><text x="320" y="92" font-size="22" text-anchor="middle" fill="#17324d">- r w x r - x r - -</text><rect x="70" y="112" width="46" height="38" rx="4" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="93" y="138" font-size="15" text-anchor="middle" fill="#17324d">类型</text><rect x="120" y="112" width="146" height="38" rx="4" fill="#d9e6f7" stroke="#1f4f86" stroke-width="2"/><text x="193" y="138" font-size="15" text-anchor="middle" fill="#17324d">属主 rwx</text><rect x="270" y="112" width="146" height="38" rx="4" fill="#cfe0f4" stroke="#1f4f86" stroke-width="2"/><text x="343" y="138" font-size="15" text-anchor="middle" fill="#17324d">属组 r-x</text><rect x="420" y="112" width="146" height="38" rx="4" fill="#b7d2ee" stroke="#1f4f86" stroke-width="2"/><text x="493" y="138" font-size="15" text-anchor="middle" fill="#17324d">其他人 r--</text><text x="320" y="186" font-size="15" text-anchor="middle" fill="#17324d">r 记 4，w 记 2，x 记 1</text><text x="320" y="212" font-size="15" text-anchor="middle" fill="#17324d">属主 7 = 4 + 2 + 1，属组 5 = 4 + 1，其他人 4 = 4</text><text x="320" y="240" font-size="15" text-anchor="middle" fill="#4d6480">于是 754 与 rwxr-xr-- 是同一件事</text></svg>', caption: "先分段再相加，字母和数字可以互相换算。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "给文件 777 图省事。所有人都能改，等于把门拆了，按需给最小权限。",
            "对目录只给 r 不给 x，能列出名字却进不去。",
            "用 chown 改系统文件后忘了改回来，服务起不来。",
            "长期开着 root 终端。手滑一条命令就能毁掉系统，用完立刻退出。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "建一个文件，用 ls -l 读出三组权限，写成 rwx 形式。",
            "用数字法把权限改成 644，再用符号法给属主加执行位。",
            "找一条需要 root 才能执行的命令，用 sudo 跑一次，再不用 sudo 跑一次，对比两次报错。"
          ]},
          { t: "tip", color: "green", text: "一句话：权限是三组身份乘三种动作，chmod 改权限、chown 改属主、sudo 临时借 root 身份。" }
        ]
      },
      {
        id: "lx07",
        title: "第 7 课 · 进程：ps、top、kill",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：看清系统里在跑什么，找到一个进程的编号，并安全地结束它。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "进程是正在运行的程序实例。同一个程序可以开好几个进程，各自有独立的内存。每个进程有一个 PID，从 1 开始编号，1 号通常是 init 或 systemd，它是所有进程的祖先，结束它等于关机。" },
          { t: "p", text: "ps 拍一张快照。ps aux 列出所有用户的进程，列里有属主、PID、CPU 占用、内存占用和启动命令。top 是动态的，默认每三秒刷新一次，按 q 退出；它顶部的负载和内存概览，往往比单个进程更有信息量。" },
          { t: "p", text: "kill 不是拿刀去砍，它是给进程发信号。默认发 TERM，意思是请你退出，进程可以先保存数据再结束；加 -9 发 KILL，进程没法拦截，立刻消失。先 TERM，等几秒还在，再 KILL，这个顺序能保住数据。" },
          { t: "p", text: "命令末尾加 & 让它进后台，jobs 列出当前 shell 的后台任务，fg 把最近一个拉回前台。挂住的进程不等于死了，用 ps 或 pgrep 还能找到它，关掉终端也不一定能让它停。" },
          { t: "p", text: "还有一个容易忽略的点：PID 会被回收再分配。今天 12345 是你的测试脚本，明天可能变成别的服务。所以结束进程前不要凭记忆填编号，用 ps 或 pgrep 现查一次，看清楚命令行再动手。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "服务没响应时，找到它的 PID 再决定怎么处理。",
            "看哪个进程在吃 CPU，判断是代码问题还是负载问题。",
            "关掉自己开多了的测试进程，把端口释放出来。",
            "确认后台任务还在不在，决定要不要重新启动。"
          ]},
          { t: "h2", text: "演示：找到并结束一个进程" },
          { t: "p", text: "先开一个会一直跑的命令，让它进后台；再按名字找到它，最后用 kill 结束。整个过程只动自己开的进程，编号以你的输出为准。" },
          { t: "code", lang: "bash", code: "sleep 300 &\njobs\npgrep -a sleep\nkill 12345\npgrep -a sleep" },
          { t: "p", text: "jobs 显示后台任务，pgrep -a 打印匹配的 PID 和完整命令行。把上一条输出里的编号填进 kill，再查一次，列表为空就说明结束了。如果进程还在，用 kill -9 加同一个编号再来一次。" },
          { t: "svg", code: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><title>kill 发信号的两个阶段</title><rect x="30" y="20" width="580" height="240" rx="14" fill="#eef3fa"/><text x="320" y="50" font-size="19" font-weight="700" text-anchor="middle" fill="#17324d">kill 发的是信号，不是刀</text><rect x="44" y="106" width="130" height="54" rx="8" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="109" y="139" font-size="15" text-anchor="middle" fill="#17324d">kill 12345</text><path d="M178 133H210" stroke="#3568a8" stroke-width="2.5"/><polygon points="210,133 200,127 200,139" fill="#3568a8"/><rect x="218" y="86" width="150" height="94" rx="8" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="293" y="114" font-size="15" text-anchor="middle" fill="#17324d">默认 TERM</text><text x="293" y="138" font-size="14" text-anchor="middle" fill="#4d6480">允许先保存</text><text x="293" y="164" font-size="15" text-anchor="middle" fill="#a33a3a">-9 才是 KILL</text><path d="M372 112H406" stroke="#3568a8" stroke-width="2.5"/><polygon points="406,112 396,106 396,118" fill="#3568a8"/><path d="M372 156H406" stroke="#a33a3a" stroke-width="2.5"/><polygon points="406,156 396,150 396,162" fill="#a33a3a"/><rect x="414" y="82" width="180" height="60" rx="8" fill="#d9e6f7" stroke="#1f4f86" stroke-width="2"/><text x="504" y="107" font-size="15" text-anchor="middle" fill="#17324d">进程收到 TERM</text><text x="504" y="130" font-size="14" text-anchor="middle" fill="#17324d">清理现场再退出</text><rect x="414" y="156" width="180" height="60" rx="8" fill="#f7e2e2" stroke="#a33a3a" stroke-width="2"/><text x="504" y="181" font-size="15" text-anchor="middle" fill="#a33a3a">进程收到 KILL</text><text x="504" y="204" font-size="14" text-anchor="middle" fill="#a33a3a">内核直接回收</text><text x="320" y="246" font-size="14" text-anchor="middle" fill="#4d6480">先礼后兵：等几秒还在，再升级到 KILL</text></svg>', caption: "TERM 是商量，KILL 是强制执行；能商量就别强来。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "一上来就 kill -9。进程来不及写盘，数据可能损坏。",
            "杀错 PID。编号会被复用，动手前用 ps 再确认一次命令行。",
            "想结束任务却直接关终端。窗口关了进程可能还在跑，用 jobs 或 pgrep 确认。",
            "把 top 里的 CPU 百分比当成核数占比。它是单核百分比，超过 100 说明用了多核。",
            "对 1 号进程动手。它是所有进程的祖先，结束它系统就重启或宕机。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 ps aux 找出占用内存最多的一行，抄下 PID 和命令。",
            "开一个 sleep 300 放后台，用 jobs 和 pgrep 各找一次。",
            "用 kill 结束它，再用 ps 确认它不在了。"
          ]},
          { t: "tip", color: "green", text: "一句话：ps 看快照、top 看变化、kill 发信号，先 TERM 后 KILL，动手前核对 PID。" }
        ]
      },
      {
        id: "lx08",
        title: "第 8 课 · 软件包：apt / dnf 装东西",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：知道软件包从哪来，会用包工具搜索、安装、升级、卸载，并看懂依赖提示。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "Linux 发行版把软件打成包，每个包记录自己的版本、依赖和安装脚本。包工具从一个或多个软件源下载这些包，同时把缺的依赖一并装上。Debian 系用 apt，包格式是 .deb；Fedora 系用 dnf，包格式是 .rpm。" },
          { t: "p", text: "apt 背后有一份本地索引，记录仓库里所有包的名称和版本。apt update 刷新这份索引，不升级任何软件；apt upgrade 才真正按索引升级已装的包。两步分开，是为了让你看清会动哪些东西。索引过期时，search 连包都找不到，看起来像软件不存在。" },
          { t: "p", text: "安装用 apt install，卸载用 apt remove，连配置文件一起清掉用 apt purge。apt search 按关键字找包，apt show 看版本、大小和依赖。dnf 的命令几乎一一对应：install、remove、search、info。" },
          { t: "p", text: "装完的程序落在 /usr/bin 或 /usr/local/bin，这些目录在 PATH 里，所以直接敲名字就能用。哪个包提供了某个命令，可以用 dpkg -S 反查；dnf 那边用 provides。找不到命令时先确认包装没装，再确认 PATH。" },
          { t: "p", text: "安全更新装完不一定立刻生效。内核升级要重启，服务升级要重新加载，apt 会在结尾提示哪些服务需要重启。看到提示别急着关终端，读完再决定。升级前先看一遍待升级清单，遇到不认识的包名先查清楚，别整机一把梭。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "装一个编译器、数据库或命令行工具。",
            "把系统里的安全更新补上。",
            "卸载不再用的服务，腾出磁盘和端口。",
            "查一个命令属于哪个包，确认它从哪来。"
          ]},
          { t: "h2", text: "演示：装一个工具再卸掉" },
          { t: "p", text: "用 htop 当例子，它是个更友好的进程查看器。先刷新索引，再搜索确认包名，安装后运行一次，最后卸掉。整组命令都在练习环境里跑。" },
          { t: "code", lang: "bash", code: "sudo apt update\napt search htop\nsudo apt install -y htop\nhtop\nsudo apt remove -y htop" },
          { t: "p", text: "apt search 会列出名字或描述里带 htop 的包；install 的 -y 表示不再逐条问是否继续。htop 里按 q 退出。remove 只删程序，配置目录可能留着，purge 才会一起清掉。Fedora 上把 apt 换成 dnf，子命令用法一样。" },
          { t: "svg", code: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260"><title>软件包从仓库到命令</title><rect x="16" y="20" width="608" height="216" rx="14" fill="#eef3fa"/><text x="320" y="50" font-size="19" font-weight="700" text-anchor="middle" fill="#17324d">装一个包要经过四步</text><rect x="28" y="92" width="120" height="76" rx="8" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="88" y="120" font-size="15" text-anchor="middle" fill="#17324d">软件源</text><text x="88" y="144" font-size="14" text-anchor="middle" fill="#4d6480">deb 包</text><rect x="180" y="92" width="120" height="76" rx="8" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="240" y="120" font-size="15" text-anchor="middle" fill="#17324d">apt update</text><text x="240" y="144" font-size="14" text-anchor="middle" fill="#4d6480">刷新索引</text><rect x="332" y="92" width="120" height="76" rx="8" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="392" y="120" font-size="15" text-anchor="middle" fill="#17324d">apt install</text><text x="392" y="144" font-size="14" text-anchor="middle" fill="#4d6480">解依赖</text><rect x="484" y="92" width="120" height="76" rx="8" fill="#d9e6f7" stroke="#1f4f86" stroke-width="2"/><text x="544" y="120" font-size="15" text-anchor="middle" fill="#17324d">/usr/bin</text><text x="544" y="144" font-size="14" text-anchor="middle" fill="#17324d">命令可用</text><path d="M152 130H176" stroke="#3568a8" stroke-width="2.5"/><polygon points="176,130 166,124 166,136" fill="#3568a8"/><path d="M304 130H328" stroke="#3568a8" stroke-width="2.5"/><polygon points="328,130 318,124 318,136" fill="#3568a8"/><path d="M456 130H480" stroke="#3568a8" stroke-width="2.5"/><polygon points="480,130 470,124 470,136" fill="#3568a8"/><text x="320" y="204" font-size="14" text-anchor="middle" fill="#4d6480">本地索引就是仓库的清单，install 按清单取包</text></svg>', caption: "update 只同步清单，install 才真正下载和解包。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "只跑 install 不跑 update，装到的是索引里的旧版本。",
            "在系统里混用两个发行版的包，依赖立刻打架。",
            "用 root 直接运行来源不明的安装脚本，等于把整台机器交出去。",
            "升级时中途按 Ctrl+C，包处于半装状态，要用 dpkg --configure -a 收尾。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 apt search 找一个你没装过的工具，记下包名和版本。",
            "装一个命令行小工具，跑一次，再用 remove 卸掉。",
            "用 apt show 看它的依赖有几项，写下来。"
          ]},
          { t: "tip", color: "green", text: "一句话：包工具从软件源取包并解决依赖，先 update 再 install，卸载用 remove，清配置用 purge。" }
        ]
      },
      {
        id: "lx09",
        title: "第 9 课 · 管道与重定向：竖线、大于号、双大于号",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：把命令的输出接到另一个命令，或者写进文件，理解标准输入输出这三条通道。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "每个进程默认开着三条通道：标准输入 0、标准输出 1、标准错误 2。屏幕是前两条的默认终点，键盘是输入源。重定向就是临时改这些通道的去向，命令本身完全不知道发生了什么。" },
          { t: "p", text: "大于号把标准输出写进文件，文件原来有内容会被清空；双大于号追加到末尾，不清空。2> 只把错误写进文件，&> 把输出和错误一起写进去。写文件时 shell 先建文件再执行命令，所以命令失败时文件也会被清空。" },
          { t: "p", text: "竖线把左边命令的标准输出接到右边命令的标准输入。左边还在跑，右边就开始读，两边同时工作，数据不落盘。管道可以接很多段，但每段只做一件事，读起来才清楚。" },
          { t: "p", text: "/dev/null 是一个黑洞文件，写进去的东西直接丢掉，常用来屏蔽不关心的输出。输入方向用小于号，把文件内容喂给命令的标准输入。两头都能改，重定向才算完整。" },
          { t: "p", text: "退出状态是另一条线索：命令成功返回 0，失败返回非 0，问号变量能看到上一条命令的结果。重定向只搬输出，不改退出状态，所以脚本里判断成败要看退出码，不能看屏幕上有没有字。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "把命令结果存成文件，留作记录。",
            "把报错单独收集起来，方便排查。",
            "把一条命令的输出交给下一条命令继续筛选。",
            "丢掉不需要看的输出，只保留关键几行。"
          ]},
          { t: "h2", text: "演示：把输出接起来" },
          { t: "p", text: "先生成一个文件，再追加内容，最后把输出交给另一条命令筛选。每一步都用 cat 或 head 验证结果，别只看命令有没有报错。" },
          { t: "code", lang: "bash", code: "cd ~/lab\nls /etc > etc-list.txt\nls /usr >> etc-list.txt\ncat etc-list.txt | head -n 5\nls /no-such-dir 2> err.txt\ncat err.txt\nls /etc > /dev/null" },
          { t: "p", text: "第一条把 /etc 的条目写进文件，第二条追加 /usr 的条目，所以文件里有两段。cat 接 head 只留前五行。不存在的目录会把错误写进 err.txt，屏幕上看不到红字。最后一条把输出丢进黑洞，屏幕干净，但退出码仍然记录成功与否。" },
          { t: "svg", code: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><title>三条通道与重定向</title><rect x="20" y="20" width="600" height="256" rx="14" fill="#eef3fa"/><text x="320" y="50" font-size="19" font-weight="700" text-anchor="middle" fill="#17324d">进程的三条通道，各改各的去向</text><rect x="36" y="96" width="120" height="56" rx="8" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="96" y="129" font-size="15" text-anchor="middle" fill="#17324d">键盘</text><rect x="200" y="74" width="150" height="120" rx="10" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="275" y="126" font-size="16" text-anchor="middle" fill="#17324d">命令</text><text x="275" y="152" font-size="14" text-anchor="middle" fill="#4d6480">运行中的进程</text><rect x="420" y="62" width="160" height="52" rx="8" fill="#d9e6f7" stroke="#1f4f86" stroke-width="2"/><text x="500" y="94" font-size="15" text-anchor="middle" fill="#17324d">终端屏幕</text><rect x="420" y="176" width="160" height="52" rx="8" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="500" y="208" font-size="15" text-anchor="middle" fill="#17324d">文件</text><path d="M160 124H180V112H196" stroke="#3568a8" stroke-width="2.5"/><polygon points="196,112 186,106 186,118" fill="#3568a8"/><text x="172" y="102" font-size="14" text-anchor="middle" fill="#4d6480">0</text><path d="M354 104H386V88H416" stroke="#3568a8" stroke-width="2.5"/><polygon points="416,88 406,82 406,94" fill="#3568a8"/><text x="386" y="80" font-size="14" text-anchor="middle" fill="#17324d">1</text><path d="M354 166H386V202H416" stroke="#3568a8" stroke-width="2.5"/><polygon points="416,202 406,196 406,208" fill="#3568a8"/><text x="386" y="192" font-size="14" text-anchor="middle" fill="#17324d">2</text><text x="320" y="264" font-size="14" text-anchor="middle" fill="#4d6480">大于号改 1 的去向，2 大于号改错误，竖线把 1 接到下一站</text></svg>', caption: "三条通道互不干扰，重定向只改去向，不改变命令的逻辑。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把双大于号写成单个，第二次执行把上一次的结果清空。",
            "以为合并错误写在命令前面也一样。顺序有意义，写错位置会指向另一个目标。",
            "管道左边的命令失败，右边照样收到空输入，看起来一切正常。",
            "重定向到正在读的同一个文件，文件先被清空，内容全丢。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "把 ls /etc 的结果写进一个文件，再用双大于号追加一次 ls /usr。",
            "用管道把上面文件的内容只留前三行。",
            "故意访问一个不存在的目录，把错误单独存进文件，再读出来。"
          ]},
          { t: "tip", color: "green", text: "一句话：大于号改写去向、双大于号追加，竖线把左边输出接到右边输入，三条通道各管各的。" }
        ]
      },
      {
        id: "lx10",
        title: "第 10 课 · 文本处理：grep、wc、sort",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：从一堆文本里挑出想要的行、数出数量、排好顺序。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "grep 按行匹配：给它一个模式，它把包含这个模式的行打出来，默认区分大小写，加 -i 忽略大小写。grep -v 反过来，输出不匹配的行。grep -n 在行首标上行号，grep -r 递归搜目录。" },
          { t: "p", text: "模式默认是基本正则：点号匹配任意一个字符，星号表示前一个字符重复零次或多次，方括号是字符集合。入门先只用普通字符串，需要时再加 -E 用扩展正则，不要一上来写复杂表达式。" },
          { t: "p", text: "wc 数行数、单词数、字节数，-l 只数行。sort 按字典序排，-n 按数值排，-r 倒序，-u 去掉重复行。sort 默认按整行比较，不是按某一列，要按列排得先用 -t 指定分隔符，用 -k 指定列。" },
          { t: "p", text: "这三个命令最常见的用法是接在管道后面：先筛出关心的行，再数数量，再排序。顺序换一下结果就不一样，先想清楚要哪一步在前。比如先去重再计数，和先计数再去重，得到的数字不同。" },
          { t: "p", text: "还有一点：grep 默认把文件名也印出来，只在单文件搜索时可以不管；多个文件一起搜时，输出会变成文件名加冒号再加内容，管道下游拿到的样子也跟着变。看不明白输出格式时，先数一下给了几个文件。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "在日志里找某个错误码出现的位置。",
            "数一个文件有多少行有效配置。",
            "把一份名单按字母或数值排好。",
            "去掉重复的行，得到一份干净清单。"
          ]},
          { t: "h2", text: "演示：筛、数、排" },
          { t: "p", text: "用 /etc/passwd 当样本，它每行一个用户，字段用冒号隔开。先找包含 root 的行，再数总数，最后按用户编号排序。" },
          { t: "code", lang: "bash", code: "grep -n root /etc/passwd\ngrep /bin/bash /etc/passwd | wc -l\nwc -l /etc/passwd\nsort /etc/passwd | head -n 5\nsort -t: -k3 -n /etc/passwd | head -n 5" },
          { t: "p", text: "第一条带行号地打出含 root 的行；第二条用管道数出用 bash 的用户数；第三条数整个文件的行数；最后两条分别按整行和按第三列数值排序，各取前五行。字段分隔符用 -t 指定，-k 指定按第几列排。" },
          { t: "svg", code: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260"><title>管道把三个命令接成流水线</title><rect x="20" y="20" width="600" height="212" rx="14" fill="#eef3fa"/><text x="320" y="50" font-size="19" font-weight="700" text-anchor="middle" fill="#17324d">管道是一步一步缩小的数据流</text><rect x="28" y="80" width="130" height="70" rx="8" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="93" y="108" font-size="15" text-anchor="middle" fill="#17324d">passwd</text><text x="93" y="132" font-size="14" text-anchor="middle" fill="#4d6480">2000 行</text><rect x="182" y="80" width="130" height="70" rx="8" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="247" y="108" font-size="15" text-anchor="middle" fill="#17324d">grep root</text><text x="247" y="132" font-size="14" text-anchor="middle" fill="#4d6480">37 行</text><rect x="336" y="80" width="130" height="70" rx="8" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="401" y="108" font-size="15" text-anchor="middle" fill="#17324d">sort</text><text x="401" y="132" font-size="14" text-anchor="middle" fill="#4d6480">37 行</text><rect x="490" y="80" width="130" height="70" rx="8" fill="#d9e6f7" stroke="#1f4f86" stroke-width="2"/><text x="555" y="108" font-size="15" text-anchor="middle" fill="#17324d">wc -l</text><text x="555" y="132" font-size="14" text-anchor="middle" fill="#17324d">37</text><path d="M162 115H178" stroke="#3568a8" stroke-width="2.5"/><polygon points="178,115 168,109 168,121" fill="#3568a8"/><path d="M316 115H332" stroke="#3568a8" stroke-width="2.5"/><polygon points="332,115 322,109 322,121" fill="#3568a8"/><path d="M470 115H486" stroke="#3568a8" stroke-width="2.5"/><polygon points="486,115 476,109 476,121" fill="#3568a8"/><text x="320" y="192" font-size="14" text-anchor="middle" fill="#4d6480">每一步只做一件事，出问题时容易定位在哪个环节</text></svg>', caption: "每一段只接收上一段的输出，行数一路缩小到最后的数字。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把 grep 当全文搜索，忘了它按行工作，一行里出现多次也只输出一次。",
            "文件名带空格时没加引号，grep 把它当成两个文件。",
            "用 sort -n 排带单位的数，它只认开头的数字，结果顺序不对。",
            "模式里写了正则特殊字符却想按字面匹配，要用 -F 关掉正则。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "在 /etc/passwd 里找出所有包含 home 的行，带行号。",
            "数出这个文件里不包含 nologin 的行数。",
            "按第三列数值排序，取前三条，写下令牌号最小的三个用户。"
          ]},
          { t: "tip", color: "green", text: "一句话：grep 挑行、wc 数数、sort 排队，接成管道就是一条最小的文本处理流水线。" }
        ]
      },
      {
        id: "lx11",
        title: "第 11 课 · 网络：ip、ping、curl、ssh",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：查本机地址、判断连通性、发一个 HTTP 请求、登一台远程机器。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "ip addr 列出所有网卡和地址。lo 是本机回环，固定 127.0.0.1；eth0 或 ens33 是对外网卡，inet 后面就是 IPv4 地址。ip route 看默认网关，出网的第一跳写在那里。网卡名字在不同发行版里不一样，看到陌生名字先用 ip addr 认一遍。" },
          { t: "p", text: "ping 发 ICMP 包测往返时间。能通说明路由可达，不通不一定是对方关机，很多服务器禁了 ICMP。加 -c 4 只发四个包，不然它会一直发，得按 Ctrl+C 停。丢包率比单次延迟更能说明问题，四个包全丢和偶发丢一个，处理方式不同。" },
          { t: "p", text: "curl 是命令行 HTTP 客户端，默认把响应正文打到屏幕。curl -I 只看响应头，-o 存成文件，-L 跟随跳转。它不解析页面，拿到的就是原始文本，所以特别适合在服务器上查接口。" },
          { t: "p", text: "ssh 用加密连接登到远程机器，形状是 ssh 用户名@主机。第一次连接会提示确认主机指纹，输入 yes 记下来。密钥登录比密码更安全：ssh-keygen 生成一对密钥，再把公钥放到对方机器上。" },
          { t: "p", text: "端口是另一层信息。地址相同、端口不同，可能是完全不同的服务。curl 默认连 80 和 443，ssh 默认连 22；连不上时先分清楚是地址错了、端口没开，还是中间有防火墙。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "确认这台机器有没有网、网关通不通。",
            "在服务器上直接调接口，排查返回码。",
            "登到远程机器改配置、看日志。",
            "把远端文件取回来，或者把本机文件送出去。"
          ]},
          { t: "h2", text: "演示：从本机查到远端" },
          { t: "p", text: "先看地址和路由，再测连通，然后请求一个网页，最后尝试登录。用户名和地址换成你自己的，没有远程机器就跳过最后一条。" },
          { t: "code", lang: "bash", code: "ip addr show\nip route\nping -c 4 127.0.0.1\ncurl -I https://example.com\ncurl -o page.html https://example.com\nssh 用户名@192.168.1.10" },
          { t: "p", text: "前两条确认地址和出口，ping 回环永远通，可以用它确认本机协议栈正常。curl -I 只拿响应头，状态行 200 表示成功；-o 把正文存成文件。ssh 第一次会问指纹，输入 yes 后按提示输密码。" },
          { t: "svg", code: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><title>本机到远端的两种连接</title><rect x="20" y="20" width="600" height="240" rx="14" fill="#eef3fa"/><text x="320" y="50" font-size="19" font-weight="700" text-anchor="middle" fill="#17324d">出网走网关，登录走加密通道</text><rect x="30" y="76" width="150" height="60" rx="8" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="105" y="101" font-size="15" text-anchor="middle" fill="#17324d">本机</text><text x="105" y="124" font-size="14" text-anchor="middle" fill="#4d6480">192.168.1.5</text><rect x="245" y="76" width="150" height="60" rx="8" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="320" y="101" font-size="15" text-anchor="middle" fill="#17324d">网关</text><text x="320" y="124" font-size="14" text-anchor="middle" fill="#4d6480">192.168.1.1</text><rect x="460" y="76" width="150" height="60" rx="8" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="535" y="101" font-size="15" text-anchor="middle" fill="#17324d">远端</text><text x="535" y="124" font-size="14" text-anchor="middle" fill="#4d6480">example.com</text><path d="M184 106H241" stroke="#3568a8" stroke-width="2.5"/><polygon points="241,106 231,100 231,112" fill="#3568a8"/><path d="M399 106H456" stroke="#3568a8" stroke-width="2.5"/><polygon points="456,106 446,100 446,112" fill="#3568a8"/><rect x="120" y="182" width="400" height="48" rx="10" fill="#d9e6f7" stroke="#1f4f86" stroke-width="2" stroke-dasharray="7 4"/><text x="320" y="212" font-size="15" text-anchor="middle" fill="#17324d">ssh 加密会话，默认 22 端口</text><path d="M105 136V176H114" stroke="#3568a8" stroke-width="2.5"/><polygon points="122,182 112,176 112,188" fill="#3568a8"/><path d="M520 206H535V140" stroke="#3568a8" stroke-width="2.5"/><polygon points="535,140 529,150 541,150" fill="#3568a8"/><text x="320" y="248" font-size="14" text-anchor="middle" fill="#4d6480">ip route 决定第一跳，ssh 决定用什么身份进去</text></svg>', caption: "ping 只到可达性，curl 才看得到应用层返回了什么。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "ping 不通就断定对方挂了。ICMP 常被防火墙拦掉，改用 curl 或 nc 测端口。",
            "把 127.0.0.1 当成别人的地址。它永远指向本机。",
            "curl 拿到 301 却看不到正文，加 -L 跟随跳转。",
            "ssh 私钥权限给太宽，客户端直接拒用，私钥要 600。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 ip addr 找出本机的 IPv4 地址，说出它挂在哪个网卡上。",
            "用 ping -c 3 测一个公网域名，记下往返时间。",
            "用 curl -I 请求一个网站，抄下状态行和服务器字段。"
          ]},
          { t: "tip", color: "green", text: "一句话：ip 看地址、ping 测通路、curl 发请求、ssh 开加密会话，四件事回答四个不同的问题。" }
        ]
      },
      {
        id: "lx12",
        title: "第 12 课 · shell 脚本入门",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：把几条命令写进一个文件，加上变量和条件，让它能重复执行。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "shell 脚本就是一个装命令的文本文件，第一行写解释器路径，通常是井号加叹号再跟 /bin/bash，这一行叫 shebang。保存后加执行权限就能运行；不写 shebang，就用 bash 文件名显式指定解释器。" },
          { t: "p", text: "变量赋值不加空格：name=world，等号两边有空格会被当成命令。取值用 $name，要拼进字符串就用双引号包起来。位置参数 $1、$2 是运行脚本时跟在后面的值，$# 是参数的个数。" },
          { t: "p", text: "条件用 if 加 test，方括号就是 test 的简写，括号内侧必须留空格。字符串比较用等号，数字比较用 -eq、-lt 这类写法。分支结尾是 fi，循环结尾是 done，这两个词是语法，不能省。" },
          { t: "p", text: "set -e 让脚本遇到失败的命令立刻退出，set -u 让未定义变量直接报错。两个开关写在开头，能挡住大部分跑了一半还在继续的麻烦。脚本里的命令和你手敲的完全一样，先在终端里跑通，再抄进文件。" },
          { t: "p", text: "调试有两个笨办法：bash -x 脚本名 会打印每一条执行的命令和变量值；在关键位置插 echo 也能看到进度。脚本出错时先在最小例子上复现，别在几十行的文件里猜。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "每天定时备份一个目录，按日期命名。",
            "一条命令完成编译、打包、上传三步。",
            "批量改一批文件的名字或权限。"
          ]},
          { t: "h2", text: "演示：第一个脚本" },
          { t: "p", text: "建一个脚本文件，内容七行：解释器、开关、取参数、输出、条件。保存成 hello.sh，再加执行权限，分别带不同参数运行。" },
          { t: "code", lang: "text", code: "#!/bin/bash\nset -e\nname=$1\necho \"你好，$name\"\nif [ \"$name\" = \"root\" ]; then\n  echo \"这是超级用户\"\nfi" },
          { t: "code", lang: "bash", code: "cd ~/lab\n# 把上面的内容存成 hello.sh\nchmod +x hello.sh\n./hello.sh 小北\n./hello.sh root" },
          { t: "p", text: "chmod 给脚本加上执行位，./ 表示当前目录，因为当前目录通常不在 PATH 里。带小北运行时条件不成立，只打印问候；带 root 运行时多打印一行。方括号里的等号两边各留一个空格，否则脚本会报语法错。" },
          { t: "svg", code: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><title>脚本从上到下执行</title><rect x="20" y="20" width="600" height="240" rx="14" fill="#eef3fa"/><text x="320" y="50" font-size="19" font-weight="700" text-anchor="middle" fill="#17324d">脚本就是从上到下的一条命令链</text><rect x="24" y="96" width="126" height="76" rx="8" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="87" y="124" font-size="15" text-anchor="middle" fill="#17324d">参数 $1</text><text x="87" y="148" font-size="14" text-anchor="middle" fill="#4d6480">传给脚本</text><rect x="168" y="96" width="126" height="76" rx="8" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="231" y="124" font-size="15" text-anchor="middle" fill="#17324d">变量 name</text><text x="231" y="148" font-size="14" text-anchor="middle" fill="#4d6480">等号不加空格</text><rect x="312" y="96" width="126" height="76" rx="8" fill="#ffffff" stroke="#3568a8" stroke-width="2"/><text x="375" y="124" font-size="15" text-anchor="middle" fill="#17324d">条件 [ ]</text><text x="375" y="148" font-size="14" text-anchor="middle" fill="#4d6480">为真才执行</text><rect x="456" y="96" width="126" height="76" rx="8" fill="#d9e6f7" stroke="#1f4f86" stroke-width="2"/><text x="519" y="124" font-size="15" text-anchor="middle" fill="#17324d">echo</text><text x="519" y="148" font-size="14" text-anchor="middle" fill="#17324d">写进终端</text><path d="M154 134H164" stroke="#3568a8" stroke-width="2.5"/><polygon points="164,134 154,128 154,140" fill="#3568a8"/><path d="M298 134H308" stroke="#3568a8" stroke-width="2.5"/><polygon points="308,134 298,128 298,140" fill="#3568a8"/><path d="M442 134H452" stroke="#3568a8" stroke-width="2.5"/><polygon points="452,134 442,128 442,140" fill="#3568a8"/><text x="320" y="206" font-size="14" text-anchor="middle" fill="#4d6480">shebang 指出解释器，chmod +x 给它执行位</text><text x="320" y="232" font-size="14" text-anchor="middle" fill="#4d6480">任何一步失败，set -e 会让整条链立刻停下</text></svg>', caption: "参数进来、变量接住、条件分流、echo 输出，脚本没有额外的魔法。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "变量赋值时在等号两边加空格，shell 把它当成命令名，报 command not found。",
            "忘了 shebang，用 sh 跑 bash 语法，方括号条件直接报错。",
            "方括号里不留空格，被当成一个普通单词，条件永远不成立。",
            "脚本里用相对路径，换一个目录运行就找不到文件，改成基于脚本所在目录的路径。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "写一个脚本，接收一个目录路径，输出这个目录里有多少条目。",
            "给脚本加上判断：参数为空时打印用法并退出。",
            "用 chmod 加执行权限，分别用 ./脚本名 和 bash 脚本名 两种方式运行，观察差别。"
          ]},
          { t: "tip", color: "green", text: "一句话：脚本是带 shebang 的命令清单，变量不加空格、条件用方括号、失败就退出，先在终端跑通再写进文件。" }
        ]
      }
    ]
  }
};
