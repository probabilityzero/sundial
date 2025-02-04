import React from 'react';

interface TaskItemProps {
  id: string;
  title: string;
  completed: boolean;
  onComplete: (id: string) => void;
}

export function TaskItem({ id, title, completed, onComplete }: TaskItemProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onComplete(id)}
        className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
      />
      <span className={completed ? 'line-through text-gray-500' : ''}>
        {title}
      </span>
    </div>
  );
}