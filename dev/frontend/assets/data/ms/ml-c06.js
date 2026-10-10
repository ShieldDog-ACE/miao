window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["ml-c06"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把一张 1757 行、字符串和数字混着、单位还不统一的农产品批发表，收拾成能跑回归的数据集；顺便搞明白「先问对问题，再选图」——图的类型决定了你看得见什么。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `教科书里的数据集都太干净，容易骗人。真实数据长这样：美国农业部的南瓜批发表，多个城市的行拼在一起，Date 是 MM/DD/YYYY 的字符串，价格被拆成 Low Price 与 High Price 两列，中间夹着空值，还有一列 Package，取值是 sacks、bins、1 1/9 bushel、1/2 bushel、each 混着来。同一列里既有卖法又有计量法，价格就不能直接比——一只大南瓜按个卖和按半蒲式耳卖，两个数字之间没有关系。` },
  { t: `p`, text: `所以第一个问题不是「用什么模型」，而是「这张表能回答什么问题」。「预测某个月南瓜的售价」能问，但它要求三件事：一行一个观测、有一个唯一的数值目标、特征列干净。于是动作固定为四步：取 Low 与 High 的中点当价格，把 Date 折成月份，只留 Package 里带 bushel 的行，再把整箱价格除以这箱合多少蒲式耳。这四步没有模型、没有训练，却决定后面每个指标的含义。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320" font-family="sans-serif"><rect width="640" height="320" fill="#fbfbfd"/><defs><marker id="a6" markerWidth="10" markerHeight="10" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#6b6b7b"/></marker></defs><text x="20" y="28" font-size="15" fill="#222">一张脏表变成能建模的一张表：四步</text><g stroke="#c9c9d6" fill="#ffffff" stroke-width="1.5"><rect x="12" y="44" width="140" height="58" rx="9"/><rect x="172" y="44" width="140" height="58" rx="9"/><rect x="332" y="44" width="140" height="58" rx="9"/><rect x="492" y="44" width="136" height="58" rx="9"/></g><g font-size="14" fill="#222" text-anchor="middle"><text x="82" y="68">原始 CSV</text><text x="82" y="90" fill="#666">1757 行混着空值</text><text x="242" y="68">只留 bushel 行</text><text x="242" y="90" fill="#666">剩下约 415 行</text><text x="402" y="68">折出两列</text><text x="402" y="90" fill="#666">Month 与 Price</text><text x="560" y="68">单价归一</text><text x="560" y="90" fill="#666">Price 除以蒲式耳数</text></g><g stroke="#6b6b7b" stroke-width="2" fill="none"><line x1="152" y1="73" x2="170" y2="73" marker-end="url(#a6)"/><line x1="312" y1="73" x2="330" y2="73" marker-end="url(#a6)"/><line x1="472" y1="73" x2="490" y2="73" marker-end="url(#a6)"/></g><text x="320" y="124" font-size="14" fill="#333" text-anchor="middle">单位没折平之前，任何价格指标都是假的</text><text x="145" y="152" font-size="14" fill="#222" text-anchor="middle">散点：只摊出一竖条</text><text x="480" y="152" font-size="14" fill="#222" text-anchor="middle">按月取均值：九月十月冒尖</text><g stroke="#c9c9d6" stroke-width="1.5" fill="none"><line x1="45" y1="164" x2="45" y2="272"/><line x1="45" y1="272" x2="250" y2="272"/><line x1="360" y1="164" x2="360" y2="272"/><line x1="360" y1="272" x2="600" y2="272"/></g><g fill="#c0392b"><circle cx="143" cy="180" r="3"/><circle cx="149" cy="198" r="3"/><circle cx="139" cy="212" r="3"/><circle cx="151" cy="226" r="3"/><circle cx="141" cy="240" r="3"/><circle cx="147" cy="255" r="3"/><circle cx="136" cy="190" r="3"/><circle cx="155" cy="205" r="3"/><circle cx="133" cy="232" r="3"/><circle cx="153" cy="265" r="3"/><circle cx="145" cy="248" r="3"/><circle cx="143" cy="170" r="3"/></g><text x="147" y="290" font-size="14" fill="#666" text-anchor="middle">价格连续 · 月份是 1 到 12</text><g fill="#2471a3"><rect x="368" y="252" width="12" height="20"/><rect x="388" y="248" width="12" height="24"/><rect x="408" y="255" width="12" height="17"/><rect x="428" y="250" width="12" height="22"/><rect x="448" y="254" width="12" height="18"/><rect x="468" y="246" width="12" height="26"/><rect x="488" y="252" width="12" height="20"/><rect x="508" y="200" width="12" height="72"/><rect x="528" y="182" width="12" height="90"/><rect x="548" y="238" width="12" height="34"/><rect x="568" y="256" width="12" height="16"/><rect x="588" y="260" width="12" height="12"/></g><text x="480" y="290" font-size="14" fill="#666" text-anchor="middle">9 月 10 月是南瓜的旺季</text><text x="320" y="312" font-size="14" fill="#c0392b" text-anchor="middle">Month 与 Price 的相关系数很小，可这条季节线明摆着——r 只量直线</text></svg>`, caption: `上面四行是清洗步骤，下面两张图是同一份数据的两种看法：散点看不出季节，按月均值的柱状才看得出来` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `判断一张表离能建模还差哪几步：缺什么、脏在哪、要留哪几列`,
    `把字符串列折成数字或类别，把混单位的价格折成可比的单价`,
    `三行代码挑出值得建模的特征对，避开明显无关的列`,
    `定位数据的坑：单位不一致、缺失集中在某一列、样本只覆盖某几个月`
  ] },
  { t: `h2`, text: `演示 1 · 先看脏到什么程度` },
  { t: `code`, lang: `python`, code: `import pandas as pd\n\npumpkins = pd.read_csv('../data/US-pumpkins.csv')\nprint(pumpkins.head())\nprint(pumpkins.isnull().sum())\ncols = ['Package', 'Low Price', 'High Price', 'Date']\npumpkins = pumpkins.loc[:, cols]` },
  { t: `p`, text: `isnull().sum() 是一张按列统计的体检表。某一列空了三分之一，常见处置是丢掉这一列而不是丢掉这些行——行丢了样本就少，而一列大半是空值对模型没什么贡献。loc 的两个参数分别是行和列，第一个位置写冒号表示全要。` },
  { t: `h2`, text: `演示 2 · 把单位折平` },
  { t: `code`, lang: `python`, code: `pumpkins = pumpkins[pumpkins['Package'].str.contains('bushel')]\nprice = (pumpkins['Low Price'] + pumpkins['High Price']) / 2\nmonth = pd.DatetimeIndex(pumpkins['Date']).month\nnew_pumpkins = pd.DataFrame({'Month': month, 'Price': price,\n                             'Package': pumpkins['Package']})\nmask = new_pumpkins['Package'].str.contains('1 1/9')\nnew_pumpkins.loc[mask, 'Price'] = price[mask] / (1 + 1 / 9)` },
  { t: `p`, text: `原文最后一行是把整列 price 除以系数后赋给一个子集，靠索引对齐侥幸不错；一旦上游的过滤改动过索引，它就会静默错位。所以两边都按同一个 mask 取。「1 1/9 箱合多少蒲式耳」这类知识是从 Package 的文本里人工读出来的，硬编进了代码——换一批数据、来了新的包装规格，这段就得跟着改。` },
  { t: `h2`, text: `演示 3 · 三种图各看见什么` },
  { t: `code`, lang: `python`, code: `import matplotlib.pyplot as plt\nimport seaborn as sns\n\nplt.scatter(new_pumpkins.Price, new_pumpkins.Month)\nnew_pumpkins.groupby(['Month'])['Price'].mean().plot(kind='bar')\nsns.catplot(x='Month', y='Price', data=new_pumpkins, kind='bar')\nsns.heatmap(new_pumpkins[['Month', 'Price']].corr(), annot=True)` },
  { t: `p`, text: `第一张只是把点摊开：横轴价格连续，纵轴月份是 1 到 12 的整数，视觉上就是一竖条糊。groupby 取均值再画柱状，九月十月两根高柱立刻显出来，catplot 还顺手把每月价格的波动范围一起画了。Seaborn 的写法是传列名和 dataframe，标签与分组它自己算；它跑在 Matplotlib 之上，返回的还是 Matplotlib 对象，细节照样能改。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `把 Low Price 和 High Price 同时留在特征里，又把它们的中点当目标——等于把答案抄进输入`,
    `认定缺失值必须删，先看它缺在哪一列、缺多少再决定`,
    `拿相关系数当关系检测器：r 接近 0 就说无关，它对季节性和曲线关系是瞎的`,
    `类别列直接放上连续轴，画出来一竖条或者一根糊柱子，然后怀疑数据有问题`,
    `单位没折平就建模，模型不知道 1/2 bushel 和 1 1/9 bushel 量的是同一种东西`,
    ` pandas 抛出 SettingWithCopyWarning 时当作噪声忽略，其实是在提示你那行赋值可能没生效`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `用 head 和尾部那对函数各看五行，再用按列统计空值的那句找出空值最多的两列，写下你留哪列丢哪列、为什么`,
    `数一数 Package 一共有多少种取值；含 each 的行能不能也折成单价，不能就说清为什么不能`,
    `把演示 3 的散点换成 x 为 Low Price、y 为 High Price，描述你看到的形状，并猜一下这两列的 r 大概是多少`,
    `把分组从 Month 换成 Package 再画一次柱状，比较哪种分组让「价格为什么差这么多」这个问题更清楚`,
    `对照 Month 与 Price 的相关系数和按月均值柱状，用一句话解释两个结论为什么看着打架`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：模型能给出的答案，上限是你收拾数据时问出的那个问题；图选错了，关系就在眼前也看不见。` }
];
