window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["ml-c20"] = [
  { t: `tip`, color: `blue`, text: `本课目标：接上一课那份 51.5 万行酒店评论，把列换成能用的列，再把正文变成两个情感分数——顺便看清分词、表示、任务这条链在真实数据上要花多少秒。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `上一课的结论是三列不可信、占位符要单独处理、Tags 只能当文本统计。本课按这三条动手，顺序不能颠倒：先换汇总，再把地址压成 6 个城市，再把 Tags 折成 0/1 列，最后才碰正文。原因很实在——情感打分是这条链上最贵的一步（51 万行乘两列，跑十分钟以上），在这之前砍掉的每一行每一列每一个词都直接换成时间。` },
  { t: `p`, text: `Tags 最能说明 EDA 省算力。要对 6762646 个词做多词短语频次统计，但你已经看过一行 Tags 长什么样——逗号分隔的短语——拆开再数就行。新问题：有人漏填，一行的段数从 3 到 6 不等，按位置切出来的第 3 段有时是房型有时是住客类型。办法很朴素：造 6 个临时列各收一个位置，并成一列数频次，得到 2428 个不同短语，留谁扔谁一目了然。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#fbfbfd"/><defs><marker id="a20" markerWidth="10" markerHeight="10" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#6b6b7b"/></marker></defs><g font-size="14" text-anchor="middle"><rect x="16" y="40" width="180" height="72" rx="8" fill="#e8f0fb" stroke="#2471a3"/><text x="106" y="66" fill="#222">Hotel_Reviews.csv</text><text x="106" y="86" fill="#2471a3">515738 行 × 17 列</text><text x="106" y="104" fill="#666">原始爬取</text><rect x="228" y="40" width="180" height="72" rx="8" fill="#eef7ee" stroke="#1e8449"/><text x="318" y="66" fill="#222">Filtered.csv</text><text x="318" y="86" fill="#1e8449">列已换 / Tags 已展开</text><text x="318" y="104" fill="#666">正文仍是原样</text><rect x="440" y="40" width="184" height="72" rx="8" fill="#fbeeee" stroke="#c0392b"/><text x="532" y="66" fill="#222">NLP.csv</text><text x="532" y="86" fill="#c0392b">多了两个分数列</text><text x="532" y="104" fill="#666">可以直接喂模型</text></g><g stroke="#6b6b7b" stroke-width="2" fill="none"><line x1="196" y1="76" x2="226" y2="76" marker-end="url(#a20)"/><line x1="408" y1="76" x2="438" y2="76" marker-end="url(#a20)"/></g><text x="211" y="140" font-size="14" fill="#333" text-anchor="middle">换汇总 / 压地址 / Tags 拆 6 列再合并</text><text x="522" y="140" font-size="14" fill="#333" text-anchor="middle">去停用词 → VADER compound</text><g font-size="14"><rect x="16" y="170" width="300" height="106" rx="8" fill="#ffffff" stroke="#d8d8e3"/><text x="30" y="194" fill="#222">贵的两步要分开算</text><text x="30" y="218" fill="#1e8449">去停用词：两列 51 万行，约 3.3 秒</text><text x="30" y="242" fill="#c0392b">打情感：不清停用词 12 到 14 分钟</text><text x="30" y="266" fill="#c0392b">清完再打：约 120 秒</text><rect x="330" y="170" width="294" height="106" rx="8" fill="#ffffff" stroke="#d8d8e3"/><text x="344" y="194" fill="#222">验收方式只有一个</text><text x="344" y="218" fill="#333">按分数排序，人工读最极端的几行</text><text x="344" y="242" fill="#333">负面栏却是正分 + 评分很低 → 反讽</text><text x="344" y="266" fill="#666">两个栏都空 → 分数必须为 0</text></g></svg>`, caption: `同一批数据两次落盘：贵的那步放在最后，省下的都是真实分钟数` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `回答「这家对带小孩的家庭是不是比对商务客更差」：8 个 0/1 列分别和分数求均值`,
    `给每家酒店一个差评文本本身有多负面的分，区分分低话不多和分低且骂得狠`,
    `按城市看情感分与评分的分歧集中在哪，找出词典法最不灵的那类文本`
  ] },
  { t: `h2`, text: `演示 1 · 换汇总、压地址，把不可信的列就地覆盖` },
  { t: `code`, lang: `python`, code: `CITY = [("Netherlands", "Amsterdam, Netherlands"), ("Barcelona", "Barcelona, Spain"),\n        ("United Kingdom", "London, United Kingdom"), ("Milan", "Milan, Italy"),\n        ("France", "Paris, France"), ("Vienna", "Vienna, Austria")]\ndef short_addr(row):\n    for key, city in CITY:\n        if key in row["Hotel_Address"]:\n            return city\ndf["Hotel_Address"] = df.apply(short_addr, axis=1)\nprint(df["Hotel_Address"].value_counts().sum(), len(df))          # 这两个数必须相等\ndf["Total_Number_of_Reviews"] = df.groupby("Hotel_Name").transform("count")["Hotel_Name"]\ndf["Average_Score"] = round(df.groupby("Hotel_Name").Reviewer_Score.transform("mean"), 1)\ndf.drop(["lat", "lng", "Additional_Number_of_Scoring"], axis=1, inplace=True)` },
  { t: `p`, text: `两处要盯。一，short_addr 六条分支全不命中时返回 None，那行地址变 NaN，而 value_counts().sum() 与 len(df) 相等就是它的检测器。二，两列汇总不是删掉而是覆盖——列名留着、值换成本表可追溯的那一份，下游代码不用改。` },
  { t: `h2`, text: `演示 2 · 把 Tags 从自由文本折成 8 个 0/1 列` },
  { t: `code`, lang: `python`, code: `df.Tags = df.Tags.str.strip("[']")\ndf.Tags = df.Tags.str.replace(" ', '", ",", regex=False)\nparts = df.Tags.str.split(",", expand=True)               # 每行 3 到 6 段\ncol = [parts[i].str.strip() for i in range(parts.shape[1])]\nfreq = pd.concat(col, axis=0).value_counts()\nprint(len(freq))                                          # 2428 个不同短语\nKEEP = ["Leisure trip", "Couple", "Solo traveler", "Business trip", "Group",\n        "Family with young children", "Family with older children", "With a pet"]\nfor t in KEEP:\n    df[t.replace(" ", "_")] = df.Tags.str.contains(t, regex=False).astype(int)` },
  { t: `p`, text: `判据只有对选酒店有没有用。留：旅行类型（Leisure trip、Business trip）、住客类型（Couple、Family with young children、With a pet）。扔：房型那一族（各家叫法不同、说的是同一件事）、提交设备（出现多但不说明好坏）、住几晚（硬关联住得久等于更满意，太牵强）。另外 Group 和 Travellers with friends 基本一回事，该合并成 67535 再建列。这 8 列就是把没有词表的自由文本折成模型能吃的形状。` },
  { t: `h2`, text: `演示 3 · 去停用词，3.3 秒换 6 倍时间` },
  { t: `code`, lang: `python`, code: `import time\nfrom nltk.corpus import stopwords\ncache = set(stopwords.words("english"))              # 必须先是集合，列表会慢十倍\ndef drop_stop(review):\n    return " ".join(w for w in review.split() if w not in cache)\nstart = time.time()\ndf.Negative_Review = df.Negative_Review.apply(drop_stop)\ndf.Positive_Review = df.Positive_Review.apply(drop_stop)\nprint(round(time.time() - start, 1))                 # 51 万行两列，约 3.3 秒` },
  { t: `p`, text: `停用词是 those、the、with 这类不改变语气的词，删了不丢情感却把文本变短：最长那条负面评论从 395 词缩到 195 词，实测 12 到 14 分钟降到约 120 秒。两个工程坑：stopwords.words 返回列表，逐词 in 是线性扫描，先转 set 才是常数查找；跑之前要先 download 两份语料，否则报错发生在几十分钟之后。` },
  { t: `h2`, text: `演示 4 · VADER 打分，然后排序人工核对` },
  { t: `code`, lang: `python`, code: `from nltk.sentiment.vader import SentimentIntensityAnalyzer\nsia = SentimentIntensityAnalyzer()\ndef score(review):\n    if review in ("No Negative", "No Positive"):\n        return 0                                        # 占位符不参与打分\n    return sia.polarity_scores(review)["compound"]       # -1 到 1\ndf["Negative_Sentiment"] = df.Negative_Review.apply(score)\ndf["Positive_Sentiment"] = df.Positive_Review.apply(score)\nsuspect = df[df.Negative_Sentiment > 0.5]` },
  { t: `p`, text: `VADER 是给社交媒体文本做的规则加词典模型，不是训练出的分类器：它认大写、认感叹号，所以 LOVED 和 loved 不一样。关键是最后一行——别看整体分布，按分数排序读两端：负面栏里 compound 大于 0.5 的，要么是反话，要么写串了栏位。对照 Reviewer_Score 就分清是谁的锅：给 9 分是负面栏里没有负面，合理；给 2.5 分就是打分器被骗了。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `地址归一漏了兜底分支，NaN 悄悄进 groupby，城市数看着对、行数不对`,
    `把 Tags 按位置硬当固定 5 段：真实是 3 到 6 段，统计出来的归属就错了`,
    `去停用词时把 not、no 也删掉——句子会反过来`,
    `忘了给 No Negative / No Positive 返回 0：12 万行的分数分布被这批假样本拖着走`,
    `只统计情感分均值就下结论，不按两端排序读几条：词典法的错全藏在极端样本里`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `对演示 2 的 8 个 0/1 列分别求 Reviewer_Score 均值，挑一家亲子客群明显比商务客群不满的酒店，说明样本量够不够`,
    `把 suspect 阈值改成 0.8，读前 20 条文本，分成反讽、写串栏、真没负面三类，各给一个例子`,
    `删掉演示 3 只跑演示 4，记录耗时与两个情感列的相关系数变化，判断这 3.3 秒值不值`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：文本任务的工程量不在模型而在转换——覆盖不可信的列、把自由文本折成 0/1、把正文砍到只剩带语气的词。` }
];
