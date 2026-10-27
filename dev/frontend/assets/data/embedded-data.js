/* 喵站 · 嵌入式入门（单文件形态，与 go-data.js 同构）
 * 12 课从单片机历史走到 RTOS，按 Arduino C++ 风格写示例。
 * 本机没有 PlatformIO、没有开发板：文中代码只做过结构与语法自查，没有编译、没有上传、没有在板子上跑过。 */
window.MIAO_EMBEDDED = {
  tutorial: {
    id: "embedded",
    title: "嵌入式入门",
    intro: "从 1971 年的第一颗微处理器讲到 RTOS：12 课用一块 Arduino 兼容板走完嵌入式的地基，每课都有能照敲的程序和一张机制图。",
    cat: "嵌入式",
    diff: "入门",
    tags: ["嵌入式", "单片机", "Arduino", "PlatformIO"],
    author: "喵站官方",
    cover: "/assets/img/covers/embedded.svg",
    updated: "2026-10-27",
    chapters: [
      {
        id: "e01",
        title: "第 1 课 · 嵌入式的历史：从单片机到物联网",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：知道嵌入式在算什么、单片机这五十年怎么一路变小变便宜，以及今天它藏在哪些设备里。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "嵌入式的字面意思是「嵌进设备里的计算机」。它不是一个行业名词，而是一种用法：把一颗芯片放进洗衣机、门锁、电动车、血糖仪里，让它读传感器、驱动电机、和人打交道。这类芯片通常没有显示器、没有键盘，甚至没有操作系统界面，程序从出厂那一刻就固定在里面。" },
          { t: "p", text: "1971 年，Intel 推出 4004，一颗指甲盖大的芯片第一次把运算单元和控制器放在一起，这是微处理器的起点。1980 年 Intel 发布 8051，把程序存储器、随机存储器、定时器和输入输出口全塞进一颗芯片，单片机这个类别自此成型。之后几十年，同样的东西一路变小、变便宜、变省电。" },
          { t: "p", text: "2005 年 Arduino 出现，它把单片机和一套简单的编程接口绑在一起，让没写过寄存器的人也能在半小时内点亮一盏灯。2016 年之后，ESP32 这类芯片把 Wi-Fi、蓝牙和双核处理器做到几块钱，嵌入式开始大规模连上网，物联网这个词才真正落地。这条线的方向很清楚：硬件越来越强，写程序需要的门槛越来越低，但对功耗和实时性的要求一直没变。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "一块几十块钱的板子能做的事比想象中多：读温度、测距离、驱动电机、点小屏幕、通过 Wi-Fi 上报数据。它没有硬盘也没有桌面系统，但正因为这样，上电几毫秒就能开始工作，靠一节电池能撑一年，在零下二十度也照常运行。" },
          { t: "h2", text: "演示：一个嵌入式程序的外形" },
          { t: "p", text: "先看一段最小骨架。Arduino 风格的程序里没有 main 函数，只有两个固定名字的函数，名字本身就说明了它们的执行顺序。" },
          { t: "code", lang: "cpp", code: `void setup() {
    // 上电后只跑一次：配置引脚、打开串口
}

void loop() {
    // 之后一直重复跑：读传感器、控制引脚
}` },
          { t: "p", text: "setup 用来做准备，loop 是一个永不返回的循环，里面放真正要反复做的事。这个顺序由框架安排好，你不需要自己写 while。现在只要认识这两个名字，后面单独一课会把真正的内容填进去。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240">
  <rect x="24" y="24" width="592" height="192" rx="14" fill="#eef6f4"/>
  <text x="320" y="58" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">从微处理器到物联网</text>
  <line x1="70" y1="140" x2="570" y2="140" stroke="#2a8c78" stroke-width="3"/>
  <circle cx="110" cy="140" r="8" fill="#2a8c78"/>
  <circle cx="250" cy="140" r="8" fill="#2a8c78"/>
  <circle cx="390" cy="140" r="8" fill="#2a8c78"/>
  <circle cx="530" cy="140" r="8" fill="#2a8c78"/>
  <text x="110" y="112" font-size="16" font-weight="700" text-anchor="middle" fill="#173d36">1971</text>
  <text x="110" y="172" font-size="15" text-anchor="middle" fill="#173d36">4004</text>
  <text x="110" y="194" font-size="14" text-anchor="middle" fill="#4d6f67">第一颗微处理器</text>
  <text x="250" y="112" font-size="16" font-weight="700" text-anchor="middle" fill="#173d36">1980</text>
  <text x="250" y="172" font-size="15" text-anchor="middle" fill="#173d36">8051</text>
  <text x="250" y="194" font-size="14" text-anchor="middle" fill="#4d6f67">单片机成型</text>
  <text x="390" y="112" font-size="16" font-weight="700" text-anchor="middle" fill="#173d36">2005</text>
  <text x="390" y="172" font-size="15" text-anchor="middle" fill="#173d36">Arduino</text>
  <text x="390" y="194" font-size="14" text-anchor="middle" fill="#4d6f67">开源硬件</text>
  <text x="530" y="112" font-size="16" font-weight="700" text-anchor="middle" fill="#173d36">2016</text>
  <text x="530" y="172" font-size="15" text-anchor="middle" fill="#173d36">ESP32</text>
  <text x="530" y="194" font-size="14" text-anchor="middle" fill="#4d6f67">物联网起量</text>
</svg>`, caption: "每一次跳跃都伴随成本和体积下降，而功耗与实时性这两条约束始终没变。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把嵌入式等同于写硬件驱动。多数项目只是读几个传感器、控制几个引脚，用不到寄存器细节。",
            "以为板子越贵越适合入门。一块二十来块的兼容板足够学完前十几课的内容。",
            "把 Arduino 当成一门语言。它是一套硬件加软件框架，写的代码本质是 C++。",
            "忽略供电。USB 口只能给几百毫安，接上电机之后板子会反复重启，看起来像程序有 bug。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "写出家里三件带芯片的设备，并说明它需要读什么、控制什么。",
            "按时间顺序写出 4004、8051、Arduino、ESP32 各自解决了什么问题。",
            "观察上面的骨架，指出哪部分只执行一次、哪部分会一直执行。"
          ]},
          { t: "tip", color: "green", text: "一句话：嵌入式就是把计算塞进设备里，硬件一路变小变便宜，但对功耗和实时性的约束始终存在。" }
        ]
      },
      {
        id: "e02",
        title: "第 2 课 · 装工具链：VS Code 与 PlatformIO",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：装好 VS Code 与 PlatformIO，建一个能编译的工程，最后用 pio run 看到编译成功的提示。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "嵌入式开发和写网页最大的不同是：你写的程序不在自己的电脑上运行。电脑负责把源码翻译成芯片能读的机器码，再通过一根 USB 线送进板子的 Flash 存储器；板子断电重启后，从 Flash 里取出指令开始跑。所以工具链分成两半，一半在电脑上编译，一半负责把结果搬进芯片。" },
          { t: "p", text: "PlatformIO 是跑在命令行里的构建工具，VS Code 只是它的图形外壳。它替你记住三件事：这块板子用什么芯片、用哪个框架、编译参数是什么。这些信息写在工程目录的 platformio.ini 里，一行一个键值，换板子通常只改一行 board。" },
          { t: "p", text: "为什么不直接用 Arduino IDE？它把编译、上传、串口监视器塞在一个窗口里，工程一多就难组织。PlatformIO 把目录摆开：src 放源码，lib 放库，platformio.ini 放配置，文件在哪一目了然。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "装好之后，一条命令编译整个工程，一条命令把固件送进板子，一条命令打开串口看打印。同一套命令在三大系统上写法一样。" },
          { t: "h2", text: "演示：从零装到第一次编译" },
          { t: "p", text: "先装 PlatformIO Core，它自带编译器和上传工具，再用 pio --version 确认版本，最后在 VS Code 里装上扩展。扩展只是界面，真正干活的是命令行里的 pio，所以先装 Core。" },
          { t: "code", lang: "bash", code: `python3 -m pip install -U platformio
pio --version
code --install-extension platformio.platformio-ide` },
          { t: "p", text: "接着建一个空工程并编译。project init 按板子型号生成 platformio.ini 和 src/main.cpp，run 只编译不上传。第一次编译要下载对应芯片的工具链，等上几分钟很正常。" },
          { t: "code", lang: "bash", code: `mkdir blink
cd blink
pio project init --board uno
pio run` },
          { t: "p", text: "project init 生成的 src/main.cpp 就是两个空函数，编译它只是验证工具链通了。" },
          { t: "code", lang: "cpp", code: `void setup() {
}

void loop() {
}` },
          { t: "p", text: "成功的标志是终端最后出现 SUCCESS，并且 .pio/build/uno/ 下面多出一个固件文件。这一步没有板子也能做，它只验证代码能不能过编译。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240">
  <rect x="24" y="24" width="592" height="192" rx="14" fill="#eef6f4"/>
  <text x="320" y="56" font-size="19" font-weight="700" text-anchor="middle" fill="#173d36">电脑上编译，USB 送进芯片</text>
  <rect x="30" y="96" width="124" height="64" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/>
  <text x="92" y="122" font-size="14" text-anchor="middle" fill="#173d36">src/main.cpp</text>
  <text x="92" y="144" font-size="14" text-anchor="middle" fill="#4d6f67">你的源码</text>
  <path d="M156 128H184" stroke="#2a8c78" stroke-width="3"/>
  <polygon points="186,128 176,122 176,134" fill="#2a8c78"/>
  <rect x="188" y="96" width="124" height="64" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/>
  <text x="250" y="122" font-size="14" text-anchor="middle" fill="#173d36">编译与链接</text>
  <text x="250" y="144" font-size="14" text-anchor="middle" fill="#4d6f67">PlatformIO</text>
  <path d="M314 128H342" stroke="#2a8c78" stroke-width="3"/>
  <polygon points="344,128 334,122 334,134" fill="#2a8c78"/>
  <rect x="346" y="96" width="124" height="64" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/>
  <text x="408" y="122" font-size="14" text-anchor="middle" fill="#173d36">firmware.hex</text>
  <text x="408" y="144" font-size="14" text-anchor="middle" fill="#4d6f67">机器码</text>
  <path d="M472 128H500" stroke="#2a8c78" stroke-width="3"/>
  <polygon points="502,128 492,122 492,134" fill="#2a8c78"/>
  <rect x="504" y="96" width="112" height="64" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/>
  <text x="560" y="122" font-size="14" text-anchor="middle" fill="#173d36">板子 Flash</text>
  <text x="560" y="144" font-size="14" text-anchor="middle" fill="#4d6f67">断电仍在</text>
  <text x="320" y="192" font-size="15" text-anchor="middle" fill="#4d6f67">上传走 USB 串口，程序断电后仍留在 Flash 里</text>
</svg>`, caption: "编译在电脑上完成，上传只是把一个文件搬进芯片的 Flash。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "pip 装到系统 Python 上报权限错误。加 --user 或改用虚拟环境，不要用 sudo 往系统目录里写。",
            "VS Code 里装了扩展却提示找不到命令。扩展调用的是终端里的 pio，先确认 pio --version 能出数字。",
            "board 名字写错。uno 指 Arduino Uno，拼错就提示找不到开发板定义。",
            "第一次编译卡在下载。工具链要从网上下载，断了就重跑 pio run，缓存会续上。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "装完运行 pio --version，把输出的版本号记下来。",
            "在空目录执行 pio project init --board uno，打开 platformio.ini，读出 board 与 framework 两个键。",
            "用 pio run 编译一次空工程，找到生成的固件文件在第几层目录。",
            "把 board 改成 esp32dev 再编译一次，观察工具链有没有重新下载。"
          ]},
          { t: "tip", color: "green", text: "一句话：电脑负责编译，USB 负责搬运，PlatformIO 把这两步收成几条可重复的命令。" }
        ]
      },
      {
        id: "e03",
        title: "第 3 课 · 第一个程序：点亮 LED",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：把板子插上电脑，写一个让板载 LED 每半秒亮灭一次的程序，并让它真正在板子上跑起来。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "LED 是一个二极管：电流只能从阳极流向阴极，流过时发光。单片机的一个引脚可以输出高电平或低电平，也就是接近 5 伏或接近 0 伏。把 LED 的阳极接引脚、阴极经一个限流电阻接地，引脚拉高时电流流过，灯亮；拉低时两端没有电压差，灯灭。" },
          { t: "p", text: "限流电阻不能省。LED 的内阻很小，直接接 5 伏会瞬间抽走几十毫安，烧掉 LED，也可能超过芯片单个引脚的输出能力。220 欧到 1 千欧都是常见取值，阻值越大越暗。板子上标着 L 的那颗 LED 通常已经串好电阻，接在 13 号引脚上，可以直接用。" },
          { t: "p", text: "程序里只有三件事：pinMode 告诉芯片这个引脚是输出还是输入；digitalWrite 把它拉高或拉低；delay 让程序停在那里等若干毫秒，单位是千分之一秒。注意 delay 期间芯片什么也不做，这一点后面单独一课会展开。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "会点灯，你就有了一个能看见程序在跑的输出设备。后面所有的状态、错误、节奏，都可以先用亮灭或闪烁频率表达出来，再考虑接屏幕。调试嵌入式时，一颗灯往往比一堆打印更直接。" },
          { t: "h2", text: "演示：让板载 LED 闪起来" },
          { t: "p", text: "新建工程后，把 src/main.cpp 写成下面这样。LED_BUILTIN 是框架预定义的常量，在 Uno 上等于 13。" },
          { t: "code", lang: "cpp", code: `void setup() {
    pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
    digitalWrite(LED_BUILTIN, HIGH);
    delay(500);
    digitalWrite(LED_BUILTIN, LOW);
    delay(500);
}` },
          { t: "p", text: "编译用 pio run，上传用 pio run -t upload。上传时板子上的 TX、RX 灯会快闪，说明数据正在进来；传完板子自动重启，灯就开始闪。" },
          { t: "code", lang: "bash", code: `pio run
pio run -t upload
pio device monitor -b 9600` },
          { t: "p", text: "如果灯不闪，先看上传最后一行是不是 SUCCESS，再用 monitor 打开串口，按一下板子上的复位键，看有没有启动信息。串口没东西也不代表程序没跑，可能只是程序里还没有打印。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240">
  <rect x="24" y="24" width="592" height="192" rx="14" fill="#eef6f4"/>
  <text x="320" y="54" font-size="19" font-weight="700" text-anchor="middle" fill="#173d36">电流从引脚经电阻和 LED 流向地</text>
  <rect x="44" y="94" width="112" height="52" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/>
  <text x="100" y="118" font-size="15" text-anchor="middle" fill="#173d36">GPIO 13</text>
  <text x="100" y="138" font-size="14" text-anchor="middle" fill="#4d6f67">输出高电平</text>
  <path d="M156 120H196" stroke="#2a8c78" stroke-width="3"/>
  <rect x="196" y="108" width="104" height="24" rx="4" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/>
  <text x="248" y="98" font-size="14" text-anchor="middle" fill="#173d36">220 欧</text>
  <path d="M300 120H344" stroke="#2a8c78" stroke-width="3"/>
  <polygon points="344,96 344,144 390,120" fill="#f0b429" stroke="#173d36" stroke-width="2"/>
  <line x1="390" y1="94" x2="390" y2="146" stroke="#173d36" stroke-width="3"/>
  <path d="M390 120H434" stroke="#2a8c78" stroke-width="3"/>
  <path d="M434 120H466V136" stroke="#173d36" stroke-width="3" fill="none"/>
  <line x1="446" y1="136" x2="486" y2="136" stroke="#173d36" stroke-width="3"/>
  <line x1="452" y1="144" x2="480" y2="144" stroke="#173d36" stroke-width="3"/>
  <line x1="458" y1="152" x2="474" y2="152" stroke="#173d36" stroke-width="3"/>
  <text x="496" y="140" font-size="14" fill="#173d36">GND</text>
  <path d="M200 176H400" stroke="#2a8c78" stroke-width="2" stroke-dasharray="6 4"/>
  <polygon points="404,176 392,170 392,182" fill="#2a8c78"/>
  <text x="300" y="166" font-size="14" text-anchor="middle" fill="#4d6f67">电流方向</text>
  <text x="320" y="200" font-size="14" text-anchor="middle" fill="#4d6f67">限流电阻把电流压在安全范围内</text>
</svg>`, caption: "引脚拉高时才有电压差，电流才有动力流过 LED。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "LED 长脚接错。长脚是阳极，接引脚；短脚是阴极，接电阻再到地。接反了不亮，但一般不会烧。",
            "忘了限流电阻。直接接 5 伏和地，LED 会在几秒内发烫损坏。",
            "以为 delay(500) 是 500 秒。它的单位是毫秒，500 毫秒就是半秒。",
            "上传时报端口被占用。串口监视器开着会占住端口，关掉再传。",
            "板子型号选错。编译能过但上传失败，检查 platformio.ini 里的 board 是否与实际板子一致。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "照演示让板载 LED 亮一秒灭一秒，数十秒看它闪了几次。",
            "把两个 delay 都改成 100，观察人眼还能不能分辨亮灭。",
            "把 LED_BUILTIN 换成 9，外接一颗 LED 到 9 号脚，确认它能亮。",
            "把 delay(500) 改成 delay(0)，写下观察到的现象并解释。"
          ]},
          { t: "tip", color: "green", text: "一句话：引脚输出高低电平，限流电阻保护 LED，delay 决定节奏；能点灯就说明整条工具链通了。" }
        ]
      },
      {
        id: "e04",
        title: "第 4 课 · GPIO 输入输出",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：把引脚从输出改成输入，读一个按键的状态，并让按键控制灯的亮灭。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "引脚的方向是配置出来的。pinMode(2, INPUT) 把它设成输入，芯片就不再驱动它，而是去测量它上面的电压：接近 5 伏读成 HIGH，接近 0 伏读成 LOW。测量结果用 digitalRead 取回来，只有这两个值。" },
          { t: "p", text: "悬空的输入脚是麻烦。按键没按下时，引脚和任何电平都不相连，电压随机漂移，读数会在高低之间乱跳。解决办法是加一个上拉电阻，把引脚默认拉到高电平；按下按键时引脚被短接到地，读数变低。INPUT_PULLUP 让芯片内部接通这个电阻，省掉外部元件。" },
          { t: "p", text: "机械按键在闭合和断开的一瞬间会抖动几毫秒，触点反复通断，程序可能把一次按下读成好几次。最省事的做法是读到变化后等 10 到 20 毫秒再读一次，确认状态没变才认。更稳的写法用一个变量记住上次的状态，只在真正变化时动作，这一招后面单独一课会用到。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "输入引脚能接的东西远不止按键：红外对管可以判断有没有人经过，霍尔元件能感受磁铁，水位浮球开关能报水位。它们的共同点是把物理世界的是非题变成 HIGH 或 LOW。" },
          { t: "h2", text: "演示：按键控制灯" },
          { t: "p", text: "接线只有两根：按键一端接 2 号脚，另一端接地。因为用了内部上拉，不按的时候读到 HIGH，按下读到 LOW。程序里把这个关系反过来，让按下时灯亮。" },
          { t: "code", lang: "cpp", code: `void setup() {
    pinMode(2, INPUT_PULLUP);
    pinMode(13, OUTPUT);
}

void loop() {
    if (digitalRead(2) == LOW) {
        digitalWrite(13, HIGH);
    } else {
        digitalWrite(13, LOW);
    }
    delay(10);
}` },
          { t: "p", text: "delay(10) 放在循环末尾，既是消抖，也顺便限制了读引脚的速度。它会让整个循环变慢，但对一个按键来说 10 毫秒完全够用。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280">
  <rect x="24" y="20" width="592" height="256" rx="14" fill="#eef6f4"/>
  <text x="320" y="54" font-size="19" font-weight="700" text-anchor="middle" fill="#173d36">上拉电阻给输入脚一个默认高电平</text>
  <text x="300" y="84" font-size="15" text-anchor="middle" fill="#173d36">5V</text>
  <path d="M300 92V100" stroke="#173d36" stroke-width="3"/>
  <rect x="286" y="100" width="28" height="64" rx="4" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/>
  <text x="360" y="122" font-size="14" fill="#173d36">上拉电阻 10k</text>
  <text x="360" y="146" font-size="14" fill="#4d6f67">不按时把引脚拉高</text>
  <path d="M300 164V190" stroke="#173d36" stroke-width="3"/>
  <circle cx="300" cy="196" r="6" fill="#2a8c78"/>
  <path d="M306 196H420" stroke="#2a8c78" stroke-width="3"/>
  <polygon points="424,196 412,190 412,202" fill="#2a8c78"/>
  <rect x="426" y="170" width="140" height="52" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/>
  <text x="496" y="194" font-size="15" text-anchor="middle" fill="#173d36">GPIO 2 输入</text>
  <text x="496" y="214" font-size="14" text-anchor="middle" fill="#4d6f67">读到 HIGH</text>
  <path d="M300 202V214" stroke="#173d36" stroke-width="3"/>
  <rect x="262" y="214" width="76" height="30" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/>
  <text x="300" y="235" font-size="14" text-anchor="middle" fill="#173d36">按键</text>
  <path d="M300 244V256" stroke="#173d36" stroke-width="3"/>
  <line x1="276" y1="256" x2="324" y2="256" stroke="#173d36" stroke-width="3"/>
  <line x1="284" y1="264" x2="316" y2="264" stroke="#173d36" stroke-width="3"/>
  <line x1="292" y1="272" x2="308" y2="272" stroke="#173d36" stroke-width="3"/>
  <text x="336" y="268" font-size="14" fill="#173d36">GND</text>
  <text x="62" y="126" font-size="14" fill="#4d6f67">芯片内部</text>
  <text x="62" y="148" font-size="14" fill="#4d6f67">接通这只电阻</text>
</svg>`, caption: "按下按键等于把引脚直接接到地，读数从高变低，这就是一次有效的输入。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "用 INPUT 又没接外部电阻。引脚悬空，读数乱跳，看起来像按键坏了。",
            "把上拉和下拉搞反。INPUT_PULLUP 时按下读到 LOW，判断条件要跟着反。",
            "按键一端接 5V 一端接引脚。松手时引脚仍然悬空，读数照样乱跳。",
            "以为一次 delay 能解决所有抖动。延迟太短挡不住，太长又让按键反应变迟钝。",
            "把电机或继电器线圈直接接在引脚上。引脚扛不住这个电流，要经三极管或驱动模块。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 INPUT_PULLUP 接一个按键，做到按下时板载 LED 亮、松开灭。",
            "把判断条件里的 LOW 改成 HIGH，描述灯的行为变成了什么样。",
            "去掉 delay(10)，快速按十次，记录灯的状态和预期差了几次。",
            "画出按键松开和按下两种情况下，2 号脚分别接到哪里。"
          ]},
          { t: "tip", color: "green", text: "一句话：输入引脚测的是电压高低，上拉电阻给它确定的默认值，消抖让一次按下只算一次。" }
        ]
      },
      {
        id: "e05",
        title: "第 5 课 · 变量与数据类型（在单片机上）",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：知道单片机那一点点 RAM 怎么分给变量、几种常用类型各占几个字节，以及溢出为什么悄悄改掉你的数。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "单片机里的 RAM 很小，Uno 上只有 2 KB，比一张缩略图还小。每个变量都要占几个字节，类型决定占几个：uint8_t 占 1 个字节，能表示 0 到 255；int 在 AVR 上占 2 个字节，能表示 -32768 到 32767；unsigned long 占 4 个字节，能到四十多亿；float 也占 4 个字节，但有精度损失。" },
          { t: "p", text: "超出范围不会报错，只会回绕。uint8_t 的 255 加 1 变成 0，int 的 32767 加 1 变成 -32768。这类错误最难查，因为程序照常运行，只是数不对。选类型的原则是：先想清楚范围，再挑刚好装得下的最小类型，省下来的 RAM 在单片机上是实打实的。" },
          { t: "p", text: "变量的作用域也要留意。写在函数里面的变量，函数一返回就消失，下次进来重新分配；写在外面的全局变量从通电到断电一直存在，也一直占着那块 RAM。初学阶段尽量把变量写在用它的函数里，能少踩很多「值怎么自己变了」的坑。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "有了类型概念，你才能算清楚一个程序会不会把 RAM 用光，也才能解释为什么计时变量要用 unsigned long 而不是 int：毫秒数计到 32767 只要 32 秒，之后就绕回负数了。" },
          { t: "h2", text: "演示：用变量控制节奏" },
          { t: "p", text: "把亮灯时长抽成一个变量，改一个数字就能改节奏，不用在几处 delay 里同步修改。下面这段让灯亮 200 毫秒、灭 800 毫秒。" },
          { t: "code", lang: "cpp", code: `int onTime = 200;

void setup() {
    pinMode(13, OUTPUT);
}

void loop() {
    digitalWrite(13, HIGH);
    delay(onTime);
    digitalWrite(13, LOW);
    delay(1000 - onTime);
}` },
          { t: "p", text: "再看几行类型实验。它们都不会报错，但结果和直觉相反，这正是溢出。" },
          { t: "code", lang: "cpp", code: `uint8_t level = 250;
level = level + 10;      // 结果 4，不是 260
int sensor = 32767;
sensor = sensor + 1;     // 结果 -32768` },
          { t: "p", text: "第一段里，250 加 10 超过一个字节的上限，进位被丢掉，只剩 4。第二段是有符号数到顶之后翻到最负。看到数字突然变号或变小，先检查类型范围。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280">
  <rect x="24" y="24" width="592" height="232" rx="14" fill="#eef6f4"/>
  <text x="320" y="56" font-size="19" font-weight="700" text-anchor="middle" fill="#173d36">一个字节装不下 256</text>
  <rect x="90" y="86" width="56" height="48" rx="4" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/>
  <rect x="152" y="86" width="56" height="48" rx="4" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/>
  <rect x="214" y="86" width="56" height="48" rx="4" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/>
  <rect x="276" y="86" width="56" height="48" rx="4" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/>
  <rect x="338" y="86" width="56" height="48" rx="4" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/>
  <rect x="400" y="86" width="56" height="48" rx="4" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/>
  <rect x="462" y="86" width="56" height="48" rx="4" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/>
  <rect x="524" y="86" width="56" height="48" rx="4" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/>
  <text x="118" y="116" font-size="14" text-anchor="middle" fill="#4d6f67">128</text>
  <text x="180" y="116" font-size="14" text-anchor="middle" fill="#4d6f67">64</text>
  <text x="242" y="116" font-size="14" text-anchor="middle" fill="#4d6f67">32</text>
  <text x="304" y="116" font-size="14" text-anchor="middle" fill="#4d6f67">16</text>
  <text x="366" y="116" font-size="14" text-anchor="middle" fill="#4d6f67">8</text>
  <text x="428" y="116" font-size="14" text-anchor="middle" fill="#4d6f67">4</text>
  <text x="490" y="116" font-size="14" text-anchor="middle" fill="#4d6f67">2</text>
  <text x="552" y="116" font-size="14" text-anchor="middle" fill="#173d36">1</text>
  <path d="M552 138V166C552 180 118 180 118 156" stroke="#c0504d" stroke-width="3" fill="none"/>
  <polygon points="118,150 112,162 124,162" fill="#c0504d"/>
  <text x="330" y="200" font-size="15" text-anchor="middle" fill="#c0504d">再加 1，全部位清零，回到 0</text>
  <text x="320" y="230" font-size="15" text-anchor="middle" fill="#173d36">uint8_t：0 到 255，占 1 字节</text>
  <text x="320" y="252" font-size="15" text-anchor="middle" fill="#173d36">int：-32768 到 32767，占 2 字节</text>
  <text x="320" y="76" font-size="14" text-anchor="middle" fill="#4d6f67">八位全部为 1 就是 255</text>
</svg>`, caption: "溢出不是错误，是位数不够时的自然回绕，编译器不会提醒你。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "拿 int 存毫秒。AVR 上 int 是 16 位，32 秒就溢出，计时全乱。",
            "以为 float 精确。0.1 加十次不一定等于 1，比较浮点数要看差值是否足够小。",
            "变量名拼错。C++ 区分大小写，ledState 和 ledstate 是两个不同的变量。",
            "在函数里定义大数组。局部数组放在栈上，2 KB 的 RAM 很容易被它撑爆。",
            "全局变量越加越多。每个全局变量都常驻 RAM，能不全局就不全局。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "列出 uint8_t、int、unsigned long 三种类型能表示的最大值，并算出各能计多少毫秒。",
            "把演示里的 onTime 改成 50 和 900，观察灯的明暗比例怎么变。",
            "让一个 uint8_t 变量从 250 开始每次加 1，第 6 次加完它等于多少？",
            "解释为什么记录毫秒数的变量不能用 int。"
          ]},
          { t: "tip", color: "green", text: "一句话：类型决定字节数和取值范围，溢出不报错只会回绕，选类型先算范围再算 RAM。" }
        ]
      },
      {
        id: "e06",
        title: "第 6 课 · 串口通信",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：让板子通过 USB 线往电脑打字，也能接收电脑发来的字符，并用串口观察程序内部的值。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "串口是最古老的通信方式之一：两根线，一根发一根收，按约定的速度一位一位地传。它没有时钟线，靠双方事先约好波特率，常见 9600 和 115200。9600 表示每秒 9600 位，一个字节加起始位和停止位大约占 10 位，所以每秒最多传九百多个字节。" },
          { t: "p", text: "Uno 的 USB 口后面其实是一颗转换芯片，它把 USB 协议翻译成串口的收发信号，所以电脑上看到的是一个串口设备。程序里的 Serial 对象封装了这一切：begin 设定波特率，print 发文本，println 发完补一个换行，available 告诉你缓冲区里还有几个字节没读。" },
          { t: "p", text: "串口是排队的。芯片收到的字节先放进一个几十字节的缓冲区，程序读多快就取多快，读得慢就会丢。所以在 loop 里不要放长时间的 delay，否则电脑一次发来二十个字符，缓冲区装不下，后面的就没了。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "串口是你和板子之间唯一的双向通道。可以打印传感器读数、看程序走到哪一步、接收一条命令让灯换节奏，也可以接一块蓝牙模块，让手机代替电脑。" },
          { t: "h2", text: "演示：回显程序" },
          { t: "p", text: "下面这段把电脑发来的每个字符原样打回去，前面加一句提示。打开串口监视器，波特率选 9600，敲一个字就能看到一行回应。" },
          { t: "code", lang: "cpp", code: `void setup() {
    Serial.begin(9600);
}

void loop() {
    if (Serial.available() > 0) {
        char c = Serial.read();
        Serial.print("收到: ");
        Serial.println(c);
    }
    delay(20);
}` },
          { t: "p", text: "Serial.available() 返回缓冲区里待读的字节数，大于 0 说明有数据。Serial.read() 取走一个字节，用 char 接住就是那个字符。注意 read 一次只取一个，发一整句话要循环取多次。" },
          { t: "code", lang: "bash", code: `pio device monitor -b 9600` },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280">
  <rect x="24" y="20" width="592" height="252" rx="14" fill="#eef6f4"/>
  <text x="320" y="54" font-size="19" font-weight="700" text-anchor="middle" fill="#173d36">一个字节 = 起始位 + 8 位数据 + 停止位</text>
  <text x="40" y="96" font-size="14" fill="#4d6f67">空闲高</text>
  <path d="M40 116H100V196H140V116H180V196H220V116H260H300V196H340H380V116H420V196H460V116H580" stroke="#2a8c78" stroke-width="3" fill="none"/>
  <line x1="100" y1="96" x2="100" y2="216" stroke="#9dbdb5" stroke-width="1" stroke-dasharray="4 4"/>
  <line x1="140" y1="96" x2="140" y2="216" stroke="#9dbdb5" stroke-width="1" stroke-dasharray="4 4"/>
  <line x1="460" y1="96" x2="460" y2="216" stroke="#9dbdb5" stroke-width="1" stroke-dasharray="4 4"/>
  <line x1="500" y1="96" x2="500" y2="216" stroke="#9dbdb5" stroke-width="1" stroke-dasharray="4 4"/>
  <text x="120" y="238" font-size="14" text-anchor="middle" fill="#173d36">起始位</text>
  <text x="300" y="238" font-size="14" text-anchor="middle" fill="#173d36">8 个数据位</text>
  <text x="480" y="238" font-size="14" text-anchor="middle" fill="#173d36">停止位</text>
  <text x="120" y="260" font-size="14" text-anchor="middle" fill="#4d6f67">低电平</text>
  <text x="300" y="260" font-size="14" text-anchor="middle" fill="#4d6f67">低位先发</text>
  <text x="480" y="260" font-size="14" text-anchor="middle" fill="#4d6f67">回到高电平</text>
  <text x="320" y="90" font-size="14" text-anchor="middle" fill="#4d6f67">9600 波特时每位约 104 微秒</text>
</svg>`, caption: "没有时钟线，接收方靠起始位的下降沿对齐，再按约定间隔逐位采样。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "两边波特率不一致。电脑选 115200 而程序写 9600，屏幕上全是乱码。",
            "以为不打开串口就收不到。数据其实发了，只是没有接收方，直接丢掉。",
            "用多次 print 拼一行。发送是分段的，中间可能被别的输出插进来。",
            "在循环里频繁打印。串口发送很慢，几十微秒能被拖成几毫秒，节奏全乱。",
            "上传时串口监视器还开着。端口被占用，上传会失败。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "让板子每秒打印一次 hello，用串口监视器确认行数和时间对得上。",
            "发数字 1 让板载 LED 亮，发 0 让它灭。",
            "把程序波特率改成 115200，观察监视器要跟着改哪里才能正常显示。",
            "打印一次 Serial.available() 的值，解释它为什么可能是 0。"
          ]},
          { t: "tip", color: "green", text: "一句话：串口靠约定波特率逐位传输，缓冲区很小，读得慢就会丢数据。" }
        ]
      },
      {
        id: "e07",
        title: "第 7 课 · 定时器",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：看懂芯片内部的定时器怎么数时间，并用 millis 写一个不阻塞的节奏，让闪灯期间还能做别的事。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "芯片里有一组独立的计数器，叫定时器。它接着系统时钟，每来一个时钟脉冲就把计数值加一，加到寄存器能装的最大值就归零，同时置一个溢出标志。时钟太快，所以前面还有一级预分频器，把 16 MHz 除以 64 或 256，计数器就按更慢的节奏走。" },
          { t: "p", text: "要让定时器每隔固定时间提醒你一次，有两种做法：一是等它溢出，二是设一个比较值，计到那个数就产生匹配事件。前者周期固定为计数范围，后者可以随时设定。这两种事件都能触发中断，让程序停下手头的事去处理，但那是后面单独一课的内容。" },
          { t: "p", text: "Arduino 把常用的毫秒计数包装成了 millis()：它返回上电以来经过的毫秒数，类型是 unsigned long。它背后就是某个定时器的溢出次数乘以每毫秒的计数。用 millis 记时间戳，再和当前值相减，就能判断过了多久，不需要 delay 把整个程序卡住。" },
          { t: "p", text: "为什么相减比直接比较时间戳安全？unsigned long 也会溢出，大约 49 天绕回一次。两个无符号数相减，即使跨越了绕回点，结果仍然正确，这是无符号运算的特性。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "有了不阻塞的计时，你可以让灯按自己的节奏闪、让屏幕每秒刷新、让传感器每五秒上报一次，而它们互不耽误。一个 loop 里可以同时安排好几件周期不同的事。" },
          { t: "h2", text: "演示：用 millis 做不阻塞的闪灯" },
          { t: "p", text: "下面这段每 500 毫秒翻转一次灯的状态，其余时间 loop 立刻跑完，可以插入别的任务。" },
          { t: "code", lang: "cpp", code: `unsigned long last = 0;

void setup() {
    pinMode(13, OUTPUT);
}

void loop() {
    if (millis() - last >= 500) {
        last = millis();
        digitalWrite(13, !digitalRead(13));
    }
}` },
          { t: "p", text: "last 记录上一次翻转的时刻。millis() - last 得到已经过去的毫秒数，够 500 就执行，并把 last 更新成当前时刻。用减法而不是 millis() >= last + 500，是为了让 49 天后的绕回也不出错。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280">
  <rect x="24" y="20" width="592" height="248" rx="14" fill="#eef6f4"/>
  <text x="320" y="50" font-size="18" font-weight="700" text-anchor="middle" fill="#173d36">时钟太快，先分频再计数</text>
  <rect x="32" y="68" width="136" height="48" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/>
  <text x="100" y="98" font-size="14" text-anchor="middle" fill="#173d36">16 MHz 时钟</text>
  <path d="M170 92H188" stroke="#2a8c78" stroke-width="3"/>
  <polygon points="190,92 180,86 180,98" fill="#2a8c78"/>
  <rect x="192" y="68" width="136" height="48" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/>
  <text x="260" y="98" font-size="14" text-anchor="middle" fill="#173d36">预分频 ÷64</text>
  <path d="M330 92H348" stroke="#2a8c78" stroke-width="3"/>
  <polygon points="350,92 340,86 340,98" fill="#2a8c78"/>
  <rect x="352" y="68" width="136" height="48" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/>
  <text x="420" y="92" font-size="14" text-anchor="middle" fill="#173d36">计数器 +1</text>
  <text x="420" y="108" font-size="14" text-anchor="middle" fill="#4d6f67">每 4 微秒一次</text>
  <path d="M490 92H508" stroke="#2a8c78" stroke-width="3"/>
  <polygon points="510,92 500,86 500,98" fill="#2a8c78"/>
  <rect x="512" y="68" width="104" height="48" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/>
  <text x="564" y="98" font-size="14" text-anchor="middle" fill="#173d36">计满归零</text>
  <path d="M60 232L130 160L130 232L200 160L200 232L270 160L270 232L340 160L340 232L410 160L410 232L480 160L480 232L550 160L550 232" stroke="#2a8c78" stroke-width="3" fill="none"/>
  <line x1="56" y1="200" x2="576" y2="200" stroke="#c0504d" stroke-width="2" stroke-dasharray="6 5"/>
  <text x="574" y="194" font-size="14" text-anchor="end" fill="#c0504d">比较值</text>
  <text x="38" y="156" font-size="14" fill="#4d6f67">65535</text>
  <text x="40" y="252" font-size="14" fill="#4d6f67">0</text>
  <text x="320" y="258" font-size="14" text-anchor="middle" fill="#4d6f67">计满 65536 次约 262 毫秒，溢出后从 0 重来</text>
</svg>`, caption: "计数器是锯齿波：慢慢爬升、到顶归零；比较值和溢出都能当作时间信号。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "在判断里写 millis() > last + 500。绕回之后这个条件永远不成立，灯就停住了。",
            "把 last 定义成 int。毫秒数很快超过 32767，计时直接错乱。",
            "循环里用 delay 当节拍。delay 期间什么都不能做，两个任务会互相拖慢。",
            "忘了更新 last。条件一直成立，灯会以循环速度疯狂翻转。",
            "以为 millis 精确到微秒。它只到毫秒，要求更细就得直接配置定时器寄存器。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 millis 让板载 LED 每 200 毫秒翻转一次，同时让串口每秒打印一次计数。",
            "把 500 改成 1000，用秒表核对十次翻转一共用了多少秒。",
            "解释判断条件为什么写成相减的形式，而不是直接比大小。",
            "让两颗灯分别以 300 毫秒和 700 毫秒的周期闪，只用一个 loop。"
          ]},
          { t: "tip", color: "green", text: "一句话：定时器把时钟变成计数值，millis 把计数值变成时间戳，相减判断让等待不阻塞。" }
        ]
      },
      {
        id: "e08",
        title: "第 8 课 · 中断",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：明白中断为什么会打断主循环、什么活该放进中断里，并让一个按键计数在后台自己累加。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "主循环是一条线：从上到下跑完 loop，再从头开始。中断是另一条线：芯片的某个外设在特定事件发生时拉一下处理器的袖口，处理器立刻把当前指令的地址存起来，跳到一段专门的处理函数里执行，执行完再回到刚才的位置继续。整个过程没有你的 if 参与。" },
          { t: "p", text: "能触发中断的事件很多：引脚电平从高变低、定时器计满、串口收到一个字节、模数转换完成。每个事件对应一个中断向量，也就是处理函数在表里的位置。attachInterrupt 把某个引脚的边沿事件绑到一个函数上，第二个参数是函数名，第三个参数指定触发条件：RISING、FALLING 或 CHANGE。" },
          { t: "p", text: "中断函数要短。执行期间，同级的中断被挡住，主循环也停着；如果在里面 delay 或者打印，几十微秒会变成几十毫秒，别的中断事件可能就丢了。正确做法是只做最少的事：改一个标志、加一个计数，把耗时的工作留给主循环。" },
          { t: "p", text: "中断和主循环共享的变量要加 volatile，告诉编译器这个值可能在别处被改，每次都必须从 RAM 重新读，不能缓存进寄存器。类型也要选能一次读完的，8 位和 32 位整数在 AVR 上是单条指令读写，16 位就不是，读到一半被打断会得到拼接错的值。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "有了中断，按键不用反复轮询也不会漏按，编码器转得再快也能数清脉冲，串口来数据可以立刻响应。它把等事件发生变成了事件来找你。" },
          { t: "h2", text: "演示：按键计数" },
          { t: "p", text: "2 号脚接按键另一端到地，用内部上拉。按下时引脚从高变低，产生一个下降沿，每来一次计数加一。主循环只负责把计数打印出来。" },
          { t: "code", lang: "cpp", code: `volatile int count = 0;
void onPress() {
    count = count + 1;
}

void setup() {
    pinMode(2, INPUT_PULLUP);
    attachInterrupt(digitalPinToInterrupt(2), onPress, FALLING);
}

void loop() {
    Serial.println(count);
    delay(300);
}` },
          { t: "p", text: "attachInterrupt 的第一个参数用 digitalPinToInterrupt(2) 转换，不同板子上同一个物理引脚对应的中断编号不一样，直接写数字换板时会出错。在 PlatformIO 里源文件是 main.cpp，函数要先定义再使用，所以处理函数写在 setup 前面。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300">
  <rect x="24" y="20" width="592" height="252" rx="14" fill="#eef6f4"/>
  <text x="320" y="48" font-size="19" font-weight="700" text-anchor="middle" fill="#173d36">中断把主循环切成两段</text>
  <text x="300" y="80" font-size="14" text-anchor="middle" fill="#c0504d">按键产生下降沿</text>
  <rect x="56" y="90" width="528" height="34" rx="6" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/>
  <rect x="262" y="90" width="86" height="34" fill="#f6d9b0"/>
  <text x="120" y="112" font-size="14" fill="#173d36">主循环在跑</text>
  <text x="305" y="112" font-size="14" text-anchor="middle" fill="#173d36">被打断</text>
  <path d="M305 124V156" stroke="#c0504d" stroke-width="3"/>
  <polygon points="305,160 299,148 311,148" fill="#c0504d"/>
  <rect x="112" y="160" width="416" height="66" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/>
  <text x="320" y="186" font-size="15" text-anchor="middle" fill="#173d36">中断服务函数：计数加一</text>
  <text x="320" y="208" font-size="14" text-anchor="middle" fill="#4d6f67">保存现场，执行，立刻返回</text>
  <text x="320" y="250" font-size="14" text-anchor="middle" fill="#4d6f67">返回后主循环从断点继续，计数已经变了</text>
</svg>`, caption: "中断函数插在主循环中间执行，主循环并不知道自己被暂停过。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "中断函数里调用 delay 或 Serial.print。它们内部靠中断和轮询推进，会把系统拖住甚至卡死。",
            "共享变量忘了 volatile。编译器把值缓存进寄存器，主循环永远读到旧值。",
            "在中断里改 16 位以上的变量。读写不是一步完成的，可能只改了一半。",
            "按键没消抖。一次按下可能触发好几次中断，计数虚高。",
            "把耗时计算放进中断。主循环被拖慢，其它事件的处理被推迟。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 FALLING 触发统计十次按键，和串口打印的数字核对。",
            "把触发条件改成 RISING，说明计数在什么时候加一。",
            "去掉 volatile 再编译，观察行为有没有变化，并解释原因。",
            "在中断函数里加一句 delay(100)，描述主循环受到的影响。"
          ]},
          { t: "tip", color: "green", text: "一句话：中断是硬件插队，处理函数越短越好，和主循环共享的变量要加 volatile。" }
        ]
      },
      {
        id: "e09",
        title: "第 9 课 · PWM",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：理解占空比怎么变成平均电压，用 analogWrite 让一颗 LED 从暗到亮平滑变化。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "数字引脚只会输出高和低，没法输出 2.5 伏。PWM 用另一种办法模拟中间值：把引脚快速地一开一关，一个周期里开的时间占比叫占空比。开一半时间，负载上得到的平均电压就是一半。开关频率足够高时，LED 看起来是稳定的一半亮度，电机也不会抖。" },
          { t: "p", text: "Arduino 的 analogWrite 取值 0 到 255，对应占空比从零到百分之百。它不是真的模拟输出，而是配置定时器，让硬件在每个周期自动把引脚拉高、到点拉低，CPU 不参与。Uno 上支持 PWM 的引脚标着波浪号，是 3、5、6、9、10、11。" },
          { t: "p", text: "频率和分辨率是一对矛盾。定时器时钟固定，周期越短，一个周期里能划分的档位越少。Uno 默认的 PWM 频率大约 490 赫兹，8 位分辨率；把频率调高，档位就会减少。驱动 LED 用默认值足够，驱动电机要选频率躲开人耳能听到的范围。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "PWM 能调 LED 亮度、调电机转速、控制舵机角度、模拟一段音频、参与充电控制。凡是要连续调节而芯片只有开关两种状态的地方，几乎都有它的影子。" },
          { t: "h2", text: "演示：呼吸灯" },
          { t: "p", text: "9 号脚接一颗 LED 和限流电阻。下面这段让占空比从 0 慢慢加到 255，再跳回 0，形成一次呼吸。" },
          { t: "code", lang: "cpp", code: `void setup() {
    pinMode(9, OUTPUT);
}

void loop() {
    for (int duty = 0; duty <= 255; duty = duty + 5) {
        analogWrite(9, duty);
        delay(20);
    }
    analogWrite(9, 0);
    delay(500);
}` },
          { t: "p", text: "循环变量 duty 每步加 5，51 步走完，每步停 20 毫秒，上升大约一秒。analogWrite 的参数超出 0 到 255 会被截断，写成 300 不会报错，只是按 255 处理。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280">
  <rect x="24" y="20" width="592" height="248" rx="14" fill="#eef6f4"/>
  <text x="320" y="44" font-size="19" font-weight="700" text-anchor="middle" fill="#173d36">占空比决定平均电压</text>
  <text x="36" y="90" font-size="14" fill="#4d6f67">5V</text>
  <text x="36" y="132" font-size="14" fill="#4d6f67">0V</text>
  <path d="M70 128V84H110V128H230V84H270V128H390V84H430V128H550V84H570V128" stroke="#2a8c78" stroke-width="3" fill="none"/>
  <text x="320" y="152" font-size="14" text-anchor="middle" fill="#173d36">占空比 25%：高 1 份，低 3 份</text>
  <text x="36" y="192" font-size="14" fill="#4d6f67">5V</text>
  <text x="36" y="234" font-size="14" fill="#4d6f67">0V</text>
  <path d="M70 230V186H190V230H230V186H350V230H390V186H510V230H550V186H570V230" stroke="#2a8c78" stroke-width="3" fill="none"/>
  <text x="320" y="256" font-size="14" text-anchor="middle" fill="#173d36">占空比 75%：高 3 份，低 1 份</text>
  <line x1="70" y1="72" x2="570" y2="72" stroke="#9dbdb5" stroke-width="1" stroke-dasharray="5 5"/>
  <text x="320" y="68" font-size="14" text-anchor="middle" fill="#4d6f67">一个周期的长度固定不变</text>
</svg>`, caption: "周期不变，只改高电平占的比例；比例乘以 5 伏，就是万用表看到的平均值。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "在非 PWM 引脚上调 analogWrite。它只会变成普通的 digitalWrite，要么全亮要么全灭。",
            "以为 analogWrite 输出真电压。万用表测到的是平均值，示波器上看到的是方波。",
            "频率选在 200 赫兹附近驱动电机。人耳能听到绕组啸叫，换到 1 千赫以上会安静很多。",
            "占空比给 0 却期待灯微亮。0 就是完全关闭。",
            "用 delay 做渐变又同时要做别的事。渐变会独占整个循环，得改用 millis。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "让 LED 从暗到亮再到暗完整呼吸一次，估算这个周期有多长。",
            "把占空比固定在 128，用手机摄像头对着 LED 拍，观察画面有没有条纹。",
            "把步长从 5 改成 1，比较渐变的顺滑程度和一次呼吸的时长。",
            "查一下你手上板子哪些引脚支持 PWM，把它们列出来。"
          ]},
          { t: "tip", color: "green", text: "一句话：PWM 用开关的时间比例模拟中间电压，占空比决定亮度，频率决定闪不闪。" }
        ]
      },
      {
        id: "e10",
        title: "第 10 课 · ADC",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：把旋钮或光敏电阻的电压读成一个数字，并知道 10 位、参考电压和精度之间的关系。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "真实世界的量是连续的：温度、光照、压力都在一个小范围内连续变化。芯片只会数数，所以要有一个模数转换器，把电压切成一段一段，用整数表示。Uno 的 ADC 是 10 位，把 0 到 5 伏切成 1024 份，每份大约 4.9 毫伏，读出来的值在 0 到 1023 之间。" },
          { t: "p", text: "转换需要一个参考电压，所有刻度都相对它计算。默认参考是供电的 5 伏，如果 USB 供电实际只有 4.8 伏，读数就会整体偏移。要求准确时，可以改用芯片内部的基准或者外部基准芯片，让刻度有一个稳定的锚点。" },
          { t: "p", text: "模拟输入也有阻抗要求。信号源内阻太高，采样电容充不满，读数会偏低而且跳。光敏电阻这类元件阻值变化大，接一个分压电阻再进 ADC 更稳。转换本身要十几个时钟周期，连续读同一个通道时，前一次的结果可能还没稳定。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "接上电位器能读旋钮位置，接上热敏电阻能读温度，接上分压后的电池能估电量，接上麦克风模块能看声音大小。模数转换是把模拟世界搬进程序的第一道门。" },
          { t: "h2", text: "演示：读电位器并换算毫伏" },
          { t: "p", text: "电位器三个脚：两端接 5V 和 GND，中间抽头接 A0。转动旋钮，A0 上的电压在 0 到 5 伏之间连续变化。" },
          { t: "code", lang: "cpp", code: `void setup() {
    Serial.begin(9600);
}

void loop() {
    int raw = analogRead(A0);
    long mv = raw * 5000L / 1023;
    Serial.print("raw=");
    Serial.print(raw);
    Serial.print(" mv=");
    Serial.println(mv);
    delay(200);
}` },
          { t: "p", text: "raw 是原始刻度，mv 是换算出的毫伏。先乘后除是为了保住精度，写成 raw / 1023 * 5000 会先得到 0；5000 后面那个 L 把运算提到 32 位，否则 1023 乘 5000 会撑爆 16 位的 int。analogRead 每次调用都触发一次新的转换，两次读之间留一点时间更稳。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280">
  <rect x="24" y="20" width="592" height="248" rx="14" fill="#eef6f4"/>
  <text x="320" y="44" font-size="19" font-weight="700" text-anchor="middle" fill="#173d36">连续电压被切成 1024 级</text>
  <line x1="70" y1="80" x2="70" y2="200" stroke="#173d36" stroke-width="2"/>
  <line x1="70" y1="200" x2="240" y2="200" stroke="#173d36" stroke-width="2"/>
  <text x="38" y="86" font-size="14" fill="#4d6f67">5V</text>
  <text x="38" y="204" font-size="14" fill="#4d6f67">0V</text>
  <path d="M80 176C110 96 140 206 170 128C188 92 214 156 232 140" stroke="#2a8c78" stroke-width="3" fill="none"/>
  <path d="M236 140H258" stroke="#2a8c78" stroke-width="3"/>
  <polygon points="260,140 250,134 250,146" fill="#2a8c78"/>
  <rect x="262" y="110" width="108" height="56" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/>
  <text x="316" y="134" font-size="14" text-anchor="middle" fill="#173d36">采样保持</text>
  <text x="316" y="154" font-size="14" text-anchor="middle" fill="#4d6f67">锁住一瞬间</text>
  <path d="M370 138H400" stroke="#2a8c78" stroke-width="3"/>
  <polygon points="402,138 392,132 392,144" fill="#2a8c78"/>
  <path d="M410 190H430V178H450V166H470V154H490V142H510V130H530V118H550V106H570" stroke="#c0504d" stroke-width="3" fill="none"/>
  <line x1="404" y1="178" x2="576" y2="178" stroke="#9dbdb5" stroke-width="1" stroke-dasharray="4 4"/>
  <line x1="404" y1="154" x2="576" y2="154" stroke="#9dbdb5" stroke-width="1" stroke-dasharray="4 4"/>
  <line x1="404" y1="130" x2="576" y2="130" stroke="#9dbdb5" stroke-width="1" stroke-dasharray="4 4"/>
  <text x="410" y="212" font-size="14" fill="#4d6f67">0</text>
  <text x="546" y="212" font-size="14" fill="#4d6f67">1023</text>
  <text x="320" y="242" font-size="14" text-anchor="middle" fill="#173d36">10 位 ADC：5 伏除以 1023，一格约 4.9 毫伏</text>
  <text x="320" y="262" font-size="14" text-anchor="middle" fill="#4d6f67">阶梯和曲线的差，就是量化误差</text>
</svg>`, caption: "曲线是真实电压，阶梯是读到的数字；每一格之间的空隙就是分辨率。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把 5 伏以上的电压直接接进 ADC。会打穿输入保护，高电压要先分压。",
            "以为读数很准。10 位加 5 伏参考，一格就是 4.9 毫伏，还叠加电源噪声。",
            "整数除法顺序写反。raw / 1023 先算会得到 0，再乘 5000 还是 0。",
            "读得太快。采样保持电容还没充好就下一次转换，读数会偏低。",
            "信号源内阻太大。高阻信号直接进 ADC，读数和实际差得远。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "读一个电位器，把原始值和毫伏值一起打印，转到两端各记一次。",
            "算出 512 对应的电压是多少毫伏，再用串口验证。",
            "把参考电压的假设改成 3.3 伏重新换算，说明读数会怎么变。",
            "用光敏电阻加分压电阻做明暗检测，打印 raw 值。"
          ]},
          { t: "tip", color: "green", text: "一句话：ADC 用参考电压把连续电压切成刻度，10 位就是 1024 格，精度受参考和噪声限制。" }
        ]
      },
      {
        id: "e11",
        title: "第 11 课 · I2C 与 SPI",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：看懂两根线和四根线两种总线各自怎么传数据，能把一个传感器接上，并读回它的寄存器。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "传感器多了，引脚不够用。总线把很多设备挂在同一组线上，靠地址区分谁在说话。I2C 只用两根线：SCL 是时钟，SDA 是数据，两根都接上拉电阻。主机拉出时钟节拍，先发地址，被点到的从机回一个应答位，然后才开始传数据。" },
          { t: "p", text: "I2C 的时序有硬性规定：起始条件是时钟高电平时数据线下降，停止条件是时钟高电平时数据线上升。传输期间数据只能在时钟低电平时改变，时钟高电平时必须稳定。地址通常是 7 位，同一条总线上不能有两台设备用同一个地址。" },
          { t: "p", text: "SPI 用四根线：时钟、主出从入、主入从出、片选。它没有地址，靠片选线点名，一根片选对一个设备，所以设备多时引脚也多。代价换来的是速度，SPI 通常能跑到几兆赫兹，I2C 常见只有 100 千赫兹和 400 千赫兹。" },
          { t: "p", text: "怎么选？接线短、设备少、要快，用 SPI，比如小屏幕和存储卡。设备多、线要走得长、引脚紧张，用 I2C，比如一串传感器。两者都是同步总线，都有时钟线，区别在寻址方式、线数和速度。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "接一块温湿度传感器、一块小屏幕、一个陀螺仪，都走这两种总线。你不需要为每个模块写一套时序，库已经把起始位、地址、应答封装好了，你只要知道设备地址和寄存器含义。" },
          { t: "h2", text: "演示：用 I2C 跟设备打招呼" },
          { t: "p", text: "下面这段初始化 I2C，然后每秒向地址 0x3C 的设备写一个字节 0x00。endTransmission 的返回值是 0，说明设备回了应答，接线和地址都对。" },
          { t: "code", lang: "cpp", code: `#include <Wire.h>

void setup() {
    Wire.begin();
    Serial.begin(9600);
}

void loop() {
    Wire.beginTransmission(0x3C);
    Wire.write(0x00);
    byte err = Wire.endTransmission();
    Serial.println(err);
    delay(1000);
}` },
          { t: "p", text: "Wire.begin() 把芯片设成主机并占用默认的两个引脚。beginTransmission 只是把地址放进缓冲区，write 把要发的字节排进去，endTransmission 才真正把这一串发出去并等应答。返回值非 0 就是没人应答，先查接线和地址。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300">
  <rect x="24" y="16" width="592" height="272" rx="14" fill="#eef6f4"/>
  <text x="320" y="46" font-size="18" font-weight="700" text-anchor="middle" fill="#173d36">I2C：时钟打节拍，数据定内容</text>
  <text x="36" y="112" font-size="14" fill="#4d6f67">SCL</text>
  <text x="36" y="212" font-size="14" fill="#4d6f67">SDA</text>
  <text x="300" y="80" font-size="14" text-anchor="middle" fill="#4d6f67">地址 7 位加读写位</text>
  <text x="468" y="80" font-size="14" text-anchor="middle" fill="#4d6f67">应答</text>
  <path d="M80 96H120V134H140V96H160V134H180V96H200V134H220V96H240V134H260V96H280V134H300V96H320V134H340V96H360V134H380V96H400V134H420V96H440V134H460V96H520" stroke="#2a8c78" stroke-width="3" fill="none"/>
  <path d="M80 196H100V236H130V196H170V236H210V196H250V236H290V196H330V236H370V196H410V236H470V196H540" stroke="#c0504d" stroke-width="3" fill="none"/>
  <line x1="100" y1="84" x2="100" y2="248" stroke="#9dbdb5" stroke-width="1" stroke-dasharray="4 4"/>
  <line x1="470" y1="84" x2="470" y2="248" stroke="#9dbdb5" stroke-width="1" stroke-dasharray="4 4"/>
  <text x="118" y="266" font-size="14" fill="#c0504d">起始：SCL 高时 SDA 下降</text>
  <text x="584" y="266" font-size="14" text-anchor="end" fill="#c0504d">停止：SDA 上升</text>
  <text x="320" y="284" font-size="14" text-anchor="middle" fill="#173d36">数据只在 SCL 低电平时改变，高电平时被采样</text>
</svg>`, caption: "起始和停止都靠数据线在时钟高电平时的跳变来标记，这是 I2C 最容易被忽略的规则。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "SDA 和 SCL 接反。设备不应答，扫描地址也扫不到。",
            "忘了上拉电阻。很多模块板载了上拉，裸芯片不加就浮空。",
            "总线上两个设备地址相同。必须改其中一个的地址跳线。",
            "I2C 线拉太长。电容变大，上升沿变缓，400 千赫兹下容易出错。",
            "SPI 忘了拉低片选。设备收不到时钟，数据全丢。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "查出手上 I2C 模块的地址，写一个循环扫描 0x08 到 0x77 的程序，打印有应答的地址。",
            "把 endTransmission 的返回值打印出来，接错线时它是什么值？",
            "说明 I2C 的起始条件为什么必须由数据线的跳变来标记。",
            "列出 SPI 四根线各自的方向，画一张主机和从机的连线图。"
          ]},
          { t: "tip", color: "green", text: "一句话：I2C 靠地址点名、两根线省引脚，SPI 靠片选点名、四根线换速度。" }
        ]
      },
      {
        id: "e12",
        title: "第 12 课 · RTOS 入门与后续路线",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：知道 RTOS 解决了什么问题、任务和中断有什么不同，并给自己排一条继续往前的路线。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "前面的程序都是一条主线：setup 做完，loop 一直转。当你要同时做三件事，而且每件的周期不同，主循环会写成一大堆 millis 判断，越加越难读。RTOS 是跑在芯片上的一个小调度器，它把每件事做成一个独立的任务，每个任务有自己的栈和优先级，看起来像同时在跑。" },
          { t: "p", text: "任务不是真并行。单核芯片一次只能执行一条指令，调度器按优先级和阻塞状态切换：一个任务调用延时，就让出 CPU；有更高优先级的任务就绪，就立刻切过去。切换时保存寄存器、换栈指针，开销在几微秒量级。" },
          { t: "p", text: "任务之间共享数据要小心。两个任务同时改一个变量，结果取决于切换时机，这叫竞态。常用的办法是队列传数据、互斥量保护资源、信号量做同步。任务之间尽量用消息传递，少用共享的全局变量。" },
          { t: "p", text: "ESP32 自带 FreeRTOS，Arduino 框架下可以直接用 xTaskCreate 建任务，loop 本身也是一个任务。Uno 这类 8 位芯片 RAM 只有 2 KB，跑不动完整 RTOS，用 millis 加状态机更合适。选不选 RTOS，看任务数量和实时性要求，不是越新越好。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "有了任务，Wi-Fi 收数据、屏幕刷新、电机控制可以各占一个任务，互不拖累。你能给关键任务更高优先级，让它在期限内一定拿到 CPU，这是裸机主循环很难保证的。" },
          { t: "h2", text: "演示：两个任务各跑各的" },
          { t: "p", text: "下面这段在 ESP32 上建一个闪灯任务，主循环自己延时。两个任务各按自己的节奏跑，互不阻塞。" },
          { t: "code", lang: "cpp", code: `void taskBlink(void *param) {
    pinMode(2, OUTPUT);
    while (true) {
        digitalWrite(2, !digitalRead(2));
        vTaskDelay(500 / portTICK_PERIOD_MS);
    }
}

void setup() {
    xTaskCreate(taskBlink, "blink", 2048, NULL, 1, NULL);
}

void loop() {}` },
          { t: "p", text: "xTaskCreate 的五个参数依次是函数、名字、栈大小（字节）、传参、优先级，最后还有一个可选的句柄，这里传 NULL。2048 字节对这个任务够用。vTaskDelay 的参数是节拍数，除以 portTICK_PERIOD_MS 才能把毫秒换算成节拍。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300">
  <rect x="24" y="20" width="592" height="260" rx="14" fill="#eef6f4"/>
  <text x="320" y="46" font-size="19" font-weight="700" text-anchor="middle" fill="#173d36">调度器轮流让任务拿到 CPU</text>
  <text x="30" y="92" font-size="14" fill="#173d36">闪灯任务</text>
  <text x="30" y="160" font-size="14" fill="#173d36">采样任务</text>
  <rect x="120" y="78" width="110" height="26" rx="4" fill="#2a8c78"/>
  <rect x="350" y="78" width="120" height="26" rx="4" fill="#2a8c78"/>
  <rect x="530" y="78" width="56" height="26" rx="4" fill="#2a8c78"/>
  <rect x="230" y="146" width="120" height="26" rx="4" fill="#c98a2b"/>
  <rect x="470" y="146" width="60" height="26" rx="4" fill="#c98a2b"/>
  <text x="175" y="96" font-size="14" text-anchor="middle" fill="#ffffff">运行</text>
  <text x="410" y="96" font-size="14" text-anchor="middle" fill="#ffffff">运行</text>
  <text x="558" y="96" font-size="14" text-anchor="middle" fill="#ffffff">运行</text>
  <text x="290" y="164" font-size="14" text-anchor="middle" fill="#ffffff">运行</text>
  <text x="500" y="164" font-size="14" text-anchor="middle" fill="#ffffff">运行</text>
  <line x1="230" y1="70" x2="230" y2="186" stroke="#9dbdb5" stroke-width="1" stroke-dasharray="4 4"/>
  <line x1="350" y1="70" x2="350" y2="186" stroke="#9dbdb5" stroke-width="1" stroke-dasharray="4 4"/>
  <line x1="470" y1="70" x2="470" y2="186" stroke="#9dbdb5" stroke-width="1" stroke-dasharray="4 4"/>
  <text x="290" y="112" font-size="14" text-anchor="middle" fill="#4d6f67">延时中</text>
  <text x="410" y="180" font-size="14" text-anchor="middle" fill="#4d6f67">延时中</text>
  <line x1="110" y1="228" x2="590" y2="228" stroke="#173d36" stroke-width="2"/>
  <polygon points="596,228 584,222 584,234" fill="#173d36"/>
  <text x="320" y="258" font-size="14" text-anchor="middle" fill="#173d36">任务调用延时就让出 CPU，空白处由另一个任务填上</text>
  <text x="320" y="278" font-size="14" text-anchor="middle" fill="#4d6f67">高优先级任务一旦就绪，立刻抢占当前任务</text>
</svg>`, caption: "任务在阻塞和就绪之间切换，CPU 的时间被切成小段分给不同任务，切换本身也要花时间。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "以为任务越多越好。每个任务都要一块栈，RAM 很快见底。",
            "在任务里用 delay。它会占住 CPU 空转，应该用 vTaskDelay 让出。",
            "两个任务直接改同一个变量。要加互斥量或者改用队列。",
            "给所有任务同样的优先级。调度变成轮转，关键任务得不到保证。",
            "在 2 KB RAM 的板子上硬上 RTOS。栈一开就溢出，表现为随机重启。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用两个任务分别以 200 毫秒和 700 毫秒闪两颗灯，观察它们互不干扰。",
            "把闪灯任务的优先级提高，描述主循环的延时有没有变化。",
            "说出任务和中断在处理时机、能否阻塞这两点上的区别。",
            "给自己的下一步列三个方向：驱动、通信协议、实时系统，各写一份想读的资料。"
          ]},
          { t: "tip", color: "green", text: "一句话：RTOS 用任务和调度把并发写清楚，但每个任务都要花 RAM，小芯片上先把手写状态机练熟。" }
        ]
      }
    ]
  }
};
