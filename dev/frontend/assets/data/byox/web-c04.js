/* 喵站 · build-your-own-x《从零写一个 Web 服务器》第 4 篇正文
 * 原创中文导读，不搬运原文正文；出处块由挂载层从 byox-data.js 的占位 tip 保留。
 */
window.MIAO_BYOX_BODY = window.MIAO_BYOX_BODY || {};
window.MIAO_BYOX_BODY["web-c04"] = [
  { t: `tip`, color: `blue`, text: `回源阅读：GitHub 上的 lets-build-express（antoaravinth），语言 Node.js。一个仓库分若干的提交，每一步都在给前一步套壳，代码量几百行，最后得到一个能跑 Express 那套写法的迷你实现。` },
  { t: `h2`, text: `这篇要造什么` },
  { t: `p`, text: `这篇换个角度：不造服务器，造服务器上面那层壳。目标是一个对象，能这么用——把应用创建出来，往上挂几个中间件，注册几条路由，最后监听端口；请求进来时，中间件按注册的顺序一个接一个跑，每个都能改请求、改响应、决定要不要往下传。这就是 Express 那套 API 的全部秘密。造完你会知道框架不是魔法，只是一条把函数排好队的链表，外加给原生请求响应对象包了一层手感更好的皮。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="20" y="120" width="88" height="60" rx="8" fill="#eef3fb" stroke="#5b8dd6"/><text x="64" y="146" font-size="15" text-anchor="middle" fill="#26364e">请求进来</text><text x="64" y="166" font-size="14" text-anchor="middle" fill="#5a6b80">套上外壳</text><rect x="140" y="80" width="100" height="44" rx="6" fill="#ffffff" stroke="#5aa971"/><text x="190" y="107" font-size="14" text-anchor="middle" fill="#26364e">日志中间件</text><rect x="140" y="128" width="100" height="44" rx="6" fill="#ffffff" stroke="#5aa971"/><text x="190" y="155" font-size="14" text-anchor="middle" fill="#26364e">解析正文</text><rect x="140" y="176" width="100" height="44" rx="6" fill="#ffffff" stroke="#5aa971"/><text x="190" y="203" font-size="14" text-anchor="middle" fill="#26364e">鉴权中间件</text><line x1="108" y1="150" x2="132" y2="150" stroke="#5b8dd6" stroke-width="2"/><polygon points="132,144 144,150 132,156" fill="#5b8dd6"/><line x1="240" y1="200" x2="276" y2="200" stroke="#5aa971" stroke-width="2"/><polygon points="276,194 288,200 276,206" fill="#5aa971"/><rect x="288" y="176" width="110" height="44" rx="6" fill="#f2fbf4" stroke="#5aa971"/><text x="343" y="196" font-size="14" text-anchor="middle" fill="#26364e">路由匹配</text><text x="343" y="212" font-size="14" text-anchor="middle" fill="#5a6b80">方法 加 路径</text><line x1="398" y1="198" x2="434" y2="198" stroke="#5aa971" stroke-width="2"/><polygon points="434,192 446,198 434,204" fill="#5aa971"/><rect x="446" y="176" width="90" height="44" rx="6" fill="#f2fbf4" stroke="#5aa971"/><text x="491" y="203" font-size="14" text-anchor="middle" fill="#26364e">处理器</text><rect x="540" y="80" width="84" height="140" rx="8" fill="#fbf1e6" stroke="#c07b3a"/><text x="582" y="110" font-size="14" text-anchor="middle" fill="#26364e">回头的路</text><text x="582" y="132" font-size="14" text-anchor="middle" fill="#8a5a24">出站时</text><text x="582" y="152" font-size="14" text-anchor="middle" fill="#8a5a24">同一条链</text><text x="582" y="172" font-size="14" text-anchor="middle" fill="#8a5a24">再倒着走</text><text x="582" y="192" font-size="14" text-anchor="middle" fill="#8a5a24">一遍</text><line x1="536" y1="120" x2="250" y2="102" stroke="#c07b3a" stroke-width="2" stroke-dasharray="5 4"/><text x="300" y="60" font-size="14" fill="#5a6b80">任何一个环节不调下一个，链条就地断开，响应提前收尾</text></svg>`, caption: `中间件是一条正向的链，路由处理器在最深处；出站再倒着走一遍，这就是所谓洋葱。` },
  { t: `h2`, text: `拆开有哪几块` },
  { t: `ul`, items: [
    `应用工厂：一个函数，调用它得到应用对象；对象上挂着监听、注册中间件、注册路由三个方法，内部不过是一个数组加一个底层的服务器实例。`,
    `中间件链表：每个中间件收三个参数——请求、响应、下一个。下一个是显式调用，不调就没人继续，这条规矩撑起了整层框架。`,
    `路由器：按方法分组存一张表，键是路径模式，值是处理器函数；匹配上就把路径里的变量塞进请求的参数里。`,
    `请求外壳：把原生的请求包一层，加查询串解析、参数、按内容类型取正文这些手感方法。包的方式是把原生对象当原型，方法只在需要时透下去。`,
    `响应外壳：链式的手感——状态码、设头、发 JSON、发文件，最后仍落到原生的写头和写正文。`,
    `错误通道：处理器里抛出的异常要能被同一条链上的错误中间件接住，签名多一个参数，靠参数个数区分身份。`
  ] },
  { t: `h2`, text: `做的顺序` },
  { t: `ul`, items: [
    `先做最小闭环：应用对象、注册一个中间件、监听端口，请求来了把它跑一遍再回一句固定话。产出：确认「下一个」这个显式接力真的能把链条走通。`,
    `加路由器：按方法查表，命中就跑处理器，不命中就交给下一个中间件直至落到 404。产出：不同路径开始有不同内容。`,
    `给请求和响应包壳：把常用能力挪到壳上，原生对象藏在壳里。产出：处理器代码变得干净，且能看出壳只是转发。`,
    `补错误中间件和正文解析：异常沿链外抛，正文按内容类型解码成对象。产出：一套可以拿去写真实小应用的手感。`
  ] },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `忘了调下一个：链条断在这一环，请求永远挂着，浏览器转到天荒地老，而这正是最常被误用出来的「功能」。`,
    `响应发了还想再发：一个请求只能有一次结束，第二次写要么报错要么被忽略，控制流要提前返回。`,
    `注册顺序当成无序：中间件是按注册顺序跑的，把鉴权放在业务处理器之后，等于没写。`,
    `靠参数个数识别错误中间件时写错签名：少一个参数的函数会被当普通中间件，异常直接漏到进程外。`,
    `包壳包过头：壳上每个方法都自己重新实现一遍原生功能，结果原生能力的更新你全都拿不到。`,
    `路径匹配只做字符串相等：真实应用要能匹配带变量的模式，并把值取出来，否则路由表会长成几百条硬编码。`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `用这篇的壳写一个三行应用：一条记录耗时的日志中间件、一条鉴权、一条真实处理器。说出哪一环有权决定不再往下传。`,
    `给路由器加上「先注册先匹配」和「路径变量」两件事，然后设计两个会冲突的模式，验证优先级。`,
    `实现链式的响应方法，使一句连贯的写法能同时设状态码、设头和发正文。说清这些调用是立刻写出去还是攒着，为什么。`,
    `把错误中间件的机制补齐：处理器里抛异常，最外层那条能接住并回一个 500。注意异常穿越异步边界的场合。`,
    `拿这篇的壳和真正的 Express 逐条对照，列出至少三处它没做到的行为，并判断哪一处最难补。`
  ] },
  { t: `tip`, color: `green`, text: `一句话验收：把函数排成一条能显式接力、能就地断开、能倒着出站的链，框架那层壳就成型了，剩下的全是手感。` }
];
