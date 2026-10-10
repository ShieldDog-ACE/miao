window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["ml-c19"] = [
  { t: `tip`, color: `blue`, text: `本课目标：在动任何 NLP 代码之前，先把 51.5 万条酒店评论摸清楚——哪些列能用、哪些列自己跟自己都对不上、哪些列的默认值会把你骗过去。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `数据是 515K Hotel Reviews Data in Europe，CC0 公有领域，515738 行、17 列，覆盖 6 座城市的 1493 家酒店。本课一行情感分析都不写，只做一件事：把 17 列分成四组，逐组问它在说什么、值不值得信——文本数据的坑不在缺失值和类型上，在字段含义上。四组可信度差别很大：酒店组（Hotel_Name、lat、lng）干净，经纬度能画地图；评论组是主力，Reviewer_Score 是 2.5 到 10、最多一位小数，两个正文列是自然语言，两个字数列是现成的长度特征，days_since_review 提供新鲜度；汇总组（Average_Score 等三列）看着方便，实际对不上账；人群组（Reviewer_Nationality 等）看着最诱人，也最危险。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#fbfbfd"/><text x="20" y="28" font-size="15" fill="#222">同一列数字，两种算法对不上的地方</text><g font-size="14" fill="#333"><text x="20" y="62">数据集写的 Total_Number_of_Reviews</text><text x="20" y="98">这份数据里真实数出来的评论</text><text x="20" y="134">只给分没写字的 Additional_Number_of_Scoring</text></g><rect x="330" y="48" width="260" height="18" rx="3" fill="#c0392b"/><rect x="330" y="84" width="137" height="18" rx="3" fill="#2471a3"/><rect x="330" y="120" width="77" height="18" rx="3" fill="#1e8449"/><g font-size="14" fill="#222"><text x="596" y="62" text-anchor="end" fill="#fff">9086</text><text x="474" y="98">4789</text><text x="414" y="134">2682</text></g><text x="20" y="170" font-size="14" fill="#c0392b">4789 加 2682 等于 7471，离 9086 还差 1615 条——这 1615 条不在你手上</text><text x="20" y="196" font-size="14" fill="#333">另一处：Average_Score 说这家 7.1，用本数据集的分数算出来 6.8</text><text x="20" y="230" font-size="14" fill="#666">结论不是「数据脏」，而是这三列引用了你没拿到的数据 → 弃用，改自算</text><rect x="20" y="248" width="600" height="1" fill="#d8d8e3"/><text x="20" y="278" font-size="14" fill="#333">127 行同时写着 No Negative 和 No Positive：打了分，一个字没写</text></svg>`, caption: `先算账再用列：缺口 1615 条就是不能信的证据` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `用 lat 与 lng 画城市地图按分数上色，看差评是不是扎堆在同一片区`,
    `不读正文，只用字数列分出「写了很长差评」和「只打个分」两类人`,
    `按 Tags 的住客类型分层，比较同一酒店的亲子客群和商务客群谁更不满`
  ] },
  { t: `h2`, text: `演示 1 · 加载，然后别急着看正文` },
  { t: `code`, lang: `python`, code: `import pandas as pd\nimport time\nstart = time.time()\ndf = pd.read_csv("../../data/Hotel_Reviews.csv")      # 约 230 MB\nprint(df.shape, round(time.time() - start, 1))       # (515738, 17)\nprint(df["Reviewer_Nationality"].nunique(), df["Reviewer_Nationality"].value_counts().index[0])\nprint(df["Hotel_Name"].nunique())                    # 1493 家` },
  { t: `p`, text: `先打印三个数：行数、国籍种数、酒店数。国籍 227 种、最上面是英国 245246 条——一份欧洲酒店评价里近一半来自一个国家，意味着后面任何按国籍分组的结论只在样本厚的地方成立。数据集号称已清洗过，但号称要用代码核对，不是默认。` },
  { t: `h2`, text: `演示 2 · 把自带的汇总数字和自己算的对账` },
  { t: `code`, lang: `python`, code: `df["Calc_Average_Score"] = round(df.groupby("Hotel_Name").Reviewer_Score.transform("mean"), 1)\ndf["Diff"] = df["Average_Score"] - df["Calc_Average_Score"]\none = df.drop_duplicates("Hotel_Name").sort_values("Diff")\nprint(one[["Diff", "Average_Score", "Calc_Average_Score", "Hotel_Name"]].tail(3))\nprint(df["Hotel_Name"].value_counts().index[0])       # Britannia International Hotel` },
  { t: `p`, text: `多数酒店两个分数只差零点几，最大一档差到 1.3（写 7.2、算出 5.9），方向还不一致。一家对得上、一家差 1.3，你无法判断是巧合还是这批汇总列本就是另一种口径。能确认的只有：自己 groupby 的分数每一分都能追溯到本表——所以后面一律用自算值，两张汇总列弃用。` },
  { t: `h2`, text: `演示 3 · 默认值不是空值，两种写法差 50 倍` },
  { t: `code`, lang: `python`, code: `start = time.time()\nm = df.apply(lambda x: x["Negative_Review"] == "No Negative", axis=1)\nprint(len(m[m]), round(time.time() - start, 2))      # 127890 条，9.64 秒\nstart = time.time()\nno_neg = sum(df.Negative_Review == "No Negative")\nno_pos = sum(df["Positive_Review"] == "No Positive")\nboth = sum((df.Negative_Review == "No Negative") & (df.Positive_Review == "No Positive"))\nprint(no_neg, no_pos, both, round(time.time() - start, 2))   # 0.19 秒` },
  { t: `p`, text: `业务上：127890 行负面栏写 No Negative，35946 行正面栏写 No Positive，还有 127 行两边都空——你不会预期评论数据集里有没写评论的评论行，这些是只打分不写字的样本，进情感分析必须显式处理，否则 No Negative 这两个否定词会被句子级打分当正面。工程上：同一件事逐行 apply 要 9.64 秒，向量化相加 0.19 秒，而这循环后面要跑很多遍。` },
  { t: `h2`, text: `演示 4 · Tags：看着能分类，其实是自由文本` },
  { t: `code`, lang: `python`, code: `print(df["Tags"].nunique())                          # 组合上千，光「团体类型」就 1025 种\nprint(df["Tags"].str.contains("Family").sum())       # 会一起捞进 Family room 这种房型\nprint(df["Tags"].str.contains("Family with").sum())  # 八万多条才是真「带孩子出行」\nprint(df["Tags"].dropna().iloc[0])                   # 逗号分隔 5 到 6 个值，顺序还不固定` },
  { t: `p`, text: `Tags 设计的字段是旅行类型、住客类型、房型、住几晚、提交设备，但有人漏填，值就不按顺序排；也没有词表——这家写 Single room，下家写 Deluxe Single Room。想把 Superior Queen Room with Courtyard Garden 归进标准类别得人工定映射，做不动。取舍很直白：退回统计某个词的频次、按酒店分别算。筛 Family with 而不是 Family 就是这个理由。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `把 No Negative / No Positive 当空值丢掉或当正文喂进打分器：它们是占位文本，含否定词`,
    `相信 Negative_Review 里全是负面：有人在那栏写 nothing bad about this hotel，2.5 分的人还会在正面栏写 Nothing Terrible place Stay away`,
    `把 Reviewer_Nationality 当特征：国籍刻板印象写进模型，第 3 课的公平性问题在这里直接复现`,
    `为满足好奇心去通读差评：这批文本里有种族主义和性别歧视内容，让代码去量，不必让人去读`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `列出你会保留和丢弃的列，各写一句理由；再用代码证明 Total_Number_of_Reviews 至少对三家酒店对不上账`,
    `算出 No Negative、No Positive、两者皆空三种情况的行数与占比，说明下一课怎么处理那 127 行`,
    `按 days_since_review 分箱，比较各箱的 Reviewer_Score 均值与负面字数，看新鲜度有没有信号`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：这份数据的坑不在脏，在「字段说的和你想的不是一回事」——先算账、先数占位符、先给每列一句用途，再让模型上场。` }
];
