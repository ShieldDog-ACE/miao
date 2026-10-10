/* 喵站 · Python 课末考试数据（唯一来源）
 *
 * 45 课（l01…l45）每课一场考试；三节「第 0 课」(s01–s03) 不考试，按原样保留「完成！」按钮。
 * 本文件只描述考试，正文在 py-data.js。前端不留副本，由 index.html 直接引为静态文件。
 *
 * ─── 一场考试的形状 ───
 * {
 *   cid:  "l01",                       章节 id，必须与 py-data.js 对得上
 *   title:"第 1 课考试 · print",
 *   task: "用 print 在屏幕上打出 hello world",     ← 给读者看的一句话
 *   hint: "想不起来就回看本课【演示 1】",            ← 只指路，不给答案
 *   starter: "print(        )",        编辑器里预填的骨架（可以留空字符串）
 *   stdin:  ["2024"],                  input() 的模拟输入，一行一个
 *   files:  { "a.txt": "内容" },        虚拟文件系统里的初始文件
 *   pass:   60,                        通过线（总分 100）
 *   checks: [ {…} ],                   见下面的检查项表
 *   reference:   "print('hello world')",   参考解（判分器自测用；读者通过后才能在结果里看到）
 *   alts:   ["print(\"hello world\")"],    其他合法写法，必须同样判过
 *   wrongs: ["", "print('hello')"],        必须判不过的样例
 *   loose:  ["print( 'hello world' )", "print('hello world')\nprint()"]
 *          宽松性自测：多打空格、多打空行仍然要判过
 * }
 *
 * ─── 检查项 type 与参数（实现在 frontend/assets/js/exam-grade.js 的 CHECKS 里）───
 *   run-ok {}                       退出码为 0
 *   no-error {}                     终端里没有 Traceback
 *   stdout-has  {text, ignoreCase?} 输出里出现某段话（空白折叠后）
 *   stdout-not  {text}              输出里不许出现
 *   stdout-equals {text, ignoreCase?}  输出整体一致（忽略多余空格与尾部空行）
 *   stdout-line {index, text}       第 index 行（从 0 起）必须等于 text
 *   stdout-regex {pattern, flags}   输出匹配正则
 *   lines-at-least {n}              至少输出 n 行
 *   called {name, min}              调用过某个名字（print / input / open / len …，
 *                                   也包括方法：append / write / format / sqrt 这类都按方法名记）
 *   not-called {name}               不许用某函数
 *   branch {at: "true"|"false"|任意, line?, kind?}  if 走过真/假分支（可限定第几行）
 *   loop {kind:"for"|"while", min}  循环至少转 min 圈
 *   var {name, equals}              变量终值（equals 是本文件里的原生 JS 值：字符串/数字/null；写 expected 也认）
 *   file-has {path, has}            虚拟文件里写着某段话
 *   print-calls {min|exactly}       print 调用次数（次数本身是考点时用，比如「只许一次」）
 *   assign-count {min}              赋值语句至少几次
 *   source-has-comment {min}        源码里有几行 # 注释（引号里的 # 不算）——只有第 15 课「注释」用得上，
 *                                   这是唯一一处直接看源码的检查项，别拿它去比对写法
 *   ast-not {uses:[…]}              不许出现这种写法（比如本课要求「别用 +」）
 *   ast {uses: […]}                 代码里出现了这种写法，可用名字全在下面的 FEATURES 里：
 *       fstr str strconcat format pct if elif while for def class subclass super try with
 *       list dict set tup slice comp lambda in not and or import unpack var assign print
 *       sep endkw multiarg singlearg tq escnl
 *       （sep=print 里写了 sep=；endkw=写了 end=；multiarg=一条 print 逗号给了 ≥2 个值；
 *         tq=三引号；escnl=字符串里含 \n；assign=有赋值语句；subclass=class X(Y)；
 *         comp 覆盖 list/dict/set 三种推导式）
 *
 * ─── 权重规矩（照需求「不能太严格」定的）───
 *   1. 所有 checks 的 weight 相加必须正好 100，通过线一律 60。
 *   2. 通用地板项 run-ok / no-error / called print 合计不超过 45 分，
 *      这样「光跑通但没按本课要求写」到不了 60。
 *   3. 本课真正要考的那个特征（ast / loop / branch / called 等）单独占 ≥45 分。
 *   4. 判分只看输出与执行轨迹，绝不做逐字符比对源码；空格、缩进风格、多余空行一律放过。
 *   5. 涉及 input() 的题必须给 stdin；涉及文件的题必须给 files 初始内容。
 *   6. 每道题都要有 reference / alts / wrongs / loose 四组自测样例，
 *      跑 `node dev/tests/exam-test.js` 全过才算写完。
 */
window.MIAO_PY_EXAM = {
  pass: 60,
  exams: {
    l01: {
      cid: "l01",
      title: "第 1 课考试 · print",
      task: "用 print 在屏幕上打出 hello world",
      hint: "记住 print 是「函数」：名字后面跟括号，文本要用引号圈起来。回看本课【演示 1】。",
      starter: "print(",
      pass: 60,
      checks: [
        { id: "run", type: "run-ok", weight: 20, label: "代码能跑完，没有红字报错" },
        { id: "noerr", type: "no-error", weight: 15, label: "终端里没有 Traceback" },
        { id: "text", type: "stdout-equals", text: "hello world", weight: 45, label: "屏幕上就是那一行 hello world" },
        { id: "useprint", type: "called", name: "print", min: 1, weight: 20, label: "是用 print 打出来的" }
      ],
      reference: "print('hello world')",
      alts: [
        "print(\"hello world\")",
        "print('hello', 'world')",
        "话 = 'hello world'\nprint(话)"
      ],
      wrongs: [
        "",
        "print('hello')",
        "print('helloworld')",
        "print(Hello World)"
      ],
      loose: [
        "print( 'hello world' )",
        "print('hello world')\nprint()",
        "\n\nprint('hello world')   "
      ]
    },

    l02: {
      cid: "l02",
      title: "第 2 课考试 · 引号",
      task: "打印这一句：它's 一颗\"柠檬\"（单引号双引号都得出现在输出里）",
      hint: "引号是定界符，不是内容。想在一句话里放另一种引号，可以换外层引号，也可以加反斜杠。回看【演示 3】。",
      starter: "print(",
      pass: 60,
      checks: [
        { id: "run", type: "run-ok", weight: 15, label: "代码能跑完" },
        { id: "noerr", type: "no-error", weight: 15, label: "没有语法错误" },
        { id: "text", type: "stdout-equals", text: "它's 一颗\"柠檬\"", weight: 45, label: "输出与原句一模一样" },
        { id: "quote", type: "ast", uses: ["str"], weight: 25, label: "内容是用引号写的字符串" },
        { id: "useprint", type: "called", name: "print", min: 1, weight: 0, label: "用了 print" }
      ],
      reference: "print('它\\'s 一颗\"柠檬\"')",
      alts: [
        "print(\"它's 一颗\\\"柠檬\\\"\")",
        "句子 = '它\\'s 一颗\"柠檬\"'\nprint(句子)"
      ],
      wrongs: [
        "print('它's 一颗\"柠檬\"')",
        "print('它\\'s 一颗柠檬')",
        ""
      ],
      loose: [
        "print( '它\\'s 一颗\"柠檬\"' )",
        "print('它\\'s 一颗\"柠檬\"')\n"
      ]
    },

    l03: {
      cid: "l03",
      title: "第 3 课考试 · 用 + 接文本",
      task: "用加号把三段文本接成一句话再打印出来：老张爱吃柠檬",
      hint: "这一课的关键不是结果对，而是「用 + 接」。至少写两个加号。回看【演示 2】。",
      starter: "print(",
      pass: 60,
      checks: [
        { id: "run", type: "run-ok", weight: 15, label: "代码能跑完" },
        { id: "text", type: "stdout-equals", text: "老张爱吃柠檬", weight: 35, label: "输出是那句话" },
        { id: "concat", type: "ast", uses: ["strconcat"], weight: 45, label: "真的用 + 把文本接起来了（这是本课要考的）" },
        { id: "noerr", type: "no-error", weight: 5, label: "没有报错" }
      ],
      reference: "print('老张' + '爱吃' + '柠檬')",
      alts: [
        "a = '老张'\nb = '爱吃'\nc = '柠檬'\nprint(a + b + c)",
        "print('老张' + '爱吃柠檬')"
      ],
      wrongs: [
        "print('老张爱吃柠檬')",
        "print('老张', '爱吃', '柠檬')",
        "print('老张' - '爱吃')"
      ],
      loose: [
        "print( '老张'+'爱吃'+'柠檬' )",
        "print('老张' +\n      '爱吃' + '柠檬')"
      ]
    }
  }
};
