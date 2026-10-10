window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["webdev-c11"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把前十课的东西拼成一个能跑的小游戏——一次按键从事件对象走到屏幕上的那格绿色，中间每一步都要说清是谁在做。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `这类程序不是「一段跑到底」，而是「先摆好状态，然后被事件推着走」。开局做的事只有一件：把目标文本拆成一格一格，记下当前该打第几格。之后每次键盘事件都只推进一小步：读出用户按的字符，和当前格比对，改那一格的类名，把指针往后挪一格，再判断是不是打完了。循环不存在于代码里，它存在于用户的手上——这就是事件驱动和第 7 课那种 for 循环的根本区别。` },
  { t: `p`, text: `计时不能靠循环数：没有人按键的时候时间照样在走，所以记的是两个时间戳（第一次按键的时刻、结束的时刻），速度是算出来的而不是量出来的。屏幕上「实时更新」的代价也要认——每改一次 DOM 浏览器就要重排重绘一次，所以只改变了的那一格，不重画整句。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250" font-family="sans-serif"><text x="320" y="20" font-size="15" text-anchor="middle" fill="#22314e">一次按键在程序里走过的六站</text><rect x="14" y="46" width="120" height="46" rx="6" fill="#eef4ff" stroke="#5b7fd1"/><text x="74" y="66" font-size="14" text-anchor="middle" fill="#22314e">键盘按下</text><text x="74" y="84" font-size="14" text-anchor="middle" fill="#22314e">浏览器打包 event</text><rect x="154" y="46" width="120" height="46" rx="6" fill="#e8f6ee" stroke="#3d9a63"/><text x="214" y="66" font-size="14" text-anchor="middle" fill="#1d4230">冒泡到 document</text><text x="214" y="84" font-size="14" text-anchor="middle" fill="#1d4230">keydown 监听器</text><rect x="294" y="46" width="120" height="46" rx="6" fill="#fdf0e6" stroke="#c2732b"/><text x="354" y="66" font-size="14" text-anchor="middle" fill="#5c3410">读 e.key</text><text x="354" y="84" font-size="14" text-anchor="middle" fill="#5c3410">它是 shift 还是 a</text><rect x="434" y="46" width="192" height="46" rx="6" fill="#f2f2f7" stroke="#6b6b85"/><text x="530" y="66" font-size="14" text-anchor="middle" fill="#2b2b3d">和目标文本当前格比对</text><text x="530" y="84" font-size="14" text-anchor="middle" fill="#2b2b3d">决定加 correct 还是 incorrect</text><line x1="134" y1="69" x2="152" y2="69" stroke="#8896ad" stroke-width="2"/><line x1="274" y1="69" x2="292" y2="69" stroke="#8896ad" stroke-width="2"/><line x1="414" y1="69" x2="432" y2="69" stroke="#8896ad" stroke-width="2"/><rect x="14" y="112" width="330" height="60" rx="6" fill="#ffffff" stroke="#3d4c66"/><text x="24" y="134" font-size="14" fill="#3d4c66">T y p i n g   i s   f u n</text><text x="24" y="154" font-size="14" fill="#6b7c93">每一格是一个 span，指针 index 停在第 3 格</text><rect x="364" y="112" width="262" height="60" rx="6" fill="#f7f8fb" stroke="#c7d0de"/><text x="374" y="134" font-size="14" fill="#3d4c66">只有第 3 格换 class，其余不动</text><text x="374" y="154" font-size="14" fill="#8a5a10">index 加一；打完最后一格算总时刻</text><line x1="530" y1="92" x2="530" y2="112" stroke="#3d9a63" stroke-width="2"/><text x="320" y="200" font-size="14" text-anchor="middle" fill="#3d4c66">速度不是数出来的，是拿两个时间戳相减再折算的</text><text x="320" y="226" font-size="14" text-anchor="middle" fill="#8a5a10">第一次按键时记下 start；结束时用 Date.now() 减它 —— 没人按键的那段等待也算进去了</text></svg>`, caption: `看左边那条格子带：界面状态和程序状态是同一份数据，改一格就是改一个 span 的类名。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `把「用户输入 → 判断 → 反馈」这条链跑顺，以后做任何交互界面都是这一套`,
    `练字符串与数组的基本功：拆字、按下标取、比对、数对了几格`,
    `练时间：知道什么时候该记时间戳，什么时候该用 setTimeout`,
    `练 DOM 的克制写法：改类名而不是重画整段，页面不闪也不卡`
  ] },
  { t: `h2`, text: `演示 1 · 把目标句子铺成一格一格` },
  { t: `code`, lang: `javascript`, code: `const quotes = ["Typing is fun", "Practice makes perfect", "One key at a time"];` +
`\nconst quote = quotes[Math.floor(Math.random() * quotes.length)];` +
`\nconst display = document.getElementById("words");` +
`\ndisplay.textContent = "";              // 清空上一局留下的格子` +
`\nfor (const ch of quote) {` +
`\n  const cell = document.createElement("span");` +
`\n  cell.className = "letter";` +
`\n  cell.textContent = ch;` +
`\n  display.appendChild(cell);` +
`\n}` },
  { t: `p`, text: `随机取一条是两步：先拿 0 到条数之间的浮点数，再 floor 成整数下标（第 7 课那个「下标是偏移量」在这里就是用处）。拆句子用 for of，因为只需要值不需要下标；而下面比对时需要的恰恰是下标——同一个数组，两种遍历按需求选。` },
  { t: `h2`, text: `演示 2 · 监听键盘，逐格比对` },
  { t: `code`, lang: `javascript`, code: `let index = 0, correct = 0, start = 0;      // 三个状态` +
`\nconst cells = document.querySelectorAll(".letter");` +
`\ndocument.addEventListener("keydown", (e) => {` +
`\n  if (e.key.length !== 1) return;             // 忽略 Shift、方向键这类功能键` +
`\n  if (!start) start = Date.now();             // 第一次按键才起表` +
`\n  const ok = e.key === quote[index];` +
`\n  cells[index].classList.add(ok ? "correct" : "incorrect");` +
`\n  if (ok) correct++;` +
`\n  index++;` +
`\n});` },
      { t: `p`, text: `第一道判断 e.key.length 是关键：功能键的 key 是 Shift、Enter 这种长名字，单字符才是真打字。挂到 document 而不是某个输入框（上一课那条冒泡），好处是不需要用户先聚焦，代价是要自己忽略不相关的键。类名交给 CSS 上色，脚本不碰任何颜色值。` },
  { t: `h2`, text: `演示 3 · 收尾与算速度` },
  { t: `code`, lang: `javascript`, code: `if (index === quote.length) {` +
`\n  const seconds = (Date.now() - start) / 1000;` +
`\n  const minutes = seconds / 60;` +
`\n  const wpm = Math.round(correct / 5 / minutes);` +
`\n  const accuracy = Math.round(correct / quote.length * 100);` +
`\n  document.getElementById("result").textContent =` +
`\n    wpm + " 词/分，准确率 " + accuracy + "%";` +
`\n}` },
      { t: `p`, text: `每分钟词数按惯例是「字符数除以 5 再除以分钟」，不除 5 得到的数字会高得离谱。准确率用对了的格数除以总格数——写在这里而不是靠颜色数，是因为颜色会被重复点击污染，数据只有一份。` },
  { t: `h2`, text: `演示 4 · 重开一局` },
  { t: `code`, lang: `javascript`, code: `document.getElementById("restart").addEventListener("click", () => {` +
`\n  index = 0;` +
`\n  correct = 0;` +
`\n  start = 0;` +
`\n  newQuote();               // 重新铺格子，旧的一格不留` +
`\n});` },
  { t: `p`, text: `状态重置必须做全：三个变量漏掉一个，第二局就从半路开始，而这种 bug 只出现在「玩过一局之后」，第一次测试永远看不出来。铺格子前先清空容器（演示 1 那句 textContent），否则旧的十四格和新的叠在一起，指针早就错位了。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `监听器挂在循环里反复添加：一局结束后再开一局，一次按键被处理两次`,
    `没忽略功能键：按一下 Shift 就错一格，用户看不出自己哪里打错了`,
    `每次比对都重画整个句子：改一格类名变成重建几十个节点，页面开始卡`,
    `拿 setTimeout 当计时器累加毫秒：后台标签页里定时器会被节流，时间越走越不准`,
    `大小写直接比：按住 Shift 打出大写 A，和目标里的小写 a 判成错——先统一再比`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把演示 2 改成同一格里允许反复试错，但只有第一次的结果算分`,
    `给游戏加倒计时：时间到就停止接收按键，说出你用的是 setTimeout 还是时间戳`,
    `让正确率低于某个阈值时换一条更短的句子，写出这个判断放在哪一站最合适`,
    `把功能键 e.key 的名字都打印一遍，列出你必须忽略的那几个`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：交互程序的核心是一句「当前该打第几格」——状态放在外面，事件只做推进，界面才不会被重画拖死。` }
];
