喵站 · C++ 写稿规矩（第九轮，给每一批写正文与考卷的人看的唯一说明书）

   这一份不是代码，是 CONTRACT：写完必须自己跑闸（下面两条命令），闸不绿不许交。
   主控（另一个会话）会复跑一遍才算收工。

   ==================== 一、你在写什么 ====================
   两门课，源稿在 /run/media/fuka/99180618-d058-4083-83ed-c54d33771da1/学习资料/C++入门/
     · C++ 入门  = 源稿第 1–81 课   → 章 id c01…c81   → 正文 dev/frontend/assets/data/cpp/pNN.js
     · C++ 掌握  = 源稿第 82–213 课  → 章 id m82…m213  → 正文 dev/frontend/assets/data/cppm/pNN.js
   课号一律沿用源稿编号，不重排：第 82 课就是 82 号文件。
   课表（每课的标题、要求、任务清单）在 dev/tools/cpp/syllabus.json，按号段取用。

   每批交付两份文件（一份正文 + 一份考卷），号段互斥，别碰别人的文件：
     dev/frontend/assets/data/cpp/p03.js         window.MIAO_CPP_P03  = { chapters: [...] }
     dev/frontend/assets/data/cpp-exam/p03.js    window.MIAO_CPP_EXAM_P03 = { papers: [...] }
   掌握课同理：window.MIAO_CPPM_PNN / window.MIAO_CPPM_EXAM_PNN。

   ==================== 二、正文的款式（六栏课式） ====================
   黄金样板就两份，开写前先读它们，照款式走，别自己发明：
     入门：dev/frontend/assets/data/cpp/p01.js（c01–c05）
     掌握：dev/frontend/assets/data/cppm/p01.js（m82）

   一章的块顺序固定为：
     { t:`tip`, color:`blue`,  text:本课目标一句话 }
     { t:`h2`, text:`原理讲解` }   + 若干 { t:`p` } / { t:`ul`, items:[…] } / { t:`code` }
     { t:`h2`, text:`它被设计成什么样` 或 `怎么做` / `假设它能干什么` }（挑一个贴切的）
     { t:`h2`, text:`演示 1 · 小标题` } + { t:`code`, lang:`c++`, code:… } + { t:`p` 解读 }
     { t:`h2`, text:`演示 2 · …` }（2–4 个演示）
     { t:`h2`, text:`常见坑` } + { t:`ul` }（3–5 条，写具体的报错长相与根因）
     { t:`h2`, text:`任务` } + { t:`ul` }
     { t:`tip`, color:`green`, text:`本课一句话：…` }

   内容规矩（都是闸，违者退出码 1）：
     1. 源稿的讲解段（【这是什么】那套）与代码是你的骨架：代码原样用（可以补行内注释），
        解释要**扩写不要照抄** —— 他要求「比他现有的文件更详细、更有人味」：讲机制、给类比、
        写清「为什么是这样」，像跟人在屏幕前说话，不要写成 API 说明书。
     2. 源稿【任务】栏的每一条都要进正文的【任务】，原话为准（可以补一两条延伸任务，不能删）。
     3. 字符串分隔符是反引号 —— 正文、标题、代码里**一个反引号都不许出现**。要标代码名就裸写
        （println、std::vector）或用「」。
     4. 交叉引用只许往回指：写「第 N 课」时 N 必须 ≤ 本课课号，且 N 在 1–213 里真实存在。
        指向后面的改用「下一课」「以后再讲」这种人话。
     5. 代码块里不许出现本课以后才教的构造（闸按 cpp-audit.cjs 的 TEACH_AT 表判）。
        如果这一课确实要提前露一小脸而且**正文里当场讲明白了**，在章对象上点名：
        allowConstructs: [`member-call`]   // 键名见 cpp-audit.cjs 的 TEACH_AT 表
     6. lang 只能是 `c++`（真代码）、`shell`（终端命令）、`text`（ASCII 示意图）。
     7. 梗零容忍：不许出现「椰子蛋」，句尾不许出现「喵」。
     8. 规模：每章正文 ≤2,800 字、块 ≤30、单段代码 ≤14 行。他的要求是「更多字数、更详细」，
        所以低于 1,200 字的章会被打回（软指标，报表会点名）。
     9. 有机制值得画图的章，用 { t:`svg`, caption:`…`, code:`<svg …>…</svg>` }（内联 SVG）。
        硬规矩（G 闸逐条判，违者退出码 1）：caption 必填；必须以 <svg 开头；标签要配平；
        只准 svg/g/rect/circle/ellipse/path/line/polyline/polygon/text/tspan/defs/marker/
        linearGradient/radialGradient/stop/title 这些静态标签；不许 script/iframe/object/embed/
        animate/set，不许 on* / href / src 属性，style 里不许 url()（渲染层一律剥掉，写了白写）。
        颜色写死（别用 var()），字号 12–14，宽度按 640 画布排。不硬卡每章都有，但一个分部里至少 2 章有。
    9b. 讲解纯度（文风约定，目前不由闸强制，靠人守）：正文与图注里不写半角圆括号，
        函数名裸写（println、find_word），要补充说明用中文括号（）。
        已经交的每一批都按这条写了，继续保持；别为了它把话说别扭。
    10. H 闸「能编译」：带 int main 的完整代码块，用了什么都得把头文件请齐 ——
        std::cin/getline → <iostream>；std::string → <string>；println/print → <print>；
        vector → <vector>；智能指针 → <memory>；标准算法 → <algorithm>；
        map/set/queue/stack/priority_queue → 对应头文件；optional/variant/expected → 对应头文件；
        string_view → <string_view>（只包 <string> 不算）。没有 main 的片段块不查。
        这门课输出统一走 C++23 的 std::println，**不许出现 std::cout / cerr / << 输出流 / printf / scanf / goto**。

   ==================== 三、考卷的款式（笔试，不是跑代码） ====================
   C++ 在浏览器里跑不动，考试走**笔试引擎**（dev/frontend/assets/js/exam-paper.js）。
   一场卷的形状（照 dev/frontend/assets/data/cpp-exam/p01.js 写）：
     { cid:`c06`, kind:`paper`, pass:60, title:`第 6 课考试 · …`,
       task:`任务题目：…`（把本课源稿的任务写成一句人话）,
       hint:`想不起来就回看本课【演示 N】。`,
       questions:[ …6–10 题，score 合计必须正好 100… ],
       selftest:{ refs:[…], wrongs:[…], loose:[…] } }

   六种题型（字段名照 exam-paper.js）：
     choice  { id,type:`choice`,score,stem,options:[4],answer:下标,coversTask?,why }
     multi   { id,type:`multi`,score,stem,options:[…],answers:[下标…],coversTask?,why }
             —— 漏选给一半，错勾任何一项整题 0 分
     blank   { id,type:`blank`,score,stem,accept:[可接受答案…],coversTask?,why }
             —— 判分折叠空白、忽略大小写与全角，别把答案写死成一种说法（给 2–3 个 accept）
     code    { id,type:`code`,score,stem,acceptRegex:[`正则串`],matchAny?,coversTask?,why }
             —— 补代码：只按正则找关键写法在不在，空格/缩进/变量名一概不比；
                默认要求列出的每条正则都命中，只给一条最稳
     output  { id,type:`output`,score,stem,acceptLines:[`一行一条`],coversTask?,why }
             —— 读代码写输出：逐行宽松比对
     order   { id,type:`order`,score,stem,steps:[…],answer:[正确顺序的下标],coversTask?,why }

   结构硬指标（cpp-exam-check.cjs 判）：
     · 6–10 题；choice ≥2；output ≥1；
     · **源稿每一条【任务】都必须有题的 coversTask 对着它**（序号从 1 起，一条题可盖多条：
       coversTask: [1,2]）—— 他原话「把每一个文件的任务都写进考试」，这条是本轮的核心；
     · 带 coversTask 的题合计 ≥50 分（考的就是本课任务，不是泛泛概念题）；
     · 每题都写 why（交卷后逐题复盘要给人看）；
     · selftest：refs 是完整参考解，必须判 **100**（判不满说明题面写得没法答）；
       wrongs 是典型错解，必须 <60；loose 是「多个空格/换大小写/等价写法」，必须 ≥60。
       wrongs/loose 各至少 1 条。
     · 读者看得见的字段（task/hint/stem/options/steps/acceptLines/why）同样受梗、反引号、
       前向引用、提前接触四条闸管；selftest 里的串只喂判分器，读者看不到，不受闸。

   想知道「我这批某课到底能用哪些构造」，问闸 itself，别猜：
     node dev/tools/cpp-audit.cjs --lesson 59
     → 本课新拿到：…；以后才许用：引用参数 &（60 课）、指针（74）、智能指针（78）…

   ==================== 四、写完自己跑这两条（必须绿） ====================
     cd <仓库根>   # 喵站/
     export PATH="$HOME/tools/node/bin:$PATH"
     node dev/tools/cpp-audit.cjs --part dev/frontend/assets/data/cpp/p03.js
     node dev/tools/cpp-exam-check.cjs --only c06,c07,c08,c09,c10
     node --check dev/frontend/assets/data/cpp/p03.js
     node --check dev/frontend/assets/data/cpp-exam/p03.js
   报错就改到自己绿为止；改不动闸的（比如表里的 teachAt 明显错）在回报里说清是哪条、为什么，
   不要偷偷放宽正则、不要注释掉检查。

   ==================== 五、干活顺序（这条最重要） ====================
     1. 只读你号段内那几份源稿（ syllabus.json 里查文件名），读完**立刻动笔写第一个文件**；
        不许通读全部 213 份源稿、不许读解释器/判分器源码、不许读别的分部文件超过样板那两份。
     2. 一次写一章太碎，按「一章正文 + 一章考卷」推进，每写完一章就落盘一次（先落盘再核对）。
     3. 第一次写文件必须发生在前 5 次工具调用以内 —— 这是收工的硬判据。
     4. 只准新建/改你号段内那两份文件。别的一律不碰（包括 index.js、site.js、任务书、CSS）。
     5. 发现自己号段外的问题（源稿本身有错、闸的表不对），写进回报，不要顺手改。
     6. 只查自己：`--part` 只指你那一份、`--only` 只列你那几场。别敲不带参数的 cpp-audit /
        cpp-exam-check，也别敲 `--help` —— 那会全库扫描，扫到别人正在写的半截文件就冒一串
        假红（别人的章超字数、别人的分部跑不起来），你会花时间去追根本不归你的问题。
     7. 字数口径：**2,200–2,700 是目标区间，2,800 是硬线**。压着 2,800 写虽然不报错，
        但会被「超口径」报表点名；写长了就砍「它被设计成什么样」的第二段，别砍演示。

