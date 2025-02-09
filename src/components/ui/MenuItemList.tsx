import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MenuItemListProps {
  to: string;
  label: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  isCompact?: boolean;
  darkMode?: boolean;
}

export function MenuItemList({ to, label, icon: Icon, onClick, isCompact, darkMode }: MenuItemListProps) {
  const location = useLocation();
  const isActive = location.pathname === to;
  const activeClass = isActive ? 'bg-gray-100' : '';
  const hoverClass = isActive ? '' : 'hover:bg-gray-100';
  const textColorClass = isActive ? 'text-blue-600' : 'text-gray-700';
  const baseClass = `p-2 px-3 rounded-md justify-left flex-grow flex transition-colors gap-2`;
  

  return (
    <Link
      to={to}
      className={`${baseClass} ${activeClass} ${textColorClass} ${hoverClass} ${!isActive ? 'hover:border-gray-500 rounded-md' : ''}`}
      onClick={onClick}
    >
      {Icon && <Icon className="w-6 h-6" />}
      {!isCompact && <span>{label}</span>}
    </Link>
  );
}
