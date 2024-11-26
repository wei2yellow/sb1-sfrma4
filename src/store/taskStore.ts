import { create } from 'zustand';
import { Task, TaskFilter, TaskType, DailyTask } from '../types/task';
import { differenceInDays, addDays } from 'date-fns';

interface TaskState {
  tasks: Task[];
  dailyTasks: DailyTask[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => void;
  addDailyTask: (task: Omit<DailyTask, 'id' | 'createdAt' | 'status'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string, userId: string) => void;
  getTasks: (filter: TaskFilter) => Task[];
  getDailyTasks: () => DailyTask[];
  getScheduledTasks: () => Task[];
  getRemainingDays: (task: Task) => number;
  getTaskProgress: (task: Task) => number;
  updateTaskProgress: (id: string, progress: number) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  dailyTasks: [],

  addTask: (task) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'pending',
      progress: 0
    };

    // If it's a scheduled task, calculate the end date based on duration
    if (task.duration) {
      newTask.dueDate = addDays(new Date(task.startDate || new Date()), task.duration).toISOString();
    }

    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },

  addDailyTask: (task) => {
    const newTask: DailyTask = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    set((state) => ({ dailyTasks: [...state.dailyTasks, newTask] }));
  },

  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
      dailyTasks: state.dailyTasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      )
    }));
  },

  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
      dailyTasks: state.dailyTasks.filter((task) => task.id !== id)
    }));
  },

  completeTask: (id, userId) => {
    const now = new Date().toISOString();
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: 'completed',
              completedAt: now,
              completedBy: userId,
              progress: 100
            }
          : task
      ),
      dailyTasks: state.dailyTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: 'completed',
              completedAt: now,
              completedBy: userId
            }
          : task
      )
    }));
  },

  getTasks: (filter) => {
    return get().tasks.filter((task) => {
      if (filter.type && task.type !== filter.type) return false;
      if (filter.category && task.category !== filter.category) return false;
      if (filter.status && task.status !== filter.status) return false;
      if (filter.priority && task.priority !== filter.priority) return false;
      if (filter.assignedTo && !task.assignedTo?.includes(filter.assignedTo)) return false;
      if (filter.createdBy && task.createdBy !== filter.createdBy) return false;
      if (filter.dateRange) {
        const taskDate = new Date(task.dueDate);
        const start = new Date(filter.dateRange.start);
        const end = new Date(filter.dateRange.end);
        if (taskDate < start || taskDate > end) return false;
      }
      return true;
    });
  },

  getDailyTasks: () => {
    return get().dailyTasks;
  },

  getScheduledTasks: () => {
    return get().tasks.filter(task => 
      task.type === 'scheduled' && 
      task.status !== 'completed' &&
      new Date(task.dueDate) >= new Date()
    );
  },

  getRemainingDays: (task) => {
    if (task.status === 'completed') return 0;
    return differenceInDays(new Date(task.dueDate), new Date());
  },

  getTaskProgress: (task) => {
    if (task.status === 'completed') return 100;
    return task.progress || 0;
  },

  updateTaskProgress: (id, progress) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              progress,
              status: progress >= 100 ? 'completed' : task.status
            }
          : task
      )
    }));
  }
}));