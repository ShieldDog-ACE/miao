window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["agents-c14"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把记忆拆成两条链路——本轮怎么把信息带进来，跨轮怎么学到东西；短期靠会话状态，长期靠提取入库再回灌。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `没有记忆的程序是无状态的：每轮从零开始。「那家酒店退掉」它答不出，因为「那家」是上一轮才出现过的。框架里短期记忆通常就是一个会话状态对象——同一个会话反复用它，上下文就一直在；会话结束或进程重启，它不落盘。要让事实和偏好活过这次运行，得写进数据库、向量索引或者图存储。` },
  { t: `p`, text: `记忆也不是只存不丢。第 13 课那句「上下文是预算分配」在这里照样成立：全存等于全不相关，检索回来的东西照样能把窗口挤爆。所以一条完整链路是六步：生成、存储、检索、并入、更新、遗忘。容易漏的是后两步——偏好变了要改写，说错了要能删掉。` },
  { t: `p`, text: `分型不是为了背名词：工作记忆抓当前任务里的关键要素，情景记忆记「这一手失败过」，实体记忆从对话里抽出人、地点、店名，persona 记它自己的角色设定，结构化检索则把一封邮件里的到达地、日期、承运人拆成字段。分型的实际意义是检索时用哪种问法。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320" font-family="sans-serif"><rect width="640" height="320" fill="#fffaf3"/><text x="320" y="22" font-size="17" fill="#4a3b2f" text-anchor="middle">六步里最容易漏的是后两步：偏好变了要改写，说错了要能删掉</text><text x="40" y="44" font-size="14" fill="#8a7867">写入这一路（一轮结束之后）</text><rect x="40" y="52" width="168" height="44" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="124" y="70" font-size="14" fill="#4a3b2f" text-anchor="middle">① 生成 · 抽取</text><text x="124" y="90" font-size="14" fill="#8a7867" text-anchor="middle">抽候选，不存整段</text><path d="M208 74 L234 74" stroke="#8a7867" stroke-width="2" fill="none"/><polygon points="244,74 234,69 234,79" fill="#8a7867"/><rect x="244" y="52" width="168" height="44" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="328" y="70" font-size="14" fill="#4a3b2f" text-anchor="middle">② 与已有条目比对</text><text x="328" y="90" font-size="14" fill="#8a7867" text-anchor="middle">再判增、改、删</text><path d="M412 74 L438 74" stroke="#8a7867" stroke-width="2" fill="none"/><polygon points="448,74 438,69 438,79" fill="#8a7867"/><rect x="448" y="52" width="168" height="44" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="532" y="70" font-size="14" fill="#4a3b2f" text-anchor="middle">③ 写进库</text><text x="532" y="90" font-size="14" fill="#8a7867" text-anchor="middle">带 scope 隔开用户</text><path d="M532 96 L532 178" stroke="#8a7867" stroke-width="2" fill="none"/><polygon points="532,190 527,180 537,180" fill="#8a7867"/><rect x="448" y="190" width="168" height="44" rx="6" fill="#d5f0e8" stroke="#12a58a"/><text x="532" y="208" font-size="14" fill="#1d4230" text-anchor="middle">④ 检索</text><text x="532" y="228" font-size="14" fill="#8a7867" text-anchor="middle">带 scope 过滤加门槛</text><path d="M448 212 L422 212" stroke="#8a7867" stroke-width="2" fill="none"/><polygon points="412,212 422,207 422,217" fill="#8a7867"/><rect x="244" y="190" width="168" height="44" rx="6" fill="#d5f0e8" stroke="#12a58a"/><text x="328" y="208" font-size="14" fill="#1d4230" text-anchor="middle">⑤ 并入上下文</text><text x="328" y="228" font-size="14" fill="#8a7867" text-anchor="middle">这一轮才用它</text><path d="M244 212 L218 212" stroke="#8a7867" stroke-width="2" fill="none"/><polygon points="208,212 218,207 218,217" fill="#8a7867"/><rect x="40" y="190" width="168" height="44" rx="6" fill="#fbe3c6" stroke="#e0821f"/><text x="124" y="208" font-size="14" fill="#4a3b2f" text-anchor="middle">⑥ 更新 · 遗忘</text><text x="124" y="228" font-size="14" fill="#8a7867" text-anchor="middle">改写旧条目，或真删</text><path d="M40 212 L20 212 L20 74 L30 74" stroke="#8a7867" stroke-width="2" fill="none"/><polygon points="40,74 30,69 30,79" fill="#8a7867"/><text x="40" y="260" font-size="14" fill="#4a3b2f">短期就是这个 session 对象，重启不落盘；上面这一圈才是长期</text><text x="40" y="286" font-size="14" fill="#c0392b">少了 ②：同一句偏好存成十几条相似条目，检索时互相挤</text><text x="40" y="310" font-size="14" fill="#c0392b">少了 ⑥：说不滑雪了，库里那条喜欢滑雪还活着且分数更高</text></svg>`, caption: `上半圈是写入，下半圈是召回，左边那条回边把两圈接起来——最容易漏的是 ② 比对和 ⑥ 改写，缺了它库越大越不准` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `新会话开口不用重说：避开高级雪道、预算中等这类旧条件它自己带上`,
    `「周二订的去巴黎那班」问得出来，因为字段被拆过、能精确匹配`,
    `同一个航班订座失败过两次，第三次直接换备选而不是再撞`,
    `新会话带进去的是 16k token 的摘要，不是 800k 的原始对话`,
    `答完顺手记下教训与偏好，下一轮自己带着来`
  ] },
  { t: `h2`, text: `演示 1 · 会话状态是短期记忆，重启就没有` },
  { t: `code`, lang: `python`, code: `agent = Agent(client=chat_client, instructions=INSTRUCTIONS)\nsession = agent.create_session()            # 会话内的上下文，不落盘\n\na = agent.run("去巴黎的机票大概多少钱？", session=session)\nb = agent.run("那里住一周呢？", session=session)      # 「那里」认得出\nc = agent.run("那里住一周呢？", session=agent.create_session())` },
  { t: `p`, text: `前两条共用一个 session，指代才成立；第三条换一个新 session，同一句话就成了孤立问题，模型只能反问「哪里」。这条链路的边界要说清楚：它不负责跨会话，别把它当持久层用。` },
  { t: `h2`, text: `演示 2 · 长期记忆的两段管线：先抽，再判` },
  { t: `code`, lang: `python`, code: `facts = extract(messages)              # 用模型从对话里抽出候选条目\nfor f in facts:\n    same = search_memory(f.text, user.id, top_k=3)\n    op = decide(f, same)               # add / update / delete / none\n    apply(store, op, f, scope="user:" + user.id)` },
  { t: `p`, text: `第二段才是要害：候选要和已有条目比对之后才决定怎么写。少了这一步，同一句偏好会存成十几条相似条目，检索时互相挤；用户补一句「其实我不滑雪了」，库里那条「我喜欢滑雪」还活着，而且分数更高。` },
  { t: `h2`, text: `演示 3 · 让旁看的知识 agent 决定写什么` },
  { t: `code`, lang: `python`, code: `def on_turn(user_msg, agent_msg):\n    if cheap_model.is_worth_saving(user_msg):        # 先过一次小模型\n        kb.add(extract(user_msg + agent_msg), scope="user:" + user.id)\n\ndef answer(query):\n    hints = kb.search(query, scope="user:" + user.id, top_k=5)\n    return primary.run(query + "\\n已知：" + render(hints))` },
  { t: `p`, text: `「值不值得记」交给便宜快速的模型先判一遍，抽取和检索才用大模型，这是把延迟压住的关键。scope 一定要带：否则上一个用户的偏好会回灌进这个用户的回答。` },
  { t: `h2`, text: `演示 4 · 检索要带过滤，遗忘要有入口` },
  { t: `code`, lang: `python`, code: `def recall(query, user_id, now):\n    hits = store.search(query, filter={"scope": user_id}, top_k=5)\n    return [h for h in hits if h.decay(now) > THRESHOLD]\n\nstore.delete(mem_id)     # 用户要求忘记 / 事实过期 / 被新偏好覆盖` },
  { t: `p`, text: `结构化那一路的价值在精确：把邮件拆成字段后，「周二那班」是查出来的；只做文本分块加相似度，它只能猜个差不多的段落。删除同样要有真接口，用户说了别记，下一轮检索里就不该再出现。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `把原始对话整段当记忆存：库越大越检索不出重点`,
    `只有写入没有改写：偏好已经变了，旧条目还在抢分数`,
    `检索不带 scope：别人的事实被当成这个用户的背景`,
    `每条消息都跑一次大模型抽取：延迟和账单先撑不住`,
    `该忘的忘不掉：一句错话反复回灌，就是第 13 课说的上下文中毒`,
    `存了不记来源与时间：答错时分不清是记错了还是查错了`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `同一 session 连问三句带指代的话，再换新 session 只问第三句，比较两次回答差在哪`,
    `实现 add / update / delete 三态判定，用「我其实不滑雪了」验证旧条目被改写而不是并存`,
    `给知识 agent 加一道便宜的前置判断，统计多少比例的消息真的触发了抽取`,
    `把上千轮对话压成一段摘要后开新会话，验证偏好类问题仍然答对，并记录压掉的细节`,
    `做一条能用的忘记路径：用户要求删除后，连续五轮检索里都不该再命中`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：记忆不是把话存下来，而是决定何时写、写成什么颗粒度、何时删——用起来靠检索，长期变好靠写入与检索这两步的循环。` }
];
