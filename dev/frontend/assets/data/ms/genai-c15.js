window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["genai-c15"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把前十四课散落的东西串成一条能反复跑的流水线——一个生成式应用从想法到上线再到不退化，中间要过哪几道关。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `老的 AI 应用叫 ML 应用，主角是数据科学家：收数据、训模型、把模型当产物交出去。换成大模型之后，叙事整个偏了：主角变成应用开发者，模型本身是租来的服务，你的活儿是集成——选哪个模型、怎么写提示、接哪些数据源。原教程管这个转向叫从 MLOps 到 LLMOps。` },
  { t: `p`, text: `转向带来的最实际变化是度量。传统 ML 盯准确率、召回率、AUC；生成式应用没法这么算，因为回答是一段话而不是一个类别。于是换成五个维度：质量（答得好不好）、危害（有没有越线，这一条直接来自第 3 课那套负责任 AI）、诚实（是不是有据，也就是 groundedness）、成本（token 花多少）、时延（每个 token 平均多久）。` },
  { t: `p`, text: `第二条要点更反直觉：这条流水线不是直线，是一圈一圈的循环。构思阶段做一次原型，用提示词把假设试出来；试通了才进构建阶段，换上更大的数据集，加检索、加微调，验证它在规模下还站得住；站得住才谈上线，接监控、接告警、集成进真实产品。每一步都可能把你退回上一步——数据不够就回去重做检索切分，质量上不去了就回去改提示词。安全、合规、治理则是压在整条流水线下面的一层，不属于某个阶段，每个阶段都得踩在上面。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><defs><marker id="l15" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#475569"/></marker></defs><text x="20" y="22" font-size="16" font-weight="bold" fill="#0f172a">三个大圈，五道量尺，一层底</text><rect x="24" y="42" width="170" height="66" rx="10" fill="#e0f2fe" stroke="#0284c7"/><text x="109" y="66" font-size="15" text-anchor="middle" font-weight="bold" fill="#0c4a6e">构思</text><text x="109" y="88" font-size="14" text-anchor="middle" fill="#0c4a6e">原型 + 提示词试假设</text><rect x="235" y="42" width="170" height="66" rx="10" fill="#fef3c7" stroke="#d97706"/><text x="320" y="66" font-size="15" text-anchor="middle" font-weight="bold" fill="#92400e">构建</text><text x="320" y="88" font-size="14" text-anchor="middle" fill="#92400e">扩数据集，加检索 / 微调</text><rect x="446" y="42" width="170" height="66" rx="10" fill="#dcfce7" stroke="#16a34a"/><text x="531" y="66" font-size="15" text-anchor="middle" font-weight="bold" fill="#14532d">上线</text><text x="531" y="88" font-size="14" text-anchor="middle" fill="#14532d">监控、告警、接产品</text><line x1="194" y1="75" x2="233" y2="75" stroke="#475569" stroke-width="2" marker-end="url(#l15)"/><line x1="405" y1="75" x2="444" y2="75" stroke="#475569" stroke-width="2" marker-end="url(#l15)"/><path d="M531 108 L531 138 L109 138 L109 112" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#l15)"/><text x="320" y="130" font-size="14" text-anchor="middle" fill="#64748b">不达标就退回上一圈，而不是往下走</text><text x="24" y="168" font-size="15" fill="#0f172a">过圈的五道量尺</text><rect x="24" y="178" width="106" height="46" rx="8" fill="#f1f5f9" stroke="#475569"/><text x="77" y="206" font-size="14" text-anchor="middle" fill="#0f172a">质量</text><rect x="142" y="178" width="106" height="46" rx="8" fill="#f1f5f9" stroke="#475569"/><text x="195" y="206" font-size="14" text-anchor="middle" fill="#0f172a">危害</text><rect x="260" y="178" width="106" height="46" rx="8" fill="#f1f5f9" stroke="#475569"/><text x="313" y="206" font-size="14" text-anchor="middle" fill="#0f172a">诚实</text><rect x="378" y="178" width="106" height="46" rx="8" fill="#f1f5f9" stroke="#475569"/><text x="431" y="206" font-size="14" text-anchor="middle" fill="#0f172a">成本</text><rect x="496" y="178" width="120" height="46" rx="8" fill="#f1f5f9" stroke="#475569"/><text x="556" y="206" font-size="14" text-anchor="middle" fill="#0f172a">时延</text><rect x="24" y="242" width="592" height="40" rx="8" fill="#fee2e2" stroke="#dc2626"/><text x="320" y="268" font-size="15" text-anchor="middle" fill="#7f1d1d">贯穿循环的底座：安全、合规、治理（第 14 课那些防线就在这层）</text></svg>`, caption: `三个圈首尾相接可以回退，五道量尺是过圈条件，最下面那条红线始终在脚下` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `把"这个想法行不行"变成一次几小时的验证，而不是几周的排期`,
    `在扩量之前先发现方案在大数据集上根本撑不住`,
    `上线之后能回答"昨天那次回答变差，是换模型还是改提示造成的"`,
    `给非技术的相关方一份可比数字：质量、危害、成本、时延，而不是"感觉还行"`
  ] },
  { t: `h2`, text: `演示 1 · 度量落地成一段代码` },
  { t: `code`, lang: `python`, code: `import time

t0 = time.perf_counter()
r = client.responses.create(model=deployment, input=msgs)
latency = time.perf_counter() - t0
tokens = r.usage.input_tokens + r.usage.output_tokens

row = {"case": case_id, "latency": round(latency, 2),
       "tokens": tokens, "answer": r.output_text}` },
  { t: `p`, text: `成本和时延能自动测，质量和诚实测不了，得靠人工打分或者拿另一个模型来判——这就是为什么每条用例要留 id 和输入，不然后面对不上。` },
  { t: `h2`, text: `演示 2 · 把一次评测当流水线跑` },
  { t: `code`, lang: `yaml`, code: `cases:
- id: C-001
  input: 帮我找几门适合零基础学生的 Azure 入门课
  检查: [有没有推荐, 推荐是否在目录里, 有没有编造课程名]
- id: C-002
  input: 我已经在学 Power BI，还有必要看 Azure 吗
  检查: [有没有用到 level 参数, 回答是否承认不确定]` },
  { t: `p`, text: `构思阶段跑二十条这种用例就够了，改动一次提示词就全跑一遍，把五条检查逐条打勾。原教程把这步叫 PromptFlow 式实验：一次改动、一批输入、一组可比结果。到构建阶段，输入集从二十条涨到几千条，这时候光靠打勾不够了，得看分布——哪一类问题错得多，错的是检索没召回还是模型没跟上。` },
  { t: `h2`, text: `演示 3 · 工具层不是选做题` },
  { t: `p`, text: `原教程点名了这一层的具体形状：一个网页门户用来试模型、看样例、管资源；一个开发侧的流程让你直接在编辑器里搭应用、可视化地调、批量测；底层则接上你已有的服务、项目、向量检索和数据库。它想说的其实很朴素：这些环节如果没有工具兜着，循环就跑不动——每次改提示都要手工复制粘贴二十次，你不会做第二遍，于是流水线退化成一次性 demo。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `只在构思阶段测质量，扩量时不看成本与时延，账单和体验两头挨打`,
    `把上线当终点：模型换版、数据更新、用户提问风格漂移，三件事都会在没人通知你的情况下发生`,
    `用例只留输入不留检查项，跑完还是一句"感觉变好了"`,
    `用一两条 lucky case 决定方案，等于用噪音做决策`,
    `安全与合规留到最后补：第 14 课那些防线一旦是补出来的，就一定有漏的入口`,
    `度量口径中途换人换定义，前后两批数字不可比，曲线全部作废`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `给你现有的应用挑五个问题写成带检查项的用例文件，跑一遍并记录每条的时延与 token 数`,
    `把同一个方案在两个模型上跑那五条用例，列一张质量、成本、时延的对比表，然后写出你的取舍理由`,
    `故意改坏一处提示词（去掉边界说明），重跑用例，看哪几条检查项先变红`,
    `给你的应用写一页上线后的监控清单：告警阈值、留痕字段、多久看一次`,
    `找出你流水线里最需要人工判断的那个环节，设计一个把结论沉淀回用例集的做法`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：生成式应用不是一次训好就交付的模型，而是一套你愿意反复跑的循环——跑得越便宜，你的质量就守得越久。` }
];
