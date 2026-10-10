window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["ml-c13"] = [
  { t: `tip`, color: `blue`, text: `本课目标：把训练好的分类器导成 ONNX，让浏览器里的 runtime 直接跑推断。这是第 9 课那条交接的另一条路——训练仍在 notebook，推理搬到别人的机器上。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `第 9 课是 Python 交给 Python：.pkl 交给 Flask，模型留在服务器上，网页只是它的一张脸，问一次要走一趟网络。这一课换成 ONNX（Open Neural Network Exchange，一种跨语言的模型格式）：把 sklearn 的模型导成一个文件，浏览器里的 onnxruntime-web 把它加载起来就地算。一个后端也不要，断网也能用。` },
  { t: `p`, text: `好处和代价从同一个分岔里长出来。省下服务器、延迟为零，同一份文件还能被 Python、C++、手机端复用。坏处有两件：.onnx 跟着页面发给每一个访问者，谁都能存下来，它从商业秘密变成公开资产；而且导出那一刻形状被钉死了——三百八十列、输入叫 float_input、五个类别。此后这些数字由页面负责对齐，模型不提醒你，它只算出一个错的答案。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif"><rect width="640" height="300" fill="#fbfbfd"/><defs><marker id="a13" markerWidth="10" markerHeight="10" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#6b6b7b"/></marker></defs><g fill="#ffffff" stroke="#2471a3" stroke-width="1.8"><rect x="12" y="26" width="132" height="52" rx="9"/><rect x="176" y="26" width="140" height="52" rx="9"/><rect x="348" y="26" width="120" height="52" rx="9"/></g><rect x="500" y="26" width="128" height="52" rx="9" fill="#ffffff" stroke="#c0392b" stroke-width="1.8"/><g font-size="14" fill="#222" text-anchor="middle"><text x="78" y="48">notebook</text><text x="78" y="68" font-size="14" fill="#666">SVC 训好</text><text x="246" y="48">convert_sklearn</text><text x="246" y="68" font-size="14" fill="#666">None × 380</text><text x="408" y="48">model.onnx</text><text x="408" y="68" font-size="14" fill="#666">Netron 看一眼</text><text x="564" y="48">浏览器 ort</text><text x="564" y="68" font-size="14" fill="#666">无后端、可离线</text></g><g stroke="#6b6b7b" stroke-width="2" fill="none"><line x1="144" y1="52" x2="174" y2="52" marker-end="url(#a13)"/><line x1="316" y1="52" x2="346" y2="52" marker-end="url(#a13)"/><line x1="468" y1="52" x2="498" y2="52" marker-end="url(#a13)"/></g><text x="12" y="112" font-size="14" fill="#666">训练时的列序（380 个开关，apple 是第 4 列）</text><g stroke="#c9c9d6" stroke-width="1.4" fill="#ffffff"><rect x="12" y="120" width="40" height="26"/><rect x="52" y="120" width="40" height="26"/><rect x="92" y="120" width="40" height="26"/><rect x="132" y="120" width="40" height="26"/><rect x="172" y="120" width="40" height="26" stroke="#c0392b" stroke-width="2.4"/><rect x="212" y="120" width="40" height="26"/><rect x="252" y="120" width="40" height="26"/></g><text x="192" y="138" font-size="14" fill="#c0392b" text-anchor="middle">apple</text><text x="12" y="176" font-size="14" fill="#666">页面里的数组 ingredients（勾一个就置 1）</text><g stroke="#c9c9d6" stroke-width="1.4" fill="#ffffff"><rect x="12" y="184" width="40" height="26"/><rect x="52" y="184" width="40" height="26"/><rect x="92" y="184" width="40" height="26"/><rect x="132" y="184" width="40" height="26" fill="#f2d7b7" stroke="#c0392b" stroke-width="2.4"/><rect x="172" y="184" width="40" height="26" fill="#cfe3f2" stroke="#2471a3" stroke-width="2.4"/><rect x="212" y="184" width="40" height="26"/><rect x="252" y="184" width="40" height="26"/></g><text x="192" y="202" font-size="14" fill="#2471a3" text-anchor="middle">1</text><text x="152" y="202" font-size="14" fill="#c0392b" text-anchor="middle">错一格</text><g stroke="#6b6b7b" stroke-width="1.5" stroke-dasharray="4 4" fill="none"><line x1="192" y1="146" x2="192" y2="182"/></g><g font-size="14" fill="#666"><text x="312" y="138">value 写对：apple 落回它那列</text><text x="312" y="202" fill="#c0392b">value 差一位：这格的钱给了别人</text></g><text x="320" y="240" font-size="14" fill="#333" text-anchor="middle">导出那一刻，380、float_input、五个类就被钉死了，此后由页面负责对齐</text><text x="320" y="266" font-size="14" fill="#666" text-anchor="middle">nocl 与 zipmap 换小体积：编号翻成菜名的责任挪到了 JS 侧</text><text x="320" y="290" font-size="14" fill="#c0392b" text-anchor="middle">第 9 课模型留在服务器，这一课模型发给每一个访问者</text></svg>`, caption: `一条导出链，和那排必须一一对齐的开关格子` },
  { t: `p`, text: `所以导出之后先别写页面。拿 Netron（一个免费的模型图浏览器）打开 model.onnx，抄三样东西：输入名、形状、最后一层交出什么。sklearn 对象在编辑器里看不出名堂，这三样正是页面要照着填的接口——第 9 课那张编码表的坑，在这换了个形式重演。` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `把「冰箱里有什么、今天能做哪国菜」做成一个纯静态页面`,
    `断网、课堂、弱网环境里照样推断，不必求人连你的服务器`,
    `一次导出多端用：同一份文件浏览器、手机端、C++ 服务都能加载`,
    `推荐系统的入门形态：类别就是推荐结果，往后加排名、加理由都在这条链上`
  ] },
  { t: `h2`, text: `演示 1 · 训练，然后导成 ONNX` },
  { t: `code`, lang: `python`, code: `!pip install skl2onnx\nfrom skl2onnx import convert_sklearn\nfrom skl2onnx.common.data_types import FloatTensorType\n\nmodel = SVC(kernel="linear", C=10, probability=True, random_state=0)\nmodel.fit(X_train, y_train.values.ravel())        # accuracy 0.79\n\ninitial_type = [("float_input", FloatTensorType([None, 380]))]\noptions = {id(model): {"nocl": True, "zipmap": False}}\nonx = convert_sklearn(model, initial_types=initial_type, options=options)\nwith open("./model.onnx", "wb") as f:\n    f.write(onx.SerializeToString())` },
  { t: `p`, text: `X 是去掉行号列和菜名列之后的三百多列开关，y 留着菜名。那个 380 不是随手写的：前面筛掉 rice、garlic、ginger 之后特征正好剩 380 列，它必须和 X 的真实列数对上；没删过那三列的人，就得按自己 print 出的数改。转换或推理会当场报形状错，这反而是好消息：它至少开口说话。两个选项都在削体积：zipmap 关掉后不再交出「名字到概率」的字典，nocl 走掉类别信息，模型小一圈。` },
  { t: `h2`, text: `演示 2 · 页面侧攒那个数组` },
  { t: `code`, lang: `javascript`, code: `const ingredients = Array(380).fill(0);\nconst checks = [...document.querySelectorAll(".checkbox")];\n\nchecks.forEach(check => {\n    check.addEventListener("change", function () {\n        ingredients[check.value] = check.checked ? 1 : 0;\n    });\n});\n\nfunction testCheckboxes() {\n    return checks.some(check => check.checked);\n}` },
  { t: `p`, text: `每个复选框的 value 是这味配料在数据里的列号：apple 按字母序排第五列，所以写 4，因为从 0 数起。对照表去 ingredient_indexes.csv 查，别按页面显示顺序自己数——顺序一改整条链就错位，而且不报错。勾选只改数组、不做计算：收集特征和调用模型分在两处，是这个页面最值得学的结构。` },
  { t: `h2`, text: `演示 3 · 一次推断` },
  { t: `code`, lang: `javascript`, code: `async function startInference() {\n    if (!testCheckboxes()) { alert("Please select at least one ingredient."); return; }\n    const session = await ort.InferenceSession.create("./model.onnx");\n    const input = new ort.Tensor(new Float32Array(ingredients), [1, 380]);\n    const results = await session.run({ float_input: input });\n    console.log("You can enjoy " + results.label.data[0] + " cuisine today!");\n}` },
  { t: `p`, text: `三样要对齐：Tensor 的形状 [1, 380]、feeds 的键名 float_input、导出时写的 initial_type，一字不差。用 file:// 双击打开页面加载不到 model.onnx，得在目录里起个 http-server。最后那句打印要留神：nocl 关掉类别信息之后，label 交回的是编号还是名字得自己验一遍，别照抄示例就以为它拼得出 korean。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `列数与 FloatTensorType 里写的对不上：转换或推理当场报错，改对才走得下去`,
    `复选框 value 与训练列序错位：不报错、不警告，只把答案指到别的列`,
    `feeds 的键名跟模型输入名不一致，或者形状少写了那一维 batch`,
    `拿 file:// 打开页面，模型加载失败只在控制台里叫了一声`,
    `以为 nocl=True 之后结果自带菜名：那张编号到名字的表现在归页面维护`,
    `把 .onnx 当受保护的东西：它已经发给每一个访问者了`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `用 Netron 打开 model.onnx，抄下输入名、形状与最后一层，指出它们分别来自演示 1 的哪一行`,
    `给页面再加三味配料，从 ingredient_indexes.csv 查列号填 value，说明为什么不能按页面显示顺序自己数`,
    `把 zipmap 改回 True 重导一次，比较文件大小与 results 的结构，说出演示 3 要跟着改哪一处`,
    `做一版「模型留在服务器」的方案（第 9 课那条路），列出三件它比纯前端强的地方、两件不如的地方`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：导成 ONNX 就是把模型从一门语言里拔出来——换来零后端和离线，代价是形状被钉死、模型公开，对齐这份责任整个压到了页面上。` }
];
