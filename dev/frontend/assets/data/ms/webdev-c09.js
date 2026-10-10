window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["webdev-c09"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把「为什么这条规则没生效」讲清楚——层叠的顺序、特异性的算法、盒模型的边界各管一段。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `CSS 的名字里那两个词才是核心：层叠（Cascading）说的是多条规则撞在一起时谁赢。判定顺序是三件事：来源与 !important、选择器的特异性、写在文件里的先后。特异性可以数：id 记一百，class、属性选择器和伪类记十，元素和伪元素记一。同分才看谁写得晚。` },
  { t: `p`, text: `第二条线是盒模型：每个元素都是一个矩形，由内到外是内容、内边距、边框、外边距。默认算法下 width 只管内容宽度，padding 和 border 要另加，所以一个 100% 宽加 1rem 内边距的盒子必定超出父容器一条缝。box-sizing 换成 border-box，width 就变成含内边距和边框的总宽，布局算起来才是直觉里的那个意思。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280" font-family="sans-serif"><text x="320" y="20" font-size="15" text-anchor="middle" fill="#22314e">同一个盒子，两种算法</text><rect x="24" y="42" width="280" height="200" rx="4" fill="#f7f8fb" stroke="#8896ad"/><text x="164" y="66" font-size="15" text-anchor="middle" fill="#22314e">box-sizing: content-box（默认）</text><rect x="52" y="86" width="224" height="128" fill="#cfe3ff" stroke="#5b7fd1"/><text x="164" y="106" font-size="14" text-anchor="middle" fill="#22314e">border 2px</text><rect x="66" y="120" width="196" height="72" fill="#eef4ff" stroke="#5b7fd1" stroke-dasharray="4 3"/><text x="164" y="140" font-size="14" text-anchor="middle" fill="#22314e">padding 1rem</text><rect x="94" y="150" width="140" height="34" fill="#ffffff" stroke="#3d4c66"/><text x="164" y="172" font-size="14" text-anchor="middle" fill="#22314e">width = 内容宽</text><text x="164" y="226" font-size="14" text-anchor="middle" fill="#a5321f">占位 = 100% + 内边距 + 边框 → 溢出</text><rect x="336" y="42" width="280" height="200" rx="4" fill="#f7f8fb" stroke="#8896ad"/><text x="476" y="66" font-size="15" text-anchor="middle" fill="#1d4230">box-sizing: border-box</text><rect x="364" y="86" width="224" height="128" fill="#cfe3ff" stroke="#5b7fd1"/><text x="476" y="106" font-size="14" text-anchor="middle" fill="#22314e">border 2px</text><rect x="378" y="120" width="196" height="72" fill="#e8f6ee" stroke="#3d9a63" stroke-dasharray="4 3"/><text x="476" y="140" font-size="14" text-anchor="middle" fill="#1d4230">padding 1rem</text><rect x="406" y="150" width="140" height="34" fill="#ffffff" stroke="#3d4c66"/><text x="476" y="172" font-size="14" text-anchor="middle" fill="#22314e">内容自己缩小</text><text x="476" y="226" font-size="14" text-anchor="middle" fill="#1d4230">占位 = width，写多少就是多少</text></svg>`, caption: `两条线差别只在 width 这个数包不包含内边距和边框——溢出还是对齐，全在这儿。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `一处改动全站生效：样式在文件里，结构不用跟着动`,
    `把同一套外观给一批元素：一个 class 挂上去，十四盆植物一起有位置`,
    `按屏幕宽度换布局：同一份 HTML 在手机上是竖排、桌面是三栏`,
    `做状态外观：hover、focus、active 这些伪类把交互交给浏览器，不写一行脚本`
  ] },
  { t: `h2`, text: `演示 1 · 三种挂法与层叠顺序` },
  { t: `code`, lang: `html`, code: `<!-- 内联：写在标签上，特异性最高，最难维护 -->\n<h1 style="color: red">My Terrarium</h1>\n\n<!-- 内部：样式表写在 head 里，只影响这一页 -->\n<style>\n  h1 { color: blue; }\n</style>\n\n<!-- 外部：单独文件，全站共享 —— 默认选这个 -->\n<link rel="stylesheet" href="./style.css" />` },
      { t: `p`, text: `三条同时存在时红赢：内联的特异性高于任何选择器。外部文件的价值不在优先级而在复用和缓存——一份 style.css 被 HTML 引一次，改一次全站跟着变。反过来说，正因为内联最难被覆盖也最难被找到，它是「临时救急」而不是写法。` },
  { t: `h2`, text: `演示 2 · 特异性算术` },
  { t: `code`, lang: `css`, code: `div { color: blue; }            /* 1 —— 元素 */` +
`\nh1 { color: red; }             /* 1 */` +
`\n.special { color: green; }     /* 10 —— 类 */` +
`\n#title { color: purple; }      /* 100 —— id */` +
`\nh1.special { color: teal; }    /* 11 —— 元素 + 类，胜过 .special */` +
`\nbody h1.special { color: gold; }   /* 12 —— 加祖先，还是 11 赢不过 id */` +
`\n\n/* 同分时后来者赢，所以 import 顺序也是设计 */` +
`\n@import "./reset.css";` +
`\n@import "./layout.css";` +
`\n@import "./theme.css";` },
  { t: `p`, text: `特异性不是加权平均而是逐位比较：100 那条永远赢过 12，别指望多写几个选择器压过 id。真出现压不动的情况，正确答案通常是回去改 HTML 的结构或 class 名字，而不是再叠一层选择器——叠上去的代价是三个月后没人敢删。` },
  { t: `h2`, text: `演示 3 · 用 class 收复用，用 id 做锚点` },
  { t: `code`, lang: `css`, code: `.container {` +
`\n  position: absolute;` +
`\n  top: 0;` +
`\n  width: 15%;` +
`\n  height: 100vh;` +
`\n  padding: 1rem;` +
`\n  box-sizing: border-box;` +
`\n}` +
`\n#left-container  { left: 0; }` +
`\n#right-container { right: 0; }` },
      { t: `p`, text: `左右两栏八行外观完全相同，就抽成一个 class，id 只留「这一栏独有一边贴左、一边贴右」那一条。反过来写两套各八行的 id 规则，改一次间距要记得改两处——这类「改了一处忘了另一处」的 bug 在 CSS 里不响，只会长得不太对。id 另一层意义是给脚本和锚点用（第三课 skip 链接指的就是 id）。` },
  { t: `h2`, text: `演示 4 · 定位与一条媒体查询` },
  { t: `code`, lang: `css`, code: `/* 子元素按父容器定位：父 relative 造包含块，子 absolute */` +
`\n.plant-holder { position: relative; height: 13%; }` +
`\n.plant { position: absolute; max-width: 150%; z-index: 2; }` +
`\n.plant:hover { transform: scale(1.05); }` +
`\n\n/* 屏宽 700 以下：两侧栏挪到顶上横着排 */` +
`\n@media (max-width: 700px) {` +
`\n  .container { position: static; width: 100%; height: auto; }` +
`\n  .jar-walls { width: 90%; left: 5%; }` +
`\n}` },
      { t: `p`, text: `absolute 是相对最近的已定位祖先，不是相对页面——父级没写 relative 时它会一路找到 body，位置完全对不上，这是「明明写了 top 却贴到屏幕角」的原因。媒体查询里先把 position 改回 static，等于把盒子放回正常流，再重新给宽高；不撤定位就改宽度，两条规则会互相拉扯。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `用 !important 硬压：特异性问题被盖住但没解决，下次冲突只能再加一个，最后只剩一堆 !important`,
    `选择器全用 id 串成一长链：改一下 HTML 结构整条规则失效，而报错信息是零`,
    `width 写 100% 再加 padding：默认盒模型下必然溢出，先声明 box-sizing: border-box`,
    `靠 position 堆布局：一个 absolute 忘了父级 relative，元素全叠到左上角`,
    `只在桌面宽度调完就交付：没写 viewport（上一课那条）和媒体查询，手机上是缩小版桌面`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `给上一课那个玻璃罐页面补样式，让左右两栏用同一套 class、各自用 id 定边`,
    `故意写两条冲突规则，先猜哪条赢，再用 DevTools 的 Computed 面板验证，并说出特异性的位数`,
    `把一个盒子调到你手机上（真机）不溢出，说明你改动的是 width、padding 还是 box-sizing`,
    `用媒体查询把三栏改成一栏，并列出你需要撤掉的定位属性`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：样式没生效从来不是玄学——不是特异性压过了你，就是盒模型不是你算的那个宽度。` }
];
