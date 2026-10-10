/* 喵站 · build-your-own-x《从零写一个 Web 服务器》第 8 篇正文
 * 原创中文导读，不搬运原文正文；出处块由挂载层从 byox-data.js 的占位 tip 保留。
 */
window.MIAO_BYOX_BODY = window.MIAO_BYOX_BODY || {};
window.MIAO_BYOX_BODY["web-c08"] = [
  { t: `tip`, color: `blue`, text: `回源阅读：defn.io 上的 Web application from scratch 第一篇（Colin Jones），语言 Python。这是一个分多篇的系列，第一篇一百来行，写法偏函数式，重点全在「接口」而不是协议细节。` },
  { t: `h2`, text: `这篇要造什么` },
  { t: `p`, text: `这篇反着来：先把服务器放一边，把 Web 应用写成一个函数——收一个结构化的请求，返一个结构化的响应；不碰套接字、不打印、不改全局，所有副作用推到最外层去。然后再把这台函数机器接到字节上去。造完你会发现两件事：测一个 Web 应用完全可以不要网络和端口；而所谓路由和中间件，本质就是「表的查找」和「函数的组合」这两件老掉牙的事。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="20" y="112" width="120" height="56" rx="8" fill="#f2f3f5" stroke="#98a2b3"/><text x="80" y="136" font-size="14" text-anchor="middle" fill="#26364e">字节与套接字</text><text x="80" y="156" font-size="14" text-anchor="middle" fill="#5a6b80">脏活都在这</text><line x1="140" y1="140" x2="176" y2="140" stroke="#5b8dd6" stroke-width="2"/><polygon points="176,134 188,140 176,146" fill="#5b8dd6"/><text x="150" y="128" font-size="14" fill="#5a6b80">适配</text><rect x="188" y="112" width="110" height="56" rx="8" fill="#eef3fb" stroke="#5b8dd6"/><text x="243" y="136" font-size="14" text-anchor="middle" fill="#26364e">请求值对象</text><text x="243" y="156" font-size="14" text-anchor="middle" fill="#5a6b80">方法 路径 头</text><line x1="298" y1="140" x2="334" y2="140" stroke="#5b8dd6" stroke-width="2"/><polygon points="334,134 346,140 334,146" fill="#5b8dd6"/><rect x="346" y="70" width="150" height="140" rx="10" fill="#f2fbf4" stroke="#5aa971"/><text x="421" y="94" font-size="15" text-anchor="middle" fill="#26364e">应用：一个函数</text><rect x="366" y="108" width="110" height="30" rx="6" fill="#ffffff" stroke="#9ac9ad"/><text x="421" y="128" font-size="14" text-anchor="middle" fill="#26364e">路由表查找</text><rect x="366" y="146" width="110" height="30" rx="6" fill="#ffffff" stroke="#9ac9ad"/><text x="421" y="166" font-size="14" text-anchor="middle" fill="#26364e">处理器产出正文</text><line x1="496" y1="140" x2="530" y2="140" stroke="#5aa971" stroke-width="2"/><polygon points="530,134 542,140 530,146" fill="#5aa971"/><rect x="500" y="220" width="120" height="40" rx="8" fill="#f2fbf4" stroke="#5aa971"/><text x="560" y="238" font-size="14" text-anchor="middle" fill="#26364e">包装与组合</text><text x="560" y="256" font-size="14" text-anchor="middle" fill="#5a6b80">应用进 应用出</text><line x1="560" y1="220" x2="470" y2="200" stroke="#5aa971" stroke-width="2" stroke-dasharray="5 4"/><rect x="542" y="112" width="80" height="56" rx="8" fill="#eef3fb" stroke="#5b8dd6"/><text x="582" y="136" font-size="14" text-anchor="middle" fill="#26364e">响应值对象</text><text x="582" y="156" font-size="14" text-anchor="middle" fill="#5a6b80">状态 头 正文</text><text x="150" y="40" font-size="14" fill="#5a6b80">最外面一层知道字节，中间那层是纯函数，最右那个框能把中间整层重新包一遍</text></svg>`, caption: `只有最左框碰字节；中间是一个可以在解释器里直接调用的函数；包装框说明横切能力不改内核。` },
  { t: `h2`, text: `拆开有哪几块` },
  { t: `ul`, items: [
    `两个值对象：请求和响应，字段就是接口。响应是「状态码、头、正文」这坨数据，不是「已经发出去了」这个事实——这一字之差决定了你能不能测它。`,
    `应用接口：一个从请求到响应的函数。凡是满足这个形状的东西都能互换，可插拔说到头就是这么点事，不需要什么注册机制。`,
    `路由：一张「方法 加 路径模式 到函数」的表。查不到就返回一个 404 响应值，别抛异常——异常是控制流，404 是业务。`,
    `组合：输入一个应用、输出一个新应用的函数。加日志、加鉴权、加编码转换都是这一个形状，包的顺序直接决定语义。`,
    `适配层：唯一知道套接字存在的地方。它负责字节变请求、响应变字节，别的一概不管。`,
    `内容生成：把数据变成正文的纯函数，模板、JSON 序列化都归它，返回值而不是打印。`
  ] },
  { t: `h2`, text: `做的顺序` },
  { t: `ul`, items: [
    `先用标准库起一个能回固定文本的服务器，然后立刻把它扔掉，只留一个能直接在解释器里调用的函数。产出：内容逻辑与网络彻底无关。`,
    `定义两个值对象，把那个函数改成请求对象进、响应对象出。产出：你可以给它写单元测试，不开端口、不发请求。`,
    `写路由表和三个应用函数，再用组合把其中一个包一层。产出：加一条横切能力只是多包一层，内核一个字不改。`,
    `最后补适配层把它接到套接字上。产出：协议层与应用层的边界清楚到能画在一张纸上，而那张纸就是上面这张图。`
  ] },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `在处理器里直接写套接字或者打印：副作用漏进应用层，函数不再可换、测试不再可写，这篇的意义当场报废。`,
    `路由拿异常当控制流：404 和真正的 bug 被同一个捕获吞掉，线上出问题时你分不清是哪种。`,
    `组合顺序反了：鉴权包在编码之后、日志包在最内层，前者等于不鉴权，后者漏掉了整轮耗时。`,
    `路径只做字符串相等：多一段编号就得改一次表，表很快长成几百行硬编码。`,
    `响应构造完又构造一次：忘了它是值对象，写成两次发送，客户端收到一个畸形响应。`,
    `用可变的默认参数在函数间传状态：默认值在定义时就生成一次，于是跨请求脏数据悄悄出现。`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `给你的应用函数写三个不碰网络的测试：命中的、未命中的、带路径参数的。说出这三个测试各自钉住了哪条约定。`,
    `实现一个「应用进、应用出」的包装函数，功能是每个响应都多带一个头。解释它和「在处理器里加一行」有什么本质区别。`,
    `把路由表换成保序的模式列表，然后设计两条会互相遮蔽的模式，说明最终生效的是哪条、优先级从哪儿来。`,
    `把适配层从标准库换成前两篇里你自己写的那套解析，证明应用层一行都不必改；如果改动了，说出漏在哪儿。`,
    `加一步「请求体是 JSON 就解码成数据」，判断它属于适配层还是组合层，把理由写成一句话放在代码旁边。`
  ] },
  { t: `tip`, color: `green`, text: `一句话验收：应用是个纯函数、副作用全在最外面那层——测试不需要网络、换服务器不需要改代码，这篇的骨架就算立住了。` }
];
