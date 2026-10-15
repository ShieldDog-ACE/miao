/* 喵站 · 课末考试 · 笔试判分引擎（纯逻辑，零 DOM，不执行任何代码，浏览器与 Node 共用）
 *
 * 为什么要它：D-32 定了两轨 —— Python 73 篇走沙箱实跑，其余 286 篇（C/Go/JS/Rust…）
 * 不可能为每门语言再写一个解释器，就用笔试。考卷形状见 任务书 §11.6.4。
 *
 * 判分口径照 D-4 / D-13 / D-15 三条来：
 *   ① 「不能太严格」（D-4/D-15）—— 所有文本比对先折叠连续空白（含全角空格 \u3000）、
 *      去行首行尾、丢空行、大小写不敏感；填空可给多个 accept；补代码只按 acceptRegex
 *      找关键字，**绝不逐字符比对源码形状**（缩进、空格、变量名怎么花都行）。
 *   ② 「只判答得对不对」—— 多选漏选给一半分（知道一部分就给一部分），选错任一项 0 分；
 *      读代码写输出逐行比对，行数不足按命中行比例给分；步骤排序必须全对（顺序题没有
 *      「差不多」这回事），但复盘里把「你的顺序 vs 正确顺序」并排给出。
 *   ③ 一场卷总分 = 各题 score 相加（D-13：满分正好 100，通过线 60）。权重和不是 100
 *      是考卷本身写坏了，必须当成一条错误信息暴露出来，不许静默把分算歪。
 *   ④ 「错了不知道为什么错」这条最要命（A-3）：每题都返回 对/半对/错 + 你答了什么 +
 *      正确答案是什么 + explain[] 里那条 why，UI 拿去直接渲染逐题复盘。
 *
 * 用法：
 *   浏览器 —— <script src="assets/js/exam-paper.js"></script> 后用 window.MIAO_PAPER.gradePaper(exam, answers)
 *   Node   —— const PAPER = require("./frontend/assets/js/exam-paper.js"); PAPER.gradePaper(exam, answers)
 *
 * 第二十轮起这里还有第二种形状：`mode:"ide"` 的单编辑器卷（一整块编辑器 + 逐条判定），
 * 入口是 gradeIde(exam, buffer) —— 判分本体仍是 TYPES.code，多出来的只有「取独行 // 之后的代码」
 * 与「先剥注释再匹配」这两步，见下面 单编辑器卷 那一节。
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.MIAO_PAPER = api;
  /* 有人习惯写 window.MIAO_PAPER：在无窗口的环境里（如 vm 沙箱）root 未必是 window，补挂一次 */
  if (root.window && root.window !== root) root.window.MIAO_PAPER = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  /* ---------- 宽松比对：这套折叠规则是「不能太严格」的落地，四种文本题型共用 ---------- */

  /* 连续空白（半角空格 / Tab / 全角空格 / NBSP）折成一个空格，去头去尾，顺手把全角字母数字标点
     （ＵＦＦ０１–ＦＦ５Ｅ，比如「，」「１」「ＰＯＳＴ」）折成半角 —— 中文键盘很容易打成全角，
     这不该判错。半角/全角只是输入法的差别，不是答案的差别。 */
  function full2half(s) {
    return s.replace(/[\uff01-\uff5e]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xfee0); });
  }
  function normText(s) {
    return full2half(String(s == null ? "" : s)).replace(/[\s\u00a0\u3000]+/g, " ").trim();
  }
  function foldLine(l) { return full2half(l).replace(/[\s\u00a0\u3000]+/g, " ").trim(); }
  /* 逐行折叠：行内空白归一、行首行尾去掉、尾部空行丢掉（多按一次回车不该判错） */
  function fold(s) {
    return String(s == null ? "" : s)
      .replace(/\r/g, "")
      .split("\n")
      .map(foldLine)
      .join("\n")
      .replace(/\n+$/, "");
  }
  /* 有效行：折叠后仍然空的那些行整行丢掉，比对只看有内容的行 */
  function lines(s) {
    return String(s == null ? "" : s)
      .replace(/\r/g, "")
      .split("\n")
      .map(foldLine)
      .filter(function (l) { return l !== ""; });
  }
  /* 文本相等：空白折叠 + 大小写不敏感（post 与 POST 是一回事） */
  function looseEq(a, b) {
    return normText(a).toLowerCase() === normText(b).toLowerCase();
  }
  /* 再宽松一档：答题时爱给人家加引号、加句号（"POST" / POST。 / `POST`），这些不该算错。
     只在「去掉这些包装之后再比一次」时用，不作为唯一判据；
     减号/加号故意不在这张表里，免得把 "-1" 当成 "1"、"2" 当成 "+2" 这种真答案给放过去。 */
  var WRAPCHARS = "\\s\\u00a0\\u3000'\"`\\[\\](){}“”‘’「」『』【】《》。，,．.；;：:、！!？?";
  var LEAD = new RegExp("^[" + WRAPCHARS + "]+");
  var TAIL = new RegExp("[" + WRAPCHARS + "]+$");
  function stripWrap(s) {
    return normText(s).replace(LEAD, "").replace(TAIL, "");
  }
  /* 填空用：先按原样比，再按「去掉引号/句号」比 */
  function textEq(got, want) {
    if (looseEq(got, want)) return true;
    var a = stripWrap(got), b = stripWrap(want);
    return a !== "" && b !== "" && a.toLowerCase() === b.toLowerCase();
  }
  function quote(s) { return "「" + String(s == null ? "" : s).replace(/\n/g, " ⏎ ") + "」"; }
  var NO_ANSWER = "（没作答）";
  function clip(s, n) {
    s = String(s == null ? "" : s);
    return s.length > n ? s.slice(0, n) + "…" : s;
  }

  /* ---------- 答卷取值：id 命名的对象、按题号的数组、q1/q2 这种键都认 ---------- */
  function pickAnswer(answers, q, i) {
    if (answers == null) return undefined;
    if (Array.isArray(answers)) return answers[i];
    if (typeof answers === "object") {
      if (q && q.id != null && Object.prototype.hasOwnProperty.call(answers, q.id)) return answers[q.id];
      if (Object.prototype.hasOwnProperty.call(answers, i)) return answers[i];
      if (Object.prototype.hasOwnProperty.call(answers, "q" + (i + 1))) return answers["q" + (i + 1)];
    }
    return undefined;
  }

  function isBlank(ans) {
    if (ans == null) return true;
    if (typeof ans === "string") return normText(ans) === "";
    if (Array.isArray(ans)) return ans.length === 0;
    if (typeof ans === "object") return Object.keys(ans).length === 0;
    return false;
  }

  /* 选项取值：给索引就算索引，给文本就按文本宽松找回去 */
  function optionIndex(q, v, listName) {
    var opts = [].concat(q[listName || "options"] || []);
    if (typeof v === "number" || /^\s*-?\d+\s*$/.test(String(v))) {
      var n = Number(normText(v));
      if (n >= 0 && n < opts.length) return { idx: n, label: opts[n], via: "idx" };
      return { idx: -1, label: "第 " + (n + 1) + " 项（超出选项范围）", via: "oob" };
    }
    for (var i = 0; i < opts.length; i++) if (textEq(opts[i], v)) return { idx: i, label: opts[i], via: "text" };
    return { idx: -1, label: String(normText(v)), via: "unknown" };
  }

  /* 多选答卷归一：索引数组 / 文本数组 / 逗号顿号分隔的字符串 / {0:true} 这种勾选表，都能吃下 */
  function pickedSet(q, raw) {
    var list = [];
    if (raw == null) return { idx: [], junk: [] };
    if (Array.isArray(raw)) list = raw;
    else if (typeof raw === "object") {
      Object.keys(raw).forEach(function (k) { if (raw[k]) list.push(/^\d+$/.test(k) ? Number(k) : raw[k]); });
    } else {
      var s = String(raw);
      /* 形如 "0,1,3" / 「协议、端口」 / 选项正好是 A B C D 时写 "AC"，三种常见写法都接。
         小数点故意不当分隔号，免得 "3.5" 被切成两项 */
      if (/^[\s\d,，、;；]+$/.test(s)) list = s.split(/[,，、;；\s]+/).filter(function (x) { return x !== ""; });
      else if (/^[A-Ha-h]{2,}$/.test(normText(s))) list = normText(s).split("");
      else list = s.split(/[,，、;；]+|\s+/).filter(function (x) { return x !== ""; });
    }
    var idx = [], junk = [];
    list.forEach(function (v) {
      if (v === "" || v == null) return;
      var r = optionIndex(q, v);
      if (r.idx >= 0) { if (idx.indexOf(r.idx) < 0) idx.push(r.idx); }
      else junk.push(r.label);
    });
    return { idx: idx.sort(function (a, b) { return a - b; }), junk: junk };
  }
  function listOf(v) { return Array.isArray(v) ? v : (v && typeof v === "object" ? Object.keys(v).map(function (k) { return v[k]; }) : [v]); }
  /* 排序题的答卷：数组直接用；写成 "0 2 1" / "0,2,1" 这种索引串按分隔号拆；
     写成人话标签时用换行或箭头分隔 —— 标签本身可能就带逗号，所以不敢按逗号切。 */
  function seqOf(v) {
    if (Array.isArray(v)) return v;
    if (v && typeof v === "object") return Object.keys(v).map(function (k) { return v[k]; });
    var s = String(v == null ? "" : v);
    if (/^[\s\d,，、;；.．|]+$/.test(s)) return s.split(/[,，、;；|\s]+/).filter(function (x) { return x !== ""; });
    if (/→|->/.test(s)) return s.split(/\s*(?:→|->)\s*/).filter(function (x) { return normText(x) !== ""; });
    if (/\n/.test(s)) return s.split("\n").filter(function (x) { return normText(x) !== ""; });
    return [s];
  }

  function optLabel(q, i) {
    var opts = [].concat(q.options || []);
    return i >= 0 && i < opts.length ? String(opts[i]) : "第 " + (i + 1) + " 项";
  }

  /* ---------- 七种题型 ----------
     每个函数返回 { pts, mark, your, right, saw, extra }：
       pts  该题得分（0 ~ q.score）
       mark "ok" 对 / "half" 半对 / "no" 错
       your 你答了什么（人话，直接进复盘）
       right 正确答案是什么（人话）
       saw  一句话结论 */
  var TYPES = {};

  /* 单选：答对给满分，答错 0 分；写文本也算（「请求行」= 第 0 项） */
  TYPES.choice = function (q, raw) {
    var right = q.answer !== undefined ? q.answer : q.correct;
    var rOpt = optionIndex(q, right);
    var rightLabel = (rOpt.idx >= 0 ? rOpt.label : String(normText(right))) || "（考卷没给正确答案）";
    if (isBlank(raw)) {
      return { pts: 0, mark: "no", your: NO_ANSWER, right: rightLabel, saw: "没作答，这题 " + (q.score || 0) + " 分全丢了" };
    }
    var got = optionIndex(q, raw);
    var ok = rOpt.idx >= 0 ? got.idx === rOpt.idx : textEq(got.label, rightLabel);
    return {
      pts: ok ? (q.score || 0) : 0, mark: ok ? "ok" : "no",
      your: optPrefix(raw) + got.label, right: rightLabel,
      saw: ok ? "选对了：" + rightLabel : "选错了：你选「" + got.label + "」，正确是「" + rightLabel + "」"
    };
  };

  /* 多选：漏选（只选了正确项的一部分）给一半分；选错任何一项 0 分 */
  TYPES.multi = function (q, raw) {
    var rightList = listOf(q.answers !== undefined ? q.answers : q.answer).map(function (x) {
      var r = optionIndex(q, x); return r.idx;
    }).filter(function (n) { return n >= 0; }).sort(function (a, b) { return a - b; });
    var rightLabel = rightList.map(function (i) { return optLabel(q, i); }).join("、") || "（考卷没给正确答案）";
    if (isBlank(raw)) {
      return { pts: 0, mark: "no", your: NO_ANSWER, right: rightLabel, saw: "没作答，这题 " + (q.score || 0) + " 分全丢了" };
    }
    var picked = pickedSet(q, raw);
    var idx = picked.idx, junk = picked.junk;
    var wrong = idx.filter(function (i) { return rightList.indexOf(i) < 0; });
    var hit = idx.filter(function (i) { return rightList.indexOf(i) >= 0; });
    var yourLabel = idx.slice().sort(function (a, b) { return a - b; }).map(function (i) { return optLabel(q, i); })
      .concat(junk.map(function (j) { return j + "（不是选项）"; })).join("、") || "一个都没勾";
    var half = Math.round((q.score || 0) / 2);
    if (wrong.length || junk.length) {
      return {
        pts: 0, mark: "no", your: yourLabel, right: rightLabel,
        saw: "勾错了" + (wrong.length ? "「" + wrong.map(function (i) { return optLabel(q, i); }).join("、") + "」" : "") +
          (junk.length ? (wrong.length ? "，还有" : "") + "「" + junk.join("、") + "」不在选项里" : "") +
          "—— 多选只要错一项就整题 0 分（漏选才给一半）"
      };
    }
    if (hit.length === rightList.length && rightList.length) {
      return { pts: q.score || 0, mark: "ok", your: yourLabel, right: rightLabel, saw: "全对：" + rightLabel };
    }
    if (!hit.length) {
      return { pts: 0, mark: "no", your: yourLabel, right: rightLabel, saw: "一个正确项都没勾上" };
    }
    return {
      pts: half, mark: "half", your: yourLabel, right: rightLabel,
      saw: "漏选了「" + rightList.filter(function (i) { return hit.indexOf(i) < 0; }).map(function (i) { return optLabel(q, i); }).join("、") +
        "」，按漏选规则给一半分（" + half + "/" + (q.score || 0) + "）"
    };
  };

  /* 复盘里「正确答案」那一栏：题目给了 sample（一条具体写法）就先展示它，
     只给 acceptRegex 时展示正则 —— 裸正则给读者看等于没给答案，所以出题时该带上 sample。 */
  function sampleText(q, fallback) {
    return q && q.sample ? "参考写法：" + String(q.sample).replace(/\n/g, " ⏎ ") : fallback;
  }

  /* 填空：accept 里任一答案宽松命中即满分 */
  TYPES.blank = function (q, raw) {
    var acc = listOf(q.accept !== undefined ? q.accept : (q.answers !== undefined ? q.answers : q.answer))
      .filter(function (x) { return x != null && normText(x) !== ""; });
    var reList = [].concat(q.acceptRegex || []);
    var rightLabel = sampleText(q, acc.length ? acc.join(" / ") : (reList.length ? "符合 " + patText(reList[0]) : "（考卷没给可接受答案）"));
    if (isBlank(raw)) {
      return { pts: 0, mark: "no", your: NO_ANSWER, right: rightLabel, saw: "没作答，这题 " + (q.score || 0) + " 分全丢了" };
    }
    var hitIdx = -1;
    for (var i = 0; i < acc.length; i++) if (textEq(raw, acc[i])) { hitIdx = i; break; }
    var ok = hitIdx >= 0;
    /* 出题人只给了正则没给字面答案时，正则也能当 accept 用 */
    if (!ok && reList.length) ok = reList.some(function (p) { return regexHit(p, String(raw)); });
    var yourTxt = quote(clip(normText(raw), 60));
    return {
      pts: ok ? (q.score || 0) : 0, mark: ok ? "ok" : "no",
      your: yourTxt, right: rightLabel,
      saw: ok ? "填对了：空里填的是 " + yourTxt + "（已忽略大小写、全角与多余空格）"
        : "没填对：你写的是 " + yourTxt + "，可接受的答案是 " + rightLabel
    };
  };

  /* 补代码：只用正则/关键字找「有没有那一下」，源码形状一概不比 */
  TYPES.code = function (q, raw) {
    var pats = [].concat(q.acceptRegex !== undefined ? q.acceptRegex : (q.accept !== undefined ? q.accept : q.answer));
    pats = pats.filter(function (p) { return p != null && String(p.pattern !== undefined ? p.pattern : p) !== ""; });
    var rightLabel = sampleText(q, pats.length ? pats.map(patText).join(" 且 ") : "（考卷没给 acceptRegex）");
    if (isBlank(raw)) {
      return { pts: 0, mark: "no", your: NO_ANSWER, right: rightLabel, saw: "没作答，这题 " + (q.score || 0) + " 分全丢了" };
    }
    var src = String(raw);
    var miss = [];
    var hits = 0;
    pats.forEach(function (p) { if (regexHit(p, src)) hits++; else miss.push(patText(p)); });
    /* 默认：列出来的关键写法全都要在（补多个空就是这样）；q.matchAny = true 时命中任一条即算对 */
    var ok = q.matchAny ? hits > 0 : (pats.length > 0 && miss.length === 0);
    var yourTxt = quote(clip(fold(src), 80));
    return {
      pts: ok ? (q.score || 0) : 0, mark: ok ? "ok" : "no",
      your: yourTxt, right: rightLabel,
      saw: ok ? "关键处写对了：命中 " + hits + "/" + pats.length + " 条特征（" + (q.matchAny ? "命中任一条即算对" : "要求条条都在") + "；空格、缩进、变量名一概不计较）"
        : (miss.length ? (q.sample
          ? "没写到要点上。参考写法：" + String(q.sample).replace(/\n/g, " ⏎ ") + " —— 判分只认关键写法，空格、缩进、变量名都不计较"
          : "没找到这些关键写法：" + miss.join(" 且 ")) + "；你写的是 " + yourTxt
          : "考卷数据有问题（没给 acceptRegex），这题没法判")
    };
  };

  /* 读代码写输出：逐行宽松比对。
     行数是分母（max(应有行数, 实写行数)）—— 少写按命中比例给，多写胡扯的行同样占分母，
     这样「行数不足按命中行比例给分」与「不能靠多写蒙一半分」两头都站得住。 */
  TYPES.output = function (q, raw) {
    var want = [].concat(q.acceptLines !== undefined ? q.acceptLines : (q.lines !== undefined ? q.lines : (q.accept !== undefined ? q.accept : q.answer)));
    if (want.length === 1 && typeof want[0] === "string" && want[0].indexOf("\n") >= 0) want = want[0].split("\n");
    want = lines(want.join("\n"));
    var rightLabel = want.length ? want.join(" ⏎ ") : "（考卷没给 acceptLines）";
    if (isBlank(raw)) {
      return { pts: 0, mark: "no", your: NO_ANSWER, right: rightLabel, saw: "没作答，这题 " + (q.score || 0) + " 分全丢了" };
    }
    var got = lines(raw);
    var n = Math.max(want.length, got.length);
    var hit = 0, detail = [];
    for (var i = 0; i < n; i++) {
      var w = i < want.length ? want[i] : null;
      var g = i < got.length ? got[i] : null;
      if (w !== null && g !== null && looseEq(g, w)) { hit++; continue; }
      detail.push("第 " + (i + 1) + " 行" + (w === null ? "多写了 " + quote(g) : g === null ? "缺了 " + quote(w) : "应为 " + quote(w) + "，你写 " + quote(g)));
    }
    var ratio = n ? hit / n : 0;
    var pts = Math.round((q.score || 0) * ratio);
    var mark = hit === n && n > 0 ? "ok" : (hit > 0 ? "half" : "no");
    return {
      pts: pts, mark: mark,
      your: got.length ? quote(clip(got.join(" ⏎ "), 80)) : NO_ANSWER, right: rightLabel,
      saw: mark === "ok" ? "输出逐行都对（" + hit + " 行；空格与大小写不计较）"
        : "对 " + hit + "/" + n + " 行，给 " + pts + "/" + (q.score || 0) + " 分 —— " + (detail.slice(0, 4).join("；") || "没有对上的行")
    };
  };

  /* 步骤排序：全对才给分，但复盘一定并排给出「你的顺序 vs 正确顺序」 */
  TYPES.order = function (q, raw) {
    var universe = [].concat(q.steps !== undefined ? q.steps : (q.options !== undefined ? q.options : (q.items !== undefined ? q.items : [])));
    var right = seqOf(q.answer !== undefined ? q.answer : (q.correct !== undefined ? q.correct : q.answers));
    var rightSeq = seqLabels(q, universe, right);
    var rightLabel = rightSeq.join(" → ") || "（考卷没给正确顺序）";
    if (isBlank(raw)) {
      return { pts: 0, mark: "no", your: NO_ANSWER, right: rightLabel, saw: "没作答，这题 " + (q.score || 0) + " 分全丢了", extra: { yours: [], right: rightSeq } };
    }
    var yourSeq = seqLabels(q, universe, seqOf(raw));
    var n = Math.max(rightSeq.length, yourSeq.length);
    var bad = [];
    for (var i = 0; i < n; i++) if (!looseEq(yourSeq[i] == null ? "" : yourSeq[i], rightSeq[i] == null ? "" : rightSeq[i])) bad.push(i + 1);
    var ok = n > 0 && bad.length === 0;
    return {
      pts: ok ? (q.score || 0) : 0, mark: ok ? "ok" : "no",
      your: yourSeq.join(" → ") || "一个都没排", right: rightLabel,
      saw: ok ? "顺序全对（" + n + " 步）" : "排序题要么全对要么 0 分：第 " + bad.join("、") + " 步的位置不对",
      extra: { yours: yourSeq, right: rightSeq, wrongAt: bad }
    };
  };

  /* 勾线配对：左边一项连右边一项，按连对的对数给分（与英语卷那套 wireMatch 同一交互）。
     数据形状：left[] / right[] / answer{ 左标签: 右标签 }。
     答卷可以是 {左标签: 右标签}，也可以写索引（"0": 2）—— 界面点选给的是标签，
     索引那条路是给 Node 侧自测和手搓答卷留的。标签本身按 textEq 宽松认，
     所以大小写、全半角、多打空格都不该判错。 */
  TYPES.match = function (q, raw) {
    var universe = matchUniverse(q);
    var pairs = universe.pairs;
    var rightLabel = pairs.map(function (p) { return p.l + " → " + p.r; }).join("；") || "（考卷没给配对答案）";
    if (isBlank(raw)) {
      return { pts: 0, mark: "no", your: NO_ANSWER, right: rightLabel, saw: "没作答，这题 " + (q.score || 0) + " 分全丢了" };
    }
    var mine = {}, junk = [];
    Object.keys(raw).forEach(function (k) {
      var l = resolveSide(universe.left, k);
      var r = resolveSide(universe.right, raw[k]);
      if (l == null) { junk.push(clip(normText(k), 24)); return; }
      mine[l] = r == null ? clip(normText(raw[k]), 24) : r;
    });
    var hit = 0, bad = [];
    pairs.forEach(function (p) {
      if (mine[p.l] != null && textEq(mine[p.l], p.r)) { hit++; return; }
      bad.push(p.l + " 应连 " + p.r + (mine[p.l] == null ? "（没连）" : "，你连了 " + mine[p.l]));
    });
    var n = pairs.length;
    var pts = n ? Math.round((q.score || 0) * hit / n) : 0;
    var mark = hit === n && n > 0 ? "ok" : (hit > 0 ? "half" : "no");
    var yourLabel = Object.keys(mine).map(function (l) { return l + " → " + mine[l]; })
      .concat(junk.map(function (j) { return j + "（左边没这一项）"; })).join("；") || "一条都没连";
    return {
      pts: pts, mark: mark, your: clip(yourLabel, 90), right: rightLabel,
      saw: mark === "ok" ? "全连对（" + hit + "/" + n + " 对）"
        : "连对 " + hit + "/" + n + " 对，给 " + pts + "/" + (q.score || 0) + " 分 —— " + (bad.concat(junk.length ? ["「" + junk.join("、") + "」不是左边的项"] : []).join("；") || "没有对上的配对")
    };
  };

  /* 配对题的项表：left/right 别名一并认（steps/options/items 都可能是出题人顺手写的） */
  function matchUniverse(q) {
    var left = [].concat(q.left !== undefined ? q.left : (q.items !== undefined ? q.items : []));
    var right = [].concat(q.right !== undefined ? q.right : (q.options !== undefined ? q.options : []));
    var ans = q.answer !== undefined ? q.answer : (q.correct !== undefined ? q.correct : q.answers);
    var pairs = [];
    if (ans && typeof ans === "object" && !Array.isArray(ans)) {
      Object.keys(ans).forEach(function (k) {
        var l = resolveSide(left, k), r = resolveSide(right, ans[k]);
        if (l != null && r != null) pairs.push({ l: l, r: r });
      });
    }
    return { left: left, right: right, pairs: pairs };
  }
  /* 一个项可以是标签也可以是索引；认不出来返回 null（复盘里点名叫出「不是选项」） */
  function resolveSide(list, v) {
    if (v == null) return null;
    if (typeof v === "number" || /^\s*-?\d+\s*$/.test(String(v))) {
      var n = Number(normText(v));
      return n >= 0 && n < list.length ? String(list[n]) : null;
    }
    for (var i = 0; i < list.length; i++) if (textEq(list[i], v)) return String(list[i]);
    return null;
  }

  /* 把「索引 / 文本」混着的顺序答案统一成人话标签序列 */
  function seqLabels(q, universe, seq) {
    return seq.map(function (v) {
      if (typeof v === "number" || /^\s*\d+\s*$/.test(String(v))) {
        var n = Number(normText(v));
        if (universe[n] !== undefined) return String(universe[n]);
        return "第 " + (n + 1) + " 步";
      }
      for (var i = 0; i < universe.length; i++) if (textEq(universe[i], v)) return String(universe[i]);
      return normText(v);
    });
  }

  function patText(p) {
    return p && typeof p === "object" ? String(p.pattern) : String(p);
  }
  function optPrefix(raw) {
    return typeof raw === "number" || /^\s*\d+\s*$/.test(String(raw)) ? "第 " + (Number(normText(raw)) + 1) + " 项 " : "";
  }
  /* 关键字命中：默认大小写不敏感 + 多行模式；同时在「原文」与「空白压平后的原文」上各试一次，
     所以 `listen(0,` 与 `listen(  0 ,` 都能过。绝不反过来要求源码形状一致。 */
  function regexHit(p, src) {
    var pattern = p && typeof p === "object" ? p.pattern : p;
    var flags = p && typeof p === "object" && p.flags != null ? String(p.flags) : "im";
    var re;
    try { re = new RegExp(String(pattern), flags); }
    catch (e) {
      /* 出题人手滑写了非法正则：不能让它静默算「没命中」，也不能炸掉整场判分 */
      throw new Error("acceptRegex 里有不合法的正则：" + pattern + "（" + (e.message || e) + "）");
    }
    if (re.test(src)) return true;
    var squeezed = String(src).replace(/[\s\u00a0\u3000]+/g, " ").trim();
    return re.test(squeezed);
  }

  /* 每种题型至少要有什么字段才判得动（别名一并认：出题人手滑写哪个都能跑，真缺了才报错） */
  var MUST = {
    choice: ["answer", "correct"],
    multi: ["answers", "answer"],
    blank: ["accept", "answers", "answer", "acceptRegex"],
    code: ["acceptRegex", "accept", "answer"],
    output: ["acceptLines", "lines", "accept", "answer"],
    order: ["answer", "correct", "answers"],
    match: ["answer", "correct", "answers"]
  };
  var MUST_NAME = { choice: "answer", multi: "answers", blank: "accept", code: "acceptRegex", output: "acceptLines", order: "answer", match: "answer" };

  /* ---------- 考卷契约自检（D-13：权重和必须正好 100，不平就报出来别静默） ---------- */
  function validatePaper(exam) {
    var errs = [];
    if (!exam || typeof exam !== "object") return ["考卷不是一个对象"];
    var qs = [].concat(exam.questions || []);
    if (!qs.length) errs.push("这张卷子一道题都没有");
    var seen = {};
    var sum = 0;
    qs.forEach(function (q, i) {
      var at = "第 " + (i + 1) + " 题" + (q && q.id ? "（" + q.id + "）" : "");
      if (!q || typeof q !== "object") { errs.push(at + "不是一个对象"); return; }
      if (q.id == null) errs.push(at + "没有 id，explain 与答卷都对不上号");
      else if (seen[q.id]) errs.push(at + "的 id 与前面重复：" + q.id);
      else seen[q.id] = 1;
      if (!TYPES[q.type]) { errs.push(at + "的题型判分器不认识：" + q.type + "（只支持 " + Object.keys(TYPES).join("/") + "）"); return; }
      var sc = Number(q.score);
      if (!(sc >= 0)) errs.push(at + "没有合法的 score（现在是 " + JSON.stringify(q.score) + "）");
      else sum += sc;
      if (!q.stem) errs.push(at + "没有 stem 题干");
      var keys = MUST[q.type] || [];
      if (!keys.some(function (k) { return q[k] !== undefined && q[k] !== null; })) {
        errs.push(at + "（" + q.type + "）缺 " + (MUST_NAME[q.type] || "正确答案") + "，这题没法判分");
      }
      if ((q.type === "choice" || q.type === "multi") && !(q.options || []).length) errs.push(at + "没有 options");
      if (q.type === "match") {
        /* 配对题的三件事：两边都得有项、answer 得落在项里、标签不许撞车
           （撞了就没法判断「该连哪一个」，界面上两个一样的按钮点哪个都算对） */
        var mu = matchUniverse(q);
        if (mu.left.length < 2 || mu.right.length < 2) errs.push(at + "（match）左边或右边不足 2 个项（左 " + mu.left.length + " / 右 " + mu.right.length + "）");
        var wantN = q.answer && typeof q.answer === "object" ? Object.keys(q.answer).length : 0;
        if (wantN && mu.pairs.length !== wantN) errs.push(at + "（match）answer 里 " + wantN + " 对只有 " + mu.pairs.length + " 对在 left/right 里认得出来");
        [["left", mu.left], ["right", mu.right]].forEach(function (side) {
          var seenL = {};
          side[1].forEach(function (l) {
            var key = normText(l).toLowerCase();
            if (seenL[key]) errs.push(at + "（match）" + side[0] + " 有重复项：" + l);
            seenL[key] = 1;
          });
        });
      }
    });
    if (errs.length) return errs;
    if (sum !== 100) errs.push("各题分数相加是 " + sum + "，要求正好 100（D-13：100 分制、60 分及格，权重不平这张卷就是写坏了）");
    return errs;
  }

  /* ---------- 主入口 ---------- */
  function gradePaper(exam, answers) {
    var qs = [].concat((exam && exam.questions) || []);
    var errs = validatePaper(exam);
    var passLine = (exam && exam.pass != null) ? Number(exam.pass) : 60;
    var why = buildWhy(exam);

    var items = qs.map(function (q, i) {
      var weight = q && Number(q.score) >= 0 ? Number(q.score) : 0;
      var fn = q && TYPES[q.type];
      var raw = pickAnswer(answers, q, i);
      var r;
      if (!fn) {
        r = {
          pts: 0, mark: "no", your: isBlank(raw) ? NO_ANSWER : quote(normText(raw)), right: "—",
          saw: "这一题判不了：题型" + (q && q.type ? "「" + q.type + "」" : "没写") + "不在笔试引擎支持的范围里"
        };
      } else {
        try { r = fn(q, raw); }
        catch (e) {
          r = { pts: 0, mark: "no", your: isBlank(raw) ? NO_ANSWER : quote(clip(normText(raw), 60)), right: "—", saw: "这一题判分器报了错，判不了：" + (e && e.message || e) };
        }
      }
      var pts = Math.max(0, Math.min(weight, Math.round(r.pts || 0)));
      var ok = r.mark === "ok";
      var it = {
        id: q && q.id != null ? q.id : "q" + (i + 1),
        index: i,
        type: q && q.type,
        label: (q && q.stem) || "（没有题干）",
        stem: (q && q.stem) || "（没有题干）",
        weight: weight,          /* 该题满分 */
        pts: pts,                /* 该题得分 */
        ok: ok,                  /* 给旧的判定清单界面用的布尔 */
        mark: r.mark,
        markText: r.mark === "ok" ? "对" : r.mark === "half" ? "半对" : "错",
        skipped: isBlank(raw),
        yourAnswer: r.your,
        rightAnswer: r.right,
        saw: r.saw,
        why: (q && q.id != null && why[q.id]) || (q && q.why) || "",
        order: r.extra ? { yours: r.extra.yours, right: r.extra.right, wrongAt: r.extra.wrongAt } : null
      };
      return it;
    });

    var full = items.reduce(function (a, x) { return a + x.weight; }, 0);
    var got = items.reduce(function (a, x) { return a + x.pts; }, 0);
    var score = Math.round(got);
    var valid = errs.length === 0;
    var answered = items.filter(function (x) { return !x.skipped; }).length;
    var result = {
      cid: exam && exam.cid, kind: (exam && exam.kind) || "paper", title: exam && exam.title,
      score: score,                  /* 总分 = 各题得分直接相加（不做归一化，权重不平就让它露出来） */
      full: full,                    /* 各题 score 之和：正常应是 100 */
      got: got,
      passLine: passLine,
      passed: valid && score >= passLine,
      valid: valid,
      errors: errs,
      weightSum: full,
      weightOk: full === 100,
      answered: answered,
      total: items.length,
      counts: { ok: items.filter(function (x) { return x.mark === "ok"; }).length, half: items.filter(function (x) { return x.mark === "half"; }).length, no: items.filter(function (x) { return x.mark === "no"; }).length },
      items: items,
      /* 同一份数组起三个名字：新界面读 reviews，老判定清单界面读 checks（字段 ok/label/weight/saw 都对得上） */
      reviews: items,
      checks: items
    };
    return result;
  }

  /* ---------- 单编辑器卷（mode:"ide"）：一块编辑器 + 逐条判定 ----------
   *
   * 为什么要这一层：C++ 在浏览器里跑不动，但用户要的是 Python 考场那个形状 —— 题面就是文件
   * 顶部那几行注释，一整块编辑器把这份程序写到底，判定清单逐条给 ✓/✗。上一条「每题一枚小编辑器」
   * 把一件事拆成 4 个小格子，手感根本不是同一间机房。
   *
   * 三条判分规矩（都是这块形状独有的，逐题卷没有）：
   *   1) 分界与 Python 同一条线：第一条独行的 "//"（C 风格注释）就是题面与代码的分界。
   *      题面整块删掉就没有这条线，那时整份 buffer 都算代码 —— 与 exam-ui.js 的 splitAt 同语义。
   *   2) 匹配之前先剥注释：条件是按「代码里有没有这个写法」判的，把条件原文抄进注释不该得分。
   *      剥的时候认字符串与字符字面量（"http://x" 里的 // 不是注释），并把注释那几个字符换成空格，
   *      行数和列位一概不动 —— 报错要按行号跳，长度变了就跳错格。
   *   3) 少数条件考的不是程序本体（写编译命令、把观察到的报错抄成注释）。这类题写
   *      acceptOn:"buffer"，改为在整份 buffer（含题面之外的注释）上匹配 —— 但那是出题人明说的
   *      「就考你写不写得出这一行注释」，不是把规则松开。
   */
  var IDE_SPLIT = /^\s*(\/\/|#)\s*$/;    /* C++ 用 //，Python 用 #：一条正则两边认 */
  function ideCodeLines(buffer) {
    var ls = String(buffer == null ? "" : buffer).replace(/\r/g, "").split("\n"), k;
    for (k = 0; k < ls.length; k++) if (IDE_SPLIT.test(ls[k])) return ls.slice(k + 1);
    return ls;
  }
  function ideTaskLines(buffer) {
    var ls = String(buffer == null ? "" : buffer).replace(/\r/g, "").split("\n"), k;
    for (k = 0; k < ls.length; k++) if (IDE_SPLIT.test(ls[k])) return k + 1;
    return 0;
  }
  /* 剥 // 与 块注释：状态机扫，字符串里的 // 不算注释。行结构一字不动（注释字符→空格）。 */
  function stripComments(src) {
    var s = String(src == null ? "" : src), out = "", i = 0, n = s.length;
    while (i < n) {
      var c = s.charAt(i), d = s.charAt(i + 1);
      if (c === '"' || c === "'") {                       /* 字面量原样吐，里面的 // 与 /* 都不理 */
        var q = c; out += c; i++;
        while (i < n) {
          if (s.charAt(i) === "\\") { out += s.substr(i, 2); i += 2; continue; }
          out += s.charAt(i);
          if (s.charAt(i) === q) { i++; break; }
          if (s.charAt(i) === "\n" && q === "'") { i++; break; }   /* 单引号没闭合就断在这一行，别把整篇吃进去 */
          i++;
        }
        continue;
      }
      if (c === "/" && d === "/") {
        while (i < n && s.charAt(i) !== "\n") { out += " "; i++; }
        continue;
      }
      if (c === "/" && d === "*") {
        var e = s.indexOf("*/", i + 2); e = e < 0 ? n : e + 2;
        for (; i < e; i++) out += (s.charAt(i) === "\n" ? "\n" : " ");
        continue;
      }
      out += c; i++;
    }
    return out;
  }
  /* 一场的条件数与权重（单编辑器卷用 questions[]，每条就是一「条件」：字段沿用逐题卷，
     这样 TYPES.code、复盘、coversTask 对账都不用再写第二份） */
  function ideChecks(exam) {
    return [].concat((exam && exam.questions) || []);
  }
  /* 空骨架 / 只抄题面 交卷不该得分：starter 自己必须过不了线 */
  function ideStarterFails(exam) {
    var r = gradeIde(exam, (exam && exam.starter) || "", { blankOk: true });
    return { failed: r.score < ((exam && exam.pass != null) ? Number(exam.pass) : 60), score: r.score };
  }
  /* 判分入口：整份 buffer 进来，逐条条件走 TYPES.code（它只按关键写法找，不比源码形状） */
  function gradeIde(exam, buffer, opt) {
    opt = opt || {};
    var qs = ideChecks(exam);
    /* 分界之后的那一段才是读者自己写的东西：剥了注释的是「代码」，没剥的是「代码 + 读者的注释」。
       题面那几行注释（包括它自己写的「条件 N」）绝不进匹配 —— 否则把题面留在文件里就能白拿分。 */
    var mine = ideCodeLines(buffer).join("\n");
    /* buffer 档还要把「题面自己那几种行」剔掉：条件 N / 任务题目 / 知识点 / 提示 / 第 N 课考试。
       不剔就有个洞 —— 读者把整块题面留着（甚至把独行 // 那条分界删掉），编译命令那种
       buffer 条件就会拿题面原文判过。剔完之后，能得分的只有他自己写下的那几行。 */
    var whole = mine.split("\n").filter(function (l) {
      return !/^\s*(\/\/|#)\s*(条件\d+|任务题目|知识点|提示|第\s*\d+\s*课)/.test(l);
    }).join("\n");
    var code = stripComments(mine);
    var errs = validateIde(exam);
    var passLine = (exam && exam.pass != null) ? Number(exam.pass) : 60;
    var why = buildWhy(exam);
    var items = qs.map(function (q, i) {
      var weight = q && Number(q.score) >= 0 ? Number(q.score) : 0;
      var target = (q && q.acceptOn === "buffer") ? whole : code;
      var r;
      try {
        r = TYPES.code(q, opt.blankOk ? "" : target);
      } catch (e) {
        r = { pts: 0, mark: "no", your: NO_ANSWER, right: "—", saw: "这条判定报错了：" + (e && e.message || e) };
      }
      return {
        id: q && q.id != null ? q.id : "q" + (i + 1),
        index: i, type: "code",
        label: (q && q.stem) || "（没有条件说明）",
        stem: (q && q.stem) || "（没有条件说明）",
        weight: weight, pts: Math.max(0, Math.min(weight, Math.round(r.pts || 0))),
        ok: r.mark === "ok", mark: r.mark, markText: r.mark === "ok" ? "对" : r.mark === "half" ? "半对" : "错",
        skipped: opt.blankOk ? true : isBlank(target),
        yourAnswer: r.your, rightAnswer: r.right, saw: r.saw,
        why: (q && q.id != null && why[q.id]) || (q && q.why) || "",
        coversTask: q ? q.coversTask : null
      };
    });
    var got = items.reduce(function (a, x) { return a + x.pts; }, 0);
    var full = items.reduce(function (a, x) { return a + x.weight; }, 0);
    var valid = errs.length === 0;
    return {
      cid: exam && exam.cid, kind: (exam && exam.kind) || "paper", mode: "ide",
      title: exam && exam.title, score: Math.round(got), full: full, got: got,
      passLine: passLine, passed: valid && Math.round(got) >= passLine,
      valid: valid, errors: errs, weightSum: full, weightOk: full === 100,
      answered: items.filter(function (x) { return !x.skipped; }).length, total: items.length,
      counts: { ok: items.filter(function (x) { return x.mark === "ok"; }).length, no: items.filter(function (x) { return x.mark === "no"; }).length },
      items: items, reviews: items, checks: items
    };
  }
  /* 契约：单编辑器卷只许 code 条件，3–6 条，条条给 acceptRegex，权重和正好 100 */
  function validateIde(exam) {
    var errs = [];
    if (!exam || typeof exam !== "object") return ["考卷不是一个对象"];
    var qs = ideChecks(exam);
    if (!qs.length) errs.push("这张卷子一条条件都没有");
    var bad = qs.filter(function (q) { return !q || q.type !== "code"; });
    if (bad.length) {
      var kinds = {};
      bad.forEach(function (q) { kinds[q && q.type] = 1; });
      errs.push("单编辑器卷里混进 " + bad.length + " 条不是 code 的条件（" +
        Object.keys(kinds).join("/") + "）—— 一块编辑器判不了选择型题");
    }
    if (qs.length < 3 || qs.length > 6) errs.push("单编辑器卷 " + qs.length + " 条条件，要求 3–6 条");
    var sum = 0, seen = {};
    qs.forEach(function (q, i) {
      var at = "条件 " + (i + 1) + (q && q.id ? "（" + q.id + "）" : "");
      if (!q || typeof q !== "object") { errs.push(at + "不是一个对象"); return; }
      if (q.id == null) errs.push(at + "没有 id");
      else if (seen[q.id]) errs.push(at + "的 id 与前面重复：" + q.id); else seen[q.id] = 1;
      if (!q.stem) errs.push(at + "没有 stem（题面那一行 # 条件 拿什么给读者看）");
      if (![].concat(q.acceptRegex || []).length) errs.push(at + "没给 acceptRegex —— 单编辑器卷的判定只有这一条路");
      if (!q.sample) errs.push(at + "没给 sample —— 判错时复盘要给人看参考写法，不能甩裸正则");
      var sc = Number(q.score);
      if (!(sc >= 0)) errs.push(at + "没有合法的 score（现在是 " + JSON.stringify(q.score) + "）"); else sum += sc;
      if (q.acceptOn != null && q.acceptOn !== "code" && q.acceptOn !== "buffer")
        errs.push(at + "的 acceptOn 是 " + JSON.stringify(q.acceptOn) + "，只认 code / buffer");
    });
    if (errs.length) return errs;
    if (sum !== 100) errs.push("各条件分数相加是 " + sum + "，要求正好 100（D-13）");
    return errs;
  }

  /* explain: [{id:"q1", why:"…"}] 也接受 {q1:"…"} 这种表 */
  function buildWhy(exam) {
    var out = {};
    var e = exam && exam.explain;
    if (Array.isArray(e)) {
      e.forEach(function (x) {
        if (!x) return;
        var id = x.id !== undefined ? x.id : x.qid;
        if (id == null) return;
        out[id] = String(x.why !== undefined ? x.why : (x.text !== undefined ? x.text : ""));
      });
    } else if (e && typeof e === "object") {
      Object.keys(e).forEach(function (k) {
        var v = e[k];
        out[k] = String(v && typeof v === "object" ? (v.why || v.text || "") : v);
      });
    }
    return out;
  }

  return {
    gradePaper: gradePaper, validatePaper: validatePaper, TYPES: TYPES,
    KINDS: Object.keys(TYPES),
    /* 单编辑器卷（mode:"ide"）：C++ 两门课从 2026-10-15 起全部走这一形状 */
    gradeIde: gradeIde, validateIde: validateIde, ideStarterFails: ideStarterFails,
    ideCodeLines: ideCodeLines, ideTaskLines: ideTaskLines, stripComments: stripComments,
    normText: normText, fold: fold, lines: lines, looseEq: looseEq, textEq: textEq,
    stripWrap: stripWrap, pickedSet: pickedSet, seqOf: seqOf, quote: quote
  };
});
