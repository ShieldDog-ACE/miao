window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["genai-c21"] = [
  { t: `tip`, color: `blue`, text: `本课目标：拿 Mistral 这条产品线当一个完整的选型练习——三个型号各自站在哪一格，以及切词这一层为什么能影响你的账单。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `第 17 课讲过，Mistral 走的是效率路线：同尺寸里要把质量挤出来。这一课它给了三个位置。旗舰是 Large 二代，面向企业，上下文窗口从三万二涨到十二万八，数学和代码那批基准的平均准确率从六十点四爬到七十六点九，多语种覆盖十几种语言。窗口大这一条不是锦上添花：第 16 课的检索一次能塞回的原文段数直接跟着涨。它在三件事上被点名——检索增强、原生函数调用（可以并行发也可以排队发）、写代码，Python、Java、TypeScript、C++ 都在行。` },
  { t: `p`, text: `中间那格是 Small，名字里就说了它是小语言模型：相对 Large 和 NeMo 大约八成的价格降幅、延迟更低、能铺到资源要求更宽的环境上。适合的是文字活——摘要、情感分析、翻译；适合频繁调用；适合等不起的代码审查和补全。这正是第 20 课那条取舍轴落到具体型号上的样子。` },
  { t: `p`, text: `第三格是 NeMo，三个里唯一免费且给的是 Apache 2 许可的那一个，被看作早先那个七十亿开放型号的升级版。三件事值得记：换了分词器，用 Tekken 而不是常见的 tiktoken，对更多语言和代码更友好；基座开放，可以拿去微调；跟 Large 一样训练过原生函数调用，这在当时的开放模型里很少见。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260"><text x="20" y="22" font-size="16" font-weight="bold" fill="#0f172a">同一句话，切法不同，算钱的地方就不同</text><text x="20" y="52" font-size="14" fill="#0f172a">输入：请把下面这段中文摘要成三句，并列出代码里的风险</text><rect x="20" y="64" width="72" height="34" rx="4" fill="#e0f2fe" stroke="#0284c7"/><rect x="96" y="64" width="56" height="34" rx="4" fill="#e0f2fe" stroke="#0284c7"/><rect x="156" y="64" width="88" height="34" rx="4" fill="#e0f2fe" stroke="#0284c7"/><rect x="248" y="64" width="60" height="34" rx="4" fill="#e0f2fe" stroke="#0284c7"/><rect x="312" y="64" width="80" height="34" rx="4" fill="#e0f2fe" stroke="#0284c7"/><rect x="396" y="64" width="56" height="34" rx="4" fill="#e0f2fe" stroke="#0284c7"/><rect x="456" y="64" width="96" height="34" rx="4" fill="#e0f2fe" stroke="#0284c7"/><text x="20" y="126" font-size="14" fill="#0c4a6e">老分词器：切成 7 块，非英语常常被拆成一堆碎片</text><rect x="20" y="142" width="140" height="34" rx="4" fill="#dcfce7" stroke="#16a34a"/><rect x="164" y="142" width="140" height="34" rx="4" fill="#dcfce7" stroke="#16a34a"/><rect x="308" y="142" width="140" height="34" rx="4" fill="#dcfce7" stroke="#16a34a"/><rect x="452" y="142" width="100" height="34" rx="4" fill="#dcfce7" stroke="#16a34a"/><text x="20" y="204" font-size="14" fill="#14532d">新分词器：切成 4 块，一个词块装下更多文字</text><text x="20" y="234" font-size="14" fill="#64748b">块少了：同样的窗口能塞更多原文，同一份请求少付三分之一的钱</text></svg>`, caption: `分词器是模型的读法，它决定了你的中文和代码被折算成多少个计价单位` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `一次把整份长合同塞进上下文再问条款，不必先做检索`,
    `让模型自己决定并行发三个接口调用，而不是等一个回一个`,
    `把高频的摘要与情感判断放到便宜的型号上，省下的额度留给少数难题`,
    `拿一个 Apache 2 许可的基座自己练一版，改完还能商用再分发`
  ] },
  { t: `h2`, text: `演示 1 · 检索那一格怎么落地` },
  { t: `code`, lang: `python`, code: `chunks = [essay[i:i + 2048] for i in range(0, len(essay), 2048)]

vec = embed_client.embed(input=chunks, model="cohere-embed-v3-multilingual")
mat = np.array([d.embedding for d in vec.data])

index = faiss.IndexFlatL2(mat.shape[1])
index.add(mat)

q = np.array(embed_one(question).embedding)
D, I = index.search(q.reshape(1, -1), k=2)` },
  { t: `p`, text: `这就是第 16 课那条链路的一份具体实现：切块、向量化、建索引、按最近邻取两块。注意嵌入模型选的是多语种那款，而提问用韩文写的——跨语言的检索要靠这个选择，不是靠模型运气。最后拼提示词时原样给了两句硬话：资料在中间这两条横线之间，只根据资料回答，不要用你自己的想法。` },
  { t: `h2`, text: `演示 2 · 同一个问题问两个型号` },
  { t: `code`, lang: `python`, code: `msgs = [SystemMessage(content="你是写代码的助手"),
        UserMessage(content="写一个 fizz buzz 的 Python 函数")]

for name in ["Mistral-small", "Mistral-large"]:
    t0 = time.perf_counter()
    r = client.complete(messages=msgs, model=name,
                        temperature=1.0, max_tokens=1000)
    print(name, round(time.perf_counter() - t0, 2),
          len(r.choices[0].message.content))` },
  { t: `p`, text: `原教程这一步只让你观察两件事：同样的提示词，两个型号的响应时长能差出三到五秒，而且回答的长短和风格也不一样。别把这段当成 benchmark——你的结论要从第 15 课那批用例上取，这里只是教你怎么把两个型号放到同一个起跑线上比。` },
  { t: `h2`, text: `演示 3 · 数一数你的请求花了多少块` },
  { t: `code`, lang: `python`, code: `from mistral_common.tokens.tokenizers.mistral import MistralTokenizer

tok = MistralTokenizer.from_model("open-mistral-nemo")
res = tok.encode_chat_completion(request_with_tools)
print(len(res.tokens))

tok2 = MistralTokenizer.from_model("mistral-large-latest")
print(len(tok2.encode_chat_completion(request_with_tools).tokens))` },
  { t: `p`, text: `同一条请求、同一份函数清单，两个型号数出来的 token 数不一样——这就是换分词器的实际意义。它还顺带提醒一件事：第 12 课那份工具清单也是要被切块计费的，函数描述写得越长越啰嗦，每一次请求都在付这个钱。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `把上下文窗口当成可用的检索替代品：十二万八塞得下原文，不等于模型真读完了每一段`,
    `所有请求都发给旗舰型号，摘要这种窄活也用它，账单翻倍质量不涨`,
    `只比速度不比内容长度，小型号少写了一半解释，看着像更快`,
    `以为免费许可就等于随便用：改名再发布、拿去训练竞品，条款各不相同`,
    `嵌入模型和生成模型的语言覆盖不一致，跨语言检索召回一片空白`,
    `工具清单又长又重复，每次请求都驮着它跑，token 花在说明书上`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把同一份二十条用例分别跑在便宜型号和旗舰型号上，列出延迟、每千 token 成本、质量三列，写出你按问题类型分流的规则`,
    `拿一段中文和一段代码，分别用两个型号的分词器数 token，算出差异比例`,
    `用十二万八的窗口做一次不检索的问答：整篇文档直接塞进去，跟第 16 课的检索版比较答案的有据程度`,
    `让同一个问题触发两次并行函数调用和一次串行调用，比较总时延`,
    `挑一个 Apache 2 许可的基座，列出你打算怎么用它的例子，并说明商用再分发时你要遵守什么`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：一条产品线卖的不是一个模型而是三种取舍——窗口、单价、许可，看清自己卡在哪一格，选型就变成一道算术题。` }
];
