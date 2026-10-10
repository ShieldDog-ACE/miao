window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["webdev-c23"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把一条数据从 fetch 走到像素，说清中间换了几次形状、哪一步把它存进了变量、渲染又凭什么是路由替它喊的。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `老式多页站点里，数据是服务器写进 HTML 再发过来的：那个余额数字在来路上就已经是字符了，浏览器只管显示。单页应用拿到的是一段 JSON 文本，屏幕上那一格是空的，转换得在客户端做完：发请求、把文本解析成对象、放进变量、再按变量给 DOM 一格一格赋值。少任何一步，页面就停在「Loading」或上一屏的旧数上。` },
  { t: `p`, text: `放数据的那个变量是这一课的关键，也是隐患：app.js 顶部一句 let account = null，谁登录成功就把它指向刚取来的对象，仪表盘和后面的转账屏都读它。它是模块级变量，活在当前文档里，刷新一次就回到 null。渲染挂在路由上更合理：路由表里给每个屏留一个 init 字段，updateRoute 贴完模板检查一下它是不是函数，是就调用——于是「切到这一屏」和「把这一屏的数据填上」是同一个动作，不会忘。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><text x="320" y="22" font-size="15" text-anchor="middle" fill="#22314e">一条余额的四段路</text><rect x="16" y="52" width="140" height="66" rx="6" fill="#eef4ff" stroke="#5b7fd1"/><text x="86" y="76" font-size="14" text-anchor="middle" fill="#22314e">fetch GET</text><text x="86" y="98" font-size="14" text-anchor="middle" fill="#5b6a86">/api/accounts/test</text><rect x="176" y="52" width="130" height="66" rx="6" fill="#fff6e6" stroke="#c9922b"/><text x="241" y="76" font-size="14" text-anchor="middle" fill="#7a5310">一串文本</text><text x="241" y="98" font-size="14" text-anchor="middle" fill="#7a5310">balance: 75</text><rect x="326" y="52" width="130" height="66" rx="6" fill="#f7eefb" stroke="#8a5bb0"/><text x="391" y="76" font-size="14" text-anchor="middle" fill="#4d2f66">json 解析</text><text x="391" y="98" font-size="14" text-anchor="middle" fill="#4d2f66">变成一个对象</text><rect x="476" y="52" width="148" height="66" rx="6" fill="#e8f6ee" stroke="#3d9a63"/><text x="550" y="76" font-size="14" text-anchor="middle" fill="#1d4230">account = data</text><text x="550" y="98" font-size="14" text-anchor="middle" fill="#1d4230">存进模块变量</text><line x1="156" y1="85" x2="174" y2="85" stroke="#5b6a86" stroke-width="2"/><line x1="306" y1="85" x2="324" y2="85" stroke="#5b6a86" stroke-width="2"/><line x1="456" y1="85" x2="474" y2="85" stroke="#5b6a86" stroke-width="2"/><rect x="476" y="150" width="148" height="66" rx="6" fill="#e8f6ee" stroke="#3d9a63"/><text x="550" y="174" font-size="14" text-anchor="middle" fill="#1d4230">route.init()</text><text x="550" y="196" font-size="14" text-anchor="middle" fill="#1d4230">textContent 赋值</text><rect x="326" y="150" width="130" height="66" rx="6" fill="#ffffff" stroke="#3d9a63"/><text x="391" y="174" font-size="14" text-anchor="middle" fill="#1d4230">span 里有数了</text><text x="391" y="196" font-size="14" text-anchor="middle" fill="#5b6a86">用户看见</text><line x1="550" y1="118" x2="550" y2="148" stroke="#3d9a63" stroke-width="2"/><line x1="474" y1="183" x2="458" y2="183" stroke="#5b6a86" stroke-width="2"/><path d="M160 150 h140 v66 h-140 z" fill="#fdf1ef" stroke="#c0574a" stroke-dasharray="5 4"/><text x="230" y="176" font-size="14" text-anchor="middle" fill="#a5321f">按 F5</text><text x="230" y="198" font-size="14" text-anchor="middle" fill="#a5321f">变量回到 null</text><line x1="160" y1="118" x2="160" y2="150" stroke="#c0574a" stroke-dasharray="5 4"/><text x="320" y="278" font-size="14" text-anchor="middle" fill="#22314e">数据只在这条链的末端才变成画面；中途它一直是 JavaScript 的对象，跟着文档一起没</text></svg>`, caption: `上面那排是取数的路，右下是渲染；左下那块虚线框提醒：存的地方是内存，刷新就断。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `只在进登录那一步取一次数，之后几屏读同一个对象，不再反复问后台`,
    `切屏顺手刷新这一屏该显示的内容，不用手写一串「点了按钮之后要干什么」`,
    `后台换字段只改赋值那几行，模板结构不动`,
    `错误有地方放：不写进控制台，写在用户正在看的那一格旁边`
  ] },
  { t: `h2`, text: `演示 1 · 取数：从输入框到一个对象` },
  { t: `code`, lang: `javascript`, code: `async function getAccount(user) {\n  const response = await fetch('/api/accounts/' + encodeURIComponent(user));\n  if (!response.ok) return { error: '查不到这个账户' };\n  return await response.json();\n}\nasync function login() {\n  const user = document.getElementById('loginForm').user.value;\n  const data = await getAccount(user);\n  if (data.error) return updateElement('loginError', data.error);\n  account = data;\n  navigate('/dashboard');\n}` },
  { t: `p`, text: `form 元素的属性就是控件的 name，所以 form.user.value 比再写一次 getElementById 短，前提是 name 别漏。encodeURIComponent 不是装饰：用户名里的 # 和 / 会被当成 URL 的一部分，不转义就送错了地址，取回别人的账户。json() 也是异步的，它把文本解析成对象，前面还要 await。` },
  { t: `h2`, text: `演示 2 · 渲染挂在路由上` },
  { t: `code`, lang: `javascript`, code: `const routes = {\n  '/login': { templateId: 'login' },\n  '/dashboard': { templateId: 'dashboard', init: updateDashboard },\n};\nfunction updateRoute() {\n  const route = routes[window.location.pathname];\n  if (!route) return navigate('/login');\n  const view = document.getElementById(route.templateId).content.cloneNode(true);\n  const app = document.getElementById('app');\n  app.innerHTML = ''; app.appendChild(view);\n  if (typeof route.init === 'function') route.init();\n}` },
  { t: `p`, text: `init 存的是函数本身，没加括号——写了括号就是在这一行执行一次，而 routes 在文件顶部，那时候 account 还是 null。最后一行是全部机关：不管用户是点链接、按后退还是手输地址，只要落到 /dashboard，填数那步就跟着跑，一屏一次。` },
  { t: `h2`, text: `演示 3 · 填 DOM：textContent，不是 innerHTML` },
  { t: `code`, lang: `javascript`, code: `let account = null;\nfunction updateElement(id, text) {\n  document.getElementById(id).textContent = text;\n}\nfunction updateDashboard() {\n  if (!account) return navigate('/login');\n  updateElement('description', account.description);\n  updateElement('balance', account.balance.toFixed(2));\n  updateElement('currency', account.currency);\n  updateTransactions();\n}` },
  { t: `p`, text: `模板里那些位置先留空：span 的 id 是 balance 和 currency，描述用 h2——标题层级也是给读屏软件用的。textContent 把右边当纯文本塞进去；innerHTML 会重新解析 HTML，用户把账户描述填成一段脚本标签就直接执行，这是最省事的注入入口。toFixed(2) 让 75 显示成 75.00，货币零头交给显示层，别去动后台那个数。` },
  { t: `h2`, text: `演示 4 · 一串交易行：模板 + fragment` },
  { t: `code`, lang: `javascript`, code: `const tbody = document.getElementById('transactions');\nconst fragment = document.createDocumentFragment();\nfor (const tx of account.transactions) {\n  const row = document.getElementById('transaction').content.cloneNode(true);\n  const cell = row.querySelectorAll('td');\n  cell[0].textContent = tx.date;\n  cell[1].textContent = tx.object;\n  cell[2].textContent = tx.amount + account.currency;\n  fragment.append(row);\n}\ntbody.innerHTML = '';\ntbody.append(fragment);` },
  { t: `p`, text: `一行三格的 tr 只写一遍放在 template 里，循环只负责克隆和填字。fragment 是个不带外观的容器：十次 append 先进这里，最后一次 tbody.append 才动真 DOM——浏览器只做一次重排。直接往 tbody 里加，就是每行都重算一遍布局，行多了就卡。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `把 init 写成 init: updateDashboard()：路由表定义那刻就执行，account 还是空，之后每次切屏也不再刷新`,
    `用 innerHTML 拼用户数据图省事：省了两行代码，换来一个能执行任意脚本的口子`,
    `只处理网络失败不处理状态码：fetch 对 404 照样 resolve，不查 response.ok 就是把「查无此人」当成成功`,
    `前端和后台跑在不同端口就以为同源：3000 调 5000 要对方带 CORS 头，报的是浏览器安全策略而不是你的代码`,
    `错误只 console.log：用户看不见；给一格空 div 加上 role 为 alert，填字就会被即时播报`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把登录到仪表盘这条链跑通，并在 DevTools 的 Network 面板里指出那条 JSON 请求是谁发的`,
    `故意让后台返回 404，看你现在的代码显示什么，改成一屏上看得见的一句提示`,
    `给交易列表加第三列「类型」，说明你要动模板还是动循环里的第几行`,
    `在仪表盘上按 F5，记下发生了什么，并说出它为什么必然发生`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：数据是文本、解析成对象、存在模块变量里、最后一步才碰 DOM；前三步都在同一个文档里，所以刷新会全没——这是下一课要解决的那个洞。` }
];
