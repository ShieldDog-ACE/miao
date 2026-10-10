/* 喵站 · Python 课末考试 · l11–l17（第 11 到 17 课）
 * 契约见 ../py-exam-data.js 文件头；判分实现在 ../../frontend/assets/js/exam-grade.js。
 * 权重规矩：合计 100；地板项（run-ok / no-error / lines-at-least）≤45；本课特征项 ≥45。
 */
window.MIAO_PY_EXAM_PARTS = window.MIAO_PY_EXAM_PARTS || [];
window.MIAO_PY_EXAM_PARTS.push(

  {
    cid: "l11",
    title: "第 11 课考试 · 重新赋值：同一个名字换对象",
    task: "只用一个名字 库存 记账：先存 50 打印一行，再改成 200 打印一行，最后把它改成一个文本 缺货 再打印一行。屏幕上依次是 50 / 200 / 缺货",
    hint: "同一个名字可以再贴一次，后贴的说了算；最后那一步存进去的不是数，是一段文本。回看【演示 1】【演示 2】。",
    starter: "库存 = ",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "50\n200\n缺货", weight: 45, label: "屏幕上依次是这三行" },
      { id: "rebind", type: "var", name: "库存", equals: "缺货", weight: 45, label: "名字 库存 最后真的换成了一个文本（本课要点：换标签不换盒子）" }
    ],
    reference: "库存 = 50\nprint(库存)\n库存 = 200\nprint(库存)\n库存 = '缺货'\nprint(库存)",
    alts: [
      "库存 = 50\nprint(库存)\n库存 += 150\nprint(库存)\n库存 = '缺货'\nprint(库存)",
      "库存 = 50; print(库存); 库存 = 200; print(库存); 库存 = '缺货'; print(库存)",
      "库存 = 50\nprint(库存)\n库存 = 200\nprint(库存)\n库存 = \"缺货\"\nprint(库存)"
    ],
    wrongs: [
      "",
      "print(50)\nprint(200)\nprint('缺货')",
      "库存 = 50\n库存2 = 200\nprint(库存)\nprint(库存2)\nprint('缺货')",
      "库存 = 50\nprint(库存)\n库存 = 200\nprint(库存)",
      "库存 = 50\nprint(库存)\n库存 = 200\nprint(库存)\n库存 = 0\nprint(库存)"
    ],
    loose: [
      "库存=50\nprint( 库存 )\n库存 = 200\nprint(库存)\n\n库存 = '缺货'\nprint(库存)\n",
      "库存 = 50\n\nprint(库存)\n库存 = 200\nprint( 库存 )\n库存 = '缺货'\nprint( 库存 )"
    ]
  },

  {
    cid: "l12",
    title: "第 12 课考试 · 名字体检：isidentifier",
    task: "给四个名字 a1、_库存、2b、分数！ 挨个做命名体检，把四个结果打在同一行，顺序照这里：True True False False",
    hint: "名字得先变成一个字符串对象才谈得上合不合法；带标点的那个为什么过不了切词这一关，想不通就回看【演示 2】。",
    starter: "print(",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "True True False False", weight: 45, label: "四个结果按顺序是 True True False False" },
      { id: "chk", type: "called", name: "isidentifier", min: 4, weight: 45, label: "四个结论都真的是 isidentifier() 问出来的（不是抄答案）" }
    ],
    reference: "print('a1'.isidentifier(), '_库存'.isidentifier(), '2b'.isidentifier(), '分数！'.isidentifier())",
    alts: [
      "甲 = 'a1'\n乙 = '_库存'\n丙 = '2b'\n丁 = '分数！'\nprint(甲.isidentifier(), 乙.isidentifier(), 丙.isidentifier(), 丁.isidentifier())",
      "for 名字 in ['a1', '_库存', '2b', '分数！']:\n    print(名字.isidentifier(), end=' ')",
      "print('a1'.isidentifier(), end=' ')\nprint('_库存'.isidentifier(), end=' ')\nprint('2b'.isidentifier(), end=' ')\nprint('分数！'.isidentifier())"
    ],
    wrongs: [
      "",
      "print('True True False False')",
      "print(True, True, False, False)",
      "print(True, True, '2b'.isidentifier(), False)",
      "print('a1', '2b'.isidentifier())",
      "print('a1'.isidentifier(), '2b'.isidentifier())"
    ],
    loose: [
      "print( 'a1'.isidentifier() , '_库存'.isidentifier() , '2b'.isidentifier() , '分数！'.isidentifier() )\n",
      "甲 = 'a1'\n乙 = '_库存'\n丙 = '2b'\n丁 = '分数！'\n\nprint( 甲.isidentifier() ,乙.isidentifier() , 丙.isidentifier() , 丁.isidentifier() )\n\n"
    ]
  },

  {
    cid: "l13",
    title: "第 13 课考试 · f-string：花括号里放算式",
    task: "单价 8 元、数量 3 个：用一条 f-string 打出「买 3 个，每个 8 元，共 24 元」，其中 24 要由花括号里的算式得出。",
    hint: "三条路里只有这一条能把算式写在句子中间。先想清楚 24 该在谁的肚子里算出来。回看【演示 4】。",
    starter: "单价 = 8\n数量 = 3\nprint(",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "买 3 个，每个 8 元，共 24 元", weight: 45, label: "屏幕上就是这一行" },
      { id: "fstr", type: "ast", uses: ["fstr"], weight: 45, label: "用的是 f-string（本课三条路里的第三条）" }
    ],
    reference: "单价 = 8\n数量 = 3\nprint(f'买 {数量} 个，每个 {单价} 元，共 {单价 * 数量} 元')",
    alts: [
      "print(f\"买 {3} 个，每个 {8} 元，共 {8 * 3} 元\")",
      "蛋 = 8\n个 = 3\nprint(f'买 {个} 个，每个 {蛋} 元，共 {个 * 蛋} 元')",
      "单价 = 8\n数量 = 3\nprint(f'买 {数量} 个，每个 {单价} 元，共 {单价 * 数量} 元', sep='')"
    ],
    wrongs: [
      "",
      "print('买 3 个，每个 8 元，共 24 元')",
      "单价 = 8\n数量 = 3\nprint('买', 数量, '个，每个', 单价, '元，共', 单价 * 数量, '元')",
      "单价 = 8\n数量 = 3\nprint('买 ' + str(数量) + ' 个，每个 ' + str(单价) + ' 元，共 ' + str(单价 * 数量) + ' 元')",
      "print(f'买 {数量} 个，每个 {单价} 元，共 {单价} 元')"
    ],
    loose: [
      "单价 = 8\n数量 = 3\nprint( f'买 {数量} 个，每个 {单价} 元，共 {单价*数量} 元' )",
      "单价=8\n数量=3\nprint(f'买 {数量} 个，每个 {单价} 元，共 {单价 * 数量} 元')\n\n"
    ]
  },

  {
    cid: "l14",
    title: "第 14 课考试 · 一行解包三个名字",
    task: "只写一行赋值，把三个价钱 9、12、5 分别交给 早餐、午餐、晚餐，再用一条 print 打成一行：9 12 5",
    hint: "右边先整个算出来，再按顺序一个个发给左边；不许写三次 =。回看【演示 1】。",
    starter: "早餐, ",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "9 12 5", weight: 45, label: "输出是 9 12 5" },
      { id: "unpack", type: "ast", uses: ["unpack"], weight: 45, label: "一行解包赋值（左边一排名字接右边的元素）" }
    ],
    reference: "早餐, 午餐, 晚餐 = 9, 12, 5\nprint(早餐, 午餐, 晚餐)",
    alts: [
      "(早餐, 午餐, 晚餐) = (9, 12, 5)\nprint(早餐, 午餐, 晚餐)",
      "三个数 = [9, 12, 5]\n早餐, 午餐, 晚餐 = 三个数\nprint(早餐, 午餐, 晚餐)"
    ],
    wrongs: [
      "",
      "早餐 = 9\n午餐 = 12\n晚餐 = 5\nprint(早餐, 午餐, 晚餐)",
      "print(9, 12, 5)",
      "早餐, 午餐 = 9, 12, 5\nprint(早餐, 午餐)",
      "早餐, 午餐, 晚餐 = 9, 12, 5\nprint(早餐)\nprint(午餐)\nprint(晚餐)"
    ],
    loose: [
      "早餐,午餐,晚餐=9,12,5\nprint( 早餐 ,午餐 , 晚餐 )",
      "(早餐, 午餐, 晚餐) = 9, 12, 5\nprint(早餐, 午餐, 晚餐)\n\n"
    ]
  },

  {
    cid: "l15",
    title: "第 15 课考试 · 给人看的 # 注释",
    task: "打印两行公告：柠檬便利店 / 营业时间 09:00-21:00，并给这两行各配一条 # 注释，说清它是干什么用的。",
    hint: "注释是给人看的，机器在流水线第一站就把它扔了；引号里的 # 只是普通字符，独占一行的字符串也不算。回看【演示 1】【演示 3】。",
    starter: "# ",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "柠檬便利店\n营业时间 09:00-21:00", weight: 35, label: "两行公告原样打出来" },
      { id: "cmt", type: "source-has-comment", min: 2, weight: 45, label: "源码里有两条真注释（引号里的 # 不算）" },
      { id: "printed", type: "print-calls", min: 2, weight: 10, label: "两行都用 print 打出来的" }
    ],
    reference: "# 店名：招牌上那一行\nprint('柠檬便利店')\n# 营业时间：店长老张定的\nprint('营业时间 09:00-21:00')",
    alts: [
      "print('柠檬便利店')  # 第一行公告\nprint('营业时间 09:00-21:00')  # 第二行公告",
      "# 公告来自第 8 课那块文本\n# 两行一起打\nprint('柠檬便利店')\nprint('营业时间 09:00-21:00')",
      "公告 = '柠檬便利店'\n# 时间改了要记得回来改这行\nprint(公告)\nprint('营业时间 09:00-21:00')  # 早上九点开张"
    ],
    wrongs: [
      "",
      "print('柠檬便利店')\nprint('营业时间 09:00-21:00')",
      "# 只有一条注释\nprint('柠檬便利店')\nprint('营业时间 09:00-21:00')",
      "print('# 柠檬便利店')\nprint('# 营业时间 09:00-21:00')",
      "'''这行算注释吗'''\nprint('柠檬便利店')\nprint('营业时间 09:00-21:00')"
    ],
    loose: [
      "#   店名\nprint( '柠檬便利店' )\n\n#   营业时间\nprint( '营业时间 09:00-21:00' )\n",
      "print('柠檬便利店')     #店名\nprint('营业时间 09:00-21:00')#时间\n\n"
    ]
  },

  {
    cid: "l16",
    title: "第 16 课考试 · 用 type() 验货五种类型",
    task: "拿 '柠檬'、666、3.14、True、None 五个值，用 type() 挨个验货，把五个干净的类型名打在同一行：str int float bool NoneType",
    hint: "type() 交回来的是一个类，直接打印会带上 <class ...> 的外壳；本课用的那个「名字」属性在演示 1 的第一段里。",
    starter: "print(",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "str int float bool NoneType", weight: 45, label: "五个类型名按顺序排好" },
      { id: "ty", type: "called", name: "type", min: 5, weight: 45, label: "五个值都真的过了 type() 的手（本课要点：类型是能力清单）" }
    ],
    reference: "文本 = '柠檬'\n整数 = 666\n小数 = 3.14\n真 = True\n空 = None\nprint(type(文本).__name__, type(整数).__name__, type(小数).__name__, type(真).__name__, type(空).__name__)",
    alts: [
      "print(type('柠檬').__name__, type(666).__name__, type(3.14).__name__, type(True).__name__, type(None).__name__)",
      "for 值 in ['柠檬', 666, 3.14, True, None]:\n    print(type(值).__name__, end=' ')",
      "五个 = ['柠檬', 666, 3.14, True, None]\nprint(type(五个[0]).__name__, type(五个[1]).__name__, type(五个[2]).__name__, type(五个[3]).__name__, type(五个[4]).__name__)"
    ],
    wrongs: [
      "",
      "print('str int float bool NoneType')",
      "print('str', 'int', 'float', 'bool', 'NoneType')",
      "print(type(666).__name__, type(3.14).__name__, type('柠檬').__name__, type(True).__name__, type(None).__name__)",
      "print(type('柠檬'), type(666), type(3.14), type(True), type(None))",
      "print(type('柠檬').__name__, type(666).__name__, type(3.14).__name__, 'bool', 'NoneType')"
    ],
    loose: [
      "print( type( '柠檬' ).__name__ , type( 666 ).__name__ , type( 3.14 ).__name__ , type( True ).__name__ , type( None ).__name__ )",
      "值1 = '柠檬'\n值2 = 666\n值3 = 3.14\n值4 = True\n值5 = None\n\n\nprint( type(值1).__name__ ,type(值2).__name__ , type( 值3 ).__name__ ,type(值4).__name__ , type(值5).__name__ )\n\n"
    ]
  },

  {
    cid: "l17",
    title: "第 17 课考试 · 算钱用「分」：整数不撒谎",
    task: "一颗柠檬 0.1 元，买 10 颗。全程用「分」当单位、只用整数算：写出每颗几分、买几颗，再把两者相乘得到总价 分，最后打两行 —— 第一行是 100，第二行是 分 == 100 的结果 True",
    hint: "别让 0.1 进加法，先把它换成分；总价是「每颗几分 × 买几颗」乘出来的，不是你心算好再抄上去的。回看【演示 6】，先想想浮点那条路为什么付不清。",
    starter: "每颗 = 10\n颗数 = 10\n分 = ",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "100\nTrue", weight: 40, label: "两行输出是 100 和 True" },
      { id: "vars", type: "assign-count", min: 3, weight: 45, label: "每颗几分、买几颗、总价各存一个名字（总价必须是乘出来的）" },
      { id: "cents", type: "var", name: "分", equals: 100, weight: 5, label: "分 最后存的是整数 100" }
    ],
    reference: "每颗 = 10\n颗数 = 10\n分 = 每颗 * 颗数\nprint(分)\nprint(分 == 100)",
    alts: [
      "每颗 = 10\n颗数 = 10\n分 = 每颗 * 颗数\nprint( 分 )\nprint(分==100)",
      "单价分 = 10\n数量 = 10\n分 = 单价分 * 数量\nprint(分)\nprint(分 == 100)"
    ],
    wrongs: [
      "",
      "print(100)\nprint(True)",
      "分 = 100\nprint(分)\nprint(分 == 100)",
      "账单 = 0.0\n账单 = 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1\nprint(账单)\nprint(账单 == 1.0)",
      "每颗 = 10\n颗数 = 9\n分 = 每颗 * 颗数\nprint(分)\nprint(分 == 100)"
    ],
    loose: [
      "每颗=10\n颗数=10\n分=每颗*颗数\nprint( 分 )\nprint(分==100)",
      "每颗 = 10\n\n颗数 = 10\n\n分 = 每颗 * 颗数   # 每颗十分，十颗才算完\n\nprint(分)\nprint(分 == 100)\n\n"
    ]
  }

);
