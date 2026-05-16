import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Home, Target, Sparkles, AlertTriangle } from 'lucide-react';
import type { ScoreReport } from '../utils/mockAiScorer';
import './ScoreReportModal.css';

interface ScoreReportModalProps {
  isOpen: boolean;
  report: ScoreReport | null;
  onRetry: () => void;
  onComplete: () => void;
  context?: 'compression' | 'scenario' | 'forbidden';
}

export const ScoreReportModal: React.FC<ScoreReportModalProps> = ({ isOpen, report, onRetry, onComplete, context = 'compression' }) => {
  if (!report) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay">
          <motion.div 
            className="score-modal glass-panel"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <div className="score-header">
              <h2 className="score-title">
                {context === 'scenario' ? (
                  <><Target size={24} /> 外星人通讯解析报告</>
                ) : (
                  <><Target size={24} /> 表达体检报告</>
                )}
              </h2>
            </div>

            <div className="score-body">
              <div className="score-main">
                <div className="score-circle">
                  <span className="score-value">{report.score}</span>
                  <span className="score-label">
                    {context === 'scenario' ? '理解度' : '表达密度'}
                  </span>
                </div>
                <div className="score-stats">
                  <div className="stat-item">
                    <span className="stat-label">废话粉碎率</span>
                    <span className="stat-value">{report.compressionRate}%</span>
                  </div>
                </div>
              </div>

              {report.hitWords.length > 0 && (
                <div className="feedback-section warning">
                  <h3><AlertTriangle size={18} /> 废话雷达警报</h3>
                  <p>揪出高频冗余词：</p>
                  <div className="bad-words-list">
                    {report.hitWords.map((word, idx) => (
                      <span key={idx} className="bad-word-tag">{word}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="feedback-section ai-comment">
                <h3>{report.feedbackTitle}</h3>
                <p>{report.feedbackDetail}</p>
              </div>

              <div className="feedback-section ai-reference">
                <h3><Sparkles size={18} /> {context === 'scenario' ? '大模型最佳范例' : 'AI 极简版参考'}</h3>
                <p>"{report.aiReference}"</p>
              </div>
            </div>

            <div className="score-actions">
              <button className="action-btn retry-btn" onClick={onRetry}>
                <RefreshCcw size={18} /> {context === 'scenario' ? '重置通讯链路' : '再压一次'}
              </button>
              <button className="action-btn complete-btn" onClick={onComplete}>
                <Home size={18} /> 满意，打卡返回
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
