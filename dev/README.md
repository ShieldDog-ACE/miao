# 喵站 · 开发版说明（纯静态 · 首屏按需加载）

这一版**没有后端，也不需要起服务**：`frontend/` 就是全部产物。
双击 `frontend/index.html` 能开，扔给任何静态托管也能开
（GitHub / Gitee / Cloudflare Pages、对象存储、`nginx:1.27-alpine` 镜像任选）。

正文、题库、音频都是静态文件；代码运行、判分、成绩、收藏、学习进度全在浏览器里。

**首屏只拉 5 份脚本**：176 KB（gzip 57 KB）—— `theme-boot.js`、`site.js`、`index.js`、`data.js`、`app.js`。

正文是**两层按需**（第十一轮起）：
点进一门课，只注入那门课的**骨架 `boot`**（装配层 + 占位/骨架，3–63 KB）——详情页的章节目录靠 `index.js`
里的章号与标题，一块正文都不为它来；点开哪一章，才拉**那一章的分片**（`chunks` 算出来的那一份，
Python ≤43 KB、微软逐课 ≤12 KB、C++ ≤67 KB）；这一章落页后读者没别的事，`data.js` 才在空闲时
按「离当前章就近」一片一片补齐同门其余分片，读者一动就立刻收手。没点开的课一个字节都不下载。
考场脚本与题库要**点进考场才注入**（Python 那套连沙箱四份一起），进考场同样不为考试拖来整门课正文。
这套账由 `tests/ui-e2e.js` 的 §7.9 那 12 条断言盯着（骨架一片都不来 / 打开一章只多那一片 /
补齐是渐进且就近的 / 回首页就停 / 占位稿只在该它出场时拉 / 考场不拉正文）。

## 目录

```
dev/
├── frontend/                 ← 站点本体（发布就发这个目录）
│   ├── index.html            ← 只有那 5 份脚本；正文一律不在这里列
│   └── assets/
│       ├── css/style.css
│       ├── js/
│       │   ├── data.js       ← 本地数据层：按需注入脚本 + 同名同形的本地版 MIAO_API + file:// 地址换算
│       │   ├── app.js        ← 路由与视图（首页/分类/详情/阅读/搜索/考试入口/页脚）
│       │   ├── py-engine.js  ← Python 词法 + 语法（AST）            ┐
│       │   ├── py-runtime.js ← 对象模型、执行、轨迹、异常、虚拟文件系统 │ 进 Python 考场才拉
│       │   ├── py-builtin.js ← 内置函数与类型方法                    │
│       │   ├── py-stdlib.js  ← sys/io/json/os/pathlib/random/math… + run() ┘
│       │   ├── exam-grade.js ← 代码卷判分器：检查项加权 + 轨迹判定（浏览器与 Node 共用）
│       │   ├── exam-ui.js    ← VS Code 风格考场（题面就是文件顶部那几行 # 注释，终端在屏幕正下方）
│       │   ├── exam-paper.js ← 笔试判分引擎（选择/多选/填空/补代码/写输出/排序），零 DOM
│       │   └── exam-en.js    ← 英语出题与判分：字母 / 音标 / 单词三种池子
│       ├── data/
│       │   ├── site.js       ← 登记清单：分类、每门课的骨架 boot 与正文 files、装配函数名、考场用哪套引擎、公告、页脚邮箱
│       │   ├── index.js      ← 【生成物】首屏目录：课程元信息 + 每章标题 + 排考情况 + boot/chunks（这一章的正文在哪个文件）
│       │   ├── py-data.js + py/*.js         ← Python 48 章（p1…p9 新稿 + 可重入装配层；legacy 死稿已删）
│       │   ├── en-data.js                   ← 26 字母 / 48 音标 / 发音入门三章
│       │   ├── enwords-data.js              ← 【生成物】英语入门：200 词 + 21 章
│       │   ├── ms-data.js + ms/*.js + ms-bodies.js ← 微软 MIT 四门 95 课（逐课一个文件）
│       │   ├── py-exam-data.js + exam-parts/*.js    ← Python 45 场考卷
│       │   ├── en-exam-data.js              ← 字母音标卷 3 场的题量与分值
│       │   └── enword-exam-data.js          ← 【生成物】英语入门 21 场考卷的规格
│       ├── audio/letters|phonemes/          ← 74 个字母与音标 mp3
│       ├── audio/words/                     ← 200 个单词读音 mp3（IndexTTS-2.5 生成，逐条 ASR 复核）
│       └── img/covers/                      ← 每门课一张代码画的 16:9 SVG 封面
├── tests/
│   ├── run.sh               ← 唯一的回归入口（下面六套全跑）
│   ├── ui-e2e.js            ← jsdom 走读者路径：87 项，含「零 /api」与 5 条按需加载请求账
│   ├── engine-test.js       ← 正文 python 段逐段与本机 CPython 比 stdout
│   ├── exam-test.js         ← Python 45 场 + 字母音标 3 场：参考解/合法写法/宽松写法/错解
│   ├── enword-test.js       ← 英语入门 21 场：分值、题数、空卷 0 分、错一个字母必须挂、挖空不许有第二个答案
│   ├── paper-test.js        ← 笔试引擎 6 种题型
│   ├── static-server.js     ← 零依赖静态服务器（能记每一笔请求，供断言用）
│   └── oracle/              ← CPython 基准输出
└── tools/
    ├── gen-index.js         ← 【必跑】site.js + 各课数据 → assets/data/index.js
    ├── sync-body-tags.js    ← gen-index.js 的门面 + 「磁盘上有正文但没人登记」自查
    ├── enword-words.js      ← 英语入门：把词表原稿导成 JSON（TTS 与生成器共读一份）
    ├── enword-gen.js        ← 英语入门：体检 + 生成数据与考卷（先验后写，不过就不落盘）
    ├── enword-tts.py        ← 200 条单词音频：IndexTTS-2.5 合成 → 裁静音 → 归一 → MP3
    ├── enword-pick.py       ← 短词重做：一次出多个语速候选，ASR 挑听得出的那条
    ├── enword-asr-check.py  ← 全量音频离线转写对拍（SenseVoice，本地模型，不联网）
    ├── py-oracle.js         ← 生成 CPython 基准
    ├── lesson-audit.cjs     ← 正文三条闸：梗 / 交叉引用 / 未教过的构造
    ├── exam-audit.cjs       ← 考题读者可见字段同样过三条闸
    ├── check-secrets.js     ← 发布前密钥自查
    └── 写正文的规矩.md      ← 给正文写作者的硬约束
```

## 本地跑

```bash
xdg-open dev/frontend/index.html          # 什么都不用起，双击就能看
node dev/tests/static-server.js 8811      # 想走 HTTP 就起一台只会发文件的
bash dev/tests/run.sh                     # 全量回归：UI 87 项 + 三条闸 + 笔试 89 + 对拍 205 + 考卷 45/3/21
node dev/tests/enword-test.js             # 只查英语入门那 21 场
node dev/tools/gen-index.js               # 改了任何一课的标题 / 章数 / 词表之后必跑
```

## 只有「量产音频」那套工具需要环境变量（站点本身一个都不需要）

工具链在各人机器上的位置不一样，这些路径一律不写进公开仓库 —— 上一轮 `py-convert.py` / `py-gen.py`
写死绝对路径，把用户名和磁盘 UUID 一起发出去了（SPEC §15.5）：

```bash
export MIAO_TTS_APP=/路径/index-tts-code                      # IndexTTS 工程目录（含 .venv 与 checkpoints）
export MIAO_TTS_VOICE="$MIAO_TTS_APP/examples/voice_09.wav"   # 音色参考，不给就用 voice_09
export MIAO_ASR_PY=/路径/asr环境/bin/python                    # 装了 sherpa_onnx 的那份 python
export MIAO_SENSEVOICE="$HOME/.models/sense-voice"            # 本地离线 ASR 模型，默认就是这个
export MIAO_ENWORDS_JSON=/tmp/miao-tts/enwords.json           # 词表导出，生成器与 TTS 共读一份

node dev/tools/enword-words.js "$MIAO_ENWORDS_JSON"                                   # 词表 → JSON
"$MIAO_TTS_APP/.venv/bin/python" dev/tools/enword-tts.py                               # 增量出 200 条（已有的跳过）
"$MIAO_TTS_APP/.venv/bin/python" dev/tools/enword-pick.py tea                          # 一条词出多个语速，ASR 挑
"$MIAO_ASR_PY" dev/tools/enword-asr-check.py                                           # 200 条逐条转写复核
```

`file://` 这条路是支持的，但有两个已知脾气：数据文件里的 `/assets/...` 绝对路径会在运行时被
`MIAO_URL()` 换成相对路径（`data.js`），以及个别浏览器对 `file://` 的 localStorage 限制更严 ——
存不上时数据层只 `console.warn`，不会吞掉页面。

## 加一门教程 / 加一场考试

1. **正文**：写一份 `assets/data/<新课程>-data.js`，导出 `window.MIAO_XX = { tutorial: { id, title, intro, cat, diff, tags, author, cover, chapters: [{id,title,blocks}] } }`；
   在 `assets/data/site.js` 的 `tutorials` 里登记一条（`source` / `files`，可以写 `{ glob: "assets/data/xx/*.js" }`）；
   **跑 `node dev/tools/gen-index.js`**。正文若拆成多片（一课一文件或一片几章），还要两件：
   `boot` 写「点开任何一章都必拉的那几份」（装配层 + 骨架），并把装配过程挂成可反复调用的函数（`MIAO_XX_ASSEMBLE`）
   登记进 `assemble` —— 数据层每拉进一片要再拼一次；不能重入的装配层过不了 `gen-index.js` 那道闸。
   不要往 `index.html` 里加 `<script>` —— 那等于把首屏从 57 KB（gzip）打回 1.3 MB，
   UI E2E 的请求账断言会当场红。
2. **考卷**：题数据写成一份文件，在登记里填 `examFiles` 与 `engine`（`code` / `en` / `enword`，留空就是不排考）；
   排了考的课，阅读页只给「进入考试」，**考过才打完成标记**。
   - Python（`engine: "code"`）：检查项与 `ast` 特征名的契约写在 `assets/data/py-exam-data.js` 文件头，只能用里面列出的；
     权重合计 100，地板项（跑通 / 无报错）合计 ≤45，本课要点那一项 ≥45；写完跑 `node dev/tests/exam-test.js <课次>`。
   - 语言类（`engine: "en"` / `"enword"`）：题量与分值写在考卷数据里，出题与判分在 `exam-en.js`；
     英语入门那一套的形状见 `tools/enword-gen.js` 里的 `LESSON_PAPER` / `FINAL_PAPER`（两处凑 100 分，生成时当场验算）。
3. **代码必须实测能跑**：正文里每段 python 示例都会被 `engine-test.js` 拿去与本机 CPython 对拍，
   新增段落后先 `node dev/tools/py-oracle.js` 重生成基准，再跑对拍。
4. **音频必须带机器判据**：量产读音走「生成 → 离线 ASR 逐条对拍 → 只留听得出的」；
   量具判不了的（1 秒级孤立短词）单列成「要人耳过一遍」，不许混进失败，也不许当成通过。
5. 沙箱不支持的语法（`yield` / `async` / `match`）会在终端明说「超出沙箱范围」，不许静默错判 ——
   要扩展语法就改 `py-engine.js` / `py-runtime.js`，但必须保证对拍仍然全绿。

## 判分与存储的实情

- 判分口径：输出比对先折叠空白、去行首行尾、丢尾部空行（多打空格不许判错）；
  「if 走没走真分支、循环转了几圈、append 调没调」看解释器交出的**执行轨迹**。
- 唯一直接看源码的检查项是 `source-has-comment`（第 15 课「注释」用），只数引号之外的 `#`。
- 英语类默写题：忽略大小写与首尾空格，写错一个字母必挂；补全题的挖空按「一条下划线 = 一个字母」判，
  并且生成时保证 5 个字母以上的词挖完在全表里只有一个答案。
- 成绩、收藏、进度都只写 localStorage（键：`miao_exam_results` / `miao_favs` / `miao_progress`），
  换设备或清缓存会丢 —— 这是不要后端的代价，写在《SPEC.md》§15.10 与 §15.12 里，不藏着。
- 搜索只覆盖课程名、章节标题与目录带的词表（英语入门那 200 个词在目录里，所以搜 `apple` 命中课程）；
  搜正文需要把所有正文拉下来，这一条明确不做，界面上也写着。
