import React, { useState, useEffect } from 'react';
import { useSituationStore } from '../../store/situationStore';
import { useAuthStore } from '../../store/authStore';
import { X, Plus, GripVertical } from 'lucide-react';
import { ServiceResponse } from '../../types/situation';

interface SituationModalProps {
  isOpen: boolean;
  onClose: () => void;
  situationId?: string | null;
}

export default function SituationModal({
  isOpen,
  onClose,
  situationId
}: SituationModalProps) {
  const { user } = useAuthStore();
  const { situations, addSituation, updateSituation, addResponse } = useSituationStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'customer',
    priority: 'medium',
    responses: [] as Omit<ServiceResponse, 'id' | 'createdAt' | 'isActive'>[]
  });

  useEffect(() => {
    if (situationId) {
      const situation = situations.find(s => s.id === situationId);
      if (situation) {
        setFormData({
          title: situation.title,
          description: situation.description,
          category: situation.category,
          priority: situation.priority,
          responses: situation.responses?.map(r => ({
            situationId: r.situationId,
            content: r.content,
            order: r.order,
            createdBy: r.createdBy
          })) || []
        });
      }
    }
  }, [situationId, situations]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (situationId) {
        await updateSituation(situationId, formData);
      } else {
        const newSituation = await addSituation({
          ...formData,
          createdBy: user.id
        });

        // Add responses
        for (const response of formData.responses) {
          await addResponse({
            ...response,
            situationId: newSituation.id,
            createdBy: user.id
          });
        }
      }
      onClose();
    } catch (error) {
      console.error('Failed to save situation:', error);
    }
  };

  const addNewResponse = () => {
    setFormData(prev => ({
      ...prev,
      responses: [
        ...prev.responses,
        {
          situationId: situationId || '',
          content: '',
          order: prev.responses.length,
          createdBy: user?.id || ''
        }
      ]
    }));
  };

  const updateResponse = (index: number, content: string) => {
    setFormData(prev => ({
      ...prev,
      responses: prev.responses.map((r, i) =>
        i === index ? { ...r, content } : r
      )
    }));
  };

  const removeResponse = (index: number) => {
    setFormData(prev => ({
      ...prev,
      responses: prev.responses.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-navy/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-premium p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-navy">
            {situationId ? '編輯應對情況' : '新增應對情況'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-navy mb-1">
              情況標題
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="input-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">
              情況描述
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="input-primary h-24"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                <option value="customer">顧客服務</option>
                <option value="service">服務流程</option>
                <option value="emergency">緊急狀況</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                優先級
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className="input-primary"
                required
              >
                <option value="high">高優先</option>
                <option value="medium">中優先</option>
                <option value="low">低優先</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-navy">
                應對方法
              </label>
              <button
                type="button"
                onClick={addNewResponse}
                className="btn-secondary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                新增方法
              </button>
            </div>

            <div className="space-y-4">
              {formData.responses.map((response, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <button
                    type="button"
                    className="mt-2 text-gray-400 hover:text-gray-600"
                  >
                    <GripVertical className="w-4 h-4" />
                  </button>
                  <div className="flex-1">
                    <textarea
                      value={response.content}
                      onChange={(e) => updateResponse(index, e.target.value)}
                      className="input-primary h-24"
                      placeholder="輸入應對方法..."
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeResponse(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
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
              {situationId ? '更新' : '建立'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}