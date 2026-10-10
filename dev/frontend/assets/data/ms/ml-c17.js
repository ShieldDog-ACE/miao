window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["ml-c17"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把 NLP 常用那几件事按顺序串成一条链——切词、标结构、数出现、滑窗口、抽短语、还原词根、变向量、判情感，每一步都写得出代码。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `第一环是 tokenization：把连续字符切成可处理单元。难点不在切，在「单元由谁定」——英文靠空格，句号问号和撇号得单独算；中文没有空格，切错一个词后面全错。第二环是标结构：每个 token 挂一个词性，再判断哪些词互相修饰。the quick red fox jumped over the lazy brown dog 里，quick red fox jumped 和 lazy brown dog 是两段，之间没有语法关系——机器要的就是这个分段结果。` },
  { t: `p`, text: `第三环把文本变成能算的东西，两条路。一条是数：词频和 n-gram。词频最直白，the 出现 6 次就是个特征；n-gram 是为了把词序补回来——窗口定宽沿句子滑动，产出的是哪几个词连着出现，所以 not good 和 good not 不再是同一个袋。另一条是坐标：embedding，意思或语境接近的词在向量空间里挨着，toy 的邻居是 lego、playstation、console，而不是 furniture。走到这一步，词的字面形状消失了，剩下的只有距离。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#fbfbfd"/><text x="20" y="34" font-size="15" fill="#222">n-gram：一个定宽窗口沿 token 序列滑动</text><g font-size="14" fill="#333" text-anchor="middle"><rect x="20" y="56" width="60" height="30" rx="4" fill="#eef" stroke="#c9c9d6"/><text x="50" y="76">the</text><rect x="86" y="56" width="60" height="30" rx="4" fill="#eef" stroke="#c9c9d6"/><text x="116" y="76">quick</text><rect x="152" y="56" width="52" height="30" rx="4" fill="#eef" stroke="#c9c9d6"/><text x="178" y="76">red</text><rect x="210" y="56" width="46" height="30" rx="4" fill="#eef" stroke="#c9c9d6"/><text x="233" y="76">fox</text><rect x="262" y="56" width="68" height="30" rx="4" fill="#eef" stroke="#c9c9d6"/><text x="296" y="76">jumped</text><rect x="336" y="56" width="56" height="30" rx="4" fill="#eef" stroke="#c9c9d6"/><text x="364" y="76">over</text><rect x="398" y="56" width="46" height="30" rx="4" fill="#eef" stroke="#c9c9d6"/><text x="421" y="76">the</text><rect x="450" y="56" width="52" height="30" rx="4" fill="#eef" stroke="#c9c9d6"/><text x="476" y="76">lazy</text><rect x="508" y="56" width="66" height="30" rx="4" fill="#eef" stroke="#c9c9d6"/><text x="541" y="76">brown</text><rect x="580" y="56" width="46" height="30" rx="4" fill="#eef" stroke="#c9c9d6"/><text x="603" y="76">dog</text></g><g fill="none"><rect x="152" y="50" width="110" height="42" rx="6" stroke="#c0392b" stroke-width="2.5"/><text x="207" y="118" font-size="14" fill="#c0392b" text-anchor="middle">red fox jumped</text><rect x="262" y="50" width="132" height="42" rx="6" stroke="#2471a3" stroke-width="2.5"/><text x="328" y="140" font-size="14" fill="#2471a3" text-anchor="middle">jumped over the</text><rect x="450" y="50" width="176" height="42" rx="6" stroke="#1e8449" stroke-width="2.5"/><text x="538" y="162" font-size="14" fill="#1e8449" text-anchor="middle">lazy brown dog</text></g><text x="20" y="200" font-size="14" fill="#333">窗口 = 3 → 一句 10 个 token 产出 8 个三元组，词序被写进特征里</text><text x="20" y="228" font-size="14" fill="#666">换成词袋（只看有哪些词）→ 三条塌成一条，not 的位置也一起丢了</text><text x="20" y="268" font-size="14" fill="#333">往下还有：抽名词短语 → 情感打分（polarity -1 到 1，subjectivity 0 到 1）</text></svg>`, caption: `同一个句子在 n-gram 和词袋下丢掉的不是长度，是词序` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `从一句闲聊里抓出可追问的对象：从 lovely cats 里摘出 cats，再塞回回答`,
    `按情感极性给反馈自动分档，人只看边界样本`,
    `用词向量做检索：搜 toy 也能召回 lego、console，不靠字面匹配`
  ] },
  { t: `h2`, text: `演示 1 · 切词与词性，链子的前两环` },
  { t: `code`, lang: `python`, code: `from textblob import TextBlob\nb = TextBlob("The quick red fox jumped over the lazy brown dogs")\nprint(b.words)\nprint(b.tags)\nprint([w for w, t in b.tags if t.startswith("NN")])\nprint(b.words[9].singular_forms)      # inflection：dogs 的单数` },
  { t: `p`, text: `tags 是（词, 词性）的序列：DT 冠词、JJ 形容词、NN 名词、VBD 过去式。最后一行是 inflection，把词形折回单数；它和 lemmatization 是一对——flew 的 lemma 是 fly。这一步不做，词频统计会把一个动词拆成三个特征，每个都稀。` },
  { t: `h2`, text: `演示 2 · 词频与 n-gram：把词序留下` },
  { t: `code`, lang: `python`, code: `import re\nfrom collections import Counter\nverse = "What the moral who rides may read when the night is thick and the tracks are blind"\nwords = re.findall(r"[a-z]+", verse.lower())\nprint(Counter(words).most_common(3))          # the 出现次数最多\nbigrams = list(zip(words, words[1:]))\nprint(Counter(bigrams).most_common(3))\ntrigrams = [tuple(words[i:i+3]) for i in range(len(words) - 2)]\nprint(len(trigrams), trigrams[:4])` },
  { t: `p`, text: `第一行那个正则顺手把标点全丢了，这就是切词的第一个抉择：大小写要不要留、标点要不要留。n-gram 的条数是长度减 n 加 1：窗口每滑一格产一条，10 个 token、n 取 3 只有 8 条，两头各缺一块，这是它天然的成本。` },
  { t: `h2`, text: `演示 3 · 抽名词短语 + 情感分档，升级上一课的 Marvin` },
  { t: `code`, lang: `python`, code: `from textblob import TextBlob\nfrom textblob.np_extractors import ConllExtractor\n\nex = ConllExtractor()\nb = TextBlob(input("> "), np_extractor=ex)\npol = b.polarity\ntier = ("那听起来挺糟。 " if pol <= -0.5 else "那不太妙。 " if pol <= 0 else\n        "那还算积极。 " if pol <= 0.5 else "太好了。 ")\nnps = list(b.noun_phrases)\nprint(tier + ("关于" + str(nps[-1]) + "，能多讲讲吗？" if nps else "能多讲讲吗？"))` },
  { t: `p`, text: `效果是 I went for a walk and saw a lovely cat 会被接成「关于 lovely cats，能多讲讲吗」。两处要留意。一，ConllExtractor 不是规则：它是拿 ConLL-2000 那次以名词短语切分为赛题的语料训出来的模型（训练用华尔街日报约 21 万 token）——抽短语这一环里已经嵌了一个学出来的模型。二，四个阈值是人工定的，polarity 来自词典计数，所以这条链是词典打分加人工阈值，不是训练出的分类器。` },
  { t: `h2`, text: `演示 4 · 词变成坐标之后` },
  { t: `code`, lang: `python`, code: `import numpy as np\nnames = np.array(list(model))                 # model: 词 -> 向量 的字典\nM = np.array([model[n] for n in names], dtype=float)\nM = M / np.linalg.norm(M, axis=1, keepdims=True)\ndef nearest(word, k=5):\n    if word not in model:\n        return []                             # 词表外：无能为力\n    v = model[word] / np.linalg.norm(model[word])\n    return list(names[(M @ v).argsort()[::-1][1:k+1]])\nprint(nearest("toy"))` },
  { t: `p`, text: `归一化之后点积就是余弦相似度，排序取前 k 个就是语义最近的词，toy 会带回 lego、playstation、console 这一堆。代价写在倒数第四行：词不在词表里就返回空——预训练向量对没见过的词、拼错的词、新词毫无办法。这是「表示」这一环真正的边界。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `切词时把标点全清掉，not good 里的否定信息没了，情感直接反号`,
    `按空格切中文，一行代码切出一个整句 token`,
    `n 取得越大信息越多是错觉：特征表膨胀、每格几乎只出现一次，学到的是句子本身而不是规律`,
    `不做 lemmatization 就统计词频，一个动词的三种形态变成三个特征`,
    `把抽出来的名词短语当「主体」：抽取器只看句法，它分不清说话人是在夸还是骂那个对象`,
    `用预训练向量不查词表命中率：一半词落在表外，剩下的相似度是瞎报`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `拿演示 2 那段诗分别用 n 等于 1、2、3 各跑一遍，写下每种 n 产出多少条，指出哪一条最能说明词序`,
    `用演示 3 跑五句话，其中两句故意写反讽，记下 polarity 并解释为什么分数站在错的一边`,
    `给演示 3 加一步：先做 lemma 再抽名词短语，比较加了之后 nps 的数量和内容有什么变化`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：这几件事不是并列的名词，是一条有先后的链——切错单元、丢掉词序、没还原词根，后面任何任务分数都是虚的。` }
];
