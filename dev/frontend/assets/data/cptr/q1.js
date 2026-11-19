/* 喵站 · C 掌握 · 第 1–12 课正文（q01–q12）
 * 代码块均用 gcc -std=c11 -Wall -Wextra 实测；每课一张内存图。 */
window.MIAO_CPTR_Q1 = {
  chapters: [
    {
      id: `q01`,
      title: `第 1 课 · 指针是什么：地址，类型，解引用`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：说清指针里到底存了什么、为什么指针必须有类型、& 和 * 各做什么，以及 NULL 代表什么。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `程序运行时，每个变量都占着一块内存，每块内存都有编号，这个编号叫地址。写下 int x = 42; 之后，编译器给 x 留出 4 个字节，比如从 0x7ffd2a10 开始，到 0x7ffd2a13 结束。地址本身是一个整数，可以用 printf 的 %p 打印出来，具体值每次运行都可能不同。取地址用一元运算符 &，&x 得到 x 的起始地址，类型是 int *；这个运算只能用在确实有存储位置的表达式上。` },
        { t: `p`, text: `指针变量就是专门存地址的变量。int *p = &x; 这一行里，p 自己也在内存里占一块空间，但它存的内容是 x 的地址。解引用用 *：*p 的意思是顺着 p 里的地址找到那块内存，读和写都行。执行 *p = 7; 写的是 x 那 4 个字节，x 随之变成 7，p 里存的地址一个字节都没动。所以「改指针指向的内容」和「改指针自己」是两件事。` },
        { t: `p`, text: `指针的类型决定两件事：一次读写几个字节，以及把这些字节按什么格式解释。int * 读 4 个字节，char * 读 1 个字节，double * 读 8 个字节；同一个地址，用不同类型的指针去解引用，看到的数据完全不同。NULL 是空指针常量，表示不指向任何有效内存，判断它用 p == NULL 或 if (!p)。对 NULL 解引用是未定义行为，在常见系统上会立刻崩溃，不是「读到 0」那么温和。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `让函数修改调用方的变量，而不只是拿到一份副本。`,
          `用一段连续的内存装一批数据，靠指针在中间移动。`,
          `表示「暂时没有结果」，比如查找失败时返回 NULL。`,
          `把一块很大的数据交给别的函数时只传地址，不复制整块。`
        ] },
        { t: `h2`, text: `演示：声明、取地址、解引用` },
        { t: `p`, text: `下面这段把 x 的值、x 的地址、p 里存的地址、*p 读到的值依次打出来，最后通过 *p 改一次 x。%p 专门打印地址，%zu 打印 sizeof 的结果。` },
        { t: `code`, lang: `c`, code: `#include <stdio.h>
int main(void)
{
    int x = 42;
    int *p = &x;
    printf("x=%d &x=%p\\n", x, (void *)&x);
    printf("p=%p *p=%d\\n", (void *)p, *p);
    *p = 7;
    printf("x=%d\\n", x);
    return 0;
}` },
        { t: `p`, text: `指针本身的大小和它指向的类型无关，和机器有关：64 位系统上通常是 8 字节，32 位系统上通常是 4 字节。类型只影响解引用时读几个字节、加一时跳多远。下面这段用 sizeof 把两件事分开看，顺便走一遍空指针判断。` },
        { t: `code`, lang: `c`, code: `#include <stdio.h>
int main(void)
{
    int x = 1;
    int *p = &x;
    char *c = (char *)&x;
    printf("int=%zu 指针=%zu char=%zu\\n", sizeof(int), sizeof p, sizeof *c);
    p = NULL;
    if (p == NULL) printf("p 现在是空指针\\n");
    return 0;
}` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260"><rect x="40" y="20" width="560" height="220" rx="14" fill="#eef6f4"/><text x="320" y="52" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">指针里存的是地址，不是值</text><text x="96" y="92" font-size="15" fill="#4d6f67">栈</text><rect x="130" y="72" width="210" height="48" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="146" y="102" font-size="16" fill="#173d36">x</text><text x="324" y="102" font-size="18" font-weight="700" text-anchor="end" fill="#173d36">42</text><text x="130" y="140" font-size="14" fill="#4d6f67">地址 0x7ffd2a10</text><rect x="130" y="158" width="210" height="48" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="146" y="188" font-size="16" fill="#173d36">p</text><text x="324" y="188" font-size="15" text-anchor="end" fill="#b4552d">0x7ffd2a10</text><text x="130" y="226" font-size="14" fill="#4d6f67">p 自己的地址 0x7ffd2a18</text><path d="M344 182 C 420 182 420 96 348 96" fill="none" stroke="#b4552d" stroke-width="3"/><polygon points="348,96 360,90 360,102" fill="#b4552d"/><text x="430" y="140" font-size="15" fill="#b4552d">顺着地址找到 x</text><text x="430" y="164" font-size="14" fill="#4d6f67">*p 读的就是这 4 个字节</text></svg>`, caption: `p 里那串十六进制是 x 的地址，箭头才是「指向」的含义。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把指针里存的东西当成变量的值。打印 p 看到的是地址，要值得写 *p。`,
          `用未初始化的指针。int *p; 里的内容是栈上残留，*p = 1 写到哪里全看运气。`,
          `在 printf 里把地址交给 %d。地址要用 %p，并先转换成 void *。`,
          `把 NULL 当成普通的 0 来解引用。空指针只能比较，不能读也不能写。`,
          `以为指针类型可以随便换。换类型就换了每次读写的字节数和解释方式。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `声明 int x = 10; 和 int *p = &x;，分别打印 x、&x、p、*p，说出哪两个值相等。`,
          `通过 *p 把 x 改成 99，再打印 x，确认没有直接给 x 赋值。`,
          `声明 char c = 'A'; 和 char *q = &c;，打印 sizeof(int) 与 sizeof *q，解释差在哪。`,
          `写一个程序：把空指针赋给 p，先判断再解引用，观察不加判断时会发生什么。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：指针是一个存地址的变量，类型决定顺着地址读几个字节，NULL 表示这个地址不能用。` }
      ]
    },
    {
      id: `q02`,
      title: `第 2 课 · 指针指向数组：数组名就是地址`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：理解数组名为什么能当指针用、a[i] 与 *(a+i) 为什么等价，并能只用指针遍历数组。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `int a[5] 在内存里是 5 个连续的 int，a[0] 的地址最低，a[4] 最高。数组名 a 在大多数表达式里会自动转换成指向首元素的指针，值等于 &a[0]，类型是 int *。所以 int *p = a; 合法，p 和 a 指向同一格。这种转换是编译器自动做的，不需要写 &。` },
        { t: `p`, text: `下标运算不是独立的语法，a[i] 会被编译器翻译成 *(a + i)。这里的加法按元素大小跳，a + i 的地址等于 a 的地址加 i 乘 sizeof(int)。因此 a[0] 与 *a、a[1] 与 *(a + 1) 完全等价，p[i] 与 *(p + i) 也等价，下标只是写法更短。` },
        { t: `p`, text: `指针遍历的惯用法是 p 从 a 开始，每轮 p++ 往后挪一格，条件写 p < a + 5。a + 5 是最后一个元素的下一个位置，可以拿来比较，但不能解引用。sizeof(a) 是数组总字节数，这里是 20；sizeof(p) 是指针本身的大小，64 位机器上通常是 8。数组名只有放在 sizeof 和 & 后面时不退化，这一点很关键。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `把数组交给函数时不用复制整块，只传首地址。`,
          `在函数里顺着指针修改调用方数组的每一格。`,
          `用一段连续内存当队列、缓冲区或查找表。`,
          `让 p[i] 和 *(p+i) 两种写法按场合互换。`
        ] },
        { t: `h2`, text: `演示：下标与指针两种写法` },
        { t: `p`, text: `第一段把同一格的两种写法并排打出来，顺便看 sizeof 在数组名和指针上的差别；第二段只用指针把数组走一遍求和。` },
        { t: `code`, lang: `c`, code: `#include <stdio.h>
int main(void)
{
    int a[5] = {10, 20, 30, 40, 50};
    int *p = a;
    for (int i = 0; i < 5; i++)
        printf("a[%d]=%d *(a+%d)=%d\\n", i, a[i], i, *(a + i));
    printf("sizeof a=%zu sizeof p=%zu\\n", sizeof a, sizeof p);
    printf("p[2]=%d\\n", p[2]);
    return 0;
}` },
        { t: `code`, lang: `c`, code: `#include <stdio.h>
#include <stddef.h>
int main(void)
{
    int a[5] = {10, 20, 30, 40, 50};
    int sum = 0;
    for (int *p = a; p < a + 5; p++)
        sum += *p;
    printf("sum=%d, 指针走了 %td 个元素\\n", sum, (a + 5) - a);
    return 0;
}` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260"><rect x="40" y="20" width="560" height="220" rx="14" fill="#eef6f4"/><text x="320" y="50" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">a 就是首元素地址，a+i 往后第 i 格</text><text x="50" y="130" font-size="18" fill="#b4552d">p</text><line x1="64" y1="124" x2="80" y2="124" stroke="#b4552d" stroke-width="3"/><polygon points="80,124 70,118 70,130" fill="#b4552d"/><rect x="82" y="100" width="90" height="54" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="127" y="124" font-size="18" text-anchor="middle" fill="#173d36">10</text><text x="127" y="142" font-size="14" text-anchor="middle" fill="#4d6f67">a[0]</text><rect x="178" y="100" width="90" height="54" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="223" y="124" font-size="18" text-anchor="middle" fill="#173d36">20</text><text x="223" y="142" font-size="14" text-anchor="middle" fill="#4d6f67">a[1]</text><rect x="274" y="100" width="90" height="54" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="319" y="124" font-size="18" text-anchor="middle" fill="#173d36">30</text><text x="319" y="142" font-size="14" text-anchor="middle" fill="#4d6f67">a[2]</text><rect x="370" y="100" width="90" height="54" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="415" y="124" font-size="18" text-anchor="middle" fill="#173d36">40</text><text x="415" y="142" font-size="14" text-anchor="middle" fill="#4d6f67">a[3]</text><rect x="466" y="100" width="90" height="54" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="511" y="124" font-size="18" text-anchor="middle" fill="#173d36">50</text><text x="511" y="142" font-size="14" text-anchor="middle" fill="#4d6f67">a[4]</text><text x="127" y="176" font-size="14" text-anchor="middle" fill="#4d6f67">0x1000</text><text x="223" y="176" font-size="14" text-anchor="middle" fill="#4d6f67">0x1004</text><text x="319" y="176" font-size="14" text-anchor="middle" fill="#4d6f67">0x1008</text><text x="415" y="176" font-size="14" text-anchor="middle" fill="#4d6f67">0x100c</text><text x="511" y="176" font-size="14" text-anchor="middle" fill="#4d6f67">0x1010</text><text x="320" y="208" font-size="15" text-anchor="middle" fill="#173d36">a+i 的地址 = 0x1000 + i * 4，int 占 4 字节</text><text x="320" y="230" font-size="14" text-anchor="middle" fill="#4d6f67">sizeof a = 20，sizeof p = 8</text></svg>`, caption: `五格 int 紧挨着放，指针只要记住第一格的地址，就能靠加法走到任何一格。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `对数组名用自增。a++ 编不过，数组名不是可以改的变量。`,
          `在函数里写 sizeof(a) 求长度。数组参数已经退化成指针，得到的是指针大小。`,
          `循环条件写成 p <= a + 5 再解引用。a + 5 可以比较，不能读。`,
          `以为 a 和 &a 完全一样。值相同，类型不同：&a 加 1 会跳过整个数组。`,
          `把 p 指向数组中间后，还用 p[0] 当第一个元素。p[0] 永远是 p 当前指向的那格。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `用 a[i] 和 *(a+i) 两种写法打印同一个数组，确认每行两个数相等。`,
          `把演示里的求和循环改成从后往前，用 p-- 走回 a。`,
          `写一个函数，参数写成 int *p 和 int n，把数组每个元素加 1，在主函数里打印结果。`,
          `打印 a、&a、&a[0] 三个值，解释哪些相等、类型各是什么。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：数组名在表达式里就是首元素地址，a[i] 只是 *(a+i) 的另一种写法。` }
      ]
    },
    {
      id: `q03`,
      title: `第 3 课 · 指针运算：加一到底加多少`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：弄清指针加减的步长由元素大小决定、两个指针相减得到什么，以及什么情况下越界属于未定义行为。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `指针加法不是加一个字节，而是加一个元素。p + 1 的新地址等于 p 的地址加上 sizeof(*p)。int * 加 1 走 4 字节，char * 加 1 走 1 字节，double * 加 1 走 8 字节。编译器根据指针的静态类型算出这个步长，运行时不需要额外信息。` },
        { t: `p`, text: `两个同类型的指针相减，得到它们之间隔了几个元素，结果的类型是 ptrdiff_t，定义在 stddef.h，打印用 %td。相减只对同一数组或同一块分配内存里的两个指针有意义；两个不相干变量的地址相减，标准没有定义结果。` },
        { t: `p`, text: `指针可以指到数组最后一个元素的下一个位置，这个位置叫 one past the end，用来做循环终点正合适，但不能解引用。再往后加、减或读越界元素都属于未定义行为：可能读到相邻变量，可能当场崩溃，也可能看起来一切正常。未定义行为不等于一定报错，这是 C 最容易骗人的地方。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `用 p + 1 跳到下一格，不必每次写下标。`,
          `用两个指针相减算出一段数据的长度。`,
          `在缓冲区里按固定步长扫描或倒着遍历。`,
          `把「当前处理到哪」保存成一个指针，随处理进度移动。`
        ] },
        { t: `h2`, text: `演示：步长与差值` },
        { t: `p`, text: `第一段把 p 加 1 前后的地址打出来，再做两次减法：一次转成 char * 看字节差，一次直接相减看元素差。第二段用两个指针相减算元素个数，再用指针走到末尾。` },
        { t: `code`, lang: `c`, code: `#include <stdio.h>
int main(void)
{
    int a[4] = {1, 2, 3, 4};
    int *p = a;
    printf("p=%p p+1=%p\\n", (void *)p, (void *)(p + 1));
    printf("字节差=%td\\n", (char *)(p + 1) - (char *)p);
    printf("元素差=%td\\n", (p + 1) - p);
    printf("a[2]=%d, *(p+2)=%d\\n", a[2], *(p + 2));
    return 0;
}` },
        { t: `code`, lang: `c`, code: `#include <stdio.h>
#include <stddef.h>
int main(void)
{
    int a[6] = {5, 4, 3, 2, 1, 0};
    int *first = a, *last = a + 6;
    ptrdiff_t n = last - first;
    printf("一共 %td 个元素\\n", n);
    for (int *p = a; p < last; p++)
        printf("%d ", *p);
    printf("\\n"); return 0;
}` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260"><rect x="40" y="20" width="560" height="220" rx="14" fill="#eef6f4"/><text x="320" y="46" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">int 指针加 1，地址加 4 字节</text><text x="136" y="80" font-size="16" text-anchor="middle" fill="#b4552d">p</text><text x="256" y="80" font-size="16" text-anchor="middle" fill="#b4552d">p+1</text><line x1="136" y1="88" x2="136" y2="116" stroke="#b4552d" stroke-width="3"/><polygon points="136,116 130,106 142,106" fill="#b4552d"/><line x1="256" y1="88" x2="256" y2="116" stroke="#b4552d" stroke-width="3"/><polygon points="256,116 250,106 262,106" fill="#b4552d"/><line x1="146" y1="96" x2="246" y2="96" stroke="#b4552d" stroke-width="2"/><text x="196" y="90" font-size="14" text-anchor="middle" fill="#b4552d">+4 字节</text><rect x="80" y="118" width="112" height="54" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="136" y="142" font-size="18" text-anchor="middle" fill="#173d36">1</text><text x="136" y="160" font-size="14" text-anchor="middle" fill="#4d6f67">[0]</text><rect x="200" y="118" width="112" height="54" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="256" y="142" font-size="18" text-anchor="middle" fill="#173d36">2</text><text x="256" y="160" font-size="14" text-anchor="middle" fill="#4d6f67">[1]</text><rect x="320" y="118" width="112" height="54" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="376" y="142" font-size="18" text-anchor="middle" fill="#173d36">3</text><text x="376" y="160" font-size="14" text-anchor="middle" fill="#4d6f67">[2]</text><rect x="440" y="118" width="112" height="54" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="496" y="142" font-size="18" text-anchor="middle" fill="#173d36">4</text><text x="496" y="160" font-size="14" text-anchor="middle" fill="#4d6f67">[3]</text><text x="136" y="196" font-size="14" text-anchor="middle" fill="#4d6f67">0x2000</text><text x="256" y="196" font-size="14" text-anchor="middle" fill="#4d6f67">0x2004</text><text x="376" y="196" font-size="14" text-anchor="middle" fill="#4d6f67">0x2008</text><text x="496" y="196" font-size="14" text-anchor="middle" fill="#4d6f67">0x200c</text><text x="320" y="224" font-size="14" text-anchor="middle" fill="#173d36">p 到 p+1 是 1 个元素，不是 1 个字节</text></svg>`, caption: `同一个「加一」，int 指针跨 4 字节，char 指针只跨 1 字节。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `以为 p + 1 的地址一定加 1。先看它指向什么类型，int 是 4，char 是 1。`,
          `用 %d 打印两个指针的差。差是 ptrdiff_t，应该用 %td。`,
          `拿两个不同数组的指针相减。结果没有定义，不能当成真实距离。`,
          `解引用 a + 5。它可以参与比较，但不是有效元素。`,
          `把元素个数和字节数混着用。指针差是元素数，sizeof 结果是字节数。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `声明一个 double 数组，打印 p 与 p+1 的地址，算出这台机器上一步跨几字节。`,
          `用两个指针相减求一个 int 数组的元素个数，再用循环打印每个元素。`,
          `把演示里的 last 改成 a + 3，观察循环少走了哪些元素。`,
          `写一个循环，让 p 从数组末尾走回开头，倒序打印全部元素。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：指针加减按元素大小跳，两个指针相减得到元素个数，越界一步都不能读。` }
      ]
    }
  ]
};
