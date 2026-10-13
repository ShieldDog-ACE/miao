/* 喵站 · C++ 入门 正文分部 p13：第 55–58 课（第九轮 · 函数喊函数 + lambda + 引用初见）
 *
 * 源稿：学习资料/C++入门/55_函数调用函数、56_lambda临时小函数、57_lambda捕获变量、58_引用基础给变量起外号。
 * 款式照 p06、p01 样板：tip 蓝·本课目标 → 原理讲解 → 它被设计成什么样 → 演示 1/2/3 → 常见坑 → 任务 → tip 绿·本课一句话
 *
 * 闸线备忘（本批必须守住的）：
 *   c55 只到「函数里喊函数」，不出现 lambda 与引用；这两样第 56、58 课才教。
 *   c56、c57 只用 lambda 与值捕获，不出现引用参数、const 引用；那两样在第 60、61 课。
 *   c58 只讲「外号」这一层，指针、引用参数往后放。
 *   讲解正文一律不写圆括号：函数名裸写，参数说明用中文括号。
 *   交叉引用只往回指，往前看的统一写「下一课」「以后再讲」。
 *
 * 验收：node dev/tools/cpp-audit.cjs --part dev/frontend/assets/data/cpp/p13.js
 *       node dev/tools/cpp-exam-check.cjs --only c55,c56,c57,c58
 */
window.MIAO_CPP_P13 = {
  chapters: [
    {
      id: `c55`, title: `第 55 课 · 函数调用函数：大活拆小活`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：让函数学会喊别的函数帮忙 —— main 喊 report，report 喊 grade_of，一条分工链把「印整张成绩单」这件大活拆成几件一眼就能看懂的小活。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 51 课你写过自己的函数：把一段活儿装进一个有名字的盒子，喊一声它就跑。那时候链条只有一层 —— main 在最上面喊，被喊的函数在最下面干活，函数自己从不喊别人。这一课把链条加长：函数在里面喊别的函数。加长的理由不是好玩，是你多半已经闻过那个味儿：一个函数里既要点名、又要算平均、又要判等级、还要一行行往外打印，读到第十行，你自己都不确定这段在干什么。活儿全堆在一处，就是大活；大活没人一次写成，全是拆出来的。` },
        { t: `p`, text: `拆法有个统一的样子：谁管「整体」，谁管「局部」。成绩单这件事，整体是「把这张表印出来」，局部是「这一个分数该判成什么等级」。于是两个函数各管一头。grade_of 只管一件小事：递给它一个整数分数，它还你一个等级词。report 拿到一串分数，一个一个往里送，每送出一个就打印一行；它完全不知道「优秀」这两个字是怎么定下来的，只认得「我把 85 递进去，会有一只良好出来」。只问结果、不问过程，这就是分工的全部秘密。` },
        { t: `p`, text: `在函数里喊函数，跟你从 main 里喊函数没有新规矩：写名字、加一对括号、把原料塞进去、爱接返回值就接。差别只是喊的人从 main 换成了一个普通函数，上一课的调用语法原样复用。真正要习惯的是视角：别再看「我在程序的第几行」，而要问「我需要什么零件、我把什么交给别人」。` },
        { t: `ul`, items: [
          `**谁在下面**：被喊的那个函数必须写在喊人的那个之前 —— 编译器从上往下认人，只认已经见过的名字。`,
          `**怎么递原料**：和 main 喊函数一模一样，逗号隔开，按位置对齐，一个不多一个不少。`,
          `**结果怎么回来**：被喊的函数用 return 交东西，喊人的一方要么接住，要么明知道不需要就不接。链条想加几层都合法，但一次别加太多，加一层就得讲得清一层。`
        ]},
        { t: `svg`, caption: `分工链：main 只管开个头，report 管一整张表，grade_of 管一个分数，每一层只看得见自己下面那一层`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250" font-family="sans-serif">
  <text x="20" y="24" font-size="14" font-weight="700" fill="#142639">一次运行的路线：85 分进去，良好出来</text>
  <rect x="20" y="44" width="180" height="52" rx="8" fill="#eaf2fb" stroke="#00599c" stroke-width="2"/>
  <text x="110" y="66" font-size="13" font-weight="700" fill="#00599c" text-anchor="middle">main</text>
  <text x="110" y="84" font-size="12" fill="#142639" text-anchor="middle">递出一串分数</text>
  <rect x="230" y="44" width="190" height="52" rx="8" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="325" y="66" font-size="13" font-weight="700" fill="#2e7d32" text-anchor="middle">report</text>
  <text x="325" y="84" font-size="12" fill="#142639" text-anchor="middle">管整张表：循环 + 打印</text>
  <rect x="450" y="44" width="170" height="52" rx="8" fill="#fdf0e6" stroke="#b8232f" stroke-width="2"/>
  <text x="535" y="66" font-size="13" font-weight="700" fill="#b8232f" text-anchor="middle">grade_of</text>
  <text x="535" y="84" font-size="12" fill="#142639" text-anchor="middle">管一个分数：判等级</text>
  <line x1="200" y1="70" x2="228" y2="70" stroke="#57677c" stroke-width="2"/>
  <polyline points="220,64 228,70 220,76" fill="none" stroke="#57677c" stroke-width="2"/>
  <line x1="420" y1="70" x2="448" y2="70" stroke="#57677c" stroke-width="2"/>
  <polyline points="440,64 448,70 440,76" fill="none" stroke="#57677c" stroke-width="2"/>
  <rect x="20" y="120" width="600" height="46" rx="8" fill="#f4f7fc" stroke="#c3ccd8" stroke-width="1.5"/>
  <text x="34" y="140" font-size="12" fill="#142639">report 知道的事：给一个整数，还一个等级词。　它不知道：</text>
  <text x="34" y="158" font-size="12" fill="#57677c">90 分算优秀这条规矩写在哪、怎么改 —— 那是 grade_of 的家事，改规矩只动一个文件位置。</text>
  <text x="20" y="192" font-size="12" font-weight="700" fill="#00599c">好处在哪</text>
  <text x="20" y="212" font-size="12" fill="#142639">要改「优秀」的门槛，只碰 grade_of；要多加一列平均分，只碰 report。两处活永远不串。</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `C++ 走的是「先见后喊」这一路：编译器一遍扫过去，见到定义才算认识这个函数。所以源稿那个程序的写法不是风格洁癖，而是必需 —— 小零件在上头，大活儿在中间，main 在最底下。反过来把 main 放顶上、零件放底下，编译器读到调用那一行时还不认识 grade_of，当场拦你。以后会学到「先声明、后定义」的分文件写法，那是另一整套事，本课先把顺序摆正。` },
        { t: `p`, text: `还有一处值得点破：report 的参数是装 int 的 std::vector，也就是「一整串分数」。第 40 课我们是先攒好一串再递过去；源稿给了更省手的递法 —— 调用处直接写一串花括号初值，编译器照着参数类型当场造出那个 vector。接口写清楚，调用方才好递东西。` },
        { t: `h2`, text: `演示 1 · 先造一个只判等级的零件` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
std::string grade_of(int score) {          // 只管一件事：一个分数进
    if (score >= 90) return "优秀";
    if (score >= 80) return "良好";
    if (score >= 60) return "及格";
    return "不及格";
}
int main() {
    std::println("85 分 → {}", grade_of(85));    // 从 main 喊它
    std::println("58 分 → {}", grade_of(58));
    return 0;
}` },
        { t: `p`, text: `这一步还没拆，只是把零件单独跑通 —— 拆活之前先确认每块自己是好的，这个习惯比拆法更值钱。看它那四行 return：从前往后一路挡，谁先命中谁 return，函数立刻结束，后面的 if 根本读不到。所以顺序不能颠倒：把 60 那档写在最前面，92 分也会先撞上它、被判成及格。跑出来 85 分 → 良好、58 分 → 不及格，两行都对，这零件就能放心交给别人用了。` },
        { t: `h2`, text: `演示 2 · report 在循环里喊 grade_of` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <vector>
std::string grade_of(int score) {         // 小活：一个分数
    if (score >= 90) return "优秀";
    if (score >= 80) return "良好";
    return "及格";
}
void report(std::vector<int> scores) {    // 大活：整张表
    for (auto s : scores) {
        std::println("{} 分 → {}", s, grade_of(s));   // 函数里喊函数
    }
}
int main() { report({85, 92, 58, 73}); return 0; }` },
        { t: `p`, text: `整个程序只有那一处是新的：花括号里的 grade_of(s)。s 是 for 每转一圈从串里拿出的一个分数，把它递过去，等等级词还回来，直接塞进打印的第二个格子。链条是 main → report → grade_of：main 只开个头，report 管一张表，grade_of 管一个数，三层各管一段，谁也不越界。跑出来是 85 分 → 良好、92 分 → 优秀、58 分 → 及格 —— 58 走的是最后那句兜底 return，这里我把「不及格」那档删掉了，正好说明上一环的规矩改了，下一环只管拿新结果，一行都不用动。` },
        { t: `h2`, text: `演示 3 · 链条上再挂一个零件：先算平均再印表` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <vector>
double average(std::vector<int> scores) {
    double sum = 0;                        // 用小数盒装，除法才不砍尾巴
    for (auto s : scores) sum += s;
    return sum / scores.size();
}
void report(std::vector<int> scores) {
    std::println("平均 {} 分", average(scores));   // 这里先喊 average
    for (auto s : scores) std::println("{} 分", s);
}
int main() { report({85, 92, 58, 73}); return 0; }` },
        { t: `p`, text: `现在 report 里喊了两个零件：先喊 average 印表头，再自己转循环印每一行。这就是拆活的手感 —— 加新活儿不是往老函数里塞十行，而是新造一个函数、在需要它的位置喊一声。顺带埋个坑：sum 声明成 double 而不是 int，因为两个整数相除会把小数位砍干净，269 除以 4 还你一个 67 —— 盒子的类型决定结果的样子，第 11 课就吃过这个苦头。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `**零件写在下面，喊人写在上面**：报错是 use of undeclared identifier 'grade_of'。编译器一遍扫到底，读到调用那行还没见过这个函数，自然不认。按源稿那个顺序摆：被喊的在上，main 在下。`,
          `**声明返回 std::string，却 return 一个数**：error: no viable conversion from returned value of type 'int' to function return type 'std::string'。想还「良好」就写 return "良好"，别把分数本身还出去。`,
          `**只写名字、忘了后面那对括号**：写 grade_of 不算喊人，只是提到这个名字 —— 编译器报 function reference is not a callable expression，或者在塞给 println 的格子里嫌类型不对。`,
          `**递进去的不是串**：report(85) 得 error: no matching function for call to 'report'。report 要一整串分数，单个 int 配不上那个 std::vector 参数。`,
          `**在函数里改了参数、外面毫无反应**：不报错，纯逻辑错 —— 递进去的是复印件。这是本课的天花板，以后再讲怎么让函数碰到原件本身。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `1. 写 double average（std::vector<int>）求平均分，在 report 里用上`,
          `2. 给 grade_of 加一档：>=95 返回「顶呱呱」`,
          `3. 延伸：再造一个零件 best，收一整串分数、还一个最高分，让 report 在表头印一行「最高 X 分」。写完想想：如果 grade_of 里也去喊 best，链条又多一层，什么时候该停？`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：大活不是写出来的，是拆出来的 —— 一个函数只干一件小事，需要别的活儿就喊那个专门的函数，链条上每一层都只看得见自己下面那一层。` }
      ]
    },
    {
      id: `c56`, title: `第 56 课 · lambda：临时小函数`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：认识不起名字的一次性小函数 —— 中括号开头、圆括号收参数、花括号装身体的 lambda，学会用 auto 接住它、再照常喊。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `第 51 课起的函数有名有姓，写在所有函数外面，谁都能喊。可有些活儿小得可怜：把两个数乘一下、把一行字包装成加油口号，用完就再也不碰。为这种活儿正式起名字、端到文件上方去，等于为了钉一颗钉子专门盖一间工具房。lambda 就是你手边那颗钉子：需要的时候当场捏出来，用完就地丢掉。写法是 auto mul = 中括号 圆括号 花括号 那一段，前半句跟第 4 课那句 auto 声明一模一样，只有等号右边那位是新的。` },
        { t: `p`, text: `把它拆成三截看就不怕了。第一截是中括号，叫捕获清单，本课一律空着 —— 空着就是「我不伸手拿外面的东西」。第二截是圆括号，写参数表，规矩和第 51 课完全一样。第三截是花括号，写身体，爱 return 就 return，爱打印就打印。后两截加在一起就是函数的头和身子，lambda 只是前头多挂一个中括号、省掉了名字 —— 所以你早会的东西一样都不作废。` },
        { t: `p`, text: `返回值这一处确实和普通函数不同：函数的返回类型必须写在名字前面，lambda 不用写 —— 编译器读你身体里那句 return，从还出去的东西反推类型。只有一句 return，或者干脆没有 return，它都推得出来；一旦几条路还出不同形状的东西就翻脸，报错长得像 inconsistent types in return。所以本课每个 lambda 都只留一条出货口。` },
        { t: `ul`, items: [
          `**名字**：普通函数天生有名字；lambda 没有，塞进一个变量，那个变量才成了它的名字。`,
          `**位置**：普通函数写在所有函数外面；lambda 写在函数肚子里，紧挨着用它的那几行 —— 「现做现用」就是这个意思。`,
          `**返回类型与取舍**：lambda 的返回类型由那句 return 反推，写 auto 接住它。只用一次、三五行的小逻辑用它；要用在两处以上，或者身体长到十行开外，就老老实实定义函数 —— 名字和位置本来就是给人省心的。`
        ]},
        { t: `svg`, caption: `左边是正式工厂：定义一次、挂上名字、哪儿都能喊；右边是手边现做的小工具，用完就随那一层作用域丢掉`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260" font-family="sans-serif">
  <text x="20" y="24" font-size="14" font-weight="700" fill="#142639">两种「把活儿装起来」的方式</text>
  <rect x="20" y="40" width="280" height="186" rx="10" fill="#eaf2fb" stroke="#00599c" stroke-width="2"/>
  <text x="160" y="64" font-size="13" font-weight="700" fill="#00599c" text-anchor="middle">函数：正式工厂</text>
  <rect x="46" y="80" width="228" height="34" rx="6" fill="#ffffff" stroke="#8fa7c4" stroke-width="1.5"/>
  <text x="160" y="102" font-size="12" fill="#142639" text-anchor="middle">写在所有函数外面</text>
  <rect x="46" y="124" width="228" height="34" rx="6" fill="#ffffff" stroke="#8fa7c4" stroke-width="1.5"/>
  <text x="160" y="146" font-size="12" fill="#142639" text-anchor="middle">有名字　能被喊很多次</text>
  <rect x="46" y="168" width="228" height="40" rx="6" fill="#ffffff" stroke="#8fa7c4" stroke-width="1.5"/>
  <text x="160" y="184" font-size="12" fill="#142639" text-anchor="middle">改了它，所有喊它的地方</text>
  <text x="160" y="200" font-size="12" fill="#142639" text-anchor="middle">一起跟着变</text>
  <rect x="340" y="40" width="280" height="186" rx="10" fill="#fdf0e6" stroke="#b8232f" stroke-width="2"/>
  <text x="480" y="64" font-size="13" font-weight="700" fill="#b8232f" text-anchor="middle">lambda：手边现做</text>
  <rect x="366" y="80" width="228" height="34" rx="6" fill="#ffffff" stroke="#d8a98f" stroke-width="1.5"/>
  <text x="480" y="102" font-size="12" fill="#142639" text-anchor="middle">写在函数肚子里，紧挨着用它的行</text>
  <rect x="366" y="124" width="228" height="34" rx="6" fill="#ffffff" stroke="#d8a98f" stroke-width="1.5"/>
  <text x="480" y="146" font-size="12" fill="#142639" text-anchor="middle">起先没名字，装进 auto 才有名字</text>
  <rect x="366" y="168" width="228" height="40" rx="6" fill="#ffffff" stroke="#d8a98f" stroke-width="1.5"/>
  <text x="480" y="184" font-size="12" fill="#142639" text-anchor="middle">那一层作用域结束，工具跟着丢掉</text>
  <text x="480" y="200" font-size="12" fill="#57677c" text-anchor="middle">下次还要用？那就该盖工厂了</text>
  <text x="20" y="248" font-size="12" fill="#57677c">一句判断：这段逻辑我只用一次，还是会被喊很多次？</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `为什么允许函数不起名字？因为「逻辑」和「名字」本来就没绑在一起。你早就在写没名字的值：一个 85、一串文字，都是当场写出来递给别人，没谁要求它们先注册户口。lambda 就是把这件事推广到「行为」上 —— 以前递出去的是数字和文字，现在递出去的是一段计算。这个口子一开，标准库里那堆能收「行为」的函数就都用得上了，那是以后再讲的事；本课先把「装进变量、加括号喊」这一步踩稳。` },
        { t: `p`, text: `为什么必须用 auto？lambda 的真实类型是编译器现造的一个内部名字，人写不标准，所以标准给的路就是让 auto 去接。你把它当成「一把工具」理解就够了：mul 这个变量里存的不是答案，是那台会乘的小机器；加上一对圆括号、把原料塞进去，机器才转起来。这正是本课最容易混的地方，演示里专门留了现场。` },
        { t: `h2`, text: `演示 1 · 装进变量，再照常喊` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
int main() {
    auto mul = [](int x, int y) {          // 现做一把小工具
        return x * y;
    };
    std::println("6 × 7 = {}", mul(6, 7)); // 加上括号它才真跑
    auto cheer = [](std::string name) {    // 再做一把：只管喊口号
        std::println("{} 最棒！", name);
    };
    cheer("小明");
    return 0;
}` },
        { t: `p`, text: `源稿那两把工具都在里面。mul 有参数、有 return，跟正式函数一个样；cheer 一个参数、身体里只有打印，没有 return —— 它不交还任何东西，这种「只干活不交货」的写法你第 51 课就见过，函数的返回类型写成 void 就是它，lambda 这里连 void 都省了，编译器从「你一句 return 都没写」推出来。跑出来是 6 × 7 = 42 和 小明 最棒！两行。注意 mul 那行末尾：花括号后面紧跟一个分号，因为整句是一条声明语句，不是函数定义。` },
        { t: `h2`, text: `演示 2 · 同一天里，早晚都能喊` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    auto triple = [](int x) {
        return x * 3;
    };
    auto first = triple(5);                // 现在喊，拿到 15
    std::println("存下来的结果：{}", first);
    std::println("当场喊：{}", triple(100));        // 同一把工具随时再喊
    bool ok = [](int x) { return x > 20; }(15);     // 写完立刻喊，名字都省了
    std::println("15 过 20 了吗？{}", ok);
    return 0;
}` },
        { t: `p`, text: `三件事一次摊开。第一，工具做好后可以先喊一步、把结果存进 first，之后打印的始终是那个 15 —— 存的是答案，不是工具。第二，一把工具能被喊很多次，这里就喊了两次，「只用一次」不是硬规定，只是最常见的用法。第三，最后一行那个连名字都没起的 lambda：花括号一收、紧跟上一对圆括号，它就跑了，还回来的真假直接进 bool 变量；15 不大于 20，所以是 false。这种「写完立刻用」看着帅，读的人要多反应两秒，平时还是先存进变量更厚道。` },
        { t: `h2`, text: `演示 3 · 循环里反复喊同一把` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
#include <vector>
int main() {
    std::vector<std::string> names = {"小明", "小红", "小刚"};
    auto hello = [](std::string who) {
        std::println("你好，{}！", who);    // 不 return：只要干活
    };
    for (auto name : names) hello(name);   // 一把工具喊三次
    std::println("这一行跑完，hello 就没了");
    return 0;
}` },
        { t: `p`, text: `打印顺序是三行问候加最后那句感叹。这里要记住的是寿命：mul、hello 这些名字和 main 同生死 —— main 一结束它们就跟着没了，别的函数想喊也喊不到；而第 51 课那些函数从生到死都在。所以「这段逻辑只在这一层用、用完不该留下」的时候，lambda 是干净的那个选择。反过来，如果你发现自己在两处不同的函数里各抄了一遍同样的 lambda，那就是身体在喊「把我写成函数」。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `**打印时忘了加那对括号**：写 std::println("{}", mul) 会报 no matching function for call to 'println'，或者说这个类型没法格式化。你递的是那把工具本身，不是它跑出来的结果 —— 工具不会自己变成数字，必须加上括号、把原料给够。`,
          `**中括号整个忘了**：直接写 auto mul = 然后圆括号参数、花括号身体，报 expected expression 之类。那对中括号是 lambda 的身份证，少它整句就成了对不上号的括号。`,
          `**花括号后面的分号丢了**：报错很直白 —— expected ';' after lambda expression。这是一条声明语句的结尾，不是函数定义的结尾，第 51 课那个习惯在这儿要拐个弯。`,
          `**身体里用了外面的变量，中括号却空着**：报 use of undeclared identifier。空着就是声明「不拿外面的东西」，硬用一定被拦 —— 下一课专讲怎么把外面的变量带进来。`,
          `**逻辑越写越长还硬塞 lambda**：身体二十行，读的人得在脑子里维护两层上下文。名字和位置本来就是另一种省事，别为时髦把活儿藏进匿名的小盒子里。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `1. 写 lambda 求平方，测 3、9、16`,
          `2. 写 lambda 判断及格（>=60 返回 true）`,
          `3. 延伸：把第 2 题那把工具改造成打印型 —— 传一个分数，直接打印「85 分，及格」或「42 分，要补考」，不要 return。写完对比一下：同样一件事，返回 true 那把和直接打印那把，哪把更容易在别处复用？`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：lambda 是现做现用的一次性小工具 —— 中括号空着、圆括号收原料、花括号写身体，用 auto 接住，加上那对括号它才真跑。` }
      ]
    },
    {
      id: `c57`, title: `第 57 课 · lambda 捕获变量：把外面的值抄进小口袋`,
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：填上那张申领单 —— 中括号里写清要带谁，lambda 就把那个变量的值复印一份带在身上；记住带走的始终是复印件，而且是定义那一刻的复印件。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `上一课结尾那句「本课一律空着」其实欠了你一个交代。你要是早动手试过，多半已经撞过一次：main 里有个 int base，lambda 里想用，中括号空着，编译器当场甩来 use of undeclared identifier 'base'。这不是它刁钻 —— 普通函数本来就看不见别人肚子里的局部变量，lambda 生在一个函数肚子里，也一样看不见它出生地外面的东西，除非它开口要。中括号就是那张开口要东西的申领单：写 [base] 进去，意思直白得很 —— 把 base 抄一份带进去。` },
        { t: `p`, text: `源稿那个程序把「抄」这件事演得极清楚，注意它跑出来的第二个数。main 里 base 先是 100，接着定义 add_base，中括号点了 base 的名；然后打印 100 加 25，得 125，没毛病。有意思的是后面：base 被改成 200，再喊 add_base 加 1 —— 屏幕上是 101，不是 201。也就是说这把工具用的不是眼前那个 200，而是它出生时抄下的那个 100。抄的时机是「定义那一行被执行的那一刻」，跟什么时候喊它没关系。类比一句就够：你给同事拍了张照片，之后你换了衣服，照片里当然还是那件旧的。` },
        { t: `p`, text: `所以值捕获带来的是一整套安全感：包里那份跟原件彻底断了关系，原件后来被改成什么样、甚至它所在那一层已经结束，都不影响这把工具算出来的结果。反过来说它也绝不可能是最新值 —— 想要最新，就得每次把新东西从参数递进去。两条各管一半：参数管现场要新东西，中括号管把出生那一刻的东西留住。别把中括号当成省事写法，它是有意为之的留住。` },
        { t: `ul`, items: [
          `**抄的时机**：执行到定义那一行就抄完了，不是喊它的时候才抄。`,
          `**抄的范围**：只有中括号里点了名字的才带得走；没点名的，在里面照样是陌生变量。`,
          `**抄的性质**：复印件，只读。在里面拿它做加法、拼字符串随便，想给它赋值就被拦。`,
          `**能点好几个**：中括号里用逗号把名字排开，一次抄一叠也行，演示 2 就抄了两个。`
        ]},
        { t: `svg`, caption: `闭包：定义那一刻把外面的变量复印进自己的口袋，之后原件怎么变，口袋里还是那一份`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 270" font-family="sans-serif">
  <text x="20" y="24" font-size="14" font-weight="700" fill="#142639">t1：定义 add_base 的那一刻</text>
  <rect x="20" y="40" width="150" height="52" rx="8" fill="#eaf2fb" stroke="#00599c" stroke-width="2"/>
  <text x="95" y="60" font-size="12" font-weight="700" fill="#00599c" text-anchor="middle">外面的 base</text>
  <text x="95" y="80" font-size="13" font-weight="700" fill="#142639" text-anchor="middle">100</text>
  <line x1="170" y1="66" x2="248" y2="66" stroke="#57677c" stroke-width="2" stroke-dasharray="6 4"/>
  <polyline points="240,60 248,66 240,72" fill="none" stroke="#57677c" stroke-width="2"/>
  <text x="209" y="58" font-size="12" fill="#57677c" text-anchor="middle">复印</text>
  <rect x="256" y="36" width="220" height="120" rx="10" fill="#fdf0e6" stroke="#b8232f" stroke-width="2"/>
  <text x="366" y="56" font-size="12" font-weight="700" fill="#b8232f" text-anchor="middle">add_base 的小口袋</text>
  <rect x="278" y="68" width="176" height="32" rx="6" fill="#ffffff" stroke="#d8a98f" stroke-width="1.5"/>
  <text x="366" y="88" font-size="12" fill="#142639" text-anchor="middle">抄来的 base　值为 100</text>
  <rect x="278" y="108" width="176" height="32" rx="6" fill="#ffffff" stroke="#d8a98f" stroke-width="1.5"/>
  <text x="366" y="128" font-size="12" fill="#142639" text-anchor="middle">每次喊它另收一个 x</text>
  <text x="500" y="66" font-size="12" fill="#142639">喊 add_base 加 25</text>
  <text x="500" y="84" font-size="13" font-weight="700" fill="#2e7d32">100 + 25 = 125</text>
  <text x="20" y="184" font-size="14" font-weight="700" fill="#142639">t2：外面把 base 改成 200，再喊一次</text>
  <rect x="20" y="200" width="150" height="52" rx="8" fill="#eaf2fb" stroke="#00599c" stroke-width="2"/>
  <text x="95" y="220" font-size="12" font-weight="700" fill="#00599c" text-anchor="middle">外面的 base</text>
  <text x="95" y="240" font-size="13" font-weight="700" fill="#142639" text-anchor="middle">200</text>
  <rect x="256" y="200" width="220" height="52" rx="10" fill="#fdf0e6" stroke="#b8232f" stroke-width="2"/>
  <text x="366" y="232" font-size="12" fill="#142639" text-anchor="middle">口袋里仍是 100　算出 101</text>
  <text x="500" y="216" font-size="12" fill="#b8232f">两个盒子之间</text>
  <text x="500" y="234" font-size="12" fill="#b8232f">早就断了线</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `这套「定义时抄一份、打包带走」的做法，行业里有个名字叫闭包。为什么偏偏设计成抄，而不是让它回头去看原件？因为 lambda 常常活得比那一行长：它被存进变量、被递出去、被晚一点再喊，等它真跑起来，出生那一层里的盒子可能已经散了。与其让它回头去够一个可能不存在的东西，不如趁现场还在眼前，把需要的值复印进自己的口袋。这样它每次算的都一样、都可复现 —— 你不用惦记它用的是几点钟的值。中括号必须写明白要什么，就是这套设计的收费站：申领单上没名字，它就是拿不到。` },
        { t: `p`, text: `复印件只读这一点也是同一套逻辑的延伸：口袋里的东西是它自己的记忆，随便用，但不许偷偷改写记忆来骗后面的人。想改，就在身体里另开一个盒子（本课就这么用）；想让改动传回外面那个盒子，那是另一套机制的活儿，以后再讲。先把「抄来的只能读」当成一条不用争的规矩记住。` },
        { t: `h2`, text: `演示 1 · 源稿现场：复印件停在 100` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int base = 100;
    auto add_base = [base](int x) {         // 定义这一刻，抄一份 base
        return base + x;
    };
    std::println("100 + 25 = {}", add_base(25));
    base = 200;                            // 原件换了衣服
    std::println("base 已是 200，但按抄的 100 算：{}", add_base(1));
    return 0;
}` },
        { t: `p`, text: `两行输出是 100 + 25 = 125 和 base 已是 200，但按抄的 100 算：101。中间那句 base = 200 是这一课的主角：它写在两次喊之间，对外面的盒子做了真改动，却对结果毫无影响。你要是把中括号里的 base 删掉，第二行会算不出来 —— 编译不过；把它留着，就是刚才那个 101。这组对照值得亲手跑一遍，比看十遍解释都管用。` },
        { t: `h2`, text: `演示 2 · 一次抄两个，连文字也一起抄` },
        { t: `code`, lang: `c++`, code: `#include <print>
#include <string>
int main() {
    int base = 100;
    std::string tag = "加分";
    auto show = [base, tag](int x) {       // 申领单上点了两个名字
        std::println("{}：{} + {} = {}", tag, base, x, base + x);
    };
    base = 200;                            // 原件改衣服
    tag = "减分";                          // 另一个原件也改
    show(5);                               // 用的还是两张旧照片
    return 0;
}` },
        { t: `p`, text: `打出来是 加分：100 + 5 = 105 —— 后面那两处改动一点没露脸。两个名字用逗号排在中括号里，各抄各的，谁也没牵连谁。这里抄的还是一整只 std::string：复印件是完完整整的一份，不是「指过去看一眼」，所以 tag 后来变成减分，包里那串字仍是加分。顺带一个现实提醒：抄的是整只盒子，装的东西越大，抄的那一下越费事，攒一大堆数据时别的不说，先别把整串都塞进中括号。` },
        { t: `h2`, text: `演示 3 · 想动它？在包里另开一个盒子` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int base = 100;
    auto bump = [base](int x) {
        int inside = base + x;             // 新盒子，随便改
        inside = inside * 2;
        return inside;
    };
    std::println("喊两次：{} 和 {}", bump(1), bump(2));
    std::println("外面的 base 仍是：{}", base);
    return 0;
}` },
        { t: `p`, text: `结果 202 和 204，外面那个 base 稳稳当当还是 100。这里想给你的手感是：抄来的东西只读，但你可以拿它当原料，在身体里现开盒子接着算 —— 该留的记忆留着，该改的另存一份改。两次喊 bump，中间没有谁偷偷累积了什么，每次都是从这个 100 重新开始，这就是「抄的是值」的干净之处；哪天你想要一个会累积的计数器，得换别的写法，那是以后再讲的一课。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `**中括号空着却用了外面的变量**：use of undeclared identifier 'bonus'。根因：申领单上没写名字，lambda 就压根不知道有这号变量。补上名字即可。`,
          `**以为它是实时看的**：不报错，纯算错。跑出来是 101，你心里预期是 201。根因：抄的那一刻定了值，之后原件怎么改都不关它的事 —— 这一条是本科最贵的一条，务必亲手跑一遍演示 1。`,
          `**想在里面改那份复印件**：error: cannot assign to variable 'base' in lambda capture of type 'const int'（clang 的说法带 captured by a copy 那一段）。根因：抄来的东西是只读的，想改就另开一个盒子。`,
          `**变量声明在 lambda 后面**：int base 写在那句 auto 之后，中括号里点名点名不到，报错和第一条长得一样。顺序规矩和第 55 课那句「先见后喊」一个道理。`,
          `**指望两次喊它能把上次的改动攒下来**：复印件每次都是定义那一刻的旧值，攒不出累积效果。这不是 bug，是这一课写法的本性；需要攒的话，先想想把这个数当参数递进去。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `1. 定义 int bonus = 5，写 lambda [bonus]（int s）返回 s + bonus`,
          `2. 想永远用最新值怎么办？提示：& 捕获（后面会讲）`,
          `3. 延伸：把演示 1 的两句打印调换顺序 —— 先 base = 200，再定义 add_base，然后喊它。猜猜结果变成几，再跑一遍验证。猜对了说明你真的懂了「抄的时机」这件事。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：中括号里点名的那些变量，是在定义那一刻被复印进 lambda 的口袋 —— 用的是复印件，只读，而且永远是那份旧的。` }
      ]
    },
    {
      id: `c58`, title: `第 58 课 · 引用基础：给变量起外号`,
      allowConstructs: [`取地址 &x`],   // 源稿那句「同一个盒子吗」用 & 问地址，正文原理讲解与演示 2 已当场分清两种 &
      blocks: [
        { t: `tip`, color: `blue`, text: `本课目标：看懂 int& alias = score; 这一行不是又造一个盒子，而是给同一个盒子添第二个名字 —— 读它、写它、问它的地址，全部落在本人身上。` },
        { t: `h2`, text: `原理讲解` },
        { t: `p`, text: `从这一课起，往后几篇讲的都是同一件事的另一半。第 55 课末尾给你留过一句天花板：把值递进函数，函数里改得再欢，外面一点动静没有，因为进去的是复印件。复印件的毛病就是碰不到原件。要摸原件，得先学会 C++ 里一个叫「引用」的东西 —— 名字听着玄，其实是件天天发生的事：给人起外号。张三的外号叫三胖，揍三胖一顿，疼的是张三，因为压根就是同一个人。C++ 里写 int& alias = score;，之后的 alias 和 score 就是同一个盒子的两个名字。` },
        { t: `p`, text: `怎么读这一行：类型那截写 int&，那个 & 是类型的一部分，读作「一个 int 的引用」；名字随你起，写 nickname、写 r 都行；等号右边必须摆一个已经存在、类型也对得上的变量。同一个 & 号在表达式里另有用途 —— 站在类型后面是起外号，站在变量前面是问地址，本课最容易混的就是这一眼。源稿那句比较地址用的正是后者。` },
        { t: `p`, text: `它跟「再声明一个变量、把值抄过去」的区别，就是本科全部的重点。int copy = original; 造了第二个盒子，里面放一份一样的值，此后两条路各走各的：copy 改成 77，original 一点感觉没有。int& nickname = original; 一个都没多造 —— 它就是 original 本人，只是换了个叫法。你写 nickname = 88，等于写 original = 88。判一句话就能分清：这行让盒子变多了，还是让名字变多了？盒子变多的是复制，名字变多的是别名。` },
        { t: `ul`, items: [
          `**盒子数量**：复制是两个盒子，各装各的值；引用是一个盒子、两个名字。`,
          `**必须当场指认**：声明引用的那一行就得给出本人，不能先声明一个空着待补 —— 外号不能悬空挂在没人身上。`,
          `**认了就改不了**：alias 这一辈子指的就是 score，中途想换指向另一个盒子，靠赋值是换不来的，只能另声明一个名字。`,
          `**类型要对上**：int& 只能给 int 的盒子当外号；拿它去认一个 double 的盒子，编译器当场拦下。`
        ]},
        { t: `svg`, caption: `上面一组：复制值造出第二个盒子，此后各改各的；下面一组：两个名牌拴着同一个盒子，改哪个名字都是改它`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" font-family="sans-serif">
  <text x="20" y="22" font-size="14" font-weight="700" fill="#b8232f">int copy = original;　——　两个盒子</text>
  <rect x="40" y="36" width="180" height="46" rx="8" fill="#eaf2fb" stroke="#00599c" stroke-width="2"/>
  <text x="130" y="56" font-size="12" font-weight="700" fill="#00599c" text-anchor="middle">original</text>
  <text x="130" y="74" font-size="13" fill="#142639" text-anchor="middle">10</text>
  <rect x="300" y="36" width="180" height="46" rx="8" fill="#f4f7fc" stroke="#57677c" stroke-width="2"/>
  <text x="390" y="56" font-size="12" font-weight="700" fill="#57677c" text-anchor="middle">copy（新盒子）</text>
  <text x="390" y="74" font-size="13" fill="#142639" text-anchor="middle">10</text>
  <line x1="220" y1="59" x2="298" y2="59" stroke="#57677c" stroke-width="2"/>
  <polyline points="290,53 298,59 290,65" fill="none" stroke="#57677c" stroke-width="2"/>
  <text x="259" y="50" font-size="12" fill="#57677c" text-anchor="middle">抄一份</text>
  <text x="500" y="56" font-size="12" fill="#b8232f">copy 改成 77</text>
  <text x="500" y="74" font-size="12" fill="#b8232f">original 还是 10</text>
  <text x="20" y="126" font-size="14" font-weight="700" fill="#2e7d32">int& alias = score;　——　一个盒子两个名字</text>
  <rect x="40" y="142" width="180" height="46" rx="8" fill="#eaf2fb" stroke="#00599c" stroke-width="2"/>
  <text x="130" y="162" font-size="12" font-weight="700" fill="#00599c" text-anchor="middle">名牌 score</text>
  <text x="130" y="180" font-size="12" fill="#142639" text-anchor="middle">本人</text>
  <rect x="40" y="204" width="180" height="46" rx="8" fill="#f2f6f2" stroke="#2e7d32" stroke-width="2"/>
  <text x="130" y="224" font-size="12" font-weight="700" fill="#2e7d32" text-anchor="middle">名牌 alias</text>
  <text x="130" y="242" font-size="12" fill="#142639" text-anchor="middle">外号</text>
  <rect x="300" y="168" width="200" height="62" rx="10" fill="#fdf0e6" stroke="#b8232f" stroke-width="2.5"/>
  <text x="400" y="192" font-size="12" font-weight="700" fill="#b8232f" text-anchor="middle">同一个盒子</text>
  <text x="400" y="214" font-size="14" font-weight="700" fill="#142639" text-anchor="middle">85 → 95</text>
  <line x1="220" y1="165" x2="298" y2="185" stroke="#00599c" stroke-width="2"/>
  <line x1="220" y1="227" x2="298" y2="212" stroke="#2e7d32" stroke-width="2"/>
  <text x="530" y="188" font-size="12" fill="#142639">写 alias = 95</text>
  <text x="530" y="206" font-size="12" fill="#142639">score 也是 95</text>
  <text x="20" y="284" font-size="12" fill="#57677c">一句判断：这一行让盒子变多了，还是让名字变多了？名字变多的就是别名。</text>
</svg>` },
        { t: `h2`, text: `它被设计成什么样` },
        { t: `p`, text: `C++ 把「名字」和「盒子」当成两件事：一个盒子可以挂好几个名字，可一个名字自始至终只拴着一个盒子。这套规矩留了一条不复制值就能碰到原件的路 —— 前面那些课里，每次把一整只 std::string、一整串 vector 递出去都得抄一份，量大就心疼；有了别名，只给对方一个「同一个盒子的另一个叫法」，一个字节都不用抄。往后几课专门把这条路铺到函数参数上去，本课先在 main 里把它认牢。` },
        { t: `p`, text: `再提醒一个长相：& 挨着类型写、挨着名字写都算引用，源稿那句 int& alias 和第 13 课 std::string 的写法摆在一起看，你会慢慢习惯。本课统一让 & 挨着类型，因为它说的是「这是个什么类型」，读起来最顺。别去背哪种更正式，先做到一眼认出：有那个 &，就是外号。` },
        { t: `h2`, text: `演示 1 · 源稿现场：改外号，本人跟着变` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int score = 85;
    int& alias = score;        // alias 不是新盒子，是外号
    alias = 95;                // 改外号 = 改本人
    std::println("score = {}", score);   // 95，本人被改了
    std::println("alias = {}", alias);   // 也是 95
    return 0;
}` },
        { t: `p`, text: `两行都打 95。这里没有任何「同步」动作 —— 不是改了 alias 之后程序贴心地去更新 score，而是压根只有一个盒子，你写的两次打印读的是同一格。要是把第四行换成 int alias = score;，把那个 & 抹掉，第二次打印就会变回 85：因为那一行从「起外号」降格成了「抄一份值」。这一个字母的差别就是本课的全部内容，建议你就这么改一次、跑一次，亲眼看完两版的差别。` },
        { t: `h2`, text: `演示 2 · 同一个地址：一个盒子被两个名字指着` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int a = 10;
    int& nickname = a;
    std::println("同一个盒子吗？{}", &a == &nickname);   // 地址相同 → true
    nickname = 66;                                        // 用外号改本人
    std::println("a = {}，nickname = {}", a, nickname);   // 两个都是 66
    return 0;
}` },
        { t: `p`, text: `这就是源稿那句比较：&a 和 &nickname 各问一次地址，答案是 true —— 一个盒子只有一个门牌号，两个名字问出同一个号，说明指的确实是同一格。那句「用外号把 a 改成 66 再打印」正是本课任务的答案。再钉一遍两种 &：int& nickname 里那个属于类型，说的是外号；表达式里 &a 那个是一问，问的是门牌号。` },
        { t: `h2`, text: `演示 3 · 对照实验：复制造盒子，别名不造` },
        { t: `code`, lang: `c++`, code: `#include <print>
int main() {
    int original = 10;
    int copy = original;         // 复制：又多一个盒子
    int& nickname = original;    // 外号：盒子没多，名字多了
    copy = 77;
    nickname = 88;
    std::println("original = {}", original);   // 88，被外号改的
    std::println("copy = {}", copy);           // 77，跟 original 无关
    return 0;
}` },
        { t: `p`, text: `两行输出把两条路摊开：original 是 88，copy 是 77。copy 那次赋值改的是自己的新盒子，跟 original 半点关系没有；nickname 那次赋值改的就是 original 本人。所以「看起来都像等号」在这张纸上完全不是一回事 —— 左边是复制出来的名字，写它写自己；左边是别名，写它写别人。以后你在函数参数上看见这个差别，会一下子明白为什么有些地方改了外面却不动，本课这点手感就是给那一课铺路。` },
        { t: `h2`, text: `常见坑` },
        { t: `ul`, items: [
          `**声明引用却忘了指认本人**：写 int& r; 想之后再补，报错是 'r' declared as a reference but not initialized。引用必须先有本人才能存在，一句就得写成 int& r = a;。`,
          `**想给外号换本人**：写了 int& r = a; 再写 r = b; 以为外号改指 b —— 不报错，但改的是 a 的值！引用身上的等号永远是「给本人赋值」，不是「重新指认」；要换个盒子当外号，只能另声明一个名字。`,
          `**类型对不上**：拿 double& 去认一个 int 的盒子，error: cannot initialize a variable of type 'double &' with an lvalue of type 'int'。外号必须和本人同一种类型。`,
          `**拿临时值当本人**：int& r = 10; 报 cannot initialize a variable of type 'int &' with an rvalue of type 'int'。10 只是个值、不是盒子，外号没处挂。`,
          `**两种 & 分不清**：同一个符号打了两份工。认的时候看它站在哪儿 —— 站在类型后面是起外号，站在变量前面是问地址。`
        ]},
        { t: `h2`, text: `任务` },
        { t: `ul`, items: [
          `1. 声明 int a = 10; 用引用把它改成 66 并打印`,
          `2. 延伸：给同一个 a 再起第二个外号，比如 nickname2；用 nickname2 把它改成 100，用第一个外号打印出来。跑完数一数：这一共是几个盒子、几个名字？`,
          `3. 延伸：先写 int a = 10; 和 int b = 20;，再写 int& r = a;，然后写 r = b;。猜猜 a 和 b 各变成几 —— 想清楚再跑，跑完跟自己的猜测对答案。`
        ]},
        { t: `tip`, color: `green`, text: `本课一句话：引用是给变量起的外号 —— 盒子只有一个，名字多了一个；改外号就是改本人，取地址两个都一样。` }
      ]
    }
  ]
};
