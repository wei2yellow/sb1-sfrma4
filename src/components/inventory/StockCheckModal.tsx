import React, { useState } from 'react';
import { useInventoryStore } from '../../store/inventoryStore';
import { useAuthStore } from '../../store/authStore';
import { X, History } from 'lucide-react';
import { format } from 'date-fns';

interface StockCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
}

export default function StockCheckModal({
  isOpen,
  onClose,
  itemId
}: StockCheckModalProps) {
  const { user } = useAuthStore();
  const { items, checkStock, adjustStock, getItemRecords } = useInventoryStore();
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [mode, setMode] = useState<'check' | 'adjust'>('check');

  const item = items.find(i => i.id === itemId);
  const records = getItemRecords(itemId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !item) return;

    try {
      if (mode === 'check') {
        await checkStock(itemId, parseInt(quantity), notes);
      } else {
        await adjustStock(itemId, parseInt(quantity), notes);
      }
      onClose();
    } catch (error) {
      console.error('Failed to update stock:', error);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-navy/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-premium p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-navy">庫存紀錄</h2>
            <p className="text-sm text-gray-500 mt-1">{item.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between p-4 bg-navy/5 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">目前庫存</p>
              <p className="text-2xl font-semibold text-navy">
                {item.currentStock} <span className="text-sm">{item.unit}</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">安全庫存</p>
              <p className="text-2xl font-semibold text-navy">
                {item.safetyStock} <span className="text-sm">{item.unit}</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">最後盤點</p>
              <p className="text-lg font-medium text-navy">
                {item.lastCheckedAt ? format(new Date(item.lastCheckedAt), 'MM/dd HH:mm') : '尚未盤點'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setMode('check')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                mode === 'check'
                  ? 'bg-navy text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              盤點庫存
            </button>
            <button
              type="button"
              onClick={() => setMode('adjust')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                mode === 'adjust'
                  ? 'bg-navy text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              調整庫存
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">
              {mode === 'check' ? '實際數量' : '調整數量'}
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="input-primary"
              placeholder={mode === 'check' ? '輸入實際盤點數量' : '輸入要調整的數量（正數增加、負數減少）'}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">
              備註
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-primary h-24"
              placeholder="輸入備註事項..."
            />
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-medium text-navy mb-4 flex items-center gap-2">
              <History className="w-4 h-4" />
              最近記錄
            </h3>
            <div className="space-y-2">
              {records.slice(0, 5).map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm"
                >
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      record.type === 'check'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {record.type === 'check' ? '盤點' : '調整'}
                    </span>
                    <span className="ml-2">
                      {record.beforeQuantity} → {record.afterQuantity} {item.unit}
                    </span>
                  </div>
                  <span className="text-gray-500">
                    {format(new Date(record.createdAt), 'MM/dd HH:mm')}
                  </span>
                </div>
              ))}
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
              {mode === 'check' ? '確認盤點' : '確認調整'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}