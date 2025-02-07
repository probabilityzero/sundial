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
  const activeClass = isActive ? 'bg-gray-100' : '';
  const hoverClass = isActive ? '' : 'hover:bg-gray-100';
  const textColorClass = isActive ? 'text-blue-600' : 'text-gray-700';


  return (
    <Link
      to={to}
      className={`flex ${isCompact ? 'justify-center' : 'gap-2'} p-2 rounded-md transition-colors ${activeClass} ${textColorClass} ${hoverClass} ${isCompact ? 'p-1' : 'px-4 py-2'} ${isCompact ? 'block' : 'flex'}  ${darkMode ? 'border border-gray-700' : ''} ${darkMode && !isActive ? 'hover:border-gray-500 rounded-md' : ''}`}
      onClick={onClick}
    >
      {Icon && <Icon className="w-6 h-6" />}
      {!isCompact && <span>{label}</span>}
    </Link>
  );
}
