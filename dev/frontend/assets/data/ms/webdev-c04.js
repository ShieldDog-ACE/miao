window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["webdev-c04"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把 JavaScript 的几种基本类型和 let、const 的边界弄清，顺便搞明白那个最爱骗人的加号。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `声明一个变量是「名字 + 关键字」两件事：let 说这个位置以后可以换值，const 说这个绑定不许再动。两个都是块级作用域——花括号一关，外面就查不到它，这是 ES6 之后相对 var 的真正改进，var 会把声明漏到函数顶层并允许重复声明。ES6 之前只有 var，你在老代码里还会遇到它，新代码一律 let 和 const。` },
  { t: `p`, text: `类型跟着值走，不跟着名字走。基本类型有 number、string、boolean、null、undefined、symbol、bigint，其中前四种是你天天用的。赋值号不是等号，它做的事是把右边的值绑到左边的名字上；而加号最滑：两边都是 number 就相加，任何一边是 string 就变成拼接。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250" font-family="sans-serif"><text x="320" y="20" font-size="15" text-anchor="middle" fill="#22314e">同一个加号，两条分支</text><rect x="20" y="40" width="180" height="40" rx="6" fill="#eef4ff" stroke="#5b7fd1"/><text x="110" y="65" font-size="15" text-anchor="middle" fill="#22314e">表达式 a + b</text><line x1="200" y1="60" x2="270" y2="38" stroke="#8896ad" stroke-width="2"/><line x1="200" y1="60" x2="270" y2="102" stroke="#8896ad" stroke-width="2"/><rect x="272" y="18" width="170" height="42" rx="6" fill="#e8f6ee" stroke="#3d9a63"/><text x="357" y="36" font-size="14" text-anchor="middle" fill="#1d4230">两边都是 number</text><text x="357" y="54" font-size="14" text-anchor="middle" fill="#1d4230">5 + 3 得到 8</text><rect x="272" y="82" width="170" height="42" rx="6" fill="#fdf0e6" stroke="#c2732b"/><text x="357" y="100" font-size="14" text-anchor="middle" fill="#5c3410">有一边是 string</text><text x="357" y="118" font-size="14" text-anchor="middle" fill="#5c3410">5 + 3 得到 53</text><line x1="442" y1="39" x2="500" y2="70" stroke="#8896ad" stroke-width="2"/><line x1="442" y1="103" x2="500" y2="72" stroke="#8896ad" stroke-width="2"/><rect x="502" y="50" width="124" height="42" rx="6" fill="#f2f2f7" stroke="#6b6b85"/><text x="564" y="68" font-size="14" text-anchor="middle" fill="#2b2b3d">数字相加</text><text x="564" y="86" font-size="14" text-anchor="middle" fill="#2b2b3d">或字符串拼接</text><rect x="20" y="140" width="606" height="96" rx="6" fill="none" stroke="#c7d0de" stroke-dasharray="5 4"/><text x="36" y="164" font-size="14" fill="#3d4c66">同一个加号还牵连另外两件事：</text><text x="36" y="186" font-size="14" fill="#3d4c66">parseInt 与 Number 处理 5 元 3 角的方式不同；字符串前加号会让它变成数字，而数字前加号又可能变回拼接。</text><text x="36" y="210" font-size="14" fill="#3d4c66">所以读加号时先问一句：两边现在各是什么类型？</text><text x="36" y="232" font-size="14" fill="#8a5a10">经验做法：从 input 里拿到的值永远是 string，先转成 number 再算。</text></svg>`, caption: `这张图画的是运算方向而不是画面布局：类型决定加号走哪一支。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `把一份输入变成可比较的值：文本框里的 18 变成数字 18`,
    `用名字代替记忆：一段计算里出现十次的 3.14 换成 PI 后，改一次就全改`,
    `用取余算周期：偶数判断、每隔几个换一行、把秒换算成分钟余秒`,
    `提前看出 bug：数字和字符串混在一起，程序不报错，只是给你一个 53`
  ] },
  { t: `h2`, text: `演示 1 · 声明、赋值、重新赋值` },
  { t: `code`, lang: `javascript`, code: `let myVariable;        // 声明了但没值，此时是 undefined` +
`\nmyVariable = 123;      // 赋值，等号是「绑过去」` +
`\nmyVariable = 321;      // let 允许换` +
`\n\nconst PI = 3;` +
`\nPI = 4;                // 报错：Assignment to constant variable` +
`\n\nconst obj = { a: 3 };` +
`\nobj = { b: 5 };        // 报错：换的是绑定` +
`\nobj.a = 5;             // 允许：改的是内容` },
  { t: `p`, text: `最后三行是 const 真正承诺的东西：它锁的是「这个名字指向哪个值」，不是「值里面有什么」。对象、数组的内容照样可以改。想让内容也不动，得另外上锁，那是后面的事。` },
  { t: `h2`, text: `演示 2 · 四种常用类型` },
  { t: `code`, lang: `javascript`, code: `let age = 25;                  // number，没有整数与浮点之分` +
`\nlet name2 = "小喵";            // string，单引号双引号等价` +
`\nlet isActive = true;           // boolean，只有 true 和 false` +
`\nlet nothing = null;            // 你主动放的空` +
`\nlet notSet;                    // 不写就是 undefined` +
`\n` +
`\ntypeof age;                    // number` +
`\ntypeof name2;                  // string` +
`\ntypeof isActive;               // boolean` +
`\ntypeof notSet;                 // undefined` +
`\ntypeof null;                   // object —— 语言最老的一个错，别指望它` },
  { t: `p`, text: `null 和 undefined 的分工值得记：undefined 通常说明「这里还没给值」，null 是你自己写上去的「这里明确没有」。判断时优先用 == null 之外的显式比较，别把两者混着当同一种空。` },
  { t: `h2`, text: `演示 3 · 字符串与数字互相转换` },
  { t: `code`, lang: `javascript`, code: `let a = "42";` +
`\nNumber(a) + 8;             // 50：显式转换，干净` +
`\na * 2;                     // 84：乘法只认数字，隐式转了` +
`\na + 8;                     // 428：加法看见字符串就拼接` +
`\nparseInt("42px", 10);      // 42：读数字读到不认就停` +
`\nNumber("42px");            // NaN：整串不是数字就作废` +
`\nNaN === NaN;               // false：唯一不等于自己的值` +
`\nisNaN(Number("abc"));      // true：判断要不要用 isNaN` },
  { t: `p`, text: `字符串前放加号和放乘号的后果完全不同：乘号会强制转数字，加号会顺着字符串去拼。所以「用加号转数字」是个坏习惯（0 + 1 得 01），要么老实写 Number，要么一开始就把输入转换掉。` },
  { t: `h2`, text: `演示 4 · 字符串写法与模板` },
  { t: `code`, lang: `javascript`, code: `let first = "Hello";` +
`\nlet last = "World";` +
`\n\nfirst + " " + last + "!";        // 拼接：一眼看得出是字符串` +
`\nfirst.concat(" ", last);         // 方法写法，效果一样` +
`\nfirst.toUpperCase();             // HELLO：原串没变` +
`\n"  有空格  ".trim();             // 去掉两端空白` +
`\n"a,b,c".split(",");              // 得到三个元素的数组` +
`\nfirst.length;                    // 5：属性，不带括号` },
  { t: `p`, text: `模板字符串是另一种写法，用反引号把整段包住、在里面直接插变量，本教材为了排版统一没用它。要分清方法和属性：length 后面不加括号，toUpperCase 必须加括号——写成 first.toUpperCase 拿到的是函数本身，不会执行，这是排查「页面上出现 function 字样」时的第一个怀疑点。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `0.1 + 0.2 得到 0.30000000000000004 就以为算错了：这是二进制小数的固有结果，钱要用分为单位存整数`,
    `输入框的值直接相加：value 永远是字符串，先 Number 再用`,
    `用 var 混在块里：条件里声明、条件外用，读到的是 undefined，编译器一声不响`,
    `const 声明了就以为内容安全：数组照样能 push，要的是别重新赋值这层意思`,
    `拿 typeof 判断 null 和数组：前者给 object，后者也给 object，数组要看 Array.isArray`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `把演示 3 逐行贴进控制台跑一遍，找出那个结果不是数字的表达式，说出它为什么`,
    `写一个「秒数换算成几分几秒」的小段：用到除法和取余，注意两个运算符各管什么`,
    `故意给 const 声明的数组加一个元素、再换一个新数组，比较报错信息的不同`,
    `拿一段用 var 写的旧代码改成 let 和 const，说明哪些地方必须用 const`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：类型是值身上的标签而不是名字身上的，加号只看值——读任何一行运算前先问一句「它现在是什么类型」。` }
];
