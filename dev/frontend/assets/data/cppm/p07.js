/* 喵站 · C++ 掌握 正文分部 p07：第 101–104 课
 *
 * 源稿：101_queue队列.cpp、102_stack栈.cpp、103_优先队列.cpp、104_pair与结构化绑定.cpp
 * 这四课是「队列家族」的整段：先学排队，再学摞盘子，再学 VIP 队伍，最后学怎么把两个值打包。
 * 共同主线是第 86 课埋下的那句判断 —— 有范围要全表用筛，一个个来要当前最值用堆。
 */
window.MIAO_CPPM_P07 = {
  chapters: [
    {
      id: `m101`, title: `第 101 课 · queue 队列：只许队尾进、队首出`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把「排队叫号」写成程序 —— 用 queue 从队尾 push、从队首 front 加 pop 离开，并且说清 queue 为什么只给这三下。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `vector 是**随便翻**的容器：想拿第几格就写第几格，从头到尾都能遍历。但「排队」这件事不该这么自由 —— 你不能插队，也不能从中间挑一个人出来办。std::queue 就是把这种规矩**写进接口里**的容器：只能从队尾放人（push），只能从队首看人（front）和把人送走（pop），中间那一串格子你连碰都碰不到。` },
        { t: `p`, text: `一句话概括：**先进先出**，First In First Out，圈子里写成 FIFO。先来的人先办事，谁也不能插队。这就是窗口叫号、打印机任务、消息转发这些场景的默认模型 —— 办事的顺序必须等于到达的顺序，否则就要出事。` },
        { t: `p`, text: `这里有一个非常容易被忽略的细节，也是本课最值钱的一句：**pop 不返回被送走的那个值**。它的职责只是「把排头那个删掉」，返回类型是 void。想拿到那个人，必须先用 front 看一眼，再 pop。很多从别的语言过来的同学会写 int v = line.pop(); 编译器直接拒绝，报的是「void 不能赋给 int」一类的错。这不是设计缺陷：如果 pop 要返回元素，它就得先复制一份再删掉，而复制**可能失败抛异常** —— 复制抛了，元素已经删了，值又没送到你手上，数据凭空消失。所以标准库把「看」和「删」拆成两个动作，各干各的，谁也不会丢东西。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `queue 的接口窄到只有这么几个成员：empty 问「还有人吗」、size 问「有几个人」、front 问「排头是谁」（只看不拿）、back 问「队尾是谁」、push 往队尾放、pop 把排头送走。注意它**没有下标运算符**，也**不是可遍历序列** —— 你拿不到 queue.begin()，不能 range-for，不能 sort。这份「残缺」是故意的：**接口不给你的操作，就是你不该做的事**。想检查整条队伍，唯一的办法是一边叫号一边抄下来，这本身就符合现实。` },
        { t: `code`, lang: `text`, code: `queue 的门只有两扇：
   push  ────────────────▶  [ 小明 ][ 小红 ][ 小强 ]  ──▶ front / pop
 （只从这头进）              队尾                     队首（只从这头出）

 能问的：empty  size  front  back        不能做的：下标、遍历、排序、从中间删` },
        { t: `p`, text: `第 88 课那句「容器选错了，代码怎么写都别扭」在这儿最明显：用 vector 模拟队列，代码能跑，但你**没法阻止**自己或同事哪天写一句 v[2] 去插队；换成 queue，越界的那句话根本编译不过去。这就是「用类型把规矩钉住」的价值 —— 规矩写在类型里，比写在注释里可靠得多。` },
        { t: `h2`, text: `怎么做` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <queue>
#include <string>
int main() {
    std::queue<std::string> line;
    line.push("小明");                       // 从队尾排队
    line.push("小红");
    line.push("小强");
    while (!line.empty()) {                  // 先问有没有人
        std::println("叫号: {}", line.front());
        line.pop();                          // 办完离队
    }
    return 0;
}` },
        { t: `p`, text: `尖括号里放的是**队伍里装的东西的类型**，第 40 课 vector 那套写法照搬过来：std::queue<std::string> 是「一条装着字符串的队伍」。放人叫 push，看排头叫 front，送走叫 pop，空了叫 empty —— 这四个词的搭配是固定的，写熟就不要再问「是不是该写 append」。` },
        { t: `p`, text: `while 里那句 !line.empty() 是这段的**保命符**：queue 对空队伍做 front 或 pop，不会给你任何异常、也不会给你 null，它是**未定义行为** —— 轻则打印出乱码，重则当场崩，甚至今天不崩明天崩。所有队列代码的循环条件都长这样，先问有没有人，再办事。` },
        { t: `p`, text: `最后注意叫号循环把队伍**清空了**：pop 是真的删人，不是移动指针。这是本课和 vector 最大的手感差别 —— 你在遍历 vector 时数据还在，你「遍历」queue 时数据就没了。如果一会儿还要用这份名单，得先复制一份再叫号（queue 是值类型，赋值就是整份复制，第 88 课那条在这里同样成立）。` },
        { t: `svg`, caption: `queue 的两扇门：push 从队尾加，front 与 pop 从队首取，中间不许碰`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250">
  <g font-size="13" fill="#142639" text-anchor="middle">
    <text x="70" y="26" text-anchor="start" font-weight="700">队伍变化三步（队首在右）</text>
    <text x="120" y="60" fill="#00599c" font-weight="700">push 小明</text>
    <text x="300" y="60" fill="#00599c" font-weight="700">再 push 小红、小强</text>
    <text x="530" y="60" fill="#1a7f42" font-weight="700">front 看一眼再 pop</text>
  </g>
  <g font-size="13">
    <rect x="80" y="80" width="64" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="112" y="106" text-anchor="middle">小明</text>
    <rect x="200" y="80" width="64" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="232" y="106" text-anchor="middle">小明</text>
    <rect x="264" y="80" width="64" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="296" y="106" text-anchor="middle">小红</text>
    <rect x="328" y="80" width="64" height="40" fill="#fff3d6" stroke="#b8722b" stroke-width="2.5"/><text x="360" y="106" text-anchor="middle" font-weight="700">小强</text>
    <rect x="470" y="80" width="64" height="40" fill="#e7f6ec" stroke="#1a7f42"/><text x="502" y="106" text-anchor="middle">小红</text>
    <rect x="534" y="80" width="64" height="40" fill="#fff3d6" stroke="#b8722b" stroke-width="2.5"/><text x="566" y="106" text-anchor="middle" font-weight="700">小强</text>
  </g>
  <g font-size="12">
    <text x="112" y="138" text-anchor="middle" fill="#57677c">队首＝队尾</text>
    <text x="232" y="138" text-anchor="middle" fill="#57677c">队首</text>
    <text x="360" y="138" text-anchor="middle" fill="#b8722b" font-weight="700">队尾</text>
    <text x="502" y="138" text-anchor="middle" fill="#1a7f42">front 看的是这格</text>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="40" y="176">小明已办完离开，队伍剩两人 —— pop 是真删，不是记个指针</text>
    <text x="40" y="200">中间那格小红：既不能跳过来，也不能被单独抽走，接口没有这个门</text>
    <text x="40" y="228" font-weight="700" fill="#00599c">进：push 只在队尾　　出：front 与 pop 只在队首</text>
  </g>
</svg>` },
        { t: `h2`, text: `演示 1 · 队首与队尾各是谁` },
        { t: `code`, lang: `c++`, code: `// 承接上一段：line 里依次是 小明、小红、小强
std::println("队伍人数: {}", line.size());
std::println("排头 front: {}", line.front());
std::println("排尾 back:  {}", line.back());
line.pop();
std::println("送走一个后 front: {}", line.front());` },
        { t: `p`, text: `back 答案是「小强」—— queue **有** back，它返回队尾那个元素，也就是最后 push 进来的人，同样只看不拿。它常被误当成「pop 之前的暂存位」，其实不是：pop 送走的是队首，back 说的是队尾，两头各管一头，用起来不会冲突。pop 一次之后 front 从「小明」变成「小红」，这也顺便证明了**pop 只删队首**。` },
        { t: `h2`, text: `演示 2 · 模拟银行窗口` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <queue>
int main() {
    std::queue<int> hall;                        // 队伍里装的是取号的人
    for (int i = 1; i <= 5; ++i) {
        hall.push(i);                            // 来一位：进门取号
        std::println("{} 号进门，厅内 {} 人", i, hall.size());
        if (i % 2 == 0) {                        // 每来两位，窗口办走一位
            std::println("窗口办理 {} 号", hall.front());
            hall.pop();                          // 办完离队
        }
    }
    return 0;
}` },
        { t: `p`, text: `这段把「push 进来、pop 出去」交织在同一圈里，是很现实的形状：客人陆陆续续到，窗口陆陆续续办，队伍时时长时短。跟着圈走一遍数字：1 号进，厅内 1 人，不办；2 号进，2 人，办走排头的 1 号剩 1 人；3 号进，2 人；4 号进，3 人，办走此时的排头 2 号剩 2 人；5 号进，3 人。全程最长到过 3 人，打烊时厅里还留着 3、4、5 三个人 —— 注意 4 号那一步办走的是 2 号而不是 4 号，**排头不一定是最新来的那个**，这正是先进先出。` },
        { t: `h2`, text: `演示 3 · 想遍历整条队伍怎么办` },
        { t: `code`, lang: `c++`, code: `// queue 没有 begin 和 end，只能一边 pop 一边抄
std::queue<std::string> copy = line;        // 值类型：复制一份再折腾
std::vector<std::string> log;
while (!copy.empty()) {
    log.push_back(copy.front());
    copy.pop();
}
for (const std::string& n : log) std::println("{}", n);` },
        { t: `p`, text: `这就是队列的「遍历」姿势：**要么消耗掉它，要么先复制再消耗**。别嫌麻烦，这恰好反映了 queue 的定位 —— 它是一条正在被处理的流水线，不是一份存档。要存档就用 vector，要流水就用 queue，两个都要就像这样组合（注意本段用了 vector，是第 40 课的老朋友，尖括号里同样放元素类型）。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把 pop 当「取出来」用，写 int v = q.pop(); —— 编译不过，pop 返回 void。正确两步：先看 q.front()，再 q.pop()。`,
          `空队列上 front 或 pop。没有异常、没有 null，是未定义行为，症状可能是「打印出一堆乱码」或者「跑一半崩」。每次动手前先 !q.empty()。`,
          `想下标访问 q[0]，或者 range-for 遍历 q。queue 不提供这两样，编译器直接报找不到成员 —— 这是特性不是缺漏，需要随机访问请换回 vector。`,
          `叫号循环跑完才发现队伍已经空了，后面的代码拿不到名单。pop 是真的删人，要留档就先复制一份（q 是值类型，赋值即整份复制）。`,
          `front 拿副本再改。auto name = q.front() 得到的是复制出来的新变量，改它改不到队伍里。想边看边改就写 auto& ref = q.front()，第 61 课那条引用规矩在这儿照样适用。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `查一查 queue 有没有 back()？它返回谁？动手打印一次，和 front 对比着看`,
          `模拟银行：来一个客人 push，服务完 pop，打印每一步（进门、办理、厅内人数都要打出来）`,
          `延伸：把上面那台「取号加办理」改成先让五个人全部进门，再统一叫号，对比两种写法下队伍最大长度分别是多少。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：queue 把「排队」的规矩钉进了类型 —— push 只进队尾，front 与 pop 只在队首，pop 只删不返回；想拿人，就先看一眼再送走。` }
      ]
    },
    {
      id: `m102`, title: `第 102 课 · stack 栈：一摞盘子，最后放的先拿`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用 stack 写「后进先出」—— 顶上放、顶上拿，并把它用在两件老事上：判断括号匹配、把十进制数转成二进制。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `食堂摞盘子：新盘子压在**最上面**，要拿也只能拿**最上面**那只。最后放上去的，最先被拿走 —— 这叫**后进先出**，Last In First Out，写成 LIFO。std::stack 就是把这条规矩钉进类型的容器：push 往顶上放，top 看顶上是谁，pop 把顶上那只拿走，empty 问这摞还剩下几个。` },
        { t: `p`, text: `上一课的 queue 是「两扇门」：进在一头、出在另一头；这一课的 stack 只有**一扇门**，进和出都在顶上。别小看这点差别，它决定了两种完全不同的用法 —— 排队办事要「按来的顺序」，那就是队列；**先把最新的压住、等时机到了回头处理**，这就是栈。编辑器的撤销、浏览器的后退、函数调用「谁调用了谁」的记录，全是回头处理，所以全是栈。` },
        { t: `p`, text: `成员函数的分工和上一课一样要记牢：**top 返回顶上那个元素**（而且返回的是引用，可以直接改），**pop 只负责删、返回 void**。所以「拿一个下来看看」的标准两步是：先读 top，再 pop。写 int v = plates.pop(); 编译器会拒绝你，理由和第 101 课那条完全一样 —— 把值交出去和把它删掉分成两件事，中间就不会丢东西。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `stack 同样**没有下标、不能遍历**：你只能看见顶上那一个，下面的全部被盖住。这份「只能看一层」看着残缺，其实正是它的价值 —— 栈类问题的共同特征是**只有最近的一件事还没处理完**，远处的东西你压根不该碰。写代码时如果发现自己老想「看看栈中间那个」，多半是容器选错了，该用 vector。` },
        { t: `code`, lang: `text`, code: `push 1  push 2  push 3  push 4          top 看 + pop 拿
   ┌───┐                                    ┌───┐
   │ 4 │ ◀── 顶上只有这一格能碰            │ 3 │
   ├───┤                                    ├───┤
   │ 3 │                                    │ 2 │   拿出来的顺序
   ├───┤                                    ├───┤   4 3 2 1
   │ 2 │                                    │ 1 │   ── 正好是放进去的反面
   ├───┤                                    └───┘
   │ 1 │
   └───┘` },
        { t: `p`, text: `「倒过来」这件事在数学上有个名字叫**逆序**，而栈天生就做逆序，不需要你写任何倒着走的循环。这是本课最该带走的手感：凡是「先产生的要用在后面」，就想想栈 —— 括号匹配里等配对的左括号、进制转换里从低位到高位的余数、撤销历史里最新的一步，全是这一形状。` },
        { t: `h2`, text: `怎么做` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <stack>

int main() {
    std::stack<int> plates;
    for (int v : {1, 2, 3, 4}) plates.push(v);   // 依次摞盘子
    while (!plates.empty()) {
        std::print("{} ", plates.top());         // 先看顶上是谁
        plates.pop();                             // 再拿走
    }
    std::println("← 和放进去的顺序相反");
    return 0;
}` },
        { t: `p`, text: `输出是 4 3 2 1 ← 和放进去的顺序相反，一行就够，因为 print 不换行、最后那句 println 补了换行。结构上只有两小块值得记：**push 用 range-for 一次摞进去**（第 43 课那个圈，套在花括号列表上），**弹出循环的条件是 !plates.empty()** —— 空栈上 top 或 pop 同样是未定义行为，不会给你异常，也不会给你 -1，它只是「碰巧还能跑」，换个编译器就崩。` },
        { t: `svg`, caption: `栈只有一扇门：push 压在顶上，top 与 pop 也只碰顶上，下面全被盖住`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 244">
  <g font-size="13" text-anchor="middle" fill="#142639">
    <text x="105" y="28" fill="#00599c" font-weight="700">摞进去 1 2 3 4</text>
    <text x="330" y="28" fill="#b8722b" font-weight="700">top 只看这一格</text>
    <text x="545" y="28" fill="#1a7f42" font-weight="700">pop 之后</text>
  </g>
  <g font-size="13" text-anchor="middle">
    <rect x="60" y="44" width="90" height="34" fill="#eaf3fb" stroke="#00599c"/><text x="105" y="66">4</text>
    <rect x="60" y="78" width="90" height="34" fill="#eaf3fb" stroke="#00599c"/><text x="105" y="100">3</text>
    <rect x="60" y="112" width="90" height="34" fill="#eaf3fb" stroke="#00599c"/><text x="105" y="134">2</text>
    <rect x="60" y="146" width="90" height="34" fill="#eaf3fb" stroke="#00599c"/><text x="105" y="168">1</text>
    <text x="105" y="196" fill="#57677c" font-size="12">底下三格看不见也摸不着</text>
    <rect x="285" y="44" width="90" height="34" fill="#fff3d6" stroke="#b8722b" stroke-width="2.5"/><text x="330" y="66" font-weight="700">4</text>
    <rect x="285" y="78" width="90" height="34" fill="#eaf3fb" stroke="#00599c"/><text x="330" y="100">3</text>
    <rect x="285" y="112" width="90" height="34" fill="#eaf3fb" stroke="#00599c"/><text x="330" y="134">2</text>
    <rect x="285" y="146" width="90" height="34" fill="#eaf3fb" stroke="#00599c"/><text x="330" y="168">1</text>
    <path d="M400 61 L440 61" stroke="#b8722b" stroke-width="2.5" fill="none"/>
    <polygon points="440,61 430,55 430,67" fill="#b8722b"/>
    <text x="420" y="52" fill="#b8722b" font-size="12">top</text>
    <rect x="500" y="44" width="90" height="34" fill="#e7f6ec" stroke="#1a7f42"/><text x="545" y="66" font-weight="700">3</text>
    <rect x="500" y="78" width="90" height="34" fill="#eaf3fb" stroke="#00599c"/><text x="545" y="100">2</text>
    <rect x="500" y="112" width="90" height="34" fill="#eaf3fb" stroke="#00599c"/><text x="545" y="134">1</text>
    <text x="545" y="164" fill="#1a7f42" font-size="12">4 被拿走了，新的顶上是 3</text>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="40" y="222">弹出顺序 4 3 2 1 —— 栈不用写倒着走的循环，天生就把顺序反过来</text>
  </g>
</svg>` },
        { t: `h2`, text: `演示 1 · 括号匹配：左压右配` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <stack>
#include <string>
// 先只认圆括号：左括号压栈等配对，右括号跟栈顶那一只配掉
bool ok(const std::string& s) {
    std::stack<char> left;
    for (char c : s) {
        if (c == '(') left.push(c);                 // 还没配对的先摞起来
        else if (left.empty()) return false;        // 右括号来了却没人配
        else left.pop();                             // 栈顶那只跟它配掉
    }
    return left.empty();                             // 还剩左括号就是没闭合
}` },
        { t: `code`, lang: `c++`, code: `// 接在上面之后，main 里跑几个用例
for (std::string s : {"(()())", "(()(()", "())(", ""})
    std::println("{} → {}", s, ok(s) ? "匹配" : "不匹配");` },
        { t: `p`, text: `四个用例的结果依次是：匹配、不匹配、不匹配、匹配。三个判失败的口子都在上面那段里 —— **右括号来了栈却空**（多的那一只没人配）、**循环走完栈不空**（左括号还没配上，这就是只判「有没有多右括号」会漏掉的一半 bug）、以及**空串算匹配**（没有任何不匹配的证据，这就是数学上的约定，也是绝大多数判分器想要的结果）。` },
        { t: `p`, text: `为什么这件事非用栈不可？因为括号是**一层套一层**的：最里面那对一定先闭合，也就是说**最后打开的那一只最先等它的另一半**。这个「后进的先处理完」的形状，就是栈。要是改成一圈数左右括号各几个，"())(" 这种数量相等却顺序错乱的就判不出来 —— 数量相等不等于匹配，栈记住的是**顺序**。` },
        { t: `h2`, text: `演示 2 · 三种括号混着来` },
        { t: `code`, lang: `c++`, code: `// 接上：混合括号只多一件事 —— 要知道栈顶那只跟当前这右括号是不是一对
char partner(char c) {                    // 右括号回它对应的左括号，否则回 0
    if (c == ')') return '(';
    if (c == ']') return '[';
    if (c == '}') return '{';
    return 0;
}` },
        { t: `code`, lang: `c++`, code: `bool ok3(const std::string& s) {
    std::stack<char> left;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') left.push(c);
        else if (char p = partner(c)) {         // 是右括号才要配对
            if (left.empty() || left.top() != p) return false;
            left.pop();                          // 配上了，把栈顶那只消掉
        }
    }
    return left.empty();
}` },
        { t: `p`, text: `关键在中间那一句：if (left.empty() || left.top() != p) return false; —— 先看有没有，再读 top 比对，两件事用短路连起来，正好避免了空栈上读 top。这里 top 的作用是**看一眼栈顶是什么括号**，跟上一课的 front「看排头是谁」是一路的。顺带一提：非括号的字符被 else if 挡掉了，所以 "a(b[c]" 也照判不误；真要处理引号里的括号，那是词法分析的活，以后再讲。` },
        { t: `h2`, text: `演示 3 · 十进制转二进制：余数压栈，最后一起弹出` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <stack>

int main() {
    int n = 13;
    std::stack<int> bits;
    do {
        bits.push(n % 2);                          // 余数：从低位到高位
        n /= 2;
    } while (n > 0);
    while (!bits.empty()) { std::print("{}", bits.top()); bits.pop(); }
    std::println("");                               // 13 → 1101
    return 0;
}` },
        { t: `p`, text: `这段是全课最漂亮的一处：**除法算出来的余数是最低位先出来的**，而打印二进制要**最高位在前** —— 正好需要一次倒序。用 string 拼接再想办法倒过来会别扭（倒着插到字符串开头是整串搬一次，很慢），压栈则是「放一边，最后原样倒出来」，一行 push 解决。跟着圈走一遍 13：余 1、余 1、余 0、余 1，栈里从顶到底正好是 1 0 1 1，弹出打印就是 1101。这里用 do-while 而不是 while 也是有原因的：n 等于 0 时 while 的循环体一次都不进，栈是空的，最后什么都不打印；do 先把 0 % 2 那个 0 压进去，所以 0 也能正确输出一个 0。这类「特殊值 0 走不走一遍循环」的细节，正是进制转换题最常见的扣分点。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把 top 当 pop 用。top 只看不拿，写三次 top 队伍还是原来那摞；真正拿走的是 pop，而 pop 返回 void。想「拿走并使用」就两步：读 top，再 pop。`,
          `空栈上 top 或 pop。没有异常也没有 -1，是未定义行为；症状经常是「本地跑得好好的，交上去崩」。判空 !s.empty() 写在前面。`,
          `括号匹配只数左右个数。"())(" 个数完全相等却顺序错乱 —— 个数只够判「总量」，栈判的是「谁先等谁」，这是这类题的本质。`,
          `匹配循环跑完直接 return true，忘了最后判栈空。"(((" 一个右括号都没多出来，一路走完全程毫无异常，但三只左括号还压在栈里 —— 收尾必须 return left.empty()。`,
          `想遍历这摞盘子又别弄坏它。stack 没有 begin 和 end，只能复制一份再倒出来弹（它是值类型，赋值即整份复制），或者一开始就用 vector 存。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `判断括号是否匹配：先做只有一种圆括号的版本，再扩到 "([])" 三种混合 —— 左括号压栈，右括号和栈顶配对`,
          `用 stack 做十进制转二进制：余数依次压栈，最后一起弹出；顺手确认 n 等于 0 时也能打印出一个 0`,
          `延伸：给撤销功能做个小演示 —— 每输入一行就 push 进历史栈，输入 "undo" 就 pop 并打印拿掉的那一行，输入 "list" 时复制一份栈再打印全部内容。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：栈是一扇门开在顶上 —— 后进先出，天生倒序；凡是「最新的一件事还没处理完、旧事得先压住」的场景，就该想到它。` }
      ]
    },
    {
      id: `m103`, title: `第 103 课 · priority_queue 优先队列：谁大谁先走`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：认识 priority_queue 这条「VIP 队伍」—— 不看来的先后，只看谁优先级高；会开大顶堆、会开小顶堆，并用它拿下「每次都要当前最值」那类题。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `前两课的队伍按**位置**决定谁先走：队首先走、栈顶先走。优先队列改的是规矩本身 —— 谁**分量最重**谁先走，来的先后完全不算数。急诊室分诊、任务调度、直播弹幕限流，要的都是这个：每一刻只关心「眼下最要紧的那一个」。` },
        { t: `p`, text: `它凭什么能做到每次都给你最值？底下装的是一棵**堆**：一棵「父亲不小于孩子」的树，**摊平塞进一个数组**里 —— 下标 i 的父亲是 i 减 1 再除 2，两个孩子是 2i+1 和 2i+2。这样全表只有**根**保证是最大值，其他格子的顺序它不管。push 就是把新元素放数组末尾，然后一路跟父亲比、该换就往上换（上浮）；pop 是把根拿走、末尾那格补到根上，再一路往下换（下沉）。两条路最长走树高那么远，也就是 log n 步。` },
        { t: `p`, text: `这就解释了它和 sort 的分工。第 86 课留过一句判断：**有范围、要全表**用筛；**一个个来、要当前最值**用堆。要是你只需要「最大的那一个」，排序就白做了 —— sort 把整个序列都排干净是 n log n，而堆只需要维持根上的答案，push 与 pop 各 log n，随到随处理。要前 k 名，弹 k 次就够了，剩下的不用动。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `尖括号里最多三样东西：**装什么**、**底层用什么容器**（不写就是 vector）、**怎么比大小**。第一个参数很好懂，后两个是这一课的门槛：默认那条比较规则是 less，意思是「谁比谁小」，被判成「小」的那个往后站 —— 于是**最大的先出来，默认就是大顶堆**。想要最小的先出，就把规则换成 greater：这时被判「大」的往后站，**最小的爬到根上**。` },
        { t: `code`, lang: `text`, code: `std::priority_queue< 元素类型 , 底层容器 , 比较规则 >
                        └ 装什么     └ 不写就 vector   └ 不写就 less

规则写 less     → 大的排前面 → 大顶堆（默认，两个参数都不用写）
规则写 greater → 小的排前面 → 小顶堆（三个参数全要写，别忘了 functional 头文件）` },
        { t: `p`, text: `方向反直觉，是这一课最容易记岔的一处。给你一个不会错的口诀：**第三个参数写的就是「谁该往后站」的判据 —— less 时小的往后，greater 时大的往后**。写完之后先 push 三个数、top 看一眼，确认方向对了再继续写业务，这个习惯能省掉半小时调试。` },
        { t: `h2`, text: `怎么做` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <queue>
#include <vector>
#include <functional>
int main() {
    std::priority_queue<int> big;                     // 大顶堆，默认
    for (int v : {5, 2, 8, 1, 9}) big.push(v);
    std::print("大顶出队: ");
    while (!big.empty()) { std::print("{} ", big.top()); big.pop(); }
    std::println("");
    return 0;
}` },
        { t: `p`, text: `输出 9 8 5 2 1。接口和上一课几乎一模一样：push 放、top 看、pop 删、empty 判空、size 数人数 —— 唯一换掉的名字是 **top 而不是 front**，因为它「只有一扇门」，那扇门开在根上。所以前两课那条铁律照样成立：**pop 返回 void，想拿值先读 top**。` },
        { t: `code`, lang: `c++`, code: `// 接在上面：把规则反过来就是小顶堆，三个尖括号参数一个都不能省
std::priority_queue<int, std::vector<int>, std::greater<int>> small;
for (int v : {5, 2, 8, 1, 9}) small.push(v);
std::print("小顶出队: ");
while (!small.empty()) { std::print("{} ", small.top()); small.pop(); }
std::println("");                                      // 1 2 5 8 9` },
        { t: `p`, text: `这段的输出是 1 2 5 8 9 —— 同一批数，换个规则出来就是倒着的。std::greater 住在 functional 头文件里，只包 queue 不够，编译器会给一句「greater 不是 std 的成员」；底层容器 vector 也得明写出来，因为它现在是三个参数里的第二个，位置不能空着。还有件事要习惯：堆的元素顺序只在「父子」这一层有序，**整体并不是排好序的** —— 大顶堆里 9 在根上，另外几个格子的位置取决于你 push 的顺序，别拿它当排好序的数组读。` },
        { t: `svg`, caption: `大顶堆：只有父亲不小于孩子这一条规矩，根永远是最大的那个`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260">
  <g font-size="13" text-anchor="middle" fill="#142639">
    <text x="320" y="24" font-weight="700" fill="#00599c">树的样子（根就是 top）</text>
    <text x="560" y="24" font-weight="700" fill="#1a7f42">数组的下标</text>
  </g>
  <g stroke="#9db4c8" stroke-width="2">
    <line x1="180" y1="70" x2="110" y2="130"/><line x1="180" y1="70" x2="250" y2="130"/>
    <line x1="110" y1="130" x2="70" y2="190"/><line x1="110" y1="130" x2="150" y2="190"/>
    <line x1="250" y1="130" x2="215" y2="190"/>
  </g>
  <g font-size="13" text-anchor="middle">
    <circle cx="180" cy="70" r="22" fill="#fff3d6" stroke="#b8722b" stroke-width="2.5"/><text x="180" y="75" font-weight="700">9</text>
    <circle cx="110" cy="130" r="22" fill="#eaf3fb" stroke="#00599c"/><text x="110" y="135">5</text>
    <circle cx="250" cy="130" r="22" fill="#eaf3fb" stroke="#00599c"/><text x="250" y="135">8</text>
    <circle cx="70" cy="190" r="22" fill="#eaf3fb" stroke="#00599c"/><text x="70" y="195">2</text>
    <circle cx="150" cy="190" r="22" fill="#eaf3fb" stroke="#00599c"/><text x="150" y="195">1</text>
    <circle cx="215" cy="190" r="22" fill="#eaf3fb" stroke="#00599c"/><text x="215" y="195">7</text>
    <rect x="400" y="52" width="42" height="34" fill="#fff3d6" stroke="#b8722b" stroke-width="2.5"/><text x="421" y="74" font-weight="700">9</text>
    <rect x="442" y="52" width="42" height="34" fill="#eaf3fb" stroke="#00599c"/><text x="463" y="74">5</text>
    <rect x="484" y="52" width="42" height="34" fill="#eaf3fb" stroke="#00599c"/><text x="505" y="74">8</text>
    <rect x="400" y="86" width="42" height="34" fill="#eaf3fb" stroke="#00599c"/><text x="421" y="108">2</text>
    <rect x="442" y="86" width="42" height="34" fill="#eaf3fb" stroke="#00599c"/><text x="463" y="108">1</text>
    <rect x="484" y="86" width="42" height="34" fill="#eaf3fb" stroke="#00599c"/><text x="505" y="108">7</text>
  </g>
  <g font-size="12" fill="#57677c" text-anchor="middle">
    <text x="421" y="46">0</text><text x="463" y="46">1</text><text x="505" y="46">2</text>
    <text x="421" y="134">3</text><text x="463" y="134">4</text><text x="505" y="134">5</text>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="360" y="168">数组读法：0 号是根；i 的父亲是 (i-1)/2，孩子是 2i+1 与 2i+2</text>
    <text x="40" y="230">检查一遍规矩：9≥5 9≥8，5≥2 5≥1，8≥7 —— 只有父亲要比孩子大，兄弟之间不管</text>
    <text x="40" y="252" font-weight="700" fill="#b8722b">top 永远拿根，代价是 log n 次换位置；push 上浮、pop 下沉</text>
  </g>
</svg>` },
        { t: `h2`, text: `演示 1 · 合并石子：每次挑最轻的两堆` },
        { t: `code`, lang: `c++`, code: `// 头文件同上面那段；「每次取最小的两个」正是小顶堆的活
int merge_cost() {
    std::priority_queue<int, std::vector<int>, std::greater<int>> need;
    for (int v : {1, 2, 3, 4}) need.push(v);         // 四堆石头的重量
    int total = 0;
    while (need.size() > 1) {
        int a = need.top(); need.pop();               // 当前最轻的一堆
        int b = need.top(); need.pop();               // 第二轻的一堆
        total += a + b;                                // 这次搬的代价
        need.push(a + b);                              // 合成一堆，放回去接着比
    }
    return total;
}` },
        { t: `p`, text: `跟着走一遍：1 和 2 合成 3，代价 3；桌上变成 3、3、4，取 3 和 3 合成 6，代价 6；桌上 4 和 6，合成 10，代价 10。总代价 3 加 6 加 10 等于 **19**。这里的关键不是代码，是**为什么每次挑最轻的两堆最省** —— 早合成的堆会被反复搬，越轻的越该早搬、越重的越晚搬。这一手「贪心加堆」在合并文件那类题里会一再用上，以后学到时会再回来认这张脸。再看循环条件：写的是 need.size() 大于 1，而不是 !need.empty() —— 桌上只剩一堆时已经没有「两堆可合」，循环必须停。这种「要凑够两个才干活」的条件，用 size 判比用 empty 判自然得多，是堆类循环里最常见的一个变体。` },
        { t: `h2`, text: `演示 2 · 实时前三名：只养三个格子的堆` },
        { t: `code`, lang: `c++`, code: `// 来一个分数就更新，永远只留最大的三个
std::priority_queue<int, std::vector<int>, std::greater<int>> top3;
for (int score : {88, 95, 72, 91, 60, 83}) {
    top3.push(score);                                 // 先进来占个位
    if (top3.size() > 3) top3.pop();                   // 挤掉这仨里垫底的那个
}
std::print("前三名从小到大弹出: ");
while (!top3.empty()) { std::print("{} ", top3.top()); top3.pop(); }
std::println("");` },
        { t: `p`, text: `输出是 88 91 95。妙处在**用小顶堆装「最大的三个」**：堆顶是这三人里最低的那个，新分数只要比它高，垫底的就该被换掉 —— 每次只跟一个人比，一次 pop 就完事。要是换成大顶堆，顶上是最大的那个，你没法一步找到「该淘汰谁」，就得把整个堆倒出来重排。这是堆最好用的一招：**要维护「最大的 k 个」，就养一个大小为 k 的小顶堆**，k 等于 3 是这道题，k 等于 10 是热搜榜，k 等于 1 就是「记录目前最高分」。` },
        { t: `p`, text: `弹出顺序 88 91 95 是**从小到大**的，可名次要的是从大到小。最省事的办法是弹的时候先存进 vector，再倒着打印 —— 那个「倒着」正是第 102 课栈天生就会做的事，两种容器在这儿配合得很自然。` },
        { t: `h2`, text: `演示 3 · 只取第 k 小，别把全表排完` },
        { t: `code`, lang: `c++`, code: `// 在小顶堆里弹 k 次就是第 k 小 —— 剩下的元素根本没被排过
int kth_small(std::priority_queue<int, std::vector<int>, std::greater<int>> h, int k) {
    for (int i = 1; i < k; ++i) { h.pop(); }   // 前 k-1 个小的先扔掉
    return h.top();                             // 第 k 个就是答案
}` },
        { t: `p`, text: `往堆里灌 m 个数是 m 次 log m，再弹 k 次：总共约 m log m —— 看着和 sort 差不多，差别在**在线**：数不是一次到位、而是陆续到达时，堆随时都能被问「现在第 1 小是谁」，sort 做不到这件事。这个「随时可问最值」的能力，是优先队列存在的真正理由，也是下一节课以后反复出现的主题。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `小顶堆忘包 functional 头文件。报错长相是「greater 不是 std 的成员」或「模板参数无法推导」，把三个尖括号参数写全再补一行 include 就好。`,
          `方向记反：以为 greater 是「大的先出」。判据是「谁该往后站」—— less 让小的往后（大的先出），greater 让大的往后（小的先出）。写完先 push 三个数 top 一次确认。`,
          `以为堆就是排好序的数组，想 range-for 或下标访问。priority_queue 不提供 begin 和 end，也不给下标，只能通过 top 一次次 pop 往外拿；要真排序请回去用 sort。`,
          `top 之后忘 pop，写了个死循环 —— 条件永远不成立因为根没被换掉。或者反过来：空堆上 top 与 pop，未定义行为，不报错但结果乱。`,
          `把 pop 当「取出来」用，写 int v = h.pop()。pop 返回 void，两件事分开：先 int v = h.top()，再 h.pop()。这是三连课里同一道题，一定要形成肌肉记忆。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `每次取最小的两个数合并、代价等于两数之和 —— 算出重量为 1 2 3 4 的四堆石头合并的总代价，并把每一步的代价打出来`,
          `用优先队列维护「实时前三名」的成绩：每来一个新分数就更新，随时能打印当前前三`,
          `延伸：把前三名改成「前 k 名」，k 由变量控制；再试试同一批分数用大顶堆弹三次，和本题的小顶堆结果差在哪里。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：优先队列只保一根「最值」，用 log n 的代价换「随时能问现在最要紧的是谁」；第三个模板参数写的是谁该往后站，不写就是大的先走。` }
      ]
    },
    {
      id: `m104`, title: `第 104 课 · pair 与结构化绑定：两个值打包走`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会用 pair 把两个值捆成一个（first 与 second），再用 auto [a, b] 一口气拆回来；并且看懂一排 pair 排队时「先比 first、平局才比 second」这条默认规矩。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `很多场合你只要**两个**值：一个词和它的次数、一个分数和它是谁、一个最大值和它出现在第几格。为这种事专门写一个 struct（第 87 课那个 WordCount）太重了 —— 名字、注释、成员函数全都写，写完只用两回。标准库给了一个刚好够用的东西：**pair**，两张一体的票，左边那格叫 first，右边那格叫 second。` },
        { t: `p`, text: `pair 是个模板，尖括号里按顺序写两样：std::pair<std::string, int> 就是「first 是字符串、second 是整数」。初始化列表按**位置**给值 —— 花括号里第一个进 first，第二个进 second，顺序错了不会报错，只会静悄悄地把字符串塞进整数的位置，然后编译失败在你没想到的地方。` },
        { t: `p`, text: `写 first 与 second 有点罗嗦，于是第 47 课学过的那招再来一次：**结构化绑定**，写法是 auto [subject, score] = p; —— 编译器照着位置把票根撕成两张，给你两个能自由改名的变量。它的价值在遍历的时候最明显（第 48 课那张成绩表就是这么读的）：for 循环里写 const auto& [word, count] 比写 it->first 与 it->second 好读十倍。第 97 课那本 map 的每个元素本质上就是一张 pair，所以这一课学完，你回头遍历 map 会顺手得多 —— 本课的新东西不在语法上，而在**把 pair 塞进容器与排序里**这套手感。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `pair 的设计目标就一句话：**最小的聚合体**。没有成员函数、没有构造规矩、不能继承、只有两格公开数据。它不打算成为「一个类型」，只打算当「一份临时打包」。要真的开始讲道理（比如「总分怎么算」），就该升级成 struct 甚至 class；只要顺手传两个值，pair 正合适。` },
        { t: `code`, lang: `text`, code: `std::pair<std::string, int> p = {"数学", 92};

   p  ┌──────────┬──────────┐
      │ first    │ second   │        比较：先比 first，平了才比 second
      │ "数学"   │   92     │        这就是 sort 不写规则时的默认行为
      └──────────┴──────────┘
   auto [subject, score] = p;   →   subject 是 "数学"，score 是 92` },
        { t: `p`, text: `把「比较链」写进 pair 的**位置**里，是这一课最值得偷的一招：想让分数优先排，就把分数放 first；想让名字优先排，就把名字放 first。第 87 课你要写两条 if 才表达清楚「先比次数、再比单词」，在这儿靠两个字段的摆放顺序就说完了，代价是 first 与 second 这两个名字本身不再携带含义，读代码的人得靠注释。取舍摆在这儿，看场景挑。` },
        { t: `h2`, text: `怎么做` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <utility>

int main() {
    std::pair<std::string, int> p = {"数学", 92};
    std::println("first = {}  second = {}", p.first, p.second);

    auto [subject, score] = p;                  // 一次拆成两个变量
    std::println("拆开: {} = {}", subject, score);
    return 0;
}` },
        { t: `p`, text: `输出两行：first = 数学 second = 92，以及 拆开: 数学 = 92。绑定出来的 subject 类型是 std::string、score 类型是 int，**由 auto 按位置推出来的**，不是你写的；方括号里名字的个数必须和格子数一样，多一个少一个都编译不过 —— 报错长相是「无法解构」那类。名字随便起，越贴近含义越好。` },
        { t: `p`, text: `这里有一条必须现在就分清的规矩：**auto [a, b] = p 得到的是两份复制**。后面改 a 与 b，p 一动不动。想真的改到原票上，得写 auto& [a, b] = p;（第 61 课那条引用规矩在绑定里同样成立）；而只是读的时候，在 for 循环里写 const auto& [a, b] 最省 —— 既不复制，也不给改坏。` },
        { t: `svg`, caption: `pair 把两个值捆成一张票；结构化绑定按位置把它撕回两个变量`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 246">
  <g font-size="13" text-anchor="middle" fill="#142639">
    <text x="150" y="26" font-weight="700" fill="#00599c">一张二联票</text>
    <text x="500" y="26" font-weight="700" fill="#1a7f42">撕成两个变量</text>
  </g>
  <g font-size="13">
    <rect x="50" y="48" width="100" height="46" fill="#eaf3fb" stroke="#00599c"/>
    <text x="100" y="76" text-anchor="middle">"数学"</text>
    <rect x="150" y="48" width="90" height="46" fill="#fff3d6" stroke="#b8722b" stroke-width="2.5"/>
    <text x="195" y="76" text-anchor="middle" font-weight="700">92</text>
    <text x="100" y="112" text-anchor="middle" font-size="12" fill="#57677c">first</text>
    <text x="195" y="112" text-anchor="middle" font-size="12" fill="#b8722b" font-weight="700">second</text>
    <path d="M262 71 L318 71" stroke="#b8722b" stroke-width="2.5"/>
    <polygon points="318,71 308,65 308,77" fill="#b8722b"/>
    <text x="290" y="52" text-anchor="middle" font-size="12" fill="#33465e">auto 加方括号</text>
    <rect x="336" y="48" width="140" height="46" fill="#e7f6ec" stroke="#1a7f42"/>
    <text x="406" y="76" text-anchor="middle">subject = "数学"</text>
    <rect x="336" y="102" width="140" height="46" fill="#e7f6ec" stroke="#1a7f42"/>
    <text x="406" y="130" text-anchor="middle">score = 92</text>
    <text x="530" y="76" font-size="12" fill="#57677c">名字随你起</text>
    <text x="530" y="130" font-size="12" fill="#57677c">类型按位置推</text>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="40" y="172">复制还是引用：auto [a, b] 是两份复制，auto& [a, b] 才改得到原票，for 里读用 const auto&</text>
    <text x="40" y="196">一排 pair 排序：先比 first，first 相同才比 second（字典序，跟字符串比大小一个路子）</text>
    <text x="40" y="226" font-weight="700" fill="#00599c">想让谁先排，就把谁摆在 first —— 比较链写进字段顺序里</text>
  </g>
</svg>` },
        { t: `h2`, text: `演示 1 · 让函数一次回两个值` },
        { t: `code`, lang: `c++`, code: `// 头文件再加 vector：找「最大值以及它第一次出现的位置」
std::pair<int, int> best_with_index(const std::vector<int>& v) {
    std::pair<int, int> res = {v[0], 0};
    for (size_t i = 1; i < v.size(); ++i)
        if (v[i] > res.first) res = {v[i], i};      // 整对赋值也行
    return res;
}
auto [value, where] = best_with_index({4, 9, 2, 9, 7});
std::println("最大 {} 在第 {} 格", value, where);      // 9 在第 1 格` },
        { t: `p`, text: `这是 pair 最高频的用途：**函数要回两样东西**。以前你只有两条路 —— 为它专门写个 struct，或者用引用参数往外带（第 60 课那套）。现在 return 一个 pair 就完事，调用处再绑成两个变量读起来很直。注意条件写的是大于号而不是大于等于：两个 9 打平时保留**前面那个位置**，所以答案是第 1 格而不是第 3 格。这类「打平算谁的」的小选择，写的时候就要想明白。` },
        { t: `h2`, text: `演示 2 · 一排 pair 排队` },
        { t: `code`, lang: `c++`, code: `#include <algorithm>
#include <print>
#include <string>
#include <utility>
#include <vector>

int main() {
    std::vector<std::pair<int, std::string>> ranked = {
        {88, "小明"}, {95, "小红"}, {72, "小强"}};
    std::sort(ranked.begin(), ranked.end());        // 默认按 first 排
    for (const auto& [sc, name] : ranked)
        std::println("{} {}", name, sc);
    return 0;
}` },
        { t: `p`, text: `输出三行：小强 72、小明 88、小红 95。三件事同时发生了：sort 拿默认规则比较 pair（先比 first，即分数）；遍历时用 const auto& 加绑定，既不复制字符串又读得清楚；方括号里的名字 sc 与 name 跟 first、second 的**位置**对上，而不是跟类型对上，所以你尽可以起得更有意义。` },
        { t: `h2`, text: `演示 3 · 名次要分数降序，同分按名字` },
        { t: `code`, lang: `c++`, code: `std::sort(ranked.begin(), ranked.end(),
          [](const std::pair<int, std::string>& a,
             const std::pair<int, std::string>& b) {
              if (a.first != b.first) return a.first > b.first;   // 分数降序
              return a.second < b.second;                          // 同分名字升序
          });` },
        { t: `code`, lang: `c++`, code: `// map 的每个元素本来就是一张 pair：first 是键，second 是值
std::map<std::string, int> freq = {{"cat", 3}, {"dog", 2}};
for (const auto& [word, count] : freq)
    std::println("{} 出现 {} 次", word, count);` },
        { t: `p`, text: `第一段是第 87 课那条「比较链」的 pair 版：先比分差、比分不出胜负才比名字。**只比 first 的话，同分的两个人谁在前没被规定**，换台机器就可能换序，所以第二条永远别省。第二段则是把 pair 用熟的验收课：map 的第 97 课教过，它存的每一项就是「键 加 值」两张格，绑定一写，代码里就再也不会出现 it->first 这种要靠脑补的写法。` },
        { t: `p`, text: `顺手把三课的容器串起来看：这一整套「一堆带名字的数、按某条规则排、随时取最值」的零件到这儿已经齐了 —— vector 存表、pair 或 struct 打包、sort 排队、第 103 课的优先队列随时交最值。真实小项目基本都是这四样的组合，接下来的几课开始给它们配上排序与查找的正规算法。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `初始化列表顺序写反。std::pair<std::string, int> p = {92, "数学"}; 编译不过或给出一个看不出所以然的长串模板报错 —— pair 的两个类型是有顺序的，花括号必须跟着走。`,
          `以为 auto [a, b] = p 之后改 a 就能改到 p。绑定出来的是复制；要改原件写 auto& [a, b]，只读遍历写 const auto& [a, b]。`,
          `绑定个数对不上。auto [x] = p; 少一个名字，编译器报「无法解构」一类错。pair 只有两格，就写两个名字。`,
          `sort 只比 first，忘了平局。症状是「同分的名单偶尔换序」，很难复现 —— 补第二条比较，或者把想优先的字段挪到 first。`,
          `first 与 second 这两个名字太没含义，代码里到处写 p.second 让人猜。字段一多、道理一变复杂，就该升级成带具名成员的 struct —— pair 只适合两三个值、一次性的场合。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `让排名变成「分数降序、同分名字升序」，自己写 lambda 比较`,
          `map 的每个元素其实就是一个 pair，试试用绑定遍历 map：把第 99 课那份词频表按次数从高到低打出来`,
          `延伸：写一个返回 pair 的函数，交回「一组数里最大的那个以及它出现了几次」，调用处用 auto 加方括号一次拆成两个变量打印。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：pair 是最小的打包 —— 两个值按位置进 first 与 second，比较时先 first 后 second；结构化绑定 auto [a, b] 只是把这两格换成你能叫出名字的两个变量，复制还是引用照样由 auto 与 auto& 说了算。` }
      ]
    }
  ]
};
