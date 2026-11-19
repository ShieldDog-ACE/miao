/* 喵站 · Python 掌握 分部 p2：第 13–24 课
 * 只放 chapters，元信息由 pyds-data.js 装配。代码块都用 python3 实跑过。 */
window.MIAO_PYDS_P2 = {
  chapters: [
    {
      id: `p13`, title: `第 13 课 · 哈希表（二）：冲突了怎么办`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：在上一课的哈希表上补冲突处理，写清拉链法与开放寻址的插入、查找、删除，并知道扩容时为什么要重哈希。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `哈希函数把键算成一个桶号，桶的数量有限，键却可能无限多，所以两个键落到同一个桶不是意外，是必然。第 12 课只算了桶号，没处理撞车。处理撞车只有两条路：拉链法让一个桶装下多个键，开放寻址在数组里另找空位。` },
        { t: `p`, text: `拉链法把每个桶做成一条链，链上存键值对。插入时先算桶号，再在链上逐个比键：碰到相同的键就改值，走到底没有就追加。查找只扫这一条链；删除就是把节点从链上摘掉，别的桶完全不动。链一长，查找就从常数级退化成线性，所以要盯住装载因子，也就是元素数除以桶数；超过阈值就申请约两倍大的桶数组，把每个键重新算桶号搬过去，这一步叫重哈希。` },
        { t: `p`, text: `开放寻址法不挂链，所有元素都住在同一个数组里。撞车了就按固定步长往后探，找到空位插入；查找沿同一条路径走，碰到空位就说明不存在。删除不能直接把格子清空，否则探到这里的后续键会被空位截断，必须留一个墓碑标记：插入可以复用它，查找要继续越过它。它省掉了链表的指针，数据连续，但装得越满越容易连成一片，查找步数跟着变长。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `统计一段文字里每个词出现几次，键是词，值是次数。`,
          `判断一个用户名是否已经注册过，只看在不在。`,
          `给编译器的变量名建符号表，按名字查类型。`,
          `给缓存做索引，先按键找到存放位置。`
        ]},
        { t: `h2`, text: `演示 1 · 拉链法：三个键挤进同一个桶` },
        { t: `p`, text: `桶数取 4，键取 1、5、9。它们对 4 取余都等于 1，所以全落在 1 号桶。put 在链上找不到相同的键就追加，get 只扫这条链，找不到就返回默认值。` },
        { t: `code`, lang: `python`, code: `def put(t, k, v):
    b = t[k % len(t)]
    for p in b:
        if p[0] == k: p[1] = v; return
    b.append([k, v])
def get(t, k, d=None):
    for p in t[k % len(t)]:
        if p[0] == k: return p[1]
    return d
t = [[] for _ in range(4)]
for k in [1, 5, 9]: put(t, k, k * 10)
print(t, get(t, 9), get(t, 5), get(t, 7, "无"))` },
        { t: `p`, text: `打印出来能看到 1 号桶挂着三条记录，其余三个桶是空的。get 在链上命中 9 和 5，查 7 时走完整条链没找到，返回「无」。链的长度就是最坏情况下的比较次数。` },
        { t: `h2`, text: `演示 2 · 删除与扩容重哈希` },
        { t: `p`, text: `删除只是在链上把那一项摘掉，桶本身还在。重哈希新建一个更大的桶数组，把旧表里每个键按新桶数重新取模，再挂到新链上；旧下标全部作废。` },
        { t: `code`, lang: `python`, code: `def drop(t, k):
    b = t[k % len(t)]
    for i, p in enumerate(b):
        if p[0] == k: b.pop(i); return True
def rehash(old, n):
    new = [[] for _ in range(n)]
    for b in old:
        for k, v in b: new[k % n].append((k, v))
    return new
t = [[], [(1, 10), (5, 50)], [], [(3, 30)]]
print(drop(t, 5), drop(t, 8))
big = rehash(t, 8); print(t, len(big), big[1], big[3])` },
        { t: `p`, text: `5 号键被摘掉后 drop 返回 True，再删 8 返回 None，表示没找到。重哈希后只剩 1 和 3 两条记录，分别落在 1 号和 3 号桶；桶数翻倍，链的平均长度减半。注意 drop 没找到时没有返回值，所以打印的是 None。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="24" y="24" width="592" height="232" rx="14" fill="#eef6f4"/><text x="170" y="58" font-size="18" font-weight="700" text-anchor="middle" fill="#173d36">拉链法：桶里挂链</text><text x="470" y="58" font-size="18" font-weight="700" text-anchor="middle" fill="#173d36">开放寻址：往后找空位</text><rect x="56" y="80" width="76" height="36" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="94" y="105" font-size="15" text-anchor="middle" fill="#4d6f67">0 号桶</text><rect x="56" y="126" width="76" height="36" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="94" y="151" font-size="15" text-anchor="middle" fill="#173d36">1 号桶</text><rect x="56" y="172" width="76" height="36" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="94" y="197" font-size="15" text-anchor="middle" fill="#4d6f67">2 号桶</text><rect x="56" y="218" width="76" height="36" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="94" y="243" font-size="15" text-anchor="middle" fill="#4d6f67">3 号桶</text><rect x="176" y="122" width="64" height="44" rx="6" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="208" y="150" font-size="15" text-anchor="middle" fill="#173d36">键 1</text><rect x="252" y="122" width="64" height="44" rx="6" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="284" y="150" font-size="15" text-anchor="middle" fill="#173d36">键 5</text><rect x="328" y="122" width="64" height="44" rx="6" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="360" y="150" font-size="15" text-anchor="middle" fill="#173d36">键 9</text><path d="M132 144H172" stroke="#2a8c78" stroke-width="2.5"/><path d="M240 144H248" stroke="#2a8c78" stroke-width="2.5"/><path d="M316 144H324" stroke="#2a8c78" stroke-width="2.5"/><rect x="430" y="80" width="44" height="40" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="452" y="106" font-size="15" text-anchor="middle" fill="#4d6f67">空</text><rect x="478" y="80" width="44" height="40" rx="6" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="500" y="106" font-size="15" text-anchor="middle" fill="#173d36">1</text><rect x="526" y="80" width="44" height="40" rx="6" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="548" y="106" font-size="15" text-anchor="middle" fill="#173d36">9</text><rect x="574" y="80" width="44" height="40" rx="6" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="596" y="106" font-size="15" text-anchor="middle" fill="#173d36">17</text><text x="452" y="150" font-size="15" fill="#4d6f67">0 号</text><text x="500" y="150" font-size="15" fill="#4d6f67">1 号</text><text x="548" y="150" font-size="15" fill="#4d6f67">2 号</text><text x="596" y="150" font-size="15" fill="#4d6f67">3 号</text><text x="452" y="196" font-size="15" fill="#173d36">1、9、17 都算到 1 号</text><text x="452" y="222" font-size="15" fill="#173d36">就依次占 1、2、3 号格</text></svg>`, caption: `左边同一个桶挂成链，右边冲突后按顺序往后探；两条路都在解决桶不够分的问题。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `扩容时只换了桶数组，忘了把旧数据重新取模，键再也找不到。`,
          `开放寻址删除时直接把格子置空，后面的键查找被空位截断，应该留墓碑。`,
          `以为 hash 值就是下标，忘了对桶数取模；桶数一变，旧下标全作废。`,
          `拿列表、字典这类可变对象当键，内容一改哈希值就变，存进去取不出来。`,
          `字符串的哈希值在每个进程里可能不同，别把某个桶号写死进测试。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `给拉链法补一个 size 方法，插入 6 个键、删除 2 个，打印剩余数量和每条链的长度。`,
          `把桶数从 4 改成 3，重新插入 1 到 10，打印每条链的长度，比较 3 和 4 哪个更均匀。`,
          `用开放寻址法实现插入与查找，键取 0 到 9，打印最终数组并标出墓碑的位置。`,
          `写一张 rehash 前后的桶号对照表，指出哪些键换了桶、哪些没换。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：冲突不可免，拉链把桶变链、开放寻址往后找空位；扩容重哈希是为了让链重新变短。` }
      ]
    },
    {
      id: `p14`, title: `第 14 课 · 集合：只留独一份`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用哈希表写一个只存键的集合，实现 add、contains、remove，会用它去重，并写出交、并、差的最小版本。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `集合是只有键、没有值的哈希表。第 13 课的桶里存键值对，这里每条链只存一个元素。add 先算桶号，再看元素在不在链上：在就什么也不做，不在才追加。这一步的「在就跳过」就是去重，重复的元素根本没有第二次机会占位置。` },
        { t: `p`, text: `contains 和 remove 走同一条路径：算桶号、扫那条链、逐个比较。命中就返回，不命中就结束。因为只在一条链上找，平均比较次数是链的平均长度，而不是元素总数。链的长短取决于桶数和哈希是否均匀，这一点和上一课的字典完全一样。` },
        { t: `p`, text: `集合运算可以全用 contains 拼出来：交集是遍历其中一个集合，另一个 contains 才留下；并集是复制一个集合，再把另一个的元素逐个 add；差集是复制一个，把另一个的元素逐个 remove。Python 内置的 set 还提供子集判断和对称差，手写版先把这三个最小的写通，就明白它们为什么比双重循环快一个量级。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `给一列标签去重，只留出现过的不重复值。`,
          `维护黑名单，判断某个编号在不在里面。`,
          `找出两批数据共有的元素，或者只在一批里出现的元素。`,
          `记录已经访问过的位置，避免重复处理。`
        ]},
        { t: `h2`, text: `演示 1 · add、contains、remove` },
        { t: `p`, text: `桶数取 8。依次加入 3、1、3、7、1，重复的 3 和 1 会被跳过。contains 查 7 命中，查 2 落空；remove 删掉 1 之后，再查 1 就返回 False。` },
        { t: `code`, lang: `python`, code: `def add(t, x):
    b = t[hash(x) % len(t)]
    if x not in b: b.append(x)
def has(t, x):
    return x in t[hash(x) % len(t)]
def drop(t, x):
    b = t[hash(x) % len(t)]
    if x in b: b.remove(x); return True
t = [[] for _ in range(8)]
for x in [3, 1, 3, 7, 1]: add(t, x)
print(has(t, 7), has(t, 2))
print(drop(t, 1), has(t, 1))` },
        { t: `p`, text: `输出两行分别是 True False 和 True False。第一行说明查得到 7、查不到 2；第二行说明删 1 成功，删完再查就没了。集合里没有值可以返回，所以判断一个元素在不在，只能靠 contains。` },
        { t: `h2`, text: `演示 2 · 去重之后求交集` },
        { t: `p`, text: `先按元素建两个集合，再遍历 a 的每条链，用 b 的 contains 过滤。留下的就是两边都有的元素。这里的遍历顺序是桶的顺序，不是输入顺序。` },
        { t: `code`, lang: `python`, code: `def add(t, x):
    b = t[hash(x) % len(t)]
    if x not in b: b.append(x)
def has(t, x):
    return x in t[hash(x) % len(t)]
def build(items):
    t = [[] for _ in range(8)]
    for x in items: add(t, x)
    return t
a = build([1, 2, 2, 3])
b = build([2, 3, 4])
print([x for bucket in a for x in bucket if has(b, x)])` },
        { t: `p`, text: `a 去重后是 1、2、3，b 是 2、3、4，交集打印成 [2, 3]。如果换成双重循环，每个元素都要和另一边的所有元素比一遍；用 contains，每个元素只算一次桶号、扫一条短链，元素一多差距就出来了。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260"><rect x="24" y="24" width="592" height="212" rx="14" fill="#eef6f4"/><text x="320" y="58" font-size="18" font-weight="700" text-anchor="middle" fill="#173d36">add 先看桶里有没有，再决定收不收</text><rect x="56" y="86" width="96" height="40" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="104" y="112" font-size="16" text-anchor="middle" fill="#173d36">输入 3</text><path d="M156 106H204" stroke="#2a8c78" stroke-width="3"/><polygon points="204,106 194,100 194,112" fill="#2a8c78"/><rect x="212" y="82" width="108" height="48" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="266" y="111" font-size="15" text-anchor="middle" fill="#173d36">桶里没有</text><path d="M324 106H368" stroke="#2a8c78" stroke-width="3"/><polygon points="368,106 358,100 358,112" fill="#2a8c78"/><rect x="376" y="82" width="96" height="48" rx="6" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="424" y="111" font-size="15" text-anchor="middle" fill="#173d36">追加</text><rect x="56" y="168" width="96" height="40" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="104" y="194" font-size="16" text-anchor="middle" fill="#173d36">输入 3</text><path d="M156 188H204" stroke="#2a8c78" stroke-width="3"/><polygon points="204,188 194,182 194,194" fill="#2a8c78"/><rect x="212" y="164" width="108" height="48" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="266" y="193" font-size="15" text-anchor="middle" fill="#173d36">桶里已有</text><path d="M324 188H368" stroke="#2a8c78" stroke-width="3"/><polygon points="368,188 358,182 358,194" fill="#2a8c78"/><rect x="376" y="164" width="96" height="48" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="424" y="193" font-size="15" text-anchor="middle" fill="#173d36">丢弃</text><text x="520" y="112" font-size="15" fill="#4d6f67">第一次收下</text><text x="520" y="194" font-size="15" fill="#4d6f67">第二次跳过</text></svg>`, caption: `同一个元素第二次进来时，桶里已经能查到它，add 直接返回，元素个数不变。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `拿列表当元素 add，hash 会抛 TypeError，集合的元素必须不可变。`,
          `以为集合保持插入顺序；打印顺序由桶号和哈希值决定，和输入顺序无关。`,
          `去重后还想按原顺序输出，得另外记一份顺序表，集合本身不负责顺序。`,
          `remove 一个不存在的元素，内置 set 会抛 KeyError，手写版要先 contains 再删。`,
          `用双重循环求交集，元素一多就变成平方级，忘了 contains 本来就是现成的工具。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `给这个集合补一个 size 方法和一个 clear 方法，插入 8 个元素、清空后再打印数量。`,
          `用 add 和 contains 写出并集与差集，用 [1, 2, 3] 和 [3, 4] 各跑一遍。`,
          `输入一句话，按字符去重，打印一共有多少种字符。`,
          `用集合和双重循环各求一次两个列表的共同元素，比较两段代码的比较次数。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：集合就是只有键的哈希表，add 先查再收完成去重，交并差全靠 contains 把平方级压成线性。` }
      ]
    },
    {
      id: `p15`, title: `第 15 课 · 字典：按键找值`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把集合升级成键值对，写清 get、set、delete 与遍历，并和 Python 内置的 dict 逐项对照。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `字典是哈希表最常用的形态：每个桶里存的是键和值，键决定位置，值跟着键走。set 先算桶号，在链上找键：找到就换掉值，没找到就追加一对。get 走同一条路，命中返回值，不命中返回默认值。键和值分工明确，哈希只看键，值再大也不影响桶号。` },
        { t: `p`, text: `delete 是把整对从链上摘掉，不是只把值清空。清空值会留下一个没有内容的键，get 还会命中，语义就乱了。摘掉之后如果后面还要用这个键，重新 set 一次即可，桶号由键重新算，位置可能和上次不同。` },
        { t: `p`, text: `遍历要把所有桶和所有链走一遍，拿到的是键值对。顺序由桶号决定，不等于插入顺序。Python 3.7 之后的 dict 额外维护了一条插入顺序的键链，所以遍历能按插入顺序来；手写版没有这条链，打印顺序只能当参考，不能当契约。` },
        { t: `p`, text: `和内置 dict 对比：内置版用开放寻址、保序、有 get 默认值、keys、values、items 三个视图和推导式；手写版固定 8 个桶、链地址、没有自动扩容，几万条数据就会明显变慢。但 get、set、delete 的路径是一致的：算桶号、比键、命中或落空。读懂手写版，内置版的文档就不再是黑箱。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `存一张配置表，按配置名取值。`,
          `统计词频，词是键，次数是值。`,
          `把学号映射到姓名，按学号查人。`,
          `做一层缓存，先查键，没有再算。`
        ]},
        { t: `h2`, text: `演示 1 · set 覆盖与 get 默认值` },
        { t: `p`, text: `先存苹果 3、梨 5，再存一次苹果 4。第二次 set 在链上找到苹果，直接换值，链的长度不变。查桃子时没命中，get 返回传进去的默认值 0。` },
        { t: `code`, lang: `python`, code: `def put(t, k, v):
    b = t[hash(k) % 8]
    for p in b:
        if p[0] == k: p[1] = v; return
    b.append([k, v])
def get(t, k, d=None):
    for p in t[hash(k) % 8]:
        if p[0] == k: return p[1]
    return d
t = [[] for _ in range(8)]
put(t, "苹果", 3); put(t, "梨", 5); put(t, "苹果", 4)
print(get(t, "苹果"), get(t, "梨"), get(t, "桃", 0))` },
        { t: `p`, text: `输出是 4 5 0。苹果从 3 变成 4，说明 set 遇到已有的键是覆盖而不是追加；桃子返回 0，说明默认值只在没命中时出现。如果把默认值省掉，查不到时拿到的是 None。` },
        { t: `h2`, text: `演示 2 · 删除与遍历` },
        { t: `p`, text: `为了不依赖字符串哈希的随机性，这里用整数键。2、10、18 对 8 取余都等于 2，全挤在 2 号桶。遍历把所有非空链摊平，删除 10 就是从这条链中间摘掉一项。` },
        { t: `code`, lang: `python`, code: `def drop(t, k):
    b = t[k % 8]
    for i, p in enumerate(b):
        if p[0] == k: b.pop(i); return True
t = [[] for _ in range(8)]
for k in [2, 10, 18]: t[k % 8].append([k, k * k])
print([p for b in t for p in b])
print(drop(t, 10), [p for b in t for p in b])` },
        { t: `p`, text: `第一行打印三条键值对，顺序是 2、10、18；第二行打印 True 和剩下的 2、18。遍历代码里的双层推导式就是字典 items 的最朴素实现：外层走桶，内层走链。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260"><rect x="24" y="24" width="592" height="212" rx="14" fill="#eef6f4"/><text x="320" y="58" font-size="18" font-weight="700" text-anchor="middle" fill="#173d36">键算桶号，桶里比键，命中返回值</text><rect x="56" y="88" width="104" height="44" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="108" y="116" font-size="16" text-anchor="middle" fill="#173d36">键 梨</text><path d="M164 110H216" stroke="#2a8c78" stroke-width="3"/><polygon points="216,110 206,104 206,116" fill="#2a8c78"/><text x="190" y="96" font-size="15" text-anchor="middle" fill="#4d6f67">算桶号</text><rect x="224" y="76" width="176" height="148" rx="8" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="312" y="102" font-size="16" text-anchor="middle" fill="#173d36">2 号桶的链</text><rect x="244" y="118" width="136" height="40" rx="6" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="312" y="145" font-size="15" text-anchor="middle" fill="#173d36">梨 → 5</text><rect x="244" y="168" width="136" height="40" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="312" y="195" font-size="15" text-anchor="middle" fill="#4d6f67">桃 → 7</text><path d="M404 110H456" stroke="#2a8c78" stroke-width="3"/><polygon points="456,110 446,104 446,116" fill="#2a8c78"/><rect x="464" y="86" width="120" height="48" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="524" y="116" font-size="16" text-anchor="middle" fill="#173d36">值 5</text><text x="524" y="176" font-size="15" text-anchor="middle" fill="#4d6f67">键不同，值不同</text><text x="524" y="202" font-size="15" text-anchor="middle" fill="#4d6f67">桶号相同也能共存</text></svg>`, caption: `两个键落在同一个桶里，链上逐个比键，比中哪个就取哪个的值。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `用 get 取值却以为找不到会报错；内置 dict 的方括号取值找不到才抛 KeyError。`,
          `删除时只把值改成 None，键还留在链上，get 仍会命中。`,
          `遍历时顺手删除元素，链的长度变了，循环会跳过或重复访问。`,
          `以为打印顺序就是插入顺序，手写版没有维护键的顺序链。`,
          `拿值参与哈希，两个值相同的键被当成同一个键。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `给手写字典补一个 size 方法和一个 contains_key 方法，插入 5 对、删除 2 对，打印数量。`,
          `用它统计一句话里每个字出现的次数，按次数从多到少打印。`,
          `写一个 invert 把键和值对调，值有重复时观察丢了哪一个键。`,
          `同一个键先 set 再 delete 再 set，打印每一步的 get 结果，解释桶号有没有变。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：字典是带值的哈希表，键定位、值跟随；桶里的顺序不是插入顺序，想要保序得另记一条键链。` }
      ]
    },
    {
      id: `p16`, title: `第 16 课 · 二叉树：一层一层往下分`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把节点、根、左右孩子搭起来，用前序、中序、后序和层序四种顺序把树走一遍，知道每种顺序先处理谁。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `二叉树是每个节点最多两个孩子：左孩子和右孩子。一个节点就是三样东西：值、指向左的引用、指向右的引用。最上面那个没有父节点的叫根，两个孩子都为空的叫叶子。只有一个节点的树也合法，空树用 None 表示。` },
        { t: `p`, text: `遍历是每个节点恰好访问一次的路线。前序：先根，再左子树，最后右子树；中序：先左，再根，再右；后序：先左，再右，最后根。三种都是递归定义：处理一棵树等于处理根加处理左子树加处理右子树，区别只在根排在第几位。写递归时先写空树的出口，再写三段的拼接。` },
        { t: `p`, text: `层序不是递归，它按层从上到下、从左到右访问。用一个队列：根先入队，然后每轮出队一个节点、打印它、把它的左右孩子依次入队。队列先进先出，保证同一层的节点排在下一层前面。递归靠调用栈，深度就是树高；层序靠队列，宽度就是一层最多几个节点。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `表示文件目录：目录是节点，子目录和文件是孩子。`,
          `表示算式：叶子是数字，内部节点是加减乘除。`,
          `表示一场决策的每一步，每个分叉是一个选择。`,
          `按层打印页面结构，先看主干再看细节。`
        ]},
        { t: `h2`, text: `演示 1 · 建一棵五节点的树，跑三种递归` },
        { t: `p`, text: `先建树：1 是根，2 和 3 是孩子，4 和 5 是 2 的孩子。三个递归函数只差根放在拼接的哪个位置。` },
        { t: `code`, lang: `python`, code: `class Node:
    def __init__(self, v, l=None, r=None):
        self.v, self.left, self.right = v, l, r
root = Node(1, Node(2, Node(4), Node(5)), Node(3))
def pre(n):
    return [n.v] + pre(n.left) + pre(n.right) if n else []
def ino(n):
    return ino(n.left) + [n.v] + ino(n.right) if n else []
def post(n):
    return post(n.left) + post(n.right) + [n.v] if n else []
print(pre(root), ino(root), post(root))` },
        { t: `p`, text: `输出三行：前序 1 2 4 5 3，中序 4 2 5 1 3，后序 4 5 2 3 1。同一棵树，根的出场位置不同，序列就完全不同。空节点返回空列表，是递归的出口。` },
        { t: `h2`, text: `演示 2 · 层序：用队列一层一层推` },
        { t: `p`, text: `deque 当队列，popleft 从左边取，append 从右边放。打印完一个节点就把它的孩子排到队尾。` },
        { t: `code`, lang: `python`, code: `from collections import deque
class Node:
    def __init__(self, v, l=None, r=None):
        self.v, self.left, self.right = v, l, r
root = Node(1, Node(2, Node(4), Node(5)), Node(3))
q = deque([root])
while q:
    n = q.popleft()
    print(n.v, end=" ")
    if n.left: q.append(n.left)
    if n.right: q.append(n.right)
print()` },
        { t: `p`, text: `输出 1 2 3 4 5，正好一层一层。如果换成列表的 pop(0) 当队头，每次都要把后面所有元素往前挪，节点一多就慢；deque 两端操作都是常数级。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="24" y="24" width="592" height="232" rx="14" fill="#eef6f4"/><text x="188" y="58" font-size="18" font-weight="700" text-anchor="middle" fill="#173d36">同一棵树，四种走法</text><circle cx="188" cy="92" r="24" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="188" y="98" font-size="16" text-anchor="middle" fill="#173d36">1</text><circle cx="120" cy="160" r="24" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="120" y="166" font-size="16" text-anchor="middle" fill="#173d36">2</text><circle cx="256" cy="160" r="24" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="256" y="166" font-size="16" text-anchor="middle" fill="#173d36">3</text><circle cx="90" cy="228" r="24" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="90" y="234" font-size="16" text-anchor="middle" fill="#173d36">4</text><circle cx="152" cy="228" r="24" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="152" y="234" font-size="16" text-anchor="middle" fill="#173d36">5</text><path d="M170 110L134 142" stroke="#2a8c78" stroke-width="2.5"/><path d="M206 110L242 142" stroke="#2a8c78" stroke-width="2.5"/><path d="M108 178L94 208" stroke="#2a8c78" stroke-width="2.5"/><path d="M132 178L146 208" stroke="#2a8c78" stroke-width="2.5"/><text x="400" y="96" font-size="16" fill="#173d36">前序：1 2 4 5 3</text><text x="400" y="126" font-size="16" fill="#173d36">中序：4 2 5 1 3</text><text x="400" y="156" font-size="16" fill="#173d36">后序：4 5 2 3 1</text><text x="400" y="186" font-size="16" fill="#173d36">层序：1 2 3 4 5</text><text x="400" y="222" font-size="15" fill="#4d6f67">前中后看根排第几</text><text x="400" y="246" font-size="15" fill="#4d6f67">层序看离根几步</text></svg>`, caption: `一棵 1 到 5 的树，根在前就是前序，夹在中间就是中序，排最后就是后序。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `递归只写了左孩子不写右孩子，右子树整棵漏掉。`,
          `空树没写出口，访问 None 的左孩子直接报 AttributeError。`,
          `把中序理解成「根在中间所以先写根」，实际是先左、再根、再右。`,
          `层序用递归写，结果变成了深度优先，打印顺序不是一层一层。`,
          `用列表的 pop(0) 当队列，取队头要挪整个列表。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `给树加一个 height 方法，空树返回 0，叶子返回 1。`,
          `写 count 和 leaves 两个函数，分别数节点总数和叶子数。`,
          `先手工写出演示 1 那棵树的三种序列，再跑代码核对。`,
          `把层序改成按层打印，每一层输出一行。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：二叉树每个节点最多两个孩子，前中后序只看根排第几，层序靠队列一层一层推。` }
      ]
    },
    {
      id: `p17`, title: `第 17 课 · 二叉搜索树：左小右大`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：给二叉树加上左小右大的约定，写查找、插入、删除的三种情况，知道它为什么会退化成一条链。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `二叉搜索树在二叉树上加一条约定：任何节点的左子树里所有键都比它小，右子树里所有键都比它大，而且对每个节点都成立。于是查找像翻字典：目标比当前节点小就往左，大就往右，相等就命中，走到 None 就是没有。每走一步砍掉一半子树。` },
        { t: `p`, text: `插入沿查找路径走到空位挂上新节点，重复的键通常直接忽略或覆盖。删除分三种：叶子直接摘掉；只有一个孩子，让那个孩子顶替自己的位置；有两个孩子，找右子树里最小的节点，把它的值抄过来，再把它从右子树里删掉。第三种找右子树最小，是因为它比左子树所有键都大、又比右子树其余键都小，正好接替。` },
        { t: `p`, text: `最小值一路向左，最大值一路向右。退化：按 1、2、3、4、5 的顺序插入，每个新键都比前一个大，树长成一条右斜链，查找和插入都从对数级退到线性级。二叉搜索树只规定顺序，不规定形状；形状由插入顺序决定，平衡要另外的规则，后面单独一课讲。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `维护一个有序集合，随时插入和按值查找。`,
          `按区间取出所有落在两个键之间的记录。`,
          `找某个键的前驱和后继，也就是紧挨着的前一个和后一个。`,
          `做排行榜，按键排序后中序输出就是升序。`
        ]},
        { t: `h2`, text: `演示 1 · 插入：一路比大小，走到空位挂上` },
        { t: `p`, text: `从空树开始，依次插入 8、3、10、1、6。每个新键都从根开始比大小，走到空位挂上。中序打印出来一定是从小到大，这是 BST 的试金石。` },
        { t: `code`, lang: `python`, code: `class Node:
    def __init__(self, v): self.v, self.left, self.right = v, None, None
def insert(n, v):
    if not n: return Node(v)
    if v < n.v: n.left = insert(n.left, v)
    else: n.right = insert(n.right, v)
    return n
def walk(n):
    return walk(n.left) + [n.v] + walk(n.right) if n else []
root = None
for v in [8, 3, 10, 1, 6]: root = insert(root, v)
print(walk(root))` },
        { t: `p`, text: `输出 [1, 3, 6, 8, 10]。插入没有移动任何已有节点，只改了沿途节点的 left 或 right 引用；中序有序说明每个节点都守住了左小右大。` },
        { t: `h2`, text: `演示 2 · 查找与最值` },
        { t: `p`, text: `查找用循环写，n 沿着左或右一路下滑，命中返回 True，滑到 None 返回 False。最小值从根一路向左，最大值一路向右。` },
        { t: `code`, lang: `python`, code: `class Node:
    def __init__(self, v, l=None, r=None): self.v, self.left, self.right = v, l, r
root = Node(8, Node(3, Node(1), Node(6)), Node(10))
def find(n, v):
    while n and n.v != v:
        n = n.left if v < n.v else n.right
    return n is not None
def leftmost(n):
    while n.left: n = n.left
    return n.v
print(find(root, 6), find(root, 7), leftmost(root), leftmost(root.right))` },
        { t: `p`, text: `输出 True False 1 10。查 6 命中，查 7 走到底落空；整棵树最小是 1，右子树最小是 10。比较次数等于路径长度，树越矮越快。` },
        { t: `h2`, text: `演示 3 · 删除有两个孩子的节点` },
        { t: `p`, text: `先找右子树最小值，把值抄到被删节点上，再去右子树删掉那个最小值。下面删 3，右子树最小是 6，于是 3 的位置换成 6。` },
        { t: `code`, lang: `python`, code: `class N:
    def __init__(s, v, l=None, r=None): s.v, s.l, s.r = v, l, r
def cut(n, v):
    if v < n.v: n.l = cut(n.l, v)
    elif v > n.v: n.r = cut(n.r, v)
    elif n.l and n.r:
        m = n.r
        while m.l: m = m.l
        n.v, n.r = m.v, cut(n.r, m.v)
    else: return n.l or n.r
    return n
root = N(8, N(3, N(1), N(6)), N(10)); cut(root, 3); print(root.l.v, root.l.l.v, root.l.r)` },
        { t: `p`, text: `输出 6 1 None：原来 3 的位置换成 6，左孩子还是 1，右孩子被清空。三种情况里只有这一种需要往下再删一次，另外两种改一条引用就结束。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="24" y="24" width="592" height="232" rx="14" fill="#eef6f4"/><text x="180" y="58" font-size="18" font-weight="700" text-anchor="middle" fill="#173d36">删除前</text><circle cx="180" cy="96" r="24" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="180" y="102" font-size="16" text-anchor="middle" fill="#173d36">8</text><circle cx="112" cy="164" r="24" fill="#ffe2b8" stroke="#c9832a" stroke-width="2"/><text x="112" y="170" font-size="16" text-anchor="middle" fill="#173d36">3</text><circle cx="248" cy="164" r="24" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="248" y="170" font-size="16" text-anchor="middle" fill="#173d36">10</text><circle cx="76" cy="228" r="22" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="76" y="234" font-size="15" text-anchor="middle" fill="#173d36">1</text><circle cx="148" cy="228" r="22" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="148" y="234" font-size="15" text-anchor="middle" fill="#173d36">6</text><path d="M164 114L126 146" stroke="#2a8c78" stroke-width="2.5"/><path d="M196 114L234 146" stroke="#2a8c78" stroke-width="2.5"/><path d="M102 182L84 208" stroke="#2a8c78" stroke-width="2.5"/><path d="M122 182L140 208" stroke="#2a8c78" stroke-width="2.5"/><text x="180" y="258" font-size="15" text-anchor="middle" fill="#c9832a">删 3：右子树最小是 6</text><path d="M292 140H340" stroke="#2a8c78" stroke-width="3"/><polygon points="340,140 330,134 330,146" fill="#2a8c78"/><text x="418" y="58" font-size="18" font-weight="700" text-anchor="middle" fill="#173d36">删除后</text><circle cx="418" cy="96" r="24" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="418" y="102" font-size="16" text-anchor="middle" fill="#173d36">8</text><circle cx="350" cy="164" r="24" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="350" y="170" font-size="16" text-anchor="middle" fill="#173d36">6</text><circle cx="486" cy="164" r="24" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="486" y="170" font-size="16" text-anchor="middle" fill="#173d36">10</text><circle cx="314" cy="228" r="22" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="314" y="234" font-size="15" text-anchor="middle" fill="#173d36">1</text><path d="M402 114L364 146" stroke="#2a8c78" stroke-width="2.5"/><path d="M434 114L472 146" stroke="#2a8c78" stroke-width="2.5"/><path d="M340 182L322 208" stroke="#2a8c78" stroke-width="2.5"/><text x="418" y="258" font-size="15" text-anchor="middle" fill="#4d6f67">6 顶替 3，左孩子 1 不动</text></svg>`, caption: `两个孩子的节点不能直接摘，用右子树最小值顶替，再把那个最小值删掉。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `插入时把相等的键放到右边，查找又只往左，重复键再也找不到。`,
          `删除有两个孩子的节点时直接摘掉，整棵子树跟着丢了。`,
          `忘了把递归插入的返回值接回 n.left 或 n.right，新节点挂不上。`,
          `用有序数据建树，得到一条链，还以为是代码写错了。`,
          `中序有序只能证明顺序对，不能证明树平衡。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `给 BST 加 min 和 max 两个方法，空树返回 None。`,
          `写 range_sum(lo, hi)，统计闭区间内所有键的和。`,
          `依次插入 1 到 7，打印树高；再按 4、2、6、1、3、5、7 插入，比较两次高度。`,
          `手工删掉演示 3 的根节点 8，写出删除后的中序序列。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：二叉搜索树靠左小右大把查找变折半，插入顺序决定形状，有序插入会退化成链。` }
      ]
    },
    {
      id: `p18`, title: `第 18 课 · 平衡树：让树别长歪`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用高度和平衡因子判断一棵树歪没歪，写清 LL、RR、LR、RL 四种失衡各用哪种旋转修。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `平衡因子是一个节点的左子树高度减去右子树高度。空树高度记 0，叶子高度记 1。AVL 树要求每个节点的平衡因子只能是 -1、0、1；一旦变成 2 或 -2，这棵子树就歪了，必须旋转。` },
        { t: `p`, text: `插入从根一路往下，新节点挂在某个空位，然后沿原路往上更新高度、算平衡因子。第一个失衡的节点叫枢轴。失衡只有四种来源：新节点落在左子树的左边，简称 LL，做一次右旋；落在右子树的右边，简称 RR，做一次左旋；落在左子树的右边，简称 LR，先对左孩子左旋、再对枢轴右旋；落在右子树的左边，简称 RL，先对右孩子右旋、再对枢轴左旋。双旋就是把 LR 掰成 LL，再按单旋处理。` },
        { t: `p`, text: `旋转只改三条引用，不改变中序顺序：右旋把左孩子提上来，原根变成它的右孩子，左孩子原来的右子树挂回原根的左边。左旋对称。一次插入最多旋转两次，树高维持在 1.44 倍对数级，查找、插入、删除都稳定在对数级。代价是每次改树都要往上更新高度。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `需要稳定查找速度的有序表，不能接受偶尔退化成链。`,
          `频繁插入删除的排行榜，每次改完都要保持平衡。`,
          `数据库索引的教学模型，先懂旋转再懂 B 树。`,
          `区间查询，树矮一层就少一次比较。`
        ]},
        { t: `h2`, text: `演示 1 · 单旋转：LL 右旋，RR 左旋` },
        { t: `p`, text: `左左失衡做右旋：3 的左孩子 2 提上来，3 变成 2 的右孩子，2 原来的右孩子挂回 3 的左边。右右失衡做左旋，方向相反。两行打印都是 2 1 3。` },
        { t: `code`, lang: `python`, code: `class N:
    def __init__(s, v, l=None, r=None): s.v, s.l, s.r = v, l, r
def right(y):
    x = y.l; y.l = x.r; x.r = y; return x
def left(x):
    y = x.r; x.r = y.l; y.l = x; return y
r = right(N(3, N(2, N(1))))
s = left(N(1, None, N(2, None, N(3))))
print(r.v, r.l.v, r.r.v, s.v, s.l.v, s.r.v)` },
        { t: `p`, text: `输出 2 1 3 2 1 3。两次旋转都把中间那个键推上了根，左右各一个孩子，高度从 3 降到 2。旋转没有重排键的大小关系，只换了谁当父节点。` },
        { t: `h2`, text: `演示 2 · LR 双旋：先左旋孩子，再右旋枢轴` },
        { t: `p`, text: `3 的左孩子是 1，1 的右孩子是 2，新节点落在左子树的右边。先对 1 左旋，把 2 提上来变成 3 的左孩子，形状变成 LL；再对 3 右旋，2 到根。` },
        { t: `code`, lang: `python`, code: `class N:
    def __init__(s, v, l=None, r=None): s.v, s.l, s.r = v, l, r
def right(y):
    x = y.l; y.l = x.r; x.r = y; return x
def left(x):
    y = x.r; x.r = y.l; y.l = x; return y
root = N(3, N(1, None, N(2)))
root.l = left(root.l)
root = right(root)
print(root.v, root.l.v, root.r.v)` },
        { t: `p`, text: `输出 2 1 3。双旋不能省成一次：直接右旋 3 会把 1 的右孩子 2 挂到 3 的左边，形状还是歪的。RL 与 LR 完全对称，只是左右方向对调。` },
        { t: `h2`, text: `演示 3 · 先量高度和平衡因子` },
        { t: `p`, text: `高度和平衡因子是判断依据，先量再转。根的高度 3，左孩子高度 2，根的平衡因子是 2，已经越界。` },
        { t: `code`, lang: `python`, code: `class N:
    def __init__(s, v, l=None, r=None): s.v, s.l, s.r = v, l, r
def h(n):
    return 0 if not n else 1 + max(h(n.l), h(n.r))
def bf(n):
    return h(n.l) - h(n.r)
root = N(3, N(2, N(1)))
print(h(root), h(root.l), bf(root), bf(root.l))` },
        { t: `p`, text: `输出 3 2 2 1：根的平衡因子 2 说明左边比右边高两层，左孩子的平衡因子 1 还在范围内。第一个越界的节点就是枢轴，旋转从它开始。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="24" y="24" width="592" height="232" rx="14" fill="#eef6f4"/><text x="320" y="58" font-size="18" font-weight="700" text-anchor="middle" fill="#173d36">LR 失衡：两次旋转才扶正</text><circle cx="92" cy="104" r="22" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="92" y="110" font-size="16" text-anchor="middle" fill="#173d36">3</text><circle cx="60" cy="176" r="22" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="60" y="182" font-size="16" text-anchor="middle" fill="#173d36">1</text><circle cx="124" cy="176" r="22" fill="#ffe2b8" stroke="#c9832a" stroke-width="2"/><text x="124" y="182" font-size="16" text-anchor="middle" fill="#173d36">2</text><path d="M86 122L66 156" stroke="#2a8c78" stroke-width="2.5"/><path d="M102 122L118 156" stroke="#2a8c78" stroke-width="2.5"/><text x="92" y="232" font-size="15" text-anchor="middle" fill="#4d6f67">2 在 1 的右边</text><path d="M162 140H202" stroke="#2a8c78" stroke-width="3"/><polygon points="202,140 192,134 192,146" fill="#2a8c78"/><text x="182" y="124" font-size="15" text-anchor="middle" fill="#c9832a">左旋 1</text><circle cx="278" cy="104" r="22" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="278" y="110" font-size="16" text-anchor="middle" fill="#173d36">3</text><circle cx="246" cy="176" r="22" fill="#ffe2b8" stroke="#c9832a" stroke-width="2"/><text x="246" y="182" font-size="16" text-anchor="middle" fill="#173d36">2</text><circle cx="310" cy="176" r="22" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="310" y="182" font-size="16" text-anchor="middle" fill="#173d36">1</text><path d="M272 122L252 156" stroke="#2a8c78" stroke-width="2.5"/><path d="M288 122L304 156" stroke="#2a8c78" stroke-width="2.5"/><text x="278" y="232" font-size="15" text-anchor="middle" fill="#4d6f67">变成 LL 形状</text><path d="M348 140H388" stroke="#2a8c78" stroke-width="3"/><polygon points="388,140 378,134 378,146" fill="#2a8c78"/><text x="368" y="124" font-size="15" text-anchor="middle" fill="#c9832a">右旋 3</text><circle cx="464" cy="104" r="22" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="464" y="110" font-size="16" text-anchor="middle" fill="#173d36">2</text><circle cx="432" cy="176" r="22" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="432" y="182" font-size="16" text-anchor="middle" fill="#173d36">1</text><circle cx="496" cy="176" r="22" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="496" y="182" font-size="16" text-anchor="middle" fill="#173d36">3</text><path d="M458 122L438 156" stroke="#2a8c78" stroke-width="2.5"/><path d="M474 122L490 156" stroke="#2a8c78" stroke-width="2.5"/><text x="464" y="232" font-size="15" text-anchor="middle" fill="#4d6f67">平衡因子回到 0</text><text x="320" y="256" font-size="15" text-anchor="middle" fill="#173d36">LL 右旋、RR 左旋、LR 先左后右、RL 先右后左</text></svg>`, caption: `LR 要把折角先掰直：对 1 左旋成 LL，再对 3 右旋，2 升到根。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `只比较左右孩子的值，不看高度，把 LL 和 LR 判断反。`,
          `高度为 0 的空树没处理，递归量高度直接崩。`,
          `旋转后忘了更新两个节点的高度，下一轮平衡因子全错。`,
          `LR 直接做一次右旋，折角没掰直，树还是歪的。`,
          `以为旋转改变了中序顺序；旋转只换形状，键的大小顺序不变。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把 RL 的双旋补出来，用 1 的右孩子 3 带一个左孩子 2 做例子，打印旋转后的根。`,
          `给高度函数加缓存，或者在每个节点里存一个 height 字段，比较两种写法。`,
          `写一个 is_balanced 函数，判断一棵树所有节点的平衡因子是否都在 -1 到 1 之间。`,
          `手动画出依次插入 3、2、1、4、5 之后每一步的树，标出每次旋转的枢轴。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：平衡因子越界就转，LL 右旋、RR 左旋、LR 和 RL 先转孩子再转枢轴，转完树矮一半。` }
      ]
    },
    {
      id: `p19`, title: `第 19 课 · 堆：每次拿走最大的`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用数组存一棵完全二叉树，写清 push 的上浮和 pop 的下沉，知道堆为什么每次都能拿出最大值。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `堆是一棵完全二叉树：除了最后一层，每层都填满，最后一层从左往右填。这个形状可以直接用数组存：下标 0 是根，i 的左孩子是 2i+1，右孩子是 2i+2，父亲是 (i-1)//2。不用指针，下标就能算出父子关系。` },
        { t: `p`, text: `大顶堆要求每个节点都不小于它的孩子，所以根永远是最大值。push 把新元素放到数组末尾，然后和父亲比：比父亲大就交换，一路上浮，直到父亲更大或者到根。pop 把根和最后一个元素交换，删掉末尾，再让新的根下沉：和两个孩子里较大的那个比，比它小就交换，直到比孩子都大或者到底。` },
        { t: `p`, text: `两个操作都只走一条从根到叶的路径，代价是树高，也就是对数级。堆只保证父子的大小关系，不保证兄弟之间、整棵树有序；所以堆适合反复取最值，不适合按顺序遍历全部元素。要把元素按顺序拿出来，得一个个 pop，这个账放到后面单独一课算。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `任务调度：每次挑优先级最高的任务先做。`,
          `排行榜：随时插入新成绩，随时取当前第一。`,
          `合并多个有序列表：每次从各列表头部取最小的那个。`,
          `找中位数：一边大顶堆、一边小顶堆，两边平衡。`
        ]},
        { t: `h2`, text: `演示 1 · push：从末尾一路往上浮` },
        { t: `p`, text: `依次 push 3、9、4、8。每个新元素都从末尾往上比，比父亲大就换位。最后 9 到根，8 在它下面。` },
        { t: `code`, lang: `python`, code: `class Heap:
    def __init__(self): self.a = []
    def push(self, x):
        self.a.append(x)
        i = len(self.a) - 1
        while i > 0 and self.a[i] > self.a[(i - 1) // 2]:
            p = (i - 1) // 2
            self.a[i], self.a[p] = self.a[p], self.a[i]
            i = p
h = Heap()
for x in [3, 9, 4, 8]: h.push(x)
print(h.a)` },
        { t: `p`, text: `输出 [9, 8, 4, 3]。数组不是有序的，但每个父亲都不小于孩子：9 大于 8 和 4，8 大于 3。根是最大值，这就是堆要的全部保证。` },
        { t: `h2`, text: `演示 2 · pop：把末尾搬到根，再往下沉` },
        { t: `p`, text: `对 [9, 8, 4, 3] 做一次 pop：根 9 先记下来，末尾 3 搬到根，长度减一，然后 3 和两个孩子里较大的 8 交换，沉到 8 原来的位置。` },
        { t: `code`, lang: `python`, code: `def pop(a):
    top, a[0] = a[0], a[-1]; a.pop()
    i = 0
    while 2 * i + 1 < len(a):
        k = 2 * i + 1
        if k + 1 < len(a) and a[k + 1] > a[k]: k += 1
        if a[i] >= a[k]: break
        a[i], a[k] = a[k], a[i]
        i = k
    return top
a = [9, 8, 4, 3]
print(pop(a), a)` },
        { t: `p`, text: `输出 9 [8, 3, 4]。9 被拿走，剩下的根变成 8，3 沉到左孩子的位置。下沉时每次只和较大的孩子换，和小的换会把大的孩子压到下面，堆就坏了。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="24" y="24" width="592" height="276" rx="14" fill="#eef6f4"/><text x="320" y="58" font-size="18" font-weight="700" text-anchor="middle" fill="#173d36">数组存堆：左孩子 2i+1，右孩子 2i+2</text><rect x="86" y="76" width="64" height="40" rx="6" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="118" y="102" font-size="16" text-anchor="middle" fill="#173d36">9</text><rect x="158" y="76" width="64" height="40" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="190" y="102" font-size="16" text-anchor="middle" fill="#173d36">8</text><rect x="230" y="76" width="64" height="40" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="262" y="102" font-size="16" text-anchor="middle" fill="#173d36">4</text><rect x="302" y="76" width="64" height="40" rx="6" fill="#ffe2b8" stroke="#c9832a" stroke-width="2"/><text x="334" y="102" font-size="16" text-anchor="middle" fill="#173d36">3</text><text x="118" y="134" font-size="14" text-anchor="middle" fill="#4d6f67">0 号</text><text x="190" y="134" font-size="14" text-anchor="middle" fill="#4d6f67">1 号</text><text x="262" y="134" font-size="14" text-anchor="middle" fill="#4d6f67">2 号</text><text x="334" y="134" font-size="14" text-anchor="middle" fill="#4d6f67">3 号</text><circle cx="190" cy="186" r="22" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="190" y="192" font-size="16" text-anchor="middle" fill="#173d36">9</text><circle cx="134" cy="250" r="22" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="134" y="256" font-size="16" text-anchor="middle" fill="#173d36">8</text><circle cx="246" cy="250" r="22" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="246" y="256" font-size="16" text-anchor="middle" fill="#173d36">4</text><circle cx="80" cy="278" r="16" fill="#ffe2b8" stroke="#c9832a" stroke-width="2"/><text x="80" y="284" font-size="15" text-anchor="middle" fill="#173d36">3</text><path d="M178 204L146 232" stroke="#2a8c78" stroke-width="2.5"/><path d="M202 204L234 232" stroke="#2a8c78" stroke-width="2.5"/><path d="M114 260L94 271" stroke="#2a8c78" stroke-width="2.5"/><text x="424" y="190" font-size="16" fill="#173d36">9 是根，也是最大值</text><text x="424" y="218" font-size="16" fill="#173d36">8 和 4 是它的孩子</text><text x="424" y="246" font-size="16" fill="#173d36">3 是 8 的左孩子</text><text x="424" y="274" font-size="15" fill="#4d6f67">孩子不一定比叔叔大</text></svg>`, caption: `同一组数既能画成树，也能排成数组；父子关系全靠下标算出来。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `下标从 0 开始时左孩子是 2i+1，写成 2i 会指回自己。`,
          `上浮循环忘了判断 i > 0，根节点还去访问负下标。`,
          `下沉时和较小的孩子交换，大顶堆的根不再是最大。`,
          `pop 先把末尾删了再交换，根的值直接丢。`,
          `以为堆数组整体有序，按顺序打印发现不是升序。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把 push 和 pop 改成小顶堆，用同一组数跑一遍。`,
          `给 Heap 加 peek，返回堆顶但不删除；空堆返回 None。`,
          `用堆存 5 个任务名和优先级，按优先级从高到低取出。`,
          `依次 push 1 到 10，打印数组，标出每个节点和它的孩子。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：堆是完全二叉树压进数组，push 上浮、pop 下沉，根永远是最值，但整棵树不有序。` }
      ]
    },
    {
      id: `p20`, title: `第 20 课 · 优先队列：堆的日常用法`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：学会线性建堆、用固定大小的堆做 Top-K、用堆排序把数组排好，并说清它和普通排序各自的取舍。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `优先队列是每次取优先级最高的队列，堆是它最常用的实现。接口只有三个：push 放进去，pop 取走最值，peek 看一眼最值。Python 标准库的 heapq 是小顶堆，就是一张列表加几个函数；要按最大值取，就把元素取负再存。` },
        { t: `p`, text: `建堆不必一个个 push。把数组当成完全二叉树，从 n//2-1 开始依次向前对每个节点下沉。大部分节点在底层，下沉距离很短，总代价比 n 次 push 的 n log n 小。` },
        { t: `p`, text: `Top-K 求最大的 K 个，维护一个大小为 K 的小顶堆：新元素比堆顶大就替换堆顶再下沉。堆顶是这 K 个里最小的，也就是门槛。堆排序是建大顶堆后反复把根换到末尾、缩小范围再下沉，结果从后往前排好；它任何输入都是 n log n，但不是稳定排序，常数也比快排大。` },
        { t: `p`, text: `和普通排序比：sorted 是 Timsort，对部分有序的数据很快；堆排序不看输入长相，代价稳定；Top-K 只维护 K 个元素，是 n log K，不必把所有数据排一遍。选哪个，看你要「全部有序」还是「只要前几名」。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `排行榜只取前 10，不必给一万条记录排序。`,
          `任务调度按优先级出队，插队也只要对数级。`,
          `合并 K 个有序文件，每次从堆顶取最小的那个。`,
          `求第 K 大的数，堆的大小固定为 K。`
        ]},
        { t: `h2`, text: `演示 1 · 线性建堆：从最后一个非叶子往前沉` },
        { t: `p`, text: `数组 [3, 9, 4, 8, 1, 7]，n//2-1 是 2 号位的 4。从 4 开始往前，每个节点往下沉。4 和 7 换，9 不用动，3 和 9 换后再和 8 换。` },
        { t: `code`, lang: `python`, code: `def sift(a, i, n):
    while 2 * i + 1 < n:
        k = 2 * i + 1
        if k + 1 < n and a[k + 1] > a[k]: k += 1
        if a[i] >= a[k]: break
        a[i], a[k] = a[k], a[i]
        i = k
def heapify(a):
    for i in range(len(a) // 2 - 1, -1, -1): sift(a, i, len(a))
a = [3, 9, 4, 8, 1, 7]
heapify(a)
print(a)` },
        { t: `p`, text: `输出 [9, 8, 7, 3, 1, 4]。只动了 2 号和 0 号两个位置。建堆结束，根是 9，每个父亲都不小于孩子。` },
        { t: `h2`, text: `演示 2 · 堆排序：根换到末尾，范围缩小` },
        { t: `p`, text: `建好大顶堆后，把根和末尾交换，最大值就到了数组最后；范围缩小一格，新的根下沉，再重复。已排好的尾巴不再参与。` },
        { t: `code`, lang: `python`, code: `def sift(a, i, n):
    while 2 * i + 1 < n:
        k = 2 * i + 1
        if k + 1 < n and a[k + 1] > a[k]: k += 1
        if a[i] >= a[k]: break
        a[i], a[k] = a[k], a[i]
        i = k
def heapsort(a):
    for i in range(len(a) // 2 - 1, -1, -1): sift(a, i, len(a))
    for end in range(len(a) - 1, 0, -1):
        a[0], a[end] = a[end], a[0]; sift(a, 0, end)
a = [3, 9, 4, 8, 1, 7]; heapsort(a); print(a)` },
        { t: `p`, text: `输出 [1, 3, 4, 7, 8, 9]。排序没有额外数组，交换都在原数组里；代价是每次都要重建堆顶，比较次数比快排多。` },
        { t: `h2`, text: `演示 3 · Top-K：大小为 K 的小顶堆` },
        { t: `p`, text: `用标准库的 heapq 维护一个大小为 3 的小顶堆，新元素进来先 push，超过 3 个就 pop 掉最小的。最后堆里就是最大的 3 个，倒序打印，输出 [9, 8, 7]。` },
        { t: `code`, lang: `python`, code: `import heapq
def topk(nums, k):
    h = []
    for x in nums:
        heapq.heappush(h, x)
        if len(h) > k: heapq.heappop(h)
    return sorted(h, reverse=True)
print(topk([3, 9, 4, 8, 1, 7], 3))` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="24" y="24" width="592" height="252" rx="14" fill="#eef6f4"/><text x="320" y="58" font-size="18" font-weight="700" text-anchor="middle" fill="#173d36">堆排序：最大值一批批挪到右端</text><text x="70" y="98" font-size="15" fill="#4d6f67">建堆后</text><rect x="140" y="76" width="48" height="36" rx="5" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="164" y="100" font-size="15" text-anchor="middle" fill="#173d36">9</text><rect x="192" y="76" width="48" height="36" rx="5" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="216" y="100" font-size="15" text-anchor="middle" fill="#173d36">8</text><rect x="244" y="76" width="48" height="36" rx="5" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="268" y="100" font-size="15" text-anchor="middle" fill="#173d36">7</text><rect x="296" y="76" width="48" height="36" rx="5" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="320" y="100" font-size="15" text-anchor="middle" fill="#173d36">3</text><rect x="348" y="76" width="48" height="36" rx="5" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="372" y="100" font-size="15" text-anchor="middle" fill="#173d36">1</text><rect x="400" y="76" width="48" height="36" rx="5" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="424" y="100" font-size="15" text-anchor="middle" fill="#173d36">4</text><text x="70" y="158" font-size="15" fill="#4d6f67">换走 9</text><rect x="140" y="136" width="48" height="36" rx="5" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="164" y="160" font-size="15" text-anchor="middle" fill="#173d36">4</text><rect x="192" y="136" width="48" height="36" rx="5" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="216" y="160" font-size="15" text-anchor="middle" fill="#173d36">8</text><rect x="244" y="136" width="48" height="36" rx="5" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="268" y="160" font-size="15" text-anchor="middle" fill="#173d36">7</text><rect x="296" y="136" width="48" height="36" rx="5" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="320" y="160" font-size="15" text-anchor="middle" fill="#173d36">3</text><rect x="348" y="136" width="48" height="36" rx="5" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="372" y="160" font-size="15" text-anchor="middle" fill="#173d36">1</text><rect x="400" y="136" width="48" height="36" rx="5" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="424" y="160" font-size="15" text-anchor="middle" fill="#173d36">9</text><path d="M456 94H482" stroke="#2a8c78" stroke-width="2.5"/><polygon points="482,94 472,88 472,100" fill="#2a8c78"/><text x="512" y="100" font-size="15" fill="#173d36">9 已就位</text><text x="70" y="218" font-size="15" fill="#4d6f67">下沉后</text><rect x="140" y="196" width="48" height="36" rx="5" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="164" y="220" font-size="15" text-anchor="middle" fill="#173d36">8</text><rect x="192" y="196" width="48" height="36" rx="5" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="216" y="220" font-size="15" text-anchor="middle" fill="#173d36">4</text><rect x="244" y="196" width="48" height="36" rx="5" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="268" y="220" font-size="15" text-anchor="middle" fill="#173d36">7</text><rect x="296" y="196" width="48" height="36" rx="5" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="320" y="220" font-size="15" text-anchor="middle" fill="#173d36">3</text><rect x="348" y="196" width="48" height="36" rx="5" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="372" y="220" font-size="15" text-anchor="middle" fill="#173d36">1</text><rect x="400" y="196" width="48" height="36" rx="5" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="424" y="220" font-size="15" text-anchor="middle" fill="#173d36">9</text><text x="512" y="220" font-size="15" fill="#173d36">尾部变成有序区</text><text x="320" y="262" font-size="15" text-anchor="middle" fill="#4d6f67">下一轮把根 8 换到 1 前面，重复到只剩一个元素</text></svg>`, caption: `每轮把堆顶换到当前范围的末尾，范围缩一格；右边有序区逐渐变长。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `建堆从 n//2 开始，多碰了一个叶子，虽然不报错但白跑。`,
          `Top-K 用大顶堆，堆顶是当前最大的，反而把门槛抬高，应该用小顶堆。`,
          `堆排序交换后忘了缩小范围，刚放到末尾的最大值又被卷回来。`,
          `heapq 默认小顶堆，直接存正数当最大堆用，取出来的是最小值。`,
          `以为堆排序稳定；相等元素在交换中会换相对位置。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `用 heapify 建堆后，连续 pop 6 次，打印每次的结果。`,
          `写 topk(nums, k)，不用 heapq，用自己写的堆实现。`,
          `用 sorted 和自己写的堆排序排同一组 20 个数，打印两者结果并核对相等。`,
          `求第 K 大的数，比较「全部排序后取」和「大小为 K 的堆」各做了多少次比较。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：建堆从最后一个非叶子往前沉是线性的，Top-K 用大小为 K 的小顶堆，堆排序任何输入都是 n log n 但不是稳定排序。` }
      ]
    },
    {
      id: `p21`, title: `第 21 课 · 图：用邻接表存关系`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把顶点和边装进邻接表，分清清有向无向、带权不带权，并知道邻接矩阵什么时候更合适。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `图是顶点和边的集合。边连接两个顶点；有向边分起点和终点，只能顺着箭头走；无向边两边都能走。边上可以带权，表示距离、费用、时间。社交关系、地图、课程依赖、网页链接都能画成图。` },
        { t: `p`, text: `邻接表给每个顶点挂一个列表，记它直接连到谁。无向图一条边要在两边的列表里各出现一次；有向图只出现在起点的列表里。带权时列表里存邻居和权值两个值。邻接表省空间，适合边不多的稀疏图；查两点是否相邻要扫列表。` },
        { t: `p`, text: `邻接矩阵是 n 乘 n 的二维表，行是起点、列是终点，格子里放 1 或权值，没有边放 0。查一条边是常数级，但空间是顶点数的平方，只有稠密图才划算。选哪种只看两件事：图稀不稀、要不要频繁判断两点是否相邻。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `社交网络：每个人是顶点，关注关系是边。`,
          `地图导航：路口是顶点，道路是带权的边。`,
          `课程先修关系：有向边表示先学哪门。`,
          `网页链接：页面是顶点，链接是有向边。`
        ]},
        { t: `h2`, text: `演示 1 · 无向图的邻接表` },
        { t: `p`, text: `无向图 A 连 B、A 连 C、B 连 D。每加一条边，两端的列表都要追加，所以 A 的列表里有 B 和 C，B 的列表里有 A 和 D。` },
        { t: `code`, lang: `python`, code: `g = {}
def add_edge(g, a, b):
    g.setdefault(a, []).append(b)
    g.setdefault(b, []).append(a)
add_edge(g, "A", "B")
add_edge(g, "A", "C")
add_edge(g, "B", "D")
print(g)
for k in sorted(g): print(k, g[k])` },
        { t: `p`, text: `输出第一行是整张表，后面四行按顶点排序打印邻居。无向边在两边各出现一次，总长度是边数的两倍；有向图只加一次，总长度等于边数。` },
        { t: `h2`, text: `演示 2 · 有向带权图的邻接矩阵` },
        { t: `p`, text: `同一类图换成 4 乘 4 的矩阵，行是起点、列是终点。有边就填权值，没边填 0。1 到 2 有权 3，2 到 1 没有边，所以两个格子不对称。` },
        { t: `code`, lang: `python`, code: `n = 4
m = [[0] * n for _ in range(n)]
for a, b, w in [(0, 1, 3), (1, 2, 5), (2, 0, 4), (3, 2, 7)]:
    m[a][b] = w
for row in m: print(row)
print(m[1][2], m[2][1])` },
        { t: `p`, text: `输出四行矩阵，最后一行打印 5 和 0：1 到 2 的权是 5，2 到 1 没有边。矩阵查边只要两个下标，但 4 个顶点就是 16 格，1000 个顶点就是一百万格。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="24" y="24" width="592" height="252" rx="14" fill="#eef6f4"/><text x="160" y="58" font-size="18" font-weight="700" text-anchor="middle" fill="#173d36">同一张图，两种存法</text><circle cx="90" cy="120" r="22" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="90" y="126" font-size="16" text-anchor="middle" fill="#173d36">A</text><circle cx="210" cy="100" r="22" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="210" y="106" font-size="16" text-anchor="middle" fill="#173d36">B</text><circle cx="210" cy="190" r="22" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="210" y="196" font-size="16" text-anchor="middle" fill="#173d36">C</text><circle cx="310" cy="150" r="22" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="310" y="156" font-size="16" text-anchor="middle" fill="#173d36">D</text><path d="M110 112L188 102" stroke="#2a8c78" stroke-width="2.5"/><path d="M108 130L190 181" stroke="#2a8c78" stroke-width="2.5"/><path d="M231 117L295 140" stroke="#2a8c78" stroke-width="2.5"/><text x="150" y="92" font-size="15" fill="#4d6f67">A 连 B</text><text x="140" y="172" font-size="15" fill="#4d6f67">A 连 C</text><text x="258" y="116" font-size="15" fill="#4d6f67">B 连 D</text><text x="430" y="88" font-size="16" fill="#173d36">邻接表</text><text x="430" y="116" font-size="15" fill="#4d6f67">A：B、C</text><text x="430" y="140" font-size="15" fill="#4d6f67">B：A、D</text><text x="430" y="164" font-size="15" fill="#4d6f67">C：A</text><text x="430" y="188" font-size="15" fill="#4d6f67">D：B</text><text x="430" y="224" font-size="15" fill="#173d36">矩阵行是起点，列是终点</text><text x="430" y="250" font-size="15" fill="#4d6f67">无向图两边对称</text></svg>`, caption: `邻接表按顶点挂邻居，行数等于顶点数；矩阵把每个顶点对都占一格。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `无向图只加了一条边，反向漏了，遍历走不过去。`,
          `有向图当无向图加边，路径凭空多出来。`,
          `邻接矩阵拿 0 当「没有边」，但权值本身可能就是 0，要换一个哨兵。`,
          `顶点用列表这类可变对象当键，哈希不了。`,
          `稀疏图硬上矩阵，顶点一多内存就爆。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `给 add_edge 加一个权值参数，邻接表改成存邻居和权。`,
          `用邻接矩阵存演示 1 的无向图，打印矩阵并解释为什么它是对称的。`,
          `统计每个顶点的度；有向图分别统计入度和出度。`,
          `判断两个顶点是否直接相连，邻接表和邻接矩阵各写一遍。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：图是顶点加边，邻接表按点挂邻居省空间，邻接矩阵按格子查边快但费空间。` }
      ]
    },
    {
      id: `p22`, title: `第 22 课 · 图的遍历：DFS 与 BFS`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用 visited 防止绕圈，分别用栈和队列写出深度优先与广度优先，会数连通分量、会算无权最短路。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `遍历就是从某个起点出发，沿边把所有能到的顶点走一遍，每个只访问一次。visited 记录走过的点，防止绕圈：图里可能有环，不记就可能在两个点之间来回。DFS 用栈或递归，一条路走到黑再回头；BFS 用队列，先把一步能到的全走完，再走两步的。` },
        { t: `p`, text: `DFS：把起点压栈，弹出时如果没访问过就标记、处理、把未访问的邻居压栈。递归版更短：标记当前点，对每个邻居递归。BFS：起点入队并标记，出队时处理，把未访问的邻居入队并立刻标记。BFS 第一次到达某个点的步数一定是最少的，所以无权图最短路就用它。` },
        { t: `p`, text: `连通分量：无向图里从每个未访问的顶点起一次遍历，能走到的全是一伙，计数加一。邻接表下每个顶点进一次、每条边看两次，代价是顶点数加边数。DFS 和 BFS 都能数分量，区别只在访问顺序。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `迷宫最短路：每走一步算一层，BFS 先到就是最短。`,
          `社交圈：从一个人出发能认识哪些人，分成几伙。`,
          `网页爬取：从一个链接出发，把能点到的页面走一遍。`,
          `判断网络连不连通：一次遍历能不能覆盖所有顶点。`
        ]},
        { t: `h2`, text: `演示 1 · DFS：栈顶弹出，邻居压回去` },
        { t: `p`, text: `A 连 B 和 C，B 连 D。A 的邻居按 B、C 压栈，C 在栈顶先出，所以 C 比 B 先被访问。` },
        { t: `code`, lang: `python`, code: `g = {"A": ["B", "C"], "B": ["A", "D"], "C": ["A"], "D": ["B"]}
def dfs(g, start):
    seen, order, stack = set(), [], [start]
    while stack:
        v = stack.pop()
        if v in seen: continue
        seen.add(v); order.append(v)
        for w in g[v]:
            if w not in seen: stack.append(w)
    return order
print(dfs(g, "A"))` },
        { t: `p`, text: `输出 A C B D。DFS 的顺序取决于邻居压栈的顺序，不唯一；但每个点只出现一次。已经访问过的点再被弹出来就跳过，这就是 visited 的作用。` },
        { t: `h2`, text: `演示 2 · BFS：队列一层一层推` },
        { t: `p`, text: `起点入队时就标记，之后每个邻居入队前都先看标记。这样同一个点不会被两个邻居重复塞进队列。` },
        { t: `code`, lang: `python`, code: `from collections import deque
g = {"A": ["B", "C"], "B": ["A", "D"], "C": ["A"], "D": ["B"]}
def bfs(g, start):
    seen, order, q = {start}, [], deque([start])
    while q:
        v = q.popleft()
        order.append(v)
        for w in g[v]:
            if w not in seen:
                seen.add(w); q.append(w)
    return order
print(bfs(g, "A"))` },
        { t: `p`, text: `输出 A B C D，一层一层。B 和 C 都是 A 的一步邻居，先出；D 是 B 的邻居，最后出。把 order 换成距离字典，BFS 就能算出每个点到起点的步数。` },
        { t: `h2`, text: `演示 3 · 数连通分量` },
        { t: `p`, text: `A 和 B 一伙，C 和 D 一伙，E 谁也不认识，所以是 3 个分量。外层每遇到一个没访问的点就开一次遍历，计数加一。` },
        { t: `code`, lang: `python`, code: `g = {"A": ["B"], "B": ["A"], "C": ["D"], "D": ["C"], "E": []}
def comps(g):
    seen, n = set(), 0
    for s in g:
        if s in seen: continue
        n += 1; stack = [s]
        while stack:
            v = stack.pop()
            if v in seen: continue
            seen.add(v); stack += g[v]
    return n
print(comps(g))` },
        { t: `p`, text: `输出 3。内层用栈是为了省一个 deque 导入，数的结果和用队列一样；分量只关心谁和谁连着，不关心先走哪条边。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="24" y="24" width="592" height="232" rx="14" fill="#eef6f4"/><circle cx="90" cy="100" r="22" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="90" y="106" font-size="16" text-anchor="middle" fill="#173d36">A</text><circle cx="210" cy="80" r="22" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="210" y="86" font-size="16" text-anchor="middle" fill="#173d36">B</text><circle cx="210" cy="160" r="22" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="210" y="166" font-size="16" text-anchor="middle" fill="#173d36">C</text><circle cx="320" cy="120" r="22" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="320" y="126" font-size="16" text-anchor="middle" fill="#173d36">D</text><circle cx="450" cy="120" r="22" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="450" y="126" font-size="16" text-anchor="middle" fill="#173d36">E</text><path d="M110 94L188 82" stroke="#2a8c78" stroke-width="2.5"/><path d="M108 108L188 152" stroke="#2a8c78" stroke-width="2.5"/><path d="M230 92L300 112" stroke="#2a8c78" stroke-width="2.5"/><text x="90" y="200" font-size="16" fill="#173d36">DFS：A C B D</text><text x="90" y="228" font-size="16" fill="#173d36">BFS：A B C D</text><text x="400" y="200" font-size="15" fill="#4d6f67">E 谁也不连</text><text x="400" y="228" font-size="15" fill="#4d6f67">算第 3 个分量</text></svg>`, caption: `同一张图，DFS 沿着一条边扎到底，BFS 先把一圈邻居走完；孤立的 E 单独成一个分量。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `visited 在出栈时才标记，同一个点可能被重复压栈，栈会膨胀。`,
          `递归 DFS 在深图里爆栈，几千层就顶不住。`,
          `有向图从任意点出发只走一个方向，误以为整张图都连通。`,
          `BFS 用列表 pop(0)，取队头要挪整个列表。`,
          `把 BFS 的层数当成带权最短路的距离，带权图不能这样算。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `用递归写一遍 DFS，和栈版的输出顺序对比。`,
          `给 BFS 加一个 dist 字典，打印每个点到起点的步数。`,
          `数一数演示里的图有几个连通分量，再用代码验证。`,
          `把邻接表换成邻接矩阵，重写一遍 BFS。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：DFS 一条路走到黑靠栈，BFS 一层一层推靠队列，visited 在入队或入栈时就要标记。` }
      ]
    },
    {
      id: `p23`, title: `第 23 课 · 并查集：找头儿`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用 parent 数组表示一堆集合，写出 find 和 union，再加上路径压缩与按秩合并，最后数朋友圈。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `并查集维护一堆不相交的集合，只回答两个问题：某个元素的头儿是谁，叫 find；把两个集合合成一个，叫 union。每个集合用一棵树表示，parent 数组记每个元素的父亲，根的父亲指向自己。find 一路往上走到根，根就是头儿。` },
        { t: `p`, text: `两个元素 find 的结果相同，就在同一个集合。union 把一个根挂到另一个根下面。直接挂可能把树拉得很高，两种优化：路径压缩，find 时把沿路的节点直接挂到根上，下次一步到位；按秩合并，把矮的树挂到高的树下，秩可以用高度或大小。两个一起用，均摊代价接近常数。` },
        { t: `p`, text: `朋友圈就是并查集：每个人先自成一个集合，每对朋友 union 一次，最后数有几个根。判断两个人是不是朋友，find 比一下。注意 union 只合并不拆开，删除元素它做不了，这个限制用之前要想清楚。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `朋友圈：给一堆好友关系，数一共有几伙人。`,
          `网络连通：判断两台机器是不是在同一个网络里。`,
          `课程分组：把选了同一门课的学生并成一班。`,
          `等式判断：给定一堆相等关系，看有没有矛盾。`
        ]},
        { t: `h2`, text: `演示 1 · find 与 union` },
        { t: `p`, text: `6 个元素各自成集合。union 0 和 1、1 和 2，三个并成一伙，根是 0；union 3 和 4，根是 3；5 没人并，根是自己。` },
        { t: `code`, lang: `python`, code: `p = list(range(6))
def find(x):
    while p[x] != x:
        p[x] = p[p[x]]
        x = p[x]
    return x
def union(a, b):
    ra, rb = find(a), find(b)
    if ra != rb: p[rb] = ra
union(0, 1); union(1, 2); union(3, 4)
print(find(2), find(4), find(5))
print([find(i) for i in range(6)])` },
        { t: `p`, text: `第一行输出 0 3 5，都是根；第二行输出 [0, 0, 0, 3, 3, 5]，每个位置都指向自己那伙的头儿。find 里的 p[x] = p[p[x]] 就是路径压缩，往上跳的时候顺手把节点挂高一层。` },
        { t: `h2`, text: `演示 2 · 数朋友圈` },
        { t: `p`, text: `三对关系把 6 个人并成三伙，最后把所有 find 的结果装进集合，集合的大小就是朋友圈数量。` },
        { t: `code`, lang: `python`, code: `p = list(range(6))
def find(x):
    while p[x] != x:
        p[x] = p[p[x]]
        x = p[x]
    return x
def union(a, b):
    ra, rb = find(a), find(b)
    if ra != rb: p[rb] = ra
for a, b in [(0, 1), (1, 2), (3, 4)]: union(a, b)
print(len({find(i) for i in range(6)}))
print(find(0) == find(2), find(0) == find(3))` },
        { t: `p`, text: `输出 3 和 True False：一共三伙，0 和 2 同伙，0 和 3 不同伙。判断两个人是不是朋友，不需要知道他们中间隔了几层，只看根是不是同一个。` },
        { t: `h2`, text: `演示 3 · 按秩合并` },
        { t: `p`, text: `rank 记每棵树的高度上界。union 时把 rank 小的根挂到 rank 大的根下面；两个一样高才让新根加一。这样树不会被拉成一条长链。` },
        { t: `code`, lang: `python`, code: `p = list(range(6)); rank = [0] * 6
def find(x):
    while p[x] != x:
        p[x] = p[p[x]]; x = p[x]
    return x
def union(a, b):
    ra, rb = find(a), find(b)
    if ra == rb: return
    if rank[ra] < rank[rb]: ra, rb = rb, ra
    p[rb] = ra; rank[ra] += rank[ra] == rank[rb]
union(0, 1); union(2, 3); union(0, 2)
print(find(3), rank[find(3)])` },
        { t: `p`, text: `输出 0 2：三次合并后根是 0，rank 长到 2。按秩合并保证树高是对数级，路径压缩再把常数压下去；两招一起用，几万次操作也几乎感觉不到。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="24" y="24" width="592" height="232" rx="14" fill="#eef6f4"/><text x="170" y="58" font-size="18" font-weight="700" text-anchor="middle" fill="#173d36">压缩前：一条长链</text><circle cx="170" cy="88" r="20" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="170" y="94" font-size="15" text-anchor="middle" fill="#173d36">0</text><circle cx="220" cy="134" r="20" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="220" y="140" font-size="15" text-anchor="middle" fill="#173d36">1</text><circle cx="270" cy="180" r="20" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="270" y="186" font-size="15" text-anchor="middle" fill="#173d36">2</text><circle cx="320" cy="226" r="20" fill="#ffe2b8" stroke="#c9832a" stroke-width="2"/><text x="320" y="232" font-size="15" text-anchor="middle" fill="#173d36">4</text><path d="M182 104L210 120" stroke="#2a8c78" stroke-width="2.5"/><path d="M232 150L260 166" stroke="#2a8c78" stroke-width="2.5"/><path d="M282 196L310 212" stroke="#2a8c78" stroke-width="2.5"/><text x="170" y="252" font-size="15" fill="#4d6f67">find(4) 要走三步</text><path d="M392 140H440" stroke="#2a8c78" stroke-width="3"/><polygon points="440,140 430,134 430,146" fill="#2a8c78"/><text x="416" y="124" font-size="15" text-anchor="middle" fill="#c9832a">压缩</text><text x="490" y="58" font-size="18" font-weight="700" text-anchor="middle" fill="#173d36">压缩后：全挂到根</text><circle cx="490" cy="96" r="22" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="490" y="102" font-size="16" text-anchor="middle" fill="#173d36">0</text><circle cx="430" cy="180" r="20" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="430" y="186" font-size="15" text-anchor="middle" fill="#173d36">1</text><circle cx="490" cy="180" r="20" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="490" y="186" font-size="15" text-anchor="middle" fill="#173d36">2</text><circle cx="550" cy="180" r="20" fill="#ffe2b8" stroke="#c9832a" stroke-width="2"/><text x="550" y="186" font-size="15" text-anchor="middle" fill="#173d36">4</text><path d="M480 116L440 162" stroke="#2a8c78" stroke-width="2.5"/><path d="M490 118V158" stroke="#2a8c78" stroke-width="2.5"/><path d="M500 116L540 162" stroke="#2a8c78" stroke-width="2.5"/><text x="490" y="228" font-size="15" text-anchor="middle" fill="#4d6f67">find(4) 只要一步</text><text x="490" y="252" font-size="15" text-anchor="middle" fill="#173d36">下次查找直接找根</text></svg>`, caption: `路径压缩把沿路的节点直接挂到根上，链变星形，之后 find 只走一步。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `find 写成递归又不压缩，遇到长链直接爆栈。`,
          `union 忘了先 find，直接 p[a] = b，把两棵树接错。`,
          `路径压缩只改了起点，沿途节点没接上，下次还是走长链。`,
          `把 rank 当成元素编号用，合并时比较的是两个根。`,
          `想让并查集支持删除元素，它只合并不拆分。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `用并查集判断 6 个人里有几个朋友圈，把每个人和头儿打印出来。`,
          `实现按大小合并，用 size 数组记每棵树节点数，比较和按秩合并的树高。`,
          `给 find 加一个计数器，统计路径压缩前后各走了多少步。`,
          `给 5 条相等关系，判断加入最后一条时会不会出现矛盾。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：并查集就是 parent 数组加 find、union，路径压缩加按秩合并，均摊代价接近常数。` }
      ]
    },
    {
      id: `p24`, title: `第 24 课 · 排序擂台与小项目：自己写的容器上阵`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把五种排序摆在一起比清楚，再用字典加顺序结构做一个 LRU 缓存，把整门课的容器串起来。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `五种排序摆上擂台：冒泡相邻逆序就换，每轮把最大值推到末尾；插入像整理手牌，把新牌插到左边已排好的位置；归并分成两半各自排好再合并；快排选一个基准，小的放左、大的放右，再递归两边；堆排就是第 19、20 课那套。前两个平均平方级，后三个 n log n；快排最坏平方级，归并要额外空间，堆排不稳定。` },
        { t: `p`, text: `小项目 LRU 缓存：固定容量，访问一个键就把它挪到最近使用的位置；容量满了就淘汰最久没用的。索引要 O(1) 找到节点，用哈希字典；顺序要 O(1) 挪动，用双向链表：头部最新，尾部最旧。get 命中就把节点摘下来插到头部；put 新键插头部，超容量就删尾部并同步删字典里的键。` },
        { t: `p`, text: `为什么两个结构要配合：字典单独不知道谁最旧，链表单独查找要 O(n)。字典存键到节点的引用，链表存节点的前后指针，两边同时更新，才有 O(1) 的 get 和 put。单个结构各有所短，拼起来才解决问题，这就是整门课一直在练的事。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `浏览器缓存：容量满了先扔最久没打开的页面。`,
          `最近打开文件列表：用过的排到最前面。`,
          `接口结果缓存：同一个请求直接命中，不再算一遍。`,
          `排行榜：只保留最近访问的一批对象。`
        ]},
        { t: `h2`, text: `演示 1 · 冒泡与插入：平方级的两兄弟` },
        { t: `p`, text: `冒泡每轮把最大的推到右端，插入每轮把当前牌插进左边的有序段。两段代码对同一组数排两次，结果都是 [1, 2, 3, 5, 7, 9]，过程不同。` },
        { t: `code`, lang: `python`, code: `def bubble(a):
    for i in range(len(a)):
        for j in range(len(a) - 1 - i):
            if a[j] > a[j + 1]: a[j], a[j + 1] = a[j + 1], a[j]
def insertion(a):
    for i in range(1, len(a)):
        x, j = a[i], i - 1
        while j >= 0 and a[j] > x:
            a[j + 1] = a[j]; j -= 1
        a[j + 1] = x
a = [5, 2, 9, 1, 7, 3]; bubble(a); print(a)
a = [5, 2, 9, 1, 7, 3]; insertion(a); print(a)` },
        { t: `h2`, text: `演示 2 · 归并与快排：分治的两条路` },
        { t: `p`, text: `归并先递归到只剩一个元素，再两两合并；快排先按基准分区，再递归两边。归并的合并需要额外列表，快排原地分区但不稳定。` },
        { t: `code`, lang: `python`, code: `def merge(a):
    if len(a) < 2: return a
    m = len(a) // 2
    l, r = merge(a[:m]), merge(a[m:])
    out = []
    while l and r: out.append(l.pop(0) if l[0] < r[0] else r.pop(0))
    return out + l + r
def quick(a):
    if len(a) < 2: return a
    p = a[0]
    return quick([x for x in a[1:] if x < p]) + [p] + quick([x for x in a[1:] if x >= p])
a = [5, 2, 9, 1, 7, 3]; print(merge(a), quick(a))` },
        { t: `p`, text: `两行都是 [1, 2, 3, 5, 7, 9]。这段快排每次新建左右两个列表，写法短但费空间；原地分区省空间，边界更容易写错。` },
        { t: `h2`, text: `演示 3 · LRU：字典查，链表排顺序` },
        { t: `p`, text: `先用字典的插入顺序把逻辑跑通：字典最前面的键就是最久没用的。get 命中就 pop 再插回末尾，等于挪到最新；put 超容量就 pop 掉第一个键。` },
        { t: `code`, lang: `python`, code: `class LRU:
    def __init__(s, cap): s.cap, s.d = cap, {}
    def get(s, k):
        if k not in s.d: return -1
        v = s.d.pop(k); s.d[k] = v; return v
    def put(s, k, v):
        if k in s.d: s.d.pop(k)
        s.d[k] = v
        if len(s.d) > s.cap: s.d.pop(next(iter(s.d)))
l = LRU(2); l.put(1, 10); l.put(2, 20); print(l.get(1)); l.put(3, 30); print(l.get(2), l.get(3))` },
        { t: `p`, text: `先 put 1、2，get 1 之后 1 变成最新；put 3 超容量，淘汰最久没用的 2，所以 get 2 返回 -1，get 3 返回 30。字典的插入顺序在 Python 3.7 之后是语言保证的，这段才能成立。` },
        { t: `code`, lang: `text`, code: `手写版把「字典的插入顺序」换成显式的双向链表：
节点字段：key、value、prev、next
字典：key 指向节点，负责 O(1) 查找
链表：头哨兵最新，尾哨兵最旧
get 命中：摘下节点，插到头哨兵后面
put 新键：插到头部，超容量删尾哨兵前一个
删链表节点时，必须同步删字典里的 key
把 prev、next 接上，get 和 put 仍然只改几条引用，LRU 就完全跑在自己写的容器上` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="24" y="24" width="592" height="252" rx="14" fill="#eef6f4"/><text x="320" y="58" font-size="18" font-weight="700" text-anchor="middle" fill="#173d36">LRU：头部最新，尾部最旧</text><text x="70" y="102" font-size="15" fill="#4d6f67">初始</text><rect x="140" y="82" width="60" height="36" rx="6" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="170" y="106" font-size="15" text-anchor="middle" fill="#173d36">1</text><rect x="220" y="82" width="60" height="36" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="250" y="106" font-size="15" text-anchor="middle" fill="#173d36">2</text><text x="110" y="106" font-size="14" fill="#4d6f67">头</text><text x="300" y="106" font-size="14" fill="#4d6f67">尾</text><path d="M200 100H216" stroke="#2a8c78" stroke-width="2.5"/><text x="70" y="170" font-size="15" fill="#4d6f67">get 1</text><rect x="140" y="150" width="60" height="36" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="170" y="174" font-size="15" text-anchor="middle" fill="#173d36">2</text><rect x="220" y="150" width="60" height="36" rx="6" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="250" y="174" font-size="15" text-anchor="middle" fill="#173d36">1</text><path d="M200 168H216" stroke="#2a8c78" stroke-width="2.5"/><text x="330" y="174" font-size="15" fill="#173d36">1 移到头部</text><text x="70" y="238" font-size="15" fill="#4d6f67">put 3</text><rect x="140" y="218" width="60" height="36" rx="6" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="170" y="242" font-size="15" text-anchor="middle" fill="#173d36">3</text><rect x="220" y="218" width="60" height="36" rx="6" fill="#d9efe9" stroke="#2a8c78" stroke-width="2"/><text x="250" y="242" font-size="15" text-anchor="middle" fill="#173d36">1</text><rect x="300" y="218" width="60" height="36" rx="6" fill="#ffe2b8" stroke="#c9832a" stroke-width="2"/><text x="330" y="242" font-size="15" text-anchor="middle" fill="#173d36">2</text><path d="M200 236H216" stroke="#2a8c78" stroke-width="2.5"/><path d="M280 236H296" stroke="#2a8c78" stroke-width="2.5"/><text x="400" y="242" font-size="15" fill="#c9832a">2 最旧，淘汰</text><text x="400" y="106" font-size="15" fill="#4d6f67">容量 2</text><text x="400" y="134" font-size="15" fill="#4d6f67">每次访问都挪到头</text></svg>`, caption: `get 1 把 1 挪到头部；put 3 时容量已满，尾部最旧的 2 被淘汰。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `快排基准固定选第一个，遇到已经有序的数组退化成平方级。`,
          `归并合并时用 pop(0)，每取一个都要挪列表，复杂度变平方。`,
          `LRU 只更新字典不更新链表，顺序和内容对不上。`,
          `淘汰时只删链表节点，忘了删字典里的键，缓存越存越多。`,
          `默认排序都稳定，快排和堆排相等元素的相对位置会变。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把五种排序对同一组 20 个数各跑一遍，打印结果并核对五个列表相等。`,
          `把快排的基准换成随机选，重复跑已经有序的数组，比较和固定基准的差别。`,
          `给 LRU 加一个改容量的方法，缩容时把多出来的最旧键淘汰掉。`,
          `把 LRU 里字典的插入顺序换成显式的双向链表，get 和 put 都保持 O(1)。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：排序各有取舍，LRU 用字典查、链表排顺序，两件容器拼起来才是完整的缓存。` }
      ]
    }
  ]
};
