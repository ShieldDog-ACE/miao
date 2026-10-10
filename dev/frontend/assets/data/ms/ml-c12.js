window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["ml-c12"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把五个分类器排进同一个循环、同一份切分里比。看清三种定边界的机制——间隔、投票、树海——以及为什么集成这次没赢。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `sklearn 有张机器学习地图，可以顺着问题一路走到候选项：样本超过 50 行、要预测的是类别、数据带标签、总数不到 10 万——四条都点头，第一个推荐就是 Linear SVC；不行就因为是数值数据，转去 KNeighbors；再不行才轮到 SVC 和集成方法。这张图的价值不在给出答案，而在把「挨个试」变成「按约束走」，省掉一大半乱撞。` },
  { t: `p`, text: `三条路的机制完全不同。支持向量机找一张把两类分开的平面，并且要求「平面到最近那批样本的距离」最大——只有贴着边界的那几个点说话，其余样本点连参与都不参与。核函数决定这张平面能弯成什么样：linear 只能直切，rbf 能围出弯曲的岛。KNN 根本不学边界，它把训练点全留在原地，新点来了就量距离、抓最近的 k 个投票。集成里的随机森林是「平均」：一百棵各看一部分行列的树，每棵都弱、彼此不一样，投票把方差抹掉；AdaBoost 是「重难活」：一棵接一棵，每棵专挑上一棵答错的样本，那些样本的权重被抬高。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#fbfbfd"/><g font-size="14" fill="#222" text-anchor="middle"><text x="108" y="28">SVM：把间隔推到最宽</text><text x="315" y="28">KNN：不学边界</text><text x="528" y="28">AdaBoost：错点加重</text></g><line x1="105" y1="46" x2="105" y2="188" stroke="#2471a3" stroke-width="2.5"/><g stroke="#9a9ab0" stroke-width="1.5" stroke-dasharray="5 4" fill="none"><line x1="86" y1="46" x2="86" y2="188"/><line x1="124" y1="46" x2="124" y2="188"/></g><g fill="#2471a3"><circle cx="40" cy="80" r="6"/><circle cx="52" cy="120" r="6"/><circle cx="46" cy="158" r="6"/><circle cx="66" cy="100" r="6"/><circle cx="86" cy="132" r="7" stroke="#c0392b" stroke-width="2"/></g><g fill="#e67e22"><circle cx="170" cy="76" r="6"/><circle cx="158" cy="116" r="6"/><circle cx="176" cy="156" r="6"/><circle cx="124" cy="126" r="7" stroke="#c0392b" stroke-width="2"/></g><text x="86" y="200" font-size="14" fill="#c0392b" text-anchor="middle">红圈那两个才算数</text><circle cx="315" cy="118" r="48" fill="none" stroke="#9a9ab0" stroke-width="1.5" stroke-dasharray="5 4"/><g stroke="#c9c9d6" stroke-width="1.2" fill="none"><line x1="315" y1="118" x2="288" y2="92"/><line x1="315" y1="118" x2="342" y2="98"/><line x1="315" y1="118" x2="300" y2="150"/><line x1="315" y1="118" x2="348" y2="140"/><line x1="315" y1="118" x2="280" y2="130"/></g><g fill="#2471a3"><circle cx="288" cy="92" r="6"/><circle cx="342" cy="98" r="6"/><circle cx="300" cy="150" r="6"/></g><g fill="#e67e22"><circle cx="348" cy="140" r="6"/><circle cx="280" cy="130" r="6"/></g><rect x="309" y="112" width="13" height="13" fill="#fff" stroke="#222" stroke-width="2"/><text x="315" y="200" font-size="14" fill="#666" text-anchor="middle">抓 k 个邻居投票：3 比 2</text><g fill="#8a8aa0"><circle cx="452" cy="76" r="4"/><circle cx="472" cy="98" r="4"/><circle cx="494" cy="70" r="4"/><circle cx="516" cy="104" r="4"/><circle cx="540" cy="82" r="4"/><circle cx="590" cy="100" r="4"/><circle cx="606" cy="72" r="4"/></g><circle cx="470" cy="146" r="12" fill="#c0392b"/><circle cx="556" cy="150" r="15" fill="#c0392b"/><text x="470" y="150" font-size="14" fill="#fff" text-anchor="middle">×</text><text x="556" y="155" font-size="14" fill="#fff" text-anchor="middle">×</text><text x="528" y="200" font-size="14" fill="#c0392b" text-anchor="middle">下一棵树专门来纠这两个</text><line x1="212" y1="40" x2="212" y2="196" stroke="#dcdce6" stroke-width="1.2"/><line x1="420" y1="40" x2="420" y2="196" stroke="#dcdce6" stroke-width="1.2"/><text x="320" y="228" font-size="14" fill="#333" text-anchor="middle">同一份切分、同一个指标，五个候选才叫被比过</text><text x="320" y="256" font-size="14" fill="#c0392b" text-anchor="middle">集成不一定更好：AdaBoost 72.4%，在这份数据里垫底</text><text x="320" y="284" font-size="14" fill="#666" text-anchor="middle">380 列都是 0/1 开关：稀疏高维，直边界和树都吃得下</text></svg>`, caption: `三种定边界的办法：推开间隔、当场投票、把错点放大` },
  { t: `p`, text: `比的前提是「同一把刀」。原文的写法是一个字典装着候选，套一个循环各自 fit、predict、打报告，切分只做一次。这样五个数才在同一个口径上——但一个 0.3 的切分只留下 1199 行，两个分类器差一个点，完全可能只是这次手气好，所以还得再切几刀看稳不稳。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `一次跑完一排候选，拿到同口径的排行榜，再决定往哪深挖`,
    `调 kernel 与 C 这两个旋钮：边界能多弯、单个参数能多大嗓门`,
    `树模型顺手交出特征重要性，哪味料最常出现在分裂点上`,
    `打不过 linear 的时候本身就是结论：这批数据大致线性可分`
  ] },
  { t: `h2`, text: `演示 1 · 把候选排进同一个循环` },
  { t: `code`, lang: `python`, code: `from sklearn.svm import SVC\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier\nfrom sklearn.metrics import accuracy_score\nC = 10\nclassifiers = {\n    "Linear SVC": SVC(kernel="linear", C=C, probability=True, random_state=0),\n    "KNN": KNeighborsClassifier(C),\n    "SVC": SVC(),\n    "RFST": RandomForestClassifier(n_estimators=100),\n    "ADA": AdaBoostClassifier(n_estimators=100),\n}` },
  { t: `code`, lang: `python`, code: `for name, clf in classifiers.items():\n    clf.fit(X_train, np.ravel(y_train))\n    y_pred = clf.predict(X_test)\n    print("Accuracy for %s: %0.1f%%" % (name, accuracy_score(y_test, y_pred) * 100))\n    print(classification_report(y_test, y_pred))` },
  { t: `p`, text: `字典在这里就是实验记录本：加一个候选只多一行，五个数自动用同一份 X_train、X_test。原文这段埋了一处该警惕的写法——KNeighborsClassifier(C) 把正则强度那个 10 直接当成了邻居数，两个概念毫不相干，只是恰好同名。今天它俩都取 10 看不出问题，明天你调 C 就会顺手把 k 也改了。` },
  { t: `h2`, text: `演示 2 · 一次切分不算数` },
  { t: `code`, lang: `python`, code: `from sklearn.model_selection import cross_val_score\n\nfor name, clf in classifiers.items():\n    scores = cross_val_score(clf, X_train, np.ravel(y_train), cv=3)\n    print("%-10s %.1f%%  波动 %.1f" % (name, scores.mean() * 100, scores.std() * 100))` },
  { t: `p`, text: `排行榜是 Linear SVC 78.6、KNN 73.8、SVC 83.2、随机森林 84.5、AdaBoost 72.4。cv=3 在训练集内部再切三刀，各跑一遍，交回三个分数：均值给名次，波动给底气。RF 比 SVC 高的那 1.3 个点如果伴着 2 个点的波动，这个名次就是掷硬币——而很多人只报均值。` },
  { t: `h2`, text: `演示 3 · 两个旋钮各管一件事` },
  { t: `code`, lang: `python`, code: `for kernel in ["linear", "rbf"]:\n    clf = SVC(kernel=kernel, C=10, random_state=0).fit(X_train, np.ravel(y_train))\n    print(kernel, round(clf.score(X_test, y_test) * 100, 1))\n\nfor c in [0.1, 10]:                      # C 越小：越不许单味料大声说话\n    clf = SVC(kernel="linear", C=c, random_state=0).fit(X_train, np.ravel(y_train))\n    print("C =", c, round(clf.score(X_test, y_test) * 100, 1))` },
  { t: `p`, text: `注意演示 1 里那行裸的 SVC()：默认核是 rbf、默认不交概率，它和写着 kernel 为 linear 的那一行根本不是同一族比较，83.2 与 78.6 之间混了核函数这一层。C 管的是嗓门：调小，单味稀有配料就别想把边界拽走；调大，模型开始逐条迎合训练行，间隔被压薄。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `一个变量喂两个旋钮（正则强度与邻居数），改一个动了另一个`,
    `只跑一次切分就排名次；不比波动，差距可能全是噪声`,
    `拿默认 SVC 和 Linear SVC 直接对照，核函数已经偷偷换了`,
    `认定集成一定更好：AdaBoost 在这种稀疏 0/1 表上把权重一路交给了稀有配料`,
    `KNN 前不做缩放：这里全是 0/1 还算安全，混进经纬度距离就彻底失真`,
    `候选没锁 random_state，比的是手气而不是机制`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把演示 2 的 cv 从 3 改成 5，看排行榜顺序动没动，说出哪一个名次最不稳`,
    `随机森林的 n_estimators 从 10 加到 300，记下分数与耗时，指出曲线从哪里开始躺平`,
    `把 KNN 的邻居数分别设成 1、5、50，看每类的 precision 与 recall 谁掉得多，给出理由`,
    `挑分数最高的那个候选，翻它的特征重要性，写出三味最能定国别的配料，并说明它凭什么这么排`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：分类器不是挑最时髦的一个，是把它们排上同一份切分去比——间隔、投票、树海各吃一种数据形状，AdaBoost 垫底本身就是信息。` }
];
