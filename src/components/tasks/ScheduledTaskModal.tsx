import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';
import { Task, TaskPriority } from '../../types/task';
import { X, Calendar, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';

interface ScheduledTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
}

export default function ScheduledTaskModal({ isOpen, onClose, task }: ScheduledTaskModalProps) {
  const { user, users } = useAuthStore();
  const { addTask, updateTask } = useTaskStore();
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    startDate: task?.startDate || format(new Date(), 'yyyy-MM-dd'),
    duration: task?.duration || 7,
    priority: task?.priority || 'normal' as TaskPriority,
    assignedTo: task?.assignedTo || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const taskData = {
      ...formData,
      type: 'scheduled' as const,
      category: 'service' as const,
      createdBy: user.id,
      visibleTo: ['all']
    };

    if (task) {
      updateTask(task.id, taskData);
    } else {
      addTask(taskData);
    }

    onClose();
  };

  const toggleAssignee = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(userId)
        ? prev.assignedTo.filter(id => id !== userId)
        : [...prev.assignedTo, userId]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-navy/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-premium p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-navy">
            {task ? '編輯日程' : '新增日程'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-navy mb-1">
              標題
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
              描述
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="input-primary h-24"
              placeholder="請輸入日程描述..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                開始日期
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="input-primary pl-10"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                持續天數
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="input-primary pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">
              優先級
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as TaskPriority }))}
              className="input-primary"
            >
              <option value="low">低</option>
              <option value="normal">中</option>
              <option value="urgent">高</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">
              指派人員
            </label>
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
              {users.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => toggleAssignee(u.id)}
                  className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-2 transition-colors ${
                    formData.assignedTo.includes(u.id)
                      ? 'bg-navy text-white'
                      : 'bg-white text-navy border border-navy/10 hover:border-navy/30'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  {u.name}
                </button>
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
              {task ? '更新' : '建立'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}