window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["genai-c07"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把一次请求做成一个小应用——提示是能被填的模板，输出是被读的数据，两轮之间由你负责拼上下文。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `从「问一句」到「一个应用」，加的不是智能，是四段结构：收集参数的入口、把参数填进提示的模板、发请求并带上限制、把返回的文本切成程序能用的东西。提示词在这里的角色是配置——它决定行为，但不该决定代码要不要改。` },
  { t: `p`, text: `多步应用靠一件事串起来：把上一轮的输出拼进下一轮的输入。服务不记得你上一次请求，除非你把内容再发一遍。这条规则同时解释了成本和失败——第二轮的输入比第一轮长，它包含第一轮的全文，所以两轮的 token 是叠加的，而第一轮的错会被第二轮当作事实继续往下算。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280" font-family="sans-serif"><rect width="640" height="280" fill="#f4f7f9"/><text x="320" y="26" font-size="17" fill="#22304a" text-anchor="middle">两步链路：第二轮的输入装着第一轮的全部输出</text><rect x="24" y="50" width="120" height="40" rx="6" fill="#e2e9f7" stroke="#8b96ad"/><text x="84" y="75" font-size="14" fill="#22304a" text-anchor="middle">用户输入三项</text><path d="M144 70 L172 70" stroke="#8b96ad" stroke-width="2"/><rect x="172" y="50" width="128" height="40" rx="6" fill="#dfe8ff" stroke="#5b7cfa" stroke-width="2"/><text x="236" y="75" font-size="14" fill="#22304a" text-anchor="middle">模板填空</text><path d="M300 70 L328 70" stroke="#8b96ad" stroke-width="2"/><rect x="328" y="50" width="112" height="40" rx="6" fill="#ffffff" stroke="#5b7cfa" stroke-width="2"/><text x="384" y="75" font-size="14" fill="#22304a" text-anchor="middle">请求一</text><path d="M440 70 L468 70" stroke="#8b96ad" stroke-width="2"/><rect x="468" y="44" width="146" height="52" rx="6" fill="#d9f0e7" stroke="#12a58a" stroke-width="2"/><text x="541" y="66" font-size="14" fill="#22304a" text-anchor="middle">五道菜的食材</text><text x="541" y="86" font-size="14" fill="#6a748c" text-anchor="middle">约 500 个片段</text><path d="M541 96 L541 130 L330 130 L330 150" stroke="#e0821f" stroke-width="2" fill="none"/><text x="356" y="126" font-size="14" fill="#8a5213">原样带过去</text><rect x="240" y="150" width="180" height="44" rx="6" fill="#ffffff" stroke="#e0821f" stroke-width="2"/><text x="330" y="170" font-size="14" fill="#22304a" text-anchor="middle">请求二</text><text x="330" y="188" font-size="14" fill="#6a748c" text-anchor="middle">输入 = 上轮输出 + 新指令</text><path d="M420 172 L456 172" stroke="#8b96ad" stroke-width="2"/><rect x="456" y="150" width="158" height="44" rx="6" fill="#d9f0e7" stroke="#12a58a" stroke-width="2"/><text x="535" y="170" font-size="14" fill="#22304a" text-anchor="middle">购物清单</text><text x="535" y="188" font-size="14" fill="#6a748c" text-anchor="middle">再被切成程序能读的行</text><rect x="24" y="212" width="590" height="34" rx="6" fill="#eef2f6" stroke="#8b96ad"/><text x="319" y="234" font-size="14" fill="#22304a" text-anchor="middle">两轮的片段数相加计费，输入侧和输出侧各算一次</text><text x="24" y="268" font-size="14" fill="#6a748c">第一轮的错会被第二轮当成事实继续算，所以链路越短越稳。</text></svg>`, caption: `看两处：数据往哪儿流，长度在哪儿翻倍` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `不改代码只改措辞就换行为：提示当配置，改完立刻生效`,
    `把一件人手三步的事串成一次运行：先出方案，再汇总成清单`,
    `同一套逻辑处理任意材料：换食材、换文档、换数据都只换填空`,
    `输出直接进入别的程序：切成行列、写进文件、贴进表格`
  ] },
  { t: `h2`, text: `演示 1 · 提示是模板，参数从外面进` },
  { t: `code`, lang: `python`, code: `TEMPLATE = ("给我 {n} 道能用 {items} 做的菜，每道只列食材，不要出现 {avoid}。\"\n            \"按 编号. 菜名 | 食材一, 食材二 的格式输出，不要写解释。\")\n\nn = input("几道：")\nitems = input("家里有什么：")\navoid = input("忌口：\")\nprompt = TEMPLATE.format(n=n, items=items, avoid=avoid)` },
  { t: `p`, text: `三个空是可变的事实，规则留在模板里不动。注意最后一句「不要写解释」：这句话不是礼貌用语，是给下游解析器腾位置。` },
  { t: `h2`, text: `演示 2 · 两步串起来` },
  { t: `code`, lang: `python`, code: `first = ask(prompt)\nsecond = ask(first + "\\n把上面所有菜的食材合并成一张购物清单，同名合并计数，"\n                      "去掉家里已有的：" + items)\nprint(second)` },
  { t: `p`, text: `第二次的输入里明确带着第一次的输出，这就是所谓「记忆」的全部实现方式。少拼一句，模型不是忘了，是压根没拿到。拼过去之后，第一轮把某道菜写成 4 道，第二轮的清单也会跟着错——链路上的错误不会自己修正。` },
  { t: `h2`, text: `演示 3 · 三个应用级参数` },
  { t: `code`, lang: `python`, code: `def ask(text, temperature=0.5, max_tokens=400):\n    r = client.chat.completions.create(model="fast", temperature=temperature,\n        max_tokens=max_tokens, messages=[{"role": "user", "content": text}])\n    return r.choices[0].message.content\n\nfor t in [0, 0.5, 1]:\n    print(t, ask("给楼下的咖啡店想一句招牌语", temperature=t)[:24])` },
  { t: `p`, text: `max_tokens 掐的是输出，输入另算，两边相加不能超过上下文窗口。温度这一项要看型号：偏新的推理类模型不接受它，同样的调法在那里毫无效果，那些模型换成控制推理力度的参数，行为主要靠提示钉。写应用时把参数集中在一处，换型号才只改一行。` },
  { t: `h2`, text: `演示 4 · 输出当数据读` },
  { t: `code`, lang: `python`, code: `dishes = [ln.split("|") for ln in first.splitlines() if "|" in ln]\nshopping = {}\nfor _, ing in dishes:\n    for item in ing.split(","):\n        shopping[item.strip()] = shopping.get(item.strip(), 0) + 1\nprint(sorted(shopping.items(), key=lambda kv: -kv[1])[:10])` },
  { t: `p`, text: `能切是因为提示里定了分隔符；不崩是因为只取含分隔符的那几行——模型偶尔会多塞一句客套话。给人看的部分和给程序读的部分要分开要求，越具体越省后处理。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `用户输入不加边界就拼进提示：那里面出现「忽略上面的要求」，任务就被改写了`,
    `提示写死在源码里：改一个措辞要走一次发版`,
    `第二轮只写新指令不带上一轮输出，然后判断它「记性差」`,
    `把 max_tokens 当省钱开关：它管不到输入那一半`,
    `认定温度到处生效：推理类模型直接忽略这个参数`,
    `输出里混着解释和结果：解析器读到第一行就炸`,
    `只靠肉眼验收：非确定的输出没有回归集，你永远不知道改坏了没有`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把模板从代码里挪进一个单独的文件，程序运行时读它，验证改措辞不用改代码`,
    `把两步链路压成一步（清单要求并进第一句提示），比较两次的 token 用量和错漏`,
    `给第二轮加上「只出行，不要解释」，说清解析器现在为什么不崩，以及什么时候还会崩`,
    `同一份输入连跑三次，记下哪几项每次都变，再把那几项改成程序自己算`,
    `把 max_tokens 从 600 一路降到 120，找出这条链路最先失效的那一步`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：应用和演示的分界就三条——提示能被填、输出能被读、上下文由你来拼。` }
];
