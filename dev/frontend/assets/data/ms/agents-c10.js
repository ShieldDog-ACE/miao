window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["agents-c10"] = [
  { t: `tip`, color: `blue`, text: `本课目标：在 agent 的循环里加一条「回头看」的路——把决策过程本身当成下一轮的输入，用来改策略，而不只是重出一次答案。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `元认知落到代码上是很朴素的一件事：一轮跑完，把「这次按什么条件选的、结果对不对」重新喂回上下文。第 5 课那条工具链只解决「结果回填」，这里要再补两块——一份能被读回来的决策记录，和一个决定要不要重跑的判定。` },
  { t: `p`, text: `最小骨架是三件套。经验存储：把偏好和反馈写成字段，例如 budget、disliked，而不是把聊天原文整段留着。计划器：读这些字段，把任务拆成有序步骤、排好先后、标出每步要动哪个工具。评估器：读产出和反馈，反过来改写计划器读的那几个字段。改的是策略而不是这一版文案，这才是「想自己的想」与「再问一遍」的分别。` },
  { t: `p`, text: `判定凭什么给是关键。让模型自己说「我觉得挺好」没有信息量，得把判据交给能对账的东西：预算数字、条目数量、和用户上一句反馈的逐条对照。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320" font-family="sans-serif"><rect width="640" height="320" fill="#fffaf3"/><text x="320" y="22" font-size="17" fill="#4a3b2f" text-anchor="middle">回头看一轮：判据过关就停，不过关就改字段再转一圈</text><rect x="40" y="52" width="256" height="38" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="168" y="76" font-size="14" fill="#4a3b2f" text-anchor="middle">① plan(prefs)：拆成有序步骤</text><path d="M168 90 L168 98" stroke="#8a7867" stroke-width="2"/><polygon points="168,108 163,98 173,98" fill="#8a7867"/><rect x="40" y="108" width="256" height="38" rx="6" fill="#fbe3c6" stroke="#e0821f"/><text x="168" y="132" font-size="14" fill="#4a3b2f" text-anchor="middle">② run：出这一版草稿</text><path d="M168 146 L168 154" stroke="#8a7867" stroke-width="2"/><polygon points="168,164 163,154 173,154" fill="#8a7867"/><rect x="40" y="164" width="256" height="38" rx="6" fill="#faded9" stroke="#c0392b"/><text x="168" y="188" font-size="14" fill="#7f1d1d" text-anchor="middle">③ judge：拿判据逐条核对</text><path d="M168 202 L168 210" stroke="#8a7867" stroke-width="2"/><polygon points="168,220 163,210 173,210" fill="#8a7867"/><rect x="40" y="220" width="256" height="38" rx="6" fill="#d5f0e8" stroke="#12a58a"/><text x="168" y="244" font-size="14" fill="#1d4230" text-anchor="middle">④ 把改动写回 prefs</text><path d="M40 239 L20 239 L20 71 L30 71" stroke="#8a7867" stroke-width="2" fill="none"/><polygon points="40,71 30,66 30,76" fill="#8a7867"/><text x="40" y="288" font-size="14" fill="#8a7867">回到 ①，但这一轮读的是新字段</text><text x="40" y="308" font-size="14" fill="#8a7867">改的是选法：rank_by 从热度换成清净度</text><text x="320" y="54" font-size="14" fill="#4a3b2f">三条出口，只留第一条会出事：</text><rect x="320" y="64" width="304" height="28" rx="6" fill="#d5f0e8" stroke="#12a58a"/><text x="472" y="83" font-size="14" fill="#1d4230" text-anchor="middle">① verdict.ok 判定通过</text><rect x="320" y="98" width="304" height="28" rx="6" fill="#fbe3c6" stroke="#e0821f"/><text x="472" y="117" font-size="14" fill="#4a3b2f" text-anchor="middle">② 次数用完 MAX_REFLECT</text><rect x="320" y="132" width="304" height="28" rx="6" fill="#fbe3c6" stroke="#e0821f"/><text x="472" y="151" font-size="14" fill="#4a3b2f" text-anchor="middle">③ draft == prev 没改动</text><text x="320" y="190" font-size="14" fill="#4a3b2f">判据必须是能对账的东西：</text><text x="320" y="212" font-size="14" fill="#8a7867">预算数字 · 条目数量</text><text x="320" y="232" font-size="14" fill="#8a7867">和用户上一句反馈逐条对照</text><text x="320" y="264" font-size="14" fill="#c0392b">让模型自评「我觉得挺好」</text><text x="320" y="284" font-size="14" fill="#c0392b">没有信息量，它永远说好</text><text x="320" y="310" font-size="14" fill="#4a3b2f">只改措辞不改选法，同类错误下次照犯</text></svg>`, caption: `左边那一圈每转一次都要落一次判定；右边是它能停下来的三个理由——少写后两条，同一个行程会跑到钱花两倍` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `同一句「订去巴黎的行程」，第二次会换排名依据，而不是重复第一版`,
    `被明确拒绝过的条件写进字段，后续所有请求都自动避开`,
    `产出没过关时自己重跑一轮，并且说清是哪一条判据没过`,
    `检索回来的资料不够用时，换一组查询词再查一次，而不是硬答`,
    `留下可读的决策轨迹：出问题时能回看当时是按什么排的序`
  ] },
  { t: `h2`, text: `演示 1 · 经验要写成读得回来的字段` },
  { t: `code`, lang: `python`, code: `class TravelAgent:\n    def __init__(self):\n        self.prefs = {"rank_by": "popularity"}\n        self.log = []            # 每次决策用了哪些条件\n\n    def adjust(self, feedback):\n        self.log.append({"prefs": dict(self.prefs), "feedback": feedback})\n        if "too crowded" in str(feedback):\n            self.prefs["rank_by"] = "quiet_rating"   # 改的是选法` },
  { t: `p`, text: `最后一行才是要点：反馈没有只用来删掉那个被骂的景点，而是把排名依据换掉了。log 存的是当时的字段快照，下一轮不用它，但它让「哪一次改动生效了」可回放。` },
  { t: `h2`, text: `演示 2 · 计划器输出的是数据，不是散文` },
  { t: `code`, lang: `python`, code: `def plan(prefs):\n    return [\n        {"step": "collect", "need": ["dates", "budget", "interests"]},\n        {"step": "fetch",   "tools": ["search_flights", "search_hotels"]},\n        {"step": "build",   "rank_by": prefs["rank_by"]},\n        {"step": "review",  "check": ["budget", "time_overlap"]},\n    ]` },
  { t: `p`, text: `步骤一旦是结构化条目，评估器就能指着某一条说「这一步没做」，也能只重跑 review 之前的部分。写成一段自然语言计划，模型只能整段重来，改动是否生效根本看不出来。` },
  { t: `h2`, text: `演示 3 · 反思循环必须有出口` },
  { t: `code`, lang: `python`, code: `for i in range(MAX_REFLECT):          # 常见取 2\n    draft = run(plan(agent.prefs))\n    verdict = judge(draft, agent.prefs)   # 返回 是否过关 + 理由 + 改动\n    if verdict.ok or draft == prev:\n        break\n    agent.prefs.update(verdict.changes)\n    prev = draft\nprint(verdict.reason, len(agent.log))` },
  { t: `p`, text: `出口写三条：判定通过、次数用完、产出和上一版一模一样。只留第一条最容易出事——模型每轮都能挑出「还能再优化」，于是同一个行程跑六遍，钱花了两倍，输出还是那版。` },
  { t: `h2`, text: `演示 4 · 修正式检索：先判相关性再落答案` },
  { t: `code`, lang: `python`, code: `hits = retrieve(query)\nscores = judge_relevance(query, hits)      # 每段资料给 0 或 1\nweak = [h for h, s in zip(hits, scores) if s == 0]\nif weak:\n    hits += retrieve(rewrite(query, weak))  # 换一组词重查\nanswer = generate(query, context=hits)` },
  { t: `p`, text: `它和一次性把资料塞满上下文的区别：塞是赌检索准，赌输就答得含糊；判一遍再决定是否补查，等于给检索环节加了反馈回路，代价是多一次调用。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `反思不设次数上限：越改越慢，最后一版和第一版措辞相同`,
    `判据写成「这样回答好不好」：模型永远说好，要给它能核对的具体条件`,
    `反馈只存原文不存字段：下一轮计划器读不到，等于没记`,
    `评估提示和生成提示共用同一段上下文：模型倾向为上一版辩护，越改越偏`,
    `只改这一版答案、不改选法：同一类错误下一次照犯`,
    `把决策记录 print 到控制台就丢掉：出故障时无法回放当时用了哪些条件`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `给第 5 课那个查时间的 agent 加一份 prefs 字段，让它记住「用户只要中国城市」并在后续请求中生效`,
    `写一个上限两轮的反思循环，把每轮的判定理由打印出来，指出哪一句改动的是策略而不是措辞`,
    `固定喂同一句「太挤了」连跑三次，验证第三次的排名依据真的变了，而不是少了一个条目`,
    `实现最简修正式检索：资料判定为不相关时换词重查，统计补查把答对率提高了多少`,
    `故意把 judge 的判据删空跑一次，观察模型如何「自评通过」，再把判据加回来对比`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：元认知不是让 agent 多想一遍，而是让它把「我上次按什么选的」写成下一轮读得回来的数据——读不回来，反思就只是重复提问。` }
];
