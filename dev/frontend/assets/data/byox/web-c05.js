/* 喵站 · build-your-own-x《从零写一个 Web 服务器》第 5 篇正文
 * 原创中文导读，不搬运原文正文；出处块由挂载层从 byox-data.js 的占位 tip 保留。
 */
window.MIAO_BYOX_BODY = window.MIAO_BYOX_BODY || {};
window.MIAO_BYOX_BODY["web-c05"] = [
  { t: `tip`, color: `blue`, text: `回源阅读：station.clancats.com 的 Writing a webserver in pure PHP，语言 PHP。单篇、短，几十到一百来行代码，但它的思路和前面几篇完全不同：这里的「服务器」不是常驻进程。` },
  { t: `h2`, text: `这篇要造什么` },
  { t: `p`, text: `在 PHP 里写 Web 服务器听着别扭——占端口那层早被开发服务器或者 Apache 占了。这篇要造的是它上面那一整层：一个进程只活一次、只伺候一个请求，把输入读干净、决定该跑哪段代码、把输出攒成响应，然后死掉。所谓 pure PHP，就是除了语言自带的超全局和函数之外谁也不请。造完你会理解 PHP 最反直觉的那条设定：没有常驻内存的服务状态，每个请求都是一次从零开始的生死。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="20" y="118" width="96" height="52" rx="8" fill="#eef3fb" stroke="#5b8dd6"/><text x="68" y="140" font-size="14" text-anchor="middle" fill="#26364e">一条请求</text><text x="68" y="158" font-size="14" text-anchor="middle" fill="#5a6b80">字节到达</text><line x1="116" y1="144" x2="140" y2="144" stroke="#5b8dd6" stroke-width="2"/><polygon points="140,138 152,144 140,150" fill="#5b8dd6"/><rect x="152" y="118" width="96" height="52" rx="8" fill="#f2f3f5" stroke="#98a2b3"/><text x="200" y="140" font-size="14" text-anchor="middle" fill="#26364e">外层服务</text><text x="200" y="158" font-size="14" text-anchor="middle" fill="#5a6b80">重写到一个入口</text><line x1="248" y1="144" x2="272" y2="144" stroke="#5b8dd6" stroke-width="2"/><polygon points="272,138 284,144 272,150" fill="#5b8dd6"/><rect x="284" y="70" width="150" height="148" rx="10" fill="#fffaf0" stroke="#c07b3a" stroke-dasharray="5 4"/><text x="359" y="90" font-size="14" text-anchor="middle" fill="#8a5a24">一个新的解释器进程</text><rect x="300" y="102" width="118" height="34" rx="6" fill="#ffffff" stroke="#d8b78a"/><text x="359" y="124" font-size="14" text-anchor="middle" fill="#26364e">填好超全局</text><rect x="300" y="142" width="118" height="34" rx="6" fill="#ffffff" stroke="#d8b78a"/><text x="359" y="164" font-size="14" text-anchor="middle" fill="#26364e">路由分发</text><rect x="300" y="182" width="118" height="28" rx="6" fill="#ffffff" stroke="#d8b78a"/><text x="359" y="201" font-size="14" text-anchor="middle" fill="#26364e">正文进缓冲</text><line x1="434" y1="144" x2="458" y2="144" stroke="#5aa971" stroke-width="2"/><polygon points="458,138 470,144 458,150" fill="#5aa971"/><rect x="470" y="118" width="80" height="52" rx="8" fill="#f2fbf4" stroke="#5aa971"/><text x="510" y="140" font-size="14" text-anchor="middle" fill="#26364e">头与正文</text><text x="510" y="158" font-size="14" text-anchor="middle" fill="#5a6b80">一次发出</text><line x1="550" y1="144" x2="574" y2="144" stroke="#5aa971" stroke-width="2"/><polygon points="574,138 586,144 574,150" fill="#5aa971"/><rect x="586" y="118" width="36" height="52" rx="8" fill="#fbeceb" stroke="#c4534c"/><text x="604" y="146" font-size="14" text-anchor="middle" fill="#26364e">销毁</text><text x="30" y="252" font-size="14" fill="#8a5a24">中间那个虚线框活完这一次就没了：下一个请求是另一个全新的进程，两者不共享任何变量</text><text x="30" y="276" font-size="14" fill="#5a6b80">所以这篇要操心的不是循环与线程，而是「一次生死内怎么把输入读干净、把输出攒起来」</text></svg>`, caption: `PHP 的一请求一进程：虚线框里的东西请求结束就蒸发，这是它和前面几篇最大的分野。` },
  { t: `h2`, text: `拆开有哪几块` },
  { t: `ul`, items: [
    `入口脚本：所有地址被重写到同一个文件，它只做三件事——装请求、查路由、发响应。业务代码一行都不该出现在这里。`,
    `请求对象：方法、路径、查询串、头都从超全局里收；正文要自己去读那个输入流，因为不是所有请求体都是表单，没人替你解析。`,
    `路由：一张 URI 模式到处理器的表，变量段用带名的正则分组抠出来，别做字符串相等比较。`,
    `处理器：请求对象进、响应对象出。这一层不许碰超全局，一碰就没法单测。`,
    `响应对象：状态码、头、正文三样攒着，收尾时统一发出；正文是字符串而不是随手打印出来的碎片。`,
    `视图：一段模板脚本，把数据变成 HTML 字符串。它负责拼字，不负责决定拼什么。`,
    `输出缓冲：语言要求头必须在任何字节漏出去之前设好。把正文先攒进缓冲区，就是这条约束的工程解。`
  ] },
  { t: `h2`, text: `做的顺序` },
  { t: `ul`, items: [
    `先用语言自带的开发服务器把入口脚本跑起来，把方法、路径、查询、头的原始形状打印出来。产出：确认重写规则真的把所有地址都送到了你这一个文件。`,
    `装出请求对象和响应对象，处理器只准跟这两个对象打交道。产出：输入变干净，输出被攒住而不是半路漏出去。`,
    `加路由表和未命中分支。产出：不同 URL 落到不同处理器，异常 URL 有一个像样的响应而不是一片空白。`,
    `补视图层和错误页：数据交给模板，异常统一转成 500。产出：一层能往上继续长东西的地基。`
  ] },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `设头之前有输出：哪怕文件末尾多一个换行，头就设不上了，还会附带一句谁也看不懂的警告。`,
    `以为正文总在表单那个超全局里：换 JSON 或者文件上传之后它是空的，得自己读输入流，而且读一次就没了。`,
    `状态码靠打印出来：不通过专门的函数设置，客户端拿到的永远是 200。`,
    `想缓存点东西留在内存里：进程一死全都蒸发，要缓存就得请外部存储，这是设计约束不是 bug。`,
    `拿路径直接开文件：请求里带点点斜杠就能跳出根目录，必须先规范化再判定它还在根内。`,
    `开发服务器和线上重写规则不一样：本地跑通、线上一片 404，八成是这一步没对齐。`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把入口脚本改成一个内核类，只留装请求、分发、发响应三个方法。说清为什么改完这一步才谈得上单元测试。`,
    `加一条带变量段的路由，让处理器能从路径里取到编号，并说明它被放进请求对象的哪个字段。`,
    `故意在设状态码之前打印一个字符，观察头和警告，再用缓冲把它修掉，指出修的是哪一层。`,
    `做出 404 和 500 两条错误路径：线上崩了不许把堆栈直接吐给浏览器。`,
    `把同一份内核挪到另一种外层服务器底下跑，列出你为重写规则新写的那段配置，并解释为什么非写不可。`
  ] },
  { t: `tip`, color: `green`, text: `一句话验收：一次进程生死之内，输入装成对象、路径查到人、输出攒成一份完整响应——PHP 的「服务器」就在这一个请求里。` }
];
