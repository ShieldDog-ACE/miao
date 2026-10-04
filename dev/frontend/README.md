# 喵站（前台）—— 开发版核心模块①

面向所有用户的**内容展示与浏览入口**。需求基准见根目录《SPEC.md》第 5、6.1、8.1–8.5 章。

## 职责范围

- 首页 / 分类页 / 教程封面页 / 章节阅读页（三栏布局）/ 搜索
- 邮箱注册登录（允许游客跳过）、右上角个人信息中心
- 我的学习（进度 / 收藏 / 笔记）、消息中心
- 老师申请入口、创作中心（老师）
- 状态：数据全部来自后台管理系统（`/api/*`）；前端静态目录**不含任何教程正文**，
  正文按约 2000 字分窗下发。原 `assets/js/data.js`（全站正文的前端副本）已彻底移除。

## 封面素材

- 封面一律用代码画，640×360（16:9），放在 `assets/img/covers/<教程id>.svg`，规则见根目录《SPEC.md》§16。
- `covers/python.svg` 左侧图形是 **Python 官方 logo**：© Python Software Foundation，
  取自 `python.org/static/community_logos/python-logo-generic.svg`，该文件按 CC-BY 3.0 提供。
  这里仅用于指代 Python 这门语言，**不代表 PSF 出品或背书本站**；站点本身与 PSF 无关联。
- `covers/english.svg` 的字母卡、音标芯片与声波均为本站原创几何绘制，无第三方素材。
