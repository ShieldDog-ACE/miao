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
  /* Python 入门 · 46 章：正文全部来自 py-data.js（唯一来源），前端与 seed 都不留副本 */
  window.MIAO_PY.tutorial,
  /* 英语发音 · 26 字母 + 48 音标：数据与正文全部来自 en-data.js（唯一来源） */
  window.MIAO_EN.tutorial
]
};
