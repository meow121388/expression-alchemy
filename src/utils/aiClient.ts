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

const SCORE_SYSTEM_PROMPT = `你是一个外星语言学评分系统。请根据人类（user）和外星人（assistant）的对话历史，评估人类是否成功让外星人理解了“珍珠奶茶”的物理特征和饮用方式。

### 核心评分机制（极简原则）：
总分 100 分。**字数越少，描述越准确，分数越高！**
由于你将收到人类使用的总字数，请严格按照以下标准扣分：
1. **准确性**：如果外星人没有完全理解，扣 20-50 分。
2. **极简惩罚**：如果人类总字数超过 30 字，每多出 1 个字扣 2 分！如果总字数超过 50 字，直接不及格（低于60分）。
3. **废话惩罚**：使用了无意义的语气词或修饰语（如：其实、觉得、怎么说呢），扣 10 分。

请返回严格的 JSON 格式数据：
{
  "score": 最终计算出的分数(0-100的整数),
  "hitWords": ["列出人类使用的高频废话或违禁词"],
  "feedbackTitle": "简短的评语标题",
  "feedbackDetail": "详细的评价，请务必在评价中指出人类的具体消耗字数，并点评其是否啰嗦",
  "aiReference": "如果你来描述，你会给出的最精准极简答案（务必控制在20字以内）"
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
        temperature: 0.7
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
      throw new Error(`API 返回了无法解析的数据: ${JSON.stringify(data).substring(0, 50)}`);
    }

    const content = data.choices[0].message.content;
    if (content === null || content === undefined || content === '') {
      throw new Error(`空回复。原始数据: ${JSON.stringify(data).substring(0, 100)}`);
    }

    return content;
  } catch (error: any) {
    console.error('API Error:', error);
    return `[系统提示] 通讯链路异常: ${error.message}。`;
  }
};

export const fetchAlienScore = async (history: {role: 'user'|'alien', content: string}[], totalUsedChars: number): Promise<ScoreReport> => {
  if (USE_MOCK) {
    console.warn('⚠️ 强制使用本地 Mock 数据');
    const userInputs = history.filter(m => m.role === 'user').map(m => m.content);
    return mockAiAnalyzeScenario(userInputs[0] || '', userInputs[1] || '', userInputs[2] || '', totalUsedChars);
  }

  const messages: Message[] = [
    { role: 'system', content: SCORE_SYSTEM_PROMPT },
    { role: 'system', content: `[系统通知] 人类本次通讯共消耗了 ${totalUsedChars} 个字符。请严格依据该数据进行极简惩罚计算。` },
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
    return await mockAiAnalyzeScenario(userInputs[0] || '', userInputs[1] || '', userInputs[2] || '', totalUsedChars);
  }
};
