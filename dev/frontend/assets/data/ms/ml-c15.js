window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["ml-c15"] = [
  { t: `tip`, color: `blue`, text: `本课目标：看 K-均值一轮一轮怎么把质心推到不动为止，以及为什么第 14 课「先把数据画出来看」在这一步绕不过去。用的还是那份尼日利亚音乐数据。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `K-均值只做一件事：把 N 个点分进 k 个组，让每个点到自家质心尽量近。它反复转两个动作——每个点判给最近的质心，再把质心挪到本组点的平均位置；挪完量位移，小于容差或到了 max_iter 就宣布收敛。所以结果不是算出来的答案，而是一段迭代停下来的地方：种子取在哪、停在哪，结果就长在哪。几何上等于在平面铺 k 个 Voronoi 格子，中心由格子里的点投票决定。` },
  { t: `p`, text: `为什么必须先画？聚类没有标签，你没东西可以对。算出来的 0/1/2 是三个真实人群，还是把一片连续数据硬切成三段，任何指标都不会主动告诉你。画图是唯一的办法——点摊成一根长条、套成一个环、密度连续衰减，这三种形状 K-均值都会给出一个看着像结果的答案，而它结构上就是错的。第 14 课那一步不是热身，是本课的输入条件。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#fbfbfd"/><rect x="16" y="16" width="288" height="216" rx="10" fill="#ffffff" stroke="#d8d8e3"/><text x="160" y="38" font-size="15" fill="#333" text-anchor="middle">第 1 轮：随机两个种子</text><g fill="#8e8ea0"><circle cx="70" cy="110" r="5"/><circle cx="95" cy="140" r="5"/><circle cx="60" cy="160" r="5"/><circle cx="110" cy="100" r="5"/><circle cx="125" cy="150" r="5"/><circle cx="215" cy="80" r="5"/><circle cx="245" cy="105" r="5"/><circle cx="230" cy="140" r="5"/><circle cx="265" cy="130" r="5"/><circle cx="200" cy="170" r="5"/></g><g stroke-width="4" fill="none"><path d="M100 90 l20 20 M120 90 l-20 20" stroke="#c0392b"/><path d="M215 150 l20 20 M235 150 l-20 20" stroke="#2471a3"/></g><line x1="163" y1="55" x2="163" y2="225" stroke="#c9c9d6" stroke-dasharray="5 5"/><text x="160" y="252" font-size="14" fill="#666" text-anchor="middle">虚线 = 谁离哪个种子近的分界</text><rect x="336" y="16" width="288" height="216" rx="10" fill="#ffffff" stroke="#d8d8e3"/><text x="480" y="38" font-size="15" fill="#333" text-anchor="middle">第 n 轮：质心不再移动</text><g fill="#c0392b"><circle cx="400" cy="120" r="5"/><circle cx="425" cy="150" r="5"/><circle cx="390" cy="170" r="5"/><circle cx="440" cy="110" r="5"/><circle cx="455" cy="160" r="5"/></g><g fill="#2471a3"><circle cx="535" cy="90" r="5"/><circle cx="565" cy="115" r="5"/><circle cx="550" cy="150" r="5"/><circle cx="585" cy="140" r="5"/><circle cx="520" cy="180" r="5"/></g><g stroke-width="4" fill="none"><path d="M415 135 l20 20 M435 135 l-20 20" stroke="#c0392b"/><path d="M550 125 l20 20 M570 125 l-20 20" stroke="#2471a3"/></g><path d="M110 100 C 200 60 300 120 425 145" stroke="#7f7f8f" stroke-width="3" fill="none" marker-end="url(#ar)"/><defs><marker id="ar" markerWidth="10" markerHeight="10" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#7f7f8f"/></marker></defs><text x="300" y="278" font-size="14" fill="#333" text-anchor="middle">每轮只问一句：质心位移够小了吗？否 → 再判一次归属</text></svg>`, caption: `同一批点，种子被点的平均位置一步步拖到组中心——位移归零就是收敛` },
  { t: `p`, text: `停下来之后怎么判断停得好？两把尺子量的是不同的东西。轮廓系数（silhouette score）看组内紧不紧、组间分不分得开，取值 -1 到 1，0 附近意味着两组点压在边界上重叠。inertia/WCSS 是每个点到自家质心距离的平方和，K-均值本身最小化的就是它。前者问像不像三个人群，后者问还剩多少散不开的距离，两个一起看才有结论。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `给一批没有任何标注的歌曲自动分档，看看平台标签之外的天然分组长什么样`,
    `把「高热度、低传唱、安静」这类模糊描述换成一组能落到具体点上的坐标`,
    `在只有特征没有目标列的数据上做异常检测的起手式：离所有质心都远的点值得单看`
  ] },
  { t: `h2`, text: `演示 1 · 先把离群点和量纲画清楚` },
  { t: `code`, lang: `python`, code: `plt.figure(figsize=(12, 3))\nfor i, col in enumerate(["popularity", "danceability", "energy", "loudness"]):\n    plt.subplot(1, 4, i + 1)\n    sns.boxplot(x=df[col])\n    plt.title(col)` },
  { t: `p`, text: `箱线图一出，两件事同时暴露：每列都有一串孤零零的离群点，以及 loudness 的量纲是负几十、其余几列挤在 0 到 1。K-均值只认欧氏距离，谁的分度量级大，最后的组就基本由谁说了算——所以下面每个实验都要写清「缩放 / 不缩放」，否则你读到的是量纲给的分数，不是数据给的。` },
  { t: `h2`, text: `演示 2 · 把迭代手写成循环，看它怎么停` },
  { t: `code`, lang: `python`, code: `centers = X[rs.choice(len(X), 3, replace=False)].copy()\nfor it in range(100):\n    d = ((X[:, None, :] - centers) ** 2).sum(-1)\n    labels = d.argmin(1)                        # 1 判给最近的质心\n    new = np.vstack([X[labels == j].mean(0) for j in range(3)])   # 2 取平均\n    shift = np.abs(new - centers).max()\n    centers = new\n    if shift < 1e-4:                            # 3 位移够小就收敛\n        break` },
  { t: `code`, lang: `python`, code: `from sklearn.cluster import KMeans\nkm = KMeans(n_clusters=3, init="k-means++", n_init=10, tol=1e-4, random_state=42)\nkm.fit(X)\nprint(km.n_iter_, km.inertia_)\nprint(km.cluster_centers_)      # 收敛后的质心坐标\nprint(km.labels_[:10])          # 每行属于哪一组：0/1/2` },
  { t: `p`, text: `两段是同一件事：手写循环里的三步，正是 fit 内部在做的。init 设 k-means++ 不是让结果更准，而是让初始种子彼此分得开，避免两个种子落在同一簇里、其中一个永远抢不到点。n_init 设 10 是跑十次不同种子、留 inertia 最小的那次，因为 K-均值只保证走到局部低点。tol 和 max_iter 决定第几步刹车。` },
  { t: `h2`, text: `演示 3 · 用肘部找 k，用轮廓系数复核` },
  { t: `code`, lang: `python`, code: `wcss, sils = [], []\nfor k in range(1, 11):\n    km = KMeans(k, init="k-means++", n_init=10, random_state=42).fit(X)\n    wcss.append(km.inertia_)\n    sils.append(silhouette_score(X, km.labels_) if k > 1 else np.nan)\nplt.figure(figsize=(10, 4))\nplt.subplot(1, 2, 1); sns.lineplot(x=range(1, 11), y=wcss, marker="o")\nplt.subplot(1, 2, 2); sns.lineplot(x=range(1, 11), y=sils, marker="o", color="green")` },
  { t: `p`, text: `inertia 随 k 一定单调下降（k 等于点数时是 0），所以要看的是哪里变缓——曲线弯一下的那个折点，就是再拆下去收益最小的 k，这就是肘部法则。轮廓系数不单调、它有峰，两张图并排看：折点和峰值对得上，k 才敢定。原文因为已经知道数据被切成 3 个流派，先验 k=3 再用肘部验证，这个顺序是对的：先有假设，再让曲线复核，而不是让曲线替你决定。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `把 artist_top_genre 用 LabelEncoder 编成 0/1/2 再聚类：那是字典序不是距离，等于喂了个假量纲`,
    `只缩放部分列或干脆不缩放：方差大的列直接绑架结果；缩放后轮廓系数可能反而降——不缩放时的分数本来就在虚报`,
    `拿 labels_ 去和原始流派标签算准确率：两组编号的对应关系是任意的，0 和 2 互换结果一模一样`,
    `只跑一次 fit 就下结论：换一组种子 inertia 就变，没设 n_init 等于在赌运气`,
    `数据本来是环状或长条还硬套 K-均值：它只给凸的、大小相近的格子，画出来是弯的就该换谱聚类或 DBSCAN`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `同一份数据分别跑不缩放和 StandardScaler 缩放，各画肘部图与轮廓系数图，写下两组 k 的折点，说你更信哪个`,
    `用演示 2 的手写循环打印每轮的 shift，看它从第几轮起掉到 1e-4 以下；再把 init 换成 random 跑五遍，比较五次 inertia`,
    `故意把 k 设成 6 和 1 各画一张散点图，只用图上的形状和密度说明哪一组是硬切出来的`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：K-均值给的不是「数据本来的分组」，而是这几列、这个 k、这批种子下迭代停下来的那一处——所以先画，再算，别反过来。` }
];
