/* 喵站 · build-your-own-x《从零写一个 Web 服务器》第 6 篇正文
 * 原创中文导读，不搬运原文正文；出处块由挂载层从 byox-data.js 的占位 tip 保留。
 */
window.MIAO_BYOX_BODY = window.MIAO_BYOX_BODY || {};
window.MIAO_BYOX_BODY["web-c06"] = [
  { t: `tip`, color: `blue`, text: `回源阅读：500 Lines or Less 里的 A Simple Web Server（作者 David Beazley），语言 Python。整章几十行服务器加一个约五十行的模板引擎，读两小时、写半天，是这一串里最克制的一篇。` },
  { t: `h2`, text: `这篇要造什么` },
  { t: `p`, text: `这篇的反差很强：服务器部分只有几十行，因为连接循环和 HTTP 字面解析都直接拿标准库；剩下整章篇幅留给了真正难的那个部件——模板引擎。它教的不是「什么都能自己写」，而是「哪些不必自己写」，以及把省下来的力气花在哪儿。造完你能把一台 Web 服务器拆成四层（套接字、协议、分发、内容），并且理解模板引擎为什么是个小编译器，而不是字符串替换。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 290"><rect x="20" y="46" width="180" height="40" rx="6" fill="#f2f3f5" stroke="#98a2b3"/><text x="110" y="71" font-size="14" text-anchor="middle" fill="#26364e">标准库：连接与循环</text><rect x="20" y="94" width="180" height="40" rx="6" fill="#f2f3f5" stroke="#98a2b3"/><text x="110" y="119" font-size="14" text-anchor="middle" fill="#26364e">标准库：HTTP 字面解析</text><rect x="20" y="142" width="180" height="40" rx="6" fill="#eef3fb" stroke="#5b8dd6"/><text x="110" y="167" font-size="14" text-anchor="middle" fill="#26364e">你写：路径到页面</text><rect x="20" y="190" width="180" height="40" rx="6" fill="#eef3fb" stroke="#5b8dd6"/><text x="110" y="215" font-size="14" text-anchor="middle" fill="#26364e">你写：模板引擎</text><line x1="200" y1="210" x2="248" y2="120" stroke="#5b8dd6" stroke-width="2"/><polygon points="244,116 252,114 248,124" fill="#5b8dd6"/><text x="256" y="118" font-size="15" fill="#26364e">模板编译：只做一次</text><rect x="256" y="132" width="110" height="40" rx="6" fill="#ffffff" stroke="#9db6d8"/><text x="311" y="157" font-size="14" text-anchor="middle" fill="#26364e">模板文本</text><line x1="366" y1="152" x2="392" y2="152" stroke="#5b8dd6" stroke-width="2"/><polygon points="392,146 404,152 392,158" fill="#5b8dd6"/><rect x="404" y="132" width="110" height="40" rx="6" fill="#ffffff" stroke="#9db6d8"/><text x="459" y="149" font-size="14" text-anchor="middle" fill="#26364e">切成片段</text><text x="459" y="165" font-size="14" text-anchor="middle" fill="#5a6b80">文字与占位</text><line x1="514" y1="152" x2="540" y2="152" stroke="#5b8dd6" stroke-width="2"/><polygon points="540,146 552,152 540,158" fill="#5b8dd6"/><rect x="552" y="132" width="70" height="40" rx="6" fill="#ffffff" stroke="#9db6d8"/><text x="587" y="157" font-size="14" text-anchor="middle" fill="#26364e">生成源码</text><line x1="587" y1="172" x2="587" y2="206" stroke="#5aa971" stroke-width="2"/><polygon points="581,206 587,218 593,206" fill="#5aa971"/><rect x="480" y="218" width="142" height="44" rx="8" fill="#f2fbf4" stroke="#5aa971"/><text x="551" y="238" font-size="15" text-anchor="middle" fill="#26364e">得到一个渲染函数</text><text x="551" y="256" font-size="14" text-anchor="middle" fill="#5a6b80">动态执行一次</text><line x1="478" y1="240" x2="440" y2="240" stroke="#5aa971" stroke-width="2"/><polygon points="440,234 428,240 440,246" fill="#5aa971"/><rect x="256" y="218" width="172" height="44" rx="8" fill="#f2fbf4" stroke="#5aa971"/><text x="342" y="238" font-size="14" text-anchor="middle" fill="#26364e">每个请求：数据进函数</text><text x="342" y="256" font-size="14" text-anchor="middle" fill="#5a6b80">出来就是正文，开销只剩调用</text></svg>`, caption: `左上是用与不用标准库的分界；右下那条链说明模板引擎只在启动时编译，请求期只调用函数。` },
  { t: `h2`, text: `拆开有哪几块` },
  { t: `ul`, items: [
    `服务器骨架：选一个处理流数据的服务器基类，它已经替你做好了「收连接、拿到读写句柄、循环」；再起一个带 HTTP 解析的处理器基类，把请求行与头切好、把状态行与长度写好。`,
    `一个方法就是路由终点：继承下来只实现处理某一种方法的那一个函数，其余全是现成的。这一步的代码量小得让人怀疑，但这就是设计的红利。`,
    `路径到页面的表：一组正则配上对应的函数，匹配到的分组直接当参数传进去；查不到就回一个 404 响应，别抛异常。`,
    `模板编译器：把模板文本切成「原样输出的片段」和「要从数据里取值的槽」两段，把槽写成取值表达式，拼出一段源码，动态执行得到一个函数。`,
    `渲染调用：之后每次请求只是把数据字典丢给那个函数，把返回值写进响应。`,
    `入口：绑地址端口、起循环，命令行参数里带上目录和端口。`
  ] },
  { t: `h2`, text: `做的顺序` },
  { t: `ul`, items: [
    `先用服务器基类配一个最简处理器，回一句固定文本。产出：二十行代码，浏览器开始有反应。`,
    `换成继承那个带 HTTP 解析的处理器基类，只实现对应方法的分支。产出：解析、状态行、长度字段都不再是你操心的事，你的代码只剩内容。`,
    `加正则路由表，做三个页面，其中一个从路径里取数。产出：路径里的数字变成参数进到函数签名里。`,
    `最后写模板引擎：编译一次得到函数，请求期只调用。产出：页面内容与 Python 代码分开，渲染成本降成一次函数调用。`
  ] },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `每个请求重新解析模板：编译的意义就没了，开销能差几十倍。缓存要放在类或者模块级，注意别写进可变的默认参数里。`,
    `模板不做转义：数据里带一个尖括号就把整页结构搞坏，取值填回去之前该转的一律转。`,
    `顺序颠倒：先写正文再设状态和头，基类不会替你倒回去，客户端拿到的是一个畸形响应。`,
    `服务器基类默认一次只伺候一条连接：一个慢请求卡住全站。换成线程或者进程版本只是换一个类名，但共享状态的复杂度立刻跟着来。`,
    `正则表先注册的先匹配：两条模式重叠时，结果取决于顺序而不是「哪条更精确」。`,
    `把静态文件和业务路径混在一张表里：模板和代码文件都会被当正文发出去，这是自己开门。`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `数一数这篇服务器的最终行数，再把你剥掉标准库后要补的行数写旁边，把差额归到三个部件上，说明哪个部件最难自造。`,
    `给模板引擎加一个条件片段。说清生成的源码结构要怎么变，以及为什么仍然只编译一次。`,
    `把路由表从写死改成注册式装饰器。指出注册发生在什么时候，晚于第一个请求会怎样。`,
    `加一条静态文件规则，处理带点点斜杠的路径：先规范化再判定它有没有跳出根目录。`,
    `把单线程换成并发的服务器基类，设计一个能看出前后区别的实验，并说出你愿意为并发多付的那部分复杂度是什么。`
  ] },
  { t: `tip`, color: `green`, text: `一句话验收：几十行就能有一台像样的服务器，剩下的力气全花在模板上——这篇教的正是「哪里不该自己写」。` }
];
