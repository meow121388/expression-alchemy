import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  current: number;
  max: number;
  target: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, max, target }) => {
  const percentage = Math.min((current / max) * 100, 100);
  const targetPercentage = (target / max) * 100;
  
  let statusClass = 'normal';
  if (current > max) statusClass = 'danger';
  else if (current <= target) statusClass = 'success';
  else if (current <= target + 20) statusClass = 'warning';

  return (
    <div className="progress-container">
      <div className="progress-header">
        <span className="progress-label">字数进度</span>
        <span className={`progress-count ${statusClass}`}>
          {current} <span className="progress-max">/ {target} 目标</span>
        </span>
      </div>
      <div className="progress-track">
        <div 
          className={`progress-fill ${statusClass}`} 
          style={{ width: `${percentage}%` }}
        />
        <div 
          className="progress-target-marker"
          style={{ left: `${targetPercentage}%` }}
        />
      </div>
      <div className="progress-footer">
        {statusClass === 'danger' && <span className="progress-msg danger-text">字数溢出！</span>}
        {statusClass === 'success' && <span className="progress-msg success-text">字数达标，干得漂亮！</span>}
        {statusClass === 'warning' && <span className="progress-msg warning-text">还差一点就达标了...</span>}
        {statusClass === 'normal' && <span className="progress-msg">继续压缩，提炼重点。</span>}
      </div>
    </div>
  );
};
