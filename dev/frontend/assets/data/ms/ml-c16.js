window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["ml-c16"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把「机器读一句话」拆成一条摸得到的流水线——切词、标结构、变数字、做任务，并分清哪一段靠规则就够、哪一段非学不可。NLP 这一组五课沿这条链往下走。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `计算机拿到的从来不是「意思」，是一段字符序列：码点加空格、标点、大小写、错别字。自然语言处理是在这段字符和某个可执行动作之间补上一串台阶。对手机说「明天九点提醒我开会」：声音先转成文字，文字被切开、认出哪是动词哪是时间，命中的关键词换成结构化字段，最后才轮到日程应用干活。前几级纯规则也做得完，最后那一级「这句话要我做什么」做不完——这正是机器学习挤进来的位置。` },
  { t: `p`, text: `这条线上有个历史包袱。1950 年图灵把「机器会不会思考」换成一个能测的操作：让人隔着屏幕聊，分不出对面是人还是机器就算过。1966 年的 Eliza 把这个测试糊弄过去了——它见到 I am sad 就把人称和时态改一遍，回你「你难过多久了」，认不出关键词就随机抛一句万能回应。它没读懂任何东西，却让人产生被读懂的错觉。「回应通顺」和「理解句意」是两件事，后面所有 NLP 任务都得按这两件事分开评价。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#fbfbfd"/><defs><marker id="a16" markerWidth="10" markerHeight="10" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#6b6b7b"/></marker></defs><g stroke="#c9c9d6" fill="#ffffff" stroke-width="1.5"><rect x="10" y="70" width="108" height="60" rx="9"/><rect x="138" y="70" width="108" height="60" rx="9"/><rect x="266" y="70" width="108" height="60" rx="9"/><rect x="394" y="70" width="108" height="60" rx="9"/><rect x="522" y="70" width="108" height="60" rx="9"/></g><g font-size="14" fill="#222" text-anchor="middle"><text x="64" y="96">原始句子</text><text x="192" y="96">切词</text><text x="192" y="116" font-size="13" fill="#666">tokens</text><text x="320" y="96">标结构</text><text x="320" y="116" font-size="13" fill="#666">词性 / 短语</text><text x="448" y="96">变数字</text><text x="448" y="116" font-size="13" fill="#666">向量</text><text x="576" y="96">做任务</text><text x="576" y="116" font-size="13" fill="#666">情感 / 翻译</text></g><g stroke="#6b6b7b" stroke-width="2" fill="none"><line x1="118" y1="100" x2="136" y2="100" marker-end="url(#a16)"/><line x1="246" y1="100" x2="264" y2="100" marker-end="url(#a16)"/><line x1="374" y1="100" x2="392" y2="100" marker-end="url(#a16)"/><line x1="502" y1="100" x2="520" y2="100" marker-end="url(#a16)"/></g><line x1="383" y1="56" x2="383" y2="200" stroke="#c0392b" stroke-dasharray="6 5"/><text x="195" y="160" font-size="14" fill="#2471a3" text-anchor="middle">这三步：规则 + 词典就能做</text><text x="510" y="160" font-size="14" fill="#c0392b" text-anchor="middle">这两步：只能从数据里学</text><text x="320" y="232" font-size="14" fill="#333" text-anchor="middle">Eliza 只碰第二、三步，就能骗过图灵测试的眼睛</text><text x="320" y="262" font-size="14" fill="#666" text-anchor="middle">所以五节课的顺序：先会切，再会表示，最后才谈任务</text></svg>`, caption: `一句话从进到出的五级台阶：左边三级靠规则，右边两级必须靠数据` },
  { t: `p`, text: `记住分工，NLP 的代码就不会写成名词解释。切词决定单元是什么：中文按字、按词还是按子词，英文按空格还是保留 don't 的连写；标结构决定谁修饰谁，not good 里的 not 没被认出来，情感就反了；变数字决定机器拿什么算——一个词被折成向量之后，它长什么样不再重要，重要的是它和别的向量离多远。三步都通了，任务那一层才有意义。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `把一句自然语言落到可执行字段上：时间、地点、人名、要做的动作`,
    `对成千上万条无人标注的反馈做粗分类，把人留给边界样本`,
    `把一种语言换成另一种，只要两种语言都能被切成可对齐的单元`,
    `反向用：给文本补结构，抽实体、纠拼写、生成摘要`
  ] },
  { t: `h2`, text: `演示 1 · 一句话被机器读成了什么` },
  { t: `code`, lang: `python`, code: `from textblob import TextBlob\n\nb = TextBlob("The room was spotless, but the breakfast was awful")\nprint(b.words)\nprint(b.tags[:6])            # 每个 token 后面挂的词性\nprint(b.noun_phrases)\nprint(b.sentiment)           # polarity 正负 / subjectivity 主客观` },
  { t: `p`, text: `装它要两步，第二步常被忽略：pip install -U textblob 之后还得 python -m textblob.download_corpora 把语料拉下来，否则词性标注会报缺资源。四行打印是链子前三级各露一手：words 是切词，tags 是标结构，noun_phrases 是短语合并，sentiment 已经是任务——而且它靠词典数出来、不是学出来的，天花板在哪，后面做情感时会看到。` },
  { t: `h2`, text: `演示 2 · 二十行写一个 Eliza` },
  { t: `code`, lang: `python`, code: `import random\n\nreplies = ["这个挺有意思，多说点。", "嗯，然后呢？", "你为什么这么说？"]\nprint("我是 Marvin，输入 bye 结束")\nwhile True:\n    text = input("> ")\n    if text.strip().lower() == "bye":\n        print("聊得很愉快，再见")\n        break\n    print(random.choice(replies))` },
  { t: `p`, text: `这段程序连词性都没看，只在最后一关做随机应答。计划就是原文那四步：打印提示、进循环、收输入判断要不要退出、从列表抽一句回。它能撑十几轮对话——不是因为它懂，而是通用回应的适用范围太宽。「有没有理解」在这种程序上问不出答案，得换个能问的问题：它有没有把这句话里的信息取出来。` },
  { t: `h2`, text: `演示 3 · 它在哪句话上露馅` },
  { t: `code`, lang: `python`, code: `def reply(text):\n    w = text.lower().split()\n    if w[:2] == ["i", "am"]:\n        return "你这样多久了？" + " ".join(w[2:])\n    if w[:2] == ["you", "are"]:\n        return "你才是吧？" + " ".join(w[2:])\n    return random.choice(replies)\n\nprint(reply("I am sad"))\nprint(reply("You are a bicycle"))` },
  { t: `p`, text: `两句都得到通顺回应，两句都错：第一句把情绪当时间问，第二句把一个荒谬归类直接接住。露馅的地方不是语法——它对 I am / you are 的模式识别完全正确——而是它手上没有任何「sad 是情绪、bicycle 是物体」的知识。规则派做到的是模式命中，不是信息取对，这就是第 3 步到第 4 步之间那道红线的形状。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `把「能对话」当成「理解了」：通用回应命中率很高，测试集上一路绿灯`,
    `只装 textblob 不下 corpora，第一次调用词性标注才报错`,
    `切词单元选得太小或太大：整句当一个 token 什么都匹配不上，切到字符级又丢词义`,
    `拿英文空格直觉处理中文、拿句子直觉处理带 emoji 或拼错的评论，规则一上来就漏`,
    `把词典法的 polarity 数字当客观指标：它对反讽、双重否定、行业黑话一律按字面算`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `用 TextBlob 打印三句结构不同的话的 words 与 tags，找出至少一个标错的 token，说出它为什么被标错`,
    `给演示 2 的机器人加两条规则（人称互换、识别问句），再用两句它接不住的话证明它仍然不懂`,
    `给演示 3 加一条关键词分支（出现酒店、房间、早餐走一条），比较加了之后它骗人的能力是变强还是变弱`,
    `拿一段中文和一段英文各切一次，写下两种语言里「一个 token」分别对应什么，说明这差别怎样影响后面的任务`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：机器读的不是句子，是字符序列加上你给它装的台阶——台阶铺到哪儿能力就到哪儿；把话接顺，跟把话读懂，中间隔着整整一条流水线。` }
];
