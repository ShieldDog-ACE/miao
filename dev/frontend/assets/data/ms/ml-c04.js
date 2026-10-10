window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["ml-c04"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把建模那七步走顺，并能一眼认出欠拟合和过拟合长什么样。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `第一步不是选算法，是判断该不该用机器学习。标准很实在：这个问题能不能写成一段条件程序或规则引擎。能，就别用——规则更快、能解释、改一条不用重训。原文的例子是精算：吸烟与不吸烟的死亡率，人写几条规则还应付得来；可一旦把十几项病史一起拉进来，规则就拼不动了，这时候模型才划算。` },
  { t: `p`, text: `七步是：定问题 → 取数与备料 → 选训练方法 → 训练 → 评估 → 调参 → 预测。别把它当流水线读，第六步调参是拿第五步的分数回去改第二、三步，所以它是个圈，要转很多轮。术语上：特征是能被量化的列（日期、尺寸、颜色），代码里叫 X；目标是你想猜的那一列（12 月哪种颜色的南瓜最便宜、哪个街区房价最贵），叫 y，有时也叫 label。` },
  { t: `p`, text: `选哪些列进 X 有两条路，原文特意分开：特征选择（selection）是从原有列里挑一个子集，特征抽取（extraction）是拿原列算出新的列。备料阶段还包含切分：训练集占大头用来 fit，测试集是独立的一组，用来确认这个模型到底行不行，验证集更小，专门用来调超参数。数据少的时候验证集可以省。` },
  { t: `p`, text: `拟合有三种状态。欠拟合是模型连训练集都没解释清楚，说明它太简单，换更复杂的方法才有意义；过拟合是训练集近乎满分、测试集崩盘，它把细节和噪声一起背了下来；中间那个"刚好"不是靠感觉挑的，是靠训练误差和测试误差之间那道缝多宽来定的。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 252"><text x="14" y="20" font-size="15" fill="#0f172a">同一批点、同一条波，只改多项式阶数</text><rect x="12" y="30" width="200" height="160" rx="6" fill="#f8fafc" stroke="#cbd5e1"/><rect x="222" y="30" width="200" height="160" rx="6" fill="#f8fafc" stroke="#cbd5e1"/><rect x="432" y="30" width="200" height="160" rx="6" fill="#f8fafc" stroke="#cbd5e1"/><path d="M20,150 L204,72" fill="none" stroke="#dc2626" stroke-width="2.5"/><path d="M230,74 Q255,130 268,118 T293,160 T318,196 T343,150 T368,96 T393,70 T414,86" fill="none" stroke="#16a34a" stroke-width="2.5" transform="translate(0,-42)"/><path d="M440,66 Q452,150 462,104 T480,166 T498,96 T516,172 T534,104 T552,160 T570,86 T588,140 T606,90" fill="none" stroke="#dc2626" stroke-width="2.2" transform="translate(0,-24)"/><g fill="#1e293b"><circle cx="27" cy="72" r="3.5"/><circle cx="52" cy="112" r="3.5"/><circle cx="77" cy="152" r="3.5"/><circle cx="102" cy="172" r="3.5"/><circle cx="127" cy="150" r="3.5"/><circle cx="152" cy="108" r="3.5"/><circle cx="177" cy="78" r="3.5"/><circle cx="202" cy="66" r="3.5"/></g><g fill="#1e293b" transform="translate(210,0)"><circle cx="27" cy="72" r="3.5"/><circle cx="52" cy="112" r="3.5"/><circle cx="77" cy="152" r="3.5"/><circle cx="102" cy="172" r="3.5"/><circle cx="127" cy="150" r="3.5"/><circle cx="152" cy="108" r="3.5"/><circle cx="177" cy="78" r="3.5"/><circle cx="202" cy="66" r="3.5"/></g><g fill="#1e293b" transform="translate(420,0)"><circle cx="27" cy="72" r="3.5"/><circle cx="52" cy="112" r="3.5"/><circle cx="77" cy="152" r="3.5"/><circle cx="102" cy="172" r="3.5"/><circle cx="127" cy="150" r="3.5"/><circle cx="152" cy="108" r="3.5"/><circle cx="177" cy="78" r="3.5"/><circle cx="202" cy="66" r="3.5"/></g><text x="112" y="210" font-size="14" text-anchor="middle" fill="#b91c1c">阶数 1 · 欠拟合</text><text x="322" y="210" font-size="14" text-anchor="middle" fill="#15803d">阶数 4 · 刚好</text><text x="532" y="210" font-size="14" text-anchor="middle" fill="#b91c1c">阶数 15 · 过拟合</text><text x="112" y="230" font-size="14" text-anchor="middle" fill="#475569">训练 0.49 / 测试 0.591</text><text x="322" y="230" font-size="14" text-anchor="middle" fill="#475569">0.042 / 0.046</text><text x="532" y="230" font-size="14" text-anchor="middle" fill="#475569">0.0 / 5.27</text><text x="14" y="248" font-size="14" fill="#334155">只有最后一格，训练误差低到没有而测试误差爆了</text></svg>`, caption: `前两格两个数挨在一起，第三格一个贴着零、一个爆到 5.27` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `在动手之前先分清"这是规则活还是模型活"，省掉一次重做`,
    `把同一份数据切成几份，让每次调参都有一个独立的地方验收`,
    `解释"训练 99% 上线翻车"这类现象到底是哪一种病，并给出对应动作`,
    `判断哪些列该进 X：是挑现有的列，还是先算出新列`
  ] },
  { t: `h2`, text: `演示 1 · 人猜的参数 vs 学出来的参数` },
  { t: `code`, lang: `python`, code: `import numpy as np\nfrom sklearn import datasets, linear_model, metrics, preprocessing\nfrom sklearn.model_selection import train_test_split\n\nX, y = datasets.load_diabetes(return_X_y=True)   # 442 人 x 10 项指标\nbmi = X[:, 2]\nrule = 150 + (bmi - bmi.mean()) * 300            # 这两个数是拍脑袋定的\nprint(round(metrics.r2_score(y, rule), 3))       # 0.182\none = linear_model.LinearRegression().fit(bmi.reshape(-1, 1), y)\nprint(round(one.score(bmi.reshape(-1, 1), y), 3))    # 0.344\nprint(round(linear_model.LinearRegression().fit(X, y).score(X, y), 3))   # 0.518` },
  { t: `p`, text: `三行分别是：人写的规则、只用一列去学、十列全交给模型学。第一个数字低得离谱，不是思路错，而是 150 和 300 这两个数是猜的——机器学习做的事，就是把它们当成未知数解出来。第二行到第三行是特征选择的收益：光是把另外九列放进来，就从 0.344 涨到 0.518。` },
  { t: `h2`, text: `演示 2 · 分数只在该没见过的数据上算` },
  { t: `code`, lang: `python`, code: `Xtr, Xte, ytr, yte = train_test_split(X, y, random_state=1)  # 331 训练 / 111 测试\nm = linear_model.LinearRegression().fit(Xtr, ytr)\nprint(round(m.score(Xtr, ytr), 3), round(m.score(Xte, yte), 3))   # 0.536  0.444\nprint(round(m.score(X, y), 3))     # 0.516 里头四分之三是刚背过的` },
  { t: `p`, text: `同一个模型，在训练过的 331 条上是 0.536，在没见过的 111 条上是 0.444，后面这个数才是它的真实水平。最后那行把全体数据都塞回去算，里面四分之三它看过——这个数只能用来跟演示 1 对齐口径，报成绩就是自欺。` },
  { t: `h2`, text: `演示 3 · 三种拟合状态，一次扫出来` },
  { t: `code`, lang: `python`, code: `rng = np.random.RandomState(42)\nX2 = rng.uniform(-1, 1, 30).reshape(-1, 1)\ny2 = np.cos(4.5 * X2.ravel()) + rng.normal(0, 0.2, 30)\nXtr, Xte, ytr, yte = train_test_split(X2, y2, test_size=0.4, random_state=1)\nfor d in (1, 4, 15):\n    pf = preprocessing.PolynomialFeatures(d)\n    P, Q = pf.fit_transform(Xtr), pf.fit_transform(Xte)\n    mm = linear_model.LinearRegression().fit(P, ytr)\n    print(d, round(metrics.mean_squared_error(ytr, mm.predict(P)), 3),\n          round(metrics.mean_squared_error(yte, mm.predict(Q)), 3))\n# 1  0.49 0.591     4  0.042 0.046     15  0.0 5.27` },
  { t: `p`, text: `噪声方差是 0.04，所以下限也就在那附近。阶数 1 两行都高，是欠：一条直线弯不出那个波。阶数 4 训练 0.042、测试 0.046，贴着地板且没有缝，这就是"刚好"。阶数 15 训练误差 0.0，看着满分，测试 5.27——比噪声本身大一百多倍，它把 18 个训练点的每次抖动都当成了规律。判据从来不是训练分数多高，而是这两行差多远。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `拿测试集挑超参数：挑到最后测试集就成了训练集，交上去的分数不再有任何承诺`,
    `为了分数继续加列：多一列就多一批能被背下来的细节，先问它是原因还是结果`,
    `只看训练分数：演示 3 里最"好看"的那一行，恰恰是最该扔掉的那个模型`,
    `切分忘了 shuffle：按时间或按人排的原始顺序，会让测试集变成另一个分布`,
    `省掉验证集之后拿测试集顶两次：同一份数据被看过第二次，它就不独立了`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把演示 3 的阶数改成 2、3、6、10 各跑一遍，列出两行误差，说出最低点在哪一档之后开始反弹`,
    `给演示 2 补一个验证集（切三刀），规定只有验证集能用来调参，测试集最后允许看一次`,
    `把演示 3 的 30 个点改成 200 个点重跑，看阶数 15 那格两行误差靠不靠近，说明为什么数据能治过拟合`,
    `用演示 1 的思路，把你手上一个用 if 写的判断改写成"一条规则加两个拍脑袋的常数"，再让模型替你学一遍，报出差多少`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：七步里只有第四步是机器在干活，其余六步都是你在决定它能看见什么——这一步错了，分数越漂亮越骗人。` }
];
