import React, { useState, useEffect } from 'react';
import { useInventoryStore } from '../../store/inventoryStore';
import { useAuthStore } from '../../store/authStore';
import { X, Package } from 'lucide-react';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplierId: string;
  itemId?: string | null;
}

export default function ItemModal({
  isOpen,
  onClose,
  supplierId,
  itemId
}: ItemModalProps) {
  const { user } = useAuthStore();
  const { items, addItem, updateItem } = useInventoryStore();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    unit: '',
    category: 'drink',
    safetyStock: 0,
    notes: ''
  });

  useEffect(() => {
    if (itemId) {
      const item = items.find(i => i.id === itemId);
      if (item) {
        setFormData({
          name: item.name,
          code: item.code,
          unit: item.unit,
          category: item.category,
          safetyStock: item.safetyStock,
          notes: ''
        });
      }
    }
  }, [itemId, items]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (itemId) {
        await updateItem(itemId, formData);
      } else {
        await addItem({
          ...formData,
          supplierId,
          createdBy: user.id
        });
      }
      onClose();
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-navy/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-premium p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-navy">
            {itemId ? '編輯品項' : '新增品項'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                品項名稱
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-primary pl-10"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                品項代碼
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                className="input-primary"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                單位
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                className="input-primary"
                placeholder="例：箱、包、瓶"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                類別
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="input-primary"
                required
              >
                <option value="drink">飲品</option>
                <option value="food">食材</option>
                <option value="package">包材</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                安全庫存量
              </label>
              <input
                type="number"
                min="0"
                value={formData.safetyStock}
                onChange={(e) => setFormData(prev => ({ ...prev, safetyStock: parseInt(e.target.value) }))}
                className="input-primary"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              取消
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {itemId ? '更新' : '建立'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}