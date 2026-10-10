window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["agents-c09"] = [
  { t: `tip`, color: `blue`, text: `本课目标：判断什么时候该把一个 agent 拆成一群，以及拆完之后消息怎么走、谁来协调、出问题时怎么看见它们在互相甩活。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `第 8 课把任务拆成了子任务，那一步其实已经在暗示：与其让一个 agent 抱着一堆工具硬撑，不如让几个各管一段的 agent 互相递活。多 agent 的本质不是「模型变多」，而是**上下文被切开了**——每个 agent 只看到自己那一份指令、工具和对话历史。原文的类比很准：单体 agent 像夫妻店旅行社，一个人从查机票管到订酒店；多 agent 像连锁分店，各人一段、流程清楚、能扩员。 单体 agent 的失效方式很固定：指令越写越长、工具越挂越多，模型开始选错工具、把 A 环节的约束带进 B 环节。拆开后每个 agent 的提示词都能保持短小，犯错的范围也被关在自己那一格里。` },
  { t: `ul`, items: [
    `**工作量大**：可并行的批量任务按块分给多个 agent，总耗时接近最慢的那一块。`,
    `**任务复杂**：自动驾驶里导航、避障、车际通信各由一个 agent 负责，互不干扰。`,
    `**专业不同**：医疗场景的诊断、治疗方案、病人监护需要的知识和权限完全不是一回事。`,
    `**需要容错**：一个 agent 失败时其余还能跑，不至于整条链一起断。`
  ] },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320" font-family="sans-serif"><rect width="640" height="320" fill="#fffaf3"/><text x="320" y="22" font-size="17" fill="#4a3b2f" text-anchor="middle">拆完之后消息怎么走：左边围着一件事讨论，右边按写死的规则交棒</text><text x="16" y="46" font-size="14" fill="#8a7867">群组聊天 · 围同一件事讨论</text><rect x="100" y="54" width="180" height="30" rx="6" fill="#fbe3c6" stroke="#e0821f"/><text x="190" y="74" font-size="14" fill="#4a3b2f" text-anchor="middle">manager 决定谁说话</text><path d="M190 84 L190 100 M61 100 L249 100 M61 100 L61 114 M155 100 L155 114 M249 100 L249 114" stroke="#8a7867" stroke-width="2" fill="none"/><polygon points="61,120 56,110 66,110" fill="#8a7867"/><polygon points="155,120 150,110 160,110" fill="#8a7867"/><polygon points="249,120 244,110 254,110" fill="#8a7867"/><rect x="16" y="120" width="90" height="30" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="61" y="140" font-size="14" fill="#4a3b2f" text-anchor="middle">planner</text><rect x="110" y="120" width="90" height="30" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="155" y="140" font-size="14" fill="#4a3b2f" text-anchor="middle">researcher</text><rect x="204" y="120" width="90" height="30" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="249" y="140" font-size="14" fill="#4a3b2f" text-anchor="middle">writer</text><rect x="16" y="166" width="278" height="30" rx="6" fill="#fffaf3" stroke="#e8ded2"/><text x="155" y="186" font-size="14" fill="#4a3b2f" text-anchor="middle">共享一份 chat.history</text><text x="16" y="216" font-size="14" fill="#c0392b">不设轮次上限，两个礼貌的模型</text><text x="16" y="236" font-size="14" fill="#c0392b">能互相客套到烧完预算</text><text x="330" y="46" font-size="14" fill="#8a7867">移交 · 每个 agent 只代表一步</text><rect x="330" y="54" width="294" height="30" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="477" y="74" font-size="14" fill="#4a3b2f" text-anchor="middle">① customer 给出一个标签</text><path d="M477 84 L477 96" stroke="#8a7867" stroke-width="2"/><polygon points="477,106 472,96 482,96" fill="#8a7867"/><rect x="330" y="106" width="294" height="30" rx="6" fill="#fbe3c6" stroke="#e0821f"/><text x="477" y="126" font-size="14" fill="#4a3b2f" text-anchor="middle">② ROUTES 查表，规则写在代码里</text><path d="M477 136 L477 150 M377 150 L577 150 M377 150 L377 164 M477 150 L477 164 M577 150 L577 164" stroke="#8a7867" stroke-width="2" fill="none"/><polygon points="377,170 372,160 382,160" fill="#8a7867"/><polygon points="477,170 472,160 482,160" fill="#8a7867"/><polygon points="577,170 572,160 582,160" fill="#8a7867"/><rect x="330" y="170" width="94" height="30" rx="6" fill="#d5f0e8" stroke="#12a58a"/><text x="377" y="190" font-size="14" fill="#1d4230" text-anchor="middle">payment</text><rect x="430" y="170" width="94" height="30" rx="6" fill="#d5f0e8" stroke="#12a58a"/><text x="477" y="190" font-size="14" fill="#1d4230" text-anchor="middle">compliance</text><rect x="530" y="170" width="94" height="30" rx="6" fill="#d5f0e8" stroke="#12a58a"/><text x="577" y="190" font-size="14" fill="#1d4230" text-anchor="middle">escalation</text><text x="377" y="218" font-size="14" fill="#8a7867" text-anchor="middle">在退货期内</text><text x="477" y="218" font-size="14" fill="#8a7867" text-anchor="middle">金额超阈值</text><text x="577" y="218" font-size="14" fill="#8a7867" text-anchor="middle">其余情况</text><rect x="16" y="246" width="608" height="34" rx="6" fill="#d5f0e8" stroke="#12a58a"/><text x="320" y="268" font-size="14" fill="#1d4230" text-anchor="middle">每一跳都记：谁做的 · 做了什么 · 几点 · 结果如何 · 耗时 · 成功率</text><text x="320" y="308" font-size="14" fill="#4a3b2f" text-anchor="middle">切点要落在权限和知识真的不同的地方，否则只是多出一堆要同步的消息</text></svg>`, caption: `同一批 agent 的两种用法：左边谁说话由 manager 临时定（所以必须设轮次上限），右边交给谁是代码里查表查出来的` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `p`, text: `一旦角色被拆出来，同一批 agent 就能跨流程复用，而且每段的权限可以单独收紧——能扣款的只给支付 agent，能查资料的只给知识 agent。` },
  { t: `ul`, items: [
    `**权限隔离**：危险动作集中在一个 agent 上，审核只需要盯它。`,
    `**并行提效**：互不依赖的检索、比价、写文案同时发出去。`,
    `**分别调优**：某一环节效果差，只改那一个 agent 的提示词和工具，其余不受牵连。`,
    `**换人不换流程**：把某个 agent 换成更便宜的模型，接口不变就能直接试。`
  ] },
  { t: `h2`, text: `演示 1 · 清点角色：退款流程` },
  { t: `p`, text: `动手拆之前先把角色数清楚。退款这条流程里有五个只服务于它的 agent，另外一批（物流、通知、审计）是别处也要用的公共 agent。分完两组，注册表就自然长这样。` },
  { t: `code`, lang: `python`, code: `SPECIALISED = ["customer", "seller", "payment",\n               "resolution", "compliance"]\nSHARED = ["shipping", "feedback", "escalation", "notification",\n          "audit", "knowledge", "security"]\n\nregistry = {}\nfor name in SPECIALISED + SHARED:\n    registry[name] = Agent(name=name,\n                           instructions=INSTRUCTIONS[name],\n                           tools=TOOLS[name])` },
  { t: `h2`, text: `演示 2 · 群组聊天模式` },
  { t: `p`, text: `适合「几个 agent 围同一件事讨论」的场景：客服协作、支持工单、方案评审。要点是**必须设轮次上限**，否则两个礼貌的模型能互相客套到烧完预算。` },
  { t: `code`, lang: `python`, code: `chat = GroupChat(agents=[planner, researcher, writer],\n                 max_rounds=8)\nmanager = GroupChatManager(chat)\n\nwhile not chat.is_solved() and chat.rounds < chat.max_rounds:\n    speaker = manager.next_speaker(chat.history)\n    reply = registry[speaker].run(chat.latest_request())\n    chat.post(speaker, reply)\n\nprint(chat.final_answer())` },
  { t: `h2`, text: `演示 3 · 移交模式` },
  { t: `p`, text: `流程自动化里更常用这种：每个 agent 只代表一步，做完按**写死的规则**把上下文递给下一个。规则放在代码里而不是让模型自由发挥，路由才可控。` },
  { t: `code`, lang: `python`, code: `ROUTES = {\n    "in_window": {"next": "payment",     "why": "在退货期内"},\n    "high_value": {"next": "compliance",  "why": "金额超阈值"},\n    "unknown":   {"next": "escalation",   "why": "其余情况"},\n}\n\ndef handoff(ctx):\n    rule = ROUTES.get(ctx.label, ROUTES["unknown"])\n    return registry[rule["next"]].run(ctx)` },
  { t: `h2`, text: `演示 4 · 让交互看得见` },
  { t: `p`, text: `多 agent 最难 debug 的地方是「不知道是哪一步坏的」。给每个 agent 套一层记录：谁做的、做了什么、几点、结果如何。再配上任务耗时和成功率，瓶颈一眼就能看出来。` },
  { t: `code`, lang: `python`, code: `import time, json\n\ndef traced(name, fn):\n    def run(task):\n        t0 = time.time()\n        out = fn(task)\n        print(json.dumps({"agent": name,\n                          "seconds": round(time.time() - t0, 2),\n                          "ok": bool(out)}))\n        return out\n    return run` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `为了拆而拆：两个 agent 来回传三次才能对齐的信息，本来一个 agent 一次就干完。`,
    `没定协议就开工：谁给谁传什么字段全靠自然语言猜，一个环节的误解会一路放大。`,
    `没有终止条件：群组聊天不设轮次上限，最后拿到一句「我们还在讨论」。`,
    `交接处丢约束：酒店 agent 拿到了日期，却没拿到「要离机场近」这条偏好。`,
    `只留最终答案：中间过程没记录，出了问题不知道该改哪一个 agent，只能整体重写提示词。`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `给客户支持流程列一份 agent 清单，按「这条流程专用」和「别处也能复用」分两组，每组写一句职责说明。`,
    `用演示 2 的写法跑一个小任务，把 max_rounds 改成 4，观察轮次耗尽时它吐出什么，并判断这算不算失败。`,
    `给演示 3 的路由表补一条需要人工确认的分支，写清触发条件、确认后回到哪个 agent。`,
    `任选两个相邻 agent，写出它们之间传递的字段清单，同时列出**不该传**的字段和理由。`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：多 agent 不是把系统做大，而是把上下文切开——切点要落在权限和知识真的不同的地方，否则只是多出一堆需要同步的消息。` }
];
