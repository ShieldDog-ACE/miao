/* 喵站 · Python 精通 正文分部 p1：第 1–6 课
 *
 * 导出 window.MIAO_PYTHONX_P1 = { chapters: [...] }，由装配层按章 id 合并。
 * 六栏固定：目标 tip → 原理讲解 → 假设它能干什么 → 演示 → 常见坑 → 任务 → 一句话 tip。
 * 正文与代码里不出现反引号与模板插值符号；交叉引用只往回指。 */
window.MIAO_PYTHONX_P1 = {
  chapters: [
    {
      id: `px01`,
      title: `第 1 课 · 从脚本到包：项目结构`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：把一段能跑的脚本拆成可安装的包，一次做齐 src 布局、入口函数、类型注解、虚拟环境四件事。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `脚本只有一个文件，顶层代码从上往下执行，导入它就会把整段跑一遍。包是按目录拆开的模块集合，导入只执行定义、不触发动作；动作留给入口函数，由命令行显式调用。这一条分界线，决定了代码能不能被测试和复用。` },
        { t: `p`, text: `src 布局把源码放进 src/ 目录，仓库根只留配置和测试。这样导入时只会看到安装后的包，不会误把当前目录的同名文件夹当包；打包时也不会把测试和临时脚本带进产物。安装用可编辑模式，site-packages 里只放一个指回仓库的链接。` },
        { t: `p`, text: `类型注解写在参数和返回值上，Python 运行时不做检查，但编辑器能补全、类型检查器能查错、读代码的人能一眼看到数据形状。注解加文档字符串，构成这个包对外的契约；函数内部怎么改，只要契约不变，调用方就不用动。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `把一段三百行的脚本拆成 text、cli、config 三个模块，每个模块只做一件事。`,
          `别人装好包之后，在命令行直接得到一个 miao-text 命令，不用知道模块路径。`,
          `编辑器按注解提示参数类型，参数名写错当场标红，不用等运行。`,
          `同一份代码在开发机、CI、服务器上按同一份声明装出一样的环境。`
        ]},
        { t: `h2`, text: `演示：从单文件脚本到 src 包` },
        { t: `p`, text: `先看脚本形态：数据类加函数，最后是 __main__ 守卫。导入时只注册定义，直接运行时才执行打印。守卫这一行就是脚本和模块的分界线，pytest 收集文件时也不会误触发。` },
        { t: `code`, lang: `python`, code: `from dataclasses import dataclass

@dataclass
class Doc:
    title: str
    body: str

def slugify(text: str) -> str:
    return "-".join(text.lower().split())

if __name__ == "__main__":
    print(slugify(Doc("Hello World", "x").title))` },
        { t: `p`, text: `拆成包之后，目录长这样。text.py 放 slugify，cli.py 放 main，__init__.py 把公开函数重新导出；仓库根的 pyproject.toml 声明包名、依赖和命令入口，下一课展开讲。` },
        { t: `code`, lang: `text`, code: `miao-text/
  pyproject.toml
  src/miao_text/
    __init__.py
    text.py
    cli.py
  tests/test_text.py` },
        { t: `p`, text: `在仓库根建虚拟环境，把本包装成可编辑模式，命令行就会多出 miao-text。之后改 src 里的代码立即生效，不用反复重装；入口名和模块名解耦，改名不影响命令。` },
        { t: `code`, lang: `bash`, code: `python3 -m venv .venv
source .venv/bin/activate
python -m pip install -e .
miao-text "Hello World"` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="16" y="16" width="608" height="248" rx="16" fill="#eef6f4"/><text x="320" y="44" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">脚本装进包，再被导入</text><rect x="36" y="110" width="150" height="64" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="111" y="138" font-size="14" text-anchor="middle" fill="#173d36">仓库里的 src 包</text><text x="111" y="160" font-size="14" text-anchor="middle" fill="#4d6f67">miao_text/</text><path d="M188 142H239" stroke="#2a8c78" stroke-width="3"/><polygon points="239,142 229,136 229,148" fill="#2a8c78"/><text x="214" y="100" font-size="14" text-anchor="middle" fill="#4d6f67">pip install -e .</text><rect x="245" y="110" width="150" height="64" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="320" y="138" font-size="15" text-anchor="middle" fill="#173d36">虚拟环境</text><text x="320" y="160" font-size="14" text-anchor="middle" fill="#4d6f67">site-packages</text><path d="M397 142H448" stroke="#2a8c78" stroke-width="3"/><polygon points="448,142 438,136 438,148" fill="#2a8c78"/><text x="423" y="100" font-size="14" text-anchor="middle" fill="#4d6f67">import</text><rect x="454" y="110" width="150" height="64" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="529" y="138" font-size="15" text-anchor="middle" fill="#173d36">运行中的进程</text><text x="529" y="160" font-size="14" text-anchor="middle" fill="#4d6f67">miao_text 模块</text><text x="320" y="214" font-size="14" text-anchor="middle" fill="#4d6f67">可编辑安装只在 site-packages 放一个指向仓库的链接</text><text x="320" y="240" font-size="14" text-anchor="middle" fill="#4d6f67">改 src 里的代码立即生效，入口命令由 pyproject 生成</text></svg>`, caption: `源码在 src，环境里只有链接；导入走 site-packages，执行走进口函数。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `仓库根同时放同名目录和脚本，导入时拿到的是工作目录那份，装好的包永远不生效。`,
          `把可执行代码写在模块顶层，导入即发请求、写文件，测试没法单独跑函数。`,
          `__init__.py 里导入所有子模块，任意一个可选依赖缺失就整包导入失败。`,
          `忘了 __main__ 守卫，测试收集到这个文件时把演示代码又跑一遍。`,
          `注解引用了没导入的名字，运行时求值注解会报 NameError。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把课上脚本拆成 text.py 和 cli.py，用 python -m miao_text.cli 跑通。`,
          `给 slugify 加一个 sep 参数，注解写成 str，默认值写成短横，再写一行调用验证。`,
          `在 __init__.py 里只导出 slugify，用 dir() 看公开名字是否只剩它。`,
          `画一张从仓库目录到 site-packages 的路径图，标出可编辑安装后指向哪里。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：脚本负责执行，包负责被导入；src 布局加入口守卫，让同一份代码既能命令行跑，也能被别人 import。` }
      ]
    },
    {
      id: `px02`,
      title: `第 2 课 · 依赖：pyproject`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：用 pyproject.toml 声明运行依赖与开发依赖，理解版本区间、锁文件和可复现安装各自解决什么问题。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `pyproject.toml 是项目的唯一声明文件。[project] 写名字、版本、Python 版本要求和运行时依赖，[project.optional-dependencies] 写只在开发测试时用的包，[build-system] 指定打包后端。装包工具读同一份声明，不再靠 setup.py 里的代码执行。` },
        { t: `p`, text: `版本区间用比较符表达，>=1.8,<2.0 表示 1.8 及以上、2.0 以下。区间不是越宽越好：太宽，不同机器装到不同小版本；太窄，安全补丁进不来。常见做法是运行时依赖给兼容区间，锁文件把某一次解析的结果钉死。` },
        { t: `p`, text: `锁文件记录每个包的确切版本和哈希，安装时照单抓药，不再现场解析。pyproject 是意图，锁文件是事实：CI 和服务器用锁文件装，本地升级时才重新解析并更新锁。开发依赖单独一组，部署时不装 pytest 和 ruff，镜像体积和攻击面都小一圈。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `新机器上一条命令装齐运行依赖，不用翻文档找安装列表。`,
          `CI 用锁文件安装，今天和三个月后构建出的环境一致。`,
          `部署镜像只装运行时依赖，不把测试框架带进生产。`,
          `升级某个库时改一行区间，重新解析，看测试是否还绿。`
        ]},
        { t: `h2`, text: `演示：写一份 pyproject 并验证版本区间` },
        { t: `p`, text: `下面这份声明了包名、Python 版本、运行依赖和 dev 组，命令入口指向 cli 模块的 main。依赖只写区间，不写死小版本；打包后端用 hatchling。` },
        { t: `code`, lang: `text`, code: `[project]
name = "miao-text"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = ["httpx>=0.27,<1.0"]
[project.optional-dependencies]
dev = ["pytest>=8", "ruff>=0.5"]
[project.scripts]
miao-text = "miao_text.cli:main"
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"` },
        { t: `p`, text: `区间到底怎么筛版本，用几行 Python 就能看清。下面把候选版本按 >=1.8,<2.0 过滤，1.7.4 和 2.0.0 都被挡在外面。` },
        { t: `code`, lang: `python`, code: `def parse(v):
    return tuple(int(x) for x in v.split("."))

cands = ["1.7.4", "1.8.0", "1.9.3", "2.0.0"]
lo, hi = parse("1.8"), parse("2.0")
picked = [v for v in cands if lo <= parse(v) < hi]
print(picked)` },
        { t: `p`, text: `输出只剩两个 1.x 版本。真实解析器还要处理预发布版、环境标记和传递依赖，但边界判断的逻辑就是这段；理解它，看到解析冲突时才知道是哪条区间卡住了。` },
        { t: `p`, text: `安装分两步：先按声明装本包和 dev 组，再把当前解析结果冻成锁文件。之后 CI 只认锁文件，升级时才回到声明重新解析。` },
        { t: `code`, lang: `bash`, code: `python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
pip freeze > requirements.lock
pip install -r requirements.lock` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260"><rect x="16" y="16" width="608" height="228" rx="16" fill="#eef6f4"/><text x="320" y="44" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">依赖从声明到装进环境</text><rect x="30" y="92" width="130" height="62" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="95" y="118" font-size="14" text-anchor="middle" fill="#173d36">pyproject.toml</text><text x="95" y="140" font-size="14" text-anchor="middle" fill="#4d6f67">意图：版本区间</text><path d="M162 123H181" stroke="#2a8c78" stroke-width="3"/><polygon points="181,123 171,117 171,129" fill="#2a8c78"/><rect x="185" y="92" width="120" height="62" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="245" y="118" font-size="15" text-anchor="middle" fill="#173d36">解析器</text><text x="245" y="140" font-size="14" text-anchor="middle" fill="#4d6f67">挑出可用版本</text><path d="M307 123H326" stroke="#2a8c78" stroke-width="3"/><polygon points="326,123 316,117 316,129" fill="#2a8c78"/><rect x="330" y="92" width="120" height="62" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="390" y="118" font-size="15" text-anchor="middle" fill="#173d36">锁文件</text><text x="390" y="140" font-size="14" text-anchor="middle" fill="#4d6f67">事实：精确版本</text><path d="M452 123H471" stroke="#2a8c78" stroke-width="3"/><polygon points="471,123 461,117 461,129" fill="#2a8c78"/><rect x="475" y="92" width="135" height="62" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="542" y="118" font-size="15" text-anchor="middle" fill="#173d36">虚拟环境</text><text x="542" y="140" font-size="14" text-anchor="middle" fill="#4d6f67">照单安装</text><text x="320" y="198" font-size="14" text-anchor="middle" fill="#4d6f67">日常安装读锁文件，不再现场解析</text><text x="320" y="224" font-size="14" text-anchor="middle" fill="#4d6f67">只有主动升级时才回到解析器重新算一遍</text></svg>`, caption: `声明是意图，锁文件是事实；装环境读事实，升级才重新解析。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把依赖写成精确等于某个小版本，两个库要求同一包的不同版本时直接无解。`,
          `只写包名不写区间，每次安装都可能跨大版本，行为悄悄变化。`,
          `把 pytest、ruff 写进运行时依赖，生产镜像多装几百 MB。`,
          `改了声明不重新生成锁文件，CI 装的还是旧版本。`,
          `锁文件提交了却在 CI 里跑升级命令，锁定等于没锁。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `给你自己的一个脚本写 pyproject，声明 requires-python 和一条依赖。`,
          `用 >= 和 < 写一个区间，造五个版本号，用课上的过滤函数验证边界。`,
          `把依赖分成运行和 dev 两组，写出各自的安装命令。`,
          `用三行说明锁文件和 pyproject 各自在什么时候更新。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：pyproject 说清要什么，锁文件钉死装到什么；两份都进版本控制，环境才可复现。` }
      ]
    },
    {
      id: `px03`,
      title: `第 3 课 · 测试：pytest`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：给上一课的包补上 pytest 测试：用 fixture 共享准备数据，用参数化铺开边界，用假对象守住外部边界，再用覆盖率找漏。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `测试就是一个函数：准备输入、调用被测代码、断言输出。pytest 按文件名 test_ 开头、函数名 test_ 开头自动收集，断言失败时打印左右两边的值。一个测试只验证一件事，失败信息才能直接指向原因。` },
        { t: `p`, text: `fixture 是带返回值的准备函数，测试把名字写成参数就拿到它；默认每个测试一份新数据，作用域改成 module 才共享。参数化把同一段逻辑跑多组输入，每组单独计数，空值、边界值、异常值一次铺开。` },
        { t: `p`, text: `假对象的边界要画在进程外：网络、时钟、随机数、文件系统。替换的是这些边界，不是被测函数内部。用假客户端返回固定数据，测试就与网络无关；覆盖率看哪些行没被执行，但 100% 不等于没 bug，它只说明每行都跑过。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `改一行 slugify，三秒内知道有没有弄坏已有行为。`,
          `边界输入不用手工点页面，参数化一次跑完空串、空格、大写。`,
          `外部接口挂了，测试照样能跑，因为假客户端不发请求。`,
          `覆盖率报告指出命令行模块的异常分支从没被执行过。`
        ]},
        { t: `h2`, text: `演示：给 slugify 写三组测试` },
        { t: `p`, text: `这份测试文件用 fixture 提供样例，用参数化铺三组输入，其中包含空串。断言只比较返回值，不碰打印和文件，跑起来没有副作用。` },
        { t: `code`, lang: `python`, code: `import pytest
from miao_text.text import slugify

@pytest.fixture
def samples():
    return [("Hello World", "hello-world"), ("A  B", "a-b")]

@pytest.mark.parametrize("raw,want", [("Hello World", "hello-world"), ("A  B", "a-b"), ("", "")])
def test_slug(raw, want):
    assert slugify(raw) == want` },
        { t: `p`, text: `跑 pytest -q 会看到三个测试点，失败时哪一组输入、期望什么、实际什么都会打出来。fixture samples 这份还没用上，下一段拿它做批量入口的测试。` },
        { t: `p`, text: `外部请求要在边界上换掉。下面用假客户端返回固定价格，测的是解析逻辑，不是网络；真接口超时、限流都不会影响这条测试。` },
        { t: `code`, lang: `python`, code: `class FakeClient:
    def get(self, url):
        return {"price": 42}

def fetch_price(client, url):
    return client.get(url)["price"]

assert fetch_price(FakeClient(), "http://example.test/p") == 42
print("ok")` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 340"><rect x="16" y="16" width="608" height="308" rx="16" fill="#eef6f4"/><text x="320" y="44" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">假对象画在进程边界上</text><rect x="240" y="64" width="160" height="52" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="320" y="96" font-size="16" text-anchor="middle" fill="#173d36">test_price</text><path d="M320 118V138" stroke="#2a8c78" stroke-width="3"/><polygon points="320,138 314,128 326,128" fill="#2a8c78"/><rect x="240" y="142" width="160" height="52" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="320" y="174" font-size="16" text-anchor="middle" fill="#173d36">fetch_price</text><path d="M320 196V218H160V244" stroke="#2a8c78" stroke-width="3" fill="none"/><path d="M320 218H480V244" stroke="#2a8c78" stroke-width="3" fill="none"/><polygon points="160,244 154,234 166,234" fill="#2a8c78"/><polygon points="480,244 474,234 486,234" fill="#2a8c78"/><text x="220" y="210" font-size="14" text-anchor="middle" fill="#4d6f67">进程内</text><text x="420" y="210" font-size="14" text-anchor="middle" fill="#4d6f67">进程外</text><rect x="60" y="248" width="200" height="50" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="160" y="270" font-size="14" text-anchor="middle" fill="#173d36">假客户端 固定 42</text><text x="160" y="290" font-size="14" text-anchor="middle" fill="#4d6f67">不发真实请求</text><rect x="380" y="248" width="200" height="50" rx="10" fill="#ffffff" stroke="#9db8b0" stroke-width="2" stroke-dasharray="6 4"/><text x="480" y="270" font-size="14" text-anchor="middle" fill="#4d6f67">真实网络 不可控</text><text x="480" y="290" font-size="14" text-anchor="middle" fill="#9db8b0">可能超时或报错</text><text x="320" y="322" font-size="14" text-anchor="middle" fill="#4d6f67">测试只跨到假客户端，真实网络留在进程外</text></svg>`, caption: `替换点在网络调用这一层；换掉它，测试就与外部服务解耦。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `一个测试断言十件事，失败时不知道哪条先坏。`,
          `fixture 里改全局状态，测试顺序一变结果就变。`,
          `假对象打在函数内部，重构一下测试全废；应该换网络、时钟这类边界。`,
          `只测正常路径，空串、None、超长输入全漏。`,
          `追求 100% 覆盖率，把断言写成永远为真。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `给 slugify 补三个边界用例：纯空格、连续短横、中文输入。`,
          `把 samples fixture 用起来，写一个批量测试，至少两组数据。`,
          `给 fetch_price 加一个异常分支，用假客户端抛异常验证错误处理。`,
          `跑一次覆盖率，记下没覆盖的行，补一个测试把它覆盖掉。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：准备、调用、断言三件事分开写；假对象只画在进程边界，覆盖率只用来找漏。` }
      ]
    },
    {
      id: `px04`,
      title: `第 4 课 · 异步：asyncio 事件循环`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：理解事件循环怎么在多个协程之间切换，用 gather 并发、用 wait_for 加超时，并用计时验证并发省下的是等待时间。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `协程是能暂停的函数，await 表示这里要等 IO，先把控制权交回事件循环，等结果好了再回来。事件循环手里有一张任务表，谁在等就挂起，谁就绪就恢复，全程一个线程，不需要线程锁。` },
        { t: `p`, text: `单线程不等于串行。三个各等一秒的任务，顺序执行要三秒；三个协程同时挂起，一秒后一起就绪，总耗时约一秒。省下的是等待，不是计算：CPU 密集的活放进协程只会互相拖慢，因为计算期间没有 await 点。` },
        { t: `p`, text: `gather 把多个协程打包成一组并发跑，按传入顺序返回结果；wait_for 给单个协程设上限，超时抛 TimeoutError。任务对象要保留引用，否则可能被垃圾回收；异常不取回会以警告形式冒出来。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `同时请求二十个接口，总耗时接近最慢的那一个，而不是二十个相加。`,
          `给每个请求设两秒上限，慢接口不拖垮整页。`,
          `一个进程同时维持上千个连接，内存比一千个线程低得多。`,
          `把抓取、解析、写库拆成三段流水线，各段并发推进。`
        ]},
        { t: `h2`, text: `演示：并发抓取（用 sleep 模拟网络）` },
        { t: `p`, text: `下面用 asyncio.sleep 模拟三次网络等待，先顺序 await 得到第一段时间，再 gather 并发得到第二段。真实抓取把 sleep 换成 HTTP 客户端即可，结构不变。` },
        { t: `code`, lang: `python`, code: `import asyncio
from time import perf_counter
async def fetch(d):
    await asyncio.sleep(d)
async def main():
    t = perf_counter()
    for d in (0.3, 0.2, 0.1): await fetch(d)
    seq = perf_counter() - t
    t = perf_counter()
    await asyncio.gather(fetch(0.3), fetch(0.2), fetch(0.1))
    print(round(seq, 2), round(perf_counter() - t, 2))
asyncio.run(main())` },
        { t: `p`, text: `输出第一列约 0.6，第二列约 0.3。顺序版把等待一段段叠起来，并发版三段等待重叠，墙钟时间由最长的一段决定。数字会随机器抖动，比例不会变。` },
        { t: `p`, text: `超时用 wait_for 包一层：超过上限就取消协程并抛 TimeoutError，必须捕获，否则整个 main 退出。真实抓取时这个上限比客户端默认超时略大，让库先报错。` },
        { t: `code`, lang: `python`, code: `import asyncio

async def slow():
    await asyncio.sleep(5)

async def main():
    try:
        await asyncio.wait_for(slow(), timeout=0.2)
    except TimeoutError:
        print("超时，已取消")

asyncio.run(main())` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect x="16" y="16" width="608" height="268" rx="16" fill="#eef6f4"/><text x="320" y="40" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">顺序 await 与 gather 的时间线</text><text x="40" y="72" font-size="15" fill="#4d6f67">顺序 await</text><rect x="120" y="82" width="210" height="26" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="225" y="100" font-size="14" text-anchor="middle" fill="#173d36">a 0.3s</text><rect x="330" y="82" width="140" height="26" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="400" y="100" font-size="14" text-anchor="middle" fill="#173d36">b 0.2s</text><rect x="470" y="82" width="70" height="26" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="505" y="100" font-size="14" text-anchor="middle" fill="#173d36">c 0.1s</text><path d="M120 126H540" stroke="#9db8b0" stroke-width="2"/><path d="M120 120V132" stroke="#9db8b0" stroke-width="2"/><path d="M260 120V132" stroke="#9db8b0" stroke-width="2"/><path d="M400 120V132" stroke="#9db8b0" stroke-width="2"/><path d="M540 120V132" stroke="#9db8b0" stroke-width="2"/><text x="120" y="148" font-size="14" text-anchor="middle" fill="#4d6f67">0</text><text x="260" y="148" font-size="14" text-anchor="middle" fill="#4d6f67">0.2s</text><text x="400" y="148" font-size="14" text-anchor="middle" fill="#4d6f67">0.4s</text><text x="540" y="148" font-size="14" text-anchor="middle" fill="#4d6f67">0.6s</text><text x="40" y="176" font-size="15" fill="#4d6f67">gather 并发</text><text x="112" y="186" font-size="14" text-anchor="end" fill="#4d6f67">a</text><rect x="120" y="166" width="210" height="22" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="225" y="182" font-size="14" text-anchor="middle" fill="#173d36">0.3s</text><text x="112" y="214" font-size="14" text-anchor="end" fill="#4d6f67">b</text><rect x="120" y="194" width="140" height="22" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="190" y="210" font-size="14" text-anchor="middle" fill="#173d36">0.2s</text><text x="112" y="242" font-size="14" text-anchor="end" fill="#4d6f67">c</text><rect x="120" y="222" width="70" height="22" rx="6" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="155" y="238" font-size="14" text-anchor="middle" fill="#173d36">0.1s</text><text x="320" y="276" font-size="14" text-anchor="middle" fill="#4d6f67">并发省下的是重叠的等待，最长的一段决定总耗时</text></svg>`, caption: `同样三段等待，顺序版首尾相接，并发版从同一时刻起跑。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `在协程里调用阻塞函数，整个事件循环被卡住，所有任务一起等。`,
          `忘了 await，拿到的是协程对象，函数体根本没执行。`,
          `用 gather 却不收集返回的异常，任务失败了主流程毫无感知。`,
          `超时不捕获，TimeoutError 一路冒到最外层，进程退出。`,
          `把 CPU 密集计算塞进协程，并发度越高越慢。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把并发演示改成五个不同延迟的任务，打印每个任务的完成顺序。`,
          `给 gather 加 return_exceptions 参数，让一个任务抛错时其余任务继续跑。`,
          `把超时改成可配置参数，分别用 0.1 和 1 秒各跑一次，记录结果。`,
          `画一张三个协程在事件循环里挂起和恢复的时序图。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：await 交还控制权，事件循环在等待点之间切换；并发压缩的是等待时间，不是计算时间。` }
      ]
    },
    {
      id: `px05`,
      title: `第 5 课 · 并发：线程池`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：分清 IO 密集和 CPU 密集，用线程池并发等待型任务，知道 GIL 为什么让线程帮不上计算型任务，以及进程池何时上场。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `线程是操作系统调度的执行单元，同一进程里的线程共享内存。Python 解释器有一把全局锁 GIL，同一时刻只有一个线程在执行 Python 字节码；线程遇到 sleep、网络、文件读写这类会释放 GIL 的等待时，别的线程才能进场。` },
        { t: `p`, text: `所以线程池的甜区是 IO 密集：任务大部分时间在等，释放 GIL 让别的线程跑，八个线程能把八段等待叠在一起。CPU 密集的任务线程之间要抢锁，加线程只增加切换开销，甚至比单线程慢。` },
        { t: `p`, text: `进程池每个进程有独立解释器和独立 GIL，能真正并行吃满多核；代价是启动慢、内存翻倍、参数和返回值要序列化。判断标准很简单：任务在等外部资源就用线程，任务在算就用进程，两者都重就拆成两段。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `同时下载五十个小文件，线程池把总耗时压到最慢几个文件的时间。`,
          `批量调接口时限制并发数为八，避免把对方打挂。`,
          `日志里能看出每个任务开始和结束的先后，确认真的重叠。`,
          `一段纯计算循环放进线程池没有加速，换成进程池才用上多核。`
        ]},
        { t: `h2`, text: `演示：线程池跑等待型任务` },
        { t: `p`, text: `六个任务各睡 0.2 秒，先用 for 顺序跑，再用三个线程跑，打印两段时间。sleep 会释放 GIL，所以线程版能重叠，总时长接近两批而不是六批。` },
        { t: `code`, lang: `python`, code: `from concurrent.futures import ThreadPoolExecutor
from time import perf_counter, sleep

def job(i):
    sleep(0.2)
    return i * i

start = perf_counter()
print([job(i) for i in range(6)], round(perf_counter() - start, 2))
start = perf_counter()
with ThreadPoolExecutor(max_workers=3) as pool:
    print(list(pool.map(job, range(6))), round(perf_counter() - start, 2))` },
        { t: `p`, text: `顺序版约 1.2 秒，线程版约 0.4 秒，六个任务分三批跑完。map 按输入顺序返回结果，内部谁先完成不影响输出顺序，这一点在需要对齐输入时很重要。` },
        { t: `p`, text: `换成纯计算，线程数加上去也不会更快。下面两个任务各累加三百万次，顺序和双线程的耗时接近；把执行器换成进程池才会明显下降。` },
        { t: `code`, lang: `python`, code: `from concurrent.futures import ThreadPoolExecutor
from time import perf_counter
def work(n):
    total = 0
    for i in range(n):
        total += i
    return total
t = perf_counter()
print(work(3_000_000), work(3_000_000), round(perf_counter() - t, 2))
t = perf_counter()
with ThreadPoolExecutor(max_workers=2) as pool:
    print(sum(pool.map(work, (3_000_000, 3_000_000))), round(perf_counter() - t, 2))` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="16" y="16" width="608" height="248" rx="16" fill="#eef6f4"/><text x="320" y="42" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">线程池：任务排队，等待时让出 GIL</text><rect x="36" y="76" width="130" height="150" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="101" y="98" font-size="14" text-anchor="middle" fill="#173d36">任务队列</text><rect x="56" y="112" width="42" height="22" rx="4" fill="#eef6f4" stroke="#9db8b0" stroke-width="1"/><text x="77" y="128" font-size="14" text-anchor="middle" fill="#4d6f67">1</text><rect x="106" y="112" width="42" height="22" rx="4" fill="#eef6f4" stroke="#9db8b0" stroke-width="1"/><text x="127" y="128" font-size="14" text-anchor="middle" fill="#4d6f67">2</text><rect x="56" y="142" width="42" height="22" rx="4" fill="#eef6f4" stroke="#9db8b0" stroke-width="1"/><text x="77" y="158" font-size="14" text-anchor="middle" fill="#4d6f67">3</text><rect x="106" y="142" width="42" height="22" rx="4" fill="#eef6f4" stroke="#9db8b0" stroke-width="1"/><text x="127" y="158" font-size="14" text-anchor="middle" fill="#4d6f67">4</text><rect x="56" y="172" width="42" height="22" rx="4" fill="#eef6f4" stroke="#9db8b0" stroke-width="1"/><text x="77" y="188" font-size="14" text-anchor="middle" fill="#4d6f67">5</text><rect x="106" y="172" width="42" height="22" rx="4" fill="#eef6f4" stroke="#9db8b0" stroke-width="1"/><text x="127" y="188" font-size="14" text-anchor="middle" fill="#4d6f67">6</text><path d="M168 150H202" stroke="#2a8c78" stroke-width="3"/><polygon points="202,150 192,144 192,156" fill="#2a8c78"/><rect x="206" y="76" width="190" height="150" rx="10" fill="#ffffff" stroke="#2a8c78" stroke-width="2"/><text x="301" y="98" font-size="14" text-anchor="middle" fill="#173d36">线程池 3 个工作线程</text><rect x="226" y="110" width="150" height="28" rx="6" fill="#eef6f4" stroke="#9db8b0" stroke-width="1"/><text x="301" y="129" font-size="14" text-anchor="middle" fill="#173d36">线程 1 执行</text><rect x="226" y="148" width="150" height="28" rx="6" fill="#eef6f4" stroke="#9db8b0" stroke-width="1"/><text x="301" y="167" font-size="14" text-anchor="middle" fill="#173d36">线程 2 执行</text><rect x="226" y="186" width="150" height="28" rx="6" fill="#eef6f4" stroke="#9db8b0" stroke-width="1"/><text x="301" y="205" font-size="14" text-anchor="middle" fill="#173d36">线程 3 执行</text><path d="M398 150H456" stroke="#2a8c78" stroke-width="3"/><polygon points="456,150 446,144 446,156" fill="#2a8c78"/><rect x="460" y="104" width="140" height="92" rx="10" fill="#ffffff" stroke="#c98a2b" stroke-width="2"/><text x="530" y="132" font-size="14" text-anchor="middle" fill="#173d36">GIL 全局锁</text><text x="530" y="156" font-size="14" text-anchor="middle" fill="#4d6f67">同时只放一个</text><text x="530" y="178" font-size="14" text-anchor="middle" fill="#4d6f67">线程执行字节码</text><text x="320" y="252" font-size="14" text-anchor="middle" fill="#4d6f67">等待 IO 时释放 GIL，别的线程进场；纯计算只会互相排队</text></svg>`, caption: `队列把任务分给线程，锁决定谁在执行；等待时锁让出来，计算时锁被占住。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `把 CPU 密集任务丢进线程池，以为多了几个线程就能快几倍。`,
          `线程数开得比任务多，切换开销比等待还大。`,
          `在任务里改同一个全局字典，不加锁就出现计数丢失。`,
          `用线程池跑会抛异常的任务，却不检查 future 的异常，失败被静默吞掉。`,
          `进程池里传巨大对象，序列化开销超过计算本身。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `把线程数从 3 改成 1、3、6，各跑一次等待型演示，记录耗时。`,
          `把纯计算演示换成进程池，比较两种执行器的耗时。`,
          `写一个任务，抛异常后用 future.exception() 取出来并打印。`,
          `判断三个场景该用线程还是进程：下载图片、压缩视频、解析日志。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：线程池擅长把等待叠起来，进程池才能把计算铺到多核；先看任务在等还是在算，再选执行器。` }
      ]
    },
    {
      id: `px06`,
      title: `第 6 课 · 性能：cProfile 找热点`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：先用 cProfile 量出时间花在哪个函数，再用 timeit 比较两种写法，最后看内存分配；优化只动热点，不动感觉。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `性能问题不能靠猜。cProfile 按函数记录调用次数、总耗时、自身耗时，排序后一眼看到谁最贵。总耗时包含子调用，自身耗时只算函数体内的语句；先看自身耗时找热点，再看调用次数找重复。` },
        { t: `p`, text: `timeit 把一小段代码跑很多遍取平均，适合比较两种等价写法：循环拼接对 join、列表推导对 append 循环。跑之前先想清楚测的是哪一段，把准备数据的开销排除在外。` },
        { t: `p`, text: `内存用 tracemalloc 按行统计分配峰值，找出悄悄变大的列表和缓存。优化的顺序是：先改算法复杂度，再改常数，最后才考虑换语言或加缓存；每改一步都重新测量，确认真的变快。` },
        { t: `h2`, text: `假设它能干什么` },
        { t: `ul`, items: [
          `接口从八百毫秒降到一百二十毫秒，报告里能指出省在哪一行。`,
          `上线前跑一次剖析，发现日志字符串在热循环里被反复拼接。`,
          `两个实现纠结时各跑一万次，用数字拍板。`,
          `内存涨到两 GB 时用 tracemalloc 定位到只增不减的缓存字典。`
        ]},
        { t: `h2`, text: `演示：先找热点，再换写法` },
        { t: `p`, text: `下面这个函数把一万条记录拼成一段文本，故意用加等于在循环里拼字符串。cProfile 跑一次，按自身耗时排序打印前三名。` },
        { t: `code`, lang: `python`, code: `import cProfile
import pstats
def build(rows):
    out = ""
    for i in range(rows):
        out += "row-" + str(i) + ";"
    return out
prof = cProfile.Profile()
prof.enable()
build(10000)
prof.disable()
pstats.Stats(prof).sort_stats("tottime").print_stats(3)` },
        { t: `p`, text: `输出里 build 的自身耗时最高，调用一次。热点找到了，再看两种写法：循环里加等于每次都新建字符串，join 先收集再一次性拼接。` },
        { t: `code`, lang: `python`, code: `from timeit import timeit
def plus(n):
    out = ""
    for i in range(n):
        out += "row-" + str(i) + ";"
    return out
def joined(n):
    return "".join("row-" + str(i) + ";" for i in range(n))
print(round(timeit("plus(5000)", globals=globals(), number=20), 3))
print(round(timeit("joined(5000)", globals=globals(), number=20), 3))` },
        { t: `p`, text: `两行数字通常差一个数量级。join 只分配一次结果，加等于每轮都复制已有内容，n 越大差距越大。换成列表 append 再 join，思路一样，适合需要中途处理每一项的场景。` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280"><rect x="16" y="16" width="608" height="264" rx="16" fill="#eef6f4"/><text x="320" y="40" font-size="20" font-weight="700" text-anchor="middle" fill="#173d36">cProfile 热点条形图</text><text x="320" y="62" font-size="14" text-anchor="middle" fill="#4d6f67">tottime 前四名</text><path d="M180 76V224" stroke="#9db8b0" stroke-width="2"/><path d="M180 224H600" stroke="#9db8b0" stroke-width="2"/><text x="172" y="101" font-size="14" text-anchor="end" fill="#4d6f67">build</text><rect x="180" y="84" width="310" height="24" rx="4" fill="#c0504d"/><text x="498" y="101" font-size="14" fill="#4d6f67">0.62s</text><text x="172" y="133" font-size="14" text-anchor="end" fill="#4d6f67">parse_rows</text><rect x="180" y="116" width="90" height="24" rx="4" fill="#c98a2b"/><text x="278" y="133" font-size="14" fill="#4d6f67">0.18s</text><text x="172" y="165" font-size="14" text-anchor="end" fill="#4d6f67">load_json</text><rect x="180" y="148" width="45" height="24" rx="4" fill="#4a7bd0"/><text x="233" y="165" font-size="14" fill="#4d6f67">0.09s</text><text x="172" y="197" font-size="14" text-anchor="end" fill="#4d6f67">write_log</text><rect x="180" y="180" width="20" height="24" rx="4" fill="#2a8c78"/><text x="208" y="197" font-size="14" fill="#4d6f67">0.04s</text><text x="320" y="252" font-size="14" text-anchor="middle" fill="#4d6f67">先看自身耗时找热点，再看调用次数找重复</text></svg>`, caption: `条形按自身耗时排，最长的 build 就是先要动的地方。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `不测量就重写，改完发现瓶颈在另一段。`,
          `只看总耗时，把子调用的时间算到外层函数头上。`,
          `用一次 timeit 结果下结论，后台进程会让数字抖。`,
          `在剖析版本里保留日志和调试字符串，测到的是日志开销。`,
          `为了零点几毫秒把代码改成没人看得懂的样子。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `给课上的 build 包一层计时，把一万条改成五万条，记录耗时变化。`,
          `用 timeit 比较列表推导和 append 循环各建十万个元素，写出比值。`,
          `用 tracemalloc 包住 build，打印分配峰值，再改成 join 版本对照。`,
          `找一个你写过的慢函数，先剖析，写出热点函数名和占比。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：先剖析找热点，再用 timeit 验证改法，最后用内存工具收尾；每一步都用数字说话。` }
      ]
    }
  ]
};
