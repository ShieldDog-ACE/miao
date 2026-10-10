window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["agents-c05"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把工具调用这条链路一段拆开看——发出去的描述、收回来的调用、回填的结果、失败时说什么。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `模型看不见你的代码，只看得见一份描述：函数名、它做什么、要哪些参数、类型是什么。这份描述每次请求都跟着发出去，模型从里面挑一个，返回的也不是话，而是一个结构化条目——名字加上一串 JSON 文本形式的参数。你的程序负责把这一串解析成真正的调用，执行，再把结果用同一个 call_id 填回上下文，然后发起第二次请求。到这里才算一轮。第 3 课的框架做的正是把这套解析、派发、回填包掉了。` },
  { t: `p`, text: `所以工具层的四块东西缺一不可：描述、执行逻辑、消息往返、错误处理。前三块好理解，第四块决定这个 agent 能不能用——工具抛异常和工具返回一句"这个城市我没有时区数据"，对模型是完全不同的两件事：前者让这一轮断掉，后者让它自己换一条路。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#fffaf3"/><text x="320" y="24" font-size="17" fill="#4a3b2f" text-anchor="middle">左边这一轮要发两次请求，右边是同一处工具的两条分岔</text><rect x="20" y="44" width="250" height="36" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="145" y="67" font-size="14" fill="#4a3b2f" text-anchor="middle">① 上下文连着描述一起发出</text><path d="M145 80 L145 94" stroke="#8a7867" stroke-width="2"/><polygon points="145,100 140,90 150,90" fill="#8a7867"/><rect x="20" y="100" width="250" height="52" rx="6" fill="#fbe3c6" stroke="#e0821f"/><text x="145" y="122" font-size="14" fill="#4a3b2f" text-anchor="middle">② 回来的是一条调用，不是答案</text><text x="145" y="142" font-size="14" fill="#8a7867" text-anchor="middle">名字 + 一段 JSON 文本的参数</text><path d="M145 152 L145 166" stroke="#8a7867" stroke-width="2"/><polygon points="145,172 140,162 150,162" fill="#8a7867"/><rect x="20" y="172" width="250" height="52" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="145" y="194" font-size="14" fill="#4a3b2f" text-anchor="middle">③ 解析、执行、按标识回填</text><text x="145" y="214" font-size="14" fill="#c0392b" text-anchor="middle">配错一次，A 城市的时间给成 B</text><path d="M145 224 L145 238" stroke="#8a7867" stroke-width="2"/><polygon points="145,244 140,234 150,234" fill="#8a7867"/><rect x="20" y="244" width="250" height="36" rx="6" fill="#d5f0e8" stroke="#12a58a"/><text x="145" y="267" font-size="14" fill="#4a3b2f" text-anchor="middle">④ 第二次请求才有那句人话</text><text x="300" y="60" font-size="15" fill="#4a3b2f">工具坏掉的两种写法，模型读到的完全不同：</text><rect x="300" y="72" width="320" height="56" rx="6" fill="#faded9" stroke="#c0392b"/><text x="314" y="94" font-size="14" fill="#7f1d1d">抛异常</text><text x="314" y="114" font-size="14" fill="#4a3b2f">这一轮断掉，它只能照想象补一个时间</text><rect x="300" y="138" width="320" height="56" rx="6" fill="#d5f0e8" stroke="#12a58a"/><text x="314" y="160" font-size="14" fill="#1d4230">交出一句 unknown</text><text x="314" y="180" font-size="14" fill="#4a3b2f">它会承认不知道，或者去挑别的工具</text><text x="300" y="222" font-size="14" fill="#4a3b2f">四块缺一不可：</text><text x="300" y="244" font-size="14" fill="#8a7867">描述 · 执行逻辑 · 消息往返 · 错误处理</text><text x="300" y="266" font-size="14" fill="#8a7867">你只承诺它能做什么，它只等结果回来</text><text x="300" y="288" font-size="14" fill="#c0392b">你不回填，它就自己编一个</text></svg>`, caption: `左列是这一轮必须走满的四步，右列解释为什么第四块（错误处理）决定这个 agent 能不能用` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `回答"现在几点"这种模型永远不可能知道的问题——它只能靠查`,
    `把一句模糊需求落到具体动作上：查库存、跑一段计算、发一封信`,
    `在多个数据源之间挑：先查 SQLite，查不到再问接口`,
    `出错时不编数字：拿到的结果是 unknown，它就会说不知道或者换工具`
  ] },
  { t: `h2`, text: `演示 1 · 描述是唯一发出去的东西` },
  { t: `code`, lang: `python`, code: `tools = [{\n    "type": "function",\n    "name": "get_current_time",\n    "description": "查指定城市的当前时间",\n    "parameters": {\n        "type": "object",\n        "properties": {\n            "location": {"type": "string", "description": "城市名，英文"},\n        },\n        "required": ["location"],\n    },\n}]` },
  { t: `p`, text: `模型选不选它、参数填得对不对，全部来自 description 和属性名。用 @tool 装饰器时这份 schema 是框架从函数签名和文档字符串生成的——也就是说，文档字符串写得多含糊，你的工具就多不可靠。` },
  { t: `h2`, text: `演示 2 · 收回来的是调用，不是答案` },
  { t: `code`, lang: `python`, code: `response = client.responses.create(model=DEPLOYMENT, input=messages,\n                                  tools=tools, tool_choice="auto", store=False)\nmessages += response.output\nprint(response.output)\n# [ResponseFunctionToolCall(name='get_current_time',\n#   arguments='{"location":"San Francisco"}', call_id='call_pOsKdUlq...')]` },
  { t: `p`, text: `arguments 是一段 JSON 字符串，不是字典，得 loads 一次才拿得到参数。tool_choice 设 auto 是让模型自己决定要不要用；设成强制某个工具，它就一定会调——查不到的时候也一样，这是常见的死循环起点。` },
  { t: `h2`, text: `演示 3 · 执行并回填，call_id 必须对上` },
  { t: `code`, lang: `python`, code: `for call in [i for i in response.output if i.type == "function_call"]:\n    args = json.loads(call.arguments)\n    result = get_current_time(location=args.get("location"))\n    messages.append({"type": "function_call_output",\n                    "call_id": call.call_id, "output": result})\n\nfinal = client.responses.create(model=DEPLOYMENT, input=messages, tools=tools)\nprint(final.output_text)` },
  { t: `p`, text: `回填靠 call_id 配对：一轮里模型可以同时要点好几个工具，错配一次的后果是模型把 A 城市的时间说成 B 城市。没有第二次请求，用户拿到的就只是一段没根据的话。` },
  { t: `h2`, text: `演示 4 · 失败也要回一句有用的话` },
  { t: `code`, lang: `python`, code: `def get_current_time(location):\n    for key, tz in TIMEZONE_DATA.items():\n        if key in location.lower():\n            return json.dumps({"location": location,\n                               "current_time": datetime.now(ZoneInfo(tz)).strftime("%I:%M %p")})\n    return json.dumps({"location": location, "current_time": "unknown"})` },
  { t: `p`, text: `注意最后那句 return：查不到不抛错、不返回空，而是明确交出一个 unknown 字符串。模型读到它，会承认不知道或者去挑别的工具；读到异常，它只会照自己的想象补一个时间。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `工具描述写成"处理数据"：范围越宽，模型越容易在不该用的时候用它`,
    `一次注册十几个工具：能力圈越大选错率越高，日志也读不动`,
    `把返回的 JSON 字符串当字典直接下标：第一轮就 KeyError`,
    `多个工具调用共用一个 call_id 或者忘了回填：模型拿着半截上下文继续编`,
    `敏感工具不设确认、失败不记进第 4 课那条轨迹：出事之后无法回放是哪次调用坏了`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `只用原生请求，把"查城市时间"跑成完整两轮，并把 arguments 从字符串解析成参数的过程打印出来`,
    `给同一句提问注册两个描述相近的工具，观察模型选错的那一次，再改描述让它不再选错`,
    `故意让工具抛异常和返回 unknown 各跑一次，比较模型两次回答的区别`,
    `一次请求里让模型要点两个工具，验证回填时两个 call_id 各自对上了`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：工具不是给模型的功能，而是给模型的一段对话——你用描述承诺它能做什么，它用 call_id 等结果回来，你不回填，它就自己编一个。` }
];
