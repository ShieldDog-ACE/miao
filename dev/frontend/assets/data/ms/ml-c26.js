window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["ml-c26"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把前面二十几课学的技术对回真实行业，并说清一件前面没细讲的事——模型上线之后，靠哪些信号发现它坏了。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `业界热度多在深度学习上，但经典模型并没有退出：它们便宜、快、能解释，很多问题的形状本来就不需要网络。这门课的技术在真实系统里的落点，几乎都能在公开的工程分享里找到对应——下面那张图从金融的欺诈分层一直连到林业：山火本身被当成一个在景观格子上移动的 agent，那是强化学习的马尔可夫决策过程换了个主体。这些案例的共性不在算法，在失效方式，而失效信号高度一致：模型坏掉的时候，聚合指标往往还是好看的。欺诈只占万分之几，一个把所有交易都判为正常的模型准确率 99.99%；招聘模型在公司本身只有 27% 女性高管的数据上训练，整体分数很高、结果只投给男性。所以下面四个演示都不写怎么训一个模型——那是前二十课干过的事——写的是同一件事：怎么把「模型在骗你」变成一行可打印的数字。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#fbfbfd"/><text x="20" y="24" font-size="15" fill="#222">这门课的技术，在行业里接的是哪些活</text><g font-size="14" fill="#222"><rect x="20" y="40" width="140" height="26" rx="5" fill="#e8f0fb" stroke="#2471a3"/><text x="30" y="58">回归</text><rect x="20" y="76" width="140" height="26" rx="5" fill="#e8f0fb" stroke="#2471a3"/><text x="30" y="94">分类器</text><rect x="20" y="112" width="140" height="26" rx="5" fill="#e8f0fb" stroke="#2471a3"/><text x="30" y="130">K-均值聚类</text><rect x="20" y="148" width="140" height="26" rx="5" fill="#e8f0fb" stroke="#2471a3"/><text x="30" y="166">NLP 特征</text><rect x="20" y="184" width="140" height="26" rx="5" fill="#e8f0fb" stroke="#2471a3"/><text x="30" y="202">时间序列</text><rect x="20" y="220" width="140" height="26" rx="5" fill="#e8f0fb" stroke="#2471a3"/><text x="30" y="238">强化学习</text></g><g font-size="14" fill="#333"><rect x="380" y="40" width="240" height="22" rx="5" fill="#ffffff" stroke="#d8d8e3"/><text x="390" y="56">基金表现 · 多变量回归</text><rect x="380" y="68" width="240" height="22" rx="5" fill="#ffffff" stroke="#d8d8e3"/><text x="390" y="84">课程留存 / 出勤预测</text><rect x="380" y="96" width="240" height="22" rx="5" fill="#ffffff" stroke="#d8d8e3"/><text x="390" y="112">信用卡欺诈风险分层</text><rect x="380" y="124" width="240" height="22" rx="5" fill="#ffffff" stroke="#d8d8e3"/><text x="390" y="140">医院再入院分群</text><rect x="380" y="152" width="240" height="22" rx="5" fill="#ffffff" stroke="#d8d8e3"/><text x="390" y="168">客户分群 / 服装推荐</text><rect x="380" y="180" width="240" height="22" rx="5" fill="#ffffff" stroke="#d8d8e3"/><text x="390" y="196">假新闻检测</text><rect x="380" y="208" width="240" height="22" rx="5" fill="#ffffff" stroke="#d8d8e3"/><text x="390" y="224">疫情扩散 / 用电负荷</text><rect x="380" y="236" width="240" height="22" rx="5" fill="#ffffff" stroke="#d8d8e3"/><text x="390" y="252">山火蔓延（火当 agent）</text></g><g fill="none" stroke="#a0a0b0" stroke-width="1.4"><path d="M160 53 C270 53 270 51 378 51"/><path d="M160 53 C270 60 270 79 378 79"/><path d="M160 89 C270 89 270 191 378 191"/><path d="M160 125 C270 125 270 107 378 107"/><path d="M160 125 L378 135"/><path d="M160 125 C270 130 270 163 378 163"/><path d="M160 161 C270 161 270 191 378 191"/><path d="M160 197 L378 219"/><path d="M160 233 L378 247"/></g><text x="20" y="284" font-size="14" fill="#c0392b">每条连线上线后都要问同一句：这个指标在哪个人群、哪一段时间上先塌的</text></svg>`, caption: `技术到行业的对应关系不稀缺，稀缺的是每条对应关系后面那句「怎么知道它坏了」` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `用聚类把海量交易按像不像常规模式分档，把有限的人工复核预算压到最不寻常的那一档`,
    `用 NLP 特征加一组分类器，从文本里筛出可疑内容——但把命中率当成验收口径，而不是准确率`,
    `用时间序列给一个镇子算下一周的用电、给一座城市算下一周的感染量，同时盯着误差随时间爬升`
  ] },
  { t: `h2`, text: `演示 1 · 欺诈分层：准确率是最没用的那个数` },
  { t: `code`, lang: `python`, code: `km = KMeans(n_clusters=8, n_init=20, random_state=0).fit(Xs)\nd = km.transform(Xs).min(axis=1)              # 到最近质心的距离 = 有多不合群\nrisk = np.argsort(d)[::-1]\nprint(np.bincount(km.labels_, minlength=8))    # 各簇条数：欺诈那一簇小得看不见\nprint("前 500 单里的真欺诈率:", round(100 * y[risk[:500]].mean(), 2), "%")\nprint("全判正常模型的准确率:", round(100 * (1 - y.mean()), 2), "%")` },
  { t: `p`, text: `最后两行是本课的重点：欺诈占比是万分之几时，「什么都不拦」的那个模型准确率比大多数分类器都高，而它一分钱价值都没有。能被验收的只有一件事：给定复核预算（前 500 单）里捞到多少真欺诈。更隐蔽的是标签往往不是「这笔是不是欺诈」，而是「这笔有没有被举报、被人工判定」，所以模型学到的是自家审查流程的形状，还会形成回路：被判高风险的多查、多查出问题、标签更多，看起来越来越准。这条回路在第 3 课的公平性里叫偏差，在这里叫业务风险。` },
  { t: `h2`, text: `演示 2 · 假新闻：五个分类器同台，换一个评估口径` },
  { t: `code`, lang: `python`, code: `from sklearn.feature_extraction.text import TfidfVectorizer\nvec = TfidfVectorizer(ngram_range=(1, 2), max_features=50000)\nX = vec.fit_transform(text)\ncands = [("NB", MultinomialNB()), ("LR", LogisticRegression(max_iter=2000)),\n         ("SVM", LinearSVC()), ("RF", RandomForestClassifier(n_estimators=200))]\nfor name, clf in cands:\n    sc = cross_val_score(clf, X, y, cv=5, scoring="f1")\n    print(name, sc.mean().round(3), sc.std().round(3))` },
  { t: `p`, text: `这类论文的路线就是把 NLP 抽出的特征喂给一组经典分类器，挑一个部署——这门课的分类、NLP 两组合起来正是它。要盯的是三件事：scoring 用 f1 而不是 accuracy；cv 各折之间的方差（那个 std）比均值更能说明你挑的是不是运气；以及假新闻的特征主要是传播写法和模板，模板一个季度换一次，离线 0.93 的模型对新剧本可能只有 0.6——上线后信号的形态不是分数掉了，是你测不到它掉。` },
  { t: `h2`, text: `演示 3 · 分群画像：分析师从这张表开始找共同原因` },
  { t: `code`, lang: `python`, code: `tbl = pd.DataFrame({"seg": km.labels_, "readmit": y, "los": length_of_stay}).groupby("seg").agg(\n    n=("readmit", "size"), rate=("readmit", "mean"), avg_los=("los", "mean"))\nprint(tbl.sort_values("rate", ascending=False))\nprint("各群占比:", (tbl["n"] / tbl["n"].sum()).round(3).to_list())` },
  { t: `p`, text: `聚类在医疗和营销里的用法都是这一张表：把再入院、复购、流失按人群分开，让领域专家去看「这一群共同的原因是什么」。信号藏在最后一行：某一簇只占 0.3% 的样本，它的 rate 就是十几个人算出来的，既不能当结论，也不该被自动策略引用；反过来，两簇 rate 差不多、平均住院日却差很多，说明你把一个业务人群切碎了，k 定大了。` },
  { t: `h2`, text: `演示 4 · 预测上线：盯滚动误差，不盯一次性分数` },
  { t: `code`, lang: `python`, code: `ape = (y_true - y_pred).abs() / y_true * 100\nweekly = ape.rolling(24 * 7).mean()            # 小时级数据，一周一个点\nprint("训练期基线:", round(ape.iloc[:len(ape) // 2].mean(), 2))\nprint("最近四周:", weekly.tail(4).round(2).to_list())\nprint("输入漂移:", round(Xs[-7 * 24:].mean() - Xs[:7 * 24].mean(), 3))` },
  { t: `p`, text: `第 21 课立的那条照抄基线在这里继续有效：滚动 MAPE 一旦爬过「基线加一倍」这条线，就要动手。关键是分辨两种原因——模型坏（管道出错、单位变了、上游缺数）和世界变（换季、封控、新政策）。区分靠最后一行：输入分布自己动了没有。输入没动而误差涨了，先查管道；输入也涨了，重训只是把延迟缩短，真正该做的是承认这段时期不该用这一条模型。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `拿聚合准确率做验收：极不平衡的数据上，什么都不做的那个方案分数最高`,
    `把标签当成事实：欺诈标签来自审查、留存标签来自平台埋点，模型学的是这套流程而不是这个世界`,
    `让预测参与生成自己的训练数据（高风险 → 多查 → 多命中），半年后分不清是它在预警还是它在制造预警`,
    `离线指标和在线结果之间没有桥：没有延迟标签的对账，就没人知道模型什么时候开始不准`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `给手上任何一份数据造一个「什么都不做」的基线（全预测多数类 / 照抄上一个值），算出它的准确率或 MAPE，用它评一遍你做过的某个模型`,
    `把演示 1 的复核预算从 500 单改成 100、500、2000 三档，画出真欺诈命中数随预算的曲线，并说明这条曲线在业务上叫什么`,
    `用演示 3 的思路给上一课的聚类结果做一张分群表，找出占比最小的那一簇，说明为什么不该给它配自动策略`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：真实世界里模型不是「准不准」，而是「在哪个人群、哪一段时间、被谁使用」——聚合指标是最后一道掩盖问题的幕布。` }
];
