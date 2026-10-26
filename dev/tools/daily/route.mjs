/* 喵站日更 · 选模型（走规则，不靠小模型自己判断）
 *
 * 为什么不用 judge-model 路由：实测它做不到。
 *   · 让它输出 9/27/3：2/10 正确（乱吐，模板还会把 "判断：" 拼回去）
 *   · 让它按原生标签回答「要不要用 27B」：2/10（一律 ?）
 *   · 让它做本职的可信度判定：4/6（连 1 到 10 求和 55 都判错）
 * 结论：1.1B 只当快速玩具，别放关键路径上。路由用下面这套可解释、可测的规则。
 *
 * 用法：
 *   node dev/tools/daily/route.mjs "帮我把这个 css 的间距改成 8px"
 *   echo "帮我审这段并发代码" | node dev/tools/daily/route.mjs
 *   node dev/tools/daily/route.mjs --json "给 3000 行文件做重构方案"
 *   node dev/tools/daily/route.mjs --judge "..."     # 顺带看 judge 的意见（仅参考，不参与决策）
 *
 * 输出：9（glm-4.6v-flash，主力）/ 27（qwen3.8-27b，重活）/ 3（fuka，闲聊）
 */
import { chat } from "./llm.mjs";

const argv = process.argv.slice(2);
const asJson = argv.includes("--json");
const askJudge = argv.includes("--judge");
const text = (argv.filter((a) => !a.startsWith("--")).join(" ") || "").trim() ||
  (await new Promise((res) => { let s = ""; process.stdin.on("data", (d) => (s += d)); process.stdin.on("end", () => res(s.trim())); }));

if (!text) {
  console.error("用法：node route.mjs [--json] [--judge] \"<任务描述>\"   （或从 stdin 读）");
  process.exit(2);
}

const CHAT = /^(你好|hi|hello|在吗|早上好|晚安|谢谢|辛苦了|今天心情|累了|无聊)/i;
const HARD = /(并发|数据竞争|死锁|竞态|性能|剖析|重构|架构|设计方案|论证|推导|证明|审一下|审查|长文|几千行|3000 ?行|512k|上下文)/;
const FRONT = /(css|html|react|vue|组件|样式|布局|flex|grid|动画|界面|前端)/i;
const codeLines = (text.match(/\n/g) || []).length + 1;

let pick, why;
if (CHAT.test(text) && text.length < 40) { pick = 3; why = "寒暄/情绪，3B 闲聊够用"; }
else if (codeLines >= 60) { pick = 27; why = `贴了 ${codeLines} 行代码，先上 27B 读全局`; }
else if (text.length >= 1200) { pick = 27; why = `${text.length} 字长文，9B 容易漏约束`; }
else if (HARD.test(text)) { pick = 27; why = `命中重活关键词（${text.match(HARD)[0]}）`; }
else if (FRONT.test(text)) { pick = 9; why = `前端任务（${text.match(FRONT)[0]}），GLM 的主场`; }
else { pick = 9; why = "常规任务，9B 默认"; }

const model = { 3: "fuka", 9: "glm-4.6v-flash", 27: "qwen3.8-27b" }[pick];
const out = { pick, model, why, chars: text.length, lines: codeLines };

if (askJudge) {
  try {
    const r = await chat({
      model: "judge-model", numPredict: 4, temperature: 0,
      messages: [{ role: "user", content: `用户请求：${text}\n问题：这个请求是不是必须用 27B 大模型才能可靠完成？` }],
    });
    out.judge = r.text || "(空)";
    out.judgeNote = "仅参考：judge 在路由上实测 2/10，不参与决策";
  } catch (e) {
    out.judge = "不可用：" + e.message.slice(0, 60);
  }
}

if (asJson) console.log(JSON.stringify(out, null, 2));
else console.log(`→ ${pick}（${model}）· ${why}` + (out.judge ? `\n  judge 说：${out.judge}（不采纳）` : ""));
