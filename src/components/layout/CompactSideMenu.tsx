import React from 'react';
import { Moon, LayoutList, User, Calendar, BarChart, ListChecks, Settings as SettingIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface CompactSideMenuProps {
  isCompact: boolean;
  toggleCompact: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function CompactSideMenu({ isCompact, toggleCompact, darkMode, toggleDarkMode }: CompactSideMenuProps) {
  const location = useLocation();

  const menuItemStyle = {
    border: '1px solid #e5e7eb', // Tailwind gray-200 border
    borderRadius: '0.375rem', // Tailwind rounded-md radius
    margin: '0.25rem 0', // Tailwind my-1 spacing, adjust as needed
    display: 'flex',
    justifyContent: 'center',
    padding: '0.5rem', // Tailwind p-2 padding
    hoverBackgroundColor: '#f9fafb', // Tailwind gray-50 hover bg
  };

  return (
    <div className={`fixed inset-y-0 left-0 transform ${isCompact ? 'translate-x-0' : '-translate-x-full'} bg-white shadow-lg transition-transform duration-300 ease-in-out z-50 flex flex-col w-14`}>
      <div className="flex-grow flex flex-col p-1">

        <Link to="/profile" className="block mb-1 mx-auto " >
          <div className={`w-10 h-10 rounded-full bg-gray-200 mx-auto overflow-hidden flex items-center justify-center ${darkMode ? 'border border-gray-700' : ''}`}>
            <User className={`w-5 h-5 text-gray-400`} />
          </div>
        </Link>

        <nav className="flex-grow space-y-0.5">
          <Link to="/calendar" style={menuItemStyle} className={`flex justify-center rounded-md transition-colors hover:bg-gray-50 block`}>
            <Calendar className="w-5 h-5" />
          </Link>
          <Link to="/analytics" style={menuItemStyle} className={`flex justify-center rounded-md transition-colors hover:bg-gray-50 block`}>
            <BarChart className="w-5 h-5" />
          </Link>
          <Link to="/tasks" style={menuItemStyle} className={`flex justify-center rounded-md transition-colors hover:bg-gray-50 block`}>
            <ListChecks className="w-5 h-5" />
          </Link>
          <hr className="border-gray-200 my-1" />
          <Link to="/settings" style={menuItemStyle} className={`flex justify-center rounded-md transition-colors hover:bg-gray-50 block`}>
            <SettingIcon className="w-5 h-5" />
          </Link>
        </nav>
      </div>
      <div className=" p-2 flex flex-col border-t p-1">
        <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg mb-1 justify-center flex items-center space-x-2" onClick={toggleDarkMode}>
          <Moon className="w-6 h-6" />
        </button>
        <button
          onClick={toggleCompact}
          className={`p-2 text-gray-700 hover:bg-gray-100 rounded-lg  justify-center flex items-center space-x-2 ${isCompact ? 'bg-gray-100' : ''}`}
        >
          <LayoutList className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
