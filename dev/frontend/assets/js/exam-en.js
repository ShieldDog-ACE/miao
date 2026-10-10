/* 喵站 · 课末考试 · 英语卷（字母 / 音标 / 单词 三种池子，出题 + 判分 + 界面）
 *
 * 音频全部直接指向站内 mp3（26 字母 + 48 音标 + 200 单词），点一次播一次，可以反复听。
 * 勾线题是真的画线：左栏点一下再点右栏，中间画一条线；再点配对项可以撤销。
 *
 * 池子从哪来：字母与音标走 /api/meta；单词卷（kind:"enword"）走 /api/words/enword，
 * 那一份是「按课分好组的 200 词」，一场课末卷只从本课那 10 个词里出，结课卷从 20 课混出。
 */
(function (root) {
  "use strict";
  var doc = root.document;
  var API = root.MIAO_API;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function pick(arr, n) { return shuffle(arr).slice(0, n); }
  function uniqById(items) {
    var seen = {}, out = [];
    items.forEach(function (x) { if (x && !seen[x.key]) { seen[x.key] = 1; out.push(x); } });
    return out;
  }

  /* ---------------- 池子：字母卷 / 音标卷 / 混合卷 / 单词卷 ---------------- */
  function wordPool(words) {
    return (words || []).map(function (x) {
      return {
        key: "W" + x.w.toLowerCase(), kind: "word", glyph: x.w, ipa: x.ipa, pos: x.pos,
        cn: x.cn, ph: x.ph, audio: x.a, lesson: x.lesson,
        /* 连线题右边只放第一个义项，「爷爷；外公」这种取前面那个就够 */
        cnShort: String(x.cn || "").split(/[；;]/)[0]
      };
    });
  }
  function letterPool(letters) {
    return letters.map(function (x) {
      return {
        key: "L" + x.l, kind: "letter", glyph: x.l, ipa: x.ipa, cn: x.cn, audio: x.a,
        say: "字母 " + x.l
      };
    });
  }
  function phonemePool(phonemes) {
    return phonemes.map(function (x) {
      return {
        key: "P" + x.ph, kind: "phoneme", glyph: x.ph, cn: x.cn, word: x.w, tip: x.tip,
        audio: x.a, say: "音标 " + x.ph
      };
    });
  }

  /* 一张卷子：mc 选择 / pick 听力选 / write 听写 / match 勾线 */
  function buildPaper(spec, pools) {
    if (spec.kind === "enword") return buildWordPaper(spec, pools);
    var source = spec.pool === "letters" ? pools.letters
      : spec.pool === "phonemes" ? pools.phonemes
        : pools.letters.concat(pools.phonemes);
    var n = spec.counts, w = spec.weights;
    var qs = [], i;
    /* 抽题不重复：一次卷子里同一道题不出现两次 */
    var used = {};
    function take(k) { if (used[k]) return false; used[k] = 1; return true; }

    /* ---- 10 道选择题：正反两问法混着出 ---- */
    for (i = 0; i < n.mc; i++) {
      var it = null, tries = 0;
      while (!it && tries++ < 40) {
        var cand = source[Math.floor(Math.random() * source.length)];
        if (take(cand.key)) it = cand;
      }
      if (!it) break;
      var others = source.filter(function (x) { return x.key !== it.key; });
      var opts = shuffle([it].concat(pick(others, 3)));
      var reverse = i % 3 === 1;                    /* 每三道来一道「给读音挑本体」 */
      qs.push({
        id: "mc" + i, type: "mc", weight: w.mc,
        prompt: reverse
          ? "下面哪一项的读音（名字）是 " + it.glyph + (it.kind === "letter" ? "" : "") + " ？"
          : (it.kind === "letter" ? "字母 " : "音标 ") + it.glyph + " 的读音是哪一个？",
        options: opts.map(function (o) { return reverse ? o.glyph : (o.kind === "letter" ? o.ipa : o.ph || o.ipa); }),
        answer: opts.findIndex(function (o) { return o.key === it.key; }),
        audio: it.audio, said: it.glyph
      });
    }

    /* ---- 5 道听力选本体 ---- */
    for (i = 0; i < n.listenPick; i++) {
      var it2 = null, t2 = 0;
      while (!it2 && t2++ < 40) {
        var c2 = source[Math.floor(Math.random() * source.length)];
        if (take("aud" + c2.key)) it2 = c2;
      }
      if (!it2) break;
      var o2 = source.filter(function (x) { return x.key !== it2.key; });
      var opts2 = shuffle([it2].concat(pick(o2, 3)));
      qs.push({
        id: "lp" + i, type: "pick", weight: w.listenPick,
        prompt: "听录音，选出你听到的" + (spec.pool === "phonemes" ? "音标" : "字母或音标"),
        options: opts2.map(function (o) { return o.glyph; }),
        answer: opts2.findIndex(function (o) { return o.key === it2.key; }),
        audio: it2.audio, said: it2.glyph
      });
    }

    /* ---- 5 道听写 ---- */
    for (i = 0; i < n.listenWrite; i++) {
      var it3 = null, t3 = 0;
      while (!it3 && t3++ < 40) {
        var c3 = source[Math.floor(Math.random() * source.length)];
        if (take("wr" + c3.key)) it3 = c3;
      }
      if (!it3) break;
      qs.push({
        id: "lw" + i, type: "write", weight: w.listenWrite,
        prompt: "听录音，把听到的" + (it3.kind === "letter" ? "字母" : "音标") + "写出来",
        answer: it3.glyph, audio: it3.audio,
        palette: it3.kind === "letter" ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
          : uniqById(source.filter(function (x) { return x.kind === "phoneme"; }).map(function (x) { return { key: x.key, glyph: x.glyph }; })).map(function (x) { return x.glyph; }),
        said: it3.glyph
      });
    }

    /* ---- 5 组「四对四」勾线：左边本体，右边读音/谐音 ---- */
    for (i = 0; i < n.match; i++) {
      var group = [], t4 = 0;
      while (group.length < 4 && t4++ < 80) {
        var c4 = source[Math.floor(Math.random() * source.length)];
        if (take("mt" + c4.key)) group.push(c4);
      }
      if (group.length < 4) break;
      var right = group.map(function (g) { return { glyph: g.kind === "letter" ? g.ipa : g.cn, from: g.glyph }; });
      qs.push({
        id: "mt" + i, type: "match", weight: w.matchPair, perPair: true,
        prompt: "第 " + (i + 1) + " 组：把左边和右边一一对上（点左边一个，再点右边一个，就画一条线）",
        left: shuffle(group.map(function (g) { return g.glyph; })),
        right: shuffle(right),
        keyOf: {}, answer: {}
      });
      group.forEach(function (g) {
        qs[qs.length - 1].keyOf[g.glyph] = g.kind === "letter" ? g.ipa : g.cn;
        qs[qs.length - 1].answer[g.glyph] = g.kind === "letter" ? g.ipa : g.cn;
      });
    }
    return qs;
  }

  /* ---------------- 单词卷 ----------------
   * 五种题：mc 看中文选英文 / pick 听音选词 / fill 按首字母补全 / spell 看中文默写 / match 英中连线。
   * 课末卷的池子就是本课那 10 个词，结课卷的池子是 20 课合起来的 200 个词。 */
  /* 挖字母：优先挖「按形状在全表里只命中这一个词」的那一处，命中数一样的时候挑挖得少的。
     3 个字母以内的词做不到唯一（ye_ 后面必然是 yes），这种题面本来就同时给了中文和音标，
     靠音标定位，不靠形状 —— 所以这里只保证「至少露一个字母、至少挖一个字母」。 */
  function maskWord(w, words) {
    var s = String(w), n = s.length;
    var list = (words || []).map(function (x) { return String(x.w || x.glyph || "").toLowerCase(); });
    var cands = [];
    for (var len = 1; len <= Math.min(3, n - 1); len++) {
      for (var start = 1; start + len <= n && start < n; start++) {
        var shown = s.slice(0, start) + "_".repeat(len) + s.slice(start + len);
        /* 一条下划线就是一个字母：挖空题的题面把词长也露出来了，判命中必须等长 */
        var re = new RegExp("^" + (s.slice(0, start) + "[a-z]".repeat(len) + s.slice(start + len)).toLowerCase() + "$");
        var hits = 0;
        for (var i = 0; i < list.length; i++) if (re.test(list[i])) hits++;
        cands.push({ shown: shown, hint: s.slice(0, start), hits: hits, len: len });
      }
    }
    if (!cands.length) return { shown: s, hint: s, len: 0 };                 // 单字母词（I）没得挖
    cands.sort(function (a, b) { return (a.hits - b.hits) || (a.len - b.len); });
    return cands[0];
  }
  function buildWordPaper(spec, pools) {
    var want = {};
    (spec.pool || []).forEach(function (cid) { want[cid] = 1; });
    var source = pools.words.filter(function (x) { return want[x.lesson]; });
    if (!source.length) source = pools.words;         /* 池子对不上也不出白卷，退回全量 */
    var n = spec.counts, w = spec.weights, per = spec.pairsPerGroup || 4;
    var qs = [], used = {}, i;
    function take(k) { if (used[k]) return false; used[k] = 1; return true; }
    function drawOne(prefix) {
      var it = null, t = 0;
      while (!it && t++ < 60) {
        var cand = source[Math.floor(Math.random() * source.length)];
        if (take(prefix + cand.key)) it = cand;
      }
      return it;
    }
    /* 干扰项优先挑同一个词性的：名词配名词、动词配动词，四类摆一起才是有效辨析。
       中文解释相同的项一律不当干扰 —— 那样会有两个正确答案。 */
    function others(it, k) {
      var pool = (source.length >= k + 1 ? source : pools.words).filter(function (x) {
        return x.key !== it.key && x.cnShort !== it.cnShort;
      });
      var same = pool.filter(function (x) { return x.pos === it.pos; });
      var rest = pool.filter(function (x) { return x.pos !== it.pos; });
      var picked = pick(same, Math.min(k, same.length));
      return picked.concat(pick(rest, k - picked.length));
    }

    /* ① 看中文选英文 —— 这一型不许带播放键：一点「听」就等于把答案念出来了 */
    for (i = 0; i < n.mc; i++) {
      var a = drawOne("mc");
      if (!a) break;
      var opts = shuffle([a].concat(others(a, 3)));
      qs.push({
        id: "mc" + i, type: "mc", weight: w.mc,
        prompt: "中文「" + a.cnShort + "（" + a.pos + "）」对应的英文单词是哪一个？",
        options: opts.map(function (o) { return o.glyph; }),
        answer: opts.findIndex(function (o) { return o.key === a.key; }),
        hintAudio: a.audio, said: a.glyph
      });
    }
    /* ② 听音选词 */
    for (i = 0; i < n.pick; i++) {
      var b = drawOne("pk");
      if (!b) break;
      var opts2 = shuffle([b].concat(others(b, 3)));
      qs.push({
        id: "pk" + i, type: "pick", weight: w.pick,
        prompt: "听录音，选出你听到的那个单词",
        options: opts2.map(function (o) { return o.glyph; }),
        answer: opts2.findIndex(function (o) { return o.key === b.key; }),
        audio: b.audio, said: b.glyph
      });
    }
    /* ③ 按提示补全单词（给中文与音标，挖掉中间两三个字母）
       这两题不给「听」按钮 —— 一听就等于把答案念出来了；复盘里才放出来。 */
    for (i = 0; i < n.fill; i++) {
      var c = drawOne("fl");
      if (!c) break;
      var mk = maskWord(c.glyph, pools.words);
      qs.push({
        id: "fl" + i, type: "fill", weight: w.fill,
        prompt: mk.len
          ? "把单词补全（" + mk.shown + " 里的下划线就是要补的字母，整词写出来）　" +
            c.cnShort + "，" + c.ipa
          : "这个中文就一个字母，写出来：" + c.cnShort + "（" + c.ipa + "）",
        answer: c.glyph, ipa: c.ipa, hintAudio: c.audio, said: c.glyph
      });
    }
    /* ④ 看中文默写英文 */
    for (i = 0; i < n.spell; i++) {
      var d = drawOne("sp");
      if (!d) break;
      qs.push({
        id: "sp" + i, type: "spell", weight: w.spell,
        prompt: "「" + d.cn + "」用英语怎么写？（" + d.pos + "，写原形）",
        answer: d.glyph, ipa: d.ipa, hintAudio: d.audio, said: d.glyph
      });
    }
    /* ⑤ 英文 ↔ 中文 连线：一组里两边的意思不许撞车（pear 和 pair 这种同音词在两边各出现一次就没法连了） */
    for (i = 0; i < n.match; i++) {
      var group = [], seenCn = {}, t = 0;
      while (group.length < per && t++ < 200) {
        var e = source[Math.floor(Math.random() * source.length)];
        if (!take("mt" + e.key)) continue;
        if (seenCn[e.cnShort]) { used["mt" + e.key] = 0; continue; }   /* 撤掉这条占用，换下一个 */
        seenCn[e.cnShort] = 1;
        group.push(e);
      }
      if (group.length < per) break;
      var last = qs.length;
      qs.push({
        id: "mt" + i, type: "match", weight: w.matchPair, perPair: true,
        prompt: "第 " + (i + 1) + " 组：把左边的单词和右边的中文连起来（点左边一个，再点右边一个）",
        left: shuffle(group.map(function (g) { return g.glyph; })),
        right: shuffle(group.map(function (g) { return { glyph: g.cnShort, from: g.glyph }; })),
        keyOf: {}, answer: {}
      });
      group.forEach(function (g) {
        qs[last].keyOf[g.glyph] = g.cnShort;
        qs[last].answer[g.glyph] = g.cnShort;
      });
    }
    return qs;
  }

  /* ---------------- 判分 ---------------- */
  function normWrite(s) {
    return String(s == null ? "" : s).trim().replace(/^\/|\/$/g, "").replace(/\s+/g, "").toUpperCase();
  }
  /* 单词的宽松比对：去首尾空格、折中间空格、忽略大小写、丢掉末尾的句点 */
  function normWord(s) {
    return String(s == null ? "" : s).trim().toLowerCase().replace(/[.\s]+/g, " ").trim();
  }
  function gradeEN(questions, answers, passLine) {
    var PASS = passLine == null ? 60 : passLine;
    var items = [], full = 0, got = 0;
    questions.forEach(function (q, idx) {
      var a = answers[idx], ok = false, pts = 0, saw = "";
      if (q.type === "mc" || q.type === "pick") {
        full += q.weight;
        ok = a != null && a === q.answer;
        pts = ok ? q.weight : 0;
        saw = ok ? "选对了：" + q.options[q.answer]
          : "你选「" + (a == null ? "没作答" : q.options[a]) + "」，正确的是「" + q.options[q.answer] + "」";
      } else if (q.type === "write") {
        full += q.weight;
        ok = normWrite(a) === normWrite(q.answer);
        pts = ok ? q.weight : 0;
        saw = ok ? "写对了：" + q.answer : "你写「" + (a || "没作答") + "」，正确的是「" + q.answer + "」";
      } else if (q.type === "fill" || q.type === "spell") {
        full += q.weight;
        ok = a != null && normWord(a) === normWord(q.answer);
        pts = ok ? q.weight : 0;
        saw = ok ? "写对了：" + q.answer + " " + (q.ipa || "")
          : "你写「" + (a || "没作答") + "」，正确的是「" + q.answer + "」";
      } else if (q.type === "match") {
        var keys = Object.keys(q.answer);
        full += keys.length * q.weight;
        var rightCnt = 0, wrongDesc = [];
        keys.forEach(function (l) {
          if (a && a[l] === q.answer[l]) rightCnt++;
          else wrongDesc.push(l + " 应对 " + q.answer[l] + (a && a[l] ? "（你连的是 " + a[l] + "）" : ""));
        });
        pts = rightCnt * q.weight;
        ok = rightCnt === keys.length;
        saw = rightCnt + "/" + keys.length + " 对" + (wrongDesc.length ? "；" + wrongDesc.join("；") : "：全对");
      }
      got += pts;
      items.push({ id: q.id, type: q.type, ok: ok, pts: pts, weight: q.type === "match" ? Object.keys(q.answer).length * q.weight : q.weight, saw: saw, prompt: q.prompt });
    });
    var score = full ? Math.round(got * 100 / full) : 0;
    return { items: items, score: score, full: full, got: got, passed: score >= PASS, passLine: PASS };
  }

  /* ---------------- 界面 ---------------- */
  var curAudio = null;
  function stopAudio() { if (curAudio) { try { curAudio.pause(); } catch (e) { } curAudio = null; } }
  function playBtn(src, label) {
    if (!src) return "";
    return '<button class="eq-play" type="button" data-audio="' + esc(src) + '" title="播放录音">' +
      '<span class="eq-ico">▶</span><span class="eq-tx">听</span></button>';
  }

  function renderEN(app, tid, cid, spec) {
    app.innerHTML = '<div class="ide"><div class="ide-loading">考卷组卷中…</div></div>';
    var need = spec.kind === "enword" ? API.get("/api/words/enword") : API.get("/api/meta");
    need.then(function (d) {
      var pools;
      if (spec.kind === "enword") {
        pools = { words: wordPool(d.words || []) };
        if (!pools.words.length) throw new Error("200 词的单词表没加载上，考卷出不了");
      } else {
        var en = d.en || { letters: [], phonemes: [] };
        pools = { letters: letterPool(en.letters || []), phonemes: phonemePool(en.phonemes || []) };
        if (!pools.letters.length && !pools.phonemes.length) throw new Error("字母与音标数据没下发，考卷出不了");
      }
      draw(app, tid, cid, spec, pools);
    }).catch(function (e) {
      app.innerHTML = '<div class="ide"><div class="ide-loading"><h2>这场考试打不开</h2><p>' + esc(e.message || "") + "</p>" +
        '<a class="btn btn-primary" href="#/read/' + esc(tid) + "/" + esc(cid) + '">回到课文</a></div></div>';
    });
  }

  function draw(app, tid, cid, spec, pools) {
    var qs = buildPaper(spec, pools);
    var answers = {};
    qs.forEach(function (q, i) { answers[i] = q.type === "match" ? {} : null; });

    app.innerHTML =
      '<div class="ide">' +
      '<div class="ide-titlebar">' +
      '<button class="ide-exit" id="enExit" type="button">← 退出考试</button>' +
      '<div class="ide-tb-mid">' + esc(spec.title) + "</div>" +
      '<div class="ide-tb-right"><button class="ide-btn ide-btn-go" id="enSubmit" type="button">交卷</button></div>' +
      "</div>" +
      '<div class="en-wrap2">' +
      '<div class="en-intro"><b>' + esc(spec.task) + "</b><div class=\"sd-hint\">" + esc(spec.hint || "") + "</div>" +
      '<div class="sd-hint">共 ' + qs.length + " 题，满分 100，" + (spec.pass || 60) + " 分通过。" +
      (spec.kind === "enword" ? "听力题不限遍数；补全和默写题没有读音可点，交卷后复盘里能听。"
        : "听力题想听几遍就点几遍。") + "</div></div>" +
      '<div class="en-qs">' + qs.map(function (q, i) { return cardHtml(q, i); }).join("") + "</div>" +
      "</div>" +
      '<div class="ide-status"><span class="st">⑥ 考试模式</span><span class="st" id="enProg">已答 0 / ' + qs.length + "</span>" +
      '<span class="st st-score" id="enScore">还没交卷</span></div>' +
      "</div>";

    bind(app, qs, answers);

    $("#enExit", app).onclick = function () { location.hash = "#/read/" + tid + "/" + cid; };
    $("#enSubmit", app).onclick = function () {
      var blank = qs.filter(function (q, i) { return unanswered(q, answers[i]); }).length;
      if (blank && !root.confirm("还有 " + blank + " 题没做完，确定交卷？")) return;
      var r = gradeEN(qs, answers, spec.pass);
      var box = $("#enResult", app) || doc.createElement("div");
      if (!$("#enResult", app)) { box.id = "enResult"; doc.querySelector(".en-wrap2").appendChild(box); }
      box.className = "en-result";
      box.innerHTML =
        '<div class="rs-score ' + (r.passed ? "ok" : "no") + '">' + r.score + "<small>/100 · " + (r.passed ? "通过" : "未通过") + "</small></div>" +
        '<div class="sd-sec">逐题回看（错了的这里能再听一遍）</div>' +
        '<ul class="en-review">' + r.items.map(function (it, i) {
          return '<li class="' + (it.ok ? "pass" : "fail") + '"><span class="ck-mark">' + (it.ok ? "✓" : "✗") + "</span>" +
            "<div><div>第 " + (i + 1) + " 题 · " + esc(typeNameCn(it.type)) + " " + it.pts + "/" + it.weight + " 分</div>" +
            '<div class="ck-saw">' + esc(it.saw) + "　" + playBtn(qs[i].audio || qs[i].hintAudio, "") + "</div></div></li>";
        }).join("") + "</ul>" +
        '<div class="rs-ops">' +
        (r.passed
          ? '<a class="btn btn-primary btn-sm" href="#/read/' + esc(tid) + "/" + esc(cid) + '">回课文，已标记完成</a>'
          : '<button class="btn btn-primary btn-sm" id="enRetry" type="button">换一套题重考</button>') +
        "</div>";
      $("#enScore", app).textContent = "得分 " + r.score + "（" + (r.passed ? "已过" : "未过") + "）";
      if (box.scrollIntoView) { try { box.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) { /* jsdom 之类没实现，跳过 */ } }
      var retry = $("#enRetry", box);
      if (retry) retry.onclick = function () { draw(app, tid, cid, spec, pools); };
      bindAudio(box);
      if (r.passed && root.MIAO_EXAM_UI && root.MIAO_EXAM_UI.onPassed) root.MIAO_EXAM_UI.onPassed(tid, cid, { score: r.score, passed: true });
    };
  }
  function typeNameCn(t) {
    if (t === "mc") return "单项选择";
    if (t === "pick") return "听音选词";
    if (t === "write") return "听写";
    if (t === "fill") return "补全单词";
    if (t === "spell") return "中译英默写";
    return "勾线配对";
  }
  function unanswered(q, a) {
    if (q.type === "match") return Object.keys(a || {}).length < Object.keys(q.answer).length;
    return a == null || a === "";
  }

  function cardHtml(q, i) {
    var head = '<div class="en-qhead"><span class="en-qno">' + (i + 1) + "</span><span class=\"en-qprompt\">" + esc(q.prompt) + "</span>" +
      playBtn(q.audio, "") + '<span class="en-qw">' + (q.type === "match" ? "每对 " + q.weight + " 分" : q.weight + " 分") + "</span></div>";
    if (q.type === "mc" || q.type === "pick") {
      return '<div class="en-card-q" data-q="' + i + '">' + head +
        '<div class="en-opts">' + q.options.map(function (o, oi) {
          return '<label class="en-opt"><input type="radio" name="q' + i + '" value="' + oi + '"><span>' + esc(o) + "</span></label>";
        }).join("") + "</div></div>";
    }
    if (q.type === "write" || q.type === "fill" || q.type === "spell") {
      var ph = q.type === "fill" ? "把缺的字母补上，写完整个单词" : q.type === "spell" ? "写英文原形，大小写都行" : "听清楚再写";
      return '<div class="en-card-q" data-q="' + i + '">' + head +
        '<input class="en-write" type="text" autocomplete="off" spellcheck="false" placeholder="' + ph + '">' +
        (q.palette && q.palette.length > 30 ? '<div class="en-palette">' + q.palette.map(function (s) {
          return '<button class="pal" type="button">' + esc(s) + "</button>";
        }).join("") + "</div>" : "") + "</div>";
    }
    /* 勾线题：两栏 + 中间 SVG 画线 */
    return '<div class="en-card-q en-match" data-q="' + i + '">' + head +
      '<div class="en-cols"><div class="en-col left">' + q.left.map(function (l) {
        return '<button class="en-node" data-side="l" data-v="' + esc(l) + '" type="button"><span>' + esc(l) + "</span></button>";
      }).join("") + "</div>" +
      '<svg class="en-lines"></svg>' +
      '<div class="en-col right">' + q.right.map(function (r) {
        return '<button class="en-node" data-side="r" data-v="' + esc(r.glyph) + '" type="button"><span>' + esc(r.glyph) + "</span></button>";
      }).join("") + "</div></div>" +
      '<div class="en-pairs" data-pairs></div></div>';
  }

  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }

  function bindAudio(scope) {
    $$(".eq-play", scope).forEach(function (b) {
      b.onclick = function (ev) {
        ev.preventDefault();
        var src = b.getAttribute("data-audio");
        if (!src) return;
        if (curAudio && curAudio.dataset.src === src) { stopAudio(); return; }
        stopAudio();
        var a = new Audio(root.MIAO_URL ? root.MIAO_URL(src) : src);
        a.dataset.src = src;
        curAudio = a;
        b.classList.add("playing");
        a.onended = function () { b.classList.remove("playing"); };
        a.onerror = function () { b.classList.remove("playing"); };
        try { a.play(); } catch (e) { }
      };
    });
  }

  function bind(app, qs, answers) {
    bindAudio(app);
    qs.forEach(function (q, i) {
      var card = $('.en-card-q[data-q="' + i + '"]', app);
      if (!card) return;
      if (q.type === "mc" || q.type === "pick") {
        $$('input[type=radio]', card).forEach(function (r) {
          /* 原生 radio 点已选中的那颗不会自己取消，考生就没法改主意 —— 补一条「再点一次 = 不选」 */
          r.addEventListener("click", function () {
            if (r.dataset.was === "1") {
              r.checked = false; r.dataset.was = "";
              answers[i] = null; updProgress(app, qs, answers);
            }
          });
          r.onchange = function () {
            $$('input[type=radio]', card).forEach(function (x) { x.dataset.was = ""; });
            r.dataset.was = r.checked ? "1" : "";
            answers[i] = r.checked ? Number(r.value) : null;
            updProgress(app, qs, answers);
          };
        });
      } else if (q.type === "write" || q.type === "fill" || q.type === "spell") {
        var inp = $(".en-write", card);
        inp.oninput = function () { answers[i] = inp.value; updProgress(app, qs, answers); };
        $$(".pal", card).forEach(function (p) {
          p.onclick = function () {
            inp.value += p.textContent; inp.dispatchEvent(new Event("input", { bubbles: true })); inp.focus();
          };
        });
      } else if (q.type === "match") {
        wireMatch(card, i, q, answers, app, qs);
      }
    });
    updProgress(app, qs, answers);
  }

  function wireMatch(card, qi, q, answers, app, qs) {
    var sel = null;
    var cols = $(".en-cols", card), lines = $(".en-lines", card), pairsBox = $("[data-pairs]", card);
    function nodeAt(side, val) {
      var hit = null;
      $$(".en-node", card).forEach(function (x) {
        if (x.getAttribute("data-side") === side && x.getAttribute("data-v") === String(val)) hit = x;
      });
      return hit;
    }
    function redraw() {
      var map = answers[qi] || {};
      /* 参照系统一取 .en-cols：SVG 是 inset:0 铺在它身上的。
         从前按整张卡片算，坐标比 SVG 盒子多出一截，线全画到盒子外面被裁掉 —— 这就是「连不上」的根因。 */
      var cb = cols.getBoundingClientRect();
      lines.innerHTML = "";
      lines.setAttribute("viewBox", "0 0 " + cb.width + " " + cb.height);
      lines.setAttribute("preserveAspectRatio", "none");
      $$(".en-node", card).forEach(function (x) { x.classList.remove("linked", "sel"); x.style.borderColor = ""; });
      var colors = ["#fb7da8", "#2f6feb", "#2fbf71", "#e8833a"];
      var n = 0;
      Object.keys(map).forEach(function (l) {
        var le = nodeAt("l", l), re = nodeAt("r", map[l]);
        if (!le || !re) return;
        var a = le.getBoundingClientRect(), b = re.getBoundingClientRect();
        var c = colors[(n++) % colors.length];
        var x1 = a.right - cb.left, y1 = a.top + a.height / 2 - cb.top;
        var x2 = b.left - cb.left, y2 = b.top + b.height / 2 - cb.top;
        var path = doc.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M" + x1 + " " + y1 + " C" + (x1 + 34) + " " + y1 + " " + (x2 - 34) + " " + y2 + " " + x2 + " " + y2);
        path.setAttribute("stroke", c); path.setAttribute("fill", "none"); path.setAttribute("stroke-width", "2.5");
        lines.appendChild(path);
        le.style.borderColor = c; re.style.borderColor = c;
        le.classList.add("linked"); re.classList.add("linked");
      });
      pairsBox.innerHTML = Object.keys(map).map(function (l) {
        return '<span class="en-pair">' + esc(l) + " → " + esc(map[l]) + '<b data-un="' + esc(l) + '">×</b></span>';
      }).join("");
      $$("[data-un]", pairsBox).forEach(function (b2) {
        b2.onclick = function () {
          delete answers[qi][b2.getAttribute("data-un")];
          redraw(); updProgress(app, qs, answers);
        };
      });
    }
    $$(".en-node", card).forEach(function (nd) {
      nd.onclick = function () {
        var side = nd.getAttribute("data-side"), val = nd.getAttribute("data-v");
        if (side === "l") {
          /* 再点一次已经选中的左边 = 取消选择 */
          if (sel === val) { sel = null; nd.classList.remove("sel"); return; }
          $$('.en-node[data-side="l"]', card).forEach(function (x) { x.classList.remove("sel"); });
          nd.classList.add("sel"); sel = val; return;
        }
        if (!sel) {
          card.classList.add("shake"); setTimeout(function () { card.classList.remove("shake"); }, 350);
          toast("先点左边一个，再点右边它对应的读音");
          return;
        }
        answers[qi] = answers[qi] || {};
        /* 同一个左项只能连一条线；右项被占了就让给新连的这条 */
        Object.keys(answers[qi]).forEach(function (l) { if (answers[qi][l] === val) delete answers[qi][l]; });
        answers[qi][sel] = val;
        sel = null;
        redraw(); updProgress(app, qs, answers);
      };
    });
    if (root.addEventListener) {
      root.addEventListener("resize", redraw);
      root.addEventListener("load", redraw);        /* 字体/图片晚到一步会改变盒子，补画一次 */
    }
    setTimeout(redraw, 30);
  }
  /* 页脚那套 toast 在 app.js 里是私有的，考试这两份界面各自留一个最小的 */
  function toast(msg) {
    var box = doc.querySelector("#toast");
    if (!box) return;
    var el = doc.createElement("div");
    el.className = "toast-item"; el.textContent = msg;
    box.appendChild(el);
    setTimeout(function () { el.style.opacity = "0"; el.style.transition = "opacity .4s"; }, 1800);
    setTimeout(function () { el.remove(); }, 2300);
  }
  function updProgress(app, qs, answers) {
    var done = qs.filter(function (q, i) { return !unanswered(q, answers[i]); }).length;
    var el = $("#enProg", app);
    if (el) el.textContent = "已答 " + done + " / " + qs.length;
  }

  root.MIAO_EXAM_EN = {
    render: renderEN, buildPaper: buildPaper, gradeEN: gradeEN,
    letterPool: letterPool, phonemePool: phonemePool, wordPool: wordPool,
    maskWord: maskWord, normWrite: normWrite, normWord: normWord
  };
  if (typeof module === "object" && module.exports) module.exports = root.MIAO_EXAM_EN;
})(typeof window !== "undefined" ? window : globalThis);
