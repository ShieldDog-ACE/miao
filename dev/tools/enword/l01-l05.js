/* 喵站 · 英语入门 · 词表原稿（第 1–5 课）
 *
 * 这门课的唯一手填内容。生成器 dev/tools/enword-gen.js 读本目录四个文件，
 * 产出 frontend/assets/data/enwords-data.js（站点数据）与音频清单。
 * 改单词、改讲解都改这里，不要改产物 —— 产物会被重跑覆盖。
 *
 * 字段口径：
 *   title  章标题（「第 N 课 · 」前缀必须，app.js 的「第 N 课」内链靠它）
 *   goal   本课目标（开头蓝色 tip）
 *   words  本课的词：w 单词 / ipa 英式 DJ 音标 / pos 词性 / cn 中文 / ph 常用短语
 *          核心句子里出现的超纲词也要补进来，所以不一定正好 10 条
 *          say 只给 TTS 读的单词文本（默认等于 w）
 *          phsay 只给 TTS 读的整句文本（默认等于 ph），代码符号之类要写成能读的英文
 *   read   读音要点（3–4 条，只讲本课这些词的坑）
 *   memo   怎么记（3 条）
 *   trap   常见坑（3 条）
 *   task   任务（3 条，只出题不给答案）
 *   one    本课一句话（结尾绿色 tip）
 */
window.MIAO_ENW_SRC = window.MIAO_ENW_SRC || {};

window.MIAO_ENW_SRC.l01 = {
  title: "第 1 课 · 打招呼与礼貌用语",
  goal: "这一课的词是开口的第一批。学完你能打招呼、道别、道谢、道歉，还能听懂「可以不可以」。",
  words: [
    { w: "hello", ipa: "/həˈləʊ/", pos: "int.", cn: "你好；喂（电话用语）", ph: "hello, everyone", phcn: "你好，每个人" },
    { w: "goodbye", ipa: "/ˌɡʊdˈbaɪ/", pos: "int.", cn: "再见", ph: "say goodbye to her", phcn: "对她说再见" },
    { w: "please", ipa: "/pliːz/", pos: "int.", cn: "请", ph: "two tickets, please", phcn: "请来两张票" },
    { w: "thank", ipa: "/θæŋk/", pos: "v.", cn: "谢谢", ph: "thank you", phcn: "谢谢你" },
    { w: "sorry", ipa: "/ˈsɒri/", pos: "adj.", cn: "抱歉的；对不起", ph: "sorry, I am late", phcn: "对不起，我迟到了" },
    { w: "yes", ipa: "/jes/", pos: "adv.", cn: "是；对", ph: "yes, I know", phcn: "是的，我知道" },
    { w: "no", ipa: "/nəʊ/", pos: "adv.", cn: "不；没有", ph: "no, thanks", phcn: "不了，谢谢" },
    { w: "OK", ipa: "/əʊˈkeɪ/", pos: "adj.", cn: "好的；可以", ph: "It is OK.", phcn: "没关系。", say: "okay", phsay: "It is okay." },
    { w: "welcome", ipa: "/ˈwelkəm/", pos: "v.", cn: "欢迎", ph: "welcome to China", phcn: "欢迎来中国" },
    { w: "morning", ipa: "/ˈmɔːnɪŋ/", pos: "n.", cn: "早晨；上午", ph: "Good morning!", phcn: "早上好！" },
    { w: "everyone", ipa: "/ˈevriwʌn/", pos: "pron.", cn: "每个人；大家", ph: "everyone is here", phcn: "每个人都在这儿" },
    { w: "ticket", ipa: "/ˈtɪkɪt/", pos: "n.", cn: "票；车票", ph: "one ticket", phcn: "一张票" },
    { w: "late", ipa: "/leɪt/", pos: "adj.", cn: "迟到的；晚的", ph: "you are late", phcn: "你迟到了" },
    { w: "know", ipa: "/nəʊ/", pos: "v.", cn: "知道；认识", ph: "I know him", phcn: "我认识他" },
    { w: "China", ipa: "/ˈtʃaɪnə/", pos: "n.", cn: "中国", ph: "I am from China", phcn: "我来自中国" }
  ],
  read: [
    "hello 重音在后面那截：hə-LEU，前面的 h 轻轻带过，别读成 HE-lou。",
    "thank 与 think（想）只差一个音：thank 是 /θæŋk/（嘴巴张大），think 是 /θɪŋk/。舌头都要伸出来轻咬。",
    "no 与 OK 里的 o 都是双元音 /əʊ/，从「额」滑到「乌」，不是一个短音。",
    "sorry 两个音节平均用力：SO-ri，别把后面的 ri 读成中文的「瑞」。"
  ],
  memo: [
    "把 hello / goodbye / morning 绑成一天的三句：早上见说 hello，说 Good morning，走的时候说 goodbye。",
    "please 挂在句子尾巴上最省事：Give me the book, please.（give 给，me 我，book 书）先练句尾这一种位置。",
    "yes 和 no 用「点头 / 摇头」来记，身体记住了，嘴就不容易说反。"
  ],
  trap: [
    "Good morning 只在中午以前用；下午要换后面的课里会遇到的说法，别一路 morning 到晚饭。",
    "thank 后面要接 you：Thank you. 单独一句 Thank. 是半句话。",
    "OK 的读音是 /əʊˈkeɪ/ 两个音节，跟中文「OK」的三声调不一样。"
  ],
  task: [
    "把本课词卡的音频各听一遍，然后不看文字，只凭声音说出中文。",
    "对着镜子把 hello 和 Good morning! 各说三遍，注意嘴要张开。",
    "用 please 造两句要东西的话，把句子读给自己听。"
  ],
  one: "开口的第一批词不用多，说顺了，比记一百个说得磕巴划算。"
};

window.MIAO_ENW_SRC.l02 = {
  title: "第 2 课 · 人称与称呼",
  goal: "这一课的词解决「说谁」。学完你能用 I / you / he / she 起头，也知道 my、your 放在名词前面。",
  words: [
    { w: "I", ipa: "/aɪ/", pos: "pron.", cn: "我", ph: "I am a student.", phcn: "我是学生。", say: "I" },
    { w: "you", ipa: "/juː/", pos: "pron.", cn: "你；你们", ph: "you and I", phcn: "你和我" },
    { w: "he", ipa: "/hiː/", pos: "pron.", cn: "他", ph: "He is my friend.", phcn: "他是我的朋友。" },
    { w: "she", ipa: "/ʃiː/", pos: "pron.", cn: "她", ph: "She is kind.", phcn: "她很和善。" },
    { w: "it", ipa: "/ɪt/", pos: "pron.", cn: "它", ph: "It is a cat.", phcn: "它是一只猫。" },
    { w: "we", ipa: "/wiː/", pos: "pron.", cn: "我们", ph: "We are ready.", phcn: "我们准备好了。" },
    { w: "they", ipa: "/ðeɪ/", pos: "pron.", cn: "他们；她们；它们", ph: "They are here.", phcn: "他们在这里。" },
    { w: "my", ipa: "/maɪ/", pos: "adj.", cn: "我的", ph: "my book", phcn: "我的书" },
    { w: "your", ipa: "/jɔː/", pos: "adj.", cn: "你的；你们的", ph: "your name", phcn: "你的名字" },
    { w: "friend", ipa: "/frend/", pos: "n.", cn: "朋友", ph: "a good friend", phcn: "一位好朋友" },
    { w: "kind", ipa: "/kaɪnd/", pos: "adj.", cn: "和善的；友好的", ph: "my kind friend", phcn: "我和善的朋友" },
    { w: "ready", ipa: "/ˈredi/", pos: "adj.", cn: "准备好的", ph: "I am ready", phcn: "我准备好了" },
    { w: "name", ipa: "/neɪm/", pos: "n.", cn: "名字", ph: "my name", phcn: "我的名字" }
  ],
  read: [
    "he / she / we / they 都带一个长元音，读的时候舍得拖；it 是短音 /ɪt/，干脆收掉。",
    "she 的 sh 是 /ʃ/，嘴唇收圆；别和 he 的 /h/（呵气）混。",
    "they 开头是 /ð/，舌尖伸出轻咬并振动声带，和「日」不是一回事。",
    "your 读 /jɔː/，中间没有「u」那个音，别读成「哟儿」。"
  ],
  memo: [
    "一个人称一句套话：I am … / You are … / He is … / She is …，先把三句骨架念熟，再往里换词。",
    "my / your 后面必须挂名词：my book（我的书）、your name（你的名字）。它们不单独当主语用。",
    "friend 里藏着 end（结尾）的读音，结尾 /nd/ 两个音都要出来，别吞成「fri」。"
  ],
  trap: [
    "英文主语不能丢：中文「是学生」可以直接说，英文必须 I am a student. 主语写在前面。",
    "it 指物和指天用，不指人；说人用 he / she。",
    "they 是复数，一个人不能说 they are —— 一个人用 he / she / it。"
  ],
  task: [
    "用 I am / You are / He is / She is 各说一句，对象随便挑。",
    "把 my 和 your 各配三个名词，写下来再读一遍。",
    "听本课词卡的音频，听到 /ð/ 那个音就把手举起来。"
  ],
  one: "人称词是全句的地基，读准这一课的词，后面每句都省一次返工。"
};

window.MIAO_ENW_SRC.l03 = {
  title: "第 3 课 · 家庭成员",
  goal: "这一课的词让你能报出自家的构成。学完你能说 father、mother、brother、sister，也知道 parents 已经把两个人装进去了。",
  words: [
    { w: "family", ipa: "/ˈfæməli/", pos: "n.", cn: "家庭；家人", ph: "my family", phcn: "我的家人" },
    { w: "father", ipa: "/ˈfɑːðə/", pos: "n.", cn: "父亲", ph: "my father is tall.", phcn: "我爸爸个子高。" },
    { w: "mother", ipa: "/ˈmʌðə/", pos: "n.", cn: "母亲", ph: "a mother of three", phcn: "三个孩子的母亲" },
    { w: "brother", ipa: "/ˈbrʌðə/", pos: "n.", cn: "兄弟", ph: "my big brother", phcn: "我的哥哥" },
    { w: "sister", ipa: "/ˈsɪstə/", pos: "n.", cn: "姐妹", ph: "my little sister", phcn: "我的妹妹" },
    { w: "son", ipa: "/sʌn/", pos: "n.", cn: "儿子", ph: "her son", phcn: "她的儿子" },
    { w: "daughter", ipa: "/ˈdɔːtə/", pos: "n.", cn: "女儿", ph: "their daughter", phcn: "他们的女儿" },
    { w: "grandpa", ipa: "/ˈɡrænpɑː/", pos: "n.", cn: "爷爷；外公", ph: "my grandpa", phcn: "我的爷爷" },
    { w: "grandma", ipa: "/ˈɡrænmɑː/", pos: "n.", cn: "奶奶；外婆", ph: "Grandma is at home.", phcn: "奶奶在家里。" },
    { w: "parents", ipa: "/ˈpeərənts/", pos: "n.", cn: "父母", ph: "my parents", phcn: "我的父母" },
    { w: "little", ipa: "/ˈlɪtl/", pos: "adj.", cn: "小的；年幼的", ph: "my little brother", phcn: "我的弟弟" }
  ],
  read: [
    "father / mother / brother 结尾都是同一个 /ðə/：舌尖伸出去咬一下，别收成「特」。",
    "daughter 前面的 a 读长音 /ɔː/，中间的 gh 完全不出声，别按字面拼出 g 或 h。",
    "grandpa 与 grandma 只差最后一个元音：/pɑː/ 对 /mɑː/，嘴巴都要张大拖长。",
    "parents 第一音节重读，/eə/ 从「哎」滑到「额」，别读成「白轮次」。"
  ],
  memo: [
    "按辈分排成一串记：grandpa / grandma → father / mother → brother / sister → son / daughter。",
    "parents 自带两个人，前面不再加 s；一个爸说 my father。",
    "family 三个音节，重音在第一个：FA-mə-li，后面两截轻得像没说清。"
  ],
  trap: [
    "brother / sister 不分哥哥弟弟、姐姐妹妹，要区分就加 big / little（big 大，little 小）。",
    "grandpa / grandma 是口语叫法，正式写法是 grandfather（爷爷/外公）/ grandmother（奶奶/外婆），后面再遇到。",
    "中文「爸爸妈妈」前面常带「我」，英文说 my father，不能省 my，也不能省冠词。"
  ],
  task: [
    "把自家的人名换成这一课里的称呼，用 my 起头说五句。",
    "听音频跟读 father、mother、brother 三遍，重点放在结尾的 /ðə/。",
    "画一张三辈的图，图上每个位置标一个英文称呼。"
  ],
  one: "家庭词按辈分排着记，一串下去，这一课的词变成一张图。"
};

window.MIAO_ENW_SRC.l04 = {
  title: "第 4 课 · 数字一（1 到 10）",
  goal: "这一课的数字是英语里最先要用到的。学完你能报数、说年龄、给电话号分段。",
  words: [
    { w: "one", ipa: "/wʌn/", pos: "num.", cn: "一", ph: "one day", phcn: "一天" },
    { w: "two", ipa: "/tuː/", pos: "num.", cn: "二", ph: "two cups", phcn: "两个杯子" },
    { w: "three", ipa: "/θriː/", pos: "num.", cn: "三", ph: "three of us", phcn: "我们三个人" },
    { w: "four", ipa: "/fɔː/", pos: "num.", cn: "四", ph: "four seasons", phcn: "四个季节" },
    { w: "five", ipa: "/faɪv/", pos: "num.", cn: "五", ph: "five minutes", phcn: "五分钟" },
    { w: "six", ipa: "/sɪks/", pos: "num.", cn: "六", ph: "six eggs", phcn: "六个鸡蛋" },
    { w: "seven", ipa: "/ˈsevn/", pos: "num.", cn: "七", ph: "seven days", phcn: "七天" },
    { w: "eight", ipa: "/eɪt/", pos: "num.", cn: "八", ph: "at eight o'clock", phcn: "在八点钟" },
    { w: "nine", ipa: "/naɪn/", pos: "num.", cn: "九", ph: "nine times", phcn: "九次" },
    { w: "ten", ipa: "/ten/", pos: "num.", cn: "十", ph: "ten yuan", phcn: "十元" },
    { w: "cup", ipa: "/kʌp/", pos: "n.", cn: "杯子", ph: "six cups", phcn: "六个杯子" },
    { w: "time", ipa: "/taɪm/", pos: "n.", cn: "次；时间", ph: "three times", phcn: "三次" },
    { w: "yuan", ipa: "/juːˈæn/", pos: "n.", cn: "元（人民币）", ph: "one yuan", phcn: "一元" }
  ],
  read: [
    "three 开头是 /θ/，舌头伸出来；很多人图省事读成「斯瑞」，一读就露馅。",
    "four 是长音 /fɔː/，嘴唇收圆拖住；five 的 v 要咬唇振动，别读成「法乌」就完事。",
    "eight 只有一个音 /eɪt/，开头的 e 是双元音 /eɪ/，写起来三个字母、读起来一步滑过。",
    "seven 重音在前面，第二个音节几乎只剩一个 n：SEV-n。"
  ],
  memo: [
    "先记手指：一到五是一把手，六到十是数完两遍手指，报数时手上就有答案。",
    "six / seven 都在中间断一下，念的时候别和下一词粘住：six eggs（六个鸡蛋）里 s 和 e 分清楚。",
    "two 与 true（真的）只差首音：/t/ 对 /tr/，先把 two 的 /t/ 收干净。"
  ],
  trap: [
    "one 读 /wʌn/，开头是 w，不是「万」。",
    "ten /e/ 与 two /uː/ 是两个完全不同的元音，语速一快最容易糊，先慢读对。",
    "eight 后面的 t 要出来，读成「诶」就少了尾巴。"
  ],
  task: [
    "从一数到十，连数三遍，第三遍闭着眼睛数。",
    "报出自己的年龄、生日的号、以及一串五位数的号码。",
    "听音频判断读到的是几，写下数字，十个全对为止。"
  ],
  one: "数字是最划算的一批词：读音就那些，用到处都是，练熟不再需要想。"
};

window.MIAO_ENW_SRC.l05 = {
  title: "第 5 课 · 数字二（11 到 20）",
  goal: "这一课的数字专门治「十几」这一批。学完你能把 11 到 20 连着报下来，不用先在心里翻译。",
  words: [
    { w: "eleven", ipa: "/ɪˈlevən/", pos: "num.", cn: "十一", ph: "eleven students", phcn: "十一个学生" },
    { w: "twelve", ipa: "/twelv/", pos: "num.", cn: "十二", ph: "twelve months", phcn: "十二个月" },
    { w: "thirteen", ipa: "/ˌθɜːˈtiːn/", pos: "num.", cn: "十三", ph: "thirteen years old", phcn: "十三岁" },
    { w: "fourteen", ipa: "/ˌfɔːˈtiːn/", pos: "num.", cn: "十四", ph: "fourteen days", phcn: "十四天" },
    { w: "fifteen", ipa: "/ˌfɪfˈtiːn/", pos: "num.", cn: "十五", ph: "fifteen minutes", phcn: "十五分钟" },
    { w: "sixteen", ipa: "/ˌsɪksˈtiːn/", pos: "num.", cn: "十六", ph: "sixteen pens", phcn: "十六支笔" },
    { w: "seventeen", ipa: "/ˌsevnˈtiːn/", pos: "num.", cn: "十七", ph: "seventeen cities", phcn: "十七座城市" },
    { w: "eighteen", ipa: "/ˌaɪˈtiːn/", pos: "num.", cn: "十八", ph: "eighteen rules", phcn: "十八条规则" },
    { w: "nineteen", ipa: "/ˌnaɪnˈtiːn/", pos: "num.", cn: "十九", ph: "nineteen times", phcn: "十九次" },
    { w: "twenty", ipa: "/ˈtwenti/", pos: "num.", cn: "二十", ph: "twenty questions", phcn: "二十个问题" },
    { w: "city", ipa: "/ˈsɪti/", pos: "n.", cn: "城市", ph: "twelve cities", phcn: "十二座城市" },
    { w: "rule", ipa: "/ruːl/", pos: "n.", cn: "规则", ph: "one rule", phcn: "一条规则" },
    { w: "question", ipa: "/ˈkwestʃən/", pos: "n.", cn: "问题", ph: "one question", phcn: "一个问题" }
  ],
  read: [
    "13 到 19 的尾巴都是 -teen，重音在这个长音 /tiːn/ 上：three-TEEN。",
    "eighteen 是特例，中间没有 t 的音：/ˌaɪˈtiːn/，直接 eight 的读音接 teen。",
    "fifteen 里是 /fɪf/，不是 five 的 /faɪv/；five→fifteen 元音换了。",
    "twenty 两个音节平均，重音在前：TWEN-ti，尾巴是 /ti/ 不是 /tiːn/。"
  ],
  memo: [
    "把 -teen 和后面的 -ty 分开记：-teen 长音重读、往上扬；-ty 短音轻读、往下掉。",
    "eleven 与 twelve 是两个独立形状，套不进规律，只能单独读熟。",
    "seventeen 中间只剩一个 n 的音：SE-vən-TEEN，别把 seven 读全了再接 teen。"
  ],
  trap: [
    "thirteen / thirty 的区别全在重音：thir-TEEN 重后，THIR-ti 重前。这课先把 teen 钉牢。",
    "eighteen 别读成 eig-teen，两个 t 连读就错了。",
    "twenty 的 y 读 /i/，短促，不要拖成「二十」的中文调。"
  ],
  task: [
    "把 11 到 20 连着报三遍，中间不停顿。",
    "听音频写下你听到的数字，十个全对为止。",
    "从这一课和上一课的二十个数字里任选五个，各配一个名词说出来。"
  ],
  one: "十几这一批词，听得出重音就已经会了一半。"
};
