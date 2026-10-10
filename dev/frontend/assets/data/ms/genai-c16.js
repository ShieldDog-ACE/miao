window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["genai-c16"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把第 8 课学到的向量检索接到聊天应用上，看清一条提问是怎么变成几条被塞进提示词的原文，以及这件事为什么比微调便宜。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `模型的知识有两块天花板。一块是训练截止时间——它只知道那之前发生过的事；另一块是它压根没见过你的私有数据：你的笔记、公司的产品手册、这门课第 15 课那份神经网络讲义。把这些写进提示词硬塞进去也不行，输入窗口有上限，全文塞满既贵又抓不住重点。` },
  { t: `p`, text: `检索增强生成做的事分两段。存的那一段：把文档切成块，每块用一个嵌入模型转成一串数字（向量），存进向量库。问的那一段：用户那句话同样转成向量，去库里找距离最近的几个块，把它们的原文取回来，连同问题一起拼成提示词交给模型，模型是照着你给的这几段话在答。` },
  { t: `p`, text: `这里最关键的一点常被误解：模型没有被"教会"新东西，它的权重一点没动。被改变的是它这一次读到了什么。第 12 课的函数调用是给模型一张待填的表格，RAG 是给模型一段开卷的参考页——共同点都是把外部事实挪进上下文，让答案有据可查。原教程引的那篇论文里给了两种用法：一种先用检索到的文档定住整个答案，另一种是每生成一个 token 都重新去查一次。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><defs><marker id="v16" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#334155"/></marker></defs><text x="20" y="22" font-size="16" font-weight="bold" fill="#0f172a">最近邻是按夹角找出来的，不是按字面</text><line x1="80" y1="252" x2="320" y2="252" stroke="#cbd5e1" stroke-width="2"/><line x1="80" y1="252" x2="80" y2="60" stroke="#cbd5e1" stroke-width="2"/><text x="300" y="272" font-size="14" fill="#94a3b8">维度一</text><text x="60" y="72" font-size="14" fill="#94a3b8">维度二</text><line x1="80" y1="252" x2="252" y2="122" stroke="#0284c7" stroke-width="3" marker-end="url(#v16)"/><text x="258" y="118" font-size="14" fill="#0c4a6e">提问向量</text><line x1="80" y1="252" x2="198" y2="150" stroke="#16a34a" stroke-width="2" marker-end="url(#v16)"/><text x="204" y="150" font-size="14" fill="#14532d">文档 A</text><line x1="80" y1="252" x2="240" y2="184" stroke="#16a34a" stroke-width="2" marker-end="url(#v16)"/><text x="246" y="188" font-size="14" fill="#14532d">文档 B</text><line x1="80" y1="252" x2="146" y2="118" stroke="#dc2626" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#v16)"/><text x="150" y="112" font-size="14" fill="#7f1d1d">文档 C</text><line x1="80" y1="252" x2="86" y2="112" stroke="#dc2626" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#v16)"/><text x="94" y="106" font-size="14" fill="#7f1d1d">文档 D</text><rect x="350" y="52" width="270" height="180" rx="10" fill="#f1f5f9" stroke="#475569"/><text x="485" y="76" font-size="15" text-anchor="middle" font-weight="bold" fill="#0f172a">余弦相似度（看夹角）</text><text x="366" y="104" font-size="14" fill="#14532d">文档 A      0.98    收</text><text x="366" y="128" font-size="14" fill="#14532d">文档 B      0.91    收</text><text x="366" y="152" font-size="14" fill="#7f1d1d">文档 C      0.63    太远，舍</text><text x="366" y="176" font-size="14" fill="#7f1d1d">文档 D      0.41    太远，舍</text><text x="366" y="204" font-size="14" fill="#0f172a">距离阈值一设，就不会硬凑答案</text><text x="485" y="262" font-size="14" text-anchor="middle" fill="#64748b">实线被召回，虚线落在阈值外</text></svg>`, caption: `同一个提问变成一支箭头，谁的夹角小就先被拿回来；设了距离上限才有"我没查到"这条路` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `让员工问公司手册里的事，答得不到的时候能指回具体是哪一段`,
    `把学生自己的笔记变成出题来源：练习卷、复习卡片、浓缩综述`,
    `推荐系统：找出最像的几部电影、几家店`,
    `把聊天记录存起来，让对话记得你上周说过什么`
  ] },
  { t: `h2`, text: `演示 1 · 切块这一步决定上限` },
  { t: `code`, lang: `python`, code: `def split_text(text, max_length, min_length):
    words, chunks, cur = text.split(), [], []
    for w in words:
        cur.append(w)
        if len(" ".join(cur)) > max_length:
            chunks.append(" ".join(cur)); cur = []
    if cur:
        chunks.append(" ".join(cur))
    return chunks` },
  { t: `p`, text: `切块不是省事，是因为模型一次读不下全文，而且少塞 token 就少花钱。切法有按句、有按段。原教程特别提醒：块的意义是从周围的词里推出来的，所以给块补上文档标题、或者把前后各多带一点文字，检索质量会明显变好——一个孤零零的"它的权重更新很慢"很难被找到。` },
  { t: `h2`, text: `演示 2 · 建索引，然后问一次` },
  { t: `code`, lang: `python`, code: `from sklearn.neighbors import NearestNeighbors

vecs = df["embeddings"].to_list()
nbrs = NearestNeighbors(n_neighbors=5, algorithm="ball_tree").fit(vecs)

distances, indices = nbrs.kneighbors([query_vector])
print(indices[0], distances[0])` },
  { t: `p`, text: `n_neighbors 设 5，就是无论问什么都一定捞回 5 条——这正是问题所在：库里根本没有相关内容时，它也照样给你 5 条最不离谱的。所以要么设最大距离阈值把太远的扔掉，要么混上关键词检索。原教程这一课用的就是混合检索，两种一起跑。` },
  { t: `h2`, text: `演示 3 · 把捞回来的原文交给模型` },
  { t: `code`, lang: `python`, code: `context = [df["chunks"].iloc[i] for i in indices[0]]
context.append(user_input)

messages = [
    {"role": "system",
     "content": "只依据我提供的资料回答，资料里没有就说不知道。"},
    {"role": "user", "content": "\\n\\n".join(context)},
]
r = client.responses.create(model=deployment, input=messages, store=False)` },
  { t: `p`, text: `最后那半句是重点：检索到了不等于会被引用。不加这条约束，模型会把自己的想象和你的资料混着写，读者分不出来。这也是原教程列的评测维度里 groundedness（有据）单独占一项的原因——它衡量的就是这句话究竟来自资料还是来自模型本身。` },
  { t: `h2`, text: `演示 4 · 召回之后还得重排` },
  { t: `p`, text: `向量库先粗召回一批，再用一个重排模型按相关度从头排一遍，把最贴的那两条顶到前面——上下文窗口就那么宽，位置也影响模型更看重谁。原教程给的评测四项正好是这条链路的体检表：回答质量、有没有据、是否切题、语句顺不顺。前两项测的是检索，后两项测的是生成，坏在哪一段就回去修哪一段。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `块切得太大：一个块里混了三个主题，向量谁也不像；切得太小：语义被截断`,
    `不设距离阈值也不做混合检索，库里没问题答案时它照样自信作答`,
    `嵌入模型和生成模型不匹配，或者换了嵌入模型却不重建索引，旧向量全部作废`,
    `资料取回来只做字符串拼接，不划界、不注明出处，有据变成猜的`,
    `拿 RAG 该做的事去微调：只是要模型知道新事实，开卷比重新上课便宜`,
    `检索链路完全不留痕，用户投诉答错时无法知道是漏召回还是模型没用`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `拿一份长文档切三种块大小（短句、整段、整段加标题），各跑十个问题，比较被召回的是哪几块`,
    `实现一个最大距离阈值，构造一个库里肯定没有的问题，验证它能走到"我没查到"这一支`,
    `把同一份资料分别用纯向量检索和混合检索跑一遍，找出只有混合才召回的那几条`,
    `给返回的答案附上来源：每条引用要能指出它来自哪个块的哪一句`,
    `召回 5 条只塞 2 条，观察答案质量变化，找出你这批问题上的拐点`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：RAG 不改模型，改的是它这一次读到什么——你的功课全在切块、召回和把资料划清界限这三件事上。` }
];
