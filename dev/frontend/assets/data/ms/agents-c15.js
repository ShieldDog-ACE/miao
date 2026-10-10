window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["agents-c15"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把前面几课的概念落到一个具体框架上，看清一个生产级 agent 运行时要管哪几件事——调模型、调工具、存对话、编排、观测。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `**Microsoft Agent Framework** 把 agent 拆成几层：最里面是推理服务（Azure OpenAI 或兼容接口），只负责补全，不负责记住上一句；中间是 agent 本身：一段指令、一个名字、一组工具；外面是 thread（多轮对话的状态）和 workflow（把多个执行器连成图）。分层的好处是换模型不动业务代码，加编排不动模型代码。orchestration 是重点：sequential 一步步走，concurrent 多个 agent 同时干，group chat 围着一个任务说话，handoff 干完自己那段就把控制权交给下一个，还有 manager 动态拆任务派给子 agent。选哪种取决于任务能不能切开：能切就并发，切不开又有明确先后就顺序，需要反复讨论就群聊。**middleware** 是卡在两个环节上的钩子：function middleware 在 agent 与工具之间，chat middleware 在 agent 与模型请求之间。钩子函数收到一个 next，调不调、什么时候调，决定请求是否真的发出去——日志、鉴权、限流这些与业务无关的事就从指令里搬进了代码。**memory** 分三层：thread 内的即时记忆（进程活着才有）、跨会话持久化的消息历史（store 工厂注册）、运行前从外部取回再塞进上下文的动态注入。观测走 OpenTelemetry，工具调用和编排步骤都能打 span。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320" font-family="sans-serif"><rect width="640" height="320" fill="#fffaf3"/><text x="320" y="22" font-size="17" fill="#4a3b2f" text-anchor="middle">分层是为了换模型不动业务代码，加编排不动模型代码</text><rect x="26" y="40" width="290" height="188" rx="8" fill="#fffaf3" stroke="#5b7cfa" stroke-width="2"/><text x="38" y="58" font-size="14" fill="#4a3b2f">workflow：多个 executor 连成图</text><rect x="48" y="68" width="246" height="150" rx="8" fill="#f8f1e6" stroke="#e0821f" stroke-width="2"/><text x="60" y="88" font-size="14" fill="#4a3b2f">thread：多轮对话的状态</text><rect x="70" y="98" width="202" height="110" rx="8" fill="#fffaf3" stroke="#12a58a" stroke-width="2"/><text x="82" y="118" font-size="14" fill="#4a3b2f">agent：指令、名字、工具</text><rect x="92" y="130" width="158" height="64" rx="6" fill="#faded9" stroke="#c0392b"/><text x="171" y="154" font-size="14" fill="#7f1d1d" text-anchor="middle">推理服务</text><text x="171" y="176" font-size="14" fill="#7f1d1d" text-anchor="middle">只补全，不记上一句</text><rect x="26" y="242" width="290" height="28" rx="6" fill="#fbe3c6" stroke="#e0821f"/><text x="171" y="261" font-size="14" fill="#4a3b2f" text-anchor="middle">chat middleware 卡在模型请求两侧</text><rect x="26" y="280" width="290" height="28" rx="6" fill="#fbe3c6" stroke="#e0821f"/><text x="171" y="299" font-size="14" fill="#4a3b2f" text-anchor="middle">function middleware 卡在工具执行两侧</text><text x="336" y="44" font-size="14" fill="#8a7867">orchestration 怎么选：</text><text x="336" y="66" font-size="14" fill="#4a3b2f">能切开又互不依赖 → concurrent</text><text x="336" y="88" font-size="14" fill="#4a3b2f">切不开但有先后 → sequential</text><text x="336" y="110" font-size="14" fill="#4a3b2f">要反复讨论 → group chat</text><text x="336" y="132" font-size="14" fill="#4a3b2f">做完自己那格就交棒 → handoff</text><text x="336" y="154" font-size="14" fill="#4a3b2f">由 manager 动态拆任务派下去</text><text x="336" y="186" font-size="14" fill="#8a7867">memory 分三层：</text><text x="336" y="208" font-size="14" fill="#4a3b2f">thread 内即时：进程活着才有</text><text x="336" y="230" font-size="14" fill="#4a3b2f">持久化历史：注册 store 工厂</text><text x="336" y="252" font-size="14" fill="#4a3b2f">跑前动态注入：外部记忆服务</text><text x="336" y="284" font-size="14" fill="#c0392b">middleware 里不调 await next：</text><text x="336" y="304" font-size="14" fill="#c0392b">请求发不出去，工具也不执行</text></svg>`, caption: `左边四层是从内到外的包含关系，右边两叠是它替你做好的两个决定——编排按能不能切开选，记忆按活多久选` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `p`, text: `把它当成一个已经写好骨架的旅行服务：一个 agent 推荐目的地，一个查景点，thread 让它在第二轮还记得你说过怕晒。它真正值得假设的是长跑——对话线程可以序列化存起来，明天再恢复；工作流可以打检查点，出错后从断点继续而不是从头重跑。它还能把别家写好的 agent 接进来：走 A2A 协议指一个远端 agent，用 MCP 接外部工具。` },
  { t: `h2`, text: `演示 1 · 建一个 agent 并跑起来` },
  { t: `p`, text: `最小可用形态就三个输入：推理服务、指令、名字。跑一次是非流式的，流式则逐块吐字。` },
  { t: `code`, lang: `python`, code: `agent = AzureOpenAIChatClient(credential=AzureCliCredential()).create_agent(\n    instructions="You are good at recommending trips based on preferences.",\n    name="TripRecommender",\n)\nresult = await agent.run("What are good places to visit in Amsterdam?")\nprint(result.text)` },
  { t: `p`, text: `**run** 还能临时改参数：这一轮用哪个模型、最多吐多少 token、允许调哪几个工具，都可以只对本次生效。` },
  { t: `h2`, text: `演示 2 · 工具、线程与记忆` },
  { t: `p`, text: `工具是普通函数，参数上的类型注解加一句描述就是模型看到的 schema——描述不准，模型就不知道该不该调它。` },
  { t: `code`, lang: `python`, code: `def get_attractions(\n    location: Annotated[str, Field(description="City to look up")],\n) -> str:\n    """Get the top tourist attractions for a given location."""\n    return f"The top attractions for {location} are..."\n\nresult = await agent.run("Best place in Seattle?", tools=[get_attractions])` },
  { t: `p`, text: `多轮对话靠 thread：跑完序列化存进数据库，下次反序列化回来，上下文就接上了。` },
  { t: `code`, lang: `python`, code: `thread = agent.get_new_thread()\nresponse = await agent.run("I want a warm beach in October.", thread=thread)\n\nserialized_thread = await thread.serialize()\nresumed_thread = await agent.deserialize_thread(serialized_thread)` },
  { t: `p`, text: `要跨会话记住东西，就在建 agent 时注册消息存储工厂；接外部记忆服务则把它作为 context provider 传进去，运行前由框架取回相关记忆塞进上下文。` },
  { t: `h2`, text: `演示 3 · middleware 与 workflow` },
  { t: `code`, lang: `python`, code: `async def logging_function_middleware(\n    context: FunctionInvocationContext,\n    next: Callable[[FunctionInvocationContext], Awaitable[None]],\n) -> None:\n    print(f"[Function] Calling {context.function.name}")\n    await next(context)          # 不调这一行，工具就不会被执行\n    print(f"[Function] {context.function.name} completed")` },
  { t: `p`, text: `workflow 用两类东西搭：**executor** 是节点，收消息、干活、发消息，可以是 agent 也可以是纯代码；**edge** 是连线，除了点对点直连，还有条件边、开关边、扇出边、扇入边。跑的过程中会抛出结构化事件，订阅它们就能把整条链路画出来。` },
  { t: `code`, lang: `python`, code: `builder = WorkflowBuilder()\nbuilder.add_edge(source_executor, target_executor)\nbuilder.set_start_executor(source_executor)\nworkflow = builder.build()` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `把 thread 当永久记忆：它只在一次对话里有效，跨会话得显式持久化或用外部记忆服务，否则进程重启就归零。`,
    `工具描述写得太含糊：模型的调用决策几乎全靠那段描述，不写清什么时候该调，它就在不该调的时候调。`,
    `middleware 里忘了 await next，或者顺序写反——想校验参数却在校验前先把请求放了出去。`,
    `观测没接上。agent 一旦跑起来就不确定，看不见 span 和工具调用记录时，出错只能靠猜。`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `一个 agent 先根据预算筛目的地、再查筛选结果的天气：该选哪种 orchestration？换成两个查询互不依赖时答案会变吗？`,
    `同一段对话跑两轮，把 thread 序列化再反序列化后接着问第三轮：它记得前两轮吗？为什么？`,
    `workflow 里「房型不可用」要改推别的方案：这该用条件边还是开关边？`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：框架的意义不在少写代码，而在把模型调用、工具执行、对话状态、编排和观测拆成五件能各自替换的事——分对了，坑才只有一处要填。` }
];
