#!/usr/bin/env node
/* 喵站 · T-14 build-your-own-x 数据生成器（只产索引骨架，不产正文）
 *
 * 干什么：
 *   1. 抓 danistefanovic/build-your-own-x 的 README。本机走 GitHub raw 很慢、api.github.com 有速率
 *      限制，jsDelivr 实测可用但**必须加 -4**（IPv4），否则连不上。原文缓存到 dev/tools/byox-raw.md；
 *      缓存已存在且解析得出台账数字（30 类目 / 359 篇）就不再联网 —— 幂等、可复跑。
 *   2. 解析「类目 → 篇目 → {语言标签, 标题, URL, 是否 [video]}」。
 *   3. 产两份文件：
 *        dev/tools/byox-index.json               机器可读全量索引（类目→篇目，给人核对）
 *        dev/frontend/assets/data/byox-data.js   30 门教程骨架，每章只有两个占位块
 *   4. 自校验并打印真实数字；任一条不符 → 退出码 1，并说清差在哪。
 *      校验口径来自 dev/任务书.md §11.2；对不上就是解析器漏了行格式，要修解析器，不许改台账数字。
 *
 * 红线（任务书 D-30 / D-31）：本站只写原创中文导读，绝不搬运原文正文。
 * 这一步 blocks 里只有 tip + p 两个占位块，正文由后续批次（T-15）填。
 *
 * 用法：
 *   node dev/tools/byox-gen.js                 正常生成（缓存命中则不联网）
 *   node dev/tools/byox-gen.js --force-fetch   强制重抓 README
 *   node dev/tools/byox-gen.js --check-only    不写文件，只跑解析与校验
 *   node dev/tools/byox-gen.js --emit-site-rows 把 site.js 里那 30 行登记打到 stdout
 *
 * 为什么是 30 个全局名而不是一个（重要，先读过 assets/js/data.js 才这么定的）：
 *   data.js 的组装是 `var pack = root[reg.source]; var t = pack && pack.tutorial;`
 *   —— 一份 source 只能对**一门**教程，且硬校验 reg.id === pack.tutorial.id，对不上就 console.error 并跳过。
 *   所以 byox-data.js 既挂 window.MIAO_BYOX（30 门全量数组，给测试与批量工具用），
 *   又按 data.js 认的口径给每门再挂一个独立全局名 window["MIAO_BYOX_" + 大写缩写]（如 MIAO_BYOX_3D）。
 *   id 以数字开头（3d）没关系：全局名走 window[...] 下标写、章节 id 是字符串 "3d-c01"，
 *   全程没把它们当 JS 裸标识符拼进对象字面量。
 */
"use strict";

const fs = require("fs");
const path = require("path");
const cp = require("child_process");
const vm = require("vm");

/* ---------------- 路径 ---------------- */
const TOOL_DIR = __dirname;
const DEV_DIR = path.resolve(TOOL_DIR, "..");
const FRONT_DIR = path.join(DEV_DIR, "frontend");
const RAW_FILE = path.join(TOOL_DIR, "byox-raw.md");
const INDEX_FILE = path.join(TOOL_DIR, "byox-index.json");
const DATA_FILE = path.join(FRONT_DIR, "assets", "data", "byox-data.js");
const SITE_FILE = path.join(FRONT_DIR, "assets", "data", "site.js");
const HTML_FILE = path.join(FRONT_DIR, "index.html");

const RAW_URL = "https://cdn.jsdelivr.net/gh/danistefanovic/build-your-own-x@master/README.md";
const REPO = "danistefanovic/build-your-own-x";
const GEN_STAMP = "2026-10-06";   /* 本轮台账日期；updated 用它，同一份 README 复跑产物不变 */

/* ---------------- 台账硬数字（dev/任务书.md §11.2） ---------------- */
const EXPECT = {
  categories: 30,
  lessons: 359,
  /* 类目 top3 */
  byCat: { "Web Server": 73, "Programming Language": 41, "Game": 34 },
  /* 语言分布：按 `* [**语言**:` 的整条标签统计（§11.2 同一口径，复合标签算一种） */
  langTop: {
    Python: 72, JavaScript: 51, C: 49, "C++": 33, Go: 23, Rust: 17,
    "Node.js": 15, "C#": 14, Ruby: 13, Nim: 9, Java: 8
  },
  langDistinct: 41
};

const BIG_CAT = "计算机基础";   /* 对不上号的兜底归到这门（他分类表里已有） */

/* ---------------- 缩写表（用户定的，顺序＝站内登记顺序；不许自己发明） ---------------- */
const CATS = [
  {
    src: "Web Server", abbr: "web", zh: "Web 服务器", title: "从零写一个 Web 服务器", diff: "入门",
    topics: ["HTTP", "TCP", "后端"],
    intro: "这一类要你自己造一个能收浏览器请求的服务器：从监听端口的 TCP socket 起步，逐行解析请求行和头部，把静态文件原样回出去，再一层层加上路由、查询串、Cookie、会话、模板与并发。走完就明白所有 Web 框架替你藏起来了什么。清单来自 build-your-own-x，站内每章都给出原文链接。"
  },
  {
    src: "Programming Language", abbr: "lang", zh: "编程语言", title: "从零造一门编程语言", diff: "进阶",
    topics: ["编译器", "解释器", "语言设计"],
    intro: "这一类要你自己造一门语言：写词法分析器把源码切成 token，写语法分析器搭出语法树，再要么直接求值、要么编成字节码丢进自己的虚拟机跑，最后往上补类型、闭包、宏和垃圾回收。清单来自 build-your-own-x，每章都附原文链接。"
  },
  {
    src: "Game", abbr: "game", zh: "游戏", title: "从零做一个游戏", diff: "入门",
    topics: ["游戏开发", "图形", "碰撞"],
    intro: "这一类要你自己造游戏和小游戏引擎：开窗口、画帧、读输入、跑主循环，再做碰撞、重力、精灵动画与关卡，最后攒出一个能反复用的引擎。清单来自 build-your-own-x，每章都附原文链接。"
  },
  {
    src: "Blockchain / Cryptocurrency", abbr: "chain", zh: "区块链", title: "从零写一条区块链", diff: "进阶",
    topics: ["区块链", "密码学", "共识"],
    intro: "这一类要你自己造一条链：哈希函数与非对称签名打底，把交易打包成区块、用前向哈希串成链，再加工作量证明、P2P 广播和钱包，亲手验一遍“为什么改不了历史记录”。清单来自 build-your-own-x。"
  },
  {
    src: "Operating System", abbr: "os", zh: "操作系统", title: "从零写一个操作系统", diff: "进阶",
    topics: ["内核", "中断", "进程调度"],
    intro: "这一类要你自己造一个能开机跑起来的内核：从引导扇区和启动入口写起，先在屏幕上打出字符，再搭中断描述表、键盘驱动、内存管理、进程调度，直到执行第一个用户态程序。清单来自 build-your-own-x。"
  },
  {
    src: "Neural Network", abbr: "nn", zh: "神经网络", title: "从零搭一个神经网络", diff: "进阶",
    topics: ["深度学习", "反向传播"],
    intro: "这一类要你自己造神经网络：不靠框架，手写矩阵乘法、激活函数、前向传播和反向传播的梯度推导，把 MNIST 手写数字练到认得出来，再往上叠卷积、优化器与训练循环。清单来自 build-your-own-x。"
  },
  {
    src: "Bot", abbr: "bot", zh: "Bot 机器人", title: "从零做一个 Bot", diff: "入门",
    topics: ["Webhook", "API", "自动化"],
    intro: "这一类要你自己造一个会自动回话的机器人：接平台 Webhook、验签名、解析消息、按命令路由，再补定时抓取、轮询和第三方服务。做完就把“对接接口”这件事摸透了。清单来自 build-your-own-x。"
  },
  {
    src: "Front-end Framework / Library", abbr: "fe", zh: "前端框架", title: "从零造一个前端框架", diff: "进阶",
    topics: ["虚拟 DOM", "响应式", "组件"],
    intro: "这一类要你自己造框架的核：用 JS 建节点、做虚拟 DOM 与 diff、实现响应式数据和组件渲染，让状态变化以最小代价刷到屏幕上。React/Vue 那些 API 背后干的事一目了然。清单来自 build-your-own-x。"
  },
  {
    src: "Database", abbr: "db", zh: "数据库", title: "从零写一个数据库", diff: "进阶",
    topics: ["存储引擎", "SQL", "事务"],
    intro: "这一类要你自己造一个数据库：磁盘页与缓冲池、B 树或 LSM 索引、SQL 词法语法、执行器、事务与崩溃恢复，一路做到分布式 KV。清单来自 build-your-own-x。"
  },
  {
    src: "Emulator / Virtual Machine", abbr: "emu", zh: "模拟器与虚拟机", title: "从零写一个模拟器或虚拟机", diff: "进阶",
    topics: ["指令集", "CPU 模拟"],
    intro: "这一类要你自己造模拟器：把目标机型的寄存器、内存和指令表实现出来，跑取指—解码—执行的死循环，再接上屏幕与按键，让别人的 ROM 在你的程序里动起来。清单来自 build-your-own-x。"
  },
  {
    src: "3D Renderer", abbr: "3d", zh: "3D 渲染器", title: "从零做一个 3D 渲染器", diff: "进阶",
    topics: ["图形学", "光栅化", "光线追踪"],
    intro: "这一类要你自己造渲染器：从往画布上点第一个像素开始，做投影、三角形光栅化、Z 缓冲、光照与纹理映射，再走到光线追踪和全局光照。清单来自 build-your-own-x。"
  },
  {
    src: "Command-Line Tool", abbr: "cli", zh: "命令行工具", title: "从零做一个命令行工具", diff: "入门",
    topics: ["终端", "参数解析"],
    intro: "这一类要你自己造终端里的小工具：解析 argv 与子命令、读写配置、输出彩色与光标控制、处理管道和进度条，最后做成你每天真会用的那一个。清单来自 build-your-own-x。"
  },
  {
    src: "Regex Engine", abbr: "regex", zh: "正则引擎", title: "从零实现一个正则引擎", diff: "进阶",
    topics: ["自动机", "字符串匹配"],
    intro: "这一类要你自己造正则引擎：把正则表达式解析成语法树，编译成 NFA（Thompson 构造）或直接用递归回溯匹配，再补量词、分组、贪婪与惰性。grep 的心脏就是这么回事。清单来自 build-your-own-x。"
  },
  {
    src: "Git", abbr: "git", zh: "Git", title: "从零实现一个 Git", diff: "进阶",
    topics: ["版本控制", "对象库"],
    intro: "这一类要你自己造一个迷你 Git：写 .git 目录和 blob/tree/commit 对象、内容寻址，实现 init/add/commit/log，再做分支、合并、diff 与三方合并。清单来自 build-your-own-x。"
  },
  {
    src: "Physics Engine", abbr: "physics", zh: "物理引擎", title: "从零做一个物理引擎", diff: "进阶",
    topics: ["刚体", "碰撞", "数值积分"],
    intro: "这一类要你自己造物理世界：向量与刚体、显式与半隐式积分、碰撞检测和响应、约束求解与堆叠稳定性。做完你的小球才会正确地落下来、摞起来不倒。清单来自 build-your-own-x。"
  },
  {
    src: "Shell", abbr: "shell", zh: "Shell", title: "从零写一个 Shell", diff: "进阶",
    topics: ["进程", "管道"],
    intro: "这一类要你自己造一个 shell：读一行命令、切词、fork/exec 起进程，再加内建命令、变量、输入输出重定向、管道、通配符和作业控制。清单来自 build-your-own-x。"
  },
  {
    src: "Augmented Reality", abbr: "ar", zh: "增强现实", title: "从零做一个增强现实系统", diff: "进阶",
    topics: ["视觉", "相机标定"],
    intro: "这一类要你自己造 AR：从相机取流与标定开始，识别标记或特征点、估计位姿、算投影矩阵，把虚拟物体稳稳贴进真实画面。清单来自 build-your-own-x。"
  },
  {
    src: "Docker", abbr: "docker", zh: "Docker 容器", title: "从零实现一个 Docker", diff: "进阶",
    topics: ["namespace", "cgroup", "容器"],
    intro: "这一类要你自己造容器运行时：用 namespace 做隔离、cgroup 做限额、chroot/pivot_root 换根文件系统，再实现镜像分层与联合挂载，亲手 run 出一个“容器”。清单来自 build-your-own-x。"
  },
  {
    src: "Search Engine", abbr: "search", zh: "搜索引擎", title: "从零做一个搜索引擎", diff: "进阶",
    topics: ["爬虫", "倒排索引", "排序"],
    intro: "这一类要你自己造搜索：爬虫抓页面、去重、分词建倒排索引，再做 TF-IDF/BM25 打分、PageRank 与结果高亮，最后给出一个能输关键词的搜索框。清单来自 build-your-own-x。"
  },
  {
    src: "Text Editor", abbr: "editor", zh: "文本编辑器", title: "从零写一个文本编辑器", diff: "入门",
    topics: ["终端 UI", "光标", "缓冲区"],
    intro: "这一类要你自己造编辑器：终端原始模式、光标行列状态机、逐行渲染、按键映射与撤销栈，做一个能改文件能存盘的模态编辑器。清单来自 build-your-own-x。"
  },
  {
    src: "BitTorrent Client", abbr: "bt", zh: "BitTorrent 客户端", title: "从零实现 BitTorrent 客户端", diff: "进阶",
    topics: ["P2P", "协议"],
    intro: "这一类要你自己造下载器：解析 .torrent 的 bencode、向 tracker 要 peer、和 peer 握手交换 bitfield，按 tit-for-tat 策略取 piece 并用哈希校验写盘。清单来自 build-your-own-x。"
  },
  {
    src: "Template Engine", abbr: "tpl", zh: "模板引擎", title: "从零实现一个模板引擎", diff: "入门",
    topics: ["解析", "HTML"],
    intro: "这一类要你自己造模板引擎：把带占位符与循环判断的模板扫成 token、搭成 AST，再用数据渲染出 HTML，顺手做转义和错误定位。清单来自 build-your-own-x。"
  },
  {
    src: "Network Stack", abbr: "net", zh: "网络协议栈", title: "从零实现一个网络协议栈", diff: "进阶",
    topics: ["TCP/IP", "以太网"],
    intro: "这一类要你自己造协议栈：从以太网帧与 ARP 开始，实现 IPv4 分片重组、ICMP、UDP 与 TCP 状态机、滑动窗口和重传，最后真能 ping 通、抓到页面。清单来自 build-your-own-x。"
  },
  {
    src: "AI Model", abbr: "aimodel", zh: "AI 大模型", title: "从零训一个 AI 大模型", diff: "进阶",
    topics: ["Transformer", "训练", "推理"],
    intro: "这一类要你自己造大模型：分词器、词嵌入、自注意力与多头、前馈层、残差连接，把 Transformer 一层层搭起来，再预训练、微调、量化并跑推理。清单来自 build-your-own-x。"
  },
  {
    src: "Visual Recognition System", abbr: "vision", zh: "视觉识别系统", title: "从零做一个视觉识别系统", diff: "进阶",
    topics: ["图像处理", "特征匹配"],
    intro: "这一类要你自己造会认东西的系统：图像预处理、边缘与角点、特征描述与匹配、分类或检测模型，再连上摄像头做实时识别与跟踪。清单来自 build-your-own-x。"
  },
  {
    src: "Web Browser", abbr: "browser", zh: "Web 浏览器", title: "从零写一个 Web 浏览器", diff: "进阶",
    topics: ["渲染管线", "HTML", "CSS"],
    intro: "这一类要你自己造浏览器：HTML 解析成 DOM、CSS 选择器与级联、布局树算盒模型、绘制成显示列表再合成上屏，中间还要网络层和 JS 执行。清单来自 build-your-own-x。"
  },
  {
    src: "Distributed Systems", abbr: "dist", zh: "分布式系统", title: "从零搭一套分布式系统", diff: "进阶",
    topics: ["共识", "复制", "容错"],
    intro: "这一类要你自己造分布式的一套：RPC、节点发现、复制日志、Raft 共识、快照与成员变更，最后落成一个能容忍节点挂掉的分布式 KV。清单来自 build-your-own-x。"
  },
  {
    src: "Memory Allocator", abbr: "alloc", zh: "内存分配器", title: "从零实现内存分配器", diff: "进阶",
    topics: ["堆管理", "malloc"],
    intro: "这一类要你自己造 malloc/free：向操作系统要堆页、维护空闲链表与分箱、块的拆分合并与碎片处理，再加上标记整理式的回收。清单来自 build-your-own-x。"
  },
  {
    src: "Processor", abbr: "cpu", zh: "处理器", title: "从零造一颗处理器", diff: "进阶",
    topics: ["数字逻辑", "指令集", "流水线"],
    intro: "这一类要你自己造 CPU：从与非门和触发器起步，定义指令集、搭数据通路与控制逻辑、做流水线和冒险处理，最后用 Verilog 在 FPGA 上跑起自己写的程序。清单来自 build-your-own-x。"
  },
  {
    src: "Voxel Engine", abbr: "voxel", zh: "体素引擎", title: "从零做一个体素引擎", diff: "进阶",
    topics: ["体素", "网格生成", "区块"],
    intro: "这一类要你自己造体素世界：体素数据的存取与区块划分、面剔除与贪婪合并生成网格、光照传播，再加地形生成与流体模拟。那类方块游戏的底座就是它。清单来自 build-your-own-x。"
  }
];

/* ---------------- 分组与难度（第四轮定的，见任务书 §11.7）----------------
 * app.js 的 chip 过滤比的是 t.cat === 小类名，所以 cat 必须是 categories 里真实存在的小类；
 * 30 个小类会把首页撑成一堵按钮墙，这里收成 6 组。
 * 难度词也必须落进 app.js 写死的那三档（入门/掌握/精通），「进阶」点不出东西。
 */
/* 归类只用他分类表里**已有**的小类，不新造大类。对不上号的都进「计算机基础」。
   他要是觉得哪门该挪，改这张表就行。 */
const GROUPS = {
  git: ["git"],
  linux: ["docker", "shell"],
  "vs code": ["editor", "cli"],
  Agent: ["bot"],
  "大模型": ["nn", "aimodel"],
  "嵌入式": ["emu"],
  "算法": ["lang", "regex", "tpl", "search", "db"],
  "计算机基础": ["web", "fe", "browser", "os", "cpu", "alloc", "net", "dist", "bt", "chain",
    "game", "physics", "3d", "voxel", "ar", "vision"]
};
const GROUP_OF = {};
Object.keys(GROUPS).forEach(function (g) { GROUPS[g].forEach(function (a) { GROUP_OF[a] = g; }); });

const MASTER = ["os", "lang", "nn", "3d", "net", "dist", "browser", "fe", "cpu", "alloc"];
function diffOf(meta) {
  return MASTER.indexOf(meta.abbr) >= 0 ? "精通" : (meta.diff === "入门" ? "入门" : "掌握");
}

/* ---------------- CLI ---------------- */
const argv = process.argv.slice(2);
const FORCE_FETCH = argv.includes("--force-fetch");
const CHECK_ONLY = argv.includes("--check-only");
/* 只画封面：BYOX 现在被摘出站点（等正文填好再登记），自检会抱怨没登记，这个模式绕开它 */
const COVERS_ONLY = argv.includes("--covers");
const EMIT_SITE_ROWS = argv.includes("--emit-site-rows");

const problems = [];
const notes = [];
function bad(msg) { problems.push(msg); }

/* ============ 1. 抓取 ============ */
function fetchRaw() {
  /* -4 是必须的：这台机走 v6 到 jsDelivr 连不上（任务书 §11.2 也是这么抓的） */
  const args = ["-4", "-sL", "--fail", "--max-time", "90", "-o", RAW_FILE, RAW_URL];
  try {
    cp.execFileSync("curl", args, { stdio: ["ignore", "pipe", "pipe"] });
  } catch (e) {
    bad("抓取失败：curl " + args.slice(0, 4).join(" ") + " … → " + (e && e.message ? e.message : String(e)));
    return null;
  }
  if (!fs.existsSync(RAW_FILE)) { bad("curl 正常退出但没写出缓存：" + RAW_FILE); return null; }
  return fs.readFileSync(RAW_FILE, "utf8");
}

/* ============ 2. 解析 ============
 * 条目行形如：* [**Python**: _标题_](https://…) [video]
 * 实测踩到、必须都吃下的变体：
 *   - 尾部标签除 [video] 还有 [pdf]
 *   - 没有斜体：* [**C**: Write a shell in C](https://…)
 *   - 斜体里有尾随空格：_Hecto: Build your own text editor in Rust_ )
 *   - 语言写成 (any)：* [**(any)**:  build-your-own-x-vibe-coding: …](…)
 *   - 复合语言标签：* [**C# / TypeScript / JavaScript**: _…_](…)
 *   - 标题里带逗号、括号、全角符号；URL 里带括号
 * 所以不按“整行一个正则”硬套，改成从右往左剥：尾标签 → "](url)" → 链接文字 → **语言**: → _标题_。
 */
function parseReadme(md) {
  const lines = String(md).split(/\r?\n/);
  const start = lines.findIndex(function (l) { return /^##\s+Tutorials\s*$/.test(l); });
  if (start < 0) { bad("README 里没找到 `## Tutorials` 这一节，解析中止"); return { cats: [], rawItemLines: 0 }; }

  const catRe = /^####\s+Build your own\s+`(.+?)`\s*$/;
  const byName = new Map();
  const order = [];
  let cur = null;
  let rawItemLines = 0;   /* 不看结构、只数条目行 —— 与结构化解析互为印证的独立计数 */
  let fragGlued = 0;      /* 折到下一行的尾部标签，并进了几条 */
  let videoMarks = 0;     /* Tutorials 区里 [video] 字样出现的次数（含折行的） */

  for (let i = start; i < lines.length; i++) {
    const raw = lines[i];
    if (cur !== null) videoMarks += (raw.match(/\[video\]/gi) || []).length;   /* 与解析出的 video 篇数互为印证 */
    if (/^##\s/.test(raw) && !/^####/.test(raw)) { cur = null; continue; }   /* 出了 Tutorials 区（## Contribute 等） */
    const cm = catRe.exec(raw);
    if (cm) {
      cur = cm[1].trim();
      if (!byName.has(cur)) { byName.set(cur, []); order.push(cur); }
      else bad("类目「" + cur + "」在 README 里出现了两次，需要人工决定怎么并");
      continue;
    }
    const line = raw.trim();
    if (!/^[*-]\s+\[/.test(line)) {
      /* 换行续写的尾部标签：README 里有条目把 [video] 折到下一行（实测 1 处，
         「Learn Video Game Programming in C」）。这种残片行不算新条目，并进上一条。 */
      const frag = /^\s*((?:\[[^\]\[]+\]\s*)+)$/.exec(raw);
      if (frag && cur && byName.get(cur).length) {
        const prev = byName.get(cur)[byName.get(cur).length - 1];
        (frag[1].match(/\[([^\]\[]+)\]/g) || []).forEach(function (x) {
          const t = x.slice(1, -1).trim().toLowerCase();
          if (prev.tags.indexOf(t) < 0) prev.tags.push(t);
          if (t === "video") prev.video = true;
        });
        fragGlued++;
      }
      continue;
    }
    rawItemLines++;
    const it = parseItemLine(line);
    if (!it) { bad("条目行解析失败（解析器漏了这种格式，要修解析器）：" + raw); continue; }
    if (!cur) { bad("条目不在任何 `#### Build your own \\`X\\`` 段里：" + raw); continue; }
    byName.get(cur).push(it);
  }
  return {
    cats: order.map(function (n) { return { name: n, items: byName.get(n) }; }),
    rawItemLines: rawItemLines,
    fragGlued: fragGlued,
    videoMarks: videoMarks
  };
}

function parseItemLine(line) {
  let s = line.replace(/^[*-]\s+\[/, "");
  const tags = [];
  s = s.replace(/((?:\s*\[[^\]\[]+\])+)\s*$/, function (g) {
    (g.match(/\[([^\]\[]+)\]/g) || []).forEach(function (x) { tags.push(x.slice(1, -1).trim().toLowerCase()); });
    return "";
  }).trim();
  const li = s.lastIndexOf("](");
  if (li < 0 || !/\)$/.test(s)) return null;
  const url = s.slice(li + 2, -1).trim();
  let text = s.slice(0, li).trim();
  let lang = "";
  const lm = /^\*\*(.+?)\*\*\s*:?\s*(.*)$/.exec(text);
  if (lm) { lang = lm[1].trim(); text = lm[2].trim(); }
  const im = /^_([\s\S]*?)_$/.exec(text);
  if (im) text = im[1];
  text = text.replace(/\s+/g, " ").trim();
  if (!url || !text) return null;
  return { lang: lang, title: text, url: url, tags: tags, video: tags.indexOf("video") >= 0 };
}

/* "C# / TypeScript / JavaScript" → ["C#","TypeScript","JavaScript"]；(any)/Pseudocode 不算语言 */
function langOf(tag) {
  return String(tag).split("/").map(function (x) { return x.trim(); })
    .filter(function (x) { return x && !/^\((.*)\)$/.test(x) && !/^(any|pseudocode)$/i.test(x); });
}
function langStat(cats) {
  const raw = {}, split = {};
  cats.forEach(function (c) {
    c.items.forEach(function (it) {
      raw[it.lang] = (raw[it.lang] || 0) + 1;
      langOf(it.lang).forEach(function (x) { split[x] = (split[x] || 0) + 1; });
    });
  });
  return { raw: raw, split: split };
}
function topKeys(obj, n) {
  return Object.keys(obj).sort(function (a, b) { return obj[b] - obj[a] || (a < b ? -1 : 1); }).slice(0, n);
}

/* ============ 3. 组装站内骨架（一门教程 = 一个类目，一篇 = 一章，D-31） ============ */
/* 校验用的侧表（不进产物）：类目 → 该类目里出现过的语言标签；章节 id → 原文 url/lang/n */
const LANG_SET = new Map();
const LESSON_SRC = new Map();

function buildPacks(cats) {
  const byName = new Map(cats.map(function (c) { return [c.name, c]; }));

  return CATS.map(function (meta) {
    const c = byName.get(meta.src);
    if (!c) { bad("缩写表里有「" + meta.src + "」，但 README 没解析出来（数字和台账对不上了）"); return null; }

    const perLang = {};
    c.items.forEach(function (it) { langOf(it.lang).forEach(function (x) { perLang[x] = (perLang[x] || 0) + 1; }); });
    LANG_SET.set(meta.abbr, new Set(Object.keys(perLang)));
    const tags = [];
    topKeys(perLang, 3).forEach(function (x) { if (tags.indexOf(x) < 0) tags.push(x); });
    meta.topics.forEach(function (x) { if (tags.length < 6 && tags.indexOf(x) < 0) tags.push(x); });
    if (tags.indexOf("build-your-own-x") < 0) tags.push("build-your-own-x");

    const chapters = c.items.map(function (it, idx) {
      const n = idx + 1;
      const cid = meta.abbr + "-c" + String(n).padStart(2, "0");
      const what = "这是 build-your-own-x 的第 " + n + " 篇（类目「" + meta.src + "」，站内章节 id " + cid + "），原文语言 " +
        (it.lang || "未标") + "，原文链接 " + it.url + (it.video ? "（README 标注为视频教程）" : "");
      LESSON_SRC.set(cid, { n: n, url: it.url, lang: it.lang || "未标", cat: meta.src });
      return {
        id: cid,
        title: meta.zh + " · " + it.title,
        blocks: [
          { t: "tip", text: "本篇待写：" + what },
          {
            t: "p",
            text: "这一章正文还没写。" + what + "。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；" +
              "正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。"
          }
        ]
      };
    });

    const papers = chapters.map(function (ch, idx) {
      return {
        cid: ch.id,
        kind: "paper",
        title: meta.zh + " 第 " + (idx + 1) + " 篇考试 · " + ch.title.slice(meta.zh.length + 3),
        pass: 60,
        questions: [],   /* 题型见任务书 §11.6.4：choice/multi/blank/code/output/order */
        explain: []
      };
    });

    return {
      tutorial: {
        id: meta.abbr,
        title: meta.title + "（build-your-own-x " + chapters.length + " 篇全做）",
        intro: meta.intro,
        cat: GROUP_OF[meta.abbr],
        diff: diffOf(meta),
        tags: tags,
        author: "喵站官方",
        cover: "/assets/img/covers/byox-" + meta.abbr + ".svg",
        chapters: chapters
      },
      examScaffold: {
        kind: "paper",
        pass: 60,
        rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4",
        cat: meta.src,    /* README 原类目名，便于 T-15 回查 */
        papers: papers
      }
    };
  }).filter(Boolean);
}

/* ============ 4. 输出 ============ */
function jsStr(s) {
  return JSON.stringify(String(s))
    .replace(/</g, "\\u003c")                                  /* 防 </script> 之类序列截断内联脚本 */
  /* U+2028 / U+2029 用转义写，别在源码里留下裸的行分隔符 */
    .replace(/\\u2028/g, "\\u2028").replace(/\\u2029/g, "\\u2029");
}
const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
function key(k) { return IDENT.test(k) ? k : jsStr(k); }
function flat(v) {
  return typeof v !== "object" || v === null || (Array.isArray(v) && v.length === 0);
}
function emit(v, ind) {
  const pad = "  ".repeat(ind), pad2 = "  ".repeat(ind + 1);
  if (v === null || v === undefined) return "null";
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (typeof v === "string") return jsStr(v);
  if (Array.isArray(v)) {
    if (!v.length) return "[]";
    if (v.every(function (x) { return typeof x === "string"; })) return "[" + v.map(jsStr).join(", ") + "]";
    if (v.every(flat)) return "[ " + v.map(function (x) { return emit(x, ind); }).join(", ") + " ]";
    return "[\n" + v.map(function (x) { return pad2 + emit(x, ind + 1); }).join(",\n") + "\n" + pad + "]";
  }
  const ks = Object.keys(v);
  if (!ks.length) return "{}";
  const isFlat = function (k) { return flat(v[k]); };
  const deep = ks.filter(function (k) { return !flat(v[k]); });
  /* 三种摆法，按「359 章摊开也别把文件撑爆」来定：
     1) 全部字段都是标量/空数组 → 一行（一个块、一份考卷脚手架）
     2) 只有一个嵌套值且它排在最后 → 首行写平字段，嵌套值另起（一章：id/title + blocks 数组）
     3) 其余 → 逐行（一门教程、pack、categories 数组的元素） */
  if (!deep.length) {
    return "{ " + ks.map(function (k) { return key(k) + ": " + emit(v[k], ind); }).join(", ") + " }";
  }
  if (deep.length === 1 && ks[ks.length - 1] === deep[0]) {
    const head = ks.slice(0, -1).map(function (k) { return key(k) + ": " + emit(v[k], ind); }).join(", ");
    return "{ " + (head ? head + ", " : "") + key(deep[0]) + ": " + emit(v[deep[0]], ind + 1) + "\n" + pad + " }";
  }
  return "{\n" + ks.map(function (k) { return pad2 + key(k) + ": " + emit(v[k], ind + 1); }).join(",\n") + "\n" + pad + "}";
}


/* 封面：纯代码画的 SVG（跟站内 python.svg 同一套路，不引外部图、不依赖网络）。
   每门课按类目画一张：底色 + 课数方格 + 中文标题，方格数就是这一类有多少篇。 */
const TINTS = ["#c0563a","#1b7f79","#6a4c93","#2f6f8f","#b8860b","#3f7d4e","#8e4a68","#46627f"];
function coverSvg(meta, n, idx) {
  const tint = TINTS[idx % TINTS.length];
  let cells = "";
  const cols = 8, rows = Math.min(4, Math.max(1, Math.ceil(n / cols)));
  for (let k = 0; k < rows * cols; k++) {
    const on = k < n;
    const x = 46 + (k % cols) * 34, y = 168 + Math.floor(k / cols) * 34;
    cells += '<rect x="' + x + '" y="' + y + '" width="26" height="26" rx="6" fill="' + tint +
             '" fill-opacity="' + (on ? (0.3 + (k % 4) * 0.18).toFixed(2) : "0.06") + '"/>';
  }
  const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">'
    + '<rect width="640" height="360" fill="#fffaf3"/><rect width="640" height="8" fill="' + tint + '"/>'
    + '<text x="46" y="82" font-size="32" font-weight="700" fill="#2b2118" font-family="Noto Sans CJK SC,sans-serif">' + esc(meta.title) + '</text>'
    + '<text x="46" y="114" font-size="15" fill="#7a6a5c" font-family="monospace">build-your-own-x · ' + esc(meta.src) + ' · ' + n + ' 篇</text>'
    + cells + '</svg>';
}

function renderDataFile(packs) {
  const head = `/* 喵站 · build-your-own-x 数据（由 dev/tools/byox-gen.js 生成，请勿手改；要改改生成器）
 *
 * 来源：GitHub ${REPO} 的 README —— 实测 30 个类目 / 359 篇教程链接（台账 dev/任务书.md §11.2）。
 * 这里是**索引骨架**：30 门教程、359 章，每章只有两个占位块（tip + p，写明本篇待写与原文链接）。
 * 正文与考卷由任务书 T-15 分批填；按 D-30 只写原创中文导读，绝不搬运原文正文。
 *
 * 全局名（为什么不是只有一个 MIAO_BYOX）：
 *   window.MIAO_BYOX                 → 30 门的全量数组（测试与批量工具用）
 *   window["MIAO_BYOX_" + 大写缩写]   → 单门 { tutorial, examScaffold }，如 MIAO_BYOX_WEB、MIAO_BYOX_3D
 *   assets/js/data.js 的组装是「pack = root[reg.source]; pack.tutorial」，一份 source 只认一门教程，
 *   且硬校验 reg.id === pack.tutorial.id —— 所以 site.js 里 30 行登记各指自己的全局名。
 *   id 以数字开头（3d）也没问题：全局名是 window[...] 下标写的，章节 id 是字符串 "3d-c01"，
 *   都没有被当成 JS 裸标识符拼进对象字面量。
 *
 * 块类型沿用站内既有形状：p 段落 / h2 小标题 / tip 提示框 / ul 列表 / code 代码。
 * updated 固定 ${GEN_STAMP}，同一份 README 复跑产物逐字节不变。
 */
(function (root) {
  "use strict";

`;
  const tail = `
  root.MIAO_BYOX = PACKS;
  /* 逐门再挂一个独立全局名，供 site.js 的 source 字段查（一份 source = 一门教程） */
  PACKS.forEach(function (p) {
    if (!p || !p.tutorial) return;
    root["MIAO_BYOX_" + String(p.tutorial.id).toUpperCase()] = p;
  });
})(typeof window !== "undefined" ? window : globalThis);
`;
  return head + "  var PACKS = " + emit(packs, 2) + ";\n" + tail;
}

function renderIndex(cats, packs, stat, rawItemLines) {
  const packOf = new Map(packs.map(function (p) { return [p.examScaffold.cat, p]; }));
  return JSON.stringify({
    generatedBy: "dev/tools/byox-gen.js",
    generatedAt: GEN_STAMP,
    source: {
      repo: REPO, ref: "master", url: RAW_URL,
      cachedFile: "dev/tools/byox-raw.md",
      cachedBytes: fs.existsSync(RAW_FILE) ? fs.statSync(RAW_FILE).size : 0
    },
    totals: {
      categories: cats.length,
      lessons: cats.reduce(function (a, c) { return a + c.items.length; }, 0),
      rawItemLines: rawItemLines,
      videoLessons: cats.reduce(function (a, c) { return a + c.items.filter(function (i) { return i.video; }).length; }, 0),
      tutorials: packs.length,
      chapters: packs.reduce(function (a, p) { return a + p.tutorial.chapters.length; }, 0)
    },
    ledgerExpected: EXPECT,
    distribution: cats.map(function (c) {
      const p = packOf.get(c.name);
      return { cat: c.name, tutorialId: p ? p.tutorial.id : null, count: c.items.length };
    }).sort(function (a, b) { return b.count - a.count; }),
    langStat: {
      rawDistinct: Object.keys(stat.raw).length,
      raw: stat.raw,
      splitTop: topKeys(stat.split, 15).map(function (k) { return { lang: k, count: stat.split[k] }; })
    },
    categories: cats.map(function (c) {
      const p = packOf.get(c.name);
      const abbr = p ? p.tutorial.id : "?";
      return {
        name: c.name,
        tutorialId: abbr,
        count: c.items.length,
        lessons: c.items.map(function (it, idx) {
          return {
            id: abbr + "-c" + String(idx + 1).padStart(2, "0"),
            title: it.title, lang: it.lang, url: it.url, video: !!it.video, tags: it.tags
          };
        })
      };
    })
  }, null, 2) + "\n";
}

function siteRowsText() {
  return CATS.map(function (m) {
    return `    { id: "${m.abbr}", source: "MIAO_BYOX_${m.abbr.toUpperCase()}", updated: "${GEN_STAMP}", extras: {} },`;
  }).join("\n");
}

/* ============ 5. 校验 ============ */
function loadGlobal(file, label) {
  if (!fs.existsSync(file)) { bad("找不到 " + label + "：" + file); return null; }
  const ctx = {}; ctx.window = ctx; ctx.console = console; ctx.globalThis = ctx;
  try { vm.runInNewContext(fs.readFileSync(file, "utf8"), ctx, { filename: file }); }
  catch (e) { bad(label + " 语法不过：" + e.message); return null; }
  return ctx;
}

function check(parsed, packs, stat, ctx, site, html) {
  const cats = parsed.cats;
  const total = cats.reduce(function (a, c) { return a + c.items.length; }, 0);
  const sumCh = packs.reduce(function (a, p) { return a + p.tutorial.chapters.length; }, 0);
  const video = cats.reduce(function (a, c) { return a + c.items.filter(function (i) { return i.video; }).length; }, 0);

  /* —— 台账硬数字 —— */
  if (cats.length !== EXPECT.categories) bad("类目数 " + cats.length + " ≠ 台账 §11.2 的 " + EXPECT.categories);
  if (total !== EXPECT.lessons) bad("总篇数 " + total + " ≠ 台账 §11.2 的 " + EXPECT.lessons);
  if (parsed.rawItemLines !== total) bad("独立计数（Tutorials 区的条目行）" + parsed.rawItemLines + " ≠ 结构化解析 " + total + "，解析器漏行了");
  if (parsed.videoMarks !== video) bad("README 里 [video] 出现 " + parsed.videoMarks + " 次，但只有 " + video + " 篇被标成视频，尾部标签解析漏了（比如有标签折到下一行）");
  if (parsed.fragGlued) notes.push("有 " + parsed.fragGlued + " 条条目的 [video] 标签在 README 里折到了下一行，已并回该篇");
  Object.keys(EXPECT.byCat).forEach(function (n) {
    const c = cats.filter(function (x) { return x.name === n; })[0];
    if (!c) { bad("台账点名的类目「" + n + "」没解析到"); return; }
    if (c.items.length !== EXPECT.byCat[n]) bad("类目「" + n + "」解析出 " + c.items.length + " 篇 ≠ 台账 " + EXPECT.byCat[n] + " 篇");
  });
  Object.keys(EXPECT.langTop).forEach(function (l) {
    if ((stat.raw[l] || 0) !== EXPECT.langTop[l]) bad("语言标签「" + l + "」" + (stat.raw[l] || 0) + " 篇 ≠ 台账 " + EXPECT.langTop[l]);
  });
  if (Object.keys(stat.raw).length !== EXPECT.langDistinct) bad("语言标签种类 " + Object.keys(stat.raw).length + " ≠ 台账 " + EXPECT.langDistinct);

  /* —— 每篇都要有 url / 标题 / 语言 —— */
  let noUrl = 0, badUrl = 0, noTitle = 0, noLang = 0;
  cats.forEach(function (c) {
    c.items.forEach(function (it) {
      if (!it.url) noUrl++;
      else if (!/^https?:\/\//i.test(it.url)) badUrl++;
      if (!it.title) noTitle++;
      if (!it.lang) noLang++;
    });
  });
  if (noUrl) bad("有 " + noUrl + " 篇没有 url");
  if (badUrl) bad("有 " + badUrl + " 篇的 url 不是 http(s) 绝对地址");
  if (noTitle) bad("有 " + noTitle + " 篇没解析出标题");
  if (noLang) bad("有 " + noLang + " 篇没解析出语言标签");

  /* —— 缩写表与 README 类目一一对应 —— */
  CATS.forEach(function (m) {
    if (!cats.some(function (c) { return c.name === m.src; })) bad("缩写表里的「" + m.src + "」在 README 里没解析到");
  });
  cats.forEach(function (c) {
    if (!CATS.some(function (m) { return m.src === c.name; })) bad("README 类目「" + c.name + "」不在缩写表里（缩写要用户定，不许自己发明）");
  });
  if (new Set(CATS.map(function (m) { return m.abbr; })).size !== CATS.length) bad("缩写表里有重复缩写");
  if (new Set(CATS.map(function (m) { return m.src; })).size !== CATS.length) bad("缩写表里有重复类目名");

  /* —— 章节 id：全局唯一、前缀正确、序号连续 c01..cNN；占位块恰好 [tip, p] —— */
  const firstSeen = new Map(); const dups = [];
  packs.forEach(function (p) {
    const t = p.tutorial;
    ["id", "title", "intro", "cat", "diff", "tags", "author", "cover", "chapters"].forEach(function (k) {
      if (t[k] === undefined) bad(t.id + " 缺字段 " + k);
    });
    if (t.cat !== GROUP_OF[t.id]) bad(t.id + " 的 cat 应为分组「" + GROUP_OF[t.id] + "」，现在是 " + JSON.stringify(t.cat));
    if (["入门", "掌握", "精通"].indexOf(t.diff) < 0) bad(t.id + " 的 diff 不在 app.js 的三档难度里：" + t.diff);
    if (!t.intro || t.intro.length < 20) bad(t.id + " 的 intro 太短，没写清这个类目要造什么");
    if (!t.tags || !t.tags.length) bad(t.id + " 没有 tags");
    const langSet = LANG_SET.get(t.id) || new Set();
    if (!t.tags.some(function (x) { return langSet.has(x); })) bad(t.id + " 的 tags 里没有语言（该类目出现过的语言：" + [...langSet].slice(0, 4).join("/") + "）");
    if (typeof t.cover !== "string") bad(t.id + " 的 cover 必须是字符串");
    if (t.cover !== "") bad(t.id + " 的 cover 非空：" + t.cover + " —— 站内没有 cg-" + t.id + " 渐变扩展点，按规矩留空字符串，也不许引外部图片");
    t.chapters.forEach(function (ch, idx) {
      const want = t.id + "-c" + String(idx + 1).padStart(2, "0");
      if (ch.id !== want) bad("章节 id 不合规：" + ch.id + "，应为 " + want);
      if (firstSeen.has(ch.id)) dups.push(ch.id + "（" + firstSeen.get(ch.id) + " 与 " + t.id + "）");
      else firstSeen.set(ch.id, t.id);
      if (ch.blocks.length !== 2 || ch.blocks[0].t !== "tip" || ch.blocks[1].t !== "p") bad("章节 " + ch.id + " 的占位块不是恰好 [tip, p]（现在 " + ch.blocks.map(function (b) { return b.t; }).join("/") + "）");
      ch.blocks.forEach(function (b, bi) {
        if (["p", "h2", "tip", "ul", "code"].indexOf(b.t) < 0) bad("章节 " + ch.id + " 用了站内没有的块类型 " + b.t);
        const txt = b.text || "";
        const src = LESSON_SRC.get(ch.id) || {};
        if (txt.indexOf("第 " + src.n + " 篇") < 0) bad("章节 " + ch.id + " 的第 " + (bi + 1) + " 块没写清「第 N 篇」");
        if (txt.indexOf(src.url || "\u0000") < 0) bad("章节 " + ch.id + " 的第 " + (bi + 1) + " 块没带原文链接");
        if (txt.indexOf(src.lang || "\u0000") < 0) bad("章节 " + ch.id + " 的第 " + (bi + 1) + " 块没写原文语言");
        if (txt.indexOf("待写") < 0 && txt.indexOf("还没写") < 0) bad("章节 " + ch.id + " 的第 " + (bi + 1) + " 块没写明「本篇待写」");
        if (bi === 0 && txt.indexOf("tip") === 0) bad("章节 " + ch.id + " 的 tip 块开头不对劲");
      });
      if (ch.title.indexOf(metaZh(t.id) + " · ") !== 0) bad("章节 " + ch.id + " 的标题不是「类目名 · 原教程标题」：" + ch.title);
    });
    if (p.examScaffold.papers.length !== t.chapters.length) bad(t.id + "：考卷脚手架 " + p.examScaffold.papers.length + " 份 ≠ 章节 " + t.chapters.length + " 章");
    p.examScaffold.papers.forEach(function (pp, idx) {
      if (pp.cid !== t.chapters[idx].id) bad(t.id + "：第 " + (idx + 1) + " 份考卷的 cid " + pp.cid + " 与章节 id 不一致");
      if (pp.kind !== "paper") bad(pp.cid + "：考卷脚手架 kind 应为 paper（与 Python 沙箱卷分流，§11.6.4）");
      if (pp.pass !== 60) bad(pp.cid + "：通过线应为 60");
      if (!pp.title) bad(pp.cid + "：考卷没有标题");
    });
  });
  if (dups.length) bad("章节 id 全局重复 " + dups.length + " 个：" + dups.join("、"));
  const tids = packs.map(function (p) { return p.tutorial.id; });
  if (new Set(tids).size !== tids.length) bad("教程 id 有重复（" + tids.length + " 门应有 " + tids.length + " 个不同 id）");
  if (tids.indexOf("python") >= 0 || tids.indexOf("english") >= 0) bad("教程 id 撞了站内既有的 python/english");
  if (packs.length !== EXPECT.categories) bad("产出的教程数 " + packs.length + " ≠ " + EXPECT.categories);
  if (sumCh !== EXPECT.lessons) bad("产出的章节总数 " + sumCh + " ≠ 台账 " + EXPECT.lessons);

  /* —— 产物侧：byox-data.js 挂出的全局名齐不齐 —— */
  if (ctx) {
    if (!Array.isArray(ctx.MIAO_BYOX) || ctx.MIAO_BYOX.length !== CATS.length) bad("byox-data.js 里 window.MIAO_BYOX 不是 " + CATS.length + " 门的数组");
    const miss = [];
    packs.forEach(function (p) {
      const name = "MIAO_BYOX_" + p.tutorial.id.toUpperCase();
      const got = ctx[name];
      if (!got || !got.tutorial || got.tutorial.id !== p.tutorial.id || !got.examScaffold) miss.push(name);
    });
    if (miss.length) bad("byox-data.js 少了/坏了这些单门全局名：" + miss.join("、"));
  }

  /* —— site.js 登记 —— */
  if (site) {
    const abbrs = CATS.map(function (m) { return m.abbr; });
    const groupNames = Object.keys(GROUPS);
    /* BIG_CAT 现在是「小类」（计算机基础挂在 其他 底下），所以要跨大类找 */
    let subs = null;
    Object.keys(site.categories || {}).forEach(function (b) {
      if ((site.categories[b] || []).indexOf(BIG_CAT) >= 0) subs = site.categories[b];
    });
    if (!subs) bad("site.js 的 categories 里找不到小类「" + BIG_CAT + "」");
    else {
      if (!subs) bad("site.js 的 categories 里找不到小类「" + BIG_CAT + "」");
      /* 原来这条拿小类名去比教程 id（英语 是合法小类，被误判成「混进既有教程」），删掉 */
      /* 小类标签是 chip 的过滤值，跨大类重名会撞车，所以每个小类名全站只能属于一个大类 */
      const seenSub = new Map(); const dupSub = [];
      Object.keys(site.categories || {}).forEach(function (big) {
        (site.categories[big] || []).forEach(function (sub) {
          if (seenSub.has(sub) && seenSub.get(sub) !== big) dupSub.push(sub + "（" + seenSub.get(sub) + " 与 " + big + "）");
          else seenSub.set(sub, big);
        });
      });
      if (dupSub.length) bad("site.js 里跨大类重名的小类标签：" + dupSub.join("、") + " —— chip 点出来的是同一批教程，必须改名区分");
      /* 每个分组的 chip 必须真有教程落进去（点了没反应的界面件要删掉，不是留着骗人） */
      groupNames.forEach(function (g) {
        const n = packs.filter(function (p) { return p.tutorial && p.tutorial.cat === g; }).length;
        if (!n) bad("分组「" + g + "」里一门教程都没有 —— 这个 chip 按下去是空的");
      });
    }
    const rows = site.tutorials || [];
    const regOf = new Map(rows.map(function (r) { return [r.id, r]; }));

    ["python", "english"].forEach(function (id) { if (!regOf.get(id)) bad("site.js 把老教程 " + id + " 的登记弄丢了"); });
    if (rows.length < abbrs.length + 2) bad("site.js tutorials 至少应有 " + (abbrs.length + 2) + " 行（" + abbrs.length + " 门 BYOX + python/english），现在 " + rows.length + " 行");
    /* 别的来源（微软 MIT 课程）也会往这里登记，多出来的行不算错 */
    const notReg = abbrs.filter(function (a) { return !regOf.get(a); });
    if (notReg.length) bad("site.js 没登记这 " + notReg.length + " 门：" + notReg.join(", "));
    const wrongSrc = abbrs.filter(function (a) { const r = regOf.get(a); return r && r.source !== "MIAO_BYOX_" + a.toUpperCase(); });
    if (wrongSrc.length) bad("site.js 里这 " + wrongSrc.length + " 门的 source 指错了全局名：" + wrongSrc.map(function (a) { return a + "→" + regOf.get(a).source; }).join(", "));
    /* 复刻 data.js 的硬校验：reg.id 必须 === pack.tutorial.id */
    if (ctx) {
      const skip = [];
      rows.forEach(function (r) {
        const pack = ctx[r.source];
        if (!pack) { if (String(r.source).indexOf("MIAO_BYOX") === 0) skip.push(r.id + "（页面上没有 " + r.source + "）"); return; }
        const t = pack.tutorial;
        if (!t || t.id !== r.id) skip.push(r.id + "（" + r.source + ".tutorial.id=" + (t ? t.id : "无") + "）");
      });
      if (skip.length) bad("data.js 会报错跳过这些教程（登记与 tutorial.id 不一致）：" + skip.join("、"));
      else notes.push("data.js 组装口径：30 门 BYOX 全部能按 source 取到 pack.tutorial 且 id 对得上（python/english 由各自数据文件提供，不在本生成器职责内）");
    }
  }

  /* —— index.html 引入顺序：byox-data.js 必须在 assets/js/data.js 之前 —— */
  if (html !== null) {
    if (html === undefined) bad("找不到 index.html：" + HTML_FILE);
    else {
      const iByox = html.indexOf("assets/data/byox-data.js");
      const iData = html.indexOf("assets/js/data.js");
      if (iByox < 0) bad("index.html 没引入 assets/data/byox-data.js");
      else if (iData >= 0 && iByox > iData) bad("index.html 里 byox-data.js 排在 assets/js/data.js 之后 —— 必须在它之前，数据层是同步组装的");
      else notes.push("index.html 引入顺序：byox-data.js 在 data.js 之前 ✓");
    }
  }

  return { total: total, sumCh: sumCh, ids: firstSeen.size, video: video, dist: cats };
}
function metaZh(abbr) {
  const m = CATS.filter(function (x) { return x.abbr === abbr; })[0];
  return m ? m.zh : abbr;
}

function report(cats, packs, stat, nums, rawItemLines, fromCache) {
  const dist = cats.map(function (c) {
    const p = packs.filter(function (x) { return x.examScaffold.cat === c.name; })[0];
    return { n: c.items.length, name: c.name, abbr: p ? p.tutorial.id : "?" };
  }).sort(function (a, b) { return b.n - a.n || (a.name < b.name ? -1 : 1); });

  console.log("── byox-gen · build-your-own-x 索引骨架（T-14）──────────────");
  console.log("README 缓存：" + RAW_FILE + "（" + (fs.existsSync(RAW_FILE) ? fs.statSync(RAW_FILE).size : 0) + " 字节，" + (fromCache ? "命中缓存，未联网" : "本次重新抓取") + "）");
  console.log("类目数：" + nums.dist.length + " / 台账 " + EXPECT.categories);
  console.log("教程篇数：" + nums.total + " / 台账 " + EXPECT.lessons + "　（条目行独立计数：" + rawItemLines + "）");
  console.log("站内教程：" + packs.length + " 门　章节：" + nums.sumCh + " 章　唯一章节 id：" + nums.ids + " 个　重复 id：" + (nums.sumCh - nums.ids) + " 个");
  console.log("标了 [video] 的篇目：" + nums.video + " 篇　语言标签种类：" + Object.keys(stat.raw).length + " / 台账 " + EXPECT.langDistinct);
  console.log("");
  console.log("每类目篇数分布（多 → 少）：");
  dist.forEach(function (d) { console.log("  " + String(d.n).padStart(3) + " 篇  " + d.abbr.padEnd(8) + " " + d.name); });
  console.log("  ─── " + dist.reduce(function (a, d) { return a + d.n; }, 0) + " 篇合计");
  console.log("");
  console.log("语言分布（整条标签口径，对齐台账 §11.2）：");
  console.log("  " + topKeys(stat.raw, 11).map(function (k) { return k + " " + stat.raw[k]; }).join(" · "));
  console.log("");
  console.log(CHECK_ONLY ? "产物：--check-only，没写任何文件" : "产物：" + INDEX_FILE + "（" + fs.statSync(INDEX_FILE).size + " 字节）　" + DATA_FILE + "（" + fs.statSync(DATA_FILE).size + " 字节）");
  console.log("");
}

/* ============ main ============ */
function main() {
  if (EMIT_SITE_ROWS) {
    console.log("/* dev/frontend/assets/data/site.js → tutorials 数组里，python/english 两行之后 */");
    console.log(siteRowsText().replace(/,$/, ""));
    console.log("\n/* categories 里补一行（顺序同上） */");
    console.log('    "' + BIG_CAT + '": [' + CATS.map(function (m) { return '"' + m.abbr + '"'; }).join(", ") + "]");
    return 0;
  }

  /* 1) 取原文：缓存解析得出台账数字就不联网 */
  let text = null, parsed = null, fromCache = false;
  if (!FORCE_FETCH && fs.existsSync(RAW_FILE)) {
    const probeText = fs.readFileSync(RAW_FILE, "utf8");
    const probeProblems = problems.length;
    const probe = parseReadme(probeText);
    const n = probe.cats.reduce(function (a, c) { return a + c.items.length; }, 0);
    if (problems.length === probeProblems && probe.cats.length === EXPECT.categories && n === EXPECT.lessons) {
      text = probeText; parsed = probe; fromCache = true;
    } else {
      problems.length = probeProblems;   /* 缓存不合格：丢掉这些中间问题，去重抓 */
    }
  }
  if (!fromCache) {
    text = fetchRaw();
    if (text === null) { report0(); return 1; }
    parsed = parseReadme(text);
    const n = parsed.cats.reduce(function (a, c) { return a + c.items.length; }, 0);
    if (parsed.cats.length !== EXPECT.categories || n !== EXPECT.lessons) {
      console.log("[提醒] 新抓的 README 解析出 " + parsed.cats.length + " 类目 / " + n + " 篇，与台账 " +
        EXPECT.categories + "/" + EXPECT.lessons + " 不一致 —— 上游改行了，还是解析器漏了格式？差在哪见下面。");
    }
  }

  /* 2) 解析 → 骨架 */
  const stat = langStat(parsed.cats);
  const packs = buildPacks(parsed.cats);

  /* 3) 渲染产物 */
  const dataSrc = renderDataFile(packs);
  let ctx = null;
  if (CHECK_ONLY) {
    /* 不写文件，但要验语法：把产物在 vm 里跑一遍，确认浏览器能挂上全局名 */
    ctx = loadGlobalFromString(dataSrc);
  } else {
    fs.writeFileSync(INDEX_FILE, renderIndex(parsed.cats, packs, stat, parsed.rawItemLines));
    fs.writeFileSync(DATA_FILE, dataSrc);
    ctx = loadGlobalFromString(fs.readFileSync(DATA_FILE, "utf8"));
  }
  const siteCtx = loadGlobal(SITE_FILE, "site.js");
  let site = null;
  if (siteCtx) {
    site = siteCtx.MIAO_SITE || null;
    if (!site) bad("site.js 跑起来了但没挂出 window.MIAO_SITE");
  }
  const html = fs.existsSync(HTML_FILE) ? fs.readFileSync(HTML_FILE, "utf8") : undefined;

  /* 4) 自校验 */
  const nums = check(parsed, packs, stat, ctx, site, html);

  if (CHECK_ONLY) console.log("[--check-only] 没写任何文件（byox-data.js 语法已在 vm 里验过）");
  else console.log("[写入] " + INDEX_FILE + "\n[写入] " + DATA_FILE);

  report(parsed.cats, packs, stat, nums, parsed.rawItemLines, fromCache);
  return report0();
}

function loadGlobalFromString(src) {
  const ctx = {}; ctx.window = ctx; ctx.console = console; ctx.globalThis = ctx;
  try { vm.runInNewContext(src, ctx, { filename: DATA_FILE }); }
  catch (e) { bad("byox-data.js 语法不过： " + e.message); return null; }
  return ctx;
}

function report0() {
  notes.forEach(function (n) { console.log("说明：" + n); });
  if (!problems.length) {
    console.log("校验：全部通过 —— 类目 30 · 篇数 359 · 每篇有 url · 章节 id 全局唯一 · site.js/index.html 登记齐");
    console.log("退出码 0");
    return 0;
  }
  console.log("校验：不通过，" + problems.length + " 条 ——");
  problems.forEach(function (p, i) { console.log("  " + (i + 1) + ") " + p); });
  console.log("退出码 1");
  return 1;
}

process.exit(main());
