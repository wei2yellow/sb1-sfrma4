import React from 'react';
import { format } from 'date-fns';
import { useTaskStore } from '../../store/taskStore';
import { useAuthStore } from '../../store/authStore';
import { Clock, CheckCircle2 } from 'lucide-react';

export default function DailyTaskList() {
  const { dailyTasks, completeTask } = useTaskStore();
  const { user } = useAuthStore();

  const handleComplete = (taskId: string) => {
    if (!user) return;
    completeTask(taskId, user.id);
  };

  // Sort tasks by scheduled time
  const sortedTasks = [...dailyTasks].sort((a, b) => 
    a.scheduledTime.localeCompare(b.scheduledTime)
  );

  return (
    <div className="space-y-4">
      {sortedTasks.map((task) => (
        <div
          key={task.id}
          className={`p-4 rounded-lg border ${
            task.status === 'completed'
              ? 'bg-green-50 border-green-100'
              : 'bg-white border-gray-100'
          } hover:shadow-sm transition-shadow`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-navy" />
                <span className="text-sm font-medium text-navy">
                  {task.scheduledTime}
                </span>
                {task.position && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-navy/5 text-navy">
                    {task.position}
                  </span>
                )}
              </div>
              <h3 className="font-medium text-navy mb-1">{task.title}</h3>
              <p className="text-sm text-gray-600">{task.description}</p>
            </div>
            {task.status !== 'completed' && (
              <button
                onClick={() => handleComplete(task.id)}
                className="ml-4 p-2 text-gray-400 hover:text-green-500 transition-colors"
              >
                <CheckCircle2 className="w-6 h-6" />
              </button>
            )}
          </div>
          {task.completedAt && (
            <div className="mt-2 text-xs text-gray-500">
              完成時間：{format(new Date(task.completedAt), 'HH:mm')}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}