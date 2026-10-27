/* 喵站 · C# 入门（2026-10-27；单文件形态，与 go-data.js 同构）
 * 12 课从 .NET 历史写到数组与 List。本机没有 dotnet，代码仅按 C# 12 / .NET 8 做语法自查，未实际运行。 */
window.MIAO_CSHARP = {
  tutorial: {
    id: "csharp",
    title: "C# 入门",
    intro: "从 .NET 的跨平台讲到数组与 List：12 课走完 C# 基础语法，每课都有能照敲的程序和一张机制图。",
    cat: "c#",
    diff: "入门",
    tags: ["C#", ".NET", "入门", "编程"],
    author: "喵站官方",
    cover: "/assets/img/covers/csharp.svg",
    updated: "2026-10-27",
    chapters: [
      {
        id: "cs01",
        title: "第 1 课 · C# 的历史：.NET 与跨平台",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：弄清 C#、.NET 与 CLR 各是什么，以及同一份程序为什么能跑在不同系统上。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "C# 是微软在 2000 年推出的编程语言，主设计者是 Anders Hejlsberg。它借用了 C 家族的括号与分号，又加上垃圾回收、类型安全等现代特性。语言本身只规定语法，真正让程序跑起来的是 .NET 平台。" },
          { t: "p", text: ".NET 平台里有两个关键角色。C# 编译器 Roslyn 把源码翻译成中间语言 IL；CLR 负责在运行时把 IL 编译成本机指令，并提供内存回收、异常处理等基础服务。因为 IL 与具体操作系统无关，同一份编译结果可以交给不同系统上的 CLR 执行。" },
          { t: "p", text: "历史上 .NET Framework 只跑 Windows。2016 年出现的 .NET Core 把运行时重写成跨平台版本，2020 年 .NET 5 把名字统一成 .NET，目前的长期支持版是 .NET 8。今天说 .NET，通常指这套跨平台的新运行时，而不是老的 Framework。" },
          { t: "p", text: "跨平台不等于同一份可执行文件到处拷，这一点很重要。发布时通常按目标系统分别生成，CLR 负责把 IL 适配到本机指令。C# 语言随 .NET 每年发一版，语法持续演进，但变量、分支、循环这些基础部分多年保持稳定，入门阶段不必追新特性，先把手感练熟更重要。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "一套代码可以部署到 Windows、Linux、macOS；写桌面程序、Web 后端、命令行工具、游戏脚本都用得上。学会语法后，换平台主要是换运行时和发布方式，语言本身不变，先把手感练熟，再谈原理，工具会替你处理细节。" },
          { t: "h2", text: "演示：一份源码走到屏幕" },
          { t: "p", text: "下面是最小程序的形状，先只看流程，不要求记住每个词。源码先被编译成 IL，再由 CLR 在本机执行，最后把文字送到终端。" },
          { t: "code", lang: "csharp", code: `using System;

Console.WriteLine("你好，C#");` },
          { t: "p", text: "这几行里，using System 引入基础命名空间，Console.WriteLine 往标准输出写一行。程序没有显式的 Main，C# 9 起允许用顶级语句，编译器会自动生成入口。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240"><rect x="30" y="20" width="580" height="200" rx="14" fill="#f3f0fb"/><text x="320" y="54" font-size="20" font-weight="700" text-anchor="middle" fill="#2d2350">C# 到屏幕：编译与运行</text><rect x="50" y="84" width="120" height="58" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="110" y="109" font-size="15" text-anchor="middle" fill="#2d2350">C# 源码</text><text x="110" y="130" font-size="14" text-anchor="middle" fill="#5d5378">Program.cs</text><path d="M174 113H196" stroke="#6b4fbb" stroke-width="3"/><polygon points="196,113 186,107 186,119" fill="#6b4fbb"/><rect x="200" y="84" width="120" height="58" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="260" y="109" font-size="15" text-anchor="middle" fill="#2d2350">编译器</text><text x="260" y="130" font-size="14" text-anchor="middle" fill="#5d5378">Roslyn</text><path d="M324 113H346" stroke="#6b4fbb" stroke-width="3"/><polygon points="346,113 336,107 336,119" fill="#6b4fbb"/><rect x="350" y="84" width="100" height="58" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="400" y="109" font-size="15" text-anchor="middle" fill="#2d2350">中间语言</text><text x="400" y="130" font-size="14" text-anchor="middle" fill="#5d5378">IL</text><path d="M454 113H476" stroke="#6b4fbb" stroke-width="3"/><polygon points="476,113 466,107 466,119" fill="#6b4fbb"/><rect x="480" y="84" width="110" height="58" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="535" y="109" font-size="15" text-anchor="middle" fill="#2d2350">CLR 运行时</text><text x="535" y="130" font-size="14" text-anchor="middle" fill="#5d5378">本机执行</text><text x="320" y="180" font-size="15" text-anchor="middle" fill="#5d5378">同一份 IL 交给 Windows、Linux、macOS 上的 CLR</text><text x="320" y="204" font-size="15" text-anchor="middle" fill="#2d2350">各系统都能得到同样的运行结果</text></svg>`, caption: "语言只到 IL 为止，后一半路由 CLR 在目标系统上完成。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把 C# 当成 .NET。C# 是语言，.NET 是运行时与类库，两者不是一回事。",
            "以为 .NET 只能在 Windows 上跑。.NET Core 之后，Linux 与 macOS 都是正式支持的目标。",
            "把 .NET Framework 与 .NET 8 混着搜。旧教程里的路径和命令经常对不上。",
            "以为 IL 就是机器码。IL 还要由 CLR 在运行时编译，才变成 CPU 能执行的指令。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用一句话分别说明 C#、IL、CLR 的角色，不看正文复述。",
            "查一下你电脑的系统属于 Windows、Linux 还是 macOS，记下它。",
            "说出至少两个用 C# 写成的软件或游戏项目。"
          ]},
          { t: "tip", color: "green", text: "一句话：C# 是语言，.NET 是平台；源码编译成 IL，再由各系统上的 CLR 执行，这就是跨平台的来路，也是旧代码仍能运行的原因。" }
        ]
      },
      {
        id: "cs02",
        title: "第 2 课 · 装 .NET SDK 和 VS Code",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：装好 .NET 8 SDK 与 VS Code，能在终端里用 dotnet --version 看到版本号。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: ".NET SDK 不是单个程序，而是一组命令行工具的集合：dotnet new 建项目，dotnet run 编译并运行，dotnet build 只编译，dotnet --version 看版本。装 SDK 时会连带装运行时，所以初学只装 SDK 就够。" },
          { t: "p", text: "VS Code 是编辑器，负责写代码和显示提示；C# 扩展负责补全、跳转和调试。扩展本身不编译代码，它调用本机的 dotnet 命令。因此顺序是先装 SDK，再装编辑器扩展。" },
          { t: "p", text: "命令要能被终端找到，靠的是 PATH 环境变量。安装器通常会自动写入 PATH；如果 dotnet 提示找不到，先重开终端，再检查安装路径有没有进 PATH。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "装好之后，你能在任意目录用一条命令生成项目骨架，用一条命令跑起来，还能在编辑器里打断点单步看变量。后面的演示都以这套工具为前提。" },
          { t: "h2", text: "演示：Ubuntu 上用 snap 安装" },
          { t: "p", text: "下面四条是安装与验证命令。前两条分别装 SDK 和 VS Code，后两条查版本。命令逐条执行，看到版本号再往下走。" },
          { t: "code", lang: "bash", code: `sudo snap install dotnet-sdk --classic --channel=8.0
sudo snap install code --classic
dotnet --version
dotnet --list-sdks` },
          { t: "p", text: "dotnet --version 输出形如 8.0.404，dotnet --list-sdks 会列出所有已安装的 SDK。版本号只要以 8 开头，就与本课程一致；更高版本也能跑，语法差异很小。" },
          { t: "p", text: "其他系统的命令放在下面，装完同样用版本命令验证，按你使用的系统挑一条执行。" },
          { t: "code", lang: "bash", code: `winget install Microsoft.DotNet.SDK.8
brew install --cask dotnet-sdk
dotnet --version` },
          { t: "p", text: "安装位置也有讲究。用系统包或官方脚本安装，dotnet 会落在不同目录；只要这个目录进了 PATH，终端就能直接调用。源码和项目文件放在项目目录里，不要混进 SDK 的安装目录，升级时才不会互相影响。" },
          { t: "p", text: "第一次运行项目时，工具链会还原依赖并生成 obj 与 bin 两个目录。obj 存放中间文件，bin 存放编译结果，它们都可以删除后重新生成，真正要保留的是源码和 csproj 项目文件，不要把这两个目录提交到代码仓库。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240"><rect x="30" y="20" width="580" height="200" rx="14" fill="#f3f0fb"/><text x="320" y="52" font-size="20" font-weight="700" text-anchor="middle" fill="#2d2350">安装链：两件工具合成一条命令</text><rect x="46" y="76" width="158" height="52" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="125" y="99" font-size="15" text-anchor="middle" fill="#2d2350">.NET SDK</text><text x="125" y="119" font-size="14" text-anchor="middle" fill="#5d5378">提供 dotnet 命令</text><rect x="46" y="148" width="158" height="52" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="125" y="171" font-size="15" text-anchor="middle" fill="#2d2350">VS Code</text><text x="125" y="191" font-size="14" text-anchor="middle" fill="#5d5378">负责写与看提示</text><path d="M208 102H268" stroke="#6b4fbb" stroke-width="3"/><polygon points="268,102 258,96 258,108" fill="#6b4fbb"/><path d="M208 174H268" stroke="#6b4fbb" stroke-width="3"/><polygon points="268,174 258,168 258,180" fill="#6b4fbb"/><rect x="272" y="98" width="132" height="80" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="338" y="124" font-size="15" text-anchor="middle" fill="#2d2350">PATH</text><text x="338" y="146" font-size="14" text-anchor="middle" fill="#5d5378">终端找得到命令</text><path d="M408 138H470" stroke="#6b4fbb" stroke-width="3"/><polygon points="470,138 460,132 460,144" fill="#6b4fbb"/><rect x="474" y="98" width="118" height="80" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="533" y="124" font-size="14" text-anchor="middle" fill="#2d2350">dotnet --version</text><text x="533" y="148" font-size="15" text-anchor="middle" fill="#5d5378">看到 8.x</text></svg>`, caption: "验证标准不是装完，而是终端能执行命令并打印版本。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "只装了运行时，没装 SDK。dotnet run 会用不了，dotnet --list-sdks 也会是空的。",
            "装完不重开终端。PATH 是启动时读入的，旧窗口里可能还是找不到命令。",
            "在 VS Code 里装了一堆 C# 插件。保留官方 C# 扩展即可，重复插件会互相抢补全。",
            "用系统最高权限在项目目录里跑命令。生成的文件归那个账号，普通账号后面改不动。",
            "把 SDK 版本当成运行时版本。查运行时要用 dotnet --list-runtimes。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "按演示装好 SDK 与 VS Code，抄下 dotnet --version 的完整输出。",
            "用 dotnet --list-sdks 与 dotnet --list-runtimes 分别看 SDK 和运行时，说明两者区别。",
            "在 VS Code 里装官方 C# 扩展，新建一个 .cs 文件，确认有语法高亮。"
          ]},
          { t: "tip", color: "green", text: "一句话：SDK 提供 dotnet 命令，编辑器只是调用它的界面；能跑 dotnet --version 才算装好。" }
        ]
      },
      {
        id: "cs03",
        title: "第 3 课 · 第一个程序：Console.WriteLine",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：建一个控制台项目，用 Console.WriteLine 打印第一行字，并知道每条语句的作用。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "C# 程序从一条条语句开始执行。用顶级语句时，文件里的语句按从上到下的顺序运行，编译器自动把它们包进入口方法。一个项目只能有一个这样的入口文件。" },
          { t: "p", text: "Console 是 System 命名空间里的控制台类。WriteLine 输出一行并换行，Write 只输出不换行。字符串用双引号包住，分号结束一条语句。" },
          { t: "p", text: "dotnet run 会先编译再运行；dotnet build 只生成程序集，不运行。第一次运行要还原依赖、编译，慢一点正常；之后会快很多。" },
          { t: "p", text: "项目目录里有两个需要认识的文件。csproj 记录目标框架与项目设置，Program.cs 是入口源码。obj 与 bin 由工具链生成，前者放中间文件，后者放编译结果；改代码后重新运行即可，不必手动清理，两个目录删掉也能重建。保持目录干净，找文件会快很多。" },
          { t: "p", text: "报错并不可怕，先看行号与错误码。编译器通常会说清楚哪个符号不认识、哪条语句缺分号。把报错原文抄下来再搜索，比只截一张图更容易找到答案。初学阶段，读错误信息的能力和写代码同样重要，不要急着删掉重写。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "能输出，就能验证环境、观察变量、给程序留下执行痕迹。后面的例子都用 Console.WriteLine 把结果显示出来，它是调试最小的工具。" },
          { t: "h2", text: "演示：新建项目并运行" },
          { t: "p", text: "先建目录和项目。dotnet new console 会生成 csproj 与 Program.cs，前者记录项目配置，后者是入口源码。" },
          { t: "code", lang: "bash", code: `dotnet new console -o hello-cs
cd hello-cs
dotnet run` },
          { t: "p", text: "把 Program.cs 的内容换成下面三行，再执行一次 dotnet run。终端会依次打印两行字。" },
          { t: "code", lang: "csharp", code: `using System;

Console.WriteLine("你好，C#");
Console.WriteLine("我在学 C#");` },
          { t: "p", text: "注意每条语句以分号结尾，字符串必须用英文双引号。中文标点放进字符串没问题，但不能拿它当语法符号，这是最基本的语法检查。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260"><rect x="30" y="20" width="580" height="220" rx="14" fill="#f3f0fb"/><text x="320" y="52" font-size="20" font-weight="700" text-anchor="middle" fill="#2d2350">dotnet run 背后的三步</text><rect x="44" y="82" width="118" height="58" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="103" y="107" font-size="15" text-anchor="middle" fill="#2d2350">Program.cs</text><text x="103" y="128" font-size="14" text-anchor="middle" fill="#5d5378">顶级语句</text><path d="M166 111H198" stroke="#6b4fbb" stroke-width="3"/><polygon points="198,111 188,105 188,117" fill="#6b4fbb"/><rect x="202" y="82" width="128" height="58" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="266" y="107" font-size="15" text-anchor="middle" fill="#2d2350">编译</text><text x="266" y="128" font-size="14" text-anchor="middle" fill="#5d5378">生成程序集</text><path d="M334 111H366" stroke="#6b4fbb" stroke-width="3"/><polygon points="366,111 356,105 356,117" fill="#6b4fbb"/><rect x="370" y="82" width="112" height="58" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="426" y="107" font-size="15" text-anchor="middle" fill="#2d2350">运行</text><text x="426" y="128" font-size="14" text-anchor="middle" fill="#5d5378">CLR 执行</text><path d="M486 111H518" stroke="#6b4fbb" stroke-width="3"/><polygon points="518,111 508,105 508,117" fill="#6b4fbb"/><rect x="522" y="82" width="76" height="58" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="560" y="107" font-size="15" text-anchor="middle" fill="#2d2350">终端</text><text x="560" y="128" font-size="14" text-anchor="middle" fill="#5d5378">两行字</text><text x="320" y="186" font-size="15" text-anchor="middle" fill="#5d5378">dotnet run 等于编译加运行，产物放在 bin 目录</text><text x="320" y="212" font-size="15" text-anchor="middle" fill="#2d2350">dotnet build 只做前两步，不启动程序</text></svg>`, caption: "run 与 build 共用编译流程，区别只在最后要不要立刻执行。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "忘了分号。C# 不会自动补，编译器会停在报错行附近。",
            "用了中文引号或中文分号。它们只是普通字符，不能当语法符号。",
            "在错误目录执行 dotnet run。终端要停在含有 csproj 的目录里。",
            "把 WriteLine 写成 Writeline。C# 区分大小写。",
            "一个项目里放了两个顶级语句文件。入口只能有一个，编译器会报错。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "建一个 console 项目，把输出改成你的名字与今天的日期。",
            "用 dotnet build 生成一次，找到 bin 目录下的 dll 文件。",
            "故意删掉一个分号，抄下编译器报错的前两行，再改回去。"
          ]},
          { t: "tip", color: "green", text: "一句话：顶级语句从上往下执行，Console.WriteLine 输出一行；dotnet run 等于编译加运行。" }
        ]
      },
      {
        id: "cs04",
        title: "第 4 课 · 变量与 var",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：会声明变量、给变量重新赋值，并知道 var 只是让编译器推断类型。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "变量是内存里一块带名字的存储位置。声明时写类型、名字和初值，例如 int age = 18。类型决定这块位置能存什么、占多大；名字让你之后能读写它。" },
          { t: "p", text: "赋值用等号，把右边的值放进左边的变量。再次赋值会覆盖旧值，变量的类型不会变。读取变量时，拿到的是它当前保存的值。" },
          { t: "p", text: "var 不是一种新类型，也不表示「随便什么类型」。编译器看等号右边的表达式，推断出具体类型，之后这个变量仍然受该类型约束。var 只能用于声明时就有初值的情况。" },
          { t: "p", text: "命名要能说明用途。age 比 a 好，totalPrice 比 tp 好；同一个作用域里不要出现只差大小写的两个名字。变量应在第一次使用的地方附近声明，读代码的人不用来回找，短名字只适合循环计数，别怕名字长一点。" },
          { t: "p", text: "赋值与声明是两件事。int age = 18 同时完成声明和初始化；后面的 age = 19 只是赋值。没有初值的局部变量不能直接读取，编译器会提示先赋值。变量名也不能用 int、if、for 这类关键字，保持简短清楚，类型写在名字前，读声明时先看类型。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "变量让程序记住输入、累计结果、保存中间状态。没有变量，程序只能执行一次性的固定输出；有了变量，才能根据数据变化做判断和循环。" },
          { t: "h2", text: "演示：声明、修改、推断" },
          { t: "p", text: "下面声明两个变量，改一次值，再用 var 声明两个。运行后观察输出顺序。" },
          { t: "code", lang: "csharp", code: `using System;

int age = 18;
age = 19;

var city = "杭州";
var score = 92.5;

Console.WriteLine(age);
Console.WriteLine(city);
Console.WriteLine(score);` },
          { t: "p", text: "age 最终是 19，旧值 18 被覆盖。city 被推断为 string，score 被推断为 double。把鼠标停在 var 上，编辑器通常会显示推断结果。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260"><rect x="30" y="20" width="580" height="220" rx="14" fill="#f3f0fb"/><text x="320" y="52" font-size="20" font-weight="700" text-anchor="middle" fill="#2d2350">变量 = 名字 + 类型 + 当前值</text><rect x="46" y="78" width="166" height="104" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="129" y="102" font-size="14" text-anchor="middle" fill="#5d5378">int</text><text x="129" y="126" font-size="15" text-anchor="middle" fill="#2d2350">age</text><line x1="70" y1="138" x2="188" y2="138" stroke="#d8d0ee" stroke-width="1"/><text x="129" y="162" font-size="20" font-weight="700" text-anchor="middle" fill="#6b4fbb">19</text><rect x="237" y="78" width="166" height="104" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="320" y="102" font-size="14" text-anchor="middle" fill="#5d5378">string</text><text x="320" y="126" font-size="15" text-anchor="middle" fill="#2d2350">city</text><line x1="261" y1="138" x2="379" y2="138" stroke="#d8d0ee" stroke-width="1"/><text x="320" y="162" font-size="18" font-weight="700" text-anchor="middle" fill="#6b4fbb">杭州</text><rect x="428" y="78" width="166" height="104" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="511" y="102" font-size="14" text-anchor="middle" fill="#5d5378">double</text><text x="511" y="126" font-size="15" text-anchor="middle" fill="#2d2350">score</text><line x1="452" y1="138" x2="570" y2="138" stroke="#d8d0ee" stroke-width="1"/><text x="511" y="162" font-size="20" font-weight="700" text-anchor="middle" fill="#6b4fbb">92.5</text><text x="320" y="208" font-size="15" text-anchor="middle" fill="#5d5378">重新赋值只换值，不换类型；var 由右边推断，类型随后固定</text></svg>`, caption: "每个变量都有自己的类型与当前值，var 只是少写一次类型名。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "先声明 var 再赋值。var age; 不合法，因为编译器没有依据推断类型。",
            "以数字开头的变量名。命名只能用字母、下划线或汉字开头。",
            "把不同类型互相赋值。int 变量不能直接存字符串。",
            "以为 var 是动态类型。推断发生在编译期，类型一旦确定就不能换。",
            "变量名大小写混用。age 与 Age 是两个不同的变量。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "声明三个变量分别保存你的年龄、身高、姓名，再打印出来。",
            "把年龄变量改两次值，每次打印，观察覆盖结果。",
            "用 var 声明一个整数与一个字符串，说明编译器各推断成什么类型。"
          ]},
          { t: "tip", color: "green", text: "一句话：变量是带名字和类型的存储位置；var 让编译器代你写类型，但类型仍然固定。" }
        ]
      },
      {
        id: "cs05",
        title: "第 5 课 · 数据类型",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：认识 int、double、char、bool、string 五种常用类型，知道它们各自存什么。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "类型决定三件事：能存哪些值、占多少内存、能做哪些运算。C# 把常用类型做成关键字，写起来短，含义明确。" },
          { t: "p", text: "int 存整数，范围约正负二十一亿；double 存小数，有精度误差；char 存单个字符，用单引号；bool 只有 true 与 false；string 存一串字符，用双引号。" },
          { t: "p", text: "字面量的写法要和类型对上：整数默认 int，带小数点默认 double，单引号是 char，双引号是 string。类型不匹配时，编译器不会偷偷帮你转换。" },
          { t: "p", text: "整数还有 long、short 等宽度，小数还有 float、decimal。入门先记 int 与 double；遇到金额精确计算时，再了解 decimal。类型越多，越要按取值范围选，不要一律用最大的，宽度越大，占的内存越多，运算也可能更慢，先求正确，再谈节省。" },
          { t: "p", text: "字符串可以拼起来，也可以用 Length 取长度。字符与字符串都区分大小写，比较时 A 与 a 不相等。布尔值只有两个状态，适合表示开关、是否通过、有没有找到，判断结果通常来自比较运算。" },
          { t: "p", text: "声明变量时，类型写在名字前面。初始化值必须能放进这个类型；放不下就换更宽的类型，或者先用转换语法处理。初学阶段，选类型的原则是够用就好，不要为了省事全部用 string 存数字，后面计算会麻烦，类型选错，后面会反复补救，类型选对，代码才稳。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "选对类型，程序才能正确表示年龄、价格、姓名、开关状态。类型也是条件判断与计数的基础：条件必须是 bool，计数通常用 int。" },
          { t: "h2", text: "演示：五种类型各来一个" },
          { t: "p", text: "下面每个变量用一个字面量初始化，然后逐个打印。char 与 string 的引号不同，注意区分。" },
          { t: "code", lang: "csharp", code: `using System;

int count = 3;
double price = 9.9;
char grade = 'A';
bool ok = true;
string name = "小北";

Console.WriteLine(count);
Console.WriteLine(price);
Console.WriteLine(grade);
Console.WriteLine(ok);
Console.WriteLine(name);` },
          { t: "p", text: "输出依次是 3、9.9、A、True、小北。bool 打印成 True 或 False，首字母大写，这是 .NET 的固定写法。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="24" y="20" width="592" height="240" rx="14" fill="#f3f0fb"/><text x="320" y="52" font-size="20" font-weight="700" text-anchor="middle" fill="#2d2350">五种常用类型：形状与占用</text><rect x="40" y="74" width="104" height="132" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="92" y="100" font-size="18" font-weight="700" text-anchor="middle" fill="#6b4fbb">int</text><text x="92" y="124" font-size="14" text-anchor="middle" fill="#2d2350">整数</text><text x="92" y="150" font-size="15" text-anchor="middle" fill="#5d5378">3</text><text x="92" y="178" font-size="14" text-anchor="middle" fill="#5d5378">4 字节</text><rect x="156" y="74" width="104" height="132" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="208" y="100" font-size="18" font-weight="700" text-anchor="middle" fill="#6b4fbb">double</text><text x="208" y="124" font-size="14" text-anchor="middle" fill="#2d2350">小数</text><text x="208" y="150" font-size="15" text-anchor="middle" fill="#5d5378">9.9</text><text x="208" y="178" font-size="14" text-anchor="middle" fill="#5d5378">8 字节</text><rect x="272" y="74" width="104" height="132" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="324" y="100" font-size="18" font-weight="700" text-anchor="middle" fill="#6b4fbb">char</text><text x="324" y="124" font-size="14" text-anchor="middle" fill="#2d2350">单字符</text><text x="324" y="150" font-size="15" text-anchor="middle" fill="#5d5378">'A'</text><text x="324" y="178" font-size="14" text-anchor="middle" fill="#5d5378">2 字节</text><rect x="388" y="74" width="104" height="132" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="440" y="100" font-size="18" font-weight="700" text-anchor="middle" fill="#6b4fbb">bool</text><text x="440" y="124" font-size="14" text-anchor="middle" fill="#2d2350">真假</text><text x="440" y="150" font-size="15" text-anchor="middle" fill="#5d5378">true</text><text x="440" y="178" font-size="14" text-anchor="middle" fill="#5d5378">1 字节</text><rect x="504" y="74" width="104" height="132" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="556" y="100" font-size="18" font-weight="700" text-anchor="middle" fill="#6b4fbb">string</text><text x="556" y="124" font-size="14" text-anchor="middle" fill="#2d2350">文本</text><text x="556" y="150" font-size="15" text-anchor="middle" fill="#5d5378">小北</text><text x="556" y="178" font-size="14" text-anchor="middle" fill="#5d5378">引用</text><text x="320" y="240" font-size="15" text-anchor="middle" fill="#5d5378">类型规定能存什么、占多大、能做哪些运算</text></svg>`, caption: "同样是数字，int 与 double 的存储方式和运算规则并不相同。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "用双引号写 char。'A' 是字符，\"A\" 是字符串，两者不能混。",
            "以为 double 能精确表示所有小数。0.1 加 0.2 不一定等于 0.3，金额场景要留意。",
            "把 true 写成 True。字面量必须小写；输出的 True 是显示格式。",
            "给 int 变量存小数。编译器直接报错，不会自动截断。",
            "用 string 存单个字符还反复比较。单个字符用 char 更省也更明确。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用五种类型各声明一个变量，取你身边的数据，全部打印。",
            "故意把 char 写成双引号，看编译器报什么错。",
            "查一查 int 的最大值与最小值，写出它们对应的常量名。"
          ]},
          { t: "tip", color: "green", text: "一句话：类型规定值的形状与操作；int、double、char、bool、string 覆盖了入门阶段绝大多数数据。" }
        ]
      },
      {
        id: "cs06",
        title: "第 6 课 · 运算符",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：会用算术、比较、逻辑三类运算符，能解释整数相除为什么丢小数。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "运算符把操作数组合成表达式。算术运算符 + - * / % 里，加减乘除和数学一致，百分号取余数。两个 int 相除，结果仍是 int，小数部分被舍弃。" },
          { t: "p", text: "比较运算符 == 与 != 判断相等，大于、小于、大于等于、小于等于判断大小，结果都是 bool。逻辑运算符 && 表示两边都真、|| 表示至少一边真、! 取反。&& 与 || 有短路：左边能定结果时，右边不再计算。" },
          { t: "p", text: "运算有优先级：括号最高，其次乘除取余，再加减，再比较，最后逻辑。拿不准就加括号，可读性比省字符重要。" },
          { t: "p", text: "表达式的结果也有类型。int 与 int 相加还是 int，int 与 double 混合运算会提升为 double。赋值时如果两边类型不同，编译器会要求显式转换，避免悄悄丢精度，写清楚比省几个字符重要，类型不同时，先想清楚再写。" },
          { t: "p", text: "自增自减是常见的简写。i++ 表示把 i 加一，i-- 表示减一；+=、-=、*=、/= 把运算和赋值合成一步。它们让循环与累加更短，但不要在复杂表达式里堆太多，先保证一眼看懂，简写也要克制，别让小聪明变成隐患。" },
          { t: "p", text: "短路有实际用途。判断 b 不为 0 再写 a / b，把 b != 0 放在左边，右边就不会在除零时执行。顺序写反，程序可能先崩掉，条件顺序也是逻辑的一部分，先判断再计算。" },
          { t: "p", text: "括号能改变优先级，也能表明意图。a + b * 2 与 (a + b) * 2 结果不同；团队代码里，宁可多加一对括号，也不要让读者停下来心算，读代码的人会感谢这对括号。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "运算符是判断与计算的基本零件。算总分、求平均、判断是否及格、检查两个条件是否同时成立，都靠这些符号组合。" },
          { t: "h2", text: "演示：算术与比较" },
          { t: "p", text: "下面用 7 和 2 演示整除、取余、比较与逻辑。先猜结果，再运行对照。" },
          { t: "code", lang: "csharp", code: `using System;

int a = 7;
int b = 2;

Console.WriteLine(a + b);
Console.WriteLine(a / b);
Console.WriteLine(a % b);
Console.WriteLine(a > b && b > 0);` },
          { t: "p", text: "输出是 9、3、1、True。a / b 得 3 而不是 3.5，因为两边都是 int；想要小数，至少一边要写成 double，例如 7.0 / 2。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240"><rect x="30" y="20" width="580" height="200" rx="14" fill="#f3f0fb"/><text x="320" y="52" font-size="20" font-weight="700" text-anchor="middle" fill="#2d2350">整数运算：商与余数分开算</text><rect x="52" y="80" width="112" height="56" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="108" y="115" font-size="18" text-anchor="middle" fill="#2d2350">7 / 2</text><path d="M168 108H226" stroke="#6b4fbb" stroke-width="3"/><polygon points="226,108 216,102 216,114" fill="#6b4fbb"/><rect x="230" y="80" width="240" height="56" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="350" y="104" font-size="16" text-anchor="middle" fill="#6b4fbb">3</text><text x="350" y="125" font-size="14" text-anchor="middle" fill="#5d5378">小数被舍弃，结果仍是 int</text><rect x="52" y="152" width="112" height="52" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="108" y="184" font-size="18" text-anchor="middle" fill="#2d2350">7 % 2</text><path d="M168 178H226" stroke="#6b4fbb" stroke-width="3"/><polygon points="226,178 216,172 216,184" fill="#6b4fbb"/><rect x="230" y="152" width="240" height="52" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="350" y="176" font-size="16" text-anchor="middle" fill="#6b4fbb">1</text><text x="350" y="195" font-size="14" text-anchor="middle" fill="#5d5378">余数，7 减 3 乘 2 剩下 1</text><text x="546" y="112" font-size="15" text-anchor="middle" fill="#5d5378">7.0 / 2</text><text x="546" y="134" font-size="15" text-anchor="middle" fill="#2d2350">才是 3.5</text></svg>`, caption: "先看操作数类型，再谈结果；整数除法只保留商。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "用 = 做比较。= 是赋值，== 才是判断相等。",
            "以为 7 / 2 得 3.5。两个整数相除，结果被截断。",
            "把 && 写成 &。两者都能算，但 && 会短路，日常判断用 &&。",
            "忽略优先级。a + b * 2 先算乘法，不确定就加括号。",
            "对 double 用 == 比较。浮点有误差，通常比较差值是否足够小。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 17 与 5 算出商和余数，并打印。",
            "写一个表达式判断某数既大于 10 又是偶数，输出 bool。",
            "把 7 / 2 改成 7.0 / 2，观察结果类型与数值的变化。"
          ]},
          { t: "tip", color: "green", text: "一句话：运算符按优先级求值；整数相除会截断，比较与逻辑的结果永远是 bool。" }
        ]
      },
      {
        id: "cs07",
        title: "第 7 课 · if 条件",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：会写一个 if，让程序只在条件为 true 时执行某段代码。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "if 后面跟一对圆括号，里面放条件表达式。条件必须是 bool，不能直接写数字。圆括号后面跟花括号，花括号里是条件成立时执行的语句块。" },
          { t: "p", text: "执行时先算条件。true 就进入花括号，false 就跳过整块，接着执行后面的语句。花括号不是装饰，它划定了哪些语句属于这个 if。判断只发生一次，不会反复检查。" },
          { t: "p", text: "即使只有一条语句，也建议保留花括号。以后往里加语句时，不会因为漏掉花括号而让新语句跑到条件外面。缩进只是给人看的，真正的作用域由花括号决定。" },
          { t: "p", text: "条件通常由比较得到，例如 age >= 18。也可以直接放一个 bool 变量。字符串不能当条件，C# 不像某些语言那样把空串当成 false，类型不对编译器会直接拦下。" },
          { t: "p", text: "写条件时，把业务含义翻译成比较表达式。比如满 18 岁可注册，就写 age >= 18；不要写 age > 17 这类绕弯的等价式。语义直接的表达式，边界值一眼就能看出来。条件里的变量要在判断前就有值，否则编译不通过，这是顺序问题，写慢一点更稳。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "判断能让人机交互有反应：输入是否为空、分数是否及格、年龄是否够线。程序不再一条路走到黑，而是能根据数据决定做不做。条件写得准，程序的行为才可预测。" },
          { t: "h2", text: "演示：一个门槛判断" },
          { t: "p", text: "下面判断 age 是否达到 18。把 age 改成 17 再运行一次，观察输出变化。" },
          { t: "code", lang: "csharp", code: `using System;

int age = 20;

if (age >= 18)
{
    Console.WriteLine("可以注册");
}

Console.WriteLine("检查结束");` },
          { t: "p", text: "age 为 20 时两行都打印；改成 17 时只打印检查结束。最后一行在 if 外面，所以总会执行。判断块里只放真正需要条件保护的语句，别把无关逻辑塞进去。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="30" y="20" width="580" height="240" rx="14" fill="#f3f0fb"/><text x="320" y="50" font-size="20" font-weight="700" text-anchor="middle" fill="#2d2350">if：条件只决定一次走向</text><polygon points="320,78 414,120 320,162 226,120" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="320" y="116" font-size="15" text-anchor="middle" fill="#2d2350">age >= 18 ?</text><line x1="414" y1="120" x2="446" y2="120" stroke="#6b4fbb" stroke-width="3"/><polygon points="446,120 436,114 436,126" fill="#6b4fbb"/><text x="430" y="110" font-size="15" text-anchor="middle" fill="#5d5378">是</text><rect x="450" y="94" width="156" height="52" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="528" y="126" font-size="15" text-anchor="middle" fill="#2d2350">输出：可以注册</text><line x1="320" y1="162" x2="320" y2="190" stroke="#6b4fbb" stroke-width="3"/><polygon points="320,190 314,180 326,180" fill="#6b4fbb"/><text x="332" y="182" font-size="15" fill="#5d5378">否</text><rect x="250" y="194" width="180" height="44" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="340" y="221" font-size="15" text-anchor="middle" fill="#2d2350">跳过本块</text><text x="320" y="254" font-size="15" text-anchor="middle" fill="#5d5378">走完任一支路，都接着执行 if 后面的语句</text></svg>`, caption: "条件为 true 才进入块；为 false 只是跳过，不会中断整个程序。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "条件写成 age = 18。这是赋值，不是比较，而且类型也不对。",
            "把条件写成字符串或数字。if 只认 bool，其他类型不会自动变成真假。",
            "花括号只包住第一句，后面的语句其实在 if 外面。",
            "在 if 条件后面多写一个分号。分号会变成空语句，花括号块与 if 脱开。",
            "缩进混乱就以为作用域不同。C# 看花括号，不看缩进。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "声明一个温度变量，超过 30 度时打印一句提醒。",
            "把演示里的 18 改成 22，用 20 和 23 各跑一次，记录输出。",
            "故意在 if 条件后加分号，运行并解释程序行为为什么变了。"
          ]},
          { t: "tip", color: "green", text: "一句话：if 只在条件为 true 时执行花括号里的块；条件必须是 bool，作用域由花括号决定。" }
        ]
      },
      {
        id: "cs08",
        title: "第 8 课 · else 与分支",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：用 else 与 else if 把多种情况分开，保证每次只走一条分支。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "else 接在 if 块后面，表示条件不成立时走这里。else 不带条件，也不能单独出现，它必须紧跟一个 if 或 else if。一个 if 后面最多只有一个 else，位置放在所有条件分支之后。" },
          { t: "p", text: "需要判断多个区间时，用 else if 继续加条件。程序从上往下检查，命中第一个 true 的分支后，其余分支全部跳过，所以顺序很重要。把最宽的条件放前面，后面的分支就永远轮不到。" },
          { t: "p", text: "最后的 else 是可选的兜底。它负责处理所有没被前面命中的情况，让程序一定有一条路可走。分支条件应当互斥且覆盖完整，边界值归哪一档要提前想清楚。" },
          { t: "p", text: "写分支前先列清单：有哪几档、每档的边界是多少、落空时怎么办。把最具体、最窄的条件放前面，把兜底放最后。清单列清楚，代码只是把清单翻译成 if 与 else if。" },
          { t: "p", text: "测试分支要专门挑边界值。刚好等于 90、刚好等于 60、比 60 小一，这些值最能暴露顺序错误。只测中间值，宽条件抢走窄条件的问题不容易发现。每个分支都跑一遍，别只跑顺路的一条。这一步不能省，顺序错了就重排，别急着写代码。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "分支把连续的成绩、年龄、库存分成有限档位，让程序给出不同回应。表单校验、费率计算、状态提示都依赖这种多路选择。分档清楚，测试用例才好写。" },
          { t: "h2", text: "演示：成绩分档" },
          { t: "p", text: "下面按 90、60 两个界线分成三档。把 score 改成 59、60、90 各跑一次，确认边界归属。" },
          { t: "code", lang: "csharp", code: `using System;
int score = 86;
if (score >= 90) {
    Console.WriteLine("优秀");
} else if (score >= 60) {
    Console.WriteLine("及格");
} else {
    Console.WriteLine("不及格");
}` },
          { t: "p", text: "86 命中第二个分支，输出及格。90 会命中优秀，60 会命中及格，59 落到 else。判断顺序决定了边界值的归属。每个分支只负责一个区间，不要互相重叠。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="30" y="20" width="580" height="260" rx="14" fill="#f3f0fb"/><text x="320" y="48" font-size="20" font-weight="700" text-anchor="middle" fill="#2d2350">else if：从上往下只走一条</text><rect x="40" y="78" width="160" height="52" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="120" y="110" font-size="15" text-anchor="middle" fill="#2d2350">score >= 90 ?</text><line x1="200" y1="104" x2="232" y2="104" stroke="#6b4fbb" stroke-width="3"/><polygon points="232,104 222,98 222,110" fill="#6b4fbb"/><text x="216" y="96" font-size="14" text-anchor="middle" fill="#5d5378">是</text><rect x="236" y="78" width="140" height="52" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="306" y="110" font-size="16" text-anchor="middle" fill="#2d2350">优秀</text><line x1="120" y1="130" x2="120" y2="170" stroke="#6b4fbb" stroke-width="3"/><polygon points="120,170 114,160 126,160" fill="#6b4fbb"/><text x="132" y="156" font-size="14" fill="#5d5378">否</text><rect x="40" y="170" width="160" height="52" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="120" y="202" font-size="15" text-anchor="middle" fill="#2d2350">score >= 60 ?</text><line x1="200" y1="196" x2="232" y2="196" stroke="#6b4fbb" stroke-width="3"/><polygon points="232,196 222,190 222,202" fill="#6b4fbb"/><text x="216" y="188" font-size="14" text-anchor="middle" fill="#5d5378">是</text><rect x="236" y="170" width="140" height="52" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="306" y="202" font-size="16" text-anchor="middle" fill="#2d2350">及格</text><line x1="120" y1="222" x2="120" y2="240" stroke="#6b4fbb" stroke-width="3"/><polygon points="120,240 114,230 126,230" fill="#6b4fbb"/><text x="132" y="236" font-size="14" fill="#5d5378">否</text><rect x="236" y="240" width="140" height="36" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="306" y="263" font-size="16" text-anchor="middle" fill="#2d2350">不及格</text><text x="470" y="120" font-size="14" fill="#5d5378">命中一条后，</text><text x="470" y="142" font-size="14" fill="#5d5378">其余分支全跳过</text></svg>`, caption: "分支顺序就是优先级；边界值落在哪一档由先后决定。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把 else if 写成 else 再套 if。逻辑能跑，但层次变深，容易看错。",
            "把宽条件放前面。score >= 60 放最前，90 分也会被判成及格。",
            "在 else 后面写条件。else 不接受条件，要条件就用 else if。",
            "漏掉最后的 else。没有兜底时，所有条件都不成立就什么也不做。",
            "两个分支都写输出，忘了 else if 命中后其余分支不会执行。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 else if 把温度分成低温、舒适、高温三档，自己定界线。",
            "把演示中的 90 改成 85，重新判断 86 分落在哪一档。",
            "写出一个三档判断，故意把宽条件放前面，运行并解释错误结果。"
          ]},
          { t: "tip", color: "green", text: "一句话：if 从上往下只走第一条成立的分支；else 兜底，else if 续接条件，顺序决定边界。" }
        ]
      },
      {
        id: "cs09",
        title: "第 9 课 · for 循环",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：用 for 重复执行固定次数的代码，并看懂初始化、条件、更新三段。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "for 的圆括号里用两个分号隔开三段：初始化、条件、更新。初始化只执行一次；每轮开始前算条件；条件为 true 才进循环体；一轮结束后执行更新。三段各司其职，读一行就知道循环怎么开始、何时停、每步走多远。" },
          { t: "p", text: "循环体执行完，程序回到条件处再判断。条件变 false 时退出，接着执行 for 后面的语句。计数变量通常声明在 for 里，离开循环就不能再用，这能减少名字冲突。" },
          { t: "p", text: "计数从 0 开始是常见约定，很多序列的编号都从 0 起。循环次数等于终值减初值加一，写条件时要想清楚边界要不要取等号。条件写小于 5 走五次，写小于等于 5 走六次，差一个符号结果就不同。" },
          { t: "p", text: "循环里可以累加、拼接、打印，也可以嵌套另一个循环。嵌套时内外层变量要换名字，否则内层会遮住外层。先让每层只做一件小事，再考虑组合。" },
          { t: "p", text: "改循环边界时，先算次数再看代码。从 1 到 5 共五次，从 0 到 4 也是五次，起点换了，条件也要跟着换。写完用一个小范围手算一遍，比盯着屏幕猜更可靠。如果循环体里改了计数变量，次数就不再直观，初学阶段尽量不要这么做。手算一遍再运行，这一步别跳过。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "固定次数的重复最适合 for：打印表格、累加分数、遍历下标、生成序列。它把开始、继续、步进三件事写在一行，读起来集中。次数明确时，for 更紧凑，三件事也不容易漏。" },
          { t: "h2", text: "演示：打印 1 到 5 并求和" },
          { t: "p", text: "下面循环五次，打印计数并累加到 sum。注意 sum 在循环外声明，循环内更新。" },
          { t: "code", lang: "csharp", code: `using System;

int sum = 0;

for (int i = 1; i <= 5; i++)
{
    Console.WriteLine(i);
    sum += i;
}

Console.WriteLine(sum);` },
          { t: "p", text: "输出是 1 到 5，最后一行是 15。i++ 表示每轮结束加一；sum += i 是 sum = sum + i 的简写。循环结束后 i 已不可见。sum 留在外面，所以循环结束后还能读到总数。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320"><rect x="30" y="20" width="580" height="280" rx="14" fill="#f3f0fb"/><text x="320" y="46" font-size="20" font-weight="700" text-anchor="middle" fill="#2d2350">for：三段控制一次循环</text><text x="40" y="74" font-size="15" fill="#5d5378">初始化（只执行一次）：int i = 1</text><rect x="210" y="88" width="210" height="50" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="315" y="119" font-size="16" text-anchor="middle" fill="#2d2350">i ≤ 5 ?</text><line x1="315" y1="138" x2="315" y2="170" stroke="#6b4fbb" stroke-width="3"/><polygon points="315,170 309,160 321,160" fill="#6b4fbb"/><text x="327" y="158" font-size="14" fill="#5d5378">是</text><rect x="210" y="174" width="210" height="50" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="315" y="205" font-size="15" text-anchor="middle" fill="#2d2350">打印 i，sum += i</text><line x1="315" y1="224" x2="315" y2="250" stroke="#6b4fbb" stroke-width="3"/><polygon points="315,250 309,240 321,240" fill="#6b4fbb"/><rect x="210" y="254" width="210" height="38" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="315" y="279" font-size="16" text-anchor="middle" fill="#2d2350">i++</text><path d="M210 273H170V113H204" fill="none" stroke="#6b4fbb" stroke-width="3"/><polygon points="210,113 200,107 200,119" fill="#6b4fbb"/><text x="176" y="190" font-size="14" fill="#5d5378">回跳</text><rect x="476" y="88" width="134" height="50" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="543" y="119" font-size="15" text-anchor="middle" fill="#2d2350">退出循环</text><line x1="420" y1="113" x2="472" y2="113" stroke="#6b4fbb" stroke-width="3"/><polygon points="472,113 462,107 462,119" fill="#6b4fbb"/><text x="440" y="105" font-size="14" text-anchor="middle" fill="#5d5378">否</text><text x="320" y="314" font-size="15" text-anchor="middle" fill="#5d5378">更新完回到条件，条件为 false 才离开循环</text></svg>`, caption: "初始化一次，条件每轮都看，更新每轮都做；三者缺一不可。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "条件写成小于 5 却想打印 5。边界差一，循环只到 4。",
            "在循环里重复声明 sum。每轮都归零，累加结果永远不对。",
            "忘了更新。i 不变，条件永远为 true，程序卡死。",
            "在循环外使用 i。i 声明在 for 里，作用域只在循环内。",
            "用浮点数当循环计数。累加误差可能让次数偏一，计数优先用 int。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 for 打印 10 到 1 的倒序。",
            "用 for 求 1 到 100 中所有偶数的和，只打印结果。",
            "故意把 i++ 删掉，运行几秒后停止程序，解释发生了什么。"
          ]},
          { t: "tip", color: "green", text: "一句话：for 把初始化、条件、更新写在一行；条件为 true 就继续，false 就退出。" }
        ]
      },
      {
        id: "cs10",
        title: "第 10 课 · while 循环",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：用 while 在条件成立时反复执行，并学会手动更新循环变量。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "while 只有一个条件，没有初始化和更新段。每轮开始前算条件，true 就执行循环体，false 就退出。初始化写在循环前，更新写在循环体里。三件事分开写，顺序需要自己保证。" },
          { t: "p", text: "因为更新由你手写，while 更适合次数事先不确定的场景：读到文件末尾、输入合法为止、队列取空为止。次数固定时，for 更紧凑，也不容易漏掉更新。" },
          { t: "p", text: "写 while 先想清楚三件事：初始状态是什么、条件何时变 false、哪条语句推动它变化。缺了第三件，循环就停不下来。条件里的变量必须在循环中有机会改变，否则就是死循环。" },
          { t: "p", text: "循环结束后，条件里的变量仍然可以读取。用这个值判断循环是正常结束还是被中途打断，是常见的调试手段。初学时可以每轮打印一次变量，确认它在朝出口走。" },
          { t: "p", text: "和 for 相比，while 把控制拆得更散，所以更适合状态驱动的问题。写之前可以先画一张状态表：每轮开始时变量是多少、做完这一轮变成多少、什么时候不满足条件。表填得出来，循环基本就写对了；表填不出来，说明还没想清楚，不要急着敲代码。先写表，再写码，别省略这一步，表比代码可靠，表格越具体越好。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "只要条件还在，程序就能持续工作：倒计时、重试、逐位拆数字、消费任务。它比 for 更自由，也更需要你负责推进状态。状态推进得清楚，循环才可控。" },
          { t: "h2", text: "演示：倒计时" },
          { t: "p", text: "下面从 3 数到 1，每轮打印后把 count 减一。count 变成 0 时条件为 false，循环结束。" },
          { t: "code", lang: "csharp", code: `using System;

int count = 3;

while (count > 0)
{
    Console.WriteLine(count);
    count--;
}

Console.WriteLine("起飞");` },
          { t: "p", text: "输出是 3、2、1、起飞。count-- 是 count = count - 1 的简写，它必须放在循环体里，否则条件永远成立。更新语句放在打印之后，所以最后一轮打印的是 1。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="30" y="20" width="580" height="240" rx="14" fill="#f3f0fb"/><text x="320" y="48" font-size="20" font-weight="700" text-anchor="middle" fill="#2d2350">while：先看条件，再决定进不进</text><rect x="40" y="84" width="130" height="50" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="105" y="115" font-size="15" text-anchor="middle" fill="#2d2350">count = 3</text><line x1="170" y1="109" x2="206" y2="109" stroke="#6b4fbb" stroke-width="3"/><polygon points="206,109 196,103 196,115" fill="#6b4fbb"/><rect x="210" y="84" width="180" height="50" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="300" y="115" font-size="16" text-anchor="middle" fill="#2d2350">count > 0 ?</text><line x1="390" y1="109" x2="446" y2="109" stroke="#6b4fbb" stroke-width="3"/><polygon points="446,109 436,103 436,115" fill="#6b4fbb"/><text x="416" y="101" font-size="14" text-anchor="middle" fill="#5d5378">否</text><rect x="450" y="84" width="150" height="50" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="525" y="115" font-size="15" text-anchor="middle" fill="#2d2350">退出循环</text><line x1="300" y1="134" x2="300" y2="174" stroke="#6b4fbb" stroke-width="3"/><polygon points="300,174 294,164 306,164" fill="#6b4fbb"/><text x="312" y="158" font-size="14" fill="#5d5378">是</text><rect x="210" y="178" width="180" height="50" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="300" y="208" font-size="14" text-anchor="middle" fill="#2d2350">打印 count，count--</text><path d="M210 203H166V109H206" fill="none" stroke="#6b4fbb" stroke-width="3"/><polygon points="206,109 196,103 196,115" fill="#6b4fbb"/><text x="172" y="180" font-size="14" fill="#5d5378">回跳</text><text x="320" y="252" font-size="15" text-anchor="middle" fill="#5d5378">更新写在循环体里，条件才有机会变成 false</text></svg>`, caption: "while 不替你更新状态；少写一句 count--，循环就永远出不去。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "忘了更新 count。条件一直为 true，程序进入死循环。",
            "更新方向写反。count++ 会让条件越来越真。",
            "条件写成 count = 0。赋值表达式不能当 bool 条件。",
            "在循环里重新声明 count。每次都是新变量，状态无法推进。",
            "把结束语写进循环体。每轮都会打印一次，应该放到循环后面。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 while 打印 5 到 1，再打印一句结束语。",
            "用 while 把整数 1234 逐位拆开打印，提示：用 % 10 与 / 10。",
            "写一个忘记更新的 while，运行后强制停止，说明判断死循环的方法。"
          ]},
          { t: "tip", color: "green", text: "一句话：while 每轮先看条件；初始化和更新都要自己写，推动条件变化是循环能停下来的关键。" }
        ]
      },
      {
        id: "cs11",
        title: "第 11 课 · 方法",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：把一段逻辑包成方法，会用参数传入数据，用返回值带出结果。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "方法是一段有名字的代码块。定义时写返回类型、方法名、参数列表；调用时写方法名和实参。调用一次，方法体执行一次，执行完回到调用处继续往下走。" },
          { t: "p", text: "参数是方法内部的局部变量，调用时由实参赋值。return 把结果交给调用处，并立刻结束方法。返回类型写 void 表示不返回值，这时可以只写 return; 也可以省略。" },
          { t: "p", text: "方法让重复逻辑只写一次，修改也只改一处。名字取得好，调用处读起来像一句话，主流程会更短。一个方法只做一件小事，测试和复用都会轻松。" },
          { t: "p", text: "实参与参数按位置对应，类型要能匹配。方法名后面必须带括号，括号里放实参；不传实参也要写一对空括号。返回的结果可以直接打印，也可以先存进变量。" },
          { t: "p", text: "定义方法时先问三件事：需要什么输入、要算出什么结果、失败时怎么办。输入写进参数，结果用 return 带出，方法名用动词开头。三件事答清楚，方法体通常只有几行，调用处也一眼能看懂。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "算价格、格式化文本、校验输入，都可以收进方法。复杂程序就是许多小方法拼起来的，每个方法只做一件小事。调用处只关心输入与输出，不必重复读内部细节。" },
          { t: "h2", text: "演示：带参数与返回值的方法" },
          { t: "p", text: "下面定义一个 Add 方法，接两个 int，返回它们的和。顶级语句里声明的是局部函数，调用方式与普通方法一致。" },
          { t: "code", lang: "csharp", code: `using System;

Console.WriteLine(Add(2, 3));
Console.WriteLine(Add(10, 20));

int Add(int a, int b)
{
    return a + b;
}` },
          { t: "p", text: "第一次调用把 2 和 3 分别赋给 a、b，返回 5；第二次返回 30。返回值可以立刻使用，也可以先存起来，后面再处理。方法体里的 a、b 只在这次调用中存在，调用结束就消失。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260"><rect x="30" y="20" width="580" height="220" rx="14" fill="#f3f0fb"/><text x="320" y="46" font-size="20" font-weight="700" text-anchor="middle" fill="#2d2350">调用方法：传参、执行、带回结果</text><rect x="40" y="78" width="160" height="56" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="120" y="111" font-size="15" text-anchor="middle" fill="#2d2350">调用 Add(2, 3)</text><line x1="200" y1="106" x2="236" y2="106" stroke="#6b4fbb" stroke-width="3"/><polygon points="236,106 226,100 226,112" fill="#6b4fbb"/><rect x="240" y="78" width="140" height="56" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="310" y="111" font-size="15" text-anchor="middle" fill="#2d2350">a = 2，b = 3</text><line x1="380" y1="106" x2="416" y2="106" stroke="#6b4fbb" stroke-width="3"/><polygon points="416,106 406,100 406,112" fill="#6b4fbb"/><rect x="420" y="78" width="180" height="56" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="510" y="111" font-size="14" text-anchor="middle" fill="#2d2350">执行 return a + b</text><line x1="510" y1="134" x2="510" y2="168" stroke="#6b4fbb" stroke-width="3"/><polygon points="510,168 504,158 516,158" fill="#6b4fbb"/><rect x="420" y="172" width="180" height="40" rx="10" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="510" y="198" font-size="16" text-anchor="middle" fill="#2d2350">返回值 5</text><path d="M420 192H120V140" fill="none" stroke="#6b4fbb" stroke-width="3"/><polygon points="120,134 114,144 126,144" fill="#6b4fbb"/><text x="270" y="222" font-size="14" text-anchor="middle" fill="#5d5378">结果顺着箭头回到调用处</text></svg>`, caption: "实参进入参数，return 把结果送回调用点，方法体的局部变量随即消失。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "调用时漏写括号。Add 是方法组，Add(2, 3) 才是调用。",
            "实参顺序或类型不对。int 参数传字符串，编译期就会报错。",
            "返回类型与 return 的值不一致。声明 int 就必须返回 int。",
            "方法名与变量名重名。可读性差，也容易看错调用点。",
            "在方法里打印却不返回。需要结果时，应把值 return 出来。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "写一个 Multiply 方法，接两个 int 返回乘积，调用两次。",
            "写一个不返回值的方法，打印固定分隔线，在主流程里调用。",
            "写一个方法判断整数是否为偶数，返回 bool，并用两个数验证。"
          ]},
          { t: "tip", color: "green", text: "一句话：方法把逻辑收进名字里；参数负责传入，return 负责带出结果并结束方法。" }
        ]
      },
      {
        id: "cs12",
        title: "第 12 课 · 数组与 List",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：会用数组保存定长数据，会用 List 追加与读取，知道两者何时选谁。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "数组长度在创建时确定，之后不能加长。元素在内存里连续排列，用从 0 开始的下标访问，越界会抛异常。数组的 Length 是固定长度，创建后不会变。" },
          { t: "p", text: "List 是泛型集合，长度可变。Add 往末尾追加，Count 是当前元素数，Capacity 是内部数组容量；容量不够时自动扩容，通常是翻倍。扩容会复制旧元素，所以大量追加前可以先估个容量。" },
          { t: "p", text: "数组适合数量固定、按下标快速访问的场景；List 适合边运行边增删的场景。两者都用 0 起下标，遍历方式也相似。选哪个，看数据在运行中会不会变长。" },
          { t: "p", text: "声明时方括号表示数组类型，尖括号表示泛型参数。初始化列表用花括号写元素，元素之间用逗号分隔。类型写清楚，编辑器才能给出正确的补全与检查。" },
          { t: "p", text: "数组与 List 的下标都从 0 开始，但长度的来源不同。数组的长度创建后就固定；List 的 Count 会随 Add 变化，Capacity 只是内部预留。遍历时用 Count 当边界，不要在循环条件里写死一个数字，数据一变，写死的数字就会越界。先想清楚数量会不会变，再选结构。数量会变就用 List，这条规则够用了，别只图眼前方便，记住这一点，结构选对，后面省事。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "保存一组成绩、一批名字、一串待办，都靠这两种结构。会读会写之后，就能把多个值交给循环统一处理。数量固定用数组，数量会变用 List，选择并不难。" },
          { t: "h2", text: "演示：数组与 List 各一个" },
          { t: "p", text: "下面先建一个三元素数组，再建一个 List 并追加一个名字。注意 List 需要引入集合命名空间。" },
          { t: "code", lang: "csharp", code: `using System;
using System.Collections.Generic;

int[] scores = { 90, 85, 77 };
Console.WriteLine(scores[0]);
Console.WriteLine(scores.Length);

var names = new List<string> { "阿圆", "小北" };
names.Add("阿岚");
Console.WriteLine(names.Count);
Console.WriteLine(names[1]);` },
          { t: "p", text: "输出是 90、3、3、小北。数组用 Length，List 用 Count；下标 0 拿第一个元素，names[1] 是第二个。List 追加后长度从 2 变 3。索引与长度是两套信息，不要混用。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="28" y="20" width="584" height="240" rx="14" fill="#f3f0fb"/><text x="320" y="48" font-size="20" font-weight="700" text-anchor="middle" fill="#2d2350">数组定长，List 可变</text><text x="50" y="80" font-size="15" fill="#5d5378">数组 int[3]</text><rect x="50" y="92" width="74" height="48" rx="8" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="87" y="122" font-size="18" text-anchor="middle" fill="#2d2350">90</text><rect x="128" y="92" width="74" height="48" rx="8" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="165" y="122" font-size="18" text-anchor="middle" fill="#2d2350">85</text><rect x="206" y="92" width="74" height="48" rx="8" fill="#ffffff" stroke="#6b4fbb" stroke-width="2"/><text x="243" y="122" font-size="18" text-anchor="middle" fill="#2d2350">77</text><text x="50" y="162" font-size="14" fill="#5d5378">Length = 3，不能再加一格</text><text x="350" y="80" font-size="15" fill="#5d5378">List&lt;string&gt;</text><rect x="350" y="92" width="62" height="48" rx="8" fill="#e6dffa" stroke="#6b4fbb" stroke-width="2"/><text x="381" y="122" font-size="15" text-anchor="middle" fill="#2d2350">阿圆</text><rect x="416" y="92" width="62" height="48" rx="8" fill="#e6dffa" stroke="#6b4fbb" stroke-width="2"/><text x="447" y="122" font-size="15" text-anchor="middle" fill="#2d2350">小北</text><rect x="482" y="92" width="62" height="48" rx="8" fill="#ffffff" stroke="#b9aede" stroke-width="2"/><rect x="548" y="92" width="62" height="48" rx="8" fill="#ffffff" stroke="#b9aede" stroke-width="2"/><text x="350" y="162" font-size="14" fill="#5d5378">Count = 2，Capacity = 4</text><text x="320" y="198" font-size="15" text-anchor="middle" fill="#5d5378">List 的 Add 写在 Count 的位置，容量满时新建更大的内部数组</text><text x="320" y="228" font-size="15" text-anchor="middle" fill="#2d2350">数组看 Length，List 看 Count；下标都从 0 开始</text></svg>`, caption: "数组的格子数固定；List 预留容量，元素数超过容量时整体搬家。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "用 1 访问第一个元素。两种结构都从 0 开始。",
            "访问 scores[3]。三元素数组的合法下标是 0、1、2。",
            "想给数组追加元素。数组定长，要加就换 List 或新建更大的数组。",
            "把 Count 写成 count。C# 区分大小写，属性名是 Count。",
            "在遍历 List 时删除元素。下标会错位，先收集要删的项再统一删。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "建一个四元素数组，打印首尾两个元素与长度。",
            "建一个 List 装三种水果，追加一种，再打印 Count 与最后一项。",
            "用 for 遍历数组求和，再用 for 按下标打印 List 每个元素。"
          ]},
          { t: "tip", color: "green", text: "一句话：数组定长、List 可变；下标都从 0 开始，数组看 Length，List 看 Count。" }
        ]
      }
    ]
  }
};
