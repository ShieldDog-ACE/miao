window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["genai-c05"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把提示词拆成指令、材料、约束三块，看清它们拼成什么进了模型，以及怎么用例子代替说明。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `你发出的是几个字段，模型看到的是一条序列。系统消息、你写的指令、贴进去的材料、之前几轮的问答，全部被分词器首尾相接连成一串整数，没有哪个位置标着「这段是给我的规则，那段是给我处理的内容」。所谓提示词工程，就是在这一条序列里安排先后与层次，让模型读到你想要的那一层意思。` },
  { t: `p`, text: `而且这条序列会被第 2 课说的那个机制一路续写到底：它只关心「接着往下最像什么」，不关心这句话是谁说的。所以出现在序列里的任何东西都会成为依据——包括你打算让它处理的那段材料里混进来的话。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#f4f6fa"/><text x="320" y="26" font-size="17" fill="#243048" text-anchor="middle">四个字段拼成一条输入序列</text><rect x="24" y="48" width="150" height="40" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="99" y="73" font-size="14" fill="#243048" text-anchor="middle">系统消息 · 角色</text><rect x="24" y="94" width="150" height="40" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="99" y="119" font-size="14" fill="#243048" text-anchor="middle">示例一 问 / 答</text><rect x="24" y="140" width="150" height="40" rx="6" fill="#d5f0e8" stroke="#12a58a"/><text x="99" y="165" font-size="14" fill="#243048" text-anchor="middle">指令 · 要做什么</text><rect x="24" y="186" width="150" height="40" rx="6" fill="#fbe3c6" stroke="#e0821f"/><text x="99" y="211" font-size="14" fill="#243048" text-anchor="middle">材料 · 待处理文本</text><path d="M174 68 C210 68 210 128 240 128" stroke="#8b96ad" stroke-width="2" fill="none"/><path d="M174 114 C210 114 210 138 240 138" stroke="#8b96ad" stroke-width="2" fill="none"/><path d="M174 160 C210 160 210 148 240 148" stroke="#8b96ad" stroke-width="2" fill="none"/><path d="M174 206 C210 206 210 158 240 158" stroke="#8b96ad" stroke-width="2" fill="none"/><rect x="240" y="106" width="300" height="70" rx="8" fill="#ffffff" stroke="#5b7cfa" stroke-width="2"/><text x="390" y="130" font-size="15" fill="#243048" text-anchor="middle">一条连续序列</text><text x="390" y="152" font-size="14" fill="#6a748c" text-anchor="middle">角色 示例 指令 材料 首尾相接</text><path d="M540 141 L574 141" stroke="#8b96ad" stroke-width="2"/><rect x="486" y="200" width="130" height="52" rx="8" fill="#eef1f7" stroke="#8b96ad" stroke-width="2"/><text x="551" y="224" font-size="14" fill="#243048" text-anchor="middle">往下续写</text><text x="551" y="242" font-size="14" fill="#6a748c" text-anchor="middle">不区分谁说的</text><path d="M540 176 L540 200" stroke="#8b96ad" stroke-width="2" fill="none"/><text x="28" y="262" font-size="14" fill="#6a748c">长度上限掐的是这条序列的总片段数，材料和示例都算。</text><text x="28" y="282" font-size="14" fill="#6a748c">顺序改动 = 模型先读到什么 = 它拿什么去解释后面的内容。</text></svg>`, caption: `左边是你写的分区，右边是模型真正读到的东西` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `用两三个例子把任务说明白，省掉一整段描述规则的提示`,
    `把输出格式钉死：给出半截结构，它按你的编号往下写`,
    `同一套模板换不同材料批量跑，结果之间可比`,
    `在能力弱一档的小模型上做到大模型八成效果，只靠提示写得好`
  ] },
  { t: `h2`, text: `演示 1 · 三块分开写` },
  { t: `code`, lang: `python`, code: `instruction = "把下面这段课堂笔记整理成家长能看懂的三条要点"\nprimary = note\nsecondary = "用陈述句，每条不超过 30 字，不要出现教学术语"\nprompt = instruction + "\\n" + primary + "\\n" + secondary\nmessages = [{"role": "system", "content": "你是小学班主任的助手"},\n            {"role": "user", "content": prompt}]` },
  { t: `p`, text: `指令说动作，材料是给动作处理的东西，约束影响形态。三块混在一句话里，模型就得自己猜哪部分是任务、哪部分是数据——猜错的代价是它把你的材料当成指令执行了。` },
  { t: `h2`, text: `演示 2 · 用例子替你把任务说清` },
  { t: `code`, lang: `python`, code: `shots = [("今天数学作业是练习册第 12 页", "数学：练习册第 12 页"),\n         ("明天带水彩和画笔", "美术：带水彩和画笔")]\nexamples = "\\n".join("笔记：" + a + " 要点：" + b for a, b in shots)\nmessages.append({"role": "user",\n    "content": examples + "\\n笔记：后天单元测验，范围第一到三章"})` },
  { t: `p`, text: `从第二条起，没人再写过「把笔记转成某科：某件事」这种说明，任务是从例子的对应关系里推出来的。这就是零样本、一样例、多样本的差别：例子越多，推断越准，但每个例子都在占上下文长度、也在计费。` },
  { t: `h2`, text: `演示 3 · 用开头当线索` },
  { t: `code`, lang: `python`, code: `messages[-1]["content"] += "\\n要点：1."` },
  { t: `p`, text: `演示只有一行：往最后那条消息的尾巴上追加「要点：1.」，没有一个字说明格式，只把第一格的开头写好。模型只会续写，你把它摆在尾巴上，它最像话的下一步就是把 2、3 补完。这比事后用正则清洗输出便宜得多——格式越具体，越该写在提示里而不是写在代码里。` },
  { t: `h2`, text: `演示 4 · 把提示变成函数` },
  { t: `code`, lang: `python`, code: `def build(note, reader="家长", cap=30):\n    return ("把下面这段课堂笔记整理成" + reader + "能看懂的要点，每条不超过 "\n            + str(cap) + " 字。\\n笔记：" + note)\n\nfor reader in ["家长", "学生本人", "教研组"]:\n    print(reader, build(note, reader)[:40])` },
  { t: `p`, text: `结构不变、参数可变，这样同一份笔记换三种读者跑出来的结果才叫对比。手改提示再跑一次，你比的是记忆，不是写法。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `把提示当搜索框写，堆关键词：它只会照着最不完整的理解往下补`,
    `示例的格式和你最后要的格式不一致：模型跟示例，不跟你的说明`,
    `以为改系统消息无足轻重：它对输出质量的影响和用户那句一样大`,
    `换个模型沿用同一份提示：分词不同，同一段文字在两个模型那里不是同一个输入`,
    `材料越塞越多：每条都在稀释前面内容的分量，还挤掉回答的空间`,
    `跑一次就定结论：温度不为 0 时，那次差异可能跟提示完全无关`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `同一条请求写成零样本、一样例、三样例三份，各跑五次，比较十次结果里最不像话的那条`,
    `给一份提示依次加上人称、长度、句式三种约束，记下哪一种真的改变了输出形态`,
    `把最常用的那条提示改成一个带三个参数的函数，用五份不同材料跑一遍并贴出差异`,
    `故意让示例末尾的格式和你要的格式不同，验证模型跟了哪一个`,
    `把材料换成一段包含「忽略前面的要求」字样的文本，观察发生了什么，再想办法隔开`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：提示词不是对模型说话，是在安排它眼前那条序列——你决定它先读到什么，它就照着那个往下写。` }
];
