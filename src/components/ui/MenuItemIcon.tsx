import React from 'react';

interface MenuItemIconProps {
  icon: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
}

export function MenuItemIcon({ icon, onClick, isActive }: MenuItemIconProps) {
  const activeClass = isActive ? 'bg-gray-100' : '';
  const hoverClass = 'hover:bg-gray-200'; // Define hoverClass once
  const baseClass = `p-2 text-gray-700 rounded-md transition-colors flex items-center justify-center`;
  const activeOutlineClass = isActive ? 'outline outline-1 outline-gray-200' : ''; // Outline for active state

  return (
    <button
      onClick={onClick}
      className={`${baseClass} ${hoverClass} ${activeClass} ${activeOutlineClass}`}
    >
      {icon}
    </button>
  );
}
