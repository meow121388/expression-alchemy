export interface ScoreReport {
  score: number;
  compressionRate: number;
  hitWords: string[];
  feedbackTitle: string;
  feedbackDetail: string;
  aiReference: string;
}

const REDUNDANT_WORDS = ['其实', '可能', '感觉', '就是说', '然后', '某种程度上', '我觉得', '怎么说呢', '吧', '的话'];

export const mockAiAnalyze = (input: string, originalLength: number): Promise<ScoreReport> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      let score = 95;
      const hitWords: string[] = [];

      // 检测废话词
      REDUNDANT_WORDS.forEach(word => {
        if (input.includes(word)) {
          hitWords.push(word);
          score -= 8; // 每命中一个扣8分
        }
      });

      // 计算压缩率
      const currentLength = input.length;
      const compressionRate = Math.round((1 - currentLength / originalLength) * 100);

      // 字数惩罚（虽然前端有限制，但为了逻辑完整性保留）
      if (currentLength > 36) {
        score -= (currentLength - 36) * 2;
      }

      // 分数兜底
      score = Math.max(score, 40);

      let feedbackTitle = "";
      let feedbackDetail = "";

      if (score >= 90) {
        feedbackTitle = "表达大师！";
        feedbackDetail = "句句切中要害，毫无废话，请收下我的膝盖。";
      } else if (score >= 75) {
        feedbackTitle = "相当不错！";
        feedbackDetail = "核心意思表达清楚了，但还可以更干练一点，试试再删掉一些修饰词？";
      } else {
        feedbackTitle = "有点啰嗦哦~";
        feedbackDetail = "铺垫太多会削弱你的核心诉求。结论先行，直奔主题会更有力。";
      }

      resolve({
        score,
        compressionRate,
        hitWords,
        feedbackTitle,
        feedbackDetail,
        aiReference: "我们需要尽快敲定新版本的核心功能并投入开发，以应对市场变化和淘汰风险。"
      });
    }, 1500); // 1.5秒延迟模拟思考
  });
};

export const mockAiAnalyzeScenario = (s1: string, s2: string, s3: string, totalUsedChars: number): Promise<ScoreReport> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let score = 95;
      const hitWords: string[] = [];
      const combinedInput = s1 + s2 + s3;

      REDUNDANT_WORDS.forEach(word => {
        if (combinedInput.includes(word)) {
          hitWords.push(word);
          score -= 10;
        }
      });

      // Extreme penalty for verbosity
      if (totalUsedChars > 50) {
        score -= 40; // Auto fail
      } else if (totalUsedChars > 30) {
        score -= (totalUsedChars - 30) * 2;
      } else if (totalUsedChars < 20 && totalUsedChars > 5) {
        score += 5; // Bonus for extreme conciseness
      }

      // Basic length check (too short = probably didn't explain well)
      if (s1.length < 2 && s2.length < 2 && s3.length < 2) {
        score -= 50;
      }

      score = Math.max(Math.min(score, 100), 10);

      let feedbackTitle = "";
      let feedbackDetail = "";

      if (score >= 90) {
        feedbackTitle = "字字珠玑！";
        feedbackDetail = `仅用了 ${totalUsedChars} 个字就把这事说明白了！外星人对你的信息密度表示惊叹，决定不摧毁地球。`;
      } else if (score >= 60) {
        feedbackTitle = "勉强过关";
        feedbackDetail = `你用了 ${totalUsedChars} 个字。虽然对方听懂了，但你的描述略显啰嗦。记住，外星人的处理资源很宝贵。`;
      } else {
        feedbackTitle = "废话连篇！";
        feedbackDetail = `你竟然用了 ${totalUsedChars} 个字！外星人的处理器因为处理过多废话而过载，通讯强行切断！`;
      }

      resolve({
        score,
        compressionRate: 100, // Not applicable
        hitWords,
        feedbackTitle,
        feedbackDetail,
        aiReference: "黑色淀粉球，浸泡在含糖奶茶中，需用吸管吸食。"
      });
    }, 1500);
  });
};

export const mockAlienReply = (input: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (input.includes('嚼')) {
        resolve('[系统警告] 实体感受到严重的挑衅，它身上的红色斑纹开始极速闪烁！通讯面临中断风险。');
      } else if (input.includes('黑') || input.includes('球') || input.includes('珍珠')) {
        resolve('记录：已识别液态内部存在黑色球状微粒。这些颗粒是否具有独立的思考能力或寄生意图？');
      } else if (input.includes('甜') || input.includes('奶') || input.includes('茶')) {
        resolve('分析液态成分...检出高浓度碳水混合物。持续摄入该物质是否会导致地球人的生物装甲变厚？');
      } else if (input.includes('管') || input.includes('喝') || input.includes('吸')) {
        resolve('理解摄入方式为使用管状工具。收到，我正在体表临时生成对应的摄入孔洞。请继续说明内部物质。');
      } else {
        resolve('数据不足，无法在认知库中建立物质模型。请明确它的物理状态特征。');
      }
    }, 1200);
  });
};
