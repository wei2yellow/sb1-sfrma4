import React, { useState } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { useAuthStore } from '../../store/authStore';
import ScheduledTaskCard from './ScheduledTaskCard';
import ScheduledTaskModal from './ScheduledTaskModal';
import { Plus } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';

export default function ScheduledTaskList() {
  const { user } = useAuthStore();
  const { hasPermission } = usePermissions();
  const { getScheduledTasks, completeTask } = useTaskStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  
  const tasks = getScheduledTasks();
  const canCreate = hasPermission('CREATE_IMPORTANT_TASKS');

  const handleComplete = (taskId: string) => {
    if (!user) return;
    completeTask(taskId, user.id);
  };

  const handleEdit = (taskId: string) => {
    setSelectedTask(taskId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-navy">日程工作</h2>
        {canCreate && (
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            新增日程
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <ScheduledTaskCard
            key={task.id}
            task={task}
            onComplete={handleComplete}
            onEdit={canCreate ? () => handleEdit(task.id) : undefined}
          />
        ))}
      </div>

      {showModal && (
        <ScheduledTaskModal
          isOpen={showModal}
          onClose={handleCloseModal}
          task={selectedTask ? tasks.find(t => t.id === selectedTask) : undefined}
        />
      )}
    </div>
  );
}