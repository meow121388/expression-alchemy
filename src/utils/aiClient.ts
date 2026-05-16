import { mockAlienReply, mockAiAnalyzeScenario } from './mockAiScorer';
import type { ScoreReport } from './mockAiScorer';

// 配置：是否强制使用本地 Mock 数据。可以在 .env.local 中设置 VITE_USE_MOCK=true
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const ALIEN_SYSTEM_PROMPT = `你是一个代号为“泽塔星云硅基生命体”的外星人。你完全不了解地球事物。
目前，一个地球人正在试图向你解释一种叫做“珍珠奶茶”的液体。
你的回复必须：
1. 极其简短（不超过30个字）。
2. 充满外星生物的警惕、机械感和对碳基生物的不解。
3. 绝对不能直接说出“奶茶”或“珍珠”，而是要顺着人类的描述，提出诡异的误解或疑问。例如把吸管当成注输管道，把珍珠当成寄生卵等。
4. 如果人类提到“嚼”，必须立刻发出强烈的系统警告，因为你没有咀嚼器官。
请直接扮演角色进行回复，不要包含任何多余的解释。`;

const SCORE_SYSTEM_PROMPT = `你是一个外星语言学评分系统。请根据人类（user）和外星人（assistant）的对话历史，评估人类是否成功地用50个字以内的代价，让外星人理解了“珍珠奶茶”的物理特征和饮用方式。
请返回严格的 JSON 格式数据：
{
  "score": 0-100的整数,
  "hitWords": ["列出人类使用的高频废话或违禁词", "例如: 嚼"],
  "feedbackTitle": "简短的评语标题",
  "feedbackDetail": "详细的评价，指出人类描述中的盲点或亮点",
  "aiReference": "如果你来描述，你会给出的最精准极简答案（30字以内）"
}`;

export const fetchAlienReply = async (history: {role: 'user'|'alien', content: string}[]): Promise<string> => {
  if (USE_MOCK) {
    console.warn('⚠️ 强制使用本地 Mock 数据');
    const lastMessage = history[history.length - 1]?.content || '';
    return mockAlienReply(lastMessage);
  }

  const messages: Message[] = [
    { role: 'system', content: ALIEN_SYSTEM_PROMPT },
    ...history.map(msg => {
      const role: 'assistant' | 'user' = msg.role === 'alien' ? 'assistant' : 'user';
      return { role, content: msg.content };
    })
  ];

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages,
        temperature: 0.7,
        max_tokens: 100
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP Error: ${response.status}`);
    }

    if (data.error) {
      throw new Error(data.error.message || JSON.stringify(data.error));
    }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      // 可能是国内大模型特有的报错格式，比如 { code: 123, msg: "..." }
      if (data.msg || data.message) {
        throw new Error(`API 返回错误: ${data.msg || data.message}`);
      }
      throw new Error(`API 返回了无法解析的数据格式: ${JSON.stringify(data).substring(0, 50)}`);
    }

    const content = data.choices[0].message.content;
    if (content === null || content === undefined || content === '') {
      throw new Error('API 返回了空的回复');
    }

    return content;
  } catch (error: any) {
    console.error('API Error:', error);
    return `[系统提示] 通讯链路异常: ${error.message}。请检查 Render 后台的环境变量配置是否正确。`;
  }
};

export const fetchAlienScore = async (history: {role: 'user'|'alien', content: string}[]): Promise<ScoreReport> => {
  if (USE_MOCK) {
    console.warn('⚠️ 强制使用本地 Mock 数据');
    const userInputs = history.filter(m => m.role === 'user').map(m => m.content);
    return mockAiAnalyzeScenario(userInputs[0] || '', userInputs[1] || '', userInputs[2] || '');
  }

  const messages: Message[] = [
    { role: 'system', content: SCORE_SYSTEM_PROMPT },
    ...history.map(msg => {
      const role: 'assistant' | 'user' = msg.role === 'alien' ? 'assistant' : 'user';
      return { role, content: msg.content };
    })
  ];

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages,
        temperature: 0.2,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    
    return {
      score: result.score || 60,
      compressionRate: 100, // Conceptually not used here, keep 100
      hitWords: result.hitWords || [],
      feedbackTitle: result.feedbackTitle || "通讯结束",
      feedbackDetail: result.feedbackDetail || "评分解析失败",
      aiReference: result.aiReference || "这是一种内含淀粉颗粒的甜味液体，需使用管状工具吸入。"
    };
  } catch (error) {
    console.error('API Error (Fallback to Mock):', error);
    const userInputs = history.filter(m => m.role === 'user').map(m => m.content);
    return await mockAiAnalyzeScenario(userInputs[0] || '', userInputs[1] || '', userInputs[2] || '');
  }
};
