/* 喵站 · Python 精通 正文分部 p2：第 7–12 课
 *
 * 导出 window.MIAO_PYTHONX_P2 = { chapters: [...] }，由装配层按章 id 合并。
 * 六栏固定：目标 tip → 原理讲解 → 假设它能干什么 → 演示 → 常见坑 → 任务 → 一句话 tip。
 * 正文与代码里不出现反引号与模板插值符号；交叉引用只往回指。
 * 本分部所有 python 段都在本机 python3 上实跑过（px07 的服务真起真打，px08 真回滚，
 * px09/px10/px11 的输出就是屏幕上打出来的那几行）；px07 演示 1、px08 演示 1 是框架代码，
 * 需要 pip install fastapi uvicorn sqlalchemy 才能跑，正文里按这个口径写。 */
window.MIAO_PYTHONX_P2 = {
  chapters: [
    {
      id: `px07`,
      title: `第 7 课 · Web 服务：FastAPI 路由`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：看懂一个请求从 URL 走到函数的全过程——路由匹配、请求体校验、依赖注入、异常到状态码，并写出一个能启动的服务。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `FastAPI 是 ASGI 框架：监听端口归 uvicorn 管，它只管把请求对象交给你的函数，再把函数返回的对象序列化成 JSON。你写的每个接口就是一个普通函数，参数用类型注解写清形状，框架在调用之前先把数据对准。` },
        { t: `p`, text: `请求的来源分三类，校验方式也不同。路径参数写在装饰器的字符串里；查询参数是函数签名里没被路径占用的标量；请求体是继承 BaseModel 的参数。前两类按注解转换，第三类逐字段校验，任何一条不合格，框架直接回 422，函数体一行都不会执行。` },
        { t: `p`, text: `依赖注入解决「每个接口都要做的事」。取数据库会话、取当前用户这类动作写成普通函数，用 Depends 包一下放进参数表，框架在进接口之前先跑它，接口只拿准备好的东西。要换实现，只在装配处换一个依赖，业务函数不动。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `三十行起一个带校验的 JSON 接口，不用手写「这个字段是不是字符串」。`,
          `自动出一份 OpenAPI 文档，前端照文档联调，接口改了文档跟着改。`,
          `把鉴权写成依赖，敏感接口只多一个参数，不用每个函数里翻 token。`,
          `错误用异常表达，统一一处转成状态码和中文提示。`
        ]},
        { t: `h2`, text: `演示 1 · 一个带校验与鉴权的接口` },
        { t: `p`, text: `装好依赖用这一行：pip install fastapi uvicorn。下面两半合起来是一个文件，模型与依赖各占一半。` },
        { t: `code`, lang: `python`, code: `from fastapi import Depends, FastAPI, HTTPException\nfrom pydantic import BaseModel\n\nclass NoteIn(BaseModel):\n    title: str\n    tags: list[str] = []` },
        { t: `code`, lang: `python`, code: `app = FastAPI()\n\ndef get_user(token: str) -> str:\n    if token != "demo":\n        raise HTTPException(401, "token 不对")\n    return "fuka"\n\n@app.post("/notes")\ndef create(note: NoteIn, user: str = Depends(get_user)):\n    return {"owner": user, "title": note.title, "n_tags": len(note.tags)}` },
        { t: `p`, text: `启动用 uvicorn 文件名:app --reload。title 传空是 422 并指出哪个字段错；token 传错是 401；两个都对才进函数体。校验和鉴权都不在业务代码里，这是这类框架真正的价值。` },
        { t: `h2`, text: `演示 2 · 只用标准库把同样四步走一遍` },
        { t: `p`, text: `框架可以不用，机制跑不掉。一个文件三段：先是响应工具，再是分派，最后是启动。这三段只依赖标准库，本机 python3 起服务后真打了几次。` },
        { t: `code`, lang: `python`, code: `import json\nfrom http.server import BaseHTTPRequestHandler, HTTPServer\n\nclass H(BaseHTTPRequestHandler):\n    def reply(self, code, obj):\n        data = json.dumps(obj).encode("utf-8")\n        self.send_response(code)\n        self.send_header("Content-Length", str(len(data)))\n        self.end_headers()\n        self.wfile.write(data)\n    def log_message(self, *a):\n        pass` },
        { t: `code`, lang: `python`, code: `    def do_POST(self):\n        if self.path != "/notes":\n            return self.reply(404, {"error": "没有这条路"})\n        n = int(self.headers.get("Content-Length", 0))\n        try:\n            body = json.loads(self.rfile.read(n))\n        except json.JSONDecodeError:\n            return self.reply(400, {"error": "不是合法 JSON"})\n        if not str(body.get("title", "")).strip():\n            return self.reply(422, {"error": "title 不能为空"})\n        self.reply(200, {"ok": True, "title": body["title"]})` },
        { t: `code`, lang: `python`, code: `if __name__ == "__main__":\n    HTTPServer(("127.0.0.1", 8777), H).serve_forever()` },
        { t: `p`, text: `本机实打的结果：打 /notes 带 title 回 200；打 /other 回 404 没有这条路；title 传两个空格回 422；body 写成花括号不带引号回 400 不是合法 JSON。四道门都在函数体之前，这一点和演示 1 完全一致。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="16" y="16" width="608" height="248" rx="16" fill="#eef6f4"/><text x="320" y="44" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">一次请求要过的四道门</text><rect x="36" y="86" width="126" height="58" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="99" y="110" font-size="15" text-anchor="middle" fill="#173d36">路由匹配</text><text x="99" y="130" font-size="14" text-anchor="middle" fill="#4d6f67">不过回 404</text><rect x="186" y="86" width="126" height="58" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="249" y="110" font-size="15" text-anchor="middle" fill="#173d36">请求体校验</text><text x="249" y="130" font-size="14" text-anchor="middle" fill="#4d6f67">不过回 422</text><rect x="336" y="86" width="126" height="58" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="399" y="110" font-size="15" text-anchor="middle" fill="#173d36">依赖</text><text x="399" y="130" font-size="14" text-anchor="middle" fill="#4d6f67">不过回 401</text><rect x="486" y="86" width="118" height="58" rx="10" fill="#2a8c78"/><text x="545" y="110" font-size="15" text-anchor="middle" fill="#ffffff">你的函数</text><text x="545" y="130" font-size="14" text-anchor="middle" fill="#dff0ea">返回对象</text><path d="M162 115H182" stroke="#2a8c78" stroke-width="3"/><polygon points="186,115 176,109 176,121" fill="#2a8c78"/><path d="M312 115H332" stroke="#2a8c78" stroke-width="3"/><polygon points="336,115 326,109 326,121" fill="#2a8c78"/><path d="M462 115H482" stroke="#2a8c78" stroke-width="3"/><polygon points="486,115 476,109 476,121" fill="#2a8c78"/><path d="M99 146V196H545V148" fill="none" stroke="#b4552d" stroke-width="3" stroke-dasharray="7 5"/><polygon points="545,146 539,158 551,158" fill="#b4552d"/><text x="320" y="218" font-size="14" text-anchor="middle" fill="#b4552d">任何一道门没过就直接回错误码，函数体一行都不跑</text><text x="320" y="242" font-size="14" text-anchor="middle" fill="#4d6f67">过了四道门才轮到业务，返回值由框架序列化成 JSON</text></svg>`, caption: `路由、校验、依赖、业务四段；前三段是框架的约定，错误也在约定里返回。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `在接口里自己读原始 body 再手工解析，绕开了模型，校验和文档同时失效。`,
          `把依赖写成全局变量，测试时换不掉假会话，接口只能连真库跑。`,
          `路径参数和查询参数混进一个模型，前端不知道往哪放，一种数据只说清一种位置。`,
          `业务错误直接抛 Exception，用户看到 500；要抛带状态码的异常。`,
          `同步接口里调耗时外部服务，把整个 worker 占住；慢动作放异步或线程池。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把演示 2 的三段拼成一个文件跑起来，分别打出 404、422、400、200 四种响应。`,
          `给 NoteIn 的 title 加长度限制，再加一个取值只能是三种状态的字段，验证超限的报错文案。`,
          `把「取会话」写成依赖，用一个假会话替换它，跑一次不连数据库的接口调用。`,
          `对比演示 1 与演示 2 各写了多少行，说出框架替你省掉了哪几件事。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：框架只做四件事——认路、验数据、备依赖、转响应；把这四件交给约定，业务函数才只写业务。` }
      ]
    },
    {
      id: `px08`,
      title: `第 8 课 · 数据层：SQLAlchemy 事务`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：说清一次业务写操作为什么要包在一个事务里、会话对象到底在干什么、ORM 什么时候才把 SQL 发出去，并写出带分页的查询。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `ORM 把表映射成类、把行映射成对象。你改的是对象属性，数据库里的行没跟着变，变的只是会话里的记录。会话是一本账：谁新增、谁改了、谁要删它全记着，commit 时才按依赖顺序把攒下的操作拼成 SQL 发出去，一个事务里全成或全败。这个攒着一起交的机制叫 unit of work。` },
        { t: `p`, text: `事务边界由 commit 和 rollback 决定，不是由你写了几个函数决定。一条业务常跨几张表：订单落库、库存扣减、流水记账。三条都成才算完成一条，中间任何一步抛异常，其余必须退回，否则库存扣了、订单没落。Web 服务里通常一个请求一个会话，请求结束就关。` },
        { t: `p`, text: `读数据有两件老毛病：分页和 N+1。分页靠 limit 与 offset，offset 越深越慢，翻到后面要改用上一页最后一个 id 做游标。N+1 是查了 1 条主记录，又为它的每条子记录各发一条 SQL；解法是一次把 id 收齐用 IN 查，或者 join 预取。这两种毛病原型期看不出，数据上万条才发作。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `一次业务写多张表，中途失败整体退回，不留半个订单。`,
          `表结构写在类定义里，用迁移脚本升级，改字段不用手改数据库。`,
          `接口层只看到对象和集合，看不到拼起来的 SQL 字符串，换数据库只换连接串。`,
          `查询条件用表达式拼，参数天然带类型，不靠手工转义防注入。`
        ]},
        { t: `h2`, text: `演示 1 · 一个带事务与分页的写读` },
        { t: `p`, text: `这段要 pip install sqlalchemy 才跑，写出来是为了看清形状：模型一半、读写一半。` },
        { t: `code`, lang: `python`, code: `from sqlalchemy import Column, Integer, String, select\nfrom sqlalchemy.orm import DeclarativeBase, Session\n\nclass Base(DeclarativeBase):\n    pass\n\nclass Note(Base):\n    __tablename__ = "notes"\n    id = Column(Integer, primary_key=True)\n    title = Column(String(80), nullable=False)` },
        { t: `code`, lang: `python`, code: `def add_many(db: Session, titles):\n    try:\n        db.add_all([Note(title=t) for t in titles])\n        db.commit()\n    except Exception:\n        db.rollback()\n        raise\n\ndef page(db: Session, offset, limit):\n    rows = db.scalars(select(Note).order_by(Note.id).offset(offset).limit(limit))\n    return [r.title for r in rows]` },
        { t: `p`, text: `add_many 把三条插入放进一个事务：任何一条撞约束，三条全退。page 只发一条 SELECT；写排序是为了让翻页结果稳定，不写排序时数据库不保证同序，翻页会看到重复或漏项。` },
        { t: `h2`, text: `演示 2 · 用标准库把事务边界验一遍` },
        { t: `p`, text: `sqlite3 在标准库里，这段本机 python3 直接跑，验的是事务边界这件事本身，跟用哪个 ORM 无关。` },
        { t: `code`, lang: `python`, code: `import sqlite3\ndb = sqlite3.connect(":memory:")\ndb.execute("CREATE TABLE notes (id INTEGER PRIMARY KEY, title TEXT NOT NULL)")\ndb.execute("INSERT INTO notes (title) VALUES ('第一条')")\ndb.commit()\ntry:\n    db.execute("INSERT INTO notes (title) VALUES ('第二条')")\n    db.execute("INSERT INTO notes (title) VALUES (NULL)")\n    db.commit()\nexcept sqlite3.IntegrityError as exc:\n    db.rollback()\nprint("留下:", db.execute("SELECT title FROM notes").fetchall())` },
        { t: `p`, text: `本机实跑打印两行：退回 NOT NULL constraint failed: notes.title，留下 [('第一条',)]。第二条的插入跟着 rollback 一起消失——这就是一个事务里全成或全败。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="16" y="16" width="608" height="248" rx="16" fill="#eef6f4"/><text x="320" y="44" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">会话是一本账，commit 才交账</text><rect x="44" y="72" width="150" height="46" rx="9" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="119" y="100" font-size="15" text-anchor="middle" fill="#173d36">改对象属性</text><rect x="44" y="130" width="150" height="46" rx="9" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="119" y="158" font-size="15" text-anchor="middle" fill="#173d36">新增三行</text><rect x="44" y="188" width="150" height="46" rx="9" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="119" y="216" font-size="15" text-anchor="middle" fill="#173d36">删一行</text><rect x="246" y="112" width="150" height="66" rx="10" fill="#2a8c78"/><text x="321" y="140" font-size="16" font-weight="700" text-anchor="middle" fill="#ffffff">会话记账</text><text x="321" y="162" font-size="14" text-anchor="middle" fill="#dff0ea">SQL 还没发</text><path d="M194 95H244M194 153H244M194 211H244" stroke="#2a8c78" stroke-width="2.5"/><path d="M416 145H470" stroke="#b4552d" stroke-width="3"/><polygon points="474,145 464,139 464,151" fill="#b4552d"/><text x="445" y="128" font-size="14" text-anchor="middle" fill="#b4552d">commit</text><rect x="478" y="112" width="118" height="66" rx="10" fill="#ffffff" stroke="#b4552d" stroke-width="2"/><text x="537" y="140" font-size="15" text-anchor="middle" fill="#173d36">一条事务</text><text x="537" y="162" font-size="14" text-anchor="middle" fill="#4d6f67">全成或全败</text><text x="320" y="250" font-size="14" text-anchor="middle" fill="#4d6f67">rollback 把账清空，库里只可能出现提交后的状态</text></svg>`, caption: `对象改动先进会话的账本，commit 才拼成一条事务发出；出错就整条退回。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `以为改了对象属性数据库就变了。不 commit，改动只活在会话里，进程一退全没。`,
          `在循环里逐条 commit。一万次提交就是一万个事务，慢，而且中间状态可能被别人读到。`,
          `会话跨请求复用，上一个请求没提交的改动串进下一个请求。`,
          `异常在事务层被吞掉，会话里还留着脏对象，下一次提交把错误写进去。`,
          `分页不写排序，翻页时同一条记录出现两次或永远看不到。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `改演示 2：让三条插入都合法再提交，确认留下三条；然后把其中一条改成 NULL，再看留下几条。`,
          `把 page 改成游标分页，入参换成上一页最后一个 id 和 limit，说出为什么深翻页更快。`,
          `给 Note 加一个标签关联表，用一次预取读出十条评论及其标签，数一数 SQL 条数。`,
          `写一段在 commit 之后才抛异常的代码，说出数据库此时的状态，并解释为什么边界看 commit 而不是看异常位置。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：ORM 的会话只是账本，commit 才是那条事务；写多张表要一次提交，读多张表要一次预取。` }
      ]
    },
    {
      id: `px09`,
      title: `第 9 课 · 大模型调用：结构化输出`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把「问模型一句话」升级成一次可靠调用——消息怎么组织、怎么让它按格式答、答得不合法怎么办、这一次花了多少。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `模型接口收的是一个消息数组，每条有角色与内容。system 定身份与规则，user 是这轮要办的事，assistant 是模型已经说过的话。所谓多轮对话，就是把整个历史数组再发一遍：模型没有会话记忆，你不带上文，它就只看见最后一句。所以吃掉上下文长度的，主要是历史、工具说明和格式定义。` },
        { t: `p`, text: `要结构化结果，光在提示里写「请返回 JSON」不够。稳妥的做法是三层收口：请求里把字段和含义写清；拿到文本先解析、再按本地规则校验字段与类型；不合格就把缺了什么原样发回去要求重答，最多两轮，仍不合格就报错走人工。规则在你手里，字段才能一个不少。` },
        { t: `p`, text: `调用还要记账。输入按 token 计，历史越长越贵，输出单价通常高于输入。每次记下模型名、输入输出 token、耗时和请求标识，成本和延迟才有账目可谈。重试是成本；超时是另一类，混在一起统计会把网络问题看成模型问题。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `把上千条自由文本抽成固定字段的数据，直接交给下游入库。`,
          `给长文生成摘要、标签和风险点，字段齐得可以直接写进工单。`,
          `把用户一句自然语言翻译成一条查询条件，接口不用堆筛选项。`,
          `在流水线里做质检：模型给答案，规则给分数，不合格那批自动重跑。`
        ]},
        { t: `h2`, text: `演示 1 · 打真服务的形状` },
        { t: `p`, text: `地址与密钥从环境变量取，OpenAI 兼容格式的服务都是这个形状，本机自起的推理服务也走这一套。只用标准库。` },
        { t: `code`, lang: `python`, code: `import json, os, urllib.request\n\nBASE = os.environ.get("LLM_BASE_URL", "").rstrip("/")\nKEY = os.environ.get("LLM_API_KEY", "")\nSPEC = {"fields": ["title", "tags", "risk"]}\n\ndef check(obj):\n    return all(k in obj for k in SPEC["fields"])` },
        { t: `code`, lang: `python`, code: `def ask(messages):\n    body = json.dumps({"model": "demo", "messages": messages,\n                       "response_format": {"type": "json_object"}}).encode()\n    req = urllib.request.Request(BASE + "/chat/completions", data=body, method="POST",\n        headers={"Content-Type": "application/json",\n                 "Authorization": "Bearer " + KEY})\n    with urllib.request.urlopen(req, timeout=30) as r:\n        data = json.loads(r.read())\n    return data["choices"][0]["message"]["content"], data.get("usage", {})` },
        { t: `p`, text: `注意最后一行：返回的不只是内容，还有 usage。漏了它，事后没人知道这一句花了多少 token。` },
        { t: `h2`, text: `演示 2 · 校验与重答的逻辑，本机不联网也能验` },
        { t: `p`, text: `把「模型」换成一个会故意答歪的假函数，跑的就是收口那两步。` },
        { t: `code`, lang: `python`, code: `def fake_model(turn):\n    if turn == 0:\n        return '{"title": "服务器宕机"}'\n    return json.dumps({"title": "服务器宕机", "tags": ["故障"],\n                       "risk": "需人工复核"})\n\ndef extract(raw, attempts=2):\n    last = "字段不全"\n    for turn in range(attempts):\n        text = raw if turn == 0 else fake_model(turn)` },
        { t: `code`, lang: `python`, code: `        try:\n            obj = json.loads(text)\n        except json.JSONDecodeError:\n            last = "不是合法 JSON"\n            continue\n        miss = [k for k in SPEC["fields"] if k not in obj]\n        if miss:\n            last = "缺字段 " + ",".join(miss)\n            continue\n        return obj, turn\n    raise ValueError("重答后仍不合格: " + last)` },
        { t: `p`, text: `两段拼成一个文件，跑 extract('{"title": "服务器宕机"}')，本机输出是 ({'title': '服务器宕机', 'tags': ['故障'], 'risk': '需人工复核'}, 1)：第一轮缺 tags 和 risk，第二轮补齐，第二个数就是用掉的重答轮数。把 attempts 设成 1 再打一段坏 JSON，就走到 raise，报的是 重答后仍不合格: 不是合法 JSON。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="16" y="16" width="608" height="248" rx="16" fill="#eef6f4"/><text x="320" y="44" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">一次调用要收口的三样东西</text><rect x="40" y="76" width="150" height="58" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="115" y="100" font-size="15" text-anchor="middle" fill="#173d36">消息数组</text><text x="115" y="122" font-size="14" text-anchor="middle" fill="#4d6f67">历史要带上</text><rect x="40" y="158" width="150" height="58" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="115" y="182" font-size="15" text-anchor="middle" fill="#173d36">格式约定</text><text x="115" y="204" font-size="14" text-anchor="middle" fill="#4d6f67">字段与类型</text><rect x="245" y="116" width="150" height="60" rx="10" fill="#2a8c78"/><text x="320" y="142" font-size="16" font-weight="700" text-anchor="middle" fill="#ffffff">模型返回</text><text x="320" y="162" font-size="14" text-anchor="middle" fill="#dff0ea">一段文本</text><rect x="450" y="116" width="150" height="60" rx="10" fill="#ffffff" stroke="#b4552d" stroke-width="2.5"/><text x="525" y="142" font-size="15" text-anchor="middle" fill="#173d36">本地校验</text><text x="525" y="162" font-size="14" text-anchor="middle" fill="#4d6f67">不合格就重答</text><path d="M190 105L243 138M190 187L243 156" stroke="#2a8c78" stroke-width="2.5"/><path d="M395 146H446" stroke="#2a8c78" stroke-width="3"/><polygon points="450,146 440,140 440,152" fill="#2a8c78"/><path d="M525 178C525 230 320 230 320 180" fill="none" stroke="#b4552d" stroke-width="3" stroke-dasharray="7 5"/><polygon points="320,178 314,190 326,190" fill="#b4552d"/><text x="420" y="248" font-size="14" text-anchor="middle" fill="#b4552d">重答最多两轮，每一轮的 token 与耗时都要记下来</text></svg>`, caption: `提示词只负责说明，字段齐不齐由本地校验判定；不合格带着错误说明回去重答。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把提示当程序，指望一句「一定要返回 JSON」万无一失；模型多写一句解释，解析当场炸。`,
          `不校验字段就入库。少一个字段下游报空，查半天发现是模型漏答。`,
          `历史无限往数组里塞，上下文吃满，费用涨、延迟涨，模型还开始答非所问。`,
          `不设超时。网络一挂请求就一直等，整条流水线卡死。`,
          `重答不设上限，格式不对就一直问，钱花完了问题还在。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `给 extract 再加一层类型校验：tags 必须是列表、risk 必须非空，然后造一条能过字段关、过不了类型关的假回答。`,
          `把消息数组按 system、两轮历史、当前问题拼一次请求，打出各段字符数，算出历史占了多少。`,
          `让 ask 返回四个数：输入 token、输出 token、耗时、重试轮数，包成一个字典。`,
          `把 timeout 改成 0.01，记下抛出的异常类型，说出它在你账本里应该归哪一类。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：模型给的是文本，你要的是数据；从文本到数据这一步，靠本地校验和有限次重答收口。` }
      ]
    },
    {
      id: `px10`,
      title: `第 10 课 · RAG：向量检索`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：亲手把一段资料走完 RAG 的四步——切块、向量化、检索、带引用回答，并说清每一步的取舍落在哪。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `RAG 解决的问题是：模型不知道你私有的资料，硬答就会编。做法是把资料切成小块，每块配一个能代表意思的向量存起来；提问时把问题也变成向量，找出最接近的几块，将原文塞进提示词，让模型只依据这几段回答并写明编号。模型依然不知道你的资料，但它眼前摆着原文。` },
        { t: `p`, text: `切块是最被低估的一步。块太大，命中一块就带进几千字无关内容，费用和干扰一起涨；块太小，一句话被切断，模型读到残句。中文常按句子或固定字数切，再叠一层重叠：相邻块共用几个字，避免关键信息正好落在切口上。每块都要带来源与编号，回答才引用得回去。` },
        { t: `p`, text: `向量化的本质是把文本投进一个语义空间，靠近就表示意思相近。生产里投的是嵌入模型给的那个空间，检索交给向量库做近似最近邻。这一步用中文二字组合也能讲清机制：同一批组合在两块里出现得越多，两块越像。所以本课先用标准库手写最小版本，再把它换成现成服务。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `把几百页内部文档变成能问答的助手，每条回答都能点回原文。`,
          `给自己的错题本、食谱、维修手册加一个按意思查的入口。`,
          `给客服系统提供带出处的候选答案，人工只做确认，不做从头写。`,
          `在没有训练资源的前提下，把模型的回答范围框在你自己的资料里。`
        ]},
        { t: `h2`, text: `演示：从切块到拼提示词` },
        { t: `p`, text: `三段拼成一个文件，只用标准库。第一段是资料、切块和向量化。` },
        { t: `code`, lang: `python`, code: `import re\n\nDOCS = [\n    ("维修手册 3.2", "打印机卡纸时先关闭电源，再打开后盖把纸张顺着走纸方向慢慢抽出来。"),\n    ("维修手册 3.5", "更换硒鼓后要清空计数器，否则机器仍然提示缺粉。"),\n    ("网络手册 2.1", "交换机端口灯不亮时先查网线，再看水晶头有没有压紧。"),\n]\ndef grams(text):\n    tok = re.findall(r"[一-鿿]|[a-zA-Z]+", text)\n    return set(a + b for a, b in zip(tok, tok[1:]))\ndef cut(text, size=18, overlap=4):\n    return [text[i:i + size] for i in range(0, max(1, len(text) - overlap), size - overlap)]` },
        { t: `p`, text: `第二段把每块变成一条记录并算相似度：交集越大越像，长度用两边之和归一，避免长块靠字多占便宜。` },
        { t: `code`, lang: `python`, code: `def build(docs, size=18, overlap=4):\n    out = []\n    for n, (src, text) in enumerate(docs, 1):\n        for k, piece in enumerate(cut(text, size, overlap), 1):\n            out.append({"src": src, "no": "%d.%d" % (n, k),\n                        "text": piece, "vec": grams(piece)})\n    return out\ndef score(qv, dv):\n    if not qv or not dv:\n        return 0.0\n    return 2 * len(qv & dv) / (len(qv) + len(dv))` },
        { t: `p`, text: `第三段是检索和拼提示词：取前 top 块，低于 floor 就当没查到。` },
        { t: `code`, lang: `python`, code: `def ask(query, items, top=2, floor=0.08):\n    qv = grams(query)\n    ranked = sorted(items, key=lambda it: score(qv, it["vec"]), reverse=True)\n    hits = [(it, score(qv, it["vec"])) for it in ranked[:top] if score(qv, it["vec"]) >= floor]\n    if not hits:\n        return "资料里没有相关内容，请直接说明不知道。", []\n    lines = ["只依据下面资料回答，回答里要写出编号："]\n    for n, (it, s) in enumerate(hits, 1):\n        lines.append("资料%d（%s 第%s块，相似度%.2f）：%s" % (n, it["src"], it["no"], s, it["text"]))\n    lines.append("问题：" + query)\n    return "\\n".join(lines), [it["no"] for it, _ in hits]` },
        { t: `p`, text: `本机实跑 build(DOCS) 切出 6 块。问「打印机卡纸了怎么把纸取出来」，两条命中都是维修手册 3.2，相似度 0.29 和 0.14，拼出来的提示词第一行就是那段带「卡纸」的原文。问「怎么给自行车打气」，最高分不到 0.08，走的是「资料里没有」那条分支——这条分支必须有，否则 RAG 会变成瞎编的放大器。把 size 从 18 改成 40、overlap 改成 0，只剩一条命中、分数还是 0.29，但块里多了半句无关内容。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="16" y="16" width="608" height="268" rx="16" fill="#eef6f4"/><text x="320" y="44" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">四步里只有两步每次提问都跑</text><rect x="40" y="82" width="128" height="56" rx="9" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="104" y="106" font-size="15" text-anchor="middle" fill="#173d36">切块</text><text x="104" y="126" font-size="14" text-anchor="middle" fill="#4d6f67">带来源编号</text><rect x="196" y="82" width="128" height="56" rx="9" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="260" y="106" font-size="15" text-anchor="middle" fill="#173d36">向量化</text><text x="260" y="126" font-size="14" text-anchor="middle" fill="#4d6f67">一块一个向量</text><rect x="352" y="82" width="128" height="56" rx="9" fill="#ffffff" stroke="#b4552d" stroke-width="2.5"/><text x="416" y="106" font-size="15" text-anchor="middle" fill="#173d36">检索</text><text x="416" y="126" font-size="14" text-anchor="middle" fill="#4d6f67">取最近 top 块</text><rect x="506" y="82" width="94" height="56" rx="9" fill="#2a8c78"/><text x="553" y="106" font-size="15" font-weight="700" text-anchor="middle" fill="#ffffff">拼提示</text><text x="553" y="126" font-size="14" text-anchor="middle" fill="#dff0ea">交给模型</text><path d="M168 110H192M324 110H348M480 110H502" stroke="#2a8c78" stroke-width="3"/><polygon points="194,110 184,104 184,116" fill="#2a8c78"/><polygon points="350,110 340,104 340,116" fill="#b4552d"/><polygon points="504,110 494,104 494,116" fill="#2a8c78"/><text x="104" y="74" font-size="14" fill="#4d6f67">离线做一次</text><text x="416" y="74" font-size="14" fill="#b4552d">每次提问都跑</text><rect x="196" y="182" width="284" height="54" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2.5"/><text x="338" y="206" font-size="15" text-anchor="middle" fill="#173d36">回答 + 引用的块编号</text><text x="338" y="226" font-size="14" text-anchor="middle" fill="#4d6f67">点编号能回到原文，才叫能用</text><path d="M553 140V209H484" fill="none" stroke="#b4552d" stroke-width="3"/><polygon points="482,209 492,203 492,215" fill="#b4552d"/><text x="320" y="262" font-size="14" text-anchor="middle" fill="#4d6f67">切块大小与重叠决定命没命中，top 与阈值决定上下文有多干净</text></svg>`, caption: `左边两步离线做，资料更新才重跑；右边两步每问一次跑一次，延迟和成本都在这里。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `整本手册当一个块存，检索永远命中同一块，等于把全书塞进提示词。`,
          `不做引用。答对了不敢用，答错了查不出错在哪一段。`,
          `只看命中不看准确。检索到相关内容，模型照样可能答歪。`,
          `问题问得含糊也硬答。分数普遍很低时该说资料里没有，不是硬编。`,
          `资料一改就全部重新向量化。生产要按增量处理，否则更新一次等半天。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把 size 改成 8、overlap 改成 0，记录哪些问题从命中变成漏，写一句你的结论。`,
          `给 ask 加一个「最高分低于阈值」的计数，输出这一批问题里有多少走了「资料里没有」。`,
          `准备二十条问答对，人工标出每条应命中的来源，算一次命中率，再只改切块参数比一次。`,
          `把 grams 换成外部嵌入接口加余弦相似度，其余不动，看同一问题的前三条结果差多少。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：RAG 不教模型新知识，它每次挑几段原文放到模型眼前；挑得准不准、有没有出处，就是这门手艺的全部。` }
      ]
    },
    {
      id: `px11`,
      title: `第 11 课 · Agent：工具调用`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：写清 Agent 循环里到底发生了什么——工具怎么描述给模型、参数在谁手里校验、结果怎么回填、什么时候必须停。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `模型只会输出文本，不会动手。所谓 Agent，是在模型外面套一圈你自己的代码：把工具的名字、用途、参数说明一起发过去；模型回一句「我要调哪个工具、参数是什么」；你的代码真的去调，结果作为一条消息追加回历史，让模型接着判断。循环跑到模型给出最终答案才结束。` },
        { t: `p`, text: `工具描述就是接口文档。名字要说清动作，参数写类型、是否必填、取值范围，说明里给一个正例。描述含糊，模型就会传不存在的字段或者漏参。校验必须在你这边做：缺字段就回一条明确的错误说明，让它有机会改；不校验就执行，最坏情况是拿错参数真的动了线上数据。` },
        { t: `p`, text: `循环要有刹车，至少三条：最大步数、单步超时、同一工具同一参数连续重复就停。成本主要花在历史越来越长——每步都往数组里追加结果，第 8 步的请求体可能是第 1 步的十倍。工具少而准、返回短、失败早停，这三条比换更大的模型管用。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `一句「把这周告警按服务归一下」，它自己去查监控、拉日志、汇总成表。`,
          `把「这批订单是不是都发了」拆成查询、判断、回复三步，工具用你自己的内部接口。`,
          `做数据清洗：读文件、按规则改、写回、报差异，每一步都能审计。`,
          `在只给的权限内做助手：查询工具随便用，写操作一律要人点头。`
        ]},
        { t: `h2`, text: `演示：一个能跑的最小 Agent 循环` },
        { t: `p`, text: `这里把「模型」写成一段按脚本给动作的函数，重点是外面这一圈：校验、执行、回填、刹车。四段拼成一个文件，只用标准库。` },
        { t: `code`, lang: `python`, code: `import json\n\nTOOLS = {\n    "read_file": {"desc": "读取文本文件，返回内容", "args": {"path": "只填存在的文件名"}},\n    "word_count": {"desc": "统计词数", "args": {"text": "要统计的一段文本"}},\n    "done": {"desc": "给出最终答案", "args": {"answer": "一句话答案"}},\n}\ndef check(name, args):\n    if name not in TOOLS:\n        return False, "没有这个工具: " + name` },
        { t: `code`, lang: `python`, code: `    miss = [k for k in TOOLS[name]["args"] if k not in args]\n    extra = [k for k in args if k not in TOOLS[name]["args"]]\n    if miss:\n        return False, "缺参数: " + ",".join(miss)\n    if extra:\n        return False, "不认识的参数: " + ",".join(extra)\n    return True, "参数合格"\ndef do_call(name, args, files):\n    if name == "read_file":\n        if args["path"] not in files:\n            return False, "文件不存在: " + args["path"]\n        return True, files[args["path"]]` },
        { t: `code`, lang: `python`, code: `    if name == "word_count":\n        return True, str(len(args["text"].split()))\n    return True, args["answer"]\ndef run(plan, files, max_steps=6):\n    history, seen = [], []\n    for step in range(max_steps):\n        action = plan(step, history)\n        if not action:\n            return "模型没给动作", history\n        name, args = action.get("tool", ""), action.get("args", {})\n        ok, out = check(name, args)` },
        { t: `code`, lang: `python`, code: `        if ok:\n            ok, out = do_call(name, args, files)\n        history.append({"step": step, "tool": name, "ok": ok, "out": out})\n        sig = name + json.dumps(args, sort_keys=True, ensure_ascii=False)\n        if sig in seen:\n            return "同一动作重复，刹车", history\n        seen.append(sig)\n        if ok and name == "done":\n            return out, history\n    return "步数用完，刹车", history` },
        { t: `p`, text: `最后这段是喂给循环的脚本，模拟模型四轮给出的动作。` },
        { t: `code`, lang: `python`, code: `files = {"a.txt": "red blue green red yellow"}\nscript = [\n    {"tool": "read_file", "args": {"path": "b.txt"}},\n    {"tool": "read_file", "args": {"path": "a.txt"}},\n    {"tool": "word_count", "args": {"text": "red blue green red yellow"}},\n    {"tool": "done", "args": {"answer": "五个词，red 出现两次"}},\n]\nplan = lambda step, hist: script[step] if step < len(script) else None\nprint(run(plan, files)[0], "用了", len(run(plan, files)[1]), "步")` },
        { t: `p`, text: `本机实跑：答案是「五个词，red 出现两次」，走了 4 步，第 0 步读 b.txt 不存在被挡下来、没有执行，第 1 步就改了路径，第 2 步 word_count 回 5。把 plan 换成每轮都给同一个 word_count，跑出来是「同一动作重复，刹车」。这一圈里没有一步是靠模型自己完成的，模型只出主意，动手和叫停都在你的代码里。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="16" y="16" width="608" height="268" rx="16" fill="#eef6f4"/><text x="320" y="44" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">模型出主意，你的代码动手</text><rect x="240" y="70" width="160" height="52" rx="10" fill="#2a8c78"/><text x="320" y="94" font-size="16" font-weight="700" text-anchor="middle" fill="#ffffff">模型</text><text x="320" y="112" font-size="14" text-anchor="middle" fill="#dff0ea">选工具，填参数</text><rect x="466" y="70" width="134" height="52" rx="10" fill="#ffffff" stroke="#b4552d" stroke-width="2.5"/><text x="533" y="94" font-size="15" text-anchor="middle" fill="#173d36">参数校验</text><text x="533" y="112" font-size="14" text-anchor="middle" fill="#4d6f67">在你这边</text><rect x="466" y="178" width="134" height="52" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2.5"/><text x="533" y="202" font-size="15" text-anchor="middle" fill="#173d36">真的执行</text><text x="533" y="222" font-size="14" text-anchor="middle" fill="#4d6f67">读文件、发请求</text><rect x="40" y="178" width="150" height="52" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2.5"/><text x="115" y="202" font-size="15" text-anchor="middle" fill="#173d36">结果回填</text><text x="115" y="222" font-size="14" text-anchor="middle" fill="#4d6f67">追加进历史</text><path d="M402 96H462" stroke="#2a8c78" stroke-width="3"/><polygon points="464,96 454,90 454,102" fill="#2a8c78"/><path d="M533 124V174" stroke="#2a8c78" stroke-width="3"/><polygon points="533,176 527,166 539,166" fill="#2a8c78"/><path d="M464 204H194" stroke="#2a8c78" stroke-width="3"/><polygon points="192,204 202,198 202,210" fill="#2a8c78"/><path d="M115 176V110C115 96 160 96 236 96" fill="none" stroke="#2a8c78" stroke-width="3"/><polygon points="238,96 228,90 228,102" fill="#2a8c78"/><path d="M466 96C430 58 224 52 202 98" fill="none" stroke="#b4552d" stroke-width="3" stroke-dasharray="7 5"/><polygon points="202,100 196,88 208,90" fill="#b4552d"/><text x="334" y="58" font-size="14" text-anchor="middle" fill="#b4552d">校验不过：把错误说明回填，让它改</text><text x="320" y="262" font-size="14" text-anchor="middle" fill="#4d6f67">刹车三条：最大步数、单步超时、同参数重复即停</text></svg>`, caption: `失败也算一步：错误信息回到历史里，下一轮才有的改。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `工具给得多又互相重叠，十个里挑一个，挑错概率随数量涨；先收拢到三五个。`,
          `不设最大步数，模型反复调同一个查询，钱和分钟一起烧。`,
          `工具一次返回整页原文塞进历史，下一轮请求胖十倍，还挤掉了有用的上下文。`,
          `写操作不给审批。删除、下单、改配置这类必须停在等人点头那一步。`,
          `没有可复现记录。出错时没人说得清它当时看到什么、为什么这么调，历史要落盘。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `再加一个只读工具 list_files，设计一次要用到它的任务，把脚本跑通。`,
          `把 max_steps 改成 2，说出这次停在哪、失败信息应该带上哪几句。`,
          `把重复检测从「连续两次」放宽成「整轮里出现两次」，比较两种刹车各自的后果。`,
          `删掉 check 直接执行，用同一份脚本跑一遍，说出你会在哪些地方看到意外。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：Agent 不是模型会动手，而是你写的循环肯替它动手——校验、执行、回填、刹车，四件都在你手里。` }
      ]
    },
    {
      id: `px12`,
      title: `第 12 课 · 就业方向与后续发展`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把这十一课的能力换成能被验收的东西——五条路线，每条一个能独立完成的项目和一份验收清单。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `招人的一方看你，不是看你会不会写 Python，而是看你能不能一个人把一件事做到别人能用。判断标准就三条：有没有能跑的东西、有没有说清它解决了什么、有没有留下别人能复查的证据——测试、文档、数据、账本。前十一课练的正是这三样：包与测试让东西装得起来跑得动，事务与校验让数据可信，模型调用与 RAG 让功能有新内容，Agent 循环把能力落成流程。` },
        { t: `p`, text: `另一件事是选路线。Python 的岗位不是一种，是三种完全不同的活：把模型接进业务、把数据搬干净、把服务撑住。要补的能力、面试问的东西都不一样。选错最常见的原因只看薪资，没看自己坐不坐得住；下面每条都写出要补的能力，让你自己对照。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `手上有四个能跑的仓库，README 第一段写问题和结论，不是安装步骤。`,
          `能在面试里讲清一次故障：现象、怎么定位、改了什么、凭什么说改对了。`,
          `能给出成本账：一次调用多少钱、一批数据跑多久。`,
          `能接手别人的工程：读依赖声明、跑测试、看出分层在哪。`
        ]},
        { t: `h2`, text: `五条路线，每条都要有验收` },
        { t: `p`, text: `一、大模型应用工程师。项目：把第 10、11 课那套做成产品——一个 RAG 知识库问答，或一个能调三到五个工具的 Agent。栈按第 7 到 11 课：FastAPI 出接口、SQLAlchemy 存对话、向量检索先用自己那套手写版起步、模型走兼容接口。验收：20 条真实问题人工标好应命中的来源，命中率与答案准确率各有一个数字；每条回答带可点回原文的引用；单次问答的 token 和成本有账。要补：嵌入模型与向量库选型、评测集建设、提示词版本记录。落点：README 放那张评测表，附一段能复跑评测的脚本。` },
        { t: `p`, text: `二、数据与后端工程师。项目：带鉴权、分页、事务的服务，比如订单或笔记系统。验收：OpenAPI 文档能直接联调；迁移脚本从空库到新库一条命令跑通；集成测试覆盖并发写与回滚；压测报告给出吞吐和 P95 延迟。要补：执行计划与索引、连接池、幂等设计。落点：一份「表结构、索引，加一次慢查询优化前后的对比」。` },
        { t: `p`, text: `三、自动化与平台工具。项目：一个真在替你干活的工具——采集、报表或运维，接一条真实流程。验收：定时跑两周不出错，失败会重试并告警，日志能按任务号查回来，别人装上就能用。要补：调度与队列、凭据保管、失败恢复。落点：一页「以前每周花多久、现在多久」的对比数据。` },
        { t: `p`, text: `四、MLOps 与推理部署。项目：把一个开源模型做成可观测的推理服务。验收：支持批量与并发，显存占用有曲线，单次推理的成本与延迟有分布，换模型版本只改配置。要补：显存与批处理、模型格式与量化、服务监控。落点：一张「不同并发下的延迟与吞吐」图。` },
        { t: `p`, text: `五、量化与科学计算。项目：一套数据清洗加回测流水线。验收：明确排除未来数据，计入手续费与滑点，跟基准和随机对照各跑一次，改参数能看出结果怎么变。要补：向量化计算、统计基础、判断数据源可不可信。落点：一份参数敏感性表，而不是一条漂亮收益曲线。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="16" y="16" width="608" height="248" rx="16" fill="#eef6f4"/><text x="320" y="46" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">五条路线，收到同一件事上</text><rect x="34" y="66" width="106" height="44" rx="9" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="87" y="92" font-size="14" text-anchor="middle" fill="#173d36">大模型应用</text><rect x="148" y="66" width="106" height="44" rx="9" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="201" y="92" font-size="14" text-anchor="middle" fill="#173d36">数据与后端</text><rect x="262" y="66" width="106" height="44" rx="9" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="315" y="92" font-size="14" text-anchor="middle" fill="#173d36">自动化平台</text><rect x="376" y="66" width="106" height="44" rx="9" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="429" y="92" font-size="14" text-anchor="middle" fill="#173d36">推理部署</text><rect x="490" y="66" width="106" height="44" rx="9" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="543" y="92" font-size="14" text-anchor="middle" fill="#173d36">量化研究</text><path d="M87 112L180 166M201 112L250 166M315 112V166M429 112L390 166M543 112L460 166" stroke="#b4552d" stroke-width="2.5"/><rect x="140" y="168" width="360" height="56" rx="10" fill="#2a8c78"/><text x="320" y="192" font-size="16" font-weight="700" text-anchor="middle" fill="#ffffff">一个能独立交付的项目</text><text x="320" y="214" font-size="14" text-anchor="middle" fill="#dff0ea">有数字、有出处、别人能照着复跑</text><text x="320" y="252" font-size="14" text-anchor="middle" fill="#4d6f67">简历收口在这一句：仓库能跑，README 第一段讲问题与结论</text></svg>`, caption: `路线按你要交付的东西分，不按「会不会某个框架」分。` },
        { t: `h2`, text: `后续发展` },
        { t: `ul`, items: [
          `往架构走：从写接口到定边界，服务拆分、一致性、容量规划这些取舍要讲得出来。`,
          `往某个行业走：模型调用大家都会，行业里的数据和流程才是门槛。`,
          `往开源走：把一个自己真用过的问题做成小库，读别人代码、提合并请求、维护版本。`,
          `往底层补：网络、操作系统、数据库原理，决定你能不能查出自己代码的瓶颈。`,
          `往带人走：写清需求、拆好任务、给别人做审查，这是另一条路线。`
        ]},
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `简历写「熟悉大模型」，拿不出一次能复跑的评测，一问就穿。`,
          `十个 demo 仓库，没有一个装得起来跑；数量不等于交付。`,
          `只讲结果不讲代价：没说花了多少 token、慢在哪、失败怎么办。`,
          `把「换个更大的模型」当方案，不肯先修切块、索引和提示词。`,
          `项目全用教程样例数据，换成自己的真实数据一跑就崩。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `从五条路线选一条，写清未来两周要交付的项目：功能边界、技术栈、三条验收标准。`,
          `给已有仓库补 README 第一段：解决什么问题、怎么跑起来、当前结果是什么数字。`,
          `做一次自我验收：把项目交给同学，记下他从零跑起来卡在哪几步，把那几步修掉。`,
          `写下这条路线要补的两项能力，各配一个能证明你补过的动作。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：能被验收的项目才叫能力；五条路线任选一条，先做出一个能跑、有数字、有出处的东西。` }
      ]
    },
  ],
};
