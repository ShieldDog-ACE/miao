/* 喵站 · C++ 掌握 正文分部 p06：第 97–100 课
 *
 * 源稿：97_map入门.cpp、98_map的陷阱.cpp、99_map词频统计.cpp、100_set去重.cpp
 * 这四课是「关联容器」的开头：一本词典 map 用三课说透（怎么用、坑在哪、拿来统计），
 * 第四课换一只只收独一份的盒子 set。掌握课在这儿开始讲「为什么这么想」：
 * 第 87 课手写过线性查找，今天才有资格体会 map 把哪一步省掉了。
 */
window.MIAO_CPPM_P06 = {
  chapters: [
    {
      id: `m97`, title: `第 97 课 · map 入门：一本自己排好序的词典`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用 std::map 存「键 → 值」，学会写入、查询和遍历，并亲眼确认它遍历出来已经按键排好了序。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 87 课数单词，你手里只有 vector 加 struct：来一个词就从表头扫到表尾找那一行，找到就次数加一，没找到就在表尾登记一行。词少的时候没感觉，表一长，每来一个词都要走一遍全表，N 个词就是 N 乘 N 量级。慢的根子藏在**「找」**这一步 —— 格子是平铺的，不认名字，只能一格一格看。` },
        { t: `p`, text: `map 换的就是这个思路。它不许你扫，它让你**直接报名字**：scores 方括号 小明，读作「小明那一条」。你只需要关心两样东西，一个叫**键**（名字），一个叫**值**（这条名字对应的东西）。写的时候 scores["小明"] = 88; 是登记，把它放到等号右边、放进 println 的花括号里，同一个写法就变成了查询。` },
        { t: `p`, text: `凭什么它能一步定位？因为 map 里面**不是一排格子，而一棵按键排好序的树**（标准库里通常是红黑树）。放一个新键要找位置，靠的是「跟当前这个键比大小，决定往左走还是往右走」，每比一次就丢掉一半候选；查一个键走的是同一条路。所以放也是 log n，找也是 log n。这便宜不是白拿的：插入比 vector 的 push_back 贵，每个节点还要额外存指针，内存也占得多。**用「插入稍慢、内存多占」换「查找一步到位」**，这是 map 的全部买卖。` },
        { t: `p`, text: `还有一件**顺手白送**的事：那棵树本来就是按键从小到大长的，所以遍历时天然按顺序给你，不用排序。第 87 课还得专门写一段比较 lambda 才能把热搜排出来，这儿默认排序就把「按键排好」干完了。反过来说一句丑话：顺序由键说了算，你想按值排队它不管 —— 那是以后 sort 几课的事。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `声明长这样：std::map<std::string, int> scores;。两样类型写在尖括号里，**前一个是键的类型，后一个是值的类型**，读作「一本从字符串查到整数的词典」。键和值几乎可以是任何类型，但键必须**能比大小**：默认拿小于号比，整数按数值、字符串按字典序。第 88 课那张二维表只能用整数下标取数，map 的键可以是人名、单词、日期串 —— 这正是「词典」和「表格」的分界。` },
        { t: `p`, text: `什么时候该用它：需求的形状是「我知道名字，想拿到它对应的东西」，或者「按名字记一笔数、记一个状态」。什么时候不该用：数据本来就是 0 到 n 一排整数，vector 更快更省；或者你必须保留**先来后到**的顺序，map 会按键把顺序重排，把你想要的顺序弄乱。判断口诀就一句：**按名字取数用 map，按位置取数用 vector。**` },
        { t: `svg`, caption: `map 的两列：左边是钥匙（键），唯一且自动排好序；右边是值。找东西只认左边的名字`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250">
  <g font-size="13" text-anchor="middle">
    <text x="150" y="26" fill="#00599c" font-weight="700">键 std::string</text>
    <text x="470" y="26" fill="#1a7f42" font-weight="700">值 int</text>
  </g>
  <g font-size="13" text-anchor="middle">
    <rect x="80" y="44" width="140" height="36" fill="#eaf3fb" stroke="#00599c"/><text x="150" y="68">小强</text>
    <rect x="400" y="44" width="140" height="36" fill="#e7f6ec" stroke="#1a7f42"/><text x="470" y="68">72</text>
    <rect x="80" y="90" width="140" height="36" fill="#fff3d6" stroke="#b8722b" stroke-width="2.5"/><text x="150" y="114" font-weight="700">小明</text>
    <rect x="400" y="90" width="140" height="36" fill="#fff3d6" stroke="#b8722b" stroke-width="2.5"/><text x="470" y="114" font-weight="700">88</text>
    <rect x="80" y="136" width="140" height="36" fill="#eaf3fb" stroke="#00599c"/><text x="150" y="160">小红</text>
    <rect x="400" y="136" width="140" height="36" fill="#e7f6ec" stroke="#1a7f42"/><text x="470" y="160">95</text>
  </g>
  <g stroke="#57677c" stroke-width="2">
    <line x1="220" y1="62" x2="400" y2="62"/>
    <line x1="220" y1="108" x2="400" y2="108"/>
    <line x1="220" y1="154" x2="400" y2="154"/>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="20" y="200">写入 scores["小明"] = 88：找到「小明」这把钥匙，把右边那格填满</text>
    <text x="20" y="222" fill="#b8722b" font-weight="700">插入顺序是 小明、小强、小红，存放顺序却是 小强、小明、小红 —— 键自动排好队</text>
  </g>
</svg>` },
        { t: `h2`, text: `怎么做` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <map>
#include <string>

int main() {
    std::map<std::string, int> scores;
    scores["小明"] = 88;                     // 写入：键 → 值
    scores["小强"] = 72;
    scores["小红"] = 95;
    for (const auto& [name, score] : scores) {   // 绑定拆成键、值
        std::println("{:<6} {}", name, score);
    }
    return 0;
}` },
        { t: `p`, text: `三句写入就是三本账，跑出来的三行是 小强 72、小明 88、小红 95 —— 跟你写进去的顺序不一样，这就是那棵树自动排的队。打印那句里的 {:<6} 是 std::println 的格式说明符：左对齐、占 6 个宽的格子，名字长短不一也能对齐成一列。真正要盯的是遍历那一行 —— for (const auto& [name, score] : scores)，方括号里两个名字是把一条记录**当场拆成键和值两半**，左边拿键、右边拿值。写成 const auto& 是按引用读、不复制整条记录，这跟第 61 课「大对象按 const 引用传」是同一条规矩。` },
        { t: `h2`, text: `演示 1 · 同一个键再写一次，是覆盖不是新增` },
        { t: `code`, lang: `c++`, code: `// 接在上面那段后面
scores["小明"] = 90;                      // 键已经有了：改值，不新增
std::println("小明 = {}", scores["小明"]);      // 读出来是 90
std::println("一共 {} 条记录", scores.size());  // 还是 3，不是 4` },
        { t: `p`, text: `词典里一个键只能有一条记录，这是它跟 vector 最大的区别：vector 允许两个格子放一样的东西，map 的键**天生唯一**。所以「加一条」和「改一条」在 map 里是同一个动作，写下去就完事 —— 这个特性下一课会被用到极致（词频统计一行搞定），也会在那儿埋下一个坑。` },
        { t: `h2`, text: `演示 2 · 遍历的时候顺手挑个最值` },
        { t: `code`, lang: `c++`, code: `int best = 0;
std::string who;
for (const auto& [name, score] : scores) {
    if (score > best) { best = score; who = name; }
}
std::println("最高分 {} 分，{}", best, who);` },
        { t: `p`, text: `注意这里挑最值靠的是**自己比**，map 的有序只帮键排、不帮值排。换句话说：按名字找分数，map 一步到位；按分数找名字，它只能一行行给你，你还是得全扫一遍。**键是被优化过的那一列**，值不是 —— 想反过来按值查，得再造一本键值对调的词典。` },
        { t: `h2`, text: `演示 3 · 顺序由键说了算` },
        { t: `code`, lang: `c++`, code: `std::map<int, std::string> rank;   // 键换成整数，值换成字符串
rank[3] = "铜牌";
rank[1] = "金牌";
rank[2] = "银牌";

for (const auto& [no, label] : rank)
    std::println("第 {} 名 —— {}", no, label);` },
        { t: `p`, text: `存的时候顺序是 3、1、2，打印出来却是 1、2、3 —— 键小的在前。这个例子恰好说明「自动排序」什么时候是福利、什么时候是麻烦：你要的就是名次从小到大，福利；你要的是「谁先来就谁在前」，麻烦。字符串键还有一层要留神：比较走的是**字典序**，整数写成字符串时 "10" 会排在 "9" 前面，中文按 UTF-8 字节排、跟拼音笔画都没关系。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `声明时偷懒不写类型。std::map scores; 编不过，键类型和值类型两个都得给全；模板参数顺序也别记反 —— 前键后值。`,
          `把遍历顺序当成插入顺序。症状是「我明明先存的 小明，怎么先打印 小红」。要保留先来后到，vector 加 struct 才是对的工具。`,
          `键用字符串却按数值思维排。"10" 在 "9" 前，中文按字节序排；想让数字串按大小排，键就该用 int 或者补零对齐。`,
          `拿 [] 去读一个还不存在的键 —— 它会当场凭空造一条，值是默认的 0，词典还多了一行。本课先记一条纪律：**[] 用来写，读之前先问 contains**，下一课专门拆这颗雷。`,
          `想按值排序却在 map 上打转。map 只认键；真要按值排队，得把记录搬进 vector 再 sort，这是以后的路。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `再加几条记录，看输出是不是按名字排好序的`,
          `单独打印 scores["小红"]，验证「放在表达式里就是查询」这个说法`,
          `延伸：把键和值对调成 std::map<int, std::string>，用分数当键存名字，然后故意让两个人同分，观察会发生什么 —— 这一条会让你真正记住「键唯一」这四个字。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：map 是一本按名字排好队的词典 —— 键唯一、值随键、遍历自动有序；它把第 87 课「扫全表找那一行」压成了一步定位，代价是插入稍慢、顺序由键定。` }
      ]
    },
    {
      id: `m98`, title: `第 98 课 · map 的陷阱：方括号会无中生有`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：认清 map 的 [] 藏着的那颗雷 —— 查一个不存在的键，它会当场把那个键造出来，值是默认的 0；只想查不想改，就用 contains 先问、at 取值。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课说 [] 有两副面孔：等号左边是写入，放进表达式里是查询。今天要把后半句撕掉 —— **它在表达式里也不是「纯查询」**。写 scores["新同学"] 的时候，如果词典里没有「新同学」这把钥匙，map 不会跟你说「查无此人」，它会**当场新建一条**：键是 新同学，值是 int 的默认值 0。你的词典从 3 条变成 4 条，而你只是想读一下。` },
        { t: `p`, text: `为什么会设计成这个样子？想深一层就不觉得奇怪了。[] 必须能承担「scores["小明"] = 88」这种**凭空开一条新账**的写法 —— 要让等号左边有地方可写，它只能先保证那个键存在。而标准库选择让同一个函数同时干「保证有」和「交出值」两件事，于是「读」也顺带触发了「保证有」。这是 C++ 里少数几个**写法骗人**的地方之一，理由纯粹是历史包袱：map 从最早期就长这样，改不动了。` },
        { t: `p`, text: `补救的钥匙是**把「问」和「取」拆成两个动作**。先问有没有：scores.contains("新同学")，它只看不动，返回真假；确认存在之后再取值：scores.at("新同学")。at 与 [] 取的是同一个格子，脾气却完全不同 —— **at 查不到就当场报错终止程序**，而不是偷偷替你造一条。听起来吓人，其实是好事：错了立刻炸，比脏了数据跑到十万行以外才发现要好得多。` },
        { t: `p`, text: `于是这一课真正的收获是一条**纪律**，不是知识点：**[] 用来写，at 用来读，contains 用来问。** 三行分工写死了，你的词典就永远不会长出你没打算要的那一行。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `code`, lang: `text`, code: `scores["新同学"]     ← 没有就造一个，值 0，size 加 1；有就返回值
scores.at("新同学")   ← 只给值；没有就报错，绝不会新增
scores.contains("新同学")  ← 只回答有没有，真假，什么都改不了
scores.size()         ← 条数，怀疑被写脏时先看它
scores.erase("新同学")← 删掉这一条；不存在也安全，不报错` },
        { t: `p`, text: `把这一页当速查表记住。左边那一列是「会不会动我的词典」，右边那一列是「返回值给你什么」。contains 是较新语言标准加进来的，老教材里常见的是 scores.count("新同学") 等于 0 这种写法，意思是「这个键有几条记录」—— 键唯一，所以只会是 0 或 1，效果跟 contains 一样；见到别慌，也别混着用。` },
        { t: `svg`, caption: `一次 scores["新同学"] 读取，词典悄悄多出一行：size 从 1 变 2；换成 contains 加 at 就不会`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 210">
  <g font-size="13" text-anchor="middle">
    <text x="150" y="26" fill="#1a7f42" font-weight="700">读之前 size = 1</text>
    <text x="490" y="26" fill="#b8500f" font-weight="700">读之后 size = 2</text>
  </g>
  <g font-size="13" text-anchor="middle">
    <rect x="80" y="42" width="140" height="34" fill="#e7f6ec" stroke="#1a7f42"/><text x="150" y="65">小明 88</text>
    <rect x="420" y="42" width="140" height="34" fill="#e7f6ec" stroke="#1a7f42"/><text x="490" y="65">小明 88</text>
    <rect x="420" y="80" width="140" height="34" fill="#fbe3e0" stroke="#b8500f" stroke-width="2.5"/><text x="490" y="103" font-weight="700">新同学 0</text>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="20" y="146">std::println("{}", scores["新同学"]);   // 想读一下，结果多了一行</text>
    <text x="20" y="170" fill="#1a7f42">if (scores.contains("新同学"))  std::println("{}", scores.at("新同学"));   // 读不到也不改</text>
    <text x="20" y="196" font-weight="700" fill="#b8500f">症状：统计表里冒出一堆次数为 0 的词 —— 根源就是这一课那颗雷</text>
  </g>
</svg>` },
        { t: `h2`, text: `怎么做` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <map>
#include <string>

int main() {
    std::map<std::string, int> scores;
    scores["小明"] = 88;
    std::println("size = {}", scores.size());         // 1
    std::println("新同学 = {}", scores["新同学"]);     // 坑！凭空造出来，返回 0
    std::println("size = {}", scores.size());         // 2，被偷偷加了一条
    return 0;
}` },
        { t: `p`, text: `这段就值三行输出：1、0、2。**中间那个 0 不是「查无此人」的回答，是新记录的默认值**。int 的默认值是 0，string 是空串，bool 是 false —— 换句话说，任何类型都有一套「没给值时放什么」的规矩，map 就直接拿它填了新格子。所以判断有没有被写脏，最可靠的信号就是 size 或者那个不该出现的 0。` },
        { t: `h2`, text: `演示 1 · 先问再取的安全读法` },
        { t: `code`, lang: `c++`, code: `if (scores.contains("小明"))                       // 先问有没有
    std::println("小明的分数: {}", scores.at("小明"));   // 确认了再取
if (!scores.contains("老同学"))
    std::println("老同学不存在，也没被创建");        // size 一点没变` },
        { t: `p`, text: `两句话把「读」这件事做干净了。**contains 是纯问句，at 是纯读取**，谁都不新增记录。这个「问 → 取」的形状你可以一路带到以后：写文件之前先问存不存在，取数组元素之前先看长度 —— 只是 map 给了你最顺手的一个例子。` },
        { t: `h2`, text: `演示 2 · 收拾已经被写脏的词典` },
        { t: `code`, lang: `c++`, code: `std::println("脏了以后 size = {}", scores.size());   // 2
scores.erase("新同学");                       // 删掉误创建的那一条
std::println("删完 size = {}", scores.size());        // 1
scores.erase("根本没这个人");                 // 不存在也不报错，返回 0 条被删` },
        { t: `p`, text: `erase 给键，删整条；键不在也安全。顺手提一句它返回的是「删掉了几条」，因为键唯一，所以只可能是 0 或 1 —— 拿它当判断的人不多，但读老代码时会看见。` },
        { t: `h2`, text: `演示 3 · 拿 [] 当判断条件，是最隐蔽的一种踩雷` },
        { t: `code`, lang: `c++`, code: `// 这段看着人畜无害，其实把词典弄脏了
if (scores["转学生"] == 0)
    std::println("转学生还没成绩");
std::println("可是 size 现在是 {}", scores.size());   // 多了一条 转学生 0` },
        { t: `p`, text: `最坑的地方在于：**它当时给你的答案是正确的**。转学生确实还没成绩，比较也确实成立，程序照你想要的走。坏在副作用：多出来的那一行会跟着你到最后打印，统计里冒出一堆 0 次，报表里多出一堆空记录，而且你在代码里搜不到「写入」两个字 —— 因为它写在 if 条件里。这一类 bug 的特征就是「结果多了几行从没打算要的记录」，闻到这个味道先查 []。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把 [] 当只读用。上一课演示里那句「放在表达式里就是查询」今天得修正：**它同时是「保证有这一条」**。读一律用 at。`,
          `统计程序里凭空多出一堆次数为 0 的项。根因基本都是拿 [] 试探过不存在的键；改法是 contains 兜住，或者干脆接受这个特性 —— 下一课就把它当优势用。`,
          `用 at 却不做检查。at 查不到是直接报错终止的，写 if 判断、写循环边界时最容易漏；要么先 contains，要么确定键必然存在。`,
          `contains 与 count 混着用还不写清比较。count 返回条数（0 或 1），写成 if (scores.count("小明")) 也成立，但它不是 bool，读代码的人容易误会；同一个项目里挑一个写法。`,
          `以为 erase 删不掉不存在的键会崩。它不会崩，返回 0；真正会崩的是拿 [] 删之后再遍历，或者迭代器失效那一类（那是以后的话题）。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把 scores["新同学"] 改成 scores.at("新同学")，看看会发生什么 —— 注意程序不是「安静地少打印一行」，而是当场退出，这正是 at 的脾气`,
          `用 erase("新同学") 删掉误创建的记录，再打印 size，确认它回到 1`,
          `延伸：把演示 3 那段改成安全版本（contains 加 at），再打印一次 size，验证它一直是 1。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：[] 是「保证有这一条，然后给你值」，不是查询；写用 []、读用 at、问用 contains，这条纪律能让你的词典永远不长出你没打算要的那一行。` }
      ]
    },
    {
      id: `m99`, title: `第 99 课 · map 词频统计：把上一课那颗雷当工具用`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用 map 把第 87 课那套「扫全表找行号再决定加还是登记」压成一行 freq[w]++，并看懂它靠的正是上一课刚骂过的那个特性。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 87 课数单词，你写了三块东西：一个 struct 装「哪个词、出现几次」；一个 find_word 从表头扫到表尾找那一行；一段 if 分叉 —— 没找到就 push_back 登记一行，找到就 count 加一。逻辑没错，但每来一个词都要走一遍全表，词一多就慢得明显。` },
        { t: `p`, text: `今天这三块**全部消失**，剩下一行：freq[w]++。把它拆开看就明白为什么能这么省。方括号那一步是「保证 键 w 这一条存在，然后把它的值交给我」：词典里还没有 w，就新建一条、值填 int 的默认值 0；已经有 w，就把那个数交出来。后面那个 ++ 再把交出来的东西加一。于是「第一次见到这个词」自动变成 0 加 1 等于 1，「第二次见到」自动变成 1 加 1 等于 2 —— **登记与累加这两下，被一个写法同时干完了**。` },
        { t: `p`, text: `这里有个值得记一辈道的思路转弯。上一课我们说：只想查不想改的时候用 [] 是**踩雷**；这一课我们要说：正因为它会顺手把记录建好、还贴心地填 0，统计才一行就够。**同一个行为，在「读」的场合是 bug，在「计数」的场合是 feature。** 这不是自相矛盾，而是学标准库的正确姿势 —— 别只背「哪个函数该用哪个」，要摸清它的**脾气**：它顺手做了什么、什么时候帮你在省事、什么时候在你背后搞事。摸清了脾气，你就知道该顺着它写，而不是跟它较劲。` },
        { t: `p`, text: `那条纪律并没有作废，反而更清楚了：**要不要让词典长出新条目，取决于你的意图**。想让它长（计数、累加、按键记账）就用 []；不想让它长（查有没有、把值读出来给人看）就用 contains 加 at。写之前问自己一句「这一行如果发现键不存在，我希望它凭空造一条吗」，答案是「希望」就上 []，是「不希望」就换函数。` },
        { t: `h2`, text: `少掉了哪几块代码` },
        { t: `code`, lang: `text`, code: `第 87 课（vector 加 struct）        第 99 课（map）
struct WordCount {                ——  不需要，键就是词
  std::string word;                  值就是次数
  int count = 0;
};
int find_word(table, w)           ——  不需要，方括号一步定位
  从头扫到尾比单词                    （代价 log n，不是扫全表）
if (没找到) push_back 一行           freq[w]++;
else table[at].count++;               一句话把「登记」和「加一」都办了
最后的遍历打印                   ——  照旧，还是得打印` },
        { t: `p`, text: `右边那一栏少掉三块、留下打印。这个对照值得记住，因为它是**容器选对了**的样子：不是你代码写得好，是标准库里有件工具正好长成这个需求的形状。往后你自己设计函数也该照这个标准想 —— 如果一段代码能整块删掉而行为不变，说明你手里多了个更好的抽象，而不是你在偷懒。` },
        { t: `svg`, caption: `同一个词进来：左边那张 vector 表要一行一行比过去才知道有没有，右边的 map 一步定位，命中就加一、没命中就先建 0 再加一`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 262">
  <g font-size="13" fill="#142639">
    <text x="24" y="22" font-weight="700" fill="#b8500f">第 87 课 · vector 加 struct：每来一个词，从表头扫到表尾</text>
    <text x="24" y="140" font-weight="700" fill="#1a7f42">第 99 课 · map：freq 方括号 w 两下，一步到那条记录</text>
  </g>
  <g font-size="12" text-anchor="middle">
    <rect x="24" y="36" width="96" height="30" fill="#eaf3fb" stroke="#00599c"/><text x="72" y="56">cat 行</text>
    <rect x="130" y="36" width="96" height="30" fill="#eaf3fb" stroke="#00599c"/><text x="178" y="56">dog 行</text>
    <rect x="236" y="36" width="96" height="30" fill="#eaf3fb" stroke="#00599c"/><text x="284" y="56">bird 行</text>
    <rect x="342" y="36" width="110" height="30" fill="#fffdf5" stroke="#b8722b" stroke-dasharray="5 4"/><text x="397" y="56" fill="#b8500f">扫到头也没有</text>
    <text x="510" y="56" text-anchor="start" fill="#33465e">→ 表尾登记</text>
  </g>
  <g font-size="12" fill="#57677c">
    <text x="24" y="90">比 3 次才知道「没有」，再 push_back 一行；命中时也要从第 0 行比起</text>
    <text x="24" y="112">词越多表越长：每个词的代价跟着行数一起涨，两个数相乘</text>
  </g>
  <g font-size="12" text-anchor="middle">
    <rect x="24" y="156" width="180" height="34" fill="#e7f6ec" stroke="#1a7f42"/><text x="114" y="178">bird → 1</text>
    <rect x="214" y="156" width="180" height="34" fill="#e7f6ec" stroke="#1a7f42"/><text x="304" y="178">cat → 3</text>
    <rect x="404" y="156" width="180" height="34" fill="#e7f6ec" stroke="#1a7f42"/><text x="494" y="178">dog → 2</text>
    <text x="24" y="212" text-anchor="start" fill="#33465e">键就是词，值就是次数 —— 不用再写 struct，也没有 find_word 这一层</text>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="24" y="236">「第一次见这个词」：方括号先建一条、值填 int 的默认值 0，交出来给 ++ → 变成 1</text>
    <text x="24" y="256">「已经见过」：方括号直接把那个数交出来，++ 加一 —— 登记与累加被一行同时办完</text>
  </g>
</svg>` },
        { t: `p`, text: `这张图里还藏着一件第 87 课没有的事：**map 的条目是按键排好的**。上面那三行写出来永远是 bird、cat、dog 的字典序，跟你登记的先后无关；而 vector 那张表是登记序，谁先来谁在前。所以「按次数排队」这件事 map 办不了 —— 它只按键排，要按值排就得把记录搬回 vector 再 sort。顺序是白拿的，但拿的是哪一种，得看容器的脾气。` },
        { t: `h2`, text: `怎么做` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <map>
#include <string>
#include <vector>

int main() {
    std::vector<std::string> words = {"python", "java", "python", "c++", "python", "java"};
    std::map<std::string, int> freq;
    for (const auto& w : words) freq[w]++;            // 核心就这一行
    for (const auto& [word, count] : freq)
        std::println("{:<8} {} 次", word, count);
    return 0;
}` },
        { t: `p`, text: `跑出来三行：c++ 1 次、java 2 次、python 3 次。注意**行是按词的字典序排的**（c、j、p），不是按次数 —— 上一课那个热搜榜要自己写比较函数排序，map 这里给不了，因为它只认键。想要「最热的词在前」，得把记录搬回 vector 再排，那是以后 sort 几课的事。` },
        { t: `h2`, text: `演示 1 · 顺手找出最热的那个词` },
        { t: `code`, lang: `c++`, code: `std::string hot;
int best = 0;
for (const auto& [word, count] : freq) {
    if (count > best) { best = count; hot = word; }
}
std::println("最热：{}，{} 次", hot, best);` },
        { t: `p`, text: `map 帮不了排序，但**帮你省了查找**：现在词典已经只有三种词了，扫三行找最大值便宜得很。第 87 课那种「边登记边扫全表」的重复劳动没有了 —— 这就是先把数据归置好、再在上面做处理的顺序感。另外这里比较用的是大于号，遇到并列取的是**先出现的那个**（按字典序靠前的），要稳定输出就得再加一条比较键，规矩跟第 87 课一样。` },
        { t: `h2`, text: `演示 2 · 换成数字符` },
        { t: `code`, lang: `c++`, code: `std::map<char, int> chars;
std::string s = "hello world";
for (char c : s) chars[c]++;              // 空格也照样记一笔
for (const auto& [ch, n] : chars)
    std::println("[{}] {}", ch, n);` },
        { t: `p`, text: `键的类型换成 char，整套逻辑一个字都没改 —— 这就是 map 的通用性：**只要是「按名字记账」，名字是什么类型都行**。这份输出里空格占一行，且因为空格的编号比字母小，它排在最前，所以打印时给它加了方括号才看得见。想忽略空格就在累加前加一句 if 判断 c 不等于空格；想合并大小写就得先把字符转成同一种形式，那是另一套工具的事，本课先如实统计。` },
        { t: `h2`, text: `演示 3 · 键也可以是词的长度` },
        { t: `code`, lang: `c++`, code: `std::map<int, int> by_len;                // 键：长度；值：几个词
for (const auto& w : words) by_len[w.size()]++;
for (const auto& [len, n] : by_len)
    std::println("{} 个字母的词：{} 个", len, n);` },
        { t: `p`, text: `三行输出是 3 个字母的词 1 个、4 个字母的词 2 个、6 个字母的词 3 个。这段的用意不在结果，而在**换了一个键，程序形状完全不变**：把「什么东西当名字」想清楚，比把代码怎么写想清楚更重要。这类「换个角度再统计一次」的练习，是以后做数据分析时天天要做的事。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `以为打印出来的顺序是「次数从高到低」。map 只按字典序，值再大也不挪位置；要按值排队得先把记录搬到 vector 里排。`,
          `数字符时忘了空格、换行、标点也各算一个字符。发现结果里冒出一个看不见的条目，八成就是它 —— 累加前先判断一下，或者打印时用方括号把它包出来。`,
          `统计中文时用 char 当键。一个字是好几串字节，逐 char 走会把同一个字拆成几笔烂账，看起来像乱码。要按字统计得先把句子切成完整的字，那是以后讲编码与宽字符的话题，本课先用 ASCII 句子练手。`,
          `在计数循环里混用 at 读值。at 遇到没登记过的键直接报错终止；计数场景里键是不是存在根本不用你管，交给方括号就行。`,
          `把 freq[w]++ 写成 freq[w] = freq[w] + 1 还觉得自己写得更清楚。等价，但多算一次查找；更要紧的是别写成 freq[w++] —— 那是在改 w，词典没动，编译器还会提醒你字符串不能自增。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `对比第 87 课的写法：少了哪些代码？一行的类型定义、找行号那个函数、「没有就登记、有就加一」那段分叉，各自被什么取代了`,
          `换 std::map<char, int>，统计一句话里每个字符出现的次数，空格也算一个字符`,
          `延伸：拿演示 3 那本按词长记账的词典，改成「词长 → 出现最长的那个词」，想想值该换成什么类型。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：map 的方括号「没有就建一条填 0」，在查账时是雷、在记账时是工具 —— 一行 freq[w]++ 顶掉第 87 课三块代码，靠的就是摸清了这个脾气。` }
      ]
    },
    {
      id: `m100`, title: `第 100 课 · set 去重：只收独一份的盒子`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用 std::set 把重复值挡在门外 —— 倒进去自动去重、自动排好序，而 insert 还会老实汇报这一次到底收没收。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `map 用了三课，现在把它的**值那一半扔掉**，就得到 set。一本词典是「名字 → 分数」，set 只剩「这些名字都在册」：它只有键，没有值。听起来像残缺品，其实它对应的是编程里频次极高的一类需求 —— **这个东西出现过没有**。名单去重、统计有多少个不同的字、判断某个 id 是否已注册、找出两列数里都有的那些…… 全都是「只关心有没有，不关心对应什么」。` },
        { t: `p`, text: `内部机制跟 map 一模一样，还是那棵按大小长起来的树，所以三条脾气原样搬过来：**元素唯一**（重复的进不来）、**自动有序**（遍历出来从小到大）、**查找便宜**（log n，不用扫全表）。也正因为这一层血脉，set 和 map 的方法名基本重合：size、contains、erase、insert、find 都在 —— 你会一个就会另一个，这不是巧合，是同一个实现套了个不同的壳。` },
        { t: `p`, text: `那为什么不直接在 vector 上判重？想想你会怎么写：每往里放一个，就先从头扫到尾看看有没有，没有才 push_back —— N 个元素就是 N 乘 N 次比较。或者先全塞进去、再 sort、再去重，那是以后专门的几课。set 的妙处在于**把「查重」做成了插入的副产品**：你要放进去，它本来就得在树上找位置，找的过程中顺手就发现了「这个我已经有」，于是当场拒收，一分钱没多花。` },
        { t: `p`, text: `还有件事得说清，因为它跟上一课正好相反：**set 没有方括号**。map 的 [] 之所以能「没有就建一条填默认值」，是因为它有值这个格子可以填；set 只有键，没法替你凭空决定「要放哪个键」。所以往里加只能老老实实写 insert —— 而 insert 会**主动告诉你这次收没收**，这一点比 map 的静悄悄创建厚道得多。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `code`, lang: `text`, code: `std::set<int> s;             一只装着整数、自动有序的盒子
s.insert(5);               放一个进去（返回信息里带「收没收」）
s.contains(5);             问有没有，跟 map 一样
s.size();                  有几个**不同**的值
s.erase(5);                删掉这个值
for (int v : s) ...        按从小到大的顺序逐个给你，不用排序` },
        { t: `p`, text: `注意 size 那句的解释：**不同的值**有几个。往装着 5、3、8 的盒子里再塞三个 5，size 还是 3。这是 set 最容易被误判的地方 —— 很多人以为它 size 变小了是 bug，其实那是它的本职工作。` },
        { t: `svg`, caption: `set 门口：重复的进不来，进来的自动排好队；insert 会回头告诉你这一趟收没收`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240">
  <g font-size="13" text-anchor="middle">
    <text x="120" y="24" fill="#57677c" font-weight="700">往里塞 5 3 8 3 5 1 8 9</text>
    <text x="470" y="24" fill="#1a7f42" font-weight="700">盒子里剩下</text>
  </g>
  <g font-size="13" text-anchor="middle">
    <rect x="30" y="40" width="44" height="34" fill="#eaf3fb" stroke="#00599c"/><text x="52" y="63">5</text>
    <rect x="78" y="40" width="44" height="34" fill="#eaf3fb" stroke="#00599c"/><text x="100" y="63">3</text>
    <rect x="126" y="40" width="44" height="34" fill="#eaf3fb" stroke="#00599c"/><text x="148" y="63">8</text>
    <rect x="174" y="40" width="44" height="34" fill="#fbe3e0" stroke="#b8500f" stroke-width="2.5"/><text x="196" y="63" font-weight="700">3</text>
    <rect x="222" y="40" width="44" height="34" fill="#fbe3e0" stroke="#b8500f" stroke-width="2.5"/><text x="244" y="63" font-weight="700">5</text>
    <rect x="270" y="40" width="44" height="34" fill="#eaf3fb" stroke="#00599c"/><text x="292" y="63">1</text>
    <rect x="318" y="40" width="44" height="34" fill="#fbe3e0" stroke="#b8500f" stroke-width="2.5"/><text x="340" y="63" font-weight="700">8</text>
    <rect x="366" y="40" width="44" height="34" fill="#eaf3fb" stroke="#00599c"/><text x="388" y="63">9</text>
  </g>
  <path d="M200 82 C230 120 260 120 300 120" stroke="#b8500f" stroke-width="2.5" fill="none" stroke-dasharray="5 4"/>
  <text x="150" y="124" font-size="12" fill="#b8500f">已被拒收</text>
  <g font-size="14" text-anchor="middle">
    <rect x="420" y="40" width="44" height="34" fill="#e7f6ec" stroke="#1a7f42"/><text x="442" y="63">1</text>
    <rect x="468" y="40" width="44" height="34" fill="#e7f6ec" stroke="#1a7f42"/><text x="490" y="63">3</text>
    <rect x="516" y="40" width="44" height="34" fill="#e7f6ec" stroke="#1a7f42"/><text x="538" y="63">5</text>
    <rect x="564" y="40" width="44" height="34" fill="#e7f6ec" stroke="#1a7f42"/><text x="586" y="63">8</text>
    <rect x="420" y="78" width="44" height="34" fill="#e7f6ec" stroke="#1a7f42"/><text x="442" y="101">9</text>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="20" y="164">insert(3) 再来一次 → 盒子说「我有了」，返回的 second 是 false，元素一个没多</text>
    <text x="20" y="188">insert(100) → second 是 true，盒子变成 1 3 5 8 9 100，位置自动排好</text>
    <text x="20" y="218" font-weight="700" fill="#00599c">一趟动作两样收获：既不让你重复，又替你不排序</text>
  </g>
</svg>` },
        { t: `h2`, text: `怎么做` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <set>
#include <vector>
int main() {
    std::vector<int> nums = {5, 3, 8, 3, 5, 1, 8, 9};
    std::set<int> unique_nums(nums.begin(), nums.end());    // 整列倒进去就去了重
    std::print("原数据:   ");
    for (int v : nums) std::print("{} ", v);
    std::print("\n去重排序: ");
    for (int v : unique_nums) std::print("{} ", v);
    std::println("");
    return 0;
}` },
        { t: `p`, text: `输出两行：原数据 5 3 8 3 5 1 8 9，去重排序 1 3 5 8 9。这一句 std::set<int> unique_nums(nums.begin(), nums.end()) 是本课最该记住的写法：给一个**起点和终点**，容器就把这一 range 的东西逐个收进自己家。第 88 课那个「几个格子、每格放什么」的构造是一种思路，这种「把别人家的内容端过来」是另一种思路，vector、map、set 都认这个规矩。想去重，你连循环都不用写。` },
        { t: `h2`, text: `演示 1 · insert 会汇报收没收` },
        { t: `code`, lang: `c++`, code: `auto r1 = unique_nums.insert(3);              // 已经有了
std::println("再塞 3：收下 = {}", r1.second);    // false
auto r2 = unique_nums.insert(100);            // 没见过
std::println("塞 100：收下 = {}", r2.second);    // true
std::println("现在共 {} 个不同的数", unique_nums.size());` },
        { t: `p`, text: `insert 返回的那个小东西里塞了两条信息：**这次有没有真的收进去**、以及**它待在哪个位置**。本课只用第一半，写成 r1.second 就是这个布尔值（第二半以后讲 pair 时会正式点名）。这个返回值非常值钱：它让你一行代码同时完成「加进去」和「判断是不是新东西」，比如统计一句子里有多少个不同的字，写 count 循环就能顺手数出来。` },
        { t: `h2`, text: `演示 2 · 找出两列数里都出现的数` },
        { t: `code`, lang: `c++`, code: `std::set<int> a = {5, 3, 8, 3, 5, 1};
std::set<int> b = {8, 9, 3, 12, 3};
for (int v : a)
    if (b.contains(v)) std::print("{} ", v);   // 两边都有
std::println("");` },
        { t: `p`, text: `输出是 3 和 8，每个后面还跟着一个空格。看两件事。**第一**，a 里那两个重复的 3、5 在构造时就没了，所以循环不会把 3 报两次 —— 去重让后面的代码自动变干净。**第二**，判「在不在 b 里」用的是 contains，一次 log n 的树上查找，跟 b 有多少元素没关系；换成 vector 你就得每问一次扫一遍。以后专门讲集合运算时会给你一个现成的算法干这件事，但今天这三行是它的原理版，看懂了再学那个不亏。` },
        { t: `h2`, text: `演示 3 · 想让它从大到小排` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <functional>
#include <set>

int main() {
    std::set<int, std::greater<int>> desc = {5, 3, 8, 3, 5, 1};
    for (int v : desc) std::print("{} ", v);       // 8 5 3 1
    std::println("");
    return 0;
}` },
        { t: `p`, text: `秘诀是**尖括号里的第二个参数**：std::set<int, std::greater<int>>。set 那棵树靠「比大小」决定谁在前，默认用的是小于号；你把规则换成 std::greater<int>，它就照新规则长，遍历出来自然从大到小。这一句正好回收第 97 课那句话 —— 「键必须能比大小」，今天补一句：**用什么比，你可以换**。同样的位置在 map 上也存在，键想反着排就再加一个比较规则。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `拿 set 当 vector 用，想取「第 3 个」。set 没有方括号下标，也不讲「第几个」；它只回答「有没有」。要按下标取数，先把内容搬到 vector 里。`,
          `奇怪 size 怎么比塞进去的次数少。这不是 bug，是它的本职；如果你其实**想保留重复**，那说明你要的是 vector 或者计数用的 map，不是 set。`,
          `以为 insert 失败会报错。它不报错也不崩，只是安静地不收，所以「有没有收」只能看你接住的返回值 —— 不接就等于放弃了这条情报。`,
          `想按插入顺序走一遍。set 一定会按大小把顺序打乱；要保序，用 vector，别指望 set 记住你来过几次、什么时候来。`,
          `换比较规则时忘了第二个尖括号参数，或者写成 std::set<int, std::greater> 少掉了尖括号里的类型。声明类型是 set 的一部分，改了它就不是同一个容器了。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `用两个 set 找出两列数字里「都出现」的数 —— 照演示 2 那三行，把两列换成你自己的数据，注意输出别把同一个数报两遍`,
          `查一查：怎么让 set 从大到小排？提示是 std::greater<int>，写在尖括号里当第二个参数；把演示 3 跑通，再换成 map 的键试试同样的招`,
          `延伸：读一段话，用 set 数出「有多少个不同的字符」，再用 map 数出「每个字符各出现几次」，把两者的 size 比一比 —— 它们应该相等。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：set 就是把值扔掉、只留键的 map —— 一趟插入同时办完「不许重复」和「顺手排好」，而 insert 的返回值是你唯一的情报来源，别把它扔掉。` }
      ]
    }
  ]
};
