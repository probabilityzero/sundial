import React from 'react';
import { Menu as MenuIcon } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">Study Tracker</h1>
        <div className="w-6" />
      </div>
    </header>
  );
}