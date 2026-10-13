/* 喵站 · C++ 入门 考卷分部 p19：第 79–81 课（第九轮 · 入门收官：lambda 三件套）
 *
 * 每场卷照 cpp-exam/p13.js 的形状与硬指标（cpp-exam-check 逐条对账）：
 *   1. kind:"paper"，题型只用笔试引擎认的六种；
 *   2. 各题 score 相加正好 100；
 *   3. 源稿每一条【任务】都有题用 coversTask 对着它，任务题合计 ≥50 分；
 *   4. choice ≥2；output ≥1；每题带 why；
 *   5. selftest 的 refs 判 100、wrongs 判 <60、loose 判 ≥60。
 *
 * 守的闸线：三场卷都不碰 struct（83）、模板（84）、map（96）、set（100）、class（112），
 *   也不碰其他标准算法（count_if、find_if、transform 一族，82 课才教），只用第 65 课的 sort。
 *   读者看得见的字段一律中文括号，函数名裸写。
 * c81 是入门最后一课，那场里放了一道把入门串起来的大综合题（只用已教过的构造）。
 *
 * 验收：node dev/tools/cpp-exam-check.cjs --only c79,c80,c81
 */
window.MIAO_CPP_EXAM_P19 = {
  papers: [
    {
      cid: "c79", kind: "paper", pass: 60,
      title: "第 79 课考试 · lambda：一次性的小函数",
      task: "任务题目：写一把 lambda，收一个 int、返回它的平方，把 square(9) 打印出来；再顺手做一把不收任何参数、只还一句文字的小工具，喊它三次",
      hint: "想不起来就回看正文【演示 1】那两把工具、【演示 2】的 square，还有【常见坑】第一条关于句末分号。",
      questions: [
        { id: "q1", type: "choice", score: 16,
          coversTask: 1,
          stem: "任务要的是「收一个 int、返回它的平方、打印 square(9)」。下面哪一把工具真做得到，屏幕上会出现 81？",
          options: ["auto square = [](int x) { return x * x; }; 然后 std::println(\"{}\", square(9));", "auto square = [](int x) { return x + x; }; 然后 std::println(\"{}\", square(9));", "int square = 9 * 9; 然后 std::println(\"{}\", square);", "auto square = [](int x) { return x * x; }; 然后 std::println(\"{}\", square);"],
          answer: 0,
          why: "平方是 x 乘 x，9 得 81；第二条是加倍，9 只得 18。第三条压根不是 lambda，只是一个算完就定死的整数，任务要求的是「收原料再算」。第四条少了对上号的圆括号，递出去的是那把工具本身，编译器只报格式化不了。" },
        { id: "q2", type: "choice", score: 12,
          stem: "源稿第二把工具写成 auto hi = [] { return \"你好\"; }; —— 它的中括号后面直接跟花括号，参数表整个没有。想用它，下面哪一句是对的？",
          options: ["std::println(\"{}\", hi());", "std::println(\"{}\", hi);", "std::println(\"{}\", hi(0));", "参数表没写，所以这把工具喊不了"],
          answer: 0,
          why: "定义处的参数表可以省，那是「我不收原料」；调用处的那对圆括号不能省，那是「按下开关」。没有原料就写一对空括号，硬塞一个 0 反而对不上参数表。" },
        { id: "q3", type: "output", score: 16,
          coversTask: 1,
          stem: "这段程序打印什么？（一行一条，两行）\nauto square = [](int x) { return x * x; };\nstd::println(\"square(9) = {}\", square(9));\nauto again = square;\nstd::println(\"square(12) = {}\", again(12));",
          acceptLines: ["square(9) = 81", "square(12) = 144"],
          why: "square(9) 得 81。中间那句 auto again = square; 是这一课的关键手感：等号右边那个 square 是一段行为，它照样能被赋给第二个名字 —— 所以 again(12) 和 square(12) 是同一把工具，得 144。" },
        { id: "q4", type: "code", score: 14,
          coversTask: 1,
          stem: "补出求平方那把工具的开头那一截：中括号空着、参数表收一个 int。（只写关键前半句就行）",
          acceptRegex: ["\\[\\s*\\]\\s*\\(\\s*int"],
          why: "句式是 auto square = [](int x) { return x * x; }; —— 那对空中括号是 lambda 的身份证，整个省掉编译器就报 expected expression；空着则明说「我不拿外面的东西」。" },
        { id: "q5", type: "blank", score: 10,
          stem: "填一个词：想把 hi 这把工具真跑起来，名字后面必须紧跟着写上____；光写名字只是提到它，机器不会自己转。",
          accept: ["圆括号", "括号", "一对括号", "那对括号", "()"],
          why: "这一课最贵的手感就是这句：定义处的参数表可以整个省，调用处的那对括号一个都不能少。少了它，报错长得像 no matching function for call to 'println'。" },
        { id: "q6", type: "multi", score: 14,
          stem: "关于「一次性的小函数」，下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["只用一次、三五行见底的小逻辑，现场捏一把 lambda 最划算", "两处以上的函数都要用的那段逻辑，该写成有名字的正式函数", "lambda 能被赋给第二个名字照样喊，说明它是个值", "lambda 必须写在所有函数的外面，跟函数抢同一个位置"],
          answers: [0, 1, 2],
          why: "第四条说反了：lambda 就写在函数肚子里，那一层结束它跟着没了，这正是「一次性」的来源；要写在外面、谁都喊得到，那叫函数。前三条是这一课的判断表。" },
        { id: "q7", type: "order", score: 18,
          coversTask: 1,
          stem: "把「做一把 square 并把结果打印出来」这四个动作排成正确顺序。",
          steps: ["把还回来的 81 打印成一行字", "写身体：花括号里只留一条出货口 return x * x", "用 auto square = 接住中括号、参数表和身体，句末补上分号", "加上那对圆括号，把 9 塞进去喊它"],
          answer: [1, 2, 3, 0],
          why: "先有身体，才有完整的三截；三截写完才有那句 auto 声明（句末是分号，不是函数定义那种结尾）；声明跑过了才轮到加括号喊它，最后才谈得上把结果打印掉。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: 0, q3: "square(9) = 81\nsquare(12) = 144", q4: "auto square = [](int x) { return x * x; };", q5: "圆括号", q6: [0, 1, 2], q7: [1, 2, 3, 0] }
        ],
        wrongs: [
          { q1: 1, q2: 1, q3: "square(9) = 81\nsquare(12) = 144", q4: "auto square(int x) { return x * x; };", q5: "分号", q6: [0, 1, 3], q7: [0, 1, 2, 3] }
        ],
        loose: [
          { q1: "0", q2: "0", q3: " square(9) = 81 \n square(12) = 144 ", q4: "auto  square = [ ] ( int x ) { return x * x; } ;", q5: "括 号", q6: [0, 1, 2], q7: [1, 2, 3, 0] }
        ]
      }
    },
    {
      cid: "c80", kind: "paper", pass: 60,
      title: "第 80 课考试 · 捕获：让 lambda 记住外面的变量",
      task: "任务题目：源稿那把 bump 写成 [&counter]，身体里一句 counter++，喊两次外面真变 2。把中括号改成 [counter]，编译器会拦你 —— 说清它为什么拦、以及这一课给的解法是什么",
      hint: "想不起来就回看正文【演示 2】那条报错、【演示 1】的两行输出，还有那张照片对一根线的示意图。",
      questions: [
        { id: "q1", type: "choice", score: 16,
          coversTask: 1,
          stem: "把 bump 写成 auto bump = [counter] { counter++; }; 之后，程序会怎么样？",
          options: ["编译不过：按值带进来的那份是只读复印件，counter++ 最后那一步要写它", "照样跑，counter 变 2 —— 少个 & 不影响什么", "编译不过：中括号里点名必须加 &，[counter] 这个写法本身不合法", "能跑，但 counter 永远是 0，运行时才出问题"],
          answer: 0,
          why: "[counter] 合法（第 57 课就那么写的），问题出在身体里那句 counter++：读出来、加一、写回去，最后一步要把新值灌进包里那个盒子，而那份复印件被当成常量。所以是编译期就拦，不是跑到一半才错。" },
        { id: "q2", type: "choice", score: 14,
          coversTask: 1,
          stem: "报错长这样：cannot assign to variable 'counter' in lambda capture of type 'const int'。它到底在抱怨什么？",
          options: ["你想给包里那份复印件赋值，而它是按值抄来的、只读", "外面的 counter 被写成了 const int，谁都不能改它", "lambda 不能带参数，所以 counter++ 没处放", "counter 没在中括号里点名，编译器不认识它"],
          answer: 0,
          why: "关键在于 in lambda capture of type：说的是捕获进来的那一份，不是外面原件。外面 int counter = 0 一点不是 const；复印件才是只读的那个。没点名才会报 use of undeclared identifier，那是另一条错。" },
        { id: "q3", type: "output", score: 16,
          coversTask: 1,
          stem: "这段程序打印什么？（一行一条，两行）\nint base = 100;\nint counter = 0;\nauto add_base = [base](int x) { return base + x; };\nauto bump = [&counter] { counter++; };\nstd::println(\"add_base(5) = {}\", add_base(5));\nbump();\nbump();\nstd::println(\"counter = {}\", counter);",
          acceptLines: ["add_base(5) = 105", "counter = 2"],
          why: "base 按值带，抄进来就是 100，加参数 5 得 105。counter 按引用带：包里没有第二个盒子，两次 counter++ 写的都是外面那个 0，所以攒到 2。一把复印、一把引线，这就是源稿那一页摆的对照。" },
        { id: "q4", type: "code", score: 14,
          coversTask: 1,
          stem: "补出中括号那一段：让 bump 能真的改到外面那个 int 变量 counter。（关键就是中括号里那截写法）",
          acceptRegex: ["\\[\\s*&\\s*counter\\s*\\]"],
          why: " [&counter] —— & 紧挨名字写在中括号里，表示带的是通往原件的那根线，写它就是写 counter 本人。只写 [counter] 带进来的是只读复印件，赋不了值。" },
        { id: "q5", type: "blank", score: 10,
          stem: "填一个词：中括号里不带 & 抄进包里的变量是____的 —— 拿它做加减、拼字符串都行，唯独不能给它赋值。",
          accept: ["只读", "只能读", "readonly", "const"],
          why: "按值带的那份被当成常量，所以报错里才有 in lambda capture of type 'const int' 那半句。想改就得换带法，或者在身体里另开一个盒子。" },
        { id: "q6", type: "multi", score: 14,
          stem: "关于两种带法，下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["[x] 在定义那一刻复印一份，之后原件怎么改都不关它的事", "[&x] 读到的是外面那个变量的最新值", "[&x] 里给 x 赋值，改的是外面那个盒子本身", "一把 [&] 全带上，读代码的人一眼就知道你动了外面几个盒子"],
          answers: [0, 1, 2],
          why: "第四条正相反：[&] 一个名字都不点，省事是省事，但外面哪几个盒子被动过全看不出来，哪天某个盒子先没了就难查。前三条是这一课的三块基石。" },
        { id: "q7", type: "order", score: 16,
          coversTask: 1,
          stem: "把「用一根线把 counter 攒到 2」这四步排成正确顺序。",
          steps: ["打印 counter，屏幕上稳稳是 2", "先在外面写好 int counter = 0;", "中括号里写 [&counter]，把线留向外面", "喊 bump 两次，每次它都在外面那个盒子上加一"],
          answer: [1, 2, 3, 0],
          why: "盒子先存在，线才有得指；线接好之后 bump 才喊得动；两次累加写的都是外面那个盒子，最后打印才看得到 2。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: 0, q3: "add_base(5) = 105\ncounter = 2", q4: "auto bump = [&counter] { counter++; };", q5: "只读", q6: [0, 1, 2], q7: [1, 2, 3, 0] }
        ],
        wrongs: [
          { q1: 1, q2: 1, q3: "add_base(5) = 105\ncounter = 0", q4: "auto bump = [counter] { counter++; };", q5: "常量", q6: [0, 1, 3], q7: [0, 1, 2, 3] }
        ],
        loose: [
          { q1: "0", q2: "0", q3: " add_base(5) = 105 \n counter = 2 ", q4: "auto bump = [ & counter ] { counter ++ ; } ;", q5: "只 读", q6: [0, 1, 2], q7: [1, 2, 3, 0] }
        ]
      }
    },
    {
      cid: "c81", kind: "paper", pass: 60,
      title: "第 81 课考试 · lambda 配 sort：自定义排队规则",
      task: "任务题目：源稿给 std::sort 派了一把 [](int a, int b) { return a > b; } 的裁判，串从大到小排。把那句 a > b 改成 a < b，运行，说清顺序变成了什么样、为什么",
      hint: "想不起来就回看正文【演示 2】那个两版对照、那张裁判问答示意图，还有【常见坑】第一条关于平手要答假。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          coversTask: 1,
          stem: "把源稿裁判身体里那句 return a > b; 改成 return a < b;，程序会怎么样？",
          options: ["顺序翻过来，变成从小到大 1 2 5 8 9 —— 跟第 65 课那个不派裁判的 sort 效果一样", "还是从大到小，改符号不影响什么", "编译不过，a < b 这种写法不能递给 sort", "顺序不变，只是打印出来的样子不同"],
          answer: 0,
          why: "a < b 说的是「a 比 b 小就让它站前面」，串于是从前往后长上去。第 65 课那个只给头尾两截的 sort 走的正是同一条路 —— 默认规矩本来就是 a < b，这一改等于把默认规则亲手写了一遍。" },
        { id: "q2", type: "choice", score: 10,
          coversTask: 1,
          stem: "裁判身体里的 a 和 b，到底是什么东西？",
          options: ["两个元素在串里的位置号，从 0 数起", "sort 每次从串里挑出来、递给它的那两个元素本身", "你在 main 里手动传进去的初始值", "整串的第一个和最后一个，一场排序只问一次"],
          answer: 1,
          why: "sort 管怎么排，它自己决定挑哪两位来问；递进来的就是那两个值本身，跟站第几格无关。而且它会被喊很多次，不是一场只问一次 —— 所以规矩必须自洽。" },
        { id: "q3", type: "output", score: 14,
          coversTask: 1,
          stem: "这段程序打印什么？（一行一条，五行）\nstd::vector<int> nums = {5, 2, 8, 1, 9};\nstd::sort(nums.begin(), nums.end(), [](int a, int b) { return a > b; });\nfor (auto n : nums) std::println(\"{}\", n);",
          acceptLines: ["9", "8", "5", "2", "1"],
          why: "规矩是 a > b，即「大的站前面」，串被原地重排成从大到小，随后 range-for 按新顺序一行一个打出来。sort 不靠返回值交货，它改的就是 nums 自己。" },
        { id: "q4", type: "code", score: 14,
          coversTask: 1,
          stem: "补出那把降序裁判的身体：收到两位 a 和 b，谁该站在前面按大小定 —— 从大到小排。",
          acceptRegex: ["return\\s*a\\s*>\\s*b"],
          why: "一行 return a > b; 就是全部规矩：a 比 b 大时答真，sort 把 a 挪到前面。写 a >= b 就把平手那次也答了真，两位互相插队，sort 的前提被破坏。" },
        { id: "q5", type: "blank", score: 8,
          coversTask: 1,
          stem: "填一个词：std::sort 默认从小到大，想换成自己的规矩，就得给它派一个____ —— 收两个元素、还一句谁该站前面。",
          accept: ["裁判", "比较器", "比较函数", "比较规则", "小工具"],
          why: "这一课的比喻就是裁判：sort 负责怎么排（那是它琢磨了很多年的聪明办法），你负责按什么排。第三个参数那个格子就是留给它的。" },
        { id: "q6", type: "multi", score: 12,
          stem: "关于递给 sort 的那把 lambda，下面哪些说法是对的？（多选，错勾任何一项整题 0 分）",
          options: ["返回真，意思是 a 该排在 b 前面", "a 和 b 是 sort 从串里挑出来递给它的两个元素", "平手那次必须答假，所以规矩只能用 > 和 <，不能写 >= 或 <=", "sort 每场只喊裁判一次，所以身体里写什么都行"],
          answers: [0, 1, 2],
          why: "第四条正好说反：挑哪两位、问多少回都由 sort 决定，喊的次数多得很，正因为这样答案才必须自洽。前三条是这一课的三块基石 —— 尤其别把「真」理解成「a 更大」，它的意思是「a 该在前」。" },
        { id: "q7", type: "order", score: 10,
          coversTask: 1,
          stem: "把「让自己的规矩接管排队」这四步排成正确顺序。",
          steps: ["听裁判的答复排：答真则 a 在前，答假则不必", "备好那串数：std::vector<int> nums 装上几个值", "现场捏一把收两个元素、还一句真假的 lambda", "把 lambda 连同头尾两截一起塞进 std::sort 的三个格子"],
          answer: [1, 2, 3, 0],
          why: "先有串，才有得排；规矩写好了才能递；递进去之后 sort 才开始一次次问、一次次挪 —— 最后串被原地重排，你不用接返回值。" },
        { id: "q8", type: "output", score: 20,
          stem: "综合题（入门最后一场，把前面学的串起来）：这段程序打印什么？（一行一条，三行）\n#include <print>\n#include <vector>\n#include <algorithm>\nint main() {\n    std::vector<int> nums = {2, 8, 5};\n    int quota = 3;\n    auto enough = [quota](int x) { return x + quota >= 8; };\n    quota = 10;\n    std::sort(nums.begin(), nums.end(), [](int a, int b) { return a > b; });\n    for (auto n : nums) {\n        if (enough(n)) std::println(\"{} 够\", n);\n        else std::println(\"{} 差得远\", n);\n    }\n    return 0;\n}",
          acceptLines: ["8 够", "5 够", "2 差得远"],
          why: "四样东西叠在一起：第 40 课那串数、第 65 课的 sort 配上这一课的降序裁判（顺序变成 8、5、2）、第 57 与这一课的按值捕获 —— quota 后来被改成 10 也不算，包里那份停在定义那一刻的 3，所以 8 加 3 够、5 加 3 刚好够、2 加 3 差得远；最后 range-for 加 if 一行行往外打。要是你以为它追最新的 10，就会把三行都答成「够」。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: 1, q3: "9\n8\n5\n2\n1", q4: "return a > b;", q5: "裁判", q6: [0, 1, 2], q7: [1, 2, 3, 0], q8: "8 够\n5 够\n2 差得远" }
        ],
        wrongs: [
          { q1: 1, q2: 0, q3: "1\n2\n5\n8\n9", q4: "return a >= b;", q5: "开关", q6: [0, 1, 3], q7: [0, 1, 2, 3], q8: "8 够\n5 够\n2 够" }
        ],
        loose: [
          { q1: "0", q2: "1", q3: " 9 \n8\n 5\n2\n 1 ", q4: "return   a>b ;", q5: "裁 判", q6: [0, 1, 2], q7: [1, 2, 3, 0], q8: "8  够\n5 够 \n2 差得远" }
        ]
      }
    }
  ]
};
