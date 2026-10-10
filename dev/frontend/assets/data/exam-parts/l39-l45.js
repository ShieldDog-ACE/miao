/* 喵站 · Python 课末考试 · l39–l45（第 39 到 45 课）
 * 契约见 ../py-exam-data.js 文件头；判分实现在 ../../frontend/assets/js/exam-grade.js。
 * 权重规矩：合计 100；地板项（run-ok / no-error / lines-at-least）≤45；本课特征项 ≥45。
 * 文件题：初始文件写在 files 里（相对名落在 /home/miao），file-has 的 path 要写绝对路径。
 */
window.MIAO_PY_EXAM_PARTS = window.MIAO_PY_EXAM_PARTS || [];
window.MIAO_PY_EXAM_PARTS.push(

  {
    cid: "l39",
    title: "第 39 课考试 · class：先画图纸再造东西",
    task: "画一张「商品」图纸：__init__ 收下 名称 和 单价，再造一个方法 总价(件数) 返回 单价 * 件数。拿「柠檬 8 元」造一个商品，打印它的 总价(3)，屏幕上是 24",
    hint: "图纸上写的是 self —— 那是「刚造出来的这一台」。方法负责 return 东西，开口说话交给外面的 print。回看【演示 1】【演示 2】【演示 3】。",
    starter: "class 商品:\n",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "24", weight: 45, label: "屏幕上就是那一行 24" },
      { id: "m", type: "called", name: "总价", min: 1, weight: 45, label: "那个 24 是真调用商品的 总价() 算出来的（本课要点）" },
      { id: "cls", type: "ast", uses: ["class"], weight: 0, label: "图纸是用 class 画的（不卡分，只告诉你用没用）" }
    ],
    reference: "class 商品:\n    def __init__(self, 名称, 单价):\n        self.名称 = 名称\n        self.单价 = 单价\n    def 总价(self, 件数):\n        return self.单价 * 件数\n蛋 = 商品('柠檬', 8)\nprint(蛋.总价(3))",
    alts: [
      "class 商品:\n    def __init__(self, n, p):\n        self.名 = n\n        self.价 = p\n\n    def 总价(self, 件):\n        return self.价 * 件\nprint(商品('柠檬', 8).总价(3))",
      "class 商品:\n    def __init__(self, 名称, 单价):\n        self.名称 = 名称\n        self.单价 = 单价\n    def 总价(self, 件数=1):\n        return self.单价 * 件数\n一份 = 商品('柠檬', 8)\nprint(一份.总价(3))",
      "class Product:\n    def __init__(self, name, price):\n        self.name = name\n        self.price = price\n    def 总价(self, 数):\n        return self.price * 数\np = Product('柠檬', 8)\nprint(p.总价(3))"
    ],
    wrongs: [
      "",
      "print(24)",
      "单价 = 8\nprint(单价 * 3)",
      "class 商品:\n    单价 = 8\nprint(商品.单价 * 3)",
      "class 商品:\n    def __init__(self, 名称, 单价):\n        self.单价 = 单价\n    def 总价(self, 件数):\n        print(self.单价 * 件数)\n蛋 = 商品('柠檬', 8)\nprint(24)",
      "class 商品:\n    def __init__(self, 名称, 单价):\n        self.单价 = 单价\n蛋 = 商品('柠檬', 8)\nprint(蛋.单价 * 3)"
    ],
    loose: [
      "class 商品:\n  def __init__( self , 名称 , 单价 ):\n    self.名称=名称\n    self.单价 = 单价\n  def 总价(self,件数):\n    return self.单价*件数\n蛋=商品('柠檬',8)\nprint( 蛋.总价(3) )\n",
      "\nclass 商品:\n    def __init__(self, 名称, 单价):\n        self.名称 = 名称\n        self.单价 = 单价\n\n    def 总价(self, 件数):\n        return self.单价 * 件数\n\n\n蛋 = 商品('柠檬', 8)\nprint(蛋.总价(3))\n"
    ]
  },

  {
    cid: "l40",
    title: "第 40 课考试 · 继承：新图纸外包给旧图纸",
    task: "已有父类 学生（__init__ 存 姓名、年龄）。写一个子类 研究生 继承它：自己的 __init__ 里先用 super().__init__(姓名, 年龄) 把父类那半件事外包出去，再多存一个 导师。造 研究生('老张', 25, '王教授')，打印它的 导师 和 年龄 一行：王教授 25",
    hint: "自己身上找不到就往父类问；但 __init__ 里那一行外包不写，父类要填的东西就漏着。回看【演示 1】【演示 2】。",
    starter: "class 学生:\n    def __init__(self, 姓名, 年龄):\n        self.姓名 = 姓名\n        self.年龄 = 年龄\n\n",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "王教授 25", weight: 45, label: "屏幕上就是那一行 王教授 25" },
      { id: "ss", type: "ast", uses: ["subclass", "super"], weight: 45, label: "子类写在 class 研究生(学生) 的括号里，并且真的外包给了 super()（本课两条要点都在这一项里）" }
    ],
    reference: "class 学生:\n    def __init__(self, 姓名, 年龄):\n        self.姓名 = 姓名\n        self.年龄 = 年龄\n\nclass 研究生(学生):\n    def __init__(self, 姓名, 年龄, 导师):\n        super().__init__(姓名, 年龄)\n        self.导师 = 导师\n\n人 = 研究生('老张', 25, '王教授')\nprint(人.导师, 人.年龄)",
    alts: [
      "class 学生:\n    def __init__(self, 姓名, 年龄):\n        self.姓名 = 姓名\n        self.年龄 = 年龄\n\n\nclass 研究生(学生):\n    def __init__(self, x, y, z):\n        super().__init__(x, y)\n        self.导师 = z\nprint(研究生('老张', 25, '王教授').导师, 研究生('老张', 25, '王教授').年龄)",
      "class 学生:\n    def __init__(self, 姓名, 年龄):\n        self.姓名 = 姓名\n        self.年龄 = 年龄\n\n\nclass 研究生(学生):\n    def __init__(self, 姓名, 年龄, 导师):\n        父 = super()\n        父.__init__(姓名, 年龄)\n        self.导师 = 导师\n\n管 = 研究生('老张', 25, '王教授')\nprint(管.导师, 管.年龄)"
    ],
    wrongs: [
      "",
      "print('王教授 25')",
      "class 学生:\n    def __init__(self, 姓名, 年龄):\n        self.姓名 = 姓名\n        self.年龄 = 年龄\n\nclass 研究生:\n    def __init__(self, 姓名, 年龄, 导师):\n        self.姓名 = 姓名\n        self.年龄 = 年龄\n        self.导师 = 导师\n\n人 = 研究生('老张', 25, '王教授')\nprint(人.导师, 人.年龄)",
      "class 学生:\n    def __init__(self, 姓名, 年龄):\n        self.姓名 = 姓名\n        self.年龄 = 年龄\n\nclass 研究生(学生):\n    def __init__(self, 姓名, 年龄, 导师):\n        self.年龄 = 年龄\n        self.导师 = 导师\n\n人 = 研究生('老张', 25, '王教授')\nprint(人.导师, 人.年龄)",
      "class 学生:\n    def __init__(self, 姓名, 年龄):\n        self.姓名 = 姓名\n        self.年龄 = 年龄\n\nprint('王教授', 25)"
    ],
    loose: [
      "class 学生:\n  def __init__(self,姓名,年龄):\n    self.姓名=姓名\n    self.年龄 = 年龄\nclass 研究生 ( 学生 ) :\n  def __init__(self,姓名,年龄,导师):\n        super().__init__( 姓名 , 年龄 )\n        self.导师=导师\n人=研究生('老张',25,'王教授')\nprint(人.导师 ,人.年龄)\n",
      "\nclass 学生:\n    def __init__(self, 姓名, 年龄):\n        self.姓名 = 姓名\n        self.年龄 = 年龄\n\nclass 研究生(学生):\n    def __init__(self, 姓名, 年龄, 导师):\n        super().__init__(姓名, 年龄)\n        self.导师 = 导师\n\n\n人 = 研究生('老张', 25, '王教授')\nprint(人.导师, 人.年龄)\n"
    ]
  },

  {
    cid: "l41",
    title: "第 41 课考试 · 打开文件：把硬盘上的字读进来",
    task: "同一份目录里已经放着 台账.txt（两行：柠檬 8 元 / 冰阔落 5 元）。把它整份读出来打印，屏幕两行和文件里一模一样。",
    hint: "文件对象是一根带游标的水管，读完就到底了。谁负责关门，本课有个推荐写法。回看【演示 1】【演示 2】。",
    starter: "with open(",
    files: { "台账.txt": "柠檬 8 元\n冰阔落 5 元\n" },
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有 FileNotFoundError 之类的红字" },
      { id: "text", type: "stdout-equals", text: "柠檬 8 元\n冰阔落 5 元", weight: 45, label: "屏幕两行和文件内容一致" },
      { id: "op", type: "called", name: "open", min: 1, weight: 45, label: "内容真是 open 开的文件里读出来的（本课要点）" }
    ],
    reference: "with open('台账.txt') as f:\n    print(f.read())",
    alts: [
      "f = open('台账.txt')\n内容 = f.read()\nf.close()\nprint(内容)",
      "with open('台账.txt') as 文件:\n    for 行 in 文件:\n        print(行, end='')",
      "with open('台账.txt') as f:\n    print(f.readline(), end='')\n    print(f.readline(), end='')",
      "with open('台账.txt', encoding='utf-8') as f:\n    print(''.join(f.readlines()))"
    ],
    wrongs: [
      "",
      "print('柠檬 8 元')\nprint('冰阔落 5 元')",
      "with open('台账.txt') as f:\n    print(f.readline())",
      "f = open('台账.txt')\nprint(f)",
      "with open('菜单.txt') as f:\n    print(f.read())"
    ],
    loose: [
      "with open( '台账.txt' ) as f :\n        print( f . read() )\n",
      "\nwith open('台账.txt') as f:\n    内容 = f.read()\n\nprint(内容)\n"
    ]
  },

  {
    cid: "l42",
    title: "第 42 课考试 · 写入文件：留在硬盘上才算数",
    task: "新建 便条.txt，把「老张收了三箱柠檬」写进去并关门；然后再打开它，把里面的内容打印出来。屏幕上要有这一行，文件里也得真写着这一行。",
    hint: "写完不关门，东西还浮在内存里没落地。'w' 在打开那一瞬间就把旧内容清了 —— 所以只写自己新建的文件。回看【演示 1】【演示 2】。",
    starter: "便条 = open('便条.txt', 'w')\n",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "老张收了三箱柠檬", weight: 35, label: "屏幕上打印了那一行" },
      { id: "file", type: "file-has", path: "/home/miao/便条.txt", has: "老张收了三箱柠檬", weight: 35, label: "硬盘上那份 便条.txt 里真的写着这句话（不是只打在屏幕上）" },
      { id: "w", type: "called", name: "write", min: 1, weight: 20, label: "用 write 写进去的" }
    ],
    reference: "便条 = open('便条.txt', 'w')\n便条.write('老张收了三箱柠檬')\n便条.close()\nwith open('便条.txt') as f:\n    print(f.read())",
    alts: [
      "with open('便条.txt', 'w') as f:\n    f.write('老张收了三箱柠檬')\nwith open('便条.txt') as f:\n    print(f.read())",
      "with open('便条.txt', 'w', encoding='utf-8') as f:\n    f.write('老张收了三箱柠檬\\n')\nfor 行 in open('便条.txt'):\n    print(行, end='')",
      "with open('便条.txt', 'w') as f:\n    f.writelines(['老张收了三箱柠檬'])\nf2 = open('便条.txt')\nprint(f2.read())\nf2.close()"
    ],
    wrongs: [
      "",
      "print('老张收了三箱柠檬')",
      "with open('便条.txt', 'w') as f:\n    print('老张收了三箱柠檬')",
      "便条 = open('便条.txt', 'w')\n便条.close()\nwith open('便条.txt') as f:\n    print(f.read())",
      "with open('便条.txt', 'r') as f:\n    print(f.read())"
    ],
    loose: [
      "with open( '便条.txt' , 'w' ) as f:\n        f.write( '老张收了三箱柠檬' )\nwith open('便条.txt') as f:\n    print(f.read())\n",
      "\nf = open('便条.txt', 'w')\n\nf.write('老张收了三箱柠檬')\nf.close()\n\nprint(open('便条.txt').read())\n"
    ]
  },

  {
    cid: "l43",
    title: "第 43 课考试 · 追加：别把旧的那行弄丢",
    task: "日志.txt 里已经写着「09:00 开门」。往它尾巴上追加一行「21:00 关门」，然后把整个文件读回来打印 —— 屏幕两行依次是 09:00 开门 和 21:00 关门，旧的那行不许丢。",
    hint: "哪种打开方式会在开门的瞬间把旧内容清空，哪种只在尾巴上写 —— 这一课的全部关键就在选哪个字母。回看【演示 1】【演示 2】。",
    starter: "with open('日志.txt', ",
    files: { "日志.txt": "09:00 开门\n" },
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "09:00 开门\n21:00 关门", weight: 45, label: "两行依次是旧的开门、新的关门（读回来打印，不是嘴上说说）" },
      { id: "file", type: "file-has", path: "/home/miao/日志.txt", has: "09:00 开门\n21:00 关门", weight: 45, label: "文件里两行真的都在：原来那句没被清掉，新的也落盘了（本课要点）" },
      { id: "w", type: "called", name: "write", min: 1, weight: 0, label: "新那行是用 write 写进去的" }
    ],
    reference: "with open('日志.txt', 'a') as f:\n    f.write('21:00 关门\\n')\nwith open('日志.txt') as f:\n    print(f.read())",
    alts: [
      "f = open('日志.txt', 'a')\nf.write('21:00 关门\\n')\nf.close()\nprint(open('日志.txt').read())",
      "with open('日志.txt', 'a', encoding='utf-8') as 日志:\n    日志.write('21:00 关门\\n')\nwith open('日志.txt') as 读:\n    print(读.read())",
      "with open('日志.txt', 'a') as f:\n    f.writelines(['21:00 关门\\n'])\nwith open('日志.txt') as f:\n    内容 = f.read()\nprint(内容)"
    ],
    wrongs: [
      "",
      "print('09:00 开门')\nprint('21:00 关门')",
      "with open('日志.txt', 'w') as f:\n    f.write('21:00 关门\\n')\nwith open('日志.txt') as f:\n    print(f.read())",
      "with open('日志.txt', 'a') as f:\n    f.write('21:00 关门\\n')\nprint('写好了')",
      "with open('日志.txt') as f:\n    print(f.read())"
    ],
    loose: [
      "with open('日志.txt','a') as f :\n        f . write( '21:00 关门\\n' )\nwith open('日志.txt') as f:\n    print( f.read() )\n",
      "\nwith open('日志.txt', 'a') as f:\n    f.write('21:00 关门\\n')\n\nwith open('日志.txt') as f:\n    内容 = f.read()\n\nprint(内容)\n"
    ]
  },

  {
    cid: "l44",
    title: "第 44 课考试 · try/except：出事了要说人话",
    task: "程序要把文本 'abc' 和 '12' 各转成数字：转不过去的那次不许甩一屏红字，改为打印「转不了」；成功那次打印数字本身。屏幕两行依次是 转不了 和 12。",
    hint: "try 只包住真会出事的那几行，except 要写清接的是哪一种错 —— 光秃秃的 except 连 KeyboardInterrupt 都一起吞掉。回看【演示 1】【演示 3】。",
    starter: "try:\n",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码跑完了，没被异常打断" },
      { id: "noerr", type: "no-error", weight: 5, label: "终端里没有 Traceback" },
      { id: "text", type: "stdout-equals", text: "转不了\n12", weight: 45, label: "两行依次是 转不了 和 12" },
      { id: "try", type: "ast", uses: ["try"], weight: 45, label: "用 try/except 接住了那次错（本课要点）" }
    ],
    reference: "try:\n    print(int('abc'))\nexcept ValueError:\n    print('转不了')\nprint(int('12'))",
    alts: [
      "def 转(s):\n    try:\n        return int(s)\n    except ValueError:\n        return '转不了'\nprint(转('abc'))\nprint(转('12'))",
      "for 词 in ['abc', '12']:\n    try:\n        print(int(词))\n    except ValueError:\n        print('转不了')",
      "try:\n    数 = int('abc')\n    print(数)\nexcept ValueError:\n    print('转不了')\nfinally:\n    print(int('12'), end='\\n' if False else '\\n')",
      "try:\n    print(int('abc'))\nexcept:\n    print('转不了')\nprint(int('12'))"
    ],
    wrongs: [
      "",
      "print('转不了')\nprint(12)",
      "print(int('abc'))\nprint(int('12'))",
      "if 'abc'.isdigit():\n    print(int('abc'))\nelse:\n    print('转不了')\nprint(int('12'))",
      "try:\n    print(int('abc'))\nexcept ValueError:\n    print('算错了')\nprint(int('12'))"
    ],
    loose: [
      "try :\n        print( int('abc') )\nexcept ValueError :\n        print( '转不了' )\n\nprint(int('12'))\n",
      "\ntry:\n    print(int('abc'))\nexcept ValueError:\n    print('转不了')\n\nprint(int('12'))\n"
    ]
  },

  {
    cid: "l45",
    title: "第 45 课考试 · JSON 持久化：存得下去，也取得回来",
    task: "把 {'姓名': '老张', '分数': 88} 用 json.dumps 转成文本写进 名单.json，再用 json.loads 把文件里的文本读回来成字典，打印它的 分数 —— 屏幕上是 88。",
    hint: "字典不能直接落盘，得先序列化成字符串；读回来时也是一串文本，不还原成对象就用不了。回看【演示 5】。",
    starter: "import json\n\n名单 = {'姓名': '老张', '分数': 88}\n",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "88", weight: 45, label: "屏幕上就是那一行 88" },
      { id: "d", type: "called", name: "dumps", min: 1, weight: 25, label: "存之前用 json.dumps 序列化过" },
      { id: "l", type: "called", name: "loads", min: 1, weight: 20, label: "读回来用 json.loads 还原成了字典（本课要点）" }
    ],
    reference: "import json\n\n名单 = {'姓名': '老张', '分数': 88}\nwith open('名单.json', 'w') as f:\n    f.write(json.dumps(名单, ensure_ascii=False))\nwith open('名单.json') as f:\n    取回 = json.loads(f.read())\nprint(取回['分数'])",
    alts: [
      "import json\n名单 = {'姓名': '老张', '分数': 88}\nwith open('名单.json', 'w') as f:\n    f.write(json.dumps(名单))\nwith open('名单.json') as f:\n    数据 = json.loads(f.read())\nprint(数据['分数'])",
      "import json\n名单 = {'姓名': '老张', '分数': 88}\ntext = json.dumps(名单)\nf = open('名单.json', 'w')\nf.write(text)\nf.close()\nback = json.loads(open('名单.json').read())\nprint(back['分数'])",
      "import json\n\n\ndef 存(名单):\n    with open('名单.json', 'w') as f:\n        f.write(json.dumps(名单))\n\n\ndef 取():\n    with open('名单.json') as f:\n        return json.loads(f.read())\n\n存({'姓名': '老张', '分数': 88})\nprint(取()['分数'])"
    ],
    wrongs: [
      "",
      "print(88)",
      "名单 = {'姓名': '老张', '分数': 88}\nwith open('名单.json', 'w') as f:\n    f.write(str(名单))\nwith open('名单.json') as f:\n    print(88)",
      "import json\n名单 = {'姓名': '老张', '分数': 88}\nprint(json.dumps(名单))",
      "import json\nwith open('名单.json', 'w') as f:\n    f.write('88')\nprint(88)"
    ],
    loose: [
      "import json\n名单={'姓名':'老张','分数':88}\nwith open('名单.json','w') as f:\n        f.write(json.dumps(名单))\nwith open('名单.json') as f:\n    r=json.loads(f.read())\nprint( r['分数'] )\n",
      "\nimport json\n\n名单 = {'姓名': '老张', '分数': 88}\n\nwith open('名单.json', 'w') as f:\n    f.write(json.dumps(名单))\n\nwith open('名单.json') as f:\n    取回 = json.loads(f.read())\n\nprint(取回['分数'])\n"
    ]
  }

);
