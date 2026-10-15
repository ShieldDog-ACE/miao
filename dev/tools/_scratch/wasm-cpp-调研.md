# 把真编译搬进浏览器：C++ 考场可行性调研（2026-10-15）

一句话结论：**真编译在技术上是现成的（一个 MIT 包就能装下 clang 22 + libc++ 22 + wasi-libc，
`std::println` 实测能编能跑），但它要 28 MB 资源且必须走 `fetch` —— 与「双击 index.html 就能用」
正面冲突，且常驻内存 ~85 MB。建议接「笔试判分器不动 + 一个可选的『在线真跑』开关（默认关，
点了才从第三方 API 走，file:// 下自动隐藏）」，不接 WASM 编译器。**

## 站点现状（本次核对过的事实）

- 纯静态：`Dockerfile` 只跑 `nginx:1.27-alpine`，`location /api/ { return 404; }` —— 没有后端。
- 加载契约：`assets/js/data.js` 的 `loadJs()` 只用 `document.createElement("script")`，全站不 `fetch`；
  `site.js` 的 `engines` 表登记四套考场（`code`/`en`/`enword`/`paper`），`data.js:ensureExam()` 进考场
  只拉 `boot` + `examFiles` + `engineFiles`（SPEC.md §15.13「进考场只拉题包与引擎」）。
- C++ 现在是笔试：`exam-paper-ui.js:3` 写着「C++ 在浏览器里跑不动，213 场课末考试全走笔试」，
  判分口径见同文件 `termNote`（关键写法匹配，不计较空格缩进）。
- 体积基线：首屏 5 份脚本 176 KB（gzip 57 KB，`index.html` 注释）；整门课正文 3.6 MB、最大单片 67 KB（Dockerfile 注释）。
- 正文里的现代 C++ 用量（`assets/data/cpp/` + `cppm/` 实测 grep）：`std::println` 1080 处、`std::print` 151 处、
  `#include <print>` 413 处、`std::format` 19 处、`std::cout` 3 处、`<ranges>` 21 处、
  `{:?}`（C++26 调试格式）**0 处**、`<thread>/<filesystem>/std::async` **0 处**；编译命令示例 `-std=c++23`。
  **要覆盖的面很宽，但没有任何一条依赖多线程或文件系统 —— WASI 单线程沙箱够用。**

## 对照表

| 路线 | 体积（实测口径） | C++ 到哪 | `std::println` | file:// 双击可用 | 许可证 | 主要风险 |
|---|---|---|---|---|---|---|
| **① ClingWASM**（CERN/root-project 的 cling→WASM） | **不存在可下载产物**：GitLab `root-project/clingwasm` 404、GitLab 全局搜索返回 `[]`、GitHub `cling+wasm` 搜索 4 条全是无关的 `clingo`（答案集求解器）；root.cern 无 clingwasm 页（404） | cling 1.3（2026-02-11）跟不上 C++23 | 不可行：cling 靠 LLVM JIT 现场生成机器码（root.cern/cling 自述「uses just-in-time (JIT) compiler」），WASM 沙箱里没有 JIT | —— | LGPL-3.0+（cling 本体） | **这条是虚构的候选**，别按它做计划；来源 [root.cern/cling](https://root.cern/cling/)、[releases](https://api.github.com/repos/root-project/cling/releases) |
| **② `@petergyang/wasm-cpp`**（npm） | **包不存在**：registry 返回 `{"error":"Not found"}`；GitHub 用户 petergyang 14 个仓库里没有任何 wasm/clang/gcc 项目 | —— | —— | —— | —— | 记下来：这是个假名。真在浏览器里编 C++ 的 npm 包是 ③。来源 [registry](https://registry.npmjs.org/@petergyang%2Fwasm-cpp) |
| **③ `@live-codes/clang-wasm` 0.3.0**（真·浏览器内 clang） | npm `unpackedSize` **29,951,604 B（28.6 MB）**，tarball 29,217,895 B；内含 `bin/clang.wasm.gz` 15,721,977 B、`lld.wasm.gz` 7,837,837 B、`sysroot.tar.gz` 5,401,380 B、`memfs.wasm.gz` 38,702 B、免打包器 IIFE `dist/clang-wasm.global.js` 302,798 B；README 自述「28 MB compressed, about 85 MB unpacked and resident」 | clang **22.1.8**（`runtime-manifest.v1.json`：`llvmorg-22.1.8`，target `wasm32-wasi`/WASI preview1），下拉支持 `gnu++23`（严格 `-std=c++23` 需自己塞 `compileArgs`） | **可用**：sysroot 里就有 `include/c++/v1/print`（`_LIBCPP_STD_VER >= 23` 分支），libc++ `_LIBCPP_VERSION 220100`（我把 tarball 拆开核对过） | **不行**：README 明写「In a browser there is no filesystem… 运行时坚持 http(s)」，资源必须 `fetch` + 前端解压 | **MIT**（自带代码）+ Apache-2.0 WITH LLVM-exception（clang/lld/memfs/sysroot），全部宽松、无 copyleft | 28 MB ≈ 整门课正文的 8 倍、首屏的 165 倍；常驻 ~85 MB；**单实例锁**（README：runtime 不能并发，两次运行排队）；产物是 WASI wasm —— 好在正文 0 处用线程/文件系统（见上），`<iostream>/<print>/<format>/<ranges>` 都能过 |
| **④ `binji/wasm-clang`**（③的上游，可直接下载的裸产物） | 仓库 blobs 合计 **58.0 MB**：`clang` 29.77 MB、`lld` 18.59 MB、`sysroot.tar` 8.87 MB、`memfs` 0.33 MB（GitHub trees API 报的 size） | 2023 年的 LLVM 快照，C++20 稳、C++23 不保证 | 当时 libc++ 还没 `<print>`（libc++ 18 才有，见下节） | 同样要 `fetch`，不行 | **Apache-2.0**，341 star，最后 push 2023-12-07，**无 release** | 上游已停更；③是它的重打包（连 memfs 都自己改了：`MAX_NODES` 1024→4096 才装得下未裁剪的 libc++）。来源 [github.com/binji/wasm-clang](https://github.com/binji/wasm-clang) |
| **⑤ `clang-wasm` 20.1.3-c**（npm，容易误认的那一个） | `unpackedSize` **97,511 B**（只是 JS 包装，255 个文件里 9 个是包内容） | 版本串 20.1.3 = clang 20.1.3 | 不适用 | 不适用 | 未声明（`license` 字段为空，`LICENSE.TXT` 15,141 B 是 LLVM 的） | **假信号**：README 说「Binaries downloaded from releases.llvm.org」，`optionalDependencies` 是 `clang-linux-x64`/`clang-darwin-x64`/`clang-wasm-win64` 这些**原生** clang 可执行文件 —— 它是「在命令行里把 C++ 编成 wasm」的工具，不是「浏览器里编译」。来源 [registry](https://registry.npmjs.org/clang-wasm) |
| **⑥ Godbolt REST API**（服务端路线） | 0 字节进本站仓库（只有一个几十行的调用器） | 服务端 gcc **15.3** / clang **23.1.0**，trunk 已到 24.0.0git（`/api/compilers/c++` 返回 1205 个编译器） | **可用**，我用本站代码风格实测过（见下节） | **不破功**：`/api/*` 回 `access-control-allow-origin: *`，`OPTIONS` 预检允许 `POST` + `Content-Type`（响应头实测），file:// 的 `Origin: null` 与 `*` 按 CORS 规范相容 —— 但**浏览器实机那一下仍要 Chrome/Firefox/Edge 各点一次确认**，别当成已验 | 站点开源 Apache-2.0；API 无授权要求 | **在线才行**（离线/双击就退回没有真跑）；把判分交给第三方 = 与「判分在前端可被绕」同级但多一条外部依赖；他们文档写「目前没有速率限制，请求按交互式同规格排队」「将来可能要鉴权」，随时可能变；单次往返 2.5–6.8 s |
| **⑦ WASM 版 gcc** | 只有交叉编译器：`@horang-corp/avr-gcc-wasm` 0.2.0，`unpackedSize` **55,237,795 B（52.7 MB）**，其中 `tools/cc1plus.wasm` 13,844,490 B、`libgcc.a` 5,976,098 B | AVR gcc，无 hosted C++23 标准库（更没 `<print>`） | 不可行 | 不可行（同样 fetch 资源） | `license` 字段是 `SEE LICENSE IN THIRD_PARTY_NOTICES.md`，cc1plus 本体 GPL-3.0-with-GCC-exception | gcc→wasm 这条路只存在于嵌入式交叉编译场景；GPL 义务（源码要约）比 ③ 的 MIT 麻烦得多，且没有通用 host g++ 产物。来源 [registry](https://registry.npmjs.org/@horang-corp%2Favr-gcc-wasm) |
| **⑧ 整条 Emscripten 工具链搬进浏览器** | 没有现成产物：emscripten 的编译器是**原生** clang（emsdk 装完是本地二进制），仓库里不发布 browser-side clang；要做只能在浏览器里跑 ③/④ 那种 wasm clang，体积就是 ③ 的 28 MB / ④ 的 58 MB（**这一格是推断，非实测**：Docker Hub API 超时，没拿到 emsdk 镜像的 `full_size`） | emscripten **6.0.12**（2026-10-08 发布），ChangeLog 记 `libcxx/libcxxabi updated to LLVM 22.1.8 (#27428)` → 其 libc++ 有 `<print>`（**未实测**） | 理论上可用（同 ③，LLVM 22.1.8 口径一致） | 不行 | MIT（emscripten）+ LLVM 异常 | 把 emscripten 整体塞浏览器是伪需求：它解决的是「把 C++ 编成 wasm 给网页用」，不是「在网页里编译用户代码」。来源 [releases](https://github.com/emscripten-core/emscripten/releases)、[ChangeLog](https://raw.githubusercontent.com/emscripten-core/emscripten/main/ChangeLog.md) |

## `std::println` 的完成度（这条独立回答）

- **libc++：P2093R14「Formatted output」= Complete，First released version = 18**（表头逐项核对：
  `P2093R14 | Formatted output | 2022-07 (Virtual) | Complete | 18 | #105199`）→ 来源 [libcxx.llvm.org/Status/Cxx23.html](https://libcxx.llvm.org/Status/Cxx23.html)
- **libstdc++：`Formatted output P2093R14 → 14.1`，宏 `__cpp_lib_print >= 202207L`** → 来源 [gcc.gnu.org libstdc++ status](https://gcc.gnu.org/onlinedocs/libstdc++/manual/status.html)
  （同表 `<format>` P0645R10 = 13.1）
- 结论：**两大标准库都齐了**（clang 侧 18 起、gcc 侧 14.1 起），所以 ③ 那种 clang 22 的产物天然满足；
  真正的门槛不是 `<print>`，是**没有 libc++/libstdc++ 头树就一行都编不过** —— 这正是 ③ 的 `sysroot.tar.gz`（5.4 MB gz）在解决的。
- 一个坑：`{:?}`（调试格式，P2738，属 C++26）**在 C++23 下 gcc 15.3 与 clang 22.1 都编不过**（实测 `code -1 / "Build failed"`），
  出题别混用；`std::print`/`std::println` 与 `{}`、`{:.3f}` 都实测通过。

## 实测数字（godbolt 公开 API，无 key，2026-10-15 从本机 curl/python 直跑）

- 请求：`POST /api/compiler/g153/compile`，body 里 `filters.execute=true` + `compilerOptions.executorRequest=true`。
- 本站风格代码（`#include <print> <format> <vector> <string> <ranges>`，`auto` + range-for + `std::views::iota` + `std::println("bytes={} names={}", …)`），`-std=c++23 -O2`：
  - gcc 15.3：`code=0 didExecute=true`，输出正确，**往返 6.19 s（编译 5069 ms、执行 22 ms、排队 4 ms）**
  - clang 22.1 + `-stdlib=libc++`：`code=0 didExecute=true`，**往返 6.78 s（编译 5414 ms、执行 30 ms）**
  - 只有一行的 `std::println("hi {}", 42)`（gcc 15.3）：**往返 3.55 s（编译 2430 ms、执行 33 ms）** —— 冷启动主要花在编译，不是执行
- 响应里带服务端执行环境的硬限制：`defaultExecOptions.timeoutMs = 20000`、`maxErrorOutput = 5000`（5 KB 后截断），`instructionSet: "amd64"`、真实路径 `/opt/compiler-explorer/gcc-15.3.0/…` → **产物执行在服务端，不在浏览器**。
- 顺带回答「godbolt 自己怎么在浏览器里跑 clang」：**它不跑**。首页只加载 3 份 JS：`runtime.js` 2,329 B、`vendor.js` 12,389,385 B、`main.js` 881,341 B（`static.ce-cdn.net` 的 `content-length`，合计约 13.6 MB），里面没有任何 `clang.wasm`；编译与执行全部打到服务器（编译器列表里那个 `wasm32clang` 是「把 wasm 当目标平台」的服务端编译器）。

## 接不接：建议

1. **不接 ①②④⑤⑦⑧。** ①② 是查无此物（⑤⑦ 是不对症）；④ 停更在 2023 且没有 `<print>`；
   ⑧ 是把「编译给网页用」的工具误解成「在网页里编译」。
2. **③ 不接进考试主路，但它是唯一「真能落地」的浏览器方案**，代价说清楚：
   站内新增 ~29 MB 静态资源（≈ 整门课正文 8 倍、首屏 165 倍），进考场首次点击要等它下完并解压，
   之后浏览器常驻 ~85 MB、同一时刻只能有一个编译任务排队，且只能跑 WASI 纯计算题（`<iostream>` 有，
   多线程/文件/网络没有）。最关键：**它必须 `fetch`，`file://` 双击那条硬要求当场作废**
   —— 除非为它单开一个「必须用 http 起服务」的降级开关。
3. **要「按上去看到代码真的跑出来」，接 ⑥，形态是一个可选按钮：**
   `site.js` 的 `engines` 加一套 `cpp-run`（一份 `cpp-run-client.js`，几十行，`<script>` 注入，与现有 `paper` 引擎同层）；
   「进考场只拉题包与引擎」的分层口径**不变**，28 MB 那种东西一份都不进这个清单；
   按钮点了才发 `POST /api/compiler/<id>/compile`（`-std=c++23 -O2`、`executorRequest:true`），
   结果只当「演示」，**判分仍走 `exam-paper.js` 的笔试口径** —— 否则等于把 213 场考试的正确性交给第三方在线服务。
   file:// 下按现有 `MIAO_FILE_MODE` 判断：网络请求失败就在终端里写明「在线真跑需要联网，笔试判分不受影响」，
   不白屏、不改判分。代价：一条外部依赖 + 2.5–6.8 s 的一次往返 + 对方文档里那句「将来可能要鉴权」。
4. 若要更强的离线真跑，唯一自洽的做法是 **③ 作为「高级玩家可选包」**：不进 `engines`，
   在详情页给一个「下载离线编译器（29 MB）」的显式按钮 + `location.protocol === "file:"` 时直接禁掉并说明原因；
   这条路要先解决三件事：nginx 加 `gzip_types application/wasm` 并放行 `.gz` 直传（现只列到 `image/svg+xml`，Dockerfile 里改）、
   `.gz` 资源的前端解压、以及出题规矩里补一条「不许写 `{:?}`（C++26）—— gcc 15.3 与 clang 22.1 在 `-std=c++23` 下都编不过」。工作量按一个整轮算，不是顺手改。
