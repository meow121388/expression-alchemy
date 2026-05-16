import { Flame, UserCircle } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import './Header.css';

export const Header = () => {
  const { streak, level, levelTitle } = useGameStore();

  return (
    <header className="app-header glass-panel">
      <div className="header-left">
        <div className="streak-badge">
          <Flame size={18} className="streak-icon" />
          <span className="streak-count">{streak} 天</span>
        </div>
        <div className="level-badge">
          <span className="level-text">Lv.{level} {levelTitle}</span>
        </div>
      </div>
      
      <button className="profile-btn">
        <UserCircle size={28} />
      </button>
    </header>
  );
};
