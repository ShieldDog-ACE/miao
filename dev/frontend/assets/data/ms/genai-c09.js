window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["genai-c09"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把「意思相近」变成能算的东西——一句文本编成一个点，比的是方向和关键词完全不同的那套。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `嵌入模型干的事和生成模型不一样：它不写字，它把一段文本映射成一个固定长度的小数数组，也就是一个高维空间里的点。训练目标是让意思接近的文本落在接近的方向上——「我的梦想座驾」和「我想买一台理想的车」用词没有重叠，两个点却靠得很近；而字面都含「梦想」的一句睡眠话题会落在别处。这就是语义搜索和关键词搜索的分界：一个比意思，一个比字符。` },
  { t: `p`, text: `要搜的是「点之间的距离」，所以离线阶段得先把整个语料编好、存起来：切段、逐段嵌入、把向量和原文以及定位信息一起放进一个索引；在线阶段只做三件事——把查询句编成向量、拿它和索引里每个向量算一次相似度、按分数排序取前几条。索引这一步只花钱不花时间，查询这一步才在乎延迟。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#f5f8f6"/><text x="320" y="26" font-size="17" fill="#22333a" text-anchor="middle">左边离线建索引，右边在线查一次</text><text x="28" y="56" font-size="14" fill="#22333a">离线，只做一次</text><rect x="28" y="64" width="104" height="34" rx="5" fill="#e3ecf7" stroke="#8b96ad"/><text x="80" y="86" font-size="14" fill="#22333a" text-anchor="middle">整段材料</text><path d="M132 81 L152 81" stroke="#8b96ad" stroke-width="2"/><rect x="152" y="64" width="112" height="34" rx="5" fill="#e3ecf7" stroke="#8b96ad"/><text x="208" y="86" font-size="14" fill="#22333a" text-anchor="middle">切段加重叠</text><path d="M264 81 L284 81" stroke="#8b96ad" stroke-width="2"/><rect x="284" y="64" width="96" height="34" rx="5" fill="#dfe8ff" stroke="#5b7cfa" stroke-width="2"/><text x="332" y="86" font-size="14" fill="#22333a" text-anchor="middle">嵌入模型</text><path d="M380 81 L400 81" stroke="#8b96ad" stroke-width="2"/><rect x="400" y="58" width="212" height="46" rx="5" fill="#d5f0e8" stroke="#12a58a" stroke-width="2"/><text x="506" y="78" font-size="14" fill="#22333a" text-anchor="middle">索引：向量 + 原文 + 定位</text><text x="506" y="96" font-size="14" fill="#6a7a80" text-anchor="middle">一段一条，存下来</text><text x="28" y="146" font-size="14" fill="#22333a">在线，每一次提问</text><rect x="28" y="154" width="104" height="34" rx="5" fill="#e3ecf7" stroke="#8b96ad"/><text x="80" y="176" font-size="14" fill="#22333a" text-anchor="middle">一句问题</text><path d="M132 171 L152 171" stroke="#8b96ad" stroke-width="2"/><rect x="152" y="154" width="96" height="34" rx="5" fill="#dfe8ff" stroke="#5b7cfa" stroke-width="2"/><text x="200" y="176" font-size="14" fill="#22333a" text-anchor="middle">同一个模型</text><path d="M248 171 L268 171" stroke="#8b96ad" stroke-width="2"/><rect x="268" y="154" width="120" height="34" rx="5" fill="#fbe3c6" stroke="#e0821f" stroke-width="2"/><text x="328" y="176" font-size="14" fill="#22333a" text-anchor="middle">逐个算夹角</text><path d="M388 171 L408 171" stroke="#8b96ad" stroke-width="2"/><rect x="408" y="154" width="204" height="34" rx="5" fill="#d5f0e8" stroke="#12a58a" stroke-width="2"/><text x="510" y="176" font-size="14" fill="#22333a" text-anchor="middle">排序，取分数最高的几条</text><text x="28" y="216" font-size="14" fill="#22333a">为什么是夹角：</text><rect x="150" y="206" width="130" height="70" rx="6" fill="#ffffff" stroke="#8b96ad"/><path d="M215 268 L215 222" stroke="#5b7cfa" stroke-width="2"/><path d="M215 268 L255 232" stroke="#e0821f" stroke-width="2"/><text x="272" y="238" font-size="14" fill="#6a7a80">话长一点，向量更长</text><text x="272" y="258" font-size="14" fill="#6a7a80">方向没变，意思就没变</text><text x="430" y="238" font-size="14" fill="#22333a">所以比方向不比长度</text><text x="430" y="258" font-size="14" fill="#6a7a80">这就是余弦相似度的全部理由</text></svg>`, caption: `两条流水线的交汇点是那个嵌入模型必须是同一个` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `用户问「能不能用 RStudio 做这件事」，命中讲这一段的视频并直接跳到那一分钟`,
    `在几十万段材料里把「相关」排出来，不依赖提问里有几个字和原文一样`,
    `把新材料加进索引就扩大可搜范围，不用重新训练任何东西`,
    `给第 3 课说的检索增强那一档提供材料：搜到的段落正是喂给模型的那段上下文`
  ] },
  { t: `h2`, text: `演示 1 · 一段文本变成一个定长数组` },
  { t: `code`, lang: `python`, code: `r = client.embeddings.create(model="text-embedding-3-small",\n                             input="今天我们要讲 Azure 机器学习")\nv = r.data[0].embedding\nprint(len(v), v[:4])` },
  { t: `p`, text: `分量个数由型号定死，这一款是 1536，跟输入是十个字还是一千字无关。单个分量看不出含义，有意义的是这个点朝向哪儿。顺便注意：这个接口一次能传一个列表，整批语料就这么编，别一段一次请求。` },
  { t: `h2`, text: `演示 2 · 把候选按相似度排序` },
  { t: `code`, lang: `python`, code: `import numpy as np\n\ndef cosine(a, b):\n    a, b = np.array(a), np.array(b)\n    return float(a @ b / (np.linalg.norm(a) * np.linalg.norm(b)))\n\nq = embed("用 RStudio 能做 Azure 机器学习吗")\nhits = sorted(((cosine(q, e), text) for text, e in index), reverse=True)[:5]` },
  { t: `p`, text: `分母是去长度：一段话写得长，向量模就大，但方向不变，而你要的是意思像不像。取前几条这件事业内写作 top-k，k 太小会漏掉答案所在的那段，k 太大会把噪声一起喂给下游——第 7 课那条「拼进上下文」在这里就是成本。` },
  { t: `h2`, text: `演示 3 · 切段要留重叠` },
  { t: `code`, lang: `python`, code: `def chunk(text, size=1500, overlap=200):\n    words = text.split()\n    step = size - overlap\n    return [" ".join(words[i:i + size]) for i in range(0, len(words), step)]\n\nsegs = chunk(transcript)` },
  { t: `p`, text: `重叠是给句子边界买的保险：一段的开头如果正好是半句话，那个点就代表「半句话的方位」，答案在这里却匹配不上。代价是同一句话被编进相邻两段，检索结果会重复，返回前得按定位信息去重。段越长，一个向量要代表的意思越多，方位被抹平，什么都沾一点。` },
  { t: `h2`, text: `演示 4 · 搜到之后接着生成` },
  { t: `code`, lang: `python`, code: `context = "\\n\\n".join(t for _, t in hits)\nanswer = client.chat.completions.create(model="fast", temperature=0,\n    messages=[{"role": "system", "content": "只根据下面材料回答，材料里没有就说不清楚"},\n              {"role": "user", "content": context + "\\n问题：" + question}])` },
  { t: `p`, text: `这一步才看出搜索为什么值得做：命中的段落进了上下文，模型从「猜一个像话的答案」变成「照着给它的材料续写」。但范围只限在那几段，材料之外它照样会补——所以那句「没有就说不清楚」必须留着，返回里也该带上定位，让读的人能点回原文核。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `查询用 A 嵌入模型、语料用 B：两个点不在同一个空间，分数算出来是噪声`,
    `换了嵌入型号却沿用旧索引：维度不一定报错，悄悄错得更难查`,
    `切段太大或太小：太大方位被抹平，太碎又丢掉了上下文`,
    `只盯分数不读命中文本：同词不同义照样能拿高分`,
    `拿它替代关键词搜索：查型号、编号、人名这种精确匹配，倒排索引更准`,
    `不缓存嵌入结果：每次提问把整个语料重编一遍，钱和延迟一起翻倍`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `两份主题不同的材料各按三种段长切，用同一句查询比较哪种段长命中最准`,
    `把重叠从 0 调到 300，找出被切坏的那句话以及它在结果里消失的位置`,
    `用两个不同嵌入型号分别建索引，贴出同一句查询的排序差异并解释原因`,
    `top-k 分别取 1 和 5 喂给演示 4，对比两版答案的依据是否更扎实`,
    `给这个搜索写一句「什么时候别用它」，附一个你亲手复现的失败提问`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：语义搜索没有魔法——它把意思变成方向，把找资料变成量夹角，剩下的准确度全在切段和 top-k 这两个旋钮上。` }
];
