import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface MenuItemListProps {
  to: string;
  label: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  isCompact?: boolean;
  darkMode?: boolean;
}

export function MenuItemList({
  to,
  label,
  icon: Icon,
  onClick,
  isCompact,
  darkMode,
}: MenuItemListProps) {
  const location = useLocation();
  const isActive = location.pathname === to;
  const activeClass = isActive ? 'bg-gray-200' : ''; // Active background class
  const baseClass = 'p-3 flex items-center font-semibold gap-3'; // Adjusted base class for layout

  return (
    <motion.div
      style={{ backgroundColor: 'white', color: 'black' }}
      whileHover={{
        color: '#3b82f6',
        backgroundColor: '#f3f4f6',
      }}
      transition={{ backgroundColor: { duration: 0.2 } }}
    >
      <Link
        to={to}
        className={`${baseClass} ${activeClass}`}
        onClick={onClick}
      >
        {Icon && <Icon className="w-6 h-6 stroke-[1]" />}
        {!isCompact && <span>{label}</span>}
      </Link>
    </motion.div>
  );
}
