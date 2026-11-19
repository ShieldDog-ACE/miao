/* 喵站 · C 掌握 · 第 4–12 课（q3 分部）
 * 代码块均用 gcc -std=c11 -Wall -Wextra 编译并运行过；每课一张内存图。 */
window.MIAO_CPTR_Q3 = { chapters: [
  {
    id: `q04`,
    title: `第 4 课 · 指针进函数：传值，传地址，返回指针`,
    blocks: [
      { t: `tip`, color: `blue`, text: `本课目标：弄清 C 的函数为什么改不了实参、怎样把地址传进去改调用方的变量，以及为什么不能把局部变量的地址返回出去。` },
      { t: `h2`, text: `原理讲解` },
      { t: `p`, text: `C 的函数参数一律传值。调用 swap(x, y) 时，编译器把 x 和 y 的值各复制一份交给形参，函数里的 a 和 b 是两块新内存，交换它们只动副本，函数返回后副本随栈帧消失，调用方的 x、y 一个字节都没变。这是语言规定，不是编译器优化。` },
      { t: `p`, text: `想让函数改调用方，就要把变量的地址传进去，形参写成指针。swap(&x, &y) 复制的是两个地址，函数里 *a 和 *b 顺着地址读写调用方那两块内存，所以交换生效。形参 a 自己也是局部变量，它存的是 x 的地址；a 的地址和 x 的地址不是一回事。数组传参也是这个道理：数组名退化成首元素地址，函数里 p[i] 改的就是原数组。` },
      { t: `p`, text: `函数也可以返回指针，但只能返回函数结束后仍然活着的东西：调用方传进来的地址、static 变量的地址，或者堆上分配的内存。返回局部变量的地址是典型错误：局部变量在栈帧里，函数一返回栈帧就回收，那个地址变成悬垂指针，调用方再读就是未定义行为。编译器通常只给一条警告，照样生成可执行文件，别把警告当没事。static 变量的生命周期是整个程序，地址一直有效，但它只有一份，多次调用会共用。` },
      { t: `h2`, text: `假设它能干什么` },
      { t: `ul`, items: [
        `交换两个变量，或把计算结果写回调用方的变量。`,
        `用输出参数一次带回多个结果，比如商和余数。`,
        `把数组交给函数原地修改，不复制整块。`,
        `返回调用方给的缓冲区地址，让调用链继续往下传。`
      ] },
      { t: `h2`, text: `演示：传值与传地址` },
      { t: `p`, text: `第一段并排放两个 swap：一个收 int，一个收 int *。传值版本交换的是副本，传地址版本才动到 main 里的 x 和 y。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
void swap_bad(int a, int b) { int t = a; a = b; b = t; }
void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }
int main(void)
{
    int x = 1, y = 2;
    swap_bad(x, y);
    printf("传值后 x=%d y=%d\\n", x, y);
    swap(&x, &y);
    printf("传地址后 x=%d y=%d\\n", x, y);
    return 0;
}` },
      { t: `p`, text: `第二段演示怎样安全地返回指针：larger 返回两个参数中较大的那个的地址，counter 返回 static 变量的地址。两者在函数返回后都还有效。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
int *larger(int *a, int *b) { return *a > *b ? a : b; }
int *counter(void) { static int n = 0; return &n; }
int main(void)
{
    int x = 3, y = 9;
    printf("较大的值 %d\\n", *larger(&x, &y));
    *counter() += 1;
    printf("计数器 %d\\n", *counter());
    return 0;
}` },
      { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="30" y="20" width="580" height="260" rx="14" fill="#eef6f4"/><text x="320" y="52" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">传地址：形参里存的是调用方变量的地址</text><rect x="50" y="80" width="200" height="170" rx="10" fill="#ffffff" stroke="#7fa99f" stroke-width="2"/><text x="150" y="106" font-size="16" text-anchor="middle" fill="#4d6f67">main 的栈帧</text><rect x="70" y="120" width="160" height="42" rx="7" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="82" y="147" font-size="16" fill="#173d36">x</text><text x="218" y="147" font-size="17" font-weight="700" text-anchor="end" fill="#173d36">1</text><text x="70" y="180" font-size="14" fill="#4d6f67">地址 0x7ffd1000</text><rect x="70" y="190" width="160" height="42" rx="7" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="82" y="217" font-size="16" fill="#173d36">y</text><text x="218" y="217" font-size="17" font-weight="700" text-anchor="end" fill="#173d36">2</text><text x="70" y="250" font-size="14" fill="#4d6f67">地址 0x7ffd1004</text><rect x="350" y="80" width="230" height="170" rx="10" fill="#ffffff" stroke="#7fa99f" stroke-width="2"/><text x="465" y="106" font-size="16" text-anchor="middle" fill="#4d6f67">swap 的栈帧</text><rect x="370" y="120" width="190" height="42" rx="7" fill="#fdf1ea" stroke="#b4552d" stroke-width="2"/><text x="382" y="147" font-size="16" fill="#173d36">a</text><text x="548" y="147" font-size="15" text-anchor="end" fill="#b4552d">0x7ffd1000</text><rect x="370" y="190" width="190" height="42" rx="7" fill="#fdf1ea" stroke="#b4552d" stroke-width="2"/><text x="382" y="217" font-size="16" fill="#173d36">b</text><text x="548" y="217" font-size="15" text-anchor="end" fill="#b4552d">0x7ffd1004</text><path d="M348 141 C 300 141 280 141 234 141" fill="none" stroke="#b4552d" stroke-width="3"/><polygon points="234,141 244,135 244,147" fill="#b4552d"/><path d="M348 211 C 300 211 280 211 234 211" fill="none" stroke="#b4552d" stroke-width="3"/><polygon points="234,211 244,205 244,217" fill="#b4552d"/><text x="292" y="130" font-size="14" text-anchor="middle" fill="#b4552d">*a 读写这里</text><text x="292" y="238" font-size="14" text-anchor="middle" fill="#b4552d">*b 读写这里</text><text x="320" y="274" font-size="14" text-anchor="middle" fill="#4d6f67">函数里改 *a 和 *b，左边两格跟着变；改 a 和 b 自己，左边不变</text></svg>`, caption: `两个栈帧各有一份地址；地址相同，所以解引用落在同一块内存上。` },
      { t: `h2`, text: `常见坑` },
      { t: `ul`, items: [
        `以为形参和实参是同一块内存。名字不同，位置也不同，改形参不影响实参。`,
        `调用时漏写 &。swap(x, y) 把整数当地址传，编译器会报类型不匹配。`,
        `在函数里写 a = b 而不是 *a = *b。改的是形参里的地址，调用方毫无变化。`,
        `返回局部数组或局部变量的地址。函数一返回，那块栈内存就失效。`,
        `拿到返回的指针不判 NULL。返回堆内存时分配可能失败，后面单独一课会讲。`
      ] },
      { t: `h2`, text: `任务` },
      { t: `ul`, items: [
        `写 swap(int *, int *)，在 main 里交换两个数并打印前后值。`,
        `写 divmod(int a, int b, int *q, int *r)，用两个输出参数带回商和余数，处理 b 为 0。`,
        `写一个返回局部变量地址的函数，用 -Wall 编译看警告，说明为什么不能解引用。`,
        `写 max_index(const int *a, int n)，返回最大元素的下标，n 为 0 时返回 -1。`
      ] },
      { t: `tip`, color: `green`, text: `本课一句话：C 只传值，想改调用方就传地址；返回指针前先确认那块内存在函数结束后还活着。` }
    ]
  },
  {
    id: `q05`,
    title: `第 5 课 · 字符串与字符指针：零结尾的约定`,
    blocks: [
      { t: `tip`, color: `blue`, text: `本课目标：分清 char 数组和 char 指针、记住字符串末尾的零字节约定，并亲手写出 strlen 与 strcpy 的最小版本。` },
      { t: `h2`, text: `原理讲解` },
      { t: `p`, text: `C 没有独立的字符串类型。所谓字符串，是一段连续的 char，最后一个有效字符后面再放一个值为 0 的字节，写作 '\\0'。这个 0 不是字符 '0'，字符 '0' 的值是 48；它是整数值 0，二进制八位全零。所有标准库字符串函数都从首字符往后扫，遇到第一个 0 就停，长度、复制、比较全靠这条约定。` },
      { t: `p`, text: `char a[] = "cat"; 定义数组，编译器算出 4 个字节：c、a、t、0，内容可以改。char *p = "cat"; 定义指针，p 指向程序里存放字面量的只读区域，字符串本身不在 p 里；sizeof a 是 4，sizeof p 是指针大小。字符串字面量只读，通过指针改它会触发段错误或更隐蔽的未定义行为，所以现代写法把 p 声明成 const char *。` },
      { t: `p`, text: `strlen 从首字符走到第一个 0，返回经过的字节数，不把 0 算进去；strcpy 从源地址逐字节复制，连 0 一起复制，所以目标缓冲区至少要有 strlen(src) 加 1 字节。两个函数的手写版本都很短，短到能看清约定本身；标准库版本只是做了更多优化，语义仍是这条约定。` },
      { t: `h2`, text: `假设它能干什么` },
      { t: `ul`, items: [
        `处理命令行参数、文件名、用户输入的一行文本。`,
        `把字符串存进固定大小的 char 数组，按需截断或拼接。`,
        `用 char * 在字符串内部移动，找分隔符或子串。`,
        `把只读的字面量传给函数，函数只读不写。`
      ] },
      { t: `h2`, text: `演示：数组、指针与零结尾` },
      { t: `p`, text: `第一段对比数组和指针：sizeof 差多少，strlen 为什么都等于 3，末尾那一格是不是 0。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
#include <string.h>
int main(void)
{
    char a[] = "cat";
    const char *p = "cat";
    printf("sizeof a=%zu strlen a=%zu\\n", sizeof a, strlen(a));
    printf("sizeof p=%zu strlen p=%zu\\n", sizeof p, strlen(p));
    printf("a[3]=%d p[3]=%d\\n", a[3], p[3]);
    return 0;
}` },
      { t: `p`, text: `第二段不看标准库，自己走一遍 strlen 和 strcpy。复制循环的条件就是赋值表达式的值，复制到 0 时循环自然停下。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
size_t my_strlen(const char *s) { const char *p = s; while (*p) p++; return (size_t)(p - s); }
char *my_strcpy(char *d, const char *s) { char *r = d; while ((*d++ = *s++)) { } return r; }
int main(void)
{
    char buf[16];
    my_strcpy(buf, "hi");
    printf("%s %zu\\n", buf, my_strlen(buf));
    return 0;
}` },
      { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="30" y="20" width="580" height="240" rx="14" fill="#eef6f4"/><text x="320" y="52" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">数组装字符，指针只装首字符的地址</text><text x="60" y="88" font-size="16" fill="#4d6f67">栈上的 char a[4]</text><rect x="60" y="102" width="76" height="50" rx="7" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="98" y="134" font-size="18" text-anchor="middle" fill="#173d36">c</text><rect x="140" y="102" width="76" height="50" rx="7" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="178" y="134" font-size="18" text-anchor="middle" fill="#173d36">a</text><rect x="220" y="102" width="76" height="50" rx="7" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="258" y="134" font-size="18" text-anchor="middle" fill="#173d36">t</text><rect x="300" y="102" width="76" height="50" rx="7" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="338" y="134" font-size="18" text-anchor="middle" fill="#173d36">0</text><text x="98" y="174" font-size="14" text-anchor="middle" fill="#4d6f67">a[0]</text><text x="178" y="174" font-size="14" text-anchor="middle" fill="#4d6f67">a[1]</text><text x="258" y="174" font-size="14" text-anchor="middle" fill="#4d6f67">a[2]</text><text x="338" y="174" font-size="14" text-anchor="middle" fill="#b4552d">a[3] 零字节</text><text x="60" y="212" font-size="14" fill="#4d6f67">sizeof a = 4，末尾这一格也算在数组里</text><rect x="430" y="94" width="140" height="46" rx="7" fill="#ffffff" stroke="#b4552d" stroke-width="2"/><text x="444" y="122" font-size="16" fill="#173d36">p</text><text x="556" y="122" font-size="15" text-anchor="end" fill="#b4552d">0x400600</text><path d="M492 140 C 492 176 492 190 492 204" fill="none" stroke="#b4552d" stroke-width="3"/><polygon points="492,204 486,194 498,194" fill="#b4552d"/><rect x="424" y="208" width="176" height="42" rx="7" fill="#fff7ec" stroke="#b4552d" stroke-width="2"/><text x="512" y="235" font-size="15" text-anchor="middle" fill="#b4552d">只读区 c a t 0</text><text x="512" y="270" font-size="14" text-anchor="middle" fill="#4d6f67">p 里只有一个地址</text></svg>`, caption: `数组的四个字节就在栈上；指针只存首地址，字面量在只读区，写它会出事。` },
      { t: `h2`, text: `常见坑` },
      { t: `ul`, items: [
        `把 char * 指向字面量后试图改字符。字面量在只读区，写它可能当场崩。`,
        `数组开得刚好 strlen 那么长，忘了给 0 留一格。strcpy 会写到数组外面。`,
        `用 sizeof 求字符串长度。sizeof 是数组总字节数，含 0；长度要用 strlen。`,
        `混用字符 '0' 和零字节。前者值是 48，后者才是结尾标记。`,
        `字符串没结尾就交给 printf 的 %s。函数会一直往后读，直到碰巧遇到 0。`
      ] },
      { t: `h2`, text: `任务` },
      { t: `ul`, items: [
        `声明 char s[] = "hello"; 打印 sizeof s 与 strlen(s)，解释为什么差 1。`,
        `不用标准库，写 my_strcmp，按字典序返回负数、零、正数。`,
        `写一个函数，把字符串里的小写字母改成大写，参数用 char *。`,
        `把 "cat" 赋给 char *，尝试改第一个字符，编译并运行，记录发生了什么。`
      ] },
      { t: `tip`, color: `green`, text: `本课一句话：字符串是 char 数组加一个零字节，数组可改、字面量只读，长度永远用 strlen 数。` }
    ]
  },
  {
    id: `q06`,
    title: `第 6 课 · 二级指针与指针数组`,
    blocks: [
      { t: `tip`, color: `blue`, text: `本课目标：看懂 int ** 多出来的那一层、会用二级指针改调用方的指针，并分清指针数组和二维数组在内存里的两种形状。` },
      { t: `h2`, text: `原理讲解` },
      { t: `p`, text: `一级指针存变量的地址，二级指针存一级指针的地址。int x = 7; int *p = &x; int **pp = &p; 之后 *pp 是 p，**pp 是 x。pp 的类型是 int **，它指向的对象类型是 int *，所以对它解引用一次得到指针，解引用两次才得到 int。多一层不是为了好看，而是为了让函数能改「指针本身」。` },
      { t: `p`, text: `函数参数写成 int **pp 时，调用方传 &p。函数里写 *pp = 别的地址，改的是调用方的 p；如果形参只写 int *，函数拿到的是 p 的副本，改它不影响外面。需要换掉整个指针的接口都常用这种写法，因为函数要改的就是指针本身。` },
      { t: `p`, text: `指针数组和二维数组长得像，内存形状不同。int *a[3] 是 3 个指针，占 3 乘指针大小，每个指针可以指向任意位置，各行长度可以不同；int b[3][4] 是一整块连续的 12 个 int，b[i] 是其中第 i 行、类型 int[4]，传给函数时会退化成 int (*)[4]。命令行参数 argv 正是指针数组：char **argv 指向一组 char *，每格指向一个参数字符串，argv[argc] 是 NULL。` },
      { t: `h2`, text: `假设它能干什么` },
      { t: `ul`, items: [
        `函数里替换调用方的指针，比如让 p 改指向新缓冲区。`,
        `表示一组长度不一的字符串，比如 argv、菜单项。`,
        `把调用方的指针设为空，或在失败时恢复成默认对象。`,
        `看清二维数组传参时为什么列数不能省。`
      ] },
      { t: `h2`, text: `演示：改指针与看 argv` },
      { t: `p`, text: `第一段用 retarget 把 p 从 x 改指向 y，参数是 int **；同一段里放一个指针数组，看 arr[1] 解引用后是谁。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
void retarget(int **pp, int *t) { *pp = t; }
int main(void)
{
    int x = 1, y = 2;
    int *p = &x;
    retarget(&p, &y);
    int *arr[2] = {&x, &y};
    printf("*p=%d *arr[1]=%d\\n", *p, *arr[1]);
    return 0;
}` },
      { t: `p`, text: `第二段打印 argv 的形状。编译后带几个参数运行，能看到 argc 把程序名也算进去，argv[argc] 是空指针。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
int main(int argc, char **argv)
{
    for (int i = 0; i < argc; i++)
        printf("argv[%d] = %s\\n", i, argv[i]);
    printf("argv[%d] = %p\\n", argc, (void *)argv[argc]);
    return 0;
}` },
      { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="26" y="18" width="588" height="264" rx="14" fill="#eef6f4"/><text x="320" y="48" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">指针数组是一排箭头，二维数组是一整块</text><text x="52" y="82" font-size="16" fill="#4d6f67">int *a[3]</text><rect x="52" y="96" width="70" height="42" rx="6" fill="#fdf1ea" stroke="#b4552d" stroke-width="2"/><text x="87" y="123" font-size="15" text-anchor="middle" fill="#173d36">a[0]</text><rect x="52" y="150" width="70" height="42" rx="6" fill="#fdf1ea" stroke="#b4552d" stroke-width="2"/><text x="87" y="177" font-size="15" text-anchor="middle" fill="#173d36">a[1]</text><rect x="52" y="204" width="70" height="42" rx="6" fill="#fdf1ea" stroke="#b4552d" stroke-width="2"/><text x="87" y="231" font-size="15" text-anchor="middle" fill="#173d36">a[2]</text><rect x="160" y="96" width="66" height="42" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="193" y="123" font-size="16" text-anchor="middle" fill="#173d36">10</text><rect x="160" y="150" width="66" height="42" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="193" y="177" font-size="16" text-anchor="middle" fill="#173d36">20</text><rect x="160" y="204" width="66" height="42" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="193" y="231" font-size="16" text-anchor="middle" fill="#173d36">30</text><path d="M124 117H154" stroke="#b4552d" stroke-width="3"/><polygon points="154,117 144,111 144,123" fill="#b4552d"/><path d="M124 171H154" stroke="#b4552d" stroke-width="3"/><polygon points="154,171 144,165 144,177" fill="#b4552d"/><path d="M124 225H154" stroke="#b4552d" stroke-width="3"/><polygon points="154,225 144,219 144,231" fill="#b4552d"/><text x="110" y="268" font-size="14" text-anchor="middle" fill="#4d6f67">三根指针，目标可以分散</text><text x="390" y="82" font-size="16" fill="#4d6f67">int b[2][3]</text><rect x="340" y="110" width="56" height="46" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="368" y="140" font-size="15" text-anchor="middle" fill="#173d36">1</text><rect x="398" y="110" width="56" height="46" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="426" y="140" font-size="15" text-anchor="middle" fill="#173d36">2</text><rect x="456" y="110" width="56" height="46" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="484" y="140" font-size="15" text-anchor="middle" fill="#173d36">3</text><rect x="340" y="158" width="56" height="46" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="368" y="188" font-size="15" text-anchor="middle" fill="#173d36">4</text><rect x="398" y="158" width="56" height="46" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="426" y="188" font-size="15" text-anchor="middle" fill="#173d36">5</text><rect x="456" y="158" width="56" height="46" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="484" y="188" font-size="15" text-anchor="middle" fill="#173d36">6</text><text x="426" y="230" font-size="14" text-anchor="middle" fill="#4d6f67">六个 int 首尾相接，b[0] 是前三格</text><text x="110" y="290" font-size="14" text-anchor="middle" fill="#b4552d">sizeof 是 24，不是 12</text><text x="426" y="268" font-size="14" text-anchor="middle" fill="#4d6f67">b[i] 退化成 int (*)[3]</text></svg>`, caption: `左边每格存的是地址，右边每格存的是 int；sizeof 和传参类型都不一样。` },
      { t: `h2`, text: `常见坑` },
      { t: `ul`, items: [
        `把 int ** 当成二维数组直接传。int ** 和 int (*)[4] 不是一种类型。`,
        `函数里想改指针却只传一级指针，改的是副本。`,
        `对 pp 只解引用一次就当成 int 用。*pp 仍是地址，要 **pp。`,
        `声明 int *a[3] 和 int (*a)[3] 搞混。后者是指向 3 个 int 的数组的指针。`,
        `以为 argv 里的字符串可以随便改。它们通常由系统准备，能读不一定能写。`
      ] },
      { t: `h2`, text: `任务` },
      { t: `ul`, items: [
        `写 set_null(int **p)，把调用方的指针置为 NULL，在主函数里验证。`,
        `声明 int x、y、z 和 int *arr[3]，用指针数组按相反顺序打印三个值。`,
        `声明 int m[2][3]，打印 sizeof m、sizeof m[0]、sizeof m[0][0]，解释三个数的关系。`,
        `写程序打印 argv 的每个元素和地址，带两个参数运行，观察 argv[argc] 的值。`
      ] },
      { t: `tip`, color: `green`, text: `本课一句话：二级指针指向指针，用来改指针本身；指针数组是一排箭头，二维数组是一整块连续内存。` }
    ]
  },
  {
    id: `q07`,
    title: `第 7 课 · 函数指针：把函数当参数`,
    blocks: [
      { t: `tip`, color: `blue`, text: `本课目标：会读函数指针的声明、把函数当参数传进另一个函数，并用 qsort 的比较函数把回调真正用起来。` },
      { t: `h2`, text: `原理讲解` },
      { t: `p`, text: `函数在程序里有地址，函数名在表达式里会退化成指向函数代码的指针。声明一个函数指针要写返回类型、名字和参数表，再用括号把星号和名字括起来：int (*fp)(int, int); 少一层括号，int *fp(int, int) 就变成返回 int * 的函数。fp 可以赋值 add，调用写 fp(3, 4) 或 (*fp)(3, 4)，两种等价。` },
      { t: `p`, text: `函数指针最大的用处是把「做什么」当参数传进来。apply 收一个 int (*)(int, int) 类型的函数指针和两个数，内部调用 op(a, b)；main 传 add 就做加法，传 mul 就做乘法，apply 的代码一个字都不用改。这种参数叫回调，排序、遍历、事件处理都用它。` },
      { t: `p`, text: `类型写多了会烦，typedef 给函数指针起个名字：typedef int (*BinOp)(int, int); 之后 BinOp 就是一个类型，参数直接写 BinOp op。标准库 qsort 的比较函数签名是 int (*)(const void *, const void *)，返回负数表示第一个排在前面，零表示相等，正数表示后面；比较 int 时不要直接写 a - b，溢出会翻符号，用两个比较相减。` },
      { t: `h2`, text: `假设它能干什么` },
      { t: `ul`, items: [
        `把加减乘除中的一个当参数传给计算器函数。`,
        `给排序传不同的比较规则，按升序、降序或字符串长度排。`,
        `写一个遍历数组并对每格调用回调的函数。`,
        `用函数指针表代替一长串 if 或 switch。`
      ] },
      { t: `h2`, text: `演示：回调与 qsort` },
      { t: `p`, text: `第一段把 add 和 mul 传给 apply，再用函数指针变量直接调用 add。注意 apply 的参数写法，星号在括号里。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
int add(int a, int b) { return a + b; }
int mul(int a, int b) { return a * b; }
int apply(int (*op)(int, int), int a, int b) { return op(a, b); }
int main(void)
{
    printf("%d %d\\n", apply(add, 3, 4), apply(mul, 3, 4));
    int (*fp)(int, int) = add;
    printf("%d\\n", fp(10, 20));
    return 0;
}` },
      { t: `p`, text: `第二段用 qsort 排一个 int 数组。比较函数先把两个 void * 转成 const int *，再解引用；返回值的正负决定顺序。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
#include <stdlib.h>
int cmp_int(const void *a, const void *b)
{
    int x = *(const int *)a, y = *(const int *)b; return (x > y) - (x < y);
}
int main(void) {
    int a[5] = {3, 1, 4, 1, 5};
    qsort(a, 5, sizeof a[0], cmp_int);
    for (int i = 0; i < 5; i++) printf("%d ", a[i]);
    printf("\\n"); return 0;
}` },
      { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="30" y="20" width="580" height="240" rx="14" fill="#eef6f4"/><text x="320" y="52" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">函数指针存的是代码的地址</text><rect x="60" y="96" width="170" height="54" rx="8" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="76" y="129" font-size="16" fill="#173d36">add</text><text x="216" y="129" font-size="15" text-anchor="end" fill="#4d6f67">代码段</text><rect x="60" y="176" width="170" height="54" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="76" y="209" font-size="16" fill="#173d36">mul</text><text x="216" y="209" font-size="15" text-anchor="end" fill="#4d6f67">代码段</text><rect x="330" y="96" width="230" height="54" rx="8" fill="#fdf1ea" stroke="#b4552d" stroke-width="2"/><text x="346" y="129" font-size="16" fill="#173d36">apply 的 op</text><text x="544" y="129" font-size="15" text-anchor="end" fill="#b4552d">0x401140</text><rect x="330" y="176" width="230" height="54" rx="8" fill="#fdf1ea" stroke="#b4552d" stroke-width="2"/><text x="346" y="209" font-size="16" fill="#173d36">main 的 fp</text><text x="544" y="209" font-size="15" text-anchor="end" fill="#b4552d">0x401140</text><path d="M330 123 C 280 123 250 123 236 123" fill="none" stroke="#b4552d" stroke-width="3"/><polygon points="236,123 246,117 246,129" fill="#b4552d"/><path d="M330 203 C 280 203 250 203 236 203" fill="none" stroke="#b4552d" stroke-width="3"/><polygon points="236,203 246,197 246,209" fill="#b4552d"/><text x="320" y="250" font-size="14" text-anchor="middle" fill="#4d6f67">赋值只是复制地址；调用时 CPU 跳到这个地址执行 add</text></svg>`, caption: `op 和 fp 里都是 add 的入口地址，传参传的也是这个地址。` },
      { t: `h2`, text: `常见坑` },
      { t: `ul`, items: [
        `声明漏括号：int *fp(int, int) 是函数，不是函数指针。`,
        `赋值时纠结要不要写 &。add 和 &add 都可以，调用时 fp(...) 和 (*fp)(...) 也都可以。`,
        `函数指针类型不匹配就赋值，比如把参数是 double 的函数塞给 int 版本。`,
        `qsort 比较函数直接 return *a - *b，大数相减会溢出。`,
        `忘了比较函数要处理相等，应返回 0。`,
        `调用没有赋值的函数指针。它的内容是垃圾地址，跳过去直接崩。`
      ] },
      { t: `h2`, text: `任务` },
      { t: `ul`, items: [
        `声明 int (*fp)(int, int)，让它依次指向 add 和 mul，打印两次结果。`,
        `用 typedef 定义 BinOp，写 apply(BinOp op, int a, int b)。`,
        `写按降序排 int 的 qsort 比较函数，和升序版本对比输出。`,
        `写 for_each(int *a, int n, void (*f)(int *))，把数组每格交给回调处理。`
      ] },
      { t: `tip`, color: `green`, text: `本课一句话：函数名就是代码的地址，函数指针让「做什么」变成参数，qsort 靠比较函数的正负零决定顺序。` }
    ]
  },
  {
    id: `q08`,
    title: `第 8 课 · 动态内存（一）：malloc 与 free`,
    blocks: [
      { t: `tip`, color: `blue`, text: `本课目标：知道栈和堆的区别、用 malloc 按字节申请内存并检查 NULL、用 free 成对归还，养成 free 后置空的习惯。` },
      { t: `h2`, text: `原理讲解` },
      { t: `p`, text: `函数里的局部变量在栈上，进入函数分配，返回时自动回收；malloc 从堆上要一块内存，分配后一直有效，直到 free 或进程结束，函数返回不会带走它。这就是函数能安全返回堆指针的原因。堆的大小只受系统和进程限制，可以按运行时的数量申请。` },
      { t: `p`, text: `malloc 的参数是字节数，返回 void *，指向块的首字节，失败返回 NULL。C 里不需要强制转换，赋给 int * 会自动转换；字节数用 n * sizeof *p 算，sizeof *p 是目标类型的大小，改类型时不用改公式。malloc 不清零，新块里是上一次留下的内容，读之前先写。` },
      { t: `p`, text: `free 的参数必须是分配函数返回过的地址，或者 NULL。free(NULL) 什么也不做，可以放心调用；同一个地址 free 两次是未定义行为。free 只把块还给分配器，不会改你手里的指针值，指针仍指着那块已经不属于你的内存。所以 free 之后立刻写 p = NULL，再误用至少是空指针，能被判断出来。` },
      { t: `h2`, text: `假设它能干什么` },
      { t: `ul`, items: [
        `长度等到运行时才知道的数组，比如先读 n 再申请。`,
        `函数里造一块数据，返回给调用方继续用。`,
        `建链表、树这类节点数量不固定的结构。`,
        `读入一行长度不定的文本，按需要扩块。`
      ] },
      { t: `h2`, text: `演示：申请一个和申请一片` },
      { t: `p`, text: `第一段申请一个 int，检查 NULL，写值、读值、free，再把指针置空。free(NULL) 是安全的，所以置空后还能再调一次 free。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
#include <stdlib.h>
int main(void)
{
    int *p = malloc(sizeof *p);
    if (p == NULL) return 1;
    *p = 42;
    printf("%d\\n", *p);
    free(p);
    p = NULL;
    return 0;
}` },
      { t: `p`, text: `第二段申请 n 个 int，用下标当数组写。malloc 给的是连续字节，够放下 n 个 int，就能按数组用。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
#include <stdlib.h>
int main(void)
{
    int n = 5;
    int *a = malloc((size_t)n * sizeof *a);
    if (!a) return 1;
    for (int i = 0; i < n; i++) a[i] = i * i;
    printf("%d %d\\n", a[0], a[4]);
    free(a); a = NULL;
    return 0;
}` },
      { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="30" y="20" width="580" height="260" rx="14" fill="#eef6f4"/><text x="320" y="52" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">free 前后：指针和堆块各是什么状态</text><text x="64" y="88" font-size="16" fill="#4d6f67">free 之前</text><rect x="52" y="102" width="150" height="46" rx="7" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="66" y="130" font-size="16" fill="#173d36">p</text><text x="190" y="130" font-size="15" text-anchor="end" fill="#b4552d">0x55a0</text><path d="M202 125H270" stroke="#b4552d" stroke-width="3"/><polygon points="270,125 260,119 260,131" fill="#b4552d"/><rect x="276" y="96" width="210" height="58" rx="7" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="381" y="120" font-size="16" text-anchor="middle" fill="#173d36">堆块 4 字节</text><text x="381" y="142" font-size="15" text-anchor="middle" fill="#173d36">42</text><text x="556" y="128" font-size="14" fill="#4d6f67">还在用</text><text x="64" y="202" font-size="16" fill="#4d6f67">free 之后</text><rect x="52" y="216" width="150" height="46" rx="7" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="66" y="244" font-size="16" fill="#173d36">p</text><text x="190" y="244" font-size="15" text-anchor="end" fill="#173d36">NULL</text><rect x="276" y="210" width="210" height="58" rx="7" fill="#f2f2f2" stroke="#9a9a9a" stroke-width="2" stroke-dasharray="6 4"/><text x="381" y="234" font-size="16" text-anchor="middle" fill="#555555">已还给分配器</text><text x="381" y="256" font-size="15" text-anchor="middle" fill="#555555">内容随时会被覆盖</text><text x="556" y="242" font-size="14" fill="#b4552d">不能再读写</text></svg>`, caption: `free 不会清空内存，只会把块交还；把 p 置空是防止自己再顺着旧地址走回去。` },
      { t: `h2`, text: `常见坑` },
      { t: `ul`, items: [
        `把 malloc 的参数写成元素个数，忘了乘 sizeof。10 个 int 只给 10 字节。`,
        `不检查 NULL 就解引用。分配失败返回空指针，下一行就崩。`,
        `free 一个不是分配函数返回的地址，比如栈变量地址或数组中间。`,
        `free 之后继续读写。那块内存已经还给分配器，内容随时会被覆盖。`,
        `同一个指针 free 两次。第一次之后置 NULL 可以避免。`,
        `以为 free 会把指针改成 NULL。它不会，指针里还是旧地址。`
      ] },
      { t: `h2`, text: `任务` },
      { t: `ul`, items: [
        `读入 n，申请 n 个 int，填入平方数，打印后 free 并置空。`,
        `写 make_array(int n)，返回 malloc 出来的数组，调用方负责 free。`,
        `故意把 malloc 的字节数写少，再往块外写一个值，记录普通运行时是否崩溃。`,
        `写程序连续 free 同一个指针两次，记录普通运行时发生了什么。`
      ] },
      { t: `tip`, color: `green`, text: `本课一句话：malloc 按字节从堆上要一块地，失败返回 NULL；free 只还一次，还完把指针置空。` }
    ]
  },
  {
    id: `q09`,
    title: `第 9 课 · 动态内存（二）：calloc 与 realloc`,
    blocks: [
      { t: `tip`, color: `blue`, text: `本课目标：用 calloc 拿到清零的内存、用 realloc 扩容，并记住扩容可能搬家、失败时旧块必须保住。` },
      { t: `h2`, text: `原理讲解` },
      { t: `p`, text: `calloc 收两个参数：元素个数和每个元素的字节数，分配 n 乘 size 字节，并把每个字节设成 0。malloc 不保证内容，calloc 保证全零，所以数组、结构体数组刚分配时可以直接读。calloc 也可能失败，返回值照样要判 NULL。参数顺序别写反，虽然乘积一样，读代码的人会误会。` },
      { t: `p`, text: `realloc 把一块已分配的内存改成新大小，返回新块的首地址。堆里原来的位置后面不一定有空间，分配器可能找一块新地方，把旧内容复制过去，再释放旧块；所以旧指针在 realloc 成功后不能再用。扩容出来的新区域不清零，只有原来那部分内容保留。` },
      { t: `p`, text: `正确写法先用临时指针接返回值：int *tmp = realloc(a, 新字节数); 如果 tmp 是 NULL，说明扩容失败，原来的 a 还在，仍然可以 free；确认 tmp 非空后再写 a = tmp。直接写 a = realloc(a, ...) 是常见错误，失败时返回值 NULL 覆盖了旧地址，旧块就泄漏了。realloc(NULL, size) 等价于 malloc。` },
      { t: `h2`, text: `假设它能干什么` },
      { t: `ul`, items: [
        `动态数组按需翻倍扩容，追加元素不用一开始就开很大。`,
        `读入未知长度的文本，边读边扩缓冲区。`,
        `用 calloc 建计数表或矩阵，省掉手动清零。`,
        `把结构体数组扩大一倍，保留已经填好的部分。`
      ] },
      { t: `h2`, text: `演示：清零与扩容` },
      { t: `p`, text: `第一段用 calloc 申请 4 个 int，直接打印，四个都是 0；换成 malloc 的话，内容就是残留值。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
#include <stdlib.h>
int main(void) {
    int *a = calloc(4, sizeof *a);
    if (!a) return 1;
    for (int i = 0; i < 4; i++) printf("%d ", a[i]);
    printf("\\n");
    free(a);
    return 0;
}` },
      { t: `p`, text: `第二段从 3 个 int 扩到 6 个，旧值 1、2、3 保留，新格子没有初始化，只写第五格再读。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
#include <stdlib.h>
int main(void) {
    int *a = malloc(3 * sizeof *a);
    if (!a) return 1;
    for (int i = 0; i < 3; i++) a[i] = i + 1;
    int *tmp = realloc(a, 6 * sizeof *a);
    if (!tmp) { free(a); return 1; }
    a = tmp; a[5] = 6;
    printf("%d %d\\n", a[2], a[5]);
    free(a); return 0;
}` },
      { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="30" y="20" width="580" height="260" rx="14" fill="#eef6f4"/><text x="320" y="52" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">realloc 可能搬家：新块复制旧值，旧块被释放</text><text x="70" y="88" font-size="16" fill="#4d6f67">原来的 3 个 int</text><rect x="60" y="102" width="62" height="46" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="91" y="132" font-size="16" text-anchor="middle" fill="#173d36">1</text><rect x="126" y="102" width="62" height="46" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="157" y="132" font-size="16" text-anchor="middle" fill="#173d36">2</text><rect x="192" y="102" width="62" height="46" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="223" y="132" font-size="16" text-anchor="middle" fill="#173d36">3</text><text x="157" y="176" font-size="14" text-anchor="middle" fill="#4d6f67">地址 0x1000，后面没地方</text><path d="M270 125 C 320 125 320 125 356 125" fill="none" stroke="#b4552d" stroke-width="3"/><polygon points="356,125 346,119 346,131" fill="#b4552d"/><text x="313" y="110" font-size="14" text-anchor="middle" fill="#b4552d">申请 6 格</text><text x="470" y="88" font-size="16" fill="#4d6f67">新块</text><rect x="370" y="102" width="52" height="46" rx="6" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="396" y="132" font-size="16" text-anchor="middle" fill="#173d36">1</text><rect x="426" y="102" width="52" height="46" rx="6" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="452" y="132" font-size="16" text-anchor="middle" fill="#173d36">2</text><rect x="482" y="102" width="52" height="46" rx="6" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="508" y="132" font-size="16" text-anchor="middle" fill="#173d36">3</text><rect x="538" y="102" width="52" height="46" rx="6" fill="#fff7ec" stroke="#b4552d" stroke-width="2"/><text x="564" y="132" font-size="16" text-anchor="middle" fill="#b4552d">?</text><text x="492" y="176" font-size="14" text-anchor="middle" fill="#4d6f67">地址 0x2000，新增格未初始化</text><rect x="60" y="198" width="234" height="50" rx="8" fill="#f2f2f2" stroke="#9a9a9a" stroke-width="2" stroke-dasharray="6 4"/><text x="177" y="229" font-size="15" text-anchor="middle" fill="#555555">旧块被释放，a 不能再指这里</text><text x="320" y="278" font-size="14" text-anchor="middle" fill="#4d6f67">tmp 先接住 0x2000；成功后才写 a = tmp，失败则保留 a 去 free</text></svg>`, caption: `扩容成功时旧地址作废，新增的格子没有初值；tmp 是用来防止失败时丢地址的。` },
      { t: `h2`, text: `常见坑` },
      { t: `ul`, items: [
        `写 a = realloc(a, n)，失败时旧地址丢了，内存泄漏。`,
        `扩容后继续用旧指针。realloc 可能搬家，旧地址已经失效。`,
        `以为 realloc 会把新增部分清零。只有 calloc 清零，realloc 新增区域内容不确定。`,
        `calloc 的参数顺序写反，或把字节数当元素个数。`,
        `对不是 malloc 系列返回的指针调用 realloc 或 free。`,
        `realloc 的字节数用元素个数，忘了乘 sizeof。`
      ] },
      { t: `h2`, text: `任务` },
      { t: `ul`, items: [
        `用 calloc 建一个 3 行 4 列的 int 矩阵，打印全部元素确认是 0，再 free。`,
        `写 push_back(int **a, int *n, int *cap, int v)，容量满时翻倍 realloc，注意临时指针。`,
        `故意写 a = realloc(a, ...) 让它失败，比较正确写法的差别。`,
        `申请 4 个 int，扩到 8 个，验证前 4 个值还在，新增格子先写后读。`
      ] },
      { t: `tip`, color: `green`, text: `本课一句话：calloc 分配并清零，realloc 扩容可能搬家；返回值先接临时指针，失败时旧块才保得住。` }
    ]
  },
  {
    id: `q10`,
    title: `第 10 课 · 动态内存（三）：四种常见错误`,
    blocks: [
      { t: `tip`, color: `blue`, text: `本课目标：认出野指针、悬垂指针、泄漏、越界四种错误，会用 AddressSanitizer 把它们从「看起来正常」变成带调用栈的报错。` },
      { t: `h2`, text: `原理讲解` },
      { t: `p`, text: `野指针是声明了却没初始化的指针，它的内容是栈上残留。int *p; *p = 1; 里 p 指向哪个地址全看运气，写下去可能踩坏任何东西。野指针的特征是错误发生在赋值那一行，根因却是更早的没初始化。防御很直接：指针声明时就给 NULL，用之前先赋值。` },
      { t: `p`, text: `悬垂指针是曾经有效、现在指向已经释放或离开作用域的内存的指针。free(p) 之后 p 里的地址没变，再读 *p 就是 use-after-free；函数返回局部变量的地址也是同一类问题。free 后置 NULL 只能防住自己还拿这个指针用，如果另有一个别名指向同一块，置空这个副本救不了别名。` },
      { t: `p`, text: `泄漏是 malloc 出来的块再也找不到指针去 free：覆盖了唯一指针、函数提前 return、或把指针丢了。程序跑得越久堆占用越大，最后 malloc 返回 NULL。越界是分配 n 格却写第 n 格，可能踩坏相邻块的元数据，报错点常常在很久之后的 free 上。AddressSanitizer 靠编译器插桩检查每次访存，编译加 -fsanitize=address -g，运行就能看到错误类型、地址和分配与释放的调用栈。` },
      { t: `h2`, text: `假设它能干什么` },
      { t: `ul`, items: [
        `跑单元测试前先过一遍 ASan，把隐藏的越界和 use-after-free 抓出来。`,
        `审代码时按「谁分配、谁释放」给每个指针找到唯一主人。`,
        `在函数出口统一 free，避免提前 return 漏掉。`,
        `给链表、动态数组写释放函数，循环还清所有块。`
      ] },
      { t: `h2`, text: `演示：让 use-after-free 当场说话` },
      { t: `p`, text: `下面这段先申请一个 int，free 之后再读。普通编译可能照样打印一个数，看不出问题；gcc 的 -Wall 会先给一条 use-after-free 警告，但照样生成可执行文件，跑起来也可能照常结束。加 ASan 编译则会在 printf 那一行停下，报 heap-use-after-free。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
#include <stdlib.h>
int main(void)
{
    int *p = malloc(sizeof *p);
    if (!p) return 1;
    *p = 42;
    free(p);
    printf("%d\\n", *p);
    return 0;
}` },
      { t: `p`, text: `把上面那段存成 uaf.c，编译和运行命令如下。第一行加 -g 保留行号，ASan 的报告会指出读发生在第 9 行，free 发生在第 8 行。` },
      { t: `code`, lang: `shell`, code: `gcc -std=c11 -Wall -Wextra -fsanitize=address -g uaf.c -o uaf
./uaf` },
      { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320"><rect x="26" y="18" width="588" height="284" rx="14" fill="#eef6f4"/><text x="320" y="48" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">四种错误，四种坏掉的内存关系</text><rect x="40" y="66" width="270" height="100" rx="9" fill="#ffffff" stroke="#7fa99f" stroke-width="2"/><text x="56" y="92" font-size="16" font-weight="700" fill="#b4552d">野指针</text><rect x="56" y="106" width="80" height="38" rx="6" fill="#fdf1ea" stroke="#b4552d" stroke-width="2"/><text x="96" y="131" font-size="15" text-anchor="middle" fill="#173d36">p 未初始化</text><path d="M144 125H192" stroke="#b4552d" stroke-width="2.5"/><polygon points="192,125 182,119 182,131" fill="#b4552d"/><text x="214" y="132" font-size="20" fill="#b4552d">?</text><text x="56" y="160" font-size="14" fill="#4d6f67">里面是垃圾地址，写哪都可能</text><rect x="330" y="66" width="270" height="100" rx="9" fill="#ffffff" stroke="#7fa99f" stroke-width="2"/><text x="346" y="92" font-size="16" font-weight="700" fill="#b4552d">悬垂指针</text><rect x="346" y="106" width="66" height="38" rx="6" fill="#fdf1ea" stroke="#b4552d" stroke-width="2"/><text x="379" y="131" font-size="15" text-anchor="middle" fill="#173d36">p</text><path d="M418 125H466" stroke="#b4552d" stroke-width="2.5"/><polygon points="466,125 456,119 456,131" fill="#b4552d"/><rect x="472" y="106" width="110" height="38" rx="6" fill="#f2f2f2" stroke="#9a9a9a" stroke-width="2" stroke-dasharray="6 4"/><text x="527" y="131" font-size="14" text-anchor="middle" fill="#555555">已 free 的块</text><text x="346" y="160" font-size="14" fill="#4d6f67">地址还在手里，内存已经不归你</text><rect x="40" y="184" width="270" height="100" rx="9" fill="#ffffff" stroke="#7fa99f" stroke-width="2"/><text x="56" y="210" font-size="16" font-weight="700" fill="#b4552d">泄漏</text><rect x="56" y="224" width="130" height="38" rx="6" fill="#fff7ec" stroke="#b4552d" stroke-width="2"/><text x="121" y="249" font-size="15" text-anchor="middle" fill="#173d36">malloc 的块</text><text x="206" y="249" font-size="14" fill="#4d6f67">没有箭头指向它</text><text x="56" y="278" font-size="14" fill="#4d6f67">地址丢了，free 无从谈起</text><rect x="330" y="184" width="270" height="100" rx="9" fill="#ffffff" stroke="#7fa99f" stroke-width="2"/><text x="346" y="210" font-size="16" font-weight="700" fill="#b4552d">越界</text><rect x="346" y="224" width="46" height="38" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="369" y="249" font-size="15" text-anchor="middle" fill="#173d36">a[0]</text><rect x="396" y="224" width="46" height="38" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="419" y="249" font-size="15" text-anchor="middle" fill="#173d36">a[1]</text><rect x="446" y="224" width="46" height="38" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="469" y="249" font-size="15" text-anchor="middle" fill="#173d36">a[2]</text><rect x="496" y="224" width="46" height="38" rx="6" fill="#fdf1ea" stroke="#b4552d" stroke-width="2"/><text x="519" y="249" font-size="15" text-anchor="middle" fill="#b4552d">a[3]</text><text x="346" y="278" font-size="14" fill="#4d6f67">只分配了 3 格，却写了第 4 格</text></svg>`, caption: `前两种是地址坏了，第三种是地址丢了，第四种是地址没错但走过了头。` },
      { t: `h2`, text: `常见坑` },
      { t: `ul`, items: [
        `以为 free 后指针自动变 NULL。它不会，悬垂指针照样能解引用。`,
        `只给一个别名置空，另一个别名还指着已释放的块。`,
        `函数提前 return 前忘了 free 临时缓冲区。`,
        `用 malloc 的字节数当元素个数，循环写到块外。`,
        `越界写没当场崩就以为没事。堆元数据可能已经被踩坏，free 时才爆。`,
        `把 ASan 当万能。它只报运行时真正走到的错误，没执行的分支查不出来。`
      ] },
      { t: `h2`, text: `任务` },
      { t: `ul`, items: [
        `写一段 use-after-free，分别用普通编译和 -fsanitize=address 跑，记录输出差异。`,
        `写一个函数，在提前 return 的分支漏掉 free，用 ASan 的泄漏检查确认。`,
        `声明 int a[4]，故意写 a[4]，用 ASan 看报告指到哪一行。`,
        `给一个动态数组写释放函数，释放后把所有别名置空，说明为什么只能防住副本。`
      ] },
      { t: `tip`, color: `green`, text: `本课一句话：野指针是没初始化，悬垂是释放后还用，泄漏是丢了地址，越界是写了别人的格子；ASan 让这四种错误当场说话。` }
    ]
  },
  {
    id: `q11`,
    title: `第 11 课 · 结构体（一）：先定义，再装数据`,
    blocks: [
      { t: `tip`, color: `blue`, text: `本课目标：会定义 struct、用两种写法初始化、用点号访问成员，并看懂赋值是整块拷贝、sizeof 为什么常比成员之和多。` },
      { t: `h2`, text: `原理讲解` },
      { t: `p`, text: `struct 把几个不同类型的数据捆成一个类型。定义写法是 struct Point { int x; int y; }; 右大括号后面必须有分号，漏了编译器会在下一行报奇怪错误。定义只是造了一个类型，还没分配内存；写 struct Point p; 才在栈上留出空间。类型名前面的 struct 不能随便省，除非用 typedef 起别名。` },
      { t: `p`, text: `初始化可以按成员顺序写 struct Point p = {1, 2};，也可以指定名字 struct Point q = {.y = 5, .x = 3};，顺序随便，没写的成员补 0。访问用点号 p.x、p.y，赋值 p.x = 10 改的是成员那一小块。整个结构体可以赋值：q = p; 编译器按成员逐个复制，两个变量之后互不影响；数组、嵌套结构体也一起复制。` },
      { t: `p`, text: `成员在内存里按声明顺序排，但编译器会在中间塞填充字节，让每个成员落在适合它的地址上。struct { char c; int i; }; 在常见机器上占 8 字节：c 占 1 字节，后面 3 字节空着，i 占 4 字节；把 int 写在前面、char 写在后面，通常还是 8 字节。sizeof 是含填充的总大小，具体偏移用 offsetof 看，别自己拿成员大小相加。` },
      { t: `h2`, text: `假设它能干什么` },
      { t: `ul`, items: [
        `表示一个点、一种颜色、一条学生记录。`,
        `把一条记录的多个字段一起传给函数或存进数组。`,
        `用结构体数组当小数据库，按字段查找。`,
        `给协议报文定义固定布局，按字段读写。`
      ] },
      { t: `h2`, text: `演示：初始化、赋值与填充` },
      { t: `p`, text: `第一段定义一个 Point，初始化、改成员、整体赋值，再打印两份，确认赋值之后互不影响。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
struct Point { int x; int y; };
int main(void)
{
    struct Point a = {1, 2};
    struct Point b = a;
    b.x = 99;
    printf("a=(%d,%d) b=(%d,%d)\\n", a.x, a.y, b.x, b.y);
    printf("sizeof=%zu\\n", sizeof(struct Point));
    return 0;
}` },
      { t: `p`, text: `第二段看填充：char 后面跟 int，打印 sizeof 和 offsetof，能看到中间空出的 3 字节。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
#include <stddef.h>
struct Pair { char c; int i; };
int main(void)
{
    struct Pair p = {'A', 7};
    printf("%c %d\\n", p.c, p.i);
    printf("sizeof=%zu offset i=%zu\\n", sizeof p, offsetof(struct Pair, i));
    return 0;
}` },
      { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="28" y="20" width="584" height="260" rx="14" fill="#eef6f4"/><text x="320" y="50" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">成员按顺序放，填充字节把对齐补齐</text><text x="56" y="84" font-size="16" fill="#4d6f67">struct Point 两个 int</text><rect x="56" y="98" width="100" height="48" rx="7" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="106" y="128" font-size="16" text-anchor="middle" fill="#173d36">x</text><rect x="160" y="98" width="100" height="48" rx="7" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="210" y="128" font-size="16" text-anchor="middle" fill="#173d36">y</text><text x="106" y="168" font-size="14" text-anchor="middle" fill="#4d6f67">偏移 0</text><text x="210" y="168" font-size="14" text-anchor="middle" fill="#4d6f67">偏移 4</text><text x="158" y="196" font-size="15" text-anchor="middle" fill="#173d36">sizeof = 8</text><text x="376" y="84" font-size="16" fill="#4d6f67">struct Pair 一个 char 一个 int</text><rect x="376" y="98" width="52" height="48" rx="7" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="402" y="128" font-size="16" text-anchor="middle" fill="#173d36">c</text><rect x="432" y="98" width="108" height="48" rx="7" fill="#f2f2f2" stroke="#9a9a9a" stroke-width="2" stroke-dasharray="6 4"/><text x="486" y="128" font-size="14" text-anchor="middle" fill="#555555">填充 3 字节</text><rect x="544" y="98" width="52" height="48" rx="7" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="570" y="128" font-size="16" text-anchor="middle" fill="#173d36">i</text><text x="402" y="168" font-size="14" text-anchor="middle" fill="#4d6f67">偏移 0</text><text x="570" y="168" font-size="14" text-anchor="middle" fill="#4d6f67">偏移 4</text><text x="486" y="196" font-size="15" text-anchor="middle" fill="#173d36">sizeof = 8，不是 5</text><text x="320" y="240" font-size="14" text-anchor="middle" fill="#4d6f67">成员之间和末尾都可能有空字节；偏移用 offsetof 量，大小用 sizeof 取</text></svg>`, caption: `填充不是数据，是编译器为了对齐留的空位；sizeof 把空位也算进去。` },
      { t: `h2`, text: `常见坑` },
      { t: `ul`, items: [
        `struct 定义末尾漏分号，错误常报在下一行。`,
        `写 Point p; 忘了 struct 前缀，除非已经 typedef。`,
        `初始化顺序写错。指定成员名可以避免，比如 .y = 5。`,
        `以为结构体赋值共享内存。它是逐成员复制，改副本不影响原件。`,
        `用成员大小直接相加当 sizeof，忽略填充字节。`,
        `直接比较两个结构体是否相等。C 不允许用 == 比较结构体。`
      ] },
      { t: `h2`, text: `任务` },
      { t: `ul`, items: [
        `定义 struct Book，含书名 char 数组、价格 double、页数 int，初始化并打印。`,
        `用指定初始化器只给部分成员赋值，打印没写的成员，确认是 0。`,
        `声明两个同类型结构体，赋值后改其中一个，验证另一个不变。`,
        `定义含 char 和 double 的结构体，打印 sizeof 与各成员偏移，指出填充在哪。`
      ] },
      { t: `tip`, color: `green`, text: `本课一句话：struct 先定义类型再分配变量，点号访问成员，赋值整块复制，sizeof 里含编译器塞的填充字节。` }
    ]
  },
  {
    id: `q12`,
    title: `第 12 课 · 结构体（二）：结构体指针与自引用`,
    blocks: [
      { t: `tip`, color: `blue`, text: `本课目标：用箭头访问结构体指针、用指针作参数避免整块复制并改到原件，还会写自引用节点和 typedef。` },
      { t: `h2`, text: `原理讲解` },
      { t: `p`, text: `结构体指针存结构体的首地址。p->x 是 (*p).x 的简写，箭头把解引用和取成员合成一个运算符。点号的优先级比星号高，所以 *p.x 会被读成 *(p.x)，p 不是结构体就编不过；要么写 (*p).x，要么直接用箭头。p 为 NULL 时两种写法都会崩，解引用前先判断。` },
      { t: `p`, text: `结构体作参数是传值，整个结构体被复制一份，成员多时开销大，函数里改的也是副本。参数改成 struct Point *，只复制一个地址，函数里 p->x 改的就是调用方那个结构体。只读时写 const struct Point *，编译器会拦住写操作。传指针省了复制，但也把可能被改这件事摆到了明面上。` },
      { t: `p`, text: `结构体可以包含指向自己类型的指针，这叫自引用：struct Node { int value; struct Node *next; }; 节点里存下一个节点的地址，一串节点靠 next 连起来，这就是链表的地基。不能写 struct Node next; 把同类型结构体嵌进自己，那样大小无限。typedef 可以省掉反复写 struct：typedef struct Node { int value; struct Node *next; } Node; 之后类型名就叫 Node，但定义内部还得写 struct Node *。` },
      { t: `h2`, text: `假设它能干什么` },
      { t: `ul`, items: [
        `函数接收结构体指针，原地修改坐标、计数或状态。`,
        `用 const 指针把大结构体只读地传给打印函数。`,
        `用自引用节点串起链表、栈、队列和树。`,
        `用 typedef 把 struct Node 缩成 Node，声明少打几个字。`
      ] },
      { t: `h2`, text: `演示：箭头与自引用` },
      { t: `p`, text: `第一段用 move 接收 struct Point *，通过箭头改调用方的坐标。传的是地址，函数返回后 a 已经变了。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
struct Point { int x; int y; };
void move(struct Point *p, int dx, int dy) { p->x += dx; p->y += dy; }
int main(void)
{
    struct Point a = {1, 2};
    move(&a, 10, 20);
    printf("(%d,%d)\\n", a.x, a.y);
    return 0;
}` },
      { t: `p`, text: `第二段定义自引用节点，用 typedef 起名 Node，把两个节点串起来再顺着 next 打印。` },
      { t: `code`, lang: `c`, code: `#include <stdio.h>
typedef struct Node { int value; struct Node *next; } Node;
int main(void)
{
    Node b = {2, NULL};
    Node a = {1, &b};
    for (Node *p = &a; p; p = p->next)
        printf("%d ", p->value);
    printf("\\n");
    return 0;
}` },
      { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="30" y="20" width="580" height="240" rx="14" fill="#eef6f4"/><text x="320" y="52" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">自引用节点：next 存下一个同类型节点的地址</text><rect x="52" y="92" width="106" height="54" rx="8" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="105" y="118" font-size="15" text-anchor="middle" fill="#173d36">p</text><text x="105" y="138" font-size="14" text-anchor="middle" fill="#4d6f67">0x7ffd30</text><path d="M158 119H196" stroke="#b4552d" stroke-width="3"/><polygon points="196,119 186,113 186,125" fill="#b4552d"/><rect x="200" y="86" width="150" height="66" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><line x1="290" y1="86" x2="290" y2="152" stroke="#7fa99f" stroke-width="2"/><text x="245" y="116" font-size="15" text-anchor="middle" fill="#173d36">value 1</text><text x="315" y="116" font-size="14" text-anchor="middle" fill="#173d36">next</text><text x="245" y="140" font-size="14" text-anchor="middle" fill="#4d6f67">节点 a</text><text x="320" y="140" font-size="14" text-anchor="middle" fill="#b4552d">0x7ffd40</text><path d="M350 119H388" stroke="#b4552d" stroke-width="3"/><polygon points="388,119 378,113 378,125" fill="#b4552d"/><rect x="392" y="86" width="150" height="66" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><line x1="482" y1="86" x2="482" y2="152" stroke="#7fa99f" stroke-width="2"/><text x="437" y="116" font-size="15" text-anchor="middle" fill="#173d36">value 2</text><text x="507" y="116" font-size="14" text-anchor="middle" fill="#173d36">next</text><text x="437" y="140" font-size="14" text-anchor="middle" fill="#4d6f67">节点 b</text><text x="507" y="140" font-size="14" text-anchor="middle" fill="#4d6f67">NULL</text><text x="320" y="192" font-size="15" text-anchor="middle" fill="#173d36">p->value 等价于 (*p).value</text><text x="320" y="222" font-size="14" text-anchor="middle" fill="#4d6f67">最后一个节点的 next 存 NULL，循环写 p = p->next 就能走完整条链</text></svg>`, caption: `节点里存的是下一个节点的地址，不是下一个节点本身；NULL 标记链尾。` },
      { t: `h2`, text: `常见坑` },
      { t: `ul`, items: [
        `写 *p.x 想访问成员，实际被解析成 *(p.x)。`,
        `传结构体指针却在函数里改 p 本身，比如 p 改成别的地址，调用方看不到。`,
        `只读函数忘了 const，误改调用方数据。`,
        `自引用成员写成 struct Node next，类型大小无法确定。`,
        `typedef 之后还在定义里写 Node *next，此时 Node 还没定义完。`,
        `拿到结构体指针不判 NULL 就写 p->x。`
      ] },
      { t: `h2`, text: `任务` },
      { t: `ul`, items: [
        `定义 struct Point 和函数 move(struct Point *, int, int)，原地平移一个点。`,
        `写 print_point(const struct Point *)，只读打印，尝试在函数里改成员看编译器报什么。`,
        `定义 Node 并手工串三个节点，用循环打印，再把顺序反过来。`,
        `用 typedef 定义 Node，写 new_node(int v)，返回 malloc 出来的节点，next 置 NULL。`
      ] },
      { t: `tip`, color: `green`, text: `本课一句话：箭头是解引用加点号的简写，结构体指针让函数改到原件，自引用指针把节点串成链。` }
    ]
  }
] };
