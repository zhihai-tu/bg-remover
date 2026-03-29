# AI 背景移除

基于 Remove.bg API 的图片背景移除工具。

## 功能

- 拖拽/点击上传图片
- 一键去除背景
- 实时预览对比
- 下载透明背景 PNG
- Google 账号登录

## 限制

- 单张图片最大 10MB
- 依赖 Remove.bg API 的免费额度（每月 50 张）
- 需要登录后才能使用

## 快速部署

### 1. 获取 API Keys

**Remove.bg API Key**
访问 [Remove.bg API](https://www.remove.bg/api) 注册并获取 API Key。

**Google OAuth（可选，用于用户登录）**
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建 OAuth 2.0 Client ID
3. 配置 Authorized redirect URI：`https://你的域名/api/auth/callback/google`

### 2. 部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

部署时设置环境变量：

| 变量名 | 说明 |
|--------|------|
| `REMOVE_BG_API_KEY` | Remove.bg API Key |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `NEXTAUTH_SECRET` | 随机密钥（用于 Session 加密） |
| `NEXTAUTH_URL` | 你的网站地址，如 `https://aihaihai.shop` |

### 3. 配置 Google OAuth

在 [Google Cloud Console](https://console.cloud.google.com/)：

1. **OAuth consent screen** → 添加 App 名称和邮箱
2. **Credentials** → 创建 OAuth 2.0 Client ID
3. **Authorized redirect URIs** 添加：
   ```
   https://你的域名/api/auth/callback/google
   ```
4. 如果是 Testing 模式，需在 **Test users** 添加可登录的 Google 账号

## 本地开发

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 添加你的 API Keys

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 技术栈

- **前端框架**: Next.js 14 (Pages Router)
- **编程语言**: TypeScript
- **样式方案**: Tailwind CSS
- **认证**: NextAuth.js (Google OAuth)
- **部署平台**: Vercel
- **背景移除 API**: Remove.bg API

## 项目结构

```
bg-remover/
├── pages/
│   ├── api/
│   │   ├── auth/[...nextauth].ts   # Google OAuth 认证
│   │   └── remove-bg.ts           # 背景移除 API
│   ├── _app.tsx                    # 全局布局 + SessionProvider
│   └── index.tsx                   # 首页
├── styles/
│   └── globals.css                 # 全局样式
└── ...
```
