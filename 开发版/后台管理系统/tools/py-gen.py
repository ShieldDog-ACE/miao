#!/usr/bin/env python3
"""生成 后台管理系统/py-data.js：3 节准备课（沿用已写正文）+ 他原稿的 45 课。"""
import json, re, os

WORK = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".pywork")
HIS  = json.load(open(os.path.join(WORK, "his.json"), encoding="utf-8"))
PREP = json.load(open(os.path.join(WORK, "prep.json"), encoding="utf-8"))
OUT  = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "py-data.js")
FIGSRC = json.load(open(os.path.join(WORK, "imgs.json"), encoding="utf-8"))

# 旧站内章节键 → 新章节 id（准备课 s01-s03 保持原位，他的课 l01-l45 插到原理末尾）
FIGMAP = {
    "c05": "l02", "c07": "l04", "c08": "l05", "c10": "l07", "c12": "l10",
    "c15": "l13", "c19": "l17", "c22": "l20", "c23": "l21", "c24": "l22",
    "c26": "l24", "c27": "l25", "c29": "l27", "c30": "l28", "c33": "l31",
    "c34": "l32", "c36": "l34", "c37": "l35", "c40": "l38", "c42": "l40",
    "c43": "l41", "c44": "l42", "c46": "l45",
}
TITLES = {"c01": "第 0 课 · Python 的历史", "c02": "第 0 课 · 安装 Python 解释器",
          "c03": "第 0 课 · 安装代码编辑器",
          "c012": None, "c022": None}   # 同一章的第二张图
NEWID  = {"c01": "s01", "c012": "s01b", "c02": "s02", "c022": "s02b", "c03": "s03"}

CJK_TAIL = "，。；：、）」』！？—…"
def tidy(x):
    x = re.sub(r'(?<=[%s]) (?=[\u4e00-\u9fff（「『])' % re.escape(CJK_TAIL), '', x)
    x = re.sub(r'(?<=[\u4e00-\u9fff）」』]) (?=[%s])' % re.escape(CJK_TAIL), '', x)
    return re.sub(r' {2,}', ' ', x).strip()

def clean(blocks):
    out = []
    for b in blocks:
        b = dict(b)
        if "text" in b: b["text"] = tidy(b["text"])
        if "items" in b: b["items"] = [tidy(i) for i in b["items"]]
        out.append(b)
    return out

figs = {}          # 新键 -> data URI
def add_fig(oldkey):
    key = NEWID.get(oldkey) or FIGMAP.get(oldkey)
    assert key, "没配图的旧键: " + oldkey
    assert key not in figs, "图键冲突: " + key
    figs[key] = FIGSRC[oldkey]["src"]
    return key

def insert_figs(blocks, keys):
    if not keys: return blocks
    pos = None
    for i, b in enumerate(blocks):
        if b["t"] == "h2" and b["text"].startswith("原理"):
            for j in range(i + 1, len(blocks)):
                if blocks[j]["t"] == "h2": pos = j; break
            break
    if pos is None: pos = len(blocks)
    return blocks[:pos] + [{"t": "img", "src": "@FIG:" + k, "alt": "示意图"} for k in keys] + blocks[pos:]

chapters = []
# ---- 准备课：沿用已写正文，只改课号与 id ----
for c in PREP:
    blocks = []
    for b in c["blocks"]:
        b = dict(b)
        if b["t"] == "img":
            old = b["src"].split(":", 1)[1]
            b["src"] = "@FIG:" + add_fig(old)
        blocks.append(b)
    nid = {"c01": "s01", "c02": "s02", "c03": "s03"}[c["id"]]
    chapters.append({"id": nid, "title": TITLES[c["id"]], "blocks": clean(blocks)})

# ---- 他的 45 课 ----
for n in sorted(HIS, key=int):
    h = HIS[n]
    oldkey = [k for k, v in FIGMAP.items() if v == "l%02d" % int(n)]
    keys = [add_fig(k) for k in oldkey]
    blocks = insert_figs(clean(h["blocks"]), keys)
    chapters.append({"id": "l%02d" % int(n), "title": "第 %d 课 · %s" % (int(n), h["title"]), "blocks": blocks})

def jesc(s):
    # 他正文里用反引号标内联代码；网站正文是纯文本，原样显示最清楚，
    # 只需在 JS 模板字符串里把 ` 和 ${ 转义掉。
    s = s.replace("\\", "\\\\")      # 先转反斜杠，否则 \\n 会被 JS 折叠成换行
    s = s.replace("`", "\\`")        # 再转反引号：文件里是 \`，模板串里表示一个 `
    s = s.replace("${", "\\${")      # 最后挡住模板插值
    return "`" + s + "`"

def dump_blocks(blocks, ind):
    out = []
    for b in blocks:
        t = b["t"]
        if t == "p":    out.append(f'{ind}{{ t: `p`, text: {jesc(b["text"])} }},')
        elif t == "h2": out.append(f'{ind}{{ t: `h2`, text: {jesc(b["text"])} }},')
        elif t == "tip":out.append(f'{ind}{{ t: `tip`, text: {jesc(b["text"])} }},')
        elif t == "ul": out.append(f'{ind}{{ t: `ul`, items: [\n' + "".join(f'{ind}  {jesc(i)},\n' for i in b["items"])[:-2] + f'\n{ind}]}},')
        elif t == "code": out.append(f'{ind}{{ t: `code`, lang: {jesc(b["lang"])}, code: {jesc(b["code"])} }},')
        elif t == "img":  out.append(f'{ind}{{ t: `img`, src: FIG.{b["src"].split(":",1)[1]}, alt: `示意图` }},')
    return "\n".join(out)

lines = ["""/* 喵站 · Python 教程数据（唯一来源）
 *
 * 48 章 = 3 节「第 0 课」准备课 + 他本人写的 45 课（id 为 l01…l45，课号与原稿一致，
 * 所以正文里「第 22 课讲过」这类交叉引用不用改写）。
 * seed-data.js 只通过 window.MIAO_PY.tutorial 引用本文件，前端不留副本。
 *
 * 改完正文要同步进数据库（正文存在 SQLite 里，只改本文件不生效）：
 *   node tools/sync-python.js
 *
 * 45 课的骨架来自原稿的四栏课式：【原理讲解】【假设它能干什么】【演示 N】
 * 【常见坑】【任务】【本课一句话】。转换脚本见 任务书.md 的记录。
 *
 * 块类型：p 段落 / h2 小标题 / tip 提示框 / ul 列表 / code 代码 / img 示意图。
 * 示意图集中在文件末尾的 FIG 表里，正文只写 FIG.键名。
 * 注意：所有字符串一律用反引号；内容里不能再出现反引号。
 */""", ""]

lines.append("/* 示意图：内联 SVG 的 data URI，集中放这里，正文只按 FIG.键名 引用。 */")
lines.append("const FIG = {")
for k, v in figs.items():
    lines.append(f"  {k}: `{v}`,")
lines.append("};")
lines.append("")
lines.append("window.MIAO_PY = {")
lines.append("  tutorial: {")
lines.append("    id: `python`,")
lines.append("    title: `Python 入门`,")
lines.append("    intro: `45 课从零学完 Python 基础：每课都讲原理、给能跑的演示、列常见坑、留课后任务。附三节准备课讲清解释器与装环境，正文全部可直接运行验证。`,")
lines.append("    cat: `python`,")
lines.append("    diff: `入门`,")
lines.append("    tags: [`python`, `零基础`, `入门`],")
lines.append("    author: `喵站官方`,")
# 封面是代码绘制的 SVG，重生成正文时别把它丢了（常设规则：每个教程都要专门做封面）
lines.append("    /* 封面由代码绘制，文件在 ../喵站/assets/img/covers/python.svg（改完刷新页面即可） */")
lines.append("    cover: `/assets/img/covers/python.svg`,")
lines.append("    chapters: [")
for c in chapters:
    lines.append(f"      {{ id: `{c['id']}`, title: {jesc(c['title'])}, blocks: [")
    lines.append(dump_blocks(c["blocks"], "        "))
    lines.append("      ]},")
lines.append("    ]")
lines.append("  }")
lines.append("};")

open(OUT, "w", encoding="utf-8").write("\n".join(lines) + "\n")
print("章节数:", len(chapters), "| 图:", len(figs), "| 文件大小:", len("\n".join(lines)))
