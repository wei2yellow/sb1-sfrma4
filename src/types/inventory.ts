export type StockRecordType = 'check' | 'adjust' | 'in' | 'out';

export interface Supplier {
  id: string;
  name: string;
  code: string;
  contact?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
}

export interface InventoryItem {
  id: string;
  supplierId: string;
  name: string;
  code: string;
  unit: string;
  category: string;
  safetyStock: number;
  currentStock: number;
  lastCheckedAt?: string;
  lastCheckedBy?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
}

export interface StockRecord {
  id: string;
  itemId: string;
  type: StockRecordType;
  quantity: number;
  beforeQuantity: number;
  afterQuantity: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
}