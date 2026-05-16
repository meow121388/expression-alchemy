# 表达炼金术 (Expression Alchemy) / 废话粉碎机

> 一个每天 5 分钟的“表达压缩闯关游戏”。帮助用户减少车轱辘话，提升信息密度，形成“先说重点、少说废话、表达具体”的习惯。

## 🚀 最新架构演进：全栈化安全部署

本项目目前基于 **Vite + React + TypeScript** 构建，并已接入 **Vercel Serverless Functions** 作为后端 API 代理层。

原先前端直连大模型 API 的方式容易导致 `API_KEY` 泄露，目前已完全改造为：
**前端发出对话请求 -> `/api/chat` (Vercel Serverless 后端) -> 携带密钥访问第三方 AI 大模型 -> 返回结果给前端**

这种前后端分离的无服务器架构不仅保证了 API 密钥的绝对安全，还能享受 Vercel 的一键免费部署。

## 🎯 核心玩法
- **文本压缩机**：将冗长文本压缩到指定字数以内，保留核心信息。
- **三句话情境挑战**：在随机情境和受众要求下，用三句话（结论、原因、请求）完成表达。
- **AI 废话雷达**：AI 外星人评估表达的简洁度、清晰度、完整度和重点感。

## 🛠️ 本地开发指南

### 安装依赖
```bash
npm install
```

### 启动项目
如果你在本地配置了真实的 API，推荐使用 Vercel CLI 启动以同时运行前后端：
```bash
npm i -g vercel
vercel dev
```
如果你不想配置后端，也可以直接运行（会自动降级为本地 Mock 数据）：
```bash
npm run dev
```

### 环境变量配置
请复制 `.env.example` 并重命名为 `.env.local`。填入以下信息：
```env
# 无论本地开发还是 Vercel 线上，这三项必须配置
API_KEY="你的真实密钥"
API_BASE_URL="https://api.moonshot.cn/v1"
API_MODEL="moonshot-v1-8k"
```
*(注意：这些敏感变量已经从前端彻底剥离，不会被打包到网页中。)*

## 🌐 线上部署指南 (Vercel)
1. 将当前代码推送到 GitHub。
2. 登录 [Vercel](https://vercel.com/) 并导入你的 GitHub 仓库。
3. 在 Vercel 的项目设置 `Environment Variables` 中，填入上文提到的三个环境变量 (`API_KEY`, `API_BASE_URL`, `API_MODEL`)。
4. 点击 Deploy 即可一键上线！

## 📁 目录结构
- `/api/` - Vercel 无服务器后端接口 (`chat.ts`)
- `/src/components/` - React 核心界面与模块组件
- `/src/utils/aiClient.ts` - 封装了向我们自己的 `/api/chat` 发送请求的网络层
- `vite.config.ts` - Vite 前端构建配置
