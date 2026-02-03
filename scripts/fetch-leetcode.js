const fs = require('fs');
const path = require('path');

// LeetCode GraphQL API 端点
const LEETCODE_API = 'https://leetcode.cn/graphql';

// 难度映射
const DIFFICULTY_MAP = {
  Easy: '🟢 简单',
  Medium: '🟡 中等',
  Hard: '🔴 困难',
};

// 获取每日一题的 GraphQL 查询
const DAILY_QUESTION_QUERY = `
query questionOfToday {
  todayRecord {
    date
    userStatus
    question {
      questionId
      frontendQuestionId: questionFrontendId
      difficulty
      title
      titleSlug
      content
      translatedTitle
      translatedContent
      topicTags {
        name
        slug
        translatedName
      }
    }
  }
}
`;

/**
 * 获取 LeetCode 每日一题
 */
async function fetchDailyQuestion() {
  console.log('📡 正在获取 LeetCode 每日一题...\n');

  const response = await fetch(LEETCODE_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Origin': 'https://leetcode.cn',
      'Referer': 'https://leetcode.cn/',
    },
    body: JSON.stringify({
      query: DAILY_QUESTION_QUERY,
      variables: {},
      operationName: 'questionOfToday',
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('响应内容:', text.substring(0, 500));
    throw new Error(`API 请求失败: ${response.status}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(`GraphQL 错误: ${JSON.stringify(data.errors)}`);
  }

  const todayRecord = data.data.todayRecord[0];
  if (!todayRecord) {
    throw new Error('未获取到今日题目');
  }

  return todayRecord;
}

/**
 * 更新 README.md 中的今日题目部分
 */
function updateReadme(question, date) {
  const readmePath = path.join(process.cwd(), 'README.md');
  let readme = fs.readFileSync(readmePath, 'utf-8');

  const { frontendQuestionId, translatedTitle, title, difficulty, titleSlug, topicTags } = question;

  const difficultyText = DIFFICULTY_MAP[difficulty] || difficulty;
  const tags = topicTags.map((t) => t.translatedName || t.name).join(', ');
  const leetcodeUrl = `https://leetcode.cn/problems/${titleSlug}/`;

  // 更新今日题目部分
  const todayContent = `
### ${date}

| 属性 | 值 |
|------|-----|
| 题号 | ${frontendQuestionId} |
| 标题 | [${translatedTitle || title}](${leetcodeUrl}) |
| 难度 | ${difficultyText} |
| 标签 | ${tags} |

> 点击标题链接直达 LeetCode 题目页面
`;

  readme = readme.replace(
    /<!-- LEETCODE_DAILY_START -->[\s\S]*<!-- LEETCODE_DAILY_END -->/,
    `<!-- LEETCODE_DAILY_START -->${todayContent}<!-- LEETCODE_DAILY_END -->`
  );

  // 更新历史记录表格
  const historyRow = `| ${date} | [${frontendQuestionId}. ${translatedTitle || title}](${leetcodeUrl}) | ${difficultyText} | [查看](${leetcodeUrl}) |`;

  // 在历史记录开始标记后插入新行
  readme = readme.replace(
    /<!-- LEETCODE_HISTORY_START -->\n/,
    `<!-- LEETCODE_HISTORY_START -->\n${historyRow}\n`
  );

  fs.writeFileSync(readmePath, readme, 'utf-8');
  console.log('✅ README.md 已更新');
}

/**
 * 创建归档文件
 */
function createArchive(question, date) {
  const { frontendQuestionId, translatedTitle, title, difficulty, titleSlug, translatedContent, content, topicTags } = question;

  const [year, month, day] = date.split('-');
  const archiveDir = path.join(process.cwd(), 'archive', year, month);

  // 确保目录存在
  fs.mkdirSync(archiveDir, { recursive: true });

  const difficultyText = DIFFICULTY_MAP[difficulty] || difficulty;
  const tags = topicTags.map((t) => t.translatedName || t.name).join(', ');
  const leetcodeUrl = `https://leetcode.cn/problems/${titleSlug}/`;

  // 清理 HTML 内容（简单处理）
  const questionContent = (translatedContent || content || '暂无内容')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .trim();

  const archiveContent = `# ${frontendQuestionId}. ${translatedTitle || title}

- **日期**: ${date}
- **难度**: ${difficultyText}
- **标签**: ${tags}
- **链接**: [LeetCode](${leetcodeUrl})

## 题目描述

${questionContent}

## 解题思路

<!-- 在此添加你的解题思路 -->

## 代码实现

\`\`\`javascript
// 在此添加你的代码
\`\`\`

## 复杂度分析

- 时间复杂度: O(?)
- 空间复杂度: O(?)
`;

  const archivePath = path.join(archiveDir, `${day}.md`);
  fs.writeFileSync(archivePath, archiveContent, 'utf-8');
  console.log(`✅ 归档文件已创建: archive/${year}/${month}/${day}.md`);
}

/**
 * 主函数
 */
async function main() {
  try {
    // 获取目标日期（支持通过环境变量指定）
    const targetDate = process.env.TARGET_DATE || new Date().toISOString().split('T')[0];
    console.log(`📅 目标日期: ${targetDate}\n`);

    // 获取每日一题
    const todayRecord = await fetchDailyQuestion();
    const question = todayRecord.question;

    console.log(`📝 题目信息:`);
    console.log(`   题号: ${question.frontendQuestionId}`);
    console.log(`   标题: ${question.translatedTitle || question.title}`);
    console.log(`   难度: ${DIFFICULTY_MAP[question.difficulty] || question.difficulty}`);
    console.log(`   链接: https://leetcode.cn/problems/${question.titleSlug}/\n`);

    // 更新 README
    updateReadme(question, targetDate);

    // 创建归档
    createArchive(question, targetDate);

    console.log('\n🎉 每日一题更新完成！');
  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

main();
