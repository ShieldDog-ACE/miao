window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["ml-c05"] = [
  { t: `tip`, color: `blue`, text: `本课目标：认全接下来三节课要用的那几样东西，并把 fit、predict、score 三个动词跑顺。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `三样东西各管一段。numpy 管数组和逐元素算术，模型学到的参数就是它；pandas 管有名字的表，一行一个样本、一列一个属性，读进来的第一眼永远是形状和每列的分布；scikit-learn 管"学"这一步，对外只有三个动词——fit 拿例子求参数，predict 拿参数对新数据出数，score 用一个数字回答"能不能上线"。原文那句总结很实在：拟合完就能预测，用打分决定用不用它。` },
  { t: `p`, text: `数据集不用自己找，scikit-learn 自带了一批，这门课前三节都用糖尿病那份：442 行、10 列特征、一个连续目标（一年后病情进展程度）。列全部被标准化过，所以 print(X[0]) 看到的是一串 0.038、-0.044 这种小数——它不是原始化验单，别按毫克分解读。这份数据里还有个 sex 列，原文专门留了一句让你想：一个二分的性别字段，会把哪些人排除在治疗方案之外。` },
  { t: `p`, text: `怎么挑算法，官方给的路径是两条：estimator 概览页把所有能用的模型列了一遍，用户指南再按任务讲原理。这门课会碰到线性回归、Ridge、Lasso、逻辑回归、决策树、随机森林、SVM、KNN、K-Means，以及处理文本的 CountVectorizer。画图用 matplotlib，无界面时把后端设成 Agg 就能出文件。环境用虚拟环境装 python、numpy、pandas、matplotlib、scikit-learn 这几样；要写 notebook 就在终端起 jupyter notebook。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 236"><defs><marker id="ar-c05" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#64748b"/></marker></defs><text x="14" y="20" font-size="15" fill="#0f172a">三个动词各自吃什么、吐什么</text><rect x="14" y="36" width="126" height="38" rx="6" fill="#e2e8f0" stroke="#64748b"/><text x="77" y="60" font-size="14" text-anchor="middle" fill="#1e293b">训练集 X, y</text><line x1="146" y1="55" x2="188" y2="55" stroke="#64748b" stroke-width="2" marker-end="url(#ar-c05)"/><rect x="194" y="36" width="86" height="38" rx="6" fill="#e0e7ff" stroke="#6366f1"/><text x="237" y="60" font-size="14" text-anchor="middle" fill="#312e81">fit</text><line x1="286" y1="55" x2="328" y2="55" stroke="#64748b" stroke-width="2" marker-end="url(#ar-c05)"/><rect x="334" y="30" width="150" height="50" rx="6" fill="#fef9c3" stroke="#ca8a04"/><text x="409" y="51" font-size="14" text-anchor="middle" fill="#713f12">参数 coef_ 10 个</text><text x="409" y="70" font-size="14" text-anchor="middle" fill="#713f12">截距 intercept_</text><line x1="416" y1="86" x2="416" y2="118" stroke="#64748b" stroke-width="2" marker-end="url(#ar-c05)"/><rect x="334" y="124" width="92" height="38" rx="6" fill="#e0e7ff" stroke="#6366f1"/><text x="380" y="148" font-size="14" text-anchor="middle" fill="#312e81">predict</text><rect x="188" y="124" width="126" height="38" rx="6" fill="#e2e8f0" stroke="#64748b"/><text x="251" y="142" font-size="14" text-anchor="middle" fill="#1e293b">没见过的</text><text x="251" y="157" font-size="14" text-anchor="middle" fill="#1e293b">X_test</text><line x1="318" y1="143" x2="330" y2="143" stroke="#64748b" stroke-width="2" marker-end="url(#ar-c05)"/><line x1="430" y1="143" x2="472" y2="143" stroke="#64748b" stroke-width="2" marker-end="url(#ar-c05)"/><rect x="478" y="124" width="98" height="38" rx="6" fill="#dcfce7" stroke="#16a34a"/><text x="527" y="148" font-size="14" text-anchor="middle" fill="#14532d">y_pred</text><rect x="228" y="184" width="92" height="34" rx="6" fill="#e0e7ff" stroke="#6366f1"/><text x="274" y="206" font-size="14" text-anchor="middle" fill="#312e81">score</text><line x1="322" y1="201" x2="386" y2="201" stroke="#64748b" stroke-width="2" marker-end="url(#ar-c05)"/><rect x="392" y="184" width="86" height="34" rx="6" fill="#fee2e2" stroke="#ef4444"/><text x="435" y="206" font-size="14" text-anchor="middle" fill="#7f1d1d">0.551</text><text x="14" y="146" font-size="14" fill="#475569">测试标签</text><line x1="88" y1="160" x2="240" y2="192" stroke="#64748b" stroke-width="2" marker-end="url(#ar-c05)"/><text x="500" y="206" font-size="14" fill="#475569">R 方</text></svg>`, caption: `只有 fit 吃标签；score 要同时拿预测和真答案，所以它必须是最后一站` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `三行代码把一份表变成一个能出数的模型，先有个能跑的基线再说`,
    `换算法只改两行：线性回归换成 Ridge、树模型、SVM，接口是同一套`,
    `一次扫出哪几列值得进 X，别凭感觉加特征`,
    `把 notebook 里跑通的模型直接搬到网页上——后面挂网页那一课用的就是它`
  ] },
  { t: `h2`, text: `演示 1 · 读数据的第一眼` },
  { t: `code`, lang: `python`, code: `import pandas as pd\nfrom sklearn import datasets\nX, y = datasets.load_diabetes(return_X_y=True)\ncols = ["age", "sex", "bmi", "bp", "s1", "s2", "s3", "s4", "s5", "s6"]\ndf = pd.DataFrame(X, columns=cols)\nprint(df.shape, round(df["bmi"].std(), 3))          # (442, 10) 0.048\nprint(df.corrwith(pd.Series(y)).round(2).sort_values().to_string())` },
  { t: `p`, text: `最后一行把每列和目标的相关系数排出来：最差 s3 是 -0.39，最好 bmi 是 0.59，sex 只有 0.04。这一行值回票价——还没建模就知道该先试哪几列，也知道了第 3 课讲的"分组看误差"该按哪个字段分。` },
  { t: `h2`, text: `演示 2 · 三个动词跑一遍` },
  { t: `code`, lang: `python`, code: `from sklearn import linear_model, model_selection\nXtr, Xte, ytr, yte = model_selection.train_test_split(X, y, test_size=0.33, random_state=42)\nm = linear_model.LinearRegression().fit(Xtr, ytr)\ny_pred = m.predict(Xte)\nprint(len(Xtr), len(Xte))                     # 296 146\nprint(y_pred[:3].round(1))                    # [139.1 184.7 131.6]\nprint(round(m.score(Xte, yte), 3))            # 0.51` },
  { t: `p`, text: `fit 在 296 行里解出 10 个系数和 1 个截距，predict 把那 10 个数乘上测试行的对应列再求和，score 拿 146 个预测值和真答案算 R 方。只有 fit 吃了标签，predict 只给 X——跟第 1 课那九行是同一套约定，后面每个算法都照它来。` },
  { t: `h2`, text: `演示 3 · 换一列，斜率立刻变` },
  { t: `code`, lang: `python`, code: `for c in ("bmi", "age"):\n    x = df[[c]].values\n    a, b, cc, dd = model_selection.train_test_split(x, y, test_size=0.33, random_state=42)\n    m = linear_model.LinearRegression().fit(a, cc)\n    print(c, round(m.coef_[0], 1), round(m.score(b, dd), 3))\n# bmi 972.9 0.316\n# age 293.3 0.045` },
  { t: `p`, text: `同一个 y，只换进 X 的那一列：bmi 一条线就能解释 0.316，age 只有 0.045，约等于没学。顺序和演示 1 那张相关系数表完全一致，所以"选训练方法"这一步里最便宜的部分不是调参，是先花三行看看数据长什么样。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `把标准化过的列当原始化验单读：0.048 的标准差就是这个信号的尺度`,
    `装包时装到了系统 Python 里：notebook 选的内核看不见它，import 直接报错`,
    `在 notebook 里用感叹号装包再切内核：环境名和内核名对不上，白装`,
    `跳过基线直接调超参：手里没有一个 0.5 的分数，就无从判断后来那通操作有没有用`,
    `以为所有 estimator 的 score 都是同一个意思：回归给 R 方，分类给准确率，后面讲概率的那一课会撞到这个区别`,
    `按两重下标去读系数：现在 coef_ 是一维数组（10,）、intercept_ 是标量，写 m.coef_[0][0] 会 IndexError`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把演示 3 的列换成 s5 和 bp，记下斜率和分数，核对它们和相关系数表的排序对不对得上`,
    `给演示 2 的切分分别设 test_size 为 0.2、0.5、0.8 各跑一遍，说明分数为什么会动、动得算不算大`,
    `把数据集从糖尿病换成 iris 的某一列，只改两行，指出 predict 和 score 的返回值哪里变了`,
    `不开浏览器，把 3-Linear 那份 notebook 当脚本跑一遍，并把图存成文件`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：这套工具只有三个动词，真正花时间的是决定让它看见哪几列——先看表再建模，能省掉一半瞎调参。` }
];
