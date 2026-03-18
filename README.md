# 🎬 AI Video Monitor - GitHub Actions 版本

完全在云端运行的 AI 视频行业监控工具，无需本地配置，自动定时生成日报。

## ✨ 特点

- ✅ **零配置** - 无需安装 Python/Node.js
- ✅ **全自动** - 每天自动生成报告
- ✅ **免费** - GitHub Actions 完全免费
- ✅ **免维护** - 无需服务器
- ✅ **可追溯** - 所有历史报告保存在 GitHub

## 🚀 快速开始

### 步骤 1: 创建 GitHub 仓库

1. 登录 [GitHub](https://github.com/)
2. 点击右上角 **+** → **New repository**
3. 填写仓库名称：`ai-video-monitor`
4. 选择 **Public**（公开）或 **Private**（私密）
5. 勾选 **Add a README file**
6. 点击 **Create repository**

### 步骤 2: 上传项目文件

#### 方法 A: 通过网页上传（推荐新手）

1. 在仓库页面点击 **Add file** → **Upload files**
2. 将以下文件拖拽到上传区域：
   ```
   .github/workflows/daily_report.yml
   main.js
   package.json
   README.md
   ```
3. 填写提交信息：`Initial commit`
4. 点击 **Commit changes**

#### 方法 B: 使用 Git 命令

```bash
cd d:\Qwork\ai-video-monitor-github

# 初始化 Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 关联远程仓库（替换 YOUR_USERNAME 为您的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/ai-video-monitor.git

# 推送
git push -u origin main
```

### 步骤 3: 启用 GitHub Actions

1. 在仓库页面点击 **Actions** 标签
2. 如果是第一次使用，点击 **I understand my workflows, go ahead and enable them**
3. 确认工作流已启用

### 步骤 4: 测试运行

1. 在 **Actions** 页面找到 **Daily AI Video Report**
2. 点击右侧的 **Run workflow** ▼
3. 点击 **Run workflow** 按钮
4. 等待几秒钟，刷新页面查看运行状态
5. 运行完成后，在 **reports/** 目录查看生成的报告

## ⏰ 定时设置

默认配置：**每天北京时间 9:00** 自动执行

如需修改时间，编辑 `.github/workflows/daily_report.yml`：

```yaml
on:
  schedule:
    - cron: '0 1 * * *'  # 格式：分 时 日 月 星期
                       # UTC 1:00 = 北京 9:00
```

### 常用时间配置

| 北京时间 | Cron 表达式 |
|----------|------------|
| 早上 8:00 | `0 0 * * *` |
| 早上 9:00 | `0 1 * * *` |
| 晚上 8:00 | `0 12 * * *` |
| 每 6 小时 | `0 */6 * * *` |

## 📁 项目结构

```
ai-video-monitor/
├── .github/
│   └── workflows/
│       └── daily_report.yml    # GitHub Actions 配置
├── reports/                    # 生成的报告（自动创建）
│   ├── ai_video_daily_20240115.md
│   └── latest_report.md
├── main.js                     # 主程序
├── package.json                # Node.js 配置
└── README.md                   # 说明文档
```

## 📊 查看报告

### 方式 1: GitHub 网页

1. 进入仓库的 **reports/** 目录
2. 点击最新的 `.md` 文件
3. GitHub 会自动渲染 Markdown 格式

### 方式 2: 下载查看

1. 在报告文件页面点击 **Download**
2. 用文本编辑器或 Markdown 阅读器打开

### 方式 3: GitHub Issues（自动通知）

每次运行后会创建一个 Issue，包含最新报告内容。

## 🔧 自定义配置

### 添加更多监控平台

编辑 `main.js` 中的 `CONFIG.platforms`：

```javascript
const CONFIG = {
  platforms: [
    {
      category: 'AI 视频平台',
      sources: [
        { name: '即梦 AI', url: 'https://dreamina.jianying.com/' },
        // 添加新的平台...
        { name: '新平台', url: 'https://example.com/' }
      ]
    }
  ]
};
```

### 修改报告格式

编辑 `main.js` 中的 `generateMarkdown()` 函数。

### 添加邮件通知

在 `.github/workflows/daily_report.yml` 中添加邮件步骤：

```yaml
- name: Send email notification
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 587
    username: ${{ secrets.SMTP_USERNAME }}
    password: ${{ secrets.SMTP_PASSWORD }}
    subject: AI 视频行业动态日报
    body: 请查看附件报告
    to: your-email@example.com
```

## ⚙️ Secrets 配置（可选）

如果需要发送邮件或使用其他服务，需要在 GitHub 配置 Secrets：

1. 仓库 **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**
3. 添加所需的密钥

常用 Secrets：
- `SMTP_USERNAME` - 邮箱账号
- `SMTP_PASSWORD` - 邮箱授权码

## 🔍 故障排查

### Actions 未触发

- 检查是否启用了 Actions
- 查看 `.github/workflows/daily_report.yml` 语法是否正确
- 手动触发一次测试

### 报告内容为空

- 查看 Actions 运行日志
- 可能是网络问题或网站结构变化
- 尝试增加请求延迟

### 超出 GitHub 限制

GitHub Actions 免费额度：
- 每月 2000 分钟
- 每次运行约 2-5 分钟
- 每天运行完全足够

## 💡 高级用法

### 推送到多个平台

可以修改工作流，同时推送报告到：
- GitHub Issues
- 邮箱
- 钉钉/飞书/企业微信
- Telegram/Discord

### 添加数据分析

可以在生成报告的同时统计：
- 每周热点趋势
- 平台更新频率对比
- 关键词云图

### 与其他工具集成

- 连接 Notion 数据库
- 同步到语雀/飞书文档
- 发布到微信公众号

## 📞 获取帮助

- 查看 GitHub Actions 文档：https://docs.github.com/actions
- 查看运行日志了解详细错误
- 在 Issues 中提问

---

*Made with ❤️ by AI Video Monitor Team*
