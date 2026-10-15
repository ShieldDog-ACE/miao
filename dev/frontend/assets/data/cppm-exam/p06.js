/* 喵站 · C++ 掌握 考卷分部 p06：第 97–100 课
 * 契约同前几场：权重和 100、源稿每条任务都有题 coversTask 对着、refs 判 100 / wrongs <60 / loose 过。
 */
window.MIAO_CPPM_EXAM_P06 = {
  papers: [
    {
      cid: "m97", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 97 课考试 · map 入门", task: "任务题目：往这本词典里多登记几条记录，说清打印出来的顺序为什么是那个样子；再把「单独查小红的分数」写成一行。", hint: "回看本课【怎么做】那段、【演示 1 · 同一个键再写一次，是覆盖不是新增】与【演示 3 · 顺序由键说了算】。",
      notes: ["登记表是平铺的，只能一格一格看；map 里那棵树按键比大小，一步就走到，省的是每来一个词就从表头扫到表尾找行号那一步。", "遍历时按键从小到大出现，值不参与排序：依次写入小明、小强、小红，打出来是小强、小明、小红。", "想让记录按分数从高到低排，map 不会直接帮你排：它只认键，按值排队得把记录搬进 vector 再 sort。", "遍历的时候顺手挑个最值是合法的：一边拆键值一边比较，比完再打 —— 但别在遍历里增删记录。", "键换成整数、值换成文字照样成立：rank[3] 铜牌、rank[1] 金牌，打出来是第 1、第 2、第 3 名 —— 顺序由键说了算。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "开一张词典：std::map 的尖括号里写明键是 std::string、值是 int。", acceptRegex: ["std::map\\s*<\\s*std::string\\s*,\\s*int\\s*>\\s+\\w+"], acceptOn: "code", sample: "std::map<std::string, int> scores;", why: "键 → 值这么存：树按键比大小生长，值只是挂在键上的东西。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条那几条记录：用方括号写进至少两条，等号左边是键、右边是值。", acceptRegex: ["\\w+\\s*\\[\\s*\"[^\"]+\"\\s*\\]\\s*=\\s*\\d+\\s*;[\\s\\S]*\\w+\\s*\\[\\s*\"[^\"]+\"\\s*\\]\\s*=\\s*\\d+\\s*;"], acceptOn: "code", sample: "scores[\"小明\"] = 88;\nscores[\"小强\"] = 72;\nscores[\"小红\"] = 95;", why: "写入这件事就这么一句话；键已经有了就是改值，不新增。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "遍历这张词典：用 for (const auto& [名字, 分数] : 词典) 把键和值拆出来，再用一条 std::println 把这一组打出来：格式串里两个坑（写不写对齐都行），逗号后面按顺序给键和值。", acceptRegex: ["for\\s*\\(\\s*const\\s+auto\\s*&?\\s*\\[\\s*\\w+\\s*,\\s*\\w+\\s*\\]\\s*:\\s*\\w+\\s*\\)", "std::println\\s*\\(\\s*\"[^\"]*\\{[^}\"]*\\}[^\"]*\\{[^}\"]*\\}[^\"]*\"\\s*,\\s*\\w+\\s*,\\s*\\w+"], acceptOn: "code", sample: "for (const auto& [name, score] : scores) {\n    std::println(\"{:<6} {}\", name, score);\n}", why: "打出来的顺序是键的顺序，不是你写入的顺序 —— 这一眼就是任务要你确认的东西。" },
        { id: "q4", type: "code", score: 20, coversTask: 2, stem: "任务第 2 条：单独打一条小红的分数 —— 同一个方括号写法放进逗号后面，这次是查询。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\[\\s*\"小红\"\\s*\\]"], acceptOn: "code", sample: "std::println(\"小红 = {}\", scores[\"小红\"]);", why: "写在等号左边是登记，写在 println 的坑里就是查账：同一个写法两份工。" },
        { id: "q5", type: "code", score: 15, coversTask: 1, stem: "再看覆盖这件事：同一个键再写一次别的值，然后用一条 std::println 打出这张词典的条数。", acceptRegex: ["\\w+\\s*\\[\\s*(\"[^\"]+\")\\s*\\]\\s*=\\s*\\d+\\s*;[\\s\\S]{0,600}\\w+\\s*\\[\\s*\\1\\s*\\]\\s*=\\s*\\d+\\s*;", "std::println\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*\\w+\\.size\\s*\\(\\s*\\)"], acceptOn: "code", sample: "scores[\"小明\"] = 90;\nstd::println(\"一共 {} 条记录\", scores.size());", why: "map 的键天生唯一，「加一条」和「改一条」是同一个动作：条数不变，这正是它适合做统计的原因。" },
        { id: "q6", type: "code", score: 15, stem: "把这份程序写成能跑的形：请进 map 的头和 string 的头，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*map\\s*>", "#\\s*include\\s*<\\s*string\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <map>\n#include <string>\n\nint main() {", why: "std::map 住在 map 这个头里；键是文字就还得请进 std::string。" }
      ],
      selftest: {
        refs: [
          "#include <map>\n#include <print>\n#include <string>\n\nint main() {\n    std::map<std::string, int> scores;\n    scores[\"小明\"] = 88;                     // 写入：键 → 值\n    scores[\"小强\"] = 72;\n    scores[\"小红\"] = 95;\n    for (const auto& [name, score] : scores) {\n        std::println(\"{:<6} {}\", name, score);\n    }\n    scores[\"小明\"] = 90;                      // 键已经有了：改值，不新增\n    std::println(\"一共 {} 条记录\", scores.size());\n    std::println(\"小红 = {}\", scores[\"小红\"]);      // 同一个写法，这次是查询\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <string>\n#include <vector>\n\nint main() {\n    std::vector<std::string> names = {\"小明\", \"小强\", \"小红\"};\n    std::vector<int> vals = {88, 72, 95};\n    for (size_t i = 0; i < names.size(); ++i) std::println(\"{} {}\", names[i], vals[i]);\n    return 0;\n}\n",
          "#include <map>\n#include <print>\n#include <string>\n\nint main() {\n    std::map<std::string, int> scores;\n    scores[\"小明\"] = 88;\n    scores[\"小红\"] = 95;\n    std::println(\"{}\", scores[\"小明\"]);\n    return 0;\n}\n",
          "#include <map>\n#include <string>\n\nint main() {\n    std::map<std::string, int> scores;\n    scores[\"小明\"] = 88;\n    return 0;\n}\n"],
        loose: [
          "# include < map >\n# include < print >\n# include < string >\n\nint  main ( )\n{\n    std::map < std::string , int >  book ;\n    book [ \"小强\" ] = 72 ;\n    book [ \"小明\" ] = 88 ;\n    book [ \"小红\" ] = 95 ;\n    for (const auto& [who, pts] : book)\n        std::println(\"{:<6} {}\", who, pts);\n    book [ \"小明\" ] = 90;\n    std::println(\"条数 {}\", book.size());\n    std::println( \"小红 {}\" , book[ \"小红\" ] ) ;\n    return 0;\n}\n"]
      }
    },
    {
      cid: "m98", kind: "paper", mode: "ide", authored: "f580142a", file: "main.cpp", pass: 60, title: "第 98 课考试 · map 的陷阱", task: "任务题目：说清把方括号换成 at 之后程序会怎么样；再写出用 erase 删掉误创建那条记录并打印 size 的两句。", hint: "回看【怎么做】、【演示 2 · 收拾已经被写脏的词典】与【演示 3 · 拿 [] 当判断条件，是最隐蔽的一种踩雷】。",
      notes: ["词典里没有新同学这个键，此时写 scores[\"新同学\"]：当场新建这个键，值是默认的 0，size 加 1 —— 读也照样会新建。", "at 只给值，查不到就报错终止，但它绝不新增；想让程序在查不到时继续跑，就先用 contains 问一句再 at。", "拿方括号当判断条件是最隐蔽的一种踩雷：if (scores[\"转学生\"] == 0) 这一句先把词典弄脏了，size 多出一条。", "erase 不存在的名字也安全，不报错，返回 0 条被删；它删不掉你打算留着的那几条。", "三个动作分给三个函数：写用方括号，读用 at，问用 contains；size 是那条怀疑自己踩雷时的检查口。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "备好那张词典：std::map 尖括号里写明键是 std::string、值是 int，再用方括号写进一条记录。", acceptRegex: ["std::map\\s*<\\s*std::string\\s*,\\s*int\\s*>\\s+\\w+", "\\w+\\s*\\[\\s*\"[^\"]+\"\\s*\\]\\s*=\\s*\\d+\\s*;"], acceptOn: "code", sample: "std::map<std::string, int> scores;\nscores[\"小明\"] = 88;", why: "写用方括号是这一课的默认动作：等号左边那个方括号保证有这一条，然后把值交给你。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条那一改：读新同学的时候别再写方括号，改成点 at 再递这个名字。", acceptRegex: ["\\w+\\.at\\s*\\(\\s*\"新同学\"\\s*\\)"], acceptOn: "code", sample: "std::println(\"新同学 = {}\", scores.at(\"新同学\"));", why: "at 的脾气是查不到就明说：宁可当场报错终止，也绝不替你造一条没打算要的记录。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "把安全读法写一遍：if 的条件里用 contains 问一句有没有，确认了再去取值。", acceptRegex: ["if\\s*\\(\\s*!?\\s*\\w+\\.contains\\s*\\("], acceptOn: "code", sample: "if (scores.contains(\"小明\"))\n    std::println(\"小明的分数: {}\", scores.at(\"小明\"));", why: "问用 contains：它只回答有没有，真假，什么都改不了；三个动作分给三个函数，词典就不会长出你没打算要的那一行。" },
        { id: "q4", type: "code", score: 20, coversTask: 2, stem: "任务第 2 条：先用方括号读一次新同学（这一步会凭空造一条），再用 erase 把这个名字删掉。", acceptRegex: ["\\w+\\s*\\[\\s*\"新同学\"\\s*\\]", "\\w+\\.erase\\s*\\(\\s*\"新同学\"\\s*\\)"], acceptOn: "code", sample: "std::println(\"新同学 = {}\", scores[\"新同学\"]);   // 坑！凭空造出来，返回 0\nscores.erase(\"新同学\");                       // 删掉误创建的那一条", why: "中间那个 0 不是查无此人的回答，是新记录的默认值；erase 删的就是这一条，名字不存在也不报错。" },
        { id: "q5", type: "code", score: 15, coversTask: 2, stem: "用一条 std::println 把条数打出来，看看被写脏之后有没有擦干净：逗号后面给那个 size 调用。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{[^}\"]*\\}[^\"]*\"\\s*,\\s*\\w+\\.size\\s*\\(\\s*\\)"], acceptOn: "code", sample: "std::println(\"删完 size = {}\", scores.size());", why: "怀疑被写脏时先看 size：方括号那一下它就从 1 变 2，erase 之后才回得去。" },
        { id: "q6", type: "code", score: 15, stem: "把这份程序写成能跑的形：请进 map 的头和 string 的头，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*map\\s*>", "#\\s*include\\s*<\\s*string\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <map>\n#include <string>\n\nint main() {", why: "std::map 住在 map 这个头里；键是文字就还得请进 std::string。" }
      ],
      selftest: {
        refs: [
          "#include <map>\n#include <print>\n#include <string>\n\nint main() {\n    std::map<std::string, int> scores;\n    scores[\"小明\"] = 88;\n    std::println(\"size = {}\", scores.size());\n    if (scores.contains(\"小明\"))                        // 先问有没有\n        std::println(\"小明的分数: {}\", scores.at(\"小明\"));   // 确认了再取\n    std::println(\"新同学 = {}\", scores[\"新同学\"]);      // 方括号：凭空造出来，返回 0\n    std::println(\"脏了以后 size = {}\", scores.size());\n    std::println(\"换成 at 读一次新同学: {}\", scores.at(\"新同学\"));   // 这一句换成 at 就不会新增\n    scores.erase(\"新同学\");                            // 任务 2：删掉误创建的那一条\n    std::println(\"删完 size = {}\", scores.size());\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <map>\n#include <print>\n#include <string>\n\nint main() {\n    std::map<std::string, int> scores;\n    scores[\"小明\"] = 88;\n    std::println(\"新同学 = {}\", scores[\"新同学\"]);\n    std::println(\"size = {}\", scores.size());\n    return 0;\n}\n",
          "#include <map>\n#include <string>\n\nint main() {\n    std::map<std::string, int> scores;\n    scores[\"小明\"] = 88;\n    std::println(\"{}\", scores.at(\"小明\"));\n    return 0;\n}\n",
          "#include <map>\n#include <print>\n#include <string>\n\nint main() {\n    std::map<std::string, int> scores;\n    return 0;\n}\n"],
        loose: [
          "# include < string >\n# include < map >\n# include < print >\n\nint  main ( )\n{\n    std::map< std::string , int >  book ;\n    book[\"小明\"] = 88;\n    if ( ! book.contains(\"老同学\") ) std::println(\"老同学不存在，也没被创建\");\n    book [ \"新同学\" ] = 0 ;\n    std::println( \"新同学 {}\" , book.at ( \"新同学\" ) ) ;\n    book.erase( \"新同学\" ) ;\n    std::println(\"size 现在 {}\", book.size());\n    return 0;\n}\n"]
      }
    },
    {
      cid: "m99", kind: "paper", mode: "ide", authored: "15a5c5d0", file: "main.cpp", pass: 60, title: "第 99 课考试 · map 词频统计", task: "任务题目：说清这一课比第 87 课那版省掉了哪几块代码；再用 map 把「统计一句话里每个字符出现几次」写出来。", hint: "回看【少掉了哪几块代码】那张对照、【怎么做】与【演示 2 · 换成数字符】。",
      notes: ["freq[w]++ 一句顶三块：方括号在键不存在时建一条值为 0 的新记录，自增再把那一格加一。", "词表是 python java python c++ python java 时，按字典序打出来是 c++ 1 次、java 2 次、python 3 次：次数最高的反而排在最后，map 不按值排。", "顺手找最热的那个词：遍历词典时一边比 count 一边记下 best 和那个词，比的是值、留的是键。", "查某个人在不在名单里又不想让名单变长，就别拿方括号读：那种场合用 contains 加 at。", "键还可以是词的长度：by_len[w.size()]++ 先按长度归堆，打出来是几个字母的词各有几个。"],
      questions: [
        { id: "q1", type: "code", score: 15, coversTask: 1, stem: "备好料：一串词的 std::vector<std::string>，再加一张键是 std::string、值是 int 的计数词典。", acceptRegex: ["std::map\\s*<\\s*std::string\\s*,\\s*int\\s*>\\s+\\w+", "std::vector\\s*<\\s*std::string\\s*>\\s+\\w+\\s*=\\s*\\{"], acceptOn: "code", sample: "std::vector<std::string> words = {\"python\", \"java\", \"python\"};\nstd::map<std::string, int> freq;", why: "键就是词、值就是次数：装哪个词几次的那个 struct 定义这一课压根不写。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "写出核心那一行：range-for 里按 const auto& 取词，对词典里那个键做自增（方括号后面跟两个加号）。", acceptRegex: ["for\\s*\\(\\s*const\\s+auto\\s*&?\\s*\\w+\\s*:", "\\w+\\s*\\[\\s*\\w+\\s*\\]\\s*\\+\\+"], acceptOn: "code", sample: "for (const auto& w : words) freq[w]++;", why: "方括号保证键存在：没见过就建一条填 0，再加一正好是 1 —— 登记和加一被这一行一起办了。" },
        { id: "q3", type: "code", score: 15, coversTask: 1, stem: "把词典打印一遍：用 for (const auto& [词, 次数] : 词典) 拆出键和值，再用一条 std::println 把这一组打出来（格式串两个坑）。", acceptRegex: ["for\\s*\\(\\s*const\\s+auto\\s*&?\\s*\\[\\s*\\w+\\s*,\\s*\\w+\\s*\\]\\s*:\\s*\\w+\\s*\\)", "std::println\\s*\\(\\s*\"[^\"]*\\{[^}\"]*\\}[^\"]*\\{[^}\"]*\\}[^\"]*\""], acceptOn: "code", sample: "for (const auto& [word, count] : freq)\n    std::println(\"{:<8} {} 次\", word, count);", why: "最后的遍历打印照旧省不掉，只是遍历的对象从登记表变成了词典；顺序由键说了算。" },
        { id: "q4", type: "code", score: 15, coversTask: 1, stem: "任务第 1 条：在文件里留一行注释，写下这一版比 vector 加 struct 那一版少了哪几块代码。", acceptRegex: ["//[^\\n]*(struct|查找|扫|找|if|分叉|少|省)"], acceptOn: "buffer", sample: "// 省掉了：装词和次数的 struct 定义、从头扫到尾的 find_word、没找到就登记一行否则加一笔那段 if 分叉", why: "这一条为什么这么出：省没省是要对照两份代码读的判断，正则只能验注释里点到了这几样，账对不对得人来读。" },
        { id: "q5", type: "code", score: 20, coversTask: 2, stem: "任务第 2 条：换成数字符 —— 开一张键是 char、值是 int 的词典，用 for (char 变量 : 那句话) 给每个字符来一次自增。", acceptRegex: ["std::map\\s*<\\s*char\\s*,\\s*int\\s*>\\s+\\w+", "for\\s*\\(\\s*char\\s+\\w+\\s*:", "\\w+\\s*\\[\\s*\\w+\\s*\\]\\s*\\+\\+"], acceptOn: "code", sample: "std::map<char, int> chars;\nstd::string s = \"hello world\";\nfor (char c : s) chars[c]++;", why: "键换成字符照样长树；空格也照样记一笔，它在字节序里排在字母前面。" },
        { id: "q6", type: "code", score: 15, coversTask: 2, stem: "把某个字符的次数单独打出来：一条 std::println，逗号后面用方括号查那个单引号括起来的字符。", acceptRegex: ["std::println\\s*\\(\\s*\"[^\"]*\\{[^}\"]*\\}[^\"]*\"\\s*,\\s*\\w+\\s*\\[\\s*'[^']'\\s*\\]"], acceptOn: "code", sample: "std::println(\"l = {}\", chars['l']);", why: "字符键要写单引号；这一查读的是词典里那一格的计数，hello world 里 l 是 3 次。" }
      ],
      selftest: {
        refs: [
          "#include <map>\n#include <print>\n#include <string>\n#include <vector>\n\nint main() {\n    std::vector<std::string> words = {\"python\", \"java\", \"python\", \"c++\", \"python\", \"java\"};\n    std::map<std::string, int> freq;\n    for (const auto& w : words) freq[w]++;            // 核心就这一行\n    for (const auto& [word, count] : freq)\n        std::println(\"{:<8} {} 次\", word, count);\n    // 比 vector 加 struct 那一版：少了 struct 定义、少了从头扫到尾的 find_word、少了那段 if 分叉，打印照旧\n\n    std::map<char, int> chars;\n    std::string s = \"hello world\";\n    for (char c : s) chars[c]++;                       // 空格也照样记一笔\n    std::println(\"l = {}\", chars['l']);\n    std::println(\"o = {}\", chars['o']);\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <map>\n#include <print>\n#include <string>\n#include <vector>\n\nint main() {\n    std::vector<std::string> words = {\"python\", \"java\", \"python\"};\n    std::map<std::string, int> freq;\n    for (const auto& w : words) freq[w]++;\n    for (const auto& [word, count] : freq) std::println(\"{:<8} {} 次\", word, count);\n    return 0;\n}\n",
          "#include <map>\n#include <print>\n#include <string>\n#include <vector>\n\nint main() {\n    std::vector<std::string> words = {\"python\", \"java\"};\n    std::map<std::string, int> freq;\n    for (const auto& w : words) {\n        if (freq.contains(w)) freq[w] = freq[w] + 1; else freq[w] = 1;\n    }\n    return 0;\n}\n",
          "#include <map>\n#include <print>\n#include <string>\n\nint main() {\n    std::map<char, int> chars;\n    std::string s = \"hello\";\n    for (char c : s) chars[c]++;\n    return 0;\n}\n"],
        loose: [
          "# include < map >\n# include < print >\n# include < string >\n# include < vector >\n\nint  main ( )\n{\n    std::vector < std::string >  list = { \"a\", \"bb\", \"a\" } ;\n    std::map < std::string , int >  cnt ;\n    for (const auto&  one : list)  cnt [ one ] ++ ;\n    for (const auto& [k, n] : cnt) std::println(\"{:<8} {} 回\", k, n);\n    // 比 vector 加 struct 那一版少了 struct、少了从头扫到尾的查找、少了 if 分叉\n\n    std::map< char , int >  letters ;\n    std::string  text = \"hello world\";\n    for (char  ch :  text)  letters [ ch ] ++ ;\n    std::println( \"次数 {}\" , letters [ 'l' ] ) ;\n    return 0;\n}\n"]
      }
    },
    {
      cid: "m100", kind: "paper", mode: "ide", file: "main.cpp", pass: 60, title: "第 100 课考试 · set 去重", task: "任务题目：用两个 set 找出两列数字里都出现的数；再说清怎么让 set 从大到小排、那行声明怎么写。", hint: "回看【演示 2 · 找出两列数里都出现的数】与【演示 3 · 想让它从大到小排】。",
      notes: ["set 的元素天生唯一，遍历出来自动有序，问某个值在不在用 contains，不用扫全表。", "insert 遇到已有的值不收，只在返回值里说 false；size 数的是不同的值，重复的早被挡在门外。", "set 没有方括号那扇门（它没有值可填），往里加东西只能靠 insert。", "顺序由大小决定，放进去的先后它不记 —— 要保序就回 vector，这是选容器时最想清楚的一件事。", "想改排序规则就换第二个尖括号参数：std::set<int, std::greater<int>> 就是从大到小，得 #include <functional>。"],
      questions: [
        { id: "q1", type: "code", score: 15, stem: "把这份程序写成能跑的形：把集合工具箱（#include <set>）搬进来，再开出 main 这个入口。", acceptRegex: ["#\\s*include\\s*<\\s*set\\s*>", "\\bint\\s+main\\s*\\("], acceptOn: "code", sample: "#include <set>\n\nint main() {", why: "缺 #include <set> 就没人认识 std::set；没有 main，链接器找不到入口。" },
        { id: "q2", type: "code", score: 20, coversTask: 1, stem: "任务第 1 条：建一只装整数的集合，把一列有重复的数字倒进去（花括号整列给，或用 begin 和 end 把 vector 整列灌进去都行），让它自动去重自动排序。", acceptRegex: ["(set\\s*<\\s*int\\s*>\\s+\\w+\\s*=\\s*\\{[^{}]*\\}|set\\s*<\\s*int\\s*>\\s+\\w+\\s*\\(\\s*\\w+\\.begin\\s*\\(\\s*\\)\\s*,\\s*\\w+\\.end\\s*\\(\\s*\\)\\s*\\))"], acceptOn: "code", sample: "std::set<int> a = {5, 3, 8, 3, 5, 1};", why: "重复值在进门那一刻就被挡掉：同一列数倒进 set，剩下的就是不同值，而且已经从小到大排好。" },
        { id: "q3", type: "code", score: 25, coversTask: 1, stem: "任务第 1 条：再建第二只集合并倒进另一列数，然后用一条 for 遍历其中一只，每拿出一个就用另一只的 contains 问一句，两边都有的才打印出来。", acceptRegex: ["for\\s*\\(\\s*(int|auto)\\s+\\w+\\s*:\\s*\\w+\\s*\\)", "\\w+\\.contains\\s*\\(\\s*\\w+\\s*\\)"], acceptOn: "code", sample: "std::set<int> b = {8, 9, 3, 12, 3};\nfor (int v : a)\n    if (b.contains(v)) std::print(\"{} \", v);", why: "contains 是 log n 的问话，不用扫全表；a 里重复的 3、5 早就没了，所以公有的数只报一次。" },
        { id: "q4", type: "code", score: 15, stem: "往那只集合里再塞一个已经存在的数，把 insert 的返回值接住，并用一条 println 打里面那个 second（它老实汇报这一次收没收）。", acceptRegex: ["\\w+\\s*=\\s*\\w+\\.insert\\s*\\(", "\\.second"], acceptOn: "code", sample: "auto r1 = a.insert(3);\nstd::println(\"再塞 3：收下 = {}\", r1.second);", why: "已有 3 时 insert 不崩也不吵，只是不收；唯一的情报藏在返回值的 second 里，不接住就等于放弃。" },
        { id: "q5", type: "code", score: 25, coversTask: 2, stem: "任务第 2 条：另写一只从大到小排的集合 —— 声明时给 set 补上第二个尖括号参数 std::greater<int>，并把装这条比较规则的工具箱 #include <functional> 也搬进来。", acceptRegex: ["set\\s*<\\s*int\\s*,\\s*(std::)?greater\\s*<\\s*int\\s*>\\s*>", "#\\s*include\\s*<\\s*functional\\s*>"], acceptOn: "code", sample: "#include <functional>\nstd::set<int, std::greater<int>> desc = {5, 3, 8, 3, 1};\nfor (int v : desc) std::print(\"{} \", v);", why: "那棵树靠比较规则长：第二个参数换成 std::greater<int>，遍历出来就是大的在前，不用你自己排序。" }
      ],
      selftest: {
        refs: [
          "#include <print>\n#include <set>\n#include <vector>\n#include <functional>\n\n#include <map>\nint main() {\n    std::vector<int> nums = {5, 3, 8, 3, 5, 1, 8, 9};\n    std::set<int> unique_nums(nums.begin(), nums.end());\n    std::set<int> a = {5, 3, 8, 3, 5, 1};\n    std::set<int> b = {8, 9, 3, 12, 3};\n    for (int v : a)\n        if (b.contains(v)) std::print(\"{} \", v);\n    std::println(\"\");\n    auto r1 = a.insert(3);\n    std::println(\"再塞 3：收下 = {}\", r1.second);\n    std::set<int, std::greater<int>> desc = {5, 3, 8, 3, 1};\n    for (int v : desc) std::print(\"{} \", v);\n    std::println(\"\");\n    return 0;\n}\n"],
        wrongs: [
          "",
          "#include <print>\n#include <set>\n\nint main() {\n    std::set<int> s = {5, 3, 8, 3};\n    s.insert(3);\n    std::println(\"{}\", s.size());\n    return 0;\n}\n",
          "std::vector<int> nums = {5, 3, 8, 3, 5, 1};\nfor (int v : nums) std::print(\"{} \", v);\n"],
        loose: [
          "#  include < print >\n#  include < set >\n#  include < functional >\n\nint  main ( )\n{\n  std :: set < int , greater < int > >  big = { 5 , 3 , 8 , 3 , 1 } ;\n  std::set<int> left = {8, 3, 9, 3, 12};\n  for (auto one : big)\n      if (left.contains(one)) std::print(\"{} \", one);\n  std::println(\"\");\n  auto answer = left.insert(3);\n  std::println(\"收下 {}\", answer.second);\n  std::set<int> seed = {1, 1, 2, 3, 3};\n  return 0;\n}\n"]
      }
    },
  ]
};
