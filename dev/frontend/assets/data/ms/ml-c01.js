window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["ml-c01"] = [
  { t: `tip`, color: `blue`, text: `本课目标：说清机器学习跟写 if-else 到底差在哪一步，并跑通一个最小闭环。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `差别只在规则从哪来。传统编程里规则是你写的：把判断写成代码，数据进来，答案出去，规则从头到尾是人定的。机器学习反过来——你交出成对的例子（输入和期望的输出），程序自己在一大堆候选参数里挑一组最能对上这些例子的，这组参数就是它"学出来"的规则。你不是在写逻辑，你是在提供数据和一个衡量标准。` },
  { t: `p`, text: `于是最小闭环固定成五步：拿到数据 → 切一份留着不用 → 训练（搜索参数） → 用那份留着的数打分 → 上线预测。中间第二步不是可选项，它是唯一能区分"真学会了"和"把答案背下来了"的手段。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 268"><defs><marker id="ar-c01" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#64748b"/></marker></defs><text x="16" y="24" font-size="15" fill="#0f172a">传统编程：规则是人写死的</text><rect x="16" y="36" width="118" height="34" rx="6" fill="#fee2e2" stroke="#ef4444"/><text x="75" y="58" font-size="14" text-anchor="middle" fill="#7f1d1d">规则（人写）</text><rect x="160" y="36" width="80" height="34" rx="6" fill="#e2e8f0" stroke="#64748b"/><text x="200" y="58" font-size="14" text-anchor="middle" fill="#1e293b">数据</text><line x1="248" y1="53" x2="300" y2="53" stroke="#64748b" stroke-width="2" marker-end="url(#ar-c01)"/><rect x="306" y="36" width="86" height="34" rx="6" fill="#e2e8f0" stroke="#64748b"/><text x="349" y="58" font-size="14" text-anchor="middle" fill="#1e293b">程序</text><line x1="400" y1="116" x2="400" y2="86" stroke="#64748b" stroke-width="0"/><line x1="398" y1="53" x2="452" y2="53" stroke="#64748b" stroke-width="2" marker-end="url(#ar-c01)"/><rect x="458" y="36" width="126" height="34" rx="6" fill="#dcfce7" stroke="#16a34a"/><text x="521" y="58" font-size="14" text-anchor="middle" fill="#14532d">答案</text><text x="16" y="128" font-size="15" fill="#0f172a">机器学习：规则是搜出来的</text><rect x="16" y="140" width="162" height="34" rx="6" fill="#fef9c3" stroke="#ca8a04"/><text x="97" y="162" font-size="14" text-anchor="middle" fill="#713f12">例子 + 正确答案</text><line x1="184" y1="157" x2="236" y2="157" stroke="#64748b" stroke-width="2" marker-end="url(#ar-c01)"/><rect x="242" y="140" width="86" height="34" rx="6" fill="#e0e7ff" stroke="#6366f1"/><text x="285" y="162" font-size="14" text-anchor="middle" fill="#312e81">训练</text><line x1="334" y1="157" x2="386" y2="157" stroke="#64748b" stroke-width="2" marker-end="url(#ar-c01)"/><rect x="392" y="140" width="118" height="34" rx="6" fill="#fee2e2" stroke="#ef4444"/><text x="451" y="162" font-size="14" text-anchor="middle" fill="#7f1d1d">规则（参数）</text><line x1="451" y1="180" x2="451" y2="206" stroke="#64748b" stroke-width="2" marker-end="url(#ar-c01)"/><rect x="374" y="212" width="156" height="34" rx="6" fill="#dcfce7" stroke="#16a34a"/><text x="452" y="234" font-size="14" text-anchor="middle" fill="#14532d">拿它去答新数据</text><text x="16" y="188" font-size="14" fill="#475569">你干的活在这里</text><text x="16" y="234" font-size="14" fill="#475569">你唯一没法代劳的：把例子给干净</text></svg>`, caption: `同一个问题两条流水线：区别是"规则"这个方框由谁填` },
  { t: `p`, text: `三个常被混着说的词得摆正位置：人工智能是最大的圈，机器学习是里面"用数据代替手写规则"的那一块，深度学习又是机器学习里"用很多层神经网络"的那一支。这门课走的是经典机器学习，主要用 scikit-learn，深度学习那部分不碰。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `从一批历史病历里估某种病的患病概率`,
    `用气象数据预测接下来的天气走势`,
    `判断一句话是夸还是骂`,
    `标出可疑的假新闻，拦住传播`,
    `那些你根本写不出规则的场景——"这张图里有没有猫"，你没法用 if 把它说清楚`
  ] },
  { t: `h2`, text: `演示 1 · 最小闭环，九行` },
  { t: `code`, lang: `python`, code: `from sklearn import datasets, linear_model\nfrom sklearn.model_selection import train_test_split\n\nX, y = datasets.make_regression(n_samples=200, noise=8, random_state=42)\nXtr, Xte, ytr, yte = train_test_split(X, y, random_state=42)\n\nmodel = linear_model.LinearRegression()\nmodel.fit(Xtr, ytr)\nprint(round(model.score(Xte, yte), 3))` },
  { t: `p`, text: `fit 里发生的是解一次最小二乘，score 返回的是 R²。关键在那 50 个点 model 一眼都没看过：训练时只喂 Xtr、ytr。凡是把 score 换成训练集自己算的写法，分数都会漂亮得离谱。` },
  { t: `h2`, text: `演示 2 · 阈值是人定的还是搜出来的` },
  { t: `code`, lang: `python`, code: `# 手写规则：阈值你猜的，换个城市就得改\ndef is_hot(t):\n    return t > 35\n\n# 让机器找：喂进一批 (气温, 是否中暑) 的例子\nmodel.fit(X, y)\nprint(model.coef_, model.intercept_)  # 阈值变成了系数` },
  { t: `p`, text: `手写规则真正的痛不在写第一版，而在改：二十个城市你要维护二十套阈值，每改一次得把老数据重测一遍。机器学习把阈值当成待求参数，一次拟合全部吃掉——代价是它要成对的例子。数据就是这笔交易的货币。` },
  { t: `h2`, text: `演示 3 · 数据的脏，模型不替你洗` },
  { t: `code`, lang: `python`, code: `for noise in (1, 50, 200, 600):\n    X, y = datasets.make_regression(n_samples=200, n_features=1,\n                                    noise=noise, random_state=1)\n    Xtr, Xte, ytr, yte = train_test_split(X, y, random_state=1)\n    m = linear_model.LinearRegression().fit(Xtr, ytr)\n    print(noise, round(m.score(Xte, yte), 3))\n# 1  1.0   50  0.686   200  0.122   600  -0.016` },
  { t: `p`, text: `同一个算法、同一个模型、同一份代码，只把标签里的乱码程度调大，分数从 1.0 一路掉到负数。最后一行值得停一下：R² 为负意味着它比"闭眼猜平均值"还差。算法没变，变的是喂进去的东西。原文那句"高质量数据提升模型表现"说的就是这次扫描——数据定下限，算法只能往上够。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `把机器学习当成"更聪明的 if-else"：不看规则从哪来，就会在几百条例子都没的时候硬上`,
    `拿训练过的数据算分：分数接近 1 只说明它背下来了，不说明它会了`,
    `标签是脏的就直接开训：模型不会替你清洗，脏标签学出来的是脏规律`,
    `AI、机器学习、深度学习三个词混着写进需求里：最后做出来的往往不是同一个东西`,
    `一上来就想堆层数：样本只有几百条、特征全是表格数字时，线性模型更快也更好解释`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把演示 3 的 noise 换成 10、100、400 各跑一遍，记下分数，找出掉到 0.5 以下的那一档`,
    `挑一件你每天都做判断的事（要不要带伞、今天穿什么），先写成三条 if，再指出其中你写不出来的那一条`,
    `用一句自己的话分别说清人工智能、机器学习、深度学习，并各配一个真实产品的例子`,
    `画一张流程图，标出五个步骤里哪一步是你在干、哪一步是程序在干`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：机器学习不是让机器变聪明，而是把"定规则"换成"找参数"——你多出来的那份活不是写 if，而是给出它能看得懂例子。` }
];
