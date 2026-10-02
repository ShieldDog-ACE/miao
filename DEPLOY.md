# 喵站 · 部署与开源托管指南

> 面向「想让别人能访问到这个网站」的完整路径。读完你应该知道自己该选哪条路，
> 以及每一步敲什么命令。

---

## 0. 先破一个误解：**GitHub Pages / Gitee Pages 跑不了喵站**

很多人说的「开源平台托管网站」= GitHub Pages / Gitee Pages / Vercel / Netlify。
**这些对喵站都不适用**，原因很硬：

| 喵站需要什么 | 静态托管能给什么 |
|---|---|
| 一个**常驻的 Node 进程**（≥22.5，用内置 `node:sqlite`） | 只发静态文件，不跑进程 |
| **可写的持久磁盘**（`data/miao.db` 是登录、教程、收藏、上传图片） | 文件系统只读，且每次部署清空 |
| **两个端口**（8787 前台 / 8788 后台） | 通常只暴露一个端口 |
| 邮箱验证码、限流封禁、HMAC 签名（都要后端在跑） | 无后端 |

把喵站塞进 Pages 的结果：首页能打开，但**任何接口都是 404，注册登录收藏全废**。

所以「开源托管」这件事要拆成**两件独立的事**：

- **A. 代码开源**：把源码放到 GitHub / Gitee，别人能看到、能 star、能提 issue。
- **B. 网站上线**：找一台能跑常驻进程 + 挂持久盘的机器，把服务跑起来。

两件事互不依赖，顺序随意。

---

## 1. 选哪条路跑网站

| 路径 | 费用 | 国内访问 | 后台 8788 | 数据持久 | 难度 | 适合 |
|---|---|---|---|---|---|---|
| **A. 云服务器 + Nginx + systemd** | 新用户轻量 2C2G 约 50–100 元/年；境外 VPS 约 $10–20/年 | 国内节点很快 | ✅ 随便开 | ✅ | 中 | **推荐**，本项目就是照这个架构设计的 |
| **B. 容器 PaaS**（Zeabur / Render / Railway / Koyeb） | 有免费额度，超了要钱 | 一般 | ⚠️ 要额外想办法（单端口 + 免费层无共享盘） | ⚠️ 免费层重启易丢 | 低 | 想先白嫖看看效果 |
| **C. 家里机器 + Cloudflare Tunnel** | 0（电费） | 一般 | ✅ | ✅ | 中 | 有闲置机器、能长期开机 |
| ~~D. Pages 静态托管~~ | — | — | — | — | — | **跑不了，见第 0 节** |

**我的建议：走 A。** 你不用一次性买一年，腾讯云/阿里云都有「按量/一月」的轻量套餐，
先买一个月跑通，觉得行再续。境外节点（如 RackNerd、Vultr）不用备案，但国内访问慢一些。

> **备案说明**：中国大陆的服务器，如果用**域名**对外提供 80/443 服务，法规上需要 ICP 备案。
> 只用 **IP:端口** 直接访问、或部署在**境外节点**，则不涉及备案。
> 之前我们说「备案不用管」就是指后者 —— 页脚不会有备案号，那是正常的。

---

## 2. 路径 A：云服务器部署（推荐）

### 2.1 买机器 & 初始设置

买一台 Ubuntu 22.04/24.04 的轻量应用服务器（2 核 2G 就够）。
在控制台**安全组**里放行：`22`（SSH）、`80`、`443`。

```bash
ssh root@你的服务器IP
```

### 2.2 装 Node 22（必须 ≥ 22.5，否则 `node:sqlite` 不存在）

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs
node -v                                   # 应显示 v22.x
node -e "require('node:sqlite')" && echo "sqlite OK"
```

> 国内服务器如果 NodeSource 拉不动，改用清华镜像：
> `curl -fsSL https://mirrors.tuna.tsinghua.edu.cn/nodesource/deb_22.x/nsource-repo.sh | bash`
> 或直接从 nodejs.org 的镜像下 `.tar.xz` 解压到 `/usr/local`。

### 2.3 建服务账号 & 放代码

```bash
useradd --system --home /opt/miao --shell /usr/sbin/nologin miao
mkdir -p /opt/miao
```

把代码传上去（二选一）：

```bash
# 方式一：从你的仓库克隆
apt-get install -y git
git clone <你的仓库地址> /opt/miao

# 方式二：从本地推（在你自己电脑上执行）
rsync -av --exclude data --exclude .env ./  root@服务器IP:/opt/miao/
```

```bash
chown -R miao:miao /opt/miao
```

### 2.4 生成密钥文件 `.env`

```bash
cd /opt/miao/开发版/后台管理系统
cp .env.example .env

# 生成一个随机后台口令填进去
echo "MIAO_ADMIN_PASS=$(head -c 24 /dev/urandom | base64 | tr -d '/+=' | head -c 16)"

nano .env      # 填 MIAO_ADMIN_PASS；SMTP_* 可选（不填则验证码打到日志里）
chmod 600 .env && chown miao:miao .env
```

`.env` 关键项：

```ini
MIAO_ADMIN_PASS=你刚生成的口令
SMTP_HOST=smtp.163.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=你的邮箱@163.com
SMTP_PASS=邮箱授权码            # 不填就退化成「开发模式」，验证码打印到日志
MIAO_TRUST_PROXY=true          # ⚠️ 挂了 Nginx 反代才设 true
```

### 2.5 注册 systemd 服务

仓库里已经准备好了两个单元文件：

```bash
cd /opt/miao
cp deploy/miao-web.service deploy/miao-admin.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now miao-web miao-admin
systemctl status miao-web --no-pager
journalctl -u miao-web -f          # 看实时日志，Ctrl+C 退出
```

看到 `喵站后端已启动` 就说明服务活了。

> 如果你不想建 `miao` 账号，把两个 `.service` 里的 `User=miao` / `Group=miao`
> 改成你的登录用户名，并 `chown -R 你的用户名: /opt/miao` 即可。

### 2.6 装 Nginx 做反代

```bash
apt-get install -y nginx
cp /opt/miao/deploy/nginx.miao.conf /etc/nginx/sites-available/miao
ln -sf /etc/nginx/sites-available/miao /etc/nginx/sites-enabled/miao
rm -f /etc/nginx/sites-enabled/default
nano /etc/nginx/sites-available/miao        # 把 miao.example.com 换成你的域名或 IP
nginx -t && systemctl reload nginx
```

**没域名也行** —— 把 `server_name` 改成 `_`，直接 `http://服务器IP/` 访问。

### 2.7 放行防火墙

```bash
ufw allow 22 && ufw allow 80 && ufw allow 443 && ufw enable
```

**到此网站就能被访问了。** 后台管理走 SSH 隧道最省事：

```bash
# 在你自己的电脑上执行
ssh -N -L 8788:127.0.0.1:8788 root@服务器IP
# 然后浏览器打开 http://127.0.0.1:8788/ ，用 MIAO_ADMIN_PASS 登录
```

---

## 3. 路径 B：容器 PaaS / Docker

仓库根目录已经有 `Dockerfile` 和 `.dockerignore`（后者是安全红线：确保 `.env`、`data/`
不会被打进镜像）。

### 3.1 先在本机验证镜像

```bash
docker build -t miao:1.0.0 .
docker run --rm -p 8787:8787 -e MIAO_HOST=0.0.0.0 \
  -v miao-data:/app/开发版/后台管理系统/data miao:1.0.0
curl -s --noproxy '*' http://127.0.0.1:8787/api/health
```

### 3.2 部署到 PaaS

Zeabur / Render / Koyeb 之类都支持「连 Git 仓库 → 用 Dockerfile 构建」。
在平台里：

1. 新建服务 → 选你的仓库 → 构建方式选 **Dockerfile**
2. **环境变量**里填：`MIAO_HOST=0.0.0.0`、`MIAO_ADMIN_PASS=...`、`SMTP_PASS=...`、
   `MIAO_TRUST_PROXY=false`（PaaS 一般直接暴露，不是自己挂的反代）
3. **必须挂持久卷**到 `/app/开发版/后台管理系统/data`，否则每次重启 = 数据清空
4. 记录平台给你的域名

⚠️ **PaaS 的两个坑**，先想清楚再选：

- **后台 8788 没法直接访问** —— PaaS 通常只暴露一个端口。
  办法：把后台程序单独再部署一个服务（但不共享磁盘），或者干脆**在自己电脑上本地跑后台**、
  通过 SSH 隧道连服务器上的库。真要用，见 `deploy/miao-admin.service` 里的说明。
- **免费额度**大多会「闲置休眠」或限制磁盘，一旦容器重建，`data/` 就没了。定期备份。

---

## 4. 路径 C：家里机器 + Cloudflare Tunnel

适合「机器常年开着、不想花钱」的情况。

```bash
# 装 cloudflared
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cf.deb
sudo dpkg -i cf.deb

# 登录并建隧道（会给你一个 *.trycloudflare.com 免费域名，或绑自己的域名）
cloudflared tunnel login
cloudflared tunnel create miao
cloudflared tunnel route dns miao miao.example.com
cloudflared tunnel run --url http://127.0.0.1:8787 miao
```

配合本机 systemd（同路径 A 的 2.5 节）就能常驻。

优点：0 成本、不用公网 IP、免备案。
缺点：**家里机器得一直开着**；家里宽带上行带宽就是网站的上限。
你机器上还在跑 LoRA 训练，建议评估一下再决定。

---

## 5. 上线后必做清单

- [ ] **改掉后台口令**：`MIAO_ADMIN_PASS` 不能是示例值
- [ ] **`MIAO_TRUST_PROXY` 对应设置**：挂了反代 → `true`；直接暴露 → `false`
      （设错方向都有问题：该 true 没 true，限流会把所有人算成一个 IP；
        该 false 设了 true，伪造 `X-Forwarded-For` 就能绕过封禁）
- [ ] **`autoApproveTeacher`**：正式站点设 `false` 走人工审核，
      否则任何人申请老师都立刻通过
- [ ] **`seedDemo`**：正式站点建议 `false`（全新库，首个注册用户 ID=0）
- [ ] **配好 SMTP**，否则新用户收不到验证码（只打日志）
- [ ] **定期备份 `data/`**：库里是全部账号与教程正文
      ```bash
      systemctl stop miao-web miao-admin
      sqlite3 data/miao.db "PRAGMA wal_checkpoint(TRUNCATE);"
      tar czf miao-backup-$(date +%F).tar.gz -C data miao.db uploads
      systemctl start miao-web miao-admin
      ```
- [ ] 跑一次 `node tools/check-secrets.js`，确认没有密钥泄漏

---

## 6. 代码开源（跟网站上线独立）

### 6.1 本地准备

`dist/` 里已经有经过自查的干净副本，也可以直接用 `dist/miao-site-1.0.0/`。
若要在源码树里直接开仓库，先在仓库根加一个 `.gitignore` 排除内部目录
（`.workbuddy/`、`.Trash-0/`、`dist/`）。

### 6.2 推到 GitHub

```bash
git init
git add -A
git status                 # ⚠️ 重点检查：不能出现 .env / config.json / data/ / *.db
git commit -m "喵站 v1.0.0 · 开源教程站"

git remote add origin git@github.com:ShieldDog-ACE/<仓库名>.git
git push -u origin main
```

推完在网页上补：仓库简介、topics（`nodejs` `sqlite` `zero-dependencies` `tutorial-site`）、
LICENSE、README 顶部加一张截图。

### 6.3 想用 Gitee

Gitee 国内访问快，但需要你先在 Gitee 建好仓库，再用同样方式 push。
注意 Gitee 免费仓库默认是**私有**的，要在设置里手动改成开源。

---

## 7. 常见问题

**Q：首页能开，但所有功能都报错？**
八成是后端没起来。`systemctl status miao-web` / `journalctl -u miao-web -n 50` 看日志。

**Q：启动报 `No such built-in module: node:sqlite`？**
Node 版本低于 22.5。`node -v` 确认，按 2.2 节重装。

**Q：注册收不到验证码？**
没配 `SMTP_PASS` 时验证码会打到日志：`journalctl -u miao-web | grep 验证码`。
配了还是收不到，检查 163/QQ 后台是否开了 SMTP 服务、授权码是否过期。

**Q：改了 `seed-data.js` 但网站内容没变？**
正常现象。教程正文存在 SQLite 里，改种子只影响**建库那一刻**。
详见 `开发版/后台管理系统/README.md` 的「教程正文改完为什么不生效」。

**Q：数据丢了怎么办？**
`data/miao.db` 就是全部。没有备份就没了 —— 所以第 5 节的备份项务必设成定时任务。
