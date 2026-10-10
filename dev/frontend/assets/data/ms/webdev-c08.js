window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["webdev-c08"] = [
  { t: `tip`, color: `blue`, text: `本课目标：看清 HTML 描述的是结构而不是长相，以及浏览器把这段结构变成 DOM 树时丢掉了什么。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `HTML 是一份带标注的文档：标签说明「这段东西是什么」，嵌套说明「它属于谁」。浏览器读完它，在内存里搭出一棵树——每个标签成为节点，父子关系来自书写位置。你在控制台里操作的东西、第三课讲的无障碍树，都是这棵树的派生结果，所以 HTML 写歪了，后面每一层都跟着歪。` },
  { t: `p`, text: `浏览器解析时还会做一件不太老实的事：补齐。你漏了闭合标签、把内容写在 html 外面，它不会报错，而是猜一个意思继续走。猜的结果和你想要的经常不同，这就是「页面在 Chrome 里看起来对，结构其实坏了」的由来。检查办法不是用眼睛看长相，是展开 DevTools 的 Elements 面板看树的形状。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260" font-family="sans-serif"><text x="150" y="20" font-size="15" text-anchor="middle" fill="#22314e">你写的</text><text x="490" y="20" font-size="15" text-anchor="middle" fill="#22314e">浏览器得到的</text><text x="20" y="46" font-size="14" fill="#3d4c66">!DOCTYPE html</text><text x="20" y="68" font-size="14" fill="#3d4c66">html</text><text x="40" y="90" font-size="14" fill="#3d4c66">head</text><text x="60" y="112" font-size="14" fill="#3d4c66">title</text><text x="60" y="134" font-size="14" fill="#3d4c66">meta charset</text><text x="40" y="156" font-size="14" fill="#3d4c66">body</text><text x="60" y="178" font-size="14" fill="#3d4c66">h1</text><text x="60" y="200" font-size="14" fill="#3d4c66">div #terrarium</text><text x="80" y="222" font-size="14" fill="#3d4c66">img .plant</text><circle cx="400" cy="52" r="14" fill="#eef4ff" stroke="#5b7fd1"/><text x="400" y="57" font-size="14" text-anchor="middle" fill="#22314e">doc</text><circle cx="400" cy="96" r="14" fill="#eef4ff" stroke="#5b7fd1"/><text x="400" y="101" font-size="14" text-anchor="middle" fill="#22314e">html</text><circle cx="340" cy="142" r="14" fill="#e8f6ee" stroke="#3d9a63"/><text x="340" y="147" font-size="14" text-anchor="middle" fill="#1d4230">head</text><circle cx="470" cy="142" r="14" fill="#fdf0e6" stroke="#c2732b"/><text x="470" y="147" font-size="14" text-anchor="middle" fill="#5c3410">body</text><circle cx="300" cy="186" r="12" fill="#e8f6ee" stroke="#3d9a63"/><text x="300" y="191" font-size="14" text-anchor="middle" fill="#1d4230">t</text><circle cx="350" cy="186" r="12" fill="#e8f6ee" stroke="#3d9a63"/><text x="350" y="191" font-size="14" text-anchor="middle" fill="#1d4230">m</text><circle cx="440" cy="186" r="12" fill="#fdf0e6" stroke="#c2732b"/><text x="440" y="191" font-size="14" text-anchor="middle" fill="#5c3410">h1</text><circle cx="510" cy="186" r="12" fill="#fdf0e6" stroke="#c2732b"/><text x="510" y="191" font-size="14" text-anchor="middle" fill="#5c3410">div</text><circle cx="560" cy="224" r="12" fill="#fdf0e6" stroke="#c2732b"/><text x="560" y="229" font-size="14" text-anchor="middle" fill="#5c3410">img</text><line x1="400" y1="66" x2="400" y2="82" stroke="#8896ad" stroke-width="2"/><line x1="392" y1="108" x2="348" y2="130" stroke="#8896ad" stroke-width="2"/><line x1="408" y1="108" x2="462" y2="130" stroke="#8896ad" stroke-width="2"/><line x1="334" y1="154" x2="306" y2="176" stroke="#8896ad" stroke-width="2"/><line x1="346" y1="154" x2="350" y2="174" stroke="#8896ad" stroke-width="2"/><line x1="464" y1="154" x2="440" y2="176" stroke="#8896ad" stroke-width="2"/><line x1="476" y1="154" x2="506" y2="176" stroke="#8896ad" stroke-width="2"/><line x1="516" y1="198" x2="554" y2="214" stroke="#8896ad" stroke-width="2"/><text x="215" y="248" font-size="14" fill="#8a5a10">左边的缩进只是给人看的，真正的父子关系由闭合位置决定；右边多出来的 doc 节点不是你写的标签。</text></svg>`, caption: `同一份源码，两种读法：人看缩进，浏览器看闭合。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `把文字、图片、链接组织成有层级的页面，不写一行样式也能被读屏器和搜索引擎理解`,
    `给 CSS 提供挂靠点：id 和 class 是选择器要抓的东西，先起好名字后面省事`,
    `给 JavaScript 提供目标：树上有节点，脚本才有的可改`,
    `声明字符集和视口，避免中文乱码和手机上页面缩成一条`
  ] },
  { t: `h2`, text: `演示 1 · 一份骨架` },
  { t: `code`, lang: `html`, code: `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="utf-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1" />\n  <title>Virtual Terrarium</title>\n</head>\n<body>\n  <h1>My Terrarium</h1>\n  <div id="terrarium"></div>\n</body>\n</html>` },
      { t: `p`, text: `第一行的 DOCTYPE 不是标签而是模式声明：漏了它浏览器退到兼容模式渲染，同一个 CSS 会量出不同结果。head 里的两条 meta 各有各的活：charset 决定字节怎么解释成文字，viewport 决定手机上「一屏有多宽」，title 是标签页和搜索结果里那一行。charset 要写在最前面，晚于头 1024 字节就晚了。body 里才开始是真的能看见的内容。` },
  { t: `h2`, text: `演示 2 · 元素、属性与自闭合` },
  { t: `code`, lang: `html`, code: `<img class="plant" id="plant1" src="./images/plant1.png" alt="窗台上的蕨类" />\n<a href="https://example.com" target="_blank" rel="noopener">看例子（新窗口打开）</a>\n<input type="text" id="name" placeholder="名字" />\n<ul>\n  <li>第一项</li>\n  <li>第二项</li>\n</ul>` },
      { t: `p`, text: `属性是给浏览器和后面脚本的配置项，斜杠结尾的 img、input 是空元素——它们不包内容，所以没有闭合标签。alt 不是提示文字而是替代内容：图挂了要显示它，读屏器要念它（第三课那条）。target 是新窗口时得写清「会新开窗口」，别把用户突然带走。` },
  { t: `h2`, text: `演示 3 · 块级与行内` },
  { t: `code`, lang: `html`, code: `<p>这一段里有一个 <span>行内</span> 的强调，<strong>重要</strong> 的两级。</p>\n<div class="row">独占一行的容器</div>\n<p>排版顺序由块的先后决定，而不是由 <em>emphasis</em> 的样式决定。</p>` },
      { t: `p`, text: `块级元素（div、p、h1、ul）自己占一行并构成盒子的父子层级；行内元素（span、a、em、strong）待在文字流里。选谁的标准是「它在语义上是不是一段独立内容」，而不是「我需要它换行」——后者归样式管，后面单独一课正面讲它。` },
  { t: `h2`, text: `演示 4 · 少写点 div` },
  { t: `code`, lang: `html`, code: `<!-- 能用语义标签的地方，div 是退路不是首选 -->\n<main>\n  <article>\n    <h2>蕨类怎么养</h2>\n    <figure>\n      <img src="./fern.png" alt="一株展开的蕨叶" />\n      <figcaption>图一：叶片背面有孢子囊</figcaption>\n    </figure>\n  </article>\n</main>` },
      { t: `p`, text: `同样是容器，main、article、figure 会各自在无障碍树上留地标，读屏器有快捷键能跳；换成 div 就什么都留不下。第三课那句「语义标签自动解决七成问题」在这里落地：结构选对了，样式和脚本反而更省事，因为选择器不用靠猜。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `标签不闭合或交叉闭合：浏览器默默补齐，树形和你以为的不一样，CSS 一选就选歪`,
    `id 在一份页面里出现两次：脚本只拿得到第一个，另一半永远没反应`,
    `全篇 div 加 class 命名，结构靠猜：读屏器读不出一层意思，样式一改全盘散架`,
    `漏掉 viewport 那条 meta：手机上按桌面宽度渲染，字小得像发票`,
    `用 img 的 width 属性做响应式：那是显示像素不是布局，尺寸交给 CSS，图片本身还要给 srcset`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `手写一份骨架（不许用编辑器的自动补全模板），然后展开 DevTools 的 Elements 面板核对树形是否和源码的闭合一致`,
    `把一个纯 div 的页面结构改成语义标签，再用第三课教的无障碍面板说出多了哪些地标`,
    `故意漏掉一个闭合标签和一个 charset，分别描述页面出了什么现象`,
    `给一个图加 figure 和 figcaption，并写出 alt 与 figcaption 分工的差别`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：HTML 决定页面「是什么结构」，长相归 CSS，行为归脚本——先想清层级再敲标签，返工都在后面那两课。` }
];
