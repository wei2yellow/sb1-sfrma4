import React from 'react';
import { Task } from '../../types/task';
import { format } from 'date-fns';
import { useTaskStore } from '../../store/taskStore';
import { useAuthStore } from '../../store/authStore';
import { Clock, AlertCircle, CheckCircle2, Edit2 } from 'lucide-react';

interface ScheduledTaskCardProps {
  task: Task;
  onComplete?: (taskId: string) => void;
  onEdit?: () => void;
}

export default function ScheduledTaskCard({ task, onComplete, onEdit }: ScheduledTaskCardProps) {
  const { users } = useAuthStore();
  const { getRemainingDays, getTaskProgress, updateTaskProgress } = useTaskStore();
  const remainingDays = getRemainingDays(task);
  const progress = getTaskProgress(task);

  const getStatusColor = (days: number) => {
    if (days <= 1) return 'text-red-500';
    if (days <= 3) return 'text-amber-500';
    return 'text-green-500';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-amber-500';
    return 'bg-navy';
  };

  const handleProgressUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseInt(e.target.value, 10);
    updateTaskProgress(task.id, newProgress);
  };

  return (
    <div className="bg-white rounded-lg shadow-premium p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-navy">{task.title}</h3>
            <div className="flex items-center gap-2">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="text-gray-400 hover:text-navy transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              {task.status !== 'completed' && onComplete && (
                <button
                  onClick={() => onComplete(task.id)}
                  className="text-gray-400 hover:text-green-500 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
        </div>
      </div>

      <div className="space-y-3 mt-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span className={getStatusColor(remainingDays)}>
              剩餘 {remainingDays} 天
            </span>
          </div>
          <span className="text-gray-500">
            截止日期：{format(new Date(task.dueDate), 'yyyy/MM/dd')}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">進度</span>
            <span className="text-navy font-medium">{progress}%</span>
          </div>
          <div className="relative pt-1">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleProgressUpdate}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${
                  getProgressColor(progress)
                } ${progress}%, #e5e7eb ${progress}%)`
              }}
            />
          </div>
        </div>

        {task.assignedTo && task.assignedTo.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>負責人：</span>
            <div className="flex flex-wrap gap-1">
              {task.assignedTo.map((userId) => (
                <span
                  key={userId}
                  className="px-2 py-0.5 bg-navy/5 rounded-full text-navy text-xs"
                >
                  {users.find(u => u.id === userId)?.name || userId}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}