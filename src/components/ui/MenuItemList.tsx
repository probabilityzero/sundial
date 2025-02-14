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
  
  const activeClass = isActive
    ? 'bg-gray-100 text-blue-600'
    : 'hover:bg-gray-200 hover:text-gray-900'; // Active background and text color
  
  const baseClass =
    'flex p-2 items-center rounded-lg gap-4 transition duration-200 ease-in-out'; // Rounded corners and smooth transitions

  return (
    <motion.div className="px-3 py-1 transform transition"
    transition={{
      type: "spring",
      stiffness: 300,
      damping: 20,
    }}
    >
      <Link
        to={to}
        className={`${baseClass} ${activeClass}`}
        onClick={onClick}
      >
        {Icon && <Icon className="w-5 h-5 stroke-[2]" />}
        {!isCompact && <span className="font-medium">{label}</span>}
      </Link>
    </motion.div>
  );
}
