/* 喵站日更 · 本地模型体检（零依赖）
 *
 * 干什么：列出本机 Ollama 里有哪些模型，逐个打一次极小请求，量出「在不在、多快、几秒载入」。
 * 为什么先体检：日更 06:00 起跑时机器上可能一个模型都没加载；先体检再选题，
 * 不会被「本地模型不可用」卡住整个班次 —— 体检不过就退回自写（规则见 dev/日更.md）。
 *
 * 用法：
 *   node dev/tools/daily/probe.mjs                 # 打全部模型，每个一次，输出表格
 *   node dev/tools/daily/probe.mjs --model glm-4.6v-flash
 *   node dev/tools/daily/probe.mjs --json          # 机器可读
 *   node dev/tools/daily/probe.mjs --base http://127.0.0.1:8090 --openai   # llama-server 那类
 *
 * 退出码：0 = 至少一个模型可用；1 = 一个都不可用（调用方据此退回自写）。
 */
import { chat, listModels } from "./llm.mjs";

const argv = process.argv.slice(2);
const get = (k, d) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : d);
const base = get("--base", "http://127.0.0.1:11434");
const mode = argv.includes("--openai") ? "openai" : "ollama";
const only = get("--model", null);
const asJson = argv.includes("--json");

const rows = [];
let models = [];
try {
  models = await listModels(base);
} catch (e) {
  console.error("[probe] 连不上 " + base + "：" + e.message);
  process.exit(1);
}
if (only) models = models.filter((m) => m.name === only || m.name.split(":")[0] === only);

for (const m of models) {
  const t0 = Date.now();
  try {
    /* 只让它数一个词：探针不许把显存占满，也不许等半分钟 */
    const r = await chat({
      model: m.name, base, mode,
      messages: [{ role: "user", content: "只输出一个词：在。" }],
      numPredict: 8, temperature: 0, timeoutMs: 120000,
    });
    rows.push({
      model: m.name, params: m.params, quant: m.quant, size: (m.size / 1e9).toFixed(1) + " GB",
      ok: true, tok_s: r.tokPerSec, load_s: r.loadSeconds, total_s: Math.round((Date.now() - t0) / 100) / 10,
      reply: r.text.replace(/\s+/g, " ").slice(0, 20),
    });
  } catch (e) {
    rows.push({ model: m.name, params: m.params, quant: m.quant, size: (m.size / 1e9).toFixed(1) + " GB",
      ok: false, err: String(e.message).slice(0, 80) });
  }
}

if (asJson) console.log(JSON.stringify(rows, null, 2));
else {
  console.table(rows);
  const up = rows.filter((r) => r.ok);
  console.log(`[probe] ${base}（${mode}）：可用 ${up.length} / ${rows.length}` +
    (up.length ? " · 最快 " + up.reduce((a, b) => ((b.tok_s || 0) > (a.tok_s || 0) ? b : a)).model : ""));
}
process.exit(rows.some((r) => r.ok) ? 0 : 1);
