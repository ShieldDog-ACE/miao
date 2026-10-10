#!/usr/bin/env python
"""喵站 · 英语入门 · 单词音频 ASR 复核

把 frontend/assets/audio/words/*.mp3 逐条离线转写（SenseVoice，本地模型，不联网），
和词表里的目标单词比：全等算过，包含算半对（多半是尾音拖出杂字），其余算挂。
挂了就把清单写进 /tmp/miao-tts/asr-fail.json，交给 enword-tts.py --force --only 重做。

跑法（要一份装了 sherpa_onnx + soxr + soundfile 的 python）：
  python dev/tools/enword-asr-check.py
退出码：全对 0；有挂 1。
"""
import glob
import json
import os
import re
import sys

import numpy as np
import sherpa_onnx
import soxr
import soundfile as sf

DEV = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))     # …/dev
AUDIO = os.path.join(DEV, "frontend", "assets", "audio", "words")
WORDS_JSON = os.environ.get("MIAO_ENWORDS_JSON") or "/tmp/miao-tts/enwords.json"
FAIL_OUT = "/tmp/miao-tts/asr-fail.json"
# SenseVoice 的本地模型（不联网）；换机器只需要给这一个环境变量
M = os.environ.get("MIAO_SENSEVOICE") or os.path.join(os.path.expanduser("~"), ".models", "sense-voice")

REC = sherpa_onnx.OfflineRecognizer.from_sense_voice(
    model=os.path.join(M, "model.int8.onnx"), tokens=os.path.join(M, "tokens.txt"),
    num_threads=6, sample_rate=16000, language="", use_itn=False, provider="cpu")


def norm(s):
    return re.sub(r"[^a-z ]", "", (s or "").lower()).strip()


# 同音词与复数：ASR 只能给出一种拼写，听到的是同一个音就不算读错。
# 这份表只收「英语里本来就同音」或「ASR 常见的尾巴差异」，不收 mouth→mouse 这类真读偏的。
HOMOPHONES = {
    "eye": ["i", "aye", "ai"],
    "i": ["eye", "aye", "ai"],
    "pear": ["pair", "pare"],
    "write": ["right", "rite"],
    "son": ["sun"],
    "hour": ["our"],
    "tea": ["tee"],
    "they": ["the day", "they're", "their"],
    "student": ["students"],
    "one": ["won"],
    "to": ["two", "too"],
    "four": ["for"],
    "grape": ["grape"],
}


# 孤立短词是这套 ASR 的死角：单独一句 /tiː/ 它只写得出 "t"，
# 同一句放进 "a cup of tea" 里就写对了（实测见 dev/任务书.md）。这种判不了，不许算读错，
# 单独列成「要人耳过一遍」的名单。
def accepted(word, hyp):
    w = norm(word)
    if hyp == w:
        return "exact"
    if hyp in [norm(x) for x in HOMOPHONES.get(w, [])]:
        return "homo"
    if hyp == w + "s" or hyp + "s" == w:      # 词尾 s 是 ASR 常加的
        return "homo"
    if len(w) <= 4 and hyp and w.startswith(hyp.split(" ")[0]):
        return "short"
    return "bad"


def hear(path):
    a, sr = sf.read(path, dtype="float32")
    if a.ndim > 1:
        a = a.mean(axis=1)
    if sr != 16000:
        a = soxr.resample(a, sr, 16000).astype("float32")
    st = REC.create_stream()
    st.accept_waveform(16000, a)
    st.accept_waveform(16000, np.zeros(0, dtype="float32"))
    REC.decode_stream(st)
    return st.result.text


def lev(a, b):
    prev = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        cur = [i]
        for j, cb in enumerate(b, 1):
            cur.append(min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (ca != cb)))
        prev = cur
    return prev[-1]


data = json.load(open(WORDS_JSON, encoding="utf-8"))
rows, bad = [], []
files = sorted(glob.glob(os.path.join(AUDIO, "*.mp3")))
print(f">> 待核 {len(files)} 条 · 词表 {len(data['words'])} 词")

for p in files:
    name = os.path.splitext(os.path.basename(p))[0]
    entry = next((w for w in data["words"] if w["w"].lower() == name), None)
    want = norm((entry.get("say") or entry["w"]) if entry else name)
    hyp = norm(hear(p))
    dur = sf.info(p).duration
    verdict = accepted(want, hyp)
    ed = lev(hyp.replace(" ", ""), want.replace(" ", ""))
    rows.append({"word": entry["w"] if entry else name, "file": os.path.basename(p),
                 "hyp": hyp, "verdict": verdict, "edit": ed, "dur_s": round(dur, 2)})
    flag = {"exact": "对 ", "homo": "同 ", "short": "短 ", "bad": "挂 "}[verdict]
    if verdict == "bad":
        bad.append(entry["w"] if entry else name)
    print(f"  {flag}{entry['w'] if entry else name:14} {dur:.2f}s  听到「{hyp}」 编辑距离 {ed}", flush=True)

ok = sum(1 for r in rows if r["verdict"] == "exact")
homo = sum(1 for r in rows if r["verdict"] == "homo")
short = [r["word"] for r in rows if r["verdict"] == "short"]
print(f"\n== 转写全等 {ok}/{len(rows)} · 同音/复数放过 {homo} · 孤立短词判不了 {len(short)} · 需重做 {len(bad)} ==")
if short:
    print(">> 这一批要人耳过一遍（ASR 在孤立短词上只写出前缀）：" + " ".join(short))
if bad:
    print(">> 重做名单：" + " ".join(bad))
    json.dump({"fail": bad}, open(FAIL_OUT, "w"), ensure_ascii=False)
json.dump(rows, open("/tmp/miao-tts/asr-check.json", "w"), ensure_ascii=False, indent=1)
missing = sorted({w["w"].lower() for w in data["words"]} - {os.path.splitext(os.path.basename(f))[0] for f in files})
if missing:
    print(f"!! 词表里有 {len(missing)} 个词还没音频：" + " ".join(missing[:20]))
sys.exit(0 if ok + homo + len(short) == len(rows) and not missing else 1)
