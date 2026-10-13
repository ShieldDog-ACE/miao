/* 闸的自检样本（第九轮）：这份文件故意写坏，用来证明 cpp-audit 真的会红、并且红在哪几条。
   埋的七条：① 梗「椰子蛋」 ② 前向引用（第 40 课） ③ 提前用 vector 与标准算法
   ④ 提前用指针声明 ⑤ SVG 标签不配平 ⑥ SVG 缺 caption ⑦ 字符串里混进反引号（用双引号写才跑得起来）。
   再加一条 H（能编译）：第二段 main 用了 std::string 与 vector 却没包头文件 —— 这一条是第八轮之后补的，
   因为 H 表在改（views:: 那一族不该被判成标准算法），改坏了得有人立刻红给你看。
   跑法：node dev/tools/cpp-audit.cjs --part dev/tools/cpp-gate-fixtures/bad-part.js
   期望：退出码 1，且逐条点名。*/
window.MIAO_CPP_P99 = {
  chapters: [
    {
      id: `c02`, title: "第 2 课 · 坏样本：`反引号混进来了`",
      blocks: [
        { t: `tip`, color: `blue`, text: `这一课买了一份椰子蛋，准备在第 40 课讲。` },
        { t: `h2`, text: `演示 1` },
        { t: `code`, lang: `c++`, code: `#include <print>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    std::vector<int> v = {3, 1, 2};\n    std::sort(v.begin(), v.end());\n    int *p = nullptr;\n    std::println("{}", v.size());\n    return 0;\n}` },
        { t: `h2`, text: `演示 2（H 闸样本：写了 main 却不请客）` },
        { t: `code`, lang: `c++`, code: `int main() {\n    std::string s = "没包 <string>";\n    std::vector<int> v;\n    std::println("{}", s);\n    return 0;\n}` },
        { t: `svg`, code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect x="1" y="1" width="4" height="4"/><g><text x="1" y="2">这一张图里藏了一句：椰子蛋，还要在第 40 课讲</text></svg>` },
        { t: `p`, text: `上面这张图少一个闭合、也没有图注。` }
      ]
    }
  ]
};
