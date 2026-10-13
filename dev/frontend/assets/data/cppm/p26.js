/* 喵站 · C++ 掌握 正文分部 p26：第 163–164 课（第九轮）
 *
 * 源稿：163_再滑一次最短达标段.cpp、164_前缀和.cpp
 * 163 是第 162 课「滑动窗口最长段」的镜像：同一套一进一出的齿轮，收缩条件反过来，答案也搬进循环里面。
 * 164 不是前缀和第一次登场 —— 第 111 课「数值算法与前缀和」已经写过 pre 数组与 std::partial_sum，
 * 本课往回接那次照面，把「多开一格当地基」这件事正式讲透。
 * 所有输出、步数、加法笔数、溢出后打印出来的数，均经本机 g++ -std=c++23 实跑核对。
 */
window.MIAO_CPPM_P26 = {
  chapters: [
    {
      id: `m163`, title: `第 163 课 · 再滑一次：这次求「和达标的最短段」，收缩的条件反过来了`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把上一课的窗口倒过来用，在一串正数里找「和 ≥ 目标」的最短连续段；说清 while 的条件怎么从「坏了才缩」变成「达标就缩」、为什么记长度必须写在循环里面，并把右端走几步、左端吐几次亲手数出来。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课第 162 课的窗口量的是最长不重复段：右端吃进一个字符，框里一旦撞见重复，左端就开始吐，吐到不撞为止；每走完一步、框干净的时候，拿 right - left + 1 去 max 一下。本课换成「找一段连续数字，和 ≥ target，越短越好」，框架一个字没换 —— 还是右端进、左端出、两个指针各自只朝一个方向走、绝不回头重扫。换掉的只有两件事，而这两件事就是这一课的全部：**收缩的条件反过来了，答案也在 inside 循环里取。**` },
        { t: `p`, text: `为什么必须反过来？因为「好」的方向变了。162 里窗口越宽越值钱，while 问的是「这框坏了没」，缩到不坏为止，缩完那一刻框是合法的，长度才拿去量。163 里窗口越窄越值钱：右端一路把和做大，sum 一旦 ≥ target，眼前这段已经是一个候选答案 —— 再往右扩只会更长，毫无意义；该做的是**把左端往里收一格，看收掉之后还达不达标**。于是 while 的条件从「非法」换成「达标」，循环体里第一件事记长度、第二件事才吐数字。达标是记答案的时机，不是缩手的时机，先记后吐，一颠倒就答错。` },
        { t: `code`, lang: `text`, code: `两课的四行对照，机器同一台，接线反了：
162 求最长：while 框里有重复 { left 往前走 }        best = max(best, right - left + 1)   ← 缩完再量
163 求最短：while sum >= target  { best = min(best, right - left + 1);  sum -= v[left++]; }  ← 先量再缩
一句话：收缩的条件反过来，答案的取值位置跟着钻进循环里。` },
        { t: `svg`, caption: `右扩到达标、左缩到不达标：2 3 1 2 4 3 上跑 target = 7 的三个快照。绿色格子是当时的窗口，每个快照下面那行是实测打出来的动作序列；best 依次取到 4、4、3、3、2，右端走 6 步、左端只吐 5 次`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 336">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">快照三则：和一旦 ≥ 7 就记长度并吐左端，吐到 &lt; 7 才把右端请回来</text>
  <g font-size="12" fill="#8b98ab">
    <text x="140" y="46" text-anchor="middle">0</text><text x="204" y="46" text-anchor="middle">1</text>
    <text x="268" y="46" text-anchor="middle">2</text><text x="332" y="46" text-anchor="middle">3</text>
    <text x="396" y="46" text-anchor="middle">4</text><text x="460" y="46" text-anchor="middle">5</text>
  </g>
  <text x="16" y="70" font-size="12" font-weight="700" fill="#142639">数组 v</text>
  <g font-size="13" fill="#26405a" font-weight="700">
    <rect x="110" y="52" width="60" height="26" rx="5" fill="#f2f5f9" stroke="#8b98ab" stroke-width="1.5"/><text x="140" y="70" text-anchor="middle">2</text>
    <rect x="174" y="52" width="60" height="26" rx="5" fill="#f2f5f9" stroke="#8b98ab" stroke-width="1.5"/><text x="204" y="70" text-anchor="middle">3</text>
    <rect x="238" y="52" width="60" height="26" rx="5" fill="#f2f5f9" stroke="#8b98ab" stroke-width="1.5"/><text x="268" y="70" text-anchor="middle">1</text>
    <rect x="302" y="52" width="60" height="26" rx="5" fill="#f2f5f9" stroke="#8b98ab" stroke-width="1.5"/><text x="332" y="70" text-anchor="middle">2</text>
    <rect x="366" y="52" width="60" height="26" rx="5" fill="#f2f5f9" stroke="#8b98ab" stroke-width="1.5"/><text x="396" y="70" text-anchor="middle">4</text>
    <rect x="430" y="52" width="60" height="26" rx="5" fill="#f2f5f9" stroke="#8b98ab" stroke-width="1.5"/><text x="460" y="70" text-anchor="middle">3</text>
    <text x="506" y="70" fill="#33465e">整段和 15</text>
  </g>
  <g font-size="12" fill="#26405a">
    <text x="16" y="106" font-weight="700">快照 1</text>
    <rect x="110" y="88" width="60" height="26" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/>
    <rect x="174" y="88" width="60" height="26" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/>
    <rect x="238" y="88" width="60" height="26" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/>
    <rect x="302" y="88" width="60" height="26" rx="5" fill="#fdece1" stroke="#b8500f" stroke-width="2"/>
    <rect x="366" y="88" width="60" height="26" rx="5" fill="#ffffff" stroke="#c9d3df" stroke-width="1.5"/>
    <rect x="430" y="88" width="60" height="26" rx="5" fill="#ffffff" stroke="#c9d3df" stroke-width="1.5"/>
    <text x="506" y="106">左 0 右 3</text>
    <text x="16" y="134">右端连走 4 步，和 2 到 5 到 6 到 8 第一次达标：记 4 格，吐掉 2，和回 6 —— 缩手停</text>

    <text x="16" y="166" font-weight="700">快照 2</text>
    <rect x="110" y="148" width="60" height="26" rx="5" fill="#ffffff" stroke="#c9d3df" stroke-width="1.5"/>
    <rect x="174" y="148" width="60" height="26" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/>
    <rect x="238" y="148" width="60" height="26" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/>
    <rect x="302" y="148" width="60" height="26" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/>
    <rect x="366" y="148" width="60" height="26" rx="5" fill="#fdece1" stroke="#b8500f" stroke-width="2"/>
    <rect x="430" y="148" width="60" height="26" rx="5" fill="#ffffff" stroke="#c9d3df" stroke-width="1.5"/>
    <text x="506" y="166">左 1 右 4</text>
    <text x="16" y="194">再进 4，和 10 又达标：吐 3 得 7 仍达标，于是再记一次 3 格；吐 1 得 6 才停 —— 一轮右扩记两回</text>

    <text x="16" y="226" font-weight="700">快照 3</text>
    <rect x="110" y="208" width="60" height="26" rx="5" fill="#ffffff" stroke="#c9d3df" stroke-width="1.5"/>
    <rect x="174" y="208" width="60" height="26" rx="5" fill="#ffffff" stroke="#c9d3df" stroke-width="1.5"/>
    <rect x="238" y="208" width="60" height="26" rx="5" fill="#ffffff" stroke="#c9d3df" stroke-width="1.5"/>
    <rect x="302" y="208" width="60" height="26" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/>
    <rect x="366" y="208" width="60" height="26" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/>
    <rect x="430" y="208" width="60" height="26" rx="5" fill="#fdece1" stroke="#b8500f" stroke-width="2"/>
    <text x="506" y="226">左 3 右 5</text>
    <text x="16" y="254">进最后那个 3，和 9：吐 2 得 7 记 3 格，吐 4 得 3 停 —— best 落到 2</text>

    <text x="16" y="284" fill="#00599c" font-weight="700">总账：右端走 6 步、左端吐 5 次，两个指针都只朝一个方向走，动作数不超过长度的两倍 —— 这就是「不用回头重扫」。</text>
    <text x="16" y="306" fill="#b8500f">把记长度挪到缩手之后，实测报出 1：这串数里没有一个数够得着 7，那个 1 是无中生有 —— 先记后吐不能倒。</text>
    <text x="16" y="326" fill="#33465e">橙色那格是刚被吐出去的：它正是答案那一段的头，可记长度时它还在窗口里。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `买到的东西是**总代价**。暴力写法拿每个左端点往右一段段试，动作数是长度平方量级；这台机器里 right 从 0 走到 n-1 一步不退，left 也只朝右，最多跟着走完 n 格，于是「进 n 次、出至多 n 次」，动作总数不超过 2n。上一课求最长、本课求最短，同一套齿轮两头都能用 —— 条件和取答案的位置对上就行，其余照抄。` },
        { t: `p`, text: `还剩一个角落：**可能压根没有达标段**。源稿的做法是 best 先放个 100 —— 它比这串数最长的段还长，一旦有解 min 一定把它换掉，换不动就说明无解。这招能用，但 100 是凭空的数，数组一过百格整套判决就废，第 126 课「魔法值的问题」批的正是这类东西。演示 3 把初值换成 n + 1，判决换成一句有根据的比较。` },
        { t: `h2`, text: `演示 1 · 源稿这段：六个数、target 是 7` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <algorithm>
int main() {
    std::vector<int> v = {2, 3, 1, 2, 4, 3};
    int target = 7, best = 100, sum = 0, left = 0;   // best 先放个大数
    for (int right = 0; right < static_cast<int>(v.size()); ++right) {
        sum += v[right];                             // 右端进一个数
        while (sum >= target) {                      // 达标了：记长度，顺带吐左端
            best = std::min(best, right - left + 1); sum -= v[left++];
        }
    }
    std::println("和 ≥ {} 的最短长度 = {}", target, best);
}` },
        { t: `p`, text: `实测输出「和 ≥ 7 的最短长度 = 2」，就是最后那两格 4 和 3 —— 和正好等于 target，一段都不能再短。整段六个数加起来是 15，所以 target 给到 15 时答案是 6 格；target 只要比 15 大就无解，这段代码会把 100 原样吐回给你。` },
        { t: `h2`, text: `演示 2 · 把每一步打到屏幕上：右扩到达标，左缩到不达标` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
int main() {
    std::vector<int> v = {2, 3, 1, 2, 4, 3};
    int target = 7, best = 100, sum = 0, left = 0;
    for (int right = 0; right < static_cast<int>(v.size()); ++right) {
        sum += v[right];                          // 右端进一个，和变大
        while (sum >= target) {                   // 达标：先记长度，再吐左端
            if (right - left + 1 < best) best = right - left + 1;
            std::println("记 {} 格 best={}；吐 v[{}]={}，sum {} -> {}，之后 left={}", right - left + 1, best, left, v[left], sum, sum - v[left], left + 1);
            sum -= v[left++];
        }
    }
}` },
        { t: `p`, text: `实测五行，逐行读就懂了。右端连走四步把和从 2 做到 8，第一次达标，记下 4 格、吐掉 v[0] 那个 2，和回到 6 —— 不达标，缩手停住，控制权交回右端。右端再进一个 4，和变 10 又达标，这次缩手连吐两轮：先吐 3 得 7，**还达标**，于是再记一次、长度 3；再吐 1 得 6 才停。一次右扩能引出好几回记录，这就是「答案在循环里取」的实际含义。最后右端进 3，缩手又是两轮，best 从 3 掉到 2，末行 left 停在 5：右端 6 步、左端 5 次吐，谁也没回头。` },
        { t: `h2`, text: `演示 3 · 本课任务：target 改 100，无解要说「无解」` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <algorithm>
int main() {
    std::vector<int> v = {2, 3, 1, 2, 4, 3};
    for (int target : {7, 15, 100}) {
        int n = static_cast<int>(v.size()), best = n + 1, sum = 0, left = 0;   // best 拿 n+1 当哨兵
        for (int right = 0; right < n; ++right) {
            sum += v[right];
            while (sum >= target) { best = std::min(best, right - left + 1); sum -= v[left++]; }
        }
        std::println("target={:3} -> {}", target, best > n ? "无解" : std::to_string(best) + " 格");
    }
}` },
        { t: `p`, text: `实测三行：target=7 得 2 格，target=15 得 6 格，target=100 得「无解」。关键只有两处：best 的初值从 100 换成 n + 1，判据从 best == 100 换成 best > n。前者要祈祷数组比 100 短，后者是**推出来的** —— 任何一段的长度都 ≤ n，best 还站在 n + 1 上，就只可能是没人动过它。源稿那条任务的 best == 100 在这组数据上照样对，只是把「答案的上界」跟「一个随手写的数」画了等号。空数组也顺带安全：循环一次不进，best 停在 1，判决照样是「无解」。` },
        { t: `h2`, text: `演示 4 · 两个对照实验：条件写成 > 会怎样、混进负数会怎样` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
#include <algorithm>
int main() {
    std::vector<int> v = {1, 2, -3, 5};            // 混进一个负数
    int target = 5, sum = 0, left = 0, best = static_cast<int>(v.size()) + 1;
    for (int right = 0; right < static_cast<int>(v.size()); ++right) {
        sum += v[right];
        while (sum >= target) { best = std::min(best, right - left + 1); sum -= v[left++]; }
    }
    std::println("窗口给的 = {}，左端只吐了 {} 次", best, left);
    std::println("退出时手里剩下 sum={} left={}", sum, left);
}` },
        { t: `p`, text: `先说条件。把 while (sum >= target) 手滑写成 while (sum > target)，同一组数据实测 best 从 2 变成 3 —— 4 加 3 正好等于 target 的那一段，严格大于的循环根本不进，最短的段被整个漏掉。达标线写的是 ≥，循环条件就得一字不差；这类题的差一错误九成出在这一个符号上。` },
        { t: `p`, text: `再说负数。上面这段实测窗口报 4，而真正的最短段是最后那一格 5 自己，长度 1。对着轨迹就明白输在哪：右端进 -3 时和**不升反降**，等它进 5、和刚好到 5，窗口还是那四格；缩手记下 4、吐掉 1，和立刻掉到 4，循环收手 —— 此后「只拿第 3 格当窗口」这一回再没被量过。吐掉的左端点不会自己回来：全为正时不需要，因为缩掉的左端点配同一个右端只会更长更差；有负数时这个推理就断了。本课不修它，只要求你认得出前提 —— **和随进出单调变化**。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把记长度写在 while 外面。这是照搬第 162 课接线顺序的必然结果：162 是缩完再量，163 是量完再缩。实测把 best 那句挪到 while 之后，target 给 7 会报出 1 —— 量的是已经不达标的窗口，而这串数里没有任何一个数自己够得上 7，错得格外「好看」，不报错也不崩。`,
          `收缩条件用 > 代替 >=：实测答案从 2 变 3，漏掉的正是和刚好等于 target 那一段。达标线是 ≥ 还是 >，题目一句话就定死了代码里那个符号。`,
          `best 的初值随手写个大数。写 100 在这题上侥幸，数组一长就露馅；用 n + 1，判无解用 best > n。这条判决顺手管住了空数组：一次都不进循环，best 停在 n + 1 上。`,
          `拿 left = right 这类跳法动左端。本课的 left 只能被 while 一格一格往前推；写成 left = right 之后，right - left + 1 就不再是「窗口里有几格」，best 会小得离谱。第 162 课的 left 可以跳，是因为那边有一张 last 表算出该跳到哪。`,
          `数组里出现负数还照用。实测 1 2 -3 5 那组窗口报 4、暴力枚举报 1，并排打出来才知道差多少。做题先看清「全是正数」这句话在不在题面里；不在，就换别的办法。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `target 改成 100（无解）：把打印改成 best == 100 时输出「无解」。做完再照演示 3 换一版：初值用 n + 1、判据用 best > n，说清这两种判决差在哪一句上。`,
          `照演示 2 把每一步打到屏幕上，在纸上画 right、left、best 三行表跟完 2 3 1 2 4 3，然后一句话回答：跟第 162 课那张表比，哪一列的方向反了？`,
          `延伸一：把 target 依次给成 15、1、16，各跑一遍，解释为什么 15 的答案正好是整段长度 6，而 16 就无解了。`,
          `延伸二：往数组里塞一个负数（照演示 4 那组），把窗口的答案和两层循环暴力枚举的答案各打一遍，报出这两个数，再说清差在哪一步。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：机器还是那台一进一出的机器，只是 while 的条件从「坏了才缩」换成「达标就缩」，于是收缩的条件反过来了、答案也在 inside 循环里取 —— 先记长度再吐左端，顺序倒过来就答错；前提是所有数都为正，和才单调。` }
      ]
    },
    {
      id: `m164`, title: `第 164 课 · 前缀和：多开一格当地基，问哪一段都只减一次`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把第 111 课照过面的 pre 数组正式立起来 —— 先把「从头到这里一共多少」全部算好存着，之后任何区间的和都只剩一次减法；说清为什么必须多开一格、pre[i] 存的为什么是「前 i 个」而不是「第 i 个」，并把问一次和问两千次的加法笔数亲手算出来。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `源稿那个类比很准：爬楼梯时在每个台阶上记一句「到目前为止走了几级」，之后问「第 5 层到第 9 层走了几级」，两个数一减就出来，不用重新爬。前缀和就是把「从第 1 个加到第 i 个」的全部答案先存进数组，之后每次区间查询只剩两次取值、一次减法。它买的是**查询次数**：问一次循环划算，问一千次前缀和碾压 —— 这句原话出自第 111 课，当时它站在 gcd 和 lcm 旁边当配角，一句「一减就出答案」带过；本课把它算成实数。` },
        { t: `p`, text: `所以这一课不是新授，是补账。第 111 课你已经写过 std::vector<int> pre(a.size() + 1, 0) 和 std::partial_sum，只是那时不必在乎多开一格与不多开的差别。今天要在乎：pre 有 n + 1 格，pre[i] 表示**前 i 个**的和，跟「第 i 格」差一个身位；多出来的 pre[0] = 0 表示「一个数都还没加」，是整张表的地基。` },
        { t: `svg`, caption: `两行对照：pre 的每一格站在 v 的两格之间那条缝上，pre[i] = 前 i 个的和。查第 2 到第 4 格就是一次减法 pre[5] - pre[2] = 14 - 4 = 10；数字全部来自本机实跑的建表与查询`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 316">
  <text x="20" y="20" font-size="13" font-weight="700" fill="#142639">v 五个数，pre 六个数 —— 差的那一格就是地基</text>
  <g font-size="12" fill="#8b98ab">
    <line x1="120" y1="52" x2="120" y2="132" stroke="#d7dfea" stroke-width="1" stroke-dasharray="3 3"/>
    <line x1="192" y1="52" x2="192" y2="132" stroke="#d7dfea" stroke-width="1" stroke-dasharray="3 3"/>
    <line x1="264" y1="52" x2="264" y2="132" stroke="#d7dfea" stroke-width="1" stroke-dasharray="3 3"/>
    <line x1="336" y1="52" x2="336" y2="132" stroke="#d7dfea" stroke-width="1" stroke-dasharray="3 3"/>
    <line x1="408" y1="52" x2="408" y2="132" stroke="#d7dfea" stroke-width="1" stroke-dasharray="3 3"/>
    <line x1="480" y1="52" x2="480" y2="132" stroke="#d7dfea" stroke-width="1" stroke-dasharray="3 3"/>
  </g>
  <text x="16" y="76" font-size="12" font-weight="700" fill="#142639">v 行</text>
  <g font-size="13" fill="#26405a" font-weight="700">
    <rect x="121" y="56" width="70" height="28" rx="5" fill="#f2f5f9" stroke="#8b98ab" stroke-width="1.5"/><text x="156" y="76" text-anchor="middle">3</text>
    <rect x="193" y="56" width="70" height="28" rx="5" fill="#f2f5f9" stroke="#8b98ab" stroke-width="1.5"/><text x="228" y="76" text-anchor="middle">1</text>
    <rect x="265" y="56" width="70" height="28" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="300" y="76" text-anchor="middle" fill="#1d7a3c">4</text>
    <rect x="337" y="56" width="70" height="28" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="372" y="76" text-anchor="middle" fill="#1d7a3c">1</text>
    <rect x="409" y="56" width="70" height="28" rx="5" fill="#eaf7ec" stroke="#1d7a3c" stroke-width="2"/><text x="444" y="76" text-anchor="middle" fill="#1d7a3c">5</text>
    <text x="494" y="76" font-size="12" fill="#1d7a3c">查这段：下标 2 到 4</text>
  </g>
  <g font-size="12" fill="#8b98ab">
    <text x="156" y="48" text-anchor="middle">0</text><text x="228" y="48" text-anchor="middle">1</text>
    <text x="300" y="48" text-anchor="middle">2</text><text x="372" y="48" text-anchor="middle">3</text><text x="444" y="48" text-anchor="middle">4</text>
  </g>
  <text x="16" y="126" font-size="12" font-weight="700" fill="#142639">pre 行</text>
  <g font-size="13" fill="#26405a" font-weight="700">
    <rect x="100" y="104" width="40" height="28" rx="5" fill="#e8eef8" stroke="#00599c" stroke-width="2"/><text x="120" y="124" text-anchor="middle" fill="#00599c">0</text>
    <rect x="172" y="104" width="40" height="28" rx="5" fill="#f2f5f9" stroke="#8b98ab" stroke-width="1.5"/><text x="192" y="124" text-anchor="middle">3</text>
    <rect x="244" y="104" width="40" height="28" rx="5" fill="#e8eef8" stroke="#00599c" stroke-width="2"/><text x="264" y="124" text-anchor="middle" fill="#00599c">4</text>
    <rect x="316" y="104" width="40" height="28" rx="5" fill="#f2f5f9" stroke="#8b98ab" stroke-width="1.5"/><text x="336" y="124" text-anchor="middle">8</text>
    <rect x="388" y="104" width="40" height="28" rx="5" fill="#f2f5f9" stroke="#8b98ab" stroke-width="1.5"/><text x="408" y="124" text-anchor="middle">9</text>
    <rect x="460" y="104" width="40" height="28" rx="5" fill="#e8eef8" stroke="#00599c" stroke-width="2"/><text x="480" y="124" text-anchor="middle" fill="#00599c">14</text>
  </g>
  <g font-size="12" fill="#8b98ab">
    <text x="120" y="150" text-anchor="middle">0</text><text x="192" y="150" text-anchor="middle">1</text>
    <text x="264" y="150" text-anchor="middle">2</text><text x="336" y="150" text-anchor="middle">3</text>
    <text x="408" y="150" text-anchor="middle">4</text><text x="480" y="150" text-anchor="middle">5</text>
  </g>
  <g font-size="12" fill="#26405a">
    <path d="M120 166 L120 178 L480 178 L480 166" fill="none" stroke="#00599c" stroke-width="1.5"/>
    <text x="188" y="196" fill="#00599c" font-weight="700">一次减法：pre[5] - pre[2] = 14 - 4 = 10，正好是绿的那三格之和</text>
    <text x="16" y="224">对齐关系：pre 的每一格画在 v 两格之间那条缝上 —— pre[3]=8 是「前三个数 3+1+4」，不是第 3 格那个 1。</text>
    <text x="16" y="246">左界为 0 时减的是 pre[0]，它就是地基，一句减法照样成立，不需要额外判断。</text>
    <text x="16" y="268" fill="#b8500f">地基不是装饰：不多开它，查「从头开始」那段就要写 pre[-1] —— 实测那种写法在 15 个区间里错 15 个。</text>
    <text x="16" y="292" fill="#33465e">建表花 n 次加法，此后每条查询只有两次取值和一次减法，跟区间多长没关系。</text>
    <text x="16" y="310" fill="#00599c">另一组实跑：v 换成 1 2 3 4 5，pre 是 0 1 3 6 10 15，第 3 到第 5 个 = 15 - 3 = 12。</text>
  </g>
</svg>` },
        { t: `p`, text: `多开一格买到的正是这条「缝」。pre 有 n + 1 格、pre[0] 是 0，查第 l 格到第 r 格 —— 两头都算上 —— 就永远是一句 pre[r + 1] - pre[l]：右界往后挪一格，左界站在原地，l 等于 0 时减的就是地基。少开这一格，这套式子得配一条分支才成立，而分支是最容易漏的零件。` },
        { t: `h2`, text: `怎么做：三行代码各自的分工` },
        { t: `p`, text: `第一行开 n + 1 格、全填 0 的容器，std::vector<int> pre(v.size() + 1, 0) 里第二个 0 是每格的初始值，地基由它替你写好。第二行建表只有一个动作 pre[i + 1] = pre[i] + v[i]，读的是**前一格的成果**，所以必须从左往右。第三行才是查询：两个下标、一次减法。建表花 n 次加法，此后每次查询几乎白拿。` },
        { t: `h2`, text: `演示 1 · 源稿这段：地基 0 与「第 2 到第 4 个」` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
int main() {
    std::vector<int> v = {3, 1, 4, 1, 5};
    std::vector<int> pre(v.size() + 1, 0);   // pre[0] = 0 当地基
    for (int i = 0; i < (int)v.size(); ++i)
        pre[i + 1] = pre[i] + v[i];          // 每层记「到这为止共多少」
    std::println("到第 3 个为止共 {}", pre[3]);
    std::println("第 2~4 个的和 = {}", pre[4] - pre[1]);
}` },
        { t: `p`, text: `实测两行：到第 3 个为止共 8，第 2~4 个的和 = 6。提醒一句数法：源稿注释里的「第 2~4 个」是**从 1 开始数**的说法，换成下标是 v[1] 到 v[3]，代码里写的还是 pre[4] - pre[1] —— 右界 +1、左界原样。两套数法混着记，正是差一错误的温床。` },
        { t: `h2`, text: `演示 2 · 本课任务：打印整个 pre，看它怎么长出来` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
int main() {
    std::vector<int> v = {3, 1, 4, 1, 5};
    std::vector<int> pre(v.size() + 1, 0);
    for (int i = 0; i < static_cast<int>(v.size()); ++i) {
        pre[i + 1] = pre[i] + v[i];
        std::print("填完 pre[{}]={:2}  此刻整个 pre：", i + 1, pre[i + 1]);
        for (int k = 0; k <= static_cast<int>(v.size()); ++k) std::print("{} ", pre[k]);
        std::println("");
    }
}` },
        { t: `p`, text: `实测五行，一行比一行右边多填一格：0 3 0 0 0 0、0 3 4 0 0 0、0 3 4 8 0 0、0 3 4 8 9 0、最后 0 3 4 8 9 14。读两件事。第一，表是从地基往右一格一格推出来的，任何时刻后面都还一片 0 —— 这也解释了建表循环为什么不能倒着走：实测把那个 for 改成从右往左，填出来的是 0 3 1 4 1 5，每格只读到还没被写的 0，整个 pre 退化成 v 右移一格，看着齐整、一条查询都不对。第二，pre[3] = 8 是 3+1+4，即**前三个数**的和。` },
        { t: `h2`, text: `演示 3 · 接上第 111 课那一句：std::partial_sum 与只许一次减法` },
        { t: `code`, lang: `c++`, code: `#include <numeric>
#include <print>
#include <vector>
int main() {
    std::vector<int> a = {1, 2, 3, 4, 5};
    std::vector<int> pre(a.size() + 1, 0);
    std::partial_sum(a.begin(), a.end(), pre.begin() + 1);   // 第 111 课那一句
    std::print("pre："); for (int x : pre) std::print("{} ", x); std::println("");
    std::println("第 3~5 个 = pre[5] - pre[2] = {} - {} = {}", pre[5], pre[2], pre[5] - pre[2]);
    std::println("第 1~5 个 = pre[5] - pre[0] = {} - {} = {}", pre[5], pre[0], pre[5] - pre[0]);
}` },
        { t: `p`, text: `实测三行：pre 是 0 1 3 6 10 15；第 3 到第 5 个 = 15 - 3 = 12；第 1 到第 5 个 = 15 - 0 = 15。最后这一行就是第 111 课那条任务「求第 3 到第 5 个元素的和，只许用一次减法」的通解长相：**减的是地基**，从来不需要破例。注意 std::partial_sum 把写入起点放在 pre.begin() + 1，它也是在给 pre[0] = 0 留位置。` },
        { t: `h2`, text: `演示 4 · 不多开一格会怎样：同一批区间把两种写法对跑` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
int main() {
    std::vector<int> v = {3, 1, 4, 1, 5};
    int n = static_cast<int>(v.size()), wrong = 0;
    std::vector<int> a(n + 1, 0), b(n, 0);            // a 多开一格，b 不多开
    for (int i = 0; i < n; ++i) { a[i + 1] = a[i] + v[i]; b[i] = (i ? b[i - 1] : 0) + v[i]; }
    for (int l = 0; l < n; ++l) for (int r = l; r < n; ++r) {
        int real = 0; for (int k = l; k <= r; ++k) real += v[k];
        if (a[r + 1] - a[l] != real) std::println("多开一格算错 [{},{}]", l, r);
        if (b[r] - b[l] != real) ++wrong;             // 照抄减法式、少掉 l == 0 那条分支
    }
    std::println("15 个区间跑完：多开一格的错 0 个；不多开又漏分支的错 {} 个", wrong);
}` },
        { t: `p`, text: `实测一行：15 个区间跑完，多开一格那版一句没错，一条 println 都没触发；不多开又漏分支那版**15 段全错**。为什么不是只错第一条？因为 b 的语义变了：b[r] - b[l] 算的是「第 l+1 格到第 r 格」，每条都少算左端那一格 —— 查 [2,4] 得 6 而真值 10，查 [1,1] 干脆得 0。而 l = 0 那几条更麻烦，正确写法要减 b[-1]，那一格压根不存在。所以「不多开」不是不能写，而是必须自带一条分支：l 为 0 时只取 b[r]，否则减 b[l - 1]。实测把分支补回去，两种写法逐条同值：[0,4] 都给 14、[2,4] 都给 10、[1,1] 都给 1。多开那一格，就是把这条分支焊死成「减 pre[0]，它等于 0」。` },
        { t: `h2`, text: `演示 5 · 算两笔账：问两千次要重扫多少回、一百万个数装不装得下` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
int main() {
    int n = 2000; std::vector<int> v(n, 1);           // 两千个 1
    std::vector<long long> pre(n + 1, 0);
    long long adds = 0; int queries = 0;
    for (int i = 0; i < n; ++i) pre[i + 1] = pre[i] + v[i];     // 建表：n 次加法
    for (int l = 0; l < n; ++l) {
        int r = (l * 7 + 31) % n; if (r < l) r = l;
        for (int k = l; k <= r; ++k) ++adds;          // 暴力：一段一段重扫
        long long fast = pre[r + 1] - pre[l]; ++queries;        // 前缀和：一减
    }
    std::println("{} 条查询：暴力 {} 次加法；前缀和 {} 次减法 + {} 次建表", queries, adds, queries, n);
}` },
        { t: `p`, text: `实测一行：2000 条查询，暴力做了 624992 次加法；前缀和只做 2000 次减法，外加建表 2000 次加法。减法条数等于查询数，而暴力的加法笔数是它的 312 倍，连建表一起算总账仍差 156 倍 —— 这就是第 111 课那句「问 1000 次前缀和碾压」的实数长相。` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
int main() {
    int n = 1000000;
    std::vector<int> v(n, 10000);                     // 一百万个一万，真值 1e10
    std::vector<int> pi(n + 1, 0);
    std::vector<long long> pl(n + 1, 0);
    for (int i = 0; i < n; ++i) { pi[i + 1] = pi[i] + v[i]; pl[i + 1] = pl[i] + v[i]; }
    std::println("long 版 pre[1000000] = {}", pl[n]);
    std::println("int  版 pre[1000000] = {}", pi[n]);
    int bad = 0; for (int i = 1; i <= n; ++i) if (pi[i] < pi[i - 1]) { bad = i; break; }
    std::println("int 版第一次越加越小在 pre[{}]，打印 {}", bad, pi[bad]);
    std::println("查后十万个：int 版 {}   long 版 {}", pi[n] - pi[900000], pl[n] - pl[900000]);
}` },
        { t: `p`, text: `实测四行：long 版是 10000000000，int 版同一格给出 1410065408；int 版第一次「越加越小」落在 pre[214749]，那格真值 2147490000，打印出来 -2147477296 —— 正是第 10 课「装不下的大数」那个上界 2147483647 后头的一步。最有意思的是最后一行：**后十万个元素这条查询，两种写法都给 1000000000，看着完全对**，因为区间两端绕过的圈数相同，一减互相抵消。可换成第 50 万格到最后一格那条，int 版给 705032704、真值 5000000000，差的正好是 4294967296 即 2 的 32 次方。溢出的可怕就在这儿：它不是每次都报错，有时会恰好给你一个正确的数。结论写死 —— pre 表一律 long long，结果也接在 long long 里；先做 int 减法再转换是来不及的，实测 30 万个一万那张表照样给出 -1294967296。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把 pre[i] 当成「第 i 格的值」，查询写成 pre[r] - pre[l]。实测这种照抄在 15 个区间里全错，每条少算左端那一格；正确式子是 pre[r + 1] - pre[l]。默念一遍「pre 站在缝上」就不会错。`,
          `建表方向写反。pre[i + 1] = pre[i] + v[i] 读的是前一格的成果，必须从左往右；实测从右往左填出 0 3 1 4 1 5，编译运行一切正常，一条查询都不对 —— 这类错不报错，只能靠打印整张表去抓，所以本课的任务正是「打印整个 pre」。`,
          `容器只开 v.size() 格，l = 0 的查询就去减 pre[-1]。编译器不拦，运行期看运气；老老实实开 n + 1 格，地基交给初始化那句去做。`,
          `用 int 存 pre。一百万个一万就穿，实测打印 1410065408 而真值一万亿，更糟的是有些区间查询看着是对的。前缀和天生越加越大，比 v 本身更容易撑爆 —— 默认 long long。`,
          `把「第 2 到第 4 个」这种话里的数法和下标混起来。源稿那句从 1 数起，对应 pre[4] - pre[1]；从 0 数起就是 pre[5] - pre[2]。两条都对，但必须落在同一种数法里。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `打印整个 pre 数组，观察它怎么长出来的。照演示 2 每加一格就把整张表打一行，然后回答：为什么填到第 i 行时后面全是 0。`,
          `拿演示 4 那 15 个区间，把两种开法的每条结果并排打出来对一遍，说出「不多开」那条分支该写在哪一句里、不写会错几条。`,
          `延伸一：用第 111 课那串 1 2 3 4 5，只许用一次减法算出第 3 到第 5 个的和，再自己出三条查询各验一遍，把输出抄下来。`,
          `延伸二：把演示 5 的 pre 从 long long 换回 int，拿一百万个数跑一遍，报出你看到的第一个「越加越小」的下标，并解释为什么有一类区间查询照样给了正确答案。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：pre 多开一格、pre[0] = 0 当地基，于是「前 i 个的和」跟站在缝上的下标一一对上，任何区间都是 pre[r + 1] - pre[l] 一次减法；第 111 课那次照面只留了一句「一减就出」，今天把它的账本、分支和溢出都补齐了。` }
      ]
    }
  ]
};
