/* 喵站 · 英语学习数据（唯一来源）
 *
 * 26 个字母 + 48 个国际音标的全部字段：字母符号、音标、中文谐音、例词、发音要领、音频路径。
 * 本文件是英语模块的**唯一数据源**：
 *   - 本文件由 index.html 用 <script> 直接引入，window.MIAO_EN 就地被前端读取，没有后端下发
 *   - 音频就在这个目录树里：assets/audio/letters/ 与 assets/audio/phonemes/，
 *     以 /assets/audio/<子目录>/<文件> 提供；a 字段写的就是浏览器要请求的绝对路径
 *
 * 音频编号 = 教学视频里羽毛指针的朗读顺序（01-48），不是本表 i 字段的顺序：
 *   元音按表格「长 | 短」两列逐列成对读：ɑː ʌ ɔː ɒ ɜː ə iː ɪ uː ʊ e æ（01-12）
 *   双元音按行从左到右：aɪ eɪ ɔɪ ɪə eə ʊə əʊ aʊ（13-20）
 *   辅音按「清 | 浊」两列逐列成对读：p b t d k g f v θ ð s z（21-32）、
 *     ʃ ʒ h r ts dz tʃ dʒ tr dr（33-42），随后鼻音 m n ŋ（43-45）、
 *     半元音 j w（46-47）、舌边音 l（48）
 * 改音频时按这个顺序重切，再回来核对每条 a 字段。
 */
window.MIAO_EN = {
  /* ---------------- 26 个字母 ---------------- */
  letters: [
    { l: "A", ipa: "/eɪ/", cn: "诶", a: "/assets/audio/letters/A.mp3" },
    { l: "B", ipa: "/biː/", cn: "比", a: "/assets/audio/letters/B.mp3" },
    { l: "C", ipa: "/siː/", cn: "西", a: "/assets/audio/letters/C.mp3" },
    { l: "D", ipa: "/diː/", cn: "迪", a: "/assets/audio/letters/D.mp3" },
    { l: "E", ipa: "/iː/", cn: "衣", a: "/assets/audio/letters/E.mp3" },
    { l: "F", ipa: "/ef/", cn: "艾弗", a: "/assets/audio/letters/F.mp3" },
    { l: "G", ipa: "/dʒiː/", cn: "吉", a: "/assets/audio/letters/G.mp3" },
    { l: "H", ipa: "/eɪtʃ/", cn: "诶吃", a: "/assets/audio/letters/H.mp3" },
    { l: "I", ipa: "/aɪ/", cn: "爱", a: "/assets/audio/letters/I.mp3" },
    { l: "J", ipa: "/dʒeɪ/", cn: "杰", a: "/assets/audio/letters/J.mp3" },
    { l: "K", ipa: "/keɪ/", cn: "凯", a: "/assets/audio/letters/K.mp3" },
    { l: "L", ipa: "/el/", cn: "艾欧", a: "/assets/audio/letters/L.mp3" },
    { l: "M", ipa: "/em/", cn: "艾姆", a: "/assets/audio/letters/M.mp3" },
    { l: "N", ipa: "/en/", cn: "恩", a: "/assets/audio/letters/N.mp3" },
    { l: "O", ipa: "/oʊ/", cn: "欧", a: "/assets/audio/letters/O.mp3" },
    { l: "P", ipa: "/piː/", cn: "皮", a: "/assets/audio/letters/P.mp3" },
    { l: "Q", ipa: "/kjuː/", cn: "克由", a: "/assets/audio/letters/Q.mp3" },
    { l: "R", ipa: "/ɑr/", cn: "阿尔", a: "/assets/audio/letters/R.mp3" },
    { l: "S", ipa: "/es/", cn: "艾斯", a: "/assets/audio/letters/S.mp3" },
    { l: "T", ipa: "/tiː/", cn: "提", a: "/assets/audio/letters/T.mp3" },
    { l: "U", ipa: "/juː/", cn: "优", a: "/assets/audio/letters/U.mp3" },
    { l: "V", ipa: "/viː/", cn: "维", a: "/assets/audio/letters/V.mp3" },
    { l: "W", ipa: "/ˈdʌbəljuː/", cn: "达不溜", a: "/assets/audio/letters/W.mp3" },
    { l: "X", ipa: "/eks/", cn: "艾克斯", a: "/assets/audio/letters/X.mp3" },
    { l: "Y", ipa: "/waɪ/", cn: "歪", a: "/assets/audio/letters/Y.mp3" },
    { l: "Z", ipa: "/ziː/", cn: "贼", a: "/assets/audio/letters/Z.mp3" }
  ],

  /* ---------------- 48 个国际音标 ---------------- */
  phonemes: [
    { i: 1,  ph: "/ɑː/", cn: "啊", grp: "长元音", w: "car",      tip: "嘴巴张大，像看嗓子", a: "/assets/audio/phonemes/01.mp3" },
    { i: 2,  ph: "/ɔː/", cn: "哦", grp: "长元音", w: "door",     tip: "嘴唇收圆，向前突出", a: "/assets/audio/phonemes/03.mp3" },
    { i: 3,  ph: "/ɜː/", cn: "额", grp: "长元音", w: "bird",     tip: "舌身平放，像发“饿”", a: "/assets/audio/phonemes/05.mp3" },
    { i: 4,  ph: "/iː/", cn: "衣", grp: "长元音", w: "see",      tip: "嘴角咧开像微笑，拉长", a: "/assets/audio/phonemes/07.mp3" },
    { i: 5,  ph: "/uː/", cn: "乌", grp: "长元音", w: "too",      tip: "嘴唇收圆，用力前嘟", a: "/assets/audio/phonemes/09.mp3" },
    { i: 6,  ph: "/ɪ/",  cn: "衣", grp: "短元音", w: "sit",      tip: "嘴巴放松，短促有力", a: "/assets/audio/phonemes/08.mp3" },
    { i: 7,  ph: "/e/",  cn: "唉", grp: "短元音", w: "bed",      tip: "嘴微张，舌尖抵下齿", a: "/assets/audio/phonemes/11.mp3" },
    { i: 8,  ph: "/æ/",  cn: "哎", grp: "短元音", w: "cat",      tip: "嘴巴张大，下巴下拉", a: "/assets/audio/phonemes/12.mp3" },
    { i: 9,  ph: "/ʌ/",  cn: "啊", grp: "短元音", w: "cup",      tip: "嘴巴半张，发音干脆", a: "/assets/audio/phonemes/02.mp3" },
    { i: 10, ph: "/ɒ/",  cn: "哦", grp: "短元音", w: "hot",      tip: "嘴巴微圆（英式发音）", a: "/assets/audio/phonemes/04.mp3" },
    { i: 11, ph: "/ʊ/",  cn: "乌", grp: "短元音", w: "book",     tip: "嘴唇微圆，放松", a: "/assets/audio/phonemes/10.mp3" },
    { i: 12, ph: "/ə/",  cn: "额", grp: "短元音", w: "about",    tip: "最放松的音，一带而过", a: "/assets/audio/phonemes/06.mp3" },
    { i: 13, ph: "/eɪ/", cn: "诶", grp: "双元音", w: "day",      tip: "从 /e/ 滑向 /ɪ/（字母A音）", a: "/assets/audio/phonemes/14.mp3" },
    { i: 14, ph: "/aɪ/", cn: "诶衣", grp: "双元音", w: "my",     tip: "从 /a/ 滑向 /ɪ/（字母I音）", a: "/assets/audio/phonemes/13.mp3" },
    { i: 15, ph: "/ɔɪ/", cn: "哦衣", grp: "双元音", w: "boy",    tip: "从 /ɔ/ 滑向 /ɪ/，连读", a: "/assets/audio/phonemes/15.mp3" },
    { i: 16, ph: "/əʊ/", cn: "欧", grp: "双元音", w: "go",       tip: "从 /ə/ 滑向 /ʊ/（字母O音）", a: "/assets/audio/phonemes/19.mp3" },
    { i: 17, ph: "/aʊ/", cn: "奥", grp: "双元音", w: "now",      tip: "从 /a/ 滑向 /ʊ/，嘴巴收圆", a: "/assets/audio/phonemes/20.mp3" },
    { i: 18, ph: "/ɪə/", cn: "衣额", grp: "双元音", w: "here",   tip: "从 /ɪ/ 滑向 /ə/，连读", a: "/assets/audio/phonemes/16.mp3" },
    { i: 19, ph: "/eə/", cn: "哎额", grp: "双元音", w: "hair",   tip: "从 /e/ 滑向 /ə/，连读", a: "/assets/audio/phonemes/17.mp3" },
    { i: 20, ph: "/ʊə/", cn: "乌额", grp: "双元音", w: "tour",   tip: "从 /ʊ/ 滑向 /ə/，连读", a: "/assets/audio/phonemes/18.mp3" },
    { i: 21, ph: "/p/",  cn: "泼", grp: "清辅音", w: "pen",      tip: "双唇紧闭，突然放开", a: "/assets/audio/phonemes/21.mp3" },
    { i: 22, ph: "/t/",  cn: "特", grp: "清辅音", w: "ten",      tip: "舌尖抵上齿龈，突然放开", a: "/assets/audio/phonemes/23.mp3" },
    { i: 23, ph: "/k/",  cn: "科", grp: "清辅音", w: "key",      tip: "舌根抵软腭，突然放开", a: "/assets/audio/phonemes/25.mp3" },
    { i: 24, ph: "/f/",  cn: "夫", grp: "清辅音", w: "five",     tip: "上齿轻咬下唇，吹气", a: "/assets/audio/phonemes/27.mp3" },
    { i: 25, ph: "/θ/",  cn: "丝", grp: "清辅音", w: "think",    tip: "舌尖伸出，上下齿轻咬舌尖", a: "/assets/audio/phonemes/29.mp3" },
    { i: 26, ph: "/s/",  cn: "丝", grp: "清辅音", w: "see",      tip: "舌尖靠近齿龈，吹气", a: "/assets/audio/phonemes/31.mp3" },
    { i: 27, ph: "/b/",  cn: "波", grp: "浊辅音", w: "bag",      tip: "双唇紧闭，突然放开，声带震动", a: "/assets/audio/phonemes/22.mp3" },
    { i: 28, ph: "/d/",  cn: "得", grp: "浊辅音", w: "dog",      tip: "舌尖抵上齿龈，突然放开，声带震动", a: "/assets/audio/phonemes/24.mp3" },
    { i: 29, ph: "/g/",  cn: "哥", grp: "浊辅音", w: "get",      tip: "舌根抵软腭，突然放开，声带震动", a: "/assets/audio/phonemes/26.mp3" },
    { i: 30, ph: "/v/",  cn: "乌", grp: "浊辅音", w: "very",     tip: "上齿轻咬下唇，声带震动", a: "/assets/audio/phonemes/28.mp3" },
    { i: 31, ph: "/ð/",  cn: "兹", grp: "浊辅音", w: "this",     tip: "舌尖伸出，上下齿轻咬舌尖，声带震动", a: "/assets/audio/phonemes/30.mp3" },
    { i: 32, ph: "/z/",  cn: "兹", grp: "浊辅音", w: "zoo",      tip: "舌尖靠近齿龈，声带震动", a: "/assets/audio/phonemes/32.mp3" },
    { i: 33, ph: "/ʃ/",  cn: "诗", grp: "清辅音", w: "she",      tip: "嘴唇收圆，向前突出", a: "/assets/audio/phonemes/33.mp3" },
    { i: 34, ph: "/h/",  cn: "喝", grp: "清辅音", w: "hat",      tip: "嘴巴张开，自然呵气", a: "/assets/audio/phonemes/35.mp3" },
    { i: 35, ph: "/tʃ/", cn: "吃", grp: "清辅音", w: "chair",    tip: "类似“吃”，声带不震动", a: "/assets/audio/phonemes/39.mp3" },
    { i: 36, ph: "/tr/", cn: "戳", grp: "清辅音", w: "tree",     tip: "类似“戳”，声带不震动", a: "/assets/audio/phonemes/41.mp3" },
    { i: 37, ph: "/ts/", cn: "次", grp: "清辅音", w: "cats",     tip: "类似“次”，声带不震动", a: "/assets/audio/phonemes/37.mp3" },
    { i: 38, ph: "/ʒ/",  cn: "日", grp: "浊辅音", w: "pleasure", tip: "嘴唇收圆，声带震动", a: "/assets/audio/phonemes/34.mp3" },
    { i: 39, ph: "/r/",  cn: "惹", grp: "浊辅音", w: "red",      tip: "舌尖卷起，不碰任何地方，悬空", a: "/assets/audio/phonemes/36.mp3" },
    { i: 40, ph: "/dʒ/", cn: "知", grp: "浊辅音", w: "job",      tip: "类似“知”，声带震动", a: "/assets/audio/phonemes/40.mp3" },
    { i: 41, ph: "/dr/", cn: "桌", grp: "浊辅音", w: "dream",    tip: "类似“桌”，声带震动", a: "/assets/audio/phonemes/42.mp3" },
    { i: 42, ph: "/dz/", cn: "兹", grp: "浊辅音", w: "beds",     tip: "类似“兹”，声带震动", a: "/assets/audio/phonemes/38.mp3" },
    { i: 43, ph: "/m/",  cn: "姆", grp: "鼻音",   w: "man",      tip: "闭嘴，气流从鼻子出", a: "/assets/audio/phonemes/43.mp3" },
    { i: 44, ph: "/n/",  cn: "呢", grp: "鼻音",   w: "no",       tip: "舌尖顶上齿龈，气流从鼻子出", a: "/assets/audio/phonemes/44.mp3" },
    { i: 45, ph: "/ŋ/",  cn: "昂", grp: "鼻音",   w: "sing",     tip: "舌根顶软腭，气流从鼻子出", a: "/assets/audio/phonemes/45.mp3" },
    { i: 46, ph: "/j/",  cn: "耶", grp: "半元音", w: "yes",      tip: "类似“耶”，快速滑向元音", a: "/assets/audio/phonemes/46.mp3" },
    { i: 47, ph: "/w/",  cn: "哇", grp: "半元音", w: "wet",      tip: "嘴唇收圆，快速滑向元音", a: "/assets/audio/phonemes/47.mp3" },
    { i: 48, ph: "/l/",  cn: "了", grp: "舌边音", w: "like",     tip: "舌尖顶上齿龈，气流从舌两侧出", a: "/assets/audio/phonemes/48.mp3" }
  ],

  /* ---------------- 音标分类顺序（正文分组渲染用） ---------------- */
  groups: ["长元音", "短元音", "双元音", "清辅音", "浊辅音", "鼻音", "半元音", "舌边音"],

  /* ---------------- 教程正文（data.js 组装时读此字段） ---------------- */
  tutorial: {
    id: "english",
    title: "英语发音入门：26 字母 + 48 音标",
    intro: "26 个字母、48 个国际音标，每个都能直接听发音。配套卡片帮你把字母和音标一次记牢，打好英语拼读的地基喵～",
    cat: "英语",
    diff: "入门",
    tags: ["英语", "音标", "发音", "零基础"],
    author: "喵站官方",
    /* 封面由代码绘制，文件在 ../frontend/assets/img/covers/english.svg */
    cover: "/assets/img/covers/english.svg",
    chapters: [
      {
        id: "en-c01",
        title: "第一章 · 26 个字母",
        blocks: [
          { t: "p", text: "英语的 26 个字母是拼读的地基。每个字母都有自己的读音，点下面的卡片就能听到标准发音。" },
          { t: "tip", text: "注意：字母本身的名字（letter name）和它在单词里的读音（sound）经常不一样，比如 A 的名字叫 /eɪ/，但它自己读的时候是 /æ/。下面卡片里给的是字母读音，也就是 sound。" },
          { t: "en", kind: "let" }
        ]
      },
      {
        id: "en-c02",
        title: "第二章 · 48 个国际音标",
        blocks: [
          { t: "p", text: "音标是字母实际发出的声音。英语一共 48 个音标，分元音和辅音两大类，元音 20 个、辅音 28 个。点卡片听发音。" },
          { t: "en", kind: "ph", grp: "长元音" },
          { t: "en", kind: "ph", grp: "短元音" },
          { t: "en", kind: "ph", grp: "双元音" },
          { t: "en", kind: "ph", grp: "清辅音" },
          { t: "en", kind: "ph", grp: "浊辅音" },
          { t: "en", kind: "ph", grp: "鼻音" },
          { t: "en", kind: "ph", grp: "半元音" },
          { t: "en", kind: "ph", grp: "舌边音" },
          { t: "tip", text: "中文谐音只是辅助记忆的拐杖，别当真。真正要记住的是音标符号和它的发音口型。" }
        ]
      },
      {
        id: "en-c03",
        title: "第三章 · 怎么练最有效",
        blocks: [
          { t: "h2", text: "三步走" },
          { t: "ul", items: [
            "先只听不看：随机点几张卡片，闭上眼睛猜是哪个字母或音标。",
            "再看文字对照：翻开上面的音标，确认自己猜对了没有。",
            "最后成串练：把整组音标连着读一遍，比如 5 个长元音一口气读完。"
          ]},
          { t: "h2", text: "容易踩的坑" },
          { t: "ul", items: [
            "/æ/ 嘴要张到最大，下巴往下掉，别读成 /e/。",
            "/ʌ/（啊）和 /ɑː/（长音啊）不是一回事，前者短促、后者拖长。",
            "/θ/ 和 /ð/ 要伸舌头轻咬，别读成 /s/ 或 /z/。",
            "/r/ 舌尖卷起悬空，不碰上颚，和汉语「日」的卷舌不同。",
            "/l/ 在词尾读「欧」，舌尖要顶住上齿龈。"
          ]},
          { t: "tip", text: "这套卡片音频是从两段教学视频里逐帧定位切出来的，语速和原视频一致，跟着念最省力。" }
        ]
      }
    ]
  }
};
