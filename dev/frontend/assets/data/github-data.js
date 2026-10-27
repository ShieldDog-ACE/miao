/* 喵站 · GitHub 入门（2026-10-27 补全分类教程；12 课单文件）
 * 课式：是什么 → 装工具 → 第一个可验证动作 → 一课一个概念。
 * 命令按 GitHub 2024 之后的界面写；不写需要联网才能确认的输出。 */
window.MIAO_GITHUB = {
  tutorial: {
    id: "github",
    title: "GitHub 入门",
    intro: "从 Git 托管讲到 Pull Request、Pages 与 Actions：12 课把远程协作的常用动作走完，每课都有能照敲的命令和一张流程图。",
    cat: "github",
    diff: "入门",
    tags: ["GitHub", "Git", "协作", "入门"],
    author: "喵站官方",
    cover: "/assets/img/covers/github.svg",
    updated: "2026-10-27",
    chapters: [
      {
        id: "gh01",
        title: "第 1 课 · GitHub 的历史：从 Git 托管到协作平台",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：知道 GitHub 解决的是「代码放在哪、别人怎么一起改」这两个问题，以及它和 Git 的区别。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "Git 是 2005 年 Linus Torvalds 为 Linux 内核写的版本控制工具。它把历史存在你本机的 .git 目录里，不依赖服务器。问题是：团队要把代码放在同一个地方，还要让每个人看到别人改了什么 —— Git 本身不提供这个网站。" },
          { t: "p", text: "2008 年，Tom Preston-Werner、Chris Wanstrath 和 P. J. Hyett 做了 GitHub：把 Git 仓库托管到网上，再加上网页浏览、Issue、Pull Request 这些协作功能。2018 年微软收购 GitHub，2020 年起核心功能对私有仓库免费。今天它不只是放代码的地方，还是开源项目、自动化流水线和作品集的入口。" },
          { t: "p", text: "要分清两层：Git 是版本控制工具，装在你电脑上；GitHub 是一个托管 Git 仓库的网站。你可以在本地用 Git 提交一百次，一次也不联网；也可以把仓库放到 GitHub，让同事拉下来。Push 是把本地提交送上去，Pull 是把远程提交拿下来。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "把本地项目放到网上，换一台电脑 git clone 就能继续写。",
            "用 Issue 记下要修的问题，用 Pull Request 让别人审你的改动。",
            "用 GitHub Pages 把静态网页直接发布出去。",
            "用 Actions 在每次 push 后自动跑测试、打包、部署。"
          ]},
          { t: "h2", text: "演示：先认清两个名字" },
          { t: "p", text: "打开一个仓库页面，地址通常长这样。前半段是账号名，后半段是仓库名。这个地址既能用浏览器打开，也能作为 git clone 的参数。" },
          { t: "code", lang: "text", code: "https://github.com/用户名/仓库名\n\n# 对应的克隆地址（SSH 写法）\ngit@github.com:用户名/仓库名.git" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef1f6\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#161b22\">GitHub 的三个时间点</text><rect x=\"76\" y=\"108\" width=\"132\" height=\"58\" rx=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"142\" y=\"132\" font-size=\"16\" text-anchor=\"middle\" fill=\"#161b22\">2008</text><text x=\"142\" y=\"154\" font-size=\"14\" text-anchor=\"middle\" fill=\"#57606a\">网站上线</text><rect x=\"254\" y=\"108\" width=\"132\" height=\"58\" rx=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"320\" y=\"132\" font-size=\"16\" text-anchor=\"middle\" fill=\"#161b22\">2018</text><text x=\"320\" y=\"154\" font-size=\"14\" text-anchor=\"middle\" fill=\"#57606a\">并入微软</text><rect x=\"432\" y=\"108\" width=\"132\" height=\"58\" rx=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"498\" y=\"132\" font-size=\"16\" text-anchor=\"middle\" fill=\"#161b22\">今天</text><text x=\"498\" y=\"154\" font-size=\"14\" text-anchor=\"middle\" fill=\"#57606a\">代码 + 协作 + 流水线</text><path d=\"M208 137H250\" stroke=\"#24292f\" stroke-width=\"3\"/><path d=\"M386 137H428\" stroke=\"#24292f\" stroke-width=\"3\"/></svg>", caption: "GitHub 把 Git 的历史搬上网，又在上面长出了 Issue、PR、Pages、Actions。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把 Git 和 GitHub 当成同一个东西。没有 GitHub，Git 照样能在本地工作。",
            "以为 GitHub 只放开源代码。私有仓库也能免费用，公开还是私有在建仓时选。",
            "把「下载 ZIP」当成 clone。ZIP 没有 .git 目录，拿不到历史，也不能直接 push。",
            "以为提交到本地就等于备份好了。本地磁盘坏了，没 push 的提交一样会丢。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "用一句话分别解释 Git 和 GitHub，要求两个句子里不能出现同一个动词。",
            "打开任意一个公开仓库，指出地址里的账号名和仓库名各是哪一段。",
            "说出 push 和 pull 的方向：谁把提交送到哪，谁把提交拿回来。"
          ]},
          { t: "tip", color: "green", text: "一句话：Git 管历史，GitHub 管「历史放在哪、别人怎么一起改」；push 送上去，pull 拿下来。" }
        ]
      },
      {
        id: "gh02",
        title: "第 2 课 · 注册账号、装 Git 和配置 SSH",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：装好 Git、注册 GitHub、生成一对 SSH 密钥并挂到账号上，最后用 ssh -T 验证通过。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "Git 的命令行工具要单独装。装完先配两项全局信息：user.name 和 user.email。它们会写进每一次提交，方便别人知道这一版是谁做的。邮箱最好用你 GitHub 账号里验证过的那个，否则提交不会关联到你的头像。" },
          { t: "p", text: "GitHub 支持两种认证：HTTPS 用账号密码或 token，SSH 用一对密钥。SSH 的好处是配一次之后不用每次输密码。密钥分私钥和公钥：私钥留在你电脑的 ~/.ssh 目录，绝不外传；公钥可以公开，挂到 GitHub 的 SSH keys 页面。" },
          { t: "p", text: "生成密钥时 ssh-keygen 会问你保存路径和口令。路径直接回车用默认值，口令可以留空，也可以设一个 —— 设了口令每次用密钥要输一次，但私钥被拿走时多一层保护。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "配好之后，git clone、git push、git pull 走 SSH 地址都不再问账号密码。后面每节课的远程操作都依赖这一步。" },
          { t: "h2", text: "演示 1 · 装 Git 并配置身份" },
          { t: "code", lang: "bash", code: "sudo apt update\nsudo apt install -y git\ngit --version\n\ngit config --global user.name \"你的名字\"\ngit config --global user.email \"you@example.com\"\ngit config --global --list" },
          { t: "p", text: "前两条装 Git，第三条看版本。后三条写入全局配置，最后一条把配置列出来核对。名字和邮箱换成你自己的，别照抄示例。" },
          { t: "h2", text: "演示 2 · 生成 SSH 密钥并验证" },
          { t: "code", lang: "bash", code: "ssh-keygen -t ed25519 -C \"you@example.com\"\ncat ~/.ssh/id_ed25519.pub\n# 把输出的整行公钥复制到 GitHub：Settings -> SSH and GPG keys -> New SSH key\nssh -T git@github.com" },
          { t: "p", text: "ssh -T 第一次会问是否信任 github.com，输入 yes。成功时终端会打印一句带你用户名的欢迎语；如果提示 permission denied，多半是公钥没挂对或私钥不在默认路径。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef1f6\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#161b22\">SSH 认证：私钥签名，公钥验签</text><rect x=\"64\" y=\"104\" width=\"150\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"139\" y=\"130\" font-size=\"15\" text-anchor=\"middle\" fill=\"#161b22\">本机私钥</text><text x=\"139\" y=\"151\" font-size=\"13\" text-anchor=\"middle\" fill=\"#57606a\">id_ed25519</text><path d=\"M218 136H294\" stroke=\"#24292f\" stroke-width=\"3\"/><polygon points=\"294,136 284,130 284,142\" fill=\"#24292f\"/><rect x=\"302\" y=\"104\" width=\"150\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"377\" y=\"130\" font-size=\"15\" text-anchor=\"middle\" fill=\"#161b22\">GitHub 公钥</text><text x=\"377\" y=\"151\" font-size=\"13\" text-anchor=\"middle\" fill=\"#57606a\">id_ed25519.pub</text><path d=\"M456 136H514\" stroke=\"#24292f\" stroke-width=\"3\"/><polygon points=\"514,136 504,130 504,142\" fill=\"#24292f\"/><text x=\"552\" y=\"132\" font-size=\"15\" text-anchor=\"middle\" fill=\"#161b22\">通过</text><text x=\"552\" y=\"152\" font-size=\"13\" text-anchor=\"middle\" fill=\"#57606a\">ssh -T</text></svg>", caption: "私钥不出本机；GitHub 只存公钥，用来验证签名。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把私钥 id_ed25519 复制到 GitHub。要复制的是带 .pub 的公钥，私钥泄露等于别人能冒充你。",
            "user.email 用了没验证的邮箱，提交在 GitHub 上不显示头像。",
            "ssh -T 提示 permission denied 就反复重装。先用 ssh -vT git@github.com 看它拿了哪把钥匙。",
            "在公司的共享电脑上生成密钥还不设口令。要么设口令，要么别在这台机器上挂账号。",
            "把 ~/.ssh 目录权限改得太开。SSH 会因为权限过松拒绝使用私钥，保持 700 即可。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "装好 Git，把 git --version 的输出抄下来。",
            "生成一对 SSH 密钥，把公钥挂到 GitHub，再用 ssh -T git@github.com 看到欢迎语。",
            "用 git config --global --list 检查 user.name 和 user.email，确认不是示例值。"
          ]},
          { t: "tip", color: "green", text: "一句话：Git 配身份，SSH 配钥匙；私钥留本机，公钥挂 GitHub，ssh -T 通过就能免密推拉。" }
        ]
      },
      {
        id: "gh03",
        title: "第 3 课 · 第一个远程仓库：init → remote → push",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：把本地一个空目录变成 GitHub 上的仓库，并完成第一次 push。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "本地仓库和远程仓库是两份独立的历史。git init 在本地建一个 .git 目录；在 GitHub 网页上新建仓库，是在服务器上建另一份。git remote add origin 给远程地址起一个短名字，约定俗成叫 origin；git push 把本地提交送上去。" },
          { t: "p", text: "第一次 push 要加 -u，意思是「把本地 main 分支和 origin/main 绑成默认上下游」。之后直接 git push、git pull 就知道该找谁。不加 -u 也能推，但每次都要写完整参数。" },
          { t: "p", text: "默认分支名可能是 main 也可能是 master，取决于 Git 版本和建仓时的选择。两边名字不一致时，push 会失败或建出一条新分支。最稳的做法是本地先 git branch -M main，再把 GitHub 仓库的默认分支也设成 main。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "p", text: "完成这一步，你的代码就有了一个离机备份和可分享的地址。后面 clone、分支、PR 都建立在这条远程连接上。" },
          { t: "h2", text: "演示 1 · 本地提交" },
          { t: "code", lang: "bash", code: "mkdir hello-github\ncd hello-github\ngit init\necho \"# hello-github\" > README.md\ngit add README.md\ngit commit -m \"第一次提交：添加 README\"\ngit branch -M main" },
          { t: "p", text: "git init 之后目录里多了一个 .git。echo 写一个 README，add 把它放进暂存区，commit 钉成第一个版本，branch -M main 把当前分支改名为 main。" },
          { t: "h2", text: "演示 2 · 接上远程并推送" },
          { t: "code", lang: "bash", code: "# 先在 GitHub 网页新建一个空仓库，不要勾选自动生成 README\ngit remote add origin git@github.com:用户名/hello-github.git\ngit remote -v\ngit push -u origin main" },
          { t: "p", text: "git remote -v 会打印两行：fetch 和 push 各一条，地址相同。push -u 成功后，刷新 GitHub 页面就能看到 README 和那次提交。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef1f6\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#161b22\">本地 → 远程的三步</text><rect x=\"60\" y=\"104\" width=\"130\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"125\" y=\"130\" font-size=\"15\" text-anchor=\"middle\" fill=\"#161b22\">本地仓库</text><text x=\"125\" y=\"151\" font-size=\"13\" text-anchor=\"middle\" fill=\"#57606a\">.git + 提交</text><path d=\"M194 136H254\" stroke=\"#24292f\" stroke-width=\"3\"/><polygon points=\"254,136 244,130 244,142\" fill=\"#24292f\"/><rect x=\"262\" y=\"104\" width=\"130\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"327\" y=\"130\" font-size=\"15\" text-anchor=\"middle\" fill=\"#161b22\">origin</text><text x=\"327\" y=\"151\" font-size=\"13\" text-anchor=\"middle\" fill=\"#57606a\">远程地址的短名</text><path d=\"M396 136H456\" stroke=\"#24292f\" stroke-width=\"3\"/><polygon points=\"456,136 446,130 446,142\" fill=\"#24292f\"/><rect x=\"464\" y=\"104\" width=\"120\" height=\"64\" rx=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"524\" y=\"130\" font-size=\"15\" text-anchor=\"middle\" fill=\"#161b22\">GitHub</text><text x=\"524\" y=\"151\" font-size=\"13\" text-anchor=\"middle\" fill=\"#57606a\">main 分支</text></svg>", caption: "origin 只是远程地址的别名；push 把本地 main 的提交送到 origin/main。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "在 GitHub 建仓时勾了自动生成 README，本地又有一个 README，第一次 push 会因历史不同被拒。",
            "远程地址用了 HTTPS 却还没配 token，push 时被要求输密码。要么换 SSH，要么配 personal access token。",
            "本地分支叫 master，远程默认分支叫 main，push 之后出现两条分支。先统一名字再推。",
            "忘了 -u，之后每次 push 都要写 origin main。补一次 git push -u origin main 即可。",
            "把 .env 或密钥提交上去。提交前跑 git status，确认没有不该进仓库的文件。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "按演示建一个本地仓库，完成第一次 commit，把 git log --oneline 的输出抄下来。",
            "在 GitHub 建一个空仓库，接上 origin，完成第一次 push，刷新页面确认 README 在。",
            "用 git remote -v 看 fetch 和 push 两行，解释 origin 这个名字是谁起的。"
          ]},
          { t: "tip", color: "green", text: "一句话：init 建本地历史，remote 给远程起名，push -u 把两边绑成默认上下游。" }
        ]
      },
      {
        id: "gh04",
        title: "第 4 课 · origin、clone 与 pull",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：分清 clone、fetch、pull 三个动作，能在两台机器之间同步同一个仓库。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "clone 是「把远程仓库完整拿下来，并在本地建好 origin」。它只做一次，之后你在本地有了完整历史，可以离线提交。fetch 是「把远程的新提交拿下来，但不改你当前的工作区」；pull 是 fetch 之后再做一次合并，把远程的改动并进你脚下这条分支。" },
          { t: "p", text: "origin/main 是一个远程跟踪分支，它记录「上次 fetch 时远程 main 停在哪」。你本地的 main 和 origin/main 可以暂时不同步，git status 会告诉你 ahead、behind 还是 diverged。看懂这三个词，就知道该 push、pull 还是先合并。" },
          { t: "p", text: "两台机器协作的典型节奏：A 改完 push；B 先 pull 再改，改完 push。如果 B 在 pull 之前也提交了，两边历史分叉，pull 会触发合并或提示冲突。先 pull 再动手，能避免大部分麻烦。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "换一台电脑，clone 下来就能接着写，不用拷 U 盘。",
            "同事 push 了新提交，你 pull 一下就能看到。",
            "想先看看远程改了什么再决定合不合，用 fetch 更稳。",
            "用 git status 判断本地和远程谁领先。"
          ]},
          { t: "h2", text: "演示 1 · clone 与查看远程" },
          { t: "code", lang: "bash", code: "git clone git@github.com:用户名/hello-github.git\ncd hello-github\ngit remote -v\ngit status\ngit log --oneline -3" },
          { t: "p", text: "clone 会自动把 origin 配好，不需要再 remote add。git status 第一行会写 On branch main 和 Your branch is up to date with origin/main。" },
          { t: "h2", text: "演示 2 · fetch 与 pull 的区别" },
          { t: "code", lang: "bash", code: "# 先看远程有没有新东西，不改工作区\ngit fetch\ngit status\n\n# 确认后再合并进当前分支\ngit pull\n\n# 只看远程分支的提交\ngit log --oneline origin/main -3" },
          { t: "p", text: "fetch 之后 status 会提示 behind，工作区文件还没变；pull 之后文件才更新。如果本地有未提交的改动，pull 可能被拒绝，先 commit 或 stash 再拉。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef1f6\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#161b22\">三份历史：远程、本机 A、本机 B</text><rect x=\"72\" y=\"100\" width=\"496\" height=\"34\" rx=\"8\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"320\" y=\"123\" font-size=\"14\" text-anchor=\"middle\" fill=\"#161b22\">origin/main：提交 1 → 提交 2 → 提交 3</text><rect x=\"72\" y=\"146\" width=\"300\" height=\"32\" rx=\"8\" fill=\"#ffffff\" stroke=\"#57606a\" stroke-width=\"2\"/><text x=\"222\" y=\"168\" font-size=\"13\" text-anchor=\"middle\" fill=\"#57606a\">本机 A：已 push 到提交 3</text><rect x=\"72\" y=\"184\" width=\"180\" height=\"32\" rx=\"8\" fill=\"#ffffff\" stroke=\"#57606a\" stroke-width=\"2\"/><text x=\"162\" y=\"206\" font-size=\"13\" text-anchor=\"middle\" fill=\"#57606a\">本机 B：还停在提交 2</text><path d=\"M258 200H348\" stroke=\"#24292f\" stroke-width=\"2.5\"/><polygon points=\"348,200 338,194 338,206\" fill=\"#24292f\"/><text x=\"392\" y=\"205\" font-size=\"13\" text-anchor=\"middle\" fill=\"#57606a\">pull 追上来</text></svg>", caption: "origin/main 是远程的本地记录；fetch 只更新它，pull 才动你的工作区。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把 clone 和 pull 搞混。clone 只在新目录做一次，pull 是在已有仓库里同步。",
            "本地有未提交改动直接 pull，被提示 would be overwritten。先 commit 或 stash。",
            "以为 fetch 已经改了文件。fetch 只更新 origin/main 这个记录，不动工作区。",
            "在错误的分支上 pull。先 git branch 看星号在哪，再拉。",
            "两台机器同时改同一行，pull 时冲突。先拉再改，或者拉下来按提示解决冲突。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "把第 3 课的仓库 clone 到另一个目录，用 git remote -v 确认 origin 已自动配好。",
            "在克隆目录里改一行并 push，回到原目录先 fetch 看 status，再 pull，对比文件变化。",
            "用 git log --oneline origin/main 和 git log --oneline 各看一次，说明两条历史差在哪。"
          ]},
          { t: "tip", color: "green", text: "一句话：clone 建本地副本，fetch 只更新远程记录，pull 才把远程改动并进工作区。" }
        ]
      },
      {
        id: "gh05",
        title: "第 5 课 · 分支与 Pull Request",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：开一条功能分支、推上去、开 Pull Request、合并，再把分支删掉。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "分支是一条独立的提交线。开分支的代价很小：它只是一张写着「这条线停在哪」的指针。你在功能分支上提交，不会影响 main；写完再通过 Pull Request 把这条线并回 main。" },
          { t: "p", text: "Pull Request（简称 PR）不是 Git 的命令，而是 GitHub 的协作功能。它把「我这条分支想并进 main」变成一个可评论、可审查、可跑自动检查的页面。审查通过后点 Merge，GitHub 会在服务器上完成合并。" },
          { t: "p", text: "PR 的最小流程：从 main 开分支 → 提交 → push 分支 → 在 GitHub 点 Compare & pull request → 写标题和说明 → 审查 → Merge → 删除分支。删除的是远程那条功能分支，main 上的提交还在。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "把「修一个 bug」和「加一个功能」分开，main 始终保持可运行。",
            "让同事在合并前看你的改动、留评论、要求补测试。",
            "让 Actions 在 PR 上自动跑测试，红了就不让合。",
            "一次 PR 只做一件事，回滚时容易定位。"
          ]},
          { t: "h2", text: "演示 1 · 开分支并提交" },
          { t: "code", lang: "bash", code: "git switch main\ngit pull\ngit switch -c feature/readme-tweak\n# 改 README.md\ngit add README.md\ngit commit -m \"README 补一句项目说明\"\ngit push -u origin feature/readme-tweak" },
          { t: "p", text: "switch -c 从当前 main 开一条新分支并切过去。push -u 把这条分支推到远程，终端会打印一个创建 PR 的链接，点开就能填标题。" },
          { t: "h2", text: "演示 2 · 合并后清理" },
          { t: "code", lang: "bash", code: "# 在 GitHub 页面点 Merge pull request\n# 合并后回到本地：\ngit switch main\ngit pull\ngit branch -d feature/readme-tweak\ngit push origin --delete feature/readme-tweak" },
          { t: "p", text: "合并后本地 main 要 pull 一次才拿到远程的合并提交。git branch -d 删本地分支，push --delete 删远程分支。两步都做，仓库里就不会堆着已经合完的旧分支。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef1f6\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#161b22\">分支 → PR → 合并</text><circle cx=\"120\" cy=\"150\" r=\"10\" fill=\"#24292f\"/><circle cx=\"220\" cy=\"150\" r=\"10\" fill=\"#24292f\"/><circle cx=\"320\" cy=\"150\" r=\"10\" fill=\"#24292f\"/><circle cx=\"420\" cy=\"150\" r=\"10\" fill=\"#24292f\"/><circle cx=\"270\" cy=\"104\" r=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"3\"/><path d=\"M130 150H210\" stroke=\"#24292f\" stroke-width=\"3\"/><path d=\"M230 150H310\" stroke=\"#24292f\" stroke-width=\"3\"/><path d=\"M330 150H410\" stroke=\"#24292f\" stroke-width=\"3\"/><path d=\"M270 114V138\" stroke=\"#57606a\" stroke-width=\"2.5\"/><text x=\"270\" y=\"96\" font-size=\"13\" text-anchor=\"middle\" fill=\"#57606a\">feature</text><rect x=\"452\" y=\"120\" width=\"112\" height=\"58\" rx=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"508\" y=\"145\" font-size=\"14\" text-anchor=\"middle\" fill=\"#161b22\">Pull Request</text><text x=\"508\" y=\"164\" font-size=\"12\" text-anchor=\"middle\" fill=\"#57606a\">审查 → Merge</text></svg>", caption: "功能分支单独长一段，PR 是把这段接回 main 的入口。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "直接在 main 上改再推。main 没有审查缓冲区，出错时回滚成本高。",
            "一个 PR 塞进五个不相关的改动。审查的人看不出重点，出问题也难定位。",
            "PR 开了很久不合并，main 已经往前走了很多，冲突越积越多。小步提交、尽快合并。",
            "合并后只删远程分支，不删本地。本地 git branch 会越堆越多。",
            "在 PR 里提交了密码或密钥。即使后来删掉，历史里还在，必须立刻吊销。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "从 main 开一条分支，改 README，push 后在 GitHub 开一个 PR，写清标题和改了什么。",
            "在 PR 页面点 Merge，再回本地 pull，确认 main 上能看到这次改动。",
            "合并后删掉本地和远程的功能分支，用 git branch -a 确认只剩 main。"
          ]},
          { t: "tip", color: "green", text: "一句话：分支隔离改动，PR 把改动变成可审查的合并请求；合完记得把功能分支清掉。" }
        ]
      },
      {
        id: "gh06",
        title: "第 6 课 · Issue：把问题写成可执行的任务",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：会写一条别人能照着复现的 Issue，知道标签、指派和关闭的关键字。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "Issue 是仓库里的任务单。它可以是一个 bug、一个功能请求、一条待办。好的 Issue 不是「这里坏了」，而是「在什么环境、做了什么、看到什么、期望什么」—— 这四样齐了，别人才能复现。" },
          { t: "p", text: "Issue 有几个常用字段：标题一句话说清问题；正文写复现步骤和期望结果；Labels 打上 bug、enhancement、documentation 这类标签；Assignees 指定谁来看；Milestone 把它归到某个版本。字段不是形式，是为了让一堆 Issue 能排序和筛选。" },
          { t: "p", text: "PR 和 Issue 可以关联。在 PR 描述里写 Closes #12，合并后 GitHub 会自动关掉第 12 号 Issue。这样「问题」和「修复」留在同一条时间线上，三个月后还能查到为什么改。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "把用户报的现象整理成团队能复现的步骤。",
            "把大功能拆成若干条小 Issue，逐条关掉。",
            "用标签筛出「新手可做」的任务，交给第一次贡献的人。",
            "用 Closes 关键字让合并自动关 Issue，不漏收尾。"
          ]},
          { t: "h2", text: "演示 1 · 一条可复现的 Issue 正文" },
          { t: "p", text: "下面是一个模板，四段分别对应环境、步骤、实际结果、期望结果。写的时候把示例内容换成真实信息，不要只写「打不开」。" },
          { t: "code", lang: "text", code: "标题：登录页在 Safari 17 上点击提交没有反应\n\n环境：macOS 14 / Safari 17.2 / 站点版本 v1.3.0\n步骤：\n1. 打开 /login\n2. 输入任意邮箱和密码\n3. 点击「登录」\n实际：按钮没有反应，控制台报 TypeError\n期望：跳转到 /dashboard，或在表单下方显示错误提示" },
          { t: "h2", text: "演示 2 · 用 PR 关闭 Issue" },
          { t: "code", lang: "text", code: "PR 标题：修复登录按钮在 Safari 上的点击事件\n\nPR 描述：\n- 把 click 监听从 button 内部移到表单提交事件\n- 补一条 Safari 下的回归用例\n\nCloses #12" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef1f6\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#161b22\">Issue 到关闭的一条线</text><rect x=\"62\" y=\"104\" width=\"140\" height=\"62\" rx=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"132\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#161b22\">Issue #12</text><text x=\"132\" y=\"150\" font-size=\"12\" text-anchor=\"middle\" fill=\"#57606a\">复现步骤</text><path d=\"M206 135H264\" stroke=\"#24292f\" stroke-width=\"3\"/><polygon points=\"264,135 254,129 254,141\" fill=\"#24292f\"/><rect x=\"272\" y=\"104\" width=\"140\" height=\"62\" rx=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"342\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#161b22\">PR #15</text><text x=\"342\" y=\"150\" font-size=\"12\" text-anchor=\"middle\" fill=\"#57606a\">Closes #12</text><path d=\"M416 135H474\" stroke=\"#24292f\" stroke-width=\"3\"/><polygon points=\"474,135 464,129 464,141\" fill=\"#24292f\"/><rect x=\"482\" y=\"104\" width=\"96\" height=\"62\" rx=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"530\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#161b22\">合并</text><text x=\"530\" y=\"150\" font-size=\"12\" text-anchor=\"middle\" fill=\"#57606a\">自动关闭</text></svg>", caption: "PR 描述里的 Closes #12 是 Issue 与修复之间的钉子。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "标题只写「有 bug」。搜索时全是同名 Issue，没法区分。",
            "正文没有复现步骤。维护者只能反问，一来一回浪费几天。",
            "一条 Issue 混进三个不相关的问题。关掉一个，另外两个也跟着消失。",
            "PR 里写 Fix #12 但拼错关键字，合并后 Issue 还开着。用 Closes 或 Fixes 并核对。",
            "把 Issue 当聊天窗口。结论要回写到正文或置顶评论，后来的人不用翻五十楼。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "给你自己的练习仓库开一条 Issue，按环境、步骤、实际、期望四段写。",
            "给这条 Issue 打一个标签，再把它指派给自己。",
            "开一个 PR 改一行文字，在描述里写 Closes 加上那条 Issue 的编号，合并后确认 Issue 自动关闭。"
          ]},
          { t: "tip", color: "green", text: "一句话：Issue 要把问题写成可复现的四段，PR 用 Closes 关键字把它和修复钉在一起。" }
        ]
      },
      {
        id: "gh07",
        title: "第 7 课 · Fork 与开源协作",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：搞清 fork 和 clone 的区别，能从一个别人的仓库 fork 出自己的副本并发起 PR。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "你没有权限直接往别人的仓库 push。Fork 是在你的账号下复制一份完整仓库，复制出来的这份归你，你可以随便改。改完想贡献回去，就从你的 fork 向原仓库发 Pull Request。" },
          { t: "p", text: "一个 fork 通常有两个远程：origin 指向你自己的 fork，upstream 指向原仓库。origin 用来推你的分支，upstream 用来同步原仓库的新提交。两个名字不是语法要求，是社区约定；写清楚就行。" },
          { t: "p", text: "同步上游的节奏：先 git fetch upstream，再切到 main，把 upstream/main 合进来，最后 push 到 origin。这样你的 fork 不会越落越远，下次开 PR 时冲突也少。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "给开源项目修一个文档错字，不用等别人给你权限。",
            "把别人的项目复制一份，改成自己的版本，保留原作者的署名和许可证。",
            "在 fork 上做实验，失败了也不影响原仓库。",
            "用 upstream 定期同步，让自己的副本跟上主线。"
          ]},
          { t: "h2", text: "演示 1 · fork 后接上两个远程" },
          { t: "code", lang: "bash", code: "# 在 GitHub 页面点 Fork，得到 你的用户名/原仓库名\ngit clone git@github.com:你的用户名/原仓库名.git\ncd 原仓库名\ngit remote add upstream git@github.com:原作者/原仓库名.git\ngit remote -v" },
          { t: "p", text: "clone 之后 origin 已经指向你的 fork；remote add upstream 再加一条指回原仓库。git remote -v 应该看到四行：origin 和 upstream 各有 fetch、push。" },
          { t: "h2", text: "演示 2 · 同步上游再开 PR" },
          { t: "code", lang: "bash", code: "git fetch upstream\ngit switch main\ngit merge upstream/main\ngit push origin main\n\ngit switch -c fix/doc-typo\ngit commit -am \"修正文档里的拼写错误\"\ngit push -u origin fix/doc-typo" },
          { t: "p", text: "前四行把上游的新提交同步到你的 main。后三行从最新的 main 开一条分支，提交后推到你的 fork。然后在 GitHub 上从你的 fork 向原仓库开 PR。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef1f6\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#161b22\">Fork 网络：上游 → 你的副本 → PR 回去</text><rect x=\"62\" y=\"104\" width=\"150\" height=\"62\" rx=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"137\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#161b22\">原作者仓库</text><text x=\"137\" y=\"150\" font-size=\"12\" text-anchor=\"middle\" fill=\"#57606a\">upstream</text><rect x=\"246\" y=\"104\" width=\"150\" height=\"62\" rx=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"321\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#161b22\">你的 fork</text><text x=\"321\" y=\"150\" font-size=\"12\" text-anchor=\"middle\" fill=\"#57606a\">origin</text><rect x=\"430\" y=\"104\" width=\"150\" height=\"62\" rx=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"505\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#161b22\">Pull Request</text><text x=\"505\" y=\"150\" font-size=\"12\" text-anchor=\"middle\" fill=\"#57606a\">合回上游</text><path d=\"M216 135H242\" stroke=\"#24292f\" stroke-width=\"3\"/><path d=\"M400 135H426\" stroke=\"#24292f\" stroke-width=\"3\"/><path d=\"M505 170V196H137V170\" stroke=\"#57606a\" stroke-width=\"2.5\" stroke-dasharray=\"5 5\"/><text x=\"320\" y=\"212\" font-size=\"12\" text-anchor=\"middle\" fill=\"#57606a\">上游有新提交时，fetch upstream 同步回来</text></svg>", caption: "fork 是一份属于你的副本；PR 是把副本里的分支送回上游的通道。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "把 fork 当成 clone。fork 发生在 GitHub 服务器上，clone 是拿到本机。",
            "PR 从你的 main 直接发。上游 main 一变，你的 main 就落后，PR 会混进无关提交。每次从最新 main 开功能分支。",
            "忘了同步 upstream，fork 落后几百个提交，PR 里全是别人的改动。",
            "改别人的项目却删掉许可证和署名。开源许可证要求保留版权声明。",
            "把 fork 当自己的原创项目发布。可以改，但要遵守原项目的许可证。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "找一个公开仓库 fork 下来，clone 到本地，配好 origin 和 upstream 两个远程。",
            "用 git remote -v 确认四条地址，说明哪两条属于你的 fork。",
            "从最新 main 开一条分支，改一处文档，推到 fork，向原仓库开一个 PR。"
          ]},
          { t: "tip", color: "green", text: "一句话：fork 是服务器上的副本，origin 推自己的，upstream 同步原仓库；PR 从功能分支发，不从 main 发。" }
        ]
      },
      {
        id: "gh08",
        title: "第 8 课 · Markdown 与 README",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：会写 GitHub 能正确渲染的 Markdown，知道一个 README 最少该有哪几段。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "GitHub 的 Issue、PR、README、Wiki 都认 Markdown。它用几个符号表示结构：井号开头是标题，减号开头是列表，两个星号夹住是加粗，方括号加圆括号是链接。渲染发生在网页上，源文件仍是纯文本。" },
          { t: "p", text: "README 是仓库的门面。别人点进来第一眼看到它，决定要不要继续看代码。一个能用的 README 至少回答四件事：这个项目是什么、怎么装、怎么用、许可证是什么。再加一张截图或一段最小示例，读者就能在三十秒内判断它是不是自己要找的东西。" },
          { t: "p", text: "GitHub 会优先渲染 README.md、README.rst 或 README。文件名大小写不敏感，但社区习惯全大写。放在仓库根目录才会自动显示在首页；放在子目录只会在该目录显示。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "让陌生人不用读源码就知道项目是做什么的。",
            "把安装步骤写成可复制的命令，减少重复提问。",
            "用标题和列表把长文档拆成能扫读的结构。",
            "在 Issue 和 PR 里用同样的语法写清复现步骤。"
          ]},
          { t: "h2", text: "演示 1 · 一个最小 README" },
          { t: "p", text: "下面这份 README 只有四段，但四件事都回答了。复制到你的仓库根目录，改掉项目名和命令即可。" },
          { t: "code", lang: "text", code: "# hello-github\n一个用来练习 GitHub 流程的最小项目。\n## 安装\n\n    git clone git@github.com:用户名/hello-github.git\n    cd hello-github\n\n## 使用\n\n    python3 hello.py\n\n## 许可证\n\nMIT" },
          { t: "h2", text: "演示 2 · 常用行内写法" },
          { t: "code", lang: "text", code: "**加粗** 和 *斜体*\n[链接文字](https://example.com)\n![图片说明](images/screenshot.png)\n\n- 无序列表\n1. 有序列表\n\n> 引用一段话\n\n| 列 1 | 列 2 |\n| --- | --- |\n| A | B |" },
          { t: "p", text: "上面第二段里的反引号在站内正文里不能直接写，所以这里用文字说明：行内代码用一个反引号夹住，代码块用三个反引号加语言名另起一段。真正写 README 时照这个规则写即可。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef1f6\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#161b22\">README 的四段骨架</text><rect x=\"62\" y=\"98\" width=\"120\" height=\"72\" rx=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"122\" y=\"124\" font-size=\"14\" text-anchor=\"middle\" fill=\"#161b22\">是什么</text><text x=\"122\" y=\"148\" font-size=\"12\" text-anchor=\"middle\" fill=\"#57606a\">一句话 + 截图</text><rect x=\"196\" y=\"98\" width=\"120\" height=\"72\" rx=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"256\" y=\"124\" font-size=\"14\" text-anchor=\"middle\" fill=\"#161b22\">怎么装</text><text x=\"256\" y=\"148\" font-size=\"12\" text-anchor=\"middle\" fill=\"#57606a\">可复制命令</text><rect x=\"330\" y=\"98\" width=\"120\" height=\"72\" rx=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"390\" y=\"124\" font-size=\"14\" text-anchor=\"middle\" fill=\"#161b22\">怎么用</text><text x=\"390\" y=\"148\" font-size=\"12\" text-anchor=\"middle\" fill=\"#57606a\">最小示例</text><rect x=\"464\" y=\"98\" width=\"114\" height=\"72\" rx=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"521\" y=\"124\" font-size=\"14\" text-anchor=\"middle\" fill=\"#161b22\">许可证</text><text x=\"521\" y=\"148\" font-size=\"12\" text-anchor=\"middle\" fill=\"#57606a\">MIT / Apache-2.0</text><path d=\"M182 134H192\" stroke=\"#24292f\" stroke-width=\"2\"/><path d=\"M316 134H326\" stroke=\"#24292f\" stroke-width=\"2\"/><path d=\"M450 134H460\" stroke=\"#24292f\" stroke-width=\"2\"/></svg>", caption: "四段齐了，读者就能判断要不要继续看；顺序按「是什么 → 怎么装 → 怎么用 → 许可证」。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "README 只有项目名，没有安装和使用说明。别人只能去读源码。",
            "图片用本地绝对路径，推到 GitHub 后裂图。用仓库内的相对路径。",
            "把代码块写成三个反引号却忘了闭合，后面整页都变成代码。",
            "许可证只写在 README 里，没有 LICENSE 文件。GitHub 识别不到许可证。",
            "README 太长，把整本手册塞进去。首页放最短路径，细节放 docs/。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "给你的练习仓库写一个 README，必须包含是什么、怎么装、怎么用、许可证四段。",
            "在 README 里加一张仓库内的图片或一张截图，确认 GitHub 上能显示。",
            "故意写一个不闭合的代码块，看渲染结果，再改回闭合。"
          ]},
          { t: "tip", color: "green", text: "一句话：README 是仓库的门面，四段回答「是什么、怎么装、怎么用、什么许可证」。" }
        ]
      },
      {
        id: "gh09",
        title: "第 9 课 · GitHub Pages：把静态站发出去",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：把一个纯静态页面放到 GitHub Pages 上，拿到能公开访问的网址。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "GitHub Pages 是 GitHub 提供的静态文件托管。它只发 HTML、CSS、JavaScript、图片这类不需要服务器执行的文件，不支持数据库和后台接口。对你的个人主页、项目文档、纯前端练习来说，它够用且免费。" },
          { t: "p", text: "发布方式有两种。第一种最简单：在仓库 Settings 的 Pages 里选一个分支和目录，GitHub 会把那个目录当网站根目录。第二种用 Actions：每次 push 自动构建、上传、部署，适合需要编译的站点。" },
          { t: "p", text: "项目站的地址通常是 用户名.github.io/仓库名/，所以页面里的绝对路径要以仓库名为前缀。如果本地用 /style.css 能打开，发到项目站可能 404；改成相对路径或加上仓库名前缀。用户站（仓库名就叫 用户名.github.io）则直接挂在根路径。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "把课程作业、作品集、项目文档直接发给别人看。",
            "给开源项目做一个介绍页，不用另买服务器。",
            "用 Actions 在每次 push 后自动更新页面。",
            "绑定自己的域名，去掉 github.io 前缀。"
          ]},
          { t: "h2", text: "演示 1 · 用分支发布" },
          { t: "code", lang: "bash", code: "mkdir my-pages\ncd my-pages\ngit init\necho \"<h1>你好，Pages</h1>\" > index.html\ngit add index.html\ngit commit -m \"第一版页面\"\ngit branch -M main\ngit remote add origin git@github.com:用户名/my-pages.git\ngit push -u origin main" },
          { t: "p", text: "推送后在仓库 Settings → Pages，Source 选 Deploy from a branch，Branch 选 main、目录选 / (root)，保存。等一两分钟，页面顶部会出现访问地址。" },
          { t: "h2", text: "演示 2 · 用 Actions 发布" },
          { t: "code", lang: "yaml", code: "name: Deploy Pages\non:\n  push:\n    branches: [main]\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/upload-pages-artifact@v3\n        with:\n          path: ." },
          { t: "p", text: "把这段存成 .github/workflows/pages.yml。它做三件事：检出代码、把当前目录打包成 Pages 产物、上传。示例省掉了 permissions 段；真实仓库要按 Pages 要求开 pages: write 与 id-token: write 权限。完整部署还需要 deploy-pages 这一步，入门先用分支发布更省事，Actions 的细节下一课再展开。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef1f6\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#161b22\">仓库 → Pages → 公开网址</text><rect x=\"62\" y=\"104\" width=\"150\" height=\"62\" rx=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"137\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#161b22\">仓库 main</text><text x=\"137\" y=\"150\" font-size=\"12\" text-anchor=\"middle\" fill=\"#57606a\">index.html</text><path d=\"M216 135H284\" stroke=\"#24292f\" stroke-width=\"3\"/><polygon points=\"284,135 274,129 274,141\" fill=\"#24292f\"/><rect x=\"292\" y=\"104\" width=\"150\" height=\"62\" rx=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"367\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#161b22\">Pages</text><text x=\"367\" y=\"150\" font-size=\"12\" text-anchor=\"middle\" fill=\"#57606a\">静态托管</text><path d=\"M446 135H514\" stroke=\"#24292f\" stroke-width=\"3\"/><polygon points=\"514,135 504,129 504,141\" fill=\"#24292f\"/><text x=\"556\" y=\"130\" font-size=\"13\" text-anchor=\"middle\" fill=\"#161b22\">用户名.github.io</text><text x=\"556\" y=\"150\" font-size=\"12\" text-anchor=\"middle\" fill=\"#57606a\">/仓库名/</text></svg>", caption: "Pages 只发静态文件；项目站地址带仓库名，用户站不带。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "页面里写绝对路径 /style.css，项目站 404。加仓库名前缀或改用相对路径。",
            "私有仓库开 Pages 却以为别人能看。免费账号的 Pages 公开性受仓库可见性影响，发布前确认。",
            "部署后立刻刷新看不到，以为失败。Pages 首次发布要等一两分钟，看 Actions 或 Pages 状态。",
            "把后端代码也放上去。Pages 不执行服务端程序，只发静态文件。",
            "改完不提交就刷新。Pages 发的是仓库里的版本，不是本机文件。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "建一个只有 index.html 的仓库，用分支方式开 Pages，拿到公开地址。",
            "把 index.html 里加一行样式或一张图，提交后确认线上页面更新。",
            "把页面里的一个绝对路径改成相对路径，解释为什么项目站需要这个改动。"
          ]},
          { t: "tip", color: "green", text: "一句话：Pages 只发静态文件；分支发布最省事，项目站地址带仓库名，路径要用相对写法。" }
        ]
      },
      {
        id: "gh10",
        title: "第 10 课 · Actions：让机器替你跑测试",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：写一个最小 workflow，让每次 push 自动跑一条命令，并在 Actions 页面看到结果。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "GitHub Actions 是仓库自带的自动化流水线。你在 .github/workflows/ 目录放一个 YAML 文件，GitHub 就会在指定事件发生时启动一台临时机器，按步骤执行命令。事件可以是 push、pull_request、手动触发或定时。" },
          { t: "p", text: "一个 workflow 由 job 和 step 组成。job 是一组在同一台机器上跑的任务，step 是 job 里顺序执行的一步。uses 表示调用别人写好的 action，run 表示执行一条 shell 命令。机器是临时的，跑完就销毁，所以要装依赖、跑测试都得在步骤里写。" },
          { t: "p", text: "Actions 的结果会显示在 PR 和提交旁边。测试红了，PR 就不能合；测试绿了，审查的人会更放心。它不替代本地测试，而是把「每次提交都跑一遍」这件事变成自动的。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "每次 push 自动跑单元测试，红了立刻知道。",
            "PR 上自动跑 lint、构建、类型检查。",
            "合并后自动打包并发布到 Pages 或 Release。",
            "定时跑一遍依赖检查或数据抓取。"
          ]},
          { t: "h2", text: "演示 1 · 最小测试 workflow" },
          { t: "p", text: "在仓库里建 .github/workflows/test.yml，内容如下。它监听 push 和 pull_request，检出代码、装 Node、跑测试。" },
          { t: "code", lang: "yaml", code: "name: Test\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n      - run: npm install\n      - run: npm test" },
          { t: "p", text: "注意缩进：YAML 用空格不用制表符，jobs、test、runs-on、steps 的层级错一格就会解析失败。run 后面的命令按顺序执行，任何一步返回非零，整个 job 失败。" },
          { t: "h2", text: "演示 2 · 看一次运行结果" },
          { t: "code", lang: "bash", code: "git add .github/workflows/test.yml\ngit commit -m \"加一条自动测试流水线\"\ngit push\n# 打开仓库的 Actions 标签页，点最新一次运行\n# 展开 test job，逐行看每个 step 的日志" },
          { t: "p", text: "日志里绿色勾表示这一步成功，红色叉表示失败。失败时先看是哪一步红的，再点开那一步的原始输出。Actions 的日志和本地终端不完全一样，路径、环境变量、缓存都可能是新问题。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef1f6\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#161b22\">一次 push 触发的流水线</text><rect x=\"62\" y=\"104\" width=\"120\" height=\"62\" rx=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"122\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#161b22\">push</text><text x=\"122\" y=\"150\" font-size=\"12\" text-anchor=\"middle\" fill=\"#57606a\">触发事件</text><path d=\"M186 135H244\" stroke=\"#24292f\" stroke-width=\"3\"/><polygon points=\"244,135 234,129 234,141\" fill=\"#24292f\"/><rect x=\"252\" y=\"104\" width=\"130\" height=\"62\" rx=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"317\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#161b22\">临时机器</text><text x=\"317\" y=\"150\" font-size=\"12\" text-anchor=\"middle\" fill=\"#57606a\">checkout + setup</text><path d=\"M386 135H444\" stroke=\"#24292f\" stroke-width=\"3\"/><polygon points=\"444,135 434,129 434,141\" fill=\"#24292f\"/><rect x=\"452\" y=\"104\" width=\"126\" height=\"62\" rx=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"515\" y=\"130\" font-size=\"14\" text-anchor=\"middle\" fill=\"#161b22\">npm test</text><text x=\"515\" y=\"150\" font-size=\"12\" text-anchor=\"middle\" fill=\"#57606a\">绿 / 红</text></svg>", caption: "机器是临时的：每次运行都从干净环境开始，所以要在步骤里装依赖。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "YAML 用了制表符或缩进不一致，Actions 直接解析失败。全用空格。",
            "忘记 actions/checkout，job 在工作区里找不到你的代码。",
            "本地能跑、Actions 跑不了，因为漏装依赖或 Node 版本不同。把版本写进 setup 步骤。",
            "把密钥直接写进 YAML。用仓库 Secrets，且不要在日志里打印。",
            "action 用 @main 这种浮动版本，上游一改行为就变。固定大版本号，如 @v4。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "给你的练习仓库加一个 test.yml，让 push 时跑一条命令，比如 echo 或 npm test。",
            "push 后在 Actions 页面找到这次运行，点开日志，抄下每个 step 的名字。",
            "故意把命令改错，看运行变红；再改回来，看变绿。"
          ]},
          { t: "tip", color: "green", text: "一句话：workflow 是放在 .github/workflows 的 YAML，事件触发临时机器按 step 执行命令，红了就拦 PR。" }
        ]
      },
      {
        id: "gh11",
        title: "第 11 课 · Release 与标签",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：会给提交打标签、发一个 Release，并知道标签和分支的区别。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "标签是钉在某一次提交上的名字，用来标记版本，比如 v1.0.0。它不像分支会往前挪，打在哪就停在哪。发布版本时给提交打标签，以后就能用这个标签找回当时的代码。" },
          { t: "p", text: "Git 有两种标签：轻量标签只是一个名字，附注标签带说明、作者和时间，发布版本应该用附注标签。git tag -a v1.0.0 -m \"说明\" 创建附注标签，git push origin v1.0.0 把它推到远程。" },
          { t: "p", text: "Release 是 GitHub 在标签之上加的一层发布页：可以写更新说明、附上编译好的二进制、标成预发布。别人下载 Release 里的文件，不需要懂 Git。标签管「代码停在哪」，Release 管「这一版给用户什么」。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "给项目标版本，用户能按版本下载。",
            "在 Release 页写更新日志，说明修了什么、加了什么。",
            "附上编译好的安装包，非开发者也能用。",
            "出问题时按标签回看当时的代码。"
          ]},
          { t: "h2", text: "演示 1 · 打标签并推送" },
          { t: "code", lang: "bash", code: "git switch main\ngit pull\ngit tag -a v1.0.0 -m \"第一个可用版本\"\ngit tag\ngit show v1.0.0\ngit push origin v1.0.0" },
          { t: "p", text: "git tag 列出所有标签，git show 看标签指向的提交和说明。push 时只推一个标签要写名字；git push --tags 会推全部本地标签。标签推上去后，GitHub 的 Releases 页面就能基于它创建 Release。" },
          { t: "h2", text: "演示 2 · 创建 Release" },
          { t: "code", lang: "bash", code: "# 在 GitHub 页面：Releases -> Draft a new release\n# 选择 v1.0.0 标签，填标题和更新说明，附上构建产物\n# 或者用 gh 命令行：\ngh release create v1.0.0 ./dist/app.zip --title \"v1.0.0\" --notes \"第一个可用版本\"" },
          { t: "p", text: "Release 的说明建议分三块：新增、修复、破坏性变更。用户看更新日志时最想知道「我升级后会不会坏」，破坏性变更要写在最前面。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef1f6\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#161b22\">标签钉在提交上，Release 挂在标签上</text><circle cx=\"110\" cy=\"142\" r=\"9\" fill=\"#24292f\"/><circle cx=\"210\" cy=\"142\" r=\"9\" fill=\"#24292f\"/><circle cx=\"310\" cy=\"142\" r=\"9\" fill=\"#24292f\"/><circle cx=\"410\" cy=\"142\" r=\"9\" fill=\"#24292f\"/><path d=\"M120 142H200\" stroke=\"#24292f\" stroke-width=\"3\"/><path d=\"M220 142H300\" stroke=\"#24292f\" stroke-width=\"3\"/><path d=\"M320 142H400\" stroke=\"#24292f\" stroke-width=\"3\"/><path d=\"M310 133V110\" stroke=\"#57606a\" stroke-width=\"2.5\"/><rect x=\"266\" y=\"78\" width=\"88\" height=\"30\" rx=\"7\" fill=\"#ffffff\" stroke=\"#57606a\" stroke-width=\"2\"/><text x=\"310\" y=\"98\" font-size=\"13\" text-anchor=\"middle\" fill=\"#161b22\">v1.0.0</text><rect x=\"448\" y=\"118\" width=\"128\" height=\"54\" rx=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"512\" y=\"141\" font-size=\"13\" text-anchor=\"middle\" fill=\"#161b22\">Release</text><text x=\"512\" y=\"160\" font-size=\"12\" text-anchor=\"middle\" fill=\"#57606a\">说明 + 附件</text></svg>", caption: "分支会往前挪，标签不会；Release 是标签之上给用户看的发布页。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "只打轻量标签。发布版本要用 -a 带说明，否则看不到打标签的人和说明。",
            "打了标签忘了 push。标签不会随普通 push 自动上去，要单独推。",
            "在错误的提交上打标签。先 git log --oneline 确认 HEAD，再打。",
            "移动已经发布的标签。别人可能已经按旧标签下载，改标签会让版本对不上。",
            "Release 不写破坏性变更。升级的人踩坑后才知道接口变了。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "在练习仓库打一个附注标签 v0.1.0，推到远程，在 GitHub 的 Tags 页面看到它。",
            "基于这个标签创建一个 Release，写三条更新说明。",
            "用 git show v0.1.0 看标签指向哪次提交，解释标签和分支的区别。"
          ]},
          { t: "tip", color: "green", text: "一句话：附注标签钉住一次提交，Release 在标签上给用户写说明和附件；发布后别移动标签。" }
        ]
      },
      {
        id: "gh12",
        title: "第 12 课 · 个人主页与后续路线",
        blocks: [
          { t: "tip", color: "blue", text: "本课目标：把 GitHub 个人主页做成一张能看的名片，并知道入门之后该往哪走。" },
          { t: "h2", text: "原理讲解" },
          { t: "p", text: "GitHub 个人主页有一个特殊规则：建一个和用户名同名的仓库，比如用户名是 alice，就建 alice/alice，里面放 README.md，这个 README 会显示在你的个人主页顶部。它是别人点进你账号后第一眼看到的内容。" },
          { t: "p", text: "主页 README 不用很长。写清三件事就够：你是谁、你在做什么、怎么联系你。再加几个置顶仓库，把最能代表你水平的工作放在最前面。置顶在个人主页的 Customize 里选，最多六个。" },
          { t: "p", text: "入门之后有三条常见路线：一是继续往语言深度走，把一门语言的标准库和工程结构用熟；二是往协作走，参与开源项目的 Issue 和 PR；三是往自动化走，把 Actions、Pages、Release 串成完整的发布流水线。三条不冲突，可以按当前项目需要选。" },
          { t: "h2", text: "假设它能干什么" },
          { t: "ul", items: [
            "让招聘方或合作者快速知道你会什么、做过什么。",
            "把最好的仓库置顶，不用在一堆练习项目里翻。",
            "用主页 README 留联系方式，省掉反复介绍。",
            "把 Pages 主页和 GitHub 主页互相链接，形成完整作品集。"
          ]},
          { t: "h2", text: "演示 · 一个可用的主页 README" },
          { t: "code", lang: "text", code: "# 你好，我是小北\n\n我在学 Web 开发，主要写 TypeScript 和 Python。\n\n## 最近在做\n\n- 一个用 GitHub Pages 发布的学习笔记站\n- 一个练手的命令行工具\n\n## 找到我\n\n- 邮箱：you@example.com\n- 博客：https://用户名.github.io/" },
          { t: "p", text: "这份 README 只有三段，但回答了「是谁、在做什么、怎么找」。把示例内容换成真实信息，别留占位邮箱。置顶仓库选两到三个，宁缺毋滥。" },
          { t: "svg", code: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 240\"><rect x=\"40\" y=\"40\" width=\"560\" height=\"160\" rx=\"14\" fill=\"#eef1f6\"/><text x=\"320\" y=\"76\" font-size=\"20\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#161b22\">个人主页的三块内容</text><rect x=\"62\" y=\"98\" width=\"160\" height=\"72\" rx=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"142\" y=\"124\" font-size=\"14\" text-anchor=\"middle\" fill=\"#161b22\">我是谁</text><text x=\"142\" y=\"148\" font-size=\"12\" text-anchor=\"middle\" fill=\"#57606a\">一句话 + 方向</text><rect x=\"240\" y=\"98\" width=\"160\" height=\"72\" rx=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"320\" y=\"124\" font-size=\"14\" text-anchor=\"middle\" fill=\"#161b22\">我在做什么</text><text x=\"320\" y=\"148\" font-size=\"12\" text-anchor=\"middle\" fill=\"#57606a\">置顶 2–3 个仓库</text><rect x=\"418\" y=\"98\" width=\"160\" height=\"72\" rx=\"10\" fill=\"#ffffff\" stroke=\"#24292f\" stroke-width=\"2\"/><text x=\"498\" y=\"124\" font-size=\"14\" text-anchor=\"middle\" fill=\"#161b22\">怎么联系</text><text x=\"498\" y=\"148\" font-size=\"12\" text-anchor=\"middle\" fill=\"#57606a\">邮箱 / 博客</text><path d=\"M222 134H236\" stroke=\"#24292f\" stroke-width=\"2\"/><path d=\"M400 134H414\" stroke=\"#24292f\" stroke-width=\"2\"/></svg>", caption: "主页 README 三段就够：是谁、在做什么、怎么找；置顶仓库补作品。" },
          { t: "h2", text: "常见坑" },
          { t: "ul", items: [
            "仓库名和用户名不一致，README 不会显示在主页。必须同名。",
            "主页 README 写成长篇简历。读者扫三秒，抓不到重点就走了。",
            "置顶一堆练习项目。选最能代表水平的，宁缺毋滥。",
            "把私人邮箱和手机号直接写上去。用专门的联系邮箱，别暴露太多个人信息。",
            "只写「正在学习」，不写做了什么。别人看不到你的实际产出。"
          ]},
          { t: "h2", text: "任务" },
          { t: "ul", items: [
            "建一个和用户名同名的仓库，写一份三段式主页 README，确认个人主页顶部能显示。",
            "置顶两到三个仓库，说明为什么选它们。",
            "写下一步路线：语言深度、开源协作、自动化发布，选一个并列出接下来要做的三件事。"
          ]},
          { t: "tip", color: "green", text: "一句话：同名仓库的 README 是个人主页，三段讲清你是谁、做什么、怎么找；入门之后选一条路线继续走。" }
        ]
      }
    ]
  }
};
