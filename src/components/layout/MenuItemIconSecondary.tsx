import React from 'react';

interface MenuItemIconSecondaryProps {
  icon: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
  className?: string; // Add className as an optional prop
}

export function MenuItemIconSecondary({
  icon,
  onClick,
  isActive,
  className = '', // Default to an empty string if className isn't provided
}: MenuItemIconSecondaryProps) {
  const activeClass = isActive ? 'bg-gray-100' : '';
  const hoverClass = 'hover:bg-gray-100';
  const baseClass = `p-2 text-gray-700 rounded-md transition-colors flex items-center justify-center`;
  const noOutlineClass = 'outline-none';

  return (
    <button
      onClick={onClick}
      className={`${baseClass} ${hoverClass} ${activeClass} ${noOutlineClass} ${className}`} // Include className in the final class string
    >
      {icon}
    </button>
  );
}
