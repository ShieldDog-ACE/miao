window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["ml-c03"] = [
  { t: `tip`, color: `blue`, text: `本课目标：看清模型偏起来不需要谁存心，以及用哪几个动作能在上线前把它抓出来。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `模型的坏法和普通 bug 不一样。普通代码写错了谁都不满意；模型按定义是在拟合"多数例子"，只要某个群体在训练集里占得少，把它判错对总分的伤害就小——模型不是忽略了它，而是忽略它更划算。原文那句难点在于：偏见通常不是有人塞进去的，很难有意识地知道自己在哪一步引入了它。所以只能靠机械动作去查，不能靠自觉。` },
  { t: `p`, text: `偏出来的结果分成五类，原文的例子都很具体。分配（allocation）：一组人拿到贷款另一组拿不到。服务质量（quality of service）：洗手液机感应不到深肤色的手——训练场景单一，现实更复杂。贬损（denigration）：图像标注把深肤色的人标成大猩猩。代表性失衡（over- / under-representation）：某个职业的形象里永远没有某个群体。刻板印象（stereotyping）：英语和土耳其语互译时，把职业词和性别硬绑在一起，翻译本身就出错。` },
  { t: `p`, text: `对着这五类，微软给的六条原则是：公平、可靠与安全、包容、隐私与安全、透明、问责。落到工程上只有一句有用的话——准确率、AUC 这些传统指标是"定量聚合值"，单个数字看不见分组差异，也就判断不了有没有违反原则。要看的是按人群摊开的误差、数据的分布，以及模型凭什么这么判（玻璃盒，不是黑盒）。这套工具后面单独一课讲它。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 258"><path d="M40,220 C120,218 150,96 210,96 C270,96 300,218 380,220" fill="none" stroke="#2563eb" stroke-width="3"/><path d="M240,220 C320,219 350,176 400,176 C450,176 480,219 560,220" fill="none" stroke="#dc2626" stroke-width="3"/><line x1="330" y1="40" x2="330" y2="220" stroke="#0f172a" stroke-width="2" stroke-dasharray="6 4"/><line x1="300" y1="40" x2="300" y2="220" stroke="#64748b" stroke-width="2" stroke-dasharray="2 4"/><text x="336" y="54" font-size="14" fill="#0f172a">模型选的阈值 330</text><text x="306" y="76" font-size="14" fill="#475569">多数组少时本该在 300</text><path d="M330,120 C352,104 372,98 396,98 L396,220 L330,220 Z" fill="#fca5a5" opacity="0.55"/><path d="M330,40 C300,60 268,90 250,130 L250,40 Z" fill="none"/><line x1="40" y1="220" x2="604" y2="220" stroke="#94a3b8" stroke-width="2"/><text x="196" y="240" font-size="14" text-anchor="middle" fill="#1d4ed8">多数组（例子很多）</text><text x="452" y="240" font-size="14" text-anchor="middle" fill="#b91c1c">少数组（例子很少）</text><text x="452" y="196" font-size="14" fill="#7f1d1d">这片被划到红线左边</text><text x="452" y="214" font-size="14" fill="#7f1d1d">的，全是它的错</text><text x="46" y="34" font-size="14" fill="#0f172a">同一个 x 轴上的两群人和一条判决线</text></svg>`, caption: `阈值被多数组拽走的那一段，就是"分配类伤害"的形状` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `在上线前发现"总体 95%、某组 5%"这种被一个数字藏起来的事`,
    `把投诉从"它对我不好"变成能查的东西：哪一组、错在哪个方向、错多少条`,
    `拦住一类常见的过度设计：数据本身就偏时，先补数据比换算法有效`,
    `给审计和申诉一个落脚点——没人负责的黑盒系统，出事后没人能说清为什么`
  ] },
  { t: `h2`, text: `演示 1 · 一个总数藏住两组人` },
  { t: `code`, lang: `python`, code: `import numpy as np\nfrom sklearn.linear_model import LogisticRegression\n\nrng = np.random.RandomState(0)\nnA, nB = 1000, 60                        # 少数组只采到 60 条\nX = np.r_[rng.normal(1.0, 1, nA), rng.normal(-0.4, 1, nB)].reshape(-1, 1)\ny = np.r_[np.ones(nA), np.zeros(nB)]     # 1 表示"批准"\nm = LogisticRegression().fit(X, y)\ngB = np.arange(len(y)) >= nA\nprint(round(m.score(X, y), 3))                       # 0.945 总体\nprint(round(m.score(X[~gB], y[~gB]), 3), round(m.score(X[gB], y[gB]), 3))` },
  { t: `p`, text: `总体那个数好看，因为样本里 94% 是 A 组，模型把所有人一律判成"批准"就有 0.945。拆开看：A 组 0.999，B 组 0.05——60 条里 57 条被误判成批准，B 组几乎没被当成"该拒绝"过。模型没坏，它只是算了笔划算的账。` },
  { t: `h2`, text: `演示 2 · 把两组条数配平` },
  { t: `code`, lang: `python`, code: `keep = np.r_[np.arange(0, nA, 16), np.arange(nA, nA + nB)]   # A 降到 63 条\nm2 = LogisticRegression().fit(X[keep], y[keep])\nprint(round(m2.score(X, y), 3))                        # 0.753 总体\nprint(round(m2.score(X[~gB], y[~gB]), 3), round(m2.score(X[gB], y[gB]), 3))` },
  { t: `p`, text: `算法一个字没改，只是让 B 组在训练时说话的分量够了：总体从 0.945 掉到 0.753，B 组从 0.05 回到 0.717，A 组 0.755。这一步最难接受的地方在于总分真的变低了——如果验收只看总分，团队一定会选上一个模型。所以原文把"影响评估"放在训练之前，不是走流程。` },
  { t: `h2`, text: `演示 3 · 误差表要看方向，不是只看大小` },
  { t: `code`, lang: `python`, code: `from sklearn.metrics import confusion_matrix\nprint("A", confusion_matrix(y[~gB], m.predict(X[~gB]), labels=[0, 1]))\nprint("B", confusion_matrix(y[gB], m.predict(X[gB]), labels=[0, 1]))\n# [[  0   0]      [[ 3  57]\n#  [  1 999]]      [  0   0]]` },
  { t: `p`, text: `两组都是"错了一些"，但错的方向完全相反：A 组只漏了一个，B 组是 57 个不该批准的被批准了。放款场景里这两种错误的后果不对等——前者少赚，后者坏账、还有人因为被误拒去申诉。原文的 error analysis 说的就是这张按人群摊开的表，而不是又一个平均数。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `拿总体准确率交差：它约等于多数组的准确率，演示 1 里差距是 0.999 对 0.05`,
    `只在训练集上算指标：模型没见过测试集这件事一旦被跳过，所有分组结论都失效`,
    `把公平理解成"不给模型看性别和种族"：邮编、机型、消费档位都能替它们说话，代理变量照样偏`,
    `出问题时只换更大的模型：分布没铺开的组，模型再大也只是把偏见拟合得更稳`,
    `上线后没人看错误分布、没人接申诉：这就是问责那条原则要堵的洞`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把演示 1 的 nB 依次改成 20、200、1000，记下总体和两组三个数，说出差距从哪一档开始收敛`,
    `不丢任何一条 B 组样本，只让模型自己按类别数量加权（sklearn 里有个现成开关），看它能不能做到演示 2 的效果`,
    `把两类的均值差从 1.4 缩到 0.6，观察配平后两组分数掉到哪，说明"这批数据根本分不开"和"模型不行"的区别`,
    `挑一个你做过的功能，写出它最可能伤到的一组和验证它的那张分组误差表怎么列`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：模型偏不是因为有人写坏了它，而是因为它老实反映了你的样本有多偏——不把人按组摊开看，你永远只会看到一个替多数组说话的总分。` }
];
