#!/usr/bin/env python
"""喵站 · 英语入门 · 候选读音转写（跑在 ASR 环境里，由 enword-pick.py 叫起来）

读一份 JSON（[{word, factor, file, want}]），逐条用本地 SenseVoice 转写，
写回 [{word, factor, heard}]。模型只加载一次，所以整批一次过。

跑法（一般由 enword-pick.py 自动调用）：
  python dev/tools/enword-asr-score.py <job.json> <out.json>
"""
import json
import os
import sys

import numpy as np
import sherpa_onnx
import soxr
import soundfile as sf

M = os.environ.get("MIAO_SENSEVOICE") or os.path.join(os.path.expanduser("~"), ".models", "sense-voice")
REC = sherpa_onnx.OfflineRecognizer.from_sense_voice(
    model=os.path.join(M, "model.int8.onnx"), tokens=os.path.join(M, "tokens.txt"),
    num_threads=6, sample_rate=16000, language="en", use_itn=False, provider="cpu")


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
    return "".join(ch for ch in st.result.text.lower() if ch.isalpha())


def main():
    job, out = sys.argv[1], sys.argv[2]
    rows = json.load(open(job, encoding="utf-8"))
    res = []
    for r in rows:
        heard = hear(r["file"])
        res.append({"word": r["word"], "factor": r["factor"], "heard": heard, "want": r.get("want", "")})
        print(f"   {r['word']}@{r['factor']} → {heard!r}", flush=True)
    json.dump(res, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    return 0


if __name__ == "__main__":
    sys.exit(main())
