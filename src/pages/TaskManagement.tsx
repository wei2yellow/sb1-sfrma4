import React, { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';
import {
  PlusCircle,
  Calendar,
  Clock,
  Filter,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function TaskManagement() {
  const { user } = useAuthStore();
  const { getTasks, addTask, completeTask } = useTaskStore();
  const [showModal, setShowModal] = useState(false);
  const [taskType, setTaskType] = useState<'daily' | 'extra'>('daily');
  const [filter, setFilter] = useState({
    type: 'daily',
    category: 'all',
    status: 'all'
  });

  const tasks = getTasks({
    type: filter.type === 'all' ? undefined : filter.type as 'daily' | 'extra',
    category: filter.category === 'all' ? undefined : filter.category as 'service' | 'bar'
  });

  const handleAddTask = () => {
    setShowModal(true);
  };

  const handleCompleteTask = (taskId: string) => {
    if (user) {
      completeTask(taskId, user.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-navy">
          {taskType === 'daily' ? '每日事項管理' : '額外事項管理'}
        </h1>
        <div className="flex gap-4">
          <select
            value={taskType}
            onChange={(e) => setTaskType(e.target.value as 'daily' | 'extra')}
            className="input-primary"
          >
            <option value="daily">每日事項</option>
            <option value="extra">額外事項</option>
          </select>
          <button
            onClick={handleAddTask}
            className="btn-primary flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            新增事項
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-premium p-6">
        <div className="flex gap-4 mb-6">
          <select
            value={filter.category}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, category: e.target.value }))
            }
            className="input-primary w-48"
          >
            <option value="all">所有類別</option>
            <option value="service">外場</option>
            <option value="bar">吧檯</option>
          </select>
          <select
            value={filter.status}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, status: e.target.value }))
            }
            className="input-primary w-48"
          >
            <option value="all">所有狀態</option>
            <option value="pending">未完成</option>
            <option value="in_progress">進行中</option>
            <option value="completed">已完成</option>
          </select>
          <button className="btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" />
            進階篩選
          </button>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div
                className={`p-2 rounded-full ${
                  task.type === 'daily'
                    ? 'bg-navy/5 text-navy'
                    : 'bg-gold/5 text-gold'
                }`}
              >
                {task.type === 'daily' ? (
                  <Calendar className="w-5 h-5" />
                ) : (
                  <Clock className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-navy">{task.title}</h3>
                  <div className="flex items-center gap-2">
                    {task.priority === 'urgent' && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-red-50 text-red-600">
                        緊急
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {format(new Date(task.dueDate), 'yyyy/MM/dd HH:mm')}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-navy/5 text-navy">
                    {task.category === 'service' ? '外場' : '吧檯'}
                  </span>
                  {task.extraCompensation && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gold/5 text-gold">
                      額外津貼
                    </span>
                  )}
                </div>
              </div>
              {task.status !== 'completed' && (
                <button
                  onClick={() => handleCompleteTask(task.id)}
                  className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                >
                  <CheckCircle2 className="w-6 h-6" />
                </button>
              )}
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-navy/5 mb-4">
                <AlertCircle className="w-8 h-8 text-navy" />
              </div>
              <h3 className="text-lg font-medium text-navy mb-2">
                目前沒有{taskType === 'daily' ? '每日' : '額外'}事項
              </h3>
              <p className="text-gray-500">
                點擊上方「新增事項」按鈕來建立新的事項
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}