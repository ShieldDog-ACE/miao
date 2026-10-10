window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["ml-c23"] = [
  { t: `tip`, color: `blue`, text: `本课目标：同一份电力负荷换一种打法——不差分、不设季节周期，拿前 4 小时的值当 4 个特征，用支持向量回归猜第 5 小时。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `支持向量机在分类里是把两类分开的边界，在回归里换成一条尽量多接住数据点的拟合线。关键设计是 epsilon 不敏感损失：给拟合线两侧各撑开宽度为 epsilon 的一条带，落在带里的点算零误差、一概不罚，只有跑到带外的才计入损失。模型的兴趣于是从贴近每个点变成找一条能罩住多数点的带，曲线天生比最小二乘平滑。带外的点怎么罚由 C 决定，C 越大越不肯放过它们。非线性靠核函数把特征映到更高维，RBF 核里的 gamma 控制单个点的影响范围——gamma 大、半径小，拟合变局部而锯齿。` },
  { t: `p`, text: `它为什么出现在这一组：ARIMA 是线性统计路线，真实序列里的非线性它映不出来，SVR 恰好能吃非线性。代价是分工变了——ARIMA 预测这个变量下一拍的值，靠差分维持平稳、靠 s 等于 24 记住日周期；SVR 预测这段窗口映射到的那个数，它不知道时间是什么，窗口长度 timesteps 是它唯一能往回看的距离。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#fbfbfd"/><text x="20" y="26" font-size="15" fill="#222">左：epsilon 带决定谁被罚 右：窗口决定能往回看多远</text><path d="M30 120 C80 100 120 130 170 106 S230 84 260 100" fill="none" stroke="#2471a3" stroke-width="2.5"/><path d="M30 104 C80 84 120 114 170 90 S230 68 260 84" fill="none" stroke="#c9c9d6" stroke-width="1.5" stroke-dasharray="4 4"/><path d="M30 136 C80 116 120 146 170 122 S230 100 260 116" fill="none" stroke="#c9c9d6" stroke-width="1.5" stroke-dasharray="4 4"/><g><circle cx="55" cy="112" r="4" fill="#1e8449"/><circle cx="90" cy="118" r="4" fill="#1e8449"/><circle cx="125" cy="112" r="4" fill="#1e8449"/><circle cx="160" cy="104" r="4" fill="#1e8449"/><circle cx="200" cy="70" r="4" fill="#c0392b"/><circle cx="235" cy="140" r="4" fill="#c0392b"/><line x1="200" y1="70" x2="200" y2="86" stroke="#c0392b" stroke-width="1.5"/><line x1="235" y1="122" x2="235" y2="140" stroke="#c0392b" stroke-width="1.5"/></g><text x="30" y="168" font-size="14" fill="#1e8449">带内：误差 0 损失，模型不管</text><text x="30" y="190" font-size="14" fill="#c0392b">带外：按越界距离罚，罚多重由 C 说</text><line x1="285" y1="40" x2="285" y2="250" stroke="#d8d8e3"/><g font-size="13" fill="#333"><rect x="305" y="70" width="42" height="30" rx="4" fill="#e8f0fb" stroke="#2471a3"/><text x="326" y="90" text-anchor="middle">t-4</text><rect x="353" y="70" width="42" height="30" rx="4" fill="#e8f0fb" stroke="#2471a3"/><text x="374" y="90" text-anchor="middle">t-3</text><rect x="401" y="70" width="42" height="30" rx="4" fill="#e8f0fb" stroke="#2471a3"/><text x="422" y="90" text-anchor="middle">t-2</text><rect x="449" y="70" width="42" height="30" rx="4" fill="#e8f0fb" stroke="#2471a3"/><text x="470" y="90" text-anchor="middle">t-1</text><rect x="511" y="70" width="52" height="30" rx="4" fill="#fbeeee" stroke="#c0392b"/><text x="537" y="90" text-anchor="middle">t = y</text></g><text x="305" y="126" font-size="14" fill="#333">4 个特征 → 1 个答案，一行一个样本</text><text x="305" y="152" font-size="14" fill="#666">timesteps = 5：只看 4 小时，看不见 24 小时的日周期</text><text x="305" y="176" font-size="14" fill="#666">timesteps = 25：整个昨天进了特征，样本数跟着少 20 行</text><text x="305" y="212" font-size="14" fill="#222">多步预测：把猜出来的 t 塞回窗口再猜下一个</text><text x="305" y="236" font-size="14" fill="#c0392b">这一步的误差会顺着窗口往下传，越猜越偏</text></svg>`, caption: `SVR 只有两处可拧：带多宽（epsilon、C、gamma）和往回看多远（timesteps）` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `在连续序列上拟合带非线性形状的一步预测，不需要先把序列差分摆平`,
    `把外部变量当额外几列特征直接加进来（温度、节假日），不改模型结构`,
    `当作与 ARIMA 并排的第二把尺子：同一份切分、同一个 MAPE，差值本身就是信息`
  ] },
  { t: `h2`, text: `演示 1 · 把序列折成窗口样本` },
  { t: `code`, lang: `python`, code: `timesteps = 5\ndef win(a):                              # 每个样本 = 连续 5 个值\n    return np.array([a[i:i + timesteps] for i in range(len(a) - timesteps + 1)])[:, :, 0]\ntr, te = win(train.values), win(test.values)\nX_train, y_train = tr[:, :timesteps - 1], tr[:, [timesteps - 1]]\nX_test, y_test = te[:, :timesteps - 1], te[:, [timesteps - 1]]\nprint(X_train.shape, y_train.shape, X_test.shape, y_test.shape)   # (1412,4) (1412,1) (44,4) (44,1)` },
  { t: `p`, text: `1416 减 5 加 1 等于 1412：窗口滑到头就少 4 行，测试段 48 行只剩 44 个样本。第 5 个值是标签、前 4 个是特征，这就是输入前 4 拍、输出第 5 拍。样本之间还重叠——相邻两行共享 4 个值，随机划分会把双胞胎分到两边，所以切分和缩放全部沿用上一课。` },
  { t: `h2`, text: `演示 2 · 四个旋钮：核、gamma、C、epsilon` },
  { t: `code`, lang: `python`, code: `from sklearn.svm import SVR\nmodel = SVR(kernel="rbf", gamma=0.5, C=10, epsilon=0.05)\nmodel.fit(X_train, y_train[:, 0])\nprint(model.support_vectors_.shape)      # 留在带外的点决定了这条线` },
  { t: `p`, text: `fit 的第二个参数要压成一维：y_train 是 (1412, 1) 的列，不压就是二维目标，sklearn 会拒。数据都在 0 到 1 之间时，epsilon 设 0.05 就是 5% 量程以内的偏差一概不看——这不是精度，是容忍度。三个旋钮任何一个调大都会把带外的点推多、训练变慢、曲线变锯齿；support_vectors_ 的行数是最直观的过拟合指示器，涨到样本数的相当比例就说明线在背题。` },
  { t: `h2`, text: `演示 3 · 预测、反缩放、时间戳对齐，再算 MAPE` },
  { t: `code`, lang: `python`, code: `pred_tr = scaler.inverse_transform(model.predict(X_train).reshape(-1, 1))\npred_te = scaler.inverse_transform(model.predict(X_test).reshape(-1, 1))\nreal_tr, real_te = scaler.inverse_transform(y_train), scaler.inverse_transform(y_test)\nts_tr = energy[(energy.index >= train_start_dt) & (energy.index < test_start_dt)].index[timesteps - 1:]\nprint(len(ts_tr), len(pred_tr))          # 1412 1412，不等就别画图\nprint("train MAPE:", round(mape(pred_tr, real_tr) * 100, 3), "%")   # 1.72 %\nprint("test  MAPE:", round(mape(pred_te, real_te) * 100, 3), "%")   # 1.26 %` },
  { t: `p`, text: `索引那行最容易画错：第一个预测值对应窗口里第 5 个时刻，所以时间戳要从第 timesteps 减 1 个开始，否则整条预测线在图上平移 4 小时，看着像模型一直滞后；len 相等只是形状检查，不是对齐检查。测试段 1.26% 比训练段 1.72% 好，不是泛化优异，而是测试那两天本身波动小、更容易猜。` },
  { t: `h2`, text: `演示 4 · 拿去跑整三年，分数立刻变脸` },
  { t: `code`, lang: `python`, code: `full = scaler.transform(energy.values)           # 注意：scaler 只在 59 天上 fit 过\nfw = win(full)\nX, Y = fw[:, :timesteps - 1], fw[:, [timesteps - 1]]\nprint(X.shape)                                   # (26300, 4)\npred = scaler.inverse_transform(model.predict(X).reshape(-1, 1))\nreal = scaler.inverse_transform(Y)\nprint("full MAPE:", round(mape(pred, real) * 100, 3), "%")     # 2.06 %` },
  { t: `p`, text: `整体 2.06% 比测试段差，原因在第三行注释里：scaler 拿训练那 59 天的最高最低值定标，2012 年的负荷范围比它宽，缩放后有一批值落在 0 到 1 之外，模型在没见过的尺度上硬猜。整体分数高于训练段时，先别调超参，先查缩放和分布漂移。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `不缩放就喂 SVR：RBF 算的是欧氏距离，一列量纲大就等于绑架了全部距离`,
    `epsilon 一味调小追求贴住每个点：带外点暴增、支持向量占满样本，训练时间涨上去还顺手过拟合`,
    `忘了时间戳偏移 timesteps 减 1，把预测线画早或画晚几个小时`,
    `把一步预测当多步预测：要 forecast 24 小时就得把输出塞回输入递归，误差顺着窗口累积`,
    `以为 SVR 自动懂周期：它只有窗口，日周期要靠 timesteps 覆盖到 24 才可能被看见`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `timesteps 依次取 3、5、13、25、49 各跑演示 3，把测试段 MAPE 和支持向量数并排列出，指出增益从哪档开始停滞`,
    `固定其它参数，把 epsilon 设成 0.01、0.05、0.2 各画一张预测图，说明贴不贴住小波动这个差别是怎么来的`,
    `把 kernel 换成 linear 重跑，比较测试段 MAPE 与 ARIMA 的 1.15%，说明这份负荷里非线性贡献了多少`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：ARIMA 学的是这个变量随时间怎么演化，SVR 学的是这几列数字怎么映到下一个数——窗口长度就是你的全部时间观，epsilon 带就是你的全部精度诉求。` }
];
