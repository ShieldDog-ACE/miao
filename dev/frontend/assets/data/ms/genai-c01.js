window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["genai-c01"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把「能发出一条真实请求」这条链路凑齐——依赖、密钥、模型入口，少一样都跑不通。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `后面每一课的示例都在做同一件事：把一段文本发给一个模型服务，把回来的文本打印出来。为此要凑齐三样东西——一个装好 Python 包的环境、一份写着密钥和入口地址的配置、一个已经部署好并给了名字和版本的模型。仓库里的 .devcontainer 与 environment.yml 管第一样，.env 管第二样，第三样在你自己的账号里，得自己去建。` },
  { t: `p`, text: `密钥和入口地址不进代码，走环境变量。代码会被提交、被复制、被截图，环境变量只活在这台机器、这个进程的这一次运行里。python-dotenv 干的事很窄：读 .env 文件，把每一行塞进进程的环境表，之后 os.getenv 才取到值。少了 load_dotenv 那一行，getenv 返回 None，请求会在一个看不出原因的错误里失败。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260" font-family="sans-serif"><rect width="640" height="260" fill="#f5f7fb"/><text x="320" y="28" font-size="17" fill="#22304a" text-anchor="middle">一次请求要凑齐的三样东西</text><rect x="24" y="56" width="176" height="78" rx="10" fill="#ffffff" stroke="#5b7cfa" stroke-width="2"/><text x="112" y="86" font-size="15" fill="#22304a" text-anchor="middle">环境</text><text x="112" y="108" font-size="14" fill="#5c6b85" text-anchor="middle">conda 或 venv</text><text x="112" y="124" font-size="14" fill="#5c6b85" text-anchor="middle">openai 等依赖</text><rect x="232" y="56" width="176" height="78" rx="10" fill="#ffffff" stroke="#12a58a" stroke-width="2"/><text x="320" y="86" font-size="15" fill="#22304a" text-anchor="middle">配置 .env</text><text x="320" y="108" font-size="14" fill="#5c6b85" text-anchor="middle">入口地址</text><text x="320" y="124" font-size="14" fill="#5c6b85" text-anchor="middle">密钥</text><rect x="440" y="56" width="176" height="78" rx="10" fill="#ffffff" stroke="#e0821f" stroke-width="2"/><text x="528" y="86" font-size="15" fill="#22304a" text-anchor="middle">模型</text><text x="528" y="108" font-size="14" fill="#5c6b85" text-anchor="middle">部署名</text><text x="528" y="124" font-size="14" fill="#5c6b85" text-anchor="middle">接口版本号</text><path d="M136 134 L136 176 L300 176" stroke="#8b96ad" stroke-width="2" fill="none"/><path d="M320 134 L320 176" stroke="#8b96ad" stroke-width="2" fill="none"/><path d="M504 134 L504 176 L340 176" stroke="#8b96ad" stroke-width="2" fill="none"/><rect x="212" y="176" width="216" height="52" rx="10" fill="#eaf0ff" stroke="#5b7cfa" stroke-width="2"/><text x="320" y="198" font-size="15" fill="#22304a" text-anchor="middle">脚本发出请求</text><text x="320" y="217" font-size="14" fill="#5c6b85" text-anchor="middle">三样缺一样，报错都很像</text></svg>`, caption: `脚本、配置、模型三方各出一部分，请求才出得去` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `在浏览器里开一个依赖已经装好的容器，本机不装 Python 也能跑完全部示例`,
    `换提供方时只改配置不改代码：入口地址和密钥一换，脚本原样能用`,
    `用 Notebook 逐格执行，看清每一步中间结果而不是等最后一行打印`,
    `报错时能分清是包没装上、密钥读不到，还是这个资源下没有那个模型`
  ] },
  { t: `h2`, text: `演示 1 · 把配置放进 .env` },
  { t: `code`, lang: `bash`, code: `touch .env\n# Windows 用: echo . > .env` },
  { t: `code`, lang: `ini`, code: `AZURE_INFERENCE_ENDPOINT=你的入口地址\nAZURE_INFERENCE_CREDENTIAL=你的密钥\nOPENAI_API_KEY=另一种写法，用哪家填哪家` },
  { t: `p`, text: `一行一个变量，等号两边不留空格，值不要加引号。文件名是 .env 不是 env.txt，而且它应当在 .gitignore 里；一旦提交，密钥就等于公开过一次。` },
  { t: `h2`, text: `演示 2 · 先确认读到了，再发请求` },
  { t: `code`, lang: `python`, code: `from dotenv import load_dotenv\nimport os\n\nload_dotenv()\n\nendpoint = os.getenv("AZURE_INFERENCE_ENDPOINT")\nkey = os.getenv("AZURE_INFERENCE_CREDENTIAL")\nprint(bool(endpoint), bool(key), endpoint)` },
  { t: `p`, text: `两个 bool 都是 True 才往下走。只要有一个 False，问题在 .env 的位置或变量名上，和模型无关。load_dotenv 按当前工作目录找文件，脚本从别的目录启动时就找不到，这时把完整路径传给它。` },
  { t: `h2`, text: `演示 3 · 一条最小请求` },
  { t: `code`, lang: `python`, code: `from openai import AzureOpenAI\n\nclient = AzureOpenAI(api_key=key, azure_endpoint=endpoint,\n                     api_version="2024-10-01")\nr = client.chat.completions.create(\n    model="gpt-4o-mini",\n    messages=[{"role": "user", "content": "用一句话说清什么是大模型"}])\nprint(r.choices[0].message.content)` },
  { t: `p`, text: `这一条同时验证了四件事：包装上了、密钥读到了、入口地址连通、这个名字的模型在你这个资源下确实存在。顺序按这四步排查，比盯报错文本猜快得多。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `密钥直接写进 .py 再提交：只能吊销重发，改提交历史不算解决`,
    `改了 .env 却继续用旧进程：环境变量在进程启动时读一次，Notebook 里要重启内核才生效`,
    `提示找不到内核当成装包问题：在内核菜单里选一次 Python 就够了`,
    `终端里 python 不是内部命令：多半是终端没附加到容器，新开一个 bash`,
    `容器构建卡住就硬等：超过十分钟直接重建容器更省时间`,
    `401 只怀疑密钥：入口地址写错地域、写错资源、版本号对不上，报的是同一个 401`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `跑到打印出模型回答为止，然后故意把入口地址写错一次，记下报错长什么样`,
    `同一个脚本分别用环境变量和硬编码各写一份，跑通之后删掉硬编码那份，说明为什么删`,
    `建一个干净环境，只装 openai 和 python-dotenv 两个包，验证前面的脚本还能跑`,
    `把最小请求改成一个循环，问三句不同的话，打印出每次请求里重复发出去的部分`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：环境这一步只有一件事是真本事——让密钥和入口地址离开代码、进入环境变量，其余全是重复劳动。` }
];
