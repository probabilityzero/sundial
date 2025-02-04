import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MenuItemProps {
  to: string;
  label: string;
}

export function MenuItem({ to, label }: MenuItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`block px-4 py-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
    </Link>
  );
}