window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["agents-c02"] = [
  { t: `tip`, color: `blue`, text: `本课目标：说清 agent 和普通对话差在哪一层代码里，并知道什么活儿根本不该交给它。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `模型本身只会生成文字。把它叫作 agent，是因为有人在外面套了一套东西：一个它能读到的环境、几个它读状态的手段、几个它真的能按下去的按钮。少了这三样，模型说"我帮你订好了"，什么都不会发生。` },
  { t: `p`, text: `所以一次问答和一轮 agent 的区别是数量级的。问答是一发一收，收完就结束。agent 的一轮是：模型输出的不是一段话，而是一个结构化的工具请求；本地代码认出它是请求，去查数据库或调接口，把结果原样塞回上下文，再问一次模型。这个"再问一次"就是循环，循环每转一圈，上下文里就多一截事实。转到模型不再要工具为止，它才吐给人看的文字。上一课配的端点和凭据，就是在支撑这一圈一圈的外发请求。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#fffaf3"/><text x="320" y="24" font-size="17" fill="#4a3b2f" text-anchor="middle">上面一发一收，下面这个回箭头才叫 agent</text><text x="16" y="66" font-size="14" fill="#8a7867">一次性问答</text><rect x="104" y="46" width="76" height="30" rx="5" fill="#f7eee2" stroke="#e8ded2"/><text x="142" y="66" font-size="14" fill="#4a3b2f" text-anchor="middle">提问</text><path d="M180 61 L208 61" stroke="#8a7867" stroke-width="2"/><polygon points="214,61 204,56 204,66" fill="#8a7867"/><rect x="214" y="46" width="76" height="30" rx="5" fill="#fbe3c6" stroke="#e0821f"/><text x="252" y="66" font-size="14" fill="#4a3b2f" text-anchor="middle">模型</text><path d="M290 61 L318 61" stroke="#8a7867" stroke-width="2"/><polygon points="324,61 314,56 314,66" fill="#8a7867"/><rect x="324" y="46" width="76" height="30" rx="5" fill="#f7eee2" stroke="#e8ded2"/><text x="362" y="66" font-size="14" fill="#4a3b2f" text-anchor="middle">回答</text><text x="416" y="66" font-size="14" fill="#8a7867">中间没查过任何新事实</text><text x="16" y="122" font-size="14" fill="#8a7867">agent 的一轮</text><path d="M442 150 L442 128 L68 128 L68 144" stroke="#c0392b" stroke-width="2" fill="none"/><polygon points="68,152 62,142 74,142" fill="#c0392b"/><text x="256" y="122" font-size="14" fill="#c0392b" text-anchor="middle">把结果原样塞回上下文，再问一次</text><rect x="16" y="152" width="104" height="54" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="68" y="174" font-size="14" fill="#4a3b2f" text-anchor="middle">上下文</text><text x="68" y="194" font-size="14" fill="#8a7867" text-anchor="middle">每圈在变长</text><path d="M120 179 L144 179" stroke="#8a7867" stroke-width="2"/><polygon points="150,179 140,174 140,184" fill="#8a7867"/><rect x="150" y="152" width="76" height="54" rx="6" fill="#fbe3c6" stroke="#e0821f"/><text x="188" y="174" font-size="14" fill="#4a3b2f" text-anchor="middle">模型</text><text x="188" y="194" font-size="14" fill="#8a7867" text-anchor="middle">输出条目</text><path d="M226 179 L250 179" stroke="#8a7867" stroke-width="2"/><polygon points="256,179 246,174 246,184" fill="#8a7867"/><rect x="256" y="152" width="104" height="54" rx="6" fill="#f7eee2" stroke="#e8ded2"/><text x="308" y="174" font-size="14" fill="#4a3b2f" text-anchor="middle">工具请求</text><text x="308" y="194" font-size="14" fill="#8a7867" text-anchor="middle">不是给人看的话</text><path d="M360 179 L384 179" stroke="#8a7867" stroke-width="2"/><polygon points="390,179 380,174 380,184" fill="#8a7867"/><rect x="390" y="152" width="104" height="54" rx="6" fill="#f7eee2" stroke="#e8ded2"/><text x="442" y="174" font-size="14" fill="#4a3b2f" text-anchor="middle">本地执行</text><text x="442" y="194" font-size="14" fill="#8a7867" text-anchor="middle">查库、调接口</text><path d="M494 179 L518 179" stroke="#8a7867" stroke-width="2"/><polygon points="524,179 514,174 514,184" fill="#8a7867"/><rect x="524" y="152" width="100" height="54" rx="6" fill="#d5f0e8" stroke="#12a58a"/><text x="574" y="174" font-size="14" fill="#4a3b2f" text-anchor="middle">才吐文字</text><text x="574" y="194" font-size="14" fill="#8a7867" text-anchor="middle">不再要工具时</text><text x="16" y="238" font-size="14" fill="#8a7867">转一圈：</text><rect x="84" y="222" width="120" height="24" rx="4" fill="#dfe8ff" stroke="#5b7cfa"/><text x="144" y="239" font-size="14" fill="#4a3b2f" text-anchor="middle">原始提问</text><text x="228" y="239" font-size="14" fill="#8a7867">转两圈：</text><rect x="296" y="222" width="176" height="24" rx="4" fill="#dfe8ff" stroke="#5b7cfa" stroke-width="1"/><text x="384" y="239" font-size="14" fill="#4a3b2f" text-anchor="middle">再加一次工具结果</text><text x="492" y="239" font-size="14" fill="#8a7867">转三圈：</text><rect x="556" y="222" width="68" height="24" rx="4" fill="#dfe8ff" stroke="#5b7cfa"/><text x="590" y="239" font-size="14" fill="#4a3b2f" text-anchor="middle">答案</text><text x="16" y="278" font-size="14" fill="#4a3b2f">打印出来的那个圈数才是真实读数——它没有上限时，会一直往上下文里塞事实</text></svg>`, caption: `区别不在模型换没换，而在有没有那个把结果塞回去再问一次的回环` },
  { t: `p`, text: `循环能转，靠的是两件提前定好的东西：允许它用哪些工具，以及它手上累积着哪些记忆。短期记忆就是当前这段上下文，长期记忆要你自己接存储。工具能做什么，完全由环境和你接进去的东西决定——模型不会凭空多出一个能力，它只会挑你已经给它的那个。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `p`, text: `判断该不该用 agent，看三条：步骤能不能提前写死、任务要不要跨好几个回合调工具、系统是否需要从反馈里变好。三条一条都不中，用一次性问答更便宜也更稳。` },
  { t: `ul`, items: [
    `行程类：从"我这周末想去成都"推到查航班、比价、订房、发确认，中间任何一步失败它会换路子再试`,
    `客服类：先读工单，再查订单状态，需要时才升级给人，不必每个词都走一遍固定话术`,
    `分析类：开放式问题下自己决定先看哪张表、看完再决定要不要看第二张`
  ] },
  { t: `h2`, text: `演示 1 · 先给它装上能做事的那两样` },
  { t: `code`, lang: `python`, code: `from azure.ai.projects import AIProjectClient\nfrom azure.identity import AzureCliCredential\n\nclient = AIProjectClient(endpoint=ENDPOINT, credential=AzureCliCredential())\nagent = client.agents.create_agent(\n    model=DEPLOYMENT,\n    instructions="只处理行程预订，缺日期就先问",\n    tools=[{"type": "function", "name": "search_flights"}],\n)` },
  { t: `p`, text: `instructions 是它的行为边界，tools 是它的能力边界。这两样创建时就固定了，运行中模型只能在这个圈里挑。` },
  { t: `h2`, text: `演示 2 · 一轮里到底发生了什么` },
  { t: `code`, lang: `python`, code: `turn = 0\nwhile turn < 5:\n    reply = client.run(agent, thread)\n    if not reply.tool_calls:\n        break\n    for call in reply.tool_calls:\n        client.submit_tool_outputs(thread, call.id, look_up(call))\n    turn += 1\nprint(turn, reply.text)` },
  { t: `tip`, color: `blue`, text: `注意 print 的那个 turn：它才是"这轮 agent 转了几圈"的真实读数。一次性问答没有这个数，因为它只有一发一收，中间没查过任何新事实。` },
  { t: `h2`, text: `演示 3 · 反射型和目标型，差的是一层循环` },
  { t: `code`, lang: `python`, code: `def reflex(msg):\n    return "转客服" if "投诉" in msg else None\n\ndef goal(msg):\n    todo = plan(msg)\n    while todo:\n        step = todo.pop(0)\n        todo.extend(run(step))\n    return done()` },
  { t: `p`, text: `左边那类看见关键词就走固定分支，没有记忆、没有规划，但也几乎不会出错——能用它就别用右边。右边会自己把"从当前位置到目的地"拆成可执行步骤，代价是它可能拆错，而拆错时没人拦得住。` },
  { t: `h2`, text: `演示 4 · 剩下的几种，区别只在多加了哪一样` },
  { t: `ul`, items: [
    `模型型反射：多一张内部世界模型，价格涨了它会更新，而不是每次都从零判断`,
    `效用型：不满足于"找到一个方案"，给候选打分配比代价和便利，挑分最高的`,
    `学习型：把事后评分喂回去，改下一次的推荐`,
    `分层型：一句"取消行程"被拆成退机票、退房、退租车，各交给下面的 agent`,
    `多 agent：各自管酒店、机票、娱乐，协作或竞价——本质还是上面几种叠在一起`
  ] },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `把"能循环"当目的：套五层循环问一个查表就能答的问题，慢且贵，还更容易跑偏`,
    `给的工具比需要多：能力圈越大，模型选错的概率越高，日志也越难读`,
    `不设最大轮数：演示 2 里那个 5 是刹车，删掉它，模型反复要同一个工具时你会烧光配额`,
    `指望模型记住没写进上下文的事：没接存储，它就没有长期记忆`,
    `出了错先怀疑模型笨：更多时候是工具返回的结构不对，回看上一圈的原始输出`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `只靠一次性问答实现"查北京到成都最便宜的机票"，再改成带一个工具的 agent 版本，记下两边的输出轮数`,
    `把演示 2 的最大轮数从 5 改成 1，观察结果从哪一句开始变得不像话`,
    `挑一件你每天都会做的小事，写出它属于反射型还是目标型，并说明为什么不需要更多层`,
    `给演示 1 的 instructions 加一条硬边界，然后用一句越界请求验证它确实被挡住了`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：agent 不是更聪明的模型，而是模型外面多了一段"输出工具请求就执行、执行完回填再问一次"的循环——判断要不要用它，先看这循环值不值。` }
];
