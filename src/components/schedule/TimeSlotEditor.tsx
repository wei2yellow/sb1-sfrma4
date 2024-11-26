import React, { useState } from 'react';
import { useScheduleStore } from '../../store/scheduleStore';
import { TimeSlot } from '../../types/schedule';
import { Plus, X, Clock } from 'lucide-react';

export default function TimeSlotEditor() {
  const { timeSlots, addTimeSlot, updateTimeSlot, deleteTimeSlot } = useScheduleStore();
  const [showForm, setShowForm] = useState(false);
  const [newSlot, setNewSlot] = useState<Omit<TimeSlot, 'id'>>({
    startTime: '',
    endTime: '',
    label: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlot.startTime || !newSlot.endTime || !newSlot.label) return;

    addTimeSlot(newSlot);
    setNewSlot({ startTime: '', endTime: '', label: '' });
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-premium p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-navy">時間段設定</h2>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          新增時間段
        </button>
      </div>

      <div className="space-y-4">
        {timeSlots.map((slot) => (
          <div
            key={slot.id}
            className="flex items-center justify-between p-4 bg-navy/5 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <Clock className="w-5 h-5 text-navy" />
              <div>
                <div className="font-medium text-navy">{slot.label}</div>
                <div className="text-sm text-gray-600">
                  {slot.startTime} - {slot.endTime}
                </div>
              </div>
            </div>
            <button
              onClick={() => deleteTimeSlot(slot.id)}
              className="text-red-500 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-navy/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-premium p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-navy">新增時間段</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  時段名稱
                </label>
                <input
                  type="text"
                  value={newSlot.label}
                  onChange={(e) =>
                    setNewSlot((prev) => ({ ...prev, label: e.target.value }))
                  }
                  className="input-primary"
                  placeholder="例：上午班"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">
                    開始時間
                  </label>
                  <input
                    type="time"
                    value={newSlot.startTime}
                    onChange={(e) =>
                      setNewSlot((prev) => ({ ...prev, startTime: e.target.value }))
                    }
                    className="input-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">
                    結束時間
                  </label>
                  <input
                    type="time"
                    value={newSlot.endTime}
                    onChange={(e) =>
                      setNewSlot((prev) => ({ ...prev, endTime: e.target.value }))
                    }
                    className="input-primary"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  取消
                </button>
                <button type="submit" className="btn-primary">
                  新增
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}