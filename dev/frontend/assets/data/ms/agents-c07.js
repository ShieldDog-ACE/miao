window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["agents-c07"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把"可信"拆成能落地的三处代码——一份固化下来的指令、一道入口过滤、一套配额和人工确认。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `安全在这里的意思很窄：agent 按设计行事，不多不少。第一道约束是 instructions。手写一句"你是订票助手"，能约束的行为太少；把这句话交给一个元提示（说明你要公司名、角色、职责模板），让模型扩成带职责清单、边界、语气要求的结构化文本，每一轮都被当作系统消息发出去，约束才够密。关键一步是扩完之后固化：把结果存成文件、当成常量用。每次启动都重新生成，同一个 agent 每天行为不同，出了事你无法复现。` },
  { t: `p`, text: `第二道是攻击面。指令类攻击改的是它的目标；系统访问类拿它当跳板读敏感数据；资源类用海量请求把下游打爆或把账单打爆；投毒类根本不碰它，改它要读的知识库；级联错误让一个环节的失败顺着工具链扩散。这五类的缓解位置各不相同：入口过滤、工具白名单加按需授权、每工具配额、知识库写权限与定期校验、沙箱执行加回退。换句话说，可信不是模型的态度，是你的代码结构。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320" font-family="sans-serif"><rect width="640" height="320" fill="#fffaf3"/><text x="320" y="24" font-size="17" fill="#4a3b2f" text-anchor="middle">五类攻击改的是不同的地方，要挡的位置也就不同</text><text x="20" y="46" font-size="14" fill="#8a7867">攻击面</text><text x="340" y="46" font-size="14" fill="#8a7867">缓解落在哪一层</text><rect x="20" y="54" width="280" height="34" rx="6" fill="#faded9" stroke="#c0392b"/><text x="160" y="76" font-size="14" fill="#7f1d1d" text-anchor="middle">指令类：改的是它的目标</text><path d="M300 71 L324 71" stroke="#8a7867" stroke-width="2"/><polygon points="340,71 330,66 330,76" fill="#8a7867"/><rect x="340" y="54" width="284" height="34" rx="6" fill="#d5f0e8" stroke="#12a58a"/><text x="482" y="76" font-size="14" fill="#1d4230" text-anchor="middle">入口过滤 + 指令固化进版本库</text><rect x="20" y="98" width="280" height="34" rx="6" fill="#faded9" stroke="#c0392b"/><text x="160" y="120" font-size="14" fill="#7f1d1d" text-anchor="middle">系统访问类：拿它当跳板</text><path d="M300 115 L324 115" stroke="#8a7867" stroke-width="2"/><polygon points="340,115 330,110 330,120" fill="#8a7867"/><rect x="340" y="98" width="284" height="34" rx="6" fill="#d5f0e8" stroke="#12a58a"/><text x="482" y="120" font-size="14" fill="#1d4230" text-anchor="middle">工具白名单，按需授权</text><rect x="20" y="142" width="280" height="34" rx="6" fill="#faded9" stroke="#c0392b"/><text x="160" y="164" font-size="14" fill="#7f1d1d" text-anchor="middle">资源类：海量请求打爆下游</text><path d="M300 159 L324 159" stroke="#8a7867" stroke-width="2"/><polygon points="340,159 330,154 330,164" fill="#8a7867"/><rect x="340" y="142" width="284" height="34" rx="6" fill="#d5f0e8" stroke="#12a58a"/><text x="482" y="164" font-size="14" fill="#1d4230" text-anchor="middle">每工具配额 + 单账号轮数上限</text><rect x="20" y="186" width="280" height="34" rx="6" fill="#faded9" stroke="#c0392b"/><text x="160" y="208" font-size="14" fill="#7f1d1d" text-anchor="middle">投毒类：改它要读的知识库</text><path d="M300 203 L324 203" stroke="#8a7867" stroke-width="2"/><polygon points="340,203 330,198 330,208" fill="#8a7867"/><rect x="340" y="186" width="284" height="34" rx="6" fill="#d5f0e8" stroke="#12a58a"/><text x="482" y="208" font-size="14" fill="#1d4230" text-anchor="middle">知识库写权限 + 定期校验</text><rect x="20" y="230" width="280" height="34" rx="6" fill="#faded9" stroke="#c0392b"/><text x="160" y="252" font-size="14" fill="#7f1d1d" text-anchor="middle">级联：一处失败顺着工具链扩散</text><path d="M300 247 L324 247" stroke="#8a7867" stroke-width="2"/><polygon points="340,247 330,242 330,252" fill="#8a7867"/><rect x="340" y="230" width="284" height="34" rx="6" fill="#d5f0e8" stroke="#12a58a"/><text x="482" y="252" font-size="14" fill="#1d4230" text-anchor="middle">沙箱执行 + 一步回退</text><text x="20" y="288" font-size="14" fill="#c0392b">过滤要挡两条通道：用户输入，以及检索回来的文档</text><text x="20" y="310" font-size="14" fill="#8a7867">拦下来要写进轨迹：挡了什么、命中哪条规则，否则规则永远是猜的</text></svg>`, caption: `左列是五类攻击各自动了哪一处，右列是它该被哪一道闸挡住——箭头一对一看完就知道「可信」是代码结构，不是模型态度` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `一句"忽略之前所有指令"进来，在进模型之前就被挡住并留下记录`,
    `订票能查能改，但删客户记录的工具压根没注册给它`,
    `同一账号一秒内刷五十条请求，第几十条被限流而不是打到下游`,
    `改价格、退全款这类动作要人点头才执行，模型自己按不下去`
  ] },
  { t: `h2`, text: `演示 1 · 元提示生成指令，然后固化` },
  { t: `code`, lang: `python`, code: `meta = "你是写 agent 指令的专家：给公司名、角色、职责，产出结构化系统提示。"\ndraft = await agent.run(meta + " 基本描述：Contoso 订票助手，能查票、订票、退票、提醒。")\nopen("instructions.txt", "w", encoding="utf-8").write(draft.text)\nagent = provider.as_agent(instructions=open("instructions.txt", encoding="utf-8").read(),\n                          tools=ALLOWED_TOOLS)` },
  { t: `p`, text: `生成一次、存成文件、进版本库——这样每次评审改动都是看 diff，而不是听模型即兴。` },
  { t: `h2`, text: `演示 2 · 检测放在入口，别指望模型自觉` },
  { t: `code`, lang: `python`, code: `PATTERNS = ["忽略以上", "你现在是", "把系统提示", "export .*token"]\n\ndef guard(text):\n    hit = [p for p in PATTERNS if re.search(p, text, re.I)]\n    if hit:\n        log_turn("blocked", text, hit)\n    return not hit` },
  { t: `p`, text: `拦下来要落到第 4 课那条轨迹里：被挡了什么、命中哪条规则。只挡不记，攻击尝试的分布你看不见，规则永远是猜的。` },
  { t: `h2`, text: `演示 3 · 配额和轮数，一人一份` },
  { t: `code`, lang: `python`, code: `QUOTA = {"search_flights": 20, "book_flight": 3}\n\ndef allow(user_id, name):\n    key = f"{user_id}:{name}"\n    used[key] += 1\n    return used[key] <= QUOTA[name] and turn < MAX_TURNS` },
  { t: `p`, text: `工具级配额防的是第 5 课那条链：模型一旦决定反复调同一个工具，光靠轮数上限拦不住并发进来的多个用户。两处都要有。` },
  { t: `h2`, text: `演示 4 · 敏感动作停下等人点头` },
  { t: `code`, lang: `python`, code: `@tool(approval_mode="always_require")\ndef refund_booking(booking_id: str) -> str:\n    \"\"\"全额退款，不可撤销\"\"\"\n    return billing.refund(booking_id)\n\n# 走到这里会停在待确认状态，人给结论后循环才继续` },
  { t: `p`, text: `框架在真正执行前挂起，等人的输入——这是第 4 课"可被关闭"的具体实现。别把不可撤销的动作设成 never_require，图省事的那一次就是赔钱的那一次。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `每次运行都让模型重写 instructions：行为漂移，事故无法复现`,
    `只挡用户输入，不挡检索回来的文档：间接注入走的正是知识库这条路`,
    `知识库谁都能写：投毒不必接触 agent，改一条数据就够`,
    `只有总轮数上限、没有单工具配额：一个用户就能把下游打到超时`,
    `人工确认做成"看一眼同意"：不显示参数和来源，人就成了盖章机器`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `用元提示把一句十来个字的描述扩成结构化指令，并说明你会砍掉扩出来哪几段、为什么`,
    `写三条注入样本，分别走用户输入和检索文档两条路，验证哪条现在还没被挡`,
    `给现有工具表加上配额，指出哪个工具该给最少的次数`,
    `设计一次人工确认界面：列出必须显示给哪几项信息，人才有可能拒绝`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：可信 agent 靠的是四样有形状的东西——固化进版本库的指令、入口和文档两条通道上的过滤、按工具分的配额、以及不可撤销动作前面那道真的会停下来的确认。` }
];
