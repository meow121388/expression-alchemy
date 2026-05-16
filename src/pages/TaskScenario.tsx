import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Loader2, ShieldAlert, Skull, Terminal } from 'lucide-react';
import { ScoreReportModal } from '../components/ScoreReportModal';
import { fetchAlienReply, fetchAlienScore } from '../utils/aiClient';
import type { ScoreReport } from '../utils/mockAiScorer';
import './TaskScenario.css';
import './TaskCompression.css'; 

const TOTAL_CHAR_LIMIT = 50;
const MAX_TURNS = 3;

interface Message {
  role: 'user' | 'alien';
  content: string;
}

export const TaskScenario = () => {
  const navigate = useNavigate();
  const completeTask = useGameStore((state) => state.completeTask);
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'alien', content: '>>> 建立连接...等待地球生物的描述。' }
  ]);
  const [inputText, setInputText] = useState('');
  const [turnCount, setTurnCount] = useState(MAX_TURNS);
  const [isAlienTyping, setIsAlienTyping] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<ScoreReport | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAlienTyping]);

  const totalUsedChars = messages
    .filter(m => m.role === 'user')
    .reduce((acc, m) => acc + m.content.length, 0);

  const charsRemaining = TOTAL_CHAR_LIMIT - totalUsedChars;
  const isInputExceeding = inputText.trim().length > charsRemaining;
  const isSendDisabled = inputText.trim().length === 0 || isInputExceeding || turnCount <= 0 || isAlienTyping || isAnalyzing || totalUsedChars >= TOTAL_CHAR_LIMIT;

  const handleSend = async () => {
    if (isSendDisabled) return;

    const currentInput = inputText.trim();
    const newMessages = [...messages, { role: 'user', content: currentInput } as Message];
    setMessages(newMessages);
    setInputText('');
    
    const newTotalUsedChars = totalUsedChars + currentInput.length;
    const nextTurnCount = turnCount - 1;
    setTurnCount(nextTurnCount);

    if (nextTurnCount === 0 || newTotalUsedChars >= TOTAL_CHAR_LIMIT) {
      // End of transmission
      setIsAnalyzing(true);
      const result = await fetchAlienScore(newMessages);
      setReport(result);
      setIsAnalyzing(false);
    } else {
      setIsAlienTyping(true);
      const alienResponse = await fetchAlienReply(newMessages);
      setMessages(prev => [...prev, { role: 'alien', content: alienResponse }]);
      setIsAlienTyping(false);
    }
  };

  const handleRetry = () => {
    setReport(null);
    setTurnCount(MAX_TURNS);
    setMessages([{ role: 'alien', content: '>>> 连接重置...等待地球生物的描述。' }]);
    setInputText('');
  };

  const handleComplete = () => {
    completeTask('scenario');
    navigate('/');
  };

  return (
    <div className="task-page-container">
      <header className="task-page-header glass-panel">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          <span>放弃通讯返回</span>
        </button>
        <h1 className="task-page-title">第三类接触：三句话协议</h1>
        <div className="task-header-placeholder"></div>
      </header>

      <div className="scenario-workspace">
        <motion.div 
          className="scenario-card-panel alien-theme"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="scenario-header alien-header">
            <ShieldAlert size={28} />
            <h2>最高机密：沟通档案 #X-77</h2>
          </div>
          
          <div className="scenario-details">
            <div className="detail-block">
              <span className="detail-label text-accent">接触实体</span>
              <span className="detail-value glow-text">泽塔星云硅基生命体</span>
            </div>
            <div className="detail-block">
              <span className="detail-label">沟通目标</span>
              <span className="detail-value">向其解释地球液体「珍珠奶茶」</span>
            </div>
          </div>

          <div className="rules-block">
            <h3 className="rules-title"><Skull size={16} /> 【安全通讯守则】</h3>
            <ul className="creepy-rules">
              <li>1. 它没有咀嚼器官，<strong>绝不能使用“嚼”字</strong>，否则可能引发其攻击行为。</li>
              <li>2. 极简原则：全局字数配额上限为 <strong>{TOTAL_CHAR_LIMIT}</strong> 字，最多可分 3 次传输。</li>
              <li>3. 一旦字数耗尽或 3 次频次用光，通讯将强制切断并由系统进行最终理解度判定。</li>
            </ul>
          </div>
        </motion.div>

        <motion.div 
          className="scenario-chat-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="chat-header">
            <Terminal size={20} className="terminal-icon" />
            <span>远端链路 (资源配额制)</span>
            <span className={`turn-counter ${turnCount === 1 || charsRemaining < 10 ? 'critical' : ''}`}>
              频次: {turnCount}/{MAX_TURNS} | 余量: {charsRemaining}/{TOTAL_CHAR_LIMIT}
            </span>
          </div>

          <div className="chat-history">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble-wrapper ${msg.role}`}>
                <div className="chat-bubble">
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isAlienTyping && (
              <div className="chat-bubble-wrapper alien">
                <div className="chat-bubble typing">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="chat-input-area">
            <div className="input-stats">
              <span className={`char-counter ${isInputExceeding ? 'error' : ''}`}>
                本次输入: {inputText.length} / 允许上限: {charsRemaining}
              </span>
            </div>
            <div className="input-row">
              <textarea
                className="chat-textarea"
                rows={2}
                placeholder={charsRemaining <= 0 ? "字数配额已耗尽" : "描述珍珠奶茶..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={turnCount <= 0 || isAlienTyping || isAnalyzing || totalUsedChars >= TOTAL_CHAR_LIMIT}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button 
                className="chat-send-btn"
                disabled={isSendDisabled}
                onClick={handleSend}
              >
                {isAnalyzing ? <Loader2 className="spinner" size={20} /> : <Send size={20} />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <ScoreReportModal 
        isOpen={report !== null}
        report={report}
        onRetry={handleRetry}
        onComplete={handleComplete}
        context="scenario"
      />
    </div>
  );
};
