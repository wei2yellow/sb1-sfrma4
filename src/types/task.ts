export type TaskType = 'urgent' | 'headquarters' | 'special' | 'scheduled';
export type TaskCategory = 'service' | 'bar' | 'all';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'normal' | 'urgent';

export interface Task {
  id: string;
  type: TaskType;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  createdBy: string;
  dueDate: string;
  startDate?: string;
  completedAt?: string;
  completedBy?: string;
  visibleTo: string[];
  assignedTo?: string[];
  duration?: number; // in days
  progress?: number; // 0-100
  scheduledTime?: string;
  position?: string;
}

export interface TaskFilter {
  type?: TaskType;
  category?: TaskCategory;
  status?: TaskStatus;
  priority?: TaskPriority;
  dateRange?: {
    start: string;
    end: string;
  };
  assignedTo?: string;
  createdBy?: string;
}

export interface DailyTask extends Task {
  scheduledTime: string;
  isRecurring: boolean;
  recurringDays: number[]; // 0-6 for Sunday-Saturday
}