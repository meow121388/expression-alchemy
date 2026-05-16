import { create } from 'zustand';

export type TaskStatus = 'ready' | 'done' | 'locked';

interface GameState {
  streak: number;
  level: number;
  levelTitle: string;
  tasks: {
    compression: TaskStatus;
    scenario: TaskStatus;
    forbidden: TaskStatus;
  };
  completeTask: (taskId: keyof GameState['tasks']) => void;
}

export const useGameStore = create<GameState>((set) => ({
  streak: 3,
  level: 2,
  levelTitle: '表达学徒',
  tasks: {
    compression: 'ready',
    scenario: 'ready',
    forbidden: 'locked', // MVP 第一版我们先锁定一个作为示例
  },
  completeTask: (taskId) =>
    set((state) => ({
      tasks: {
        ...state.tasks,
        [taskId]: 'done',
      },
    })),
}));
