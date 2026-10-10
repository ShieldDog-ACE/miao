window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["agents-c13"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把「提示词写得好」换成「上下文喂得对」——每一轮该带哪些信息、怎么压、怎么隔开，以及四种喂坏的形态各怎么收拾。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `窗口大小是硬约束。第 5 课那次工具回填、第 6 课那次检索命中，都在往窗口里加东西，加到某个点，模型开始读不进重点。提示工程管一份静态指令，上下文工程管一叠动态信息：指令与工具描述、检索来的知识、工具跑完的返回、对话历史、用户偏好。五类来源不同、体积不同，每轮重新装配一次。` },
  { t: `p`, text: `装配可以提前规划，三步走：先定义结果长什么样，用户手上拿到什么才算做完；再列这个任务需要哪些信息、分别存在哪；最后给每条来源接一条管道，检索、工具调用或者读记忆。第 8 课那张计划表在这里有了第二列——每一步要读哪些信息。` },
  { t: `p`, text: `检查不用存 prompt 全文。只记几件小事：候选多少条、选中多少条、其余被什么规则筛掉、压缩前后估算的 token、哪些大块没进上下文。出事时能回答一句话：这一轮是喂多了、喂错了，还是该喂的没喂到。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320" font-family="sans-serif"><rect width="640" height="320" fill="#fffaf3"/><text x="320" y="22" font-size="17" fill="#4a3b2f" text-anchor="middle">一轮的窗口就这么多：先算预算再往里塞，超了按顺序压</text><text x="20" y="44" font-size="14" fill="#8a7867">五类来源，每轮重新装配一次（limit = 120_000 token）</text><rect x="20" y="54" width="118" height="32" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="79" y="75" font-size="14" fill="#4a3b2f" text-anchor="middle">指令+工具</text><rect x="146" y="54" width="150" height="32" rx="4" fill="#dfe8ff" stroke="#5b7cfa"/><text x="356" y="75" font-size="14" fill="#4a3b2f">稳定成本：动它就等于换行为</text><rect x="20" y="94" width="118" height="32" rx="6" fill="#d5f0e8" stroke="#12a58a"/><text x="79" y="115" font-size="14" fill="#4a3b2f" text-anchor="middle">用户偏好</text><rect x="146" y="94" width="60" height="32" rx="4" fill="#d5f0e8" stroke="#12a58a"/><text x="356" y="115" font-size="14" fill="#4a3b2f">体积小，每轮都带上</text><rect x="20" y="134" width="118" height="32" rx="6" fill="#fbe3c6" stroke="#e0821f"/><text x="79" y="155" font-size="14" fill="#4a3b2f" text-anchor="middle">检索知识</text><rect x="146" y="134" width="190" height="32" rx="4" fill="#fbe3c6" stroke="#e0821f"/><text x="356" y="155" font-size="14" fill="#4a3b2f">压狠了会丢掉依据，查不出出处</text><rect x="20" y="174" width="118" height="32" rx="6" fill="#ece5f8" stroke="#7c5cd6"/><text x="79" y="195" font-size="14" fill="#4a3b2f" text-anchor="middle">工具返回</text><rect x="146" y="174" width="110" height="32" rx="4" fill="#ece5f8" stroke="#7c5cd6"/><text x="356" y="195" font-size="14" fill="#4a3b2f">只留结论，原始输出留在沙箱</text><rect x="20" y="214" width="118" height="32" rx="6" fill="#faded9" stroke="#c0392b"/><text x="79" y="235" font-size="14" fill="#4a3b2f" text-anchor="middle">对话历史</text><rect x="146" y="214" width="170" height="32" rx="4" fill="#faded9" stroke="#c0392b"/><text x="356" y="235" font-size="14" fill="#4a3b2f">最便宜的一块：每若干轮滚动摘要</text><text x="20" y="268" font-size="14" fill="#c0392b">别把「窗口还没满」当安全线：装满之前它就已经开始读错重点</text><text x="20" y="292" font-size="14" fill="#4a3b2f">装配只记这几项：候选几条 · 选中几条 · 被什么规则筛掉 · 压缩前后估算</text><text x="20" y="314" font-size="14" fill="#12a58a">出事时要能回答一句：这一轮是喂多了、喂错了，还是该喂的没喂到</text></svg>`, caption: `条形长短是各类来源的体积，从上往下的顺序就是超预算时的压缩顺序——先想清楚哪一块错了代价最大，再定这个顺序` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `长对话跑五十轮不撑爆窗口，靠的是滚动摘要而不是一刀切掉历史`,
    `一句「订去巴黎的行程」，回话前日历、预算偏好、可用工具已经取齐`,
    `上百个工具里只呈现相关的几个，小模型也不再乱调`,
    `用户中途改主意，旧指令被显式覆盖，不会两条并存互相拉扯`,
    `代码在大块数据上跑完，结论回到主上下文，中间输出留在外面`
  ] },
  { t: `h2`, text: `演示 1 · 装配：先算预算再往里塞` },
  { t: `code`, lang: `python`, code: `def build_context(state, limit=120_000):\n    ctx = {"instructions": SYSTEM + TOOLS,\n           "prefs": load_prefs(state.user_id),\n           "knowledge": retrieve(state.query, top=5),\n           "history": state.turns[-8:]}\n    while estimate(ctx) > limit:\n        ctx["history"] = summarize(ctx["history"])   # 压最便宜的一块\n    return ctx` },
  { t: `p`, text: `压哪一块是设计决定：指令和工具描述是稳定成本，动它就等于换行为；历史最容易压；检索结果压狠了会丢掉依据，答错时查不出这话从哪来。先想清楚哪一块错了代价最大，再定顺序。` },
  { t: `h2`, text: `演示 2 · 草稿本在窗口外面` },
  { t: `code`, lang: `python`, code: `scratch = {}                       # 落盘或运行时对象，不进 prompt\ndef note(step, result):\n    scratch[step] = result          # 只存结论，原始输出留在沙箱\ndef recall(keys):\n    return {k: scratch[k] for k in keys if k in scratch}\n\nctx = build_context(state) + render(recall(["dates", "budget"]))` },
  { t: `p`, text: `一个子任务的状态越滚越长，全留在上下文里就变成干扰。草稿本的意义是「按需读回」：这轮要用的两个字段拼进去，其余部分留在原地等下一轮，窗口只装正在做的那件事。` },
  { t: `h2`, text: `演示 3 · 工具描述也要检索` },
  { t: `code`, lang: `python`, code: `index = load_tool_index()             # 每个工具的描述进了向量库\ncandidates = search(index, state.query, top=30)\nloadout = filter_by_policy(candidates, user.role, top=8)\nreply = run_agent(state.query, tools=loadout)` },
  { t: `p`, text: `一次性注册几十个工具，看起来能力全，实际是让模型在几十个相似描述里猜。「问巴黎市内怎么走」却调起订机票，多数不是模型笨，是那一轮摆出来的选项太多又太像。给工具写清边界，再按查询选一小撮进上下文，比换更大的模型便宜。` },
  { t: `h2`, text: `演示 4 · 喂坏的四形态与各自的出口` },
  { t: `ul`, items: [
    `中毒：一句编造的「有小机场直飞」进了上下文并被反复引用 → 入库前用真实接口校验一次，不过的隔离，严重时重开一条干净上下文`,
    `干扰：历史堆到几万 token，模型忙着复述两年前的背包行程 → 每若干轮把旧对话压成摘要，只留当前日期与目的地`,
    `混淆：工具扎堆，描述互相重叠 → 检索加筛除，单轮只呈现相关的几个，并按角色收窄权限`,
    `冲突：先说经济舱后说商务舱，两条并存 → 新指令进来先做覆盖判定，被推翻的旧条目当场剪掉`
  ] },
  { t: `p`, text: `四个出口的共同前提是先看得见这一轮喂进去的东西。第 11 课那套 span 属性在这里正好复用：记的是条数和标识，不是原文。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `把「窗口还没满」当安全线：模型在装满之前就已经开始读错重点`,
    `摘要不加约束地压：把用户明确说过要的条目压掉了，下一轮只能重问`,
    `检索回来的资料不加标识就并入上下文：答对了也说不清凭哪条`,
    `旧信息只标过期不删除：冲突判定一直读到两份矛盾偏好`,
    `每个子 agent 共享同一份完整历史：多 agent 等于把窗口问题乘了个数`,
    `只调提示词不做装配记录：改了参数，好坏全凭感觉`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `给第 8 课那份结构化计划补一列「这一步要读哪些信息」，并据此写出装配函数`,
    `实现一个 60 轮以上的长对话，用滚动摘要把 token 压在阈值内，统计答错率的变化`,
    `把工具改成检索式选取，对比全量注册与只给 8 个时，同一句提问的调用正确率`,
    `构造一次「经济舱改商务舱」的冲突，验证旧偏好是否真的被覆盖而不是并存`,
    `给装配过程加检查记录：候选数、选中数、压缩前后估算，并只凭这几项说出某次坏答案属于哪种坏法`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：上下文是一轮一次的预算分配——先把每块信息的代价想清楚，再决定这轮往里塞什么、压什么、隔在外面什么。` }
];
