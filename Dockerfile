# 喵站 · 容器镜像（纯静态，没有后端）
#
# 构建（在仓库根执行，build context 必须是仓库根）：
#   docker build -t miao:1.3.0 .
#
# 跑：
#   docker run -d --name miao -p 127.0.0.1:8080:80 miao:1.3.0
#   浏览器打开 http://127.0.0.1:8080/
#
# ⚠️ 端口只绑 127.0.0.1，公网访问交给前面的 Nginx/Caddy 反代（HTTPS 也在那一层做）。
#    站点没有登录、没有写接口，容器里没有需要挂卷的数据：重建即全新，无状态。

FROM nginx:1.27-alpine

ENV LANG=C.UTF-8 LC_ALL=C.UTF-8

# 站点配置就地生成：deploy/ 目录已随删除后端一起消失，镜像不再依赖仓库里的任何配置文件。
# 用 printf 而不是 COPY <<EOF（heredoc 要 BuildKit），这样老版本 docker 也能构建。
#   gzip     —— 正文已拆到「一章一片」（最大单片 67 KB，整门课 3.6 MB），文本压下来约 1 : 2.7；
#              章级按需加载把请求数从「一门课 1 份」变成「几十份」，不压缩就白白多倍带宽。
#              gzip_vary/gzip_proxied 一起开：前面的反代与 CDN 也要拿到压缩版，不然它们会存原始那份
#   缓存口径 —— **性能优先**（2026-10-13 他原话「优先选择性能，不用问我」）：
#              · `assets/data/<子目录>/*.js`（正文分片与题库分片，就是那几十份大文件）给 1 小时 +
#                stale-while-revalidate 一天 —— 重复访问不再为正文跑几十次再验证，这是章级拆分后最大的一笔
#              · 其余 js/css 与 index.html、以及 `assets/data/*.js`（顶层那几份：site.js 目录、
#                index.js 清单、各门课的装配层）**一律 no-cache 走 ETag 再验证**：
#                它们仨是「加载契约」本身。留一份缓存就可能拿到「新装配层 + 旧目录」这种半套状态，
#                正文 stale 最多一小时无害，加载契约 stale 会白屏 —— 所以要卡死的就是这一格
#              · 图片和 mp3 给一天（改了也不改名，但它们不会让页面坏掉）
#              · 别写 immutable：改了却不换名的正文会躺在旧缓存里不动
RUN printf '%s\n' \
  'server {' \
  '  listen 80 default_server;' \
  '  server_name _;' \
  '  root /usr/share/nginx/html;' \
  '  index index.html;' \
  '  sendfile on;' \
  '  tcp_nopush on;' \
  '' \
  '  gzip on;' \
  '  gzip_min_length 1024;' \
  '  gzip_comp_level 6;' \
  '  gzip_vary on;' \
  '  gzip_proxied any;' \
  '  gzip_types text/plain text/css application/javascript application/json image/svg+xml;' \
  '' \
  '  # 站点是哈希路由，入口恒为 /；没有 /api，也不需要 SPA 回退。' \
  '  # 缺文件就让它 404，不要拿 index.html 冒充 —— MIME 不符会让浏览器拒执行，还掩盖真实错误。' \
  '  location /api/ { return 404; }' \
  '  location / { try_files $uri $uri/ =404; }' \
  '' \
  '  # 正文与题库的分片（assets/data/<一批>/xxx.js）：一小时新鲜，过期后先给旧的再后台取新的' \
  '  location ~* ^/assets/data/[^/]+/[^/]+\.js$ {' \
  '    add_header Cache-Control "public, max-age=3600, stale-while-revalidate=86400" always;' \
  '  }' \
  '  location ~* \.(?:js|css|html)$ { add_header Cache-Control "no-cache" always; }' \
  '  location ~* \.(?:png|jpg|jpeg|gif|webp|svg|ico|mp3|wav)$ {' \
  '    expires 1d;' \
  '    add_header Cache-Control "public, max-age=86400" always;' \
  '  }' \
  '}' \
  > /etc/nginx/conf.d/default.conf

# 站点本体：整个 frontend 目录就是全部产物
COPY dev/frontend/ /usr/share/nginx/html/

EXPOSE 80
