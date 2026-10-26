/* 喵站日更 · 本地模型客户端（零依赖）
 *
 * 只认两种本地端点，都不出网：
 *   1) Ollama 原生：http://127.0.0.1:11434/api/chat   （默认走这条）
 *   2) OpenAI 兼容：http://127.0.0.1:<port>/v1/chat/completions（llama-server / vLLM 都认）
 *
 * 为什么自己写这两行：日更工程要能在没有网络、没有云 API 的机器上跑；
 * 引一个 SDK 就多一份要跟着升级的依赖，而这里只用到两个 POST。
 *
 * 用法（模块）：
 *   import { chat, listModels } from "./llm.mjs";
 *   const r = await chat({ model: "qwen3.8-27b", messages: [{ role: "user", content: "..." }] });
 *   // r = { text, thinking, tokPerSec, seconds, loadSeconds, model }
 *
 * 用法（命令行）：
 *   node dev/tools/daily/llm.mjs --model glm-4.6v-flash --prompt "用一句话解释暂存区"
 */
const OLLAMA = "http://127.0.0.1:11434";

export async function listModels(base = OLLAMA) {
  const res = await fetch(base + "/api/tags", { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error("列模型失败：" + res.status);
  const j = await res.json();
  return (j.models || []).map((m) => ({
    name: m.name,
    size: m.size,
    params: (m.details && m.details.parameter_size) || "",
    quant: (m.details && m.details.quantization_level) || "",
    runner: (m.details && m.details.runner) || "",
    caps: m.capabilities || [],
  }));
}

/* 打一次对话。stream=false：日更不需要边出边看，拿到完整结果才好校验 JSON。 */
export async function chat({
  model,
  messages,
  base = OLLAMA,
  mode = "ollama",              // "ollama" | "openai"
  numPredict = 1024,
  temperature = 0.3,
  json = false,                 // 只要 JSON 时置 true（ollama 原生支持 format:"json"）
  think = false,                // 默认关掉思考链：思考型模型（Qwen3 / GLM-4.6V）不关就会把预算全花在推理上
  timeoutMs = 900000,           // 27B 在纯 CPU 上也可能要几分钟，给足
} = {}) {
  if (!model) throw new Error("chat() 缺 model");
  const t0 = Date.now();
  let url, body;
  if (mode === "openai") {
    url = base.replace(/\/$/, "") + "/v1/chat/completions";
    body = {
      model, messages, stream: false, temperature,
      max_tokens: numPredict,
      ...(json ? { response_format: { type: "json_object" } } : {}),
    };
  } else {
    url = base.replace(/\/$/, "") + "/api/chat";
    body = {
      model, messages, stream: false,
      options: { num_predict: numPredict, temperature },
      think,
      ...(json ? { format: "json" } : {}),
    };
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const raw = await res.text();
  if (!res.ok) throw new Error("HTTP " + res.status + "：" + raw.slice(0, 300));

  let text = "", thinking = "", evalCount = 0, evalNs = 0, loadNs = 0;
  if (mode === "openai") {
    const j = JSON.parse(raw);
    const msg = (j.choices && j.choices[0] && j.choices[0].message) || {};
    text = msg.content || "";
    thinking = msg.reasoning_content || "";
    evalCount = (j.usage && j.usage.completion_tokens) || 0;
  } else {
    const j = JSON.parse(raw);            // ollama 非流式：一个 JSON 对象
    const msg = j.message || {};
    text = msg.content || "";
    thinking = msg.thinking || "";        // 思考型模型（GLM-4.6V 这类）把推理放在这里
    evalCount = j.eval_count || 0;
    evalNs = j.eval_duration || 0;
    loadNs = j.load_duration || 0;
  }
  const seconds = (Date.now() - t0) / 1000;
  const genSeconds = evalNs ? evalNs / 1e9 : seconds;
  return {
    model,
    text: String(text).trim(),
    thinking: String(thinking).trim(),
    tokPerSec: evalCount ? Math.round((evalCount / genSeconds) * 10) / 10 : null,
    seconds: Math.round(seconds * 10) / 10,
    loadSeconds: loadNs ? Math.round((loadNs / 1e9) * 10) / 10 : null,
  };
}

/* 命令行入口：node llm.mjs --model X --prompt "..." [--json] [--base URL] [--openai] */
if (import.meta.url === `file://${process.argv[1]}`) {
  const a = process.argv.slice(2);
  const get = (k, d) => (a.includes(k) ? a[a.indexOf(k) + 1] : d);
  const prompt = get("--prompt");
  if (!prompt) {
    console.error("用法：node llm.mjs --model <名字> --prompt <问题> [--json] [--openai] [--base URL]");
    process.exit(2);
  }
  if (a.includes("--list")) {
    console.table(await listModels(get("--base", OLLAMA)));
  }
  const r = await chat({
    model: get("--model"),
    messages: [{ role: "user", content: prompt }],
    base: get("--base", OLLAMA),
    mode: a.includes("--openai") ? "openai" : "ollama",
    json: a.includes("--json"),
    numPredict: Number(get("--max", 512)),
  });
  if (r.thinking) console.log("[思考]\n" + r.thinking.slice(0, 800) + (r.thinking.length > 800 ? "\n…" : ""));
  console.log(r.text);
  console.error(`\n[${r.model}] ${r.tokPerSec ?? "?"} tok/s · ${r.seconds}s` + (r.loadSeconds ? ` · 载入 ${r.loadSeconds}s` : ""));
}
