# 部署问题排查指南

## 问题：页面显示空白

如果部署到 GitHub Pages 后页面显示空白，请检查以下几点：

### 1. 检查 GitHub Actions 构建日志

1. 进入 GitHub 仓库的 Actions 页面
2. 查看最新的构建日志
3. 确认构建是否成功
4. 检查 `Set base path` 步骤的输出，确认 base 路径是否正确设置

### 2. 检查 Base 路径

对于 `deamlake.github.io` 这样的仓库：
- Base 路径应该是 `/`
- 如果 workflow 检测不正确，可以手动在 `.github/workflows/deploy.yml` 中设置：
  ```yaml
  VITE_BASE: /
  ```

### 3. 检查浏览器控制台

1. 打开部署的网站
2. 按 F12 打开开发者工具
3. 查看 Console 标签页是否有错误
4. 查看 Network 标签页，确认资源文件（JS、CSS）是否成功加载

### 4. 常见问题

#### 问题：资源文件 404
- **原因**：Base 路径设置不正确
- **解决**：确保 workflow 中正确设置了 `VITE_BASE` 环境变量

#### 问题：JavaScript 错误
- **原因**：可能是 API Key 未配置导致运行时错误
- **解决**：应用已经处理了 API Key 缺失的情况，应该不会导致页面空白

#### 问题：CSS 未加载
- **原因**：Tailwind CSS 配置问题
- **解决**：确认 `src/index.css` 文件存在且正确导入

### 5. 手动测试构建

在本地运行以下命令测试构建：

```bash
# 设置 base 路径（对于 deamlake.github.io）
$env:VITE_BASE="/"
npm run build

# 预览构建结果
npm run preview
```

### 6. 检查部署的文件

确认 `dist` 目录包含：
- `index.html`
- `assets/index-*.js`
- `assets/index-*.css`

### 7. 重新部署

如果问题仍然存在：
1. 确保所有更改已推送到 GitHub
2. 手动触发 workflow（Actions → Deploy to GitHub Pages → Run workflow）
3. 等待构建完成
4. 清除浏览器缓存后重新访问

