window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["webdev-c03"] = [
  { t: `tip`, color: `blue`, text: `本课目标：搞清楚读屏器读的不是你的页面而是它的无障碍树，然后学会用语义标签、焦点和文案把这条树搭对。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `浏览器解析 HTML 时除了渲染树还会生成一棵无障碍树（accessibility tree），每个节点带上角色、名字、状态。读屏器、放大镜、语音控制走的都是这棵树，不是屏幕像素。差别很实际：一个 button 元素自带「按钮」角色和「可按下」状态，一个装了点击事件的 div 在树上只是个无名分组，读屏器念出来是空白停顿，键盘按 Tab 也停不住它。所以无障碍不是额外功能，是你写的标签在树上留下了什么。` },
  { t: `p`, text: `判断标准是 WCAG 的四个词：可感知（信息不能只靠颜色或图像传达）、可操作（所有功能键盘也能走完）、可理解（结构和文案能被预期）、健壮（不同辅助技术都读得出来）。经验值是：把语义标签用对，七成问题自动没了；剩下三成才是 ARIA 的活。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250" font-family="sans-serif"><text x="320" y="20" font-size="15" text-anchor="middle" fill="#22314e">同一个「按钮」，两棵树</text><rect x="16" y="40" width="280" height="42" rx="6" fill="#fdf0e6" stroke="#c2732b"/><text x="156" y="58" font-size="14" text-anchor="middle" fill="#5c3410">DIV 加点击事件</text><text x="156" y="75" font-size="14" text-anchor="middle" fill="#5c3410">role 无、name 无、不可聚焦</text><rect x="344" y="40" width="280" height="42" rx="6" fill="#e8f6ee" stroke="#3d9a63"/><text x="484" y="58" font-size="14" text-anchor="middle" fill="#1d4230">BUTTON 元素</text><text x="484" y="75" font-size="14" text-anchor="middle" fill="#1d4230">自带 role、name、按下状态</text><line x1="156" y1="82" x2="156" y2="112" stroke="#8896ad" stroke-width="2"/><line x1="484" y1="82" x2="484" y2="112" stroke="#8896ad" stroke-width="2"/><rect x="16" y="112" width="280" height="58" rx="6" fill="#fff8f3" stroke="#c2732b"/><text x="156" y="135" font-size="14" text-anchor="middle" fill="#5c3410">无障碍树：generic</text><text x="156" y="155" font-size="14" text-anchor="middle" fill="#5c3410">Tab 跳过 / 读屏念成静音</text><rect x="344" y="112" width="280" height="58" rx="6" fill="#f2fbf5" stroke="#3d9a63"/><text x="484" y="135" font-size="14" text-anchor="middle" fill="#1d4230">无障碍树：button「提交」</text><text x="484" y="155" font-size="14" text-anchor="middle" fill="#1d4230">Tab 停住 / Enter 与空格可触发</text><line x1="156" y1="170" x2="156" y2="200" stroke="#8896ad" stroke-width="2"/><line x1="484" y1="170" x2="484" y2="200" stroke="#8896ad" stroke-width="2"/><rect x="16" y="200" width="280" height="38" rx="6" fill="#f7f7fa" stroke="#6b6b85"/><text x="156" y="224" font-size="14" text-anchor="middle" fill="#2b2b3d">用户只能靠鼠标点中它</text><rect x="344" y="200" width="280" height="38" rx="6" fill="#f7f7fa" stroke="#6b6b85"/><text x="484" y="224" font-size="14" text-anchor="middle" fill="#2b2b3d">键盘、读屏、语音都走得通</text></svg>`, caption: `左边那一列不是「样式不同」，是在辅助技术里根本不存在。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `让闭眼用屏幕阅读器的人知道这一页有几个区、现在在哪个区`,
    `让只有键盘的人 Tab 到任何可操作的东西，并且看得见自己停在哪`,
    `让色觉差异的人不靠颜色也能分辨状态（成功、报错、选中）`,
    `顺手把搜索引擎的抓取质量提高——它读的也是这棵树`,
    `把「提交失败」这件事说清楚：哪个字段、为什么、怎么改`
  ] },
  { t: `h2`, text: `演示 1 · 语义标签是免费的无障碍` },
  { t: `code`, lang: `html`, code: `<header>站点横幅</header>\n<nav aria-label="主导航">\n  <a href="/practice" aria-current="page">练习</a>\n</nav>\n<main id="main">\n  <article>\n    <h1>无障碍清单</h1>\n  </article>\n</main>\n<footer>版权信息</footer>` },
  { t: `p`, text: `header、nav、main、footer 在树上直接成为地标（landmark），读屏器有专门快捷键在地标间跳，第一行还要给键盘用户留一个 skip 链接直达 main，否则每个 Tab 用户都得把导航里几十个链接走一遍才碰到正文。aria-current 把「你在这」写进状态，而不是只画个颜色。` },
  { t: `h2`, text: `演示 2 · 标题层级就是页面目录` },
  { t: `code`, lang: `html`, code: `<h1>打字练习</h1>\n  <h2>规则</h2>\n  <h2>计时</h2>\n    <h3>倒计时</h3>\n    <h3>暂停</h3>` },
  { t: `p`, text: `读屏器可以只念标题、像翻目录一样跳着走，超过一半的用户靠这个找内容。两条规矩：一页一个 h1，不许跳级——h2 直接跳到 h4 在目录里就断了一截。想改视觉大小请用 CSS 改字号，别为了「字大一点」去换标签编号，那是把目录搞坏。` },
  { t: `h2`, text: `演示 3 · 焦点必须看得见` },
  { t: `code`, lang: `css`, code: `/* 很多人第一件事就是把它删掉，这是最贵的一个 reset */` +
`\n:focus-visible {` +
`\n  outline: 3px solid #145da0;` +
`\n}` +
`\n\n.skip {` +
`\n  position: absolute;` +
`\n  left: -9999px;` +
`\n}` +
`\n.skip:focus {` +
`\n  left: 8px;` +
`\n}` },
  { t: `p`, text: `focus-visible 比 hover 更重要：鼠标用户从来不需要焦点环，键盘用户离了它就是在盲走。隐藏 skip 链接用的是移出屏幕而不是 display none——后者会把元素从焦点序列里彻底删掉，等于没写。弹窗打开时还要把 Tab 圈在弹窗内并记下触发它的元素，关闭后焦点得还回去，不然键盘用户会被丢在页面中段。` },
  { t: `h2`, text: `演示 4 · 表单与报错` },
  { t: `code`, lang: `html`, code: `<fieldset>\n  <legend>通知方式</legend>\n  <label for="email">邮箱</label>\n  <input id="email" name="email" type="email"\n         aria-describedby="email-err" required>\n  <p id="email-err" role="alert">邮箱缺少 @，例：you@example.com</p>\n</fieldset>` },
  { t: `p`, text: `label 和 input 的连接靠 for 对上 id，点文字也能选中输入框，读屏器念出字段名才有依据—— placeholder 不能代替它，用户一输入它就消失。报错要写「哪里错了、怎么改」，只弹一句「格式不正确」等于让人猜。role 是 alert 时读屏器会立刻打断播报，而不是等用户自己找到那段文字。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `自动化报告 100 分就收工：工具只能查出一部分问题，键盘走一遍和读屏听一遍才是有效验证`,
    `给 div 加 role 是按钮：角色有了，键盘可聚焦、Enter 与空格触发还得你自己实现——直接用 button`,
    `只靠颜色区分状态：绿点红点在高对比模式和色觉差异下是同一个灰点，必须再加文字或图标`,
    `alt 写成「图片」或把装饰图当内容念：装饰图用空 alt 让读屏器跳过，图表这类复杂图要给长描述`,
    `aria-label 堆太多：读屏器会逐条念，噪声一大多余信息反而挤掉了真正要说的`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `找一个只有 div 加点击事件的导航，改成语义标签，再用 DevTools 的 Accessibility 面板对比改动前后的无障碍树`,
    `只用键盘（Tab、Shift+Tab、Enter、空格、方向键、Esc）走完你上一个页面，列出卡住的三处`,
    `把某页的报错文案从「输入有误」改成演示 4 那种具体提示，并说明 role 的作用`,
    `拿演示 2 检查你写过的一个页面：数一数 h1 有几个、层级有没有断`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：无障碍不是给页面加一层补丁，是决定辅助技术读到的到底是结构还是一堆无名方块。` }
];
