/* 喵站 · C++ 掌握 正文分部 p31：第 179–182 课（L6-01 动态数组四连：认识容量、手写搬家、迷你 vector、中间插队）
 * 源稿：学习资料/C++入门/179_动态数组是什么.cpp 等 4 份。款式与规矩同 cppm/p01.js 黄金样板。
 * 所有数字与输出均以本机 g++ -std=c++23 实跑为准。
 */
window.MIAO_CPPM_P31 = {
  chapters: [
    {
      id: `m179`, title: `第 179 课 · 动态数组是什么：size 与 capacity`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：分清 vector 的两个数——元素个数 size 是「实际放了几件」，容量 capacity 是「现在有几格」；格子没满随便放，满了它自己悄悄搬家。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `从入门课第 40 课起你就一直在用 vector，把它当「会自己变长的数组」。这一课起我们连用四课把它的肚子剖开看清楚：变长不是凭空长出来的，是一次次「搬家」搬出来的。先把两个词立好：普通数组像固定格子的鸡蛋盒，买来几格就永远是几格；vector 是自动扩容的收纳盒——格子没满随便放，满了它自己悄悄换个更大的盒子。` },
        { t: `p`, text: `盒子上刻着两个数，各有各的问法：v.size() 问「实际放了几件」，v.capacity() 问「现在有几格」。这两个数可以不相等，而且经常不相等——盒子比东西大，多出来的空格是提前占好的地皮。` },
        { t: `p`, text: `先把一个容易扭弯的地方掰直：capacity 大不代表你已经放了那么多东西。盒子 8 格、放着 5 件，你的账只有 5 件——下标 0 到 4 是你的，5 到 7 是空地。空地里躺着的往往是上一任住户的残值，读了不算数；第 74 课指针的规矩在这里一字不改，只是多了一条：你的地界到 size 为止。` },
        { t: `svg`, caption: `同一只 vector 的两个数：size 数放过的实格，capacity 数包括空格在内的全部格子`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 232">
  <g font-size="13" fill="#142639">
    <text x="24" y="24" font-weight="700">一只装了 5 件的 vector，盒子有 8 格</text>
  </g>
  <g font-size="12" text-anchor="middle">
    <text x="205" y="52" fill="#00599c" font-weight="700">size = 5（放了 5 件）</text>
    <text x="480" y="52" fill="#b8722b" font-weight="700">capacity = 8（共有 8 格）</text>
  </g>
  <g font-size="13" text-anchor="middle">
    <rect x="40" y="64" width="70" height="44" fill="#eaf3fb" stroke="#00599c"/><text x="75" y="92">10</text>
    <rect x="110" y="64" width="70" height="44" fill="#eaf3fb" stroke="#00599c"/><text x="145" y="92">20</text>
    <rect x="180" y="64" width="70" height="44" fill="#eaf3fb" stroke="#00599c"/><text x="215" y="92">30</text>
    <rect x="250" y="64" width="70" height="44" fill="#eaf3fb" stroke="#00599c"/><text x="285" y="92">40</text>
    <rect x="320" y="64" width="70" height="44" fill="#eaf3fb" stroke="#00599c"/><text x="355" y="92">50</text>
    <rect x="390" y="64" width="70" height="44" fill="#fffdf5" stroke="#b8722b" stroke-dasharray="5 4"/><text x="425" y="92" fill="#b8722b" font-size="12">空</text>
    <rect x="460" y="64" width="70" height="44" fill="#fffdf5" stroke="#b8722b" stroke-dasharray="5 4"/><text x="495" y="92" fill="#b8722b" font-size="12">空</text>
    <rect x="530" y="64" width="70" height="44" fill="#fffdf5" stroke="#b8722b" stroke-dasharray="5 4"/><text x="565" y="92" fill="#b8722b" font-size="12">空</text>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="24" y="142">实线 5 格是 push_back 放过的，size 数它们；虚线 3 格是占好地皮还没放东西的</text>
    <text x="24" y="168">空格能白放 3 件（第 6、7、8 件）；放第 9 件挤不下，才整盒搬去 16 格新盒</text>
    <text x="24" y="194">本机实测放 17 件的台阶：0→1→2→4→8→16→32，翻倍跳，两个数从放入第 3 件起分家</text>
    <text x="24" y="222" font-weight="700" fill="#1a7f42">size 回答「装到哪了」，capacity 回答「还能白放几件」</text>
  </g>
</svg>` },
        { t: `p`, text: `为什么不满也要多占格子？想想「每放一件刚好用完就再买一格」的笨办法：放 1000 件就要搬 1000 次家，每次搬家整盒东西一件件过手。vector 的办法是一次多买一截，让搬家变稀疏——本机实测的答案是「一次买成两倍」，这笔账往后手写搬家的两课专门算给你看。` },
        { t: `h2`, text: `怎么做` },
        { t: `p`, text: `你要做的只有三件事：声明一个 vector、用 push_back 往尾后放东西、想知道家底时问一下 size 和 capacity。搬家这个动作没有任何按钮——开新格、搬旧件、扔旧盒全在库里自动完成，你连搬家的瞬间都察觉不到，除非盯着 capacity 看。下面三个演示带你把它盯个明白。` },
        { t: `p`, text: `size 和 capacity 数的都是「件」，不是字节：装了 5 件 int，size 就是 5，跟数人头一样；占了多少内存是另一笔账——件数乘每件的宽度，本课不展开。另外这俩都是成员函数，要写成 v.size()、v.capacity() 才问得到，括号不能省，它们是「问盒子」的动作，不是盒子上的牌子。` },
        { t: `h2`, text: `演示 1 · 放 8 件，盯着两个数看` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>

int main() {
    std::vector<int> v;
    std::println("刚创建: 容量 {}，元素 {}", v.capacity(), v.size());
    for (int i = 1; i <= 8; ++i) {
        v.push_back(i * 10);
        std::println("放入 {} 后: 容量 {}，元素 {}", i * 10, v.capacity(), v.size());
    }
    return 0;
}` },
        { t: `p`, text: `本机 g++ -std=c++23 实跑，九行输出一行不差：刚创建时容量 0、元素 0；放入 10 后容量 1；放入 20 后容量 2；放入 30 后容量 4、元素 3；放入 40 后容量 4；放入 50 后容量 8、元素 5；放入 60、70、80 容量都停在 8。` },
        { t: `p`, text: `看容量那一列怎么跳：只在放入第 1、2、3、5 件之后跳，0→1→2→4→8，每次翻倍；其余时候只涨元素、容量纹丝不动。注意放入 30 那一行——元素才 3 个，容量已经 4，两个数从这一行起正式分家。分家之后，size 回答「装到哪了」，capacity 回答「还能白放几件」。` },
        { t: `p`, text: `这里补一个读输出的习惯：先看「哪一列变了」。这九行里元素列 1 到 8 一步一步走，容量列只在四个位置跳——先把「变与不变」分开，再问「为什么偏偏这时候变」，数就读出了机制。这套读法以后看任何程序的输出都用得上。` },
        { t: `h2`, text: `演示 2 · 亲眼看见搬家：地址会换` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>

int main() {
    std::vector<int> w;
    for (int i = 1; i <= 9; ++i) {
        w.push_back(i);
        std::println("元素 {} 个，容量 {}，盒子在 {}",
                     w.size(), w.capacity(), static_cast<const void*>(w.data()));
    }
}` },
        { t: `p`, text: `capacity 跳台阶只是间接证据，更硬的证据是地址。盒子的位置由 v.data() 给出——data 就是「盒头在哪」的意思，第 74 课指针的老熟人。本机实跑，地址在元素 1、2、3、5、9 个之后各换了新，恰好对上容量 0→1、1→2、2→4、4→8、8→16 这五次搬家。` },
        { t: `p`, text: `地址一换意味着什么？旧盒整块归还，里面的旧物一件不落全搬进新盒。而两次搬家之间，地址纹丝不动，push_back 只是把数写进下一个空格——这就是为什么平时放东西几乎不要钱，撞台阶那一下才掏一次「搬运费」。` },
        { t: `p`, text: `多出来的空格算谁的内存？算 vector 的。地皮一次整块买下，空格也在它的管理里，你只管 size 以内的格子。这份「多管一点地皮」的余量，正是它敢承诺 push_back 平时几乎不要钱的底气——地皮宽了，搬家的次数才稀疏。` },
        { t: `h2`, text: `演示 3 · 满了才搬，初始化不多占` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>

int main() {
    std::vector<int> v = {10, 20, 30, 40, 50, 60, 70, 80};
    std::println("装 8 件: 容量 {}，元素 {}", v.capacity(), v.size());
    v.push_back(90);                     // 第 9 件挤不下，又搬一次家
    std::println("再放入 90: 容量 {}，元素 {}", v.capacity(), v.size());
}` },
        { t: `p`, text: `本机输出两行：装 8 件时容量正好 8，一格不多；再放入 90，容量一步跳到 16。两个细节值得记：一是初始化列表给几件就开几格，不会手松多占；二是搬家精确发生在「这一件放不下」的瞬间，之前每一件都是白放。至于拿走东西会不会还格子——不会，容量只涨不缩，本课先记结论，以后讲到 erase 时你还会再见到它。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `拿 capacity 当循环上界。for (int i = 0; i < v.capacity(); ++i) 会把还没放东西的空格也读一遍，读到的是内存里的残值；循环上界永远用 v.size()。`,
          `以为容量够就能用下标乱写。size 是 5、capacity 是 8 的 vector，写 v[5] = 99 一样是越界——capacity 是地皮，size 是登记了几户，没登记的格子不能住人。放东西请走 push_back。`,
          `以为 push_back 每次花一样的时间。平时只写一格，撞上台阶那一下要整盒搬家、几件旧物全过手；数据量大时这笔账必须算，往后手写搬家的课专门算它。`,
          `记成「每放一件涨一格」。本机实测台阶是 0→1→2→4→8→16→32，跳的时机在放入第 1、2、3、5、9、17 件之后，翻倍跳。`,
          `以为搬家之后旧地址还能用。搬家瞬间旧盒整块归还，之前从 data 拿到的地址全部作废，再拿来用就是悬空指针——第 74 课的指针到这里多了一条新规矩：vector 一搬家，旧地址一律作废。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `观察容量什么时候跳、一次跳几格（照源稿把演示 1 跑一遍，把台阶记成表）。`,
          `把循环上限从 8 改到 17，核对台阶是不是落在放入第 1、2、3、5、9、17 件之后，最高是否跳到 32。`,
          `照演示 2 打印 v.data()，亲手确认地址只在搬家的那几轮换新，其余轮次原封不动。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：size 是放了几件，capacity 是有几格；格子满了才搬家，一搬就是翻倍，地址整块换新。` }
      ]
    },
    {
      id: `m180`, title: `第 180 课 · 手写一次扩容搬家`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：亲手搬一次家——满了就买 2 倍大的新盒、把旧东西一件件搬过去、扔掉旧盒；vector 每次扩容干的就是这三步。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 179 课看见了台阶，这一课亲手搬一次家。搬家的家伙什是智能指针（第 78 课）：std::make_unique<int[]>(n) 在自由存储上开一个 n 格的 int 盒子，交给 unique_ptr 打理；盒子换手用 std::move，一过户旧盒自动回收——你从头到尾没写过一句 delete。` },
        { t: `p`, text: `unique_ptr<int[]> 这种「数组版」智能指针还有个顺手的能耐：直接拿它当下标用，box[0]、box[1] 的写法和普通数组一模一样——格子里的读写它全放行，它只管「这盒归谁、什么时候还」。但下标越界它可不拦，迷你仓库的规矩是你自管进出，这也是第 179 课「size 以内才是你的地界」的另一面。` },
        { t: `p`, text: `先认清三个角色：box 手里的旧盒，2 格，装满；bigger 手里的新盒，4 格，空的；std::move 这个「过户章」。搬家的动作全是你自己写的朴素代码——一个 for 循环把旧物一件件抄进新格，一行赋值完成过户。vector 内部每次扩容干的同样是这三步，只是它替你写了。` },
        { t: `p`, text: `还有一个「为什么非要整盒搬」的问题。vector 的格子讲究连成一片，旧盒屁股后面住着谁，它说了不算，没法就地长出一格；要连续，就只能整片地皮一起换。记住这条，往后「中间插队要全员挪动」的根因也在这里——连续既是好处，也是牵绊。` },
        { t: `svg`, caption: `手写一次搬家：开新盒、搬旧件、move 过户，旧盒当场自动回收`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240">
  <g font-size="13" fill="#142639">
    <text x="24" y="24" font-weight="700">搬家三步：开新盒 → 搬旧件 → move 过户</text>
  </g>
  <g font-size="12" text-anchor="middle">
    <text x="130" y="52" fill="#00599c" font-weight="700">旧盒 2 格 · 装满</text>
    <text x="500" y="52" fill="#1a7f42" font-weight="700">新盒 4 格 · make_unique 买来的</text>
  </g>
  <g font-size="13" text-anchor="middle">
    <rect x="70" y="64" width="60" height="44" fill="#eaf3fb" stroke="#00599c"/><text x="100" y="92">10</text>
    <rect x="130" y="64" width="60" height="44" fill="#eaf3fb" stroke="#00599c"/><text x="160" y="92">20</text>
    <rect x="380" y="64" width="60" height="44" fill="#eefaf0" stroke="#1a7f42"/><text x="410" y="92">10</text>
    <rect x="440" y="64" width="60" height="44" fill="#eefaf0" stroke="#1a7f42"/><text x="470" y="92">20</text>
    <rect x="500" y="64" width="60" height="44" fill="#fffdf5" stroke="#b8722b" stroke-dasharray="5 4"/><text x="530" y="92" fill="#b8722b" font-size="12">空</text>
    <rect x="560" y="64" width="60" height="44" fill="#fffdf5" stroke="#b8722b" stroke-dasharray="5 4"/><text x="590" y="92" fill="#b8722b" font-size="12">空</text>
  </g>
  <g>
    <line x1="200" y1="86" x2="366" y2="86" stroke="#b8722b" stroke-width="2"/>
    <polygon points="366,80 378,86 366,92" fill="#b8722b"/>
    <text x="283" y="78" font-size="12" fill="#b8722b" text-anchor="middle">for 循环一件件搬</text>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="24" y="140">第一步：make_unique 买 4 格新盒　第二步：for 循环把 2 件旧物抄过去　第三步：move 过户</text>
    <text x="24" y="166">过户那一刻旧盒当场回收——没人写过 delete，unique_ptr 自己办；空格腾出来放 30、40</text>
    <text x="24" y="192">过户后 bigger 两手空空：盒子主人全世界只剩 box 一个，这是智能指针「唯一主人」的规矩</text>
    <text x="24" y="220" font-weight="700" fill="#1a7f42">vector 扩容就是这三步的全自动版：满了 → 开 2 倍新盒 → 搬 → 过户</text>
  </g>
</svg>` },
        { t: `h2`, text: `怎么做` },
        { t: `p`, text: `把口诀写下来就是四步：一开，用 make_unique 买一个 2 倍大的空新盒；二搬，一个 for 循环把旧物一件件抄进新盒；三过户，box = std::move(bigger)，新盒归 box，旧盒当场自动回收；四住人，往腾出来的新格放新东西。下一课会把「一开」「二搬」这两步封进 push，让搬家从此自动发生。` },
        { t: `p`, text: `盒子为什么开在自由存储上？普通数组出生在哪就钉在哪，一辈子搬不了家；自由存储上的盒子才拿得到地址、能过户、能归还。vector 的仓库全部开在自由存储上，就是为了随时能搬——入门课第 73 到 77 课那套内存与指针的规矩，到这里派上大用场。` },
        { t: `h2`, text: `演示 1 · 照源稿搬一次家` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <memory>
#include <utility>

int main() {
    auto box = std::make_unique<int[]>(2);           // 旧盒：2 格，装满了
    box[0] = 10; box[1] = 20;
    std::println("旧盒: {} {}", box[0], box[1]);
    auto bigger = std::make_unique<int[]>(4);        // 买个 4 格新盒
    for (int i = 0; i < 2; ++i) bigger[i] = box[i];  // 旧东西一件件搬过去
    box = std::move(bigger);                         // 扔旧盒换新盒（自动回收）
    box[2] = 30; box[3] = 40;                        // 新格子空出来了
    std::println("新盒: {} {} {} {}", box[0], box[1], box[2], box[3]);
}` },
        { t: `p`, text: `本机实跑两行输出：「旧盒: 10 20」「新盒: 10 20 30 40」。对着代码看：搬了 2 件，所以新盒前 2 格是旧物，后 2 格才放得进 30、40。过户之后 box[0] 照常能用——新盒确实姓了 box。` },
        { t: `p`, text: `注释里那句「自动回收」不是客套：旧盒是自由存储上的内存，换手那一刻由 unique_ptr 顺手归还，没有 delete、没有泄漏。vector 每次扩容就是这一套，只是「买几格、怎么搬」这些讲究它已经替你调好了。` },
        { t: `p`, text: `把这段代码和第 179 课演示 2 的地址观察对上，会发现它们在干同一件事：vector 自动做的「开新盒、搬旧件、扔旧盒」，拆开来就是这三行朴素代码。区别只在谁做、多久做一次——它每放一件都查一次账，你今天只是手动搬了一趟。` },
        { t: `h2`, text: `演示 2 · 搬更大的家：4 格搬去 8 格` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <memory>
#include <utility>

int main() {
    auto box = std::make_unique<int[]>(4);           // 旧盒：4 格，装满
    for (int i = 0; i < 4; ++i) box[i] = (i + 1) * 10;
    auto bigger = std::make_unique<int[]>(8);        // 新盒翻倍：8 格
    for (int i = 0; i < 4; ++i) bigger[i] = box[i];  // 搬 4 件
    box = std::move(bigger);
    for (int i = 4; i < 8; ++i) box[i] = (i + 1) * 10;
    for (int i = 0; i < 8; ++i) std::print("{} ", box[i]);
    std::println("");
}` },
        { t: `p`, text: `本机输出一行：10 20 30 40 50 60 70 80。旧盒 4 件一件不少地落到新盒前 4 格，后 4 格放进 50 到 80。注意搬家件数跟着旧盒装了多少走——旧盒越满搬家越贵；翻倍策略的好处是「搬一次贵点，但搬的次数省」，这笔总账下一课算。` },
        { t: `h2`, text: `演示 3 · 过户之后，旧主人手里有什么` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <memory>
#include <utility>

int main() {
    auto box = std::make_unique<int[]>(2);
    auto bigger = std::make_unique<int[]>(4);
    box = std::move(bigger);
    std::println("bigger 手里还有盒子吗: {}", bigger == nullptr);
}` },
        { t: `p`, text: `本机输出：「bigger 手里还有盒子吗: true」。过户不是复印——盒子和里面的东西全世界只有一份，move 之后 bigger 变成 nullptr，一个不指任何盒子的空手。这也是为什么 unique_ptr 不许直接拷贝赋值：真复印出第二个主人，同一块内存就会被归还两次，程序就乱了。` },
        { t: `p`, text: `顺着这条规矩想：过户之后旧名字 bigger 别再拿去下标，bigger[0] 是在空手上取值，当场崩。搬家代码里所有旧引用都要当作已经作废——和第 179 课 data 的旧地址一条规矩。` },
        { t: `p`, text: `nullptr 是什么长相？一个「保证不指任何地方」的空值。拿它比一比，就能问出 bigger 手里还有没有盒子，本机输出 true。往后用任何指针之前先问一句空不空，这个动作你会重复几百遍，从这一课起养成习惯。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `忘写 std::move，直接 box = bigger。本机 g++ 报错第一行是 use of deleted function——unique_ptr 的拷贝赋值被删掉了，编译器明说「不许复印」。过户必须走 move。`,
          `新盒格数写错。写成和旧盒一样大，搬完立刻又满，等于白搬一趟；本课固定翻倍，下一课会算「每次只加 1 格」有多亏。`,
          `搬完忘放新件。新盒腾出格子不等于东西住进去了，box[2]、box[3] 那两行漏掉，新件悄悄失踪；件数的账也要自己加一。`,
          `过户后还去用 bigger。它是 nullptr，bigger[0] 当场崩；过户那一刻起旧名字一律作废。`,
          `想用裸 new 和 delete 自己开盒还内存。漏一句 delete 就是泄漏；unique_ptr 过户即回收，「扔盒子」这个动作永远不会忘。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把新盒改成 8 格、旧盒装满 4 格，自己再搬一次更大的家（照演示 2 的样子跑通，输出应是 10 到 80 八个数）。`,
          `照演示 3 打印过户后 bigger == nullptr，亲眼看一次「旧主人两手空空」。`,
          `把 std::move 删掉再编译一次，把 use of deleted function 那行报错抄下来——这是 unique_ptr 在拦你复印盒子。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：扩容三步——开 2 倍新盒、一件件搬、move 过户；旧盒自动回收，旧主人两手空空。` }
      ]
    },
    {
      id: `m181`, title: `第 181 课 · 手写迷你 vector`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把「满了就换 2 倍新盒」封进 push——十几行写出 vector 的骨架，再用搬运计数器算清扩容这笔账。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 180 课搬的是一次家，vector 要的是「每次满了都自动搬」。做法朴素：把搬家三步封进一个叫 push 的成员函数，再给盒子配三本账——d 记盒子在哪（unique_ptr<int[]>），n 记放了几件，cap 记有几格；外加一本流水账 moves，记扩容至今一共搬运过多少件。有了它，第 179 课那个台阶就能换算成成本了。` },
        { t: `p`, text: `push 里站着两条路：没满直接放，满了先搬家再放。这一课你顺带第一次看清「类」的雏形——数据和操作装进同一个 struct，写 MiniVec v; 就有一只空盒，v.push(30) 就放一件。真 vector 就是这个骨架，再披上越界检查、拷贝支持那一身安全装备。` },
        { t: `p`, text: `struct 里写函数和写普通函数差不多，只是它把家安在账本旁边：push 里用的 d、n、cap、moves，都是这只盒自己的账。调用写成 v.push(30)，v 是哪只盒，函数里看到的就是哪本账——两只 MiniVec 各记各的账，互不串门。` },
        { t: `svg`, caption: `push 的两条路：放得下就白放，放不下先搬一次家，最后都把新件放进 d[n]`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240">
  <g font-size="13" fill="#142639">
    <text x="24" y="24" font-weight="700">push 两条路：放得下就白放，放不下先搬家再放</text>
  </g>
  <rect x="250" y="38" width="140" height="32" fill="#eaf3fb" stroke="#00599c"/>
  <text x="320" y="59" font-size="13" text-anchor="middle">新件 v 到站</text>
  <rect x="238" y="94" width="164" height="32" fill="#fffdf5" stroke="#b8722b"/>
  <text x="320" y="115" font-size="13" text-anchor="middle">n 小于 cap 吗？</text>
  <line x1="320" y1="70" x2="320" y2="94" stroke="#33465e" stroke-width="1.5"/>
  <polygon points="315,88 320,94 325,88" fill="#33465e"/>
  <line x1="238" y1="110" x2="156" y2="110" stroke="#1a7f42" stroke-width="1.5"/>
  <rect x="24" y="94" width="132" height="32" fill="#eefaf0" stroke="#1a7f42"/>
  <text x="90" y="115" font-size="12" text-anchor="middle">没满：直接放</text>
  <line x1="402" y1="110" x2="466" y2="110" stroke="#b8722b" stroke-width="1.5"/>
  <rect x="466" y="94" width="150" height="32" fill="#fdeee4" stroke="#b8722b"/>
  <text x="541" y="115" font-size="12" text-anchor="middle">满了：先搬一次家</text>
  <g font-size="12" fill="#33465e">
    <text x="24" y="162">搬家的四拍：造 2 倍新盒 → 旧件一件件搬 → moves 加 n 记账 → move 换手、cap 翻倍</text>
    <text x="24" y="188">cap 从 0 起步时翻倍还是 0，所以开头用三元表达式给起步格数 2</text>
    <text x="24" y="216" font-weight="700" fill="#1a7f42">两条路最后都落到同一句：把新件放进 d[n]、n 加一——搬家分支漏了它就丢件</text>
  </g>
</svg>` },
        { t: `h2`, text: `怎么做` },
        { t: `p`, text: `push 的两条路写成代码只有几行。没满那条路一行就够：d[n++] = v，放进去、账加一。满了那条路四拍：造 2 倍新盒、旧件一件件搬、moves += n 记账、move 换手加 cap 翻倍。记账两处别漏——moves 记的是「这次搬了几件」不是「搬了几次」；cap 的翻倍要写 cap ? cap * 2 : 2，因为 0 的 2 倍还是 0，没有三元表达式兜底，第一格永远开不出来。` },
        { t: `h2`, text: `演示 1 · 骨架：struct MiniVec` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <memory>
#include <utility>
struct MiniVec {
    std::unique_ptr<int[]> d;
    int n = 0, cap = 0, moves = 0;
    void push(int v) {
        if (n < cap) { d[n++] = v; return; }                // 没满：直接放
        auto nd = std::make_unique<int[]>(cap ? cap * 2 : 2); // 满了：造 2 倍新盒
        for (int i = 0; i < n; ++i) nd[i] = d[i];           // 旧东西一件件搬
        moves += n; d = std::move(nd); cap = cap ? cap * 2 : 2; // 记账、换手
        d[n++] = v;                                         // 别忘了新来的这件
    }
};` },
        { t: `p`, text: `十来行就是 vector 的骨架：三本账 d、n、cap，一本流水账 moves，加一个 push。struct 把数据和操作装在同一个名字下——MiniVec v; 造出一只空盒，v.push(30) 放一件。真 vector 比这长得多，多出来的全是安全措施：越界检查、拷贝怎么办、搬家时用更快的搬运方式；骨架却一直是这十几行。` },
        { t: `p`, text: `把演示 2 的输出倒着推，也能推出骨架的对错：容量 8，说明最后一次搬家开的是 8 格，倒推回去就是 2、4、8，正好是「翻倍」；搬运 6 件，说明前两次搬家分别过了 2 件和 4 件，正好是搬家那刻盒里的存货。会倒着对账，看别人的代码也是透明的。` },
        { t: `h2`, text: `演示 2 · 跑起来：连放 6 件` },
        { t: `code`, lang: `c++`, code: `MiniVec v;                                     // 刚出生：n、cap、moves 全是 0
for (int i = 1; i <= 6; ++i) v.push(i * 10);   // 连放 6 件：10 到 60
std::println("装了 {} 个，容量 {} 格，扩容累计搬运 {} 次", v.n, v.cap, v.moves);` },
        { t: `p`, text: `本机输出：装了 6 个，容量 8 格，扩容累计搬运 6 次。对账：第 1 件到站时 cap 是 0，先搬家 0→2、搬 0 件；第 3 件时 2→4、搬 2 件；第 5 件时 4→8、搬 4 件。累计 0 加 2 加 4 等于 6，和 moves 一分不差；容量 8 正好是第 179 课数过的那个台阶。` },
        { t: `p`, text: `三本账的分工再念一遍：n 是「装到第几格」，cap 是「一共几格」，moves 是「搬家时一共过了几手」。moves 这个数 vector 不肯给你，但它正是台阶背后藏着的真实成本——下一场演示就把它当钱算。` },
        { t: `p`, text: `起步格数取 2 不取 1，是给「没满直接放」那条路留活路：cap 从 1 起步的话，第一件到站也得先搬一次家。本机实测起步 1 装 100 件总共搬 127 件，比起步 2 只多 1 件——起步值是小事，翻倍节奏才是大事，这条账演示 3 已经算过。` },
        { t: `h2`, text: `演示 3 · 把 6 换成 100，再让「每次只加 1 格」同台` },
        { t: `code`, lang: `c++`, code: `// 坏版本：把造新盒那行改成每次只多买 1 格，其余照旧
auto nd = std::make_unique<int[]>(cap + 1);
moves += n; d = std::move(nd); cap = cap + 1;` },
        { t: `code`, lang: `text`, code: `本机实测（各装 100 件）：
  2 倍扩容：搬家 7 次，累计搬运 126 件，最后容量 128 格
  每次 +1 格：搬家 100 次，累计搬运 4950 件，最后容量 100 格
  倍数：4950 ÷ 126 ≈ 39.3 —— 同样装 100 件，坏版本多搬约 39 倍` },
        { t: `p`, text: `任务里让你猜的「差多少倍」就有答案了：论累计搬运件数是 4950 对 126，约 39 倍；论搬家次数是 100 对 7，约 14 倍——两条算法打架，坏版本输得干脆。6 件的小账也量了：2 倍搬 6 件，+1 策略搬 15 件，件数少时无所谓，量一大差距爆炸。翻倍的直觉就立在这：搬家次数按对数涨，总搬运量停在货物自身的一两倍附近——126 正好是 100 件的约 1.26 倍，而 4950 是它的 49.5 倍。` },
        { t: `p`, text: `翻倍为什么能省成这样？换个角度看：每次搬家件数翻倍，搬家次数就只按对数涨。装 100 件只搬 7 次家、过手 126 件；就算装到一百万件，也才二十来次搬家。而每次只加 1 格，搬家次数和件数一样多。同一个问题，节奏选对，成本差出几十倍——往后讲算法成本时说的「均摊」，说的就是这笔账。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `搬完家直接 return，新件没放。满了的分支搬完家必须落到 d[n++] = v；漏了它，第 100 件悄悄失踪，n 停在 99，n 和 moves 的账立刻对不上。`,
          `cap 为 0 时忘了起步值。cap * 2 在 cap 是 0 时还是 0，新盒 0 格，第一件永远放不进去；开头必须写 cap ? cap * 2 : 2 兜底。本机实测起步格数改成 1 装 100 件搬 127 件——起步值影响不大，但没有它一步都走不动。`,
          `把 moves += n 写成 moves += 1。搬家次数和搬运件数是两个口径，本课实测 100 件是 7 次搬家、126 件搬运，记错口径，第 179 课的成本模型就白搭了。`,
          `d = std::move(nd) 写成 d = nd。unique_ptr 不许复印，本机报 use of deleted function——第 180 课见过的那个报错又来了。`,
          `把迷你版当成品用。它没有越界检查、没有拷贝支持，d 还裸露在外谁都能改；真 vector 多出来的代码都是护着你的，别跳过安全措施直接抄这个骨架进项目。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把 6 换成 100 再跑：猜猜「每次只扩 1 格」的话，搬运次数会差多少倍？（本机答案见演示 3：累计搬运 4950 对 126，约 39 倍）`,
          `给 MiniVec 加一个 print 成员函数，把 d[0] 到 d[n-1] 打成一行，验证搬了几次家顺序都没乱。`,
          `把起步格数从 2 改成 1 再装 100 件，看总搬运量变成多少（本机实测 127 件，只差 1 件——起步值不背大锅，翻倍节奏才是关键）。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：d/n/cap 三本账加 push 两条路；2 倍扩容装 100 件只搬 126 件，每次只加 1 格要搬 4950 件。` }
      ]
    },
    {
      id: `m182`, title: `第 182 课 · 中间插队为什么要挪人`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：看懂连续内存的另一面——中间插一个人，右边全员右挪一格；走一个人，右边全员左挪补位。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `前三课都在往尾后放东西，那条路 vector 走得又快又省。可有时候东西要往中间塞：电影院一排连座，中间硬挤进来一个人，他右边所有人都得右挪一格；走一个人，右边又得左挪补位。vector 的格子挨着格子连成一片，中间插删付的就是这个价。` },
        { t: `p`, text: `两个成员函数登场。v.insert(v.begin() + k, x) 把 x 放到第 k 号位，原来第 k 号及之后的全体右移一格；v.erase(v.begin() + k) 让第 k 号走人，右边全体左移补位。begin() 就是「0 号位」这把尺子（第 82 课讲过 begin 与 end 那对），begin() + k 就是第 k 号位。挪动件数有公式：插在 k 号位，右边还有 size 减 k 件，就得挪 size 减 k 件。` },
        { t: `p`, text: `再掰一层：内存里没有「缝隙」可塞。两个数中间不存在半个空格子，新来的想站进来，只能让后面的人集体让路。就算容量还剩着空格，那几格也远在队伍末尾，救不了中间的急——所以中间插入挪人的账，几乎每次都逃不掉。` },
        { t: `svg`, caption: `中间插队：999 插进 1 号位，右边 4 件全体右挪一格，插队后队伍从 5 件变 6 件`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240">
  <g font-size="13" fill="#142639">
    <text x="24" y="24" font-weight="700">中间插队：999 插进 1 号位，右边 4 件全体右挪一格</text>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="24" y="80">插队前</text>
  </g>
  <g font-size="13" text-anchor="middle">
    <rect x="80" y="58" width="70" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="115" y="84">10</text>
    <rect x="150" y="58" width="70" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="185" y="84">20</text>
    <rect x="220" y="58" width="70" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="255" y="84">30</text>
    <rect x="290" y="58" width="70" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="325" y="84">40</text>
    <rect x="360" y="58" width="70" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="395" y="84">50</text>
    <rect x="440" y="58" width="70" height="40" fill="#fffdf5" stroke="#b8722b" stroke-dasharray="5 4"/><text x="475" y="84" fill="#b8722b">999</text>
    <text x="475" y="118" font-size="12" fill="#b8722b">999 要插进 1 号位</text>
  </g>
  <g stroke="#b8722b" stroke-width="1.5" fill="none">
    <line x1="185" y1="102" x2="251" y2="148"/>
    <line x1="255" y1="102" x2="321" y2="148"/>
    <line x1="325" y1="102" x2="391" y2="148"/>
    <line x1="395" y1="102" x2="461" y2="148"/>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="24" y="178">插队后</text>
  </g>
  <g font-size="13" text-anchor="middle">
    <rect x="80" y="156" width="70" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="115" y="182">10</text>
    <rect x="150" y="156" width="70" height="40" fill="#fdeee4" stroke="#b8722b"/><text x="185" y="182">999</text>
    <rect x="220" y="156" width="70" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="255" y="182">20</text>
    <rect x="290" y="156" width="70" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="325" y="182">30</text>
    <rect x="360" y="156" width="70" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="395" y="182">40</text>
    <rect x="430" y="156" width="70" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="465" y="182">50</text>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="24" y="216">实测账本：插在 0 号位挪 5 件、1 号位挪 4 件、2 号位挪 3 件……尾后插 0 件</text>
    <text x="24" y="236" font-weight="700" fill="#1a7f42">插在 k 号位就挪 size 减 k 件；erase 反向同理，右边全体左挪补位</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `把账本摆开就懂它的设计取舍了：尾后插入挪 0 件——这就是 push_back 是 vector 看家本领的原因，前三课省的都是这条 0 件的路。中间插删恰恰相反，插得越靠前惊动的人越多，插在最开头连 0 号位的老住户都得全体起立。好处与代价同源：格子连成一片，报个号下标一步直达；连座的另一面，就是插队必须全员配合。哪天数据量大到频繁往中间插删，就该换别的容器帮忙了——以后再讲。` },
        { t: `p`, text: `erase 还附带一条容易忽略的规矩：它让位置集体失真。原来看着第 5 号的，删掉前面一件后就变第 4 号。所以别拿着一串下标从前往后删——边删边挪，号码全在变；要删一批，倒着删或者每删一次重算一遍，往后有课专门练这个。` },
        { t: `h2`, text: `演示 1 · 插队再撤队，全员挪两趟` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>

int main() {
    std::vector<int> v = {10, 20, 30, 40, 50};
    v.insert(v.begin() + 1, 999);              // 在 10 和 20 之间硬塞一个
    for (int x : v) std::print("{} ", x);
    std::println("← 后面 4 个全被右挪");

    v.erase(v.begin() + 1);                     // 撤走 999，大家又左挪补位
    for (int x : v) std::print("{} ", x);
    std::println("← 又全挪了回来");
}` },
        { t: `p`, text: `本机输出两行：「10 999 20 30 40 50 ← 后面 4 个全被右挪」和「10 20 30 40 50 ← 又全挪了回来」。插在 1 号位，右边原有 4 件 20、30、40、50 全员右挪；erase 又让他们左挪回来。搬来搬去 999 连痕迹都不留，可两趟全员挪动的成本已经付过了。` },
        { t: `p`, text: `顺带看一眼格子：插入后 size 是 6、容量是 10——这一插还挤爆了原有 5 格的家，第 179 课的搬家在背后出了一次力；erase 之后 size 回到 5，容量还是 10。人走了座位不还，「容量只涨不缩」在本机实测作准。` },
        { t: `p`, text: `把 insert 和 erase 连着跑还有一笔隐藏账：两趟全员挪动之间夹着一次搬家——容量从 5 涨到 10。也就是说中间插入的真实成本常常是「搬家费加挪人费」两笔；任务里让你打印 capacity，抓的就是这笔隐藏账。` },
        { t: `h2`, text: `演示 2 · 插进最前排，全员无一幸免` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>

int main() {
    std::vector<int> v = {10, 20, 30, 40, 50};
    v.insert(v.begin(), 999);          // 插进 0 号位：原来 5 件一个都躲不掉
    for (int x : v) std::print("{} ", x);
    std::println("← 5 件全被右挪");
}` },
        { t: `p`, text: `本机输出：「999 10 20 30 40 50 ← 5 件全被右挪」。这就是任务要的答案：插在最开头，原来 5 件无一幸免，每件右挪一格——没有谁比谁少挪，全员 5 件共 5 次挪动。对比演示 1 插在 1 号位只惊动 4 件：插得越靠前，账单越长。` },
        { t: `p`, text: `顺嘴把「谁挪得最多」答完：插在最开头时没有「最多」——5 件人人一格，公平得很；真要论委屈，0 号位的老住户最冤，明明不走也得搬家。全员平摊正是最坏情况的标志：插得越靠前越接近全员，尾后插则一件不惊动。` },
        { t: `h2`, text: `演示 3 · 插在几号位就挪几件，本机实测账本` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>

int main() {
    std::vector<int> u = {10, 20, 30, 40, 50};
    u.insert(u.begin() + 4, 999);      // 插在 4 号位：只有 50 要右挪
    for (int x : u) std::print("{} ", x);
    std::println("");
}` },
        { t: `code`, lang: `text`, code: `本机实测：5 个座位，999 插进不同号位，为腾格子右挪的件数
  0 号位 → 5 件    1 号位 → 4 件    2 号位 → 3 件
  3 号位 → 2 件    4 号位 → 1 件    尾后   → 0 件
删 0 号位：右边 4 件全体左挪补位（实测）` },
        { t: `p`, text: `上面那行程序实测输出「10 20 30 40 999 50」——插在 4 号位只惊动 50 一件，对上账本里的 1 件。账本数是用带计数器的座位（拷贝一次记一件）量出来的，与公式「挪 size 减 k 件」严丝合缝。一句话收尾：尾后插人一件都不用挪，往头上插是全员买单——这就是为什么 vector 的看家本领是 push_back。` },
        { t: `p`, text: `反过来想这件事：假如每件东西各坐各的、座位散在内存各处，插队只登记新座位、谁都不用挪，代价是报号找人得挨个去问。省挪动还是省查找，是两种容器永恒的取舍——vector 选了「省查找」，这一课付的就是它省下的那部分；往后会见到另一种选择的容器，到时再比。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `插入位置越过 size。v.begin() + k 里的 k 合法范围是 0 到 size：k 等于 size 是尾后追加，k 比 size 大就是插到不存在的座位，未定义行为。`,
          `erase 之后还按旧号码找人。删掉一件，右边全体左移，原来第 3 号的现在第 2 号；按旧号码找会拿错人，删完记得重算下标。`,
          `以为 erase 会把容量一起缩回去。本机实测 erase 后 size 回到 5、容量照旧 10——人走了座位不还，capacity 只涨不缩。`,
          `以为中间插入只动「插进去那一件」。挪的是他右边所有人；5 件时看着不多，50000 件里反复往头上插，每插一次惊动五万件，活儿直接平方化。`,
          `忘了 insert 的第一个参数是位置不是值。v.insert(999) 编译不过：位置要用 begin() 或 begin() + k 来报，报号用的正是第 82 课 begin 与 end 那套尺子。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `在最开头 insert 一个数，谁挪动的格子最多？（源稿任务；本机实测：5 件全员各挪一格，无人幸免）`,
          `把插入位置从 begin() 改到 begin() + 4，数一数只有几件要挪（本机实测：只有 50 一件，输出 10 20 30 40 999 50）。`,
          `erase 之后打印 size 和 capacity，看看座位还不还（本机实测：size 5，容量 10，不还）。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：插在几号位就挪几件，尾部插入零挪动；中间插删是连续内存要付的过路费。` }
      ]
    }
  ]
};
