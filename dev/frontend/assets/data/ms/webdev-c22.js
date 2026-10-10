window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["webdev-c22"] = [
  { t: `tip`, color: `blue`, text: `本课目标：看清 form 天生会自己发请求并整页跳转，然后把它改成「收数据、发给后台、只更新一小块」。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `HTML 里只有 form 这一个元素会主动发请求：点提交按钮，浏览器把里面的控件按 name=value 打包，按 method 送到 action 指的地址去，并且把当前页面整个换掉。GET 把包拼在 URL 上，POST 塞进请求体。对上一课那套模板路由来说这是最坏的一击：地址栏被服务器接管，正在显示的屏没了，攒在 JavaScript 变量里的东西也一起没了。` },
  { t: `p`, text: `所以要接管这个事件：监听 submit，第一句就是 preventDefault，把跳转掐掉，剩下交给自己的代码。收数据不用逐个控件读，new FormData(表单) 一次把带 name 的控件全拿走，Object.fromEntries 转成普通对象，JSON.stringify 变成后台认识的文本，fetch 发出去。校验分三层：属性层由浏览器判、立刻出气泡；自己写的脚本层管规则和提示；服务端那层管安全——前两层谁都能绕过去。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><text x="320" y="22" font-size="15" text-anchor="middle" fill="#22314e">同一份数据，两种走法</text><rect x="20" y="42" width="290" height="230" rx="6" fill="#fff5f4" stroke="#c0574a"/><text x="165" y="64" font-size="15" text-anchor="middle" fill="#a5321f">默认：交给浏览器</text><rect x="44" y="80" width="242" height="34" rx="4" fill="#ffffff" stroke="#c0574a"/><text x="165" y="102" font-size="14" text-anchor="middle" fill="#22314e">点提交</text><rect x="44" y="126" width="242" height="34" rx="4" fill="#ffffff" stroke="#c0574a"/><text x="165" y="148" font-size="14" text-anchor="middle" fill="#22314e">整页重载，路由回到 index</text><rect x="44" y="172" width="242" height="34" rx="4" fill="#ffe9e6" stroke="#c0574a"/><text x="165" y="194" font-size="14" text-anchor="middle" fill="#a5321f">内存里的屏与变量全清空</text><text x="165" y="240" font-size="14" text-anchor="middle" fill="#a5321f">回复是另一张 HTML 页面</text><rect x="330" y="42" width="290" height="230" rx="6" fill="#f2f9f4" stroke="#3d9a63"/><text x="475" y="64" font-size="15" text-anchor="middle" fill="#1d4230">接管：preventDefault 之后</text><rect x="354" y="80" width="242" height="34" rx="4" fill="#ffffff" stroke="#3d9a63"/><text x="475" y="102" font-size="14" text-anchor="middle" fill="#22314e">FormData 收 → JSON 化</text><rect x="354" y="126" width="242" height="34" rx="4" fill="#ffffff" stroke="#3d9a63"/><text x="475" y="148" font-size="14" text-anchor="middle" fill="#22314e">fetch POST，地址栏不动</text><rect x="354" y="172" width="242" height="34" rx="4" fill="#e8f6ee" stroke="#3d9a63"/><text x="475" y="194" font-size="14" text-anchor="middle" fill="#1d4230">JSON 回来，只换那一块</text><text x="475" y="240" font-size="14" text-anchor="middle" fill="#1d4230">屏还在，数据也还在</text><text x="320" y="290" font-size="14" text-anchor="middle" fill="#22314e">差别只在一行：有没有调用 preventDefault</text></svg>`, caption: `左边那列是表单的天性，右边是接管后的行为——上一课那套模板能不能活下来，就看这一行。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `不离开当前屏就把账号建了，切屏和数据都不用重来`,
    `后台返回什么由你决定怎么用：错误显示在字段旁边，而不是变成一张新页面`,
    `加字段不用改收集代码：FormData 按 name 自动收`,
    `用户填错的第一时间就有提示，不用等一次网络往返`
  ] },
  { t: `h2`, text: `演示 1 · 控件、name 与 label` },
  { t: `code`, lang: `html`, code: `<form id="registerForm" method="POST">\n  <label for="user">Username</label>\n  <input id="user" name="user" type="text" required minlength="3" maxlength="20">\n  <label for="currency">Currency</label>\n  <input id="currency" name="currency" type="text" required value="$" maxlength="3">\n  <label for="balance">Starting Balance</label>\n  <input id="balance" name="balance" type="number" value="0" min="0" step="0.01">\n  <button type="submit">Create Account</button>\n</form>` },
  { t: `p`, text: `起作用的是 name 不是 id：FormData 收上来的键就是 name 的值，写成 usr 后台就收到 usr。label 的 for 对上控件的 id，点文字能把光标落到输入框，读屏软件也靠它认字段——这是第三课那条无障碍规矩在表单里的落点。type 决定手机弹哪套键盘，number 还附带 min 和 step 两个可校验的属性。` },
  { t: `h2`, text: `演示 2 · 把提交接下来` },
  { t: `code`, lang: `javascript`, code: `document.getElementById('registerForm').addEventListener('submit', (event) => {\n  event.preventDefault();\n  register();\n});\n\nasync function register() {\n  const form = document.getElementById('registerForm');\n  const data = Object.fromEntries(new FormData(form));\n  const result = await createAccount(JSON.stringify(data));\n  if (result.error) return;\n  form.reset();\n}` },
  { t: `p`, text: `监听的是 submit 而不是按钮的 click：回车提交、程序调用 form.submit 走的是同一个事件，点按钮才只走 click。第一句必须在最前面，晚一句浏览器已经跳走了。JSON.stringify 的返回值是字符串——后台只认文本，对象得先序列化；反过来收到的也是文本，还得 .json() 解析一次。` },
  { t: `h2`, text: `演示 3 · 发出去，并承认它可能失败` },
  { t: `code`, lang: `javascript`, code: `async function createAccount(account) {\n  try {\n    const response = await fetch('/api/accounts', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: account, });\n    if (!response.ok) throw new Error('HTTP status: ' + response.status);\n    return await response.json();\n  } catch (error) {\n    return { error: error.message || 'Network error' };\n  }\n}` },
  { t: `p`, text: `fetch 只在断网、域名解析不了的时候才 reject：服务器返回 404、500 它照样 resolve，因为「问到了答案」本身就是成功。所以 response.ok 不是可选项——不检查，密码写错也会走成功分支，页面显示建号成功而后台什么都没建。headers 那行是在说：我发的是 JSON，我要收的也是 JSON。` },
  { t: `h2`, text: `演示 4 · 三层校验与它各自的边界` },
  { t: `code`, lang: `html`, code: `<form id="registerForm" method="POST" novalidate>\n  <input id="user" name="user" type="text" required\n         pattern="[a-zA-Z0-9_]+" minlength="3" maxlength="20"\n         title="3-20 个字符：字母、数字、下划线">\n</form>` },
  { t: `code`, lang: `css`, code: `input:valid   { border-color: #28a745; }\ninput:invalid { border-color: #dc3545; }\ninput:focus:invalid { box-shadow: 0 0 0 0.2rem rgba(220,53,69,.25); }` },
  { t: `p`, text: `required、minlength、min、max、pattern、type 都归浏览器判，不用写一行脚本，代价是提示长得丑、时机固定、文案只能靠 title。CSS 那两个伪类是白捡的红绿边框：浏览器判定结果直接挂到样式上。加上 form 上的 novalidate 就能把浏览器的气泡关掉，改用你自己的提示——但别顺手把 required 也删了，那是没脚本时唯一的底线。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `把校验挂在按钮的 click 上：回车提交绕过全部检查`,
    `不写 label 或 for 对不上 id：字段只剩 placeholder，一输入就消失，读屏软件也念不出`,
    `信了前端校验就当安全：脚本和 curl 都能绕过去，重名、负余额这类规则服务端必须再判`,
    `忘检查 response.ok：401、500 也被当成成功，界面显示完成而后台没动`,
    `给控件漏写 name：FormData 收上来是空的，页面不报错，只是后台永远少字段`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把注册表单接上提交事件，先只做 preventDefault，从控制台确认页面没跳走、屏还在`,
    `给三个字段各挑一条合适的 HTML 属性，再故意填一份非法数据，说出哪一层先拦住它`,
    `让后台返回 400 而不是成功，观察你的界面是否还会显示「已创建」，并说明问题出在哪一行`,
    `只靠 FormData 收集字段，加一个描述输入框而不改动任何收集代码`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：form 天生要整页跳转，接住 submit 的第一句 preventDefault 是它能留在同一屏里的唯一原因；前端校验管体验，服务端校验管安全。` }
];
