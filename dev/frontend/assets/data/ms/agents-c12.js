window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["agents-c12"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把 agent 之间那层接口写清楚——能力怎么说、任务怎么传、状态怎么推，A2A、MCP、AGNTCY 各管哪一段。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `三个协议管的不是同一件事，混为一谈是最常见的理解偏差。MCP 管模型和工具、资料之间：一边是 agent，一边是被调用的东西，第 5 课那条调用链走的就是它。A2A 管 agent 和 agent 之间：一方把任务发出去，另一方接单、推进、回报状态。AGNTCY 管「去哪找到这个 agent、能不能信」这一层。类比 Web 更直观：HTML 描述内容、HTTP 传输请求、SSL 负责身份，协议是一层压一层，不是三选一。` },
  { t: `p`, text: `A2A 里的核心单位是 task，不是消息。task 带状态机：提交、执行中、需要补充输入、完成、失败。客户端要么轮询状态，要么订阅增量——选哪种，取决于服务端卡片里的能力开关 streaming、pushNotifications、stateTransitionHistory。你没声明流式，客户端却按流式等，结果就是挂在那儿收不到东西。` },
  { t: `p`, text: `第二个单位是 artifact：任务真正产出的东西，文本、文件、结构化结果都算。它和聊天消息分开，因为「说了一半的话」和「一件成品」在编排里用法完全不同。失败也走 task：状态转 failed 时带上原因和可重试标记，客户端才有得选——重发、换一个 agent、还是退回给人。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320" font-family="sans-serif"><rect width="640" height="320" fill="#fffaf3"/><text x="320" y="22" font-size="17" fill="#4a3b2f" text-anchor="middle">A2A 递的是 task：状态要能在缺一格信息时停住，等到答复再往下走</text><rect x="20" y="36" width="180" height="28" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="110" y="55" font-size="14" fill="#4a3b2f" text-anchor="middle">调用方 agent</text><rect x="440" y="36" width="180" height="28" rx="6" fill="#fbe3c6" stroke="#e0821f"/><text x="530" y="55" font-size="14" fill="#4a3b2f" text-anchor="middle">远端 agent</text><line x1="110" y1="66" x2="110" y2="240" stroke="#e8ded2" stroke-width="2" stroke-dasharray="5 4"/><line x1="530" y1="66" x2="530" y2="240" stroke="#e8ded2" stroke-width="2" stroke-dasharray="5 4"/><text x="320" y="86" font-size="14" fill="#4a3b2f" text-anchor="middle">① 读卡片：能力开关与技能清单</text><path d="M110 94 L518 94" stroke="#8a7867" stroke-width="2" fill="none"/><polygon points="530,94 518,89 518,99" fill="#8a7867"/><text x="320" y="120" font-size="14" fill="#4a3b2f" text-anchor="middle">② submit(task) 把活派出去</text><path d="M110 128 L518 128" stroke="#8a7867" stroke-width="2" fill="none"/><polygon points="530,128 518,123 518,133" fill="#8a7867"/><text x="320" y="154" font-size="14" fill="#c0392b" text-anchor="middle">③ working，或停在 input-required</text><path d="M530 162 L122 162" stroke="#8a7867" stroke-width="2" fill="none"/><polygon points="110,162 122,157 122,167" fill="#8a7867"/><text x="320" y="188" font-size="14" fill="#4a3b2f" text-anchor="middle">④ reply：补上它要的那一项</text><path d="M110 196 L518 196" stroke="#8a7867" stroke-width="2" fill="none"/><polygon points="530,196 518,191 518,201" fill="#8a7867"/><text x="320" y="222" font-size="14" fill="#1d4230" text-anchor="middle">⑤ completed：连同 artifact 交成品</text><path d="M530 230 L122 230" stroke="#8a7867" stroke-width="2" fill="none"/><polygon points="110,230 122,225 122,235" fill="#8a7867"/><rect x="20" y="248" width="600" height="68" rx="6" fill="#fffaf3" stroke="#e8ded2"/><text x="34" y="268" font-size="14" fill="#4a3b2f">状态机：submitted → working → input-required → working → completed / failed</text><text x="34" y="290" font-size="14" fill="#c0392b">failed 要带 reason 与 retryable，客户端才有三条出口：重发、换 agent、退回给人</text><text x="34" y="310" font-size="14" fill="#8a7867">一层压一层：MCP 管工具与资料，A2A 管 agent 之间，AGNTCY 管去哪找到、能不能信</text></svg>`, caption: `五条横向箭头是两边真正来回递的东西，第三条那一格 input-required 最容易省——省掉它，信息不全的任务只能硬猜或整单重来` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `两个各自独立部署的 agent 用 HTTP 加 JSON 说话，不共享内存、不共享语言运行时`,
    `编排方只读卡片就能挑人：谁的技能里有 translation 就派翻译`,
    `长任务跑到一半能反问「要发票还是收据」，拿到答复再继续`,
    `上一个 agent 的成品直接作为下一个的输入，中间不靠人复制粘贴`,
    `跨组织的 agent 之间也能有身份和权限的说法，不是拿到地址就能调`
  ] },
  { t: `h2`, text: `演示 1 · 先声明能力，否则没人来找你` },
  { t: `code`, lang: `python`, code: `def capabilities():\n    return {"streaming": True,\n            "pushNotifications": False,\n            "stateTransitionHistory": True}\n\ndef skills():\n    return [{"id": "translate", "name": "Translate",\n             "description": "Translate text between languages",\n             "tags": ["translate"],\n             "examples": ["Translate this menu into English"]}]` },
  { t: `p`, text: `description 和 examples 不是给人看的客套：决定派不派活给你的，是编排那一侧的模型。写成「处理文本」等于把自己藏起来，卡片再全也没用。` },
  { t: `h2`, text: `演示 2 · task 的推进与那一格反问` },
  { t: `code`, lang: `python`, code: `task = server.submit("把这份菜单译成英文", context=conv_id)\nwhile task.status not in ("completed", "failed"):\n    if task.status == "input-required":\n        task = server.reply(task.id, ask_user(task.message))\n    else:\n        task = server.poll(task.id)          # 或者订阅增量\nprint(task.artifacts, task.history)` },
  { t: `p`, text: `input-required 是跨 agent 最容易省掉的一格。没有它，遇到信息不全的任务只有两条烂路：硬猜，或者整单失败重头来。状态历史留着，出问题时能看清是在哪一次转换之后开始跑偏的。` },
  { t: `h2`, text: `演示 3 · 读别人的卡片` },
  { t: `code`, lang: `python`, code: `card = json.loads(http_get(BASE + "/.well-known/agent-card.json"))\nname = card["name"]\nskills = [s["name"].lower() for s in card["skills"]]\ntools = [t["name"].lower() for t in card.get("tools", [])]\nprint(name, skills, tools)` },
  { t: `p`, text: `路径是约定死的，卡片取不到，调用方连你是谁都不知道。securitySchemes 和传输方案是配套的：写了 HTTPS 却没说凭证怎么带，等于只挂了门牌没开门。` },
  { t: `h2`, text: `演示 4 · 失败要带话，身份要先给` },
  { t: `code`, lang: `python`, code: `# 服务端：内部异常收进 task，不要让连接干挂着\ntask.fail(reason="upstream menu API returned 502", retryable=True)\n\n# 客户端：三条出口\nif task.status == "failed":\n    step = retry(task) if task.retryable else escalate(task)` },
  { t: `p`, text: `原因和可重试标记缺一个，客户端的策略就只剩盲试。真实链路里失败大多不是本地代码坏了，而是上游接口挂了、凭证过期、或者对端换版本把技能名改了。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `卡片里技能描述写空话，编排模型选不到你`,
    `声明了流式却没实现，调用方一直等不到分片`,
    `把成品当聊天文本发出去，下游没法结构化接`,
    `改了 /.well-known 路径或卡片字段名，发现环节当场失效`,
    `A2A 和 MCP 用反：给一个工具发 agent 卡片，或让两个 agent 互相当函数调`,
    `没有沙箱和身份就上线，agent 拿到本不该有的权限`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `给自己的 agent 出一份卡片，至少含两个技能，再让另一个 agent 只靠卡片文本决定派谁`,
    `实现 input-required：任务中途向人要一项补充信息，拿到后跑完并给出成品`,
    `把流式开关各跑一次，记录调用方拿到第一个字符的时间差`,
    `让两个 agent 协作，一个查资料一个写结论，前者的 artifact 原样作为后者的输入`,
    `人为制造一次上游失败，验证原因能沿 task 一路传到用户面前`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：agent 协作不靠默契靠合约——卡片说清你能做什么，task 说到现在走到哪，artifact 说成品长什么样，缺一样，链路就断在那一处。` }
];
