window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["genai-c03"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把候选模型摆到同一张桌上，用几个能量出来的维度比，并分清让模型适合你的四种介入深度。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `先按输出分。文本模型写文字也写代码；图像模型从描述生成像素；语音模型把声音转成字；嵌入模型把句子变成一个向量，自己不生成任何东西，产出是给别的模型当输入。再按架构分：只有编码器的模型擅长读——分类、抽取、判断，但它写不出话；只有解码器的模型擅长续写，GPT 和 Llama 这类都在这一档；编码器加解码器的两头都能，典型是做转换。方向选错，后面提示词写得再好也补不回来。` },
  { t: `p`, text: `还有一层常被混用：基础模型和大模型不是同义词。基础模型指自监督训出来的超大网络，它是一块地基；大语言模型是这块地基上专门面向语言的那栋房子。而你调用时看到的那个名字，往往是服务不是模型——服务是模型加数据、加安全过滤、加接口封装的打包，背后还可能在几个变体之间路由。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `用一个小而快的模型替一个大模型做分类和抽取，成本降一个量级`,
    `把同一批任务在两个模型上各跑一遍，用数据决定上线哪个`,
    `自托管一个开放权重的模型，让数据不出自己的机房`,
    `上线之后换底层模型，业务代码只改一处映射`
  ] },
  { t: `h2`, text: `演示 1 · 把候选摆成可比的几列` },
  { t: `code`, lang: `python`, code: `candidates = [\n    {"model": "gpt-4o-mini", "ctx": 128000, "p50_ms": 420, "note": "便宜，工具调用稳"},\n    {"model": "gpt-4o", "ctx": 128000, "p50_ms": 900, "note": "长文推理更稳"},\n    {"model": "llama-4", "ctx": 1000000, "p50_ms": 700, "note": "开放权重，自己托管"},\n]\nfor c in candidates:\n    print(c["model"], c["ctx"], c["p50_ms"], c["note"])` },
  { t: `p`, text: `比的是任务质量、延迟、上下文窗口、是否支持工具调用、单价、能不能落到你的地域——发布日期和价格本身不算维度。上下文窗口尤其实在：它决定检索回来的材料一次能塞多少进提示，塞不进去的那些等于不存在。` },
  { t: `h2`, text: `演示 2 · 同一批题各跑一遍` },
  { t: `code`, lang: `python`, code: `questions = ["把这通客户投诉归到一个类别", "缩写成 30 字", "列出需要人工跟进的点"]\nfor dep in ["fast", "smart"]:\n    for q in questions:\n        r = client.chat.completions.create(model=dep, temperature=0, max_tokens=200,\n            messages=[{"role": "user", "content": q}])\n        print(dep, q[:6], r.usage.total_tokens, r.choices[0].message.content)` },
  { t: `p`, text: `温度设成 0 是必要的：不然两次差别来自抽样的随机，而不是模型本身。同时把 token 用量打出来，只比质量不比成本的评测，结论多半是「用最大的那个」。` },
  { t: `h2`, text: `演示 3 · 服务名与模型名分开` },
  { t: `code`, lang: `python`, code: `DEPLOYMENTS = {"fast": "gpt-4o-mini-2024-07-18", "smart": "gpt-4o-2024-11-20"}\nr = client.chat.completions.create(model=DEPLOYMENTS["fast"],\n    messages=[{"role": "user", "content": "用一句话说清 RAG"}])\nprint(r.model, r.usage.total_tokens)` },
  { t: `p`, text: `业务代码只引用左边这个标签，标签到具体模型和版本的映射放在配置里。要换底层模型时改映射那一行；回滚也是。直接写死模型名的代码，等于把版本钉在源码里，将来不敢动。` },
  { t: `h2`, text: `演示 4 · 四种介入深度` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#f6f6f2"/><text x="320" y="26" font-size="17" fill="#25314a" text-anchor="middle">你的数据以什么方式进入模型</text><rect x="30" y="200" width="130" height="62" rx="8" fill="#dfeaff" stroke="#5b7cfa" stroke-width="2"/><text x="95" y="224" font-size="15" fill="#25314a" text-anchor="middle">提示词</text><text x="95" y="243" font-size="14" fill="#5c6b85" text-anchor="middle">当场塞进去</text><rect x="180" y="160" width="130" height="102" rx="8" fill="#d5f0e8" stroke="#12a58a" stroke-width="2"/><text x="245" y="186" font-size="15" fill="#25314a" text-anchor="middle">检索增强</text><text x="245" y="206" font-size="14" fill="#5c6b85" text-anchor="middle">查来材料</text><text x="245" y="225" font-size="14" fill="#5c6b85" text-anchor="middle">再塞进去</text><text x="245" y="244" font-size="14" fill="#5c6b85" text-anchor="middle">权重不动</text><rect x="330" y="120" width="130" height="142" rx="8" fill="#fde6c6" stroke="#e0821f" stroke-width="2"/><text x="395" y="146" font-size="15" fill="#25314a" text-anchor="middle">微调</text><text x="395" y="166" font-size="14" fill="#5c6b85" text-anchor="middle">改权重</text><text x="395" y="185" font-size="14" fill="#5c6b85" text-anchor="middle">产出新模型</text><text x="395" y="204" font-size="14" fill="#5c6b85" text-anchor="middle">事实会过期</text><rect x="480" y="80" width="130" height="182" rx="8" fill="#f3d4d4" stroke="#c15454" stroke-width="2"/><text x="545" y="106" font-size="15" fill="#25314a" text-anchor="middle">从头训练</text><text x="545" y="126" font-size="14" fill="#5c6b85" text-anchor="middle">自己造地基</text><text x="545" y="145" font-size="14" fill="#5c6b85" text-anchor="middle">数据算力</text><text x="545" y="164" font-size="14" fill="#5c6b85" text-anchor="middle">都要海量</text><path d="M30 60 L610 60" stroke="#b9c0cf" stroke-width="1"/><text x="34" y="52" font-size="14" fill="#5c6b85">成本、复杂度、需要的时间，从左到右逐级上升</text><text x="30" y="288" font-size="14" fill="#5c6b85">改一次生效：立刻 / 每次查 / 重训一次 / 重来一次</text></svg>`, caption: `阶梯越高，改动越深，生效也越慢` },
  { t: `p`, text: `这四档不是由轻到重的选项清单，而是四种不同的生效方式。前两档每次请求都重新给材料，所以材料换了答案立刻跟着换；后两档把东西学进权重里，之后不必再给，但也就凝固在训练那一刻。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `拿发布日期当质量指标：同一档位里旧模型赢新模型的评测项很常见`,
    `只比效果不比延迟和单价：一个 demo 里看不出，并发上来才崩`,
    `给分类检索任务上大生成模型：方向不对，钱全花在不会用的能力上`,
    `以为微调能补最新事实：它擅长固定风格和格式，新鲜事实该走检索那一档`,
    `把服务名当模型名写死在代码里：换版本要改遍所有调用点`,
    `开放权重只看到免费：托管、监控、安全更新和评测都是你要付的人月`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `给你手头一个真实任务写出六个维度的对比表，填两个候选模型，标出你查不到哪一格`,
    `同一组五道题在两个部署上各跑一遍，温度设 0，把 token 数和耗时一起记进表`,
    `把模型名从代码里挪进配置映射，然后只改配置完成一次换型号、一次回滚`,
    `判断你的数据里哪些内容变化频繁、哪些几乎不变，据此说清该选哪一档介入深度`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：选模型不是选最强的那个，而是选在质量、延迟、成本、数据进出方式四个维度上都刚好够用的那个。` }
];
