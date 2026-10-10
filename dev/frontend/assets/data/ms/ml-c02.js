window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["ml-c02"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把这份历史读成一张故障清单——每次退潮到底卡在算力、数据，还是问题本身。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `年份不用背，背的是四个到今天还活着的东西：1763 年贝叶斯定理（用已有知识推事件发生的概率）、1805 年最小二乘（把点拟合成线）、1913 年马尔可夫链（下一状态只依赖当前状态）、1957 年感知机（一条直线把两类分开）。前三个是数学家在纸上做的，比"机器学习"这个词早了一百多年——第 1 课里 fit 干的那件事，就是 Legendre 那套。` },
  { t: `p`, text: `1950 年图灵为了回应"机器能不能思考"造出图灵测试；1956 年达特茅斯夏季研究项目上 McCarthy 写下那句假设：学习的任何一个方面原则上都能被精确描述到机器可以模拟它，"人工智能"这个词就是这次会议造出来的。之后二十年是黄金年代：1966 年的 Eliza 装成治疗师跟人聊天，Shakey 会自己规划动作，积木世界里 SHRDLU 听懂英语搬方块。` },
  { t: `p`, text: `1974 到 1980 年的冬天，原文给的三条原因全是工程账：算力太弱；组合爆炸——对机器的要求每加一点，要搜的参数就涨一大截，算力没跟上；数据稀缺，算法没有东西可试。第四条更狠：连"通过图灵测试"本身都被中文房间质疑——看起来懂不等于真懂。` },
  { t: `p`, text: `同一时期还分出两派：scruffy 的实验室把程序改上几个小时直到出现想要的答案，neat 一派守着逻辑和形式化求解。1980 年代开始要求可复现，neat 赢了——今天"必须留评测集""必须能解释"这两条规矩是那一仗的遗产。接着是专家系统，本质是个混合体：一半业务规则引擎，一半用它推导新事实的推理引擎；1987 年后被个人电脑掀翻，因为专用硬件太贵太专。通用算力摊开之后，数据开始堆积，1993 到 2011 年这套学科才真正长成熟。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 296"><defs><marker id="ar-c02" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#94a3b8"/></marker></defs><rect x="238" y="34" width="54" height="200" fill="#dbeafe" opacity="0.55"/><rect x="344" y="34" width="52" height="200" fill="#dbeafe" opacity="0.55"/><text x="243" y="52" font-size="14" fill="#1e40af">寒冬 74-80</text><text x="348" y="52" font-size="14" fill="#1e40af">降温 87-93</text><line x1="40" y1="234" x2="624" y2="234" stroke="#94a3b8" stroke-width="2" marker-end="url(#ar-c02)"/><path d="M40,214 C110,86 165,66 205,80 C255,98 275,206 330,216 C372,224 386,140 436,150 C478,158 520,116 618,100" fill="none" stroke="#f59e0b" stroke-width="3" stroke-dasharray="7 5"/><path d="M40,238 C150,236 300,230 396,206 C470,188 540,124 618,66" fill="none" stroke="#2563eb" stroke-width="3"/><text x="46" y="104" font-size="14" fill="#b45309">承诺的智能</text><text x="500" y="58" font-size="14" fill="#1d4ed8">算力 + 数据做得到</text><text x="104" y="256" font-size="14" text-anchor="middle" fill="#334155">1956 造词</text><text x="238" y="256" font-size="14" text-anchor="middle" fill="#334155">1974</text><text x="344" y="256" font-size="14" text-anchor="middle" fill="#334155">1987</text><text x="470" y="256" font-size="14" text-anchor="middle" fill="#334155">1993</text><text x="592" y="256" font-size="14" text-anchor="middle" fill="#334155">2011</text><text x="150" y="278" font-size="14" fill="#0f172a">虚线在实线上方的那两段，就是钱被抽走的那两段</text></svg>`, caption: `两次退潮的共同形状：承诺跑到能力前面` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `模型做不动时按三样老东西排查：算不动、没例子、问题问错了`,
    `不再默认新即好——你该写的第一个基线是 1967 年的最近邻`,
    `认出专家系统的死法在重演：把领域知识全写成规则，等着哪天被通用模型整段替掉`,
    `防住 Eliza 效应：用户会把"看起来懂"当成"真懂"，验收不能靠观感`
  ] },
  { t: `h2`, text: `演示 1 · 1957 年的感知机撞在哪` },
  { t: `code`, lang: `python`, code: `import numpy as np\nfrom sklearn.linear_model import Perceptron      # 1957\nX = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])\ny = np.array([0, 1, 1, 0])                       # 两个不一样才算 1\np = Perceptron(tol=1e-3, random_state=0).fit(X, y)\nprint(p.predict(X), p.score(X, y))               # [0 0 0 0] 0.5` },
  { t: `p`, text: `四个点它全预测成 0：两个 0 蒙对了，两个 1 一个没抓到。单层感知机能画的边界只有一条直线，而 XOR 的两个 1 恰好在对角线上，一条线切不开。1969 年 Minsky 和 Papert 把这件事摆到台面上，投入随即转冷：一台机器连"两个开关不一样"都学不出来，这话很难反驳。` },
  { t: `h2`, text: `演示 2 · 1970 年加一层就翻过去` },
  { t: `code`, lang: `python`, code: `from sklearn.neural_network import MLPClassifier  # 反向传播 1970\nmlp = MLPClassifier(hidden_layer_sizes=(4,), random_state=0, max_iter=2000)\nprint(mlp.fit(X, y).score(X, y))                  # 1.0` },
  { t: `p`, text: `同样的四个点，多一层就全对。机制上只是多了一步：隐藏层先画两条线，把平面切成几块，输出层再决定哪几块算 1。能力涨的不是玄学的"深度"，是可画边界条数。这条通路走完，神经网络才重新拿回经费。` },
  { t: `h2`, text: `演示 3 · 1967 年的最近邻吃数据` },
  { t: `code`, lang: `python`, code: `from sklearn import datasets, neighbors, model_selection\nX, y = datasets.load_digits(return_X_y=True)      # 1797 张 8x8 手写数字\nfor n in (10, 50, 200, 800, 1600):\n    Xtr, Xte, ytr, yte = model_selection.train_test_split(\n        X, y, train_size=n, stratify=y, random_state=1)\n    knn = neighbors.KNeighborsClassifier().fit(Xtr, ytr)\n    print(n, round(knn.score(Xte, yte), 3))\n# 10 0.215  50 0.763  200 0.938  800 0.985  1600 0.995` },
  { t: `p`, text: `算法一个字没改，只是每次给它看的例子数量不同：10 张连五分之一都认不对，1600 张就 0.995。所谓"数据稀缺"不是形容词，是这条曲线左半段那截爬不上去的地板。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `把这段历史读成"技术一直进步"：三次退潮的原因是同一个，承诺跑得比能力快`,
    `只算模型多大，不算要喂多少：1974 年那句"参数随要求一起涨"今天照样成立`,
    `抄专家系统那条路：手写规则库越完善，被通用模型一次替换时贬值得越狠`,
    `嫌最近邻、最小二乘是老古董：演示 3 里它只要 200 条例子就到 0.938`,
    `拿"聊得像人"当验收标准：Eliza 在 1966 年就做到过，这条从来没过时`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把演示 2 的 hidden_layer_sizes 依次换成 (2,)、(3,)、(4,)，找出能学会 XOR 的最小配置，并说出为什么不能再小`,
    `把演示 3 里的最近邻换成感知机，同一条 n 扫描跑一遍，比较哪条曲线更早 plateau`,
    `从原文三条寒冬原因里挑一条，写成你今天项目里对应的一句话，并给出验证它的办法`,
    `照演示 1 的思路，找一个只有两条以上直线才能切开的问题，先说明为什么单层学不了`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：机器语言的进步从来不是匀速的——钱走开的那两次，都不是因为人变笨了，而是算力、例子和被问的问题里有一项没跟上。` }
];
