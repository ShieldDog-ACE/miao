window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["webdev-c16"] = [
  { t: `tip`, color: `blue`, text: `本课目标：让上一课那些对象第一次出现在屏幕上。搞清 canvas 的坐标系往哪走、绘制要走哪三步、图片为什么要等。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `canvas 是一个默认透明、什么都不做的矩形。它跟 img 的区别在于：img 的内容在文件里，canvas 的内容由代码一笔一笔写进去。往里写的接口叫 2D 渲染上下文，拿到它之后才有 fillRect、drawImage 这些方法可用。所以画任何东西之前都是同三步：从 DOM 里取到元素、向它要 context、在 context 上调用绘制方法。` },
  { t: `p`, text: `坐标系是唯一需要重新适应的地方：原点不在左下而在左上，x 往右变大，y 往下变大。这个约定来自早年阴极射线管从上往下扫描的顺序，一路沿用至今。写游戏时的直接后果是——y 越小越靠屏幕顶部，敌人从上面压下来就是 y 一路变大，而「底部的主角」要写成 canvas.height 减去一个量。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><text x="320" y="20" font-size="15" text-anchor="middle" fill="#22314e">canvas 的原点在左上，绘制只有三步</text><rect x="20" y="42" width="280" height="200" fill="#1b2233"/><text x="160" y="256" font-size="14" text-anchor="middle" fill="#5c6b83">1024 × 768 的黑色画面</text><circle cx="24" cy="46" r="4" fill="#e0574a"/><text x="34" y="42" font-size="14" fill="#f2c6be">(0, 0)</text><line x1="24" y1="46" x2="292" y2="46" stroke="#8896ad" stroke-width="2"/><text x="250" y="66" font-size="14" fill="#cfe0f5">x 增大 →</text><line x1="24" y1="46" x2="24" y2="232" stroke="#8896ad" stroke-width="2"/><text x="34" y="216" font-size="14" fill="#cfe0f5">y 增大 ↓</text><rect x="90" y="150" width="66" height="40" fill="#3d9a63"/><text x="123" y="140" font-size="14" text-anchor="middle" fill="#bfe6cd">主角 90,150</text><rect x="180" y="60" width="40" height="30" fill="#c2732b"/><text x="200" y="56" font-size="14" text-anchor="middle" fill="#f6d9b8">敌人 180,60</text><text x="160" y="284" font-size="14" text-anchor="middle" fill="#3d4c66">敌人 y 越画越大 = 往下压</text><rect x="330" y="42" width="296" height="182" rx="8" fill="#eef4ff" stroke="#5b7fd1"/><text x="478" y="64" font-size="15" text-anchor="middle" fill="#22314e">三步回路</text><text x="346" y="92" font-size="14" fill="#22314e">1. document.getElementById</text><text x="346" y="112" font-size="14" fill="#5c6b83">   拿到那个矩形元素</text><text x="346" y="138" font-size="14" fill="#22314e">2. canvas.getContext('2d')</text><text x="346" y="158" font-size="14" fill="#5c6b83">   拿到画笔，方法都在它身上</text><text x="346" y="184" font-size="14" fill="#22314e">3. ctx.fillStyle / fillRect / drawImage</text><text x="346" y="204" font-size="14" fill="#5c6b83">   每次调用往像素上盖一层</text><text x="478" y="248" font-size="14" text-anchor="middle" fill="#3d4c66">没有第 4 步撤销：画上去的就成了像素，改主意只能重画整帧。</text></svg>`, caption: `左边是坐标往哪长，右边是每次绘制都要走的三步。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `一个元素画几千个图形，比往 DOM 里塞几千个 div 便宜得多——浏览器不用为每个图形算布局`,
    `像素级控制：任意颜色、任意位置、任意旋转，不受标签能表达的范围限制`,
    `图片素材直接贴进画面，游戏的美术和逻辑能分成两拨人做`,
    `配合后面的循环与定时，静态的一帧就能变成连续的动画`
  ] },
  { t: `h2`, text: `演示 1 · 三步都写上，画面才有第一块颜色` },
  { t: `code`, lang: `html`, code: `<canvas id="myCanvas" width="1024" height="768"></canvas>` },
  { t: `code`, lang: `javascript`, code: `const canvas = document.getElementById('myCanvas');\nconst ctx = canvas.getContext('2d');\n\nctx.fillStyle = 'black';\nctx.fillRect(0, 0, canvas.width, canvas.height);` },
  { t: `p`, text: `fillStyle 是「接下来填充用什么颜色」的开关，它不画任何东西；真正落下像素的是 fillRect，参数是 x、y、宽、高。这两行就是整课的静态背景：从原点铺满到 canvas.width、canvas.height。宽度高度写在标签属性上，别只写在 CSS 里——CSS 拉伸的是显示尺寸，坐标系还是属性里那个。` },
  { t: `h2`, text: `演示 2 · 图片要等，等完才能用` },
  { t: `code`, lang: `javascript`, code: `function loadAsset(path) {\n  return new Promise((resolve, reject) => {\n    const img = new Image(); img.src = path;      // 此刻图还在路上\n    img.onload = () => resolve(img);\n    img.onerror = () => reject(new Error('素材加载失败: ' + path));\n  });\n}\nasync function initializeGame() {\n  const heroImg = await loadAsset('assets/player.png');\n  const enemyImg = await loadAsset('assets/enemyShip.png');\n  return { heroImg, enemyImg };\n}` },
  { t: `p`, text: `new Image 之后图片还在网络上，此刻它是空的，直接画上去什么也没有。所以要挂 onload，等它把尺寸和数据准备好。包成 Promise 的好处是能 await：素材加载这段异步流程写起来像顺序执行，出错也走 catch。` },
  { t: `h2`, text: `演示 3 · 画出第一帧：主角和一艘敌人` },
  { t: `code`, lang: `javascript`, code: `const canvas = document.getElementById('myCanvas');\nconst ctx = canvas.getContext('2d');\nconst { heroImg, enemyImg } = await initializeGame();\n\nctx.fillStyle = 'black';\nctx.fillRect(0, 0, canvas.width, canvas.height);\n\nctx.drawImage(enemyImg, 0, 0);\nctx.drawImage(heroImg, canvas.width / 2 - 45, canvas.height - canvas.height / 4);` },
  { t: `h2`, text: `演示 4 · 双层循环摆出 5×5 编队` },
  { t: `code`, lang: `javascript`, code: `const ENEMY_TOTAL = 5;\nconst ENEMY_SPACING = 98;\nconst FORMATION_WIDTH = ENEMY_TOTAL * ENEMY_SPACING;\nconst START_X = (canvas.width - FORMATION_WIDTH) / 2;\nconst STOP_X = START_X + FORMATION_WIDTH;\n\nfor (let x = START_X; x < STOP_X; x += ENEMY_SPACING) {\n  for (let y = 0; y < 50 * 5; y += 50) {\n    ctx.drawImage(enemyImg, x, y);\n  }\n}` },
  { t: `p`, text: `外层管列、内层管行，两个循环各自按步长前进，这就是网格的全部技术含量。步长和总数写成常量而不是硬编码坐标，画布换尺寸、编队换 6×6，都只改上面几行。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240" font-family="sans-serif"><text x="320" y="20" font-size="15" text-anchor="middle" fill="#22314e">编队的 x 和 y 是怎么算出来的</text><rect x="30" y="44" width="440" height="150" fill="#1b2233"/><text x="250" y="212" font-size="14" text-anchor="middle" fill="#5c6b83">canvas.width = 1024（图上按比例缩放）</text><line x1="30" y1="70" x2="470" y2="70" stroke="#3a4560"/><text x="40" y="64" font-size="14" fill="#cfe0f5">START_X = (1024 - 490) / 2</text><g fill="#c2732b"><rect x="60" y="80" width="24" height="18"/><rect x="140" y="80" width="24" height="18"/><rect x="220" y="80" width="24" height="18"/><rect x="300" y="80" width="24" height="18"/><rect x="380" y="80" width="24" height="18"/><rect x="60" y="104" width="24" height="18"/><rect x="140" y="104" width="24" height="18"/><rect x="220" y="104" width="24" height="18"/><rect x="300" y="104" width="24" height="18"/><rect x="380" y="104" width="24" height="18"/><rect x="60" y="128" width="24" height="18"/><rect x="140" y="128" width="24" height="18"/><rect x="220" y="128" width="24" height="18"/><rect x="300" y="128" width="24" height="18"/><rect x="380" y="128" width="24" height="18"/></g><line x1="84" y1="90" x2="140" y2="90" stroke="#7fb0d6" stroke-width="2"/><text x="112" y="86" font-size="14" text-anchor="middle" fill="#bfe0f5">98</text><line x1="70" y1="122" x2="70" y2="104" stroke="#7fb0d6" stroke-width="2"/><text x="52" y="118" font-size="14" fill="#bfe0f5">50</text><rect x="200" y="164" width="40" height="26" fill="#3d9a63"/><text x="250" y="182" font-size="14" fill="#bfe6cd">hero：height - height/4</text><text x="520" y="70" font-size="14" text-anchor="middle" fill="#3d4c66">外层 x += 98</text><text x="520" y="94" font-size="14" text-anchor="middle" fill="#3d4c66">内层 y += 50</text><text x="520" y="126" font-size="14" text-anchor="middle" fill="#3d4c66">5 列 × 5 行</text><text x="520" y="148" font-size="14" text-anchor="middle" fill="#3d4c66">= 25 次 drawImage</text><text x="520" y="180" font-size="14" text-anchor="middle" fill="#5c6b83">一次调用一张图，</text><text x="520" y="200" font-size="14" text-anchor="middle" fill="#5c6b83">循环只是替你算坐标。</text></svg>`, caption: `两张图之间的间隔就是步长；总宽度先算出来，才能把整块编队居中。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `图片还没 onload 就 drawImage：不报错，画面就是空的，最容易误判成路径写错之外的别的原因`,
    `用 CSS 设宽高而不设属性：图变小了但坐标系没变，点击位置全对不上`,
    `drawImage 只给两个参数时按原图尺寸画，素材多大就占多大，换个素材尺寸全乱`,
    `每帧重画却忘了先铺背景：上一帧的残影像拖尾一样留在屏上`,
    `在 getContext 之前先用了 ctx：canvas 是 null，因为脚本比标签先跑了——脚本要放到元素之后或加 defer`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把画面铺成黑底，只靠 fillRect 画出主角和 5×5 编队，暂时不用任何图片素材`,
    `改上面演示 4 的常量，做出 6×4 的编队并保证它仍然水平居中，只允许动那四行常量`,
    `给 loadAsset 传一个不存在的路径，确认它走的是 reject 而不是画面静默空白`,
    `用 arc 加 fill 在 (100, 50) 画一个半径 25 的圆，再想清楚 y 轴方向对你的圆有什么影响`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：canvas 只是一块能被代码涂像素的矩形，原点在左上、y 朝下——所有游戏的画面都是这一句的推论。` }
];
