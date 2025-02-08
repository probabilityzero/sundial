import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, User, Calendar, ListChecks, Settings as SettingIcon, BarChart, Moon, PanelRightOpen, Home } from 'lucide-react';
import { MenuItem } from './SideMenuItem';
import { IconButton } from './IconButton'; 
import { IconButtonSecondary } from './IconButtonSecondary'; 

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
      className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      bg-white shadow-xl transition-transform duration-300 ease-in-out z-50 flex ${isCompact ? 'w-16' : 'w-64'} flex-col`}
    >
      <div className={`flex-grow flex flex-col p-1 overflow-y-auto justify-between transition-all duration-300`}>
        <div>
          {!isCompact && (
            <div className="flex items-center p-1.5 mb-0 pb-0">
              <IconButton onClick={onClose} icon={<X className="w-5 h-5" />} />
            </div>
          )}

          <Link to="/profile" className={`block mb-4 mx-auto`} onClick={handleMenuItemClick}>
            <div className={`w-20 h-20 rounded-full bg-gray-200 mx-auto overflow-hidden flex items-center justify-center`}>
              <User className={`w-12 h-12 text-gray-400`} />
            </div>
            {!isCompact && <h3 className="text-center font-semibold">John Doe</h3>}
          </Link>

          {!isCompact && <hr className="border-gray-200 my-2" />}

          <nav className="flex-grow font-semibold space-y-2">
            <MenuItem to="/" label="Home" icon={Home} onClick={handleMenuItemClick} isCompact={isCompact} />
            <MenuItem to="/calendar" label="Calendar" icon={Calendar} onClick={handleMenuItemClick} isCompact={isCompact} />
            <MenuItem to="/analytics" label="History" icon={BarChart} onClick={handleMenuItemClick} isCompact={isCompact} />
            <MenuItem to="/tasks" label="Tasks" icon={ListChecks} onClick={handleMenuItemClick} isCompact={isCompact} />
            <hr className="border-gray-200 my-2" />
            <MenuItem to="/settings" label="Settings" icon={SettingIcon} onClick={handleMenuItemClick}  isCompact={isCompact} />
          </nav>
        </div>

        <div className="flex items-center justify-between border-t p-1">
          <IconButtonSecondary
            onClick={handleCompactToggle} 
            isActive={isCompact}
            icon={<PanelRightOpen className="w-6 h-6" />}
          />
          <IconButtonSecondary onClick={toggleDarkMode} icon={<Moon className="w-6 h-6" />} />
        </div>
      </div>
    </div>
  );
}
