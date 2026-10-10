window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["webdev-c18"] = [
  { t: `tip`, color: `blue`, text: `本课目标：加激光，然后回答游戏里最难的那个问题——两个东西是不是撞上了。顺带解决撞上之后怎么把它们从世界上拿掉而不让循环崩。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `判断碰撞不需要精确到像素。这门游戏里每个对象都被读成一个矩形：左上角是它的 x、y，右下角是 x 加宽、y 加高。两个矩形要么分开要么重叠，没有第三种，所以判定可以反过来问：能不能证明它们彼此分开？只要证不出分开，就是撞上了。这套做法叫包围盒检测，代价是几次数值比较，换来的是每帧能检查上百对组合。` },
  { t: `p`, text: `撞上之后还有第二个麻烦。检测发生在遍历 gameObjects 的过程中，如果当场把元素从数组里删掉，剩下元素的下标全部左移，循环会跳过对象甚至报错。所以改成两段式：命中时只给对象贴一个 dead 标记，等这一帧的检查全部做完，再用一次 filter 把带标记的过滤掉。这也是上一课 GameObject 里那个 dead 字段的用处。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><text x="320" y="20" font-size="15" text-anchor="middle" fill="#22314e">碰撞判定：把「重叠」翻译成四次比大小</text><rect x="24" y="44" width="300" height="216" fill="#1b2233"/><rect x="70" y="100" width="150" height="56" fill="none" stroke="#c2732b" stroke-width="2"/><text x="145" y="94" font-size="14" text-anchor="middle" fill="#f6d9b8">敌人 r1</text><text x="70" y="118" font-size="14" fill="#f6d9b8">top=y</text><text x="70" y="164" font-size="14" fill="#f6d9b8">bottom=y+height</text><text x="222" y="130" font-size="14" text-anchor="end" fill="#f6d9b8">right=x+width</text><rect x="170" y="130" width="30" height="90" fill="none" stroke="#e0574a" stroke-width="2"/><text x="206" y="216" font-size="14" fill="#f2b6ae">激光 r2</text><text x="172" y="240" font-size="14" fill="#f2b6ae">left / right / top / bottom</text><text x="174" y="70" font-size="14" text-anchor="middle" fill="#cfe0f5">两块都往左上角对齐的原点</text><rect x="344" y="44" width="272" height="140" rx="6" fill="#eef4ff" stroke="#5b7fd1"/><text x="480" y="64" font-size="15" text-anchor="middle" fill="#22314e">四条分离条件，命中任一条 = 没撞</text><text x="358" y="88" font-size="14" fill="#22314e">r2.left &gt; r1.right   在右边</text><text x="358" y="110" font-size="14" fill="#22314e">r2.right &lt; r1.left   在左边</text><text x="358" y="132" font-size="14" fill="#22314e">r2.top &gt; r1.bottom   在下面</text><text x="358" y="154" font-size="14" fill="#22314e">r2.bottom &lt; r1.top   在上面</text><rect x="344" y="196" width="272" height="64" rx="6" fill="#e8f6ee" stroke="#3d9a63"/><text x="480" y="220" font-size="14" text-anchor="middle" fill="#1d4230">四条全不成立 → 取反后为 true</text><text x="480" y="242" font-size="14" text-anchor="middle" fill="#1d4230">就是相交，去发碰撞消息</text><text x="320" y="284" font-size="14" text-anchor="middle" fill="#3d4c66">图上激光压在敌人下沿：left 没超右、right 没低于左、top 在 bottom 之上——判为撞上。</text></svg>`, caption: `先证明「分开」，证不出来才算撞上；比较的是四条边，不是像素。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `一整套战斗系统：子弹打掉敌人、敌人撞到主角、越界自动消失，全是同一个判定的不同参数`,
    `对象有寿命：爆炸、掉落的奖励、飞过头的激光都能自己退场，不用别人记着`,
    `命中反应写在订阅者里，检测函数只管发现，不改世界——以后加掉落物只加一个订阅`,
    `把包围盒换成更贴合的形状（比如圆）时，只需要动 rectFromGameObject 这一个口子`
  ] },
  { t: `h2`, text: `演示 1 · 先报出四条边，再反向判不相交` },
  { t: `code`, lang: `javascript`, code: `rectFromGameObject() {\n  return {\n    top: this.y,\n    left: this.x,\n    bottom: this.y + this.height,\n    right: this.x + this.width\n  };\n}` },
  { t: `code`, lang: `javascript`, code: `function intersectRect(r1, r2) {\n  return !(r2.left > r1.right ||   // r2 整个在 r1 右侧\n           r2.right < r1.left ||   // 整个在左侧\n           r2.top > r1.bottom ||   // 整个在下侧\n           r2.bottom < r1.top);    // 整个在上侧\n}` },
  { t: `p`, text: `rectFromGameObject 挂在 GameObject 上，主角、敌人、激光都免费继承到——这就是上一课那个基类的第二次回报。intersectRect 里那个感叹号是本课最容易读反的地方：括号内是「分开了」，取反才是「撞上了」。写反的后果不是报错，而是判定永远为真，一发激光清空全场。` },
  { t: `h2`, text: `演示 2 · 激光：自己往上飞，越界自己认领死亡` },
  { t: `code`, lang: `javascript`, code: `class Laser extends GameObject {\n  constructor(x, y) {\n    super(x, y);\n    this.width = 9; this.height = 33; this.type = 'Laser'; this.img = laserImg;\n    let id = setInterval(() => {\n      if (this.y > 0) { this.y -= 15; }\n      else { this.dead = true; clearInterval(id); }   // 飞出顶边\n    }, 100);\n  }\n}` },
  { t: `p`, text: `和上一课的 Enemy 一模一样的套路，只是方向反过来：y 一路减小，因为顶边是 0。区别在多了一句 dead = true——它不只是停住，还要被帧末的过滤清出数组，否则画面上会永远留着一根静止的激光，检测也白算。` },
  { t: `h2`, text: `演示 3 · 发射要有闸门，不然一秒按出十发` },
  { t: `code`, lang: `javascript`, code: `class Hero extends GameObject {\n  constructor(x, y) { super(x, y); this.speed = { x: 0, y: 0 }; this.cooldown = 0; }\n  fire() {\n    gameObjects.push(new Laser(this.x + 45, this.y - 10));\n    this.cooldown = 500;                       // 打完就锁住\n    const id = setInterval(() => {\n      if (this.cooldown > 0) { this.cooldown -= 100; }\n      else { clearInterval(id); }              // 归零才解锁\n    }, 200);\n  }\n  canFire() { return this.cooldown === 0; }\n}` },
  { t: `h2`, text: `演示 4 · 每帧把所有对撞检查一遍，标记完再统一清理` },
  { t: `code`, lang: `javascript`, code: `function updateGameObjects() {\n  const enemies = gameObjects.filter(go => go.type === 'Enemy');\n  const lasers = gameObjects.filter(go => go.type === 'Laser');\n  lasers.forEach(laser => {\n    enemies.forEach(enemy => {\n      if (intersectRect(laser.rectFromGameObject(), enemy.rectFromGameObject())) {\n        eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, { first: laser, second: enemy });\n      }\n    });\n  });\n  gameObjects = gameObjects.filter(go => !go.dead);   // 帧末一次性清场\n}` },
  { t: `p`, text: `收到 COLLISION_ENEMY_LASER 的订阅者只写两行：first.dead = true、second.dead = true，子弹和敌人一起消失。这一层分工值得记住：检测函数只报告事实，后果由订阅者决定——将来想让某种敌人免疫子弹，改订阅者就够了，这段循环一行不用碰。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260" font-family="sans-serif"><text x="320" y="20" font-size="15" text-anchor="middle" fill="#22314e">命中之后：标记、过滤、下一帧</text><rect x="16" y="42" width="180" height="86" rx="6" fill="#1b2233"/><rect x="40" y="66" width="56" height="22" fill="#c2732b"/><rect x="78" y="80" width="12" height="34" fill="#e0574a"/><text x="106" y="56" font-size="14" fill="#f6d9b8">帧 N：相交成立</text><rect x="224" y="42" width="180" height="86" rx="6" fill="#eef4ff" stroke="#5b7fd1"/><text x="314" y="62" font-size="14" text-anchor="middle" fill="#22314e">emit 一条消息</text><text x="314" y="82" font-size="14" text-anchor="middle" fill="#22314e">订阅者贴标记</text><text x="314" y="102" font-size="14" text-anchor="middle" fill="#5c3410">laser.dead = true</text><rect x="432" y="42" width="192" height="86" rx="6" fill="#fdf0e6" stroke="#c2732b"/><text x="528" y="62" font-size="14" text-anchor="middle" fill="#5c3410">同一帧末尾</text><text x="528" y="82" font-size="14" text-anchor="middle" fill="#5c3410">filter(go =&gt; !go.dead)</text><text x="528" y="102" font-size="14" text-anchor="middle" fill="#5c3410">数组换了一份新的</text><line x1="196" y1="85" x2="222" y2="85" stroke="#8896ad" stroke-width="2"/><line x1="404" y1="85" x2="430" y2="85" stroke="#8896ad" stroke-width="2"/><rect x="24" y="150" width="250" height="42" rx="5" fill="none" stroke="#c7d0de" stroke-dasharray="5 4"/><text x="149" y="168" font-size="14" text-anchor="middle" fill="#5c6b83">遍历途中删元素</text><text x="149" y="186" font-size="14" text-anchor="middle" fill="#5c6b83">后面的下标全体左移</text><rect x="316" y="150" width="308" height="42" rx="5" fill="#e8f6ee" stroke="#3d9a63"/><text x="470" y="168" font-size="14" text-anchor="middle" fill="#1d4230">先标记、帧末统一换数组</text><text x="470" y="186" font-size="14" text-anchor="middle" fill="#1d4230">本轮遍历看到的还是同一份列表</text><text x="320" y="228" font-size="14" text-anchor="middle" fill="#3d4c66">帧 N+1 再画时，画面上的敌人和激光都已经不见了。</text></svg>`, caption: `左边是当场删的后果，右边是延迟到帧末清理的代价：只晚一帧。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `把 intersectRect 的感叹号写漏：判定永远为真，一帧之内所有敌人群体自爆`,
    `用 x、y 直接比距离却忘了加宽高——判的是两个左上角重合，实际差着一整个船身`,
    `在 forEach 里 splice 掉死掉的对象：跳过下一个元素，或者读到 undefined 直接抛错`,
    `只有 dead 标记却没有那句 filter：对象在数组里越积越多，帧率一路往下掉`,
    `冷却靠 setInterval 递减却允许连续开火：几次按下叠出好几个定时器，cooldown 数字互相抢着改`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `在演示 1 那个图上手算一遍：把激光往下挪 20 像素，四条分离条件里有几条成立`,
    `加一条 COLLISION_ENEMY_HERO 消息：敌人和主角相遇时两个都标 dead，注意别改 updateGameObjects 的结构`,
    `把冷却时间从 500 改成 50 和 2000，各玩一会儿，说出它改变了检查次数还是手感`,
    `让敌人抵达底边时发一条消息并把主角标 dead——想想这条规则该写在检测里还是订阅者里`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：碰撞是四行比大小，死亡是一个布尔值——真正的设计在于让判定和处理隔开，一帧只改数据、只画一次。` }
];
