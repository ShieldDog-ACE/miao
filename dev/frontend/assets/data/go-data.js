/* 喵站 · Go 入门（2026-10-27 补全分类教程；单文件形态，与 git-data.js 同构）
 * 12 课写到入门结束：历史 / 装工具 / 第一个程序 / 变量 / 类型 / 运算符 / if / else / for / range / 函数 / 切片。
 * 本机有 Go 工具链，正文代码块都按 go1.21+ 写法自查过；不写依赖机器路径的输出。 */
window.MIAO_GO = {
  tutorial: {
    id: "go",
    title: "Go 入门",
    intro: "从 Google 的并发需求讲到切片：12 课把 Go 的基础语法走完，每课都有能照敲的程序和一张机制图。",
    cat: "Go",
    diff: "入门",
    tags: ["Go", "Golang", "入门", "编程"],
    author: "喵站官方",
    cover: "/assets/img/covers/go.svg",
    updated: "2026-10-27",
    chapters: [
      {
        id: "go01",
        title: "第 1 课 · Go 的历史：Google 的并发语言",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：知道 Go 为什么被造出来、它想解决哪几个老问题，以及今天它在哪些地方出现。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "2007 年，Google 的三位工程师 Robert Griesemer、Rob Pike 和 Ken Thompson 开始设计一门新语言。他们在 Google 内部遇到的麻烦很具体：C++ 代码库太大，编译一次要等很久；服务器要同时接成千上万个连接，用线程写既重又容易出错；语言特性越加越多，新人上手成本越来越高。" },
          { t: "p", text: "他们的目标不是造一门「什么都能干」的语言，而是造一门**编译快、部署简单、天生适合并发**的语言。2009 年 Go 对外开源，2012 年发布 1.0。Go 砍掉了类、继承、异常、泛型（后来才加回来）这些容易把语言变复杂的东西，留下的是一套很小、很稳定的语法。" },
          { t: "p", text: "Go 的并发模型叫 goroutine：启动一个并发任务只需要一个 go 关键字，运行时帮你把成千上万个 goroutine 调度到少量系统线程上。再加上 channel 做通信，写并发程序不再需要先学一整套线程池和锁的用法。这是 Go 最核心的设计选择，也是它在云原生时代流行的原因。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "写网络服务：HTTP 接口、API 网关、消息队列的消费者，Go 的标准库直接就能起服务。",
            "写命令行工具：编译成一个不依赖运行时环境的可执行文件，拷到服务器上就能跑。",
            "写云基础设施：Docker、Kubernetes、Prometheus、Terraform 这些项目都用 Go 写成。",
            "写并发任务：爬虫、日志处理、批量任务，goroutine 让「同时做很多件事」变得便宜。"
          ]},
          { t: "h2", text: "演示：一段 Go 程序长什么样" },
          { t: "p", text: "先不急着装环境，只看形状。Go 程序从 package 声明开始，入口函数固定叫 main，输出用 fmt 包里的 Println。下面这段现在看不懂每个词没关系，后面单独一课会逐段拆开。" },
          { t: "code", lang: "go", code: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"你好，Go\")\n}" },
          { t: "p", text: "注意三个外形特征：大括号必须跟在行尾，不能另起一行；没有分号；缩进不靠花括号决定作用域，但 gofmt 会统一成制表符。这些规则看着琐碎，实际是在减少团队里「格式该怎么写」的争论。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">Go 的三个时间点</text><rect x=\"78\" y=\"108\" width=\"120\" height=\"58\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"138\" y=\"132\" font-size=\"16\" text-anchor=\"middle\" fill=\"#173d36\">2007</text><text x=\"138\" y=\"154\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">开始设计</text><rect x=\"260\" y=\"108\" width=\"120\" height=\"58\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"320\" y=\"132\" font-size=\"16\" text-anchor=\"middle\" fill=\"#173d36\">2009</text><text x=\"320\" y=\"154\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">对外开源</text><rect x=\"442\" y=\"108\" width=\"120\" height=\"58\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"502\" y=\"132\" font-size=\"16\" text-anchor=\"middle\" fill=\"#173d36\">2012</text><text x=\"502\" y=\"154\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">发布 1.0</text><path d=\"M198 137H252\" stroke=\"#2a8c78\" stroke-width=\"3\"/><path d=\"M380 137H434\" stroke=\"#2a8c78\" stroke-width=\"3\"/><path d=\"M320 92V104\" stroke=\"#2a8c78\" stroke-width=\"3\"/></svg>", caption: "Go 从内部实验到 1.0 用了五年，之后语法一直保持很小的改动。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把 Go 当成「Google 版的 Python」。它是编译型语言，类型检查在编译期完成，不是解释执行。",
            "以为学 Go 要先学 C。Go 的语法确实像 C，但没有指针算术、没有类继承，心智负担小很多。",
            "听说 Go 并发强，就一上来写 goroutine。并发是后面的主题，先把变量、分支、循环、函数走稳。",
            "把 Go 和 Golang 当成两个东西。Golang 只是 go language 的搜索叫法，正式名字就是 Go。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用一句话写下 Go 被设计出来时想解决的三个问题，不看书复述。",
            "列出你日常用过的三个可能用 Go 写的软件，并说明它们属于网络服务、命令行工具还是基础设施。",
            "观察上面那段程序，指出 package、import、func 三个关键字各出现在哪一行。"
          ]},
          { t: "tip", color: "green", text: "一句话：Go 是为「编译快、部署简单、并发便宜」做的语言，语法小是它的设计目标，不是缺点。" }
        ]
      },
      {
        id: "go02",
        title: "第 2 课 · 装 Go 和 VS Code",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：在终端里装好 Go 和 VS Code，最后用 go version 看到版本号。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "Go 的安装包自带编译器、标准库、格式化工具和模块工具。你不需要单独装一个编译器再配一遍环境变量，装完 Go 之后 go 这个命令就是总入口：go run 编译并运行，go build 只编译，go test 跑测试，go fmt 格式化代码。" },
          { t: "p", text: "编辑器负责写代码，Go 工具链负责把代码变成可执行文件。两者分开装：VS Code 是界面，Go 是后台的命令行工具。VS Code 装上 Go 扩展之后，会调用你本机的 go 命令做补全、格式化和报错提示，所以顺序是先装 Go，再装编辑器扩展。" },
          { t: "p", text: "安装路径要进 PATH。PATH 是操作系统找命令的目录清单，go 命令只有落在清单里的目录，终端才认得。Linux 用 apt 这类系统工具装通常会自动处理；用官方压缩包解压就要自己把 /usr/local/go/bin 加进去。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "装好之后你能在任意目录建一个 .go 文件，用 go run 直接跑；也能用 go build 生成一个可执行文件，拷到同架构的机器上直接运行。后面每节课的演示都假设这两个命令可用。" },
          { t: "h2", text: "演示：Ubuntu / Debian 上装 Go 和 VS Code" },
          { t: "p", text: "下面这一组命令按顺序敲。第一条更新软件源，第二条装 Go，第三条装 VS Code，最后两条验证。不同发行版的包名可能不同，命令后面会说明其他平台。" },
          { t: "code", lang: "bash", code: "sudo apt update\nsudo apt install -y golang-go\nsudo snap install code --classic\ngo version\ngo env GOPATH" },
          { t: "p", text: "go version 输出形如 go version go1.21.0 linux/amd64，看到这一行就说明编译器就绪。go env GOPATH 输出一个目录，那是 Go 存放下载的依赖和编译缓存的地方，不用手动创建。" },
          { t: "code", lang: "bash", code: "# 想用官方最新版时，用压缩包安装（版本号按官网当前版本替换）\nwget https://go.dev/dl/go1.23.4.linux-amd64.tar.gz\nsudo rm -rf /usr/local/go\nsudo tar -C /usr/local -xzf go1.23.4.linux-amd64.tar.gz\n# 把 Go 的 bin 目录加进 PATH，再让当前终端重新读配置\necho 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc\nsource ~/.bashrc\ngo version" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">安装链：包 → 命令 → 验证</text><rect x=\"64\" y=\"108\" width=\"130\" height=\"56\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"129\" y=\"132\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">安装包</text><text x=\"129\" y=\"152\" font-size=\"13\" text-anchor=\"middle\" fill=\"#4d6f67\">golang-go / tar.gz</text><path d=\"M198 136H246\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"246,136 236,130 236,142\" fill=\"#2a8c78\"/><rect x=\"254\" y=\"108\" width=\"130\" height=\"56\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"319\" y=\"132\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">go 命令</text><text x=\"319\" y=\"152\" font-size=\"13\" text-anchor=\"middle\" fill=\"#4d6f67\">进入 PATH</text><path d=\"M388 136H436\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"436,136 426,130 426,142\" fill=\"#2a8c78\"/><rect x=\"444\" y=\"108\" width=\"132\" height=\"56\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"510\" y=\"132\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">go version</text><text x=\"510\" y=\"152\" font-size=\"13\" text-anchor=\"middle\" fill=\"#4d6f67\">看到版本号</text></svg>", caption: "安装的判据不是「装完了」，而是终端能执行 go version。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "装完立刻敲 go 提示 command not found。多数是 PATH 没刷新，关掉终端重开，或手动 source 一次配置。",
            "同时装了系统仓库版和官方压缩包版，终端里跑的不是你以为的那一个。用 which go 看实际路径。",
            "把 GOPATH 当成项目目录。现在的 Go 用模块（go mod）记录依赖，GOPATH 主要是缓存和下载目录。",
            "以为 VS Code 装上就自带 Go。编辑器只是壳，Go 扩展要调用本机 go 命令，所以先装 Go。",
            "用 root 身份在项目目录里跑 go build。生成的缓存和文件会归 root，后面普通用户改不动。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "按演示装好 Go 和 VS Code，把 go version 的输出抄下来。",
            "用 which go 和 go env GOPATH 分别确认命令位置与缓存目录，两个路径为什么不是同一个？",
            "在 VS Code 里装 Go 扩展，新建一个 .go 文件，看编辑器有没有在你保存时自动格式化。"
          ]},
          { t: "tip", color: "green", text: "一句话：Go 装完是一个命令行工具，编辑器只是调用它的界面；验证标准是 go version 能出数字。" }
        ]
      },
      {
        id: "go03",
        title: "第 3 课 · 第一个程序：fmt.Println",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：从零写一个 .go 文件，用 go run 跑出第一行输出，并知道每一段代码在干什么。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "Go 程序的执行入口只有一个：main 包里的 main 函数。package main 这句话告诉编译器「这是一个可以生成可执行文件的程序」，而不是一个给别人引用的库。func main() 是操作系统启动这个程序后第一个被调用的函数。" },
          { t: "p", text: "fmt 是 Go 标准库里的格式化输入输出包。import \"fmt\" 把包装进来，之后就能用 fmt.Println 往标准输出写一行字，并在末尾自动补一个换行。Println 的 ln 就是 line，意思是这一行写完就换行。" },
          { t: "p", text: "go run 做的是「编译 + 运行」两步：它先在临时目录里把源码编译成可执行文件，再立刻执行，最后由你把结果看走。真正要交付给别人时用 go build，它只生成可执行文件，不运行。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "会写这一行，你就能验证环境、验证语法、验证一段逻辑有没有走到。后面所有演示都从 Println 开始，它是你观察程序内部状态的最小窗口。" },
          { t: "h2", text: "演示 1 · 写文件并运行" },
          { t: "p", text: "新建一个目录，在里面建 hello.go，内容如下。文件名可以换，但扩展名必须是 .go，而且同一个目录里只能有一个 main 函数。" },
          { t: "code", lang: "go", code: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"你好，Go\")\n}" },
          { t: "code", lang: "bash", code: "mkdir hello-go\ncd hello-go\n# 把上面的内容存成 hello.go\ngo run hello.go" },
          { t: "p", text: "终端会打印「你好，Go」。注意 go run 后面跟的是文件名，不是包名；同一目录里有多个 .go 文件时，可以写 go run . 让工具链把整个包编进去。" },
          { t: "h2", text: "演示 2 · 编译成可执行文件" },
          { t: "code", lang: "bash", code: "go build hello.go\n./hello\n# 也可以指定输出名\ngo build -o greet hello.go\n./greet" },
          { t: "p", text: "go build 生成的二进制文件可以直接运行，不依赖 Go 安装环境；这就是 Go 部署简单的原因。文件大小通常在几 MB，因为标准库的一部分被静态链接进去了。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">go run 的两步</text><rect x=\"64\" y=\"104\" width=\"140\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"134\" y=\"130\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">hello.go</text><text x=\"134\" y=\"150\" font-size=\"13\" text-anchor=\"middle\" fill=\"#4d6f67\">源码</text><path d=\"M208 136H264\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"264,136 254,130 254,142\" fill=\"#2a8c78\"/><rect x=\"272\" y=\"104\" width=\"140\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"342\" y=\"130\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">编译器</text><text x=\"342\" y=\"150\" font-size=\"13\" text-anchor=\"middle\" fill=\"#4d6f67\">go run 临时目录</text><path d=\"M416 136H472\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"472,136 462,130 462,142\" fill=\"#2a8c78\"/><rect x=\"480\" y=\"104\" width=\"96\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"528\" y=\"130\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">终端</text><text x=\"528\" y=\"150\" font-size=\"13\" text-anchor=\"middle\" fill=\"#4d6f67\">一行输出</text></svg>", caption: "go run 不是解释执行，它每次都在背后编译，只是编译产物放在临时目录。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "忘了 package main。没有它，编译器不会把这个文件当成可执行程序。",
            "导入了 fmt 却没用到。Go 把未使用的导入当编译错误，删掉或补上使用即可。",
            "把大括号写到下一行。Go 的分号自动插入规则会让编译器在上一行结尾补分号，结果报语法错误。",
            "文件保存成 hello.txt 或 hello。go 工具只认 .go 扩展名。",
            "在同一个目录里写两个 main 函数。一个包只能有一个 main，练习时一个目录一个程序。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "照演示跑通 hello.go，再把输出改成你的名字。",
            "用 go build 生成可执行文件，删掉源码只留二进制，确认它还能跑。",
            "故意删掉 import \"fmt\" 里的 fmt 使用处，看编译器报什么错，把报错原文抄下来。"
          ]},
          { t: "tip", color: "green", text: "一句话：Go 程序从 main 包里的 main 函数开始，go run 负责编译加运行，go build 只负责生成可执行文件。" }
        ]
      },
      {
        id: "go04",
        title: "第 4 课 · 变量与短声明",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：学会用 var 和 := 创建变量，知道两者的区别，以及变量没赋值时是什么。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "变量是贴在内存上的一张标签。声明一个变量，就是让编译器给你留一块能装某种类型值的地方，并给这块地方起一个名字。Go 是静态类型语言：变量一旦声明成某个类型，后面只能装这个类型的值，换类型要显式转换。" },
          { t: "p", text: "Go 有两种常见声明方式。var 是完整写法：var age int = 18，类型和值都写清楚；在函数内部可以简写成 age := 18，编译器根据右边的值推断类型。:= 只在函数内部可用，包级别只能用 var。" },
          { t: "p", text: "变量声明了但没赋值，Go 不会留一个随机值，而是给零值：int 是 0，string 是空字符串，bool 是 false。这个设计让「没初始化的变量」不会变成不可预测的垃圾数据，但也容易让空字符串看起来像「用户真的输入了空」。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "保存用户输入、计算结果、循环计数这类会变的值。",
            "给一段数据起一个能读懂的名字，让后面的代码不用重复写一长串表达式。",
            "用零值先占位，等程序运行到某一步再填真正的值。"
          ]},
          { t: "h2", text: "演示 1 · 三种声明" },
          { t: "code", lang: "go", code: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    var name string = \"小北\"\n    var age int = 18\n    city := \"杭州\"\n    var score int\n\n    fmt.Println(name, age, city, score)\n}" },
          { t: "p", text: "前三行分别用了完整声明、完整声明、短声明。第四行只声明不赋值，score 自动是 0。Println 用空格把多个值隔开，所以输出是「小北 18 杭州 0」。" },
          { t: "h2", text: "演示 2 · 先声明再改值" },
          { t: "code", lang: "go", code: "count := 1\nfmt.Println(count)\ncount = count + 1\nfmt.Println(count)\n\nname := \"小北\"\nname = \"阿岚\"\nfmt.Println(name)" },
          { t: "p", text: "第一次给变量值用 :=，之后改值用 =。:= 是「声明并赋值」，= 是「给已经存在的变量换一个值」。把 := 用在已经声明过的变量上，编译器会报 no new variables on left side of :=。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">变量是一张标签</text><rect x=\"92\" y=\"106\" width=\"180\" height=\"62\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"182\" y=\"132\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">age</text><text x=\"182\" y=\"153\" font-size=\"13\" text-anchor=\"middle\" fill=\"#4d6f67\">int 类型的盒子</text><path d=\"M276 137H348\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"348,137 338,131 338,143\" fill=\"#2a8c78\"/><rect x=\"356\" y=\"106\" width=\"180\" height=\"62\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"446\" y=\"132\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">18</text><text x=\"446\" y=\"153\" font-size=\"13\" text-anchor=\"middle\" fill=\"#4d6f67\">盒子里装的值</text><text x=\"182\" y=\"196\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">名字不变</text><text x=\"446\" y=\"196\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">值可以换</text></svg>", caption: "声明给盒子起名，赋值换盒子里装的东西；:= 两件事一起做。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "声明了变量却没用。Go 把未使用变量当编译错误，练习时删掉不用的那行。",
            "在包级别用 :=。短声明只能在函数内部使用，顶层要写 var。",
            "以为 var score int 是「没有值」。它有零值 0，和「未声明」是两回事。",
            "重复用 := 给同一个变量赋值。第二次应该用 =，否则编译报错。",
            "用中文或拼音当变量名。语法允许部分 Unicode，但团队协作和工具链都更认英文短名。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "声明三个变量分别存你的名字、年龄、所在城市，用一行 Println 打印出来。",
            "先声明一个 int 变量不赋值，打印它；再给它赋一个新值，打印第二次，对比两次输出。",
            "故意对同一个变量连写两次 :=，抄下编译器报错，再用 = 改对。"
          ]},
          { t: "tip", color: "green", text: "一句话：变量是带类型的标签，:= 负责第一次声明并赋值，= 负责之后换值，没赋值时拿到的是零值。" }
        ]
      },
      {
        id: "go05",
        title: "第 5 课 · 类型",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：认识 int、float64、string、bool 四种最常用的类型，知道它们各自能装什么、不能装什么。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "类型决定两件事：这块内存能装多大的数、能进行哪些操作。Go 的基本类型不多，入门先记四种：int 装整数，float64 装小数，string 装文本，bool 装真或假。写程序时先把值的类型想清楚，后面的运算和函数签名就不会乱。" },
          { t: "p", text: "Go 不做隐式类型转换。你把 int 和 float64 放在一起算，编译器直接报错，不会偷偷帮你转。要混算必须显式转换，例如 float64(count)。这个规则刚开始会让人觉得麻烦，但它避免了「小数被悄悄截断」这类难查的 bug。" },
          { t: "p", text: "string 在 Go 里是不可变的字节序列。你可以用 len 取字节数，用 s[i] 取第 i 个字节，但中文一个字通常占三个字节，按字节取容易把字切开。入门阶段先记住：字符串用双引号，拼接用加号，取长度用 len。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "int 存计数、年龄、编号这类不带小数的量。",
            "float64 存价格、比例、测量值这类需要小数的量。",
            "string 存名字、句子、文件路径。",
            "bool 存开关状态、判断结果，if 的条件必须是 bool。"
          ]},
          { t: "h2", text: "演示 1 · 四种类型各声明一个" },
          { t: "code", lang: "go", code: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    var age int = 18\n    var price float64 = 9.9\n    var name string = \"小北\"\n    var ok bool = true\n\n    fmt.Println(age, price, name, ok)\n}" },
          { t: "p", text: "这四个变量各自装一种类型。Println 会把它们转成能读的文本再输出，所以终端上看不出类型差别；但编译器知道它们的类型，后面拿 price 去和 age 相加就会当场报错。" },
          { t: "h2", text: "演示 2 · 显式转换" },
          { t: "code", lang: "go", code: "count := 3\nratio := 0.5\ntotal := float64(count) * ratio\nfmt.Println(total)\n\nwhole := int(9.9)\nfmt.Println(whole)" },
          { t: "p", text: "float64(count) 把整数转成浮点数，再和 ratio 相乘。int(9.9) 把小数转成整数，小数部分直接丢掉，不是四舍五入。转换不会改变原变量，只是生成一个新值。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">四种基础类型</text><rect x=\"66\" y=\"104\" width=\"116\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"124\" y=\"130\" font-size=\"16\" text-anchor=\"middle\" fill=\"#173d36\">int</text><text x=\"124\" y=\"151\" font-size=\"13\" text-anchor=\"middle\" fill=\"#4d6f67\">18</text><rect x=\"200\" y=\"104\" width=\"116\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"258\" y=\"130\" font-size=\"16\" text-anchor=\"middle\" fill=\"#173d36\">float64</text><text x=\"258\" y=\"151\" font-size=\"13\" text-anchor=\"middle\" fill=\"#4d6f67\">9.9</text><rect x=\"334\" y=\"104\" width=\"116\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"392\" y=\"130\" font-size=\"16\" text-anchor=\"middle\" fill=\"#173d36\">string</text><text x=\"392\" y=\"151\" font-size=\"13\" text-anchor=\"middle\" fill=\"#4d6f67\">\"小北\"</text><rect x=\"468\" y=\"104\" width=\"116\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"526\" y=\"130\" font-size=\"16\" text-anchor=\"middle\" fill=\"#173d36\">bool</text><text x=\"526\" y=\"151\" font-size=\"13\" text-anchor=\"middle\" fill=\"#4d6f67\">true / false</text></svg>", caption: "类型不是注释，它决定编译器允许你对这个值做什么。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把 int 和 float64 直接相加。Go 要求先显式转换，否则编译不过。",
            "以为 int 永远是 32 位。int 的宽度跟平台有关，要固定宽度就写 int64。",
            "用 int(9.9) 做四舍五入。它只截断小数，9.9 会变成 9。",
            "用 len 量中文长度。len 返回字节数，一个常用汉字通常占 3 个字节。",
            "把字符串当成可变数组去改某一个字符。Go 的字符串不可变，要改先转成 []rune 或重新拼接。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "声明四个变量分别装整数、小数、字符串、布尔值，用 Println 一次打印。",
            "把 int 和 float64 相加，观察编译器报错；再用显式转换改到能编译。",
            "用 len 量一个中文字符串和一个英文字符串，比较结果和你预期的字数是差多少。"
          ]},
          { t: "tip", color: "green", text: "一句话：类型决定能装什么、能算什么；Go 不做隐式转换，混算要自己写转换。" }
        ]
      },
      {
        id: "go06",
        title: "第 6 课 · 运算符",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：掌握算术、比较、逻辑三类运算符，知道整数除法和取余的结果怎么算。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "运算符是语言里最小的计算单位。算术运算符有加、减、乘、除、取余：+ - * / %。两个整数相除，结果还是整数，小数部分直接丢掉；想得到小数结果，至少把其中一个操作数转成 float64。% 取的是余数，10 % 3 等于 1。" },
          { t: "p", text: "比较运算符 == != > < >= <= 的结果一定是 bool。注意等于号是两个等号，一个等号是赋值。比较两边的类型要能比，拿 string 和 int 比会编译报错。浮点数比较要小心，0.1 + 0.2 不一定正好等于 0.3。" },
          { t: "p", text: "逻辑运算符 && || ! 用来组合条件。&& 是「两边都真才真」，|| 是「有一边真就真」，! 把真假取反。它们有短路行为：&& 左边为假时右边不再算，|| 左边为真时右边不再算。这个行为后面写条件判断时会用到。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "算总价、平均分、余数、折扣。",
            "把两个值放在一起比大小，决定走哪条分支。",
            "把多个条件组合起来，例如「年龄够且已登录」。",
            "用 +=、-= 这类复合赋值少写一遍变量名。"
          ]},
          { t: "h2", text: "演示 1 · 算术与取余" },
          { t: "code", lang: "go", code: "a := 10\nb := 3\nfmt.Println(a + b)\nfmt.Println(a - b)\nfmt.Println(a * b)\nfmt.Println(a / b)\nfmt.Println(a % b)" },
          { t: "p", text: "前三个分别是 13、7、30。a / b 因为两边都是整数，结果是 3 而不是 3.333；a % b 是 1。想得到小数结果，写成 float64(a) / float64(b)。" },
          { t: "h2", text: "演示 2 · 比较与逻辑" },
          { t: "code", lang: "go", code: "age := 20\nhasTicket := true\n\nfmt.Println(age >= 18)\nfmt.Println(age >= 18 && hasTicket)\nfmt.Println(age < 18 || hasTicket)\nfmt.Println(!hasTicket)" },
          { t: "p", text: "四个输出依次是 true、true、true、false。&& 要求两边都真；|| 只要有一边真就真；! 把 true 翻成 false。组合条件时先把每个小条件用括号或变量写清楚，别堆一长串。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">表达式是一棵树</text><rect x=\"256\" y=\"96\" width=\"128\" height=\"44\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"320\" y=\"123\" font-size=\"17\" text-anchor=\"middle\" fill=\"#173d36\">+</text><rect x=\"120\" y=\"164\" width=\"128\" height=\"42\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"184\" y=\"190\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">3</text><rect x=\"392\" y=\"164\" width=\"128\" height=\"42\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"456\" y=\"190\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">4 * 2</text><path d=\"M300 140L198 160\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><path d=\"M340 140L442 160\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/></svg>", caption: "先算括号里、再算乘除、最后算加减；不确定就加括号。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "整数除法当成小数除法。5 / 2 得 2，不是 2.5。",
            "把 = 当成比较。条件里写 if x = 1 是赋值，不是判断相等。",
            "除以零。整数除零会直接 panic，运行中的程序当场退出。",
            "用 == 比较两个浮点数。二进制小数有误差，应该比较差值是否小于一个很小的数。",
            "逻辑表达式太长不加括号。&& 和 || 有优先级，混用时加括号最稳。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用两个整数变量分别算加减乘除和取余，把五个结果打印出来。",
            "把其中一个操作数转成 float64，再做除法，比较结果和整数除法差多少。",
            "写一个条件：年龄大于等于 18 且持有票，打印这个条件的结果，再分别改两个变量看结果怎么变。"
          ]},
          { t: "tip", color: "green", text: "一句话：算术管数值、比较出真假、逻辑组合条件；整数相除会丢小数，混算先转换。" }
        ]
      },
      {
        id: "go07",
        title: "第 7 课 · if 条件",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：会写 if 让程序按条件走，知道 Go 的条件不需要括号、但大括号不能省。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "if 的作用是「条件为真才执行这一段」。Go 的 if 后面直接跟条件表达式，不写圆括号；条件必须是 bool，不能拿数字当真假。大括号必须写，而且左大括号要和 if 在同一行，这是 Go 的语法规则。" },
          { t: "p", text: "if 还可以带一个初始化语句：if score := 80; score >= 60 { ... }。分号前面声明变量，分号后面写条件。这个变量只在 if 的整个语句块里可见，出了大括号就没了。用它可以把「先算再判断」的两步压成一行，也避免变量泄漏到后面的代码。" },
          { t: "p", text: "条件为假时，整个大括号里的代码跳过，程序接着执行 if 后面的下一行。注意「跳过」不是「报错」，也不是「返回」，程序继续往下走。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "分数够不够及格，够就打印「通过」。",
            "用户有没有登录，登录了才显示个人资料。",
            "库存够不够，够才允许下单。",
            "先算出一个中间值，再根据它决定走哪条路。"
          ]},
          { t: "h2", text: "演示 1 · 最基本的 if" },
          { t: "code", lang: "go", code: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    score := 72\n    if score >= 60 {\n        fmt.Println(\"及格\")\n    }\n    fmt.Println(\"检查结束\")\n}" },
          { t: "p", text: "score 是 72，条件成立，所以打印「及格」，然后打印「检查结束」。把 score 改成 50，第一行不会打印，但「检查结束」仍然会打印，因为它在 if 外面。" },
          { t: "h2", text: "演示 2 · if 带初始化语句" },
          { t: "code", lang: "go", code: "if score := 80; score >= 60 {\n    fmt.Println(\"及格\")\n    fmt.Println(score)\n}\n// 这里再写 score 会报未定义" },
          { t: "p", text: "score 只在 if 语句内部存在。这样写的好处是变量的作用域被压到最小，读代码的人一眼就知道它只服务于这个判断。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">if 只决定「走不走这一段」</text><polygon points=\"320,98 400,136 320,174 240,136\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><text x=\"320\" y=\"142\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">score &gt;= 60 ?</text><path d=\"M400 136H476\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"476,136 466,130 466,142\" fill=\"#2a8c78\"/><text x=\"438\" y=\"124\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">是</text><rect x=\"484\" y=\"112\" width=\"84\" height=\"48\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"526\" y=\"142\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">打印</text><path d=\"M320 174V204H96\" stroke=\"#7fa99f\" stroke-width=\"2.5\"/><text x=\"252\" y=\"196\" font-size=\"14\" text-anchor=\"middle\" fill=\"#4d6f67\">否 / 走完</text></svg>", caption: "条件为真进右边那一段，为假就绕过它继续往下。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "给条件加圆括号。Go 语法上允许写，但 gofmt 会去掉，别养成习惯。",
            "把左大括号写到下一行。Go 会在上一行补分号，编译器直接报错。",
            "用 if 1 这种写法。条件必须是 bool，数字不能直接当真假。",
            "在 if 里面声明变量，出来还想用。它只活在大括号里。",
            "if 条件写得太长。先把条件算成 bool 变量再判断，读起来更清楚。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "写一个 if，分数大于等于 60 时打印「及格」，分别用 72 和 50 各跑一次。",
            "把变量声明放进 if 的初始化语句，打印它；再试着在大括号外面打印，抄下报错。",
            "故意把左大括号换到下一行，看编译器报什么，再改回来。"
          ]},
          { t: "tip", color: "green", text: "一句话：if 是「条件真才走这一段」，条件不用括号但必须是大括号包着的 bool。" }
        ]
      },
      {
        id: "go08",
        title: "第 8 课 · else 与分支",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：用 else 和 else if 补上「条件不成立时走哪」，写出两三条分支。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "if 只处理「条件为真」的情况。要处理「否则」，就在 if 的大括号后面接 else。else 不能单独出现，它必须紧跟在一个 if 的右大括号后面，而且 else 要写在同一行，不能另起一行。" },
          { t: "p", text: "多条分支用 else if：从上往下依次判断，哪一条先为真就执行哪一条，后面的全部跳过。所以顺序很重要：先写更严格的条件，再写更宽松的条件。如果把 score >= 60 写在 score >= 90 前面，90 分的人会先被 60 分那条拦下，永远走不到优秀分支。" },
          { t: "p", text: "else 不是「出错处理」，它只是「另一个分支」。真正的错误处理通常用返回 error 的方式，那是后面函数课的内容。这一课只把条件分支的形状弄清楚。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "成绩分及格和不及格两档。",
            "成绩分优秀、及格、不及格三档。",
            "登录状态分已登录和未登录，显示不同页面。",
            "把「否则就做另一件事」写完整，避免程序走到没有处理的分支。"
          ]},
          { t: "h2", text: "演示 1 · if / else" },
          { t: "code", lang: "go", code: "score := 50\nif score >= 60 {\n    fmt.Println(\"及格\")\n} else {\n    fmt.Println(\"不及格\")\n}" },
          { t: "p", text: "score 是 50，条件不成立，程序跳到 else 里打印「不及格」。两段代码只会执行一段，不会两段都跑。" },
          { t: "h2", text: "演示 2 · 三档分支" },
          { t: "code", lang: "go", code: "score := 85\nif score >= 90 {\n    fmt.Println(\"优秀\")\n} else if score >= 60 {\n    fmt.Println(\"及格\")\n} else {\n    fmt.Println(\"不及格\")\n}" },
          { t: "p", text: "85 先和 90 比，不成立；再和 60 比，成立，打印「及格」，后面的 else 不再看。把顺序倒过来，85 会先命中 60 那条，结果一样；但 95 如果先命中 60，就会从「优秀」变成「及格」，所以严格条件要放前面。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">从上往下，命中一条就停</text><rect x=\"56\" y=\"100\" width=\"128\" height=\"46\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"120\" y=\"128\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">&gt;= 90</text><rect x=\"216\" y=\"100\" width=\"128\" height=\"46\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"280\" y=\"128\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">&gt;= 60</text><rect x=\"376\" y=\"100\" width=\"128\" height=\"46\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"440\" y=\"128\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">else</text><rect x=\"512\" y=\"100\" width=\"72\" height=\"46\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"548\" y=\"128\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">结束</text><path d=\"M184 123H212\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><path d=\"M344 123H372\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><path d=\"M504 123H508\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><text x=\"120\" y=\"170\" font-size=\"13\" text-anchor=\"middle\" fill=\"#4d6f67\">优秀</text><text x=\"280\" y=\"170\" font-size=\"13\" text-anchor=\"middle\" fill=\"#4d6f67\">及格</text><text x=\"440\" y=\"170\" font-size=\"13\" text-anchor=\"middle\" fill=\"#4d6f67\">不及格</text></svg>", caption: "依次判断，第一条命中的分支执行完就跳出整条 if 链。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把 else 写到下一行。Go 要求 } else { 在同一行，换行会编译报错。",
            "else if 的顺序写反。宽松条件放前面会把严格条件挡住。",
            "以为 else 一定会执行。只有前面的 if 和 else if 全为假时才轮到 else。",
            "把 else 当成异常捕获。它不处理 panic，也不接收错误值。",
            "分支里重复写相同的代码。重复到第三遍就该考虑抽成函数，函数是后面单独一课的内容。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "写 if / else，让分数 50 打印不及格、60 打印及格，两组都跑一遍。",
            "写三档分支，分别用 95、75、40 跑，确认各走哪一条。",
            "故意把 else 换到下一行，抄下报错；再故意把 \">= 60\" 放到 \">= 90\" 前面，用 95 跑一次，看结果错在哪。"
          ]},
          { t: "tip", color: "green", text: "一句话：else 是「否则」，else if 是从上往下排队；谁先为真谁执行，后面的不再看。" }
        ]
      },
      {
        id: "go09",
        title: "第 9 课 · for 循环",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：用 for 让一段代码重复执行，掌握计数循环的三段式写法和 break、continue。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "Go 只有一种循环关键字：for。它把其他语言里的 for、while、do-while 都收进同一个形状。最常见的是三段式：for 初始化; 条件; 后置动作 { 循环体 }。初始化只执行一次；每轮先判断条件，为真就执行循环体，再执行后置动作，然后回到条件。" },
          { t: "p", text: "循环变量通常从 0 开始，因为切片的第一个下标是 0。循环条件写 i < n 而不是 i <= n，可以刚好走 n 次；写成 <= n 会多走一次，造成下标越界。这个「差一」是初学者最常见的 bug。" },
          { t: "p", text: "break 立刻跳出整个循环，continue 跳过本轮剩下的代码、直接进入下一轮。它们通常配合 if 使用：满足某个条件就提前结束，或者跳过不关心的元素。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "把一句话打印 5 次。",
            "遍历 0 到 n 的编号，逐个处理。",
            "累加一组数，算出总和。",
            "找到第一个满足条件的元素就停下。"
          ]},
          { t: "h2", text: "演示 1 · 打印 1 到 5" },
          { t: "code", lang: "go", code: "for i := 1; i <= 5; i++ {\n    fmt.Println(i)\n}" },
          { t: "p", text: "i 从 1 开始，每轮结束加 1，条件 i <= 5 为真就继续。输出是 1 到 5 各一行。把条件改成 i < 5，最后一行就是 4，循环只走四次。" },
          { t: "h2", text: "演示 2 · 累加与提前退出" },
          { t: "code", lang: "go", code: "sum := 0\nfor i := 1; i <= 100; i++ {\n    sum += i\n}\nfmt.Println(sum)\n\nfor i := 1; i <= 10; i++ {\n    if i == 4 {\n        break\n    }\n    fmt.Println(i)\n}" },
          { t: "p", text: "第一段算 1 到 100 的和，输出 5050。第二段打印到 3 就停，因为 i 等于 4 时 break 直接跳出整个循环。把 break 换成 continue，4 不会打印，但 5 到 10 会继续。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">for 的三段与回路</text><rect x=\"70\" y=\"104\" width=\"110\" height=\"48\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"125\" y=\"133\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">i := 1</text><rect x=\"216\" y=\"104\" width=\"130\" height=\"48\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"281\" y=\"133\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">i &lt;= 5 ?</text><rect x=\"382\" y=\"104\" width=\"110\" height=\"48\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"437\" y=\"133\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">循环体</text><rect x=\"520\" y=\"104\" width=\"84\" height=\"48\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"562\" y=\"133\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">i++</text><path d=\"M180 128H212\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><path d=\"M346 128H378\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><path d=\"M492 128H516\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><path d=\"M562 152V186H281V156\" stroke=\"#7fa99f\" stroke-width=\"2.5\"/><text x=\"430\" y=\"180\" font-size=\"13\" text-anchor=\"middle\" fill=\"#4d6f67\">回条件</text></svg>", caption: "初始化一次；条件每轮判一次；循环体和 i++ 每轮各走一次。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "条件写成 i <= n 却从 0 开始，结果多跑一次。先数清楚要跑几次。",
            "循环变量在循环体里被改动。i 由 for 自己推进，手动再改容易跳过或死循环。",
            "忘了 i++。条件一直为真，程序进入死循环，只能按 Ctrl+C 结束。",
            "在循环里不断拼接字符串。量小无所谓，量大时开销很高，后面可以用 strings.Builder。",
            "break 和 continue 搞混。break 出整个循环，continue 只跳过本轮。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 for 打印 1 到 10，再改成只打印偶数。",
            "用循环算 1 到 100 的和，打印结果，确认是 5050。",
            "写一个循环，从 1 数到 10，遇到 4 就 break；再把 break 换成 continue，对比两次输出。"
          ]},
          { t: "tip", color: "green", text: "一句话：for 是 Go 唯一的循环，三段式管初始化、条件、推进；break 出循环，continue 跳本轮。" }
        ]
      },
      {
        id: "go10",
        title: "第 10 课 · for range 与 while 写法",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：用 for range 遍历切片，用 for 条件 的写法代替 while，知道两种循环各自适合什么场景。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "Go 没有 while 关键字，需要「条件为真就一直转」时写成 for 条件 { ... }。它和 while 的行为一样：每轮开始先判断条件，为真就执行循环体，为假就退出。需要「至少执行一次」时，用 for { ... if 条件 { break } } 自己控制出口。" },
          { t: "p", text: "for range 是遍历容器专用的形状。遍历切片时，它每轮给你两个值：下标和该位置的元素副本。只关心下标就写 for i := range nums；只关心元素就写 for _, v := range nums。下划线是空白标识符，表示「这个位置我不要」，Go 不允许声明了不用的变量，所以不能省成 for v := range nums。" },
          { t: "p", text: "range 拿到的是元素副本，改 v 不会改原切片。要改原切片，用下标 nums[i] = ...。这个区别在处理数据时非常关键：想「读」就用 v，想「写」就用 i。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "遍历一组分数，算出平均分。",
            "遍历一组名字，逐个打印。",
            "用条件循环读取，直到某个条件成立。",
            "同时拿下标和值，打印「第几个是什么」。"
          ]},
          { t: "h2", text: "演示 1 · range 遍历切片" },
          { t: "code", lang: "go", code: "nums := []int{10, 20, 30}\nfor i, v := range nums {\n    fmt.Println(i, v)\n}\n\nfor _, v := range nums {\n    fmt.Println(v)\n}" },
          { t: "p", text: "第一段输出三行「下标 值」，第二段只输出值。下划线不是变量，它告诉编译器「这个返回值我故意丢掉」，所以不会触发未使用变量的编译错误。" },
          { t: "h2", text: "演示 2 · 用 for 条件代替 while" },
          { t: "code", lang: "go", code: "n := 3\nfor n > 0 {\n    fmt.Println(n)\n    n--\n}\nfmt.Println(\"起飞\")" },
          { t: "p", text: "n 每轮减 1，减到 0 时条件为假，循环结束。注意 n-- 必须写在循环体里，否则 n 永远大于 0，程序不会停。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">range 每轮交给你两样东西</text><rect x=\"72\" y=\"104\" width=\"150\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"147\" y=\"130\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">nums</text><text x=\"147\" y=\"151\" font-size=\"13\" text-anchor=\"middle\" fill=\"#4d6f67\">[10 20 30]</text><path d=\"M226 136H306\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"306,136 296,130 296,142\" fill=\"#2a8c78\"/><rect x=\"314\" y=\"92\" width=\"126\" height=\"44\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"377\" y=\"120\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">i = 下标</text><rect x=\"314\" y=\"148\" width=\"126\" height=\"44\" rx=\"8\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"377\" y=\"176\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">v = 元素副本</text><path d=\"M444 114H488\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><path d=\"M444 170H488\" stroke=\"#2a8c78\" stroke-width=\"2.5\"/><text x=\"530\" y=\"120\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">想写下标</text><text x=\"530\" y=\"176\" font-size=\"14\" text-anchor=\"middle\" fill=\"#173d36\">想读用值</text></svg>", caption: "i 指位置，v 是复制出来的一份值；改 v 不会改原切片。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "写 for v := range nums 想只取值。这样拿到的是下标，值要用 _, v。",
            "在 range 里改 v 以为能改原切片。v 是副本，要改原切片用 nums[i]。",
            "条件循环忘了在循环体里推进条件变量，导致死循环。",
            "遍历时删除或追加元素，导致跳过或重复访问。先收集要改的，再统一处理。",
            "把 range 用在 nil 切片上以为会报错。它只是零轮，循环体一次都不执行。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 range 遍历一个分数切片，打印下标和分数。",
            "只取值不取下标，遍历同一组数并求和。",
            "用 for 条件写一个从 3 倒数到 1 的循环，打印完再打印「起飞」。"
          ]},
          { t: "tip", color: "green", text: "一句话：range 管遍历、每轮给下标和副本；while 用 for 条件写，推进条件变量的那一步不能忘。" }
        ]
      },
      {
        id: "go11",
        title: "第 11 课 · 函数",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：会把一段重复代码抽成函数，知道参数、返回值和多返回值的写法。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "函数是「起个名字的一段代码」。调用时把参数传进去，函数体执行完，用 return 把结果交回来。函数的意义不只是少写几行：它给一段逻辑起了名字，读代码的人看到 add(2, 3) 就知道这里在做加法，不用再读一遍加号两边是什么。" },
          { t: "p", text: "Go 的函数声明形状是 func 名字(参数列表) 返回类型 { 函数体 }。参数要写名字和类型，连续两个同类型参数可以合并写法；返回类型写在参数列表后面。没有返回值就不写返回类型。" },
          { t: "p", text: "Go 支持多返回值，最常见的组合是「结果 + 错误」：func divide(a, b float64) (float64, error)。调用方拿到两个值，先看 error 是不是 nil，再决定用不用结果。这个模式后面读标准库和写真实项目会反复遇到。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "把「算平均分」这段逻辑抽出来，多处复用。",
            "把「带错误检查的除法」封装成一个函数，调用方不用重复写检查。",
            "给一段复杂计算起一个能读懂的名字。",
            "把主函数拆小，让每一段只做一件事。"
          ]},
          { t: "h2", text: "演示 1 · 一个参数两个返回值的函数" },
          { t: "code", lang: "go", code: "package main\n\nimport \"fmt\"\n\nfunc add(a int, b int) int {\n    return a + b\n}\n\nfunc main() {\n    fmt.Println(add(2, 3))\n}" },
          { t: "p", text: "add 接收两个 int，返回一个 int。main 里调用 add(2, 3)，返回值直接交给 Println，输出 5。参数名只在函数体里可见，main 里的变量不会和它冲突。" },
          { t: "h2", text: "演示 2 · 多返回值" },
          { t: "p", text: "先定义函数。两个参数都是 float64，返回类型是一个括号包着的列表：一个 float64 商，一个 error。除数为 0 时返回错误，否则返回 nil 表示没有错误。" },
          { t: "code", lang: "go", code: "func divide(a float64, b float64) (float64, error) {\n    if b == 0 {\n        return 0, fmt.Errorf(\"除数不能为 0\")\n    }\n    return a / b, nil\n}" },
          { t: "p", text: "再调用它。调用方拿到两个值，先看 error 是不是 nil，再决定用不用结果。" },
          { t: "code", lang: "go", code: "result, err := divide(10, 2)\nif err != nil {\n    fmt.Println(err)\n} else {\n    fmt.Println(result)\n}" },
          { t: "p", text: "divide 返回两个值：商和错误。正常时错误是 nil，调用方用 if err != nil 判断。除数为 0 时返回 0 和一个错误值，调用方打印错误而不是继续算。这个「结果 + 错误」的写法比抛异常更显式，错误处理不会被悄悄跳过。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">调用函数：进去的是参数，出来的是返回值</text><rect x=\"64\" y=\"106\" width=\"126\" height=\"58\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"127\" y=\"132\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">add(2, 3)</text><text x=\"127\" y=\"153\" font-size=\"13\" text-anchor=\"middle\" fill=\"#4d6f67\">调用</text><path d=\"M194 135H268\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"268,135 258,129 258,141\" fill=\"#2a8c78\"/><rect x=\"276\" y=\"106\" width=\"146\" height=\"58\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"349\" y=\"132\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">a + b</text><text x=\"349\" y=\"153\" font-size=\"13\" text-anchor=\"middle\" fill=\"#4d6f67\">函数体</text><path d=\"M426 135H500\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"500,135 490,129 490,141\" fill=\"#2a8c78\"/><rect x=\"508\" y=\"106\" width=\"68\" height=\"58\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"542\" y=\"132\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">5</text><text x=\"542\" y=\"153\" font-size=\"13\" text-anchor=\"middle\" fill=\"#4d6f67\">返回值</text></svg>", caption: "参数从左边进去，函数体算完，return 把结果从右边交回来。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "函数名首字母大写和小写混着用。首字母大写是导出给别的包用的，同一个包里调用不受影响。",
            "忘了写 return。有返回类型的函数必须每条路径都有 return，否则编译不过。",
            "多返回值只接一个。有几个返回值就要用几个变量接，不要的用下划线。",
            "把 error 丢掉不检查。调用返回 error 的函数后，先判断 err 再用结果。",
            "函数越写越长。一个函数只做一件事，超过一屏就该拆。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "写 add(a, b int) int，在 main 里调用并打印结果。",
            "写 divide(a, b float64) (float64, error)，分别用 10/2 和 10/0 调用，打印结果和错误。",
            "把你前面写过的「算平均分」逻辑抽成一个函数，参数是分数切片，返回平均分。"
          ]},
          { t: "tip", color: "green", text: "一句话：函数把一段逻辑起名、收参数、返结果；Go 用多返回值把「结果 + 错误」一起交回来。" }
        ]
      },
      {
        id: "go12",
        title: "第 12 课 · 数组与切片",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：分清数组和切片，会创建、读取、修改、追加、截取，知道切片背后共享同一块底层数组。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "数组是定长的：var a [3]int 一创建就固定三个位置，长度不能变。切片是变长的：[]int 可以追加、可以截取，日常写程序几乎都用切片。切片本身不直接装数据，它是一张「描述符」，记着三样东西：指向底层数组的指针、当前长度 len、还能往后扩的容量 cap。" },
          { t: "p", text: "append 往切片末尾加元素。如果容量够，它直接在原数组后面写，返回的新切片和原切片共享底层数组；容量不够，它会申请一块更大的数组，把旧数据拷过去。所以 append 的返回值必须接住：s = append(s, 4)。" },
          { t: "p", text: "截取写法 s[low:high] 取下标 low 到 high-1 的元素，左闭右开。截出来的切片和原切片共享底层数组，改其中一个会影响另一个。要一份独立拷贝，用 copy 或者 append([]int(nil), s...)。这个共享行为是切片最容易踩的坑。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "存一组分数、名字、订单，随时追加新元素。",
            "取前三个、后两个，做分页或截断。",
            "把一组数据传给函数处理，函数内部按需遍历。",
            "用 make 预先分配容量，减少反复扩容的开销。"
          ]},
          { t: "h2", text: "演示 1 · 数组与切片的基本操作" },
          { t: "code", lang: "go", code: "var fixed [3]int = [3]int{1, 2, 3}\nfmt.Println(fixed, len(fixed))\n\nnums := []int{10, 20, 30}\nnums = append(nums, 40)\nfmt.Println(nums, len(nums), cap(nums))\n\nfmt.Println(nums[0])\nnums[0] = 99\nfmt.Println(nums)" },
          { t: "p", text: "fixed 是数组，长度固定 3。nums 是切片，append 之后长度变成 4。nums[0] 读第一个元素，nums[0] = 99 改第一个元素。切片的长度和容量可以不一样，容量是底层数组还能装多少。" },
          { t: "h2", text: "演示 2 · 截取与共享" },
          { t: "code", lang: "go", code: "base := []int{1, 2, 3, 4}\npart := base[1:3]\nfmt.Println(part)\n\npart[0] = 99\nfmt.Println(base)\n\nsafe := append([]int(nil), base...)\nsafe[0] = 7\nfmt.Println(base, safe)" },
          { t: "p", text: "part 取到的是 [2 3]，它和 base 共享底层数组。改 part[0] 之后，base 的第二个元素也变成 99。最后一行用 append 复制出一份独立切片，改 safe 不会影响 base。看到「改一个另一个也变」，先想到共享。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef6f4\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#173d36\">切片 = 指针 + 长度 + 容量</text><rect x=\"64\" y=\"100\" width=\"170\" height=\"70\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"149\" y=\"126\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">slice</text><text x=\"149\" y=\"148\" font-size=\"13\" text-anchor=\"middle\" fill=\"#4d6f67\">ptr / len / cap</text><path d=\"M238 135H300\" stroke=\"#2a8c78\" stroke-width=\"3\"/><polygon points=\"300,135 290,129 290,141\" fill=\"#2a8c78\"/><rect x=\"308\" y=\"100\" width=\"276\" height=\"70\" rx=\"10\" fill=\"#ffffff\" stroke=\"#2a8c78\" stroke-width=\"2\"/><text x=\"446\" y=\"126\" font-size=\"15\" text-anchor=\"middle\" fill=\"#173d36\">底层数组</text><text x=\"446\" y=\"148\" font-size=\"13\" text-anchor=\"middle\" fill=\"#4d6f67\">1  2  3  4  …</text><rect x=\"316\" y=\"112\" width=\"58\" height=\"46\" rx=\"5\" fill=\"#d9efe9\"/><rect x=\"378\" y=\"112\" width=\"58\" height=\"46\" rx=\"5\" fill=\"#d9efe9\"/></svg>", caption: "切片只是描述符，数据在底层数组里；两个切片可能指向同一块数组。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "append 之后不接返回值。s = append(s, x) 才是正确写法，只写 append(s, x) 可能丢掉新元素。",
            "以为切片是独立拷贝。截取出来的切片和原切片共享底层数组，改一个另一个也变。",
            "下标越界。长度为 3 的切片，合法下标是 0、1、2，访问 3 会 panic。",
            "用 len 当容量。len 是当前元素个数，cap 才是底层数组还能装多少。",
            "在循环里对大切片反复 append 又不管容量。数据量大时先 make 一个够大的容量，能少很多次拷贝。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "创建一个 []int，append 三个元素，打印长度和容量。",
            "取切片的前两个元素，改其中一个，观察原切片有没有跟着变。",
            "用 append([]int(nil), s...) 复制一份，改副本，确认原切片不受影响。"
          ]},
          { t: "tip", color: "green", text: "一句话：数组定长，切片可变；切片是「指针 + 长度 + 容量」的描述符，截取会共享底层数组。" }
        ]
      }
    ]
  }
};
