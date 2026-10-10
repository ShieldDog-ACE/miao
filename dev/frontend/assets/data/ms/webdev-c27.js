window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["webdev-c27"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把上一课那个聊天框升级成旅行行程生成器——模型的输出要能被程序接着用，而不是贴在一块 div 里读。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `裸调接口时，四件事都得自己写：拼消息数组、把提示词抄一遍、解析回来的文本、换一个模型供应商再改一遍。框架这层的价值就是把它们变成四个固定零件。模板：一句带占位符的话，变量填进去就出消息，全项目共用同一份说法。解析器：事先约定返回哪几个字段，回来就校验形状。工具：把你的函数说明交给模型，让它请求调用。检索：把文档切成块存成向量，回答前先捞回相关的几段。换供应商只动一处配置。` },
  { t: `p`, text: `行程生成器需要的是能渲染的数据，不是散文：三个变量（去哪儿、几天、多少预算）进去，一份按天分组的结构出来。模型不联网，也不知道今天的天气和票价，这些事实得由工具或检索补给它，否则它会给出一个很像真的数字。回答长，就一边生成一边显示。这一课的例子仍按上一课那套前端写法：表单收输入，fetch 送出去，回来按字段画 DOM。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320" font-family="sans-serif"><text x="320" y="22" font-size="15" text-anchor="middle" fill="#22314e">同一个请求，两种回来的东西</text><rect x="16" y="44" width="280" height="120" rx="6" fill="#fdf1ef" stroke="#c0574a"/><text x="156" y="66" font-size="15" text-anchor="middle" fill="#a5321f">只说「帮我规划三天」</text><rect x="36" y="80" width="240" height="46" rx="4" fill="#ffffff" stroke="#c0574a"/><text x="156" y="100" font-size="14" text-anchor="middle" fill="#22314e">一大段散文，第一天…</text><text x="156" y="118" font-size="14" text-anchor="middle" fill="#22314e">换行、加粗、口语都在里面</text><text x="156" y="150" font-size="14" text-anchor="middle" fill="#a5321f">程序只能整块贴上去</text><rect x="344" y="44" width="280" height="120" rx="6" fill="#f2f9f4" stroke="#3d9a63"/><text x="484" y="66" font-size="15" text-anchor="middle" fill="#1d4230">模板 + 约定字段</text><rect x="364" y="80" width="240" height="46" rx="4" fill="#ffffff" stroke="#3d9a63"/><text x="484" y="100" font-size="14" text-anchor="middle" fill="#22314e">days: [{ day, plan, meals }]</text><text x="484" y="118" font-size="14" text-anchor="middle" fill="#22314e">回来即校验，形状不对就报错</text><text x="484" y="150" font-size="14" text-anchor="middle" fill="#1d4230">三个字段画成三行界面</text><line x1="296" y1="104" x2="344" y2="104" stroke="#5b6a86" stroke-width="2"/><text x="320" y="96" font-size="14" text-anchor="middle" fill="#5b6a86">差别</text><rect x="16" y="190" width="130" height="66" rx="6" fill="#eef4ff" stroke="#5b7fd1"/><text x="81" y="214" font-size="14" text-anchor="middle" fill="#22314e">表单三个值</text><text x="81" y="236" font-size="14" text-anchor="middle" fill="#5b6a86">填进模板</text><rect x="186" y="190" width="130" height="66" rx="6" fill="#f7eefb" stroke="#8a5bb0"/><text x="251" y="214" font-size="14" text-anchor="middle" fill="#4d2f66">模型</text><text x="251" y="236" font-size="14" text-anchor="middle" fill="#4d2f66">决定要查天气</text><rect x="356" y="190" width="130" height="66" rx="6" fill="#fff6e6" stroke="#c9922b"/><text x="421" y="214" font-size="14" text-anchor="middle" fill="#7a5310">你的代码</text><text x="421" y="236" font-size="14" text-anchor="middle" fill="#7a5310">真的去发这个请求</text><rect x="526" y="190" width="98" height="66" rx="6" fill="#e8f6ee" stroke="#3d9a63"/><text x="575" y="214" font-size="14" text-anchor="middle" fill="#1d4230">再问一次</text><text x="575" y="236" font-size="14" text-anchor="middle" fill="#1d4230">这次带事实</text><line x1="146" y1="223" x2="184" y2="223" stroke="#5b6a86" stroke-width="2"/><line x1="316" y1="223" x2="354" y2="223" stroke="#5b6a86" stroke-width="2"/><line x1="486" y1="223" x2="524" y2="223" stroke="#5b6a86" stroke-width="2"/><path d="M421 190 q0 -30 -70 -30 q-70 0 -70 30" fill="none" stroke="#c9922b" stroke-dasharray="5 4"/><text x="420" y="288" font-size="14" text-anchor="middle" fill="#22314e">模型不会自己上网：它返回「请调这个函数、参数是这些」，动手的是你的代码，转回来的还是你送过去的</text></svg>`, caption: `上半是两种输出的差别，下半是工具调用那一圈——请求由模型提出，执行和回报由你的程序完成。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `一份提示词改一次，全站的问法跟着变，不用在七八个地方同步`,
    `行程按天、按餐、按预算分列显示：拿到的是对象，不是要正则切开的长文本`,
    `把天气、汇率这类实时数据交给你的函数去查，模型不再猜数字`,
    `长文本边生成边出现，用户两秒后就开始读到，而不是干等十二秒`
  ] },
  { t: `h2`, text: `演示 1 · 模板：把问法固定下来` },
  { t: `code`, lang: `javascript`, code: `const SYSTEM = '你是行程规划员，只按给定字段回答，不要寒暄。';\nfunction tripPrompt(destination, days, budget) {\n  const human = destination + '，' + days + ' 天，预算 ' + budget + ' 元。';\n  return [\n    { role: 'system', content: SYSTEM },\n    { role: 'user', content: human },\n  ];\n}` },
  { t: `p`, text: `框架里这东西叫 ChatPromptTemplate，占位符写在句子里，format 一次就得到消息数组——本质就是把这段文本换成具体值，所以浏览器端一个函数也能做到。真正需要注意的是别把用户输入直接拼进 system 那句话：任何人都能在输入框里写「忽略上面那条」，你的规矩和它的数据在模型看来是同一段文本，指令与内容要分开放。` },
  { t: `h2`, text: `演示 2 · 结构化输出：先约定字段` },
  { t: `code`, lang: `javascript`, code: `function drawTrip(data) {\n  if (!Array.isArray(data.days)) throw new Error('返回的形状不对');\n  const box = document.getElementById('result');\n  box.innerHTML = '';\n  for (const day of data.days) {\n    const li = document.createElement('li');\n    const head = document.createElement('strong');\n    head.textContent = '第 ' + day.day + ' 天：' + day.plan;\n    li.append(head, document.createTextNode(' ' + (day.meals || []).join(' / ')));\n    box.append(li);\n  }\n}` },
  { t: `p`, text: `后端把字段表和那句「只返回这些键」一起发过去，回来再用 JsonOutputParser 或等价的一段校验切成对象。前端这段的第一行才是关键：形状不对就抛错，别写 data.days 然后祈祷——模型偶尔会多给一层或者少一个键，那时你要给用户一句「再试一次」，而不是让控制台里躺一个 undefined 报错、页面空白。渲染仍然走 textContent，理由和上一课一样。` },
  { t: `h2`, text: `演示 3 · 工具调用：模型按你的按钮` },
  { t: `code`, lang: `javascript`, code: `const tools = {\n  weather: (city) => fetch('/api/weather?city=' + encodeURIComponent(city)).then((r) => r.json()),\n};\nasync function run(messages) {\n  const answer = await askModel(messages, Object.keys(tools));\n  if (answer.tool_call) {\n    const out = await tools[answer.tool_call.name](answer.tool_call.args.city);\n    messages.push({ role: 'tool', content: JSON.stringify(out) });\n    return run(messages);\n  }\n  return answer.text;\n}` },
  { t: `p`, text: `你把工具的名字和参数说明发过去，模型回的可能是「请调 weather，参数 city 是京都」——它没有网络，动手的是这段代码。查完把结果作为一条 tool 消息追加进数组，再问一次，这一轮它才拿事实作答。框架里 bind_tools 生成的就是上面这个循环。要防的两件事：参数不可信，city 得转义（拼进 URL 是第 23 课那条）；递归要有上限，否则模型反复要工具就永远回不来。` },
  { t: `h2`, text: `演示 4 · 流式：边生成边画` },
  { t: `code`, lang: `javascript`, code: `const response = await fetch('/api/trip', { method: 'POST', body: JSON.stringify(form) });\nconst reader = response.body.getReader();\nconst decoder = new TextDecoder();\nfor (;;) {\n  const part = await reader.read();\n  if (part.done) break;\n  out.textContent += decoder.decode(part.value);\n  out.scrollTop = out.scrollHeight;\n}` },
  { t: `p`, text: `这就是「stream」在浏览器这端的形状：响应体是一个块流，一段一段读，读到的字马上写进界面，用户两秒后就能开始读。Python 那端的 stream 是逐块 yield，前端这边是逐块 read，两边对上才有这个效果。代价也要知道：结构化输出和流式不能全占——字段是一点点拼出来的，中途的 JSON 不完整，只能整块解析或者按行处理。真要又流又结构化，就让文字部分流式显示、字段等最后一块回来再填。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `占位符没填全就发出去：句子里还剩大括号原样在，模型把没换的变量名当成谜面猜`,
    `把用户输入拼进系统提示：它和规矩在同一段文本里，一句「忽略上面的话」就能改写你的设定`,
    `信模型报的票价和营业时间：它按语言规律编一个像样的数，实时事实必须走工具或检索`,
    `不做形状校验直接用返回的字段：少一个键就整页空白，报错只躺在控制台`,
    `以为流式让回答更快：总时长一样，只是提前看见了，这段时间里别把界面锁死`,
    `把框架当黑盒叠满零件：出问题分不清是模型、模板还是解析器的错，每一层都要能单独打印出它收到什么`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把上一课的聊天框改造成三个输入（城市、天数、预算），用一个模板函数生成消息数组`,
    `约定三个字段让模型按形状返回，并故意让它返回错的形状，看你那行校验有没有兜住`,
    `加一个工具（查天气或查汇率），说出这一次请求总共发过去几轮、每轮多了什么`,
    `让结果流式显示，再列出你为了流式不得不放弃的那件事`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：模板管你怎么问，schema 管它怎么答，工具管它缺的事实从哪来，流式管这几秒界面在干什么——四件事分开做，行程才既像人写的又能被程序画出来。` }
];
