window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["webdev-c06"] = [
  { t: `tip`, color: `blue`, text: `本课目标：搞清布尔是怎么被算出来的——比较、相等、逻辑运算、短路，然后才轮到 if 和 switch 的写法。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `实际项目里几乎没人手写 true 和 false，程序里的布尔值几乎都是算出来的：比较运算符读两个值、回一个布尔；逻辑运算符读几个布尔、回一个布尔。if 括号里的位置本来就只放布尔，写别的会被拖去转换——这一步转换是大量诡异结果的源头，认得它比背语法有用。` },
  { t: `p`, text: `三条规矩先记住。第一，相等比较一律用三个等号 ===，它先比类型再比值；两个等号的 == 会先把两边转成同一类型，于是空字符串等于 0、null 等于 undefined，读代码时你没法预判结果。第二，六个假值：false、0、空字符串、null、undefined、NaN，其余一切（包括空数组和空对象）都是真值。第三，&& 和 || 是短路的：左边已经决定答案，右边根本不会执行。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250" font-family="sans-serif"><text x="320" y="20" font-size="15" text-anchor="middle" fill="#22314e">短路：右边根本没跑</text><rect x="20" y="44" width="130" height="46" rx="6" fill="#fdf0e6" stroke="#c2732b"/><text x="85" y="64" font-size="14" text-anchor="middle" fill="#5c3410">条件 A 为假</text><text x="85" y="82" font-size="14" text-anchor="middle" fill="#5c3410">false &amp;&amp; …</text><line x1="150" y1="67" x2="230" y2="67" stroke="#c2732b" stroke-width="2"/><rect x="232" y="44" width="150" height="46" rx="6" fill="#f7f7fa" stroke="#b0b0c0" stroke-dasharray="4 4"/><text x="307" y="64" font-size="14" text-anchor="middle" fill="#8b8b9e">条件 B 不执行</text><text x="307" y="82" font-size="14" text-anchor="middle" fill="#8b8b9e">它里面的函数也不叫</text><line x1="382" y1="67" x2="452" y2="67" stroke="#8896ad" stroke-width="2"/><rect x="454" y="44" width="166" height="46" rx="6" fill="#f2f2f7" stroke="#6b6b85"/><text x="537" y="64" font-size="14" text-anchor="middle" fill="#2b2b3d">整个表达式 false</text><text x="537" y="82" font-size="14" text-anchor="middle" fill="#2b2b3d">&& 要两边都真</text><rect x="20" y="110" width="130" height="46" rx="6" fill="#e8f6ee" stroke="#3d9a63"/><text x="85" y="130" font-size="14" text-anchor="middle" fill="#1d4230">条件 A 为真</text><text x="85" y="148" font-size="14" text-anchor="middle" fill="#1d4230">true || …</text><line x1="150" y1="133" x2="230" y2="133" stroke="#3d9a63" stroke-width="2"/><rect x="232" y="110" width="150" height="46" rx="6" fill="#f7f7fa" stroke="#b0b0c0" stroke-dasharray="4 4"/><text x="307" y="130" font-size="14" text-anchor="middle" fill="#8b8b9e">条件 B 不执行</text><text x="307" y="148" font-size="14" text-anchor="middle" fill="#8b8b9e">答案已经定了</text><line x1="382" y1="133" x2="452" y2="133" stroke="#8896ad" stroke-width="2"/><rect x="454" y="110" width="166" height="46" rx="6" fill="#f2f2f7" stroke="#6b6b85"/><text x="537" y="130" font-size="14" text-anchor="middle" fill="#2b2b3d">整个表达式 true</text><text x="537" y="148" font-size="14" text-anchor="middle" fill="#2b2b3d">|| 只要一边真</text><text x="320" y="182" font-size="14" text-anchor="middle" fill="#3d4c66">于是这一句合法且常见：先判存在，再取值</text><text x="320" y="204" font-size="14" text-anchor="middle" fill="#8a5a10">user &amp;&amp; user.name    ——  左边是 undefined 时右边压根不碰，就不会报错</text><text x="320" y="230" font-size="14" text-anchor="middle" fill="#3d4c66">同一形状也是把默认值塞进参数的土办法：name || 访客</text></svg>`, caption: `虚线框是被跳过的部分：短路不是优化提示，是实打实的执行顺序。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `让同一份代码对不同输入走不同路：够钱就买、不够就提示差额`,
    `把一堆脏数据筛掉：只留下满足两个条件的项`,
    `给缺失的值兜底：字段没读到时用默认文案，而不是让 undefined 出现在页面上`,
    `把「多条件」压成一个可读的判断：打折价与原票价只满足其一就放行`
  ] },
  { t: `h2`, text: `演示 1 · if 与 else 的两条路` },
  { t: `code`, lang: `javascript`, code: `let currentMoney = 500;` +
`\nlet laptopPrice = 800;` +
`\nlet discount = laptopPrice * 0.2;` +
`\nlet salePrice = laptopPrice - discount;` +
`\n` +
`\nif (currentMoney >= laptopPrice || currentMoney >= salePrice) {` +
`\n  console.log("买！");` +
`\n} else if (currentMoney >= salePrice * 0.8) {` +
`\n  console.log("再攒一点");` +
`\n} else {` +
`\n  console.log("差 " + (salePrice - currentMoney) + " 元");` +
`\n}` },
  { t: `p`, text: `else if 是按顺序试的：第一条命中就不再往下看，所以顺序本身就是逻辑。把范围宽的那条写在前面，窄的那条永远不会被执行——这类 bug 不报错，只是某段代码再也不出现。` },
  { t: `h2`, text: `演示 2 · 等号的三种写法` },
  { t: `code`, lang: `javascript`, code: `5 == "5";        // true：把字符串转成数字再比` +
`\n5 === "5";       // false：类型不同，直接否` +
`\n"" == 0;         // true：两个都是假值` +
`\n"" === 0;        // false` +
`\nnull == undefined;   // true` +
`\nnull === undefined;  // false：语义本来就该不同` +
`\nNaN === NaN;     // false：判 NaN 要用 isNaN` +
`\n1 !== 2;         // true：不等于` },
  { t: `p`, text: `从 input 拿到的值全是字符串（上一课讲过），所以「用户填 5」和「代码里的 5」用 === 一比就否——要么先转换，要么就承认这个否是有道理的。把 == 当成可选写法是省一时之力的做法，后面等着你的是一整晚的排查。` },
  { t: `h2`, text: `演示 3 · 真值判断与兜底` },
  { t: `code`, lang: `javascript`, code: `let name = "";` +
`\nif (name) {                       // 空字符串是假值，这里不执行` +
`\n  console.log("你好，" + name);` +
`\n}` +
`\nlet display = name || "访客";      // 短路拿到右边` +
`\nconsole.log(display);             // 访客` +
`\n` +
`\nlet list = [];` +
`\nif (list) { console.log("空数组也是真值"); }   // 会执行` +
`\nif (list.length) { console.log("看长度才对"); } // 不执行` },
  { t: `p`, text: `最后两行是最典型的坑：判断数组有没有内容要看 length，直接判断数组本身永远为真。判断对象同理——要么看具体属性，要么看 Object.keys 的长度，别指望 if 帮你认空。` },
  { t: `h2`, text: `演示 4 · switch 与三元` },
  { t: `code`, lang: `javascript`, code: `let dayNumber = 2;` +
`\nlet dayName;` +
`\nswitch (dayNumber) {` +
`\n  case 1: dayName = "Monday"; break;` +
`\n  case 2: dayName = "Tuesday"; break;   // 不写 break 就漏到下一条` +
`\n  case 3: dayName = "Wednesday"; break;` +
`\n  default: dayName = "不认识";` +
`\n}` +
`\n` +
`\nlet firstNumber = 20;` +
`\nlet secondNumber = 10;` +
`\nlet big = firstNumber > secondNumber ? firstNumber : secondNumber;` },
  { t: `p`, text: `switch 适合「一个值对好几个固定选项」，它比的是严格相等，所以字符串和数字不会互相认。break 漏写时前一个 case 会继续执行后一个的语句（fall through），偶尔是故意的，通常是事故。三元只适合赋一个值，把三元套三元写成阶梯是给自己下毒。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `用 == 图省事：空串、0、false、null 互相打通，条件什么时候成立没人说得清`,
    `else if 的顺序写成从宽到窄，窄那条永远跑不到`,
    `switch 忘写 break，一次匹配执行了三条语句`,
    `把赋值写成比较：if (count = 10) 永远为真，少了一个等号就少掉一整晚`,
    `用 if (arr) 判数组有没有内容：空数组是真值，该看 arr.length`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把演示 1 的三个分支顺序打乱，跑出一次「窄分支永远不执行」，再改回来`,
    `给演示 2 的每一行先在纸上写答案，再进控制台核对，重点看 == 那三行`,
    `写一段判断：用户名输入为空时显示「访客」，只有空格时也算空——提示：用上一课学的 trim`,
    `把一段三层嵌套的 if 改成 switch 或提前返回，比较两种写法各有多少行`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：分支的难点从来不是 if 怎么写，是括号里那个布尔值到底是怎么被算出来的。` }
];
