import { Calendar as CalendarIcon } from 'lucide-react';

function Calendar() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Calendar</h2>
      </div>

      <div className="rounded-lg shadow p-6">
        <div className="text-center p-12">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Calendar View Coming Soon</h3>
          <p className="mt-1 text-sm text-gray-500">
            This feature will display your sessions and tasks in a calendar format.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
