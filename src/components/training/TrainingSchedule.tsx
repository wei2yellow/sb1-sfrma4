import React, { useState } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { TrainingModule } from '../../types/training';
import { useAuthStore } from '../../store/authStore';
import { usePermissions } from '../../hooks/usePermissions';
import { ChevronLeft, ChevronRight, Calendar, Clock, CheckCircle2, Plus, Users } from 'lucide-react';
import ScheduleModal from './ScheduleModal';

interface TrainingScheduleProps {
  modules: TrainingModule[];
}

export default function TrainingSchedule({ modules }: TrainingScheduleProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  
  const { users } = useAuthStore();
  const { hasPermission } = usePermissions();
  const canManage = hasPermission('MANAGE_CONTENT');

  const weekStart = startOfWeek(currentWeek);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const scheduleMap = new Map<string, Array<{ module: TrainingModule; schedule: any }>>();
  modules.forEach((module) => {
    module.schedules?.forEach((schedule) => {
      const existing = scheduleMap.get(schedule.date) || [];
      scheduleMap.set(schedule.date, [...existing, { module, schedule }]);
    });
  });

  const handlePrevWeek = () => {
    setCurrentWeek(prev => addDays(prev, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prev => addDays(prev, 7));
  };

  const handleAddSchedule = (module: TrainingModule) => {
    setSelectedModule(module);
    setSelectedSchedule(null);
    setShowModal(true);
  };

  const handleEditSchedule = (module: TrainingModule, scheduleId: string) => {
    setSelectedModule(module);
    setSelectedSchedule(scheduleId);
    setShowModal(true);
  };

  const getUserName = (userId: string) => {
    return users.find(u => u.id === userId)?.name || userId;
  };

  return (
    <div className="bg-white rounded-xl shadow-premium overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-navy">教學日程表</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white rounded-lg shadow-sm">
              <button
                onClick={handlePrevWeek}
                className="p-2 hover:bg-navy/5 rounded-l-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-navy" />
              </button>
              <div className="px-4 py-2 flex items-center gap-2 text-navy">
                <Calendar className="w-4 h-4" />
                <span>{format(weekStart, 'yyyy/MM/dd')} 週</span>
              </div>
              <button
                onClick={handleNextWeek}
                className="p-2 hover:bg-navy/5 rounded-r-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-navy" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-gray-200">
        {days.map((day) => (
          <div
            key={day.toString()}
            className="p-4 text-center border-r border-gray-200 last:border-r-0"
          >
            <div className="font-medium text-navy">{format(day, 'MM/dd')}</div>
            <div className="text-sm text-gray-500">{format(day, 'EEEE')}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const daySchedules = scheduleMap.get(dateKey) || [];

          return (
            <div
              key={day.toString()}
              className="min-h-[200px] p-4 border-r border-b border-gray-200 last:border-r-0 relative group"
            >
              {daySchedules.map(({ module, schedule }) => (
                <div
                  key={schedule.id}
                  className="mb-3 p-3 bg-navy/5 rounded-lg hover:bg-navy/10 transition-colors cursor-pointer"
                  onClick={() => canManage && handleEditSchedule(module, schedule.id)}
                >
                  <h4 className="font-medium text-navy text-sm mb-1">
                    {module.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{schedule.startTime} - {schedule.endTime}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <Users className="w-3 h-3" />
                    <span>講師：{getUserName(schedule.trainerId)}</span>
                  </div>
                  {schedule.status === 'completed' && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>已完成</span>
                    </div>
                  )}
                </div>
              ))}

              {canManage && modules.length > 0 && (
                <div className="absolute inset-0 bg-navy/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white rounded-lg shadow-sm p-2">
                    {modules.map((module) => (
                      <button
                        key={module.id}
                        onClick={() => handleAddSchedule(module)}
                        className="w-full text-left px-3 py-2 text-sm text-navy hover:bg-navy/5 rounded-md transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        {module.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showModal && selectedModule && (
        <ScheduleModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedModule(null);
            setSelectedSchedule(null);
          }}
          module={selectedModule}
          schedule={selectedSchedule ? selectedModule.schedules?.find(s => s.id === selectedSchedule) : undefined}
        />
      )}
    </div>
  );
}