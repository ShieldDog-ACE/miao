#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
喵站 · 赞助二维码生成器（代码实现，不使用原始截图）
用法：改 PAYLOAD 后运行  python3 gen-donate-qr.py
输出：dev/frontend/assets/img/donate-qr.png（页脚「赞助」弹层懒加载此文件）
依赖（仅生成时需要，运行时零依赖）：pip install qrcode pillow
可选校验：pip install zxing-cpp  → 生成后自动回验扫码内容与 PAYLOAD 一致
"""
import os

# ★ 微信收款码内容（由原始收款码截图解码得到；换码时改这里重跑即可）
PAYLOAD = "wxp://f2f0AacGcPUAGXVZnqyZ_4dc1-_2Sib3eTN9mAvoYGyU5CuI5jlSqR3Xx9pPqK_m_lC2"

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..",
                   "dev", "frontend", "assets", "img", "donate-qr.png")

import qrcode

qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=12, border=2)
qr.add_data(PAYLOAD)
qr.make(fit=True)
os.makedirs(os.path.dirname(OUT), exist_ok=True)
img = qr.make_image(fill_color="#1f2329", back_color="#ffffff")
img.save(OUT)
print("已生成:", os.path.normpath(OUT), img.size)

# 回验：生成的码必须扫出与 PAYLOAD 相同的内容（保证扫码可支付）
try:
    from PIL import Image
    import zxingcpp
    got = zxingcpp.read_barcode(Image.open(OUT))
    ok = got and got.text == PAYLOAD
    print("回验:", "通过 ✔ 扫码内容一致" if ok else "失败 ✘ " + (got.text if got else "无法解码"))
    raise SystemExit(0 if ok else 2)
except ImportError:
    print("（未安装 zxing-cpp，跳过回验）")
