import React from 'react';

interface TaskItemProps {
  id: string;
  title: string;
  completed: boolean;
  onComplete: (id: string) => void;
}

export function TodaysGoals({ id, title, completed, onComplete }: TaskItemProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <span className={`text-gray-700 ${completed ? 'line-through text-gray-500' : ''} w-full`}>
        {title}
      </span>
    </div>
  );
}
