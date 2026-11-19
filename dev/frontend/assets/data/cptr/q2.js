/* 喵站 · C 掌握 · 第 13–24 课（q2 分部）
 * 代码块用 gcc -std=c11 -Wall -Wextra 编译并运行过；为了压进 12 行，个别示例只保留了核心逻辑。 */
window.MIAO_CPTR_Q2 = { chapters: [
  {
    id: `q13`,
    title: `第 13 课 · 链表（一）：单链表`,
    blocks: [
      { t: `tip`, color: `blue`, text: `本课目标：会定义链表节点，用 head 串起一条链，从头遍历，并在结束时把每个节点还给堆。` },
      { t: `h2`, text: `原理讲解` },
      { t: `p`, text: `数组的元素必须挨在一起，长度定下来就很难改。链表换了个办法：每个节点单独 malloc，节点里存一个值和一根指向下一个节点的指针，节点之间不必相邻。整条链的入口叫 head，它保存第一个节点的地址；head 是 NULL 就表示空链表。` },
      { t: `p`, text: `节点结构里要有一个指向同类型结构的指针，所以写成 struct Node，成员 next 的类型是 struct Node *。建链时先 malloc 一个节点，填好 value，再把 next 指向当前的 head，最后让 head 指向新节点。三步的顺序不能反：先挂后面，再改 head，否则旧链就找不回来了。` },
      { t: `p`, text: `遍历用一个临时指针 p，从 head 出发，条件是 p 不为 NULL，每轮结束执行 p = p->next。不要拿 head 本身往前挪，head 是唯一入口，挪丢了整条链就泄漏。释放也要遍历，但必须先存下 next 再 free 当前节点，因为 free 之后节点里的 next 已经不能读。` },
      { t: `h2`, text: `假设它能干什么` },
      { t: `ul`, items: [
        `存长度事先不知道的一串记录，比如待办、日志行。`,
        `频繁在开头插入，数组要整体后移，链表只改两根指针。`,
        `做栈和队列的底层，push 和 pop 都在表头完成。`,
        `把散落在堆上的节点按顺序串起来，逐个处理。`
      ] },
      { t: `h2`, text: `演示：从头建链并遍历` },
      { t: `p`, text: `下面这段程序从 3 数到 1，每轮把一个新节点插到表头，所以最后打印出来的顺序是 1、2、3。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
#include <stdlib.h>
struct Node { int value; struct Node *next; };
int main(void) {
    struct Node *head = NULL;
    for (int i = 3; i >= 1; i--) {
        struct Node *n = malloc(sizeof *n);
        n->value = i; n->next = head; head = n;
    }
    for (struct Node *p = head; p; p = p->next) printf("%d\\n", p->value);
    return 0;
}` },
      { t: `p`, text: `head 一开始是 NULL。i 等于 3 时新节点指向 NULL，head 指向它；i 等于 2 时新节点指向原来的头，head 再前移。每一步都只改两个指针：新节点的 next 和 head。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
#include <stdlib.h>
struct Node { int value; struct Node *next; };
int main(void) {
    struct Node *a = malloc(sizeof *a), *b = malloc(sizeof *b);
    a->value = 1; a->next = b; b->value = 2; b->next = NULL;
    while (a) { struct Node *next = a->next; free(a); a = next; }
    puts("chain freed");
    return 0;
}` },
      { t: `p`, text: `释放循环里 next 先保存，再 free，再把 head 挪到 next。顺序反了就是先 free 再读已经还回去的内存，AddressSanitizer 会当场报错，后面单独一课讲它。` },
      { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250"><rect x="32" y="30" width="576" height="190" rx="14" fill="#eef6f4"/><text x="320" y="64" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">head 指向第一个节点，next 把节点串起来</text><rect x="60" y="106" width="84" height="46" rx="8" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="102" y="135" font-size="15" text-anchor="middle" fill="#173d36">head</text><path d="M148 129H190" stroke="#2a8c78" stroke-width="3"/><polygon points="190,129 180,123 180,135" fill="#2a8c78"/><rect x="194" y="102" width="100" height="54" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><line x1="254" y1="102" x2="254" y2="156" stroke="#7fa99f" stroke-width="2"/><text x="224" y="135" font-size="16" text-anchor="middle" fill="#173d36">1</text><text x="277" y="135" font-size="14" text-anchor="middle" fill="#4d6f67">next</text><path d="M298 129H334" stroke="#2a8c78" stroke-width="3"/><polygon points="334,129 324,123 324,135" fill="#2a8c78"/><rect x="338" y="102" width="100" height="54" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><line x1="398" y1="102" x2="398" y2="156" stroke="#7fa99f" stroke-width="2"/><text x="368" y="135" font-size="16" text-anchor="middle" fill="#173d36">2</text><text x="421" y="135" font-size="14" text-anchor="middle" fill="#4d6f67">next</text><path d="M442 129H478" stroke="#2a8c78" stroke-width="3"/><polygon points="478,129 468,123 468,135" fill="#2a8c78"/><rect x="482" y="102" width="90" height="54" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><line x1="536" y1="102" x2="536" y2="156" stroke="#7fa99f" stroke-width="2"/><text x="509" y="135" font-size="16" text-anchor="middle" fill="#173d36">3</text><text x="558" y="135" font-size="14" text-anchor="middle" fill="#4d6f67">空</text><text x="320" y="194" font-size="14" text-anchor="middle" fill="#4d6f67">每个节点单独 malloc，最后一个 next 存 NULL</text></svg>`, caption: `head 只记第一个节点；顺着 next 才能找到后面的节点，最后一个的 next 是 NULL。` },
      { t: `h2`, text: `常见坑` },
      { t: `ul`, items: [
        `遍历时直接写 head = head->next，走完 head 变成 NULL，整条链再也没法访问，也没法释放。`,
        `malloc 之后不检查返回值，堆耗尽时拿到 NULL，下一行解引用就崩。`,
        `忘记把最后一个节点的 next 设成 NULL，遍历会冲进随机内存。`,
        `free 当前节点之后才去读它的 next，读的是已经还给堆的内存。`,
        `以为节点在数组里挨着，对 next 做加减法算下一个地址。`
      ] },
      { t: `h2`, text: `任务` },
      { t: `ul`, items: [
        `写一个 count_nodes，返回链表中节点个数，空链返回 0。`,
        `用头插法读入 5 个整数建链，再正序打印；把插入改成尾插，比较输出顺序。`,
        `写 free_list，释放后把调用者的 head 置为 NULL；想想为什么参数要用指针的指针。`,
        `画一条三节点链，标出 head、每个 next 和 NULL 各指向哪里。`
      ] },
      { t: `tip`, color: `green`, text: `本课一句话：链表是 malloc 出来的节点加一根 next 指针，head 守入口，遍历用临时指针，释放前先存 next。` }
    ]
  },
  {
    id: `q14`,
    title: `第 14 课 · 链表（二）：插入，删除，反转`,
    blocks: [
      { t: `tip`, color: `blue`, text: `本课目标：掌握头插、尾插、按位置插入和删除，会用 prev、cur、next 三根指针把一条单链反转。` },
      { t: `h2`, text: `原理讲解` },
      { t: `p`, text: `插入的第一原则是**先接后断**。头插写 new->next = head，再写 head = new；尾插先走到最后一个节点，写 last->next = new，再把 new->next 置 NULL；按位置插入要先找到前驱 prev，写 new->next = prev->next，再写 prev->next = new。新节点的 next 必须在前驱改指之前拿到原来的后继，反了后半条链就丢了。` },
      { t: `p`, text: `删除先摘链，再 free。找到目标的前驱 prev，执行 prev->next = target->next，然后 free(target)。删头节点特殊，先把旧头存进 target，再 head = head->next，free(target)；删唯一节点后 head 就是 NULL。顺序反过来，free 之后 target->next 已经不能读，后半条链接不上。` },
      { t: `p`, text: `反转不新建节点，只把每根 next 调头。准备 prev = NULL、cur = head；每轮先 next = cur->next，再 cur->next = prev，然后 prev = cur、cur = next。循环结束时 cur 是 NULL，prev 指向原来的尾，也就是新的头。` },
      { t: `h2`, text: `假设它能干什么` },
      { t: `ul`, items: [
        `头插做栈，最后进来的最先出去；尾插做队列，先进先出。`,
        `从待办列表里删掉已经完成的一项。`,
        `撤销历史把最新操作放表头，删的时候也从头找。`,
        `反转一条日志链，从最新记录往回看。`
      ] },
      { t: `h2`, text: `演示：头插与反转` },
      { t: `p`, text: `先看头插：三个节点依次从表头进来，打印顺序和插入顺序相反。节点放在栈上，只为把注意力留在指针顺序，真正建链还是用 malloc。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
struct Node { int value; struct Node *next; };
int main(void) {
    struct Node c = {3, NULL}, b = {2, &c};
    struct Node a = {1, &b};
    struct Node *head = &a;
    struct Node fresh = {0, head};
    head = &fresh;
    for (struct Node *p = head; p; p = p->next) printf("%d ", p->value);
    return 0;
}` },
      { t: `p`, text: `新节点 fresh 的 next 先接上原来的 head，然后 head 改指 fresh。两行顺序反过来，fresh 的 next 就指向自己或丢掉旧链。输出是 0、1、2、3。` },
      { t: `p`, text: `再看反转。下面这条链有 1、2、3 三个节点，循环每转一圈只改一根 next。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
struct Node { int value; struct Node *next; };
int main(void) {
    struct Node c = {3, NULL}, b = {2, &c}, a = {1, &b};
    struct Node *prev = NULL, *cur = &a, *next;
    while (cur) { next = cur->next; cur->next = prev; prev = cur; cur = next; }
    for (struct Node *p = prev; p; p = p->next) printf("%d ", p->value);
    return 0;
}` },
      { t: `p`, text: `每轮先保存 next，再把 cur 的 next 指向 prev，然后 prev 和 cur 各前进一步。保存 next 必须在改 cur->next 之前，否则剩下的链就断了。输出是 3、2、1。` },
      { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="30" y="28" width="580" height="244" rx="14" fill="#eef6f4"/><text x="320" y="62" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">反转就是让每根 next 改指前一个节点</text><text x="64" y="104" font-size="15" fill="#4d6f67">反转前</text><rect x="150" y="82" width="84" height="40" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="192" y="108" font-size="15" text-anchor="middle" fill="#173d36">1</text><rect x="278" y="82" width="84" height="40" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="320" y="108" font-size="15" text-anchor="middle" fill="#173d36">2</text><rect x="406" y="82" width="84" height="40" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="448" y="108" font-size="15" text-anchor="middle" fill="#173d36">3</text><path d="M236 102H274" stroke="#2a8c78" stroke-width="3"/><polygon points="274,102 264,96 264,108" fill="#2a8c78"/><path d="M364 102H402" stroke="#2a8c78" stroke-width="3"/><polygon points="402,102 392,96 392,108" fill="#2a8c78"/><path d="M492 102H536" stroke="#7fa99f" stroke-width="2.5"/><text x="556" y="107" font-size="14" fill="#4d6f67">空</text><text x="64" y="174" font-size="15" fill="#4d6f67">反转后</text><text x="132" y="202" font-size="14" fill="#4d6f67">空</text><path d="M156 198H196" stroke="#2a8c78" stroke-width="3"/><polygon points="196,198 186,192 186,204" fill="#2a8c78"/><rect x="200" y="176" width="84" height="40" rx="6" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="242" y="202" font-size="15" text-anchor="middle" fill="#173d36">3</text><path d="M284 196H322" stroke="#2a8c78" stroke-width="3"/><polygon points="322,196 312,190 312,202" fill="#2a8c78"/><rect x="326" y="176" width="84" height="40" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="368" y="202" font-size="15" text-anchor="middle" fill="#173d36">2</text><path d="M410 196H448" stroke="#2a8c78" stroke-width="3"/><polygon points="448,196 438,190 438,202" fill="#2a8c78"/><rect x="452" y="176" width="84" height="40" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="494" y="202" font-size="15" text-anchor="middle" fill="#173d36">1</text><text x="320" y="252" font-size="14" text-anchor="middle" fill="#4d6f67">每轮保存 next，再改 cur 的 next，最后 prev 和 cur 前进</text></svg>`, caption: `三根指针分工：next 负责记路，prev 负责接新链，cur 负责当前节点。` },
      { t: `h2`, text: `常见坑` },
      { t: `ul`, items: [
        `先改 prev->next，再拿 prev->next 当新节点的 next，后半条链已经丢了。`,
        `删除节点先 free 再改前驱的 next，访问已释放内存。`,
        `删头时不更新 head，head 还指着已经 free 的节点。`,
        `反转后忘记 head = prev，head 还指旧头，打印只剩原来的第一个节点。`,
        `尾插不把新节点的 next 置 NULL，链尾接上一个垃圾地址。`
      ] },
      { t: `h2`, text: `任务` },
      { t: `ul`, items: [
        `写 insert_at(head, pos, value)，pos 为 0 时等价头插，越界时返回原链。`,
        `写 delete_value(head, value)，删除第一个匹配节点，返回新的 head。`,
        `用迭代反转一条五节点链，再反转回来，两次打印结果。`,
        `画出删除中间节点前后的指针变化，标出哪一行先执行。`
      ] },
      { t: `tip`, color: `green`, text: `本课一句话：插入先接新节点的 next 再改前驱，删除先摘链再 free，反转用 prev、cur、next 三根指针逐段调头。` }
    ]
  },
  {
    id: `q15`,
    title: `第 15 课 · 链表（三）：双向链表`,
    blocks: [
      { t: `tip`, color: `blue`, text: `本课目标：会写带 prev 和 next 的双向链表，完成插入、删除和带尾指针的追加，并说清它和单链表的取舍。` },
      { t: `h2`, text: `原理讲解` },
      { t: `p`, text: `双向链表的节点多一根 prev。头节点的 prev 是 NULL，尾节点的 next 是 NULL，两个边界都要照顾好。从任一端都能走完整条链；手里已经有某个节点的指针时，不用从头再找前驱，直接看 prev 就能前后移动。` },
      { t: `p`, text: `在节点 p 后面插入 n，四步这样写：n->prev = p；n->next = p->next；如果 p->next 不为 NULL，p->next->prev = n；最后 p->next = n。先处理 n 的两根指针，再改邻居；如果先把 p->next 改掉，原来的后继就找不到了。删除节点 p 要同时改两边：p->prev->next = p->next，p->next->prev = p->prev，头尾两种情况单独判 NULL。` },
      { t: `p`, text: `尾指针 tail 让尾部追加变成 O(1)：n->prev = tail，n->next = NULL；如果 tail 不为 NULL 就 tail->next = n，否则 head = n；最后 tail = n。代价是每个节点多一根指针，插入删除要同步改前后两边，漏一边链就断。单链表省内存，双链表换灵活，选哪个看删改多不多。` },
      { t: `h2`, text: `假设它能干什么` },
      { t: `ul`, items: [
        `浏览器前进后退，当前页天然有前驱和后继。`,
        `播放列表的上一首、下一首。`,
        `需要频繁从中间删除的任务队列，拿到节点就能摘。`,
        `用 tail 维护最近一条记录，追加不用每次走到尾。`
      ] },
      { t: `h2`, text: `演示：正着走，再倒着走` },
      { t: `p`, text: `三个节点放在栈上，prev 和 next 都手工接好。正向从 a 出发用 next，反向从 c 出发用 prev。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
struct Node { int value; struct Node *prev, *next; };
int main(void) {
    struct Node a = {1, NULL, NULL}, b = {2, &a, NULL}, c = {3, &b, NULL};
    a.next = &b; b.next = &c;
    for (struct Node *p = &a; p; p = p->next) printf("%d ", p->value);
    printf("\\n");
    for (struct Node *p = &c; p; p = p->prev) printf("%d ", p->value);
    return 0;
}` },
      { t: `p`, text: `a 的 prev 和 c 的 next 都是 NULL，正好是两个边界。正向输出 1、2、3，反向输出 3、2、1。如果某根 prev 忘了接，反向走到一半就会踩到 NULL。` },
      { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="30" y="28" width="580" height="224" rx="14" fill="#eef6f4"/><text x="320" y="62" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">双链表：next 向右，prev 向左</text><text x="74" y="126" font-size="15" fill="#4d6f67">head</text><text x="556" y="238" font-size="15" fill="#4d6f67">tail</text><rect x="132" y="100" width="92" height="56" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="178" y="134" font-size="16" text-anchor="middle" fill="#173d36">1</text><rect x="274" y="100" width="92" height="56" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="320" y="134" font-size="16" text-anchor="middle" fill="#173d36">2</text><rect x="416" y="100" width="92" height="56" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="462" y="134" font-size="16" text-anchor="middle" fill="#173d36">3</text><path d="M224 116H268" stroke="#2a8c78" stroke-width="3"/><polygon points="268,116 258,110 258,122" fill="#2a8c78"/><path d="M366 116H410" stroke="#2a8c78" stroke-width="3"/><polygon points="410,116 400,110 400,122" fill="#2a8c78"/><path d="M268 142H228" stroke="#b5761f" stroke-width="3"/><polygon points="228,142 238,136 238,148" fill="#b5761f"/><path d="M410 142H370" stroke="#b5761f" stroke-width="3"/><polygon points="370,142 380,136 380,148" fill="#b5761f"/><text x="246" y="186" font-size="14" text-anchor="middle" fill="#2a8c78">next</text><text x="390" y="186" font-size="14" text-anchor="middle" fill="#b5761f">prev</text><text x="132" y="190" font-size="14" text-anchor="middle" fill="#4d6f67">prev 为空</text><text x="462" y="190" font-size="14" text-anchor="middle" fill="#4d6f67">next 为空</text><text x="320" y="228" font-size="14" text-anchor="middle" fill="#4d6f67">插入和删除都要同时改 next 和 prev 两边</text></svg>`, caption: `正向靠 next，反向靠 prev；头尾各有一根指针是 NULL，删除时必须单独处理。` },
      { t: `h2`, text: `常见坑` },
      { t: `ul`, items: [
        `插入时先改 p->next，再读 p->next 给 n->next，拿到的是新节点自己。`,
        `删除只改 next 方向的链，prev 还指着已释放节点，反向遍历崩溃。`,
        `删头或删尾不更新 head 和 tail，或者更新了却忘了把新头的 prev 置 NULL。`,
        `用 tail 追加时不判空链，tail->next 解引用 NULL。`,
        `以为双链表插入一定更快；找位置仍然要从头走，快的是拿到节点之后的删改。`
      ] },
      { t: `h2`, text: `任务` },
      { t: `ul`, items: [
        `写 push_back，维护 head 和 tail，空链和非空链各测一次。`,
        `写 remove_node，删除给定节点，覆盖头、中间、尾三种情况。`,
        `把第 13 课的单链表改成双链表，补上 prev，让反向遍历也正确。`,
        `画一条三节点双链，标出四根指针在头尾为 NULL 的位置。`
      ] },
      { t: `tip`, color: `green`, text: `本课一句话：双链表用 prev 和 next 两头串，插入删除要同时照顾前后邻居，tail 让尾部追加不用再走一遍。` }
    ]
  },
  {
    id: `q16`,
    title: `第 16 课 · 文件（一）：打开文件，读完再关`,
    blocks: [
      { t: `tip`, color: `blue`, text: `本课目标：会用 fopen 打开文件、判断失败、用 fgetc 和 fgets 读取、用 fclose 关闭，并知道 perror 怎么报错。` },
      { t: `h2`, text: `原理讲解` },
      { t: `p`, text: `FILE * 是标准库给的文件句柄，里面包着缓冲区、读写位置和状态。fopen 按模式打开文件，失败返回 NULL；模式 r 只读，w 清空重写，a 追加，r+ 读写，w+ 清空后读写。每次打开都要判 NULL，否则把空指针传给 fgetc，程序当场崩。` },
      { t: `p`, text: `读文件有两个常用入口。fgetc 一次拿一个字节，返回类型是 int，正常值 0 到 255，结尾返回 EOF；如果用 char 接，遇到 0xFF 可能被当成 EOF。fgets(buf, size, fp) 读一行，最多读 size-1 个字符，遇到换行就停，换行会留在 buf 里；到文件尾或出错时返回 NULL。` },
      { t: `p`, text: `写完必须 fclose。它把缓冲区里剩下的内容刷到磁盘，再释放句柄；不关可能丢掉最后一段。出错时用 perror 打印文件名和系统给出的原因，输出到 stderr。feof 只有在一次读失败之后才为真，不能拿它提前判断下一行还有没有。` },
      { t: `h2`, text: `假设它能干什么` },
      { t: `ul`, items: [
        `读配置文件和启动参数。`,
        `逐行处理 CSV 或日志，按逗号、空格拆字段。`,
        `统计文件有多少字节、多少行。`,
        `用追加模式记录每次运行的结果。`
      ] },
      { t: `h2`, text: `演示：写进去，拨回开头再读` },
      { t: `p`, text: `w+ 先清空文件再允许读写。写入后位置停在末尾，rewind 把它拨回开头，fgets 才有内容可读。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
int main(void) {
    FILE *fp = fopen("demo.txt", "w+");
    if (!fp) { perror("demo.txt"); return 1; }
    fputs("alpha\\nbeta\\n", fp);
    rewind(fp);
    char line[64];
    while (fgets(line, sizeof line, fp)) fputs(line, stdout);
    fclose(fp);
    return 0;
}` },
      { t: `p`, text: `sizeof line 是缓冲区总大小，fgets 会自己给结束符留位置。循环在 fgets 返回 NULL 时结束，随后 fclose 把句柄关掉。输出两行 alpha 和 beta。` },
      { t: `p`, text: `再看按字节读。下面这段假设 demo.txt 已经由上一段生成，它数出文件里有几个换行。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
int main(void) {
    FILE *fp = fopen("demo.txt", "r");
    if (!fp) { perror("demo.txt"); return 1; }
    int ch, lines = 0;
    while ((ch = fgetc(fp)) != EOF)
        if (ch == '\\n') lines++;
    fclose(fp);
    printf("%d lines\\n", lines);
    return 0;
}` },
      { t: `p`, text: `fgetc 返回 int，才能把 0 到 255 的字节和 EOF 区分开。括号不能省：ch = fgetc(fp) 要先赋值，再拿结果和 EOF 比较。` },
      { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="28" y="26" width="584" height="228" rx="14" fill="#eef6f4"/><text x="320" y="58" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">文件读写的四个动作</text><rect x="46" y="86" width="116" height="60" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="104" y="112" font-size="15" text-anchor="middle" fill="#173d36">fopen</text><text x="104" y="133" font-size="14" text-anchor="middle" fill="#4d6f67">拿到 FILE 指针</text><path d="M166 116H208" stroke="#2a8c78" stroke-width="3"/><polygon points="208,116 198,110 198,122" fill="#2a8c78"/><rect x="212" y="86" width="176" height="60" rx="8" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="300" y="112" font-size="15" text-anchor="middle" fill="#173d36">FILE 缓冲</text><text x="300" y="133" font-size="14" text-anchor="middle" fill="#4d6f67">位置 + 缓冲区</text><path d="M392 116H434" stroke="#2a8c78" stroke-width="3"/><polygon points="434,116 424,110 424,122" fill="#2a8c78"/><rect x="438" y="86" width="152" height="60" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="514" y="112" font-size="15" text-anchor="middle" fill="#173d36">fgets / fgetc</text><text x="514" y="133" font-size="14" text-anchor="middle" fill="#4d6f67">按行或按字节</text><path d="M300 150V184" stroke="#b5761f" stroke-width="3"/><polygon points="300,184 294,174 306,174" fill="#b5761f"/><rect x="212" y="188" width="176" height="52" rx="8" fill="#f3d8b0" stroke="#b5761f" stroke-width="2"/><text x="300" y="212" font-size="15" text-anchor="middle" fill="#5a3a10">fclose 冲刷并关闭</text><text x="300" y="232" font-size="14" text-anchor="middle" fill="#5a3a10">不关可能丢最后一段</text><text x="320" y="270" font-size="14" text-anchor="middle" fill="#4d6f67">r 只读，w 清空写，a 追加，w+ 清空后读写</text></svg>`, caption: `fopen 拿到句柄，读操作经过缓冲区，最后 fclose 把缓冲刷下去并释放句柄。` },
      { t: `h2`, text: `常见坑` },
      { t: `ul`, items: [
        `用 char 接 fgetc 的返回值，遇到 0xFF 被当成 EOF，或者永远等不到 EOF。`,
        `fopen 后不判 NULL，路径写错时程序在下一行崩。`,
        `写完不 fclose，缓冲区里的内容没有落盘。`,
        `以为 fgets 会自动去掉行尾换行，结果打印时多出一个空行。`,
        `用 feof 控制循环，最后一行会被多处理一次。`
      ] },
      { t: `h2`, text: `任务` },
      { t: `ul`, items: [
        `写程序统计 demo.txt 的字节数和行数，空文件也跑一次。`,
        `用 fgets 读一个文件，给每行加上行号再打印。`,
        `故意打开一个不存在的文件，观察 perror 的输出，再补上错误处理。`,
        `用 a 模式追加一行，再用 r 模式读回，确认原内容还在。`
      ] },
      { t: `tip`, color: `green`, text: `本课一句话：fopen 拿到 FILE 指针先判空，fgetc 用 int 接、fgets 按行读，读完一定 fclose。` }
    ]
  },
  {
    id: `q17`,
    title: `第 17 课 · 文件（二）：文本与二进制`,
    blocks: [
      { t: `tip`, color: `blue`, text: `本课目标：会区分文本模式和二进制模式，用 fread、fwrite 存取结构体记录，用 fseek、ftell 定位和测量文件。` },
      { t: `h2`, text: `原理讲解` },
      { t: `p`, text: `文本模式写的是字符，换行在 Windows 上会变成两个字节；二进制模式 wb 和 rb 原样搬字节，不做转换。fwrite(ptr, size, count, fp) 写 count 个 size 字节的块，返回实际写成的块数；fread 的参数一样，返回值小于 count 就说明文件短了或出错了。` },
      { t: `p`, text: `fseek(fp, offset, whence) 把位置挪到指定处。whence 用 SEEK_SET 从头算，SEEK_CUR 从当前算，SEEK_END 从尾算；ftell 返回当前位置的 long。定长记录文件里，第 n 条记录的偏移是 n 乘 sizeof，可以跳过前面直接读某一条。` },
      { t: `p`, text: `直接把结构体整块写进文件，布局里可能有填充字节，换编译器或换平台就不一定对得上；自己练习可以，跨程序交换数据更稳的是逐字段写文本。写完要 fflush 或 fclose 再读，别在半截缓冲区上操作。` },
      { t: `h2`, text: `假设它能干什么` },
      { t: `ul`, items: [
        `存游戏存档和排行榜。`,
        `存传感器采样，每条长度固定。`,
        `快速跳到文件第 N 条记录，不用从头读。`,
        `把内存里的结构体数组整体落盘，下次启动读回。`
      ] },
      { t: `h2`, text: `演示：写两条记录，再跳到第二条` },
      { t: `p`, text: `先定义一条记录：一个 int 编号加十二字节名字。下面这段把两条记录按二进制写进 rec.bin。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
struct Rec { int id; char name[12]; };
int main(void) {
    struct Rec r[2] = {{1, "Li"}, {2, "Wang"}};
    FILE *fp = fopen("rec.bin", "wb");
    if (!fp) { perror("rec.bin"); return 1; }
    fwrite(r, sizeof r[0], 2, fp);
    fclose(fp);
    return 0;
}` },
      { t: `p`, text: `sizeof r[0] 是单条记录的字节数，2 是条数，两者相乘才是总字节。fwrite 返回 2 才算两条都写进去了。` },
      { t: `p`, text: `读的时候不必从头扫。SEEK_SET 加一个结构体大小，正好跳过第一条，落在第二条开头。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
struct Rec { int id; char name[12]; };
int main(void) {
    FILE *fp = fopen("rec.bin", "rb");
    if (!fp) { perror("rec.bin"); return 1; }
    fseek(fp, sizeof(struct Rec), SEEK_SET);
    struct Rec one;
    fread(&one, sizeof one, 1, fp);
    printf("%d %s\\n", one.id, one.name);
    fclose(fp);
    return 0;
}` },
      { t: `p`, text: `读到的是第二条，输出 2 Wang。这时 ftell 应该返回两倍的 sizeof，可以打印出来核对。fread 的返回值也要看，等于 0 就说明没读到完整一条。` },
      { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 270"><rect x="28" y="26" width="584" height="218" rx="14" fill="#eef6f4"/><text x="320" y="58" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">定长记录按字节偏移定位</text><text x="50" y="92" font-size="14" fill="#4d6f67">偏移 0</text><text x="50" y="158" font-size="14" fill="#4d6f67">偏移 16</text><rect x="124" y="74" width="48" height="42" rx="4" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><rect x="172" y="74" width="144" height="42" rx="4" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="148" y="101" font-size="14" text-anchor="middle" fill="#173d36">id</text><text x="244" y="101" font-size="14" text-anchor="middle" fill="#173d36">name 12 字节</text><rect x="124" y="140" width="48" height="42" rx="4" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><rect x="172" y="140" width="144" height="42" rx="4" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="148" y="167" font-size="14" text-anchor="middle" fill="#173d36">id</text><text x="244" y="167" font-size="14" text-anchor="middle" fill="#173d36">name 12 字节</text><text x="148" y="204" font-size="14" text-anchor="middle" fill="#4d6f67">记录 0</text><text x="148" y="224" font-size="14" text-anchor="middle" fill="#4d6f67">记录 1</text><path d="M380 161H324" stroke="#b5761f" stroke-width="3"/><polygon points="324,161 334,155 334,167" fill="#b5761f"/><text x="446" y="150" font-size="15" text-anchor="middle" fill="#5a3a10">fseek 到偏移 16</text><text x="446" y="174" font-size="14" text-anchor="middle" fill="#5a3a10">直接落在记录 1 开头</text><text x="320" y="236" font-size="14" text-anchor="middle" fill="#4d6f67">偏移按字节算，不是按记录条数算</text></svg>`, caption: `每条记录 16 字节；fseek 的第二个参数是字节偏移，跳一条就是加 16。` },
      { t: `h2`, text: `常见坑` },
      { t: `ul`, items: [
        `用 w 模式写二进制，遇到 0x0A 在某些平台被改写，文件长度对不上。`,
        `fread 不检查返回值，文件短了还拿未初始化的结构体去打印。`,
        `fseek 的偏移用元素个数而不是字节数，读出来错位。`,
        `结构体里有指针就整块写文件，读回来指针指向旧地址，解引用就崩。`,
        `写完不关文件就去读，缓冲区还没刷下去。`
      ] },
      { t: `h2`, text: `任务` },
      { t: `ul`, items: [
        `把两条 Rec 写成 rec.bin，用 ls -l 看大小，核对 sizeof(Rec) 乘 2。`,
        `用 fseek 和 ftell 读出文件里的最后一条记录。`,
        `把记录改成逐字段 fprintf 的文本格式，再写一个 fscanf 读回，比较两种文件大小。`,
        `故意把 fread 的条数改成 3，检查返回值并打印实际读到的条数。`
      ] },
      { t: `tip`, color: `green`, text: `本课一句话：二进制用 fwrite、fread 按块搬字节，fseek 按字节偏移定位，定长记录才能直接跳到第 N 条。` }
    ]
  },
  {
    id: `q18`,
    title: `第 18 课 · 位运算：掩码与移位`,
    blocks: [
      { t: `tip`, color: `blue`, text: `本课目标：掌握与、或、异或、取反和移位，会写置位、清位、翻转、检查四种掩码操作，并用一字节位图存开关。` },
      { t: `h2`, text: `原理讲解` },
      { t: `p`, text: `位运算直接改整数的二进制位。& 是与，| 是或，^ 是异或，~ 是取反；<< 左移，>> 右移。第 n 位从最低位数起，n 从 0 开始；1u << n 造出一个只有第 n 位是 1、其余位全是 0 的掩码。` },
      { t: `p`, text: `四个动作记牢：置位写 flags |= 1u << n；清位写 flags &= ~(1u << n)；翻转写 flags ^= 1u << n；检查写 (flags >> n) & 1u，或者 (flags & (1u << n)) != 0。清位那一句最容易被写成 &= (1u << n)，结果只留下那一位，其它全被抹掉。` },
      { t: `p`, text: `一个 unsigned char 有 8 位，可以当 8 个开关的位图。位图省内存，但每次读写都要移位和掩码。移位位数等于或超过类型宽度是未定义行为；右移有符号负数补什么由实现决定，做位操作优先用 unsigned。` },
      { t: `h2`, text: `假设它能干什么` },
      { t: `ul`, items: [
        `权限用一位表示读、一位表示写、一位表示执行。`,
        `八个 LED 的状态压进一个字节。`,
        `配置开关批量存取，一次读写一整组。`,
        `取一个整数的低字节或高字节。`
      ] },
      { t: `h2`, text: `演示：置位、清位、翻转、检查` },
      { t: `p`, text: `先把第 2 位和第 5 位置 1，再清掉第 5 位，最后翻转第 2 位并检查它。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
int main(void) {
    unsigned flags = 0;
    flags |= 1u << 2;
    flags |= 1u << 5;
    printf("set: %u\\n", flags);
    flags &= ~(1u << 5);
    printf("clear: %u\\n", flags);
    flags ^= 1u << 2;
    printf("toggle: %u, bit2=%u\\n", flags, (flags >> 2) & 1u);
    return 0;
}` },
      { t: `p`, text: `36 的二进制是 100100，第 2 位和第 5 位是 1；清掉第 5 位剩 4；再翻转第 2 位归零。每一步都只动目标那一位，其它位保持原样，这正是掩码的用处。` },
      { t: `p`, text: `把八个开关压进一字节，从高到低打印出来，一眼就能看出哪几位是开的。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
int main(void) {
    unsigned char bits = 0;
    int on[] = {1, 4, 6};
    for (int i = 0; i < 3; i++) bits |= (unsigned char)(1u << on[i]);
    for (int i = 7; i >= 0; i--) printf("%d", (int)((bits >> i) & 1u));
    printf("\\n");
    return 0;
}` },
      { t: `p`, text: `第 1、4、6 位置 1，输出 01010010。位图只有一字节，比八个 int 省，但每次读写都要移位和掩码，取值时别忘了把结果转成能打印的类型。` },
      { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250"><rect x="28" y="26" width="584" height="198" rx="14" fill="#eef6f4"/><text x="320" y="52" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">一个字节就是八个开关</text><rect x="64" y="82" width="54" height="44" rx="5" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><rect x="118" y="82" width="54" height="44" rx="5" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><rect x="172" y="82" width="54" height="44" rx="5" fill="#f3d8b0" stroke="#b5761f" stroke-width="2"/><rect x="226" y="82" width="54" height="44" rx="5" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><rect x="280" y="82" width="54" height="44" rx="5" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><rect x="334" y="82" width="54" height="44" rx="5" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><rect x="388" y="82" width="54" height="44" rx="5" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><rect x="442" y="82" width="54" height="44" rx="5" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="91" y="110" font-size="15" text-anchor="middle" fill="#173d36">0</text><text x="145" y="110" font-size="15" text-anchor="middle" fill="#173d36">0</text><text x="199" y="110" font-size="15" text-anchor="middle" fill="#5a3a10">1</text><text x="253" y="110" font-size="15" text-anchor="middle" fill="#173d36">0</text><text x="307" y="110" font-size="15" text-anchor="middle" fill="#173d36">0</text><text x="361" y="110" font-size="15" text-anchor="middle" fill="#173d36">1</text><text x="415" y="110" font-size="15" text-anchor="middle" fill="#173d36">0</text><text x="469" y="110" font-size="15" text-anchor="middle" fill="#173d36">0</text><text x="91" y="72" font-size="14" text-anchor="middle" fill="#4d6f67">bit7</text><text x="199" y="72" font-size="14" text-anchor="middle" fill="#b5761f">bit5</text><text x="361" y="72" font-size="14" text-anchor="middle" fill="#2a8c78">bit2</text><text x="469" y="72" font-size="14" text-anchor="middle" fill="#4d6f67">bit0</text><text x="280" y="162" font-size="15" text-anchor="middle" fill="#173d36">1u 左移 n 位，只有第 n 位是 1</text><text x="320" y="190" font-size="14" text-anchor="middle" fill="#4d6f67">置位用或，清位用与取反，翻转用异或，检查用与</text><text x="320" y="212" font-size="14" text-anchor="middle" fill="#4d6f67">第 5 位和第 2 位被点亮，其余位保持 0</text></svg>`, caption: `掩码里只有目标位是 1；与它做或、与取反做与、做异或，分别得到置位、清位、翻转。` },
      { t: `h2`, text: `常见坑` },
      { t: `ul`, items: [
        `用 1 << 31 造掩码，1 是 int，左移到符号位是未定义行为；写 1u。`,
        `清位写成 flags &= (1u << n)，把其它位全清了。`,
        `检查写成 if (flags & 1u << n == 0)，优先级错，先算 ==；加括号。`,
        `移位位数等于或超过类型宽度，结果未定义。`,
        `用有符号整数做右移，负数补什么由实现决定，跨平台结果不一致。`
      ] },
      { t: `h2`, text: `任务` },
      { t: `ul`, items: [
        `封装 set_bit、clear_bit、toggle_bit，参数用指针改 unsigned。`,
        `用一字节位图记录 8 个任务的完成状态，打印成 0101 形式。`,
        `取一个 unsigned 的低 8 位和高 8 位，分别打印。`,
        `把读、写、执行定义成三个位，组合后打印数值，并判断是否可写。`
      ] },
      { t: `tip`, color: `green`, text: `本课一句话：掩码就是只有目标位为 1 的数，置位用或、清位用与取反、翻转用异或、检查用与。` }
    ]
  },
  {
    id: `q19`,
    title: `第 19 课 · 多文件工程：头文件，static，extern`,
    blocks: [
      { t: `tip`, color: `blue`, text: `本课目标：会拆头文件和实现文件，用 include guard 防重复包含，用 static 收窄可见范围，用 extern 共享变量和函数。` },
      { t: `h2`, text: `原理讲解` },
      { t: `p`, text: `头文件放声明，.c 放定义。声明只告诉编译器名字和类型，不分配存储；定义才真正创建变量或给出函数体。include 是文本替换，同一个头文件被两个头文件间接包含时，内容会进来两次，所以要有 include guard：ifndef 检查宏，define 记下，endif 收尾。` },
      { t: `p`, text: `static 在文件作用域表示内部链接，这个名字只在本 .c 可见，别的文件链接不到；static 放在函数里的局部变量上，表示只初始化一次，之后每次调用都保留上次的值。extern 是声明，告诉编译器这个变量或函数定义在别处，链接时再找。` },
      { t: `p`, text: `编译分两步：每个 .c 单独编译成 .o，里面有符号表；链接器把 .o 拼起来，解析互相引用的符号。重复定义报 multiple definition，只有声明没有定义报 undefined reference。头文件里只放声明，变量定义放且只放一个 .c。` },
      { t: `h2`, text: `假设它能干什么` },
      { t: `ul`, items: [
        `把链表、文件、通讯录拆成模块，各写一个 .c。`,
        `公共变量在头文件里 extern，定义放一个实现文件。`,
        `工具函数加 static，不污染全局符号。`,
        `计数器用函数内 static 保存跨调用状态。`
      ] },
      { t: `h2`, text: `演示：一个头文件，一个实现文件` },
      { t: `p`, text: `config.h 只放声明，并用 include guard 包住。宏名用大写文件名，第一次包含时定义，第二次直接跳过。` },
      { t: `code`, lang: `c`, code: `/* config.h：只放声明 */
#ifndef CONFIG_H
#define CONFIG_H
extern int level;
#endif` },
      { t: `p`, text: `main.c 包含这个头文件，给出 level 的定义，再加一个只在本文件可见的 show。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
#include "config.h"
int level = 3;
static void show(void) { printf("level %d\\n", level); }
int main(void) {
    show();
    level++;
    show();
    return 0;
}` },
      { t: `p`, text: `头文件里的 extern 只是声明，level 的存储由 main.c 这一行定义分配；show 前面有 static，链接器看不到它，别的 .c 不能调用。编译命令是 gcc -std=c11 -Wall -Wextra main.c -o app。如果还有一个 util.c 也 include 了 config.h，它看到的是同一个 level，链接后共用一份。` },
      { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="28" y="24" width="584" height="252" rx="14" fill="#eef6f4"/><text x="320" y="56" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">头文件放声明，链接器负责把定义接上</text><rect x="232" y="70" width="176" height="38" rx="7" fill="#f3d8b0" stroke="#b5761f" stroke-width="2"/><text x="320" y="95" font-size="15" text-anchor="middle" fill="#5a3a10">config.h 声明 level</text><rect x="54" y="128" width="150" height="42" rx="7" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="129" y="155" font-size="15" text-anchor="middle" fill="#173d36">main.c 定义 level</text><rect x="436" y="128" width="150" height="42" rx="7" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="511" y="155" font-size="15" text-anchor="middle" fill="#173d36">util.c 只用 level</text><path d="M260 108L150 124" stroke="#b5761f" stroke-width="2.5"/><path d="M380 108L490 124" stroke="#b5761f" stroke-width="2.5"/><rect x="54" y="198" width="150" height="38" rx="7" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="129" y="222" font-size="15" text-anchor="middle" fill="#173d36">main.o</text><rect x="436" y="198" width="150" height="38" rx="7" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="511" y="222" font-size="15" text-anchor="middle" fill="#173d36">util.o</text><path d="M204 217H232" stroke="#2a8c78" stroke-width="3"/><polygon points="232,217 222,211 222,223" fill="#2a8c78"/><path d="M436 217H408" stroke="#2a8c78" stroke-width="3"/><polygon points="408,217 418,211 418,223" fill="#2a8c78"/><rect x="232" y="198" width="176" height="38" rx="7" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="320" y="222" font-size="15" text-anchor="middle" fill="#173d36">链接器解析符号</text><text x="320" y="264" font-size="14" text-anchor="middle" fill="#4d6f67">level 是全局符号；show 加了 static，链接器看不到</text></svg>`, caption: `两个 .c 各自编译，头文件里的声明让它们对同一个 level 达成一致，最后由链接器接上定义。` },
      { t: `h2`, text: `常见坑` },
      { t: `ul`, items: [
        `头文件里写 int level = 3;，两个 .c 都包含就重复定义；头文件只写 extern。`,
        `include guard 的宏名和别的头文件撞车，或者忘了 endif。`,
        `想要共享的函数加了 static，别的文件链接时找不到。`,
        `extern 声明了却没有任何 .c 定义，链接报 undefined reference。`,
        `改了结构体定义只重编一个 .c，别的 .o 还是旧布局，运行时错位。`
      ] },
      { t: `h2`, text: `任务` },
      { t: `ul`, items: [
        `把位操作封装成 bits.h 和 bits.c，主程序只 include 头文件。`,
        `给 bits.h 加 include guard，故意包含两次，确认还能编译。`,
        `在 bits.c 里加一个 static 辅助函数，尝试从 main.c 调用，看链接器报什么。`,
        `把 level 的定义移到单独的 config.c，main.c 只保留 extern 声明，重新编译。`
      ] },
      { t: `tip`, color: `green`, text: `本课一句话：头文件放声明、.c 放定义，include guard 防重复，static 收窄可见范围，extern 把定义留给链接器去找。` }
    ]
  },
  {
    id: `q20`,
    title: `第 20 课 · Makefile：从一条 gcc 到一条 make`,
    blocks: [
      { t: `tip`, color: `blue`, text: `本课目标：会写目标、依赖、Tab 缩进的命令，会用变量、模式规则和 clean，把一长串 gcc 收成一条 make。` },
      { t: `h2`, text: `原理讲解` },
      { t: `p`, text: `make 读当前目录的 Makefile，第一条规则的目标是默认目标。规则写成 目标 冒号 依赖，下一行是命令，命令必须以 Tab 开头。make 比较目标文件和依赖的修改时间，依赖更新才重跑命令；目标比所有依赖都新就跳过。` },
      { t: `p`, text: `变量用名字等于值定义，引用写 $(名字)。CC、CFLAGS、OBJS 是习惯名。自动变量里，$@ 是目标，$< 是第一个依赖，$^ 是所有依赖。模式规则 %.o 冒号 %.c 把每个 .c 到 .o 的命令写一次，make 自己套用。` },
      { t: `p`, text: `从一条 gcc 到 make：以前每次改一个文件都要手敲一长串，现在 make 只重编受影响的 .o 再链接。clean 不产出文件，只用来删生成物；make -n 只打印命令不执行，适合核对变量展开后的结果。` },
      { t: `h2`, text: `假设它能干什么` },
      { t: `ul`, items: [
        `三四个 .c 的小工程一键构建。`,
        `只改一个文件时跳过没变的编译。`,
        `把编译选项集中到 CFLAGS，换标准只改一处。`,
        `用 clean 清掉 .o 和可执行文件，重新全量构建。`
      ] },
      { t: `h2`, text: `演示：一份能增量构建的 Makefile` },
      { t: `p`, text: `下面这份 Makefile 把 main.c 和 util.c 编成 main.o、util.o，再链接成 app。命令行的缩进是真 Tab，不是空格。` },
      { t: `code`, lang: `text`, code: `CC = gcc
CFLAGS = -std=c11 -Wall -Wextra
TARGET = app
OBJS = main.o util.o
$(TARGET): $(OBJS)
	$(CC) $(CFLAGS) -o $(TARGET) $(OBJS)
%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@
clean:
	rm -f $(TARGET) *.o` },
      { t: `p`, text: `第一条规则的目标是 app，依赖是 OBJS 里的两个 .o；模式规则说明每个 .o 从同名 .c 编出来。$< 展开成当前这条规则的 .c，$@ 展开成 .o。clean 不写依赖，只负责删文件。` },
      { t: `p`, text: `第一次 make 依次编两个 .o 再链接；什么都没改时再 make，make 发现 app 比依赖新，直接跳过。` },
      { t: `code`, lang: `console`, code: `$ make
gcc -std=c11 -Wall -Wextra -c main.c -o main.o
gcc -std=c11 -Wall -Wextra -c util.c -o util.o
gcc -std=c11 -Wall -Wextra -o app main.o util.o
$ make
make: 'app' is up to date.
$ make clean
rm -f app *.o` },
      { t: `p`, text: `改 util.c 再 make，只会重编 util.o 再链接，main.o 不动。make -n 可以把将要执行的命令打印出来，不真正跑，变量展开对不对一看便知。` },
      { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="24" y="22" width="592" height="268" rx="14" fill="#eef6f4"/><text x="320" y="52" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">make 顺着依赖图只重跑该跑的那几步</text><rect x="66" y="72" width="104" height="40" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="118" y="98" font-size="15" text-anchor="middle" fill="#173d36">main.c</text><rect x="246" y="72" width="104" height="40" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="298" y="98" font-size="15" text-anchor="middle" fill="#173d36">util.c</text><rect x="426" y="72" width="104" height="40" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="478" y="98" font-size="15" text-anchor="middle" fill="#173d36">util.h</text><rect x="66" y="156" width="104" height="40" rx="6" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="118" y="182" font-size="15" text-anchor="middle" fill="#173d36">main.o</text><rect x="246" y="156" width="104" height="40" rx="6" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="298" y="182" font-size="15" text-anchor="middle" fill="#173d36">util.o</text><rect x="226" y="232" width="144" height="36" rx="6" fill="#f3d8b0" stroke="#b5761f" stroke-width="2"/><text x="298" y="256" font-size="15" text-anchor="middle" fill="#5a3a10">app</text><path d="M118 112V152" stroke="#2a8c78" stroke-width="3"/><polygon points="118,152 112,142 124,142" fill="#2a8c78"/><path d="M298 112V152" stroke="#2a8c78" stroke-width="3"/><polygon points="298,152 292,142 304,142" fill="#2a8c78"/><path d="M470 112L340 152" stroke="#7fa99f" stroke-width="2.5"/><polygon points="340,152 351,148 347,159" fill="#7fa99f"/><path d="M118 196L226 230" stroke="#2a8c78" stroke-width="2.5"/><path d="M298 196V228" stroke="#2a8c78" stroke-width="3"/><polygon points="298,228 292,218 304,218" fill="#2a8c78"/><text x="160" y="222" font-size="14" text-anchor="middle" fill="#4d6f67">链接</text><text x="320" y="286" font-size="14" text-anchor="middle" fill="#4d6f67">改 util.h 要带着 util.o 重编</text></svg>`, caption: `app 依赖两个 .o，.o 依赖对应的 .c；依赖时间更新，make 才执行那一条命令。` },
      { t: `h2`, text: `常见坑` },
      { t: `ul`, items: [
        `命令行用空格缩进，make 报 missing separator；必须 Tab。`,
        `变量引用写成 $CFLAGS 而不是 $(CFLAGS)，只展开成 C 加 FLAGS。`,
        `依赖漏了头文件，改了 .h 之后 make 认为 .o 还新，不重编。`,
        `clean 目标没有 .PHONY，目录里正好有叫 clean 的文件就不执行。`,
        `把命令写在目标前面，或者缩进错，make 根本不认。`
      ] },
      { t: `h2`, text: `任务` },
      { t: `ul`, items: [
        `把本课的 Makefile 抄下来，用两个 .c 文件跑 make，再改一行源码跑一次。`,
        `给 util.o 补上头文件依赖，改 util.h 后确认 make 会重编哪些目标。`,
        `加一个 run 目标，依赖 app 并执行 ./app；再想想要不要 .PHONY。`,
        `用 make -n 看 clean 和 app 分别会执行什么。`
      ] },
      { t: `tip`, color: `green`, text: `本课一句话：Makefile 用目标、依赖和 Tab 缩进的命令描述构建，make 只重跑依赖更新的那几步。` }
    ]
  },
  {
    id: `q21`,
    title: `第 21 课 · 调试（一）：编译警告与 gdb`,
    blocks: [
      { t: `tip`, color: `blue`, text: `本课目标：会把 -Wall、-Wextra、-Werror 和 -g 用对，读懂常见警告，并用 gdb 的断点、单步、print 和 bt 定位逻辑错误。` },
      { t: `h2`, text: `原理讲解` },
      { t: `p`, text: `编译器警告是免费的 bug 报告。-Wall 打开常用警告，-Wextra 再加一批，-Werror 把警告变成错误，让构建直接失败。调试构建加 -g 保留行号和变量名，优化用 -O0 或 -Og，避免变量被优化掉；发布才开 -O2。` },
      { t: `p`, text: `读警告按 文件、行、列 定位，方括号里是警告类别。unused variable 是声明了没用；unused parameter 是函数参数没用；sign-compare 是有符号和无符号比较；format 是 printf 占位符和参数类型对不上。先把 warning 清干净，再谈逻辑。` },
      { t: `p`, text: `gdb 流程：gdb ./app 进入，run 跑，break main 或 break 文件:行号 下断点，next 执行下一行但不进函数，step 进函数，print 变量看值，bt 看调用栈，continue 继续，quit 退出。断点停在可疑行，先看变量是不是你以为的值。` },
      { t: `h2`, text: `假设它能干什么` },
      { t: `ul`, items: [
        `编译输出一屏 warning，逐条修掉。`,
        `程序在某个函数里算出奇怪结果，断点看中间值。`,
        `段错误之后用 bt 看最后一段调用链。`,
        `循环多跑一轮，用 next 和 print 找边界。`
      ] },
      { t: `h2`, text: `演示：一个没有警告的越界` },
      { t: `p`, text: `下面这段用 -Wall -Wextra -Werror 也能编过，因为编译器不知道循环上界会走到 4。它读 a[4]，已经出了数组。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
int main(void) {
    int a[4] = {1, 2, 3, 4};
    int sum = 0;
    for (int i = 0; i <= 4; i++) {
        sum += a[i];
    }
    printf("%d\\n", sum);
    return 0;
}` },
      { t: `p`, text: `这种 bug 警告抓不到，要靠运行期观察。编译时加 -g 带上符号，再用 gdb 停在 main，单步走到循环里。` },
      { t: `code`, lang: `console`, code: `$ gcc -std=c11 -Wall -Wextra -Werror -g bug.c -o bug
$ gdb -q ./bug
(gdb) break main
Breakpoint 1 at bug.c:2.
(gdb) run
(gdb) next
(gdb) print sum
$1 = 0
(gdb) bt` },
      { t: `p`, text: `break main 停在入口，next 逐行，print 看变量。循环里连续 next 几次，就能看到 i 走到 4 时 sum 多加了 a[4]。bt 在崩溃时用，能看出是谁调用了当前函数；continue 让程序继续跑，quit 退出。` },
      { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="28" y="24" width="584" height="232" rx="14" fill="#eef6f4"/><text x="320" y="54" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">断点停住，变量和调用栈同时可见</text><rect x="48" y="74" width="280" height="132" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="64" y="100" font-size="14" fill="#4d6f67">bug.c</text><text x="64" y="126" font-size="14" fill="#173d36">2  int main(void) {</text><text x="64" y="148" font-size="14" fill="#173d36">5      sum += a[i];</text><text x="64" y="170" font-size="14" fill="#173d36">6  }</text><text x="64" y="192" font-size="14" fill="#173d36">7  printf(...);</text><circle cx="54" cy="121" r="5" fill="#c0392b"/><text x="348" y="100" font-size="14" fill="#4d6f67">变量</text><rect x="348" y="110" width="232" height="88" rx="8" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="364" y="136" font-size="14" fill="#173d36">i = 4</text><text x="364" y="160" font-size="14" fill="#173d36">sum = 10 加上了 a[4]</text><text x="364" y="184" font-size="14" fill="#173d36">a[0..3] = 1 2 3 4</text><text x="320" y="236" font-size="14" text-anchor="middle" fill="#4d6f67">run 启动，break 下断点，next 单步，print 看值，bt 看栈</text></svg>`, caption: `断点停在循环里，右边直接看 i 和 sum；bt 则回答「现在这段代码是被谁调用的」。` },
      { t: `h2`, text: `常见坑` },
      { t: `ul`, items: [
        `只开 -Wall 不开 -Wextra，漏掉未使用参数和符号比较。`,
        `加了 -Werror 却把旧警告留着，整个构建直接失败。`,
        `用 -O2 加 -g 调试图，变量被优化没，print 显示 optimized out。`,
        `断点下在声明行，变量还没赋值，看到的是垃圾。`,
        `把 next 和 step 混用，进到库函数里出不来；用 finish 返回。`
      ] },
      { t: `h2`, text: `任务` },
      { t: `ul`, items: [
        `把上面的 bug.c 用 -Wall -Wextra -Werror -g 编译，确认零警告，再用 gdb 找到越界那一轮。`,
        `写一个带未使用变量的程序，分别用 -Wall 和 -Wextra 编译，抄下警告原文。`,
        `在循环里下断点，用 print 观察 i 和 sum 每轮的变化。`,
        `故意让程序解引用空指针，崩溃后用 bt 看调用栈。`
      ] },
      { t: `tip`, color: `green`, text: `本课一句话：先把 -Wall -Wextra -Werror 的警告清干净，再用 gdb 的断点、单步和 print 看运行时的真实值。` }
    ]
  },
  {
    id: `q22`,
    title: `第 22 课 · 调试（二）：AddressSanitizer 与 Valgrind`,
    blocks: [
      { t: `tip`, color: `blue`, text: `本课目标：会用 -fsanitize=address 抓越界、释放后使用和泄漏，会跑 Valgrind，并能从报告第一行和调用栈找到出错行。` },
      { t: `h2`, text: `原理讲解` },
      { t: `p`, text: `AddressSanitizer 是编译器插桩：加 -fsanitize=address 和 -g 后，每次内存访问前后都检查，堆块两侧放红区。越界读写、释放后再用、重复释放、退出时仍泄漏的块，都会打印报告，带文件和行号，默认直接 abort。` },
      { t: `p`, text: `报告先看第一行类型：heap-buffer-overflow、heap-use-after-free、double-free、stack-buffer-overflow；再看 READ 或 WRITE 以及访问大小，最后看调用栈最上面那一帧，通常就是出错行。修完重新编译，直到报告消失。` },
      { t: `p`, text: `Valgrind 不用重编译，直接 valgrind --leak-check=full ./app，它在模拟的 CPU 上跑，慢很多。输出里 Invalid read 和 Invalid write 是非法访问，definitely lost 是确定泄漏的字节数；看 definitely lost 那几行下面的调用栈。开发时 ASan 快，交付前再用 Valgrind 扫一遍。` },
      { t: `h2`, text: `假设它能干什么` },
      { t: `ul`, items: [
        `数组多读一格，ASan 立刻指出行号。`,
        `malloc 后忘了 free，退出时报告泄漏。`,
        `释放后继续用指针，ASan 报 use-after-free。`,
        `没有源码的旧程序，用 Valgrind 查非法访问。`
      ] },
      { t: `h2`, text: `演示：故意越界读一格` },
      { t: `p`, text: `下面这段分配了 4 个 int，却读 a[4]，也就是第 5 个。普通编译可能只打印一个垃圾值，ASan 会指出读越过了那块堆内存。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
#include <stdlib.h>
int main(void) {
    int *a = malloc(4 * sizeof *a);
    if (!a) return 1;
    for (int i = 0; i < 4; i++) a[i] = i * i;
    printf("%d\\n", a[4]);
    free(a);
    return 0;
}` },
      { t: `p`, text: `编译时加上 -g，报告里才会出现 bug.c 第 7 行这样的位置。两份工具的输出格式不同，但都指向同一行。` },
      { t: `code`, lang: `console`, code: `$ gcc -std=c11 -g -fsanitize=address bug.c -o bug
$ ./bug
ERROR: AddressSanitizer: heap-buffer-overflow
READ of size 4
    #0 main bug.c:7
$ valgrind --leak-check=full ./bug
==1234== Invalid read of size 4
==1234==    at main (bug.c:7)` },
      { t: `p`, text: `上面两份输出都删掉了地址和进程号，只留关键行。先修第一个错误，因为后面的报告常常是它引发的连锁。修完把 a[4] 改回 a[3]，再跑一遍，确认报告不再出现。` },
      { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250"><rect x="28" y="24" width="584" height="202" rx="14" fill="#eef6f4"/><text x="320" y="54" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">堆块两侧的红区就是越界报警器</text><rect x="88" y="94" width="44" height="56" rx="5" fill="#f3d8b0" stroke="#b5761f" stroke-width="2"/><text x="110" y="88" font-size="14" text-anchor="middle" fill="#b5761f">红区</text><rect x="132" y="94" width="46" height="56" rx="4" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><rect x="178" y="94" width="46" height="56" rx="4" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><rect x="224" y="94" width="46" height="56" rx="4" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><rect x="270" y="94" width="46" height="56" rx="4" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="155" y="128" font-size="15" text-anchor="middle" fill="#173d36">0</text><text x="201" y="128" font-size="15" text-anchor="middle" fill="#173d36">1</text><text x="247" y="128" font-size="15" text-anchor="middle" fill="#173d36">4</text><text x="293" y="128" font-size="15" text-anchor="middle" fill="#173d36">9</text><rect x="316" y="94" width="70" height="56" rx="5" fill="#f3d8b0" stroke="#b5761f" stroke-width="2"/><text x="351" y="88" font-size="14" text-anchor="middle" fill="#b5761f">红区</text><text x="209" y="172" font-size="14" text-anchor="middle" fill="#4d6f67">a[0] 到 a[3] 是合法范围</text><text x="452" y="188" font-size="14" text-anchor="middle" fill="#5a3a10">a[4] 落进右红区</text><path d="M405 180L356 152" stroke="#b5761f" stroke-width="2.5"/><polygon points="356,152 367,155 361,164" fill="#b5761f"/><text x="320" y="214" font-size="14" text-anchor="middle" fill="#4d6f67">ASan 报 heap-buffer-overflow，Valgrind 报 Invalid read</text></svg>`, caption: `合法元素外面还有红区；读写落到红区，工具就能立刻报出越界，而不是等你看到随机崩溃。` },
      { t: `h2`, text: `常见坑` },
      { t: `ul`, items: [
        `只加 -fsanitize=address 不加 -g，报告只有地址没有行号。`,
        `看到第一份报告就以为只有这一个错，后面的错误被 abort 挡住。`,
        `用 ASan 编译发布版，运行变慢还依赖运行库。`,
        `Valgrind 报 still reachable 就慌，它不一定是泄漏，重点看 definitely lost。`,
        `释放后把指针置 NULL 之前又用了一次，use-after-free 照样报。`
      ] },
      { t: `h2`, text: `任务` },
      { t: `ul`, items: [
        `把 bug.c 用 ASan 跑一遍，抄下报告里的错误类型和行号，再把下标改回 3。`,
        `写一个 malloc 后不 free 的程序，分别用 ASan 和 Valgrind 看泄漏报告。`,
        `故意 free 两次，观察 double-free 报告，再修掉。`,
        `给一个越界写程序加 -fsanitize=address，确认它在哪一行 abort。`
      ] },
      { t: `tip`, color: `green`, text: `本课一句话：ASan 用编译插桩抓越界和释放后使用，Valgrind 不用重编译也能查非法访问和泄漏，报告先看第一行和调用栈顶。` }
    ]
  },
  {
    id: `q23`,
    title: `第 23 课 · 小项目（一）：通讯录的增删改查`,
    blocks: [
      { t: `tip`, color: `blue`, text: `本课目标：用 struct Contact 和动态数组搭出通讯录，完成添加、列出、查找、修改和删除，并说清 len 与 cap 的分工。` },
      { t: `h2`, text: `原理讲解` },
      { t: `p`, text: `通讯录用 struct Contact 存名字和电话，再用三个变量维护数组：Contact *data 指向一块 malloc 出来的连续内存，len 是已用条数，cap 是当前容量；len 到 cap 时把 cap 翻倍，用 realloc 扩块。realloc 可能搬家，必须用临时指针接返回值，失败时原块还在。` },
      { t: `p`, text: `添加先确保容量，再把字段拷进 data[len]，len 加一。列出从 0 到 len-1 打印。查找逐个 strcmp，返回下标或 -1。删除把目标后面的元素整体前移一格，len 减一；顺序不能反，先搬完再减长度。` },
      { t: `p`, text: `修改就是找到下标后重写字段。字符串用 snprintf 限长，别用 strcpy 往固定数组里硬拷。删除只改 len，不 free 单条记录，因为整块内存是一起分配的；程序结束时 free(data) 一次就够。` },
      { t: `h2`, text: `假设它能干什么` },
      { t: `ul`, items: [
        `存姓名和电话，按名字查找。`,
        `条数从几十涨到几百，容量自动翻倍。`,
        `删除一条后后面的记录前移，保持连续。`,
        `修改号码，不改变记录顺序。`
      ] },
      { t: `h2`, text: `演示：动态数组先长起来` },
      { t: `p`, text: `容量从 1 开始，每加一条先看满没满；满了就翻倍，把旧数据搬到新块。下面这段为了压进一屏，省掉了 malloc 和 realloc 的返回值检查。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
#include <stdlib.h>
typedef struct { char name[20]; char phone[16]; } Contact;
int main(void) {
    int len = 0, cap = 1; Contact *data = malloc(cap * sizeof *data);
    for (int i = 0; i < 3; i++) {
        if (len == cap) { cap *= 2; data = realloc(data, cap * sizeof *data); }
        snprintf(data[len].name, 20, "user%d", i); len++;
    }
    for (int i = 0; i < len; i++) printf("%s\\n", data[i].name);
    free(data); return 0;
}` },
      { t: `p`, text: `第三次添加时容量从 2 翻到 4，realloc 把旧块内容搬过去。真实代码要写 Contact *p = realloc(book, 新容量); if (!p) 处理失败; book = p;，不能直接覆盖原指针。` },
      { t: `p`, text: `查找、修改、删除都在数组上做。为了把注意力放在搬移上，这段用三个现成联系人；真实程序里 b 就是上一段那块动态内存。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
#include <string.h>
typedef struct { char name[20]; char phone[16]; } Contact;
int main(void) {
    Contact b[3] = {{"Li", "1"}, {"Wang", "2"}, {"Zhao", "3"}};
    int len = 3, at = -1;
    for (int i = 0; i < len; i++) if (strcmp(b[i].name, "Wang") == 0) at = i;
    if (at >= 0) { snprintf(b[at].phone, 16, "%s", "9999"); printf("new %s\\n", b[at].phone); }
    if (at >= 0) { for (int i = at; i < len - 1; i++) b[i] = b[i + 1]; len--; }
    for (int i = 0; i < len; i++) printf("%s %s\\n", b[i].name, b[i].phone);
    return 0;
}` },
      { t: `p`, text: `先找到 Wang 的下标，改掉号码，再把后面的 Zhao 搬到 Wang 的位置，len 减一。搬移从左往右，每一步覆盖的是已经处理过的位置，不会丢数据。输出 new 9999，然后打印 Li 和 Zhao。` },
      { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="26" y="22" width="588" height="238" rx="14" fill="#eef6f4"/><text x="320" y="52" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">删除就是后面的元素整体前移一格</text><rect x="84" y="76" width="76" height="44" rx="5" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><rect x="160" y="76" width="76" height="44" rx="5" fill="#f3d8b0" stroke="#b5761f" stroke-width="2"/><rect x="236" y="76" width="76" height="44" rx="5" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><rect x="312" y="76" width="76" height="44" rx="5" fill="#eef6f4" stroke="#7fa99f" stroke-width="2" stroke-dasharray="5 4"/><text x="122" y="104" font-size="15" text-anchor="middle" fill="#173d36">Li</text><text x="198" y="104" font-size="15" text-anchor="middle" fill="#5a3a10">Wang</text><text x="274" y="104" font-size="15" text-anchor="middle" fill="#173d36">Zhao</text><text x="350" y="104" font-size="14" text-anchor="middle" fill="#4d6f67">空闲</text><text x="418" y="104" font-size="14" fill="#4d6f67">len 3，cap 4</text><text x="84" y="148" font-size="14" fill="#4d6f67">删除 Wang 之后</text><rect x="84" y="170" width="76" height="44" rx="5" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><rect x="160" y="170" width="76" height="44" rx="5" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><rect x="236" y="170" width="76" height="44" rx="5" fill="#eef6f4" stroke="#7fa99f" stroke-width="2" stroke-dasharray="5 4"/><rect x="312" y="170" width="76" height="44" rx="5" fill="#eef6f4" stroke="#7fa99f" stroke-width="2" stroke-dasharray="5 4"/><text x="122" y="198" font-size="15" text-anchor="middle" fill="#173d36">Li</text><text x="198" y="198" font-size="15" text-anchor="middle" fill="#173d36">Zhao</text><text x="274" y="198" font-size="14" text-anchor="middle" fill="#4d6f67">空闲</text><text x="350" y="198" font-size="14" text-anchor="middle" fill="#4d6f67">空闲</text><text x="418" y="198" font-size="14" fill="#4d6f67">len 2，cap 4</text><path d="M236 124L236 166" stroke="#b5761f" stroke-width="2.5"/><polygon points="236,166 230,156 242,156" fill="#b5761f"/><text x="320" y="244" font-size="14" text-anchor="middle" fill="#4d6f67">只改 len，不单独 free 某一条；整块内存在最后释放一次</text></svg>`, caption: `Wang 被覆盖后，Zhao 前移一格；容量没变，只是 len 从 3 改成 2。` },
      { t: `h2`, text: `常见坑` },
      { t: `ul`, items: [
        `realloc 直接赋回原指针，失败时旧块地址丢了，整块内存泄漏。`,
        `len 和 cap 混用，把 cap 当条数打印，输出未初始化的记录。`,
        `删除时先 len 减一再搬移，循环上界少一格，最后一条没搬。`,
        `字符串用 strcpy 拷进 20 字节的 name，输入长了就写越界。`,
        `每条记录单独 free，最后又 free(data)，重复释放。`
      ] },
      { t: `h2`, text: `任务` },
      { t: `ul`, items: [
        `把 data、len、cap 包进 struct Book，加 init 和 free_book，容量从 2 开始，添加 5 条观察 cap 变化。`,
        `写 find_by_name，找不到返回 -1，找到打印整条记录。`,
        `写 remove_at，删除第一条和最后一条各测一次。`,
        `写 update_phone，按名字改号码，名字不存在时什么也不做。`
      ] },
      { t: `tip`, color: `green`, text: `本课一句话：动态数组用 data、len、cap 三个字段，满了翻倍 realloc，删除靠前移覆盖，最后整块释放一次。` }
    ]
  },
  {
    id: `q24`,
    title: `第 24 课 · 小项目（二）：通讯录存进文件与结课`,
    blocks: [
      { t: `tip`, color: `blue`, text: `本课目标：把通讯录保存到文本文件并在启动时读回，补上输入检查、内存释放和文件关闭，收束整门课的指针、内存与文件操作。` },
      { t: `h2`, text: `原理讲解` },
      { t: `p`, text: `保存用文本格式最省心：每条记录一行，fprintf 写名字和电话，fscanf 或 fgets 加 sscanf 读回。文本文件能直接看，字段变了也容易兼容；二进制更紧凑，但布局绑编译器。通讯录这种规模用文本足够。` },
      { t: `p`, text: `读文件要处理三种情况：文件不存在、行格式不对、字段太长。文件不存在不一定是错误，第一次运行可以当空通讯录；fgets 读一行，sscanf 返回成功字段数，等于 2 才加入；名字限长，用 %19s 给结束符留一格。` },
      { t: `p`, text: `退出前把动态数组 free 掉，把文件 fclose 掉；如果中途 malloc 失败，已经分配的部分也要释放。整门课串起来：链表和数组靠指针串，内存要 malloc 和 free 配对，文件用 FILE 指针读写，编译用 Makefile，出错用警告、gdb、ASan 查。` },
      { t: `h2`, text: `假设它能干什么` },
      { t: `ul`, items: [
        `启动时读 book.txt，退出时写回。`,
        `换一台机器把文件拷过去还能读。`,
        `文件被手改坏一行，程序跳过它继续读后面的。`,
        `把通讯录、链表、文件读写拼成一个小工具。`
      ] },
      { t: `h2`, text: `演示：存成一行一条，再读回来` },
      { t: `p`, text: `每条记录一行，名字和号码用空格分开。下面这段把两个联系人写进 book.txt。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
typedef struct { char name[20]; int phone; } Contact;
int main(void) {
    Contact c[2] = {{"Li", 1001}, {"Wang", 1002}};
    FILE *fp = fopen("book.txt", "w");
    if (!fp) { perror("book.txt"); return 1; }
    for (int i = 0; i < 2; i++) fprintf(fp, "%s %d\\n", c[i].name, c[i].phone);
    fclose(fp);
    return 0;
}` },
      { t: `p`, text: `fprintf 的返回值可以查，fclose 的返回值也可以查，磁盘满时写不进去；练习里先保证正常路径，真实工具要把失败报给用户。` },
      { t: `p`, text: `读的时候用 fscanf 按字段取，返回成功赋值的字段数。等于 2 才说明这一条完整，返回 EOF 或 1 都退出循环。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
typedef struct { char name[20]; int phone; } Contact;
int main(void) {
    Contact c[8]; int n = 0;
    FILE *fp = fopen("book.txt", "r");
    if (!fp) { perror("book.txt"); return 1; }
    while (n < 8 && fscanf(fp, "%19s %d", c[n].name, &c[n].phone) == 2) n++;
    fclose(fp);
    for (int i = 0; i < n; i++) printf("%s %d\\n", c[i].name, c[i].phone);
    return 0;
}` },
      { t: `p`, text: `%19s 给结束符留一格，防止名字写爆 20 字节的数组。n 到 8 时要扩容，或者直接用第 23 课那套动态数组的添加办法；读文件这条路径也要检查 malloc 的返回值。` },
      { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 270"><rect x="26" y="22" width="588" height="228" rx="14" fill="#eef6f4"/><text x="320" y="52" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">退出时落盘，启动时读回</text><rect x="48" y="86" width="150" height="86" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="123" y="112" font-size="15" text-anchor="middle" fill="#173d36">内存里的联系人数组</text><text x="123" y="134" font-size="14" text-anchor="middle" fill="#4d6f67">data、len、cap</text><text x="123" y="156" font-size="14" text-anchor="middle" fill="#4d6f67">联系人数组</text><rect x="250" y="76" width="140" height="106" rx="8" fill="#f3d8b0" stroke="#b5761f" stroke-width="2"/><text x="320" y="104" font-size="15" text-anchor="middle" fill="#5a3a10">book.txt</text><text x="320" y="128" font-size="14" text-anchor="middle" fill="#5a3a10">Li 1001</text><text x="320" y="150" font-size="14" text-anchor="middle" fill="#5a3a10">Wang 1002</text><text x="320" y="172" font-size="14" text-anchor="middle" fill="#5a3a10">一行一条</text><rect x="442" y="86" width="150" height="86" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="517" y="112" font-size="15" text-anchor="middle" fill="#173d36">下次启动</text><text x="517" y="134" font-size="14" text-anchor="middle" fill="#4d6f67">fopen 读</text><text x="517" y="156" font-size="14" text-anchor="middle" fill="#4d6f67">重新填进数组</text><path d="M202 128H246" stroke="#2a8c78" stroke-width="3"/><polygon points="246,128 236,122 236,134" fill="#2a8c78"/><path d="M394 128H438" stroke="#2a8c78" stroke-width="3"/><polygon points="438,128 428,122 428,134" fill="#2a8c78"/><text x="224" y="112" font-size="14" text-anchor="middle" fill="#4d6f67">fprintf</text><text x="416" y="112" font-size="14" text-anchor="middle" fill="#4d6f67">fscanf</text><text x="320" y="218" font-size="14" text-anchor="middle" fill="#4d6f67">退出前 free(data) 和 fclose(fp)，失败路径也要走到</text></svg>`, caption: `内存和文件之间来回搬：保存用 fprintf，读回用 fscanf，退出前把两块资源都归位。` },
      { t: `h2`, text: `常见坑` },
      { t: `ul`, items: [
        `保存时用 w 模式却忘了先读旧文件，一启动就把通讯录清空。`,
        `fscanf 的 %s 不写宽度，名字长了直接写越界。`,
        `用 feof 判断循环，最后一条读两遍。`,
        `退出路径多，每条都忘了 free 或 fclose；集中到一个清理出口。`,
        `文件格式改了字段顺序，旧文件读进来错位，没做版本标记。`
      ] },
      { t: `h2`, text: `任务` },
      { t: `ul`, items: [
        `给通讯录加 save 和 load，启动读 book.txt，退出写回，跑两次确认数据还在。`,
        `把 fscanf 换成 fgets 加 sscanf，跳过格式不对的行，打印跳过了几行。`,
        `故意把 book.txt 的一行改坏，确认程序不崩且能继续读后面的。`,
        `给整门课写一份 Makefile，把通讯录、链表、位操作三个练习编成三个可执行文件。`
      ] },
      { t: `tip`, color: `green`, text: `本课一句话：通讯录用动态数组存、文本文件持久化，读写都查返回值，退出前 free 和 fclose 各归位。` }
    ]
  }
] };
