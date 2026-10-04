# 喵站 · 容器镜像
#
# 本项目「零依赖」——只用 Node 内置模块（http/fs/path/url/crypto/node:sqlite），
# 所以这里没有 npm install 这一步，镜像就是源码 + 官方 Node。
#
# 构建（务必在**仓库根目录**执行，build context 必须是仓库根，因为静态站点在 dev/frontend）：
#   docker build -t miao:1.0.0 .
#
# 前台（站点 + API，8787）：
#   docker run -d --name miao-web -p 127.0.0.1:8787:8787 \
#     --env-file dev/backend/.env -e MIAO_HOST=0.0.0.0 \
#     -v miao-data:/app/dev/backend/data miao:1.0.0
#
# 后台管理系统（8788，与前台共用同一个数据卷）：
#   docker run -d --name miao-admin -p 127.0.0.1:8788:8788 \
#     --env-file dev/backend/.env -e MIAO_ADMIN_HOST=0.0.0.0 \
#     -v miao-data:/app/dev/backend/data \
#     miao:1.0.0 node dev/backend/admin.js
#
# ⚠️ 端口只绑 127.0.0.1，交给 Nginx/Caddy 反代（并设 MIAO_TRUST_PROXY=true）。
#    直接 -p 8787:8787 暴露公网时，trustProxy 必须保持 false，否则伪造
#    X-Forwarded-For 就能绕过限流与封禁。

FROM node:22-slim

ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    NODE_NO_WARNINGS=1

WORKDIR /app

# 目录结构必须保持原样：config.js 用 ../../ 定位站点根，siteDir = <根>/dev/frontend
COPY dev/backend/ ./dev/backend/
COPY dev/frontend/ ./dev/frontend/

# 校验基础镜像的 Node 足够新（node:sqlite 需要 >= 22.5）
RUN node -e "require('node:sqlite')" \
 && mkdir -p "./dev/backend/data/uploads" \
 && chown -R node:node /app

USER node

# 数据库 + 上传图片都在这里；生产环境务必挂卷，否则容器重建即丢数据
VOLUME ["/app/dev/backend/data"]

EXPOSE 8787 8788

CMD ["node", "dev/backend/index.js"]
