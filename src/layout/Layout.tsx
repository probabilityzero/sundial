import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Menu } from './Menu';
import { MenuCompact } from './MenuCompact';
import { useSideMenu } from '../store/useSideMenu';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/tasks': 'Tasks',
  '/calendar': 'Calendar',
  '/analytics': 'Analytics',
  '/profile': 'Profile',
  '/settings': 'Settings',
};

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { isMenuOpen, closeMenu } = useSideMenu();
  const [isCompactMenu, setIsCompactMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Check system preferences for dark mode on initial load
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
    document.body.classList.toggle('dark-theme', prefersDark);
  }, []);

  const toggleCompactMenu = () => setIsCompactMenu(prev => !prev);
  
  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      document.body.classList.toggle('dark-theme', newMode);
      return newMode;
    });
  };
  
  const pageTitle = PAGE_TITLES[location.pathname] || 'Dashboard';

  return (
    <div className="min-h-dvh bg-background text-text-primary flex">
      {/* Menu Components */}
      {isCompactMenu ? (
        <MenuCompact
          isCompact={isCompactMenu}
          toggleCompact={toggleCompactMenu}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          onClose={closeMenu} // Add this missing prop
        />
      ) : (
        <Menu
          isOpen={isMenuOpen}
          onClose={closeMenu}
          isCompact={isCompactMenu}
          toggleCompact={toggleCompactMenu}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}

      {/* Main Content Area */}
      <motion.div
        className="flex-grow flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ 
          marginLeft: isCompactMenu ? '4rem' : '0' 
        }}
      >
        <Header 
          pageTitle={pageTitle} 
          isCompact={isCompactMenu} 
          toggleCompactMenu={toggleCompactMenu} 
        />
        <main className="mt-14 p-4 md:p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </motion.div>

      {/* Overlay */}
      {isMenuOpen && !isCompactMenu && (
        <motion.div
          className="fixed w-full h-full bg-black opacity-25 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={closeMenu}
        />
      )}
    </div>
  );
}
