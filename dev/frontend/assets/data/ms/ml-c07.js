window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["ml-c07"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把最小二乘那条线跑通，看懂 coef、RMSE、R 方各说什么，以及什么时候该怪特征而不是怪算法。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `最小二乘在算的事很具体：每个点量一条竖直距离（残差），全部平方后加起来，再找一条让这个和最小的直线 Y = a + bX。平方有两个理由：-5 和 +5 一样糟，平方把它们都变正数；平方放大远点的误差，逼线往它们那边靠。b 是斜率，a 是截距，也就是 X 为 0 时 Y 的值——在这组南瓜数据里 X 是一年中的第几天，Y 是每桶价。` },
  { t: `p`, text: `线好不好，看两个数。RMSE 是均方根误差，跟目标同一个单位，直接读成"平均差几块钱"；R 方是决定系数，0 表示这模型等于只会报均值（原文叫它 worst linear predictor），1 表示全说中。相关系数是同一件事的另一面：散点排成一条线就高，糊成一团就低。` },
  { t: `p`, text: `sklearn 这边两条形状约定：X 必须二维，只有一个特征也要 reshape 成 N 行 1 列，喂一维直接报错；学到的东西放在 coef_ 和 intercept_ 上。多项式回归不是换模型，是换列——PolynomialFeatures(2) 造出 X 的平方，模型还是那条"直线"，回到原始坐标里才看成弯的。make_pipeline 把造列和拟合串成一步，predict 时自动照同样方式造列。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 244"><text x="14" y="20" font-size="15" fill="#0f172a">最小二乘在量的就是这些竖线</text><line x1="60" y1="200" x2="470" y2="200" stroke="#94a3b8" stroke-width="2"/><line x1="60" y1="200" x2="60" y2="40" stroke="#94a3b8" stroke-width="2"/><text x="466" y="220" font-size="14" fill="#475569">一年中的第几天</text><text x="14" y="34" font-size="14" fill="#475569">每桶价</text><line x1="70" y1="180" x2="450" y2="92" stroke="#1d4ed8" stroke-width="3"/><g stroke="#dc2626" stroke-width="1.6" stroke-dasharray="4 3"><line x1="120" y1="170" x2="120" y2="166"/><line x1="180" y1="150" x2="180" y2="152"/><line x1="240" y1="188" x2="240" y2="138"/><line x1="300" y1="118" x2="300" y2="124"/><line x1="360" y1="96" x2="360" y2="110"/><line x1="420" y1="142" x2="420" y2="96"/></g><g fill="#0f172a"><circle cx="120" cy="170" r="4"/><circle cx="180" cy="150" r="4"/><circle cx="240" cy="188" r="4"/><circle cx="300" cy="118" r="4"/><circle cx="360" cy="96" r="4"/><circle cx="420" cy="142" r="4"/></g><text x="248" y="172" font-size="14" fill="#b91c1c">残差</text><text x="70" y="232" font-size="14" fill="#0f172a">a = 21.06（1 月 1 日的价）</text><text x="290" y="232" font-size="14" fill="#0f172a">b = -0.018（每天跌不到 2 分）</text><text x="486" y="60" font-size="14" fill="#334155">把这 6 段竖直距离</text><text x="486" y="80" font-size="14" fill="#334155">平方相加，调 a 和 b</text><text x="486" y="100" font-size="14" fill="#334155">让它最小</text><text x="486" y="130" font-size="14" fill="#b91c1c">远的那两段被平方</text><text x="486" y="150" font-size="14" fill="#b91c1c">放大，线被拽过去</text></svg>`, caption: `残差是竖直的：平方后求和，最小的那组 a、b 就是模型` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `给出一条能读出来的斜率：一天跌 1.8 分`,
    `把多个特征拉进同一条线，看谁贡献大：品种、城市、包装都能当输入`,
    `加二次项之后能回答"一年里哪天最便宜"这类有拐点的问题`,
    `当基线：任何更复杂的模型，先跟一条直线比过才有资格谈效果`
  ] },
  { t: `h2`, text: `演示 1 · 先确认有没有直线关系` },
  { t: `code`, lang: `python`, code: `import pandas as pd\nprint(round(df["Month"].corr(df["Price"]), 3))        # -0.149\nprint(round(df["DayOfYear"].corr(df["Price"]), 3))    # -0.167\nprint(df.groupby("Variety")["Price"].mean().round(2).sort_values().to_dict())\n# {PIE TYPE: 15.86, MIXED HEIRLOOM: 18.0, FAIRYTALE: 31.0, MINIATURE: 34.12}` },
  { t: `p`, text: `df 是第 6 课洗完的那张表。日期跟价格几乎没关系，换成"第几天"也没救回来（-0.149 → -0.167）；倒是品种一列差得吓人：派型 15.86 一桶、迷你型 34.12。结论在这一步就该下：影响价格的是品种，不是卖的那天。` },
  { t: `h2`, text: `演示 2 · 一条直线的三个数` },
  { t: `code`, lang: `python`, code: `import numpy as np\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import mean_squared_error\nfrom sklearn.model_selection import train_test_split\npie = df[df["Variety"] == "PIE TYPE"].dropna()         # 只留一个品种\nX = pie["DayOfYear"].to_numpy().reshape(-1, 1)         # 必须二维\ny = pie["Price"]\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=0)\nlin = LinearRegression().fit(Xtr, ytr)\nprint(round(lin.coef_[0], 3), round(lin.intercept_, 2))          # -0.018  21.06\nprint(round(np.sqrt(mean_squared_error(yte, lin.predict(Xte))), 2))   # 2.76\nprint(round(lin.score(Xtr, ytr), 3), round(lin.score(Xte, yte), 3))   # 0.045  0.102` },
  { t: `p`, text: `斜率 -0.018 是一年过一天每桶便宜不到两美分，截距 21.06 是年初的价。RMSE 2.76 读成"平均差两块七"，相对 15.86 的均价是 17%。R 方才是判决：训练集 0.045，连"报均值"这个最笨的办法都没打赢。这不是拟合技术不行，是这个 X 本来就没话说。` },
  { t: `h2`, text: `演示 3 · 加个弯 vs 换个变量` },
  { t: `code`, lang: `python`, code: `from sklearn.preprocessing import PolynomialFeatures\nfrom sklearn.pipeline import make_pipeline\npoly = make_pipeline(PolynomialFeatures(2), LinearRegression()).fit(Xtr, ytr)\nD = pd.get_dummies(pie[["Variety", "City", "Package"]]).astype(float)\nA, B, C, E = train_test_split(D, y, test_size=0.2, random_state=0)\ncat1 = LinearRegression().fit(A, C)\ncat2 = make_pipeline(PolynomialFeatures(2), LinearRegression()).fit(A, C)\nfor tag, m, xx, yy in (("同样变量+弯", poly, Xte, yte), ("换成类别列", cat1, B, E),\n                       ("类别列+弯", cat2, B, E)):\n    pr = m.predict(xx)\n    print(tag, round(np.sqrt(mean_squared_error(yy, pr)), 2), round(m.score(xx, yy), 3))\n# 同样变量+弯 2.73 0.126  换成类别列 2.27 0.394  类别列+弯 2.17 0.448` },
  { t: `p`, text: `第一行是"给烂变量加复杂度"：弯了之后 RMSE 从 2.76 到 2.73，R 方 0.126，等于没动。第二行只换列——品种、城市、包装摊成 13 个 0/1 列，什么都没调，R 方就到 0.394；第三行再弯一次，0.448。第 4 课那句"选训练方法要大量实验"，最省钱的读法就是这个顺序：先换信息源，再动复杂度。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `把一维数组喂给 fit：报的是形状错，容易被误读成"数据太少"`,
    `拿 R 方 0.045 的模型去预测：它的输出和报平均数没区别，只是多了一层神秘`,
    `把训练集上的 score 当成绩：演示 2 里 0.045 和 0.102 都不高，但两个数口径完全不同`,
    `one-hot 之后随手就上多项式：13 列会被展开成 105 列，样本才 144 条`,
    `不同品种混在一起拟合：均价差一倍的几群点，拟出来那条斜率谁都不代表`,
    `dropna 前没看空在哪列：回归不吃缺失值，但别顺手删掉目标列`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把演示 2 的 X 从 DayOfYear 换成 Low Price，看三个数变成多少，再说明为什么这个结果不能上线（提示：想想这两列是什么关系）`,
    `换成 FAIRYTALE 或 MINIATURE 重跑演示 2，比较三个品种的 R 方，说出哪个品种的价格最可预测`,
    `用演示 3 那个带弯的模型在 1 到 365 上逐天 predict，找出最低点那天，说明为什么不能拿它估 1 月的价`,
    `把 Month 加回演示 3 的 D 里再跑一遍，看 RMSE 掉到多少，解释为什么加"月份"有用而"第几天"没用`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：最小二乘只负责把线放到最公平的位置，这条线值不值钱由你给它的那几列决定——R 方 0.045 不是拟合失败，是那个变量没话说。` }
];
