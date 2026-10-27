/* 喵站 · Rust 入门（单文件教程数据；12 课从历史讲到数组与 Vec）
 * 结构对照 go-data.js：tutorial 元信息 + 12 个 chapter，每章含任务与机制图。
 * 本机没有 rustc / cargo，代码按 Rust 2021 语法人工自查，未在真机运行。 */
window.MIAO_RUST = {
  tutorial: {
    id: "rust",
    title: "Rust 入门",
    intro: "从 Mozilla 的内部项目讲到 Vec：12 课走完 Rust 的入门语法，每课都有能照敲的程序和一张机制图。",
    cat: "Rust",
    diff: "入门",
    tags: ["Rust", "编程", "入门", "系统语言"],
    author: "喵站官方",
    cover: "/assets/img/covers/rust.svg",
    updated: "2026-10-27",
    chapters: [
      {
        id: "r01",
        title: "第 1 课 · Rust 的历史：从 Mozilla 到基金会",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：弄清 Rust 从个人项目到基金会的几个节点，知道它想解决什么问题。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "2006 年，Mozilla 的工程师 Graydon Hoare 写了一个小语言项目，想解决浏览器里并发代码太难写的问题。2009 年 Mozilla 开始赞助这个项目，2010 年它第一次对外公开，2015 年发布 1.0 版本，语法和标准库进入稳定期。" },
          { t: "p", text: "Rust 的核心卖点是「不牺牲性能的安全」。C 和 C++ 把内存控制权完全交给程序员，写错一个下标或忘掉释放，程序可能几分钟后崩溃，也可能悄悄算错。Rust 用所有权和借用检查把这类错误提前到编译期，编译通过的代码不会出现悬垂指针和数据竞争。" },
          { t: "p", text: "2020 年，Mozilla 裁员波及 Rust 团队，2021 年项目转入 Rust Foundation，由多家公司支持。这次交接让 Rust 不再依赖单一雇主，语言、编译器、包仓库 crates.io 都由基金会和社区维护。" },
          { t: "p", text: "从 Firefox 的样式引擎，到 Linux 内核、Windows 系统组件、Android 的底层模块，Rust 已进入稳定性要求最高的地方。它的工具链也很友好：cargo 把编译、依赖、测试、文档收进一个命令。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "写系统工具：命令行程序、文件处理、日志分析，编译成一个可执行文件就能分发。",
            "写网络服务：Web 后端、API 网关，性能接近 C，同时不用担心数据竞争。",
            "写嵌入式与底层模块：内核驱动、浏览器引擎组件，对性能和内存占用要求高的地方。",
            "给 Python 或 Node 写扩展：把热路径换成 Rust，再被上层语言调用。"
          ]},
          { t: "h2", text: "演示：一段 Rust 程序长什么样" },
          { t: "p", text: "先不装环境，只看形状。Rust 程序同样从 main 函数开始，输出用 println! 这个宏，语句以分号结尾。下面这段现在看不懂每个符号没关系，后面会一段一段拆。" },
          { t: "code", lang: "rust", code: `fn main() {
    println!("你好，{}", "喵站");
}` },
          { t: "p", text: "注意 {} 是占位符，后面的值会填进去；println! 后面带感叹号，说明它是宏而不是普通函数。宏在编译期展开，能检查格式串和参数是否对得上，写错占位符会直接编译失败。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240"><rect x="30" y="30" width="580" height="180" rx="14" fill="#f7f2ec"/><text x="320" y="66" font-size="20" font-weight="700" text-anchor="middle" fill="#3d2b1f">Rust 的四个关键节点</text><line x1="70" y1="140" x2="570" y2="140" stroke="#b5651d" stroke-width="3"/><circle cx="105" cy="140" r="8" fill="#b5651d"/><circle cx="250" cy="140" r="8" fill="#b5651d"/><circle cx="395" cy="140" r="8" fill="#b5651d"/><circle cx="540" cy="140" r="8" fill="#b5651d"/><text x="105" y="118" font-size="16" text-anchor="middle" fill="#3d2b1f">2006</text><text x="105" y="168" font-size="14" text-anchor="middle" fill="#6b5545">个人项目</text><text x="250" y="118" font-size="16" text-anchor="middle" fill="#3d2b1f">2009</text><text x="250" y="168" font-size="14" text-anchor="middle" fill="#6b5545">Mozilla 赞助</text><text x="395" y="118" font-size="16" text-anchor="middle" fill="#3d2b1f">2015</text><text x="395" y="168" font-size="14" text-anchor="middle" fill="#6b5545">发布 1.0</text><text x="540" y="118" font-size="16" text-anchor="middle" fill="#3d2b1f">2021</text><text x="540" y="168" font-size="14" text-anchor="middle" fill="#6b5545">Rust 基金会</text></svg>`, caption: "从个人实验到基金会，Rust 用了十五年把语言和治理都稳定下来。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把 Rust 当成「C++ 的替代品」直接套类继承。Rust 没有类和继承，组合与 trait 才是它的组织方式。",
            "以为所有权只是语法糖。它是一套编译期规则，决定谁能读、谁能改、谁负责释放。",
            "听说安全就以为不会崩溃。Rust 仍可能 panic、可能逻辑出错，安全指的是不出现未定义行为。",
            "把 Rust 和 Go 混为一谈。两者都讲并发安全，但 Go 靠运行时调度和垃圾回收，Rust 靠编译期检查。",
            "以为必须有基金会账号才能学。语言、文档、包仓库全部免费，装好工具链就能开始。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "不看资料，按时间顺序写出 Rust 的四个节点：个人项目、Mozilla 赞助、1.0、基金会。",
            "用一句话解释「编译期检查」和「运行时报错」的区别，并举一个你认为属于前者的例子。",
            "列出三个你常用的、可能由 Rust 参与实现的软件或系统组件。"
          ]},
          { t: "tip", color: "green", text: "一句话：Rust 从 Mozilla 的内部实验长成基金会项目，用编译期检查换取性能与安全同时成立。" }
        ]
      },
      {
        id: "r02",
        title: "第 2 课 · 装 rustup 和 VS Code",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：用 rustup 装好工具链，装上 VS Code 的 rust-analyzer 扩展，最后用版本命令确认安装。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "Rust 的官方安装器叫 rustup。它不只装一次编译器，而是装一整套工具链：rustc 负责编译，cargo 负责建项目、拉依赖、跑测试，rustfmt 负责格式化，clippy 负责挑出可疑写法。以后升级语言版本，也用 rustup 一条命令。" },
          { t: "p", text: "工具链分稳定版、测试版、夜间版三条通道。入门只用稳定版，它每六周发一个小版本，保证旧代码能继续编译。夜间版才有还没稳定的实验特性，初学阶段不需要碰。" },
          { t: "p", text: "VS Code 本身只是编辑器，真正提供补全和报错的是 rust-analyzer 扩展，它调用本机的 cargo 和 rustc 分析代码。所以顺序不能反：先装 rustup，再装扩展，否则扩展找不到工具链，只会一直报错。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "装好之后，你可以在任意目录用 cargo new 建项目，用 cargo run 编译并运行，用 cargo check 只做类型检查。后面每节课的演示都假设这两个命令可用。" },
          { t: "h2", text: "演示：在 Linux 或 macOS 上安装" },
          { t: "p", text: "VS Code 先从官网安装，然后按顺序执行：第一条下载并运行安装脚本，第二条让当前终端认识 cargo 命令，后两条验证编译器与包工具，最后一条装扩展。" },
          { t: "code", lang: "bash", code: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
rustc --version
cargo --version
code --install-extension rust-lang.rust-analyzer` },
          { t: "p", text: "rustc --version 输出形如 rustc 1.83.0 加一段提交哈希；cargo --version 输出 cargo 1.83.0。看到版本号说明编译器就绪。安装脚本会问安装方式，回车选默认即可。" },
          { t: "p", text: "版本号只证明命令在，不能证明编译链完整。写个最小程序跑一次，看到打印结果才算可用。" },
          { t: "code", lang: "rust", code: `fn main() {
    println!("环境就绪");
}` },
          { t: "p", text: "把这段存成 hello.rs，执行 rustc hello.rs，同目录多出一个可执行文件，运行它就会打印环境就绪。这一步不经过 cargo。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260"><rect x="30" y="30" width="580" height="200" rx="14" fill="#f7f2ec"/><text x="320" y="66" font-size="20" font-weight="700" text-anchor="middle" fill="#3d2b1f">安装链：脚本到版本号</text><rect x="36" y="104" width="126" height="76" rx="10" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="99" y="134" font-size="15" text-anchor="middle" fill="#3d2b1f">安装脚本</text><text x="99" y="158" font-size="14" text-anchor="middle" fill="#6b5545">curl 下载</text><rect x="188" y="104" width="126" height="76" rx="10" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="251" y="134" font-size="15" text-anchor="middle" fill="#3d2b1f">rustup</text><text x="251" y="158" font-size="14" text-anchor="middle" fill="#6b5545">装工具链</text><rect x="340" y="104" width="126" height="76" rx="10" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="403" y="134" font-size="15" text-anchor="middle" fill="#3d2b1f">rustc 与 cargo</text><text x="403" y="158" font-size="14" text-anchor="middle" fill="#6b5545">进入 PATH</text><rect x="492" y="104" width="112" height="76" rx="10" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="548" y="134" font-size="15" text-anchor="middle" fill="#3d2b1f">版本号</text><text x="548" y="158" font-size="14" text-anchor="middle" fill="#6b5545">安装判据</text><line x1="162" y1="142" x2="184" y2="142" stroke="#b5651d" stroke-width="3"/><polygon points="184,142 175,137 175,147" fill="#b5651d"/><line x1="314" y1="142" x2="336" y2="142" stroke="#b5651d" stroke-width="3"/><polygon points="336,142 327,137 327,147" fill="#b5651d"/><line x1="466" y1="142" x2="488" y2="142" stroke="#b5651d" stroke-width="3"/><polygon points="488,142 479,137 479,147" fill="#b5651d"/><text x="320" y="212" font-size="14" text-anchor="middle" fill="#6b5545">扩展只做分析，编译仍由 rustc 完成</text></svg>`, caption: "装完不等于装好，终端能执行版本命令才算通过。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "装完新开终端提示 cargo 找不到。安装脚本改的是 shell 配置文件，重开终端或手动 source 一次即可。",
            "用发行版软件源装了一个旧版 rustc，和 rustup 装的版本打架。用 which rustc 看实际调用的是哪一个。",
            "把 rust-analyzer 当成编译器。它只做分析，真正生成可执行文件的是 rustc。",
            "在 Windows 上直接双击安装包却不装 C++ 构建工具，链接阶段会报错，需要先装 Visual Studio 的桌面开发组件。",
            "以为要 root 权限才能装。rustup 默认装在家目录，普通用户即可，只有改系统路径时才需要 sudo。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "按演示装好工具链，把 rustc --version 和 cargo --version 两行输出抄下来。",
            "用 which rustc 和 which cargo 确认命令位置，说明它们为什么在同一个目录下。",
            "在 VS Code 里打开一个 .rs 文件，故意写错一个类型，观察 rust-analyzer 有没有立刻标红。"
          ]},
          { t: "tip", color: "green", text: "一句话：rustup 装工具链、cargo 管项目、扩展只管界面；验证标准是版本命令能出数字。" }
        ]
      },
      {
        id: "r03",
        title: "第 3 课 · 第一个程序：println!",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：建一个 cargo 项目，写出第一个 main 函数，看懂 println! 的占位符和分号，把程序跑起来。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "Rust 程序从 main 函数开始执行。fn 是声明函数的关键字，main 是入口的固定名字，后面一对圆括号放参数，这里是空的。大括号里是这个函数要做的动作，程序跑完最后一行就退出。" },
          { t: "p", text: "输出用 println!。名字末尾的感叹号表示它是宏，不是普通函数。宏在编译期展开，可以检查格式串里的占位符数量和参数类型是否匹配，写错会直接编译失败，而不是运行时打印出奇怪的东西。" },
          { t: "p", text: "每条语句结尾要写分号。分号表示「这句话说完了」，Rust 靠它切分语句。大括号的位置不强制跟行尾，但 rustfmt 会统一成左大括号留在行尾的风格，团队协作时直接让格式化工具处理。" },
          { t: "p", text: "用 cargo 建项目会生成 Cargo.toml 和 src/main.rs 两个文件。Cargo.toml 记录项目名、版本和依赖，src/main.rs 是默认入口。编译产物放在 target 目录，不需要手动创建，也不要提交到版本库。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "会写这一行，你就能验证环境、验证语法、观察程序的输出。后面所有演示都从打印开始，它是最小的观察窗口。" },
          { t: "h2", text: "演示：从空目录到一行输出" },
          { t: "p", text: "先建项目，再进目录，然后运行。cargo new 会顺手初始化一个 git 仓库，不想用可以加 --vcs none。" },
          { t: "code", lang: "bash", code: `cargo new hello_rust
cd hello_rust
cargo run` },
          { t: "p", text: "第一次运行会编译整个项目，输出里先出现 Compiling，再出现 Running，最后才是程序自己的打印。之后改代码再跑，只重编改动的部分。" },
          { t: "code", lang: "rust", code: `fn main() {
    println!("你好，Rust");
    println!("我在{}", "杭州");
}` },
          { t: "p", text: "第一行打印固定文本，第二行把后面给的字符串填进 {} 的位置。占位符的个数必须和后面的参数一致，多一个少一个都会在编译时报错。想打印大括号本身，写成两个连续的大括号。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260"><rect x="30" y="30" width="580" height="200" rx="14" fill="#f7f2ec"/><text x="320" y="66" font-size="20" font-weight="700" text-anchor="middle" fill="#3d2b1f">cargo run 背后发生什么</text><rect x="42" y="104" width="132" height="76" rx="10" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="108" y="134" font-size="15" text-anchor="middle" fill="#3d2b1f">main.rs</text><text x="108" y="158" font-size="14" text-anchor="middle" fill="#6b5545">源码文件</text><rect x="198" y="104" width="132" height="76" rx="10" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="264" y="134" font-size="15" text-anchor="middle" fill="#3d2b1f">cargo run</text><text x="264" y="158" font-size="14" text-anchor="middle" fill="#6b5545">先编译再执行</text><rect x="354" y="104" width="132" height="76" rx="10" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="420" y="134" font-size="15" text-anchor="middle" fill="#3d2b1f">rustc</text><text x="420" y="158" font-size="14" text-anchor="middle" fill="#6b5545">生成可执行文件</text><rect x="510" y="104" width="94" height="76" rx="10" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="557" y="134" font-size="15" text-anchor="middle" fill="#3d2b1f">终端</text><text x="557" y="158" font-size="14" text-anchor="middle" fill="#6b5545">一行输出</text><line x1="174" y1="142" x2="194" y2="142" stroke="#b5651d" stroke-width="3"/><polygon points="194,142 185,137 185,147" fill="#b5651d"/><line x1="330" y1="142" x2="350" y2="142" stroke="#b5651d" stroke-width="3"/><polygon points="350,142 341,137 341,147" fill="#b5651d"/><line x1="486" y1="142" x2="506" y2="142" stroke="#b5651d" stroke-width="3"/><polygon points="506,142 497,137 497,147" fill="#b5651d"/></svg>`, caption: "cargo run 不是解释执行，它每次都先编译，只是产物藏在 target 目录。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "文件名写成 main.rs.txt。扩展名必须是 .rs，否则 cargo 不会把它当源码。",
            "println 后面漏了感叹号。普通函数没有这个宏的格式化能力，编译器会提示找不到。",
            "占位符和参数对不上。有几个 {} 就要给几个参数，顺序也要对。",
            "在 println! 末尾漏分号。宏调用也是语句，缺分号会连带下一行报错。",
            "把项目建在中文或带空格的路径下。多数情况能跑，但个别工具会对路径敏感，练习时用纯英文目录更省心。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 cargo new 建一个项目，跑通默认的 Hello, world!，再把输出改成你的名字。",
            "把第二行打印改成你的名字，再用两个连续的大括号打印一对大括号。",
            "故意删掉 println! 末尾的分号，抄下编译器给的第一条报错，再补回去。"
          ]},
          { t: "tip", color: "green", text: "一句话：main 是入口，println! 是带格式检查的宏，cargo run 负责编译加运行。" }
        ]
      },
      {
        id: "r04",
        title: "第 4 课 · 变量、不可变与 mut",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：会声明变量，理解默认不可变，知道什么时候加 mut，以及遮蔽与重新赋值的区别。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "声明变量用 let，后面跟名字，值可以写等号再给。Rust 的变量默认不可变：一旦绑定，就不能再改。这不是建议，是编译器强制的规则，试图给不可变变量赋值会直接报错。" },
          { t: "p", text: "需要改的时候，在名字前加 mut。mut 是 mutable 的缩写，意思是这个位置的值允许被重新赋值。加 mut 等于告诉读代码的人：这个变量后面会变，请留意。编译器也只在确实需要时才允许你加。" },
          { t: "p", text: "不可变是默认值，这个选择来自 Rust 的并发理念：如果一份数据从头到尾没人改，多个线程同时读它是安全的。把「会变」当成需要显式声明的例外，代码里真正会变的地方就一目了然。" },
          { t: "p", text: "let 还可以重复绑定同名变量，这叫遮蔽。新变量会盖住旧的，旧的仍然存在，只是名字被挡住；新变量可以是不同类型。遮蔽和用 mut 改值不是一回事：前者换了一个新绑定，后者改的是同一个位置。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "保存用户输入、计算结果这类运行中会变的值。",
            "给中间结果起名字，让后面的表达式不用重复写一长串。",
            "用不可变绑定表达「这个值定下来就不该再动」，减少误改。",
            "用遮蔽把字符串输入换成另一种类型，名字不用改。"
          ]},
          { t: "h2", text: "演示：不可变与 mut" },
          { t: "p", text: "下面这段先声明不可变变量，再声明一个带 mut 的计数器。注意 name 没有 mut，count 有 mut，差别就在能不能被重新赋值。" },
          { t: "code", lang: "rust", code: `fn main() {
    let name = "小北";
    println!("{}", name);

    let mut count = 1;
    println!("{}", count);
    count = 5;
    println!("{}", count);
}` },
          { t: "p", text: "name 从头到尾没变，不需要 mut。count 要改，所以加 mut，第二次打印就是 5。如果删掉 mut 再写 count = 5，编译会失败，报错里会建议把它改成可变绑定。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="30" y="30" width="580" height="220" rx="14" fill="#f7f2ec"/><text x="320" y="66" font-size="20" font-weight="700" text-anchor="middle" fill="#3d2b1f">默认不可变，mut 才允许改</text><rect x="58" y="94" width="236" height="70" rx="10" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="176" y="122" font-size="15" text-anchor="middle" fill="#3d2b1f">let name</text><text x="176" y="146" font-size="14" text-anchor="middle" fill="#6b5545">不可变绑定</text><rect x="346" y="94" width="236" height="70" rx="10" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="464" y="122" font-size="15" text-anchor="middle" fill="#3d2b1f">let mut count</text><text x="464" y="146" font-size="14" text-anchor="middle" fill="#6b5545">可变绑定</text><rect x="58" y="200" width="236" height="40" rx="8" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="176" y="226" font-size="14" text-anchor="middle" fill="#3d2b1f">再赋值：编译失败</text><rect x="346" y="200" width="236" height="40" rx="8" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="464" y="226" font-size="14" text-anchor="middle" fill="#3d2b1f">再赋值：成功</text><line x1="176" y1="164" x2="176" y2="196" stroke="#b5651d" stroke-width="2.5"/><line x1="464" y1="164" x2="464" y2="196" stroke="#b5651d" stroke-width="2.5"/></svg>`, caption: "变量名不变，能不能换值由 let 后面有没有 mut 决定。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "以为 let 声明的变量能随便改。默认不可变，要改必须加 mut。",
            "给所有变量都加 mut。能用不可变就用不可变，减少可改动的面，编译器的检查才有价值。",
            "把遮蔽当成改值。遮蔽产生新变量，原来的值还在，只是名字被后一个盖住。",
            "声明了变量却从没使用。Rust 会给出警告，变量名以单下划线开头可以明确表示「故意不用」。",
            "试图把整数变量重新赋成字符串。变量类型在第一次绑定时确定，换类型要重新 let 绑定。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "声明一个不可变变量存名字并打印，再尝试给它赋值，抄下报错。",
            "把同一个变量改成 mut 绑定，改三次值并各打印一次，观察输出顺序。",
            "用同一个 let 名字先存数字，再存字符串，确认遮蔽可以改变类型。"
          ]},
          { t: "tip", color: "green", text: "一句话：变量默认不可变，要改就显式加 mut；遮蔽是换一个新绑定，不是改旧值。" }
        ]
      },
      {
        id: "r05",
        title: "第 5 课 · 标量类型",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：认识整数、浮点、布尔、字符四种标量类型，会给变量标类型，知道整数溢出会怎样。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "标量类型是只能装一个值的类型。Rust 有四种：整数、浮点数、布尔值、字符。它们大小固定，编译器在编译期就知道每个变量占多少字节，这是 Rust 不靠运行时也能保证内存布局的基础。" },
          { t: "p", text: "整数按位宽分 i8、i16、i32、i64、i128 和对应的无符号 u8 到 u128，还有跟随平台的 isize 和 usize。默认整数是 i32，默认浮点是 f64。日常写计数用 i32 或 usize，usize 专门用来表示长度和下标。" },
          { t: "p", text: "布尔只有 true 和 false 两个值，占一个字节。字符用单引号，是 Unicode 标量值，一个中文、一个表情都算一个字符，占四个字节。字符串用双引号，属于另一种类型，本课先不展开。" },
          { t: "p", text: "整数溢出在调试构建会 panic，在发布构建默认按二进制补码回绕。初学阶段记住：算之前想清楚范围，别让溢出悄悄发生。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "整数存年龄、数量、编号、下标。",
            "浮点存价格、比例、测量值。",
            "布尔存开关状态和判断结果。",
            "字符存单个字母、汉字或符号，比如菜单里的一个选项。"
          ]},
          { t: "h2", text: "演示：四种标量各来一个" },
          { t: "p", text: "类型可以写在变量名后面，用冒号隔开；也可以不写，让编译器根据右边的值推断。下面全部写清楚，方便对照。" },
          { t: "code", lang: "rust", code: `fn main() {
    let age: i32 = 18;
    let price: f64 = 9.9;
    let flag: bool = true;
    let grade: char = 'A';
    println!("{} {} {} {}", age, price, flag, grade);
}` },
          { t: "p", text: "打印出来类型差别看不出来，但编译器记着。把 price 直接和 age 相加会编译失败，Rust 不做隐式数值转换，必须显式转换才能混算，或者一开始就选对类型。" },
          { t: "p", text: "usize 和 isize 的宽度跟平台走，64 位机器上是 64 位。长度和下标都用 usize，所以拿它们和 i32 做运算时，要先统一类型，别指望编译器自动帮你转。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="22" y="24" width="596" height="232" rx="14" fill="#f7f2ec"/><text x="320" y="60" font-size="20" font-weight="700" text-anchor="middle" fill="#3d2b1f">四种标量类型</text><rect x="42" y="84" width="132" height="104" rx="10" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="108" y="112" font-size="16" font-weight="700" text-anchor="middle" fill="#3d2b1f">i32</text><text x="108" y="138" font-size="14" text-anchor="middle" fill="#6b5545">整数</text><text x="108" y="162" font-size="14" text-anchor="middle" fill="#6b5545">4 字节</text><rect x="190" y="84" width="132" height="104" rx="10" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="256" y="112" font-size="16" font-weight="700" text-anchor="middle" fill="#3d2b1f">f64</text><text x="256" y="138" font-size="14" text-anchor="middle" fill="#6b5545">浮点</text><text x="256" y="162" font-size="14" text-anchor="middle" fill="#6b5545">8 字节</text><rect x="338" y="84" width="132" height="104" rx="10" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="404" y="112" font-size="16" font-weight="700" text-anchor="middle" fill="#3d2b1f">bool</text><text x="404" y="138" font-size="14" text-anchor="middle" fill="#6b5545">真或假</text><text x="404" y="162" font-size="14" text-anchor="middle" fill="#6b5545">1 字节</text><rect x="486" y="84" width="112" height="104" rx="10" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="542" y="112" font-size="16" font-weight="700" text-anchor="middle" fill="#3d2b1f">char</text><text x="542" y="138" font-size="14" text-anchor="middle" fill="#6b5545">单个字符</text><text x="542" y="162" font-size="14" text-anchor="middle" fill="#6b5545">4 字节</text><text x="320" y="226" font-size="14" text-anchor="middle" fill="#6b5545">类型决定能装什么、占几个字节、能做哪些运算</text></svg>`, caption: "标量类型的大小固定，编译器靠它安排每个值的存放位置。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把 i32 和 u32 直接比较或相加。无符号和有符号是不同类型，必须先转换。",
            "以为整数可以随便装。每种整数都有范围，i8 只到 127。",
            "用 char 存一整句话。char 只能装一个字符，字符串要用双引号。",
            "把字符的单引号和字符串的双引号写反。单引号里多于一个字符会编译报错。",
            "在调试时看到溢出 panic 就以为发布版也会。发布版默认回绕，行为不同，别依赖溢出。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "声明四个变量，分别装整数、小数、布尔、字符，各打印一次。",
            "把 i32 和 f64 相加，抄下编译错误；再把整数那一项改成 f64，让程序通过编译。",
            "声明一个 i8 变量并赋 127，再试图加 1，分别在调试和发布模式下运行，比较结果。"
          ]},
          { t: "tip", color: "green", text: "一句话：标量就是单个值，整数看位宽、浮点默认 f64、布尔只有两值、字符是单个 Unicode 标量。" }
        ]
      },
      {
        id: "r06",
        title: "第 6 课 · 运算符",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：掌握算术、比较、逻辑三类运算符，分清整数除法和浮点除法，知道比较结果一定是布尔值。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "运算符是表达式里最小的计算单位。算术有加、减、乘、除、取余，符号是 + - * / %。两个整数相除，结果还是整数，小数部分直接丢掉；要得到小数结果，两个操作数里至少有一个是浮点。" },
          { t: "p", text: "比较运算符有 == != > < >= <=，结果一定是 bool。一个等号是赋值，两个等号才是判断相等，这个区别在条件里尤其容易写错。浮点数用 == 比较要谨慎，二进制表示有误差，通常比较差值是否足够小。" },
          { t: "p", text: "逻辑运算符是 && || !，分别表示并且、或者、取反。它们有短路行为：&& 左边为假时右边不再计算，|| 左边为真时右边不再计算。短路不仅是性能优化，也能避免右边的表达式在无效状态下执行。" },
          { t: "p", text: "运算符有优先级，乘除取余高于加减，比较高于逻辑。记不清就加括号，括号不会让代码变慢，只会让读的人少猜一次。复合赋值 += -= *= /= 是「先算再写回」的简写。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "算总价、平均分、折扣和余数。",
            "比较两个值的大小，为后面的条件判断准备布尔值。",
            "把多个条件组合起来，例如年龄够并且已登录。",
            "用复合赋值累加计数，少写一遍变量名。"
          ]},
          { t: "h2", text: "演示：算术、比较、逻辑" },
          { t: "p", text: "下面这段把三类运算符各用一次。注意 a / b 的结果，和你想的可能不一样。" },
          { t: "code", lang: "rust", code: `fn main() {
    let a = 10;
    let b = 3;
    println!("{}", a + b);
    println!("{}", a / b);
    println!("{}", a % b);
    println!("{}", a > b && b > 0);
    println!("{}", !(a == b));
}` },
          { t: "p", text: "输出依次是 13、3、1、true、true。a / b 是整数除法，小数被丢掉；想要 3.333 得先把 a 写成 10.0，或者用 as 转换。a % b 是余数，10 除以 3 余 1。" },
          { t: "p", text: "最后一行先算括号里的 a == b，得到 false，再用 ! 取反成 true。逻辑表达式建议拆成几个有名字的布尔变量，读起来比一长串符号清楚。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="30" y="30" width="580" height="220" rx="14" fill="#f7f2ec"/><text x="320" y="64" font-size="20" font-weight="700" text-anchor="middle" fill="#3d2b1f">运算优先级：从上往下算</text><rect x="150" y="82" width="340" height="30" rx="6" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="320" y="102" font-size="15" text-anchor="middle" fill="#3d2b1f">圆括号，最先算</text><rect x="150" y="118" width="340" height="30" rx="6" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="320" y="138" font-size="15" text-anchor="middle" fill="#3d2b1f">乘 除 取余</text><rect x="150" y="154" width="340" height="30" rx="6" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="320" y="174" font-size="15" text-anchor="middle" fill="#3d2b1f">加 减</text><rect x="150" y="190" width="340" height="30" rx="6" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="320" y="210" font-size="15" text-anchor="middle" fill="#3d2b1f">比较，得出布尔值</text><rect x="150" y="226" width="340" height="30" rx="6" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="320" y="246" font-size="15" text-anchor="middle" fill="#3d2b1f">逻辑 并且 或者 取反</text><line x1="112" y1="88" x2="112" y2="250" stroke="#b5651d" stroke-width="2.5"/><polygon points="112,250 107,240 117,240" fill="#b5651d"/><text x="96" y="92" font-size="14" text-anchor="middle" fill="#6b5545">高</text><text x="96" y="248" font-size="14" text-anchor="middle" fill="#6b5545">低</text></svg>`, caption: "越靠上越先结合；混用逻辑运算时，括号比记忆可靠。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把 = 当成比较。x = 1 是赋值，x == 1 才是判断相等。",
            "整数除法当成小数除法。5 / 2 得 2，不是 2.5。",
            "除以零。整数除以零会 panic，浮点除以零得到无穷大或 NaN，都不会给你想要的数。",
            "用 == 比较两个浮点计算结果。应比较两者差值的绝对值是否小于一个很小的数。",
            "逻辑表达式混用 && 和 || 却不加括号。优先级容易记错，加括号最稳。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用两个整数变量算加、减、乘、除、取余，把五个结果打印出来。",
            "把其中一个操作数改成浮点，再做除法，比较结果和整数除法的差别。",
            "写一个逻辑表达式：年龄大于等于 18 并且持有票，分别改两个变量，打印四种组合的结果。"
          ]},
          { t: "tip", color: "green", text: "一句话：算术算数值、比较出布尔、逻辑组合条件；整数相除丢小数，不确定优先级就加括号。" }
        ]
      },
      {
        id: "r07",
        title: "第 7 课 · if 条件",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：会写 if 让程序按条件执行，知道条件必须是布尔值、大括号不能省，以及条件为假时程序往哪走。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "if 的作用是「条件成立才执行这一段」。写法是 if 加一个布尔表达式，再跟一对大括号。条件不需要圆括号，但大括号必须有，哪怕里面只有一行。" },
          { t: "p", text: "条件的结果必须是 bool。Rust 不会把数字、字符串自动转成真假，写 if 1 会直接编译失败。这条规则消灭了「0 是假、非 0 是真」这类靠约定维持的写法，读代码时不用猜。" },
          { t: "p", text: "条件为假时，大括号里的整段被跳过，程序接着执行 if 后面的下一行。跳过不是报错，也不是退出函数，后面的代码照常运行。" },
          { t: "p", text: "if 的条件可以是任意布尔表达式，也可以先算好存进变量，再把这个变量放进 if。把条件拆成有名字的布尔变量，读起来比一长串符号清楚，调试时也容易单独打印它。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "分数够不够及格，够就打印通过。",
            "用户有没有登录，登录了才显示资料。",
            "库存够不够，够才允许下单。",
            "先算一个中间值，再根据它决定要不要执行某段代码。"
          ]},
          { t: "h2", text: "演示：最基本的 if" },
          { t: "p", text: "先看最基本的形状。score 是 72，条件成立，大括号里的打印会执行，随后打印检查结束。" },
          { t: "code", lang: "rust", code: `fn main() {
    let score = 72;
    if score >= 60 {
        println!("及格");
    }
    println!("检查结束");
}` },
          { t: "p", text: "把 72 改成 50，及格不会出现，检查结束仍然打印，因为它在 if 外面。条件也可以先算进布尔变量：下面的 passed 和 !passed 正好相反，两个 if 互斥，只会走一个。" },
          { t: "code", lang: "rust", code: `fn main() {
    let score = 50;
    let passed = score >= 60;
    if passed {
        println!("及格");
    }
    if !passed {
        println!("继续加油");
    }
}` },
          { t: "p", text: "score 是 50，passed 是 false，第一个 if 跳过，第二个 if 的条件经过取反变成 true，打印继续加油。if 本身不会改变变量，它只决定执行路径。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="20" y="20" width="600" height="240" rx="14" fill="#f7f2ec"/><text x="320" y="58" font-size="20" font-weight="700" text-anchor="middle" fill="#3d2b1f">if 只决定这一段走不走</text><polygon points="320,92 420,140 320,188 220,140" fill="#ffffff" stroke="#b5651d" stroke-width="2.5"/><text x="320" y="147" font-size="15" text-anchor="middle" fill="#3d2b1f">分数够 60 吗</text><line x1="420" y1="140" x2="456" y2="140" stroke="#b5651d" stroke-width="3"/><polygon points="456,140 446,135 446,145" fill="#b5651d"/><text x="438" y="130" font-size="14" text-anchor="middle" fill="#6b5545">真</text><rect x="460" y="112" width="140" height="56" rx="8" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="530" y="137" font-size="15" text-anchor="middle" fill="#3d2b1f">执行 if 块</text><text x="530" y="159" font-size="14" text-anchor="middle" fill="#6b5545">然后继续往下</text><line x1="320" y1="188" x2="320" y2="206" stroke="#b5651d" stroke-width="2.5"/><polygon points="320,206 315,198 325,198" fill="#b5651d"/><text x="320" y="232" font-size="14" text-anchor="middle" fill="#6b5545">假：整段跳过，也继续往下</text></svg>`, caption: "条件为真才进右边那块，为假就绕过它；两条路最后都会往下走。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "给条件加圆括号。语法允许，但 rustfmt 会去掉，别养成习惯。",
            "if 后面漏了大括号。Rust 要求用大括号包住代码块，只有一行也要写。",
            "用数字当条件。if 1 不会编译，条件必须是 bool。",
            "把 = 和 == 写混。判断相等用两个等号，一个等号是赋值。",
            "在 if 里声明变量，出来还想用。它只活在大括号里。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "写一个 if，分数大于等于 60 时打印及格，分别用 72 和 50 各跑一次，记录输出。",
            "先算一个布尔变量再放进 if，观察和直接写表达式有没有区别。",
            "故意把条件改成 if score，抄下编译器报错，说明为什么不能这样写。"
          ]},
          { t: "tip", color: "green", text: "一句话：if 是条件为真才走这一段，条件必须得到 bool，大括号永远不能省。" }
        ]
      },
      {
        id: "r08",
        title: "第 8 课 · else 与表达式",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：用 else 和 else if 补上另外几条路，理解 if 本身是一个能产生值的表达式。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "if 只处理条件成立的情况。要处理否则，就在右大括号后面接 else。else 必须和前面的 if 配对，且 } else { 要写在同一行，中间不能换行。" },
          { t: "p", text: "多条分支用 else if，从上往下依次判断，哪条先为真就执行哪条，后面的整条链跳过。顺序因此很重要：范围更窄、更严格的条件要放在前面，宽松的放后面。" },
          { t: "p", text: "在 Rust 里，if 是表达式，不是语句。表达式会算出一个值，所以可以把它赋给变量：let level = if score >= 60 { 1 } else { 0 };。两个分支的值必须是同一类型，否则编译失败。" },
          { t: "p", text: "表达式和语句的区别很重要：语句做一件事，不产生值；表达式算出一个值。大括号块也是表达式，块里最后一个表达式（不带分号）就是整块的值。这条规则在函数返回值里还会再遇到。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "成绩分优秀、及格、不及格三档。",
            "登录状态分已登录和未登录，显示不同内容。",
            "根据开关状态决定打印哪一种提示。",
            "把二选一的结果直接赋给变量，少写一次中间赋值。"
          ]},
          { t: "h2", text: "演示：两档与三档" },
          { t: "p", text: "先看两档。score 是 50，条件不成立，程序走 else，只打印不及格。" },
          { t: "code", lang: "rust", code: `fn main() {
    let score = 50;
    if score >= 60 {
        println!("及格");
    } else {
        println!("不及格");
    }
}` },
          { t: "p", text: "再看三档，同时把结果赋给变量。85 先和 90 比不成立，再和 60 比成立，返回 2，最后的 else 不再执行。" },
          { t: "code", lang: "rust", code: `fn main() {
    let score = 85;
    let level = if score >= 90 {
        3
    } else if score >= 60 {
        2
    } else {
        1
    };
    println!("等级 {}", level);
}` },
          { t: "p", text: "这段演示了两件事：else if 排队判断，以及 if 表达式的值赋给 level。每个分支最后的值后面没有分号，有分号就变成语句，整块的值就变成空，赋值会失败。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="20" y="20" width="600" height="260" rx="14" fill="#f7f2ec"/><text x="320" y="52" font-size="20" font-weight="700" text-anchor="middle" fill="#3d2b1f">else if：从上往下，命中就停</text><rect x="50" y="78" width="240" height="44" rx="8" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="170" y="106" font-size="15" text-anchor="middle" fill="#3d2b1f">分数到 90 吗</text><line x1="290" y1="100" x2="344" y2="100" stroke="#b5651d" stroke-width="2.5"/><polygon points="344,100 334,95 334,105" fill="#b5651d"/><text x="318" y="90" font-size="14" text-anchor="middle" fill="#6b5545">是</text><rect x="350" y="78" width="180" height="44" rx="8" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="440" y="106" font-size="15" text-anchor="middle" fill="#3d2b1f">优秀</text><line x1="170" y1="122" x2="170" y2="152" stroke="#b5651d" stroke-width="2.5"/><polygon points="170,152 165,144 175,144" fill="#b5651d"/><text x="184" y="144" font-size="14" text-anchor="middle" fill="#6b5545">否</text><rect x="50" y="158" width="240" height="44" rx="8" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="170" y="186" font-size="15" text-anchor="middle" fill="#3d2b1f">分数到 60 吗</text><line x1="290" y1="180" x2="344" y2="180" stroke="#b5651d" stroke-width="2.5"/><polygon points="344,180 334,175 334,185" fill="#b5651d"/><text x="318" y="170" font-size="14" text-anchor="middle" fill="#6b5545">是</text><rect x="350" y="158" width="180" height="44" rx="8" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="440" y="186" font-size="15" text-anchor="middle" fill="#3d2b1f">及格</text><line x1="170" y1="202" x2="170" y2="232" stroke="#b5651d" stroke-width="2.5"/><polygon points="170,232 165,224 175,224" fill="#b5651d"/><text x="184" y="224" font-size="14" text-anchor="middle" fill="#6b5545">否</text><rect x="50" y="238" width="240" height="44" rx="8" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="170" y="266" font-size="15" text-anchor="middle" fill="#3d2b1f">剩下：不及格</text></svg>`, caption: "三条分支只走一条，前面的条件越严格，后面的判断才不会被挡住。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把 else 换到下一行。右大括号后面接 else 时必须在同一行写成 } else {。",
            "else if 顺序写反。宽松条件放前面会挡住严格条件。",
            "if 表达式两个分支类型不同。一个给整数一个给字符串，编译器不会帮你统一。",
            "分支值后面多写分号。加了分号就成了语句，块的值变成空，赋值会失败。",
            "以为 else 处理错误。它只是另一条分支，不捕获 panic。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "写两档分支，分数 50 打印不及格，60 打印及格，各跑一次。",
            "写三档分支，分别用 95、75、40 跑，记录每条走哪一支。",
            "用 if 表达式给变量赋值，两个分支都返回整数，再故意让一个分支返回字符串，抄下报错。"
          ]},
          { t: "tip", color: "green", text: "一句话：else 是另一条路，else if 从上往下排队；if 是表达式，两边分支类型要一致。" }
        ]
      },
      {
        id: "r09",
        title: "第 9 课 · loop 循环",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：用 loop 写无限循环，用 break 退出，用 continue 跳过一轮，知道 loop 也能带返回值。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "loop 是最简单的循环：大括号里的代码反复执行，直到遇到 break。它不写条件，所以默认会一直转，出口必须由循环体自己给出。" },
          { t: "p", text: "break 立刻结束整个循环，程序接着执行循环后面的代码。continue 只结束当前这一轮，跳回循环开头开始下一轮。两者通常和 if 一起用：满足某个条件就停，或者跳过不关心的那一轮。" },
          { t: "p", text: "loop 也是表达式，break 后面可以跟一个值，这个值就成为整个 loop 的结果。比如在循环里找到答案后用 break 把答案交出去，再用 let 接住，不需要先声明一个可变变量。" },
          { t: "p", text: "因为 loop 没有条件，编译器对它的分析更直接：只要循环体里存在能到达的 break，后面的代码就一定会被执行。反过来，如果循环永远不退出，程序就卡在那里，只能外部终止。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "反复尝试一件事，成功就退出，比如等一个文件出现。",
            "写一个必须至少执行一次的菜单循环。",
            "边算边判断，满足精度要求时用 break 交回结果。",
            "跳过某些不处理的轮次，用 continue 让循环继续。"
          ]},
          { t: "h2", text: "演示：数到三就停" },
          { t: "p", text: "这段用 loop 加一个计数器，每轮加一，数到三就 break。因为没有条件，出口完全由 if 控制。" },
          { t: "code", lang: "rust", code: `fn main() {
    let mut count = 0;
    loop {
        count += 1;
        println!("第 {} 轮", count);
        if count == 3 {
            break;
        }
    }
    println!("结束");
}` },
          { t: "p", text: "count 必须加 mut，因为每轮都要改。break 之后程序跳到 loop 外面，打印结束。把 break 删掉，程序会一直打印，得按 Ctrl+C 才能停。带返回值的 loop 则是另一种用法：break 后面跟一个值，整个循环就把这个值交出来，用 let 接住即可。" },
          { t: "code", lang: "rust", code: `fn main() {
    let mut n = 0;
    let answer = loop {
        n += 1;
        if n == 5 {
            break n * 10;
        }
    };
    println!("{}", answer);
}` },
          { t: "p", text: "answer 拿到 50。乘法只是把结果放大，重点是 loop 能产出一个值，不用先声明一个可变变量再在循环里改它。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320"><rect x="20" y="20" width="600" height="280" rx="14" fill="#f7f2ec"/><text x="320" y="52" font-size="20" font-weight="700" text-anchor="middle" fill="#3d2b1f">loop：break 才是出口</text><rect x="240" y="84" width="160" height="64" rx="10" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="320" y="122" font-size="16" text-anchor="middle" fill="#3d2b1f">执行循环体</text><line x1="320" y1="148" x2="320" y2="188" stroke="#b5651d" stroke-width="2.5"/><polygon points="320,188 315,180 325,180" fill="#b5651d"/><rect x="210" y="196" width="220" height="48" rx="8" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="320" y="226" font-size="15" text-anchor="middle" fill="#3d2b1f">遇到 break 吗</text><line x1="430" y1="220" x2="466" y2="220" stroke="#b5651d" stroke-width="2.5"/><polygon points="466,220 456,215 456,225" fill="#b5651d"/><text x="448" y="210" font-size="14" text-anchor="middle" fill="#6b5545">是</text><rect x="470" y="196" width="134" height="48" rx="8" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="537" y="226" font-size="15" text-anchor="middle" fill="#3d2b1f">跳出循环</text><path d="M210 220H120V116H232" fill="none" stroke="#b5651d" stroke-width="2.5"/><polygon points="232,116 222,111 222,121" fill="#b5651d"/><text x="150" y="206" font-size="14" text-anchor="middle" fill="#6b5545">否</text><text x="320" y="278" font-size="14" text-anchor="middle" fill="#6b5545">continue 只跳过本轮，循环仍然继续</text></svg>`, caption: "没有 break 就一直转；break 之后，循环后面的代码才接上。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "忘了写 break。loop 会永远转，终端停不下来，按 Ctrl+C 终止。",
            "break 写在 if 外面。循环第一轮就结束，起不到重复的作用。",
            "把 continue 当成 break 用。continue 只跳过本轮，循环还在继续。",
            "break 带值但外层没接住。值会被丢弃，通常说明这里写漏了赋值。",
            "循环变量忘了改。条件永远不满足，同样会变成死循环。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 loop 打印 1 到 5，数到 5 时 break。",
            "把 break 换成 continue，观察打印结果少了哪一轮，再改回来。",
            "写一个带返回值的 loop，用 break 交出一个整数，赋给变量后打印。"
          ]},
          { t: "tip", color: "green", text: "一句话：loop 没有条件，靠 break 出去、continue 跳轮；break 还能顺手把结果带出来。" }
        ]
      },
      {
        id: "r10",
        title: "第 10 课 · while 与 for",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：用 while 写条件循环，用 for 遍历范围，知道两种循环各自适合什么场景。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "while 后面接条件，每轮开始先判断，为真就执行循环体，为假就退出。它适合「不知道要转几轮，只知道什么时候停」的场景。" },
          { t: "p", text: "for 适合「有一个明确的序列」。最常见的是范围：for i in 0..5 走 0 到 4，for i in 1..=5 走 1 到 5。两个点是不含右端，两个点加等号是含右端，这个区别要记牢。" },
          { t: "p", text: "for 的循环变量由迭代器每轮交给你，不需要自己声明、自己加一，也就不会忘记推进条件导致死循环。这是它比 while 更适合遍历的原因。" },
          { t: "p", text: "两种循环都能用 break 和 continue。选择的标准很简单：有现成序列就用 for，只有条件就用 while。需要至少执行一次时，先做一次再进 while。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "while 反复读取，直到某个条件成立。",
            "for 把 1 到 100 逐个处理，求和或筛选。",
            "for 按下标走一遍固定次数。",
            "while 处理剩余次数大于零这类倒数任务。"
          ]},
          { t: "h2", text: "演示：倒数与求和" },
          { t: "p", text: "先看 while。n 从 3 开始，每轮打印再减一，减到 0 时条件为假，循环结束。" },
          { t: "code", lang: "rust", code: `fn main() {
    let mut n = 3;
    while n > 0 {
        println!("{}", n);
        n -= 1;
    }
    println!("起飞");
}` },
          { t: "p", text: "n -= 1 必须写在循环体里。删掉它，n 永远是 3，条件永远为真，程序就停不下来。" },
          { t: "p", text: "for 版本更短：不需要先声明计数器，也不用手动减一。范围 1..=3 表示 1、2、3 三个值，循环变量 i 由迭代器每轮给出。" },
          { t: "code", lang: "rust", code: `fn main() {
    let mut sum = 0;
    for i in 1..=3 {
        sum += i;
    }
    println!("{}", sum);
}` },
          { t: "p", text: "sum 要加 mut，因为循环里不断改它；i 不用 mut，它是每轮新建的绑定。循环结束后 i 就消失了，外面访问不到。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="16" y="16" width="608" height="268" rx="14" fill="#f7f2ec"/><rect x="20" y="56" width="288" height="216" rx="10" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="164" y="86" font-size="15" font-weight="700" text-anchor="middle" fill="#3d2b1f">while：先判断再执行</text><rect x="44" y="104" width="240" height="44" rx="8" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="164" y="132" font-size="15" text-anchor="middle" fill="#3d2b1f">判断条件</text><line x1="164" y1="148" x2="164" y2="172" stroke="#b5651d" stroke-width="2.5"/><polygon points="164,172 159,164 169,164" fill="#b5651d"/><rect x="44" y="176" width="240" height="44" rx="8" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="164" y="204" font-size="15" text-anchor="middle" fill="#3d2b1f">执行循环体</text><path d="M284 198H304V126H292" fill="none" stroke="#b5651d" stroke-width="2.5"/><polygon points="292,126 302,121 302,131" fill="#b5651d"/><text x="164" y="250" font-size="14" text-anchor="middle" fill="#6b5545">每轮结束回到条件</text><rect x="332" y="56" width="288" height="216" rx="10" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="476" y="86" font-size="15" font-weight="700" text-anchor="middle" fill="#3d2b1f">for：逐个取序列</text><rect x="356" y="104" width="240" height="44" rx="8" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="476" y="132" font-size="15" text-anchor="middle" fill="#3d2b1f">范围 1..=3</text><line x1="476" y1="148" x2="476" y2="172" stroke="#b5651d" stroke-width="2.5"/><polygon points="476,172 471,164 481,164" fill="#b5651d"/><rect x="356" y="176" width="240" height="44" rx="8" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="476" y="204" font-size="15" text-anchor="middle" fill="#3d2b1f">执行循环体</text><path d="M356 198H336V126H348" fill="none" stroke="#b5651d" stroke-width="2.5"/><polygon points="348,126 338,121 338,131" fill="#b5651d"/><text x="476" y="250" font-size="14" text-anchor="middle" fill="#6b5545">取完 3 个值就停</text><text x="320" y="292" font-size="14" text-anchor="middle" fill="#6b5545">两种循环都能用 break 和 continue</text></svg>`, caption: "while 每轮都回到条件；for 由序列决定轮数，取完即止。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "0..5 和 0..=5 搞混。前者走五个值，后者走六个。",
            "在 while 里忘了改条件变量，导致死循环。",
            "以为 for 的循环变量在循环外还能用。它的作用域只在循环体内。",
            "用 while 手动维护下标，却在 continue 之前忘了推进，造成死循环。",
            "把范围写成 5..0 想倒数。空范围一次都不执行，要换一种写法。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 while 打印 5 到 1，再打印一行结束。",
            "用 for 求 1 到 100 的和，打印结果，确认是 5050。",
            "把同一个倒数任务分别用 while 和 for 写一遍，比较两段代码的长度和你更容易读懂的那一版。"
          ]},
          { t: "tip", color: "green", text: "一句话：while 看条件，for 走序列；范围用 .. 不含右端、..= 含右端，遍历优先用 for。" }
        ]
      },
      {
        id: "r11",
        title: "第 11 课 · 函数",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：会把重复逻辑抽成函数，知道参数、返回值、return 的写法，以及最后一个表达式就是返回值。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "函数是起好名字的一段代码。调用时把参数传进去，函数体执行，结果用 return 交回来，或者用最后一个表达式直接交出。函数让主程序变短，也给一段逻辑起了能读懂的名字。" },
          { t: "p", text: "声明用 fn，后面是名字、参数列表、箭头和返回类型，最后是大括号。每个参数都要写类型，连续两个同类型参数也不能省略。没有返回值时箭头和类型都省掉，默认返回单元值。" },
          { t: "p", text: "Rust 的函数体是表达式块。最后一行不带分号，它的值就是返回值；带了分号就变成语句，值变成空，返回类型对不上会编译失败。想提前返回就用 return 加值再加分号。" },
          { t: "p", text: "参数按值传入，函数里改参数不会影响调用方的变量。传进来的值是怎么交接的，涉及更深的规则，本课先不展开；先记住函数内部的改动不会自动同步出去。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "把算平均分、算总价这类逻辑抽出来，多处复用。",
            "给一段复杂计算起名字，主函数只读名字就知道在做什么。",
            "把主函数拆小，每段只做一件事，便于单独测试。",
            "用一个函数封装输入检查，调用方不用重复写判断。"
          ]},
          { t: "h2", text: "演示：带参数的函数" },
          { t: "p", text: "add 接收两个 i32，返回它们的和。main 里调用后把结果交给 println! 打印。" },
          { t: "code", lang: "rust", code: `fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    let total = add(2, 3);
    println!("{}", total);
}` },
          { t: "p", text: "a + b 后面没有分号，它就是 add 的返回值。写成 a + b; 再加 return 也行，但多写几个词。参数名只在函数内部有效，main 里的变量不会和它冲突。" },
          { t: "p", text: "同一个函数可以调用多次，每次传入不同的实参，得到不同结果。函数的代码只写一份，行为由参数决定。" },
          { t: "code", lang: "rust", code: `fn main() {
    println!("{}", add(1, 2));
    println!("{}", add(10, 20));
}

fn add(a: i32, b: i32) -> i32 {
    a + b
}` },
          { t: "p", text: "函数写在 main 后面也能用，Rust 不要求先声明后调用。两次调用的结果分别是 3 和 30，靠的就是参数不同。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="20" y="20" width="600" height="260" rx="14" fill="#f7f2ec"/><text x="320" y="58" font-size="20" font-weight="700" text-anchor="middle" fill="#3d2b1f">调用函数：传参、计算、返回</text><rect x="40" y="110" width="120" height="70" rx="10" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="100" y="140" font-size="16" text-anchor="middle" fill="#3d2b1f">main</text><text x="100" y="162" font-size="14" text-anchor="middle" fill="#6b5545">调用处</text><line x1="160" y1="145" x2="198" y2="145" stroke="#b5651d" stroke-width="2.5"/><polygon points="198,145 188,140 188,150" fill="#b5651d"/><rect x="202" y="110" width="152" height="70" rx="10" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="278" y="138" font-size="16" text-anchor="middle" fill="#3d2b1f">add</text><text x="278" y="160" font-size="14" text-anchor="middle" fill="#6b5545">a = 2，b = 3</text><line x1="354" y1="145" x2="392" y2="145" stroke="#b5651d" stroke-width="2.5"/><polygon points="392,145 382,140 382,150" fill="#b5651d"/><rect x="396" y="110" width="190" height="70" rx="10" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="491" y="138" font-size="16" text-anchor="middle" fill="#3d2b1f">函数体 a + b</text><text x="491" y="160" font-size="14" text-anchor="middle" fill="#6b5545">算出 5</text><line x1="491" y1="180" x2="491" y2="216" stroke="#b5651d" stroke-width="2.5"/><polygon points="491,216 486,208 496,208" fill="#b5651d"/><rect x="396" y="220" width="190" height="44" rx="8" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="491" y="248" font-size="15" text-anchor="middle" fill="#3d2b1f">返回值 5</text><line x1="396" y1="242" x2="262" y2="242" stroke="#b5651d" stroke-width="2.5"/><polygon points="262,242 272,237 272,247" fill="#b5651d"/><rect x="58" y="220" width="200" height="44" rx="8" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="158" y="248" font-size="15" text-anchor="middle" fill="#3d2b1f">total 接到 5</text></svg>`, caption: "参数从调用处进去，函数体算完，结果沿箭头交回调用处。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "参数漏写类型。Rust 要求函数签名里每个参数都有明确类型。",
            "返回值那一行多写分号。加了分号就变成语句，函数返回空，类型不匹配。",
            "声明了返回类型却没有返回值。每条能走到的路径都要交出同类型的值。",
            "函数名和变量名混着用。函数是一个值，调用要加括号，不调用只是提到它。",
            "主函数写得太长。超过一屏就该拆，一个函数只做一件事。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "写 add 函数，在 main 里调用两次，分别传入不同的数并打印结果。",
            "写一个 square 函数，接收 i32 返回它的平方，用最后一个表达式返回，不加 return。",
            "故意在返回值那行加上分号，抄下编译器报错，说明为什么会这样。"
          ]},
          { t: "tip", color: "green", text: "一句话：fn 起名、参数带类型、箭头写返回；最后一个不带分号的表达式就是返回值。" }
        ]
      },
      {
        id: "r12",
        title: "第 12 课 · 数组与 Vec",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：分清定长数组和可变长 Vec，会创建、读取、追加，知道下标越界会怎样。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "数组一旦创建，长度固定，类型写成 [i32; 3]，分号前是元素类型，分号后是长度。数组的数据直接放在栈上，适合长度已知且不变的小集合。" },
          { t: "p", text: "Vec 是可变长序列，类型写作 Vec<i32>，用 vec! 宏或 Vec::new 创建。它把数据放在堆上，长度可以增长，日常存一组会变的数据几乎都用它。" },
          { t: "p", text: "读取元素用下标，从 0 开始。用方括号访问越界会 panic，程序当场退出。入门阶段先把下标控制在合法范围内，别让越界发生。" },
          { t: "p", text: "追加用 push，需要 Vec 本身可变，所以变量要加 mut。len 返回当前元素个数，下标合法范围是 0 到 len - 1。数组和 Vec 都能用下标读，区别在长度能不能变。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "数组存一周七天的固定数据。",
            "Vec 存随时会追加的分数、名字、订单。",
            "按下标取出某一项，或者从 0 走到末尾逐个处理。",
            "先收集一批数据，再统一打印或计算。"
          ]},
          { t: "h2", text: "演示：数组与 Vec" },
          { t: "p", text: "先看数组。创建时写明长度，后面用下标读，越界的下标会让程序 panic。" },
          { t: "code", lang: "rust", code: `fn main() {
    let scores = [90, 85, 77];
    println!("{}", scores[0]);
    println!("{}", scores.len());
}` },
          { t: "p", text: "scores[0] 是第一个元素 90，len 是 3。数组的长度是类型的一部分，[i32; 3] 和 [i32; 4] 不是同一个类型。" },
          { t: "p", text: "Vec 要先声明 mut，才能 push。下面创建空 Vec，追加三个数，再按下标读。" },
          { t: "code", lang: "rust", code: `fn main() {
    let mut nums: Vec<i32> = Vec::new();
    nums.push(10);
    nums.push(20);
    nums.push(30);
    println!("{}", nums[2]);
    println!("{}", nums.len());
}` },
          { t: "p", text: "nums[2] 是 30，len 是 3。第三个 push 之后长度才变成 3，push 之前访问下标 2 会 panic。用 vec![10, 20, 30] 可以一行创建带初值的 Vec。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="20" y="20" width="600" height="260" rx="14" fill="#f7f2ec"/><text x="320" y="54" font-size="20" font-weight="700" text-anchor="middle" fill="#3d2b1f">数组定长，Vec 可以变长</text><text x="50" y="94" font-size="15" font-weight="700" fill="#3d2b1f">数组：长度固定</text><rect x="50" y="104" width="66" height="46" rx="6" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="83" y="133" font-size="15" text-anchor="middle" fill="#3d2b1f">90</text><rect x="120" y="104" width="66" height="46" rx="6" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="153" y="133" font-size="15" text-anchor="middle" fill="#3d2b1f">85</text><rect x="190" y="104" width="66" height="46" rx="6" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="223" y="133" font-size="15" text-anchor="middle" fill="#3d2b1f">77</text><text x="286" y="133" font-size="14" fill="#6b5545">创建后不能再追加</text><text x="50" y="192" font-size="15" font-weight="700" fill="#3d2b1f">Vec：长度可变</text><rect x="50" y="202" width="66" height="46" rx="6" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="83" y="231" font-size="15" text-anchor="middle" fill="#3d2b1f">10</text><rect x="120" y="202" width="66" height="46" rx="6" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="153" y="231" font-size="15" text-anchor="middle" fill="#3d2b1f">20</text><rect x="190" y="202" width="66" height="46" rx="6" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="223" y="231" font-size="15" text-anchor="middle" fill="#3d2b1f">30</text><line x1="260" y1="225" x2="294" y2="225" stroke="#b5651d" stroke-width="2.5"/><polygon points="294,225 284,220 284,230" fill="#b5651d"/><text x="278" y="214" font-size="14" text-anchor="middle" fill="#6b5545">push</text><rect x="298" y="202" width="66" height="46" rx="6" fill="#ffffff" stroke="#b5651d" stroke-width="2"/><text x="331" y="231" font-size="15" text-anchor="middle" fill="#3d2b1f">40</text><text x="392" y="231" font-size="14" fill="#6b5545">len 从 3 变成 4</text><text x="320" y="278" font-size="14" text-anchor="middle" fill="#6b5545">下标从 0 开始，合法范围是 0 到 len - 1</text></svg>`, caption: "数组的长度写在类型里；Vec 用 push 追加，长度随之增长。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "访问下标等于长度。长度 3 的集合合法下标只有 0、1、2。",
            "忘了给 Vec 变量加 mut 就 push。push 会改长度，必须可变。",
            "以为数组可以追加。数组定长，要变长就用 Vec。",
            "把数组和 Vec 的类型写混。[i32; 3] 和 Vec<i32> 不能互相赋值。",
            "在空 Vec 上直接按下标读。先 push 或先判断长度，再访问。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "创建一个长度 4 的数组，打印第一个和最后一个元素。",
            "创建 Vec，push 五个整数，打印长度和下标 2 的值。",
            "故意访问下标等于长度的位置，运行看 panic 信息，再把下标改回合法范围。"
          ]},
          { t: "tip", color: "green", text: "一句话：数组定长、Vec 可长；下标从 0 开始，push 之前要给 Vec 加 mut。" }
        ]
      }
    ]
  }
};
