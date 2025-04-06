import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface MenuItemListProps {
  to: string;
  label: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  isCompact?: boolean;
}

export function MenuItemList({
  to,
  label,
  icon: Icon,
  onClick,
  isCompact,
}: MenuItemListProps) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <motion.div 
      className="px-2 py-1"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
    >
      <Link
        to={to}
        className={`
          flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
          ${isActive 
            ? 'bg-primary bg-opacity-10 text-primary' 
            : 'text-text-secondary hover:bg-background hover:text-text-primary'}
        `}
        onClick={onClick}
      >
        {Icon && <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />}
        {!isCompact && <span className="font-medium">{label}</span>}
      </Link>
    </motion.div>
  );
}
