# Traffic Tasker

一个基于 React + TypeScript + Vite 的任务管理应用，支持 GitHub Pages 部署。

## 本地开发

1. 安装依赖：
```bash
npm install
```

2. 创建 `.env` 文件（可选，用于本地开发时的 API Key）：
```
GEMINI_API_KEY=your_api_key_here
```

3. 启动开发服务器：
```bash
npm run dev
```

## 部署到 GitHub Pages

### 方法一：使用 GitHub Actions（推荐）

1. 将代码推送到 GitHub 仓库

2. 在 GitHub 仓库设置中启用 GitHub Pages：
   - 进入 Settings → Pages
   - Source 选择 "GitHub Actions"

3. GitHub Actions workflow 会自动检测仓库名并设置正确的 base 路径：
   - 如果仓库名是 `username.github.io`，自动使用 `/`
   - 否则自动使用 `/仓库名/`
   - 如果需要自定义 base 路径，可以修改 `.github/workflows/deploy.yml` 中的 `Set base path` 步骤

4. 如果需要使用 Gemini API，在 GitHub 仓库设置中添加 Secret：
   - 进入 Settings → Secrets and variables → Actions
   - 添加 `GEMINI_API_KEY` secret
   - 然后在 workflow 文件中取消注释相关行

5. 推送代码到 `main` 或 `master` 分支，GitHub Actions 会自动构建并部署

### 方法二：手动部署

1. 修改 `vite.config.ts` 中的 `base` 路径（根据仓库名）

2. 构建项目：
```bash
npm run build
```

3. 将 `dist` 目录的内容推送到 `gh-pages` 分支

## 项目结构

```
├── components/          # React 组件
├── services/           # 服务层（API 调用等）
├── .github/workflows/  # GitHub Actions 工作流
├── App.tsx            # 主应用组件
├── index.tsx          # 入口文件
├── vite.config.ts     # Vite 配置
└── package.json       # 项目依赖
```

## 注意事项

- GitHub Pages 部署时，如果仓库名不是 `username.github.io`，必须设置正确的 `base` 路径
- API Key 等敏感信息应通过 GitHub Secrets 管理，不要提交到代码仓库

