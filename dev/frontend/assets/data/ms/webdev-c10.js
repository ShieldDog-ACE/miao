window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["webdev-c10"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把「脚本怎么碰到页面」拆成三件事——DOM 这棵树、事件怎么沿树传播、闭包为什么能记住外层的变量。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `浏览器把 HTML 解析成内存里的一棵树，每个标签是一个节点，节点上挂着属性、样式和子节点。JavaScript 能碰到的只有这棵树：读它、改它、往里加节点、从里面删节点。改完浏览器会重排或重绘，所以你写的是数据操作，看到的是画面变化——上一课那些 class 名字，在这一课就是脚本的接口。` },
  { t: `p`, text: `事件是另一条线。用户按下指针，浏览器打包一个 event 对象，从 window 一路向下经过每个祖先直到目标节点（捕获阶段），然后在目标上执行监听器，再自下而上回到 window（冒泡阶段）。也就是说，挂在父级甚至 document 上的监听器，也能收到发生在孙节点的动作——这是事件委托的全部原理，也是「我明明点的是 A，为什么 B 的处理函数跑了」的答案。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250" font-family="sans-serif"><text x="200" y="20" font-size="15" text-anchor="middle" fill="#22314e">HTML 与它的节点树</text><text x="20" y="46" font-size="14" fill="#3d4c66">body</text><text x="40" y="70" font-size="14" fill="#3d4c66">h1</text><text x="40" y="94" font-size="14" fill="#3d4c66">div#terrarium</text><text x="60" y="118" font-size="14" fill="#3d4c66">div.jar-walls</text><text x="60" y="142" font-size="14" fill="#3d4c66">div.dirt</text><text x="80" y="166" font-size="14" fill="#3d4c66">img.plant</text><circle cx="150" cy="52" r="13" fill="#eef4ff" stroke="#5b7fd1"/><text x="150" y="57" font-size="14" text-anchor="middle" fill="#22314e">b</text><circle cx="110" cy="96" r="13" fill="#eef4ff" stroke="#5b7fd1"/><text x="110" y="101" font-size="14" text-anchor="middle" fill="#22314e">h1</text><circle cx="190" cy="96" r="13" fill="#e8f6ee" stroke="#3d9a63"/><text x="190" y="101" font-size="14" text-anchor="middle" fill="#1d4230">div</text><circle cx="160" cy="140" r="13" fill="#e8f6ee" stroke="#3d9a63"/><text x="160" y="145" font-size="14" text-anchor="middle" fill="#1d4230">div</text><circle cx="228" cy="140" r="13" fill="#e8f6ee" stroke="#3d9a63"/><text x="228" y="145" font-size="14" text-anchor="middle" fill="#1d4230">div</text><circle cx="228" cy="186" r="13" fill="#fdf0e6" stroke="#c2732b"/><text x="228" y="191" font-size="14" text-anchor="middle" fill="#5c3410">img</text><line x1="144" y1="64" x2="116" y2="84" stroke="#8896ad" stroke-width="2"/><line x1="156" y1="64" x2="184" y2="84" stroke="#8896ad" stroke-width="2"/><line x1="184" y1="109" x2="166" y2="128" stroke="#8896ad" stroke-width="2"/><line x1="196" y1="109" x2="222" y2="128" stroke="#8896ad" stroke-width="2"/><line x1="228" y1="153" x2="228" y2="173" stroke="#8896ad" stroke-width="2"/><text x="470" y="60" font-size="14" text-anchor="middle" fill="#1d4230">document.getElementById(plant1)</text><text x="470" y="82" font-size="14" text-anchor="middle" fill="#1d4230">document.querySelector(#terrarium .plant)</text><text x="470" y="104" font-size="14" text-anchor="middle" fill="#1d4230">terrariumElement.style.top = 120px</text><text x="470" y="126" font-size="14" text-anchor="middle" fill="#1d4230">terrariumElement.classList.add(dragged)</text><line x1="241" y1="186" x2="360" y2="104" stroke="#3d9a63" stroke-width="2"/><text x="470" y="168" font-size="14" text-anchor="middle" fill="#8a5a10">选择器找到的是节点对象，不是画面上的像素</text><text x="470" y="190" font-size="14" text-anchor="middle" fill="#8a5a10">改 style 与 class 会触发重绘，页面立刻跟着变</text><text x="470" y="216" font-size="14" text-anchor="middle" fill="#3d4c66">删掉节点等于从树上摘下整枝，子节点一起没了</text></svg>`, caption: `左边是结构，右边是脚本的手：所有 DOM 操作都要先在树上找到那个节点。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `不刷新页面就换内容：加一行、删一行、改文字、换 class`,
    `把用户的动作变成程序的反应：按下、拖动、按键、离开焦点`,
    `用一个父节点接住全部子节点的事件，列表长到一百项也不用挂一百个监听器`,
    `把数据藏在函数外面，只留一个接口给别人用——闭包做到的正是这件事`
  ] },
  { t: `h2`, text: `演示 1 · 找到节点，然后改它` },
  { t: `code`, lang: `javascript`, code: `const plant = document.getElementById("plant1");` +
`\nplant.style.top = "120px";              // 内联样式，直接落进 style 属性` +
`\nplant.classList.add("dragged");         // 加类，长相交给上一课的 CSS` +
`\nplant.className;                        // 现在读得到两个类名` +
`\n` +
`\nconst holder = document.querySelector(".plant-holder");` +
`\nconst copy = plant.cloneNode(true);     // true 是连子节点一起抄` +
`\nholder.appendChild(copy);               // 挂到树末尾，画面立刻多一株` +
`\nholder.removeChild(plant);              // 从树上摘下` },
  { t: `p`, text: `改 style 是逐条写内联，改 class 是把外观留给样式表——后者才是能维护的做法，因为它把长相的决定权留在 CSS 里。cloneNode 那行如果传 false，抄到的只是个空壳：内容都在子节点上。` },
  { t: `h2`, text: `演示 2 · 事件的三个阶段` },
  { t: `code`, lang: `javascript`, code: `plant.addEventListener("click", (e) => {` +
`\n  console.log("目标上", e.target.className);   // e.target 永远是被点的那个` +
`\n}, false);                              // 第三个参数 false：冒泡阶段处理` +
`\n` +
`\ndocument.querySelector("#terrarium").addEventListener("click", (e) => {` +
`\n  if (e.target.classList.contains("plant")) {  // 委托：由父节点分诊` +
`\n    console.log("点到的植物是", e.target.id);` +
`\n  }` +
`\n});` +
`\n` +
`\ne.stopPropagation();   // 想让事件到此为止，就这句` +
`\ne.preventDefault();    // 想拦住浏览器默认动作（选中文字、跳转），用这句` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 230" font-family="sans-serif"><text x="320" y="20" font-size="15" text-anchor="middle" fill="#22314e">点中 img 时，事件走过这条路</text><rect x="40" y="38" width="560" height="40" rx="6" fill="#f7f8fb" stroke="#8896ad"/><text x="60" y="62" font-size="14" fill="#22314e">document</text><rect x="80" y="92" width="480" height="40" rx="6" fill="#eef4ff" stroke="#5b7fd1"/><text x="100" y="116" font-size="14" fill="#22314e">div#terrarium</text><rect x="120" y="146" width="400" height="40" rx="6" fill="#e8f6ee" stroke="#3d9a63"/><text x="140" y="170" font-size="14" fill="#1d4230">img#plant1 —— 目标</text><line x1="330" y1="132" x2="330" y2="146" stroke="#c2732b" stroke-width="2"/><text x="345" y="143" font-size="14" fill="#c2732b">1 捕获：自上而下</text><line x1="250" y1="146" x2="250" y2="132" stroke="#3d9a63" stroke-width="2"/><text x="130" y="143" font-size="14" fill="#3d9a63">3 冒泡：自下而上</text><text x="430" y="180" font-size="14" fill="#5c3410">2 目标上的监听器</text><text x="320" y="212" font-size="14" text-anchor="middle" fill="#8a5a10">冒泡意味着父级能收到孙级的动作；stopPropagation 把这条路切断</text></svg>`, caption: `看图说话：给列表挂一个监听器就够，靠 e.target 分辨点了哪一项，这就是委托。` },
  { t: `p`, text: `addEventListener 比直接赋值给 onpointerdown 多两件事：同一种事件能挂好几个处理函数，以及第三个参数决定你在捕获阶段还是冒泡阶段被叫到。on 开头那种写法只有一个位置，后写的会把先写的覆盖掉——这是排查「我的监听器怎么没跑」时第一个要看的。` },
  { t: `h2`, text: `演示 3 · 闭包：函数带着它出生的作用域` },
  { t: `code`, lang: `javascript`, code: `function createCounter() {` +
`\n  let count = 0;              // 外层函数的局部变量` +
`\n  function increment() {` +
`\n    count++;                  // 内层函数用着它` +
`\n    return count;` +
`\n  }` +
`\n  return increment;           // 交出去的是函数，不是值` +
`\n}` +
`\nconst myCounter = createCounter();` +
`\nmyCounter();   // 1：count 还活着` +
`\nmyCounter();   // 2：同一个 count，不是新的 0` +
`\nconsole.log(count);           // ReferenceError：外面碰不到它` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250" font-family="sans-serif"><text x="320" y="20" font-size="15" text-anchor="middle" fill="#22314e">createCounter 已经返回，里面的 count 却没散架</text><rect x="20" y="46" width="230" height="90" rx="6" fill="#f2f2f7" stroke="#6b6b85"/><text x="135" y="70" font-size="15" text-anchor="middle" fill="#2b2b3d">函数 createCounter</text><text x="135" y="94" font-size="14" text-anchor="middle" fill="#2b2b3d">局部变量 count</text><rect x="80" y="106" width="110" height="22" fill="#fff2b8" stroke="#c2732b"/><text x="135" y="122" font-size="14" text-anchor="middle" fill="#5c3410">count = 2</text><rect x="330" y="46" width="230" height="90" rx="6" fill="#e8f6ee" stroke="#3d9a63"/><text x="445" y="70" font-size="15" text-anchor="middle" fill="#1d4230">函数 increment</text><text x="445" y="94" font-size="14" text-anchor="middle" fill="#1d4230">它引用着那个 count</text><text x="445" y="118" font-size="14" text-anchor="middle" fill="#1d4230">这一对就叫闭包</text><line x1="430" y1="136" x2="200" y2="117" stroke="#c2732b" stroke-width="2"/><text x="300" y="164" font-size="14" text-anchor="middle" fill="#3d4c66">myCounter = increment，外面的世界只拿得到这个函数</text><rect x="20" y="182" width="600" height="56" rx="6" fill="#f7f8fb" stroke="#c7d0de"/><text x="36" y="204" font-size="14" fill="#3d4c66">再调用一次 createCounter() 会得到全新的 count，两次互不影响；</text><text x="36" y="226" font-size="14" fill="#8a5a10">外面想知道 count 只能问 myCounter()，直接写 count 是 ReferenceError —— 私有就体现在这里。</text></svg>`, caption: `左边那个格子本该随函数返回一起消失，因为右边还引用着它，所以它留着——这就是闭包的全部机制。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `脚本写在 head 里又不加 defer：解析到那一行时 body 还不存在，getElementById 拿到 null，第一行就报错`,
    `在循环里用 var 声明再挂监听器：var 没有块级作用域，全部回调读到的是同一个最终值，改用 let 才各留一份`,
    `点子元素时事件冒泡到父级，父级的处理函数把你不想跑的那段跑了：要么 stopPropagation，要么用 e.target 判断`,
    `preventDefault 和 stopPropagation 混为一谈：一个拦浏览器默认动作，一个拦事件继续传播，两码事`,
    `拖动结束时忘了摘掉 document 上的监听器：每按一次多挂一份，第二次拖动就跳两倍距离`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把上一课那十四株植物用循环加上一样的行为，并说明你为什么用 let 而不是 var`,
    `在页面上做一次拖拽：指针按下记起点、移动时改 style 的 top 与 left、抬起时摘掉监听器，三个动作分别对应哪几个事件`,
    `写一个闭包版的「点击次数统计」，要求外面只能通过返回的函数读到次数`,
    `用事件委托把一个列表的点击从「每项一个监听器」改成「父级一个」，说出列表动态增删时省了什么`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：DOM 是能改的树，事件是会冒泡的对象，闭包是函数把它出生时那间屋子一起带走了。` }
];
