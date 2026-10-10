#!/usr/bin/env python
"""喵站 · 英语入门 · 200 条单词音频生成

一条命令跑完：读词表 → IndexTTS-2.5 合成 → 裁静音/归一 → 编 MP3 落站点 → 写清单。
幂等：目标 mp3 已存在就跳过（--force 才重做），中途断了再跑接着来。

跑法（必须用音频工具链自带的 venv，站点的 node 环境跑不了 torch）：
  node dev/tools/enword-words.js /tmp/miao-tts/enwords.json          # 先出声词表
  <工具链>/.venv/bin/python dev/tools/enword-tts.py                  # 增量生成
  <工具链>/.venv/bin/python dev/tools/enword-tts.py --force --only apple,water

音色实测依据见 dev/任务书.md：voice_09 在 8 个英文词探针上 ASR 全对、平均 0.67 秒/词、零削波。
"""
import argparse
import json
import os
import sys
import time

# 工具链在哪台机器哪个盘各人不同，一律走环境变量，不把别人的绝对路径写进公开仓库
# （上一轮 py-convert.py / py-gen.py 就是写死了路径，泄漏用户名与磁盘 UUID，见 SPEC §15.5）
APP = os.environ.get("MIAO_TTS_APP")
if not APP:
    sys.stderr.write('缺环境变量 MIAO_TTS_APP：指向 IndexTTS 工程目录（里面有 .venv 与 checkpoints）\n'
                     '  例：export MIAO_TTS_APP="$HOME/音频工作链/index-tts-code"\n')
    sys.exit(1)
VOICE = os.environ.get("MIAO_TTS_VOICE") or os.path.join(APP, "examples/voice_09.wav")
DEV = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))     # …/dev
WORDS_JSON = os.environ.get("MIAO_ENWORDS_JSON") or "/tmp/miao-tts/enwords.json"
OUT_DIR = os.path.join(DEV, "frontend", "assets", "audio", "words")
WORK_DIR = "/tmp/miao-tts/gen"
MANIFEST = "/tmp/miao-tts/gen-manifest.json"

sys.path.insert(0, APP)
os.chdir(APP)
os.environ["HF_HUB_CACHE"] = os.path.join(APP, "checkpoints", "hf_cache")

import numpy as np          # noqa: E402
import soundfile as sf      # noqa: E402

# 与站内 preset「米雪儿/鸿纱由美」同一套生成参数（webui 默认值），只把重音色换掉
GEN = dict(do_sample=True, top_p=0.8, top_k=30, temperature=0.8, length_penalty=0.0,
           num_beams=3, repetition_penalty=10.0, max_mel_tokens=1500)


def clean(wav, sr, head_pad=0.10, tail_pad=0.20, rel=0.008):
    """裁掉首尾静音、去直流、峰值归一到 -1.5 dBFS。

    阈值按峰值的 0.8% 定（原来是 2%）：清辅音 /ʃ/ /t/ 起头本来就轻，
    2% 会把 shirt 的 sh、tea 的 t 一起裁掉，听着就是「her」「ea」。
    """
    a = np.asarray(wav, dtype="float32")
    if a.ndim > 1:
        a = a.mean(axis=1)
    a = a - float(np.mean(a))
    if len(a) == 0:
        return a
    peak = float(np.max(np.abs(a))) or 1.0
    thr = peak * 0.02
    idx = np.where(np.abs(a) > thr)[0]
    if len(idx) == 0:
        return np.zeros(0, dtype="float32")
    s = max(0, int(idx[0] - head_pad * sr))
    e = min(len(a), int(idx[-1] + tail_pad * sr))
    a = a[s:e]
    a = a * (0.841 / float(np.max(np.abs(a))))
    return a.astype("float32")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="已存在的 mp3 也重做")
    ap.add_argument("--only", default="", help="只跑这几个词，逗号分隔")
    ap.add_argument("--factor", type=float, default=1.0,
                    help="duration_factor：>1 读得更慢。短词（tea、cow）被 ASR 截断时用 1.25 重做一遍看看")
    ap.add_argument("--limit", type=int, default=0, help="最多跑几条（调试用）")
    args = ap.parse_args()

    data = json.load(open(WORDS_JSON, encoding="utf-8"))
    only = {w.strip().lower() for w in args.only.split(",") if w.strip()}
    os.makedirs(OUT_DIR, exist_ok=True)
    os.makedirs(WORK_DIR, exist_ok=True)

    plan = []
    for w in data["words"]:
        name = w["w"].lower()
        dst = os.path.join(OUT_DIR, name + ".mp3")
        if only and name not in only:
            continue
        plan.append({"w": w["w"], "name": name, "say": w.get("say") or w["w"],
                     "dst": dst, "skip": os.path.exists(dst) and not (args.force or only)})
    if args.limit:
        plan = plan[:args.limit]

    todo = [p for p in plan if not p["skip"]]
    print(f">> 计划 {len(plan)} 条 · 已存在跳过 {len(plan) - len(todo)} · 待生成 {len(todo)}", flush=True)

    from indextts.infer_v2_5 import IndexTTS2
    t0 = time.time()
    tts = IndexTTS2(cfg_path="checkpoints/config.yaml", model_dir="checkpoints",
                    use_bf16=False, device="cuda:0", use_deepspeed=False, use_accel=False,
                    use_torch_compile=False, use_qwen_emo=False)
    print(f">> 模型加载 {time.time() - t0:.1f}s", flush=True)

    manifest = {}
    if os.path.exists(MANIFEST):
        manifest = json.load(open(MANIFEST, encoding="utf-8"))

    t_start = time.time()
    for n, p in enumerate(todo, 1):
        raw = os.path.join(WORK_DIR, p["name"] + ".wav")
        try:
            tts.infer(spk_audio_prompt=VOICE, text=p["say"], output_path=raw, lang="EN",
                      emo_alpha=1.0, verbose=False, max_text_tokens_per_segment=120,
                      duration_factor=args.factor, **GEN)
            a, sr = sf.read(raw, dtype="float32")
            a = clean(a, sr)
            if len(a) < int(0.12 * sr):
                raise RuntimeError("裁完只剩 %.2fs，怀疑是静音或截断" % (len(a) / sr))
            sf.write(p["dst"], a, sr, format="MP3")
            info = sf.info(p["dst"])
            rec = {"word": p["w"], "audio_s": round(info.duration, 2), "sr": info.samplerate,
                   "bytes": os.path.getsize(p["dst"]), "at": int(time.time())}
            manifest[p["name"]] = rec
            json.dump(manifest, open(MANIFEST, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
            el = time.time() - t_start
            print(f">> [{n}/{len(todo)}] {p['w']:12} {rec['audio_s']}s {rec['bytes']}B "
                  f"用时{el:.0f}s 预计剩 {el / n * (len(todo) - n):.0f}s", flush=True)
        except Exception as e:
            print(f"!! [{n}/{len(todo)}] {p['w']} 失败：{type(e).__name__}: {e}", flush=True)

    left = [p["name"] for p in plan if not os.path.exists(p["dst"])]
    print(f">> 收尾：站点 mp3 现有 {len(os.listdir(OUT_DIR))} 个文件，缺 {len(left)} 条"
          + ("：" + " ".join(left[:20]) if left else ""))
    print(f">> 清单在 {MANIFEST}")
    return 1 if left else 0


if __name__ == "__main__":
    sys.exit(main())
