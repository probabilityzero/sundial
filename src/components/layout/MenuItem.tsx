import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MenuItemProps {
  to: string;
  label: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  isCompact?: boolean;
  darkMode?: boolean;
}

export function MenuItem({ to, label, icon: Icon, onClick, isCompact, darkMode }: MenuItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex ${isCompact ? 'justify-center' : 'gap-2'} px-2 py-2 rounded-md transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-700 hover:bg-gray-100'
      } ${isCompact ? 'px-1 py-1' : 'px-4 py-2'} ${isCompact ? 'block' : 'flex'} hover:bg-gray-100 ${darkMode ? 'border border-gray-700' : ''} ${darkMode && !isActive ? 'hover:border-gray-500 rounded-md' : ''}`}
      onClick={onClick}
    >
      {Icon && <Icon className="w-6 h-6" />}
      {!isCompact && <span>{label}</span>}
    </Link>
  );
}
