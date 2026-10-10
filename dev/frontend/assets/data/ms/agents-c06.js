window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["agents-c06"] = [
  { t: `tip`, color: `blue`, text: `本课目标：看清检索从一条固定管道变成一个工具之后，多出来的那一步"证据够不够"是怎么改变整条链路的。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `普通检索增强是一条人写死的直线：把问题转成向量、取回前几条、拼进提示、生成答案。它不会回头看——取回来的三段文字和问题不相干，它照样往下写，写得还很顺。Agentic 版本做的事只有一件：把检索按第 5 课的方式注册成工具，然后在中间插入一次评估。模型拿到结果后先判断证据够不够，不够就改写查询、换一个数据源再查一次，直到它认为可以收尾，或者次数用完。` },
  { t: `p`, text: `于是链路从一次性变成 maker-checker 的循环：初始提问 → 模型发现缺信息，挑工具 → 拿到数据后评估、精炼 → 重复 → 交出答案。之所以能重复而不空转，是因为状态在累积：试过的查询、各自的命中分数都留在上下文里，模型看得见自己上次败在哪。这也是它和"多写几条提示链"的差别——提示链的步骤是人预先规定的，这里的顺序是它根据查到的东西临时决定的。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#fffaf3"/><text x="320" y="24" font-size="17" fill="#4a3b2f" text-anchor="middle">只多插一格评估，链路就从直线变成会回头的循环</text><text x="16" y="44" font-size="14" fill="#8a7867">人写死的直线：取回来的东西不相干，它照样往下写</text><rect x="16" y="52" width="96" height="34" rx="6" fill="#f7eee2" stroke="#e8ded2"/><text x="64" y="74" font-size="14" fill="#4a3b2f" text-anchor="middle">问题</text><path d="M112 69 L130 69" stroke="#8a7867" stroke-width="2"/><polygon points="136,69 126,64 126,74" fill="#8a7867"/><rect x="136" y="52" width="96" height="34" rx="6" fill="#f7eee2" stroke="#e8ded2"/><text x="184" y="74" font-size="14" fill="#4a3b2f" text-anchor="middle">转向量</text><path d="M232 69 L250 69" stroke="#8a7867" stroke-width="2"/><polygon points="256,69 246,64 246,74" fill="#8a7867"/><rect x="256" y="52" width="96" height="34" rx="6" fill="#f7eee2" stroke="#e8ded2"/><text x="304" y="74" font-size="14" fill="#4a3b2f" text-anchor="middle">取前几条</text><path d="M352 69 L370 69" stroke="#8a7867" stroke-width="2"/><polygon points="376,69 366,64 366,74" fill="#8a7867"/><rect x="376" y="52" width="96" height="34" rx="6" fill="#f7eee2" stroke="#e8ded2"/><text x="424" y="74" font-size="14" fill="#4a3b2f" text-anchor="middle">拼进提示</text><path d="M472 69 L490 69" stroke="#8a7867" stroke-width="2"/><polygon points="496,69 486,64 486,74" fill="#8a7867"/><rect x="496" y="52" width="96" height="34" rx="6" fill="#f7eee2" stroke="#e8ded2"/><text x="544" y="74" font-size="14" fill="#4a3b2f" text-anchor="middle">生成答案</text><text x="16" y="112" font-size="14" fill="#8a7867">检索注册成工具，中间多一次可核对的评估</text><rect x="16" y="120" width="96" height="48" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="64" y="140" font-size="14" fill="#4a3b2f" text-anchor="middle">初始提问</text><text x="64" y="158" font-size="14" fill="#8a7867" text-anchor="middle">缺什么</text><path d="M112 144 L132 144" stroke="#8a7867" stroke-width="2"/><polygon points="140,144 130,139 130,149" fill="#8a7867"/><rect x="140" y="120" width="116" height="48" rx="6" fill="#fbe3c6" stroke="#e0821f"/><text x="198" y="140" font-size="14" fill="#4a3b2f" text-anchor="middle">挑一个工具查</text><text x="198" y="158" font-size="14" fill="#8a7867" text-anchor="middle">返回带分数</text><path d="M256 144 L278 144" stroke="#8a7867" stroke-width="2"/><polygon points="286,144 276,139 276,149" fill="#8a7867"/><rect x="286" y="120" width="140" height="48" rx="6" fill="#d5f0e8" stroke="#12a58a"/><text x="356" y="140" font-size="14" fill="#4a3b2f" text-anchor="middle">评估：证据够吗</text><text x="356" y="158" font-size="14" fill="#8a7867" text-anchor="middle">分数与出处可比对</text><path d="M426 144 L448 144" stroke="#12a58a" stroke-width="2"/><polygon points="456,144 446,139 446,149" fill="#12a58a"/><text x="441" y="136" font-size="14" fill="#12a58a" text-anchor="middle">够</text><rect x="456" y="120" width="128" height="48" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="520" y="140" font-size="14" fill="#4a3b2f" text-anchor="middle">交出答案</text><text x="520" y="158" font-size="14" fill="#8a7867" text-anchor="middle">逐条标出处</text><path d="M356 168 L356 194 L198 194 L198 174" stroke="#c0392b" stroke-width="2" fill="none"/><polygon points="198,168 192,178 204,178" fill="#c0392b"/><text x="278" y="212" font-size="14" fill="#c0392b" text-anchor="middle">不够：改写查询、换一个数据源再来</text><text x="16" y="244" font-size="14" fill="#4a3b2f">能重复而不空转，靠的是状态在累积：试过的查询和各自的命中分数都留在上下文里</text><text x="16" y="266" font-size="14" fill="#4a3b2f">上限 3 次是刹车——没有上限的自我纠错会越改越长、越查越贵</text><text x="16" y="288" font-size="14" fill="#8a7867">两次查不到就把试过的路一起交回给人，不然人只能从零再查一遍</text></svg>`, caption: `上面那条直线不会回头；下面那格的红色回路才是本课的全部新增，而它必须有分数、有出处、有次数上限` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `一句含糊的问题先查内部报表，查不到再改写去查公开资料，两边对上才给结论`,
    `对着结构化数据库自己写查询，语法错了看一眼报错就重写`,
    `合规、法务这类错不起的场景：反复核事实、换来源，直到答案有出处`,
    `长会话里随新信息改变策略，而不是把第一轮的理解用到底`
  ] },
  { t: `h2`, text: `演示 1 · 检索变成一个工具，而不是前置步骤` },
  { t: `code`, lang: `python`, code: `@tool(approval_mode="never_require")\ndef search_docs(query: str, top_k: int = 3) -> str:\n    hits = index.search(query, top_k)\n    return json.dumps([{"title": h.title, "score": round(h.score, 3)} for h in hits])` },
  { t: `p`, text: `关键在返回里带上分数和标题，只返回正文片段的话，模型没有任何可核对的东西，评估就退化成"我觉得行"。` },
  { t: `h2`, text: `演示 2 · 让评估这一步交出结构` },
  { t: `code`, lang: `python`, code: `check = await agent.run(\n    f"已查到的片段：{hits}\\n已试过的查询：{tried}\\n判断证据是否足以回答，输出 enough / reason / next_query。")\nd = json.loads(check.text)\nif d["enough"]:\n    answer = await agent.run(f"根据这些片段回答，逐条标出处：{hits}")` },
  { t: `p`, text: `reason 和 next_query 不是给模型看的客套，是给你写进轨迹的：日后要回答"这个数字从哪篇来"，只有这一份记录能答。` },
  { t: `h2`, text: `演示 3 · 不记下试过的查询，就会在同一个坑里转` },
  { t: `code`, lang: `python`, code: `tried = []\nfor step in range(3):\n    hits = await search_once(question, rewrite=not tried)\n    tried.append({"query": question, "best": hits[0]["score"] if hits else 0})\n    if hits and hits[0]["score"] > 0.6:\n        break\n    question = await reword(question, tried)` },
  { t: `p`, text: `把 tried 一起喂回去，改写才会避开已经失败的说法。上限 3 次是刹车：没有上限的自我纠错，会越改越长、越查越贵。` },
  { t: `h2`, text: `演示 4 · 查不到就承认，别硬答` },
  { t: `code`, lang: `python`, code: `if not hits or hits[0]["score"] < 0.3:\n    return {"answer": None, "uncertain": True,\n            "tried": tried, "ask_human": "这两个来源都没有覆盖该条款"}` },
  { t: `p`, text: `交回给人时要把试过的路一起交出去，不然人只能从零再查一遍。这种升级是能力，不是失败——它比编一段没有出处的答案值钱。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `评估步骤不给可核对的信号：模型自评几乎永远说够了`,
    `改写不设次数和长度上限：成本随轮数涨，最后查的还是同一批文档`,
    `只用向量检索：结构化数据该走查询语句，硬用相似度取回来的数本来就是错的`,
    `来源冲突时挑一个写了事，不报出处——第 4 课讲的透明在这里最要命`,
    `以为它跳得出边界：它不会自己造工具，也不会越出你给的数据源和规则`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `同一句提问分别用固定管道和带评估的循环各跑一遍，记下两边命中正确文档所需的检索次数`,
    `给评估定一个能核对的标准：分数下限、至少两个来源，写出你据此改动的返回结构`,
    `加一份"已试查询"清单，验证重复检索真的消失了`,
    `让系统在两次查不到后输出不确定并升级给人，列出你希望人一眼看到的三样信息`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：agentic 检索的全部变化，是在查和答之间塞进一次可核对的评估——有分数、有出处、有次数上限，它才叫自我纠错；没有这三样，只是多花了两次钱。` }
];
