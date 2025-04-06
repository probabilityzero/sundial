import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, User, Calendar, ListChecks, Settings, BarChart, Moon, Sun, PanelRightOpen, Home, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { getDisplayName, getAvatarUrl } from '../utils/user-helpers';
import Tooltip from '../components/ui/Tooltip';
import ToggleSwitch from '../components/ui/ToggleSwitch';

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
  const { user, signOut } = useAuthStore();

  // Menu items configuration
  const menuItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/analytics', label: 'Analytics', icon: BarChart },
    { path: '/tasks', label: 'Tasks', icon: ListChecks },
  ];

  useEffect(() => {
    // Close the menu if the user navigates to the profile
    if (location.pathname === '/profile' && isOpen && !isCompact) {
      onClose();
    }
  }, [location, isOpen, onClose, isCompact]);

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Overlay for full menu */}
      <AnimatePresence>
        {isOpen && !isCompact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Compact Menu */}
      {isCompact && (
        <div className="fixed inset-y-0 left-0 w-16 bg-surface border-r border-border z-50 flex flex-col py-4">
          <div className="flex flex-col items-center gap-6 flex-grow">
            {/* App Logo */}
            <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-4">
              <span className="text-primary font-bold text-xl">S</span>
            </div>
            
            {/* Navigation Links */}
            <nav className="flex flex-col items-center gap-4 mt-6">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <Tooltip key={item.path} text={item.label} position="right">
                    <Link 
                      to={item.path}
                      className={`
                        w-10 h-10 flex items-center justify-center rounded-md transition-all duration-200
                        ${isActive 
                          ? 'bg-primary text-primary-contrast' 
                          : 'text-text-secondary hover:bg-surface hover:text-text-primary'}
                      `}
                    >
                      <Icon className="w-5 h-5" />
                    </Link>
                  </Tooltip>
                );
              })}
            </nav>
          </div>
          
          {/* User and Settings */}
          <div className="mt-auto flex flex-col items-center gap-4">
            <Tooltip text="Settings" position="right">
              <Link 
                to="/settings"
                className={`
                  w-10 h-10 flex items-center justify-center rounded-md transition-all duration-200
                  ${location.pathname === '/settings' 
                    ? 'bg-primary text-primary-contrast' 
                    : 'text-text-secondary hover:bg-surface hover:text-text-primary'}
                `}
              >
                <Settings className="w-5 h-5" />
              </Link>
            </Tooltip>
            
            <Tooltip text={darkMode ? "Light Mode" : "Dark Mode"} position="right">
              <button 
                onClick={toggleDarkMode}
                className="w-10 h-10 flex items-center justify-center rounded-md text-text-secondary hover:bg-surface hover:text-text-primary transition-all duration-200"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </Tooltip>
            
            <Tooltip text="Expand Menu" position="right">
              <button 
                onClick={toggleCompact}
                className="w-10 h-10 flex items-center justify-center rounded-md text-text-secondary hover:bg-surface hover:text-text-primary transition-all duration-200"
              >
                <PanelRightOpen className="w-5 h-5" />
              </button>
            </Tooltip>
            
            <Tooltip text="Profile" position="right">
              <Link 
                to="/profile"
                className="w-10 h-10 overflow-hidden rounded-full border-2 border-border flex items-center justify-center mt-2"
              >
                {getAvatarUrl(user) ? (
                  <img 
                    src={getAvatarUrl(user)} 
                    alt="Profile"
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <User className="w-5 h-5 text-text-secondary" />
                )}
              </Link>
            </Tooltip>
          </div>
        </div>
      )}

      {/* Full Menu */}
      <AnimatePresence>
        {(!isCompact || isOpen) && !isCompact && (
          <motion.div
            className="fixed inset-y-0 left-0 w-64 bg-surface shadow-xl z-50 flex flex-col"
            initial={{ x: '-100%' }}
            animate={{ x: isOpen ? 0 : '-100%' }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">S</span>
                </div>
                <h2 className="font-semibold text-text-primary">Sundial</h2>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-md text-text-secondary hover:bg-background transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* User Profile */}
            <div className="p-4 border-b border-border">
              <Link to="/profile" className="flex items-center gap-3" onClick={onClose}>
                <div className="w-12 h-12 rounded-full bg-background overflow-hidden border border-border flex items-center justify-center">
                  {getAvatarUrl(user) ? (
                    <img 
                      src={getAvatarUrl(user)} 
                      alt="Profile"
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <User className="w-6 h-6 text-text-secondary" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-text-primary">{getDisplayName(user) || 'User'}</p>
                  <p className="text-sm text-text-secondary">View profile</p>
                </div>
              </Link>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 p-2 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <Link 
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 my-1 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-primary bg-opacity-10 text-primary' 
                        : 'text-text-secondary hover:bg-background hover:text-text-primary'}
                    `}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            
            {/* Footer */}
            <div className="p-3 border-t border-border">
              <div className="flex justify-between">
                <Link 
                  to="/settings"
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:bg-background hover:text-text-primary transition-all duration-200"
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </Link>
              </div>
              
              {/* Theme Toggle */}
              <div className="mt-2 px-3 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {darkMode ? 
                      <Sun className="w-5 h-5 text-text-secondary" /> : 
                      <Moon className="w-5 h-5 text-text-secondary" />
                    }
                    <span className="font-medium text-text-secondary">
                      {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </span>
                  </div>
                  <ToggleSwitch 
                    isChecked={darkMode} 
                    onChange={toggleDarkMode}
                    size="sm"
                  />
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 mt-2 rounded-lg text-error hover:bg-error hover:bg-opacity-10 transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Log out</span>
              </button>
              
              <button 
                onClick={toggleCompact}
                className="w-full flex items-center justify-between px-3 py-2 mt-2 rounded-lg text-text-secondary hover:bg-background hover:text-text-primary transition-all duration-200 md:flex hidden"
              >
                <div className="flex items-center gap-3">
                  <PanelRightOpen className="w-5 h-5" />
                  <span className="font-medium">Compact View</span>
                </div>
                <ToggleSwitch 
                  isChecked={isCompact} 
                  onChange={toggleCompact}
                  size="sm"
                />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
