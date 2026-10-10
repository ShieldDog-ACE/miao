window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["genai-c08"] = [
  { t: `tip`, color: `blue`, text: `本课目标：搞清聊天应用的唯一新增状态在你手里——那个消息数组，以及它每轮都被整份重发这件事。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `第 7 课那句「服务不记得你上一次请求」在聊天应用里变成全部工程问题。所谓会话，是你维护一个列表：系统消息一条，之后每轮追加用户那句和它那句，每次请求把整个列表重发。服务端无状态，所以它记得，等于你又发了一遍；它忘了，等于你那段没发或者被裁掉了。` },
  { t: `p`, text: `列表里唯一长期不变的是第一条，写它有四块内容按顺序排：这产品给谁用、能做什么不能做什么；输出长成什么形状；一两个示范问答；越界时怎么走。前三块缺一块的后果都能立刻看见，第四块缺了要等用户试出来。要量的东西也还是第 2、3 课那几项——延迟、片段成本、答准率——只是对话没有标准答案，所以准只能靠人工打分和用户的差评按钮攒出来。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#f5f6f9"/><text x="320" y="26" font-size="17" fill="#23304a" text-anchor="middle">每一轮发出去的都是整个数组</text><text x="26" y="58" font-size="14" fill="#23304a">第 1 轮发出去的内容</text><rect x="26" y="66" width="120" height="30" rx="5" fill="#dfe8ff" stroke="#5b7cfa"/><text x="86" y="86" font-size="14" fill="#23304a" text-anchor="middle">系统消息</text><rect x="152" y="66" width="110" height="30" rx="5" fill="#d5f0e8" stroke="#12a58a"/><text x="207" y="86" font-size="14" fill="#23304a" text-anchor="middle">用户 · 第 1 句</text><path d="M262 81 L292 81" stroke="#8b96ad" stroke-width="2"/><text x="330" y="86" font-size="14" fill="#6a748c">答完，助手那句 append 进列表</text><text x="26" y="128" font-size="14" fill="#23304a">第 4 轮发出去的内容</text><rect x="26" y="136" width="90" height="30" rx="5" fill="#dfe8ff" stroke="#5b7cfa"/><text x="71" y="156" font-size="14" fill="#23304a" text-anchor="middle">系统消息</text><rect x="120" y="136" width="330" height="30" rx="5" fill="#eef1f7" stroke="#8b96ad"/><text x="285" y="156" font-size="14" fill="#6a748c" text-anchor="middle">前三轮问答，原文，一条不少</text><rect x="454" y="136" width="110" height="30" rx="5" fill="#d5f0e8" stroke="#12a58a"/><text x="509" y="156" font-size="14" fill="#23304a" text-anchor="middle">用户 · 第 4 句</text><path d="M564 151 L590 151" stroke="#8b96ad" stroke-width="2"/><text x="26" y="200" font-size="14" fill="#23304a">窗口装不下之后</text><rect x="26" y="208" width="90" height="30" rx="5" fill="#fbe3c6" stroke="#e0821f"/><text x="71" y="228" font-size="14" fill="#23304a" text-anchor="middle">系统消息</text><rect x="120" y="208" width="90" height="30" rx="5" fill="#f6dcdc" stroke="#c15454"/><text x="165" y="228" font-size="14" fill="#7a3030" text-anchor="middle">最早的问答</text><rect x="214" y="208" width="350" height="30" rx="5" fill="#eef1f7" stroke="#8b96ad"/><text x="389" y="228" font-size="14" fill="#6a748c" text-anchor="middle">剩下的几轮照原样发</text><text x="26" y="262" font-size="14" fill="#7a3030">被丢出去的那些字，它这一轮读不到——不是记性差，是没发。</text><text x="26" y="284" font-size="14" fill="#6a748c">丢要成对丢，只丢一句会让上下文变成没人接的话。</text></svg>`, caption: `三行对比看的是一轮请求里到底带了哪些字` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `在第 20 轮还沿用第 1 轮定的规则和格式，因为那条系统消息每次都发`,
    `把「你刚才说的第二点展开讲讲」变成可能——前文就在同一条请求里`,
    `一个入口里挂多种人格：换系统消息就换产品，代码不动`,
    `会话可以被导出、重放、离线评测：它就是一个列表`
  ] },
  { t: `h2`, text: `演示 1 · 会话就是这段列表` },
  { t: `code`, lang: `python`, code: `history = [{"role": "system", "content": SYSTEM}]\nwhile True:\n    text = input("你：")\n    if not text:\n        break\n    history.append({"role": "user", "content": text})\n    reply = ask(history)\n    history.append({"role": "assistant", "content": reply})\n    print("它：", reply)` },
  { t: `p`, text: `两句 append 的顺序不能换：助手那句必须紧跟对应那句用户话。插错一次，模型就在一句不属于它自己的话上继续往下写，之后整场都偏。把 history 打印出来，你就看懂了这个产品的全部状态。` },
  { t: `h2`, text: `演示 2 · 系统消息写四块` },
  { t: `code`, lang: `python`, code: `SYSTEM = "\\n".join([\n    "面向三年级学生的语文练习助手，只出选择题，不做别的。",\n    "输出格式：题目一行，四个选项各一行，最后一行答案。",\n    "示例：题目：下面哪个词是量词？ A.跑 B.头 C.红 D.快 答案：B",\n    "越出语文学科时，请学生换个问题，不要作答。",\n])` },
  { t: `p`, text: `第一块管范围和身份，第二块管形状，第三块是第 5 课说的例子——它比文字说明更决定输出长什么样，第四块是第 4 课那层边界。四块合在一条消息里，每轮都重发，所以它的代价是常驻成本：写得越长，每一轮都贵一点。` },
  { t: `h2`, text: `演示 3 · 长了要裁` },
  { t: `code`, lang: `python`, code: `def fit(history, budget=6000):\n    while sum(count_tokens(m["content"]) for m in history) > budget and len(history) > 4:\n        history.pop(1)\n        history.pop(1)          # 成对丢掉最早的一问一答\n    return history` },
  { t: `p`, text: `从下标 1 开始删，就是保住系统消息先丢最早的对话——用户会觉得「它不记得上周说过的」，那是这段代码的效果，不是模型的。更讲究的做法是把丢掉的几轮压成一段摘要放回列表头部，摘要本身又是一次请求，所以它也得计费。` },
  { t: `h2`, text: `演示 4 · 给用户两个按钮` },
  { t: `code`, lang: `python`, code: `if cmd == "clarify":\n    history.append({"role": "user",\n        "content": "把上一条回答拆成三个要点，每条注明你的依据"})\n    reply = ask(fit(history))\nelif cmd == "reset":\n    history = [{"role": "system", "content": SYSTEM}]` },
  { t: `p`, text: `澄清不是叫用户换个说法重问，而是把这句重问写成产品动作发进去——它要的正是第 6 课那种「把中间产出放回输入」。清空则是把列表打回一条。两个按钮挂在那里，也是在告诉用户：这东西没有跨会话的记忆。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `以为服务端在替你存会话：换一台实例、隔一小时，那段列表就是你仅剩的记忆`,
    `用户输入直接接进消息却不做边界：越界的句子会被当成上下文的一部分`,
    `只在第一轮看效果：裁不裁、裁哪对，要到二十轮之后才暴露`,
    `助手那句忘了 append：它下一轮看不见自己刚说过什么，会自相矛盾`,
    `领域黑话听不懂就猛塞术语解释：更该考虑第 3 课那一档换型号或微调`,
    `不设失败路径：超时、内容被过滤、额度用光这三种情况都要有话说`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `跑满 25 轮，把 history 的长度和每次请求的片段数逐轮画出来，找出成本涨得最快的部分`,
    `删掉系统消息四块里的示例那一块，跑十轮，记下格式坏在第几轮`,
    `实现 fit 之后再加一个开关：只保留最近 6 轮，其余压成一条摘要放在头部`,
    `故意让助手那句不 append，观察它下一轮怎么理解自己没说过的话`,
    `给这个应用写一句给终端用户看的说明：它是什么、可能错在哪、怎么清空`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：聊天应用的智能不在模型里，在你选择每轮重发哪些字——那段列表就是你的产品。` }
];
