/* 喵站 · 计算机基础入门（2026-10-27 补全分类；12 课单文件，未拆片）
 * 代码块里的输出都是本机实测：bash / python3 逐段跑过再写。命令随机器不同（lscpu、free、date），正文按站内口径写成「我这块机器给 …，你的会不一样」。
 */
window.MIAO_BASICS = {
  "tutorial": {
    "id": "basics",
    "title": "计算机基础入门",
    "intro": "从「一个开关只有两个状态」走到「按下一次回车发生了什么」：12 课把比特、字节、编码、溢出、门电路、指令周期和内存分层串成一条线，每课都有能当场敲的命令和一张机制图。",
    "cat": "计算机基础",
    "diff": "入门",
    "tags": [
      "计算机基础",
      "二进制",
      "编码",
      "零基础"
    ],
    "author": "喵站官方",
    "cover": "/assets/img/covers/basics.svg",
    "updated": "2026-10-27",
    "chapters": [
      {
        "id": "b01",
        "title": "第 1 课 · 计算机是什么：会算数的开关",
        "blocks": [
          {
            "t": "tip",
            "color": "blue",
            "text": "本课目标：知道计算机从头到尾只做四件事 —— 收进来、留住、对留住的做点、送出去，并且说清这四件事分别由机器的哪一块承担。"
          },
          {
            "t": "h2",
            "text": "原理讲解"
          },
          {
            "t": "p",
            "text": "先把它拆开看。计算机不管长什么样，做的永远是同一套动作：把外面的东西收进来，把东西留住，对留住的东西做点什么，再把结果送出去。收进来是输入，留住是存，做点是算，送出去是输出。你按一下键、屏幕亮一下，都是这四步在排队走一遍。"
          },
          {
            "t": "p",
            "text": "这四件事在机器里各有名字。输入由键盘、触摸板、网卡这类接口承担；存分两层，内存快但断电就没了，硬盘慢但东西留得住；算由 CPU 来干，它里面全是开关，每个开关只有通和断两种状态，没有「大概通」；输出是屏幕、音箱、网卡。你桌上那台机器，说穿了就是这四块，加上把它们连起来的线。"
          },
          {
            "t": "p",
            "text": "这套想法比机器早。1936 年图灵写过一篇论文，里面是一种假想的机器：一条无限长的纸带，一个能读能写还能擦的读写头，一张「读到什么就干什么」的规则表。就这么台假想机器，已经能算所有「能写成步骤」的东西。后来的电子计算机是它的实物版：纸带换成内存，规则表换成程序。"
          },
          {
            "t": "p",
            "text": "真做出来又过了十年。1946 年公开的 ENIAC 用了一万七千多个电子管，重达几十吨，占掉一个房间；它没有「程序存在机器里」这回事，换一种算法要动手重接一整面墙的接线。把程序连同数据一起存进机器这个思路，出自 1945 年冯·诺依曼那份讨论 EDVAC 的报告框架。从那以后，换算法变成换一份存起来的指令，这才是现代计算机的起点。"
          },
          {
            "t": "p",
            "text": "再往后是把自己缩小。1971 年 Intel 4004 把算的那部分整块塞进一颗芯片，上面两千多个晶体管，每秒能做五万次基本运算。今天笔记本里的 CPU 装了几十亿个晶体管，干的还是那四件事。至于两种状态的开关凭什么能算任何东西，这一课先不回答，后面单独一课讲它。"
          },
          {
            "t": "h2",
            "text": "假设它能干什么"
          },
          {
            "t": "p",
            "text": "只要一件事能被写成「每一步都由当前状态决定下一步」，它就能交给这四步反复循环去做。放视频、打字、算弹道、下棋，全都能拆成这样一串。反过来，一件事如果连「输进来的是什么」都说不清，它就不在这台机器的能力圈里。"
          },
          {
            "t": "svg",
            "code": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 250\"><rect x=\"14\" y=\"12\" width=\"612\" height=\"226\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"42\" font-size=\"18\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">四件事是一条线，算完的结果还得回盒子</text><rect x=\"34\" y=\"96\" width=\"124\" height=\"54\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"96\" y=\"120\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">输入</text><text x=\"96\" y=\"140\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">键盘 网卡</text><line x1=\"162\" y1=\"123\" x2=\"186\" y2=\"123\" stroke=\"#2a8c78\" stroke-width=\"3\" fill=\"#2a8c78\"/><polygon points=\"198,123 186,116 186,130\" fill=\"#2a8c78\"/><rect x=\"202\" y=\"96\" width=\"124\" height=\"54\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"264\" y=\"120\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">存</text><text x=\"264\" y=\"140\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">内存 硬盘</text><line x1=\"330\" y1=\"123\" x2=\"354\" y2=\"123\" stroke=\"#2a8c78\" stroke-width=\"3\" fill=\"#2a8c78\"/><polygon points=\"366,123 354,116 354,130\" fill=\"#2a8c78\"/><rect x=\"370\" y=\"96\" width=\"124\" height=\"54\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"432\" y=\"120\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">算</text><text x=\"432\" y=\"140\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">CPU 里的开关</text><line x1=\"498\" y1=\"123\" x2=\"522\" y2=\"123\" stroke=\"#2a8c78\" stroke-width=\"3\" fill=\"#2a8c78\"/><polygon points=\"534,123 522,116 522,130\" fill=\"#2a8c78\"/><rect x=\"538\" y=\"96\" width=\"70\" height=\"54\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"573\" y=\"120\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">输出</text><text x=\"573\" y=\"140\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">屏幕</text><path d=\"M432 154 C432 200 264 200 264 154\" fill=\"#eef6f4\" stroke=\"#c8763a\" stroke-width=\"3\"/><polygon points=\"264,150 258,162 270,162\" fill=\"#c8763a\"/><text x=\"348\" y=\"216\" font-size=\"14\" text-anchor=\"middle\" fill=\"#a05a20\">算出的数先写回盒子，才轮得到下一次算</text></svg>",
            "caption": "盯一件事：算和输出之间没有线，是算完的结果先回到存，下一次才取得走。"
          },
          {
            "t": "h2",
            "text": "常见坑"
          },
          {
            "t": "ul",
            "items": [
              "把计算机理解成「算得快的机器」，然后一头扎进软件名词。这门课倒过来：先看清开关与盒子，再看软件在上面盖了几层。",
              "以为程序和文件是两码事。在这台机器里程序就是存起来的一串数，CPU 一条一条取它，这正是 1945 年那份报告的关键。",
              "以为存只有一种。内存和硬盘差着好几个数量级的速度，断电后还留不留得住也是两种完全不同的活。",
              "觉得两种状态的开关什么也干不了。状态凑得够多，就能给任意有限的东西编号；能编号，就能算。"
            ]
          },
          {
            "t": "h2",
            "text": "任务"
          },
          {
            "t": "ul",
            "items": [
              "写下你早上拿起手机到看完一条消息之间，输入、存、算、输出各经历的一步，并说出那一步由机器的哪一块承担。",
              "数一数你桌上这台机器有几处「存」：哪些断电就没了，哪些不会。",
              "用不超过 20 字的一句话，向没读过这本书的人解释电子管为什么被晶体管顶替。",
              "图灵机里那条纸带，在这台真机器上对应哪一块？说给自己听一遍。"
            ]
          },
          {
            "t": "tip",
            "color": "green",
            "text": "本课一句话：计算机只做四件事 —— 收进来、留住、做点、送出去，其余全是包装。"
          }
        ]
      },
      {
        "id": "b02",
        "title": "第 2 课 · 看清这台机器：把参数抄下来",
        "blocks": [
          {
            "t": "tip",
            "color": "blue",
            "text": "本课目标：在终端里敲六条命令，抄下这台机器的核数、内存、盘和页大小，并把数字对回第 1 课那四件事。"
          },
          {
            "t": "h2",
            "text": "原理讲解"
          },
          {
            "t": "p",
            "text": "第 1 课那台「收进来、留住、做点、送出去」的机器就摆在桌上。抄下来不用拆壳也不用装新东西：Linux 早把机器的自我描述放在 /proc 目录里，lscpu 这类命令只是把它读出来排好版。"
          },
          {
            "t": "p",
            "text": "六条命令各答一个问题：uname -a 答跑的什么内核，lscpu 答几个核，free -h 答还剩多少内存，lsblk 答接了几块盘，df -h 答每段剩多少，getconf PAGE_SIZE 答内存一次发多大。这条别小看，内存不是一字节一字节发给程序的，是一页一页发。"
          },
          {
            "t": "p",
            "text": "抄的时候立一条口径：凡是从这台机器读出来的数，都只属于这台机器。下面每串数字都是我这块机器的样本，你抄你的。"
          },
          {
            "t": "h2",
            "text": "假设它能干什么"
          },
          {
            "t": "p",
            "text": "有了这份清单，三个问题当场能答：程序跑不动，是内存不够还是核不够，拿 free -h 的 available 对 lscpu 的核数；拷文件慢，是盘满了还是盘慢，拿 df -h 对 lsblk；能不能再开一个吃六个核的虚拟机，看每个座的核数那一行。"
          },
          {
            "t": "h2",
            "text": "演示：把这台机器的参数抄下来"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "uname -a"
          },
          {
            "t": "p",
            "text": "答这台跑的是什么系统：我这块的内核是 7.0.0-38-generic，输出末尾 x86_64 说明它是 64 位机器。Windows 上没有这条命令：按 Ctrl+Shift+Esc 会打开那个能看 CPU、内存、磁盘的窗口，「性能」那一页就是这台机器的体检单。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "lscpu"
          },
          {
            "t": "p",
            "text": "答几个核：我这块写着 CPU: 12，可这不是一句话 —— 每个座的核数 6、每个核的线程数 2，是六个物理核各拆成两个逻辑 CPU。你抄到的数肯定不一样。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "free -h"
          },
          {
            "t": "p",
            "text": "答还剩多少内存能给：我这块 total 30Gi、available 23Gi，而 free 那一列只有 2.2Gi，差额正被拿去当磁盘缓存，谁要就立刻还。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "lsblk"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "df -h"
          },
          {
            "t": "p",
            "text": "前一条答接了几块盘，后一条答每段还剩多少：我这块的真盘是三块 —— 465.8G 的 sda、117.2G 的 sdc、238.5G 的 nvme0n1，系统装在 nvme0n1 的第二个分区，df -h 里它是 233G、已用 152G 占 69%。前面那一串 loop 不是盘，是 snap 把压缩包假扮成磁盘，先无视。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "getconf PAGE_SIZE"
          },
          {
            "t": "p",
            "text": "答最小搬运格：我这块是 4096，程序找内存要，一次至少给这一格。三条命令报的都是大小，量的却各是各的东西。"
          },
          {
            "t": "svg",
            "code": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 260\"><rect x=\"12\" y=\"10\" width=\"616\" height=\"240\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"38\" font-size=\"18\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">六条命令各查四件事里的一块</text><rect x=\"40\" y=\"58\" width=\"160\" height=\"40\" rx=\"8\" fill=\"#d8efe9\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"120\" y=\"83\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">CPU 管算</text><rect x=\"240\" y=\"58\" width=\"160\" height=\"40\" rx=\"8\" fill=\"#d8efe9\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"320\" y=\"83\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">内存 存得快</text><rect x=\"440\" y=\"58\" width=\"160\" height=\"40\" rx=\"8\" fill=\"#d8efe9\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"520\" y=\"83\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">硬盘 存得住</text><line x1=\"120\" y1=\"98\" x2=\"120\" y2=\"122\" stroke=\"#2a8c78\" stroke-width=\"3\" fill=\"#2a8c78\"/><polygon points=\"120,132 113,120 127,120\" fill=\"#2a8c78\"/><line x1=\"320\" y1=\"98\" x2=\"320\" y2=\"122\" stroke=\"#2a8c78\" stroke-width=\"3\" fill=\"#2a8c78\"/><polygon points=\"320,132 313,120 327,120\" fill=\"#2a8c78\"/><line x1=\"520\" y1=\"98\" x2=\"520\" y2=\"122\" stroke=\"#2a8c78\" stroke-width=\"3\" fill=\"#2a8c78\"/><polygon points=\"520,132 513,120 527,120\" fill=\"#2a8c78\"/><rect x=\"30\" y=\"136\" width=\"180\" height=\"30\" rx=\"6\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"120\" y=\"156\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">lscpu 几个核</text><rect x=\"30\" y=\"174\" width=\"180\" height=\"30\" rx=\"6\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"120\" y=\"194\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">uname -a 什么内核</text><rect x=\"230\" y=\"136\" width=\"180\" height=\"30\" rx=\"6\" fill=\"#ffffff\" stroke=\"#c8763a\" stroke-width=\"2\"/><text x=\"320\" y=\"156\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">free -h 还剩多少</text><rect x=\"230\" y=\"174\" width=\"180\" height=\"30\" rx=\"6\" fill=\"#ffffff\" stroke=\"#c8763a\" stroke-width=\"2\"/><text x=\"320\" y=\"194\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">getconf 一格多大</text><rect x=\"430\" y=\"136\" width=\"180\" height=\"30\" rx=\"6\" fill=\"#ffffff\" stroke=\"#c8763a\" stroke-width=\"2\"/><text x=\"520\" y=\"156\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">lsblk 几块盘</text><rect x=\"430\" y=\"174\" width=\"180\" height=\"30\" rx=\"6\" fill=\"#ffffff\" stroke=\"#c8763a\" stroke-width=\"2\"/><text x=\"520\" y=\"194\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">df -h 各段剩多少</text><text x=\"320\" y=\"232\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">三处都在问多大：一格内存、一块盘、一个分区，量的是三层东西</text></svg>",
            "caption": "每条命令落到四件事里的一块上，读输出前先问它在量哪一块。"
          },
          {
            "t": "h2",
            "text": "常见坑"
          },
          {
            "t": "ul",
            "items": [
              "把 lscpu 的 CPU: 12 当成 12 个核 —— 那是 6 个核各拆两个线程凑的，真算东西的是核。",
              "看 free -h 只读 free 那一列，就认定机器只剩 2.2Gi。缓存占的那部分随时会还。",
              "把 df -h 的已用% 和 lsblk 的 SIZE 当一个数 —— 中间还隔着分区这一层。",
              "照抄我这份数字，或者在 Windows 上敲 PowerShell 然后奇怪为什么没有。"
            ]
          },
          {
            "t": "h2",
            "text": "任务"
          },
          {
            "t": "ul",
            "items": [
              "把六条命令各敲一遍，抄一张只属于你的清单，每行后补一句它答哪个问题。",
              "对着清单回答：这台机器一次能同时真算几件事？提示：看每个座的核数，别看 CPU: 那一行。",
              "在 free -h 里说出 free 和 available 为什么差这么多，提示：看 buff/cache 那一列。",
              "把 getconf PAGE_SIZE 的数乘上 getconf _PHYS_PAGES，看结果对上了 free -h 的哪一列。"
            ]
          },
          {
            "t": "tip",
            "color": "green",
            "text": "本课一句话：这一课之后讲的每个机制，都能在你抄的这六行里找到对应的数字。"
          }
        ]
      },
      {
        "id": "b03",
        "title": "第 3 课 · 第一个转换：把 42 写成二进制",
        "blocks": [
          {
            "t": "tip",
            "color": "blue",
            "text": "本课目标：亲手把 42 写成二进制再用两条不同的路验算，知道这两条路在机器里其实是同一串操作。"
          },
          {
            "t": "h2",
            "text": "原理讲解"
          },
          {
            "t": "p",
            "text": "第 1 课说 CPU 里全是只有两种状态的开关。两种状态怎么表示一个数：给它编号。通记成 1、断记成 0，一位开关只有两个编号；七位排成一排，每位独立取 0 或 1，编号就有 128 个。第 2 课抄到的那些数字，在机器里就是这样一排开关。"
          },
          {
            "t": "p",
            "text": "写法跟你手里的十进制一模一样，只是每满二就进一位。十进制的 1 在十位表示一个十，二进制的最右一位表示一个一，它左边表示二，再左表示四、八、十六。按位权相加，把每位乘上那位的权重再合起来，就能从二进制回到十进制。"
          },
          {
            "t": "p",
            "text": "反过来，把十进制写成二进制，机器里的做法是一串除二取余：42 除二余 0、商 21，21 除二余 1、商 10，一直除到商是 0，把余数倒过来排，就是 101010。另一种省事的说法是凑：从大到小排 32、16、8、4、2、1，凑得上写 1，凑不上写 0。42 凑得上 32 剩 10，凑得上 8 剩 2，凑得上 2 剩 0，同样得到 101010。"
          },
          {
            "t": "h2",
            "text": "假设它能干什么"
          },
          {
            "t": "p",
            "text": "会了这一步，第 1 课那块「算」的牌就不再是比喻：一条指令、一个字符、一个内存地址，本质都是一排 0 和 1。往后看到十六进制、看到「64 位」这种说法，做的都是同一件事 —— 换一种方式数同一批开关。"
          },
          {
            "t": "h2",
            "text": "演示：把 42 写成二进制，再用另一条路验算"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "echo $((2#101010))"
          },
          {
            "t": "p",
            "text": "输出 42。这行里 2# 告诉 bash：后面这串按二进制读；$(( )) 是算式括号，算完交给 echo 打印。整句是「把 101010 按位权加起来给我看」。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "echo $((42))"
          },
          {
            "t": "p",
            "text": "输出还是 42。这条是对照：括号里不写 2# 就按十进制算，证明上一行变出来的 42 不是括号自己改的，是 2# 那一串换的读法。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "command -v bc\necho 'obase=2; 42' | bc"
          },
          {
            "t": "p",
            "text": "第一行输出 /usr/bin/bc，说明这台机器上有 bc；没装的话它什么都不打印，第二行就别跑。第二行输出 101010，obase=2 是让 bc 用二进制把结果报出来，走的是除二取余那条路，跟上面 bash 的按位权相加正好互为反向。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "printf '%x\n' 42"
          },
          {
            "t": "p",
            "text": "输出 2a。这是换到十六进制去数同一批开关，%x 就是「按十六进制打印」，它为什么长这样后面单独一课讲。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "for n in 13 42 255; do\n  printf '%s 的二进制是 %s\n' \"$n\" \"$(echo \"obase=2; $n\" | bc)\"\ndone"
          },
          {
            "t": "p",
            "text": "本机输出三行：13 的二进制是 1101、42 的二进制是 101010、255 的二进制是 11111111。这个 for 循环只是把上一条命令跑了三遍，n 依次取 13、42、255。"
          },
          {
            "t": "svg",
            "code": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 250\"><rect x=\"12\" y=\"10\" width=\"616\" height=\"232\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"36\" font-size=\"18\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">除二取余：商一路变小，余数一路记下</text><rect x=\"30\" y=\"56\" width=\"80\" height=\"40\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"70\" y=\"81\" font-size=\"16\" text-anchor=\"middle\" fill=\"#173d36\">42</text><rect x=\"130\" y=\"56\" width=\"80\" height=\"40\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"170\" y=\"81\" font-size=\"16\" text-anchor=\"middle\" fill=\"#173d36\">21</text><rect x=\"230\" y=\"56\" width=\"80\" height=\"40\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"270\" y=\"81\" font-size=\"16\" text-anchor=\"middle\" fill=\"#173d36\">10</text><rect x=\"330\" y=\"56\" width=\"80\" height=\"40\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"370\" y=\"81\" font-size=\"16\" text-anchor=\"middle\" fill=\"#173d36\">5</text><rect x=\"430\" y=\"56\" width=\"80\" height=\"40\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"470\" y=\"81\" font-size=\"16\" text-anchor=\"middle\" fill=\"#173d36\">2</text><rect x=\"530\" y=\"56\" width=\"80\" height=\"40\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"570\" y=\"81\" font-size=\"16\" text-anchor=\"middle\" fill=\"#173d36\">1</text><line x1=\"112\" y1=\"76\" x2=\"124\" y2=\"76\" stroke=\"#2a8c78\" stroke-width=\"3\" fill=\"#2a8c78\"/><polygon points=\"130,76 120,70 120,82\" fill=\"#2a8c78\"/><line x1=\"212\" y1=\"76\" x2=\"224\" y2=\"76\" stroke=\"#2a8c78\" stroke-width=\"3\" fill=\"#2a8c78\"/><polygon points=\"230,76 220,70 220,82\" fill=\"#2a8c78\"/><line x1=\"312\" y1=\"76\" x2=\"324\" y2=\"76\" stroke=\"#2a8c78\" stroke-width=\"3\" fill=\"#2a8c78\"/><polygon points=\"330,76 320,70 320,82\" fill=\"#2a8c78\"/><line x1=\"412\" y1=\"76\" x2=\"424\" y2=\"76\" stroke=\"#2a8c78\" stroke-width=\"3\" fill=\"#2a8c78\"/><polygon points=\"430,76 420,70 420,82\" fill=\"#2a8c78\"/><line x1=\"512\" y1=\"76\" x2=\"524\" y2=\"76\" stroke=\"#2a8c78\" stroke-width=\"3\" fill=\"#2a8c78\"/><polygon points=\"530,76 520,70 520,82\" fill=\"#2a8c78\"/><text x=\"70\" y=\"122\" font-size=\"15\" text-anchor=\"middle\" fill=\"#a05a20\">余 0</text><text x=\"170\" y=\"122\" font-size=\"15\" text-anchor=\"middle\" fill=\"#a05a20\">余 1</text><text x=\"270\" y=\"122\" font-size=\"15\" text-anchor=\"middle\" fill=\"#a05a20\">余 0</text><text x=\"370\" y=\"122\" font-size=\"15\" text-anchor=\"middle\" fill=\"#a05a20\">余 1</text><text x=\"470\" y=\"122\" font-size=\"15\" text-anchor=\"middle\" fill=\"#a05a20\">余 0</text><text x=\"570\" y=\"122\" font-size=\"15\" text-anchor=\"middle\" fill=\"#a05a20\">余 1</text><text x=\"320\" y=\"156\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">每格是把上面的商再除以 2；最右边的余数是最高那一位</text><rect x=\"232\" y=\"176\" width=\"176\" height=\"38\" rx=\"8\" fill=\"#d8efe9\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"320\" y=\"202\" font-size=\"18\" text-anchor=\"middle\" fill=\"#173d36\">倒着读：101010</text><line x1=\"570\" y1=\"128\" x2=\"570\" y2=\"195\" stroke=\"#c8763a\" stroke-width=\"3\" fill=\"#c8763a\"/><line x1=\"570\" y1=\"195\" x2=\"416\" y2=\"195\" stroke=\"#c8763a\" stroke-width=\"3\" fill=\"#c8763a\"/><polygon points=\"408,195 420,189 420,201\" fill=\"#c8763a\"/></svg>",
            "caption": "上面一排是每次都除二变小的商，下面那排余数从右往左连起来就是答案。"
          },
          {
            "t": "h2",
            "text": "常见坑"
          },
          {
            "t": "ul",
            "items": [
              "把 2# 当成「乘以 2」：它只是声明这串按二进制读，在算是 $(( )) 那对括号。",
              "除二取余正着排。余数要倒过来读，正着排会把 101010 写成 010101。",
              "把 bc 的 obase 写成 base。obase 管输出用几进制，ibase 管输入用几进制，写错就像坏了。",
              "以为转换要靠专门软件。上面几条命令里，bash 自己就能算，bc 只是另一条能验算的路。",
              "凑数从最小的权重开始。要从大到小凑，先拿 32 再拿 8，倒着凑会漏位。"
            ]
          },
          {
            "t": "h2",
            "text": "任务"
          },
          {
            "t": "ul",
            "items": [
              "不用命令，手算 13 写成二进制是什么，再拿 echo $((2#1101)) 验算你算对没有。",
              "手算 42 除二取余的六个余数，把它们和图上那一排对一遍。",
              "把 255 写成二进制，回答：它为什么是八个 1 而不是七个？",
              "用 bc 算 echo 'obase=2; 100' | bc，跟手算的对一下；不一样就找出哪一步开始错。"
            ]
          },
          {
            "t": "tip",
            "color": "green",
            "text": "本课一句话：进制不是另一种数，是同一批开关换一种数法；按位权相加和除二取余是同一条路的两头。"
          }
        ]
      },
      {
        "id": "b04",
        "title": "第 4 课 · 字节：8 个比特捆成一格",
        "blocks": [
          {
            "t": "tip",
            "color": "blue",
            "text": "本课目标：认准 1 字节 = 8 比特、一格能编 0 到 255，说清比特数与状态数的指数关系，并量出本机的字宽。"
          },
          {
            "t": "h2",
            "text": "原理讲解"
          },
          {
            "t": "p",
            "text": "上一课那一排开关，每位是一个比特：只有通或断两种状态。单个比特只能存「是或否」，所以机器把 8 位捆成一格来用，这一格叫字节。1 字节 = 8 比特不是自然规律，是约定：8 位能排出 256 个状态，编号从 0 到 255 —— 0 也占一个编号，所以最大是 255 而不是 256。"
          },
          {
            "t": "p",
            "text": "比特数与状态数是指数关系：每多一位，状态数整体翻倍。8 位 256 个，16 位 65536 个，32 位 4294967296 个。上一课按位权相加时位权就是 1、2、4、8 一路翻倍上来的 —— 位是线性加的，状态是成倍长的。"
          },
          {
            "t": "p",
            "text": "为什么偏偏是 8？1960 年代的机器上，4 位、6 位、9 位一格的都真存在过：IBM 的打包十进制一格只存一个十进制数字，4 位够用；CDC 6600 一格 6 位，正好装一个大写字母。8 位定下来有三股力：ASCII 7 位够编 128 个字符，多一位当奇偶校验；IBM System/360 在 1964 年把 8 位定成最小单位，32 位字正好装 4 个字节，大型机生态照着它铺开；C 语言只规定最小可寻址单元至少 8 位、至少装得下 0 到 255，从没说必须正好 8 位。三条叠起来，8 成了默认的格子。"
          },
          {
            "t": "p",
            "text": "还要分清格子与字：字节是最小可数的格，字是一次搬运的宽度。本机一个字 8 字节，第 2 课量到的一页 4096 字节正好装 512 个字。"
          },
          {
            "t": "h2",
            "text": "假设它能干什么"
          },
          {
            "t": "p",
            "text": "有了字节这把尺，第 3 课那排 0 和 1 就有了盒子，多大装得下、什么时候装不下都能先估出来。"
          },
          {
            "t": "h2",
            "text": "演示：量一量这台机器的格子和字宽"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "getconf PAGE_SIZE\ngetconf LONG_BIT"
          },
          {
            "t": "p",
            "text": "本机两行输出 4096 和 64。前者是内存发给程序的最小一份有多少字节，后者是这台机器上的 long 有多少位：64 位就是 8 字节，答的是「一次搬多宽」。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "python3 -c \"print((255).bit_length(), (256).bit_length())\""
          },
          {
            "t": "p",
            "text": "本机输出 8 9。255 写成二进制是八个 1，刚好装满一格；256 要第九位 —— 一格装得下 256 个编号，装不下 256 这个数。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "python3 -c \"import struct; print(struct.calcsize('P'))\""
          },
          {
            "t": "p",
            "text": "本机输出 8：一个指针 8 字节，跟 LONG_BIT 对得上。地址自己也是个数，也得装进格子；4096 除以 8，一页正好装 512 个字。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "echo $((2 ** 8)) $((2 ** 16)) $((2 ** 32))"
          },
          {
            "t": "p",
            "text": "本机输出 256 65536 4294967296。式子里两个星号是求幂：位数从 8 到 16 只是翻倍，状态数从 256 跳到 65536。"
          },
          {
            "t": "svg",
            "code": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 260\"><rect x=\"12\" y=\"10\" width=\"616\" height=\"240\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"36\" font-size=\"18\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">谁装在谁里面：宽度一圈圈乘上去</text><rect x=\"30\" y=\"56\" width=\"30\" height=\"34\" rx=\"4\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"45\" y=\"78\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">1</text><rect x=\"64\" y=\"56\" width=\"30\" height=\"34\" rx=\"4\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"79\" y=\"78\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">0</text><rect x=\"98\" y=\"56\" width=\"30\" height=\"34\" rx=\"4\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"113\" y=\"78\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">1</text><rect x=\"132\" y=\"56\" width=\"30\" height=\"34\" rx=\"4\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"147\" y=\"78\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">0</text><rect x=\"166\" y=\"56\" width=\"30\" height=\"34\" rx=\"4\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"181\" y=\"78\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">1</text><rect x=\"200\" y=\"56\" width=\"30\" height=\"34\" rx=\"4\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"215\" y=\"78\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">0</text><rect x=\"234\" y=\"56\" width=\"30\" height=\"34\" rx=\"4\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"249\" y=\"78\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">1</text><rect x=\"268\" y=\"56\" width=\"30\" height=\"34\" rx=\"4\" fill=\"#d8efe9\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"283\" y=\"78\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">1</text><text x=\"330\" y=\"66\" font-size=\"15\" text-anchor=\"start\" fill=\"#173d36\">8 个比特 = 1 字节</text><text x=\"330\" y=\"86\" font-size=\"14\" text-anchor=\"start\" fill=\"#4d6f67\">256 个编号：0 到 255</text><rect x=\"30\" y=\"112\" width=\"340\" height=\"34\" rx=\"6\" fill=\"#ffffff\" stroke=\"#c8763a\" stroke-width=\"2\"/><text x=\"200\" y=\"134\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">本机一个字 = 8 字节 = 64 位</text><rect x=\"30\" y=\"166\" width=\"580\" height=\"34\" rx=\"6\" fill=\"#ffffff\" stroke=\"#c8763a\" stroke-width=\"2\"/><text x=\"320\" y=\"188\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">一页 = 4096 字节 = 512 个字</text><text x=\"320\" y=\"230\" font-size=\"14\" text-anchor=\"middle\" fill=\"#a05a20\">宽度是乘上去的，状态数是翻倍长的：8 位 256 个，16 位 65536 个</text></svg>",
            "caption": "字节那一排只有 340 宽，一个字撑到 340、一页撑到 580 —— 每往上一层都在乘 8，而状态数在翻倍。"
          },
          {
            "t": "h2",
            "text": "常见坑"
          },
          {
            "t": "ul",
            "items": [
              "把 1 字节 = 8 位当成自然规律。它是约定，1960 年代 4 位、6 位、9 位的机器都出现过。",
              "把「能装 0 到 255」记成「能装 255 个数」。是 256 个编号，0 也占一格。",
              "把 PAGE_SIZE 和 LONG_BIT 当成一个数：一个量格子多大，一个量一次搬多宽。",
              "以为位数多一点点、容量就多一点点。8 位到 16 位，状态数从 256 跳到 65536。"
            ]
          },
          {
            "t": "h2",
            "text": "任务"
          },
          {
            "t": "ul",
            "items": [
              "本机三个数各是多少：一格多大、一次搬多宽、指针几字节？命令在本课演示里。",
              "手算：如果一格定成 6 位，能编多少个数？比 8 位少多少。",
              "用一句话向没学过编程的人解释「0 到 255 一共 256 个数」，不许出现二进制这个词。",
              "把演示里那条求幂命令的指数从 8 换成 10，看输出是多少，再对一对第 2 课 free -h 里 1KiB 的含义。"
            ]
          },
          {
            "t": "tip",
            "color": "green",
            "text": "本课一句话：字节是约定出来的格子，8 位、256 个状态；位是线性加的，状态是成倍长的。"
          }
        ]
      },
      {
        "id": "b05",
        "title": "第 5 课 · 十六进制：程序员的速记",
        "blocks": [
          {
            "t": "tip",
            "color": "blue",
            "text": "本课目标：知道十六进制为什么正好是二进制的速记，能手把一个字节念成两个符号，并在终端里验证三种写法说的是同一个数。"
          },
          {
            "t": "h2",
            "text": "原理讲解"
          },
          {
            "t": "p",
            "text": "第 3 课把 42 写成 101010，再往下就吃紧了：一个字节要写八位，一个内存地址要写三十二位。人眼数这种串会数错，机器却只认位。中间需要一层速记 —— 把四位打包成一个符号。"
          },
          {
            "t": "p",
            "text": "十六进制的基数是 16，而 16 正好是 2 的 4 次方。于是一个十六进制位吃掉四个二进制位，两个吃掉一个字节，不多不少，不用查表也不用凑。选 16 而不是 10 或 20，靠的就是这条整除关系。"
          },
          {
            "t": "p",
            "text": "十六个符号是 0 到 9 再加 A 到 F：A 是 10，F 是 15。位权和十进制一样算，0xFF 就是 15×16 + 15 = 255。所谓「满 16 往左进一位」，和「满 10 往左进一位」是同一件事，只是每格从 10 个变成 16 个。"
          },
          {
            "t": "p",
            "text": "写在最前面的 0x 是一层约定，不是数值的一部分：它提醒读的人「后面这串按 16 的位权解读」。这个写法从 C 语言传开，调试器、颜色值、字节转储都跟着用它。机器拿到的仍是那串位模式 —— 0xFF 与 11111111 是同一个数的两种写法。"
          },
          {
            "t": "h2",
            "text": "假设它能干什么"
          },
          {
            "t": "ul",
            "items": [
              "把一份文件按真实字节念出来，看清你的「一行文字」到底占了几个格子。",
              "把颜色写成 #ff8800 这种三段两位的形式，一眼读出红 255、绿 136、蓝 0。",
              "读报错里的地址，知道 0x7ffe 是一个位置的编号，不是一个普通小数。"
            ]
          },
          {
            "t": "h2",
            "text": "演示：把一个字节拆成两个十六进制位"
          },
          {
            "t": "p",
            "text": "先造一份只有三个字节的小文件，再用 od 按十六进制把它里面存的字节念出来。这一步不改文件，只把它存的位模式显示给你看。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "printf 'abc' > /tmp/miao-od.txt\nod -An -tx1 /tmp/miao-od.txt"
          },
          {
            "t": "p",
            "text": "我这块机器输出「 61 62 63」。这三个数是十六进制的：6×16 + 1 = 97，正好是字母 a 的那个号，后面单独一课会自己量到它。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "printf '%#x\\n' 255\necho $((0xff))\necho $((16#ff))"
          },
          {
            "t": "p",
            "text": "第一条把 255 打成十六进制，输出 0xff —— 格式串里那个 # 的作用就是让结果自带前缀。后两条走反方向：bash 认 0x 和 16# 两种写法，都吐出 255。同一个数三种写法，位模式只有一个。"
          },
          {
            "t": "svg",
            "caption": "一个字节的高 4 位与低 4 位各自折成一个符号，两个符号就是 0xFF",
            "code": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 250\"><text x=\"320\" y=\"30\" font-size=\"16\" font-weight=\"700\" fill=\"#1a2233\" text-anchor=\"middle\">一个字节 · 8 个二进制位 → 2 个十六进制位</text><rect x=\"152\" y=\"48\" width=\"320\" height=\"48\" rx=\"8\" fill=\"#eef3fa\" stroke=\"#2f6feb\" stroke-width=\"2\"/><text x=\"172\" y=\"80\" font-size=\"20\" fill=\"#1a2233\">1</text><text x=\"212\" y=\"80\" font-size=\"20\" fill=\"#1a2233\">1</text><text x=\"252\" y=\"80\" font-size=\"20\" fill=\"#1a2233\">1</text><text x=\"292\" y=\"80\" font-size=\"20\" fill=\"#1a2233\">1</text><text x=\"336\" y=\"80\" font-size=\"20\" fill=\"#1a2233\">1</text><text x=\"376\" y=\"80\" font-size=\"20\" fill=\"#1a2233\">1</text><text x=\"416\" y=\"80\" font-size=\"20\" fill=\"#1a2233\">1</text><text x=\"456\" y=\"80\" font-size=\"20\" fill=\"#1a2233\">1</text><path d=\"M152 100 V114 H312 V100\" stroke=\"#5c6a80\" stroke-width=\"2\" fill=\"none\"/><path d=\"M312 100 V114 H472 V100\" stroke=\"#5c6a80\" stroke-width=\"2\" fill=\"none\"/><text x=\"232\" y=\"136\" font-size=\"15\" fill=\"#5c6a80\" text-anchor=\"middle\">高 4 位 = 15</text><text x=\"392\" y=\"136\" font-size=\"15\" fill=\"#5c6a80\" text-anchor=\"middle\">低 4 位 = 15</text><path d=\"M232 144 V162\" stroke=\"#5c6a80\" stroke-width=\"2\"/><polygon points=\"232,170 226,158 238,158\" fill=\"#5c6a80\"/><path d=\"M392 144 V162\" stroke=\"#5c6a80\" stroke-width=\"2\"/><polygon points=\"392,170 386,158 398,158\" fill=\"#5c6a80\"/><rect x=\"192\" y=\"172\" width=\"80\" height=\"44\" rx=\"10\" fill=\"#2f6feb\"/><text x=\"232\" y=\"202\" font-size=\"24\" font-weight=\"700\" fill=\"#ffffff\" text-anchor=\"middle\">F</text><rect x=\"352\" y=\"172\" width=\"80\" height=\"44\" rx=\"10\" fill=\"#2f6feb\"/><text x=\"392\" y=\"202\" font-size=\"24\" font-weight=\"700\" fill=\"#ffffff\" text-anchor=\"middle\">F</text><text x=\"320\" y=\"240\" font-size=\"15\" fill=\"#5c6a80\" text-anchor=\"middle\">读作 0xFF：8 个格子缩成 2 个符号</text></svg>"
          },
          {
            "t": "h2",
            "text": "常见坑"
          },
          {
            "t": "ul",
            "items": [
              "把 0x 当成参与运算的东西。它只是前缀，提醒按 16 解读，本身没有数值。",
              "以为十六进制比二进制「更高级」。它不带任何新信息，纯粹是把四位并成一格方便人眼。",
              "算的时候把 A 到 F 当字母。A=10 一直到 F=15，背一遍就完事。",
              "把 od 输出的「61 62」读成六十一百六十二。那是两个字节，各自的号是 97 和 98。",
              "看见地址 0x7ffe 和颜色 #ff8800 就以为它们是一回事。它们只是都借用了这套速记。"
            ]
          },
          {
            "t": "h2",
            "text": "任务"
          },
          {
            "t": "ul",
            "items": [
              "用 printf 造一个内容是你名字首字母的文件，再用 od -An -tx1 念出它的字节，把每个十六进制位对回第 3 课那种 0 和 1 的写法。",
              "先手算 0x2A 等于十进制几，再用 echo $((0x2A)) 验证算得对不对。",
              "把颜色 #ff8800 拆成三个十进制数，说出它们各自是红、绿、蓝的多少。"
            ]
          },
          {
            "t": "tip",
            "color": "green",
            "text": "一句话：十六进制不是另一种数，是同一串位的速记 —— 四位并成一格，两位并成一个字节。"
          }
        ]
      },
      {
        "id": "b06",
        "title": "第 6 课 · ASCII：字符在机器里是一个数",
        "blocks": [
          {
            "t": "tip",
            "color": "blue",
            "text": "本课目标：接受「屏幕上的是形、文件里存的是号」这件事，并能用命令把字符和它那个号互相量出来。"
          },
          {
            "t": "h2",
            "text": "原理讲解"
          },
          {
            "t": "p",
            "text": "屏幕上这个 A，机器里存的不是形状，是一个号。1963 年定下的这张表叫 ASCII：拿 7 个二进制位、128 个格子，把字母、数字、标点和几个控制符编号，范围 0 到 127。"
          },
          {
            "t": "p",
            "text": "号不是随手发的。数字字符 '0' 到 '9' 连着占 48 到 57，字符减 48 就是它代表的数值。大写 A 到 Z 占 65 到 90，小写 a 到 z 占 97 到 122，两者差 32 —— 正好是一个二进制位的权重，早期键盘电路只控制那一位就能切换大小写。"
          },
          {
            "t": "p",
            "text": "128 个格子里，95 个是可打印字符，剩下 33 个是控制符：制表 9、换行 10、回车 13。这些号今天还在生效 —— 文件里「这一行结束了」，多数就是一个字节 10 躺在那儿。"
          },
          {
            "t": "p",
            "text": "还要把「号」与「形」分开：ASCII 只规定 65 读作 A，长什么样由字体决定；同一串号换一张表去读，就变成别的字符。号与表是绑在一起的，这是后面中文必须另立编码的根子。"
          },
          {
            "t": "h2",
            "text": "假设它能干什么"
          },
          {
            "t": "ul",
            "items": [
              "把一段文本量成字节数：10 个英文字母就是 10 个字节，一个字母一个号。",
              "看懂按十进制打印的字节转储，知道 97 落回纸上就是 a。",
              "解释为什么字符 '5' 不等于数值 5 —— 它存的号是 53。"
            ]
          },
          {
            "t": "h2",
            "text": "演示：把三个字符量成三个号"
          },
          {
            "t": "p",
            "text": "先问三个字符各自的号，再拿 65 反着问它是谁，顺便看 65 的位模式长什么样。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "python3 -c \"print(ord('A'), ord('a'), ord('0'), bin(65))\""
          },
          {
            "t": "p",
            "text": "这块机器上输出「65 97 48 0b1000001」。前三个是号，第四个是 65 的写法：七位，最高位是 64。'0' 的号是 48 不是 0，所以数字字符与数字本身之间横着 48 这段偏移。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "printf '%d\\n' \"'A\"\nod -An -td1 /tmp/miao-od.txt"
          },
          {
            "t": "p",
            "text": "第一条让 shell 把字符 A 翻译成它的号，输出 65；第二条把第 5 课那份文件的三个字节按十进制念一遍，得到 97 98 99。它们和上次那个 61 62 63 是同一批字节，只是一个按 16 念、一个按 10 念。"
          },
          {
            "t": "svg",
            "caption": "同一行三个格子：左边的字符、中间的号、右边的位模式，说的是一件事",
            "code": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 250\"><text x=\"130\" y=\"40\" font-size=\"15\" fill=\"#5c6a80\" text-anchor=\"middle\">屏幕上看到的</text><text x=\"300\" y=\"40\" font-size=\"15\" fill=\"#5c6a80\" text-anchor=\"middle\">文件里存的号</text><text x=\"480\" y=\"40\" font-size=\"15\" fill=\"#5c6a80\" text-anchor=\"middle\">号摊成 7 位</text><rect x=\"70\" y=\"58\" width=\"120\" height=\"46\" rx=\"8\" fill=\"#eef3fa\" stroke=\"#2f6feb\" stroke-width=\"2\"/><text x=\"130\" y=\"90\" font-size=\"22\" font-weight=\"700\" fill=\"#1a2233\" text-anchor=\"middle\">A</text><rect x=\"240\" y=\"58\" width=\"120\" height=\"46\" rx=\"8\" fill=\"#2f6feb\"/><text x=\"300\" y=\"90\" font-size=\"22\" font-weight=\"700\" fill=\"#ffffff\" text-anchor=\"middle\">65</text><text x=\"480\" y=\"90\" font-size=\"20\" fill=\"#1a2233\" text-anchor=\"middle\">1000001</text><rect x=\"70\" y=\"112\" width=\"120\" height=\"46\" rx=\"8\" fill=\"#eef3fa\" stroke=\"#2f6feb\" stroke-width=\"2\"/><text x=\"130\" y=\"144\" font-size=\"22\" font-weight=\"700\" fill=\"#1a2233\" text-anchor=\"middle\">a</text><rect x=\"240\" y=\"112\" width=\"120\" height=\"46\" rx=\"8\" fill=\"#2f6feb\"/><text x=\"300\" y=\"144\" font-size=\"22\" font-weight=\"700\" fill=\"#ffffff\" text-anchor=\"middle\">97</text><text x=\"480\" y=\"144\" font-size=\"20\" fill=\"#1a2233\" text-anchor=\"middle\">1100001</text><rect x=\"70\" y=\"166\" width=\"120\" height=\"46\" rx=\"8\" fill=\"#eef3fa\" stroke=\"#2f6feb\" stroke-width=\"2\"/><text x=\"130\" y=\"198\" font-size=\"22\" font-weight=\"700\" fill=\"#1a2233\" text-anchor=\"middle\">0</text><rect x=\"240\" y=\"166\" width=\"120\" height=\"46\" rx=\"8\" fill=\"#2f6feb\"/><text x=\"300\" y=\"198\" font-size=\"22\" font-weight=\"700\" fill=\"#ffffff\" text-anchor=\"middle\">48</text><text x=\"480\" y=\"198\" font-size=\"20\" fill=\"#1a2233\" text-anchor=\"middle\">0110000</text><text x=\"320\" y=\"234\" font-size=\"15\" fill=\"#5c6a80\" text-anchor=\"middle\">a 比 A 多 32 = 2 的 5 次方：只差那一位</text></svg>"
          },
          {
            "t": "h2",
            "text": "常见坑"
          },
          {
            "t": "ul",
            "items": [
              "以为字符 '0' 存的是 0。它存的是 48；真正的 0 号格子里什么都没有，屏幕上也不显示东西。",
              "把 ASCII 说成「一个字节 256 个字符」。它只用 7 位、128 个号；多出来的那位落在扩展段，各家的表并不一致。",
              "把大小写差 32 当巧合。那是设计出来的位差，为的就是让硬件少做一件事。",
              "拿 ASCII 的表去读中文文件。汉字的号远在 127 之外，读出来全是乱码 —— 这不是文件坏了，是表用错了。",
              "觉得「字符就是字节」。字符是人读的单位，字节是存储的单位，两者只有在 ASCII 这一段才刚好一比一。"
            ]
          },
          {
            "t": "h2",
            "text": "任务"
          },
          {
            "t": "ul",
            "items": [
              "用 python3 的 ord 把你名字里每个字母的号打出来，看它们是不是都落在 65 到 90 或 97 到 122。",
              "造一个只含一个字符的文件，分别用 od -An -td1 和 od -An -tx1 各念一遍，验证同一个字节的两种念法。",
              "查出 9、10、13 这三个号各是哪个控制符，再说一句为什么 Linux 里换一行只需要 10 就够。"
            ]
          },
          {
            "t": "tip",
            "color": "green",
            "text": "一句话：文件里存的是号，屏幕上显示的是形 —— ASCII 就是把两者钉在一起的第一张表。"
          }
        ]
      },
      {
        "id": "b07",
        "title": "第 7 课 · UTF-8：中文为什么要变长",
        "blocks": [
          {
            "t": "tip",
            "color": "blue",
            "text": "本课目标：明白汉字为什么装不进一格，以及 UTF-8 靠首字节的前缀怎么把「这个字占几格」写在字节自己身上。"
          },
          {
            "t": "h2",
            "text": "原理讲解"
          },
          {
            "t": "p",
            "text": "第 6 课那张表只有 128 格，塞不下汉字 —— 光常用字就三千五百多个。给汉字编号必须一次用好几个字节，可麻烦跟着来了：一串字节摆在机器面前，谁跟谁算一个字？"
          },
          {
            "t": "p",
            "text": "最省事的定长办法是所有字符都占两格。代价是英文也跟着翻倍，纯英文文件白白多花一倍，低段那些控制符还照样占着格子。汉字摆在那儿：一格不够，两格固定又太贵。"
          },
          {
            "t": "p",
            "text": "UTF-8 改成变长，一个字符占 1 到 4 格，并由首字节的前缀直接表明占几格：0 开头是单字节，这刚好把 ASCII 那 128 个号原样搬过来，一个都不动；110 开头带一个 10 开头的续字节，是两格；1110 开头带两个续字节，是三格；11110 开头带三个，是四格。以 10 开头的字节只能当尾巴，不能当开头。"
          },
          {
            "t": "p",
            "text": "这套前缀换来两件事：英文文件一个字节都不多花；拿到文件中间任意一个字节位置，往前找到一个非 10 开头的字节，就知道当前这个字从哪里起 —— 截断、跳读都不必从头解一遍。常用汉字落在三字节段，「中」的编号是 U+4E2D，写成三个字节。"
          },
          {
            "t": "p",
            "text": "同一句话还有别的规定：GBK 给汉字用两字节。两套序列互不相干，用错表读出来就是乱码，而文件不报错 —— 字节一个没少，只是认错了字。"
          },
          {
            "t": "h2",
            "text": "假设它能干什么"
          },
          {
            "t": "ul",
            "items": [
              "解释为什么把 UTF-8 的文件按 GBK 打开会看见一堆怪字，而文件其实没坏。",
              "量出一份中文文档实际占多少字节，明白「字数」与「字节数」是两个数。",
              "看懂网页、源码、数据库为什么都要写明 encoding 是 utf-8。"
            ]
          },
          {
            "t": "h2",
            "text": "演示：把「中」量成两种字节"
          },
          {
            "t": "p",
            "text": "先数这个字占几个字节，再把字节本身念出来。wc -c 数的是字节，od -tx1 按十六进制（第 5 课那套速记）列出每个格子。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "printf '中' | wc -c\nprintf '中' | od -An -tx1"
          },
          {
            "t": "p",
            "text": "这块机器给 3 和「e4 b8 ad」：三格。再让 python3 拿两种编码各编一遍，顺便把长度和序列一起打出来。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "python3 -c \"print(len('中'.encode('utf-8')), len('中'.encode('gbk')), '中'.encode('utf-8').hex(), '中'.encode('gbk').hex())\""
          },
          {
            "t": "p",
            "text": "输出 3 2 e4b8ad d6d0。UTF-8 三格、GBK 两格，两边都没错，只是两张不同的表。把 d6d0 这串交回 UTF-8 去读，落出来的就不是「中」了。"
          },
          {
            "t": "svg",
            "caption": "同一个「中」，左边三格是 UTF-8，右边两格是 GBK；下面那行前缀说明每格是开头还是尾巴",
            "code": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 270\"><text x=\"320\" y=\"28\" font-size=\"16\" font-weight=\"700\" fill=\"#1a2233\" text-anchor=\"middle\">同一个字 · 中</text><text x=\"150\" y=\"60\" font-size=\"15\" fill=\"#5c6a80\" text-anchor=\"middle\">UTF-8 · 3 字节</text><rect x=\"60\" y=\"70\" width=\"60\" height=\"40\" rx=\"6\" fill=\"#2f6feb\"/><text x=\"90\" y=\"96\" font-size=\"18\" font-weight=\"700\" fill=\"#ffffff\" text-anchor=\"middle\">e4</text><rect x=\"124\" y=\"70\" width=\"60\" height=\"40\" rx=\"6\" fill=\"#2f6feb\"/><text x=\"154\" y=\"96\" font-size=\"18\" font-weight=\"700\" fill=\"#ffffff\" text-anchor=\"middle\">b8</text><rect x=\"188\" y=\"70\" width=\"60\" height=\"40\" rx=\"6\" fill=\"#2f6feb\"/><text x=\"218\" y=\"96\" font-size=\"18\" font-weight=\"700\" fill=\"#ffffff\" text-anchor=\"middle\">ad</text><text x=\"150\" y=\"140\" font-size=\"15\" fill=\"#5c6a80\" text-anchor=\"middle\">1110xxxx · 10xxxxxx · 10xxxxxx</text><text x=\"470\" y=\"60\" font-size=\"15\" fill=\"#5c6a80\" text-anchor=\"middle\">GBK · 2 字节</text><rect x=\"410\" y=\"70\" width=\"60\" height=\"40\" rx=\"6\" fill=\"#b8500f\"/><text x=\"440\" y=\"96\" font-size=\"18\" font-weight=\"700\" fill=\"#ffffff\" text-anchor=\"middle\">d6</text><rect x=\"474\" y=\"70\" width=\"60\" height=\"40\" rx=\"6\" fill=\"#b8500f\"/><text x=\"504\" y=\"96\" font-size=\"18\" font-weight=\"700\" fill=\"#ffffff\" text-anchor=\"middle\">d0</text><text x=\"470\" y=\"140\" font-size=\"15\" fill=\"#5c6a80\" text-anchor=\"middle\">两张表都对，只是互不认识</text><text x=\"320\" y=\"176\" font-size=\"15\" font-weight=\"700\" fill=\"#1a2233\" text-anchor=\"middle\">首字节的前缀告诉你这个字占几格</text><rect x=\"80\" y=\"190\" width=\"120\" height=\"38\" rx=\"6\" fill=\"#eef3fa\" stroke=\"#2f6feb\" stroke-width=\"2\"/><text x=\"140\" y=\"215\" font-size=\"15\" fill=\"#1a2233\" text-anchor=\"middle\">0 开头 · 1 格</text><rect x=\"212\" y=\"190\" width=\"136\" height=\"38\" rx=\"6\" fill=\"#eef3fa\" stroke=\"#2f6feb\" stroke-width=\"2\"/><text x=\"280\" y=\"215\" font-size=\"15\" fill=\"#1a2233\" text-anchor=\"middle\">110 开头 · 2 格</text><rect x=\"360\" y=\"190\" width=\"136\" height=\"38\" rx=\"6\" fill=\"#eef3fa\" stroke=\"#2f6feb\" stroke-width=\"2\"/><text x=\"428\" y=\"215\" font-size=\"15\" fill=\"#1a2233\" text-anchor=\"middle\">1110 开头 · 3 格</text><rect x=\"508\" y=\"190\" width=\"132\" height=\"38\" rx=\"6\" fill=\"#eef3fa\" stroke=\"#2f6feb\" stroke-width=\"2\"/><text x=\"574\" y=\"215\" font-size=\"15\" fill=\"#1a2233\" text-anchor=\"middle\">11110 · 4 格</text><text x=\"320\" y=\"256\" font-size=\"15\" fill=\"#5c6a80\" text-anchor=\"middle\">其余以 10 开头的字节只能当尾巴</text></svg>"
          },
          {
            "t": "h2",
            "text": "常见坑"
          },
          {
            "t": "ul",
            "items": [
              "以为中文文件里「一个字等于一个字节」。UTF-8 里汉字通常占 3 格，按字数量和按字节量差三倍。",
              "把满屏乱码当成文件损坏。字节一个没少，只是拿错了表。",
              "听说 UTF-8 兼容 ASCII，就以为中文也一字节。兼容的只有那 128 个号。",
              "按字节长度截断字符串，切在两格的中间，末尾那个字就碎成一个怪符号。",
              "以为 GBK 是「过时该扔掉的东西」。它仍在大量中文文件里，两边都能正确存下同一个字，只是序列不同。"
            ]
          },
          {
            "t": "h2",
            "text": "任务"
          },
          {
            "t": "ul",
            "items": [
              "写一个只含「中」的文件，用 od -An -tx1 念出它的字节，和上面那串 e4 b8 ad 对一遍。",
              "把一句中英混排的话分别按 UTF-8 和 GBK 编码，比长度，说出英文和汉字各贡献了多少字节。",
              "解释为什么一个以 10 开头的字节不可能当字符的开头。"
            ]
          },
          {
            "t": "tip",
            "color": "green",
            "text": "一句话：UTF-8 把「这个字占几格」写在首字节的前缀里，于是英文不浪费、汉字装得下、错一格也不至于整篇读不回来。"
          }
        ]
      },
      {
        "id": "b08",
        "title": "第 8 课 · 整数溢出：盒子只有那么大",
        "blocks": [
          {
            "t": "tip",
            "color": "blue",
            "text": "本课目标：把「定宽的格子只有那么多」这条装上，能说清 32 位整数的天花板、过界之后发生什么，以及 2038 是怎么来的。"
          },
          {
            "t": "h2",
            "text": "原理讲解"
          },
          {
            "t": "p",
            "text": "第 4 课量过一格字节有 256 个状态，第 5 课写过 0xFF。接起来看：一个 32 位的整数格子只有 2 的 32 次方 = 4294967296 个状态，不到 43 亿。用完没有新格子可借，只能回头用旧的。"
          },
          {
            "t": "p",
            "text": "带符号的 32 位整数用补码：最高位当符号位，正数排到 2147483647（即 2 的 31 次方减一），负数排到 −2147483648。负数比正数多一个，因为 0 被算在非负那半边，正数那边少占一格。"
          },
          {
            "t": "p",
            "text": "于是「加一」在天花板处不是报错，是绕回：2147483647 再加一，在定宽格子里变成 −2147483648。机器只是照位相加，最高位的进位没格子放就丢掉 —— 它不觉得异常，是读的人还按普通加法理解那个结果。"
          },
          {
            "t": "p",
            "text": "在 Python 里你感觉不到这件事：2 的 31 次方减一再加一，它照常打出更大的数，因为这门语言按需要给整数扩位。这不是整数天生如此，是它替你换了一个足够大的盒子；换一个盒子规矩，同一句代码就会绕回去。"
          },
          {
            "t": "p",
            "text": "最出名的事故是 2038：Unix 时间用 32 位带符号整数记秒，2147483647 秒对应 2038 年 1 月 19 日 03:14:07 UTC，下一秒绕成负数，时间回到 1901 年。换成 64 位记秒，够用到 2900 亿年以后。"
          },
          {
            "t": "h2",
            "text": "假设它能干什么"
          },
          {
            "t": "ul",
            "items": [
              "读懂「计时器跑久了变负数」「累计金额突然变成巨大负值」这类现象。",
              "判断一个用秒数存时间的字段还能撑几年。",
              "解释处理文件大小、磁盘容量的代码为什么必须换成 64 位的格子。"
            ]
          },
          {
            "t": "h2",
            "text": "演示：把天花板量出来"
          },
          {
            "t": "p",
            "text": "先问 Python 那个最大的 32 位正数是多少、加一变成多少；再把这个数当作秒数，问它是哪一刻。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "python3 -c \"print(2**31-1, (2**31-1)+1)\""
          },
          {
            "t": "p",
            "text": "输出 2147483647 2147483648。Python 只是把盒子放大给你看，所以能看见过界这件事本身，而它自己不受它伤。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "date -u -d @2147483647 '+%Y-%m-%d %H:%M:%S %Z'\ndate +%s"
          },
          {
            "t": "p",
            "text": "第一条打出 2038-01-19 03:14:07 UTC，就是 32 位秒数用完的那一刻。第二条是此刻的秒数，我这块机器给 1793056285，离天花板还差一亿五千多万秒 —— 你自己跑时这个数字更小。"
          },
          {
            "t": "svg",
            "caption": "定宽整数是一个圈：从最大格再加一，指针跳到最小那一格",
            "code": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 280\"><circle cx=\"220\" cy=\"150\" r=\"96\" fill=\"none\" stroke=\"#5c6a80\" stroke-width=\"3\"/><path d=\"M220 54 A96 96 0 0 1 316 150\" fill=\"none\" stroke=\"#2f6feb\" stroke-width=\"8\"/><path d=\"M220 246 A96 96 0 0 1 124 150\" fill=\"none\" stroke=\"#b8500f\" stroke-width=\"8\"/><text x=\"220\" y=\"42\" font-size=\"14\" fill=\"#1a2233\" text-anchor=\"middle\">2147483647</text><text x=\"220\" y=\"272\" font-size=\"14\" fill=\"#1a2233\" text-anchor=\"middle\">-2147483648</text><text x=\"330\" y=\"155\" font-size=\"14\" fill=\"#1a2233\" text-anchor=\"start\">0</text><text x=\"112\" y=\"155\" font-size=\"14\" fill=\"#1a2233\" text-anchor=\"end\">-1</text><polygon points=\"300,66 292,80 308,80\" fill=\"#2f6feb\"/><text x=\"220\" y=\"146\" font-size=\"15\" font-weight=\"700\" fill=\"#1a2233\" text-anchor=\"middle\">共 2^32 格</text><text x=\"220\" y=\"168\" font-size=\"14\" fill=\"#5c6a80\" text-anchor=\"middle\">= 4294967296</text><text x=\"430\" y=\"80\" font-size=\"15\" font-weight=\"700\" fill=\"#2f6feb\">正数半边</text><text x=\"430\" y=\"104\" font-size=\"14\" fill=\"#5c6a80\">0 到 2147483647</text><text x=\"430\" y=\"160\" font-size=\"15\" font-weight=\"700\" fill=\"#b8500f\">负数半边</text><text x=\"430\" y=\"184\" font-size=\"14\" fill=\"#5c6a80\">-1 到 -2147483648</text><text x=\"430\" y=\"216\" font-size=\"14\" fill=\"#1a2233\">负数比正数多一格</text><text x=\"430\" y=\"240\" font-size=\"14\" fill=\"#5c6a80\">因为 0 在正数这边</text></svg>"
          },
          {
            "t": "h2",
            "text": "常见坑"
          },
          {
            "t": "ul",
            "items": [
              "以为溢出会报错。多数定宽整数不喊，它只是安静地绕回另一头。",
              "把「2 的 32 次方个格子」和「最大是 2 的 31 次方减一」混着说。前者是格子总数，后者是正数那头的位置。",
              "见到大得离谱的负数就先怀疑程序坏了。很多时候它只是绕了一圈从另一头冒出来。",
              "以为 Python 那种自动扩位是所有语言的常态。换一门语言，同一行代码结果就不同。"
            ]
          },
          {
            "t": "h2",
            "text": "任务"
          },
          {
            "t": "ul",
            "items": [
              "用 date +%s 记下你现在的秒数，算它离 2147483647 还差多少秒，再换算成天。",
              "一格字节最大 255。先写出 255 加一之后那格剩下的位模式，再用 echo $((255+1)) 看 shell 给你什么，说出两者为什么不一样。",
              "16 位的带符号整数最大是多少？拿它当一个月份的销售台数上限，判断什么情况下会不够用。"
            ]
          },
          {
            "t": "tip",
            "color": "green",
            "text": "一句话：定宽整数不是一把无限长的刻度尺，是一个圈；算过天花板不会报错，只会从另一头冒出来。"
          }
        ]
      },
      {
        "id": "b09",
        "title": "第 9 课 · 门电路：一个开关怎么算加法",
        "blocks": [
          {
            "t": "tip",
            "color": "blue",
            "text": "本课目标：看清只有两种状态的开关怎么拼出加法，并在终端里把三种门和进位链跑一遍。"
          },
          {
            "t": "h2",
            "text": "原理讲解"
          },
          {
            "t": "p",
            "text": "1854 年，英国数学教师乔治·布尔写下一套只认两个值的代数：量只能是 0 或 1，运算只要三种——与、或、非。与是两边都真才真，或是有一个真就真，非是把真换成假。"
          },
          {
            "t": "p",
            "text": "1938 年，克劳德·香农在硕士论文里把它接到开关上：闭合记 1、断开记 0，两个开关串联是与门，并联是或门，反接是非门。1947 年贝尔实验室做出第一个晶体管，开关不再要铜片，一小块半导体加个电压就能通断，芯片上才放得下几十亿个。"
          },
          {
            "t": "p",
            "text": "两种门配起来就能算一位加法：两个输入做异或（不一样才输出 1），是本位的和；相与，是要不要往前进一位。这两路叫半加器，它没处接低位的进位。补一层门，让它收 a、b、cin，出 sum 和 cout，就是完整的一位加法器。四个这样的一位加法器串起来，进位一位一位往上爬，最高位要等前三位传到位才落定——这条链子内行叫它行波进位。"
          },
          {
            "t": "h2",
            "text": "假设它能干什么"
          },
          {
            "t": "ul",
            "items": [
              "加、减（减一个数等于加它的相反数，即第 8 课的补码）、比大小，全用门拼得出来。",
              "一大排这样的门捆成一块，就是 CPU 里负责算的那部分。",
              "门只认 0 和 1，字符（第 6 课）和中文（第 7 课）进了芯片都只是一串位。"
            ]
          },
          {
            "t": "h2",
            "text": "演示：bash 里的三种门"
          },
          {
            "t": "p",
            "text": "双圆括号是 bash 的算术：& 是与、| 是或、^ 是异或、<< 是左移，echo 把结果打到屏幕上。下面四条我都在本机敲过。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "echo $((5 & 3))\necho $((5 | 3))\necho $((5 ^ 3))\necho $((1 << 4))"
          },
          {
            "t": "p",
            "text": "输出依次是 1、7、6、16。5 写成 4 位是 0101、3 是 0011（第 3 课）：相与只有最右一位都是 1，得 1；相或得 0111 即 7；异或得 0110 即 6。5 加 3 该得 8，异或只给 6，差的就是没算进去的进位。最后一条把 1 挪四格得 16，左移就是进位的方向。"
          },
          {
            "t": "p",
            "text": "异或给和、相与后左移给进位；把这两个结果当成新的 a 和 b 重复下去，直到进位归 0。前四行这样走，后两行换成四位相加：2# 按二进制读，bc 的 obase=2 回打二进制。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "a=5; b=3\necho $((a ^ b)) $(((a & b) << 1))\na=6; b=2\necho $((a ^ b)) $(((a & b) << 1))\na=4; b=4\necho $((a ^ b)) $(((a & b) << 1))\na=0; b=8\necho $((a ^ b)) $(((a & b) << 1))\necho $((2#1001 + 2#0111))\necho \"obase=2; 9 + 7\" | bc"
          },
          {
            "t": "p",
            "text": "前四行打出 6 2、4 4、0 8、8 0：第三轮两数都是 4，异或得 0、进位得 8；第四轮进位归 0，和停在 8。5 加 3 走了四轮，真加法器的进位也是这样等的。后两行输出 16 和 10000：1001 加 0111 每一位都往上进位，最高位挤出的 1 落到第 5 位。4 个格子装不下它，可加法器并不知道格子只有 4 个——第 8 课那个盒子。"
          },
          {
            "t": "svg",
            "code": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 300\"><rect x=\"8\" y=\"8\" width=\"624\" height=\"284\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"38\" font-size=\"18\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">4 位加法器：进位一位一位往上传</text><text x=\"88\" y=\"64\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">位 0</text><text x=\"220\" y=\"64\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">位 1</text><text x=\"352\" y=\"64\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">位 2</text><text x=\"484\" y=\"64\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">位 3</text><text x=\"584\" y=\"64\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">第 5 位</text><text x=\"88\" y=\"98\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">a=1</text><text x=\"220\" y=\"98\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">a=0</text><text x=\"352\" y=\"98\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">a=0</text><text x=\"484\" y=\"98\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">a=1</text><text x=\"88\" y=\"120\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">b=1</text><text x=\"220\" y=\"120\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">b=1</text><text x=\"352\" y=\"120\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">b=1</text><text x=\"484\" y=\"120\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">b=0</text><line x1=\"88\" y1=\"126\" x2=\"88\" y2=\"140\" stroke=\"#2a8c78\" stroke-width=\"2\"/><line x1=\"220\" y1=\"126\" x2=\"220\" y2=\"140\" stroke=\"#2a8c78\" stroke-width=\"2\"/><line x1=\"352\" y1=\"126\" x2=\"352\" y2=\"140\" stroke=\"#2a8c78\" stroke-width=\"2\"/><line x1=\"484\" y1=\"126\" x2=\"484\" y2=\"140\" stroke=\"#2a8c78\" stroke-width=\"2\"/><rect x=\"44\" y=\"140\" width=\"88\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"88\" y=\"166\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">一位加法器</text><text x=\"88\" y=\"190\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">收进位 0</text><rect x=\"176\" y=\"140\" width=\"88\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"220\" y=\"166\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">一位加法器</text><text x=\"220\" y=\"190\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">收进位 1</text><rect x=\"308\" y=\"140\" width=\"88\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"352\" y=\"166\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">一位加法器</text><text x=\"352\" y=\"190\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">收进位 1</text><rect x=\"440\" y=\"140\" width=\"88\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"484\" y=\"166\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">一位加法器</text><text x=\"484\" y=\"190\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">收进位 1</text><line x1=\"14\" y1=\"172\" x2=\"40\" y2=\"172\" stroke=\"#c1662f\" stroke-width=\"3\"/><text x=\"26\" y=\"214\" font-size=\"14\" text-anchor=\"middle\" fill=\"#a8501f\">进位 0</text><line x1=\"132\" y1=\"172\" x2=\"172\" y2=\"172\" stroke=\"#c1662f\" stroke-width=\"3\"/><polygon points=\"176,172 166,166 166,178\" fill=\"#c1662f\"/><text x=\"154\" y=\"158\" font-size=\"14\" text-anchor=\"middle\" fill=\"#a8501f\">进位 1</text><line x1=\"264\" y1=\"172\" x2=\"304\" y2=\"172\" stroke=\"#c1662f\" stroke-width=\"3\"/><polygon points=\"308,172 298,166 298,178\" fill=\"#c1662f\"/><text x=\"286\" y=\"158\" font-size=\"14\" text-anchor=\"middle\" fill=\"#a8501f\">进位 1</text><line x1=\"396\" y1=\"172\" x2=\"436\" y2=\"172\" stroke=\"#c1662f\" stroke-width=\"3\"/><polygon points=\"440,172 430,166 430,178\" fill=\"#c1662f\"/><text x=\"418\" y=\"158\" font-size=\"14\" text-anchor=\"middle\" fill=\"#a8501f\">进位 1</text><line x1=\"528\" y1=\"172\" x2=\"552\" y2=\"172\" stroke=\"#c1662f\" stroke-width=\"3\"/><polygon points=\"556,172 546,166 546,178\" fill=\"#c1662f\"/><rect x=\"556\" y=\"140\" width=\"56\" height=\"64\" rx=\"10\" fill=\"#fdf1e6\" stroke=\"#c1662f\" stroke-width=\"2\"/><text x=\"584\" y=\"178\" font-size=\"16\" text-anchor=\"middle\" fill=\"#a8501f\">1</text><line x1=\"88\" y1=\"204\" x2=\"88\" y2=\"228\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"88\" y=\"250\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">和 0</text><line x1=\"220\" y1=\"204\" x2=\"220\" y2=\"228\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"220\" y=\"250\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">和 0</text><line x1=\"352\" y1=\"204\" x2=\"352\" y2=\"228\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"352\" y=\"250\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">和 0</text><line x1=\"484\" y1=\"204\" x2=\"484\" y2=\"228\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"484\" y=\"250\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">和 0</text><text x=\"320\" y=\"278\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">左边是最低位：a=1001、b=0111，四个和位全是 0，多出的 1 落在第 5 位</text></svg>",
            "caption": "每一位都往上进了一位，进位爬完四格，结果比盒子多出一位：10000，也就是 16。"
          },
          {
            "t": "h2",
            "text": "常见坑"
          },
          {
            "t": "ul",
            "items": [
              "把异或当成加法：两个 1 异或得 0，加法要进一位。",
              "用十进制心思读位：1001 那一位的 1 代表 8。",
              "少写一层圆括号：双圆括号才是算术，单独的 & 和 | 在 shell 里另有意思。"
            ]
          },
          {
            "t": "h2",
            "text": "任务"
          },
          {
            "t": "ul",
            "items": [
              "把演示里的 5 和 3 换成 9 和 6，数一数进位走几轮才归 0。",
              "用 echo $((2#1110 + 2#0011)) 算一个四位加法，再用 bc 把结果写成二进制。",
              "在纸上画四个盒子，把 1001 和 0111 标上去，让进位一格一格往右爬。"
            ]
          },
          {
            "t": "tip",
            "color": "green",
            "text": "一句话：三种门只会看 0 和 1，把它们按位排开、把进位一级一级传上去，加法就自己出现了。"
          }
        ]
      },
      {
        "id": "b10",
        "title": "第 10 课 · 指令周期：一条命令在 CPU 里走的路",
        "blocks": [
          {
            "t": "tip",
            "color": "blue",
            "text": "本课目标：走一遍一条指令在 CPU 里的四步——取指、译码、执行、写回，再把 /bin/ls 的段位模式反出来看。"
          },
          {
            "t": "h2",
            "text": "原理讲解"
          },
          {
            "t": "p",
            "text": "第 5 课学过，每 4 位二进制对一个十六进制符号；一个编译好的程序放在盘上，就是这样一串字节。x86 里一条指令占 1 到 15 个字节，长短不一。编译器做的事说穿了只有一件：把源码写成这些位模式——和第 8 课那些盒子一样，都是有限格子里摆位。"
          },
          {
            "t": "p",
            "text": "CPU 里有个专门的数叫程序计数器 PC，存着下一条指令在内存的哪个地址。第一步取指：按 PC 去内存拿一段字节，然后把 PC 往前挪——挪多少看刚拿那条占几个字节。"
          },
          {
            "t": "p",
            "text": "第二步译码：看这段位模式什么意思——开头几位说做哪种操作，往后的位说做在哪几个寄存器、哪个地址上。第三步执行：要算就送进算术逻辑单元，正是第 9 课那排一位加法器拼出来的；要搬数据就搬。第四步写回：结果放进寄存器。"
          },
          {
            "t": "p",
            "text": "四步走完，PC 已指着下一条，圈重新开始；一圈圈转下去就是程序在跑。真 CPU 还把这四步叠成流水线，好几条指令同时在半路。"
          },
          {
            "t": "h2",
            "text": "假设它能干什么"
          },
          {
            "t": "p",
            "text": "知道程序是这么一圈圈转的，就知道它慢在哪：不在代码行数，而在每圈要不要多跑一趟内存。"
          },
          {
            "t": "h2",
            "text": "演示：把 /bin/ls 的段位模式翻出来"
          },
          {
            "t": "p",
            "text": "objdump 读的是编译好的机器码，不需要源码。第一条看这个可执行文件的形头，head 只打前 10 行；第二条问本机是哪一族 CPU。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "objdump -f /bin/ls | head\nuname -m"
          },
          {
            "t": "p",
            "text": "本机打的是 文件格式 elf64-x86-64、起始地址 0x0000000000109930，uname -m 打 x86_64。换成 ARM 的机器就是 aarch64，字节也不是同一族。接下来把它一行行反汇编。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "objdump -d /bin/ls | head -12"
          },
          {
            "t": "p",
            "text": "每行三段：左边是内存里的地址，中间是这条指令的字节，右边是给人看的助记符。sub 占 4 个字节，mov 占 7 个，je 只 2 个，所以地址一路是 f4000、f4004、f4008、f400f、f4012，间距不等——PC 每圈加的就是这个字节数。末行 je 是条件跳转，条件成立时它把 PC 直接改成另一个地址。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "lscpu | grep -i \"model name\"\nLC_ALL=C lscpu | grep -i \"model name\""
          },
          {
            "t": "p",
            "text": "最后一组问这台机器是谁。第一条在我这块机器上一字不出，第二条加了前缀才有：Model name: Intel(R) Core(TM) i7-8700T CPU @ 2.40GHz。本机 lscpu 说中文，标签写作 型号名称；LC_ALL=C 是叫它别管语言设置。"
          },
          {
            "t": "svg",
            "code": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 280\"><rect x=\"8\" y=\"8\" width=\"624\" height=\"264\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"32\" font-size=\"18\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">一条指令在 CPU 里走的一圈</text><text x=\"316\" y=\"56\" font-size=\"14\" text-anchor=\"middle\" fill=\"#a8501f\">PC 加上这条指令的字节数，回到取指</text><path d=\"M 529 104 C 529 76 103 76 103 104\" stroke=\"#c1662f\" stroke-width=\"3\" fill=\"none\"/><polygon points=\"103,110 97,98 109,98\" fill=\"#c1662f\"/><rect x=\"48\" y=\"110\" width=\"110\" height=\"58\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"103\" y=\"134\" font-size=\"17\" text-anchor=\"middle\" fill=\"#173d36\">取指</text><text x=\"103\" y=\"156\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">从内存拿一条</text><rect x=\"190\" y=\"110\" width=\"110\" height=\"58\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"245\" y=\"134\" font-size=\"17\" text-anchor=\"middle\" fill=\"#173d36\">译码</text><text x=\"245\" y=\"156\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">看懂段位模式</text><rect x=\"332\" y=\"110\" width=\"110\" height=\"58\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"387\" y=\"134\" font-size=\"17\" text-anchor=\"middle\" fill=\"#173d36\">执行</text><text x=\"387\" y=\"156\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">算或是搬</text><rect x=\"474\" y=\"110\" width=\"110\" height=\"58\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"529\" y=\"134\" font-size=\"17\" text-anchor=\"middle\" fill=\"#173d36\">写回</text><text x=\"529\" y=\"156\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">放进寄存器</text><line x1=\"158\" y1=\"139\" x2=\"186\" y2=\"139\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"190,139 180,133 180,145\" fill=\"#2a8c78\"/><line x1=\"300\" y1=\"139\" x2=\"328\" y2=\"139\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"332,139 322,133 322,145\" fill=\"#2a8c78\"/><line x1=\"442\" y1=\"139\" x2=\"470\" y2=\"139\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"474,139 464,133 464,145\" fill=\"#2a8c78\"/><rect x=\"48\" y=\"198\" width=\"110\" height=\"40\" rx=\"8\" fill=\"#e8f1ee\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"103\" y=\"224\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">内存</text><line x1=\"103\" y1=\"198\" x2=\"103\" y2=\"176\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"103,170 97,180 109,180\" fill=\"#2a8c78\"/><rect x=\"474\" y=\"198\" width=\"110\" height=\"40\" rx=\"8\" fill=\"#e8f1ee\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"529\" y=\"224\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">寄存器</text><line x1=\"529\" y1=\"198\" x2=\"529\" y2=\"176\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"529,170 523,180 535,180\" fill=\"#2a8c78\"/><text x=\"352\" y=\"210\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">执行这一步用的</text><text x=\"352\" y=\"230\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">就是第 9 课那排加法器</text></svg>",
            "caption": "四步连成一个圈：取指从内存来，写回落进寄存器，PC 记下转到哪了。"
          },
          {
            "t": "h2",
            "text": "常见坑"
          },
          {
            "t": "ul",
            "items": [
              "把助记符当成指令本身。sub $0x8,%rsp 是给人看的写法，CPU 吃的是 4 个字节。",
              "以为 PC 每圈加固定值。x86 指令长短不一，跳转类指令直接改写 PC。",
              "搜不到就断定命令坏了。先看输出用什么语言，必要时加 LC_ALL=C。"
            ]
          },
          {
            "t": "h2",
            "text": "任务"
          },
          {
            "t": "ul",
            "items": [
              "多抄五行 objdump -d /bin/ls，数字节数，看相邻两个地址之差是不是正好等于它。",
              "在自己机器上跑 uname -m 和 lscpu，抄下 CPU 型号，说出它属于哪一族。",
              "一条 add 要把 32 位相加，按第 9 课那种一位加法器，至少要多少个盒子串成一排？"
            ]
          },
          {
            "t": "tip",
            "color": "green",
            "text": "一句话：程序就是同一个四步圈转很多遍，PC 是转到哪了的记号。"
          }
        ]
      },
      {
        "id": "b11",
        "title": "第 11 课 · 内存金字塔：越快的越贵",
        "blocks": [
          {
            "t": "tip",
            "color": "blue",
            "text": "本课目标：把存储排成一座金字塔，量一量本机各层多大、整块拷贝各档多快，明白程序眼里的内存是分层的。"
          },
          {
            "t": "h2",
            "text": "原理讲解"
          },
          {
            "t": "p",
            "text": "第 10 课那一圈里，取指和搬数据都要去内存拿东西，离 CPU 越远等得越久。速度只能拿距离换：近的做得小、贵、装得少，远的便宜、能装但慢。固态盘靠电擦写，机械盘还得把磁头挪到那一圈上，光等就几毫秒。"
          },
          {
            "t": "p",
            "text": "最上头是寄存器，CPU 内部几十个格子，一个周期以内就取到。往下是 L1、L2、L3 三级缓存：芯片把最近碰过的内存块抄一份留在自己边上，查到就不必出芯片，查不到才算 miss。"
          },
          {
            "t": "p",
            "text": "程序看不见这座塔：它拿到一整片均匀的地址空间。真实位置要一层层查表换算，一页在哪一层由硬件和系统悄悄安排，一页是 4096 字节。内存不够时，不常碰的页被丢到盘上的交换区，再碰它就得停下等搬回来——程序一顿多半在这里。"
          },
          {
            "t": "h2",
            "text": "假设它能干什么"
          },
          {
            "t": "ul",
            "items": [
              "把数据排紧：循环里连着读一整块，比跳来跳去快好几倍，因为整块待在缓存里。",
              "少跑几趟内存，往往比把算式改短一点更管用。",
              "找出一顿一顿的元凶：多半是缺页。"
            ]
          },
          {
            "t": "h2",
            "text": "演示：本机各层多大、多快"
          },
          {
            "t": "p",
            "text": "先问有几级、每级多大。本机的 lscpu 跟着系统说中文，标签写作 缓存，搜英文 cache 只捞到一行不相干的；第一条用中文词，两条 getconf 分别问一级缓存和页的大小（英文环境就搜 cache）。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "lscpu | grep 缓存\ngetconf LEVEL1_DCACHE_SIZE\ngetconf PAGE_SIZE"
          },
          {
            "t": "p",
            "text": "四行是 L1d 192 KiB、L1i 192 KiB（各标着 6 instances）、L2 1.5 MiB、L3 12 MiB：六核合起来 192 KiB，每核一级数据缓存就是 32 KiB，和 getconf 打的 32768 一样；PAGE_SIZE 是 4096。"
          },
          {
            "t": "p",
            "text": "再量速度。python3 -m timeit 把一段代码跑很多轮、只报最快那几轮；src 和 dst 是两块缓冲区，dst[:]=src 就是整块抄一遍。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "python3 -m timeit -n 5 -r 5 -s \"src=bytearray(32*1024); dst=bytearray(32*1024)\" \"dst[:]=src\"\npython3 -m timeit -n 5 -r 5 -s \"src=bytearray(4*1024*1024); dst=bytearray(4*1024*1024)\" \"dst[:]=src\"\npython3 -m timeit -n 5 -r 5 -s \"src=bytearray(256*1024*1024); dst=bytearray(256*1024*1024)\" \"dst[:]=src\""
          },
          {
            "t": "code",
            "lang": "text",
            "code": "5 loops, best of 5: 832 nsec per loop\n5 loops, best of 5: 160 usec per loop\n5 loops, best of 5: 20.8 msec per loop"
          },
          {
            "t": "p",
            "text": "摊到每个字节：32 KiB 那档 0.025 纳秒，4 MiB 那档 0.038，256 MiB 那档 0.078——差三倍多。数据还待在缓存里就快，摊满整条内存就得等。数字会晃，别当定值。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "lsblk -d -o NAME,ROTA,SIZE,MODEL | grep -v loop\nfree -h"
          },
          {
            "t": "p",
            "text": "sda 的 ROTA 是 1、465.8G，是块要转的盘；nvme0n1 的 ROTA 是 0、238.5G，是固态盘。ROTA 那列问的就是要不要转盘，grep -v loop 去掉的是 snap 伪盘。free -h 报 30Gi 内存、8.0Gi 交换区。盘的访问时间我没量，手册区间是 20—100 微秒和 10 毫秒。"
          },
          {
            "t": "svg",
            "code": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 320\"><rect x=\"8\" y=\"8\" width=\"624\" height=\"304\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"34\" font-size=\"18\" text-anchor=\"middle\" fill=\"#173d36\" font-weight=\"700\">存储金字塔：越往下越慢、越大、越便宜</text><polygon points=\"198,62 262,62 282,100 178,100\" fill=\"#d8efe9\"/><polygon points=\"178,100 282,100 302,138 158,138\" fill=\"#c3e7de\"/><polygon points=\"158,138 302,138 322,176 138,176\" fill=\"#a9ddd1\"/><polygon points=\"138,176 322,176 342,214 118,214\" fill=\"#93d3c3\"/><polygon points=\"118,214 342,214 362,252 98,252\" fill=\"#7cc9b5\"/><polygon points=\"98,252 362,252 385,290 75,290\" fill=\"#66bfa8\"/><text x=\"230\" y=\"84\" font-size=\"15\" text-anchor=\"middle\" fill=\"#123b33\">寄存器</text><text x=\"230\" y=\"122\" font-size=\"15\" text-anchor=\"middle\" fill=\"#123b33\">L1 缓存</text><text x=\"230\" y=\"160\" font-size=\"15\" text-anchor=\"middle\" fill=\"#123b33\">L2 与 L3</text><text x=\"230\" y=\"198\" font-size=\"15\" text-anchor=\"middle\" fill=\"#123b33\">内存</text><text x=\"230\" y=\"236\" font-size=\"15\" text-anchor=\"middle\" fill=\"#123b33\">固态盘</text><text x=\"230\" y=\"274\" font-size=\"15\" text-anchor=\"middle\" fill=\"#123b33\">机械盘</text><text x=\"470\" y=\"56\" font-size=\"14\" text-anchor=\"end\" fill=\"#173d36\" font-weight=\"700\">一次要等多久</text><text x=\"482\" y=\"56\" font-size=\"14\" text-anchor=\"start\" fill=\"#173d36\" font-weight=\"700\">本机容量</text><text x=\"470\" y=\"84\" font-size=\"14\" text-anchor=\"end\" fill=\"#4d6f67\">1 周期以内</text><text x=\"482\" y=\"84\" font-size=\"14\" text-anchor=\"start\" fill=\"#4d6f67\">十几个小格子</text><text x=\"470\" y=\"122\" font-size=\"14\" text-anchor=\"end\" fill=\"#4d6f67\">约 4 个周期</text><text x=\"482\" y=\"122\" font-size=\"14\" text-anchor=\"start\" fill=\"#4d6f67\">每核 32 KiB</text><text x=\"470\" y=\"160\" font-size=\"14\" text-anchor=\"end\" fill=\"#4d6f67\">十几到五十周期</text><text x=\"482\" y=\"160\" font-size=\"14\" text-anchor=\"start\" fill=\"#4d6f67\">256 KiB + 12 MiB</text><text x=\"470\" y=\"198\" font-size=\"14\" text-anchor=\"end\" fill=\"#4d6f67\">80—120 纳秒</text><text x=\"482\" y=\"198\" font-size=\"14\" text-anchor=\"start\" fill=\"#4d6f67\">30 GiB</text><text x=\"470\" y=\"236\" font-size=\"14\" text-anchor=\"end\" fill=\"#4d6f67\">20—100 微秒</text><text x=\"482\" y=\"236\" font-size=\"14\" text-anchor=\"start\" fill=\"#4d6f67\">238.5 GiB</text><text x=\"470\" y=\"274\" font-size=\"14\" text-anchor=\"end\" fill=\"#4d6f67\">约 10 毫秒</text><text x=\"482\" y=\"274\" font-size=\"14\" text-anchor=\"start\" fill=\"#4d6f67\">465.8 GiB</text><line x1=\"70\" y1=\"80\" x2=\"70\" y2=\"272\" stroke=\"#c1662f\" stroke-width=\"3\"/><polygon points=\"70,72 64,84 76,84\" fill=\"#c1662f\"/><text x=\"52\" y=\"150\" font-size=\"14\" text-anchor=\"start\" fill=\"#a8501f\">往</text><text x=\"52\" y=\"170\" font-size=\"14\" text-anchor=\"start\" fill=\"#a8501f\">上</text><text x=\"52\" y=\"190\" font-size=\"14\" text-anchor=\"start\" fill=\"#a8501f\">更</text><text x=\"52\" y=\"210\" font-size=\"14\" text-anchor=\"start\" fill=\"#a8501f\">快</text><text x=\"120\" y=\"306\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">再往下是网络：一次往返几十毫秒</text><text x=\"440\" y=\"306\" font-size=\"14\" text-anchor=\"middle\" fill=\"#a8501f\">时间取的是量级区间</text></svg>",
            "caption": "同一件活，数据在哪一层就等多久：从寄存器到机械盘，等待相差千万倍。"
          },
          {
            "t": "h2",
            "text": "常见坑"
          },
          {
            "t": "ul",
            "items": [
              "把 free -h 的 buff/cache 当成还剩的内存：那是要让出来的缓存。",
              "以为缓存大小能调：它焊在芯片上，能调的只有数据走法。",
              "只看平均数：缺页那一趟几毫秒，平均里看不见。",
              "把固态盘当内存用——它快，一次访问仍是内存的上百倍。"
            ]
          },
          {
            "t": "h2",
            "text": "任务"
          },
          {
            "t": "ul",
            "items": [
              "跑 lscpu 抄下 L1、L2、L3 大小，算出每核分到多少。",
              "把三档换成 64 KiB、2 MiB、128 MiB，看每字节耗时怎么变。",
              "内存按 100 纳秒、机械盘按 10 毫秒算，差多少倍？"
            ]
          },
          {
            "t": "tip",
            "color": "green",
            "text": "一句话：程序以为面对的是一整片均匀的内存，其实是一层层等得起的台阶。"
          }
        ]
      },
      {
        "id": "b12",
        "title": "第 12 课 · 结课串联：按下一次回车发生了什么",
        "blocks": [
          {
            "t": "tip",
            "color": "blue",
            "text": "本课目标：把前十一课接成一条线，看清你按下回车那一刻，一个汉字是怎么走到屏幕上亮起来的。"
          },
          {
            "t": "h2",
            "text": "原理讲解"
          },
          {
            "t": "p",
            "text": "键盘里有一颗小芯片在扫描按键矩阵。它发现哪个键被按住，就发一个扫描码——那是「哪个键」的编号，不是字符。主机这边的控制器收到之后做出一件事：中断。CPU 正在转的那一圈被掐断，先腾出手来读这个编号。"
          },
          {
            "t": "p",
            "text": "驱动把扫描码换成键名，输入法再把它换成字节。你敲的是中，出来的是第 7 课那三个字节 e4 b8 ad；回车是 0a。这是这一路上头一次，字节被当成字符来看。"
          },
          {
            "t": "p",
            "text": "终端把这行交给正在跑的那个程序，塞进它的标准输入。程序那头开始转第 10 课那个圈：取指、译码、执行、写回。要算的加法，是第 9 课那排一位加法器一级一级传进位算出来的。"
          },
          {
            "t": "p",
            "text": "算出来的字先写进标准输出——那是内存里的一段缓冲，攒够一块或者碰到换行才交给系统。图形界面拿到它，把字形画进帧缓冲；显示器按固定节奏把帧缓冲整块读走，每读一次就是一帧。"
          },
          {
            "t": "p",
            "text": "慢的地方全在等：等中断、等硬盘搬一页回来。金字塔越靠下越慢（第 11 课），而这几步之所以看起来是立刻，是因为常碰的数据都还留在缓存里。"
          },
          {
            "t": "h2",
            "text": "假设它能干什么"
          },
          {
            "t": "p",
            "text": "字没上屏，可能是程序没写、缓冲还没刷、屏幕没到下一帧；一顿一顿，多半在等硬盘。一条链子拆成七段，猜就有了方向。"
          },
          {
            "t": "h2",
            "text": "演示：让一个汉字留下它真实的字节"
          },
          {
            "t": "p",
            "text": "printf 按格式把字打出来，大于号把本该上屏的东西写进一个文件；od 把那个文件按十六进制一位位打回来给人看，-An 是不要地址那一列。"
          },
          {
            "t": "code",
            "lang": "bash",
            "code": "printf '中\\n' > /tmp/miao-line.txt\nod -An -tx1 /tmp/miao-line.txt"
          },
          {
            "t": "p",
            "text": "本机打的是 e4 b8 ad 0a，正好四个字节：前三个就是「中」，最后的 0a 是回车。你在屏幕上看见的一个字，从头到尾就是这三个字节；连它的字形都存在盘上的字体文件里，读进来还是字节。"
          },
          {
            "t": "svg",
            "code": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 300\"><rect x=\"8\" y=\"8\" width=\"624\" height=\"284\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"34\" font-size=\"18\" text-anchor=\"middle\" fill=\"#173d36\" font-weight=\"700\">敲一次回车走过的整条路</text><rect x=\"12\" y=\"52\" width=\"175\" height=\"46\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><rect x=\"232\" y=\"52\" width=\"175\" height=\"46\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><rect x=\"452\" y=\"52\" width=\"175\" height=\"46\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"99\" y=\"72\" font-size=\"15\" text-anchor=\"middle\" fill=\"#123b33\">键盘</text><text x=\"99\" y=\"90\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">扫描码，发一次中断</text><text x=\"319\" y=\"72\" font-size=\"15\" text-anchor=\"middle\" fill=\"#123b33\">驱动与输入法</text><text x=\"319\" y=\"90\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">换成字节 e4 b8 ad</text><text x=\"539\" y=\"72\" font-size=\"15\" text-anchor=\"middle\" fill=\"#123b33\">终端</text><text x=\"539\" y=\"90\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">把这一行交给程序</text><line x1=\"187\" y1=\"75\" x2=\"222\" y2=\"75\" stroke=\"#c1662f\" stroke-width=\"3\"/><polygon points=\"232,75 222,69 222,81\" fill=\"#c1662f\"/><line x1=\"407\" y1=\"75\" x2=\"442\" y2=\"75\" stroke=\"#c1662f\" stroke-width=\"3\"/><polygon points=\"452,75 442,69 442,81\" fill=\"#c1662f\"/><line x1=\"574\" y1=\"98\" x2=\"574\" y2=\"146\" stroke=\"#c1662f\" stroke-width=\"3\"/><polygon points=\"574,156 568,146 580,146\" fill=\"#c1662f\"/><rect x=\"520\" y=\"158\" width=\"108\" height=\"52\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><rect x=\"372\" y=\"158\" width=\"108\" height=\"52\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><rect x=\"224\" y=\"158\" width=\"108\" height=\"52\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><rect x=\"76\" y=\"158\" width=\"108\" height=\"52\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"574\" y=\"180\" font-size=\"15\" text-anchor=\"middle\" fill=\"#123b33\">程序</text><text x=\"574\" y=\"200\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">取指到写回</text><text x=\"426\" y=\"180\" font-size=\"15\" text-anchor=\"middle\" fill=\"#123b33\">输出缓冲</text><text x=\"426\" y=\"200\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">先在内存攒着</text><text x=\"278\" y=\"180\" font-size=\"15\" text-anchor=\"middle\" fill=\"#123b33\">帧缓冲</text><text x=\"278\" y=\"200\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">画上字形</text><text x=\"130\" y=\"180\" font-size=\"15\" text-anchor=\"middle\" fill=\"#123b33\">显示器</text><text x=\"130\" y=\"200\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">按帧刷新</text><line x1=\"520\" y1=\"184\" x2=\"490\" y2=\"184\" stroke=\"#c1662f\" stroke-width=\"3\"/><polygon points=\"480,184 490,178 490,190\" fill=\"#c1662f\"/><line x1=\"372\" y1=\"184\" x2=\"342\" y2=\"184\" stroke=\"#c1662f\" stroke-width=\"3\"/><polygon points=\"332,184 342,178 342,190\" fill=\"#c1662f\"/><line x1=\"224\" y1=\"184\" x2=\"194\" y2=\"184\" stroke=\"#c1662f\" stroke-width=\"3\"/><polygon points=\"184,184 194,178 194,190\" fill=\"#c1662f\"/><text x=\"320\" y=\"236\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">字符是数（第 6 课），中文是三个字节（第 7 课），加法是门（第 9 课）</text><text x=\"320\" y=\"260\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">这一路比看起来快，因为常碰的数据都留在缓存里（第 11 课）</text><text x=\"320\" y=\"282\" font-size=\"14\" text-anchor=\"middle\" fill=\"#a8501f\">60 赫兹的屏幕：十六毫秒多才亮一次</text></svg>",
            "caption": "一次回车走过的七段路：扫描码进来，帧亮出去，中间每一步都是前面十一课里的某一件东西。"
          },
          {
            "t": "h2",
            "text": "常见坑"
          },
          {
            "t": "ul",
            "items": [
              "以为敲下去的就是字符。键盘给的是扫描码，字符是驱动和输入法换出来的。",
              "以为程序算完屏幕立刻变。输出先攒在缓冲里，屏幕还要等下一帧。",
              "把「中」当成一个东西。它在机器里是三个字节，读的人得按 UTF-8 切。",
              "以为一次按键只惊动一个程序：中断、驱动、终端、程序、图形界面都在场。",
              "把慢算成 CPU 不行。慢的那一段多半是等存储，不是等门。"
            ]
          },
          {
            "t": "h2",
            "text": "任务"
          },
          {
            "t": "ul",
            "items": [
              "把演示里的中换成 A，看 od 打回来几个字节，再对照第 6 课那个表解释它。",
              "把 printf 那一行连着跑两遍，再跑一次 od，说出文件里有几个字节、为什么。",
              "在这条链子上找出三个「会等」的地方，各说清它在等什么。",
              "写一段话，把从按下回车到看见字之间发生的事讲给没学过编程的人听，不许出现「电脑处理了一下」这种说法。"
            ]
          },
          {
            "t": "tip",
            "color": "green",
            "text": "一句话：十二课走完，屏幕上的一次亮起并不是魔法，而是比特、字节、门、指令和存储层层交接的结果。"
          }
        ]
      }
    ]
  }
};
