/* 喵站 · C++ 掌握 正文分部 p29：第 171–174 课（第九轮）
 *
 * 源稿：171_BFS走迷宫.cpp、172_BFS数字变换.cpp、173_DFS剪枝.cpp、174_动态规划爬楼梯.cpp
 * 四课是一条「搜索到递推」的过渡带：BFS 用队列求最少步数，把数字也铺成地砖；
 * DFS 用剪枝在八皇后的树枝上提前掉头；最后爬楼梯把「数路径」压成一行加法，就是 DP。
 * 所有输出、dist 表、皇后计数、dp 表、溢出值均经本机 g++ -std=c++23 实跑核对。
 */
window.MIAO_CPPM_P29 = {
  chapters: [
    {
      id: `m171`, title: `第 171 课 · BFS 走迷宫：像水波一样一圈圈淹过去，第一次淹到终点就是最少步数`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用队列让格子「排队等扩散」，从起点一圈一圈向外淹，给每个格子记下第一次被淹到时走了几步；亲眼看着 dist 表一层层亮起来，再亲手在（1,0）砌一堵新墙，看看整条左路断掉之后终点会变成什么。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `BFS 广度优先搜索，套路像一个往水里扔石子：起点是落点，水波一圈一圈往外扩，同一圈上的格子离起点一样远。关键结论是**第一次淹到某格时记下的圈数，就是到它的最少步数**。道理不玄：波每单位时间只往外走一格，近的格子必然先被淹到，等波爬到你这格时，所有更近的路线早就试完了。所以「第一次」三个字就是最短性的全部来源。` },
        { t: `p`, text: `水波要有人来管节奏，管节奏的就是队列。想象每淹到一格就把它放进等待队伍，处理的时候**只从队首取、只往队尾加**：先进队伍的格子一定先被处理，于是第 1 圈的格子全部处理完，才会轮到第 2 圈，一圈秩序井然。这和栈那种「后进先出」正好相反 —— 换成栈，最新的格子插队先走，波就变成一条乱窜的触手，那是另一门搜索的形状，以后再讲。` },
        { t: `p`, text: `扩散时每个格子要过三道关卡：越界没、是不是墙、是不是已经被淹过。第三道最重要 —— dist 里存的是「第一次被淹到的圈数」，没淹过的格子统一放 -1 当哨兵；只要它不再是 -1，就说明早有更早的波来过，直接 continue 跳过。**标记必须打在入队那一刻**，不是出队之后：一格只许入队一次，队列才不会爆炸，步数也才不会被后来者改大。` },
        { t: `svg`, caption: `水波扩散的长相：每格标的是 dist 值，也就是水淹到这格时是第几圈。同圈同色：深蓝是起点 S，浅蓝两张 1 是第一圈，绿是第二三圈，黄橙是第四五圈，右上角那格要等第 7 圈才被底边的波绕上来。绿线是最短路线之一，5 圈淹到 G。全部数字本机 g++ -std=c++23 实跑`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 262">
  <text x="18" y="20" font-size="13" font-weight="700" fill="#142639">dist 表一圈圈亮起来：格子上的数就是圈数</text>
  <defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#1d7a3c"/></marker></defs>
  <g font-size="13" fill="#26405a">
    <rect x="170" y="48" width="90" height="46" rx="6" fill="#00599c"/><text x="215" y="76" text-anchor="middle" fill="#ffffff" font-weight="700">S 0</text>
    <rect x="268" y="48" width="90" height="46" rx="6" fill="#d7e7f8" stroke="#8b98ab"/><text x="313" y="76" text-anchor="middle" fill="#00599c" font-weight="700">1</text>
    <rect x="366" y="48" width="90" height="46" rx="6" fill="#454b57"/><text x="411" y="76" text-anchor="middle" fill="#ffffff">#</text>
    <rect x="464" y="48" width="90" height="46" rx="6" fill="#f6d9c0" stroke="#b8500f"/><text x="509" y="76" text-anchor="middle" fill="#b8500f" font-weight="700">7</text>
    <rect x="170" y="102" width="90" height="46" rx="6" fill="#d7e7f8" stroke="#8b98ab"/><text x="215" y="130" text-anchor="middle" fill="#00599c" font-weight="700">1</text>
    <rect x="268" y="102" width="90" height="46" rx="6" fill="#454b57"/><text x="313" y="130" text-anchor="middle" fill="#ffffff">#</text>
    <rect x="366" y="102" width="90" height="46" rx="6" fill="#fdeecd" stroke="#c3ccd8"/><text x="411" y="130" text-anchor="middle" fill="#b8500f" font-weight="700">5</text>
    <rect x="464" y="102" width="90" height="46" rx="6" fill="#f6d9c0" stroke="#b8500f"/><text x="509" y="130" text-anchor="middle" fill="#b8500f" font-weight="700">6</text>
    <rect x="170" y="156" width="90" height="46" rx="6" fill="#d9efdd" stroke="#1d7a3c"/><text x="215" y="184" text-anchor="middle" fill="#1d7a3c" font-weight="700">2</text>
    <rect x="268" y="156" width="90" height="46" rx="6" fill="#d9efdd" stroke="#1d7a3c"/><text x="313" y="184" text-anchor="middle" fill="#1d7a3c" font-weight="700">3</text>
    <rect x="366" y="156" width="90" height="46" rx="6" fill="#fdeecd" stroke="#c3ccd8"/><text x="411" y="184" text-anchor="middle" fill="#b8500f" font-weight="700">4</text>
    <rect x="464" y="156" width="90" height="46" rx="6" fill="#1d7a3c"/><text x="509" y="184" text-anchor="middle" fill="#ffffff" font-weight="700">G 5</text>
    <polyline points="215,71 215,125 215,179 313,179 411,179 509,179" fill="none" stroke="#1d7a3c" stroke-width="3.5" marker-end="url(#ar)" opacity="0.9"/>
    <text x="18" y="228" fill="#33465e">0 是落点，第一圈淹到两张 1，波贴着底边 2、3、4、5 一路推进，G 在第 5 圈被淹到。</text>
    <text x="18" y="248" fill="#b8500f">右上角那格到第 7 圈才被（1,2）的波绕上来；两格 -1 是墙本尊，永远没人淹它们。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `这套设计里 dist 表一人分饰两角：它既是**答案表**（最后查 dist[2][3] 就是答案），又是**防重入的签到表**（-1 表示没来过）。两件事共用一张表，省掉一个 visited 数组 —— 代价是你得记住 -1 是「还没淹到」而不是「不可达」，这两种含义要到扩散全部结束才分得开：跑完后仍是 -1 的空地才是真到不了的地方。` },
        { t: `p`, text: `开销也一目了然：每个格子至多入队一次、出队一次，每次出队只看四个邻居，所以总工作量跟格子数成正比，跟迷宫长什么样没关系。对比第 88 课那种二维 vector 上的老实枚举 —— 每条可能的路径都从头走一遍，路一多就指数爆炸 —— BFS 把「所有路径」压成了「每格一次签到」，这是它值钱的地方。` },
        { t: `h2`, text: `演示 1 · 源稿那段：起点入队，一圈圈扩散` },
        { t: `code`, lang: `c++`, code: `// 源稿 main 的前半：迷宫、dist 表、队列，三件套起手
const char* maze[3] = {"S.#.", ".#..", "...G"};   // S 起点 G 终点 # 墙
int R = 3, C = 4;
std::vector<std::vector<int>> dist(R, std::vector<int>(C, -1));  // -1 = 没被淹到
std::queue<std::pair<int, int>> q;
q.push({0, 0}); dist[0][0] = 0;                  // 起点 0 步，先入队
while (!q.empty()) {
    auto [r, c] = q.front(); q.pop();            // 取出队首格子
    for (auto [dr, dc] : {std::pair{0,1}, std::pair{1,0}, std::pair{0,-1}, std::pair{-1,0}}) {
        int nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= R || nc < 0 || nc >= C || maze[nr][nc] == '#' || dist[nr][nc] != -1) continue;
        dist[nr][nc] = dist[r][c] + 1;           // 步数 = 上一格 + 1
        q.push({nr, nc});                        // 排队，等着向外扩散
    }
}` },
        { t: `code`, lang: `c++`, code: `// 接上一段
std::println("S 到 G 最少 {} 步", dist[2][3]);   // 实测：S 到 G 最少 5 步` },
        { t: `p`, text: `实测打印「S 到 G 最少 5 步」。路线是（0,0）往下到（2,0），再贴着底边往右走四格里的三格：下、右、右、右、右，一共 5 步。注意 auto [r, c] 这一招：队首那个 pair 一口气拆成行号和列号，后面写 nr、nc 就不用再 q.front().first、q.front().second 地绕。四个方向摆进一个花括号列表里让范围 for 逐个试，是这课最省事也最常见的写法。` },
        { t: `h2`, text: `演示 2 · 本课任务一：把整个 dist 表打印出来，看水怎么扩` },
        { t: `code`, lang: `c++`, code: `// 接上一段：把整个 dist 表打印出来
for (int r = 0; r < R; ++r) {
    for (int c = 0; c < C; ++c) std::print("{:3}", dist[r][c]);
    std::println("");
}` },
        { t: `p`, text: `实测三行：0 1 -1 7、1 -1 5 6、2 3 4 5。这就是水波的本相：0 是落点 S；第一圈淹到（0,1）和（1,0），两张 1 并排；第二圈 2 只出现在（2,0）—— 因为（1,1）是墙，波被挡了一下；此后 3、4、5 沿底边一路亮过去。右上角那格 7 最有意思：它上面的（0,2）是墙，水只能从底下（1,2）那格绕一大圈才漫上来，所以它比 G 还晚两圈。两格 -1 是墙本尊，永远没人淹它们。` },
        { t: `h2`, text: `演示 3 · 本课任务二：把（1,0）也改成 #，结果变什么` },
        { t: `code`, lang: `c++`, code: `// 接上一段：只改一行 —— 第二行第一个格也砌上墙
const char* maze[3] = {"S.#.", "##..", "...G"};   // 原来是 ".#.."
// 其余代码一行不动，重跑一遍：
std::println("S 到 G 最少 {}", dist[2][3]);       // 实测：S 到 G 最少 -1` },
        { t: `p`, text: `实测答案是 -1。对照演示 2 的表看就明白：S 出发只有两个邻格，（0,1）右、（1,0）下；现在（1,0）砌死了，（0,1）的另外三个邻居分别是墙、墙和 S 自己 —— 波在第二格就全军覆没，G 连同整个右下角再也没被淹到，dist 停在 -1。所以**跑完之后 dist 还是 -1 的空地，才是真「不可达」**；可达时它早被第一圈波改写了。这也顺带告诉你：想让答案不出现负数，得在打印前自己判断一句是不是 -1。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把 dist != -1 这个判定删掉。本机实测直接挂死：队列里永远有新格子，while 一圈一圈空转，两秒内一个字都打不出来，只能靠 timeout 杀掉。根因是格子淹过又淹，彼此互相塞队，队列永远不空 —— 这是最典型的 BFS 死循环长相。`,
          `忘了给 dist 填 -1，写成 std::vector<std::vector<int>> dist(R, std::vector<int>(C))。全表默认是 0，被程序当成「早就淹过了」，一格都扩不出去，实测老老实实打出「S 到 G 最少 0 步」—— 起点的 0 变成了全表的 0。哨兵没了，签到表就全是假签到。`,
          `标记打在出队之后。看起来只挪了一行，实际一格会被邻居们反复塞进队列，队列从「每格最多一个」膨胀成「每格最多四个」，小迷宫看不出事，大迷宫直接慢一个量级；更糟的是出队时才标，同一批同圈的格子步数还可能互相踩。规矩一句话：入队那一刻就写 dist。`,
          `四道边界只写了上界。nr >= 0、nc >= 0 这两半最容易漏：漏了之后（0,0）往上扩就是 dist[-1]，operator[] 不查边界，编译器一声不吭，读到什么全看运气。四个条件一个都不能少，写的时候按「上、下、左、右」点着数。`,
          `把 dist 表当迷宫直接抄进题解。dist[0][2] 是 -1，可那格是墙不是「到不了」；dist 的 -1 在跑完前一律读作「还没轮到」。两种含义混着用，写「 reachable 判定」时就会把墙也放进来。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把整个 dist 表打印出来，看「水波」是怎么一圈圈扩开的。对照实测三行 0 1 -1 7、1 -1 5 6、2 3 4 5，逐格说出每个数是被哪个方向的波淹到的。`,
          `把（1,0）那格也改成 '#'，看看结果变成什么。实测是 -1：左路一断，波在第二格就断了线，说出（0,1）为什么救不了场。`,
          `延伸：把终点从（2,3）挪到（0,3），再用 dist 表查最少步数 —— 实测是 7，正好是演示 2 里那个「绕大圈」的数。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：BFS 用队列维持「一圈处理完才轮到下一圈」的秩序，dist 一张表兼做答案与签到，入队即标数、出队只发散 —— 第一次淹到谁，谁的步数就定死为最少。` }
      ]
    },
    {
      id: `m172`, title: `第 172 课 · BFS 数字变换：把数字铺成地砖，+1、-1、×2 就是三扇门`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：占位` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课 BFS 在格子上淹（第 171 课），这一课把「格子」换成「数字」：0 到 99 每个数是一块地砖，三扇门 -1、+1、×2 就是三个方向，从 5 走到 17 最少跨几格，就是最少操作次数。BFS 的最短性不挑地形 —— 只要每一步代价一样、状态能一个个枚举，第一次淹到目标时的圈数就是答案。队列管秩序、dist 记圈数、-1 当哨兵，上一课那套家什原样搬过来，一样都不用换。` },
        { t: `p`, text: `一维地图还省事：dist 的下标就是数本身，dist[17] 这一格装的就是答案，连行列坐标都省了。三扇门不是上下左右四个方向，而是三个算式，直接摆进花括号列表让范围 for 轮流试，比写三个 if 干净。越界检查从四条缩成两条：nxt < 0 或 nxt >= LIM 就跳过 —— LIM 是给地图围的栅栏，×2 这扇门冲得最猛，没有栅栏它能把下标一路翻出数组，实测程序当场被中止。栅栏怎么个保命法，常见坑里拿真机再验一遍。` },
        { t: `svg`, caption: `数字 BFS 的水波长相：每块砖下方的小数是实测 dist 值，绿线是实测最短路线之一，全图数字经 g++ -std=c++23 实跑核对`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 206">
  <text x="16" y="20" font-size="13" font-weight="700" fill="#142639">数轴也是地图：上排是数，下排是实测 dist（第几圈淹到）</text>
  <defs><marker id="ar2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#1d7a3c"/></marker></defs>
  <g font-size="12">
    <rect x="16" y="34" width="32" height="46" rx="4" fill="#d9efdd"/><text x="32" y="54" text-anchor="middle" font-size="13" fill="#1d7a3c" font-weight="700">3</text><text x="32" y="73" text-anchor="middle" fill="#1d7a3c">2</text>
    <rect x="50" y="34" width="32" height="46" rx="4" fill="#1d7a3c"/><text x="66" y="54" text-anchor="middle" font-size="13" fill="#ffffff" font-weight="700">4</text><text x="66" y="73" text-anchor="middle" fill="#ffffff">1</text>
    <rect x="84" y="34" width="32" height="46" rx="4" fill="#00599c" stroke="#1d7a3c" stroke-width="3"/><text x="100" y="54" text-anchor="middle" font-size="13" fill="#ffffff" font-weight="700">5</text><text x="100" y="73" text-anchor="middle" fill="#ffffff">0</text>
    <rect x="118" y="34" width="32" height="46" rx="4" fill="#d7e7f8"/><text x="134" y="54" text-anchor="middle" font-size="13" fill="#00599c" font-weight="700">6</text><text x="134" y="73" text-anchor="middle" fill="#00599c">1</text>
    <rect x="152" y="34" width="32" height="46" rx="4" fill="#d9efdd"/><text x="168" y="54" text-anchor="middle" font-size="13" fill="#1d7a3c" font-weight="700">7</text><text x="168" y="73" text-anchor="middle" fill="#1d7a3c">2</text>
    <rect x="186" y="34" width="32" height="46" rx="4" fill="#1d7a3c"/><text x="202" y="54" text-anchor="middle" font-size="13" fill="#ffffff" font-weight="700">8</text><text x="202" y="73" text-anchor="middle" fill="#ffffff">2</text>
    <rect x="220" y="34" width="32" height="46" rx="4" fill="#d9efdd"/><text x="236" y="54" text-anchor="middle" font-size="13" fill="#1d7a3c" font-weight="700">9</text><text x="236" y="73" text-anchor="middle" fill="#1d7a3c">2</text>
    <rect x="254" y="34" width="32" height="46" rx="4" fill="#d7e7f8"/><text x="270" y="54" text-anchor="middle" font-size="13" fill="#00599c" font-weight="700">10</text><text x="270" y="73" text-anchor="middle" fill="#00599c">1</text>
    <rect x="288" y="34" width="32" height="46" rx="4" fill="#d9efdd"/><text x="304" y="54" text-anchor="middle" font-size="13" fill="#1d7a3c" font-weight="700">11</text><text x="304" y="73" text-anchor="middle" fill="#1d7a3c">2</text>
    <rect x="322" y="34" width="32" height="46" rx="4" fill="#d9efdd"/><text x="338" y="54" text-anchor="middle" font-size="13" fill="#1d7a3c" font-weight="700">12</text><text x="338" y="73" text-anchor="middle" fill="#1d7a3c">2</text>
    <rect x="356" y="34" width="32" height="46" rx="4" fill="#fdeecd"/><text x="372" y="54" text-anchor="middle" font-size="13" fill="#b8500f" font-weight="700">13</text><text x="372" y="73" text-anchor="middle" fill="#b8500f">3</text>
    <rect x="390" y="34" width="32" height="46" rx="4" fill="#fdeecd"/><text x="406" y="54" text-anchor="middle" font-size="13" fill="#b8500f" font-weight="700">14</text><text x="406" y="73" text-anchor="middle" fill="#b8500f">3</text>
    <rect x="424" y="34" width="32" height="46" rx="4" fill="#f6d9c0"/><text x="440" y="54" text-anchor="middle" font-size="13" fill="#b8500f" font-weight="700">15</text><text x="440" y="73" text-anchor="middle" fill="#b8500f">4</text>
    <rect x="458" y="34" width="32" height="46" rx="4" fill="#1d7a3c"/><text x="474" y="54" text-anchor="middle" font-size="13" fill="#ffffff" font-weight="700">16</text><text x="474" y="73" text-anchor="middle" fill="#ffffff">3</text>
    <rect x="492" y="34" width="32" height="46" rx="4" fill="#1d7a3c"/><text x="508" y="54" text-anchor="middle" font-size="13" fill="#ffffff" font-weight="700">17</text><text x="508" y="73" text-anchor="middle" fill="#ffffff">4</text>
    <rect x="526" y="34" width="32" height="46" rx="4" fill="#fdeecd"/><text x="542" y="54" text-anchor="middle" font-size="13" fill="#b8500f" font-weight="700">18</text><text x="542" y="73" text-anchor="middle" fill="#b8500f">3</text>
    <rect x="560" y="34" width="32" height="46" rx="4" fill="#fdeecd"/><text x="576" y="54" text-anchor="middle" font-size="13" fill="#b8500f" font-weight="700">19</text><text x="576" y="73" text-anchor="middle" fill="#b8500f">3</text>
    <rect x="594" y="34" width="32" height="46" rx="4" fill="#d9efdd"/><text x="610" y="54" text-anchor="middle" font-size="13" fill="#1d7a3c" font-weight="700">20</text><text x="610" y="73" text-anchor="middle" fill="#1d7a3c">2</text>
    <line x1="98" y1="92" x2="68" y2="92" stroke="#1d7a3c" stroke-width="2.5" marker-end="url(#ar2)"/><text x="83" y="87" text-anchor="middle" fill="#1d7a3c" font-weight="700">-1</text>
    <line x1="70" y1="106" x2="198" y2="106" stroke="#1d7a3c" stroke-width="2.5" marker-end="url(#ar2)"/><text x="134" y="101" text-anchor="middle" fill="#1d7a3c" font-weight="700">×2</text>
    <line x1="206" y1="120" x2="470" y2="120" stroke="#1d7a3c" stroke-width="2.5" marker-end="url(#ar2)"/><text x="338" y="115" text-anchor="middle" fill="#1d7a3c" font-weight="700">×2</text>
    <line x1="472" y1="92" x2="504" y2="92" stroke="#1d7a3c" stroke-width="2.5" marker-end="url(#ar2)"/><text x="488" y="87" text-anchor="middle" fill="#1d7a3c" font-weight="700">+1</text>
    <text x="16" y="140" fill="#33465e">实测分圈：第 1 圈淹到 4、6、10，第 2 圈到 3、7、9、11、12、20，</text>
    <text x="16" y="158" fill="#33465e">第 3 圈到 13、14、16、18、19，15 和 17 要等到第 4 圈。</text>
    <text x="16" y="178" fill="#1d7a3c">绿格连出实测最短路线 5→4→8→16→17，共 4 步；×2 一步跳老远，圈数按次数算。</text>
    <text x="16" y="196" fill="#b8500f">加第四扇门 +3 再跑：17 提前一圈被淹到，dist 从 4 缩成 3，路线 5→8→16→17。</text>
  </g>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `dist 从二维缩成一维，队列里装的也从行列 pair 缩成一个 int —— 数本身就是坐标。表一人分饰两角的老规矩没变：既是答案册，最后查 dist[17] 就是答案；又是签到表，-1 表示这个数还没被淹到，两件事共用一个数组，省掉一份 visited。LIM=100 是世界的大小：100 以上的数在这张地图上不存在，×2 门冲出去就是出界，跟迷宫里迈出四条边一个性质。` },
        { t: `p`, text: `开销也照旧好算：每个数至多入队一次、出队一次，每次出队试三扇门，总工作量跟 LIM 成正比，跟答案离起点多远没关系。这课真正值得学的是那个翻译动作：题目问「最少操作次数」，我们答「最少跨几块砖」—— 状态不一定是坐标，任何能枚举、能定义「一步」的东西，都能铺成地图让 BFS 淹。` },
        { t: `h2`, text: `演示 1 · 源稿那段：从 5 出发，三扇门向外扩` },
        { t: `p`, text: `PH4` },
        { t: `h2`, text: `演示 2 · 本课任务一：打印 dist[10] 与 dist[18]，验证那条路线` },
        { t: `p`, text: `PH5` },
        { t: `h2`, text: `演示 3 · 本课任务二：加第四扇门 +3，再看 5 到 17` },
        { t: `p`, text: `PH6` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [ `PH7` ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [ `PH8` ] },
        { t: `tip`, color: `green`, text: `本课一句话：占位` }
      ]
    }
  ]
};
