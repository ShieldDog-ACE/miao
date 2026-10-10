/* 喵站 · Python 课末考试 · l32–l38（第 32 到 38 课）
 * 契约见 ../py-exam-data.js 文件头；判分实现在 ../../frontend/assets/js/exam-grade.js。
 * 权重规矩：合计 100；地板项（run-ok / no-error / lines-at-least）≤45；本课特征项 ≥45。
 */
window.MIAO_PY_EXAM_PARTS = window.MIAO_PY_EXAM_PARTS || [];
window.MIAO_PY_EXAM_PARTS.push(

  {
    cid: "l32",
    title: "第 32 课考试 · for：自己挨个领出来加",
    task: "有一排数字 [12, 5, 0, 8, 3]：用 for 挨个领出来自己加，打印总和 28。不许直接伸手要现成的和。",
    hint: "循环外面先备好那个变量，循环里面每次加一点 —— 这就是【演示 7】那套统计模板。回看【演示 1】【演示 7】。",
    starter: "数字 = [12, 5, 0, 8, 3]\n总和 = 0\n",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "28", weight: 45, label: "屏幕上就是那一行 28" },
      { id: "loop", type: "loop", kind: "for", min: 5, weight: 45, label: "真的用 for 把这五个数挨个领过一遍（本课要点）" }
    ],
    reference: "数字 = [12, 5, 0, 8, 3]\n总和 = 0\nfor 数 in 数字:\n    总和 = 总和 + 数\nprint(总和)",
    alts: [
      "数字 = [12, 5, 0, 8, 3]\n总 = 0\nfor i in range(len(数字)):\n    总 += 数字[i]\nprint(总)",
      "数字 = [12, 5, 0, 8, 3]\n总和 = 0\nfor 序号, 数 in enumerate(数字):\n    总和 += 数\nprint(总和)",
      "数字 = [12, 5, 0, 8, 3]\n总和 = 0\nfor 数 in 数字:\n    if 数 >= 0:\n        总和 = 总和 + 数\nprint(总和)"
    ],
    wrongs: [
      "",
      "print(28)",
      "数字 = [12, 5, 0, 8, 3]\nprint(sum(数字))",
      "总和 = 12 + 5 + 0 + 8 + 3\nprint(总和)",
      "数字 = [12, 5, 0, 8, 3]\n总和 = 0\nfor 数 in 数字:\n    print(数)\nprint(28)"
    ],
    loose: [
      "数字=[12,5,0,8,3]\n总和=0\nfor 数 in 数字 :\n        总和 = 总和+数\nprint( 总和 )\n",
      "\n数字 = [12, 5, 0, 8, 3]\n\n总和 = 0\nfor 数 in 数字:\n    总和 += 数\n\nprint(总和)\n"
    ]
  },

  {
    cid: "l33",
    title: "第 33 课考试 · while：几个月能攒够",
    task: "每月存 300：用 while 算出存到多少钱才够 2000，需要几个月，打印那个月数（7）。不许口算直接写答案。",
    hint: "while 的每一轮开始前都会先问一次条件；没人把条件推向假，它就永远转。回看【演示 4】【演示 5】。",
    starter: "月数 = 0\n存款 = 0\n",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "7", weight: 45, label: "屏幕上就是那一行 7" },
      { id: "w", type: "ast", uses: ["while"], weight: 25, label: "用的是 while（本课要点：次数事先不知道）" },
      { id: "wt", type: "loop", kind: "while", min: 5, weight: 20, label: "while 真的转了够圈，不是一次都不跑" }
    ],
    reference: "月数 = 0\n存款 = 0\nwhile 存款 < 2000:\n    存款 = 存款 + 300\n    月数 = 月数 + 1\nprint(月数)",
    alts: [
      "月 = 0\nwhile 月 * 300 < 2000:\n    月 += 1\nprint(月)",
      "月数 = 0\nwhile 月数 * 300 < 2000:\n    月数 = 月数 + 1\nprint(月数)",
      "存款, 月数 = 0, 0\nwhile True:\n    if 存款 >= 2000:\n        break\n    存款 += 300\n    月数 += 1\nprint(月数)"
    ],
    wrongs: [
      "",
      "print(7)",
      "print(2000 // 300 + 1)",
      "月数 = 0\nfor 月数 in range(1, 100):\n    if 月数 * 300 >= 2000:\n        print(月数)\n        break",
      "月数 = 0\n存款 = 0\nwhile 存款 < 2000:\n    print(月数)"
    ],
    loose: [
      "月数=0\n存款=0\nwhile 存款<2000 :\n        存款 += 300\n        月数+=1\nprint( 月数 )\n",
      "\n月数 = 0\n\n存款 = 0\nwhile 存款 < 2000:\n    存款 = 存款 + 300\n    月数 = 月数 + 1\n\nprint(月数)\n"
    ]
  },

  {
    cid: "l34",
    title: "第 34 课考试 · break 与循环的 else",
    task: "在 [3, 7, 11, 19, 23] 里找第一个大于 10 的数，找到就用 break 撤并打印它；再把条件换成大于 100 同样找一遍，这一次一个都没有，让挂在循环上的 else 打印「一个都没有」。屏幕两行依次是 11 和 一个都没有",
    hint: "break 是「这层不干了」，else 挂在循环上、只在没人 break 的时候才执行。两次分开写，别偷懒。回看【演示 1】【演示 3】。",
    starter: "数字 = [3, 7, 11, 19, 23]\n",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "11\n一个都没有", weight: 45, label: "两行依次是 11 和 一个都没有（顺序要对）" },
      { id: "loop", type: "loop", kind: "for", min: 6, weight: 25, label: "两轮 for 都真的转起来了（找到就撤的那轮 + 一个都没找到的那轮）" },
      { id: "if", type: "ast", uses: ["if"], weight: 20, label: "判断写在 if 里" }
    ],
    reference: "数字 = [3, 7, 11, 19, 23]\nfor 数 in 数字:\n    if 数 > 10:\n        print(数)\n        break\nfor 数 in 数字:\n    if 数 > 100:\n        print(数)\n        break\nelse:\n    print('一个都没有')",
    alts: [
      "数字 = [3, 7, 11, 19, 23]\nfor x in 数字:\n    if x > 10:\n        print(x)\n        break\nfor x in 数字:\n    if x > 100:\n        print(x)\n        break\nelse:\n    print('一个都没有')",
      "for 数 in [3, 7, 11, 19, 23]:\n    if 数 > 10:\n        print(数)\n        break\nfor 数 in [3, 7, 11, 19, 23]:\n    if 数 > 100:\n        print(数)\n        break\n    if 数 == 23:\n        pass\nelse:\n    print('一个都没有')",
      "数字 = [3, 7, 11, 19, 23]\nfor 数 in 数字:\n    if 数 > 10:\n        print(数)\n        break\nprint('一个都没有') if False else None\nfor 数 in 数字:\n    if 数 > 100:\n        break\nelse:\n    print('一个都没有')"
    ],
    wrongs: [
      "",
      "print(11)\nprint('一个都没有')",
      "数字 = [3, 7, 11, 19, 23]\nfor 数 in 数字:\n    if 数 > 10:\n        print(数)\nprint('一个都没有')",
      "数字 = [3, 7, 11, 19, 23]\nfor 数 in 数字:\n    if 数 > 10:\n        print(数)",
      "数字 = [3, 7, 11, 19, 23]\nfor 数 in 数字:\n    if 数 > 100:\n        print(数)\n        break\nelse:\n    print('一个都没有')"
    ],
    loose: [
      "数字=[3,7,11,19,23]\nfor 数 in 数字:\n        if 数>10:\n                print(数)\n                break\nfor 数 in 数字:\n    if 数>100:\n        print(数)\n        break\nelse:\n    print( '一个都没有' )\n",
      "\n数字 = [3, 7, 11, 19, 23]\n\nfor 数 in 数字:\n    if 数 > 10:\n        print(数)\n        break\n\nfor 数 in 数字:\n    if 数 > 100:\n        print(数)\n        break\nelse:\n    print('一个都没有')\n"
    ]
  },

  {
    cid: "l35",
    title: "第 35 课考试 · join：成批拼串的正确姿势",
    task: "名单 = ['张三', '李四', '王五']：用 join 把它们用顿号接成一行「张三、李四、王五」打印出来。不许用 + 一个格子一个格子接。",
    hint: "join 的主人是那个分隔符，不是列表 —— 谁在点前面想清楚。回看【演示 5】。",
    starter: "名单 = ['张三', '李四', '王五']\n",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "张三、李四、王五", weight: 45, label: "屏幕上就是这一行" },
      { id: "join", type: "called", name: "join", min: 1, weight: 45, label: "是用 join 一次性接起来的（本课要点）" }
    ],
    reference: "名单 = ['张三', '李四', '王五']\nprint('、'.join(名单))",
    alts: [
      "名单 = ['张三', '李四', '王五']\n一行 = \"、\".join(名单)\nprint(一行)",
      "名单 = ['张三', '李四', '王五']\n分隔 = '、'\nprint(分隔.join(名单))",
      "print('、'.join(['张三', '李四', '王五']))"
    ],
    wrongs: [
      "",
      "print('张三、李四、王五')",
      "名单 = ['张三', '李四', '王五']\nprint(名单[0] + '、' + 名单[1] + '、' + 名单[2])",
      "名单 = ['张三', '李四', '王五']\nprint(','.join(名单))",
      "名单 = ['张三', '李四', '王五']\nprint(名单)"
    ],
    loose: [
      "名单=[ '张三' , '李四' , '王五' ]\nprint( '、' . join(名单) )\n",
      "\n名单 = ['张三', '李四', '王五']\n\nprint('、'.join( 名单 ))\n"
    ]
  },

  {
    cid: "l36",
    title: "第 36 课考试 · 字符串方法：strip 与 lower",
    task: "把 ' Hello Python '（两头各有一个空格、H 和 P 大写）变成小写并去掉两头的空格，结果用方括号包住一起打印，屏幕上是 [hello python]。strip 和 lower 各用上一次。",
    hint: "字符串不可变：方法给你的是一条**新串**，原串纹丝不动 —— 不接返回值等于什么都没做。回看【演示 7】【演示 8】。",
    starter: "原 = ' Hello Python '\n",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "[hello python]", weight: 45, label: "输出正好是 [hello python]（括号里前后不能留空格）" },
      { id: "strip", type: "called", name: "strip", min: 1, weight: 25, label: "用 strip 去掉了两头的空白" },
      { id: "lower", type: "called", name: "lower", min: 1, weight: 20, label: "用 lower 换成了小写" }
    ],
    reference: "原 = ' Hello Python '\nprint('[' + 原.strip().lower() + ']')",
    alts: [
      "原 = ' Hello Python '\n新 = 原.strip()\nprint('[' + 新.lower() + ']')",
      "原 = ' Hello Python '\nprint('[' + 原.lower().strip() + ']')",
      "s = ' Hello Python '\n结果 = s.strip()\n结果 = 结果.lower()\nprint('[' + 结果 + ']')"
    ],
    wrongs: [
      "",
      "print('[hello python]')",
      "原 = ' Hello Python '\nprint('[' + 原.strip() + ']')",
      "原 = ' Hello Python '\nprint('[' + 原.lower() + ']')",
      "原 = ' Hello Python '\n原.strip()\n原.lower()\nprint('[' + 原 + ']')"
    ],
    loose: [
      "原=' Hello Python '\nprint( '[' + 原 . strip () . lower() + ']' )\n",
      "\n原 = ' Hello Python '\n\nprint('['+原.strip().lower()+']')\n"
    ]
  },

  {
    cid: "l37",
    title: "第 37 课考试 · def 与 return：交回来的是东西，不是话",
    task: "定义一个函数，收一个数量、按每个 8 元把总价**交回来**（return，函数里不许 print）；然后打印「这个函数对 3 的结果再乘 2」，屏幕上是 48。",
    hint: "只会 print 的函数像台只会喵喵叫的售货机 —— 按下去什么也不掉出来。这一课的验证方式就是把它的返回值接着拿去算。回看【演示 1】【演示 2】。",
    starter: "def 总价(数量):\n",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完（拿回来的东西能直接参与乘法）" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有 TypeError 之类的红字" },
      { id: "text", type: "stdout-equals", text: "48", weight: 45, label: "屏幕上正好只有那一行 48" },
      { id: "def", type: "ast", uses: ["def"], weight: 45, label: "真的用 def 定义了一个函数（本课要点）" }
    ],
    reference: "def 总价(数量):\n    return 数量 * 8\nprint(总价(3) * 2)",
    alts: [
      "def 价钱(n):\n    结果 = n * 8\n    return 结果\nprint(价钱(3) * 2)",
      "def f(x):\n    return x * 8\nprint(f(3) * 2)",
      "def 总价(数量, 单价=8):\n    return 数量 * 单价\nprint(总价(3) * 2)"
    ],
    wrongs: [
      "",
      "print(48)",
      "def 总价(数量):\n    print(数量 * 8)\n总价(3)\nprint(48)",
      "def 总价(数量):\n    print(数量 * 8)\nprint(总价(3) * 2)",
      "总价 = 3 * 8 * 2\nprint(总价)"
    ],
    loose: [
      "def 总价 ( 数量 ) :\n        return 数量*8\nprint( 总价(3)*2 )\n",
      "\ndef 总价(数量):\n    return 数量 * 8\n\n\nprint(总价(3) * 2)\n"
    ]
  },

  {
    cid: "l38",
    title: "第 38 课考试 · import：把工具箱搬进来",
    task: "先 import math 打印 16 的平方根，再用 from math import sqrt 打印 9 的平方根。屏幕两行依次是 4.0 和 3.0。",
    hint: "两种写法拿到的是同一个工具箱，用法的区别只在前缀要不要写。回看【演示 1】。",
    starter: "import math\n",
    pass: 60,
    checks: [
      { id: "run", type: "run-ok", weight: 5, label: "代码能跑完" },
      { id: "noerr", type: "no-error", weight: 5, label: "没有报错" },
      { id: "text", type: "stdout-equals", text: "4.0\n3.0", weight: 45, label: "两行依次是 4.0 和 3.0" },
      { id: "imp", type: "ast", uses: ["import"], weight: 45, label: "用了 import 把模块搬进来（本课要点）" }
    ],
    reference: "import math\nprint(math.sqrt(16))\nfrom math import sqrt\nprint(sqrt(9))",
    alts: [
      "from math import sqrt\nprint(sqrt(16))\nprint(sqrt(9))",
      "import math as m\nprint(m.sqrt(16))\nfrom math import sqrt as 根号\nprint(根号(9))",
      "import math\n数 = math.sqrt(16)\nprint(数)\nfrom math import sqrt\nprint(sqrt(9))"
    ],
    wrongs: [
      "",
      "print(4.0)\nprint(3.0)",
      "print(16 ** 0.5)\nprint(9 ** 0.5)",
      "import math\nprint(math.sqrt(16))",
      "import math\nprint(math.sqrt(9))\nprint(math.sqrt(16))"
    ],
    loose: [
      "import math\nprint( math.sqrt( 16 ) )\nfrom math import  sqrt\nprint(sqrt(9))\n",
      "\nimport math\n\nprint(math.sqrt(16))\nfrom math import sqrt\nprint(sqrt(9))\n"
    ]
  }

);
