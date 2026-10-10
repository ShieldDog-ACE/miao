window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["webdev-c26"] = [
  { t: `tip`, color: `blue`, text: `本课目标：做一个浏览器里能对话的聊天界面，看清一句发言要经过哪几站、为什么中间必须有一个后端。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `大模型那端只有一个函数式的接口：你把一串消息发过去，它回一段文本。它不记得上一句——每次调用看到的都是这一次发过去的全部内容，所谓「连续对话」是客户端把之前的话重新带上。所以聊天应用真正的工作在前端和后端这两层：前端收集输入、画消息；后端拿着密钥去调模型，再把回答原路送回。` },
  { t: `p`, text: `密钥必须在后端，这条不是风格问题：前端 JavaScript 里的任何字符串，查看源码就能看见，写进去等于把你的访问令牌发给所有访客。后端那一跳同时解决另外几件事——限流、把系统提示词补进报文、记录会话、把模型的输出切成前端好用的形状。消息在这个体系里有三种身份：system 定规矩（你是谁、怎么答）、user 是用户说的、assistant 是模型答过的；把前两类按顺序拼进数组，就构成了「记忆」。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320" font-family="sans-serif"><text x="320" y="22" font-size="15" text-anchor="middle" fill="#22314e">一句「你好」的往返，和第二次要重发的东西</text><rect x="16" y="46" width="150" height="54" rx="6" fill="#eef4ff" stroke="#5b7fd1"/><text x="91" y="70" font-size="14" text-anchor="middle" fill="#22314e">输入框 + 发送</text><text x="91" y="90" font-size="14" text-anchor="middle" fill="#5b6a86">submit 事件</text><rect x="186" y="46" width="150" height="54" rx="6" fill="#fff6e6" stroke="#c9922b"/><text x="261" y="70" font-size="14" text-anchor="middle" fill="#7a5310">POST /hello</text><text x="261" y="90" font-size="14" text-anchor="middle" fill="#7a5310">只有这一句文本</text><rect x="356" y="46" width="150" height="54" rx="6" fill="#f7eefb" stroke="#8a5bb0"/><text x="431" y="70" font-size="14" text-anchor="middle" fill="#4d2f66">后端</text><text x="431" y="90" font-size="14" text-anchor="middle" fill="#4d2f66">补密钥、补系统提示</text><rect x="526" y="46" width="98" height="54" rx="6" fill="#e8f6ee" stroke="#3d9a63"/><text x="575" y="70" font-size="14" text-anchor="middle" fill="#1d4230">模型</text><text x="575" y="90" font-size="14" text-anchor="middle" fill="#1d4230">一段文本</text><line x1="166" y1="73" x2="184" y2="73" stroke="#5b6a86" stroke-width="2"/><line x1="336" y1="73" x2="354" y2="73" stroke="#5b6a86" stroke-width="2"/><line x1="506" y1="73" x2="524" y2="73" stroke="#5b6a86" stroke-width="2"/><line x1="575" y1="100" x2="575" y2="120" stroke="#3d9a63" stroke-width="2"/><line x1="575" y1="120" x2="91" y2="120" stroke="#3d9a63" stroke-width="2"/><line x1="91" y1="120" x2="91" y2="146" stroke="#3d9a63" stroke-width="2"/><text x="320" y="140" font-size="14" text-anchor="middle" fill="#1d4230">回答沿原路回来，前端 append 一条 div</text><rect x="16" y="164" width="608" height="90" rx="6" fill="#f7f8fb" stroke="#8896ad"/><text x="32" y="188" font-size="14" fill="#22314e">第二次请求，前端得把这一串重新发过去：</text><rect x="32" y="200" width="180" height="34" rx="4" fill="#e8f6ee" stroke="#3d9a63"/><text x="122" y="222" font-size="14" text-anchor="middle" fill="#1d4230">system：你是谁</text><rect x="222" y="200" width="180" height="34" rx="4" fill="#eef4ff" stroke="#5b7fd1"/><text x="312" y="222" font-size="14" text-anchor="middle" fill="#22314e">user：你好</text><rect x="412" y="200" width="180" height="34" rx="4" fill="#f7eefb" stroke="#8a5bb0"/><text x="502" y="222" font-size="14" text-anchor="middle" fill="#4d2f66">assistant：回答</text><text x="320" y="250" font-size="14" text-anchor="middle" fill="#a5321f">模型这边没有会话状态，少发一条它就少知道一句</text><text x="320" y="300" font-size="14" text-anchor="middle" fill="#22314e">浏览器（存输入与历史）→ 后端（存密钥）→ 模型（什么都不存）</text></svg>`, caption: `上面那排是一次请求的四站，下面那块是第二次请求的内容——聊天记录是前端攒出来的，不是模型记的。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `把一段只有模型能听懂的话包装成一个网页，朋友打开链接就能试`,
    `换模型、换提示词只改后端一处，前端一个字不动`,
    `能在送出前拦住空消息、在等待时按住按钮，不至于一次发出去十条`,
    `回答是文本，进 DOM 前先转义，模型说什么都不会变成你的页面代码`
  ] },
  { t: `h2`, text: `演示 1 · 送出这一句` },
  { t: `code`, lang: `javascript`, code: `async handleSubmit(event) {\n  event.preventDefault();\n  const text = this.input.value.trim();\n  if (!text) return;\n  this.setLoading(true);\n  this.appendMessage(text, 'user');\n  this.input.value = '';\n  try {\n    const reply = await this.callAPI(text);\n    this.appendMessage(reply, 'assistant');\n  } catch (error) { this.appendMessage('连不上，稍后再试', 'error'); } finally { this.setLoading(false); }\n}` },
  { t: `p`, text: `顺序里有两个决定：用户那句先画上去，不等后台——等回复回来才画，界面会有两三秒像没听见；输入框立刻清空，让人能接着打。失败也要画成一条消息而不是只写在控制台，第 23 课那条规矩在这儿照样成立。finally 那一句是必需：出异常时如果按钮还锁着，用户就只能刷新页面。` },
  { t: `h2`, text: `演示 2 · 前后端那一跳` },
  { t: `code`, lang: `javascript`, code: `async callAPI(message) {\n  const response = await fetch(this.API_ENDPOINT, {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ message }), });\n  if (!response.ok) throw new Error('HTTP status: ' + response.status);\n  const data = await response.json();\n  return data.response;\n}` },
  { t: `p`, text: `这段和第 22 课发账户的那个函数形状一模一样，只是地址换成自己的后端。API_ENDPOINT 指向 localhost:8000 或你的线上域名，前后端不同源时后端必须带 CORS 响应头，否则浏览器直接在控制台报被策略拦住——报错在浏览器，改动却要写在后端。发出去的是 JSON 文本，回来也要 .json() 一次。` },
  { t: `h2`, text: `演示 3 · 画之前先转义` },
  { t: `code`, lang: `javascript`, code: `appendMessage(text, role) {\n  const box = document.createElement('div');\n  box.className = 'message ' + role;\n  const holder = document.createElement('div');\n  holder.textContent = text;\n  box.append(holder);\n  this.messages.append(box);\n  this.messages.scrollTop = this.messages.scrollHeight;\n}` },
  { t: `p`, text: `textContent 只当文本处理，innerHTML 会把字符串当 HTML 解析：模型输出的代码片段里正好有个 img 标签带 onerror，那句话就成了在你页面里执行的脚本。第 23 课讲过一次这个区别，聊天场景里更危险，因为显示的是不可控的长文本。className 上把角色写进去，CSS 才能把用户和助手的消息分左右，最后两行是自动滚到最新一条。` },
  { t: `h2`, text: `演示 4 · 等待时把界面按住` },
  { t: `code`, lang: `javascript`, code: `setLoading(isLoading) {\n  this.sendButton.disabled = isLoading;\n  this.input.disabled = isLoading;\n  this.sendButton.textContent = isLoading ? 'Thinking...' : 'Send';\n}` },
  { t: `code`, lang: `html`, code: `<form id="chatForm" autocomplete="off">\n  <input id="messageInput" type="text" placeholder="问点什么" aria-label="Message">\n  <button id="sendBtn" type="submit">Send</button>\n</form>\n<div id="messages" role="log" aria-live="polite"></div>` },
  { t: `p`, text: `模型回答慢，这几秒里用户完全可能再按十次回车：禁用按钮和输入框是止住重复请求的那一步，按钮文案换成进行中，让人知道程序没死。列表容器加 role 为 log、aria-live 为 polite，读屏软件会在有新消息时念出来——聊天界面天生是动态内容，不加这两个属性对某些人等于整页是空的。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `把访问令牌写进前端 JavaScript：查看源码就能拿到，账单算在你头上，任何「前端不显示所以安全」的想法都不成立`,
    `以为模型记得上一句：它只看这一次收到的数组，历史要前端自己攒着每次重发`,
    `用 innerHTML 渲染回复：模型给的任何标签都会被当真，先 textContent 或转义`,
    `请求期间不锁界面：连点五次就是五条并发请求，回复回来的顺序还可能跟你发的不一样`,
    `等回复期间界面上没有任何变化：三秒延迟在用户眼里和卡死同义，进行中状态是必需的一条反馈`,
    `CORS 报错去改前端代码：这是浏览器的同源策略，白名单要写在那台后端上`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把一个输入框和两条消息样式做出来，让 user 和 assistant 左右分开`,
    `让后端返回固定文本先跑通这一跳，再换成真的模型，说出你改了哪一层`,
    `在输入框里贴一段带 HTML 标签的文字发出去，观察页面显示成什么，并解释原因`,
    `在慢回复的时候连点五次发送，先猜会发生什么，再用 Network 面板验证，然后加上那一步拦截`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：模型只吃这一次发过去的消息数组，所以「对话」是前端攒出来的状态；密钥、提示词、限流放后端，输入、渲染、等待态留前端，这条线划错了就既不安全也不好看。` }
];
