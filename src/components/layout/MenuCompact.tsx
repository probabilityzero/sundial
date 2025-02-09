import React, { useState } from 'react';
import { Moon, LayoutList, User as UserIcon, Calendar, BarChart, ListChecks, Settings as SettingIcon, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { MenuItemIcon } from '../ui/MenuItemIcon';
import { MenuItemIconSecondary } from '../ui/MenuItemIconSecondary';
import { useAuthStore } from '../../store/useAuthStore';
import { getAvatarUrl } from '../../utils/user-helpers'; // Import getAvatarUrl

interface MenuCompactProps {
  isCompact: boolean;
  toggleCompact: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function MenuCompact ({ isCompact, toggleCompact, darkMode, toggleDarkMode }: MenuCompactProps) {
  const location = useLocation();
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false); // State to control the main menu
  const { user } = useAuthStore(); // Access user data

  const MenuItemClass = 'flex justify-center rounded-md transition-colors block py-2';

  const handleCompactToggle = () => {
    toggleCompact(); 
    setIsMainMenuOpen(isMainMenuOpen); 
  };

  return (
    <div
      className={`fixed top-12 inset-y-0 left-0 transform ${isCompact || isMainMenuOpen ? 'translate-x-0' : '-translate-x-full'}
       backdrop-filter backdrop-blur-xl transition-transform duration-300 ease-in-out z-40 flex flex-col ${isCompact ? 'w-14' : 'w-64'}
      rounded-none shadow-md`}
    >
        <nav className="flex-grow flex-grow flex flex-col p-2">
          <Link to="/" className={MenuItemClass} title="Home">
            <MenuItemIcon isActive={location.pathname === '/'} icon={<Home className="w-6 h-6" />} />
          </Link>
          <Link to="/calendar" className={MenuItemClass} title="Calendar">
            <MenuItemIcon isActive={location.pathname === '/calendar'} icon={<Calendar className="w-6 h-6" />} />
          </Link>
          <Link to="/analytics" className={MenuItemClass} title="Analytics">
            <MenuItemIcon isActive={location.pathname === '/analytics'} icon={<BarChart className="w-6 h-6" />} />
          </Link>
          <Link to="/tasks" className={MenuItemClass} title="Tasks">
            <MenuItemIcon isActive={location.pathname === '/tasks'} icon={<ListChecks className="w-6 h-6" />} />
          </Link>
          <div className="my-2 border-t"></div>
        </nav>

      <div className="flex flex-col border-t">
        <Link to="/profile" className="block pb-1 p-2 " title="Profile">
          <div className={`w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center p-2 justify-center`}>
            {getAvatarUrl(user) ? (
              <img src={getAvatarUrl(user)} alt="Profile Picture" className="w-full h-full object-cover rounded-full" />
            ) : (
              <UserIcon className={`w-5 h-5 text-gray-400`} />
            )}
          </div>
        </Link>

        <Link to="/settings" className={`flex justify-center p-2 pt-1 rounded-md transition-colors block`} title="Settings">
          <MenuItemIconSecondary isActive={location.pathname === '/settings'} icon={<SettingIcon className="w-6 h-6" />} />
        </Link>
      </div>
    </div>
  );
}
