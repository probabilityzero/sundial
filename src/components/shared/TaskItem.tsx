import React from 'react';

interface TaskItemProps {
  id: string;
  title: string;
  completed: boolean;
  onComplete: (id: string) => void;
}

export function TaskItem({ id, title, completed, onComplete }: TaskItemProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <span className={`text-gray-700 ${completed ? 'line-through text-gray-500' : ''} w-full`}>
        {title}
      </span>
      {completed && (
        <span className="bg-green-200 text-green-700 rounded-full px-2 py-1 text-sm font-medium">
          Completed
        </span>
      )}
    </div>
  );
}
