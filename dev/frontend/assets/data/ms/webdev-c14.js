window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["webdev-c14"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把「慢」拆成两类——页面 load 得慢和代码跑得慢，各有一套看法和改法；顺手把扩展的后台任务和动态图标接通。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `代码跑得慢这件事有具体的物理原因：主线程一帧只有约 16.7 毫秒（一秒六十格），这一格里要依次做完脚本、算样式、排布局、画像素。四步里任何一步吃掉太多，后面的步就挤到下一帧，肉眼看到的是动画一顿、点击半天不理你。前一步还拖累后一步也是常态：脚本里读一次位置、改一次宽度、再读一次位置，浏览器被迫来回排版，这就是「布局抖」的成因。` },
  { t: `p`, text: `加载慢则是另一笔账：字节数、请求数、能不能并行。图片是最大的那块，尺寸给得比显示区大一倍、格式选错，几百千字节就白花；请求数多在于每个文件都要走一遍握手，所以打包与压缩有意义；缓存和条件请求决定第二次打开快不快。看这两类问题分别用 DevTools 的 Network 面板和 Performance 面板——前者看谁来得晚，后者看谁占住了线程。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250" font-family="sans-serif"><text x="320" y="20" font-size="15" text-anchor="middle" fill="#22314e">一帧 16.7 毫秒里的四步</text><line x1="20" y1="150" x2="620" y2="150" stroke="#8896ad" stroke-width="2"/><rect x="30" y="112" width="90" height="38" fill="#eef4ff" stroke="#5b7fd1"/><text x="75" y="136" font-size="14" text-anchor="middle" fill="#22314e">脚本</text><rect x="124" y="112" width="80" height="38" fill="#e8f6ee" stroke="#3d9a63"/><text x="164" y="136" font-size="14" text-anchor="middle" fill="#1d4230">样式</text><rect x="208" y="112" width="80" height="38" fill="#fdf0e6" stroke="#c2732b"/><text x="248" y="136" font-size="14" text-anchor="middle" fill="#5c3410">布局</text><rect x="292" y="112" width="90" height="38" fill="#f2f2f7" stroke="#6b6b85"/><text x="337" y="136" font-size="14" text-anchor="middle" fill="#2b2b3d">绘制</text><text x="400" y="136" font-size="14" fill="#3d4c66">还剩时间，输入照常被响应</text><rect x="30" y="44" width="352" height="38" fill="#ffd7d2" stroke="#a5321f"/><text x="206" y="68" font-size="14" text-anchor="middle" fill="#7a1f10">一个循环把所有步都挤走 —— 长任务</text><line x1="382" y1="82" x2="382" y2="150" stroke="#a5321f" stroke-width="2" stroke-dasharray="4 3"/><text x="392" y="100" font-size="14" fill="#a5321f">这一帧超支，画面停在旧内容</text><text x="392" y="120" font-size="14" fill="#a5321f">期间的点击排队，手感就是「卡」</text><text x="20" y="182" font-size="14" fill="#3d4c66">改法不是「少画一点」，而是别让一段代码独占线程：</text><text x="20" y="204" font-size="14" fill="#3d4c66">把长任务切成小块，每块之间让出线程；把不急着显示的推迟到真要用时。</text><text x="20" y="230" font-size="14" fill="#8a5a10">Performance 面板里的火焰图看的就是这件事：横条越长的那一格，越该被切开。</text></svg>`, caption: `同一帧的两种排布：上面那条长横条就是「点了没反应」的全部原因。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `把一个数字变成看得见的反馈：污染程度换成图标颜色`,
    `让扩展在你不点它的时候也做事：后台脚本常驻，等消息、等事件`,
    `把一次大数据处理变成能中断的活：切成片，边跑边让页面保持响应`,
    `读面板而不是猜：知道慢在哪一段，才谈得上改`
  ] },
  { t: `h2`, text: `演示 1 · 后台收消息，改图标` },
  { t: `code`, lang: `javascript`, code: `// 页面这一侧：算完数据通知后台` +
`\nchrome.runtime.sendMessage({` +
`\n  action: "updateIcon",` +
`\n  value: { color: "green" }` +
`\n});` +
`\n` +
`\n// 后台那一侧：接住并换图标` +
`\nchrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {` +
`\n  if (msg.action === "updateIcon") {` +
`\n    chrome.action.setIcon({ imageData: drawIcon(msg.value) });` +
`\n  }` +
`\n});` },
      { t: `p`, text: `两边隔着一层世界（第 12 课那条），所以只能传纯数据：字符串、数字、普通对象。把函数或者 DOM 节点塞进消息，序列化的时候就没了——这是扩展开发里最常见的「消息看着发了、那边什么也没发生」。` },
  { t: `h2`, text: `演示 2 · 用画布现画一个图标` },
  { t: `code`, lang: `javascript`, code: `function drawIcon(value) {` +
`\n  const canvas = new OffscreenCanvas(128, 128);   // 不在页面上，纯离屏` +
`\n  const ctx = canvas.getContext("2d");` +
`\n  ctx.beginPath();` +
`\n  ctx.arc(64, 64, 54, 0, 2 * Math.PI);           // 圆心、半径、整圈` +
`\n  ctx.fillStyle = value.color;` +
`\n  ctx.fill();` +
`\n  return ctx.getImageData(0, 0, 128, 128);        // 交回像素` +
`\n}` },
      { t: `p`, text: `六个颜色各存一张 png 也行，但那是六份资源和六次改动；画一个圆只要一个函数和一条数据。OffscreenCanvas 的意义在于它不往 DOM 里塞节点（第 10 课那句「改 DOM 要重排重绘」在这儿被绕开了），后台脚本里没有页面可画，它也正好能用。` },
  { t: `h2`, text: `演示 3 · 把数值分级成颜色` },
  { t: `code`, lang: `javascript`, code: `const scale = [0, 150, 600, 750, 800];        // 克每千瓦时` +
`\nconst colors = ["#2AA364", "#F5EB4D", "#9E4229", "#381D02", "#381D02"];` +
`\n` +
`\nfunction calculateColor(value) {` +
`\n  let best = 0;` +
`\n  for (let i = 1; i < scale.length; i++) {   // 找最接近的那一档` +
`\n    if (Math.abs(scale[i] - value) < Math.abs(scale[best] - value)) best = i;` +
`\n  }` +
`\n  return colors[best];` +
`\n}` },
      { t: `p`, text: `档位表用一次遍历找最近值，没有去 sort：sort 是原地改数组的，档位一乱，颜色表就和档位对不上了。同一个道理适用于两处代码：算档位的只管算，画图的只管画，一次只做一件事——第 2 课讲提交粒度时说的就是这句话。` },
  { t: `h2`, text: `演示 4 · 把长活切成片` },
  { t: `code`, lang: `javascript`, code: `function processInChunks(items, perChunk, done) {` +
`\n  let i = 0;` +
`\n  function step() {` +
`\n    const stop = Math.min(i + perChunk, items.length);` +
`\n    for (; i < stop; i++) handle(items[i]);    // 只跑这一小片` +
`\n    if (i < items.length) setTimeout(step, 0); // 让出这一帧` +
`\n    else done();` +
`\n  }` +
`\n  step();` +
`\n}` },
      { t: `p`, text: `一句 setTimeout(step, 0) 就把一个大循环换成了一串小循环：每次让出线程，浏览器有机会画帧、响应输入，长任务被切成不超支的段。代价是总时间略长，换来的是页面不再「冻住」——第 5 课那个「把函数当值递出去」在这里第一次真的值钱了。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `在循环里读位置又改尺寸再读位置：浏览器被迫反复排版，改成先读完再一次性改`,
    `图片给两倍尺寸再靠 CSS 缩小：字节照下不误，按显示尺寸出图并挑对格式`,
    `为了「看起来快」把加载状态藏起来：数据回来前显示 undefined，用户以为坏了`,
    `把性能优化当成上线前最后一次冲刺：先量（Network 与 Performance），再改那一条最长的`,
    `在消息里传 DOM 节点或函数：序列化丢光，表现是那边静默无反应`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `给你的扩展录一段 Performance，找出最长的那根横条，说出它是脚本、布局还是绘制`,
    `把一张照片换到按显示尺寸出图，比较 Network 面板里两次的首屏时间`,
    `写一段会卡住页面的循环，再用演示 4 的分片法改造它，说明手感差在哪`,
    `让图标颜色随数据分档变化，并把档位表抽成配置，改一档只动一处`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：慢有两种，加载慢是字节与请求的账，跑调慢是主线程一帧的账——先分清在算哪笔账，再动手改。` }
];
