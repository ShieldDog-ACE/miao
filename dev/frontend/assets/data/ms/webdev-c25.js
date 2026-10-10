window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["webdev-c25"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把「编辑器到底替你做了哪些事」和「你的改动存在哪一层」讲清楚，顺带用浏览器里那个 VS Code。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `记事本和代码编辑器的差别不在能不能打字，而在它是否理解你在写的语言：按扩展名加载语法着色，边打字边补全，未声明的标识符和没闭合的括号当场画红线，大仓库里还能跨文件跳转搜索。这些能力来自语言服务进程：桌面版跑在你机器上，vscode.dev 那一版跑在浏览器标签页里，界面一样，边界是它没有你这台机器的文件系统，也没有能起本地进程的扩展。` },
  { t: `p`, text: `第二个边界更容易吃亏：你改的东西在哪一层。编辑器缓冲区里的字没保存就不在任何文件里；虚拟工作区里改完没提交，就只活在这一个标签页，关掉或刷新全没；只有走到 commit 并推上去，改动才落到 GitHub。Git 那条线是四格：改动、暂存、本地提交、远端仓库，Source Control 面板就是这四格的图形界面——加号是暂存，勾是提交，同步是推。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><text x="320" y="22" font-size="15" text-anchor="middle" fill="#22314e">同一份改动，四层里只有一层关不掉</text><rect x="18" y="48" width="140" height="80" rx="6" fill="#eef4ff" stroke="#5b7fd1"/><text x="88" y="74" font-size="14" text-anchor="middle" fill="#22314e">编辑器缓冲</text><text x="88" y="96" font-size="14" text-anchor="middle" fill="#5b6a86">标签页上的字</text><text x="88" y="116" font-size="14" text-anchor="middle" fill="#a5321f">没保存就没落盘</text><rect x="178" y="48" width="140" height="80" rx="6" fill="#fff6e6" stroke="#c9922b"/><text x="248" y="74" font-size="14" text-anchor="middle" fill="#7a5310">工作区</text><text x="248" y="96" font-size="14" text-anchor="middle" fill="#7a5310">改了，未暂存</text><text x="248" y="116" font-size="14" text-anchor="middle" fill="#a5321f">关标签页全丢</text><rect x="338" y="48" width="140" height="80" rx="6" fill="#f7eefb" stroke="#8a5bb0"/><text x="408" y="74" font-size="14" text-anchor="middle" fill="#4d2f66">暂存 + 提交</text><text x="408" y="96" font-size="14" text-anchor="middle" fill="#4d2f66">加号，再点勾</text><text x="408" y="116" font-size="14" text-anchor="middle" fill="#a5321f">还在你浏览器里</text><rect x="498" y="48" width="124" height="80" rx="6" fill="#e8f6ee" stroke="#3d9a63"/><text x="560" y="74" font-size="14" text-anchor="middle" fill="#1d4230">GitHub</text><text x="560" y="96" font-size="14" text-anchor="middle" fill="#1d4230">同步之后</text><text x="560" y="116" font-size="14" text-anchor="middle" fill="#1d4230">换台机器也在</text><line x1="158" y1="88" x2="176" y2="88" stroke="#5b6a86" stroke-width="2"/><line x1="318" y1="88" x2="336" y2="88" stroke="#5b6a86" stroke-width="2"/><line x1="478" y1="88" x2="496" y2="88" stroke="#5b6a86" stroke-width="2"/><text x="167" y="72" font-size="14" text-anchor="middle" fill="#5b6a86">保存</text><text x="327" y="72" font-size="14" text-anchor="middle" fill="#5b6a86">加号</text><text x="487" y="72" font-size="14" text-anchor="middle" fill="#5b6a86">同步</text><rect x="18" y="170" width="604" height="70" rx="6" fill="#f7f8fb" stroke="#8896ad"/><text x="40" y="196" font-size="14" fill="#22314e">刷新这个标签页，从左往右数，只有跨过「同步」那一格的改动还活着——</text><text x="40" y="220" font-size="14" fill="#a5321f">和上一课那个 let account 是同一类问题：易失的位置存 persistent 的东西</text><text x="320" y="272" font-size="14" text-anchor="middle" fill="#22314e">中间两格靠 Source Control 面板：绿字是新增，红字是删除，未提交的一直在 Changes 里等你</text></svg>`, caption: `横向四格是改动的四趟旅程；底下那条说的是最容易踩的一格——虚拟工作区不留未提交的改动。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `在学校机房、别人的电脑、Chromebook 上打开同一份代码，界面跟着你走`,
    `不用装任何东西就能读一个大仓库：URL 改一个词就进去了`,
    `改文档改样式这类小活直接在浏览器里提交，省掉克隆和装依赖`,
    `装一个格式化程序，全项目缩进和引号统一，不用手工对齐`
  ] },
  { t: `h2`, text: `演示 1 · 两个入口，一条 URL 规则` },
  { t: `p`, text: `两个入口。欢迎页上那个 Open Remote Repository 按钮，贴仓库地址进去；更省事的是改地址栏——把 github.com 换成 vscode.dev/github，后面那一段一个字都不用动。找不到按钮就按 Ctrl+Shift+P 叫出命令面板，输入 open remote，它还记着你最近开过的仓库。左边那一竖条是 Activity Bar：文件树、搜索、Source Control、扩展都在那儿，中间侧栏内容跟着它变。` },
  { t: `h2`, text: `演示 2 · 编辑器在你打字时盯什么` },
  { t: `code`, lang: `javascript`, code: `function total(list) {\n  let sum = 0;\n  for (const item of list) {\n    sum = sum + item.amout;\n  }\n  return sum;\n}\nconsole.log(total(tx));` },
  { t: `p`, text: `这段没跑起来才有价值：amout 少了一个 n，运行时是 undefined，编辑器不报错，只有补全里给的是另一个名字；tx 从没声明过，行上一道波浪线，鼠标停上去写着未找到名称。前者要靠人读，后者是语言服务白送的。扩展名决定它给不给你这套服务，写成 app.jss 就什么都没有——新建文件时那个后缀不是装饰。` },
  { t: `h2`, text: `演示 3 · 格式统一交给程序，别手工对齐` },
  { t: `code`, lang: `css`, code: `.card{padding:1rem;   border-radius:8px\n;background:#fff}\n.card    h2{font-size:1.1rem;\n  margin:0 0 .5rem}` },
  { t: `p`, text: `这种文件能跑，只是没人愿意读第二遍。装一个格式化程序后 Shift+Alt+F 一次成形：缩进统一、每条声明一行。团队里更常用的是把规则写进项目设置，任何人保存都按同一套走——差异从「谁的习惯对」变成「项目那条规定」。改完去 Source Control 看 diff，一眼能确认程序只动了格式没动数值，这是它和手改最大的区别：能被审查。` },
  { t: `h2`, text: `演示 4 · 提交那一格：加号、勾、同步` },
  { t: `code`, lang: `html`, code: `<!-- 改动前 -->\n<title>Bank App</title>\n<!-- 改动后，Source Control 里这条显示为红绿两行 -->\n<title>Bank App · 我的账户</title>` },
  { t: `p`, text: `Source Control 面板列出所有未提交的改动，鼠标移到文件上那个加号是「把这一份放进这次提交」，勾才是提交，上面填一句说明。说明写「Add contact form」「Fix broken navigation」这种动词开头的短句，别写「改了点东西」——三个月后你要靠这句话判断哪一次提交弄坏了页面。登录 GitHub 才推得上去；没登录时改动只活在这一个标签页。扩展面板要留意标注：需要起本地进程的那类（比如替你开预览服务器的）在浏览器版里装不上，市场会直说不支持 web。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `改完直接关标签页：虚拟工作区不替你留未提交的改动，写多少丢多少`,
    `把「自动保存」当成「已经备份」：保存只落到工作区，Git 那一层一步没走`,
    `装扩展不看是否支持 web：装不上还算清楚的，装上后静默不干活最难查`,
    `新建文件不带扩展名：没有着色、没有补全、没有红线，编辑器退化成记事本`,
    `一次提交塞十个不相关文件：diff 看不出重点，回滚只能一起回，说明还写「update」`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `只用地址栏那一招打开这门课的仓库，说出你改了 URL 的哪一部分`,
    `在里面故意留一个拼错的标识符和一个未声明的变量，指出编辑器只报出哪一个、为什么`,
    `改一行标题、暂存、提交并同步，然后在 GitHub 网页上找到那条提交，念出你写的说明`,
    `关掉标签页再打开，验证你的改动还在不在，并说明它是在哪一步变得「不怕关标签页」的`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：编辑器负责在你打字时盯语法，Git 负责让改动活过这个标签页；分不清这两层，就会把没提交的活儿存在一个会关掉的窗口里。` }
];
