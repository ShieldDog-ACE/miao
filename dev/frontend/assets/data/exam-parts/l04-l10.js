/* 喵站 · Python 课末考试 · l04–l10（第 4 到 10 课）
 * 契约与检查项清单见 ../py-exam-data.js 的文件头注释；判分实现在 exam-grade.js。
 * 权重规矩：合计 100；地板项（run-ok / no-error）≤45；本课特征项 ≥45。
 */
window.MIAO_PY_EXAM_PARTS = window.MIAO_PY_EXAM_PARTS || [];
window.MIAO_PY_EXAM_PARTS.push(

  {
    cid: "l04",
    title: "第 4 课考试 · 用逗号分隔多个值",
    task: "用一条 print、三个被逗号隔开的值，打印出：柠檬便利店 09:00 老张推荐",
    hint: "逗号把括号里的东西切成一个个参数，中间那格空格是 print 自己送的，不用你写。回看【演示 1】。",
    starter: "print(",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "柠檬便利店 09:00 老张推荐", weight: 45, label: "屏幕上就是这一行" },
      { id: "comma", type: "ast", uses: ["multiarg"], weight: 45, label: "真的用逗号给了三个值（不是塞成一整句文本）" }
    ],
    reference: "print('柠檬便利店', '09:00', '老张推荐')",
    alts: [
      "店名 = '柠檬便利店'\n时间 = '09:00'\n招牌 = '老张推荐'\nprint(店名, 时间, 招牌)",
      "print(\"柠檬便利店\", \"09:00\", \"老张推荐\")"
    ],
    wrongs: [
      "print('柠檬便利店 09:00 老张推荐')",
      "print('柠檬便利店', '09:00')",
      "print('柠檬便利店', '09:00', '老张推荐', sep='-')"
    ],
    loose: [
      "print( '柠檬便利店' , '09:00' , '老张推荐' )",
      "print('柠檬便利店', '09:00', '老张推荐')\n"
    ]
  },

  {
    cid: "l05",
    title: "第 5 课考试 · sep",
    task: "用 sep=',' 把 张三、一班、88 打成一行 CSV：张三,一班,88",
    hint: "sep 是关键字参数，写它必须带上名字；它只出现在参数中间，次数永远比参数少一个。回看【演示 5】。",
    starter: "print(\n",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "张三,一班,88", weight: 45, label: "输出是张三,一班,88" },
      { id: "sep", type: "ast", uses: ["sep"], weight: 45, label: "分隔符是用 sep= 指定的（本课要点）" }
    ],
    reference: "print('张三', '一班', 88, sep=',')",
    alts: [
      "姓名 = '张三'\n班级 = '一班'\n分数 = 88\nprint(姓名, 班级, 分数, sep=',')",
      "print('张三','一班',88,sep=',')"
    ],
    wrongs: [
      "print('张三,一班,88')",
      "print('张三', '一班', 88)",
      "print('张三', '一班', sep=';')"
    ],
    loose: [
      "print( '张三' , '一班' , 88 , sep = ',' )",
      "print('张三', '一班', 88, sep=',')\n"
    ]
  },

  {
    cid: "l06",
    title: "第 6 课考试 · 换行符 \\n",
    task: "只调用一次 print，用 \\n 打出三行：柠檬便利店 / 地址：校门口 / 招牌：老张特供冰阔落",
    hint: "\\n 是一个字符，不是按回车。三行需要几个换行符？想清楚再动手。回看【演示 1】【演示 4】。",
    starter: "print(",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "柠檬便利店\n地址：校门口\n招牌：老张特供冰阔落", weight: 45, label: "屏幕上正好是这三行" },
      { id: "once", type: "print-calls", exactly: 1, weight: 30, label: "只调用了一次 print" },
      { id: "nl", type: "ast", uses: ["escnl"], weight: 15, label: "换行是写在字符串里的 \\n" }
    ],
    reference: "print('柠檬便利店\\n地址：校门口\\n招牌：老张特供冰阔落')",
    alts: [
      "块 = '柠檬便利店\\n地址：校门口\\n招牌：老张特供冰阔落'\nprint(块)",
      "print('柠檬便利店\\n地址：校门口\\n招牌：老张特供冰阔落', sep='')"
    ],
    wrongs: [
      "print('柠檬便利店')\nprint('地址：校门口')\nprint('招牌：老张特供冰阔落')",
      "print('柠檬便利店 地址：校门口 招牌：老张特供冰阔落')",
      "print('柠檬便利店\\n地址：校门口')"
    ],
    loose: [
      "print( '柠檬便利店\\n地址：校门口\\n招牌：老张特供冰阔落' )",
      "块='柠檬便利店\\n地址：校门口\\n招牌：老张特供冰阔落'\nprint(块)\n"
    ]
  },

  {
    cid: "l07",
    title: "第 7 课考试 · end",
    task: "用至少两次 print 打出同一行：老张和柠檬。不许用 +，也不许用 sep。",
    hint: "print 的尾巴由 end 决定，默认是换行符。谁负责收尾那一下，自己安排。回看【演示 1】【演示 3】。",
    starter: "print('老张', end=",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "老张和柠檬", weight: 40, label: "输出是一整行 老张和柠檬" },
      { id: "end", type: "ast", uses: ["endkw"], weight: 45, label: "结尾是用 end= 控制的（本课要点）" },
      { id: "twice", type: "print-calls", min: 2, weight: 5, label: "至少调了两次 print" }
    ],
    reference: "print('老张', end='')\nprint('和', end='')\nprint('柠檬')",
    alts: [
      "print('老张', end='和')\nprint('柠檬')",
      "print('老张', end='', sep='')\nprint('和柠檬')"
    ],
    wrongs: [
      "print('老张' + '和' + '柠檬')",
      "print('老张', '和', '柠檬', sep='')",
      "print('老张和柠檬')"
    ],
    loose: [
      "print( '老张' , end = '' )\nprint('和',end='')\nprint( '柠檬' )",
      "print('老张', end='')\nprint('和', end='')\nprint('柠檬')\n"
    ]
  },

  {
    cid: "l08",
    title: "第 8 课考试 · 一整块文本当一个数据",
    task: "用**一次** print 打出四行公告（一整块文本，里面自带换行）：柠檬便利店 / 营业 09:00-21:00 / 招牌 老张特供 / 谢谢惠顾",
    hint: "先想清楚：是四次调用打四行，还是一次调用打一块内含三格换行的文本。回看【演示 1】和【演示 4】。",
    starter: "print(",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "柠檬便利店\n营业 09:00-21:00\n招牌 老张特供\n谢谢惠顾", weight: 45, label: "四行公告原样打出来" },
      { id: "block", type: "ast", uses: ["escnl", "singlearg"], weight: 45, label: "一整块文本交给了一次 print（这才是本课的用法）" },
      { id: "print1", type: "print-calls", exactly: 1, weight: 0, label: "只调用了一次 print（装饰项：0 分，只反馈不卡人）" }
    ],
    reference: "print('柠檬便利店\\n营业 09:00-21:00\\n招牌 老张特供\\n谢谢惠顾')",
    alts: [
      "公告 = '''柠檬便利店\n营业 09:00-21:00\n招牌 老张特供\n谢谢惠顾'''\nprint(公告)",
      "店名 = '柠檬便利店'\n时间 = '营业 09:00-21:00'\n招牌 = '招牌 老张特供'\n公告 = 店名 + '\\n' + 时间 + '\\n' + 招牌 + '\\n' + '谢谢惠顾'\nprint(公告)"
    ],
    wrongs: [
      "print('柠檬便利店')\nprint('营业 09:00-21:00')\nprint('招牌 老张特供')\nprint('谢谢惠顾')",
      "print('柠檬便利店\\n营业 09:00-21:00\\n招牌 老张特供')",
      "公告 = '柠檬便利店 营业 09:00-21:00 招牌 老张特供 谢谢惠顾'\nprint(公告)"
    ],
    loose: [
      "公告='柠檬便利店\\n营业 09:00-21:00\\n招牌 老张特供\\n谢谢惠顾'\nprint( 公告 )",
      "公告 = '柠檬便利店\\n营业 09:00-21:00\\n招牌 老张特供\\n谢谢惠顾'\nprint(公告)\n"
    ]
  },

  {
    cid: "l09",
    title: "第 9 课考试 · 三引号",
    task: "用三引号写一张三行名片，**一次 print** 打出来：张三 / 爱吃：柠檬 / 口号：老张一生推（屏幕上不许多出空行）",
    hint: "三引号会把源码里的回车和缩进一并搬进内容里。第一行紧贴着写试试。回看【演示 2】和【常见坑】。",
    starter: "print('''",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "张三\n爱吃：柠檬\n口号：老张一生推", weight: 45, label: "输出正好这三行、不多空行" },
      { id: "tq", type: "ast", uses: ["tq"], weight: 45, label: "文本是用三引号写的（本课要点）" }
    ],
    reference: "print('''张三\n爱吃：柠檬\n口号：老张一生推''')",
    alts: [
      "print('''张三\n爱吃：柠檬\n口号：老张一生推''')",
      "名片 = \"\"\"张三\n爱吃：柠檬\n口号：老张一生推\"\"\"\nprint(名片)"
    ],
    wrongs: [
      "print('张三\\n爱吃：柠檬\\n口号：老张一生推')",
      "名片 = '''\n张三\n爱吃：柠檬\n口号：老张一生推\n'''\nprint(名片)"
    ],
    loose: [
      "名片='''张三\n爱吃：柠檬\n口号：老张一生推'''\nprint( 名片 )",
      "名片 = '''张三\n爱吃：柠檬\n口号：老张一生推'''\nprint(名片)\n"
    ]
  },

  {
    cid: "l10",
    title: "第 10 课考试 · 变量与值",
    task: "用三个变量分别存 小明、18、45（昵称 / 年龄 / 今天学了多久分钟），再用一条 print 的逗号形式打印出：小明 18 45",
    hint: "赋值就是贴标签。三个数字别写进同一句文本里，让它们各自是一个对象。回看【演示 1】【演示 4】。",
    starter: "昵称 = \n年龄 = \n分钟 = ",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "小明 18 45", weight: 40, label: "输出是 小明 18 45" },
      { id: "vars", type: "assign-count", min: 3, weight: 45, label: "三个值真的各存在一个变量里" },
      { id: "comma", type: "ast", uses: ["multiarg"], weight: 5, label: "打印用的是逗号分隔，不是一整句文本" }
    ],
    reference: "昵称 = '小明'\n年龄 = 18\n分钟 = 45\nprint(昵称, 年龄, 分钟)",
    alts: [
      "name = '小明'\nage = 18\nminutes = 45\nprint(name, age, minutes)",
      "小明 = '小明'; 岁 = 18; 分 = 45\nprint(小明, 岁, 分)"
    ],
    wrongs: [
      "print('小明 18 45')",
      "昵称 = '小明'\nprint(昵称, '18 45')",
      "print('小明', '18', '45')"
    ],
    loose: [
      "昵称='小明'\n年龄=18\n分钟=45\nprint( 昵称 ,年龄 , 分钟 )",
      "昵称 = '小明'\n年龄 = 18\n分钟 = 45\nprint(昵称, 年龄, 分钟)\n"
    ]
  }

);
