export interface UserStatistics {
  userId: string;
  username: string;
  name: string;
  role: string;
  totalLoginTime: number; // in minutes
  lastLogin?: string;
  lastActive?: string;
  loginCount: number;
  taskCompletionRate: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: 'login' | 'logout' | 'task_complete' | 'content_edit' | 'announcement_create';
  timestamp: string;
  details?: string;
}