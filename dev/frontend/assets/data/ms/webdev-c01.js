window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["webdev-c01"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把「写程序」这件事拆回它本来的样子——给一台只认 0 和 1 的机器写清楚的步骤，再看懂这套翻译链上的四个工具位。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `程序不是「让电脑变聪明」，是一份不许含糊的工序单。你描述「把红色按钮按两秒」，电脑不会猜你说的是哪个红色按钮，它只会照字面执行。所以编程的第一项技能不是语法，是把自己脑子里那步跳过去的地方补全。给一个从没写过代码的人讲清楚「怎么把一张表按成绩从高到低排」，讲到他无法再问「然后呢」，你就写出了一段程序。` },
  { t: `p`, text: `语言是这中间的翻译层。低级语言（汇编、C）离硬件近，你要自己管寄存器和地址，换来的代价是换一种 CPU 就得重写，好处是快和可控；高级语言（JavaScript、Python、C#）让你按人的思路写，把机器话交给翻译器处理。翻译器分两种：编译型在运行前一次性把源码翻成机器码，出错在启动前就报给你；解释型边读边翻，JavaScript 走的就是这条路——这也是为什么它在浏览器里能改一行刷新就看到效果。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250" font-family="sans-serif"><rect x="200" y="14" width="240" height="40" rx="6" fill="#eef4ff" stroke="#5b7fd1"/><text x="320" y="39" font-size="15" text-anchor="middle" fill="#22314e">你要机器做的一件事</text><line x1="290" y1="54" x2="176" y2="92" stroke="#8896ad" stroke-width="2"/><line x1="350" y1="54" x2="464" y2="92" stroke="#8896ad" stroke-width="2"/><rect x="52" y="92" width="230" height="64" rx="6" fill="#e8f6ee" stroke="#3d9a63"/><text x="167" y="116" font-size="15" text-anchor="middle" fill="#1d4230">高级语言 JavaScript</text><text x="167" y="138" font-size="14" text-anchor="middle" fill="#1d4230">写人的思路，机器话交给翻译器</text><rect x="360" y="92" width="230" height="64" rx="6" fill="#fdf0e6" stroke="#c2732b"/><text x="475" y="116" font-size="15" text-anchor="middle" fill="#5c3410">低级语言 汇编 / C</text><text x="475" y="138" font-size="14" text-anchor="middle" fill="#5c3410">自己管寄存器与地址，换硬件重写</text><line x1="167" y1="156" x2="286" y2="196" stroke="#8896ad" stroke-width="2"/><line x1="475" y1="156" x2="354" y2="196" stroke="#8896ad" stroke-width="2"/><rect x="200" y="196" width="240" height="40" rx="6" fill="#f2f2f7" stroke="#6b6b85"/><text x="320" y="221" font-size="15" text-anchor="middle" fill="#2b2b3d">同一串 0 和 1，同一个结果</text><text x="167" y="180" font-size="14" text-anchor="middle" fill="#6b7c93">编译 / 解释</text><text x="475" y="180" font-size="14" text-anchor="middle" fill="#6b7c93">直接逼近机器</text></svg>`, caption: `两条路终点相同：差别不在能不能跑，在于谁来承担从人到机器的那段翻译量。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `把一件每天重复的手活交给机器：改名一百个文件、把一列数字求和、按时抓取一段数据`,
    `把一个想法变成别人能点开看的东西——网页是目前最便宜的「做出来就能分享」的载体`,
    `看懂报错而不是绕开它：报错说的是哪一行、它期望什么，读两条就成习惯`,
    `判断一件事该用什么语言：界面交互落在 JavaScript，算数与爬取落在 Python，性能与硬件落在 C 系`
  ] },
  { t: `h2`, text: `演示 1 · 语句与变量` },
  { t: `code`, lang: `javascript`, code: `const siteName = "天气面板";   // 定了就不该变，用 const` +
`\nlet currentWeather = "晴";      // 会随运行改，用 let` +
`\nlet temperature = 75;` +
`\nlet isRaining = false;` +
`\n\nconst weather = { location: "杭州", humidity: 65, windSpeed: 12 };` +
`\nconsole.log(siteName + "：今天" + currentWeather + "，" + temperature + "°F");` +
`\nconsole.log("风速 " + weather.windSpeed + " mph");` +
`\n\ncurrentWeather = "多云";` +
`\ntemperature = 68;` },
      { t: `p`, text: `语句是一次动作，变量是给动作留下的可复用名字，取名字这件事决定了三个月后的你读不读得懂它。const 和 let 的区分不是洁癖：写成 let 就是告诉后来人「这个值会变」，写成 const 是承诺「不会」，能省掉一次全文搜索。点号取值背后的对象是后面单独一课的主角，这里先建立手感。` },
  { t: `h2`, text: `演示 2 · 控制流：让程序分岔` },
  { t: `code`, lang: `javascript`, code: `const age = 17;` +
`\nconst hasPermission = true;` +
`\n\nif (age >= 18 && hasPermission) {` +
`\n  console.log("可以直接入场");` +
`\n} else if (age >= 16) {` +
`\n  console.log("需要家长同意");` +
`\n} else {` +
`\n  console.log("未满 16 岁，谢绝");` +
`\n}` +
`\n\nconst status = age >= 18 ? "可投票" : "还差 " + (18 - age) + " 年";` },
      { t: `p`, text: `分支的价值在于最后那个兜底：else 或者 switch 的 default 没写，程序遇到没料到的输入就一路走下去，什么也不说。上面 if 链里 && 把两个条件捆在一起，捆的条件越多，越容易出现「两个都成立却没人管」的那一格——判断本身怎么写才不出洞，后面有一整课专门讲它。` },
  { t: `h2`, text: `演示 3 · 同一个任务的两份写法` },
  { t: `code`, lang: `javascript`, code: `function fibonacci(count) {` +
`\n  const seq = [0, 1];` +
`\n  for (let i = 2; i < count; i++) {` +
`\n    seq[i] = seq[i - 1] + seq[i - 2];` +
`\n  }` +
`\n  return seq;` +
`\n}` +
`\n` +
`\nconsole.log(fibonacci(10));   // 0, 1, 1, 2, 3, 5, 8, 13, 21, 34` },
      { t: `p`, text: `同一个斐波那契数列，ARM 汇编要写二十来行：申请只读代码段、把 0 和 1 塞进 r0 和 r1、用 r4 计数、每次相加后把结果存到 r2 指的地址再把 r2 往前挪四个字节、比较计数、跳回标签。逻辑完全一样，读起来像密码本。差别只有一件事：这段翻译负担落在你身上，还是落在语言身上。` },
  { t: `h2`, text: `演示 4 · 工具链上的四个位置` },
  { t: `code`, lang: `javascript`, code: `// 在浏览器控制台里逐条粘贴，页面会立刻跟着变` +
`\ndocument.title = "我的第一个页面";` +
`\ndocument.body.style.backgroundColor = "lightblue";` +
`\nconsole.log(document.querySelectorAll("p").length);` +
`\n// 报错长这样，读它别跳过：` +
`\n// ReferenceError: currentWeather is not defined` },
      { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 210" font-family="sans-serif"><rect x="12" y="70" width="140" height="58" rx="6" fill="#eef4ff" stroke="#5b7fd1"/><text x="82" y="95" font-size="15" text-anchor="middle" fill="#22314e">编辑器 / IDE</text><text x="82" y="115" font-size="14" text-anchor="middle" fill="#22314e">高亮、补全、调试</text><rect x="182" y="70" width="150" height="58" rx="6" fill="#e8f6ee" stroke="#3d9a63"/><text x="257" y="95" font-size="15" text-anchor="middle" fill="#1d4230">浏览器 DevTools</text><text x="257" y="115" font-size="14" text-anchor="middle" fill="#1d4230">Elements、Console、Network</text><rect x="362" y="70" width="130" height="58" rx="6" fill="#fdf0e6" stroke="#c2732b"/><text x="427" y="95" font-size="15" text-anchor="middle" fill="#5c3410">命令行</text><text x="427" y="115" font-size="14" text-anchor="middle" fill="#5c3410">npm、脚本、部署</text><rect x="522" y="70" width="106" height="58" rx="6" fill="#f2f2f7" stroke="#6b6b85"/><text x="575" y="95" font-size="15" text-anchor="middle" fill="#2b2b3d">文档</text><text x="575" y="115" font-size="14" text-anchor="middle" fill="#2b2b3d">MDN 为准</text><line x1="152" y1="99" x2="180" y2="99" stroke="#8896ad" stroke-width="2"/><line x1="332" y1="99" x2="360" y2="99" stroke="#8896ad" stroke-width="2"/><line x1="492" y1="99" x2="520" y2="99" stroke="#8896ad" stroke-width="2"/><text x="82" y="152" font-size="14" text-anchor="middle" fill="#6b7c93">写</text><text x="257" y="152" font-size="14" text-anchor="middle" fill="#6b7c93">看它真实发生了什么</text><text x="427" y="152" font-size="14" text-anchor="middle" fill="#6b7c93">批量与自动化</text><text x="575" y="152" font-size="14" text-anchor="middle" fill="#6b7c93">查它到底规定成什么</text><text x="320" y="24" font-size="15" text-anchor="middle" fill="#22314e">一行代码从写下到跑通，要经过的四个位置</text></svg>`, caption: `四个位置各管一段：编辑器管写，DevTools 管看运行时真相，命令行管批量，文档管「标准到底怎么说」。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `想先把十种语言的语法背熟再动手：语法是查询得到的东西，卡住你的是不会拆解问题`,
    `变量全用 let，或者全用 var：前者读代码时看不出哪个值会变，后者有作用域提升的历史毛病，现代代码一律 const 优先、要改才用 let`,
    `条件不写兜底分支：真实数据里总有第三种情况，没写就等于交给程序默默放行`,
    `只在浏览器里试通过就收工：Chrome 没问题不代表 Safari 和 Firefox 一样，跨浏览器测试不是可选项`,
    `把报错原样贴给别人却不写自己试了什么：跳过读报错这一步，学多久都还在同一层`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `用中文写一份「泡一碗面」的工序单，要求严格到不能有任何一步需要猜，然后按演示 1 的写法把它翻译成语句`,
    `打开浏览器的 DevTools，用 Console 把当前页面标题、背景色和一个段落数量改成你想看的值，再说明这些改动为什么刷新就没了`,
    `拿演示 2 的入场判断改成你自己的规则，故意喂一个你没写分支的年龄值，观察程序说了什么`,
    `把演示 3 的函数改成「给定上限，输出不超过该上限的所有斐波那契数」，改动控制在五行以内`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：语言的差别不是能力差别，是谁来背那段从人到 0 和 1 的翻译——你写的每一行都在做这个选择。` }
];
