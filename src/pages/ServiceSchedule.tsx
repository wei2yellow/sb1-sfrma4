import React, { useState } from 'react';
import { format, addWeeks, subWeeks } from 'date-fns';
import { useScheduleStore } from '../store/scheduleStore';
import { useAuthStore } from '../store/authStore';
import { usePermissions } from '../hooks/usePermissions';
import WeeklyScheduleGrid from '../components/schedule/WeeklyScheduleGrid';
import TimeSlotEditor from '../components/schedule/TimeSlotEditor';
import AssignmentModal from '../components/schedule/AssignmentModal';
import DailyTaskList from '../components/tasks/DailyTaskList';
import { ChevronLeft, ChevronRight, Calendar, Settings, ListTodo, AlertCircle } from 'lucide-react';

export default function ServiceSchedule() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDailyTasks, setShowDailyTasks] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    weekId: string;
    date: string;
    timeSlotId: string;
  } | null>(null);
  
  const { user } = useAuthStore();
  const { hasPermission } = usePermissions();
  const { createWeeklySchedule, getWeeklySchedule } = useScheduleStore();
  
  const canEdit = hasPermission('SCHEDULE_TASKS');
  const canView = hasPermission('READ_ANNOUNCEMENTS');

  const weekStartDate = format(currentWeek, 'yyyy-MM-dd');
  const weekSchedule = getWeeklySchedule(weekStartDate);

  const handlePrevWeek = () => {
    setCurrentWeek((prev) => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek((prev) => addWeeks(prev, 1));
  };

  const handleAssignmentClick = (date: string, timeSlotId: string) => {
    if (!canEdit) return;
    
    let weekId = weekSchedule?.id;
    
    if (!weekId) {
      const newSchedule = createWeeklySchedule(weekStartDate, user?.id || '');
      weekId = newSchedule.id;
    }

    setSelectedSlot({ weekId, date, timeSlotId });
    setShowModal(true);
  };

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-navy/30 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-navy mb-2">無權限查看</h2>
          <p className="text-gray-600">您沒有權限查看此頁面</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-navy">外場時間表</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowDailyTasks(!showDailyTasks)}
            className="btn-secondary flex items-center gap-2"
          >
            <ListTodo className="w-4 h-4" />
            {showDailyTasks ? '查看排班表' : '每日任務'}
          </button>
          {canEdit && (
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="btn-secondary flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              時間段設定
            </button>
          )}
          <div className="flex items-center bg-white rounded-lg shadow-sm">
            <button
              onClick={handlePrevWeek}
              className="p-2 hover:bg-navy/5 rounded-l-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-navy" />
            </button>
            <div className="px-4 py-2 flex items-center gap-2 text-navy">
              <Calendar className="w-4 h-4" />
              <span>{format(currentWeek, 'yyyy/MM/dd')} 週</span>
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

      {showSettings && canEdit && <TimeSlotEditor />}

      {showDailyTasks ? (
        <div className="bg-white rounded-xl shadow-premium p-6">
          <h2 className="text-lg font-semibold text-navy mb-4">每日任務清單</h2>
          <DailyTaskList />
        </div>
      ) : (
        <WeeklyScheduleGrid
          weekStartDate={weekStartDate}
          onAssignmentClick={handleAssignmentClick}
          canEdit={canEdit}
        />
      )}

      {showModal && selectedSlot && (
        <AssignmentModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedSlot(null);
          }}
          weekId={selectedSlot.weekId}
          date={selectedSlot.date}
          timeSlotId={selectedSlot.timeSlotId}
        />
      )}
    </div>
  );
}