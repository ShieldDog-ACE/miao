window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["agents-c08"] = [
  { t: `tip`, color: `blue`, text: `本课目标：学会把一句模糊的需求变成**能判完成、能分派、能被程序读**的计划，并看清计划在整个 agent 链路里处在哪个位置。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `现实里的任务几乎都不是一步能做完的。模型一次输出只能覆盖有限的注意力，所以 agent 需要一个**简明的总目标**来约束自己接下来的每一步：目标决定它检索什么、调用哪个工具、什么时候算完。规划（planning）机制就是三步：**定总目标 → 拆成有边界的子任务 → 把子任务排成有依赖顺序的序列**。拆完之后每个子任务都可以单独交给一个专职 agent 或一段流程，最后由一个协调者把结果拼回一份完整答案。关键点常被忽略：计划的输出格式不是给人看的散文，而是给下一段代码看的。第 5 课讲过工具调用靠 JSON schema，规划同理——一旦计划是结构化的，分发、重试、统计成本都能写成普通程序，不用再靠模型读心。` },
  { t: `ul`, items: [
    `**按环节拆**：订机票、订酒店、租车、当地活动，天然对应四个可独立完成的子任务。`,
    `**按角色拆**：信息收集、比较决策、写最终文案，适合一条流水线上的不同模型配置。`,
    `**按风险拆**：把会花钱、会发消息、会改数据的动作单独切成一步，方便卡人工确认（承接第 7 课的信任设计）。`,
    `拆的粒度由**判得出的完成条件**决定：子任务写不出「怎样算做完了」，就说明拆得太粗。`
  ] },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#fffaf3"/><text x="320" y="24" font-size="17" fill="#4a3b2f" text-anchor="middle">一句模糊需求往下走四步，交出去的都必须是能解析的数据</text><rect x="20" y="44" width="264" height="40" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="152" y="69" font-size="14" fill="#4a3b2f" text-anchor="middle">① 定总目标：带约束的一句话</text><path d="M152 84 L152 100" stroke="#8a7867" stroke-width="2"/><polygon points="152,112 146,102 158,102" fill="#8a7867"/><rect x="20" y="112" width="264" height="40" rx="6" fill="#fbe3c6" stroke="#e0821f"/><text x="152" y="137" font-size="14" fill="#4a3b2f" text-anchor="middle">② 拆成子任务，各写完成条件</text><path d="M152 152 L152 168" stroke="#8a7867" stroke-width="2"/><polygon points="152,180 146,170 158,170" fill="#8a7867"/><rect x="20" y="180" width="264" height="40" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="152" y="205" font-size="14" fill="#4a3b2f" text-anchor="middle">③ 排依赖：能并行的同时发</text><path d="M152 220 L152 236" stroke="#8a7867" stroke-width="2"/><polygon points="152,248 146,238 158,238" fill="#8a7867"/><rect x="20" y="248" width="264" height="40" rx="6" fill="#d5f0e8" stroke="#12a58a"/><text x="152" y="273" font-size="14" fill="#4a3b2f" text-anchor="middle">④ 按 assigned_agent 查表分发</text><text x="304" y="48" font-size="14" fill="#4a3b2f">一份计划长这样（给下一段代码看的）：</text><rect x="304" y="58" width="320" height="26" rx="4" fill="#fffaf3" stroke="#e8ded2"/><text x="314" y="76" font-size="14" fill="#4a3b2f">flight_booking → 订往返机票</text><rect x="304" y="90" width="320" height="26" rx="4" fill="#fffaf3" stroke="#e8ded2"/><text x="314" y="108" font-size="14" fill="#4a3b2f">hotel_booking → 订两晚，先定城市才算完</text><rect x="304" y="122" width="320" height="26" rx="4" fill="#fffaf3" stroke="#e8ded2"/><text x="314" y="140" font-size="14" fill="#4a3b2f">car_rental → 租车</text><rect x="304" y="154" width="320" height="26" rx="4" fill="#fffaf3" stroke="#e8ded2"/><text x="314" y="172" font-size="14" fill="#4a3b2f">default_agent → 谁都不管的哪部分</text><text x="304" y="204" font-size="14" fill="#c0392b">④ 查不到名字就报错，别让它再解释一次</text><text x="304" y="224" font-size="14" fill="#c0392b">那等于把幻觉又喂回链路里</text><text x="304" y="256" font-size="14" fill="#8a7867">有依赖的（先定城市再订酒店）留到下一轮</text><text x="304" y="278" font-size="14" fill="#8a7867">子任务完成发事件，动态插需求不必重跑规划</text></svg>`, caption: `左列是规划的四步，右列是它唯一的交付物形态——四步走完后手里是一份能 json 解析的计划，而不是一段散文` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `p`, text: `有了规划层，同一套工具能被复用出一大片场景：一句「帮一家四口安排新加坡到墨尔本的行程」，会展开成路由、并行调用、结果汇总三条动作。反过来，没有规划层的 agent 只会把原始问题整块丢给搜索工具，拿到一段杂乱的返回就开始编。` },
  { t: `ul`, items: [
    `**多步检索再回答**：先列要查的几件事，分别查，最后合并，比一次问到底准确得多。`,
    `**带条件的分支**：计划里写明「若无直飞则改查中转」，模型才会在意外情况出现时改路线而不是硬编。`,
    `**成本可控**：子任务是计数单位，能算出这次跑了几个步骤、花了多少 token。`,
    `**可交接**：结构化计划能直接丢给别的 agent 或人工审核，不必把整段对话重放一遍。`
  ] },
  { t: `h2`, text: `演示 1 · 用数据模型把计划钉死` },
  { t: `p`, text: `先用 Pydantic 定义计划的形状，再把它交给模型。字段名和枚举值就是 agent 之间沟通的暗号，写错了下游直接解析失败，报错来得早。` },
  { t: `code`, lang: `python`, code: `from enum import Enum\nfrom typing import List\nfrom pydantic import BaseModel\n\nclass AgentEnum(str, Enum):\n    FLIGHT = "flight_booking"\n    HOTEL = "hotel_booking"\n    CAR = "car_rental"\n    ACTIVITY = "activities_booking"\n` },
  { t: `code`, lang: `python`, code: `class SubTask(BaseModel):\n    task_details: str\n    assigned_agent: AgentEnum\n\nclass TravelPlan(BaseModel):\n    main_task: str\n    subtasks: List[SubTask]` },
  { t: `h2`, text: `演示 2 · 把计划要求写进提示词` },
  { t: `p`, text: `系统提示里同时给出**输出结构的一份样例**和**可用 agent 的清单**。清单的作用是让模型只做选择题：它只能在已知 agent 里挑，挑不出来的部分会落进兜底项，而不是凭空造一个不存在的工具名。` },
  { t: `code`, lang: `python`, code: `SYSTEM = """你是规划 agent，只负责决定该跑哪些下游 agent。\n必须返回 JSON，结构如下：\n{"main_task": "规划新加坡到墨尔本的行程",\n "subtasks": [{"assigned_agent": "flight_booking",\n              "task_details": "订新加坡到墨尔本的往返机票"}]}\n可用 agent：\n- flight_booking: 航班与票价\n- hotel_booking: 酒店\n- car_rental: 租车\n- activities_booking: 当地活动\n- default_agent: 其余请求"""` },
  { t: `h2`, text: `演示 3 · 拿到计划后真的分发下去` },
  { t: `p`, text: `模型返回的是文本，先解析成对象，再按 assigned_agent 查表调用。查不到就报错，别「再让模型解释一次」——那等于把幻觉又喂回链路里。` },
  { t: `code`, lang: `python`, code: `import json\n\nraw = client.create_response(input=user_message,\n                             instructions=SYSTEM).output_text\nplan = TravelPlan(**json.loads(raw))\n\nhandlers = {"flight_booking": book_flight,\n            "hotel_booking": book_hotel,\n            "car_rental": book_car}\n` },
  { t: `code`, lang: `python`, code: `for step in plan.subtasks:\n    fn = handlers[step.assigned_agent]\n    result = fn(step.task_details)` },
  { t: `p`, text: `任务之间没依赖的可以并行发，有依赖的（比如先定城市再订酒店）留在下一轮。更进一步的做法是事件驱动：子任务完成时发一条事件，监听方决定是补一步、改计划还是直接结束，这样动态插入的需求不必重跑整个规划。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `目标只写了动词没写约束。「生成行程」和「两天一夜、预算三千、带两个孩子、不坐红眼航班」对模型是完全不同的两道题。`,
    `拆到一半让模型自己补完，结果子任务里出现从没实现过的 agent 名字。可用清单必须写死在提示里。`,
    `把散文当计划用：没有固定字段，下游每次都要重新猜结构，一改提示就全线崩。`,
    `计划一次生成就不再改。真实输入会变，缺一步「重新规划」的入口，agent 就会抱着过期的计划硬走到底。`,
    `拆得过碎，二十几个子任务每个都要一次模型调用，延迟和费用同时爆掉，而准确率没涨。`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `给「组织一场 30 人的年会」写一句带约束的总目标，再用 Pydantic 定义它的计划结构，列出至少四个子任务。`,
    `给上面那份计划补一段系统提示，包含输出样例和可用 agent 清单，然后故意提一个不属于任何 agent 的请求，看它是否落进兜底项。`,
    `挑一个你已有的两跳流程，改成「先出计划、再按 assigned_agent 分发」的写法，记录步骤数与耗时。`,
    `想清楚：哪一步的完成条件你其实判不出来？把它合并或继续拆，直到每一项都能机器判定。`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：规划的价值不在「拆得多细」，而在拆出来的每一步都有明确完成条件、并且能被程序原样读走。` }
];
