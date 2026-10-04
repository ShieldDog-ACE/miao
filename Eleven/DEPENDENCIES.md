# Eleven · 依赖说明

## 结论：本项目「运行时」零依赖

后端（dev/backend/）只用 Node.js 内置模块：
`http / fs / path / url / crypto / node:sqlite`

**不需要安装任何 npm 包，也不需要 node_modules。**

唯一要求：Node ≥ 22.5（内置 node:sqlite）。本机已装 Node 22.22.2。

## 唯一的「工具依赖」（仅生成赞助二维码时用）

`tools/gen-donate-qr.py` 需要 3 个 Python 包（一次性生成，之后可删）：

| 包 | 用途 |
|---|---|
| qrcode | 生成二维码 |
| pillow | 图像处理 |
| zxing-cpp | 回验二维码可扫 |

安装命令（依赖统一放本 Eleven 目录）：

```bash
python3 -m venv Eleven/venv
Eleven/venv/bin/pip install -i https://mirrors.aliyun.com/pypi/simple/ --no-compile qrcode pillow zxing-cpp
Eleven/venv/bin/python dev/backend/tools/gen-donate-qr.py
```

> 提示：这些依赖只用于一次性生成二维码，装在哪个目录都行（例如 `<你的依赖目录>/venvs/miao-tools`），
> 二维码已经生成在 `dev/frontend/assets/img/donate-qr.png`，
> 换收款码时才需要重跑。
