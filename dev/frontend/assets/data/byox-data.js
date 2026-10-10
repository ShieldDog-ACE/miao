/* 喵站 · build-your-own-x 数据（由 dev/tools/byox-gen.js 生成，请勿手改；要改改生成器）
 *
 * 来源：GitHub danistefanovic/build-your-own-x 的 README —— 实测 30 个类目 / 359 篇教程链接（台账 dev/任务书.md §11.2）。
 * 这里是**索引骨架**：30 门教程、359 章，每章只有两个占位块（tip + p，写明本篇待写与原文链接）。
 * 正文与考卷由任务书 T-15 分批填；按 D-30 只写原创中文导读，绝不搬运原文正文。
 *
 * 全局名（为什么不是只有一个 MIAO_BYOX）：
 *   window.MIAO_BYOX                 → 30 门的全量数组（测试与批量工具用）
 *   window["MIAO_BYOX_" + 大写缩写]   → 单门 { tutorial, examScaffold }，如 MIAO_BYOX_WEB、MIAO_BYOX_3D
 *   assets/js/data.js 的组装是「pack = root[reg.source]; pack.tutorial」，一份 source 只认一门教程，
 *   且硬校验 reg.id === pack.tutorial.id —— 所以 site.js 里 30 行登记各指自己的全局名。
 *   id 以数字开头（3d）也没问题：全局名是 window[...] 下标写的，章节 id 是字符串 "3d-c01"，
 *   都没有被当成 JS 裸标识符拼进对象字面量。
 *
 * 块类型沿用站内既有形状：p 段落 / h2 小标题 / tip 提示框 / ul 列表 / code 代码。
 * updated 固定 2026-10-06，同一份 README 复跑产物逐字节不变。
 */
(function (root) {
  "use strict";

  var PACKS = [
      {
        tutorial: {
          id: "web",
          title: "从零写一个 Web 服务器（build-your-own-x 73 篇全做）",
          intro: "这一类要你自己造一个能收浏览器请求的服务器：从监听端口的 TCP socket 起步，逐行解析请求行和头部，把静态文件原样回出去，再一层层加上路由、查询串、Cookie、会话、模板与并发。走完就明白所有 Web 框架替你藏起来了什么。清单来自 build-your-own-x，站内每章都给出原文链接。",
          cat: "计算机基础",
          diff: "入门",
          tags: ["web","css","js","ts",,"服务器"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-web.svg",
          chapters: [
            { id: "web-c01", title: "Web 服务器 · Writing a Web Server from Scratch", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「Web Server」，站内章节 id web-c01），原文语言 C#，原文链接 https://www.codeproject.com/Articles/859108/Writing-a-Web-Server-from-Scratch" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「Web Server」，站内章节 id web-c01），原文语言 C#，原文链接 https://www.codeproject.com/Articles/859108/Writing-a-Web-Server-from-Scratch。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c02", title: "Web 服务器 · Build Your Own Web Server From Scratch In JavaScript", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 2 篇（类目「Web Server」，站内章节 id web-c02），原文语言 Node.js，原文链接 https://build-your-own.org/webserver/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 2 篇（类目「Web Server」，站内章节 id web-c02），原文语言 Node.js，原文链接 https://build-your-own.org/webserver/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c03", title: "Web 服务器 · Let's code a web server from scratch with NodeJS Streams", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 3 篇（类目「Web Server」，站内章节 id web-c03），原文语言 Node.js，原文链接 https://www.codementor.io/@ziad-saab/let-s-code-a-web-server-from-scratch-with-nodejs-streams-h4uc9utji" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 3 篇（类目「Web Server」，站内章节 id web-c03），原文语言 Node.js，原文链接 https://www.codementor.io/@ziad-saab/let-s-code-a-web-server-from-scratch-with-nodejs-streams-h4uc9utji。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c04", title: "Web 服务器 · lets-build-express", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 4 篇（类目「Web Server」，站内章节 id web-c04），原文语言 Node.js，原文链接 https://github.com/antoaravinth/lets-build-express" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 4 篇（类目「Web Server」，站内章节 id web-c04），原文语言 Node.js，原文链接 https://github.com/antoaravinth/lets-build-express。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c05", title: "Web 服务器 · Writing a webserver in pure PHP", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 5 篇（类目「Web Server」，站内章节 id web-c05），原文语言 PHP，原文链接 http://station.clancats.com/writing-a-webserver-in-pure-php/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 5 篇（类目「Web Server」，站内章节 id web-c05），原文语言 PHP，原文链接 http://station.clancats.com/writing-a-webserver-in-pure-php/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c06", title: "Web 服务器 · A Simple Web Server", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 6 篇（类目「Web Server」，站内章节 id web-c06），原文语言 Python，原文链接 http://aosabook.org/en/500L/a-simple-web-server.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 6 篇（类目「Web Server」，站内章节 id web-c06），原文语言 Python，原文链接 http://aosabook.org/en/500L/a-simple-web-server.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c07", title: "Web 服务器 · Let’s Build A Web Server.", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 7 篇（类目「Web Server」，站内章节 id web-c07），原文语言 Python，原文链接 https://ruslanspivak.com/lsbaws-part1/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 7 篇（类目「Web Server」，站内章节 id web-c07），原文语言 Python，原文链接 https://ruslanspivak.com/lsbaws-part1/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c08", title: "Web 服务器 · Web application from scratch", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 8 篇（类目「Web Server」，站内章节 id web-c08），原文语言 Python，原文链接 https://defn.io/2018/02/25/web-app-from-scratch-01/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 8 篇（类目「Web Server」，站内章节 id web-c08），原文语言 Python，原文链接 https://defn.io/2018/02/25/web-app-from-scratch-01/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c09", title: "Web 服务器 · Building a basic HTTP Server from scratch in Python", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 9 篇（类目「Web Server」，站内章节 id web-c09），原文语言 Python，原文链接 http://joaoventura.net/blog/2017/python-webserver/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 9 篇（类目「Web Server」，站内章节 id web-c09），原文语言 Python，原文链接 http://joaoventura.net/blog/2017/python-webserver/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c10", title: "Web 服务器 · Implementing a RESTful Web API with Python & Flask", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 10 篇（类目「Web Server」，站内章节 id web-c10），原文语言 Python，原文链接 http://blog.luisrei.com/articles/flaskrest.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 10 篇（类目「Web Server」，站内章节 id web-c10），原文语言 Python，原文链接 http://blog.luisrei.com/articles/flaskrest.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c11", title: "Web 服务器 · Building a simple websockets server from scratch in Ruby", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 11 篇（类目「Web Server」，站内章节 id web-c11），原文语言 Ruby，原文链接 http://blog.honeybadger.io/building-a-simple-websockets-server-from-scratch-in-ruby/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 11 篇（类目「Web Server」，站内章节 id web-c11），原文语言 Ruby，原文链接 http://blog.honeybadger.io/building-a-simple-websockets-server-from-scratch-in-ruby/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c12", title: "Web 服务器 · From NAND to Tetris: Building a Modern Computer From First Principles", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 12 篇（类目「Web Server」，站内章节 id web-c12），原文语言 (any)，原文链接 http://nand2tetris.org/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 12 篇（类目「Web Server」，站内章节 id web-c12），原文语言 (any)，原文链接 http://nand2tetris.org/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c13", title: "Web 服务器 · build-your-own-x-vibe-coding: BYOX-style tutorials adapted for vibe coding", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 13 篇（类目「Web Server」，站内章节 id web-c13），原文语言 (any)，原文链接 https://github.com/inFaaa/build-your-own-x-vibe-coding" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 13 篇（类目「Web Server」，站内章节 id web-c13），原文语言 (any)，原文链接 https://github.com/inFaaa/build-your-own-x-vibe-coding。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c14", title: "Web 服务器 · The Same-Origin Policy", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 14 篇（类目「Web Server」，站内章节 id web-c14），原文语言 Alloy，原文链接 http://aosabook.org/en/500L/the-same-origin-policy.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 14 篇（类目「Web Server」，站内章节 id web-c14），原文语言 Alloy，原文链接 http://aosabook.org/en/500L/the-same-origin-policy.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c15", title: "Web 服务器 · How to Write a Video Player in Less Than 1000 Lines", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 15 篇（类目「Web Server」，站内章节 id web-c15），原文语言 C，原文链接 http://dranger.com/ffmpeg/ffmpeg.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 15 篇（类目「Web Server」，站内章节 id web-c15），原文语言 C，原文链接 http://dranger.com/ffmpeg/ffmpeg.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c16", title: "Web 服务器 · Learn how to write a hash table in C", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 16 篇（类目「Web Server」，站内章节 id web-c16），原文语言 C，原文链接 https://github.com/jamesroutley/write-a-hash-table" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 16 篇（类目「Web Server」，站内章节 id web-c16），原文语言 C，原文链接 https://github.com/jamesroutley/write-a-hash-table。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c17", title: "Web 服务器 · The very basics of a terminal emulator", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 17 篇（类目「Web Server」，站内章节 id web-c17），原文语言 C，原文链接 https://www.uninformativ.de/blog/postings/2018-02-24/0/POSTING-en.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 17 篇（类目「Web Server」，站内章节 id web-c17），原文语言 C，原文链接 https://www.uninformativ.de/blog/postings/2018-02-24/0/POSTING-en.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c18", title: "Web 服务器 · Write a System Call", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 18 篇（类目「Web Server」，站内章节 id web-c18），原文语言 C，原文链接 https://brennan.io/2016/11/14/kernel-dev-ep3/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 18 篇（类目「Web Server」，站内章节 id web-c18），原文语言 C，原文链接 https://brennan.io/2016/11/14/kernel-dev-ep3/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c19", title: "Web 服务器 · Sol - An MQTT broker from scratch", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 19 篇（类目「Web Server」，站内章节 id web-c19），原文语言 C，原文链接 https://codepr.github.io/posts/sol-mqtt-broker" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 19 篇（类目「Web Server」，站内章节 id web-c19），原文语言 C，原文链接 https://codepr.github.io/posts/sol-mqtt-broker。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c20", title: "Web 服务器 · Build your own VR headset for $200", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 20 篇（类目「Web Server」，站内章节 id web-c20），原文语言 C++，原文链接 https://github.com/relativty/Relativ" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 20 篇（类目「Web Server」，站内章节 id web-c20），原文语言 C++，原文链接 https://github.com/relativty/Relativ。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c21", title: "Web 服务器 · How X Window Managers work and how to write one", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 21 篇（类目「Web Server」，站内章节 id web-c21），原文语言 C++，原文链接 https://seasonofcode.com/posts/how-x-window-managers-work-and-how-to-write-one-part-i.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 21 篇（类目「Web Server」，站内章节 id web-c21），原文语言 C++，原文链接 https://seasonofcode.com/posts/how-x-window-managers-work-and-how-to-write-one-part-i.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c22", title: "Web 服务器 · Writing a Linux Debugger", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 22 篇（类目「Web Server」，站内章节 id web-c22），原文语言 C++，原文链接 https://blog.tartanllama.xyz/writing-a-linux-debugger-setup/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 22 篇（类目「Web Server」，站内章节 id web-c22），原文语言 C++，原文链接 https://blog.tartanllama.xyz/writing-a-linux-debugger-setup/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c23", title: "Web 服务器 · How a 64k intro is made", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 23 篇（类目「Web Server」，站内章节 id web-c23），原文语言 C++，原文链接 http://www.lofibucket.com/articles/64k_intro.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 23 篇（类目「Web Server」，站内章节 id web-c23），原文语言 C++，原文链接 http://www.lofibucket.com/articles/64k_intro.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c24", title: "Web 服务器 · Make your own Game Engine", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 24 篇（类目「Web Server」，站内章节 id web-c24），原文语言 C++，原文链接 https://www.youtube.com/playlist?list=PLlrATfBNZ98dC-V-N3m0Go4deliWHPFwT" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 24 篇（类目「Web Server」，站内章节 id web-c24），原文语言 C++，原文链接 https://www.youtube.com/playlist?list=PLlrATfBNZ98dC-V-N3m0Go4deliWHPFwT。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c25", title: "Web 服务器 · C# Networking: Create a TCP chater server, TCP games, UDP Pong and more", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 25 篇（类目「Web Server」，站内章节 id web-c25），原文语言 C#，原文链接 https://16bpp.net/tutorials/csharp-networking" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 25 篇（类目「Web Server」，站内章节 id web-c25），原文语言 C#，原文链接 https://16bpp.net/tutorials/csharp-networking。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c26", title: "Web 服务器 · Loading and rendering 3D skeletal animations from scratch in C# and GLSL", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 26 篇（类目「Web Server」，站内章节 id web-c26），原文语言 C#，原文链接 https://www.seanjoflynn.com/research/skeletal-animation.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 26 篇（类目「Web Server」，站内章节 id web-c26），原文语言 C#，原文链接 https://www.seanjoflynn.com/research/skeletal-animation.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c27", title: "Web 服务器 · Building a spell-checker", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 27 篇（类目「Web Server」，站内章节 id web-c27），原文语言 Clojure，原文链接 https://bernhardwenzel.com/articles/clojure-spellchecker/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 27 篇（类目「Web Server」，站内章节 id web-c27），原文语言 Clojure，原文链接 https://bernhardwenzel.com/articles/clojure-spellchecker/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c28", title: "Web 服务器 · Build A Simple Terminal Emulator In 100 Lines of Golang", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 28 篇（类目「Web Server」，站内章节 id web-c28），原文语言 Go，原文链接 https://ishuah.com/2021/03/10/build-a-terminal-emulator-in-100-lines-of-go/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 28 篇（类目「Web Server」，站内章节 id web-c28），原文语言 Go，原文链接 https://ishuah.com/2021/03/10/build-a-terminal-emulator-in-100-lines-of-go/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c29", title: "Web 服务器 · Let's Create a Simple Load Balancer", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 29 篇（类目「Web Server」，站内章节 id web-c29），原文语言 Go，原文链接 https://kasvith.me/posts/lets-create-a-simple-lb-go/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 29 篇（类目「Web Server」，站内章节 id web-c29），原文语言 Go，原文链接 https://kasvith.me/posts/lets-create-a-simple-lb-go/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c30", title: "Web 服务器 · Video Encoding from Scratch", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 30 篇（类目「Web Server」，站内章节 id web-c30），原文语言 Go，原文链接 https://github.com/kevmo314/codec-from-scratch" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 30 篇（类目「Web Server」，站内章节 id web-c30），原文语言 Go，原文链接 https://github.com/kevmo314/codec-from-scratch。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c31", title: "Web 服务器 · How to Build an Android Reddit App", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 31 篇（类目「Web Server」，站内章节 id web-c31），原文语言 Java，原文链接 https://www.youtube.com/playlist?list=PLgCYzUzKIBE9HUJU-upNvl3TRVAo9W47y（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 31 篇（类目「Web Server」，站内章节 id web-c31），原文语言 Java，原文链接 https://www.youtube.com/playlist?list=PLgCYzUzKIBE9HUJU-upNvl3TRVAo9W47y（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c32", title: "Web 服务器 · Build Your Own Module Bundler - Minipack", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 32 篇（类目「Web Server」，站内章节 id web-c32），原文语言 JavaScript，原文链接 https://github.com/ronami/minipack" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 32 篇（类目「Web Server」，站内章节 id web-c32），原文语言 JavaScript，原文链接 https://github.com/ronami/minipack。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c33", title: "Web 服务器 · Learn JavaScript Promises by Building a Promise from Scratch", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 33 篇（类目「Web Server」，站内章节 id web-c33），原文语言 JavaScript，原文链接 https://levelup.gitconnected.com/understand-javascript-promises-by-building-a-promise-from-scratch-84c0fd855720" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 33 篇（类目「Web Server」，站内章节 id web-c33），原文语言 JavaScript，原文链接 https://levelup.gitconnected.com/understand-javascript-promises-by-building-a-promise-from-scratch-84c0fd855720。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c34", title: "Web 服务器 · Implementing promises from scratch (TDD way)", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 34 篇（类目「Web Server」，站内章节 id web-c34），原文语言 JavaScript，原文链接 https://www.mauriciopoppe.com/notes/computer-science/computation/promises/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 34 篇（类目「Web Server」，站内章节 id web-c34），原文语言 JavaScript，原文链接 https://www.mauriciopoppe.com/notes/computer-science/computation/promises/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c35", title: "Web 服务器 · Implement your own — call(), apply() and bind() method in JavaScript", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 35 篇（类目「Web Server」，站内章节 id web-c35），原文语言 JavaScript，原文链接 https://blog.usejournal.com/implement-your-own-call-apply-and-bind-method-in-javascript-42cc85dba1b" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 35 篇（类目「Web Server」，站内章节 id web-c35），原文语言 JavaScript，原文链接 https://blog.usejournal.com/implement-your-own-call-apply-and-bind-method-in-javascript-42cc85dba1b。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c36", title: "Web 服务器 · JavaScript Algorithms and Data Structures", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 36 篇（类目「Web Server」，站内章节 id web-c36），原文语言 JavaScript，原文链接 https://github.com/trekhleb/javascript-algorithms" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 36 篇（类目「Web Server」，站内章节 id web-c36），原文语言 JavaScript，原文链接 https://github.com/trekhleb/javascript-algorithms。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c37", title: "Web 服务器 · Build a ride hailing app with React Native", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 37 篇（类目「Web Server」，站内章节 id web-c37），原文语言 JavaScript，原文链接 https://pusher.com/tutorials/ride-hailing-react-native" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 37 篇（类目「Web Server」，站内章节 id web-c37），原文语言 JavaScript，原文链接 https://pusher.com/tutorials/ride-hailing-react-native。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c38", title: "Web 服务器 · Build Your Own AdBlocker in (Literally) 10 Minutes", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 38 篇（类目「Web Server」，站内章节 id web-c38），原文语言 JavaScript，原文链接 https://levelup.gitconnected.com/building-your-own-adblocker-in-literally-10-minutes-1eec093b04cd" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 38 篇（类目「Web Server」，站内章节 id web-c38），原文语言 JavaScript，原文链接 https://levelup.gitconnected.com/building-your-own-adblocker-in-literally-10-minutes-1eec093b04cd。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c39", title: "Web 服务器 · Build Your Own Cache", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 39 篇（类目「Web Server」，站内章节 id web-c39），原文语言 Kotlin，原文链接 https://github.com/kezhenxu94/cache-lite" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 39 篇（类目「Web Server」，站内章节 id web-c39），原文语言 Kotlin，原文链接 https://github.com/kezhenxu94/cache-lite。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c40", title: "Web 服务器 · Building a CDN from Scratch to Learn about CDN", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 40 篇（类目「Web Server」，站内章节 id web-c40），原文语言 Lua，原文链接 https://github.com/leandromoreira/cdn-up-and-running" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 40 篇（类目「Web Server」，站内章节 id web-c40），原文语言 Lua，原文链接 https://github.com/leandromoreira/cdn-up-and-running。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c41", title: "Web 服务器 · Writing a Redis Protocol Parser", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 41 篇（类目「Web Server」，站内章节 id web-c41），原文语言 Nim，原文链接 https://xmonader.github.io/nimdays/day12_resp.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 41 篇（类目「Web Server」，站内章节 id web-c41），原文语言 Nim，原文链接 https://xmonader.github.io/nimdays/day12_resp.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c42", title: "Web 服务器 · Writing a Build system", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 42 篇（类目「Web Server」，站内章节 id web-c42），原文语言 Nim，原文链接 https://xmonader.github.io/nimdays/day11_buildsystem.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 42 篇（类目「Web Server」，站内章节 id web-c42），原文语言 Nim，原文链接 https://xmonader.github.io/nimdays/day11_buildsystem.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c43", title: "Web 服务器 · Writing a MiniTest Framework", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 43 篇（类目「Web Server」，站内章节 id web-c43），原文语言 Nim，原文链接 https://xmonader.github.io/nimdays/day08_minitest.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 43 篇（类目「Web Server」，站内章节 id web-c43），原文语言 Nim，原文链接 https://xmonader.github.io/nimdays/day08_minitest.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c44", title: "Web 服务器 · Writing a DMIDecode Parser", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 44 篇（类目「Web Server」，站内章节 id web-c44），原文语言 Nim，原文链接 https://xmonader.github.io/nimdays/day01_dmidecode.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 44 篇（类目「Web Server」，站内章节 id web-c44），原文语言 Nim，原文链接 https://xmonader.github.io/nimdays/day01_dmidecode.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c45", title: "Web 服务器 · Writing a INI Parser", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 45 篇（类目「Web Server」，站内章节 id web-c45），原文语言 Nim，原文链接 https://xmonader.github.io/nimdays/day05_iniparser.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 45 篇（类目「Web Server」，站内章节 id web-c45），原文语言 Nim，原文链接 https://xmonader.github.io/nimdays/day05_iniparser.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c46", title: "Web 服务器 · Writing a Link Checker", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 46 篇（类目「Web Server」，站内章节 id web-c46），原文语言 Nim，原文链接 https://xmonader.github.io/nimdays/day04_asynclinkschecker.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 46 篇（类目「Web Server」，站内章节 id web-c46），原文语言 Nim，原文链接 https://xmonader.github.io/nimdays/day04_asynclinkschecker.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c47", title: "Web 服务器 · Writing a URL Shortening Service", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 47 篇（类目「Web Server」，站内章节 id web-c47），原文语言 Nim，原文链接 https://xmonader.github.io/nimdays/day07_shorturl.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 47 篇（类目「Web Server」，站内章节 id web-c47），原文语言 Nim，原文链接 https://xmonader.github.io/nimdays/day07_shorturl.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c48", title: "Web 服务器 · Build a static site generator in 40 lines with Node.js", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 48 篇（类目「Web Server」，站内章节 id web-c48），原文语言 Node.js，原文链接 https://www.webdevdrops.com/en/build-static-site-generator-nodejs-8969ebe34b22/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 48 篇（类目「Web Server」，站内章节 id web-c48），原文语言 Node.js，原文链接 https://www.webdevdrops.com/en/build-static-site-generator-nodejs-8969ebe34b22/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c49", title: "Web 服务器 · Building A Simple Single Sign On(SSO) Server And Solution From Scratch In Node.js.", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 49 篇（类目「Web Server」，站内章节 id web-c49），原文语言 Node.js，原文链接 https://codeburst.io/building-a-simple-single-sign-on-sso-server-and-solution-from-scratch-in-node-js-ea6ee5fdf340" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 49 篇（类目「Web Server」，站内章节 id web-c49），原文语言 Node.js，原文链接 https://codeburst.io/building-a-simple-single-sign-on-sso-server-and-solution-from-scratch-in-node-js-ea6ee5fdf340。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c50", title: "Web 服务器 · How to create a real-world Node CLI app with Node", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 50 篇（类目「Web Server」，站内章节 id web-c50），原文语言 Node.js，原文链接 https://medium.freecodecamp.org/how-to-create-a-real-world-node-cli-app-with-node-391b727bbed3" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 50 篇（类目「Web Server」，站内章节 id web-c50），原文语言 Node.js，原文链接 https://medium.freecodecamp.org/how-to-create-a-real-world-node-cli-app-with-node-391b727bbed3。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c51", title: "Web 服务器 · Build a DNS Server in Node.js", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 51 篇（类目「Web Server」，站内章节 id web-c51），原文语言 Node.js，原文链接 https://engineerhead.github.io/dns-server/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 51 篇（类目「Web Server」，站内章节 id web-c51），原文语言 Node.js，原文链接 https://engineerhead.github.io/dns-server/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c52", title: "Web 服务器 · Build a Synchronization Engine with Node.js and Y.js", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 52 篇（类目「Web Server」，站内章节 id web-c52），原文语言 Node.js，原文链接 https://greenvitriol.com/posts/sync-engine-for-everyone" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 52 篇（类目「Web Server」，站内章节 id web-c52），原文语言 Node.js，原文链接 https://greenvitriol.com/posts/sync-engine-for-everyone。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c53", title: "Web 服务器 · Write your own MVC from scratch in PHP", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 53 篇（类目「Web Server」，站内章节 id web-c53），原文语言 PHP，原文链接 https://chaitya62.github.io/2018/04/29/Writing-your-own-MVC-from-Scratch-in-PHP.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 53 篇（类目「Web Server」，站内章节 id web-c53），原文语言 PHP，原文链接 https://chaitya62.github.io/2018/04/29/Writing-your-own-MVC-from-Scratch-in-PHP.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c54", title: "Web 服务器 · Make your own blog", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 54 篇（类目「Web Server」，站内章节 id web-c54），原文语言 PHP，原文链接 https://ilovephp.jondh.me.uk/en/tutorial/make-your-own-blog" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 54 篇（类目「Web Server」，站内章节 id web-c54），原文语言 PHP，原文链接 https://ilovephp.jondh.me.uk/en/tutorial/make-your-own-blog。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c55", title: "Web 服务器 · Modern PHP Without a Framework", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 55 篇（类目「Web Server」，站内章节 id web-c55），原文语言 PHP，原文链接 https://kevinsmith.io/modern-php-without-a-framework" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 55 篇（类目「Web Server」，站内章节 id web-c55），原文语言 PHP，原文链接 https://kevinsmith.io/modern-php-without-a-framework。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c56", title: "Web 服务器 · Code a Web Search Engine in PHP", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 56 篇（类目「Web Server」，站内章节 id web-c56），原文语言 PHP，原文链接 https://boyter.org/2013/01/code-for-a-search-engine-in-php-part-1/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 56 篇（类目「Web Server」，站内章节 id web-c56），原文语言 PHP，原文链接 https://boyter.org/2013/01/code-for-a-search-engine-in-php-part-1/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c57", title: "Web 服务器 · Build a Deep Learning Library", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 57 篇（类目「Web Server」，站内章节 id web-c57），原文语言 Python，原文链接 https://www.youtube.com/watch?v=o64FV-ez6Gw（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 57 篇（类目「Web Server」，站内章节 id web-c57），原文语言 Python，原文链接 https://www.youtube.com/watch?v=o64FV-ez6Gw（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c58", title: "Web 服务器 · How to Build a Kick-Ass Mobile Document Scanner in Just 5 Minutes", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 58 篇（类目「Web Server」，站内章节 id web-c58），原文语言 Python，原文链接 https://www.pyimagesearch.com/2014/09/01/build-kick-ass-mobile-document-scanner-just-5-minutes/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 58 篇（类目「Web Server」，站内章节 id web-c58），原文语言 Python，原文链接 https://www.pyimagesearch.com/2014/09/01/build-kick-ass-mobile-document-scanner-just-5-minutes/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c59", title: "Web 服务器 · Continuous Integration System", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 59 篇（类目「Web Server」，站内章节 id web-c59），原文语言 Python，原文链接 http://aosabook.org/en/500L/a-continuous-integration-system.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 59 篇（类目「Web Server」，站内章节 id web-c59），原文语言 Python，原文链接 http://aosabook.org/en/500L/a-continuous-integration-system.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c60", title: "Web 服务器 · Recommender Systems in Python: Beginner Tutorial", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 60 篇（类目「Web Server」，站内章节 id web-c60），原文语言 Python，原文链接 https://www.datacamp.com/community/tutorials/recommender-systems-python" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 60 篇（类目「Web Server」，站内章节 id web-c60），原文语言 Python，原文链接 https://www.datacamp.com/community/tutorials/recommender-systems-python。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c61", title: "Web 服务器 · Write SMS-spam detector with Scikit-learn", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 61 篇（类目「Web Server」，站内章节 id web-c61），原文语言 Python，原文链接 https://medium.com/@kopilov.vlad/detect-sms-spam-in-kaggle-with-scikit-learn-5f6afa7a3ca2" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 61 篇（类目「Web Server」，站内章节 id web-c61），原文语言 Python，原文链接 https://medium.com/@kopilov.vlad/detect-sms-spam-in-kaggle-with-scikit-learn-5f6afa7a3ca2。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c62", title: "Web 服务器 · A Simple Content-Based Recommendation Engine in Python", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 62 篇（类目「Web Server」，站内章节 id web-c62），原文语言 Python，原文链接 http://blog.untrod.com/2016/06/simple-similar-products-recommendation-engine-in-python.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 62 篇（类目「Web Server」，站内章节 id web-c62），原文语言 Python，原文链接 http://blog.untrod.com/2016/06/simple-similar-products-recommendation-engine-in-python.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c63", title: "Web 服务器 · Stock Market Predictions with LSTM in Python", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 63 篇（类目「Web Server」，站内章节 id web-c63），原文语言 Python，原文链接 https://www.datacamp.com/community/tutorials/lstm-python-stock-market" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 63 篇（类目「Web Server」，站内章节 id web-c63），原文语言 Python，原文链接 https://www.datacamp.com/community/tutorials/lstm-python-stock-market。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c64", title: "Web 服务器 · Building a simple Generative Adversarial Network (GAN) using Tensorflow", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 64 篇（类目「Web Server」，站内章节 id web-c64），原文语言 Python，原文链接 https://blog.paperspace.com/implementing-gans-in-tensorflow/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 64 篇（类目「Web Server」，站内章节 id web-c64），原文语言 Python，原文链接 https://blog.paperspace.com/implementing-gans-in-tensorflow/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c65", title: "Web 服务器 · Learn ML Algorithms by coding: Decision Trees", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 65 篇（类目「Web Server」，站内章节 id web-c65），原文语言 Python，原文链接 https://lethalbrains.com/learn-ml-algorithms-by-coding-decision-trees-439ac503c9a4" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 65 篇（类目「Web Server」，站内章节 id web-c65），原文语言 Python，原文链接 https://lethalbrains.com/learn-ml-algorithms-by-coding-decision-trees-439ac503c9a4。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c66", title: "Web 服务器 · JSON Decoding Algorithm", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 66 篇（类目「Web Server」，站内章节 id web-c66），原文语言 Python，原文链接 https://github.com/cheery/json-algorithm" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 66 篇（类目「Web Server」，站内章节 id web-c66），原文语言 Python，原文链接 https://github.com/cheery/json-algorithm。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c67", title: "Web 服务器 · Build your own Git plugin with python", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 67 篇（类目「Web Server」，站内章节 id web-c67），原文语言 Python，原文链接 https://joshburns-xyz.vercel.app/posts/build-your-own-git-plugin" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 67 篇（类目「Web Server」，站内章节 id web-c67），原文语言 Python，原文链接 https://joshburns-xyz.vercel.app/posts/build-your-own-git-plugin。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c68", title: "Web 服务器 · A Pedometer in the Real World", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 68 篇（类目「Web Server」，站内章节 id web-c68），原文语言 Ruby，原文链接 http://aosabook.org/en/500L/a-pedometer-in-the-real-world.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 68 篇（类目「Web Server」，站内章节 id web-c68），原文语言 Ruby，原文链接 http://aosabook.org/en/500L/a-pedometer-in-the-real-world.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c69", title: "Web 服务器 · Creating a Linux Desktop application with Ruby", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 69 篇（类目「Web Server」，站内章节 id web-c69），原文语言 Ruby，原文链接 https://iridakos.com/tutorials/2018/01/25/creating-a-gtk-todo-application-with-ruby" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 69 篇（类目「Web Server」，站内章节 id web-c69），原文语言 Ruby，原文链接 https://iridakos.com/tutorials/2018/01/25/creating-a-gtk-todo-application-with-ruby。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c70", title: "Web 服务器 · Building a DNS server in Rust", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 70 篇（类目「Web Server」，站内章节 id web-c70），原文语言 Rust，原文链接 https://github.com/EmilHernvall/dnsguide/blob/master/README.md" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 70 篇（类目「Web Server」，站内章节 id web-c70），原文语言 Rust，原文链接 https://github.com/EmilHernvall/dnsguide/blob/master/README.md。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c71", title: "Web 服务器 · Writing Scalable Chat Service from Scratch", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 71 篇（类目「Web Server」，站内章节 id web-c71），原文语言 Rust，原文链接 https://nbaksalyar.github.io/2015/07/10/writing-chat-in-rust.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 71 篇（类目「Web Server」，站内章节 id web-c71），原文语言 Rust，原文链接 https://nbaksalyar.github.io/2015/07/10/writing-chat-in-rust.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c72", title: "Web 服务器 · WebGL + Rust: Basic Water Tutorial", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 72 篇（类目「Web Server」，站内章节 id web-c72），原文语言 Rust，原文链接 https://www.chinedufn.com/3d-webgl-basic-water-tutorial/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 72 篇（类目「Web Server」，站内章节 id web-c72），原文语言 Rust，原文链接 https://www.chinedufn.com/3d-webgl-basic-water-tutorial/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "web-c73", title: "Web 服务器 · Tiny Package Manager: Learns how npm or Yarn works", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 73 篇（类目「Web Server」，站内章节 id web-c73），原文语言 TypeScript，原文链接 https://github.com/g-plane/tiny-package-manager" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 73 篇（类目「Web Server」，站内章节 id web-c73），原文语言 TypeScript，原文链接 https://github.com/g-plane/tiny-package-manager。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "Web Server", papers: [
            { cid: "web-c01", kind: "paper", title: "Web 服务器 第 1 篇考试 · Writing a Web Server from Scratch", pass: 60, questions: [], explain: [] },
            { cid: "web-c02", kind: "paper", title: "Web 服务器 第 2 篇考试 · Build Your Own Web Server From Scratch In JavaScript", pass: 60, questions: [], explain: [] },
            { cid: "web-c03", kind: "paper", title: "Web 服务器 第 3 篇考试 · Let's code a web server from scratch with NodeJS Streams", pass: 60, questions: [], explain: [] },
            { cid: "web-c04", kind: "paper", title: "Web 服务器 第 4 篇考试 · lets-build-express", pass: 60, questions: [], explain: [] },
            { cid: "web-c05", kind: "paper", title: "Web 服务器 第 5 篇考试 · Writing a webserver in pure PHP", pass: 60, questions: [], explain: [] },
            { cid: "web-c06", kind: "paper", title: "Web 服务器 第 6 篇考试 · A Simple Web Server", pass: 60, questions: [], explain: [] },
            { cid: "web-c07", kind: "paper", title: "Web 服务器 第 7 篇考试 · Let’s Build A Web Server.", pass: 60, questions: [], explain: [] },
            { cid: "web-c08", kind: "paper", title: "Web 服务器 第 8 篇考试 · Web application from scratch", pass: 60, questions: [], explain: [] },
            { cid: "web-c09", kind: "paper", title: "Web 服务器 第 9 篇考试 · Building a basic HTTP Server from scratch in Python", pass: 60, questions: [], explain: [] },
            { cid: "web-c10", kind: "paper", title: "Web 服务器 第 10 篇考试 · Implementing a RESTful Web API with Python & Flask", pass: 60, questions: [], explain: [] },
            { cid: "web-c11", kind: "paper", title: "Web 服务器 第 11 篇考试 · Building a simple websockets server from scratch in Ruby", pass: 60, questions: [], explain: [] },
            { cid: "web-c12", kind: "paper", title: "Web 服务器 第 12 篇考试 · From NAND to Tetris: Building a Modern Computer From First Principles", pass: 60, questions: [], explain: [] },
            { cid: "web-c13", kind: "paper", title: "Web 服务器 第 13 篇考试 · build-your-own-x-vibe-coding: BYOX-style tutorials adapted for vibe coding", pass: 60, questions: [], explain: [] },
            { cid: "web-c14", kind: "paper", title: "Web 服务器 第 14 篇考试 · The Same-Origin Policy", pass: 60, questions: [], explain: [] },
            { cid: "web-c15", kind: "paper", title: "Web 服务器 第 15 篇考试 · How to Write a Video Player in Less Than 1000 Lines", pass: 60, questions: [], explain: [] },
            { cid: "web-c16", kind: "paper", title: "Web 服务器 第 16 篇考试 · Learn how to write a hash table in C", pass: 60, questions: [], explain: [] },
            { cid: "web-c17", kind: "paper", title: "Web 服务器 第 17 篇考试 · The very basics of a terminal emulator", pass: 60, questions: [], explain: [] },
            { cid: "web-c18", kind: "paper", title: "Web 服务器 第 18 篇考试 · Write a System Call", pass: 60, questions: [], explain: [] },
            { cid: "web-c19", kind: "paper", title: "Web 服务器 第 19 篇考试 · Sol - An MQTT broker from scratch", pass: 60, questions: [], explain: [] },
            { cid: "web-c20", kind: "paper", title: "Web 服务器 第 20 篇考试 · Build your own VR headset for $200", pass: 60, questions: [], explain: [] },
            { cid: "web-c21", kind: "paper", title: "Web 服务器 第 21 篇考试 · How X Window Managers work and how to write one", pass: 60, questions: [], explain: [] },
            { cid: "web-c22", kind: "paper", title: "Web 服务器 第 22 篇考试 · Writing a Linux Debugger", pass: 60, questions: [], explain: [] },
            { cid: "web-c23", kind: "paper", title: "Web 服务器 第 23 篇考试 · How a 64k intro is made", pass: 60, questions: [], explain: [] },
            { cid: "web-c24", kind: "paper", title: "Web 服务器 第 24 篇考试 · Make your own Game Engine", pass: 60, questions: [], explain: [] },
            { cid: "web-c25", kind: "paper", title: "Web 服务器 第 25 篇考试 · C# Networking: Create a TCP chater server, TCP games, UDP Pong and more", pass: 60, questions: [], explain: [] },
            { cid: "web-c26", kind: "paper", title: "Web 服务器 第 26 篇考试 · Loading and rendering 3D skeletal animations from scratch in C# and GLSL", pass: 60, questions: [], explain: [] },
            { cid: "web-c27", kind: "paper", title: "Web 服务器 第 27 篇考试 · Building a spell-checker", pass: 60, questions: [], explain: [] },
            { cid: "web-c28", kind: "paper", title: "Web 服务器 第 28 篇考试 · Build A Simple Terminal Emulator In 100 Lines of Golang", pass: 60, questions: [], explain: [] },
            { cid: "web-c29", kind: "paper", title: "Web 服务器 第 29 篇考试 · Let's Create a Simple Load Balancer", pass: 60, questions: [], explain: [] },
            { cid: "web-c30", kind: "paper", title: "Web 服务器 第 30 篇考试 · Video Encoding from Scratch", pass: 60, questions: [], explain: [] },
            { cid: "web-c31", kind: "paper", title: "Web 服务器 第 31 篇考试 · How to Build an Android Reddit App", pass: 60, questions: [], explain: [] },
            { cid: "web-c32", kind: "paper", title: "Web 服务器 第 32 篇考试 · Build Your Own Module Bundler - Minipack", pass: 60, questions: [], explain: [] },
            { cid: "web-c33", kind: "paper", title: "Web 服务器 第 33 篇考试 · Learn JavaScript Promises by Building a Promise from Scratch", pass: 60, questions: [], explain: [] },
            { cid: "web-c34", kind: "paper", title: "Web 服务器 第 34 篇考试 · Implementing promises from scratch (TDD way)", pass: 60, questions: [], explain: [] },
            { cid: "web-c35", kind: "paper", title: "Web 服务器 第 35 篇考试 · Implement your own — call(), apply() and bind() method in JavaScript", pass: 60, questions: [], explain: [] },
            { cid: "web-c36", kind: "paper", title: "Web 服务器 第 36 篇考试 · JavaScript Algorithms and Data Structures", pass: 60, questions: [], explain: [] },
            { cid: "web-c37", kind: "paper", title: "Web 服务器 第 37 篇考试 · Build a ride hailing app with React Native", pass: 60, questions: [], explain: [] },
            { cid: "web-c38", kind: "paper", title: "Web 服务器 第 38 篇考试 · Build Your Own AdBlocker in (Literally) 10 Minutes", pass: 60, questions: [], explain: [] },
            { cid: "web-c39", kind: "paper", title: "Web 服务器 第 39 篇考试 · Build Your Own Cache", pass: 60, questions: [], explain: [] },
            { cid: "web-c40", kind: "paper", title: "Web 服务器 第 40 篇考试 · Building a CDN from Scratch to Learn about CDN", pass: 60, questions: [], explain: [] },
            { cid: "web-c41", kind: "paper", title: "Web 服务器 第 41 篇考试 · Writing a Redis Protocol Parser", pass: 60, questions: [], explain: [] },
            { cid: "web-c42", kind: "paper", title: "Web 服务器 第 42 篇考试 · Writing a Build system", pass: 60, questions: [], explain: [] },
            { cid: "web-c43", kind: "paper", title: "Web 服务器 第 43 篇考试 · Writing a MiniTest Framework", pass: 60, questions: [], explain: [] },
            { cid: "web-c44", kind: "paper", title: "Web 服务器 第 44 篇考试 · Writing a DMIDecode Parser", pass: 60, questions: [], explain: [] },
            { cid: "web-c45", kind: "paper", title: "Web 服务器 第 45 篇考试 · Writing a INI Parser", pass: 60, questions: [], explain: [] },
            { cid: "web-c46", kind: "paper", title: "Web 服务器 第 46 篇考试 · Writing a Link Checker", pass: 60, questions: [], explain: [] },
            { cid: "web-c47", kind: "paper", title: "Web 服务器 第 47 篇考试 · Writing a URL Shortening Service", pass: 60, questions: [], explain: [] },
            { cid: "web-c48", kind: "paper", title: "Web 服务器 第 48 篇考试 · Build a static site generator in 40 lines with Node.js", pass: 60, questions: [], explain: [] },
            { cid: "web-c49", kind: "paper", title: "Web 服务器 第 49 篇考试 · Building A Simple Single Sign On(SSO) Server And Solution From Scratch In Node.js.", pass: 60, questions: [], explain: [] },
            { cid: "web-c50", kind: "paper", title: "Web 服务器 第 50 篇考试 · How to create a real-world Node CLI app with Node", pass: 60, questions: [], explain: [] },
            { cid: "web-c51", kind: "paper", title: "Web 服务器 第 51 篇考试 · Build a DNS Server in Node.js", pass: 60, questions: [], explain: [] },
            { cid: "web-c52", kind: "paper", title: "Web 服务器 第 52 篇考试 · Build a Synchronization Engine with Node.js and Y.js", pass: 60, questions: [], explain: [] },
            { cid: "web-c53", kind: "paper", title: "Web 服务器 第 53 篇考试 · Write your own MVC from scratch in PHP", pass: 60, questions: [], explain: [] },
            { cid: "web-c54", kind: "paper", title: "Web 服务器 第 54 篇考试 · Make your own blog", pass: 60, questions: [], explain: [] },
            { cid: "web-c55", kind: "paper", title: "Web 服务器 第 55 篇考试 · Modern PHP Without a Framework", pass: 60, questions: [], explain: [] },
            { cid: "web-c56", kind: "paper", title: "Web 服务器 第 56 篇考试 · Code a Web Search Engine in PHP", pass: 60, questions: [], explain: [] },
            { cid: "web-c57", kind: "paper", title: "Web 服务器 第 57 篇考试 · Build a Deep Learning Library", pass: 60, questions: [], explain: [] },
            { cid: "web-c58", kind: "paper", title: "Web 服务器 第 58 篇考试 · How to Build a Kick-Ass Mobile Document Scanner in Just 5 Minutes", pass: 60, questions: [], explain: [] },
            { cid: "web-c59", kind: "paper", title: "Web 服务器 第 59 篇考试 · Continuous Integration System", pass: 60, questions: [], explain: [] },
            { cid: "web-c60", kind: "paper", title: "Web 服务器 第 60 篇考试 · Recommender Systems in Python: Beginner Tutorial", pass: 60, questions: [], explain: [] },
            { cid: "web-c61", kind: "paper", title: "Web 服务器 第 61 篇考试 · Write SMS-spam detector with Scikit-learn", pass: 60, questions: [], explain: [] },
            { cid: "web-c62", kind: "paper", title: "Web 服务器 第 62 篇考试 · A Simple Content-Based Recommendation Engine in Python", pass: 60, questions: [], explain: [] },
            { cid: "web-c63", kind: "paper", title: "Web 服务器 第 63 篇考试 · Stock Market Predictions with LSTM in Python", pass: 60, questions: [], explain: [] },
            { cid: "web-c64", kind: "paper", title: "Web 服务器 第 64 篇考试 · Building a simple Generative Adversarial Network (GAN) using Tensorflow", pass: 60, questions: [], explain: [] },
            { cid: "web-c65", kind: "paper", title: "Web 服务器 第 65 篇考试 · Learn ML Algorithms by coding: Decision Trees", pass: 60, questions: [], explain: [] },
            { cid: "web-c66", kind: "paper", title: "Web 服务器 第 66 篇考试 · JSON Decoding Algorithm", pass: 60, questions: [], explain: [] },
            { cid: "web-c67", kind: "paper", title: "Web 服务器 第 67 篇考试 · Build your own Git plugin with python", pass: 60, questions: [], explain: [] },
            { cid: "web-c68", kind: "paper", title: "Web 服务器 第 68 篇考试 · A Pedometer in the Real World", pass: 60, questions: [], explain: [] },
            { cid: "web-c69", kind: "paper", title: "Web 服务器 第 69 篇考试 · Creating a Linux Desktop application with Ruby", pass: 60, questions: [], explain: [] },
            { cid: "web-c70", kind: "paper", title: "Web 服务器 第 70 篇考试 · Building a DNS server in Rust", pass: 60, questions: [], explain: [] },
            { cid: "web-c71", kind: "paper", title: "Web 服务器 第 71 篇考试 · Writing Scalable Chat Service from Scratch", pass: 60, questions: [], explain: [] },
            { cid: "web-c72", kind: "paper", title: "Web 服务器 第 72 篇考试 · WebGL + Rust: Basic Water Tutorial", pass: 60, questions: [], explain: [] },
            { cid: "web-c73", kind: "paper", title: "Web 服务器 第 73 篇考试 · Tiny Package Manager: Learns how npm or Yarn works", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "lang",
          title: "从零造一门编程语言（build-your-own-x 41 篇全做）",
          intro: "这一类要你自己造一门语言：写词法分析器把源码切成 token，写语法分析器搭出语法树，再要么直接求值、要么编成字节码丢进自己的虚拟机跑，最后往上补类型、闭包、宏和垃圾回收。清单来自 build-your-own-x，每章都附原文链接。",
          cat: "算法",
          diff: "精通",
          tags: ["C", "Python", "JavaScript", "编译器", "解释器", "语言设计", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-lang.svg",
          chapters: [
            { id: "lang-c01", title: "编程语言 · mal - Make a Lisp", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「Programming Language」，站内章节 id lang-c01），原文语言 (any)，原文链接 https://github.com/kanaka/mal#mal---make-a-lisp" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「Programming Language」，站内章节 id lang-c01），原文语言 (any)，原文链接 https://github.com/kanaka/mal#mal---make-a-lisp。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c02", title: "编程语言 · Jonesforth", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 2 篇（类目「Programming Language」，站内章节 id lang-c02），原文语言 Assembly，原文链接 https://github.com/nornagon/jonesforth/blob/master/jonesforth.S" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 2 篇（类目「Programming Language」，站内章节 id lang-c02），原文语言 Assembly，原文链接 https://github.com/nornagon/jonesforth/blob/master/jonesforth.S。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c03", title: "编程语言 · Baby's First Garbage Collector", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 3 篇（类目「Programming Language」，站内章节 id lang-c03），原文语言 C，原文链接 http://journal.stuffwithstuff.com/2013/12/08/babys-first-garbage-collector/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 3 篇（类目「Programming Language」，站内章节 id lang-c03），原文语言 C，原文链接 http://journal.stuffwithstuff.com/2013/12/08/babys-first-garbage-collector/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c04", title: "编程语言 · Build Your Own Lisp: Learn C and build your own programming language in 1000 lines of code", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 4 篇（类目「Programming Language」，站内章节 id lang-c04），原文语言 C，原文链接 http://www.buildyourownlisp.com/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 4 篇（类目「Programming Language」，站内章节 id lang-c04），原文语言 C，原文链接 http://www.buildyourownlisp.com/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c05", title: "编程语言 · Writing a Simple Garbage Collector in C", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 5 篇（类目「Programming Language」，站内章节 id lang-c05），原文语言 C，原文链接 http://maplant.com/gc.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 5 篇（类目「Programming Language」，站内章节 id lang-c05），原文语言 C，原文链接 http://maplant.com/gc.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c06", title: "编程语言 · C interpreter that interprets itself.", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 6 篇（类目「Programming Language」，站内章节 id lang-c06），原文语言 C，原文链接 https://github.com/lotabout/write-a-C-interpreter" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 6 篇（类目「Programming Language」，站内章节 id lang-c06），原文语言 C，原文链接 https://github.com/lotabout/write-a-C-interpreter。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c07", title: "编程语言 · A C & x86 version of the \"Let's Build a Compiler\" by Jack Crenshaw", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 7 篇（类目「Programming Language」，站内章节 id lang-c07），原文语言 C，原文链接 https://github.com/lotabout/Let-s-build-a-compiler" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 7 篇（类目「Programming Language」，站内章节 id lang-c07），原文语言 C，原文链接 https://github.com/lotabout/Let-s-build-a-compiler。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c08", title: "编程语言 · A journey explaining how to build a compiler from scratch", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 8 篇（类目「Programming Language」，站内章节 id lang-c08），原文语言 C，原文链接 https://github.com/DoctorWkt/acwj" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 8 篇（类目「Programming Language」，站内章节 id lang-c08），原文语言 C，原文链接 https://github.com/DoctorWkt/acwj。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c09", title: "编程语言 · Writing Your Own Toy Compiler Using Flex", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 9 篇（类目「Programming Language」，站内章节 id lang-c09），原文语言 C++，原文链接 https://gnuu.org/2009/09/18/writing-your-own-toy-compiler/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 9 篇（类目「Programming Language」，站内章节 id lang-c09），原文语言 C++，原文链接 https://gnuu.org/2009/09/18/writing-your-own-toy-compiler/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c10", title: "编程语言 · How to Create a Compiler", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 10 篇（类目「Programming Language」，站内章节 id lang-c10），原文语言 C++，原文链接 https://www.youtube.com/watch?v=eF9qWbuQLuw（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 10 篇（类目「Programming Language」，站内章节 id lang-c10），原文语言 C++，原文链接 https://www.youtube.com/watch?v=eF9qWbuQLuw（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c11", title: "编程语言 · Kaleidoscope: Implementing a Language with LLVM", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 11 篇（类目「Programming Language」，站内章节 id lang-c11），原文语言 C++，原文链接 https://llvm.org/docs/tutorial/MyFirstLanguageFrontend/index.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 11 篇（类目「Programming Language」，站内章节 id lang-c11），原文语言 C++，原文链接 https://llvm.org/docs/tutorial/MyFirstLanguageFrontend/index.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c12", title: "编程语言 · Understanding Parser Combinators", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 12 篇（类目「Programming Language」，站内章节 id lang-c12），原文语言 F#，原文链接 https://fsharpforfunandprofit.com/posts/understanding-parser-combinators/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 12 篇（类目「Programming Language」，站内章节 id lang-c12），原文语言 F#，原文链接 https://fsharpforfunandprofit.com/posts/understanding-parser-combinators/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c13", title: "编程语言 · Demystifying compilers by writing your own", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 13 篇（类目「Programming Language」，站内章节 id lang-c13），原文语言 Elixir，原文链接 https://www.youtube.com/watch?v=zMJYoYwOCd4（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 13 篇（类目「Programming Language」，站内章节 id lang-c13），原文语言 Elixir，原文链接 https://www.youtube.com/watch?v=zMJYoYwOCd4（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c14", title: "编程语言 · The Super Tiny Compiler", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 14 篇（类目「Programming Language」，站内章节 id lang-c14），原文语言 Go，原文链接 https://github.com/hazbo/the-super-tiny-compiler" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 14 篇（类目「Programming Language」，站内章节 id lang-c14），原文语言 Go，原文链接 https://github.com/hazbo/the-super-tiny-compiler。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c15", title: "编程语言 · Lexical Scanning in Go", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 15 篇（类目「Programming Language」，站内章节 id lang-c15），原文语言 Go，原文链接 https://www.youtube.com/watch?v=HxaD_trXwRE（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 15 篇（类目「Programming Language」，站内章节 id lang-c15），原文语言 Go，原文链接 https://www.youtube.com/watch?v=HxaD_trXwRE（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c16", title: "编程语言 · Let's Build a Compiler", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 16 篇（类目「Programming Language」，站内章节 id lang-c16），原文语言 Haskell，原文链接 https://g-ford.github.io/cradle/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 16 篇（类目「Programming Language」，站内章节 id lang-c16），原文语言 Haskell，原文链接 https://g-ford.github.io/cradle/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c17", title: "编程语言 · Write You a Haskell", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 17 篇（类目「Programming Language」，站内章节 id lang-c17），原文语言 Haskell，原文链接 http://dev.stephendiehl.com/fun/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 17 篇（类目「Programming Language」，站内章节 id lang-c17），原文语言 Haskell，原文链接 http://dev.stephendiehl.com/fun/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c18", title: "编程语言 · Write Yourself a Scheme in 48 Hours", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 18 篇（类目「Programming Language」，站内章节 id lang-c18），原文语言 Haskell，原文链接 https://en.wikibooks.org/wiki/Write_Yourself_a_Scheme_in_48_Hours" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 18 篇（类目「Programming Language」，站内章节 id lang-c18），原文语言 Haskell，原文链接 https://en.wikibooks.org/wiki/Write_Yourself_a_Scheme_in_48_Hours。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c19", title: "编程语言 · Write You A Scheme", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 19 篇（类目「Programming Language」，站内章节 id lang-c19），原文语言 Haskell，原文链接 https://www.wespiser.com/writings/wyas/home.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 19 篇（类目「Programming Language」，站内章节 id lang-c19），原文语言 Haskell，原文链接 https://www.wespiser.com/writings/wyas/home.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c20", title: "编程语言 · Crafting interpreters: A handbook for making programming languages", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 20 篇（类目「Programming Language」，站内章节 id lang-c20），原文语言 Java，原文链接 http://www.craftinginterpreters.com/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 20 篇（类目「Programming Language」，站内章节 id lang-c20），原文语言 Java，原文链接 http://www.craftinginterpreters.com/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c21", title: "编程语言 · Creating JVM Language", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 21 篇（类目「Programming Language」，站内章节 id lang-c21），原文语言 Java，原文链接 http://jakubdziworski.github.io/categories.html#Enkel-ref" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 21 篇（类目「Programming Language」，站内章节 id lang-c21），原文语言 Java，原文链接 http://jakubdziworski.github.io/categories.html#Enkel-ref。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c22", title: "编程语言 · The Super Tiny Compiler", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 22 篇（类目「Programming Language」，站内章节 id lang-c22），原文语言 JavaScript，原文链接 https://github.com/jamiebuilds/the-super-tiny-compiler" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 22 篇（类目「Programming Language」，站内章节 id lang-c22），原文语言 JavaScript，原文链接 https://github.com/jamiebuilds/the-super-tiny-compiler。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c23", title: "编程语言 · The Super Tiny Interpreter", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 23 篇（类目「Programming Language」，站内章节 id lang-c23），原文语言 JavaScript，原文链接 https://github.com/keyanzhang/the-super-tiny-interpreter" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 23 篇（类目「Programming Language」，站内章节 id lang-c23），原文语言 JavaScript，原文链接 https://github.com/keyanzhang/the-super-tiny-interpreter。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c24", title: "编程语言 · Little Lisp interpreter", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 24 篇（类目「Programming Language」，站内章节 id lang-c24），原文语言 JavaScript，原文链接 https://maryrosecook.com/blog/post/little-lisp-interpreter" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 24 篇（类目「Programming Language」，站内章节 id lang-c24），原文语言 JavaScript，原文链接 https://maryrosecook.com/blog/post/little-lisp-interpreter。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c25", title: "编程语言 · How to implement a programming language in JavaScript", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 25 篇（类目「Programming Language」，站内章节 id lang-c25），原文语言 JavaScript，原文链接 http://lisperator.net/pltut/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 25 篇（类目「Programming Language」，站内章节 id lang-c25），原文语言 JavaScript，原文链接 http://lisperator.net/pltut/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c26", title: "编程语言 · Let’s go write a Lisp", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 26 篇（类目「Programming Language」，站内章节 id lang-c26），原文语言 JavaScript，原文链接 https://idiocy.org/lets-go-write-a-lisp/part-1.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 26 篇（类目「Programming Language」，站内章节 id lang-c26），原文语言 JavaScript，原文链接 https://idiocy.org/lets-go-write-a-lisp/part-1.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c27", title: "编程语言 · Writing a C Compiler", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 27 篇（类目「Programming Language」，站内章节 id lang-c27），原文语言 OCaml，原文链接 https://norasandler.com/2017/11/29/Write-a-Compiler.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 27 篇（类目「Programming Language」，站内章节 id lang-c27），原文语言 OCaml，原文链接 https://norasandler.com/2017/11/29/Write-a-Compiler.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c28", title: "编程语言 · Writing a Lisp, the series", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 28 篇（类目「Programming Language」，站内章节 id lang-c28），原文语言 OCaml，原文链接 https://bernsteinbear.com/blog/lisp/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 28 篇（类目「Programming Language」，站内章节 id lang-c28），原文语言 OCaml，原文链接 https://bernsteinbear.com/blog/lisp/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c29", title: "编程语言 · Let's Build a Compiler", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 29 篇（类目「Programming Language」，站内章节 id lang-c29），原文语言 Pascal，原文链接 https://compilers.iecc.com/crenshaw/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 29 篇（类目「Programming Language」，站内章节 id lang-c29），原文语言 Pascal，原文链接 https://compilers.iecc.com/crenshaw/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c30", title: "编程语言 · A Python Interpreter Written in Python", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 30 篇（类目「Programming Language」，站内章节 id lang-c30），原文语言 Python，原文链接 http://aosabook.org/en/500L/a-python-interpreter-written-in-python.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 30 篇（类目「Programming Language」，站内章节 id lang-c30），原文语言 Python，原文链接 http://aosabook.org/en/500L/a-python-interpreter-written-in-python.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c31", title: "编程语言 · lisp.py: Make your own Lisp interpreter", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 31 篇（类目「Programming Language」，站内章节 id lang-c31），原文语言 Python，原文链接 http://khamidou.com/compilers/lisp.py/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 31 篇（类目「Programming Language」，站内章节 id lang-c31），原文语言 Python，原文链接 http://khamidou.com/compilers/lisp.py/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c32", title: "编程语言 · How to Write a Lisp Interpreter in Python", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 32 篇（类目「Programming Language」，站内章节 id lang-c32），原文语言 Python，原文链接 http://norvig.com/lispy.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 32 篇（类目「Programming Language」，站内章节 id lang-c32），原文语言 Python，原文链接 http://norvig.com/lispy.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c33", title: "编程语言 · Let’s Build A Simple Interpreter", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 33 篇（类目「Programming Language」，站内章节 id lang-c33），原文语言 Python，原文链接 https://ruslanspivak.com/lsbasi-part1/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 33 篇（类目「Programming Language」，站内章节 id lang-c33），原文语言 Python，原文链接 https://ruslanspivak.com/lsbasi-part1/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c34", title: "编程语言 · Make Your Own Simple Interpreted Programming Language", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 34 篇（类目「Programming Language」，站内章节 id lang-c34），原文语言 Python，原文链接 https://www.youtube.com/watch?v=dj9CBS3ikGA&list=PLZQftyCk7_SdoVexSmwy_tBgs7P0b97yD&index=1（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 34 篇（类目「Programming Language」，站内章节 id lang-c34），原文语言 Python，原文链接 https://www.youtube.com/watch?v=dj9CBS3ikGA&list=PLZQftyCk7_SdoVexSmwy_tBgs7P0b97yD&index=1（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c35", title: "编程语言 · From Source Code To Machine Code: Build Your Own Compiler From Scratch", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 35 篇（类目「Programming Language」，站内章节 id lang-c35），原文语言 Python，原文链接 https://build-your-own.org/compiler/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 35 篇（类目「Programming Language」，站内章节 id lang-c35），原文语言 Python，原文链接 https://build-your-own.org/compiler/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c36", title: "编程语言 · Beautiful Racket: How to make your own programming languages with Racket", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 36 篇（类目「Programming Language」，站内章节 id lang-c36），原文语言 Racket，原文链接 https://beautifulracket.com/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 36 篇（类目「Programming Language」，站内章节 id lang-c36），原文语言 Racket，原文链接 https://beautifulracket.com/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c37", title: "编程语言 · A Compiler From Scratch", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 37 篇（类目「Programming Language」，站内章节 id lang-c37），原文语言 Ruby，原文链接 https://www.destroyallsoftware.com/screencasts/catalog/a-compiler-from-scratch" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 37 篇（类目「Programming Language」，站内章节 id lang-c37），原文语言 Ruby，原文链接 https://www.destroyallsoftware.com/screencasts/catalog/a-compiler-from-scratch。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c38", title: "编程语言 · Markdown compiler from scratch in Ruby", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 38 篇（类目「Programming Language」，站内章节 id lang-c38），原文语言 Ruby，原文链接 https://blog.beezwax.net/2017/07/07/writing-a-markdown-compiler/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 38 篇（类目「Programming Language」，站内章节 id lang-c38），原文语言 Ruby，原文链接 https://blog.beezwax.net/2017/07/07/writing-a-markdown-compiler/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c39", title: "编程语言 · Learning Parser Combinators With Rust", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 39 篇（类目「Programming Language」，站内章节 id lang-c39），原文语言 Rust，原文链接 https://bodil.lol/parser-combinators/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 39 篇（类目「Programming Language」，站内章节 id lang-c39），原文语言 Rust，原文链接 https://bodil.lol/parser-combinators/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c40", title: "编程语言 · Building a LISP from scratch with Swift", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 40 篇（类目「Programming Language」，站内章节 id lang-c40），原文语言 Swift，原文链接 https://www.uraimo.com/2017/02/05/building-a-lisp-from-scratch-with-swift/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 40 篇（类目「Programming Language」，站内章节 id lang-c40），原文语言 Swift，原文链接 https://www.uraimo.com/2017/02/05/building-a-lisp-from-scratch-with-swift/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "lang-c41", title: "编程语言 · Build your own WebAssembly Compiler", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 41 篇（类目「Programming Language」，站内章节 id lang-c41），原文语言 TypeScript，原文链接 https://blog.scottlogic.com/2019/05/17/webassembly-compiler.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 41 篇（类目「Programming Language」，站内章节 id lang-c41），原文语言 TypeScript，原文链接 https://blog.scottlogic.com/2019/05/17/webassembly-compiler.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "Programming Language", papers: [
            { cid: "lang-c01", kind: "paper", title: "编程语言 第 1 篇考试 · mal - Make a Lisp", pass: 60, questions: [], explain: [] },
            { cid: "lang-c02", kind: "paper", title: "编程语言 第 2 篇考试 · Jonesforth", pass: 60, questions: [], explain: [] },
            { cid: "lang-c03", kind: "paper", title: "编程语言 第 3 篇考试 · Baby's First Garbage Collector", pass: 60, questions: [], explain: [] },
            { cid: "lang-c04", kind: "paper", title: "编程语言 第 4 篇考试 · Build Your Own Lisp: Learn C and build your own programming language in 1000 lines of code", pass: 60, questions: [], explain: [] },
            { cid: "lang-c05", kind: "paper", title: "编程语言 第 5 篇考试 · Writing a Simple Garbage Collector in C", pass: 60, questions: [], explain: [] },
            { cid: "lang-c06", kind: "paper", title: "编程语言 第 6 篇考试 · C interpreter that interprets itself.", pass: 60, questions: [], explain: [] },
            { cid: "lang-c07", kind: "paper", title: "编程语言 第 7 篇考试 · A C & x86 version of the \"Let's Build a Compiler\" by Jack Crenshaw", pass: 60, questions: [], explain: [] },
            { cid: "lang-c08", kind: "paper", title: "编程语言 第 8 篇考试 · A journey explaining how to build a compiler from scratch", pass: 60, questions: [], explain: [] },
            { cid: "lang-c09", kind: "paper", title: "编程语言 第 9 篇考试 · Writing Your Own Toy Compiler Using Flex", pass: 60, questions: [], explain: [] },
            { cid: "lang-c10", kind: "paper", title: "编程语言 第 10 篇考试 · How to Create a Compiler", pass: 60, questions: [], explain: [] },
            { cid: "lang-c11", kind: "paper", title: "编程语言 第 11 篇考试 · Kaleidoscope: Implementing a Language with LLVM", pass: 60, questions: [], explain: [] },
            { cid: "lang-c12", kind: "paper", title: "编程语言 第 12 篇考试 · Understanding Parser Combinators", pass: 60, questions: [], explain: [] },
            { cid: "lang-c13", kind: "paper", title: "编程语言 第 13 篇考试 · Demystifying compilers by writing your own", pass: 60, questions: [], explain: [] },
            { cid: "lang-c14", kind: "paper", title: "编程语言 第 14 篇考试 · The Super Tiny Compiler", pass: 60, questions: [], explain: [] },
            { cid: "lang-c15", kind: "paper", title: "编程语言 第 15 篇考试 · Lexical Scanning in Go", pass: 60, questions: [], explain: [] },
            { cid: "lang-c16", kind: "paper", title: "编程语言 第 16 篇考试 · Let's Build a Compiler", pass: 60, questions: [], explain: [] },
            { cid: "lang-c17", kind: "paper", title: "编程语言 第 17 篇考试 · Write You a Haskell", pass: 60, questions: [], explain: [] },
            { cid: "lang-c18", kind: "paper", title: "编程语言 第 18 篇考试 · Write Yourself a Scheme in 48 Hours", pass: 60, questions: [], explain: [] },
            { cid: "lang-c19", kind: "paper", title: "编程语言 第 19 篇考试 · Write You A Scheme", pass: 60, questions: [], explain: [] },
            { cid: "lang-c20", kind: "paper", title: "编程语言 第 20 篇考试 · Crafting interpreters: A handbook for making programming languages", pass: 60, questions: [], explain: [] },
            { cid: "lang-c21", kind: "paper", title: "编程语言 第 21 篇考试 · Creating JVM Language", pass: 60, questions: [], explain: [] },
            { cid: "lang-c22", kind: "paper", title: "编程语言 第 22 篇考试 · The Super Tiny Compiler", pass: 60, questions: [], explain: [] },
            { cid: "lang-c23", kind: "paper", title: "编程语言 第 23 篇考试 · The Super Tiny Interpreter", pass: 60, questions: [], explain: [] },
            { cid: "lang-c24", kind: "paper", title: "编程语言 第 24 篇考试 · Little Lisp interpreter", pass: 60, questions: [], explain: [] },
            { cid: "lang-c25", kind: "paper", title: "编程语言 第 25 篇考试 · How to implement a programming language in JavaScript", pass: 60, questions: [], explain: [] },
            { cid: "lang-c26", kind: "paper", title: "编程语言 第 26 篇考试 · Let’s go write a Lisp", pass: 60, questions: [], explain: [] },
            { cid: "lang-c27", kind: "paper", title: "编程语言 第 27 篇考试 · Writing a C Compiler", pass: 60, questions: [], explain: [] },
            { cid: "lang-c28", kind: "paper", title: "编程语言 第 28 篇考试 · Writing a Lisp, the series", pass: 60, questions: [], explain: [] },
            { cid: "lang-c29", kind: "paper", title: "编程语言 第 29 篇考试 · Let's Build a Compiler", pass: 60, questions: [], explain: [] },
            { cid: "lang-c30", kind: "paper", title: "编程语言 第 30 篇考试 · A Python Interpreter Written in Python", pass: 60, questions: [], explain: [] },
            { cid: "lang-c31", kind: "paper", title: "编程语言 第 31 篇考试 · lisp.py: Make your own Lisp interpreter", pass: 60, questions: [], explain: [] },
            { cid: "lang-c32", kind: "paper", title: "编程语言 第 32 篇考试 · How to Write a Lisp Interpreter in Python", pass: 60, questions: [], explain: [] },
            { cid: "lang-c33", kind: "paper", title: "编程语言 第 33 篇考试 · Let’s Build A Simple Interpreter", pass: 60, questions: [], explain: [] },
            { cid: "lang-c34", kind: "paper", title: "编程语言 第 34 篇考试 · Make Your Own Simple Interpreted Programming Language", pass: 60, questions: [], explain: [] },
            { cid: "lang-c35", kind: "paper", title: "编程语言 第 35 篇考试 · From Source Code To Machine Code: Build Your Own Compiler From Scratch", pass: 60, questions: [], explain: [] },
            { cid: "lang-c36", kind: "paper", title: "编程语言 第 36 篇考试 · Beautiful Racket: How to make your own programming languages with Racket", pass: 60, questions: [], explain: [] },
            { cid: "lang-c37", kind: "paper", title: "编程语言 第 37 篇考试 · A Compiler From Scratch", pass: 60, questions: [], explain: [] },
            { cid: "lang-c38", kind: "paper", title: "编程语言 第 38 篇考试 · Markdown compiler from scratch in Ruby", pass: 60, questions: [], explain: [] },
            { cid: "lang-c39", kind: "paper", title: "编程语言 第 39 篇考试 · Learning Parser Combinators With Rust", pass: 60, questions: [], explain: [] },
            { cid: "lang-c40", kind: "paper", title: "编程语言 第 40 篇考试 · Building a LISP from scratch with Swift", pass: 60, questions: [], explain: [] },
            { cid: "lang-c41", kind: "paper", title: "编程语言 第 41 篇考试 · Build your own WebAssembly Compiler", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "game",
          title: "从零做一个游戏（build-your-own-x 34 篇全做）",
          intro: "这一类要你自己造游戏和小游戏引擎：开窗口、画帧、读输入、跑主循环，再做碰撞、重力、精灵动画与关卡，最后攒出一个能反复用的引擎。清单来自 build-your-own-x，每章都附原文链接。",
          cat: "计算机基础",
          diff: "入门",
          tags: ["C", "C++", "JavaScript", "游戏开发", "图形", "碰撞", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-game.svg",
          chapters: [
            { id: "game-c01", title: "游戏 · Handmade Hero", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「Game」，站内章节 id game-c01），原文语言 C，原文链接 https://handmadehero.org/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「Game」，站内章节 id game-c01），原文语言 C，原文链接 https://handmadehero.org/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c02", title: "游戏 · How to Program an NES game in C", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 2 篇（类目「Game」，站内章节 id game-c02），原文语言 C，原文链接 https://nesdoug.com/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 2 篇（类目「Game」，站内章节 id game-c02），原文语言 C，原文链接 https://nesdoug.com/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c03", title: "游戏 · Chess Engine In C", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 3 篇（类目「Game」，站内章节 id game-c03），原文语言 C，原文链接 https://www.youtube.com/playlist?list=PLZ1QII7yudbc-Ky058TEaOstZHVbT-2hg（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 3 篇（类目「Game」，站内章节 id game-c03），原文语言 C，原文链接 https://www.youtube.com/playlist?list=PLZ1QII7yudbc-Ky058TEaOstZHVbT-2hg（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c04", title: "游戏 · Let's Make: Dangerous Dave", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 4 篇（类目「Game」，站内章节 id game-c04），原文语言 C，原文链接 https://www.youtube.com/playlist?list=PLSkJey49cOgTSj465v2KbLZ7LMn10bCF9（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 4 篇（类目「Game」，站内章节 id game-c04），原文语言 C，原文链接 https://www.youtube.com/playlist?list=PLSkJey49cOgTSj465v2KbLZ7LMn10bCF9（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c05", title: "游戏 · Learn Video Game Programming in C", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 5 篇（类目「Game」，站内章节 id game-c05），原文语言 C，原文链接 https://www.youtube.com/playlist?list=PLT6WFYYZE6uLMcPGS3qfpYm7T_gViYMMt（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 5 篇（类目「Game」，站内章节 id game-c05），原文语言 C，原文链接 https://www.youtube.com/playlist?list=PLT6WFYYZE6uLMcPGS3qfpYm7T_gViYMMt（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c06", title: "游戏 · Coding A Sudoku Solver in C", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 6 篇（类目「Game」，站内章节 id game-c06），原文语言 C，原文链接 https://www.youtube.com/playlist?list=PLkTXsX7igf8edTYU92nU-f5Ntzuf-RKvW（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 6 篇（类目「Game」，站内章节 id game-c06），原文语言 C，原文链接 https://www.youtube.com/playlist?list=PLkTXsX7igf8edTYU92nU-f5Ntzuf-RKvW（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c07", title: "游戏 · Coding a Rogue/Nethack RPG in C", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 7 篇（类目「Game」，站内章节 id game-c07），原文语言 C，原文链接 https://www.youtube.com/playlist?list=PLkTXsX7igf8erbWGYT4iSAhpnJLJ0Nk5G（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 7 篇（类目「Game」，站内章节 id game-c07），原文语言 C，原文链接 https://www.youtube.com/playlist?list=PLkTXsX7igf8erbWGYT4iSAhpnJLJ0Nk5G（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c08", title: "游戏 · On Tetris and Reimplementation", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 8 篇（类目「Game」，站内章节 id game-c08），原文语言 C，原文链接 https://brennan.io/2015/06/12/tetris-reimplementation/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 8 篇（类目「Game」，站内章节 id game-c08），原文语言 C，原文链接 https://brennan.io/2015/06/12/tetris-reimplementation/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c09", title: "游戏 · Breakout", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 9 篇（类目「Game」，站内章节 id game-c09），原文语言 C++，原文链接 https://learnopengl.com/In-Practice/2D-Game/Breakout" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 9 篇（类目「Game」，站内章节 id game-c09），原文语言 C++，原文链接 https://learnopengl.com/In-Practice/2D-Game/Breakout。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c10", title: "游戏 · Beginning Game Programming v2.0", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 10 篇（类目「Game」，站内章节 id game-c10），原文语言 C++，原文链接 http://lazyfoo.net/tutorials/SDL/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 10 篇（类目「Game」，站内章节 id game-c10），原文语言 C++，原文链接 http://lazyfoo.net/tutorials/SDL/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c11", title: "游戏 · Tetris tutorial in C++ platform independent focused in game logic for beginners", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 11 篇（类目「Game」，站内章节 id game-c11），原文语言 C++，原文链接 http://javilop.com/gamedev/tetris-tutorial-in-c-platform-independent-focused-in-game-logic-for-beginners/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 11 篇（类目「Game」，站内章节 id game-c11），原文语言 C++，原文链接 http://javilop.com/gamedev/tetris-tutorial-in-c-platform-independent-focused-in-game-logic-for-beginners/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c12", title: "游戏 · Remaking Cavestory in C++", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 12 篇（类目「Game」，站内章节 id game-c12），原文语言 C++，原文链接 https://www.youtube.com/watch?v=ETvApbD5xRo&list=PLNOBk_id22bw6LXhrGfhVwqQIa-M2MsLa（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 12 篇（类目「Game」，站内章节 id game-c12），原文语言 C++，原文链接 https://www.youtube.com/watch?v=ETvApbD5xRo&list=PLNOBk_id22bw6LXhrGfhVwqQIa-M2MsLa（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c13", title: "游戏 · Reconstructing Cave Story", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 13 篇（类目「Game」，站内章节 id game-c13），原文语言 C++，原文链接 https://www.youtube.com/playlist?list=PL006xsVEsbKjSKBmLu1clo85yLrwjY67X（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 13 篇（类目「Game」，站内章节 id game-c13），原文语言 C++，原文链接 https://www.youtube.com/playlist?list=PL006xsVEsbKjSKBmLu1clo85yLrwjY67X（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c14", title: "游戏 · Space Invaders from Scratch", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 14 篇（类目「Game」，站内章节 id game-c14），原文语言 C++，原文链接 http://nicktasios.nl/posts/space-invaders-from-scratch-part-1.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 14 篇（类目「Game」，站内章节 id game-c14），原文语言 C++，原文链接 http://nicktasios.nl/posts/space-invaders-from-scratch-part-1.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c15", title: "游戏 · Learn C# by Building a Simple RPG", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 15 篇（类目「Game」，站内章节 id game-c15），原文语言 C#，原文链接 http://scottlilly.com/learn-c-by-building-a-simple-rpg-index/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 15 篇（类目「Game」，站内章节 id game-c15），原文语言 C#，原文链接 http://scottlilly.com/learn-c-by-building-a-simple-rpg-index/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c16", title: "游戏 · Creating a Roguelike Game in C#", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 16 篇（类目「Game」，站内章节 id game-c16），原文语言 C#，原文链接 https://roguesharp.wordpress.com/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 16 篇（类目「Game」，站内章节 id game-c16），原文语言 C#，原文链接 https://roguesharp.wordpress.com/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c17", title: "游戏 · Build a C#/WPF RPG", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 17 篇（类目「Game」，站内章节 id game-c17），原文语言 C#，原文链接 https://scottlilly.com/build-a-cwpf-rpg/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 17 篇（类目「Game」，站内章节 id game-c17），原文语言 C#，原文链接 https://scottlilly.com/build-a-cwpf-rpg/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c18", title: "游戏 · Games With Go", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 18 篇（类目「Game」，站内章节 id game-c18），原文语言 Go，原文链接 https://www.youtube.com/playlist?list=PLDZujg-VgQlZUy1iCqBbe5faZLMkA3g2x（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 18 篇（类目「Game」，站内章节 id game-c18），原文语言 Go，原文链接 https://www.youtube.com/playlist?list=PLDZujg-VgQlZUy1iCqBbe5faZLMkA3g2x（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c19", title: "游戏 · Code a 2D Game Engine using Java - Full Course for Beginners", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 19 篇（类目「Game」，站内章节 id game-c19），原文语言 Java，原文链接 https://www.youtube.com/watch?v=025QFeZfeyM（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 19 篇（类目「Game」，站内章节 id game-c19），原文语言 Java，原文链接 https://www.youtube.com/watch?v=025QFeZfeyM（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c20", title: "游戏 · 3D Game Development with LWJGL 3", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 20 篇（类目「Game」，站内章节 id game-c20），原文语言 Java，原文链接 https://lwjglgamedev.gitbooks.io/3d-game-development-with-lwjgl/content/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 20 篇（类目「Game」，站内章节 id game-c20），原文语言 Java，原文链接 https://lwjglgamedev.gitbooks.io/3d-game-development-with-lwjgl/content/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c21", title: "游戏 · 2D breakout game using Phaser", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 21 篇（类目「Game」，站内章节 id game-c21），原文语言 JavaScript，原文链接 https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_breakout_game_Phaser" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 21 篇（类目「Game」，站内章节 id game-c21），原文语言 JavaScript，原文链接 https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_breakout_game_Phaser。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c22", title: "游戏 · How to Make Flappy Bird in HTML5 With Phaser", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 22 篇（类目「Game」，站内章节 id game-c22），原文语言 JavaScript，原文链接 http://www.lessmilk.com/tutorial/flappy-bird-phaser-1" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 22 篇（类目「Game」，站内章节 id game-c22），原文语言 JavaScript，原文链接 http://www.lessmilk.com/tutorial/flappy-bird-phaser-1。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c23", title: "游戏 · Developing Games with React, Redux, and SVG", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 23 篇（类目「Game」，站内章节 id game-c23），原文语言 JavaScript，原文链接 https://auth0.com/blog/developing-games-with-react-redux-and-svg-part-1/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 23 篇（类目「Game」，站内章节 id game-c23），原文语言 JavaScript，原文链接 https://auth0.com/blog/developing-games-with-react-redux-and-svg-part-1/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c24", title: "游戏 · Build your own 8-Ball Pool game from scratch", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 24 篇（类目「Game」，站内章节 id game-c24），原文语言 JavaScript，原文链接 https://www.youtube.com/watch?v=aXwCrtAo4Wc（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 24 篇（类目「Game」，站内章节 id game-c24），原文语言 JavaScript，原文链接 https://www.youtube.com/watch?v=aXwCrtAo4Wc（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c25", title: "游戏 · How to Make Your First Roguelike", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 25 篇（类目「Game」，站内章节 id game-c25），原文语言 JavaScript，原文链接 https://gamedevelopment.tutsplus.com/tutorials/how-to-make-your-first-roguelike--gamedev-13677" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 25 篇（类目「Game」，站内章节 id game-c25），原文语言 JavaScript，原文链接 https://gamedevelopment.tutsplus.com/tutorials/how-to-make-your-first-roguelike--gamedev-13677。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c26", title: "游戏 · Think like a programmer: How to build Snake using only JavaScript, HTML & CSS", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 26 篇（类目「Game」，站内章节 id game-c26），原文语言 JavaScript，原文链接 https://medium.freecodecamp.org/think-like-a-programmer-how-to-build-snake-using-only-javascript-html-and-css-7b1479c3339e" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 26 篇（类目「Game」，站内章节 id game-c26），原文语言 JavaScript，原文链接 https://medium.freecodecamp.org/think-like-a-programmer-how-to-build-snake-using-only-javascript-html-and-css-7b1479c3339e。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c27", title: "游戏 · BYTEPATH", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 27 篇（类目「Game」，站内章节 id game-c27），原文语言 Lua，原文链接 https://github.com/SSYGEN/blog/issues/30" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 27 篇（类目「Game」，站内章节 id game-c27），原文语言 Lua，原文链接 https://github.com/SSYGEN/blog/issues/30。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c28", title: "游戏 · Developing Games With PyGame", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 28 篇（类目「Game」，站内章节 id game-c28），原文语言 Python，原文链接 https://pythonprogramming.net/pygame-python-3-part-1-intro/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 28 篇（类目「Game」，站内章节 id game-c28），原文语言 Python，原文链接 https://pythonprogramming.net/pygame-python-3-part-1-intro/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c29", title: "游戏 · Making Games with Python & Pygame", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 29 篇（类目「Game」，站内章节 id game-c29），原文语言 Python，原文链接 https://inventwithpython.com/makinggames.pdf" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 29 篇（类目「Game」，站内章节 id game-c29），原文语言 Python，原文链接 https://inventwithpython.com/makinggames.pdf。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c30", title: "游戏 · Roguelike Tutorial Revised", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 30 篇（类目「Game」，站内章节 id game-c30），原文语言 Python，原文链接 http://rogueliketutorials.com/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 30 篇（类目「Game」，站内章节 id game-c30），原文语言 Python，原文链接 http://rogueliketutorials.com/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c31", title: "游戏 · Developing Games With Ruby", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 31 篇（类目「Game」，站内章节 id game-c31），原文语言 Ruby，原文链接 https://leanpub.com/developing-games-with-ruby/read" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 31 篇（类目「Game」，站内章节 id game-c31），原文语言 Ruby，原文链接 https://leanpub.com/developing-games-with-ruby/read。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c32", title: "游戏 · Ruby Snake", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 32 篇（类目「Game」，站内章节 id game-c32），原文语言 Ruby，原文链接 https://www.diatomenterprises.com/gamedev-on-ruby-why-not/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 32 篇（类目「Game」，站内章节 id game-c32），原文语言 Ruby，原文链接 https://www.diatomenterprises.com/gamedev-on-ruby-why-not/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c33", title: "游戏 · Adventures in Rust: A Basic 2D Game", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 33 篇（类目「Game」，站内章节 id game-c33），原文语言 Rust，原文链接 https://a5huynh.github.io/posts/2018/adventures-in-rust/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 33 篇（类目「Game」，站内章节 id game-c33），原文语言 Rust，原文链接 https://a5huynh.github.io/posts/2018/adventures-in-rust/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "game-c34", title: "游戏 · Roguelike Tutorial in Rust + tcod", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 34 篇（类目「Game」，站内章节 id game-c34），原文语言 Rust，原文链接 https://tomassedovic.github.io/roguelike-tutorial/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 34 篇（类目「Game」，站内章节 id game-c34），原文语言 Rust，原文链接 https://tomassedovic.github.io/roguelike-tutorial/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "Game", papers: [
            { cid: "game-c01", kind: "paper", title: "游戏 第 1 篇考试 · Handmade Hero", pass: 60, questions: [], explain: [] },
            { cid: "game-c02", kind: "paper", title: "游戏 第 2 篇考试 · How to Program an NES game in C", pass: 60, questions: [], explain: [] },
            { cid: "game-c03", kind: "paper", title: "游戏 第 3 篇考试 · Chess Engine In C", pass: 60, questions: [], explain: [] },
            { cid: "game-c04", kind: "paper", title: "游戏 第 4 篇考试 · Let's Make: Dangerous Dave", pass: 60, questions: [], explain: [] },
            { cid: "game-c05", kind: "paper", title: "游戏 第 5 篇考试 · Learn Video Game Programming in C", pass: 60, questions: [], explain: [] },
            { cid: "game-c06", kind: "paper", title: "游戏 第 6 篇考试 · Coding A Sudoku Solver in C", pass: 60, questions: [], explain: [] },
            { cid: "game-c07", kind: "paper", title: "游戏 第 7 篇考试 · Coding a Rogue/Nethack RPG in C", pass: 60, questions: [], explain: [] },
            { cid: "game-c08", kind: "paper", title: "游戏 第 8 篇考试 · On Tetris and Reimplementation", pass: 60, questions: [], explain: [] },
            { cid: "game-c09", kind: "paper", title: "游戏 第 9 篇考试 · Breakout", pass: 60, questions: [], explain: [] },
            { cid: "game-c10", kind: "paper", title: "游戏 第 10 篇考试 · Beginning Game Programming v2.0", pass: 60, questions: [], explain: [] },
            { cid: "game-c11", kind: "paper", title: "游戏 第 11 篇考试 · Tetris tutorial in C++ platform independent focused in game logic for beginners", pass: 60, questions: [], explain: [] },
            { cid: "game-c12", kind: "paper", title: "游戏 第 12 篇考试 · Remaking Cavestory in C++", pass: 60, questions: [], explain: [] },
            { cid: "game-c13", kind: "paper", title: "游戏 第 13 篇考试 · Reconstructing Cave Story", pass: 60, questions: [], explain: [] },
            { cid: "game-c14", kind: "paper", title: "游戏 第 14 篇考试 · Space Invaders from Scratch", pass: 60, questions: [], explain: [] },
            { cid: "game-c15", kind: "paper", title: "游戏 第 15 篇考试 · Learn C# by Building a Simple RPG", pass: 60, questions: [], explain: [] },
            { cid: "game-c16", kind: "paper", title: "游戏 第 16 篇考试 · Creating a Roguelike Game in C#", pass: 60, questions: [], explain: [] },
            { cid: "game-c17", kind: "paper", title: "游戏 第 17 篇考试 · Build a C#/WPF RPG", pass: 60, questions: [], explain: [] },
            { cid: "game-c18", kind: "paper", title: "游戏 第 18 篇考试 · Games With Go", pass: 60, questions: [], explain: [] },
            { cid: "game-c19", kind: "paper", title: "游戏 第 19 篇考试 · Code a 2D Game Engine using Java - Full Course for Beginners", pass: 60, questions: [], explain: [] },
            { cid: "game-c20", kind: "paper", title: "游戏 第 20 篇考试 · 3D Game Development with LWJGL 3", pass: 60, questions: [], explain: [] },
            { cid: "game-c21", kind: "paper", title: "游戏 第 21 篇考试 · 2D breakout game using Phaser", pass: 60, questions: [], explain: [] },
            { cid: "game-c22", kind: "paper", title: "游戏 第 22 篇考试 · How to Make Flappy Bird in HTML5 With Phaser", pass: 60, questions: [], explain: [] },
            { cid: "game-c23", kind: "paper", title: "游戏 第 23 篇考试 · Developing Games with React, Redux, and SVG", pass: 60, questions: [], explain: [] },
            { cid: "game-c24", kind: "paper", title: "游戏 第 24 篇考试 · Build your own 8-Ball Pool game from scratch", pass: 60, questions: [], explain: [] },
            { cid: "game-c25", kind: "paper", title: "游戏 第 25 篇考试 · How to Make Your First Roguelike", pass: 60, questions: [], explain: [] },
            { cid: "game-c26", kind: "paper", title: "游戏 第 26 篇考试 · Think like a programmer: How to build Snake using only JavaScript, HTML & CSS", pass: 60, questions: [], explain: [] },
            { cid: "game-c27", kind: "paper", title: "游戏 第 27 篇考试 · BYTEPATH", pass: 60, questions: [], explain: [] },
            { cid: "game-c28", kind: "paper", title: "游戏 第 28 篇考试 · Developing Games With PyGame", pass: 60, questions: [], explain: [] },
            { cid: "game-c29", kind: "paper", title: "游戏 第 29 篇考试 · Making Games with Python & Pygame", pass: 60, questions: [], explain: [] },
            { cid: "game-c30", kind: "paper", title: "游戏 第 30 篇考试 · Roguelike Tutorial Revised", pass: 60, questions: [], explain: [] },
            { cid: "game-c31", kind: "paper", title: "游戏 第 31 篇考试 · Developing Games With Ruby", pass: 60, questions: [], explain: [] },
            { cid: "game-c32", kind: "paper", title: "游戏 第 32 篇考试 · Ruby Snake", pass: 60, questions: [], explain: [] },
            { cid: "game-c33", kind: "paper", title: "游戏 第 33 篇考试 · Adventures in Rust: A Basic 2D Game", pass: 60, questions: [], explain: [] },
            { cid: "game-c34", kind: "paper", title: "游戏 第 34 篇考试 · Roguelike Tutorial in Rust + tcod", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "chain",
          title: "从零写一条区块链（build-your-own-x 21 篇全做）",
          intro: "这一类要你自己造一条链：哈希函数与非对称签名打底，把交易打包成区块、用前向哈希串成链，再加工作量证明、P2P 广播和钱包，亲手验一遍“为什么改不了历史记录”。清单来自 build-your-own-x。",
          cat: "计算机基础",
          diff: "掌握",
          tags: ["JavaScript", "Python", "Go", "区块链", "密码学", "共识", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-chain.svg",
          chapters: [
            { id: "chain-c01", title: "区块链 · Functional Blockchain", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c01），原文语言 ATS，原文链接 https://beta.observablehq.com/@galletti94/functional-blockchain" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c01），原文语言 ATS，原文链接 https://beta.observablehq.com/@galletti94/functional-blockchain。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "chain-c02", title: "区块链 · Write your own blockchain and PoW algorithm using Crystal", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 2 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c02），原文语言 Crystal，原文链接 https://medium.com/@bradford_hamilton/write-your-own-blockchain-and-pow-algorithm-using-crystal-d53d5d9d0c52" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 2 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c02），原文语言 Crystal，原文链接 https://medium.com/@bradford_hamilton/write-your-own-blockchain-and-pow-algorithm-using-crystal-d53d5d9d0c52。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "chain-c03", title: "区块链 · Building Blockchain in Go", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 3 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c03），原文语言 Go，原文链接 https://jeiwan.net/posts/building-blockchain-in-go-part-1/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 3 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c03），原文语言 Go，原文链接 https://jeiwan.net/posts/building-blockchain-in-go-part-1/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "chain-c04", title: "区块链 · Code your own blockchain in less than 200 lines of Go", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 4 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c04），原文语言 Go，原文链接 https://medium.com/@mycoralhealth/code-your-own-blockchain-in-less-than-200-lines-of-go-e296282bcffc" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 4 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c04），原文语言 Go，原文链接 https://medium.com/@mycoralhealth/code-your-own-blockchain-in-less-than-200-lines-of-go-e296282bcffc。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "chain-c05", title: "区块链 · Creating Your First Blockchain with Java", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 5 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c05），原文语言 Java，原文链接 https://medium.com/programmers-blockchain/create-simple-blockchain-java-tutorial-from-scratch-6eeed3cb03fa" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 5 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c05），原文语言 Java，原文链接 https://medium.com/programmers-blockchain/create-simple-blockchain-java-tutorial-from-scratch-6eeed3cb03fa。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "chain-c06", title: "区块链 · A cryptocurrency implementation in less than 1500 lines of code", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 6 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c06），原文语言 JavaScript，原文链接 https://github.com/conradoqg/naivecoin" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 6 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c06），原文语言 JavaScript，原文链接 https://github.com/conradoqg/naivecoin。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "chain-c07", title: "区块链 · Build your own Blockchain in JavaScript", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 7 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c07），原文语言 JavaScript，原文链接 https://github.com/nambrot/blockchain-in-js" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 7 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c07），原文语言 JavaScript，原文链接 https://github.com/nambrot/blockchain-in-js。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "chain-c08", title: "区块链 · Learn & Build a JavaScript Blockchain", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 8 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c08），原文语言 JavaScript，原文链接 https://medium.com/digital-alchemy-holdings/learn-build-a-javascript-blockchain-part-1-ca61c285821e" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 8 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c08），原文语言 JavaScript，原文链接 https://medium.com/digital-alchemy-holdings/learn-build-a-javascript-blockchain-part-1-ca61c285821e。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "chain-c09", title: "区块链 · Creating a blockchain with JavaScript", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 9 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c09），原文语言 JavaScript，原文链接 https://github.com/SavjeeTutorials/SavjeeCoin" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 9 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c09），原文语言 JavaScript，原文链接 https://github.com/SavjeeTutorials/SavjeeCoin。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "chain-c10", title: "区块链 · How To Launch Your Own Production-Ready Cryptocurrency", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 10 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c10），原文语言 JavaScript，原文链接 https://hackernoon.com/how-to-launch-your-own-production-ready-cryptocurrency-ab97cb773371" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 10 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c10），原文语言 JavaScript，原文链接 https://hackernoon.com/how-to-launch-your-own-production-ready-cryptocurrency-ab97cb773371。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "chain-c11", title: "区块链 · Writing a Blockchain in Node.js", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 11 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c11），原文语言 JavaScript，原文链接 https://www.smashingmagazine.com/2020/02/cryptocurrency-blockchain-node-js/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 11 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c11），原文语言 JavaScript，原文链接 https://www.smashingmagazine.com/2020/02/cryptocurrency-blockchain-node-js/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "chain-c12", title: "区块链 · Let’s implement a cryptocurrency in Kotlin", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 12 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c12），原文语言 Kotlin，原文链接 https://medium.com/@vasilyf/lets-implement-a-cryptocurrency-in-kotlin-part-1-blockchain-8704069f8580" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 12 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c12），原文语言 Kotlin，原文链接 https://medium.com/@vasilyf/lets-implement-a-cryptocurrency-in-kotlin-part-1-blockchain-8704069f8580。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "chain-c13", title: "区块链 · Learn Blockchains by Building One", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 13 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c13），原文语言 Python，原文链接 https://hackernoon.com/learn-blockchains-by-building-one-117428612f46" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 13 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c13），原文语言 Python，原文链接 https://hackernoon.com/learn-blockchains-by-building-one-117428612f46。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "chain-c14", title: "区块链 · Build your own blockchain: a Python tutorial", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 14 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c14），原文语言 Python，原文链接 http://ecomunsing.com/build-your-own-blockchain" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 14 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c14），原文语言 Python，原文链接 http://ecomunsing.com/build-your-own-blockchain。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "chain-c15", title: "区块链 · A Practical Introduction to Blockchain with Python", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 15 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c15），原文语言 Python，原文链接 http://adilmoujahid.com/posts/2018/03/intro-blockchain-bitcoin-python/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 15 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c15），原文语言 Python，原文链接 http://adilmoujahid.com/posts/2018/03/intro-blockchain-bitcoin-python/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "chain-c16", title: "区块链 · Let’s Build the Tiniest Blockchain", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 16 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c16），原文语言 Python，原文链接 https://medium.com/crypto-currently/lets-build-the-tiniest-blockchain-e70965a248b" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 16 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c16），原文语言 Python，原文链接 https://medium.com/crypto-currently/lets-build-the-tiniest-blockchain-e70965a248b。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "chain-c17", title: "区块链 · Programming Blockchains Step-by-Step (Manuscripts Book Edition)", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 17 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c17），原文语言 Ruby，原文链接 https://github.com/yukimotopress/programming-blockchains-step-by-step" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 17 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c17），原文语言 Ruby，原文链接 https://github.com/yukimotopress/programming-blockchains-step-by-step。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "chain-c18", title: "区块链 · How to build a simple actor-based blockchain", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 18 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c18），原文语言 Scala，原文链接 https://medium.freecodecamp.org/how-to-build-a-simple-actor-based-blockchain-aac1e996c177" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 18 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c18），原文语言 Scala，原文链接 https://medium.freecodecamp.org/how-to-build-a-simple-actor-based-blockchain-aac1e996c177。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "chain-c19", title: "区块链 · Naivecoin: a tutorial for building a cryptocurrency", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 19 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c19），原文语言 TypeScript，原文链接 https://lhartikk.github.io/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 19 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c19），原文语言 TypeScript，原文链接 https://lhartikk.github.io/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "chain-c20", title: "区块链 · NaivecoinStake: a tutorial for building a cryptocurrency with the Proof of Stake consensus", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 20 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c20），原文语言 TypeScript，原文链接 https://naivecoinstake.learn.uno/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 20 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c20），原文语言 TypeScript，原文链接 https://naivecoinstake.learn.uno/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "chain-c21", title: "区块链 · Building A Blockchain in Rust & Substrate", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 21 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c21），原文语言 Rust，原文链接 https://hackernoon.com/building-a-blockchain-in-rust-and-substrate-a-step-by-step-guide-for-developers-kc223ybp" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 21 篇（类目「Blockchain / Cryptocurrency」，站内章节 id chain-c21），原文语言 Rust，原文链接 https://hackernoon.com/building-a-blockchain-in-rust-and-substrate-a-step-by-step-guide-for-developers-kc223ybp。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "Blockchain / Cryptocurrency", papers: [
            { cid: "chain-c01", kind: "paper", title: "区块链 第 1 篇考试 · Functional Blockchain", pass: 60, questions: [], explain: [] },
            { cid: "chain-c02", kind: "paper", title: "区块链 第 2 篇考试 · Write your own blockchain and PoW algorithm using Crystal", pass: 60, questions: [], explain: [] },
            { cid: "chain-c03", kind: "paper", title: "区块链 第 3 篇考试 · Building Blockchain in Go", pass: 60, questions: [], explain: [] },
            { cid: "chain-c04", kind: "paper", title: "区块链 第 4 篇考试 · Code your own blockchain in less than 200 lines of Go", pass: 60, questions: [], explain: [] },
            { cid: "chain-c05", kind: "paper", title: "区块链 第 5 篇考试 · Creating Your First Blockchain with Java", pass: 60, questions: [], explain: [] },
            { cid: "chain-c06", kind: "paper", title: "区块链 第 6 篇考试 · A cryptocurrency implementation in less than 1500 lines of code", pass: 60, questions: [], explain: [] },
            { cid: "chain-c07", kind: "paper", title: "区块链 第 7 篇考试 · Build your own Blockchain in JavaScript", pass: 60, questions: [], explain: [] },
            { cid: "chain-c08", kind: "paper", title: "区块链 第 8 篇考试 · Learn & Build a JavaScript Blockchain", pass: 60, questions: [], explain: [] },
            { cid: "chain-c09", kind: "paper", title: "区块链 第 9 篇考试 · Creating a blockchain with JavaScript", pass: 60, questions: [], explain: [] },
            { cid: "chain-c10", kind: "paper", title: "区块链 第 10 篇考试 · How To Launch Your Own Production-Ready Cryptocurrency", pass: 60, questions: [], explain: [] },
            { cid: "chain-c11", kind: "paper", title: "区块链 第 11 篇考试 · Writing a Blockchain in Node.js", pass: 60, questions: [], explain: [] },
            { cid: "chain-c12", kind: "paper", title: "区块链 第 12 篇考试 · Let’s implement a cryptocurrency in Kotlin", pass: 60, questions: [], explain: [] },
            { cid: "chain-c13", kind: "paper", title: "区块链 第 13 篇考试 · Learn Blockchains by Building One", pass: 60, questions: [], explain: [] },
            { cid: "chain-c14", kind: "paper", title: "区块链 第 14 篇考试 · Build your own blockchain: a Python tutorial", pass: 60, questions: [], explain: [] },
            { cid: "chain-c15", kind: "paper", title: "区块链 第 15 篇考试 · A Practical Introduction to Blockchain with Python", pass: 60, questions: [], explain: [] },
            { cid: "chain-c16", kind: "paper", title: "区块链 第 16 篇考试 · Let’s Build the Tiniest Blockchain", pass: 60, questions: [], explain: [] },
            { cid: "chain-c17", kind: "paper", title: "区块链 第 17 篇考试 · Programming Blockchains Step-by-Step (Manuscripts Book Edition)", pass: 60, questions: [], explain: [] },
            { cid: "chain-c18", kind: "paper", title: "区块链 第 18 篇考试 · How to build a simple actor-based blockchain", pass: 60, questions: [], explain: [] },
            { cid: "chain-c19", kind: "paper", title: "区块链 第 19 篇考试 · Naivecoin: a tutorial for building a cryptocurrency", pass: 60, questions: [], explain: [] },
            { cid: "chain-c20", kind: "paper", title: "区块链 第 20 篇考试 · NaivecoinStake: a tutorial for building a cryptocurrency with the Proof of Stake consensus", pass: 60, questions: [], explain: [] },
            { cid: "chain-c21", kind: "paper", title: "区块链 第 21 篇考试 · Building A Blockchain in Rust & Substrate", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "os",
          title: "从零写一个操作系统（build-your-own-x 19 篇全做）",
          intro: "这一类要你自己造一个能开机跑起来的内核：从引导扇区和启动入口写起，先在屏幕上打出字符，再搭中断描述表、键盘驱动、内存管理、进程调度，直到执行第一个用户态程序。清单来自 build-your-own-x。",
          cat: "计算机基础",
          diff: "精通",
          tags: ["C", "Assembly", "C++", "内核", "中断", "进程调度", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-os.svg",
          chapters: [
            { id: "os-c01", title: "操作系统 · Writing a Tiny x86 Bootloader", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「Operating System」，站内章节 id os-c01），原文语言 Assembly，原文链接 http://joebergeron.io/posts/post_two.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「Operating System」，站内章节 id os-c01），原文语言 Assembly，原文链接 http://joebergeron.io/posts/post_two.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "os-c02", title: "操作系统 · Baking Pi – Operating Systems Development", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 2 篇（类目「Operating System」，站内章节 id os-c02），原文语言 Assembly，原文链接 http://www.cl.cam.ac.uk/projects/raspberrypi/tutorials/os/index.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 2 篇（类目「Operating System」，站内章节 id os-c02），原文语言 Assembly，原文链接 http://www.cl.cam.ac.uk/projects/raspberrypi/tutorials/os/index.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "os-c03", title: "操作系统 · Building a software and hardware stack for a simple computer from scratch", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 3 篇（类目「Operating System」，站内章节 id os-c03），原文语言 C，原文链接 https://www.youtube.com/watch?v=ZjwvMcP3Nf0&list=PLU94OURih-CiP4WxKSMt3UcwMSDM3aTtX（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 3 篇（类目「Operating System」，站内章节 id os-c03），原文语言 C，原文链接 https://www.youtube.com/watch?v=ZjwvMcP3Nf0&list=PLU94OURih-CiP4WxKSMt3UcwMSDM3aTtX（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "os-c04", title: "操作系统 · Operating Systems: From 0 to 1", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 4 篇（类目「Operating System」，站内章节 id os-c04），原文语言 C，原文链接 https://tuhdo.github.io/os01/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 4 篇（类目「Operating System」，站内章节 id os-c04），原文语言 C，原文链接 https://tuhdo.github.io/os01/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "os-c05", title: "操作系统 · The little book about OS development", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 5 篇（类目「Operating System」，站内章节 id os-c05），原文语言 C，原文链接 https://littleosbook.github.io/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 5 篇（类目「Operating System」，站内章节 id os-c05），原文语言 C，原文链接 https://littleosbook.github.io/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "os-c06", title: "操作系统 · Roll your own toy UNIX-clone OS", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 6 篇（类目「Operating System」，站内章节 id os-c06），原文语言 C，原文链接 http://jamesmolloy.co.uk/tutorial_html/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 6 篇（类目「Operating System」，站内章节 id os-c06），原文语言 C，原文链接 http://jamesmolloy.co.uk/tutorial_html/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "os-c07", title: "操作系统 · Kernel 101 – Let’s write a Kernel", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 7 篇（类目「Operating System」，站内章节 id os-c07），原文语言 C，原文链接 https://arjunsreedharan.org/post/82710718100/kernel-101-lets-write-a-kernel" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 7 篇（类目「Operating System」，站内章节 id os-c07），原文语言 C，原文链接 https://arjunsreedharan.org/post/82710718100/kernel-101-lets-write-a-kernel。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "os-c08", title: "操作系统 · Kernel 201 – Let’s write a Kernel with keyboard and screen support", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 8 篇（类目「Operating System」，站内章节 id os-c08），原文语言 C，原文链接 https://arjunsreedharan.org/post/99370248137/kernel-201-lets-write-a-kernel-with-keyboard" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 8 篇（类目「Operating System」，站内章节 id os-c08），原文语言 C，原文链接 https://arjunsreedharan.org/post/99370248137/kernel-201-lets-write-a-kernel-with-keyboard。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "os-c09", title: "操作系统 · Build a minimal multi-tasking kernel for ARM from scratch", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 9 篇（类目「Operating System」，站内章节 id os-c09），原文语言 C，原文链接 https://github.com/jserv/mini-arm-os" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 9 篇（类目「Operating System」，站内章节 id os-c09），原文语言 C，原文链接 https://github.com/jserv/mini-arm-os。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "os-c10", title: "操作系统 · How to create an OS from scratch", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 10 篇（类目「Operating System」，站内章节 id os-c10），原文语言 C，原文链接 https://github.com/cfenollosa/os-tutorial" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 10 篇（类目「Operating System」，站内章节 id os-c10），原文语言 C，原文链接 https://github.com/cfenollosa/os-tutorial。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "os-c11", title: "操作系统 · Malloc tutorial", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 11 篇（类目「Operating System」，站内章节 id os-c11），原文语言 C，原文链接 https://danluu.com/malloc-tutorial/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 11 篇（类目「Operating System」，站内章节 id os-c11），原文语言 C，原文链接 https://danluu.com/malloc-tutorial/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "os-c12", title: "操作系统 · Hack the virtual memory", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 12 篇（类目「Operating System」，站内章节 id os-c12），原文语言 C，原文链接 https://blog.holbertonschool.com/hack-the-virtual-memory-c-strings-proc/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 12 篇（类目「Operating System」，站内章节 id os-c12），原文语言 C，原文链接 https://blog.holbertonschool.com/hack-the-virtual-memory-c-strings-proc/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "os-c13", title: "操作系统 · Learning operating system development using Linux kernel and Raspberry Pi", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 13 篇（类目「Operating System」，站内章节 id os-c13），原文语言 C，原文链接 https://github.com/s-matyukevich/raspberry-pi-os" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 13 篇（类目「Operating System」，站内章节 id os-c13），原文语言 C，原文链接 https://github.com/s-matyukevich/raspberry-pi-os。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "os-c14", title: "操作系统 · Operating systems development for Dummies", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 14 篇（类目「Operating System」，站内章节 id os-c14），原文语言 C，原文链接 https://medium.com/@lduck11007/operating-systems-development-for-dummies-3d4d786e8ac" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 14 篇（类目「Operating System」，站内章节 id os-c14），原文语言 C，原文链接 https://medium.com/@lduck11007/operating-systems-development-for-dummies-3d4d786e8ac。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "os-c15", title: "操作系统 · Write your own Operating System", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 15 篇（类目「Operating System」，站内章节 id os-c15），原文语言 C++，原文链接 https://www.youtube.com/playlist?list=PLHh55M_Kq4OApWScZyPl5HhgsTJS9MZ6M（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 15 篇（类目「Operating System」，站内章节 id os-c15），原文语言 C++，原文链接 https://www.youtube.com/playlist?list=PLHh55M_Kq4OApWScZyPl5HhgsTJS9MZ6M（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "os-c16", title: "操作系统 · Writing a Bootloader", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 16 篇（类目「Operating System」，站内章节 id os-c16），原文语言 C++，原文链接 http://3zanders.co.uk/2017/10/13/writing-a-bootloader/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 16 篇（类目「Operating System」，站内章节 id os-c16），原文语言 C++，原文链接 http://3zanders.co.uk/2017/10/13/writing-a-bootloader/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "os-c17", title: "操作系统 · Writing an OS in Rust", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 17 篇（类目「Operating System」，站内章节 id os-c17），原文语言 Rust，原文链接 https://os.phil-opp.com/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 17 篇（类目「Operating System」，站内章节 id os-c17），原文语言 Rust，原文链接 https://os.phil-opp.com/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "os-c18", title: "操作系统 · Add RISC-V Rust Operating System Tutorial", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 18 篇（类目「Operating System」，站内章节 id os-c18），原文语言 Rust，原文链接 https://osblog.stephenmarz.com/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 18 篇（类目「Operating System」，站内章节 id os-c18），原文语言 Rust，原文链接 https://osblog.stephenmarz.com/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "os-c19", title: "操作系统 · Linux from scratch", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 19 篇（类目「Operating System」，站内章节 id os-c19），原文语言 (any)，原文链接 https://linuxfromscratch.org/lfs" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 19 篇（类目「Operating System」，站内章节 id os-c19），原文语言 (any)，原文链接 https://linuxfromscratch.org/lfs。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "Operating System", papers: [
            { cid: "os-c01", kind: "paper", title: "操作系统 第 1 篇考试 · Writing a Tiny x86 Bootloader", pass: 60, questions: [], explain: [] },
            { cid: "os-c02", kind: "paper", title: "操作系统 第 2 篇考试 · Baking Pi – Operating Systems Development", pass: 60, questions: [], explain: [] },
            { cid: "os-c03", kind: "paper", title: "操作系统 第 3 篇考试 · Building a software and hardware stack for a simple computer from scratch", pass: 60, questions: [], explain: [] },
            { cid: "os-c04", kind: "paper", title: "操作系统 第 4 篇考试 · Operating Systems: From 0 to 1", pass: 60, questions: [], explain: [] },
            { cid: "os-c05", kind: "paper", title: "操作系统 第 5 篇考试 · The little book about OS development", pass: 60, questions: [], explain: [] },
            { cid: "os-c06", kind: "paper", title: "操作系统 第 6 篇考试 · Roll your own toy UNIX-clone OS", pass: 60, questions: [], explain: [] },
            { cid: "os-c07", kind: "paper", title: "操作系统 第 7 篇考试 · Kernel 101 – Let’s write a Kernel", pass: 60, questions: [], explain: [] },
            { cid: "os-c08", kind: "paper", title: "操作系统 第 8 篇考试 · Kernel 201 – Let’s write a Kernel with keyboard and screen support", pass: 60, questions: [], explain: [] },
            { cid: "os-c09", kind: "paper", title: "操作系统 第 9 篇考试 · Build a minimal multi-tasking kernel for ARM from scratch", pass: 60, questions: [], explain: [] },
            { cid: "os-c10", kind: "paper", title: "操作系统 第 10 篇考试 · How to create an OS from scratch", pass: 60, questions: [], explain: [] },
            { cid: "os-c11", kind: "paper", title: "操作系统 第 11 篇考试 · Malloc tutorial", pass: 60, questions: [], explain: [] },
            { cid: "os-c12", kind: "paper", title: "操作系统 第 12 篇考试 · Hack the virtual memory", pass: 60, questions: [], explain: [] },
            { cid: "os-c13", kind: "paper", title: "操作系统 第 13 篇考试 · Learning operating system development using Linux kernel and Raspberry Pi", pass: 60, questions: [], explain: [] },
            { cid: "os-c14", kind: "paper", title: "操作系统 第 14 篇考试 · Operating systems development for Dummies", pass: 60, questions: [], explain: [] },
            { cid: "os-c15", kind: "paper", title: "操作系统 第 15 篇考试 · Write your own Operating System", pass: 60, questions: [], explain: [] },
            { cid: "os-c16", kind: "paper", title: "操作系统 第 16 篇考试 · Writing a Bootloader", pass: 60, questions: [], explain: [] },
            { cid: "os-c17", kind: "paper", title: "操作系统 第 17 篇考试 · Writing an OS in Rust", pass: 60, questions: [], explain: [] },
            { cid: "os-c18", kind: "paper", title: "操作系统 第 18 篇考试 · Add RISC-V Rust Operating System Tutorial", pass: 60, questions: [], explain: [] },
            { cid: "os-c19", kind: "paper", title: "操作系统 第 19 篇考试 · Linux from scratch", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "nn",
          title: "从零搭一个神经网络（build-your-own-x 17 篇全做）",
          intro: "这一类要你自己造神经网络：不靠框架，手写矩阵乘法、激活函数、前向传播和反向传播的梯度推导，把 MNIST 手写数字练到认得出来，再往上叠卷积、优化器与训练循环。清单来自 build-your-own-x。",
          cat: "大模型",
          diff: "精通",
          tags: ["Python", "Go", "F#", "深度学习", "反向传播", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-nn.svg",
          chapters: [
            { id: "nn-c01", title: "神经网络 · Neural Network OCR", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「Neural Network」，站内章节 id nn-c01），原文语言 C#，原文链接 https://www.codeproject.com/Articles/11285/Neural-Network-OCR" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「Neural Network」，站内章节 id nn-c01），原文语言 C#，原文链接 https://www.codeproject.com/Articles/11285/Neural-Network-OCR。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "nn-c02", title: "神经网络 · Building Neural Networks in F#: Part 1", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 2 篇（类目「Neural Network」，站内章节 id nn-c02），原文语言 F#，原文链接 https://medium.com/data-science/building-neural-networks-in-f-part-1-a2832ae972e6" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 2 篇（类目「Neural Network」，站内章节 id nn-c02），原文语言 F#，原文链接 https://medium.com/data-science/building-neural-networks-in-f-part-1-a2832ae972e6。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "nn-c03", title: "神经网络 · Building Neural Networks in F#: Part 2", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 3 篇（类目「Neural Network」，站内章节 id nn-c03），原文语言 F#，原文链接 https://medium.com/data-science/building-neural-networks-in-f-part-2-training-evaluation-5e3a68889da6" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 3 篇（类目「Neural Network」，站内章节 id nn-c03），原文语言 F#，原文链接 https://medium.com/data-science/building-neural-networks-in-f-part-2-training-evaluation-5e3a68889da6。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "nn-c04", title: "神经网络 · Build a multilayer perceptron with Golang", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 4 篇（类目「Neural Network」，站内章节 id nn-c04），原文语言 Go，原文链接 https://made2591.github.io/posts/neuralnetwork" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 4 篇（类目「Neural Network」，站内章节 id nn-c04），原文语言 Go，原文链接 https://made2591.github.io/posts/neuralnetwork。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "nn-c05", title: "神经网络 · How to build a simple artificial neural network with Go", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 5 篇（类目「Neural Network」，站内章节 id nn-c05），原文语言 Go，原文链接 https://sausheong.github.io/posts/how-to-build-a-simple-artificial-neural-network-with-go/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 5 篇（类目「Neural Network」，站内章节 id nn-c05），原文语言 Go，原文链接 https://sausheong.github.io/posts/how-to-build-a-simple-artificial-neural-network-with-go/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "nn-c06", title: "神经网络 · Building a Neural Net from Scratch in Go", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 6 篇（类目「Neural Network」，站内章节 id nn-c06），原文语言 Go，原文链接 https://datadan.io/blog/neural-net-with-go" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 6 篇（类目「Neural Network」，站内章节 id nn-c06），原文语言 Go，原文链接 https://datadan.io/blog/neural-net-with-go。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "nn-c07", title: "神经网络 · Neural Networks - The Nature of Code", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 7 篇（类目「Neural Network」，站内章节 id nn-c07），原文语言 JavaScript / Java，原文链接 https://www.youtube.com/playlist?list=PLRqwX-V7Uu6aCibgK1PTWWu9by6XFdCfh（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 7 篇（类目「Neural Network」，站内章节 id nn-c07），原文语言 JavaScript / Java，原文链接 https://www.youtube.com/playlist?list=PLRqwX-V7Uu6aCibgK1PTWWu9by6XFdCfh（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "nn-c08", title: "神经网络 · Neural networks from scratch for JavaScript linguists (Part1 — The Perceptron)", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 8 篇（类目「Neural Network」，站内章节 id nn-c08），原文语言 JavaScript，原文链接 https://hackernoon.com/neural-networks-from-scratch-for-javascript-linguists-part1-the-perceptron-632a4d1fbad2" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 8 篇（类目「Neural Network」，站内章节 id nn-c08），原文语言 JavaScript，原文链接 https://hackernoon.com/neural-networks-from-scratch-for-javascript-linguists-part1-the-perceptron-632a4d1fbad2。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "nn-c09", title: "神经网络 · A Neural Network in 11 lines of Python", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 9 篇（类目「Neural Network」，站内章节 id nn-c09），原文语言 Python，原文链接 https://iamtrask.github.io/2015/07/12/basic-python-network/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 9 篇（类目「Neural Network」，站内章节 id nn-c09），原文语言 Python，原文链接 https://iamtrask.github.io/2015/07/12/basic-python-network/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "nn-c10", title: "神经网络 · Build Deep Learning From Scratch (reimplement PyTorch internals across 34 stages)", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 10 篇（类目「Neural Network」，站内章节 id nn-c10），原文语言 Python，原文链接 https://github.com/roiamiel1/Build-Deep-Learning-From-Scratch" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 10 篇（类目「Neural Network」，站内章节 id nn-c10），原文语言 Python，原文链接 https://github.com/roiamiel1/Build-Deep-Learning-From-Scratch。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "nn-c11", title: "神经网络 · Implement a Neural Network from Scratch", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 11 篇（类目「Neural Network」，站内章节 id nn-c11），原文语言 Python，原文链接 https://victorzhou.com/blog/intro-to-neural-networks/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 11 篇（类目「Neural Network」，站内章节 id nn-c11），原文语言 Python，原文链接 https://victorzhou.com/blog/intro-to-neural-networks/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "nn-c12", title: "神经网络 · Optical Character Recognition (OCR)", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 12 篇（类目「Neural Network」，站内章节 id nn-c12），原文语言 Python，原文链接 http://aosabook.org/en/500L/optical-character-recognition-ocr.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 12 篇（类目「Neural Network」，站内章节 id nn-c12），原文语言 Python，原文链接 http://aosabook.org/en/500L/optical-character-recognition-ocr.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "nn-c13", title: "神经网络 · Traffic signs classification with a convolutional network", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 13 篇（类目「Neural Network」，站内章节 id nn-c13），原文语言 Python，原文链接 https://navoshta.com/traffic-signs-classification/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 13 篇（类目「Neural Network」，站内章节 id nn-c13），原文语言 Python，原文链接 https://navoshta.com/traffic-signs-classification/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "nn-c14", title: "神经网络 · Generate Music using LSTM Neural Network in Keras", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 14 篇（类目「Neural Network」，站内章节 id nn-c14），原文语言 Python，原文链接 https://towardsdatascience.com/how-to-generate-music-using-a-lstm-neural-network-in-keras-68786834d4c5" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 14 篇（类目「Neural Network」，站内章节 id nn-c14），原文语言 Python，原文链接 https://towardsdatascience.com/how-to-generate-music-using-a-lstm-neural-network-in-keras-68786834d4c5。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "nn-c15", title: "神经网络 · An Introduction to Convolutional Neural Networks", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 15 篇（类目「Neural Network」，站内章节 id nn-c15），原文语言 Python，原文链接 https://victorzhou.com/blog/intro-to-cnns-part-1/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 15 篇（类目「Neural Network」，站内章节 id nn-c15），原文语言 Python，原文链接 https://victorzhou.com/blog/intro-to-cnns-part-1/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "nn-c16", title: "神经网络 · Neural Networks: Zero to Hero", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 16 篇（类目「Neural Network」，站内章节 id nn-c16），原文语言 Python，原文链接 https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 16 篇（类目「Neural Network」，站内章节 id nn-c16），原文语言 Python，原文链接 https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "nn-c17", title: "神经网络 · SlowTorch: Implementation of PyTorch from the ground up in 100% pure Python", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 17 篇（类目「Neural Network」，站内章节 id nn-c17），原文语言 Python，原文链接 https://github.com/xames3/slowtorch" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 17 篇（类目「Neural Network」，站内章节 id nn-c17），原文语言 Python，原文链接 https://github.com/xames3/slowtorch。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "Neural Network", papers: [
            { cid: "nn-c01", kind: "paper", title: "神经网络 第 1 篇考试 · Neural Network OCR", pass: 60, questions: [], explain: [] },
            { cid: "nn-c02", kind: "paper", title: "神经网络 第 2 篇考试 · Building Neural Networks in F#: Part 1", pass: 60, questions: [], explain: [] },
            { cid: "nn-c03", kind: "paper", title: "神经网络 第 3 篇考试 · Building Neural Networks in F#: Part 2", pass: 60, questions: [], explain: [] },
            { cid: "nn-c04", kind: "paper", title: "神经网络 第 4 篇考试 · Build a multilayer perceptron with Golang", pass: 60, questions: [], explain: [] },
            { cid: "nn-c05", kind: "paper", title: "神经网络 第 5 篇考试 · How to build a simple artificial neural network with Go", pass: 60, questions: [], explain: [] },
            { cid: "nn-c06", kind: "paper", title: "神经网络 第 6 篇考试 · Building a Neural Net from Scratch in Go", pass: 60, questions: [], explain: [] },
            { cid: "nn-c07", kind: "paper", title: "神经网络 第 7 篇考试 · Neural Networks - The Nature of Code", pass: 60, questions: [], explain: [] },
            { cid: "nn-c08", kind: "paper", title: "神经网络 第 8 篇考试 · Neural networks from scratch for JavaScript linguists (Part1 — The Perceptron)", pass: 60, questions: [], explain: [] },
            { cid: "nn-c09", kind: "paper", title: "神经网络 第 9 篇考试 · A Neural Network in 11 lines of Python", pass: 60, questions: [], explain: [] },
            { cid: "nn-c10", kind: "paper", title: "神经网络 第 10 篇考试 · Build Deep Learning From Scratch (reimplement PyTorch internals across 34 stages)", pass: 60, questions: [], explain: [] },
            { cid: "nn-c11", kind: "paper", title: "神经网络 第 11 篇考试 · Implement a Neural Network from Scratch", pass: 60, questions: [], explain: [] },
            { cid: "nn-c12", kind: "paper", title: "神经网络 第 12 篇考试 · Optical Character Recognition (OCR)", pass: 60, questions: [], explain: [] },
            { cid: "nn-c13", kind: "paper", title: "神经网络 第 13 篇考试 · Traffic signs classification with a convolutional network", pass: 60, questions: [], explain: [] },
            { cid: "nn-c14", kind: "paper", title: "神经网络 第 14 篇考试 · Generate Music using LSTM Neural Network in Keras", pass: 60, questions: [], explain: [] },
            { cid: "nn-c15", kind: "paper", title: "神经网络 第 15 篇考试 · An Introduction to Convolutional Neural Networks", pass: 60, questions: [], explain: [] },
            { cid: "nn-c16", kind: "paper", title: "神经网络 第 16 篇考试 · Neural Networks: Zero to Hero", pass: 60, questions: [], explain: [] },
            { cid: "nn-c17", kind: "paper", title: "神经网络 第 17 篇考试 · SlowTorch: Implementation of PyTorch from the ground up in 100% pure Python", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "bot",
          title: "从零做一个 Bot（build-your-own-x 15 篇全做）",
          intro: "这一类要你自己造一个会自动回话的机器人：接平台 Webhook、验签名、解析消息、按命令路由，再补定时抓取、轮询和第三方服务。做完就把“对接接口”这件事摸透了。清单来自 build-your-own-x。",
          cat: "Agent",
          diff: "入门",
          tags: ["Python", "Node.js", "Haskell", "Webhook", "API", "自动化", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-bot.svg",
          chapters: [
            { id: "bot-c01", title: "Bot 机器人 · Roll your own IRC bot", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「Bot」，站内章节 id bot-c01），原文语言 Haskell，原文链接 https://wiki.haskell.org/Roll_your_own_IRC_bot" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「Bot」，站内章节 id bot-c01），原文语言 Haskell，原文链接 https://wiki.haskell.org/Roll_your_own_IRC_bot。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "bot-c02", title: "Bot 机器人 · Creating a Simple Facebook Messenger AI Bot with API.ai in Node.js", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 2 篇（类目「Bot」，站内章节 id bot-c02），原文语言 Node.js，原文链接 https://tutorials.botsfloor.com/creating-a-simple-facebook-messenger-ai-bot-with-api-ai-in-node-js-50ae2fa5c80d" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 2 篇（类目「Bot」，站内章节 id bot-c02），原文语言 Node.js，原文链接 https://tutorials.botsfloor.com/creating-a-simple-facebook-messenger-ai-bot-with-api-ai-in-node-js-50ae2fa5c80d。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "bot-c03", title: "Bot 机器人 · How to make a responsive telegram bot", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 3 篇（类目「Bot」，站内章节 id bot-c03），原文语言 Node.js，原文链接 https://www.sohamkamani.com/blog/2016/09/21/making-a-telegram-bot/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 3 篇（类目「Bot」，站内章节 id bot-c03），原文语言 Node.js，原文链接 https://www.sohamkamani.com/blog/2016/09/21/making-a-telegram-bot/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "bot-c04", title: "Bot 机器人 · Create a Discord bot", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 4 篇（类目「Bot」，站内章节 id bot-c04），原文语言 Node.js，原文链接 https://discordjs.guide/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 4 篇（类目「Bot」，站内章节 id bot-c04），原文语言 Node.js，原文链接 https://discordjs.guide/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "bot-c05", title: "Bot 机器人 · gifbot - Building a GitHub App", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 5 篇（类目「Bot」，站内章节 id bot-c05），原文语言 Node.js，原文链接 https://blog.scottlogic.com/2017/05/22/gifbot-github-integration.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 5 篇（类目「Bot」，站内章节 id bot-c05），原文语言 Node.js，原文链接 https://blog.scottlogic.com/2017/05/22/gifbot-github-integration.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "bot-c06", title: "Bot 机器人 · Building A Simple AI Chatbot With Web Speech API And Node.js", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 6 篇（类目「Bot」，站内章节 id bot-c06），原文语言 Node.js，原文链接 https://www.smashingmagazine.com/2017/08/ai-chatbot-web-speech-api-node-js/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 6 篇（类目「Bot」，站内章节 id bot-c06），原文语言 Node.js，原文链接 https://www.smashingmagazine.com/2017/08/ai-chatbot-web-speech-api-node-js/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "bot-c07", title: "Bot 机器人 · How to Build Your First Slack Bot with Python", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 7 篇（类目「Bot」，站内章节 id bot-c07），原文语言 Python，原文链接 https://www.fullstackpython.com/blog/build-first-slack-bot-python.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 7 篇（类目「Bot」，站内章节 id bot-c07），原文语言 Python，原文链接 https://www.fullstackpython.com/blog/build-first-slack-bot-python.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "bot-c08", title: "Bot 机器人 · How to build a Slack Bot with Python using Slack Events API & Django under 20 minute", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 8 篇（类目「Bot」，站内章节 id bot-c08），原文语言 Python，原文链接 https://medium.com/freehunch/how-to-build-a-slack-bot-with-python-using-slack-events-api-django-under-20-minute-code-included-269c3a9bf64e" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 8 篇（类目「Bot」，站内章节 id bot-c08），原文语言 Python，原文链接 https://medium.com/freehunch/how-to-build-a-slack-bot-with-python-using-slack-events-api-django-under-20-minute-code-included-269c3a9bf64e。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "bot-c09", title: "Bot 机器人 · Build a Reddit Bot", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 9 篇（类目「Bot」，站内章节 id bot-c09），原文语言 Python，原文链接 https://pythonforengineers.com/blog/build-a-reddit-bot-part-1/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 9 篇（类目「Bot」，站内章节 id bot-c09），原文语言 Python，原文链接 https://pythonforengineers.com/blog/build-a-reddit-bot-part-1/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "bot-c10", title: "Bot 机器人 · How To Make A Reddit Bot", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 10 篇（类目「Bot」，站内章节 id bot-c10），原文语言 Python，原文链接 https://www.youtube.com/watch?v=krTUf7BpTc0（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 10 篇（类目「Bot」，站内章节 id bot-c10），原文语言 Python，原文链接 https://www.youtube.com/watch?v=krTUf7BpTc0（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "bot-c11", title: "Bot 机器人 · How To Create a Telegram Bot Using Python", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 11 篇（类目「Bot」，站内章节 id bot-c11），原文语言 Python，原文链接 https://www.freecodecamp.org/news/how-to-create-a-telegram-bot-using-python/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 11 篇（类目「Bot」，站内章节 id bot-c11），原文语言 Python，原文链接 https://www.freecodecamp.org/news/how-to-create-a-telegram-bot-using-python/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "bot-c12", title: "Bot 机器人 · Create a Twitter Bot in Python Using Tweepy", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 12 篇（类目「Bot」，站内章节 id bot-c12），原文语言 Python，原文链接 https://medium.freecodecamp.org/creating-a-twitter-bot-in-python-with-tweepy-ac524157a607" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 12 篇（类目「Bot」，站内章节 id bot-c12），原文语言 Python，原文链接 https://medium.freecodecamp.org/creating-a-twitter-bot-in-python-with-tweepy-ac524157a607。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "bot-c13", title: "Bot 机器人 · Creating Reddit Bot with Python & PRAW", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 13 篇（类目「Bot」，站内章节 id bot-c13），原文语言 Python，原文链接 https://www.youtube.com/playlist?list=PLIFBTFgFpoJ9vmYYlfxRFV6U_XhG-4fpP（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 13 篇（类目「Bot」，站内章节 id bot-c13），原文语言 Python，原文链接 https://www.youtube.com/playlist?list=PLIFBTFgFpoJ9vmYYlfxRFV6U_XhG-4fpP（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "bot-c14", title: "Bot 机器人 · Build A Cryptocurrency Trading Bot with R", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 14 篇（类目「Bot」，站内章节 id bot-c14），原文语言 R，原文链接 https://towardsdatascience.com/build-a-cryptocurrency-trading-bot-with-r-1445c429e1b1" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 14 篇（类目「Bot」，站内章节 id bot-c14），原文语言 R，原文链接 https://towardsdatascience.com/build-a-cryptocurrency-trading-bot-with-r-1445c429e1b1。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "bot-c15", title: "Bot 机器人 · A bot for Starcraft in Rust, C or any other language", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 15 篇（类目「Bot」，站内章节 id bot-c15），原文语言 Rust，原文链接 https://habr.com/en/post/436254/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 15 篇（类目「Bot」，站内章节 id bot-c15），原文语言 Rust，原文链接 https://habr.com/en/post/436254/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "Bot", papers: [
            { cid: "bot-c01", kind: "paper", title: "Bot 机器人 第 1 篇考试 · Roll your own IRC bot", pass: 60, questions: [], explain: [] },
            { cid: "bot-c02", kind: "paper", title: "Bot 机器人 第 2 篇考试 · Creating a Simple Facebook Messenger AI Bot with API.ai in Node.js", pass: 60, questions: [], explain: [] },
            { cid: "bot-c03", kind: "paper", title: "Bot 机器人 第 3 篇考试 · How to make a responsive telegram bot", pass: 60, questions: [], explain: [] },
            { cid: "bot-c04", kind: "paper", title: "Bot 机器人 第 4 篇考试 · Create a Discord bot", pass: 60, questions: [], explain: [] },
            { cid: "bot-c05", kind: "paper", title: "Bot 机器人 第 5 篇考试 · gifbot - Building a GitHub App", pass: 60, questions: [], explain: [] },
            { cid: "bot-c06", kind: "paper", title: "Bot 机器人 第 6 篇考试 · Building A Simple AI Chatbot With Web Speech API And Node.js", pass: 60, questions: [], explain: [] },
            { cid: "bot-c07", kind: "paper", title: "Bot 机器人 第 7 篇考试 · How to Build Your First Slack Bot with Python", pass: 60, questions: [], explain: [] },
            { cid: "bot-c08", kind: "paper", title: "Bot 机器人 第 8 篇考试 · How to build a Slack Bot with Python using Slack Events API & Django under 20 minute", pass: 60, questions: [], explain: [] },
            { cid: "bot-c09", kind: "paper", title: "Bot 机器人 第 9 篇考试 · Build a Reddit Bot", pass: 60, questions: [], explain: [] },
            { cid: "bot-c10", kind: "paper", title: "Bot 机器人 第 10 篇考试 · How To Make A Reddit Bot", pass: 60, questions: [], explain: [] },
            { cid: "bot-c11", kind: "paper", title: "Bot 机器人 第 11 篇考试 · How To Create a Telegram Bot Using Python", pass: 60, questions: [], explain: [] },
            { cid: "bot-c12", kind: "paper", title: "Bot 机器人 第 12 篇考试 · Create a Twitter Bot in Python Using Tweepy", pass: 60, questions: [], explain: [] },
            { cid: "bot-c13", kind: "paper", title: "Bot 机器人 第 13 篇考试 · Creating Reddit Bot with Python & PRAW", pass: 60, questions: [], explain: [] },
            { cid: "bot-c14", kind: "paper", title: "Bot 机器人 第 14 篇考试 · Build A Cryptocurrency Trading Bot with R", pass: 60, questions: [], explain: [] },
            { cid: "bot-c15", kind: "paper", title: "Bot 机器人 第 15 篇考试 · A bot for Starcraft in Rust, C or any other language", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "fe",
          title: "从零造一个前端框架（build-your-own-x 14 篇全做）",
          intro: "这一类要你自己造框架的核：用 JS 建节点、做虚拟 DOM 与 diff、实现响应式数据和组件渲染，让状态变化以最小代价刷到屏幕上。React/Vue 那些 API 背后干的事一目了然。清单来自 build-your-own-x。",
          cat: "计算机基础",
          diff: "精通",
          tags: ["JavaScript", "虚拟 DOM", "响应式", "组件", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-fe.svg",
          chapters: [
            { id: "fe-c01", title: "前端框架 · WTF is JSX (Let's Build a JSX Renderer)", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「Front-end Framework / Library」，站内章节 id fe-c01），原文语言 JavaScript，原文链接 https://jasonformat.com/wtf-is-jsx/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「Front-end Framework / Library」，站内章节 id fe-c01），原文语言 JavaScript，原文链接 https://jasonformat.com/wtf-is-jsx/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "fe-c02", title: "前端框架 · A DIY guide to build your own React", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 2 篇（类目「Front-end Framework / Library」，站内章节 id fe-c02），原文语言 JavaScript，原文链接 https://github.com/hexacta/didact" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 2 篇（类目「Front-end Framework / Library」，站内章节 id fe-c02），原文语言 JavaScript，原文链接 https://github.com/hexacta/didact。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "fe-c03", title: "前端框架 · Building React From Scratch", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 3 篇（类目「Front-end Framework / Library」，站内章节 id fe-c03），原文语言 JavaScript，原文链接 https://www.youtube.com/watch?v=_MAD4Oly9yg（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 3 篇（类目「Front-end Framework / Library」，站内章节 id fe-c03），原文语言 JavaScript，原文链接 https://www.youtube.com/watch?v=_MAD4Oly9yg（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "fe-c04", title: "前端框架 · Gooact: React in 160 lines of JavaScript", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 4 篇（类目「Front-end Framework / Library」，站内章节 id fe-c04），原文语言 JavaScript，原文链接 https://medium.com/@sweetpalma/gooact-react-in-160-lines-of-javascript-44e0742ad60f" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 4 篇（类目「Front-end Framework / Library」，站内章节 id fe-c04），原文语言 JavaScript，原文链接 https://medium.com/@sweetpalma/gooact-react-in-160-lines-of-javascript-44e0742ad60f。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "fe-c05", title: "前端框架 · Learn how React Reconciler package works by building your own lightweight React DOM", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 5 篇（类目「Front-end Framework / Library」，站内章节 id fe-c05），原文语言 JavaScript，原文链接 https://hackernoon.com/learn-you-some-custom-react-renderers-aed7164a4199" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 5 篇（类目「Front-end Framework / Library」，站内章节 id fe-c05），原文语言 JavaScript，原文链接 https://hackernoon.com/learn-you-some-custom-react-renderers-aed7164a4199。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "fe-c06", title: "前端框架 · Build Yourself a Redux", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 6 篇（类目「Front-end Framework / Library」，站内章节 id fe-c06），原文语言 JavaScript，原文链接 https://zapier.com/engineering/how-to-build-redux/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 6 篇（类目「Front-end Framework / Library」，站内章节 id fe-c06），原文语言 JavaScript，原文链接 https://zapier.com/engineering/how-to-build-redux/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "fe-c07", title: "前端框架 · Let’s Write Redux!", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 7 篇（类目「Front-end Framework / Library」，站内章节 id fe-c07），原文语言 JavaScript，原文链接 https://www.jamasoftware.com/blog/lets-write-redux/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 7 篇（类目「Front-end Framework / Library」，站内章节 id fe-c07），原文语言 JavaScript，原文链接 https://www.jamasoftware.com/blog/lets-write-redux/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "fe-c08", title: "前端框架 · Redux: Implementing Store from Scratch", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 8 篇（类目「Front-end Framework / Library」，站内章节 id fe-c08），原文语言 JavaScript，原文链接 https://egghead.io/lessons/react-redux-implementing-store-from-scratch（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 8 篇（类目「Front-end Framework / Library」，站内章节 id fe-c08），原文语言 JavaScript，原文链接 https://egghead.io/lessons/react-redux-implementing-store-from-scratch（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "fe-c09", title: "前端框架 · Build Your own Simplified AngularJS in 200 Lines of JavaScript", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 9 篇（类目「Front-end Framework / Library」，站内章节 id fe-c09），原文语言 JavaScript，原文链接 https://blog.mgechev.com/2015/03/09/build-learn-your-own-light-lightweight-angularjs/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 9 篇（类目「Front-end Framework / Library」，站内章节 id fe-c09），原文语言 JavaScript，原文链接 https://blog.mgechev.com/2015/03/09/build-learn-your-own-light-lightweight-angularjs/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "fe-c10", title: "前端框架 · Make Your Own AngularJS", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 10 篇（类目「Front-end Framework / Library」，站内章节 id fe-c10），原文语言 JavaScript，原文链接 http://teropa.info/blog/2013/11/03/make-your-own-angular-part-1-scopes-and-digest.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 10 篇（类目「Front-end Framework / Library」，站内章节 id fe-c10），原文语言 JavaScript，原文链接 http://teropa.info/blog/2013/11/03/make-your-own-angular-part-1-scopes-and-digest.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "fe-c11", title: "前端框架 · How to write your own Virtual DOM", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 11 篇（类目「Front-end Framework / Library」，站内章节 id fe-c11），原文语言 JavaScript，原文链接 https://medium.com/@deathmood/how-to-write-your-own-virtual-dom-ee74acc13060" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 11 篇（类目「Front-end Framework / Library」，站内章节 id fe-c11），原文语言 JavaScript，原文链接 https://medium.com/@deathmood/how-to-write-your-own-virtual-dom-ee74acc13060。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "fe-c12", title: "前端框架 · Building a frontend framework, from scratch, with components (templating, state, VDOM)", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 12 篇（类目「Front-end Framework / Library」，站内章节 id fe-c12），原文语言 JavaScript，原文链接 https://mfrachet.github.io/create-frontend-framework/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 12 篇（类目「Front-end Framework / Library」，站内章节 id fe-c12），原文语言 JavaScript，原文链接 https://mfrachet.github.io/create-frontend-framework/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "fe-c13", title: "前端框架 · Build your own React", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 13 篇（类目「Front-end Framework / Library」，站内章节 id fe-c13），原文语言 JavaScript，原文链接 https://pomb.us/build-your-own-react/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 13 篇（类目「Front-end Framework / Library」，站内章节 id fe-c13），原文语言 JavaScript，原文链接 https://pomb.us/build-your-own-react/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "fe-c14", title: "前端框架 · Building a Custom React Renderer", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 14 篇（类目「Front-end Framework / Library」，站内章节 id fe-c14），原文语言 JavaScript，原文链接 https://youtu.be/CGpMlWVcHok（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 14 篇（类目「Front-end Framework / Library」，站内章节 id fe-c14），原文语言 JavaScript，原文链接 https://youtu.be/CGpMlWVcHok（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "Front-end Framework / Library", papers: [
            { cid: "fe-c01", kind: "paper", title: "前端框架 第 1 篇考试 · WTF is JSX (Let's Build a JSX Renderer)", pass: 60, questions: [], explain: [] },
            { cid: "fe-c02", kind: "paper", title: "前端框架 第 2 篇考试 · A DIY guide to build your own React", pass: 60, questions: [], explain: [] },
            { cid: "fe-c03", kind: "paper", title: "前端框架 第 3 篇考试 · Building React From Scratch", pass: 60, questions: [], explain: [] },
            { cid: "fe-c04", kind: "paper", title: "前端框架 第 4 篇考试 · Gooact: React in 160 lines of JavaScript", pass: 60, questions: [], explain: [] },
            { cid: "fe-c05", kind: "paper", title: "前端框架 第 5 篇考试 · Learn how React Reconciler package works by building your own lightweight React DOM", pass: 60, questions: [], explain: [] },
            { cid: "fe-c06", kind: "paper", title: "前端框架 第 6 篇考试 · Build Yourself a Redux", pass: 60, questions: [], explain: [] },
            { cid: "fe-c07", kind: "paper", title: "前端框架 第 7 篇考试 · Let’s Write Redux!", pass: 60, questions: [], explain: [] },
            { cid: "fe-c08", kind: "paper", title: "前端框架 第 8 篇考试 · Redux: Implementing Store from Scratch", pass: 60, questions: [], explain: [] },
            { cid: "fe-c09", kind: "paper", title: "前端框架 第 9 篇考试 · Build Your own Simplified AngularJS in 200 Lines of JavaScript", pass: 60, questions: [], explain: [] },
            { cid: "fe-c10", kind: "paper", title: "前端框架 第 10 篇考试 · Make Your Own AngularJS", pass: 60, questions: [], explain: [] },
            { cid: "fe-c11", kind: "paper", title: "前端框架 第 11 篇考试 · How to write your own Virtual DOM", pass: 60, questions: [], explain: [] },
            { cid: "fe-c12", kind: "paper", title: "前端框架 第 12 篇考试 · Building a frontend framework, from scratch, with components (templating, state, VDOM)", pass: 60, questions: [], explain: [] },
            { cid: "fe-c13", kind: "paper", title: "前端框架 第 13 篇考试 · Build your own React", pass: 60, questions: [], explain: [] },
            { cid: "fe-c14", kind: "paper", title: "前端框架 第 14 篇考试 · Building a Custom React Renderer", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "db",
          title: "从零写一个数据库（build-your-own-x 13 篇全做）",
          intro: "这一类要你自己造一个数据库：磁盘页与缓冲池、B 树或 LSM 索引、SQL 词法语法、执行器、事务与崩溃恢复，一路做到分布式 KV。清单来自 build-your-own-x。",
          cat: "算法",
          diff: "掌握",
          tags: ["Go", "Python", "C", "存储引擎", "SQL", "事务", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-db.svg",
          chapters: [
            { id: "db-c01", title: "数据库 · Let's Build a Simple Database", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「Database」，站内章节 id db-c01），原文语言 C，原文链接 https://cstack.github.io/db_tutorial/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「Database」，站内章节 id db-c01），原文语言 C，原文链接 https://cstack.github.io/db_tutorial/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "db-c02", title: "数据库 · Build Your Own Redis from Scratch", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 2 篇（类目「Database」，站内章节 id db-c02），原文语言 C++，原文链接 https://build-your-own.org/redis" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 2 篇（类目「Database」，站内章节 id db-c02），原文语言 C++，原文链接 https://build-your-own.org/redis。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "db-c03", title: "数据库 · Build Your Own Database", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 3 篇（类目「Database」，站内章节 id db-c03），原文语言 C#，原文链接 https://www.codeproject.com/Articles/1029838/Build-Your-Own-Database" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 3 篇（类目「Database」，站内章节 id db-c03），原文语言 C#，原文链接 https://www.codeproject.com/Articles/1029838/Build-Your-Own-Database。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "db-c04", title: "数据库 · An Archaeology-Inspired Database", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 4 篇（类目「Database」，站内章节 id db-c04），原文语言 Clojure，原文链接 http://aosabook.org/en/500L/an-archaeology-inspired-database.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 4 篇（类目「Database」，站内章节 id db-c04），原文语言 Clojure，原文链接 http://aosabook.org/en/500L/an-archaeology-inspired-database.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "db-c05", title: "数据库 · Why you should build your own NoSQL Database", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 5 篇（类目「Database」，站内章节 id db-c05），原文语言 Crystal，原文链接 https://medium.com/@marceloboeira/why-you-should-build-your-own-nosql-database-9bbba42039f5" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 5 篇（类目「Database」，站内章节 id db-c05），原文语言 Crystal，原文链接 https://medium.com/@marceloboeira/why-you-should-build-your-own-nosql-database-9bbba42039f5。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "db-c06", title: "数据库 · Build Your Own Database from Scratch: From B+Tree To SQL in 3000 Lines", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 6 篇（类目「Database」，站内章节 id db-c06），原文语言 Go，原文链接 https://build-your-own.org/database/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 6 篇（类目「Database」，站内章节 id db-c06），原文语言 Go，原文链接 https://build-your-own.org/database/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "db-c07", title: "数据库 · Code a database in 45 steps: a series of test-driven small coding puzzles", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 7 篇（类目「Database」，站内章节 id db-c07），原文语言 Go，原文链接 https://trialofcode.org/database/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 7 篇（类目「Database」，站内章节 id db-c07），原文语言 Go，原文链接 https://trialofcode.org/database/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "db-c08", title: "数据库 · Build Your Own Redis from Scratch", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 8 篇（类目「Database」，站内章节 id db-c08），原文语言 Go，原文链接 https://www.build-redis-from-scratch.dev/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 8 篇（类目「Database」，站内章节 id db-c08），原文语言 Go，原文链接 https://www.build-redis-from-scratch.dev/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "db-c09", title: "数据库 · Dagoba: an in-memory graph database", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 9 篇（类目「Database」，站内章节 id db-c09），原文语言 JavaScript，原文链接 http://aosabook.org/en/500L/dagoba-an-in-memory-graph-database.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 9 篇（类目「Database」，站内章节 id db-c09），原文语言 JavaScript，原文链接 http://aosabook.org/en/500L/dagoba-an-in-memory-graph-database.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "db-c10", title: "数据库 · DBDB: Dog Bed Database", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 10 篇（类目「Database」，站内章节 id db-c10），原文语言 Python，原文链接 http://aosabook.org/en/500L/dbdb-dog-bed-database.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 10 篇（类目「Database」，站内章节 id db-c10），原文语言 Python，原文链接 http://aosabook.org/en/500L/dbdb-dog-bed-database.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "db-c11", title: "数据库 · Write your own miniature Redis with Python", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 11 篇（类目「Database」，站内章节 id db-c11），原文语言 Python，原文链接 http://charlesleifer.com/blog/building-a-simple-redis-server-with-python/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 11 篇（类目「Database」，站内章节 id db-c11），原文语言 Python，原文链接 http://charlesleifer.com/blog/building-a-simple-redis-server-with-python/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "db-c12", title: "数据库 · Build your own fast, persistent KV store in Ruby", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 12 篇（类目「Database」，站内章节 id db-c12），原文语言 Ruby，原文链接 https://dineshgowda.com/posts/build-your-own-persistent-kv-store/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 12 篇（类目「Database」，站内章节 id db-c12），原文语言 Ruby，原文链接 https://dineshgowda.com/posts/build-your-own-persistent-kv-store/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "db-c13", title: "数据库 · Build your own Redis client and server", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 13 篇（类目「Database」，站内章节 id db-c13），原文语言 Rust，原文链接 https://tokio.rs/tokio/tutorial/setup" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 13 篇（类目「Database」，站内章节 id db-c13），原文语言 Rust，原文链接 https://tokio.rs/tokio/tutorial/setup。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "Database", papers: [
            { cid: "db-c01", kind: "paper", title: "数据库 第 1 篇考试 · Let's Build a Simple Database", pass: 60, questions: [], explain: [] },
            { cid: "db-c02", kind: "paper", title: "数据库 第 2 篇考试 · Build Your Own Redis from Scratch", pass: 60, questions: [], explain: [] },
            { cid: "db-c03", kind: "paper", title: "数据库 第 3 篇考试 · Build Your Own Database", pass: 60, questions: [], explain: [] },
            { cid: "db-c04", kind: "paper", title: "数据库 第 4 篇考试 · An Archaeology-Inspired Database", pass: 60, questions: [], explain: [] },
            { cid: "db-c05", kind: "paper", title: "数据库 第 5 篇考试 · Why you should build your own NoSQL Database", pass: 60, questions: [], explain: [] },
            { cid: "db-c06", kind: "paper", title: "数据库 第 6 篇考试 · Build Your Own Database from Scratch: From B+Tree To SQL in 3000 Lines", pass: 60, questions: [], explain: [] },
            { cid: "db-c07", kind: "paper", title: "数据库 第 7 篇考试 · Code a database in 45 steps: a series of test-driven small coding puzzles", pass: 60, questions: [], explain: [] },
            { cid: "db-c08", kind: "paper", title: "数据库 第 8 篇考试 · Build Your Own Redis from Scratch", pass: 60, questions: [], explain: [] },
            { cid: "db-c09", kind: "paper", title: "数据库 第 9 篇考试 · Dagoba: an in-memory graph database", pass: 60, questions: [], explain: [] },
            { cid: "db-c10", kind: "paper", title: "数据库 第 10 篇考试 · DBDB: Dog Bed Database", pass: 60, questions: [], explain: [] },
            { cid: "db-c11", kind: "paper", title: "数据库 第 11 篇考试 · Write your own miniature Redis with Python", pass: 60, questions: [], explain: [] },
            { cid: "db-c12", kind: "paper", title: "数据库 第 12 篇考试 · Build your own fast, persistent KV store in Ruby", pass: 60, questions: [], explain: [] },
            { cid: "db-c13", kind: "paper", title: "数据库 第 13 篇考试 · Build your own Redis client and server", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "emu",
          title: "从零写一个模拟器或虚拟机（build-your-own-x 13 篇全做）",
          intro: "这一类要你自己造模拟器：把目标机型的寄存器、内存和指令表实现出来，跑取指—解码—执行的死循环，再接上屏幕与按键，让别人的 ROM 在你的程序里动起来。清单来自 build-your-own-x。",
          cat: "嵌入式",
          diff: "掌握",
          tags: ["C++", "C", "Common Lisp", "指令集", "CPU 模拟", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-emu.svg",
          chapters: [
            { id: "emu-c01", title: "模拟器与虚拟机 · Home-grown bytecode interpreters", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「Emulator / Virtual Machine」，站内章节 id emu-c01），原文语言 C，原文链接 https://medium.com/bumble-tech/home-grown-bytecode-interpreters-51e12d59b25c" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「Emulator / Virtual Machine」，站内章节 id emu-c01），原文语言 C，原文链接 https://medium.com/bumble-tech/home-grown-bytecode-interpreters-51e12d59b25c。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "emu-c02", title: "模拟器与虚拟机 · Virtual machine in C", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 2 篇（类目「Emulator / Virtual Machine」，站内章节 id emu-c02），原文语言 C，原文链接 http://web.archive.org/web/20200121100942/https://blog.felixangell.com/virtual-machine-in-c/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 2 篇（类目「Emulator / Virtual Machine」，站内章节 id emu-c02），原文语言 C，原文链接 http://web.archive.org/web/20200121100942/https://blog.felixangell.com/virtual-machine-in-c/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "emu-c03", title: "模拟器与虚拟机 · Write your Own Virtual Machine", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 3 篇（类目「Emulator / Virtual Machine」，站内章节 id emu-c03），原文语言 C，原文链接 https://justinmeiners.github.io/lc3-vm/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 3 篇（类目「Emulator / Virtual Machine」，站内章节 id emu-c03），原文语言 C，原文链接 https://justinmeiners.github.io/lc3-vm/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "emu-c04", title: "模拟器与虚拟机 · Writing a Game Boy emulator, Cinoop", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 4 篇（类目「Emulator / Virtual Machine」，站内章节 id emu-c04），原文语言 C，原文链接 https://cturt.github.io/cinoop.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 4 篇（类目「Emulator / Virtual Machine」，站内章节 id emu-c04），原文语言 C，原文链接 https://cturt.github.io/cinoop.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "emu-c05", title: "模拟器与虚拟机 · How to write an emulator (CHIP-8 interpreter)", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 5 篇（类目「Emulator / Virtual Machine」，站内章节 id emu-c05），原文语言 C++，原文链接 http://www.multigesture.net/articles/how-to-write-an-emulator-chip-8-interpreter/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 5 篇（类目「Emulator / Virtual Machine」，站内章节 id emu-c05），原文语言 C++，原文链接 http://www.multigesture.net/articles/how-to-write-an-emulator-chip-8-interpreter/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "emu-c06", title: "模拟器与虚拟机 · Emulation tutorial (CHIP-8 interpreter)", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 6 篇（类目「Emulator / Virtual Machine」，站内章节 id emu-c06），原文语言 C++，原文链接 http://www.codeslinger.co.uk/pages/projects/chip8.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 6 篇（类目「Emulator / Virtual Machine」，站内章节 id emu-c06），原文语言 C++，原文链接 http://www.codeslinger.co.uk/pages/projects/chip8.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "emu-c07", title: "模拟器与虚拟机 · Emulation tutorial (GameBoy emulator)", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 7 篇（类目「Emulator / Virtual Machine」，站内章节 id emu-c07），原文语言 C++，原文链接 http://www.codeslinger.co.uk/pages/projects/gameboy.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 7 篇（类目「Emulator / Virtual Machine」，站内章节 id emu-c07），原文语言 C++，原文链接 http://www.codeslinger.co.uk/pages/projects/gameboy.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "emu-c08", title: "模拟器与虚拟机 · Emulation tutorial (Master System emulator)", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 8 篇（类目「Emulator / Virtual Machine」，站内章节 id emu-c08），原文语言 C++，原文链接 http://www.codeslinger.co.uk/pages/projects/mastersystem/memory.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 8 篇（类目「Emulator / Virtual Machine」，站内章节 id emu-c08），原文语言 C++，原文链接 http://www.codeslinger.co.uk/pages/projects/mastersystem/memory.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "emu-c09", title: "模拟器与虚拟机 · NES Emulator From Scratch", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 9 篇（类目「Emulator / Virtual Machine」，站内章节 id emu-c09），原文语言 C++，原文链接 https://www.youtube.com/playlist?list=PLrOv9FMX8xJHqMvSGB_9G9nZZ_4IgteYf（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 9 篇（类目「Emulator / Virtual Machine」，站内章节 id emu-c09），原文语言 C++，原文链接 https://www.youtube.com/playlist?list=PLrOv9FMX8xJHqMvSGB_9G9nZZ_4IgteYf（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "emu-c10", title: "模拟器与虚拟机 · CHIP-8 in Common Lisp", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 10 篇（类目「Emulator / Virtual Machine」，站内章节 id emu-c10），原文语言 Common Lisp，原文链接 http://stevelosh.com/blog/2016/12/chip8-cpu/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 10 篇（类目「Emulator / Virtual Machine」，站内章节 id emu-c10），原文语言 Common Lisp，原文链接 http://stevelosh.com/blog/2016/12/chip8-cpu/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "emu-c11", title: "模拟器与虚拟机 · GameBoy Emulation in JavaScript", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 11 篇（类目「Emulator / Virtual Machine」，站内章节 id emu-c11），原文语言 JavaScript，原文链接 http://imrannazar.com/GameBoy-Emulation-in-JavaScript" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 11 篇（类目「Emulator / Virtual Machine」，站内章节 id emu-c11），原文语言 JavaScript，原文链接 http://imrannazar.com/GameBoy-Emulation-in-JavaScript。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "emu-c12", title: "模拟器与虚拟机 · Emulation Basics: Write your own Chip 8 Emulator/Interpreter", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 12 篇（类目「Emulator / Virtual Machine」，站内章节 id emu-c12），原文语言 Python，原文链接 http://omokute.blogspot.com.br/2012/06/emulation-basics-write-your-own-chip-8.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 12 篇（类目「Emulator / Virtual Machine」，站内章节 id emu-c12），原文语言 Python，原文链接 http://omokute.blogspot.com.br/2012/06/emulation-basics-write-your-own-chip-8.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "emu-c13", title: "模拟器与虚拟机 · 0dmg: Learning Rust by building a partial Game Boy emulator", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 13 篇（类目「Emulator / Virtual Machine」，站内章节 id emu-c13），原文语言 Rust，原文链接 https://jeremybanks.github.io/0dmg/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 13 篇（类目「Emulator / Virtual Machine」，站内章节 id emu-c13），原文语言 Rust，原文链接 https://jeremybanks.github.io/0dmg/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "Emulator / Virtual Machine", papers: [
            { cid: "emu-c01", kind: "paper", title: "模拟器与虚拟机 第 1 篇考试 · Home-grown bytecode interpreters", pass: 60, questions: [], explain: [] },
            { cid: "emu-c02", kind: "paper", title: "模拟器与虚拟机 第 2 篇考试 · Virtual machine in C", pass: 60, questions: [], explain: [] },
            { cid: "emu-c03", kind: "paper", title: "模拟器与虚拟机 第 3 篇考试 · Write your Own Virtual Machine", pass: 60, questions: [], explain: [] },
            { cid: "emu-c04", kind: "paper", title: "模拟器与虚拟机 第 4 篇考试 · Writing a Game Boy emulator, Cinoop", pass: 60, questions: [], explain: [] },
            { cid: "emu-c05", kind: "paper", title: "模拟器与虚拟机 第 5 篇考试 · How to write an emulator (CHIP-8 interpreter)", pass: 60, questions: [], explain: [] },
            { cid: "emu-c06", kind: "paper", title: "模拟器与虚拟机 第 6 篇考试 · Emulation tutorial (CHIP-8 interpreter)", pass: 60, questions: [], explain: [] },
            { cid: "emu-c07", kind: "paper", title: "模拟器与虚拟机 第 7 篇考试 · Emulation tutorial (GameBoy emulator)", pass: 60, questions: [], explain: [] },
            { cid: "emu-c08", kind: "paper", title: "模拟器与虚拟机 第 8 篇考试 · Emulation tutorial (Master System emulator)", pass: 60, questions: [], explain: [] },
            { cid: "emu-c09", kind: "paper", title: "模拟器与虚拟机 第 9 篇考试 · NES Emulator From Scratch", pass: 60, questions: [], explain: [] },
            { cid: "emu-c10", kind: "paper", title: "模拟器与虚拟机 第 10 篇考试 · CHIP-8 in Common Lisp", pass: 60, questions: [], explain: [] },
            { cid: "emu-c11", kind: "paper", title: "模拟器与虚拟机 第 11 篇考试 · GameBoy Emulation in JavaScript", pass: 60, questions: [], explain: [] },
            { cid: "emu-c12", kind: "paper", title: "模拟器与虚拟机 第 12 篇考试 · Emulation Basics: Write your own Chip 8 Emulator/Interpreter", pass: 60, questions: [], explain: [] },
            { cid: "emu-c13", kind: "paper", title: "模拟器与虚拟机 第 13 篇考试 · 0dmg: Learning Rust by building a partial Game Boy emulator", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "3d",
          title: "从零做一个 3D 渲染器（build-your-own-x 11 篇全做）",
          intro: "这一类要你自己造渲染器：从往画布上点第一个像素开始，做投影、三角形光栅化、Z 缓冲、光照与纹理映射，再走到光线追踪和全局光照。清单来自 build-your-own-x。",
          cat: "计算机基础",
          diff: "精通",
          tags: ["C++", "JavaScript", "Java", "图形学", "光栅化", "光线追踪", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-3d.svg",
          chapters: [
            { id: "3d-c01", title: "3D 渲染器 · Introduction to Ray Tracing: a Simple Method for Creating 3D Images", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「3D Renderer」，站内章节 id 3d-c01），原文语言 C++，原文链接 https://www.scratchapixel.com/lessons/3d-basic-rendering/introduction-to-ray-tracing/how-does-it-work" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「3D Renderer」，站内章节 id 3d-c01），原文语言 C++，原文链接 https://www.scratchapixel.com/lessons/3d-basic-rendering/introduction-to-ray-tracing/how-does-it-work。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "3d-c02", title: "3D 渲染器 · How OpenGL works: software rendering in 500 lines of code", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 2 篇（类目「3D Renderer」，站内章节 id 3d-c02），原文语言 C++，原文链接 https://github.com/ssloy/tinyrenderer/wiki" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 2 篇（类目「3D Renderer」，站内章节 id 3d-c02），原文语言 C++，原文链接 https://github.com/ssloy/tinyrenderer/wiki。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "3d-c03", title: "3D 渲染器 · Raycasting engine of Wolfenstein 3D", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 3 篇（类目「3D Renderer」，站内章节 id 3d-c03），原文语言 C++，原文链接 http://lodev.org/cgtutor/raycasting.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 3 篇（类目「3D Renderer」，站内章节 id 3d-c03），原文语言 C++，原文链接 http://lodev.org/cgtutor/raycasting.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "3d-c04", title: "3D 渲染器 · Physically Based Rendering:From Theory To Implementation", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 4 篇（类目「3D Renderer」，站内章节 id 3d-c04），原文语言 C++，原文链接 http://www.pbr-book.org/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 4 篇（类目「3D Renderer」，站内章节 id 3d-c04），原文语言 C++，原文链接 http://www.pbr-book.org/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "3d-c05", title: "3D 渲染器 · Ray Tracing in One Weekend", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 5 篇（类目「3D Renderer」，站内章节 id 3d-c05），原文语言 C++，原文链接 https://raytracing.github.io/books/RayTracingInOneWeekend.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 5 篇（类目「3D Renderer」，站内章节 id 3d-c05），原文语言 C++，原文链接 https://raytracing.github.io/books/RayTracingInOneWeekend.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "3d-c06", title: "3D 渲染器 · Rasterization: a Practical Implementation", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 6 篇（类目「3D Renderer」，站内章节 id 3d-c06），原文语言 C++，原文链接 https://www.scratchapixel.com/lessons/3d-basic-rendering/rasterization-practical-implementation/overview-rasterization-algorithm" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 6 篇（类目「3D Renderer」，站内章节 id 3d-c06），原文语言 C++，原文链接 https://www.scratchapixel.com/lessons/3d-basic-rendering/rasterization-practical-implementation/overview-rasterization-algorithm。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "3d-c07", title: "3D 渲染器 · Learning how to write a 3D soft engine from scratch in C#, TypeScript or JavaScript", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 7 篇（类目「3D Renderer」，站内章节 id 3d-c07），原文语言 C# / TypeScript / JavaScript，原文链接 https://www.davrous.com/2013/06/13/tutorial-series-learning-how-to-write-a-3d-soft-engine-from-scratch-in-c-typescript-or-javascript/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 7 篇（类目「3D Renderer」，站内章节 id 3d-c07），原文语言 C# / TypeScript / JavaScript，原文链接 https://www.davrous.com/2013/06/13/tutorial-series-learning-how-to-write-a-3d-soft-engine-from-scratch-in-c-typescript-or-javascript/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "3d-c08", title: "3D 渲染器 · Build your own 3D renderer", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 8 篇（类目「3D Renderer」，站内章节 id 3d-c08），原文语言 Java / JavaScript，原文链接 https://avik-das.github.io/build-your-own-raytracer/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 8 篇（类目「3D Renderer」，站内章节 id 3d-c08），原文语言 Java / JavaScript，原文链接 https://avik-das.github.io/build-your-own-raytracer/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "3d-c09", title: "3D 渲染器 · How to create your own simple 3D render engine in pure Java", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 9 篇（类目「3D Renderer」，站内章节 id 3d-c09），原文语言 Java，原文链接 http://blog.rogach.org/2015/08/how-to-create-your-own-simple-3d-render.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 9 篇（类目「3D Renderer」，站内章节 id 3d-c09），原文语言 Java，原文链接 http://blog.rogach.org/2015/08/how-to-create-your-own-simple-3d-render.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "3d-c10", title: "3D 渲染器 · Computer Graphics from scratch", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 10 篇（类目「3D Renderer」，站内章节 id 3d-c10），原文语言 JavaScript / Pseudocode，原文链接 http://www.gabrielgambetta.com/computer-graphics-from-scratch/introduction.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 10 篇（类目「3D Renderer」，站内章节 id 3d-c10），原文语言 JavaScript / Pseudocode，原文链接 http://www.gabrielgambetta.com/computer-graphics-from-scratch/introduction.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "3d-c11", title: "3D 渲染器 · A 3D Modeller", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 11 篇（类目「3D Renderer」，站内章节 id 3d-c11），原文语言 Python，原文链接 http://aosabook.org/en/500L/a-3d-modeller.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 11 篇（类目「3D Renderer」，站内章节 id 3d-c11），原文语言 Python，原文链接 http://aosabook.org/en/500L/a-3d-modeller.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "3D Renderer", papers: [
            { cid: "3d-c01", kind: "paper", title: "3D 渲染器 第 1 篇考试 · Introduction to Ray Tracing: a Simple Method for Creating 3D Images", pass: 60, questions: [], explain: [] },
            { cid: "3d-c02", kind: "paper", title: "3D 渲染器 第 2 篇考试 · How OpenGL works: software rendering in 500 lines of code", pass: 60, questions: [], explain: [] },
            { cid: "3d-c03", kind: "paper", title: "3D 渲染器 第 3 篇考试 · Raycasting engine of Wolfenstein 3D", pass: 60, questions: [], explain: [] },
            { cid: "3d-c04", kind: "paper", title: "3D 渲染器 第 4 篇考试 · Physically Based Rendering:From Theory To Implementation", pass: 60, questions: [], explain: [] },
            { cid: "3d-c05", kind: "paper", title: "3D 渲染器 第 5 篇考试 · Ray Tracing in One Weekend", pass: 60, questions: [], explain: [] },
            { cid: "3d-c06", kind: "paper", title: "3D 渲染器 第 6 篇考试 · Rasterization: a Practical Implementation", pass: 60, questions: [], explain: [] },
            { cid: "3d-c07", kind: "paper", title: "3D 渲染器 第 7 篇考试 · Learning how to write a 3D soft engine from scratch in C#, TypeScript or JavaScript", pass: 60, questions: [], explain: [] },
            { cid: "3d-c08", kind: "paper", title: "3D 渲染器 第 8 篇考试 · Build your own 3D renderer", pass: 60, questions: [], explain: [] },
            { cid: "3d-c09", kind: "paper", title: "3D 渲染器 第 9 篇考试 · How to create your own simple 3D render engine in pure Java", pass: 60, questions: [], explain: [] },
            { cid: "3d-c10", kind: "paper", title: "3D 渲染器 第 10 篇考试 · Computer Graphics from scratch", pass: 60, questions: [], explain: [] },
            { cid: "3d-c11", kind: "paper", title: "3D 渲染器 第 11 篇考试 · A 3D Modeller", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "cli",
          title: "从零做一个命令行工具（build-your-own-x 9 篇全做）",
          intro: "这一类要你自己造终端里的小工具：解析 argv 与子命令、读写配置、输出彩色与光标控制、处理管道和进度条，最后做成你每天真会用的那一个。清单来自 build-your-own-x。",
          cat: "vs code",
          diff: "入门",
          tags: ["Go", "Rust", "Nim", "终端", "参数解析", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-cli.svg",
          chapters: [
            { id: "cli-c01", title: "命令行工具 · Visualize your local git contributions with Go", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「Command-Line Tool」，站内章节 id cli-c01），原文语言 Go，原文链接 https://flaviocopes.com/go-git-contributions/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「Command-Line Tool」，站内章节 id cli-c01），原文语言 Go，原文链接 https://flaviocopes.com/go-git-contributions/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "cli-c02", title: "命令行工具 · Build a command line app with Go: lolcat", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 2 篇（类目「Command-Line Tool」，站内章节 id cli-c02），原文语言 Go，原文链接 https://flaviocopes.com/go-tutorial-lolcat/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 2 篇（类目「Command-Line Tool」，站内章节 id cli-c02），原文语言 Go，原文链接 https://flaviocopes.com/go-tutorial-lolcat/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "cli-c03", title: "命令行工具 · Building a cli command with Go: cowsay", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 3 篇（类目「Command-Line Tool」，站内章节 id cli-c03），原文语言 Go，原文链接 https://flaviocopes.com/go-tutorial-cowsay/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 3 篇（类目「Command-Line Tool」，站内章节 id cli-c03），原文语言 Go，原文链接 https://flaviocopes.com/go-tutorial-cowsay/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "cli-c04", title: "命令行工具 · Go CLI tutorial: fortune clone", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 4 篇（类目「Command-Line Tool」，站内章节 id cli-c04），原文语言 Go，原文链接 https://flaviocopes.com/go-tutorial-fortune/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 4 篇（类目「Command-Line Tool」，站内章节 id cli-c04），原文语言 Go，原文链接 https://flaviocopes.com/go-tutorial-fortune/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "cli-c05", title: "命令行工具 · Writing a stow alternative to manage dotfiles", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 5 篇（类目「Command-Line Tool」，站内章节 id cli-c05），原文语言 Nim，原文链接 https://xmonader.github.io/nimdays/day06_nistow.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 5 篇（类目「Command-Line Tool」，站内章节 id cli-c05），原文语言 Nim，原文链接 https://xmonader.github.io/nimdays/day06_nistow.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "cli-c06", title: "命令行工具 · Create a CLI tool in Javascript", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 6 篇（类目「Command-Line Tool」，站内章节 id cli-c06），原文语言 Node.js，原文链接 https://citw.dev/tutorial/create-your-own-cli-tool" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 6 篇（类目「Command-Line Tool」，站内章节 id cli-c06），原文语言 Node.js，原文链接 https://citw.dev/tutorial/create-your-own-cli-tool。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "cli-c07", title: "命令行工具 · Command line apps in Rust", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 7 篇（类目「Command-Line Tool」，站内章节 id cli-c07），原文语言 Rust，原文链接 https://rust-cli.github.io/book/index.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 7 篇（类目「Command-Line Tool」，站内章节 id cli-c07），原文语言 Rust，原文链接 https://rust-cli.github.io/book/index.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "cli-c08", title: "命令行工具 · Writing a Command Line Tool in Rust", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 8 篇（类目「Command-Line Tool」，站内章节 id cli-c08），原文语言 Rust，原文链接 https://mattgathu.dev/2017/08/29/writing-cli-app-rust.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 8 篇（类目「Command-Line Tool」，站内章节 id cli-c08），原文语言 Rust，原文链接 https://mattgathu.dev/2017/08/29/writing-cli-app-rust.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "cli-c09", title: "命令行工具 · Build Your Own CLI App in Zig from Scratch", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 9 篇（类目「Command-Line Tool」，站内章节 id cli-c09），原文语言 Zig，原文链接 https://rebuild-x.github.io/docs/#/./zig/terminal/cli" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 9 篇（类目「Command-Line Tool」，站内章节 id cli-c09），原文语言 Zig，原文链接 https://rebuild-x.github.io/docs/#/./zig/terminal/cli。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "Command-Line Tool", papers: [
            { cid: "cli-c01", kind: "paper", title: "命令行工具 第 1 篇考试 · Visualize your local git contributions with Go", pass: 60, questions: [], explain: [] },
            { cid: "cli-c02", kind: "paper", title: "命令行工具 第 2 篇考试 · Build a command line app with Go: lolcat", pass: 60, questions: [], explain: [] },
            { cid: "cli-c03", kind: "paper", title: "命令行工具 第 3 篇考试 · Building a cli command with Go: cowsay", pass: 60, questions: [], explain: [] },
            { cid: "cli-c04", kind: "paper", title: "命令行工具 第 4 篇考试 · Go CLI tutorial: fortune clone", pass: 60, questions: [], explain: [] },
            { cid: "cli-c05", kind: "paper", title: "命令行工具 第 5 篇考试 · Writing a stow alternative to manage dotfiles", pass: 60, questions: [], explain: [] },
            { cid: "cli-c06", kind: "paper", title: "命令行工具 第 6 篇考试 · Create a CLI tool in Javascript", pass: 60, questions: [], explain: [] },
            { cid: "cli-c07", kind: "paper", title: "命令行工具 第 7 篇考试 · Command line apps in Rust", pass: 60, questions: [], explain: [] },
            { cid: "cli-c08", kind: "paper", title: "命令行工具 第 8 篇考试 · Writing a Command Line Tool in Rust", pass: 60, questions: [], explain: [] },
            { cid: "cli-c09", kind: "paper", title: "命令行工具 第 9 篇考试 · Build Your Own CLI App in Zig from Scratch", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "regex",
          title: "从零实现一个正则引擎（build-your-own-x 9 篇全做）",
          intro: "这一类要你自己造正则引擎：把正则表达式解析成语法树，编译成 NFA（Thompson 构造）或直接用递归回溯匹配，再补量词、分组、贪婪与惰性。grep 的心脏就是这么回事。清单来自 build-your-own-x。",
          cat: "算法",
          diff: "掌握",
          tags: ["JavaScript", "C", "Go", "自动机", "字符串匹配", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-regex.svg",
          chapters: [
            { id: "regex-c01", title: "正则引擎 · A Regular Expression Matcher", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「Regex Engine」，站内章节 id regex-c01），原文语言 C，原文链接 https://www.cs.princeton.edu/courses/archive/spr09/cos333/beautiful.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「Regex Engine」，站内章节 id regex-c01），原文语言 C，原文链接 https://www.cs.princeton.edu/courses/archive/spr09/cos333/beautiful.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "regex-c02", title: "正则引擎 · Regular Expression Matching Can Be Simple And Fast", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 2 篇（类目「Regex Engine」，站内章节 id regex-c02），原文语言 C，原文链接 https://swtch.com/~rsc/regexp/regexp1.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 2 篇（类目「Regex Engine」，站内章节 id regex-c02），原文语言 C，原文链接 https://swtch.com/~rsc/regexp/regexp1.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "regex-c03", title: "正则引擎 · How to build a regex engine from scratch", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 3 篇（类目「Regex Engine」，站内章节 id regex-c03），原文语言 Go，原文链接 https://rhaeguard.github.io/posts/regex" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 3 篇（类目「Regex Engine」，站内章节 id regex-c03），原文语言 Go，原文链接 https://rhaeguard.github.io/posts/regex。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "regex-c04", title: "正则引擎 · Build a Regex Engine in Less than 40 Lines of Code", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 4 篇（类目「Regex Engine」，站内章节 id regex-c04），原文语言 JavaScript，原文链接 https://nickdrane.com/build-your-own-regex/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 4 篇（类目「Regex Engine」，站内章节 id regex-c04），原文语言 JavaScript，原文链接 https://nickdrane.com/build-your-own-regex/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "regex-c05", title: "正则引擎 · How to implement regular expressions in functional javascript using derivatives", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 5 篇（类目「Regex Engine」，站内章节 id regex-c05），原文语言 JavaScript，原文链接 http://dpk.io/dregs/toydregs" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 5 篇（类目「Regex Engine」，站内章节 id regex-c05），原文语言 JavaScript，原文链接 http://dpk.io/dregs/toydregs。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "regex-c06", title: "正则引擎 · Implementing a Regular Expression Engine", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 6 篇（类目「Regex Engine」，站内章节 id regex-c06），原文语言 JavaScript，原文链接 https://deniskyashif.com/2019/02/17/implementing-a-regular-expression-engine/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 6 篇（类目「Regex Engine」，站内章节 id regex-c06），原文语言 JavaScript，原文链接 https://deniskyashif.com/2019/02/17/implementing-a-regular-expression-engine/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "regex-c07", title: "正则引擎 · How Regexes Work", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 7 篇（类目「Regex Engine」，站内章节 id regex-c07），原文语言 Perl，原文链接 https://perl.plover.com/Regex/article.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 7 篇（类目「Regex Engine」，站内章节 id regex-c07），原文语言 Perl，原文链接 https://perl.plover.com/Regex/article.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "regex-c08", title: "正则引擎 · Build Your Own Regular Expression Engines: Backtracking, NFA, DFA", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 8 篇（类目「Regex Engine」，站内章节 id regex-c08），原文语言 Python，原文链接 https://build-your-own.org/b2a/r0_intro" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 8 篇（类目「Regex Engine」，站内章节 id regex-c08），原文语言 Python，原文链接 https://build-your-own.org/b2a/r0_intro。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "regex-c09", title: "正则引擎 · No Magic: Regular Expressions", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 9 篇（类目「Regex Engine」，站内章节 id regex-c09），原文语言 Scala，原文链接 https://rcoh.svbtle.com/no-magic-regular-expressions" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 9 篇（类目「Regex Engine」，站内章节 id regex-c09），原文语言 Scala，原文链接 https://rcoh.svbtle.com/no-magic-regular-expressions。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "Regex Engine", papers: [
            { cid: "regex-c01", kind: "paper", title: "正则引擎 第 1 篇考试 · A Regular Expression Matcher", pass: 60, questions: [], explain: [] },
            { cid: "regex-c02", kind: "paper", title: "正则引擎 第 2 篇考试 · Regular Expression Matching Can Be Simple And Fast", pass: 60, questions: [], explain: [] },
            { cid: "regex-c03", kind: "paper", title: "正则引擎 第 3 篇考试 · How to build a regex engine from scratch", pass: 60, questions: [], explain: [] },
            { cid: "regex-c04", kind: "paper", title: "正则引擎 第 4 篇考试 · Build a Regex Engine in Less than 40 Lines of Code", pass: 60, questions: [], explain: [] },
            { cid: "regex-c05", kind: "paper", title: "正则引擎 第 5 篇考试 · How to implement regular expressions in functional javascript using derivatives", pass: 60, questions: [], explain: [] },
            { cid: "regex-c06", kind: "paper", title: "正则引擎 第 6 篇考试 · Implementing a Regular Expression Engine", pass: 60, questions: [], explain: [] },
            { cid: "regex-c07", kind: "paper", title: "正则引擎 第 7 篇考试 · How Regexes Work", pass: 60, questions: [], explain: [] },
            { cid: "regex-c08", kind: "paper", title: "正则引擎 第 8 篇考试 · Build Your Own Regular Expression Engines: Backtracking, NFA, DFA", pass: 60, questions: [], explain: [] },
            { cid: "regex-c09", kind: "paper", title: "正则引擎 第 9 篇考试 · No Magic: Regular Expressions", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "git",
          title: "从零实现一个 Git（build-your-own-x 7 篇全做）",
          intro: "这一类要你自己造一个迷你 Git：写 .git 目录和 blob/tree/commit 对象、内容寻址，实现 init/add/commit/log，再做分支、合并、diff 与三方合并。清单来自 build-your-own-x。",
          cat: "git",
          diff: "掌握",
          tags: ["Python", "JavaScript", "Haskell", "版本控制", "对象库", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-git.svg",
          chapters: [
            { id: "git-c01", title: "Git · Reimplementing “git clone” in Haskell from the bottom up", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「Git」，站内章节 id git-c01），原文语言 Haskell，原文链接 http://stefan.saasen.me/articles/git-clone-in-haskell-from-the-bottom-up/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「Git」，站内章节 id git-c01），原文语言 Haskell，原文链接 http://stefan.saasen.me/articles/git-clone-in-haskell-from-the-bottom-up/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "git-c02", title: "Git · Gitlet", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 2 篇（类目「Git」，站内章节 id git-c02），原文语言 JavaScript，原文链接 http://gitlet.maryrosecook.com/docs/gitlet.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 2 篇（类目「Git」，站内章节 id git-c02），原文语言 JavaScript，原文链接 http://gitlet.maryrosecook.com/docs/gitlet.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "git-c03", title: "Git · Build GIT - Learn GIT", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 3 篇（类目「Git」，站内章节 id git-c03），原文语言 JavaScript，原文链接 https://kushagra.dev/blog/build-git-learn-git/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 3 篇（类目「Git」，站内章节 id git-c03），原文语言 JavaScript，原文链接 https://kushagra.dev/blog/build-git-learn-git/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "git-c04", title: "Git · Just enough of a Git client to create a repo, commit, and push itself to GitHub", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 4 篇（类目「Git」，站内章节 id git-c04），原文语言 Python，原文链接 https://benhoyt.com/writings/pygit/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 4 篇（类目「Git」，站内章节 id git-c04），原文语言 Python，原文链接 https://benhoyt.com/writings/pygit/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "git-c05", title: "Git · Write yourself a Git!", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 5 篇（类目「Git」，站内章节 id git-c05），原文语言 Python，原文链接 https://wyag.thb.lt/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 5 篇（类目「Git」，站内章节 id git-c05），原文语言 Python，原文链接 https://wyag.thb.lt/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "git-c06", title: "Git · ugit: Learn Git Internals by Building Git Yourself", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 6 篇（类目「Git」，站内章节 id git-c06），原文语言 Python，原文链接 https://www.leshenko.net/p/ugit/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 6 篇（类目「Git」，站内章节 id git-c06），原文语言 Python，原文链接 https://www.leshenko.net/p/ugit/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "git-c07", title: "Git · Rebuilding Git in Ruby", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 7 篇（类目「Git」，站内章节 id git-c07），原文语言 Ruby，原文链接 https://robots.thoughtbot.com/rebuilding-git-in-ruby" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 7 篇（类目「Git」，站内章节 id git-c07），原文语言 Ruby，原文链接 https://robots.thoughtbot.com/rebuilding-git-in-ruby。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "Git", papers: [
            { cid: "git-c01", kind: "paper", title: "Git 第 1 篇考试 · Reimplementing “git clone” in Haskell from the bottom up", pass: 60, questions: [], explain: [] },
            { cid: "git-c02", kind: "paper", title: "Git 第 2 篇考试 · Gitlet", pass: 60, questions: [], explain: [] },
            { cid: "git-c03", kind: "paper", title: "Git 第 3 篇考试 · Build GIT - Learn GIT", pass: 60, questions: [], explain: [] },
            { cid: "git-c04", kind: "paper", title: "Git 第 4 篇考试 · Just enough of a Git client to create a repo, commit, and push itself to GitHub", pass: 60, questions: [], explain: [] },
            { cid: "git-c05", kind: "paper", title: "Git 第 5 篇考试 · Write yourself a Git!", pass: 60, questions: [], explain: [] },
            { cid: "git-c06", kind: "paper", title: "Git 第 6 篇考试 · ugit: Learn Git Internals by Building Git Yourself", pass: 60, questions: [], explain: [] },
            { cid: "git-c07", kind: "paper", title: "Git 第 7 篇考试 · Rebuilding Git in Ruby", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "physics",
          title: "从零做一个物理引擎（build-your-own-x 7 篇全做）",
          intro: "这一类要你自己造物理世界：向量与刚体、显式与半隐式积分、碰撞检测和响应、约束求解与堆叠稳定性。做完你的小球才会正确地落下来、摞起来不倒。清单来自 build-your-own-x。",
          cat: "计算机基础",
          diff: "掌握",
          tags: ["C++", "JavaScript", "C", "刚体", "碰撞", "数值积分", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-physics.svg",
          chapters: [
            { id: "physics-c01", title: "物理引擎 · Video Game Physics Tutorial", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「Physics Engine」，站内章节 id physics-c01），原文语言 C，原文链接 https://www.toptal.com/game/video-game-physics-part-i-an-introduction-to-rigid-body-dynamics" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「Physics Engine」，站内章节 id physics-c01），原文语言 C，原文链接 https://www.toptal.com/game/video-game-physics-part-i-an-introduction-to-rigid-body-dynamics。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "physics-c02", title: "物理引擎 · Game physics series by Allen Chou", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 2 篇（类目「Physics Engine」，站内章节 id physics-c02），原文语言 C++，原文链接 http://allenchou.net/game-physics-series/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 2 篇（类目「Physics Engine」，站内章节 id physics-c02），原文语言 C++，原文链接 http://allenchou.net/game-physics-series/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "physics-c03", title: "物理引擎 · How to Create a Custom Physics Engine", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 3 篇（类目「Physics Engine」，站内章节 id physics-c03），原文语言 C++，原文链接 https://gamedevelopment.tutsplus.com/series/how-to-create-a-custom-physics-engine--gamedev-12715" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 3 篇（类目「Physics Engine」，站内章节 id physics-c03），原文语言 C++，原文链接 https://gamedevelopment.tutsplus.com/series/how-to-create-a-custom-physics-engine--gamedev-12715。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "physics-c04", title: "物理引擎 · 3D Physics Engine Tutorial", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 4 篇（类目「Physics Engine」，站内章节 id physics-c04），原文语言 C++，原文链接 https://www.youtube.com/playlist?list=PLEETnX-uPtBXm1KEr_2zQ6K_0hoGH6JJ0（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 4 篇（类目「Physics Engine」，站内章节 id physics-c04），原文语言 C++，原文链接 https://www.youtube.com/playlist?list=PLEETnX-uPtBXm1KEr_2zQ6K_0hoGH6JJ0（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "physics-c05", title: "物理引擎 · How Physics Engines Work", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 5 篇（类目「Physics Engine」，站内章节 id physics-c05），原文语言 JavaScript，原文链接 http://buildnewgames.com/gamephysics/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 5 篇（类目「Physics Engine」，站内章节 id physics-c05），原文语言 JavaScript，原文链接 http://buildnewgames.com/gamephysics/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "physics-c06", title: "物理引擎 · Broad Phase Collision Detection Using Spatial Partitioning", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 6 篇（类目「Physics Engine」，站内章节 id physics-c06），原文语言 JavaScript，原文链接 http://buildnewgames.com/broad-phase-collision-detection/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 6 篇（类目「Physics Engine」，站内章节 id physics-c06），原文语言 JavaScript，原文链接 http://buildnewgames.com/broad-phase-collision-detection/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "physics-c07", title: "物理引擎 · Build a simple 2D physics engine for JavaScript games", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 7 篇（类目「Physics Engine」，站内章节 id physics-c07），原文语言 JavaScript，原文链接 https://developer.ibm.com/tutorials/wa-build2dphysicsengine/?mhsrc=ibmsearch_a&mhq=2dphysic" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 7 篇（类目「Physics Engine」，站内章节 id physics-c07），原文语言 JavaScript，原文链接 https://developer.ibm.com/tutorials/wa-build2dphysicsengine/?mhsrc=ibmsearch_a&mhq=2dphysic。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "Physics Engine", papers: [
            { cid: "physics-c01", kind: "paper", title: "物理引擎 第 1 篇考试 · Video Game Physics Tutorial", pass: 60, questions: [], explain: [] },
            { cid: "physics-c02", kind: "paper", title: "物理引擎 第 2 篇考试 · Game physics series by Allen Chou", pass: 60, questions: [], explain: [] },
            { cid: "physics-c03", kind: "paper", title: "物理引擎 第 3 篇考试 · How to Create a Custom Physics Engine", pass: 60, questions: [], explain: [] },
            { cid: "physics-c04", kind: "paper", title: "物理引擎 第 4 篇考试 · 3D Physics Engine Tutorial", pass: 60, questions: [], explain: [] },
            { cid: "physics-c05", kind: "paper", title: "物理引擎 第 5 篇考试 · How Physics Engines Work", pass: 60, questions: [], explain: [] },
            { cid: "physics-c06", kind: "paper", title: "物理引擎 第 6 篇考试 · Broad Phase Collision Detection Using Spatial Partitioning", pass: 60, questions: [], explain: [] },
            { cid: "physics-c07", kind: "paper", title: "物理引擎 第 7 篇考试 · Build a simple 2D physics engine for JavaScript games", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "shell",
          title: "从零写一个 Shell（build-your-own-x 7 篇全做）",
          intro: "这一类要你自己造一个 shell：读一行命令、切词、fork/exec 起进程，再加内建命令、变量、输入输出重定向、管道、通配符和作业控制。清单来自 build-your-own-x。",
          cat: "linux",
          diff: "掌握",
          tags: ["C", "Go", "Rust", "进程", "管道", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-shell.svg",
          chapters: [
            { id: "shell-c01", title: "Shell · Tutorial - Write a Shell in C", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「Shell」，站内章节 id shell-c01），原文语言 C，原文链接 https://brennan.io/2015/01/16/write-a-shell-in-c/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「Shell」，站内章节 id shell-c01），原文语言 C，原文链接 https://brennan.io/2015/01/16/write-a-shell-in-c/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "shell-c02", title: "Shell · Let's build a shell!", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 2 篇（类目「Shell」，站内章节 id shell-c02），原文语言 C，原文链接 https://github.com/kamalmarhubi/shell-workshop" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 2 篇（类目「Shell」，站内章节 id shell-c02），原文语言 C，原文链接 https://github.com/kamalmarhubi/shell-workshop。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "shell-c03", title: "Shell · Writing a UNIX Shell", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 3 篇（类目「Shell」，站内章节 id shell-c03），原文语言 C，原文链接 https://indradhanush.github.io/blog/writing-a-unix-shell-part-1/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 3 篇（类目「Shell」，站内章节 id shell-c03），原文语言 C，原文链接 https://indradhanush.github.io/blog/writing-a-unix-shell-part-1/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "shell-c04", title: "Shell · Build Your Own Shell", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 4 篇（类目「Shell」，站内章节 id shell-c04），原文语言 C，原文链接 https://github.com/tokenrove/build-your-own-shell" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 4 篇（类目「Shell」，站内章节 id shell-c04），原文语言 C，原文链接 https://github.com/tokenrove/build-your-own-shell。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "shell-c05", title: "Shell · Write a shell in C", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 5 篇（类目「Shell」，站内章节 id shell-c05），原文语言 C，原文链接 https://danishpraka.sh/posts/write-a-shell/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 5 篇（类目「Shell」，站内章节 id shell-c05），原文语言 C，原文链接 https://danishpraka.sh/posts/write-a-shell/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "shell-c06", title: "Shell · Writing a simple shell in Go", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 6 篇（类目「Shell」，站内章节 id shell-c06），原文语言 Go，原文链接 https://sj14.gitlab.io/post/2018-07-01-go-unix-shell/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 6 篇（类目「Shell」，站内章节 id shell-c06），原文语言 Go，原文链接 https://sj14.gitlab.io/post/2018-07-01-go-unix-shell/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "shell-c07", title: "Shell · Build Your Own Shell using Rust", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 7 篇（类目「Shell」，站内章节 id shell-c07），原文语言 Rust，原文链接 https://www.joshmcguigan.com/blog/build-your-own-shell-rust/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 7 篇（类目「Shell」，站内章节 id shell-c07），原文语言 Rust，原文链接 https://www.joshmcguigan.com/blog/build-your-own-shell-rust/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "Shell", papers: [
            { cid: "shell-c01", kind: "paper", title: "Shell 第 1 篇考试 · Tutorial - Write a Shell in C", pass: 60, questions: [], explain: [] },
            { cid: "shell-c02", kind: "paper", title: "Shell 第 2 篇考试 · Let's build a shell!", pass: 60, questions: [], explain: [] },
            { cid: "shell-c03", kind: "paper", title: "Shell 第 3 篇考试 · Writing a UNIX Shell", pass: 60, questions: [], explain: [] },
            { cid: "shell-c04", kind: "paper", title: "Shell 第 4 篇考试 · Build Your Own Shell", pass: 60, questions: [], explain: [] },
            { cid: "shell-c05", kind: "paper", title: "Shell 第 5 篇考试 · Write a shell in C", pass: 60, questions: [], explain: [] },
            { cid: "shell-c06", kind: "paper", title: "Shell 第 6 篇考试 · Writing a simple shell in Go", pass: 60, questions: [], explain: [] },
            { cid: "shell-c07", kind: "paper", title: "Shell 第 7 篇考试 · Build Your Own Shell using Rust", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "ar",
          title: "从零做一个增强现实系统（build-your-own-x 6 篇全做）",
          intro: "这一类要你自己造 AR：从相机取流与标定开始，识别标记或特征点、估计位姿、算投影矩阵，把虚拟物体稳稳贴进真实画面。清单来自 build-your-own-x。",
          cat: "计算机基础",
          diff: "掌握",
          tags: ["C#", "Python", "视觉", "相机标定", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-ar.svg",
          chapters: [
            { id: "ar-c01", title: "增强现实 · How To: Augmented Reality App Tutorial for Beginners with Vuforia and Unity 3D", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「Augmented Reality」，站内章节 id ar-c01），原文语言 C#，原文链接 https://www.youtube.com/watch?v=uXNjNcqW4kY（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「Augmented Reality」，站内章节 id ar-c01），原文语言 C#，原文链接 https://www.youtube.com/watch?v=uXNjNcqW4kY（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "ar-c02", title: "增强现实 · How To Unity ARCore", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 2 篇（类目「Augmented Reality」，站内章节 id ar-c02），原文语言 C#，原文链接 https://www.youtube.com/playlist?list=PLKIKuXdn4ZMjuUAtdQfK1vwTZPQn_rgSv（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 2 篇（类目「Augmented Reality」，站内章节 id ar-c02），原文语言 C#，原文链接 https://www.youtube.com/playlist?list=PLKIKuXdn4ZMjuUAtdQfK1vwTZPQn_rgSv（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "ar-c03", title: "增强现实 · AR Portal Tutorial with Unity", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 3 篇（类目「Augmented Reality」，站内章节 id ar-c03），原文语言 C#，原文链接 https://www.youtube.com/playlist?list=PLPCqNOwwN794Gz5fzUSi1p4OqLU0HTmvn（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 3 篇（类目「Augmented Reality」，站内章节 id ar-c03），原文语言 C#，原文链接 https://www.youtube.com/playlist?list=PLPCqNOwwN794Gz5fzUSi1p4OqLU0HTmvn（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "ar-c04", title: "增强现实 · How to create a Dragon in Augmented Reality in Unity ARCore", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 4 篇（类目「Augmented Reality」，站内章节 id ar-c04），原文语言 C#，原文链接 https://www.youtube.com/watch?v=qTSDPkPyPqs（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 4 篇（类目「Augmented Reality」，站内章节 id ar-c04），原文语言 C#，原文链接 https://www.youtube.com/watch?v=qTSDPkPyPqs（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "ar-c05", title: "增强现实 · How to Augmented Reality AR Tutorial: ARKit Portal to the Upside Down", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 5 篇（类目「Augmented Reality」，站内章节 id ar-c05），原文语言 C#，原文链接 https://www.youtube.com/watch?v=Z5AmqMuNi08（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 5 篇（类目「Augmented Reality」，站内章节 id ar-c05），原文语言 C#，原文链接 https://www.youtube.com/watch?v=Z5AmqMuNi08（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "ar-c06", title: "增强现实 · Augmented Reality with Python and OpenCV", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 6 篇（类目「Augmented Reality」，站内章节 id ar-c06），原文语言 Python，原文链接 https://bitesofcode.wordpress.com/2017/09/12/augmented-reality-with-python-and-opencv-part-1/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 6 篇（类目「Augmented Reality」，站内章节 id ar-c06），原文语言 Python，原文链接 https://bitesofcode.wordpress.com/2017/09/12/augmented-reality-with-python-and-opencv-part-1/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "Augmented Reality", papers: [
            { cid: "ar-c01", kind: "paper", title: "增强现实 第 1 篇考试 · How To: Augmented Reality App Tutorial for Beginners with Vuforia and Unity 3D", pass: 60, questions: [], explain: [] },
            { cid: "ar-c02", kind: "paper", title: "增强现实 第 2 篇考试 · How To Unity ARCore", pass: 60, questions: [], explain: [] },
            { cid: "ar-c03", kind: "paper", title: "增强现实 第 3 篇考试 · AR Portal Tutorial with Unity", pass: 60, questions: [], explain: [] },
            { cid: "ar-c04", kind: "paper", title: "增强现实 第 4 篇考试 · How to create a Dragon in Augmented Reality in Unity ARCore", pass: 60, questions: [], explain: [] },
            { cid: "ar-c05", kind: "paper", title: "增强现实 第 5 篇考试 · How to Augmented Reality AR Tutorial: ARKit Portal to the Upside Down", pass: 60, questions: [], explain: [] },
            { cid: "ar-c06", kind: "paper", title: "增强现实 第 6 篇考试 · Augmented Reality with Python and OpenCV", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "docker",
          title: "从零实现一个 Docker（build-your-own-x 6 篇全做）",
          intro: "这一类要你自己造容器运行时：用 namespace 做隔离、cgroup 做限额、chroot/pivot_root 换根文件系统，再实现镜像分层与联合挂载，亲手 run 出一个“容器”。清单来自 build-your-own-x。",
          cat: "linux",
          diff: "掌握",
          tags: ["Go", "Python", "C", "namespace", "cgroup", "容器", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-docker.svg",
          chapters: [
            { id: "docker-c01", title: "Docker 容器 · Linux containers in 500 lines of code", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「Docker」，站内章节 id docker-c01），原文语言 C，原文链接 https://blog.lizzie.io/linux-containers-in-500-loc.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「Docker」，站内章节 id docker-c01），原文语言 C，原文链接 https://blog.lizzie.io/linux-containers-in-500-loc.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "docker-c02", title: "Docker 容器 · Build Your Own Container Using Less than 100 Lines of Go", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 2 篇（类目「Docker」，站内章节 id docker-c02），原文语言 Go，原文链接 https://www.infoq.com/articles/build-a-container-golang" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 2 篇（类目「Docker」，站内章节 id docker-c02），原文语言 Go，原文链接 https://www.infoq.com/articles/build-a-container-golang。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "docker-c03", title: "Docker 容器 · Building a container from scratch in Go", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 3 篇（类目「Docker」，站内章节 id docker-c03），原文语言 Go，原文链接 https://www.youtube.com/watch?v=8fi7uSYlOdc（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 3 篇（类目「Docker」，站内章节 id docker-c03），原文语言 Go，原文链接 https://www.youtube.com/watch?v=8fi7uSYlOdc（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "docker-c04", title: "Docker 容器 · A workshop on Linux containers: Rebuild Docker from Scratch", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 4 篇（类目「Docker」，站内章节 id docker-c04），原文语言 Python，原文链接 https://github.com/Fewbytes/rubber-docker" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 4 篇（类目「Docker」，站内章节 id docker-c04），原文语言 Python，原文链接 https://github.com/Fewbytes/rubber-docker。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "docker-c05", title: "Docker 容器 · A proof-of-concept imitation of Docker, written in 100% Python", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 5 篇（类目「Docker」，站内章节 id docker-c05），原文语言 Python，原文链接 https://github.com/tonybaloney/mocker" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 5 篇（类目「Docker」，站内章节 id docker-c05），原文语言 Python，原文链接 https://github.com/tonybaloney/mocker。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "docker-c06", title: "Docker 容器 · Docker implemented in around 100 lines of bash", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 6 篇（类目「Docker」，站内章节 id docker-c06），原文语言 Shell，原文链接 https://github.com/p8952/bocker" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 6 篇（类目「Docker」，站内章节 id docker-c06），原文语言 Shell，原文链接 https://github.com/p8952/bocker。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "Docker", papers: [
            { cid: "docker-c01", kind: "paper", title: "Docker 容器 第 1 篇考试 · Linux containers in 500 lines of code", pass: 60, questions: [], explain: [] },
            { cid: "docker-c02", kind: "paper", title: "Docker 容器 第 2 篇考试 · Build Your Own Container Using Less than 100 Lines of Go", pass: 60, questions: [], explain: [] },
            { cid: "docker-c03", kind: "paper", title: "Docker 容器 第 3 篇考试 · Building a container from scratch in Go", pass: 60, questions: [], explain: [] },
            { cid: "docker-c04", kind: "paper", title: "Docker 容器 第 4 篇考试 · A workshop on Linux containers: Rebuild Docker from Scratch", pass: 60, questions: [], explain: [] },
            { cid: "docker-c05", kind: "paper", title: "Docker 容器 第 5 篇考试 · A proof-of-concept imitation of Docker, written in 100% Python", pass: 60, questions: [], explain: [] },
            { cid: "docker-c06", kind: "paper", title: "Docker 容器 第 6 篇考试 · Docker implemented in around 100 lines of bash", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "search",
          title: "从零做一个搜索引擎（build-your-own-x 6 篇全做）",
          intro: "这一类要你自己造搜索：爬虫抓页面、去重、分词建倒排索引，再做 TF-IDF/BM25 打分、PageRank 与结果高亮，最后给出一个能输关键词的搜索框。清单来自 build-your-own-x。",
          cat: "算法",
          diff: "掌握",
          tags: ["Python", "CSS", "爬虫", "倒排索引", "排序", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-search.svg",
          chapters: [
            { id: "search-c01", title: "搜索引擎 · A search engine in CSS", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「Search Engine」，站内章节 id search-c01），原文语言 CSS，原文链接 https://stories.algolia.com/a-search-engine-in-css-b5ec4e902e97" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「Search Engine」，站内章节 id search-c01），原文语言 CSS，原文链接 https://stories.algolia.com/a-search-engine-in-css-b5ec4e902e97。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "search-c02", title: "搜索引擎 · Building a search engine using Redis and redis-py", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 2 篇（类目「Search Engine」，站内章节 id search-c02），原文语言 Python，原文链接 http://www.dr-josiah.com/2010/07/building-search-engine-using-redis-and.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 2 篇（类目「Search Engine」，站内章节 id search-c02），原文语言 Python，原文链接 http://www.dr-josiah.com/2010/07/building-search-engine-using-redis-and.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "search-c03", title: "搜索引擎 · Building a Vector Space Indexing Engine in Python", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 3 篇（类目「Search Engine」，站内章节 id search-c03），原文语言 Python，原文链接 https://boyter.org/2010/08/build-vector-space-search-engine-python/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 3 篇（类目「Search Engine」，站内章节 id search-c03），原文语言 Python，原文链接 https://boyter.org/2010/08/build-vector-space-search-engine-python/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "search-c04", title: "搜索引擎 · Building A Python-Based Search Engine", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 4 篇（类目「Search Engine」，站内章节 id search-c04），原文语言 Python，原文链接 https://www.youtube.com/watch?v=cY7pE7vX6MU（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 4 篇（类目「Search Engine」，站内章节 id search-c04），原文语言 Python，原文链接 https://www.youtube.com/watch?v=cY7pE7vX6MU（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "search-c05", title: "搜索引擎 · Making text search learn from feedback", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 5 篇（类目「Search Engine」，站内章节 id search-c05），原文语言 Python，原文链接 https://medium.com/filament-ai/making-text-search-learn-from-feedback-4fe210fd87b0" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 5 篇（类目「Search Engine」，站内章节 id search-c05），原文语言 Python，原文链接 https://medium.com/filament-ai/making-text-search-learn-from-feedback-4fe210fd87b0。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "search-c06", title: "搜索引擎 · Finding Important Words in Text Using TF-IDF", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 6 篇（类目「Search Engine」，站内章节 id search-c06），原文语言 Python，原文链接 https://stevenloria.com/tf-idf/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 6 篇（类目「Search Engine」，站内章节 id search-c06），原文语言 Python，原文链接 https://stevenloria.com/tf-idf/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "Search Engine", papers: [
            { cid: "search-c01", kind: "paper", title: "搜索引擎 第 1 篇考试 · A search engine in CSS", pass: 60, questions: [], explain: [] },
            { cid: "search-c02", kind: "paper", title: "搜索引擎 第 2 篇考试 · Building a search engine using Redis and redis-py", pass: 60, questions: [], explain: [] },
            { cid: "search-c03", kind: "paper", title: "搜索引擎 第 3 篇考试 · Building a Vector Space Indexing Engine in Python", pass: 60, questions: [], explain: [] },
            { cid: "search-c04", kind: "paper", title: "搜索引擎 第 4 篇考试 · Building A Python-Based Search Engine", pass: 60, questions: [], explain: [] },
            { cid: "search-c05", kind: "paper", title: "搜索引擎 第 5 篇考试 · Making text search learn from feedback", pass: 60, questions: [], explain: [] },
            { cid: "search-c06", kind: "paper", title: "搜索引擎 第 6 篇考试 · Finding Important Words in Text Using TF-IDF", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "editor",
          title: "从零写一个文本编辑器（build-your-own-x 6 篇全做）",
          intro: "这一类要你自己造编辑器：终端原始模式、光标行列状态机、逐行渲染、按键映射与撤销栈，做一个能改文件能存盘的模态编辑器。清单来自 build-your-own-x。",
          cat: "vs code",
          diff: "入门",
          tags: ["Python", "C", "C++", "终端 UI", "光标", "缓冲区", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-editor.svg",
          chapters: [
            { id: "editor-c01", title: "文本编辑器 · Build Your Own Text Editor", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「Text Editor」，站内章节 id editor-c01），原文语言 C，原文链接 https://viewsourcecode.org/snaptoken/kilo/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「Text Editor」，站内章节 id editor-c01），原文语言 C，原文链接 https://viewsourcecode.org/snaptoken/kilo/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "editor-c02", title: "文本编辑器 · Designing a Simple Text Editor", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 2 篇（类目「Text Editor」，站内章节 id editor-c02），原文语言 C++，原文链接 http://www.fltk.org/doc-1.1/editor.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 2 篇（类目「Text Editor」，站内章节 id editor-c02），原文语言 C++，原文链接 http://www.fltk.org/doc-1.1/editor.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "editor-c03", title: "文本编辑器 · Python Tutorial: Make Your Own Text Editor", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 3 篇（类目「Text Editor」，站内章节 id editor-c03），原文语言 Python，原文链接 https://www.youtube.com/watch?v=xqDonHEYPgA（README 标注为视频教程）" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 3 篇（类目「Text Editor」，站内章节 id editor-c03），原文语言 Python，原文链接 https://www.youtube.com/watch?v=xqDonHEYPgA（README 标注为视频教程）。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "editor-c04", title: "文本编辑器 · Create a Simple Python Text Editor!", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 4 篇（类目「Text Editor」，站内章节 id editor-c04），原文语言 Python，原文链接 http://www.instructables.com/id/Create-a-Simple-Python-Text-Editor/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 4 篇（类目「Text Editor」，站内章节 id editor-c04），原文语言 Python，原文链接 http://www.instructables.com/id/Create-a-Simple-Python-Text-Editor/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "editor-c05", title: "文本编辑器 · Build a Collaborative Text Editor Using Rails", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 5 篇（类目「Text Editor」，站内章节 id editor-c05），原文语言 Ruby，原文链接 https://blog.aha.io/text-editor/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 5 篇（类目「Text Editor」，站内章节 id editor-c05），原文语言 Ruby，原文链接 https://blog.aha.io/text-editor/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "editor-c06", title: "文本编辑器 · Hecto: Build your own text editor in Rust", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 6 篇（类目「Text Editor」，站内章节 id editor-c06），原文语言 Rust，原文链接 https://www.flenker.blog/hecto/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 6 篇（类目「Text Editor」，站内章节 id editor-c06），原文语言 Rust，原文链接 https://www.flenker.blog/hecto/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "Text Editor", papers: [
            { cid: "editor-c01", kind: "paper", title: "文本编辑器 第 1 篇考试 · Build Your Own Text Editor", pass: 60, questions: [], explain: [] },
            { cid: "editor-c02", kind: "paper", title: "文本编辑器 第 2 篇考试 · Designing a Simple Text Editor", pass: 60, questions: [], explain: [] },
            { cid: "editor-c03", kind: "paper", title: "文本编辑器 第 3 篇考试 · Python Tutorial: Make Your Own Text Editor", pass: 60, questions: [], explain: [] },
            { cid: "editor-c04", kind: "paper", title: "文本编辑器 第 4 篇考试 · Create a Simple Python Text Editor!", pass: 60, questions: [], explain: [] },
            { cid: "editor-c05", kind: "paper", title: "文本编辑器 第 5 篇考试 · Build a Collaborative Text Editor Using Rails", pass: 60, questions: [], explain: [] },
            { cid: "editor-c06", kind: "paper", title: "文本编辑器 第 6 篇考试 · Hecto: Build your own text editor in Rust", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "bt",
          title: "从零实现 BitTorrent 客户端（build-your-own-x 5 篇全做）",
          intro: "这一类要你自己造下载器：解析 .torrent 的 bencode、向 tracker 要 peer、和 peer 握手交换 bitfield，按 tit-for-tat 策略取 piece 并用哈希校验写盘。清单来自 build-your-own-x。",
          cat: "计算机基础",
          diff: "掌握",
          tags: ["C#", "Go", "Nim", "P2P", "协议", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-bt.svg",
          chapters: [
            { id: "bt-c01", title: "BitTorrent 客户端 · Building a BitTorrent client from scratch in C#", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「BitTorrent Client」，站内章节 id bt-c01），原文语言 C#，原文链接 https://www.seanjoflynn.com/research/bittorrent.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「BitTorrent Client」，站内章节 id bt-c01），原文语言 C#，原文链接 https://www.seanjoflynn.com/research/bittorrent.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "bt-c02", title: "BitTorrent 客户端 · Building a BitTorrent client from the ground up in Go", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 2 篇（类目「BitTorrent Client」，站内章节 id bt-c02），原文语言 Go，原文链接 https://blog.jse.li/posts/torrent/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 2 篇（类目「BitTorrent Client」，站内章节 id bt-c02），原文语言 Go，原文链接 https://blog.jse.li/posts/torrent/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "bt-c03", title: "BitTorrent 客户端 · Writing a Bencode Parser", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 3 篇（类目「BitTorrent Client」，站内章节 id bt-c03），原文语言 Nim，原文链接 https://xmonader.github.io/nimdays/day02_bencode.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 3 篇（类目「BitTorrent Client」，站内章节 id bt-c03），原文语言 Nim，原文链接 https://xmonader.github.io/nimdays/day02_bencode.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "bt-c04", title: "BitTorrent 客户端 · Write your own bittorrent client", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 4 篇（类目「BitTorrent Client」，站内章节 id bt-c04），原文语言 Node.js，原文链接 https://allenkim67.github.io/programming/2016/05/04/how-to-make-your-own-bittorrent-client.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 4 篇（类目「BitTorrent Client」，站内章节 id bt-c04），原文语言 Node.js，原文链接 https://allenkim67.github.io/programming/2016/05/04/how-to-make-your-own-bittorrent-client.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "bt-c05", title: "BitTorrent 客户端 · A BitTorrent client in Python 3.5", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 5 篇（类目「BitTorrent Client」，站内章节 id bt-c05），原文语言 Python，原文链接 http://markuseliasson.se/article/bittorrent-in-python/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 5 篇（类目「BitTorrent Client」，站内章节 id bt-c05），原文语言 Python，原文链接 http://markuseliasson.se/article/bittorrent-in-python/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "BitTorrent Client", papers: [
            { cid: "bt-c01", kind: "paper", title: "BitTorrent 客户端 第 1 篇考试 · Building a BitTorrent client from scratch in C#", pass: 60, questions: [], explain: [] },
            { cid: "bt-c02", kind: "paper", title: "BitTorrent 客户端 第 2 篇考试 · Building a BitTorrent client from the ground up in Go", pass: 60, questions: [], explain: [] },
            { cid: "bt-c03", kind: "paper", title: "BitTorrent 客户端 第 3 篇考试 · Writing a Bencode Parser", pass: 60, questions: [], explain: [] },
            { cid: "bt-c04", kind: "paper", title: "BitTorrent 客户端 第 4 篇考试 · Write your own bittorrent client", pass: 60, questions: [], explain: [] },
            { cid: "bt-c05", kind: "paper", title: "BitTorrent 客户端 第 5 篇考试 · A BitTorrent client in Python 3.5", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "tpl",
          title: "从零实现一个模板引擎（build-your-own-x 5 篇全做）",
          intro: "这一类要你自己造模板引擎：把带占位符与循环判断的模板扫成 token、搭成 AST，再用数据渲染出 HTML，顺手做转义和错误定位。清单来自 build-your-own-x。",
          cat: "算法",
          diff: "入门",
          tags: ["JavaScript", "Python", "Ruby", "解析", "HTML", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-tpl.svg",
          chapters: [
            { id: "tpl-c01", title: "模板引擎 · JavaScript template engine in just 20 lines", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「Template Engine」，站内章节 id tpl-c01），原文语言 JavaScript，原文链接 http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「Template Engine」，站内章节 id tpl-c01），原文语言 JavaScript，原文链接 http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "tpl-c02", title: "模板引擎 · Understanding JavaScript Micro-Templating", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 2 篇（类目「Template Engine」，站内章节 id tpl-c02），原文语言 JavaScript，原文链接 https://medium.com/wdstack/understanding-javascript-micro-templating-f37a37b3b40e" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 2 篇（类目「Template Engine」，站内章节 id tpl-c02），原文语言 JavaScript，原文链接 https://medium.com/wdstack/understanding-javascript-micro-templating-f37a37b3b40e。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "tpl-c03", title: "模板引擎 · Approach: Building a toy template engine in Python", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 3 篇（类目「Template Engine」，站内章节 id tpl-c03），原文语言 Python，原文链接 http://alexmic.net/building-a-template-engine/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 3 篇（类目「Template Engine」，站内章节 id tpl-c03），原文语言 Python，原文链接 http://alexmic.net/building-a-template-engine/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "tpl-c04", title: "模板引擎 · A Template Engine", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 4 篇（类目「Template Engine」，站内章节 id tpl-c04），原文语言 Python，原文链接 http://aosabook.org/en/500L/a-template-engine.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 4 篇（类目「Template Engine」，站内章节 id tpl-c04），原文语言 Python，原文链接 http://aosabook.org/en/500L/a-template-engine.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "tpl-c05", title: "模板引擎 · How to write a template engine in less than 30 lines of code", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 5 篇（类目「Template Engine」，站内章节 id tpl-c05），原文语言 Ruby，原文链接 http://bits.citrusbyte.com/how-to-write-a-template-library/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 5 篇（类目「Template Engine」，站内章节 id tpl-c05），原文语言 Ruby，原文链接 http://bits.citrusbyte.com/how-to-write-a-template-library/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "Template Engine", papers: [
            { cid: "tpl-c01", kind: "paper", title: "模板引擎 第 1 篇考试 · JavaScript template engine in just 20 lines", pass: 60, questions: [], explain: [] },
            { cid: "tpl-c02", kind: "paper", title: "模板引擎 第 2 篇考试 · Understanding JavaScript Micro-Templating", pass: 60, questions: [], explain: [] },
            { cid: "tpl-c03", kind: "paper", title: "模板引擎 第 3 篇考试 · Approach: Building a toy template engine in Python", pass: 60, questions: [], explain: [] },
            { cid: "tpl-c04", kind: "paper", title: "模板引擎 第 4 篇考试 · A Template Engine", pass: 60, questions: [], explain: [] },
            { cid: "tpl-c05", kind: "paper", title: "模板引擎 第 5 篇考试 · How to write a template engine in less than 30 lines of code", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "net",
          title: "从零实现一个网络协议栈（build-your-own-x 4 篇全做）",
          intro: "这一类要你自己造协议栈：从以太网帧与 ARP 开始，实现 IPv4 分片重组、ICMP、UDP 与 TCP 状态机、滑动窗口和重传，最后真能 ping 通、抓到页面。清单来自 build-your-own-x。",
          cat: "计算机基础",
          diff: "精通",
          tags: ["C", "Python", "Ruby", "TCP/IP", "以太网", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-net.svg",
          chapters: [
            { id: "net-c01", title: "网络协议栈 · Beej's Guide to Network Programming", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「Network Stack」，站内章节 id net-c01），原文语言 C，原文链接 http://beej.us/guide/bgnet/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「Network Stack」，站内章节 id net-c01），原文语言 C，原文链接 http://beej.us/guide/bgnet/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "net-c02", title: "网络协议栈 · Let's code a TCP/IP stack", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 2 篇（类目「Network Stack」，站内章节 id net-c02），原文语言 C，原文链接 http://www.saminiir.com/lets-code-tcp-ip-stack-1-ethernet-arp/" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 2 篇（类目「Network Stack」，站内章节 id net-c02），原文语言 C，原文链接 http://www.saminiir.com/lets-code-tcp-ip-stack-1-ethernet-arp/。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "net-c03", title: "网络协议栈 · Build your own VPN/Virtual Switch", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 3 篇（类目「Network Stack」，站内章节 id net-c03），原文语言 C / Python，原文链接 https://github.com/peiyuanix/build-your-own-zerotier" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 3 篇（类目「Network Stack」，站内章节 id net-c03），原文语言 C / Python，原文链接 https://github.com/peiyuanix/build-your-own-zerotier。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "net-c04", title: "网络协议栈 · How to build a network stack in Ruby", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 4 篇（类目「Network Stack」，站内章节 id net-c04），原文语言 Ruby，原文链接 https://medium.com/geckoboard-under-the-hood/how-to-build-a-network-stack-in-ruby-f73aeb1b661b" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 4 篇（类目「Network Stack」，站内章节 id net-c04），原文语言 Ruby，原文链接 https://medium.com/geckoboard-under-the-hood/how-to-build-a-network-stack-in-ruby-f73aeb1b661b。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "Network Stack", papers: [
            { cid: "net-c01", kind: "paper", title: "网络协议栈 第 1 篇考试 · Beej's Guide to Network Programming", pass: 60, questions: [], explain: [] },
            { cid: "net-c02", kind: "paper", title: "网络协议栈 第 2 篇考试 · Let's code a TCP/IP stack", pass: 60, questions: [], explain: [] },
            { cid: "net-c03", kind: "paper", title: "网络协议栈 第 3 篇考试 · Build your own VPN/Virtual Switch", pass: 60, questions: [], explain: [] },
            { cid: "net-c04", kind: "paper", title: "网络协议栈 第 4 篇考试 · How to build a network stack in Ruby", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "aimodel",
          title: "从零训一个 AI 大模型（build-your-own-x 3 篇全做）",
          intro: "这一类要你自己造大模型：分词器、词嵌入、自注意力与多头、前馈层、残差连接，把 Transformer 一层层搭起来，再预训练、微调、量化并跑推理。清单来自 build-your-own-x。",
          cat: "大模型",
          diff: "掌握",
          tags: ["Python", "Transformer", "训练", "推理", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-aimodel.svg",
          chapters: [
            { id: "aimodel-c01", title: "AI 大模型 · A Large Language Model (LLM)", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「AI Model」，站内章节 id aimodel-c01），原文语言 Python，原文链接 https://github.com/rasbt/LLMs-from-scratch" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「AI Model」，站内章节 id aimodel-c01），原文语言 Python，原文链接 https://github.com/rasbt/LLMs-from-scratch。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "aimodel-c02", title: "AI 大模型 · Diffusion Models for Image Generation", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 2 篇（类目「AI Model」，站内章节 id aimodel-c02），原文语言 Python，原文链接 https://huggingface.co/learn/diffusion-course/en/unit1/3" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 2 篇（类目「AI Model」，站内章节 id aimodel-c02），原文语言 Python，原文链接 https://huggingface.co/learn/diffusion-course/en/unit1/3。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "aimodel-c03", title: "AI 大模型 · RAG for Document Search", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 3 篇（类目「AI Model」，站内章节 id aimodel-c03），原文语言 Python，原文链接 https://github.com/langchain-ai/rag-from-scratch" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 3 篇（类目「AI Model」，站内章节 id aimodel-c03），原文语言 Python，原文链接 https://github.com/langchain-ai/rag-from-scratch。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "AI Model", papers: [
            { cid: "aimodel-c01", kind: "paper", title: "AI 大模型 第 1 篇考试 · A Large Language Model (LLM)", pass: 60, questions: [], explain: [] },
            { cid: "aimodel-c02", kind: "paper", title: "AI 大模型 第 2 篇考试 · Diffusion Models for Image Generation", pass: 60, questions: [], explain: [] },
            { cid: "aimodel-c03", kind: "paper", title: "AI 大模型 第 3 篇考试 · RAG for Document Search", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "vision",
          title: "从零做一个视觉识别系统（build-your-own-x 2 篇全做）",
          intro: "这一类要你自己造会认东西的系统：图像预处理、边缘与角点、特征描述与匹配、分类或检测模型，再连上摄像头做实时识别与跟踪。清单来自 build-your-own-x。",
          cat: "计算机基础",
          diff: "掌握",
          tags: ["Python", "图像处理", "特征匹配", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-vision.svg",
          chapters: [
            { id: "vision-c01", title: "视觉识别系统 · Developing a License Plate Recognition System with Machine Learning in Python", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「Visual Recognition System」，站内章节 id vision-c01），原文语言 Python，原文链接 https://medium.com/devcenter/developing-a-license-plate-recognition-system-with-machine-learning-in-python-787833569ccd" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「Visual Recognition System」，站内章节 id vision-c01），原文语言 Python，原文链接 https://medium.com/devcenter/developing-a-license-plate-recognition-system-with-machine-learning-in-python-787833569ccd。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "vision-c02", title: "视觉识别系统 · Building a Facial Recognition Pipeline with Deep Learning in Tensorflow", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 2 篇（类目「Visual Recognition System」，站内章节 id vision-c02），原文语言 Python，原文链接 https://hackernoon.com/building-a-facial-recognition-pipeline-with-deep-learning-in-tensorflow-66e7645015b8" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 2 篇（类目「Visual Recognition System」，站内章节 id vision-c02），原文语言 Python，原文链接 https://hackernoon.com/building-a-facial-recognition-pipeline-with-deep-learning-in-tensorflow-66e7645015b8。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "Visual Recognition System", papers: [
            { cid: "vision-c01", kind: "paper", title: "视觉识别系统 第 1 篇考试 · Developing a License Plate Recognition System with Machine Learning in Python", pass: 60, questions: [], explain: [] },
            { cid: "vision-c02", kind: "paper", title: "视觉识别系统 第 2 篇考试 · Building a Facial Recognition Pipeline with Deep Learning in Tensorflow", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "browser",
          title: "从零写一个 Web 浏览器（build-your-own-x 2 篇全做）",
          intro: "这一类要你自己造浏览器：HTML 解析成 DOM、CSS 选择器与级联、布局树算盒模型、绘制成显示列表再合成上屏，中间还要网络层和 JS 执行。清单来自 build-your-own-x。",
          cat: "计算机基础",
          diff: "精通",
          tags: ["Python", "Rust", "渲染管线", "HTML", "CSS", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-browser.svg",
          chapters: [
            { id: "browser-c01", title: "Web 浏览器 · Let's build a browser engine", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「Web Browser」，站内章节 id browser-c01），原文语言 Rust，原文链接 https://limpet.net/mbrubeck/2014/08/08/toy-layout-engine-1.html" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「Web Browser」，站内章节 id browser-c01），原文语言 Rust，原文链接 https://limpet.net/mbrubeck/2014/08/08/toy-layout-engine-1.html。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             },
            { id: "browser-c02", title: "Web 浏览器 · Browser Engineering", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 2 篇（类目「Web Browser」，站内章节 id browser-c02），原文语言 Python，原文链接 https://browser.engineering" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 2 篇（类目「Web Browser」，站内章节 id browser-c02），原文语言 Python，原文链接 https://browser.engineering。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "Web Browser", papers: [
            { cid: "browser-c01", kind: "paper", title: "Web 浏览器 第 1 篇考试 · Let's build a browser engine", pass: 60, questions: [], explain: [] },
            { cid: "browser-c02", kind: "paper", title: "Web 浏览器 第 2 篇考试 · Browser Engineering", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "dist",
          title: "从零搭一套分布式系统（build-your-own-x 1 篇全做）",
          intro: "这一类要你自己造分布式的一套：RPC、节点发现、复制日志、Raft 共识、快照与成员变更，最后落成一个能容忍节点挂掉的分布式 KV。清单来自 build-your-own-x。",
          cat: "计算机基础",
          diff: "精通",
          tags: ["Java", "共识", "复制", "容错", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-dist.svg",
          chapters: [
            { id: "dist-c01", title: "分布式系统 · Building Your Own Kafka-like System From Scratch: A Step-by-Step Guide", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「Distributed Systems」，站内章节 id dist-c01），原文语言 Java，原文链接 https://github.com/buildthingsuseful/build-your-own-kafka" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「Distributed Systems」，站内章节 id dist-c01），原文语言 Java，原文链接 https://github.com/buildthingsuseful/build-your-own-kafka。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "Distributed Systems", papers: [
            { cid: "dist-c01", kind: "paper", title: "分布式系统 第 1 篇考试 · Building Your Own Kafka-like System From Scratch: A Step-by-Step Guide", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "alloc",
          title: "从零实现内存分配器（build-your-own-x 1 篇全做）",
          intro: "这一类要你自己造 malloc/free：向操作系统要堆页、维护空闲链表与分箱、块的拆分合并与碎片处理，再加上标记整理式的回收。清单来自 build-your-own-x。",
          cat: "计算机基础",
          diff: "精通",
          tags: ["C", "堆管理", "malloc", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-alloc.svg",
          chapters: [
            { id: "alloc-c01", title: "内存分配器 · Malloc is not magic -- Implementing your own memory allocator", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「Memory Allocator」，站内章节 id alloc-c01），原文语言 C，原文链接 https://medium.com/p/e0354e914402" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「Memory Allocator」，站内章节 id alloc-c01），原文语言 C，原文链接 https://medium.com/p/e0354e914402。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "Memory Allocator", papers: [
            { cid: "alloc-c01", kind: "paper", title: "内存分配器 第 1 篇考试 · Malloc is not magic -- Implementing your own memory allocator", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "cpu",
          title: "从零造一颗处理器（build-your-own-x 1 篇全做）",
          intro: "这一类要你自己造 CPU：从与非门和触发器起步，定义指令集、搭数据通路与控制逻辑、做流水线和冒险处理，最后用 Verilog 在 FPGA 上跑起自己写的程序。清单来自 build-your-own-x。",
          cat: "计算机基础",
          diff: "精通",
          tags: ["Verilog", "数字逻辑", "指令集", "流水线", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-cpu.svg",
          chapters: [
            { id: "cpu-c01", title: "处理器 · From Blinker to RISC-V", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「Processor」，站内章节 id cpu-c01），原文语言 Verilog，原文链接 https://github.com/BrunoLevy/learn-fpga/tree/master/FemtoRV/TUTORIALS/FROM_BLINKER_TO_RISCV" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「Processor」，站内章节 id cpu-c01），原文语言 Verilog，原文链接 https://github.com/BrunoLevy/learn-fpga/tree/master/FemtoRV/TUTORIALS/FROM_BLINKER_TO_RISCV。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "Processor", papers: [
            { cid: "cpu-c01", kind: "paper", title: "处理器 第 1 篇考试 · From Blinker to RISC-V", pass: 60, questions: [], explain: [] }
          ]
         }
      },
      {
        tutorial: {
          id: "voxel",
          title: "从零做一个体素引擎（build-your-own-x 1 篇全做）",
          intro: "这一类要你自己造体素世界：体素数据的存取与区块划分、面剔除与贪婪合并生成网格、光照传播，再加地形生成与流体模拟。那类方块游戏的底座就是它。清单来自 build-your-own-x。",
          cat: "计算机基础",
          diff: "掌握",
          tags: ["C++", "体素", "网格生成", "区块", "build-your-own-x"],
          author: "喵站官方",
          cover: "/assets/img/covers/byox-voxel.svg",
          chapters: [
            { id: "voxel-c01", title: "体素引擎 · Let's Make a Voxel Engine", blocks: [
                { t: "tip", text: "本篇待写：这是 build-your-own-x 的第 1 篇（类目「Voxel Engine」，站内章节 id voxel-c01），原文语言 C++，原文链接 https://sites.google.com/site/letsmakeavoxelengine/home" },
                { t: "p", text: "这一章正文还没写。这是 build-your-own-x 的第 1 篇（类目「Voxel Engine」，站内章节 id voxel-c01），原文语言 C++，原文链接 https://sites.google.com/site/letsmakeavoxelengine/home。喵站的写法是原创中文导读：这一篇要造什么、部件拆解、任务清单、课末考试；正文与考卷由后续批次（任务书 T-15）填，本骨架先把标题、任务位和考试位占好。原文正文不搬运，回源阅读请点上面的链接。" }
              ]
             }
          ]
        },
        examScaffold: { kind: "paper", pass: 60, rule: "每章一份笔试卷；权重和必须 = 100，通过线 60；字段与题型见 dev/任务书.md §11.6.4", cat: "Voxel Engine", papers: [
            { cid: "voxel-c01", kind: "paper", title: "体素引擎 第 1 篇考试 · Let's Make a Voxel Engine", pass: 60, questions: [], explain: [] }
          ]
         }
      }
    ];

  root.MIAO_BYOX = PACKS;
  /* 逐门再挂一个独立全局名，供 site.js 的 source 字段查（一份 source = 一门教程） */
  PACKS.forEach(function (p) {
    if (!p || !p.tutorial) return;
    root["MIAO_BYOX_" + String(p.tutorial.id).toUpperCase()] = p;
  });
})(typeof window !== "undefined" ? window : globalThis);
