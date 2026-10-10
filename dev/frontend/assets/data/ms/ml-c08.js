window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["ml-c08"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把「逻辑回归」从它的名字里救出来——它算的是概率，罚的是交叉熵而不是平方误差；再用老熟悉的南瓜数据把编码、训练、混淆矩阵和 ROC 走一遍。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `上一课线性回归猜的是价格，一个能无限细分的数。这一课要猜的是颜色：橙，或者不橙。答案只有两个，本来该归到分类里去，教材却把它塞在回归这一组，原文自己也承认这纯属编排上的方便。名字带「回归」，输出的是一个概率，不是数量。` },
  { t: `p`, text: `直接把 0 和 1 当成数值去最小二乘，会撞上两件事。一是那条直线不肯停在 0 到 1 之间，样本一推就伸出去，predict 回你 1.4、-0.3 这种「概率」；二是平方误差对越界和对微小偏差的罚法一样平，模型没动力把边界附近那些最难分的样本推对。换成概率就顺了：模型先给一个任意实数 z，也就是「证据积了多少」，再由 sigmoid 把 z 折进 0 到 1，折出来的就是属于白南瓜的概率。z=0 折到 0.5，z 越大越贴 1、越小越贴 0；判类时把 0.5 当刀口。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 270" font-family="sans-serif"><rect width="640" height="270" fill="#fbfbfd"/><g stroke="#dcdce6" stroke-width="1"><line x1="30" y1="60" x2="290" y2="60"/><line x1="30" y1="182" x2="290" y2="182"/><line x1="350" y1="60" x2="620" y2="60"/><line x1="350" y1="182" x2="620" y2="182"/></g><g stroke="#2471a3" stroke-width="2.5" fill="none"><line x1="38" y1="196" x2="286" y2="34"/></g><g fill="#c0392b"><circle cx="80" cy="182" r="5"/><circle cx="120" cy="182" r="5"/><circle cx="160" cy="182" r="5"/><circle cx="215" cy="182" r="5"/></g><g fill="#e67e22"><circle cx="105" cy="60" r="5"/><circle cx="175" cy="60" r="5"/><circle cx="240" cy="60" r="5"/></g><g stroke="#c0392b" stroke-width="1.5" stroke-dasharray="5 4" fill="none"><line x1="240" y1="34" x2="286" y2="34"/><line x1="38" y1="196" x2="80" y2="196"/></g><g stroke="#2471a3" stroke-width="2.5" fill="none"><path d="M355,181 C415,181 455,160 490,121 C525,82 565,61 625,61"/></g><g stroke="#6b6b7b" stroke-width="1.5" stroke-dasharray="5 4" fill="none"><line x1="350" y1="121" x2="620" y2="121"/></g><g font-size="14" fill="#333"><text x="30" y="52">1（是）</text><text x="30" y="212">0（不是）</text><text x="350" y="52">概率 1</text><text x="350" y="212">概率 0</text><text x="628" y="126" text-anchor="end" fill="#6b6b7b">0.5 刀口</text></g><g font-size="15" fill="#222" text-anchor="middle"><text x="160" y="240">最小二乘的直线：不肯停</text><text x="487" y="240">sigmoid：折进 0 到 1</text></g><text x="250" y="24" font-size="14" fill="#c0392b">predict 出 1.4 / -0.3</text><text x="360" y="24" font-size="14" fill="#2471a3">z 再大也只到 1</text><text x="320" y="264" font-size="14" fill="#666" text-anchor="middle">同一个 z：左边量距离，右边报信心</text></svg>`, caption: `同一条证据 z：直线外推出界，sigmoid 把它压成一个概率` },
  { t: `p`, text: `训练时也不再最小化平方误差，而是最大化「模型说对的概率」，等价于最小化交叉熵。单个样本的罚是 -ln(那个正确概率)：确实是白南瓜、模型给 0.99，罚约 0.01；给 0.01，罚约 4.6。这就是和 MSE 的分水岭——平方误差量的是距离，交叉熵量的是信心，越自信地错罚得越狠。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `给出概率而不只给标签，于是刀口可以按代价挪，不锁定在 0.5`,
    `特征之间不必相关——这点跟线性回归正好相反，相关太弱的数据它照吃`,
    `扩展到多类：multinomial 管「橙/白/条纹」并列，ordinal 管有先后次序的档`,
    `反过来读系数：符号告诉你哪个特征把「白」的概率往上推`
  ] },
  { t: `h2`, text: `演示 1 · 先把文字列换成数` },
  { t: `code`, lang: `python`, code: `from sklearn.preprocessing import OrdinalEncoder, OneHotEncoder, LabelEncoder\nfrom sklearn.compose import ColumnTransformer\n\nord_enc = OrdinalEncoder(categories=[["sml", "med", "med-lge", "lge", "xlge", "jbo", "exjbo"]])\noh_enc = OneHotEncoder(sparse_output=False)\nct = ColumnTransformer([("ord", ord_enc, ["Item Size"]),\n                        ("oh", oh_enc, ["City Name", "Package", "Variety", "Origin"])])\nct.set_output(transform="pandas")\nencoded = ct.fit_transform(pumpkins)\nlabel = LabelEncoder().fit_transform(pumpkins["Color"])   # 折成 0 / 1` },
  { t: `p`, text: `有先后次序的列（尺码）走 ordinal，一档一个数，把大小留在数轴上；没大小的列（产地、品种）走 one-hot，一个类别一根 0/1 柱。要是按字母顺序把品种也编成 1、2、3，模型会以为品种 3 比品种 1「大」，凭空学出一条不存在的次序。标签那一侧用 LabelEncoder，把 ORANGE、WHITE 压成 0 和 1，刚好落在 0 到 n_classes-1。` },
  { t: `h2`, text: `演示 2 · 训练，然后读那张记分表` },
  { t: `code`, lang: `python`, code: `from sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import classification_report, confusion_matrix\n\nX = encoded[encoded.columns.difference(["Color"])]\ny = encoded["Color"]\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=0)\n\nmodel = LogisticRegression().fit(X_tr, y_tr)\npred = model.predict(X_te)\nprint(classification_report(y_te, pred))\nprint(confusion_matrix(y_te, pred))   # [[162, 4], [11, 22]]` },
  { t: `p`, text: `accuracy 0.92 看着漂亮，混淆矩阵才说实话：199 个测试样本里白南瓜只有 33 个，模型漏了 11 个把白判成橙，于是 precision 0.85、recall 0.67。轴别记反——sklearn 的第 0 轴是真实标签、第 1 轴是预测标签，左上真负、右上假正、左下假负、右下真正。反推一下：precision = 22/26、recall = 22/33。` },
  { t: `h2`, text: `演示 3 · 把刀口从 0.5 挪开` },
  { t: `code`, lang: `python`, code: `from sklearn.metrics import roc_curve, roc_auc_score\n\nproba = model.predict_proba(X_te)[:, 1]\nfpr, tpr, thr = roc_curve(y_te, proba)\nprint("AUC =", round(roc_auc_score(y_te, proba), 3))\n\nloose = (proba >= 0.3).astype(int)      # 宁可多报，不愿漏报\nprint(confusion_matrix(y_te, loose))` },
  { t: `p`, text: `predict 把 0.5 写死在接口里，predict_proba 才是模型的真心话。ROC 沿一堆阈值扫过去，每个点是一对（假正率，真正率）；AUC 是曲线下面那块面积，原文这一跑 0.975，读作：随手抓一白一橙两只，模型给白南瓜打出更高分的概率是 97.5%。它跟刀口选在哪无关，所以比 accuracy 稳。漏报白南瓜代价高就把阈值压低，换来的是假正变多。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `拿 MSE、R2 去评它：它交的是概率，这些量距离的指标在这问不出东西`,
    `以为「回归」就得喂相关变量：逻辑回归相反，不相关也照跑，但也照收噪声，不会帮你筛`,
    `类别列直接塞字符串，或按字母序编码，把并列类别编出了假的次序`,
    `数据太少就下场：这一族方法吃数据，原文一千行南瓜只是刚好能出结果`,
    `只看 accuracy：这种不平衡程度下全猜「不是白」也有八成多，得回去看 recall 和矩阵左下格`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把演示 2 的 random_state 换五个值各跑一次，记下混淆矩阵四个数哪个最飘，说说为什么`,
    `打印 model.coef_ 并对上列名，挑出绝对值最大的三个特征，判断它们把「白」往上推还是往下压`,
    `把 Item Size 从 ordinal 换成 one-hot 再跑一次，比较 recall 变了没有，给出你的解释`,
    `用演示 3 扫一遍 0.2 到 0.8 的阈值，列成「阈值对左下格漏报数」的表，选一个你真愿意用的刀口并说明代价`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：逻辑回归是穿着回归外衣的分类器——它报的是概率，罚的是信心，判的是 0.5 这把随时能挪的刀。` }
];
