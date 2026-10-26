/* 喵站 · Git 入门（日更第 1 天：先落三课，之后每天补两课）
 *
 * 「开发工具」那一栏原先一门课都没有，这一门是第一个。
 * 结构照 python 那套的简化版：不分片，整份就是 boot（和 english / enwords 一样），
 * 所以 site.js 里不写 boot、不写 assemble、也不写 engine —— 这一版不排考。
 *
 * 写作口径（同 tools/写正文的规矩.md）：
 *   1. 正文里不出现反引号；代码名裸写或用「」括起来。
 *   2. 只许往回指（上一课、第 1 课），不许提前指后面的课号。
 *   3. 命令都用 Git 2.23 之后的写法：switch / restore，不用 checkout 兼职两件事。
 *   4. 每个代码块只演示真能照敲的东西；不确定的输出不写死在正文里。
 */
window.MIAO_GIT = {
  tutorial: {
    id: "git",
    title: "Git 入门",
    intro: "从「版本库到底存了什么」讲到分支合并：三课讲清三个区、四种撤回、一张便利贴式的分支。每课都有能当场照敲的命令，坑单列在明面上。",
    cat: "git",
    diff: "入门",
    tags: ["git", "版本库", "命令行"],
    author: "喵站官方",
    cover: "/assets/img/covers/git.svg",
    updated: "2026-10-21",
    chapters: [
      {
        id: "g01",
        title: "第 1 课 · 三个区：Git 到底把东西存在哪",
        blocks: [
          { t: "tip", color: "blue", text: "这一课只解决一件事：搞清版本库里存的是什么，以及 add 与 commit 各把东西搬到哪个区。装好 Git 就能跟着敲。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "Git 是装在你电脑上的一个命令行程序。它只做两件事：把文件的某个版本记下来，以后能按名字取回来。历史跟服务器没关系 —— 你把仓库里的 .git 目录删掉，历史就没了；把整个目录拷到另一台机器，历史跟着走。" },
          { t: "p", text: "版本库里有三个区。**工作区**是你正在编辑的那些文件；**暂存区**（英文 index）是一张名单，记着「下一版收哪些文件、各自是什么内容」；**版本库**是已经提交的历史，只往里加，不改旧的。" },
          { t: "p", text: "三个区的关系串成一条线：改文件动的是工作区，git add 把内容抄一份进暂存区，git commit 把暂存区里那张名单钉成一个版本。所以 add 和 commit 不是一件事 —— add 管「这一版包含什么」，commit 管「这一版叫什么、什么时候」。" },
          { t: "p", text: "一次提交是一份完整快照：那一刻所有被收进来的文件长什么样，加上作者、时间、说明，以及上一次提交的编号。听着很占地方，其实不会 —— Git 按内容给每份文件算一个编号，内容一样就只存一份。所以「每次都是全量」只花一份的钱。" },
          { t: "h2", text: "演示：从空目录走到第一次提交" },
          { t: "code", lang: "bash", code: "git config --global user.name \"你的名字\"\ngit config --global user.email \"you@example.com\"\n\nmkdir notebook && cd notebook\ngit init\necho \"1. 买菜\" > notes.txt\ngit add notes.txt\ngit commit -m \"第一次提交：记下三条待办\"" },
          { t: "p", text: "头两条 config 只跑一次，记在本机全局配置里。Git 每次提交都要写作者名和邮箱，没配就在 commit 那一刻拦你，报 Please tell me who you are —— 那不是在要账号，是在要一个署名。" },
          { t: "code", lang: "bash", code: "git status          # 谁被改了、谁已经进了暂存区\ngit add notes.txt   # 工作区 -> 暂存区\ngit status          # 同一份文件从「未暂存」挪到「待提交」\ngit commit -m \"补一条待办\"\ngit log --oneline   # 一行一个版本：短编号 + 说明" },
          { t: "p", text: "status 的两句话要分得清。Changes not staged for commit 是工作区改了、还没 add；Changes to be committed 是已经在暂存区、下一次 commit 就进去。看懂这两句，你就知道手上这堆改动下一秒会被怎么处理。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把 add 当成上传。它只往你本机的暂存区抄一份，全程不联网；真正跟远端打交道是 push 的事，这一版不讲。",
            "add 完又改了文件，以为改动一起进去。暂存区里存的是 add 那一刻的内容，之后改的得再 add 一次。",
            "commit 不带 -m。它会拉起一个文本编辑器让你写说明，不熟的人会卡在编辑器里退不出来 —— 想一句话解决就带 -m。",
            "看 log 只看到一片英文就关掉。git log --oneline 才是平时要用的形状：一行一个版本，短编号加说明。",
            "以为提交说明可以随便写。它是给三个月后的你看的：写「改了改」等于没写，写「补一条待办」才认得出这一版干了什么。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "按上面的演示走一遍：init、写一个文件、add、commit，再用 git log --oneline 确认历史里有一条。",
            "再改一行，分别在 add 之前和 add 之后各跑一次 git status，把两句话抄下来对照。",
            "只 add 其中一个文件，提交，然后用 git status 看另一个文件现在停在哪一格。"
          ]},
          { t: "tip", color: "green", text: "一句话：add 决定这一版装什么，commit 把它钉成一个能按名字取回的版本；三个区的分工就是这三句话。" }
        ]
      },
      {
        id: "g02",
        title: "第 2 课 · 撤回：先看清 diff，再决定动哪个区",
        blocks: [
          { t: "tip", color: "blue", text: "这一课的目标很具体：分清四种撤法，并且知道哪一种会真删你写过的字。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "撤回的本质是「拿 A 盖掉 B」。所以第一个动作永远不是敲撤回命令，而是看 diff —— 先确定自己站在哪一格，再决定盖哪个区。" },
          { t: "p", text: "git diff 比的是工作区与暂存区；git diff --staged 比的是暂存区与最后一次提交。两个都看一遍，你才知道手上这堆改动里哪些会被下一次 commit 收走、哪些还悬着。" },
          { t: "code", lang: "bash", code: "git diff              # 工作区 vs 暂存区：还没 add 的那部分\ngit diff --staged     # 暂存区 vs 上一次提交：下次 commit 要收的那部分\ngit log --oneline     # 先认准要退到哪一版" },
          { t: "p", text: "三种撤法，从轻到重。git restore 文件 用暂存区的内容盖工作区（没 add 过的改动会没）；git restore --staged 文件 把文件从暂存区名单里拿出来、内容一个字不动；git reset --soft HEAD~1 把上一次提交撤掉，改动留在暂存区。" },
          { t: "p", text: "最重的那个叫 git reset --hard。它连同工作区一起盖，没提交的改动直接没了。它不叫撤销，叫丢弃 —— 这一课把这条单独拎出来讲，因为在真实项目里，误敲一次就够你重写半小时。" },
          { t: "h2", text: "演示：三种撤回各走一遍" },
          { t: "code", lang: "bash", code: "# 1) 没 add 过：工作区改坏了，用暂存区那一份盖回去\ngit restore notes.txt\n\n# 2) 已经 add 了，但不想让它进这一版：只从名单里拿出，内容不动\ngit restore --staged notes.txt\n\n# 3) 提交了才发现说明写错、内容也不该在这一版\ngit reset --soft HEAD~1   # 退回上一次提交之前，改动还在暂存区\ngit status                # Changes to be committed 里看得到它们" },
          { t: "p", text: "提交过的东西还能救回来：git reflog 记着 HEAD 走过的每一站，包括那些已经被 reset 掉的提交。找到那一版的短编号，git reset --hard 那个编号 就回去了。" },
          { t: "code", lang: "bash", code: "git reflog            # 一串「HEAD@{n}: commit: 说明」，找那一版的编号\ngit reset --hard 1a2b3c4   # 回到那一版（编号换成 reflog 里看到的）" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "restore 不带 --staged 时默认盖工作区，一次丢光所有没 add 的改动。敲之前先跑 git status 看一眼。",
            "--soft 退掉的那次提交看起来「消失了」，其实内容全在暂存区；以为丢了又重写一遍，是最冤的一种浪费。",
            "把 --hard 当万能撤销。它盖的是工作区，reflog 只记提交、不记没提交的改动，那部分真找不回来。",
            "reflog 里找回提交后忘了看 status。回到旧版本后，当前分支的指针也变了，先确认自己站在哪，再继续干活。",
            "在公司的共享分支上随手 reset。改的是你自己本机那份历史，但只要动过已经推上去的提交，别人拉下来就会打架 —— 这一版不讲协作，先把本机这套弄明白。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "造一次三种撤回：先改文件不 add，restore；再改、add，restore --staged；再提交一次，reset --soft 退回来。每步都跑 status 对账。",
            "故意 reset --hard 丢一次提交，再用 reflog 找回来，把两次的 log --oneline 对比着抄下来。",
            "写一句话记下你的判断顺序：先看 diff，再决定动工作区还是暂存区，最后才想起 reset。"
          ]},
          { t: "tip", color: "green", text: "一句话：撤回是拿一个版本盖掉另一个区；diff 告诉你现在站在哪，restore 管小改，reset 管提交，--hard 是丢不是撤。" }
        ]
      },
      {
        id: "g03",
        title: "第 3 课 · 分支：一张写着「这条线停在哪」的便利贴",
        blocks: [
          { t: "tip", color: "blue", text: "这一课的目标：搞清分支不是拷贝，以及合并到底在接什么。最后你能自己开出分支、改完合回去。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "分支不是一个文件夹的副本，它就是一张便利贴：上面写着「这条线现在停在哪一次提交」。另有一张叫 HEAD 的便利贴，写着「你现在站在哪个分支上」。开一条新分支，就是多写一张便利贴 —— 所以它几乎不花时间和空间。" },
          { t: "p", text: "新建分支时，两张便利贴写的是同一个提交编号。你在这个分支上提交一次，只有这条分支的便利贴往前挪；另一条分支还停在原处。这就是「两条线」的全部含义：两个指针，各自往前挪。" },
          { t: "p", text: "合并做的事：找到两条线的分叉点，把分叉之后那些提交接过来。改的是不同文件或同一文件的不同行，Git 自己接；改到同一行，它停下来让你选 —— 这就是冲突。" },
          { t: "h2", text: "演示：开一条分支，改完合回去" },
          { t: "code", lang: "bash", code: "git switch -c fix-typos     # 从当前提交开一条新分支，并切过去\n# 改文件、add、commit 照第 1 课那套做\ngit switch main             # 回到主线\ngit merge fix-typos         # 把那条线的提交并进来\ngit log --oneline --graph   # 一张 ASCII 图，看分叉与汇合" },
          { t: "p", text: "冲突时，文件里会出现三段标记：一串小于号开头的是你当前分支的版本，一串等号下面是分叉点原来的内容，一串大于号开头的是要并进来的版本。留下你要的、把三行标记删掉，再 add + commit 收尾。" },
          { t: "code", lang: "bash", code: "# 冲突长这样（标记行本身也要删掉）\n<<<<<<< HEAD\n今天先写引言\n=======\n今天先写结论\n>>>>>>> fix-typos\n\n# 留下你要的那一行，删掉三行标记，然后：\ngit add notes.txt\ngit commit -m \"合并 fix-typos：采用结论先行的写法\"" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "忘了先切回主线就合并，等于把别的分支并进你脚下那条线 —— 方向并反了，历史形状也跟着乱。合并前先 git branch 看一眼星号在哪。",
            "冲突标记没删干净就提交。代码里留着那三行标记，编译或运行当场报错，而且错得莫名其妙。",
            "一边改一边切分支。没提交的改动会跟着你走（Git 不拦），切过去发现文件是脏的；要么先提交，要么先 restore。",
            "分支名带空格或中文标点。命令行里要转义才敲得动，图省事就用短横线连的英文名。",
            "以为合完分支就自动删了。分支便利贴还在，确认不要了再 git branch -d 删掉，删之前它一直占着那行 log。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "开一条分支改一行、合回主线，用 git log --oneline --graph 看清分叉点在哪。",
            "故意让两条线改同一行，造一次冲突，把三行标记按「留一行、删三行」处理完，再提交。",
            "用 git branch 看星号，解释它标的是哪张便利贴；再用 git switch 在没有未提交改动时切两次。"
          ]},
          { t: "tip", color: "green", text: "一句话：分支是一张会往前挪的便利贴，合并是把两条线在分叉点之后接起来；冲突不是故障，是 Git 把「这行该听谁的」交回给你。" }
        ]
      }
    ]
  }
};
