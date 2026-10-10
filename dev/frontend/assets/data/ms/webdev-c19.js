window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["webdev-c19"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把分数和生命加上，顺便把一条纪律立起来——数字存在对象身上，画面每帧去读它，谁都不许直接改画面。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `记分要解决的不是算术，而是「谁是权威」。hero.points 是权威，屏幕上那行 Points 是它每帧的投影。命中时订阅者只做一件事：points 加 100。下一帧 drawPoints 读到新值，画出来就是 100。反过来，如果哪里图省事直接 fillText 一个 900 上去，下一帧又被读回来的真值覆盖——这种 bug 极难查，因为它看上去是「画面自己改回去了」。` },
  { t: `p`, text: `canvas 上的文字和图片一样，是涂上去的像素：不能选中、不能缩放、读屏软件也念不出来。这一点和第 3 课讲的无障碍直接冲突，所以分数这种关键信息后面在银行项目那几课里会改用真正的 DOM 来承载，canvas 上只留装饰性的字。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280" font-family="sans-serif"><text x="320" y="20" font-size="15" text-anchor="middle" fill="#22314e">一次命中：数据先变，画面晚一帧才变</text><rect x="14" y="48" width="150" height="54" rx="6" fill="#fdf0e6" stroke="#c2732b"/><text x="89" y="70" font-size="14" text-anchor="middle" fill="#5c3410">激光撞上敌人</text><text x="89" y="90" font-size="14" text-anchor="middle" fill="#5c3410">emit 碰撞消息</text><rect x="196" y="48" width="176" height="54" rx="6" fill="#eef4ff" stroke="#5b7fd1"/><text x="284" y="70" font-size="14" text-anchor="middle" fill="#22314e">订阅者改数据</text><text x="284" y="90" font-size="14" text-anchor="middle" fill="#22314e">hero.points += 100</text><rect x="406" y="48" width="220" height="54" rx="6" fill="#e8f6ee" stroke="#3d9a63"/><text x="516" y="70" font-size="14" text-anchor="middle" fill="#1d4230">下一帧 drawPoints 读真值</text><text x="516" y="90" font-size="14" text-anchor="middle" fill="#1d4230">fillText 出新的那行字</text><line x1="164" y1="75" x2="194" y2="75" stroke="#8896ad" stroke-width="2"/><line x1="372" y1="75" x2="404" y2="75" stroke="#8896ad" stroke-width="2"/><rect x="14" y="126" width="290" height="86" rx="6" fill="#1b2233"/><text x="24" y="150" font-size="14" fill="#bfe6cd">Points: 300</text><text x="216" y="150" font-size="14" fill="#bfe6cd">♥♥♥</text><text x="24" y="176" font-size="14" fill="#7f8ca5">真值 300 来自 hero.points</text><text x="24" y="198" font-size="14" fill="#7f8ca5">三个图标 = hero.life 是 3</text><rect x="336" y="126" width="290" height="86" rx="6" fill="#2b1420" stroke="#e0574a" stroke-dasharray="5 4"/><text x="346" y="150" font-size="14" fill="#f2b6ae">Points: 900 ← 手写上去的</text><text x="346" y="176" font-size="14" fill="#f2b6ae">下一帧又变回 400</text><text x="346" y="198" font-size="14" fill="#c88f86">绕过数据直接改像素，等于每帧和循环吵架</text><text x="320" y="240" font-size="14" text-anchor="middle" fill="#3d4c66">左边是「唯一真值 + 每帧投影」；右边是「画面自己存了一份」——后者一定会被覆盖。</text><text x="320" y="264" font-size="14" text-anchor="middle" fill="#3d4c66">生命图标也一样：画几个完全由 hero.life 这个数决定。</text></svg>`, caption: `上面那条链只朝一个方向走；下面右边那种反着改画面的写法是 bug 的产地。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `玩家随时知道自己挣了多少、还剩几条命，不用停下来数`,
    `奖励数值改一次就全局生效：100 分调成 250 分只动 incrementPoints 一行`,
    `命数用图标而不是文字，跨语言、跨字号都能看懂`,
    `把 points、life 挂到对象上之后，判负就有了依据——谁赢了这件事后面单独一课讲它`
  ] },
  { t: `h2`, text: `演示 1 · 文字是画上去的像素` },
  { t: `code`, lang: `javascript`, code: `ctx.font = '30px Arial';\nctx.fillStyle = 'red';\nctx.textAlign = 'left';\nctx.fillText('Points: ' + hero.points, 10, canvas.height - 20);` },
  { t: `p`, text: `fillText 后两个参数是落点，而这个落点是文字的基线，不是左上角——这是 canvas 文字最常踩的点。textAlign 决定这个点是左端、中心还是右端：设 left 时 x=10 就是字离左边 10 像素；设 right 时同一个 x 变成右边界，字会往左长。四个属性都是「设置一次，之后每次都管用」的开关，和 fillStyle 一样会污染后续绘制。` },
  { t: `h2`, text: `演示 2 · 数字住在对象身上` },
  { t: `code`, lang: `javascript`, code: `class Hero extends GameObject {\n  constructor(x, y) {\n    super(x, y);\n    this.speed = { x: 0, y: 0 }; this.cooldown = 0;\n    this.life = 3; this.points = 0;\n  }\n  incrementPoints() { this.points += 100; }\n  decrementLife() {\n    this.life--;\n    if (this.life === 0) { this.dead = true; }   // 命归零顺手标死\n  }\n}` },
  { t: `p`, text: `加分、扣命被写成方法而不是散在各处的加减号，是为了给规则留一个唯一的入口。decrementLife 里那句判断就是例子：命数为 0 时该干什么，只在这一处规定。上一课的 dead 标记在这里第二次派上用场——主角被标死之后，同样会被帧末那句 filter 清出数组。` },
  { t: `h2`, text: `演示 3 · 每帧把数字投影到屏幕` },
  { t: `code`, lang: `javascript`, code: `function drawPoints() {\n  ctx.font = '30px Arial'; ctx.fillStyle = 'red'; ctx.textAlign = 'left';\n  ctx.fillText('Points: ' + hero.points, 10, canvas.height - 20);\n}\n\nfunction drawLife() {\n  const START_POS = canvas.width - 180;\n  for (let i = 0; i < hero.life; i++) {\n    ctx.drawImage(lifeImg, START_POS + 45 * (i + 1), canvas.height - 37);\n  }\n}` },
  { t: `p`, text: `drawLife 的循环条件是 hero.life：剩几条命就画几个图标，扣一条命时这里自动少画一个，没有一处代码在「删除图标」。这两个函数要在游戏循环里被调用，位置排在 updateGameObjects 之后——先让数据定下来，再画。` },
  { t: `h2`, text: `演示 4 · 改数据的只有订阅者` },
  { t: `code`, lang: `javascript`, code: `enemies.forEach(enemy => {\n  if (intersectRect(hero.rectFromGameObject(), enemy.rectFromGameObject())) {\n    eventEmitter.emit(Messages.COLLISION_ENEMY_HERO, { enemy });\n  }\n});\neventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {\n  first.dead = true; second.dead = true;\n  hero.incrementPoints();\n});\neventEmitter.on(Messages.COLLISION_ENEMY_HERO, (_, { enemy }) => {\n  enemy.dead = true; hero.decrementLife();\n});` },
  { t: `p`, text: `敌人撞主角这段检测要放进 updateGameObjects，跟上一课的激光检测并排。两个订阅者的参数第一位用下划线占掉，因为它只是消息名，用不上。注意加分没有写进检测函数里：检测负责「发现了什么」，订阅者负责「于是要做什么」。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 220" font-family="sans-serif"><text x="320" y="20" font-size="15" text-anchor="middle" fill="#22314e">生命图标的横坐标是算出来的，不是摆出来的</text><text x="30" y="52" font-size="14" fill="#3d4c66">hero.life = 3</text><line x1="30" y1="62" x2="610" y2="62" stroke="#c7d0de"/><g fill="#4f74b8"><rect x="460" y="72" width="34" height="24" rx="3"/><rect x="505" y="72" width="34" height="24" rx="3"/><rect x="550" y="72" width="34" height="24" rx="3"/></g><text x="477" y="112" font-size="14" text-anchor="middle" fill="#5c6b83">i=0 → 起点+45</text><text x="522" y="112" font-size="14" text-anchor="middle" fill="#5c6b83">i=1</text><text x="567" y="112" font-size="14" text-anchor="middle" fill="#5c6b83">i=2</text><text x="30" y="146" font-size="14" fill="#3d4c66">hero.life = 1（撞了一次之后）</text><line x1="30" y1="156" x2="610" y2="156" stroke="#c7d0de"/><rect x="460" y="166" width="34" height="24" rx="3" fill="#4f74b8"/><text x="540" y="184" font-size="14" fill="#5c6b83">循环只转一圈，右边那两个从来就没被画过</text><text x="30" y="212" font-size="14" fill="#3d4c66">START_POS = canvas.width - 180，步长 45 —— 换屏幕宽度时整排图标仍然贴着右下角。</text></svg>`, caption: `少一个图标不需要任何删除操作，循环圈数少了一圈而已。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `在 fillText 里手写一个数字而不是读 hero.points：下一帧被打回原形，还以为是随机故障`,
    `忘了每帧重设 font、fillStyle、textAlign：这些状态会留着，后半屏的文字跟着变红变大`,
    `把 y 当成文字的左上角：整行字被切掉一半，调来调去像在猜`,
    `扣命写在检测函数里、加分写在订阅者里：两套风格并存，漏改一处就出现命不减分不加`,
    `life 归零只改数值不管 dead：主角还在数组里继续撞继续扣，数字一路减成负数`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把加分规则改成「离主角越近的敌人分值越高」，只允许动 incrementPoints`,
    `故意在检测函数里直接 fillText 一次分数，观察下一帧发生了什么，再解释为什么`,
    `给分数换成 textAlign 为 right 的写法，算出该用哪个 x 才仍然贴着右边`,
    `加一个连击计数：连续命中不清零、被撞一次清零——先想清楚这个数该住在哪一层`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：分数和命数只有一个真值，它在对象身上；屏幕上的每一行字都只是那一帧的读数。` }
];
