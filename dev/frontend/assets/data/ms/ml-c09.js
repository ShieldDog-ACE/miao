window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["ml-c09"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把模型从 notebook 搬进网页。重点不在 Flask 的路由怎么写，而在中间那三样交付物：序列化、接口、换文件的时机。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `前两课的模型活在一个 .ipynb 里：进程一关就没了，能问它的只有你一个人。要做成别人也能用的一页表单，就得把「训练」和「使用」拆到两个地方——训练留在 notebook，使用搬进一个网页进程。这一拆，工程问题就冒出来了：拟合好的东西怎么交出去？交出去以后，凭什么保证对面用对了？` },
  { t: `p`, text: `中间有三个台阶。一是序列化：把学到的系数、截距和对象结构写进一个文件，Python 原生就带 pickle，dump 写成 .pkl、load 读回一个能直接 predict 的对象。二是接口：模型对象只知道自己吃过几列、按什么顺序，网页必须按同一顺序把数递回来，还得知道 3 代表英国。三是换文件的时机：.pkl 一落地就冻住了，数据里多了国家、时长口径改了，分数会悄悄往下掉，那时要重训再替换，而不是在网页里现场学。` },
  { t: `p`, text: `这一跑的 accuracy 约 95%，原文先泼了冷水：Country 和 Latitude/Longitude 本来就高度相关，坐标几乎把国家写出来了，模型做的事你查张地图也能做到。它值钱的是那条链跑通——80,000 条 UFO 目击记录里挑出时长 1 到 60 秒的一段，压成数、训好、落盘，再由一个 Python 网页接住回答。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#fbfbfd"/><defs><marker id="a9" markerWidth="10" markerHeight="10" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#6b6b7b"/></marker></defs><rect x="12" y="40" width="150" height="96" rx="10" fill="#ffffff" stroke="#2471a3" stroke-width="1.8"/><text x="87" y="66" font-size="15" fill="#222" text-anchor="middle">notebook</text><text x="87" y="90" font-size="14" fill="#666" text-anchor="middle">清洗 80000 行</text><text x="87" y="112" font-size="14" fill="#666" text-anchor="middle">编码 + fit</text><text x="87" y="152" font-size="14" fill="#2471a3" text-anchor="middle">进程一关就没了</text><g fill="#ffffff" stroke="#c0392b" stroke-width="1.8"><rect x="198" y="24" width="132" height="46" rx="8"/><rect x="198" y="82" width="132" height="46" rx="8"/><rect x="198" y="140" width="132" height="46" rx="8"/></g><g font-size="14" fill="#222" text-anchor="middle"><text x="264" y="46">ufo-model.pkl</text><text x="264" y="64" font-size="14" fill="#666">系数与结构</text><text x="264" y="104">3 列的顺序</text><text x="264" y="122" font-size="14" fill="#666">秒 纬度 经度</text><text x="264" y="162">编码表</text><text x="264" y="180" font-size="14" fill="#666">3 是英国</text></g><rect x="470" y="40" width="158" height="146" rx="10" fill="#ffffff" stroke="#2471a3" stroke-width="1.8"/><text x="549" y="66" font-size="15" fill="#222" text-anchor="middle">Flask 网页</text><text x="549" y="90" font-size="14" fill="#666" text-anchor="middle">表单收三个数</text><text x="549" y="112" font-size="14" fill="#666" text-anchor="middle">POST /predict</text><text x="549" y="134" font-size="14" fill="#666" text-anchor="middle">回渲染模板</text><text x="549" y="204" font-size="14" fill="#2471a3" text-anchor="middle">只会调用，不会训练</text><g stroke="#6b6b7b" stroke-width="2" fill="none"><line x1="162" y1="88" x2="196" y2="47" marker-end="url(#a9)"/><line x1="330" y1="47" x2="468" y2="86" marker-end="url(#a9)"/><line x1="330" y1="105" x2="468" y2="105" marker-end="url(#a9)"/><line x1="330" y1="163" x2="468" y2="124" marker-end="url(#a9)"/></g><text x="320" y="228" font-size="14" fill="#c0392b" text-anchor="middle">只交 .pkl、不交编码表：3 会被译成错的国家</text><text x="320" y="256" font-size="14" fill="#333" text-anchor="middle">pkl 是死文件：分布漂了就重训换文件，别在网页里现学</text><text x="320" y="284" font-size="14" fill="#666" text-anchor="middle">中间那三张卡片合起来，才叫把模型交出去了</text></svg>`, caption: `左边训练、右边使用，中间站着三样必须一起交付的东西` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `让不开 Python 的人也能问到模型：一个表单、一个按钮`,
    `本地起个端口就能演示，不必搭服务器；requirements.txt 一给，环境照样复现`,
    `换中立格式能跨语言，把推断搬进浏览器；做成云端 API 就把模型和网页拆开`,
    `同一套骨架换个 .pkl 就是新产品：训练侧迭代，使用侧一行不改`
  ] },
  { t: `h2`, text: `演示 1 · notebook 那半边` },
  { t: `code`, lang: `python`, code: `ufos = pd.read_csv("./data/ufos.csv")\nufos = pd.DataFrame({"Seconds": ufos["duration (seconds)"], "Country": ufos["country"],\n                     "Latitude": ufos["latitude"], "Longitude": ufos["longitude"]})\nufos.dropna(inplace=True)\nufos = ufos[(ufos["Seconds"] >= 1) & (ufos["Seconds"] <= 60)]\nufos["Country"] = LabelEncoder().fit_transform(ufos["Country"])   # 按字母序压成 0..4\n\nX = ufos[["Seconds", "Latitude", "Longitude"]]\ny = ufos["Country"]\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=0)\nmodel = LogisticRegression().fit(X_tr, y_tr)\nprint(model.score(X_te, y_te))` },
  { t: `p`, text: `LabelEncoder 有个该记住的脾气：它按字母序编号，Australia 0、Canada 1、Germany 2、UK 3、US 4。这张表不在模型系数里，只在这个编码器对象里——上一课南瓜的 Color 也是同一件事。训练本身和上一课没差别，三个特征喂逻辑回归，取回一个能 predict 的对象。` },
  { t: `h2`, text: `演示 2 · 交接：落盘与回读` },
  { t: `code`, lang: `python`, code: `import pickle\n\npickle.dump(model, open("ufo-model.pkl", "wb"))\n\nmodel = pickle.load(open("ufo-model.pkl", "rb"))\nprint(model.predict([[50, 44, -12]]))      # -> [3] 英国\nprint(model.classes_)                      # 那张编码表跟着对象一起活着` },
  { t: `p`, text: `三行就交完了，但注意 predict 吃的是二维数组，内层顺序必须和当初 X 的列顺序一致，多一列少一列 sklearn 只会抱怨形状对不上。classes_ 是模型自带的底牌：谁要是把 countries 列表手抄到网页里又抄错顺序，模型照样返回一个漂亮的错答案，整条链上不会有任何报错。` },
  { t: `h2`, text: `演示 3 · 网页那半边：/predict 这条路由` },
  { t: `code`, lang: `python`, code: `from flask import Flask, request, render_template\nimport pickle\n\napp = Flask(__name__)\nmodel = pickle.load(open("./ufo-model.pkl", "rb"))\n\n@app.route("/predict", methods=["POST"])\ndef predict():\n    feats = [int(x) for x in request.form.values()]\n    out = model.predict([np.array(feats)])[0]\n    countries = ["Australia", "Canada", "Germany", "UK", "US"]\n    return render_template("index.html", prediction_text=countries[out])` },
  { t: `p`, text: `Flask 被它的作者叫「微框架」：只给路由、请求对象和模板引擎，其余自己拿。目录是死的——static/css 放样式、templates 放 index.html、根上 app.py 与 requirements.txt 列四行依赖，pip install -r 一把装齐。模板里那两个花括号是插槽：prediction_text 由这条路由算出来再塞回同一个页面。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `.pkl 绑 Python 和 sklearn 版本，换环境加载会警告甚至错位；跨语言得换中立格式`,
    `pickle 反序列化等于执行任意代码，来路不明的 .pkl 不要 load`,
    `把纬度填成 53.2 就崩：演示 3 那句 int 不吃小数字符串，网页侧的强转要跟训练口径核对`,
    `交付只给 .pkl 不给编码表和列顺序，界面照样出字，出的全是错字`,
    `debug=True 带上线：热重载很爽，但它把异常堆栈直接印在页面上`,
    `想省事就在网页请求里现场训练：延迟和内存全归网页进程，数据一多这条路就死`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把演示 3 里手抄的 countries 换成从 model.classes_ 生成，说出为什么手抄早晚会错`,
    `表单纬度填 53.2 跑一次记下报错，改对之后再跑，指出这个 bug 出在交付的哪一环`,
    `只搬 .pkl 到另一个 sklearn 版本的环境里 load，观察它报什么，写下你打算怎么锁版本`,
    `原文留了道挑战题：把训练搬进一条 /train 路由。给出两条支持、两条反对，再说你实际会怎么切`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：notebook 交出去的是参数，网页要的是一套约定——系数、列顺序、编码表、单位四样齐全，模型才算真的送到了别人手里。` }
];
