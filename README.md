# AI 背景移除

基于 Remove.bg API 的图片背景移除工具。

## 部署到 Vercel

### 1. 获取 Remove.bg API Key

访问 [Remove.bg](https://www.remove.bg/api) 注册并获取 API Key。

### 2. 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

部署时设置环境变量：
- `REMOVE_BG_API_KEY`: 你的 Remove.bg API Key

### 3. 本地开发

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 添加你的 API Key

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 功能

- 拖拽/点击上传图片
- 一键去除背景
- 实时预览对比
- 下载透明背景 PNG

## 限制

- 单张图片最大 10MB
- 依赖 Remove.bg API 的免费额度（每月 50 张）
