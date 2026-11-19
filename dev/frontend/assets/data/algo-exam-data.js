/* 喵站 · 考试 · 算法题库（纯数据，进 #/exams 才拉）
 *
 * 这不是课末考试：每个题是一个独立的小算法题，读者在站内 Python 沙箱里写函数，
 * 「模拟运行」跑前 samples 条（题面里公开的样例），「提交」把全部用例都跑一遍。
 * 判分与测量在 algo-judge.js；题面渲染在 algo-ui.js。
 *
 * 数据口径（加题时必须一起满足，algo-test.js 会逐条查）：
 *   id        唯一，地址栏用它（#/exams/<id>），只用小写字母、数字和短横线
 *   no        题号，列表按它排序
 *   difficulty 只能是「简单 / 中等 / 困难」
 *   lang      历史字段（编辑器语言）；列表分类已改读 topic
 *   topic     题型，只能是 数组 / 哈希表 / 数学 / 栈 / 双指针 / 二分查找 / 动态规划 / 滑动窗口 / 排序
 *   fn        要读者实现的函数名；判分器照这个名字调用
 *   samples   前几条 tests 是公开样例，其余是隐藏用例（提交时才跑）
 *   tests[].args   直接转成 Python 实参；只放 number / string / boolean / null / 数组
 *   tests[].expect 返回值；判分用 JSON 深比较，顺序不同不算对
 *   reference 参考解，只给判分器与回归自测用，界面不展示
 *
 * 版权：题面全部本站自己写的中文，没有照抄力扣原文；两数之和、接雨水这些是同名经典题，
 * 只借用题目本身（算法题本身不受版权保护），例子与数字都是我们自己配的。
 */
window.MIAO_ALGO = {
  version: 1,
  problems: [
    {
      id: "two-sum",
      no: 1,
      title: "两数之和",
      difficulty: "简单",
      lang: "python3",
      topic: "哈希表",
      fn: "two_sum",
      statement: [
        { t: "p", text: "给定一个整数数组 nums 和一个目标值 target，请找出数组中和为 target 的两个整数，并返回它们的下标。每个输入只会有一个答案，同一个元素不能使用两次。" },
        { t: "example", input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", note: "nums[0] + nums[1] = 2 + 7 = 9，所以返回下标 0 和 1。" },
        { t: "example", input: "nums = [3, 2, 4], target = 6", output: "[1, 2]" },
        { t: "p", text: "返回的下标请按从小到大的顺序排列。可以用两层循环直接找，也可以边扫边把见过的数记进字典，让后半段只查一次。" },
        { t: "constraints", items: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9", "只会存在一个有效答案"] }
      ],
      starter: "def two_sum(nums, target):\n    # 在这里写代码\n    pass\n",
      samples: 2,
      tests: [
        { args: [[2, 7, 11, 15], 9], expect: [0, 1] },
        { args: [[3, 2, 4], 6], expect: [1, 2] },
        { args: [[3, 3], 6], expect: [0, 1] },
        { args: [[-1, -2, -3, -4, -5], -8], expect: [2, 4] },
        { args: [[0, 4, 3, 0], 0], expect: [0, 3] },
        { args: [[2, 5, 5, 11], 10], expect: [1, 2] }
      ],
      reference: "def two_sum(nums, target):\n    seen = {}\n    for i in range(len(nums)):\n        need = target - nums[i]\n        if need in seen:\n            return [seen[need], i]\n        seen[nums[i]] = i\n    return []\n"
    },
    {
      id: "palindrome-number",
      no: 2,
      title: "回文数",
      difficulty: "简单",
      lang: "python3",
      topic: "数学",
      fn: "is_palindrome",
      statement: [
        { t: "p", text: "给定一个整数 x，如果它从左往右读和从右往左读完全相同，返回 True，否则返回 False。负数不是回文数。" },
        { t: "example", input: "x = 121", output: "True", note: "121 倒过来还是 121。" },
        { t: "example", input: "x = -121", output: "False", note: "负数前面有减号，倒过来读不成同一个数。" },
        { t: "p", text: "最直接的办法是转成字符串再比较，也可以反复取余把数字倒过来拼。注意 10 倒过来是 1，不是回文数。" },
        { t: "constraints", items: ["-2^31 <= x <= 2^31 - 1"] }
      ],
      starter: "def is_palindrome(x):\n    # 在这里写代码\n    pass\n",
      samples: 2,
      tests: [
        { args: [121], expect: true },
        { args: [-121], expect: false },
        { args: [10], expect: false },
        { args: [0], expect: true },
        { args: [12321], expect: true },
        { args: [1000021], expect: false }
      ],
      reference: "def is_palindrome(x):\n    if x < 0:\n        return False\n    s = str(x)\n    return s == s[::-1]\n"
    },
    {
      id: "valid-parentheses",
      no: 3,
      title: "有效的括号",
      difficulty: "简单",
      lang: "python3",
      topic: "栈",
      fn: "is_valid",
      statement: [
        { t: "p", text: "给定一个只包含 ()、[]、{} 的字符串 s，判断括号是否有效：左括号必须用同类型的右括号闭合，并且闭合顺序不能交叉。" },
        { t: "example", input: 's = "()[]{}"', output: "True" },
        { t: "example", input: 's = "([)]"', output: "False", note: "圆括号还没闭合就先去闭合方括号，顺序交叉了。" },
        { t: "p", text: "用一个列表当栈：遇到左括号就压进去，遇到右括号就看栈顶是不是同类型的左括号。最后栈为空才算有效。" },
        { t: "constraints", items: ["0 <= s.length <= 10^4", "s 只由 ()[]{} 组成"] }
      ],
      starter: "def is_valid(s):\n    # 在这里写代码\n    pass\n",
      samples: 2,
      tests: [
        { args: ["()"], expect: true },
        { args: ["()[]{}"], expect: true },
        { args: ["(]"], expect: false },
        { args: ["([)]"], expect: false },
        { args: ["{[]}"], expect: true },
        { args: [""], expect: true }
      ],
      reference: "def is_valid(s):\n    pairs = {\")\": \"(\", \"]\": \"[\", \"}\": \"{\"}\n    stack = []\n    for ch in s:\n        if ch in \"([{\":\n            stack.append(ch)\n        elif ch in pairs:\n            if not stack or stack[-1] != pairs[ch]:\n                return False\n            stack.pop()\n        else:\n            return False\n    return len(stack) == 0\n"
    },
    {
      id: "merge-sorted-array",
      no: 4,
      title: "合并两个有序数组",
      difficulty: "简单",
      lang: "python3",
      topic: "数组",
      fn: "merge_sorted",
      statement: [
        { t: "p", text: "给定两个按升序排好的整数数组 nums1 和 nums2，请把它们合并成一个升序数组并返回。重复的数字要保留。" },
        { t: "example", input: "nums1 = [1, 2, 3], nums2 = [2, 5, 6]", output: "[1, 2, 2, 3, 5, 6]" },
        { t: "example", input: "nums1 = [], nums2 = [1]", output: "[1]" },
        { t: "p", text: "两个指针各指一个数组的开头，每次挑较小的那个放进结果，指针后移。一个数组走完后，把另一个剩下的整段接上。" },
        { t: "constraints", items: ["0 <= nums1.length, nums2.length <= 10^4", "-10^9 <= nums1[i], nums2[i] <= 10^9", "两个数组都按非递减顺序排列"] }
      ],
      starter: "def merge_sorted(nums1, nums2):\n    # 在这里写代码\n    pass\n",
      samples: 2,
      tests: [
        { args: [[1, 2, 3], [2, 5, 6]], expect: [1, 2, 2, 3, 5, 6] },
        { args: [[], [1]], expect: [1] },
        { args: [[1], [2, 3, 4]], expect: [1, 2, 3, 4] },
        { args: [[0, 0], [0, 0]], expect: [0, 0, 0, 0] },
        { args: [[-3, -1], [-2, 4]], expect: [-3, -2, -1, 4] },
        { args: [[1, 5], [2, 3, 4]], expect: [1, 2, 3, 4, 5] }
      ],
      reference: "def merge_sorted(nums1, nums2):\n    i = 0\n    j = 0\n    out = []\n    while i < len(nums1) and j < len(nums2):\n        if nums1[i] <= nums2[j]:\n            out.append(nums1[i])\n            i += 1\n        else:\n            out.append(nums2[j])\n            j += 1\n    while i < len(nums1):\n        out.append(nums1[i])\n        i += 1\n    while j < len(nums2):\n        out.append(nums2[j])\n        j += 1\n    return out\n"
    },
    {
      id: "binary-search",
      no: 5,
      title: "二分查找",
      difficulty: "简单",
      lang: "python3",
      topic: "二分查找",
      fn: "binary_search",
      statement: [
        { t: "p", text: "给定一个升序排列且没有重复元素的整数数组 nums，以及目标值 target。如果 target 存在，返回它的下标；否则返回 -1。" },
        { t: "example", input: "nums = [-1, 0, 3, 5, 9, 12], target = 9", output: "4" },
        { t: "example", input: "nums = [-1, 0, 3, 5, 9, 12], target = 2", output: "-1" },
        { t: "p", text: "每次取中间位置的值和目标比较：相等就返回；中间值太小就把左边界挪到 mid + 1；太大就把右边界挪到 mid - 1。" },
        { t: "constraints", items: ["0 <= nums.length <= 10^4", "-10^4 < nums[i], target < 10^4", "nums 按升序排列，且没有重复元素"] }
      ],
      starter: "def binary_search(nums, target):\n    # 在这里写代码\n    pass\n",
      samples: 2,
      tests: [
        { args: [[-1, 0, 3, 5, 9, 12], 9], expect: 4 },
        { args: [[-1, 0, 3, 5, 9, 12], 2], expect: -1 },
        { args: [[], 5], expect: -1 },
        { args: [[5], 5], expect: 0 },
        { args: [[1, 3, 5, 7, 9, 11], 1], expect: 0 },
        { args: [[1, 3, 5, 7, 9, 11], 11], expect: 5 }
      ],
      reference: "def binary_search(nums, target):\n    lo = 0\n    hi = len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1\n"
    },
    {
      id: "climb-stairs",
      no: 6,
      title: "爬楼梯",
      difficulty: "简单",
      lang: "python3",
      topic: "动态规划",
      fn: "climb_stairs",
      statement: [
        { t: "p", text: "你正在爬一个 n 级的楼梯。每次可以走 1 级或 2 级，问走到第 n 级一共有多少种不同的走法。" },
        { t: "example", input: "n = 2", output: "2", note: "1 + 1，或者直接走 2 级。" },
        { t: "example", input: "n = 3", output: "3", note: "1+1+1、1+2、2+1，共三种。" },
        { t: "p", text: "走到第 n 级的最后一步只能来自第 n-1 级或第 n-2 级，所以走法数就是这两个数相加。这就是斐波那契数列的递推。" },
        { t: "constraints", items: ["1 <= n <= 45"] }
      ],
      starter: "def climb_stairs(n):\n    # 在这里写代码\n    pass\n",
      samples: 2,
      tests: [
        { args: [2], expect: 2 },
        { args: [3], expect: 3 },
        { args: [1], expect: 1 },
        { args: [5], expect: 8 },
        { args: [10], expect: 89 },
        { args: [20], expect: 10946 }
      ],
      reference: "def climb_stairs(n):\n    if n <= 2:\n        return n\n    a = 1\n    b = 2\n    for i in range(3, n + 1):\n        c = a + b\n        a = b\n        b = c\n    return b\n"
    },
    {
      id: "max-subarray",
      no: 7,
      title: "最大子数组和",
      difficulty: "中等",
      lang: "python3",
      topic: "动态规划",
      fn: "max_subarray",
      statement: [
        { t: "p", text: "给定一个整数数组 nums，请找出一个和最大的连续子数组（至少包含一个元素），返回这个最大和。" },
        { t: "example", input: "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]", output: "6", note: "连续子数组 [4, -1, 2, 1] 的和最大，是 6。" },
        { t: "example", input: "nums = [1]", output: "1" },
        { t: "p", text: "从左往右扫，维护一个「以当前元素结尾的最大和」。如果前面的和加上当前元素还不如当前元素自己大，就从前一位断开、从当前元素重新开始。" },
        { t: "constraints", items: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"] }
      ],
      starter: "def max_subarray(nums):\n    # 在这里写代码\n    pass\n",
      samples: 2,
      tests: [
        { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expect: 6 },
        { args: [[1]], expect: 1 },
        { args: [[5, 4, -1, 7, 8]], expect: 23 },
        { args: [[-3, -1, -2]], expect: -1 },
        { args: [[0]], expect: 0 },
        { args: [[-2, 1]], expect: 1 }
      ],
      reference: "def max_subarray(nums):\n    best = nums[0]\n    cur = nums[0]\n    for x in nums[1:]:\n        if cur + x > x:\n            cur = cur + x\n        else:\n            cur = x\n        if cur > best:\n            best = cur\n    return best\n"
    },
    {
      id: "longest-substring",
      no: 8,
      title: "无重复字符的最长子串",
      difficulty: "中等",
      lang: "python3",
      topic: "滑动窗口",
      fn: "length_of_longest_substring",
      statement: [
        { t: "p", text: "给定一个字符串 s，请找出其中不含重复字符的最长连续子串，并返回这个子串的长度。" },
        { t: "example", input: 's = "abcabcbb"', output: "3", note: "最长的是 abc，长度 3。" },
        { t: "example", input: 's = "bbbbb"', output: "1" },
        { t: "p", text: "用左右两个指针圈住一个窗口，右边逐个吃字符；如果这个字符上次出现的位置还在窗口里，就把左指针挪到它后面一位。窗口里的字符始终不重复。" },
        { t: "constraints", items: ["0 <= s.length <= 5 * 10^4", "s 由英文字母、数字、符号和空格组成"] }
      ],
      starter: "def length_of_longest_substring(s):\n    # 在这里写代码\n    pass\n",
      samples: 2,
      tests: [
        { args: ["abcabcbb"], expect: 3 },
        { args: ["bbbbb"], expect: 1 },
        { args: ["pwwkew"], expect: 3 },
        { args: [""], expect: 0 },
        { args: ["dvdf"], expect: 3 },
        { args: ["abba"], expect: 2 }
      ],
      reference: "def length_of_longest_substring(s):\n    last = {}\n    left = 0\n    best = 0\n    for i in range(len(s)):\n        ch = s[i]\n        if ch in last and last[ch] >= left:\n            left = last[ch] + 1\n        last[ch] = i\n        if i - left + 1 > best:\n            best = i - left + 1\n    return best\n"
    },
    {
      id: "search-insert",
      no: 9,
      title: "搜索插入位置",
      difficulty: "简单",
      lang: "python3",
      topic: "二分查找",
      fn: "search_insert",
      statement: [
        { t: "p", text: "给定一个升序且无重复元素的数组 nums 和目标值 target。如果 target 存在，返回它的下标；如果不存在，返回它按顺序应该插入的位置。" },
        { t: "example", input: "nums = [1, 3, 5, 6], target = 5", output: "2" },
        { t: "example", input: "nums = [1, 3, 5, 6], target = 2", output: "1" },
        { t: "p", text: "把二分查找的「找不到就返回 -1」改成「循环结束时返回左边界」，左边界正好是第一个不小于 target 的位置。" },
        { t: "constraints", items: ["1 <= nums.length <= 10^4", "-10^4 <= nums[i], target <= 10^4", "nums 按升序排列，且没有重复元素"] }
      ],
      starter: "def search_insert(nums, target):\n    # 在这里写代码\n    pass\n",
      samples: 2,
      tests: [
        { args: [[1, 3, 5, 6], 5], expect: 2 },
        { args: [[1, 3, 5, 6], 2], expect: 1 },
        { args: [[1, 3, 5, 6], 7], expect: 4 },
        { args: [[1, 3, 5, 6], 0], expect: 0 },
        { args: [[1], 0], expect: 0 },
        { args: [[1, 3], 2], expect: 1 }
      ],
      reference: "def search_insert(nums, target):\n    lo = 0\n    hi = len(nums)\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if nums[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid\n    return lo\n"
    },
    {
      id: "move-zeroes",
      no: 10,
      title: "移动零",
      difficulty: "简单",
      lang: "python3",
      topic: "数组",
      fn: "move_zeroes",
      statement: [
        { t: "p", text: "给定一个整数数组 nums，请把所有 0 挪到数组末尾，同时保持非零数字原来的相对顺序。返回处理后的数组（这一题不要求原地修改）。" },
        { t: "example", input: "nums = [0, 1, 0, 3, 12]", output: "[1, 3, 12, 0, 0]" },
        { t: "example", input: "nums = [0]", output: "[0]" },
        { t: "p", text: "先按顺序把非零数字收进结果，再在末尾补上同样数量的 0。也可以用一个写指针在原地做，写法更省内存。" },
        { t: "constraints", items: ["1 <= nums.length <= 10^4", "-2^31 <= nums[i] <= 2^31 - 1"] }
      ],
      starter: "def move_zeroes(nums):\n    # 在这里写代码\n    pass\n",
      samples: 2,
      tests: [
        { args: [[0, 1, 0, 3, 12]], expect: [1, 3, 12, 0, 0] },
        { args: [[0]], expect: [0] },
        { args: [[1, 2, 3]], expect: [1, 2, 3] },
        { args: [[0, 0, 1]], expect: [1, 0, 0] },
        { args: [[4, 0, 5, 0, 0, 6]], expect: [4, 5, 6, 0, 0, 0] },
        { args: [[0, 0, 0]], expect: [0, 0, 0] }
      ],
      reference: "def move_zeroes(nums):\n    out = []\n    zeros = 0\n    for x in nums:\n        if x == 0:\n            zeros += 1\n        else:\n            out.append(x)\n    for i in range(zeros):\n        out.append(0)\n    return out\n"
    },
    {
      id: "merge-intervals",
      no: 11,
      title: "合并区间",
      difficulty: "中等",
      lang: "python3",
      topic: "排序",
      fn: "merge_intervals",
      statement: [
        { t: "p", text: "给定一组区间 intervals，每个区间写成 [start, end]。请合并所有重叠的区间，返回按起点升序排列的结果。端点相等也算重叠，例如 [1, 4] 和 [4, 5] 合并成 [1, 5]。" },
        { t: "example", input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" },
        { t: "example", input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]" },
        { t: "p", text: "先按区间起点排序，然后从左往右扫：如果当前区间的起点不大于结果里最后一个区间的终点，就把它并进去；否则单独开一段。" },
        { t: "constraints", items: ["0 <= intervals.length <= 10^4", "intervals[i].length == 2", "0 <= start <= end <= 10^4"] }
      ],
      starter: "def merge_intervals(intervals):\n    # 在这里写代码\n    pass\n",
      samples: 2,
      tests: [
        { args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expect: [[1, 6], [8, 10], [15, 18]] },
        { args: [[[1, 4], [4, 5]]], expect: [[1, 5]] },
        { args: [[[1, 4], [0, 4]]], expect: [[0, 4]] },
        { args: [[[1, 4], [2, 3]]], expect: [[1, 4]] },
        { args: [[[1, 4], [5, 6]]], expect: [[1, 4], [5, 6]] },
        { args: [[[2, 3], [4, 5], [6, 7], [8, 9], [1, 10]]], expect: [[1, 10]] }
      ],
      reference: "def merge_intervals(intervals):\n    if not intervals:\n        return []\n    items = sorted(intervals, key=lambda x: x[0])\n    out = []\n    for a, b in items:\n        if out and a <= out[-1][1]:\n            if b > out[-1][1]:\n                out[-1][1] = b\n        else:\n            out.append([a, b])\n    return out\n"
    },
    {
      id: "trapping-rain-water",
      no: 12,
      title: "接雨水",
      difficulty: "困难",
      lang: "python3",
      topic: "双指针",
      fn: "trap",
      statement: [
        { t: "p", text: "给定 n 个非负整数表示一排柱子的高度，每个柱子宽度为 1。下雨后，柱子之间的凹槽能接住多少格雨水？返回总格数。" },
        { t: "example", input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
        { t: "example", input: "height = [4,2,0,3,2,5]", output: "9" },
        { t: "p", text: "某一格能接多少水，取决于它左边最高的柱子和右边最高的柱子中较矮的那个。用双指针从两端往中间走，边扫边记住左右最高值，就能只扫一遍。" },
        { t: "constraints", items: ["1 <= height.length <= 2 * 10^4", "0 <= height[i] <= 10^5"] }
      ],
      starter: "def trap(height):\n    # 在这里写代码\n    pass\n",
      samples: 2,
      tests: [
        { args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expect: 6 },
        { args: [[4, 2, 0, 3, 2, 5]], expect: 9 },
        { args: [[1, 0, 1]], expect: 1 },
        { args: [[3, 0, 0, 2, 0, 4]], expect: 10 },
        { args: [[0, 0, 0]], expect: 0 },
        { args: [[5, 4, 3, 2, 1]], expect: 0 }
      ],
      reference: "def trap(height):\n    if not height:\n        return 0\n    left = 0\n    right = len(height) - 1\n    left_max = 0\n    right_max = 0\n    water = 0\n    while left < right:\n        if height[left] < height[right]:\n            if height[left] >= left_max:\n                left_max = height[left]\n            else:\n                water += left_max - height[left]\n            left += 1\n        else:\n            if height[right] >= right_max:\n                right_max = height[right]\n            else:\n                water += right_max - height[right]\n            right -= 1\n    return water\n"
    },
    {
      id: "longest-valid-parentheses",
      no: 13,
      title: "最长有效括号",
      difficulty: "困难",
      lang: "python3",
      topic: "栈",
      fn: "longest_valid_parentheses",
      statement: [
        { t: "p", text: "给定一个只包含左括号 ( 和右括号 ) 的字符串 s，请找出最长的、括号能够正确闭合的连续子串，返回它的长度。" },
        { t: "example", input: 's = "(()"', output: "2", note: "最长的有效子串是 ()，长度 2。" },
        { t: "example", input: 's = ")()())"', output: "4", note: "最长的有效子串是 ()()，长度 4。" },
        { t: "p", text: "用栈存下标，栈底先放一个 -1 当分界。遇到左括号压下标；遇到右括号先弹栈，如果栈空了就把当前下标压进去当新分界，否则当前下标减去栈顶就是这一段有效长度。" },
        { t: "constraints", items: ["0 <= s.length <= 3 * 10^4", "s 只由 ( 和 ) 组成"] }
      ],
      starter: "def longest_valid_parentheses(s):\n    # 在这里写代码\n    pass\n",
      samples: 2,
      tests: [
        { args: ["(()"], expect: 2 },
        { args: [")()())"], expect: 4 },
        { args: [""], expect: 0 },
        { args: ["()(()"], expect: 2 },
        { args: ["()(())"], expect: 6 },
        { args: [")("], expect: 0 }
      ],
      reference: "def longest_valid_parentheses(s):\n    stack = [-1]\n    best = 0\n    for i in range(len(s)):\n        if s[i] == \"(\":\n            stack.append(i)\n        else:\n            stack.pop()\n            if not stack:\n                stack.append(i)\n            elif i - stack[-1] > best:\n                best = i - stack[-1]\n    return best\n"
    }
  ]
};
