window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["genai-c02"] = [
  { t: `tip`, color: `blue`, text: `本课目标：看清一个大模型在做的事只有一件——根据前面的文本猜下一个词块，看懂它为什么每次猜得不太一样。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `模型是统计模型，擅长算数不擅长读字。所以你写的句子先被分词器切成一段段叫 token 的片段，一个 token 可能是半个词、一个词、一个标点，字符数不固定；每个片段再映射成一个整数。模型真正处理的从头到尾是这一串整数。` },
  { t: `p`, text: `处理的方式是预测：给进 n 个 token，模型输出的是「下一个 token 是什么」的一张概率分布，覆盖词表里所有可能的候选。它从里面挑一个，把挑中的这个拼到输入尾巴上，再猜下一个。整段回答就是这样一个字一个字长出来的，不是先想好一整句再念出来。这也解释了为什么有时会看到回答停在半句上——长度上限到了，循环被掐断。` },
  { t: `p`, text: `挑的时候不一定拿概率最高的那个，这层随机是故意留的，让同一个输入不必给出同一个输出。控制这层随机的参数叫温度。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280" font-family="sans-serif"><rect width="640" height="280" fill="#f4f7f6"/><text x="320" y="28" font-size="17" fill="#1f3550" text-anchor="middle">模型每一轮只产出一个 token</text><text x="40" y="62" font-size="15" fill="#1f3550">输入文本</text><rect x="40" y="74" width="72" height="34" rx="5" fill="#dbe7ff" stroke="#5b7cfa"/><text x="76" y="96" font-size="14" fill="#1f3550" text-anchor="middle">中国</text><rect x="120" y="74" width="72" height="34" rx="5" fill="#dbe7ff" stroke="#5b7cfa"/><text x="156" y="96" font-size="14" fill="#1f3550" text-anchor="middle">的</text><rect x="200" y="74" width="72" height="34" rx="5" fill="#dbe7ff" stroke="#5b7cfa"/><text x="236" y="96" font-size="14" fill="#1f3550" text-anchor="middle">首都</text><rect x="280" y="74" width="72" height="34" rx="5" fill="#cfe9e2" stroke="#12a58a"/><text x="316" y="96" font-size="14" fill="#1f3550" text-anchor="middle">是</text><path d="M370 91 L404 91" stroke="#8b96ad" stroke-width="2"/><rect x="404" y="66" width="112" height="50" rx="8" fill="#ffffff" stroke="#12a58a" stroke-width="2"/><text x="460" y="88" font-size="14" fill="#1f3550" text-anchor="middle">模型</text><text x="460" y="107" font-size="14" fill="#5c6b85" text-anchor="middle">一张概率表</text><text x="40" y="150" font-size="15" fill="#1f3550">候选 token 的概率</text><rect x="150" y="136" width="300" height="16" rx="3" fill="#e0821f"/><text x="460" y="149" font-size="14" fill="#5c6b85">北京 0.72</text><rect x="150" y="160" width="120" height="16" rx="3" fill="#b9c6dd"/><text x="282" y="173" font-size="14" fill="#5c6b85">上海 0.11</text><rect x="150" y="184" width="60" height="16" rx="3" fill="#b9c6dd"/><text x="222" y="197" font-size="14" fill="#5c6b85">南京 0.06</text><rect x="150" y="208" width="26" height="16" rx="3" fill="#b9c6dd"/><text x="188" y="221" font-size="14" fill="#5c6b85">其余相加 0.11</text><path d="M516 116 L556 116 L556 246 L300 246 L300 116" stroke="#e0821f" stroke-width="2" fill="none" stroke-dasharray="6 4"/><text x="330" y="266" font-size="15" fill="#8a5213">抽中的那个拼回尾巴，再猜下一个</text></svg>`, caption: `左边是已经写下的部分，右边是下一格的候选与概率` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `把一段没结构的话变成有结构的：会议记录变要点，评论变分类`,
    `在没写过的具体句子组合上继续往下写，因为它学的是模式不是答案表`,
    `同时扮演两种角色：既能缩写一篇文章，也能把一句话扩写成一段`,
    `用自然语言当接口——不用学查询语言，说清楚要什么就行`
  ] },
  { t: `h2`, text: `演示 1 · 你的句子被切成了几块` },
  { t: `code`, lang: `python`, code: `import tiktoken\n\nenc = tiktoken.get_encoding("cl100k_base")\ntext = "大模型把文本一段一段地生成"\ntokens = enc.encode(text)\nprint(len(tokens))\nprint([enc.decode([t]) for t in tokens])` },
  { t: `p`, text: `条数不等于字数，也不等于词数。中文常常一个字或两个字一个片段，英文按常见词块切。计费的、限制长度的是片段数，所以你估算成本时算的是它，不是你眼睛看到的字数。` },
  { t: `h2`, text: `演示 2 · 一次只给一个片段` },
  { t: `code`, lang: `python`, code: `r = client.chat.completions.create(model=DEPLOY, temperature=0, max_tokens=1,\n    messages=[{"role": "user", "content": "中国的首都"}])\nprint(repr(r.choices[0].message.content))` },
  { t: `p`, text: `把长度上限压到 1，回答就只剩一个片段。这不是它笨，是机制本来就这样。把上限改成 5、20、80 各跑一次，你会看到同一条预测链在不同位置被截断。` },
  { t: `h2`, text: `演示 3 · 温度怎么改结果` },
  { t: `code`, lang: `python`, code: `def ask(temp):\n    out = []\n    for _ in range(5):\n        r = client.chat.completions.create(model=DEPLOY, temperature=temp,\n            messages=[{"role": "user", "content": "给楼下的咖啡店想一句招牌语"}])\n        out.append(r.choices[0].message.content.strip())\n    return set(out)\n\nprint(len(ask(0)), len(ask(1)))` },
  { t: `p`, text: `温度不改变候选的排序，它改变分布的形状：接近 0 时几乎永远挑最高概率的那个，接近 1 甚至更高时低概率的片段也有机会被选中。跑五次去重剩几条，就是这个实验的读数。要稳定复现就压低它，要发散就别用它。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `当成数据库查：它没有一张表，答案是猜出来的，问得越具体它越像在编`,
    `期待同一提示同一结果：即使温度为 0，输入有一点变化、后端有一点调度差异，输出就会漂`,
    `把流畅当正确：错误的引用和错误的数据也能用很自信的语气写出来`,
    `拿它做精确算术或数位：这类任务和「猜下一个片段」不匹配`,
    `超出上下文长度还继续塞：早期内容会被窗口丢掉，模型只看得见剩下的部分`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `分别对一句中文和一句英文做分词，把片段数、字数、词数三个数字并排记下来`,
    `把 max_tokens 依次设成 1、5、20、80 跑同一条提示，写出每次回答断在哪里`,
    `同一条开放性提示在温度 0 和温度 1 各跑五次，比较去重后各剩几条`,
    `挑一件你这周本来要手写的事，写下你会怎么向它描述，再判断这事适不适合交给概率猜测`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：它不是在回答你，它在按概率一块一块续写你给的文本——理解这一点，你就知道它什么时候可靠、什么时候在编。` }
];
