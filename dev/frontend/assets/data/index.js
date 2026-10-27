/* 喵站 · 站点目录（首屏唯一要读的教程数据）· 由 dev/tools/gen-index.js 生成，别手改
 *
 * 这里只有：每门课的元信息、每章的 id 与标题、哪些章排了考、
 * 以及分层加载要的两张表 —— boot（点开这门课任何一章都必拉的骨架）与
 * chunks（每一章的正文落在哪个文件，由「后写的顶掉先写的」算出来的赢家）。
 * 正文一块都不在 —— 所以改任何一课的正文，都要重跑生成器，标题、章数与这张映射才会同步。
 * 生成时间：2026-10-26 23:53
 */
window.MIAO_INDEX = {
 "tutorials": [
  {
   "id": "python",
   "source": "MIAO_PY",
   "engine": "code",
   "mount": "",
   "assemble": "MIAO_PY_ASSEMBLE",
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
   "boot": [
    "assets/data/py-data.js"
   ],
   "chunks": {
    "assets/data/py/p1.js": [
     "s01",
     "s02",
     "s03",
     "l01",
     "l02",
     "l03",
     "l04",
     "l05",
     "l06"
    ],
    "assets/data/py/p2.js": [
     "l07",
     "l08",
     "l09",
     "l10",
     "l11",
     "l12",
     "l13"
    ],
    "assets/data/py/p3.js": [
     "l14",
     "l15",
     "l16",
     "l17"
    ],
    "assets/data/py/p4.js": [
     "l18",
     "l19",
     "l20",
     "l21"
    ],
    "assets/data/py/p5.js": [
     "l22",
     "l23",
     "l24",
     "l25"
    ],
    "assets/data/py/p6.js": [
     "l35",
     "l36",
     "l37",
     "l38",
     "l39",
     "l40",
     "l41"
    ],
    "assets/data/py/p7.js": [
     "l42",
     "l43",
     "l44",
     "l45"
    ],
    "assets/data/py/p8.js": [
     "l26",
     "l27",
     "l28",
     "l29"
    ],
    "assets/data/py/p9.js": [
     "l30",
     "l31",
     "l32",
     "l33",
     "l34"
    ]
   },
   "examFiles": [
    "assets/data/py-exam-data.js",
    "assets/data/exam-parts/l04-l10.js",
    "assets/data/exam-parts/l11-l17.js",
    "assets/data/exam-parts/l18-l24.js",
    "assets/data/exam-parts/l25-l31.js",
    "assets/data/exam-parts/l32-l38.js",
    "assets/data/exam-parts/l39-l45.js"
   ]
  },
  {
   "id": "english",
   "source": "MIAO_EN",
   "engine": "en",
   "mount": "",
   "assemble": "",
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
   "boot": [
    "assets/data/en-data.js"
   ],
   "chunks": {},
   "examFiles": [
    "assets/data/en-exam-data.js"
   ]
  },
  {
   "id": "enwords",
   "source": "MIAO_ENW",
   "engine": "enword",
   "mount": "",
   "assemble": "",
   "title": "英语入门：21 课 257 个基础单词",
   "intro": "从 hello 到 code，21 个主题把真正入门要用的词一次排开。每个词都有读音、音标、词性、中文和一句常用短语，点一下就听；每课一场小考，最后一场 257 词的结课大考。",
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
   "chaps": 22,
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
     "title": "第 21 课 · 编程英语（C++ 与 Python）"
    },
    {
     "id": "ew-l22",
     "title": "第 22 课 · 结课总复习与结课大考"
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
    "ew-l21",
    "ew-l22"
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
    "everyone",
    "ticket",
    "late",
    "know",
    "China",
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
    "kind",
    "ready",
    "name",
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
    "little",
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
    "cup",
    "time",
    "yuan",
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
    "city",
    "rule",
    "question",
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
    "star",
    "sky",
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
    "next",
    "later",
    "before",
    "right",
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
    "way",
    "boy",
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
    "story",
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
    "leaf",
    "cold",
    "heavy",
    "strong",
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
    "English",
    "first",
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
    "piece",
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
    "wash",
    "open",
    "left",
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
    "bowl",
    "some",
    "glass",
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
    "bunch",
    "sweet",
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
    "warm",
    "near",
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
    "down",
    "fast",
    "game",
    "read",
    "write",
    "listen",
    "speak",
    "see",
    "look",
    "say",
    "want",
    "like",
    "have",
    "again",
    "code",
    "program",
    "print",
    "input",
    "output",
    "error",
    "bug",
    "file",
    "import",
    "include",
    "fix",
    "tool"
   ],
   "boot": [
    "assets/data/enwords-data.js"
   ],
   "chunks": {},
   "examFiles": [
    "assets/data/enword-exam-data.js"
   ]
  },
  {
   "id": "git",
   "source": "MIAO_GIT",
   "engine": "",
   "mount": "",
   "assemble": "",
   "title": "Git 入门",
   "intro": "从「版本库到底存了什么」讲到分支合并：三课讲清三个区、四种撤回、一张便利贴式的分支。每课都有能当场照敲的命令，坑单列在明面上。",
   "cat": "git",
   "diff": "入门",
   "tags": [
    "git",
    "版本库",
    "命令行"
   ],
   "author": "喵站官方",
   "cover": "/assets/img/covers/git.svg",
   "thumb": "",
   "hero": "",
   "updated": "2026-10-21",
   "chaps": 3,
   "chapters": [
    {
     "id": "g01",
     "title": "第 1 课 · 三个区：Git 到底把东西存在哪"
    },
    {
     "id": "g02",
     "title": "第 2 课 · 撤回：先看清 diff，再决定动哪个区"
    },
    {
     "id": "g03",
     "title": "第 3 课 · 分支：一张写着「这条线停在哪」的便利贴"
    }
   ],
   "examIds": [],
   "keywords": [],
   "boot": [
    "assets/data/git-data.js"
   ],
   "chunks": {},
   "examFiles": []
  },
  {
   "id": "genai",
   "source": "MIAO_MS_GENAI",
   "engine": "",
   "mount": "MIAO_MS_MOUNT",
   "assemble": "",
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
   "boot": [
    "assets/data/ms-data.js",
    "assets/data/ms-bodies.js"
   ],
   "chunks": {
    "assets/data/ms/genai-c01.js": [
     "genai-c01"
    ],
    "assets/data/ms/genai-c02.js": [
     "genai-c02"
    ],
    "assets/data/ms/genai-c03.js": [
     "genai-c03"
    ],
    "assets/data/ms/genai-c04.js": [
     "genai-c04"
    ],
    "assets/data/ms/genai-c05.js": [
     "genai-c05"
    ],
    "assets/data/ms/genai-c06.js": [
     "genai-c06"
    ],
    "assets/data/ms/genai-c07.js": [
     "genai-c07"
    ],
    "assets/data/ms/genai-c08.js": [
     "genai-c08"
    ],
    "assets/data/ms/genai-c09.js": [
     "genai-c09"
    ],
    "assets/data/ms/genai-c10.js": [
     "genai-c10"
    ],
    "assets/data/ms/genai-c11.js": [
     "genai-c11"
    ],
    "assets/data/ms/genai-c12.js": [
     "genai-c12"
    ],
    "assets/data/ms/genai-c13.js": [
     "genai-c13"
    ],
    "assets/data/ms/genai-c14.js": [
     "genai-c14"
    ],
    "assets/data/ms/genai-c15.js": [
     "genai-c15"
    ],
    "assets/data/ms/genai-c16.js": [
     "genai-c16"
    ],
    "assets/data/ms/genai-c17.js": [
     "genai-c17"
    ],
    "assets/data/ms/genai-c18.js": [
     "genai-c18"
    ],
    "assets/data/ms/genai-c19.js": [
     "genai-c19"
    ],
    "assets/data/ms/genai-c20.js": [
     "genai-c20"
    ],
    "assets/data/ms/genai-c21.js": [
     "genai-c21"
    ],
    "assets/data/ms/genai-c22.js": [
     "genai-c22"
    ]
   },
   "examFiles": []
  },
  {
   "id": "ml",
   "source": "MIAO_MS_ML",
   "engine": "",
   "mount": "MIAO_MS_MOUNT",
   "assemble": "",
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
   "boot": [
    "assets/data/ms-data.js",
    "assets/data/ms-bodies.js"
   ],
   "chunks": {
    "assets/data/ms/ml-c01.js": [
     "ml-c01"
    ],
    "assets/data/ms/ml-c02.js": [
     "ml-c02"
    ],
    "assets/data/ms/ml-c03.js": [
     "ml-c03"
    ],
    "assets/data/ms/ml-c04.js": [
     "ml-c04"
    ],
    "assets/data/ms/ml-c05.js": [
     "ml-c05"
    ],
    "assets/data/ms/ml-c06.js": [
     "ml-c06"
    ],
    "assets/data/ms/ml-c07.js": [
     "ml-c07"
    ],
    "assets/data/ms/ml-c08.js": [
     "ml-c08"
    ],
    "assets/data/ms/ml-c09.js": [
     "ml-c09"
    ],
    "assets/data/ms/ml-c10.js": [
     "ml-c10"
    ],
    "assets/data/ms/ml-c11.js": [
     "ml-c11"
    ],
    "assets/data/ms/ml-c12.js": [
     "ml-c12"
    ],
    "assets/data/ms/ml-c13.js": [
     "ml-c13"
    ],
    "assets/data/ms/ml-c14.js": [
     "ml-c14"
    ],
    "assets/data/ms/ml-c15.js": [
     "ml-c15"
    ],
    "assets/data/ms/ml-c16.js": [
     "ml-c16"
    ],
    "assets/data/ms/ml-c17.js": [
     "ml-c17"
    ],
    "assets/data/ms/ml-c18.js": [
     "ml-c18"
    ],
    "assets/data/ms/ml-c19.js": [
     "ml-c19"
    ],
    "assets/data/ms/ml-c20.js": [
     "ml-c20"
    ],
    "assets/data/ms/ml-c21.js": [
     "ml-c21"
    ],
    "assets/data/ms/ml-c22.js": [
     "ml-c22"
    ],
    "assets/data/ms/ml-c23.js": [
     "ml-c23"
    ],
    "assets/data/ms/ml-c24.js": [
     "ml-c24"
    ],
    "assets/data/ms/ml-c25.js": [
     "ml-c25"
    ],
    "assets/data/ms/ml-c26.js": [
     "ml-c26"
    ],
    "assets/data/ms/ml-c27.js": [
     "ml-c27"
    ]
   },
   "examFiles": []
  },
  {
   "id": "webdev",
   "source": "MIAO_MS_WEBDEV",
   "engine": "",
   "mount": "MIAO_MS_MOUNT",
   "assemble": "",
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
   "boot": [
    "assets/data/ms-data.js",
    "assets/data/ms-bodies.js"
   ],
   "chunks": {
    "assets/data/ms/webdev-c01.js": [
     "webdev-c01"
    ],
    "assets/data/ms/webdev-c02.js": [
     "webdev-c02"
    ],
    "assets/data/ms/webdev-c03.js": [
     "webdev-c03"
    ],
    "assets/data/ms/webdev-c04.js": [
     "webdev-c04"
    ],
    "assets/data/ms/webdev-c05.js": [
     "webdev-c05"
    ],
    "assets/data/ms/webdev-c06.js": [
     "webdev-c06"
    ],
    "assets/data/ms/webdev-c07.js": [
     "webdev-c07"
    ],
    "assets/data/ms/webdev-c08.js": [
     "webdev-c08"
    ],
    "assets/data/ms/webdev-c09.js": [
     "webdev-c09"
    ],
    "assets/data/ms/webdev-c10.js": [
     "webdev-c10"
    ],
    "assets/data/ms/webdev-c11.js": [
     "webdev-c11"
    ],
    "assets/data/ms/webdev-c12.js": [
     "webdev-c12"
    ],
    "assets/data/ms/webdev-c13.js": [
     "webdev-c13"
    ],
    "assets/data/ms/webdev-c14.js": [
     "webdev-c14"
    ],
    "assets/data/ms/webdev-c15.js": [
     "webdev-c15"
    ],
    "assets/data/ms/webdev-c16.js": [
     "webdev-c16"
    ],
    "assets/data/ms/webdev-c17.js": [
     "webdev-c17"
    ],
    "assets/data/ms/webdev-c18.js": [
     "webdev-c18"
    ],
    "assets/data/ms/webdev-c19.js": [
     "webdev-c19"
    ],
    "assets/data/ms/webdev-c20.js": [
     "webdev-c20"
    ],
    "assets/data/ms/webdev-c21.js": [
     "webdev-c21"
    ],
    "assets/data/ms/webdev-c22.js": [
     "webdev-c22"
    ],
    "assets/data/ms/webdev-c23.js": [
     "webdev-c23"
    ],
    "assets/data/ms/webdev-c24.js": [
     "webdev-c24"
    ],
    "assets/data/ms/webdev-c25.js": [
     "webdev-c25"
    ],
    "assets/data/ms/webdev-c26.js": [
     "webdev-c26"
    ],
    "assets/data/ms/webdev-c27.js": [
     "webdev-c27"
    ]
   },
   "examFiles": []
  },
  {
   "id": "agents",
   "source": "MIAO_MS_AGENTS",
   "engine": "",
   "mount": "MIAO_MS_MOUNT",
   "assemble": "",
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
   "boot": [
    "assets/data/ms-data.js",
    "assets/data/ms-bodies.js"
   ],
   "chunks": {
    "assets/data/ms/agents-c01.js": [
     "agents-c01"
    ],
    "assets/data/ms/agents-c02.js": [
     "agents-c02"
    ],
    "assets/data/ms/agents-c03.js": [
     "agents-c03"
    ],
    "assets/data/ms/agents-c04.js": [
     "agents-c04"
    ],
    "assets/data/ms/agents-c05.js": [
     "agents-c05"
    ],
    "assets/data/ms/agents-c06.js": [
     "agents-c06"
    ],
    "assets/data/ms/agents-c07.js": [
     "agents-c07"
    ],
    "assets/data/ms/agents-c08.js": [
     "agents-c08"
    ],
    "assets/data/ms/agents-c09.js": [
     "agents-c09"
    ],
    "assets/data/ms/agents-c10.js": [
     "agents-c10"
    ],
    "assets/data/ms/agents-c11.js": [
     "agents-c11"
    ],
    "assets/data/ms/agents-c12.js": [
     "agents-c12"
    ],
    "assets/data/ms/agents-c13.js": [
     "agents-c13"
    ],
    "assets/data/ms/agents-c14.js": [
     "agents-c14"
    ],
    "assets/data/ms/agents-c15.js": [
     "agents-c15"
    ],
    "assets/data/ms/agents-c16.js": [
     "agents-c16"
    ],
    "assets/data/ms/agents-c17.js": [
     "agents-c17"
    ],
    "assets/data/ms/agents-c18.js": [
     "agents-c18"
    ],
    "assets/data/ms/agents-c19.js": [
     "agents-c19"
    ]
   },
   "examFiles": []
  },
  {
   "id": "cpp",
   "source": "MIAO_CPP",
   "engine": "paper",
   "mount": "",
   "assemble": "MIAO_CPP_ASSEMBLE",
   "title": "C++ 入门",
   "intro": "从第一行 main() 走到能独立写出几百行的小程序：现代 C++（C++23）的 81 节必修课。每一课都从他的源稿出发，讲机制、带演示、有常见坑；课末考试过关这一课才算学完。",
   "cat": "C++",
   "diff": "入门",
   "tags": [
    "c++",
    "零基础",
    "每课有考试"
   ],
   "author": "喵站官方",
   "cover": "/assets/img/covers/cpp.svg",
   "thumb": "",
   "hero": "",
   "updated": "2026-10-10",
   "chaps": 84,
   "chapters": [
    {
     "id": "s01",
     "title": "第 0 课 · C++ 是什么，这两门课怎么读"
    },
    {
     "id": "s02",
     "title": "第 0 课 · 装一个编译器，并证明它真的装好了"
    },
    {
     "id": "s03",
     "title": "第 0 课 · 编辑器、第一份代码，和报错怎么读"
    },
    {
     "id": "c01",
     "title": "第 1 课 · 第一个程序：现代 C++ 的 Hello World"
    },
    {
     "id": "c02",
     "title": "第 2 课 · 声明变量：向编译器要盒子"
    },
    {
     "id": "c03",
     "title": "第 3 课 · 强类型：类型定了就不能改"
    },
    {
     "id": "c04",
     "title": "第 4 课 · auto：让编译器猜类型"
    },
    {
     "id": "c05",
     "title": "第 5 课 · auto 的字符串坑：号牌不是工具"
    },
    {
     "id": "c06",
     "title": "第 6 课 · const 常量：给盒子上锁"
    },
    {
     "id": "c07",
     "title": "第 7 课 · 命名规范：名字是写给三个月后的你看的"
    },
    {
     "id": "c08",
     "title": "第 8 课 · 整数与四则运算：让程序替你算"
    },
    {
     "id": "c09",
     "title": "第 9 课 · 整数除法与取余：商和零头是一对"
    },
    {
     "id": "c10",
     "title": "第 10 课 · 装不下的大数：int 的天花板与 long long"
    },
    {
     "id": "c11",
     "title": "第 11 课 · 小数盒 double：装得下小数，还管它打几位"
    },
    {
     "id": "c12",
     "title": "第 12 课 · 字符盒 char 与真假盒 bool：一个字符和一个开关"
    },
    {
     "id": "c13",
     "title": "第 13 课 · 文本盒 std::string 初见：装一段话，用 + 接成一句"
    },
    {
     "id": "c14",
     "title": "第 14 课 · 字符串的拼接与长度：让盒子自己报账"
    },
    {
     "id": "c15",
     "title": "第 15 课 · 按门牌号取字符：方括号里那个数是「离起点几步」"
    },
    {
     "id": "c16",
     "title": "第 16 课 · substr：一把剪刀加一把尺子"
    },
    {
     "id": "c17",
     "title": "第 17 课 · find：它在哪一格（找不到就给你一张空条）"
    },
    {
     "id": "c18",
     "title": "第 18 课 · replace / insert / erase：给字符串动三台手术"
    },
    {
     "id": "c19",
     "title": "第 19 课 · 字符串比大小：像查字典那样一格一格比编号"
    },
    {
     "id": "c20",
     "title": "第 20 课 · cin：让程序开口问你，而不是你替它写死"
    },
    {
     "id": "c21",
     "title": "第 21 课 · 算术运算符上场：+ - * / %"
    },
    {
     "id": "c22",
     "title": "第 22 课 · 比较运算：结果是真是假"
    },
    {
     "id": "c23",
     "title": "第 23 课 · 且、或、非：把几个小条件拼成大条件"
    },
    {
     "id": "c24",
     "title": "第 24 课 · 让变量自己变：++ -- += -="
    },
    {
     "id": "c25",
     "title": "第 25 课 · 先乘除后加减：运算符优先级"
    },
    {
     "id": "c26",
     "title": "第 26 课 · 一行文字整段读：getline 与它的前任留下的回车"
    },
    {
     "id": "c27",
     "title": "第 27 课 · 第一次 if：给程序装一道门卫"
    },
    {
     "id": "c28",
     "title": "第 28 课 · 多岔路口 else if：排成一列，命中即停"
    },
    {
     "id": "c29",
     "title": "第 29 课 · 套娃 if：门里面还有一道门"
    },
    {
     "id": "c30",
     "title": "第 30 课 · switch 点菜单：一个值对上一排号码牌"
    },
    {
     "id": "c31",
     "title": "第 31 课 · 二选一快捷方式：三目运算符 ? :"
    },
    {
     "id": "c32",
     "title": "第 32 课 · 带初始化的 if：临时变量只在 if 里活着"
    },
    {
     "id": "c33",
     "title": "第 33 课 · while 循环：条件成立就一直重复"
    },
    {
     "id": "c34",
     "title": "第 34 课 · do-while 循环：先干一次再看条件"
    },
    {
     "id": "c35",
     "title": "第 35 课 · for 循环：数数神器"
    },
    {
     "id": "c36",
     "title": "第 36 课 · for 倒着数与跳步"
    },
    {
     "id": "c37",
     "title": "第 37 课 · range-for 遍历：一个一个端给你"
    },
    {
     "id": "c38",
     "title": "第 38 课 · break 与 continue：循环的两个刹车"
    },
    {
     "id": "c39",
     "title": "第 39 课 · 嵌套循环：分针转满一圈，时针才走一格"
    },
    {
     "id": "c40",
     "title": "第 40 课 · 初识 vector：一只格子数会自己伸缩的收纳盒"
    },
    {
     "id": "c41",
     "title": "第 41 课 · 下标取元素：编号从 0 数，最后一格永远比 size() 少 1"
    },
    {
     "id": "c42",
     "title": "第 42 课 · push_back / pop_back：只在队尾进出"
    },
    {
     "id": "c43",
     "title": "第 43 课 · 遍历求和：range-for 配一只账本"
    },
    {
     "id": "c44",
     "title": "第 44 课 · 修改元素：下标改一个，auto& 改全员"
    },
    {
     "id": "c45",
     "title": "第 45 课 · 清空与判空：empty() 问一句，clear() 一键倒空"
    },
    {
     "id": "c46",
     "title": "第 46 课 · pair：把两个值捆成一束钥匙"
    },
    {
     "id": "c47",
     "title": "第 47 课 · 结构化绑定：一箱两件货，当场拆成两个名字"
    },
    {
     "id": "c48",
     "title": "第 48 课 · 绑定遍历成绩表：一排双格盒子，一轮拆一只"
    },
    {
     "id": "c49",
     "title": "第 49 课 · constexpr：编译期就钉死的数"
    },
    {
     "id": "c50",
     "title": "第 50 课 · using 类型别名：给长类型起一个会说人话的名字"
    },
    {
     "id": "c51",
     "title": "第 51 课 · 第一个函数：给一段代码起个名字"
    },
    {
     "id": "c52",
     "title": "第 52 课 · 带参数的函数：给函数开一个进料口"
    },
    {
     "id": "c53",
     "title": "第 53 课 · 返回值：函数把算好的作业交回来"
    },
    {
     "id": "c54",
     "title": "第 54 课 · 返回 bool 的函数：只回答「是」或「否」的裁判"
    },
    {
     "id": "c55",
     "title": "第 55 课 · 函数调用函数：大活拆小活"
    },
    {
     "id": "c56",
     "title": "第 56 课 · lambda：临时小函数"
    },
    {
     "id": "c57",
     "title": "第 57 课 · lambda 捕获变量：把外面的值抄进小口袋"
    },
    {
     "id": "c58",
     "title": "第 58 课 · 引用基础：给变量起外号"
    },
    {
     "id": "c59",
     "title": "第 59 课 · 传值：函数拿到的是复印件"
    },
    {
     "id": "c60",
     "title": "第 60 课 · 传引用：函数直接改原稿"
    },
    {
     "id": "c61",
     "title": "第 61 课 · const 引用：只许看，不许摸"
    },
    {
     "id": "c62",
     "title": "第 62 课 · 引用妙用：一次带回多个结果"
    },
    {
     "id": "c63",
     "title": "第 63 课 · 冒泡第 1 步：只走一轮"
    },
    {
     "id": "c64",
     "title": "第 64 课 · 冒泡完整版：一轮一轮排到底"
    },
    {
     "id": "c65",
     "title": "第 65 课 · 冒泡优化：没交换就提前收工"
    },
    {
     "id": "c66",
     "title": "第 66 课 · 传值 vs 传引用：一页分清"
    },
    {
     "id": "c67",
     "title": "第 67 课 · const 引用：读大对象的标准姿势"
    },
    {
     "id": "c68",
     "title": "第 68 课 · 默认参数：不传就用备用值"
    },
    {
     "id": "c69",
     "title": "第 69 课 · 函数重载：一名多用"
    },
    {
     "id": "c70",
     "title": "第 70 课 · 多个结果：引用参数当答案格"
    },
    {
     "id": "c71",
     "title": "第 71 课 · 递归：函数调用自己"
    },
    {
     "id": "c72",
     "title": "第 72 课 · 先声明后定义：函数的预告片"
    },
    {
     "id": "c73",
     "title": "第 73 课 · 内存与地址：变量住在哪一号柜子"
    },
    {
     "id": "c74",
     "title": "第 74 课 · 指针基础：一张写着门牌号的纸条"
    },
    {
     "id": "c75",
     "title": "第 75 课 · 指针 vs 引用：纸条与外号"
    },
    {
     "id": "c76",
     "title": "第 76 课 · 栈与堆：盒子住哪块地"
    },
    {
     "id": "c77",
     "title": "第 77 课 · 裸指针的四大坑：野、悬垂、漏、越界"
    },
    {
     "id": "c78",
     "title": "第 78 课 · 智能指针：会自动归还的纸条"
    },
    {
     "id": "c79",
     "title": "第 79 课 · lambda：一次性的小函数"
    },
    {
     "id": "c80",
     "title": "第 80 课 · 捕获：让 lambda 记住外面的变量"
    },
    {
     "id": "c81",
     "title": "第 81 课 · lambda 配 sort：自定义排队规则"
    }
   ],
   "examIds": [
    "c01",
    "c02",
    "c03",
    "c04",
    "c05",
    "c06",
    "c07",
    "c08",
    "c09",
    "c10",
    "c11",
    "c12",
    "c13",
    "c14",
    "c15",
    "c16",
    "c17",
    "c18",
    "c19",
    "c20",
    "c21",
    "c22",
    "c23",
    "c24",
    "c25",
    "c26",
    "c27",
    "c28",
    "c29",
    "c30",
    "c31",
    "c32",
    "c33",
    "c34",
    "c35",
    "c36",
    "c37",
    "c38",
    "c39",
    "c40",
    "c41",
    "c42",
    "c43",
    "c44",
    "c45",
    "c46",
    "c47",
    "c48",
    "c49",
    "c50",
    "c51",
    "c52",
    "c53",
    "c54",
    "c55",
    "c56",
    "c57",
    "c58",
    "c59",
    "c60",
    "c61",
    "c62",
    "c63",
    "c64",
    "c65",
    "c66",
    "c67",
    "c68",
    "c69",
    "c70",
    "c71",
    "c72",
    "c73",
    "c74",
    "c75",
    "c76",
    "c77",
    "c78",
    "c79",
    "c80",
    "c81"
   ],
   "keywords": [],
   "boot": [
    "assets/data/cpp-data.js"
   ],
   "chunks": {
    "assets/data/cpp/p00.js": [
     "s01",
     "s02",
     "s03"
    ],
    "assets/data/cpp/p01.js": [
     "c01",
     "c02",
     "c03",
     "c04",
     "c05"
    ],
    "assets/data/cpp/p02.js": [
     "c06",
     "c07",
     "c08",
     "c09",
     "c10"
    ],
    "assets/data/cpp/p03.js": [
     "c11",
     "c12",
     "c13",
     "c14",
     "c15"
    ],
    "assets/data/cpp/p04.js": [
     "c16",
     "c17",
     "c18",
     "c19",
     "c20"
    ],
    "assets/data/cpp/p05.js": [
     "c21",
     "c22",
     "c23",
     "c24",
     "c25"
    ],
    "assets/data/cpp/p06.js": [
     "c26",
     "c27",
     "c28",
     "c29",
     "c30"
    ],
    "assets/data/cpp/p07.js": [
     "c31",
     "c32",
     "c33",
     "c34"
    ],
    "assets/data/cpp/p08.js": [
     "c35",
     "c36",
     "c37",
     "c38"
    ],
    "assets/data/cpp/p09.js": [
     "c39",
     "c40",
     "c41",
     "c42"
    ],
    "assets/data/cpp/p10.js": [
     "c43",
     "c44",
     "c45",
     "c46"
    ],
    "assets/data/cpp/p11.js": [
     "c47",
     "c48",
     "c49",
     "c50"
    ],
    "assets/data/cpp/p12.js": [
     "c51",
     "c52",
     "c53",
     "c54"
    ],
    "assets/data/cpp/p13.js": [
     "c55",
     "c56",
     "c57",
     "c58"
    ],
    "assets/data/cpp/p14.js": [
     "c59",
     "c60",
     "c61",
     "c62"
    ],
    "assets/data/cpp/p15.js": [
     "c63",
     "c64",
     "c65",
     "c66"
    ],
    "assets/data/cpp/p16.js": [
     "c67",
     "c68",
     "c69",
     "c70"
    ],
    "assets/data/cpp/p17.js": [
     "c71",
     "c72",
     "c73",
     "c74"
    ],
    "assets/data/cpp/p18.js": [
     "c75",
     "c76",
     "c77",
     "c78"
    ],
    "assets/data/cpp/p19.js": [
     "c79",
     "c80",
     "c81"
    ]
   },
   "examFiles": [
    "assets/data/cpp-exam/p01.js",
    "assets/data/cpp-exam/p02.js",
    "assets/data/cpp-exam/p03.js",
    "assets/data/cpp-exam/p04.js",
    "assets/data/cpp-exam/p05.js",
    "assets/data/cpp-exam/p06.js",
    "assets/data/cpp-exam/p07.js",
    "assets/data/cpp-exam/p08.js",
    "assets/data/cpp-exam/p09.js",
    "assets/data/cpp-exam/p10.js",
    "assets/data/cpp-exam/p11.js",
    "assets/data/cpp-exam/p12.js",
    "assets/data/cpp-exam/p13.js",
    "assets/data/cpp-exam/p14.js",
    "assets/data/cpp-exam/p15.js",
    "assets/data/cpp-exam/p16.js",
    "assets/data/cpp-exam/p17.js",
    "assets/data/cpp-exam/p18.js",
    "assets/data/cpp-exam/p19.js",
    "assets/data/cpp-exam-data.js"
   ]
  },
  {
   "id": "cppm",
   "source": "MIAO_CPPM",
   "engine": "paper",
   "mount": "",
   "assemble": "MIAO_CPPM_ASSEMBLE",
   "title": "C++ 掌握",
   "intro": "接「C++ 入门」往深里走：标准库容器与算法、类与 RAII、模板与泛型、数据结构与算法实战，共 132 课。每一课考过才算学完。",
   "cat": "C++",
   "diff": "掌握",
   "tags": [
    "c++",
    "标准库",
    "数据结构",
    "每课有考试"
   ],
   "author": "喵站官方",
   "cover": "/assets/img/covers/cppm.svg",
   "thumb": "",
   "hero": "",
   "updated": "2026-10-10",
   "chaps": 132,
   "chapters": [
    {
     "id": "m82",
     "title": "第 82 课 · 算法三件套：count_if / find_if / transform"
    },
    {
     "id": "m83",
     "title": "第 83 课 · struct：把相关的几样东西装进一张名片"
    },
    {
     "id": "m84",
     "title": "第 84 课 · 自定义打印：教 println 认识你的 struct"
    },
    {
     "id": "m85",
     "title": "第 85 课 · struct 排序：多关键字定名次"
    },
    {
     "id": "m86",
     "title": "第 86 课 · 素数筛：把名单划着看，不试除"
    },
    {
     "id": "m87",
     "title": "第 87 课 · 词频统计：点人头，再排热搜"
    },
    {
     "id": "m88",
     "title": "第 88 课 · 二维 vector：把数据摆成一张表"
    },
    {
     "id": "m89",
     "title": "第 89 课 · 进制转换：把一个数换一套写法"
    },
    {
     "id": "m90",
     "title": "第 90 课 · 管道思想：filter 是给数据装的第一段筛子"
    },
    {
     "id": "m91",
     "title": "第 91 课 · transform：filter 挑人，transform 加工"
    },
    {
     "id": "m92",
     "title": "第 92 课 · 管道组合：三段接起来，圈只写一个"
    },
    {
     "id": "m93",
     "title": "第 93 课 · 常用视图速查：take、drop、reverse 只管「看哪一段」"
    },
    {
     "id": "m94",
     "title": "第 94 课 · iota 与惰性求值：要多少造多少"
    },
    {
     "id": "m95",
     "title": "第 95 课 · 实战：把管道接到一列学生身上"
    },
    {
     "id": "m96",
     "title": "第 96 课 · 视图不复制数据：窗户与房子"
    },
    {
     "id": "m97",
     "title": "第 97 课 · map 入门：一本自己排好序的词典"
    },
    {
     "id": "m98",
     "title": "第 98 课 · map 的陷阱：方括号会无中生有"
    },
    {
     "id": "m99",
     "title": "第 99 课 · map 词频统计：把上一课那颗雷当工具用"
    },
    {
     "id": "m100",
     "title": "第 100 课 · set 去重：只收独一份的盒子"
    },
    {
     "id": "m101",
     "title": "第 101 课 · queue 队列：只许队尾进、队首出"
    },
    {
     "id": "m102",
     "title": "第 102 课 · stack 栈：一摞盘子，最后放的先拿"
    },
    {
     "id": "m103",
     "title": "第 103 课 · priority_queue 优先队列：谁大谁先走"
    },
    {
     "id": "m104",
     "title": "第 104 课 · pair 与结构化绑定：两个值打包走"
    },
    {
     "id": "m105",
     "title": "第 105 课 · sort：标准库送的高速排序，规矩由你定"
    },
    {
     "id": "m106",
     "title": "第 106 课 · 二分查找：猜价格式的闪电定位"
    },
    {
     "id": "m107",
     "title": "第 107 课 · 最值与统计：minmax、accumulate、count_if"
    },
    {
     "id": "m108",
     "title": "第 108 课 · unique 去重两步走：它不删，只是搬到尾巴"
    },
    {
     "id": "m109",
     "title": "第 109 课 · 集合运算：交集、并集、差集一次算完"
    },
    {
     "id": "m110",
     "title": "第 110 课 · 下一个排列：next_permutation 枚举全排列"
    },
    {
     "id": "m111",
     "title": "第 111 课 · 数值算法与前缀和：把加法换成一次减法"
    },
    {
     "id": "m112",
     "title": "第 112 课 · 类的骨架：private 是锁住的零件，public 是按钮"
    },
    {
     "id": "m113",
     "title": "第 113 课 · 构造函数与初始化列表：对象出生那一刻就装好数据"
    },
    {
     "id": "m114",
     "title": "第 114 课 · const 成员函数：向编译器发誓「我只看，不动手」"
    },
    {
     "id": "m115",
     "title": "第 115 课 · 运算符重载：教对象学会比大小，算法就全认识它"
    },
    {
     "id": "m116",
     "title": "第 116 课 · 继承与 override：孩子说「父亲有的我全有，再改一部分」"
    },
    {
     "id": "m117",
     "title": "第 117 课 · 抽象类与 explicit：留个空洞逼孩子填，顺手把偷偷转换堵住"
    },
    {
     "id": "m118",
     "title": "第 118 课 · 特殊五件套：能让编译器代劳的五件事，就别自己手写"
    },
    {
     "id": "m119",
     "title": "第 119 课 · RAII 是什么：把「借」写进出生，把「还」写进死亡"
    },
    {
     "id": "m120",
     "title": "第 120 课 · 手写一个 RAII 类：把 fopen 和 fclose 缝进一对构造析构"
    },
    {
     "id": "m121",
     "title": "第 121 课 · unique_ptr 独占：一张纸条替你 delete"
    },
    {
     "id": "m122",
     "title": "第 122 课 · 转移所有权：纸条只能过户，不许复印"
    },
    {
     "id": "m123",
     "title": "第 123 课 · shared_ptr 共享：一张小卡片数着几个人在管"
    },
    {
     "id": "m124",
     "title": "第 124 课 · 三种持有方式怎么选：值、独占纸条、共享纸条"
    },
    {
     "id": "m125",
     "title": "第 125 课 · 实战：用 unique_ptr 串一条链表，删头就放整条"
    },
    {
     "id": "m126",
     "title": "第 126 课 · 魔法值的问题：-1 到底是不是一个数"
    },
    {
     "id": "m127",
     "title": "第 127 课 · optional：把「可能没有」写进返回类型"
    },
    {
     "id": "m128",
     "title": "第 128 课 · value_or：空盒就给兜底值，一行落地"
    },
    {
     "id": "m129",
     "title": "第 129 课 · variant：三格抽屉，同一时刻只开一格"
    },
    {
     "id": "m130",
     "title": "第 130 课 · visit：抽屉里是谁，就自动请谁上台"
    },
    {
     "id": "m131",
     "title": "第 131 课 · expected：成功拿结果，失败拿原因"
    },
    {
     "id": "m132",
     "title": "第 132 课 · 三兄弟怎么选：optional、variant、expected 一张桌"
    },
    {
     "id": "m133",
     "title": "第 133 课 · 复制与移动：抄一份，还是整屋搬走"
    },
    {
     "id": "m134",
     "title": "第 134 课 · 亲眼看见复制和移动：给类装上喇叭"
    },
    {
     "id": "m135",
     "title": "第 135 课 · 传参的代价：只读就递一扇窗，别递一整间房"
    },
    {
     "id": "m136",
     "title": "第 136 课 · 移动到底快多少：上秒表，别让直觉算账"
    },
    {
     "id": "m137",
     "title": "第 137 课 · 自动移动与 return：局部变量直接 return，别加 std::move"
    },
    {
     "id": "m138",
     "title": "第 138 课 · reserve 预留容量：提前把地皮租够，一次家都不用搬"
    },
    {
     "id": "m139",
     "title": "第 139 课 · 为什么要拆文件：一张图纸住 .h，一份零件住 .cpp"
    },
    {
     "id": "m140",
     "title": "第 140 课 · include 的本质：编译开始之前，有一位只照抄的抄写员"
    },
    {
     "id": "m141",
     "title": "第 141 课 · 从源码到程序的四步：一条 g++ 命令其实是四站连跑"
    },
    {
     "id": "m142",
     "title": "第 142 课 · 头文件与源文件：菜单只写有什么菜，后厨才写怎么做"
    },
    {
     "id": "m143",
     "title": "第 143 课 · 防止重复包含：头文件第一行为什么都写 #pragma once"
    },
    {
     "id": "m144",
     "title": "第 144 课 · 编译命令与 CMake：一条 g++ 怎么拼，四行 CMakeLists 又替你敲了哪条"
    },
    {
     "id": "m145",
     "title": "第 145 课 · 枚举就是全试一遍：把每个候选都问一次，答案自己站出来"
    },
    {
     "id": "m146",
     "title": "第 146 课 · 砍掉一层循环：题目给的等式，就是免费的答案"
    },
    {
     "id": "m147",
     "title": "第 147 课 · 模拟：把游戏规则逐句翻译成代码，你自己就是那台执行机器"
    },
    {
     "id": "m148",
     "title": "第 148 课 · 方向数组：把上下左右写成两个数组，走格子只剩两行代码"
    },
    {
     "id": "m149",
     "title": "第 149 课 · 模拟算第几天：把规则抄成一张表，特判只留一个"
    },
    {
     "id": "m150",
     "title": "第 150 课 · 边界！枚举的头号杀手：交卷前把格数捏一遍"
    },
    {
     "id": "m151",
     "title": "第 151 课 · 冒泡排序：工具齐了，回头看当年自己写的那两遍循环"
    },
    {
     "id": "m152",
     "title": "第 152 课 · 快速排序：抽一本书当基准，分成两堆，再叫自己来排每一堆"
    },
    {
     "id": "m153",
     "title": "第 153 课 · 归并排序：把两摞已经排好的牌，按大小合回一摞"
    },
    {
     "id": "m154",
     "title": "第 154 课 · 自定义排序规则：把「谁该排在谁前面」一句句写清楚"
    },
    {
     "id": "m155",
     "title": "第 155 课 · 折半猜数：每问一次砍掉一半，八个格子最多问四回"
    },
    {
     "id": "m156",
     "title": "第 156 课 · 二分答案：算不出就别算，猜一个长度去验证，在取值区间里找那条分界线"
    },
    {
     "id": "m157",
     "title": "第 157 课 · 贪心找零钱：每步只问一句「此刻能拿的最大面值是几」"
    },
    {
     "id": "m158",
     "title": "第 158 课 · 贪心会翻车：拿 4 的那一步，把 6 元的路走死了"
    },
    {
     "id": "m159",
     "title": "第 159 课 · 区间调度：把会议按散场时刻排队，越早散场的越先收下"
    },
    {
     "id": "m160",
     "title": "第 160 课 · 双指针两数之和：先排好序，再让两个下标从两头往中间夹"
    },
    {
     "id": "m161",
     "title": "第 161 课 · 三数之和为零：固定一个数，剩下的交给上一课那双指针"
    },
    {
     "id": "m162",
     "title": "第 162 课 · 滑动窗口：右端只管吃，左端只管吐，谁都不回头"
    },
    {
     "id": "m163",
     "title": "第 163 课 · 再滑一次：这次求「和达标的最短段」，收缩的条件反过来了"
    },
    {
     "id": "m164",
     "title": "第 164 课 · 前缀和：多开一格当地基，问哪一段都只减一次"
    },
    {
     "id": "m165",
     "title": "第 165 课 · 差分：前缀和倒过来用，只在区间两端打标记"
    },
    {
     "id": "m166",
     "title": "第 166 课 · 二维前缀和：每格存到左上角的总面积，四个角问出一个矩形"
    },
    {
     "id": "m167",
     "title": "二维差分"
    },
    {
     "id": "m168",
     "title": "DFS 全排列"
    },
    {
     "id": "m169",
     "title": "DFS 组合"
    },
    {
     "id": "m170",
     "title": "DFS 数岛屿"
    },
    {
     "id": "m171",
     "title": "第 171 课 · BFS 走迷宫：像水波一样一圈圈淹过去，第一次淹到终点就是最少步数"
    },
    {
     "id": "m172",
     "title": "第 172 课 · BFS 数字变换：把数字铺成地砖，+1、-1、×2 就是三扇门"
    },
    {
     "id": "m173",
     "title": "第 173 课 · DFS 剪枝（L5-05 第 6 篇 / 共 6 篇）"
    },
    {
     "id": "m174",
     "title": "第 174 课 · 动态规划：爬楼梯（L5-06 第 1 篇 / 共 7 篇）"
    },
    {
     "id": "m175",
     "title": "第 175 课 · 最大子数组和：一边扫一边维护「以当前数结尾的最优」"
    },
    {
     "id": "m176",
     "title": "第 176 课 · 0-1 背包：一张一维表，每件物品来时整表升级一次"
    },
    {
     "id": "m177",
     "title": "第 177 课 · 完全背包零钱兑换：东西可以无限拿，方向反过来就行"
    },
    {
     "id": "m178",
     "title": "第 178 课 · 最长公共子序列：两根指针各盯一个字符串，一张二维表定输赢"
    },
    {
     "id": "m179",
     "title": "第 179 课 · 动态数组是什么：size 与 capacity"
    },
    {
     "id": "m180",
     "title": "第 180 课 · 手写一次扩容搬家"
    },
    {
     "id": "m181",
     "title": "第 181 课 · 手写迷你 vector"
    },
    {
     "id": "m182",
     "title": "第 182 课 · 中间插队为什么要挪人"
    },
    {
     "id": "m183",
     "title": "第 183 课 · 链表是什么"
    },
    {
     "id": "m184",
     "title": "第 184 课 · 链表插队：只改纸条"
    },
    {
     "id": "m185",
     "title": "第 185 课 · 反转整条链"
    },
    {
     "id": "m186",
     "title": "第 186 课 · vector 和 list 谁更快"
    },
    {
     "id": "m187",
     "title": "第 187 课 · 栈是什么（L6-02 第 1 篇 / 共 7 篇）"
    },
    {
     "id": "m188",
     "title": "第 188 课 · 栈实战：括号配对检查（L6-02 第 2 篇 / 共 7 篇）"
    },
    {
     "id": "m189",
     "title": "第 189 课 · 队列是什么（L6-02 第 3 篇 / 共 7 篇）"
    },
    {
     "id": "m190",
     "title": "第 190 课 · 循环队列：治好\"假溢出\"（L6-02 第 4 篇 / 共 7 篇）"
    },
    {
     "id": "m191",
     "title": "第 191 课 · 两个栈倒出一个队列"
    },
    {
     "id": "m192",
     "title": "第 192 课 · 栈算算式：逆波兰表达式（L6-02 第 6 篇 / 共 7 篇）"
    },
    {
     "id": "m193",
     "title": "第 193 课 · 单调栈：下一个更大的数（L6-02 第 7 篇 / 共 7 篇）"
    },
    {
     "id": "m194",
     "title": "第 194 课 · 二叉树是什么（L6-03 第 1 篇 / 共 5 篇）"
    },
    {
     "id": "m195",
     "title": "第 195 课 · 前中后序遍历：递归点名的三种顺序"
    },
    {
     "id": "m196",
     "title": "第 196 课 · 二叉搜索树：插入（L6-03 第 3 篇 / 共 5 篇）"
    },
    {
     "id": "m197",
     "title": "第 197 课 · 二叉搜索树：查找（L6-03 第 4 篇 / 共 5 篇）"
    },
    {
     "id": "m198",
     "title": "第 198 课 · 层序遍历（L6-03 第 5 篇 / 共 5 篇）"
    },
    {
     "id": "m199",
     "title": "第 199 课 · 图与邻接表"
    },
    {
     "id": "m200",
     "title": "第 200 课 · 深度优先搜索 DFS（L6-04 第 2 篇 / 共 5 篇）"
    },
    {
     "id": "m201",
     "title": "第 201 课 · 广度优先搜索 BFS（L6-04 第 3 篇 / 共 5 篇）"
    },
    {
     "id": "m202",
     "title": "第 202 课 · BFS 求最短路（L6-04 第 4 篇 / 共 5 篇）"
    },
    {
     "id": "m203",
     "title": "第 203 课 · 拓扑排序（L6-04 第 5 篇 / 共 5 篇）"
    },
    {
     "id": "m204",
     "title": "第 204 课 · 哈希表是什么（L6-05 第 1 篇 / 共 5 篇）"
    },
    {
     "id": "m205",
     "title": "第 205 课 · 冲突怎么办（L6-05 第 2 篇 / 共 5 篇）"
    },
    {
     "id": "m206",
     "title": "第 206 课 · 并查集：找头儿（L6-05 第 3 篇 / 共 5 篇）"
    },
    {
     "id": "m207",
     "title": "第 207 课 · 并查集：合并（L6-05 第 4 篇 / 共 5 篇）"
    },
    {
     "id": "m208",
     "title": "第 208 课 · 数朋友圈（L6-05 第 5 篇 / 共 5 篇）"
    },
    {
     "id": "m209",
     "title": "第 209 课 · 堆是什么（L6-06 第 1 篇 / 共 5 篇）"
    },
    {
     "id": "m210",
     "title": "第 210 课 · 大顶堆出队（L6-06 第 2 篇 / 共 5 篇）"
    },
    {
     "id": "m211",
     "title": "第 211 课 · 小顶堆（L6-06 第 3 篇 / 共 5 篇）"
    },
    {
     "id": "m212",
     "title": "第 212 课 · Top-K 问题（L6-06 第 4 篇 / 共 5 篇）"
    },
    {
     "id": "m213",
     "title": "第 213 课 · 堆排序（L6-06 第 5 篇 / 共 5 篇）"
    }
   ],
   "examIds": [
    "m82",
    "m83",
    "m84",
    "m85",
    "m86",
    "m87",
    "m88",
    "m89",
    "m90",
    "m91",
    "m92",
    "m93",
    "m94",
    "m95",
    "m96",
    "m97",
    "m98",
    "m99",
    "m100",
    "m101",
    "m102",
    "m103",
    "m104",
    "m105",
    "m106",
    "m107",
    "m108",
    "m109",
    "m110",
    "m111",
    "m112",
    "m113",
    "m114",
    "m115",
    "m116",
    "m117",
    "m118",
    "m119",
    "m120",
    "m121",
    "m122",
    "m123",
    "m124",
    "m125",
    "m126",
    "m127",
    "m128",
    "m129",
    "m130",
    "m131",
    "m132",
    "m133",
    "m134",
    "m135",
    "m136",
    "m137",
    "m138",
    "m139",
    "m140",
    "m141",
    "m142",
    "m143",
    "m144",
    "m145",
    "m146",
    "m147",
    "m148",
    "m149",
    "m150",
    "m151",
    "m152",
    "m153",
    "m154",
    "m155",
    "m156",
    "m157",
    "m158",
    "m159",
    "m160",
    "m161",
    "m162",
    "m163",
    "m164",
    "m165",
    "m166",
    "m167",
    "m168",
    "m169",
    "m170",
    "m171",
    "m172",
    "m175",
    "m176",
    "m177",
    "m178",
    "m179",
    "m180",
    "m181",
    "m182",
    "m183",
    "m184",
    "m185",
    "m186",
    "m191",
    "m195",
    "m199"
   ],
   "keywords": [],
   "boot": [
    "assets/data/cppm-data.js"
   ],
   "chunks": {
    "assets/data/cppm/legacy.js": [
     "m173",
     "m174",
     "m187",
     "m188",
     "m189",
     "m190",
     "m192",
     "m193",
     "m194",
     "m196",
     "m197",
     "m198",
     "m200",
     "m201",
     "m202",
     "m203",
     "m204",
     "m205",
     "m206",
     "m207",
     "m208",
     "m209",
     "m210",
     "m211",
     "m212",
     "m213"
    ],
    "assets/data/cppm/p01.js": [
     "m82"
    ],
    "assets/data/cppm/p02.js": [
     "m83",
     "m84",
     "m85"
    ],
    "assets/data/cppm/p03.js": [
     "m86",
     "m87",
     "m88"
    ],
    "assets/data/cppm/p04.js": [
     "m89",
     "m90",
     "m91",
     "m92"
    ],
    "assets/data/cppm/p05.js": [
     "m93",
     "m94",
     "m95",
     "m96"
    ],
    "assets/data/cppm/p06.js": [
     "m97",
     "m98",
     "m99",
     "m100"
    ],
    "assets/data/cppm/p07.js": [
     "m101",
     "m102",
     "m103",
     "m104"
    ],
    "assets/data/cppm/p08.js": [
     "m105",
     "m106",
     "m107",
     "m108"
    ],
    "assets/data/cppm/p09.js": [
     "m109",
     "m110",
     "m111",
     "m112"
    ],
    "assets/data/cppm/p10.js": [
     "m113",
     "m114",
     "m115",
     "m116"
    ],
    "assets/data/cppm/p11.js": [
     "m117",
     "m118",
     "m119",
     "m120"
    ],
    "assets/data/cppm/p12.js": [
     "m121",
     "m122",
     "m123",
     "m124"
    ],
    "assets/data/cppm/p13.js": [
     "m125",
     "m126",
     "m127",
     "m128"
    ],
    "assets/data/cppm/p14.js": [
     "m129",
     "m130",
     "m131",
     "m132"
    ],
    "assets/data/cppm/p15.js": [
     "m133",
     "m134",
     "m135",
     "m136"
    ],
    "assets/data/cppm/p16.js": [
     "m137",
     "m138",
     "m139",
     "m140"
    ],
    "assets/data/cppm/p17.js": [
     "m141",
     "m142",
     "m143",
     "m144"
    ],
    "assets/data/cppm/p18.js": [
     "m145",
     "m146",
     "m147",
     "m148"
    ],
    "assets/data/cppm/p19.js": [
     "m149",
     "m150"
    ],
    "assets/data/cppm/p20.js": [
     "m151",
     "m152"
    ],
    "assets/data/cppm/p21.js": [
     "m153",
     "m154"
    ],
    "assets/data/cppm/p22.js": [
     "m155",
     "m156"
    ],
    "assets/data/cppm/p23.js": [
     "m157",
     "m158"
    ],
    "assets/data/cppm/p24.js": [
     "m159",
     "m160"
    ],
    "assets/data/cppm/p25.js": [
     "m161",
     "m162"
    ],
    "assets/data/cppm/p26.js": [
     "m163",
     "m164"
    ],
    "assets/data/cppm/p27.js": [
     "m165",
     "m166"
    ],
    "assets/data/cppm/p28.js": [
     "m167",
     "m168",
     "m169",
     "m170"
    ],
    "assets/data/cppm/p29.js": [
     "m171",
     "m172"
    ],
    "assets/data/cppm/p30.js": [
     "m175",
     "m176",
     "m177",
     "m178"
    ],
    "assets/data/cppm/p31.js": [
     "m179",
     "m180",
     "m181",
     "m182"
    ],
    "assets/data/cppm/p32.js": [
     "m183",
     "m184",
     "m185",
     "m186"
    ],
    "assets/data/cppm/p34.js": [
     "m191"
    ],
    "assets/data/cppm/p35.js": [
     "m195"
    ],
    "assets/data/cppm/p36.js": [
     "m199"
    ]
   },
   "examFiles": [
    "assets/data/cppm-exam/p01.js",
    "assets/data/cppm-exam/p02.js",
    "assets/data/cppm-exam/p03.js",
    "assets/data/cppm-exam/p04.js",
    "assets/data/cppm-exam/p05.js",
    "assets/data/cppm-exam/p06.js",
    "assets/data/cppm-exam/p07.js",
    "assets/data/cppm-exam/p08.js",
    "assets/data/cppm-exam/p09.js",
    "assets/data/cppm-exam/p10.js",
    "assets/data/cppm-exam/p11.js",
    "assets/data/cppm-exam/p12.js",
    "assets/data/cppm-exam/p13.js",
    "assets/data/cppm-exam/p14.js",
    "assets/data/cppm-exam/p15.js",
    "assets/data/cppm-exam/p16.js",
    "assets/data/cppm-exam/p17.js",
    "assets/data/cppm-exam/p18.js",
    "assets/data/cppm-exam/p19.js",
    "assets/data/cppm-exam/p20.js",
    "assets/data/cppm-exam/p21.js",
    "assets/data/cppm-exam/p22.js",
    "assets/data/cppm-exam/p23.js",
    "assets/data/cppm-exam/p24.js",
    "assets/data/cppm-exam/p25.js",
    "assets/data/cppm-exam/p26.js",
    "assets/data/cppm-exam/p27.js",
    "assets/data/cppm-exam/p28.js",
    "assets/data/cppm-exam/p30.js",
    "assets/data/cppm-exam/p31.js",
    "assets/data/cppm-exam/p32.js",
    "assets/data/cppm-exam/p36.js",
    "assets/data/cppm-exam-data.js"
   ]
  },
  {
   "id": "go",
   "source": "MIAO_GO",
   "engine": "",
   "mount": "",
   "assemble": "",
   "title": "Go 入门",
   "intro": "从 Google 的并发需求讲到切片：12 课把 Go 的基础语法走完，每课都有能照敲的程序和一张机制图。",
   "cat": "Go",
   "diff": "入门",
   "tags": [
    "Go",
    "Golang",
    "入门",
    "编程"
   ],
   "author": "喵站官方",
   "cover": "/assets/img/covers/go.svg",
   "thumb": "",
   "hero": "",
   "updated": "2026-10-27",
   "chaps": 12,
   "chapters": [
    {
     "id": "go01",
     "title": "第 1 课 · Go 的历史：Google 的并发语言"
    },
    {
     "id": "go02",
     "title": "第 2 课 · 装 Go 和 VS Code"
    },
    {
     "id": "go03",
     "title": "第 3 课 · 第一个程序：fmt.Println"
    },
    {
     "id": "go04",
     "title": "第 4 课 · 变量与短声明"
    },
    {
     "id": "go05",
     "title": "第 5 课 · 类型"
    },
    {
     "id": "go06",
     "title": "第 6 课 · 运算符"
    },
    {
     "id": "go07",
     "title": "第 7 课 · if 条件"
    },
    {
     "id": "go08",
     "title": "第 8 课 · else 与分支"
    },
    {
     "id": "go09",
     "title": "第 9 课 · for 循环"
    },
    {
     "id": "go10",
     "title": "第 10 课 · for range 与 while 写法"
    },
    {
     "id": "go11",
     "title": "第 11 课 · 函数"
    },
    {
     "id": "go12",
     "title": "第 12 课 · 数组与切片"
    }
   ],
   "examIds": [],
   "keywords": [],
   "boot": [
    "assets/data/go-data.js"
   ],
   "chunks": {},
   "examFiles": []
  },
  {
   "id": "c",
   "source": "MIAO_C",
   "engine": "",
   "mount": "",
   "assemble": "",
   "title": "C 入门",
   "intro": "从贝尔实验室的 Unix 讲到字符数组：12 课把 C 的基础语法走完，每课都有能照敲的程序和一张机制图。",
   "cat": "c",
   "diff": "入门",
   "tags": [
    "C",
    "GCC",
    "入门",
    "编程"
   ],
   "author": "喵站官方",
   "cover": "/assets/img/covers/c.svg",
   "thumb": "",
   "hero": "",
   "updated": "2026-10-27",
   "chaps": 12,
   "chapters": [
    {
     "id": "c01",
     "title": "第 1 课 · C 的历史：从贝尔实验室到 Unix"
    },
    {
     "id": "c02",
     "title": "第 2 课 · 装 GCC 和 VS Code"
    },
    {
     "id": "c03",
     "title": "第 3 课 · 第一个程序：printf"
    },
    {
     "id": "c04",
     "title": "第 4 课 · 变量与声明"
    },
    {
     "id": "c05",
     "title": "第 5 课 · 数据类型与 sizeof"
    },
    {
     "id": "c06",
     "title": "第 6 课 · 运算符"
    },
    {
     "id": "c07",
     "title": "第 7 课 · if 条件"
    },
    {
     "id": "c08",
     "title": "第 8 课 · else 与分支"
    },
    {
     "id": "c09",
     "title": "第 9 课 · for 循环"
    },
    {
     "id": "c10",
     "title": "第 10 课 · while 循环"
    },
    {
     "id": "c11",
     "title": "第 11 课 · 函数"
    },
    {
     "id": "c12",
     "title": "第 12 课 · 数组与字符串"
    }
   ],
   "examIds": [],
   "keywords": [],
   "boot": [
    "assets/data/c-data.js"
   ],
   "chunks": {},
   "examFiles": []
  },
  {
   "id": "ts",
   "source": "MIAO_TS",
   "engine": "",
   "mount": "",
   "assemble": "",
   "title": "TypeScript 入门",
   "intro": "从 2012 年微软的那次尝试讲起：12 课把 TypeScript 的基础语法走完，每课都有能照敲的代码和一张机制图。",
   "cat": "ts",
   "diff": "入门",
   "tags": [
    "TypeScript",
    "TS",
    "入门",
    "编程"
   ],
   "author": "喵站官方",
   "cover": "/assets/img/covers/ts.svg",
   "thumb": "",
   "hero": "",
   "updated": "2026-10-27",
   "chaps": 12,
   "chapters": [
    {
     "id": "ts01",
     "title": "第 1 课 · TypeScript 的历史：给 JavaScript 加类型"
    },
    {
     "id": "ts02",
     "title": "第 2 课 · 装 Node.js、VS Code 和 tsc"
    },
    {
     "id": "ts03",
     "title": "第 3 课 · 第一个程序：console.log 与类型注解"
    },
    {
     "id": "ts04",
     "title": "第 4 课 · 变量与 let/const"
    },
    {
     "id": "ts05",
     "title": "第 5 课 · 类型：string、number、boolean"
    },
    {
     "id": "ts06",
     "title": "第 6 课 · 运算符"
    },
    {
     "id": "ts07",
     "title": "第 7 课 · if 条件"
    },
    {
     "id": "ts08",
     "title": "第 8 课 · else 与分支"
    },
    {
     "id": "ts09",
     "title": "第 9 课 · for 循环"
    },
    {
     "id": "ts10",
     "title": "第 10 课 · while 循环"
    },
    {
     "id": "ts11",
     "title": "第 11 课 · 函数与参数类型"
    },
    {
     "id": "ts12",
     "title": "第 12 课 · 数组与元组"
    }
   ],
   "examIds": [],
   "keywords": [],
   "boot": [
    "assets/data/ts-data.js"
   ],
   "chunks": {},
   "examFiles": []
  },
  {
   "id": "github",
   "source": "MIAO_GITHUB",
   "engine": "",
   "mount": "",
   "assemble": "",
   "title": "GitHub 入门",
   "intro": "从 Git 托管讲到 Pull Request、Pages 与 Actions：12 课把远程协作的常用动作走完，每课都有能照敲的命令和一张流程图。",
   "cat": "github",
   "diff": "入门",
   "tags": [
    "GitHub",
    "Git",
    "协作",
    "入门"
   ],
   "author": "喵站官方",
   "cover": "/assets/img/covers/github.svg",
   "thumb": "",
   "hero": "",
   "updated": "2026-10-27",
   "chaps": 12,
   "chapters": [
    {
     "id": "gh01",
     "title": "第 1 课 · GitHub 的历史：从 Git 托管到协作平台"
    },
    {
     "id": "gh02",
     "title": "第 2 课 · 注册账号、装 Git 和配置 SSH"
    },
    {
     "id": "gh03",
     "title": "第 3 课 · 第一个远程仓库：init → remote → push"
    },
    {
     "id": "gh04",
     "title": "第 4 课 · origin、clone 与 pull"
    },
    {
     "id": "gh05",
     "title": "第 5 课 · 分支与 Pull Request"
    },
    {
     "id": "gh06",
     "title": "第 6 课 · Issue：把问题写成可执行的任务"
    },
    {
     "id": "gh07",
     "title": "第 7 课 · Fork 与开源协作"
    },
    {
     "id": "gh08",
     "title": "第 8 课 · Markdown 与 README"
    },
    {
     "id": "gh09",
     "title": "第 9 课 · GitHub Pages：把静态站发出去"
    },
    {
     "id": "gh10",
     "title": "第 10 课 · Actions：让机器替你跑测试"
    },
    {
     "id": "gh11",
     "title": "第 11 课 · Release 与标签"
    },
    {
     "id": "gh12",
     "title": "第 12 课 · 个人主页与后续路线"
    }
   ],
   "examIds": [],
   "keywords": [],
   "boot": [
    "assets/data/github-data.js"
   ],
   "chunks": {},
   "examFiles": []
  },
  {
   "id": "csharp",
   "source": "MIAO_CSHARP",
   "engine": "",
   "mount": "",
   "assemble": "",
   "title": "C# 入门",
   "intro": "从 .NET 的跨平台讲到数组与 List：12 课走完 C# 基础语法，每课都有能照敲的程序和一张机制图。",
   "cat": "c#",
   "diff": "入门",
   "tags": [
    "C#",
    ".NET",
    "入门",
    "编程"
   ],
   "author": "喵站官方",
   "cover": "/assets/img/covers/csharp.svg",
   "thumb": "",
   "hero": "",
   "updated": "2026-10-27",
   "chaps": 12,
   "chapters": [
    {
     "id": "cs01",
     "title": "第 1 课 · C# 的历史：.NET 与跨平台"
    },
    {
     "id": "cs02",
     "title": "第 2 课 · 装 .NET SDK 和 VS Code"
    },
    {
     "id": "cs03",
     "title": "第 3 课 · 第一个程序：Console.WriteLine"
    },
    {
     "id": "cs04",
     "title": "第 4 课 · 变量与 var"
    },
    {
     "id": "cs05",
     "title": "第 5 课 · 数据类型"
    },
    {
     "id": "cs06",
     "title": "第 6 课 · 运算符"
    },
    {
     "id": "cs07",
     "title": "第 7 课 · if 条件"
    },
    {
     "id": "cs08",
     "title": "第 8 课 · else 与分支"
    },
    {
     "id": "cs09",
     "title": "第 9 课 · for 循环"
    },
    {
     "id": "cs10",
     "title": "第 10 课 · while 循环"
    },
    {
     "id": "cs11",
     "title": "第 11 课 · 方法"
    },
    {
     "id": "cs12",
     "title": "第 12 课 · 数组与 List"
    }
   ],
   "examIds": [],
   "keywords": [],
   "boot": [
    "assets/data/csharp-data.js"
   ],
   "chunks": {},
   "examFiles": []
  },
  {
   "id": "java",
   "source": "MIAO_JAVA",
   "engine": "",
   "mount": "",
   "assemble": "",
   "title": "Java 入门",
   "intro": "从 Oak 与 JVM 讲到数组：12 课走完 Java 的基础语法，每课都有能照敲的程序和一张机制图。",
   "cat": "java",
   "diff": "入门",
   "tags": [
    "Java",
    "JDK",
    "入门",
    "编程"
   ],
   "author": "喵站官方",
   "cover": "/assets/img/covers/java.svg",
   "thumb": "",
   "hero": "",
   "updated": "2026-10-27",
   "chaps": 12,
   "chapters": [
    {
     "id": "ja01",
     "title": "第 1 课 · Java 的历史：从 Oak 到 JVM"
    },
    {
     "id": "ja02",
     "title": "第 2 课 · 装 JDK 和 VS Code"
    },
    {
     "id": "ja03",
     "title": "第 3 课 · 第一个程序：System.out.println"
    },
    {
     "id": "ja04",
     "title": "第 4 课 · 变量与命名"
    },
    {
     "id": "ja05",
     "title": "第 5 课 · 数据类型：基本类型与 String"
    },
    {
     "id": "ja06",
     "title": "第 6 课 · 运算符"
    },
    {
     "id": "ja07",
     "title": "第 7 课 · if 条件"
    },
    {
     "id": "ja08",
     "title": "第 8 课 · else 与分支"
    },
    {
     "id": "ja09",
     "title": "第 9 课 · for 循环"
    },
    {
     "id": "ja10",
     "title": "第 10 课 · while 循环"
    },
    {
     "id": "ja11",
     "title": "第 11 课 · 方法"
    },
    {
     "id": "ja12",
     "title": "第 12 课 · 数组"
    }
   ],
   "examIds": [],
   "keywords": [],
   "boot": [
    "assets/data/java-data.js"
   ],
   "chunks": {},
   "examFiles": []
  },
  {
   "id": "ide",
   "source": "MIAO_IDE",
   "engine": "",
   "mount": "",
   "assemble": "",
   "title": "IDE 入门（VS Code）",
   "intro": "从编辑器的历史讲到调试与远程开发：12 课把 VS Code 的常用功能走完，每课都有能照着按的快捷键和一张界面图。",
   "cat": "IDE",
   "diff": "入门",
   "tags": [
    "VS Code",
    "编辑器",
    "IDE",
    "入门"
   ],
   "author": "喵站官方",
   "cover": "/assets/img/covers/ide.svg",
   "thumb": "",
   "hero": "",
   "updated": "2026-10-27",
   "chaps": 12,
   "chapters": [
    {
     "id": "ide01",
     "title": "第 1 课 · 编辑器与 IDE 的历史"
    },
    {
     "id": "ide02",
     "title": "第 2 课 · 装 VS Code"
    },
    {
     "id": "ide03",
     "title": "第 3 课 · 界面：打开文件夹、编辑区、终端"
    },
    {
     "id": "ide04",
     "title": "第 4 课 · 编辑与快捷键"
    },
    {
     "id": "ide05",
     "title": "第 5 课 · 搜索与替换"
    },
    {
     "id": "ide06",
     "title": "第 6 课 · 扩展：装一个语言支持"
    },
    {
     "id": "ide07",
     "title": "第 7 课 · 调试：断点与单步"
    },
    {
     "id": "ide08",
     "title": "第 8 课 · Git 集成"
    },
    {
     "id": "ide09",
     "title": "第 9 课 · 终端与任务"
    },
    {
     "id": "ide10",
     "title": "第 10 课 · 工作区与设置"
    },
    {
     "id": "ide11",
     "title": "第 11 课 · 代码片段与重构"
    },
    {
     "id": "ide12",
     "title": "第 12 课 · 远程开发与后续路线"
    }
   ],
   "examIds": [],
   "keywords": [],
   "boot": [
    "assets/data/ide-data.js"
   ],
   "chunks": {},
   "examFiles": []
  },
  {
   "id": "rust",
   "source": "MIAO_RUST",
   "engine": "",
   "mount": "",
   "assemble": "",
   "title": "Rust 入门",
   "intro": "从 Mozilla 的内部项目讲到 Vec：12 课走完 Rust 的入门语法，每课都有能照敲的程序和一张机制图。",
   "cat": "Rust",
   "diff": "入门",
   "tags": [
    "Rust",
    "编程",
    "入门",
    "系统语言"
   ],
   "author": "喵站官方",
   "cover": "/assets/img/covers/rust.svg",
   "thumb": "",
   "hero": "",
   "updated": "2026-10-27",
   "chaps": 12,
   "chapters": [
    {
     "id": "r01",
     "title": "第 1 课 · Rust 的历史：从 Mozilla 到基金会"
    },
    {
     "id": "r02",
     "title": "第 2 课 · 装 rustup 和 VS Code"
    },
    {
     "id": "r03",
     "title": "第 3 课 · 第一个程序：println!"
    },
    {
     "id": "r04",
     "title": "第 4 课 · 变量、不可变与 mut"
    },
    {
     "id": "r05",
     "title": "第 5 课 · 标量类型"
    },
    {
     "id": "r06",
     "title": "第 6 课 · 运算符"
    },
    {
     "id": "r07",
     "title": "第 7 课 · if 条件"
    },
    {
     "id": "r08",
     "title": "第 8 课 · else 与表达式"
    },
    {
     "id": "r09",
     "title": "第 9 课 · loop 循环"
    },
    {
     "id": "r10",
     "title": "第 10 课 · while 与 for"
    },
    {
     "id": "r11",
     "title": "第 11 课 · 函数"
    },
    {
     "id": "r12",
     "title": "第 12 课 · 数组与 Vec"
    }
   ],
   "examIds": [],
   "keywords": [],
   "boot": [
    "assets/data/rust-data.js"
   ],
   "chunks": {},
   "examFiles": []
  },
  {
   "id": "linux",
   "source": "MIAO_LINUX",
   "engine": "",
   "mount": "",
   "assemble": "",
   "title": "Linux 入门",
   "intro": "从 Unix 的出身讲到第一个 shell 脚本：12 课把命令行最常用的部分走一遍，每课都有能照敲的命令和一张机制图。",
   "cat": "linux",
   "diff": "入门",
   "tags": [
    "Linux",
    "命令行",
    "Bash",
    "入门"
   ],
   "author": "喵站官方",
   "cover": "/assets/img/covers/linux.svg",
   "thumb": "",
   "hero": "",
   "updated": "2026-10-27",
   "chaps": 12,
   "chapters": [
    {
     "id": "lx01",
     "title": "第 1 课 · Linux 的历史：从 Unix 到内核"
    },
    {
     "id": "lx02",
     "title": "第 2 课 · 装 Linux：虚拟机或 WSL，并打开终端"
    },
    {
     "id": "lx03",
     "title": "第 3 课 · 第一个命令：pwd、ls、cd"
    },
    {
     "id": "lx04",
     "title": "第 4 课 · 文件和目录：mkdir、cp、mv、rm"
    },
    {
     "id": "lx05",
     "title": "第 5 课 · 看文件：cat、less、head、tail"
    },
    {
     "id": "lx06",
     "title": "第 6 课 · 权限与用户：chmod、chown、sudo"
    },
    {
     "id": "lx07",
     "title": "第 7 课 · 进程：ps、top、kill"
    },
    {
     "id": "lx08",
     "title": "第 8 课 · 软件包：apt / dnf 装东西"
    },
    {
     "id": "lx09",
     "title": "第 9 课 · 管道与重定向：竖线、大于号、双大于号"
    },
    {
     "id": "lx10",
     "title": "第 10 课 · 文本处理：grep、wc、sort"
    },
    {
     "id": "lx11",
     "title": "第 11 课 · 网络：ip、ping、curl、ssh"
    },
    {
     "id": "lx12",
     "title": "第 12 课 · shell 脚本入门"
    }
   ],
   "examIds": [],
   "keywords": [],
   "boot": [
    "assets/data/linux-data.js"
   ],
   "chunks": {},
   "examFiles": []
  },
  {
   "id": "math",
   "source": "MIAO_MATH",
   "engine": "",
   "mount": "",
   "assemble": "",
   "title": "高等数学入门",
   "intro": "从十七世纪的两个老问题讲到微分方程：12 课走完一元微积分的骨架，公式用 Unicode 写，每课一张机制图和一段能跑的 Python。",
   "cat": "高等数学",
   "diff": "入门",
   "tags": [
    "高等数学",
    "微积分",
    "数学",
    "入门"
   ],
   "author": "喵站官方",
   "cover": "/assets/img/covers/math.svg",
   "thumb": "",
   "hero": "",
   "updated": "2026-10-27",
   "chaps": 12,
   "chapters": [
    {
     "id": "m01",
     "title": "第 1 课 · 高等数学的历史：从牛顿到微积分"
    },
    {
     "id": "m02",
     "title": "第 2 课 · 准备工具：纸笔与 Python/SymPy"
    },
    {
     "id": "m03",
     "title": "第 3 课 · 函数与图像"
    },
    {
     "id": "m04",
     "title": "第 4 课 · 极限"
    },
    {
     "id": "m05",
     "title": "第 5 课 · 导数"
    },
    {
     "id": "m06",
     "title": "第 6 课 · 求导法则"
    },
    {
     "id": "m07",
     "title": "第 7 课 · 导数的应用"
    },
    {
     "id": "m08",
     "title": "第 8 课 · 积分"
    },
    {
     "id": "m09",
     "title": "第 9 课 · 微积分基本定理"
    },
    {
     "id": "m10",
     "title": "第 10 课 · 定积分的应用"
    },
    {
     "id": "m11",
     "title": "第 11 课 · 多元函数初步"
    },
    {
     "id": "m12",
     "title": "第 12 课 · 微分方程初步与后续路线"
    }
   ],
   "examIds": [],
   "keywords": [],
   "boot": [
    "assets/data/math-data.js"
   ],
   "chunks": {},
   "examFiles": []
  },
  {
   "id": "embedded",
   "source": "MIAO_EMBEDDED",
   "engine": "",
   "mount": "",
   "assemble": "",
   "title": "嵌入式入门",
   "intro": "从 1971 年的第一颗微处理器讲到 RTOS：12 课用一块 Arduino 兼容板走完嵌入式的地基，每课都有能照敲的程序和一张机制图。",
   "cat": "嵌入式",
   "diff": "入门",
   "tags": [
    "嵌入式",
    "单片机",
    "Arduino",
    "PlatformIO"
   ],
   "author": "喵站官方",
   "cover": "/assets/img/covers/embedded.svg",
   "thumb": "",
   "hero": "",
   "updated": "2026-10-27",
   "chaps": 12,
   "chapters": [
    {
     "id": "e01",
     "title": "第 1 课 · 嵌入式的历史：从单片机到物联网"
    },
    {
     "id": "e02",
     "title": "第 2 课 · 装工具链：VS Code 与 PlatformIO"
    },
    {
     "id": "e03",
     "title": "第 3 课 · 第一个程序：点亮 LED"
    },
    {
     "id": "e04",
     "title": "第 4 课 · GPIO 输入输出"
    },
    {
     "id": "e05",
     "title": "第 5 课 · 变量与数据类型（在单片机上）"
    },
    {
     "id": "e06",
     "title": "第 6 课 · 串口通信"
    },
    {
     "id": "e07",
     "title": "第 7 课 · 定时器"
    },
    {
     "id": "e08",
     "title": "第 8 课 · 中断"
    },
    {
     "id": "e09",
     "title": "第 9 课 · PWM"
    },
    {
     "id": "e10",
     "title": "第 10 课 · ADC"
    },
    {
     "id": "e11",
     "title": "第 11 课 · I2C 与 SPI"
    },
    {
     "id": "e12",
     "title": "第 12 课 · RTOS 入门与后续路线"
    }
   ],
   "examIds": [],
   "keywords": [],
   "boot": [
    "assets/data/embedded-data.js"
   ],
   "chunks": {},
   "examFiles": []
  },
  {
   "id": "algorithms",
   "source": "MIAO_ALGORITHMS",
   "engine": "",
   "mount": "",
   "assemble": "",
   "title": "算法入门",
   "intro": "算法不是计算机的专利：从欧几里得求最大公约数，到哈希表与二分查找，12 课把最常用的算法逐个拆开，每个概念都配一段能照敲的 Python 代码和一张机制图。",
   "cat": "算法",
   "diff": "入门",
   "tags": [
    "算法",
    "Python",
    "入门",
    "数据结构"
   ],
   "author": "喵站官方",
   "cover": "/assets/img/covers/algorithms.svg",
   "thumb": "",
   "hero": "",
   "updated": "2026-10-27",
   "chaps": 12,
   "chapters": [
    {
     "id": "al01",
     "title": "第 1 课 · 算法的历史：从欧几里得到计算机"
    },
    {
     "id": "al02",
     "title": "第 2 课 · 装工具：Python 和 VS Code"
    },
    {
     "id": "al03",
     "title": "第 3 课 · 第一个算法：线性查找"
    },
    {
     "id": "al04",
     "title": "第 4 课 · 时间复杂度"
    },
    {
     "id": "al05",
     "title": "第 5 课 · 数组与链表"
    },
    {
     "id": "al06",
     "title": "第 6 课 · 栈与队列"
    },
    {
     "id": "al07",
     "title": "第 7 课 · 哈希表"
    },
    {
     "id": "al08",
     "title": "第 8 课 · 排序入门：冒泡与插入"
    },
    {
     "id": "al09",
     "title": "第 9 课 · 分治排序：归并与快速"
    },
    {
     "id": "al10",
     "title": "第 10 课 · 二分查找"
    },
    {
     "id": "al11",
     "title": "第 11 课 · 递归"
    },
    {
     "id": "al12",
     "title": "第 12 课 · 树与图入门"
    }
   ],
   "examIds": [],
   "keywords": [],
   "boot": [
    "assets/data/algorithms-data.js"
   ],
   "chunks": {},
   "examFiles": []
  },
  {
   "id": "asm",
   "source": "MIAO_ASM",
   "engine": "",
   "mount": "",
   "assemble": "",
   "title": "汇编入门（x86-64）",
   "intro": "从机器码讲到字符串遍历：12 课把 x86-64 汇编的基础走完，每课都有能照敲的程序和一张机制图。",
   "cat": "汇编",
   "diff": "入门",
   "tags": [
    "汇编",
    "x86-64",
    "NASM",
    "系统调用"
   ],
   "author": "喵站官方",
   "cover": "/assets/img/covers/asm.svg",
   "thumb": "",
   "hero": "",
   "updated": "2026-10-27",
   "chaps": 12,
   "chapters": [
    {
     "id": "as01",
     "title": "第 1 课 · 汇编的历史：从机器码到助记符"
    },
    {
     "id": "as02",
     "title": "第 2 课 · 装 NASM、GCC 和 VS Code"
    },
    {
     "id": "as03",
     "title": "第 3 课 · 第一个程序：write 系统调用"
    },
    {
     "id": "as04",
     "title": "第 4 课 · 寄存器与数据宽度"
    },
    {
     "id": "as05",
     "title": "第 5 课 · 数据定义：db/dw/dd/dq"
    },
    {
     "id": "as06",
     "title": "第 6 课 · 寻址与算术指令"
    },
    {
     "id": "as07",
     "title": "第 7 课 · cmp 与条件跳转（if）"
    },
    {
     "id": "as08",
     "title": "第 8 课 · 无条件跳转与分支（else）"
    },
    {
     "id": "as09",
     "title": "第 9 课 · 计数循环：dec 与 jnz（for）"
    },
    {
     "id": "as10",
     "title": "第 10 课 · while 循环与比较"
    },
    {
     "id": "as11",
     "title": "第 11 课 · 函数：call / ret / 栈帧"
    },
    {
     "id": "as12",
     "title": "第 12 课 · 数组与字符串遍历"
    }
   ],
   "examIds": [],
   "keywords": [],
   "boot": [
    "assets/data/asm-data.js"
   ],
   "chunks": {},
   "examFiles": []
  },
  {
   "id": "basics",
   "source": "MIAO_BASICS",
   "engine": "",
   "mount": "",
   "assemble": "",
   "title": "计算机基础入门",
   "intro": "从「一个开关只有两个状态」走到「按下一次回车发生了什么」：12 课把比特、字节、编码、溢出、门电路、指令周期和内存分层串成一条线，每课都有能当场敲的命令和一张机制图。",
   "cat": "计算机基础",
   "diff": "入门",
   "tags": [
    "计算机基础",
    "二进制",
    "编码",
    "零基础"
   ],
   "author": "喵站官方",
   "cover": "/assets/img/covers/basics.svg",
   "thumb": "",
   "hero": "",
   "updated": "2026-10-27",
   "chaps": 12,
   "chapters": [
    {
     "id": "b01",
     "title": "第 1 课 · 计算机是什么：会算数的开关"
    },
    {
     "id": "b02",
     "title": "第 2 课 · 看清这台机器：把参数抄下来"
    },
    {
     "id": "b03",
     "title": "第 3 课 · 第一个转换：把 42 写成二进制"
    },
    {
     "id": "b04",
     "title": "第 4 课 · 字节：8 个比特捆成一格"
    },
    {
     "id": "b05",
     "title": "第 5 课 · 十六进制：程序员的速记"
    },
    {
     "id": "b06",
     "title": "第 6 课 · ASCII：字符在机器里是一个数"
    },
    {
     "id": "b07",
     "title": "第 7 课 · UTF-8：中文为什么要变长"
    },
    {
     "id": "b08",
     "title": "第 8 课 · 整数溢出：盒子只有那么大"
    },
    {
     "id": "b09",
     "title": "第 9 课 · 门电路：一个开关怎么算加法"
    },
    {
     "id": "b10",
     "title": "第 10 课 · 指令周期：一条命令在 CPU 里走的路"
    },
    {
     "id": "b11",
     "title": "第 11 课 · 内存金字塔：越快的越贵"
    },
    {
     "id": "b12",
     "title": "第 12 课 · 结课串联：按下一次回车发生了什么"
    }
   ],
   "examIds": [],
   "keywords": [],
   "boot": [
    "assets/data/basics-data.js"
   ],
   "chunks": {},
   "examFiles": []
  },
  {
   "id": "js",
   "source": "MIAO_JS",
   "engine": "",
   "mount": "",
   "assemble": "",
   "title": "JavaScript 入门",
   "intro": "从历史到实践，一步步掌握 JavaScript 核心概念，适合零基础学习者。",
   "cat": "js",
   "diff": "入门",
   "tags": [
    "JavaScript",
    "入门",
    "编程",
    "技术课"
   ],
   "author": "喵站官方",
   "cover": "/assets/img/covers/js.svg",
   "thumb": "",
   "hero": "",
   "updated": "2026-10-25",
   "chaps": 3,
   "chapters": [
    {
     "id": "j01",
     "title": "第 1 课 · JavaScript 的历史"
    },
    {
     "id": "j02",
     "title": "第 2 课 · 安装 VS Code 和 Node.js"
    },
    {
     "id": "j03",
     "title": "第 3 课 · 第一个程序：console.log"
    }
   ],
   "examIds": [],
   "keywords": [],
   "boot": [
    "assets/data/js-data.js"
   ],
   "chunks": {},
   "examFiles": []
  }
 ]
};
