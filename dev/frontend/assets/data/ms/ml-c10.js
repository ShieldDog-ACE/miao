window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["ml-c10"] = [
  { t: `tip`, color: `blue`, text: `本课目标：看清分类问题长什么样——二分类与多分类、标签已经给定的监督学习，并在动手建模前先把「类别不平衡」这件事查出来、处理掉。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `分类和回归是同一棵树上的两根枝：都属监督学习，数据都带标签，都是拿特征去换一个个位答案。区别只在答案的形状。回归交回一个能量度的数（价格、时长），分类交回一个名字（哪国菜、是不是欺诈）。上一课逻辑回归已经站在边界上——它算概率，最后吐的是类别。` },
  { t: `p`, text: `这一组的题目换成菜：给定一串配料，判断它属于哪国菜系。数据是 2,448 行、385 列，除了一列菜名，其余全是被折成 0 和 1 的配料开关——一行菜等于一份「哪些配料在场」的清单。这形状正是上一课 one-hot 编码之后的样子，只不过这里已经替你做好了。五个候选类别并列、没有先后，所以这是一个多分类问题；要是换成问「这道菜会不会用胡芦巴」，同一个数据就退化成二分类。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#fbfbfd"/><text x="20" y="26" font-size="15" fill="#222">每类有多少行（差了近三倍）</text><g font-size="14" fill="#333"><text x="20" y="60">korean</text><text x="20" y="88">indian</text><text x="20" y="116">chinese</text><text x="20" y="144">japanese</text><text x="20" y="172">thai</text></g><g fill="#2471a3"><rect x="92" y="48" width="190" height="16" rx="3"/><rect x="92" y="76" width="142" height="16" rx="3"/><rect x="92" y="104" width="105" height="16" rx="3"/><rect x="92" y="132" width="76" height="16" rx="3"/><rect x="92" y="160" width="69" height="16" rx="3"/></g><g font-size="14" fill="#666"><text x="288" y="61">799</text><text x="240" y="89">598</text><text x="203" y="117">442</text><text x="174" y="145">320</text><text x="167" y="173">289</text></g><line x1="330" y1="20" x2="330" y2="200" stroke="#dcdce6" stroke-width="1.5"/><text x="352" y="26" font-size="15" fill="#222">抹平它的两种做法</text><g stroke="#c9c9d6" stroke-width="1.5"><line x1="352" y1="160" x2="620" y2="160"/><line x1="352" y1="60" x2="352" y2="160"/></g><g fill="#c0392b"><circle cx="382" cy="120" r="7"/><circle cx="382" cy="120" r="7"/><circle cx="382" cy="120" r="7"/><circle cx="382" cy="120" r="7"/><circle cx="556" cy="82" r="7"/><circle cx="600" cy="132" r="7"/></g><g fill="#2471a3"><circle cx="470" cy="70" r="7"/><circle cx="500" cy="126" r="7"/></g><g stroke="#2471a3" stroke-width="1.8" stroke-dasharray="4 3" fill="none"><line x1="470" y1="70" x2="500" y2="126"/><line x1="470" y1="70" x2="556" y2="82"/><line x1="500" y1="126" x2="600" y2="132"/></g><g fill="#f0ad3a"><circle cx="485" cy="98" r="7"/><circle cx="513" cy="76" r="7"/><circle cx="550" cy="129" r="7"/></g><g font-size="14" fill="#666"><text x="352" y="184">复制：同一个点叠三层</text><text x="470" y="184" fill="#2471a3">SMOTE：沿近邻连线插新点</text></g><text x="320" y="228" font-size="14" fill="#c0392b" text-anchor="middle">全猜 korean 也能拿三成多的 accuracy——这个数字本身不值钱</text><text x="320" y="256" font-size="14" fill="#333" text-anchor="middle">补齐只是让少数类别再被淹没，多出来的行是算出来的，不是看到的</text><text x="320" y="284" font-size="14" fill="#666" text-anchor="middle">先数每类几行，再谈算法：这一组的顺序是从这里开始的</text></svg>`, caption: `左边是原始分布，右边是两种抹平办法：复印还是插值` },
  { t: `p`, text: `抹平有两种。笨办法是把 korean 的行删掉、或把 thai 复印几遍：复印出来的还是同一个点，模型学到的边界一点没动，只是权重被扭曲。imblearn 带的 SMOTE 走另一条：在少数类样本和它的近邻之间连一条线，在线上取个新位置当作新样本——它造的是「没被记录过但合理的菜」，代价是这些行是算出来的，不是看到的，评测时必须看真实留出的那批。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `一堆配料换一国菜名：五个并列类别里挑一个`,
    `退一步做二分类：某味香料会不会出现在这道菜里`,
    `类别有先后时走另一条路（辣度、尺码那种有序档），别当并列类别硬编`,
    `反过来问：给一类菜，看哪些配料在这类里最常见，用来做推荐或解释`
  ] },
  { t: `h2`, text: `演示 1 · 先数每类有几行` },
  { t: `code`, lang: `python`, code: `import pandas as pd\nfrom imblearn.over_sampling import SMOTE\n\ndf = pd.read_csv("../data/cuisines.csv")\ndf.drop(columns=["Unnamed: 0"], inplace=True)\n\nprint(df.shape)                        # (2448, 384)\nprint(df["cuisine"].value_counts())    # korean 799 一直到 thai 289\ndf["cuisine"].value_counts().plot.barh()` },
  { t: `p`, text: `第一步不是选算法，是这条 value_counts。384 列里除了菜名全是 0/1，等于每道菜已经被写成一份开关清单，机器可以直接吃。顺手把 pandas 白送的那列行号丢掉——它对菜系不持任何观点，留着只会让后面算特征相关性时多出噪声。` },
  { t: `h2`, text: `演示 2 · 找出捣乱的配料` },
  { t: `code`, lang: `python`, code: `def top10(sub):\n    s = sub.drop(columns=["cuisine"]).sum().sort_values(ascending=False)\n    return s.head(10)\n\nfor name in ["thai", "korean", "indian"]:\n    print(name, list(top10(df[df.cuisine == name]).index))` },
  { t: `p`, text: `三个菜系各打一列前十，麻烦就露出来了：rice、garlic、ginger 五国菜里全都排前列——人人都用，所以它们不区分任何东西，只会把权重摊薄。原文的做法是把这三列连同菜名列、行号列一起 drop 掉，特征正好剩 380 个；后面单独一课导出模型，那个形状里的数字就是从这儿数出来的。反方向的整列全 0 也一样：它对各菜系都不说话，留着只是让形状变大。` },
  { t: `h2`, text: `演示 3 · 补之前，先立一条笨基线` },
  { t: `code`, lang: `python`, code: `from sklearn.dummy import DummyClassifier\nfrom sklearn.model_selection import train_test_split\n\ny = df["cuisine"]\nX = df.drop(columns=["cuisine"])\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=0)\n\nbase = DummyClassifier().fit(Xtr, ytr)\nprint("笨基线 accuracy =", round(base.score(Xte, yte), 3), "| 它只会猜", base.predict(Xte[:3]))` },
  { t: `p`, text: `DummyClassifier 什么都不学，一律交回最多那一类。这条线是后面所有分类器的及格线：任何算法打不过它，就等于没学到东西。接着再补数据——SMOTE 只喂 X 和 y，交回一份每类都是 799 行的新集合，补完记得重新切分，别让合成行同时出现在训练和测试两边。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `拿 accuracy 当唯一分数：类别不平衡时它会被多数类牵着走`,
    `在切分之后才做 SMOTE：合成行同时进训练和测试，分数虚高得查不出来`,
    `把有序类别当并列类别 one-hot，辣度被拆成互不相干的几根柱`,
    `见 0/1 列就当特征有用：全 0 列和五类共有列都得先请出去`,
    `以为补出来的行是真数据：它们是算出来的，结论只能看真实留出的那批`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把演示 1 的 value_counts 换算成比例，说出多数类占多少，再对照演示 3 那条笨基线的数字，解释两者为什么接近`,
    `用演示 2 的函数跑完五个菜系，列出一个在五类里都进前十的配料，说明它为什么帮不上忙`,
    `分别用「删到 289 行」和「SMOTE 补到 799 行」两种做法各处理一次，比较剩下的行数与丢掉的行数`,
    `把任务改成二分类（例如会不会用大蒜），说清 X、y 各是哪一列，以及这跟五类版本差在哪`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：分类不难，难在答案是有名字的——先把每类的行数数清楚、把不说话的列清出去，算法的选择才有人说话的地方。` }
];
