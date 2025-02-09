import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface CalendarProps {}

const ControlPanelCalender: React.FC<CalendarProps> = () => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Calendar</h3>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={`text-center py-1 rounded-md ${
              format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd') ? 'bg-blue-200' : 'hover:bg-gray-100'
            }`}
          >
            {format(day, 'd')}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ControlPanelCalender;
