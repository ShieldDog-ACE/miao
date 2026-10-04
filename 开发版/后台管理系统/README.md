# 喵站后端

零依赖（只用 Node 内置模块）的真实前后端：SQLite 存储、邮箱验证码登录、防爬虫限流、作品/收藏/关注/好友全部落库。

## 快速开始

```bash
cp .env.example .env      # 填入自己的 Node 路径 / 邮箱授权码 / 管理口令（.env 已被 gitignore）
cp config.example.json config.json   # 可选：只放端口、限流等非密钥偏好
bash start.sh             # 主站 API + 静态前端 → http://127.0.0.1:8787/
bash start-admin.sh       # 后台管理系统          → http://127.0.0.1:8788/
bash stop.sh              # 两个一起关
bash reset-data.sh        # 清空数据库并重新导入 seed-data.js（重置测试数据用）
```

## 环境要求

- **Node >= 22.5**（使用内置 `node:sqlite`；推荐 22 LTS）。检查：`node -e "require('node:sqlite')"`
- ⚠️ 若系统默认 `node` 版本偏低（如 Ubuntu 自带 `/usr/bin/node` v18），会报
  `No such built-in module: node:sqlite`。启动脚本会自动挑对版本，无需改 PATH。

`start.sh` / `start-admin.sh` / `reset-data.sh` / `tests/run.sh` 都复用 `pick-node.sh` 选 Node，顺序为：

1. `.env`（或环境）里的 `MIAO_NODE_BIN=/绝对路径/node`
2. `PATH` 上的 `node`
3. 常见版本管理器目录（`~/.nvm`、mise、proto、Homebrew）

全部失败时脚本会打印下一步该怎么办。**本机 Node 路径只写 `.env`，不要写进脚本或 README。**

## 密钥放哪里（重要）

| 项目 | 位置 | 是否进仓库 |
|---|---|---|
| `SMTP_USER` / `SMTP_PASS`（邮箱授权码） | `.env` 或环境变量 | ❌ `.gitignore` 已忽略 `.env` |
| `MIAO_ADMIN_PASS`（后台口令） | `.env` 或环境变量 | ❌ 同上 |
| `MIAO_NODE_BIN` / `NODE_PATH`（本机路径） | `.env` | ❌ 同上 |
| 端口、限流、`trustProxy` 等偏好 | `config.json` | 建议也忽略，仓库只放 `config.example.json` |

代码与仓库文件里**不留任何默认口令、不留任何真实邮箱/授权码**。
`node tools/check-secrets.js` 可一键自查（见文末「发布前自查」）。

**口令/授权码只认环境变量**：即使有人在 `config.json` 里手写了 `mail.pass` 或 `admin.pass`，
`config.js` 也会在加载时把它们丢弃并打印告警 —— 明文密钥进仓库这条路径在代码层面就是封死的。
`config.json` 只用来放端口、限流、`trustProxy` 这类非密钥偏好。

## 关闭服务

```bash
bash stop.sh      # 关掉前台(8787) + 后台管理系统(8788)，自动按端口/进程名查找
```

其他方式：

| 情况 | 关闭方法 |
|---|---|
| 前台启动（`bash start.sh` 直接跑） | 按 `Ctrl + C` |
| 后台启动（nohup/setsid） | `pkill -f "index.js"` 或 `bash stop.sh` |
| 只想关某一个端口 | `fuser -k 8787/tcp` 或 `lsof -ti tcp:8787 \| xargs kill -9` |
| 后台管理系统 | `pkill -f "admin.js"` |

> 若用 `pm2` / `systemd` 部署，则用 `pm2 stop miao` / `systemctl stop miao`。

## 启动

```bash
bash start.sh
# 或直接用支持 node:sqlite 的 Node：NODE_NO_WARNINGS=1 /绝对路径/node index.js
# 默认 http://127.0.0.1:8787/ ；首次启动自动建库，并导入 seed-data.js 里的种子教程
```

## 配置邮箱（登录验证码发信）

发信凭据**只从环境变量 / `.env` 读取**，`config.json` 里不再有 `mail` 段：

| 变量 | 说明 |
|---|---|
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` | QQ `smtp.qq.com:465`（secure:true）；163 `smtp.163.com:465` |
| `SMTP_USER` | 发信邮箱 |
| `SMTP_PASS` | **邮箱「SMTP 授权码」**（QQ/163 在 设置→POP3/SMTP 里生成，不是登录密码） |
| `SMTP_FROM` | 一般与 user 相同 |

`SMTP_PASS` 一旦存在就自动真实发信；缺授权码时一律降级为**开发模式**（验证码打印到控制台并写入 `data/mail-outbox.log`），流程照样跑得通。测试可用 `MIAO_NO_MAIL=1` 强制不连 SMTP。

## 后台管理系统（独立服务）

```bash
bash start-admin.sh          # 读取 .env 里的 MIAO_ADMIN_PASS
```

- 访问 http://127.0.0.1:8788/ ，用管理口令登录
- 功能：老师申请审核、教程审核（通过即上架，>20MB 标「大文档」）、作品正文预览、发布公告、封禁 IP 管理
- 口令来源：环境变量 / `.env` 的 `MIAO_ADMIN_PASS` > `config.json` 的 `admin.pass`
- **没有任何内置默认口令**：三处都没配置时，本次启动随机生成一次性口令并打印在启动日志里，重启即失效

## 教程正文改完为什么不生效

种子教程只有**一份**：`seed-data.js`，且只在**建库时**导入 SQLite；
库里已有内容时不会再覆盖，所以改了它不会立刻生效。

> 早期版本另维护过一份前端副本 `喵站/assets/js/data.js`（由 `tools/sync-seed.js` 生成）。
> 它等于把全站正文摆进静态目录——任何人一次请求就能拖走全部教程，
> 正文分窗与"每分钟 N 篇"的防扒限流全被绕过，现已删除，同步工具一并移除。
> 前端正文一律经 `/api` 按需下发。

改正文后的正确姿势（**不会动账号数据**）：

```bash
node tools/sync-python.js      # py-data.js → 库里 id=python（按 id upsert，幂等）
node tools/insert-english.js   # en-data.js → 库里 id=english
```

只跑对应教程的那一个就够，不用重启后端。新拆出数据文件的话，要在 `db.js` 的 `SEED_DEPS`
里登记一次，否则全新建库时 seed 取不到它。

老师自己改单篇正文走后台管理系统，同样不碰库。

> ⚠️ `reset-data.sh` 会重建整库：账号、密码、收藏、好友、浏览记录全部清空（旧库虽先备份，
> 但不会自动迁回）。只有你确实要从零重来时才用它。

## 生产部署建议

- 进程守护：`pm2 start index.js --name miao` 或 systemd
- 备份：整目录拷走 `data/`（库里是账号与正文，`data/uploads/` 是用户上传的图片；WAL 模式建议先 `sqlite3 data/miao.db "PRAGMA wal_checkpoint;"`）
- 上传目录默认跟着数据目录走（`data/uploads/`），需要放在别处用 `MIAO_UPLOAD_DIR`；测试只改 `MIAO_DATA_DIR` 就能连图片一起隔离
- 老师审核：演示默认提交即通过；正式使用在 config.json 设 `"autoApproveTeacher": false` 走人工（改 users.role='teacher'）
- **`trustProxy` 默认 false**：只有 8787 前面挂了 Nginx/Caddy 反代时才设 `true`（或 `MIAO_TRUST_PROXY=true`）。
  直接暴露公网却开着 trustProxy，任何人伪造 `X-Forwarded-For` 就能换 IP 绕过限流与封禁
- 反代之后记得让代理透传真实 IP，并把 `host` 保持 `127.0.0.1`，只允许反代访问

## 防爬虫手段（已实现，全部在后端）

> 前端不包含任何防爬/防脚本代码；所有拦截（UA 校验、蜜罐、限流、封禁、写操作签名）都在后端 `security.js` 与后台 `admin.js` 实施。
>
> **正文开放**：本站为开源教程站，**不登录也能浏览全部教程正文**（防爬靠限流与封禁，不靠登录门槛）。
> 登录仅用于：收藏 / 关注 / 好友 / 学习进度同步 / 发布教程。

| 层 | 手段 |
|---|---|
| 静态 | robots.txt 屏蔽 /api、/uploads、/server；前端静态目录**不含任何教程正文**，正文全部经 /api 下发 |
| 接入层 | 常见爬虫/无头浏览器 UA 拦截（python-requests/curl/Scrapy/Puppeteer…）；空 UA 拒绝 |
| 蜜罐 | 扫描 .env / wp-login / server/ 等敏感路径 → 记录，二次命中封 IP |
| 限流 | 按 IP 分桶滑窗：普通 GET 150/min、验证码 8/min、写操作 40/min、正文 240/min；超「封禁阈值」自动封 IP（默认 30 分钟） |
| 签名 | 写操作必须带 `X-Miao-Nonce` + `X-Miao-Sign`（HMAC-SHA256，密钥在 Cookie miao_ck），nonce 防重放 |
| 内容 | 正文按 `chapterWindow`（默认 2000 字）分窗下发；开源站阅读不限量，仅按 IP / 账号限制「每分钟最多 `docsPerMin`（默认 3）篇文档」防批量扒站，续读 offset 不计数 |
| 响应头 | CSP / nosniff / X-Frame-Options / Referrer-Policy 等 |
| 上传 | 图片 ≤1MB、真实格式校验（魔数）、SVG 拒绝脚本、展示图必须站内地址（防外链） |

## 账号体系（两种登录并存）

| 方式 | 说明 |
|---|---|
| 邮箱验证码 | 输入邮箱 → 收 6 位验证码 → 登录/注册（原有） |
| 用户名+密码 | 密码固定 **6 位数字**，存 `SHA-256(盐+密码)` 的 16 进制哈希，绝不明文 |

密码相关接口：
```
POST /api/auth/register          { name, pw, email? }  注册（用户名唯一）
POST /api/auth/password-login    { name, pw }           登录
POST /api/auth/set-password      { oldPw, newPw }       改密码（需已登录）
```

> 密码哈希用 Node 原生 `crypto` 的 SHA-256 + 随机盐，零第三方依赖；
> 校验用 `timingSafeEqual` 防时序攻击。

## 接口一览

完整文档：启动后访问 `GET /api/docs`（纯文本）。要点：

```
POST /api/auth/request-code {email}          发送验证码
POST /api/auth/verify       {email,code}     登录/注册（新用户 bootstrap 好友与粉丝）
GET  /api/me                                 当前用户 + 关注/粉丝/收藏/好友/作品计数
GET  /api/tutorials                          教程列表（不含正文）
GET  /api/tutorials/:id                      详情（未登录 locked）
GET  /api/tutorials/:id/chapters/:cid        章节正文（分窗下发，计浏览/配额）
POST /api/tutorials/:id/fav                  收藏 / DELETE 取消
POST /api/follow {name} / unfollow           关注（互关即好友）/ 取关
GET  /api/friends                            好友 + 申请 + 关注/粉丝列表
POST /api/friends/request|accept|ignore|remove
GET  /api/users/:name                        用户主页（关系 + 作品 + 计数）
GET/POST /api/my/works、DELETE /api/my/works/:id   我的作品
GET/PUT  /api/my/draft                       创作草稿
POST /api/upload {dataUrl}                   图片上传
POST /api/me/apply                           申请成为老师
```

## 测试

```bash
bash ../tests/run.sh      # 接口 + UI E2E + 后台管理，自动拉起/停止服务
```

- 测试一律用独立临时库（`MIAO_TEST_TMP` / `MIAO_DATA_DIR`），不会碰 `data/miao.db`
- 测试强制 `MIAO_NO_MAIL=1`，不会真的发信；用的都是 `xxx@miao.dev` 假邮箱
- 只想跑某一项：`node ../tests/api-test.js`、`node ../tests/ui-e2e.js`、`node ../tests/admin-test.js`

## 发布前自查（开源 / 上线必做）

```bash
node tools/check-secrets.js        # 扫密钥残留、真实邮箱/手机号、本机路径、遗留运行数据
bash ../tests/run.sh               # 全量回归（后端接口 + 前后端同源 UI + 后台管理）

bash tools/make-release.sh         # 一键导出「可安全公开」的发布副本
```

`check-secrets.js` 退出码：0 干净 / 2 仅提醒 / 1 有高危。它不会扫描 `.env`、`data/`、`uploads/`
（这些已被 `.gitignore` 排除），但会提醒它们是否存在 —— **用「复制目录」的方式发布时，务必手工排除**。

### 一键打包（推荐，别手工复制目录）

```bash
bash tools/make-release.sh                  # → <喵站根>/dist/miao-site-<版本>/ 与 .tar.gz
bash tools/make-release.sh --version 1.0.0  # 指定版本号
```

它会把 `.env` / `config.json` / `data/` / `uploads/` / `*.db` / 日志 / `.workbuddy` 全部挡在发布包外，
**打包前自动跑一次 `check-secrets.js`，只要发现任何高危项就直接失败并删掉产物** ——
比「手工复制再挑着删」可靠得多。

发布到开源平台时建议保留 `.env.example` 与 `config.example.json`，
不要提交 `.env`、`config.json`、`data/`、`uploads/`、`mail-outbox.log`。
