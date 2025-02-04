import React from 'react';

interface ActivityItemProps {
  title: string;
  time: string;
  duration: string;
}

export function ActivityItem({ title, time, duration }: ActivityItemProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-600">{time} • {duration}</p>
      </div>
    </div>
  );
}