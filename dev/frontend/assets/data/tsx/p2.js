/* 喵站 · TypeScript 精通 正文分部 p2：第 7–12 课
 *
 * 导出 window.MIAO_TSX_P2 = { chapters: [...] }，由装配层按章 id 合并。
 * 六栏固定：目标 tip → 原理讲解 → 假设它能干什么 → 演示 → 常见坑 → 任务 → 一句话 tip。
 * 正文与代码里不出现反引号与模板插值符号；交叉引用只许往回指。
 * 代码块全部在本机过 tsc --noEmit --strict；带输出结果的那几段另外用
 * node --experimental-strip-types 真跑过。 */
window.MIAO_TSX_P2 = {
  chapters: [
    {
      id: `tsx07`,
      title: `第 7 课 · 全栈契约：接口校验`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把「类型」和「校验」这两件事分开——类型管编译期，校验管运行时，再用同一份形状推断出前端能用的类型。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `类型编译之后全没了。服务器返回的那份 JSON 不认识你的接口，字段少一个、数字变成字符串、null 混进来，tsc 一声不会响。所以真实项目里必须有两道独立的关：编译期靠类型标注，运行时靠校验器把外部数据过一遍，只有过了的数据才允许被当成那个类型使用。` },
        { t: `p`, text: `校验器（zod、valibot 这类）真正的价值不是判类型，而是「一份声明两头用」：同一份 schema 既能在运行时 parse，又能在类型层推出对应的 TS 类型。于是接口字段改了一处，前后端两头的类型跟着动，谁没改到位，tsc 立刻报出来。这就是所谓契约。` },
        { t: `p`, text: `契约还包含错误形状。成功返回什么、失败返回什么是接口定义的一部分：错误码、字段级提示、可重试标记。前端按这一份写分支，就不会出现「后端换了错误格式，前端白屏」这种事故。最后加一类契约测试：拿服务器真实响应跑一次 parse，字段漂移在 CI 里就红。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `接口新增字段时，前端一处 schema 改完，所有用到该字段的地方由编译器指出。`,
          `脏数据进不了业务层：parse 阶段就报错，业务函数拿到的一定是干净形状。`,
          `错误提示能落到具体字段上，而不是整页一句「请求失败」。`,
          `后端改了返回结构，契约测试先红，不用等用户报障。`
        ]},
        { t: `h2`, text: `演示 1 · 一份声明两头用` },
        { t: `p`, text: `这里不用第三方包，手写一个极小校验器，为的是看清那条链：字段描述、运行时 parse、类型推断，三件事各占一段。` },
        { t: `code`, lang: `ts`, code: `type FieldDef = { kind: "string" | "number" | "boolean"; optional?: boolean };\ntype Schema = Record<string, FieldDef>;\ntype Out<S extends Schema> = { [K in keyof S]: S[K]["kind"] };\nfunction parse<S extends Schema>(s: S, data: Record<string, unknown>): Out<S> | string[] {\n  const err: string[] = [];\n  const out: Record<string, unknown> = {};\n  for (const k of Object.keys(s)) {\n    const v = data[k];\n    if (v === undefined) { if (!s[k].optional) err.push(k + " 缺字段"); continue; }\n    if (typeof v !== s[k].kind) { err.push(k + " 要是 " + s[k].kind); continue; }\n    out[k] = v;\n  }\n  return err.length ? err : (out as Out<S>);\n}` },
        { t: `code`, lang: `ts`, code: `// 接上一段\nconst userSchema = { name: { kind: "string" }, age: { kind: "number" }, vip: { kind: "boolean", optional: true } } as const;\ntype User = Out<typeof userSchema>;\nconst ok = parse(userSchema, { name: "小北", age: 18 });\nconst bad = parse(userSchema, { name: "小北", age: "十八" });\nconsole.log(JSON.stringify(ok), JSON.stringify(bad));` },
        { t: `p`, text: `本机跑出来的结果是 {"name":"小北","age":18} 和 ["age 要是 number"]。User 这个类型由 schema 推出来，不是手写的——把 age 那条改成 string，User 立刻跟着变，所有读 user.age 做数学的地方当场红。` },
        { t: `h2`, text: `演示 2 · 断言是自我安慰` },
        { t: `code`, lang: `ts`, code: `type Order = { id: number; total: number };\nfunction readOrder(raw: unknown): Order {\n  return raw as Order;\n}\nconst o = readOrder({ id: 1, total: "九十九" });\nconsole.log(typeof o.total, o.total);` },
        { t: `p`, text: `这段 tsc 完全通得过，node 一跑打印 string 九十九。as 什么都没做，它只是叫你闭嘴；钱是字符串的时候，后面 o.total 参与乘法就出错。校验和断言的区别就在这儿：一个真的检查了数据，一个只改了编译器的心情。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="16" y="16" width="608" height="248" rx="16" fill="#eef3fb"/><text x="320" y="44" font-size="20" font-weight="700" text-anchor="middle" fill="#1a2233">一份 schema，两条出路</text><rect x="44" y="76" width="150" height="60" rx="11" fill="#2456b8"/><text x="119" y="102" font-size="15" font-weight="700" text-anchor="middle" fill="#ffffff">schema</text><text x="119" y="122" font-size="14" text-anchor="middle" fill="#dce7f8">字段一处写</text><rect x="250" y="66" width="160" height="50" rx="10" fill="#ffffff" stroke="#2456b8" stroke-width="2"/><text x="330" y="86" font-size="14" text-anchor="middle" fill="#1a2233">类型层：推出处类型</text><text x="330" y="106" font-size="14" text-anchor="middle" fill="#5c6a80">编译期管事</text><rect x="250" y="128" width="160" height="50" rx="10" fill="#ffffff" stroke="#8a4308" stroke-width="2"/><text x="330" y="148" font-size="14" text-anchor="middle" fill="#1a2233">运行层：parse 数据</text><text x="330" y="168" font-size="14" text-anchor="middle" fill="#8a4308">脏数据当场拦</text><path d="M194 98L246 88M194 118L246 146" stroke="#2456b8" stroke-width="2.5"/><polygon points="248,88 238,84 239,95" fill="#2456b8"/><polygon points="248,146 238,142 239,153" fill="#8a4308"/><rect x="450" y="96" width="150" height="60" rx="11" fill="#ffffff" stroke="#2456b8" stroke-width="2"/><text x="525" y="120" font-size="14" text-anchor="middle" fill="#1a2233">业务层</text><text x="525" y="142" font-size="14" text-anchor="middle" fill="#5c6a80">只收干净形状</text><path d="M412 152H446" stroke="#2456b8" stroke-width="3"/><polygon points="448,152 438,146 438,158" fill="#2456b8"/><text x="320" y="206" font-size="14" text-anchor="middle" fill="#8a4308">as 只让编译器闭嘴；parse 才真的看过数据一眼</text><text x="320" y="238" font-size="14" text-anchor="middle" fill="#5c6a80">接口失败形状也写进这份契约，前端按它写分支</text></svg>`, caption: `声明只写一次，类型和校验各取一半；漏了运行层，脏数据就直接进业务。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把接口返回直接 as 成目标类型。少字段、类型漂移全被压住，出错时查三层。`,
          `前端一套类型、后端一套类型，靠人肉同步。改字段那天一定漏一处。`,
          `校验只做「是不是对象」，字段级不查。数字变字符串照样进业务。`,
          `错误结构不定义，前端只能按状态码猜，提示文案落不到字段上。`,
          `把 schema 当文档写完就不 parse。类型只是愿望，跑起来的检查才算数。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `给 parse 加一层嵌套支持：字段描述里能再放一个 schema，越界时报出完整路径。`,
          `把错误返回值从字符串数组换成带字段名的对象数组，前端按字段渲染提示。`,
          `写一条契约测试：读一份服务器真实响应，跑 parse，字段漂了就退出码非零。`,
          `找一个项目里所有 as 的用法，逐个判断能不能换成校验；换不掉的写下理由。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：类型管编译期，校验管运行时；一份声明两头用，脏数据才进不了业务层。` }
      ]
    },
    {
      id: `tsx08`,
      title: `第 8 课 · Agent：工具的函数签名`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把「函数」翻成「模型看得懂的参数表」，并让参数在执行前被检查、失败时回一句能被下一轮读懂的话。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `模型不会调你的函数，它只能输出一段结构化文本。工具调用做的事是：你把每个工具的名字、用途、参数名与参数类型写成一个 JSON Schema 交给模型；模型说「我要用哪个工具、参数是什么」；你的代码收到这份参数对象，自己检查、自己执行、自己把结果塞回对话。` },
        { t: `p`, text: `这条链上 TS 能帮两处。第一处是生成参数表：函数签名里参数的名字和类型是确定的，可以用一个 Table 类型把每个工具的形状固定下来，让「说明、参数、执行函数」三样绑在一起，少写一个字段 tsc 就报。第二处是执行前的校验：模型给来的参数是 unknown，必须按你声明的类型逐条查——名字对不对、必填有没有、类型是不是。` },
        { t: `p`, text: `失败信息是接口的一部分。返回一句「找不到用户」，模型下一轮可能又试一次同样的参数；返回「缺参数 userId，类型为 number」，它才有改正的方向。工具执行要返回带成功标记的结构，而不是抛异常把整轮炸掉。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `一份工具表同时喂给模型和校验器，改字段名不会两头不一致。`,
          `给每个工具写「什么时候用它」的一句话，模型选错率的差别能量出来。`,
          `把返回值统一成带 ok 标记的结构，失败变成下一轮的输入而不是崩溃。`,
          `按参数表自动生成交互界面，人工审核时能填同样的字段。`
        ]},
        { t: `h2`, text: `演示 1 · 一份声明两用` },
        { t: `code`, lang: `ts`, code: `type Arg = { type: "number" | "string"; desc: string; required?: boolean };\ntype Tool = { name: string; desc: string; args: Record<string, Arg>; run: (a: Record<string, unknown>) => string };\nfunction schemaOf(t: Tool): string {\n  const rows = Object.keys(t.args).map((k) => k + ":" + t.args[k].type + (t.args[k].required ? " 必填" : ""));\n  return t.name + "(" + rows.join(", ") + ")";\n}\nconst tools: Tool[] = [\n  { name: "order_status", desc: "查订单是否已发货", args: { orderId: { type: "number", desc: "订单号", required: true } },\n    run: (a) => "订单 " + String(a.orderId) + " 已发货" },\n];\nconsole.log(schemaOf(tools[0]));` },
        { t: `p`, text: `本机跑这段输出 order_status(orderId:number 必填)。模型看到的就是这一行字；同一条记录里的 run 才是真执行的那份，两者在同一个对象里，改一处不会漏另一处。` },
        { t: `h2`, text: `演示 2 · 执行前把参数挡住` },
        { t: `code`, lang: `ts`, code: `// 接上一段\nfunction call(t: Tool, raw: Record<string, unknown>): { ok: boolean; out: string } {\n  for (const k of Object.keys(t.args)) {\n    const a = t.args[k];\n    if (raw[k] === undefined) {\n      if (a.required) return { ok: false, out: "缺参数 " + k + "，类型要 " + a.type };\n      continue;\n    }\n    if (typeof raw[k] !== a.type) return { ok: false, out: k + " 类型应为 " + a.type };\n  }\n  return { ok: true, out: t.run(raw) };\n}\nconsole.log(JSON.stringify(call(tools[0], {})));\nconsole.log(JSON.stringify(call(tools[0], { orderId: 7 })));` },
        { t: `p`, text: `两行输出分别是 {"ok":false,"out":"缺参数 orderId，类型要 number"} 和 {"ok":true,"out":"订单 7 已发货"}。前者不是异常，是给模型的下一步提示；把工具失败当异常抛出循环，整轮对话就废了。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="16" y="16" width="608" height="248" rx="16" fill="#eef3fb"/><text x="320" y="44" font-size="20" font-weight="700" text-anchor="middle" fill="#1a2233">工具表在两边各被读一次</text><rect x="40" y="78" width="180" height="72" rx="11" fill="#2456b8"/><text x="130" y="102" font-size="15" font-weight="700" text-anchor="middle" fill="#ffffff">一份 Tool 记录</text><text x="130" y="124" font-size="14" text-anchor="middle" fill="#dce7f8">说明 参数 执行</text><text x="130" y="142" font-size="14" text-anchor="middle" fill="#dce7f8">少一个字段就报错</text><rect x="290" y="66" width="150" height="48" rx="10" fill="#ffffff" stroke="#2456b8" stroke-width="2"/><text x="365" y="86" font-size="14" text-anchor="middle" fill="#1a2233">参数表发给模型</text><text x="365" y="106" font-size="14" text-anchor="middle" fill="#5c6a80">模型挑一个</text><rect x="290" y="126" width="150" height="48" rx="10" fill="#ffffff" stroke="#8a4308" stroke-width="2"/><text x="365" y="146" font-size="14" text-anchor="middle" fill="#1a2233">本机按表校验</text><text x="365" y="166" font-size="14" text-anchor="middle" fill="#8a4308">不合格就回说明</text><path d="M220 104L286 90M220 124L286 148" stroke="#2456b8" stroke-width="2.5"/><polygon points="288,90 278,86 279,97" fill="#2456b8"/><polygon points="288,148 278,144 279,155" fill="#8a4308"/><rect x="470" y="96" width="130" height="60" rx="10" fill="#ffffff" stroke="#2456b8" stroke-width="2"/><text x="535" y="120" font-size="14" text-anchor="middle" fill="#1a2233">执行并回填</text><text x="535" y="142" font-size="14" text-anchor="middle" fill="#5c6a80">带 ok 标记</text><path d="M442 150H466" stroke="#2456b8" stroke-width="3"/><polygon points="468,150 458,144 458,156" fill="#2456b8"/><text x="320" y="204" font-size="14" text-anchor="middle" fill="#8a4308">失败信息要写清缺什么、要什么类型，模型才有的改</text><text x="320" y="236" font-size="14" text-anchor="middle" fill="#5c6a80">说明与执行绑在同一条记录里，就不会两头漂移</text></svg>`, caption: `模型读的是形状，执行读的是值；同一条记录喂两头，字段改动只会红一次。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `工具描述含糊，模型十个里挑错六个。名字要带动作，说明要带一个正例。`,
          `参数不校验就传给真接口。模型填了个字符串当 id，线上就多一次 500。`,
          `返回值超长不截。整页原文进历史，下一轮请求胖十倍，费用跟着涨。`,
          `失败靠抛异常处理，循环里没人接，任务直接终止。`,
          `工具数量越加越多。重叠的两个工具会让模型犹豫，先把能合并的合并。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `再加两个工具：一个查库存（必填两个参数），一个只读不写字段，跑一遍 call 看报错。`,
          `把 schemaOf 换成输出真正的 JSON Schema 字符串，包含 type 与 description 两层。`,
          `给 call 加一条「参数表里没有的键」检查，观察模型幻觉字段时你会拿到什么。`,
          `记录每个工具被选中次数与成功率，写成一页表格，据此决定删哪个工具。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：模型只能按你给的参数表填值；说明、校验、执行必须来自同一条记录，失败要写成下一轮能读的话。` }
      ]
    },
    {
      id: `tsx09`,
      title: `第 9 课 · Agent：工作流状态`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用可辨识联合把 Agent 的每一步写成状态，让非法转移在编译期就写不出来，并让中断之后能接着跑。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `一次 Agent 任务是一串状态：待办、正在选工具、等结果、要不要重试、结束。用字符串加状态标记的联合类型写它们，每个状态带自己需要的数据——等待结果那一步带着工具名和参数，结束那一步带着答案和用了几步。TS 在 switch 里按标记收窄：进到某个分支，只有那一个状态的字段能读。` },
        { t: `p`, text: `穷尽检查靠 never：default 分支写成「把 s 交给一个 never 类型的变量」，只要联合里漏了一个状态没处理，编译就报。这条尺子让「加了新状态忘了改分支」这种事故在写的时候就暴露，比任何测试都快。转移函数只接受当前状态、返回下一个状态，非法转移根本传不进去——从「已完成」回到「等结果」在类型上就不成立。` },
        { t: `p`, text: `每一步都要能落盘：状态、时间、输入输出、成本。理由很实在——模型不确定，同一个问题两次跑出不同路径；出了问题要能回答「它当时看到了什么」。有了逐步记录，重跑只从失败那一步开始，不必把整条链再花一遍钱。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `把「跑完就丢」的脚本变成能恢复的流程：中断后从最后一步接着跑。`,
          `任何一次失败都能定位到第几步、哪个工具、参数是什么。`,
          `加一步「需要人工确认」的状态，写操作就绕不过审批。`,
          `按状态统计成本：哪一步花得多、哪一步反复出现，一眼看得见。`
        ]},
        { t: `h2`, text: `演示 1 · 状态与穷尽检查` },
        { t: `code`, lang: `ts`, code: `type Step =\n  | { kind: "plan"; round: number }\n  | { kind: "tool"; round: number; name: string }\n  | { kind: "await"; round: number; name: string; reason: string }\n  | { kind: "final"; round: number; answer: string };\nfunction label(s: Step): string {\n  switch (s.kind) {\n    case "plan": return "第" + s.round + "轮 选工具";\n    case "tool": return "第" + s.round + "轮 调 " + s.name;\n    case "await": return "第" + s.round + "轮 等确认 " + s.name + "：" + s.reason;\n    case "final": return "答案 " + s.answer;\n    default: { const bad: never = s; return bad; }\n  }\n}` },
        { t: `code`, lang: `ts`, code: `// 接上一段\nconsole.log(label({ kind: "await", round: 2, name: "refund", reason: "要扣款" }));` },
        { t: `p`, text: `本机跑这一句输出 第2轮 等确认 refund：要扣款。试着把 case "await" 那一行删掉再跑 tsc，default 里报 Type 不能赋给 never——漏处理的状态被当场抓住。` },
        { t: `h2`, text: `演示 2 · 转移只走合法边` },
        { t: `code`, lang: `ts`, code: `// 接上两段\nfunction next(s: Step, ok: boolean): Step {\n  if (s.kind === "final") return s;\n  if (s.kind === "plan") {\n    return ok ? { kind: "tool", round: s.round, name: "lookup" } : { kind: "final", round: s.round, answer: "没有可用工具" };\n  }\n  if (s.kind === "tool") {\n    return ok ? { kind: "plan", round: s.round + 1 } : { kind: "await", round: s.round, name: s.name, reason: "调用失败" };\n  }\n  return { kind: "plan", round: s.round + 1 };\n}\nlet cur: Step = { kind: "plan", round: 1 };\nfor (const flag of [true, false]) { cur = next(cur, flag); console.log(label(cur)); }` },
        { t: `p`, text: `next 的返回类型只有 Step 一种，从 final 出来还是 final，非法转移传不进去。本机连着跑 true、false 两轮，输出是 第1轮 调 lookup 和 第1轮 等确认 lookup：调用失败——工具执行失败没有抛异常，而是走进 await 那一个状态，把原因写在状态里，等人点头之后还能接着往下跑。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="16" y="16" width="608" height="248" rx="16" fill="#eef3fb"/><text x="320" y="44" font-size="20" font-weight="700" text-anchor="middle" fill="#1a2233">四个状态，几条合法边</text><rect x="40" y="86" width="120" height="52" rx="10" fill="#2456b8"/><text x="100" y="110" font-size="15" text-anchor="middle" fill="#ffffff">plan</text><text x="100" y="128" font-size="14" text-anchor="middle" fill="#dce7f8">选工具</text><rect x="240" y="86" width="120" height="52" rx="10" fill="#ffffff" stroke="#2456b8" stroke-width="2"/><text x="300" y="110" font-size="15" text-anchor="middle" fill="#1a2233">tool</text><text x="300" y="128" font-size="14" text-anchor="middle" fill="#5c6a80">执行中</text><rect x="440" y="86" width="120" height="52" rx="10" fill="#ffffff" stroke="#8a4308" stroke-width="2"/><text x="500" y="110" font-size="15" text-anchor="middle" fill="#1a2233">await</text><text x="500" y="128" font-size="14" text-anchor="middle" fill="#8a4308">等确认</text><rect x="240" y="184" width="120" height="52" rx="10" fill="#ffffff" stroke="#5c6a80" stroke-width="2"/><text x="300" y="208" font-size="15" text-anchor="middle" fill="#1a2233">final</text><text x="300" y="226" font-size="14" text-anchor="middle" fill="#5c6a80">带答案</text><path d="M162 112H236" stroke="#2456b8" stroke-width="3"/><polygon points="238,112 228,106 228,118" fill="#2456b8"/><path d="M362 112H436" stroke="#8a4308" stroke-width="3"/><polygon points="438,112 428,106 428,118" fill="#8a4308"/><path d="M300 140V180" stroke="#2456b8" stroke-width="3"/><polygon points="300,182 294,172 306,172" fill="#2456b8"/><path d="M500 140C500 196 380 210 364 210" fill="none" stroke="#5c6a80" stroke-width="2.5" stroke-dasharray="6 5"/><polygon points="362,210 372,204 372,216" fill="#5c6a80"/><path d="M240 210H100V142" stroke="#2456b8" stroke-width="2.5"/><polygon points="100,140 94,150 106,150" fill="#2456b8"/><text x="150" y="100" font-size="14" fill="#5c6a80">挑好了</text><text x="380" y="100" font-size="14" fill="#8a4308">要花钱</text><text x="320" y="256" font-size="14" text-anchor="middle" fill="#5c6a80">final 是终点：从它出发的边一条都没有，类型上也传不进去</text></svg>`, caption: `把非法转移挡在类型外面，靠的是每个状态带自己的字段、转移只接当前状态。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `用一个 status 字符串加一堆可选字段表示状态。所有字段谁都能读，编译器帮不上忙。`,
          `switch 不写 default 穷尽。加了新状态，老分支静默漏掉。`,
          `状态里不带轮次与来源，出错时看不出这条路径走了几圈。`,
          `把重试藏在函数内部而不建状态。成本账和日志都对不上。`,
          `中间结果只在内存里。进程一挂整条链重跑，钱花两遍。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `给 Step 加一个 error 状态，带失败原因和可重试标记，把穷尽检查跑红一次再修好。`,
          `写一个 toLog 函数，把一串状态转成每行一条的日志文本，字段要能定位到第几轮。`,
          `实现从日志恢复：读最后一条状态，构造出那个 Step，继续往下跑。`,
          `把 await 状态的进入条件改成「工具表里标了需要确认」，验证写操作绕不过审批。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：状态用可辨识联合写，转移只接当前状态，default 交给 never——非法路径就写不出来。` }
      ]
    },
    {
      id: `tsx10`,
      title: `第 10 课 · MCP：把工具接进模型`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：说清 MCP 在解决什么——工具别再各家写一遍；用 TS 写一个最小的服务端，会列工具、会接调用、会划权限。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `以前每接一个模型应用，都要把同一批内部工具重新封装一次：这个应用要写胶水，那个应用也要写，参数说明还各写各的。MCP 把这一层标准化：本地或远程的服务端只声明一次「我有哪些工具、参数长什么样、能返回什么」，任何支持这套协议的客户都能列出来直接用。你的角色从写 N 份胶水变成写 1 份服务端。` },
        { t: `p`, text: `通信是 JSON-RPC 形状的消息。客户先问「有哪些工具」，服务端按 tools/list 回一张表，每条带名字、说明和参数 JSON Schema；模型挑中某个工具后，客户发 tools/call，带工具名和一个参数对象；服务端校验、执行，回一段内容数组，可以是文字，也可以是资源引用。出错要走协议里的错误通道，并让信息能指导下一次尝试。` },
        { t: `p`, text: `权限边界是这套东西最要紧的地方。工具要在服务端标注风险：只读、写入、花钱。客户拿到标注后决定要不要弹确认。不要指望模型自己克制——它只会按参数表填值，安全这条线只能落在你写的服务端和宿主里。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `把内部查询接口做成一个 MCP 服务，所有模型应用共用同一套工具与权限标记。`,
          `给自己的机器加一层：读文件、查日志、跑命令，每个都带确认标记。`,
          `换模型或换应用时工具不动，只换客户端配置。`,
          `审计只有一份：谁调了什么工具、参数是什么、有没有过人审。`
        ]},
        { t: `h2`, text: `演示 · 一个能跑的最小服务端` },
        { t: `code`, lang: `ts`, code: `type McpTool = { name: string; desc: string; schema: Record<string, string>; risk: "read" | "write" };\ntype Reply = { ok: boolean; text: string };\nconst TABLE: Record<string, McpTool> = {\n  tail_log: { name: "tail_log", desc: "取最近若干行日志", schema: { lines: "number" }, risk: "read" },\n  refund: { name: "refund", desc: "对订单发起退款", schema: { orderId: "number" }, risk: "write" },\n};\nfunction listTools(): string[] {\n  return Object.values(TABLE).map((t) => t.name + " " + t.desc + " " + t.risk);\n}` },
        { t: `code`, lang: `ts`, code: `// 接上一段\nfunction call(name: string, args: Record<string, unknown>, approved: boolean): Reply {\n  const t = TABLE[name];\n  if (!t) return { ok: false, text: "没有这个工具: " + name };\n  const miss = Object.keys(t.schema).filter((k) => args[k] === undefined);\n  if (miss.length) return { ok: false, text: "缺参数 " + miss.join(",") };\n  if (t.risk === "write" && !approved) return { ok: false, text: "写操作要人点头" };\n  return { ok: true, text: name + " 已执行" };\n}` },
        { t: `code`, lang: `ts`, code: `// 接上一段\nconsole.log(listTools().join(" | "));\nconsole.log(JSON.stringify(call("tail_log", { lines: 20 }, false)));\nconsole.log(JSON.stringify(call("refund", { orderId: 9 }, false)));\nconsole.log(JSON.stringify(call("refund", {}, true)));` },
        { t: `p`, text: `本机四行输出：第一行是工具清单带风险标记；第二行 {"ok":true,"text":"tail_log 已执行"}；第三行被风险闸挡下，写操作要人点头；第四行缺参数，报的是 缺参数 orderId。这四行就是服务端的四条边界：有表、有校验、有审批、有可执行的。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="16" y="16" width="608" height="248" rx="16" fill="#eef3fb"/><text x="320" y="44" font-size="20" font-weight="700" text-anchor="middle" fill="#1a2233">工具写一次，谁都能用</text><rect x="40" y="82" width="150" height="66" rx="11" fill="#ffffff" stroke="#2456b8" stroke-width="2"/><text x="115" y="106" font-size="15" text-anchor="middle" fill="#1a2233">MCP 服务端</text><text x="115" y="128" font-size="14" text-anchor="middle" fill="#5c6a80">工具表 参数表</text><text x="115" y="146" font-size="14" text-anchor="middle" fill="#5c6a80">风险标记</text><rect x="260" y="82" width="150" height="66" rx="11" fill="#2456b8"/><text x="335" y="106" font-size="15" font-weight="700" text-anchor="middle" fill="#ffffff">宿主客户端</text><text x="335" y="128" font-size="14" text-anchor="middle" fill="#dce7f8">转发与审批</text><text x="335" y="146" font-size="14" text-anchor="middle" fill="#dce7f8">落审计日志</text><rect x="480" y="82" width="120" height="66" rx="11" fill="#ffffff" stroke="#2456b8" stroke-width="2"/><text x="540" y="106" font-size="15" text-anchor="middle" fill="#1a2233">模型</text><text x="540" y="128" font-size="14" text-anchor="middle" fill="#5c6a80">看参数表</text><text x="540" y="146" font-size="14" text-anchor="middle" fill="#5c6a80">填值</text><path d="M190 115H256" stroke="#2456b8" stroke-width="3"/><polygon points="258,115 248,109 248,121" fill="#2456b8"/><path d="M412 115H476" stroke="#2456b8" stroke-width="3"/><polygon points="478,115 468,109 468,121" fill="#2456b8"/><path d="M540 150V186H115V152" fill="none" stroke="#8a4308" stroke-width="2.5" stroke-dasharray="7 5"/><polygon points="115,150 109,162 121,162" fill="#8a4308"/><text x="330" y="204" font-size="14" text-anchor="middle" fill="#8a4308">tools/list 走一次，tools/call 每轮走一次</text><text x="320" y="238" font-size="14" text-anchor="middle" fill="#5c6a80">模型看不见你的代码，它只看得见你写的那张参数表</text></svg>`, caption: `服务端出表和执行，客户端出转发和审批，模型只负责按表填值。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `工具说明写得太短，模型只能猜。desc 是唯一的说明书，要写清什么时候用。`,
          `所有工具都标只读。风险标记一旦通胀，审批就形同虚设。`,
          `参数用字符串塞一切，让模型自己拼。拆成字段，校验才有落脚点。`,
          `返回值不带结构，宿主只能整段贴回对话，历史迅速膨胀。`,
          `把密钥写进服务端源码。凭据要在宿主配置里，按工具授权。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `给 TABLE 再加两个工具，一个只读一个写入，把演示的四行输出补齐成六行。`,
          `把 listTools 的输出改成 JSON 字符串形式的参数表，接近真正发给模型的那一份。`,
          `写一份审计函数：每次 call 记录工具名、参数、是否通过审批、结果 ok。`,
          `给自己机器上的一个真脚本包一层这形状的服务端，先只放只读工具。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：MCP 把工具从每个应用里挪出来只写一次；参数表是给模型的说明书，风险标记是给你自己的闸门。` }
      ]
    },
    {
      id: `tsx11`,
      title: `第 11 课 · 评测：让 Agent 可测`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：给 Agent 建一套能重复跑的评测——用例有期望、分数有三种、改动要对比，别用「感觉变好了」做决定。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `Agent 的输出不确定，同一个问题两次可能走不同路径。「跑通了」三个字没有信息量，能比较的只有数字。最小的一套要三个分数：工具选对没有（第一步对不对）、参数填对没有（第二步对不对）、最终任务完成没有（结果可用不可用）。三者各有各的分母，别把它们混成一个「成功率」。` },
        { t: `p`, text: `用例是最贵的资产。一条用例要有输入、期望的工具序列、期望的结果特征、以及人工写的那一句「为什么这算对」。二十条真问题的用例，价值高于两千条自造问题。期望结果不能只写字符串相等：答案合理往往有多种写法，用「包含关键字段」「数字对得上」这类可判定的条件。` },
        { t: `p`, text: `回归靠对比：同一套用例，旧版本与新版本各跑一遍，比三个分数和平均成本。分数掉了就别合并，哪怕新逻辑看起来更聪明。分数要连着模型名、提示词版本、工具表版本一起记，否则下次没人知道你上次是怎么跑出来的。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `改提示词前后各跑一次，用数字说清这次改动值不值。`,
          `删工具时有依据：哪条工具从没被选对过，直接砍。`,
          `CI 里跑一遍小样本，退化就拦在合并前。`,
          `向别人交付时有凭据：任务完成率、成本、延迟各一个数。`
        ]},
        { t: `h2`, text: `演示 · 三个分数一次算清` },
        { t: `code`, lang: `ts`, code: `type Case = { id: string; ask: string; wantTool: string; wantHas: string };\ntype Run = (ask: string) => { tool: string; out: string; cost: number };\nfunction evaluate(cases: Case[], run: Run) {\n  let toolHit = 0, done = 0, both = 0, cost = 0;\n  for (const c of cases) {\n    const r = run(c.ask);\n    cost += r.cost;\n    const rightTool = r.tool === c.wantTool;\n    const rightOut = r.out.includes(c.wantHas);\n    if (rightTool) toolHit++;\n    if (rightOut) done++;\n    if (rightTool && rightOut) both++;\n  }\n  const n = cases.length;` },
        { t: `code`, lang: `ts`, code: `// 接上一段\n  const pct = (x: number) => Math.round(100 * (x / n)) / 100;\n  return { toolRate: pct(toolHit), doneRate: pct(done), bothRate: pct(both), cost: Math.round(cost / n) };\n}` },
        { t: `code`, lang: `ts`, code: `// 接上一段\nconst cases: Case[] = [\n  { id: "c1", ask: "订单 7 发了吗", wantTool: "order_status", wantHas: "已发货" },\n  { id: "c2", ask: "查一下库存 12", wantTool: "stock", wantHas: "还剩" },\n  { id: "c3", ask: "给 9 号订单退款", wantTool: "refund", wantHas: "已提交" },\n];\nconst v1: Run = (ask) => ask.includes("退款") ? { tool: "order_status", out: "订单 9 未发货", cost: 3 }\n  : ask.includes("库存") ? { tool: "stock", out: "还剩 4 件", cost: 2 } : { tool: "order_status", out: "订单 7 未发货", cost: 2 };\nconsole.log(JSON.stringify(evaluate(cases, v1)));` },
        { t: `p`, text: `本机输出 {"toolRate":0.67,"doneRate":0.33,"bothRate":0.33,"cost":2}：三条里工具选对两条，结果只有一条合格，两条同时对的也是 0.33。这一串数字就是改动的起点——把 v1 换成 v2 让退款走对工具，bothRate 从 0.33 变成 1，你才有底气说这次改好了。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="16" y="16" width="608" height="248" rx="16" fill="#eef3fb"/><text x="320" y="44" font-size="20" font-weight="700" text-anchor="middle" fill="#1a2233">用例进去，三个分数出来</text><rect x="40" y="78" width="150" height="64" rx="11" fill="#ffffff" stroke="#2456b8" stroke-width="2"/><text x="115" y="102" font-size="14" text-anchor="middle" fill="#1a2233">用例集</text><text x="115" y="122" font-size="14" text-anchor="middle" fill="#5c6a80">输入 期望工具</text><text x="115" y="140" font-size="14" text-anchor="middle" fill="#5c6a80">期望结果特征</text><rect x="245" y="78" width="150" height="64" rx="11" fill="#2456b8"/><text x="320" y="102" font-size="15" font-weight="700" text-anchor="middle" fill="#ffffff">跑一遍</text><text x="320" y="124" font-size="14" text-anchor="middle" fill="#dce7f8">记录成本与步数</text><text x="320" y="142" font-size="14" text-anchor="middle" fill="#dce7f8">记下版本</text><rect x="450" y="78" width="150" height="64" rx="11" fill="#ffffff" stroke="#2456b8" stroke-width="2"/><text x="525" y="102" font-size="14" text-anchor="middle" fill="#1a2233">三个分数</text><text x="525" y="122" font-size="14" text-anchor="middle" fill="#5c6a80">选对 填对 完成</text><text x="525" y="140" font-size="14" text-anchor="middle" fill="#5c6a80">各自分母</text><path d="M192 110H241M397 110H446" stroke="#2456b8" stroke-width="3"/><polygon points="243,110 233,104 233,116" fill="#2456b8"/><polygon points="448,110 438,104 438,116" fill="#2456b8"/><rect x="150" y="176" width="340" height="56" rx="11" fill="#ffffff" stroke="#8a4308" stroke-width="2"/><text x="320" y="200" font-size="14" text-anchor="middle" fill="#1a2233">旧版与新版各跑一次，掉了就不合并</text><text x="320" y="222" font-size="14" text-anchor="middle" fill="#8a4308">分数要连着提示词版本与工具表版本一起记</text><path d="M320 174V146" stroke="#8a4308" stroke-width="2.5" stroke-dasharray="6 5"/><polygon points="320,144 314,156 326,156" fill="#8a4308"/></svg>`, caption: `三个分数各有各的分母；一个混总的「成功率」看不出问题出在哪一步。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `只看最后答案对不对。选错工具但答案蒙对了，下一次就蒙不对。`,
          `用例期望写死一整句原文。模型换个说法就判失败，其实是过的。`,
          `跑一次就下结论。至少跑三遍看分布，不然测的是运气。`,
          `用例全是自己造的问题，真实问法一条没有。上线第一天就崩。`,
          `不记版本。分数涨跌没法归因，改提示词变成盲调。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把 evaluate 的期望从「包含一个字符串」改成一组条件，支持字段齐、数字对这两类判定。`,
          `每个用例跑三遍，输出分数的均值与最差值，看哪条用例最不稳定。`,
          `写一版 v2 让退款走对工具，把两个版本的三个分数并排列出来。`,
          `把模型名、提示词版本、工具表版本记进结果对象，做一次能复盘的评测记录。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：Agent 的进步只有被比较才算数；三个分数、一组真用例、一次带版本的对比，缺一件就回到猜。` }
      ]
    },
    {
      id: `tsx12`,
      title: `第 12 课 · 就业方向与后续发展`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把前十课的类型与 Agent 本事换成能被验收的东西——五条路线，每条一个能独立完成的项目和一份验收清单。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `TS 岗位看你两件事：能不能把类型用在真实工程里（契约、泛型、大型模块），能不能把模型能力落成一个能被验收的产品（工具调用、状态、评测）。前者靠第 1 到 7 课，后者靠第 8 到 11 课。把这两条合起来说成的唯一证据是一个能跑、有数字、别人能复跑的项目。` },
        { t: `p`, text: `路线之间代价不同。Agent 岗新、资料少，但你的评测与工具经验直接稀缺；前端架构岗成熟、要求广度，类型只是其中一项；全栈岗要看你能不能独立把部署、迁移、监控这一串撑住。选一条，先做出一个东西再说。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `有一个能对外分享的 Agent 项目，讲得清工具表、状态机与评测数字。`,
          `能给一个中型前端定类型边界，接口改动时编译器替你找漏。`,
          `能独立交付一个从 schema 到部署的小产品，README 里有真实数据。`,
          `能读懂别人的类型定义，知道哪一层是工程、哪一层是炫技。`
        ]},
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="16" y="16" width="608" height="248" rx="16" fill="#eef3fb"/><text x="320" y="46" font-size="20" font-weight="700" text-anchor="middle" fill="#1a2233">五条路线，收到同一件事上</text><rect x="34" y="66" width="106" height="44" rx="9" fill="#ffffff" stroke="#2456b8" stroke-width="2"/><text x="87" y="92" font-size="14" text-anchor="middle" fill="#1a2233">Agent 工程</text><rect x="148" y="66" width="106" height="44" rx="9" fill="#ffffff" stroke="#2456b8" stroke-width="2"/><text x="201" y="92" font-size="14" text-anchor="middle" fill="#1a2233">前端架构</text><rect x="262" y="66" width="106" height="44" rx="9" fill="#ffffff" stroke="#2456b8" stroke-width="2"/><text x="315" y="92" font-size="14" text-anchor="middle" fill="#1a2233">全栈</text><rect x="376" y="66" width="106" height="44" rx="9" fill="#ffffff" stroke="#2456b8" stroke-width="2"/><text x="429" y="92" font-size="14" text-anchor="middle" fill="#1a2233">桌面与CLI</text><rect x="490" y="66" width="106" height="44" rx="9" fill="#ffffff" stroke="#2456b8" stroke-width="2"/><text x="543" y="92" font-size="14" text-anchor="middle" fill="#1a2233">工具链</text><path d="M87 112L180 166M201 112L250 166M315 112V166M429 112L390 166M543 112L460 166" stroke="#8a4308" stroke-width="2.5"/><rect x="140" y="168" width="360" height="56" rx="10" fill="#2456b8"/><text x="320" y="192" font-size="16" font-weight="700" text-anchor="middle" fill="#ffffff">一个能独立交付的项目</text><text x="320" y="214" font-size="14" text-anchor="middle" fill="#dce7f8">有分数、有版本、别人能照着复跑</text><text x="320" y="252" font-size="14" text-anchor="middle" fill="#5c6a80">简历收口在这一句：仓库能跑，README 第一段讲问题与数字</text></svg>`, caption: `路线按你要交付的东西分，不按会不会某个框架分。` },
        { t: `h2`, text: `五条路线，每条都要有验收` },
        { t: `p`, text: `一、AI Agent 工程师。项目：一个能调三到五个工具、带记忆与评测的 Agent。栈是第 8 到 11 课：工具表加校验、可辨识联合写状态、MCP 服务端、用例集与三个分数。验收：三十条真实任务的工具选对率、完成率、平均成本与轮数；写操作百分之百过审批；失败样本能贴出当时看到的上下文。要补：模型接口与向量检索、可观测性。落点：仓库里放评测脚本和结果表。` },
        { t: `p`, text: `二、前端架构。项目：一个组件库或大型业务模块。验收：类型覆盖率有数字、构建产物体积有对比、迁移文档能让别人半天接上去、无障碍与键盘路径可用。要补：渲染性能、打包工具、设计系统。落点：一页「接口怎么定、怎么演进」。` },
        { t: `p`, text: `三、全栈工程师。项目：端到端类型安全的 SaaS 小产品。验收：schema 改动前后端同时红、数据库迁移可回滚、部署与备份有脚本、监控有一屏。要补：SQL、鉴权、容器。落点：一张「从提交到上线」的流水线图。` },
        { t: `p`, text: `四、桌面与 CLI 工程师。项目：一个开发者工具。验收：三平台构建、启动耗时与包体有数、插件接口稳定、离线可用。要补：原生能力边界、签名与自动更新。落点：真实用户数量与一次崩溃定位记录。` },
        { t: `p`, text: `五、开发者工具与编译器方向。项目：一个 TS 转换插件或 lint 规则。验收：用例集覆盖边界、检查耗时可量化、规则能解释为什么报。要补：编译器前端、AST、性能剖析。落点：一条被合并进上游的改动。` },
        { t: `h2`, text: `后续发展` },
        { t: `ul`, items: [
          `往架构：把类型边界扩到服务边界，一致性、容量、故障域要讲得出取舍。`,
          `往模型侧：读推理与训练，知道工具表和上下文为什么这样组织。`,
          `往业务：选定一个行业，把数据和流程吃熟，技术才换成门槛。`,
          `往开源：把内部工具做成公共包，维护版本、写迁移、处理 issue。`,
          `往带人：定接口、做审查、拆任务，交付从个人换成小组。`
        ]},
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把类型体操当能力证明。面试官要看的是接口边界，不是三百行的类型别名。`,
          `Agent 项目只有演示没有评测：说不出完成率、成本、失败样本，等于没做完。`,
          `全靠 as 让报错消失。运行时那份数据一个字节都没变，事故照旧。`,
          `简历列十个框架，没有一个仓库能从克隆跑到部署。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `选一条路线，写下两周内要交付的项目：边界、技术栈、三条验收标准。`,
          `给 Agent 项目补一份评测记录：模型名、提示词版本、工具表版本、三个分数。`,
          `找一个同学从零跑一次你的仓库，记下他卡住的步骤并修掉。`,
          `列出这条路线要补的两项能力，各配一个能证明补过的动作。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：类型让你写得稳，评测让你说得清；两者合起来变成一个能被人复跑的项目，机会才落在你身上。` }
      ]
    },
  ],
};
