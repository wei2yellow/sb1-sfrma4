import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, LoginCredentials } from '../types/auth';
import { setAuthToken, setAuthUser, removeAuthToken, getAuthToken, getAuthUser } from '../lib/auth';
import api from '../lib/api';

interface AuthState {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  fetchUsers: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: getAuthUser(),
      users: [],
      isAuthenticated: Boolean(getAuthToken()),

      login: async (credentials) => {
        // Super admin check
        if (credentials.username === 'weiwei' && credentials.password === '920321') {
          const user: User = {
            id: '1',
            username: 'weiwei',
            name: '超級管理者',
            role: 'SUPER_ADMIN',
            createdAt: new Date().toISOString()
          };
          
          setAuthUser(user);
          set({ user, isAuthenticated: true });
          return;
        }

        try {
          const { data } = await api.post('/auth/login', credentials);
          setAuthToken(data.token);
          setAuthUser(data.user);
          set({ user: data.user, isAuthenticated: true });
        } catch (error) {
          throw new Error('帳號或密碼錯誤');
        }
      },

      logout: () => {
        removeAuthToken();
        set({ user: null, isAuthenticated: false });
      },

      addUser: async (userData) => {
        try {
          const { data } = await api.post('/api/users', userData);
          set((state) => ({
            users: [...state.users, data]
          }));
        } catch (error) {
          throw new Error('新增使用者失敗');
        }
      },

      updateUser: async (id, updates) => {
        try {
          const { data } = await api.patch(`/api/users/${id}`, updates);
          set((state) => ({
            users: state.users.map((user) => 
              user.id === id ? { ...user, ...data } : user
            )
          }));
        } catch (error) {
          throw new Error('更新使用者失敗');
        }
      },

      deleteUser: async (id) => {
        try {
          await api.delete(`/api/users/${id}`);
          set((state) => ({
            users: state.users.filter((user) => user.id !== id)
          }));
        } catch (error) {
          throw new Error('刪除使用者失敗');
        }
      },

      fetchUsers: async () => {
        try {
          const { data } = await api.get('/api/users');
          set({ users: data || [] });
        } catch (error) {
          console.error('Failed to fetch users:', error);
          set({ users: [] });
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);