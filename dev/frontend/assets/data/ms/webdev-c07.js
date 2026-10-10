window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["webdev-c07"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把数组的下标规则和三种循环各自的适用场合对上，顺便看清 off-by-one 是怎么产生的。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `数组是一串按顺序编号的格子，编号从 0 开始，最后一个的下标是 length 减一。这不是历史怪癖：下标本质是「距离开头的偏移量」，偏移量当然从 0 数起。由此得出两个必须背的结果：arr[0] 是第一个，arr[arr.length] 一定是 undefined，因为那个位置在数组外面。` },
  { t: `p`, text: `循环是把这个偏移量一次次加一的写法。for 适合「明确知道要跑几次」，条件写在头部，三件事（起始、终止、步进）挨在一起便于核对；while 适合「不知道跑几次，只知道什么时候该停」，风险是停止条件永远不变就死循环；for of 和 forEach 把下标藏起来，只管读值，读不到下标也就改不了原数组。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240" font-family="sans-serif"><text x="320" y="20" font-size="15" text-anchor="middle" fill="#22314e">一个五项数组，i 从 0 走到 4</text><rect x="40" y="44" width="110" height="46" fill="#eef4ff" stroke="#5b7fd1"/><text x="95" y="72" font-size="14" text-anchor="middle" fill="#22314e">Chocolate</text><rect x="150" y="44" width="110" height="46" fill="#eef4ff" stroke="#5b7fd1"/><text x="205" y="72" font-size="14" text-anchor="middle" fill="#22314e">Strawberry</text><rect x="260" y="44" width="110" height="46" fill="#eef4ff" stroke="#5b7fd1"/><text x="315" y="72" font-size="14" text-anchor="middle" fill="#22314e">Vanilla</text><rect x="370" y="44" width="110" height="46" fill="#eef4ff" stroke="#5b7fd1"/><text x="425" y="72" font-size="14" text-anchor="middle" fill="#22314e">Pistachio</text><rect x="480" y="44" width="110" height="46" fill="#eef4ff" stroke="#5b7fd1"/><text x="535" y="72" font-size="14" text-anchor="middle" fill="#22314e">Rocky Road</text><text x="95" y="112" font-size="14" text-anchor="middle" fill="#6b7c93">0</text><text x="205" y="112" font-size="14" text-anchor="middle" fill="#6b7c93">1</text><text x="315" y="112" font-size="14" text-anchor="middle" fill="#6b7c93">2</text><text x="425" y="112" font-size="14" text-anchor="middle" fill="#6b7c93">3</text><text x="535" y="112" font-size="14" text-anchor="middle" fill="#6b7c93">4</text><rect x="40" y="120" width="110" height="24" fill="#fff2b8" stroke="#c2732b"/><text x="95" y="137" font-size="14" text-anchor="middle" fill="#5c3410">i = 0</text><text x="595" y="137" font-size="14" fill="#5c3410">length = 5</text><text x="600" y="67" font-size="14" fill="#a5321f">!</text><text x="320" y="176" font-size="14" text-anchor="middle" fill="#3d4c66">循环条件写 i &lt; arr.length，跑五次：0、1、2、3、4</text><text x="320" y="198" font-size="14" text-anchor="middle" fill="#a5321f">写成 i &lt;= arr.length 会多跑一次，读到的正是数组外面那个 undefined</text><text x="320" y="222" font-size="14" text-anchor="middle" fill="#3d4c66">arr[5] 从来没被分配过，JavaScript 不报错，它只是给你一个 undefined</text></svg>`, caption: `越界不报错是这个语言的默认行为，所以「多跑一圈」只能靠条件本身来防。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `装下一组同类数据：一排成绩、一屏单词、一列高分`,
    `一次遍历算出总量、最大值、平均值，不用手抄七遍`,
    `按下标改某一项、加一项、去一项，列表随操作变化`,
    `配合循环生成界面：把数组里的每一项变成页面上的一行`
  ] },
  { t: `h2`, text: `演示 1 · 建、读、改` },
  { t: `code`, lang: `javascript`, code: `const flavors = ["Chocolate", "Strawberry", "Vanilla", "Pistachio", "Rocky Road"];` +
`\nflavors[0];              // Chocolate：第一个` +
`\nflavors[2];              // Vanilla：第三个` +
`\nflavors[4] = "Butter Pecan";   // 改已有的一项` +
`\nflavors[5] = "Cookie Dough";   // 按下标往后加一项` +
`\nflavors.length;          // 6：属性，不带括号` +
`\n` +
`\nflavors.push("Mint");    // 尾部加，length 自动跟` +
`\nflavors.pop();           // 尾部删，返回被删的值` +
`\nflavors.unshift("First"); // 头部加，全体下标后移` +
`\nflavors.indexOf("Vanilla"); // 2：找不到给 -1` +
`\nflavors.includes("Vanilla"); // true：判存在用这个` },
  { t: `p`, text: `const 锁的是绑定不是内容（上一课那条），照样能 push。unshift 是全体挪位，长列表里代价不小；判断「有没有」要用 includes，因为 indexOf 找不到时给的 -1 是个真值，直接 if (indexOf) 判断永远成立。` },
  { t: `h2`, text: `演示 2 · for 循环遍历` },
  { t: `code`, lang: `javascript`, code: `const scores = [85, 92, 78, 96, 88];` +
`\nlet total = 0;` +
`\nlet highest = scores[0];` +
`\n` +
`\nfor (let i = 0; i < scores.length; i++) {` +
`\n  total += scores[i];` +
`\n  if (scores[i] > highest) highest = scores[i];` +
`\n}` +
`\nconsole.log("平均 " + (total / scores.length).toFixed(1));` +
`\nconsole.log("最高 " + highest);` },
  { t: `p`, text: `起始值取 scores[0] 而不是 0，这是求最大值的关键：万一全是负数，从 0 起算会得到一个数组里根本不存在的数。循环里把 length 缓存成变量是早年的习惯，现代引擎不需要，但边遍历边增删元素时它确实会变——那种情况下更该改的是写法。` },
  { t: `h2`, text: `演示 3 · while 与不确定次数` },
  { t: `code`, lang: `javascript`, code: `let input = "";` +
`\nlet attempts = 0;` +
`\nconst maxAttempts = 3;` +
`\n` +
`\nwhile (input !== "quit" && attempts < maxAttempts) {` +
`\n  input = prompt("输入 quit 退出");` +
`\n  attempts++;            // 忘了这行就是死循环` +
`\n}` +
`\nconsole.log(attempts >= maxAttempts ? "次数用完" : "已退出");` },
  { t: `p`, text: `while 的全部风险都在步进那行：条件里出现的变量必须在循环体里被改变，否则永远为真，浏览器直接卡住。两个停止条件用 && 捆住，是「既要没退出也要没超次数」——任何一个不满足就停。` },
  { t: `h2`, text: `演示 4 · 三种现代遍历` },
  { t: `code`, lang: `javascript`, code: `const colors = ["red", "green", "blue", "yellow"];` +
`\n` +
`\nfor (const color of colors) {        // 只要值，不写下标` +
`\n  console.log(color);` +
`\n}` +
`\ncolors.forEach((color, index) => {   // 值和下标都要` +
`\n  console.log(index + ": " + color);` +
`\n});` +
`\n` +
`\nfor (let i = colors.length - 1; i >= 0; i--) {   // 倒着走` +
`\n  console.log(colors[i]);` +
`\n}` },
  { t: `p`, text: `for of 和 forEach 都没法在循环里改原数组的项，也都不理会提前退出（forEach 里写 break 直接语法错误，想中途停就退回 for）。倒序遍历那一段常用于「一边遍历一边删」，因为从后往前删不会打乱还没走到的下标。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `下标从 1 开始或条件写成小于等于 length：多出来的那一次读到 undefined，报错却指向别的行`,
    `while 的步进写在条件之外，某条分支跳过了它：整页冻结`,
    `在遍历中 push 或删除元素：length 一直在变，循环次数和你想的不是一回事`,
    `用 indexOf 的结果判存在：-1 是真值，条件永远成立，该用 includes`,
    `把数组当类型混装：一个数组里又放名字又放年龄又放标志位，第 10 行之后没人知道 arr[2] 是什么——那是对象该干的活`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `给一个成绩数组，一次遍历同时算出总分、最高分、最低分（提示：起始值取数组第一项）`,
    `把演示 2 改成倒序遍历，并在遍历中删掉低于 80 的项，观察下标怎么变`,
    `写一个 while：反复要求输入，直到长度超过 8 位或者放弃 3 次，两条停止条件都要走到`,
    `把同一个数组分别用 for、for of、forEach 走一遍，说出哪种写法能在循环里改原数组`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：下标从 0 数起，length 是格子数不是最后一个下标——把这两句记住，越界问题少掉一半。` }
];
