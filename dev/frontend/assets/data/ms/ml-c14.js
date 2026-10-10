window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["ml-c14"] = [
  { t: `tip`, color: `blue`, text: `本课目标：聚类这一组从「先画出来看」开始。没有标签可对照，算法的选择只能靠眼睛回答三个问题：什么形状、密度均不均匀、量纲差多少。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `前九课的数据都带答案：菜名、颜色、国家。聚类属无监督学习，手上只有输入、没有配对的输出，它做的事是把点按模式堆成组，交回一个群号。用处在真实工作里很朴素：市场细分（哪个年龄段买什么）、异常检测（信用卡流水里那个孤立的小群）、把搜索结果折成几类、以及在建模之前先弄清这批数据长什么样。折成群号还有个副作用——往后只用群号指代一个人，比用他的姓名便宜也更干净。` },
  { t: `p`, text: `sklearn 列了一张方法表，读法不是挑最出名的，而是照数据形状对号：K-Means 是通用款，认「中心」，把点到中心的平方距离压到最小；DBSCAN、OPTICS、Mean-shift 认「密度」，适合簇多又不均匀、或者形状不平面（沿曲线量距离）的数据；Spectral 和 Ward 适合少而均匀的团；高斯混合假设平面几何、给的是归属概率；层次聚类按邻近一路合并成树。表里那些 transductive、inductive 的差别说的是「结论是给这批观测点还是给一般规则」，而 constrained 是把「这两点必须同组」这类人工规则塞进一个本来没人管的方法里。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#fbfbfd"/><g font-size="14" fill="#222" text-anchor="middle"><text x="150" y="26">紧凑两团：K-均值认中心</text><text x="480" y="26">弯月两团：直线切不开</text></g><line x1="320" y1="36" x2="320" y2="212" stroke="#dcdce6" stroke-width="1.2"/><g fill="#2471a3"><circle cx="86" cy="72" r="6"/><circle cx="104" cy="92" r="6"/><circle cx="72" cy="100" r="6"/><circle cx="96" cy="116" r="6"/><circle cx="118" cy="78" r="6"/><circle cx="76" cy="80" r="6"/></g><g fill="#e67e22"><circle cx="206" cy="140" r="6"/><circle cx="224" cy="158" r="6"/><circle cx="192" cy="162" r="6"/><circle cx="216" cy="180" r="6"/><circle cx="236" cy="144" r="6"/><circle cx="198" cy="142" r="6"/></g><g fill="none" stroke="#9a9ab0" stroke-width="1.5" stroke-dasharray="4 4"><circle cx="94" cy="94" r="34"/><circle cx="214" cy="158" r="34"/></g><g stroke="#c0392b" stroke-width="2.2" fill="none"><path d="M86 86 L102 102 M102 86 L86 102"/><path d="M206 150 L222 166 M222 150 L206 166"/></g><text x="150" y="206" font-size="14" fill="#666" text-anchor="middle">红叉是中心，不是任何一个样本点</text><g fill="#2471a3"><circle cx="366" cy="150" r="6"/><circle cx="376" cy="120" r="6"/><circle cx="392" cy="96" r="6"/><circle cx="414" cy="80" r="6"/><circle cx="440" cy="74" r="6"/><circle cx="466" cy="80" r="6"/><circle cx="486" cy="96" r="6"/></g><g fill="#e67e22"><circle cx="376" cy="184" r="6"/><circle cx="392" cy="204" r="6"/><circle cx="414" cy="214" r="6"/><circle cx="440" cy="218" r="6"/><circle cx="466" cy="212" r="6"/><circle cx="486" cy="196" r="6"/><circle cx="500" cy="176" r="6"/></g><line x1="436" y1="56" x2="436" y2="236" stroke="#c0392b" stroke-width="2.2"/><g fill="#8a8aa0"><circle cx="556" cy="112" r="5"/><circle cx="586" cy="188" r="5"/></g><text x="560" y="212" font-size="14" fill="#8a8aa0" text-anchor="middle">这两个是噪声</text><text x="480" y="206" font-size="14" fill="#c0392b" text-anchor="middle">直线把每个月牙都劈成两半</text><text x="320" y="252" font-size="14" fill="#333" text-anchor="middle">先画出来才有得选：形状、密度、量纲，这三问都得靠图回答</text><text x="320" y="276" font-size="14" fill="#666" text-anchor="middle">tempo 的散布是 danceability 的两百倍：不缩放的话它一个词说了算</text></svg>`, caption: `左边是直线距离能处理的团，右边是它一定切错的形状` },
  { t: `p`, text: `这一组的例子是 530 首尼日利亚歌曲，16 列：歌名、专辑、歌手、流派、年份、时长、人气，加上 danceability、acousticness、energy、loudness 这些平台打出来的分数。流派那一列有标签，但聚类不看它——它此刻唯一的作用是事后核对：算法分出来的群和流派对不对得上。对不对得上都不算验收，因为没有人告诉过算法什么是对的。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `一堆没人标注的用户或商品，先折成几群，再由人给每群起名字`,
    `异常检测：孤立点和孤零零的小群本身就是要报的东西`,
    `建模之前先看清形状，决定该用哪把刀，省掉一整轮白跑`,
    `把明细折成群号，对外只交群号，隐私和带宽一起省下`
  ] },
  { t: `h2`, text: `演示 1 · 把量纲差读出来` },
  { t: `code`, lang: `python`, code: `import matplotlib.pyplot as plt\nimport pandas as pd\nimport seaborn as sns\n\ndf = pd.read_csv("../data/nigerian-songs.csv")\nprint(df.shape)                       # (530, 16)\nprint(df.isnull().sum().sum())         # 0：一个空值都没有\nprint(df[["popularity", "danceability", "energy", "tempo"]].std())` },
  { t: `p`, text: `最后这行是这课最该看的一个数：popularity 约 19、tempo 约 23.5，而 danceability 和 energy 只有 0.12 与 0.15，差着两个数量级。聚类靠的是点与点的距离，直接把十六列一起丢进去，tempo 一项就把整张图说了算。所以先算 std 再决定要不要缩放，别等分组出来再去猜原因。` },
  { t: `h2`, text: `演示 2 · 剔掉「没被分派」和「没上榜」` },
  { t: `code`, lang: `python`, code: `df = df[df["artist_top_genre"] != "Missing"]        # 平台没分派流派的，不要\ntop3 = ["afro dancehall", "afropop", "nigerian pop"]\ndf = df[df["artist_top_genre"].isin(top3)]\ndf = df[df["popularity"] > 0]                       # 0 就是没进榜\n\ntop = df["artist_top_genre"].value_counts()\nplt.figure(figsize=(10, 7))\nsns.barplot(x=top.index, y=top.values)\nplt.xticks(rotation=45)` },
  { t: `p`, text: `popularity 能取 0，那不是「零人气」而是没被排名，原文干脆把它当噪声滤掉。这一步是无监督里很少见的「人说了算」：没有答案可验，剔掉什么全凭判断。所以剔了哪几批、为什么剔，得写在代码旁边——不然过几周你自己也不知道少掉的那几百行去哪了。` },
  { t: `h2`, text: `演示 3 · 三个流派真的分得开吗` },
  { t: `code`, lang: `python`, code: `sns.heatmap(df.corr(numeric_only=True), vmax=.8, square=True)\n# 只有 energy 与 loudness 强相关，其余都弱\n\nsns.set_theme(style="ticks")\nsns.jointplot(data=df, x="popularity", y="danceability",\n              hue="artist_top_genre", kind="kde")` },
  { t: `p`, text: `热图给的结论和第 7 课正好相反：那时盼着特征和答案相关，这里除了 energy 与 loudness（大声的歌自然有劲），其余相关性都很弱。jointplot 用等高线画出三组的分布，三个流派叠成同一团同心椭圆，几乎没有哪个角落只属于一个流派。原文的判断就此落下：在这份松散对齐的数据里定簇是个挑战。kde 是把点摊成连续的概率密度面，看的是分布形状而不是单个点。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `拿带标签那一列当验收标准：算法没看过它，重叠不等于失败，分开也不等于成功`,
    `不缩放就把十六列一起交给距离，量纲最大的那列独裁整张图`,
    `k、eps 这类超参在无监督里没有正确答案可查，只能靠形状和业务解释兜底`,
    `认定直线距离通用：弯月形、密度不均的数据，它一定切错`,
    `只画一张图就选算法，形状、密度、量纲三问只答了一问`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把演示 1 的 std 挑两列算出比值，说出直接算距离时谁会赢，并给出你打算怎么处理`,
    `用 jointplot 换三对轴（energy 与 loudness、speechiness 与 tempo、acousticness 与 danceability），指出哪一对最可能被认成两团`,
    `把流派那一列整个删掉再跑一遍，说出你少了什么、算法少了什么`,
    `照原文那张方法表，为「信用卡流水找异常」和「搜索结果分组」各选一个算法，写清你依据的是形状、密度还是约束`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：聚类没有答案可对，所以第一步不是选算法而是把数据画出来——形状、密度、量纲这三样，看得见才选得对。` }
];
