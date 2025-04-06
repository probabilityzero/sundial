import React from 'react';
import { cn } from '../../lib/utils';
import { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    label: string;
    icon?: React.ReactNode;
  };
}

export function StatCard({
  icon: Icon,
  label,
  value,
  className,
  trend
}: StatCardProps) {
  return (
    <div className={cn("p-6 rounded-xl", className)}>
      <div className="flex justify-between">
        <div className="text-text-secondary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-1">
        <p className="text-sm font-medium text-text-secondary mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-text-primary">{value}</h3>
      </div>
      {trend && (
        <div className="mt-3 flex items-center">
          <span
            className={cn(
              "text-xs font-medium inline-flex items-center rounded-full px-2 py-0.5",
              trend.direction === 'up' 
                ? "text-success bg-success/10" 
                : trend.direction === 'down'
                ? "text-error bg-error/10"
                : "text-text-secondary bg-text-secondary/10"
            )}
          >
            {trend.icon && <span className="mr-1">{trend.icon}</span>}
            {trend.label}
          </span>
        </div>
      )}
    </div>
  );
}
