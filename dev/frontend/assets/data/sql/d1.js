/* 喵站 · 数据库与 SQL 入门 · 第 1–12 课（d01–d12）
 * 每章的 SQL 都用 python3 自带的 sqlite3 在临时库里实跑过；输出按 SQLite 3.46 的口径写。
 */
window.MIAO_SQL_D1 = {
  chapters: [
    {
      id: `d01`,
      title: `第 1 课 · 数据为什么要进数据库：文件，表格，关系`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：看清把数据塞进文本文件会遇到的麻烦，能用表、行、列、主键、外键这套词把一份数据描述清楚。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `先看一个常见的开头：把每篇文章写成一行，字段用逗号隔开，存进 posts.csv。刚写完时它很好用，拿记事本就能看，发给人就能收。问题出在第二个人开始写的时候：两个人同时改同一个文件，后保存的会把前一个人的整段覆盖；程序写到一半断电，文件末尾留下半行；想改作者的城市，得把每一行里重复的作者信息逐个改一遍，漏一行就前后不一致。文件本身不知道哪一列是编号，也不知道编号不能重复，这些规矩只能由读写它的程序自己记得。` },
        { t: `p`, text: `表把这份数据分成格子。一张表有固定的列，每一列一个名字、一种类型、一个含义；每一行是一条完整记录。行的先后顺序不是数据的一部分，今天按写入顺序读出来，明天删几行再插几行，顺序就可能变。所以「第三行那篇文章」不是可靠的指法，得给每一行一个不会重复的编号，用编号指。列也一样，名字定下来就别随手改，否则所有读写它的代码都要跟着改。` },
        { t: `p`, text: `把作者从文章里拆出去，就得到两张表：authors 存编号、姓名、城市，posts 存文章编号、作者编号、标题。posts 里的作者编号指向 authors 里的编号，这种「一列的值等于另一张表的主键」的关系就是外键。主键的要求是唯一且不为空：一行一个编号，不能两行共用一个，也不能空着。拆开的好处很实在：阿岚改城市只改 authors 里的一行；写文章时只存一个整数，不用重复抄姓名。坏处是读的时候要把两张表按编号对起来，这个动作后面单独一课讲。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `p`, text: `如果数据按这套形状放好，问「阿岚写过哪些文章」就不再是 grep 整个文件，而是拿阿岚的编号去 posts 里找；改一次姓名，所有文章跟着变；重复的编号会被主键挡住。剩下的问题是：用什么话把这些请求说给数据库软件听。这套话就是 SQL；把它跑起来是后面单独一课的事。` },
        { t: `h2`, text: `演示：用文件记四行，再看它漏了什么` },
        { t: `code`, lang: `python`, code: `import csv
rows = [
    (1, 1, '索引为什么快'),
    (2, 2, '事务是什么'),
    (3, 1, '索引为什么快'),
    (3, 2, '重复的主键'),
]
with open('posts.csv', 'w', newline='') as f:
    csv.writer(f, lineterminator=chr(10)).writerows(rows)
print('写了', len(rows), '行')` },
        { t: `code`, lang: `shell`, code: `cut -d, -f1 posts.csv | sort | uniq -d
cut -d, -f3 posts.csv | sort | uniq -c` },
        { t: `p`, text: `第二段的两条命令都只看文件内容：编号 3 出现两次，文件照样收下；标题「索引为什么快」也重复，cut 与 uniq 只能事后发现，拦不住写入。换成人名拼错、作者编号指向不存在的作者，文件同样不会报错。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="12" y="10" width="616" height="260" rx="14" fill="#eef6f4"/><text x="320" y="38" font-size="18" font-weight="700" text-anchor="middle" fill="#173d36">文件照单全收，表用键认行</text><rect x="28" y="58" width="172" height="178" rx="8" fill="#ffffff" stroke="#8a9a96" stroke-width="2"/><text x="114" y="82" font-size="15" text-anchor="middle" fill="#173d36">posts.csv</text><text x="42" y="108" font-size="14" fill="#4d6f67">1,1,索引为什么快</text><text x="42" y="130" font-size="14" fill="#4d6f67">2,2,事务是什么</text><text x="42" y="152" font-size="14" fill="#a05a20">3,1,索引为什么快</text><text x="42" y="174" font-size="14" fill="#a05a20">3,2,重复的主键</text><text x="42" y="196" font-size="14" fill="#4d6f67">4,2,JOIN 入门</text><text x="42" y="218" font-size="14" fill="#a05a20">编号 3 出现两次，没人拦</text><rect x="240" y="58" width="150" height="132" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="315" y="82" font-size="15" text-anchor="middle" fill="#173d36">authors</text><text x="256" y="104" font-size="14" fill="#4d6f67">id</text><text x="300" y="104" font-size="14" fill="#4d6f67">姓名</text><text x="256" y="130" font-size="14" fill="#173d36">1</text><text x="300" y="130" font-size="14" fill="#173d36">阿岚</text><text x="256" y="154" font-size="14" fill="#173d36">2</text><text x="300" y="154" font-size="14" fill="#173d36">小北</text><text x="256" y="178" font-size="14" fill="#173d36">3</text><text x="300" y="178" font-size="14" fill="#173d36">老周</text><rect x="430" y="58" width="182" height="178" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="521" y="82" font-size="15" text-anchor="middle" fill="#173d36">posts</text><text x="441" y="104" font-size="14" fill="#4d6f67">id</text><text x="478" y="104" font-size="14" fill="#4d6f67">author_id</text><text x="560" y="104" font-size="14" fill="#4d6f67">title</text><text x="441" y="130" font-size="14" fill="#173d36">1</text><text x="482" y="130" font-size="14" fill="#173d36">1</text><text x="554" y="130" font-size="14" fill="#173d36">索引</text><text x="441" y="154" font-size="14" fill="#173d36">2</text><text x="482" y="154" font-size="14" fill="#173d36">1</text><text x="554" y="154" font-size="14" fill="#173d36">事务</text><text x="441" y="178" font-size="14" fill="#173d36">3</text><text x="482" y="178" font-size="14" fill="#173d36">2</text><text x="554" y="178" font-size="14" fill="#173d36">NULL</text><text x="441" y="202" font-size="14" fill="#173d36">4</text><text x="482" y="202" font-size="14" fill="#173d36">2</text><text x="554" y="202" font-size="14" fill="#173d36">JOIN</text><text x="441" y="226" font-size="14" fill="#173d36">8</text><text x="482" y="226" font-size="14" fill="#173d36">4</text><text x="554" y="226" font-size="14" fill="#173d36">上手</text><line x1="428" y1="126" x2="394" y2="126" stroke="#c8763a" stroke-width="3"/><polygon points="392,126 404,119 404,133" fill="#c8763a"/><text x="410" y="118" font-size="14" text-anchor="middle" fill="#a05a20">指向</text><text x="320" y="258" font-size="14" text-anchor="middle" fill="#173d36">主键唯一且非空；外键的值要能在主键里找到</text></svg>`, caption: `左边文件里编号 3 出现两次也没人拦；右边 posts 的 author_id 指向 authors 的主键，关系才落在结构上。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把 CSV 当数据库：它能存，但不拦重复编号、不检查外键，并发写还会互相覆盖。`,
          `以为行有固定序号：没有排序时顺序不保证，指一行要用主键。`,
          `主键用姓名或标题：重名、改名都会让指向断掉；用没有业务含义的整数最稳。`,
          `声明了外键就以为万事大吉：外键约束要显式声明并打开检查，不声明就只是两列碰巧同值。`,
          `以为建了主键就一定拒绝 NULL：SQLite 的普通主键列允许 NULL，INTEGER PRIMARY KEY 不会；要非空得自己加 NOT NULL。`,
          `把作者信息在每篇文章里复制一份：改一处漏一处，拆表后只留编号。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `找一个你手边用表格或 CSV 记的东西，列出它现在靠什么区分两行；如果还没有这种列，设计一个。`,
          `把「文章、作者、评论」画成三张表，写出每张表的列和主键，再标出哪一列指向哪张表。`,
          `用本课演示里的 posts.csv，手工改一行作者编号为 9，再跑那两条命令，说明文件为什么不会报错。`,
          `说出把作者姓名直接存进 posts 的两个具体麻烦，各举一个会出错的场景。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：文件只会照单全收，表用主键认行、用外键认关系，规矩才落在数据上。` }
      ]
    },
    {
      id: `d02`,
      title: `第 2 课 · 装一个 SQLite：一条命令就能开始`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用一条命令打开 SQLite，认清库就是一个文件；会 .tables、.schema、.quit，也会在没有 CLI 时用 Python 的 sqlite3 模块做同样的事。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `SQLite 不是要装服务、开端口、建账号的数据库软件，它是嵌进程序里的库。一个库就是一个文件，里面有表、索引、视图；程序打开文件直接读写。没有常驻进程。命令行工具 sqlite3 只是包在库外面的一层壳：打开文件，把 SQL 递进去，把结果打印出来。Python 的 sqlite3 模块用的是同一套库，读写的也是同一个文件。` },
        { t: `p`, text: `终端里敲 sqlite3 --version 打印版本号；敲 sqlite3 blog.db，文件不存在就新建空库，存在就打开。进去后敲的东西分两种：以点开头的命令归工具自己处理，比如 .tables 列表、.schema 看建表语句、.quit 退出；其余是 SQL，要以分号结尾。点命令不加分号，加了会报错。空库里 .tables 什么都不打印。` },
        { t: `p`, text: `Python 标准库自带 sqlite3：import 之后 connect 一个文件名就得到连接。连接是会话，execute 执行 SQL，commit 才写进文件；不 commit 就关，改动可能丢。建表插入后 close，再 connect 同一个文件，表和行还在，说明数据在文件里。connect 传 ':memory:' 则建一个内存库，进程退出就没了。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `p`, text: `库文件可以拷进 U 盘、随代码一起发走；备份就是复制文件，写入过程中复制可能拿到半个事务，后面单独一课讲。没有账号，谁能读文件由操作系统的权限决定；同一时刻只让一个写者进来，其他人排队或报 busy。` },
        { t: `h2`, text: `演示：先看 CLI，再用 Python 建表` },
        { t: `code`, lang: `shell`, code: `sqlite3 --version
sqlite3 blog.db
# 进入 sqlite3 后：
.tables
.quit` },
        { t: `code`, lang: `python`, code: `import sqlite3
con = sqlite3.connect('blog.db')
con.execute('DROP TABLE IF EXISTS notes')
con.execute('CREATE TABLE notes (id INTEGER PRIMARY KEY, body TEXT NOT NULL)')
con.execute('INSERT INTO notes (body) VALUES (?)', ('第一行',))
con.commit()
print(con.execute('SELECT * FROM notes').fetchall())
con.close()` },
        { t: `p`, text: `Python 那段在本机打印出 1 与 第一行 两个值：id 没写，SQLite 自己补了 1；body 用问号占位传参。关掉再开，SELECT 还是这一行。CLI 那段里 .tables 在空库上没有输出；Python 建完 notes 后再进 CLI，.tables 就会列出 notes。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260"><rect x="12" y="10" width="616" height="240" rx="14" fill="#eef6f4"/><text x="320" y="38" font-size="18" font-weight="700" text-anchor="middle" fill="#173d36">一个库就是一个文件，两个入口打开它</text><rect x="28" y="78" width="150" height="76" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="103" y="108" font-size="15" text-anchor="middle" fill="#173d36">sqlite3 CLI</text><text x="103" y="132" font-size="14" text-anchor="middle" fill="#4d6f67">点命令与 SQL</text><rect x="462" y="78" width="150" height="76" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="537" y="108" font-size="15" text-anchor="middle" fill="#173d36">Python sqlite3</text><text x="537" y="132" font-size="14" text-anchor="middle" fill="#4d6f67">同一套库</text><ellipse cx="320" cy="72" rx="80" ry="14" fill="#d8efe9" stroke="#2a8c78" stroke-width="2"/><rect x="240" y="72" width="160" height="96" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><ellipse cx="320" cy="168" rx="80" ry="14" fill="#d8efe9" stroke="#2a8c78" stroke-width="2"/><text x="320" y="112" font-size="16" text-anchor="middle" fill="#173d36">blog.db</text><text x="320" y="140" font-size="14" text-anchor="middle" fill="#4d6f67">表 索引 视图</text><line x1="180" y1="116" x2="236" y2="116" stroke="#2a8c78" stroke-width="2"/><polygon points="238,116 226,109 226,123" fill="#2a8c78"/><line x1="460" y1="116" x2="404" y2="116" stroke="#2a8c78" stroke-width="2"/><polygon points="402,116 414,109 414,123" fill="#2a8c78"/><text x="320" y="214" font-size="14" text-anchor="middle" fill="#173d36">没有服务器进程：谁打开文件，谁读写字</text><text x="320" y="238" font-size="14" text-anchor="middle" fill="#a05a20">写的时候要排队，读可以同时进</text></svg>`, caption: `CLI 和 Python 都不是服务器，只是两个入口；真正存数据的是中间那个 blog.db 文件。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把 sqlite3 当服务器：没有端口、没有账号，连不上「数据库服务」，只有文件路径。`,
          `点命令后加分号：.tables; 不是 SQL，工具会报错或把它当表名。`,
          `不 commit 就关连接：插入可能没落盘；用 with 连接或显式 commit。`,
          `以为一个文件只能一个程序用：多个读可以，写要排队；长期占着连接不关会留锁。`,
          `在 Python 字符串里拼 SQL：用问号占位，拼接会被引号注入。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `在本机确认 SQLite 的版本号（命令行工具或 Python 模块都行），把它记下来。`,
          `建一个空库，进去用 .tables 看空结果，手工建一张两列的表，再看 .tables 与 .schema，最后 .quit。`,
          `用 Python 建库、插入两行、commit、关闭，再重新打开读出两行；故意去掉 commit 重做一次，观察差别。`,
          `把库文件复制一份到另一个目录，用 Python 打开副本，确认数据还在，说明复制的是什么。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：SQLite 的库就是一个文件，CLI 和 Python 都是打开它的入口，没有服务器要伺候。` }
      ]
    },
    {
      id: `d03`,
      title: `第 3 课 · 一张表：行，列，类型`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会建一张表，说清 INTEGER、TEXT、REAL 与 NULL 在 SQLite 里怎么存；会插入整行和缺列的行，再用 SELECT 星号把表读出来。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `CREATE TABLE 一次把表名和列名定下来：每列写名字、类型，再按需加约束。SQLite 的列类型更像「偏好」而不是铁门：INTEGER 列会尽量把值存成整数，TEXT 存 UTF-8 字符串，REAL 存 8 字节浮点数；把 12.5 插进 INTEGER 列，它不会拦，会原样存成 REAL。想要严格拒绝错类型，得把表声明成 STRICT，这一课先按常规类型理解。` },
        { t: `p`, text: `NULL 表示「没有值」，不是 0，也不是空字符串。没填的列就是 NULL；NULL 和任何值比较都不等于，连 NULL 等于 NULL 也不成立，判断要用 IS NULL。建表时加 NOT NULL 可以禁止空值，加 DEFAULT 给没写这一列时用的默认值。主键那一列写 INTEGER PRIMARY KEY，不写它时 SQLite 会自己挑一个没被占用的整数。` },
        { t: `p`, text: `INSERT 有两种写法：写全列名再按同样顺序给值，或者省略列名、按建表时的列顺序给全部值。省略列名很脆：以后加一列，原来的语句就对不上。更稳的是写出列名，只给想给的列，其余用 DEFAULT 或 NULL 补。SELECT 星号按建表时的列顺序返回所有列；不加 ORDER BY 时行的顺序没有承诺，别把「读出来是 1 到 9」当成规则。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `p`, text: `一张表能装下一类东西：文章、订单、学生都行。你可以把整张表读出来，也可以只点几列；按条件挑行、排序、统计各有单独一课。表建好以后，改列名、加列、删表都是另一类语句，先把建表和插入走顺。` },
        { t: `h2`, text: `演示：建 posts 表，插一行缺列的` },
        { t: `code`, lang: `text`, code: `DROP TABLE IF EXISTS posts;
CREATE TABLE posts (id INTEGER PRIMARY KEY, author_id INTEGER NOT NULL, title TEXT NOT NULL, views INTEGER DEFAULT 0, likes INTEGER, published TEXT);
INSERT INTO posts VALUES
 (1,1,'索引为什么快',1200,30,'2026-03-01'),
 (2,1,'事务是什么',800,12,'2026-03-05'),
 (3,2,'NULL 的坑',300,NULL,'2026-03-09'),
 (4,2,'JOIN 入门',1500,48,'2026-03-12'),
 (5,3,'子查询慢吗',950,21,'2026-03-18'),
 (6,3,'ORDER BY 与分页',700,NULL,'2026-03-21'),
 (7,1,'LIKE 通配符',450,8,'2026-03-25'),
 (8,4,'SQLite 上手',1800,60,'2026-04-02');` },
        { t: `code`, lang: `text`, code: `INSERT INTO posts (id, author_id, title) VALUES (9, 3, '只写三列');
SELECT * FROM posts;
SELECT id, title, views, likes FROM posts;
DELETE FROM posts WHERE id = 9;` },
        { t: `p`, text: `插入的那条只写 id、author_id、title 三列：views 拿到 DEFAULT 0，likes 与 published 是 NULL。星号读出九行，NULL 不会变成 0 或空串；中间那条 SELECT 只点四列，列顺序按你写的来。看完用 DELETE 删掉这条，表回到八行，后面都按这八行算。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="12" y="10" width="616" height="260" rx="14" fill="#eef6f4"/><text x="320" y="38" font-size="18" font-weight="700" text-anchor="middle" fill="#173d36">声明决定列的类型，插入决定每行的值</text><text x="30" y="76" font-size="15" fill="#173d36">CREATE TABLE posts</text><text x="30" y="106" font-size="14" font-family="monospace" fill="#4d6f67">id INTEGER PRIMARY KEY</text><text x="30" y="130" font-size="14" font-family="monospace" fill="#4d6f67">title TEXT NOT NULL</text><text x="30" y="154" font-size="14" font-family="monospace" fill="#4d6f67">views INTEGER DEFAULT 0</text><text x="30" y="178" font-size="14" font-family="monospace" fill="#4d6f67">likes INTEGER</text><text x="30" y="202" font-size="14" font-family="monospace" fill="#4d6f67">published TEXT</text><rect x="286" y="62" width="330" height="170" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="451" y="86" font-size="15" text-anchor="middle" fill="#173d36">posts</text><text x="298" y="110" font-size="14" fill="#4d6f67">id</text><text x="338" y="110" font-size="14" fill="#4d6f67">title</text><text x="462" y="110" font-size="14" fill="#4d6f67">views</text><text x="528" y="110" font-size="14" fill="#4d6f67">likes</text><text x="298" y="138" font-size="14" fill="#173d36">1</text><text x="338" y="138" font-size="14" fill="#173d36">索引为什么快</text><text x="462" y="138" font-size="14" fill="#173d36">1200</text><text x="528" y="138" font-size="14" fill="#173d36">30</text><text x="298" y="166" font-size="14" fill="#173d36">2</text><text x="338" y="166" font-size="14" fill="#173d36">事务是什么</text><text x="462" y="166" font-size="14" fill="#173d36">800</text><text x="528" y="166" font-size="14" fill="#173d36">12</text><text x="298" y="194" font-size="14" fill="#173d36">3</text><text x="338" y="194" font-size="14" fill="#173d36">NULL 的坑</text><text x="462" y="194" font-size="14" fill="#173d36">300</text><rect x="518" y="176" width="58" height="24" rx="4" fill="#f6d9c6"/><text x="528" y="194" font-size="14" font-weight="700" fill="#a05a20">NULL</text><text x="298" y="222" font-size="14" fill="#173d36">9</text><text x="338" y="222" font-size="14" fill="#173d36">只写三列</text><text x="462" y="222" font-size="14" fill="#173d36">0</text><text x="528" y="222" font-size="14" fill="#173d36">NULL</text><text x="320" y="250" font-size="14" text-anchor="middle" fill="#173d36">INTEGER 整数　TEXT 文本　REAL 小数　NULL 没有值</text><text x="320" y="268" font-size="14" text-anchor="middle" fill="#a05a20">缺列的行走默认值或 NULL，不会被拒绝</text></svg>`, caption: `建表语句里的类型贴在列上，插入时没给值的列落成 NULL；NULL 在格子里是「没有值」，不是 0。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把 NULL 当 0 或空字符串：SUM 会跳过它，比较会得到 unknown，显示出来也不一样。`,
          `INSERT 不写列名，靠列顺序：加一列后整条语句错位。`,
          `以为 SQLite 会严格拒绝类型：普通表只做亲和性转换，12.5 能进 INTEGER 列。`,
          `主键用标题或姓名：改名、重名都会断；主键一经使用就别改。`,
          `正式查询用 SELECT 星号：列顺序会随建表语句变，程序按位置取值容易错。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `建一张 books 表：id、title、price、published，给 price 设 REAL，插入三行，其中一行 price 留空，用 SELECT 星号确认 NULL。`,
          `给 posts 表加一条只写 id、author_id、title 的记录，读出 views 与 likes，解释它们各自从哪来。`,
          `把 12.5 插进 views 列，查一下 SQLite 实际把它存成什么类型，再删掉这条实验记录。`,
          `写出 posts 表每一列的类型与约束，指出哪一列是主键、哪一列允许 NULL。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：建表把列名和类型定死，插入按列填值，没填的列是 NULL，不是 0。` }
      ]
    },
    {
      id: `d04`,
      title: `第 4 课 · SELECT：把想要的行挑出来`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用 SELECT 点列、起别名、算表达式、用 DISTINCT 去重；知道 SELECT 不带 FROM 时是在算一个值，不是查表。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `SELECT 后面写的是结果的列，不是表的全部。SELECT title, views FROM posts 从每行里只拿这两列，拼成一张新表；写星号才是全部列。结果的列名默认沿用它来自的列名，表达式列的列名就是那串表达式，难看；用 AS 起别名只改结果表的表头，原表的列名不动。别名里可以有中文，想要空格就用双引号包住。` },
        { t: `p`, text: `表达式按行算：加减乘除、取余、字符串拼接、函数都行。SQLite 里两个整数相除还是整数，7 / 2 得 3，不是 3.5；想要小数，把其中一个写成 7.0 / 2。除以零不报错，结果是 NULL。两条竖线是字符串拼接，数字会被转成文本；任何一边是 NULL，拼出来就是 NULL。` },
        { t: `p`, text: `DISTINCT 去重的是整张结果行，不是某一列。SELECT DISTINCT author_id 得到四个作者编号；SELECT DISTINCT author_id, views 则按两列的组合去重，同一作者不同浏览数算两行。SELECT 不带 FROM 时，SQLite 造一行空行来算表达式：SELECT 1 + 1、SELECT date('now')、SELECT sqlite_version() 都能跑，适合试函数和试类型转换。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `p`, text: `有了点列、别名和表达式，查询结果就能直接当报表的一行：把 views 乘个系数、把标题和次数拼成一句、把作者编号去重看有几个人写过。按条件挑行是后面单独一课的事；这一课先学会把想要的列拿对。` },
        { t: `h2`, text: `演示：点列、起名、算数、去重` },
        { t: `code`, lang: `text`, code: `SELECT title, views FROM posts;
SELECT title AS 标题, views * 2 AS 双倍浏览 FROM posts;
SELECT DISTINCT author_id FROM posts;
SELECT views / 100 AS 百位, views % 100 AS 余数 FROM posts;
SELECT 1 + 1 AS 和, 'SQL' AS 名字, 3 * 7 AS 积;
SELECT title || ' · ' || views || ' 次' AS 摘要 FROM posts;` },
        { t: `p`, text: `第三段 DISTINCT 只回四行：1、2、3、4。第四段是整数除法，1200 / 100 得 12，450 / 100 得 4，余数那列只有 950 与 450 给出 50。第五段没有 FROM，结果一行三列：2、SQL、21。第六段把标题、浏览数与「次」拼成一句，数字自动转成文本。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260"><rect x="12" y="10" width="616" height="240" rx="14" fill="#eef6f4"/><text x="320" y="38" font-size="18" font-weight="700" text-anchor="middle" fill="#173d36">SELECT 竖着切列，AS 只改结果表头</text><rect x="22" y="56" width="282" height="164" rx="8" fill="#ffffff" stroke="#8a9a96" stroke-width="2"/><text x="163" y="80" font-size="15" text-anchor="middle" fill="#173d36">posts</text><text x="32" y="104" font-size="14" fill="#4d6f67">id</text><text x="62" y="104" font-size="14" fill="#4d6f67">author_id</text><text x="138" y="104" font-size="14" fill="#4d6f67">title</text><text x="222" y="104" font-size="14" fill="#4d6f67">views</text><text x="272" y="104" font-size="14" fill="#4d6f67">likes</text><text x="32" y="130" font-size="14" fill="#173d36">1</text><text x="66" y="130" font-size="14" fill="#173d36">1</text><text x="132" y="130" font-size="14" fill="#173d36">索引</text><text x="222" y="130" font-size="14" fill="#173d36">1200</text><text x="272" y="130" font-size="14" fill="#173d36">30</text><text x="32" y="154" font-size="14" fill="#173d36">2</text><text x="66" y="154" font-size="14" fill="#173d36">1</text><text x="132" y="154" font-size="14" fill="#173d36">事务</text><text x="222" y="154" font-size="14" fill="#173d36">800</text><text x="272" y="154" font-size="14" fill="#173d36">12</text><text x="32" y="178" font-size="14" fill="#173d36">3</text><text x="66" y="178" font-size="14" fill="#173d36">2</text><text x="132" y="178" font-size="14" fill="#173d36">NULL</text><text x="222" y="178" font-size="14" fill="#173d36">300</text><text x="272" y="178" font-size="14" fill="#173d36">NULL</text><text x="32" y="202" font-size="14" fill="#173d36">4</text><text x="66" y="202" font-size="14" fill="#173d36">2</text><text x="132" y="202" font-size="14" fill="#173d36">JOIN</text><text x="222" y="202" font-size="14" fill="#173d36">1500</text><text x="272" y="202" font-size="14" fill="#173d36">48</text><rect x="120" y="112" width="142" height="100" rx="4" fill="none" stroke="#2a8c78" stroke-width="2"/><rect x="400" y="56" width="216" height="112" rx="8" fill="#ffffff" stroke="#c8763a" stroke-width="2"/><text x="508" y="80" font-size="15" text-anchor="middle" fill="#173d36">结果</text><text x="414" y="104" font-size="14" fill="#4d6f67">标题</text><text x="540" y="104" font-size="14" fill="#4d6f67">双倍浏览</text><text x="414" y="130" font-size="14" fill="#173d36">索引为什么快</text><text x="540" y="130" font-size="14" fill="#173d36">2400</text><text x="414" y="154" font-size="14" fill="#173d36">事务是什么</text><text x="540" y="154" font-size="14" fill="#173d36">1600</text><line x1="306" y1="138" x2="396" y2="120" stroke="#c8763a" stroke-width="3"/><polygon points="398,119 386,113 388,127" fill="#c8763a"/><text x="320" y="238" font-size="14" text-anchor="middle" fill="#173d36">原表的列一个没少，结果里只有点名的列</text></svg>`, caption: `左边四行五列，SELECT 只把 title 与 views 拿出来，再在结果表头换成别名；原表不动。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `以为 SELECT 挑行：它挑列；挑行要靠 WHERE。`,
          `整数相除当小数：7 / 2 是 3；写 7.0 / 2 或乘 1.0。`,
          `别名在结果里好看，但以为原表列名也变了：AS 只影响这次结果。`,
          `DISTINCT 以为只作用第一列：它作用整行组合。`,
          `字符串拼接用加号：SQLite 里加号是加法，会把文本转成 0；拼接要用两条竖线。`,
          `不加 ORDER BY 就假设结果按插入顺序：不保证。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `从 posts 里只取 title 与 likes 两列，把 likes 列名改成「赞数」，观察表头。`,
          `算出每篇文章的 views 除以 100 的整数部分与余数，再把 views 乘 1.0 除以 100，比较两种结果。`,
          `用 DISTINCT 分别对 author_id、以及 author_id 与 views 的组合去重，数一数各几行。`,
          `用 SELECT 分别算 17 / 5、17 % 5、17.0 / 5，说明三个结果的差别。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：SELECT 决定结果里有哪几列，AS 改表头，表达式按行算，DISTINCT 去的是整行。` }
      ]
    },
    {
      id: `d05`,
      title: `第 5 课 · WHERE：条件怎么写`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把 WHERE 写成能落地的条件：比较、AND/OR/NOT、LIKE、IN、BETWEEN、IS NULL，并且知道 NULL 为什么会让条件「不成立」。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `WHERE 在 SELECT 之前生效：拿每一行算条件，结果为真的留下，假的丢掉。麻烦在第三种结果：NULL 参与的比较多半是 unknown，不是假。likes 不等于 30 对 likes 为 NULL 的行既不是真也不是假，那一行也被丢掉；要找回它，得写 OR likes IS NULL。NULL 表示「不知道」，不是 0，所以「不等于 30」推不出「知道它不是 30」。` },
        { t: `p`, text: `比较用等号、不等号、大于小于这一套；文本按字节序比，大写排在小写前，日期写成 2026-03-09 这种补零格式就能按字符串正确比较。AND 比 OR 先结合，混着写要加括号，不然结果会变。BETWEEN a AND b 两头都含；IN 是一串等号的简写；NOT 把真变假、把假变真，但 unknown 取反还是 unknown。` },
        { t: `p`, text: `LIKE 里百分号匹配任意长度，下划线匹配一个字符；SQLite 的 LIKE 对 ASCII 字母默认不分大小写。要匹配真正的百分号或下划线，加 ESCAPE 指定转义符。SQLite 没有布尔类型，条件算出 1 就是真、0 是假；WHERE views 等于 WHERE views 不等于 0。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `p`, text: `条件写对，就能从一张表里捞出答案：哪些文章过千、哪个作者的文章没人赞、标题里带 SQL 的是哪篇。数据量大时数据库软件可能顺着索引找，不必每行都算，索引是后面单独一课的内容。` },
        { t: `h2`, text: `演示：八种条件各挑一次` },
        { t: `code`, lang: `text`, code: `SELECT title, views FROM posts WHERE views >= 900;
SELECT title FROM posts WHERE author_id = 1 AND views > 500;
SELECT title, views FROM posts WHERE views < 700 OR likes > 40;
SELECT title FROM posts WHERE NOT author_id = 1;
SELECT title FROM posts WHERE title LIKE '%SQL%';
SELECT title FROM posts WHERE author_id IN (2, 4);
SELECT title, views FROM posts WHERE views BETWEEN 700 AND 1200;
SELECT title FROM posts WHERE likes IS NULL;
SELECT title FROM posts WHERE likes <> 30;` },
        { t: `p`, text: `第一段 4 行，第二段 2 行，第三段 4 行；NOT author_id = 1 留下 5 行；LIKE 只中 SQLite 上手 1 行；IN 与 BETWEEN 各 3 行、4 行；IS NULL 2 行。最后一段只有 5 行：likes 为 30 的那行不满足，两行 NULL 得到 unknown，也被丢掉。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="12" y="10" width="616" height="260" rx="14" fill="#eef6f4"/><text x="320" y="38" font-size="18" font-weight="700" text-anchor="middle" fill="#173d36">WHERE 只放行结果为真的行</text><rect x="252" y="70" width="136" height="64" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="320" y="98" font-size="15" text-anchor="middle" fill="#173d36">views 大于等于 900</text><text x="320" y="122" font-size="14" text-anchor="middle" fill="#4d6f67">每行算一次</text><rect x="34" y="58" width="150" height="30" rx="6" fill="#d8efe9" stroke="#2a8c78" stroke-width="2"/><text x="109" y="78" font-size="14" text-anchor="middle" fill="#173d36">1200 索引</text><rect x="34" y="98" width="150" height="30" rx="6" fill="#ece7df" stroke="#a05a20" stroke-width="2"/><text x="109" y="118" font-size="14" text-anchor="middle" fill="#173d36">300 NULL 的坑</text><rect x="34" y="138" width="150" height="30" rx="6" fill="#d8efe9" stroke="#2a8c78" stroke-width="2"/><text x="109" y="158" font-size="14" text-anchor="middle" fill="#173d36">1500 JOIN</text><rect x="34" y="178" width="150" height="30" rx="6" fill="#d8efe9" stroke="#2a8c78" stroke-width="2"/><text x="109" y="198" font-size="14" text-anchor="middle" fill="#173d36">950 子查询</text><rect x="34" y="218" width="150" height="30" rx="6" fill="#f6d9c6" stroke="#c8763a" stroke-width="2"/><text x="109" y="238" font-size="14" text-anchor="middle" fill="#a05a20">NULL 未知</text><line x1="188" y1="73" x2="248" y2="88" stroke="#2a8c78" stroke-width="2"/><line x1="188" y1="113" x2="248" y2="100" stroke="#a05a20" stroke-width="2"/><line x1="188" y1="153" x2="248" y2="110" stroke="#2a8c78" stroke-width="2"/><line x1="188" y1="193" x2="248" y2="116" stroke="#2a8c78" stroke-width="2"/><line x1="188" y1="233" x2="248" y2="122" stroke="#c8763a" stroke-width="2"/><rect x="470" y="64" width="140" height="70" rx="10" fill="#d8efe9" stroke="#2a8c78" stroke-width="2"/><text x="540" y="94" font-size="15" text-anchor="middle" fill="#173d36">留下 3 行</text><text x="540" y="118" font-size="14" text-anchor="middle" fill="#4d6f67">1200 1500 950</text><rect x="470" y="164" width="140" height="90" rx="10" fill="#f6d9c6" stroke="#c8763a" stroke-width="2"/><text x="540" y="194" font-size="15" text-anchor="middle" fill="#173d36">丢掉 2 行</text><text x="540" y="218" font-size="14" text-anchor="middle" fill="#a05a20">300 是假</text><text x="540" y="240" font-size="14" text-anchor="middle" fill="#a05a20">NULL 是 unknown</text><line x1="390" y1="100" x2="466" y2="100" stroke="#2a8c78" stroke-width="3"/><polygon points="468,100 456,93 456,107" fill="#2a8c78"/><line x1="390" y1="130" x2="430" y2="130" stroke="#c8763a" stroke-width="2"/><line x1="430" y1="130" x2="430" y2="200" stroke="#c8763a" stroke-width="2"/><line x1="430" y1="200" x2="466" y2="200" stroke="#c8763a" stroke-width="2"/><polygon points="468,200 456,193 456,207" fill="#c8763a"/><text x="320" y="268" font-size="14" text-anchor="middle" fill="#173d36">假与 unknown 都不放行；NULL 要单独用 IS NULL 判断</text></svg>`, caption: `条件框逐行算：结果为真的留下，假与 unknown 都丢掉；NULL 不会被当成 0 或空串。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `用不等号找「不等于」，忘了 NULL：结果少那些行；要补 IS NULL。`,
          `NOT IN 的列表里混进 NULL：结果不是假就是 unknown，一行都查不出来。`,
          `LIKE 不认星号：它只认百分号与下划线，写星号会被当成普通字符。`,
          `AND/OR 不加括号：AND 先算，A OR B AND C 与 (A OR B) AND C 是两回事。`,
          `把日期当日期比：存成文本时只有补零的 ISO 格式才保证字典序等于时间序。`,
          `文本和数字比较：文本 10 与数字 10 在 SQLite 里不相等，存的时候类型要一致。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `从 posts 里挑出 views 在 700 到 1200 之间（含两端）的文章，再挑出不在这个范围的文章，比较两条语句的结果行数。`,
          `找出 likes 为空的行；再写一条 likes 不等于 30，说明为什么两条结果加起来不等于全表。`,
          `用 LIKE 找标题以 SQL 开头、以「坑」结尾、第二个字符是「索」的文章各一条。`,
          `用 IN 找作者 2 和 4 的文章，再用 NOT IN 加上 NULL 试一次，观察结果为什么为空。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：WHERE 只放行真，假和 unknown 都丢掉；NULL 要用 IS NULL 单独照顾。` }
      ]
    },
    {
      id: `d06`,
      title: `第 6 课 · ORDER BY 与 LIMIT：排序，分页`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用 ORDER BY 把行排稳，用 LIMIT 与 OFFSET 切页；知道排序键不唯一、NULL 位置不统一、OFFSET 越深越慢这三个坑。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `不加 ORDER BY，数据库软件按它方便的次序把行交出来；今天看着像插入顺序，删几行、走一次索引就可能变。ORDER BY 写在 WHERE 之后、LIMIT 之前：先筛行，再排序，最后截取。ASC 是默认，DESC 反过来；多个排序键从左到右生效，前一个相等才看后一个。想让分页稳定，最后一定加一个唯一键，比如 id。` },
        { t: `p`, text: `NULL 在排序里的位置各家不同：SQLite 升序把 NULL 放最前，降序放最后；PostgreSQL 默认相反。要跨库一致，先按「是不是 NULL」排一列：ORDER BY likes IS NULL, likes，非空在前、NULL 在后。LIMIT n 最多取 n 行，OFFSET m 先跳过 m 行；LIMIT 3 OFFSET 3 是第二页，写成 LIMIT 3, 3 也行，逗号前是跳过数。` },
        { t: `p`, text: `OFFSET 不是免费的：跳过前一万行，数据库软件仍要把它们排出来或扫过去，页码越深越慢。更麻烦的是翻页期间数据在变：第一页取完，有人插入一篇新文章，第二页的 OFFSET 就会把边界挪动，出现重复或漏行。要稳，用上一页最后一行的排序值当起点，要求排序键有索引，索引后面单独一课讲。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `p`, text: `排序加截取能回答「浏览最多的是哪三篇」「第 2 页显示什么」「点赞最少的是谁」。没有唯一排序键，LIMIT 取到的可能是任意几行；报表和分页都怕这个。` },
        { t: `h2`, text: `演示：前三篇与第二页` },
        { t: `code`, lang: `text`, code: `SELECT title, views FROM posts ORDER BY views DESC LIMIT 3;
SELECT title, author_id, views FROM posts ORDER BY author_id ASC, views DESC;
SELECT title, views FROM posts ORDER BY views DESC LIMIT 3 OFFSET 3;
SELECT title, likes FROM posts ORDER BY likes IS NULL, likes ASC;
SELECT title FROM posts ORDER BY views DESC, id ASC LIMIT 2, 3;` },
        { t: `p`, text: `第一段给出 1800、1500、1200 三篇；第二段按作者编号排序，同作者内浏览降序；第三段从第 4 行开始取 3 行，得到 950、800、700；第五段 LIMIT 2, 3 跳过 2 行再取 3 行，逗号写法等价于 LIMIT 3 OFFSET 2。第四段把两行 NULL 放到最后，因为先按 likes IS NULL 排了一次。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="12" y="10" width="616" height="260" rx="14" fill="#eef6f4"/><text x="320" y="38" font-size="18" font-weight="700" text-anchor="middle" fill="#173d36">先按浏览降序排，再跳过 3 行取 3 行</text><rect x="40" y="58" width="300" height="20" rx="4" fill="#c9d6d2"/><text x="52" y="73" font-size="14" fill="#173d36">1800 SQLite 上手</text><rect x="40" y="84" width="300" height="20" rx="4" fill="#c9d6d2"/><text x="52" y="99" font-size="14" fill="#173d36">1500 JOIN 入门</text><rect x="40" y="110" width="300" height="20" rx="4" fill="#c9d6d2"/><text x="52" y="125" font-size="14" fill="#173d36">1200 索引为什么快</text><rect x="40" y="136" width="300" height="20" rx="4" fill="#2a8c78"/><text x="52" y="151" font-size="14" fill="#ffffff">950 子查询慢吗</text><rect x="40" y="162" width="300" height="20" rx="4" fill="#2a8c78"/><text x="52" y="177" font-size="14" fill="#ffffff">800 事务是什么</text><rect x="40" y="188" width="300" height="20" rx="4" fill="#2a8c78"/><text x="52" y="203" font-size="14" fill="#ffffff">700 ORDER BY 与分页</text><rect x="40" y="214" width="300" height="20" rx="4" fill="#e6efec"/><text x="52" y="229" font-size="14" fill="#4d6f67">450 LIKE 通配符</text><rect x="40" y="240" width="300" height="20" rx="4" fill="#e6efec"/><text x="52" y="255" font-size="14" fill="#4d6f67">300 NULL 的坑</text><path d="M368 58 L368 130 L384 130" fill="none" stroke="#a05a20" stroke-width="2"/><text x="390" y="90" font-size="14" fill="#a05a20">OFFSET 3</text><text x="390" y="112" font-size="14" fill="#a05a20">跳过前三行</text><path d="M368 136 L368 208 L384 208" fill="none" stroke="#2a8c78" stroke-width="2"/><text x="390" y="168" font-size="14" fill="#2a8c78">LIMIT 3</text><text x="390" y="190" font-size="14" fill="#2a8c78">取走这三行</text><text x="560" y="130" font-size="14" text-anchor="middle" fill="#4d6f67">没有唯一排序键</text><text x="560" y="152" font-size="14" text-anchor="middle" fill="#4d6f67">边界行会重复或漏</text><text x="320" y="272" font-size="14" text-anchor="middle" fill="#173d36">页码越深，OFFSET 跳过的行越多，成本越高</text></svg>`, caption: `灰掉的前三行被 OFFSET 跳过，绿色三行被 LIMIT 取走；没有 id 做最后的排序键，边界就可能不稳。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `以为不加 ORDER BY 结果就按插入顺序：顺序没有承诺，分页和测试都会因此飘。`,
          `排序键有大量相同值还直接 LIMIT：边界行可能重复或漏掉，补 id 做最后一键。`,
          `以为 NULL 总在最后：SQLite 升序在最前，别的库可能相反。`,
          `深分页只用 OFFSET：越翻越慢，还受插入删除影响；用上一页末值做 keyset 分页。`,
          `LIMIT 3, 3 看反：前面是跳过多少行，后面才是取多少行。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `按浏览降序列出前三篇，再按作者升序、同作者浏览降序列出全部。`,
          `每页 3 篇，按浏览降序取第 1、2、3 页，检查三页有没有重复或漏行。`,
          `按 likes 升序取 4 行，观察 NULL 落在哪；再用 likes IS NULL 把 NULL 压到最后重排一次。`,
          `假设第 4、5 篇的 views 都是 950，只按 views 排序分页，会出现什么？加上 id 后呢？`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：ORDER BY 定顺序，LIMIT 切一段，OFFSET 跳行；排序键不唯一，页就翻不稳。` }
      ]
    },
    {
      id: `d07`,
      title: `第 7 课 · 聚合：COUNT，SUM，AVG`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用 COUNT、SUM、AVG、MIN、MAX 把一列压成一个数；分清 COUNT 星号与 COUNT 列，算清 NULL 在聚合里到底算不算。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `聚合函数一次吃多行、吐一个值。没有 GROUP BY 时，整张表就是一个大组，哪怕一行都没有，也会吐一行：COUNT 给 0，SUM、AVG、MIN、MAX 给 NULL。聚合在 WHERE 之后执行，被 WHERE 丢掉的行走不到聚合面前。它和普通列不能随便混着选：SELECT title, COUNT(*) 在 SQLite 里能跑，但 title 只是某一行碰巧的值，没有意义。` },
        { t: `p`, text: `COUNT 星号数的是行，不管列里是不是 NULL；COUNT(列) 数的是这一列非 NULL 的个数。八行文章里有两行 likes 为空，COUNT 星号得 8，COUNT(likes) 得 6。SUM 与 AVG 也跳过 NULL：AVG(likes) 是 179 除以 6，不是 179 除以 8；把 NULL 当 0 会算出一个偏低的平均值。全组都是 NULL 时，SUM 与 AVG 返回 NULL，不是 0；想要空集当 0，SQLite 有个 TOTAL 函数。` },
        { t: `p`, text: `MIN 与 MAX 按值的顺序取两端：数字按大小，文本按字节序。AVG 永远返回浮点数，SUM 在全是整数时返回整数；用 SUM 除以 COUNT 自己做平均，会掉进整数除法，7700 除以 8 得 962，而 AVG 得 962.5。聚合的结果没有列名时最好用 AS 起名，否则表头就是整串表达式。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `p`, text: `聚合适合回答「一共多少」「总共多少」「平均多少」「最大最小」。但它只给一个总数，想知道每个作者各多少，就得先分组，那是后面单独一课的内容。` },
        { t: `h2`, text: `演示：把整张表压成几个数` },
        { t: `code`, lang: `text`, code: `SELECT COUNT(*) AS 行数, COUNT(likes) AS 有赞行 FROM posts;
SELECT SUM(views) AS 总浏览, AVG(views) AS 平均浏览 FROM posts;
SELECT MIN(views) AS 最少, MAX(views) AS 最多 FROM posts;
SELECT SUM(likes) AS 赞总数, AVG(likes) AS 平均赞 FROM posts;
SELECT COUNT(*) AS 空集行数, SUM(views) AS 空集和, AVG(views) AS 空集均值 FROM posts WHERE 0;
SELECT COUNT(DISTINCT author_id) AS 作者数 FROM posts;
SELECT SUM(views) / COUNT(*) AS 整除, AVG(views) AS 真均值 FROM posts;` },
        { t: `p`, text: `第一段 8 行、6 个非空 likes；第二段总浏览 7700、平均 962.5；第三段最少 300、最多 1800；第四段赞总数 179，平均约 29.83；第五段在空集上得到 0、NULL、NULL；第六段四个作者；第七段整数除法 962，和 AVG 的 962.5 差 0.5。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="12" y="10" width="616" height="260" rx="14" fill="#eef6f4"/><text x="320" y="38" font-size="18" font-weight="700" text-anchor="middle" fill="#173d36">聚合把一列压成一个数，NULL 先被跳过</text><rect x="24" y="60" width="40" height="34" rx="5" fill="#d8efe9" stroke="#2a8c78" stroke-width="2"/><text x="44" y="82" font-size="14" text-anchor="middle" fill="#173d36">30</text><rect x="70" y="60" width="40" height="34" rx="5" fill="#d8efe9" stroke="#2a8c78" stroke-width="2"/><text x="90" y="82" font-size="14" text-anchor="middle" fill="#173d36">12</text><rect x="116" y="60" width="40" height="34" rx="5" fill="#f6d9c6" stroke="#c8763a" stroke-width="2"/><text x="136" y="82" font-size="14" text-anchor="middle" fill="#a05a20">NULL</text><rect x="162" y="60" width="40" height="34" rx="5" fill="#d8efe9" stroke="#2a8c78" stroke-width="2"/><text x="182" y="82" font-size="14" text-anchor="middle" fill="#173d36">48</text><rect x="208" y="60" width="40" height="34" rx="5" fill="#d8efe9" stroke="#2a8c78" stroke-width="2"/><text x="228" y="82" font-size="14" text-anchor="middle" fill="#173d36">21</text><rect x="254" y="60" width="40" height="34" rx="5" fill="#f6d9c6" stroke="#c8763a" stroke-width="2"/><text x="274" y="82" font-size="14" text-anchor="middle" fill="#a05a20">NULL</text><rect x="300" y="60" width="40" height="34" rx="5" fill="#d8efe9" stroke="#2a8c78" stroke-width="2"/><text x="320" y="82" font-size="14" text-anchor="middle" fill="#173d36">8</text><rect x="346" y="60" width="40" height="34" rx="5" fill="#d8efe9" stroke="#2a8c78" stroke-width="2"/><text x="366" y="82" font-size="14" text-anchor="middle" fill="#173d36">60</text><text x="205" y="116" font-size="14" text-anchor="middle" fill="#4d6f67">likes 列：8 行，其中 2 个 NULL</text><rect x="432" y="52" width="184" height="40" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="524" y="78" font-size="14" text-anchor="middle" fill="#173d36">COUNT(*) = 8</text><rect x="432" y="104" width="184" height="40" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="524" y="130" font-size="14" text-anchor="middle" fill="#173d36">COUNT(likes) = 6</text><rect x="432" y="156" width="184" height="40" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="524" y="182" font-size="14" text-anchor="middle" fill="#173d36">AVG(likes) = 29.83</text><line x1="390" y1="77" x2="428" y2="72" stroke="#2a8c78" stroke-width="2"/><polygon points="430,72 418,66 419,80" fill="#2a8c78"/><line x1="390" y1="90" x2="428" y2="124" stroke="#2a8c78" stroke-width="2"/><polygon points="430,124 417,121 422,134" fill="#2a8c78"/><line x1="390" y1="100" x2="428" y2="176" stroke="#2a8c78" stroke-width="2"/><polygon points="430,176 417,173 422,186" fill="#2a8c78"/><text x="320" y="232" font-size="14" text-anchor="middle" fill="#173d36">COUNT 星号数行，COUNT(列) 只数非 NULL</text><text x="320" y="258" font-size="14" text-anchor="middle" fill="#a05a20">AVG = 179 / 6，不是 179 / 8</text></svg>`, caption: `八行里两个 NULL 被 COUNT(likes) 与 AVG 跳过，但 COUNT 星号仍然把整行算进去。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `用 COUNT(列) 当行数：列里有 NULL 就会少算；行数用 COUNT 星号。`,
          `把 NULL 当 0 求平均：AVG 的分母是非空个数，不是总行数。`,
          `空表上 AVG 得 NULL 却当 0 用：报表里会显示空，不是 0；需要 0 就 COALESCE 或 TOTAL。`,
          `SUM 除以 COUNT 求平均：整数除法会截断，用 AVG 或乘 1.0。`,
          `聚合里混普通列：SQLite 不报错，但那个列值来自哪一行没有承诺。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `数 posts 一共几行、likes 非空几行、不同作者几个。`,
          `算 views 的总和、平均、最小、最大，再用 SUM 除以 COUNT 算一次平均，比较两个平均。`,
          `找出 likes 全为空时 SUM、AVG、COUNT 各返回什么（可以先 WHERE 0 造空集）。`,
          `用一句话解释为什么 AVG(likes) 的分母是 6 而不是 8。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：聚合把多行压成一个数，COUNT 星号数行，别的聚合都把 NULL 跳过。` }
      ]
    },
    {
      id: `d08`,
      title: `第 8 课 · GROUP BY：分组数一数`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用 GROUP BY 把行按 key 分桶，每组算一套聚合；用 HAVING 筛组，并说清 SELECT 里的普通列为什么必须跟分组键对齐。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `GROUP BY 按一列或一组表达式的值把行分成桶，同一个值的行进同一个桶，然后每个桶单独算聚合，最后每个桶吐一行。没有 GROUP BY 时整张表是一个桶；有了它，桶的个数就是不同 key 的个数。SQLite 通常先扫表，按 key 排序或借索引，再顺着桶算；输出顺序没有承诺，要稳定就加 ORDER BY。` },
        { t: `p`, text: `WHERE 在分桶前筛行，HAVING 在分桶后筛桶。WHERE views 大于 0 决定哪些行进桶；HAVING SUM(views) 大于 1700 决定哪些桶留下。聚合函数不能写在 WHERE 里，因为那时还没算；HAVING 里可以写聚合，也可以引用 SELECT 的别名（SQLite 允许，别的库不一定）。先想清楚要筛行还是筛组，再决定写在哪。` },
        { t: `p`, text: `标准 SQL 要求 SELECT 里的每一列要么出现在 GROUP BY 里，要么被聚合包住。SQLite 比较宽松：SELECT author_id, title, COUNT(*) 按 author_id 分组也能跑，title 会从桶里随便挑一行，挑哪行没有承诺；换版本、换计划就可能变。要展示组里的代表值，用 MIN、MAX 或先把每组算清楚再连回原表。分组键用真正的 key，不要用可能重名的姓名。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `p`, text: `分组能回答「每个作者几篇、总浏览多少」「每个标签下几篇文章」「每个月新增多少」。它把一张明细表压成一张汇总表，行数从表的行数变成桶的个数。` },
        { t: `h2`, text: `演示：按作者分桶` },
        { t: `code`, lang: `text`, code: `SELECT author_id, COUNT(*) AS 篇数, SUM(views) AS 总浏览
FROM posts GROUP BY author_id;
SELECT author_id, COUNT(*) AS 篇数, ROUND(AVG(likes), 2) AS 平均赞
FROM posts GROUP BY author_id HAVING COUNT(*) >= 2;
SELECT author_id, SUM(views) AS 总浏览
FROM posts GROUP BY author_id HAVING SUM(views) > 1700;
SELECT author_id, title, COUNT(*) AS 篇数
FROM posts GROUP BY author_id;` },
        { t: `p`, text: `第一段四个桶：作者 1 三篇、2450；作者 2 两篇、1800；作者 3 两篇、1650；作者 4 一篇、1800。第二段 HAVING 只留前三桶；第三段按总浏览筛，留下 1、2、4。第四段能跑，但 title 只是桶里某一行的值，本机这次挑到的不代表规则。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="12" y="10" width="616" height="280" rx="14" fill="#eef6f4"/><text x="320" y="36" font-size="18" font-weight="700" text-anchor="middle" fill="#173d36">GROUP BY 按作者分桶，每桶压成一行</text><text x="90" y="62" font-size="14" text-anchor="middle" fill="#4d6f67">作者 1</text><text x="240" y="62" font-size="14" text-anchor="middle" fill="#4d6f67">作者 2</text><text x="390" y="62" font-size="14" text-anchor="middle" fill="#4d6f67">作者 3</text><text x="540" y="62" font-size="14" text-anchor="middle" fill="#4d6f67">作者 4</text><rect x="40" y="72" width="100" height="24" rx="4" fill="#d8efe9" stroke="#2a8c78" stroke-width="2"/><text x="90" y="89" font-size="14" text-anchor="middle" fill="#173d36">1200 浏览</text><rect x="40" y="100" width="100" height="24" rx="4" fill="#d8efe9" stroke="#2a8c78" stroke-width="2"/><text x="90" y="117" font-size="14" text-anchor="middle" fill="#173d36">800 浏览</text><rect x="40" y="128" width="100" height="24" rx="4" fill="#d8efe9" stroke="#2a8c78" stroke-width="2"/><text x="90" y="145" font-size="14" text-anchor="middle" fill="#173d36">450 浏览</text><rect x="190" y="72" width="100" height="24" rx="4" fill="#e6efec" stroke="#2a8c78" stroke-width="2"/><text x="240" y="89" font-size="14" text-anchor="middle" fill="#173d36">300 浏览</text><rect x="190" y="100" width="100" height="24" rx="4" fill="#e6efec" stroke="#2a8c78" stroke-width="2"/><text x="240" y="117" font-size="14" text-anchor="middle" fill="#173d36">1500 浏览</text><rect x="340" y="72" width="100" height="24" rx="4" fill="#e6efec" stroke="#2a8c78" stroke-width="2"/><text x="390" y="89" font-size="14" text-anchor="middle" fill="#173d36">950 浏览</text><rect x="340" y="100" width="100" height="24" rx="4" fill="#e6efec" stroke="#2a8c78" stroke-width="2"/><text x="390" y="117" font-size="14" text-anchor="middle" fill="#173d36">700 浏览</text><rect x="490" y="72" width="100" height="24" rx="4" fill="#f6e3d2" stroke="#c8763a" stroke-width="2"/><text x="540" y="89" font-size="14" text-anchor="middle" fill="#173d36">1800 浏览</text><line x1="90" y1="152" x2="90" y2="168" stroke="#2a8c78" stroke-width="2"/><polygon points="90,170 84,158 96,158" fill="#2a8c78"/><line x1="240" y1="124" x2="240" y2="168" stroke="#2a8c78" stroke-width="2"/><polygon points="240,170 234,158 246,158" fill="#2a8c78"/><line x1="390" y1="124" x2="390" y2="168" stroke="#2a8c78" stroke-width="2"/><polygon points="390,170 384,158 396,158" fill="#2a8c78"/><line x1="540" y1="96" x2="540" y2="168" stroke="#2a8c78" stroke-width="2"/><polygon points="540,170 534,158 546,158" fill="#2a8c78"/><rect x="25" y="174" width="130" height="66" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="90" y="198" font-size="14" text-anchor="middle" fill="#173d36">作者 1</text><text x="90" y="222" font-size="14" text-anchor="middle" fill="#4d6f67">3 篇 · 2450</text><rect x="175" y="174" width="130" height="66" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="240" y="198" font-size="14" text-anchor="middle" fill="#173d36">作者 2</text><text x="240" y="222" font-size="14" text-anchor="middle" fill="#4d6f67">2 篇 · 1800</text><rect x="325" y="174" width="130" height="66" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="390" y="198" font-size="14" text-anchor="middle" fill="#173d36">作者 3</text><text x="390" y="222" font-size="14" text-anchor="middle" fill="#4d6f67">2 篇 · 1650</text><rect x="475" y="174" width="130" height="66" rx="8" fill="#ffffff" stroke="#c8763a" stroke-width="2"/><text x="540" y="198" font-size="14" text-anchor="middle" fill="#173d36">作者 4</text><text x="540" y="222" font-size="14" text-anchor="middle" fill="#4d6f67">1 篇 · 1800</text><text x="320" y="264" font-size="14" text-anchor="middle" fill="#173d36">WHERE 在进桶前筛行，HAVING 在出桶后筛组</text><text x="320" y="286" font-size="14" text-anchor="middle" fill="#a05a20">SELECT 的普通列必须来自分组键，否则值不确定</text></svg>`, caption: `八行按 author_id 落进四个桶，每桶只吐一行；桶里的浏览数与篇数是聚合算出来的。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把 WHERE 当 HAVING 用：WHERE 里写聚合会报错，筛组要用 HAVING。`,
          `SELECT 普通列没进 GROUP BY：SQLite 不报错，值却不确定。`,
          `按姓名分组：重名会被并成一个桶；按主键分。`,
          `以为 GROUP BY 后结果有序：顺序没承诺，要排序得写 ORDER BY。`,
          `NULL 分组：所有 NULL 会进同一个桶，COUNT 星号会把它算进去。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `按 author_id 分组，算每组篇数、总浏览、平均赞，按篇数从多到少排。`,
          `只留篇数大于等于 2 的组，再只留总浏览超过 1700 的组，比较两个结果。`,
          `写一条 SELECT author_id, title, COUNT(*) 的查询，解释 title 为什么不能信，再改成只选分组键与聚合。`,
          `按 views 是否大于等于 1000 分组，数两桶各几篇，说明分组键也可以是表达式。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：GROUP BY 先分桶再聚合，WHERE 筛行 HAVING 筛组，普通列必须跟分组键走。` }
      ]
    },
    {
      id: `d09`,
      title: `第 9 课 · JOIN（一）：内连接`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用 INNER JOIN 和 ON 把两张表按主键与外键对起来，会给表起别名，也能把三张表串成一条查询。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `拆表之后，文章的作者姓名不在 posts 里，只有一个 author_id。JOIN 就是把两张表按某个条件拼在一起：拿 posts 的每一行，去 authors 里找 id 等于 author_id 的行，找到就拼成一行。INNER JOIN 只保留找到的配对；左边找不到、右边找不到的行都不出现在结果里。ON 后面写配对条件，写漏了就成了笛卡尔积：8 篇文章乘 5 个作者，40 行，每篇都配上每个作者。` },
        { t: `p`, text: `JOIN 前面那张叫左表，后面叫右表，谁先谁后不影响内连接的结果，但会影响执行的开销。表名太长就用别名：posts p、authors a，之后 p.title、a.name 这样点出来。两张表都有 id 时，只写 id 会报 ambiguous column name，必须带别名。三张表就继续往后接 JOIN，每接一张，行数由新的 ON 条件决定。` },
        { t: `p`, text: `连接键的类型最好一致：SQLite 比较时会按列的亲和性做转换，文本 '1' 放在连接里可能照样配上整数 1，'abc' 就配不上；别依赖这种隐式转换，两边都定成 INTEGER 最稳。外键列上有索引时，找匹配不用每次扫全表，速度差很多；索引是后面单独一课的内容。ON 与 WHERE 在内连接里效果一样，但把配对条件写在 ON、过滤条件写在 WHERE，读起来更清楚，换成左连接时也不容易写错。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `p`, text: `连接能回答跨表的问题：每篇文章的作者是谁、哪个城市的作者写得最多、每条评论挂在哪篇文章下。没有连接，程序只能先查文章、再逐篇查作者，网络往返和代码都会变多。` },
        { t: `h2`, text: `演示：文章配作者，再配评论` },
        { t: `code`, lang: `text`, code: `DROP TABLE IF EXISTS authors;
CREATE TABLE authors (id INTEGER PRIMARY KEY, name TEXT NOT NULL, city TEXT);
INSERT INTO authors VALUES (1,'阿岚','杭州'),(2,'小北','成都'),(3,'老周','北京'),(4,'阿蓝','上海'),(5,'小满','武汉');
DROP TABLE IF EXISTS comments;
CREATE TABLE comments (id INTEGER PRIMARY KEY, post_id INTEGER, body TEXT);
INSERT INTO comments VALUES (1,1,'讲得清楚'),(2,1,'索引那段再展开'),(3,4,'JOIN 例子好'),(4,8,'SQLite 真轻'),(5,99,'幽灵评论');` },
        { t: `code`, lang: `text`, code: `SELECT p.title, a.name, a.city
FROM posts p INNER JOIN authors a ON p.author_id = a.id
ORDER BY p.id;
SELECT a.name, p.title, c.body
FROM authors a
JOIN posts p ON p.author_id = a.id
JOIN comments c ON c.post_id = p.id
ORDER BY c.id;
SELECT COUNT(*) AS 配对数
FROM posts p JOIN comments c ON c.post_id = p.id;` },
        { t: `p`, text: `第一段 8 行，每篇文章都找到了作者；第二段 4 行，评论 5 里 post_id 为 99 的那条没有对应文章，被内连接丢掉；第三段数出 4 对。把 ON 去掉再跑，会得到 40 行，那是 8 乘 5 的笛卡尔积。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="12" y="10" width="616" height="280" rx="14" fill="#eef6f4"/><text x="320" y="38" font-size="18" font-weight="700" text-anchor="middle" fill="#173d36">内连接只留下两边 key 对得上的行</text><rect x="24" y="56" width="160" height="176" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="104" y="80" font-size="15" text-anchor="middle" fill="#173d36">authors</text><text x="38" y="104" font-size="14" fill="#4d6f67">id</text><text x="92" y="104" font-size="14" fill="#4d6f67">name</text><text x="38" y="130" font-size="14" fill="#173d36">1</text><text x="92" y="130" font-size="14" fill="#173d36">阿岚</text><text x="38" y="154" font-size="14" fill="#173d36">2</text><text x="92" y="154" font-size="14" fill="#173d36">小北</text><text x="38" y="178" font-size="14" fill="#173d36">3</text><text x="92" y="178" font-size="14" fill="#173d36">老周</text><text x="38" y="202" font-size="14" fill="#173d36">4</text><text x="92" y="202" font-size="14" fill="#173d36">阿蓝</text><rect x="36" y="212" width="112" height="20" rx="4" fill="#ece7df" stroke="#a05a20" stroke-width="2"/><text x="92" y="227" font-size="14" text-anchor="middle" fill="#a05a20">5 小满 没对上</text><rect x="440" y="50" width="176" height="230" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="528" y="72" font-size="15" text-anchor="middle" fill="#173d36">posts</text><text x="454" y="94" font-size="14" fill="#4d6f67">id</text><text x="520" y="94" font-size="14" fill="#4d6f67">author_id</text><text x="454" y="116" font-size="14" fill="#173d36">1</text><text x="524" y="116" font-size="14" fill="#173d36">1</text><text x="454" y="138" font-size="14" fill="#173d36">2</text><text x="524" y="138" font-size="14" fill="#173d36">1</text><text x="454" y="160" font-size="14" fill="#173d36">3</text><text x="524" y="160" font-size="14" fill="#173d36">2</text><text x="454" y="182" font-size="14" fill="#173d36">4</text><text x="524" y="182" font-size="14" fill="#173d36">2</text><text x="454" y="204" font-size="14" fill="#173d36">5</text><text x="524" y="204" font-size="14" fill="#173d36">3</text><text x="454" y="226" font-size="14" fill="#173d36">6</text><text x="524" y="226" font-size="14" fill="#173d36">3</text><text x="454" y="248" font-size="14" fill="#173d36">7</text><text x="524" y="248" font-size="14" fill="#173d36">1</text><text x="454" y="270" font-size="14" fill="#173d36">8</text><text x="524" y="270" font-size="14" fill="#173d36">4</text><line x1="184" y1="125" x2="436" y2="111" stroke="#2a8c78" stroke-width="2"/><line x1="184" y1="130" x2="436" y2="133" stroke="#2a8c78" stroke-width="2"/><line x1="184" y1="149" x2="436" y2="155" stroke="#2a8c78" stroke-width="2"/><line x1="184" y1="154" x2="436" y2="177" stroke="#2a8c78" stroke-width="2"/><line x1="184" y1="173" x2="436" y2="199" stroke="#2a8c78" stroke-width="2"/><line x1="184" y1="178" x2="436" y2="221" stroke="#2a8c78" stroke-width="2"/><line x1="184" y1="197" x2="436" y2="243" stroke="#2a8c78" stroke-width="2"/><line x1="184" y1="202" x2="436" y2="265" stroke="#2a8c78" stroke-width="2"/><text x="320" y="294" font-size="14" text-anchor="middle" fill="#173d36">配上的拼成一行；任一边没配上，都不出现</text></svg>`, caption: `八篇文章通过 author_id 连到作者；作者 5 没有文章，连一条线都没有，内连接里直接消失。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `忘写 ON：笛卡尔积，行数相乘，查询看起来还能跑。`,
          `只写 id 不写别名：两张表都有 id，报 ambiguous column name。`,
          `连接键类型不一致：SQLite 会按亲和性转换，有时配上有时配不上，先统一类型。`,
          `以为 JOIN 会保留没配对的行：内连接不保留，要保留得换一种连接，后面单独一课讲。`,
          `三表连接漏掉中间条件：行数会爆炸或结果缺行。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `列出每篇文章的标题与作者姓名，按文章 id 排。`,
          `列出每条评论：作者名、文章标题、评论内容；找出哪条评论没有对应的文章。`,
          `把第一题的 JOIN 换成不带 ON 的写法，数结果行数，解释 40 是怎么来的。`,
          `用别名重写第二题，要求所有列都带表别名前缀，不许出现单独的 id。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：内连接拿 ON 配对，配上的拼一行，没配上的两边都不出现。` }
      ]
    },
    {
      id: `d10`,
      title: `第 10 课 · JOIN（二）：左连接`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用 LEFT JOIN 保住左表每一行，读懂右表补出来的 NULL；会用 LEFT JOIN 加 IS NULL 找「没有配对」的行。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `INNER JOIN 只留配上的行，左表里没配上的会被丢掉。LEFT JOIN 换规则：左表每一行都留下；右表有匹配就拼上，没有匹配就补一列列 NULL。左表是 JOIN 前面那张，右表是后面那张；LEFT 指的是谁，别记反。SQLite 3.39 以后也支持 RIGHT JOIN 与 FULL JOIN，旧版本没有；把两张表换个位置写成 LEFT JOIN，效果一样，也更通用。` },
        { t: `p`, text: `ON 只负责判断配不配；WHERE 是在拼完之后再筛。把右表的条件写进 WHERE，会把补出来的 NULL 行筛掉，左连接退化成内连接：WHERE p.views 大于 1000 让没有文章的作者消失；写进 ON，左表仍然全留，只是没配上。这是左连接最容易翻车的地方。` },
        { t: `p`, text: `找「没有配对」的行，用反连接：LEFT JOIN 之后加 WHERE 右表主键 IS NULL。作者没有文章、文章没有评论，都这么找。数配对数量要小心：COUNT 星号把补出来的 NULL 行也算一行，所以没文章的作者是 1；COUNT(p.id) 只数非 NULL，才是 0。NOT IN 也能找，但子查询里一旦有 NULL 就会整条失效，反连接没有这个毛病。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `p`, text: `左连接适合「主表全要、附表有就带上」：所有作者连同他们的文章数、所有文章连同评论、所有商品连同最近一次下单。报表里那些 0 和空，多半就是左连接补出来的。` },
        { t: `h2`, text: `演示：小满没有文章，也要出现` },
        { t: `code`, lang: `text`, code: `DROP TABLE IF EXISTS authors;
CREATE TABLE authors (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
INSERT INTO authors VALUES (1,'阿岚'),(2,'小北'),(3,'老周'),(4,'阿蓝'),(5,'小满');
DROP TABLE IF EXISTS comments;
CREATE TABLE comments (id INTEGER PRIMARY KEY, post_id INTEGER, body TEXT);
INSERT INTO comments VALUES (1,1,'讲得清楚'),(2,1,'再展开'),(3,4,'例子好'),(4,8,'真轻'),(5,99,'幽灵');` },
        { t: `code`, lang: `text`, code: `SELECT a.name, p.title
FROM authors a LEFT JOIN posts p ON p.author_id = a.id
ORDER BY a.id;
SELECT a.name, COUNT(*) AS 行数, COUNT(p.id) AS 篇数
FROM authors a LEFT JOIN posts p ON p.author_id = a.id
GROUP BY a.id ORDER BY a.id;
SELECT a.name FROM authors a
LEFT JOIN posts p ON p.author_id = a.id
WHERE p.id IS NULL;
SELECT p.title FROM posts p
LEFT JOIN comments c ON c.post_id = p.id
WHERE c.id IS NULL;` },
        { t: `p`, text: `第一段 9 行：前四个作者带上各自文章，小满没有文章，title 是 NULL。第二段 COUNT 星号给小满 1，COUNT(p.id) 给 0。第三段只剩小满。第四段列出 5 篇没有评论的文章。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="12" y="10" width="616" height="280" rx="14" fill="#eef6f4"/><text x="320" y="38" font-size="18" font-weight="700" text-anchor="middle" fill="#173d36">左连接保住每个作者，右边没配上就补 NULL</text><rect x="24" y="56" width="150" height="190" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="99" y="80" font-size="15" text-anchor="middle" fill="#173d36">authors</text><text x="38" y="104" font-size="14" fill="#173d36">阿岚</text><text x="38" y="134" font-size="14" fill="#173d36">小北</text><text x="38" y="164" font-size="14" fill="#173d36">老周</text><text x="38" y="194" font-size="14" fill="#173d36">阿蓝</text><rect x="30" y="210" width="138" height="26" rx="4" fill="#f6d9c6" stroke="#c8763a" stroke-width="2"/><text x="38" y="228" font-size="14" fill="#a05a20">小满</text><rect x="400" y="56" width="200" height="190" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="500" y="80" font-size="15" text-anchor="middle" fill="#173d36">结果</text><text x="414" y="104" font-size="14" fill="#173d36">阿岚 · 3 篇</text><text x="414" y="134" font-size="14" fill="#173d36">小北 · 2 篇</text><text x="414" y="164" font-size="14" fill="#173d36">老周 · 2 篇</text><text x="414" y="194" font-size="14" fill="#173d36">阿蓝 · 1 篇</text><rect x="408" y="210" width="184" height="26" rx="4" fill="#f6d9c6" stroke="#c8763a" stroke-width="2"/><text x="414" y="228" font-size="14" fill="#a05a20">小满 · 0 篇（NULL）</text><line x1="178" y1="99" x2="396" y2="99" stroke="#2a8c78" stroke-width="2"/><polygon points="398,99 386,92 386,106" fill="#2a8c78"/><line x1="178" y1="129" x2="396" y2="129" stroke="#2a8c78" stroke-width="2"/><polygon points="398,129 386,122 386,136" fill="#2a8c78"/><line x1="178" y1="159" x2="396" y2="159" stroke="#2a8c78" stroke-width="2"/><polygon points="398,159 386,152 386,166" fill="#2a8c78"/><line x1="178" y1="189" x2="396" y2="189" stroke="#2a8c78" stroke-width="2"/><polygon points="398,189 386,182 386,196" fill="#2a8c78"/><line x1="178" y1="223" x2="396" y2="223" stroke="#c8763a" stroke-width="2" stroke-dasharray="5 4"/><polygon points="398,223 386,216 386,230" fill="#c8763a"/><text x="286" y="150" font-size="14" text-anchor="middle" fill="#4d6f67">LEFT JOIN</text><text x="320" y="272" font-size="14" text-anchor="middle" fill="#173d36">没配上时，右表所有列都是 NULL</text><text x="320" y="292" font-size="14" text-anchor="middle" fill="#a05a20">反连接：WHERE p.id IS NULL 只留没配上的行</text></svg>`, caption: `左边五个作者全保留；小满在右边没有匹配，结果里补出一行 NULL，而不是把她删掉。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把右表条件写在 WHERE：NULL 行被筛掉，左连接变内连接；要写进 ON。`,
          `LEFT 记反：JOIN 前面才是全保留的那张表。`,
          `COUNT 星号当配对数量：没配上的行算 1；数配对用 COUNT(右表主键)。`,
          `用 NOT IN 找缺失：子查询结果带 NULL 时一行都查不出；用 NOT EXISTS 或反连接。`,
          `以为 RIGHT JOIN 到处能用：SQLite 3.39 以前没有，换表序写 LEFT JOIN 更稳。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `列出所有作者与他们的文章标题，没有文章的作者也要出现，按作者 id 排。`,
          `数每个作者有几篇文章，分别用 COUNT 星号与 COUNT(p.id)，指出哪一行两者不同。`,
          `找出没有文章的作者，再找出没有评论的文章，两条都用左连接加 IS NULL。`,
          `把第二题里的 p.views 大于 1000 分别放进 ON 和 WHERE，比较结果行数，解释差别。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：左连接左边一行不少，右边没配上就补 NULL；找缺失就用 IS NULL。` }
      ]
    },
    {
      id: `d11`,
      title: `第 11 课 · JOIN（三）：多表连接`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用中间表拆开多对多，用两次 JOIN 把文章、标签连起来；会给同一张表起两个别名做自连接。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `一篇文章可以有多个标签，一个标签也可以挂在多篇文章上，这种多对多没法用一列存：存「SQL,索引」这样的字符串，查「哪些文章带 SQL」就得切字符串。拆法是加一张中间表 post_tags，每行只放一对 post_id 与 tag_id；一篇文章几个标签就几行，一个标签被几篇文章用就几行。中间表的主键用两列组合，保证同一对不会重复。` },
        { t: `p`, text: `查的时候从 posts 出发，先 JOIN post_tags 拿到配对，再 JOIN tags 把 tag_id 换成名字，两次都是内连接。一篇文章有两个标签，在结果里就会出现两行，这是正常的；要每篇一行，就按文章分组，再用 COUNT 数标签，或用 GROUP_CONCAT 把名字拼成一串。中间表只存关系，标签名只在 tags 里存一份，改名只改一处。` },
        { t: `p`, text: `自连接是同一张表出现两次，必须起两个别名，否则分不清是哪一边。employees 表里每行有一个 boss_id 指向本表的 id；把 employees 写成 e 和 b 两个别名，ON e.boss_id = b.id，就能把员工和上级拼到一行。内连接会丢掉 boss_id 为 NULL 的最高上级；换成左连接，最高上级那一行保留，上级列是 NULL。层级再深就要递归查询，那是后面单独一课的事。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `p`, text: `中间表能表达标签、点赞、选课、关注这些「两边都很多」的关系；自连接能表达上下级、推荐人、好友这类「表内自己指自己」的关系。两者都不需要复制业务数据。` },
        { t: `h2`, text: `演示：标签中间表与员工上级` },
        { t: `code`, lang: `text`, code: `DROP TABLE IF EXISTS tags;
CREATE TABLE tags (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
INSERT INTO tags VALUES (1,'SQL'),(2,'索引'),(3,'入门'),(4,'踩坑');
DROP TABLE IF EXISTS post_tags;
CREATE TABLE post_tags (post_id INTEGER, tag_id INTEGER, PRIMARY KEY (post_id, tag_id));
INSERT INTO post_tags VALUES (1,1),(1,2),(2,1),(4,1),(4,3),(3,4),(6,4),(8,1),(8,3),(7,1);
DROP TABLE IF EXISTS employees;
CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, boss_id INTEGER);
INSERT INTO employees VALUES (1,'老周',NULL),(2,'阿岚',1),(3,'小北',1),(4,'小满',2),(5,'阿蓝',2);` },
        { t: `code`, lang: `text`, code: `SELECT p.title, t.name
FROM posts p
JOIN post_tags pt ON pt.post_id = p.id
JOIN tags t ON t.id = pt.tag_id
ORDER BY p.id, t.id;
SELECT e.name AS 员工, b.name AS 上级
FROM employees e LEFT JOIN employees b ON e.boss_id = b.id
ORDER BY e.id;
SELECT b.name AS 上级, COUNT(*) AS 下属数
FROM employees e JOIN employees b ON e.boss_id = b.id
GROUP BY b.id ORDER BY 下属数 DESC;` },
        { t: `p`, text: `第一段 10 行：第一篇两个标签、第四篇两个、第八篇两个，其余各一个。第二段员工与上级 5 行，老周没有上级，补 NULL。第三段数直接下属：老周 2 个、阿岚 2 个，小北没有直接下属，所以不出现。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320"><rect x="12" y="10" width="616" height="300" rx="14" fill="#eef6f4"/><text x="320" y="36" font-size="18" font-weight="700" text-anchor="middle" fill="#173d36">多对多用中间表拆成两个一对多</text><rect x="22" y="52" width="150" height="92" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="97" y="74" font-size="15" text-anchor="middle" fill="#173d36">posts</text><text x="36" y="98" font-size="14" fill="#173d36">1 索引为什么快</text><text x="36" y="120" font-size="14" fill="#173d36">4 JOIN 入门</text><text x="36" y="140" font-size="14" fill="#173d36">8 SQLite 上手</text><rect x="232" y="48" width="176" height="110" rx="8" fill="#ffffff" stroke="#c8763a" stroke-width="2"/><text x="320" y="70" font-size="15" text-anchor="middle" fill="#173d36">post_tags</text><text x="246" y="94" font-size="14" fill="#4d6f67">post_id</text><text x="330" y="94" font-size="14" fill="#4d6f67">tag_id</text><text x="246" y="116" font-size="14" fill="#173d36">1</text><text x="336" y="116" font-size="14" fill="#173d36">1</text><text x="246" y="136" font-size="14" fill="#173d36">1</text><text x="336" y="136" font-size="14" fill="#173d36">2</text><text x="246" y="156" font-size="14" fill="#173d36">4</text><text x="336" y="156" font-size="14" fill="#173d36">1</text><rect x="468" y="52" width="150" height="92" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="543" y="74" font-size="15" text-anchor="middle" fill="#173d36">tags</text><text x="482" y="98" font-size="14" fill="#173d36">1 SQL</text><text x="482" y="120" font-size="14" fill="#173d36">2 索引</text><text x="482" y="140" font-size="14" fill="#173d36">3 入门</text><line x1="174" y1="98" x2="228" y2="98" stroke="#2a8c78" stroke-width="2"/><polygon points="230,98 218,91 218,105" fill="#2a8c78"/><line x1="410" y1="98" x2="464" y2="98" stroke="#2a8c78" stroke-width="2"/><polygon points="466,98 454,91 454,105" fill="#2a8c78"/><text x="202" y="78" font-size="14" fill="#4d6f67">post_id</text><text x="436" y="78" font-size="14" fill="#4d6f67">tag_id</text><text x="320" y="188" font-size="16" font-weight="700" text-anchor="middle" fill="#173d36">自连接：同一张表两个别名</text><rect x="60" y="206" width="190" height="80" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="155" y="228" font-size="15" text-anchor="middle" fill="#173d36">employees e</text><text x="74" y="250" font-size="14" fill="#173d36">2 阿岚 boss 1</text><text x="74" y="272" font-size="14" fill="#173d36">4 小满 boss 2</text><rect x="390" y="206" width="190" height="80" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="485" y="228" font-size="15" text-anchor="middle" fill="#173d36">employees b</text><text x="404" y="250" font-size="14" fill="#173d36">1 老周</text><text x="404" y="272" font-size="14" fill="#173d36">2 阿岚</text><line x1="250" y1="245" x2="386" y2="245" stroke="#c8763a" stroke-width="2"/><polygon points="388,245 376,238 376,252" fill="#c8763a"/><text x="320" y="238" font-size="14" text-anchor="middle" fill="#a05a20">boss_id 指向 id</text><text x="320" y="306" font-size="14" text-anchor="middle" fill="#173d36">中间表的主键是 post_id 加 tag_id，一对只存一次</text></svg>`, caption: `上面一张中间表把文章与标签拆成两个一对多；下面同一张 employees 表出现两次，用 boss_id 连回 id。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `多对多硬塞进一列：用逗号拼字符串，查一次要切一次，还没法建索引。`,
          `中间表不加组合主键：同一对能插两次，计数翻倍。`,
          `忘记 JOIN tags：结果里只有 tag_id，没有标签名。`,
          `自连接不起别名：同名列无法区分，SQLite 报错。`,
          `自连接用内连接找全体：boss_id 为 NULL 的最高层会消失，要保留就换左连接。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `列出每篇文章的标题和它的标签名，按文章 id、标签 id 排；数一数一共几行。`,
          `按文章分组，算每篇几个标签，只留标签数大于 1 的文章。`,
          `给一篇文章加一个新标签：先在 tags 里找到或插入标签，再往 post_tags 插一对；把两条语句写出来。`,
          `列出每个员工与直接上级，最高层也要出现；再找出没有直接下属的人。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：多对多靠中间表拆成两次一对多，自连接靠两个别名把一张表用两次。` }
      ]
    },
    {
      id: `d12`,
      title: `第 12 课 · 子查询：查询里面套查询`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：分清标量子查询、IN、EXISTS、相关子查询和派生表，知道每一种把内层结果放到外层的哪个位置。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `子查询就是括号里再写一条 SELECT。出现在比较号右边、只该有一个值的，是标量子查询：WHERE views 大于 (SELECT AVG(views) FROM posts)。标量位置要求一行一列；SQLite 对内层返回多行很宽松，只取第一行，不报错，所以写之前先确认内层最多一行。内层一行都没有时，整个子查询是 NULL，比较结果为 unknown，行就被筛掉。` },
        { t: `p`, text: `IN 后面接一列值，等于把一串等号用 OR 连起来；NOT IN 遇到内层结果里有 NULL 会整条失效，因为「不等于 NULL」是 unknown。EXISTS 只问内层有没有行，找到第一行就停，不关心选了什么列，习惯写 SELECT 1。相关子查询引用外层的列，外层每换一行，内层就按新的值再算一次；NOT EXISTS 因此能稳稳地找「没有配对」的行。` },
        { t: `p`, text: `放在 FROM 后面的子查询叫派生表，它先算出一张临时表，外层再在这张表上查；标准 SQL 要求派生表起别名，SQLite 允许不写，但最好起一个，换库时不至于报错。相关子查询写起来直观，概念上外层多少行就要算多少次，内层条件上的索引很关键。子查询套深了难读，SQLite 支持 CTE 把中间结果起名字，那是后面单独一课的内容。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `p`, text: `子查询适合把「先算一个总数，再拿每行跟它比」「先找一批 id，再按这批 id 取行」「先分组汇总，再在汇总结果上筛」这三类问题写成一条语句，不用把中间结果搬回程序。` },
        { t: `h2`, text: `演示：五种位置各来一次` },
        { t: `code`, lang: `text`, code: `DROP TABLE IF EXISTS authors;
CREATE TABLE authors (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
INSERT INTO authors VALUES (1,'阿岚'),(2,'小北'),(3,'老周'),(4,'阿蓝'),(5,'小满');
DROP TABLE IF EXISTS posts;
CREATE TABLE posts (id INTEGER PRIMARY KEY, author_id INTEGER, title TEXT NOT NULL, views INTEGER, likes INTEGER, published TEXT);
INSERT INTO posts VALUES
 (1,1,'索引为什么快',1200,30,'2026-03-01'),(2,1,'事务是什么',800,12,'2026-03-05'),
 (3,2,'NULL 的坑',300,NULL,'2026-03-09'),(4,2,'JOIN 入门',1500,48,'2026-03-12'),
 (5,3,'子查询慢吗',950,21,'2026-03-18'),(6,3,'ORDER BY 与分页',700,NULL,'2026-03-21'),
 (7,1,'LIKE 通配符',450,8,'2026-03-25'),(8,4,'SQLite 上手',1800,60,'2026-04-02');` },
        { t: `code`, lang: `text`, code: `SELECT title, views FROM posts
WHERE views > (SELECT AVG(views) FROM posts);
SELECT name FROM authors
WHERE id IN (SELECT author_id FROM posts WHERE views > 1000);
SELECT name FROM authors a
WHERE EXISTS (SELECT 1 FROM posts p WHERE p.author_id = a.id AND p.views > 1000);
SELECT a.name, (SELECT COUNT(*) FROM posts p WHERE p.author_id = a.id) AS 篇数
FROM authors a ORDER BY a.id;
SELECT author_id, 篇数 FROM
(SELECT author_id, COUNT(*) AS 篇数 FROM posts GROUP BY author_id)
WHERE 篇数 >= 2;` },
        { t: `p`, text: `第一段 3 行：1200、1500、1800，都高于全表平均 962.5。第二段与第三段都给出阿岚、小北、阿蓝三人；第二段先算出作者 id 的集合，第三段逐个作者问有没有符合条件的文章。第四段每位作者一行，篇数 3、2、2、1、0。第五段派生表先按作者汇总，再筛篇数大于等于 2，留下 1、2、3。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="12" y="10" width="616" height="280" rx="14" fill="#eef6f4"/><text x="320" y="36" font-size="18" font-weight="700" text-anchor="middle" fill="#173d36">内层先算出一份结果，外层拿它接着用</text><rect x="20" y="50" width="600" height="150" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="36" y="74" font-size="15" fill="#173d36">外层查询</text><rect x="54" y="92" width="230" height="86" rx="8" fill="#fdf3ea" stroke="#c8763a" stroke-width="2"/><text x="70" y="116" font-size="15" fill="#173d36">内层 SELECT</text><text x="70" y="142" font-size="14" fill="#4d6f67">AVG(views) FROM posts</text><text x="70" y="166" font-size="14" fill="#a05a20">算出 962.5</text><line x1="288" y1="135" x2="344" y2="135" stroke="#c8763a" stroke-width="3"/><polygon points="346,135 334,128 334,142" fill="#c8763a"/><text x="316" y="126" font-size="14" text-anchor="middle" fill="#a05a20">一个值</text><text x="360" y="130" font-size="14" fill="#173d36">WHERE views 大于 962.5</text><text x="360" y="154" font-size="14" fill="#4d6f67">结果：1200 1500 1800</text><rect x="24" y="222" width="138" height="48" rx="8" fill="#d8efe9" stroke="#2a8c78" stroke-width="2"/><text x="93" y="243" font-size="14" text-anchor="middle" fill="#173d36">标量</text><text x="93" y="262" font-size="14" text-anchor="middle" fill="#4d6f67">一行一列的值</text><rect x="174" y="222" width="138" height="48" rx="8" fill="#d8efe9" stroke="#2a8c78" stroke-width="2"/><text x="243" y="243" font-size="14" text-anchor="middle" fill="#173d36">IN</text><text x="243" y="262" font-size="14" text-anchor="middle" fill="#4d6f67">一列值</text><rect x="324" y="222" width="138" height="48" rx="8" fill="#d8efe9" stroke="#2a8c78" stroke-width="2"/><text x="393" y="243" font-size="14" text-anchor="middle" fill="#173d36">EXISTS</text><text x="393" y="262" font-size="14" text-anchor="middle" fill="#4d6f67">有没有行</text><rect x="474" y="222" width="138" height="48" rx="8" fill="#d8efe9" stroke="#2a8c78" stroke-width="2"/><text x="543" y="243" font-size="14" text-anchor="middle" fill="#173d36">派生表</text><text x="543" y="262" font-size="14" text-anchor="middle" fill="#4d6f67">一张临时表</text></svg>`, caption: `内层先算出 962.5，外层把它当值用；换到 IN、EXISTS 或 FROM 后面，内层交出来的东西形状不同。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `标量子查询返回多行：SQLite 只取第一行不报错，换库就报错；用 LIMIT 1 或聚合收成一行。`,
          `NOT IN 的子查询结果带 NULL：整条条件失效；换 NOT EXISTS 或反连接。`,
          `相关子查询忘了写关联条件：内层和外层脱钩，每行都拿到同一个值。`,
          `派生表不起别名：SQLite 能跑，别的库可能报错；养成起别名的习惯。`,
          `子查询能写成连接却硬套：执行计划可能每行跑一次，数据一大就慢；先看能不能 JOIN。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `找出浏览数高于全表平均的文章，再找出高于本作者平均的文章，比较两条语句。`,
          `用 IN 与 EXISTS 各写一条「找有热门文章的作者」，确认结果一致；再用 NOT EXISTS 找没有热门文章的作者。`,
          `用标量子查询在作者列表里加一列「篇数」，没有文章的作者显示 0。`,
          `用派生表先按作者算总浏览，再筛总浏览大于 1700 的作者，最后按总浏览降序排。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：子查询把内层结果交给外层，标量给一个值、IN 给一列、EXISTS 只看有没有、派生表给一张表。` }
      ]
    }
  ]
};
