#!/usr/bin/env python
"""喵站 · 英语入门音频生成（单词 + 整句）

读词表 → IndexTTS-2.5 合成 → 裁静音/归一 → 存 MP3 → 写清单；已存在的 mp3 默认跳过。

环境变量：
  MIAO_TTS_APP       IndexTTS 工程目录（必填，内含 .venv 与 checkpoints）
  MIAO_TTS_VOICE     音色 wav，默认 <APP>/examples/voice_09.wav
  MIAO_ENWORDS_JSON  词表，默认 /tmp/miao-tts/enwords.json

跑法（用音频工具链的 venv）：
  node dev/tools/enword-words.js /tmp/miao-tts/enwords.json
  <工具链>/.venv/bin/python dev/tools/enword-tts.py [--mode sents] [--force] [--only apple,water]
"""
import argparse
import json
import os
import sys
import time

APP = os.environ.get("MIAO_TTS_APP")
if not APP:
    sys.exit("缺环境变量 MIAO_TTS_APP：指向 IndexTTS 工程目录（里面有 .venv 与 checkpoints）")

VOICE = os.environ.get("MIAO_TTS_VOICE") or os.path.join(APP, "examples/voice_09.wav")
WORDS_JSON = os.environ.get("MIAO_ENWORDS_JSON") or "/tmp/miao-tts/enwords.json"
DEV = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))    # …/dev
WORK = "/tmp/miao-tts/gen"
# kind → (落站点目录, 清单路径)
KINDS = {
    "words": (os.path.join(DEV, "frontend/assets/audio/words"), "/tmp/miao-tts/gen-manifest.json"),
    "sents": (os.path.join(DEV, "frontend/assets/audio/sents"), "/tmp/miao-tts/gen-sent-manifest.json"),
}
# 与站内 preset「米雪儿/鸿纱由美」同一套参数（webui 默认值），只换音色
GEN = dict(do_sample=True, top_p=0.8, top_k=30, temperature=0.8, length_penalty=0.0,
           num_beams=3, repetition_penalty=10.0, max_mel_tokens=1500)

sys.path.insert(0, APP)
os.chdir(APP)
os.environ["HF_HUB_CACHE"] = os.path.join(APP, "checkpoints", "hf_cache")

import numpy as np          # noqa: E402
import soundfile as sf      # noqa: E402


def clean(wav, sr, head_pad=0.10, tail_pad=0.20, rel=0.008):
    """裁首尾静音、去直流、峰值归一到 -1.5 dBFS。rel 是静音阈值占峰值的比例。"""
    a = np.asarray(wav, dtype="float32")
    if a.ndim > 1:
        a = a.mean(axis=1)
    a = a - float(np.mean(a))
    if not len(a):
        return a
    # 阈值取峰值的 0.8%：清辅音 /ʃ/ /t/ 起头本来就轻，取 2% 会把 shirt 的 sh、tea 的 t 一起裁掉
    idx = np.where(np.abs(a) > float(np.max(np.abs(a))) * rel)[0]
    if not len(idx):
        return np.zeros(0, dtype="float32")
    a = a[max(0, int(idx[0] - head_pad * sr)):int(idx[-1] + tail_pad * sr)]
    return (a * (0.841 / float(np.max(np.abs(a))))).astype("float32")


def read_json(path, default):
    if not os.path.exists(path):
        return default
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def build_plan(rows, out_dir, only, force):
    """rows 每条给 {key,label,text}，返回带 dst/skip 的计划；--only 指定的强制重做。"""
    plan = []
    for r in rows:
        dst = os.path.join(out_dir, r["key"] + ".mp3")
        if only and r["key"] not in only:
            continue
        plan.append({**r, "dst": dst, "skip": os.path.exists(dst) and not (force or only)})
    return plan


def synth(tts, plan, kind, manifest_path, factor):
    """按计划合成，逐条写清单，返回仍缺的条数。"""
    todo = [p for p in plan if not p["skip"]]
    print(f">> [{kind}] 共 {len(plan)} 条 · 跳过 {len(plan) - len(todo)} · 待生成 {len(todo)}", flush=True)
    manifest = read_json(manifest_path, {})
    t0 = time.time()
    for n, p in enumerate(todo, 1):
        raw = os.path.join(WORK, f"{kind}-{p['key']}.wav")
        try:
            tts.infer(spk_audio_prompt=VOICE, text=p["text"], output_path=raw, lang="EN",
                      emo_alpha=1.0, verbose=False, max_text_tokens_per_segment=120,
                      duration_factor=factor, **GEN)
            a, sr = sf.read(raw, dtype="float32")
            a = clean(a, sr)
            if len(a) < int(0.12 * sr):
                raise RuntimeError(f"裁完只剩 {len(a) / sr:.2f}s，怀疑是静音或截断")
            sf.write(p["dst"], a, sr, format="MP3")
            info = sf.info(p["dst"])
            rec = {"word": p["label"], "text": p["text"], "audio_s": round(info.duration, 2),
                   "sr": info.samplerate, "bytes": os.path.getsize(p["dst"]), "at": int(time.time())}
            manifest[p["key"]] = rec
            with open(manifest_path, "w", encoding="utf-8") as f:
                json.dump(manifest, f, ensure_ascii=False, indent=1)
            el = time.time() - t0
            print(f">> [{kind}] [{n}/{len(todo)}] {p['label']:12} {rec['audio_s']}s {rec['bytes']}B "
                  f"用时{el:.0f}s 预计剩 {el / n * (len(todo) - n):.0f}s", flush=True)
        except Exception as e:
            print(f"!! [{kind}] [{n}/{len(todo)}] {p['label']} 失败：{type(e).__name__}: {e}", flush=True)

    left = [p["key"] for p in plan if not os.path.exists(p["dst"])]
    print(f">> [{kind}] 收尾：缺 {len(left)} 条" + ("：" + " ".join(left[:20]) if left else ""), flush=True)
    return len(left)


def rows_for(kind, data):
    if kind == "words":
        return [{"key": w["w"].lower(), "label": w["w"], "text": w.get("say") or w["w"]}
                for w in data["words"]]
    return [{"key": s["key"], "label": s["key"], "text": s["text"]} for s in data.get("sents", [])]


def main():
    ap = argparse.ArgumentParser(description="喵站英语入门音频生成")
    ap.add_argument("--mode", choices=["words", "sents", "both"], default="both",
                    help="生成哪类音频（默认两类都生成）")
    ap.add_argument("--force", action="store_true", help="已存在的 mp3 也重做")
    ap.add_argument("--only", default="", help="只跑这几个词，逗号分隔（按词形小写匹配）")
    ap.add_argument("--factor", type=float, default=1.0,
                    help="duration_factor：>1 读得更慢。短词被 ASR 截断时用 1.25 重做一遍看看")
    ap.add_argument("--limit", type=int, default=0, help="最多跑几条（调试用）")
    args = ap.parse_args()

    data = read_json(WORDS_JSON, None)
    if data is None:
        sys.exit(f"词表不存在：{WORDS_JSON}，先跑 node dev/tools/enword-words.js")
    only = {w.strip().lower() for w in args.only.split(",") if w.strip()}
    os.makedirs(WORK, exist_ok=True)

    modes = ["words", "sents"] if args.mode == "both" else [args.mode]
    jobs = []
    for kind in modes:
        out_dir, manifest = KINDS[kind]
        os.makedirs(out_dir, exist_ok=True)
        plan = build_plan(rows_for(kind, data), out_dir, only, args.force)
        jobs.append((kind, plan[:args.limit] if args.limit else plan, manifest))

    from indextts.infer_v2_5 import IndexTTS2
    t0 = time.time()
    tts = IndexTTS2(cfg_path="checkpoints/config.yaml", model_dir="checkpoints",
                    use_bf16=False, device="cuda:0", use_deepspeed=False, use_accel=False,
                    use_torch_compile=False, use_qwen_emo=False)
    print(f">> 模型加载 {time.time() - t0:.1f}s", flush=True)

    missing = 0
    for kind, plan, manifest in jobs:
        if plan:
            missing += synth(tts, plan, kind, manifest, args.factor)
        else:
            print(f">> [{kind}] 没有要跑的条目", flush=True)

    print(f">> 清单在 {KINDS['words'][1]}（单词）与 {KINDS['sents'][1]}（整句）")
    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main())
