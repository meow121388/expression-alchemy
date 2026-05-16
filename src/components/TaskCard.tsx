import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import './TaskCard.css';

interface TaskCardProps {
  title: string;
  description: string;
  Icon: LucideIcon;
  status: 'ready' | 'done' | 'locked';
  onClick?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ title, description, Icon, status, onClick }) => {
  const isDone = status === 'done';
  const isLocked = status === 'locked';

  return (
    <div
      className={`task-card ${status} glass-panel`}
      onClick={!isLocked ? onClick : undefined}
    >
      <div className="task-header">
        <div className="task-icon-wrapper">
          <Icon className="task-icon" size={28} />
        </div>
      </div>
      
      <div className="task-content">
        <h3 className="task-title">{title}</h3>
        <p className="task-desc">{description}</p>
      </div>

      <div className="task-footer">
        {isDone ? (
          <CheckCircle2 className="task-done-icon" size={32} />
        ) : (
          <button className="task-btn" disabled={isLocked}>
            {isLocked ? '锁定' : '开始挑战'}
          </button>
        )}
      </div>
    </div>
  );
};
