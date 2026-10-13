// 一次性审计：全数据文件里 code 块的 lang 分布 + 无 lang / 未知 lang 的 code 块
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..", "..", "frontend", "assets", "data");
const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name.endsWith(".js")) files.push(p);
  }
})(ROOT);

const KNOWN = new Set(["c++", "cpp", "shell", "sh", "bash", "powershell", "ps1", "python", "py",
  "javascript", "js", "html", "xml", "vue", "css", "scss", "less", "json", "yaml", "yml",
  "ini", "toml", "cfg", "text", "txt", "console", "svg", ""]);
const langCount = {};
let codeBlocks = 0, unknown = [], noLang = [];
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  // code 块：t 与 lang 的先后两种顺序都抓（值为反引号或引号包的串）
  const RE = [
    /\{\s*t:\s*[`"']code[`"'],\s*lang:\s*([`"'])([^`"'\n]*)\1/g,
    /\{\s*lang:\s*([`"'])([^`"'\n]*)\1,\s*t:\s*[`"']code[`"']/g
  ];
  for (const re of RE) {
    for (const m of src.matchAll(re)) {
      codeBlocks++;
      const l = m[2] === "" ? "(空串)" : m[2];
      langCount[l] = (langCount[l] || 0) + 1;
      if (!KNOWN.has(m[2].toLowerCase())) {
        const line = src.slice(0, m.index).split("\n").length;
        unknown.push(path.relative(ROOT, f) + ":" + line + "  lang=" + m[2]);
      }
    }
  }
  // t:"code" 但 240 字符内没有 lang:
  for (const m of src.matchAll(/\{\s*t:\s*[`"']code[`"'],(?![\s\S]{0,240}?\blang:)/g)) {
    const line = src.slice(0, m.index).split("\n").length;
    noLang.push(path.relative(ROOT, f) + ":" + line);
  }
}
console.log("=== code 块 lang 分布（共 " + codeBlocks + " 块，含多遍抓取去重前） ===");
Object.entries(langCount).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(String(v).padStart(5), k));
console.log("\n=== hlCode 不认识的 lang ===", unknown.length);
unknown.slice(0, 30).forEach((s) => console.log(" ", s));
console.log("\n=== 没写 lang 的 code 块 ===", noLang.length);
noLang.slice(0, 30).forEach((s) => console.log(" ", s));
