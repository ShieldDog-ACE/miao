window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["agents-c01"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把后面每一课都要用的运行环境搭起来，顺便认清一件事——agent 程序的聪明劲儿不在你本地，本地只负责把消息发出去、把消息收回来。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `一个 agent 脚本真正跑起来的时候，进程里只有三样东西：一段反复把上下文发出去的循环、一个模型服务的地址、一份能证明你是谁的凭据。前两样是代码写的，第三样必须在运行之前配好——几乎全部"课还没开始就报错"都卡在这里。` },
  { t: `p`, text: `凭据有两种拿法。一种把密钥抄进配置文件，脚本自己去读；另一种先在命令行里登录一次，登录状态存在系统里，脚本运行时去借。这套示例走第二种：notebook 里搜不到任何密钥字符串，它只认你本机那条已登录的会话。代价是要多装一个命令行工具，好处是密钥不会跟着代码一起被提交出去。模型地址和部署名则是另外两行普通配置，它们不算秘密——注意部署名不等于模型型号名，服务端上你部署出来的那个实例有自己的名字，脚本传的是这个名字。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#fffaf3"/><text x="320" y="26" font-size="17" fill="#4a3b2f" text-anchor="middle">一个 agent 脚本的进程里只有三样东西</text><rect x="20" y="44" width="286" height="128" rx="8" fill="#f7eee2" stroke="#e8ded2"/><text x="36" y="64" font-size="14" fill="#8a7867">你的机器 · 一个 Python 进程</text><rect x="36" y="74" width="256" height="26" rx="5" fill="#dfe8ff" stroke="#5b7cfa"/><text x="46" y="92" font-size="14" fill="#4a3b2f">① 反复把上下文发出去的循环</text><rect x="36" y="106" width="256" height="26" rx="5" fill="#fbe3c6" stroke="#e0821f"/><text x="46" y="124" font-size="14" fill="#4a3b2f">② 端点地址 + 部署名，不是模型名</text><rect x="36" y="138" width="256" height="26" rx="5" fill="#d5f0e8" stroke="#12a58a"/><text x="46" y="156" font-size="14" fill="#4a3b2f">③ 凭据：借本机那条已登录会话</text><path d="M306 96 L398 96" stroke="#5b7cfa" stroke-width="2"/><polygon points="404,96 393,90 393,102" fill="#5b7cfa"/><text x="352" y="90" font-size="14" fill="#8a7867" text-anchor="middle">发一次</text><path d="M404 130 L312 130" stroke="#12a58a" stroke-width="2"/><polygon points="306,130 317,124 317,136" fill="#12a58a"/><text x="356" y="124" font-size="14" fill="#8a7867" text-anchor="middle">收一次</text><rect x="404" y="70" width="216" height="92" rx="8" fill="#f7eee2" stroke="#e8ded2"/><text x="512" y="98" font-size="15" fill="#4a3b2f" text-anchor="middle">远端模型服务</text><text x="512" y="120" font-size="14" fill="#8a7867" text-anchor="middle">它只看见一次次请求</text><text x="512" y="140" font-size="14" fill="#8a7867" text-anchor="middle">认不出你的进程</text><text x="20" y="196" font-size="15" fill="#4a3b2f">后面每一课的报错，都落在这三处之一：</text><rect x="20" y="206" width="196" height="76" rx="6" fill="#faded9" stroke="#c0392b"/><text x="34" y="228" font-size="14" fill="#7f1d1d">① 坏在本地</text><text x="34" y="248" font-size="14" fill="#4a3b2f">venv 没激活，</text><text x="34" y="268" font-size="14" fill="#4a3b2f">循环根本没跑起来</text><rect x="222" y="206" width="196" height="76" rx="6" fill="#fbe3c6" stroke="#e0821f"/><text x="236" y="228" font-size="14" fill="#5c3410">② 坏在地址</text><text x="236" y="248" font-size="14" fill="#4a3b2f">部署名传成模型名，</text><text x="236" y="268" font-size="14" fill="#4a3b2f">报错长得像网络故障</text><rect x="424" y="206" width="196" height="76" rx="6" fill="#d5f0e8" stroke="#12a58a"/><text x="438" y="228" font-size="14" fill="#1d4230">③ 坏在凭据</text><text x="438" y="248" font-size="14" fill="#4a3b2f">没登录，或借到了</text><text x="438" y="268" font-size="14" fill="#4a3b2f">另一个订阅</text></svg>`, caption: `左边三样对应右边那一次往返：请求发得出去却拿不到好结果，就该问是哪一样坏了` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `用一条命令把课程仓库拉到自己机器上，只取需要的那几课，不下载几个 GB 的历史`,
    `让本地 Python 和云端模型对上一次话：改一句提示词，就能看到回复跟着变`,
    `把每一轮往返的原始内容打印出来，后面讲规划、讲工具调用时，这是唯一能查证的那条线索`
  ] },
  { t: `h2`, text: `演示 1 · 只取最新文件，不拖整个历史` },
  { t: `p`, text: `仓库带完整历史加全部素材会大到离谱。只要当前代码的话，把历史深度限制成一个提交；再配合 sparse-checkout，只解压你打算读的那几个目录。想改代码提交，就把地址换成自己 fork 出来的仓库。` },
  { t: `code`, lang: `bash`, code: `git clone --depth 1 https://github.com/你的用户名/ai-agents-for-beginners.git\ncd ai-agents-for-beginners\ngit sparse-checkout init --cone\ngit sparse-checkout set 00-course-setup 01-intro-to-ai-agents\nls` },
  { t: `h2`, text: `演示 2 · 虚拟环境建在哪个 Python 上` },
  { t: `p`, text: `示例要求 3.12 及以上。虚拟环境是从"调用它的那个解释器"复制出来的，用旧版本建出来的环境，依赖装完照样跑不起来。建完立刻验一次版本，比事后猜省时间。` },
  { t: `code`, lang: `bash`, code: `python3.12 -m venv venv\nsource venv/bin/activate\npython -V\npip install -r requirements.txt` },
  { t: `h2`, text: `演示 3 · 登录一次，代码里不提密钥` },
  { t: `p`, text: `登录完成后，脚本里的凭据对象会自动去借这条会话。同一台机器上有多个订阅时，第二条命令回显的 id 才是脚本实际使用的订阅——别默认它选中了你想要的那个。远程环境或没有浏览器时，登录命令换成 az login --use-device-code。` },
  { t: `code`, lang: `bash`, code: `az login\naz account show` },
  { t: `code`, lang: `python`, code: `from azure.identity import AzureCliCredential\n\ncred = AzureCliCredential()\ntoken = cred.get_token("https://ai.azure.com/.default")\nprint(token.expires_on)` },
  { t: `h2`, text: `演示 4 · 配置文件只留两行，顺手挡住提交` },
  { t: `p`, text: `从示例文件复制一份，填上端点和部署名，再把这个名字写进忽略清单。顺序很重要：先加忽略，再建文件，否则第一次提交就带出去了。` },
  { t: `code`, lang: `bash`, code: `cp .env.example .env\necho ".env" >> .gitignore\ngrep -n "AZURE_AI" .env\ngit status --short` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `终端里激活了虚拟环境，notebook 却还是用系统解释器：编辑器右下角的 Python 版本要手动切到 venv 里那一个`,
    `把 .env 提交进仓库：密钥泄露最常见的路径，提交前看一眼待提交列表`,
    `以为部署名就是模型名：控制台里那个实例名才是脚本要传的值，传错的报错长得像"找不到资源"，很容易被当成网络故障`,
    `只登录不确认订阅：多订阅机器上，借到的凭据可能指向另一个项目`,
    `浅克隆之后想看历史：得用 git fetch --unshallow 补回来，不是仓库坏了`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `让本地环境连续两次输出同一个 Python 版本号和 venv 路径，证明激活真的生效了`,
    `只把某一课的目录拉到本地，在删掉 .git 之前确认示例还能跑通`,
    `把部署名改成一个不存在的值，记下报错原文再改回来——后面每一轮排查都会用到这个动作`,
    `检查一次待提交清单，确认里面既没有 .env 也没有任何密钥字符串`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：环境这一课的值钱处不在装了几个包，而在于你从此能分清一个错是出在本地解释器、云端地址还是凭据——这三处后面每一课都会踩到。` }
];
