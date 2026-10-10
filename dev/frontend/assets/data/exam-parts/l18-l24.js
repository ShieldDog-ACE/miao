/* 喵站 · Python 课末考试 · l18–l24（第 18 到 24 课）
 * 契约见 ../py-exam-data.js 文件头；判分实现在 ../../frontend/assets/js/exam-grade.js。
 * 权重规矩：合计 100；地板项（run-ok / no-error / lines-at-least）≤45；本课特征项 ≥45。
 * 这批统一用 5 + 5 + 45 + 45：少任何一项都停在 55，过不去；多打空格、换行、缩进风格一律不扣。
 */
window.MIAO_PY_EXAM_PARTS = window.MIAO_PY_EXAM_PARTS || [];
window.MIAO_PY_EXAM_PARTS.push(

  {
    cid: "l18",
    title: "第 18 课考试 · bool：空就假，有就真",
    task: "把 '老张'、0.0、[0, 0, 0]、''、None 这五样东西各问一遍真不真，用一条 print 打成一行：True False True False False",
    hint: "别背顺序，想规则：空才假。注意那三个「里面明明装着东西」的，还有那串六个字符的文本。回看【演示 2】。",
    starter: "print(",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "bool", type: "called", name: "bool", min: 5, weight: 45, label: "五样东西真是各问过一遍 bool()（不是把真假抄成文本）" },
      { id: "text", type: "stdout-equals", text: "True False True False False", weight: 45, label: "屏幕上正是这一行真真假假" }
    ],
    reference: "print(bool('老张'), bool(0.0), bool([0, 0, 0]), bool(''), bool(None))",
    alts: [
      "甲 = bool('老张')\n乙 = bool(0.0)\n丙 = bool([0, 0, 0])\n丁 = bool('')\n戊 = bool(None)\nprint(甲, 乙, 丙, 丁, 戊)",
      "print(bool(\"老张\"), bool(0), bool([0, 0, 0]), bool(''), bool(None))",
      "待办 = bool([0, 0, 0])\n空文本 = bool('')\nprint(bool('老张'), bool(0.0), 待办, 空文本, bool(None))"
    ],
    wrongs: [
      "",
      "print(True, False, True, False, False)",
      "print(bool('老张'), bool(0.0), bool([0, 0, 0]), bool(''))",
      "print(bool('老张'), bool(0.0), bool([0, 0, 0]), bool('False'), bool(None))",
      "print('True False True False False')"
    ],
    loose: [
      "print( bool('老张') , bool(0.0) , bool([0,0,0]) , bool('') , bool(None) )",
      "print(bool('老张'), bool(0.0), bool([0, 0, 0]), bool(''), bool(None))\n",
      "\n\nprint(  bool('老张'),bool(0.0),bool([0, 0, 0]),bool(''),bool(None)  )   "
    ]
  },

  {
    cid: "l19",
    title: "第 19 课考试 · None 这张空牌",
    task: "打印三行：第一行是 None 本身，第二行是 None 的类型（<class 'NoneType'>），第三行把两个判断打成一排——None is None 和 None == 0，也就是 True False",
    hint: "那张空牌是它自己那个类型里的独一份；它跟 0 谁都不像谁。类型这东西只能现场问出来。回看【演示 1】【演示 2】。",
    starter: "print(",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "type", type: "called", name: "type", min: 1, weight: 45, label: "类型是用 type() 问出来的（不是抄下来的一串字符）" },
      { id: "text", type: "stdout-equals", text: "None\n<class 'NoneType'>\nTrue False", weight: 45, label: "屏幕上正好是这三行" }
    ],
    reference: "print(None)\nprint(type(None))\nprint(None is None, None == 0)",
    alts: [
      "空牌 = None\nprint(空牌)\nprint(type(空牌))\nprint(空牌 is None, 空牌 == 0)",
      "print(None)\n类型 = type(None)\nprint(类型)\nprint(None is None, None == 0)",
      "print(None)\nprint(type(None))\n没值 = None\nprint(没值 is None, 没值 == 0)"
    ],
    wrongs: [
      "",
      "print(None)\nprint(\"<class 'NoneType'>\")\nprint(True, False)",
      "print(None)\nprint(type(None))",
      "print(None, type(None), None is None, None == 0)",
      "print(None == 0)\nprint(type(None))\nprint(None is None)"
    ],
    loose: [
      "print( None )\nprint( type( None ) )\nprint( None is None , None == 0 )",
      "print(None)\nprint(type(None))\nprint(None is None, None == 0)\n",
      "\n空牌=None\nprint( 空牌 )\nprint(type(空牌))\nprint(空牌 is None,空牌 == 0)   "
    ]
  },

  {
    cid: "l20",
    title: "第 20 课考试 · // 和 % 把秒换算成时分秒",
    task: "收银机记下的营业时长是 3725 秒。先把这个数存进一个变量（名字随你起），再用 // 和 % 换算成几小时几分几秒，打印一行：1 小时 2 分 5 秒",
    hint: "先取整圈，再把剩下的零头接着往下换算，两件事分别由一位运算符管；用错那位会拖出小数。输入的那个数别写死在句子里。回看【演示 4】。",
    starter: "print(",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "box", type: "ast", uses: ["assign"], weight: 45, label: "秒数先存进了变量，数是拿变量算出来的" },
      { id: "text", type: "stdout-equals", text: "1 小时 2 分 5 秒", weight: 45, label: "换算结果正是这一行" }
    ],
    reference: "总秒数 = 3725\nprint(总秒数 // 3600, '小时', (总秒数 % 3600) // 60, '分', 总秒数 % 60, '秒')",
    alts: [
      "总秒数 = 3725\n小时 = 总秒数 // 3600\n分钟 = (总秒数 % 3600) // 60\n秒 = 总秒数 % 60\nprint(f'{小时} 小时 {分钟} 分 {秒} 秒')",
      "秒数 = 3725\n时 = 秒数 // 3600\n分 = (秒数 - 时 * 3600) // 60\n零头 = 秒数 % 60\nprint(时, '小时', 分, '分', 零头, '秒')",
      "营业 = 3725\nprint(str(营业 // 3600) + ' 小时 ' + str((营业 % 3600) // 60) + ' 分 ' + str(营业 % 60) + ' 秒')"
    ],
    wrongs: [
      "",
      "print('1 小时 2 分 5 秒')",
      "print(3725 // 3600, '小时', (3725 % 3600) // 60, '分', 3725 % 60, '秒')",
      "总秒数 = 3725\nprint(总秒数 // 3600, '小时', 总秒数 % 3600, '分', 总秒数 % 60, '秒')",
      "总秒数 = 3725\nprint(总秒数 / 3600, '小时')"
    ],
    loose: [
      "总秒数=3725\nprint( 总秒数//3600 , '小时' , (总秒数%3600)//60 , '分' , 总秒数%60 , '秒' )",
      "总秒数 = 3725\n\n小时 = 总秒数 // 3600\n分钟 = (总秒数 % 3600) // 60\n秒 = 总秒数 % 60\n\nprint(f'{小时} 小时 {分钟} 分 {秒} 秒')\n"
    ]
  },

  {
    cid: "l21",
    title: "第 21 课考试 · isinstance 认家族",
    task: "用 isinstance 挨个问 '3'、3、3.0 这三个值是不是数字（整数和小数都算数字），把三个判断结果用一条 print 打成一行：False True True",
    hint: "问本名和认家族是两码事；「数字」这门亲跨了好几户人家，一次可以问一整族。回看【演示 3】。",
    starter: "print(",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "isinstance", type: "called", name: "isinstance", min: 3, weight: 45, label: "三个值各问过一遍 isinstance()（不是把 True/False 抄成文本）" },
      { id: "text", type: "stdout-equals", text: "False True True", weight: 45, label: "屏幕上就是这一行 False True True" }
    ],
    reference: "print(isinstance('3', (int, float)), isinstance(3, (int, float)), isinstance(3.0, (int, float)))",
    alts: [
      "文字 = '3'\n整数 = 3\n小数 = 3.0\nprint(isinstance(文字, (int, float)), isinstance(整数, (int, float)), isinstance(小数, (int, float)))",
      "for 值 in ['3', 3, 3.0]:\n    print(isinstance(值, (int, float)), end=' ')",
      "for 值 in ['3', 3, 3.0]:\n  print(isinstance(值, (int, float)), end=' ')\nprint()"
    ],
    wrongs: [
      "",
      "print(False, True, True)",
      "print(isinstance('3', int), isinstance(3, int), isinstance(3.0, int))",
      "print(type('3') is str, type(3) is int, type(3.0) is float)",
      "print(isinstance('3', (int, float)), isinstance(3, (int, float)))"
    ],
    loose: [
      "print( isinstance('3',(int,float)) , isinstance(3,(int,float)) , isinstance(3.0,(int,float)) )",
      "print(isinstance('3', (int, float)), isinstance(3, (int, float)), isinstance(3.0, (int, float)))\n",
      "for 值 in ['3',3,3.0]:\n        print(isinstance(值,(int,float)),end=' ')\n"
    ]
  },

  {
    cid: "l22",
    title: "第 22 课考试 · 把文本换成数",
    task: "货架标签上的单价是一串文本 '12.5'。先把它换成能算数的数，再算出买 3 件要多少钱，打印一行：3 件共 37.5 元",
    hint: "这串文本里带小数点，【演示 2】那条路在这儿走不通；换类型有时得连着走两步，半路取整就丢钱了。回看【演示 3】。",
    starter: "单价 = ",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "float", type: "called", name: "float", min: 1, weight: 45, label: "真的做了一次文本换数（带小数点的那种换法）" },
      { id: "text", type: "stdout-equals", text: "3 件共 37.5 元", weight: 45, label: "打印出来的是算出来的价钱" }
    ],
    reference: "单价 = float('12.5')\nprint(f'3 件共 {单价 * 3} 元')",
    alts: [
      "单价 = float('12.5')\n总价 = 单价 * 3\nprint('3 件共 ' + str(总价) + ' 元')",
      "print('3 件共 ' + str(float('12.5') * 3) + ' 元')",
      "文字价格 = '12.5'\n总价 = float(文字价格) + float(文字价格) + float(文字价格)\nprint(f'3 件共 {总价} 元')"
    ],
    wrongs: [
      "",
      "print('3 件共 37.5 元')",
      "单价 = int('12.5')\nprint(f'3 件共 {单价 * 3} 元')",
      "单价 = '12.5'\nprint(f'3 件共 {单价 * 3} 元')",
      "单价 = int(float('12.5'))\nprint(f'3 件共 {单价 * 3} 元')"
    ],
    loose: [
      "单价  =  float( '12.5' )\nprint( f'3 件共 {单价 * 3} 元' )",
      "单价 = float('12.5')\n\n总价 = 单价 * 3\n\nprint(f'3 件共 {总价} 元')\n"
    ]
  },

  {
    cid: "l23",
    title: "第 23 课考试 · 两次 input 读两行",
    task: "问两句：先问昵称，再问今天写了多少行代码（模拟输入里给的两行是：柠檬 / 120）。把读到的内容拼成一句话打印出来，照这个样子：柠檬 今天写了 120 行",
    hint: "两次 input 各吃掉一行；敲进去的数到手也还是文本，拼接就好，别急着算。提示语想写就写，输出那一句话照样子。回看【演示 4】【演示 5】。",
    starter: "昵称 = input(",
    stdin: ["柠檬", "120"],
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "input", type: "called", name: "input", min: 2, weight: 45, label: "真的读了两行输入（不是一句现成的话）" },
      { id: "line", type: "stdout-regex", pattern: "柠檬\\s*今天写了\\s*120\\s*行", weight: 45, label: "读到的两行被拼成那句完整的话" }
    ],
    reference: "昵称 = input('你的昵称：')\n行数 = input('今天写了多少行代码：')\nprint(f'{昵称} 今天写了 {行数} 行')",
    alts: [
      "a = input()\nb = input()\nprint(a, '今天写了', b, '行')",
      "print(input() + ' 今天写了 ' + input() + ' 行')",
      "昵称 = input()\n行数 = int(input())\nprint(f'{昵称} 今天写了 {行数} 行')",
      "昵称 = input('昵称：')\n行数 = input('行数：')\nprint(昵称 + ' 今天写了 ' + 行数 + ' 行代码')"
    ],
    wrongs: [
      "",
      "print('柠檬 今天写了 120 行')",
      "昵称 = input()\nprint(f'{昵称} 今天写了 120 行')",
      "昵称 = input()\n行数 = input()\nprint(昵称)\nprint(行数)",
      "行数 = input()\nprint(f'柠檬 今天写了 {行数} 行')"
    ],
    loose: [
      "昵称  =  input( '你的昵称：' )\n行数 =  input( '今天写了多少行代码：' )\nprint( f'{昵称} 今天写了 {行数} 行' )",
      "\n\n昵称 = input()\n行数 = input()\nprint(f'{昵称} 今天写了 {行数} 行')   \n",
      "昵称 = input()\n行数 = input()\n\nprint( 昵称 + '今天写了' + 行数 + '行' )"
    ]
  },

  {
    cid: "l24",
    title: "第 24 课考试 · 读入 → 转换 → 计算 → 输出",
    task: "进货要现场录：模拟输入里给的两行，第一行是单价 8.5（带小数点），第二行是数量 4。读进来、换成能算数的数、算出总价，打印一行，照这个样子：总价 34 元（模拟输入里那两行别改）",
    hint: "四步一步都别跳：到手的一律是文本，带小数点的那行按整数去读直接翻车；最后打出来的是算完的数，不是把输入原样吐回去。回看【演示 1】【演示 4】。",
    starter: "单价 = input(",
    stdin: ["8.5", "4"],
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "input", type: "called", name: "input", min: 2, weight: 45, label: "单价和数量真是各读了一行" },
      { id: "line", type: "stdout-regex", pattern: "总价\\D{0,6}34(\\.0+)?\\s*元", weight: 45, label: "打印的是算出来的总价（34 元或 34.0 元都算对）" }
    ],
    reference: "单价 = float(input('单价：'))\n数量 = float(input('数量：'))\nprint(f'总价 {单价 * 数量} 元')",
    alts: [
      "单价 = float(input())\n数量 = int(input())\n总价 = 单价 * 数量\nprint('总价', 总价, '元')",
      "单价 = float(input())\n数量 = float(input())\nprint('总价 ' + str(单价 * 数量) + ' 元')",
      "单价 = float(input('单价：'))\n数量 = float(input('数量：'))\nprint(f'总价 {单价 * 数量:.1f} 元')"
    ],
    wrongs: [
      "",
      "print('总价 34 元')",
      "单价 = input()\n数量 = input()\nprint(f'总价 {单价}{数量} 元')",
      "单价 = int(input())\n数量 = int(input())\nprint(f'总价 {单价 * 数量} 元')",
      "单价 = float(input())\n数量 = float(input())\nprint(f'总价 {单价 + 数量} 元')",
      "单价 = float(input())\nprint(f'总价 {单价 * 4} 元')"
    ],
    loose: [
      "单价  =  float( input( '单价：' ) )\n数量 = float( input( '数量：' ) )\nprint( f'总价 {单价 * 数量} 元' )",
      "单价 = float(input())\n数量 = float(input())\n\n总价 = 单价 * 数量\n\nprint('总价 ' + str(总价) + ' 元')\n",
      "单价 = float(input())\n数量 = float(input())\nprint(f'总价   {单价 * 数量}   元')\n"
    ]
  }

);
