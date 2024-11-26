import React from 'react';
import { Task } from '../types/task';
import { useAuthStore } from '../store/authStore';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface TaskSectionProps {
  title: string;
  tasks: Task[];
  onComplete: (taskId: string) => void;
}

export default function TaskSection({ title, tasks, onComplete }: TaskSectionProps) {
  const user = useAuthStore((state) => state.user);

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (daysRemaining: number) => {
    if (daysRemaining <= 1) return 'text-red-500';
    if (daysRemaining <= 3) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-premium p-6 mb-6">
      <h3 className="text-lg font-semibold text-navy mb-4">{title}</h3>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-navy">{task.title}</h4>
                {task.priority === 'urgent' && (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
              {task.dueDate && (
                <div className="flex items-center mt-2 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className={getStatusColor(getDaysRemaining(task.dueDate))}>
                    剩餘 {getDaysRemaining(task.dueDate)} 天
                  </span>
                </div>
              )}
            </div>
            {task.status !== 'completed' && (
              <button
                onClick={() => onComplete(task.id)}
                className="ml-4 p-2 text-gray-400 hover:text-green-500 transition-colors"
              >
                <CheckCircle2 className="w-6 h-6" />
              </button>
            )}
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="text-center text-gray-500 py-4">目前沒有任務</p>
        )}
      </div>
    </div>
  );
}