#!/usr/bin/env node
/* 喵站 · 正文审计闸（第四轮新增，T-11 的验收工具）
 *
 * 它把「不够好读 / 提前接触没学过的代码 / 莫名其妙的梗」这三句抱怨
 * 翻译成三条会红的检查，跑不过就退出码 1：
 *
 *   A 梗黑名单    —— BAN_WORDS 里的词在正文与代码里出现次数必须为 0
 *   B 交叉引用    —— 「第 N 课」的 N 必须 ≤ 本课课号，且必须在站内真实存在
 *                    （往前指可以，往后指不行；指向不存在的课更不行）
 *   C 构造首现    —— 每种语法构造有一个「教学章」，代码块里不许在教学章之前使用它
 *                    站内根本没教的构造（TEACH_AT = null）＝ 一律不许出现在代码里
 *
 * 另外打印一批规模数字（字数/块数/代码行），供 §11.2 那张表复跑。
 *
 * 跑法：node dev/tools/lesson-audit.cjs [数据文件…]
 *   默认查 py-data.js；给多个文件就分别查。--json 输出机器可读结果。
 */
const fs = require('fs');
const path = require('path');

const DEV = path.resolve(__dirname, '..');
const DEFAULT_FILES = [path.join(DEV, 'frontend/assets/data/py-data.js')];

/* ── 教学章表：构造 → 站内哪一课第一次教它（null = 这门教程不教，代码里就不许出现）──
 * 数字对应 lNN；s01–s03 算 0 课（三节准备课：历史 / 装解释器 / 装编辑器），
 * 它们只讲「装环境」和「print 之前的事」，不用任何语法构造，所以同样受这条闸管。
 */
const TEACH_AT = {
  sep: 5,            // 第 5 课 sep=
  end: 7,            // 第 7 课 end=
  multiarg: 4,       // 第 4 课 逗号分隔多个值
  escnl: 6,          // 第 6 课 \n 转义
  tq: 9,             // 第 9 课 三引号
  assign: 10,        // 第 10 课 变量与值
  unpack: 14,        // 第 14 课 多个变量赋值
  comment: 15,       // 第 15 课 注释（这一条只查代码里的整行注释）
  fstr: 13,          // 第 13 课 f-string 三条路
  fmt: 36,           // 第 36 课 format 与字符串方法
  input: 23,         // 第 23 课 input
  if: 25,
  elif: 26,
  logic: 27,         // and / or / not
  list: 28,
  slice: 28,         // 切片随列表一起教
  tup: 30,
  dict: 31,
  set: null,         // 站内不教集合
  for: 32,
  while: 33,
  control: 34,       // break / continue / pass / 循环 else
  def: 37,
  import: 38,
  cls: 39,
  inherit: 40,
  open: 41,
  writefile: 42,
  appendfile: 43,
  try: 44,
  pathlib: 41,       // 第 41 课就用 Path(__file__).parent 锚定路径
  os: 45,            // 第 45 课才碰 os（chdir / listdir / environ）
  json: 45,          // 第 45 课的 JSON 持久化
  shutil: 45,
  comp: null,        // 推导式：站内不教
  lambda: null,      // lambda：站内不教
  async: null,       // async/await：站内不教
  decorator: null,   // @装饰器：站内不教
  typing: null       // 类型提示 def f(x: int) -> str：站内不教
};

/* 梗黑名单：第四轮 D-33 —— 他点名要清零，出现即失败 */
const BAN_WORDS = ['椰子蛋', '管理'];

/* 构造检测：只看代码块，正文里用中文提「第 39 课的类」是允许的 */
const DETECT = [
  ['sep', /\bsep\s*=/],
  ['end', /\bend\s*=/],
  ['multiarg', /\bprint\s*\([^()\n]*,[^()\n]*\)/],
  ['escnl', /(?:^|[^\\])(?:\\\\)*\\n/],   // 真正的换行符：反斜杠前面必须是成对的转义反斜杠（或没有）
  ['tq', /("""|''')/],
  ['assign', /^[ \t]*[A-Za-z_\u4e00-\u9fa5][\w\u4e00-\u9fa5]*\s*=[^=]/m],
  ['unpack', /^[ \t]*[\w\u4e00-\u9fa5]+\s*,\s*[\w\u4e00-\u9fa5]+\s*=/m],
  ['comment', /^[ \t]*#/m],
  ['fstr', /(?:^|[^\w])f(["'])/],
  ['fmt', /\.format\s*\(/],
  ['input', /\binput\s*\(/],
  ['if', /^\s*if\b/m],
  ['elif', /\belif\b/],
  ['logic', /\b(and|or|not)\b/],
  ['list', /^\s*[\w\u4e00-\u9fa5[\]'.]+\s*=\s*\[/m],
  ['slice', /\[[ \t]*[\w:]+[ \t]*:[ \t]*[\w]*\]/],
  ['tup', /=\s*\(\s*[^()]+\s*,[^()]*\)/],   // 只认「赋值出来的元组」；print('a','b') 是第 4 课的逗号多值，不是元组
  ['dict', /^\s*[\w\u4e00-\u9fa5]+\s*=\s*\{/m],
  ['set', /^\s*[\w\u4e00-\u9fa5]+\s*=\s*set\s*\(|\{\s*[^:}\n]+\s*(,[^:}\n]+)+\s*\}/m],
  ['for', /^\s*for\b/m],
  ['while', /^\s*while\b/m],
  ['control', /\b(break|continue|pass)\b/],
  ['def', /^\s*def\b/m],
  ['import', /^\s*(import|from)\s+[^\s]/m],
  ['cls', /^\s*class\b/m],
  ['inherit', /class\s+\w+\s*\(/],
  ['open', /\bopen\s*\(/],
  ['writefile', /\.write\s*\(/],
  ['appendfile', /open\s*\([^)]*["']a/],
  ['try', /^\s*try\s*:/m],
  ['pathlib', /\bpathlib\b|Path\s*\(/],
  ['os', /\bos\s*\.|\bimport\s+os\b/],
  ['json', /\bjson\s*\.|\bimport\s+json\b/],
  ['shutil', /\bshutil\b/],
  ['comp', /(?:\(|\[|\{)[^()\[\]{}]*\bfor\b[^()\[\]{}]*(?:\)|\]|\})/],
  ['lambda', /\blambda\b/],
  ['async', /\b(async|await)\b/],
  ['decorator', /^\s*@[A-Za-z_]\w*/m],
  ['typing', /def\s+\w+\s*\([^)]*:\s*[A-Za-z]/]
];

function loadChapters(file) {
  if (file === "PY") {                       /* 走 index.html 同一套加载顺序 */
    const r = require("./load-data.cjs").loadPy();
    return { pack: { tutorial: r.tutorial }, chapters: r.chapters, newIds: r.newIds };
  }
  const src = fs.readFileSync(file, 'utf8');
  const prevWin = global.window;
  global.window = global;
  /* 先清掉上一次留下的分部：多文件同跑时不清的话，前一份的章会被算进后一份
     （代理也撞见过：p5 那次报出 8 章、把 p4 的 l19 算了进去） */
  Object.keys(global).filter(function (k) { return /^MIAO_PY_P\d+$/.test(k); }).forEach(function (k) { delete global[k]; });
  let pack;
  try {
    // eslint-disable-next-line no-eval
    eval(src);
    pack = global.MIAO_PY;
    if (!pack) {
      /* 分部文件导出的是 MIAO_PY_Pn，直接查它自己那几章（并行开发时不必装配全站） */
      const parts = Object.keys(global).filter(k => /^MIAO_PY_P\d$/.test(k));
      if (parts.length) pack = { tutorial: { chapters: parts.reduce((a, k) => a.concat(global[k].chapters || []), []) } };
    }
  } finally {
    global.window = prevWin;
  }
  if (!pack || !pack.tutorial) throw new Error('没拿到 MIAO_PY.tutorial：' + file);
  return { pack, chapters: pack.tutorial.chapters, newIds: null };
}

function blocksText(c) {
  /* 构造首现这条闸只管 python 代码块：lang 为 text/shell 的演示是「给人看的说明」，
     里面出现 # 注释、$ python xxx 都不算提前教语法 */
  const code = c.blocks.filter(b => b.t === 'code' && (b.lang || 'python') === 'python').map(b => b.code || '').join('\n');
  const anyCode = c.blocks.filter(b => b.t === 'code').map(b => b.code || '').join('\n');
  const prose = c.blocks.filter(b => b.t !== 'code').map(b => (b.text || '') + ' ' + ((b.items || []).join(' '))).join(' ');
  return { code, anyCode, prose };
}
function lessonNo(id) { return id === 's01' || id === 's02' || id === 's03' ? 0 : parseInt(id.slice(1), 10); }

function audit(file, onlyIds) {
  const loaded = loadChapters(file);
  const chapters = onlyIds ? loaded.chapters.filter(c => onlyIds.indexOf(c.id) >= 0) : loaded.chapters;
  const maxNo = Math.max(...chapters.map(c => lessonNo(c.id)));
  /* 「这一课存不存在」必须按全站算，不能按本次筛选后的章算 ——
     否则单查 p7 时「第 41 课」会被误报成指向不存在的课（第四轮踩过一次） */
  let allChapters = loaded.chapters;
  if (file !== 'PY') { try { allChapters = loadChapters('PY').chapters; } catch (e) { /* 装配失败就退回本文件的范围 */ } }
  const ids = new Set(allChapters.map(c => c.id));
  const violations = { ban: [], ref: [], feat: [] };
  const stats = { chaps: chapters.length, chars: 0, blocks: 0, codelines: 0, perChapter: [] };

  for (const c of chapters) {
    const { code, anyCode, prose } = blocksText(c);
    const no = lessonNo(c.id);
    const full = anyCode + prose;          // 梗与交叉引用：所有块都算
    stats.chars += prose.length;
    stats.blocks += c.blocks.length;
    stats.codelines += anyCode.split('\n').length;
    stats.perChapter.push({ id: c.id, prose: prose.length, blocks: c.blocks.length, code: anyCode.split('\n').length });

    for (const w of BAN_WORDS) {
      const n = full.split(w).length - 1;
      if (n) violations.ban.push({ chap: c.id, word: w, count: n });
    }
    for (const m of full.matchAll(/第\s*(\d+)\s*课/g)) {
      const ref = +m[1];
      const ctx = full.slice(Math.max(0, m.index - 30), m.index + 30).replace(/\n/g, ' ');
      const exists = ids.has('l' + String(ref).padStart(2, '0')) || ref === 0;
      if (!exists) violations.ref.push({ chap: c.id, ref, kind: '站内没这一课', ctx });
      else if (ref > no) violations.ref.push({ chap: c.id, ref, kind: '往后指（还没学）', ctx });
    }
    for (const [feat, re] of DETECT) {
      if (!re || !re.test(code)) continue;   // 只看 python 代码块
      const teach = TEACH_AT[feat];
      if (teach === null) violations.feat.push({ chap: c.id, feat, kind: '站内不教的构造', teach });
      else if (no < teach) violations.feat.push({ chap: c.id, feat, kind: '早于教学章', teach });
    }
  }
  return { file, maxNo, violations, stats };
}

function main() {
  const raw = process.argv.slice(2);
  const asJson = raw.includes('--json');
  const all = raw.includes('--all');            /* 连旧稿兜底的章一起查（旧稿本来就没清，只作参照） */
  const files = raw.filter(a => a !== '--json' && a !== '--all');
  const loaded = loadChapters('PY');
  const targets = files.length
    ? files.map(f => ({ f, only: null }))
    : [{ f: 'PY', only: all ? null : loaded.newIds }];

  const results = targets.map(t => {
    const r = audit(t.f, t.only);
    r.scopeNote = t.only ? '只查新稿 ' + r.stats.chaps + ' 章（旧稿兜底 ' + (loaded.chapters.length - r.stats.chaps) + ' 章不计）' : '全站 ' + r.stats.chaps + ' 章';
    return { f: t.f, r };
  });

  if (asJson) { console.log(JSON.stringify(results, null, 1)); }
  else {
    for (const { f, r } of results) {
      console.log('▍' + (f === 'PY' ? 'py-data 装配结果' : path.relative(DEV, f)) + '  章节 ' + r.stats.chaps + ' · ' + r.scopeNote);
      console.log('  正文 ' + r.stats.chars + ' 字（均 ' + Math.round(r.stats.chars / r.stats.chaps) + '） · 块 ' +
        r.stats.blocks + '（均 ' + (r.stats.blocks / r.stats.chaps).toFixed(1) + '） · 代码 ' + r.stats.codelines + ' 行');
      const long = r.stats.perChapter.filter(p => p.prose > 1800 || p.blocks > 25);
      console.log('  超出 D-35 口径（>1800 字 或 >25 块）的章：' + (long.length ? long.map(p => p.id + '(' + p.prose + '字/' + p.blocks + '块)').join(' ') : '无'));
      console.log('  A 梗黑名单违规 ' + r.violations.ban.length + ' 处');
      for (const v of r.violations.ban.slice(0, 8)) console.log('     ', v.chap, v.word, '×' + v.count);
      console.log('  B 交叉引用违规 ' + r.violations.ref.length + ' 处');
      for (const v of r.violations.ref.slice(0, 10)) console.log('     ', v.chap, '→ 第' + v.ref + '课', '[' + v.kind + ']', v.ctx.slice(0, 60));
      console.log('  C 构造首现违规 ' + r.violations.feat.length + ' 处');
      for (const v of r.violations.feat.slice(0, 14)) console.log('     ', v.chap, v.feat, '[' + v.kind + ']', v.teach === null ? '不教' : '教在第' + v.teach + '课');
    }
  }

  const total = results.reduce((s, x) => s + x.r.violations.ban.length + x.r.violations.ref.length + x.r.violations.feat.length, 0);
  const overLong = results.reduce((s, x) => s + x.r.stats.perChapter.filter(p => p.prose > 1800 || p.blocks > 25).length, 0);
  if (!asJson) console.log('\n违规合计 ' + total + ' 处（A+B+C）· 超长章 ' + overLong + ' 章（D-35 口径）');
  process.exit(total === 0 ? 0 : 1);
}

/* 被 exam-audit.cjs 当库用时不能自己跑掉进程 */
if (require.main === module) main();

module.exports = { TEACH_AT: TEACH_AT, DETECT: DETECT, BAN_WORDS: BAN_WORDS, audit: audit, lessonNo: lessonNo, loadChapters: loadChapters };
