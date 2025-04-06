import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { cn } from '../../lib/utils';

interface CalendarProps {
  mode?: 'single' | 'multiple' | 'range';
  selected?: Date | Date[] | { from: Date; to: Date };
  onSelect?: (date: Date | Date[] | { from: Date; to: Date }) => void;
  className?: string;
  classNames?: {
    root?: string;
    month?: string;
    day?: string;
    day_disabled?: string;
    day_range_start?: string;
    day_range_middle?: string;
    day_range_end?: string;
    day_selected?: string;
    day_today?: string;
    day_outside?: string;
    day_hidden?: string;
    day_weekend?: string;
  };
}

export function Calendar({
  mode = 'single',
  selected,
  onSelect,
  className,
  classNames = {},
  ...props
}: CalendarProps) {
  const [month, setMonth] = useState(new Date());
  
  // Helper to get days in the current month view
  const days = React.useMemo(() => {
    const firstDay = startOfMonth(month);
    const lastDay = endOfMonth(month);
    
    return eachDayOfInterval({ start: firstDay, end: lastDay });
  }, [month]);
  
  // Move to previous month
  const handlePreviousMonth = () => {
    setMonth(prev => subMonths(prev, 1));
  };
  
  // Move to next month
  const handleNextMonth = () => {
    setMonth(prev => addMonths(prev, 1));
  };
  
  // Helper to check if a date is selected
  const isDateSelected = (date: Date) => {
    if (!selected) return false;
    
    if (mode === 'single') {
      return isSameDay(date, selected as Date);
    }
    
    if (mode === 'multiple') {
      return (selected as Date[]).some(d => isSameDay(d, date));
    }
    
    if (mode === 'range') {
      const range = selected as { from: Date; to: Date };
      return isSameDay(date, range.from) || isSameDay(date, range.to);
    }
    
    return false;
  };
  
  // Handle selecting a date
  const handleSelectDate = (date: Date) => {
    if (!onSelect) return;
    
    if (mode === 'single') {
      onSelect(date);
    } else if (mode === 'multiple') {
      const current = selected as Date[] || [];
      const exists = current.some(d => isSameDay(d, date));
      
      if (exists) {
        onSelect(current.filter(d => !isSameDay(d, date)));
      } else {
        onSelect([...current, date]);
      }
    } else if (mode === 'range') {
      const range = selected as { from?: Date; to?: Date } || {};
      
      if (!range.from) {
        onSelect({ from: date, to: undefined });
      } else if (range.from && !range.to) {
        if (date < range.from) {
          onSelect({ from: date, to: range.from });
        } else {
          onSelect({ from: range.from, to: date });
        }
      } else {
        onSelect({ from: date, to: undefined });
      }
    }
  };
  
  return (
    <div className={cn("", className)} {...props}>
      {/* Calendar header with month name and navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePreviousMonth}
          className="p-2 rounded-md hover:bg-surface text-text-secondary hover:text-text-primary transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <h2 className="font-semibold text-lg text-text-primary">
          {format(month, 'MMMM yyyy')}
        </h2>
        
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-md hover:bg-surface text-text-secondary hover:text-text-primary transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      
      {/* Day names */}
      <div className="grid grid-cols-7 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-text-tertiary text-xs font-medium">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before the start of the month */}
        {Array(days[0].getDay())
          .fill(null)
          .map((_, i) => (
            <div key={`empty-start-${i}`} className="h-10" />
          ))}
        
        {/* Actual days in the month */}
        {days.map((day) => {
          const isSelected = isDateSelected(day);
          const dayClasses = cn(
            "flex items-center justify-center h-10 w-10 rounded-full mx-auto cursor-pointer text-sm",
            !isSameMonth(day, month) && "text-text-tertiary",
            isToday(day) && classNames.day_today || "bg-primary/10",
            isSelected && classNames.day_selected || "bg-primary text-primary-contrast hover:bg-primary/90",
            !isSelected && !isToday(day) && "hover:bg-surface text-text-primary",
            classNames.day
          );
          
          return (
            <button
              key={day.toString()}
              className={dayClasses}
              onClick={() => handleSelectDate(day)}
            >
              {format(day, 'd')}
            </button>
          );
        })}
        
        {/* Empty cells for days after the end of the month */}
        {Array(6 - days[days.length - 1].getDay())
          .fill(null)
          .map((_, i) => (
            <div key={`empty-end-${i}`} className="h-10" />
          ))}
      </div>
    </div>
  );
}