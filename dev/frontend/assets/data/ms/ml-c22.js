window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["ml-c22"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把 ARIMA 三个字母拆开看清它在预测什么——用这个变量自己的过去值和过去的预测误差，加上差分与季节差分推下一小时的电力负荷，并用 walk-forward 按上线的方式评估。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `ARIMA 的三个字母是自回归、差分、移动平均，它专门拟合非平稳数据。AR（阶数 p）把现在的值回归到它自己过去的 p 个值上。I（次数 d）是差分：相邻两值相减，抹掉水平变化，均值就稳住。MA（阶数 q）：输出由当前与过去的预测误差决定——它学的不是值，是我上次猜偏了多少、这个偏差有多长记忆。合起来：ARIMA 把现在写成过去的值加过去的错误加常数，并要求这套关系在整条时间轴上不变。数据有日周期时要用带季节项的 SARIMA：参数变成两组，(p, d, q) 管非季节、(P, D, Q, s) 管季节，s 是周期长度——小时级数据的日周期就是 24。这两组对应趋势、季节和噪声，是本课唯一真正的选型。原文留了句实话：挑参数主观且耗时，可以交给 auto_arima 搜，但必须把评估口径一起锁死，否则它就靠偷看未来把分数刷上去。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#fbfbfd"/><text x="20" y="26" font-size="15" fill="#222">ARIMA 里数据走了哪几步</text><path d="M30 78 C60 70 70 58 100 66 S140 84 165 70 S205 46 230 60 S270 78 295 62 S330 40 360 54 S400 72 430 56 S470 34 500 48 S540 66 570 50 S600 40 610 44" fill="none" stroke="#c0392b" stroke-width="2"/><text x="20" y="104" font-size="14" fill="#c0392b">原始 load：均值随季节漂 → 非平稳，模型的前提不成立</text><path d="M20 150 L40 138 L60 160 L80 142 L100 156 L120 140 L140 158 L160 144 L180 154 L200 140 L220 158 L240 146 L260 152 L280 138 L300 160 L320 144 L340 154 L360 140 L380 158 L400 146 L420 152 L440 138 L460 156 L480 144 L500 152 L520 140 L540 158 L560 146 L580 152 L600 142" fill="none" stroke="#1e8449" stroke-width="2"/><line x1="20" y1="149" x2="600" y2="149" stroke="#999" stroke-dasharray="4 4"/><text x="20" y="180" font-size="14" fill="#1e8449">差分后：绕着一条水平线抖 → 平稳，可以套 AR 和 MA</text><g font-size="14"><rect x="20" y="196" width="580" height="42" rx="8" fill="#ffffff" stroke="#d8d8e3"/><text x="34" y="222" fill="#222">现在的值 = c + φ·过去 p 个值 + θ·过去 q 个误差 + ε，拟合完再积分回原尺度</text></g><text x="20" y="264" font-size="14" fill="#2471a3">(p,d,q) 管趋势与噪声，(P,D,Q,24) 管每天那一循环；这两组数只能由训练段决定</text></svg>`, caption: `差分是入场券：把序列摆平，AR 和 MA 才有不变的关系可学` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `只用负荷自己这一列预测未来 3 小时，不需要温度或任何外部输入`,
    `在只有几十到几百个历史点的场合起步就能用，不依赖大规模特征工程`,
    `当作统计基线，与处理非线性的路线并排比：两条路线的差值本身就是信息`
  ] },
  { t: `h2`, text: `演示 1 · 差分：把非平稳压成平稳` },
  { t: `code`, lang: `python`, code: `d1 = energy["load"].diff().dropna()        # 一阶差分：y 减 y 前一拍\nds = energy["load"].diff(24).dropna()      # 24 步差分：减掉「昨天同一小时」\nfig, ax = plt.subplots(3, 1, figsize=(14, 7), sharex=True)\nenergy["load"].plot(ax=ax[0], title="原始")\nd1.plot(ax=ax[1], title="diff(1)：趋势没了")\nds.plot(ax=ax[2], title="diff(24)：日周期也没了")` },
  { t: `p`, text: `两条差分减掉的东西不一样：diff(1) 消掉水平漂移，留下日夜起伏；diff(24) 直接消掉一整天的形状，剩下今天这小时和昨天这小时有什么不一样——这就是季节差分。为什么 dropna：差分让第一个点变 NaN，留着 statsmodels 会拒绝拟合。` },
  { t: `h2`, text: `演示 2 · 按时间切分，缩放只在训练段上算` },
  { t: `code`, lang: `python`, code: `train_start_dt, test_start_dt = "2014-11-01 00:00:00", "2014-12-30 00:00:00"\ntrain = energy[(energy.index >= train_start_dt) & (energy.index < test_start_dt)][["load"]]\ntest = energy.copy()[energy.index >= test_start_dt][["load"]]\nprint(train.shape, test.shape)                 # (1416, 1) (48, 1)\nscaler = MinMaxScaler()\ntrain["load"] = scaler.fit_transform(train)    # 拟合只用训练段\ntest["load"] = scaler.transform(test)          # 测试段只套用` },
  { t: `p`, text: `1416 行是 59 天乘 24 小时，48 行是最后两天。切分点必须落在时间上：测试段一定晚于训练段，否则模型拿未来回头猜过去，等于把答案抄进题目。fit 与 transform 的分工不是形式主义：在全体数据上 fit，就把测试段的最高最低值漏进了缩放参数。还有个源文件自带的坑：正文写 9 到 10 月训练、11 到 12 月测试，代码却是 11-01 起训、12-30 起测——以代码为准。` },
  { t: `h2`, text: `演示 3 · 拟合 SARIMAX 并读它的 summary` },
  { t: `code`, lang: `python`, code: `from statsmodels.tsa.statespace.sarimax import SARIMAX\norder = (4, 1, 0)                # p=4 记回过去 4 拍，d=1 差分一次，q=0 不用误差项\nseasonal_order = (1, 1, 0, 24)   # 季节版同一套，周期 s=24 小时\nresults = SARIMAX(endog=train, order=order, seasonal_order=seasonal_order).fit()\nprint(results.summary())\nHORIZON = 3\nprint(results.forecast(steps=HORIZON))` },
  { t: `p`, text: `summary 里看三处：ar.L1 那些系数的符号与大小告诉你哪几拍在起作用，P>z 那列说明它是不是噪声，AIC 用来在不同 order 之间比。要当心：每次换 order 都看一次 AIC，看到最后一次就已经过拟合了，最终分数必须留给一段从没参与挑选的数据。` },
  { t: `h2`, text: `演示 4 · walk-forward：按上线的方式评估` },
  { t: `code`, lang: `python`, code: `window, preds = 720, []\nhistory = list(train["load"])[-window:]\nfor t in range(len(test) - HORIZON):\n    res = SARIMAX(history, order=(2, 1, 0), seasonal_order=(1, 1, 0, 24)).fit()\n    preds.append(res.forecast(steps=HORIZON))\n    history.append(test["load"].iloc[t + 1]); history.pop(0)     # 窗口整体前移\nP = np.array(preds)                                              # 每行 3 个预测\ninv = lambda v: scaler.inverse_transform(np.asarray(v).reshape(-1, 1))\nape = lambda p, a: (np.abs(p - a) / a).mean() * 100\ny = inv(test["load"].values)\nprint([round(ape(inv(P[:, i]), y[i + 1:i + 1 + len(P)]), 3) for i in range(HORIZON)])` },
  { t: `code`, lang: `python`, code: `# 一个点的样子（缩放到 0-1 之后）：三步预测 vs 三步真值\n# 1 : predicted = [0.32 0.29 0.28]  expected = [0.3294 0.2901 0.2739]\n# 2 : predicted = [0.30 0.29 0.30]  expected = [0.2901 0.2739 0.2681]` },
  { t: `p`, text: `循环每走一步：用当前窗口拟合、往后猜 3 步、把刚发生的真值塞进窗口尾巴、从头上扔掉最老的一条——窗口固定 720（30 天）。这就是真实系统里来一条新数据重训一次的形状，所以叫走前验证，也是时间序列评估里最扎实的做法；代价是每个点都要重训一次，数据一多就是笔开销。原文结果：单步 MAPE 约 0.56%、多步约 1.15%；同一段里越往后那一步误差越大，这条误差随 horizon 增长的曲线才是它真正的体检表。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `拿 diff 的 NaN 去拟合，或者忘了 inverse_transform 就报误差——0.3 和 3000 是两个世界`,
    `在同一批测试数据上反复换 order 挑 AIC，最后一次评估已经不算独立评估`,
    `把 d 或 D 调大当更平稳：过头之后模型只能拟合噪声`,
    `s 设错：小时级日周期是 24，日级年周期是 365，数据缺时刻时这个数还不一定是整数`,
    `用样本内残差判断好坏：summary 里那些统计量全是样本内的，不告诉你未来准不准`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把 order 依次换成 (1,1,0)、(2,1,0)、(4,1,1)、(6,1,0) 各跑演示 4，把三个 horizon 的 MAPE 列成表，指出误差第一次不再明显下降的那个阶数`,
    `把季节阶 P 设成 0 再跑一次，从图上说预测错在形状还是水平`,
    `把 HORIZON 改成 24，画出预测线与真实线，用一句话描述误差从第几步开始失控`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：ARIMA 预测的不是未来的规律，而是这个变量自己的过去值加上过去猜错的偏差——先差分摆平趋势与季节，再用 walk-forward 验。` }
];
