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
#   gzip     —— 正文是 540KB 级的 *-data.js，不压缩首屏要吃满带宽
#   缓存口径 —— 正文/题库/音频都沿用原文件名更新（改 l25 的题干不会换 py-data.js 的名字），
#              所以 js/css/html 一律 no-cache 走 ETag 再验证，只有图片和 mp3 给一天；
#              别在这里写 immutable，那会让改了却不改名的教程正文在旧缓存里躺着不动。
RUN printf '%s\n' \
  'server {' \
  '  listen 80 default_server;' \
  '  server_name _;' \
  '  root /usr/share/nginx/html;' \
  '  index index.html;' \
  '' \
  '  gzip on;' \
  '  gzip_min_length 1024;' \
  '  gzip_comp_level 6;' \
  '  gzip_types text/plain text/css application/javascript application/json image/svg+xml;' \
  '' \
  '  # 站点是哈希路由，入口恒为 /；没有 /api，也不需要 SPA 回退。' \
  '  # 缺文件就让它 404，不要拿 index.html 冒充 —— MIME 不符会让浏览器拒执行，还掩盖真实错误。' \
  '  location /api/ { return 404; }' \
  '  location / { try_files $uri $uri/ =404; }' \
  '' \
  '  location ~* \.(?:js|css|html)$ { add_header Cache-Control "no-cache"; }' \
  '  location ~* \.(?:png|jpg|jpeg|gif|webp|svg|ico|mp3|wav)$ {' \
  '    expires 1d;' \
  '    add_header Cache-Control "public, max-age=86400";' \
  '  }' \
  '}' \
  > /etc/nginx/conf.d/default.conf

# 站点本体：整个 frontend 目录就是全部产物
COPY dev/frontend/ /usr/share/nginx/html/

EXPOSE 80
