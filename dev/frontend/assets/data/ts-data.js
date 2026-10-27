/* 喵站 · TypeScript 入门（单文件形态，与 go-data.js 同构）
 * 12 课写到入门结束：历史 / 装工具 / 第一个程序 / 变量 / 基础类型 / 运算符 / if / else / for / while / 函数 / 数组与元组。
 * 代码按 TypeScript 5 语法编写，示例未在本机逐个执行；不写依赖机器路径的输出。 */
window.MIAO_TS = {
  tutorial: {
    id: "ts",
    title: "TypeScript 入门",
    intro: "从 2012 年微软的那次尝试讲起：12 课把 TypeScript 的基础语法走完，每课都有能照敲的代码和一张机制图。",
    cat: "ts",
    diff: "入门",
    tags: ["TypeScript", "TS", "入门", "编程"],
    author: "喵站官方",
    cover: "/assets/img/covers/ts.svg",
    updated: "2026-10-27",
    chapters: [
      {
        id: "ts01",
        title: "第 1 课 · TypeScript 的历史：给 JavaScript 加类型",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：知道 TypeScript 从哪里来、它和 JavaScript 是什么关系，以及大项目为什么愿意多写一层类型。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "1995 年，JavaScript 在十天里被设计出来，最初只给网页加一点交互：校验表单、切换图片、弹一句提示。后来网页变成应用，前端代码从几百行涨到几十万行，问题开始暴露：变量里装的是什么全靠人记，属性名拼错要等程序跑到那一行才报错，改一个函数参数要翻遍所有调用处。" },
          { t: "p", text: "2012 年，微软公开了 TypeScript，主导设计的是 C# 的设计者 Anders Hejlsberg。它不是新语言，而是 JavaScript 的超集：任何合法的 JavaScript 都是合法的 TypeScript，只是在上面多写一层类型。浏览器不认识类型，编译时类型会被全部擦掉，产出的仍是普通 JavaScript。" },
          { t: "p", text: "TypeScript 的编译器叫 tsc，它做两件事：检查类型是否对得上，把 .ts 文件翻译成 .js 文件。类型错误在编译阶段就报出来，而不是等用户打开页面才崩。2014 年 Angular 团队采用它，之后 VS Code、React 生态陆续跟上，社区还为上万个库补了类型声明。" },
          { t: "p", text: "类型不是免费的：要多写标注，多一个编译步骤。换回来的是编辑器补全、重构时的安全网，以及接手别人代码时能看懂的接口形状。小脚本可以不用，长期维护的项目几乎都会用。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "给函数参数和返回值标类型，调用处传错值，编辑器立刻标红。",
            "给接口返回的数据定好字段类型，字段名写错编译就通不过。",
            "重构时批量改名，类型检查会指出所有没改到的地方。",
            "新同事读类型定义就能知道一个函数要什么、给什么，不用先读实现。"
          ]},
          { t: "h2", text: "演示：一段带类型的代码长什么样" },
          { t: "p", text: "先不装环境，只看形状。下面这段是合法的 TypeScript，冒号后面写类型，等号后面写值，编译之后这些标注会全部消失。" },
          { t: "code", lang: "ts", code: `function greet(name: string, age: number): string {
  return "你好，" + name + "，你今年 " + age + " 岁";
}

const message: string = greet("小北", 18);
console.log(message);` },
          { t: "p", text: "把最后一行改成 greet(\"小北\", \"18\")，tsc 会指出第二个参数应该是 number，而不是等到运行时拼出一句怪话。类型的作用就是把这类错误提前到写代码的当下。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240">
  <rect x="40" y="40" width="560" height="160" rx="14" fill="#eef4fb"/>
  <text x="320" y="76" font-size="20" font-weight="700" text-anchor="middle" fill="#17324d">TypeScript 的编译链路</text>
  <rect x="56" y="104" width="120" height="58" rx="10" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="116" y="129" font-size="15" text-anchor="middle" fill="#17324d">hello.ts</text>
  <text x="116" y="150" font-size="14" text-anchor="middle" fill="#4d6f67">带类型标注</text>
  <line x1="180" y1="133" x2="194" y2="133" stroke="#2a6f97" stroke-width="3"/>
  <polygon points="198,133 186,127 186,139" fill="#2a6f97"/>
  <rect x="202" y="104" width="120" height="58" rx="10" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="262" y="129" font-size="15" text-anchor="middle" fill="#17324d">tsc 检查</text>
  <text x="262" y="150" font-size="14" text-anchor="middle" fill="#4d6f67">类型必须对上</text>
  <line x1="326" y1="133" x2="340" y2="133" stroke="#2a6f97" stroke-width="3"/>
  <polygon points="344,133 332,127 332,139" fill="#2a6f97"/>
  <rect x="348" y="104" width="120" height="58" rx="10" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="408" y="129" font-size="15" text-anchor="middle" fill="#17324d">擦除类型</text>
  <text x="408" y="150" font-size="14" text-anchor="middle" fill="#4d6f67">生成 hello.js</text>
  <line x1="472" y1="133" x2="486" y2="133" stroke="#2a6f97" stroke-width="3"/>
  <polygon points="490,133 478,127 478,139" fill="#2a6f97"/>
  <rect x="494" y="104" width="120" height="58" rx="10" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="554" y="129" font-size="15" text-anchor="middle" fill="#17324d">普通 JS</text>
  <text x="554" y="150" font-size="14" text-anchor="middle" fill="#4d6f67">浏览器或 Node</text>
</svg>`, caption: "类型只在编译期存在，tsc 检查完就把它擦掉，最终运行的仍是 JavaScript。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "以为浏览器能直接运行 .ts 文件。浏览器只认 JavaScript，必须先编译。",
            "以为有了类型就不需要测试。类型管形状，管不了业务逻辑对不对。",
            "把类型错误当成小警告。tsc 默认会报错，严格模式下更不会放过。",
            "以为所有 .js 文件都要改成 .ts。可以开 allowJs 让 JavaScript 一起参与编译。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用自己的话写下 TypeScript 和 JavaScript 的关系，不超过两句话。",
            "列出三个你见过的、因为类型不对而在运行时才暴露的错误场景。",
            "观察演示代码，指出哪一处是参数类型、哪一处是返回类型、哪一处是变量类型。"
          ]},
          { t: "tip", color: "green", text: "一句话：TypeScript 是 JavaScript 的超集，类型只在编译期存在，tsc 检查完就把它擦成普通 JavaScript。" }
        ]
      },
      {
        id: "ts02",
        title: "第 2 课 · 装 Node.js、VS Code 和 tsc",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：装好 Node.js、VS Code 和 TypeScript 编译器，最后用 node -v 和 npx tsc -v 看到版本号。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "TypeScript 的编译器是一个 npm 包，npm 随 Node.js 一起安装。顺序因此固定：先装 Node.js，得到 node 和 npm；再用 npm 装 TypeScript，得到 tsc；最后装编辑器写代码。" },
          { t: "p", text: "三样东西分工不同。Node.js 让 JavaScript 在终端里运行，tsc 靠它执行。TypeScript 包提供 tsc，负责检查类型并生成 .js。VS Code 内置语言服务，负责补全和标红，但只做提示，生成文件仍靠 tsc。" },
          { t: "p", text: "安装位置有两种选择。全局安装 npm install -g typescript，任何目录都能敲 tsc；项目内安装 npm install -D typescript，版本记录在项目里，用 npx tsc 调用。团队协作推荐后者，大家的编译器版本一致。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "在终端里用 tsc 把 .ts 文件编译成 .js，再用 node 运行它。",
            "在 VS Code 里写代码，参数类型不对时立刻看到红色波浪线。",
            "给项目固定一个 TypeScript 版本，换一台机器也能复现同样的编译结果。"
          ]},
          { t: "h2", text: "演示：在 Ubuntu 上装好三样东西" },
          { t: "p", text: "下面按顺序敲：更新软件源、装 Node.js 和 npm、装 VS Code，最后两条看版本号。不同发行版的包名略有差别，思路相同。" },
          { t: "code", lang: "bash", code: `sudo apt update
sudo apt install -y nodejs npm
sudo snap install code --classic
node -v
npm -v` },
          { t: "p", text: "node -v 输出形如 v20.11.0，npm -v 输出形如 10.2.4，看到版本号说明 Node.js 就绪。系统仓库版本偏旧时，可以装 nvm，再执行 nvm install --lts。" },
          { t: "p", text: "接着装 TypeScript。npm install -g typescript 装全局版本，tsc -v 验证；npx tsc -v 优先用项目内版本，没有就临时下载。输出形如 Version 5.4.5 就说明可用。" },
          { t: "code", lang: "bash", code: `npm install -g typescript
tsc -v
npx tsc -v` },
          { t: "p", text: "新建 demo.ts，写入下面两行。在所在目录敲 tsc demo.ts 生成 demo.js，再敲 node demo.js 就能看到输出。tsc 只翻译不运行，node 只运行不检查类型。" },
          { t: "code", lang: "ts", code: `const year: number = 2026;
console.log("TypeScript 课程年份：" + year);` },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250">
  <rect x="40" y="40" width="560" height="170" rx="14" fill="#eef4fb"/>
  <text x="320" y="76" font-size="20" font-weight="700" text-anchor="middle" fill="#17324d">安装链：运行时到编译器</text>
  <rect x="56" y="104" width="120" height="66" rx="10" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="116" y="130" font-size="15" text-anchor="middle" fill="#17324d">Node.js</text>
  <text x="116" y="152" font-size="14" text-anchor="middle" fill="#4d6f67">node 和 npm</text>
  <line x1="180" y1="137" x2="194" y2="137" stroke="#2a6f97" stroke-width="3"/>
  <polygon points="198,137 186,131 186,143" fill="#2a6f97"/>
  <rect x="202" y="104" width="120" height="66" rx="10" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="262" y="130" font-size="15" text-anchor="middle" fill="#17324d">npm 装包</text>
  <text x="262" y="152" font-size="14" text-anchor="middle" fill="#4d6f67">typescript</text>
  <line x1="326" y1="137" x2="340" y2="137" stroke="#2a6f97" stroke-width="3"/>
  <polygon points="344,137 332,131 332,143" fill="#2a6f97"/>
  <rect x="348" y="104" width="120" height="66" rx="10" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="408" y="130" font-size="15" text-anchor="middle" fill="#17324d">tsc 命令</text>
  <text x="408" y="152" font-size="14" text-anchor="middle" fill="#4d6f67">检查并翻译</text>
  <line x1="472" y1="137" x2="486" y2="137" stroke="#2a6f97" stroke-width="3"/>
  <polygon points="490,137 478,131 478,143" fill="#2a6f97"/>
  <rect x="494" y="104" width="120" height="66" rx="10" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="554" y="130" font-size="15" text-anchor="middle" fill="#17324d">VS Code</text>
  <text x="554" y="152" font-size="14" text-anchor="middle" fill="#4d6f67">写代码的界面</text>
  <text x="320" y="192" font-size="14" text-anchor="middle" fill="#4d6f67">安装完成的判据：node -v 与 npx tsc -v 都能输出版本号</text>
</svg>`, caption: "Node.js 是地基，npm 负责搬砖，tsc 是干活的工具，编辑器只是工作面。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "装完敲 node 提示 command not found。多半是 PATH 没刷新，关掉终端重开。",
            "全局装过一版、项目里又装一版，敲 tsc 用的不是你心里的那个。用 which tsc 看实际路径。",
            "npx tsc -v 提示要安装包，这不是报错，是 npx 在临时下载。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "按演示装好三样东西，抄下 node -v 与 npx tsc -v 的输出。",
            "用 which tsc 确认当前用的是全局版本还是项目内版本，说明判断依据。",
            "把 demo.ts 编译成 demo.js，删掉 .ts 只留 .js，确认 node 仍能运行。"
          ]},
          { t: "tip", color: "green", text: "一句话：Node.js 提供运行时，npm 负责装包，tsc 负责检查与翻译，编辑器只是调用它们的界面。" }
        ]
      },
      {
        id: "ts03",
        title: "第 3 课 · 第一个程序：console.log 与类型注解",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：写出第一个 .ts 文件，用 console.log 打印结果，并给变量加上类型注解。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "console.log 是 JavaScript 就有的输出函数，把括号里的值打印到终端或浏览器控制台。在 Node.js 里，它写到标准输出。调试时最直接的观察手段就是它：想知道程序走到哪、某个变量此刻是多少，先打印出来看。" },
          { t: "p", text: "类型注解的写法是「名字: 类型 = 值」，冒号后面写类型，等号后面写值。类型不参与运行，它只在编译阶段被检查，然后被擦掉，生成的 .js 里看不到任何类型标注。所以类型写错不会让程序跑慢，只会让编译不通过。" },
          { t: "p", text: "TypeScript 5 能根据初始值推断类型，let year = 2026 会被推断成 number，所以简单变量可以不写注解。初学阶段建议先写全，让每个值的类型在代码里明明白白，等熟悉之后再依赖推断。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "打印变量的值，确认计算结果和你手算的一致。",
            "打印一段提示，知道程序执行到了哪一步。",
            "给变量标上类型，赋错值时编辑器立刻提示。",
            "在文件开头打印一行，确认这次运行的确实是新编译的版本。"
          ]},
          { t: "h2", text: "演示：从 hello.ts 到终端输出" },
          { t: "p", text: "新建 hello.ts，写下这段代码。前两行声明一个文本变量和一个数字变量，第三行用加号拼出问候语，最后两行打印。" },
          { t: "code", lang: "ts", code: `const userName: string = "小北";
const age: number = 18;
const message: string = "你好，" + userName;
console.log(message);
console.log(age + 1);` },
          { t: "p", text: "在文件所在目录执行 tsc hello.ts，会生成 hello.js；再执行 node hello.js，终端输出两行。直接执行 node hello.ts 会报错，Node.js 默认不认识 .ts 文件，除非额外装运行加载器。" },
          { t: "p", text: "把 age 的值改成 \"18\"，tsc 立刻报错，指出字符串不能赋给 number；把 message 改成 age + 1 也会报错，因为右边是数字。这两次报错都发生在编译阶段，程序一行都没跑。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240">
  <rect x="40" y="40" width="560" height="160" rx="14" fill="#eef4fb"/>
  <text x="320" y="76" font-size="20" font-weight="700" text-anchor="middle" fill="#17324d">先编译，再运行</text>
  <rect x="56" y="104" width="120" height="58" rx="10" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="116" y="129" font-size="15" text-anchor="middle" fill="#17324d">hello.ts</text>
  <text x="116" y="150" font-size="14" text-anchor="middle" fill="#4d6f67">源码</text>
  <line x1="180" y1="133" x2="194" y2="133" stroke="#2a6f97" stroke-width="3"/>
  <polygon points="198,133 186,127 186,139" fill="#2a6f97"/>
  <rect x="202" y="104" width="120" height="58" rx="10" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="262" y="129" font-size="15" text-anchor="middle" fill="#17324d">tsc</text>
  <text x="262" y="150" font-size="14" text-anchor="middle" fill="#4d6f67">检查类型</text>
  <line x1="326" y1="133" x2="340" y2="133" stroke="#2a6f97" stroke-width="3"/>
  <polygon points="344,133 332,127 332,139" fill="#2a6f97"/>
  <rect x="348" y="104" width="120" height="58" rx="10" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="408" y="129" font-size="15" text-anchor="middle" fill="#17324d">hello.js</text>
  <text x="408" y="150" font-size="14" text-anchor="middle" fill="#4d6f67">类型已擦除</text>
  <line x1="472" y1="133" x2="486" y2="133" stroke="#2a6f97" stroke-width="3"/>
  <polygon points="490,133 478,127 478,139" fill="#2a6f97"/>
  <rect x="494" y="104" width="120" height="58" rx="10" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="554" y="129" font-size="15" text-anchor="middle" fill="#17324d">node</text>
  <text x="554" y="150" font-size="14" text-anchor="middle" fill="#4d6f67">执行并输出</text>
</svg>`, caption: "tsc 只产出文件，node 才执行文件；两条命令各管一段。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "直接 node hello.ts。Node.js 默认只认 .js，先 tsc 再 node。",
            "类型写成大写的 String。string 是原始类型，String 是包装对象，两者不等价。",
            "以为 tsc 报错就不生成文件。默认仍会产出 .js，想阻止要开 noEmitOnError。",
            "类型标注用了中文冒号。必须是英文半角的冒号，否则语法不通过。",
            "字符串引号混用。单双引号都行，但同一个文件里保持一种。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "写 hello.ts，打印你的名字和今年年份，编译后用 node 运行。",
            "把某个变量的值改成不匹配的类型，抄下报错原文，再改回来。",
            "用两行 console.log 分别打印一个数字和一个字符串，说明输出有什么不同。"
          ]},
          { t: "tip", color: "green", text: "一句话：console.log 负责让你看见结果，类型注解负责让编译器提前看见错误。" }
        ]
      },
      {
        id: "ts04",
        title: "第 4 课 · 变量与 let/const",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：学会用 let 和 const 声明变量，理解重新赋值与块级作用域，知道什么时候该用哪一个。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "变量是贴在内存上的一张标签。声明一个变量，就是让程序留出一块地方装值，并给这块地方起名字。TypeScript 在 JavaScript 的变量之上多了一件事：这块地方只能装声明时指定的那种类型，换类型要重新声明或显式转换。" },
          { t: "p", text: "let 声明的变量可以重新赋值，const 声明的变量在初始化之后不能再指向别的值。不能重新赋值不等于内容永远不变，const 约束的是这个标签不再换目标；值本身是数字或文本时，也就跟着不能改了。" },
          { t: "p", text: "两者都是块级作用域：变量只在最近的一对大括号里有效，出了大括号就看不见。这比旧的 var 更安全，var 会泄漏到整个函数，在分支里声明的临时变量出了分支还能访问。新代码不要再用 var。" },
          { t: "p", text: "命名只能用字母、数字、下划线和美元符号，不能以数字开头，不能和关键字重名，区分大小写。名字要能读出用途，count 比 c 好，totalPrice 比 tp 好。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "用 const 存不会变的配置，例如税率、站点名。",
            "用 let 存会变的量，例如计数、累计总分。",
            "在大括号内部声明临时变量，出了这块就自动失效。",
            "给中间结果起名，把长表达式拆成几步，方便调试。"
          ]},
          { t: "h2", text: "演示：let 与 const 的差别" },
          { t: "p", text: "下面这段先声明再改值，最后演示块级作用域。注释掉的那行如果放开，tsc 会报无法为常量重新赋值。" },
          { t: "code", lang: "ts", code: `let count: number = 1;
count = count + 1;
console.log(count);

const city: string = "杭州";
// city = "上海";

{
  const note: string = "只在这块里";
  console.log(note);
}
// console.log(note);` },
          { t: "p", text: "count 从 1 变成 2，const 声明的 city 只能读不能改。note 在大括号里声明，出了这块就访问不到，最后一行注释放开会报找不到名字。块级作用域让变量的影响范围刚好停在它该停的地方。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240">
  <rect x="40" y="40" width="560" height="160" rx="14" fill="#eef4fb"/>
  <text x="320" y="76" font-size="20" font-weight="700" text-anchor="middle" fill="#17324d">let 与 const 的约束</text>
  <rect x="64" y="100" width="230" height="66" rx="10" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="179" y="126" font-size="16" text-anchor="middle" fill="#17324d">let count</text>
  <text x="179" y="149" font-size="14" text-anchor="middle" fill="#4d6f67">可以重新赋值</text>
  <rect x="346" y="100" width="230" height="66" rx="10" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="461" y="126" font-size="16" text-anchor="middle" fill="#17324d">const city</text>
  <text x="461" y="149" font-size="14" text-anchor="middle" fill="#4d6f67">不能再换目标</text>
  <text x="179" y="190" font-size="14" text-anchor="middle" fill="#4d6f67">方框是变量，值可以换</text>
  <text x="461" y="190" font-size="14" text-anchor="middle" fill="#4d6f67">方框是变量，目标锁住</text>
</svg>`, caption: "let 的标签可以改贴到新值，const 的标签贴上去就不再移动。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "const 声明时不赋值。常量必须在声明那一行完成初始化。",
            "用 let 声明从不改变的值。不会报错，但 const 更能表达意图。",
            "在同一个作用域重复 let 同名变量。直接报重复声明。",
            "以为 const 对象的属性也不能改。const 锁的是变量指向，不是内容。",
            "继续用 var。它有变量提升和函数作用域，容易出难查的问题。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 const 声明站点名，用 let 声明访问计数，把计数加一并打印。",
            "在一对大括号里声明一个变量，尝试在块外打印它，抄下报错。",
            "把一段用 var 写的旧代码改成 let 或 const，说明每处为什么这样选。"
          ]},
          { t: "tip", color: "green", text: "一句话：let 用于会变的量，const 用于不再改指向的量，两者都只在声明它们的那对大括号里有效。" }
        ]
      },
      {
        id: "ts05",
        title: "第 5 课 · 类型：string、number、boolean",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：认清 string、number、boolean 三种原始类型，会给变量标类型，也能看懂编译器推断出来的类型。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "string 装文本，用单引号或双引号包起来，空字符串也是合法值。number 装数字，整数、小数、负数都用同一种类型，JavaScript 没有单独的整数类型，也没有 float。boolean 只有两个值：true 和 false，通常来自比较表达式。" },
          { t: "p", text: "这三种叫原始类型，它们的值不可变：对字符串做操作只会得到一个新字符串，原值不变。类型标注写小写的 string、number、boolean；大写的 String、Number、Boolean 是包装对象类型，日常几乎不用，写错会让赋值报错。" },
          { t: "p", text: "TypeScript 能从初始值推断类型：let n = 18 推断为 number，let s = \"hi\" 推断为 string。用 let 声明并初始化的变量也会被推断，只是之后仍可按推断出的类型赋新值。推断让代码更短，初学阶段先写全，熟悉之后再依赖推断。" },
          { t: "p", text: "类型不匹配会编译报错，而且不会自动转换。\"18\" 是字符串，18 是数字，两者相加得到 \"1818\" 这种拼接结果，而不是 36。需要数字时用 Number(\"18\") 转换，需要文本时用 String(18) 转换。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "用 string 存名字、地址、提示语。",
            "用 number 存年龄、价格、分数。",
            "用 boolean 存开关状态和判断结果。",
            "把三种类型组合进一条数据，让调用方按形状传值。"
          ]},
          { t: "h2", text: "演示：三种类型各写一个" },
          { t: "p", text: "下面三个变量分别装文本、数字、真假值。最后一行用加号拼接，数字会被转成文本再拼上去。" },
          { t: "code", lang: "ts", code: `const userName: string = "小北";
const age: number = 18;
const isStudent: boolean = true;

console.log(userName);
console.log(age + 1);
console.log(isStudent);
console.log("年龄：" + age);` },
          { t: "p", text: "age + 1 是数字相加，得到 19；「年龄：」 + age 是字符串拼接，得到「年龄：18」。同一个加号，左右类型不同，结果就不同，这也是类型标注值得写的原因之一。" },
          { t: "p", text: "把 isStudent 改成 \"yes\"，tsc 会指出字符串不能赋给 boolean。类型错误的报错会带上文件名和行号，按行号找过去就能改。如果一时不知道写什么类型，可以先标 any，但 any 会让检查失效，等于退回 JavaScript，能不用就不用。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240">
  <rect x="40" y="40" width="560" height="160" rx="14" fill="#eef4fb"/>
  <text x="320" y="76" font-size="20" font-weight="700" text-anchor="middle" fill="#17324d">三种原始类型</text>
  <rect x="56" y="100" width="166" height="70" rx="10" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="139" y="127" font-size="16" text-anchor="middle" fill="#17324d">string</text>
  <text x="139" y="151" font-size="14" text-anchor="middle" fill="#4d6f67">"小北"</text>
  <rect x="237" y="100" width="166" height="70" rx="10" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="320" y="127" font-size="16" text-anchor="middle" fill="#17324d">number</text>
  <text x="320" y="151" font-size="14" text-anchor="middle" fill="#4d6f67">18 / 9.9</text>
  <rect x="418" y="100" width="166" height="70" rx="10" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="501" y="127" font-size="16" text-anchor="middle" fill="#17324d">boolean</text>
  <text x="501" y="151" font-size="14" text-anchor="middle" fill="#4d6f67">true / false</text>
  <text x="320" y="192" font-size="14" text-anchor="middle" fill="#4d6f67">类型的名字写小写，值只在各自的范围内使用</text>
</svg>`, caption: "三种类型各管一类值，写错类型在编译期就会被拦下。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把 \"18\" 当成 18。引号决定它是字符串，相加会拼接。",
            "类型名写成大写 String。多数场景应该用小写的 string。",
            "以为 number 能精确表示所有小数。0.1 + 0.2 的结果并不正好是 0.3。",
            "用字符串 \"false\" 当布尔假值。非空字符串在条件里会被当成真。",
            "到处写 any。检查被关掉，TypeScript 就退化成 JavaScript。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "声明三个变量分别装文本、数字、布尔值，各打印一次。",
            "把数字赋给 string 变量，抄下报错，再改成正确的类型。",
            "用 Number 和 String 各做一次转换，打印转换前后的值。"
          ]},
          { t: "tip", color: "green", text: "一句话：string 装文本、number 装数字、boolean 装真假；写小写类型名，让编译器帮你守住边界。" }
        ]
      },
      {
        id: "ts06",
        title: "第 6 课 · 运算符",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：掌握算术、比较、逻辑三类运算符，分清 = 与 ===，知道加号在字符串上的特殊行为。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "算术运算符有 + - * / %，分别对应加、减、乘、除、取余。JavaScript 的除法不截断小数：5 / 2 得到 2.5，这一点和很多语言不同。% 求余数，10 % 3 是 1，-10 % 3 是 -1，余数的符号跟着被除数。自增自减 ++ 和 -- 把变量加一或减一。" },
          { t: "p", text: "比较运算符 == != > < >= <= 的结果是 boolean。== 只比较值，会在比较前做类型转换，\"5\" == 5 为 true；=== 同时比较类型和值，\"5\" === 5 为 false。写 TypeScript 一律用 === 和 !==，避免隐式转换带来的意外。" },
          { t: "p", text: "逻辑运算符 && || ! 用来组合条件。&& 两边都真才真，|| 有一边真就真，! 取反。它们有短路行为：&& 左边为假就不再算右边，|| 左边为真就不再算右边。所以把便宜的判断放左边，是常见的小优化。" },
          { t: "p", text: "赋值运算符 = 把右边的值装进左边的变量，+= -= *= /= 是复合写法，x += 1 等价于 x = x + 1。字符串的 + 是拼接，\"a\" + 1 得到 \"a1\"，数字会被转成文本。优先级上，先算乘除、再算加减，不确定就加括号。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "算总价、平均分、折扣和余数。",
            "比较两个值，得到 true 或 false 交给条件使用。",
            "把多个条件组合成一条判断，例如年龄够并且已登录。",
            "用 += 累加分数，少写一遍变量名。"
          ]},
          { t: "h2", text: "演示：三类运算符各跑一遍" },
          { t: "p", text: "下面这段把算术、比较、逻辑各放几行。读的时候先自己算一遍，再对照正文里的结果。" },
          { t: "code", lang: "ts", code: `const a: number = 10;
const b: number = 3;

console.log(a + b);
console.log(a / b);
console.log(a % b);
console.log(a > b);
console.log(a > 5 && b > 5);
console.log("得分：" + a);

let total: number = 0;
total += a;
console.log(total);` },
          { t: "p", text: "输出依次是 13、3.333...、1、true、false、「得分：10」、10。a / b 没有截断，a % b 是 1；&& 两边都要真，b > 5 为假，所以整条为假。" },
          { t: "p", text: "把 a / b 打印出来会看到很长的小数，这是二进制浮点的表示方式，不是算错。比较两个浮点数是否相等时，通常比较它们的差是否小于一个很小的数。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240">
  <rect x="40" y="40" width="560" height="160" rx="14" fill="#eef4fb"/>
  <text x="320" y="76" font-size="20" font-weight="700" text-anchor="middle" fill="#17324d">表达式是一棵树</text>
  <rect x="256" y="96" width="128" height="44" rx="8" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="320" y="123" font-size="17" text-anchor="middle" fill="#17324d">+</text>
  <rect x="120" y="164" width="128" height="42" rx="8" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="184" y="190" font-size="15" text-anchor="middle" fill="#17324d">3</text>
  <rect x="392" y="164" width="150" height="42" rx="8" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="467" y="190" font-size="15" text-anchor="middle" fill="#17324d">4 * 2 先算</text>
  <line x1="300" y1="140" x2="198" y2="160" stroke="#2a6f97" stroke-width="2.5"/>
  <line x1="340" y1="140" x2="442" y2="160" stroke="#2a6f97" stroke-width="2.5"/>
</svg>`, caption: "先算括号和乘除，再算加减；不确定优先级时用括号写明。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把 = 当成比较。if (x = 1) 是赋值，而且结果恒为真。",
            "用 == 比较。类型不同时会隐式转换，结果常常反直觉。",
            "以为 5 / 2 得 2。JavaScript 会保留小数，要取整得用 Math.floor。",
            "用 === 直接比较两个浮点数。0.1 + 0.2 不等于 0.3。",
            "混用 && 和 || 不加括号。优先级容易记错，加括号最稳。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用两个数字变量算出加、减、乘、除、取余五个结果并打印。",
            "分别用 == 和 === 比较字符串 \"5\" 与数字 5，打印两个结果并解释差别。",
            "写一条包含 && 和 || 的条件，改变其中一个变量的值，观察结果变化。"
          ]},
          { t: "tip", color: "green", text: "一句话：算术算数值、比较出真假、逻辑组合条件；判断相等用 ===，字符串加号是拼接。" }
        ]
      },
      {
        id: "ts07",
        title: "第 7 课 · if 条件",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：会写 if 让程序按条件执行，理解条件表达式、大括号和缩进在 TypeScript 里的写法。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "if 的作用是条件成立才执行这一段。写法是 if (条件) { 代码 }：圆括号里放一个能算出真或假的表达式，大括号里放条件成立时要执行的语句。条件通常是比较运算或逻辑运算，结果类型是 boolean。" },
          { t: "p", text: "TypeScript 里 if 的条件并没有强制必须是 boolean，其他类型的值也会按 JavaScript 的规则转成真假：0、空字符串、null、undefined、NaN 算假，其余算真。但依赖这套规则会让代码难读，条件尽量写成明确的比较表达式。" },
          { t: "p", text: "大括号包住的是语句块。即使只有一行代码，也建议写大括号：以后往里加第二行时不会因为漏掉大括号而出错。缩进只是给人看的，真正决定范围的是大括号，所以格式要统一。" },
          { t: "p", text: "条件为假时，整个语句块被跳过，程序接着执行 if 后面的下一行。跳过不是报错，也不是退出函数，后面的代码照常运行。理解这一点，才能预判程序在两种情况下各打印什么。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "分数达到及格线才打印通过。",
            "库存大于零才允许下单。",
            "用户已登录才显示个人资料。",
            "先把条件算成一个 boolean 变量，再拿它做判断。"
          ]},
          { t: "h2", text: "演示：分数够不够" },
          { t: "p", text: "下面这段定义一个分数，条件成立就打印及格，然后无论成立与否都打印检查结束。" },
          { t: "code", lang: "ts", code: `const score: number = 72;

if (score >= 60) {
  console.log("及格");
}
console.log("检查结束");` },
          { t: "p", text: "score 是 72，条件成立，先打印及格，再打印检查结束。把 score 改成 50，第一行不打印，第二行仍然打印，因为它在 if 的大括号外面。" },
          { t: "p", text: "试一个组合条件：if (score >= 60 && score < 90) 只在及格且不到优秀时成立。括号先算，&& 再组合，读的时候从里往外读。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260">
  <rect x="40" y="40" width="560" height="180" rx="14" fill="#eef4fb"/>
  <text x="320" y="74" font-size="20" font-weight="700" text-anchor="middle" fill="#17324d">条件只决定这一段走不走</text>
  <polygon points="320,100 400,140 320,180 240,140" fill="#ffffff" stroke="#2a6f97" stroke-width="2.5"/>
  <text x="320" y="145" font-size="14" text-anchor="middle" fill="#17324d">分数够 60 吗</text>
  <line x1="400" y1="140" x2="464" y2="140" stroke="#2a6f97" stroke-width="3"/>
  <polygon points="468,140 456,134 456,146" fill="#2a6f97"/>
  <text x="434" y="128" font-size="14" text-anchor="middle" fill="#4d6f67">是</text>
  <rect x="476" y="116" width="100" height="48" rx="8" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="526" y="145" font-size="14" text-anchor="middle" fill="#17324d">打印及格</text>
  <path d="M320 180V210H112" stroke="#7fa99f" stroke-width="2.5"/>
  <text x="248" y="202" font-size="14" text-anchor="middle" fill="#4d6f67">否，直接往下</text>
</svg>`, caption: "条件为真走右边打印，为假就绕过语句块继续往下。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "if 条件后面加分号。if (x > 0); 会让 if 只管一个空语句，后面的代码永远执行。",
            "该用 === 的地方用了 =，条件变成赋值。",
            "条件里写字符串 \"false\"，非空字符串会被当成真。",
            "只写一行就省略大括号，后来加代码时出错。",
            "把 if 当成循环用。if 只判断一次，不会重复。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "写一个 if，分数大于等于 60 时打印及格，用 72 和 50 各跑一次。",
            "把条件改成 score >= 60 && score < 90，分别用 72、95、40 测试并记录输出。",
            "故意在 if 条件后面加分号，运行后解释为什么大括号里的代码总会执行。"
          ]},
          { t: "tip", color: "green", text: "一句话：if 只在条件为真时执行大括号里的代码，条件为假就跳过，后面的语句照常运行。" }
        ]
      },
      {
        id: "ts08",
        title: "第 8 课 · else 与分支",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：用 else 补上条件不成立时的去处，用 else if 写出多档分支，并知道判断顺序为什么重要。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "if 只回答成立时做什么，else 回答不成立时做什么。else 必须紧跟在一个 if 的右大括号后面，不能单独出现。两段代码互斥，每次只会执行其中一段。" },
          { t: "p", text: "多档判断用 else if 串起来：从上往下依次检查，哪一条先为真就执行哪一条，执行完直接跳出整条链，后面的条件不再看。最后可以跟一个 else 兜底，处理所有没命中的情况。" },
          { t: "p", text: "顺序决定结果。把宽松的条件写在前面，严格的条件就永远轮不到。例如先判断分数大于等于 60，再判断大于等于 90，95 分会在第一条就被拦下，拿不到优秀。写分支时先想清楚区间怎么划分，再按从严格到宽松排列。" },
          { t: "p", text: "else 不是错误处理。它只是另一个正常分支，不会捕获异常，也不会接收错误信息。真正的错误处理要靠函数的返回值或异常机制，后面单独一课讲函数时再展开。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "成绩分及格与不及格两档。",
            "成绩分优秀、及格、不及格三档。",
            "按登录状态显示不同的首页内容。",
            "给没有命中任何条件的情况准备一个兜底分支。"
          ]},
          { t: "h2", text: "演示：从两档到三档" },
          { t: "p", text: "先看两档。score 是 50，if 不成立，程序进入 else 打印不及格，两段只会走一段。" },
          { t: "code", lang: "ts", code: `const score: number = 50;

if (score >= 60) {
  console.log("及格");
} else {
  console.log("不及格");
}` },
          { t: "p", text: "再看三档。85 先和 90 比，不成立；再和 60 比，成立，打印及格，最后的 else 不再看。" },
          { t: "code", lang: "ts", code: `const score2: number = 85;

if (score2 >= 90) {
  console.log("优秀");
} else if (score2 >= 60) {
  console.log("及格");
} else {
  console.log("不及格");
}` },
          { t: "p", text: "把两个条件调换顺序，85 的结果不变，但 95 会从优秀变成及格。所以严格条件必须放在宽松条件前面，这是分支最常见的逻辑错误。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240">
  <rect x="40" y="40" width="560" height="160" rx="14" fill="#eef4fb"/>
  <text x="320" y="74" font-size="20" font-weight="700" text-anchor="middle" fill="#17324d">从上往下，命中一条就停</text>
  <rect x="56" y="98" width="140" height="50" rx="8" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="126" y="128" font-size="14" text-anchor="middle" fill="#17324d">90 分以上</text>
  <line x1="200" y1="123" x2="214" y2="123" stroke="#2a6f97" stroke-width="2.5"/>
  <polygon points="218,123 206,117 206,129" fill="#2a6f97"/>
  <rect x="226" y="98" width="140" height="50" rx="8" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="296" y="128" font-size="14" text-anchor="middle" fill="#17324d">60 分以上</text>
  <line x1="370" y1="123" x2="384" y2="123" stroke="#2a6f97" stroke-width="2.5"/>
  <polygon points="388,123 376,117 376,129" fill="#2a6f97"/>
  <rect x="396" y="98" width="140" height="50" rx="8" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="466" y="128" font-size="14" text-anchor="middle" fill="#17324d">其余情况</text>
  <text x="126" y="178" font-size="14" text-anchor="middle" fill="#4d6f67">优秀</text>
  <text x="296" y="178" font-size="14" text-anchor="middle" fill="#4d6f67">及格</text>
  <text x="466" y="178" font-size="14" text-anchor="middle" fill="#4d6f67">不及格</text>
</svg>`, caption: "判断按顺序排队，第一条命中后整条链就结束。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "else 另起一行。类型检查不会报错，但保持 } else { 的写法更整齐。",
            "else if 顺序写反，宽松条件挡住严格条件。",
            "以为 else 一定会执行。前面任一分支命中，else 就跳过。",
            "在 else 里又重复一遍前面的条件。直接写 else 就行。",
            "分支越写越深。超过三层就该考虑拆函数或提前返回。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "写 if 与 else，让 50 分打印不及格、60 分打印及格，两组都跑。",
            "写三档分支，分别用 95、75、40 跑，记录每档输出。",
            "故意把 60 分的判断放到 90 分前面，用 95 跑一次，说明结果错在哪里。"
          ]},
          { t: "tip", color: "green", text: "一句话：else 接住条件不成立的情况，else if 从上往下排队，先命中的分支执行完就跳出整条链。" }
        ]
      },
      {
        id: "ts09",
        title: "第 9 课 · for 循环",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：用 for 让一段代码重复执行，掌握三段式的三个部分，以及 break 与 continue 的区别。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "for 的写法是 for (初始化; 条件; 更新) { 循环体 }。初始化在循环开始前执行一次；每轮先判断条件，为真就执行循环体，再执行更新，然后回到条件；条件为假时循环结束。" },
          { t: "p", text: "循环变量通常从 0 开始，因为计数习惯和后面的下标都从 0 起。条件写 i < n 会刚好执行 n 次；写成 i <= n 会多执行一次。这个差一是循环里最常见的错误，写之前先数清楚要跑几次。" },
          { t: "p", text: "break 立刻结束整个循环，跳到循环后面的第一行；continue 只结束本轮，跳过循环体里剩下的语句，直接执行更新并进入下一轮判断。两者通常配合 if 使用。" },
          { t: "p", text: "循环体里不要手动修改循环变量。i 由更新表达式负责推进，手动再改容易跳过某些值，甚至让条件永远成立，变成死循环。需要提前结束时用 break，不要靠改 i 来绕。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "把一句提示打印固定次数。",
            "遍历 1 到 100，逐个累加求和。",
            "找到第一个满足条件的数就停下。",
            "按编号批量处理一组任务。"
          ]},
          { t: "h2", text: "演示：打印与累加" },
          { t: "p", text: "下面这段让 i 从 1 走到 5，每轮打印一次。条件用 i <= 5，所以 5 也会被打印。" },
          { t: "code", lang: "ts", code: `for (let i: number = 1; i <= 5; i++) {
  console.log(i);
}` },
          { t: "p", text: "接着做累加：sum 从 0 开始，每轮把 i 加进去，循环结束后打印总和。1 到 100 的和是 5050。" },
          { t: "code", lang: "ts", code: `let sum: number = 0;

for (let i: number = 1; i <= 100; i++) {
  sum += i;
}
console.log(sum);` },
          { t: "p", text: "最后看提前退出。下面从 1 数到 10，遇到 4 就 break，输出只有 1、2、3；把 break 换成 continue，4 被跳过，5 到 10 仍会打印。" },
          { t: "code", lang: "ts", code: `for (let i: number = 1; i <= 10; i++) {
  if (i === 4) {
    break;
  }
  console.log(i);
}` },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260">
  <rect x="40" y="40" width="560" height="180" rx="14" fill="#eef4fb"/>
  <text x="320" y="74" font-size="20" font-weight="700" text-anchor="middle" fill="#17324d">for 的三段与回路</text>
  <rect x="52" y="108" width="112" height="52" rx="8" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="108" y="139" font-size="14" text-anchor="middle" fill="#17324d">i 从 1 起</text>
  <rect x="188" y="108" width="130" height="52" rx="8" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="253" y="139" font-size="14" text-anchor="middle" fill="#17324d">i 到 5 了吗</text>
  <rect x="342" y="108" width="112" height="52" rx="8" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="398" y="139" font-size="14" text-anchor="middle" fill="#17324d">打印 i</text>
  <rect x="478" y="108" width="96" height="52" rx="8" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="526" y="139" font-size="14" text-anchor="middle" fill="#17324d">i 加一</text>
  <line x1="164" y1="134" x2="184" y2="134" stroke="#2a6f97" stroke-width="2.5"/>
  <line x1="318" y1="134" x2="338" y2="134" stroke="#2a6f97" stroke-width="2.5"/>
  <line x1="454" y1="134" x2="474" y2="134" stroke="#2a6f97" stroke-width="2.5"/>
  <path d="M526 160V204H253V164" stroke="#7fa99f" stroke-width="2.5"/>
  <text x="390" y="196" font-size="14" text-anchor="middle" fill="#4d6f67">回到条件</text>
</svg>`, caption: "初始化只走一次，条件每轮判一次，循环体和更新每轮各走一次。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "条件写成 i <= n 却从 0 开始，结果多跑一次。",
            "忘了 i++。条件一直成立，程序进入死循环。",
            "在循环体里改 i。循环的推进节奏被打乱。",
            "break 和 continue 搞混。break 出整个循环，continue 只跳本轮。",
            "循环里重复拼接大字符串。数据量大时开销明显，先收集再处理。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 for 打印 1 到 10，再改成只打印偶数。",
            "用循环算 1 到 100 的和，打印结果。",
            "写一个从 1 数到 10 的循环，遇到 4 用 break 停下，再把 break 换成 continue 对比输出。"
          ]},
          { t: "tip", color: "green", text: "一句话：for 用初始化、条件、更新三段控制重复次数，break 结束整个循环，continue 只跳过本轮。" }
        ]
      },
      {
        id: "ts10",
        title: "第 10 课 · while 循环",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：用 while 写出条件为真就一直转的循环，知道它和 for 各自适合什么场景，以及怎么避免死循环。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "while 的写法是 while (条件) { 循环体 }。每轮开始先判断条件，为真就执行循环体，再回到条件；为假就结束。它没有单独的初始化位置和更新位置，这两件事要自己写在循环前后和循环体里。" },
          { t: "p", text: "for 适合次数已知的循环，三段式把起点、终点、步长写在一行；while 适合次数未知、只知道停下来的条件的循环，例如一直读输入直到读到空行，或者不断处理队列直到队列为空。" },
          { t: "p", text: "while 最容易出死循环：条件里用到的变量必须在循环体内被改变，而且方向要朝条件不成立的方向走。写完之后检查一遍：哪一行让条件最终变假？找不到这一行，程序就会一直转。" },
          { t: "p", text: "需要至少执行一次的场景，可以先把第一轮的动作写在循环外，再用 while 判断是否继续。这样比在循环里补判断更直观，也能避免条件一开始就为假导致一次都不执行。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "倒数计时，从某个数一直减到 0。",
            "不断读入一行内容，直到读到空行。",
            "反复尝试某个操作，直到成功或次数用完。",
            "处理一个待办队列，直到队列为空。"
          ]},
          { t: "h2", text: "演示：倒数与累加" },
          { t: "p", text: "下面从 3 开始倒数，每轮打印当前值再减一，减到 0 时条件为假，循环结束。" },
          { t: "code", lang: "ts", code: `let n: number = 3;

while (n > 0) {
  console.log(n);
  n--;
}
console.log("起飞");` },
          { t: "p", text: "n-- 是让条件最终变假的那一行，删掉它程序就不停了。循环结束后打印起飞，这一行在循环外面。" },
          { t: "p", text: "再看一个累加的例子：只要 i 小于等于 100 就继续加，i 在循环体里自增。它和 for 版本做的是同一件事，只是控制变量写在不同的位置。" },
          { t: "code", lang: "ts", code: `let i: number = 1;
let sum: number = 0;

while (i <= 100) {
  sum += i;
  i++;
}
console.log(sum);` },
          { t: "p", text: "循环体里可以配合 break 提前退出，例如找到目标值就停。但不要用 while (true) 再加一个永远不满足的条件，那是最难排查的死循环写法。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260">
  <rect x="40" y="40" width="560" height="180" rx="14" fill="#eef4fb"/>
  <text x="320" y="74" font-size="20" font-weight="700" text-anchor="middle" fill="#17324d">while 的回路</text>
  <rect x="248" y="96" width="144" height="50" rx="8" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="320" y="126" font-size="14" text-anchor="middle" fill="#17324d">条件为真吗</text>
  <rect x="250" y="180" width="140" height="44" rx="8" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="320" y="208" font-size="14" text-anchor="middle" fill="#17324d">执行循环体</text>
  <line x1="320" y1="146" x2="320" y2="176" stroke="#2a6f97" stroke-width="2.5"/>
  <polygon points="320,180 314,170 326,170" fill="#2a6f97"/>
  <text x="336" y="168" font-size="14" text-anchor="middle" fill="#4d6f67">是</text>
  <path d="M390 202H470V121H396" stroke="#7fa99f" stroke-width="2.5"/>
  <text x="470" y="168" font-size="14" text-anchor="middle" fill="#4d6f67">改条件变量</text>
  <path d="M248 121H150V222H240" stroke="#7fa99f" stroke-width="2.5"/>
  <text x="182" y="168" font-size="14" text-anchor="middle" fill="#4d6f67">否，结束</text>
</svg>`, caption: "条件为真进循环体，循环体改写条件变量，再回到条件重新判断。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "循环体里忘了改条件变量，条件永远为真。",
            "更新方向写反，例如条件 n > 0 却每轮 n 加一。",
            "在循环里重新声明同名变量，外层条件变量其实没变。",
            "while 条件后面加分号，循环体变成空语句。",
            "用浮点数做循环条件，累加误差让条件迟迟不结束。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用 while 从 5 倒数到 1，打印完再打印开始。",
            "用 while 算 1 到 50 的和，打印结果。",
            "写一个 while，条件用浮点数递减，观察它是否按预期停下，并解释原因。"
          ]},
          { t: "tip", color: "green", text: "一句话：while 每轮先看条件，条件为真才执行；循环体里必须有让条件最终变假的那一步。" }
        ]
      },
      {
        id: "ts11",
        title: "第 11 课 · 函数与参数类型",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：会把一段逻辑写成函数，给参数和返回值标类型，并知道 return 与 void 各自的作用。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "函数是起好名字的一段代码。声明写法是 function 名字(参数: 类型): 返回类型 { 函数体 }。调用时把实参传进去，函数体执行完，用 return 把结果交回来。调用处拿到的就是返回值，可以直接打印或继续参与计算。" },
          { t: "p", text: "参数类型决定调用方必须传什么。add(a: number, b: number) 只能接收两个数字，传字符串会在编译期报错。返回类型写在参数列表的右括号后面，它约束函数体每条 return 的值，写错或不写都会报错。" },
          { t: "p", text: "函数没有返回值时，返回类型写 void，函数体里可以不写 return；如果写了 return，后面不能跟值。有返回类型的函数，每条执行路径都必须有 return，否则编译器会指出不是所有路径都有返回值。" },
          { t: "p", text: "参数名只在函数体内有效，和外面的变量互不影响。函数体里声明的变量也在函数结束时消失。把一段逻辑抽成函数，最大的收益不是少写几行，而是给它起了名字，读代码的人不用每次重读实现。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "把求平均分的计算抽出来，多处复用。",
            "把格式化提示语封装起来，统一措辞。",
            "给一段复杂计算起名，让主流程更好读。",
            "把主程序拆小，每段只做一件事。"
          ]},
          { t: "h2", text: "演示：带类型的加法函数" },
          { t: "p", text: "先写一个最小的函数：接收两个数字，返回它们的和。调用时把结果直接交给 console.log。" },
          { t: "code", lang: "ts", code: `function add(a: number, b: number): number {
  return a + b;
}

console.log(add(2, 3));` },
          { t: "p", text: "add 的参数和返回值都标了 number，add(2, 3) 得到 5。把调用改成 add(\"2\", 3)，tsc 会指出第一个参数类型不对，而不用等到运行时才发现结果变成了字符串拼接。" },
          { t: "p", text: "再看一个没有返回值的函数。greet 只负责打印，返回类型写 void，函数体里没有 return。调用它只是为了产生输出，不需要接收结果。" },
          { t: "code", lang: "ts", code: `function greet(name: string): void {
  console.log("你好，" + name);
}

greet("小北");` },
          { t: "p", text: "把 greet 的返回类型改成 string，编译立刻报错，因为函数体没有 return 一个字符串。返回类型不是注释，它和函数体必须对得上。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240">
  <rect x="40" y="40" width="560" height="160" rx="14" fill="#eef4fb"/>
  <text x="320" y="74" font-size="20" font-weight="700" text-anchor="middle" fill="#17324d">调用函数：参数进去，结果出来</text>
  <rect x="50" y="106" width="128" height="58" rx="10" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="114" y="132" font-size="14" text-anchor="middle" fill="#17324d">add(2, 3)</text>
  <text x="114" y="153" font-size="14" text-anchor="middle" fill="#4d6f67">调用</text>
  <line x1="182" y1="135" x2="202" y2="135" stroke="#2a6f97" stroke-width="3"/>
  <polygon points="206,135 194,129 194,141" fill="#2a6f97"/>
  <rect x="210" y="106" width="140" height="58" rx="10" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="280" y="132" font-size="14" text-anchor="middle" fill="#17324d">a 是 2，b 是 3</text>
  <text x="280" y="153" font-size="14" text-anchor="middle" fill="#4d6f67">参数按顺序传入</text>
  <line x1="354" y1="135" x2="374" y2="135" stroke="#2a6f97" stroke-width="3"/>
  <polygon points="378,135 366,129 366,141" fill="#2a6f97"/>
  <rect x="382" y="106" width="120" height="58" rx="10" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="442" y="132" font-size="14" text-anchor="middle" fill="#17324d">return a + b</text>
  <text x="442" y="153" font-size="14" text-anchor="middle" fill="#4d6f67">函数体计算</text>
  <line x1="506" y1="135" x2="526" y2="135" stroke="#2a6f97" stroke-width="3"/>
  <polygon points="530,135 518,129 518,141" fill="#2a6f97"/>
  <text x="576" y="132" font-size="15" text-anchor="middle" fill="#17324d">5</text>
  <text x="576" y="153" font-size="14" text-anchor="middle" fill="#4d6f67">返回值</text>
</svg>`, caption: "实参按位置交给形参，函数体算完由 return 把结果交回调用处。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "参数只写名字不写类型。函数参数没有初始值可推断，必须显式标注。",
            "有返回类型却漏写 return。不是所有路径都有返回值。",
            "返回类型写 void 却 return 了一个值。",
            "调用时参数个数不对。TypeScript 会检查数量和类型。",
            "函数名起得太泛，例如 doIt。名字要说明它做什么。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "写 add(a, b)，两个参数和返回值都标 number，在下面调用并打印结果。",
            "写一个返回类型为 void 的函数，只打印一行提示，调用它。",
            "故意把参数传成字符串，抄下报错；再删掉函数里的 return，抄下第二条报错。"
          ]},
          { t: "tip", color: "green", text: "一句话：函数把一段逻辑起名、收参数、返结果；参数和返回值都标上类型，调用处就不会传错。" }
        ]
      },
      {
        id: "ts12",
        title: "第 12 课 · 数组与元组",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：用数组存一组同类型的数据，用元组存位置和类型都固定的少量值，并分清两者的长度约束。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "数组是一串按位置排列的值，类型写法是 number[]，表示每个元素都是数字。数组长度可变，用 push 往末尾加，用 length 读当前个数，下标从 0 开始。" },
          { t: "p", text: "TypeScript 会检查数组元素类型。声明 number[] 之后，push 字符串会编译报错，读出来的元素也能按数字使用。空数组要标类型，严格模式下 const list = [] 会被推断成 never[]，后面 push 什么都报错。" },
          { t: "p", text: "元组是长度固定、每个位置类型可以不同的数组。写法是 [string, number]，第一个位置必须是文本，第二个必须是数字，长度就是 2。它适合表示一条结构固定的小数据，例如名字加年龄、横纵坐标。" },
          { t: "p", text: "元组也能按下标读，point[0] 的类型由位置决定。给元组越界赋值会报错，因为那个位置不存在。元组不是万能容器：元素多、含义会变时，数组的按位置取值就不够清楚，应该换一种能按名字取值的结构。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "用数组存一组成绩，随时追加和读取。",
            "用数组保存一批名字，按下标取第一个。",
            "用元组表示一个坐标，两个位置都是数字。",
            "用元组表示一条名字加年龄的记录。"
          ]},
          { t: "h2", text: "演示：数组的增改查" },
          { t: "p", text: "下面声明一个数字数组，追加一个元素，读长度和第一个元素，再改掉第一个元素。数组的长度会随着 push 变化。" },
          { t: "code", lang: "ts", code: `const scores: number[] = [90, 85, 77];
scores.push(100);

console.log(scores.length);
console.log(scores[0]);

scores[0] = 95;
console.log(scores);` },
          { t: "p", text: "输出依次是 4、90、[95, 85, 77, 100]。push 返回新长度，但通常只关心数组本身。下标从 0 开始，访问不存在的下标不会在编译期报错，运行时得到 undefined，使用前要确认范围。" },
          { t: "p", text: "再看元组。point 的两个位置都必须是数字，pair 的第一个位置是文本、第二个是数字，顺序写反就会报错。" },
          { t: "code", lang: "ts", code: `const point: [number, number] = [3, 4];
console.log(point[0] + point[1]);

const pair: [string, number] = ["小北", 18];
console.log(pair[0], pair[1]);` },
          { t: "p", text: "把 pair 写成 [18, \"小北\"]，编译器会指出第一项应为 string。把 point 的第三个位置赋值，也会因为没有这个位置而报错。元组把第几项是什么类型也纳入了检查。" },
          { t: "svg", code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260">
  <rect x="40" y="40" width="560" height="180" rx="14" fill="#eef4fb"/>
  <text x="320" y="74" font-size="20" font-weight="700" text-anchor="middle" fill="#17324d">数组与元组的形状</text>
  <text x="160" y="112" font-size="15" font-weight="700" text-anchor="middle" fill="#17324d">number[] 长度可变</text>
  <rect x="56" y="128" width="60" height="44" rx="6" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="86" y="156" font-size="14" text-anchor="middle" fill="#17324d">90</text>
  <rect x="120" y="128" width="60" height="44" rx="6" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="150" y="156" font-size="14" text-anchor="middle" fill="#17324d">85</text>
  <rect x="184" y="128" width="60" height="44" rx="6" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="214" y="156" font-size="14" text-anchor="middle" fill="#17324d">77</text>
  <rect x="248" y="128" width="60" height="44" rx="6" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="278" y="156" font-size="14" text-anchor="middle" fill="#17324d">100</text>
  <text x="160" y="196" font-size="14" text-anchor="middle" fill="#4d6f67">可以继续追加</text>
  <text x="470" y="112" font-size="15" font-weight="700" text-anchor="middle" fill="#17324d">[string, number] 长度固定</text>
  <rect x="382" y="128" width="100" height="44" rx="6" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="432" y="156" font-size="14" text-anchor="middle" fill="#17324d">小北</text>
  <rect x="486" y="128" width="100" height="44" rx="6" fill="#ffffff" stroke="#2a6f97" stroke-width="2"/>
  <text x="536" y="156" font-size="14" text-anchor="middle" fill="#17324d">18</text>
  <text x="470" y="196" font-size="14" text-anchor="middle" fill="#4d6f67">位置与类型都定死</text>
</svg>`, caption: "数组每个位置同类型、长度可增长；元组每个位置类型固定、长度不能变。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "空数组不标类型，严格模式下被推断成 never[]，之后 push 报错。",
            "数组下标越界。编译器不检查具体下标，运行时得到 undefined。",
            "把元组当数组用，随意 push 超出长度的元素。",
            "元组类型顺序写反。位置类型必须和声明一致。",
            "用数组存不同含义的字段。读的时候分不清哪一项是什么，改用能按名字取值的结构。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "声明一个 number[]，push 两个数，打印长度和第一个元素。",
            "声明一个 [string, number] 元组，打印两个位置的值。",
            "故意给元组多赋一个位置，抄下报错，说明元组和数组的长度差别。"
          ]},
          { t: "tip", color: "green", text: "一句话：数组长度可变、元素同类型；元组长度固定、每个位置各有类型，越界和顺序写错都会报错。" }
        ]
      }
    ]
  }
};
