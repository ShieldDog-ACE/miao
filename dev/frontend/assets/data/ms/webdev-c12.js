window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["webdev-c12"] = [
  { t: `tip`, color: `blue`, text: `本课目标：说清浏览器一个标签页里跑着哪些东西，以及扩展的 popup、content script、background 各自活在哪一块，边界在哪儿。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `浏览器本质上是一台文档解释机：地址栏里输入域名，先问 DNS 要 IP，走 HTTP 或 HTTPS 把 HTML、CSS、脚本取回来，解析引擎建出 DOM 树，样式算出渲染树，最后画到屏幕上。第 10 课那些 querySelector 之所以能拿到节点，就是因为这棵树在此之前已经建好了。` },
  { t: `p`, text: `关键是它的进程模型：浏览器主进程管界面和标签页，每个标签页单独一个渲染进程，渲染进程里主线程跑脚本、算样式、排布局，worker 线程另开。同一线程上你的脚本一跑长循环，页面就点不动——不是浏览器卡，是主线程被占住了。` },
  { t: `p`, text: `扩展不是塞进页面的一段脚本，而是浏览器另外划给它的执行环境。点图标弹出的那个小页面是 popup，它是一份独立的 HTML 文档；content script 被注入到目标页面里，能读写它的 DOM，但和页面自己的脚本处在隔离世界，彼此的变量互相看不见；background 没有界面，靠事件唤醒，负责监听请求、调接口、存东西。三者不共享内存，通信只能走浏览器提供的消息通道和存储。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><text x="320" y="22" font-size="15" text-anchor="middle" fill="#22314e">扩展的三个执行环境，隔在不同进程里</text><rect x="20" y="44" width="190" height="126" rx="4" fill="#f7f8fb" stroke="#8896ad"/><text x="115" y="66" font-size="15" text-anchor="middle" fill="#22314e">标签页 · 渲染进程</text><text x="115" y="90" font-size="14" text-anchor="middle" fill="#3d4c66">页面自己的脚本</text><text x="115" y="112" font-size="14" text-anchor="middle" fill="#3d4c66">content script</text><text x="115" y="134" font-size="14" text-anchor="middle" fill="#a5321f">隔离世界：DOM 共享</text><text x="115" y="156" font-size="14" text-anchor="middle" fill="#a5321f">变量互不可见</text><rect x="225" y="44" width="190" height="126" rx="4" fill="#eef4ff" stroke="#5b7fd1"/><text x="320" y="66" font-size="15" text-anchor="middle" fill="#22314e">popup 窗口</text><text x="320" y="90" font-size="14" text-anchor="middle" fill="#3d4c66">独立 HTML 文档</text><text x="320" y="112" font-size="14" text-anchor="middle" fill="#3d4c66">点图标才创建</text><text x="320" y="134" font-size="14" text-anchor="middle" fill="#a5321f">点别处即销毁</text><text x="320" y="156" font-size="14" text-anchor="middle" fill="#a5321f">内存留不住</text><rect x="430" y="44" width="190" height="126" rx="4" fill="#e8f6ee" stroke="#3d9a63"/><text x="525" y="66" font-size="15" text-anchor="middle" fill="#1d4230">background</text><text x="525" y="90" font-size="14" text-anchor="middle" fill="#3d4c66">service worker</text><text x="525" y="112" font-size="14" text-anchor="middle" fill="#3d4c66">无界面，事件唤醒</text><text x="525" y="134" font-size="14" text-anchor="middle" fill="#1d4230">发请求、读缓存</text><text x="525" y="156" font-size="14" text-anchor="middle" fill="#a5321f">空闲会被休眠</text><line x1="115" y1="170" x2="115" y2="200" stroke="#3d4c66" stroke-width="2"/><line x1="320" y1="170" x2="320" y2="200" stroke="#3d4c66" stroke-width="2"/><line x1="525" y1="170" x2="525" y2="200" stroke="#3d4c66" stroke-width="2"/><rect x="20" y="200" width="600" height="62" rx="4" fill="#fff8e6" stroke="#c9a227"/><text x="320" y="224" font-size="15" text-anchor="middle" fill="#22314e">唯一的路：浏览器中转的 runtime 消息 + storage 存储</text><text x="320" y="248" font-size="14" text-anchor="middle" fill="#3d4c66">popup 发一条消息，background 收到、算完、再回一句 —— 没有共享变量这条路</text></svg>`, caption: `三个框是三个不同的执行环境，只有中间那条通道能把它们连起来。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `给页面加一层自己的界面：在图标下面挂一个小窗口，不占标签页`,
    `改别人家的 DOM：把某个站点上的元素换掉或删掉`,
    `拦住请求再放行：看 URL 决定要不要修改内容`,
    `把用户偏好留在本机：不上传，重装浏览器前一直在`
  ] },
  { t: `h2`, text: `演示 1 · 清单文件：浏览器靠它认识你` },
  { t: `code`, lang: `javascript`, code: `{` +
`\n  "manifest_version": 3,` +
`\n  "name": "Carbon Footprint",` +
`\n  "version": "1.0",` +
`\n  "permissions": ["storage"],` +
`\n  "host_permissions": ["https://api.co2signal.com/*"],` +
`\n  "action": { "default_popup": "index.html" },` +
`\n  "background": { "service_worker": "background.js" }` +
`\n}` },
  { t: `p`, text: `清单不是配置摆设，它决定浏览器给不给你权限：popup 字段决定点图标弹哪个文档，service_worker 字段决定后台跑哪个文件，permissions 里没有的域名，脚本发请求就会被拦。清单改了必须回扩展页点一次重新加载，只刷标签页是没用的。` },
  { t: `h2`, text: `演示 2 · 界面骨架：一屏两态` },
  { t: `code`, lang: `html`, code: `<form class="form-data" autocomplete="on">` +
`\n  <div><label for="region">区域名称</label>` +
`\n    <input type="text" id="region" required class="region-name" /></div>` +
`\n  <div><label for="api">你的接口密钥</label>` +
`\n    <input type="text" id="api" required class="api-key" /></div>` +
`\n  <button class="search-btn">提交</button>` +
`\n</form>` },
  { t: `p`, text: `第一态是配置：两个必填输入，label 用 for 绑到 input 上（第 3 课那条无障碍要求在这儿仍然成立）。扩展窗口的宽度由 CSS 撑，撑不满也不会像网页那样自动铺满屏幕。` },
  { t: `code`, lang: `html`, code: `<div class="result">` +
`\n  <div class="loading">loading...</div>` +
`\n  <div class="errors"></div>` +
`\n  <div class="result-container">` +
`\n    <p><strong>区域：</strong><span class="my-region"></span></p>` +
`\n    <p><strong>碳排放：</strong><span class="carbon-usage"></span></p>` +
`\n  </div>` +
`\n  <button class="clear-btn">换个区域</button>` +
`\n</div>` },
  { t: `p`, text: `第二态是结果：空 span 先摆在那儿，脚本后面只往 textContent 里填数，不重建结构。loading 和 errors 两个容器也提前留好，请求失败时才有地方说话。` },
  { t: `h2`, text: `演示 3 · popup 里的第一段脚本` },
  { t: `code`, lang: `javascript`, code: `const form = document.querySelector('.form-data');` +
`\nconst region = document.querySelector('.region-name');` +
`\nconst btn = document.querySelector('.search-btn');` +
`\n` +
`\nbtn.addEventListener('click', function (event) {` +
`\n  event.preventDefault();` +
`\n  const value = region.value;` +
`\n  // 到这里 value 只活在 popup 这个文档里` +
`\n});` },
  { t: `p`, text: `这段代码的运行环境就是 popup 那份独立文档：document 只包含窗口里的节点，抓不到标签页上的任何东西。按钮在 form 里，不 preventDefault 就会触发提交、把整个窗口刷掉，第 10 课那个「点击之后页面跳走」的坑在这儿一模一样地复发。还有一件事要记住：浏览器加载的是构建输出目录 dist（清单、index.html、background.js、打包后的 main.js 都在那儿），而不是项目根目录——选错目录，扩展根本起不来；src 下你写的源码只交给构建工具。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `只改标签页不重新加载扩展：后台脚本和清单都还是旧的，改动看不见`,
    `开扩展页忘了切开发者模式：根本没有加载已解压扩展这个入口`,
    `在 popup 里写 document.querySelector 抓页面上的元素：抓到 null，两个文档压根不是一份`,
    `清单没写 host_permissions 就去调第三方接口：本地一切正常，请求被静默拒绝`,
    `把接口密钥硬写进源码提交进仓库：密钥一旦进历史就删不干净`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `写一份最小清单，让扩展的图标点开一个只有标题的空白页面，并说出是哪个字段起了作用`,
    `把配置态和结果态两段 HTML 搭进同一个页面，说明脚本靠什么在两者之间切换显示`,
    `在扩展页里把目录选错一次，看它报什么，再选对，讲出 dist 和根目录的差别`,
    `在 popup 脚本里点按钮但不写 preventDefault，观察窗口发生了什么，解释原因`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：扩展不是一段跑在网页里的脚本，而是几个各有各地址、只能靠消息来往的执行环境——想清楚数据在哪一块，bug 就好找了。` }
];
