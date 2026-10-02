/* 喵站 分类体系 + 硬编码教程种子
   分类：categories 为「大类名 → 小类数组」映射
   教程：tutorials 数组，每门教程的 author 决定归属哪个账号
         —— 写 "喵站官方" 就归官方账号；写别的名字会自动创建同名老师账号。 */
window.MIAO_DATA = {
  categories: {
    "编程语言": ["ts" , "python" , "c" , "c++" , "java" , "go" , "c#" , "汇编"],
    "开发工具": ["git" , "github" , "liunx" , "vs code" , "trae"],
    "其他":["计算机基础" , "高等数学" , "嵌入式" , "算法" , "Agent" , "大模型" , "英语"],
  },
  tutorials: [
  /* Python 入门 · 46 章 · 来源：学习资料/python入门 1-45 课 */
  {
 "id": "python",
 "title": "Python 入门",
 "intro": "从 Python 的历史讲起，跟着安装解释器和编辑器，一路学会变量、判断、循环、函数、类、文件操作，每句话都有喵～",
 "cat": "python",
 "diff": "入门",
 "tags": [
  "python",
  "零基础",
  "入门"
 ],
 "author": "喵站官方",
 "chapters": [
  {
   "id": "c01",
   "title": "第一课 · Python 的历史",
   "blocks": [
    {
     "t": "p",
     "text": "在学写代码之前，先认识一下你要交朋友这门语言喵～"
    },
    {
     "t": "h2",
     "text": "一只蛇的诞生"
    },
    {
     "t": "p",
     "text": "1989 年的圣诞节，荷兰程序员吉多·范罗苏姆（Guido van Rossum）觉得无聊，决定写一门给人类看的编程语言喵～"
    },
    {
     "t": "p",
     "text": "他很喜欢一个喜剧团体「蒙提·派森（Monty Python）」，于是给这门语言起名 Python，和蟒蛇没关系喵～"
    },
    {
     "t": "img",
     "src": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20464%22%3E%3Crect%20width%3D%22640%22%20height%3D%22464%22%20fill%3D%22%23fffaf3%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%2234%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23e8833a%22%3EPython%20%E5%A4%A7%E4%BA%8B%E8%AE%B0%3C%2Ftext%3E%3Cline%20x1%3D%2270%22%20y1%3D%2260%22%20x2%3D%2270%22%20y2%3D%22434%22%20stroke%3D%22%23e8833a%22%20stroke-width%3D%223%22%2F%3E%3Ccircle%20cx%3D%2270%22%20cy%3D%2260%22%20r%3D%228%22%20fill%3D%22%23e8833a%22%2F%3E%3Ctext%20x%3D%2295%22%20y%3D%2258%22%20font-size%3D%2216%22%20font-weight%3D%22700%22%20fill%3D%22%235b4636%22%3E1989%3C%2Ftext%3E%3Ctext%20x%3D%2295%22%20y%3D%2278%22%20font-size%3D%2214%22%20fill%3D%22%237a6a58%22%3E%E5%90%89%E5%A4%9A%E5%9C%A8%E5%9C%A3%E8%AF%9E%E5%81%87%E6%9C%9F%E5%BC%80%E5%A7%8B%E5%86%99%20Python%20%E7%9A%84%E7%AC%AC%E4%B8%80%E4%B8%AA%E7%89%88%E6%9C%AC%3C%2Ftext%3E%3Ccircle%20cx%3D%2270%22%20cy%3D%22124%22%20r%3D%228%22%20fill%3D%22%23e8833a%22%2F%3E%3Ctext%20x%3D%2295%22%20y%3D%22122%22%20font-size%3D%2216%22%20font-weight%3D%22700%22%20fill%3D%22%235b4636%22%3E1991%3C%2Ftext%3E%3Ctext%20x%3D%2295%22%20y%3D%22142%22%20font-size%3D%2214%22%20fill%3D%22%237a6a58%22%3EPython%200.9.0%20%E5%AF%B9%E5%A4%96%E5%8F%91%E5%B8%83%EF%BC%8C%E5%B7%B2%E7%BB%8F%E6%9C%89%E5%87%BD%E6%95%B0%E3%80%81%E5%BC%82%E5%B8%B8%E7%AD%89%E7%89%B9%E6%80%A7%3C%2Ftext%3E%3Ccircle%20cx%3D%2270%22%20cy%3D%22188%22%20r%3D%228%22%20fill%3D%22%23e8833a%22%2F%3E%3Ctext%20x%3D%2295%22%20y%3D%22186%22%20font-size%3D%2216%22%20font-weight%3D%22700%22%20fill%3D%22%235b4636%22%3E2000%3C%2Ftext%3E%3Ctext%20x%3D%2295%22%20y%3D%22206%22%20font-size%3D%2214%22%20fill%3D%22%237a6a58%22%3EPython%202.0%20%E5%8F%91%E5%B8%83%EF%BC%8C%E5%8A%A0%E5%85%A5%E5%88%97%E8%A1%A8%E6%8E%A8%E5%AF%BC%E5%BC%8F%E5%92%8C%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B6%3C%2Ftext%3E%3Ccircle%20cx%3D%2270%22%20cy%3D%22252%22%20r%3D%228%22%20fill%3D%22%23e8833a%22%2F%3E%3Ctext%20x%3D%2295%22%20y%3D%22250%22%20font-size%3D%2216%22%20font-weight%3D%22700%22%20fill%3D%22%235b4636%22%3E2008%3C%2Ftext%3E%3Ctext%20x%3D%2295%22%20y%3D%22270%22%20font-size%3D%2214%22%20fill%3D%22%237a6a58%22%3EPython%203.0%20%E5%8F%91%E5%B8%83%EF%BC%8C%E4%B8%8D%E5%85%BC%E5%AE%B9%E6%97%A7%E7%89%88%EF%BC%8C%E5%85%A8%E9%9D%A2%E8%B5%B0%E5%90%91%E7%8E%B0%E4%BB%A3%3C%2Ftext%3E%3Ccircle%20cx%3D%2270%22%20cy%3D%22316%22%20r%3D%228%22%20fill%3D%22%23e8833a%22%2F%3E%3Ctext%20x%3D%2295%22%20y%3D%22314%22%20font-size%3D%2216%22%20font-weight%3D%22700%22%20fill%3D%22%235b4636%22%3E2020%3C%2Ftext%3E%3Ctext%20x%3D%2295%22%20y%3D%22334%22%20font-size%3D%2214%22%20fill%3D%22%237a6a58%22%3EPython%202%20%E6%AD%A3%E5%BC%8F%E9%80%80%E4%BC%91%EF%BC%8C%E5%85%A8%E4%B8%96%E7%95%8C%E5%8F%AA%E7%94%A8%20Python%203%3C%2Ftext%3E%3Ccircle%20cx%3D%2270%22%20cy%3D%22380%22%20r%3D%228%22%20fill%3D%22%23e8833a%22%2F%3E%3Ctext%20x%3D%2295%22%20y%3D%22378%22%20font-size%3D%2216%22%20font-weight%3D%22700%22%20fill%3D%22%235b4636%22%3E2024%3C%2Ftext%3E%3Ctext%20x%3D%2295%22%20y%3D%22398%22%20font-size%3D%2214%22%20fill%3D%22%237a6a58%22%3EPython%20%E7%99%BB%E9%A1%B6%20TIOBE%20%E6%A6%9C%E9%A6%96%EF%BC%8CAI%20%E6%97%B6%E4%BB%A3%E7%9A%84%E7%AC%AC%E4%B8%80%E8%AF%AD%E8%A8%80%3C%2Ftext%3E%3C%2Fsvg%3E",
     "alt": "示意图"
    },
    {
     "t": "h2",
     "text": "为什么选 Python 入门"
    },
    {
     "t": "ul",
     "items": [
      "语法像英语句子，读代码像读文章喵～",
      "不用内存不用分号不用大括号，写起来轻松喵～",
      "人工智能数据分析自动化办公、网站后端全都用它喵～",
      "全国最热门的编程语言，遇到问题一搜就有答案喵～"
     ]
    },
    {
     "t": "img",
     "src": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20254%22%3E%3Crect%20width%3D%22640%22%20height%3D%22254%22%20fill%3D%22%23fffaf3%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%2234%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23e8833a%22%3EPython%20%E8%83%BD%E5%B9%B2%E4%BB%80%E4%B9%88%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%2260%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%2282%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%2282%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3EChatGPT%20%E8%83%8C%E5%90%8E%E7%9A%84%E8%AE%AD%E7%BB%83%E4%BB%A3%E7%A0%81%E5%A4%A7%E5%A4%9A%E6%98%AF%20Python%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22106%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22128%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22128%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E4%B8%80%E5%8F%A5%E8%AF%9D%E7%BB%9F%E8%AE%A1%E4%B8%80%E7%99%BE%E4%B8%87%E8%A1%8C%E8%A1%A8%E6%A0%BC%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22152%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22174%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E8%87%AA%E5%8A%A8%E5%8C%96%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22174%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E6%89%B9%E9%87%8F%E6%94%B9%E5%90%8D%E3%80%81%E6%89%B9%E9%87%8F%E5%8F%91%E9%82%AE%E4%BB%B6%E3%80%81%E7%88%AC%E6%95%B0%E6%8D%AE%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22198%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22220%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E7%BD%91%E7%AB%99%E5%90%8E%E7%AB%AF%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22220%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E7%9F%A5%E4%B9%8E%E3%80%81Instagram%20%E7%9A%84%E6%9C%8D%E5%8A%A1%E5%99%A8%E8%AF%AD%E8%A8%80%3C%2Ftext%3E%3C%2Fsvg%3E",
     "alt": "示意图"
    },
    {
     "t": "tip",
     "text": "本教程基于 Python 3 讲解，所有例子都在 Python 3.8 以上版本可以运行喵～"
    },
   ]
  },
  {
   "id": "c02",
   "title": "第二课 · 安装 Python 解释器",
   "blocks": [
    {
     "t": "p",
     "text": "电脑本身听不懂 Python(它只能读取0和1)，需要一个翻译把代码翻译成机器语言(0和1)，它就是解释器喵～"
    },
    {
     "t": "img",
     "src": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20208%22%3E%3Crect%20width%3D%22640%22%20height%3D%22208%22%20fill%3D%22%23fffaf3%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%2234%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23e8833a%22%3E%E4%BB%A3%E7%A0%81%E6%98%AF%E6%80%8E%E4%B9%88%E8%B7%91%E8%B5%B7%E6%9D%A5%E7%9A%84%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%2260%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%2282%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E4%BD%A0%E5%86%99%E7%9A%84%20.py%20%E6%96%87%E4%BB%B6%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%2282%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3Eprint('hello')%20%E4%BA%BA%E7%B1%BB%E8%83%BD%E7%9C%8B%E6%87%82%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22106%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22128%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E8%A7%A3%E9%87%8A%E5%99%A8%20Python%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22128%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E9%80%90%E8%A1%8C%E7%BF%BB%E8%AF%91%20%2B%20%E7%AB%8B%E5%8D%B3%E6%89%A7%E8%A1%8C%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22152%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22174%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E7%94%B5%E8%84%91%20CPU%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22174%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E0101%E2%80%A6%20%E7%9C%9F%E6%AD%A3%E5%B9%B2%E6%B4%BB%E7%9A%84%E5%AE%B6%E4%BC%99%3C%2Ftext%3E%3C%2Fsvg%3E",
     "alt": "示意图"
    },
    {
     "t": "h2",
     "text": "下载官网()"
    },
    {
     "t": "p",
     "text": "官方下载地址：https://www.python.org/downloads/ 喵～"
    },
    {
     "t": "p",
     "text": "打开后点黄色的「Download Python 3.x.x它会自动识别你的系统喵～"
    },
    {
     "t": "ul",
     "items": [
      "Windows 用户直接下 Windows installer（64-bit）喵～",
      "macOS 用户下 macOS 64-bit universal installer 喵～",
      " Linux 用户一般系统自带，或用包管理器装 python3 喵～"
     ]
    },
    {
     "t": "p",
     "text": "双击安装包后，在第一个界面**务必勾选底部的「Add python.exe to PATH」**，再点 Install Now 喵～"
    },
    {
     "t": "img",
     "src": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20162%22%3E%3Crect%20width%3D%22640%22%20height%3D%22162%22%20fill%3D%22%23fffaf3%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%2234%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23e8833a%22%3E%E5%AE%89%E8%A3%85%E7%95%8C%E9%9D%A2%E4%B8%A4%E4%B8%AA%E9%80%89%E9%A1%B9%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%2260%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%2282%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E2%9C%85%20Add%20to%20PATH%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%2282%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E5%8B%BE%E4%B8%8A%EF%BC%9A%E4%BB%BB%E4%BD%95%E7%AA%97%E5%8F%A3%E9%83%BD%E8%83%BD%E7%9B%B4%E6%8E%A5%E6%95%B2%20python%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22106%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22128%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3EInstall%20Now%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22128%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E9%BB%98%E8%AE%A4%E8%B7%AF%E5%BE%84%E5%AE%89%E8%A3%85%EF%BC%8C%E6%96%B0%E6%89%8B%E5%B0%B1%E9%80%89%E5%AE%83%3C%2Ftext%3E%3C%2Fsvg%3E",
     "alt": "示意图"
    },
    {
     "t": "tip",
     "text": "忘了勾 PATH 也别慌：重新运行安装包，选 Modify → 勾上 Add to PATH 修一遍就行喵～"
    },
    {
     "t": "h2",
     "text": "验证装好了没"
    },
    {
     "t": "p",
     "text": "按 Win+R 输入 cmd 回车（macOS 打开「终端」），输入下面的命令喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "python --version\n# 或者（Mac/Linux 用这个）\npython3 --version"
    },
    {
     "t": "tip",
     "text": "运行结果：Python 3.12.4（版本号是你的为准）"
    },
    {
     "t": "p",
     "text": "能看到 Python 3 开头的版本号，翻译官就请进家门了喵～"
    },
    {
     "t": "h2",
     "text": "顺带认识交互式环境"
    },
    {
     "t": "p",
     "text": "在命令行直接敲 python 回车，会进入「>>>」开头的对话模式，输入一行立刻执行一行喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": ">>> 1 + 1"
    },
    {
     "t": "tip",
     "text": "运行结果：2"
    },
    {
     "t": "p",
     "text": "输入 exit() 或者按 Ctrl+Z 回车可以退出对话模式，我们后面主要写 .py 文件，这里混个脸熟就行喵～"
    }
   ]
  },
  {
   "id": "c03",
   "title": "第三课 · 安装代码编辑器",
   "blocks": [
    {
     "t": "p",
     "text": "记事本也能写 Python，但会累死——好的编辑器会帮你变色、补全、找错，像开了辅助瞄喵～"
    },
    {
     "t": "img",
     "src": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20162%22%3E%3Crect%20width%3D%22640%22%20height%3D%22162%22%20fill%3D%22%23fffaf3%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%2234%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23e8833a%22%3E%E7%BC%96%E8%BE%91%E5%99%A8%20vs%20%E8%AE%B0%E4%BA%8B%E6%9C%AC%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%2260%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%2282%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E8%AE%B0%E4%BA%8B%E6%9C%AC%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%2282%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E7%99%BD%E7%BA%B8%E9%BB%91%E5%AD%97%EF%BC%8C%E5%86%99%E9%94%99%E6%B2%A1%E4%BA%BA%E6%8F%90%E9%86%92%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22106%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22128%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E4%BB%A3%E7%A0%81%E7%BC%96%E8%BE%91%E5%99%A8%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22128%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E5%85%B3%E9%94%AE%E5%AD%97%E5%8F%98%E8%89%B2%20%2B%20%E8%87%AA%E5%8A%A8%E8%A1%A5%E5%85%A8%20%2B%20%E4%B8%80%E9%94%AE%E8%BF%90%E8%A1%8C%3C%2Ftext%3E%3C%2Fsvg%3E",
     "alt": "示意图"
    },
    {
     "t": "h2",
     "text": "方案 A：VS Code（老牌万能）"
    },
    {
     "t": "p",
     "text": "官方下载地址：https://code.visualstudio.com/ 喵～"
    },
    {
     "t": "ul",
     "items": [
      "下载后一路下一步安装，第一次打开是英文没关系喵～",
      "点左侧积木图标（扩展），搜索 Chinese 装中文语言包喵～",
      "再搜 Python，装微软官方的 Python 扩展（蓝色双蛇图标，下载量最高的那个）喵～",
      "装完重启编辑器，打开任意 .py 文件右下角选解释器，选你第二课装的那个版本喵～"
     ]
    },
    {
     "t": "h2",
     "text": "方案 B：Trae（国产新秀，内置 AI）"
    },
    {
     "t": "p",
     "text": "官方下载地址：https://www.trae.ai/ 或 https://www.trae.com.cn/ 喵～"
    },
    {
     "t": "ul",
     "items": [
      "Trae 是字节跳动出的 AI 编辑器，界面和 VS Code 几乎一样喵～",
      "最大亮点：内置 AI 助手，代码看不懂可以直接问它喵～",
      "安装同样一路下一步，打开后装 Python 扩展即可，操作和 VS Code 完全一致喵～"
     ]
    },
    {
     "t": "tip",
     "text": "两个装一个就够啦，纠结的话：想要生态最全选 VS Code，想要 AI 帮忙选 Trae，反正以后随时能换喵～"
    },
    {
     "t": "h2",
     "text": "跑第一个文件"
    },
    {
     "t": "p",
     "text": "新建一个文件夹叫 python_learn，用编辑器打开它，新建文件 hello.py，输入一行喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "print(\"hello world\")"
    },
    {
     "t": "tip",
     "text": "运行结果：hello world"
    },
    {
     "t": "p",
     "text": "点右上角的运行按钮（小三角），下方终端吐出 hello world，恭喜正式上路喵～"
    },
    {
     "t": "p",
     "text": "工具齐了，下一课开始正式学语法，先从最常用的 print 讲起喵～"
    }
   ]
  },
  {
   "id": "c04",
   "title": "第四课 · 打印：print 函数",
   "blocks": [
    {
     "t": "p",
     "text": "编程第一课永远是打印，因为亲眼看到电脑听你的话，才有继续学下去的动力喵～"
    },
    {
     "t": "p",
     "text": "print 是 Python 里最常用的函数，作用是把括号里的内容显示到屏幕上喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "print(\"hello world\")\nprint('123456')"
    },
    {
     "t": "tip",
     "text": "运行结果：hello world\n123456"
    },
    {
     "t": "h2",
     "text": "括号里是什么"
    },
    {
     "t": "p",
     "text": "带引号的内容叫字符串，你可以把它想象成一串「字」，电脑会原样显示喵～"
    },
    {
     "t": "p",
     "text": "单引号和双引号在 Python 里是双胞胎，print(\"你好\") 和 print('你好') 效果完全一样喵～"
    },
    {
     "t": "tip",
     "text": "引号必须成对出现，而且要用英文输入法的引号，中文引号会直接报错喵～"
    },
    {
     "t": "p",
     "text": "试着改改括号里的内容，让它打印你的名字，这就是你和电脑的第一次对话喵～"
    }
   ]
  },
  {
   "id": "c05",
   "title": "第五课 · 引号嵌套： quoting 引用",
   "blocks": [
    {
     "t": "p",
     "text": "想打印一句话：莎士比亚说:\"你好\"，问题来了——内容里本身就有引号怎么办喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "print('莎士比亚说:\"你好\"')"
    },
    {
     "t": "tip",
     "text": "运行结果：莎士比亚说:\"你好\""
    },
    {
     "t": "h2",
     "text": "规则就一条"
    },
    {
     "t": "p",
     "text": "外层用单引号，内层就能随便用双引号；反过来外层双引号，内层就能用单引号喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "print(\"猫说:'喵～'\")"
    },
    {
     "t": "tip",
     "text": "运行结果：猫说:'喵～'"
    },
    {
     "t": "img",
     "src": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20208%22%3E%3Crect%20width%3D%22640%22%20height%3D%22208%22%20fill%3D%22%23fffaf3%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%2234%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23e8833a%22%3E%E5%BC%95%E5%8F%B7%E5%B5%8C%E5%A5%97%E5%8F%A3%E8%AF%80%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%2260%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%2282%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E5%A4%96%E5%8D%95%E5%86%85%E5%8F%8C%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%2282%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3Eprint('%E4%BB%96%E8%AF%B4%3A%22%E5%A5%BD%22')%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22106%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22128%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E5%A4%96%E5%8F%8C%E5%86%85%E5%8D%95%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22128%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3Eprint(%22%E4%BB%96%E8%AF%B4%3A'%E5%A5%BD'%22)%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22152%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22174%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E5%86%85%E5%A4%96%E5%90%8C%E7%A7%8D%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22174%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E2%9D%8C%20%E4%BC%9A%E6%8A%A5%E9%94%99%EF%BC%8C%E7%94%B5%E8%84%91%E5%88%86%E4%B8%8D%E6%B8%85%E8%BE%B9%E7%95%8C%3C%2Ftext%3E%3C%2Fsvg%3E",
     "alt": "示意图"
    },
    {
     "t": "tip",
     "text": "外层和内层用同一种引号会撞车报 SyntaxError，错开使用就永远安全喵～"
    }
   ]
  },
  {
   "id": "c06",
   "title": "第六课 · 用 + 把内容拼起来",
   "blocks": [
    {
     "t": "p",
     "text": "print 一次可以打印好几段内容，用加号把它们粘在一起喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "print('Hello'+'world')"
    },
    {
     "t": "tip",
     "text": "运行结果：Helloworld"
    },
    {
     "t": "p",
     "text": "注意看结果：Hello 和 world 紧紧贴在一起，中间一点缝隙都没有喵～"
    },
    {
     "t": "p",
     "text": "因为 + 是直接拼接，你写什么它连什么，不会自作聪明帮你加空格喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "print('Hello'+' '+'world')"
    },
    {
     "t": "tip",
     "text": "运行结果：Hello world"
    },
    {
     "t": "tip",
     "text": "想要空格就自己手动加一个 ' '（一对引号中间敲个空格）当作第三段内容喵～"
    }
   ]
  },
  {
   "id": "c07",
   "title": "第七课 · 逗号：自带空格的连接",
   "blocks": [
    {
     "t": "p",
     "text": "上一课空格要手动加，好麻烦——用逗号代替加号，print 会自动帮你补空格喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "print(\"Hello\",\"world\")"
    },
    {
     "t": "tip",
     "text": "运行结果：Hello world"
    },
    {
     "t": "h2",
     "text": "加号与逗号的区别"
    },
    {
     "t": "img",
     "src": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20208%22%3E%3Crect%20width%3D%22640%22%20height%3D%22208%22%20fill%3D%22%23fffaf3%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%2234%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23e8833a%22%3E%2B%20%E5%92%8C%20%2C%20%E7%9A%84%E5%AF%B9%E5%86%B3%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%2260%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%2282%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%2B%20%E5%8A%A0%E5%8F%B7%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%2282%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E4%B8%A5%E4%B8%9D%E5%90%88%E7%BC%9D%E6%8B%BC%E6%8E%A5%EF%BC%8C%E7%A9%BA%E6%A0%BC%E8%87%AA%E5%B7%B1%E5%8A%A0%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22106%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22128%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%2C%20%E9%80%97%E5%8F%B7%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22128%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E8%87%AA%E5%8A%A8%E8%A1%A5%E4%B8%80%E4%B8%AA%E7%A9%BA%E6%A0%BC%EF%BC%8C%E8%BF%98%E8%83%BD%E6%B7%B7%E6%90%AD%E4%B8%8D%E5%90%8C%E7%B1%BB%E5%9E%8B%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22152%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22174%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22174%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E6%8B%BC%E6%8E%A5%E6%97%A0%E7%A9%BA%E6%A0%BC%E7%94%A8%20%2B%EF%BC%8C%E5%88%86%E9%9A%94%E5%B1%95%E7%A4%BA%E7%94%A8%20%2C%3C%2Ftext%3E%3C%2Fsvg%3E",
     "alt": "示意图"
    },
    {
     "t": "p",
     "text": "逗号还有个隐藏福利：它不要求两边都是字符串，数字也能直接放喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "print(\"我今年\", 18, \"岁\")"
    },
    {
     "t": "tip",
     "text": "运行结果：我今年 18 岁"
    },
    {
     "t": "tip",
     "text": "加号连数字和字符串会报错（第八章会讲怎么转换），逗号永远不挑食喵～"
    }
   ]
  },
  {
   "id": "c08",
   "title": "第八课 · sep：自定义分隔符",
   "blocks": [
    {
     "t": "p",
     "text": "逗号默认补空格，但如果你想要别的分隔符呢喵～sep 参数登场喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "print('管理','椰子蛋',sep='和')"
    },
    {
     "t": "tip",
     "text": "运行结果：管理和椰子蛋"
    },
    {
     "t": "p",
     "text": "sep 是 separator（分隔符）的缩写，逗号隔开的内容中间会被替换成你写的字符喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "print(\"2026\",\"10\",\"01\",sep=\"-\")\nprint(\"10\",\"30\",\"45\",sep=\":\")"
    },
    {
     "t": "tip",
     "text": "运行结果：2026-10-01\n10:30:45"
    },
    {
     "t": "img",
     "src": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20208%22%3E%3Crect%20width%3D%22640%22%20height%3D%22208%22%20fill%3D%22%23fffaf3%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%2234%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23e8833a%22%3Esep%20%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%2260%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%2282%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E5%86%85%E5%AE%B91%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%2282%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E5%86%85%E5%AE%B92%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22106%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22128%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%20%20%20%E2%86%93%20sep%3D'-'%20%E2%86%93%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22128%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E5%8F%98%E6%88%90%20%E5%86%85%E5%AE%B91-%E5%86%85%E5%AE%B92%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22152%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22174%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E4%B8%8D%E5%86%99%20sep%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22174%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E9%BB%98%E8%AE%A4%E6%98%AF%E4%B8%80%E4%B8%AA%E7%A9%BA%E6%A0%BC%3C%2Ftext%3E%3C%2Fsvg%3E",
     "alt": "示意图"
    },
    {
     "t": "tip",
     "text": "sep 只对「逗号隔开的多个内容」生效，对 + 拼接的内容无效喵～"
    }
   ]
  },
  {
   "id": "c09",
   "title": "第九课 · 换行符 \\n",
   "blocks": [
    {
     "t": "p",
     "text": "每个 print 结束后都会自动换一行，其实是因为它背后偷偷加了个换行符喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "print('管理')\nprint('管理')\nprint('管理')"
    },
    {
     "t": "tip",
     "text": "运行结果：管理\n管理\n管理"
    },
    {
     "t": "h2",
     "text": "手动换行：\\n"
    },
    {
     "t": "p",
     "text": "\\n 是「newline」的缩写，写在字符串里就代表「这里换一行」，它一个字符就顶一次回车喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "print('管理\\n椰子蛋')"
    },
    {
     "t": "tip",
     "text": "运行结果：管理\n椰子蛋"
    },
    {
     "t": "p",
     "text": "好处是节省行数：本来要写两个 print，现在一个就够喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "print('第一行\\n第二行\\n第三行')"
    },
    {
     "t": "tip",
     "text": "运行结果：第一行\n第二行\n第三行"
    },
    {
     "t": "tip",
     "text": "\\n 叫转义字符——反斜杠 + 字母组合出「键盘上打不出来」的效果，后面还会遇到 \\t（制表符）喵～"
    }
   ]
  },
  {
   "id": "c10",
   "title": "第十课 · end：禁止自动换行",
   "blocks": [
    {
     "t": "p",
     "text": "print 默认打印完就换行，但有时想让好几个 print 挤在同一行，end 参数来了喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "print('管理',end='a')\nprint('管理',end='a')\nprint('管理',end='a')"
    },
    {
     "t": "tip",
     "text": "运行结果：管理a管理a管理a"
    },
    {
     "t": "p",
     "text": "end 的意思是「打印完以后追加什么」，默认值是 '\\n'（换行），你改成别的它就不换行了喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "print(\"1\",end=\" \")\nprint(\"2\",end=\" \")\nprint(\"3\",end=\" \")"
    },
    {
     "t": "tip",
     "text": "运行结果：1 2 3"
    },
    {
     "t": "img",
     "src": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20208%22%3E%3Crect%20width%3D%22640%22%20height%3D%22208%22%20fill%3D%22%23fffaf3%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%2234%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23e8833a%22%3Eend%20%E4%B8%8E%20%5Cn%20%E7%9A%84%E5%85%B3%E7%B3%BB%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%2260%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%2282%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Eprint(x)%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%2282%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%3D%20print(x%2C%20end%3D'%5Cn')%20%E8%87%AA%E5%8A%A8%E6%8D%A2%E8%A1%8C%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22106%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22128%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Eprint(x%2Cend%3D'')%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22128%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E6%89%93%E5%8D%B0%E5%AE%8C%E4%BB%80%E4%B9%88%E9%83%BD%E4%B8%8D%E5%8A%A0%EF%BC%8C%E8%BF%9E%E7%A9%BA%E6%A0%BC%E9%83%BD%E6%B2%A1%E6%9C%89%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22152%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22174%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Eprint(x%2Cend%3D'%E2%AD%90')%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22174%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E6%89%93%E5%8D%B0%E5%AE%8C%E8%B7%9F%E4%B8%80%E4%B8%AA%E6%98%9F%E6%98%9F%3C%2Ftext%3E%3C%2Fsvg%3E",
     "alt": "示意图"
    },
    {
     "t": "tip",
     "text": "end 和 sep 是一对好搭档：sep 管中间，end 管结尾喵～"
    }
   ]
  },
  {
   "id": "c11",
   "title": "第十一课 · 三引号打印多行文字",
   "blocks": [
    {
     "t": "p",
     "text": "打印一大段诗、一段台词，难道要疯狂敲 \\n 吗喵～三引号了解一下喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "print('''\n        管理\n椰子蛋\n''')"
    },
    {
     "t": "tip",
     "text": "运行结果：（原样输出三行，包括缩进和空行）"
    },
    {
     "t": "h2",
     "text": "三引号是什么"
    },
    {
     "t": "p",
     "text": "三个单引号 ''' 或者三个双引号 \"\"\" 都算三引号，它包裹的字符串可以随便跨行喵～"
    },
    {
     "t": "p",
     "text": "你在三引号里怎么排版，屏幕上就原样输出什么排版，空格空行都保留喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "print(\"\"\"\n床前明月光，\n疑是地上霜。\n\"\"\")"
    },
    {
     "t": "tip",
     "text": "运行结果：床前明月光，\n疑是地上霜。"
    },
    {
     "t": "tip",
     "text": "到这里，print 新手课程就毕业啦喵～你已经能让电脑按你的意思显示任何文字了喵～"
    }
   ]
  },
  {
   "id": "c12",
   "title": "第十二课 · 变量：给值起名字",
   "blocks": [
    {
     "t": "p",
     "text": "print(\"hello world\") 里的内容每次都要重新打，太累了——变量就是解决这个的喵～"
    },
    {
     "t": "img",
     "src": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20162%22%3E%3Crect%20width%3D%22640%22%20height%3D%22162%22%20fill%3D%22%23fffaf3%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%2234%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23e8833a%22%3E%E5%8F%98%E9%87%8F%E5%83%8F%E4%B8%80%E4%B8%AA%E7%9B%92%E5%AD%90%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%2260%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%2282%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Ebox%20%3D%20'%E6%A4%B0%E5%AD%90%E8%9B%8B'%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%2282%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E6%8A%8A%E3%80%8E%E6%A4%B0%E5%AD%90%E8%9B%8B%E3%80%8F%E8%A3%85%E8%BF%9B%E5%8F%AB%20box%20%E7%9A%84%E7%9B%92%E5%AD%90%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22106%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22128%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Eprint(box)%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22128%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E6%89%93%E5%BC%80%E7%9B%92%E5%AD%90%EF%BC%8C%E6%98%BE%E7%A4%BA%E9%87%8C%E9%9D%A2%E7%9A%84%E4%B8%9C%E8%A5%BF%3C%2Ftext%3E%3C%2Fsvg%3E",
     "alt": "示意图"
    },
    {
     "t": "h2",
     "text": "赋值语法"
    },
    {
     "t": "p",
     "text": "变量名 = 值，一个等号就是「把右边的装进左边的」喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "box='椰子蛋'\nprint(box)"
    },
    {
     "t": "tip",
     "text": "运行结果：椰子蛋"
    },
    {
     "t": "h2",
     "text": "什么时候要引号"
    },
    {
     "t": "ul",
     "items": [
      "字符串（文字）要加引号：name = '椰子蛋' 喵～",
      "数字不用引号：age = 666 喵～",
      "print 时用变量不加引号：print(box) 输出内容；print('box') 只会输出 box 这三个字母喵～"
     ]
    },
    {
     "t": "code",
     "lang": "python",
     "code": "box='椰子蛋'\nprint(box)\nprint('box')"
    },
    {
     "t": "tip",
     "text": "运行结果：椰子蛋\nbox"
    },
    {
     "t": "tip",
     "text": "加引号 = 拿字面本身，不加引号 = 拿盒子里装的东西，这个区别贯穿整个编程生涯喵～"
    }
   ]
  },
  {
   "id": "c13",
   "title": "第十三课 · 变量的值可以被替换",
   "blocks": [
    {
     "t": "p",
     "text": "变量变量，顾名思义就是「能变的量」，同一个盒子随时可以换内容喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "a=2\nprint(a)\na=1\nprint(a)"
    },
    {
     "t": "tip",
     "text": "运行结果：2\n1"
    },
    {
     "t": "h2",
     "text": "执行顺序：从上到下"
    },
    {
     "t": "p",
     "text": "Python 是从上往下一行一行执行的，a=2 先执行，a=1 后执行，后面的覆盖前面的喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "x='早上'\nprint(x)\nx='晚上'\nprint(x)\nprint(x)"
    },
    {
     "t": "tip",
     "text": "运行结果：早上\n晚上\n晚上"
    },
    {
     "t": "p",
     "text": "注意最后连打两次 x，都是「晚上」——因为读到那里时盒子里的值早就被换了喵～"
    },
    {
     "t": "tip",
     "text": "调试代码的小技巧：不确定变量此刻是什么值，就插一行 print(变量名) 看看喵～"
    }
   ]
  },
  {
   "id": "c14",
   "title": "第十四课 · 变量命名规范",
   "blocks": [
    {
     "t": "p",
     "text": "变量名不是随便起的，起烂了过两天连自己都看不懂，先学规矩喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "fruits1='椰子蛋'\nmum1='椰子'\njmg3='椰'\nprint(fruits1,mum1,jmg3)"
    },
    {
     "t": "tip",
     "text": "运行结果：椰子蛋 椰子 椰"
    },
    {
     "t": "h2",
     "text": "合法变量名的三条铁律"
    },
    {
     "t": "ul",
     "items": [
      "只能用字母（大小写都行）、下划线 _ 和数字喵～",
      "数字不能开头：a1 合法，1a 报错喵～",
      "不能用 Python 的关键字（比如 print、if 这种系统占用的词）喵～"
     ]
    },
    {
     "t": "code",
     "lang": "python",
     "code": "# 合法\name_1 = 1\n_score = 99\n\n# 非法（取消注释会报错）\n# 1a = 1\n# my-name = 1"
    },
    {
     "t": "tip",
     "text": "运行结果：（无输出，仅演示命名）"
    },
    {
     "t": "h2",
     "text": "编辑器的小彩蛋"
    },
    {
     "t": "p",
     "text": "生效的变量名会显示成黄色，没生效的是灰色——写错名字一眼就能看出来喵～"
    },
    {
     "t": "tip",
     "text": "名字要有代表性：存名字用 name，存年龄用 age；实在不会起，a1 a2 a3 也比 aa bb 强，会拼音的话用拼音最好喵～"
    }
   ]
  },
  {
   "id": "c15",
   "title": "第十五课 · 变量和文字一起打印",
   "blocks": [
    {
     "t": "p",
     "text": "想把变量嵌在一段话中间，有两种流行写法，看你自己喜欢哪种喵～"
    },
    {
     "t": "h2",
     "text": "写法一：+ 拼接"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "rf1='椰子蛋'\nprint('aaa'+rf1)"
    },
    {
     "t": "tip",
     "text": "运行结果：aaa椰子蛋"
    },
    {
     "t": "h2",
     "text": "写法二：f-string（推荐）"
    },
    {
     "t": "p",
     "text": "字符串前面加个 f，再把变量名放进大括号 {}，它会被自动替换成变量的值喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "rf1='椰子蛋'\nprint(f'bbb{rf1}')"
    },
    {
     "t": "tip",
     "text": "运行结果：bbb椰子蛋"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "name='小喵'\nage=3\nprint(f'{name}今年{age}岁')"
    },
    {
     "t": "tip",
     "text": "运行结果：小喵今年3岁"
    },
    {
     "t": "img",
     "src": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20162%22%3E%3Crect%20width%3D%22640%22%20height%3D%22162%22%20fill%3D%22%23fffaf3%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%2234%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23e8833a%22%3E%E4%B8%A4%E7%A7%8D%E5%86%99%E6%B3%95%E5%AF%B9%E6%AF%94%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%2260%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%2282%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%2B%20%E6%8B%BC%E6%8E%A5%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%2282%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E4%B8%80%E6%AE%B5%E4%B8%80%E4%B8%AA%E5%8A%A0%E5%8F%B7%EF%BC%8C%E6%95%B0%E5%AD%97%E8%BF%98%E8%A6%81%E5%85%88%E8%BD%AC%E5%AD%97%E7%AC%A6%E4%B8%B2%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22106%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22128%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Ef-string%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22128%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E4%B8%80%E4%B8%AA%20f%20%E6%90%9E%E5%AE%9A%EF%BC%8C%E5%A4%A7%E6%8B%AC%E5%8F%B7%E9%87%8C%E9%9A%8F%E4%BE%BF%E6%94%BE%E5%8F%98%E9%87%8F%3C%2Ftext%3E%3C%2Fsvg%3E",
     "alt": "示意图"
    },
    {
     "t": "tip",
     "text": "f-string 是现代 Python 最主流的写法，大括号里甚至能写算式：f'{1+1}' 会输出 2 喵～"
    }
   ]
  },
  {
   "id": "c16",
   "title": "第十六课 · 一行给多个变量赋值",
   "blocks": [
    {
     "t": "p",
     "text": "三个变量写三行赋值太占地方，Python 允许一行搞定喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "a1,a2,a3=13456,456,3456\nprint(a1,a2,a3)"
    },
    {
     "t": "tip",
     "text": "运行结果：13456 456 3456"
    },
    {
     "t": "h2",
     "text": "对号入座"
    },
    {
     "t": "p",
     "text": "逗号两边一一对应：a1 拿 13456，a2 拿 456，a3 拿 3456，顺序不会乱喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "x,y = 1,2\nprint(x,y)\n# 一行交换两个变量，Python 名场面\nx,y = y,x\nprint(x,y)"
    },
    {
     "t": "tip",
     "text": "运行结果：1 2\n2 1"
    },
    {
     "t": "tip",
     "text": "x,y = y,x 这种「一行交换」是 Python 的招牌魔术，其他语言要借助第三个变量才能做到喵～"
    },
    {
     "t": "p",
     "text": "恭喜，变量赋值部分到这里全部入门完毕喵～"
    }
   ]
  },
  {
   "id": "c17",
   "title": "第十七课 · 注释：写给人看的备忘录",
   "blocks": [
    {
     "t": "p",
     "text": "代码是写给电脑的，注释是写给人的——电脑看到注释直接跳过喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "# 打印hello world\nprint('hello world')\n#print('hello world')"
    },
    {
     "t": "tip",
     "text": "运行结果：hello world"
    },
    {
     "t": "h2",
     "text": "两个用途"
    },
    {
     "t": "ul",
     "items": [
      "解释代码：在代码上方或行尾加 #，写清楚这行在干嘛喵～",
      "暂时停用：不想删又不执行的代码，前面加 # 注释掉，要用时把 # 删掉就行喵～"
     ]
    },
    {
     "t": "h2",
     "text": "三引号也能当注释"
    },
    {
     "t": "p",
     "text": "一段连续的 ''' ''' 内容如果不赋值给变量，电脑同样跳过它，适合写多行大段说明喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "'''\n这里是多行说明：\n本程序用于演示注释\n'''\nprint('跑起来了')"
    },
    {
     "t": "tip",
     "text": "运行结果：跑起来了"
    },
    {
     "t": "tip",
     "text": "好注释是写给三个月后的自己的，现在的你聪明绝顶，三个月后的你未必喵～"
    }
   ]
  },
  {
   "id": "c18",
   "title": "第十八课 · 数据类型：字符串",
   "blocks": [
    {
     "t": "p",
     "text": "数据分很多种类型，就像快递分大小件，不同类型干不同的事喵～"
    },
    {
     "t": "h2",
     "text": "字符串 str"
    },
    {
     "t": "p",
     "text": "凡是被引号（单引号、双引号、三引号）包起来的都是字符串，可以包含任意字符：空格、换行、标点通通可以喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "a1='''\naaaaa\naaaaa\n'''\nprint(a1)\nprint(len(a1))"
    },
    {
     "t": "tip",
     "text": "运行结果：（输出两行 aaaaa 和一个数字 12，包含换行符的长度）"
    },
    {
     "t": "h2",
     "text": "len() 量长度"
    },
    {
     "t": "p",
     "text": "len() 函数返回字符串的长度（字符个数），换行符也算一个字符喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "print(len('hello'))\nprint(len('你好'))"
    },
    {
     "t": "tip",
     "text": "运行结果：5\n2"
    },
    {
     "t": "tip",
     "text": "中文一个字也算一个长度，'你好' 的长度是 2 不是 4 喵～"
    }
   ]
  },
  {
   "id": "c19",
   "title": "第十九课 · 整数与浮点数",
   "blocks": [
    {
     "t": "p",
     "text": "数字分两种：带小数点的和不带的，类型不一样但都能做算术喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "a1,a2=-10,10.0\nprint(a1)\nprint(a2)"
    },
    {
     "t": "tip",
     "text": "运行结果：-10\n10.0"
    },
    {
     "t": "h2",
     "text": "怎么区分"
    },
    {
     "t": "img",
     "src": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20208%22%3E%3Crect%20width%3D%22640%22%20height%3D%22208%22%20fill%3D%22%23fffaf3%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%2234%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23e8833a%22%3E%E6%95%B0%E5%AD%97%E7%B1%BB%E5%9E%8B%E9%80%9F%E6%9F%A5%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%2260%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%2282%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E6%95%B4%E6%95%B0%20int%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%2282%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E-10%E3%80%810%E3%80%81666%EF%BC%8C%E6%B2%A1%E6%9C%89%E5%B0%8F%E6%95%B0%E7%82%B9%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22106%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22128%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E6%B5%AE%E7%82%B9%E6%95%B0%20float%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22128%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E10.0%E3%80%813.14%E3%80%81-0.5%EF%BC%8C%E6%9C%89%E5%B0%8F%E6%95%B0%E7%82%B9%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22152%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22174%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E5%88%A4%E6%96%AD%E5%8F%A3%E8%AF%80%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22174%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E6%9C%89%E5%B0%8F%E6%95%B0%E7%82%B9%E7%9A%84%E6%98%AF%E6%B5%AE%E7%82%B9%EF%BC%8C%E6%B2%A1%E6%9C%89%E7%9A%84%E6%98%AF%E6%95%B4%E6%95%B0%3C%2Ftext%3E%3C%2Fsvg%3E",
     "alt": "示意图"
    },
    {
     "t": "p",
     "text": "整数和浮点数都能加减乘除，第二十一章会专门讲运算符喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "print(3 + 4)\nprint(3.5 + 1.2)"
    },
    {
     "t": "tip",
     "text": "运行结果：7\n4.7"
    },
    {
     "t": "tip",
     "text": "10 和 10.0 数值一样但类型不同，type() 能看出来，后面教你喵～"
    }
   ]
  },
  {
   "id": "c20",
   "title": "第二十课 · 布尔值：真与假",
   "blocks": [
    {
     "t": "p",
     "text": "布尔值是世界上最简单的类型——只有两个值：True（真）和 False（假）喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "a1=True,a2=False\nprint(a1)\nprint(a2)"
    },
    {
     "t": "tip",
     "text": "运行结果：(True, False)\n(False,)"
    },
    {
     "t": "h2",
     "text": "两个注意点"
    },
    {
     "t": "ul",
     "items": [
      "首字母必须大写：True ✔ / true ❌，写错了直接报错喵～",
      "布尔值可以进行逻辑运算（与、或、非），if 判断全靠它喵～"
     ]
    },
    {
     "t": "code",
     "lang": "python",
     "code": "print(3 > 2)\nprint(3 < 2)"
    },
    {
     "t": "tip",
     "text": "运行结果：True\nFalse"
    },
    {
     "t": "p",
     "text": "比较运算的结果就是布尔值——3 大于 2 是事实，所以输出 True 喵～"
    },
    {
     "t": "tip",
     "text": "布尔值是 if 语句的燃料，第二十七章逻辑运算符会大规模用到它喵～"
    }
   ]
  },
  {
   "id": "c21",
   "title": "第二十一课 · None：空值",
   "blocks": [
    {
     "t": "p",
     "text": "None 表示「这里什么都没有」，是一个占位的空值喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "a1=None\nprint(a1)"
    },
    {
     "t": "tip",
     "text": "运行结果：None"
    },
    {
     "t": "h2",
     "text": "什么时候用 None"
    },
    {
     "t": "ul",
     "items": [
      "变量还没想好赋什么值，先放个 None 占位喵～",
      "表示「空结果」：比如搜索没搜到东西，返回 None 喵～",
      "注意：None 不是 0，也不是空字符串，它就是「不存在值」本身喵～"
     ]
    },
    {
     "t": "code",
     "lang": "python",
     "code": "result = None\nprint(result)\n\nresult = '找到了'\nprint(result)"
    },
    {
     "t": "tip",
     "text": "运行结果：None\n找到了"
    },
    {
     "t": "tip",
     "text": "print 空字符串 '' 什么都不显示，print None 会显示 None 四个字母，两者完全不同喵～"
    }
   ]
  },
  {
   "id": "c22",
   "title": "第二十二课 · 基本运算符",
   "blocks": [
    {
     "t": "p",
     "text": "Python 是最强的计算器，先认识运算符号喵～"
    },
    {
     "t": "img",
     "src": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20300%22%3E%3Crect%20width%3D%22640%22%20height%3D%22300%22%20fill%3D%22%23fffaf3%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%2234%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23e8833a%22%3E%E7%AE%97%E6%9C%AF%E8%BF%90%E7%AE%97%E7%AC%A6%E4%B8%80%E8%A7%88%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%2260%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%2282%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%2B%20%20-%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%2282%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E5%8A%A0%E3%80%81%E5%87%8F%EF%BC%8C%E9%94%AE%E7%9B%98%E7%9B%B4%E6%8E%A5%E6%9C%89%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22106%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22128%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E*%20%20%2F%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22128%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E4%B9%98%E5%8F%B7%E7%94%A8%E6%98%9F%E5%8F%B7%EF%BC%8C%E9%99%A4%E5%8F%B7%E7%94%A8%E6%96%9C%E6%9D%A0%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22152%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22174%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%25%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22174%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E5%8F%96%E4%BD%99%EF%BC%9A%E4%B8%A4%E6%95%B0%E7%9B%B8%E9%99%A4%E7%9A%84%E4%BD%99%E6%95%B0%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22198%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22220%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%2F%2F%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22220%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E6%95%B4%E9%99%A4%EF%BC%9A%E7%9B%B8%E9%99%A4%E7%9A%84%E5%95%86%E5%90%91%E4%B8%8B%E5%8F%96%E6%95%B4%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22244%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22266%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E**%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22266%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E6%8C%87%E6%95%B0%EF%BC%9A2**3%20%E5%B0%B1%E6%98%AF%202%20%E7%9A%84%203%20%E6%AC%A1%E6%96%B9%3C%2Ftext%3E%3C%2Fsvg%3E",
     "alt": "示意图"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "print(7 % 3)\nprint(7 // 3)\nprint(2 ** 3)"
    },
    {
     "t": "tip",
     "text": "运行结果：1\n2\n8"
    },
    {
     "t": "h2",
     "text": "字符串也能做运算"
    },
    {
     "t": "p",
     "text": "加号可以把字符串粘起来，星号可以让字符串重复喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "a1='你好'\na2='世界!'\nprint(a1+a2)\nprint('喵' * 5)"
    },
    {
     "t": "tip",
     "text": "运行结果：你好世界!\n喵喵喵喵喵"
    },
    {
     "t": "tip",
     "text": "'喵' * 5 特别适合做分隔线：print('-' * 30) 喵～"
    }
   ]
  },
  {
   "id": "c23",
   "title": "第二十三课 · type()：查数据类型",
   "blocks": [
    {
     "t": "p",
     "text": "分不清一个数据是什么类型吗喵～type() 一查便知喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "a1=4\nb2='你好，世界!'\nprint(type(a1))\nprint(type(b2))"
    },
    {
     "t": "tip",
     "text": "运行结果：<class 'int'>\n<class 'str'>"
    },
    {
     "t": "img",
     "src": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20254%22%3E%3Crect%20width%3D%22640%22%20height%3D%22254%22%20fill%3D%22%23fffaf3%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%2234%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23e8833a%22%3Etype()%20%E5%B8%B8%E8%A7%81%E8%BE%93%E5%87%BA%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%2260%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%2282%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%3Cclass%20'int'%3E%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%2282%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E6%95%B4%E6%95%B0%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22106%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22128%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%3Cclass%20'float'%3E%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22128%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E6%B5%AE%E7%82%B9%E6%95%B0%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22152%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22174%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%3Cclass%20'str'%3E%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22174%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E5%AD%97%E7%AC%A6%E4%B8%B2%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22198%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22220%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%3Cclass%20'bool'%3E%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22220%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E5%B8%83%E5%B0%94%E5%80%BC%3C%2Ftext%3E%3C%2Fsvg%3E",
     "alt": "示意图"
    },
    {
     "t": "h2",
     "text": "为什么类型重要"
    },
    {
     "t": "p",
     "text": "不同类型的数据不能直接一起运算，整数和字符串相加会直接报错喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "# 下面这行取消注释会报错：\n# print(123+'你好')\nprint('类型不同不能相加，下一课教你转换')"
    },
    {
     "t": "tip",
     "text": "运行结果：类型不同不能相加，下一课教你转换"
    },
    {
     "t": "tip",
     "text": "报错信息 TypeError 就是「类型错误」，看到它先想想是不是类型搞混了喵～"
    }
   ]
  },
  {
   "id": "c24",
   "title": "第二十四课 · 类型转换三大函数",
   "blocks": [
    {
     "t": "p",
     "text": "类型不同不能运算，那就把它们转成同一种类型——三个转换函数出场喵～"
    },
    {
     "t": "h2",
     "text": "str()：万物皆可变字符串"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "print(str(123)+'你好，世界!')"
    },
    {
     "t": "tip",
     "text": "运行结果：123你好，世界!"
    },
    {
     "t": "h2",
     "text": "int()：字符串变整数"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "print(int('1')+int('1'))"
    },
    {
     "t": "tip",
     "text": "运行结果：2"
    },
    {
     "t": "p",
     "text": "int 只能转换「长得像整数的字符串」，'123' 可以，'你好' 不行喵～"
    },
    {
     "t": "h2",
     "text": "float()：变浮点数"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "print(float('1.5')+float('1'))"
    },
    {
     "t": "tip",
     "text": "运行结果：2.5"
    },
    {
     "t": "h2",
     "text": "bool()：真假判定"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "print(bool(''))\nprint(bool(0))\nprint(bool(None))\nprint(bool(1))"
    },
    {
     "t": "tip",
     "text": "运行结果：False\nFalse\nFalse\nTrue"
    },
    {
     "t": "img",
     "src": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20254%22%3E%3Crect%20width%3D%22640%22%20height%3D%22254%22%20fill%3D%22%23fffaf3%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%2234%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23e8833a%22%3Ebool()%20%E5%88%A4%E5%AE%9A%E8%A7%84%E5%88%99%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%2260%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%2282%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E7%A9%BA%E5%AD%97%E7%AC%A6%E4%B8%B2%20''%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%2282%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3EFalse%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22106%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22128%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E6%95%B0%E5%AD%97%200%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22128%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3EFalse%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22152%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22174%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3ENone%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22174%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3EFalse%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22198%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22220%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E5%85%B6%E4%BD%99%E5%87%A0%E4%B9%8E%E9%83%BD%E6%98%AF%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22220%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3ETrue%3C%2Ftext%3E%3C%2Fsvg%3E",
     "alt": "示意图"
    },
    {
     "t": "tip",
     "text": "Python 还会自动转换：整数 + 浮点数自动变浮点，True + 1 等于 2（True 被当 1 用）喵～"
    }
   ]
  },
  {
   "id": "c25",
   "title": "第二十五课 · input：让用户输入",
   "blocks": [
    {
     "t": "p",
     "text": "程序一直自说自话没意思，input() 能暂停程序，等用户敲键盘喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "我是变量1=input('请输入您的姓名：')\n我是变量2=input('请输入您的年龄：')\nprint('您输入的信息如下：')\nprint('姓名：'+我是变量1)\nprint('年龄：'+我是变量2)"
    },
    {
     "t": "tip",
     "text": "运行结果：（运行后先显示提示语，等你输入完回车才继续）"
    },
    {
     "t": "h2",
     "text": "input 的三个要点"
    },
    {
     "t": "ul",
     "items": [
      "程序从上往下跑到 input() 会暂停，等用户输入并回车才继续喵～",
      "括号里的字符串是提示语，显示给用户看的喵～",
      "用户输入的一切都会变成字符串类型——哪怕你输入的是数字喵～"
     ]
    },
    {
     "t": "tip",
     "text": "重点圈起来喵～input 拿到的永远是字符串！想要数字必须自己 int() 转换，下一课实战喵～"
    }
   ]
  },
  {
   "id": "c26",
   "title": "第二十六课 · input 实战：算长方形面积",
   "blocks": [
    {
     "t": "p",
     "text": "上一课的坑这一课填：input 拿到的是字符串，直接乘会报错，先转换喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "a1=input(\"请输入长方形的长。\")\na2=input(\"请输入长方形的宽。\")\nprint(\"长方形的面积为：\"+str(int(a1)*int(a2)))"
    },
    {
     "t": "tip",
     "text": "运行结果：（输入 3 和 5 后输出：长方形的面积为：15）"
    },
    {
     "t": "h2",
     "text": "拆解这行嵌套"
    },
    {
     "t": "img",
     "src": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20208%22%3E%3Crect%20width%3D%22640%22%20height%3D%22208%22%20fill%3D%22%23fffaf3%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%2234%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23e8833a%22%3E%E4%BB%8E%E9%87%8C%E5%BE%80%E5%A4%96%E8%AF%BB%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%2260%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%2282%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Eint(a1)%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%2282%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E5%AD%97%E7%AC%A6%E4%B8%B2%20'3'%20%E2%86%92%20%E6%95%B0%E5%AD%97%203%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22106%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22128%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Eint(a1)*int(a2)%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22128%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E3%20%C3%97%205%20%3D%2015%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22152%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22174%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Estr(15)%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22174%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E6%95%B0%E5%AD%97%2015%20%E2%86%92%20%E5%AD%97%E7%AC%A6%E4%B8%B2%20'15'%20%E6%89%8D%E8%83%BD%E7%94%A8%20%2B%20%E6%8B%BC%E6%8E%A5%3C%2Ftext%3E%3C%2Fsvg%3E",
     "alt": "示意图"
    },
    {
     "t": "p",
     "text": "也可以用 f-string 写得更清爽，不用来回转换喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "a1=input(\"长：\")\na2=input(\"宽：\")\nprint(f\"长方形的面积为：{int(a1)*int(a2)}\")"
    },
    {
     "t": "tip",
     "text": "运行结果：（输入 3 和 5 后输出：长方形的面积为：15）"
    },
    {
     "t": "tip",
     "text": "推荐 f-string 写法：大括号里随便算，外层不用管类型喵～"
    }
   ]
  },
  {
   "id": "c27",
   "title": "第二十七课 · if 判断：程序会思考了",
   "blocks": [
    {
     "t": "p",
     "text": "前面程序都是直线跑，从这一课开始程序学会「看情况办事」喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "a1=10\na2=20\nif a1>=a2:\n    print('a1的数字大于等于a2会输出')\nelse:\n    print('a1的数字小于a2会输出')"
    },
    {
     "t": "tip",
     "text": "运行结果：a1的数字小于a2会输出"
    },
    {
     "t": "h2",
     "text": "语法结构"
    },
    {
     "t": "img",
     "src": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20208%22%3E%3Crect%20width%3D%22640%22%20height%3D%22208%22%20fill%3D%22%23fffaf3%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%2234%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23e8833a%22%3Eif%20%E7%9A%84%E9%AA%A8%E6%9E%B6%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%2260%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%2282%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Eif%20%E6%9D%A1%E4%BB%B6%3A%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%2282%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E6%9D%A1%E4%BB%B6%E6%88%90%E7%AB%8B%E5%B0%B1%E8%B5%B0%E8%BF%99%E9%87%8C%E4%B8%8B%E9%9D%A2%E7%BC%A9%E8%BF%9B%E7%9A%84%E4%BB%A3%E7%A0%81%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22106%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22128%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Eelse%3A%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22128%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E6%9D%A1%E4%BB%B6%E4%B8%8D%E6%88%90%E7%AB%8B%E8%B5%B0%E8%BF%99%E9%87%8C%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22152%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22174%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E7%BC%A9%E8%BF%9B%204%20%E7%A9%BA%E6%A0%BC%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22174%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E7%BC%A9%E8%BF%9B%E7%9A%84%E4%BB%A3%E7%A0%81%E5%B1%9E%E4%BA%8E%E4%B8%8A%E9%9D%A2%E7%9A%84%20if%EF%BC%8C%E5%BF%85%E9%A1%BB%E7%BC%A9%3C%2Ftext%3E%3C%2Fsvg%3E",
     "alt": "示意图"
    },
    {
     "t": "h2",
     "text": "缩进是 Python 的命根子"
    },
    {
     "t": "p",
     "text": "if 下面的程序必须向右缩进 4 个空格，缩进既是语法要求（错了报错），也是让代码更易读的排版喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "age=18\nif age>=18:\n    print('成年人')\n    print('可以自己签协议')\nprint('这行没缩进，永远执行')"
    },
    {
     "t": "tip",
     "text": "运行结果：成年人\n可以自己签协议\n这行没缩进，永远执行"
    },
    {
     "t": "tip",
     "text": "缩进错误的报错是 IndentationError，新手最常遇到，检查空格是否打了 4 个喵～"
    }
   ]
  },
  {
   "id": "c28",
   "title": "第二十八课 · if 嵌套：判断里再判断",
   "blocks": [
    {
     "t": "p",
     "text": "一个 if 管不了复杂的事，判断里面还能再套判断——经典案例：判断闰年喵～"
    },
    {
     "t": "p",
     "text": "闰年规则：能被 4 整除但不能被 100 整除，或者能被 400 整除喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "year = int( input(\"请输入一个年份：\"))\nif year%4==0:\n    if year%100!=0:\n        print(\"是闰年\")\n    else:\n        if year%400==0:\n            print(\"是闰年\")\n        else:\n            print(\"不是闰年\")\nelse:\n    print(\"不是闰年\")"
    },
    {
     "t": "tip",
     "text": "运行结果：（输入 2024 → 是闰年；输入 1900 → 不是闰年）"
    },
    {
     "t": "h2",
     "text": "读嵌套的诀窍"
    },
    {
     "t": "p",
     "text": "从最外层开始读，看缩进层级：缩进越深，说明它属于越里面的判断喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "# 2024 年验证\nyear = 2024\nprint(year%4==0, year%100!=0)"
    },
    {
     "t": "tip",
     "text": "运行结果：True True → 满足闰年条件"
    },
    {
     "t": "tip",
     "text": "嵌套太深读着累，下一课的逻辑运算符能把三层嵌套压成一行喵～"
    }
   ]
  },
  {
   "id": "c29",
   "title": "第二十九课 · 逻辑运算符：and or not",
   "blocks": [
    {
     "t": "p",
     "text": "逻辑运算符只有三个：and（与）、or（或）、not（非），优先级 not > and > or 喵～"
    },
    {
     "t": "img",
     "src": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20208%22%3E%3Crect%20width%3D%22640%22%20height%3D%22208%22%20fill%3D%22%23fffaf3%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%2234%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23e8833a%22%3E%E4%B8%89%E4%B8%AA%E8%BF%90%E7%AE%97%E7%AC%A6%E7%9A%84%E6%80%A7%E6%A0%BC%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%2260%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%2282%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Eand%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%2282%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E4%B8%A4%E8%BE%B9%E9%83%BD%E7%9C%9F%E6%89%8D%E7%9C%9F%EF%BC%8C%E6%9C%89%E4%B8%80%E4%B8%AA%E5%81%87%E5%B0%B1%E5%81%87%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22106%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22128%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Eor%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22128%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E6%9C%89%E4%B8%80%E4%B8%AA%E7%9C%9F%E5%B0%B1%E7%9C%9F%EF%BC%8C%E4%B8%A4%E8%BE%B9%E9%83%BD%E5%81%87%E6%89%8D%E5%81%87%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22152%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22174%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Enot%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22174%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E5%8F%96%E5%8F%8D%EF%BC%9A%E7%9C%9F%E5%8F%98%E5%81%87%EF%BC%8C%E5%81%87%E5%8F%98%E7%9C%9F%3C%2Ftext%3E%3C%2Fsvg%3E",
     "alt": "示意图"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "print(True and True)\nprint(True and False)\nprint(True or False)\nprint(not True)"
    },
    {
     "t": "tip",
     "text": "运行结果：True\nFalse\nTrue\nFalse"
    },
    {
     "t": "h2",
     "text": "实战：一行判断闰年"
    },
    {
     "t": "p",
     "text": "上一课三层嵌套的闰年判断，用逻辑运算符压成一行喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "year = int( input(\"请输入一个年份：\"))\nif year%4==0 and year%100!=0 or year%400==0:\n    print(\"是闰年\")\nelse:\n    print(\"不是闰年\")"
    },
    {
     "t": "tip",
     "text": "运行结果：（输入 2000 → 是闰年；2023 → 不是闰年）"
    },
    {
     "t": "tip",
     "text": "and、or、not 可以随意嵌套组合，拿不准优先级就加小括号，一劳永逸喵～"
    }
   ]
  },
  {
   "id": "c30",
   "title": "第三十课 · 列表：一排盒子",
   "blocks": [
    {
     "t": "p",
     "text": "一个变量装一个值太浪费，列表是一个变量装一串值喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "a=[1,2,3,4,5]\nprint(a)\nprint(a[2])\nprint(a.index(3))"
    },
    {
     "t": "tip",
     "text": "运行结果：[1, 2, 3, 4, 5]\n3\n2"
    },
    {
     "t": "h2",
     "text": "索引：从 0 开始数"
    },
    {
     "t": "img",
     "src": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20208%22%3E%3Crect%20width%3D%22640%22%20height%3D%22208%22%20fill%3D%22%23fffaf3%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%2234%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23e8833a%22%3E%E7%B4%A2%E5%BC%95%E5%AF%B9%E7%85%A7%E8%A1%A8%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%2260%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%2282%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E5%80%BC%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%2282%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E1%20%202%20%203%20%204%20%205%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22106%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22128%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E7%B4%A2%E5%BC%95%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22128%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E0%20%201%20%202%20%203%20%204%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22152%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22174%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Ea%5B2%5D%20%E6%98%AF%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22174%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E3%EF%BC%88%E7%AC%AC%E4%B8%89%E4%B8%AA%EF%BC%8C%E4%BD%86%E7%B4%A2%E5%BC%95%E6%98%AF%202%EF%BC%89%3C%2Ftext%3E%3C%2Fsvg%3E",
     "alt": "示意图"
    },
    {
     "t": "p",
     "text": "a[索引] 取出对应位置的元素；a.index(元素) 反向查询元素在哪个位置喵～"
    },
    {
     "t": "tip",
     "text": "索引从 0 开始是所有编程语言的传统，「第一个元素」是 a[0]，千万别数错喵～"
    }
   ]
  },
  {
   "id": "c31",
   "title": "第三十一课 · 列表的增删改查",
   "blocks": [
    {
     "t": "p",
     "text": "列表是活的，随时往里加东西、删东西喵～"
    },
    {
     "t": "h2",
     "text": "append：加到末尾"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "a=[1,2,3,4,5]\na.append(6)\nprint(a)"
    },
    {
     "t": "tip",
     "text": "运行结果：[1, 2, 3, 4, 5, 6]"
    },
    {
     "t": "h2",
     "text": "insert：插到指定位置"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "b=[1,2,3,4,5]\nb.insert(2,6)\nprint(b)"
    },
    {
     "t": "tip",
     "text": "运行结果：[1, 2, 6, 3, 4, 5]"
    },
    {
     "t": "p",
     "text": "insert(索引, 元素)：把 6 插到索引 2 的位置，原来的元素集体后移喵～"
    },
    {
     "t": "h2",
     "text": "clear：全部清空"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "b=[1,2,3]\nb.clear()\nprint(b)"
    },
    {
     "t": "tip",
     "text": "运行结果：[]"
    },
    {
     "t": "tip",
     "text": "增删改查是数据结构的四大基本功，本课占了三个，改用 a[索引]=新值 就行喵～"
    }
   ]
  },
  {
   "id": "c32",
   "title": "第三十二课 · 元组：锁死的列表",
   "blocks": [
    {
     "t": "p",
     "text": "元组和列表长得像，区别就一条：创建之后不许改喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "a1=(1,2,3,4,5)\nprint(type(a1))\n\n# 取消下面注释会报错：\n# a1[0]=99"
    },
    {
     "t": "tip",
     "text": "运行结果：<class 'tuple'>"
    },
    {
     "t": "h2",
     "text": "什么时候用元组"
    },
    {
     "t": "ul",
     "items": [
      "数据一创建就不该变：比如一年 12 个月、一周 7 天喵～",
      "比列表更省内存、更安全，不怕手滑改错喵～"
     ]
    },
    {
     "t": "p",
     "text": "单元素元组有个坑：必须在元素后面加逗号，不然括号会被当成数学括号喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "a=(1,)\nprint(type(a))\nb=(1)\nprint(type(b))"
    },
    {
     "t": "tip",
     "text": "运行结果：<class 'tuple'>\n<class 'int'>"
    },
    {
     "t": "tip",
     "text": "(1,) 是元组，(1) 就是数字 1，差一个逗号天壤之别喵～"
    }
   ]
  },
  {
   "id": "c33",
   "title": "第三十三课 · 字典：贴标签的仓库",
   "blocks": [
    {
     "t": "p",
     "text": "列表靠位置找东西，字典靠「键」找东西——像查字典一样喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "a={\n    'a1':'张三',\n    'a2':18,\n    'a3':'男'\n    }\nprint(a['a1'])\nprint(a['a2'])\nprint(a['a3'])"
    },
    {
     "t": "tip",
     "text": "运行结果：张三\n18\n男"
    },
    {
     "t": "h2",
     "text": "键值对"
    },
    {
     "t": "img",
     "src": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20208%22%3E%3Crect%20width%3D%22640%22%20height%3D%22208%22%20fill%3D%22%23fffaf3%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%2234%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23e8833a%22%3E%E5%AD%97%E5%85%B8%E7%9A%84%E7%BB%93%E6%9E%84%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%2260%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%2282%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E'a1'%20%3A%20'%E5%BC%A0%E4%B8%89'%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%2282%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E9%94%AE%20a1%20%E5%AF%B9%E5%BA%94%E5%80%BC%20%E5%BC%A0%E4%B8%89%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22106%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22128%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E'a2'%20%3A%2018%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22128%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E9%94%AE%20a2%20%E5%AF%B9%E5%BA%94%E5%80%BC%2018%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22152%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22174%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Ea%5B'a1'%5D%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22174%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E6%8C%89%E9%94%AE%E5%8F%96%E5%80%BC%EF%BC%8C%E9%94%AE%E5%BF%85%E9%A1%BB%E5%B8%A6%E5%BC%95%E5%8F%B7%3C%2Ftext%3E%3C%2Fsvg%3E",
     "alt": "示意图"
    },
    {
     "t": "h2",
     "text": "del：删掉某个键"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "a={'a1':'张三','a2':18}\ndel a['a2']\nprint(a)"
    },
    {
     "t": "tip",
     "text": "运行结果：{'a1': '张三'}"
    },
    {
     "t": "tip",
     "text": "新增和修改同样简单：a['新键']=值，键存在就修改，不存在就新增喵～"
    }
   ]
  },
  {
   "id": "c34",
   "title": "第三十四课 · for 循环与 range",
   "blocks": [
    {
     "t": "p",
     "text": "让电脑重复干活是编程最大的爽点，for 循环登场喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "for a1 in range(10,20,2):\n    print(a1)"
    },
    {
     "t": "tip",
     "text": "运行结果：10\n12\n14\n16\n18"
    },
    {
     "t": "h2",
     "text": "range 三参数"
    },
    {
     "t": "img",
     "src": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20254%22%3E%3Crect%20width%3D%22640%22%20height%3D%22254%22%20fill%3D%22%23fffaf3%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%2234%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23e8833a%22%3Erange(%E8%B5%B7%2C%20%E6%AD%A2%2C%20%E6%AD%A5%E9%95%BF)%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%2260%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%2282%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Erange(10%2C20%2C2)%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%2282%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E4%BB%8E%2010%20%E5%88%B0%2020%EF%BC%88%E4%B8%8D%E5%90%AB%2020%EF%BC%89%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22106%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22128%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E6%AD%A5%E9%95%BF%202%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22128%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E6%AF%8F%E6%AC%A1%E8%B7%B3%202%20%E4%B8%AA%EF%BC%9A10%2C12%2C14%E2%80%A6%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22152%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22174%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E6%AD%A5%E9%95%BF%E4%B8%BA%E8%B4%9F%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22174%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E4%BB%8E%E5%A4%A7%E5%88%B0%E5%B0%8F%E5%80%92%E6%95%B0%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22198%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22220%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Erange(5)%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22220%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E7%AE%80%E5%86%99%EF%BC%9A0%201%202%203%204%3C%2Ftext%3E%3C%2Fsvg%3E",
     "alt": "示意图"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "for i in range(3):\n    print('喵～')"
    },
    {
     "t": "tip",
     "text": "运行结果：喵～\n喵～\n喵～"
    },
    {
     "t": "tip",
     "text": "range 的终点永远取不到（不含 20 就停），新手最容易在这里犯迷糊喵～"
    }
   ]
  },
  {
   "id": "c35",
   "title": "第三十五课 · while 循环：满足就继续",
   "blocks": [
    {
     "t": "p",
     "text": "for 是「数着次数循环」，while 是「看条件循环」——条件满足就一直转喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "a1=0\nwhile a1<10:\n    a1=a1+1\n    print(a1)"
    },
    {
     "t": "tip",
     "text": "运行结果：1\n2\n3\n…\n10"
    },
    {
     "t": "h2",
     "text": "while 的骨架"
    },
    {
     "t": "ul",
     "items": [
      "while 条件: 条件为真就一直执行缩进块喵～",
      "循环体内必须让条件有机会变成假，否则就是死循环喵～",
      "本例靠 a1=a1+1 一点点逼近 10，到 10 条件为假自动停喵～"
     ]
    },
    {
     "t": "tip",
     "text": "死循环不可怕，Ctrl+C 强制停掉就行；可怕的是不知道自己写了个死循环喵～"
    }
   ]
  },
  {
   "id": "c36",
   "title": "第三十六课 · break 与 continue",
   "blocks": [
    {
     "t": "p",
     "text": "循环的遥控器有两个按钮：break 立即下车，continue 跳过这一站喵～"
    },
    {
     "t": "img",
     "src": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20162%22%3E%3Crect%20width%3D%22640%22%20height%3D%22162%22%20fill%3D%22%23fffaf3%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%2234%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23e8833a%22%3E%E4%B8%A4%E4%B8%AA%E6%8E%A7%E5%88%B6%E8%AF%AD%E5%8F%A5%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%2260%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%2282%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Ebreak%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%2282%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E6%95%B4%E4%B8%AA%E5%BE%AA%E7%8E%AF%E7%9B%B4%E6%8E%A5%E7%BB%93%E6%9D%9F%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22106%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22128%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Econtinue%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22128%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E8%B7%B3%E8%BF%87%E6%9C%AC%E8%BD%AE%E5%89%A9%E4%BD%99%E4%BB%A3%E7%A0%81%EF%BC%8C%E8%BF%9B%E5%85%A5%E4%B8%8B%E4%B8%80%E8%BD%AE%3C%2Ftext%3E%3C%2Fsvg%3E",
     "alt": "示意图"
    },
    {
     "t": "h2",
     "text": "实战：密码验证"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "a1=\"123456\"\nwhile input(\"请输入密码：\") != a1:\n    print(\"密码错误\")\n    continue\nelse:\n    print(\"登录成功\")"
    },
    {
     "t": "tip",
     "text": "运行结果：（密码错则反复提示，输对输出登录成功）"
    },
    {
     "t": "p",
     "text": "while 循环还能接 else：循环正常走完（没被 break 打断）就执行 else 块喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "for i in range(5):\n    if i==3:\n        break\n    print(i)"
    },
    {
     "t": "tip",
     "text": "运行结果：0\n1\n2"
    },
    {
     "t": "tip",
     "text": "continue 在本例其实可以省略（循环体末尾自然进入下一轮），但写出来逻辑更明确喵～"
    }
   ]
  },
  {
   "id": "c37",
   "title": "第三十七课 · % 格式化：老派写法",
   "blocks": [
    {
     "t": "p",
     "text": "在 f-string 诞生之前，大家用 % 往字符串里塞值——老代码里到处是它，得认识喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "name=\"张三\"\nage=18\nhobby=\"篮球\"\nheight=1.78\nprint(\"姓名：%s，年龄：%d，爱好：%s，身高：%6.2f\" %(name,age,hobby,height))"
    },
    {
     "t": "tip",
     "text": "运行结果：姓名：张三，年龄：18，爱好：篮球，身高：  1.78"
    },
    {
     "t": "img",
     "src": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20254%22%3E%3Crect%20width%3D%22640%22%20height%3D%22254%22%20fill%3D%22%23fffaf3%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%2234%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23e8833a%22%3E%E5%8D%A0%E4%BD%8D%E7%AC%A6%E5%AF%B9%E7%85%A7%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%2260%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%2282%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%25s%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%2282%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E5%AD%97%E7%AC%A6%E4%B8%B2%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22106%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22128%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%25d%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22128%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E6%95%B4%E6%95%B0%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22152%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22174%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%25f%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22174%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E6%B5%AE%E7%82%B9%E6%95%B0%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22198%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22220%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%256.2f%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22220%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E6%80%BB%E5%AE%BD%206%20%E4%BD%8D%E3%80%81%E4%BF%9D%E7%95%99%202%20%E4%BD%8D%E5%B0%8F%E6%95%B0%3C%2Ftext%3E%3C%2Fsvg%3E",
     "alt": "示意图"
    },
    {
     "t": "p",
     "text": "前后两组括号一一对应，% 后面把值按顺序填进占位符喵～"
    },
    {
     "t": "tip",
     "text": "新代码请直接用 f-string，这里学 % 只为了看懂别人的老代码喵～"
    }
   ]
  },
  {
   "id": "c38",
   "title": "第三十八课 · format 与 f-string",
   "blocks": [
    {
     "t": "p",
     "text": "字符串格式化三代同堂：% 是爷爷，format 是爸爸，f-string 是当家的年轻人喵～"
    },
    {
     "t": "h2",
     "text": "format 方法"
    },
    {
     "t": "p",
     "text": "大括号 {} 是占位符，format 按顺序往里填值喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "a1='a1'\na2='a2'\na3='hello world'\na4=123\nprint(\"a{}s{}d{}f{}\".format(a1,a2,a3,a4))"
    },
    {
     "t": "tip",
     "text": "运行结果：aa1sa2dhello worldf123"
    },
    {
     "t": "p",
     "text": "大括号里可以写变量名、表达式、函数调用，非常自由喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "print(\"今年是{}年\".format(2026))\nprint(\"1+1={}\".format(1+1))"
    },
    {
     "t": "tip",
     "text": "运行结果：今年是2026年\n1+1=2"
    },
    {
     "t": "h2",
     "text": "f-string：最简写法"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "a1='a1'\na4=123\nprint(f\"{a1}{a4}\")"
    },
    {
     "t": "tip",
     "text": "运行结果：a1123"
    },
    {
     "t": "tip",
     "text": "三代格式化你都会了，日常写代码锁定 f-string 就好喵～"
    }
   ]
  },
  {
   "id": "c39",
   "title": "第三十九课 · def：自定义函数",
   "blocks": [
    {
     "t": "p",
     "text": "一段代码到处复用怎么办喵～打包成函数，随叫随到喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "def nome ():\n    nome_0 = input(\"请输入你的用户名\")\n    nome_1 = input(\"请输入你的密码\")\n    print('''请记住你的用户名:{0}\n请记住你的密码:{1}'''.format(nome_0, nome_1))\n    return nome_0, nome_1\n\nnome()"
    },
    {
     "t": "tip",
     "text": "运行结果：（运行后依次询问用户名和密码，再回显）"
    },
    {
     "t": "h2",
     "text": "语法骨架"
    },
    {
     "t": "ul",
     "items": [
      "def 函数名(): 定义函数，冒号别忘了喵～",
      "函数体要缩进，和 if 一样喵～",
      "函数名() 才是调用，光定义不调用什么都不会发生喵～",
      "return 把结果交还给调用者，调用处可以用变量接住喵～"
     ]
    },
    {
     "t": "code",
     "lang": "python",
     "code": "def add(a, b):\n    return a + b\n\nresult = add(1, 2)\nprint(result)"
    },
    {
     "t": "tip",
     "text": "运行结果：3"
    },
    {
     "t": "tip",
     "text": "函数像自动贩卖机：参数是投币，return 是掉出来的饮料，没有 return 的函数默认返回 None 喵～"
    }
   ]
  },
  {
   "id": "c40",
   "title": "第四十课 · import：使用模块",
   "blocks": [
    {
     "t": "p",
     "text": "别人写好的代码库叫模块，import 一下就能白嫖喵～"
    },
    {
     "t": "img",
     "src": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20208%22%3E%3Crect%20width%3D%22640%22%20height%3D%22208%22%20fill%3D%22%23fffaf3%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%2234%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23e8833a%22%3E%E4%B8%89%E7%A7%8D%E5%AF%BC%E5%85%A5%E5%A7%BF%E5%8A%BF%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%2260%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%2282%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Eimport%20%E6%A8%A1%E5%9D%97%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%2282%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E6%95%B4%E5%8C%85%E5%AF%BC%E5%85%A5%EF%BC%8C%E7%94%A8%20%E6%A8%A1%E5%9D%97%E5%90%8D.%E5%87%BD%E6%95%B0()%20%E8%B0%83%E7%94%A8%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22106%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22128%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Efrom%20%E6%A8%A1%E5%9D%97%20import%20%E5%87%BD%E6%95%B0%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22128%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E5%8F%AA%E6%8B%BF%E5%87%A0%E4%B8%AA%E5%87%BD%E6%95%B0%EF%BC%8C%E7%9B%B4%E6%8E%A5%20%E5%87%BD%E6%95%B0()%20%E8%B0%83%E7%94%A8%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22152%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22174%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Eimport%20%E6%A8%A1%E5%9D%97%20as%20%E5%88%AB%E5%90%8D%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22174%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E5%AB%8C%E5%90%8D%E5%AD%97%E9%95%BF%E5%B0%B1%E8%B5%B7%E5%A4%96%E5%8F%B7%3C%2Ftext%3E%3C%2Fsvg%3E",
     "alt": "示意图"
    },
    {
     "t": "h2",
     "text": "模块分三等"
    },
    {
     "t": "ul",
     "items": [
      "内置函数（print、len）：无需导入直接用喵～",
      "内置模块（random、os）：要 import 但不用安装喵～",
      "第三方模块（requests 等）：pip 安装后才能 import 喵～"
     ]
    },
    {
     "t": "h2",
     "text": "random 实战"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "import random\nprint(random.randint(1, 100))\nprint(random.choice(['apple', 'banana', 'orange']))"
    },
    {
     "t": "tip",
     "text": "运行结果：（每次运行结果随机：如 42 和 banana）"
    },
    {
     "t": "tip",
     "text": "randint(a,b) 两头都包含，掷骰子用 randint(1,6) 正合适喵～"
    }
   ]
  },
  {
   "id": "c41",
   "title": "第四十一课 · class：创建类",
   "blocks": [
    {
     "t": "p",
     "text": "类是把数据和函数打包在一起的模具，用它「造」出一批相似的对象喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "class com:\n    def __init__(self,name,age):\n        self.name = name\n        self.age = age\n\n    def com_name(self):\n        print(self.name)\n    def com_age(self):\n        print(self.age)\nCom = com(\"小明\", 18)\nCom.com_name()\nCom.com_age()"
    },
    {
     "t": "tip",
     "text": "运行结果：小明\n18"
    },
    {
     "t": "h2",
     "text": "拆解这套模具"
    },
    {
     "t": "ul",
     "items": [
      "class com: 定义名为 com 的类喵～",
      "__init__ 是初始化方法：造对象时自动执行，参数先填 self 再填你自己的喵～",
      "self.name = name 把参数存进对象自身，之后到处能用喵～",
      "Com = com(\"小明\", 18) 用模具造出一个具体对象（实例）喵～"
     ]
    },
    {
     "t": "tip",
     "text": "类是图纸，对象是照着图纸盖的房子——一套图纸能盖无数房子喵～"
    }
   ]
  },
  {
   "id": "c42",
   "title": "第四十二课 · 继承：儿子的类",
   "blocks": [
    {
     "t": "p",
     "text": "儿子类自动拥有父亲类的一切，还能加自己的新东西，这就是继承喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "class com:\n    def __init__(self,name,age):\n        self.name = name\n        self.age = age\n\nclass cmo(com):\n    def __init__(self,name,age,msg):\n        super().__init__(name,age)\n        self.msg = msg\nc = cmo(\"张三\", 20, \"备注\")\nprint(c.name)\nprint(c.age)\nprint(c.msg)"
    },
    {
     "t": "tip",
     "text": "运行结果：张三\n20\n备注"
    },
    {
     "t": "h2",
     "text": "关键点"
    },
    {
     "t": "img",
     "src": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20254%22%3E%3Crect%20width%3D%22640%22%20height%3D%22254%22%20fill%3D%22%23fffaf3%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%2234%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23e8833a%22%3E%E7%BB%A7%E6%89%BF%E7%BB%93%E6%9E%84%E5%9B%BE%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%2260%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%2282%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E7%88%B6%E7%B1%BB%20com%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%2282%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E6%9C%89%20name%E3%80%81age%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22106%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22128%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E5%AD%90%E7%B1%BB%20cmo(com)%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22128%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E6%8B%AC%E5%8F%B7%E9%87%8C%E5%86%99%E7%88%B6%E7%B1%BB%E5%90%8D%20%3D%20%E8%AE%A4%E7%88%B9%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22152%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22174%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Esuper().__init__%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22174%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E5%85%88%E6%8A%8A%E7%88%B6%E7%B1%BB%E7%9A%84%E5%88%9D%E5%A7%8B%E5%8C%96%E8%B7%91%E4%B8%80%E9%81%8D%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22198%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22220%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Eself.msg%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22220%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E5%84%BF%E5%AD%90%E7%8B%AC%E6%9C%89%E7%9A%84%E6%96%B0%E5%B1%9E%E6%80%A7%3C%2Ftext%3E%3C%2Fsvg%3E",
     "alt": "示意图"
    },
    {
     "t": "p",
     "text": "c 是子类造出的对象，既 name、age 都从父类继承，msg 是自己新增的喵～"
    },
    {
     "t": "tip",
     "text": "继承的本质是「不重复造轮子」，公共功能写进父类，子类只写差异喵～"
    }
   ]
  },
  {
   "id": "c43",
   "title": "第四十三课 · 打开与读取文件",
   "blocks": [
    {
     "t": "p",
     "text": "程序关掉数据就没了喵～把数据写进文件，永久保存喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "f = open(\"41name.txt\",\"r\",encoding=\"utf-8\")\nprint(f.read())\nf.close()"
    },
    {
     "t": "tip",
     "text": "运行结果：（输出 41name.txt 的全部内容）"
    },
    {
     "t": "h2",
     "text": "open 三参数"
    },
    {
     "t": "img",
     "src": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20208%22%3E%3Crect%20width%3D%22640%22%20height%3D%22208%22%20fill%3D%22%23fffaf3%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%2234%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23e8833a%22%3Eopen(%E8%B7%AF%E5%BE%84%2C%20%E6%A8%A1%E5%BC%8F%2C%20%E7%BC%96%E7%A0%81)%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%2260%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%2282%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%2241name.txt%22%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%2282%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E6%96%87%E4%BB%B6%E8%B7%AF%E5%BE%84%EF%BC%8C%E7%9B%B8%E5%AF%B9%E6%88%96%E7%BB%9D%E5%AF%B9%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22106%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22128%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%22r%22%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22128%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3Er%20%E8%AF%BB%20%2F%20w%20%E5%86%99%20%2F%20a%20%E8%BF%BD%E5%8A%A0%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22152%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22174%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Eencoding%3D%22utf-8%22%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22174%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E7%BC%96%E7%A0%81%EF%BC%8C%E4%B8%AD%E6%96%87%E5%BF%85%E5%8A%A0%E9%98%B2%E4%B9%B1%E7%A0%81%3C%2Ftext%3E%3C%2Fsvg%3E",
     "alt": "示意图"
    },
    {
     "t": "h2",
     "text": "三种读取方法"
    },
    {
     "t": "ul",
     "items": [
      "read() 全部内容一口气读完喵～",
      "readline() 只读 1 行喵～",
      "readlines() 全部读完装进列表，一行一个元素喵～"
     ]
    },
    {
     "t": "tip",
     "text": "用完一定要 f.close() 关闭文件，下一课教你 with 写法可以自动关闭喵～"
    }
   ]
  },
  {
   "id": "c44",
   "title": "第四十四课 · 写入与追加文件",
   "blocks": [
    {
     "t": "p",
     "text": "读文件学完了，往文件里写内容用 w 和 a 模式，推荐 with 自动关闭写法喵～"
    },
    {
     "t": "h2",
     "text": "w 模式：写入（覆盖！）"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "with open(\"42name.txt\",\"w\",encoding=\"utf-8\") as f:\n    f.write(\"hello world\\n\")\n    f.write(\"hello python\\n\")"
    },
    {
     "t": "tip",
     "text": "运行结果：（文件被写入两行，原有内容全部被替换）"
    },
    {
     "t": "p",
     "text": "w 模式的弊端：打开瞬间原有内容直接清零，慎用喵～"
    },
    {
     "t": "h2",
     "text": "a 模式：追加（安全）"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "with open(\"43name.txt\",\"a+\",encoding=\"utf-8\") as f:\n    f.write(\"hello world\\n\")\n    f.seek(0)\n    print(f.read())"
    },
    {
     "t": "tip",
     "text": "运行结果：（原内容保留，新内容接在末尾；seek(0) 把光标拨回开头再读）"
    },
    {
     "t": "img",
     "src": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20208%22%3E%3Crect%20width%3D%22640%22%20height%3D%22208%22%20fill%3D%22%23fffaf3%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%2234%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23e8833a%22%3Ew%20%E4%B8%8E%20a%20%E7%9A%84%E5%8C%BA%E5%88%AB%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%2260%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%2282%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Ew%20%E5%86%99%E5%85%A5%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%2282%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E6%B8%85%E7%A9%BA%E9%87%8D%E5%86%99%EF%BC%8C%E5%8E%9F%E5%86%85%E5%AE%B9%E9%98%B5%E4%BA%A1%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22106%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22128%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Ea%20%E8%BF%BD%E5%8A%A0%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22128%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E6%8E%A5%E5%9C%A8%E6%9C%AB%E5%B0%BE%EF%BC%8C%E5%8E%9F%E5%86%85%E5%AE%B9%E5%AE%89%E5%85%A8%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22152%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22174%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3E%E6%A8%A1%E5%BC%8F%20%2B%20%E5%8A%A0%E5%8F%B7%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22174%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E8%AF%BB%E5%86%99%E5%90%8C%E6%97%B6%E5%85%81%E8%AE%B8%EF%BC%8C%E5%A6%82%20a%2B%E3%80%81r%2B%3C%2Ftext%3E%3C%2Fsvg%3E",
     "alt": "示意图"
    },
    {
     "t": "tip",
     "text": "记日志、攒数据用 a 模式；生成全新文件才用 w，写错覆盖了可没后悔药喵～"
    }
   ]
  },
  {
   "id": "c45",
   "title": "第四十五课 · 异常处理：try 与 except",
   "blocks": [
    {
     "t": "p",
     "text": "用户输入永远出乎意料，try/except 让程序在被坑时优雅站起来喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "try:\n    num = int(input(\"请输入数字: \"))\n    print(100 / num)\nexcept ZeroDivisionError:\n    print(\"不能除以 0\")\nexcept ValueError:\n    print(\"请输入数字，别乱输\")\nexcept Exception as e:\n    print(\"出错了:\", e)"
    },
    {
     "t": "tip",
     "text": "运行结果：（输入 0 → 不能除以 0；输入 abc → 请输入数字，别乱输）"
    },
    {
     "t": "h2",
     "text": "运行逻辑"
    },
    {
     "t": "ul",
     "items": [
      "try 块里放「可能出事」的代码喵～",
      "一旦报错，立刻跳进对应类型的 except 块，程序不崩溃喵～",
      "except 可以写多个，从具体到宽泛排，Exception 兜底接住所有喵～",
      "as e 把错误对象存进变量 e，能打印出具体错误信息喵～"
     ]
    },
    {
     "t": "code",
     "lang": "python",
     "code": "try:\n    f = open(\"不存在的文件.txt\")\n    f.close()\nexcept FileNotFoundError:\n    print(\"文件不存在\")"
    },
    {
     "t": "tip",
     "text": "运行结果：文件不存在"
    },
    {
     "t": "tip",
     "text": "常见异常先混个脸熟：ZeroDivisionError 除零、ValueError 值不对、FileNotFoundError 文件没找到喵～"
    }
   ]
  },
  {
   "id": "c46",
   "title": "第四十六课 · os 模块：操作文件系统",
   "blocks": [
    {
     "t": "p",
     "text": "os 模块是 Python 和操作系统之间的翻译官，文件夹的增删查全靠它喵～"
    },
    {
     "t": "code",
     "lang": "python",
     "code": "import os\n\n# 1. 判断文件/文件夹是否存在\nprint(os.path.exists(\"45name.json\"))\n\n# 2. 列出文件夹里所有文件\nprint(os.listdir(\".\"))\n\n# 3. 创建文件夹（已存在不报错）\nos.makedirs(\"新文件夹\", exist_ok=True)\n\n# 4. 拿当前脚本所在目录\nprint(os.path.dirname(os.path.abspath(__file__)))\n\n# 5. 拼接路径（跨系统自动处理分隔符）\nprint(os.path.join(\"文件夹名\", \"45name.json\"))"
    },
    {
     "t": "tip",
     "text": "运行结果：（依次输出：True/False、文件列表、路径字符串……）"
    },
    {
     "t": "h2",
     "text": "五个常用功能速记"
    },
    {
     "t": "img",
     "src": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20300%22%3E%3Crect%20width%3D%22640%22%20height%3D%22300%22%20fill%3D%22%23fffaf3%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%2234%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23e8833a%22%3Eos%20%E6%A8%A1%E5%9D%97%E9%80%9F%E6%9F%A5%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%2260%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%2282%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Eos.path.exists%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%2282%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E5%AD%98%E5%9C%A8%E8%BF%94%E5%9B%9E%20True%EF%BC%8C%E4%B8%8D%E5%AD%98%E5%9C%A8%E8%BF%94%E5%9B%9E%20False%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22106%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22128%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Eos.listdir(%22.%22)%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22128%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E5%88%97%E5%87%BA%E7%9B%AE%E5%BD%95%E4%B8%8B%E6%89%80%E6%9C%89%E6%9D%A1%E7%9B%AE%EF%BC%8C%E8%A3%85%E8%BF%9B%E5%88%97%E8%A1%A8%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22152%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22174%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Eos.makedirs%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22174%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E5%88%9B%E5%BB%BA%E6%96%87%E4%BB%B6%E5%A4%B9%EF%BC%8Cexist_ok%3DTrue%20%E5%AD%98%E5%9C%A8%E4%B8%8D%E6%8A%A5%E9%94%99%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22198%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22220%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Eos.path.dirname(abspath(__file__))%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22220%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E5%BD%93%E5%89%8D%E8%84%9A%E6%9C%AC%E6%89%80%E5%9C%A8%E6%96%87%E4%BB%B6%E5%A4%B9%E7%9A%84%E7%BB%9D%E5%AF%B9%E8%B7%AF%E5%BE%84%3C%2Ftext%3E%3Crect%20x%3D%2230%22%20y%3D%22244%22%20width%3D%22200%22%20height%3D%2234%22%20rx%3D%228%22%20fill%3D%22%23e8833a%22%20fill-opacity%3D%220.12%22%2F%3E%3Ctext%20x%3D%22130%22%20y%3D%22266%22%20text-anchor%3D%22middle%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%20font-weight%3D%22600%22%3Eos.path.join(a%2C%20b)%3C%2Ftext%3E%3Ctext%20x%3D%22252%22%20y%3D%22266%22%20font-size%3D%2215%22%20fill%3D%22%235b4636%22%3E%E6%99%BA%E8%83%BD%E6%8B%BC%E8%B7%AF%E5%BE%84%EF%BC%8CWindows%2FMac%20%E9%80%9A%E5%90%83%3C%2Ftext%3E%3C%2Fsvg%3E",
     "alt": "示意图"
    },
    {
     "t": "p",
     "text": "os.path.join 特别重要：Windows 用反斜杠 \\，Mac/Linux 用正斜杠 /，join 自动帮你选对喵～"
    },
    {
     "t": "tip",
     "text": "exists + makedirs 组合是「确保文件夹存在」的标准姿势：先判断，不存在就创建喵～"
    }
   ]
  }
 ]
}
]
};
