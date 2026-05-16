import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { TaskCard } from '../components/TaskCard';
import { AlignLeft, MessageSquare, Ban, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import '../App.css'; // Reuse existing layout styles

export const Home = () => {
  const navigate = useNavigate();
  const tasks = useGameStore((state) => state.tasks);

  const handleTaskClick = (taskId: string, status: string) => {
    if (status !== 'locked') {
      navigate(`/task/${taskId}`);
    }
  };

  return (
    <div className="app-container">
      <Header />
      
      <motion.section 
        className="welcome-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="welcome-title">今天也要消灭废话！</h1>
        <p className="welcome-subtitle">完成今日三局，提升你的表达密度。</p>
      </motion.section>

      <motion.section 
        className="tasks-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <TaskCard 
          title="文本压缩挑战"
          description="将一段 120 字的废话压缩到 36 字以内。"
          Icon={AlignLeft}
          status={tasks.compression}
          onClick={() => handleTaskClick('compression', tasks.compression)}
        />
        <TaskCard 
          title="三句话情境挑战"
          description="向不耐烦的客服申请退款，最多只能说三句。"
          Icon={MessageSquare}
          status={tasks.scenario}
          onClick={() => handleTaskClick('scenario', tasks.scenario)}
        />
        <TaskCard 
          title="禁词挑战"
          description="在不使用今日禁词的情况下，解释一个复杂概念。"
          Icon={Ban}
          status={tasks.forbidden}
          onClick={() => handleTaskClick('forbidden', tasks.forbidden)}
        />
      </motion.section>

      <motion.section 
        className="daily-special"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="daily-special-content">
          <span className="daily-special-label">今日高频废话拦截</span>
          <span className="daily-special-word">「其实...」</span>
        </div>
        <div className="daily-special-icon">
          <Target size={24} />
        </div>
      </motion.section>
    </div>
  );
};
