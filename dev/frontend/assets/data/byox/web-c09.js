/* 喵站 · build-your-own-x《从零写一个 Web 服务器》第 9 篇正文
 * 原创中文导读，不搬运原文正文；出处块由挂载层从 byox-data.js 的占位 tip 保留。
 */
window.MIAO_BYOX_BODY = window.MIAO_BYOX_BODY || {};
window.MIAO_BYOX_BODY["web-c09"] = [
  { t: `tip`, color: `blue`, text: `回源阅读：joaoventura.net 的 Building a basic HTTP Server from scratch in Python，语言 Python。单篇，一百多行，走的是「把标准库的两块拼起来再补齐外围」这条路，成品是一个能天天用的静态文件服务器。` },
  { t: `h2`, text: `这篇要造什么` },
  { t: `p`, text: `这一篇不重造轮子，而是学怎么搭轮子：连接循环交给 socketserver 那一层，HTTP 的字面解析交给带协议的处理器基类，你写的只有四件外围——并发用线程混入打开、日志按级别发出去、扩展名换成内容类型、以及最关键的路径校验。造完你会得到一台真能用的静态文件服务器，也会知道「从零写」和「不造轮子」之间那条线该画在哪：协议的字节自己写一遍（前两篇），日常能跑的东西靠组合标准库。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="20" y="40" width="290" height="90" rx="10" fill="#f2f3f5" stroke="#98a2b3" stroke-dasharray="5 4"/><text x="165" y="60" font-size="14" text-anchor="middle" fill="#5a6b80">标准库管着的这一段</text><rect x="34" y="72" width="80" height="42" rx="6" fill="#ffffff" stroke="#c2c9d4"/><text x="74" y="90" font-size="14" text-anchor="middle" fill="#26364e">接连接</text><text x="74" y="106" font-size="14" text-anchor="middle" fill="#5a6b80">循环</text><line x1="114" y1="93" x2="132" y2="93" stroke="#98a2b3" stroke-width="2"/><polygon points="132,88 142,93 132,98" fill="#98a2b3"/><rect x="142" y="72" width="80" height="42" rx="6" fill="#ffffff" stroke="#c2c9d4"/><text x="182" y="90" font-size="14" text-anchor="middle" fill="#26364e">每条起一</text><text x="182" y="106" font-size="14" text-anchor="middle" fill="#5a6b80">个线程</text><line x1="222" y1="93" x2="240" y2="93" stroke="#98a2b3" stroke-width="2"/><polygon points="240,88 250,93 240,98" fill="#98a2b3"/><rect x="250" y="72" width="46" height="42" rx="6" fill="#ffffff" stroke="#c2c9d4"/><text x="273" y="97" font-size="14" text-anchor="middle" fill="#26364e">解析</text><line x1="310" y1="93" x2="340" y2="150" stroke="#5b8dd6" stroke-width="2"/><polygon points="332,148 342,154 334,140" fill="#5b8dd6"/><text x="318" y="130" font-size="14" fill="#5a6b80">交给你的类</text><rect x="350" y="130" width="120" height="40" rx="6" fill="#eef3fb" stroke="#5b8dd6"/><text x="410" y="148" font-size="14" text-anchor="middle" fill="#26364e">规范化路径</text><text x="410" y="164" font-size="14" text-anchor="middle" fill="#5a6b80">不许出根目录</text><line x1="470" y1="150" x2="496" y2="150" stroke="#5b8dd6" stroke-width="2"/><polygon points="496,144 508,150 496,156" fill="#5b8dd6"/><rect x="508" y="130" width="112" height="40" rx="6" fill="#eef3fb" stroke="#5b8dd6"/><text x="564" y="148" font-size="14" text-anchor="middle" fill="#26364e">查内容类型</text><text x="564" y="164" font-size="14" text-anchor="middle" fill="#5a6b80">扩展名到媒体</text><line x1="564" y1="170" x2="564" y2="206" stroke="#5aa971" stroke-width="2"/><polygon points="558,206 564,218 570,206" fill="#5aa971"/><rect x="350" y="218" width="270" height="44" rx="8" fill="#f2fbf4" stroke="#5aa971"/><text x="485" y="238" font-size="14" text-anchor="middle" fill="#26364e">发状态与头，再把文件一小段一小段拷进连接</text><text x="485" y="256" font-size="14" text-anchor="middle" fill="#5a6b80">同时每一步都往日志里记一行</text><text x="24" y="200" font-size="14" fill="#8a5a24">虚线框里那三格一行代码都不用写；</text><text x="24" y="220" font-size="14" fill="#8a5a24">右边四个框才是这篇的活，其中第一个是安全边界</text></svg>`, caption: `灰虚线是标准库代劳的部分，右边四个框是这篇要写的，路径校验那格是全篇最值钱的一格。` },
  { t: `h2`, text: `拆开有哪几块` },
  { t: `ul`, items: [
    `服务器骨架：一个处理流数据的服务器类，加上线程混入，两行定义就得到「每条连接一个线程」。地址与端口从命令行拿，别写死。`,
    `处理器类：继承带协议解析的基类，实现对应方法那一个函数。请求路径、头、版本都被拆好了等你用。`,
    `路径校验：把请求里的路径去掉查询串、做 URL 解码、拼到根目录上，然后规范化并判定它还在根内。这一步是整个服务器唯一的防线。`,
    `内容类型：用现成的媒体类型表按扩展名查，查不到就退成二进制流，别一律 text 出去——浏览器会照 text 渲染你的图片。`,
    `正文拷贝：别把文件整块读进内存，用流到流的拷贝，一次一窗口。`,
    `日志：按级别记录方法与状态码，访问日志和错误日志分道，进程启动时配置一次。`,
    `错误分支：不存在回 404，是目录看要不要给列表，读不了回 403 或 500——都走同一套发送流程，别手写状态行。`
  ] },
  { t: `h2`, text: `做的顺序` },
  { t: `ul`, items: [
    `把骨架和处理器拼起来，先只回一个 200 空正文。产出：端口能连上，标准库把请求送到了你的方法里。`,
    `补路径校验和文件读取，命中就把内容拷进连接。产出：一个真能翻目录的文件服务器。`,
    `加内容类型和 404、403 分支。产出：浏览器里的图片开始是图片，异常路径开始像有人写过的服务器。`,
    `最后接日志和命令行参数。产出：可以扔到终端里日常用的那台小机器。`
  ] },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `只删掉开头的斜杠就拼路径：省略掉规范化那一步，带点点斜杠的请求能读到根目录以外的任何文件。这是这类练习最常漏的洞。`,
    `URL 解码做晚了一步：编码过的分隔符在解码前看起来安全，解码后翻车；顺序必须是解码、拼接、规范化、判定。`,
    `把文件整个读进内存：一百兆的视频一来，内存立刻跟上。流式拷贝就是为这个存在的。`,
    `内容类型猜错或者不写：浏览器只能猜，猜错就是满屏乱码或者下载框。`,
    `线程混入打开之后就以为万事大吉：处理器实例是每条连接一个，但任何模块级的可变对象仍然共享，日志句柄、计数、缓存都得想清楚归谁。`,
    `异常从线程里冒出去：那条连接被静悄悄掐断，客户端只看到连接重置，日志里一个字都没有。`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `先用浏览器的地址栏和一个手工构造的路径，各试一次跨出根目录的读法，说明你的校验分别拦在哪一步。`,
    `把「目录列表」这条功能拿掉，改成一律 403。说出为什么这比给出列表更省事也更安全。`,
    `给日志加上状态码与字节数两个字段，然后制造三种失败请求（不存在、越界、超大），在日志里把它们一一指出来。`,
    `关掉线程混入跑一次，再打开跑一次，用十个并发请求量出差别，并说出打开它多付出的那部分复杂度落在哪里。`,
    `把这篇的成品和第一篇那种完全自造的版本并排放：列出标准库替你做的四件事，再列出你必须自己补的三件事。`
  ] },
  { t: `tip`, color: `green`, text: `一句话验收：知道哪一层可以交给标准库、哪一层（路径校验）绝对不能交出去，这篇要教的东西就用上了。` }
];
