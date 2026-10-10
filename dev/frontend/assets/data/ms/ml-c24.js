window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["ml-c24"] = [
  { t: `tip`, color: `blue`, text: `本课目标：用一张 8×8 棋盘把强化学习三件套（智能体、状态、动作）和一张 Q 表走通，重点是把那一步更新的数字算出来，看清奖励怎么往回倒灌。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `强化学习只有三样：一个智能体、一组状态、每个状态下一组动作；在某个状态做了某个动作，环境回一个数字，叫奖励。本课场景是彼与狼：8 乘 8 的棋盘，每格是地面、水、树或草、苹果（要吃）或狼（要躲），动作只有上下左右，目标是从随机起点摸到苹果。策略是输入状态返回动作的函数，最笨的随机走就是本课基线。麻烦在于奖励很稀：走一格给 -0.1，摸到苹果给 +10，撞狼、落水或走出棋盘给 -10 并立刻结束这一局。绝大多数步子上没有答案，好坏只在结尾揭晓，所以算法必须自己回溯——导向苹果的步抬高、导向被吃的压低。Q 表就是这份记账本，形状是宽 × 高 × 动作数，每格记「在这儿做这个动作有多好」；初始化成全相等的 0.25 就等于随机走的策略。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#fbfbfd"/><defs><marker id="a24" markerWidth="10" markerHeight="10" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#6b6b7b"/></marker></defs><text x="20" y="26" font-size="15" fill="#222">一次 Q 更新里数字怎么走</text><g font-size="14" text-anchor="middle"><rect x="30" y="52" width="70" height="52" rx="6" fill="#e8f0fb" stroke="#2471a3"/><text x="65" y="72" fill="#222">状态 s</text><text x="65" y="92" fill="#666">(x, y)</text><rect x="180" y="52" width="70" height="52" rx="6" fill="#e8f0fb" stroke="#2471a3"/><text x="215" y="72" fill="#222">状态 s'</text><text x="215" y="92" fill="#666">走过去之后</text><rect x="330" y="52" width="86" height="52" rx="6" fill="#eef7ee" stroke="#1e8449"/><text x="373" y="72" fill="#222">苹果</text><text x="373" y="92" fill="#1e8449">r = +10</text><rect x="480" y="52" width="86" height="52" rx="6" fill="#fbeeee" stroke="#c0392b"/><text x="523" y="72" fill="#222">狼 / 水</text><text x="523" y="92" fill="#c0392b">r = -10 局终</text></g><g stroke="#6b6b7b" stroke-width="2" fill="none"><line x1="100" y1="78" x2="178" y2="78" marker-end="url(#a24)"/><line x1="250" y1="78" x2="328" y2="78" marker-end="url(#a24)"/></g><text x="139" y="70" font-size="14" fill="#666" text-anchor="middle">动作 a</text><text x="289" y="70" font-size="14" fill="#666" text-anchor="middle">r(s')</text><rect x="30" y="126" width="580" height="46" rx="8" fill="#ffffff" stroke="#d8d8e3"/><text x="320" y="154" font-size="14" fill="#222" text-anchor="middle">Q(s,a) 新 = (1 − α)·Q(s,a) 旧 + α·( r(s') + γ · max Q(s', 所有动作) )</text><g font-size="14" fill="#333"><text x="30" y="200">普通一格：r = -0.1，下一格 max Q = 0.25，γ = 0.5 → 新值 0.025（走路是代价）</text><text x="30" y="226">摸到苹果：r = +10 → 那一格记成 10.375；下一局走到它前面那格，max 就是它</text><text x="30" y="252">于是前面那格拿到 -0.1 + 0.5 × 10.375 ≈ 5.09，再往前一格只剩约 2.4</text></g><text x="30" y="280" font-size="14" fill="#c0392b">功劳每隔一格乘一次 γ；要传得远就得跑很多局，这是「5000 局」的全部理由</text></svg>`, caption: `γ 是奖励的时间折扣：隔得越远的功劳传过去越小，γ 接近 0 时智能体只看得见脚下一步` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `没人给标注，只靠「走到苹果 +10、被吃 -10」这一条规矩，自己学会怎么走`,
    `给出可量化对照：随机走平均 30 到 40 步，学完 3 到 6 步，而最近苹果本来就是 5 到 6 步`,
    `把真实业务写成棋盘：状态是当下处境，动作是可选项，奖励是钱或风险`
  ] },
  { t: `h2`, text: `演示 1 · 棋盘、动作表和随机游走基线` },
  { t: `code`, lang: `python`, code: `from rlboard import *\nimport random, numpy as np\nwidth, height = 8, 8\nm = Board(width, height)\nm.randomize(seed=13)                       # 定种子，布局可复现\nactions = {"U": (0, -1), "D": (0, 1), "L": (-1, 0), "R": (1, 0)}\naction_idx = {a: i for i, a in enumerate(actions.keys())}\nm.plot()                                   # m.plot(Q) 会在每格画一个方向箭头` },
  { t: `p`, text: `动作存成坐标增量，R 就是 (1,0)。walk 的语义只有两条：踩到苹果返回步数 n，踩到狼或水返回 -1 表示这一局失败。基线是连续 100 局取统计：平均路径 30 到 40 步，而从任意位置到最近苹果只有 5 到 6 步——这两者的差就是这个游戏可学的空间。固定 seed 不是习惯而是必需：布局一变，步数就没有可比性。` },
  { t: `h2`, text: `演示 2 · 奖励函数：走路也要钱` },
  { t: `code`, lang: `python`, code: `move_reward, goal_reward, end_reward = -0.1, 10, -10\ndef reward(m, pos=None):\n    pos = pos or m.human\n    if not m.is_valid(pos): return end_reward                    # 走出棋盘\n    x = m.at(pos)\n    if x in (Board.Cell.water, Board.Cell.wolf): return end_reward\n    if x == Board.Cell.apple: return goal_reward\n    return move_reward\nQ = np.ones((width, height, len(actions)), dtype=np.float) / len(actions)   # 每格 0.25` },
  { t: `p`, text: `move_reward 是负的：一步就有成本，否则绕远路避狼和直线冲过去在总分上没区别；这个 -0.1 也防止无限游荡——累积奖励掉到阈值以下就强制结束这一局。Q 表初始化成 0.25 而不是 0：0.25 对应四个动作一样好，全 0 会让下面折概率的函数退化。` },
  { t: `h2`, text: `演示 3 · 一次更新，把数字算出来` },
  { t: `code`, lang: `python`, code: `alpha, gamma = 1.0, 0.5\nq_old, r, q_next_max = 0.25, -0.1, 0.25\nprint((1 - alpha) * q_old + alpha * (r + gamma * q_next_max))     # 0.025\nprint((1 - alpha) * 0.25 + alpha * (10 + gamma * 0.25))           # 10.375\nprint(-0.1 + 0.5 * 10.375)                                       # 5.0875：再往前一格` },
  { t: `p`, text: `三项含义：r(s') 是这一步立刻拿到的分，max Q(s') 是到了下一格之后最好的选择值多少，γ 决定后者打折多狠。(1-α) 与 α 是一个加权平均：α 等于 1 就是彻底用新值覆盖旧的，α 小就只挪一点。α 从 1 起随训练递减是标配——前期数据少，覆盖无所谓；后期 Q 表已有形状，一次噪声更新就能把攒下的格子冲掉。` },
  { t: `h2`, text: `演示 4 · 训练循环，和两种取动作的方式` },
  { t: `code`, lang: `python`, code: `def probs(v, eps=1e-4):\n    v = v - v.min() + eps\n    return v / v.sum()\nfor epoch in range(5000):                      # 5000 局，每局换一个随机起点\n    m.random_start(); n = 0; cum = 0\n    while True:\n        x, y = m.human\n        a = random.choices(list(actions), weights=probs(Q[x, y]))[0]; dp = actions[a]\n        m.move(dp, check_correctness=False); r = reward(m); cum += r\n        if r == end_reward or cum < -1000: break\n        Q[x, y, action_idx[a]] = (1 - alpha) * Q[x, y, action_idx[a]] + alpha * (r + gamma * Q[x + dp[0], y + dp[1]].max())\n        n += 1` },
  { t: `code`, lang: `python`, code: `def qpolicy_strict(m): return list(actions)[np.argmax(Q[m.human])]        # 只认最大\ndef qpolicy(m): return random.choices(list(actions), weights=probs(Q[m.human]))[0]\nprint_statistics(qpolicy_strict)               # 有时卡在两格之间来回，要手动中断\nprint_statistics(qpolicy)                       # 平均路径 3 到 6 步` },
  { t: `p`, text: `取样那行是最容易被忽略的设计：不取 argmax，而是按 Q 表折出的概率抽。开局所有格子一样，probs 给的是均匀分布，等于随机走；学得越久概率越往好处集中——探索和利用不用切换，是同一个公式的两个阶段。学完改用 strict 查表反而可能死循环：两个格子互相指向对方，智能体就在中间来回。还有一处顺序值得盯：判断 r == end_reward 就 break，而更新在它之后，也就是说走向狼的那个动作从来没被压低过；要真惩罚致命动作，得先把这次更新写进表再退出。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `alpha 用 exp(-n / 10e5) 这种按局内步数衰减：40 步的局子里它几乎恒等于 1，每步都在完全覆盖旧值，学习攒不下东西；衰减要按 epoch 记`,
    `越界时 Q[x + dp[0], y + dp[1]] 取到负索引，numpy 当成数组尾部的合法格子，读回毫不相干的值——这一课靠 break 在更新前挡住了，调换顺序就会踩到`,
    `奖励只在终点给、又不给每步成本：智能体学会无限游荡，因为它不会因为多走一步被扣钱`,
    `只盯平均路径不看被吃次数：路径短但每次撞狼，说明它在用失败换步数`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把演示 4 的 break 与更新调换顺序，各跑 100 局打印「被吃次数」，说明这一步为什么改变了策略`,
    `gamma 依次设 0.05、0.5、0.95 各跑一次，画出平均路径随局数的变化，指出哪一条中途突然变差、原因是什么`,
    `把 alpha 的衰减改成按 epoch 写（比如 exp(-epoch / 2000)），对比按 n 衰减，用图上「中途突刺」有没有被压掉来评价`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：Q 表不预测世界，它记账——每个动作的收益减去 γ 折扣后的未来，一局一局往回倒灌；账记歪一步，策略就歪在一类处境上。` }
];
