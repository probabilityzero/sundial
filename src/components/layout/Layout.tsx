import React from 'react';
import { Header } from './Header';
import { Menu } from './Menu';
import { MenuCompact } from './MenuCompact';
import { useSideMenu } from '../../store/useSideMenu';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const PAGE_TITLES: Record<string, string> = {
  '/': 'Session',
  '/tasks': 'Tasks',
  '/calendar': 'Calendar',
  '/report': 'Report',
  '/profile': 'Profile',
  '/settings': 'Settings',
};

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { isMenuOpen, closeMenu } = useSideMenu();
  const [isCompactMenu, setIsCompactMenu] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleCompactMenu = () => setIsCompactMenu(prev => !prev);
  const toggleDarkMode = () => setDarkMode(prev => !prev);
  const pageTitle = PAGE_TITLES[location.pathname] || 'Session';

  return (
    <main className="min-h-screen bg-gray-50 flex">
      {/* Menu Components */}
      {isCompactMenu ? (
        <MenuCompact
          isCompact={isCompactMenu}
          toggleCompact={toggleCompactMenu}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
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
      <div
        className={`
          flex-grow 
          flex 
          flex-col 
          ${isCompactMenu ? 'ml-14' : 'ml-0'} 
          transition-margin 
          duration-300
        `}
      >
        <Header 
          pageTitle={pageTitle} 
          isCompact={isCompactMenu} 
          toggleCompactMenu={toggleCompactMenu} 
        />
        <main>
          <div className="mt-12">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <motion.div
          className="fixed w-full h-full bg-black opacity-25 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={closeMenu}
        />
      )}
    </main>
  );
}
