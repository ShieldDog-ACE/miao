window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["agents-c11"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把 agent 从「演示里能用」变成线上可查——一次运行拆成条目，指标落成数字，离线与在线评测互相喂数据，顺便把费用压下来。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `线上跑的是个不确定进程：同一句提问，模型调用次数、工具顺序、返回措辞都可能变。出事时无从下手，是因为没留下结构。观测层补的就是这块：一次完整任务记成一条 trace，从收到提问到给出答案；里面每一步——模型调用、检索、工具执行、判定——各记一个 span，父子关系拼成一棵树。看树就知道时间花在哪、哪一步空返回。` },
  { t: `p`, text: `指标不是装饰件。延迟要看单步而不只是总时长；费用按 token 与调用次数计，一次运行调五遍模型换回来的提升值不值，得算；失败率要能区分接口错误和工具跑歪；用户反馈分两路，显式打分和隐式行为（同一句改写重问、连点重试、会话秒退）；准确率则要先定义什么叫成功——是结论对、条目齐，还是流程走完。` },
  { t: `p`, text: `评测分两头。离线：拿有标准答案的题集在受控环境跑，可重复、能挡住回归，通常进流水线。在线：在真实流量上盯成功率和满意度，好处是它能暴露你压根没想到的提问，以及模型随时间的漂移。两头是接起来的——线上抓到新的失败样本，补进离线题集，改完 agent 再上线，循环往复。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320" font-family="sans-serif"><rect width="640" height="320" fill="#fffaf3"/><text x="320" y="22" font-size="17" fill="#4a3b2f" text-anchor="middle">左边一棵 span 树指出时间花在哪，右边把离线与在线接成一个环</text><text x="16" y="46" font-size="14" fill="#8a7867">一次完整任务 = 一条 trace</text><rect x="16" y="54" width="232" height="28" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="132" y="73" font-size="14" fill="#4a3b2f" text-anchor="middle">agent_run · 5.1s</text><path d="M36 82 L36 202" stroke="#e8ded2" stroke-width="2" fill="none"/><path d="M36 100 L52 100 M36 132 L52 132 M36 164 L52 164 M36 196 L52 196" stroke="#e8ded2" stroke-width="2" fill="none"/><rect x="52" y="87" width="228" height="26" rx="4" fill="#fffaf3" stroke="#e8ded2"/><text x="60" y="105" font-size="14" fill="#4a3b2f">model_call · 1.3s</text><rect x="52" y="119" width="228" height="26" rx="4" fill="#faded9" stroke="#c0392b"/><text x="60" y="137" font-size="14" fill="#7f1d1d">tool.search_flights · 4.2s</text><rect x="52" y="151" width="228" height="26" rx="4" fill="#fffaf3" stroke="#e8ded2"/><text x="60" y="169" font-size="14" fill="#4a3b2f">review_step · 0.2s 手动加</text><rect x="52" y="183" width="228" height="26" rx="4" fill="#fbe3c6" stroke="#e0821f"/><text x="60" y="201" font-size="14" fill="#4a3b2f">approval · 没埋点就空白</text><text x="16" y="234" font-size="14" fill="#4a3b2f">父子拼成树，最慢的一步一眼看到</text><text x="16" y="256" font-size="14" fill="#c0392b">业务判定、人工确认得自己加 span</text><text x="16" y="276" font-size="14" fill="#c0392b">否则树上出现空白段，读图的人只能猜</text><text x="16" y="300" font-size="14" fill="#8a7867">属性写在 span 上：user_id · budget</text><rect x="330" y="54" width="294" height="32" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="477" y="75" font-size="14" fill="#4a3b2f" text-anchor="middle">① 离线：固定题集带期望结论</text><path d="M477 86 L477 94" stroke="#8a7867" stroke-width="2"/><polygon points="477,102 472,92 482,92" fill="#8a7867"/><rect x="330" y="102" width="294" height="32" rx="6" fill="#fbe3c6" stroke="#e0821f"/><text x="477" y="123" font-size="14" fill="#4a3b2f" text-anchor="middle">② 闸门：不过阈值不发版</text><path d="M477 134 L477 142" stroke="#8a7867" stroke-width="2"/><polygon points="477,150 472,140 482,140" fill="#8a7867"/><rect x="330" y="150" width="294" height="32" rx="6" fill="#d5f0e8" stroke="#12a58a"/><text x="477" y="171" font-size="14" fill="#1d4230" text-anchor="middle">③ 在线：真实流量与隐式反馈</text><path d="M330 166 L312 166 L312 70 L320 70" stroke="#8a7867" stroke-width="2" fill="none"/><polygon points="330,70 320,65 320,75" fill="#8a7867"/><text x="330" y="206" font-size="14" fill="#8a7867">这条回边就是循环：线上抓到的新失败</text><text x="330" y="226" font-size="14" fill="#8a7867">样本，补进离线题集，改完再上线</text><rect x="330" y="246" width="294" height="32" rx="6" fill="#fffaf3" stroke="#e8ded2"/><text x="477" y="267" font-size="14" fill="#4a3b2f" text-anchor="middle">省钱：归一化查缓存，再按复杂度选模型</text><text x="330" y="304" font-size="14" fill="#4a3b2f">延迟看单步，费用按 token 与调用次数计</text></svg>`, caption: `左边那棵树回答「这次为什么慢」，右边那个环回答「改得对不对」——两者的接口是 span 上的属性和一份能对账的题集` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `一句「这次为什么慢」能回答：指着树里那个 4.2 秒的检索 span`,
    `改动上线前给出分数差：同一份固定题集，改前改后各跑一遍`,
    `按标签聚合：哪个用户、哪个模型版本、哪类提问最容易失败`,
    `被追问合规时，拿得出某一次运行的完整动作序列`,
    `简单题走小模型、常见题命中缓存，账单压在可接受的量级`
  ] },
  { t: `h2`, text: `演示 1 · 一次运行拆成一棵树` },
  { t: `code`, lang: `python`, code: `from agent_framework.observability import get_tracer\n\ntracer = get_tracer()\nwith tracer.start_as_current_span("agent_run"):\n    with tracer.start_as_current_span("model_call"):\n        draft = client.chat(messages)\n    with tracer.start_as_current_span("tool.search_flights"):\n        hits = search(prefs)      # 入参与耗时由框架自动带上` },
  { t: `p`, text: `框架自带插桩时这几层是白拿的，但它只认得模型和工具。业务判定、人工确认这类自己写的分支，得手动加 span，否则树上出现空白段，读图的人只能猜。` },
  { t: `h2`, text: `演示 2 · 光有 span 不够，要能对账` },
  { t: `code`, lang: `python`, code: `span = langfuse.start_span(name="review_step")\nspan.update(input=prompt, attributes={\n    "user_id": uid,\n    "session_id": sid,\n    "model_version": MODEL,\n    "budget": prefs["budget"],\n})\nspan.end()` },
  { t: `p`, text: `自定义属性的价值全在筛：过几天有人问「预算低于 5000 的单为什么都超时」，能按属性一句话筛出来。往里塞 prompt 全文要做截断和敏感字段脱敏，不然观测平台的存储账单比模型还贵。` },
  { t: `h2`, text: `演示 3 · 离线评测：先定义成功` },
  { t: `code`, lang: `python`, code: `rows = load_dataset("expense_claim_100.jsonl")   # 每条带期望结论\nok = 0\nfor r in rows:\n    got = run_agent(r["query"])\n    ok += int(got["verdict"] == r["expected"])\n    record(r["id"], got, tokens=got.usage.total_tokens)\nprint("acc", ok / len(rows))` },
  { t: `p`, text: `有标准答案，数字才重复得起来，也才进得去流水线。题集要两份混着用：小份用于每次改动后立刻跑，大份用于版本上线前。半年不动的题集只会给你一个好看的假分数，因为线上问法早就换了。` },
  { t: `h2`, text: `演示 4 · 在线侧的费用与真实反馈` },
  { t: `code`, lang: `python`, code: `def handle(query):\n    key = hash(normalize(query))\n    if key in cache:\n        return cache[key]\n    model = "small" if not is_complex(query) else "large"\n    out = run(query, model=model)\n    cache[key] = out\n    return out` },
  { t: `p`, text: `意图分类、参数抽取交给小模型，复杂推理才上大模型；改写重问先归一化再查缓存，省的是整条链路。另外把「同会话内重复提问」「点了重试」这些隐式信号单独埋点，它们比打分常见得多，是最早的告警。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `只存最终答案不存中间步骤：坏了只能猜是哪一次调用`,
    `span 一律起名 call 或 step：树读不出层次，等于没埋点`,
    `终止条件写不清，agent 在两个工具间反复横跳，账单跟着翻`,
    `离线分数当唯一依据：实验室答得好，真实提问分布完全不同`,
    `只有点赞点踩，没有隐式行为：大部分不满是沉默的`,
    `上游模型提供商挂断没有备用通道：整条链路 502 给用户看`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `给第 5 课那个查时间的 agent 接上 OpenTelemetry，导出一棵 span 树，指出最慢的一步能不能并行`,
    `造一份 30 条带期望结论的题集，跑离线评测，同时记录每条的 token 花费`,
    `埋三类隐式反馈：改写重问、点重试、会话秒退，回看哪一类和失败最相关`,
    `加一层按复杂度路由的模型选择加一份缓存，对比改动前后的平均单次费用`,
    `故意让一个工具抛异常，验证备用通道真的接管，并能在 trace 里指出接管点`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：可观测不是多加日志，而是把一次运行拆成能对账的条目——先有树和标签，评测才有分母，省钱才有依据。` }
];
