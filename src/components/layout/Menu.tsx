import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, User as UserIcon, Calendar, ListChecks, Settings as SettingIcon, BarChart, Moon, PanelRightOpen, Home } from 'lucide-react';
import { MenuItemList } from '../ui/MenuItemList';
import { MenuItemIcon } from '../ui/MenuItemIcon';
import { motion } from 'framer-motion';
import { MenuItemIconSecondary } from '../ui/MenuItemIconSecondary';
import { useAuthStore } from '../../store/useAuthStore'; // Import useAuthStore
import { getDisplayName, getAvatarUrl } from '../../utils/user-helpers'; // Import helper functions

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
  const { user } = useAuthStore(); // Access user data from the 

  useEffect(() => {
    // Close the menu if the user navigates to the profile
    if (location.pathname === '/profile' && isOpen) {
      onClose();
    }
  }, [location, isOpen, onClose]);

  return (
    <>
      {/* Only show dark background if the menu is open and not compact */}
      {isOpen && !isCompact && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black opacity-50 z-40 transition-opacity duration-200"
        ></div>
      )}

      <motion.div
        className={`fixed inset-y-0 left-0 bg-white shadow-xl z-50 flex w-64 flex-col`}
        initial={{ x: '-100%' }} // Start off-screen to the left
        animate={{ x: isOpen ? 0 : '-100%' }} // Animate to 0 if open, or off-screen if closed
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex-grow flex-col overflow-y-auto justify-between transition-all duration-300">
          {!isCompact && (
            <div className="flex items-center p-2 pb-0">
              <button
                className="text-gray-600 p-1 rounded-md focus:outline-none hover:bg-gray-200 active:bg-gray-300"
                onClick={onClose}
              >
                <X className="h-5 w-5 stroke-[1]" />
              </button>
            </div>
          )}

          <Link to="/profile" className={`block px-auto`} onClick={onClose}>
            <div className={`w-20 h-20 rounded-full bg-gray-200 mx-auto overflow-hidden flex items-center justify-center`}>
              {getAvatarUrl(user) ? (
                <img src={getAvatarUrl(user)} alt="Profile Picture" className="w-full h-full object-cover rounded-full" />
              ) : (
                <UserIcon className={`w-12 h-12 text-gray-400`} />
              )}
            </div>
            <h3 className="text-center font-semibold">{getDisplayName(user) || 'User'}</h3>
          </Link>
          <div className="mt-2"></div>

          <nav className="flex flex-col">
            <MenuItemList to="/" label="Home" icon={Home} onClick={onClose} isCompact={isCompact} />
            <MenuItemList to="/calendar" label="Calendar" onClick={onClose} icon={Calendar} isCompact={isCompact} />
            <MenuItemList to="/analytics" label="History" onClick={onClose} icon={BarChart} isCompact={isCompact} />
            <MenuItemList to="/tasks" label="Tasks" onClick={onClose} icon={ListChecks} isCompact={isCompact} />
            <div className="mt-2"></div>

          </nav>
        </div>

        <div className="flex items-center justify-between border-t p-2">
          <Link to="/settings" className={`justify-center rounded-md transition-colors block`}>
            <MenuItemIconSecondary onClick={onClose} isActive={location.pathname === '/settings'} icon={<SettingIcon className="w-6 h-6" />} />
          </Link>

          <MenuItemIconSecondary
            onClick={() => {
              toggleCompact();
              onClose();
            }}          
            isActive={isCompact}
            icon={<PanelRightOpen className="w-6 h-6" />}
            className="hidden md:block"
          />

          <MenuItemIconSecondary
            onClick={toggleDarkMode}
            icon={<Moon className="w-6 h-6" />}
            className="block md:hidden"
          />
        </div>
      </motion.div>
    </>
  );
}
