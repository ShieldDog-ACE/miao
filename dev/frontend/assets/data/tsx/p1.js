/* 喵站 · TypeScript 精通 正文分部 p1：第 1–6 课
 *
 * 导出 window.MIAO_TSX_P1 = { chapters: [...] }，由装配层按章 id 合并。
 * 六栏固定：目标 tip → 原理讲解 → 假设它能干什么 → 演示 → 常见坑 → 任务 → 一句话 tip。
 * 正文与代码里不出现反引号与模板插值符号；交叉引用只往回指。
 * 代码块全部在本机过 tsc --noEmit --strict；带运行结果的那几段另外用
 * node --experimental-strip-types 真跑过。 */
window.MIAO_TSX_P1 = {
  chapters: [
    {
      id: `tsx01`,
      title: `第 1 课 · 结构类型：形状对就行`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：说清 TypeScript 为什么按形状而不是按名字判断类型能不能用，以及多余属性、名义类型这两件事怎么应对。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `Java 与 C# 先认名字：两个类字段完全一样，类型不同就不能互换。TypeScript 反过来，只看结构：源类型的每个必需成员在目标类型里都能找到、类型也对，就能赋值。函数参数、接口实现、泛型实参，全都按这一条判定。好处是类型能像积木一样组合，不用为了对齐继承关系写一堆空壳。` },
        { t: `p`, text: `唯一的例外是对象字面量：直接写一个字面量赋给某个类型时，多出来的属性会报错，这叫 excess property check。它只在「字面量当场赋值」这一刻生效，先把对象存进变量再赋值就不查。这一条差异让很多人以为类型系统不一致，其实是两个规则：结构兼容 与 字面量新鲜度。` },
        { t: `p`, text: `真需要名义类型时自己造一个：给接口加一个不打算用的私有标记字段，或者用 brand 交叉类型。别指望类名起到 Java 那种作用——两个类字段结构相同，仍然可以互相赋值。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `给第三方库的返回值定一个只写三行的接口，字段对得上就能直接用，不用实现它。`,
          `把两个团队各自定义的形状接起来，只要字段兼容就不必共乘一份类型包。`,
          `重构时把一个大接口拆成几个小形状，靠结构兼容让调用处不改。`,
          `写单元测试时用一个手搓的字面量冒充真实对象，字段齐就行。`
        ]},
        { t: `h2`, text: `演示 1 · 兼容与不兼容` },
        { t: `code`, lang: `ts`, code: `interface Point3 { x: number; y: number; z: number }\ntype Printable = { x: number; y: number };\nfunction makePoint(): Printable {\n  return { x: 0, y: 0 };\n}\nconst p: Printable = makePoint();\nconst q: Point3 = { x: 1, y: 2, z: 3 };\nconst r: Printable = q;` },
        { t: `p`, text: `q 是三个字段，赋给只要求 x、y 的 Printable 完全合法：目标要的它都有。反过来把 Printable 赋给 Point3 会报「缺 z」，兼容性是单向的。` },
        { t: `h2`, text: `演示 2 · 多余属性只在字面量上炸` },
        { t: `code`, lang: `ts`, code: `type User = { name: string; age: number };\n// const a: User = { name: "小北", age: 18, city: "成都" };\nconst b = { name: "小北", age: 18, city: "成都" };\nconst c: User = b;` },
        { t: `p`, text: `把第一行的注释去掉再跑 tsc，它报 Object literal may only specify known properties，指出 city 不在 User 里；b 到 c 那两行则一声不响。字面量新鲜度检查到此为止，它不保证你的对象没有多余字段，只保证「当场写出来的那一份」没有。真要把多余字段挡在门外，就自己加私有标记。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="16" y="16" width="608" height="248" rx="16" fill="#eef3fb"/><text x="320" y="44" font-size="20" font-weight="700" text-anchor="middle" fill="#1a2233">兼容看目标要什么，不看源多什么</text><rect x="48" y="78" width="190" height="112" rx="12" fill="#ffffff" stroke="#2456b8" stroke-width="2.5"/><text x="143" y="102" font-size="15" text-anchor="middle" fill="#1a2233">源：Point3</text><text x="143" y="126" font-size="14" text-anchor="middle" fill="#5c6a80">x</text><text x="143" y="148" font-size="14" text-anchor="middle" fill="#5c6a80">y</text><text x="143" y="170" font-size="14" text-anchor="middle" fill="#5c6a80">z</text><path d="M240 134H392" stroke="#2456b8" stroke-width="3"/><polygon points="396,134 386,128 386,140" fill="#2456b8"/><text x="318" y="120" font-size="14" text-anchor="middle" fill="#2456b8">赋值</text><rect x="400" y="94" width="190" height="80" rx="12" fill="#2456b8"/><text x="495" y="120" font-size="15" font-weight="700" text-anchor="middle" fill="#ffffff">目标：Printable</text><text x="495" y="146" font-size="14" text-anchor="middle" fill="#dce7f8">只要求 x 与 y</text><text x="320" y="218" font-size="14" text-anchor="middle" fill="#5c6a80">反过来把 Printable 交给 Point3 就报缺 z，兼容是单向的</text><text x="320" y="244" font-size="14" text-anchor="middle" fill="#8a4308">对象字面量当场赋值才查多余属性</text></svg>`, caption: `目标要的都有就通过；多余字段只在字面量新鲜度那一关被拦。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `以为结构相同就能反过来用。少字段那一头永远是目标，不是源。`,
          `函数参数看返回值时反过来了：返回值兼容要求更严，把带额外信息的类型当参数交给窄函数是合法的。`,
          `把私有字段当装饰。两个类各写各的 private，即使字段完全一样也不兼容。`,
          `靠多余属性检查防脏数据。运行时传进来的对象类型系统管不着，那一层要用校验。`,
          `给每个接口都写 brand 标记。名义类型是特例，见一处用一处，不要当默认。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `写两个字段完全相同的类，试着互相赋值，把 tsc 报的原文抄下来，说明它和接口行为差在哪。`,
          `造一个带私有标记的形状，让「字段对得上但没标记」的对象过不去。`,
          `把演示 2 的 c 那一行改成断言写法，说出为什么这时检查就消失了。`,
          `找一个你项目里最大的接口，按使用处拆成三个小形状，让每处只要求自己要的字段。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：能不能赋值只看目标要的字段你有没有；多余属性那一关只当场生效。` }
      ]
    },
    {
      id: `tsx02`,
      title: `第 2 课 · 泛型约束：给类型加条件`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用 extends 把泛型限定在能用的范围内，并认得 keyof、类型查询这两个常用约束写法。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `泛型参数默认是 unknown：你什么都不知道，连取属性都不行。写 T extends 某个形状，就是告诉编译器「我至少要这些」，函数体里就能按这个形状用。约束不是限制调用方传什么类型进来，而是限制你在函数里能对它做什么。` },
        { t: `p`, text: `两种常用形式。第一种按形状约束：T extends { id: number }，凡是带 id 的对象都能传。第二种按键约束：K extends keyof T，把第二个参数的取值限定成第一个类型的属性名，返回值写成 T[K]，读出来就是那个属性的类型——这条链叫「类型查询 + 索引访问」。` },
        { t: `p`, text: `约束还有一个常被漏掉的用法：给泛型带默认值，T extends string = string。调用方不写就用默认；写了不兼容的类型，报错落在调用处而不是函数内部，排查时看一眼就知道是谁的问题。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `写一个 pickFields，字段名传错当场报，不用运行时 if 判断。`,
          `给接口封装一层泛型：请求参数类型跟着返回类型走，改一处不改十处。`,
          `把「必须有 id」这类约定写进约束，谁传错谁看到红。`,
          `给配置合并函数加约束，多余键通不过，配置项名字拼错在写的时候就发现。`
        ]},
        { t: `h2`, text: `演示 1 · 按键约束读属性` },
        { t: `code`, lang: `ts`, code: `function pick<T extends object, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\nconst user = { name: "小北", age: 18, vip: true };\nconst n: string = pick(user, "name");\nconst a: number = pick(user, "age");\nconst bad = pick(user, "name");\n// const bad2 = pick(user, "gender");` },
        { t: `p`, text: `本机 tsc 的结果：前两行按属性名分别推出 string 与 number；把最后一行的注释去掉，它报 Argument of type 不能赋给 type，候选只有 name、age、vip 三个。属性名的拼写错误被压到编译期，这就是 K extends keyof T 的全部价值。` },
        { t: `h2`, text: `演示 2 · 形状约束与默认值` },
        { t: `code`, lang: `ts`, code: `type WithId = { id: number };\nfunction indexById<T extends WithId>(list: T[], extra?: string): Map<number, T> {\n  const map = new Map<number, T>();\n  for (const item of list) map.set(item.id, item);\n  return map;\n}\nconst notes = indexById([{ id: 1, title: "第一则" }]);\nconst one = notes.get(1);\nconsole.log(one === undefined ? "没有" : one.title);` },
        { t: `p`, text: `T 被约束成带 id 的形状，函数体里才能读 item.id；调用时传的元素类型保留了 title，所以 one.title 通得过。用 node 直接跑这段，输出 第一则。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="16" y="16" width="608" height="248" rx="16" fill="#eef3fb"/><text x="320" y="44" font-size="20" font-weight="700" text-anchor="middle" fill="#1a2233">约束划出一条链：键限定属性名，类型跟着走</text><rect x="40" y="82" width="150" height="56" rx="10" fill="#ffffff" stroke="#2456b8" stroke-width="2"/><text x="115" y="106" font-size="15" text-anchor="middle" fill="#1a2233">T extends object</text><text x="115" y="126" font-size="14" text-anchor="middle" fill="#5c6a80">是个对象</text><rect x="245" y="82" width="150" height="56" rx="10" fill="#ffffff" stroke="#2456b8" stroke-width="2"/><text x="320" y="106" font-size="15" text-anchor="middle" fill="#1a2233">K extends keyof T</text><text x="320" y="126" font-size="14" text-anchor="middle" fill="#5c6a80">键必须是属性名</text><rect x="450" y="82" width="150" height="56" rx="10" fill="#2456b8"/><text x="525" y="106" font-size="15" font-weight="700" text-anchor="middle" fill="#ffffff">返回 T[K]</text><text x="525" y="126" font-size="14" text-anchor="middle" fill="#dce7f8">类型自己定下来</text><path d="M190 110H241M395 110H446" stroke="#2456b8" stroke-width="3"/><polygon points="243,110 233,104 233,116" fill="#2456b8"/><polygon points="448,110 438,104 438,116" fill="#2456b8"/><rect x="150" y="176" width="340" height="58" rx="10" fill="#ffffff" stroke="#8a4308" stroke-width="2"/><text x="320" y="200" font-size="14" text-anchor="middle" fill="#1a2233">pick(user, gender) 走不通</text><text x="320" y="222" font-size="14" text-anchor="middle" fill="#8a4308">候选只有 name、age、vip</text><path d="M320 174V142" stroke="#8a4308" stroke-width="2.5" stroke-dasharray="6 5"/><polygon points="320,140 314,152 326,152" fill="#8a4308"/></svg>`, caption: `约束不是限制传参，是给函数体争取到能用的操作。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `忘写约束就在函数里点属性，编译器报「T 上不存在该属性」，然后随手加个 any 把话堵住。`,
          `把 keyof T 当成字符串类型用，K 就丢了和属性的对应关系，返回值退化成 unknown。`,
          `约束写成具体类型：T extends User 会把调用方压成 User，多出来的字段看不见了。`,
          `泛型套泛型层层传递，最后没人看得出哪个参数是谁。参数超过三个就该拆函数。`,
          `在需要类型的地方传值，比如把变量当 keyof 用；类型层和值层不能互换。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `写一个 setField，参数依次是对象、属性名、该属性对应类型的值，验证传错类型时报错。`,
          `把演示 1 的 K 改成 string，看返回类型变成什么，说明为什么这条链断了。`,
          `给 indexById 加一个默认约束，让它对没有 id 的元素类型直接拒绝。`,
          `找一个自己项目里的工具函数，加上 keyof 约束，让调用处的拼写错误能在编译期被抓出来。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：extends 决定函数里能对 T 做什么；keyof 加索引访问决定返回值是什么类型。` }
      ]
    },
    {
      id: `tsx03`,
      title: `第 3 课 · 条件类型：类型层面的 if`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：会写 T extends U ? X : Y 这一手，知道它在泛型上是分布式的意思，并认 infer 怎么从类型里抠出内层类型。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `条件类型让类型跟着一个判断走。最朴素的用法是给具体类型选分支：IsStr 写成 T extends string 的分支，传 string 得到 yes，传 number 得到 no。有意思的是当 T 是泛型参数且未被具体赋值时，编译器会推迟判断，等实参确定再算。` },
        { t: `p`, text: `第二条规则叫分布式：当条件类型作用在「裸的」泛型参数上，联合类型的每个成员会分别算一遍再合起来。T 是 string 与 number 的联合时，结果不是 no，而是 yes 和 no 的联合。想关掉它，就把 T 包进元组：[T] extends [U]，这时判断的是整个联合。` },
        { t: `p`, text: `infer 用来从匹配的模式里取名字。判断函数返回类型时写 T extends (...args: any[]) => infer R ? R : never，R 就是抠出来的返回值类型。同理能从数组、Promise、联合里抠出元素类型。后面两课全建在这三个工具上。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `写一个 Unwrap，把可能包着 Promise、可能不包的返回值统一还原成最终类型。`,
          `让接口的返回类型跟着请求参数变：传 id 得到详情，传列表参数得到数组。`,
          `把可选属性自动去掉：只保留传了的那些键，写 update 类函数时用。`,
          `给校验函数造一个「schema 形状决定结果类型」的推断，后面讲接口校验那一课会真用一次。`
        ]},
        { t: `h2`, text: `演示 1 · 分支与分布式` },
        { t: `code`, lang: `ts`, code: `type IsStr<T> = T extends string ? "yes" : "no";\ntype A = IsStr<string>;\ntype B = IsStr<string | number>;\ntype C = [string | number] extends [string] ? "yes" : "no";\nconst a: A = "yes";\nconst b: B = "no";\nconst c: C = "no";\nconsole.log(a, b, c);` },
        { t: `p`, text: `tsc 通得过：B 是 yes 与 no 的联合，所以 "no" 合法；C 因为把联合包进了元组，判断变成「整个联合是不是 string 的子类型」，答案是否。这两条规则的区别就在有没有那对方括号。` },
        { t: `h2`, text: `演示 2 · 用 infer 剥壳` },
        { t: `code`, lang: `ts`, code: `type Unwrap<T> = T extends Promise<infer V> ? Unwrap<V> : T;\ntype Last = Unwrap<Promise<Promise<number>>>;\nconst last: Last = 42;\nconsole.log(last);` },
        { t: `p`, text: `Unwrap 递归剥 Promise，两层也剥干净，Last 就是 number。node 跑这段输出 42。这一手在真实项目里出现在两处：异步 API 的类型还原，和 Agent 那一课要把工具函数签名还原成参数表。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="16" y="16" width="608" height="248" rx="16" fill="#eef3fb"/><text x="320" y="44" font-size="20" font-weight="700" text-anchor="middle" fill="#1a2233">同一个条件类型，两种判法</text><rect x="42" y="76" width="250" height="70" rx="11" fill="#ffffff" stroke="#2456b8" stroke-width="2"/><text x="167" y="100" font-size="15" text-anchor="middle" fill="#1a2233">T 是裸泛型参数</text><text x="167" y="122" font-size="14" text-anchor="middle" fill="#5c6a80">联合类型逐个成员算</text><rect x="348" y="76" width="250" height="70" rx="11" fill="#ffffff" stroke="#8a4308" stroke-width="2"/><text x="473" y="100" font-size="15" text-anchor="middle" fill="#1a2233">[T] 包进元组</text><text x="473" y="122" font-size="14" text-anchor="middle" fill="#5c6a80">把联合当整体判一次</text><rect x="42" y="168" width="250" height="58" rx="11" fill="#2456b8"/><text x="167" y="192" font-size="14" text-anchor="middle" fill="#ffffff">string｜number 得到 yes｜no</text><text x="167" y="212" font-size="14" text-anchor="middle" fill="#dce7f8">分布式</text><rect x="348" y="168" width="250" height="58" rx="11" fill="#8a4308"/><text x="473" y="192" font-size="14" text-anchor="middle" fill="#ffffff">同样入参只得到一个 no</text><text x="473" y="212" font-size="14" text-anchor="middle" fill="#f6e2cf">不分布</text><text x="320" y="252" font-size="14" text-anchor="middle" fill="#5c6a80">infer 出现在被匹配的那一侧，把内层类型抠出来命名</text></svg>`, caption: `一行方括号决定是逐个算还是整体算；infer 负责把内层类型捞出来。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `在类型别名里对具体类型写条件，永远只算一次，看不出分布式；测分布式必须拿联合去试。`,
          `把 never 当空值传进去。条件是 never 时分布式结果也是 never，看着像 bug。`,
          `infer 出来的名字重复使用。同一个作用域里 infer 同名的两次会打架。`,
          `条件类型套三四层，报错信息变成一串 unknown，谁也读不出来；超过两层就拆开。`,
          `忘记「约束优先」：T extends string 之后又写 T extends number 的分支，永远走不到 else。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `写一个 IsAny<T>：any 会让两个分支都成立，用它把 any 单独挑出来，并解释为什么加方括号。`,
          `写一个 Element<T>，从数组、元组、Promise 三种壳里各取出内层类型。`,
          `把 Unwrap 改成只剥一层，用两层 Promise 试出差别。`,
          `给上一课的 pick 加一条：当 K 是 Promise 属性时返回它的内层类型，写不通就先说明卡在哪。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：条件类型是类型层的 if，裸泛型会分布，方括号能关掉分布，infer 负责把内层捞出来。` }
      ]
    },
    {
      id: `tsx04`,
      title: `第 4 课 · 映射类型：批量改造形状`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用 [K in keyof T] 一次改写所有属性，会加可选与只读修饰符，并知道键重映射能拿名字做文章。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `映射类型是对「属性集合」做循环。写 [K in keyof T] 就等于把 T 的每个属性名取出来，逐个按新规则重新声明：值类型可以换成 Partial 里的、Promise 包起来的、或者干脆换成函数。标准库的 Partial、Readonly、Record、Pick、Omit 全是它的特例，看清一个，其余五个只是加了不同修饰。` },
        { t: `p`, text: `修饰符有三种手感。加 ? 让属性可选，减掉它（-?）把已有可选变必选；readonly 同理，减号写法 -readonly 能去掉只读。这两个开关决定了一个「输入形状」怎么变成「请求形状」——PATCH 接口要的正是全可选的那一份。` },
        { t: `p`, text: `键重映射用 as：在 [K in keyof T as 新键名] 里可以拼字符串字面量类型。把每个属性名换成 get + 首字母大写，就得到一个方法表形状；换成 值等于 null 的键，就得到一个筛掉的视图。这一步只在类型层跑，不会生成任何代码，实现仍要你自己写。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `一份 User 定义，自动推出 UpdateInput（全可选）和 AsyncUser（每个属性变 Promise）。`,
          `把 schema 对象上的字段自动展开成 getter 类型，前端表格列定义少写一半。`,
          `把所有函数的参数包一层上下文，批量做出中间件形状。`,
          `给配置加一层 Required，写死默认值之后类型不再允许漏项。`
        ]},
        { t: `h2`, text: `演示 1 · 三个映射类型` },
        { t: `code`, lang: `ts`, code: `type Patch<T> = { [K in keyof T]?: T[K] };\ntype Async<T> = { [K in keyof T]: Promise<T[K]> };\ntype Full<T> = { [K in keyof T]-?: T[K] };\ntype User = { name: string; age?: number };\nconst p: Patch<User> = { age: 18 };\nconst f: Full<User> = { name: "小北", age: 18 };` },
        { t: `p`, text: `p 只传 age 合法，因为全属性被加了问号；f 必须同时给 name 与 age，减问号把 age 拉回必选。这两行是同一套语法的两面。` },
        { t: `h2`, text: `演示 2 · 用 as 把不合格的键甩掉` },
        { t: `p`, text: `as 后面写 never，那个键就不出现在结果里。下面这一手用来「只保留文字字段」，比手写两遍接口省事。` },
        { t: `code`, lang: `ts`, code: `type OnlyStrings<T> = { [K in keyof T as T[K] extends string ? K : never]: T[K] };\ntype Labels = { name: string; age: number; vip: boolean; city: string };\ntype TextOnly = OnlyStrings<Labels>;\nconst row: TextOnly = { name: "小北", city: "成都" };\nconsole.log(row.name.length + row.city.length);` },
        { t: `p`, text: `TextOnly 只剩 name 与 city 两个键，age 和 vip 因为值不是 string 被 never 掉了；node 跑这段输出 5。键名本身也能重映射，社区常用模板字面量类型拼前缀（本站正文不许出现那种反引号写法），换一张查表也能达到同样效果：把 K 交给一个常量表映射出新键名，表里没有的键给 never。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="16" y="16" width="608" height="248" rx="16" fill="#eef3fb"/><text x="320" y="44" font-size="20" font-weight="700" text-anchor="middle" fill="#1a2233">一次循环，改的是值和键两样</text><rect x="40" y="76" width="170" height="92" rx="11" fill="#ffffff" stroke="#2456b8" stroke-width="2"/><text x="125" y="98" font-size="15" text-anchor="middle" fill="#1a2233">原形状 T</text><text x="125" y="120" font-size="14" text-anchor="middle" fill="#5c6a80">name city age vip</text><text x="125" y="142" font-size="14" text-anchor="middle" fill="#5c6a80">两种值类型</text><path d="M210 122H284" stroke="#2456b8" stroke-width="3"/><polygon points="288,122 278,116 278,128" fill="#2456b8"/><text x="248" y="106" font-size="14" text-anchor="middle" fill="#2456b8">in keyof T</text><rect x="296" y="76" width="150" height="92" rx="11" fill="#ffffff" stroke="#2456b8" stroke-width="2"/><text x="371" y="98" font-size="15" text-anchor="middle" fill="#1a2233">改值</text><text x="371" y="120" font-size="14" text-anchor="middle" fill="#5c6a80">加问号或减问号</text><text x="371" y="142" font-size="14" text-anchor="middle" fill="#5c6a80">包一层 Promise</text><rect x="478" y="76" width="122" height="92" rx="11" fill="#2456b8"/><text x="539" y="98" font-size="15" font-weight="700" text-anchor="middle" fill="#ffffff">as 改键</text><text x="539" y="122" font-size="14" text-anchor="middle" fill="#dce7f8">留下 name city</text><text x="539" y="144" font-size="14" text-anchor="middle" fill="#dce7f8">never 掉两个</text><path d="M446 122H474" stroke="#2456b8" stroke-width="3"/><polygon points="476,122 466,116 466,128" fill="#2456b8"/><text x="320" y="200" font-size="14" text-anchor="middle" fill="#5c6a80">标准库的 Partial、Readonly、Record、Pick、Omit 都是这套语法的特例</text><text x="320" y="230" font-size="14" text-anchor="middle" fill="#8a4308">as 只改类型层的键名，不生成任何实现代码</text></svg>`, caption: `in 决定遍历谁，右边决定值怎么变，as 决定键留下还是丢掉。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把映射类型当成运行时转换。类型编译后全消失，字段不会自己变。`,
          `只对 keyof T 里的键做映射，索引签名和多余字段会照原样留着。`,
          `忘写 as 的 never 分支：非字符串的键经键重映射会变 never，属性被静默丢掉。`,
          `-? 与 ? 混用，得到的形状和预期反了；先在注释里写下期望的两个形状再动手。`,
          `一个映射类型里同时改值、改键、加条件，读的人要解三层；拆开写更好读。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `自己写一遍 Partial 与 Record，再用它们做两个不同类型，看 tsc 报错是否一致。`,
          `写一个 ToNull<T>，把每个属性的值类型换成 null，键保持不变。`,
          `写一个 SetterName<K>，把 name 变成 setName，再套进 Methods 造一份 setter 表。`,
          `给接口校验那一课准备一个 SchemaToType，把字段类型表映射成真实类型；写不出来就记下卡住的那一步。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：映射类型是类型层的 for 循环，in 遍历键，右边改值，as 改键名，编译之后什么都不剩。` }
      ]
    },
    {
      id: `tsx05`,
      title: `第 5 课 · 类型体操：从类型到类型`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把前三课的工具拼成能用的类型函数，并学会用断言型测试把它钉住，别写没人检查的类型。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `类型体操不是炫技，是把「接口形状之间的关系」写成可复用的规则。拼法有固定顺序：条件类型判分支，infer 取内层，映射类型批量改写，最后交给使用处。难点从来不是语法，而是可读性——一个三百行的类型别名谁都改不动。` },
        { t: `p`, text: `控制可读性的工具是拆分与命名：每层只做一件事，名字说明它做什么。第二个工具是测试：给自己写一个 Expect 断言类型，用类型层的相等判断比对结果，把测试写进仓库。这样改一行不会悄悄退化。类型测试不需要跑，tsc 过就是绿。` },
        { t: `p`, text: `有一条实用的相等判断写法：把两个类型放进函数的两个重载参数，用「两边都能互赋」近似相等。真正的严格相等要靠一个技巧：把类型当参数交给一个泛型函数，参数默认值写成两边互指，类型不一致时默认值通不过。这套写起来绕，但它就是社区常用的 Equal。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `写一个 Routes 类型：路径表自动展开成带参数的 handler 形状，路由表少写一半类型。`,
          `给 Agent 那几课准备 ToolSchema：从函数签名自动倒推出参数类型表，供模型看。`,
          `把接口返回的包装层统一剥掉，前端只关心最终形状。`,
          `给一份 JSON 配置生成它的字面量类型，漏项、多项都当场报。`
        ]},
        { t: `h2`, text: `演示 1 · 拆一条链` },
        { t: `code`, lang: `ts`, code: `type Params<F> = F extends (arg: infer A) => any ? A : never;\ntype Result<F> = F extends (arg: any) => infer R ? R : never;\ntype Handler = (query: { page: number }) => Promise<string[]>;\ntype P = Params<Handler>;\ntype R = Result<Handler>;\nconst p: P = { page: 2 };\nconst r: R = Promise.resolve(["第一页"]);\nr.then((v) => console.log(p.page, v.length));` },
        { t: `p`, text: `同一份 Handler，两次推断各取一头：参数形状和返回形状。链上每一层只判一件事，名字说清取哪一头；把它写成一个大条件类型，读的人就要自己解括号。` },
        { t: `h2`, text: `演示 2 · 给类型写测试` },
        { t: `code`, lang: `ts`, code: `type Params<F> = F extends (arg: infer A) => any ? A : never;\ntype Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;\ntype Expect<T extends true> = T;\ntype P = Params<(query: { page: number }) => Promise<string[]>>;\ntype CheckP = Expect<Equal<P, { page: number }>>;\n// type Oops = Expect<Equal<P, { page: string }>>;` },
        { t: `p`, text: `本机 tsc 的结果：CheckP 那一行按预期通过；把 Oops 那行的注释去掉，它报 Type false does not satisfy the constraint true，错误的等式被当场拦下。这一段是纯类型，没有运行时；Equal 那个写法看起来绕，但它能区分 any 与具体类型，社区用了很多年。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="16" y="16" width="608" height="248" rx="16" fill="#eef3fb"/><text x="320" y="44" font-size="20" font-weight="700" text-anchor="middle" fill="#1a2233">一条类型链的三段，各配一个名字</text><rect x="46" y="80" width="150" height="52" rx="10" fill="#ffffff" stroke="#2456b8" stroke-width="2"/><text x="121" y="102" font-size="15" text-anchor="middle" fill="#1a2233">判分支</text><text x="121" y="122" font-size="14" text-anchor="middle" fill="#5c6a80">条件类型</text><rect x="245" y="80" width="150" height="52" rx="10" fill="#ffffff" stroke="#2456b8" stroke-width="2"/><text x="320" y="102" font-size="15" text-anchor="middle" fill="#1a2233">取内层</text><text x="320" y="122" font-size="14" text-anchor="middle" fill="#5c6a80">infer</text><rect x="444" y="80" width="150" height="52" rx="10" fill="#ffffff" stroke="#2456b8" stroke-width="2"/><text x="519" y="102" font-size="15" text-anchor="middle" fill="#1a2233">批量改写</text><text x="519" y="122" font-size="14" text-anchor="middle" fill="#5c6a80">映射类型</text><path d="M196 106H241M395 106H440" stroke="#2456b8" stroke-width="3"/><polygon points="243,106 233,100 233,112" fill="#2456b8"/><polygon points="442,106 432,100 432,112" fill="#2456b8"/><rect x="140" y="164" width="360" height="56" rx="10" fill="#8a4308"/><text x="320" y="188" font-size="15" font-weight="700" text-anchor="middle" fill="#ffffff">Expect 与 Equal 把每一段钉住</text><text x="320" y="208" font-size="14" text-anchor="middle" fill="#f6e2cf">改一行不会悄悄退化，tsc 过就是绿</text><path d="M320 160V136" stroke="#8a4308" stroke-width="2.5" stroke-dasharray="6 5"/><polygon points="320,134 314,146 326,146" fill="#8a4308"/></svg>`, caption: `每层一个名字，外面配一套类型测试；这两条把体操变成工程。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `一个类型别名里堆四层条件与映射。报错时编译器给的是 unknown 串，读不出来。`,
          `不写类型测试，靠肉眼比对展开结果；下一次重构就悄悄退化了。`,
          `把体操当默认方案。能用一条约束解决的，别上 infer。`,
          `忽略 any 会污染判断：any 让条件类型的两个分支都成立，先加 IsAny 挡一道。`,
          `在类型里做业务计算，比如穷举所有排列。类型层算得越狠，编译越慢。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `给演示 1 再写一头 Args：从两个参数的函数里取参数元组，并用 Expect 钉住。`,
          `把 Equal 换成「两边互赋」的简写版，构造一个 any 与具体类型的例子，看它哪里判错。`,
          `为一个真实函数写三行类型测试，分别断言参数、返回值和错误形状。`,
          `找一个你写过的复杂类型别名，按三段拆成三个有名字的层，比较报错可读性。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：能拆成三段就别写成一层；每段配一条 Expect，类型才算有测试。` }
      ]
    },
    {
      id: `tsx06`,
      title: `第 6 课 · 框架类型：组件 props`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：给组件写清 props 的形状，会处理 children、事件对象和泛型组件，并知道类型什么时候开始骗人。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `组件本质是一个函数，props 是它的唯一参数，所以第 1 课的结构兼容在这里全盘适用：props 接口只要声明用到的字段，传对象时多带字段也合法，但字面量直传会被新鲜度检查拦住。团队里常见的写法是给每个组件配一个 Props 类型，放进同名文件，导出时类型也导出，别人写调用处才不用自己猜。` },
        { t: `p`, text: `children 单独处理：形状写成 ReactNode，别写死 string 或数组，否则换一种写法就报错。事件参数别自己造类型，从框架的类型里取；自己拼一个 { target: HTMLInputElement } 会和真正的事件对象不兼容，回调签名要写成框架给的类型或干脆让参数类型推断出来。` },
        { t: `p`, text: `泛型组件解决「数据结构不知道但值要知道」。列表组件把行类型做成参数，点击回调收到的 item 就是那一行的类型。这条链靠第 2 课的约束撑着：参数默认约束成带 id 的形状，key 属性才敢直接读。类型骗人的时刻也很典型：接口返回打上 any、或者用 as 强转，编译器立刻点头，但运行时那份数据一个字都没变。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `一个 Table 组件让调用处的列名和行数据类型连起来，改字段不会漏掉调用点。`,
          `把 props 类型抽出来共用，多个组件的相同字段一处改。`,
          `给回调标出精确的事件类型，preventDefault 这种调用才不会被写错。`,
          `让状态里的联合类型在渲染分支里自动收窄，不写 if 判断也不会读到不存在的字段。`
        ]},
        { t: `h2`, text: `演示 · 一个泛型列表的形状` },
        { t: `p`, text: `这里用纯 TypeScript 把组件签名写成函数形状，不依赖框架包，tsc 能直接查。真实项目里同样的类型套在组件参数上即可。` },
        { t: `code`, lang: `ts`, code: `type Row = { id: number; label: string };\ntype ListProps<T extends Row> = {\n  items: T[];\n  onPick: (item: T) => void;\n  empty?: string;\n};\nfunction render<T extends Row>(props: ListProps<T>): string {\n  if (props.items.length === 0) return props.empty ?? "空";\n  return props.items.map((it) => it.label).join(",");\n}\nconst out = render({ items: [{ id: 1, label: "甲", done: true }], onPick: () => {} });\nconsole.log(out);` },
        { t: `p`, text: `T 保留了调用处传进来的形状，所以 items 里多带 done 字段照样合法，onPick 收到的 item 上也看得见 done。这里 node 实跑输出 甲。` },
        { t: `code`, lang: `ts`, code: `type Row = { id: number; label: string };\ntype ListProps<T extends Row> = { items: T[]; onPick: (item: T) => void };\nfunction pickFirst<T extends Row>(props: ListProps<T>): T | undefined {\n  return props.items[0];\n}\nconst first = pickFirst({ items: [{ id: 2, label: "乙" }], onPick: () => {} });\nif (first) console.log(first.label);` },
        { t: `p`, text: `接上一段，返回类型是 T 加 undefined，所以取字段之前必须判空。这不是编译器为难你：列表为空是真实存在的情况，判空漏掉就是运行时报错。空数组时上面的 if 不成立，输出那行不会打——这条链就是靠类型逼着你写对。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="16" y="16" width="608" height="248" rx="16" fill="#eef3fb"/><text x="320" y="44" font-size="20" font-weight="700" text-anchor="middle" fill="#1a2233">props 上的一条链：形状进来，值类型出去</text><rect x="44" y="78" width="180" height="66" rx="11" fill="#ffffff" stroke="#2456b8" stroke-width="2"/><text x="134" y="102" font-size="15" text-anchor="middle" fill="#1a2233">调用处传的对象</text><text x="134" y="124" font-size="14" text-anchor="middle" fill="#5c6a80">items 带额外字段</text><rect x="270" y="78" width="170" height="66" rx="11" fill="#2456b8"/><text x="355" y="102" font-size="15" font-weight="700" text-anchor="middle" fill="#ffffff">T 被推出来</text><text x="355" y="124" font-size="14" text-anchor="middle" fill="#dce7f8">保留真实形状</text><rect x="486" y="78" width="114" height="66" rx="11" fill="#ffffff" stroke="#2456b8" stroke-width="2"/><text x="543" y="102" font-size="15" text-anchor="middle" fill="#1a2233">onPick</text><text x="543" y="124" font-size="14" text-anchor="middle" fill="#5c6a80">item: T</text><path d="M224 111H266M440 111H482" stroke="#2456b8" stroke-width="3"/><polygon points="268,111 258,105 258,117" fill="#2456b8"/><polygon points="484,111 474,105 474,117" fill="#2456b8"/><rect x="140" y="172" width="360" height="56" rx="11" fill="#ffffff" stroke="#8a4308" stroke-width="2"/><text x="320" y="196" font-size="14" text-anchor="middle" fill="#1a2233">返回值是 T 或 undefined</text><text x="320" y="216" font-size="14" text-anchor="middle" fill="#8a4308">取字段之前必须先判空，这一步没有捷径</text><path d="M320 170V148" stroke="#8a4308" stroke-width="2.5" stroke-dasharray="6 5"/><polygon points="320,146 314,158 326,158" fill="#8a4308"/></svg>`, caption: `泛型把调用处真实形状带进来，回调和返回值都跟着它，不用 as 硬讲。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `给 props 写一个字段都不缺的大接口，调用处被迫填一堆默认值，最后大家用 as 绕开。`,
          `children 写成 string 或数组，框架给的是别的形状，一嵌套就报错。`,
          `自己造事件类型。手写 target 字段和真实事件对象结构不同，改一处错一处。`,
          `接口数据先 as 成需要的类型。类型系统闭嘴了，运行时照样是字符串当数字用。`,
          `泛型组件把 T 约束得太死，调用处传进来的额外字段被抹平，取值时报不存在。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把演示里的 empty 从可选字符串改成可选函数，让 render 里那一条链跟着改通。`,
          `给 ListProps 再加一个可选 filter 参数，类型上要能保证过滤后仍拿到 T。`,
          `把 first 那一处的 if 去掉，抄下 tsc 的报错原文，说明它在防哪一次线上事故。`,
          `找一份自己写过的组件 props，删掉调用处根本不会传的字段，看能减掉多少行。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：props 的类型只声明用到的，泛型把调用处的形状一路带到回调和返回值；as 换来的安静不是安全。` }
      ]
    },
  ],
};
