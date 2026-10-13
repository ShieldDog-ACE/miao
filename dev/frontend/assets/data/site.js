/* 喵站 · 站点登记（按需加载时代唯一需要手工维护的那份清单）
 *
 * 一份登记 = 一门课。字段：
 *   source   数据文件挂到 window 上的包名（包里有 tutorial）
 *   files    点进这门课时要按顺序注入的正文脚本；glob 是目录规则，由 gen-index.js 展开成具体文件名
 *   mount    正文脚本注入完后要再调一次的装配函数（微软那几门的逐课正文靠它合并）
 *   engine   考场用哪套界面：code = 浏览器里的 Python 沙箱；en / enword = 英语卷；留空 = 不排考
 *   examFiles 考卷脚本（进考场才拉）；examGlob 同理会被展开
 *
 * 首屏只拉 site.js + index.js + 三个 js，正文一个字节都不下载。
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
      files: ["assets/data/py/legacy.js", { glob: "assets/data/py/p*.js" }, "assets/data/py-data.js"],
      examFiles: ["assets/data/py-exam-data.js", { glob: "assets/data/exam-parts/*.js" }]
    },
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
    /* 微软四门 MIT 课共用 ms-data.js（骨架），正文是逐课一个文件，靠 ms-bodies.js 的装配函数合并 */
    {
      id: "genai", source: "MIAO_MS_GENAI", updated: "2026-10-07", engine: "",
      files: ["assets/data/ms-data.js", { glob: "assets/data/ms/genai-c*.js" }, "assets/data/ms-bodies.js"],
      mount: "MIAO_MS_MOUNT", examFiles: []
    },
    {
      id: "ml", source: "MIAO_MS_ML", updated: "2026-10-07", engine: "",
      files: ["assets/data/ms-data.js", { glob: "assets/data/ms/ml-c*.js" }, "assets/data/ms-bodies.js"],
      mount: "MIAO_MS_MOUNT", examFiles: []
    },
    {
      id: "webdev", source: "MIAO_MS_WEBDEV", updated: "2026-10-07", engine: "",
      files: ["assets/data/ms-data.js", { glob: "assets/data/ms/webdev-c*.js" }, "assets/data/ms-bodies.js"],
      mount: "MIAO_MS_MOUNT", examFiles: []
    },
    {
      id: "agents", source: "MIAO_MS_AGENTS", updated: "2026-10-07", engine: "",
      files: ["assets/data/ms-data.js", { glob: "assets/data/ms/agents-c*.js" }, "assets/data/ms-bodies.js"],
      mount: "MIAO_MS_MOUNT", examFiles: []
    },
    /* C++ 两门课：入门（源稿 1–81）/ 掌握（源稿 82–213）。考试全走笔试引擎（浏览器跑不了 C++），
       占位正文先挂着，正文分部写一批顶掉一批。 */
    {
      id: "cpp", source: "MIAO_CPP", updated: "2026-10-10", engine: "paper",
      files: ["assets/data/cpp/legacy.js", { glob: "assets/data/cpp/p*.js" }, "assets/data/cpp-data.js"],
      examFiles: [{ glob: "assets/data/cpp-exam/p*.js" }, "assets/data/cpp-exam-data.js"]
    },
    {
      id: "cppm", source: "MIAO_CPPM", updated: "2026-10-10", engine: "paper",
      files: ["assets/data/cppm/legacy.js", { glob: "assets/data/cppm/p*.js" }, "assets/data/cppm-data.js"],
      examFiles: [{ glob: "assets/data/cppm-exam/p*.js" }, "assets/data/cppm-exam-data.js"]
    }
  ],

  /* 考场界面脚本：按 engine 分四套，进考场才拉。
     顺序有讲究 —— exam-grade.js / exam-ui.js 在浏览器里直接用沙箱挂在 window 上的全局名，
     所以沙箱四份必须排在它们前面（写反了会当场 ReferenceError: require is not defined）。
     paper = 笔试（C++ 这类浏览器跑不了的），判分在 exam-paper.js，界面在 exam-paper-ui.js。 */
  engines: {
    code: ["assets/js/py-engine.js", "assets/js/py-runtime.js", "assets/js/py-builtin.js",
      "assets/js/py-stdlib.js", "assets/js/exam-grade.js", "assets/js/code-editor.js", "assets/js/exam-ui.js"],
    en: ["assets/js/exam-ui.js", "assets/js/exam-en.js"],
    enword: ["assets/js/exam-ui.js", "assets/js/exam-en.js"],
    paper: ["assets/js/code-editor.js", "assets/js/exam-ui.js", "assets/js/exam-paper.js", "assets/js/exam-paper-ui.js"]
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
