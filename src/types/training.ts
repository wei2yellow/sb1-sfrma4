export type TrainingCategory = 'basic' | 'service' | 'product';
export type ContentType = 'text' | 'video';
export type TrainingStatus = 'pending' | 'in_progress' | 'completed';

export interface TrainingContent {
  id: string;
  type: ContentType;
  content: string;
  order: number;
}

export interface TrainingScheduleItem {
  id: string;
  moduleId: string;
  date: string;
  startTime: string;
  endTime: string;
  trainerId: string;
  trainees: string[];
  status: TrainingStatus;
  notes?: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  category: TrainingCategory;
  duration: string;
  contents: TrainingContent[];
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  assignedTo?: string[];
  completedBy?: {
    userId: string;
    completedAt: string;
  }[];
  schedules?: TrainingScheduleItem[];
}