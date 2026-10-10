window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["genai-c18"] = [
  { t: `tip`, color: `blue`, text: `本课目标：给 agent 下一个能用的一句话定义——模型加上状态加上工具，再看五种把这三样拼起来的办法有什么不同。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `第 12 课你已经让模型填过一次表格了，那是一次性的：问一句，调一次，答一句。agent 是把它变成循环——模型可以自己决定下一步做什么，做完看结果，再决定再下一步，直到它认为任务完成才开口回答。` },
  { t: `p`, text: `原教程给的定义只有三个词。模型还是那个模型，本身没变。多出来的第一样是状态：它干活时手里那份上下文，包括它已经做过什么、现在知道什么，下一步的选择就从这里推出来；框架存在的理由之一就是帮你把这份上下文维护住，别每轮都散架。第二样是工具：数据库、接口、外部应用，甚至另一个大模型都算工具。第三样容易被忽略但同样关键——可见性：开发者得知道模型这一步挑了哪个工具、为什么挑，不然出了问题只能猜。` },
  { t: `p`, text: `所以判断一个东西是不是 agent，别看宣传语，看它有没有在循环里读写状态、有没有真的执行动作。只有工具调用没有循环是助手；有循环但状态一轮就丢是玩具。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260"><defs><marker id="a18" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#475569"/></marker></defs><text x="20" y="22" font-size="16" font-weight="bold" fill="#0f172a">agent 就是这个圈，圈里转的是状态</text><rect x="40" y="58" width="150" height="52" rx="10" fill="#e0f2fe" stroke="#0284c7"/><text x="115" y="80" font-size="14" text-anchor="middle" fill="#0c4a6e">用户给一个目标</text><text x="115" y="100" font-size="14" text-anchor="middle" fill="#0c4a6e">不是给一个问题</text><rect x="250" y="58" width="150" height="52" rx="10" fill="#f1f5f9" stroke="#475569"/><text x="325" y="80" font-size="14" text-anchor="middle" fill="#0f172a">模型定下一步</text><text x="325" y="100" font-size="14" text-anchor="middle" fill="#0f172a">挑工具，填参数</text><rect x="460" y="58" width="150" height="52" rx="10" fill="#dcfce7" stroke="#16a34a"/><text x="535" y="80" font-size="14" text-anchor="middle" fill="#14532d">真的执行</text><text x="535" y="100" font-size="14" text-anchor="middle" fill="#14532d">查库 / 调接口 / 跑代码</text><rect x="250" y="160" width="150" height="52" rx="10" fill="#fef3c7" stroke="#d97706"/><text x="325" y="182" font-size="14" text-anchor="middle" fill="#92400e">观察结果</text><text x="325" y="202" font-size="14" text-anchor="middle" fill="#92400e">写回状态</text><line x1="190" y1="84" x2="248" y2="84" stroke="#475569" stroke-width="2" marker-end="url(#a18)"/><line x1="400" y1="84" x2="458" y2="84" stroke="#475569" stroke-width="2" marker-end="url(#a18)"/><line x1="535" y1="110" x2="440" y2="180" stroke="#475569" stroke-width="2" marker-end="url(#a18)"/><line x1="250" y1="186" x2="130" y2="120" stroke="#475569" stroke-width="2" marker-end="url(#a18)"/><text x="70" y="150" font-size="14" fill="#64748b">没完，再来一圈</text><text x="440" y="232" font-size="14" fill="#14532d">它认为完了，才用人话收口</text></svg>`, caption: `一圈走完才知道任务推进了多少；把这条箭头剪掉，agent 就退回成一次性助手` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `接一句"帮我下周去纽约该穿什么"，它自己去查天气、拿到结果再决定回答`,
    `把一份脏数据变成图：先写代码、再执行、报错再改，中间几步都是它自己排的`,
    `一个请求里既要做目标检测又要做图文描述，由它拆步骤并派给专门的模型`,
    `让几个角色互相追问：产品经理提想法，工程师反问可行性，直到方案能落地`
  ] },
  { t: `h2`, text: `演示 1 · 最小可用：一个函数当工具` },
  { t: `code`, lang: `python`, code: `def get_weather(location: str) -> str:
    """查指定地点的天气"""
    return lookup(location)

agent = Agent(client=chat_client,
              instructions="你是能查天气的助手，任务完成就停。",
              tools=[get_weather])

reply = agent.run("阿姆斯特丹现在穿得上外套吗？")` },
  { t: `p`, text: `工具的参数带类型标注，框架据此自动生成第 12 课你手写过的那份 schema，函数签名替它代劳了。状态由框架的会话线维护：请求、调用、结果按轮次留在同一条线上，还能落盘，暂停之后接着跑。可观测走标准协议，每一步调用都能追。` },
  { t: `h2`, text: `演示 2 · 让两个模型互相把话聊下去` },
  { t: `code`, lang: `python`, code: `coder = AssistantAgent(name="Coder", llm_config=llm_config)
pm = AssistantAgent(name="Product_manager",
                    system_message="负责提产品点子", llm_config=llm_config)

user_proxy = UserProxyAgent(name="user_proxy")   # 真人这一侧
user_proxy.initiate_chat(chatbot,
    message="下周去纽约，帮我想想要带什么衣服")` },
  { t: `p`, text: `这是 AutoGen 的路子：agent 既能跟人聊也能跟另一个模型聊，各配一份系统消息划定它管什么。用户代理那一格很关键——它可以决定继续跑还是当场停下，也就是说人在环这件事被写进了状态机而不是留在提示词里。这套思路后来被合并进微软那套框架，新项目直接用后者。` },
  { t: `h2`, text: `演示 3 · 代码优先与模型当工具` },
  { t: `p`, text: `TaskWeaver 是代码优先的：它不只在字符串里打转，能直接端 DataFrame，数据分析和画图这类活儿就顺手。状态由一个规划器承担，把请求拆成几件要做的事；工具是一组插件，可以是 Python 类也可以是通用解释器，插件描述存成向量供模型检索，跟第 16 课找文档是同一套机制。它还有一层叫经验：把过往对话沉淀进一份 YAML，某类任务会越做越对。执行前代码要先过校验。` },
  { t: `p`, text: `JARVIS 把工具换成了一堆专用模型：目标检测、语音转写、图像描述。调度的那个模型输出的是任务清单而不是话，一条 object-detection 带上图片路径和依赖关系，再按专用模型能吃的格式把请求拼好，收结果、汇总、答复用户。` },
  { t: `h2`, text: `演示 4 · 多个 agent 怎么排` },
  { t: `code`, lang: `python`, code: `# 接力：前一个的上下文交给后一个
sequential = SequentialBuilder(
    participants=[researcher, writer, editor]).build()

# 扇出：三个同时跑，结果再合起来
concurrent = ConcurrentBuilder(
    participants=[analyst_a, analyst_b, analyst_c]).build()` },
  { t: `p`, text: `串行适合有先后依赖的流程，写作之前得先有研究；并行适合彼此独立的视角，三份分析谁也不等谁，但最后要有人合稿。选错的代价很直接：该并行的排成队，时延乘以人数；该接力的并成一把，三个人各写一版开头。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `把循环打开就上线：没有步数上限，一次跑偏能连查二十次同一个接口`,
    `状态里什么都往里塞，轮次一多上下文爆掉，模型开始引用十轮前那条无关结果`,
    `工具描述含糊，模型挑错工具，而日志没记它当时的理由，事后无法复盘`,
    `每一步都要求人确认，跑到第五步没人再认真看过——确认退化成敲回车`,
    `多个 agent 之间没有收口的角色，谁都能发言，谁都不负责给出最终答案`,
    `拿 agent 做只需一次检索的事：多三倍的时延和多三倍的账单，换一个同样答案`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把第 12 课那次一次性函数调用改成循环：让它自己决定要不要继续，直到能回答为止，并设一个最大步数`,
    `给状态加一条打印：每一轮输出模型看到的上下文里有哪些工具调用和结果，数一数长度怎么涨`,
    `做一个双 agent 场景：一个提产品点子，一个专门挑毛病，规定三轮之后必须给出结论`,
    `把三个互不依赖的查询改成并行发起、统一汇总，对比串行版本的总时延`,
    `给你的 agent 写一份留痕：每一步用了哪个工具、入参、返回、耗时，坏一次后靠这份日志定位到具体哪步`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：agent 的能力不来自模型变聪明，来自它能把上一轮的结果当下一轮的输入——你维护好那份状态，它就少编一半话。` }
];
