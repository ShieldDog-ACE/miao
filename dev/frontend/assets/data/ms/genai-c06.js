window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["genai-c06"] = [
  { t: `tip`, color: `blue`, text: `本课目标：看懂进阶提示的共同机制——把中间产出的文字再塞回输入，让它有据可依。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `第 5 课说过模型只读一条序列，第 2 课说过它只会续写最像话的下一个片段。所谓进阶技巧没有一种是新的能力，全都在做同一件事：在它作答之前，多往那条序列里放一些它自己或者你写好的文字。思维链是把拆解的算式放进去，先问步骤再问答案是分两次放进去，自我改进是把批评意见放进去重写，生成知识是把它自己知道的事实先取出来再放进去。` },
  { t: `p`, text: `这也解释了为什么这些技巧有时不管用：如果只写一句「请一步步思考」而没有任何中间文字进入输入，你其实什么都没放进去。有效的是那些字，不是那个指令。至于同一个提示要给出多样还是一样，仍然回到温度这一个开关上。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `把一道会被脱口答错的题算对——不是它变聪明，是它看到了自己写下的中间行`,
    `把一份初稿变成第二稿：批评意见进了上下文，改动才有根据`,
    `先取出它零散知道的事实，再限定只按这些事实作答`,
    `一次拿到五个风格不同的候选，交给人挑，而不是接受它随手给的那一个`
  ] },
  { t: `h2`, text: `演示 1 · 中间那三行值不值` },
  { t: `code`, lang: `python`, code: `q = "小红有 5 个苹果，扔了 3 个，给小亮 2 个，小亮又还她 1 个，现在几个？"\ncot = ("小蓝有 7 个橘子，扔了 1 个，给小绿 4 个，小绿又还她 1 个：\\n"\n       "7 - 1 = 6\\n6 - 4 = 2\\n2 + 1 = 3\\n所以是 3 个。\\n" + q)\nfor p in [q, cot]:\n    print(ask(p, temperature=0))` },
  { t: `p`, text: `第一行大概率给出 5——「最后一个数字」是这类问题最像话的续写。第二行多了一段算法示范和原题，答案就落在示范的延续上，给出 1。把 ask 换成第 1 课那条最小请求包一个函数即可，温度设 0 是为了让两次的差别只来自提示。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280" font-family="sans-serif"><rect width="640" height="280" fill="#f5f7f5"/><text x="320" y="26" font-size="17" fill="#233048" text-anchor="middle">同一条序列里多放三行，结果就换一条</text><text x="30" y="58" font-size="15" fill="#233048">只给题目</text><rect x="30" y="68" width="200" height="34" rx="6" fill="#e4eaf5" stroke="#8b96ad"/><text x="130" y="90" font-size="14" fill="#233048" text-anchor="middle">题目 · 5 减 3 减 2 加 1</text><path d="M230 85 L270 85" stroke="#8b96ad" stroke-width="2"/><rect x="270" y="68" width="110" height="34" rx="6" fill="#ffffff" stroke="#5b7cfa" stroke-width="2"/><text x="325" y="90" font-size="14" fill="#233048" text-anchor="middle">模型</text><path d="M380 85 L420 85" stroke="#8b96ad" stroke-width="2"/><rect x="420" y="68" width="150" height="34" rx="6" fill="#f6dcdc" stroke="#c15454" stroke-width="2"/><text x="495" y="90" font-size="14" fill="#233048" text-anchor="middle">答：5 个</text><text x="30" y="140" font-size="15" fill="#233048">前面多了一段示范的算式</text><rect x="30" y="150" width="200" height="66" rx="6" fill="#d9f0e7" stroke="#12a58a" stroke-width="2"/><text x="130" y="172" font-size="14" fill="#233048" text-anchor="middle">7 - 1 = 6</text><text x="130" y="192" font-size="14" fill="#233048" text-anchor="middle">6 - 4 = 2</text><text x="130" y="212" font-size="14" fill="#233048" text-anchor="middle">2 + 1 = 3</text><path d="M230 183 L270 183" stroke="#8b96ad" stroke-width="2"/><rect x="270" y="166" width="110" height="34" rx="6" fill="#ffffff" stroke="#5b7cfa" stroke-width="2"/><text x="325" y="188" font-size="14" fill="#233048" text-anchor="middle">模型</text><path d="M380 183 L420 183" stroke="#8b96ad" stroke-width="2"/><rect x="420" y="166" width="150" height="34" rx="6" fill="#dcefe4" stroke="#12a58a" stroke-width="2"/><text x="495" y="188" font-size="14" fill="#233048" text-anchor="middle">答：1 个</text><text x="30" y="254" font-size="14" fill="#6a748c">三行算式不是解释给人看的，它是喂给模型的输入。</text><text x="300" y="254" font-size="14" fill="#6a748c">没有这些字，只有那句思考指令，等于没加。</text></svg>`, caption: `上下两条链路只差那三行算式，答案就换了` },
  { t: `h2`, text: `演示 2 · 先要步骤，再要答案` },
  { t: `code`, lang: `python`, code: `steps = ask("把「判断一篇课文适不适合三年级」拆成 5 步，只写步骤，别下结论", temperature=0)\nfinal = ask("按下面的步骤逐步判断，每步写出一句依据：\\n" + steps + "\\n课文：" + text, temperature=0)` },
  { t: `p`, text: `这就是由少到多：拆解决的问题，第一次请求不许它给结论，因为它一旦给结论就会顺着结论挑步骤。两次请求之间传的是文字，所以你能把 steps 打印出来检查——这比在一段回答里挑「它是不是真的想了」要实在。` },
  { t: `h2`, text: `演示 3 · 批评一轮再重写` },
  { t: `code`, lang: `python`, code: `draft = ask(prompt, temperature=0.7)\ncritique = ask("指出下面这段回答的三处问题，只列问题，不要改写：\\n" + draft, temperature=0)\nfinal = ask(prompt + "\\n上一稿：\\n" + draft + "\\n评审意见：\\n" + critique, temperature=0.5)` },
  { t: `p`, text: `三个细节：批评单独一次请求，并且禁止它顺手改写——同一轮里既当作者又当读者，它倾向于替自己辩护；批评只许三条，否则第二条稿子会把力气花在措辞上；重写时把原任务和上一稿都带上，少任何一样都会漂题。轮数到三四之后通常只剩改标点。` },
  { t: `h2`, text: `演示 4 · 先取出事实，再限定只用这些事实` },
  { t: `code`, lang: `python`, code: `facts = ask("关于丝绸之路对唐代饮食的影响，写 5 条你知道的事实，每条一句话", temperature=0.9)\nanswer = ask("只根据下面的事实作答，事实里没有的不要补：\\n" + facts +\n             "\\n问题：唐代餐桌上有哪些外来东西？", temperature=0)` },
  { t: `p`, text: `第一句的作用是把零散知道的东西召到上下文里，第二句把它关进范围：这既提高了相关性，也让输出变得可核对——你能明确指出这句依据第几条事实。但召回来的事实本身可能就是编的，所以这条链路的终点是核对，不是采信。温度用在这两处刚好相反：召材料要高、作答要低。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `把拆解和作答挤在一次请求里：中间步骤被结论带着走，拆了等于没拆`,
    `只写一句「一步步想」：没有中间文字进入输入，就没有任何机制发生变化`,
    `自我批评和重写合并成一句：模型会为自己的第一稿找理由`,
    `步骤越加越多：每步都占上下文长度，还压掉最终回答可用的额度`,
    `把生成的事实当资料：它是概率的产物，不是检索的结果`,
    `拿高温度当「更深地思考」：那只是换了一批低概率片段，依据没增加`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `选一道会被脱口答错的题，比较直问、加算式示范、先要步骤三种写法，记下各自什么时候失效`,
    `实现两轮自我批评，把三稿全文贴出来，数第三稿相对第一稿实际改了几处`,
    `用生成知识那条链路问一个冷僻问题，把召回来的五条事实逐条去查，记下假了几条`,
    `同一条开放性提示在温度 0、0.7、1 三档各跑五次，判断哪一档最需要人工来挑`,
    `把演示 3 的「只列问题，不要改写」删掉再跑，看第二稿发生了什么`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：所有进阶技巧都在做一件事——在它作答之前，先让相关的文字进入那条序列；放进来的字才算数，口号不算。` }
];
