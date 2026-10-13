/* 喵站 · C++ 入门 考卷分部 p07：第 31–34 课（三目 ?: / 带初始化的 if / while / do-while）
 *
 * 形状与硬指标照 cpp-exam/p01.js、p02.js（cpp-exam-check 逐条对账）：
 *   1. kind:"paper"，题型只用笔试引擎认的六种（choice/multi/blank/code/output/order）；
 *   2. 各题 score 相加正好 100；
 *   3. 源稿每一条【任务】都有题用 coversTask 对着它（序号从 1 起，一条题可盖多条）；
 *   4. 带 coversTask 的题合计 ≥50 分；choice ≥2；output ≥1；
 *   5. 每题带 why；selftest 的 refs 判 100、wrongs 判 <60、loose 判 ≥60。
 *
 * 验收：node dev/tools/cpp-exam-check.cjs --only c31,c32,c33,c34
 */
window.MIAO_CPP_EXAM_P07 = {
  papers: [
    {
      cid: "c31", kind: "paper", pass: 60,
      title: "第 31 课考试 · 二选一快捷方式 ? :",
      task: "任务题目：把 score 改成 50 看 result 变成什么；用三目写「偶数打印 even，奇数打印 odd」（提示 x % 2 == 0）",
      hint: "想不起来就回看本课【演示 1】的判定行和【演示 4】把三目塞进打印里那段。",
      questions: [
        { id: "q1", type: "choice", score: 14,
          coversTask: 1,
          stem: "已有 int score = 85; 和 std::string result = (score >= 60) ? \"通过\" : \"未通过\";。把 score 改成 50 之后，result 里装的是什么？",
          options: ["「通过」", "「未通过」", "空的，因为还没赋值", "编译报错：50 太小"],
          answer: 1,
          why: "50 不小于 60，条件为假，于是走冒号那一头取「未通过」。三目永远会交出一个值，不存在「空的」。" },
        { id: "q2", type: "choice", score: 12,
          stem: "三目运算符和 if/else 的根本差别在哪？",
          options: ["三目本身就是一个值，能直接放在等号右边；if/else 是语句，自己没有值", "三目运行起来比 if/else 快很多", "三目能在一个分支里写好几句代码", "if/else 不能给变量赋值"],
          answer: 0,
          why: "它是表达式不是语句：正因为「就是一个值」，才能当初始值、当参数、当打印坑里的内容 —— 这也是它能一行搞定的根本原因。" },
        { id: "q3", type: "code", score: 18,
          coversTask: 2,
          stem: "（任务题）x 是 int。写一行 std::println，把占位坑里放一个三目：x 是偶数就打 even，是奇数就打 odd（条件用 x % 2 == 0）。",
          acceptRegex: ['\\?\\s*"even"\\s*:\\s*"odd"'],
          why: "写法就是 std::println(\"{}\", (x % 2 == 0) ? \"even\" : \"odd\"); —— 三目整个塞进坑里，条件为真取问号后的 even。" },
        { id: "q4", type: "output", score: 14,
          coversTask: 1,
          stem: "这段代码打印什么？（一行一条）\nint score = 50;\nstd::string result = (score >= 60) ? \"通过\" : \"未通过\";\nint a = 7;\nint b = 3;\nstd::println(\"{} {}\", result, (a > b) ? a : b);",
          acceptLines: ["未通过 7"],
          why: "第一个坑：50 不满足条件，拿到「未通过」；第二个坑：7 大于 3 为真，取问号后面的 a，也就是 7。" },
        { id: "q5", type: "blank", score: 10,
          coversTask: 2,
          stem: "三目里条件为真取问号后面那个值，为假取____号后面的值。（填一个符号名）",
          accept: ["冒号", ":", "冒号 :"],
          why: "(条件) ? 选A : 选B —— 问号后面是「真」的那头，冒号后面是「假」的那头，两个都得写。" },
        { id: "q6", type: "multi", score: 14,
          stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["两个分支一个给数字一个给字符串，编译器会因为定不下类型而报错", "int r = (score >= 60) ? 1 : 0 + 5; 走假分支时 r 是 5", "三目可以像 if/else 那样在某个分支里写一大段代码", "嵌套三目写得越深，读代码的人越省力"],
          answers: [0, 1],
          why: "编译器必须在编译时定下「这个式子是什么类型」，两边对不上就报错；加法的优先级比 ?: 高，所以 0 + 5 先算成 5。分支里塞整段代码、嵌套三层都是本课明确反对的写法。" },
        { id: "q7", type: "choice", score: 8,
          stem: "本课对「给三目的条件部分加括号」的建议是什么？",
          options: ["建议永远加上，一眼看出条件到哪里结束", "绝不能加，加了会改变结果", "只有嵌套的时候才加", "加不加会让程序跑两种结果"],
          answer: 0,
          why: "括号在语法上不是必须，但它把条件圈起来，顺带避开加法这类优先级更高的运算符带来的误会。" },
        { id: "q8", type: "choice", score: 10,
          coversTask: 1,
          stem: "下面哪种场合最适合用三目，而不是别的分支写法？",
          options: ["从两个候选值里挑一个，逻辑一眼看完", "某个分支里要连着做三件事", "两个分支各要打印两行不同的内容", "同一个变量要对上五个固定选项（第 30 课那个结构更对口）"],
          answer: 0,
          why: "它的定位就是「二选一再存起来」这种小场面；一旦分支里要干的不止取值这一件事，就该回到 if/else 或 switch。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: 0, q3: 'std::println("{}", (x % 2 == 0) ? "even" : "odd");', q4: "未通过 7", q5: "冒号", q6: [0, 1], q7: 0, q8: 0 }
        ],
        wrongs: [
          { q1: 0, q2: 1, q3: 'std::println("{}", x % 2);', q4: "通过 3", q5: "问号", q6: [2, 3], q7: 1, q8: 3 },
          { q1: 2, q2: 3, q3: 'std::println("even");', q4: "未通过", q5: "", q6: [0], q7: 2, q8: 1 }
        ],
        loose: [
          { q1: "1", q2: "0", q3: 'println ( "{}" , x % 2 == 0 ? "even":"odd" ) ;', q4: "未通过  7", q5: ":", q6: [0, 1], q7: "0", q8: "0" }
        ]
      }
    },
    {
      cid: "c32", kind: "paper", pass: 60,
      title: "第 32 课考试 · 带初始化的 if",
      task: "任务题目：把 score 改成 80 判断走哪个分支；取消 if 之后那行注释，看编译器怎么报「answer 未定义」",
      hint: "想不起来就回看本课【演示 1】的整段和「它被设计成什么样」那三条收益。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          coversTask: 1,
          stem: "if (int answer = score * 2; answer > 150) { … } else { … }，把 score 改成 80，走哪一支？",
          options: ["走 if 那一支，因为 80 的两倍超过 150", "走 else 那一支，因为 160 不大于 150", "两支都不执行", "编译报错：80 不能参与判断"],
          answer: 0,
          why: "分号前先把 80 乘 2 得 160，分号后问「160 大于 150」为真，走 if 那一支。" },
        { id: "q2", type: "choice", score: 12,
          stem: "这个写法的括号里，那个分号起什么作用？",
          options: ["把「临时准备」和「真正的条件」切开：分号前是声明，分号后是条件", "分号前后两半都算条件", "分号只是装饰，删掉也能编译", "它表示这条判断要执行很多次"],
          answer: 0,
          why: "形状的全部信息量就在那个分号上：先准备一个数，再拿它去判断，两件事由分号分工。" },
        { id: "q3", type: "code", score: 20,
          coversTask: 1,
          stem: "（任务题）price 是 int。写一句带初始化的 if：分号前在里面声明 int doubled 并初值为 price * 2，分号后用 doubled > 150 作条件，大括号里用 std::println 把 doubled 打出来。",
          acceptRegex: ['if\\s*\\(\\s*int\\s+\\w+\\s*=', '\\w+\\s*>\\s*150'],
          why: "标准答案是 if (int doubled = price * 2; doubled > 150) { std::println(\"{}\", doubled); } —— 声明写在括号里、条件写在分号后，两样缺一不可。" },
        { id: "q4", type: "output", score: 14,
          coversTask: 1,
          stem: "这段代码打印什么？（一行一条）\nint score = 85;\nif (int answer = score * 2; answer > 150) {\n    std::println(\"超过 {}\", answer);\n} else {\n    std::println(\"没超过 {}\", answer);\n}",
          acceptLines: ["超过 170"],
          why: "85 的两倍是 170，170 大于 150 为真，走 if 那一支；answer 在括号里出生，这一支里当然查得到。" },
        { id: "q5", type: "blank", score: 10,
          coversTask: 2,
          stem: "一个变量「能被发现的地盘」，专业名词叫它的____。（填术语）",
          accept: ["作用域", "范围", "地盘"],
          why: "大括号就是地盘边界：if 里声明的名字只在这条 if（连同 else）的地盘里可用，出界即查无此人。" },
        { id: "q6", type: "multi", score: 14,
          stem: "关于带初始化的 if，下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["answer 在 else 分支里照样能用，因为 if 和 else 合起来是一条语句", "分号前只能塞一句准备，想先干两件事就提到 if 外面", "外面已有一个 answer，if 里再声明一个同名 answer，里面改了值外面那个也跟着变", "出了 if 之后 answer 其实还活着，只是编译器不许你用"],
          answers: [0, 1],
          why: "同名遮蔽时里面那个是独立的新变量，改它不动外面的；而 init 变量出了地盘是真的销毁了，不是「活着但被禁」。" },
        { id: "q7", type: "choice", score: 8,
          stem: "下面哪种情况最该退回「在外面声明」的老写法？",
          options: ["那个临时算出来的数，在 if 结束之后还要接着用", "条件特别简单", "只想打印一行", "else 分支是空的"],
          answer: 0,
          why: "带初始化的写法把寿命缩到最短，代价就是出界不能用；后面还要用那个数，就让它生在外面，这是正常需求。" },
        { id: "q8", type: "choice", score: 10,
          coversTask: 2,
          stem: "把 if 的大括号之后那行 std::println(\"{}\", answer); 的注释取消，编译器的反应是什么？",
          options: ["报错：这个名字在这一层地盘里没声明过", "警告一句，把 answer 当成 0", "照常编译，打印出一个垃圾值", "自动把 answer 提升到外面继续用"],
          answer: 0,
          why: "这正是本课的设计目标：名字绝对不可能泄漏到外面被误用，所以出界使用被当场抓住，而不是悄悄跑出一个怪数。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: 0, q3: "int price = 85;\nif (int doubled = price * 2; doubled > 150) {\n    std::println(\"{}\", doubled);\n}", q4: "超过 170", q5: "作用域", q6: [0, 1], q7: 0, q8: 0 }
        ],
        wrongs: [
          { q1: 1, q2: 1, q3: "int doubled = price * 2;\nif (doubled > 150) { }", q4: "超过 160", q5: "生命周期", q6: [2, 3], q7: 1, q8: 1 },
          { q1: 0, q2: 0, q3: "", q4: "没超过 170", q5: "", q6: [0], q7: 3, q8: 2 }
        ],
        loose: [
          { q1: "0", q2: "0", q3: "if( int  doubled = price*2 ; doubled >150 ) { std::println(\"{}\", doubled) ; }", q4: "超过  170", q5: "作用域", q6: [0, 1], q7: "0", q8: "0" }
        ]
      }
    },
    {
      cid: "c33", kind: "paper", pass: 60,
      title: "第 33 课考试 · while 循环",
      task: "任务题目：把条件改成 sum <= 10 看看少跑几圈；删掉 n++ 再运行（Ctrl+C 停），亲眼见识死循环",
      hint: "想不起来就回看本课【演示 2】的 sum 轨迹和【演示 3】的死循环现场。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          stem: "while 的执行顺序是什么？",
          options: ["先问条件，为真才进循环体；干完跳回括号再问一次", "先把循环体干完，再问一次条件", "条件和循环体同时执行，不分先后", "条件只在最开头问一次，之后不再问"],
          answer: 0,
          why: "「先问再干」是 while 的性格：判据永远在门口等着，答「真」才迈进大括号，一圈一圈问到假为止。" },
        { id: "q2", type: "choice", score: 12,
          coversTask: 1,
          stem: "源稿那段（n 从 1 起、每圈 sum += n 再 n++）把条件从 sum <= 50 改成 sum <= 10，循环跑几圈？",
          options: ["5 圈", "4 圈", "10 圈", "还是 10 圈"],
          answer: 0,
          why: "sum 的轨迹是 1、3、6、10、15：前四圈加完是 10，第五圈开始时问「10 小于等于 10」仍为真，于是明知会超标还是把 5 加了进去，加出 15 才被拦在门外 —— 判据只管这一圈开始之前的状态。" },
        { id: "q3", type: "output", score: 16,
          coversTask: 1,
          stem: "这段代码打印什么？（一行一条）\nint n = 1;\nint sum = 0;\nwhile (sum <= 10) {\n    sum += n;\n    n++;\n}\nstd::println(\"{} {}\", sum, n - 1);",
          acceptLines: ["15 5"],
          why: "sum 依次是 1、3、6、10、15 —— 条件是进门前问的，所以「明知会超标」的那一圈照样干完了；n 出口时是 6，减一报 5 圈。" },
        { id: "q4", type: "code", score: 14,
          coversTask: 2,
          stem: "（任务题）下面这段一跑就停不下来。在花括号里补一句，让它能自己停下来：\nint sum = 0;\nwhile (sum <= 50) {\n    std::println(\"跑一圈\");\n    // 在这里补一句\n}",
          acceptRegex: ['sum\\s*(\\+\\+|\\+=|=\\s*sum\\s*\\+)'],
          why: "死循环的根子是「没人在循环体里改变条件」。补 sum += 1; 或 sum++; 都行 —— 条件是判据，推动它的代码必须写在大括号里。" },
        { id: "q5", type: "blank", score: 10,
          coversTask: 2,
          stem: "条件永远为真、程序跑到天荒地老，这种情况叫____循环。（填一个字，或整个词）",
          accept: ["死", "死循环", "无限", "无限循环"],
          why: "源稿那句「没有 n++ 就是死循环」说的就是它；认出来的手段是看屏幕刷不停、程序不退出，按 Ctrl+C 杀掉。" },
        { id: "q6", type: "multi", score: 14,
          coversTask: 2,
          stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["循环体里必须有人推进条件，否则就是死循环", "条件一开始就是假的，循环体一次都不会执行", "累加器忘了给初值，可能一进门条件就是假，于是一圈都没跑", "while (sum = 50) 这种写法编译器一定会报错，拦在门外"],
          answers: [0, 1, 2],
          why: "最后一条不对：赋值表达式的值就是 50，非零即为真，条件永远成立 —— 编译器顶多给一句警告，程序照跑照死。" },
        { id: "q7", type: "choice", score: 10,
          stem: "删掉源稿里的 n++ 之后，程序会发生什么？",
          options: ["还是能停下来，但每圈只加 1，最后报的圈数变成 0", "立刻变成死循环，非 Ctrl+C 不可", "编译直接报错，说少了一句", "圈数照样报 10，不受影响"],
          answer: 0,
          why: "n 冻在 1，可 sum 每圈还在加 1，迟早越过上限；真正坏掉的是那句 n - 1 的统计。这题提醒：改条件的不止一处，删代码前先把「谁在推动条件」想清楚。" },
        { id: "q8", type: "order", score: 12,
          stem: "把「while 跑一圈」的动线排成正确顺序。",
          steps: ["执行循环体里的每一句", "在括号里问一次条件", "跳回括号，再问一次条件", "条件为真才迈进大括号"],
          answer: [1, 3, 0, 2],
          why: "顺序是问 → 进 → 干 → 再问；「跳回括号再问」这一步是循环之所以是循环的关键。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: 0, q3: "15 5", q4: "sum += 1;", q5: "死", q6: [0, 1, 2], q7: 0, q8: [1, 3, 0, 2] }
        ],
        wrongs: [
          { q1: 1, q2: 1, q3: "10 4", q4: "n++;", q5: "无解", q6: [3], q7: 1, q8: [0, 1, 2, 3] },
          { q1: 0, q2: 2, q3: "15 5", q4: "", q5: "", q6: [0, 1], q7: 3, q8: [0, 1, 2, 3] }
        ],
        loose: [
          { q1: "0", q2: "0", q3: " 15  5 ", q4: "sum= sum +1 ;", q5: "死循环", q6: [0, 1, 2], q7: "0", q8: ["1", "3", "0", "2"] }
        ]
      }
    },
    {
      cid: "c34", kind: "paper", pass: 60,
      title: "第 34 课考试 · do-while 循环",
      task: "任务题目：把 k 的初始值改成 5，说出会连跑几次；用 do-while 写倒计时 3、2、1，最后输出「发射！」",
      hint: "想不起来就回看本课【演示 2】的圈数算法和【演示 3】的倒计时写法。",
      questions: [
        { id: "q1", type: "choice", score: 10,
          stem: "do-while 和 while 的唯一区别是什么？",
          options: ["do-while 先干一次再问条件，循环体至少执行一次", "do-while 的条件写在前面，所以更安全", "do-while 不需要在循环体里推进条件", "do-while 天生不会死循环"],
          answer: 0,
          why: "问的时机从门口挪到了末尾，其余部分（推进条件、边界、初值、死循环风险）和 while 一字不差。" },
        { id: "q2", type: "choice", score: 14,
          coversTask: 1,
          stem: "源稿那段每圈打印 k 再 k++，条件仍是 k < 100。把 k 的初始值改成 5，会连跑几次？",
          options: ["95 次", "100 次", "96 次", "还是 1 次"],
          answer: 0,
          why: "k 从 5 一路打到 99，每圈末尾 k++ 后再问，问到 100 小于 100 为假时出圈 —— 5 到 99 共 95 个数，圈数是上限减起点。" },
        { id: "q3", type: "output", score: 16,
          coversTask: 1,
          stem: "这段代码打印什么？（一行一条，按顺序写）\nint k = 98;\ndo {\n    std::println(\"k = {}\", k);\n    k++;\n} while (k < 100);\nstd::println(\"结束\");",
          acceptLines: ["k = 98", "k = 99", "结束"],
          why: "先干再问：打印 98、k 变 99，问「99 小于 100」为真再来一圈；打印 99、k 变 100，问「100 小于 100」为假出圈 —— 等号正是在这里生效的。" },
        { id: "q4", type: "code", score: 22,
          coversTask: 2,
          stem: "（任务题）用 do-while 写倒计时：t 从 3 开始，每圈先打印 t 再让它减一，倒数到 0 就停，最后打印「发射！」。",
          acceptRegex: ['do\\s*\\{', 't\\s*(--|-=|\\s*=\\s*t\\s*-)', 'while\\s*\\(\\s*t\\s*>\\s*=?\\s*0\\s*\\)\\s*;'],
          why: "形状是 do { 打印; t--; } while (t > 0); 后面接发射 —— 三个要点：先进大括号、有人在圈里推进 t、末尾条件带分号。" },
        { id: "q5", type: "blank", score: 8,
          stem: "do-while 的右括号后面必须写一个____，这是它和 while 在写法上最显眼的一处不同。（填标点或其名字）",
          accept: ["分号", ";", "分号 ;"],
          why: "大括号后面那个 while(条件) 单独看是句没说完的话，得分号收尾才算完整 —— 忘写是本课最快的报错来源。" },
        { id: "q6", type: "multi", score: 14,
          stem: "下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["条件问在末尾，所以循环体至少执行一次", "do-while 一样可能死循环：「至少一次」不等于「只有一次」", "「先把菜单打出来，再问要不要继续」这类活适合 do-while", "反正只跑一次，int k; 不初始化也没关系"],
          answers: [0, 1, 2],
          why: "最后一条错：垃圾初值照样进圈做一次，还可能让末尾条件一直为真而停不下来；而且它不是「只跑一次」，条件为真就一圈圈继续。" },
        { id: "q7", type: "choice", score: 10,
          stem: "初值、条件、循环体都保持一样，只把 while 换成 do-while（源稿那种 k 已经是 100、条件 k < 100 的情形），结果怎样？",
          options: ["原本一次都不跑的，现在跑了一次", "跑的次数完全不变", "编译报错：结构不能这么换", "变成死循环"],
          answer: 0,
          why: "while 先问 → 假 → 0 次；do-while 先干 → 1 次。其余什么都不用改，差别全在问的时机。" },
        { id: "q8", type: "order", score: 6,
          stem: "把「do-while 跑一圈」的动线排成正确顺序。",
          steps: ["走到末尾问一次条件", "条件为真，回到 do 再干一圈", "进大括号，先把循环体干完", "条件为假，出圈继续走后面的代码"],
          answer: [2, 0, 1, 3],
          why: "第一步不是问条件而是直接进圈干活 —— 这一条就是它和 while 的分水岭，后面末尾的判断只管「要不要再来一圈」。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: 0, q3: "k = 98\nk = 99\n结束", q4: "int t = 3;\ndo {\n    std::println(\"{}\", t);\n    t--;\n} while (t > 0);\nstd::println(\"发射！\");", q5: "分号", q6: [0, 1, 2], q7: 0, q8: [2, 0, 1, 3] }
        ],
        wrongs: [
          { q1: 1, q2: 1, q3: "k = 98\nk = 99\nk = 100\n结束", q4: "while (t > 0) { std::println(\"{}\", t); t--; }", q5: "逗号", q6: [3], q7: 2, q8: [0, 1, 2, 3] },
          { q1: 0, q2: 3, q3: "k = 98\nk = 99", q4: "do { std::println(\"{}\", t); } while (t > 0);", q5: ";", q6: [0, 1], q7: 1, q8: [0, 1, 2, 3] }
        ],
        loose: [
          { q1: "0", q2: "0", q3: " k =  98 \nk =  99\n 结束 ", q4: "t=3;\ndo{ std::println(\"{}\", t); t = t - 1 ; } while(t>0) ;\nprintln(\"发射！\");", q5: ";", q6: [0, 1, 2], q7: "0", q8: ["2", "0", "1", "3"] }
        ]
      }
    }
  ]
};
