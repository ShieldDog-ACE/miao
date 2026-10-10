/* 喵站 · build-your-own-x《从零写一个 Web 服务器》第 7 篇正文
 * 原创中文导读，不搬运原文正文；出处块由挂载层从 byox-data.js 的占位 tip 保留。
 */
window.MIAO_BYOX_BODY = window.MIAO_BYOX_BODY || {};
window.MIAO_BYOX_BODY["web-c07"] = [
  { t: `tip`, color: `blue`, text: `回源阅读：Ruslan Spivak 的 Let's Build A Web Server 系列第一篇，语言 Python。整个系列四篇递进，本篇从最裸的套接字一路走到「服务器与应用切开」，代码两三百行，读一天、写一天。` },
  { t: `h2`, text: `这篇要造什么` },
  { t: `p`, text: `先不用任何带 HTTP 的库，自己调套接字把字节收上来、把响应写回去；然后把「服务器」和「应用」用刀切开，中间只留一份契约：服务器交给应用一个环境字典，应用用一个回调把状态码和头交回去，再返回一串字节。这份契约在 Python 世界里叫 WSGI。这篇真正的价值在切开那一步：切完之后，应用可以换任何服务器，服务器能跑任何应用，两边各自演进，互不认识。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="20" y="40" width="260" height="212" rx="10" fill="#eef3fb" stroke="#5b8dd6"/><text x="150" y="64" font-size="15" text-anchor="middle" fill="#26364e">服务器这一侧（本篇前半）</text><rect x="44" y="80" width="212" height="34" rx="6" fill="#ffffff" stroke="#9db6d8"/><text x="150" y="102" font-size="14" text-anchor="middle" fill="#26364e">建 绑 听 接 四步</text><rect x="44" y="122" width="212" height="34" rx="6" fill="#ffffff" stroke="#9db6d8"/><text x="150" y="144" font-size="14" text-anchor="middle" fill="#26364e">一条连接一个线程</text><rect x="44" y="164" width="212" height="34" rx="6" fill="#ffffff" stroke="#9db6d8"/><text x="150" y="186" font-size="14" text-anchor="middle" fill="#26364e">读够字节再解析</text><rect x="44" y="206" width="212" height="34" rx="6" fill="#ffffff" stroke="#9db6d8"/><text x="150" y="228" font-size="14" text-anchor="middle" fill="#26364e">把状态 头 正文写回去</text><rect x="360" y="40" width="260" height="212" rx="10" fill="#f2fbf4" stroke="#5aa971"/><text x="490" y="64" font-size="15" text-anchor="middle" fill="#26364e">应用这一侧（一个可调用对象）</text><rect x="384" y="104" width="212" height="34" rx="6" fill="#ffffff" stroke="#9ac9ad"/><text x="490" y="126" font-size="14" text-anchor="middle" fill="#26364e">查路径 生成正文</text><rect x="384" y="146" width="212" height="34" rx="6" fill="#ffffff" stroke="#9ac9ad"/><text x="490" y="168" font-size="14" text-anchor="middle" fill="#26364e">返回一串字节</text><rect x="384" y="188" width="212" height="34" rx="6" fill="#ffffff" stroke="#9ac9ad"/><text x="490" y="210" font-size="14" text-anchor="middle" fill="#26364e">它不知道有套接字</text><line x1="280" y1="112" x2="372" y2="112" stroke="#c07b3a" stroke-width="2"/><polygon points="372,106 384,112 372,118" fill="#c07b3a"/><text x="290" y="104" font-size="14" fill="#8a5a24">环境字典</text><line x1="384" y1="160" x2="292" y2="160" stroke="#c07b3a" stroke-width="2"/><polygon points="292,154 280,160 292,166" fill="#c07b3a"/><text x="296" y="178" font-size="14" fill="#8a5a24">回调交回状态与头</text><text x="30" y="278" font-size="14" fill="#5a6b80">中间这三条线就是契约：两边只认这三样东西，谁也不许伸进对方的身体里</text></svg>`, caption: `左边归字节，右边归内容，中间三条线就是契约。契约写对了，两边可以各自换掉。` },
  { t: `h2`, text: `拆开有哪几块` },
  { t: `ul`, items: [
    `套接字四步：建、绑、听、接。绑之前那行允许地址复用小选项能救你两分钟——不加它，重启时端口还在 TIME_WAIT 里不肯放。`,
    `并发：主循环只做接连接这一件事，接完就把这条连接甩给一个新线程去读写。不这么做，一个浏览器标签就能把你占死。`,
    `解析：循环读直到看见连续两个换行；请求行按空格切三截，头每行按第一个冒号切，值里的前导空格属于值本身。`,
    `序列化：状态行由协议版本、状态码、原因短语三部分组成，然后逐行写头，最后一个空行，再写正文——少一个字节客户端就猜。`,
    `契约：应用是个可调用对象，收两个参数（环境字典、回调），返回字节的序列；回调用来把状态码和头交回给服务器。`,
    `静态与目录：路径映射到磁盘位置，扩展名映射到内容类型，未命中回 404，异常路径回 500 而不是让线程带着堆栈消失。`
  ] },
  { t: `h2`, text: `做的顺序` },
  { t: `ul`, items: [
    `最裸版本：接一条连接，打印收到的字节，写一句固定的响应，关掉。产出：确认那四步调用的顺序和缓冲区是真的，不是想象。`,
    `补解析和并发：读够完整请求才解析，每条连接一个线程。产出：同时开五个标签页不再互相等，请求行和头都躺在一个字典里。`,
    `把生成内容的逻辑抽成契约：服务器只负责喂环境、调回调、发正文。产出：换一页内容不需要动服务器一行代码。`,
    `加静态文件、内容类型表和两种错误码。产出：一台能对外演示、异常不崩进程的服务器。`
  ] },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `一次读取当整个请求：字节分片到达是常态，判断依据只有那个双换行。`,
    `关了主循环却忘了关连接：文件句柄慢慢耗尽，最后accept 都失败，症状是「跑一阵就死」。`,
    `状态行拼错：协议版本、原因短语和状态码三者不一致，某些客户端直接断开。`,
    `头和正文之间少那个空行：整个响应被当成一堆头，正文永远等不到。`,
    `应用返回字符串而不是字节：写套接字时炸出类型错误。编码这一步归谁要在契约里说死，别两边都做。`,
    `线程里直接共享计数、日志句柄而不加保护：症状是偶发、复现不了、日志串行。`,
    `把请求路径当可信输入拿去开文件：带点点斜杠的一步就跳出根目录。`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `用 netcat 手工敲三行请求，记得最后那个空行；再敲一次故意漏掉空行的版本，说出你的服务器分别停在哪儿。`,
    `把应用换成两个不同的可调用对象而服务器代码一行不改。据此说明这份契约到底给你买到了什么。`,
    `设计一种情形：应用里的回调被调了两次。先写下服务器该怎么反应，再去实现它。`,
    `用浏览器请求一张图片，把扩展名到内容类型那张表补齐；然后解释少了这张表时浏览器会怎么对待你的字节。`,
    `把并发改回「处理完一条再接下一条」，量一下同时开十个标签页的完成时间差，说清并发买到了什么、又贵在哪儿。`
  ] },
  { t: `tip`, color: `green`, text: `一句话验收：套接字那层能收能发，契约那层能随手换应用——切开之后，它才不再是一块焊死的铁。` }
];
