#!/usr/bin/env python
"""喵站 · 英语入门 · 挑读音（两段式）

有些短词单独读时元音会被吞（tea 听着像 t）。这一段一次生成几个语速的候选，
再叫一遍 ASR 环境（tools/enword-asr-score.py，SenseVoice）判哪一条听得出是这个词，
只把赢的那条写进站点。

跑法（必须用音频工具链的 venv，它才有 torch）：
  export MIAO_TTS_APP=/路径/index-tts-code MIAO_TTS_VOICE="$MIAO_TTS_APP/examples/voice_09.wav"
  "$MIAO_TTS_APP/.venv/bin/python" dev/tools/enword-pick.py tea cow shoe
参数：
  --factors 1.0,1.3,...   候选语速，默认 1.0 1.3 1.5 1.7 2.0 2.2
  --keep                  把候选都留在 /tmp/miao-tts/pick 里，方便自己听
"""
import argparse
import importlib.util as ilu
import json
import os
import shutil
import subprocess
import sys

DEV = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))     # …/dev
APP = os.environ.get("MIAO_TTS_APP")
ASR_PY = os.environ.get("MIAO_ASR_PY", "python3")     # 装了 sherpa_onnx 那份 python
VOICE = os.environ.get("MIAO_TTS_VOICE") or ""
if not APP or not VOICE:
    sys.stderr.write("缺环境变量：MIAO_TTS_APP 指向 IndexTTS 工程目录；MIAO_TTS_VOICE 指向音色参考 wav\n")
    sys.exit(1)
OUT_DIR = os.path.join(DEV, "frontend", "assets", "audio", "words")
WORK = "/tmp/miao-tts/pick"
SCORER = os.path.join(DEV, "tools", "enword-asr-score.py")
WORDS_JSON = os.environ.get("MIAO_ENWORDS_JSON") or "/tmp/miao-tts/enwords.json"

sys.path.insert(0, APP)
os.chdir(APP)
os.environ["HF_HUB_CACHE"] = os.path.join(APP, "checkpoints", "hf_cache")

import soundfile as sf   # noqa: E402

# 裁静音/归一这套动作和生成脚本共用一份实现，别两处各写一遍
_spec = ilu.spec_from_file_location("enword_tts", os.path.join(DEV, "tools", "enword-tts.py"))
_tts = ilu.module_from_spec(_spec)
_spec.loader.exec_module(_tts)
clean = _tts.clean

GEN = dict(do_sample=True, top_p=0.8, top_k=30, temperature=0.8, length_penalty=0.0,
           num_beams=3, repetition_penalty=10.0, max_mel_tokens=1500)


def score(cands):
    """把候选交给 ASR 环境那份 python 判，返回 {(word,factor): 听到的串}"""
    job = "/tmp/miao-tts/pick-job.json"
    out = "/tmp/miao-tts/pick-out.json"
    json.dump(cands, open(job, "w", encoding="utf-8"), ensure_ascii=False)
    if os.path.exists(out):
        os.remove(out)
    r = subprocess.run([ASR_PY, SCORER, job, out], capture_output=True, text=True)
    if r.returncode != 0 or not os.path.exists(out):
        print("!! ASR 环境没跑成：" + (r.stderr or "")[-400:])
        sys.exit(1)
    return {f"{x['word']}@{x['factor']}": x["heard"] for x in json.load(open(out, encoding="utf-8"))}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("words", nargs="+", help="要重做的单词")
    ap.add_argument("--factors", default="1.0,1.3,1.5,1.7,2.0,2.2")
    ap.add_argument("--keep", action="store_true", help="候选全部留下不删")
    args = ap.parse_args()

    factors = [float(x) for x in args.factors.split(",")]
    os.makedirs(WORK, exist_ok=True)
    data = json.load(open(WORDS_JSON, encoding="utf-8"))
    want = {w.lower() for w in args.words}
    items = [w for w in data["words"] if w["w"].lower() in want]
    if not items:
        print("!! 词表里找不到这些词：" + " ".join(args.words))
        return 1

    from indextts.infer_v2_5 import IndexTTS2
    tts = IndexTTS2(cfg_path="checkpoints/config.yaml", model_dir="checkpoints", use_bf16=False,
                    device="cuda:0", use_deepspeed=False, use_accel=False,
                    use_torch_compile=False, use_qwen_emo=False)

    cands = []
    for w in items:
        name = w["w"].lower()
        target = (w.get("say") or w["w"]).lower()
        for f in factors:
            raw = os.path.join(WORK, f"{name}_{f}.wav")
            try:
                tts.infer(spk_audio_prompt=VOICE, text=target, output_path=raw, lang="EN",
                          emo_alpha=1.0, verbose=False, max_text_tokens_per_segment=120,
                          duration_factor=f, **GEN)
                a, sr = sf.read(raw, dtype="float32")
                a = clean(a, sr)
                if len(a) < int(0.12 * sr):
                    continue
                mp3 = os.path.join(WORK, f"{name}_{f}.mp3")
                sf.write(mp3, a, sr, format="MP3")
                cands.append({"word": w["w"], "factor": f, "file": mp3, "want": target,
                              "dur": round(len(a) / sr, 2)})
            except Exception as e:
                print(f"!! {w['w']}@{f} 生成失败：{type(e).__name__}: {e}", flush=True)
    print(f">> 候选 {len(cands)} 条，交给 ASR 判", flush=True)

    heard = score(cands)
    losers = []
    for w in items:
        name = w["w"].lower()
        target = (w.get("say") or w["w"]).lower()
        mine = [c for c in cands if c["word"] == w["w"]]
        win = next((c for c in mine if heard.get(f"{c['word']}@{c['factor']}", "").replace(" ", "") == target.replace(" ", "")), None)
        for c in mine:
            key = c["word"] + "@" + str(c["factor"])
            mark = "✓" if win and c["factor"] == win["factor"] else " "
            print("   %s %-8s factor=%-4s %ss → 听到 %r" % (mark, c["word"], c["factor"], c["dur"], heard.get(key, "")))
        if not win:
            losers.append(w["w"])
            continue
        dst = os.path.join(OUT_DIR, name + ".mp3")
        shutil.copyfile(win["file"], dst)
        print(f">> {w['w']} 采用 factor={win['factor']}（{os.path.relpath(dst, DEV)}）")
    if not args.keep:
        for c in cands:
            try: os.remove(c["file"])
            except OSError: pass
    print(f"\n== 挑完：{len(items) - len(losers)}/{len(items)} 听得出" +
          (f" · 仍不合格：{' '.join(losers)}（站点里保留的是之前那条）" if losers else " · 全部合格 =="))
    return 1 if losers else 0


if __name__ == "__main__":
    sys.exit(main())
