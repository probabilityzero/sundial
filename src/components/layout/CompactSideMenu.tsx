import React from 'react';
import { Moon, LayoutList, User, Calendar, BarChart, ListChecks, Settings as SettingIcon, ArrowLeft, Menu as MenuIcon, Home } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSideMenu } from '../../store/useSideMenu';

interface CompactSideMenuProps {
  isCompact: boolean;
  toggleCompact: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function CompactSideMenu({ isCompact, toggleCompact, darkMode, toggleDarkMode }: CompactSideMenuProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === '/';
  const { openMenu } = useSideMenu();

  const menuItemStyle = {
    borderRadius: '0.375rem',
    margin: '0.25rem 0',
    display: 'flex',
    justifyContent: 'center',
    padding: '0.5rem',
    hoverBackgroundColor: '#f9fafb',
  };
  const handleBackClick = () => {
    navigate('/');
  };
  const handleOpenMenu = () => {
    openMenu();
    toggleCompact(); // close compact menu when opening full menu
  };

  return (
    <div className={`fixed inset-y-0 left-0 transform ${isCompact ? 'translate-x-0' : '-translate-x-full'} bg-white transition-transform duration-300 ease-in-out z-50 flex flex-col w-14 shadow-none`}> {/* Removed shadow-lg -> shadow-none */}
      <div className="flex-grow flex flex-col p-1 pt-4">
        <div className="flex justify-center mb-2">
          {isDashboard ? (
            <button
              onClick={handleOpenMenu}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleBackClick}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
        </div>


        <Link to="/profile" className="block mb-1 mx-auto " >
          <div className={`w-10 h-10 rounded-full bg-gray-200 mx-auto overflow-hidden flex items-center justify-center ${darkMode ? 'border border-gray-700' : ''}`}>
            <User className={`w-5 h-5 text-gray-400`} />
          </div>
        </Link>

        <nav className="flex-grow space-y-0.5 mt-2">
          <Link to="/" style={{...menuItemStyle, border: 'none'}} className={`flex justify-center rounded-md transition-colors hover:bg-gray-50 block ${location.pathname === '/' ? 'bg-gray-100' : ''}`}> {/* Removed border */}
            <Home className="w-5 h-5" />
          </Link>
          <Link to="/calendar" style={{...menuItemStyle, border: 'none'}} className={`flex justify-center rounded-md transition-colors hover:bg-gray-50 block ${location.pathname === '/calendar' ? 'bg-gray-100' : ''}`}> {/* Removed border */}
            <Calendar className="w-5 h-5" />
          </Link>
          <Link to="/analytics" style={{...menuItemStyle, border: 'none'}} className={`flex justify-center rounded-md transition-colors hover:bg-gray-50 block ${location.pathname === '/analytics' ? 'bg-gray-100' : ''}`}> {/* Removed border */}
            <BarChart className="w-5 h-5" />
          </Link>
          <Link to="/tasks" style={{...menuItemStyle, border: 'none'}} className={`flex justify-center rounded-md transition-colors hover:bg-gray-50 block ${location.pathname === '/tasks' ? 'bg-gray-100' : ''}`}> {/* Removed border */}
            <ListChecks className="w-5 h-5" />
          </Link>
          <div className="my-2"></div> {/* Added gap before settings */}
          <Link to="/settings" style={{...menuItemStyle, border: 'none'}} className={`flex justify-center rounded-md transition-colors hover:bg-gray-50 block ${location.pathname === '/settings' ? 'bg-gray-100' : ''}`}> {/* Removed border */}
            <SettingIcon className="w-5 h-5" />
          </Link>
        </nav>
      </div>
      <div className="p-2 flex flex-col border-t p-1">
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
