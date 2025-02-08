import React, { useState } from 'react';
import { Moon, LayoutList, User, Calendar, BarChart, ListChecks, Settings as SettingIcon, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { MenuItemIcon } from './MenuItemIcon';
import { MenuItemIconSecondary } from './MenuItemIconSecondary';

interface MenuCompactProps {
  isCompact: boolean;
  toggleCompact: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function MenuCompact ({ isCompact, toggleCompact, darkMode, toggleDarkMode }: MenuCompactProps) {
  const location = useLocation();
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false); // State to control the main menu

  const menuItemStyle = {
    borderRadius: '0.375rem',
    display: 'flex',
    justifyContent: 'center',
    padding: '0.5rem 1rem', // Add padding for clickable area
  };

  const handleCompactToggle = () => {
    toggleCompact(); // Toggle compact mode
    setIsMainMenuOpen(isMainMenuOpen); // Toggle main menu state
  };

  return (
    <div
      className={`fixed top-12 inset-y-0 left-0 transform ${isCompact || isMainMenuOpen ? 'translate-x-0' : '-translate-x-full'}
       backdrop-filter backdrop-blur-xl transition-transform duration-300 ease-in-out z-40 flex flex-col ${isCompact ? 'w-14' : 'w-64'}
      rounded-none shadow-md`}
    >
      <div className="flex-grow flex flex-col p-1 pt-3">
        <Link to="/profile" className="block mb-1 mx-auto ">
          <div className={`w-10 h-10 rounded-full bg-gray-200 mx-auto overflow-hidden flex items-center justify-center`}>
            <User className={`w-5 h-5 text-gray-400`} />
          </div>
        </Link>
        <nav className="flex-grow space-y-1 mt-1">
          <Link to="/" style={menuItemStyle} className={`flex justify-center rounded-md transition-colors block`}>
            <MenuItemIcon isActive={location.pathname === '/'} icon={<Home className="w-6 h-6" />} />
          </Link>
          <Link to="/calendar" style={menuItemStyle} className={`flex justify-center rounded-md transition-colors block`}>
            <MenuItemIcon isActive={location.pathname === '/calendar'} icon={<Calendar className="w-6 h-6" />} />
          </Link>
          <Link to="/analytics" style={menuItemStyle} className={`flex justify-center rounded-md transition-colors block`}>
            <MenuItemIcon isActive={location.pathname === '/analytics'} icon={<BarChart className="w-6 h-6" />} />
          </Link>
          <Link to="/tasks" style={menuItemStyle} className={`flex justify-center rounded-md transition-colors block`}>
            <MenuItemIcon isActive={location.pathname === '/tasks'} icon={<ListChecks className="w-6 h-6" />} />
          </Link>
          <div className="my-2 border-t"></div>
        </nav>
      </div>

      <div className="flex flex-col border-t p-2">
      <Link to="/settings" className={`flex justify-center rounded-md transition-colors block`}>
            <MenuItemIconSecondary isActive={location.pathname === '/settings'} icon={<SettingIcon className="w-6 h-6" />} />
      </Link>
        {/* <MenuItemIconSecondary onClick={toggleDarkMode} icon={<Moon className="w-6 h-6" />} />
        <MenuItemIconSecondary
          onClick={handleCompactToggle} // Use the updated handleCompactToggle function
          isActive={isCompact}
          icon={<LayoutList className="w-6 h-6" />}
        /> */}
      </div>
    </div>
  );
}
