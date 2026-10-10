/* 喵站 · build-your-own-x《从零写一个 Web 服务器》第 1 篇正文
 * 原创中文导读，不搬运原文正文；出处块由挂载层从 byox-data.js 的占位 tip 保留。
 */
window.MIAO_BYOX_BODY = window.MIAO_BYOX_BODY || {};
window.MIAO_BYOX_BODY["web-c01"] = [
  { t: `tip`, color: `blue`, text: `回源阅读：CodeProject 上的 Writing a Web Server from Scratch，语言 C#，单篇长文，落地代码大约两三百行，只实现 HTTP/1.1 的一个够小子集。读文一到两小时，动手三到五小时。` },
  { t: `h2`, text: `这篇要造什么` },
  { t: `p`, text: `造一个占住 8080 端口的进程。浏览器把 URL 换成一段文本发过来，它按 HTTP 的规矩把这段文本读明白：哪个方法、哪条路径、带了哪些头；然后从磁盘或者内存里挑出该给的字节，配上状态码和响应头原路还回去。全程不许借框架，只用语言自带的 TCP 套接字。造完你会知道「Web 服务器」这四个字底下其实只有三件事：等连接、拆字节、写字节。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="20" y="50" width="130" height="52" rx="8" fill="#eef3fb" stroke="#5b8dd6"/><text x="85" y="72" font-size="15" text-anchor="middle" fill="#26364e">浏览器</text><text x="85" y="92" font-size="14" text-anchor="middle" fill="#5a6b80">发出文本</text><line x1="150" y1="76" x2="188" y2="76" stroke="#5b8dd6" stroke-width="2"/><polygon points="188,70 200,76 188,82" fill="#5b8dd6"/><rect x="200" y="50" width="130" height="52" rx="8" fill="#ffffff" stroke="#9db6d8"/><text x="265" y="72" font-size="15" text-anchor="middle" fill="#26364e">监听器</text><text x="265" y="92" font-size="14" text-anchor="middle" fill="#5a6b80">accept 排队</text><line x1="330" y1="76" x2="368" y2="76" stroke="#5b8dd6" stroke-width="2"/><polygon points="368,70 380,76 368,82" fill="#5b8dd6"/><rect x="380" y="50" width="130" height="52" rx="8" fill="#ffffff" stroke="#9db6d8"/><text x="445" y="72" font-size="15" text-anchor="middle" fill="#26364e">读缓冲</text><text x="445" y="92" font-size="14" text-anchor="middle" fill="#5a6b80">反复读到空行</text><line x1="510" y1="76" x2="548" y2="76" stroke="#5b8dd6" stroke-width="2"/><polygon points="548,70 560,76 548,82" fill="#5b8dd6"/><rect x="560" y="50" width="60" height="52" rx="8" fill="#ffffff" stroke="#9db6d8"/><text x="590" y="78" font-size="14" text-anchor="middle" fill="#26364e">解析</text><line x1="590" y1="102" x2="590" y2="150" stroke="#5b8dd6" stroke-width="2"/><polygon points="584,150 590,162 596,150" fill="#5b8dd6"/><rect x="430" y="162" width="130" height="52" rx="8" fill="#f2fbf4" stroke="#5aa971"/><text x="495" y="184" font-size="15" text-anchor="middle" fill="#26364e">路由分发</text><text x="495" y="204" font-size="14" text-anchor="middle" fill="#5a6b80">方法加路径</text><line x1="430" y1="188" x2="392" y2="188" stroke="#5aa971" stroke-width="2"/><polygon points="392,182 380,188 392,194" fill="#5aa971"/><rect x="250" y="162" width="130" height="52" rx="8" fill="#f2fbf4" stroke="#5aa971"/><text x="315" y="184" font-size="15" text-anchor="middle" fill="#26364e">响应对象</text><text x="315" y="204" font-size="14" text-anchor="middle" fill="#5a6b80">状态行 头 正文</text><line x1="250" y1="188" x2="212" y2="188" stroke="#5aa971" stroke-width="2"/><polygon points="212,182 200,188 212,194" fill="#5aa971"/><rect x="70" y="162" width="130" height="52" rx="8" fill="#f2fbf4" stroke="#5aa971"/><text x="135" y="184" font-size="15" text-anchor="middle" fill="#26364e">写回套接字</text><text x="135" y="204" font-size="14" text-anchor="middle" fill="#5a6b80">再关掉连接</text></svg>`, caption: `上面一排是收：连接排队、字节进缓冲、拆成结构；下面一排是发：挑处理器、拼响应、写回。` },
  { t: `h2`, text: `拆开有哪几块` },
  { t: `ul`, items: [
    `监听器：绑定端口并把连接排队，它只负责产出「一条已建立的连接」，不碰内容。`,
    `读缓冲：把这条连接上零零碎碎到达的字节攒进一个缓冲区，直到看见连续的两个换行，那才是头说完了。`,
    `请求对象：请求行切成方法、路径、协议版本三截；头部每行按第一个冒号切键和值，冒号后面的空格属于值。`,
    `响应对象：状态行、头部、空行、正文，四段顺序固定，Content-Length 得自己按字节数算出来，没人替你算。`,
    `分发与处理：拿方法加路径查一张表，找到该跑哪段代码，把生成的正文字节塞回响应对象。`,
    `循环：accept 一次只服务一条连接，所以外层必须一直转，要么就把每条连接甩给一个新线程。`
  ] },
  { t: `h2`, text: `做的顺序` },
  { t: `ul`, items: [
    `第一步只做收发不管解析：接上连接就把收到的原始字节一字不改打印出来。产出是你在终端里亲眼看见那三行 GET 空格斜杠 空格 HTTP/1.1 和一堆请求头。`,
    `第二步切成结构：请求行按空格切三截，头按行按冒号切。产出是一个有方法、有路径、有头字典的请求对象，哪怕还没有任何东西用它。`,
    `第三步写死一条响应：状态行 200、一个 Content-Type、一个 Content-Length，然后一小段固定正文。产出是浏览器屏幕上出现的第一行字，这条链算是通了。`,
    `第四步加分发和文件：路径查表，命中就读磁盘并把扩展名映射成 Content-Type，查不到就回 404。产出是一个能站住的静态服务器。`
  ] },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `只读一次就以为读完了：TCP 把请求切成几片送达是常态，必须循环读到空行为止，否则解析出来的头缺胳膊少腿。`,
    `两个换行少读一个：头的结束标志是回车换行再来一次回车换行，差一个字节就一直卡在等待上。`,
    `Content-Length 按字符数算：正文里有非 ASCII 字符时，UTF-8 的字节数比字符数大，长度填小了浏览器截断，填大了页面转圈。`,
    `换行写成单个换行符：HTTP 要求回车换行成对，某些客户端宽容，某些直接把这行当垃圾。`,
    `响应先写正文再写头：顺序错了就等于把正文当成了头的一部分，客户端解析失败。`,
    `忘了关连接或者忘了处理异常：一次畸形请求让进程整个退出，看起来像服务器莫名其妙死了。`,
    `端口被占：上次调试的进程没退干净，重启时报地址已被使用，换个端口或者等 TIME_WAIT 过去。`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `用 curl 的 verbose 模式打自己的服务器，把它打印的请求行和第一步日志里的字节逐个字符对上，说出差在哪。`,
    `加一条规则：路径以斜杠结尾时补上 index 文件再查磁盘。做完说清这是解析层该管还是分发层该管。`,
    `支持 HEAD 方法：头部完整、正文一个字节都不发。此时 Content-Length 该填什么，去浏览器和 curl 各验一次。`,
    `把「一次一条连接」改成每条连接一个线程或任务，然后同时开十个标签页刷新，比较改前改后的完成时间。`,
    `故意发一个没有结束空行的半截请求，看自己的服务器是等待、报错还是崩溃，再决定该怎么处置它。`
  ] },
  { t: `tip`, color: `green`, text: `一句话验收：字节进、结构出、结构变字节回，这条链在自己手里闭合了，才算真有一个 Web 服务器。` }
];
