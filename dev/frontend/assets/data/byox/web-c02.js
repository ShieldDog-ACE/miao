/* 喵站 · build-your-own-x《从零写一个 Web 服务器》第 2 篇正文
 * 原创中文导读，不搬运原文正文；出处块由挂载层从 byox-data.js 的占位 tip 保留。
 */
window.MIAO_BYOX_BODY = window.MIAO_BYOX_BODY || {};
window.MIAO_BYOX_BODY["web-c02"] = [
  { t: `tip`, color: `blue`, text: `回源阅读：build-your-own.org 的 Build Your Own Web Server From Scratch In JavaScript，语言 Node.js。它是一整套分篇系列，从零散片段攒到一个能渲染页面的小站点，落地代码一千行上下。跟着走完大约要两三天。` },
  { t: `h2`, text: `这篇要造什么` },
  { t: `p`, text: `用 Node 从零搭一台能出页面的机器：把 socket 上收到的字节切成请求，按路径找到该跑的函数，函数交出数据，模板把数据变成 HTML，最后序列化成响应写回去。关键在于把内置的 http 模块这一层剥掉，只留最底下那条 socket。造完你会知道一个 Web 框架最小的形状：请求进、响应出，中间只有查表和调函数两件事，别的都是包装。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="20" y="40" width="170" height="180" rx="10" fill="#f2f3f5" stroke="#98a2b3" stroke-dasharray="4 4"/><text x="105" y="62" font-size="15" text-anchor="middle" fill="#5a6b80">这里以下内置</text><rect x="38" y="76" width="134" height="38" rx="6" fill="#ffffff" stroke="#c2c9d4"/><text x="105" y="100" font-size="14" text-anchor="middle" fill="#26364e">内核 socket</text><rect x="38" y="124" width="134" height="38" rx="6" fill="#ffffff" stroke="#c2c9d4"/><text x="105" y="148" font-size="14" text-anchor="middle" fill="#26364e">net 模块</text><rect x="38" y="172" width="134" height="38" rx="6" fill="#ffffff" stroke="#c2c9d4"/><text x="105" y="196" font-size="14" text-anchor="middle" fill="#26364e">事件循环</text><line x1="190" y1="130" x2="228" y2="130" stroke="#5b8dd6" stroke-width="2"/><polygon points="228,124 240,130 228,136" fill="#5b8dd6"/><rect x="240" y="40" width="180" height="38" rx="6" fill="#eef3fb" stroke="#5b8dd6"/><text x="330" y="64" font-size="14" text-anchor="middle" fill="#26364e">解析器：字节到请求</text><rect x="240" y="86" width="180" height="38" rx="6" fill="#eef3fb" stroke="#5b8dd6"/><text x="330" y="110" font-size="14" text-anchor="middle" fill="#26364e">路由表：路径到函数</text><rect x="240" y="132" width="180" height="38" rx="6" fill="#eef3fb" stroke="#5b8dd6"/><text x="330" y="156" font-size="14" text-anchor="middle" fill="#26364e">处理函数：交出数据</text><rect x="240" y="178" width="180" height="38" rx="6" fill="#eef3fb" stroke="#5b8dd6"/><text x="330" y="202" font-size="14" text-anchor="middle" fill="#26364e">模板：数据到标记</text><line x1="420" y1="130" x2="458" y2="130" stroke="#5aa971" stroke-width="2"/><polygon points="458,124 470,130 458,136" fill="#5aa971"/><rect x="470" y="86" width="150" height="88" rx="8" fill="#f2fbf4" stroke="#5aa971"/><text x="545" y="118" font-size="15" text-anchor="middle" fill="#26364e">响应序列化</text><text x="545" y="140" font-size="14" text-anchor="middle" fill="#5a6b80">状态行 头 正文</text><text x="545" y="160" font-size="14" text-anchor="middle" fill="#5a6b80">一次写回 socket</text><text x="240" y="248" font-size="14" fill="#5a6b80">虚线以下不用自己写；虚线以上四个框是这一篇要造的</text></svg>`, caption: `左边是 Node 已经替你做好的，右边四个框才是这篇的活；最右那一格把结构重新变回字节。` },
  { t: `h2`, text: `拆开有哪几块` },
  { t: `ul`, items: [
    `解析器：请求行按空格切三截，头按第一个冒号切键值，键统一转小写；看见空行才算头读完，若 Content-Length 大于零后面还挂着正文，得继续读够数。`,
    `请求对象：方法、路径、查询串、头字典、正文五样，查询串要解码成键值对才能用。`,
    `响应对象：状态码、头、正文三样攒着，不在处理函数里直接写 socket，等这一轮全部处理完再一次性序列化。`,
    `路由表：一张从「方法 加 路径模式」到函数的表，带变量的路径先按斜杠切段再逐段比，匹配上的段填进参数。`,
    `中间件：处理函数排队，前一个把响应对象改完再交给下一个，任何一个写完了正文就短路收尾。`,
    `模板：把数据填进标记。慢的做法是每次请求重新解析字符串，快的做法是编译一次得到函数，之后每次调用只要几十微秒。`,
    `会话：把用户状态存到服务端，浏览器只揣一个 id 的 cookie，服务端用 id 查回那坨状态。`
  ] },
  { t: `h2`, text: `做的顺序` },
  { t: `ul`, items: [
    `只用 net 模块把连接接住，原样打印收到的字节。产出：确认这台机器上到请求的所有字节都能拿到，包括浏览器发的那串 Accept 头。`,
    `写解析器和请求对象，路由先写死：不管来什么，一律回一个 200 加一小段 HTML。产出：浏览器里能看到字，且刷新一次请求一次，没有堆积。`,
    `补路由表和处理函数，两个真实页面加一个查询参数回显。产出：路径不同内容不同，参数能被读出来。`,
    `最后加模板、静态文件和 404 页。产出：一个能挂着的站点，异常路径也有像样的响应而不是让进程退掉。`
  ] },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `把 socket 的一次 data 事件当成一个完整请求：它可能只给了半截头，也可能是两个请求粘在一起。要按缓冲区里的空行判断，而不是按事件次数。`,
    `忘了 keep-alive：浏览器留着连接等你，你不回也不关，页面看起来转圈。要么老实回 Content-Length 并保持连接，要么显式关掉。`,
    `头键大小写：HTTP 头不区分大小写，代码里直接按键原样查就会漏掉 Host 和 host 是同一个东西这个事实。`,
    `字符串长度当字节长度：正文里有非 ASCII 时两个数不相等，Content-Length 要用 Buffer 的字节长度。`,
    `在异常里没挂 error 监听：一个畸形请求把整个进程带走，服务凭空消失。`,
    `模板不做转义就把用户输入拼进 HTML：这是最省事的跨站脚本，数据填进模板之前该转的一律转。`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把解析器写成纯函数：字节进、请求对象出，然后喂它一段没有结束空行的字节，说清它该怎么回答。`,
    `给路由表加一个带变量的路径模式，让两个不同的 URL 走同一个处理函数，并解释参数是从哪一段抠出来的。`,
    `手写一个只支持变量插值的极简模板，和字符串拼接版本各跑一千次，比较耗时并说出差距为什么在那里。`,
    `把会话做起来：处理函数只认一个 id，数据放内存对象里。重启进程之后会话全丢，说清丢在了哪一层。`,
    `只用这篇造出来的东西实现一个接口，浏览器访问它能看到一段 JSON，不许请框架帮忙。`
  ] },
  { t: `tip`, color: `green`, text: `一句话验收：能接住 socket 的字节、按路径分对人、把数据变成 HTML 再原路送回，这四件连起来就是一个框架的原型。` }
];
