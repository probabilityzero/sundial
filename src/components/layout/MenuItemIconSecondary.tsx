import React from 'react';

interface MenuItemIconSecondaryProps {
  icon: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
}

export function MenuItemIconSecondary({ icon, onClick, isActive }: MenuItemIconSecondaryProps) {
  const activeClass = isActive ? 'bg-gray-100' : '';
  const hoverClass = 'hover:bg-gray-100';
  const baseClass = `p-2 text-gray-700 rounded-md transition-colors flex items-center justify-center`;
  // No outline class for SecondaryIconButton
  const noOutlineClass = 'outline-none';

  return (
    <button
      onClick={onClick}
      className={`${baseClass} ${hoverClass} ${activeClass} ${noOutlineClass}`}
    >
      {icon}
    </button>
  );
}
