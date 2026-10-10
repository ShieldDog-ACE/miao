/* 喵站 · Python 课末考试 · l25–l31（第 25 到 31 课）
 * 契约见 ../py-exam-data.js 文件头；判分实现在 ../../frontend/assets/js/exam-grade.js。
 * 权重规矩：合计 100；地板项（run-ok / no-error / lines-at-least）≤45；本课特征项 ≥45。
 */
window.MIAO_PY_EXAM_PARTS = window.MIAO_PY_EXAM_PARTS || [];
window.MIAO_PY_EXAM_PARTS.push(

  {
    cid: "l25",
    title: "第 25 课考试 · if 拐弯：真路假路都走一遍",
    task: "网吧实名检查：先拿 年龄 = 17 跑一次判断，再拿 年龄 = 18 跑一次，屏幕上依次打出「未满 18，不让进」和「可以进」",
    hint: "同一个判断写两遍不算笨，这一课要的就是同一条 if 两次走进不同的格子。回看【演示 1】【演示 5】。",
    starter: "年龄 = 17\n",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "未满 18，不让进\n可以进", weight: 45, label: "屏幕上依次是这两行" },
      { id: "bt", type: "branch", at: "true", weight: 25, label: "真的有一次判断成立，走了真分支" },
      { id: "bf", type: "branch", at: "false", weight: 20, label: "也真的有一次判断不成立，整块被跳过" }
    ],
    reference: "年龄 = 17\nif 年龄 >= 18:\n    print('可以进')\nelse:\n    print('未满 18，不让进')\n年龄 = 18\nif 年龄 >= 18:\n    print('可以进')\nelse:\n    print('未满 18，不让进')",
    alts: [
      "if 17 >= 18:\n    print('可以进')\nelse:\n    print('未满 18，不让进')\nif 18 >= 18:\n    print('可以进')\nelse:\n    print('未满 18，不让进')",
      "年龄 = 17\nif 年龄 < 18:\n    print('未满 18，不让进')\n年龄 = 18\nif 年龄 < 18:\n    print('未满 18，不让进')\nelse:\n    print('可以进')",
      "for 年龄 in [17, 18]:\n    if 年龄 >= 18:\n        print('可以进')\n    else:\n        print('未满 18，不让进')"
    ],
    wrongs: [
      "",
      "print('未满 18，不让进')\nprint('可以进')",
      "年龄 = 17\nif 年龄 >= 18:\n    print('可以进')\nelse:\n    print('未满 18，不让进')",
      "年龄 = 17\nif 年龄 >= 18:\n    print('可以进')\n年龄 = 18\nif 年龄 >= 18:\n    print('可以进')"
    ],
    loose: [
      "年龄=17\nif  年龄>=18 :\n    print( '可以进' )\nelse:\n        print('未满 18，不让进')\n年龄 =18\nif 年龄>=18:\n  print('可以进')\nelse:\n  print('未满 18，不让进')\n",
      "\n年龄 = 17\n\nif 年龄 >= 18:\n    print('可以进')\nelse:\n    print('未满 18，不让进')\n\n年龄 = 18\nif 年龄 >= 18:\n    print('可以进')\nelse:\n    print('未满 18，不让进')"
    ]
  },

  {
    cid: "l26",
    title: "第 26 课考试 · elif 排队：只让一句出来",
    task: "分数 = 85，用 if / elif / else 排成一条队，从高分往低分判，屏幕上只打出一行：良好",
    hint: "分支是互斥的：排在前面的先接走人。顺序排反了会怎样，【演示 3】里那个「优秀永远进不来」就是答案。回看【演示 1】。",
    starter: "分数 = 85\n",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "良好", weight: 45, label: "屏幕上正好只有「良好」这一行" },
      { id: "elif", type: "ast", uses: ["elif"], weight: 45, label: "用的是 if/elif 排队，不是几个独立的 if（本课要点）" }
    ],
    reference: "分数 = 85\nif 分数 >= 90:\n    print('优秀')\nelif 分数 >= 80:\n    print('良好')\nelif 分数 >= 60:\n    print('及格')\nelse:\n    print('不及格')",
    alts: [
      "分数 = 85\nif 分数 >= 80:\n    print('良好')\nelif 分数 >= 60:\n    print('及格')\nelse:\n    print('不及格')",
      "分数 = 85\nif 分数 < 60:\n    print('不及格')\nelif 分数 < 80:\n    print('及格')\nelif 分数 < 90:\n    print('良好')\nelse:\n    print('优秀')",
      "分数 = 85\nif 分数 >= 90:\n    print('优秀')\nelif 90 > 分数 >= 80:\n    print('良好')\nelse:\n    print('还要更低')\n"
    ],
    wrongs: [
      "",
      "print('良好')",
      "分数 = 85\nif 分数 >= 60:\n    print('及格')\nif 分数 >= 80:\n    print('良好')\nif 分数 >= 90:\n    print('优秀')",
      "分数 = 85\nif 分数 >= 60:\n    print('及格')\nelif 分数 >= 80:\n    print('良好')",
      "分数 = 85\nif 分数 >= 90:\n    print('优秀')\nelif 分数 >= 80:\n    print('良好')\nprint('良好')"
    ],
    loose: [
      "分数=85\nif 分数>=90:\n        print('优秀')\nelif 分数 >= 80 :\n    print( '良好' )\nelif 分数>=60:\n    print('及格')\nelse:\n    print('不及格')\n",
      "\n分数 = 85\n\nif 分数 >= 90:\n    print('优秀')\nelif 分数 >= 80:\n    print('良好')\nelse:\n    print('及格')\n"
    ]
  },

  {
    cid: "l27",
    title: "第 27 课考试 · and 与 or：一条条件里放两件事",
    task: "两条规则各写一行：满 18 岁**并且**有身份证才「可以上网」；是会员**或者**订单满 99 元就「免运费」。用 and 和 or 各判一次，输出两行：可以上网 / 免运费",
    hint: "别把两条 if 套在一起 —— 这一课要的是把它们挤进同一条条件里。顺序有讲究：and 左边先定胜负。回看【演示 1】【演示 2】。",
    starter: "年龄 = 20\n有身份证 = True\n",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "可以上网\n免运费", weight: 45, label: "屏幕上依次是这两行" },
      { id: "logic", type: "ast", uses: ["and", "or"], weight: 45, label: "一条条件里真的用了 and 和 or（本课要点）" }
    ],
    reference: "年龄 = 20\n有身份证 = True\nif 年龄 >= 18 and 有身份证:\n    print('可以上网')\n是会员 = False\n订单金额 = 120\nif 是会员 or 订单金额 >= 99:\n    print('免运费')",
    alts: [
      "if 20 >= 18 and True:\n    print('可以上网')\nif False or 120 >= 99:\n    print('免运费')",
      "年龄 = 20\n证件 = True\n放行 = 年龄 >= 18 and 证件\nif 放行:\n    print('可以上网')\n会员 = True\nif 会员 or 1 > 99:\n    print('免运费')",
      "年龄, 有身份证, 是会员, 金额 = 20, True, False, 100\nif 有身份证 and 年龄 >= 18:\n    print('可以上网')\nif 金额 >= 99 or 是会员:\n    print('免运费')"
    ],
    wrongs: [
      "",
      "print('可以上网')\nprint('免运费')",
      "年龄 = 20\nif 年龄 >= 18:\n    if True:\n        print('可以上网')\nif False:\n    print('免运费')\nelse:\n    print('免运费')",
      "年龄 = 20\n有身份证 = True\nif 年龄 >= 18 and 有身份证:\n    print('可以上网')",
      "if 年龄 >= 18 or True:\n    print('可以上网')\nprint('免运费')"
    ],
    loose: [
      "年龄=20\n有身份证=True\nif 年龄 >=18 and 有身份证 :\n      print( '可以上网' )\n是会员 = False\n金额 = 120\nif 是会员 or 金额>=99:\n    print('免运费')\n",
      "\nif 20 >= 18 and True:\n    print('可以上网')\n\nif False or 120 >= 99:\n    print('免运费')\n"
    ]
  },

  {
    cid: "l28",
    title: "第 28 课考试 · 列表：索引、负索引、切片",
    task: "把五门课成绩 90、80、70、60、50 装进一个列表，四行打印：第 1 项 / 最后 1 项（用负索引）/ 前三项的切片 / 一共几项。屏幕依次是 90、50、[90, 80, 70]、5",
    hint: "编号从 0 起，倒数从 -1 起；切片含头不含尾。回看【演示 2】【演示 4】。",
    starter: "成绩 = [90, 80, 70, 60, 50]\n",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "90\n50\n[90, 80, 70]\n5", weight: 45, label: "四行依次是 90 / 50 / [90, 80, 70] / 5" },
      { id: "lst", type: "ast", uses: ["list", "slice"], weight: 45, label: "东西真的装在列表里，并且用了切片（本课要点）" }
    ],
    reference: "成绩 = [90, 80, 70, 60, 50]\nprint(成绩[0])\nprint(成绩[-1])\nprint(成绩[0:3])\nprint(len(成绩))",
    alts: [
      "成绩 = [90, 80, 70, 60, 50]\nprint(成绩[0])\nprint(成绩[len(成绩) - 1])\nprint(成绩[:3])\nprint(len(成绩))",
      "五门 = [90, 80, 70, 60, 50]\nprint(五门[0])\nprint(五门[-1])\nprint(五门[0:3])\nprint(len(五门))",
      "成绩 = [90, 80, 70, 60, 50]\nprint(成绩[0], end='')\nprint()\nprint(成绩[-1])\nprint(成绩[0:3])\nprint(len(成绩))"
    ],
    wrongs: [
      "",
      "print(90)\nprint(50)\nprint('[90, 80, 70]')\nprint(5)",
      "成绩 = [90, 80, 70, 60, 50]\nprint(成绩[0])\nprint(成绩[4])\nprint(成绩[0])\nprint(成绩[1])\nprint(成绩[2])\nprint(len(成绩))",
      "成绩 = '90 80 70 60 50'\nprint(成绩[0:2])"
    ],
    loose: [
      "成绩=[90,80,70,60,50]\nprint( 成绩[0] )\nprint(成绩[ -1 ])\nprint(成绩[ 0 : 3 ])\nprint( len( 成绩 ) )\n",
      "\n成绩 = [90, 80, 70, 60, 50]\n\nprint(成绩[0])\nprint(成绩[-1])\nprint(成绩[:3])\nprint(len(成绩))\n"
    ]
  },

  {
    cid: "l29",
    title: "第 29 课考试 · 清单的增与删",
    task: "清单 = ['买柠檬', '交房租', '写教程']：用 append 加一项「喂喵」，用 insert 把「打卡」放到最前面，打印整张清单；再用 pop 删掉最后一项并把拿下来的那件打印出来。屏幕依次是 ['打卡', '买柠檬', '交房租', '写教程', '喂喵'] 和 喂喵",
    hint: "三个动作各有各的写法，insert 的第一个格子是 0。谁返回 None、谁把东西还给你，【演示 3】里说得很清楚。回看【演示 2】【演示 3】。",
    starter: "清单 = ['买柠檬', '交房租', '写教程']\n",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "['打卡', '买柠檬', '交房租', '写教程', '喂喵']\n喂喵", weight: 45, label: "两行依次是那串清单（顺序要对）和 喂喵" },
      { id: "pop", type: "called", name: "pop", min: 1, weight: 45, label: "最后那件是用 pop 取下来的（本课要点：改本体的方法都还你 None，只有 pop 还你元素）" }
    ],
    reference: "清单 = ['买柠檬', '交房租', '写教程']\n清单.append('喂喵')\n清单.insert(0, '打卡')\nprint(清单)\nprint(清单.pop())",
    alts: [
      "清单 = ['买柠檬', '交房租', '写教程']\n清单.append('喂喵')\n清单.insert(0, '打卡')\nprint(清单)\n最后 = 清单.pop()\nprint(最后)",
      "待办 = ['买柠檬', '交房租', '写教程']\n待办.append(\"喂喵\")\n待办.insert(0, '打卡')\nprint(待办)\nprint(待办.pop())",
      "清单 = ['买柠檬', '交房租', '写教程']\nfor 加 in ['喂喵']:\n    清单.append(加)\n清单.insert(0, '打卡')\nprint(清单)\nprint(清单.pop())"
    ],
    wrongs: [
      "",
      "print(\"['打卡', '买柠檬', '交房租', '写教程', '喂喵']\")\nprint('喂喵')",
      "清单 = ['买柠檬', '交房租', '写教程']\n清单 = ['打卡'] + 清单 + ['喂喵']\nprint(清单)\nprint('喂喵')",
      "清单 = ['买柠檬', '交房租', '写教程']\n清单.append('喂喵')\n清单.append('打卡')\nprint(清单)\nprint(清单.pop())",
      "清单 = ['买柠檬', '交房租', '写教程']\n清单.append('喂喵')\n清单.insert(0, '打卡')\nprint(清单)\n清单.remove('喂喵')\nprint('喂喵')"
    ],
    loose: [
      "清单=['买柠檬','交房租','写教程']\n清单 . append( '喂喵' )\n清单.insert( 0 , '打卡' )\nprint(清单)\nprint( 清单.pop() )\n",
      "\n清单 = ['买柠檬', '交房租', '写教程']\n\n清单.append('喂喵')\n清单.insert(0, '打卡')\nprint(清单)\nprint(清单.pop())\n"
    ]
  },

  {
    cid: "l30",
    title: "第 30 课考试 · 元组与解包",
    task: "今天三餐价格 12、25、18 装进一个元组：打印这个元组、它的长度、第 2 项；再用一行把它们解包给 早、午、晚 三个名字并打印 早 和 晚（一行两个数：12 18）。屏幕四行依次是 (12, 25, 18) / 3 / 25 / 12 18",
    hint: "元组是「不许改」的那份清单，单元素才需要那个逗号。解包就是右边吐元素、左边接。回看【演示 1】【演示 5】。",
    starter: "三餐 = ",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "(12, 25, 18)\n3\n25\n12 18", weight: 45, label: "四行依次是 (12, 25, 18) / 3 / 25 / 12 18" },
      { id: "tup", type: "ast", uses: ["tup", "unpack"], weight: 45, label: "用的是元组，并且真做了一次解包（本课要点）" }
    ],
    reference: "三餐 = (12, 25, 18)\nprint(三餐)\nprint(len(三餐))\nprint(三餐[1])\n早, 午, 晚 = 三餐\nprint(早, 晚)",
    alts: [
      "print((12, 25, 18))\nprint(len((12, 25, 18)))\nprint((12, 25, 18)[1])\n(早, 午, 晚) = (12, 25, 18)\nprint(早, 晚)",
      "三餐 = 12, 25, 18\nprint(三餐)\nprint(len(三餐))\nprint(三餐[1])\n早, 中, 晚 = 三餐\nprint(早, 晚)",
      "价 = (12, 25, 18)\nprint(价)\nprint(价.__len__() if False else len(价))\nprint(价[-2])\n早, 午, 晚 = 价\nprint(早, 晚)"
    ],
    wrongs: [
      "",
      "print('[12, 25, 18]')\nprint(3)\nprint(25)\nprint(12, 18)",
      "三餐 = [12, 25, 18]\nprint(三餐)\nprint(len(三餐))\nprint(三餐[1])\n早, 午, 晚 = 三餐\nprint(早, 晚)",
      "三餐 = (12, 25, 18)\nprint(三餐)\nprint(len(三餐))\nprint(三餐[1])\nprint(12, 18)",
      "三餐 = (12, 25, 18)\n早 = 三餐[0]\n晚 = 三餐[2]\nprint(三餐)\nprint(3)\nprint(25)\nprint(早, 晚)"
    ],
    loose: [
      "三餐=(12,25,18)\nprint( 三餐 )\nprint(len( 三餐 ))\nprint(三餐[1])\n早,午,晚 =三餐\nprint(早 , 晚)\n",
      "\n三餐 = (12, 25, 18)\n\nprint(三餐)\nprint(len(三餐))\nprint(三餐[1])\n早, 午, 晚 = 三餐\nprint(早, 晚)\n"
    ]
  },

  {
    cid: "l31",
    title: "第 31 课考试 · 字典与 get",
    task: "建一个字典：柠檬 8 元、冰阔落 5 元。打印「柠檬」的价格；再用 get 查一个不存在的东西「时光机」，取不到就给 0 并打印出来。屏幕两行依次是 8 和 0，全程不许出红字。",
    hint: "字典是「名字 → 东西」的查号表。硬取取不到会怎样，和 get 有什么区别，【演示 3】里那两个结局自己分一下。回看【演示 1】【演示 3】。",
    starter: "价格 = \n",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有 KeyError 之类的红字报错" },
      { id: "text", type: "stdout-equals", text: "8\n0", weight: 45, label: "两行依次是 8 和 0" },
      { id: "dic", type: "ast", uses: ["dict"], weight: 25, label: "东西真的存在字典里（不是两个平行列表）" },
      { id: "get", type: "called", name: "get", min: 1, weight: 20, label: "查不到的那次用的是 get" }
    ],
    reference: "价格 = {'柠檬': 8, '冰阔落': 5}\nprint(价格['柠檬'])\nprint(价格.get('时光机', 0))",
    alts: [
      "价格 = {\"柠檬\": 8, \"冰阔落\": 5}\n蛋 = 价格['柠檬']\nprint(蛋)\nprint(价格.get('时光机', 0))",
      "菜单 = {'冰阔落': 5, '柠檬': 8}\nprint(菜单['柠檬'])\n没有 = 菜单.get('时光机')\nprint(没有 if 没有 != None else 0)",
      "价格 = {}\n价格['柠檬'] = 8\n价格['冰阔落'] = 5\nprint(价格['柠檬'])\nprint(价格.get('时光机', 0))"
    ],
    wrongs: [
      "",
      "print(8)\nprint(0)",
      "价格 = {'柠檬': 8, '冰阔落': 5}\nprint(价格['柠檬'])\nprint(价格['时光机'])",
      "名字 = ['柠檬', '冰阔落']\n数 = [8, 5]\nprint(数[0])\nprint(0)",
      "价格 = {'柠檬': 8, '冰阔落': 5}\nprint(价格.get('柠檬'))\nprint(价格.get('时光机'))"
    ],
    loose: [
      "价格={'柠檬':8,'冰阔落':5}\nprint( 价格['柠檬'] )\nprint(价格 . get( '时光机' , 0 ))\n",
      "\n价格 = {\n    '柠檬': 8,\n    '冰阔落': 5,\n}\nprint(价格['柠檬'])\nprint(价格.get('时光机', 0))\n"
    ]
  }

);
