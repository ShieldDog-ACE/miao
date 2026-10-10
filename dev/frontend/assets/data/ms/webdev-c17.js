window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["webdev-c17"] = [
  { t: `tip`, color: `blue`, text: `本课目标：上一课的画是一张静图，这一课让它动。拆开看三件事：一帧里到底做了什么、谁在替你把帧一张张翻、按键怎么变成坐标的加减。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `屏幕上的「移动」没有移动。canvas 上画上去的东西就是像素，像素不会自己走位；所谓动画是：把对象的 x、y 改一点，清掉整块画布，再按新坐标重画。这三步重复得够快，眼睛就把它读成连续的位移。所以游戏对象的位置存在 JavaScript 的对象里，画布只是它每帧的投影——这句话在后面记分和碰撞检测里会反复用到。` },
  { t: `p`, text: `翻帧的活儿交给定时器。setInterval 每隔若干毫秒执行一次回调，回调里那套「清屏—铺底—重画所有对象」就是游戏循环。循环只管画，不管为什么变成这样：敌人自己往下走靠它构造时挂的定时器，主角挪动靠键盘事件改 x、y。两套来源改同一批对象，循环负责让改动看得见。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 290" font-family="sans-serif"><text x="320" y="20" font-size="15" text-anchor="middle" fill="#22314e">一帧的三步，和主角在三种帧里的位置</text><rect x="26" y="40" width="130" height="46" rx="6" fill="#eef4ff" stroke="#5b7fd1"/><text x="91" y="60" font-size="14" text-anchor="middle" fill="#22314e">1 改坐标</text><text x="91" y="78" font-size="14" text-anchor="middle" fill="#22314e">hero.x += 5</text><rect x="196" y="40" width="130" height="46" rx="6" fill="#fdf0e6" stroke="#c2732b"/><text x="261" y="60" font-size="14" text-anchor="middle" fill="#5c3410">2 清屏</text><text x="261" y="78" font-size="14" text-anchor="middle" fill="#5c3410">clearRect</text><rect x="366" y="40" width="130" height="46" rx="6" fill="#e8f6ee" stroke="#3d9a63"/><text x="431" y="60" font-size="14" text-anchor="middle" fill="#1d4230">3 重画</text><text x="431" y="78" font-size="14" text-anchor="middle" fill="#1d4230">fillRect + draw</text><path d="M156 63 H192" stroke="#8896ad" stroke-width="2"/><path d="M326 63 H362" stroke="#8896ad" stroke-width="2"/><path d="M496 63 H534 V112 H91 V90" stroke="#8896ad" stroke-width="2" fill="none"/><text x="560" y="94" font-size="14" fill="#5c6b83">下一帧</text><rect x="60" y="130" width="520" height="70" rx="6" fill="#1b2233"/><rect x="90" y="164" width="36" height="24" fill="#3d9a63"/><text x="108" y="158" font-size="14" text-anchor="middle" fill="#bfe6cd">x=100</text><rect x="250" y="164" width="36" height="24" fill="#3d9a63"/><text x="268" y="158" font-size="14" text-anchor="middle" fill="#bfe6cd">x=105</text><rect x="410" y="164" width="36" height="24" fill="#3d9a63"/><text x="428" y="158" font-size="14" text-anchor="middle" fill="#bfe6cd">x=110</text><text x="90" y="126" font-size="14" fill="#5c6b83">第 1 帧</text><text x="250" y="126" font-size="14" fill="#5c6b83">第 2 帧</text><text x="410" y="126" font-size="14" fill="#5c6b83">第 3 帧</text><text x="320" y="230" font-size="14" text-anchor="middle" fill="#3d4c66">对象身上只有三个矩形里的一个；画布上同时只留一张。少了第 2 步，三张会叠在一起拖成长条。</text><text x="320" y="256" font-size="14" text-anchor="middle" fill="#3d4c66">间隔设 100 毫秒就是每秒 10 帧——够看清，但谈不上顺滑。</text></svg>`, caption: `上面是每帧转一圈的回路，下面是同一个对象在连续三帧里的样子。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `敌人自己往前压，玩家不碰键盘画面也是活的`,
    `一处输入能同时驱动多处反应：改坐标、放音效、之后加镜头跟随都不用动输入那段`,
    `对象数量从 1 个加到 26 个，循环体一行不改——它只遍历数组`,
    `换帧率只改一个数字，逻辑代码与刷新快慢解耦`
  ] },
  { t: `h2`, text: `演示 1 · 让敌人自己往下走` },
  { t: `code`, lang: `javascript`, code: `class Enemy extends GameObject {\n  constructor(x, y) {\n    super(x, y);\n    this.width = 98; this.height = 50; this.type = 'Enemy';\n    const id = setInterval(() => {\n      if (this.y < canvas.height - this.height) { this.y += 5; }\n      else { clearInterval(id); }      // 压到底就关掉自己的定时器\n    }, 300);\n  }\n}` },
  { t: `p`, text: `注意只改了 this.y，没画任何东西——绘制交给循环。定时器返回的 id 必须留着，否则这个回调会一直转，哪怕对象已经不该动了。用箭头函数是因为它沿用构造时的 this；写成普通函数回调里的 this 就丢了。` },
  { t: `h2`, text: `演示 2 · 把绘制能力收进 GameObject` },
  { t: `code`, lang: `javascript`, code: `class GameObject {\n  constructor(x, y) {\n    this.x = x; this.y = y; this.type = '';\n    this.width = 0; this.height = 0; this.img = undefined;\n  }\n  draw(ctx) {\n    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);\n  }\n}\nclass Hero extends GameObject {\n  constructor(x, y) { super(x, y); this.width = 98; this.height = 75; }\n}` },
  { t: `p`, text: `draw 挂在基类上，主角和敌人共用同一份代码：位置、尺寸、图片都是对象自己的属性，draw 只是把这三样交给 ctx。于是循环不需要知道画的是谁，写一句 gameObjects.forEach 就够了。第 15 课说的「能力顺着继承往下传」在这里第一次兑现。` },
  { t: `h2`, text: `演示 3 · 游戏循环：一帧只做三件事` },
  { t: `code`, lang: `javascript`, code: `function drawGameObjects(ctx) {\n  gameObjects.forEach(go => go.draw(ctx));\n}\n\nconst gameLoopId = setInterval(() => {\n  ctx.clearRect(0, 0, canvas.width, canvas.height);   // 抹掉上一帧\n  ctx.fillStyle = 'black';\n  ctx.fillRect(0, 0, canvas.width, canvas.height);     // 重新铺底\n  drawGameObjects(ctx);                               // 按当前坐标重画\n}, 100);` },
  { t: `p`, text: `clearRect 把矩形内的像素清成透明，紧接着 fillRect 铺回黑色——这两句合起来才是「擦干净」。少了它们，画面就变成每一帧的叠加，主角走过的路留一条绿影。循环里没有一处改坐标，它只负责「把现在的世界画出来」，改坐标是别人的事。` },
  { t: `h2`, text: `演示 4 · 按键到移动之间隔一层消息` },
  { t: `code`, lang: `javascript`, code: `const onKeyDown = (e) => {\n  if ([37, 38, 39, 40, 32].includes(e.keyCode)) e.preventDefault();\n};\nwindow.addEventListener('keydown', onKeyDown);\n\nwindow.addEventListener('keyup', (evt) => {\n  if (evt.key === 'ArrowUp') eventEmitter.emit(Messages.KEY_EVENT_UP);\n  if (evt.key === 'ArrowLeft') eventEmitter.emit(Messages.KEY_EVENT_LEFT);\n});\n\neventEmitter.on(Messages.KEY_EVENT_UP, () => { hero.y -= 5; });\neventEmitter.on(Messages.KEY_EVENT_LEFT, () => { hero.x -= 5; });` },
  { t: `p`, text: `方向键和空格在浏览器里本来有活要干：滚页面。keydown 阶段调 preventDefault 就是宣布「这一下归游戏了」，否则主角一边挪一边把整张页面往下拽。键盘事件挂在 window 而不是 canvas 上——按键不属于某个元素，属于整个窗口。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 220" font-family="sans-serif"><text x="320" y="20" font-size="15" text-anchor="middle" fill="#22314e">从按下方向键到看见主角动了，中间过了四双手</text><rect x="10" y="44" width="112" height="52" rx="6" fill="#f2f2f7" stroke="#6b6b85"/><text x="66" y="66" font-size="14" text-anchor="middle" fill="#2b2b3d">window</text><text x="66" y="86" font-size="14" text-anchor="middle" fill="#2b2b3d">keyup</text><rect x="150" y="44" width="120" height="52" rx="6" fill="#eef4ff" stroke="#5b7fd1"/><text x="210" y="66" font-size="14" text-anchor="middle" fill="#22314e">转成游戏消息</text><text x="210" y="86" font-size="14" text-anchor="middle" fill="#22314e">KEY_EVENT_UP</text><rect x="300" y="44" width="120" height="52" rx="6" fill="#eef4ff" stroke="#5b7fd1"/><text x="360" y="66" font-size="14" text-anchor="middle" fill="#22314e">eventEmitter</text><text x="360" y="86" font-size="14" text-anchor="middle" fill="#22314e">emit → on</text><rect x="450" y="44" width="150" height="52" rx="6" fill="#e8f6ee" stroke="#3d9a63"/><text x="525" y="66" font-size="14" text-anchor="middle" fill="#1d4230">订阅者改数据</text><text x="525" y="86" font-size="14" text-anchor="middle" fill="#1d4230">hero.y -= 5</text><line x1="122" y1="70" x2="148" y2="70" stroke="#8896ad" stroke-width="2"/><line x1="270" y1="70" x2="298" y2="70" stroke="#8896ad" stroke-width="2"/><line x1="420" y1="70" x2="448" y2="70" stroke="#8896ad" stroke-width="2"/><rect x="200" y="128" width="240" height="48" rx="6" fill="#fdf0e6" stroke="#c2732b"/><text x="320" y="148" font-size="14" text-anchor="middle" fill="#5c3410">游戏循环下一帧</text><text x="320" y="168" font-size="14" text-anchor="middle" fill="#5c3410">清屏、铺底、按新 y 重画</text><line x1="525" y1="96" x2="525" y2="152" stroke="#c2732b" stroke-width="2"/><line x1="525" y1="152" x2="442" y2="152" stroke="#c2732b" stroke-width="2"/><text x="320" y="200" font-size="14" text-anchor="middle" fill="#3d4c66">输入改的是数据，循环改的是像素；两者不同步，所以你最多要等一帧才看到反应。</text></svg>`, caption: `这条链上每一环都只认识下一环的接口，谁都不认识「游戏」这件事。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `忘了 clearRect：画面拖出长长的残影，第一反应容易错怪素材透明通道`,
    `帧间隔设太大：改成 500 毫秒后，主角走的不是路径而是跳格子，碰撞也更容易穿过去`,
    `keydown 里 preventDefault 用得太宽：整页方向键失效，输入法和其他快捷键一起被吃掉`,
    `在循环里又改坐标又画：一帧改两次，同一按键位移翻倍，查起来极费劲`,
    `定时器只 setInterval 不 clearInterval：反复重开游戏时旧的循环还在转，越跑越卡`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把帧间隔从 100 改成 300、再改成 16，各跑一次，说清楚你眼睛看到的差别`,
    `只用第 15 课的 pub/sub，把「按空格发射」接成一条消息，发射逻辑放进订阅者而不是 keyup 回调`,
    `故意去掉 clearRect 跑一次，看清残影长什么样，再解释为什么这一步必须在重画之前`,
    `给 Hero 加上左右边界检查，让它撞不到画面外——不许在循环里判断，只能在订阅者里判断`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：位置是对象身上的数，画面是每帧重画出来的影子；先改数、再擦、再画，顺序错了动画就不成立。` }
];
