/* 喵站 · C++ 派单模板（第九轮）
 *
 * 为什么要这个文件：主控的上下文是瓶颈 —— 每一路派单原来要重抄一遍口径（约一千 token），
 *   四十多批就把它烧光了。这里把**不变的规矩**收成一页，派单只写「号段 + 两个文件名 + 这一批的内容口径」，
 *   并让代理自己读这一页。规矩改一次，所有后续派单自动跟着改，不会出现「这批写了下批忘」。
 * 跑法：派单正文里写「先读 dev/tools/cpp-派单模板.md 与 dev/tools/cpp-写稿规矩.md」。
 */

一、文件规矩（违反就是事故）

  1. 每路只新建派单点名的那两份文件：正文分部 `cppm/pNN.js`（或 `cpp/pNN.js`）与考卷分部
     `cppm-exam/pNN.js`。变量名照已有分部：`window.MIAO_CPPM_PNN = { chapters: [...] }`、
     `window.MIAO_CPPM_EXAM_PNN = { papers: [...] }`。
  2. 一律禁改：`dev/tools/*`（闸与脚本）、`frontend/assets/js/*`、`frontend/assets/css/*`、
     `assets/data/site.js`、`assets/data/index.js`、`任务书.md`、以及任何别的 `pNN.js`。
  3. 号段互斥：别人正在写的分部文件不许碰。发现别人的文件红，写进回报，不动手。
  4. 只查自己：`cpp-audit --part <你那份>`、`cpp-exam-check --only <你那些场>`。
     **不带 --part/--only 的全库扫描不要跑** —— 会扫到别人正在写的半截文件，冒出来一串不归你的假红。
  5. 如果派单要求「追加」：只用 Edit 在数组末尾加，**严禁整份重写**（会撞掉别人已落的章）。

二、落盘纪律（今天上午断了六路，全靠这条保住货）

  1. 第一次写文件必须在前 3 次工具调用以内。
  2. 先把一章的骨架（六段式小标题 + 本课目标 tip）落盘，再逐段 Edit 填肉；一章完整了才开下一章。
  3. 一场考卷写完立刻落盘，别攒一批一起写。
  4. 不许通读全部源稿，不许读判分器/闸的源码，样板只读派单点名的那两份。

三、硬指标（两条闸都必须 exit 0，红一条都不许交）

  正文 `node dev/tools/cpp-audit.cjs --part <你那份>`：
    · 每章 ≥1 张内联 SVG 机制图，带 caption，标签配平；不许拿 text 块顶替。
    · 2,200–2,700 字（2,800 是硬线，压线会被「超口径」报表点名）；块 ≤30；单段代码 ≤14 行。
    · 六段式：本课目标（蓝 tip）→ 原理讲解 → 怎么做 / 它被设计成什么样 → 演示 1/2/3 → 常见坑 → 任务 → 一句话（绿 tip）。
    · 反引号 0、梗 0、前向引用 0（只许往回指课号，往前看统一写「下一课」「以后再讲」）。
    · **图注与 SVG 里的 <text> 文字同样受梗/反引号/前向引用三条闸管。**
    · H 能编译：带 `int main` 的块头文件必须请齐 —— println→<print>、std::string→<string>、
      vector<>→<vector>、标准算法→<algorithm>、std::views→<ranges>、智能指针→<memory>、
      optional→<optional>、variant→<variant>、expected→<expected>、stack→<stack>、
      queue/priority_queue→<queue>、map→<map>、set→<set>。不带 main 的片段块就别带 main，
      块首写一行注释「接上一段」。
  考卷 `node dev/tools/cpp-exam-check.cjs --only <你那些场>`：
    · 每场 7–8 题、`kind:"paper"`、`pass:60`、score 相加正好 100、choice ≥2、output ≥1。
    · 每题带 `why`；源稿每一条【任务】都要有题用 `coversTask` 对上；带 coversTask 的题合计 ≥50 分。
    · `selftest`：refs 判 100、wrongs 判 <60、loose（合法写法）判 ≥60。
    · 读者可见字段（题面/选项/hint/why/accept）同样受梗/反引号/前向引用/提前接触四条闸管。
  两份 `node --check` 都要过。

四、号段与查证

  `node dev/tools/cpp-audit.cjs --lesson N` 先查这一课新放行什么、以后才许用什么。
  要提前露脸的构造：正文当场讲透，并在章对象上写 `allowConstructs: ["表里的名字"]`，只点那一课那一个。
  闸表若有错（课号画高/画低、名字对不上），写进回报举证，**不许为了自己绿去改闸或加白名单**。

五、真实性（这门课的底裤）

  正文里每个数字、每行输出、每条「会崩/会越界/会退化」的说法，都要本机实跑：
    export PATH="$HOME/tools/node/bin:$PATH"      # node 不在 PATH
    g++ -std=c++23 x.cpp && ./x                   # 站在仓库根 喵站/ 敲命令
  错版也要真跑一遍（差一错误、忘判 end、`lo<=hi` 自配、少加回容斥那个重角……），
  把真实症状写进常见坑与 output 题；没实跑的东西必须明说没实跑（例如本机没装 cmake）。
  源稿讲错的按实测改写，回报里列「源稿勘误」。

六、回报（≤200 字）

  各章字数/块数/图数、各场卷题数与任务覆盖、两条闸最后一次输出与退出码、
  实跑了哪些数字、偏离口径之处、号段或闸表问题、越界发现（别人的文件红也只报不改）。
