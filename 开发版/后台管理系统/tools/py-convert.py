#!/usr/bin/env python3
"""把 学习资料/python入门/*.py 的四栏课式原稿转成喵站教程的块结构。

用法：改完原稿后依次跑
    python3 tools/py-convert.py     # 原稿 → .pywork/his.json
    python3 tools/py-gen.py         # his.json + 三节准备课 → ../py-data.js
    node tools/sync-python.js       # py-data.js → data/miao.db（不碰账号数据）
原稿目录不写死在本机：用环境变量 MIAO_PY_SRC 或第一个参数传进来。

他的格式：#任务名 / #要求 / # ==== / # 【小节】副题 / 注释即讲解 / 裸行即代码。


转换规则（踩过的坑都在这）：
  · 以 # 开头的行是讲解正文，连续行合成段落，空注释行分段；裸行合成 code 块。
  · 「# 后面其实是代码」（# print(x)  # ← TypeError）要留在代码块里，
    判据：形似代码 且（带 ← 标记 或 上一行本来就是代码）。光靠形似会把
    「input() 完全分不出真假……」这种散文误判成代码。
  · 段落里若有「整行只有箭头和空格」的标注线（↑  ↑），那是 ASCII 示意图，
    整段按 code(text) 输出，否则浏览器压扁空格，图就散了。
  · 段落首行是 1. / * / - 开头 → 按标记切成 ul，续行并入上一项。
  · 单独成段、缩进很深、且含 = 或 ( 的行 → 是他抄在注释里的示例代码，出 code。
  · 【本课一句话】不是小节，是收尾提示 → tip。
"""
import re, os, sys, json, ast

SRC = os.environ.get("MIAO_PY_SRC") or (sys.argv[1] if len(sys.argv) > 1 else "")
if not os.path.isdir(SRC):
    sys.exit("找不到原稿目录：请设 MIAO_PY_SRC=<学习资料/python入门 的路径> 或把它作为第一个参数传入")

mh_hint = lambda raw: HEAD.match(raw)
SEP  = re.compile(r'^#\s*[=＝]{6,}\s*$')
HEAD = re.compile(r'^#\s*【([^】]+)】\s*(.*)$')
TASK = re.compile(r'^#任务名\s+(\d+)\s+(.*)$')
NEED = re.compile(r'^#要求\s+(.*)$')
ONE  = re.compile(r'^#\s*【本课一句话】\s*(.*)$')
# 整行只有箭头 / 空格 / 制表画线 —— ASCII 图的标注行
ARROWLINE = re.compile(r'^\s*[↑↓←→↔↕│┌└┐┘├┤─═\s]+\s*$')
LISTMARK  = re.compile(r'^(?:[*•\-]|\d{1,2}[\.、])\s+')
CODEISH   = re.compile(
    r'^(?:'
    r'(?:print|return|import|from|if|elif|else|for|while|def|class|try|except|finally|with|raise|assert|lambda|yield|pass|break|continue|del)\b\s*[\(\w]'
    r'|[A-Za-z_][\w\.\[\]]*\s*(?:\[[^\]]*\])?\s*(?:=[^=]|\()'
    r')')

def parses(src):
    try:
        ast.parse(src); return True
    except SyntaxError:
        return False

def tidy_join(a, b):
    return a + ("" if a[-1:] in "，。；：、）" or not a else " ") + b

def looks_like_code(text):
    return bool(CODEISH.match(text.strip()))

def emit_paragraph(out, lines):
    """lines: 该段落的注释文本（已去掉 #），可能含空行以外的内容"""
    lines = [l.rstrip() for l in lines]
    while lines and not lines[0].strip(): lines.pop(0)
    while lines and not lines[-1].strip(): lines.pop()
    if not lines: return
    # ASCII 示意图：有整行只有箭头/画线，且不止一行
    if len(lines) > 1 and any(ARROWLINE.match(l) and l.strip() for l in lines):
        out.append({"t": "code", "lang": "text", "code": "\n".join(lines)})
        return
    # 缩进很深的单行示例代码
    if len(lines) == 1 and lines[0].startswith("   ") and re.search(r'[=\(\[:]', lines[0]):
        one = lines[0].strip()
        out.append({"t": "code", "lang": "python" if parses(one) else "text", "code": one})
        return
    # 段落前若干行是散文、后面才是项目符号 → 先切出散文段，剩下的按列表走
    for idx, l in enumerate(lines):
        if LISTMARK.match(l.strip()):
            if idx > 0:
                emit_paragraph(out, lines[:idx]); return emit_paragraph(out, lines[idx:])
            break
    # 列表：首行带 1. / * / - 之类的标记
    if LISTMARK.match(lines[0].strip()):
        items = []
        for l in lines:
            s = l.strip()
            m = LISTMARK.match(s)
            if m: items.append(s[m.end():])
            elif items: items[-1] += (" " if items[-1][-1:] in "，、（—" else "") + s
            else: items.append(s)
        items = [re.sub(r'\s+', ' ', x).strip() for x in items]
        if len(items) > 1:
            out.append({"t": "ul", "items": items}); return
        if items:
            out.append({"t": "p", "text": items[0]}); return
    # 普通段落：段内换行按中文习惯直接接起来
    text = re.sub(r'\s*\n\s*', '', "\n".join(lines)).strip()
    if text: out.append({"t": "p", "text": text})

BAD = []

def convert(path):
    lines = open(path, encoding="utf-8").read().split("\n")
    title = need = None
    summary = []
    blocks, code, para = [], [], []
    prev_was_code = False
    in_summary = False
    in_need = False

    def flush_code():
        nonlocal code
        keep = list(code)
        while keep and not keep[0].strip(): keep.pop(0)
        while keep and not keep[-1].strip(): keep.pop()
        if keep: blocks.append({"t": "code", "lang": "python", "code": "\n".join(keep)})
        code = []

    def flush_para():
        nonlocal para
        if para:
            emit_paragraph(blocks, para)
            para = []

    i = 0
    while i < len(lines):
        raw = lines[i]; i += 1
        m = TASK.match(raw)
        if m: title = m.group(2).strip(); prev_was_code = False; continue
        m = NEED.match(raw)
        if m:
            need = m.group(1).strip(); in_need = True; prev_was_code = False; continue
        if in_need:
            t2 = raw.lstrip()
            if t2.startswith("#") and not t2[1:].strip().startswith("!") and re.match(r'^#\s\S', t2) \
               and not HEAD.match(raw) and not SEP.match(raw) and not TASK.match(raw):
                need += tidy_join(need, t2[1:].strip()); prev_was_code = False; continue
            in_need = False
        m = ONE.match(raw)
        if m:
            flush_code(); flush_para()
            summary.append(m.group(1).strip()); in_summary = True; prev_was_code = False; continue
        if raw.strip().startswith("#") and SEP.match(raw):
            prev_was_code = False; continue
        if raw.strip().startswith("#"):
            text = raw.lstrip()[1:]
            if text.startswith(" "): text = text[1:]
            mh = HEAD.match(raw)
            if mh:
                flush_code(); flush_para()
                name, sub = mh.group(1).strip(), mh.group(2).strip()
                blocks.append({"t": "h2", "text": f"{name}：{sub}" if sub else name})
                prev_was_code = False; continue
            if not text.strip():
                flush_code(); flush_para(); in_summary = False
                prev_was_code = False; continue
            if in_summary and not mh_hint(raw):
                summary.append(text.strip()); prev_was_code = False; continue
            in_summary = False
            if looks_like_code(text) and ("←" in text or "→" in text or prev_was_code):
                # 这是他故意注释掉的演示行，# 必须保留，否则会变成真会跑的代码
                flush_para(); code.append(raw.rstrip())
                prev_was_code = True; continue
            flush_code(); para.append(text.rstrip())
            prev_was_code = False; continue
        if not raw.strip():
            if code: code.append("")
            else: flush_para()
            prev_was_code = False; continue
        flush_para(); code.append(raw.rstrip())
        prev_was_code = True

    flush_code(); flush_para()
    for b in blocks:
        if b["t"] == "code" and b["lang"] == "python" and not parses(b["code"]):
            BAD.append((os.path.basename(path), b["code"].split("\n")[0][:60]))
            b["lang"] = "text"
    if summary:
        text = re.sub(r'\s*\n\s*', '', "\n".join(summary)).strip()
        blocks.append({"t": "tip", "text": "本课一句话：" + re.sub(r'^[:：]\s*', '', text)})
    if need:
        blocks.insert(0, {"t": "tip", "text": f"本课目标：{need}"})
    return title, blocks

def main():
    files = {}
    for f in os.listdir(SRC):
        if not f.endswith(".py"): continue
        first = open(os.path.join(SRC, f), encoding="utf-8").readline()
        m = TASK.match(first)
        if m and int(m.group(1)) <= 45: files[int(m.group(1))] = os.path.join(SRC, f)
    out = {}
    total = 0
    for n in sorted(files):
        title, blocks = convert(files[n])
        out[n] = {"file": os.path.basename(files[n]), "title": title, "blocks": blocks}
        chars = sum(len(b.get("text", "") or b.get("code", "") or "".join(b.get("items", []))) for b in blocks)
        total += chars
        kinds = {}
        for b in blocks: kinds[b["t"]] = kinds.get(b["t"], 0) + 1
        tail = blocks[-1] if blocks else {}
        print(f"{n:>2} 字={chars:>5} blocks={len(blocks):>3} {kinds} 收尾={tail.get('t','')}")
    print("总字数:", total)
    print("降级为 text 的代码块:", len(BAD))
    for f, head in BAD: print("   ", f, "→", head)
    json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".pywork", "his.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

if __name__ == "__main__":
    main()
