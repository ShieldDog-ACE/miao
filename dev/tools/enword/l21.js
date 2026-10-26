/* 喵站 · 英语入门 · 词表原稿（第 21 课 · 编程英语）
 * 这一课说明：这一课的词全是编程书里最常见的英文，音频和其它课一样走站点 mp3
 * （assets/audio/words/*.mp3，由 dev/tools/enword-tts.py 生成）。
 */
window.MIAO_ENW_SRC = window.MIAO_ENW_SRC || {};

window.MIAO_ENW_SRC.l21 = {
  title: "第 21 课 · 编程英语（C++ 与 Python）",
  goal: "这一课的词是敲代码时天天见的：写东西用的 code、program，跑起来会 print，有 input 和 output，出错就有 error 和 bug，东西都存在 file 里。学完你能看懂编程书里最常见的几类句子。",
  words: [
    { w: "code", ipa: "/kəʊd/", pos: "n.", cn: "代码", ph: "This is my code.", phcn: "这是我的代码。（code：一段写出来的代码）" },
    { w: "program", ipa: "/ˈprəʊɡræm/", pos: "n.", cn: "程序", ph: "I write a program.", phcn: "我写一个程序。（write：写；program：一整份能跑起来的东西）" },
    { w: "print", ipa: "/prɪnt/", pos: "v.", cn: "打印；输出到屏幕", ph: "print(\"hello\")", phsay: "print hello", phcn: "打印 hello（print 就是「把括号里的东西显示出来」，hello 是要显示的内容）" },
    { w: "input", ipa: "/ˈɪnpʊt/", pos: "n.", cn: "输入", ph: "The input is here.", phcn: "输入在这里。（input：从外面送进来给程序的东西）" },
    { w: "output", ipa: "/ˈaʊtpʊt/", pos: "n.", cn: "输出", ph: "Look at the output.", phcn: "看输出结果。（look at：看；output：程序跑完吐出来的东西）" },
    { w: "error", ipa: "/ˈerə/", pos: "n.", cn: "错误（程序报出来的）", ph: "There is one error.", phcn: "有一个错误。（error：程序自己报出来的那条错）" },
    { w: "bug", ipa: "/bʌɡ/", pos: "n.", cn: "程序漏洞；毛病", ph: "Fix this bug.", phcn: "修掉这个毛病。（bug：藏在代码里、让人出错的毛病）" },
    { w: "file", ipa: "/faɪl/", pos: "n.", cn: "文件", ph: "Open the file.", phcn: "打开这个文件。（open：打开；file：存在电脑里的一个文件）" },
    { w: "import", ipa: "/ˈɪmpɔːt/", pos: "v.", cn: "导入（把别处的东西拿进来）", ph: "import a tool", phcn: "导入一个工具（import：把别人写好的东西拿进来用）" },
    { w: "include", ipa: "/ɪnˈkluːd/", pos: "v.", cn: "包含；引入（一个文件）", ph: "include a file", phcn: "引入一个文件（include：把另一个文件的内容包含进来）" },
    { w: "fix", ipa: "/fɪks/", pos: "v.", cn: "修好；修正", ph: "fix the error", phcn: "修掉这个错误" },
    { w: "tool", ipa: "/tuːl/", pos: "n.", cn: "工具", ph: "a small tool", phcn: "一个小工具" }
  ],
  read: [
    "code 是 /kəʊd/ 一个滑音，尾巴的 d 要出声；和 go、home 里那个 /əʊ/ 是同一个音。",
    "program 重音在第一个音节：PRO-gram，尾巴的 /ɡræm/ 张大嘴收 m，别读成「普柔格让姆」。",
    "print 一个音节，/pr/ 连紧，尾巴 /nt/ 一起收，别加成「普林特」三个音。",
    "input 与 output 是一对：in 是往里，out 是往外，put 都是 /pʊt/，重音都落在前面那个音节。",
    "error 重音在前，读 /ˈerə/：E-rə，第二个音节轻轻带过，别读成「依若儿」。",
    "include 重音在后面：in-CLUDE，尾巴 /uːd/ 拖长再收 d；它的重音位置和 import 正好相反。"
  ],
  memo: [
    "print(\"hello\") 这行代码，读作「打印 hello」：print 是做出来的动作，括号里的 hello 是要打印出来的内容。",
    "记住一对反义就省两个词：input 是往里输，output 是往外送，in 和 out 你早就认识。",
    "error 和 bug 都跟「出错」有关：error 是程序报出来的那条错，bug 是藏在代码里、让人写错的地方。日常干脆都叫「bug」。"
  ],
  trap: [
    "print 里的 i 是短音 /ɪ/，不是 /aɪ/，和 pink（粉红色）的元音一样，别读成「普赖特」。",
    "input 和 output 的重音都在前面，读成 in-PUT、out-PUT 就错了。",
    "import 重音在前（IM-port），include 重音在后（in-CLUDE）；两个词意思像，重音位置却相反。"
  ],
  task: [
    "把这些词各读三遍，读到看见 code 就想到「代码」。",
    "在纸上写下 print(\"hello\")，念一遍，再说一遍它的中文意思。",
    "下周动手写第一个小程序时，把这些词对着看一遍，看哪些真的出现了。"
  ],
  one: "编程书里的英文不多，翻来覆去就是这些词，认下来就能读懂一大半。"
};
