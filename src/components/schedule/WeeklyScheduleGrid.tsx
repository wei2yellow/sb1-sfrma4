import React from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { useScheduleStore } from '../../store/scheduleStore';
import { useAuthStore } from '../../store/authStore';
import { usePermissions } from '../../hooks/usePermissions';
import { CheckCircle2, AlertCircle, Plus } from 'lucide-react';

interface WeeklyScheduleGridProps {
  weekStartDate: string;
  onAssignmentClick: (date: string, timeSlotId: string) => void;
  canEdit: boolean;
}

export default function WeeklyScheduleGrid({
  weekStartDate,
  onAssignmentClick,
  canEdit
}: WeeklyScheduleGridProps) {
  const { timeSlots, getWeeklySchedule, markAssignmentComplete } = useScheduleStore();
  const { user } = useAuthStore();
  const { hasPermission } = usePermissions();
  const { users } = useAuthStore(); // 正確引入 users

  const weekStart = startOfWeek(new Date(weekStartDate));
  const weekSchedule = getWeeklySchedule(weekStartDate);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handleComplete = (weekId: string, assignmentId: string) => {
    if (!user) return;
    markAssignmentComplete(weekId, assignmentId, user.id);
  };

  const getUserName = (userId: string) => {
    const foundUser = users.find(u => u.id === userId);
    return foundUser ? foundUser.name : userId;
  };

  if (!user) return null; // 添加條件渲染

  return (
    <div className="bg-white rounded-xl shadow-premium overflow-hidden">
      <div className="grid grid-cols-8 border-b border-gray-200">
        <div className="p-4 font-medium text-navy">時間段</div>
        {days.map((day) => (
          <div
            key={day.toString()}
            className="p-4 font-medium text-navy border-l border-gray-200"
          >
            {format(day, 'MM/dd')}
            <span className="block text-sm text-gray-500">
              {format(day, 'EEEE')}
            </span>
          </div>
        ))}
      </div>

      {timeSlots.map((slot) => (
        <div key={slot.id} className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-4 bg-navy/5">
            <div className="font-medium text-navy">{slot.label}</div>
            <div className="text-sm text-gray-500">
              {slot.startTime} - {slot.endTime}
            </div>
          </div>

          {days.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const assignments = weekSchedule?.assignments.filter(
              (a) => a.date === dateStr && a.timeSlotId === slot.id
            ) || [];

            return (
              <div
                key={day.toString()}
                className="p-4 border-l border-gray-200 min-h-[120px] relative group"
              >
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className={`mb-2 p-3 rounded-lg ${
                      assignment.isCompleted
                        ? 'bg-green-50'
                        : 'bg-navy/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-navy">
                        {getUserName(assignment.employeeId)}
                      </span>
                      {!assignment.isCompleted && hasPermission('CHECK_DAILY_TASKS') && (
                        <button
                          onClick={() =>
                            handleComplete(weekSchedule!.id, assignment.id)
                          }
                          className="text-green-500 hover:text-green-600"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-1">
                      {assignment.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="text-xs px-2 py-1 bg-white rounded text-navy"
                        >
                          {task.type}
                          {task.description && (
                            <span className="block text-gray-500 text-xs mt-0.5">
                              {task.description}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    {assignment.notes && (
                      <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {assignment.notes}
                      </div>
                    )}
                  </div>
                ))}

                {canEdit && (
                  <button
                    onClick={() => onAssignmentClick(dateStr, slot.id)}
                    className="opacity-0 group-hover:opacity-100 absolute inset-0 w-full h-full flex items-center justify-center bg-navy/5 transition-opacity"
                  >
                    <span className="flex items-center gap-1 text-sm text-navy bg-white px-3 py-1.5 rounded-full shadow-sm">
                      <Plus className="w-4 h-4" />
                      新增排班
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}