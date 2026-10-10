/* 喵站 · build-your-own-x《从零写一个 Web 服务器》第 3 篇正文
 * 原创中文导读，不搬运原文正文；出处块由挂载层从 byox-data.js 的占位 tip 保留。
 */
window.MIAO_BYOX_BODY = window.MIAO_BYOX_BODY || {};
window.MIAO_BYOX_BODY["web-c03"] = [
  { t: `tip`, color: `blue`, text: `回源阅读：Codementor 上 Ziad Saab 的 Let's code a web server from scratch with NodeJS Streams，语言 Node.js。分成几篇递进（事件、读写字节、流式解析、压缩与分块传输），落地几百行，主题从头到尾只有一个：流。` },
  { t: `h2`, text: `这篇要造什么` },
  { t: `p`, text: `前两篇把响应当成一整坨字节：攒够了再发。这篇不这么干。它让服务器只在流与流之间接头：磁盘上那条文件是可读流，压缩是一层变换流，socket 是可写流，一次接线把三段串起来，数据一小段一小段往里推，内存里始终只留着一窗口的量。代价是你必须真正搞懂流那套状态机——分片、暂停、恢复、排空、结束、出错。造完你会明白为什么这台机器传一个两 GB 的文件时内存几乎不涨。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260"><rect x="20" y="70" width="120" height="60" rx="8" fill="#eef3fb" stroke="#5b8dd6"/><text x="80" y="95" font-size="15" text-anchor="middle" fill="#26364e">文件可读流</text><text x="80" y="115" font-size="14" text-anchor="middle" fill="#5a6b80">每次给一小块</text><line x1="140" y1="100" x2="176" y2="100" stroke="#5b8dd6" stroke-width="2"/><polygon points="176,94 188,100 176,106" fill="#5b8dd6"/><rect x="188" y="70" width="120" height="60" rx="8" fill="#eef3fb" stroke="#5b8dd6"/><text x="248" y="95" font-size="15" text-anchor="middle" fill="#26364e">压缩变换流</text><text x="248" y="115" font-size="14" text-anchor="middle" fill="#5a6b80">进一块出一块</text><line x1="308" y1="100" x2="344" y2="100" stroke="#5b8dd6" stroke-width="2"/><polygon points="344,94 356,100 344,106" fill="#5b8dd6"/><rect x="356" y="70" width="120" height="60" rx="8" fill="#eef3fb" stroke="#5b8dd6"/><text x="416" y="95" font-size="15" text-anchor="middle" fill="#26364e">分块编码</text><text x="416" y="115" font-size="14" text-anchor="middle" fill="#5a6b80">每块先报长度</text><line x1="476" y1="100" x2="512" y2="100" stroke="#5b8dd6" stroke-width="2"/><polygon points="512,94 524,100 512,106" fill="#5b8dd6"/><rect x="524" y="70" width="100" height="60" rx="8" fill="#f2fbf4" stroke="#5aa971"/><text x="574" y="95" font-size="15" text-anchor="middle" fill="#26364e">套接字</text><text x="574" y="115" font-size="14" text-anchor="middle" fill="#5a6b80">可写流</text><rect x="150" y="24" width="18" height="18" fill="#f6c344"/><rect x="176" y="24" width="18" height="18" fill="#f6c344"/><rect x="202" y="24" width="18" height="18" fill="#f6c344"/><text x="240" y="38" font-size="14" fill="#5a6b80">数据是一块一块往右挪的，不是一整坨</text><line x1="560" y1="170" x2="120" y2="170" stroke="#c07b3a" stroke-width="2" stroke-dasharray="6 4"/><polygon points="120,164 108,170 120,176" fill="#c07b3a"/><text x="200" y="192" font-size="14" fill="#8a5a24">背压：下游写不动了，上游就该停下等一声排空</text><text x="150" y="230" font-size="14" fill="#5a6b80">任何一段报错，整条管道都要销毁，不然文件句柄漏在手里</text></svg>`, caption: `横向是数据，虚线反方向是背压。这篇的关键就在这两条方向相反的信息流。` },
  { t: `h2`, text: `拆开有哪几块` },
  { t: `ul`, items: [
    `分片机制：可读流在被读到的时候才吐出下一块，块边界跟业务语义毫无关系，一个 HTTP 头可能被劈成三块到达。`,
    `缓冲与排空：往可写流里写，它塞满了会返回假，意思是「先停手」；等它排空会发一个事件喊你继续。忽略这两件事就等于把内存当队列。`,
    `流式解析器：一个状态机，边收字节边推进——在头部就一行行切，见空行转正文，正文长度未知时按分块编码的「一行十六进制长度」读，读到零块才算完。`,
    `管道接线：把上一条流的输出当下一条流的输入，一行代码接好；剩下的活是它的错误也要顺着传下来。`,
    `变换层：压缩、解压、编码转换都做成中间一段流，进一块出一块，不缓存全部。`,
    `收尾：头的空行、分块的终止零块、连接的关闭——三处漏一处，客户端就永远等着。`
  ] },
  { t: `h2`, text: `做的顺序` },
  { t: `ul`, items: [
    `先不碰网络，只用一条假想的可读流把一段文本按每十六字节吐出来，挂上监听。产出：看清块的边界和到达节奏，明白「一次事件不等于一行」。`,
    `写流式解析器，喂它两次：先给半截头，再补齐。产出：一个不会因为字节没齐就出残废对象的解析层。`,
    `把文件流接到 socket，挑一个大到内存受不了的文件。产出：进程内存平稳，传输时间换来的是恒定占用。`,
    `加一层压缩流并改用分块传输编码，因为压缩后的长度提前算不出来。产出：一条真管道，从磁盘一路推到浏览器。`
  ] },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `把一次数据事件当一行：切行的依据是字节流里的换行，不是事件次数。`,
    `无视写入返回的假值继续猛写：待发队列越堆越长，最后进程被自己撑死。`,
    `接线时不处理错误：任一端炸掉，另一端不会主动知道，连接和句柄都留着。`,
    `压缩完还填原文件的长度：正文换了，Content-Length 必须跟着换，否则客户端按旧数字截断或多等。`,
    `分块传输忘了最后的零块：那是唯一的结束信号，漏了就变成无限等待。`,
    `用同步读整个文件：这篇的全部意义就是不再这么干，一次调用把主线程堵死。`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把解析器写成一个只暴露「吐字节、返对象」接口的对象，然后拿一段被切成七零八落的请求测它，说清状态机在哪几个节点停住。`,
    `给这条管道加一层「行计数」变换流，专门统计收到了多少个头，用来定位畸形请求。`,
    `让同一个地址既能回压缩正文也能回原样正文，判断依据是请求头里那串接受编码。注意此时长度字段该怎么处理。`,
    `故意在响应里漏掉分块的终止零块，用浏览器和命令行各试一次，描述两边表现为何不同。`,
    `把一条流断开（比如中途关掉文件）后，证明剩下的段也都收到了错误并被销毁，而不是静悄悄挂着。`
  ] },
  { t: `tip`, color: `green`, text: `一句话验收：数据在几段流之间一小块一小块地挪，内存不涨、错误能传到底、结束有信号，这篇的流才算真接上了。` }
];
