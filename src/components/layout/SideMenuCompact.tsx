import React from 'react';
import { Moon, LayoutList, User, Calendar, BarChart, ListChecks, Settings as SettingIcon, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { IconButton } from './IconButton'; 
import { SecondaryIconButton } from './IconButtonSecondary'; 

interface CompactSideMenuProps {
  isCompact: boolean;
  toggleCompact: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function CompactSideMenu({ isCompact, toggleCompact, darkMode, toggleDarkMode }: CompactSideMenuProps) {
  const location = useLocation();

  const menuItemStyle = {
    borderRadius: '0.375rem',
    margin: '0.25rem 0',
    display: 'flex',
    justifyContent: 'center',
    padding: '0.5rem',
  };

  return (
    <div 
      className={`fixed top-14 inset-y-0 left-0 transform ${isCompact ? 'translate-x-0' : '-translate-x-full'} 
      bg-white transition-transform duration-300 ease-in-out z-40 flex flex-col ${isCompact ? 'w-14' : 'w-64'} 
      border rounded-none shadow-none`}
    >
      <div className="flex-grow flex flex-col p-1 pt-3">
        <Link to="/profile" className="block mb-1 mx-auto ">
          <div className={`w-10 h-10 rounded-full bg-gray-200 mx-auto overflow-hidden flex items-center justify-center`}>
            <User className={`w-5 h-5 text-gray-400`} />
          </div>
        </Link>
        <nav className="flex-grow space-y-0.5 mt-2">
          <Link to="/" style={menuItemStyle} className={`flex justify-center rounded-md transition-colors block`}>
            <IconButton isActive={location.pathname === '/'} icon={<Home className="w-6 h-6" />} />
          </Link>
          <Link to="/calendar" style={menuItemStyle} className={`flex justify-center rounded-md transition-colors block`}>
            <IconButton isActive={location.pathname === '/calendar'} icon={<Calendar className="w-6 h-6" />} />
          </Link>
          <Link to="/analytics" style={menuItemStyle} className={`flex justify-center rounded-md transition-colors block`}>
            <IconButton isActive={location.pathname === '/analytics'} icon={<BarChart className="w-6 h-6" />} />
          </Link>
          <Link to="/tasks" style={menuItemStyle} className={`flex justify-center rounded-md transition-colors block`}>
            <IconButton isActive={location.pathname === '/tasks'} icon={<ListChecks className="w-6 h-6" />} />
          </Link>
          <div className="my-2 border-t"></div>
          <Link to="/settings" style={menuItemStyle} className={`flex justify-center rounded-md transition-colors block`}>
            <IconButton isActive={location.pathname === '/settings'} icon={<SettingIcon className="w-6 h-6" />} />
          </Link>
        </nav>
      </div>
      
      <div className="flex flex-col space-y-0.5 border-t p-2.5">
        <SecondaryIconButton onClick={toggleDarkMode} icon={<Moon className="w-6 h-6" />} />
        <SecondaryIconButton
          onClick={toggleCompact}
          isActive={isCompact}
          icon={<LayoutList className="w-6 h-6" />}
        />
      </div>
    </div>
  );
}
