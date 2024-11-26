import { create } from 'zustand';
import { Announcement, AnnouncementQuestion } from '../types/announcement';

interface AnnouncementState {
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt' | 'readBy'>) => void;
  markAsRead: (announcementId: string, userId: string) => void;
  addQuestion: (announcementId: string, question: string, userId: string) => void;
  answerQuestion: (announcementId: string, questionId: string, answer: string, userId: string) => void;
  getUnreadAnnouncements: (userId: string) => Announcement[];
  getVisibleAnnouncements: (userId: string, role: string) => Announcement[];
}

export const useAnnouncementStore = create<AnnouncementState>((set, get) => ({
  announcements: [],

  addAnnouncement: (announcement) => {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      readBy: [],
      questions: []
    };

    set((state) => ({
      announcements: [...state.announcements, newAnnouncement]
    }));
  },

  markAsRead: (announcementId, userId) => {
    set((state) => ({
      announcements: state.announcements.map((announcement) =>
        announcement.id === announcementId
          ? {
              ...announcement,
              readBy: [
                ...announcement.readBy,
                { userId, readAt: new Date().toISOString() }
              ]
            }
          : announcement
      )
    }));
  },

  addQuestion: (announcementId, question, userId) => {
    set((state) => ({
      announcements: state.announcements.map((announcement) =>
        announcement.id === announcementId
          ? {
              ...announcement,
              questions: [
                ...(announcement.questions || []),
                {
                  id: Math.random().toString(36).substr(2, 9),
                  userId,
                  question,
                  createdAt: new Date().toISOString()
                }
              ]
            }
          : announcement
      )
    }));
  },

  answerQuestion: (announcementId, questionId, answer, userId) => {
    set((state) => ({
      announcements: state.announcements.map((announcement) =>
        announcement.id === announcementId
          ? {
              ...announcement,
              questions: announcement.questions?.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      answer,
                      answeredAt: new Date().toISOString(),
                      answeredBy: userId
                    }
                  : q
              )
            }
          : announcement
      )
    }));
  },

  getUnreadAnnouncements: (userId) => {
    return get().announcements.filter(
      (a) => !a.readBy.some((r) => r.userId === userId)
    );
  },

  getVisibleAnnouncements: (userId, role) => {
    return get().announcements.filter(
      (a) => a.visibleTo.includes(role) || a.visibleTo.includes(userId)
    );
  }
}));