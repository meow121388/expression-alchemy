# 表达炼金术 (Expression Alchemy) / 废话粉碎机

> 一个每天 5 分钟的“表达压缩闯关游戏”。帮助用户减少车轱辘话，提升信息密度，形成“先说重点、少说废话、表达具体”的习惯。

## 🚀 最新架构：通用全栈应用 (Vite + Express)

为了实现彻底的跨平台部署，摆脱特定 Serverless 平台的限制（如 Vercel 的强制手机验证），本项目现已升级为**标准 Node.js 全栈应用**。

架构说明：
- **前端**：React + Vite（打包至 `dist/` 目录）
- **后端**：Express.js (`server.js`)
- **工作流**：后端不仅负责代理请求第三方 AI 大模型（保护 `API_KEY`），还会作为静态文件服务器托管前端构建好的页面。

这种架构支持一键部署到 Render、Zeabur、Railway，或传统 VPS 云服务器。

## 🎯 核心玩法
- **文本压缩机**：将冗长文本压缩到指定字数以内，保留核心信息。
- **三句话情境挑战**：在随机情境和受众要求下，用三句话（结论、原因、请求）完成表达。
- **AI 废话雷达**：AI 评估表达的简洁度、清晰度、完整度和重点感。

## 🛠️ 本地开发指南

### 安装依赖
```bash
npm install
```

### 本地双开启动 (前端 + 后端)
为了完整测试 AI 功能，你需要启动两个终端：
**终端 1 (启动后端接口, 端口 3000):**
```bash
npm run dev:api
```
**终端 2 (启动前端界面, 端口 5173):**
```bash
npm run dev
```

### 环境变量配置
请复制 `.env.example` 并重命名为 `.env.local`。填入以下信息：
```env
# 无论本地开发还是线上部署，这三项必须配置
API_KEY="你的真实密钥"
API_BASE_URL="https://api.moonshot.cn/v1"
API_MODEL="moonshot-v1-8k"
```
*(注意：这些敏感变量运行在 Express 后端中，不会被暴露给浏览器。)*

## 🌐 线上部署指南 (以 Zeabur / Render 为例)

本项目现在可以通过任何支持 Node.js 运行环境的平台直接上线。

1. **提交代码到 GitHub**：确保所有的变更都已 push 到你的 GitHub 仓库。
2. **登录云平台**：访问 [Zeabur (国内极速连通)](https://zeabur.com/) 或 [Render (老牌免费)](https://render.com/)，使用 GitHub 账号登录（通常无需绑定手机号）。
3. **创建新服务 (Web Service)**：选择关联你刚刚提交的 GitHub 仓库。
4. **配置构建与启动指令**（大部分平台会自动识别 Node 项目，如果需要手动填）：
   - 构建命令 (Build Command): `npm install && npm run build`
   - 启动命令 (Start Command): `npm start`
5. **添加环境变量**：在云平台的 Environment Variables 设置里，填入 `API_KEY`、`API_BASE_URL` 和 `API_MODEL`。
6. 点击 Deploy 部署即可！

## 📁 目录结构
- `server.js` - Express 全栈通用后端主程序
- `src/` - React 前端代码
- `src/utils/aiClient.ts` - 前端请求后端的网络封装
- `vite.config.ts` - Vite 前端代理配置
