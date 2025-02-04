import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, User, Calendar, ListChecks, Settings as SettingIcon, BarChart, Moon, LayoutList } from 'lucide-react';
import { MenuItem } from './MenuItem';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isCompact: boolean;
  toggleCompact: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function SideMenu({ isOpen, onClose, isCompact, toggleCompact, darkMode, toggleDarkMode }: SideMenuProps) {
  const location = useLocation();

  const handleMenuItemClick = () => {
    onClose(); // Close side menu when item is clicked
  };

  const handleCompactToggle = () => {
    onClose(); // Close side menu before toggling compact
    toggleCompact(); // Toggle compact mode in Layout
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } bg-white shadow-lg transition-transform duration-300 ease-in-out z-50 flex flex-col w-64 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
    >
      <div className={`flex-grow flex flex-col p-4 overflow-y-auto justify-between`} >
        <div>
          {!isCompact && (
            <div className="flex justify-end items-center mb-2">
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <Link to="/profile" className={`block mb-4 mx-auto `} onClick={handleMenuItemClick}>
            <div className={`w-20 h-20 rounded-full bg-gray-200 mx-auto overflow-hidden flex items-center justify-center ${darkMode ? 'border border-gray-700' : ''}`}>
              <User className={`w-12 h-12 text-gray-400`} />
            </div>
            <h3 className="text-center font-semibold">John Doe</h3>
          </Link>

          {!isCompact && <hr className="border-gray-200 my-2" />}

          <nav className="flex-grow space-y-2">
            <MenuItem to="/calendar" label="Calendar" icon={Calendar} onClick={handleMenuItemClick} isCompact={isCompact} darkMode={darkMode} />
            <MenuItem to="/analytics" label="History" icon={BarChart} onClick={handleMenuItemClick} isCompact={isCompact} darkMode={darkMode} />
            <MenuItem to="/tasks" label="Tasks" icon={ListChecks} onClick={handleMenuItemClick} isCompact={isCompact} darkMode={darkMode} />
            <hr className="border-gray-200 my-2" />
            <MenuItem to="/settings" label="Settings" icon={SettingIcon} onClick={handleMenuItemClick}  isCompact={isCompact} darkMode={darkMode}/>
          </nav>
        </div>


        <div className="flex items-center justify-between border-t pt-4 mt-4">
          <button
            onClick={handleCompactToggle} // Use handleCompactToggle to close menu and toggle compact
            className={`p-2 text-gray-700 hover:bg-gray-100 rounded-lg  justify-center flex items-center space-x-2 ${isCompact ? 'bg-gray-100' : ''}`}
          >
            <LayoutList className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg  justify-center flex items-center space-x-2"  onClick={toggleDarkMode}>
            <Moon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
