/* 喵站 · C++ 掌握 考卷分部 p06：第 97–100 课
 * 契约同前几场：权重和 100、源稿每条任务都有题 coversTask 对着、refs 判 100 / wrongs <60 / loose 过。
 */
window.MIAO_CPPM_EXAM_P06 = {
  papers: [
    {
      cid: "m97", kind: "paper", pass: 60,
      title: "第 97 课考试 · map 入门",
      task: "任务题目：往这本词典里多登记几条记录，说清打印出来的顺序为什么是那个样子；再把「单独查小红的分数」写成一行。",
      hint: "回看本课【怎么做】那段、【演示 1 · 同一个键再写一次，是覆盖不是新增】与【演示 3 · 顺序由键说了算】。",
      questions: [
        { id: "q1", type: "choice", score: 12,
          stem: "跟第 87 课那张 vector 加 struct 的登记表比，map 主要省掉的是哪一步？",
          options: ["给每行起个结构体名字", "每来一个词就从表头扫到表尾找那一行", "最后按次数排序", "把数字初始化成 0"],
          answer: 1,
          why: "登记表是平铺的，只能一格一格看；map 里那棵树按键比大小，一步就走到，省的是「扫全表找行号」。" },
        { id: "q2", type: "code", score: 20, coversTask: 1,
          stem: "（任务题）写出这两行：声明一本「名字对应分数」的词典，变量名 scores；再把 小红 这条记录登记成 95 分。",
          acceptRegex: ["std::map\\s*<\\s*std::string\\s*,\\s*int\\s*>\\s+scores", "scores\\s*\\[\\s*\"小红\"\\s*\\]\\s*=\\s*95"],
          why: "尖括号里前键后值，两个类型都得给全；写入就是 scores 方括号 键 等于 值。" },
        { id: "q3", type: "output", score: 16, coversTask: 1,
          stem: "（任务题）依次写入 小明 88、小强 72、小红 95，然后按 name 与 score 遍历打印，每行一组，输出是什么？",
          acceptLines: ["小强 72", "小明 88", "小红 95"],
          why: "树按键的字节序长：小强、小明、小红，值不参与排序 —— 所以顺序不是插入顺序。" },
        { id: "q4", type: "choice", score: 14,
          stem: "词典里已经有 scores[\"小明\"] = 88，再写一句 scores[\"小明\"] = 90;，结果是？",
          options: ["编译报错，键不许重复", "新增一条记录，size 从 3 变 4", "把那条记录的值改成 90，条数不变", "旧的被删掉，新的排到最后"],
          answer: 2,
          why: "map 的键天生唯一，「加一条」和「改一条」是同一个动作 —— 这正是它适合做统计的原因。" },
        { id: "q5", type: "multi", score: 14,
          stem: "关于 std::map 的说法，哪些对？（多选，漏选给一半，错勾任何一项整题 0 分）",
          options: ["键不能重复，一个键只有一条记录", "遍历时按键从小到大出现", "按键取值比扫一遍全表便宜", "想让记录按分数从高到低排，map 会直接帮你排好"],
          answers: [0, 1, 2],
          why: "map 只认键：按值排队它不管，得把记录搬进 vector 再 sort。" },
        { id: "q6", type: "code", score: 16, coversTask: 2,
          stem: "（任务题）写一行，单独把 小红 的分数打印出来 —— 这一行要验证的就是「方括号写法放进表达式里就是查询」。",
          acceptRegex: ["scores\\s*\\[\\s*\"小红\"\\s*\\]"],
          why: "同一个方括号写法，写在等号左边是登记，写在 println 的花括号里就是查账。" },
        { id: "q7", type: "blank", score: 8,
          stem: "map 遍历时那个自动顺序，是按____排出来的（填一个词，指方括号里那个名字）。",
          accept: ["键", "关键字", "key", "Key"],
          why: "内部那棵比大小生长的树用的是键，值只是挂在键上的东西。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: "std::map<std::string, int> scores;\nscores[\"小红\"] = 95;", q3: "小强 72\n小明 88\n小红 95", q4: 2, q5: [0, 1, 2], q6: "std::println(\"{}\", scores[\"小红\"]);", q7: "键" }
        ],
        wrongs: [
          { q1: 0, q2: "std::vector<std::string> scores;\nscores.push_back(95);", q3: "小明 88\n小强 72\n小红 95", q4: 0, q5: [0, 3], q6: "std::println(\"{}\", scores.size());", q7: "值" },
          { q1: 1, q2: "std::map<std::string, int> scores;\nscores[\"小红\"] = 95;", q3: "88 72 95", q4: 3, q5: [1, 2, 3], q6: "std::println(\"{}\", scores[\"小明\"]);", q7: "插入先后" }
        ],
        loose: [
          { q1: "1", q2: "std::map < std::string , int >  scores ;\n  scores [ \"小红\" ] = 95 ;", q3: "小强  72 \n 小明 88\n小红   95", q4: "2", q5: [0, 1, 2], q6: "println(\"{:<6}\",scores[\"小红\"] );", q7: "key" }
        ]
      }
    },
    {
      cid: "m98", kind: "paper", pass: 60,
      title: "第 98 课考试 · map 的陷阱",
      task: "任务题目：说清把方括号换成 at 之后程序会怎么样；再写出用 erase 删掉误创建那条记录并打印 size 的两句。",
      hint: "回看【怎么做】、【演示 2 · 收拾已经被写脏的词典】与【演示 3 · 拿 [] 当判断条件，是最隐蔽的一种踩雷】。",
      questions: [
        { id: "q1", type: "choice", score: 14,
          stem: "词典里没有「新同学」这个键，此时写 scores[\"新同学\"]，会发生什么？",
          options: ["返回一个表示「没有」的空值，词典不变", "当场新建这个键，值是默认的 0，size 加 1", "编译报错，不许读不存在的键", "返回 0 但把已有的一条删掉"],
          answer: 1,
          why: "方括号那一步是「保证有这一条，然后把值交给你」，读也照样会新建 —— 这颗雷就埋在这里。" },
        { id: "q2", type: "code", score: 20, coversTask: 1,
          stem: "（任务题）写出「安全地读」那两句：先问 小明 在不在词典里，确认在，再把它的分数打印出来。",
          acceptRegex: ["contains\\s*\\(", "at\\s*\\("],
          why: "问用 contains、读用 at，两个动作拆开，谁都不会新增记录。" },
        { id: "q3", type: "choice", score: 14, coversTask: 1,
          stem: "（任务题）把原来那句 scores[\"新同学\"] 改成 scores.at(\"新同学\")，程序的表现是哪一种？",
          options: ["安静地少打印一行，继续跑", "当场报错并终止程序，不会新增记录", "和方括号完全一样，返回 0", "变成新增一条 新同学 0"],
          answer: 1,
          why: "at 的脾气是「查不到就明说」：宁可当场炸，也不替你造一条你没打算要的记录。" },
        { id: "q4", type: "code", score: 16, coversTask: 2,
          stem: "（任务题）写出收拾现场的两句：把误创建的「新同学」那条删掉，然后打印词典还剩几条。",
          acceptRegex: ["erase\\s*\\(\\s*\"新同学\"\\s*\\)", "scores\\s*\\.\\s*size\\s*\\("],
          why: "erase 给键删整条，size 给条数；键不存在时 erase 也不报错。" },
        { id: "q5", type: "output", score: 14,
          stem: "「怎么做」那段里三句打印依次输出什么？一行一个数。\nstd::println(\"size = {}\", scores.size());\nstd::println(\"新同学 = {}\", scores[\"新同学\"]);\nstd::println(\"size = {}\", scores.size());",
          acceptLines: ["size = 1", "新同学 = 0", "size = 2"],
          why: "中间那个 0 不是「查无此人」的回答，是新记录的默认值；最后一条 size 已经变 2。" },
        { id: "q6", type: "multi", score: 14,
          stem: "下面哪些写法不会让词典的 size 变大？（多选，漏选给一半，错勾任何一项整题 0 分）",
          options: ["scores.contains(\"转学生\")", "scores.at(\"小明\")，且小明确实在词典里", "scores.at(\"转学生\")，转学生不在词典里", "scores[\"转学生\"]，转学生不在词典里"],
          answers: [0, 1, 2],
          why: "at 查不到会报错终止，但它绝不新增；只有方括号会凭空造一条。" },
        { id: "q7", type: "blank", score: 8,
          stem: "本课那条纪律：写用方括号，读用 ____，问用 contains。（填一个成员函数名）",
          accept: ["at", "at函数", "scores.at", ".at"],
          why: "三个动作分给三个函数，词典就不会长出你没打算要的那一行。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: "if (scores.contains(\"小明\"))\n    std::println(\"{}\", scores.at(\"小明\"));", q3: 1, q4: "scores.erase(\"新同学\");\nstd::println(\"{}\", scores.size());", q5: "size = 1\n新同学 = 0\nsize = 2", q6: [0, 1, 2], q7: "at" }
        ],
        wrongs: [
          { q1: 0, q2: "std::println(\"{}\", scores[\"小明\"]);", q3: 0, q4: "scores.pop_back();", q5: "size = 1\n新同学 = 0\nsize = 1", q6: [3], q7: "find" },
          { q1: 2, q2: "if (scores.size() > 0) std::println(\"{}\", scores[\"小明\"]);", q3: 2, q4: "scores.clear();", q5: "size = 0\n新同学 = 2\nsize = 1", q6: [0, 3], q7: "contains" }
        ],
        loose: [
          { q1: "1", q2: "if ( scores.contains ( \"小明\" ) ) { std::println( \"小明的分数: {}\" , scores . at ( \"小明\" ) ) ; }", q3: "1", q4: "  scores.erase (\"新同学\")\n  std::println(\"一共 {} 条\", scores.size() );", q5: "size = 1 \n 新同学 =  0\nsize =2", q6: [0, 1, 2], q7: "AT" }
        ]
      }
    },
    {
      cid: "m99", kind: "paper", pass: 60,
      title: "第 99 课考试 · map 词频统计",
      task: "任务题目：说清这一课比第 87 课那版省掉了哪几块代码；再用 map 把「统计一句话里每个字符出现几次」写出来。",
      hint: "回看【少掉了哪几块代码】那张对照、【怎么做】与【演示 2 · 换成数字符】。",
      questions: [
        { id: "q1", type: "choice", score: 16,
          stem: "freq[w]++ 这一行凭什么就能完成登记加累加两件事？",
          options: ["因为 map 会自动按次数排序", "因为方括号保证键存在：没见过就建一条填 0，再加一正好是 1", "因为自增号会跳过重复的词", "因为 map 的 size 一直是 1"],
          answer: 1,
          why: "上一课那颗雷在这儿变成了工具 —— 默认值 0 加一，等于「第一次见到就记 1」。" },
        { id: "q2", type: "code", score: 20, coversTask: 2,
          stem: "（任务题）写出按字符统计的那两句：一本「字符对应次数」的词典，变量名 chars；然后遍历 std::string s，把每个字符记一笔。",
          acceptRegex: ["map\\s*<\\s*char\\s*,\\s*int\\s*>", "\\]\\s*\\+\\+"],
          why: "键换成 char，逻辑一个字都没改；累加还是那句方括号加自增。" },
        { id: "q3", type: "output", score: 14,
          stem: "词表是 python java python c++ python java，统计完按字典序逐行打印「词 次数 次」，输出是什么？",
          acceptLines: ["c++ 1 次", "java 2 次", "python 3 次"],
          why: "顺序由键定：c、j、p。次数最高的 python 反而排在最后 —— map 不按值排。" },
        { id: "q4", type: "multi", score: 16, coversTask: 1,
          stem: "（任务题）跟第 87 课那版 vector 加 struct 的写法比，这一课真的省掉了哪些东西？（多选，漏选给一半，错勾任何一项整题 0 分）",
          options: ["装「哪个词、几次」的那个 struct 类型定义", "find_word 那种从表头扫到尾的查找函数", "「没找到就登记一行、找到就加一笔」那段 if 分叉", "把结果逐行打印出来的那一步"],
          answers: [0, 1, 2],
          why: "打印没被省掉，只是遍历的对象从登记表变成了词典；被省的是「自己找那一行」这件事。" },
        { id: "q5", type: "choice", score: 12,
          stem: "下面哪种场合不该拿方括号去读值？",
          options: ["统计每个词出现几次", "只想查某个人在不在名单里，又不想让名单变长", "给新来的键记第一笔数", "把某个计数加一"],
          answer: 1,
          why: "查有没有、不想改动词典时，用 contains 加 at；方括号那一步一定会「保证有这一条」。" },
        { id: "q6", type: "blank", score: 8, coversTask: 1,
          stem: "把三块代码整块删掉，靠的是方括号在键不存在时会____一条值为 0 的新记录。（填一个词，表示「凭空生出」）",
          accept: ["创建", "新建", "造出", "生成", "自动创建", "添加"],
          why: "第 87 课那句 if 分叉做的事，被方括号的默认行为吃掉了。" },
        { id: "q7", type: "code", score: 14, coversTask: 2,
          stem: "（任务题）写出遍历打印的那两行：从词典里一次取出「字」和「次数」两个值，打印成 [字] 次数 这种样子。",
          acceptRegex: ["for\\s*\\(", "\\[\\s*\\w+\\s*,\\s*\\w+\\s*\\]", "println"],
          why: "方括号里两个名字是把一条记录拆成键和值两半，遍历词典几乎都这么写。" }
      ],
      selftest: {
        refs: [
          { q1: 1, q2: "std::map<char, int> chars;\nfor (char c : s) chars[c]++;", q3: "c++ 1 次\njava 2 次\npython 3 次", q4: [0, 1, 2], q5: 1, q6: "创建", q7: "for (const auto& [ch, n] : chars)\n    std::println(\"[{}] {}\", ch, n);" }
        ],
        wrongs: [
          { q1: 0, q2: "std::vector<int> chars;", q3: "python 3 次\njava 2 次\nc++ 1 次", q4: [0, 3], q5: 0, q6: "排序", q7: "for (int i = 0; i < chars.size(); ++i) std::println(\"{}\", i);" },
          { q1: 1, q2: "std::map<char, int> chars;\nfor (char c : s) chars.at(c);", q3: "c++ 1 次\njava 2 次\npython 3 次", q4: [1, 2], q5: 2, q6: "复制", q7: "std::println(\"{}\", chars.size());" }
        ],
        loose: [
          { q1: "1", q2: "std :: map < char ,int > chars ;\nfor ( char c : s ) { chars [ c ] ++ ; }", q3: "c++   1 次\n java 2 次\npython 3 次 ", q4: [0, 1, 2], q5: "1", q6: "新建", q7: "for( auto&& [ a , b ] : chars ) println( \"[{}] {}\", a, b );" }
        ]
      }
    },
    {
      cid: "m100", kind: "paper", pass: 60,
      title: "第 100 课考试 · set 去重",
      task: "任务题目：用两个 set 找出两列数字里都出现的数；再说清怎么让 set 从大到小排、那行声明怎么写。",
      hint: "回看【演示 2 · 找出两列数里都出现的数】与【演示 3 · 想让它从大到小排】。",
      questions: [
        { id: "q1", type: "choice", score: 14,
          stem: "set 和 map 的关系，最贴切的是哪一句？",
          options: ["set 就是把值扔掉、只留键的 map：元素唯一、自动有序、方法名基本重合", "set 是排好序的 vector，随时可以按下标取数", "set 只能装整数，装字符串就得换 map", "两个一模一样，用哪个全凭心情"],
          answer: 0,
          why: "同一棵树的两个壳：值那一半没了，于是唯一、有序、log n 查找、contains 与 erase 全都原样搬过来。" },
        { id: "q2", type: "choice", score: 12,
          stem: "盒子里已经有 3，此时再写一次 insert(3)，结果是？",
          options: ["当场报错终止程序", "拒收，size 不变，返回值里汇报 false", "收下，排在原来那个 3 的旁边", "把原来的 3 删掉，新的 3 放最后"],
          answer: 1,
          why: "不崩也不吵，只是不收 —— 唯一的情报藏在 insert 的返回值里，不接住就等于放弃。" },
        { id: "q3", type: "code", score: 20, coversTask: 1,
          stem: "（任务题）写出找「都出现」的那几句：a 与 b 都是 std::set<int>，遍历 a，逐个问 b 收过这个数没有，收过就打印。（一行循环加一行判断就行。）",
          acceptRegex: ["for\\s*\\(", "contains\\s*\\("],
          why: "去重已经替你把重复消掉了，判断在不在靠 contains 那次树上查找，不用扫全表。" },
        { id: "q4", type: "output", score: 14, coversTask: 1,
          stem: "a 是 {5, 3, 8, 3, 5, 1}，b 是 {8, 9, 3, 12, 3}，按上一题那种写法逐个打印公有的数（数字间一个空格），输出是什么？",
          acceptLines: ["3 8"],
          why: "a 里的重复 3、5 在构造时就没了，所以 3 只报一次；两边都有的只有 3 和 8，按从小到大出现。" },
        { id: "q5", type: "code", score: 18, coversTask: 2,
          stem: "（任务题）写出那一行声明：一个装着整数、会从大到小排的集合，变量名随你，初始值随手给几个。",
          acceptRegex: ["set\\s*<\\s*int\\s*,\\s*(?:std::)?greater\\s*<\\s*int\\s*>\\s*>"],
          why: "关键在尖括号的第二个参数：那棵树靠比较规则长，换成 greater 就是大的在前。" },
        { id: "q6", type: "blank", score: 8,
          stem: "map 的方括号在键不存在时会顺手建一条；set 因为没有值可填，所以往里加只能用 ____。（填一个成员函数名）",
          accept: ["insert", "插入", "s.insert"],
          why: "set 没有方括号那扇门，insert 是唯一入口，好处是它还会回头告诉你收没收。" },
        { id: "q7", type: "multi", score: 14,
          stem: "关于 std::set 的说法，哪些对？（多选，漏选给一半，错勾任何一项整题 0 分）",
          options: ["元素天生唯一，重复的进不来", "遍历出来自动有序，不用自己排序", "想按放进去的先后顺序走一遍，它替你把顺序留着", "问某个数在不在，用 contains，不用扫全表"],
          answers: [0, 1, 3],
          why: "顺序由大小决定，插入先后它不记 —— 要保序就回 vector，这是选容器时最想清楚的一件事。" }
      ],
      selftest: {
        refs: [
          { q1: 0, q2: 1, q3: "for (int v : a) { if (b.contains(v)) std::print(\"{} \", v); }", q4: "3 8", q5: "std::set<int, std::greater<int>> desc = {5, 3, 8};", q6: "insert", q7: [0, 1, 3] }
        ],
        wrongs: [
          { q1: 1, q2: 0, q3: "for (int v : a) { if (v == b) std::print(\"{} \", v); }", q4: "5 3 8 3 5 1", q5: "std::set<int> s = {5, 3, 8};", q6: "find", q7: [0, 2] },
          { q1: 0, q2: 2, q3: "for (int v : a) if (b.contains(v)) std::print(\"{} \", v);", q4: "8 3", q5: "std::set<int> big = {8, 5, 3};", q6: "push_back", q7: [0, 1, 3] }
        ],
        loose: [
          { q1: "0", q2: "1", q3: "for ( const auto v : a )\n    if ( b . contains ( v ) )  std::print( \"{} \", v ) ;", q4: " 3  8 ", q5: "std :: set < int , greater< int > >  s = {5,3,8,1} ;", q6: "INSERT", q7: [0, 1, 3] }
        ]
      }
    }
  ]
};
