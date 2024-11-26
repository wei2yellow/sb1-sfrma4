import { create } from 'zustand';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import { 
  TimeSlot, 
  ScheduleAssignment, 
  WeeklySchedule,
  ScheduleTask
} from '../types/schedule';

interface ScheduleState {
  timeSlots: TimeSlot[];
  schedules: WeeklySchedule[];
  currentWeek: string;
  addTimeSlot: (timeSlot: Omit<TimeSlot, 'id'>) => void;
  updateTimeSlot: (id: string, updates: Partial<TimeSlot>) => void;
  deleteTimeSlot: (id: string) => void;
  createWeeklySchedule: (startDate: string, createdBy: string) => WeeklySchedule;
  addAssignment: (weekId: string, assignment: ScheduleAssignment) => void;
  updateAssignment: (weekId: string, assignmentId: string, updates: Partial<ScheduleAssignment>) => void;
  deleteAssignment: (weekId: string, assignmentId: string) => void;
  markAssignmentComplete: (weekId: string, assignmentId: string, employeeId: string) => void;
  getWeeklySchedule: (date: string) => WeeklySchedule | undefined;
  getEmployeeSchedule: (employeeId: string, date: string) => ScheduleAssignment[];
  addTaskToAssignment: (weekId: string, assignmentId: string, task: Omit<ScheduleTask, 'id'>) => void;
  removeTaskFromAssignment: (weekId: string, assignmentId: string, taskId: string) => void;
}

// Initial time slots
const INITIAL_TIME_SLOTS: TimeSlot[] = [
  {
    id: '1',
    startTime: '09:00',
    endTime: '14:00',
    label: '上午班'
  },
  {
    id: '2',
    startTime: '14:00',
    endTime: '18:00',
    label: '下午班'
  },
  {
    id: '3',
    startTime: '18:00',
    endTime: '22:00',
    label: '晚班'
  }
];

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  timeSlots: INITIAL_TIME_SLOTS,
  schedules: [],
  currentWeek: format(new Date(), 'yyyy-MM-dd'),

  addTimeSlot: (timeSlot) => {
    const newTimeSlot: TimeSlot = {
      ...timeSlot,
      id: Math.random().toString(36).substr(2, 9)
    };
    set((state) => ({
      timeSlots: [...state.timeSlots, newTimeSlot]
    }));
  },

  updateTimeSlot: (id, updates) => {
    set((state) => ({
      timeSlots: state.timeSlots.map((slot) =>
        slot.id === id ? { ...slot, ...updates } : slot
      )
    }));
  },

  deleteTimeSlot: (id) => {
    set((state) => ({
      timeSlots: state.timeSlots.filter((slot) => slot.id !== id)
    }));
  },

  createWeeklySchedule: (startDate, createdBy) => {
    const start = startOfWeek(new Date(startDate));
    const end = endOfWeek(start);
    
    const newSchedule: WeeklySchedule = {
      id: Math.random().toString(36).substr(2, 9),
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(end, 'yyyy-MM-dd'),
      assignments: [],
      createdBy,
      createdAt: new Date().toISOString()
    };

    set((state) => ({
      schedules: [...state.schedules, newSchedule]
    }));

    return newSchedule;
  },

  addAssignment: (weekId, assignment) => {
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === weekId
          ? {
              ...schedule,
              assignments: [...schedule.assignments, assignment]
            }
          : schedule
      )
    }));
  },

  updateAssignment: (weekId, assignmentId, updates) => {
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === weekId
          ? {
              ...schedule,
              assignments: schedule.assignments.map((assignment) =>
                assignment.id === assignmentId
                  ? { ...assignment, ...updates }
                  : assignment
              )
            }
          : schedule
      )
    }));
  },

  deleteAssignment: (weekId, assignmentId) => {
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === weekId
          ? {
              ...schedule,
              assignments: schedule.assignments.filter(
                (assignment) => assignment.id !== assignmentId
              )
            }
          : schedule
      )
    }));
  },

  markAssignmentComplete: (weekId, assignmentId, employeeId) => {
    const now = new Date().toISOString();
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === weekId
          ? {
              ...schedule,
              assignments: schedule.assignments.map((assignment) =>
                assignment.id === assignmentId
                  ? {
                      ...assignment,
                      isCompleted: true,
                      completedAt: now,
                      completedBy: employeeId
                    }
                  : assignment
              )
            }
          : schedule
      )
    }));
  },

  getWeeklySchedule: (date) => {
    const targetDate = new Date(date);
    return get().schedules.find(
      (schedule) =>
        new Date(schedule.startDate) <= targetDate &&
        new Date(schedule.endDate) >= targetDate
    );
  },

  getEmployeeSchedule: (employeeId, date) => {
    const schedule = get().getWeeklySchedule(date);
    if (!schedule) return [];
    return schedule.assignments.filter(
      (assignment) => assignment.employeeId === employeeId
    );
  },

  addTaskToAssignment: (weekId, assignmentId, task) => {
    const newTask: ScheduleTask = {
      ...task,
      id: Math.random().toString(36).substr(2, 9)
    };

    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === weekId
          ? {
              ...schedule,
              assignments: schedule.assignments.map((assignment) =>
                assignment.id === assignmentId
                  ? {
                      ...assignment,
                      tasks: [...assignment.tasks, newTask]
                    }
                  : assignment
              )
            }
          : schedule
      )
    }));
  },

  removeTaskFromAssignment: (weekId, assignmentId, taskId) => {
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === weekId
          ? {
              ...schedule,
              assignments: schedule.assignments.map((assignment) =>
                assignment.id === assignmentId
                  ? {
                      ...assignment,
                      tasks: assignment.tasks.filter((task) => task.id !== taskId)
                    }
                  : assignment
              )
            }
          : schedule
      )
    }));
  }
}));