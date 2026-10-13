/* 喵站 · C++ 掌握 正文分部 p03：第 86–88 课（主控亲写）
 *
 * 源稿：86_素数筛.cpp、87_词频统计.cpp、88_二维vector玩矩阵.cpp
 * 这三课是「把前面零散的零件拼成小工程」的第一批：一张名单、一张热搜、一张表格。
 * 写法上刻意比入门课更啰嗦一点 —— 掌握课要开始讲「为什么这么想」，不只是「怎么写」。
 */
window.MIAO_CPPM_P03 = {
  chapters: [
    {
      id: `m86`, title: `第 86 课 · 素数筛：把名单划着看，不试除`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用一张 bool 名单筛出 1 到 n 之间所有素数，并看懂「筛到根号 n 就够」这句省事的道理。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `判断一个数是不是素数，你大概已经会了：拿 2 到它前面每一个数去试除，都除不动就是素数。判断**一个**数这样行；要判断 1 到 50 **全部**的数，逐个试除要做上千次除法。` },
        { t: `p`, text: `两千多年前有人换了个方向：**别问「谁是素数」，去问「谁肯定不是」。** 拿一张写着 0 到 n 的名单，全标「候选」。从最小的素数 2 开始，把 2 的所有倍数划掉；下一个没被划掉的是 3，把 3 的倍数划掉；再往下是 5…… 划到最后，名单上活下来的就是素数。这就是**埃拉托斯特尼筛法**，圈子里通常直接叫「筛」。` },
        { t: `p`, text: `为什么这样更快？因为**合数会被它的每一个质因子划到**，我们只需要让每个质数干一次活。而「筛到根号 n 就够了」这条，是靠一个 elementary 的事实：如果 n 有个大于根号 n 的因子 a，那它必然配着一个小于根号 n 的因子 b（因为 a 乘 b 等于 n），小的那个会先把它划掉。所以外层的圈写 i 乘 i 小于等于 n，不是省事的近似，是**精确的边界**。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `筛法的形状值得单独记：**先备好一张全「真」的名单，再用圈去划**，而不是拿圈去逐个确认。凡是「范围里所有数都可能有某性质，最后要一份名单」的活，都能套这个形状：筛素数、找出没被任何优惠券覆盖的商品、标出所有被引用的文件 —— 只要「划掉」这件事能由一个已知成员批量完成，筛法就比逐个试便宜。` },
        { t: `p`, text: `它换来的代价也要说清：要一整个 bool 名单（n 加一项，每项一位），n 特别大时内存吃紧；而且它要求「范围已知且连续」。不知道上界、或者数是一点点流进来的场合，就得换别的招（以后学堆那几课会给它一个真正的解法）。**「有范围、要全表」用筛，「一个个来、要当前最值」用堆**，这条判断以后会反复用上。` },
        { t: `h2`, text: `怎么做` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>

int main() {
    int n = 50;
    std::vector<bool> is_prime(n + 1, true);      // 名单：默认全是候选
    is_prime[0] = is_prime[1] = false;            // 0 和 1 明确不是
    for (int i = 2; i * i <= n; ++i) {            // 筛到根号 n 就够
        if (!is_prime[i]) continue;               // 已被划掉，跳过
        for (int k = i * i; k <= n; k += i)       // 从 i 平方开始划
            is_prime[k] = false;
    }
    return 0;
}` },
        { t: `p`, text: `三处细节各说一句。**第一句的构造写法** vector<bool> is_prime(n + 1, true) 是第 40 课那个「几个格子、初始放什么」，加 1 是因为要把 n 本身也留在名单里。**为什么从 i 平方开始划**：i 乘 2、i 乘 3 这些更小的倍数，早在 2、3 那一轮就被划过了，从平方开始是第一遍没被覆盖的位置。**内层用 k 加等于 i 而不是乘法下标**：一路加就是等差走位，比每次重算省一步，也更好读。` },
        { t: `svg`, caption: `筛 2 到 20 的三轮：每轮划掉当前活着的数的倍数，剩下的就是素数`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 226">
  <g font-size="12" fill="#142639" text-anchor="middle">
    <text x="20" y="30" text-anchor="start" font-weight="700">起始：2 到 20 全是候选</text>
    <text x="112" y="66" font-weight="700" fill="#00599c">划 2 的倍数</text><text x="248" y="66" font-weight="700" fill="#00599c">划 3 的倍数</text><text x="384" y="66" font-weight="700" fill="#00599c">i 到 4 已死，停</text>
  </g>
  <g font-size="11">
    <text x="20" y="92" fill="#57677c">2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20</text>
    <text x="112" y="92" fill="#b8500f" font-weight="700">2 3 5 7 9 11 13 15 17 19</text>
    <text x="248" y="92" fill="#b8500f" font-weight="700">2 3 5 7 11 13 17 19</text>
    <text x="384" y="92" fill="#1a7f42" font-weight="700">2 3 5 7 11 13 17 19</text>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="20" y="126">注意第二轮：3 的倍数里 6 已经没了，从 9 开始划才对</text>
    <text x="20" y="150">第三轮 i 取 4，名单上 4 早被划掉 → 这一轮整轮跳过</text>
    <text x="20" y="174">i 取 5 时 5 乘 5 等于 25，超过 20 → 外层圈自然结束</text>
    <text x="20" y="204" font-weight="700" fill="#1a7f42">20 以内 8 个素数：2 3 5 7 11 13 17 19</text>
  </g>
</svg>` },
        { t: `p`, text: `把这三层动作分开看，是这类题的通用心法：**第一层是「用什么数据结构记账」**（一张 bool 名单，而不是「一个个问过去」）；**第二层是「谁来划」**（每个活着的数负责划自己的倍数，被划掉的数不用再干活）；**第三层才是「圈怎么写」**。顺序反了就先写圈、再发现跑不动，然后原地改圈边界 —— 这是新手最常见的绕路。以后遇到「找出所有满足某性质的数」，先问这三层，多半都能省掉一轮暴力。` },
        { t: `h2`, text: `演示 1 · 把名单数出来` },
        { t: `code`, lang: `c++`, code: `// 接在上面那段之后
int total = 0;
for (int i = 2; i <= n; ++i) {
    if (is_prime[i]) {
        std::print("{} ", i);
        ++total;
    }
}
std::println("\n共 {} 个", total);` },
        { t: `p`, text: `一个都不省略地把名单扫一遍，是筛法唯一「笨」的地方，但它只有 n 次判断，比试除便宜太多。n 等于 50 时打印 2 3 5 7 11 13 17 19 23 29 31 37 41 43 47，共 15 个。` },
        { t: `h2`, text: `演示 2 · 跟试除法对一次账` },
        { t: `code`, lang: `c++`, code: `// 不筛，逐个问「这个数能不能被拆开」：找到因子就当场收工
bool trial(int x) {
    if (x < 2) return false;
    for (int d = 2; d * d <= x; ++d)
        if (x % d == 0) return false;
    return true;
}

int by_trial = 0;
for (int x = 2; x <= n; ++x) if (trial(x)) ++by_trial;
std::println("试除法：{} 个素数", by_trial);` },
        { t: `p`, text: `两种写法在同一台机器上跑 100 万以内（编译开了优化），实测是：**试除法 153 毫秒，筛法 3 毫秒**，两边都数出 78,498 个素数，结果一字不差。差距从哪来？试除法是「每个数各自做一遍功课」，一百万个数各数都要试到自己的根号；筛法是「每个合数只负责被划掉」，同样的活儿只做一遍，而且做的是加法下标。这门课以后会反复撞上这个模式：**把重复劳动改成一次性登记**，比在循环里抠技巧有用得多。` },
        { t: `p`, text: `顺带说清两件事，都是本课代码里那些「看起来多余」的写法的原因。第一件，为什么外层圈只要跑到根号 n：任何合数 c 都能写成 a 乘 b，而 a、b 里至少有一个不大于 c 的平方根，所以 c 一定会被那个**较小的因子**在某轮划掉；等 i 越过根号 n，剩下的全是被划过的重复劳动。第二件，名单为什么用 vector<bool> 而不是 vector<int>：n 等于 100 万时，一位一格的 bool 名单实测占 125,001 字节，而按字节存的普通 bool 数组要 1,000,001 字节 —— 八倍的差。这就是「名单类数据」的典型买卖：拿一点点取用时的麻烦，换内存下来得住。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `忘划 0 和 1。它们都不是素数，不手动划掉，最后名单会把 1 当素数报出来。`,
          `vector<bool> 当普通 vector 用。它是标准库里唯一的特例：装的是**一位一位的位**，不是 bool 数组，所以拿它当 bool 用没问题，但别去要它的元素地址（那是以后讲引用时会踩的坑）。`,
          `外层圈写成 i 小于等于 n。功能没错，但白跑很多轮；更糟的是内层从 i 平方起算，n 大时 i 乘 i 会**溢出**成负数，圈条件一直成立就死循环 —— 用 i 乘 i 小于等于 n 这个写法本身就避开了大 i，别乱改。`,
          `内层起点写成 2 乘 i。结果是对的但白划一堆，效率掉一半以上；写 i 乘 i 才是筛法的标准姿势。`,
          `名单开成 n 格。要装 0 到 n 得 n + 1 格，最后一格留给 n 自己，很多人在这差一格上翻车。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把 n 改成 100，数一数有多少个素数`,
          `进阶：输出第 10 个素数（数够 10 个就停）`,
          `把 n 改成 1000000 跑一次，看耗时；再把外层圈改成 i 小于等于 n 跑一次，对比一下差多少 —— 亲手确认「筛到根号 n」省的是哪部分。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：换个方向想问题 —— 不找「谁是素数」，只划「谁一定不是」；一张 bool 名单加一层到根号 n 的圈，就把一千次除法压成了几十次划掉。` }
      ]
    },
    {
      id: `m87`, title: `第 87 课 · 词频统计：点人头，再排热搜`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把「数每个词出现几次」写成能跑的程序 —— 名单里没有就登记一行，有就次数加一，最后按次数排队。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `给你一篇文章，问「哪个词用得最多」。人会先划计数器：看到一个词就在心里给它加一笔。程序照做就行，只是它得先决定**计数器放哪儿**。` },
        { t: `p`, text: `手里已有的工具是 vector 和 struct。两者拼起来正好是一张登记表：每一行装「哪个词」加「出现几次」。来一个词，就在表里从头到尾找它 —— 找到就给那一行的次数加一，没找到就在表尾登记一行新的。完事儿再把表按次数排序，取前几名，就是热搜榜。` },
        { t: `p`, text: `这套「线性找 + 追加登记」的做法在数据量小的时候完全够用（几千个词没感觉）。等学到 map 那几课，「找」这一步会从「扫全表」变成「一步定位」，你会回头看这一课并明白**为什么需要一个新容器** —— 先手写过一遍，那种快才有参照。` },
        { t: `code`, lang: `text`, code: `来一个词  →  登记表里从头找到尾
   ├─ 找到了：那一行 count 加 1
   └─ 没找到：表尾 push_back 一行新的，count 记 1

最后：整张表按 count 从大到小 sort，前几名就是答案` },
        { t: `h2`, text: `怎么做` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <vector>
#include <algorithm>

struct WordCount { std::string word; int count = 0; };   // 登记表的一行

// 找一个词在表里的行号；没有就返回表长，当作「没有这一行」的哨兵
int find_word(const std::vector<WordCount>& table, const std::string& w) {
    for (size_t i = 0; i < table.size(); ++i)
        if (table[i].word == w) return i;
    return table.size();
}` },
        { t: `p`, text: `先搭两样东西：一行的形状（词 + 次数，次数**声明时给 0** 免得后面忘初始化），以及「找在哪一行」这件事。find_word 返回 table.size() 当「没找到」的暗号，这个套路和 find_if 找不到时返回 end 是一路的 —— 表长那个位置正好是不存在的行号，拿它当哨兵很自然。` },
        { t: `h2`, text: `演示 1 · 登记与累加` },
        { t: `code`, lang: `c++`, code: `// 接上一段：WordCount 和 find_word 已经写好，main 里就这么填
std::vector<std::string> text = {"cat", "dog", "cat", "bird", "cat", "dog", "fish"};
std::vector<WordCount> table;                        // 空表，等着登记

for (const std::string& w : text) {
    int at = find_word(table, w);                           // 在表里找这个词
    if (at == table.size()) table.push_back(WordCount{w, 1});    // 没有就登记一行
    else table[at].count++;                                 // 有就加一笔
}

for (const WordCount& row : table) std::println("{} {}", row.word, row.count);` },
        { t: `p`, text: `输出四行：cat 3、dog 2、bird 1、fish 1 —— 顺序是**第一次出现的顺序**（登记序），因为还没排。注意 push_back 那句写的 WordCount{w, 1}，是「按栏位顺序造一行」的聚合初始化；另外那两处 const 引用：词表逐圈读、表逐圈读，都按第 61 课的规矩走，别复制。` },
        { t: `p`, text: `这段的肌肉在 find_word 那一层：**「先查有没有，再决定加还是改」**是统计类程序的通用骨架，不管底下是一张 vector 表还是一本 map 字典。你以后写「数 IP 访问次数」「数某字出现几次」「给选课名单去重」，改的只是「什么算同一个」这一条判断（今天是字符串相等，将来可能是忽略大小写、可能是同一个人不同写法）。所以本课真正的收获不是词频，是**登记 + 累加**这两下。` },
        { t: `svg`, caption: `七个词逐个进表：命中就给那一行的次数加一，没命中就在表尾登记一行新的 —— 表的顺序是登记序`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250">
  <g font-size="13" fill="#142639">
    <text x="24" y="22" font-weight="700">来词排队：cat dog cat bird cat dog fish</text>
  </g>
  <g font-size="12" text-anchor="middle">
    <rect x="24" y="36" width="60" height="30" fill="#eaf3fb" stroke="#00599c"/><text x="54" y="56">cat</text>
    <rect x="96" y="36" width="60" height="30" fill="#eaf3fb" stroke="#00599c"/><text x="126" y="56">dog</text>
    <rect x="168" y="36" width="60" height="30" fill="#fff3d6" stroke="#b8722b"/><text x="198" y="56" fill="#b8500f" font-weight="700">cat</text>
    <rect x="240" y="36" width="60" height="30" fill="#eaf3fb" stroke="#00599c"/><text x="270" y="56">bird</text>
    <rect x="312" y="36" width="60" height="30" fill="#fff3d6" stroke="#b8722b"/><text x="342" y="56" fill="#b8500f" font-weight="700">cat</text>
    <rect x="384" y="36" width="60" height="30" fill="#eaf3fb" stroke="#00599c"/><text x="414" y="56">dog</text>
    <rect x="456" y="36" width="60" height="30" fill="#e7f6ec" stroke="#1a7f42"/><text x="486" y="56" fill="#1a7f42" font-weight="700">fish</text>
    <text x="560" y="56" text-anchor="start" fill="#b8500f">黄 = 命中，加一</text>
    <text x="560" y="72" text-anchor="start" fill="#1a7f42">绿 = 没命中，登记</text>
  </g>
  <g font-size="12" text-anchor="middle">
    <rect x="24" y="96" width="120" height="30" fill="#eaf3fb" stroke="#00599c"/><text x="84" y="116">cat 行</text>
    <rect x="156" y="96" width="120" height="30" fill="#eaf3fb" stroke="#00599c"/><text x="216" y="116">dog 行</text>
    <rect x="288" y="96" width="120" height="30" fill="#eaf3fb" stroke="#00599c"/><text x="348" y="116">bird 行</text>
    <rect x="420" y="96" width="120" height="30" fill="#e7f6ec" stroke="#1a7f42" stroke-dasharray="5 4"/><text x="480" y="116" fill="#1a7f42">fish 行（新登记）</text>
  </g>
  <g font-size="13" text-anchor="middle" fill="#142639">
    <text x="84" y="152" font-weight="700">3</text><text x="216" y="152" font-weight="700">2</text><text x="348" y="152" font-weight="700">1</text><text x="480" y="152" font-weight="700">1</text>
    <text x="84" y="170" font-size="11" fill="#57677c">第 1、3、5 个词</text><text x="216" y="170" font-size="11" fill="#57677c">第 2、6 个词</text>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="24" y="200">每个进表的词都要从第一行扫到它命中或扫到尾 —— 词多表长，比较次数就是两者相乘</text>
    <text x="24" y="224">表此时的顺序是登记序（cat 先出现所以第一行）；要按次数排队，还得 sort 那一下</text>
    <text x="24" y="244" font-weight="700" fill="#1a7f42">统计程序的通用骨架：先查有没有 → 有就累加，没有就登记</text>
  </g>
</svg>` },
        { t: `p`, text: `把这张图和代码对上：上面那排格子是输入的词，中间那排是 table 这个 vector，最下面那行数字就是每个 WordCount 的 count。第三个词 cat 进来时，find_word 一比就命中第 0 行，count 从 1 变 2；fish 进来时把整张表扫完都没命中，于是走到 push_back 那条支。拿这个例子在手边数一遍比较次数：七个词依次是 0、1、1、2、1、2、3 次，一共十次 —— 第一个词不比（表还空着），而表每多一行，后面所有「没命中」的词就多比一次。词多表长，这笔账就长成「两个数相乘」，这正是以后换一本字典的理由。` },
        { t: `h2`, text: `演示 2 · 排成热搜` },
        { t: `code`, lang: `c++`, code: `std::sort(table.begin(), table.end(),
          [](const WordCount& a, const WordCount& b) {
              return a.count > b.count;      // 次数高的在前
          });

for (const WordCount& row : table)
    std::println("{} 次 —— {}", row.count, row.word);` },
        { t: `p`, text: `上一课的「比较链」在这儿直接用上了：只比 count 的话，同为 1 次的 bird 和 fish 谁在前没定，换台机器可能就换位置。**把平局补齐**是这一步的功课：先比 count，不等就按 count；相等就比 word（字典序，第 19 课那个字符串比大小）。` },
        { t: `p`, text: `最后把这一课和以后的路接上：本课登记表是「扫一遍找行号」，词多了就慢（每来一个词都要走全表，M 个词、N 次就是 M 乘 N）。标准库后来给了一本**按键直接定位**的字典（map 那几课），登记与累加这两下代码几乎不变，只是 find_word 整块被换成「直接写 table 下标方括号 w」。所以今天写的不是弯路，是那本字典的**对照物** —— 没有手写过线性查找，就不会明白字典省的是哪一步。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `排序只比一次数量，不管平局。表现是「榜单在小数据下偶尔换序」，很难查 —— 补第二条比较键就根治。`,
          `把「没找到」的哨兵写成 -1 又用 size_t 接。size_t 是无符号类型，-1 会变成天文数字，接着当下标用就越界。要么统一用 int 加 casts，要么就用 table.size() 当哨兵（本课这种）。`,
          `在 range-for 里往同一个 vector 加元素。for 里的 table 一边被遍历一边 push_back，迭代器会失效（轻则结果乱，重则崩）。本课的循环遍历的是 text，改的是 table，才相安无事。`,
          `count 忘了给初值。struct 的 int 成员不写初值就是垃圾值，第一次加一可能加出个巨大数。声明处写 int count = 0; 一劳永逸。`,
          `把词比较写成 == 之外的中文排序幻想。std::string 的比较按**字节序**，大写在小写前面；想忽略大小写得先转小写（那是以后 std 里的 tolower 一族，本课不碰）。`
        ]},
        { t: `p`, text: `读代码时留意两个类型细节：**size_t 与 int 混用**。table.size() 返回的是 size_t（无符号），拿 int 去接会收到编译器的收窄警告；本课的 find_word 故意返回 int，是因为「行号」这个东西我们总想让它能表示「没有」（拿表长当哨兵），而调用处拿它跟 table.size() 比时又会有一次符号比较。想把这类噪音彻底消掉，得等学完模板与类型别名之后再回头看 —— 现在的正确姿势是：**知道有这回事，先照抄能跑的版本**。另一个细节是 WordCount{w, 1} 这个临时行：按栏位顺序给值，就地造出来交给 push_back，不必先起个变量名。` },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `次数相同时按字典序排（比较函数里先比 count，再比 word）`,
          `用 struct Student 加成员函数 total 给成绩单按总分排名`,
          `自己造一份 12 个词的小文本（重复几次随意），跑完打印「出现次数最多」的那个词；有两个并列最多时，把它们都打出来。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：统计 = 「登记一张表 + 一个找行号的动作」；排序 = 「一条比到能分出胜负的比较链」。这两样以后会长成 map 和 stable_sort，但根子在这儿。` }
      ]
    },
    {
      id: `m88`, title: `第 88 课 · 二维 vector：把数据摆成一张表`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会用 vector 套 vector 表示表格，看懂「外层是行、内层是列」这两个下标各管什么，并写一次行列互换。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `一列数用 vector；一张表（比如 3 行 4 列的成绩册、像素图、棋盘）就是**vector 里再放 vector**：外层容器管「有几行」，每个内层容器管「这一行有几格」。取一格要两个下标：先选行再选列，m 下标 i 下标 j 读作「第 i 行的第 j 格」。` },
        { t: `p`, text: `这个顺序**不能颠倒**，它决定你怎么写圈层。外层圈走行、内层圈走列，是几乎所有表格代码的形状；反过来写会漏格或者越界。还有件事要习惯：C++ 的表格默认是「锯齿」的 —— 每一行的长度可以不一样，编译器不管。想当矩阵用，就得自己保证每行等长（或者用本课的构造写法一次造齐）。` },
        { t: `code`, lang: `text`, code: `Matrix m = { {1, 2, 3},        外层 size 等于 2（两行）
             {4, 5, 6} };       内层 size 等于 3（每行三格）

m[1]      → 第二行那个 vector，{4, 5, 6}
m[1][2]   → 第二行的第三格，值 6
m[i].size()   第 i 行有几格
m.size()      有几行` },
        { t: `p`, text: `开头那行 using Matrix = std::vector<std::vector<int>> 是第 50 课的别名：三层尖括号写两遍太吵，起个短名字，读代码的人也省事。` },
        { t: `h2`, text: `怎么做` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>

using Matrix = std::vector<std::vector<int>>;      // 别名：三层尖括号不必反复写

int main() {
    Matrix m = {{1, 2, 3}, {4, 5, 6}};                    // 2 行 3 列
    Matrix t(m[0].size(), std::vector<int>(m.size()));   // 3 行 2 列，全 0
    for (size_t i = 0; i < m.size(); ++i)
        for (size_t j = 0; j < m[0].size(); ++j)
            t[j][i] = m[i][j];                           // 行列互换
    return 0;
}` },
        { t: `p`, text: `转置只做一件事：**把两个下标对调**。写出来的那一行 t 下标 j 下标 i 等于 m 下标 i 下标 j，读三遍，确认自己能把「第 i 行第 j 列搬到第 j 行第 i 列」这句话对上号。下面这段负责把结果打出来看看。` },
        { t: `code`, lang: `c++`, code: `    for (const std::vector<int>& row : t) {   // 按 const 引用读行，别复制整行
        for (int v : row) std::print("{} ", v);
        std::println("");                               // 一行打完补换行
    }` },
        { t: `p`, text: `三个点。造 t 的那句是第 40 课那个「几个格子、每格放什么」的构造，只不过**每格本身又是一个 vector**，所以参数里套了一个 std::vector<int>(m.size()) —— 一次造出 3 行、每行 2 个 0，比 push_back 攒出来干净。转置的动作只有一句：**t 下标 j 下标 i 等于 m 下标 i 下标 j**，把行列两个下标对调。打印用了嵌套 range-for，外层按 const 引用读行（别复制整行），内层是 int 直接按值取。` },
        { t: `svg`, caption: `转置就是「沿对角线折一下」：第 i 行第 j 列搬到第 j 行第 i 列`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 230">
  <g font-size="13" fill="#142639" text-anchor="middle">
    <text x="120" y="26" fill="#00599c" font-weight="700">原表 2 行 3 列</text>
    <text x="420" y="26" fill="#1a7f42" font-weight="700">转置后 3 行 2 列</text>
  </g>
  <g font-size="13">
    <rect x="60" y="44" width="60" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="90" y="70" text-anchor="middle">1</text>
    <rect x="120" y="44" width="60" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="150" y="70" text-anchor="middle">2</text>
    <rect x="180" y="44" width="60" height="40" fill="#fff3d6" stroke="#b8722b" stroke-width="2.5"/><text x="210" y="70" text-anchor="middle" font-weight="700">3</text>
    <rect x="60" y="84" width="60" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="90" y="110" text-anchor="middle">4</text>
    <rect x="120" y="84" width="60" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="150" y="110" text-anchor="middle">5</text>
    <rect x="180" y="84" width="60" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="210" y="110" text-anchor="middle">6</text>
    <text x="46" y="70" text-anchor="middle" fill="#57677c" font-size="12">行 0</text>
    <text x="46" y="110" text-anchor="middle" fill="#57677c" font-size="12">行 1</text>
    <rect x="360" y="44" width="60" height="40" fill="#e7f6ec" stroke="#1a7f42"/><text x="390" y="70" text-anchor="middle">1</text>
    <rect x="420" y="44" width="60" height="40" fill="#e7f6ec" stroke="#1a7f42"/><text x="450" y="70" text-anchor="middle">4</text>
    <rect x="360" y="84" width="60" height="40" fill="#e7f6ec" stroke="#1a7f42"/><text x="390" y="110" text-anchor="middle">2</text>
    <rect x="420" y="84" width="60" height="40" fill="#e7f6ec" stroke="#1a7f42"/><text x="450" y="110" text-anchor="middle">5</text>
    <rect x="360" y="124" width="60" height="40" fill="#fff3d6" stroke="#b8722b" stroke-width="2.5"/><text x="390" y="150" text-anchor="middle" font-weight="700">3</text>
    <rect x="420" y="124" width="60" height="40" fill="#e7f6ec" stroke="#1a7f42"/><text x="450" y="150" text-anchor="middle">6</text>
  </g>
  <path d="M250 64 C300 64 320 144 356 144" stroke="#b8722b" stroke-width="2.5" fill="none" stroke-dasharray="5 4"/>
  <polygon points="356,144 346,138 346,150" fill="#b8722b"/>
  <text x="300" y="200" font-size="13" fill="#33465e" text-anchor="middle">高亮那格：原表第 0 行第 2 列，落到新表第 2 行第 0 列 —— 两个下标对调</text>
</svg>` },
        { t: `p`, text: `顺带把「为什么表格代码都要先问尺寸」说清：m.size() 是行数，m[0].size() 是第一行的格数（= 列数），这两个数**必须分开拿**，别互相代用。方阵（行列等长）时写错看不出来，一换成 2 行 3 列立刻越界或漏格 —— 这类「只在非方阵暴露的 bug」极其常见，写表格代码时养成一个习惯：先打印一次行数和列数，再开始算。` },
        { t: `h2`, text: `演示 1 · 不规则的表会怎样` },
        { t: `code`, lang: `c++`, code: `Matrix ragged = {{1, 2}, {3}, {4, 5, 6, 7}};

for (size_t i = 0; i < ragged.size(); ++i)
    std::println("第 {} 行有 {} 格", i, ragged[i].size());

// 每行的格数不同，取 m[0][3] 就是越界 —— 它不报错，只是读到你不想读的地方` },
        { t: `p`, text: `三行分别是 2、1、4 格。这在某些场景是特性（比如「每个学生选了不同数量的课」），但你**想要矩阵**时它就是陷阱：所有基于「列数统一」的代码都会崩。防法两条：要么构造时一次造齐（本课 t 那种写法），要么用之前先跑一遍检查每行等长，不等就明确报错退出。` },
        { t: `h2`, text: `演示 2 · 把整张表按列汇总` },
        { t: `code`, lang: `c++`, code: `// 接上面的 m（2 行 3 列）：算每一列各自的和
std::vector<int> col_sum(m[0].size());                // 有几列就发几个格子，int 默认给 0
for (const std::vector<int>& row : m)                 // 外层照旧走行
    for (size_t j = 0; j < row.size(); ++j)
        col_sum[j] += row[j];                         // 每一行都往同一列贡献一格

for (size_t j = 0; j < col_sum.size(); ++j) std::println("第 {} 列合计 {}", j, col_sum[j]);
// 1 2 3 / 4 5 6 这张表跑出来是：第 0 列合计 5、第 1 列 7、第 2 列 9` },
        { t: `p`, text: `这段的形状值得停一下：按行读的时候外层圈是行、内层圈是列；**按列汇总时外层圈还是行**，只是往 col_sum 那一维里「加到第 j 格」。别写成「外层圈列、内层圈行」去一格一格找 —— 那叫转置遍历，能跑，但每换一个列号都要把整张表重走一遍，白算。表格代码的第一个问题永远是：**我这一圈在遍历什么**，行还是列；把它写在注释里，下标就不会反。` },
        { t: `p`, text: `最后交代一件内存上的实情，它解释了上面所有关于「形状」的讲究。二维 vector **不是连着的一大块**：外层容器里放的是一串 vector 对象，每个 vector 各自管自己那一行的内存，行与行之间可能隔得很远。这跟第 40 课「vector 自己会伸缩」是一套机制的两次应用 —— 你拿到的是「一张表」，底下其实是「一行一个盒子，盒子各自装箱」。所以按行连续读是最顺的姿势（一行内的格子是邻居），按列跳着读要一趟趟跑不同盒子；真要连着的大块内存、真要在乎这一趟一趟的开销，以后再学把表格摊平成一维自己算下标的那套办法，本课先按「行是行、列是列」把两个下标各管什么写熟。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `两个下标写反。m 下标 j 下标 i 在转置里是有意的，别处十有八九是笔误；症状是「结果对不上但也没崩」。`,
          `内层格数拿外层的 size 算。列数要用 m[0].size()（或某一行问一次），写成 m.size() 就把行数当列数 —— 方阵看不出来，长方形就错了。`,
          `造空表再逐格 push_back 却忘了行数为 0。Matrix t; 然后 t[0][0] = 1; 是**未定义行为**（t 一行都没有）。要么构造时给足，要么先 resize 再写。`,
          `range-for 外层按值写。for (auto row : m) 每圈复制一整行 int，改 row 还改不到 m。外层写 const std::vector<int>&，要改就写 auto&。`,
          `拿 size_t 做减法判边界。i 减 1 在 i 为 0 时炸成巨大正数，圈条件一路成立 —— 倒着走圈用 int 下标，或者写成 i 大于 0 时先减再看。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `写一个 multiply 函数，参数是两个矩阵 a 与 b，三重循环把 result 下标 i 下标 j 累加成 a 下标 i 下标 k 乘 b 下标 k 下标 j`,
          `判断 m 转置后是否还等于 m（对称矩阵）`,
          `造一个 3 行 3 格的单位矩阵（对角线是 1，其余 0），打印出来；再用它乘上本课那个 2 乘 3 的表，检查行列数对不对得上。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：二维 vector 是「外层管行、内层管列」的两层容器，两个下标的顺序就是圈层的顺序；表格的自由（每行可不等长）既是它的用处，也是它最容易咬人的地方。` }
      ]
    }
  ]
};
