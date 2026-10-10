/* 喵站 · 本地数据层 + 按需加载（取代原来的 assets/js/api.js 与整个后端）
 *
 * 站点是纯静态的：正文、题库、音频都在 assets/ 下面，浏览器直接读，没有任何接口请求。
 * 这个文件干四件事：
 *   1. 首屏只吃 assets/data/index.js（轻量目录：课程元信息 + 每章标题 + 该课要加载哪些脚本）；
 *   2. 读者点进哪一门课，才把那一门的正文脚本注进页面 —— 没点开的课一个字节都不下载；
 *      进考场才拉那一门的题库；只有 Python 那种要真跑代码的考场，才拉沙箱那四份引擎；
 *   3. 提供 window.MIAO_API —— 和以前同名同形的 get/post/del，但全部走本地，返回 Promise；
 *   4. 该存机的东西（收藏、学习进度、考试成绩）落在 localStorage。
 *
 * 目录（index.js）由 `node dev/tools/gen-index.js` 从各门课的数据文件生成，别手改；
 * 「要加载哪些脚本」这份清单在 assets/data/site.js，加一门课只改那一处。
 *
 * 代价（照旧写在明面上）：
 *   - 正文与考卷可被整包下载：静态文件在浏览器里就是全文可见；
 *   - 换设备 / 清缓存 → 收藏、进度、成绩全部归零，没有任何同步；
 *   - 「考过才算完成」的判定在前端，想绕的人改内存就能绕；
 *   - 搜索只覆盖课程名与章节标题：正文没加载，就不为了一次搜索把全站拉下来。
 */
(function (root) {
  "use strict";

  var SITE = root.MIAO_SITE || { categories: {}, tutorials: [], announcements: [], contact: {} };
  var INDEX = root.MIAO_INDEX || { tutorials: [] };

  /* ---------------- 资源地址：一份数据两种部署 ----------------
     数据文件里写的都是 /assets/... 绝对路径（挂任何静态托管都对）。
     但「双击 index.html 直接开」时页面在 file://，绝对路径会指到文件系统根上去，
     所以这种场合把开头的 / 去掉，变成相对 index.html 的路径。 */
  var FILE_MODE = false;
  try { FILE_MODE = String(root.location && root.location.protocol) === "file:"; } catch (e) { /* 没有 location 就当 HTTP */ }
  function url(p) {
    var s = String(p == null ? "" : p);
    return FILE_MODE && s.charAt(0) === "/" ? s.slice(1) : s;
  }
  root.MIAO_URL = url;
  root.MIAO_FILE_MODE = FILE_MODE;

  /* ---------------- 脚本按需注入 ---------------- */
  var LOADED = {};                      /* 路径 → Promise，同一个文件只拉一次 */
  function loadJs(src) {
    if (LOADED[src]) return LOADED[src];
    LOADED[src] = new Promise(function (resolve, reject) {
      var s = root.document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = function () { resolve(src); };
      s.onerror = function () {
        delete LOADED[src];
        reject(new Error("脚本没加载上：" + src));
      };
      root.document.body.appendChild(s);
    });
    return LOADED[src];
  }
  function loadAll(list) {
    return (list || []).reduce(function (p, src) {
      return p.then(function () { return loadJs(src); });       /* 有顺序依赖，必须串着来 */
    }, Promise.resolve());
  }

  /* ---------------- 目录 → 教程对象 ---------------- */
  var REG = {};
  (INDEX.tutorials || []).forEach(function (t) { REG[t.id] = t; });

  function lite(t) {
    return {
      id: t.id, engine: t.engine || "", source: t.source || "",
      title: t.title, intro: t.intro, cat: t.cat, diff: t.diff, tags: t.tags || [],
      author: t.author, thumb: t.thumb || "", cover: t.cover || "", hero: t.hero || "",
      updated: t.updated || "", chaps: t.chaps,
      keywords: t.keywords || [],
      chapters: (t.chapters || []).map(function (c) { return { id: c.id, title: c.title }; }),
      examIds: t.examIds || []
    };
  }
  var TUTS = (INDEX.tutorials || []).map(lite);
  root.MIAO_DATA = { categories: SITE.categories, tutorials: TUTS };

  function findTut(id) {
    for (var i = 0; i < TUTS.length; i++) if (TUTS[i].id === id) return TUTS[i];
    return null;
  }

  /* ---------------- 拉正文：一门课的全套脚本 → window 上的数据包 ---------------- */
  var FULL = {};                        /* 教程 id → 带 blocks 的完整章节 */
  function mountPack(id) {
    var reg = REG[id];
    if (!reg) return null;
    var pack = root[reg.source];
    if (!pack || !pack.tutorial) return null;
    if (pack.tutorial.id !== id) {
      console.error("[数据层] " + id + " 登记的包名 " + reg.source + " 装的是另一门课：" + pack.tutorial.id);
      return null;
    }
    /* 微软那几门课的正文是逐课文件，挂载层要把「已填的课」整章顶掉骨架里的占位块。
       脚本只执行一次，所以这里按登记里的装配函数名再调一次。 */
    if (reg.mount && typeof root[reg.mount] === "function") root[reg.mount]();
    var t = pack.tutorial;
    FULL[id] = (t.chapters || []).map(function (c) {
      return { id: c.id, title: c.title, blocks: c.blocks || [] };
    });
    return pack;
  }
  function ensureCourse(id) {
    if (FULL[id]) return Promise.resolve(true);
    var reg = REG[id];
    if (!reg) return Promise.reject(new Error("没有这门课：" + id));
    return loadAll(reg.files).then(function () {
      if (mountPack(id)) return true;
      throw new Error("这门课的正文文件没把数据包挂上：" + id);
    });
  }

  /* ---------------- 考卷：按课拉题包，Python 那种还要拉沙箱 ---------------- */
  var PAPERS = {};                      /* 教程 id → { cid → 卷面 } */
  var ENGINES = SITE.engines || {};     /* 三套考场界面各自要哪几份脚本，清单在 site.js */

  function engineFiles(kind) { return ENGINES[kind] || []; }

  function collectPapers(id) {
    var out = {};
    if (id === "python") {
      var py = root.MIAO_PY_EXAM || { exams: {} };
      Object.keys(py.exams || {}).forEach(function (cid) { out[cid] = py.exams[cid]; });
      (root.MIAO_PY_EXAM_PARTS || []).forEach(function (e) { if (e && e.cid) out[e.cid] = e; });
    } else if (id === "english") {
      var en = root.MIAO_EN_EXAM || null;
      if (en) (en.exams || []).forEach(function (e) {
        e.kind = "en"; e.counts = en.counts; e.weights = en.weights; e.pass = e.pass == null ? en.pass : e.pass;
        out[e.cid] = e;
      });
    } else if (id === "enwords") {
      var ew = root.MIAO_ENW_EXAM || null;
      if (ew) (ew.papers || []).forEach(function (e) {
        e.kind = "enword"; e.pass = e.pass == null ? ew.pass : e.pass;
        out[e.cid] = e;
      });
    }
    return out;
  }
  function ensureExam(id, cid) {
    var reg = REG[id];
    if (!reg) return Promise.reject(new Error("没有这门课：" + id));
    /* 出卷子既要题包也要池子：字母 / 音标 / 200 词都在课文正文里，所以正文先拉 */
    return ensureCourse(id)
      .then(function () { return loadAll((reg.examFiles || []).concat(engineFiles(reg.engine))); })
      .then(function () {
        /* 脚本顺序写反时，沙箱那几份会「加载成功但全局名不在」—— 宁可在这里说清楚 */
        if (reg.engine === "code" && !root.MIAO_EXAM) {
          throw new Error("Python 考场的沙箱没装配起来（site.js 里 engines.code 的顺序必须是 py-* 在 exam-grade 之前）");
        }
        if (reg.engine && !root.MIAO_EXAM_UI) throw new Error("考场界面（exam-ui.js）没加载上");
        PAPERS[id] = collectPapers(id);
        return true;
      });
  }
  function paperOf(id, cid) {
    return (PAPERS[id] || {})[cid] || null;
  }

  /* ---------------- 本机存储 ---------------- */
  function read(k, dft) { try { var v = localStorage.getItem(k); return v === null ? dft : JSON.parse(v); } catch (e) { return dft; } }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.warn("[数据层] 本机存储写不进去", k, e); } }
  var K_FAV = "miao_favs", K_RESULT = "miao_exam_results", K_PROGRESS = "miao_progress";

  function favs() { return read(K_FAV, []); }
  function setFavs(a) { write(K_FAV, a); }
  function results(tid, cid) {
    var all = read(K_RESULT, {});
    if (tid === undefined) return all;
    if (cid === undefined) return all[tid] || {};
    return (all[tid] || {})[cid] || null;
  }
  function putResult(tid, cid, r) {
    var all = read(K_RESULT, {});
    var byT = all[tid] || (all[tid] = {});
    byT[cid] = r;
    write(K_RESULT, all);
  }
  function passedIds(tid) {
    var byT = results(tid);
    return Object.keys(byT).filter(function (cid) { return byT[cid] && byT[cid].passed; });
  }

  /* ---------------- 路由：以前打在 /api 上的，现在在本地算 ---------------- */
  function ok(data) { return Promise.resolve(data); }
  function fail(msg) { return Promise.reject(new Error(msg)); }

  function chapterBody(id, cid) {
    var arr = FULL[id] || [];
    for (var i = 0; i < arr.length; i++) if (arr[i].id === cid) return arr[i];
    return null;
  }
  /* 单词卡块只写了章号，这里把那一课的十个词填进去（词表全站在 pack.words 里只存一份） */
  function fillWordBlocks(ch) {
    var pack = root.MIAO_ENW;
    if (!ch || !pack || !pack.words) return ch;
    (ch.blocks || []).forEach(function (b) {
      if (b.t === "en" && b.kind === "word" && b.ref && !b.items) {
        b.items = pack.words.filter(function (w) { return w.lesson === b.ref; });
      }
    });
    return ch;
  }

  function get(path) {
    var clean = String(path).split("#")[0];
    var parts = clean.split("?")[0].replace(/^\/+|\/+$/g, "").split("/");

    if (parts[0] !== "api") return fail("本地数据层不认识这个路径：" + path);

    if (parts[1] === "meta") {
      var enPack = root.MIAO_EN;        /* 只有点过那门发音课才在页面上 */
      return ok({
        site: "喵站", mailReady: false, static: true,
        categories: SITE.categories,
        en: enPack ? { letters: enPack.letters || [], phonemes: enPack.phonemes || [], groups: enPack.groups || [] } : null,
        stats: {
          tutorials: TUTS.length,
          chapters: TUTS.reduce(function (a, t) { return a + (t.chaps || 0); }, 0)
        }
      });
    }
    if (parts[1] === "announcements") return ok({ items: SITE.announcements || [] });
    if (parts[1] === "contact") return ok(SITE.contact || {});

    /* 字母与音标卡片的数据：拉那门课的脚本，不在首屏 */
    if (parts[1] === "en" && parts[2] === "cards") {
      return ensureCourse("english").then(function () {
        var p = root.MIAO_EN || {};
        return { letters: p.letters || [], phonemes: p.phonemes || [], groups: p.groups || [] };
      });
    }
    /* 200 词的单词表：词卡数据在 enwords 包里，正文块只写章号，这里按章号把词填进块里 */
    if (parts[1] === "words") {
      return ensureCourse("enwords").then(function () {
        var p = root.MIAO_ENW || {};
        return { words: p.words || [] };
      });
    }

    if (parts[1] === "tutorials" && parts.length === 2) {
      var size = Number((/size=(\d+)/.exec(clean) || [])[1]) || 50;
      return ok({ items: TUTS, total: TUTS.length, page: 1, size: size });
    }
    if (parts[1] === "tutorials" && parts.length >= 3) {
      var id = parts[2];
      if (!REG[id]) return fail("没有这本教程：" + id);
      if (parts[3] === "chapters") {
        var cid = decodeURIComponent(parts[4] || "");
        return ensureCourse(id).then(function () {
          var c = chapterBody(id, cid);
          if (!c) return fail("这本教程里没有这一章：" + cid);
          var t = findTut(id);
          var chars = JSON.stringify(c.blocks).length;
          return {
            title: t && t.title, tutorial: t,
            chapter: { id: c.id, title: c.title, blocks: fillWordBlocks(c).blocks },
            window: { hasMore: false, served: chars, nextOffset: chars, totalChars: chars }
          };
        });
      }
      if (parts[3] === "fav") return ok({ faved: favs().indexOf(id) >= 0 });
      return ensureCourse(id).then(function () {
        var t = findTut(id), reg = REG[id];
        var ids = (reg && reg.examIds) || [];
        var passed = passedIds(id), scores = {};
        passed.forEach(function (x) { scores[x] = results(id, x).best; });
        /* 详情用的章节目录此刻已经能给出真 blocks，阅读页的上下篇与目录树都靠它 */
        if (t) t.chapters = FULL[id] || t.chapters;
        return {
          tutorial: t, locked: false, faved: favs().indexOf(id) >= 0, relation: null,
          progress: (read(K_PROGRESS, {})[id] || []),
          examIds: ids, examPassed: passed, examScores: scores
        };
      });
    }
    if (parts[1] === "my" && parts[2] === "favs") {
      return ok({ items: TUTS.filter(function (x) { return favs().indexOf(x.id) >= 0; }) });
    }
    if (parts[1] === "exams" && parts.length === 4) {
      var tid = parts[2], ecid = parts[3];
      return ensureExam(tid, ecid).then(function () {
        var paper = paperOf(tid, ecid);
        if (!paper) return fail("这一课没有排考试：" + tid + "/" + ecid);
        var my = results(tid, ecid);
        return { exam: paper, my: my ? { best: my.best, attempts: my.attempts, passed: my.passed } : null };
      });
    }
    return fail("本地数据层不认识这个路径：" + path);
  }

  function post(path, body) {
    var parts = String(path).split("?")[0].replace(/^\/+|\/+$/g, "").split("/");
    if (parts[1] === "tutorials" && parts[3] === "fav") {
      var id = parts[2], list = favs();
      if (list.indexOf(id) < 0) list.push(id);
      setFavs(list);
      return ok({ faved: true, favs: list.length });
    }
    if (parts[1] === "exams" && parts.length === 5 && parts[4] === "result") {
      var tid = parts[2], cid = parts[3];
      return ensureExam(tid, cid).then(function () {
        var paper = paperOf(tid, cid);
        if (!paper) return fail("这一课没有排考试：" + tid + "/" + cid);
        var score = Math.round(Number(body && body.score));
        if (!isFinite(score) || score < 0 || score > 100) return fail("分数得是 0 到 100 之间的数");
        var passLine = paper.pass == null ? 60 : paper.pass;
        var passed = score >= passLine;
        var prev = results(tid, cid) || { best: 0, attempts: 0, passed: false };
        var best = Math.max(score, prev.best);
        putResult(tid, cid, {
          best: best, attempts: prev.attempts + 1, passed: passed || !!prev.passed,
          last: score, at: Date.now()
        });
        if (passed) {   /* 考过才打完成标记 */
          var prog = read(K_PROGRESS, {});
          var arr = prog[tid] || (prog[tid] = []);
          if (arr.indexOf(cid) < 0) arr.push(cid);
          write(K_PROGRESS, prog);
        }
        return ok({ score: score, best: best, passed: passed, passLine: passLine, local: true });
      });
    }
    return fail("本地数据层不认识这个写操作：" + path);
  }

  function del(path) {
    var parts = String(path).split("?")[0].replace(/^\/+|\/+$/g, "").split("/");
    if (parts[1] === "tutorials" && parts[3] === "fav") {
      var id = parts[2], list = favs().filter(function (x) { return x !== id; });
      setFavs(list);
      return ok({ faved: false, favs: list.length });
    }
    return fail("本地数据层不认识这个删除：" + path);
  }

  root.MIAO_API = {
    get: get, post: post, del: del,
    /* 视图层要「先拉正文再渲染」时用它 */
    ensureCourse: ensureCourse, ensureExam: ensureExam,
    loadedScripts: function () { return Object.keys(LOADED); },
    _local: {
      tutorials: TUTS, index: INDEX, papers: function (id) { return PAPERS[id] || {}; },
      full: FULL, favs: favs, results: results, site: SITE, reg: REG
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
