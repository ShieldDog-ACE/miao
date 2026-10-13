/* 喵站 · 本地数据层 + 分层按需加载（取代原来的 assets/js/api.js 与整个后端）
 *
 * 站点是纯静态的：正文、题库、音频都在 assets/ 下面，浏览器直接读，没有任何接口请求。
 * 这个文件干四件事：
 *   1. 首屏只吃 assets/data/index.js（轻量目录：课程元信息 + 每章标题 + boot/chunks 两张表）；
 *   2. 读者点开哪一章，才拉「那一章的分片」—— 骨架(boot) + 一片正文，其余一片都不动；
 *      这一章到位之后读者若没别的动作，空了再把同一门课剩下的分片按就近顺序补齐；
 *      进考场才拉那一门的题库与界面引擎（只有 Python 那种要真跑代码的考场才拉沙箱四份）；
 *   3. 提供 window.MIAO_API —— 和以前同名同形的 get/post/del，但全部走本地，返回 Promise；
 *   4. 该存机的东西（收藏、学习进度、考试成绩）落在 localStorage。
 *
 * 目录（index.js）由 `node dev/tools/gen-index.js` 从各门课的数据文件生成，别手改；
 * 「骨架是哪几份、哪些文件算分片」这份清单在 assets/data/site.js，加一门课只改那一处。
 *
 * 代价（照旧写在明面上）：
 *   - 正文与考卷可被整包下载：静态文件在浏览器里就是全文可见，预取跑完就等于全书在场；
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

  /* ---------------- 拉正文：分层 —— 骨架(boot) + 那一章的分片(chunk) ----------------
     以前是「点进一门课 = 把这门课的所有正文脚本一次注完」，132 章那门要 1.3 MB 才开得了页。
     现在目录里带了 boot（装配层 + 骨架，几 KB 到 60 KB）与 chunks（每一章的正文在哪个文件），
     点开哪一章就只拉那一章的分片；这一章到位之后人如果没别的事，空了再把同门其余分片补齐。 */
  var FULL = {};                        /* 教程 id → 目前拼得出的章节（带 blocks） */
  var BOOT = {};                        /* 教程 id → Promise，骨架只注一次 */
  var BOOTED = {};                      /* 教程 id → 骨架是否真的拼好了（promise 在场不算） */
  var DONE = {};                        /* 教程 id → 这门课的分片是否已全在场（全在场才允许装配层报缺章） */
  var CHUNK_OF = {};                    /* 教程 id → { 章 id → 分片文件 } */
  var PARTIAL = 0;                      /* 还没拉齐的课数 —— 装配层据此决定要不要为「这一章还没拉」刷控制台 */
  function markPartial(on) { PARTIAL = Math.max(0, PARTIAL + (on ? 1 : -1)); root.MIAO_PARTIAL = PARTIAL > 0; }

  function bootFiles(id) {
    var reg = REG[id] || {};
    return reg.boot && reg.boot.length ? reg.boot : (reg.files || []);
  }
  function chunkMap(id) {
    if (!CHUNK_OF[id]) {
      var ch = (REG[id] || {}).chunks || {}, out = {};
      Object.keys(ch).forEach(function (f) { ch[f].forEach(function (cid) { out[cid] = f; }); });
      CHUNK_OF[id] = out;
    }
    return CHUNK_OF[id];
  }
  function chunkFiles(id) { return Object.keys((REG[id] || {}).chunks || {}); }

  function mountPack(id) {
    var reg = REG[id];
    if (!reg) return null;
    /* 正文是分片注进来的，而脚本只会执行一次，所以每拉进一批都要按登记的装配函数再拼一次：
       微软那四门走 mount（就地合并逐课正文），py/cpp/cppm 走 assemble（按章 id 顶掉占位，
       并且整包换一个新的 root.MIAO_XX）。它会换对象，所以**必须先拼再读**：
       先抓包再拼，读到的永远是上一轮拼完的旧壳 —— 点开一章报「没有这一章」，
       要等预取多跑两轮才自己好起来（这一条是本轮自己踩的，见任务书 §18 踩坑）。 */
    var asm = root[reg.assemble || reg.mount];
    if (typeof asm === "function") asm();
    var pack = root[reg.source];
    if (!pack || !pack.tutorial) return null;
    /* 包内自报的 id 只对「多门课共用一份装配器」的课（微软那四门走 MIAO_MS_MOUNT）对账 ——
       那种场合谁顶了谁必须当场红。一课一包的课，包名 source 本身就是唯一身份，包里的 id
       写的是给人看的口径（C++ 两门都写 "C++"，因为它们同属一个分类位），不该拿它 veto 正文。
       真正的串包由离线闸 gen-index.js 的「两门课章节目录不许重叠」兜住。 */
    if (reg.mount && pack.tutorial.id !== id) {
      console.error("[数据层] " + id + " 登记的包名 " + reg.source + " 装的是另一门课：" + pack.tutorial.id);
      return null;
    }
    var t = pack.tutorial;
    FULL[id] = (t.chapters || []).map(function (c) {
      return { id: c.id, title: c.title, blocks: c.blocks || [] };
    });
    return pack;
  }
  function bodyOf(id) { return FULL[id] || []; }
  function bodyHas(id, cid) {
    var arr = bodyOf(id);
    for (var i = 0; i < arr.length; i++) if (arr[i].id === cid) return arr[i];
    return null;
  }
  /* 这一章的正文现在够不够看：没拆片的课（英语两门）骨架就是正文；
     拆了片的课，要么它的分片在场，要么它本来就由骨架里的占位正文供着（没有分片登记它）。 */
  function bodyReady(id, cid) {
    if (!BOOTED[id]) return false;
    var f = chunkMap(id)[cid];
    return !f || !!LOADED[f];
  }

  function ensureBoot(id) {
    if (BOOT[id]) return BOOT[id];
    var reg = REG[id];
    if (!reg) return Promise.reject(new Error("没有这门课：" + id));
    markPartial(true);
    BOOT[id] = loadAll(bootFiles(id)).then(function () {
      if (!mountPack(id)) throw new Error("这门课的正文文件没把数据包挂上：" + id);
      BOOTED[id] = true;
      return true;
    }).catch(function (e) { delete BOOT[id]; markPartial(false); throw e; });
    return BOOT[id];
  }

  /** 这一门课的分片是不是都进场了 —— 全在场之后装配层可以再拼一次并放开缺章报警 */
  function settleIfComplete(id) {
    if (DONE[id]) return;
    var rest = chunkFiles(id).filter(function (f) { return !LOADED[f]; });
    if (rest.length) return;
    DONE[id] = true;
    markPartial(false);
    mountPack(id);                      // 这一次是「齐了」的装配：真缺章该喊出来了
  }

  /** 只把「这一章」拉到位：骨架 + 它那一份分片 */
  function ensureChapter(id, cid) {
    return ensureBoot(id).then(function () {
      var f = chunkMap(id)[cid];
      if (f && !LOADED[f]) return loadJs(f).then(function () { mountPack(id); });
      return true;
    }).then(function () { settleIfComplete(id); return bodyHas(id, cid); });
  }

  /** 整门课拉齐（预取走的是这条路的一次一片，这里给「现在就全要」的场合兜底） */
  function ensureCourse(id) {
    return ensureBoot(id).then(function () {
      return chunkFiles(id).reduce(function (p, f) {
        return p.then(function () { return loadJs(f); }).then(function () { mountPack(id); });
      }, Promise.resolve());
    }).then(function () { settleIfComplete(id); return true; });
  }

  /* ---------------- 空了再补齐：读者这一章已经到位、且没有别的动作 ----------------
     就近优先（当前章往后的排前面），一次一片；读者换章/换课或页面在后台就收手，
     回到前台或翻下一页时由那一次导航重新排队 —— 预取永远给真动作让路。 */
  var PREFETCH = { token: 0 };
  function idle(fn) {
    if (typeof root.requestIdleCallback === "function") return root.requestIdleCallback(fn, { timeout: 5000 });
    return setTimeout(fn, 1500);
  }
  function stopPrefetch() { PREFETCH.token++; }
  function prefetchCourse(id, cid) {
    var reg = REG[id];
    if (!reg) return;
    var chs = reg.chunks || {};
    var order = [];
    (INDEX.tutorials || []).forEach(function (x) { if (x.id === id) order = x.chapters || []; });
    var posOf = {};
    order.forEach(function (c, i) { posOf[c.id] = i; });
    var cur = posOf[cid] == null ? 0 : posOf[cid];
    /* 排片：以当前章为原点，往后 1、2、3… 优先，回头再补 1、2、3…（往前 2 篇比往后 5 篇近） */
    var rest = Object.keys(chs).filter(function (f) { return !LOADED[f]; }).map(function (f) {
      var best = 1e9;
      chs[f].forEach(function (x) {
        var d = (posOf[x] == null ? cur : posOf[x]) - cur;
        var score = d >= 0 ? d : 1000 + (-d);
        if (score < best) best = score;
      });
      return { f: f, score: best };
    }).sort(function (a, b) { return a.score - b.score; }).map(function (x) { return x.f; });
    if (!rest.length) { settleIfComplete(id); return; }
    var token = ++PREFETCH.token;               // 上一条队列（若有）下一步就自己退场，这里不锁它的收尾
    var i = 0;
    var step = function () {
      if (token !== PREFETCH.token) return;     // 读者换了章/课，这条队列让路
      if (i >= rest.length) { settleIfComplete(id); return; }
      if (root.document && root.document.hidden) return;
      var f = rest[i++];
      loadJs(f).then(function () { mountPack(id); }, function () { token = -1; })
        .then(function () { if (token === PREFETCH.token) idle(step); });
    };
    /* 先等两秒半再动手：这一章刚落地时读者的手往往还在往下滑，
       真「没有别的动作」了才开始补齐 —— 只翻开一课就走的人不该背整门课的流量。 */
    setTimeout(step, 2500);
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
    } else if (id === "cpp" || id === "cppm") {
      /* C++ 两门课：考卷是静态笔试卷（kind:"paper"），主文件给 pass 兜底、分部给一场卷一份 */
      var ce = root[id === "cpp" ? "MIAO_CPP_EXAM" : "MIAO_CPPM_EXAM"] || null;
      if (ce) (ce.papers || []).forEach(function (e) {
        e.kind = "paper"; e.pass = e.pass == null ? (ce.pass == null ? 60 : ce.pass) : e.pass;
        out[e.cid] = e;
      });
    }
    return out;
  }
  function ensureExam(id, cid) {
    var reg = REG[id];
    if (!reg) return Promise.reject(new Error("没有这门课：" + id));
    /* 出卷子要的是「题包 + 池子」，不是整门课正文：字母 / 音标 / 200 词都在英语那两门的
       骨架里（它们没拆片，boot 就是全文），代码卷与笔试卷的题面自带在 examFiles 里。
       所以这里只拉 boot，进考场不再为「考这一课」把 132 课的正文一起拖进来。 */
    return ensureBoot(id)
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

    /* 字母与音标卡片的数据：拉那门课的脚本，不在首屏（它没拆片，boot 就是全文） */
    if (parts[1] === "en" && parts[2] === "cards") {
      return ensureBoot("english").then(function () {
        var p = root.MIAO_EN || {};
        return { letters: p.letters || [], phonemes: p.phonemes || [], groups: p.groups || [] };
      });
    }
    /* 200 词的单词表：词卡数据在 enwords 包里，正文块只写章号，这里按章号把词填进块里 */
    if (parts[1] === "words") {
      return ensureBoot("enwords").then(function () {
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
        /* 只把「这一章」拉到位：骨架 + 它那一份分片，其余分片交给空了之后的预取 */
        return ensureChapter(id, cid).then(function (c) {
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
      /* 详情页只要「目录 + 本机进度」：章号与标题首屏那份 index.js 就有，正文一块都不为此拉 */
      return ensureBoot(id).then(function () {
        var t = findTut(id), reg = REG[id];
        var ids = (reg && reg.examIds) || [];
        var passed = passedIds(id), scores = {};
        passed.forEach(function (x) { scores[x] = results(id, x).best; });
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
    /* 视图层要「先拉正文再渲染」时用它：ensureChapter = 只拉这一章；
       prefetchCourse = 这一章到位了、人没别的事，空了把同门其余分片补齐；
       ensureCourse 留作「整门课现在就全要」的兜底（详情页与考场都不用它）。 */
    ensureBoot: ensureBoot, ensureChapter: ensureChapter, ensureCourse: ensureCourse, ensureExam: ensureExam,
    prefetchCourse: prefetchCourse, stopPrefetch: stopPrefetch, bodyReady: bodyReady,
    loadedScripts: function () { return Object.keys(LOADED); },
    _local: {
      tutorials: TUTS, index: INDEX, papers: function (id) { return PAPERS[id] || {}; },
      full: FULL, boot: BOOT, chunk: chunkMap, favs: favs, results: results, site: SITE, reg: REG
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
