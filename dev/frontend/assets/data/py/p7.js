/* 喵站 · Python 正文分部 p7：第 42–45 课（第四轮重做，主控自己写的那一批）
 *
 * 派给代理的 p2/p3/p4/p5 批次整批掉线且零落盘（任务书 §11.8），这一段改由主控直接写。
 * 规矩与 p1 相同：梗 0 处、交叉引用只往回指、代码只用白名单内已教过的构造、
 * 每章 ≤1,800 字 / ≤25 块 / 单段演示 ≤12 行、故意报错的块标 expectError。
 *
 * 这四课额外要求：每段代码都要能连跑两遍不出错（写文件的课最容易第一遍过、第二遍炸），
 * 所以演示开头一律先清掉上一遍留下的文件，不给读者留垃圾。
 *
 * 本文件由一次性脚本按块重新序列化过（打补丁时误插了重复章节，去重后重建），
 * 所以字符串是双引号而不是反引号 —— 内容里本来就不许出现反引号，两种写法等价。
 */
window.MIAO_PY_P7 = { chapters: [
 {
  "id": "l42",
  "title": "第 42 课 · 文件写入：把内存里的东西留在硬盘上",
  "blocks": [
   {
    "t": "tip",
    "color": "blue",
    "text": "本课目标：会往文件里写东西，并且明白 w 模式在**打开的那一瞬间**就把原文件清空了。"
   },
   {
    "t": "h2",
    "text": "原理讲解"
   },
   {
    "t": "p",
    "text": "第 41 课是「读」，这一课是「写」。写要先把文件对象打开成**可写**的，模式字母从 'r' 换成 'w'："
   },
   {
    "t": "code",
    "lang": "python",
    "code": "with open('42演示.txt', 'w', encoding='utf-8') as f:\n    字数 = f.write('今日营收\\n')\nprint(字数)"
   },
   {
    "t": "p",
    "text": "三件事同时在这行发生：文件被打开、内容被交出去、结束时自动关闭。write 返回的是**它写进去的字符数**（一个数字），不是成功与否的 T 或 F —— 别拿它当「写成功了」的判断。"
   },
   {
    "t": "p",
    "text": "最关键的是 'w' 的语义：**打开的那一刻原文件就被清空**，然后从头写。它不是「覆盖同名位置」，是「先把整份抹掉再动笔」—— 拿 'w' 去更新一份重要存档，等于先删档再赌这次能写对。还有一条能坑一整天：**缓冲区**。写进去的内容先在内存里排队，等文件关闭才真正落盘，所以你在 with 里面还没关门就去读同一个文件，读到的是空的。"
   },
   {
    "t": "h2",
    "text": "假设它能干什么"
   },
   {
    "t": "p",
    "text": "任何「程序关掉之后还要留着」的东西都得走这条路：成绩单存成文本、配置写回文件、一次运行的结果落成报告。最后一课的 JSON 存档也靠它把内容送进硬盘。"
   },
   {
    "t": "h2",
    "text": "演示 1 · 写完再读，看到内容了"
   },
   {
    "t": "code",
    "lang": "python",
    "code": "with open('42演示.txt', 'w', encoding='utf-8') as f:\n    f.write('第一版内容\\n')\nwith open('42演示.txt', 'r', encoding='utf-8') as f:\n    print(f.read())"
   },
   {
    "t": "p",
    "text": "写入的 with 块结束时文件被关闭，缓冲区冲干净，第二个 with 才读得到。两个块是两次独立的打开关闭，中间文件是「已经躺在硬盘上」的状态。"
   },
   {
    "t": "h2",
    "text": "演示 2 · 还没 close 就读，是空的"
   },
   {
    "t": "code",
    "lang": "python",
    "code": "with open('42演示.txt', 'w', encoding='utf-8') as f:\n    f.write('还在缓冲区里\\n')\n    with open('42演示.txt', 'r', encoding='utf-8') as g:\n        print(repr(g.read()))"
   },
   {
    "t": "p",
    "text": "输出是 '' —— 空字符串。内层那次读打开的是同一个文件，但外层那次写的内容**一个字都还没落盘**。把 print 挪到 with 块外面就能看到内容了，这正是演示 1 的情形。"
   },
   {
    "t": "h2",
    "text": "演示 3 · 用 w 写第二次，第一次就没了"
   },
   {
    "t": "code",
    "lang": "python",
    "code": "with open('42演示.txt', 'w', encoding='utf-8') as f:\n    f.write('很重要的一段话\\n')\nwith open('42演示.txt', 'w', encoding='utf-8') as f:\n    f.write('第二版\\n')\nwith open('42演示.txt', 'r', encoding='utf-8') as f:\n    print(repr(f.read()))"
   },
   {
    "t": "p",
    "text": "只剩 '第二版\\n'。第一行内容在第二次 open(..., 'w') 的那一刻就被抹掉了，跟它写了什么、写没写成功都无关。想「接着往下写」，那是下一课 'a' 模式的活。"
   },
   {
    "t": "h2",
    "text": "演示 4 · writelines：它不替你加换行"
   },
   {
    "t": "code",
    "lang": "python",
    "code": "行们 = ['第一行\\n', '第二行\\n', '第三行\\n']\nwith open('42演示.txt', 'w', encoding='utf-8') as f:\n    f.writelines(行们)\nwith open('42演示.txt', 'r', encoding='utf-8') as f:\n    print(len(f.readlines()), '行')"
   },
   {
    "t": "p",
    "text": "名字长得像 write 的复数，其实只是「挨个写」。它**不会**在元素之间补换行，你给的列表里没带 \\n 就会全部粘成一行。上面每行末尾都自己带了换行，所以读回来是 3 行。"
   },
   {
    "t": "h2",
    "text": "常见坑"
   },
   {
    "t": "ul",
    "items": [
     "拿 'w' 更新重要文件 → 打开即清空，写一半报错就同时失去新旧两份。稳妥做法是先写 临时文件，成功后再改名覆盖。",
     "在 with 块里读自己刚写的内容，读到空 —— 就是演示 2。",
     "writelines 传了个字符串列表却指望自动换行。它不加，自己写 \\n。",
     "忘了 encoding='utf-8'，在 Windows 上按系统默认编码写，中文进去、下次读出来是乱码。",
     "write 传了数字：f.write(123) → TypeError: write() argument must be str, not int。它只吃文本，数字先自己转成文本。",
     "赌运行目录：open('42演示.txt') 换个目录跑就 FileNotFoundError。写文件前先想清楚路径从哪来。"
    ]
   },
   {
    "t": "h2",
    "text": "任务"
   },
   {
    "t": "ul",
    "items": [
     "把今天做了哪三件事写进 42今天.txt，一行一件，读回来打印并数出行数。",
     "再跑一遍同一段代码，故意只改模式为 'w' 不改内容，看第二遍跑完文件里有几行；然后换成 'a' 再跑一遍，比较两次的区别（下一课正式讲它）。",
     "写一段代码：先 open('42演示.txt', 'w') 写一行，在同一个 with 块里再打开它读一次，把读到的东西打印出来。用本课学的「缓冲区」解释为什么是这个结果。",
     "挑战题：把 41 课读到的那份名单，按「姓名 分数」的格式一行一条写进 42成绩单.txt，再读回来算平均分。"
    ]
   },
   {
    "t": "tip",
    "color": "green",
    "text": "本课一句话：'w' 是「先清空再写」而不是「覆盖」，write 交还的是字符数，内容要等文件关闭才真正落盘。"
   }
  ]
 },
 {
  "id": "l43",
  "title": "第 43 课 · 追加文件：往同一份文件里不断加东西，不弄丢旧的",
  "blocks": [
   {
    "t": "tip",
    "color": "blue",
    "text": "本课目标：会用 'a' 追加写，明白为什么日志一律用追加，并认识 'x'（独占创建）和 a+ 里那个指针位置。"
   },
   {
    "t": "h2",
    "text": "原理讲解"
   },
   {
    "t": "p",
    "text": "把模式换成 'a'（append），打开时**不清空**，而且写入位置被固定在文件末尾："
   },
   {
    "t": "code",
    "lang": "python",
    "code": "with open('43日志.txt', 'a', encoding='utf-8') as f:\n    f.write('09:00 开门\\n')\nwith open('43日志.txt', 'a', encoding='utf-8') as f:\n    f.write('12:30 卖出 12 单\\n')\nwith open('43日志.txt', 'r', encoding='utf-8') as f:\n    print(f.read())"
   },
   {
    "t": "p",
    "text": "两次打开、两次写，内容攒成了两行。这就是日志文件的写法：**每次运行只负责往后添，不负责重写别人添过的**。程序重启一百次，记录也还在。"
   },
   {
    "t": "p",
    "text": "和 'w' 的区别不在「写的位置」，在**打开那一刻做了什么**：'w' 先把文件截断成长度 0，'a' 什么都不动。所有「不能丢历史」的场景 —— 日志、流水账、计数器、收藏列表 —— 都该用 'a'。"
   },
   {
    "t": "p",
    "text": "还有一个模式 'x'：独占创建，文件**已经存在就直接报错**，不存在才新建。它专门用来防「我不小心把老文件冲了」。"
   },
   {
    "t": "h2",
    "text": "假设它能干什么"
   },
   {
    "t": "p",
    "text": "做一个能记住东西的记账程序：每跑一次记一笔，跑一百次有一百笔；把报错信息一路追加进一个文件，出问题回去翻最后几行；给每天第一次运行写一条打卡记录。这些都是 'a' 的地盘。"
   },
   {
    "t": "h2",
    "text": "演示 1 · 三种模式跑三遍，结果差多少"
   },
   {
    "t": "code",
    "lang": "python",
    "code": "from pathlib import Path\n旧记录 = Path('43对比.txt')\nif 旧记录.exists():\n    旧记录.unlink()\nfor 次 in range(3):\n    with open('43对比.txt', 'w', encoding='utf-8') as f:\n        f.write('一条记录\\n')\nwith open('43对比.txt', 'r', encoding='utf-8') as f:\n    print('三次 w 之后剩', len(f.readlines()), '行')"
   },
   {
    "t": "p",
    "text": "剩 1 行。三次 'w' 各自把文件清空一遍，前两次的内容根本没机会留下来。把上面循环里的模式换成 'a' 再跑，就是 3 行。"
   },
   {
    "t": "h2",
    "text": "演示 2 · 'x' 只让建一次"
   },
   {
    "t": "code",
    "lang": "python",
    "expectError": "FileExistsError",
    "code": "from pathlib import Path\n新建 = Path('43新建.txt')\nif 新建.exists():\n    新建.unlink()\nwith open('43新建.txt', 'x', encoding='utf-8') as f:\n    f.write('第一次建\\n')\nwith open('43新建.txt', 'x', encoding='utf-8') as f:\n    f.write('再来一次\\n')"
   },
   {
    "t": "p",
    "text": "第二次打开会抛 FileExistsError: File exists: '43新建.txt'。这个报错不是坏事，它替你拦下了一次误删。"
   },
   {
    "t": "h2",
    "text": "演示 3 · a+ 里读不到东西"
   },
   {
    "t": "code",
    "lang": "python",
    "code": "with open('43日志.txt', 'a+', encoding='utf-8') as f:\n    print(repr(f.read()))\nwith open('43日志.txt', 'r', encoding='utf-8') as f:\n    print(repr(f.read()[:6]))"
   },
   {
    "t": "p",
    "text": "第一行输出是 ''。'a+' 能读能写，但打开时读写指针被放在**文件末尾**，从末尾往后读当然什么都没有。想从头读，得先 f.seek(0) 把指针挪回开头 —— 这也是「为什么我明明用 a+ 却读不到」的标准答案。"
   },
   {
    "t": "h2",
    "text": "常见坑"
   },
   {
    "t": "ul",
    "items": [
     "用 'w' 写日志，第二天就把昨天的记录冲没了。日志一律 'a'。",
     "以为 'a' 里可以用 f.seek(0) 回到开头去改旧内容。追加模式把写的位置钉死在末尾，seek 只对读有效。",
     "追加写忘了行尾的 \\n，下次追加的内容直接粘在上一行屁股后面，两笔变成一笔。",
     "拿 'x' 当 'a' 用：第二次运行就 FileExistsError 整个程序停了。'x' 只用于「必须新建」的场合。",
     "想「读一遍再整体写回」，用 r+ 而不是 a —— 但 r+ 写的位置在指针处，写短了会留下旧内容的尾巴。",
     "赌运行目录：换个目录跑就 FileNotFoundError。路径先锚定好（最后一课整课讲这个）。"
    ]
   },
   {
    "t": "h2",
    "text": "任务"
   },
   {
    "t": "ul",
    "items": [
     "做一个打卡文件：每次运行往 43打卡.txt 追加一行「今天来了」，跑三遍后读回来数出行数。",
     "把上一题改成用 'w'，再跑三遍，看行数变成几，用一句话解释差在哪。",
     "用 'x' 建一个当天日期命名的文件（比如 43-2026-10-06.txt），已经存在就打印一句「今天已经建过了」而不是让程序崩掉。",
     "挑战题：写一个只有 5 行的滚动日志 —— 每次追加一行后，如果超过 5 行就重写成只保留最后 5 行。注意「重写」那一步用的模式，别把刚追加的那行弄丢了。"
    ]
   },
   {
    "t": "tip",
    "color": "green",
    "text": "本课一句话：'a' 与 'w' 的差别在打开那一刻 —— 一个截断一个不动；所有不能丢历史的文件都用追加写，每行末尾自己带 \\n。"
   }
  ]
 },
 {
  "id": "l44",
  "title": "第 44 课 · 异常处理：程序出错时，让它说人话而不是甩你一屏红字",
  "blocks": [
   {
    "t": "tip",
    "color": "blue",
    "text": "本课目标：会写 try / except / else / finally，说清每段什么时候跑，并且只捕获具体的异常类型。"
   },
   {
    "t": "h2",
    "text": "原理讲解"
   },
   {
    "t": "p",
    "text": "前面几课你已经见过不少红色报错：出错时 Python 会**抛出**一个异常对象，没人接住它，程序就终止并打印一长串 Traceback。try / except 就是那个「接住」的动作："
   },
   {
    "t": "code",
    "lang": "python",
    "code": "try:\n    结果 = 100 / 0\nexcept ZeroDivisionError as e:\n    print('不能除以 0：', e)"
   },
   {
    "t": "p",
    "text": "读法：try 块里的代码**从上往下正常跑**，一旦某行抛异常，剩下的行全部跳过，直接去找能对上类型的那个 except；对上就跑它的处理代码，跑完继续往下走程序，不再崩。as e 把那个异常对象接住，打印它会得到「类名: 说明」，是报错里最有用的一行。"
   },
   {
    "t": "p",
    "text": "三个配套块：else 只在 try **一点没炸**时才跑（把成功之后要做的事放这儿，比塞在 try 里更清楚）；finally 炸不炸都跑（收尾：关文件、写一条「本次处理完毕」）；except 可以写好几个，**从上往下第一个类型对上的生效**，其余的跳过。"
   },
   {
    "t": "h2",
    "text": "假设它能干什么"
   },
   {
    "t": "p",
    "text": "凡是「用户会乱输入、文件可能不在、网络可能断」的地方都用得上：把 int(input()) 包起来，输入字母时提示重输而不是崩；读存档前先兜住文件不存在；一个批量处理任务里，一个文件坏了不要让整批停住。"
   },
   {
    "t": "h2",
    "text": "演示 1 · 一次兜住好几种错"
   },
   {
    "t": "code",
    "lang": "python",
    "code": "for 输入 in ['10', '0', 'abc']:\n    try:\n        数字 = 100 / int(输入)\n    except ZeroDivisionError:\n        print(输入, '→ 不能除以 0')\n    except ValueError:\n        print(输入, '→ 不是数字')\n    else:\n        print(输入, '→ 算出来了', 数字)"
   },
   {
    "t": "p",
    "text": "三行输入走了三条不同的路：'0' 在 100 / 0 处抛 ZeroDivisionError，'abc' 在 int('abc') 处抛 ValueError，'10' 全程没炸所以走 else。注意异常发生在哪一行，那一行之后 try 里就不跑了。"
   },
   {
    "t": "h2",
    "text": "演示 2 · finally 一定跑"
   },
   {
    "t": "code",
    "lang": "python",
    "code": "for 输入 in ['4', 'x']:\n    try:\n        数字 = 100 / int(输入)\n    except ValueError:\n        print('坏了')\n    finally:\n        print('这一轮结束')"
   },
   {
    "t": "p",
    "text": "两轮都打印了「这一轮结束」，一轮没炸、一轮炸了都拦不住它。它常用来做「不管成功失败都要留下的记录」。"
   },
   {
    "t": "h2",
    "text": "演示 3 · 文件不存在是一种常态"
   },
   {
    "t": "code",
    "lang": "python",
    "code": "try:\n    with open('根本没有这个文件.txt', 'r', encoding='utf-8') as f:\n        内容 = f.read()\nexcept FileNotFoundError as e:\n    print('文件不存在：', e.strerror)"
   },
   {
    "t": "p",
    "text": "异常对象上带的不只是那句话：文件类的异常还有 e.strerror（原因）和 e.filename（哪个文件），比直接打印 e 更好读。"
   },
   {
    "t": "h2",
    "text": "演示 4 · 光秃秃的 except 会把你也骗过去"
   },
   {
    "t": "code",
    "lang": "python",
    "code": "try:\n    名单 = ['张三', '李四']\n    print(名单[5])\nexcept:\n    print('出错了')"
   },
   {
    "t": "p",
    "text": "它确实接住了一切，但你永远不知道接住的是什么：这次是索引越界，下次可能是变量名拼错、除零、文件写坏，全都印同一句「出错了」。写代码时宁可具体到类型，兜底也只兜 Exception 并把类型名打出来，别写光秃秃的那一行。"
   },
   {
    "t": "h2",
    "text": "常见坑"
   },
   {
    "t": "ul",
    "items": [
     "except 后面什么都不写（光秃秃）—— 把拼写错误、逻辑错误一起吞了，程序不崩但结果一直是错的，最难查。",
     "把整段代码塞进一个 try 里，出了错不知道是哪一行。try 里只放「真的可能炸的那一两行」。",
     "except 的顺序从宽到窄：把 Exception 写在 ValueError 前面，ValueError 那条永远轮不到。具体类型在前，兜底在后。",
     "以为 else 是「否则」。它是「try 没炸才跑」，跟 if/else 的语义不是一回事。",
     "在 except 里再抛一个新异常却忘了处理，程序照样崩，只是换了个报错。",
     "用 try 代替判断：明明可以先 if 路径存在再读，却写成 open 然后 except。异常是给「意外」用的，不是流程控制。"
    ]
   },
   {
    "t": "h2",
    "text": "任务"
   },
   {
    "t": "ul",
    "items": [
     "写一个「输入数字求倒数」的小程序：输入不是数字、输入是 0，分别给出两句不同的提示，程序不崩。",
     "把第 41 课那个读文件的例子包一层：文件在就打印内容行数，不在就打印「还没有存档」，两种情况都要打印「处理完毕」。",
     "故意写一段会抛 TypeError 的代码，先用光秃秃 except 接住，再改成具体类型接住，比较两次你能不能说出错在哪。",
     "挑战题：把 43 课的打卡程序加上异常处理 —— 文件存在就用 'a' 追加，不存在就用 'x' 新建，中途任何失败都打印一句人话并且不留半个坏文件。"
    ]
   },
   {
    "t": "tip",
    "color": "green",
    "text": "本课一句话：try 里只放可能炸的那一两行，except 按「具体在前、兜底在后」排，else 是没炸才跑，finally 是无论如何都要收尾。"
   }
  ]
 },
 {
  "id": "l45",
  "title": "第 45 课 · 和操作系统打交道：路径、目录、JSON 持久化",
  "blocks": [
   {
    "t": "tip",
    "color": "blue",
    "text": "本课目标：会用 Path 锚定自己的目录、摸一个目录里的东西，并且把 Python 的数据存成 JSON 再读回来。"
   },
   {
    "t": "h2",
    "text": "原理讲解"
   },
   {
    "t": "p",
    "text": "前三课都绕不开一个问题：**路径从哪来**。写死一个文件名，只在你恰好站在那个目录里运行时才对。稳妥做法是拿脚本自己的位置当锚点："
   },
   {
    "t": "code",
    "lang": "python",
    "code": "from pathlib import Path\n本课目录 = Path(__file__).parent\nprint(本课目录.exists(), 本课目录.is_dir())"
   },
   {
    "t": "p",
    "text": "Path 是**对象**，带方法：.parent 上一级、.exists() 在不在、.name 名字，用 / 拼路径。老一代是 os.path 那套函数（join、dirname），传的是字符串。两代别混着用：路径对象和字符串比较时不相等，翻车多半翻在这里。"
   },
   {
    "t": "p",
    "text": "JSON 只认这几样：字典、列表、字符串、数字、布尔、None。函数、集合、自定义类的对象塞不进去，会抛 TypeError。"
   },
   {
    "t": "h2",
    "text": "假设它能干什么"
   },
   {
    "t": "p",
    "text": "到这里你已经能做一个**关掉了还记得**的小程序：存档、配置、通讯录、成绩单。往大处说，任何要跨目录找文件的活都靠这套 —— 遍历目录里的图片、按名字筛、把结果写成报告存盘。"
   },
   {
    "t": "h2",
    "text": "演示 1 · 摸一个目录里有啥"
   },
   {
    "t": "code",
    "lang": "python",
    "code": "from pathlib import Path\n这里 = Path('45目录')\n这里.mkdir(parents=True, exist_ok=True)\n(这里 / '甲.txt').write_text('一\\n', encoding='utf-8')\n(这里 / '乙.txt').write_text('二\\n', encoding='utf-8')\n名字们 = []\nfor 项 in 这里.glob('*.txt'):\n    名字们.append(项.name)\n名字们.sort()\nprint(len(名字们), 名字们)"
   },
   {
    "t": "p",
    "text": "先收集进列表再 sort，屏幕上给出条数和名字。glob('*.txt') 只翻当前这一层，rglob 会连子目录一起往里钻 —— 这两个是「按模式找文件」的主力。"
   },
   {
    "t": "h2",
    "text": "演示 2 · 建目录、写文件、收摊"
   },
   {
    "t": "code",
    "lang": "python",
    "code": "from pathlib import Path\n临时 = Path('45练习')\n临时.mkdir(parents=True, exist_ok=True)\n笔记 = 临时 / '笔记.txt'\n笔记.write_text('第一行\\n第二行\\n', encoding='utf-8')\nprint(笔记.exists(), 笔记.stat().st_size, '字节')"
   },
   {
    "t": "p",
    "text": "parents=True 连父级一起建，exist_ok=True 让「已经存在」不算错 —— 少了这两个参数，程序第二遍跑就会抛 FileExistsError。write_text 一步建文件加写内容，比 open 加 write 短。stat().st_size 是字节数。"
   },
   {
    "t": "h2",
    "text": "演示 3 · 把名单存成 JSON 再读回来"
   },
   {
    "t": "code",
    "lang": "python",
    "code": "import json\nfrom pathlib import Path\n存档 = Path('45name.json')\n名单 = [{'姓名': '张三', '分数': 88}, {'姓名': '李四', '分数': 92}]\nwith open(存档, 'w', encoding='utf-8') as f:\n    json.dump(名单, f, ensure_ascii=False, indent=2)\nwith open(存档, 'r', encoding='utf-8') as f:\n    读回 = json.load(f)\nprint(读回[1]['姓名'], len(读回), '条')"
   },
   {
    "t": "p",
    "text": "ensure_ascii=False 让中文按中文写（默认会变成一串 \\uXXXX），indent=2 让它带缩进、人眼能读。读回来是一个列表，里面是字典，跟存进去时形状一样 —— 这就是「持久化」。"
   },
   {
    "t": "h2",
    "text": "演示 4 · 什么东西存不进 JSON"
   },
   {
    "t": "code",
    "lang": "python",
    "expectError": "TypeError",
    "code": "import json\ndef 算总价(件数):\n    return 件数 * 10\nprint(json.dumps({'算法': 算总价}))"
   },
   {
    "t": "p",
    "text": "报 TypeError: Object of type function is not JSON serializable。函数、集合、自定义类的对象都不行 —— JSON 是**数据**的格式，不是**代码**的格式。要留住它们，先手动转成 JSON 认得的形状（对象转字典、集合转列表）。"
   },
   {
    "t": "h2",
    "text": "常见坑"
   },
   {
    "t": "ul",
    "items": [
     "赌运行目录：open('45name.json') 换个目录跑就 FileNotFoundError。用 Path(__file__).parent 锚定。",
     "'/' 用在字符串上不是拼路径：'目录' / '文件' 直接 TypeError。先转成 Path 对象再用 /。",
     "Windows 路径里的反斜杠：'C:\\new\\test' 里 \\n 是换行、\\t 是制表符，路径当场废掉（第 6 课那个坑）。用 Path 或正斜杠。",
     "print(json.dump(对象, f)) 拿到 None：dump 只管写盘、不返回值。要内容用 dumps，或者写完读回来。",
     "拿 'w' 直接覆盖存档：中途报错就新旧两份一起没 —— 先写临时文件，成功后再改名覆盖。"
    ]
   },
   {
    "t": "h2",
    "text": "任务"
   },
   {
    "t": "ul",
    "items": [
     "用 mkdir 加 write_text 建一个 45练习目录/笔记.txt，打印它的字节数，然后连跑三遍确认不报错（幂等）。",
     "把你的名单（至少三人、每人两个字段）存成 45我的名单.json，读回来算平均分；再往里塞一个函数，亲眼看到那个 TypeError，然后按演示 4 改成存「函数名 + 参数」的字典修好。",
     "把第 44 课那套成绩录入改成 JSON 存档：开头先看文件在不在，在就读回上次记录并打印「已有 N 条」，结束时写回去 —— 第二遍运行要能看到第一遍录的人还在。",
     "挑战题：统计当前目录（含子目录）里每个 .py 文件有多少行，排出前三名，把「文件名 → 行数」存进 45行数统计.json 再读回来打印。每个文件都要写 encoding='utf-8'。"
    ]
   },
   {
    "t": "tip",
    "color": "green",
    "text": "本课一句话：路径只是字符串、操作系统才懂它，所以拿 Path(__file__).parent 锚定别赌目录；存盘必须序列化，而 JSON 只认字典、列表、字符串、数字、布尔和 None。"
   }
  ]
 }
] };
