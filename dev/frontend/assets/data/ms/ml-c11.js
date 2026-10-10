window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["ml-c11"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把上一课那份抹平类别的菜系数据推上多分类。核心是搞清 sklearn 里 multi_class 与 solver 这对旋钮——它们改的是判据，不是模型。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `逻辑回归天生只会回答「是不是」。要它在五个菜系里挑一个，得在外面套一层调度方案。sklearn 给了两条。一条叫 one-vs-rest：训五个二分类器，第 i 个只认第 i 国菜为正例、其余全当负例，各答一次再比谁分高。另一条叫 multinomial：一套参数同时管五个类，输出过一道归一，五格加起来正好是 1。` },
  { t: `p`, text: `两条路的差别不止在形状。OvR 那五道题分开训、各自只对自己的「是不是」负责，最后那五个数是被重新标度过才排在一起的，不是同一个损失函数里长出来的；multinomial 则是一次比较五个类再由 softmax 分摊，天生归一。第二个旋钮 solver 管「用哪种算法把这组参数解出来」，和 multi_class 不能乱配：liblinear 只陪你走 ovr，multinomial 要换 lbfgs、saga 那一档。上一课那句「判据是交叉熵不是 MSE」在这里升级成「哪种交叉熵」。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#fbfbfd"/><defs><marker id="a11" markerWidth="10" markerHeight="10" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#6b6b7b"/></marker></defs><rect x="14" y="96" width="132" height="70" rx="9" fill="#ffffff" stroke="#2471a3" stroke-width="1.8"/><text x="80" y="120" font-size="14" fill="#222" text-anchor="middle">一行配料</text><text x="80" y="142" font-size="14" fill="#666" text-anchor="middle">香菜 洋葱</text><text x="80" y="160" font-size="14" fill="#666" text-anchor="middle">土豆 番茄…</text><g stroke="#c9c9d6" fill="#ffffff" stroke-width="1.5"><rect x="196" y="16" width="128" height="38" rx="7"/><rect x="196" y="62" width="128" height="38" rx="7"/><rect x="196" y="108" width="128" height="38" rx="7"/><rect x="196" y="154" width="128" height="38" rx="7"/><rect x="196" y="200" width="128" height="38" rx="7"/></g><g font-size="14" fill="#333" text-anchor="middle"><text x="260" y="40">是不是 indian</text><text x="260" y="86">是不是 chinese</text><text x="260" y="132">是不是 thai</text><text x="260" y="178">是不是 korean</text><text x="260" y="224">是不是 japanese</text></g><g stroke="#6b6b7b" stroke-width="1.6" fill="none"><line x1="146" y1="130" x2="194" y2="36" marker-end="url(#a11)"/><line x1="146" y1="131" x2="194" y2="82" marker-end="url(#a11)"/><line x1="146" y1="131" x2="194" y2="128" marker-end="url(#a11)"/><line x1="146" y1="131" x2="194" y2="174" marker-end="url(#a11)"/><line x1="146" y1="132" x2="194" y2="220" marker-end="url(#a11)"/></g><g stroke="#c9c9d6" stroke-width="1.5" fill="none"><line x1="324" y1="35" x2="374" y2="35"/><line x1="324" y1="81" x2="374" y2="81"/><line x1="324" y1="127" x2="374" y2="127"/><line x1="324" y1="173" x2="374" y2="173"/><line x1="324" y1="219" x2="374" y2="219"/></g><g fill="#2471a3"><rect x="376" y="26" width="118" height="16" rx="3"/><rect x="376" y="72" width="38" height="16" rx="3"/><rect x="376" y="118" width="4" height="16" rx="2"/><rect x="376" y="164" width="9" height="16" rx="3"/><rect x="376" y="210" width="15" height="16" rx="3"/></g><g font-size="14" fill="#333"><text x="500" y="39">0.716</text><text x="500" y="85">0.229</text><text x="500" y="131">0.008</text><text x="500" y="177">0.017</text><text x="500" y="223">0.030</text></g><text x="376" y="248" font-size="14" fill="#c0392b">五道题分开答，分数被重新标度才排在一起</text><text x="376" y="10" font-size="14" fill="#666" text-anchor="start">OvR：五个独立的「是不是」</text><line x1="320" y1="266" x2="320" y2="296" stroke="#dcdce6" stroke-width="1"/><text x="20" y="284" font-size="14" fill="#333">multinomial：一次比较五个类</text><text x="20" y="296" font-size="14" fill="#666">softmax 后五格和为 1，solver 得换 lbfgs 那一档</text></svg>`, caption: `OvR 把五道题分开问、分数互不归一；multinomial 逼它一起归一` },
  { t: `p`, text: `那怎么选分类器？sklearn 的监督学习目录里躺着十几个模型，挨个试最费时间。原文的路子是先按约束排除：数据干净但很小、又跑在本地笔记本，神经网络太重；本来不是二分类问题，one-vs-all 不用考虑；Boosted Decision Tree 擅长排序任务，这里用不上。剩下的合理选项是决策树和逻辑回归——先跑后者，上一课刚学过它。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `一堆配料返回五个类的分数排序，不必只取第一名，前两名并列也能拿去问人`,
    `把 ovr 的五个二分类器拆开并行训练或部署，代价是分数之间没有共同尺度`,
    `拿 multi_class 与 solver 当旋钮，同一份数据量出两种判据的差`,
    `读系数矩阵：每一行是一个国家的证据权重，哪味料最像它一目了然`
  ] },
  { t: `h2`, text: `演示 1 · 走一遍 OvR` },
  { t: `code`, lang: `python`, code: `from sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split\nimport numpy as np\n\ny = cuisines_df["cuisine"]\nX = cuisines_df.drop(["Unnamed: 0", "cuisine"], axis=1)\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3)\n\nlr = LogisticRegression(multi_class="ovr", solver="liblinear")\nmodel = lr.fit(X_tr, np.ravel(y_tr))\nprint("accuracy =", round(model.score(X_te, y_te), 3))     # 0.8 出头` },
  { t: `p`, text: `fit 前那句 np.ravel 是给标签用的，把一列 Series 摊平成一维。列名照样是配料，模型不认识「菜系」这个词，只吃 0 和 1。三百多列开关喂进去，八成出头对得上「香料组合能定国别」这个常识。` },
  { t: `h2`, text: `演示 2 · 看它给每个类打了几分` },
  { t: `code`, lang: `python`, code: `row = X_te.iloc[50]\nprint(row[row != 0].keys().tolist())     # cilantro, onion, pea, potato, tomato, vegetable_oil\nprint(y_te.iloc[50])                     # indian\n\nproba = pd.DataFrame(model.predict_proba([row]), columns=model.classes_)\nprint(proba.T.sort_values(by=0, ascending=False))` },
  { t: `p`, text: `indian 0.716、chinese 0.229，往下三格全在 0.03 以下。这行有香菜、洋葱、土豆、番茄和植物油，这几味在印度菜那一行的权重最沉。注意这五个数是五道题分开答完再排在一起的，读法应是「印度菜分数最高」，而不是「它有一个独立算出的概率」。` },
  { t: `h2`, text: `演示 3 · 换判据，并且分开看分数` },
  { t: `code`, lang: `python`, code: `from sklearn.metrics import classification_report\n\nmulti = LogisticRegression(multi_class="multinomial", solver="lbfgs", max_iter=2000)\nmulti.fit(X_tr, np.ravel(y_tr))\nprint("multinomial accuracy =", round(multi.score(X_te, y_te), 3))\nprint(classification_report(y_te, multi.predict(X_te)))\n# chinese .73/.71  indian .91/.93  japanese .70/.75\n# korean  .86/.76  thai .79/.85   accuracy .80` },
  { t: `p`, text: `0.80 这个总数把五个类糊成一层。分开看才有信息：indian 精度 0.91、召回 0.93 一骑绝尘，它的香料组合别人很少重叠；chinese 和 japanese 卡在 0.7 上下，这两国的配料表互相抄得最厉害。support 五格都在 220 到 254 之间，上一课抹平的账在这兑现，差距不能推给行数不均。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `multi_class 与 solver 乱配：liblinear 配 multinomial 直接报错，不是你写错了`,
    `把 ovr 的五个分数当成一个 softmax 输出来汇报；它们是五道题分开答再标度的，读法应是「谁分最高」`,
    `train_test_split 不写 random_state：每次切分都在动，两次的 accuracy 不能直接比`,
    `只看总 accuracy，把中日互混这件事藏在了平均数里`,
    `见目录里有十几个模型就挨个试；先按数据规模和任务形状排除，比乱试省时间`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `给演示 1 补上 random_state=0 连跑三次记下分数，再把 solver 换成 lbfgs（仍走 ovr），说出差别`,
    `打印 model.coef_ 的形状，说明 ovr 模式下它为什么是「五份一组」，并找出每份里权重最大的三味料`,
    `用演示 2 换四个行号，把每次的五格加一遍看是不是等于 1，再找一个前两名只差不到 0.05 的样本说说它为什么难分`,
    `把演示 3 的 multinomial 换回 ovr，比较两个 accuracy 与每类 f1，指出这差别能不能算噪声`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：多分类只是套在二分类外面的调度方案——ovr 让五个「是不是」各答各的，multinomial 逼它们一起归一，你选的其实是判据。` }
];
