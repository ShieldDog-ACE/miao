window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["agents-c18"] = [
  { t: `tip`, color: `blue`, text: `本课目标：在一台机器上把 agent 跑完整——本地模型出工具调用、本地检索拿资料、本地 MCP 给能力，全程不需要一次云端推理。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `上一课把 agent 放大到云上，这一课反过来收进单机。取舍很直白：用几 B 参数的小模型换掉云端前沿模型，换来三件事——代码和数据不出机器、按 token 计费的账单变成电费、断网照跑。代价也明确：它见得少、多跳推理弱。所以本地唯一走得通的打法是「小模型只做调度，重活交给工具」：它不需要记得你的代码库，只需要知道什么时候该调 read_file、什么时候该查文档。` },
  { t: `p`, text: `能落地靠两个条件凑齐。第一是接口：本地运行时对外暴露一个和 OpenAI 同形的 HTTP 端点，云端那套 agent 代码只改 base_url 和 api_key 就能连通。第二是模型本身要真会发工具调用——不少小模型聊天顺，吐出的 tool call 却是残缺 JSON，专门做过函数调用训练的 Qwen 这类才稳定。第 5 课那条「发描述、收调用、回填结果」的链路一步不少，只是执行者换成了本机。` },
  { t: `p`, text: `检索和能力也留在本地：嵌入模型本机跑，分块向量落在进程内的向量库（Chroma 这类，数据就是磁盘上的文件，不用另起服务）；MCP 是传输协议而不是云服务，用 stdio 起一个本地进程就能挂上文件、git、数据库。但本地不等于安全——那个进程带着你的用户权限跑，它能读什么必须划范围。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320" font-family="sans-serif"><rect width="640" height="320" fill="#fffaf3"/><text x="320" y="22" font-size="17" fill="#4a3b2f" text-anchor="middle">整条链路都在这台机器上：小模型只做调度，重活交给工具</text><text x="16" y="44" font-size="14" fill="#12a58a">这一台机器，代码和数据不出这里</text><line x1="520" y1="40" x2="520" y2="300" stroke="#e8ded2" stroke-width="2" stroke-dasharray="6 5"/><text x="532" y="44" font-size="14" fill="#c0392b">云端（可选）</text><rect x="532" y="56" width="92" height="32" rx="6" fill="#faded9" stroke="#c0392b"/><text x="578" y="77" font-size="14" fill="#7f1d1d" text-anchor="middle">前沿模型</text><text x="532" y="116" font-size="14" fill="#8a7867">不敏感又要</text><text x="532" y="136" font-size="14" fill="#8a7867">深推理才去</text><text x="532" y="166" font-size="14" fill="#8a7867">断网就没有</text><rect x="16" y="56" width="152" height="48" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="92" y="76" font-size="14" fill="#4a3b2f" text-anchor="middle">① route 判定</text><text x="92" y="96" font-size="14" fill="#8a7867" text-anchor="middle">敏感或断网→本地</text><path d="M168 80 L178 80" stroke="#8a7867" stroke-width="2" fill="none"/><polygon points="188,80 178,75 178,85" fill="#8a7867"/><rect x="188" y="56" width="152" height="48" rx="6" fill="#d5f0e8" stroke="#12a58a"/><text x="264" y="76" font-size="14" fill="#1d4230" text-anchor="middle">② 换端点</text><text x="264" y="96" font-size="14" fill="#8a7867" text-anchor="middle">base_url 指本机</text><path d="M340 80 L348 80" stroke="#8a7867" stroke-width="2" fill="none"/><polygon points="356,80 348,75 348,85" fill="#8a7867"/><rect x="356" y="56" width="152" height="48" rx="6" fill="#fbe3c6" stroke="#e0821f"/><text x="432" y="76" font-size="14" fill="#4a3b2f" text-anchor="middle">③ 小模型出调用</text><text x="432" y="96" font-size="14" fill="#8a7867" text-anchor="middle">得是训过的模型</text><text x="16" y="138" font-size="14" fill="#4a3b2f">发描述、收调用、回填结果一步不少，执行者换成整机</text><path d="M432 104 L432 160" stroke="#8a7867" stroke-width="2" fill="none"/><polygon points="432,172 427,162 437,162" fill="#8a7867"/><rect x="356" y="172" width="152" height="48" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="432" y="192" font-size="14" fill="#4a3b2f" text-anchor="middle">④ 本机执行</text><text x="432" y="212" font-size="14" fill="#8a7867" text-anchor="middle">read_file 限目录</text><path d="M356 196 L350 196" stroke="#8a7867" stroke-width="2" fill="none"/><polygon points="340,196 350,191 350,201" fill="#8a7867"/><rect x="188" y="172" width="152" height="48" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="264" y="192" font-size="14" fill="#4a3b2f" text-anchor="middle">⑤ 本地检索</text><text x="264" y="212" font-size="14" fill="#8a7867" text-anchor="middle">嵌入与向量在磁盘</text><path d="M188 196 L178 196" stroke="#8a7867" stroke-width="2" fill="none"/><polygon points="168,196 178,191 178,201" fill="#8a7867"/><rect x="16" y="172" width="152" height="48" rx="6" fill="#d5f0e8" stroke="#12a58a"/><text x="92" y="192" font-size="14" fill="#1d4230" text-anchor="middle">⑥ 回填再问</text><text x="92" y="212" font-size="14" fill="#8a7867" text-anchor="middle">第二次请求出答案</text><text x="16" y="252" font-size="14" fill="#c0392b">本地不等于安全：那个 MCP 进程带着你的用户权限跑</text><text x="16" y="274" font-size="14" fill="#c0392b">工具读了家目录里的私钥，下一句就可能被讲出去</text><text x="16" y="296" font-size="14" fill="#8a7867">内存 8 GB 是能跑的下限，16 GB 才谈得上更长上下文</text></svg>`, caption: `虚线以左的六步就是一句提问在本机走满的调用路径——它和第 5 课云端那条链同形，只是每一步的执行者换成了这台机器` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `问「auth.py 是干什么的」，它真的调 read_file 读了再解释，而不是凭印象猜`,
    `在自己几百篇文档上问框架用法，答案能指回出处，内容没出过机器`,
    `飞机上、内网隔离的机房里照常工作，不依赖任何外部服务`,
    `试验不花钱，可以一夜跑一千次回归`,
    `云端不可用时整条链路降级到本地，质量下降而不是服务停摆`
  ] },
  { t: `h2`, text: `演示 1 · 换端点，不换代码` },
  { t: `code`, lang: `python`, code: `from openai import OpenAI\n\nclient = OpenAI(base_url=local_endpoint, api_key="local-placeholder")\nresp = client.chat.completions.create(model="qwen2.5-coder-7b-instruct",\n                                      messages=msgs, tools=TOOLS)` },
  { t: `p`, text: `端点由本地运行时给，端口不要硬写，SDK 能自己发现。硬门槛是内存：8 GB 是能跑起来的下限，16 GB 才谈得上更大模型和更长上下文；有 GPU 或 NPU 只是快，没加速器它会自动挑 CPU 构建。选哪个尺寸的模型别看参数表猜，用同一批你自己的题在本机跑一遍比较，这和本课末尾的计时要求是同一件事。` },
  { t: `h2`, text: `演示 2 · 本地工具要划范围` },
  { t: `code`, lang: `python`, code: `def read_file(path):\n    full = (PROJECT_ROOT / path).resolve()\n    if PROJECT_ROOT not in full.parents and full != PROJECT_ROOT:\n        return "Access denied: outside the project directory."\n    return full.read_text(encoding="utf-8")` },
  { t: `p`, text: `先 resolve 再比父目录，挡的是 ../ 这类写法。别觉得本地就没人偷数据：工具读了家目录里的私钥，内容进了上下文，模型下一句就可能把它讲出去——这条链路和模型大小无关。MCP 服务同理，只给它一个项目目录，别给整个 home。` },
  { t: `h2`, text: `演示 3 · 本地 RAG 的四段都在机器上` },
  { t: `code`, lang: `python`, code: `col = chromadb.PersistentClient(path="./vecs").get_or_create_collection("docs")\nfor p in list(PROJECT_ROOT.rglob("*.md"))[:200]:\n    col.add(ids=[p.name], embeddings=[embed(p.read_text())])\n\nhits = col.query(query_texts=[q], n_results=4, embeddings=[embed(q)])` },
  { t: `p`, text: `管道是本地嵌入 → 本地向量 → 本地检索 → 本地小模型读结论，和第 6 课那套 agentic RAG 是同一个模式，只是每个环节搬到了同一台机器上。要点在于分工：模型记不住你的文档，检索记得住，那就别让它记。` },
  { t: `h2`, text: `演示 4 · 混合路由与降级` },
  { t: `code`, lang: `python`, code: `def route(query, sensitive, online):\n    if sensitive or not online:\n        return local\n    return cloud if needs_deep_reasoning(query) else local\n\ntry:\n    out = run(query, model=cloud)\nexcept CloudUnavailable:\n    out = run(query, model=local)          # 降级，不是失败` },
  { t: `p`, text: `这是第 17 课多模型路由的同一件事，只不过候选里多了一台自己的机器。判定要写成代码而不是感觉：敏感度看数据来源有没有客户内容，深度与否用一次便宜的分类调用决定。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `把小模型当云端模型用，让它凭记忆答项目里的事，幻觉率立刻上来`,
    `用了没做过函数调用训练的模型：聊得挺好，一到调用就吐残缺 JSON`,
    `本地工具不设路径范围，MCP 进程直接挂在整个 home 目录上`,
    `嵌入模型换了但向量库没重建：检索回来的东西和查询毫不相关`,
    `权重第一次下载没走镜像源，直连海外站卡到超时，跑之前先把 GGUF 拉完`,
    `只看能不能跑、不看延迟：CPU 上 7 B 一次回答十几秒，先确认交互受不受得了`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把第 5 课那个云端 agent 接到本地端点，只改 base_url，逐条对比两边的回答与调用次数`,
    `加一个 find_todos 工具，扫出项目里的 TODO 和 FIXME 并带上文件与行号，沿用 read_file 的范围检查`,
    `分别问三类问题各一次：纯检索、要读指定文件、要汇总待办，把三次耗时记下来`,
    `写一段划分：这套流程里哪几步值得留本地，哪一步宁可回云端，理由分别是什么`,
    `断网跑一遍完整链路，验证检索、工具、MCP 全都不依赖外部服务`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：本地 agent 的上限不取决于模型多大，而取决于工具多强——小模型负责决定调哪个、传什么参数，剩下的交给读文件、检索和本地服务。` }
];
