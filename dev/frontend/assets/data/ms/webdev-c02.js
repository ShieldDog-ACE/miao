window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["webdev-c02"] = [
  { t: `tip`, color: `blue`, text: `本课目标：弄清 Git 记的到底是什么，以及 GitHub 在这套机制上多加了哪一层——顺手把「提交、分支、合并」这条协作路径走通。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `Git 不是备份软件，它是一条快照链。每提交一次，它把当前整份项目抄一个副本，记下这次快照、父快照的指针、作者和一句话。所谓回退、比较、合并，都是在链上找节点做减法。正因为存的是快照而不是「改了什么」，链上任何一个节点都能被完整还原，这也是它比手动备份文件夹可靠的地方。` },
  { t: `p`, text: `一条链上有三个存放点：工作区是你正在改的文件，暂存区是你已经声明「这次要带上」的文件，仓库是落盘的快照。add 把改动从工作区推到暂存区，commit 把暂存区打成快照——这一步分成两条命令是有理由的：一次改了三处、只想提交其中一处时，你需要的正是这个中间层。GitHub 加的是第四处：一份能被别人 clone 走的远端链，push 只做搬运，不产生新快照。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 220" font-family="sans-serif"><text x="320" y="22" font-size="15" text-anchor="middle" fill="#22314e">一份改动的四次落脚</text><rect x="14" y="52" width="140" height="60" rx="6" fill="#eef4ff" stroke="#5b7fd1"/><text x="84" y="76" font-size="15" text-anchor="middle" fill="#22314e">工作区</text><text x="84" y="96" font-size="14" text-anchor="middle" fill="#22314e">你正在敲的文件夹</text><rect x="184" y="52" width="140" height="60" rx="6" fill="#e8f6ee" stroke="#3d9a63"/><text x="254" y="76" font-size="15" text-anchor="middle" fill="#1d4230">暂存区</text><text x="254" y="96" font-size="14" text-anchor="middle" fill="#1d4230">下一张快照的候选</text><rect x="354" y="52" width="140" height="60" rx="6" fill="#fdf0e6" stroke="#c2732b"/><text x="424" y="76" font-size="15" text-anchor="middle" fill="#5c3410">本地仓库</text><text x="424" y="96" font-size="14" text-anchor="middle" fill="#5c3410">.git 里的快照链</text><rect x="516" y="52" width="110" height="60" rx="6" fill="#f2f2f7" stroke="#6b6b85"/><text x="571" y="76" font-size="15" text-anchor="middle" fill="#2b2b3d">远端</text><text x="571" y="96" font-size="14" text-anchor="middle" fill="#2b2b3d">GitHub</text><line x1="154" y1="82" x2="182" y2="82" stroke="#8896ad" stroke-width="2"/><line x1="324" y1="82" x2="352" y2="82" stroke="#8896ad" stroke-width="2"/><line x1="494" y1="82" x2="514" y2="82" stroke="#8896ad" stroke-width="2"/><text x="168" y="72" font-size="14" text-anchor="middle" fill="#6b7c93">add</text><text x="338" y="72" font-size="14" text-anchor="middle" fill="#6b7c93">commit</text><text x="504" y="72" font-size="14" text-anchor="middle" fill="#6b7c93">push</text><rect x="14" y="140" width="480" height="56" rx="6" fill="none" stroke="#c7d0de" stroke-dasharray="5 4"/><text x="34" y="164" font-size="14" fill="#3d4c66">链上每个点都存了整份项目的样子，</text><text x="34" y="184" font-size="14" fill="#3d4c66">所以 git diff 比的是两份快照，git revert 做的是倒着补一张快照。</text></svg>`, caption: `三处存放加一个远端：四条命令各自只管跨过一条边界。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `把「昨天还能跑」的那个版本原样找回来，不靠运气和文件名里的 final2`,
    `同时试两种做法：各开一条分支，试错的成本被关在分支里`,
    `换一台电脑继续干活，代码跟着仓库走而不是跟着人走`,
    `给别人的项目递改动：你动的是自己账号里的那份副本，维护者自己决定收不收`,
    `留下可查的现场：出了问题能定位到是哪一次提交引入的`
  ] },
  { t: `h2`, text: `演示 1 · 从一个文件夹到一个仓库` },
  { t: `code`, lang: `shell`, code: `git --version` +
`\ngit config --global user.name "你的名字"` +
`\ngit config --global user.email "you@example.com"` +
`\n\ncd my-project` +
`\ngit init` +
`\ngit add .` +
`\ngit commit -m "chore: 初始提交"` +
`\ngit remote add origin git@github.com:you/my-project.git` +
`\ngit push -u origin main` },
  { t: `p`, text: `前四行是一次性的身份配置，提交记录里的作者就来自这里。remote add 起的那个名字叫 origin，是「这个仓库的远端」的代号，之后 pull 和 push 不用再写全地址。push 后面那个 -u 把本地 main 和远端 main 绑起来，从此只写 git push 就够了。` },
  { t: `h2`, text: `演示 2 · 日常三步与看现场` },
  { t: `code`, lang: `shell`, code: `git status            # 现在哪些改动没暂存、哪些已暂存` +
`\ngit diff              # 还没 add 的部分，逐行看` +
`\ngit add src/app.js    # 只暂存这一个文件` +
`\ngit diff --staged     # 确认这次快照到底要带什么` +
`\ngit commit -m "fix: 修正空列表时的除零"` +
`\ngit log --oneline -5  # 最近五个快照` +
`\ngit restore --staged src/app.js   # 把暂存的东西退回工作区` },
  { t: `p`, text: `提交信息这行值得单独说。判断标准只有一条：把首行填进「If applied, this commit will ___」这句话，读起来通顺才算合格——所以是 change 不是 changed。feat、fix、docs 这类前缀是 Conventional Commits 的约定，好处是半年后翻 log 时能一眼分类。正文写为什么改、和旧行为差在哪，怎么改的代码自己会说明。` },
  { t: `h2`, text: `演示 3 · 分支与一次真实冲突` },
  { t: `code`, lang: `shell`, code: `git switch -c add-dark-mode   # 建分支并切过去` +
`\ngit branch --show-current` +
`\ngit commit -m "feat: 深色模式开关"` +
`\ngit switch main` +
`\ngit merge add-dark-mode` +
`\n# 报 CONFLICT 时文件里会出现这三段：` +
`\n# <<<<<<< HEAD` +
`\n# 这里的行属于 main` +
`\n# =======` +
`\n# 这里的行属于 add-dark-mode` +
`\n# >>>>>>> add-dark-mode` +
`\ngit status   # 它会直接列出还在冲突的文件` },
  { t: `p`, text: `冲突不是错误，是 Git 拒绝替你猜。两条分支动了同一片行，它把两边都摊在你面前，删掉标记、留哪边或怎么写新逻辑，由你决定；改完再 add 加 commit，这次合并才算完成。` },
  { t: `h2`, text: `演示 4 · 往别人的项目递一次改动` },
  { t: `code`, lang: `shell`, code: `git clone https://github.com/someone/project.git   # 先 Fork 再 clone 自己的那份` +
`\ngit switch -c fix-typo` +
`\n# 改 README 里一个错字，只改这一件事` +
`\ngit commit -m "docs: 修正拼写"` +
`\ngit push -u origin fix-typo` +
`\n# 然后在网页上发 Pull Request，等维护者 review` },
  { t: `p`, text: `这条路上最容易被忽略的是「一次改动只做一件事」：同时夹带修 bug、加功能和改测试，维护者要么全收要么全拒，多半全拒。自己给自己干活也照这个流程走，commit 落在哪条分支上，git status 第一行就写着。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `把密钥、token、密码提交进仓库：删掉记录也要重写历史，公开仓库里等于已经泄露`,
    `node_modules 或构建产物先提交了再加 .gitignore：忽略文件管不了已经进了快照的东西，得先 git restore --staged`,
    `提交信息写「update」「fix bug」：等于把定位问题的责任推给未来的自己`,
    `在 main 上直接改：一旦想试别的路径，脏改动会把切分支都挡住`,
    `用 git push --force 盖掉远端：别人推的东西会静悄悄消失，非共享分支不要碰`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把演示 1 走完，然后用 git log 找到你那次提交，说出它的父快照是哪一个`,
    `故意在两条分支上改同一个文件的同一行，合并一次，把冲突文件改成你真正想要的样子`,
    `给最近三次提交重写信息：先用 git status 和 git diff 想清楚，再按首行那句填空法检查是否通顺`,
    `挑一个你常用的开源项目，读它的 CONTRIBUTING 和 issue 列表，找出一个你能改的小事`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：add 决定快照里有什么，commit 决定这次为什么改，push 只是把已有的链搬到别人看得见的地方。` }
];
