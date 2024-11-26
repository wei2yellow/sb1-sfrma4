import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';
import { Supplier, InventoryItem, StockRecord } from '../types/inventory';

interface InventoryState {
  suppliers: Supplier[];
  items: InventoryItem[];
  records: StockRecord[];
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'isActive'>) => Promise<void>;
  updateSupplier: (id: string, updates: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  addItem: (item: Omit<InventoryItem, 'id' | 'createdAt' | 'currentStock' | 'isActive'>) => Promise<void>;
  updateItem: (id: string, updates: Partial<InventoryItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  checkStock: (itemId: string, quantity: number, notes?: string) => Promise<void>;
  adjustStock: (itemId: string, quantity: number, notes?: string) => Promise<void>;
  getSupplierItems: (supplierId: string) => InventoryItem[];
  getLowStockItems: () => InventoryItem[];
  getItemRecords: (itemId: string) => StockRecord[];
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      suppliers: [],
      items: [],
      records: [],

      addSupplier: async (supplier) => {
        const { data } = await api.post('/api/inventory/suppliers', supplier);
        set((state) => ({
          suppliers: [...state.suppliers, data]
        }));
      },

      updateSupplier: async (id, updates) => {
        const { data } = await api.patch(`/api/inventory/suppliers/${id}`, updates);
        set((state) => ({
          suppliers: state.suppliers.map((s) => s.id === id ? { ...s, ...data } : s)
        }));
      },

      deleteSupplier: async (id) => {
        await api.delete(`/api/inventory/suppliers/${id}`);
        set((state) => ({
          suppliers: state.suppliers.filter((s) => s.id !== id)
        }));
      },

      addItem: async (item) => {
        const { data } = await api.post('/api/inventory/items', item);
        set((state) => ({
          items: [...state.items, data]
        }));
      },

      updateItem: async (id, updates) => {
        const { data } = await api.patch(`/api/inventory/items/${id}`, updates);
        set((state) => ({
          items: state.items.map((i) => i.id === id ? { ...i, ...data } : i)
        }));
      },

      deleteItem: async (id) => {
        await api.delete(`/api/inventory/items/${id}`);
        set((state) => ({
          items: state.items.filter((i) => i.id !== id)
        }));
      },

      checkStock: async (itemId, quantity, notes) => {
        const { data } = await api.post(`/api/inventory/items/${itemId}/check`, {
          quantity,
          notes
        });
        set((state) => ({
          items: state.items.map((i) => i.id === itemId ? { ...i, ...data.item } : i),
          records: [...state.records, data.record]
        }));
      },

      adjustStock: async (itemId, quantity, notes) => {
        const { data } = await api.post(`/api/inventory/items/${itemId}/adjust`, {
          quantity,
          notes
        });
        set((state) => ({
          items: state.items.map((i) => i.id === itemId ? { ...i, ...data.item } : i),
          records: [...state.records, data.record]
        }));
      },

      getSupplierItems: (supplierId) => {
        return get().items.filter((item) => item.supplierId === supplierId && item.isActive);
      },

      getLowStockItems: () => {
        return get().items.filter((item) => 
          item.isActive && item.currentStock <= item.safetyStock
        );
      },

      getItemRecords: (itemId) => {
        return get().records.filter((record) => record.itemId === itemId);
      },
    }),
    {
      name: 'inventory-storage',
      partialize: (state) => ({
        suppliers: state.suppliers,
        items: state.items,
        records: state.records
      })
    }
  )
);