window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["webdev-c24"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把上一课那个「刷新就没」的洞补上——状态集中在一个对象里、只从一个函数写、落盘和读盘各一次，顺序还不能颠倒。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `上一课结尾那个 let account 有三个症状：按 F5 就被打回登录页，因为它是文档里的变量；登录、注册、刷新仪表盘几处代码都在各自改它，想知道「余额什么时候变的」得翻四个函数；点退出只把界面切走，那个对象还挂在内存里。三条的根子是同一件事——状态散在页面的动作里，没有一个统一的入口和一份统一的存放。` },
  { t: `p`, text: `集中化就是把状态收进一个对象，并且只允许一个函数写它：updateState 拿旧对象摊开、覆盖要改的那个键、冻住，赋回给 state。老对象没人改了，谁看到什么状态一目了然，出错也能追到具体是哪一次调用。至于「刷新就不在内存里了」，答案是换一个活得比文档久的地方存：localStorage 按站点存键值，浏览器关了还在；它只认字符串，所以写之前 JSON.stringify、读之后 JSON.parse。第 13 课给浏览器扩展存设置用的是同一个 API，差别在那边只存几个字，这边存的是整个账户。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><text x="320" y="22" font-size="15" text-anchor="middle" fill="#22314e">写只有一个口，读要排队等它</text><rect x="16" y="46" width="150" height="52" rx="6" fill="#eef4ff" stroke="#5b7fd1"/><text x="91" y="70" font-size="14" text-anchor="middle" fill="#22314e">用户动作</text><text x="91" y="90" font-size="14" text-anchor="middle" fill="#5b6a86">登录 / 注册 / 退出</text><rect x="196" y="46" width="160" height="52" rx="6" fill="#fff6e6" stroke="#c9922b"/><text x="276" y="70" font-size="14" text-anchor="middle" fill="#7a5310">updateState</text><text x="276" y="90" font-size="14" text-anchor="middle" fill="#7a5310">摊开 + 覆盖 + 冻住</text><rect x="386" y="46" width="110" height="52" rx="6" fill="#f7eefb" stroke="#8a5bb0"/><text x="441" y="70" font-size="14" text-anchor="middle" fill="#4d2f66">state</text><text x="441" y="90" font-size="14" text-anchor="middle" fill="#4d2f66">内存，F5 就没</text><rect x="386" y="130" width="110" height="52" rx="6" fill="#e8f6ee" stroke="#3d9a63"/><text x="441" y="154" font-size="14" text-anchor="middle" fill="#1d4230">localStorage</text><text x="441" y="174" font-size="14" text-anchor="middle" fill="#1d4230">磁盘，跨会话</text><line x1="166" y1="72" x2="194" y2="72" stroke="#5b6a86" stroke-width="2"/><line x1="356" y1="72" x2="384" y2="72" stroke="#5b6a86" stroke-width="2"/><line x1="441" y1="98" x2="441" y2="128" stroke="#3d9a63" stroke-width="2"/><text x="497" y="118" font-size="14" text-anchor="middle" fill="#1d4230">顺手写一次</text><rect x="16" y="196" width="150" height="52" rx="6" fill="#fdf1ef" stroke="#c0574a"/><text x="91" y="220" font-size="14" text-anchor="middle" fill="#a5321f">刷新 / 重开浏览器</text><text x="91" y="240" font-size="14" text-anchor="middle" fill="#a5321f">文档重建，变量归零</text><rect x="196" y="196" width="160" height="52" rx="6" fill="#ffffff" stroke="#c0574a"/><text x="276" y="220" font-size="14" text-anchor="middle" fill="#a5321f">init 先读盘</text><text x="276" y="240" font-size="14" text-anchor="middle" fill="#a5321f">parse → updateState</text><rect x="386" y="196" width="110" height="52" rx="6" fill="#ffffff" stroke="#3d9a63"/><text x="441" y="220" font-size="14" text-anchor="middle" fill="#1d4230">再 updateRoute</text><text x="441" y="240" font-size="14" text-anchor="middle" fill="#1d4230">才轮得到渲染</text><line x1="166" y1="222" x2="194" y2="222" stroke="#c0574a" stroke-width="2"/><line x1="356" y1="222" x2="384" y2="222" stroke="#c0574a" stroke-width="2"/><line x1="470" y1="182" x2="470" y2="212" stroke="#3d9a63" stroke-dasharray="5 4"/><text x="570" y="130" font-size="14" text-anchor="middle" fill="#22314e">两条路在</text><text x="570" y="150" font-size="14" text-anchor="middle" fill="#22314e">同一个口</text><text x="570" y="170" font-size="14" text-anchor="middle" fill="#22314e">上汇合</text><text x="320" y="284" font-size="14" text-anchor="middle" fill="#22314e">顺序反了会怎样：先渲染再读盘，仪表盘看到的是 null，直接被踢回登录页</text></svg>`, caption: `上半是正常操作时的一圈，下半是刷新后的另一圈；两圈都从 updateState 这个口进出。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `关掉浏览器再打开，还在自己那一屏，不用重新登录`,
    `想加一屏新的状态只加一个键，写它的地方还是那一个函数`,
    `加持久化只改一行——所有写操作都从同一个口走，这一点在上一课那种散写法里做不到`,
    `调试时能分清「谁改了状态」和「谁改了界面」这两类 bug`
  ] },
  { t: `h2`, text: `演示 1 · 一个对象和一个写入口` },
  { t: `code`, lang: `javascript`, code: `let state = Object.freeze({ account: null });\n\nfunction updateState(property, newData) {\n  state = Object.freeze({ ...state, [property]: newData });\n}\nfunction logout() {\n  updateState('account', null);\n  navigate('/login');\n}` },
  { t: `p`, text: `...state 把旧对象的键全抄进新对象，后面的方括号写法覆盖其中一个键——键名是变量时只能用这种写法。Object.freeze 冻的是这一层：冻完再有人写 state.account 是静默失败（严格模式下报错），而 account 里面那个对象的 transactions 数组照样能改，它是浅的。退出必须走这里，只把地址换走等于把上一位用户的数据留在内存里。` },
  { t: `h2`, text: `演示 2 · 落盘与读盘：字符串这一道手续` },
  { t: `code`, lang: `javascript`, code: `const storageKey = 'savedAccount';\nfunction updateState(property, newData) {\n  state = Object.freeze({ ...state, [property]: newData });\n  localStorage.setItem(storageKey, JSON.stringify(state.account));\n}\nfunction init() {\n  const saved = localStorage.getItem(storageKey);\n  if (saved) updateState('account', JSON.parse(saved));\n  window.onpopstate = () => updateRoute();\n  updateRoute();\n}\ninit();` },
  { t: `p`, text: `写入那一行放在 updateState 末尾，是这一课最划算的一笔：状态改动的入口只有一个，所以「改了状态就存盘」这件事也只需要说一次。读盘放 init 最前面，早于第一次 updateRoute。JSON 只装得下数据——函数、undefined、循环引用进去就没了，所以别指望存进去的对象还带方法。` },
  { t: `h2`, text: `演示 3 · 默认路由改成仪表盘，让状态去判该不该留` },
  { t: `code`, lang: `javascript`, code: `function updateRoute() {\n  const route = routes[window.location.pathname] || routes['/dashboard'];\n  const view = document.getElementById(route.templateId).content.cloneNode(true);\n  const app = document.getElementById('app');\n  app.innerHTML = ''; app.appendChild(view);\n  if (typeof route.init === 'function') route.init();\n}` },
  { t: `p`, text: `上一版的兜底是跳回登录页，现在读盘已经能把 account 填回来，兜底就改成 /dashboard：进仪表盘后 updateDashboard 第一行仍然是那句 if 检查，有数就正常显示，没数才回登录页。判断放在需要它的那一屏里，而不是放在路由里，路由就只负责贴模板这一件事。` },
  { t: `h2`, text: `演示 4 · 存下来的数会旧：进来先显示，再去取新的` },
  { t: `code`, lang: `javascript`, code: `async function updateDashboard() {\n  if (!state.account) return navigate('/login');\n  renderAccount(state.account);\n  const fresh = await getAccount(state.account.user);\n  if (fresh.error) return renderError(fresh.error);\n  updateState('account', fresh);\n  renderAccount(fresh);\n}` },
  { t: `p`, text: `本地那份是上次离开时的世界：别人往后台写了一笔，你的屏幕不会知道，后端重启把数据重置了，localStorage 里那份也还在假装有效。这一版先画旧的（几乎零延迟），再把新的取回来重画一次——代价是同一屏渲染两遍，所以要保证 renderAccount 只是赋值，不去追加节点，否则交易列表会翻倍。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `把密码或整份令牌塞进 localStorage：它按站点明文存着，同域下任何脚本都能读走`,
    `先 updateRoute 再读盘：仪表盘在 account 还是 null 时就渲染了，看着像登录没成功`,
    `绕过 updateState 直接写 state.account：freeze 让你静默失败，界面不动而你以为改了`,
    `以为 localStorage 会自己过期：它不会，后台换了数据，那句「刷新了还是旧的」就是这么来的`,
    `每个键都塞同一个大对象：存几份就吃满配额，setItem 抛 QuotaExceeded，按需拆键`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `登录一次，关掉浏览器再打开，说出你这次是靠哪一行代码回到仪表盘的`,
    `把 updateState 里那句写盘删掉，重复上面这一步，指出少掉的是哪一半`,
    `加一条「主题偏好」进 state，说明为什么不用新增第二个存储调用`,
    `用 curl 或直接改后台数据加一笔交易，然后按 F5，解释你先看见旧数后看见新数的原因`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：状态集中不是洁癖——写只有一个口，所以加持久化、加退出清理、加调试断点都只改一处；刷新丢的是内存，不是数据，前提是你真的写过盘、并且在渲染前读回来。` }
];
