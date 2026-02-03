# 📚 LeetCode 每日一题自动归档

[![Daily LeetCode](https://github.com/zerx-lab/actions-cron-learn/actions/workflows/daily-leetcode.yml/badge.svg)](https://github.com/zerx-lab/actions-cron-learn/actions/workflows/daily-leetcode.yml)

这是一个使用 GitHub Actions Cron 定时任务自动获取并归档 LeetCode 每日一题的项目。

## 功能特性

- 每天自动获取 LeetCode 每日一题信息
- 自动更新题目列表到本仓库
- 支持中英文题目信息
- 记录题目难度、标签等元数据

## 工作原理

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│  GitHub Actions │────▶│ LeetCode API │────▶│  自动提交更新     │
│  (Cron 定时)     │     │  获取每日题   │     │  到本仓库         │
└─────────────────┘     └──────────────┘     └─────────────────┘
```

## Cron 调度说明

本项目使用 GitHub Actions 的 cron 调度功能，配置如下：

```yaml
schedule:
  - cron: '0 0 * * *'  # UTC 时间每天 00:00（北京时间 08:00）
```

### Cron 表达式格式

```
┌───────────── 分钟 (0 - 59)
│ ┌───────────── 小时 (0 - 23)
│ │ ┌───────────── 日期 (1 - 31)
│ │ │ ┌───────────── 月份 (1 - 12)
│ │ │ │ ┌───────────── 星期 (0 - 6，0 表示星期日)
│ │ │ │ │
│ │ │ │ │
* * * * *
```

### 常用示例

| 表达式 | 说明 |
|--------|------|
| `0 0 * * *` | 每天 UTC 00:00 |
| `0 */6 * * *` | 每 6 小时 |
| `0 8 * * 1-5` | 工作日 UTC 08:00 |
| `30 5,17 * * *` | 每天 UTC 05:30 和 17:30 |

## 今日题目

<!-- LEETCODE_DAILY_START -->
### 2026-02-03

| 属性 | 值 |
|------|-----|
| 题号 | 3637 |
| 标题 | [三段式数组 I](https://leetcode.cn/problems/trionic-array-i/) |
| 难度 | 🟢 简单 |
| 标签 | 数组 |

> 点击标题链接直达 LeetCode 题目页面
<!-- LEETCODE_DAILY_END -->

## 历史归档

| 日期 | 题目 | 难度 | 链接 |
|------|------|------|------|
<!-- LEETCODE_HISTORY_START -->
| 2026-02-03 | [3637. 三段式数组 I](https://leetcode.cn/problems/trionic-array-i/) | 🟢 简单 | [查看](https://leetcode.cn/problems/trionic-array-i/) |
| 2026-02-03 | [3637. 三段式数组 I](https://leetcode.cn/problems/trionic-array-i/) | 🟢 简单 | [查看](https://leetcode.cn/problems/trionic-array-i/) |
| 2026-02-03 | [3637. 三段式数组 I](https://leetcode.cn/problems/trionic-array-i/) | 🟢 简单 | [查看](https://leetcode.cn/problems/trionic-array-i/) |
<!-- LEETCODE_HISTORY_END -->

## 手动触发

除了定时触发，你也可以手动运行此 workflow：

1. 进入仓库的 **Actions** 页面
2. 选择 **Daily LeetCode** workflow
3. 点击 **Run workflow** 按钮

## 本地开发

```bash
# 安装依赖
npm install

# 本地测试脚本
node scripts/fetch-leetcode.js
```

## 项目结构

```
.
├── .github/
│   └── workflows/
│       └── daily-leetcode.yml    # GitHub Actions 工作流配置
├── scripts/
│   └── fetch-leetcode.js         # 获取每日一题的脚本
├── archive/                      # 历史题目归档目录
│   └── 2024/
│       └── 01/
│           └── 01.md
├── README.md
└── package.json
```