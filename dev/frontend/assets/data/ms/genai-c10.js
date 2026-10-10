window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["genai-c10"] = [
  { t: `tip`, color: `blue`, text: `本课目标：明白图像模型和文本模型不是一套机制——它整张图一步步修正，所以可控性来自说死、遮罩和请求前的边界。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `第 2 课那套「一次拼一块」属于文本模型。图像模型走的是另一条路：从一张纯噪声开始，每一轮把整张图朝「更符合这句描述」的方向修正一点，若干轮之后噪声退干净，图就出来了。区别很实在——文本是累积的，写过的字要留着；图像是整体重画的，每一轮都有完整的画面，只是还不清晰。` },
  { t: `p`, text: `提示词是每一轮修正时的条件。所以它的效果不像给文本下指令那样可以追加：你写「再明亮一点」，它是从零生成一张新的，不是在旧图上改。要在旧图上改，得走另一个入口——把原图、一张标出可改区域的遮罩、以及一句改成什么，三样一起发。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#f7f6f9"/><text x="320" y="26" font-size="17" fill="#26304a" text-anchor="middle">一句提示作为条件，注入每一轮整图修正</text><rect x="30" y="52" width="110" height="80" rx="6" fill="#c9cede" stroke="#8b96ad"/><rect x="38" y="60" width="10" height="10" fill="#9aa3bd"/><rect x="58" y="76" width="10" height="10" fill="#e6e8f0"/><rect x="80" y="62" width="10" height="10" fill="#9aa3bd"/><rect x="102" y="88" width="10" height="10" fill="#e6e8f0"/><rect x="70" y="104" width="10" height="10" fill="#9aa3bd"/><rect x="118" y="66" width="10" height="10" fill="#e6e8f0"/><rect x="46" y="112" width="10" height="10" fill="#9aa3bd"/><text x="85" y="150" font-size="14" fill="#26304a" text-anchor="middle">纯噪声</text><path d="M140 92 L168 92" stroke="#8b96ad" stroke-width="2"/><rect x="168" y="52" width="110" height="80" rx="6" fill="#d9d5e6" stroke="#8b96ad"/><text x="223" y="150" font-size="14" fill="#26304a" text-anchor="middle">轮廓浮出</text><path d="M278 92 L306 92" stroke="#8b96ad" stroke-width="2"/><rect x="306" y="52" width="110" height="80" rx="6" fill="#cfe0ea" stroke="#5b7cfa" stroke-width="2"/><text x="361" y="150" font-size="14" fill="#26304a" text-anchor="middle">颜色与位置</text><path d="M416 92 L444 92" stroke="#8b96ad" stroke-width="2"/><rect x="444" y="52" width="110" height="80" rx="6" fill="#f0e6cf" stroke="#12a58a" stroke-width="2"/><text x="499" y="150" font-size="14" fill="#26304a" text-anchor="middle">细节收干净</text><rect x="180" y="176" width="290" height="40" rx="6" fill="#dfe8ff" stroke="#5b7cfa" stroke-width="2"/><text x="325" y="192" font-size="14" fill="#26304a" text-anchor="middle">提示词 · 牧场、黄昏、一只兔子</text><text x="325" y="210" font-size="14" fill="#6a748c" text-anchor="middle">同一份条件，每一轮都给</text><path d="M230 176 L85 132" stroke="#5b7cfa" stroke-width="1.5" fill="none" stroke-dasharray="5 4"/><path d="M280 176 L223 132" stroke="#5b7cfa" stroke-width="1.5" fill="none" stroke-dasharray="5 4"/><path d="M370 176 L361 132" stroke="#5b7cfa" stroke-width="1.5" fill="none" stroke-dasharray="5 4"/><path d="M440 176 L499 132" stroke="#5b7cfa" stroke-width="1.5" fill="none" stroke-dasharray="5 4"/><text x="30" y="248" font-size="14" fill="#6a748c">文本模型：一块一块累积，写下的要留着。</text><text x="30" y="270" font-size="14" fill="#6a748c">图像模型：整张反复修正，所以「再改一点」得靠遮罩，不是靠第二句提示。</text></svg>`, caption: `一句提示进去，四张候选出来，每张都是从头修正过` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `给一份材料配十张风格可控的插图，不用等摄影也不用买版权图`,
    `把同一张图里那块杂物换掉，其余部分一位像素都不动`,
    `把一句抽象概念变成画面：给低年级讲「平衡」时画一个跷跷板场景`,
    `批量出概念稿给人挑——它快在人身上：一次出四张比画四张草图省时间`
  ] },
  { t: `h2`, text: `演示 1 · 生成并落盘` },
  { t: `code`, lang: `python`, code: `r = client.images.generate(model=DEPLOY, prompt="黄昏的牧场，一只兔子站在木栅栏旁",\n                           size="1024x1024", n=1)\ndata = base64.b64decode(r.data[0].b64_json)\nopen("out.png", "wb").write(data)` },
  { t: `p`, text: `这一族模型把图当 base64 字符串返回，要解码再写文件，没有网址可下；早一些的型号给的是几小时就失效的临时链接，那种链接存进库等于埋一颗空图。size 只有固定几档，比例不是自由值——想要 16:9 就选一档再裁。` },
  { t: `h2`, text: `演示 2 · 要多样还是要复现` },
  { t: `code`, lang: `python`, code: `for i in range(4):\n    r = client.images.generate(model=DEPLOY, n=1, size="1024x1024",\n        prompt="写着开学快乐两个字的插图，画面里有书本和铅笔")\n    open("v" + str(i) + ".png", "wb").write(base64.b64decode(r.data[0].b64_json))` },
  { t: `p`, text: `图像接口没有温度这个旋钮，第 2 课那套调法在这里没有对应物：同一句提示四次就是四张图。要多选就重复调用，要接近可重复，只能把提示写到几乎没有余地——色调、视角、物体数量、方位全指定。即便如此，画面里的汉字仍是质量最差那部分，字经常是错的。` },
  { t: `h2`, text: `演示 3 · 遮罩编辑，只改圈出来的那块` },
  { t: `code`, lang: `python`, code: `r = client.images.edit(model=DEPLOY,\n        image=open("lounge.png", "rb"), mask=open("mask.png", "rb"),\n        prompt="遮罩区换成一只粉色火烈鸟站在池水里")\nopen("edited.png", "wb").write(base64.b64decode(r.data[0].b64_json))` },
  { t: `p`, text: `遮罩是一张黑白图：白的那块允许改，黑的保持原样。它把「改哪儿」和「改成什么」拆成两个输入，于是换背景、去杂物、局部替换这三件事比重新生成整张稳——原图的构图与光线不会跟着漂走。` },
  { t: `h2`, text: `演示 4 · 边界拼在用户那句之前` },
  { t: `code`, lang: `python`, code: `META = ("你是小学教材插图助手。画面必须儿童可用：色彩明亮、不含人物特写，\"\n        \"不出现武器、血液、裸露、商标。构图横向。\\n")\nprompt = META + "请画：" + user_text\nr = client.images.generate(model=DEPLOY, prompt=prompt, size="1536x1024", n=1)` },
  { t: `p`, text: `这是第 4 课那四层里元提示那一层的图像版。它是软约束——只是让模型每次都读到同一份规矩，挡不住绕。硬的那道还在请求之前：用户输入先过一次判断，命中就不发这个请求；再加上服务商那侧的内容过滤，两层叠起来才叫纵深。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `把临时链接当素材入库：到期之后页面上一片空白`,
    `指望画面里的文字写对：要字就后期排，别让它画`,
    `要求精确数量与左右关系：三盏灯两只猫经常变成四盏`,
    `拿生成图充当真实照片：产品、地点、人物这类事实性内容，这是责任问题`,
    `只做提示层防护，没有前置判断和内容过滤`,
    `不记提示词与参数也不留中间图：四张里挑了一张，之后再也做不出同一风格`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `同一句提示生成四张，写清哪部分最稳、哪部分每次变，再把提示补到能重复出相似图`,
    `用一句含「三个红灯笼和两只白猫」的提示跑五次，统计实际画出来的数量`,
    `做一张遮罩只换水池那一块，验证黑区是否一位像素没动，并说清为什么比重新生成更稳`,
    `把元提示整段删掉，用越界输入试一次，记下你看到什么，再把前置判断加回去`,
    `给一段旁白配四张连续图，想办法让画风一致，写下你记录了哪些东西来保证一致性`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：图像模型不是把描述画出来，是把噪声一步步修正到符合描述——想控制它，就得把话说死、把遮罩划清、把边界放在请求之前。` }
];
