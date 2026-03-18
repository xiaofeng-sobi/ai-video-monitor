/**
 * AI Video Monitor - Node.js 版本
 * 主程序：数据采集 + 报告生成
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// 配置信息
const CONFIG = {
  platforms: [
    {
      category: 'AI 视频平台',
      sources: [
        { name: '即梦 AI', url: 'https://dreamina.jianying.com/' },
        { name: '可灵 AI', url: 'https://klingai.kuaishou.com/' },
        { name: '海螺 AI', url: 'https://hailuoai.com/' },
        { name: 'Runway', url: 'https://runwayml.com/' },
        { name: 'Pika Labs', url: 'https://pika.art/' },
        { name: 'Luma AI', url: 'https://lumalabs.ai/' }
      ]
    },
    {
      category: '短视频平台',
      sources: [
        { name: '抖音创作者中心', url: 'https://creator.douyin.com/' },
        { name: '快手创作者平台', url: 'https://cp.kuaishou.com/' },
        { name: '小红书创作中心', url: 'https://creator.xiaohongshu.com/' }
      ]
    }
  ],
  outputDir: './reports'
};

/**
 * 发送 HTTP 请求获取网页内容
 */
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    console.log(`  → 抓取：${url}`);
    
    const client = url.startsWith('https') ? https : http;
    
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      },
      timeout: 10000
    };
    
    const req = client.get(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data);
      });
    });
    
    req.on('error', (err) => {
      console.log(`  ✗ 抓取失败：${url} - ${err.message}`);
      resolve('');
    });
    
    req.on('timeout', () => {
      req.destroy();
      console.log(`  ✗ 请求超时：${url}`);
      resolve('');
    });
  });
}

/**
 * 简单的 HTML 解析（提取标题等）
 */
function extractTitles(html, platformName) {
  const items = [];
  
  if (!html) return items;
  
  // 提取 h1-h3 标签内容
  const headingRegex = /<(h[1-3])[^>]*>(.*?)<\/\1>/gi;
  let match;
  
  while ((match = headingRegex.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    
    if (text && text.length > 5 && text.length < 100) {
      // 过滤包含关键词的内容
      const keywords = ['new', 'update', 'release', 'model', 'ai', 'video', '创作', '教程', '功能'];
      const hasKeyword = keywords.some(kw => text.toLowerCase().includes(kw));
      
      if (hasKeyword || text.includes('AI') || text.includes('视频')) {
        items.push({
          platform: platformName,
          title: text,
          type: '平台更新',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
        });
      }
    }
  }
  
  // 提取链接文本
  const linkRegex = /<a[^>]*>(.*?)<\/a>/gi;
  while ((match = linkRegex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]*>/g, '').trim();
    
    if (text && text.length > 10 && text.length < 80) {
      const keywords = ['AI', '视频', '教程', '更新', '功能', '发布', '创作'];
      const hasKeyword = keywords.some(kw => text.includes(kw));
      
      if (hasKeyword && !items.find(i => i.title === text)) {
        items.push({
          platform: platformName,
          title: text,
          type: '教程/公告',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
        });
      }
    }
  }
  
  return items.slice(0, 5); // 限制每个平台最多 5 条
}

/**
 * 生成 Markdown 报告
 */
function generateMarkdown(allItems) {
  const date = new Date().toISOString().split('T')[0];
  const grouped = {};
  
  // 按平台分组
  allItems.forEach(item => {
    if (!grouped[item.platform]) {
      grouped[item.platform] = [];
    }
    grouped[item.platform].push(item);
  });
  
  let md = `# 🎬 AI 视频行业动态日报\n\n`;
  md += `**报告日期**: ${date}\n`;
  md += `**生成时间**: ${new Date().toISOString().replace('T', ' ').substring(0, 19)}\n`;
  md += `**信息总数**: ${allItems.length} 条\n\n`;
  md += `---\n\n`;
  
  // 目录
  md += `## 📊 目录\n\n`;
  Object.entries(grouped).forEach(([platform, items], idx) => {
    const slug = platform.toLowerCase().replace(/\s+/g, '-');
    md += `${idx + 1}. [${platform}](#${slug}) - ${items.length} 条\n`;
  });
  md += `\n---\n\n`;
  
  // 各平台详细内容
  const emojiMap = {
    '即梦 AI': '🎨',
    '可灵 AI': '🤖',
    '海螺 AI': '🐚',
    'Runway': '🎬',
    'Pika Labs': '✨',
    'Luma AI': '💡',
    '抖音创作者中心': '🎵',
    '快手创作者平台': '📹',
    '小红书创作中心': '📕'
  };
  
  Object.entries(grouped).forEach(([platform, items]) => {
    const emoji = emojiMap[platform] || '📌';
    md += `## ${emoji} ${platform}\n\n`;
    
    items.forEach((item, idx) => {
      md += `### ${idx + 1}. ${item.title}\n\n`;
      md += `- **类型**: ${item.type}\n`;
      md += `- **时间**: ${item.timestamp}\n\n`;
      md += `---\n\n`;
    });
  });
  
  // 总结
  md += `## 📝 今日总结\n\n`;
  md += `本次采集共获取到 **${allItems.length}** 条 AI 视频行业相关信息。\n\n`;
  md += `建议关注重点平台的官方公告和热门教程，及时把握行业动态。\n\n`;
  md += `---\n\n`;
  md += `*本报告由 AI Video Monitor (GitHub Actions) 自动生成*\n`;
  
  return md;
}

/**
 * 保存报告到文件
 */
function saveReport(content) {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const filename = `ai_video_daily_${date}.md`;
  const filepath = path.join(CONFIG.outputDir, filename);
  
  // 确保目录存在
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
  
  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`\n✓ 报告已保存至：${filepath}`);
  
  // 复制一份为 latest_report.md（用于 GitHub Issue）
  const latestPath = path.join(CONFIG.outputDir, 'latest_report.md');
  fs.writeFileSync(latestPath, content, 'utf8');
  
  return filepath;
}

/**
 * 主函数
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🎬 AI Video Monitor - GitHub Actions');
  console.log('='.repeat(60));
  console.log(`开始时间：${new Date().toISOString()}`);
  console.log('='.repeat(60));
  
  const allItems = [];
  
  // 遍历所有平台抓取
  for (const category of CONFIG.platforms) {
    console.log(`\n类别：${category.category}`);
    console.log('-'.repeat(60));
    
    for (const source of category.sources) {
      try {
        const html = await fetchPage(source.url);
        const items = extractTitles(html, source.name);
        allItems.push(...items);
        console.log(`  ✓ ${source.name}: ${items.length} 条`);
        
        // 延迟避免请求过快
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        console.log(`  ✗ ${source.name}: ${err.message}`);
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`采集完成！共找到 ${allItems.length} 条信息`);
  console.log('='.repeat(60));
  
  // 生成并保存报告
  if (allItems.length > 0) {
    const markdown = generateMarkdown(allItems);
    const filepath = saveReport(markdown);
    
    console.log('\n报告预览:');
    console.log('-'.repeat(60));
    console.log(markdown.substring(0, 500) + '...\n');
  } else {
    console.log('\n⚠️ 未采集到任何信息');
    
    // 创建一个空报告
    const emptyReport = `# 🎬 AI 视频行业动态日报\n\n**报告日期**: ${new Date().toISOString().split('T')[0]}\n\n⚠️ 今日未能获取到有效信息，可能是网络问题或网站结构变化。\n\n*本报告由 AI Video Monitor (GitHub Actions) 自动生成*`;
    saveReport(emptyReport);
  }
  
  console.log('\n完成！');
}

// 运行主函数
main().catch(console.error);
