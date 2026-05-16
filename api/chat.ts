export default async function handler(req, res) {
  // 仅允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 优先从环境变量获取安全的 API Key 和配置
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
      return res.status(response.status).json({ error: 'LLM API request failed' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
