import React, { useState } from 'react';
import { Moon, LayoutList, User as UserIcon, Calendar, BarChart, ListChecks, Settings as SettingIcon, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { MenuItemIcon } from '../components/ui/MenuItemIcon';
import { MenuItemIconSecondary } from '../components/ui/MenuItemIconSecondary';
import { useAuthStore } from '../store/useAuthStore';
import { getAvatarUrl } from '../utils/user-helpers';
import Tooltip from '../components/ui/Tooltip'; // Import Tooltip

interface MenuCompactProps {
  isCompact: boolean;
  toggleCompact: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onClose: () => void;
}

export function MenuCompact ({ isCompact, toggleCompact, darkMode, toggleDarkMode, onClose }: MenuCompactProps) {
  const location = useLocation();
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const { user } = useAuthStore();

  const MenuItemClass = 'flex rounded-md transition-colors block py-2';

  const getTooltipPosition = (path: string) => (location.pathname === path ? 'text-blue-500' : 'text-gray-500');

  return (
    <div
      className={`fixed top-12 inset-y-0 left-0 transform ${isCompact || isMainMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        backdrop-filter backdrop-blur-xl transition-transform duration-300 ease-in-out z-40 flex flex-col ${isCompact ? 'w-14' : 'w-64'}
        rounded-none shadow-md`}
    >
      <nav className="flex-grow flex flex-col items-center">
        <Link to="/" className={MenuItemClass} title="Home">
          <Tooltip text="Home" position="right">
            <div className="flex items-center justify-center">
              <MenuItemIcon isActive={location.pathname === '/'} icon={<Home className="w-6 h-6" />} />
              {!isCompact && <span className="ml-2">Home</span>}
            </div>
          </Tooltip>
        </Link>

        <Link to="/calendar" className={MenuItemClass} title="Calendar">
          <Tooltip text="Calendar" position="right">
            <div className="flex items-center justify-center">
              <MenuItemIcon isActive={location.pathname === '/calendar'} icon={<Calendar className="w-6 h-6" />} />
              {!isCompact && <span className="ml-2">Calendar</span>}
            </div>
          </Tooltip>
        </Link>

        <Link to="/analytics" className={MenuItemClass} title="Analytics">
          <Tooltip text="Analytics" position="right">
            <div className="flex items-center justify-center">
              <MenuItemIcon isActive={location.pathname === '/analytics'} icon={<BarChart className="w-6 h-6" />} />
              {!isCompact && <span className="ml-2">Analytics</span>}
            </div>
          </Tooltip>
        </Link>

        <Link to="/tasks" className={MenuItemClass} title="Tasks">
          <Tooltip text="Tasks" position="right">
            <div className="flex items-center justify-center">
              <MenuItemIcon isActive={location.pathname === '/tasks'} icon={<ListChecks className="w-6 h-6" />} />
              {!isCompact && <span className="ml-2">Tasks</span>}
            </div>
          </Tooltip>
        </Link>

        <div className="my-2 border-t"></div>
      </nav>

      <div className="flex flex-col border-t">
        <Link to="/profile" className="block pb-1 p-2" title="Profile">
          <Tooltip text="Profile" position="right">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center p-2 justify-center">
              {getAvatarUrl(user) ? (
                <img src={getAvatarUrl(user)} alt="Profile Picture" className="w-full h-full object-cover rounded-full" />
              ) : (
                <UserIcon className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </Tooltip>
        </Link>

        <Link to="/settings" className="flex justify-center p-2 pt-1 rounded-md transition-colors block" title="Settings">
          <Tooltip text="Settings" position="right">
            <MenuItemIconSecondary isActive={location.pathname === '/settings'} icon={<SettingIcon className="w-6 h-6" />} />
          </Tooltip>
        </Link>
      </div>
    </div>
  );
}
