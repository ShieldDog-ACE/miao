window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["ml-c27"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把上一课那句「聚合指标会掩盖问题」变成可执行的检查——按人群拆误差、按指标找分歧、回查数据表示、再查是谁在决定预测。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `传统调试手段基本都是聚合量：整体准确率 89%、平均误差损失 0.001，看着很好。问题是误差从来不在数据上均匀分布——同一个模型可以在整体上是 89%，而在某一块数据区域里失败 42%。这就是本课的全部动机：一个分数好看的模型，可能只是把错都放在了你没看的那一群人身上。微软那套负责任 AI 仪表板把这件事拆成四块，每块回答一个具体问题。误差分析：模型在哪些人群上错得多，树图把误差按特征组合分下去，颜色越深误差率越高。模型概览：同一批人群横向比多个指标，一个好看时另一个往往在报警。数据分析：往回查数据本身，谁被过度或不足表示；「数据如果被迫交代得够久，它什么都会承认」（Coase）不是阴谋论，是统计事实——高管层只有 27% 是女性，用这份历史数据训的招聘模型就会只把高级岗位投给男性，整体分数还能一直很好看。特征重要性：全局看靠哪几列，局部看这一个病例为什么被判成会 30 天内再入院；敏感特征或跟它高度相关的代理特征排在前列，已经是偏见的直接证据。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#fbfbfd"/><defs><marker id="a27" markerWidth="10" markerHeight="10" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#6b6b7b"/></marker></defs><text x="20" y="24" font-size="15" fill="#222">四个检查，和每一个的报警信号</text><g font-size="14"><rect x="20" y="40" width="290" height="96" rx="8" fill="#e8f0fb" stroke="#2471a3"/><text x="34" y="62" fill="#222">① 误差分析：谁错得多</text><text x="34" y="84" fill="#333">树图按特征组合分误差，深色=高误差</text><text x="34" y="108" fill="#c0392b">报警：整体 0.89，最差子群 0.58</text><rect x="330" y="40" width="290" height="96" rx="8" fill="#eef7ee" stroke="#1e8449"/><text x="344" y="62" fill="#222">② 模型概览：指标之间打架</text><text x="344" y="84" fill="#333">准确率/召回/精确率/MAE 分人群并排</text><text x="344" y="108" fill="#c0392b">报警：选择率（批准率）组间差超过阈值</text><rect x="20" y="152" width="290" height="96" rx="8" fill="#fbeeee" stroke="#c0392b"/><text x="34" y="174" fill="#222">③ 数据分析：数据本身偏不偏</text><text x="34" y="196" fill="#333">按人群看占比、看标签与特征噪声</text><text x="34" y="220" fill="#c0392b">报警：误差占比远高于该群数据占比</text><rect x="330" y="152" width="290" height="96" rx="8" fill="#fdf5e6" stroke="#b9770e"/><text x="344" y="174" fill="#222">④ 特征重要性：谁在决定</text><text x="344" y="196" fill="#333">全局靠哪几列 + 单例被什么推上去</text><text x="344" y="220" fill="#c0392b">报警：敏感列或它的代理排在最前</text></g><g stroke="#6b6b7b" stroke-width="2" fill="none"><path d="M310 88 L328 88" marker-end="url(#a27)"/><path d="M475 136 C475 145 165 143 165 150" marker-end="url(#a27)"/><path d="M310 200 L328 200" marker-end="url(#a27)"/></g><text x="20" y="278" font-size="14" fill="#333">顺序不是固定的：误差集中在哪个人群（①）→ 那群在数据里有多少（③）→ 模型拿什么列在判它（④）→ 换一个指标再看一遍（②）</text></svg>`, caption: `四块看板问的是四个不同问题；只有四个答案互相咬合，才敢说模型没问题` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `上线前能回答监管要的那句话：这个预测是因为哪些数据做出的`,
    `把「模型不好」拆成「哪一群人不好、哪个指标不好、数据里哪一环不足」三类可执行的整改动作`,
    `发现伪相关：模型没在学病情，它在学「住院天数少的病人更容易被出院」`
  ] },
  { t: `h2`, text: `演示 1 · 先把整体准确率撕成人群` },
  { t: `code`, lang: `python`, code: `res = pd.DataFrame({"y": y_test, "p": pred, "grp": cohort})\ndef stat(g):\n    return pd.Series({"n": len(g), "acc": (g.y == g.p).mean()})\ntab = res.groupby("grp").apply(stat, include_groups=False)\nprint("整体:", round((res.y == res.p).mean(), 3))\nprint(tab.sort_values("acc").round(3))` },
  { t: `p`, text: `两行数字就够：整体 0.89，最差那组 0.58。n 那一列是配套的判据——分数最差的组恰好样本也最少时，你面对的是两种完全不同的问题：样本少是数据不足（补数据，或者禁止对该群体做自动决策），样本多而分数差是模型结构错了。树图就是这个 groupby 递归下去，只是它替你枚举了特征组合；自己写时把分组维度限制在两三个以内，否则每个叶子只剩几十条，分数的意义就没了。` },
  { t: `h2`, text: `演示 2 · 指标之间打架，以及选择率差` },
  { t: `code`, lang: `python`, code: `from sklearn.metrics import recall_score, precision_score\ng = res.groupby("grp")\nout = pd.DataFrame({\n    "召回率": g.apply(lambda d: recall_score(d.y, d.p, zero_division=0)),\n    "精确率": g.apply(lambda d: precision_score(d.y, d.p, zero_division=0)),\n    "选中率": g.apply(lambda d: d.p.mean()),         # 被判为 1 的比例\n    "实际率": g.apply(lambda d: d.y.mean()),\n})\nout["选择率差"] = out["选中率"] - out["实际率"]\nprint(out.round(3))` },
  { t: `p`, text: `这就是模型概览里那两类分歧指标：性能差异（同一个指标在子群之间的差值）和选择率差异（有利预测的比例在子群之间的差，贷款批准率最典型）。选中率高于实际率，这一组被系统性地多判了好事，真正需要帮助的人被漏掉；低于实际率就是被过度报警。漏诊的代价从来不在准确率里。` },
  { t: `h2`, text: `演示 3 · 回查数据：谁在误差里，谁在样本里` },
  { t: `code`, lang: `python`, code: `share_all = res["grp"].value_counts(normalize=True)\nshare_err = res.loc[res.y != res.p, "grp"].value_counts(normalize=True)\nprint(pd.DataFrame({"数据占比": share_all.round(3), "误差占比": share_err.round(3)}).dropna())\nprint("误差最集中的组:", (share_err - share_all).idxmax())\nprint("正样本里的占比:", res.loc[res.y == 1, "grp"].value_counts(normalize=True).round(3))` },
  { t: `p`, text: `最后一行比前几行更接近病根：整体占比是一回事，正样本里某一组几乎没有人，才是模型学不到它的直接原因——不平衡不产生于模型，产生于数据，模型只是把它复制并自动化了。发现某个组占比过低，正确动作是补采那一部分数据、或者明确对该群体不做自动决策；不是调参数也不是加正则，那只能把偏差藏得更深。` },
  { t: `h2`, text: `演示 4 · 全局与局部：是谁在做决定` },
  { t: `code`, lang: `python`, code: `pi = permutation_importance(model, X_test, y_test, n_repeats=10, random_state=0)\nimp = pd.Series(pi.importances_mean, index=feature_names).sort_values(ascending=False)\nprint(imp.head(5).round(4))                                        # 全局\nprint(imp[imp.index.str.contains("gender|ethnic|zip|age", case=False)].round(4))\nbase = model.predict_proba(X_test.drop(index=0).mean().to_frame().T)[0][1]\nfor j in range(X_test.shape[1]):                                   # 局部：这一例\n    x = X_test.iloc[0].copy(); x.iloc[j] = X_test.drop(index=0)[j].mean()\n    print(feature_names[j], round(model.predict_proba(x.to_frame().T)[0][1] - base, 3))` },
  { t: `p`, text: `置换重要性的原理值得记住：把某一列打乱，看分数掉多少——掉的越多说明模型越靠它。这个打乱的动作正好也是识别伪相关的方法：分数对住院天数敏感、对病情指标不敏感，那它学的是流程特征而不是病理。第三行是偏见检查：敏感列排到前面，或者一个看似无害的列（邮编、学校、设备型号）其实是敏感属性的代理，同样报警。局部那一圈是逐特征换成平均水平后概率动多少，给单个个案一个可交代的理由。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `只看一个指标就下结论：accuracy 0.89 和某组 recall 0.45 可以同时成立`,
    `分组分得太细，每组剩十几条还照样算比率，然后拿去汇报`,
    `只按敏感列分组：偏见的载体常常是代理列（邮编、职业、设备），单看性别那一列会一切正常`,
    `把可解释性当装饰：先调模型再补解释，写出的是一个「合理」的理由，而不是模型真正的理由`,
    `以为仪表板能自动判定公平：它只告诉你误差在哪、谁被表示不足、什么列在起作用，这算不算不可接受是人和监管的事`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `给你已经做过的任意一个模型跑演示 1 和 2，找出最差子群，写清它是「样本少」还是「分数差」，各配一条处置`,
    `用演示 4 的全局重要度列表，挑出你认为可能是敏感属性代理的那一列，说明怀疑依据，再剔掉重训一次看子群分数差`,
    `为一个具体个案写出局部解释（三个最推高预测的列、两个拉低预测的列），交给不懂模型的人，问TA是否认为这个理由可信`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：模型坏了的信号从来不是整体分数低，而是四句——某个人群分数塌了、两个指标打架了、那群人在数据里本来就没几个、做决定的列刚好是敏感列或它的影子。` }
];
