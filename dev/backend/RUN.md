首次运行：

```bash
cp .env.example .env        # 填 Node 路径 / 邮箱授权码 / 后台口令（.env 不入库）
```

日常：

```bash
bash start.sh         # 启动后端系统  → http://127.0.0.1:8787/
bash start-admin.sh   # 启动管理系统  → http://127.0.0.1:8788/
bash stop.sh          # 两个一起关
bash reset-data.sh    # 清空数据库并重新导入 seed-data.js（先自动备份旧库）
```

发布 / 开源托管：

```bash
bash tools/make-release.sh   # 一键导出干净发布副本 + tar.gz（自动排除 .env / data / config.json）
```

详细说明见 README.md。
