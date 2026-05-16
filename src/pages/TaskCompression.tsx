import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { ProgressBar } from '../components/ProgressBar';
import { ScoreReportModal } from '../components/ScoreReportModal';
import { mockAiAnalyze } from '../utils/mockAiScorer';
import type { ScoreReport } from '../utils/mockAiScorer';
import './TaskCompression.css';

const ORIGINAL_TEXT = "其实我觉得吧，在当前这个大环境下，我们可能需要花更多的时间去深入研究和探讨一下关于未来产品走向的问题。因为无论从哪个角度来看，市场的变化都是非常迅速的。所以也就是说，如果我们不能提前做好准备的话，很可能就会面临被淘汰的风险。总之，我的核心意思是，咱们得抓紧时间把新版本的核心功能给敲定下来，然后赶紧投入开发。";
const TARGET_LENGTH = 36;
const MAX_LENGTH = 120; // Allow typing up to original length

export const TaskCompression = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const completeTask = useGameStore((state) => state.completeTask);
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<ScoreReport | null>(null);
  
  const currentLength = inputText.length;
  const isTargetMet = currentLength > 0 && currentLength <= TARGET_LENGTH;

  const handleSubmit = async () => {
    if (!isTargetMet) return;
    setIsAnalyzing(true);
    const result = await mockAiAnalyze(inputText, ORIGINAL_TEXT.length);
    setReport(result);
    setIsAnalyzing(false);
  };

  const handleRetry = () => {
    setReport(null);
  };

  const handleComplete = () => {
    if (taskId && isTargetMet) {
      completeTask(taskId as 'compression' | 'scenario' | 'forbidden');
      navigate('/');
    }
  };

  return (
    <div className="task-page-container">
      <header className="task-page-header glass-panel">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          <span>返回首页</span>
        </button>
        <h1 className="task-page-title">文本压缩挑战</h1>
        <div className="task-header-placeholder"></div>
      </header>

      <div className="task-workspace">
        <motion.div 
          className="original-text-panel glass-panel"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="panel-header">
            <span className="panel-tag">待处理废话</span>
            <span className="word-count">字数: {ORIGINAL_TEXT.length}</span>
          </div>
          <div className="original-text-content">
            {ORIGINAL_TEXT}
          </div>
          <div className="panel-footer">
            <p className="task-goal">
              🎯 目标：保留核心信息，不改变原意，压缩到 <strong>{TARGET_LENGTH}</strong> 字以内。
            </p>
          </div>
        </motion.div>

        <motion.div 
          className="editor-panel glass-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ProgressBar current={currentLength} max={MAX_LENGTH} target={TARGET_LENGTH} />
          
          <textarea
            className="compression-textarea"
            placeholder="在这里输入你提炼后的版本..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <div className="editor-actions">
            <button 
              className={`submit-btn ${isTargetMet ? 'active' : 'disabled'}`}
              onClick={handleSubmit}
              disabled={!isTargetMet || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="spinner" size={20} />
                  <span>AI 正在评估...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>{isTargetMet ? '提交给 AI 裁判' : '字数未达标'}</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
      
      <ScoreReportModal 
        isOpen={report !== null}
        report={report}
        onRetry={handleRetry}
        onComplete={handleComplete}
      />
    </div>
  );
};
