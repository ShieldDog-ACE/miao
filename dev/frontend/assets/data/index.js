/* 喵站 · 站点目录（首屏唯一要读的教程数据）· 由 dev/tools/gen-index.js 生成，别手改
 *
 * 这里只有：每门课的元信息、每章的 id 与标题、哪些章排了考、点开这门课要注入哪些脚本。
 * 正文一块都不在 —— 所以改任何一课的正文，都要重跑生成器，标题与章数才会同步到这里。
 * 生成时间：2026-10-09 16:57
 */
window.MIAO_INDEX = {
 "tutorials": [
  {
   "id": "python",
   "source": "MIAO_PY",
   "engine": "code",
   "mount": "",
   "title": "Python 入门",
   "intro": "45 课从零学完 Python 基础：每课都讲原理、给能跑的演示、列常见坑、留课后任务。附三节准备课讲清解释器与装环境，正文全部可直接运行验证。",
   "cat": "python",
   "diff": "入门",
   "tags": [
    "python",
    "零基础",
    "入门"
   ],
   "author": "喵站官方",
   "cover": "/assets/img/covers/python.svg",
   "thumb": "",
   "hero": "",
   "updated": "2026-10-06",
   "chaps": 48,
   "chapters": [
    {
     "id": "s01",
     "title": "第 0 课 · Python 是什么，为什么要用它"
    },
    {
     "id": "s02",
     "title": "第 0 课 · 装好 Python 解释器"
    },
    {
     "id": "s03",
     "title": "第 0 课 · 装一个代码编辑器"
    },
    {
     "id": "l01",
     "title": "第 1 课 · print：把字放到屏幕上"
    },
    {
     "id": "l02",
     "title": "第 2 课 · 单引号和双引号：文本的外衣"
    },
    {
     "id": "l03",
     "title": "第 3 课 · 把两段文本接起来：加号"
    },
    {
     "id": "l04",
     "title": "第 4 课 · 一次给多个值：逗号"
    },
    {
     "id": "l05",
     "title": "第 5 课 · sep：把默认那格空格换成你想要的"
    },
    {
     "id": "l06",
     "title": "第 6 课 · 换行：反斜杠加字母是一个字符"
    },
    {
     "id": "l07",
     "title": "第 7 课 · end：改掉 print 结尾那个换行"
    },
    {
     "id": "l08",
     "title": "第 8 课 · 一次打印多行文字：把一整块文本当一个数据来用"
    },
    {
     "id": "l09",
     "title": "第 9 课 · 三引号：把一整块文本原样摊在代码里"
    },
    {
     "id": "l10",
     "title": "第 10 课 · 变量与值：给数据起个名字"
    },
    {
     "id": "l11",
     "title": "第 11 课 · 变量和值的用法：名字可以换类型，对象不换"
    },
    {
     "id": "l12",
     "title": "第 12 课 · 变量命名规则：什么样的名字 Python 才认"
    },
    {
     "id": "l13",
     "title": "第 13 课 · 同时输出变量的值和别的文字：+、逗号、f-string 三条路"
    },
    {
     "id": "l14",
     "title": "第 14 课 · 多个变量赋值：解包就是「右边吐元素，左边接」"
    },
    {
     "id": "l15",
     "title": "第 15 课 · 注释：给人看的字，机器不看"
    },
    {
     "id": "l16",
     "title": "第 16 课 · 基本数据类型总览：类型决定这个对象会些什么"
    },
    {
     "id": "l17",
     "title": "第 17 课 · 基本数据类型（二）：整数 int 与浮点数 float"
    },
    {
     "id": "l18",
     "title": "第 18 课 · 基本数据类型（三）：布尔值 bool"
    },
    {
     "id": "l19",
     "title": "第 19 课 · 基本数据类型（四）：None，「这里刻意没有值」"
    },
    {
     "id": "l20",
     "title": "第 20 课 · 基本运算符：把计算写成人话"
    },
    {
     "id": "l21",
     "title": "第 21 课 · 数据类型检测：type() 与 isinstance()"
    },
    {
     "id": "l22",
     "title": "第 22 课 · 转换：把数据换成另一种类型"
    },
    {
     "id": "l23",
     "title": "第 23 课 · input 函数：让程序听见你说话"
    },
    {
     "id": "l24",
     "title": "第 24 课 · input 进阶：读入 → 转换 → 计算 → 输出"
    },
    {
     "id": "l25",
     "title": "第 25 课 · if 语句：让程序学会拐弯"
    },
    {
     "id": "l26",
     "title": "第 26 课 · if / elif / else：让多个分支排队"
    },
    {
     "id": "l27",
     "title": "第 27 课 · 逻辑运算符：and、or、not 与短路求值"
    },
    {
     "id": "l28",
     "title": "第 28 课 · 列表：贴了一排标签的容器"
    },
    {
     "id": "l29",
     "title": "第 29 课 · 列表的增删改查：一张能随手改的清单"
    },
    {
     "id": "l30",
     "title": "第 30 课 · 元组：一份「不许改」的清单"
    },
    {
     "id": "l31",
     "title": "第 31 课 · 字典：给数据起名字，而不是排位置"
    },
    {
     "id": "l32",
     "title": "第 32 课 · for 循环：把一批东西挨个领出来处理"
    },
    {
     "id": "l33",
     "title": "第 33 课 · while 循环：不知道要转几圈的时候用它"
    },
    {
     "id": "l34",
     "title": "第 34 课 · break / continue / pass / else：控制循环的四个开关"
    },
    {
     "id": "l35",
     "title": "第 35 课 · 字符串拼接与格式化：把值填进人话里"
    },
    {
     "id": "l36",
     "title": "第 36 课 · format 与字符串方法：把值填进话里"
    },
    {
     "id": "l37",
     "title": "第 37 课 · def 函数：把一段代码起个名字，以后随时喊它干活"
    },
    {
     "id": "l38",
     "title": "第 38 课 · 导入模块：把别人写好的工具箱搬进你的程序"
    },
    {
     "id": "l39",
     "title": "第 39 课 · 创建类：画一张图纸，批量造出互不干扰的对象"
    },
    {
     "id": "l40",
     "title": "第 40 课 · 继承类：在旧图纸上改出新图纸，而不是重画一张"
    },
    {
     "id": "l41",
     "title": "第 41 课 · 打开文件：把硬盘上的文字读进程序"
    },
    {
     "id": "l42",
     "title": "第 42 课 · 文件写入：把内存里的东西留在硬盘上"
    },
    {
     "id": "l43",
     "title": "第 43 课 · 追加文件：往同一份文件里不断加东西，不弄丢旧的"
    },
    {
     "id": "l44",
     "title": "第 44 课 · 异常处理：程序出错时，让它说人话而不是甩你一屏红字"
    },
    {
     "id": "l45",
     "title": "第 45 课 · 和操作系统打交道：路径、目录、JSON 持久化"
    }
   ],
   "examIds": [
    "l01",
    "l02",
    "l03",
    "l04",
    "l05",
    "l06",
    "l07",
    "l08",
    "l09",
    "l10",
    "l11",
    "l12",
    "l13",
    "l14",
    "l15",
    "l16",
    "l17",
    "l18",
    "l19",
    "l20",
    "l21",
    "l22",
    "l23",
    "l24",
    "l25",
    "l26",
    "l27",
    "l28",
    "l29",
    "l30",
    "l31",
    "l32",
    "l33",
    "l34",
    "l35",
    "l36",
    "l37",
    "l38",
    "l39",
    "l40",
    "l41",
    "l42",
    "l43",
    "l44",
    "l45"
   ],
   "keywords": [],
   "files": [
    "assets/data/py/legacy.js",
    "assets/data/py/p1.js",
    "assets/data/py/p2.js",
    "assets/data/py/p3.js",
    "assets/data/py/p4.js",
    "assets/data/py/p5.js",
    "assets/data/py/p6.js",
    "assets/data/py/p7.js",
    "assets/data/py/p8.js",
    "assets/data/py/p9.js",
    "assets/data/py-data.js"
   ],
   "examFiles": [
    "assets/data/py-exam-data.js",
    "assets/data/exam-parts/l04-l10.js",
    "assets/data/exam-parts/l11-l17.js",
    "assets/data/exam-parts/l18-l24.js",
    "assets/data/exam-parts/l25-l31.js",
    "assets/data/exam-parts/l32-l38.js",
    "assets/data/exam-parts/l39-l45.js"
   ],
   "bytes": 842816,
   "examBytes": 99691
  },
  {
   "id": "english",
   "source": "MIAO_EN",
   "engine": "en",
   "mount": "",
   "title": "英语发音入门：26 字母 + 48 音标",
   "intro": "26 个字母、48 个国际音标，每个都能直接听发音。配套卡片帮你把字母和音标一次记牢，打好英语拼读的地基喵～",
   "cat": "英语",
   "diff": "入门",
   "tags": [
    "英语",
    "音标",
    "发音",
    "零基础"
   ],
   "author": "喵站官方",
   "cover": "/assets/img/covers/english.svg",
   "thumb": "",
   "hero": "",
   "updated": "2026-10-04",
   "chaps": 3,
   "chapters": [
    {
     "id": "en-c01",
     "title": "第一章 · 26 个字母"
    },
    {
     "id": "en-c02",
     "title": "第二章 · 48 个国际音标"
    },
    {
     "id": "en-c03",
     "title": "第三章 · 怎么练最有效"
    }
   ],
   "examIds": [
    "en-c01",
    "en-c02",
    "en-c03"
   ],
   "keywords": [],
   "files": [
    "assets/data/en-data.js"
   ],
   "examFiles": [
    "assets/data/en-exam-data.js"
   ],
   "bytes": 13909,
   "examBytes": 2039
  },
  {
   "id": "enwords",
   "source": "MIAO_ENW",
   "engine": "enword",
   "mount": "",
   "title": "英语入门：20 课 200 个基础单词",
   "intro": "从 hello 到 have，20 个主题各 10 个真正入门要用的词。每个词都有读音、音标、词性、中文和一句常用短语，点一下就听；每课一场小考，最后一场 200 词的结课大考。",
   "cat": "英语",
   "diff": "入门",
   "tags": [
    "英语",
    "单词",
    "零基础",
    "发音"
   ],
   "author": "喵站官方",
   "cover": "/assets/img/covers/enwords.svg",
   "thumb": "",
   "hero": "",
   "updated": "2026-10-09",
   "chaps": 21,
   "chapters": [
    {
     "id": "ew-l01",
     "title": "第 1 课 · 打招呼与礼貌用语"
    },
    {
     "id": "ew-l02",
     "title": "第 2 课 · 人称与称呼"
    },
    {
     "id": "ew-l03",
     "title": "第 3 课 · 家庭成员"
    },
    {
     "id": "ew-l04",
     "title": "第 4 课 · 数字一（1 到 10）"
    },
    {
     "id": "ew-l05",
     "title": "第 5 课 · 数字二（11 到 20）"
    },
    {
     "id": "ew-l06",
     "title": "第 6 课 · 颜色"
    },
    {
     "id": "ew-l07",
     "title": "第 7 课 · 时间（天、周、月、年）"
    },
    {
     "id": "ew-l08",
     "title": "第 8 课 · 疑问词与这那"
    },
    {
     "id": "ew-l09",
     "title": "第 9 课 · 形容词一（大小好坏新旧）"
    },
    {
     "id": "ew-l10",
     "title": "第 10 课 · 形容词二（感受与状态）"
    },
    {
     "id": "ew-l11",
     "title": "第 11 课 · 天气与季节"
    },
    {
     "id": "ew-l12",
     "title": "第 12 课 · 学校与人"
    },
    {
     "id": "ew-l13",
     "title": "第 13 课 · 学习用品"
    },
    {
     "id": "ew-l14",
     "title": "第 14 课 · 身体部位"
    },
    {
     "id": "ew-l15",
     "title": "第 15 课 · 食物与饮品"
    },
    {
     "id": "ew-l16",
     "title": "第 16 课 · 水果与蔬菜"
    },
    {
     "id": "ew-l17",
     "title": "第 17 课 · 动物"
    },
    {
     "id": "ew-l18",
     "title": "第 18 课 · 衣物与家里"
    },
    {
     "id": "ew-l19",
     "title": "第 19 课 · 常用动词一（走跑坐站）"
    },
    {
     "id": "ew-l20",
     "title": "第 20 课 · 常用动词二（读写听说）"
    },
    {
     "id": "ew-l21",
     "title": "第 21 课 · 结课总复习与结课大考"
    }
   ],
   "examIds": [
    "ew-l01",
    "ew-l02",
    "ew-l03",
    "ew-l04",
    "ew-l05",
    "ew-l06",
    "ew-l07",
    "ew-l08",
    "ew-l09",
    "ew-l10",
    "ew-l11",
    "ew-l12",
    "ew-l13",
    "ew-l14",
    "ew-l15",
    "ew-l16",
    "ew-l17",
    "ew-l18",
    "ew-l19",
    "ew-l20",
    "ew-l21"
   ],
   "keywords": [
    "hello",
    "goodbye",
    "please",
    "thank",
    "sorry",
    "yes",
    "no",
    "OK",
    "welcome",
    "morning",
    "I",
    "you",
    "he",
    "she",
    "it",
    "we",
    "they",
    "my",
    "your",
    "friend",
    "family",
    "father",
    "mother",
    "brother",
    "sister",
    "son",
    "daughter",
    "grandpa",
    "grandma",
    "parents",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
    "twenty",
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple",
    "white",
    "black",
    "brown",
    "pink",
    "day",
    "week",
    "month",
    "year",
    "hour",
    "minute",
    "today",
    "yesterday",
    "tomorrow",
    "now",
    "what",
    "who",
    "where",
    "when",
    "why",
    "how",
    "this",
    "that",
    "these",
    "those",
    "big",
    "small",
    "long",
    "short",
    "tall",
    "good",
    "bad",
    "nice",
    "new",
    "old",
    "happy",
    "sad",
    "tired",
    "hungry",
    "thirsty",
    "busy",
    "free",
    "sick",
    "angry",
    "well",
    "weather",
    "season",
    "spring",
    "summer",
    "autumn",
    "winter",
    "rain",
    "snow",
    "wind",
    "cloud",
    "school",
    "classroom",
    "teacher",
    "student",
    "lesson",
    "class",
    "homework",
    "blackboard",
    "desk",
    "chair",
    "book",
    "pen",
    "pencil",
    "ruler",
    "eraser",
    "bag",
    "paper",
    "map",
    "dictionary",
    "card",
    "head",
    "face",
    "eye",
    "ear",
    "nose",
    "mouth",
    "tooth",
    "hand",
    "foot",
    "hair",
    "rice",
    "bread",
    "meat",
    "egg",
    "milk",
    "water",
    "juice",
    "tea",
    "coffee",
    "sugar",
    "apple",
    "banana",
    "grape",
    "pear",
    "peach",
    "watermelon",
    "potato",
    "tomato",
    "carrot",
    "vegetable",
    "cat",
    "dog",
    "pig",
    "cow",
    "horse",
    "sheep",
    "hen",
    "duck",
    "bird",
    "fish",
    "shirt",
    "pants",
    "shoe",
    "hat",
    "coat",
    "dress",
    "home",
    "room",
    "door",
    "window",
    "go",
    "come",
    "eat",
    "drink",
    "sit",
    "stand",
    "walk",
    "run",
    "play",
    "help",
    "read",
    "write",
    "listen",
    "speak",
    "see",
    "look",
    "say",
    "want",
    "like",
    "have"
   ],
   "files": [
    "assets/data/enwords-data.js"
   ],
   "examFiles": [
    "assets/data/enword-exam-data.js"
   ],
   "bytes": 172234,
   "examBytes": 14569
  },
  {
   "id": "genai",
   "source": "MIAO_MS_GENAI",
   "engine": "",
   "mount": "MIAO_MS_MOUNT",
   "title": "生成式 AI 入门（译自 Microsoft · MIT）",
   "intro": "微软官方写的 22 课生成式 AI 入门课，MIT 授权、本站译成中文。从「大模型到底在干什么」讲起，一路到提示工程、向量与 RAG、微调、Agent、元提示、设计原则与落地应用。每课自带可跑的 notebook 与代码。",
   "cat": "大模型",
   "diff": "入门",
   "tags": [
    "AI",
    "大模型",
    "提示工程",
    "RAG"
   ],
   "author": "Microsoft 原文 · 喵站译",
   "cover": "/assets/img/covers/genai.svg",
   "thumb": "",
   "hero": "",
   "updated": "2026-10-07",
   "chaps": 22,
   "chapters": [
    {
     "id": "genai-c01",
     "title": "第 1 课 · 把环境跑起来"
    },
    {
     "id": "genai-c02",
     "title": "第 2 课 · 生成式 AI 到底在干什么"
    },
    {
     "id": "genai-c03",
     "title": "第 3 课 · 认识并比较不同的大模型"
    },
    {
     "id": "genai-c04",
     "title": "第 4 课 · 负责任地用生成式 AI"
    },
    {
     "id": "genai-c05",
     "title": "第 5 课 · 提示词工程基础"
    },
    {
     "id": "genai-c06",
     "title": "第 6 课 · 进阶提示技巧"
    },
    {
     "id": "genai-c07",
     "title": "第 7 课 · 做一个文本生成应用"
    },
    {
     "id": "genai-c08",
     "title": "第 8 课 · 做一个聊天应用"
    },
    {
     "id": "genai-c09",
     "title": "第 9 课 · 做一个语义搜索应用"
    },
    {
     "id": "genai-c10",
     "title": "第 10 课 · 做一个图像生成应用"
    },
    {
     "id": "genai-c11",
     "title": "第 11 课 · 用低代码搭 AI 应用"
    },
    {
     "id": "genai-c12",
     "title": "第 12 课 · 让模型替你调用函数"
    },
    {
     "id": "genai-c13",
     "title": "第 13 课 · 给 AI 应用设计交互"
    },
    {
     "id": "genai-c14",
     "title": "第 14 课 · 给 AI 应用做安全防护"
    },
    {
     "id": "genai-c15",
     "title": "第 15 课 · 生成式 AI 应用的一生"
    },
    {
     "id": "genai-c16",
     "title": "第 16 课 · 检索增强与向量数据库"
    },
    {
     "id": "genai-c17",
     "title": "第 17 课 · 开源模型"
    },
    {
     "id": "genai-c18",
     "title": "第 18 课 · AI Agent 是什么"
    },
    {
     "id": "genai-c19",
     "title": "第 19 课 · 微调"
    },
    {
     "id": "genai-c20",
     "title": "第 20 课 · 小语言模型"
    },
    {
     "id": "genai-c21",
     "title": "第 21 课 · Mistral 与它的生态"
    },
    {
     "id": "genai-c22",
     "title": "第 22 课 · Llama 系的模型"
    }
   ],
   "examIds": [],
   "keywords": [],
   "files": [
    "assets/data/ms-data.js",
    "assets/data/ms/genai-c01.js",
    "assets/data/ms/genai-c02.js",
    "assets/data/ms/genai-c03.js",
    "assets/data/ms/genai-c04.js",
    "assets/data/ms/genai-c05.js",
    "assets/data/ms/genai-c06.js",
    "assets/data/ms/genai-c07.js",
    "assets/data/ms/genai-c08.js",
    "assets/data/ms/genai-c09.js",
    "assets/data/ms/genai-c10.js",
    "assets/data/ms/genai-c11.js",
    "assets/data/ms/genai-c12.js",
    "assets/data/ms/genai-c13.js",
    "assets/data/ms/genai-c14.js",
    "assets/data/ms/genai-c15.js",
    "assets/data/ms/genai-c16.js",
    "assets/data/ms/genai-c17.js",
    "assets/data/ms/genai-c18.js",
    "assets/data/ms/genai-c19.js",
    "assets/data/ms/genai-c20.js",
    "assets/data/ms/genai-c21.js",
    "assets/data/ms/genai-c22.js",
    "assets/data/ms-bodies.js"
   ],
   "examFiles": [],
   "bytes": 249631,
   "examBytes": 0
  },
  {
   "id": "ml",
   "source": "MIAO_MS_ML",
   "engine": "",
   "mount": "MIAO_MS_MOUNT",
   "title": "机器学习入门（译自 Microsoft · MIT）",
   "intro": "微软官方 9 组 · 每组 3 课的机器学习入门，MIT 授权、本站译成中文。从回归、分类、聚类一路做到 NLP、时间序列与强化学习，每组都带可跑的 notebook，还专门有一组讲真实项目里怎么落地。",
   "cat": "大模型",
   "diff": "入门",
   "tags": [
    "机器学习",
    "回归",
    "分类",
    "聚类",
    "NLP"
   ],
   "author": "Microsoft 原文 · 喵站译",
   "cover": "/assets/img/covers/ml.svg",
   "thumb": "",
   "hero": "",
   "updated": "2026-10-07",
   "chaps": 27,
   "chapters": [
    {
     "id": "ml-c01",
     "title": "第 1 课 · 什么是机器学习"
    },
    {
     "id": "ml-c02",
     "title": "第 2 课 · 机器学习简史"
    },
    {
     "id": "ml-c03",
     "title": "第 3 课 · 公平性：模型为什么会偏"
    },
    {
     "id": "ml-c04",
     "title": "第 4 课 · 机器学习都在解决哪类问题"
    },
    {
     "id": "ml-c05",
     "title": "第 5 课 · 回归这组要用什么工具"
    },
    {
     "id": "ml-c06",
     "title": "第 6 课 · 数据从哪来"
    },
    {
     "id": "ml-c07",
     "title": "第 7 课 · 线性回归"
    },
    {
     "id": "ml-c08",
     "title": "第 8 课 · 逻辑回归"
    },
    {
     "id": "ml-c09",
     "title": "第 9 课 · 把模型挂到网页上"
    },
    {
     "id": "ml-c10",
     "title": "第 10 课 · 分类问题是什么"
    },
    {
     "id": "ml-c11",
     "title": "第 11 课 · 分类器（上）"
    },
    {
     "id": "ml-c12",
     "title": "第 12 课 · 分类器（下）"
    },
    {
     "id": "ml-c13",
     "title": "第 13 课 · 拿推荐系统练一遍"
    },
    {
     "id": "ml-c14",
     "title": "第 14 课 · 先把数据画出来看"
    },
    {
     "id": "ml-c15",
     "title": "第 15 课 · K-均值聚类"
    },
    {
     "id": "ml-c16",
     "title": "第 16 课 · 自然语言处理入门"
    },
    {
     "id": "ml-c17",
     "title": "第 17 课 · NLP 的几类基本任务"
    },
    {
     "id": "ml-c18",
     "title": "第 18 课 · 翻译与情感分析"
    },
    {
     "id": "ml-c19",
     "title": "第 19 课 · 分析酒店评论（上）"
    },
    {
     "id": "ml-c20",
     "title": "第 20 课 · 分析酒店评论（下）"
    },
    {
     "id": "ml-c21",
     "title": "第 21 课 · 时间序列与预测"
    },
    {
     "id": "ml-c22",
     "title": "第 22 课 · 用 ARIMA 做预测"
    },
    {
     "id": "ml-c23",
     "title": "第 23 课 · 用支持向量回归做预测"
    },
    {
     "id": "ml-c24",
     "title": "第 24 课 · Q 学习入门"
    },
    {
     "id": "ml-c25",
     "title": "第 25 课 · 在 Gym 里跑强化学习"
    },
    {
     "id": "ml-c26",
     "title": "第 26 课 · 真实世界里的机器学习"
    },
    {
     "id": "ml-c27",
     "title": "第 27 课 · 模型不对的时候怎么查"
    }
   ],
   "examIds": [],
   "keywords": [],
   "files": [
    "assets/data/ms-data.js",
    "assets/data/ms/ml-c01.js",
    "assets/data/ms/ml-c02.js",
    "assets/data/ms/ml-c03.js",
    "assets/data/ms/ml-c04.js",
    "assets/data/ms/ml-c05.js",
    "assets/data/ms/ml-c06.js",
    "assets/data/ms/ml-c07.js",
    "assets/data/ms/ml-c08.js",
    "assets/data/ms/ml-c09.js",
    "assets/data/ms/ml-c10.js",
    "assets/data/ms/ml-c11.js",
    "assets/data/ms/ml-c12.js",
    "assets/data/ms/ml-c13.js",
    "assets/data/ms/ml-c14.js",
    "assets/data/ms/ml-c15.js",
    "assets/data/ms/ml-c16.js",
    "assets/data/ms/ml-c17.js",
    "assets/data/ms/ml-c18.js",
    "assets/data/ms/ml-c19.js",
    "assets/data/ms/ml-c20.js",
    "assets/data/ms/ml-c21.js",
    "assets/data/ms/ml-c22.js",
    "assets/data/ms/ml-c23.js",
    "assets/data/ms/ml-c24.js",
    "assets/data/ms/ml-c25.js",
    "assets/data/ms/ml-c26.js",
    "assets/data/ms/ml-c27.js",
    "assets/data/ms-bodies.js"
   ],
   "examFiles": [],
   "bytes": 309305,
   "examBytes": 0
  },
  {
   "id": "webdev",
   "source": "MIAO_MS_WEBDEV",
   "engine": "",
   "mount": "MIAO_MS_MOUNT",
   "title": "Web 开发入门（译自 Microsoft · MIT）",
   "intro": "微软官方 10 组 · 每组 2–3 课的 Web 开发入门，MIT 授权、本站译成中文。HTML/CSS/JS 打底，后面连着做打字小游戏、浏览器扩展、太空游戏、银行页面、代码编辑器，最后一组是接大模型的旅行生成器项目。",
   "cat": "计算机基础",
   "diff": "入门",
   "tags": [
    "HTML",
    "CSS",
    "JavaScript",
    "前端"
   ],
   "author": "Microsoft 原文 · 喵站译",
   "cover": "/assets/img/covers/webdev.svg",
   "thumb": "",
   "hero": "",
   "updated": "2026-10-07",
   "chaps": 27,
   "chapters": [
    {
     "id": "webdev-c01",
     "title": "第 1 课 · 编程语言都在解决什么"
    },
    {
     "id": "webdev-c02",
     "title": "第 2 课 · Git 与 GitHub 基础"
    },
    {
     "id": "webdev-c03",
     "title": "第 3 课 · 让所有人都用得上：无障碍"
    },
    {
     "id": "webdev-c04",
     "title": "第 4 课 · JavaScript 的数据类型"
    },
    {
     "id": "webdev-c05",
     "title": "第 5 课 · 函数与方法"
    },
    {
     "id": "webdev-c06",
     "title": "第 6 课 · 让程序自己做决定"
    },
    {
     "id": "webdev-c07",
     "title": "第 7 课 · 数组与循环"
    },
    {
     "id": "webdev-c08",
     "title": "第 8 课 · HTML：页面的骨架"
    },
    {
     "id": "webdev-c09",
     "title": "第 9 课 · CSS：页面的长相"
    },
    {
     "id": "webdev-c10",
     "title": "第 10 课 · DOM 与闭包"
    },
    {
     "id": "webdev-c11",
     "title": "第 11 课 · 做一个打字小游戏"
    },
    {
     "id": "webdev-c12",
     "title": "第 12 课 · 浏览器是怎么工作的"
    },
    {
     "id": "webdev-c13",
     "title": "第 13 课 · 表单与本地存储"
    },
    {
     "id": "webdev-c14",
     "title": "第 14 课 · 后台任务与性能"
    },
    {
     "id": "webdev-c15",
     "title": "第 15 课 · 太空射击游戏：开工"
    },
    {
     "id": "webdev-c16",
     "title": "第 16 课 · 在画布上画东西"
    },
    {
     "id": "webdev-c17",
     "title": "第 17 课 · 让元素动起来"
    },
    {
     "id": "webdev-c18",
     "title": "第 18 课 · 碰撞检测"
    },
    {
     "id": "webdev-c19",
     "title": "第 19 课 · 记分"
    },
    {
     "id": "webdev-c20",
     "title": "第 20 课 · 游戏怎么算结束"
    },
    {
     "id": "webdev-c21",
     "title": "第 21 课 · 银行项目：模板与路由"
    },
    {
     "id": "webdev-c22",
     "title": "第 22 课 · 银行项目：表单与校验"
    },
    {
     "id": "webdev-c23",
     "title": "第 23 课 · 银行项目：取数据"
    },
    {
     "id": "webdev-c24",
     "title": "第 24 课 · 银行项目：管状态"
    },
    {
     "id": "webdev-c25",
     "title": "第 25 课 · 把代码编辑器用起来"
    },
    {
     "id": "webdev-c26",
     "title": "第 26 课 · 做一个聊天应用"
    },
    {
     "id": "webdev-c27",
     "title": "第 27 课 · 接大模型做旅行生成器"
    }
   ],
   "examIds": [],
   "keywords": [],
   "files": [
    "assets/data/ms-data.js",
    "assets/data/ms/webdev-c01.js",
    "assets/data/ms/webdev-c02.js",
    "assets/data/ms/webdev-c03.js",
    "assets/data/ms/webdev-c04.js",
    "assets/data/ms/webdev-c05.js",
    "assets/data/ms/webdev-c06.js",
    "assets/data/ms/webdev-c07.js",
    "assets/data/ms/webdev-c08.js",
    "assets/data/ms/webdev-c09.js",
    "assets/data/ms/webdev-c10.js",
    "assets/data/ms/webdev-c11.js",
    "assets/data/ms/webdev-c12.js",
    "assets/data/ms/webdev-c13.js",
    "assets/data/ms/webdev-c14.js",
    "assets/data/ms/webdev-c15.js",
    "assets/data/ms/webdev-c16.js",
    "assets/data/ms/webdev-c17.js",
    "assets/data/ms/webdev-c18.js",
    "assets/data/ms/webdev-c19.js",
    "assets/data/ms/webdev-c20.js",
    "assets/data/ms/webdev-c21.js",
    "assets/data/ms/webdev-c22.js",
    "assets/data/ms/webdev-c23.js",
    "assets/data/ms/webdev-c24.js",
    "assets/data/ms/webdev-c25.js",
    "assets/data/ms/webdev-c26.js",
    "assets/data/ms/webdev-c27.js",
    "assets/data/ms-bodies.js"
   ],
   "examFiles": [],
   "bytes": 323658,
   "examBytes": 0
  },
  {
   "id": "agents",
   "source": "MIAO_MS_AGENTS",
   "engine": "",
   "mount": "MIAO_MS_MOUNT",
   "title": "AI Agent 入门（译自 Microsoft · MIT）",
   "intro": "微软官方 19 课 AI Agent 入门，MIT 授权、本站译成中文。讲清 agent 与普通对话的区别、任务描述与规划、对话方式、信任来源、知识检索、多 agent 协作、工作流、可观测性，最后一课是真实的旅行规划 agent，末尾还有一课专门讲 agent 的安全。",
   "cat": "Agent",
   "diff": "入门",
   "tags": [
    "AI",
    "Agent",
    "多智能体",
    "工作流"
   ],
   "author": "Microsoft 原文 · 喵站译",
   "cover": "/assets/img/covers/agents.svg",
   "thumb": "",
   "hero": "",
   "updated": "2026-10-07",
   "chaps": 19,
   "chapters": [
    {
     "id": "agents-c01",
     "title": "第 1 课 · 把环境跑起来"
    },
    {
     "id": "agents-c02",
     "title": "第 2 课 · 什么是 AI Agent"
    },
    {
     "id": "agents-c03",
     "title": "第 3 课 · 几种 agent 框架各管什么"
    },
    {
     "id": "agents-c04",
     "title": "第 4 课 · Agent 的设计模式"
    },
    {
     "id": "agents-c05",
     "title": "第 5 课 · 让 agent 真的去动手"
    },
    {
     "id": "agents-c06",
     "title": "第 6 课 · 会自己查资料的 agent"
    },
    {
     "id": "agents-c07",
     "title": "第 7 课 · 做可信、可控的 agent"
    },
    {
     "id": "agents-c08",
     "title": "第 8 课 · 让 agent 学会拆解任务"
    },
    {
     "id": "agents-c09",
     "title": "第 9 课 · 多个 agent 分工协作"
    },
    {
     "id": "agents-c10",
     "title": "第 10 课 · 让 agent 反思自己"
    },
    {
     "id": "agents-c11",
     "title": "第 11 课 · 把 agent 部署到线上"
    },
    {
     "id": "agents-c12",
     "title": "第 12 课 · agent 之间怎么对话：协议"
    },
    {
     "id": "agents-c13",
     "title": "第 13 课 · 上下文工程"
    },
    {
     "id": "agents-c14",
     "title": "第 14 课 · 给 agent 装记忆"
    },
    {
     "id": "agents-c15",
     "title": "第 15 课 · 微软的 Agent Framework"
    },
    {
     "id": "agents-c16",
     "title": "第 16 课 · 让 agent 用浏览器"
    },
    {
     "id": "agents-c17",
     "title": "第 17 课 · 部署扛得住并发的 agent"
    },
    {
     "id": "agents-c18",
     "title": "第 18 课 · 在自己机器上跑 agent"
    },
    {
     "id": "agents-c19",
     "title": "第 19 课 · agent 的安全"
    }
   ],
   "examIds": [],
   "keywords": [],
   "files": [
    "assets/data/ms-data.js",
    "assets/data/ms/agents-c01.js",
    "assets/data/ms/agents-c02.js",
    "assets/data/ms/agents-c03.js",
    "assets/data/ms/agents-c04.js",
    "assets/data/ms/agents-c05.js",
    "assets/data/ms/agents-c06.js",
    "assets/data/ms/agents-c07.js",
    "assets/data/ms/agents-c08.js",
    "assets/data/ms/agents-c09.js",
    "assets/data/ms/agents-c10.js",
    "assets/data/ms/agents-c11.js",
    "assets/data/ms/agents-c12.js",
    "assets/data/ms/agents-c13.js",
    "assets/data/ms/agents-c14.js",
    "assets/data/ms/agents-c15.js",
    "assets/data/ms/agents-c16.js",
    "assets/data/ms/agents-c17.js",
    "assets/data/ms/agents-c18.js",
    "assets/data/ms/agents-c19.js",
    "assets/data/ms-bodies.js"
   ],
   "examFiles": [],
   "bytes": 245905,
   "examBytes": 0
  }
 ]
};
