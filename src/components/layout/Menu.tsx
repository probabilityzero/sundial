import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, User, Calendar, ListChecks, Settings as SettingIcon, BarChart, Moon, PanelRightOpen, Home } from 'lucide-react';
import { MenuItemList } from './MenuItemList';
import { MenuItemIcon } from './MenuItemIcon'; 
import { MenuItemIconSecondary } from './MenuItemIconSecondary'; 

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  isCompact: boolean;
  toggleCompact: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}


export function Menu({ isOpen, onClose, isCompact, toggleCompact, darkMode, toggleDarkMode }: MenuProps) {
  const location = useLocation();

  const menuItemClass = 'p-2 py-1';

  const handleMenuItemClick = () => {
    onClose(); 
  };

  const handleCompactToggle = () => {
    onClose(); 
    toggleCompact();
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      bg-white shadow-xl transition-transform duration-200 ease-in-out z-50 flex w-64 flex-col`}
    >
      <div className={`flex-grow flex-col overflow-y-auto justify-between transition-all duration-300`}>
          {!isCompact && (
            <div className="flex items-center p-2 pb-0">
              <MenuItemIcon onClick={onClose} icon={<X className="w-5 h-5" />} />
            </div>
          )}

          <Link to="/profile" className={`block px-auto`} onClick={handleMenuItemClick}>
            <div className={`w-20 h-20 rounded-full bg-gray-200 mx-auto overflow-hidden flex items-center justify-center`}>
              <User className={`w-12 h-12 text-gray-400`} />
            </div>
            <h3 className="text-center font-semibold">John Doe</h3>
          </Link>
          <div className="my-2 border-t"></div>

          <nav className="flex flex-col font-semibold">
            <Link to="/" className={menuItemClass}>
              <MenuItemList to="/" label="Home" icon={Home} onClick={handleMenuItemClick} isCompact={isCompact} />
            </Link>
            <Link to="/calendar" className={menuItemClass}>
              <MenuItemList to="/calendar" label="Calendar" icon={Calendar} onClick={handleMenuItemClick} isCompact={isCompact} />
            </Link>
            <Link to="/analytics" className={menuItemClass}>
              <MenuItemList to="/analytics" label="History" icon={BarChart} onClick={handleMenuItemClick} isCompact={isCompact} />
            </Link>
            <Link to="/tasks" className={menuItemClass}>
              <MenuItemList to="/tasks" label="Tasks" icon={ListChecks} onClick={handleMenuItemClick} isCompact={isCompact} />
            </Link>
            <hr className="border-gray-200 my-1" />
            </nav>

          </div>

        <div className="flex items-center justify-between border-t p-2">
          <Link to="/settings" className={`flex justify-center rounded-md transition-colors block`}>
                <MenuItemIconSecondary isActive={location.pathname === '/settings'} icon={<SettingIcon className="w-6 h-6" />} />
          </Link>
          <MenuItemIconSecondary
            onClick={handleCompactToggle}
            isActive={isCompact}
            icon={<PanelRightOpen className="w-6 h-6" />}
            className="hidden md:block" // Shows on 'md' and larger screens only
          />

          <MenuItemIconSecondary
            onClick={toggleDarkMode}
            icon={<Moon className="w-6 h-6" />}
            className="block md:hidden" // Shows only on 'sm' screens and below
          />

      </div>
    </div>
  );
}
