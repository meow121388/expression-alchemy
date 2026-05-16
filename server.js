import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// 尝试加载本地的 .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config(); // fallback to standard .env
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API 路由
app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.API_KEY || process.env.VITE_API_KEY;
  const baseUrl = process.env.API_BASE_URL || process.env.VITE_API_BASE_URL || 'https://api.moonshot.cn/v1';
  const model = process.env.API_MODEL || process.env.VITE_API_MODEL || 'moonshot-v1-8k';

  if (!apiKey) {
    return res.status(500).json({ error: 'API Key is not configured on the server' });
  }

  try {
    const { messages, temperature, max_tokens, response_format } = req.body;

    const payload = {
      model,
      messages,
      temperature: temperature || 0.7,
    };

    if (max_tokens) payload.max_tokens = max_tokens;
    if (response_format) payload.response_format = response_format;

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('LLM API Error:', errorData);
      return res.status(response.status).json({ error: `LLM API request failed: ${response.status}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// 托管 Vite 构建后的静态文件 (生产环境)
const distPath = join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // 任何未匹配的路由都返回 index.html (支持 React Router 前端路由)
  app.get('/*', (req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API Server is running. Please run `npm run build` to serve the frontend.');
  });
}

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
