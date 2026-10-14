/* cpp-exam-check 单轨规则（D-62）的自检样本：每条新红线各塞一个坏样本，证明那把尺不是哑巴。
   跑法：node dev/tools/cpp-exam-check.cjs --fixture
   ① c01 代码卷混进 choice ② c16 代码卷只 2 题 ③ c18 代码题没 acceptRegex
   ④ c07 笔试卷还剩 1 道 code ⑤ c08 笔试卷没填空也没勾线 ⑥ c09 勾线只 2 对
   ⑦ c10 勾线「左边第 i 项连右边第 i 项」⑧ c12 卷上 mode 与分配表不符
   ⑨ c03 coversTask 越界（源稿三条任务，第四道题声称盖第 4 条 —— 它会虚撑任务题分数）
   每一场除了它要犯的那一条，其余形制（权重和 100、任务对账、参考解/错解/宽松自测）都是对的。 */
window.MIAO_CPP_EXAM_P99 = {
  papers: [
    {
      cid: "c01", kind: "paper", mode: "code", pass: 60,
      title: "坏样本 · 代码卷混进选择题", task: "用 std::println 输出一行文字；理解 main 函数、头文件、编译命令",
      hint: "闸的自检样本，读者看不到。",
      questions: [
        { id: "q1", type: "code", score: 50, coversTask: 1, stem: "写一行：打出「在」。", acceptRegex: ["println\\s*\\("], why: "句式就是打一行文字。" },
        { id: "q2", type: "choice", score: 20, stem: "程序的入口是哪个函数？", options: ["printf", "main", "start", "begin"], answer: 1, why: "每个程序从 main 开始跑。" },
        { id: "q3", type: "code", score: 30, stem: "写出 main 函数那一行。", acceptRegex: ["int\\s+main\\s*\\("], why: "入口那一行的写法。" }
      ],
      selftest: {
        refs: [{ q1: 'std::println("在");', q2: 1, q3: "int main() { return 0; }" }],
        wrongs: [{ q1: 'printf("在");', q2: 0, q3: "int fn() {}" }],
        loose: [{ q1: 'std::println ( "在" ) ;', q2: "1", q3: "int  main ( ) { }" }]
      }
    },
    {
      cid: "c16", kind: "paper", mode: "code", pass: 60,
      title: "坏样本 · 代码卷只有两道", task: "取出编号中间那个字符；长度超出时自动取到结尾",
      hint: "闸的自检样本，读者看不到。",
      questions: [
        { id: "q1", type: "code", score: 50, coversTask: 1, stem: "写一行：取出 id 里中间那个短横。", acceptRegex: ["substr\\s*\\("], why: "按起点和长度取一段。" },
        { id: "q2", type: "code", score: 50, coversTask: 2, stem: "写一行：从 0 开始取一百个字符。", acceptRegex: ["substr\\s*\\(\\s*0\\s*,\\s*100"], why: "长度超出会自动到结尾。" }
      ],
      selftest: {
        refs: [{ q1: "id.substr(9, 1);", q2: "id.substr(0, 100);" }],
        wrongs: [{ q1: "id.size();", q2: "id.substr(0, 4);" }],
        loose: [{ q1: "id . substr ( 9 , 1 ) ;", q2: "id.substr( 0 , 100 ) ;" }]
      }
    },
    {
      cid: "c18", kind: "paper", mode: "code", pass: 60,
      title: "坏样本 · 代码题只给了字面 accept", task: "把 love 换成 hate；给自己的名字前后各加一个星号",
      hint: "闸的自检样本，读者看不到。",
      questions: [
        { id: "q1", type: "code", score: 50, coversTask: [1, 2], stem: "写一行：把 s 里的 love 换成 hate。", accept: ["hate"], why: "只写字面答案会把等价写法判错。" },
        { id: "q2", type: "code", score: 25, stem: "写一行：在 s 开头插入一个星号。", acceptRegex: ["insert\\s*\\(\\s*0"], why: "insert 在指定位置塞进去。" },
        { id: "q3", type: "code", score: 25, stem: "写一行：在 s 结尾插入一个星号。", acceptRegex: ["insert\\s*\\("], why: "位置给长度就插到结尾。" }
      ],
      selftest: {
        refs: [{ q1: 's.replace(0, 4, "hate");', q2: 's.insert(0, "*");', q3: 's.insert(s.length(), "*");' }],
        wrongs: [{ q1: 's.find("love");', q2: "s.size();", q3: "s.clear();" }],
        loose: [{ q1: 's.replace ( 0 , 4 , "hate" ) ;', q2: 's.insert ( 0 , "*" ) ;', q3: 's.insert( s.length( ) , "*" ) ;' }]
      }
    },
    {
      cid: "c07", kind: "paper", mode: "quiz", pass: 60,
      title: "坏样本 · 笔试卷还剩一道编辑器题", task: "哪些名字不合格；声明两个变量并打印",
      hint: "闸的自检样本，读者看不到。",
      questions: [
        { id: "q1", type: "choice", score: 40, coversTask: 1, stem: "下面哪个变量名合规矩？", options: ["2people", "class", "ban_ji", "int"], answer: 2, why: "不能以数字开头，不能是关键字。" },
        { id: "q2", type: "choice", score: 15, coversTask: 2, stem: "声明「班级人数」最合适的是哪一行？", options: ["int 班级人数;", "int class count;", "int classCount;", "class classCount;"], answer: 2, why: "驼峰或下划线，别带空格。" },
        { id: "q3", type: "output", score: 15, stem: "这两行打出什么？\nint a = 3;\nstd::println(\"{}\", a * 2 + 1);", acceptLines: ["7"], why: "先乘后加。" },
        { id: "q4", type: "blank", score: 15, stem: "装整数的小盒子用哪个类型名？（填英文）", accept: ["int"], why: "int 装整数。" },
        { id: "q5", type: "multi", score: 10, stem: "下面哪些是 C++ 的关键字？（多选）", options: ["int", "count", "auto", "name"], answers: [0, 2], why: "关键字是语言预留的。" },
        { id: "q6", type: "code", score: 5, stem: "写一行：打出数字 1。", acceptRegex: ["println\\s*\\(\\s*1"], why: "笔试卷不许出现编辑器。" }
      ],
      selftest: {
        refs: [{ q1: 2, q2: 2, q3: "7", q4: "int", q5: [0, 2], q6: 'std::println(1);' }],
        wrongs: [{ q1: 0, q2: 1, q3: "3", q4: "auto", q5: [1], q6: 'std::println(2);' }],
        loose: [{ q1: "2", q2: "2", q3: " 7 ", q4: " INT ", q5: [0, 2], q6: 'std::println ( 1 ) ;' }]
      }
    },
    {
      cid: "c08", kind: "paper", mode: "quiz", pass: 60,
      title: "坏样本 · 笔试卷全是选择", task: "先心算再看程序算得对不对；新加一行打印结果",
      hint: "闸的自检样本，读者看不到。",
      questions: [
        { id: "q1", type: "choice", score: 40, coversTask: 1, stem: "a 是 7、b 是 3，a / b 得几？", options: ["2", "2.33", "1", "3"], answer: 0, why: "整数除整数还是整数。" },
        { id: "q2", type: "choice", score: 20, coversTask: 2, stem: "想打出 a 加 b 的和，该写哪一行？", options: ['std::println(\"{}\", a + b);', "std::println(a + b);", 'std::println(\"{}\");', "println a + b;"], answer: 0, why: "占位写在引号里，值放后面。" },
        { id: "q3", type: "output", score: 15, stem: "这段打出什么？\nint a = 7, b = 3;\nstd::println(\"{}\", a % b);", acceptLines: ["1"], why: "7 除以 3 余 1。" },
        { id: "q4", type: "multi", score: 10, stem: "哪些写法合法？（多选）", options: ["int a = 3;", "int a = b;", "auto a = 3;", "3 = a;"], answers: [0, 2], why: "左边得是名字。" },
        { id: "q5", type: "order", score: 10, stem: "把「声明变量到打印」排个序。", steps: ["写好类型和名字", "给它一个值", "打印它", "看见结果"], answer: [0, 1, 2, 3], why: "先有盒子才能放东西。" },
        { id: "q6", type: "choice", score: 5, stem: "a = 3 这个动作叫什么？", options: ["比较", "赋值", "声明", "调用"], answer: 1, why: "把值装进盒子。" }
      ],
      selftest: {
        refs: [{ q1: 0, q2: 0, q3: "1", q4: [0, 2], q5: [0, 1, 2, 3], q6: 1 }],
        wrongs: [{ q1: 1, q2: 2, q3: "2", q4: [1, 3], q5: [3, 2, 1, 0], q6: 0 }],
        loose: [{ q1: "0", q2: "0", q3: " 1 ", q4: [0, 2], q5: [0, 1, 2, 3], q6: "1" }]
      }
    },
    {
      cid: "c09", kind: "paper", mode: "quiz", pass: 60,
      title: "坏样本 · 勾线只有两对", task: "算算 100 分钟是几小时几分钟；把 10.0 改成 10 看输出",
      hint: "闸的自检样本，读者看不到。",
      questions: [
        { id: "q1", type: "choice", score: 40, coversTask: 1, stem: "100 分钟是几小时几分钟？", options: ["1 小时 40 分", "2 小时", "1 小时 20 分", "40 分"], answer: 0, why: "除以 60 取整，余数就是分钟。" },
        { id: "q2", type: "choice", score: 10, coversTask: 2, stem: "把 10.0 写成 10，输出会怎样？", options: ["变成 10", "还是 10.0", "报错", "变成 0"], answer: 0, why: "整数值打成整数。" },
        { id: "q3", type: "output", score: 10, stem: "这段打出什么？\nstd::println(\"{}\", 100 / 60);", acceptLines: ["1"], why: "整数相除砍尾巴。" },
        { id: "q4", type: "blank", score: 10, stem: "取余数用哪个运算符？（填符号）", accept: ["%", "取余"], why: "百分号就是余数。" },
        { id: "q5", type: "multi", score: 10, stem: "哪些是小数类型？（多选）", options: ["double", "int", "float", "bool"], answers: [0, 2], why: "int 装整数。" },
        {
          id: "q6", type: "match", score: 20, stem: "把类型和它装的东西连起来。",
          left: ["int", "bool"], right: ["装整数", "装是或否"],
          answer: { int: "装整数", bool: "装是或否" },
          why: "少于 3 对就是送分。"
        }
      ],
      selftest: {
        refs: [{ q1: 0, q2: 0, q3: "1", q4: "%", q5: [0, 2], q6: { int: "装整数", bool: "装是或否" } }],
        wrongs: [{ q1: 1, q2: 1, q3: "2", q4: "/", q5: [1], q6: { int: "装是或否", bool: "装整数" } }],
        loose: [{ q1: "0", q2: "0", q3: " 1 ", q4: " % ", q5: [0, 2], q6: { int: "装整数", bool: "装是或否" } }]
      }
    },
    {
      cid: "c10", kind: "paper", mode: "quiz", pass: 60,
      title: "坏样本 · 勾线左右自对", task: "把超长字面量的类型改成 int；用 int 装 90 亿会怎样",
      hint: "闸的自检样本，读者看不到。",
      questions: [
        { id: "q1", type: "choice", score: 40, coversTask: 1, stem: "400000000000 这种字面量后面跟 LL 是给谁用的？", options: ["告诉编译器这是 long long", "告诉编译器这是字符串", "告诉编译器四舍五入", "没意义"], answer: 0, why: "后缀定类型。" },
        { id: "q2", type: "choice", score: 10, coversTask: 2, stem: "用 int 装 90 亿会怎样？", options: ["存不下，值变歪", "自动扩容", "报运行时错", "没事"], answer: 0, why: "超出范围就溢出。" },
        { id: "q3", type: "output", score: 10, stem: "这段打出什么？\nstd::println(\"{}\", 7);", acceptLines: ["7"], why: "占位换成值。" },
        { id: "q4", type: "blank", score: 10, stem: "long long 比 int 装得____。（填一个字）", accept: ["多", "大", "宽"], why: "位数更多。" },
        {
          id: "q5", type: "match", score: 20, stem: "把类型和它的大小连起来。",
          left: ["int", "long long", "char"], right: ["4 字节", "8 字节", "1 字节"],
          answer: { int: "4 字节", "long long": "8 字节", char: "1 字节" },
          why: "左边第 i 项正好连右边第 i 项 —— 不用想就连完了。"
        },
        { id: "q6", type: "multi", score: 10, stem: "哪些是整数类型？（多选）", options: ["int", "double", "long long", "bool"], answers: [0, 2], why: "double 是小数。" }
      ],
      selftest: {
        refs: [{ q1: 0, q2: 0, q3: "7", q4: "多", q5: { int: "4 字节", "long long": "8 字节", char: "1 字节" }, q6: [0, 2] }],
        wrongs: [{ q1: 1, q2: 1, q3: "8", q4: "少", q5: { int: "8 字节", "long long": "4 字节", char: "1 字节" }, q6: [1] }],
        loose: [{ q1: "0", q2: "0", q3: " 7 ", q4: " 多 ", q5: { int: "4字节", "long long": "8字节", char: "1字节" }, q6: [0, 2] }]
      }
    },
    {
      cid: "c12", kind: "paper", mode: "code", pass: 60,
      title: "坏样本 · 卷上 mode 与分配表不符", task: "把 grade 换成 C 看编号；把 true 改成 false 看输出",
      hint: "闸的自检样本，读者看不到。",
      questions: [
        { id: "q1", type: "choice", score: 40, coversTask: 1, stem: "字符 'C' 在编码表里的编号是几？", options: ["65", "66", "67", "43"], answer: 2, why: "A 是 65，往后数两位。" },
        { id: "q2", type: "choice", score: 10, coversTask: 2, stem: "bool 打成 false 时屏幕上显示什么？", options: ["false", "0", "空", "1"], answer: 1, why: "bool 打出来是 0 或 1。" },
        { id: "q3", type: "output", score: 10, stem: "这段打出什么？\nbool on = false;\nstd::println(\"{}\", on);", acceptLines: ["0"], why: "false 就是 0。" },
        { id: "q4", type: "blank", score: 10, stem: "'A' 用的是单引号还是双引号？（填一个字）", accept: ["单"], why: "单引号是一个字符。" },
        { id: "q5", type: "multi", score: 15, stem: "下面哪些说法对？（多选）", options: ["char 只装一个字符", "双引号是字符串", "bool 能装 3 个值", "char 用双引号"], answers: [0, 1], why: "一套规矩。" },
        { id: "q6", type: "order", score: 15, stem: "把「给 bool 赋值到打印」排个序。", steps: ["写 bool 和名字", "给它 true 或 false", "打印", "看见 0 或 1"], answer: [0, 1, 2, 3], why: "先声明再用。" }
      ],
      selftest: {
        refs: [{ q1: 2, q2: 1, q3: "0", q4: "单", q5: [0, 1], q6: [0, 1, 2, 3] }],
        wrongs: [{ q1: 0, q2: 0, q3: "1", q4: "双", q5: [2, 3], q6: [3, 2, 1, 0] }],
        loose: [{ q1: "2", q2: "1", q3: " 0 ", q4: " 单 ", q5: [0, 1], q6: [0, 1, 2, 3] }]
      }
    },
    {
      cid: "c03", kind: "paper", mode: "quiz", pass: 60,
      title: "坏样本 · coversTask 越界", task: "解开注释读报错；试试小数赋给整数；想想为什么不报错",
      hint: "闸的自检样本，读者看不到。",
      questions: [
        { id: "q1", type: "choice", score: 40, coversTask: 1, stem: "把一句带引号的文字赋给整数变量，编译器第一件事干什么？", options: ["当场报错，编译不过", "默默改成 0", "把它拼出来", "自动换成字符串"], answer: 0, why: "类型对不上编译阶段就拦。" },
        { id: "q2", type: "choice", score: 15, coversTask: 2, stem: "把 3.9 赋给一个整数变量，留下的部分是？", options: ["3", "4", "0.9", "3.9"], answer: 0, why: "砍尾巴，不四舍五入。" },
        { id: "q3", type: "output", score: 15, coversTask: 3, stem: "这段打出什么？\nint a = 3.2;\nstd::println(\"{}\", a);", acceptLines: ["3"], why: "小数部分在赋值那一刻就没了。" },
        { id: "q4", type: "blank", score: 10, coversTask: 4, stem: "整数除法会____掉小数部分。（填两个字）", accept: ["砍掉", "舍去"], why: "源稿只有三条任务，这第四号是虚的 —— 它会把任务题分数虚撑上去。" },
        { id: "q5", type: "multi", score: 10, stem: "下面哪些是编译器会拦下来的错？（多选）", options: ["类型对不上", "少写分号", "运行到一半才发生的越界", "名字没人认识"], answers: [0, 1, 3], why: "编译期拦静态错。" },
        { id: "q6", type: "choice", score: 10, stem: "报错信息第一行通常告诉你什么？", options: ["哪一行、什么错", "怎么改才对", "程序为什么慢", "编译器版本"], answer: 0, why: "先看第一行。" }
      ],
      selftest: {
        refs: [{ q1: 0, q2: 0, q3: "3", q4: "砍掉", q5: [0, 1, 3], q6: 0 }],
        wrongs: [{ q1: 1, q2: 1, q3: "3.2", q4: "进位", q5: [2], q6: 1 }],
        loose: [{ q1: "0", q2: "0", q3: " 3 ", q4: " 舍去 ", q5: [0, 1, 3], q6: "0" }]
      }
    }
  ]
};
