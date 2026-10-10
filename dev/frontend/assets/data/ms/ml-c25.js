window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["ml-c25"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把上一课手搓的棋盘换成 Gym 的物理仿真 CartPole，学会跟一个环境对话——reset、step、观测、奖励、done，再把连续状态折进 Q 表。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `上一课的 8×8 棋盘是给定规则加离散状态，真实处境常常是连续的。CartPole 就是这种：小车能在轨道上左右推，车上立一根杆，目标是别让杆倒。Gym 把这类仿真环境做成了一个库，每个环境对外只暴露两样东西：observation space（每步告诉我什么）和 action space（每步能选什么）。这里的观测是四个实数——位置、速度、角度、角速度，动作是 Discrete(2)：向左推或向右推。对话只有一个循环：reset 拿到起始观测，之后每步把动作喂给 step，它回给你新观测、奖励、done 和附加信息。done 是杆倒了或车跑出边界；奖励恒定是 1.0，目标就是活得久，累积奖励正好等于撑过的步数。套上一课的 Q 学习，卡点在 Q 表的形状：它要求状态可数，而每个状态现在是四个实数。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#fbfbfd"/><defs><marker id="a25" markerWidth="10" markerHeight="10" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#6b6b7b"/></marker></defs><text x="20" y="26" font-size="15" fill="#222">一次 step 里有三样东西在动</text><rect x="40" y="44" width="150" height="56" rx="8" fill="#e8f0fb" stroke="#2471a3"/><text x="115" y="70" font-size="14" fill="#222" text-anchor="middle">环境 env</text><text x="115" y="90" font-size="13" fill="#666" text-anchor="middle">物理自己算</text><rect x="290" y="44" width="150" height="56" rx="8" fill="#eef7ee" stroke="#1e8449"/><text x="365" y="70" font-size="14" fill="#222" text-anchor="middle">我的策略</text><text x="365" y="90" font-size="13" fill="#666" text-anchor="middle">查 Q 表 or 随机</text><g stroke="#6b6b7b" stroke-width="2" fill="none"><path d="M288 60 L192 60" marker-end="url(#a25)"/><path d="M192 84 L288 84" marker-end="url(#a25)"/></g><text x="240" y="52" font-size="13" fill="#2471a3" text-anchor="middle">action 0/1</text><text x="240" y="118" font-size="13" fill="#1e8449" text-anchor="middle">obs, rew, done, info</text><g font-size="14"><rect x="40" y="150" width="560" height="1" fill="#d8d8e3"/><text x="40" y="176" fill="#222">观测 [0.034 -0.243 0.027 0.290] → 除以 [0.25 0.25 0.01 0.1] 取整 → 状态 (0, -1, 2, 2)</text><text x="40" y="204" fill="#c0392b">Q 表不再是数组，而是字典：Q[(状态, 动作)] = 值，查不到当 0</text><text x="40" y="232" fill="#333">更新还是那一条：Q(s,a) ← (1-α)·Q(s,a) + α·( rew + γ · max Q(s', 所有动作) )</text><text x="40" y="262" fill="#666">rew 恒等于 1.0，所以「未来的奖励」= 还能多撑几步；γ 调小，就只看得见下一步</text></g></svg>`, caption: `环境的返回把状态、奖励、终止一起交给你；Q 表能不能用，取决于你先把连续观测折成了几个格子` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `换一个环境名就能拿到另一套物理或另一批游戏：classic control 那一组、Atari 都是同一个接口`,
    `把「撑了多少步」直接当成绩看，不需要人工标注什么是对什么是错`,
    `把真实处境写成观测向量（温度、库存、余额）加两个动作（开/关、加/减）`
  ] },
  { t: `h2`, text: `演示 1 · 先问环境两件事：你能看什么、能做什么` },
  { t: `code`, lang: `python`, code: `import gym, numpy as np, random\nenv = gym.make("CartPole-v1")\nprint(env.action_space)            # Discrete(2)：向左推、向右推\nprint(env.observation_space)       # Box：4 个实数，边界不全是有限的\nprint(env.action_space.sample())   # 0 或 1\nprint(env.observation_space.low, env.observation_space.high)` },
  { t: `p`, text: `位置和角度有边界，速度和角速度那一栏是正负无穷。上一课的 (x, y) 天然只有 64 个值，这里两个维度没有上界，开数组当 Q 表就得先把边界定下来——先读 low 和 high 再选离散化方案，不是仪式。` },
  { t: `h2`, text: `演示 2 · 空跑一局，看清 step 返回什么` },
  { t: `code`, lang: `python`, code: `obs = env.reset()\ndone, steps, total = False, 0, 0.0\nwhile not done:\n    # env.render()                 # 想看画面就打开，训练时注释掉，快很多\n    obs, rew, done, info = env.step(env.action_space.sample())\n    steps += 1; total += rew\nprint("撑了", steps, "步, 累积奖励", total)\nprint(obs)                         # 位置 速度 角度 角速度\nprint([round(float(v), 2) for v in obs])` },
  { t: `p`, text: `随机推几十步就倒，每一行的 rew 都是 1.0：不倒就 +1，倒了 done 变 True。render 平时要关掉——渲染一帧比仿真一步贵得多，跑十万局时它就是主要开销。` },
  { t: `h2`, text: `演示 3 · 把实数折成状态，两种折法` },
  { t: `code`, lang: `python`, code: `def discretize(x):                        # 线性折：0 还是 0，允许负数\n    return tuple((np.asarray(x) / np.array([0.25, 0.25, 0.01, 0.1])).astype(int))\ndef create_bins(i, num):                  # 或者按已知区间切格子\n    return np.arange(num + 1) * (i[1] - i[0]) / num + i[0]\nints = [(-5, 5), (-2, 2), (-0.5, 0.5), (-2, 2)]\nnbins = [20, 20, 10, 10]\nbins = [create_bins(ints[i], nbins[i]) for i in range(4)]\ndef discretize_bins(x):                   # 返回第几格，0 附近得到中间那一格（10）\n    return tuple(np.digitize(x[i], bins[i]) for i in range(4))\nQ = {}                                    # 状态数不知道 → 用字典而不是数组\ndef qvalues(s): return [Q.get((s, a), 0) for a in (0, 1)]` },
  { t: `p`, text: `digitize 的格子编号从 0 起，输入接近 0 时拿到中间那一格（10），状态数被 20×20×10×10 钉死，可以放心开数组；除法取整不做偏移，正负都用，代价是状态数没有上界，所以这里改用字典——键是 (状态元组, 动作)，查不到返回 0。Q.get((s,a), 0) 就是字典版 Q 表的全部魔法，也是它和上一课唯一的写法区别。` },
  { t: `h2`, text: `演示 4 · 训练循环：三个数字之外，还要留住最好那张表` },
  { t: `code`, lang: `python`, code: `alpha, gamma, epsilon = 0.3, 0.9, 0.90\nQmax, cum_rewards, rewards = 0, [], []\nfor epoch in range(100000):\n    obs = env.reset(); done = False; cum = 0\n    while not done:\n        s = discretize(obs)\n        if random.random() < epsilon:                      # 九成：利用，按 Q 表概率抽\n            a = random.choices((0, 1), weights=probs(np.array(qvalues(s))))[0]\n        else: a = np.random.randint(env.action_space.n)    # 一成：探索，等于随机挨一拳\n        obs, rew, done, info = env.step(a); cum += rew\n        Q[(s, a)] = (1 - alpha) * Q.get((s, a), 0) + alpha * (rew + gamma * max(qvalues(discretize(obs))))\n    rewards.append(cum); cum_rewards.append(cum)` },
  { t: `code`, lang: `python`, code: `    if epoch % 5000 == 0:                                  # 接在上面的 for 里面\n        avg = np.average(cum_rewards)\n        if avg > Qmax: Qmax, Qbest = avg, dict(Q)          # 记住训练至今最好的那份\n        print(epoch, avg, alpha, epsilon); cum_rewards = []\nrun_avg = lambda x, w: np.convolve(x, np.ones(w) / w, mode="valid")\nplt.plot(run_avg(rewards, 100))                            # 原始曲线什么都读不出来` },
  { t: `p`, text: `三个数字和上一课不同，每个都有理由。alpha 恒定 0.3：一个格子里挤着很多真实处境，一次更新只该挪三成，不该用 1 覆盖旧值。gamma 提到 0.9：奖励是每步 1 分的长期存活，折扣太小智能体就不在乎再多撑 50 步。epsilon 要当心——在这份代码里它是利用的概率，九成按表走、一成随机推；多数教材把 ε 定义成探索概率，方向正好相反，抄代码前先看清比较号朝哪边。这里每 5000 局报一次平均，而 solved 的口径是连续 100 局平均 195，两者不是一回事。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `四元组解包 obs, rew, done, info 在新版 gym 上直接报 ValueError：step 回五个值（terminated 与 truncated 分开），reset 也多回一个 info`,
    `把 epsilon 按教科书语义理解，九成随机、一成查表，训练十万局也学不出来`,
    `格子太粗，杆倾斜 0.01 弧度和 0.09 弧度被当成同一个状态；太细则每格只被访问一两次，Q 值全是噪声`,
    `越界的观测被折进最边那一格，和真正待在那一格的处境混在一起，状态开始互相污染`,
    `用最后一局的 Q 表当成果而不看 Qbest：后期把表改坏之后你评估的是坏了的那份`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把演示 3 换成 discretize_bins、Q 改成 20×20×10×10×2 的数组重跑，比较两种折法各跑多少局才到 195`,
    `按代码里的语义把 epsilon 改成 0.5 和 0.99 各跑一次，用平滑曲线说明哪一条更容易中途塌下去`,
    `把动作选择换成 argmax 取最大 Q 值：说明为什么完全不再探索会让偶发的倒杆无法被记账`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：跟环境对话只有一个循环——动作进去、观测和奖励出来；剩下的难度全在「你怎么把四个实数折成有限的格子」，因为 Q 表只能记住可数的事。` }
];
