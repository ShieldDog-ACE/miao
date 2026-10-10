window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["agents-c04"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把三条设计原则翻译成能在代码里检查的东西——轨迹、可删的记忆、每圈都被读到的开关。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `这套原则把 agent 拆成三个坐标：它在什么空间里活动、它怎么随时间行事、它的内核必须满足什么。空间决定它能碰哪些数据，也就决定了它不该碰哪些。时间分三段——过去，历史能不能被回放；现在，它是只在被推到时才说话，还是自己判断该不该开口；将来，它的指令和偏好能不能被改。内核只剩一句话：不确定是常态，但可被关闭、可被看见是底线。` },
  { t: `p`, text: `为什么这些要写成设计原则，而不是模型能力要求？因为 agent 出事的方式很少是"算错了"，多数是它做了一件用户不知道会发生的事，或者用户想拦的时候拦不住。前者要靠轨迹，后者要靠开关和删除入口——这两样模型自己给不出来，只能在设计时留出来。上一课框架把循环接管走了，正好意味着这些出口要你在它外面自己接。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#fffaf3"/><text x="320" y="24" font-size="17" fill="#4a3b2f" text-anchor="middle">左边那一圈每转一次，右边三样东西各被碰到一次</text><rect x="16" y="48" width="150" height="34" rx="6" fill="#faded9" stroke="#c0392b"/><text x="91" y="70" font-size="14" fill="#4a3b2f" text-anchor="middle">① 读一次开关</text><path d="M91 82 L91 96" stroke="#8a7867" stroke-width="2"/><polygon points="91,102 86,92 96,92" fill="#8a7867"/><rect x="16" y="102" width="150" height="34" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="91" y="124" font-size="14" fill="#4a3b2f" text-anchor="middle">② 跑一轮模型</text><path d="M91 136 L91 150" stroke="#8a7867" stroke-width="2"/><polygon points="91,156 86,146 96,146" fill="#8a7867"/><rect x="16" y="156" width="150" height="34" rx="6" fill="#fbe3c6" stroke="#e0821f"/><text x="91" y="178" font-size="14" fill="#4a3b2f" text-anchor="middle">③ 执行工具</text><path d="M91 190 L91 204" stroke="#8a7867" stroke-width="2"/><polygon points="91,210 86,200 96,200" fill="#8a7867"/><rect x="16" y="210" width="150" height="34" rx="6" fill="#d5f0e8" stroke="#12a58a"/><text x="91" y="232" font-size="14" fill="#4a3b2f" text-anchor="middle">④ 写一行轨迹</text><path d="M166 227 L196 227 L196 65 L176 65" stroke="#c0392b" stroke-width="2" fill="none"/><polygon points="166,65 176,60 176,70" fill="#c0392b"/><text x="200" y="248" font-size="14" fill="#c0392b">每圈回到 ①</text><rect x="214" y="44" width="410" height="70" rx="6" fill="#f7eee2" stroke="#e8ded2"/><text x="228" y="66" font-size="15" fill="#4a3b2f">透明 = 一条能回放的时间线</text><text x="228" y="86" font-size="14" fill="#8a7867">每圈记一行：第几圈、说了什么、调了哪个工具</text><text x="228" y="106" font-size="14" fill="#8a7867">界面就渲染这一份，另建一份历史迟早对不上</text><rect x="214" y="122" width="410" height="70" rx="6" fill="#f7eee2" stroke="#e8ded2"/><text x="228" y="144" font-size="15" fill="#4a3b2f">可控 = 记忆按条目存，开关每圈都被读到</text><text x="228" y="164" font-size="14" fill="#8a7867">带标识、带来源，才有「单独删掉那一条」的对象</text><text x="228" y="184" font-size="14" fill="#c0392b">写在循环条件里，不是只在入口挡一次</text><rect x="214" y="200" width="410" height="70" rx="6" fill="#f7eee2" stroke="#e8ded2"/><text x="228" y="222" font-size="15" fill="#4a3b2f">一致 = 一套指令、一条代码路径</text><text x="228" y="242" font-size="14" fill="#8a7867">手机和桌面分两条路径，用户只会以为它变笨了</text><text x="228" y="262" font-size="14" fill="#8a7867">不许它静默改写自己的指令，否则说不清从哪圈变坏</text></svg>`, caption: `红框和红线是本课最硬的一条：开关必须被每一圈读到，不然点了关闭程序还在调工具` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `用户问"你刚才干了什么"，能逐轮列出它调了哪个工具、参数是什么，而不是重新编一段`,
    `用户说"忘掉我住几楼"，那一条真的不再被拼回上下文`,
    `航班价格变化时它主动提醒一次，同一天不重复提醒第二次`,
    `用户在任意一端看到的行为、图标、说法是同一套，不会因为换了设备就像换了个助手`
  ] },
  { t: `h2`, text: `演示 1 · 透明落到代码里是一条能回放的时间线` },
  { t: `code`, lang: `python`, code: `import json, time\n\ndef log_turn(n, reply, path="trace.jsonl"):\n    row = {"at": time.time(), "turn": n, "text": reply.text,\n           "tools": [c.name for c in reply.tool_calls]}\n    with open(path, "a", encoding="utf-8") as f:\n        f.write(json.dumps(row, ensure_ascii=False) + "\\n")` },
  { t: `p`, text: `界面直接把这份文件渲染出来就行，别另建一份"历史"。两份数据迟早对不上，而对不上的那次就是用户不再相信你的那次。` },
  { t: `h2`, text: `演示 2 · 可控的前提是记忆按条目存` },
  { t: `code`, lang: `python`, code: `memory = {}\n\ndef remember(key, text, source):\n    memory[key] = {"text": text, "source": source, "at": time.time()}\n\ndef forget(key):\n    memory.pop(key, None)` },
  { t: `p`, text: `如果长期记忆是一整块检索库加一段自由文本，用户点"删除"时你根本没有可删的对象，控制条就只是装饰。带 key、带来源、能单独删，是可控性的数据结构前提。` },
  { t: `h2`, text: `演示 3 · 提醒比通知难，难在阈值和冷却` },
  { t: `code`, lang: `python`, code: `COOLDOWN = 3600\nlast = {}\n\ndef should_nudge(event, state):\n    if not state["agent_on"] or event["score"] < 0.7:\n        return False\n    if time.time() - last.get(event["kind"], 0) < COOLDOWN:\n        return False\n    last[event["kind"]] = time.time()\n    return True` },
  { t: `p`, text: `通知是"发生了就推"，提醒要多两个判断：这件事跟眼前这个人有关吗，刚才是否已经说过。一个靠上下文分数，一个靠冷却表。两个都不写，agent 只退化成一个更吵的通知。` },
  { t: `h2`, text: `演示 4 · 开关必须被每一圈读到` },
  { t: `code`, lang: `python`, code: `while turn < MAX_TURNS and read_flag("agent_on"):\n    reply = client.run(agent, thread)\n    if not reply.tool_calls:\n        break\n    run_tools(reply.tool_calls, actor=user_id)\n    turn += 1` },
  { t: `p`, text: `开关写在循环条件里，不能只挡入口：一次 run 会转好几圈，只判断一次的话，用户点了关闭，程序还在继续调工具。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `把透明写成一句免责声明：看不到它做过什么，署名写十遍也没用`,
    `只给"清空全部"不给单条删除：用户想收回一句话，只能连同有用的一起扔`,
    `主动提醒不设冷却和阈值：连着推三条，第二天这个 agent 就被关掉`,
    `同一套指令在手机和桌面走两条代码路径：用户以为它变笨了，其实是你不一致`,
    `允许 agent 静默改写自己的 instructions：下次出问题，没人说得清是从哪一轮开始变的`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `给上一课那个 agent 补一条可回放的时间线，界面上能列出每一轮用了哪个工具`,
    `把一条长期记忆设计成可单独删除的条目，写出删除后上下文里少了哪几行`,
    `为"机票降价提醒"定一个阈值和冷却时长，并说明误报和漏报各换来了什么`,
    `假设用户在第 2 圈点了关闭：指出你的代码在第几行停下，以及已经在跑的那次工具调用怎么收场`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：透明、可控、一致不是文案要求，是三处具体代码——一份可回放的轨迹、一个按条目存也能按条目删的记忆、一个被每一圈都读到的开关。` }
];
