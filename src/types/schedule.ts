export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  label: string;
}

export interface ScheduleTask {
  id: string;
  type: '迎賓' | '點餐' | '清潔' | '備餐' | '其他';
  description?: string;
}

export interface ScheduleAssignment {
  id: string;
  date: string;
  timeSlotId: string;
  employeeId: string;
  tasks: ScheduleTask[];
  isCompleted: boolean;
  completedAt?: string;
  completedBy?: string;
  notes?: string;
}

export interface WeeklySchedule {
  id: string;
  startDate: string;
  endDate: string;
  assignments: ScheduleAssignment[];
  createdBy: string;
  createdAt: string;
  lastModifiedBy?: string;
  lastModifiedAt?: string;
}