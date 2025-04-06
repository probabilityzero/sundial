import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, User, Calendar, ListChecks, Settings, BarChart, Moon, Sun, PanelRightOpen, Home, LogOut, Clock, Book, Target, Trophy, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { getDisplayName, getAvatarUrl } from '../utils/user-helpers';
import Tooltip from '../components/ui/Tooltip';
import ToggleSwitch from '../components/ui/ToggleSwitch';
import { SettingsPopup } from '../components/Settings/SettingsPopup';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  isCompact: boolean;
  toggleCompact: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function Menu({ isOpen, onClose, isCompact, toggleCompact, darkMode, toggleDarkMode }: MenuProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuthStore();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Enhanced menu items configuration with more options
  const menuItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/tasks', label: 'Tasks', icon: ListChecks },
    { path: '/timer', label: 'Focus Timer', icon: Clock },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/analytics', label: 'Analytics', icon: BarChart },
    { path: '/journal', label: 'Journal', icon: Book },
    { path: '/goals', label: 'Goals', icon: Target },
    { path: '/achievements', label: 'Achievements', icon: Trophy },
    { path: '/insights', label: 'Insights', icon: Sparkles },
  ];

  // Only close menu on navigation for mobile or when explicitly clicking a link
  useEffect(() => {
    // Only close settings popup when navigating away
    if (isSettingsOpen) {
      setIsSettingsOpen(false);
    }
  }, [location, isSettingsOpen]);

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      onClose(); // Close menu after logout
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // Handle settings click
  const handleSettingsClick = (e: React.MouseEvent) => {
    if (isMobile) {
      // On mobile, allow default navigation to settings page
      return;
    }
    
    e.preventDefault();
    setIsSettingsOpen(true);
  };

  // Stop propagation for settings popup to prevent it from closing when clicking inside
  const handleSettingsPopupClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };


  return (
    <>
      {/* Settings Popup - isolated from other components to prevent overlay issues */}
      {isSettingsOpen && !isMobile && (
        <SettingsPopup 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
          onClick={handleSettingsPopupClick}
        />
      )}
    
      {/* Overlay for full menu */}
      <AnimatePresence>
        {isOpen && !isCompact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Compact Menu - Transparent background */}
      {isCompact && (
        <div className="fixed inset-y-0 left-0 w-16 bg-background/80 backdrop-blur-sm border-r border-border z-50 flex flex-col py-4">
          <div className="flex flex-col items-center gap-4">
            {/* App Logo */}
            <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
              <span className="text-primary font-bold text-xl">S</span>
            </div>
            
            {/* User Profile - Moved to top in compact view */}
            <Link 
              to="/profile"
              className="w-10 h-10 overflow-hidden rounded-full border-2 border-border flex items-center justify-center"
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
          </div>
          
          {/* Navigation Links - Scrollable if needed */}
          <nav className="flex-1 flex flex-col items-center gap-3 mt-6 overflow-y-auto py-2">
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
          
          {/* Controls at bottom, Justified to corners */}
          <div className="mt-auto flex flex-col items-center gap-3 pt-4">
            <div className="flex w-full justify-between px-3">
              <Tooltip text={darkMode ? "Light Mode" : "Dark Mode"} position="right">
                <button 
                  onClick={toggleDarkMode}
                  className="w-9 h-9 flex items-center justify-center rounded-md text-text-secondary hover:bg-surface hover:text-text-primary transition-all duration-200"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </Tooltip>
              
              <Tooltip text="Settings" position="right">
                <Link 
                  to="/settings"
                  onClick={handleSettingsClick}
                  className={`
                    w-9 h-9 flex items-center justify-center rounded-md transition-all duration-200
                    ${location.pathname === '/settings' 
                      ? 'bg-primary text-primary-contrast' 
                      : 'text-text-secondary hover:bg-surface hover:text-text-primary'}
                  `}
                >
                  <Settings className="w-5 h-5" />
                </Link>
              </Tooltip>
            </div>
            
            <Tooltip text="Expand Menu" position="right">
              <button 
                onClick={toggleCompact}
                className="w-10 h-10 flex items-center justify-center rounded-md text-text-secondary hover:bg-surface hover:text-text-primary transition-all duration-200"
              >
                <PanelRightOpen className="w-5 h-5" />
              </button>
            </Tooltip>
          </div>
        </div>
      )}

      {/* Full Menu - Transparent background */}
      <AnimatePresence>
        {(!isCompact || isOpen) && !isCompact && (
          <motion.div
            className="fixed inset-y-0 left-0 w-64 bg-background border-r border-border z-50 flex flex-col"
            initial={{ x: '-100%' }}
            animate={{ x: isOpen ? 0 : '-100%' }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >  
            {/* User Profile - Enhanced and bigger */}
            <div className="px-4 py-5 border-b border-border">
              <Link to="/profile" className="flex flex-col items-center" onClick={onClose}>
                <div className="w-20 h-20 rounded-full bg-surface overflow-hidden border-2 border-border flex items-center justify-center mb-3">
                  {getAvatarUrl(user) ? (
                    <img 
                      src={getAvatarUrl(user)} 
                      alt="Profile"
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <User className="w-10 h-10 text-text-secondary" />
                  )}
                </div>
                <h3 className="font-medium text-lg text-text-primary text-center">{getDisplayName(user) || 'User'}</h3>
                <p className="text-sm text-text-secondary mt-1">View profile</p>
              </Link>
            </div>
            
            {/* Navigation - Scrollable container for many items */}
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
                        ? 'bg-primary/20 text-primary' 
                        : 'text-text-secondary hover:bg-surface/50 hover:text-text-primary'}
                    `}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={toggleDarkMode}
                className="w-10 h-10 flex items-center justify-center rounded-md text-text-secondary hover:bg-surface/50 hover:text-text-primary transition-all duration-200"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </nav>
            
            {/* Footer with justified controls */}
            <div className="p-3 border-t border-border">
              {/* Controls at bottom, spread to corners */}
              <div className="flex justify-between items-center">

                <Link
                  to="/settings"
                  onClick={handleSettingsClick}
                  className="w-10 h-10 flex items-center justify-center rounded-md text-text-secondary hover:bg-surface/50 hover:text-text-primary transition-all duration-200"
                >
                  <Settings className="w-5 h-5" />
                </Link>

                <button
                  onClick={toggleCompact}
                  className="w-10 h-10 flex items-center justify-center rounded-md text-text-secondary hover:bg-surface/50 hover:text-text-primary transition-all duration-200 md:flex hidden"
                >
                  <PanelRightOpen className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
