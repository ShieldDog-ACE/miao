/* 喵站 · C++ 掌握 正文分部 p32：第 183–186 课（链表篇收尾四课）
 *
 * 源稿：学习资料/C++入门/183_链表是什么.cpp、184_链表插队只改纸条.cpp、
 *       185_反转整条链.cpp、186_vector和list谁更快.cpp
 * 款式与规矩同 cpp-写稿规矩.md：六栏课式、反引号里不出现反引号、交叉引用只往回指、
 * 每个数字与输出都本机 g++ -std=c++23 实跑过。
 */
window.MIAO_CPPM_P32 = {
  chapters: [
    {
      id: `m183`, title: `第 183 课 · 链表是什么`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：造出第一个链表 —— 每个节点装一个宝藏和一张「下一站在哪」的纸条，再顺着纸条从头走到尾。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `到这一课为止，你手里的容器 —— 数组、vector —— 都有一个共同点：元素在内存里一格挨一格排成一排，像个坐得整整齐齐的教室。排队有排队的好：第 180、181 课你亲手写过它的扩容搬家，下标一算就能直达任何人。但第 182 课也让你亲眼见过它的死穴 —— 队伍中间插一个人，后面全员都得往后挪一格，人越多越慢。` },
        { t: `p`, text: `链表把组织方式整个换掉：像一场寻宝游戏，宝藏不摆在一间屋里，而是散落在内存的各个角落。每个节点只装两样东西 —— 宝藏本身，和一张写着「下一站在哪」的纸条。宝藏散哪都没关系，只要纸条能一张张串下去，从头出发就能一个不漏地摸遍全部。` },
        { t: `ul`, items: [
          `**节点 Node**：value（宝藏）+ next（下一站的地址），两样缺一不可；`,
          `**头**：进入整条链的唯一入口，本课的 a 就是最头上的节点 —— 弄丢头，后面全够不着；`,
          `**尽头**：最后一站的纸条是空的，写成 null。顺着纸条走，纸条一空白就到头。`
        ]},
        { t: `svg`, caption: `三个节点散在堆上，靠 next 纸条串成一条线；纸条空白即尽头`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 210">
  <g font-size="13" fill="#142639"><text x="24" y="26" font-weight="700">一条三个节点的链：蓝格子装宝藏，黄格子装纸条</text></g>
  <g font-size="13" text-anchor="middle">
    <rect x="50" y="56" width="76" height="44" fill="#eaf3fb" stroke="#00599c"/><text x="88" y="84">10</text>
    <rect x="126" y="56" width="76" height="44" fill="#fffdf5" stroke="#b8722b"/><text x="164" y="84" fill="#b8722b">next</text>
    <rect x="240" y="56" width="76" height="44" fill="#eaf3fb" stroke="#00599c"/><text x="278" y="84">20</text>
    <rect x="316" y="56" width="76" height="44" fill="#fffdf5" stroke="#b8722b"/><text x="354" y="84" fill="#b8722b">next</text>
    <rect x="430" y="56" width="76" height="44" fill="#eaf3fb" stroke="#00599c"/><text x="468" y="84">30</text>
    <rect x="506" y="56" width="76" height="44" fill="#fffdf5" stroke="#b8722b"/><text x="544" y="84" fill="#b8722b">null</text>
  </g>
  <g stroke="#00599c" stroke-width="2">
    <line x1="202" y1="78" x2="230" y2="78"/><polygon points="230,72 240,78 230,84" fill="#00599c"/>
    <line x1="392" y1="78" x2="420" y2="78"/><polygon points="420,72 430,78 420,84" fill="#00599c"/>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="50" y="134">黄格子里写的是下一站的地址：三块内存互不相邻，全靠纸条串成 10 → 20 → 30</text>
    <text x="50" y="158">最后一站的纸条是空的，写成 null —— 走链的循环全靠它停步</text>
    <text x="50" y="184" font-weight="700" fill="#1a7f42">以后插队、反转，动的都只是黄格子；蓝格子的宝藏从头到尾原地不动</text>
  </g>
</svg>` },
        { t: `p`, text: `代价也要说清楚：想看第 100 站，数组写 nums[99] 一步直达；链表只能从第 1 站出发，一张纸条一张纸条地问过去，100 站就得问 100 次。链表把「下标直达」这张牌扔了，换来两样东西：插队不挪人（下一课的主角），以及节点爱散哪散哪。这笔交换划不划算，几课之后掐表见分晓。对了，标准库自带的链表容器 list 过几课才登场 —— 先把亲手串的这条玩明白，等它登场时你一眼就能看懂它的脾气。` },
        { t: `h2`, text: `怎么做` },
        { t: `p`, text: `先把「节点」写成 struct：一个 int 装宝藏，一个 std::unique_ptr<Node> 装纸条。这里藏着一个为什么：纸条要是装 Node 本身，节点里套节点没有尽头，编译器连它该多大都算不出来 —— 所以装的是「下一站的地址」，指针天生就只有一个地址那么大。而用 unique_ptr 这个智能指针（第 78 课请来的），它独占一块 new 出来的节点内存，出了作用域自动销毁：从造链到走链一行 delete 都不用写，也不会漏内存。` },
        { t: `code`, lang: `c++`, code: `struct Node {
    int value;                        // 宝藏
    std::unique_ptr<Node> next;       // 纸条：下一站的地址
    Node(int v) : value(v) {}         // 造节点时顺手把数放进去
};` },
        { t: `p`, text: `还有一处巧合值得点破：unique_ptr 不接节点时天生是空的 —— 空纸条。这和「最后一站」的需要严丝合缝：make_unique 造出来的节点纸条全空，链的尽头自动就有了，不用谁来填 null。语言的设计和数据的需要在这里正好咬合，写起来也就顺手：一个节点接一个节点，纸条填到哪，链就长到哪。` },
        { t: `p`, text: `造节点用 make_unique：在堆上开一块节点内存、把 10 填进 value、纸条默认空着。接链就是给纸条填地址：a->next = std::make_unique<Node>(20) 先造出 20 号节点，再把它的地址写进 a 的纸条 —— 一句话，先有人，再指路。箭头 -> 是第 74 课指针课的老朋友：p->value 顺着指针取宝藏，p->next 顺着指针取纸条。` },
        { t: `p`, text: `走链的固定句式是一个 for 循环管三件事：从哪出发 —— p = a.get()，get 把 unique_ptr 换成裸指针拿来读；什么时候停 —— p 非空才继续，纸条空白就停；怎么前进 —— p = p->next.get()，跳到下一站。这套句式值得背下来，后面两课的插队、反转全建立在它上面。` },
        { t: `h2`, text: `演示 1 · 造出一条三个节点的链` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <memory>
struct Node {
    int value;                                   // 宝藏
    std::unique_ptr<Node> next;                  // 纸条：下一站的地址
    Node(int v) : value(v) {}
};
int main() {
    auto a = std::make_unique<Node>(10);
    a->next = std::make_unique<Node>(20);          // a 的纸条指向 20
    a->next->next = std::make_unique<Node>(30);    // 20 的纸条指向 30
    for (Node* p = a.get(); p; p = p->next.get()) std::print("{} → ", p->value);
    std::println("null");                           // null 表示到头了
}` },
        { t: `p`, text: `输出一行：10 → 20 → 30 → null（本机实跑）。三行 make_unique 各开一个新节点，地址互不相邻，全靠纸条相连。for 那行值得抄三遍：三个分号段各管出发、停步、前进；每打一个数补一个「 → 」，最后 println 补 null 收尾 —— 「null 表示到头了」就这样成了输出的一部分，一眼能看出链真走到头了。` },
        { t: `h2`, text: `演示 2 · 接上第 4 站（把任务先跑通）` },
        { t: `code`, lang: `c++`, code: `// 接上一段：在建链之后、走链之前补一行
a->next->next->next = std::make_unique<Node>(40);   // 30 的纸条指向新站 40
for (Node* p = a.get(); p; p = p->next.get()) std::print("{} → ", p->value);
std::println("null");` },
        { t: `p`, text: `输出变成 10 → 20 → 30 → 40 → null（本机实跑）。注意接第 4 站要连穿三层 ->next 再接一层：层数数错就会把纸条接到队伍中间去。写链式表达式时最好同时在纸上画格子，画到哪层、写到哪层，四站画完代码也写完了。顺带看纸条分工：前三站的纸条都填过地址，只有 40 是「天生空白」的新站 —— 接链接的从来都是前一站的纸条，新节点自己一个字不用动。` },
        { t: `h2`, text: `演示 3 · 只有一个节点的链也是链` },
        { t: `code`, lang: `c++`, code: `// 接上一段：一个节点照样能走，尽头就是它自己
auto solo = std::make_unique<Node>(7);
for (Node* p = solo.get(); p; p = p->next.get()) std::print("{} → ", p->value);
std::println("null");` },
        { t: `p`, text: `输出 7 → null（本机实跑）：第一站的纸条就空白，走一步就到头。空链 —— 一个节点都没有的链 —— 该怎么表示、怎么接，等以后讲头指针的管理时再说；这一课先记住：循环条件写 p，一个节点和一百个节点用的是同一套代码，不用特判。顺手再做个对照实验：把接 40 那行少写一层，变成 a->next->next = std::make_unique<Node>(40)，输出就成了 10 → 20 → 40 → null（本机实跑）—— 30 被顶下链、随 unique_ptr 销毁，一个数就这么没了。层数错的症状和思路错的症状一样：不报错，只丢人。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `循环条件写成 p->next：走到最后一站时它的纸条是空的，循环提前结束，30 打不出来。条件写 p，判断的是「当前站存不存在」。`,
          `起步忘了 get()：写成 for (Node* p = a; ...) 类型对不上 —— unique_ptr 不会偷偷变成裸指针，编译报 no conversion。p 只负责读，起步用 a.get()。`,
          `链式层数接错：a->next->next 少写一层，等于把纸条接进队伍中间，后半截链从此没人认领，unique_ptr 一析构整段销毁。边画边写，别在脑子里数层数。`,
          `想用下标：链表没有 nums[2]，也没有「跳到第 3 站」的快捷方式，拿第 3 个就得从头走 3 步 —— 这是结构本身决定的，不是语法偷懒。`,
          `少请头文件：make_unique 与 unique_ptr 住在 <memory>，print 家族住在 <print>，少一个就报「名字找不到」。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `接上第 4 站 40，让输出变成 10 → 20 → 30 → 40 → null（照演示 2 先跑一遍）。`,
          `再造一条只有一个节点的链，确认输出是 7 → null。`,
          `把走链循环的条件故意改成 p->next 跑一遍，看看输出少了谁，想清楚为什么。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：链表 = 宝藏 + 纸条；造节点交给 make_unique，走链背熟 for (Node* p = head.get(); p; p = p->next.get())，纸条空白就是尽头。` }
      ]
    },
    {
      id: `m184`, title: `第 184 课 · 链表插队：只改纸条`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：往链表中间插一个新节点，全程不搬任何人 —— 只改两张纸条，并讲透为什么改纸条要用 std::move。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课的链能建能走了，这一课办正事：往队伍中间插一个人。第 182 课你在 vector 里干过同样的事 —— 后面全员挪格子，人多就慢。链表的答案完全另一副面孔：新节点自己造，然后只改两张纸条 —— 「30 指向我」「我指向 40」，插队完成，队伍里其他人原地不动，一张纸条都没被碰过。` },
        { t: `svg`, caption: `插队 = 造一个新节点 + 改两张纸条；队伍里其他人原地不动`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 252">
  <g font-size="12" fill="#33465e">
    <text x="24" y="66" font-weight="700">插队前</text>
    <text x="24" y="176" font-weight="700">插队后</text>
  </g>
  <g font-size="13" text-anchor="middle">
    <rect x="60" y="40" width="76" height="44" fill="#eaf3fb" stroke="#00599c"/><text x="98" y="68">30</text>
    <rect x="136" y="40" width="76" height="44" fill="#fffdf5" stroke="#b8722b"/><text x="174" y="68" fill="#b8722b">next</text>
    <rect x="300" y="40" width="76" height="44" fill="#eaf3fb" stroke="#00599c"/><text x="338" y="68">40</text>
    <rect x="376" y="40" width="76" height="44" fill="#fffdf5" stroke="#b8722b"/><text x="414" y="68" fill="#b8722b">null</text>
    <rect x="60" y="150" width="76" height="44" fill="#eaf3fb" stroke="#00599c"/><text x="98" y="178">30</text>
    <rect x="136" y="150" width="76" height="44" fill="#fffdf5" stroke="#b8722b"/><text x="174" y="178" fill="#b8722b">next</text>
    <rect x="240" y="150" width="76" height="44" fill="#eafaf0" stroke="#1a7f42"/><text x="278" y="178" fill="#1a7f42">35</text>
    <rect x="316" y="150" width="76" height="44" fill="#fffdf5" stroke="#b8722b"/><text x="354" y="178" fill="#b8722b">next</text>
    <rect x="430" y="150" width="76" height="44" fill="#eaf3fb" stroke="#00599c"/><text x="468" y="178">40</text>
    <rect x="506" y="150" width="76" height="44" fill="#fffdf5" stroke="#b8722b"/><text x="544" y="178" fill="#b8722b">null</text>
  </g>
  <g stroke="#00599c" stroke-width="2">
    <line x1="212" y1="62" x2="290" y2="62"/><polygon points="290,56 300,62 290,68" fill="#00599c"/>
    <line x1="212" y1="172" x2="230" y2="172"/><polygon points="230,166 240,172 230,178" fill="#1a7f42"/>
    <line x1="392" y1="172" x2="420" y2="172"/><polygon points="420,166 430,172 420,178" fill="#1a7f42"/>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="24" y="222">纸条一：35 的 next 改指 40 —— 先把新节点接上后一站，移交用 std::move</text>
    <text x="24" y="246" font-weight="700" fill="#1a7f42">纸条二：30 的 next 改指 35 —— 前一站再回头；40 那两格从头到尾没动过</text>
  </g>
</svg>` },
        { t: `p`, text: `但这里有个新面孔必须当场讲透：改纸条用的是 std::move，不是直接赋值。原因在 unique_ptr 的独占性格 —— 一块内存同一时刻只能有一个主人，所以它干脆禁止复印。你要是写 newbie->next = head->next，编译器当场翻脸，报 use of deleted function：那等于让两个 unique_ptr 同时管一个节点，出了作用域就要销毁两次，必炸。` },
        { t: `p`, text: `std::move 的意思是移交：head->next 把 40 的管辖权整个交给对方，移交完它自己立刻变回空纸条。移交不是复印 —— 主人换了，内存一个字节都没动，所以合法。两张纸条各移交一次，链就接上了：` },
        { t: `ul`, items: [
          `**纸条一**：newbie->next = std::move(head->next) —— 40 的管辖权从 30 手里移交给 35，此后 35 指向 40；`,
          `**纸条二**：head->next = std::move(newbie) —— 35 的管辖权移交给 30 的纸条，此后 30 指向 35；`,
          `**顺序是命门**：先接后断。先把 35 接上 40，再让 30 改指 35。反过来，head->next 被覆盖的那一瞬间 40 没人接手，就成了没人管的孤儿，unique_ptr 析构直接把它销毁 —— 内存不会漏（智能指针替你收尸），但节点凭空消失。`
        ]},
        { t: `p`, text: `再把两边的账摆在一起：vector 插队贵在「挪人」，挪多少和队伍长度成正比；链表插队贵在「找位置」，改纸条本身只有固定的小两步。本课的链只有两三站，找到前一站手到擒来；链一长，光走到插入点就得一站一站问过去 —— 这是另一笔账，几课之后接着算。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `为什么标准库把 unique_ptr 设计成「禁止复印、只能移交」？想想纸条的本质：上面写的是地址。要是允许随手复印，一张纸条复印三份，三个人都以为自己管着这个节点，节点就会被销毁三次。C++ 把这种危险从语言层面掐掉：要移交，就得写 std::move 明说「我放手了」，读代码的人一眼看出所有权换了主人 —— 比注释可靠，比口口相传可靠。这一课的插队之所以敢快，就是因为每一次纸条改动都是一次明明白白的移交。` },
        { t: `p`, text: `顺带交代头文件：std::move 住在 <utility> 里，这一课起建链代码要多请它一个。建链、走链的句式与上一课完全一样 —— 链表这门手艺的好处就是招式就那么几式，全靠组合。` },
        { t: `h2`, text: `演示 1 · 两张纸条插进一个 35` },
        { t: `code`, lang: `c++`, code: `// 接上一段：Node 沿用上一课的 struct，下面都在 main 里
auto head = std::make_unique<Node>(30);
head->next = std::make_unique<Node>(40);          // 先串好 30 → 40
auto newbie = std::make_unique<Node>(35);
newbie->next = std::move(head->next);             // 纸条一：35 指向 40
head->next = std::move(newbie);                   // 纸条二：30 改指 35
for (Node* p = head.get(); p; p = p->next.get()) std::print("{} → ", p->value);
std::println("null");` },
        { t: `p`, text: `输出 30 → 35 → 40 → null（本机实跑）。对照上一课的建链写法看门道：这次没有一行代码动过 40 那个节点本身 —— 它只是换了个主人、换了张纸条。这就是「插队不挪人」：挪的是纸条，不是人。vector 里同样的事，是第 182 课那场全员挪动。还有个细节值得盯：纸条一执行完，head->next 已经空了 —— 40 的管辖权在新主人 35 手里。要是对着旧印象再动一次 head->next，接上去的就不是 40 而是 35 自己，链立刻乱套。每行移交之后，脑子里都要刷新一次「现在谁管谁」。` },
        { t: `h2`, text: `演示 2 · 再插一个 37（源稿任务先跑通）` },
        { t: `code`, lang: `c++`, code: `// 接上一段：链现在是 30 → 35 → 40，要在 35 和 40 之间插 37
auto again = std::make_unique<Node>(37);
again->next = std::move(head->next->next);        // 纸条一：37 接上 40
head->next->next = std::move(again);              // 纸条二：35 改指 37
for (Node* p = head.get(); p; p = p->next.get()) std::print("{} → ", p->value);
std::println("null");                             // 输出 30 → 35 → 37 → 40 → null` },
        { t: `p`, text: `输出 30 → 35 → 37 → 40 → null（本机实跑验证）。动手前先想清楚「插在谁后面」：37 要插在 35 后面，所以纸条二站在 head->next->next —— 也就是 35 —— 的位置上改。链式层数永远对着图数，别凭感觉。这时候纸上应该有四格：30 → 35 → 37 → 40，每格旁边标一句「谁的纸条指我」—— 这张图标完，两张纸条该写哪两层就不用猜了。` },
        { t: `h2`, text: `演示 3 · 顺序写反会发生什么（错版实跑）` },
        { t: `code`, lang: `c++`, code: `// 接上一段：故意先改 30 的纸条、再接 newbie —— 错版示范，别学
auto head = std::make_unique<Node>(30);
head->next = std::make_unique<Node>(40);
auto newbie = std::make_unique<Node>(35);
head->next = std::move(newbie);                   // 先断：40 的管辖权没人接
newbie->next = std::move(head->next);             // newbie 已是空纸条，再碰它就出事` },
        { t: `p`, text: `错版本机实跑：一行输出都没有，程序当场段错误，退出码 139。拆开看：第一行把 35 的管辖权塞给 head->next 的同时，40 没人接手，被 unique_ptr 悄悄销毁 —— 这一步不报错、不吭声；第二行更糟，newbie 里的管辖权早已移交出去，它现在是空纸条，对空纸条写 ->next 就是对空指针解引用，直接崩。编译器拦得住复印，拦不住运行到一半的顺序错误 —— 能救你的只有「先接后断」四个字和一张草稿纸。调试这类问题也有一招：每张纸条移交完就打一行「现在谁管谁」，谁变空、谁接管一眼见底 —— 移交类的毛病最怕这种笨打印。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `忘写 std::move 直接赋值：编译报 use of deleted function —— 不是位置写错，是 unique_ptr 压根不给复印，得移交。`,
          `两张纸条先断后接：40 的管辖权没人接手，节点被销毁，输出里直接少一个数，而且不报任何错。`,
          `移交之后还用旧变量：std::move 之后的 newbie 已经空了，再取它的 ->next 就是解引用空指针，实测段错误（演示 3 就是现场）。`,
          `插队位置找错：改纸条必须站在「插队位置的前一站」上，head->next->next 这种链式写法层数一错就插错地方。`,
          `忘 #include <utility>：std::move 报「名字找不到」—— 它不住在 <memory> 里。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `在 35 和 40 之间再插一个 37（提示：又是两张纸条的事，照演示 2 先跑通）。`,
          `把演示 3 的错版亲手跑一遍，观察 40 是怎么消失的、程序崩在哪一行。`,
          `进阶：往链的开头插一个 25（提示：这次动的是 head 自己 —— 造新头、让它接管整条旧链，再把 head 换成新头）。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：链表插队 = 造节点 + 改两张纸条；纸条不能复印只能 std::move 移交，先接后断，顺序反了节点会凭空消失。` }
      ]
    },
    {
      id: `m185`, title: `第 185 课 · 反转整条链`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用「三步舞」把 1 → 2 → 3 整条倒成 3 → 2 → 1，全程只改纸条、不造不拆一个节点。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `前两课会建链、会插队了，这一课玩把大的：把整条链倒过来。办法听着简单 —— 走到每个节点，就把它的纸条从「指下一站」改成「指回上一站」。麻烦也在这里：纸条一改指回去，原来通往后面的路就断了，所以改之前必须先把下一站抄在手里，否则后面整段直接失联。` },
        { t: `p`, text: `于是要两个记号分工：prev 是已经倒好的那一段的头，head 是还没处理的部分的头，两段之间的缝隙用 next 暂存。每轮三步，一步都不能乱：` },
        { t: `ul`, items: [
          `**第 1 步 · 记住下一站**：auto next = std::move(head->next)，先把通往后面的路抄在手里；`,
          `**第 2 步 · 纸条改指回上一站**：head->next = std::move(prev)，当前节点从此归入已倒好的一段；`,
          `**第 3 步 · 各前进一步**：prev = std::move(head); head = std::move(next)，两人同时往前挪一站。`
        ]},
        { t: `svg`, caption: `反转一轮的三步：记住下一站、纸条改指回上一站、各前进一步`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 246">
  <g font-size="12" fill="#33465e">
    <text x="24" y="40" font-weight="700">本轮开始</text>
    <text x="24" y="160" font-weight="700">本轮结束</text>
  </g>
  <g font-size="13" text-anchor="middle">
    <rect x="110" y="52" width="150" height="36" fill="#eafaf0" stroke="#1a7f42"/><text x="185" y="76" fill="#1a7f42">已倒好的一段</text>
    <rect x="360" y="52" width="96" height="36" fill="#eaf3fb" stroke="#00599c"/><text x="408" y="76">当前节点</text>
    <rect x="500" y="52" width="96" height="36" fill="#fffdf5" stroke="#b8722b"/><text x="548" y="76" fill="#b8722b">下一站…</text>
    <rect x="110" y="172" width="96" height="36" fill="#eaf3fb" stroke="#00599c"/><text x="158" y="196">当前节点</text>
    <rect x="250" y="172" width="150" height="36" fill="#eafaf0" stroke="#1a7f42"/><text x="325" y="196" fill="#1a7f42">已倒好的一段</text>
    <rect x="480" y="172" width="96" height="36" fill="#fffdf5" stroke="#b8722b"/><text x="528" y="196" fill="#b8722b">下一站…</text>
  </g>
  <g stroke="#00599c" stroke-width="2">
    <line x1="456" y1="70" x2="490" y2="70"/><polygon points="490,64 500,70 490,76" fill="#00599c"/>
    <line x1="206" y1="190" x2="240" y2="190"/><polygon points="240,184 250,190 240,196" fill="#1a7f42"/>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="24" y="122">① next 暂存下一站的地址 —— 记住路 ② 当前节点的纸条反转，指回已倒好的一段</text>
    <text x="24" y="144">③ prev 挪到当前节点，head 挪到下一站 —— 每轮只倒一个节点</text>
    <text x="24" y="234" font-weight="700" fill="#1a7f42">起点处 prev 是空的，第一站的纸条正好被改成 null；head 走空时，prev 攥着整条倒好的链</text>
  </g>
</svg>` },
        { t: `p`, text: `两个边界都藏着巧思。起点处 prev 是空的 —— 第一站的纸条改指这个空，正好变成 null，链的新尽头就这么造出来了，不用特意去改最后一站；终点处 head 走空 —— 所有节点都进了 prev 那一段，prev 就是新链的头。所以循环条件写 head 本身非空：它一空，反转自然收工，连链有多长都不用数。` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `这套三步舞为什么 std::move 满天飞？因为每一刻每个节点都得有且只有一个主人：next 暂存下一站、prev 收编当前节点、head 交出管辖权，全是一次次移交。要是允许复印，移交过程中就会有两个人管同一个节点，出了作用域销毁两次。标准库用「只能移交」逼着你想清楚：每一刻谁管谁、管到什么时候 —— 想清楚了，反转就一步不错。` },
        { t: `p`, text: `这套舞步还有个好处：它对链长一无所知也毫无意见。三个节点是三轮，三万个节点是三万轮，代码一个字不用改 —— 因为每一轮都只关心眼前这个节点。拿住当前、记住后路、逐步推进，这正是链表类算法的通用骨架，往后学插入、删减还会反复见到它。` },
        { t: `p`, text: `顺带看一眼 next 这个变量的性子：它是循环体里造的局部 unique_ptr，每轮重新出生、把管辖权转给纸条或 head 后悄然退场。三个长命变量 prev、head 和这些短命的 next 接力，就把整条链倒了个个儿 —— 这正是第 78 课请智能指针来干的那件事 —— 生死它来管，你只管移交。` },
        { t: `p`, text: `建链沿用上一课的写法：三个 make_unique 串出 1 → 2 → 3。本课真正的新代码只有循环里那三行，把它们读熟比多写新代码值钱。` },
        { t: `h2`, text: `演示 1 · 三步舞本体` },
        { t: `code`, lang: `c++`, code: `// 接上一段：Node 与建链 1 → 2 → 3 沿用上一课写法，下面在 main 里
std::unique_ptr<Node> prev;                       // 已倒好的部分，起初为空
while (head) {
    auto next = std::move(head->next);            // 第 1 步：记住下一站
    head->next = std::move(prev);                 // 第 2 步：纸条改指回上一站
    prev = std::move(head); head = std::move(next); // 第 3 步：各前进一步
}
for (Node* p = prev.get(); p; p = p->next.get()) std::print("{} → ", p->value);
std::println("null");                              // 输出 3 → 2 → 1 → null` },
        { t: `p`, text: `输出 3 → 2 → 1 → null（本机实跑）。数一数移交次数：三个节点、每轮三次移交，三轮九次 —— 每个 unique_ptr 都换过主人，但没有一个节点被造第二遍，也没有一个被落下。反转全程零 new、零销毁，动的全是纸条。拆开看这九次移交：第 1 轮 next 接管 2、纸条 1 指回空、prev 接管 1；第 2 轮 next 接管 3、纸条 2 指回 1、prev 接管 2；第 3 轮 next 接到空、纸条 3 指回 2、prev 接管 3。九行读完，三步舞就在纸上跳完了。` },
        { t: `h2`, text: `演示 2 · 把每轮的 prev 和 head 打出来` },
        { t: `p`, text: `源稿要你在纸上画出每轮循环后 prev 和 head 各指哪里。先自己画，画完用这段打印核对：` },
        { t: `code`, lang: `c++`, code: `// 接上一段：while 循环体最后补上这几行，把每轮状态打出来
std::print("本轮后 prev=");
for (Node* p = prev.get(); p; p = p->next.get()) std::print("{} ", p->value);
std::print(" head=");
if (head) std::println("{}", head->value); else std::println("空");` },
        { t: `code`, lang: `text`, code: `本轮后 prev=1  head=2
本轮后 prev=2 1  head=3
本轮后 prev=3 2 1  head=空` },
        { t: `p`, text: `本机实跑就这三行，逐轮对照：第 1 轮收编节点 1，它的纸条指回空，prev 从 1 起家，head 站上 2；第 2 轮收编 2，prev 变成 2 → 1；第 3 轮收编 3，head 落空、prev 攥着全部。纸上画的和实跑对上了，反转这道题才算真会 —— 对不上，就回头查是哪一步的移交想岔了。另外盯住第 3 轮后的两个细节：新链的尾是 1 —— 它的纸条在第 1 轮就改成了空；新链的头是 3 —— 它的纸条在第 3 轮才改指 2。头尾的来历都能在九次移交里找到，这正是纸上画图的价值。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `三步顺序打乱：先把 head 前进再改纸条，当前节点通往后面的路就没了，后面整段直接失联。口诀：先记、再回头、再前进。`,
          `next 忘了 std::move：auto next = head->next 编译报 use of deleted function —— 纸条不能复印，老规矩。`,
          `循环条件写成 head->next：最后一个节点进不了 prev，输出停在 2 → 1 就收工。条件是 head 本身非空。`,
          `循环结束后还用 head：三步舞跳完它是空纸条，新链的头在 prev。拿着空 head 去走链，什么都不打。`,
          `建链借上一课的代码却没带 <utility>：std::move 报「名字找不到」。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `在纸上画出每轮循环后 prev 和 head 各指哪里，直到走完，再用演示 2 的打印核对。`,
          `给链多接一个节点 0（变成 1 → 2 → 3 → 0），先在纸上写出四轮的每轮状态，再实跑验证。`,
          `想清楚并写下来：为什么这个办法不用先数链有多长（提示：head 走空自然停）。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：反转 = 每轮三步「记住下一站、纸条指回上一站、各前进一步」；head 走空，prev 就是新头。` }
      ]
    },
    {
      id: `m186`, title: `第 186 课 · vector 和 list 谁更快`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：亲手掐表实测 vector 和 list 的速度差，用三组实验得出那句口诀 —— 默认无脑选 vector。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `前三课把链表玩熟了：插队只改两张纸条，看着比 vector 的全员挪动高级多了。这一课掐表实测，先泼一盆冷水 —— 最常用的两个操作「往尾部放数」和「从头走到尾」，list 都明显更慢。原因不在算法，在内存布局。` },
        { t: `p`, text: `vector 的元素一格挨一格（第 180、181 课你亲手写过它的扩容搬家）。CPU 从内存取数不是一格一格取，而是一次顺路把旁边一整块都带进高速缓存 —— 这叫缓存友好。走一遍 vector 就像散步，路过谁家都能顺眼看一眼。list 的节点是散装的：每个节点单独申请内存，地址东一个西一个，每走一步都要重新「找门牌」，缓存带来的顺路好处一点沾不上。` },
        { t: `svg`, caption: `vector 一格挨一格吃缓存红利；list 散装节点每步都要重新找门牌`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 252">
  <g font-size="13" fill="#142639"><text x="24" y="24" font-weight="700">两种内存布局，两种命运</text></g>
  <g font-size="13" text-anchor="middle">
    <text x="24" y="66" text-anchor="start" font-weight="700">vector</text>
    <rect x="100" y="42" width="48" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="124" y="68">0</text>
    <rect x="148" y="42" width="48" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="172" y="68">1</text>
    <rect x="196" y="42" width="48" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="220" y="68">2</text>
    <rect x="244" y="42" width="48" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="268" y="68">3</text>
    <rect x="292" y="42" width="48" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="316" y="68">4</text>
    <rect x="340" y="42" width="48" height="40" fill="#eaf3fb" stroke="#00599c"/><text x="364" y="68">5</text>
    <text x="24" y="160" text-anchor="start" font-weight="700">list</text>
    <rect x="90" y="130" width="70" height="40" fill="#fffdf5" stroke="#b8722b"/><text x="125" y="156" fill="#b8722b">节点</text>
    <rect x="330" y="118" width="70" height="40" fill="#fffdf5" stroke="#b8722b"/><text x="365" y="144" fill="#b8722b">节点</text>
    <rect x="520" y="148" width="70" height="40" fill="#fffdf5" stroke="#b8722b"/><text x="555" y="174" fill="#b8722b">节点</text>
  </g>
  <g stroke="#00599c" stroke-width="2">
    <line x1="100" y1="102" x2="388" y2="102"/><polygon points="388,96 398,102 388,108" fill="#00599c"/>
  </g>
  <g stroke="#b8722b" stroke-width="2" stroke-dasharray="5 4">
    <path d="M160,150 C220,190 270,120 330,138" fill="none"/><polygon points="330,132 342,140 328,146" fill="#b8722b"/>
    <path d="M400,152 C450,190 470,150 516,164" fill="none"/><polygon points="514,158 526,166 512,172" fill="#b8722b"/>
  </g>
  <g font-size="12" fill="#33465e">
    <text x="100" y="122">挨着排：取一个顺路把旁边整块带进缓存</text>
    <text x="24" y="216">散装的：地址东一个西一个，虚线是每一步都要跳着「找门牌」</text>
    <text x="24" y="240" font-weight="700" fill="#1a7f42">插队是 list 的主场；其余基本盘 —— 缓存与少申请 —— 全是 vector 的</text>
  </g>
</svg>` },
        { t: `p`, text: `还有一笔隐形账：list 每放一个数都要向系统申请一次节点内存，放 100 万个数就是 100 万次申请；vector 虽然也搬家（第 180 课），但搬家是翻倍的，摊到每次 push_back 头上便宜得很。两笔账加在一起，量级差距实测见。` },
        { t: `p`, text: `计时工具用 chrono 里的 steady_clock：now 记下两个时刻，相减再换算成毫秒。名字里的 steady 是「只进不退的钟」—— 不受系统对时、校时影响，掐表专用。list 是标准库自带的链表容器，和你手写的 Node 一族是近亲，住在 <list> 里；这课的头文件一共四个：<print>、<vector>、<list>、<chrono>。` },
        { t: `h2`, text: `演示 1 · 先测尾部放 10 万个` },
        { t: `code`, lang: `c++`, code: `// 接上一段：头文件请 <print> <vector> <list> <chrono>，放进 main 里
constexpr int N = 100000;
std::vector<int> v;
std::list<int> lst;
auto now = std::chrono::steady_clock::now;        // 借一个标准秒表
auto t0 = now();
for (int i = 0; i < N; ++i) v.push_back(i);      // vector：尾部放 10 万个数
auto t1 = now();
for (int i = 0; i < N; ++i) lst.push_back(i);    // list：同样放 10 万个
auto t2 = now();
auto ms = [](auto a, auto b) { return std::chrono::duration<double, std::milli>(b - a).count(); };
std::println("尾部放 {} 个: vector {:.2f} ms，list {:.2f} ms", N, ms(t0, t1), ms(t1, t2));` },
        { t: `p`, text: `本机实跑（没开优化）打出：尾部放 100000 个: vector 1.20 ms，list 9.72 ms。同一程序开 -O2 再跑三次，稳定在 vector 约 0.43 ms、list 约 2.9 ms —— 差着 7 倍上下。数字每台机器、每次运行都会抖，但「list 慢好几倍」这个关系非常稳。顺带拆一下那行 ms：它是个小 lambda（第 56–58 课的手艺），吃进两个时刻，吐出差值换算成的毫秒数。duration<double, std::milli> 的意思是「以毫秒为单位、允许小数」—— 不写 double 的话 chrono 默认拿整数纳秒给你，一长串零读起来费劲。对照实验的公平性也在这儿：两边循环体都是「放一个数」，唯一的差别是容器自己 —— 计时比的就是同一件事在两种内存布局上的开销。` },
        { t: `p`, text: `10 万个数不过几毫秒，感觉不出来 —— 但真实程序动辄千万次，7 倍就是一秒和七秒的差别。别小看这盆冷水。` },
        { t: `h2`, text: `演示 2 · N 上到 100 万，再走一遍、再往头上插` },
        { t: `code`, lang: `c++`, code: `// 接上一段：把 N 改成 1000000 重跑，再补两组对照实验
long long sv = 0, sl = 0;
auto t3 = now();  for (int x : v) sv += x;       // 顺序走一遍：量「读」的速度
auto t4 = now();  for (int x : lst) sl += x;
auto t5 = now();
std::println("顺序走一遍 {} 个: vector {:.2f} ms，list {:.2f} ms", N, ms(t3, t4), ms(t4, t5));

const int M = 50000;                              // 头部插入对照
std::vector<int> fv; std::list<int> fl;          // 两位新选手，从空开始
auto b0 = now();  for (int i = 0; i < M; ++i) fv.insert(fv.begin(), i);
auto b1 = now();  for (int i = 0; i < M; ++i) fl.push_front(i);
auto b2 = now();
std::println("头部插 {} 个: vector {:.2f} ms，list {:.2f} ms", M, ms(b0, b1), ms(b1, b2));` },
        { t: `p`, text: `本机实测三组数（g++ 15、开 -O2、跑三次取典型值）：` },
        { t: `ul`, items: [
          `**尾部放 100 万个**：vector 约 2.9 ms，list 约 28.5 ms —— 对照 10 万个时的约 0.43 对 2.9，差距从约 7 倍拉到约 10 倍，规模越大 list 亏得越多（源稿任务要你亲手看的就是这个）；`,
          `**顺序走一遍 100 万个**：vector 约 0.5 ms，list 约 2.7 ms —— 光「读」也是 vector 快，缓存红利实打实；`,
          `**往头部插 5 万个**：vector 约 75–86 ms，list 约 0.9 ms —— 这回 list 反赢约 80 倍：vector 每插一个全员后挪一格，5 万个插完是十几亿次的搬运；list 只改一张纸条。`
        ]},
        { t: `p`, text: `三组放一起读，结论不是「list 一无是处」，而是「账要按操作算」：插队是 list 的主场 —— 不挪人；其余基本盘全是 vector 的 —— 缓存加少申请。所以口诀值得背下来：默认无脑选 vector；除非测过自己的操作就是插队多、遍历少，而且嘴上说了不算，要像今天这样掐表。还有一句留给以后的你：往后学了更多容器，这课的掐表法照样能用 —— 换个类型、换个容器，其余一行不改。性能问题从来不靠猜，靠的就是这么一组一组的小实验。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `编译忘 -std=c++23：<print> 直接报找不到。本课命令统一 g++ -std=c++23 文件名。`,
          `掐表用 system_clock：那是挂墙上的钟，系统一校时它可能倒退，耗时能算出负数。掐表认准 steady_clock，而且掐之前想清楚量的到底是哪一段 —— 秒表放错位置，测到的就是别的开销。`,
          `跑一次就下结论：毫秒级数字每次都抖，同一程序多跑几次看量级。开优化也会变倍数 —— 本机没开 -O2 时测过一次 vector 1.20 ms、list 9.72 ms，方向不变、差距更大。`,
          `以为 list 全面落后：头部插入它反赢约 80 倍（本机实测）。结论永远是按操作分布选容器，不是背一句谁快。`,
          `忘 #include <list>：list 也住在自己的头文件里，和 <vector> 一样得请。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把 N 改成 1000000 再跑：差距是不是拉得更大了？（本机实测从约 7 倍拉到约 10 倍，看看你的机器）`,
          `给「顺序走一遍」也掐上表（照演示 2 的写法），对比 vector 和 list 的读取速度。`,
          `进阶：把头部插入的对照实验跑起来（vector 插到 begin，list 用 push_front），亲眼看看 list 的翻身仗。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：连续内存吃缓存红利，散装节点败在找门牌；插队是 list 的主场，其余默认 vector，动手前先掐表。` }
      ]
    }
  ]
};
