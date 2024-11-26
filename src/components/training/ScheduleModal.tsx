import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useTrainingStore } from '../../store/trainingStore';
import { TrainingModule, TrainingScheduleItem } from '../../types/training';
import { X, Users, Clock, Calendar } from 'lucide-react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: TrainingModule;
  schedule?: TrainingScheduleItem;
}

export default function ScheduleModal({
  isOpen,
  onClose,
  module,
  schedule
}: ScheduleModalProps) {
  const { users } = useAuthStore();
  const { addSchedule, updateSchedule } = useTrainingStore();
  const [formData, setFormData] = useState({
    date: schedule?.date || '',
    startTime: schedule?.startTime || '',
    endTime: schedule?.endTime || '',
    trainerId: schedule?.trainerId || '',
    trainees: schedule?.trainees || [],
    notes: schedule?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const scheduleData = {
      ...formData,
      moduleId: module.id,
      status: 'pending' as const
    };

    if (schedule) {
      updateSchedule(module.id, schedule.id, scheduleData);
    } else {
      addSchedule(module.id, scheduleData);
    }

    onClose();
  };

  const toggleTrainee = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      trainees: prev.trainees.includes(userId)
        ? prev.trainees.filter(id => id !== userId)
        : [...prev.trainees, userId]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-navy/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-premium p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-navy">
              {schedule ? '編輯教學日程' : '新增教學日程'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{module.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                日期
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="input-primary pl-10"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                講師
              </label>
              <select
                value={formData.trainerId}
                onChange={(e) => setFormData(prev => ({ ...prev, trainerId: e.target.value }))}
                className="input-primary"
                required
              >
                <option value="">選擇講師</option>
                {users
                  .filter(user => ['ADMIN', 'MANAGER', 'SERVICE_LEADER', 'BAR_LEADER'].includes(user.role))
                  .map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))
                }
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                開始時間
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  className="input-primary pl-10"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                結束時間
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  className="input-primary pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">
              參與人員
            </label>
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
              {users
                .filter(user => ['NEW_SERVICE', 'NEW_BAR'].includes(user.role))
                .map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => toggleTrainee(user.id)}
                    className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-2 transition-colors ${
                      formData.trainees.includes(user.id)
                        ? 'bg-navy text-white'
                        : 'bg-white text-navy border border-navy/10 hover:border-navy/30'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    {user.name}
                  </button>
                ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">
              備註
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="input-primary h-24"
              placeholder="輸入備註事項..."
            />
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
              {schedule ? '更新' : '建立'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}