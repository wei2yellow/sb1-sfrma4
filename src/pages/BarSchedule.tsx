import React, { useState } from 'react';
import { format, addWeeks, subWeeks } from 'date-fns';
import { useScheduleStore } from '../store/scheduleStore';
import { usePermissions } from '../hooks/usePermissions';
import WeeklyScheduleGrid from '../components/schedule/WeeklyScheduleGrid';
import AssignmentModal from '../components/schedule/AssignmentModal';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export default function BarSchedule() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    weekId: string;
    date: string;
    timeSlotId: string;
  } | null>(null);
  
  const { hasPermission } = usePermissions();
  const { createWeeklySchedule, getWeeklySchedule } = useScheduleStore();
  const canEdit = hasPermission('SCHEDULE_TASKS');

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
      createWeeklySchedule(weekStartDate, 'current-user-id');
      weekId = getWeeklySchedule(weekStartDate)!.id;
    }

    setSelectedSlot({ weekId, date, timeSlotId });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-navy">內場時間表</h1>
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

      <WeeklyScheduleGrid
        weekStartDate={weekStartDate}
        onAssignmentClick={handleAssignmentClick}
      />

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