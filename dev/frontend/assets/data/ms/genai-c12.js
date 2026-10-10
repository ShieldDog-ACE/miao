window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["genai-c12"] = [
  { t: `tip`, color: `blue`, text: `本课目标：看懂函数调用这条回路——模型并不真的执行任何东西，它只是按你给的模板吐出一段结构化请求，执行和回填是你的代码的事。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `第 6 课、第 7 课你已经在跟模型反复要 JSON 了。问题是它给出来的 JSON 不一定长得一样。原教程里有个很朴素的例子：两段学生简介，字段几乎对齐，唯一差别是一句 GPA 3.7 另一句 GPA 3.8，同一条提示词发给模型，要求抽出 name、major、school、grades、club 五个字段。第一段回来的 grades 是 3.7，第二段回来的是 3.8 GPA。` },
  { t: `p`, text: `字段没错、值也没错，坏在格式。你下游要写进数据库或者拼进 API 查询，就得为这种飘动写一堆校验和清洗代码，而且永远不知道下一次还会飘成什么样。根源是：自然语言进去，自然语言出来，中间没有一个强约束的形状。` },
  { t: `p`, text: `函数调用干的事就是把形状从提示词里挪到接口层。你在请求里附一份工具清单，每项写着名字、干什么、要哪些参数、每个参数什么类型、哪些必填。模型读完用户那句话，不再写散文，而是输出一个条目：要调哪个函数，参数是一段照着上面那份 schema 填的 JSON 文本。你的代码解析它、真的去调用、把返回值连同原来的 call_id 一起塞回上下文，再发第二次请求，模型才把结果组织成人话。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><defs><marker id="f12" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#475569"/></marker></defs><text x="20" y="22" font-size="16" font-weight="bold" fill="#0f172a">模型只吐请求，执行和回填都在你这边</text><rect x="20" y="40" width="180" height="56" rx="8" fill="#e0f2fe" stroke="#0284c7"/><text x="110" y="64" font-size="14" text-anchor="middle" fill="#0c4a6e">用户一句话</text><text x="110" y="84" font-size="14" text-anchor="middle" fill="#0c4a6e">帮我找门入门课</text><rect x="230" y="40" width="180" height="56" rx="8" fill="#f1f5f9" stroke="#475569"/><text x="320" y="64" font-size="14" text-anchor="middle" fill="#0f172a">请求：消息 + 工具清单</text><text x="320" y="84" font-size="14" text-anchor="middle" fill="#0f172a">模型看不见你的代码</text><rect x="440" y="40" width="180" height="56" rx="8" fill="#fef3c7" stroke="#d97706"/><text x="530" y="64" font-size="14" text-anchor="middle" fill="#92400e">输出 function_call</text><text x="530" y="84" font-size="14" text-anchor="middle" fill="#92400e">name + arguments 文本</text><rect x="440" y="176" width="180" height="56" rx="8" fill="#dcfce7" stroke="#16a34a"/><text x="530" y="200" font-size="14" text-anchor="middle" fill="#14532d">你的代码执行</text><text x="530" y="220" font-size="14" text-anchor="middle" fill="#14532d">真去查接口或数据库</text><rect x="230" y="176" width="180" height="56" rx="8" fill="#dcfce7" stroke="#16a34a"/><text x="320" y="200" font-size="14" text-anchor="middle" fill="#14532d">结果按 call_id 回填</text><text x="320" y="220" font-size="14" text-anchor="middle" fill="#14532d">模型不回填就看不见</text><rect x="20" y="176" width="180" height="56" rx="8" fill="#f1f5f9" stroke="#475569"/><text x="110" y="200" font-size="14" text-anchor="middle" fill="#0f172a">第二次请求</text><text x="110" y="220" font-size="14" text-anchor="middle" fill="#0f172a">组织成自然语言答复</text><line x1="200" y1="68" x2="228" y2="68" stroke="#475569" stroke-width="2" marker-end="url(#f12)"/><line x1="410" y1="68" x2="438" y2="68" stroke="#475569" stroke-width="2" marker-end="url(#f12)"/><line x1="530" y1="96" x2="530" y2="174" stroke="#475569" stroke-width="2" marker-end="url(#f12)"/><line x1="440" y1="204" x2="412" y2="204" stroke="#475569" stroke-width="2" marker-end="url(#f12)"/><line x1="230" y1="204" x2="202" y2="204" stroke="#475569" stroke-width="2" marker-end="url(#f12)"/><text x="530" y="140" font-size="14" text-anchor="middle" fill="#64748b">这一步之后模型已经"说完了"</text></svg>`, caption: `上排是模型参与的两次问答，下排全是你自己的代码；箭头走满一整圈才算一轮` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `把一句模糊需求落成一次确切动作：发信给讲师、查某个人交没交作业`,
    `回答"现在""今天""这家店还剩几件"这类模型训练截止后根本不知道的事`,
    `从一篇文章或一份 CSV 里抽出固定字段，直接落库，不再清洗`,
    `让第 8 课那种搜索变成对话式的：用户随口一句，转成带三个过滤条件的查询`
  ] },
  { t: `h2`, text: `演示 1 · 先看见没有函数时的那点飘` },
  { t: `code`, lang: `python`, code: `prompt = """请从下面文本抽出 name / major / school / grades / club，
以 JSON 返回。
文本：""" + student_description

r = client.responses.create(model=deployment,
        input=[{"role": "user", "content": prompt}], store=False)
print(r.output_text)` },
  { t: `p`, text: `两次跑，grades 一次是 3.7 一次是 3.8 GPA。提示词一模一样，字段也一模一样，唯一变的是模型的心情。想要形状稳定，靠提示词加更多"必须、严禁"是压不住的，得换机制。` },
  { t: `h2`, text: `演示 2 · 把形状写进请求` },
  { t: `code`, lang: `python`, code: `tools = [{
    "type": "function", "name": "search_courses",
    "description": "按角色、产品、难度检索课程目录",
    "parameters": {
        "type": "object",
        "properties": {
            "role":    {"type": "string", "description": "学习者身份"},
            "product": {"type": "string", "description": "涉及的产品"},
            "level":   {"type": "string", "description": "入门 / 进阶 / 高阶"},
        }, "required": ["role"],
    },
}]` },
  { t: `p`, text: `description 是模型唯一能读到的说明书，参数名和它的描述合起来决定模型会不会挑这个函数、参数填得对不对。原教程在这里有句话值得抄在显示器边上：函数清单本身是拼进上下文发出去的，它也吃你的 token 额度。注册二十个工具不只是选错率高，账单也跟着涨。` },
  { t: `h2`, text: `演示 3 · 收回来的是调用，不是答案` },
  { t: `code`, lang: `python`, code: `resp = client.responses.create(model=deployment, input=messages,
        tools=tools, tool_choice="auto", store=False)
calls = [i for i in resp.output if i.type == "function_call"]

for c in calls:
    print(c.name)
    print(c.arguments)   # 这是字符串，不是字典
    print(c.call_id)` },
  { t: `p`, text: `arguments 得 json.loads 一次才变成能用的参数；直接下标取就当场报错。tool_choice 设 auto 是让模型自己决定要不要用；强制指定某个函数，它在查不到的时候也一样会调，这是死循环最常见的起点。` },
  { t: `h2`, text: `演示 4 · 执行、回填、再问一次` },
  { t: `code`, lang: `python`, code: `available = {"search_courses": search_courses}

for c in calls:
    args = json.loads(c.arguments)
    out = available[c.name](**args)
    messages.append(c)
    messages.append({"type": "function_call_output",
                     "call_id": c.call_id, "output": out})

final = client.responses.create(model=deployment, input=messages, tools=tools)` },
  { t: `p`, text: `append 的顺序有讲究：模型那条 function_call 得先进上下文，它的结果再跟在后面，这样第二次请求读到的才是一段完整的对话。回填靠 call_id 配对，一轮里模型可以同时点好几个函数，错配一次的后果是把 A 课程的信息讲成 B 课程。没有第二次请求，用户收到的就只是一段没根据的话。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `函数描述写成"处理数据""搜索内容"：范围越宽，模型越容易在不该用的时候用它`,
    `把 arguments 当字典直接下标，忘了 loads`,
    `工具返回空、返回异常或干脆不回填：模型不会停下来，它按想象补一个答案`,
    `查不到时不显式交出 unknown 这种值，而指望模型自己承认不知道`,
    `一次注册一大堆功能相近的函数，选错率和 token 一起上来，日志也读不动`,
    `以为模型执行了函数：它只输出了一段合法 JSON，真的请求是你自己发的`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `不用任何框架，只用原生请求，把"查课程"跑成完整两轮，并把 arguments 从字符串解析成参数的过程打印出来`,
    `把同一个需求的两个函数描述写得故意相似，观察模型选错的那一次，再改描述让它不再选错`,
    `让工具分别返回空列表和抛出异常，各跑一次，比较模型两次回答的区别，然后改成返回 unknown 再跑第三次`,
    `在一次请求里让模型同时点两个函数，验证回填时两个 call_id 各自对上了`,
    `数一下你的工具清单占掉多少 token，把它压到三个函数以内，看回答质量有没有变化`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：函数调用不是给模型加功能，是给模型一个填空的表格——它负责把话变成参数，你负责把参数变成事实再还给它。` }
];
