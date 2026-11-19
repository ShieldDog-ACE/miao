/* 喵站 · 数据库与 SQL 入门 正文分部 d2：第 13–24 课
 * 导出 window.MIAO_SQL_D2 = { chapters: [...] }，由 sql-data.js 装配。
 * 文中 SQL 全部在本机 python3 的 sqlite3 临时库里跑过；输出按实际结果抄写。
 */
window.MIAO_SQL_D2 = {
  chapters: [
    {
      id: `d13`, title: `第 13 课 · CTE：给查询起个名字`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把一段子查询提到语句开头起个名字，让后面的查询像读步骤一样从上往下读；再用递归 CTE 沿着一棵树一层层往下走。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `一条 SELECT 里再套 SELECT，括号一多就没人看得懂。CTE（common table expression，公共表表达式）换了个写法：在整条语句最前面用 WITH 起名字，后面把它当表用。它不落盘、不建表，只在这一次查询里有效，语句结束名字就没了。SQLite 3.8.3 起支持，现在基本不用操心版本。` },
        { t: `p`, text: `形状是 WITH 名字 AS 一对括号里放子查询，括号后面直接接主查询。列清单可以省，省了就用子查询自己产出的列名。跟写在 FROM 后面的派生表比，内容一模一样，差别在阅读顺序：派生表从最里面往外读，CTE 从最上面往下读。步骤一多，从上往下省脑子。` },
        { t: `p`, text: `一条 WITH 可以带好几个 CTE，逗号隔开，后面的能引用前面的 —— 这正是「先算小结果，再拿小结果算大结果」的写法。递归 CTE 多一个 RECURSIVE 关键字，结构固定成两半：UNION ALL 上面是起点，产出一行或几行；下面是下一步，拿上一轮的结果继续查。查不出新行，循环就停。没有终止条件的递归会一直算下去，直到把内存或耐心耗光。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `p`, text: `三个场景最值：把五层嵌套的查询拆成三个带名字的步骤；同一个汇总结果在一条语句里用两次，比如先算每人合计，再筛出超过门槛的人；展开树形数据 —— 谁向谁汇报、一条帖子下面所有回复、一张图的连通块。递归那部分说穿了就是「拿上一轮的结果当这一轮的输入」，跟你写过的循环是一回事，只是写成了 SQL。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="10" y="10" width="620" height="280" rx="14" fill="#eef3fa"/><text x="320" y="38" font-size="18" font-weight="700" text-anchor="middle" fill="#17365d">递归 CTE：起点先出一行，每轮只往下走一层</text><rect x="26" y="60" width="176" height="58" rx="10" fill="#ffffff" stroke="#2f6fb0" stroke-width="2"/><text x="114" y="84" font-size="15" text-anchor="middle" fill="#17365d">起点：boss_id 为空</text><text x="114" y="106" font-size="14" text-anchor="middle" fill="#4a6178">老周 level 0</text><line x1="206" y1="89" x2="240" y2="89" stroke="#2f6fb0" stroke-width="3"/><polygon points="252,89 240,82 240,96" fill="#2f6fb0"/><rect x="256" y="60" width="176" height="58" rx="10" fill="#ffffff" stroke="#2f6fb0" stroke-width="2"/><text x="344" y="84" font-size="15" text-anchor="middle" fill="#17365d">第 1 轮：找孩子</text><text x="344" y="106" font-size="14" text-anchor="middle" fill="#4a6178">阿岚 小北 level 1</text><line x1="436" y1="89" x2="470" y2="89" stroke="#2f6fb0" stroke-width="3"/><polygon points="482,89 470,82 470,96" fill="#2f6fb0"/><rect x="486" y="60" width="140" height="58" rx="10" fill="#ffffff" stroke="#2f6fb0" stroke-width="2"/><text x="556" y="84" font-size="15" text-anchor="middle" fill="#17365d">第 2 轮</text><text x="556" y="106" font-size="14" text-anchor="middle" fill="#4a6178">阿禾 level 2</text><rect x="26" y="150" width="588" height="46" rx="10" fill="#ffffff" stroke="#c8763a" stroke-width="2"/><text x="320" y="179" font-size="15" text-anchor="middle" fill="#8a4a18">第 3 轮：阿禾下面没有人，join 出 0 行，循环停在这里</text><path d="M320 212 C320 246 560 246 560 208" fill="none" stroke="#c8763a" stroke-width="2" stroke-dasharray="6 5"/><text x="320" y="268" font-size="14" text-anchor="middle" fill="#8a4a18">UNION ALL 上半段只跑一次，下半段每轮跑一次；两半的列数必须一样</text></svg>`, caption: `看左边的起点怎么一轮一轮变成右边，以及最后那轮为什么是空的。` },
        { t: `h2`, text: `演示：把订单查询拆成两步，再走一棵树` },
        { t: `code`, lang: `text`, code: `CREATE TABLE orders (id INTEGER PRIMARY KEY, customer TEXT, amount INTEGER);
INSERT INTO orders (customer, amount) VALUES
  ('阿岚', 120), ('阿岚', 80), ('小北', 200),
  ('小北', 50), ('老周', 300);
WITH per AS (
  SELECT customer, SUM(amount) AS total FROM orders GROUP BY customer
), passed AS (
  SELECT customer, total FROM per WHERE total >= 200
)
SELECT * FROM passed ORDER BY total DESC;` },
        { t: `p`, text: `产出三行：老周 300、小北 250、阿岚 200。per 先把五个订单压成三个人，passed 再拿 per 的结果筛门槛，主查询只负责排序输出。两个名字都只在这一次查询里存在，换一条语句就找不到。` },
        { t: `code`, lang: `text`, code: `CREATE TABLE staff (id INTEGER PRIMARY KEY, name TEXT, boss_id INTEGER);
INSERT INTO staff VALUES
  (1, '老周', NULL), (2, '阿岚', 1), (3, '小北', 1), (4, '阿禾', 2);
WITH RECURSIVE chain(id, name, level) AS (
  SELECT id, name, 0 FROM staff WHERE boss_id IS NULL
  UNION ALL
  SELECT s.id, s.name, chain.level + 1
  FROM staff s JOIN chain ON s.boss_id = chain.id
)
SELECT * FROM chain ORDER BY level, id;` },
        { t: `p`, text: `四行全出来了，level 依次是 0、1、1、2。起点是 boss_id 为空的老板；下半段把 staff 与自己上一轮的结果 join，条件是「我的老板在你那一行里」，每接到一个人就多一层，直到没人可接。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `以为 CTE 建了一张表。它只活在这一条语句里，下一条语句再写同名，数据库会说找不到。`,
          `多个 CTE 写成 WITH a AS (...) WITH b AS (...)。正确写法是一条 WITH，中间用逗号接 b AS (...)。`,
          `递归的终止条件写在上半段。管住循环的是下半段的 WHERE，写在起点那半段等于没写。`,
          `递归两半的列数对不上，或者列名指望下半段改。列名以上半段为准，列数必须完全一致。`,
          `CTE 名字撞上真实表名。同名时 CTE 优先，查出来的不是你以为是的那张表。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `用 orders 表写一个 CTE：先算每个客户的总消费，再只留下超过 200 的客户，和不用 CTE 的嵌套写法各写一遍，比一比哪个先读懂。`,
          `往 staff 表插一个汇报给阿禾的新人，跑一遍递归查询，说出新人的 level 是几、为什么。`,
          `把递归例子的 n 小于 5 改成小于 100 看结果；然后想一想删掉终止条件会怎样，再动手试（准备好随时中断）。`,
          `写一个含两个 CTE 的查询：第一个按商品分类算行数，第二个只留下行数大于 1 的分类。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：WITH 给中间结果起名字，查询就能从上往下读；递归 CTE 是「起点加下一步」，查不到新行自然就停。` }
      ]
    },
    {
      id: `d14`, title: `第 14 课 · 插入数据：INSERT`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：写一条不怕表结构变化的插入语句，一次插多行、从别的表搬数据、让默认值接手，并用 RETURNING 把刚写进去的行拿回来。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `INSERT INTO 表（列，列）VALUES（值，值）。数据库按列清单把值一个个对上去，没写到的列交给默认值（DEFAULT），连默认值都没有就是 NULL；那一列要是标了 NOT NULL，整条语句直接失败。列清单不是装饰：不写它，值的顺序必须和建表时完全一致，表一加列就全错位；写了列清单，顺序随你排，没提到的列也不受影响。` },
        { t: `p`, text: `一组括号是一行，多行就多组括号用逗号隔开。一条语句塞几千行，SQLite 不会拒绝，但每条 INSERT 默认自己就是一个事务，插一万行就是一万次落盘。把一批插入放进同一个事务，速度能差十几倍 —— 事务后面单独一课讲，这里先记住批量写成批提交。` },
        { t: `p`, text: `INSERT INTO 表（列）后面不写 VALUES 而接一条 SELECT，就能把另一张表的结果整批搬进来，列数对上、类型能转就行。RETURNING 让 INSERT、UPDATE、DELETE 把动过的行当场吐回来，省掉「插完再查一次」；SQLite 3.35 起支持。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `p`, text: `导入一批数据、把旧表里满足条件的行搬进归档表、插入后马上要拿自增 id 好跳转页面，都是它。往一张约束很多的表里插数据，也是最快暴露问题的动作：少一列、类型不对、外键指向不存在的行，都会当场报出来。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260"><rect x="10" y="10" width="620" height="240" rx="14" fill="#f2f7ee"/><text x="320" y="38" font-size="18" font-weight="700" text-anchor="middle" fill="#2c4a1e">列清单决定值落在哪一列，没点名的列交给默认值</text><rect x="26" y="72" width="118" height="40" rx="8" fill="#ffffff" stroke="#5b8c3a" stroke-width="2"/><text x="85" y="98" font-size="15" text-anchor="middle" fill="#2c4a1e">'买牛奶'</text><rect x="26" y="132" width="118" height="40" rx="8" fill="#ffffff" stroke="#5b8c3a" stroke-width="2"/><text x="85" y="158" font-size="15" text-anchor="middle" fill="#2c4a1e">1</text><rect x="230" y="62" width="384" height="168" rx="10" fill="#ffffff" stroke="#5b8c3a" stroke-width="2"/><line x1="230" y1="104" x2="614" y2="104" stroke="#5b8c3a" stroke-width="2"/><text x="278" y="89" font-size="15" text-anchor="middle" fill="#2c4a1e">id</text><text x="382" y="89" font-size="15" text-anchor="middle" fill="#2c4a1e">body</text><text x="480" y="89" font-size="15" text-anchor="middle" fill="#2c4a1e">done</text><text x="572" y="89" font-size="15" text-anchor="middle" fill="#2c4a1e">created</text><text x="278" y="140" font-size="14" text-anchor="middle" fill="#7a8a6a">自动编号</text><text x="382" y="140" font-size="14" text-anchor="middle" fill="#2c4a1e">买牛奶</text><text x="480" y="140" font-size="14" text-anchor="middle" fill="#2c4a1e">1</text><text x="572" y="140" font-size="14" text-anchor="middle" fill="#7a8a6a">默认时间</text><text x="278" y="182" font-size="14" text-anchor="middle" fill="#7a8a6a">没写</text><text x="382" y="182" font-size="14" text-anchor="middle" fill="#7a8a6a">第 1 个值</text><text x="480" y="182" font-size="14" text-anchor="middle" fill="#7a8a6a">第 2 个值</text><text x="572" y="182" font-size="14" text-anchor="middle" fill="#7a8a6a">没写</text><line x1="146" y1="92" x2="226" y2="122" stroke="#c8763a" stroke-width="2"/><polygon points="230,124 217,119 221,111" fill="#c8763a"/><line x1="146" y1="152" x2="226" y2="152" stroke="#c8763a" stroke-width="2"/><polygon points="230,152 218,146 218,158" fill="#c8763a"/><text x="320" y="222" font-size="14" text-anchor="middle" fill="#6b7a5c">两个值按名字对上 body 和 done；id 与 created 由数据库自己填</text></svg>`, caption: `箭头只连到点名的列，空着的两列各有各的兜底来源。` },
        { t: `h2`, text: `演示：一条一条插，一批一批插` },
        { t: `code`, lang: `text`, code: `CREATE TABLE notes (
  id INTEGER PRIMARY KEY,
  body TEXT NOT NULL,
  done INTEGER NOT NULL DEFAULT 0
);
INSERT INTO notes (body) VALUES ('买牛奶');
INSERT INTO notes (body, done) VALUES ('交电费', 1), ('修自行车', 0);
INSERT INTO notes (body) VALUES ('倒垃圾')
  RETURNING id, body, done;` },
        { t: `p`, text: `第一条没写 done，拿到默认的 0；第二条一次进了两行；最后一条用 RETURNING 当场吐回新行，id 是 4，不用再补一条 SELECT。id 那列是 INTEGER PRIMARY KEY，不给值就取当前最大值加一；默认不保证永不重用，要保证得声明 AUTOINCREMENT。` },
        { t: `code`, lang: `text`, code: `CREATE TABLE archive (id INTEGER PRIMARY KEY, body TEXT);
INSERT INTO archive (body)
  SELECT body FROM notes WHERE done = 1;
SELECT * FROM archive;` },
        { t: `p`, text: `归档表里多出一行「交电费」。INSERT 后面接的 SELECT 有几行就插几行，列按位置对齐，名字不用一样。搬数据前先把那条 SELECT 单独跑一遍，看行数和内容对不对，比插完再后悔强。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `不写列清单，指望按位置对上。表加了一列，语句就当场报错，或者把值插进隔壁列。`,
          `字符串用双引号包。标准 SQL 里双引号是列名，SQLite 只是宽容地退一步当字符串，换一个数据库立刻报错。字符串一律单引号。`,
          `一次插几千行还一条一条提交。包进一个事务再插，差距肉眼可见。`,
          `一行里有一个值违反约束，以为别的行还能进。一条 INSERT 语句是整体：要么全进，要么一行都不进。`,
          `插完指望 RETURNING 在哪儿都有。老环境里要用 last_insert_rowid()。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `给 notes 加一列 priority INTEGER NOT NULL DEFAULT 1，再用一条语句插两行：一行写 priority，一行不写，验证默认值。`,
          `用 INSERT INTO SELECT 把 notes 里 done 为 0 的行搬进 archive，先 SELECT 数行数，再插，再对一次。`,
          `故意插一行 body 为 NULL 的记录，把报错原文抄下来，指出是哪条约束拦住的。`,
          `插一行之后分别用 RETURNING 和 SELECT last_insert_rowid() 拿 id，说出两种办法各自的适用场合。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：列清单写清楚，值只对名字不对位置；批量插入放进一个事务，插完要用就 RETURNING 拿回来。` }
      ]
    },
    {
      id: `d15`, title: `第 15 课 · 更新数据：UPDATE`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：写出一条只动该动那几行的 UPDATE，知道 SET 右边一律拿旧值算，并会用子查询给新值。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `UPDATE 表 SET 列 = 表达式 WHERE 条件。数据库把表逐行过一遍，每一行先算 WHERE：为真，就把 SET 里每个表达式算出来写回去；为假，跳过。UPDATE 的成本和「扫过多少行」成正比，跟最后改了几行没必然关系。WHERE 写漏不是「多改几行」：没有 WHERE 的 UPDATE 会把整张表每一行按同一个表达式重算一遍。` },
        { t: `p`, text: `SET 右边引用的列，一律是这一行被改之前的值。SET a = a + 1, b = a 里的 b 拿到的是旧的 a，不是刚加完的那个。这条规则也让交换两列能写成 SET a = b, b = a：两个赋值同时按旧值求值。同一个列在 SET 里出现两次，SQLite 只用最后一个。` },
        { t: `p`, text: `新值可以来自子查询，也可以把另一张表接进来：UPDATE 后面跟 FROM，是 SQLite 3.33 之后支持的写法。动手前先用同样的 WHERE 跑一条 SELECT，把要改的行和将算出的新值列出来 —— 这一步能挡掉九成误更新。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `p`, text: `调价、把过期的状态改掉、照着一张映射表批量补字段、修正一条录错的数据，核心都是同一件事：先定位行，再算新值。难的不是语法，是把「哪些行该动」用 WHERE 说清楚；说不清就先别写 UPDATE。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="10" y="10" width="620" height="260" rx="14" fill="#fdf3e7"/><text x="320" y="38" font-size="18" font-weight="700" text-anchor="middle" fill="#7a4315">UPDATE 是逐行过筛：WHERE 为真才算一次 SET</text><rect x="24" y="58" width="120" height="176" rx="10" fill="#ffffff" stroke="#c8763a" stroke-width="2"/><text x="84" y="84" font-size="15" text-anchor="middle" fill="#7a4315">表里的行</text><text x="84" y="116" font-size="14" text-anchor="middle" fill="#7a5535">铅笔 10</text><text x="84" y="144" font-size="14" text-anchor="middle" fill="#7a5535">钢笔 60</text><text x="84" y="172" font-size="14" text-anchor="middle" fill="#7a5535">台灯 150</text><text x="84" y="200" font-size="14" text-anchor="middle" fill="#7a5535">插排 40</text><line x1="148" y1="146" x2="182" y2="146" stroke="#c8763a" stroke-width="3"/><polygon points="194,146 182,139 182,153" fill="#c8763a"/><rect x="198" y="106" width="150" height="80" rx="10" fill="#ffffff" stroke="#c8763a" stroke-width="2"/><text x="273" y="136" font-size="15" text-anchor="middle" fill="#7a4315">WHERE 价格小于 50</text><text x="273" y="160" font-size="14" text-anchor="middle" fill="#7a5535">真或假，逐行判</text><line x1="352" y1="118" x2="390" y2="86" stroke="#c8763a" stroke-width="2"/><polygon points="396,82 383,85 389,94" fill="#c8763a"/><line x1="352" y1="174" x2="390" y2="206" stroke="#8a8f99" stroke-width="2"/><polygon points="396,210 383,207 389,198" fill="#8a8f99"/><rect x="400" y="52" width="212" height="64" rx="10" fill="#ffffff" stroke="#2f8c5f" stroke-width="2"/><text x="506" y="78" font-size="15" text-anchor="middle" fill="#1f5c3e">真的行：算 SET 表达式</text><text x="506" y="100" font-size="14" text-anchor="middle" fill="#3f6b57">价格加 5，然后写回</text><rect x="400" y="184" width="212" height="64" rx="10" fill="#ffffff" stroke="#8a8f99" stroke-width="2"/><text x="506" y="210" font-size="15" text-anchor="middle" fill="#56606b">假的行：一个字节不动</text><text x="506" y="232" font-size="14" text-anchor="middle" fill="#6d7782">照样被扫到，只是跳过</text><text x="320" y="258" font-size="14" text-anchor="middle" fill="#7a5535">表达式读的是旧行，写回的是新值；同一条 SET 里两列同时按旧值算</text></svg>`, caption: `盯着那两行被扫到却没改的记录：它们解释了为什么改 2 行也要扫全表。` },
        { t: `h2`, text: `演示：先用 SELECT 预演，再动手改` },
        { t: `code`, lang: `text`, code: `CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER);
INSERT INTO products VALUES
  (1, '铅笔', 10), (2, '钢笔', 60), (3, '台灯', 150), (4, '插排', 40);
SELECT id, name, price FROM products WHERE price < 50;
UPDATE products SET price = price + 5 WHERE price < 50;
SELECT id, name, price FROM products WHERE price < 50;` },
        { t: `p`, text: `第一条 SELECT 先报出会动的是铅笔和插排两行；改完再查，价格变成 15 和 45，钢笔与台灯没被碰。把 WHERE 原样从 SELECT 抄到 UPDATE，是这个动作里最值钱的习惯。` },
        { t: `code`, lang: `text`, code: `CREATE TABLE price_fix (name TEXT PRIMARY KEY, price INTEGER);
INSERT INTO price_fix VALUES ('铅笔', 12), ('台灯', 140);
UPDATE products
SET price = (SELECT price FROM price_fix WHERE name = products.name)
WHERE name IN (SELECT name FROM price_fix);
SELECT id, name, price FROM products ORDER BY id;` },
        { t: `p`, text: `结果四行：12、60、140、45 —— 前一条 UPDATE 给插排加的 5 块还在。SET 右边那个括号是标量子查询，每个被改的行都会拿自己的 name 去映射表里找一次；末尾的 WHERE 把范围限死在映射表有的名字上，少了它，找不到对应行的商品会被刷成 NULL，而且一声不吭。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `WHERE 写漏。写 UPDATE 前先把同一段 WHERE 放进 SELECT 跑一遍，看清行数再改。`,
          `以为 SET 从左到右生效，写 SET a = b, b = a 想交换却拿到两个 b。规则是同时按旧值算，正好能用来交换。`,
          `子查询没配上行时返回 NULL，把整列悄悄刷成 NULL。要么加 WHERE 限定范围，要么把列设成 NOT NULL 让它当场报错。`,
          `只惦记 WHERE，忘了约束。新值违反 UNIQUE、CHECK、外键时，整条语句失败，一行都不改。`,
          `改完不核对行数。sqlite3 里用 SELECT changes() 看刚才改了几行，0 行基本等于 WHERE 写错。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `给 products 加一列 stock，用一条 UPDATE 把 NULL 全设成 0，再用 SELECT 核对。`,
          `把 price 低于 50 的商品提价 10%，改前先 SELECT 行数和价格，改后报出 changes()。`,
          `照着演示建 price_fix，用子查询改两个商品的价格；再删掉末尾的 WHERE，把 SET 写成 SELECT 看会算出什么，说出后果。`,
          `写一条语句交换 products 两列的值（自己先加一列备用），插一行数据验证交换成功。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：UPDATE 先把每行拿 WHERE 过一遍，再用旧值算新值；条件先用 SELECT 验一遍，比改完再修便宜得多。` }
      ]
    },
    {
      id: `d16`, title: `第 16 课 · 删除数据：DELETE`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：删掉该删的行而不碰别的，知道外键级联会把删除带到哪，并看懂软删除为什么能保住历史、又要多付什么代价。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `DELETE FROM 表 WHERE 条件。它和 UPDATE 一样逐行过 WHERE，为真的行被标记删除，语句结束时整批生效。删的是行，不是表结构：表还在、索引还在、约束还在，只是里面的数据没了。想连表一起干掉是 DROP TABLE，两个动作别混。` },
        { t: `p`, text: `没有 WHERE 的 DELETE 清空整张表。默认的 rowid 表清空后再插会从 1 重新编号，声明了 AUTOINCREMENT 才会接着往下走；文件也不会立刻缩小。SQLite 只是把这些页标成可复用，要真正把空间还给操作系统得跑 VACUUM，而它不能在事务中间跑。` },
        { t: `p`, text: `外键是删除最容易出事的地方。子表的列写成 REFERENCES 父表(id)，删父行时默认拒绝，前提是当前连接打开了 PRAGMA foreign_keys = ON；写了 ON DELETE CASCADE，子行跟着一起删；写了 ON DELETE SET NULL，子行的外键列被置空。级联不弹确认，一条 DELETE 可能带走一串。另一种思路是软删除：不删行，只把 deleted_at 写上时间，所有查询统一加 WHERE deleted_at IS NULL。历史保住了，代价是每条查询都得记得这个条件。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `p`, text: `清掉测试数据、注销账号时连带他的文章和评论、下架商品但留档、误删前先看看会删到几行。前三个是业务动作，最后一个纯属自保 —— 删除没有撤销键，先 SELECT 数一遍比任何技巧都值钱。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="10" y="10" width="620" height="260" rx="14" fill="#fbeeee"/><text x="320" y="38" font-size="18" font-weight="700" text-anchor="middle" fill="#7a2b2b">删一个作者，级联把链上的书一起带走</text><rect x="30" y="58" width="150" height="58" rx="10" fill="#ffffff" stroke="#b04545" stroke-width="2"/><text x="105" y="82" font-size="15" text-anchor="middle" fill="#7a2b2b">authors</text><text x="105" y="103" font-size="14" text-anchor="middle" fill="#8a5555">阿岚 id=1</text><line x1="184" y1="87" x2="218" y2="87" stroke="#b04545" stroke-width="3"/><polygon points="230,87 218,80 218,94" fill="#b04545"/><rect x="234" y="58" width="150" height="58" rx="10" fill="#ffffff" stroke="#b04545" stroke-width="2"/><text x="309" y="82" font-size="15" text-anchor="middle" fill="#7a2b2b">books</text><text x="309" y="103" font-size="14" text-anchor="middle" fill="#8a5555">author_id=1 的两本</text><line x1="388" y1="87" x2="422" y2="87" stroke="#b04545" stroke-width="3"/><polygon points="434,87 422,80 422,94" fill="#b04545"/><rect x="438" y="58" width="170" height="58" rx="10" fill="#ffffff" stroke="#b04545" stroke-width="2"/><text x="523" y="82" font-size="15" text-anchor="middle" fill="#7a2b2b">一起消失</text><text x="523" y="103" font-size="14" text-anchor="middle" fill="#8a5555">SQL 小册 索引笔记</text><rect x="30" y="146" width="150" height="58" rx="10" fill="#ffffff" stroke="#8a8f99" stroke-width="2"/><text x="105" y="170" font-size="15" text-anchor="middle" fill="#56606b">authors</text><text x="105" y="191" font-size="14" text-anchor="middle" fill="#6d7782">小北 id=2</text><rect x="234" y="146" width="150" height="58" rx="10" fill="#ffffff" stroke="#8a8f99" stroke-width="2"/><text x="309" y="170" font-size="15" text-anchor="middle" fill="#56606b">books</text><text x="309" y="191" font-size="14" text-anchor="middle" fill="#6d7782">author_id=2 的两本</text><text x="486" y="181" font-size="14" text-anchor="middle" fill="#56606b">没被点名的行不动</text><text x="320" y="238" font-size="14" text-anchor="middle" fill="#7a2b2b">前提是这行连接执行过 PRAGMA foreign_keys = ON；否则子行会留成没有作者的孤儿</text></svg>`, caption: `上面一排是级联删掉的两本书，下面一排是没被碰的那位作者的书。` },
        { t: `h2`, text: `演示：先数行数，再决定删谁` },
        { t: `code`, lang: `text`, code: `CREATE TABLE authors (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT, author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE);
INSERT INTO authors VALUES (1, '阿岚'), (2, '小北');
INSERT INTO books VALUES
  (1, 'SQL 小册', 1), (2, '索引笔记', 1),
  (3, '事务漫谈', 2), (4, '查询练习', 2);
PRAGMA foreign_keys = ON;
DELETE FROM authors WHERE id = 1;
SELECT id, title FROM books ORDER BY id;` },
        { t: `p`, text: `books 只剩 3 和 4 两行 —— 阿岚名下的两本书跟着父行一起没了。PRAGMA 那行要在事务开始之前执行，写在事务中间会被静默忽略；不打开它，REFERENCES 就只是一句注释，删父行时子行会留成孤儿。` },
        { t: `code`, lang: `text`, code: `ALTER TABLE books ADD COLUMN deleted_at TEXT;
UPDATE books SET deleted_at = datetime('now') WHERE id = 3;
SELECT id, title FROM books WHERE deleted_at IS NULL;
SELECT COUNT(*) AS rows_left FROM books;` },
        { t: `p`, text: `软删除跑完，看得见的是「查询练习」一行，表的实际行数还是 2。这一行没消失，只是被条件挡住了；哪天要做「回收站」，把条件反过来就是。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `DELETE 忘写 WHERE，整张表清空。先拿同一段 WHERE 跑 SELECT 数行数，是最便宜的保险。`,
          `以为写了 REFERENCES 就会级联。外键检查默认是关的，每个连接都要 PRAGMA foreign_keys = ON，它不存进库文件。`,
          `删空表后指望自增 id 接着原来的号。没有 AUTOINCREMENT 时表空了就从 1 重来，要接着往下走得显式声明它。`,
          `软删除只用在一半查询里，旧数据从别的入口漏出来。要么所有读路径统一加条件，要么包成视图。`,
          `删了父行才发现子行悬空，后面的 JOIN 悄悄丢行。建表时就把级联动作想好。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `先用 SELECT 数出阿岚名下的书有几本，再删父行，核对 books 剩几行、少的是哪几本。`,
          `把 ON DELETE CASCADE 换成 ON DELETE SET NULL（重建表再搬数据），删一次父行，看子行的 author_id 变成什么。`,
          `给 books 做软删除，写两条查询：一条只看没删的，一条统计已经删掉的数量。`,
          `比较 DELETE FROM books 和 DROP TABLE books 之后再重建：数据、表结构、自增计数各发生什么。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：DELETE 删行不删表，外键加 PRAGMA 决定它删到哪儿；想留档就软删除，但每条查询都要带上那个条件。` }
      ]
    },
    {
      id: `d17`, title: `第 17 课 · 建表与约束：主键，外键，唯一，非空`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把「这列不许空、这列不许重复、这行必须指向一个存在的父行」写成表结构的一部分，让数据库替你把关。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `CREATE TABLE 表名（列名 类型 约束，列名 类型 约束，...）。SQLite 的类型是「亲和性」：INTEGER 列塞进字符串会试着转成数字，TEXT 列塞进数字会转成文本。类型栏更像约定，真想严格得靠约束和 CHECK，或者声明 STRICT 表。` },
        { t: `p`, text: `约束各管一件事。PRIMARY KEY 唯一标识一行，INTEGER PRIMARY KEY 直接就是 rowid，插入不给值会自动编号；UNIQUE 不许重复，但允许多个 NULL；NOT NULL 不许空；CHECK 是一个布尔表达式，每次插入或更新都得为真；DEFAULT 在没给值时接手。外键 REFERENCES 父表(列) 保证子行指向存在的父行，但 SQLite 默认不检查，必须每个连接 PRAGMA foreign_keys = ON。` },
        { t: `p`, text: `约束是数据库替你守的门。违反的那条语句整体失败，表里一行都不变 —— 这比在 Python 里写十个 if 可靠：绕过程序、直接用别的客户端改库的路径也堵住了。代价是插入多做几次检查，改约束也麻烦：ALTER TABLE 只能加列、改名、删列，想改约束得「建新表、搬数据、换名」。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `p`, text: `建 users 时让邮箱唯一、名字长度有限；建 posts 时保证每篇文章都有作者；建订单时保证数量不为负、状态只在几个值里选。这些规则写进表结构之后，插入和更新的代码能省掉一半校验，而且换谁来写都绕不过去。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240"><rect x="10" y="10" width="620" height="220" rx="14" fill="#f0f4fb"/><text x="320" y="36" font-size="18" font-weight="700" text-anchor="middle" fill="#243b5a">新行进表之前要过四道检查，哪道不过整条语句作废</text><rect x="22" y="88" width="96" height="56" rx="10" fill="#ffffff" stroke="#3a5f8a" stroke-width="2"/><text x="70" y="112" font-size="15" text-anchor="middle" fill="#243b5a">一行新值</text><text x="70" y="132" font-size="14" text-anchor="middle" fill="#4a6178">待插入</text><line x1="120" y1="116" x2="142" y2="116" stroke="#3a5f8a" stroke-width="2"/><polygon points="150,116 140,110 140,122" fill="#3a5f8a"/><rect x="152" y="94" width="78" height="44" rx="8" fill="#ffffff" stroke="#3a5f8a" stroke-width="2"/><text x="191" y="121" font-size="14" text-anchor="middle" fill="#243b5a">非空</text><line x1="232" y1="116" x2="252" y2="116" stroke="#3a5f8a" stroke-width="2"/><polygon points="260,116 250,110 250,122" fill="#3a5f8a"/><rect x="262" y="94" width="78" height="44" rx="8" fill="#ffffff" stroke="#3a5f8a" stroke-width="2"/><text x="301" y="121" font-size="14" text-anchor="middle" fill="#243b5a">唯一</text><line x1="342" y1="116" x2="362" y2="116" stroke="#3a5f8a" stroke-width="2"/><polygon points="370,116 360,110 360,122" fill="#3a5f8a"/><rect x="372" y="94" width="78" height="44" rx="8" fill="#ffffff" stroke="#3a5f8a" stroke-width="2"/><text x="411" y="121" font-size="14" text-anchor="middle" fill="#243b5a">表达式</text><line x1="452" y1="116" x2="472" y2="116" stroke="#3a5f8a" stroke-width="2"/><polygon points="480,116 470,110 470,122" fill="#3a5f8a"/><rect x="482" y="94" width="78" height="44" rx="8" fill="#ffffff" stroke="#3a5f8a" stroke-width="2"/><text x="521" y="121" font-size="14" text-anchor="middle" fill="#243b5a">外键</text><line x1="562" y1="116" x2="580" y2="116" stroke="#3a5f8a" stroke-width="2"/><polygon points="588,116 578,110 578,122" fill="#3a5f8a"/><rect x="590" y="88" width="34" height="56" rx="8" fill="#dfe9f6" stroke="#3a5f8a" stroke-width="2"/><text x="607" y="121" font-size="15" text-anchor="middle" fill="#243b5a">表</text><text x="191" y="166" font-size="14" text-anchor="middle" fill="#4a6178">NOT NULL</text><text x="301" y="166" font-size="14" text-anchor="middle" fill="#4a6178">UNIQUE</text><text x="411" y="166" font-size="14" text-anchor="middle" fill="#4a6178">CHECK</text><text x="521" y="166" font-size="14" text-anchor="middle" fill="#4a6178">REFERENCES</text><text x="320" y="204" font-size="14" text-anchor="middle" fill="#4a6178">PRIMARY KEY 是「唯一 + 非空」的组合；外键那道门要连接里 PRAGMA 打开才通电</text></svg>`, caption: `顺着箭头看一遍：任何一道闸落下，这一行就回不去。` },
        { t: `h2`, text: `演示：把规则写进表里` },
        { t: `code`, lang: `text`, code: `PRAGMA foreign_keys = ON;
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 20),
  age INTEGER CHECK (age >= 0),
  joined TEXT NOT NULL DEFAULT (date('now')));
INSERT INTO users (email, name, age) VALUES ('a@example.com', '阿岚', 20);` },
        { t: `p`, text: `这一行成功了，joined 自动填上当天的日期，id 是 1。下面四条故意犯规，看每一道门分别报什么。` },
        { t: `code`, lang: `text`, code: `CREATE TABLE posts (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '');
INSERT INTO users (email, name) VALUES ('a@example.com', '小北');
INSERT INTO users (email, name, age) VALUES ('b@example.com', '小北', -1);
INSERT INTO posts (user_id, title) VALUES (99, '没有作者的文章');
SELECT id, email, name, age, joined FROM users;` },
        { t: `p`, text: `三条报错依次是 UNIQUE constraint failed: users.email、CHECK constraint failed（年龄为负）、FOREIGN KEY constraint failed。前两条在写值的时候就拦下，第三条要等 PRAGMA 把外键打开才生效。最后那条 SELECT 只有阿岚一行 —— 失败的三条一行都没进去。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `以为写了 REFERENCES 就会检查。SQLite 默认关外键，每个连接 PRAGMA foreign_keys = ON，而且这条命令在事务中间不生效。`,
          `指望类型严格。INTEGER 列能塞进字符串；要严格就声明 STRICT 表，或者用 CHECK 兜底。`,
          `以为 UNIQUE 只允许一个 NULL。SQLite 里多个 NULL 不算重复，想禁空要另外加 NOT NULL。`,
          `CHECK 里引用别的行或表。CHECK 只能看本行的值，跨表规则得靠外键或触发器。`,
          `建完表才想改约束。ALTER TABLE 改不了，只能建新表搬数据再换名。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `建一张 books 表：title 非空、price 不小于 0、isbn 唯一，再给每条规则各插一行违规数据，抄下报错。`,
          `不写 PRAGMA 直接删父行，再打开 PRAGMA 重做一次，比较两次子行的数量。`,
          `用 CHECK 限死 status 只能是 draft 或 published，插入第三种值试试。`,
          `把 users 的 joined 列去掉 DEFAULT 再插一行（重建表），看它变成什么值。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：约束是写进表结构的规则，违反就整条失败；SQLite 的外键还要每个连接自己打开。` }
      ]
    },
    {
      id: `d18`, title: `第 18 课 · 索引：为什么查得快`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：看懂全表扫描和走索引在代价上的差别，会建普通索引和复合索引，会用 EXPLAIN QUERY PLAN 验证，也知道什么时候不该建。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `没有索引时，按条件查一行只能从头扫到尾，这叫全表扫描，成本跟行数成正比。索引是另外维护的一份有序结构，SQLite 用 B 树：中间节点只放指路的值，叶子放键和行位置。查一个值时从根往下走，每层砍掉一大片，几百万行也只有三四层，所以「查得快」不是魔法，是层数少。` },
        { t: `p`, text: `CREATE INDEX 名字 ON 表(列)。之后这一列上的等值和范围查询就能走它。复合索引按列顺序排，所以 (user, action) 能服务「只查 user」和「user 加 action」，单独查 action 用不上 —— 这就是最左前缀。查询要的列全在索引里时，连表都不用回，叫覆盖索引，计划里会写 COVERING INDEX。` },
        { t: `p`, text: `索引不是白拿的：每个索引都占空间，每次插入、更新、删除都要同步维护，写多读少的表上建一堆纯亏。行数很少的表全扫更快；区分度低的列，比如只有两个取值的状态，建了也砍不掉几行。判断办法只有一个：拿 EXPLAIN QUERY PLAN 看它到底走不走。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `p`, text: `按邮箱登录、按时间翻最近的订单、按用户查他一个人的日志，这些查询的共同点是「表很大，只要一小撮」。索引把「一小撮」从扫全部变成走几条边。反过来，统计全表总和、导出所有数据这种本来就要碰每一行的查询，索引帮不上忙。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="10" y="10" width="620" height="280" rx="14" fill="#f3f1fa"/><text x="320" y="38" font-size="18" font-weight="700" text-anchor="middle" fill="#3d3060">B 树三层就能定位：根挑区间，分支再挑，叶子拿到行</text><rect x="250" y="56" width="140" height="46" rx="8" fill="#ffffff" stroke="#6a55a8" stroke-width="2"/><text x="320" y="84" font-size="15" text-anchor="middle" fill="#3d3060">根：u0 到 u199</text><line x1="300" y1="104" x2="180" y2="134" stroke="#6a55a8" stroke-width="2"/><line x1="320" y1="104" x2="320" y2="134" stroke="#6a55a8" stroke-width="2"/><line x1="340" y1="104" x2="460" y2="134" stroke="#6a55a8" stroke-width="2"/><rect x="120" y="138" width="120" height="42" rx="8" fill="#ffffff" stroke="#6a55a8" stroke-width="2"/><text x="180" y="164" font-size="14" text-anchor="middle" fill="#3d3060">u0 到 u66</text><rect x="260" y="138" width="120" height="42" rx="8" fill="#ffffff" stroke="#6a55a8" stroke-width="2"/><text x="320" y="164" font-size="14" text-anchor="middle" fill="#3d3060">u67 到 u133</text><rect x="400" y="138" width="120" height="42" rx="8" fill="#ffffff" stroke="#6a55a8" stroke-width="2"/><text x="460" y="164" font-size="14" text-anchor="middle" fill="#3d3060">u134 到 u199</text><line x1="150" y1="182" x2="110" y2="212" stroke="#6a55a8" stroke-width="2"/><line x1="180" y1="182" x2="160" y2="212" stroke="#c8763a" stroke-width="3"/><line x1="210" y1="182" x2="250" y2="212" stroke="#6a55a8" stroke-width="2"/><rect x="80" y="216" width="60" height="34" rx="6" fill="#ffffff" stroke="#6a55a8" stroke-width="2"/><text x="110" y="239" font-size="14" text-anchor="middle" fill="#3d3060">u7</text><rect x="146" y="216" width="60" height="34" rx="6" fill="#f6e7d6" stroke="#c8763a" stroke-width="3"/><text x="176" y="239" font-size="14" text-anchor="middle" fill="#7a4315">u70</text><rect x="212" y="216" width="60" height="34" rx="6" fill="#ffffff" stroke="#6a55a8" stroke-width="2"/><text x="242" y="239" font-size="14" text-anchor="middle" fill="#3d3060">u90</text><text x="320" y="278" font-size="14" text-anchor="middle" fill="#5a4a80">计划里写 SEARCH 就是走了这棵树；写 SCAN 就是从第一行摸到最后一行</text></svg>`, caption: `橙色那条是查 u70 的路径：三层，碰三个节点，剩下的键一次都不碰。` },
        { t: `h2`, text: `演示：先看计划，再建索引` },
        { t: `code`, lang: `text`, code: `CREATE TABLE logs (id INTEGER PRIMARY KEY, user TEXT NOT NULL, action TEXT NOT NULL);
INSERT INTO logs (user, action)
SELECT 'u' || (n % 200), 'login'
FROM (WITH RECURSIVE c(n) AS (
  SELECT 1 UNION ALL SELECT n + 1 FROM c WHERE n < 2000
) SELECT n FROM c);
EXPLAIN QUERY PLAN SELECT * FROM logs WHERE user = 'u7';` },
        { t: `p`, text: `插进去两千行，计划那一行写的是 SCAN logs：数据库准备从第一行摸到最后一行。加一个索引再看。` },
        { t: `code`, lang: `text`, code: `CREATE INDEX idx_logs_user ON logs(user);
EXPLAIN QUERY PLAN SELECT * FROM logs WHERE user = 'u7';
EXPLAIN QUERY PLAN SELECT * FROM logs WHERE action = 'login';
CREATE INDEX idx_logs_user_action ON logs(user, action);
EXPLAIN QUERY PLAN SELECT user, action FROM logs WHERE user = 'u7';` },
        { t: `p`, text: `三行计划依次是 SEARCH logs USING INDEX idx_logs_user (user=?)、SCAN logs、SEARCH logs USING COVERING INDEX idx_logs_user_action (user=?)。第二行说明索引只服务被建索引的那一列，action 上的查询照样全扫；第三行说明要的列全在索引里时，数据库干脆不进表。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `给每一列都建索引。写变慢、库变大，查询优化器还不一定选它。`,
          `在列上套函数：WHERE lower(email) = ... 用不上 email 的普通索引，除非建表达式索引。`,
          `LIKE 以通配符开头。'%abc' 这种前后都模糊的条件，索引插不上手。`,
          `复合索引顺序反了，把区分度低的列放在最前面，最左前缀就废了。`,
          `建完不验证。凭感觉以为用上了，实际计划里还是 SCAN。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `用两千行的 logs 表，在建索引前后各跑一次 EXPLAIN QUERY PLAN，把两行计划原文抄下来。`,
          `建一个 (action, user) 复合索引，分别测 WHERE action = 和 WHERE user =，解释哪一个走不上。`,
          `写一条只取 user 和 action 的查询，让计划里出现 COVERING INDEX。`,
          `举一个不该建索引的场景（行数少、区分度低、写多读少），说出理由，并用计划或行数支撑它。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：索引是排好序的旁路表，B 树几层就定位一行；建不建、走不走，看 EXPLAIN QUERY PLAN 说话。` }
      ]
    },
    {
      id: `d19`, title: `第 19 课 · 事务：要么全成，要么全不成`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把几条必须一起成功的语句包进一个事务，知道 COMMIT 和 ROLLBACK 各改了什么，并看懂锁和隔离为什么是它的副作用。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `默认情况下每条语句自己就是一个事务：执行完自动提交，出错自动回滚。BEGIN 开始一个显式事务，之后的改动先攒着，COMMIT 一次性落盘，ROLLBACK 全部作废。事务的价值不在语法，在于「一组改动是一件事」：转账的扣钱和加钱必须一起成功，只成一半比都不做更糟。` },
        { t: `p`, text: `ACID 四个字母拆开看：原子性，要么全成要么全不成；一致性，提交时所有约束都成立；隔离性，别的事务看到的要么是事务前、要么是事务后，看不到中间态；持久性，提交之后断电也不丢。SQLite 同一时刻只允许一个写事务，写锁是库级的：一个连接在写，另一个连接来写就得排队，等太久会报 database is locked。` },
        { t: `p`, text: `隔离的直觉很简单：读的人在提交前看到的仍是旧数据。SQLite 默认按串行化处理，WAL 模式下读不挡写、写不挡读，但写者仍然只有一个。最要命的是长事务：它一直攥着锁，别的东西全排队。所以事务里只放必须一起成功的语句，别在里面等网络、等输入、等用户点确认。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `p`, text: `转账、下单扣库存、批量导入一半失败要全撤、先改再看结果再决定提交还是回滚。凡是「中间状态被别人看见会出事」的动作，都该有一个事务边界；反过来，一条独立的插入没必要包事务，它本来就是原子的。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="10" y="10" width="620" height="260" rx="14" fill="#eef7f7"/><text x="320" y="38" font-size="18" font-weight="700" text-anchor="middle" fill="#1f4f4f">事务边界：COMMIT 之前，外面的人只看见旧值</text><line x1="40" y1="112" x2="600" y2="112" stroke="#2f7c7c" stroke-width="3"/><circle cx="60" cy="112" r="7" fill="#2f7c7c"/><text x="60" y="94" font-size="15" text-anchor="middle" fill="#1f4f4f">BEGIN</text><rect x="92" y="86" width="128" height="52" rx="8" fill="#ffffff" stroke="#2f7c7c" stroke-width="2"/><text x="156" y="108" font-size="14" text-anchor="middle" fill="#1f4f4f">扣 100 元</text><text x="156" y="128" font-size="14" text-anchor="middle" fill="#5a7a7a">只改内存页</text><rect x="248" y="86" width="128" height="52" rx="8" fill="#ffffff" stroke="#2f7c7c" stroke-width="2"/><text x="312" y="108" font-size="14" text-anchor="middle" fill="#1f4f4f">加 100 元</text><text x="312" y="128" font-size="14" text-anchor="middle" fill="#5a7a7a">只改内存页</text><circle cx="420" cy="112" r="7" fill="#2f7c7c"/><line x1="420" y1="112" x2="440" y2="78" stroke="#2f7c7c" stroke-width="2"/><line x1="420" y1="112" x2="440" y2="146" stroke="#b04545" stroke-width="2"/><rect x="446" y="40" width="168" height="62" rx="10" fill="#ffffff" stroke="#2f8c5f" stroke-width="2"/><text x="530" y="66" font-size="15" text-anchor="middle" fill="#1f5c3e">COMMIT</text><text x="530" y="88" font-size="14" text-anchor="middle" fill="#3f6b57">两条一起落盘</text><rect x="446" y="128" width="168" height="62" rx="10" fill="#ffffff" stroke="#b04545" stroke-width="2"/><text x="530" y="154" font-size="15" text-anchor="middle" fill="#7a2b2b">ROLLBACK</text><text x="530" y="176" font-size="14" text-anchor="middle" fill="#8a5555">两条一起作废</text><rect x="92" y="196" width="284" height="52" rx="10" fill="#ffffff" stroke="#8a8f99" stroke-width="2"/><text x="234" y="218" font-size="14" text-anchor="middle" fill="#56606b">另一个连接在这段时间里查账户</text><text x="234" y="240" font-size="14" text-anchor="middle" fill="#56606b">读到的还是旧余额，中间态不可见</text><line x1="378" y1="222" x2="470" y2="222" stroke="#8a8f99" stroke-width="2"/><polygon points="482,222 470,216 470,228" fill="#8a8f99"/><text x="556" y="226" font-size="14" text-anchor="middle" fill="#56606b">提交后才换</text></svg>`, caption: `盯住分叉那一点：同一串改动，唯一的区别是最后一步选了哪边。` },
        { t: `h2`, text: `演示：两条 UPDATE 是一件事` },
        { t: `code`, lang: `text`, code: `CREATE TABLE accounts (id INTEGER PRIMARY KEY, name TEXT, balance INTEGER NOT NULL);
INSERT INTO accounts VALUES (1, '阿岚', 500), (2, '小北', 300);
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
SELECT * FROM accounts;` },
        { t: `p`, text: `两条更新要么都成功要么都不生效，查询出来是两个 400。COMMIT 之前，别的连接读到的还是 500 和 300。` },
        { t: `code`, lang: `text`, code: `BEGIN;
UPDATE accounts SET balance = balance - 500 WHERE id = 1;
UPDATE accounts SET balance = balance + 500 WHERE id = 2;
ROLLBACK;
SELECT * FROM accounts;` },
        { t: `p`, text: `第一句就把阿岚扣到负 100，第二句加到 800，ROLLBACK 之后两个账户还是两个 400。中间那个「钱凭空少了一笔」的状态，从来没被任何人看见过。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `开了 BEGIN 忘了 COMMIT 或 ROLLBACK。连接断开时事务自动回滚，你以为写进去了，其实没有。`,
          `Python 的 sqlite3 旧默认模式会在 INSERT 前悄悄开事务，手动 BEGIN 就报 cannot start a transaction within a transaction。要么先 commit，要么把 isolation_level 设成 None 自己控制。`,
          `事务里等输入、等网络。锁一直不放，别人全卡住，等到超时一起报 database is locked。`,
          `以为建表删表不在事务里。SQLite 的 CREATE、DROP 也能回滚。`,
          `拿 ROLLBACK 当撤销键用。它撤的是整个事务，不是上一条语句。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `用 accounts 演示转账：先 COMMIT 一次，再开一个事务扣 500 后 ROLLBACK，对比两次余额。`,
          `在事务中间故意插一条违反 CHECK 的语句，看报错之后、COMMIT 之前表里是什么状态。`,
          `开两个 sqlite3 连接，一个 BEGIN 并改一行不提交，另一个去改同一行，记录等多久、报什么。`,
          `挑一个你熟悉的业务动作，把它拆成必须一起成功的几条语句，标出事务的起点和终点。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：事务把几条语句绑成一件不可分割的事，提交才生效、回滚就全退，锁和隔离都是这件事的副作用。` }
      ]
    },
    {
      id: `d20`, title: `第 20 课 · 视图：把常用查询存起来`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把一条常用查询存成视图，当表一样查，知道它每次都会重算、默认只读，也能干净地删掉。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `CREATE VIEW 名字 AS 一句 SELECT。视图不存数据，存的是那句查询的文本；每次查视图，数据库把定义展开再跑一遍。所以基表变了，视图结果立刻跟着变 —— 它是一扇窗，不是一张快照。` },
        { t: `p`, text: `用处有三个：把常用的大查询存起来给所有人用；把一串 JOIN 藏在一个短名字后面；只暴露部分列，当作最粗的一层权限边界。视图还能套视图，但一层套一层之后执行计划会变长，排错时得顺着定义一层层拆开看。` },
        { t: `p`, text: `视图默认只读。UPDATE、INSERT、DELETE 打到视图上会报 cannot modify ... because it is a view；想让它可写，得挂 INSTEAD OF 触发器，把动作翻译到基表上。触发器后面单独一课讲，这里先记住限制在哪儿。DROP VIEW 名字 只删视图定义，基表和数据一点不动。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `p`, text: `把「文章 + 作者 + 评论数」存成 post_stats，报表和页面都查它；把「本月的有效订单」存成视图，统计脚本不用每次重写 WHERE；把 users 表里的密码列藏起来，只给外面看 id、名字、注册时间。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 270"><rect x="10" y="10" width="620" height="250" rx="14" fill="#f5f2ea"/><text x="320" y="36" font-size="18" font-weight="700" text-anchor="middle" fill="#5a4a20">视图是一扇窗：框住三张表的连接，自己不留数据</text><rect x="26" y="66" width="118" height="46" rx="8" fill="#ffffff" stroke="#8a7430" stroke-width="2"/><text x="85" y="94" font-size="14" text-anchor="middle" fill="#5a4a20">users</text><rect x="26" y="124" width="118" height="46" rx="8" fill="#ffffff" stroke="#8a7430" stroke-width="2"/><text x="85" y="152" font-size="14" text-anchor="middle" fill="#5a4a20">posts</text><rect x="26" y="182" width="118" height="46" rx="8" fill="#ffffff" stroke="#8a7430" stroke-width="2"/><text x="85" y="210" font-size="14" text-anchor="middle" fill="#5a4a20">comments</text><line x1="148" y1="90" x2="196" y2="120" stroke="#8a7430" stroke-width="2"/><line x1="148" y1="146" x2="196" y2="146" stroke="#8a7430" stroke-width="2"/><line x1="148" y1="204" x2="196" y2="172" stroke="#8a7430" stroke-width="2"/><rect x="200" y="92" width="200" height="110" rx="10" fill="#ffffff" stroke="#c8763a" stroke-width="3"/><text x="300" y="118" font-size="15" text-anchor="middle" fill="#7a4315">post_stats</text><text x="300" y="142" font-size="14" text-anchor="middle" fill="#8a6235">只存这句 SELECT 的文本</text><text x="300" y="164" font-size="14" text-anchor="middle" fill="#8a6235">标题 作者 评论数</text><text x="300" y="186" font-size="14" text-anchor="middle" fill="#8a6235">每次查询重新展开</text><line x1="404" y1="146" x2="452" y2="146" stroke="#8a7430" stroke-width="3"/><polygon points="464,146 452,139 452,153" fill="#8a7430"/><rect x="468" y="112" width="148" height="68" rx="10" fill="#ffffff" stroke="#2f8c5f" stroke-width="2"/><text x="542" y="140" font-size="15" text-anchor="middle" fill="#1f5c3e">SELECT 查它</text><text x="542" y="162" font-size="14" text-anchor="middle" fill="#3f6b57">拿到当下的结果</text><path d="M300 202 C300 236 420 236 468 214" fill="none" stroke="#2f8c5f" stroke-width="2" stroke-dasharray="6 5"/><text x="384" y="250" font-size="14" text-anchor="middle" fill="#5a4a20">窗框不会留下昨天的风景：基表一改，下一次查就是新结果</text></svg>`, caption: `三张表都通向中间那个框，而框本身只记着「怎么连」，不记结果。` },
        { t: `h2`, text: `演示：把常用查询存成名字` },
        { t: `code`, lang: `text`, code: `CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE posts (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, title TEXT NOT NULL);
CREATE TABLE comments (id INTEGER PRIMARY KEY, post_id INTEGER NOT NULL, body TEXT NOT NULL);
INSERT INTO users VALUES (1, '阿岚'), (2, '小北');
INSERT INTO posts VALUES (1, 1, 'CTE 入门'), (2, 2, '索引直觉'), (3, 1, '事务边界');
INSERT INTO comments (post_id, body) VALUES
  (1, '有用'), (1, '收藏了'), (2, '图很清楚');
CREATE VIEW post_stats AS
SELECT p.id, p.title, u.name AS author, COUNT(c.id) AS comments
FROM posts p JOIN users u ON u.id = p.user_id
LEFT JOIN comments c ON c.post_id = p.id
GROUP BY p.id;` },
        { t: `p`, text: `视图建好之后，原来那一大段 JOIN 就变成了一个名字。注意 LEFT JOIN：没有评论的文章也要出现，评论数记 0，换成普通 JOIN 会把它整行丢掉。` },
        { t: `code`, lang: `text`, code: `SELECT * FROM post_stats ORDER BY comments DESC, id;
UPDATE post_stats SET title = 'x' WHERE id = 1;
DROP VIEW post_stats;
SELECT * FROM post_stats;` },
        { t: `p`, text: `第一条查出三行：CTE 入门 2 条评论、索引直觉 1 条、事务边界 0 条。第二条被拒绝，报 cannot modify post_stats because it is a view。DROP 之后再查，视图名字已经不存在，三张基表原封不动。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `以为视图存了数据。改完基表发现视图跟着变，不是缓存失效，是它从来就没存过结果。`,
          `拿视图当缓存用。复杂视图每次查询都重跑定义，把慢查询换个名字还是慢。`,
          `改基表的列名或删列，视图定义还挂着旧名字，下次查询直接报错。`,
          `直接 UPDATE 视图，忘了它默认只读。`,
          `视图套视图三四层，EXPLAIN 出来一大坨，出问题找不到是哪一层。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `建一个只含 id、title、author 的视图，查一次；再给 posts 插一行，重查，确认结果变了。`,
          `试着 UPDATE 视图，抄下报错；然后 DROP 视图，确认 users 和 posts 里的数据都在。`,
          `建一个视图算每位作者的文章数，分别用视图和直接写 GROUP BY 各查一次，比较两段 SQL 的长度。`,
          `把 post_stats 改成只统计评论数大于 0 的文章，再把过滤放到外面查，说出两种做法结果差在哪。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：视图是存下来的查询，查一次算一次；它省的是重复劳动，不是运行时间。` }
      ]
    },
    {
      id: `d21`, title: `第 21 课 · 触发器：让数据库自己动手`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：在插入、更新、删除发生的前后挂一段 SQL，用它给标题变更记审计日志，并知道 NEW 和 OLD 各在什么时候有值。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `触发器是一段挂在表上的 SQL，某个动作发生时由数据库自己执行。写法是 CREATE TRIGGER 名字 BEFORE 或 AFTER INSERT 或 UPDATE 或 DELETE ON 表 FOR EACH ROW BEGIN 若干语句 END。BEFORE 在行被写之前跑，能看见准备写入的值，也能用 RAISE 中止整个动作；AFTER 在写完之后跑，适合记日志、同步另一张表。` },
        { t: `p`, text: `触发器里能引用 OLD 和 NEW：UPDATE 两个都有，DELETE 只有 OLD，INSERT 只有 NEW。FOR EACH ROW 意味着一句 UPDATE 改了多少行，触发器体就跑多少次。触发器和引发它的语句在同一个事务里，触发器报错，整条语句一起回滚。` },
        { t: `p`, text: `适合它的场景很窄：审计日志、维护汇总列、强制一条跨表规则。不适合把业务主体塞进来 —— 逻辑藏在数据库里，读代码的人看不见，调试只能靠猜。触发器里再改同一张表还可能递归，SQLite 的 recursive_triggers 默认关着，但别拿这个默认值当保险。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `p`, text: `想知道谁在什么时候把标题改成了什么，又不想在每个更新入口都手写一遍日志；每插一条评论就让帖子的评论计数加一；删掉一篇文章时顺手清掉它的标签。这些「顺带发生」的事，正是触发器擅长的地方。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="10" y="10" width="620" height="260" rx="14" fill="#f4f1f7"/><text x="320" y="36" font-size="18" font-weight="700" text-anchor="middle" fill="#453257">一条 UPDATE 走完，触发器在写表前后各插了一脚</text><rect x="22" y="92" width="104" height="56" rx="8" fill="#ffffff" stroke="#6b4f8a" stroke-width="2"/><text x="74" y="116" font-size="14" text-anchor="middle" fill="#453257">UPDATE 到来</text><text x="74" y="136" font-size="14" text-anchor="middle" fill="#6b5a80">逐行匹配</text><line x1="130" y1="120" x2="154" y2="120" stroke="#6b4f8a" stroke-width="2"/><polygon points="162,120 152,114 152,126" fill="#6b4f8a"/><rect x="166" y="82" width="112" height="76" rx="8" fill="#ffffff" stroke="#c8763a" stroke-width="2"/><text x="222" y="106" font-size="14" text-anchor="middle" fill="#7a4315">BEFORE 触发器</text><text x="222" y="128" font-size="14" text-anchor="middle" fill="#8a6235">能看 OLD 和 NEW</text><text x="222" y="148" font-size="14" text-anchor="middle" fill="#8a6235">能拦下整个动作</text><line x1="282" y1="120" x2="306" y2="120" stroke="#6b4f8a" stroke-width="2"/><polygon points="314,120 304,114 304,126" fill="#6b4f8a"/><rect x="318" y="92" width="96" height="56" rx="8" fill="#ffffff" stroke="#6b4f8a" stroke-width="2"/><text x="366" y="116" font-size="14" text-anchor="middle" fill="#453257">写进 posts</text><text x="366" y="136" font-size="14" text-anchor="middle" fill="#6b5a80">这一行落定</text><line x1="418" y1="120" x2="442" y2="120" stroke="#6b4f8a" stroke-width="2"/><polygon points="450,120 440,114 440,126" fill="#6b4f8a"/><rect x="454" y="82" width="112" height="76" rx="8" fill="#ffffff" stroke="#2f8c5f" stroke-width="2"/><text x="510" y="106" font-size="14" text-anchor="middle" fill="#1f5c3e">AFTER 触发器</text><text x="510" y="128" font-size="14" text-anchor="middle" fill="#3f6b57">OLD 是旧值</text><text x="510" y="148" font-size="14" text-anchor="middle" fill="#3f6b57">NEW 是新值</text><line x1="510" y1="162" x2="510" y2="188" stroke="#2f8c5f" stroke-width="2"/><polygon points="510,196 504,186 516,186" fill="#2f8c5f"/><rect x="426" y="200" width="168" height="52" rx="8" fill="#ffffff" stroke="#2f8c5f" stroke-width="2"/><text x="510" y="222" font-size="14" text-anchor="middle" fill="#1f5c3e">往 audit 表插一行</text><text x="510" y="244" font-size="14" text-anchor="middle" fill="#3f6b57">和主语句同一个事务</text><text x="180" y="230" font-size="14" text-anchor="middle" fill="#6b5a80">FOR EACH ROW：改 3 行就跑 3 次</text></svg>`, caption: `顺序是固定的：BEFORE 在最前，AFTER 在写表之后，谁失败整条语句都退回去。` },
        { t: `h2`, text: `演示：给标题变更记一笔账` },
        { t: `code`, lang: `text`, code: `CREATE TABLE posts (id INTEGER PRIMARY KEY, title TEXT NOT NULL);
CREATE TABLE audit (
  id INTEGER PRIMARY KEY,
  post_id INTEGER,
  old_title TEXT,
  new_title TEXT,
  at TEXT NOT NULL DEFAULT (datetime('now'))
);
INSERT INTO posts VALUES (1, '旧标题'), (2, '不动的标题');` },
        { t: `p`, text: `audit 只记「谁从什么变成了什么」，不存完整副本。下面挂一个只在标题真的变了时才动手的触发器。` },
        { t: `code`, lang: `text`, code: `CREATE TRIGGER posts_title_audit
AFTER UPDATE OF title ON posts
FOR EACH ROW
WHEN OLD.title <> NEW.title
BEGIN
  INSERT INTO audit (post_id, old_title, new_title)
  VALUES (OLD.id, OLD.title, NEW.title);
END;
UPDATE posts SET title = '新标题' WHERE id = 1;
UPDATE posts SET title = '不动的标题' WHERE id = 2;
SELECT id, post_id, old_title, new_title FROM audit;` },
        { t: `p`, text: `两条 UPDATE 都执行了，audit 里只有一行：第一条真的改了标题，第二条写回原值被 WHEN 挡掉。UPDATE OF title 还限定只有 SET 里点到 title 才触发，改别的列不惊动它。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `忘了 FOR EACH ROW。SQLite 只支持行级触发器，不写这句建不起来。`,
          `触发器里再改同一张表，指望连锁反应。递归触发器默认关着，实际行为跟你想的不一样。`,
          `触发器体里少写分号或 END，整条 CREATE TRIGGER 都建不起来。`,
          `触发器自己报错，把业务语句一起拖下水。写审计触发器时别让必填列有机会为空。`,
          `业务规则埋进触发器，半年后没人记得它存在。规则优先写在应用层，触发器只做旁路。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `给 posts 建一个 AFTER DELETE 触发器，把被删的标题写进 audit，删一行验证。`,
          `把演示里的 WHEN 去掉，再跑两条 UPDATE，比较 audit 的行数。`,
          `建一个 AFTER INSERT 触发器，让另一张计数表自动加一，连插三行看结果。`,
          `在触发器体里故意写一条会失败的语句，观察引发它的 UPDATE 是否整体回滚。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：触发器是挂在表上的自动动作，BEFORE 能拦、AFTER 适合记账，它和主语句同生共死。` }
      ]
    },
    {
      id: `d22`, title: `第 22 课 · 范式与设计：别把一张表塞满`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：认出「同一个事实存了好几份」的表，用 1NF、2NF、3NF 三条规则把它拆开，也知道什么时候该故意留冗余。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `范式是检查一张表有没有把不该放一起的东西放一起的规则。1NF 要求每列只放一个值，不能把「铅笔,本子」塞进一个格子；2NF 在复合主键下要求每个非主属性依赖完整的键，而不是只依赖其中一列；3NF 再要求非主属性之间不能互相依赖，别让客户城市跟着客户住在订单表里。` },
        { t: `p`, text: `违反的代价是三类异常。插入异常：新客户还没下单，就没地方存他的城市。更新异常：同一个客户的城市在五行里，改三行漏两行，报表立刻对不上。删除异常：删掉最后一张订单，把客户信息也一起删了。拆表就是把重复的那部分拿出来，只留一个 id 指过去。` },
        { t: `p`, text: `范式不是越拆越好。每拆一次，查询就多一次 JOIN；报表、历史快照、读多写少的展示页，故意留一些冗余反而更快更简单。判断标准是有没有「一处改、处处要跟着改」的字段：有就拆；没有，而且冗余由谁在哪一步维护说得清楚，就留着。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `p`, text: `订单表里客户名和城市重复几十次，就该拆出 customers；订单行里的成交价每个都存一份，这是有意的历史快照，不该跟着商品表变；文章里存作者名，作者改名后旧文章还显示旧名字，可能正是你要的。同一个「重复」，三种结论，区别在它是不是活的事实。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="10" y="10" width="620" height="280" rx="14" fill="#eef4ee"/><text x="320" y="36" font-size="18" font-weight="700" text-anchor="middle" fill="#274a2c">一张宽表拆成三张：重复的客户信息只留一份</text><rect x="22" y="58" width="200" height="150" rx="10" fill="#ffffff" stroke="#b04545" stroke-width="2"/><text x="122" y="82" font-size="15" text-anchor="middle" fill="#7a2b2b">拆分前的 big 表</text><line x1="32" y1="92" x2="212" y2="92" stroke="#c9a0a0" stroke-width="1"/><text x="122" y="112" font-size="14" text-anchor="middle" fill="#6d4a4a">订单 1 阿岚 杭州 铅笔</text><text x="122" y="136" font-size="14" text-anchor="middle" fill="#6d4a4a">订单 1 阿岚 杭州 本子</text><text x="122" y="160" font-size="14" text-anchor="middle" fill="#6d4a4a">订单 2 小北 成都 台灯</text><text x="122" y="190" font-size="14" text-anchor="middle" fill="#b04545">阿岚和杭州出现两次</text><line x1="226" y1="110" x2="286" y2="76" stroke="#2f8c5f" stroke-width="2"/><polygon points="294,72 281,73 287,83" fill="#2f8c5f"/><line x1="226" y1="132" x2="286" y2="132" stroke="#2f8c5f" stroke-width="2"/><polygon points="296,132 284,126 284,138" fill="#2f8c5f"/><line x1="226" y1="158" x2="286" y2="190" stroke="#2f8c5f" stroke-width="2"/><polygon points="294,194 281,193 287,183" fill="#2f8c5f"/><rect x="300" y="44" width="150" height="56" rx="8" fill="#ffffff" stroke="#2f8c5f" stroke-width="2"/><text x="375" y="68" font-size="15" text-anchor="middle" fill="#1f5c3e">customers</text><text x="375" y="90" font-size="14" text-anchor="middle" fill="#3f6b57">id 姓名 城市</text><rect x="300" y="110" width="150" height="50" rx="8" fill="#ffffff" stroke="#2f8c5f" stroke-width="2"/><text x="375" y="132" font-size="15" text-anchor="middle" fill="#1f5c3e">orders</text><text x="375" y="152" font-size="14" text-anchor="middle" fill="#3f6b57">id customer_id</text><rect x="300" y="170" width="150" height="56" rx="8" fill="#ffffff" stroke="#2f8c5f" stroke-width="2"/><text x="375" y="194" font-size="15" text-anchor="middle" fill="#1f5c3e">items</text><text x="375" y="216" font-size="14" text-anchor="middle" fill="#3f6b57">订单 商品 单价 数量</text><text x="530" y="86" font-size="14" text-anchor="middle" fill="#3f6b57">改城市只改一行</text><text x="530" y="136" font-size="14" text-anchor="middle" fill="#3f6b57">一行订单只指一个人</text><text x="530" y="196" font-size="14" text-anchor="middle" fill="#3f6b57">每行只记一笔货</text><text x="320" y="264" font-size="14" text-anchor="middle" fill="#274a2c">代价写在明处：查一次明细从零次 JOIN 变成两次 JOIN</text></svg>`, caption: `看左边那两行重复的「阿岚 杭州」，拆完之后它只剩在 customers 里的一份。` },
        { t: `h2`, text: `演示：先看异常怎么发生，再拆` },
        { t: `code`, lang: `text`, code: `CREATE TABLE big (order_id INTEGER, customer TEXT, city TEXT,
  product TEXT, price INTEGER, qty INTEGER,
  PRIMARY KEY (order_id, product));
INSERT INTO big VALUES
  (1, '阿岚', '杭州', '铅笔', 10, 3),
  (1, '阿岚', '杭州', '本子', 20, 1),
  (2, '小北', '成都', '台灯', 150, 1);
UPDATE big SET city = '苏州' WHERE order_id = 1 AND product = '铅笔';
SELECT order_id, customer, city FROM big;` },
        { t: `p`, text: `同一个客户，同一张表里出现了苏州和杭州两个城市 —— 更新异常就长这样：改了一行，另一行没跟上。删掉订单 2 也很危险，小北和成都只存在于这一行里，删完就再也找不回来。` },
        { t: `code`, lang: `text`, code: `CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, city TEXT NOT NULL);
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL REFERENCES customers(id));
CREATE TABLE items (order_id INTEGER NOT NULL REFERENCES orders(id), product TEXT NOT NULL,
  price INTEGER NOT NULL, qty INTEGER NOT NULL, PRIMARY KEY (order_id, product));
INSERT INTO customers VALUES (1, '阿岚', '杭州'), (2, '小北', '成都');
INSERT INTO orders VALUES (1, 1), (2, 2);
INSERT INTO items VALUES (1, '铅笔', 10, 3), (1, '本子', 20, 1), (2, '台灯', 150, 1);
SELECT o.id, c.name, i.product, i.price * i.qty AS amount
FROM items i JOIN orders o ON o.id = i.order_id
JOIN customers c ON c.id = o.customer_id
ORDER BY o.id, i.product;` },
        { t: `p`, text: `三行结果：订单 1 的本子 20、铅笔 30，订单 2 的台灯 150。城市只存一份，删订单不会碰到客户；要拿明细就 join 回来，多写两行 JOIN，换掉了三类异常。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `背得出 1NF、2NF、3NF 的定义，拿到表却看不出问题。入口永远是那句：同一个事实是不是存了好几份。`,
          `把 3NF 当铁律，一张小表拆成五张，每个查询四个 JOIN，读的人先累死。`,
          `主键选成「姓名加日期」这种会变的组合，2NF 都难满足，改一次名全表跟着动。`,
          `把多个值塞进一个格子，用逗号分隔的标签冒充一列。查询、统计、删一个都难受。`,
          `冗余字段没人维护，价格快照和当前价混着用，报表永远对不上。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `给 big 表再加一行同客户不同城市的订单，说明更新异常会怎么发生、要改几行才对。`,
          `把 big 拆成三张表，写出「查每位客户消费总额」的查询，比较拆前拆后各写了几行。`,
          `找一个适合故意冗余的例子（比如订单行里的成交价），说明它由谁在哪一步写入、为什么不跟着商品表变。`,
          `设计一张「学生-课程-成绩」表，判断它到第几范式，再拆到 3NF。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：范式拆的是重复的事实，不是表本身；拆到不用为一处修改付两次账就够，多余的拆和多余的冗余一样贵。` }
      ]
    },
    {
      id: `d23`, title: `第 23 课 · SQL 注入与安全：参数化查询`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：看明白字符串拼接为什么等于把用户输入当代码执行，把查询改成参数化写法，并知道标识符、权限和校验各挡在哪一层。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `SQL 是代码，用户输入是数据。用字符串拼接把输入塞进语句，等于让用户往代码里写代码。输入 ' OR '1'='1 时，WHERE name = '' OR '1'='1' 恒为真，整张表都被查出来；换成 UNION SELECT，还能把别的表读走，在允许一次跑多条语句的驱动里甚至能接上 DROP TABLE。` },
        { t: `p`, text: `参数化查询把语句和数据分开传：SQL 文本里只留一个占位符 ?，值作为另一个参数交给驱动，驱动保证它只被当成值，不会被解析成语法。Python 的 sqlite3 用 ? 或命名参数 :name，第二个参数传元组或字典。这是唯一可靠的办法，不是「更安全一点」的写法。` },
        { t: `p`, text: `表名、列名不能参数化 —— 占位符只能替值。要按用户选的列排序，只能在白名单里映射：程序里写死 id、title、created 三个允许值，用户传什么都在里面挑，挑不到就用默认。另外两层：数据库账号只给需要的权限，别用能 DROP 的账号跑网页；输入校验限制长度和字符集，但校验是第二道门，不是替代品。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `p`, text: `登录、搜索、按参数排序、按 id 查详情，凡是把外部输入带进 SQL 的地方都用得上。参数化之后，引号、分号、注释符在值里都只是普通字符，不用再数有几个单引号、要不要转义。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="10" y="10" width="620" height="280" rx="14" fill="#f4f0f0"/><text x="320" y="34" font-size="18" font-weight="700" text-anchor="middle" fill="#5a2a2a">拼接让数据挤进代码通道，参数化让它永远走另一条</text><text x="24" y="70" font-size="15" fill="#7a2b2b">拼接</text><rect x="24" y="80" width="130" height="40" rx="6" fill="#ffffff" stroke="#b04545" stroke-width="2"/><text x="89" y="105" font-size="14" text-anchor="middle" fill="#7a2b2b">输入文本</text><rect x="24" y="130" width="130" height="40" rx="6" fill="#ffffff" stroke="#b04545" stroke-width="2"/><text x="89" y="155" font-size="14" text-anchor="middle" fill="#7a2b2b">SQL 文本</text><line x1="154" y1="100" x2="190" y2="120" stroke="#b04545" stroke-width="2"/><line x1="154" y1="150" x2="190" y2="130" stroke="#b04545" stroke-width="2"/><rect x="196" y="100" width="140" height="50" rx="6" fill="#ffffff" stroke="#b04545" stroke-width="2"/><text x="266" y="130" font-size="14" text-anchor="middle" fill="#7a2b2b">拼成一条字符串</text><line x1="340" y1="125" x2="380" y2="125" stroke="#b04545" stroke-width="2"/><polygon points="392,125 380,119 380,131" fill="#b04545"/><rect x="396" y="96" width="120" height="58" rx="8" fill="#ffffff" stroke="#b04545" stroke-width="2"/><text x="456" y="120" font-size="14" text-anchor="middle" fill="#7a2b2b">解析器</text><text x="456" y="142" font-size="14" text-anchor="middle" fill="#7a2b2b">把输入当语法</text><text x="548" y="130" font-size="14" text-anchor="middle" fill="#b04545">中招</text><text x="24" y="212" font-size="15" fill="#1f5c3e">参数化</text><rect x="24" y="222" width="130" height="40" rx="6" fill="#ffffff" stroke="#2f8c5f" stroke-width="2"/><text x="89" y="247" font-size="14" text-anchor="middle" fill="#1f5c3e">SQL 文本带 ?</text><rect x="24" y="268" width="130" height="24" rx="6" fill="#ffffff" stroke="#2f8c5f" stroke-width="2"/><text x="89" y="285" font-size="14" text-anchor="middle" fill="#1f5c3e">输入文本</text><line x1="154" y1="242" x2="380" y2="200" stroke="#2f8c5f" stroke-width="2"/><polygon points="392,196 379,197 385,207" fill="#2f8c5f"/><line x1="154" y1="278" x2="250" y2="262" stroke="#2f8c5f" stroke-width="2"/><rect x="396" y="176" width="120" height="58" rx="8" fill="#ffffff" stroke="#2f8c5f" stroke-width="2"/><text x="456" y="200" font-size="14" text-anchor="middle" fill="#1f5c3e">解析器</text><text x="456" y="222" font-size="14" text-anchor="middle" fill="#1f5c3e">只看见占位符</text><rect x="254" y="248" width="104" height="34" rx="8" fill="#ffffff" stroke="#2f8c5f" stroke-width="2"/><text x="306" y="270" font-size="14" text-anchor="middle" fill="#1f5c3e">绑定值</text><line x1="360" y1="264" x2="392" y2="248" stroke="#2f8c5f" stroke-width="2"/><polygon points="400,244 387,245 393,255" fill="#2f8c5f"/><text x="548" y="212" font-size="14" text-anchor="middle" fill="#2f8c5f">值只当值</text></svg>`, caption: `上下两条路的分岔口：数据是在解析之前就混进代码，还是解析之后才绑上去。` },
        { t: `h2`, text: `演示：同一个输入，两种写法` },
        { t: `code`, lang: `python`, code: `import sqlite3

conn = sqlite3.connect("shop.db")
name = input("用户名：")
sql = "SELECT id, name FROM users WHERE name = '" + name + "'"
for row in conn.execute(sql):
    print(row)` },
        { t: `p`, text: `输入 ' OR '1'='1，这条语句变成 WHERE name = '' OR '1'='1'，两行用户全被查出来；换成 UNION SELECT，还能把别的表读走。问题不在输入长什么样，在于它进了 SQL 文本。` },
        { t: `code`, lang: `python`, code: `import sqlite3

conn = sqlite3.connect("shop.db")
name = input("用户名：")
sql = "SELECT id, name FROM users WHERE name = ?"
for row in conn.execute(sql, (name,)):
    print(row)` },
        { t: `p`, text: `同一个输入，这次一行都没有；输入正常用户名才查得到那一行。? 只被当成「这里放一个值」，元组里的内容再怪也进不了语法。多条参数就多几个 ?，按顺序放进元组。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `以为把单引号替换成两个就安全。数字型参数、LIKE 通配符、编码问题都能绕，手写转义迟早漏。`,
          `用 f-string、百分号或 format 拼 SQL，本质和加号拼接一样。`,
          `想参数化表名或列名。占位符只能替值，标识符只能用白名单。`,
          `数据库账号权限过大，注入成功一次就能删库、读走所有表。`,
          `把 ORM 当护身符。ORM 里手写原生 SQL 再拼接，一样中招。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `在临时库里用拼接版查询跑输入 ' OR '1'='1，数一数返回几行；再换参数版，对比结果。`,
          `写一个按用户选的列排序的函数，只允许 id、title、created 三个值，其他输入退回 id。`,
          `用参数化写一条带 LIKE 的搜索，说明百分号应该拼在值里还是拼进 SQL 文本。`,
          `给你练习用的库列一张「应用账号最少需要的权限」清单，多一个都说不出理由的就删掉。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：SQL 文本里只留占位符，值永远走参数通道；标识符进不了参数通道，只能用白名单。` }
      ]
    },
    {
      id: `d24`, title: `第 24 课 · 小项目：设计一个博客库并用 Python 读写`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把前面二十几课合成一个能用的博客库：四张表、一套约束、一批样例数据、一条页面查询，再用 Python 把增删改查跑通。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `先把需求落成四张表。users 存作者；posts 存文章，用 user_id 指向作者；comments 存评论，同时指向文章和作者；tags 存标签，用 (post_id, name) 当复合主键。关系是：一个用户多篇文章，一篇文章多条评论，一篇文章多个标签。外键把关系写死，ON DELETE CASCADE 保证删用户时他的文章、评论、标签一起走。` },
        { t: `p`, text: `建表顺序有讲究：被引用的表先建。users 最先，posts 依赖它，comments 依赖 posts 和 users，tags 依赖 posts。默认值也要顺手给上：joined 默认今天，created 默认当前时间，body 默认空串。约束一写，后面 Python 里的校验代码能省一半。` },
        { t: `p`, text: `查询从页面需要什么倒推：首页要文章标题、作者名、评论数，按评论数排序；文章页要标签拼接；作者页要他的文章列表。Python 这边用 sqlite3 连接，写操作包在 with conn 里：正常退出自动提交，抛异常自动回滚。所有值走 ? 占位符。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `p`, text: `一个最小但完整的博客：三个作者、三篇文章、三条评论、四个标签。首页、文章页、作者页的查询都能从这四张表拼出来；想加「点赞」就再建一张表指向 posts，想加「草稿」就给 posts 加一个 status 列。骨架立住了，功能是往上挂的事。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="10" y="10" width="620" height="280" rx="14" fill="#eef2f8"/><text x="320" y="34" font-size="18" font-weight="700" text-anchor="middle" fill="#243b5a">四张表的关系：所有箭头都指向被引用的主键</text><rect x="34" y="58" width="150" height="72" rx="10" fill="#ffffff" stroke="#3a5f8a" stroke-width="2"/><text x="109" y="84" font-size="15" text-anchor="middle" fill="#243b5a">users</text><text x="109" y="106" font-size="14" text-anchor="middle" fill="#4a6178">id 主键</text><text x="109" y="124" font-size="14" text-anchor="middle" fill="#4a6178">name 唯一</text><rect x="262" y="58" width="170" height="86" rx="10" fill="#ffffff" stroke="#3a5f8a" stroke-width="2"/><text x="347" y="84" font-size="15" text-anchor="middle" fill="#243b5a">posts</text><text x="347" y="106" font-size="14" text-anchor="middle" fill="#4a6178">id 主键</text><text x="347" y="124" font-size="14" text-anchor="middle" fill="#4a6178">user_id 外键</text><rect x="484" y="58" width="126" height="86" rx="10" fill="#ffffff" stroke="#3a5f8a" stroke-width="2"/><text x="547" y="84" font-size="15" text-anchor="middle" fill="#243b5a">comments</text><text x="547" y="106" font-size="14" text-anchor="middle" fill="#4a6178">post_id</text><text x="547" y="124" font-size="14" text-anchor="middle" fill="#4a6178">user_id</text><rect x="262" y="196" width="170" height="66" rx="10" fill="#ffffff" stroke="#3a5f8a" stroke-width="2"/><text x="347" y="222" font-size="15" text-anchor="middle" fill="#243b5a">tags</text><text x="347" y="244" font-size="14" text-anchor="middle" fill="#4a6178">post_id 加 name 做主键</text><line x1="184" y1="94" x2="258" y2="94" stroke="#3a5f8a" stroke-width="2"/><polygon points="270,94 258,88 258,100" fill="#3a5f8a"/><text x="226" y="84" font-size="14" text-anchor="middle" fill="#4a6178">1 对多</text><line x1="432" y1="94" x2="480" y2="94" stroke="#3a5f8a" stroke-width="2"/><polygon points="492,94 480,88 480,100" fill="#3a5f8a"/><text x="462" y="84" font-size="14" text-anchor="middle" fill="#4a6178">1 对多</text><line x1="347" y1="148" x2="347" y2="192" stroke="#3a5f8a" stroke-width="2"/><polygon points="347,204 341,192 353,192" fill="#3a5f8a"/><text x="395" y="174" font-size="14" text-anchor="middle" fill="#4a6178">1 对多</text><path d="M184 112 C220 170 420 170 520 148" fill="none" stroke="#8a8f99" stroke-width="2" stroke-dasharray="6 5"/><text x="470" y="192" font-size="14" text-anchor="middle" fill="#56606b">评论者也可以是作者之一</text><text x="266" y="286" font-size="14" text-anchor="middle" fill="#4a6178">外键列名带 _id，指向另一张表的主键；级联删除沿箭头反向走</text></svg>`, caption: `先认箭头：谁引用谁、一对多在哪边，写 JOIN 时脑子里就有这张图。` },
        { t: `h2`, text: `演示：建库、灌样例、用 Python 读写` },
        { t: `code`, lang: `text`, code: `CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE,
  joined TEXT NOT NULL DEFAULT (date('now')));
CREATE TABLE posts (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL, body TEXT NOT NULL DEFAULT '', created TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE comments (id INTEGER PRIMARY KEY, post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, body TEXT NOT NULL);
CREATE TABLE tags (post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  name TEXT NOT NULL, PRIMARY KEY (post_id, name));
INSERT INTO users (name) VALUES ('阿岚'), ('小北'), ('老周');
INSERT INTO posts (user_id, title, body) VALUES (1, 'CTE 是什么', '把查询拆成几步'), (1, '索引为什么快', 'B 树只有几层'), (2, '事务的边界', 'COMMIT 之前都不算');
INSERT INTO comments (post_id, user_id, body) VALUES (1, 2, '看懂了'), (1, 3, '图不错'), (2, 2, '收藏');
INSERT INTO tags (post_id, name) VALUES (1, 'SQL'), (1, '入门'), (2, '索引'), (3, '事务');` },
        { t: `p`, text: `四张表建完，样例也进去了：三篇文章、三条评论、四个标签。tags 的主键是 (post_id, name)，同一篇文章贴两次同样的标签会被直接拒绝，这就是复合主键的用处。` },
        { t: `code`, lang: `python`, code: `import sqlite3
conn = sqlite3.connect("blog.db")
sql = ("SELECT p.title, u.name, COUNT(c.id) AS n"
       " FROM posts p JOIN users u ON u.id = p.user_id"
       " LEFT JOIN comments c ON c.post_id = p.id"
       " GROUP BY p.id ORDER BY n DESC")
for row in conn.execute(sql):
    print(row[0], row[1], row[2])
with conn:
    cur = conn.execute("INSERT INTO posts (user_id, title) VALUES (?, ?)", (1, "新文章"))
    conn.execute("UPDATE posts SET title = ? WHERE id = ?", ("改过的标题", cur.lastrowid))
    conn.execute("DELETE FROM posts WHERE id = ?", (cur.lastrowid,))` },
        { t: `p`, text: `先打印三行：CTE 是什么 / 阿岚 / 2、索引为什么快 / 阿岚 / 1、事务的边界 / 小北 / 0。然后同一个连接里插入、改名、删除一条新文章，三条语句都在 with conn 里，最后一起提交；中途任何一条抛异常，整个块回滚。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `先建 posts 再建 users，外键指向一张还不存在的表。被引用的表永远先建。`,
          `标签用逗号串存在文章表的一列里，查「带 SQL 标签的文章」只能 LIKE 猜。`,
          `删用户前忘了开 PRAGMA foreign_keys，文章和评论留成孤儿，页面照样能打开，只是作者显示空白。`,
          `Python 里用字符串拼接 SQL，前面刚讲完的注入原样搬进项目。`,
          `把 with conn 当成装饰，实际自己又 commit 一次，出错时事务早提交了一半。`
        ] },
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `照演示把四张表建好，插进你自己的三篇文章，然后用 JOIN 查「每篇文章的作者和评论数」。`,
          `写一条查询，用 GROUP_CONCAT 把每篇文章的标签拼成一行，按文章 id 排序。`,
          `给 posts 加一列 status（draft 或 published，默认 draft），用 CHECK 限死取值，再查所有已发布的文章。`,
          `用 Python 做一个循环菜单：列出文章、新增文章、改标题、删文章，全部走参数化，退出时提交。`
        ] },
        { t: `tip`, color: `green`, text: `本课一句话：四张表、几根外键、一套约束撑起一个博客；查询从页面倒推，写入永远参数化。` }
      ]
    }
  ]
};
