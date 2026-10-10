window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["webdev-c20"] = [
  { t: `tip`, color: `blue`, text: `本课目标：给游戏划一个终点，并让人能马上再来一局。难点不在判定，在收尾——循环要停、监听要清、数据要归零，漏一件就出现「上一局的尸体留在下一局里」。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `什么时候算结束，是设计者定的规则，不是程序的自然规律。这门游戏里两条：主角命数归零算输，敌人一个不剩算赢。注意这两条判定读的都是数据——hero.life 和数组里还活着的敌人数量，而不是「画面上看见几个」。上一课立的规矩在这里第一次被检验：只要真值只有数据一处，判定就写得出、也测得了。` },
  { t: `p`, text: `判定之后是两件容易忽略的事。第一，游戏结束意味着世界不再演化：那个每 100 毫秒转一圈的循环必须被 clearInterval 停掉，否则结算字会被下一帧擦掉，你只会看见字闪一下。第二，重开不是「把数值改回去」那么轻——initGame 会重新注册一遍订阅者，如果上一批订阅者还挂在 eventEmitter 上，同一句消息就会同时叫醒两份处理函数。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><text x="320" y="20" font-size="15" text-anchor="middle" fill="#22314e">一局游戏的四个状态，和三条转移边各自该做的事</text><rect x="24" y="52" width="150" height="66" rx="8" fill="#e8f6ee" stroke="#3d9a63"/><text x="99" y="76" font-size="15" text-anchor="middle" fill="#1d4230">进行中</text><text x="99" y="96" font-size="14" text-anchor="middle" fill="#1d4230">gameLoopId 每 100ms</text><text x="99" y="112" font-size="14" text-anchor="middle" fill="#1d4230">转一圈</text><rect x="250" y="40" width="150" height="52" rx="8" fill="#fdf0e6" stroke="#c2732b"/><text x="325" y="62" font-size="14" text-anchor="middle" fill="#5c3410">GAME_END_WIN</text><text x="325" y="82" font-size="14" text-anchor="middle" fill="#5c3410">活敌人 = 0</text><rect x="250" y="108" width="150" height="52" rx="8" fill="#fbe9e9" stroke="#c0504a"/><text x="325" y="130" font-size="14" text-anchor="middle" fill="#6b241f">GAME_END_LOSS</text><text x="325" y="150" font-size="14" text-anchor="middle" fill="#6b241f">hero.life ≤ 0</text><line x1="174" y1="78" x2="248" y2="66" stroke="#8896ad" stroke-width="2"/><line x1="174" y1="100" x2="248" y2="132" stroke="#8896ad" stroke-width="2"/><rect x="470" y="66" width="150" height="72" rx="8" fill="#1b2233"/><text x="545" y="92" font-size="14" text-anchor="middle" fill="#f2c6be">结算画面</text><text x="545" y="112" font-size="14" text-anchor="middle" fill="#7f8ca5">循环已停</text><text x="545" y="130" font-size="14" text-anchor="middle" fill="#7f8ca5">字不会被擦掉</text><line x1="400" y1="66" x2="468" y2="94" stroke="#8896ad" stroke-width="2"/><line x1="400" y1="134" x2="468" y2="110" stroke="#8896ad" stroke-width="2"/><text x="434" y="60" font-size="14" text-anchor="middle" fill="#5c6b83">endGame</text><rect x="230" y="200" width="190" height="60" rx="8" fill="#eef4ff" stroke="#5b7fd1"/><text x="325" y="222" font-size="14" text-anchor="middle" fill="#22314e">resetGame 重开</text><text x="325" y="240" font-size="14" text-anchor="middle" fill="#5c6b83">停循环 → 清监听</text><text x="325" y="256" font-size="14" text-anchor="middle" fill="#5c6b83">→ initGame → 新循环</text><line x1="545" y1="138" x2="545" y2="230" stroke="#5b7fd1" stroke-width="2"/><line x1="545" y1="230" x2="422" y2="230" stroke="#5b7fd1" stroke-width="2"/><text x="490" y="222" font-size="14" text-anchor="middle" fill="#22314e">按 Enter</text><line x1="230" y1="230" x2="99" y2="230" stroke="#3d9a63" stroke-width="2"/><line x1="99" y1="230" x2="99" y2="120" stroke="#3d9a63" stroke-width="2"/><text x="164" y="284" font-size="14" text-anchor="middle" fill="#3d4c66">这条边必须四步齐全：少停一次循环就有两个循环并行；少清一次监听就有双份订阅者。</text></svg>`, caption: `上面三个框是一局的生命周期，下面那个框是跨局的清理动作。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `一局有明确终点，分数才有意义——没有终局就没有成绩可言`,
    `随时能重开：不用刷新页面、不用重新加载素材，几毫秒回到起点`,
    `判定函数是纯读数函数，可以脱离画面单测：给一个 life 为 0 的 hero，它必须回答 true`,
    `结束这件事被拆成「谁发现」和「谁善后」两层，以后加暂停、加关卡都照这个形状写`
  ] },
  { t: `h2`, text: `演示 1 · 结束条件是两个读数据的函数` },
  { t: `code`, lang: `javascript`, code: `// 往 Messages 里加两条：\n//   GAME_END_LOSS: 'GAME_END_LOSS',\n//   GAME_END_WIN: 'GAME_END_WIN',\n\nfunction isHeroDead() {\n  return hero.life <= 0;\n}\nfunction isEnemiesDead() {\n  const alive = gameObjects.filter(go => go.type === 'Enemy' && !go.dead);\n  return alive.length === 0;\n}` },
  { t: `p`, text: `isEnemiesDead 的过滤条件里那个 !go.dead 是关键：数组里的敌人可能只是被标记了还没清理，数它就等于承认敌人还在。这两个函数不 emit、不画、不改任何东西，只回答一个是非题——正因为这么窄，它们才能被别处反复调用而不出事。` },
  { t: `h2`, text: `演示 2 · 判负优先，同一次碰撞只许发一条终局消息` },
  { t: `code`, lang: `javascript`, code: `eventEmitter.on(Messages.COLLISION_ENEMY_HERO, (_, { enemy }) => {\n  enemy.dead = true;\n  hero.decrementLife();\n  if (isHeroDead()) {\n    eventEmitter.emit(Messages.GAME_END_LOSS);\n    return;                 // 同一帧里不再判胜\n  }\n  if (isEnemiesDead()) {\n    eventEmitter.emit(Messages.GAME_END_WIN);\n  }\n});` },
  { t: `p`, text: `撞死主角的那一发子弹，可能恰好也是最后一个敌人——两种条件同时成立。中间那句 return 就是在替设计做决定：这种情况下算输。这个先后顺序不写出来，胜负就会随机，因为取决于两个 if 谁先执行。` },
  { t: `h2`, text: `演示 3 · 先把循环停掉，再盖结算画面` },
  { t: `code`, lang: `javascript`, code: `function displayMessage(message, color = 'red') {\n  ctx.font = '30px Arial';\n  ctx.fillStyle = color;\n  ctx.textAlign = 'center';\n  ctx.fillText(message, canvas.width / 2, canvas.height / 2);\n}` },
  { t: `code`, lang: `javascript`, code: `function endGame(win) {\n  clearInterval(gameLoopId);          // 循环必须先停\n  setTimeout(() => {                  // 等在途的那一帧画完\n    ctx.clearRect(0, 0, canvas.width, canvas.height);\n    ctx.fillStyle = 'black';\n    ctx.fillRect(0, 0, canvas.width, canvas.height);\n    displayMessage(win ? 'Victory!!!' : 'You died !!!', win ? 'green' : 'red');\n  }, 200);\n}` },
  { t: `p`, text: `顺序很实在：clearInterval 拿的是第 17 课那个循环的 id，如果当时没把 id 存进变量，这里就停不掉。外面那层 setTimeout 是为了躲开「已经排队的最后一帧」——它要是比结算字晚到，字就白写了。这是延迟补偿，不是必要的仪式感。` },
  { t: `h2`, text: `演示 4 · 重开要做四件事，一件都不能少` },
  { t: `code`, lang: `javascript`, code: `clear() { this.listeners = {}; }              // 挂在 EventEmitter 上\n\nfunction resetGame() {\n  clearInterval(gameLoopId);\n  eventEmitter.clear();      // 少了这句，订阅者一次比一次多\n  initGame();                // 重造主角与敌人，分数命数归零\n  gameLoopId = setInterval(() => {\n    ctx.clearRect(0, 0, canvas.width, canvas.height);\n    ctx.fillStyle = 'black'; ctx.fillRect(0, 0, canvas.width, canvas.height);\n    updateGameObjects(); drawGameObjects(ctx);\n  }, 100);\n}` },
  { t: `p`, text: `Enter 键本身只是把按键转成一条 KEY_EVENT_ENTER 消息，订阅者里写一句 resetGame。第 15 课那句「加功能就是加一个监听」在这里兑现了。但要小心先后：clear 之后才能 initGame，否则刚注册的订阅者立刻被自己清掉，按 Enter 从此没有反应。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `结算字画完就被下一帧擦掉：只写了 displayMessage，忘了 clearInterval`,
    `重开不清监听器：第二次重开后一个空格射出两发激光、一次命中加两百分`,
    `重开只重置分数不重建敌人：画面上是空的，数组里还留着上一局的死人`,
    `胜负两个 if 不加 return：两种结束消息一起发，endGame 被调两遍`,
    `用「画面上还有几个敌人」当判定依据：每帧去数像素或数图形，既慢又和真值对不上`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `加第三条结束条件：敌人抵达画面底边算输——先决定这条判定放在检测里还是订阅者里`,
    `把 resetGame 里的 eventEmitter.clear 注释掉重开两局，观察分数和激光变成什么样，再解释原因`,
    `给结算画面加一行最终分数，并且保证它在循环停止之后仍然看得见`,
    `把 isHeroDead、isEnemiesDead 各测一次：手工造两种 gameObjects，不打开浏览器也要能验证结果`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：结束不是一个布尔值，而是一串善后动作——停循环、清监听、归零数据，缺一件，上一局就会混进下一局。` }
];
