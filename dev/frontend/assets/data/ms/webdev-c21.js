window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["webdev-c21"] = [
  { t: `tip`, color: `blue`, text: `本课目标：弄清单页应用里「切屏」到底切了什么——模板藏在哪儿、URL 怎么换成一块 DOM、被换掉的是不是全部。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `给应用做几屏，最直白的办法是一屏一个 HTML 文件，代价有两条：每次换屏整页重新下载重新解析，慢；屏与屏不共享内存，想留住一条数据只能靠 URL 参数或再问一遍后台。另一条路是全站只留一个 HTML，把每屏写成 template 元素——浏览器会把它连内容一起读进来，但不渲染、不占位，等 JavaScript 去取。切屏于是变成纯本地动作：从隐藏模板复制一份，塞进页面上那一个容器。` },
  { t: `p`, text: `路由是「哪个 URL 对应哪一屏」。多文件站点由服务器按路径自动对应，单页应用没有这层关系，得自己建一张表：路径作键、模板 id 作值，读 window.location.pathname 去查，查不到要有兜底。取模板的标准动作三步：按 id 拿到元素，对它内部的 content 做 cloneNode(true)，把克隆 appendChild 进容器；中间必须先清空容器，否则两屏叠在一起。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><text x="320" y="22" font-size="15" text-anchor="middle" fill="#22314e">一次点击换掉的只有中间那一块</text><rect x="20" y="46" width="180" height="200" rx="6" fill="#f7f8fb" stroke="#8896ad" stroke-dasharray="5 4"/><text x="110" y="68" font-size="14" text-anchor="middle" fill="#5b6a86">template 区（不渲染）</text><rect x="40" y="86" width="140" height="46" rx="4" fill="#eef4ff" stroke="#5b7fd1"/><text x="110" y="114" font-size="14" text-anchor="middle" fill="#22314e">id = login</text><rect x="40" y="146" width="140" height="46" rx="4" fill="#eef4ff" stroke="#5b7fd1"/><text x="110" y="174" font-size="14" text-anchor="middle" fill="#22314e">id = dashboard</text><text x="110" y="228" font-size="14" text-anchor="middle" fill="#5b6a86">原模板一直在，不动</text><rect x="230" y="86" width="150" height="106" rx="6" fill="#fff6e6" stroke="#c9922b"/><text x="305" y="108" font-size="14" text-anchor="middle" fill="#7a5310">路由表</text><text x="305" y="132" font-size="14" text-anchor="middle" fill="#7a5310">/login → login</text><text x="305" y="156" font-size="14" text-anchor="middle" fill="#7a5310">/dashboard → …</text><text x="305" y="180" font-size="14" text-anchor="middle" fill="#a5321f">查不到就回登录页</text><line x1="200" y1="139" x2="228" y2="139" stroke="#5b7fd1" stroke-width="2"/><text x="410" y="112" font-size="14" text-anchor="middle" fill="#5b6a86">克隆</text><text x="410" y="132" font-size="14" text-anchor="middle" fill="#5b6a86">插入</text><rect x="450" y="46" width="170" height="200" rx="6" fill="#f7f8fb" stroke="#8896ad"/><text x="535" y="68" font-size="14" text-anchor="middle" fill="#5b6a86">页面骨架（一直在）</text><rect x="470" y="86" width="130" height="106" rx="4" fill="#e8f6ee" stroke="#3d9a63"/><text x="535" y="112" font-size="14" text-anchor="middle" fill="#1d4230">div id = app</text><rect x="486" y="128" width="98" height="46" rx="3" fill="#ffffff" stroke="#3d9a63"/><text x="535" y="156" font-size="14" text-anchor="middle" fill="#1d4230">这一格被换</text><text x="535" y="228" font-size="14" text-anchor="middle" fill="#a5321f">换之前先清空</text><line x1="380" y1="139" x2="448" y2="139" stroke="#3d9a63" stroke-width="2"/><text x="320" y="278" font-size="14" text-anchor="middle" fill="#22314e">URL 变了、app 里的子节点变了，head 和模板一个字节都没重下</text></svg>`, caption: `看右边那块绿框：切屏改的是容器里的子节点，容器本身和左边那批隐藏模板都原地留着。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `换屏不发请求、不重下 HTML，页面秒切，交互更像桌面软件`,
    `地址栏里的 URL 是真的：能收藏、能发给同事、刷新回到同一屏`,
    `后退前进键照常工作，历史栈里每一条都是一个路径`,
    `数据可以取一次留在 JavaScript 变量里，几屏共用，不必每屏重新问后台`
  ] },
  { t: `h2`, text: `演示 1 · 两屏模板与一个挂载点` },
  { t: `code`, lang: `html`, code: `<body>\n  <div id="app">Loading...</div>\n  <template id="login">\n    <h1>Bank App</h1>\n    <section><a href="/dashboard" onclick="onLinkClick(event)">Login</a></section>\n  </template>\n  <template id="dashboard">\n    <header><h1>Bank App</h1><a href="/login" onclick="onLinkClick(event)">Logout</a></header>\n    <section>Balance: 100$</section>\n  </template>\n</body>` },
  { t: `p`, text: `打开页面肉眼看得见的只有那句 Loading。两个 template 是还没开工的图纸，一直卡在这儿，因为没人把它们复制出来。想先看成品长什么样，把 template 那两行注释掉即可——内容一旦脱离模板壳子就是普通 HTML，立刻显示。` },
  { t: `h2`, text: `演示 2 · 实例化模板的三步` },
  { t: `code`, lang: `javascript`, code: `function updateRoute(templateId) {\n  const template = document.getElementById(templateId);\n  const view = template.content.cloneNode(true);\n  const app = document.getElementById('app');\n  app.innerHTML = '';\n  app.appendChild(view);\n}\n\nupdateRoute('login');` },
  { t: `p`, text: `参数 true 是深拷贝：整棵树复制一份，改副本不碰原件，下次再进这屏还是干净的。倒数第三行那句赋空字符串是第一个要记住的细节——删掉它，第二次调用就把两屏摞在一起，你看到两个标题两张余额表，而这跟 CSS 无关。此刻屏是写死在代码里切的，地址栏没参与。` },
  { t: `h2`, text: `演示 3 · 路由表，以及查不到时` },
  { t: `code`, lang: `javascript`, code: `const routes = {\n  '/login': { templateId: 'login' },\n  '/dashboard': { templateId: 'dashboard' },\n};\nfunction updateRoute() {\n  const route = routes[window.location.pathname];\n  if (!route) return navigate('/login');\n  const view = document.getElementById(route.templateId).content.cloneNode(true);\n  const app = document.getElementById('app');\n  app.innerHTML = '';\n  app.appendChild(view);\n}` },
  { t: `p`, text: `函数不再接收参数，自己去地址栏读路径：同一份代码在 /login 和 /dashboard 上表现不同，纯由 URL 决定，手输地址也能工作。没命中就跳回登录页是唯一合理的兜底，否则错路径给你的是白屏加一句控制台报错。注意这版只读 URL，它不会改 URL。` },
  { t: `h2`, text: `演示 4 · 改地址栏、拦链接、接后退键` },
  { t: `code`, lang: `javascript`, code: `function navigate(path) {\n  window.history.pushState({}, path, path);\n  updateRoute();\n}\nfunction onLinkClick(event) {\n  event.preventDefault();\n  navigate(event.target.href);\n}\nwindow.onpopstate = () => updateRoute();\nupdateRoute();` },
  { t: `p`, text: `pushState 管「只改地址栏不动页面」那半边，往历史栈写一条新记录但不重载 HTML。a 标签默认是整页跳转，所以 preventDefault 必须调用，不然前面那套模板机制根本轮不到执行。最后两行是给首次进场的：pushState 既然写过历史，按后退触发的就是 popstate——浏览器只把 URL 改回去，不会替你重画屏幕，得自己监听再调一次 updateRoute；那句裸调用让第一次打开也能渲染出来。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `忘了清空容器：切两屏变叠两屏，看着像样式坏了，实际是 DOM 里真有两份`,
    `不监听 popstate：后退时地址栏变了画面不动，用户以为卡住，再点一下才刷新`,
    `给链接加了事件却不 preventDefault：一次整页跳转把内存里攒的数据全冲掉`,
    `路由表存 templateId 却忘了改函数签名：传进来的是路径、查的是 id，永远 undefined`,
    `刷新到 /dashboard 得 404：pushState 只改浏览器里的地址，服务器上没这个文件——本地 demo 用 hash 路由，或让服务器把未知路径兜到 index.html`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把两屏写进同一个 HTML，只用一次手工调用就让它显示出登录页`,
    `按后退前进键各五次，说出你的代码里哪一行在响应它；注释掉那行再对比现象`,
    `在地址栏手输一个路由表里没有的路径，解释为什么不能是白屏，并让它落到登录页`,
    `加第三屏「转账」，数清楚你要改哪几个地方，指出漏掉哪一处必定出问题`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：路由干的是「改地址栏」加「换容器里的子节点」两件事；模板原地不动，后退键能不能活取决于你有没有接上 popstate。` }
];
