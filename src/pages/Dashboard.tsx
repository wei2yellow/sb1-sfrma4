import React from 'react';
import { useTaskStore } from '../store/taskStore';
import { useAuthStore } from '../store/authStore';
import { usePermissions } from '../hooks/usePermissions';
import TaskSection from '../components/TaskSection';
import ScheduledTaskList from '../components/tasks/ScheduledTaskList';
import UserActivityStats from '../components/admin/UserActivityStats';
import { Clock, Users, Activity } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { hasPermission } = usePermissions();
  const { getTasks, completeTask } = useTaskStore();

  const handleCompleteTask = (taskId: string) => {
    if (!user) return;
    completeTask(taskId, user.id);
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="space-y-6">
      {/* Admin Overview Section */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-premium p-6">
            <div className="flex items-center">
              <div className="p-3 bg-navy/5 rounded-full">
                <Users className="w-6 h-6 text-navy" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">活躍使用者</p>
                <h3 className="text-lg font-semibold text-navy">12 人</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-premium p-6">
            <div className="flex items-center">
              <div className="p-3 bg-navy/5 rounded-full">
                <Clock className="w-6 h-6 text-navy" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">平均使用時長</p>
                <h3 className="text-lg font-semibold text-navy">2.5 小時</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-premium p-6">
            <div className="flex items-center">
              <div className="p-3 bg-navy/5 rounded-full">
                <Activity className="w-6 h-6 text-navy" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">任務完成率</p>
                <h3 className="text-lg font-semibold text-navy">85%</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Sections */}
      <TaskSection
        title="今日緊急事項"
        tasks={getTasks({ type: 'urgent', priority: 'urgent' })}
        onComplete={handleCompleteTask}
      />
      
      {hasPermission('CREATE_IMPORTANT_TASKS') && (
        <TaskSection
          title="總部未完成任務總覽"
          tasks={getTasks({ type: 'headquarters', status: 'pending' })}
          onComplete={handleCompleteTask}
        />
      )}

      <TaskSection
        title="今日特殊情況/特殊任務"
        tasks={getTasks({ type: 'special' })}
        onComplete={handleCompleteTask}
      />

      <ScheduledTaskList />

      {/* Admin Activity Section */}
      {isAdmin && <UserActivityStats />}
    </div>
  );
}