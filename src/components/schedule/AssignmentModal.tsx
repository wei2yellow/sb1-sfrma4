import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useScheduleStore } from '../../store/scheduleStore';
import { ScheduleTask } from '../../types/schedule';
import { X, Plus, AlertCircle, Save, Users, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekId: string;
  date: string;
  timeSlotId: string;
}

export default function AssignmentModal({
  isOpen,
  onClose,
  weekId,
  date,
  timeSlotId
}: AssignmentModalProps) {
  const { user, users } = useAuthStore();
  const { addAssignment, timeSlots } = useScheduleStore();
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<ScheduleTask[]>([]);
  const [taskDescription, setTaskDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const taskTypes = ['迎賓', '點餐', '清潔', '備餐', '其他'] as const;

  // 重置表單
  useEffect(() => {
    if (isOpen) {
      setSelectedEmployee('');
      setSelectedTasks([]);
      setTaskDescription('');
      setNotes('');
      setError('');
    }
  }, [isOpen]);

  // 獲取當前時段資訊
  const timeSlot = timeSlots.find(slot => slot.id === timeSlotId);

  const handleAddTask = (type: ScheduleTask['type']) => {
    if (!taskDescription.trim()) {
      setError('請輸入工作描述');
      return;
    }

    const newTask: Omit<ScheduleTask, 'id'> = {
      type,
      description: taskDescription
    };

    setSelectedTasks([...selectedTasks, { ...newTask, id: Math.random().toString(36).substr(2, 9) }]);
    setTaskDescription('');
    setError('');
    toast.success('已新增工作項目');
  };

  const handleRemoveTask = (taskId: string) => {
    setSelectedTasks(selectedTasks.filter(task => task.id !== taskId));
    toast.success('已移除工作項目');
  };

  const validateForm = () => {
    if (!selectedEmployee) {
      setError('請選擇員工');
      return false;
    }

    if (selectedTasks.length === 0) {
      setError('請至少新增一項工作');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSaving(true);
      await addAssignment(weekId, {
        id: Math.random().toString(36).substr(2, 9),
        date,
        timeSlotId,
        employeeId: selectedEmployee,
        tasks: selectedTasks,
        isCompleted: false,
        notes
      });

      toast.success('排班已儲存');
      onClose();
    } catch (err) {
      setError('儲存失敗，請稍後再試');
      toast.error('儲存失敗');
    } finally {
      setSaving(false);
    }
  };

  const eligibleUsers = users.filter(user => 
    ['SERVICE', 'NEW_SERVICE', 'SERVICE_LEADER'].includes(user.role)
  );

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-navy/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-premium p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-navy">新增排班</h2>
            {timeSlot && (
              <p className="text-sm text-gray-500 mt-1">
                <Clock className="w-4 h-4 inline-block mr-1" />
                {timeSlot.label} ({timeSlot.startTime} - {timeSlot.endTime})
              </p>
            )}
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-navy mb-1">
              選擇員工
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="input-primary pl-10"
                required
              >
                <option value="">請選擇員工</option>
                {eligibleUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role === 'SERVICE_LEADER' ? '外場幹部' : 
                              user.role === 'SERVICE' ? '外場人員' : '外場新人'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">
              工作內容
            </label>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="輸入工作描述..."
                  className="input-primary flex-1"
                />
                <div className="flex gap-1">
                  {taskTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleAddTask(type)}
                      className="px-3 py-1 text-sm bg-navy/5 hover:bg-navy/10 text-navy rounded-full transition-colors"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                {selectedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <span className="text-sm font-medium text-navy">{task.type}</span>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-0.5">{task.description}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
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

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={saving}
            >
              取消
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center gap-2"
              disabled={saving}
            >
              <Save className="w-4 h-4" />
              {saving ? '儲存中...' : '儲存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}