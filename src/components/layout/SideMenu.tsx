import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { MenuItem } from './MenuItem';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SideMenu({ isOpen, onClose }: SideMenuProps) {
  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="space-y-4">
          <MenuItem to="/profile" label="Profile" />
          <MenuItem to="/calendar" label="Calendar" />
          <MenuItem to="/analytics" label="Analytics" />
          <MenuItem to="/tasks" label="Tasks" />
          <MenuItem to="/settings" label="Settings" />
          
          <div className="pt-4 border-t">
            <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg">
              Toggle Theme
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}