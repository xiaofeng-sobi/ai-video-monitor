# 部署到 GitHub - 超详细图文指南

## 📋 准备工作

您需要：
- 一个 GitHub 账号（如果没有，访问 https://github.com/signup 注册）

---

## 🚀 完整部署步骤

### 第 1 步：创建新仓库

1. **登录 GitHub**
   - 访问 https://github.com/
   - 输入账号密码登录

2. **创建仓库**
   - 点击右上角的 **+** 图标
   - 选择 **New repository**

3. **填写仓库信息**
   ```
   Repository name: ai-video-monitor
   Description: AI 视频行业动态监控 - 自动生成日报
   Public: ✓ (公开，别人可以看到)
   Private: ○ (私密，只有你能看到)
   
   ✓ Add a README file
   ```
   
4. **点击 Create repository**

---

### 第 2 步：上传项目文件

#### 方法 A：网页上传（最简单）

1. **进入刚创建的仓库页面**

2. **点击 Add file → Upload files**

3. **拖拽文件**
   
   将以下文件从文件夹拖到上传区域：
   ```
   d:\Qwork\ai-video-monitor-github\.github\workflows\daily_report.yml
   d:\Qwork\ai-video-monitor-github\main.js
   d:\Qwork\ai-video-monitor-github\package.json
   d:\Qwork\ai-video-monitor-github\README.md
   ```

4. **填写提交信息**
   ```
   Commit changes: Initial commit - AI Video Monitor
   ```

5. **点击 Commit changes**

#### 方法 B：使用 Git 命令行

如果您已安装 Git：

```bash
# 1. 打开命令提示符
cd d:\Qwork\ai-video-monitor-github

# 2. 初始化 Git
git init

# 3. 添加所有文件
git add .

# 4. 提交
git commit -m "Initial commit - AI Video Monitor"

# 5. 关联远程仓库（替换 YOUR_USERNAME 为您的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/ai-video-monitor.git

# 6. 推送
git branch -M main
git push -u origin main
```

---

### 第 3 步：启用 GitHub Actions

1. **切换到 Actions 标签**
   - 在仓库页面顶部，点击 **Actions**

2. **启用工作流**
   - 如果是第一次使用，会看到安全提示
   - 点击 **I understand my workflows, go ahead and enable them**

3. **确认工作流已启用**
   - 应该能看到 **Daily AI Video Report** 工作流

---

### 第 4 步：测试运行

1. **手动触发一次运行**
   - 在 Actions 页面，点击 **Daily AI Video Report**
   - 点击右侧的 **Run workflow** ▼
   - 点击 **Run workflow** 按钮

2. **查看运行状态**
   - 刷新页面，看到运行记录
   - 点击运行记录查看详细日志
   - 等待约 1-2 分钟完成

3. **查看生成的报告**
   - 运行完成后，刷新仓库页面
   - 会看到新增了 `reports/` 目录
   - 点击进入查看报告

---

### 第 5 步：设置自动运行

工作流已经配置好自动运行！

- **默认时间**: 每天早上 9:00（北京时间）
- **无需额外操作**: 到时间自动执行

如需修改时间，编辑 `.github/workflows/daily_report.yml`：

```yaml
on:
  schedule:
    - cron: '0 1 * * *'  # 改为其他时间
```

---

## ✅ 验证清单

完成后，您应该能看到：

- [ ] GitHub 仓库中有以下文件：
  - [ ] `.github/workflows/daily_report.yml`
  - [ ] `main.js`
  - [ ] `package.json`
  - [ ] `README.md`
  
- [ ] Actions 标签下能看到工作流
  
- [ ] 至少有一次成功运行的记录
  
- [ ] `reports/` 目录下有生成的报告文件

---

## 🔧 常见问题

### Q1: Actions 没有反应？

**A**: 
1. 检查是否启用了 Actions
2. 手动触发一次测试
3. 查看仓库 Settings → Actions → General，确保 Actions 是 enabled 状态

### Q2: 运行失败？

**A**:
1. 点击失败的运行记录
2. 查看详细错误日志
3. 通常是网络问题或配置错误
4. 重新运行一次试试

### Q3: 报告是空的？

**A**:
1. 这是正常的，因为示例代码只是简单抓取
2. 实际使用时需要根据网站结构调整解析逻辑
3. 主要看工作流程是否正常

### Q4: 如何关闭或暂停？

**A**:
1. 进入仓库的 **Settings**
2. 点击 **Actions** → **General**
3. 找到 **Disable actions** 按钮

或者临时禁用：
- 编辑 `.github/workflows/daily_report.yml`
- 在文件开头添加：`disabled: true`

---

## 💡 下一步优化建议

1. **添加更多监控源**
   - 编辑 `main.js` 中的平台列表
   
2. **改进抓取逻辑**
   - 根据具体网站的 HTML 结构调整解析器
   
3. **添加通知功能**
   - 邮件通知
   - 钉钉/飞书机器人
   - Telegram Bot

4. **数据分析**
   - 统计每周热点
   - 生成趋势图表

---

## 📞 需要帮助？

1. 查看 GitHub Actions 文档：https://docs.github.com/actions
2. 在仓库 Issues 中提问
3. 检查工作流运行日志

---

祝您部署成功！🎉

如果遇到问题，请截图错误信息，我可以帮您诊断。
