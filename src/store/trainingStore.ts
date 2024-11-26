import { create } from 'zustand';
import { TrainingModule, TrainingContent, TrainingScheduleItem, TrainingStatus } from '../types/training';

interface TrainingState {
  modules: TrainingModule[];
  addModule: (module: Omit<TrainingModule, 'id' | 'createdAt' | 'contents'>) => string;
  updateModule: (id: string, updates: Partial<TrainingModule>) => void;
  deleteModule: (id: string) => void;
  addContent: (moduleId: string, content: Omit<TrainingContent, 'id'>) => void;
  updateContent: (moduleId: string, contentId: string, updates: Partial<TrainingContent>) => void;
  deleteContent: (moduleId: string, contentId: string) => void;
  reorderContent: (moduleId: string, contentId: string, newOrder: number) => void;
  markModuleComplete: (moduleId: string, userId: string) => void;
  getModulesByCategory: (category: string) => TrainingModule[];
  addSchedule: (moduleId: string, schedule: Omit<TrainingScheduleItem, 'id'>) => void;
  updateSchedule: (moduleId: string, scheduleId: string, updates: Partial<TrainingScheduleItem>) => void;
  deleteSchedule: (moduleId: string, scheduleId: string) => void;
  updateScheduleStatus: (moduleId: string, scheduleId: string, status: TrainingStatus) => void;
  getSchedulesByDateRange: (startDate: string, endDate: string) => TrainingScheduleItem[];
}

export const useTrainingStore = create<TrainingState>((set, get) => ({
  modules: [],

  addModule: (module) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newModule: TrainingModule = {
      ...module,
      id,
      createdAt: new Date().toISOString(),
      contents: [],
      completedBy: [],
      schedules: []
    };

    set((state) => ({
      modules: [...state.modules, newModule]
    }));

    return id;
  },

  updateModule: (id, updates) => {
    set((state) => ({
      modules: state.modules.map((module) =>
        module.id === id
          ? {
              ...module,
              ...updates,
              updatedAt: new Date().toISOString()
            }
          : module
      )
    }));
  },

  deleteModule: (id) => {
    set((state) => ({
      modules: state.modules.filter((module) => module.id !== id)
    }));
  },

  addContent: (moduleId, content) => {
    const newContent: TrainingContent = {
      ...content,
      id: Math.random().toString(36).substr(2, 9)
    };

    set((state) => ({
      modules: state.modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              contents: [...module.contents, newContent],
              updatedAt: new Date().toISOString()
            }
          : module
      )
    }));
  },

  updateContent: (moduleId, contentId, updates) => {
    set((state) => ({
      modules: state.modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              contents: module.contents.map((content) =>
                content.id === contentId
                  ? { ...content, ...updates }
                  : content
              ),
              updatedAt: new Date().toISOString()
            }
          : module
      )
    }));
  },

  deleteContent: (moduleId, contentId) => {
    set((state) => ({
      modules: state.modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              contents: module.contents.filter(
                (content) => content.id !== contentId
              ),
              updatedAt: new Date().toISOString()
            }
          : module
      )
    }));
  },

  reorderContent: (moduleId, contentId, newOrder) => {
    set((state) => ({
      modules: state.modules.map((module) => {
        if (module.id !== moduleId) return module;

        const contents = [...module.contents];
        const contentIndex = contents.findIndex((c) => c.id === contentId);
        if (contentIndex === -1) return module;

        const content = contents[contentIndex];
        contents.splice(contentIndex, 1);
        contents.splice(newOrder, 0, content);

        contents.forEach((c, index) => {
          c.order = index;
        });

        return {
          ...module,
          contents,
          updatedAt: new Date().toISOString()
        };
      })
    }));
  },

  markModuleComplete: (moduleId, userId) => {
    set((state) => ({
      modules: state.modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              completedBy: [
                ...(module.completedBy || []),
                { userId, completedAt: new Date().toISOString() }
              ]
            }
          : module
      )
    }));
  },

  getModulesByCategory: (category) => {
    return category === 'all'
      ? get().modules
      : get().modules.filter((module) => module.category === category);
  },

  addSchedule: (moduleId, schedule) => {
    const newSchedule: TrainingScheduleItem = {
      ...schedule,
      id: Math.random().toString(36).substr(2, 9)
    };

    set((state) => ({
      modules: state.modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              schedules: [...(module.schedules || []), newSchedule],
              updatedAt: new Date().toISOString()
            }
          : module
      )
    }));
  },

  updateSchedule: (moduleId, scheduleId, updates) => {
    set((state) => ({
      modules: state.modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              schedules: module.schedules?.map((schedule) =>
                schedule.id === scheduleId
                  ? { ...schedule, ...updates }
                  : schedule
              ),
              updatedAt: new Date().toISOString()
            }
          : module
      )
    }));
  },

  deleteSchedule: (moduleId, scheduleId) => {
    set((state) => ({
      modules: state.modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              schedules: module.schedules?.filter(
                (schedule) => schedule.id !== scheduleId
              ),
              updatedAt: new Date().toISOString()
            }
          : module
      )
    }));
  },

  updateScheduleStatus: (moduleId, scheduleId, status) => {
    set((state) => ({
      modules: state.modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              schedules: module.schedules?.map((schedule) =>
                schedule.id === scheduleId
                  ? { ...schedule, status }
                  : schedule
              ),
              updatedAt: new Date().toISOString()
            }
          : module
      )
    }));
  },

  getSchedulesByDateRange: (startDate, endDate) => {
    const allSchedules: TrainingScheduleItem[] = [];
    get().modules.forEach((module) => {
      module.schedules?.forEach((schedule) => {
        if (schedule.date >= startDate && schedule.date <= endDate) {
          allSchedules.push(schedule);
        }
      });
    });
    return allSchedules;
  },
}));