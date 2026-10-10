window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["ml-c18"] = [
  { t: `tip`, color: `blue`, text: `本课目标：用同一句话看清翻译和情感分析各自的机制——翻译坏在语序对不上，情感坏在词面不等于语气，顺带把上一课的词典打分推到它露馅的地方。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `规则派翻译两步：先给输入语言的每个词标好名词动词形容词，再按目标语言的格式把词摆出来。中间那层与具体语言无关的结构是它的赌注。I feel happy 的骨架是主语-动词-形容词；同一句爱尔兰语说 Tá athas orm，字面拆开是 Happy is upon me，骨架是动词-形容词-主语，连「快乐」在那门语言里都不是形容词而是名词——情绪被表达成「在你身上」。母语者翻回英语说的是 I feel happy：他懂意思，尽管词和结构都不同，这就是机器缺的东西。另一种思路不碰意思：把两种语言的大量文本配成对照（corpus），让统计抓反复出现的对应。傲慢与偏见 1813 年的英文和它的人类法译本就是一对现成语料。钱这个词是好例子：I have no money 逐词翻成 Je n'ai pas de monnaie，而 monnaie 指零钱、跟 money 不是同义词，属于假同源；人会说 Je n'ai pas d'argent。逐词翻译丢的是语序，统计翻译丢的是词面——它只知道这两个字符串常并排出现。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#fbfbfd"/><text x="20" y="30" font-size="15" fill="#222">同一句话，两种骨架</text><g font-size="14" text-anchor="middle"><rect x="40" y="46" width="130" height="34" rx="5" fill="#e8f0fb" stroke="#2471a3"/><text x="105" y="68" fill="#222">I（主语）</text><rect x="190" y="46" width="130" height="34" rx="5" fill="#f6e8e8" stroke="#c0392b"/><text x="255" y="68" fill="#222">feel（动词）</text><rect x="340" y="46" width="150" height="34" rx="5" fill="#e9f5ec" stroke="#1e8449"/><text x="415" y="68" fill="#222">happy（形容词）</text><text x="560" y="68" fill="#666">英语</text></g><g font-size="14" text-anchor="middle"><rect x="40" y="176" width="130" height="34" rx="5" fill="#f6e8e8" stroke="#c0392b"/><text x="105" y="198" fill="#222">Tá（动词）</text><rect x="190" y="176" width="130" height="34" rx="5" fill="#e9f5ec" stroke="#1e8449"/><text x="255" y="198" fill="#222">athas（名词）</text><rect x="340" y="176" width="150" height="34" rx="5" fill="#e8f0fb" stroke="#2471a3"/><text x="415" y="198" fill="#222">orm（在我身上）</text><text x="560" y="198" fill="#666">爱尔兰语</text></g><g fill="none" stroke-width="2"><path d="M105 80 C105 130 340 130 415 176" stroke="#2471a3"/><path d="M255 80 C255 120 150 140 105 176" stroke="#c0392b"/><path d="M415 80 C415 130 300 140 255 176" stroke="#1e8449"/></g><text x="20" y="238" font-size="14" fill="#333">三条连线全交叉：逐词直译得到 Mise bhraitheann athas（我-感觉-快乐）</text><text x="20" y="262" font-size="14" fill="#c0392b">词都对，句子不合法。要翻对就得换骨架：动词提前、情绪从形容词改成名词</text></svg>`, caption: `连线交叉的地方就是翻译会坏的地方：词能一一对上，结构不能` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `把一种语言换成另一种，只要拿得到两语对照的成品文本`,
    `对海量带人评分的文本自动判正面负面，人只看边界样本`,
    `给没标注的文本先粗打一个情感分，用来排序、分层或筛极端值`
  ] },
  { t: `h2`, text: `演示 1 · 语序不匹配时，逐词翻译给出的是废句` },
  { t: `code`, lang: `python`, code: `en = ["I", "feel", "happy"]\npairs = {"I": "Mise", "feel": "bhraitheann", "happy": "athas"}\nprint(" ".join(pairs[w] for w in en))   # 字面 = me feel happy，不合法\nprint("Tá athas orm")                   # 字面 = happy is upon me，这才是那句话` },
  { t: `p`, text: `这段没有任何错误可报：三个词都查得到、拼写也对，产出却是废句。翻译的错误不体现在词上，体现在结构上——所以只靠词对词统计的做法，在结构差异大的语言对上会一路绿灯地翻错。邻近也不构成理由：英语和爱尔兰语在两座挨着的岛上，语法结构完全是两回事。` },
  { t: `h2`, text: `演示 2 · 统计派翻译：一句话丢给它，然后看网` },
  { t: `code`, lang: `python`, code: `from textblob import TextBlob\nblob = TextBlob("It is a truth universally acknowledged, that a single man in "\n                "possession of a good fortune, must be in want of a wife!")\nprint(blob.detect_language())\nprint(blob.translate(to="fr"))` },
  { t: `p`, text: `翻出来是 C'est une vérité universellement reconnue... 比 1932 年那版人类译本更贴原文（那版替作者补了一大段邻里盘算女儿的话，属于译者加戏）。但有个必须写清的事实：TextBlob 自己没有翻译模型，它调的是 Google 翻译，断网就跑不出来。你的翻译能力其实是别人的一个在线服务——课程里能跑，不代表搬到生产上还能这么算账。` },
  { t: `h2`, text: `演示 3 · 两个数各管什么，反讽怎么把它们搅坏` },
  { t: `code`, lang: `python`, code: `q1 = "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife."\nq2 = "Darcy, as well as Elizabeth, really loved them; and they were both ever sensible of the warmest gratitude."\nfor q in (q1, q2):\n    s = TextBlob(q).sentiment\n    print(round(s.polarity, 3), round(s.subjectivity, 3))     # 0.209 0.271 / 0.7 0.8` },
  { t: `code`, lang: `python`, code: `sarcastic = "Great, that was a wonderful waste of time, I'm glad we are lost on this dark road"\nprint(TextBlob(sarcastic).sentiment.polarity)\n# great / wonderful / glad 记正，waste / lost / dark 记负 → 分数被对冲到 0 附近` },
  { t: `p`, text: `polarity 从 -1 到 1，是正是负；subjectivity 从 0 到 1，0 最客观。第二句 loved、warmest、gratitude 全带情绪，两个数一起往上；第一句讲人人皆知的真理，事实味重。可第二段是明的负面话，词典看到的是三个正面词加三个负面词互相抵消，结果落在 0 附近甚至偏正。人靠语气读懂它——同一句 Well, that film was awesome 换个语调意思就反了，而文本里没有语调。这不是实现得不好，是信息不在输入里。` },
  { t: `h2`, text: `演示 4 · 整本书扫一遍 ±1` },
  { t: `code`, lang: `python`, code: `text = open("pg1342.txt", encoding="utf-8").read()      # Project Gutenberg 纯文本\nbook = TextBlob(text)\npos, neg = [], []\nfor sent in book.sentences:\n    p = sent.sentiment.polarity\n    if p >= 0.99: pos.append(str(sent).strip())\n    elif p <= -0.99: neg.append(str(sent).strip())\nprint(len(pos), len(neg))` },
  { t: `p`, text: `扫出来要人工读回去，这一步才是结论。「绝对正面」里混着 Happy shall I be, when his stay at Netherfield is over（说话人巴不得客人走）；「绝对负面」里 Everybody is disgusted with his pride 则确实是负的。polarity 等于 1 只说明句子里有个最强的词典词，不说明这句话站在哪边。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `以为 blob.translate 是本地的：它背后是在线服务，离线、限流、合规三件事都得重算`,
    `拿假同源词做词对词翻译：money 与 monnaie 看着一对，实际一个指钱一个指零钱`,
    `把 polarity 当说话人的态度：它是词面强弱的平均，反讽、双重否定、礼貌性差评全算错`,
    `没有对照语料就上统计翻译，或语料本身是机器翻的，等于拿自己的错误当教材`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把演示 4 扫出的正负句子各十条人工分成确实是那个意思、反话、上下文缺失三类，算一个读对率`,
    `把演示 3 那句反讽改写成不带反讽的三句，记录三次 polarity，说明分数往哪边动、为什么`,
    `拿一份带星级评分的文本，把星级和 polarity 排成散点，说明哪个星级区间分歧最大`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：翻译的难点不在词而在结构，情感的难点不在词而在语气——词典法两样都碰不到，它的分数只能当粗筛。` }
];
