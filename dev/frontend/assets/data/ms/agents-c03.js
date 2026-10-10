window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["agents-c03"] = [
  { t: `tip`, color: `blue`, text: `本课目标：看清框架到底替你做掉了哪段代码，以及"本地 SDK"和"托管服务"这两层各自把状态存在哪里。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `上一课手写的那段循环——认出工具请求、执行、回填、再问一次——是每一套 agent 代码里最不值钱的部分。框架做的第一件事就是把它收走：你把一个普通函数交给它，它读出函数名、参数类型和文档字符串，生成一份结构化描述随请求发出去；模型回了一个调用意图，框架按名字找到你的函数、按参数解好包、把返回值塞回上下文并自动续跑。你的代码里只剩下那个函数本身。` },
  { t: `p`, text: `第二件事是决定状态住在谁的进程里。SDK 路线（本课的 Microsoft Agent Framework）在你机器上跑循环，上下文在你手里，改起来快，但进程一死这段对话就没了。托管路线（Foundry Agent Service）把对话拆成 thread 和 run 两个服务端对象：thread 存消息，run 是一次执行，你的脚本只是个发请求的壳，重启、多实例、换机器都不影响它，代价是调试时看不到最中间那层。两条线能同时用：本地写、托管跑。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#fffaf3"/><text x="320" y="24" font-size="17" fill="#4a3b2f" text-anchor="middle">上面那一圈是框架接走的，下面这一刀是框架替你选的</text><rect x="16" y="52" width="180" height="36" rx="6" fill="#f7eee2" stroke="#e8ded2"/><text x="106" y="75" font-size="14" fill="#4a3b2f" text-anchor="middle">① 你写一个普通函数</text><path d="M196 70 L220 70" stroke="#8a7867" stroke-width="2"/><polygon points="230,70 220,65 220,75" fill="#8a7867"/><rect x="230" y="52" width="180" height="36" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="320" y="75" font-size="14" fill="#4a3b2f" text-anchor="middle">② 框架生成工具描述</text><path d="M410 70 L434 70" stroke="#8a7867" stroke-width="2"/><polygon points="444,70 434,65 434,75" fill="#8a7867"/><rect x="444" y="52" width="180" height="36" rx="6" fill="#fbe3c6" stroke="#e0821f"/><text x="534" y="75" font-size="14" fill="#4a3b2f" text-anchor="middle">③ 模型回一个调用意图</text><path d="M624 70 L634 70 L634 146 L630 146" stroke="#8a7867" stroke-width="2" fill="none"/><polygon points="624,146 634,141 634,151" fill="#8a7867"/><rect x="444" y="128" width="180" height="36" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="534" y="151" font-size="14" fill="#4a3b2f" text-anchor="middle">④ 按名字派发执行</text><path d="M444 146 L420 146" stroke="#8a7867" stroke-width="2"/><polygon points="410,146 420,141 420,151" fill="#8a7867"/><rect x="230" y="128" width="180" height="36" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="320" y="151" font-size="14" fill="#4a3b2f" text-anchor="middle">⑤ 返回值塞回上下文</text><path d="M230 146 L206 146" stroke="#8a7867" stroke-width="2"/><polygon points="196,146 206,141 206,151" fill="#8a7867"/><rect x="16" y="128" width="180" height="36" rx="6" fill="#d5f0e8" stroke="#12a58a"/><text x="106" y="151" font-size="14" fill="#4a3b2f" text-anchor="middle">⑥ 自动续跑，再问一次</text><path d="M106 128 L106 108 L460 108 L460 94" stroke="#c0392b" stroke-width="2" fill="none"/><polygon points="460,88 454,98 466,98" fill="#c0392b"/><text x="290" y="104" font-size="14" fill="#c0392b" text-anchor="middle">转一圈，函数名和文档字符串就是模型唯一的线索</text><text x="16" y="194" font-size="15" fill="#4a3b2f">第二件事：这段对话状态住在谁的进程里</text><rect x="16" y="204" width="296" height="74" rx="6" fill="#f7eee2" stroke="#5b7cfa"/><text x="30" y="226" font-size="14" fill="#4a3b2f">SDK 路线 · 循环在你机器上</text><text x="30" y="246" font-size="14" fill="#8a7867">上下文在你手里，改起来快</text><text x="30" y="266" font-size="14" fill="#c0392b">进程一死，这段对话就没了</text><rect x="328" y="204" width="296" height="74" rx="6" fill="#f7eee2" stroke="#12a58a"/><text x="342" y="226" font-size="14" fill="#4a3b2f">托管路线 · 服务端存 thread</text><text x="342" y="246" font-size="14" fill="#8a7867">thread 存消息，run 是一次执行</text><text x="342" y="266" font-size="14" fill="#8a7867">脚本只是发请求的壳，重启不影响</text><text x="16" y="292" font-size="14" fill="#4a3b2f">两条能同时用：本地写、托管跑 —— 差别只在中间那层你看不看得见</text></svg>`, caption: `上半是框架替你收走的那段循环，下半是它替你做的第二个选择：状态放哪` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `十几行代码起一个能自己调函数的 agent，不用先写一整套调度`,
    `给不同 agent 分角色并串起来跑，中途某一环失败时看得清是谁没交出结果`,
    `把对话状态放到服务端，让长任务跨进程、跨重启继续`,
    `在工具上设一道人工确认，敏感动作由人按下而不是由模型按下`
  ] },
  { t: `h2`, text: `演示 1 · 一个函数怎么就变成工具` },
  { t: `code`, lang: `python`, code: `from agent_framework import tool\n\n@tool(approval_mode="never_require")\ndef book_flight(date: str, location: str) -> str:\n    """Book travel given location and date."""\n    return f"已订 {location} 的行程，日期 {date}"` },
  { t: `p`, text: `模型挑不挑对这个函数，取决于那行文档字符串和参数名——它是唯一被发出去当说明的东西，写得含糊，选错就别怪模型。approval_mode 换成需要确认，框架就会在真正执行前停下来等一次人工点头。` },
  { t: `h2`, text: `演示 2 · 最小可跑的 agent` },
  { t: `code`, lang: `python`, code: `import os, asyncio\nfrom agent_framework.foundry import FoundryChatClient\nfrom azure.identity import AzureCliCredential\n\nprovider = FoundryChatClient(\n    project_endpoint=os.environ["AZURE_AI_PROJECT_ENDPOINT"],\n    model=os.environ["AZURE_AI_MODEL_DEPLOYMENT_NAME"],\n    credential=AzureCliCredential(),\n)\nagent = provider.as_agent(instructions="帮用户订行程，信息齐了再用工具。", tools=[book_flight])\nprint(asyncio.run(agent.run("我想 1 月 1 日去纽约")))` },
  { t: `p`, text: `那三个环境变量正是第 1 课 .env 里的东西，凭据走的是同一条已登录会话——框架没有新增任何秘密要管。` },
  { t: `h2`, text: `演示 3 · 把对话状态搬到服务端` },
  { t: `code`, lang: `python`, code: `agent = client.agents.create_agent(\n    model=DEPLOYMENT, instructions="你是订票助手",\n    tools=code_interpreter.definitions,\n)\nthread = client.agents.create_thread()\nclient.agents.create_message(thread_id=thread.id, role="user", content="画一张利润柱状图给我")\nrun = client.agents.create_and_process_run(thread_id=thread.id, agent_id=agent.id)\nfor m in client.agents.list_messages(thread_id=thread.id):\n    print(m)` },
  { t: `p`, text: `取回的消息不止文字：可能是图片、文件，也可能是又一次工具请求。所以别只读最后一条，遍历才看得全这次到底产出了什么。` },
  { t: `h2`, text: `演示 4 · 两个 agent 排队干活` },
  { t: `code`, lang: `python`, code: `retrieve = provider.as_agent(name="dataretrieval", instructions="用工具取相关数据。", tools=[retrieve_tool])\nanalyze = provider.as_agent(name="dataanalysis", instructions="只对给出的数据做统计结论。")\n\ndata = await retrieve.run("取 Q4 的销量数据")\nresult = await analyze.run(f"分析这份数据：{data}")\nprint(result)` },
  { t: `p`, text: `注意中间那一跳是手工传的：上一个的输出被拼进下一个的输入，转述丢了多少信息全看这一句怎么写。拆开的收益是每个 agent 的指令短到一句话就能检验，出问题能定位到取数错了还是结论错了。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `文档字符串和参数名随手写：模型只看到这些，选错工具、传错参数多半从这里来`,
    `敏感动作把 approval_mode 设成从不确认：删数据、付款这类应当留一道人工`,
    `把 SDK 的本地上下文当成持久化状态：进程一重启就空了，需要跨重启就换 thread`,
    `框架版本混用：SDK 和托管服务概念同名不同接口，同一份代码里混着调会拿到看不懂的报错`,
    `拆 agent 拆得过细：五个角色传五次话，每次转述都掉一点信息，最后没人知道原始需求是什么`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `只用框架，把第 2 课演示 2 那段手写循环删干净，并说清每一行被谁接走了`,
    `故意把 book_flight 的文档字符串改成含糊的一句，观察模型选错工具的那一次`,
    `同一句需求分别用本地 SDK 和服务端 thread 跑两遍，重启脚本后看哪一边还记得上文`,
    `给一个订票流程加上需要确认的工具，写出人在什么时机被打断最合理`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：框架真正替你做的两件事是"把函数变成工具、把循环接管走"，以及"决定对话状态存在你进程里还是服务端 thread 里"——后面每一条课都建立在这两件事上。` }
];
