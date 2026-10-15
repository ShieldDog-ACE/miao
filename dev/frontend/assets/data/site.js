/* 喵站 · 站点登记（按需加载时代唯一需要手工维护的那份清单）
 *
 * 一份登记 = 一门课。字段：
 *   source   数据文件挂到 window 上的包名（包里有 tutorial）
 *   files    这一门课的全部正文脚本（顺序有讲究：占位/骨架在前，分部在后）；
 *            glob 是目录规则，由 gen-index.js 展开成具体文件名。
 *            第十轮起它只用来对账与整体兜底 —— 读者点开一章并不拉这一整串。
 *   boot     【分层加载】点开这门课任何一章都必拉的那几份：装配层 + 骨架 + 挂载层，
 *            不含任何章的正文。留空 = 这门课没拆片，files 整串就是 boot（英语那两门）。
 *   assemble 【分层加载】可反复调用的装配函数名：每拉进一份分部就要再拼一次整门课
 *            （py/cpp/cppm 三份 *-data.js 各挂一个；微软四门沿用 MIAO_MS_MOUNT）。
 *   mount    只给「多门课共用一份装配器」的课（微软四门）：除了再拼一次，还要拿
 *            包内自报的 tutorial.id 跟登记对账，谁顶了谁必须当场红。一课一包的课别用这个，
 *            用 assemble —— 那种包的 id 是给人看的分类口径（C++ 两门都写 "C++"）。
 *   engine   考场用哪套界面：code = 浏览器里的 Python 沙箱；en / enword = 英语卷；留空 = 不排考
 *   examFiles 考卷脚本（进考场才拉）；examGlob 同理会被展开
 *
 * 首屏只拉 site.js + index.js + 三个 js，正文一个字节都不下载。
 * 每一章的正文落在哪个分片，由 gen-index.js 现场算（后写的顶掉先写的，占位稿因此自动
 * 退成「只在那几章没写完时才拉」），算出来的映射写进 index.js 的 chunks。
 * 改完这份清单要跑 `node dev/tools/gen-index.js` 重新生成 index.js，别手改 index.js。
 */
window.MIAO_SITE = {
  /* 大类 → 小类（首页分类页按这个层级摆）。
     这些位置是他给之后留的内容位，不许按「现在有没有教程」当死件删。 */
  categories: {
    "编程语言": ["python", "java", "C++","js", "ts", "c", "c#", "汇编"],
    "开发工具": ["git", "github", "linux", "vs code", "trae"],
    "其他": ["计算机基础", "高等数学", "嵌入式", "算法", "Agent", "大模型", "英语"]
  },

  tutorials: [
    {
      id: "python", source: "MIAO_PY", updated: "2026-10-06", engine: "code",
      boot: ["assets/data/py-data.js"], assemble: "MIAO_PY_ASSEMBLE",
      files: [{ glob: "assets/data/py/p*.js" }, "assets/data/py-data.js"],
      examFiles: ["assets/data/py-exam-data.js", { glob: "assets/data/exam-parts/*.js" }]
    },
    /* 英语两门没拆片：en-data.js 14 KB、enwords-data.js 168 KB（gzip 27 KB），整份就是 boot，
       chunks 自然为空 —— 分层加载对它们是「一次拉完」，既不回归也不额外变慢。 */
    {
      id: "english", source: "MIAO_EN", updated: "2026-10-04", engine: "en",
      files: ["assets/data/en-data.js"],
      examFiles: ["assets/data/en-exam-data.js"]
    },
    {
      id: "enwords", source: "MIAO_ENW", updated: "2026-10-09", engine: "enword",
      files: ["assets/data/enwords-data.js"],
      examFiles: ["assets/data/enword-exam-data.js"]
    },
    /* 微软四门 MIT 课共用 ms-data.js（骨架 61 KB / gzip 5.6 KB），正文是逐课一个文件，
       靠 ms-bodies.js 的装配函数合并：boot = 骨架 + 挂载层，那一课的正文点了那一课才拉。 */
    {
      id: "genai", source: "MIAO_MS_GENAI", updated: "2026-10-07", engine: "",
      boot: ["assets/data/ms-data.js", "assets/data/ms-bodies.js"],
      files: ["assets/data/ms-data.js", { glob: "assets/data/ms/genai-c*.js" }, "assets/data/ms-bodies.js"],
      mount: "MIAO_MS_MOUNT", examFiles: []
    },
    {
      id: "ml", source: "MIAO_MS_ML", updated: "2026-10-07", engine: "",
      boot: ["assets/data/ms-data.js", "assets/data/ms-bodies.js"],
      files: ["assets/data/ms-data.js", { glob: "assets/data/ms/ml-c*.js" }, "assets/data/ms-bodies.js"],
      mount: "MIAO_MS_MOUNT", examFiles: []
    },
    {
      id: "webdev", source: "MIAO_MS_WEBDEV", updated: "2026-10-07", engine: "",
      boot: ["assets/data/ms-data.js", "assets/data/ms-bodies.js"],
      files: ["assets/data/ms-data.js", { glob: "assets/data/ms/webdev-c*.js" }, "assets/data/ms-bodies.js"],
      mount: "MIAO_MS_MOUNT", examFiles: []
    },
    {
      id: "agents", source: "MIAO_MS_AGENTS", updated: "2026-10-07", engine: "",
      boot: ["assets/data/ms-data.js", "assets/data/ms-bodies.js"],
      files: ["assets/data/ms-data.js", { glob: "assets/data/ms/agents-c*.js" }, "assets/data/ms-bodies.js"],
      mount: "MIAO_MS_MOUNT", examFiles: []
    },
    /* C++ 两门课：入门（源稿 1–81）/ 掌握（源稿 82–213）。考试全走笔试引擎（浏览器跑不了 C++），
       正文分部写一批顶掉一批。
       入门那门的占位稿 cpp/legacy.js 本轮删了（实测 84 章全部分部覆盖，它一章都不剩，44 KB 死稿）；
       掌握那门还有 26 章只有占位，cppm/legacy.js 留着 —— 分层加载把它当成「那 26 章的分片」，
       不为这一章占位摊给别的章，写完一章它自动少一块、直到整份退场。 */
    {
      id: "cpp", source: "MIAO_CPP", updated: "2026-10-10", engine: "paper",
      boot: ["assets/data/cpp-data.js"], assemble: "MIAO_CPP_ASSEMBLE",
      files: [{ glob: "assets/data/cpp/p*.js" }, "assets/data/cpp-data.js"],
      examFiles: [{ glob: "assets/data/cpp-exam/p*.js" }, "assets/data/cpp-exam-data.js"]
    },
    {
      id: "cppm", source: "MIAO_CPPM", updated: "2026-10-10", engine: "paper",
      boot: ["assets/data/cppm-data.js"], assemble: "MIAO_CPPM_ASSEMBLE",
      files: ["assets/data/cppm/legacy.js", { glob: "assets/data/cppm/p*.js" }, "assets/data/cppm-data.js"],
      examFiles: [{ glob: "assets/data/cppm-exam/p*.js" }, "assets/data/cppm-exam-data.js"]
    }
  ],

  /* 考场界面脚本：按 engine 分四套，进考场才拉。
     顺序有讲究 —— exam-grade.js / exam-ui.js 在浏览器里直接用沙箱挂在 window 上的全局名，
     所以沙箱四份必须排在它们前面（写反了会当场 ReferenceError: require is not defined）。
     paper = 笔试与单编辑器那一屏：判分本体在 exam-paper.js，卡片界面在 exam-paper-ui.js，
     cpp-compile.js 与 cpp-sim.js 是 C++ 考场那两颗按钮（编译＝形状检查，运行＝站内子集机器）。 */
  engines: {
    code: ["assets/js/py-engine.js", "assets/js/py-runtime.js", "assets/js/py-builtin.js",
      "assets/js/py-stdlib.js", "assets/js/exam-grade.js", "assets/js/code-editor.js", "assets/js/exam-ui.js"],
    en: ["assets/js/exam-ui.js", "assets/js/exam-en.js"],
    enword: ["assets/js/exam-ui.js", "assets/js/exam-en.js"],
    paper: ["assets/js/code-editor.js", "assets/js/exam-ui.js", "assets/js/exam-paper.js",
      "assets/js/cpp-compile.js", "assets/js/cpp-sim.js", "assets/js/exam-paper-ui.js"]
  },

  announcements: [
    {
      id: 1,
      title: "喵站上线",
      body: "欢迎来到喵站！本站是纯静态的开源教程站：不用注册、不用登录，全部教程与课末考试都能直接看直接跑。想投稿或纠错，页脚「成为老师」里有邮箱。"
    }
  ],

  /* 页脚那条「成为老师」点进去展示的联系方式 */
  contact: { email: "m15781851831@163.com" }
};
