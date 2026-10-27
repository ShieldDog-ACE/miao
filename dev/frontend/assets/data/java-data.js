/* 喵站 · Java 入门（单文件教程数据，结构对齐 go-data.js）
 * 12 课：历史 / 装工具 / 第一个程序 / 变量 / 类型 / 运算符 / if / else / for / while / 方法 / 数组。
 * 本机没有 javac 与 java，代码只按 Java 17 语法做静态自查，未实际编译运行。 */
window.MIAO_JAVA = {
  tutorial: {
    id: "java",
    title: "Java 入门",
    intro: "从 Oak 与 JVM 讲到数组：12 课走完 Java 的基础语法，每课都有能照敲的程序和一张机制图。",
    cat: "java",
    diff: "入门",
    tags: ["Java", "JDK", "入门", "编程"],
    author: "喵站官方",
    cover: "/assets/img/covers/java.svg",
    updated: "2026-10-27",
    chapters: [
      {
        id: "ja01",
        title: "第 1 课 · Java 的历史：从 Oak 到 JVM",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：知道 Java 从哪来、字节码与 JVM 各承担什么角色，以及它为什么能跨平台。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "1991 年，Sun 公司的 James Gosling 带着一个小组做消费电子产品，需要一个不依赖具体芯片的程序语言。项目内部叫 Green，语言最初取名 Oak，灵感来自办公室窗外的一棵橡树。后来发现 Oak 这个名字已经被别的公司注册，团队在咖啡馆里把它改成了 Java。1995 年 Java 正式对外发布，浏览器厂商很快跟进，它成了写跨平台程序的热门选择。" },
          { t: "p", text: "Java 的核心承诺是「一次编写，到处运行」。做法不是把源码直接交给操作系统，而是先由 javac 把 .java 编译成 .class 字节码，再由 JVM 把字节码翻译成当前机器能执行的指令。字节码是统一的，JVM 是分平台的：Windows 有 Windows 的 JVM，Linux 有 Linux 的 JVM，同一份 .class 在两边都能跑。" },
          { t: "p", text: "2010 年 Oracle 收购 Sun，Java 继续由 Oracle 主导，同时有 OpenJDK 这个开源实现。版本节奏从 2017 年起改为每半年一个功能版本，每两年挑一个长期支持版。Java 17 和 Java 21 都是长期支持版，教程里的写法以 Java 17 为底线。" },
          { t: "p", text: "JDK、JRE、JVM 三个词常在安装时出现。JVM 只负责执行字节码；JRE 是 JVM 加运行所需的标准类库；JDK 在 JRE 之上又加了 javac 编译器和一批开发工具。要写程序就装 JDK，只运行别人做好的程序装 JRE 就够。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "写后端服务：银行、电商、企业内部的接口系统大量用 Java。",
            "写 Android 应用：系统层和大量存量代码都在 Java 生态里。",
            "写大数据工具：Hadoop、Spark、Flink 都跑在 JVM 上。",
            "写跨平台软件：同一份字节码在三大桌面系统上运行。"
          ]},
          { t: "h2", text: "演示：一段 Java 程序长什么样" },
          { t: "p", text: "先看一段完整的程序，不要求现在就能写，只看形状：一个类、一个 main 方法、一行输出。后面会从安装工具开始，一步一步把它拆开。" },
          { t: "code", lang: "java", code: `public class Hello {
    public static void main(String[] args) {
        System.out.println("你好，Java");
    }
}` },
          { t: "p", text: "public class Hello 里的类名和文件名 Hello.java 必须一致。javac 编译后生成 Hello.class，再用 java Hello 启动，命令行里写的类名不带扩展名。这段代码本机没有实际编译，只按语法逐行核对过。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 220"><rect x="24" y="26" width="592" height="168" rx="14" fill="#eef6f4"/><text x="320" y="60" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">源码到运行的四个站点</text><rect x="44" y="96" width="112" height="58" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="100" y="120" font-size="15" text-anchor="middle" fill="#173d36">Hello.java</text><text x="100" y="142" font-size="14" text-anchor="middle" fill="#4d6f67">源码</text><path d="M160 125H190" stroke="#2a8c78" stroke-width="3"/><polygon points="190,125 180,119 180,131" fill="#2a8c78"/><text x="175" y="112" font-size="14" text-anchor="middle" fill="#4d6f67">javac</text><rect x="192" y="96" width="112" height="58" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="248" y="120" font-size="15" text-anchor="middle" fill="#173d36">Hello.class</text><text x="248" y="142" font-size="14" text-anchor="middle" fill="#4d6f67">字节码</text><path d="M308 125H338" stroke="#2a8c78" stroke-width="3"/><polygon points="338,125 328,119 328,131" fill="#2a8c78"/><text x="323" y="112" font-size="14" text-anchor="middle" fill="#4d6f67">java</text><rect x="340" y="96" width="112" height="58" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="396" y="120" font-size="15" text-anchor="middle" fill="#173d36">JVM</text><text x="396" y="142" font-size="14" text-anchor="middle" fill="#4d6f67">翻译成机器指令</text><path d="M456 125H486" stroke="#2a8c78" stroke-width="3"/><polygon points="486,125 476,119 476,131" fill="#2a8c78"/><rect x="488" y="96" width="112" height="58" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="544" y="120" font-size="15" text-anchor="middle" fill="#173d36">终端</text><text x="544" y="142" font-size="14" text-anchor="middle" fill="#4d6f67">一行文字</text><text x="320" y="182" font-size="14" text-anchor="middle" fill="#4d6f67">同一份字节码，交给不同平台的 JVM 执行</text></svg>`, caption: "Java 把「编译」和「运行」拆成两步，中间用统一的字节码隔开。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把 Java 和 JavaScript 当亲戚。两者名字相似，语法与运行环境完全不同。",
            "以为 Java 只能解释执行。现代 JVM 会把热点代码编译成本地机器码。",
            "把 Oak 当成另一门语言。它只是 Java 早期的名字，设计思路基本延续。",
            "以为字节码只能由 Java 写。Kotlin、Scala、Groovy 也编译成同样的 .class。",
            "把 JDK 和 JVM 混为一谈。JVM 只是执行引擎，JDK 是整套开发工具。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用自己的话写下 Oak 改名 Java 的原因。",
            "画出 .java 到 .class 再到运行结果的路径，标出 javac 与 JVM 的位置。",
            "查一下电脑上已装的 Java 版本，记下版本号以及它是不是长期支持版。",
            "列举三个你用过或听过的 Java 程序，说明它们运行在哪类设备上。"
          ]},
          { t: "tip", color: "green", text: "一句话：Java 用字节码换取跨平台，javac 负责编译，JVM 负责执行，JDK 把两者和类库装在一起。" }
        ]
      },
      {
        id: "ja02",
        title: "第 2 课 · 装 JDK 和 VS Code",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：装好 JDK 与 VS Code，用 java -version 和 javac -version 确认两条命令都能用。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "JDK 是开发 Java 程序的整套工具。它包含 javac 编译器、java 启动器、标准类库和调试工具。装 JDK 时不需要单独再装 JVM，它们被打包在一起。选版本时优先选长期支持版，Java 17 或 Java 21 都可以，教程示例兼容两者。" },
          { t: "p", text: "VS Code 负责写代码，JDK 负责编译和运行。VS Code 通过 Java 扩展调用本机的 javac 和 java，所以顺序是先装 JDK，再装编辑器扩展。扩展装好后，编辑器能补全、跳转定义，并在保存时报告语法错误。" },
          { t: "p", text: "命令行工具要在 PATH 里才能被直接调用。用系统自带软件源安装通常会自动配置；手动解压压缩包时，要自己把 JDK 的 bin 目录加进 PATH，并设置 JAVA_HOME 指向 JDK 根目录。JAVA_HOME 是很多构建工具寻找 JDK 的默认入口。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "在终端里编译单个 .java 文件。",
            "启动已经编译好的类，看到运行结果。",
            "在编辑器里得到补全和即时的语法提示。",
            "用版本命令排查「到底装没装好」这类环境问题。"
          ]},
          { t: "h2", text: "演示：Ubuntu 上装 JDK 与 VS Code" },
          { t: "p", text: "下面按顺序执行。第一条刷新软件源，第二条安装 OpenJDK 17，第三条装 VS Code，最后两条分别查看运行时和编译器的版本。" },
          { t: "code", lang: "bash", code: `sudo apt update
sudo apt install -y openjdk-17-jdk
sudo snap install code --classic
java -version
javac -version` },
          { t: "p", text: "java -version 输出运行时版本，javac -version 输出编译器版本，两行都出现 17 才说明 JDK 完整。只装了 JRE 的机器上，javac 会提示找不到命令。想用压缩包安装也可以，路径要自己配：下面这段把 JDK 解压到 /usr/local，再把 JAVA_HOME 和 bin 目录写进 shell 配置，最后重新读一次配置并验证。" },
          { t: "code", lang: "bash", code: `wget https://download.oracle.com/java/17/latest/jdk-17_linux-x64_bin.tar.gz
sudo tar -C /usr/local -xzf jdk-17_linux-x64_bin.tar.gz
echo 'export JAVA_HOME=/usr/local/jdk-17' >> ~/.bashrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
javac -version` },
          { t: "p", text: "最后在 VS Code 的扩展面板搜索 Extension Pack for Java 并安装。打开任意 .java 文件，编辑器右下角会显示正在使用的 JDK；若显示未找到，点它手动选中 JDK 根目录。" },
          { t: "code", lang: "java", code: `public class Check {
    public static void main(String[] args) {
        System.out.println("JDK 就绪");
    }
}` },
          { t: "p", text: "把这段存成 Check.java，用 javac Check.java 编译，再 java Check 运行。终端出现「JDK 就绪」，说明编译器、运行时与编辑器三处已经连通。这段代码同样只做了语法核对，没有实际执行。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240"><rect x="24" y="26" width="592" height="188" rx="14" fill="#eef6f4"/><text x="320" y="60" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">安装链：包到命令再到验证</text><rect x="44" y="94" width="120" height="62" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="104" y="118" font-size="15" text-anchor="middle" fill="#173d36">JDK 安装包</text><text x="104" y="140" font-size="14" text-anchor="middle" fill="#4d6f67">apt 或 tar.gz</text><path d="M168 125H198" stroke="#2a8c78" stroke-width="3"/><polygon points="198,125 188,119 188,131" fill="#2a8c78"/><rect x="202" y="94" width="112" height="62" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="258" y="118" font-size="15" text-anchor="middle" fill="#173d36">bin 进 PATH</text><text x="258" y="140" font-size="14" text-anchor="middle" fill="#4d6f67">java / javac</text><path d="M318 125H348" stroke="#2a8c78" stroke-width="3"/><polygon points="348,125 338,119 338,131" fill="#2a8c78"/><rect x="352" y="94" width="120" height="62" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="412" y="118" font-size="15" text-anchor="middle" fill="#173d36">VS Code 扩展</text><text x="412" y="140" font-size="14" text-anchor="middle" fill="#4d6f67">调用本机命令</text><path d="M476 125H506" stroke="#2a8c78" stroke-width="3"/><polygon points="506,125 496,119 496,131" fill="#2a8c78"/><rect x="510" y="94" width="90" height="62" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="555" y="118" font-size="15" text-anchor="middle" fill="#173d36">版本号</text><text x="555" y="140" font-size="14" text-anchor="middle" fill="#4d6f67">两条都通过</text><text x="320" y="192" font-size="14" text-anchor="middle" fill="#4d6f67">安装的判据不是装完，而是 java 与 javac 都能报出版本</text></svg>`, caption: "编辑器只是界面，真正干活的是 PATH 里的 javac 和 java。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "只装 JRE 就找 javac。JRE 不含编译器，必须装 JDK。",
            "装完不开新终端。PATH 改动要新开终端或重读配置才生效。",
            "装了多个 JDK 却不知道用的是哪个。用 which javac 看真实路径。",
            "把 JAVA_HOME 指向 bin 目录。它应指向 JDK 根目录，bin 由 PATH 负责。",
            "在 VS Code 里直接运行却没配 JDK。扩展会报找不到 Java 运行时。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "装好 JDK 17 或 21，抄下 java -version 与 javac -version 两行输出。",
            "用 which javac 确认编译器路径，并说明它和 JAVA_HOME 的关系。",
            "在 VS Code 装 Java 扩展，新建 Check.java 跑通「JDK 就绪」。",
            "打印 JAVA_HOME，确认它指向 JDK 根目录而不是 bin。"
          ]},
          { t: "tip", color: "green", text: "一句话：JDK 装一次就同时得到编译器和运行时，编辑器只是调用它们的界面，两条版本命令都通过才算装好。" }
        ]
      },
      {
        id: "ja03",
        title: "第 3 课 · 第一个程序：System.out.println",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：亲手写出第一个 Java 程序，弄清类名、main 方法、输出语句三处各自的职责。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "Java 程序的最小单位是类。一个 .java 文件里可以写多个类，但被 public 修饰的那个类名必须和文件名一致。程序不会自动从第一行开始执行，它从 main 方法进入。main 的签名固定为 public static void main(String[] args)，少一个修饰符或参数类型不对，启动时就会提示找不到主方法。" },
          { t: "p", text: "System.out.println 是标准输出的一条语句。System 是标准库里的类，out 是它提供的输出流，println 表示打印一行并换行。括号里的内容会先被求值，再变成文本写出去。字符串用双引号包住，多条语句之间用分号结束。" },
          { t: "p", text: "源码要经过编译才能运行。javac 把 .java 变成同名 .class，java 命令启动 JVM 并加载这个类。编译错误发生在 javac 阶段，运行错误发生在 java 阶段，两类错误的信息格式不一样，看报错时先分清是哪一步。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "打印固定的一句话，确认环境能跑。",
            "打印一个算式的结果，观察计算顺序。",
            "把程序内部的状态输出到终端，用于排查。",
            "在同一程序里连续输出多行，组织一段文字。"
          ]},
          { t: "h2", text: "演示 1 · 写文件" },
          { t: "p", text: "新建目录 hello，在里面建 Hello.java，内容如下。注意文件名大小写，Linux 上 Hello.java 和 hello.java 是两个不同的文件。" },
          { t: "code", lang: "java", code: `public class Hello {
    public static void main(String[] args) {
        System.out.println("你好，Java");
        System.out.println("这是我的第一个程序");
    }
}` },
          { t: "p", text: "类名 Hello 与文件名一致。main 方法里两行输出会依次打印，每行末尾自动换行。缩进不影响运行，但统一缩进能让大括号的配对一眼看清。" },
          { t: "h2", text: "演示 2 · 编译并运行" },
          { t: "p", text: "编译与运行分两条命令。第一条执行后目录里多出 Hello.class；第二条执行时不要写扩展名，写的是类名。" },
          { t: "code", lang: "bash", code: `cd hello
javac Hello.java
java Hello` },
          { t: "p", text: "如果终端提示找不到或无法加载主类，多半是执行目录不对，或者类名与文件名不一致。回到 .java 所在目录，确认 java 后面跟的类名与 public class 后面的名字完全相同。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240"><rect x="24" y="26" width="592" height="188" rx="14" fill="#eef6f4"/><text x="320" y="60" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">两条命令，两个阶段</text><rect x="44" y="96" width="112" height="60" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="100" y="120" font-size="15" text-anchor="middle" fill="#173d36">Hello.java</text><text x="100" y="142" font-size="14" text-anchor="middle" fill="#4d6f67">源码</text><path d="M160 126H192" stroke="#2a8c78" stroke-width="3"/><polygon points="192,126 182,120 182,132" fill="#2a8c78"/><text x="176" y="112" font-size="14" text-anchor="middle" fill="#4d6f67">javac</text><rect x="196" y="96" width="112" height="60" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="252" y="120" font-size="15" text-anchor="middle" fill="#173d36">Hello.class</text><text x="252" y="142" font-size="14" text-anchor="middle" fill="#4d6f67">字节码</text><path d="M312 126H344" stroke="#2a8c78" stroke-width="3"/><polygon points="344,126 334,120 334,132" fill="#2a8c78"/><text x="328" y="112" font-size="14" text-anchor="middle" fill="#4d6f67">java</text><rect x="348" y="96" width="112" height="60" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="404" y="120" font-size="15" text-anchor="middle" fill="#173d36">JVM</text><text x="404" y="142" font-size="14" text-anchor="middle" fill="#4d6f67">找 main 方法</text><path d="M464 126H496" stroke="#2a8c78" stroke-width="3"/><polygon points="496,126 486,120 486,132" fill="#2a8c78"/><rect x="500" y="96" width="100" height="60" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="550" y="120" font-size="15" text-anchor="middle" fill="#173d36">终端</text><text x="550" y="142" font-size="14" text-anchor="middle" fill="#4d6f67">两行文字</text><text x="320" y="192" font-size="14" text-anchor="middle" fill="#4d6f67">javac 只查语法并生成字节码，java 才真正执行</text></svg>`, caption: "编译错误看 javac 的提示，启动错误看 java 的提示，两阶段不要混。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "文件名和 public 类名不一致。大小写不同也算不一致。",
            "main 写成 Main 或少了 static。JVM 找不到入口。",
            "语句末尾漏分号。编译器常在下一行报错，实际错在上一行。",
            "用单引号包字符串。单引号是字符字面量，只能装一个字符。",
            "运行 java Hello.java。java 命令接收类名，不是源文件名。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "跑通 Hello.java，把两行输出改成你的名字和今天日期。",
            "故意把类名改成 Hello2 但文件名不改，抄下 javac 的报错。",
            "删掉 main 里的 static 再编译运行，记录两次报错的区别。",
            "用一条 println 打印一个简单算式的结果，例如 3 + 4。"
          ]},
          { t: "tip", color: "green", text: "一句话：Java 从 main 方法进入，类名要对上文件名，javac 负责编译，java 负责启动。" }
        ]
      },
      {
        id: "ja04",
        title: "第 4 课 · 变量与命名",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：会声明变量、给变量赋值、再改它的值，并写出符合 Java 习惯的变量名。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "变量是一块有名字的存储位置。声明变量要写类型和名字：int age; 这时位置已经留好。声明时直接赋值叫初始化：int age = 18; 之后再用等号改值，叫赋值：age = 19; 等号右边先算，再把结果放进左边那块位置。" },
          { t: "p", text: "Java 是静态类型语言。变量声明成 int 之后只能装整数，想装小数要另声明一个 double。类型对不上不会在运行时悄悄转换，而是在编译阶段就报错，这让你更早发现放错数据的地方。" },
          { t: "p", text: "名字有规则：只能用字母、数字、下划线和美元符号，不能以数字开头，不能是关键字，区分大小写。习惯上变量名用小写开头的驼峰写法，例如 mathScore；类名用大写开头，例如 Hello。名字要能说明用途，别用 a、b、tmp 这类看完不知道装什么的写法。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "保存会变化的数据，例如分数、余额、温度。",
            "保存一次算出的中间结果，避免重复计算。",
            "给重复出现的值起一个短名字。",
            "让一行代码读起来像一句能懂的话。"
          ]},
          { t: "h2", text: "演示 1 · 声明、初始化与改值" },
          { t: "p", text: "在 main 方法里声明两个变量，一个装名字，一个装年龄。先打印一次，改掉年龄后再打印一次，对比两次输出。" },
          { t: "code", lang: "java", code: `public class Variables {
    public static void main(String[] args) {
        String name = "小北";
        int age = 18;
        System.out.println(name);
        System.out.println(age);
        age = 19;
        System.out.println(age);
    }
}` },
          { t: "p", text: "age 后来从 18 改成 19，所以最后打印的是新值。变量只保留最后一次赋的值，旧值被覆盖，不会留下历史记录。" },
          { t: "h2", text: "演示 2 · 三种合法的名字" },
          { t: "p", text: "下面三个变量装的都是分数，区别只在命名风格。它们能同时存在，因为名字不同；编译器不关心你选哪种风格，但读代码的人会在意。" },
          { t: "code", lang: "java", code: `public class Naming {
    public static void main(String[] args) {
        int score = 90;
        int mathScore = 95;
        int math_score = 88;
        System.out.println(score + mathScore + math_score);
    }
}` },
          { t: "p", text: "三种写法都合法，但驼峰写法最符合 Java 习惯。下划线写法能编译，团队里通常不用。名字区分大小写，Score 和 score 是两个不同的变量。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 220"><rect x="24" y="26" width="592" height="168" rx="14" fill="#eef6f4"/><text x="320" y="60" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">变量是带类型的盒子</text><rect x="120" y="92" width="170" height="72" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="205" y="118" font-size="15" text-anchor="middle" fill="#173d36">age</text><text x="205" y="140" font-size="14" text-anchor="middle" fill="#4d6f67">int 型，32 位</text><text x="205" y="158" font-size="14" text-anchor="middle" fill="#4d6f67">盒子上的标签</text><path d="M294 128H382" stroke="#2a8c78" stroke-width="3"/><polygon points="382,128 372,122 372,134" fill="#2a8c78"/><rect x="386" y="92" width="130" height="72" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="451" y="122" font-size="18" text-anchor="middle" fill="#173d36">18</text><text x="451" y="146" font-size="14" text-anchor="middle" fill="#4d6f67">当前值</text><text x="320" y="190" font-size="14" text-anchor="middle" fill="#4d6f67">赋值 age = 19 只换盒子里的值，名字与类型不变</text></svg>`, caption: "声明决定盒子有多大，赋值只改盒子里装的内容。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "读一个没初始化的局部变量。方法里的局部变量没有默认值，必须先赋值再读。",
            "变量名以数字开头，例如 2score。",
            "把 = 当比较。单个等号是赋值，判断相等要两个等号。",
            "在同一作用域重复声明同名变量。",
            "变量名用拼音首字母。读代码的人猜不出含义。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "声明 name、age、city 三个变量并打印，再把 age 改成大一岁的值。",
            "用一个变量存 3 + 4 * 2 的结果并打印，再改写成先算加法的版本。",
            "故意用 2score 当变量名，抄下编译器报错，再改成合法名字。",
            "把 mathScore 和 math_score 同时声明，确认编译器把它们当两个变量。"
          ]},
          { t: "tip", color: "green", text: "一句话：变量是带类型和名字的存储位置，声明定类型，赋值换内容，名字用驼峰且要能读懂。" }
        ]
      },
      {
        id: "ja05",
        title: "第 5 课 · 数据类型：基本类型与 String",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：认识八种基本类型，分清 int 与 double 的边界，知道 String 是类而不是基本类型。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "Java 有八种基本类型：byte、short、int、long 装整数，float、double 装小数，char 装单个字符，boolean 装真假。日常最常用的是 int、double、char、boolean。整数默认字面量是 int，超过二十亿要加 L 后缀变成 long；小数默认是 double，写 float 要加 f 后缀。" },
          { t: "p", text: "每种类型占的位数不同，能表示的数值范围也不同。int 占 32 位，double 占 64 位，char 占 16 位并用单引号包一个字符。boolean 只有 true 和 false 两个值，不能用 0 和 1 代替。选类型的原则是够用就好，别一律用最大的。" },
          { t: "p", text: "String 不是基本类型，它是标准库里的一个类，用来装一串字符，用双引号。基本类型和 String 可以拼接：字符串在前时，加号把后面的值转成文本接上去。类型转换分两种：小范围到大范围自动完成，大范围到小范围必须显式写括号，而且可能丢掉小数部分。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "int 存数量、年龄、编号这类不带小数的量。",
            "double 存价格、比例、测量值这类带小数的量。",
            "char 存等级字母，boolean 存开关状态。",
            "String 存名字、句子、文件路径。"
          ]},
          { t: "h2", text: "演示 1 · 六种值各声明一个" },
          { t: "p", text: "下面这段把六种常用类型各声明一次并逐行打印。注意 long 的字面量后缀 L、char 的单引号、String 的双引号，三种写法不能互相替换。" },
          { t: "code", lang: "java", code: `public class Types {
    public static void main(String[] args) {
        int count = 3;
        long total = 3000000000L;
        double price = 9.9;
        char grade = 'A';
        boolean ok = true;
        String city = "杭州";
        System.out.println(count); System.out.println(total);
        System.out.println(price); System.out.println(grade);
        System.out.println(ok); System.out.println(city);
    }
}` },
          { t: "p", text: "六行输出各自独立，println 会把每种值转成适合阅读的文本。终端上看不出类型差别，但编译器记得每个变量的类型，后面拿 String 去做减法会当场报错。" },
          { t: "h2", text: "演示 2 · 自动提升与强制转换" },
          { t: "p", text: "把 int 赋给 double 不需要写任何标记，编译器自动加宽。反过来把 double 塞回 int 必须写括号，这叫强制转换，代价是小数部分被截掉。" },
          { t: "code", lang: "java", code: `public class Convert {
    public static void main(String[] args) {
        int a = 10;
        double b = a;
        int c = (int) 9.9;
        System.out.println(b);
        System.out.println(c);
    }
}` },
          { t: "p", text: "int 到 double 是自动的，10 变成 10.0。double 到 int 必须写 (int)，9.9 会变成 9 而不是 10，这叫截断。转换只产生新值，原变量不变。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240"><rect x="24" y="26" width="592" height="188" rx="14" fill="#eef6f4"/><text x="320" y="60" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">转换有方向，宽度决定代价</text><rect x="54" y="90" width="78" height="46" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="93" y="119" font-size="15" text-anchor="middle" fill="#173d36">int</text><rect x="152" y="90" width="88" height="46" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="196" y="119" font-size="15" text-anchor="middle" fill="#173d36">long</text><rect x="260" y="90" width="96" height="46" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="308" y="119" font-size="15" text-anchor="middle" fill="#173d36">float</text><rect x="376" y="90" width="112" height="46" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="432" y="119" font-size="15" text-anchor="middle" fill="#173d36">double</text><path d="M136 113H148" stroke="#2a8c78" stroke-width="3"/><polygon points="148,113 138,107 138,119" fill="#2a8c78"/><path d="M244 113H256" stroke="#2a8c78" stroke-width="3"/><polygon points="256,113 246,107 246,119" fill="#2a8c78"/><path d="M360 113H372" stroke="#2a8c78" stroke-width="3"/><polygon points="372,113 362,107 362,119" fill="#2a8c78"/><text x="320" y="166" font-size="15" text-anchor="middle" fill="#173d36">向右自动加宽，不丢数据</text><path d="M492 158H552V196H196V150" stroke="#a05a2c" stroke-width="2.5" fill="none"/><polygon points="196,150 190,160 202,160" fill="#a05a2c"/><text x="374" y="214" font-size="14" text-anchor="middle" fill="#8a4a20">向左必须写 (int)，小数被截掉</text></svg>`, caption: "小范围到大范围自动完成，反向要显式写括号并接受精度损失。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "以为 String 是基本类型。它是类，有方法，也能和基本类型拼接。",
            "用两个等号比较字符串内容。两个等号比的是引用，内容比较应调用 equals。",
            "把 double 直接赋给 int 不写括号。编译直接失败。",
            "整数溢出。int 最大值再加一，结果会翻成负数。",
            "char 用双引号，结果变成 String 而不是单个字符。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "声明六个变量覆盖 int、long、double、char、boolean、String，各打印一行。",
            "把 int 赋给 double，再用 (int) 转回来，观察小数位怎么变。",
            "让 int 装 2147483648，抄下报错，再加上 L 改成 long。",
            "用加号把名字和年龄拼成一句完整的话打印。"
          ]},
          { t: "tip", color: "green", text: "一句话：基本类型定宽度、String 是类；小转大自动完成，大转小要括号并会丢精度。" }
        ]
      },
      {
        id: "ja06",
        title: "第 6 课 · 运算符",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：掌握算术、比较、逻辑三类运算符，算对整数除法与取余，写出能返回真假的表达式。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "算术运算符有加、减、乘、除、取余：+ - * / %。两个 int 相除，结果仍是 int，小数部分直接丢掉，10 / 3 得 3。想得到小数结果，至少让一边是 double，写 10.0 / 3。% 取余数，10 % 3 得 1，常用来判断能否整除。" },
          { t: "p", text: "自增自减 ++ 与 -- 把变量加一或减一。复合赋值 +=、-=、*=、/= 把运算和赋值合成一步，sum += i 等价于 sum = sum + i。它们只改变左边那个变量，不会产生新的变量名。" },
          { t: "p", text: "比较运算符 ==、!=、>、<、>=、<= 的结果是 boolean。注意等于判断用两个等号，一个等号是赋值，写错通常编译不过。逻辑运算符 &&、||、! 用来组合条件：&& 两边都真才真，|| 有一边真就真，! 取反。&& 与 || 有短路行为，左边已经能决定结果时右边不再执行。优先级从高到低大致是括号、单目、乘除取余、加减、比较、逻辑与、逻辑或；记不住就加括号，括号永远最稳。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "算总价、平均分、折扣和找零。",
            "用取余判断一个数是奇数还是偶数。",
            "把年龄、票务状态组合成一个判断结果。",
            "用复合赋值让累加代码更短。"
          ]},
          { t: "h2", text: "演示 1 · 五种算术运算" },
          { t: "p", text: "两个整数变量分别做五种运算，最后再补一行带小数的除法。重点看第四行和第五行，它们最容易和数学课上的直觉不一样。" },
          { t: "code", lang: "java", code: `public class Operators {
    public static void main(String[] args) {
        int a = 10;
        int b = 3;
        System.out.println(a + b);
        System.out.println(a - b);
        System.out.println(a * b);
        System.out.println(a / b);
        System.out.println(a % b);
        System.out.println(10.0 / 3);
    }
}` },
          { t: "p", text: "前三个输出 13、7、30。a / b 输出 3，因为两边都是整数；a % b 输出 1；最后一行把一边写成 10.0，结果才带小数。" },
          { t: "h2", text: "演示 2 · 比较与逻辑" },
          { t: "p", text: "比较运算的结果可以单独打印，也可以直接放进逻辑表达式。下面用年龄和票务状态演示与、或、非三种组合。" },
          { t: "code", lang: "java", code: `public class Compare {
    public static void main(String[] args) {
        int age = 20;
        boolean hasTicket = true;
        System.out.println(age >= 18);
        System.out.println(age >= 18 && hasTicket);
        System.out.println(age < 18 || hasTicket);
        System.out.println(!hasTicket);
    }
}` },
          { t: "p", text: "四个输出依次是 true、true、true、false。第三个是「年龄不够或者有票」，只要有一边为真就成立。把 age 改成 16，前两行会变成 false。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240"><rect x="24" y="26" width="592" height="188" rx="14" fill="#eef6f4"/><text x="320" y="60" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">同一个除号，两种结果</text><rect x="76" y="92" width="150" height="56" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="151" y="126" font-size="17" text-anchor="middle" fill="#173d36">10 / 3</text><rect x="76" y="160" width="150" height="46" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="151" y="189" font-size="15" text-anchor="middle" fill="#4d6f67">两边都是 int</text><path d="M230 120H298" stroke="#2a8c78" stroke-width="3"/><polygon points="298,120 288,114 288,126" fill="#2a8c78"/><path d="M230 183H298" stroke="#7fa99f" stroke-width="2.5"/><polygon points="298,183 288,177 288,189" fill="#7fa99f"/><rect x="306" y="92" width="120" height="56" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="366" y="126" font-size="17" text-anchor="middle" fill="#173d36">3</text><rect x="306" y="160" width="120" height="46" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="366" y="189" font-size="15" text-anchor="middle" fill="#4d6f67">丢掉小数</text><rect x="452" y="92" width="140" height="56" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="522" y="126" font-size="17" text-anchor="middle" fill="#173d36">10.0 / 3</text><rect x="452" y="160" width="140" height="46" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="522" y="189" font-size="15" text-anchor="middle" fill="#4d6f67">一边是 double</text><path d="M596 120H610V183H562" stroke="#7fa99f" stroke-width="2.5" fill="none"/><polygon points="562,183 572,177 572,189" fill="#7fa99f"/><text x="614" y="152" font-size="14" text-anchor="middle" fill="#4d6f67">3.333…</text></svg>`, caption: "结果类型由两边共同决定，想保留小数就把其中一边变成 double。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "整数除法丢小数。5 / 2 得 2，不是 2.5。",
            "把 = 写成比较。条件里要写两个等号。",
            "除以零。整数除零会抛 ArithmeticException。",
            "用两个等号比较浮点数。二进制表示有误差，应比较差值。",
            "逻辑混用不加括号。&& 优先级高于 ||，读起来容易误解。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用两个 int 算五种算术结果并打印，再把一边改成 double 重算除法。",
            "判断一个数能否被 3 整除，打印判断结果。",
            "写一个条件：年龄大于等于 18 且已登录，分别改两个变量观察输出。",
            "故意算 5 / 0，记下异常名称，再改回安全的值。"
          ]},
          { t: "tip", color: "green", text: "一句话：算术看两边类型，比较出真假，逻辑组合条件；整数相除丢小数，除以零会抛异常。" }
        ]
      },
      {
        id: "ja07",
        title: "第 7 课 · if 条件",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：会写 if 让程序按条件执行，知道条件必须是 boolean、大括号不能省。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "if 的作用是「条件为真才执行这一段」。写法是 if 后面跟一对圆括号，括号里放条件，再跟一对大括号包住要执行的代码。条件表达式的类型必须是 boolean，不能拿整数当真假，这一点和 C 语言不同。" },
          { t: "p", text: "条件为真时，程序进入大括号，从上到下执行完，再接着走 if 后面的语句。条件为假时，整个大括号被跳过，程序直接走后面的语句。跳过不是报错，也不是退出程序，只是少走一段。" },
          { t: "p", text: "圆括号里的表达式可以用比较运算和逻辑运算组合。写条件时先把要判断的事说清楚：分数够不够、库存还有没有、名字是否为空。一个 if 只回答一个问题，问题多了就拆成多个 if，或者用变量先算好中间结果。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "分数过线才打印及格。",
            "库存大于零才允许下单。",
            "名字不为空才继续处理。",
            "编号在范围内才读取后续数据。"
          ]},
          { t: "h2", text: "演示：一个条件一段代码" },
          { t: "p", text: "下面用分数演示最基本的形状。运行前先猜一下输出几行，再对照终端结果。" },
          { t: "code", lang: "java", code: `public class IfDemo {
    public static void main(String[] args) {
        int score = 72;
        if (score >= 60) {
            System.out.println("及格");
        }
        System.out.println("检查结束");
    }
}` },
          { t: "p", text: "score 是 72，条件成立，打印「及格」，然后打印「检查结束」。把 score 改成 50，只会打印「检查结束」，因为第一段被跳过。" },
          { t: "h2", text: "演示：两个独立的 if" },
          { t: "p", text: "两个 if 是两件互相独立的事，程序会分别判断，不共享结果。下面同时判断奇偶与正负。" },
          { t: "code", lang: "java", code: `public class IfTwo {
    public static void main(String[] args) {
        int n = 7;
        if (n % 2 == 0) {
            System.out.println("偶数");
        }
        if (n > 0) {
            System.out.println("正数");
        }
    }
}` },
          { t: "p", text: "7 不是偶数，所以第一段不打印；7 大于 0，第二段打印「正数」。如果把 n 改成 -8，两段的判断结果都会翻转。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250"><rect x="24" y="26" width="592" height="210" rx="14" fill="#eef6f4"/><text x="320" y="58" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">条件为真才进这一段</text><polygon points="150,86 228,127 150,168 72,127" fill="#ffffff" stroke="#2a8c78" stroke-width="2.5"/><text x="150" y="132" font-size="15" text-anchor="middle" fill="#173d36">score &gt;= 60</text><path d="M228 127H286" stroke="#2a8c78" stroke-width="3"/><polygon points="286,127 276,121 276,133" fill="#2a8c78"/><text x="256" y="115" font-size="14" text-anchor="middle" fill="#4d6f67">真</text><rect x="290" y="101" width="150" height="52" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="365" y="132" font-size="15" text-anchor="middle" fill="#173d36">执行大括号</text><path d="M150 168V205H286" stroke="#7fa99f" stroke-width="2.5"/><polygon points="286,205 276,199 276,211" fill="#7fa99f"/><text x="172" y="196" font-size="14" text-anchor="middle" fill="#4d6f67">假</text><rect x="290" y="180" width="150" height="50" rx="10" fill="#ffffff" stroke="#7fa99f" stroke-width="2"/><text x="365" y="210" font-size="15" text-anchor="middle" fill="#4d6f67">整段跳过</text><path d="M440 127H492V205" stroke="#2a8c78" stroke-width="2.5" fill="none"/><path d="M440 205H498" stroke="#2a8c78" stroke-width="2.5"/><polygon points="498,205 488,199 488,211" fill="#2a8c78"/><rect x="500" y="180" width="96" height="50" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="548" y="210" font-size="15" text-anchor="middle" fill="#173d36">继续往下</text></svg>`, caption: "真走执行段，假就绕过；两条路最后都汇到 if 后面的下一行。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "条件里写赋值。if (x = 1) 不是比较，编译通常直接报错。",
            "条件写成整数。Java 要求 boolean，不能写 if (1)。",
            "省略大括号只写一行。以后加第二行时容易漏进条件范围。",
            "在 if 里声明变量，出来还想用。它只活在大括号里。",
            "用两个等号比较字符串内容。应调用 equals。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "写 if 判断分数是否及格，分别用 72 和 50 运行。",
            "写两个独立 if，一个判断偶数，一个判断正数，用 7 和 -8 各跑一次。",
            "故意把条件写成赋值，抄下报错，再改回两个等号。",
            "把 if 的大括号去掉只留一行，再试着加第二行，观察哪些代码受条件控制。"
          ]},
          { t: "tip", color: "green", text: "一句话：if 只在条件为真时走一段，条件必须是 boolean，大括号决定这一段的范围。" }
        ]
      },
      {
        id: "ja08",
        title: "第 8 课 · else 与分支",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：用 else 补上「否则」，用 else if 排多条分支，知道判断顺序会改变结果。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "if 只处理条件成立的情况。要处理「否则」，就在 if 的大括号后面接 else。else 不能单独出现，它必须和最近的 if 配对。两段代码只会执行一段，不会两段都跑。" },
          { t: "p", text: "多条分支用 else if 串起来。程序从上往下依次判断，哪一条先为真就执行哪一条，执行完直接跳出整条链，后面的条件不再看。因此条件的顺序决定结果，范围更窄、更严格的条件要放在前面。" },
          { t: "p", text: "else 不是异常处理，它只是「另一条路」。程序不会因为走进 else 就认为出了错；要不要报错，取决于你在分支里写什么。分支里的代码可以是一行输出，也可以是一段完整的计算。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "成绩分及格与不及格两档。",
            "成绩分优秀、及格、不及格三档。",
            "按登录状态显示不同提示。",
            "库存为零时给出补货提示。"
          ]},
          { t: "h2", text: "演示：两档分支" },
          { t: "p", text: "先看只有两条路的情况。分数够就打印及格，不够就打印不及格，两段必走其一。" },
          { t: "code", lang: "java", code: `public class Branch {
    public static void main(String[] args) {
        int score = 50;
        if (score >= 60) {
            System.out.println("及格");
        } else {
            System.out.println("不及格");
        }
        System.out.println("检查结束");
    }
}` },
          { t: "p", text: "50 不满足条件，走 else，打印「不及格」。「检查结束」在整条分支外面，所以无论走哪边都会打印。" },
          { t: "h2", text: "演示：三档分支" },
          { t: "p", text: "把条件按严格程度从上往下排，就得到三档。下面用 85 分运行，先判断 90，再判断 60。" },
          { t: "code", lang: "java", code: `public class Grade {
    public static void main(String[] args) {
        int score = 85;
        if (score >= 90) {
            System.out.println("优秀");
        } else if (score >= 60) {
            System.out.println("及格");
        } else {
            System.out.println("不及格");
        }
    }
}` },
          { t: "p", text: "85 先和 90 比，不成立；再和 60 比，成立，打印「及格」，最后的 else 不再看。把 90 那条挪到 60 后面，95 分就会被 60 那条先拦住，结果从优秀变成及格。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260"><rect x="24" y="26" width="592" height="220" rx="14" fill="#eef6f4"/><text x="320" y="56" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">从上往下排队，命中一条就停</text><rect x="70" y="78" width="150" height="40" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="145" y="104" font-size="15" text-anchor="middle" fill="#173d36">score &gt;= 90</text><rect x="70" y="134" width="150" height="40" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="145" y="160" font-size="15" text-anchor="middle" fill="#173d36">score &gt;= 60</text><rect x="70" y="190" width="150" height="40" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="145" y="216" font-size="15" text-anchor="middle" fill="#173d36">其余情况</text><path d="M145 118V130" stroke="#7fa99f" stroke-width="2.5"/><polygon points="145,130 139,120 151,120" fill="#7fa99f"/><text x="160" y="128" font-size="14" fill="#4d6f67">假</text><path d="M145 174V186" stroke="#7fa99f" stroke-width="2.5"/><polygon points="145,186 139,176 151,176" fill="#7fa99f"/><text x="160" y="184" font-size="14" fill="#4d6f67">假</text><path d="M220 98H430" stroke="#2a8c78" stroke-width="2.5"/><polygon points="430,98 420,92 420,104" fill="#2a8c78"/><rect x="434" y="76" width="112" height="44" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="490" y="103" font-size="15" text-anchor="middle" fill="#173d36">优秀</text><path d="M220 154H430" stroke="#2a8c78" stroke-width="2.5"/><polygon points="430,154 420,148 420,160" fill="#2a8c78"/><rect x="434" y="132" width="112" height="44" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="490" y="159" font-size="15" text-anchor="middle" fill="#173d36">及格</text><path d="M220 210H430" stroke="#2a8c78" stroke-width="2.5"/><polygon points="430,210 420,204 420,216" fill="#2a8c78"/><rect x="434" y="188" width="112" height="44" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="490" y="215" font-size="15" text-anchor="middle" fill="#173d36">不及格</text></svg>`, caption: "严格条件排在上面；一旦命中，下面的条件和 else 都不再执行。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "在 if 与 else 之间插入语句。else 必须和最近的 if 配对，中间插语句会编译失败。",
            "else if 顺序写反。宽松条件放前面会挡住严格条件。",
            "以为 else 一定执行。只有前面所有条件都为假才轮到它。",
            "在 else 里重复写相同代码。重复多了应考虑抽成方法，后面单独一课会讲。",
            "把 else 当异常捕获。它只处理条件不成立，不处理异常。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "写两档分支，用 50 和 60 各跑一次，确认走的路线。",
            "写三档分支，用 95、75、40 各跑一次，记录输出。",
            "把 90 与 60 两条条件顺序对调，用 95 跑一次，解释结果为什么变了。",
            "在 if 与 else 之间插一行输出，抄下报错，再删掉。"
          ]},
          { t: "tip", color: "green", text: "一句话：else 是「否则」，else if 从上往下排队，谁先为真谁执行，后面的不再看。" }
        ]
      },
      {
        id: "ja09",
        title: "第 9 课 · for 循环",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：用 for 让一段代码重复执行，写对三段式，知道循环变量从哪来、到哪停。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "for 适合次数已知的重复。它的圆括号里分三格，用分号隔开：初始化、条件、推进。初始化只执行一次；每轮先判断条件，为真就执行大括号里的循环体，再执行推进，然后回到条件。" },
          { t: "p", text: "循环变量通常从 0 开始，因为数组下标从 0 开始，后面单独一课会用到这个习惯。条件写 i < n 时，i 取 0 到 n-1，正好 n 轮；写成 i <= n 会多走一轮。数清楚起点、终点和步长，是写对循环的关键。" },
          { t: "p", text: "break 立刻跳出整个循环，continue 跳过本轮剩下的代码直接进入下一轮。两者通常放在 if 里，用来处理「找到就停」或「这一项不处理」的情况。循环里也可以累加、拼接、计数，只要变量在循环外先准备好。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "把一句话打印五次。",
            "依次输出 1 到 100。",
            "累加一组数求总和。",
            "找到第一个满足条件的编号就停。"
          ]},
          { t: "h2", text: "演示：打印 1 到 5" },
          { t: "p", text: "最基础的三段式。初始化 i 为 1，条件 i <= 5，每轮结束 i 加一。运行前先数一数会打印几行。" },
          { t: "code", lang: "java", code: `public class ForDemo {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println(i);
        }
    }
}` },
          { t: "p", text: "输出是 1 到 5 各一行，共五行。把条件改成 i < 5，最后一行就是 4；把初始化改成 i = 0，第一行就是 0。三格里任何一格改动都会改变轮数。" },
          { t: "h2", text: "演示：累加与提前退出" },
          { t: "p", text: "第一段用循环累加 1 到 100，第二段在 i 等于 4 时提前结束。注意累加变量 sum 必须在循环外声明，否则每轮都会重置。" },
          { t: "code", lang: "java", code: `public class ForSum {
    public static void main(String[] args) {
        int sum = 0;
        for (int i = 1; i <= 100; i++) {
            sum += i;
        }
        System.out.println(sum);
        for (int i = 1; i <= 10; i++) {
            if (i == 4) break;
            System.out.println(i);
        }
    }
}` },
          { t: "p", text: "第一段输出 5050。第二段打印 1、2、3 之后遇到 break，整个循环结束，4 不会打印。把 break 换成 continue，4 被跳过，但 5 到 10 会继续打印。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260"><rect x="24" y="18" width="592" height="218" rx="14" fill="#eef6f4"/><text x="320" y="44" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">for 的四步与回环</text><rect x="36" y="96" width="104" height="50" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="88" y="126" font-size="15" text-anchor="middle" fill="#173d36">i = 1</text><rect x="170" y="96" width="130" height="50" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="235" y="126" font-size="15" text-anchor="middle" fill="#173d36">i &lt;= 5 ?</text><rect x="330" y="96" width="110" height="50" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="385" y="126" font-size="15" text-anchor="middle" fill="#173d36">循环体</text><rect x="470" y="96" width="120" height="50" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="530" y="126" font-size="15" text-anchor="middle" fill="#173d36">i++</text><path d="M140 121H166" stroke="#2a8c78" stroke-width="2.5"/><polygon points="166,121 156,115 156,127" fill="#2a8c78"/><path d="M300 121H326" stroke="#2a8c78" stroke-width="2.5"/><polygon points="326,121 316,115 316,127" fill="#2a8c78"/><text x="313" y="111" font-size="14" text-anchor="middle" fill="#4d6f67">真</text><path d="M440 121H466" stroke="#2a8c78" stroke-width="2.5"/><polygon points="466,121 456,115 456,127" fill="#2a8c78"/><path d="M530 146V194H235V151" stroke="#7fa99f" stroke-width="2.5" fill="none"/><polygon points="235,151 229,161 241,161" fill="#7fa99f"/><text x="385" y="188" font-size="14" text-anchor="middle" fill="#4d6f67">回到条件</text><path d="M235 96V72H462" stroke="#a05a2c" stroke-width="2.5"/><polygon points="462,72 452,66 452,78" fill="#a05a2c"/><text x="252" y="66" font-size="14" text-anchor="middle" fill="#8a4a20">假</text><rect x="466" y="50" width="100" height="44" rx="8" fill="#ffffff" stroke="#a05a2c" stroke-width="2"/><text x="516" y="78" font-size="15" text-anchor="middle" fill="#173d36">结束循环</text></svg>`, caption: "初始化只做一次；条件每轮判一次；循环体与 i++ 每轮各走一次。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "条件写成 i <= n 却从 0 开始，多跑一轮。",
            "忘了 i++。条件一直为真，进入死循环。",
            "在循环体里手动改 i。推进由 for 负责，手动改容易跳过元素。",
            "累加变量声明在循环体内，每轮归零。",
            "break 与 continue 搞混。前者出整个循环，后者只跳本轮。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 for 打印 1 到 10，再改成只打印偶数。",
            "用循环算 1 到 100 的和，确认结果是 5050。",
            "写循环从 1 数到 10，遇到 4 就 break；再把 break 换成 continue，对比输出。",
            "故意把 i++ 删掉，运行三秒后手动终止，说明为什么会停不下来。"
          ]},
          { t: "tip", color: "green", text: "一句话：for 用初始化、条件、推进三格控制轮数，少写推进就会死循环，break 出循环，continue 跳本轮。" }
        ]
      },
      {
        id: "ja10",
        title: "第 10 课 · while 循环",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：用 while 表达「条件为真就一直转」，会把计数器推进写对，避免死循环。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "while 的形状比 for 简单：while 后面一对圆括号放条件，大括号里放循环体。每轮开始先判断条件，为真就执行循环体，执行完回到条件再判断。条件一开始就是假时，循环体一次都不执行。" },
          { t: "p", text: "while 适合次数不确定、只知道做到什么程度为止的场景。循环变量要在 while 之前声明并初始化，推进要写在循环体里。这两步少一步，条件就永远不变，程序会一直转下去。" },
          { t: "p", text: "for 和 while 能互相改写。次数明确、三格齐全时用 for 更清楚；只关心条件、不关心第几轮时用 while 更自然。选哪个，看读代码的人能否一眼看出循环什么时候停。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "从 3 倒数到 1。",
            "反复累加，直到超过阈值。",
            "读取数据，直到遇到结束标记。",
            "重试一个操作，直到成功。"
          ]},
          { t: "h2", text: "演示：倒数" },
          { t: "p", text: "下面用 while 从 3 倒数到 1。n 在循环外初始化，每轮打印后减一，减到 0 时条件为假，循环结束。" },
          { t: "code", lang: "java", code: `public class WhileDemo {
    public static void main(String[] args) {
        int n = 3;
        while (n > 0) {
            System.out.println(n);
            n--;
        }
        System.out.println("起飞");
    }
}` },
          { t: "p", text: "输出三行数字，最后一行是「起飞」。如果删掉 n--，n 永远大于 0，终端会不停打印 3，只能手动终止。先把推进写进循环体，再运行，是个好习惯。" },
          { t: "h2", text: "演示：累加直到上限" },
          { t: "p", text: "第二个例子让和不超过 20。每轮把 i 加到 sum，再让 i 加一；条件用 sum < 20，所以一旦和够了就停。" },
          { t: "code", lang: "java", code: `public class WhileSum {
    public static void main(String[] args) {
        int i = 1;
        int sum = 0;
        while (sum < 20) {
            sum += i;
            i++;
        }
        System.out.println(sum);
        System.out.println(i);
    }
}` },
          { t: "p", text: "循环结束时 sum 是 21，i 是 7。注意 sum 可能越过阈值，因为条件是每轮开头检查的：进入这一轮时 sum 还是 15，加上 6 就变成 21。想让最后一步不越过，得在加之前先算一次。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240"><rect x="24" y="26" width="592" height="188" rx="14" fill="#eef6f4"/><text x="320" y="58" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">while 先看条件，再决定转不转</text><rect x="240" y="82" width="160" height="50" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="320" y="112" font-size="15" text-anchor="middle" fill="#173d36">n &gt; 0 ?</text><rect x="240" y="164" width="160" height="50" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="320" y="186" font-size="15" text-anchor="middle" fill="#173d36">打印 n，然后 n--</text><text x="320" y="202" font-size="14" text-anchor="middle" fill="#4d6f67">推进必须在体内</text><path d="M320 132V160" stroke="#2a8c78" stroke-width="3"/><polygon points="320,160 314,150 326,150" fill="#2a8c78"/><text x="338" y="150" font-size="14" fill="#4d6f67">真</text><path d="M240 189H150V107H236" stroke="#7fa99f" stroke-width="2.5" fill="none"/><polygon points="236,107 226,101 226,113" fill="#7fa99f"/><text x="146" y="150" font-size="14" text-anchor="middle" fill="#4d6f67">回到条件</text><path d="M400 107H496" stroke="#a05a2c" stroke-width="2.5"/><polygon points="496,107 486,101 486,113" fill="#a05a2c"/><text x="428" y="96" font-size="14" text-anchor="middle" fill="#8a4a20">假</text><rect x="500" y="82" width="96" height="50" rx="10" fill="#ffffff" stroke="#a05a2c" stroke-width="2"/><text x="548" y="112" font-size="15" text-anchor="middle" fill="#173d36">循环结束</text></svg>`, caption: "条件在顶部，为假直接出循环；循环体里没有推进，就会永远为真。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "循环体里不推进条件变量，死循环。",
            "在 while 里重新声明循环变量，遮蔽外面那个。",
            "条件边界写错，导致多一次或少一次。",
            "用浮点数做循环条件，累积误差让条件永远差一点。",
            "需要至少执行一次时硬套 while。先把第一轮写在循环前，再用 while 处理后续。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 while 打印 3、2、1，再打印「起飞」。",
            "用 while 累加，直到和超过 20，打印和与当时的计数器。",
            "删掉循环体里的 i++，运行后手动终止，说明条件为什么一直为真。",
            "把上一课写的 1 到 100 累加改成 while 版本，确认结果相同。"
          ]},
          { t: "tip", color: "green", text: "一句话：while 每轮开头看条件，条件为真就转；循环变量在循环外初始化、在体内推进，缺一步就停不下来。" }
        ]
      },
      {
        id: "ja11",
        title: "第 11 课 · 方法",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：会把一段逻辑抽成方法，写对参数与返回值，知道 main 也是方法。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "方法是一段起了名字的代码。定义时写返回类型、方法名、参数列表和方法体；调用时写方法名加实参。方法把做什么与怎么算分开：读代码的人看到方法名就知道意图，不必每次重读算式。" },
          { t: "p", text: "参数是调用方交给方法的输入，写在圆括号里，每个参数都要写类型。返回值用 return 交回，类型必须和声明一致。没有结果要交回时，返回类型写 void，方法里可以不写 return，或者只写 return; 提前结束。" },
          { t: "p", text: "方法内部的变量只在方法体里存在，调用结束就消失。main 也是一个方法，JVM 从它开始执行。把重复的逻辑抽成方法，主方法会变短，修改时也只需要改一处。方法要先定义在同一个类里，再在 main 中调用。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "把加法、求最大值这类小计算复用。",
            "把格式化输出的逻辑收进一个方法。",
            "把主方法拆成几个有名字的步骤。",
            "同一段逻辑改一次就全部生效。"
          ]},
          { t: "h2", text: "演示：带返回值的方法" },
          { t: "p", text: "add 接收两个 int，返回它们的和。main 里把调用结果存进变量再打印，也可以直接把调用写进 println 的括号。" },
          { t: "code", lang: "java", code: `public class Methods {
    public static void main(String[] args) {
        int result = add(2, 3);
        System.out.println(result);
        System.out.println(add(10, 20));
    }

    static int add(int a, int b) {
        return a + b;
    }
}` },
          { t: "p", text: "add(2, 3) 返回 5，result 接住它。参数名 a、b 只在 add 内部可见，和 main 里的变量互不干扰。调用几次就执行几次，每次的参数可以不同。" },
          { t: "h2", text: "演示：void 方法与提前 return" },
          { t: "p", text: "没有返回值的方法用 void。下面 greet 只负责打印；check 在分数不及格时提前 return，后面的输出就不会执行。" },
          { t: "code", lang: "java", code: `public class VoidMethod {
    public static void main(String[] args) {
        greet("小北");
        check(50);
        check(80);
    }
    static void greet(String name) {
        System.out.println("你好，" + name);
    }
    static void check(int score) {
        if (score < 60) { System.out.println("需要补考"); return; }
        System.out.println("通过");
    }
}` },
          { t: "p", text: "greet 打印一句问候。check 收到 50 时打印「需要补考」并立刻返回，不会打印「通过」；收到 80 时跳过 if，打印「通过」。return 在这里的作用是提前结束方法，而不是交回一个值。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240"><rect x="24" y="26" width="592" height="188" rx="14" fill="#eef6f4"/><text x="320" y="58" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">调用：参数进去，结果回来</text><rect x="42" y="100" width="150" height="64" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="117" y="126" font-size="15" text-anchor="middle" fill="#173d36">main 里调用</text><text x="117" y="148" font-size="14" text-anchor="middle" fill="#4d6f67">add(2, 3)</text><path d="M196 132H242" stroke="#2a8c78" stroke-width="3"/><polygon points="242,132 232,126 232,138" fill="#2a8c78"/><text x="219" y="120" font-size="14" text-anchor="middle" fill="#4d6f67">传参</text><rect x="246" y="100" width="160" height="64" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="326" y="126" font-size="15" text-anchor="middle" fill="#173d36">add(a, b)</text><text x="326" y="148" font-size="14" text-anchor="middle" fill="#4d6f67">执行 a + b</text><path d="M410 132H456" stroke="#2a8c78" stroke-width="3"/><polygon points="456,132 446,126 446,138" fill="#2a8c78"/><text x="433" y="120" font-size="14" text-anchor="middle" fill="#4d6f67">return</text><rect x="460" y="100" width="130" height="64" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="525" y="126" font-size="15" text-anchor="middle" fill="#173d36">5</text><text x="525" y="148" font-size="14" text-anchor="middle" fill="#4d6f67">回到下一行</text><text x="320" y="192" font-size="14" text-anchor="middle" fill="#4d6f67">形参只在方法内有名字，实参的值复制进去</text></svg>`, caption: "调用一次就走一遍：实参复制给形参，return 把值交回调用处。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "方法声明了返回类型却漏写 return。编译器要求每条路径都有返回值。",
            "返回类型写 int，却 return 一个 double。类型不匹配。",
            "调用时把参数类型写错，或者顺序颠倒。",
            "在方法里改参数，以为能改到调用方的变量。基本类型是按值传递。",
            "方法名和变量名混用同一套命名习惯。方法用动词开头的驼峰写法更清楚。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "写 add 方法，在 main 里调用并打印结果。",
            "写 max 方法接收两个 int 返回较大的那个，用三组数测试。",
            "写 void 方法打印问候，再写一个方法在分数不及格时提前 return。",
            "把前面写过的累加逻辑抽成方法，参数是上限，返回总和。"
          ]},
          { t: "tip", color: "green", text: "一句话：方法把一段逻辑起名、收参数、返结果；main 也是方法，JVM 从它开始执行。" }
        ]
      },
      {
        id: "ja12",
        title: "第 12 课 · 数组",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：会创建数组、按下标读写、用 length 与循环遍历，知道下标从 0 开始。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "数组是一排同类型的变量，创建时长度就固定。写法有两种：new int[3] 先开三个位置，默认全是 0；int[] scores = {90, 80, 70}; 直接给出初始值。数组本身是对象，变量里存的是指向这排位置的引用。" },
          { t: "p", text: "每个位置有下标，从 0 开始。长度为 3 的数组，合法下标是 0、1、2；访问 3 会抛 ArrayIndexOutOfBoundsException。length 是数组的属性，不是方法，写 scores.length 不加括号，它返回创建时定下的长度。" },
          { t: "p", text: "遍历数组用 for 最自然：i 从 0 走到 length - 1，用 scores[i] 读或写。数组长度一旦创建不能改；需要变长时要换用能自动扩容的容器，那属于进阶内容。字符串数组和整数数组的用法一样，只是元素类型不同。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "存一组分数并求平均。",
            "存一周七天的温度。",
            "按下标修改某一项。",
            "用循环把整排数据打印出来。"
          ]},
          { t: "h2", text: "演示：创建、写入、遍历" },
          { t: "p", text: "先开三个位置，逐个写入分数，再用循环累加。重点看循环条件为什么是 i < scores.length，而不是 i <= scores.length。" },
          { t: "code", lang: "java", code: `public class ArraysDemo {
    public static void main(String[] args) {
        int[] scores = new int[3];
        scores[0] = 90;
        scores[1] = 80;
        scores[2] = 70;
        System.out.println(scores.length);
        int sum = 0;
        for (int i = 0; i < scores.length; i++) {
            sum += scores[i];
        }
        System.out.println(sum);
    }
}` },
          { t: "p", text: "length 是 3，循环走 0、1、2 三轮，sum 最后是 240。若条件写成 i <= scores.length，i 会取到 3，访问 scores[3] 时抛下标越界异常。" },
          { t: "h2", text: "演示：字面量与字符串数组" },
          { t: "p", text: "已经知道全部元素时，用大括号一次写完更省事。下面同时演示字符串数组的读取和修改。" },
          { t: "code", lang: "java", code: `public class Names {
    public static void main(String[] args) {
        String[] names = {"小北", "阿岚", "小满"};
        System.out.println(names[1]);
        names[1] = "阿青";
        System.out.println(names[1]);
        System.out.println(names.length);
    }
}` },
          { t: "p", text: "names[1] 第一次是「阿岚」，被改写后变成「阿青」。下标 1 指的是第二个位置，不是第一个。最后打印长度 3，说明数组本身没有被改短或加长。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 220"><rect x="24" y="26" width="592" height="168" rx="14" fill="#eef6f4"/><text x="320" y="58" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">一排格子，下标从 0 开始</text><text x="120" y="92" font-size="14" text-anchor="middle" fill="#4d6f67">0</text><text x="210" y="92" font-size="14" text-anchor="middle" fill="#4d6f67">1</text><text x="300" y="92" font-size="14" text-anchor="middle" fill="#4d6f67">2</text><text x="390" y="92" font-size="14" text-anchor="middle" fill="#4d6f67">3</text><text x="480" y="92" font-size="14" text-anchor="middle" fill="#4d6f67">4</text><rect x="80" y="100" width="80" height="52" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="120" y="133" font-size="16" text-anchor="middle" fill="#173d36">90</text><rect x="170" y="100" width="80" height="52" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="210" y="133" font-size="16" text-anchor="middle" fill="#173d36">80</text><rect x="260" y="100" width="80" height="52" rx="6" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="300" y="133" font-size="16" text-anchor="middle" fill="#173d36">70</text><rect x="350" y="100" width="80" height="52" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="390" y="133" font-size="16" text-anchor="middle" fill="#173d36">60</text><rect x="440" y="100" width="80" height="52" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="480" y="133" font-size="16" text-anchor="middle" fill="#173d36">50</text><path d="M80 160H520" stroke="#2a8c78" stroke-width="2"/><path d="M80 160V168" stroke="#2a8c78" stroke-width="2"/><path d="M520 160V168" stroke="#2a8c78" stroke-width="2"/><text x="300" y="184" font-size="14" text-anchor="middle" fill="#4d6f67">length = 5，合法下标是 0 到 4</text><text x="300" y="73" font-size="14" text-anchor="middle" fill="#4d6f67">scores</text></svg>`, caption: "五个格子固定不动，scores[2] 取到第三格；访问 scores[5] 就越界。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "下标从 1 开始数。第一个元素是 [0]。",
            "循环条件写 i <= length，越界。",
            "用 length() 取数组长度。length 是属性，不带括号。",
            "创建 new int[3] 后以为元素是随机值。整数默认 0。",
            "把数组变量直接赋给另一个变量，以为复制了整排数据。两个变量指向同一个数组。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "创建长度为 5 的 int 数组，写入五个分数，打印长度与总和。",
            "用循环找出数组中的最大值，打印它和它的下标。",
            "把字符串数组的第二个元素改掉，再打印每一项。",
            "故意访问 scores[3]（长度为 3），抄下异常名称，再把下标改回合法范围。"
          ]},
          { t: "tip", color: "green", text: "一句话：数组是定长的一排同类型位置，下标从 0 到 length 减一，length 不带括号。" }
        ]
      }
    ]
  }
};
