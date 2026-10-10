window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["webdev-c05"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把「定义、调用、参数、返回」这四件事分开看，再弄清函数和方法到底差在哪。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `函数是一段起了名字的代码，写下来的时候它一行都不执行。只有加上括号调用，程序才跳进去跑一遍，跑完把返回值交回调用处，回到刚才跳走的那一行继续。这一进一出就是它的全部机制：参数是外面递进来的值，return 是往外递的值，括号是开关。` },
  { t: `p`, text: `方法（method）是挂在对象上的函数，调用时要写对象名，比如 arr.push。区别不在写法而在归属：函数自己存在，方法靠某个对象活着，内部靠 this 指「叫我的是谁」。把同样一段逻辑复制二十处不是啰嗦而是危险：改需求时你会漏掉两处，而漏掉的那两处不会报错，只会安静地给出旧结果。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250" font-family="sans-serif"><text x="320" y="20" font-size="15" text-anchor="middle" fill="#22314e">一次调用里数据的走向</text><rect x="20" y="46" width="170" height="52" rx="6" fill="#eef4ff" stroke="#5b7fd1"/><text x="105" y="68" font-size="14" text-anchor="middle" fill="#22314e">调用处</text><text x="105" y="88" font-size="14" text-anchor="middle" fill="#22314e">greet(小喵, 早上好)</text><rect x="235" y="46" width="170" height="52" rx="6" fill="#e8f6ee" stroke="#3d9a63"/><text x="320" y="68" font-size="14" text-anchor="middle" fill="#1d4230">定义处（此时不执行）</text><text x="320" y="88" font-size="14" text-anchor="middle" fill="#1d4230">function greet(名, 问候)</text><rect x="450" y="46" width="170" height="52" rx="6" fill="#fdf0e6" stroke="#c2732b"/><text x="535" y="68" font-size="14" text-anchor="middle" fill="#5c3410">函数体</text><text x="535" y="88" font-size="14" text-anchor="middle" fill="#5c3410">拼出消息，return 交出</text><line x1="190" y1="62" x2="233" y2="62" stroke="#3d9a63" stroke-width="2"/><line x1="405" y1="62" x2="448" y2="62" stroke="#3d9a63" stroke-width="2"/><line x1="535" y1="98" x2="535" y2="140" stroke="#c2732b" stroke-width="2"/><line x1="535" y1="140" x2="105" y2="140" stroke="#c2732b" stroke-width="2"/><line x1="105" y1="140" x2="105" y2="118" stroke="#c2732b" stroke-width="2"/><text x="320" y="132" font-size="14" text-anchor="middle" fill="#5c3410">返回值沿这条路交回调用处，调用处把它存进变量</text><rect x="20" y="162" width="600" height="76" rx="6" fill="#f7f8fb" stroke="#c7d0de"/><text x="36" y="184" font-size="14" fill="#3d4c66">console.log(greet(小喵, 早上好)) 是把返回值递给另一个函数；</text><text x="36" y="204" font-size="14" fill="#3d4c66">函数体里自己 console.log 的那一句，调用处拿不到任何东西，返回的是 undefined。</text><text x="36" y="226" font-size="14" fill="#8a5a10">差别就在这里：往外「交值」只有 return 一条路，打印不算交值。</text></svg>`, caption: `进的是参数、出的是返回值；只会打印的函数没法参与任何计算。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `把一句需求变成一个可重复的动作：算折扣、格式化日期、校验邮箱`,
    `让改动只发生一次：改函数体，二十个调用处一起变`,
    `把结果交给下一步：一个函数的返回值是另一个函数的参数`,
    `延迟执行：把函数本身交出去，让 setTimeout 或者点击事件在合适的时候叫你`
  ] },
  { t: `h2`, text: `演示 1 · 定义、调用、带参数` },
  { t: `code`, lang: `javascript`, code: `function displayGreeting() {        // 定义：不执行` +
`\n  console.log("Hello, world!");` +
`\n}` +
`\ndisplayGreeting();                // 调用：括号是开关` +
`\n` +
`\nfunction greet(name, salutation = "Hello") {   // 第二个参数有默认值` +
`\n  console.log(salutation + ", " + name);` +
`\n}` +
`\ngreet("Christopher");             // Hello, Christopher` +
`\ngreet("Christopher", "Hi");       // Hi, Christopher` },
  { t: `p`, text: `默认值写在参数表里，调用时省略才生效；参数数量对不上不会报错，多出来的被忽略、少掉的变成 undefined，这也是排查「页面出现 undefined 字样」时最常见的来源。定义可以写在调用之后，函数声明会被提前处理，箭头函数赋值给 const 就不会——调用在前、定义在后要当心。` },
  { t: `h2`, text: `演示 2 · 返回值才是能用的东西` },
  { t: `code`, lang: `javascript`, code: `function createGreetingMessage(name) {` +
`\n  const message = "Hello, " + name;` +
`\n  return message;                 // 到此结束，把值交出去` +
`\n}` +
`\n` +
`\nconst greetingMessage = createGreetingMessage("Christopher");` +
`\nconsole.log(greetingMessage);      // Hello, Christopher` +
`\n` +
`\nconst shout = greetingMessage.toUpperCase();   // 方法：属于那个字符串` },
  { t: `p`, text: `return 之后的代码永远不执行，函数没有 return 就隐含返回 undefined。最后一行是方法调用的典型样子：点号前面那个值就是 this，同一个 toUpperCase 换给 shout 就是另一个字符串——函数属于名字，方法属于对象。` },
  { t: `h2`, text: `演示 3 · 函数当参数：回调与高阶` },
  { t: `code`, lang: `javascript`, code: `function displayDone() {` +
`\n  console.log("3 seconds has elapsed");` +
`\n}` +
`\nsetTimeout(displayDone, 3000);     // 传的是函数本身，没加括号` +
`\n` +
`\nsetTimeout(function () {            // 匿名函数：不想起名字` +
`\n  console.log("3 seconds has elapsed");` +
`\n}, 3000);` +
`\n` +
`\nsetTimeout(() => {                  // 箭头写法，同一件事` +
`\n  console.log("3 seconds has elapsed");` +
`\n}, 3000);` },
  { t: `p`, text: `第一行如果写成 setTimeout(displayDone(), 3000) 就是「立刻执行，然后把返回值交给定时器」——那返回值是 undefined，等待 3 秒后什么事也不会发生，这是初学者最稳的一个坑。把函数当值递出去，接收方（setTimeout、事件绑定、数组的 forEach）都叫高阶函数。` },
  { t: `h2`, text: `演示 4 · 方法从哪里来` },
  { t: `code`, lang: `javascript`, code: `const user = {` +
`\n  name: "Christopher",` +
`\n  sayHi() {` +
`\n    return "Hi, " + this.name;    // this 指向调用它的对象` +
`\n  }` +
`\n};` +
`\n` +
`\nuser.sayHi();              // Hi, Christopher` +
`\nconst f = user.sayHi;` +
`\nf();                       // 这里 this 已经不是 user，多半报错` },
  { t: `p`, text: `倒数两行是 this 的脾气：方法被「带着对象」调用才认得自己是谁，摘下来单独调用就把 this 丢了。上一课学的字符串方法、以后要用的数组方法，全都是这个形状：值在前，方法在后。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `递回调时手滑加了括号：立刻执行，定时器或事件里剩下 undefined`,
    `函数只 print 不 return：调用处拿到 undefined，于是后面每一步都在算 undefined`,
    `函数名写成 doIt、handle、data：三个月后必须从函数体第一行读起才知道它干什么`,
    `一个函数里既校验又拼字符串又发请求：任何一处想单独复用都得整包端走`,
    `把方法赋给变量再调用：this 丢，报错指向一个你完全没写错的行`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `写一个函数接收姓名和问候语、返回整句话，并给问候语设默认值；再写出两次调用（一次省略第二个参数）`,
    `把第一课那个斐波那契函数改成接收上下限两个参数，返回值仍然是数组`,
    `用 setTimeout 的三种写法（具名函数、匿名函数、箭头函数）各跑一次，然后把第一种加上括号，观察它为什么立刻执行`,
    `给一个对象写两个方法，让第二个方法用 this 调用第一个，再验证摘下来单独调用会不会坏`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：定义不是执行，参数进、返回值出，函数能当值递出去——把这四点分清，剩下的语法都只是查手册。` }
];
