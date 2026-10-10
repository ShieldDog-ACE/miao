window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["webdev-c13"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把表单、本地存储、异步请求三件事串成一条链——用户填的东西存到哪、什么时候读回来、数据从哪儿取。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `表单提交有个默认动作：把字段拼进请求、整页重新加载。脚本要接住这次提交，第一件事就是 preventDefault（第三课那句「拦掉浏览器的默认行为」在这儿正好用上），否则你的处理函数刚跑完，页面就刷新，变量全没了。拦下来之后，输入框的值读成字符串，交给该处理的函数。` },
  { t: `p`, text: `本地存储是同源下的一份键值对：setItem 写、getItem 读、removeItem 删，键和值都必须是字符串。它同步、容量以兆算、写在磁盘上，所以关页面重开还在。要放对象就得先 JSON 序列化再存，取出来反序列化——「存的类型」和「拿到的类型」永远隔着这一层。它跟会话存储的差别只在活多久：一个跟着源一直留，一个关掉标签就走。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280" font-family="sans-serif"><text x="320" y="20" font-size="15" text-anchor="middle" fill="#22314e">同一段代码的两次打开，读写的是一同一份存储</text><rect x="14" y="42" width="300" height="200" rx="6" fill="#f7f8fb" stroke="#c7d0de"/><text x="164" y="64" font-size="15" text-anchor="middle" fill="#22314e">第一次打开</text><text x="30" y="90" font-size="14" fill="#3d4c66">init 里 getItem(apiKey)</text><rect x="30" y="98" width="270" height="26" fill="#ffffff" stroke="#a5321f"/><text x="40" y="116" font-size="14" fill="#a5321f">拿到 null —— 从没存过</text><text x="30" y="140" font-size="14" fill="#3d4c66">于是显示表单，等用户填</text><text x="30" y="164" font-size="14" fill="#3d4c66">提交：preventDefault</text><text x="30" y="186" font-size="14" fill="#1d4230">setItem 写两条，然后才去 fetch</text><text x="30" y="212" font-size="14" fill="#6b7c93">此刻存储里有了内容</text><rect x="326" y="42" width="300" height="200" rx="6" fill="#f7f8fb" stroke="#c7d0de"/><text x="476" y="64" font-size="15" text-anchor="middle" fill="#22314e">第二次打开</text><text x="442" y="90" font-size="14" fill="#3d4c66">init 里 getItem</text><rect x="442" y="98" width="170" height="26" fill="#ffffff" stroke="#3d9a63"/><text x="452" y="116" font-size="14" fill="#1d4230">拿到字符串，直接用</text><text x="342" y="140" font-size="14" fill="#3d4c66">表单不显示，直接 fetch 上次那个区域</text><text x="342" y="164" font-size="14" fill="#3d4c66">要换区域才点重置，removeItem 清掉</text><text x="342" y="192" font-size="14" fill="#8a5a10">顺序很重要：先读到值再决定界面长什么样，</text><text x="342" y="214" font-size="14" fill="#8a5a10">反过来写会让表单闪一下又消失</text></svg>`, caption: `两次打开走的是同一份键值对，差别全在 getItem 那一下拿到的是 null 还是字符串。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `记住用户填过的偏好：区域、主题、字号，下次打开不用再问一遍`,
    `把要反复用的凭据留一份在本地，避免每次开面板都重新粘贴`,
    `做一次「正在加载」的状态：先显示提示，请求回来再替换内容`,
    `出错时把原因写进界面而不是丢进控制台，用户才有的可改`
  ] },
  { t: `h2`, text: `演示 1 · 先把要操作的元素抓牢` },
  { t: `code`, lang: `javascript`, code: `const form = document.querySelector(".form-data");` +
`\nconst region = document.querySelector(".region-name");` +
`\nconst apiKey = document.querySelector(".api-key");` +
`\nconst loading = document.querySelector(".loading");` +
`\nconst errors = document.querySelector(".errors");` +
`\nconst results = document.querySelector(".result-container");` +
`\n\nform.addEventListener("submit", (e) => handleSubmit(e));` +
`\nclearBtn.addEventListener("click", (e) => reset(e));` +
`\ninit();                       // 一进来先读存储` },
      { t: `p`, text: `开头六行只做一件事：把节点引用存成常量（第 10 课那句「先找到节点再动手」）。原因是后面每个函数都要碰它们，每次都写一遍选择器既慢又容易写歪；存成 const 还顺便声明了「这个引用不会换」。` },
  { t: `h2`, text: `演示 2 · 接住提交，写进存储` },
  { t: `code`, lang: `javascript`, code: `function handleSubmit(e) {` +
`\n  e.preventDefault();                 // 不写这句，整页刷新，一切归零` +
`\n  setUpUser(apiKey.value, region.value);   // value 永远是字符串（第 4 课）` +
`\n}` +
`\n` +
`\nfunction setUpUser(key, name) {` +
`\n  localStorage.setItem("apiKey", key);` +
`\n  localStorage.setItem("regionName", name);` +
`\n  loading.style.display = "block";` +
`\n  errors.textContent = "";` +
`\n  displayCarbonUsage(key, name);` +
`\n}` },
      { t: `p`, text: `注意写存储和发起请求是分开的两步：写是本地动作，几乎不花时间；请求要等网络，所以先把 loading 显出来再调用。顺序反了的话，用户点了提交之后面对一个毫无反应的界面，会再点一次——这就是重复提交按钮的由来。` },
  { t: `h2`, text: `演示 3 · 开机先问存储` },
  { t: `code`, lang: `javascript`, code: `function init() {` +
`\n  const savedKey = localStorage.getItem("apiKey");` +
`\n  const savedRegion = localStorage.getItem("regionName");` +
`\n  if (savedKey === null || savedRegion === null) {` +
`\n    form.style.display = "block";       // 第一次：只有表单` +
`\n    results.style.display = "none";` +
`\n    return;` +
`\n  }` +
`\n  form.style.display = "none";` +
`\n  loading.style.display = "block";` +
`\n  displayCarbonUsage(savedKey, savedRegion);` +
`\n}` },
      { t: `p`, text: `getItem 拿不到键时给的是 null 而不是 undefined，所以判空可以直接用 null 比较，第 6 课那几个假值在这儿派得上用场。开头那次 return 是必需的提前退出：不 return 就会一路把 fetch 跑完再回头显示表单，用户看到的是先闪结果再闪表单。` },
  { t: `h2`, text: `演示 4 · 异步请求与错误` },
  { t: `code`, lang: `javascript`, code: `async function displayCarbonUsage(key, region) {` +
`\n  try {` +
`\n    const url = "https://api.co2signal.com/v1/latest?region=" + region;` +
`\n    const resp = await fetch(url, { headers: { "auth-token": key } });` +
`\n    const data = await resp.json();` +
`\n    usage.textContent = data.data.intensity.actual;` +
`\n  } catch (err) {` +
`\n    errors.textContent = "取不到数据：" + err.message;` +
`\n  } finally {` +
`\n    loading.style.display = "none";` +
`\n  }` +
`\n}` },
      { t: `p`, text: `fetch 回来的是响应不是数据：json 那一步还要再等一次，所以两处 await。网络断、地址错会走 catch，但状态码 401 和 500 不会——那种情况得自己判 resp.ok 再抛，否则错误被当成正常结果，页面上只剩 undefined。把隐藏 loading 放进 finally，是为了让成功和失败两条路都走到同一句，不用写两遍也不会漏一遍。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `忘写 preventDefault：提交把页面重载，处理函数像没执行一样`,
    `直接把对象塞进 setItem：存进去的是字符串 [object Object]，取出来什么也不是——要 JSON 序列化`,
    `把密钥当普通偏好明文长期存着，又在界面上原样显示：本地存储不是保险箱`,
    `只在成功路径改 loading：请求失败后那个「加载中」永远转着`,
    `以为存储是无限的、永远在：配额满了 setItem 抛错，隐私模式下写了也不留`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `做一个「记住深色模式开关」的最小版本：写入、init 读回、下次打开直接是上次的样子`,
    `把演示 4 加上对响应状态的判断：拿到 401 时显示「密钥不对」而不是空白`,
    `给存储的读写各打一次时间戳，第二次打开时显示「上次使用是几天前」`,
    `写一个重置函数，把两条键删掉并把界面退回第一次的样子，并说明为什么不能只清界面`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：本地存储只认字符串、只留在同源；「开机先读它、提交后才写它」这条时序立住了，状态才真的能留下来。` }
];
