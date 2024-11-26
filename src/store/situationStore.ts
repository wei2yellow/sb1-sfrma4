import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';
import { ServiceSituation, ServiceResponse } from '../types/situation';

interface SituationState {
  situations: ServiceSituation[];
  addSituation: (situation: Omit<ServiceSituation, 'id' | 'createdAt' | 'isActive' | 'responses'>) => Promise<void>;
  updateSituation: (id: string, updates: Partial<ServiceSituation>) => Promise<void>;
  deleteSituation: (id: string) => Promise<void>;
  addResponse: (response: Omit<ServiceResponse, 'id' | 'createdAt' | 'isActive'>) => Promise<void>;
  updateResponse: (id: string, updates: Partial<ServiceResponse>) => Promise<void>;
  deleteResponse: (id: string) => Promise<void>;
  getSituationsByCategory: (category: string) => ServiceSituation[];
  getHighPrioritySituations: () => ServiceSituation[];
}

export const useSituationStore = create<SituationState>()(
  persist(
    (set, get) => ({
      situations: [],

      addSituation: async (situation) => {
        const { data } = await api.post('/api/situations', situation);
        set((state) => ({
          situations: [...state.situations, data]
        }));
      },

      updateSituation: async (id, updates) => {
        const { data } = await api.patch(`/api/situations/${id}`, updates);
        set((state) => ({
          situations: state.situations.map((s) => s.id === id ? { ...s, ...data } : s)
        }));
      },

      deleteSituation: async (id) => {
        await api.delete(`/api/situations/${id}`);
        set((state) => ({
          situations: state.situations.filter((s) => s.id !== id)
        }));
      },

      addResponse: async (response) => {
        const { data } = await api.post('/api/responses', response);
        set((state) => ({
          situations: state.situations.map((s) =>
            s.id === response.situationId
              ? {
                  ...s,
                  responses: [...(s.responses || []), data]
                }
              : s
          )
        }));
      },

      updateResponse: async (id, updates) => {
        const { data } = await api.patch(`/api/responses/${id}`, updates);
        set((state) => ({
          situations: state.situations.map((s) => ({
            ...s,
            responses: s.responses?.map((r) =>
              r.id === id ? { ...r, ...data } : r
            )
          }))
        }));
      },

      deleteResponse: async (id) => {
        await api.delete(`/api/responses/${id}`);
        set((state) => ({
          situations: state.situations.map((s) => ({
            ...s,
            responses: s.responses?.filter((r) => r.id !== id)
          }))
        }));
      },

      getSituationsByCategory: (category) => {
        return category === 'all'
          ? get().situations.filter((s) => s.isActive)
          : get().situations.filter((s) => s.category === category && s.isActive);
      },

      getHighPrioritySituations: () => {
        return get().situations.filter((s) => s.priority === 'high' && s.isActive);
      },
    }),
    {
      name: 'situation-storage',
      partialize: (state) => ({
        situations: state.situations
      })
    }
  )
);