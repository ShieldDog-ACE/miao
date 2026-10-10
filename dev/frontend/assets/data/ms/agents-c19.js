window.MIAO_MS_BODY = window.MIAO_MS_BODY || {};
window.MIAO_MS_BODY["agents-c19"] = [
  { t: `tip`, color: `blue`, text: `本课目标：给 agent 的动作留一份别人不需要信任你也能验的凭证——签名、规范化、串成链，同时看清它能证明什么、不能证明什么。` },
  { t: `h2`, text: `原理讲解` },
  { t: `p`, text: `审计场景是这样的：一个订票 agent 上季度跑了五万次预订，审查的人问「把 agent 做过的事给我看」，你交出日志；接着那句才是难点——「我怎么知道这些日志没被改过」。应用日志谁有磁盘权限谁能改；云日志服务在平台层抗篡改，前提是你信平台；数据库事务日志只覆盖数据库改动，覆盖不了任意一次工具调用。三者都要审查方先信某个人。` },
  { t: `p`, text: `收据把这件事换成密码学说法：一条记录 agent 做过什么的 JSON，用 Ed25519 私钥签名。三个性质撑起全部价值。签名——改任一字段，验签就失败；规范化——签前先按 RFC 8785 把 JSON 排成固定字节，否则同一内容两种序列化器签出两个结果；哈希链——每条带上前一条的摘要，删一条或换顺序，后面全部断开。合起来给出三句结论：这把钥匙签过这份内容、内容签后没变过、这条排在那条之后。` },
  { t: `p`, text: `而这三句也正是它的边界：签得干净不等于动作对，也不等于被引用的策略真的执行过，更不等于某个人批准过。要证明最后那句，得再签一份审批收据——由具名的人在执行前对同一份规范化动作摘要签名，agent 的动作收据里带上同一摘要和 parent_approval_ref，两边各用一套固定的公钥表核验。` },
  { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320" font-family="sans-serif"><rect width="640" height="320" fill="#fffaf3"/><text x="320" y="22" font-size="17" fill="#4a3b2f" text-anchor="middle">签之前规范化，验的时候只用公钥：改一位字节，签名就废</text><rect x="40" y="48" width="168" height="48" rx="6" fill="#dfe8ff" stroke="#5b7cfa"/><text x="124" y="68" font-size="14" fill="#4a3b2f" text-anchor="middle">① 一条动作的 JSON</text><text x="124" y="88" font-size="14" fill="#8a7867" text-anchor="middle">参数与结果只存哈希</text><path d="M208 72 L234 72" stroke="#8a7867" stroke-width="2" fill="none"/><polygon points="244,72 234,67 234,77" fill="#8a7867"/><rect x="244" y="48" width="168" height="48" rx="6" fill="#fbe3c6" stroke="#e0821f"/><text x="328" y="68" font-size="14" fill="#4a3b2f" text-anchor="middle">② 先规范化成固定字节</text><text x="328" y="88" font-size="14" fill="#8a7867" text-anchor="middle">键序与数字写法定死</text><path d="M412 72 L438 72" stroke="#8a7867" stroke-width="2" fill="none"/><polygon points="448,72 438,67 438,77" fill="#8a7867"/><rect x="448" y="48" width="168" height="48" rx="6" fill="#d5f0e8" stroke="#12a58a"/><text x="532" y="68" font-size="14" fill="#1d4230" text-anchor="middle">③ Ed25519 私钥签名</text><text x="532" y="88" font-size="14" fill="#8a7867" text-anchor="middle">附上前一条的摘要</text><text x="40" y="140" font-size="14" fill="#8a7867">串成链：每条的 previous 字段指向上一条的摘要</text><rect x="40" y="146" width="110" height="46" rx="6" fill="#fffaf3" stroke="#e8ded2"/><text x="95" y="175" font-size="14" fill="#4a3b2f" text-anchor="middle">收据 #45</text><path d="M150 169 L168 169" stroke="#8a7867" stroke-width="2" fill="none"/><polygon points="180,169 168,164 168,174" fill="#8a7867"/><rect x="180" y="146" width="110" height="46" rx="6" fill="#fffaf3" stroke="#e8ded2"/><text x="235" y="175" font-size="14" fill="#4a3b2f" text-anchor="middle">收据 #46</text><path d="M290 169 L308 169" stroke="#8a7867" stroke-width="2" fill="none"/><polygon points="320,169 308,164 308,174" fill="#8a7867"/><rect x="320" y="146" width="110" height="46" rx="6" fill="#fffaf3" stroke="#e8ded2"/><text x="375" y="175" font-size="14" fill="#4a3b2f" text-anchor="middle">收据 #47</text><rect x="470" y="146" width="146" height="46" rx="6" fill="#faded9" stroke="#c0392b"/><text x="543" y="164" font-size="14" fill="#7f1d1d" text-anchor="middle">整段重写要私钥</text><text x="543" y="184" font-size="14" fill="#7f1d1d" text-anchor="middle">删一条就断在那里</text><rect x="40" y="204" width="576" height="34" rx="6" fill="#d5f0e8" stroke="#12a58a"/><text x="328" y="226" font-size="14" fill="#1d4230" text-anchor="middle">核验只要公钥和字节：公钥公布出去，审查方离线就能验，不需要你的服务</text><text x="40" y="266" font-size="14" fill="#4a3b2f">它证得了三句：这把钥匙签过这份内容 · 内容签后没变 · 这条排在那条之后</text><text x="40" y="290" font-size="14" fill="#c0392b">它证不了三句：动作对不对 · 策略真执行过没 · 有没有人批准</text><text x="40" y="312" font-size="14" fill="#8a7867">要证最后那句得再签一份审批收据：动作收据带 approval_ref 指向它</text></svg>`, caption: `上排是签之前的三步（顺序不能换，规范化在签名之前），中间那条链和下面四行是它能证明与不能证明的分界` },
  { t: `h2`, text: `假设它能干什么` },
  { t: `ul`, items: [
    `把一份收据和公钥交给审查方，他离线就能验，不需要你的服务、不需要网络`,
    `跨机构协作时，对方不必信你，只信那把公钥`,
    `事后有人改过 policy_id 想冒充宽松策略，验签当场失败`,
    `中间被删掉一条收据，链在那个点断开，删不掉`,
    `退款、删除、转账这类高风险动作，能拿出「某人批准了这个确切动作」的证据`
  ] },
  { t: `h2`, text: `演示 1 · 一份收据写什么` },
  { t: `code`, lang: `python`, code: `payload = {\n    "type": "agent.tool_call.v1",\n    "agent_id": "contoso-travel-bot",\n    "tool_name": "lookup_flights",\n    "tool_args_hash": sha256_canonical(args),    # 只留摘要\n    "result_hash": sha256_canonical(result),\n    "policy_id": "travel-policy-v3",\n    "timestamp": "2026-04-25T14:30:00Z",\n    "sequence": 47,\n    "previous_receipt_hash": prev_hash,\n}` },
  { t: `p`, text: `参数和结果存哈希而不是原文，两个理由：隐私（客户身份、业务数据不进审计件），体积（固定长度，一条约 500 字节；每天一万次调用一年约 1.8 GB，保留几年要早算）。核验时把摘要和单独存放的原件比对，内容不必出现在收据里。` },
  { t: `h2`, text: `演示 2 · 签之前先规范化` },
  { t: `code`, lang: `python`, code: `from nacl import signing\nfrom jcs import canonicalize            # RFC 8785\n\nkey = signing.SigningKey.generate()     # 生产环境这把钥匙进密钥库\nsig = key.sign(canonicalize(payload)).signature\nreceipt = {**payload, "signature": {"alg": "EdDSA",\n                                    "sig": b64(sig),\n                                    "public_key": b64(bytes(key.verify_key))}}` },
  { t: `p`, text: `规范化规定键的顺序和数字写法，Python 签、Node 验才对得上同一份字节。签名对象要放在被签内容之外，否则自包含循环。算法字段 alg 留着：将来换成抗量子的 ML-DSA-65，靠它过渡，收据格式不用重写。` },
  { t: `h2`, text: `演示 3 · 离线核验，改一个字节就废` },
  { t: `code`, lang: `python`, code: `def verify(receipt):\n    body = {k: v for k, v in receipt.items() if k != "signature"}\n    vk = signing.VerifyKey(b64_decode(receipt["signature"]["public_key"]))\n    try:\n        vk.verify(canonicalize(body), b64_decode(receipt["signature"]["sig"]))\n        return True\n    except signing.BadSignatureError:\n        return False` },
  { t: `p`, text: `验证只需要公钥和字节，这是「不需要信任你」的出处。想直观看到抗篡改：把 tool_args_hash 改一位，或者把 policy_id 换成更宽松的那版，再跑一次 verify——规范化字节变了，签名必然对不上。` },
  { t: `h2`, text: `演示 4 · 串成链，并把人的批准绑上来` },
  { t: `code`, lang: `python`, code: `chain, prev = [], None\nfor call in agent_calls:\n    r = sign({**payload(call), "sequence": len(chain),\n              "previous_receipt_hash": prev})\n    chain.append(r)\n    prev = sha256_canonical(r)\n\n# 高风险动作：动作收据还要带 approval_ref = 审批收据的摘要` },
  { t: `p`, text: `要静悄悄删掉中间那条，只有两条路：改后一条的 previous 字段（它自己的签名立刻废），或者把后面全部重签（需要私钥）。私钥放硬件密钥库、公钥在 /.well-known/agent-keys.json 公布出去，两条路都堵死。审批那一路要盯住时效：策略版本一移、审批人换掉或批准过期，执行时的动作摘要必须仍指向同一条审批，否则当场拒。` },
  { t: `h2`, text: `常见坑` },
  { t: `ul`, items: [
    `私钥躺在开发机和源码里：签出去的凭证和没签一样`,
    `公钥没公布或没固定：验得了格式，认不出是谁签的`,
    `自己发明规范化：换个序列化器就验不过，跨语言直接崩`,
    `把收据当成合规本身——它记的是说过什么，不是做对了什么`,
    `输入校验和策略执行不做，指望事后审计兜底`,
    `链头只存在本地：内部人整段重写历史看不出来，要定期锚到外部透明日志`
  ] },
  { t: `h2`, text: `任务` },
  { t: `ul`, items: [
    `签出第一份收据并验通，再改一个字节重跑，记下失败发生在哪一步`,
    `把第 5 课那次工具调用包成收据，参数与结果只留哈希，另存原件做比对`,
    `建三条收据的链，删掉中间那条，验证从哪一条开始验不过`,
    `给一份收据加一个自定义字段（比如请求号），确认它进被签字节后仍能往返`,
    `写一页边界说明：这套凭证能证明三件事，还缺哪几层控制由谁补`
  ] },
  { t: `tip`, color: `green`, text: `本课一句话：收据证明的是「谁在什么时候说了什么」，不是「说的是不是对的」——把这条线分清，才谈得上诚实的可追溯系统。` }
];
